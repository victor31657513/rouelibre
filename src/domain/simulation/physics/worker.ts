/**
 * Web worker entry point driving the peloton physics simulation via Rapier.
 *
 * Extension: expose new message types to adjust parameters at runtime without
 * blocking the main thread.
 */
import * as RAPIER from '@dimforge/rapier3d-compat'
import { MathUtils, Vector3 } from 'three'
import { PathSpline, smoothLimitAngle, YawState } from '../../route/pathSpline'
import {
  adjustTargetSpeedForSlope,
  computeCorneringSpeedFromEnvelope,
  computeLengthRatioRange,
  computeOffsetSegmentLength,
  computeTargetSpeedCompensation,
  projectWorldDistanceOntoCenterline,
  wrapDistance,
} from './speedControl'
import {
  computeCurvatureEnvelope,
  computeNeighborBounds,
  computeSignedCurvature,
  constrainOffsetWithinRate,
  evaluateOffsetCandidates,
  generateOffsetCandidates,
  steerOffsetTowardTarget,
} from './riderPathing'
import type { OffsetCandidateResult, PathBoundaryMode } from './riderPathing'
import { draftingFactor, powerDemand, solveVelocityFromPower } from './aero'
import { computeAheadSampleDistance } from './lookAhead'
import {
  DEFAULT_WORKER_PARAMS,
  type SimulationParameterOverrides,
} from './workerParams'

let world: RAPIER.World
let N = 0
// buffer envoyé au thread principal : [s, t, h, yaw]*N
let state: Float32Array
let bodies: RAPIER.RigidBody[] = []
let speeds: Float32Array
let progress: Float32Array
let offsets: Float32Array
let yawRates: Float32Array
let commandedTargetSpeeds: Float32Array
let lateralDecisions: OffsetCandidateResult[] = []
let noiseGenerators: Array<() => number> = []
let riderMasses: Float32Array
let riderCdA: Float32Array
let riderMaxPower: Float32Array
let riderPreferredSpeeds: Float32Array
let riderReactionTimes: Float32Array
let riderNoiseSigma: Float32Array
let riderPowerWeights: Float32Array
let riderGapWeights: Float32Array
let riderRoles: Int16Array
let riderPoses: RiderPose[] = []
let arcProgress: Float32Array

let laneWidth = 1
let roadWidth = 8
let margin = 0
let maxOffset = Infinity

// trajectoire lissée
let spline: PathSpline
let totalLength = 0
let pathBoundaryMode: PathBoundaryMode = 'loop'

// paramètres ajustables
let lookAhead = DEFAULT_WORKER_PARAMS.lookAhead
let maxYawRate = DEFAULT_WORKER_PARAMS.maxYawRate
let maxYawAccel = DEFAULT_WORKER_PARAMS.maxYawAccel
let minRadius = DEFAULT_WORKER_PARAMS.minRadius
let maxTargetSpeed = DEFAULT_WORKER_PARAMS.maxTargetSpeed
let minTargetSpeed = DEFAULT_WORKER_PARAMS.minTargetSpeed
// Accélérations réalistes pour un peloton cycliste
let maxAcceleration = DEFAULT_WORKER_PARAMS.maxAcceleration
let maxDeceleration = DEFAULT_WORKER_PARAMS.maxDeceleration
// Smoothing & rate limits sur la consigne de vitesse
let targetSpeedDamping = DEFAULT_WORKER_PARAMS.targetSpeedDamping
let targetRiseRateLimit = DEFAULT_WORKER_PARAMS.targetRiseRateLimit // m/s par seconde
let targetDropRateLimit = DEFAULT_WORKER_PARAMS.targetDropRateLimit // m/s par seconde
const maxOffsetRate = 2.5

const GRAVITY = 9.80665
const DEFAULT_AIR_DENSITY = DEFAULT_WORKER_PARAMS.rho
const BASE_CDA = DEFAULT_WORKER_PARAMS.CdA0
const DEFAULT_CRR = DEFAULT_WORKER_PARAMS.Crr
const DEFAULT_DRIVETRAIN_EFFICIENCY = DEFAULT_WORKER_PARAMS.drivetrainEfficiency
const DEFAULT_SYSTEM_MASS = DEFAULT_WORKER_PARAMS.systemMass
const DEFAULT_POWER_AVAILABLE = DEFAULT_WORKER_PARAMS.powerAvailable
const DEFAULT_LATERAL_ACCEL = DEFAULT_WORKER_PARAMS.aLatMax
const MAX_DRAFTING_LOOKAHEAD = 12
const MIN_DRAFTING_LOOKAHEAD = 2
const LONGITUDINAL_EPSILON = 1e-3

const SOCIAL_TAU = 0.6
const GAP_MIN_LONG = 1.1
const HEADWAY_TIME = 0.4
const LONGITUDINAL_REPULSION_GAIN = 3.0
const COMMAND_NOISE_STDDEV = 0.1
const OFFSET_CANDIDATE_STEP = 0.65
const WALL_COMFORT_MARGIN = 0.75
const LATERAL_GAP_INFLUENCE = 0.35
const LATERAL_FORCE_DRAG = 0.45

const FALLBACK_POWER_WEIGHT = DEFAULT_WORKER_PARAMS.wP
const FALLBACK_GAP_WEIGHT = DEFAULT_WORKER_PARAMS.wG
const FALLBACK_WALL_WEIGHT = DEFAULT_WORKER_PARAMS.wW

type WeightTriple = { power: number; gap: number; wall: number }

type RiderRoleProfile = { powerWeight: number; gapWeight: number }

type RiderPose = { position: Vector3; tangent: Vector3 }

const ROLE_PROFILES: RiderRoleProfile[] = [
  { powerWeight: 0.6, gapWeight: 0.25 }, // sprinteur protecteur, cherche l'aspi
  { powerWeight: 0.52, gapWeight: 0.33 }, // rouleur qui garde la file fluide
  { powerWeight: 0.48, gapWeight: 0.36 }, // grimpeur attentif aux espacements
  { powerWeight: 0.56, gapWeight: 0.3 }, // capitaine équilibré
]

const DIAGNOSTIC_INTERVAL = 1.0
const referenceRiderIndex = 0

type DiagnosticSnapshot = {
  speed: number
  targetRaw: number
  targetFiltered: number
  acceleration: number
  kEnv: number
  vCorner: number
  draftFactor: number
  powerDemand: number
}

let airDensity = DEFAULT_AIR_DENSITY
let baseCdA = BASE_CDA
let rollingResistanceCoeff = DEFAULT_CRR
let drivetrainEfficiency = DEFAULT_DRIVETRAIN_EFFICIENCY
let systemMass = DEFAULT_SYSTEM_MASS
let availablePower = DEFAULT_POWER_AVAILABLE
let maxLateralAcceleration = DEFAULT_LATERAL_ACCEL
let draftingMinFactor = DEFAULT_WORKER_PARAMS.beta
let draftingMaxReduction = DEFAULT_WORKER_PARAMS.S_max
let draftingCharacteristicDistance = DEFAULT_WORKER_PARAMS.lambdaDraft

let baseWeightPowerRaw = FALLBACK_POWER_WEIGHT
let baseWeightGapRaw = FALLBACK_GAP_WEIGHT
let baseWeightWallRaw = FALLBACK_WALL_WEIGHT

const FALLBACK_WEIGHT_TRIPLE: WeightTriple = {
  power: FALLBACK_POWER_WEIGHT,
  gap: FALLBACK_GAP_WEIGHT,
  wall: FALLBACK_WALL_WEIGHT,
}

let normalizedBaseWeights = normalizeWeights(
  baseWeightPowerRaw,
  baseWeightGapRaw,
  baseWeightWallRaw,
)

let warnedLateralAccel = false
let warnedCdA = false
let warnedDrafting = false

let diagnosticAccumulator = 0
let pendingDiagnostics: DiagnosticSnapshot | null = null

const scratchRightVector = new Vector3()
const scratchRelative = new Vector3()

function createPose(): RiderPose {
  return { position: new Vector3(), tangent: new Vector3() }
}

function samplePoseAtDistance(
  spline: PathSpline,
  distance: number,
  offset: number,
  target: RiderPose,
): RiderPose {
  const sample = spline.sampleByDistance(distance)
  target.position.copy(sample.position)
  target.tangent.copy(sample.tangent).normalize()
  scratchRightVector.set(-target.tangent.z, 0, target.tangent.x).normalize()
  target.position.addScaledVector(scratchRightVector, offset)
  return target
}

function alignProjectionToArc(
  projection: number,
  arc: number,
  totalLength: number,
): number {
  if (!Number.isFinite(totalLength) || totalLength <= 0 || !Number.isFinite(arc)) {
    return projection
  }
  let best = projection
  let bestError = Math.abs(projection - arc)
  for (const step of [-1, 1]) {
    const candidate = projection + step * totalLength
    const error = Math.abs(candidate - arc)
    if (error < bestError) {
      best = candidate
      bestError = error
    }
  }
  return best
}

const scratchReferencePose = createPose()
const scratchNeighborPose = createPose()
const scratchNextPose = createPose()

export function computeLongitudinalGaps(
  index: number,
  progress: Float32Array,
  offsets: Float32Array,
  spline: PathSpline,
  totalLength: number,
  poses?: RiderPose[],
): { gapAhead: number; gapBehind: number } {
  const count = progress.length
  if (index < 0 || index >= count) {
    return { gapAhead: Infinity, gapBehind: Infinity }
  }

  const referencePose =
    poses?.[index] ??
    samplePoseAtDistance(spline, progress[index], offsets[index], scratchReferencePose)
  const referencePosition = referencePose.position
  const referenceTangent = referencePose.tangent

  let gapAhead = Infinity
  let gapBehind = Infinity

  for (let j = 0; j < count; j++) {
    if (j === index) continue

    const neighborPose =
      poses?.[j] ??
      samplePoseAtDistance(spline, progress[j], offsets[j], scratchNeighborPose)
    scratchRelative.subVectors(neighborPose.position, referencePosition)
    let projection = scratchRelative.dot(referenceTangent)

    if (totalLength > 0) {
      const rawDiff = progress[j] - progress[index]
      const forwardArc = wrapDistance(rawDiff, totalLength)
      const backwardArc = -wrapDistance(-rawDiff, totalLength)

      if (forwardArc > LONGITUDINAL_EPSILON) {
        const alignedForward = alignProjectionToArc(projection, forwardArc, totalLength)
        if (alignedForward > LONGITUDINAL_EPSILON && alignedForward < gapAhead) {
          gapAhead = alignedForward
        }
      }

      if (Math.abs(backwardArc) > LONGITUDINAL_EPSILON) {
        const alignedBackward = alignProjectionToArc(projection, backwardArc, totalLength)
        if (alignedBackward < -LONGITUDINAL_EPSILON) {
          const behind = Math.abs(alignedBackward)
          if (behind < gapBehind) {
            gapBehind = behind
          }
        }
      }
    } else {
      if (projection > LONGITUDINAL_EPSILON && projection < gapAhead) {
        gapAhead = projection
      } else if (projection < -LONGITUDINAL_EPSILON) {
        const behind = -projection
        if (behind < gapBehind) {
          gapBehind = behind
        }
      }
    }
  }

  return { gapAhead, gapBehind }
}

function refreshRiderPoseCache(): void {
  if (!riderPoses || riderPoses.length !== N) return
  for (let i = 0; i < riderPoses.length; i++) {
    samplePoseAtDistance(spline, progress[i], offsets[i], riderPoses[i])
  }
}

export function computeAdaptiveMinSpeed(
  vTargetRaw: number,
  effectiveMinTargetSpeed: number,
): number {
  return Math.max(0, Math.min(vTargetRaw, effectiveMinTargetSpeed))
}

function detectClosedLoop(points: Vector3[], lane: number): boolean {
  if (points.length < 2) {
    return false
  }

  const first = points[0]
  const last = points[points.length - 1]
  const separation = first.distanceTo(last)
  const threshold = Math.max(lane * 4, 10)
  return separation <= threshold
}

// Worker Rapier : met à jour les positions et renvoie un Float32Array transférable

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function sampleNormal(generator: () => number, mean: number, stdDev: number): number {
  const u1 = Math.max(generator(), 1e-7)
  const u2 = Math.max(generator(), 1e-7)
  const mag = Math.sqrt(-2 * Math.log(u1))
  const z0 = mag * Math.cos(2 * Math.PI * u2)
  const value = mean + z0 * stdDev
  return Number.isFinite(value) ? value : mean
}

function sampleClampedNormal(
  generator: () => number,
  mean: number,
  stdDev: number,
  min: number,
  max: number,
): number {
  const value = sampleNormal(generator, mean, stdDev)
  return MathUtils.clamp(value, min, max)
}

function computeSlope(current: Vector3, ahead: Vector3, distance: number): number {
  if (!isFinite(distance) || distance <= 0) {
    return 0
  }
  return (ahead.y - current.y) / distance
}

function computeDraftingContext(
  index: number,
  progress: Float32Array,
  offsets: Float32Array,
  spline: PathSpline,
  totalLength: number,
  maxDistance: number,
  poses?: RiderPose[],
): { gapToLeader: number; leadersAhead: number } {
  if (!Number.isFinite(maxDistance) || maxDistance <= 0) {
    return { gapToLeader: Infinity, leadersAhead: 0 }
  }

  const count = progress.length
  if (index < 0 || index >= count) {
    return { gapToLeader: Infinity, leadersAhead: 0 }
  }

  const referencePose =
    poses?.[index] ??
    samplePoseAtDistance(spline, progress[index], offsets[index], scratchReferencePose)
  const origin = referencePose.position
  const tangent = referencePose.tangent

  let bestGap = Infinity
  let leaders = 0

  for (let j = 0; j < count; j++) {
    if (j === index) continue

    const neighborPose =
      poses?.[j] ??
      samplePoseAtDistance(spline, progress[j], offsets[j], scratchNeighborPose)
    scratchRelative.subVectors(neighborPose.position, origin)
    let projection = scratchRelative.dot(tangent)

    if (totalLength > 0) {
      const rawDiff = progress[j] - progress[index]
      const forwardArc = wrapDistance(rawDiff, totalLength)
      projection = alignProjectionToArc(projection, forwardArc, totalLength)
    }

    if (projection > LONGITUDINAL_EPSILON && projection <= maxDistance) {
      leaders++
      if (projection < bestGap) {
        bestGap = projection
      }
    }
  }

  return { gapToLeader: leaders > 0 ? bestGap : Infinity, leadersAhead: leaders }
}

function normalizeWeights(
  power: number,
  gap: number,
  wall: number,
  fallback: WeightTriple = FALLBACK_WEIGHT_TRIPLE,
): WeightTriple {
  const safePower = Number.isFinite(power) ? Math.max(0, power) : 0
  const safeGap = Number.isFinite(gap) ? Math.max(0, gap) : 0
  const safeWall = Number.isFinite(wall) ? Math.max(0, wall) : 0
  const sum = safePower + safeGap + safeWall
  if (sum <= 1e-6) {
    return { ...fallback }
  }
  return {
    power: safePower / sum,
    gap: safeGap / sum,
    wall: safeWall / sum,
  }
}

function updateBaseWeights(powerRaw: number, gapRaw: number, wallRaw: number): void {
  const normalized = normalizeWeights(powerRaw, gapRaw, wallRaw)
  baseWeightPowerRaw = normalized.power
  baseWeightGapRaw = normalized.gap
  baseWeightWallRaw = normalized.wall
  normalizedBaseWeights = normalized
}

function computeRoleWeights(roleIndex: number): WeightTriple {
  const base = normalizedBaseWeights
  if (!Number.isFinite(roleIndex) || roleIndex < 0 || roleIndex >= ROLE_PROFILES.length) {
    return { ...base }
  }

  const role = ROLE_PROFILES[roleIndex]
  const referencePower = FALLBACK_POWER_WEIGHT > 1e-6 ? FALLBACK_POWER_WEIGHT : 1
  const referenceGap = FALLBACK_GAP_WEIGHT > 1e-6 ? FALLBACK_GAP_WEIGHT : 1
  const powerScale = MathUtils.clamp(role.powerWeight / referencePower, 0.3, 1.7)
  const gapScale = MathUtils.clamp(role.gapWeight / referenceGap, 0.3, 1.7)
  return normalizeWeights(base.power * powerScale, base.gap * gapScale, base.wall)
}

function recomputeRoleWeights(): void {
  if (!riderRoles || !riderPowerWeights || !riderGapWeights) {
    return
  }
  const count = Math.min(riderRoles.length, riderPowerWeights.length, riderGapWeights.length)
  for (let i = 0; i < count; i++) {
    const weights = computeRoleWeights(riderRoles[i])
    riderPowerWeights[i] = weights.power
    riderGapWeights[i] = weights.gap
  }
}

function applyParameterOverrides(overrides?: SimulationParameterOverrides | null): void {
  if (!overrides) return

  if (overrides.lookAhead !== undefined && Number.isFinite(overrides.lookAhead)) {
    lookAhead = Math.max(0.5, overrides.lookAhead)
  }
  if (overrides.maxYawRate !== undefined && Number.isFinite(overrides.maxYawRate)) {
    maxYawRate = Math.max(30, Math.abs(overrides.maxYawRate))
  }
  if (overrides.maxYawAccel !== undefined && Number.isFinite(overrides.maxYawAccel)) {
    maxYawAccel = Math.max(60, Math.abs(overrides.maxYawAccel))
  }
  if (overrides.minRadius !== undefined && Number.isFinite(overrides.minRadius)) {
    minRadius = Math.max(1, Math.abs(overrides.minRadius))
  }
  if (overrides.maxTargetSpeed !== undefined && Number.isFinite(overrides.maxTargetSpeed)) {
    maxTargetSpeed = Math.max(0, overrides.maxTargetSpeed)
  }
  if (overrides.minTargetSpeed !== undefined && Number.isFinite(overrides.minTargetSpeed)) {
    minTargetSpeed = Math.max(0, overrides.minTargetSpeed)
  }
  if (overrides.maxAcceleration !== undefined && Number.isFinite(overrides.maxAcceleration)) {
    maxAcceleration = Math.max(0, overrides.maxAcceleration)
  }
  if (overrides.maxDeceleration !== undefined && Number.isFinite(overrides.maxDeceleration)) {
    maxDeceleration = Math.max(0, overrides.maxDeceleration)
  }
  if (overrides.targetSpeedDamping !== undefined && Number.isFinite(overrides.targetSpeedDamping)) {
    targetSpeedDamping = Math.max(0, overrides.targetSpeedDamping)
  }
  if (
    overrides.targetRiseRateLimit !== undefined &&
    Number.isFinite(overrides.targetRiseRateLimit)
  ) {
    targetRiseRateLimit = Math.max(0, overrides.targetRiseRateLimit)
  }
  if (
    overrides.targetDropRateLimit !== undefined &&
    Number.isFinite(overrides.targetDropRateLimit)
  ) {
    targetDropRateLimit = Math.max(0, overrides.targetDropRateLimit)
  }
  if (overrides.aLatMax !== undefined && Number.isFinite(overrides.aLatMax)) {
    maxLateralAcceleration = Math.max(0.1, overrides.aLatMax)
  }
  if (overrides.Crr !== undefined && Number.isFinite(overrides.Crr)) {
    rollingResistanceCoeff = Math.max(0, overrides.Crr)
  }
  if (overrides.CdA0 !== undefined && Number.isFinite(overrides.CdA0)) {
    baseCdA = Math.max(0.05, overrides.CdA0)
  }
  if (overrides.rho !== undefined && Number.isFinite(overrides.rho)) {
    airDensity = Math.max(0.5, overrides.rho)
  }
  if (
    overrides.drivetrainEfficiency !== undefined &&
    Number.isFinite(overrides.drivetrainEfficiency)
  ) {
    drivetrainEfficiency = MathUtils.clamp(overrides.drivetrainEfficiency, 0.5, 1)
  }
  if (overrides.systemMass !== undefined && Number.isFinite(overrides.systemMass)) {
    systemMass = Math.max(40, overrides.systemMass)
  }
  if (overrides.powerAvailable !== undefined && Number.isFinite(overrides.powerAvailable)) {
    availablePower = Math.max(0, overrides.powerAvailable)
  }
  if (overrides.beta !== undefined && Number.isFinite(overrides.beta)) {
    draftingMinFactor = MathUtils.clamp(overrides.beta, 0.1, 1)
  }
  if (overrides.S_max !== undefined && Number.isFinite(overrides.S_max)) {
    draftingMaxReduction = MathUtils.clamp(overrides.S_max, 0, 0.9)
  }
  if (overrides.lambdaDraft !== undefined && Number.isFinite(overrides.lambdaDraft)) {
    draftingCharacteristicDistance = Math.max(0.5, overrides.lambdaDraft)
  }

  let weightsChanged = false
  let nextPower = baseWeightPowerRaw
  let nextGap = baseWeightGapRaw
  let nextWall = baseWeightWallRaw
  let wallExplicit = false

  if (overrides.wP !== undefined && Number.isFinite(overrides.wP)) {
    nextPower = Math.max(0, overrides.wP)
    weightsChanged = true
  }
  if (overrides.wG !== undefined && Number.isFinite(overrides.wG)) {
    nextGap = Math.max(0, overrides.wG)
    weightsChanged = true
  }
  if (overrides.wW !== undefined && Number.isFinite(overrides.wW)) {
    nextWall = Math.max(0, overrides.wW)
    wallExplicit = true
    weightsChanged = true
  }

  if (weightsChanged) {
    if (!wallExplicit) {
      const remainder = 1 - (nextPower + nextGap)
      if (remainder > 1e-6) {
        nextWall = remainder
      }
    }
    updateBaseWeights(nextPower, nextGap, nextWall)
    recomputeRoleWeights()
  }
}


self.onmessage = async (e: MessageEvent) => {
  const { type, payload }: { type: string; payload: any } = e.data || {}

  if (type === 'init') {
    if (!world) await RAPIER.init() // charge le WASM
    // réinitialise le monde à chaque nouvelle préparation de parcours
    world = new RAPIER.World({ x: 0, y: 0, z: 0 })

    N = payload.N as number
    const initial = new Float32Array(payload.positions)
    const yawOffsets = new Float32Array(payload.yaw)
    const raw = new Float32Array(payload.path)
    applyParameterOverrides((payload.params ?? null) as SimulationParameterOverrides | null)
    laneWidth = payload.laneWidth ?? laneWidth
    roadWidth = payload.roadWidth ?? roadWidth
    margin = payload.margin ?? margin
    maxOffset = Math.max(0, roadWidth / 2 - laneWidth / 2 - margin)
    const waypoints: Vector3[] = []
    for (let i = 0; i < raw.length; i += 3) {
      waypoints.push(new Vector3(raw[i], raw[i + 1], raw[i + 2]))
    }
    spline = new PathSpline(waypoints)
    totalLength = spline.totalLength
    const closedLoopFlag = payload.closedLoop
    const isClosed =
      typeof closedLoopFlag === 'boolean'
        ? closedLoopFlag
        : detectClosedLoop(waypoints, laneWidth)
    pathBoundaryMode = isClosed ? 'loop' : 'clamp'

    // buffers pour le calcul
    state = new Float32Array(N * 4)
    bodies = new Array(N)
    speeds = new Float32Array(N)
    progress = new Float32Array(N)
    offsets = new Float32Array(N)
    yawRates = new Float32Array(N)
    commandedTargetSpeeds = new Float32Array(N)
    lateralDecisions = new Array(N)
    noiseGenerators = new Array(N)
    riderMasses = new Float32Array(N)
    riderCdA = new Float32Array(N)
    riderMaxPower = new Float32Array(N)
    riderPreferredSpeeds = new Float32Array(N)
    riderReactionTimes = new Float32Array(N)
    riderNoiseSigma = new Float32Array(N)
    riderPowerWeights = new Float32Array(N)
    riderGapWeights = new Float32Array(N)
    riderRoles = new Int16Array(N)
    riderPoses = new Array(N)
    arcProgress = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      riderPoses[i] = createPose()
    }
    const rng = mulberry32(123456)
    const effectiveMaxInitSpeed = Math.max(0, maxTargetSpeed)
    const effectiveMinInitSpeed = Math.max(
      0,
      Math.min(effectiveMaxInitSpeed, minTargetSpeed),
    )

    for (let i = 0; i < N; i++) {
      const bd = RAPIER.RigidBodyDesc.kinematicPositionBased()
      const rb = world.createRigidBody(bd)
      const cd = RAPIER.ColliderDesc.cuboid(1, 1, 0.35)
      world.createCollider(cd, rb)
      rb.setAngularDamping(2.0)
      bodies[i] = rb

      const mass = sampleClampedNormal(rng, systemMass, 5, 70, 96)
      riderMasses[i] = mass
      const baseCdAForRider = sampleClampedNormal(rng, baseCdA, 0.02, 0.25, 0.38)
      riderCdA[i] = baseCdAForRider
      const maxPowerForRider = sampleClampedNormal(
        rng,
        availablePower,
        45,
        260,
        520,
      )
      riderMaxPower[i] = maxPowerForRider
      const preferredSpeed = sampleClampedNormal(rng, 7.8, 0.5, 6, 9.6)
      riderPreferredSpeeds[i] = preferredSpeed
      const reaction = sampleClampedNormal(rng, 0.3, 0.1, 0.15, 0.6)
      riderReactionTimes[i] = reaction
      const noiseSigma = sampleClampedNormal(
        rng,
        COMMAND_NOISE_STDDEV,
        0.02,
        0.05,
        0.16,
      )
      riderNoiseSigma[i] = noiseSigma
      let roleIndex = -1
      if (ROLE_PROFILES.length > 0) {
        const sampled = Math.floor(rng() * ROLE_PROFILES.length)
        roleIndex = Math.min(ROLE_PROFILES.length - 1, Math.max(0, sampled))
      }
      riderRoles[i] = roleIndex
      const roleWeights = computeRoleWeights(roleIndex)
      riderPowerWeights[i] = roleWeights.power
      riderGapWeights[i] = roleWeights.gap

      const leaderIndex = N - 1 - i
      const row = Math.floor(leaderIndex / 9)
      let s = row * 1.2
      if (totalLength > 0) s = s % totalLength
      progress[i] = s

      const sample = spline.sampleByDistance(s)
      const tangent = sample.tangent
      const right = new Vector3(-tangent.z, 0, tangent.x).normalize()
      const center = sample.position
      const ix = initial[i * 3 + 0]
      const iz = initial[i * 3 + 2]
      const offset = (ix - center.x) * right.x + (iz - center.z) * right.z
      const clampedOffset = MathUtils.clamp(offset, -maxOffset, maxOffset)
      offsets[i] = clampedOffset

      const pos = center.clone().add(right.multiplyScalar(clampedOffset))
      rb.setTranslation({ x: pos.x, y: pos.y + 1, z: pos.z }, true)
      const yaw = Math.atan2(tangent.x, tangent.z) + yawOffsets[i]
      state[i * 4 + 0] = s
      state[i * 4 + 1] = clampedOffset
      state[i * 4 + 2] = 1
      state[i * 4 + 3] = yaw
      const initialSpeed = MathUtils.clamp(
        sampleNormal(rng, preferredSpeed, 0.4),
        Math.max(effectiveMinInitSpeed, preferredSpeed - 1.5),
        Math.min(effectiveMaxInitSpeed, preferredSpeed + 1.2),
      )
      speeds[i] = initialSpeed
      commandedTargetSpeeds[i] = initialSpeed
      yawRates[i] = 0
      const seed = (0x9e3779b9 ^ (i * 0x85ebca6b)) >>> 0
      noiseGenerators[i] = mulberry32(seed)
      lateralDecisions[i] = {
        targetOffset: clampedOffset,
        bestIndex: 0,
        lateralForce: 0,
        cost: 0,
      }
    }

    refreshRiderPoseCache()

    ;(self as unknown as Worker).postMessage(
      { type: 'state', data: state.buffer },
      [state.buffer]
    )
    state = new Float32Array(N * 4)
  }

  if (type === 'step') {
    if (!world) return // ignore steps before initialization

    const dt: number = payload.dt
    diagnosticAccumulator += dt
    refreshRiderPoseCache()

    // Un voisinage trop long resserre artificiellement le couloir en virage → peloton qui s'agglutine.
    // On réduit la portée effective pour limiter l'effet accordéon.
    const neighborArcDistance = Math.max(2, lookAhead * 0.33)
    const lateralGap = Math.max(0.6, laneWidth * 0.8)
    const neighborBounds = computeNeighborBounds(progress, offsets, {
      laneWidth,
      maxOffset,
      totalLength,
      neighborArcDistance,
      lateralGap,
    })

    const effectiveMaxTargetSpeed = Math.max(0, maxTargetSpeed)
    const effectiveMinTargetSpeed = Math.max(
      0,
      Math.min(effectiveMaxTargetSpeed, minTargetSpeed),
    )
    const lengthRatioRange = computeLengthRatioRange(maxOffset, minRadius)

    let snapshot: DiagnosticSnapshot | null = null

    for (let i = 0; i < N; i++) {
      const rb = bodies[i]
      const previousSpeed = speeds[i]
      const mass = riderMasses?.[i] ?? systemMass
      const baseCdAForRider = riderCdA?.[i] ?? baseCdA
      const maxPowerForRider = riderMaxPower?.[i] ?? availablePower
      const preferredSpeed = riderPreferredSpeeds?.[i] ??
        MathUtils.clamp(
          (effectiveMinTargetSpeed + effectiveMaxTargetSpeed) / 2,
          effectiveMinTargetSpeed,
          effectiveMaxTargetSpeed,
        )
      const reactionTime = Math.max(riderReactionTimes?.[i] ?? 0.3, 0.05)
      const noiseSigma = riderNoiseSigma?.[i] ?? COMMAND_NOISE_STDDEV
      const weightSet = normalizeWeights(
        riderPowerWeights?.[i] ?? normalizedBaseWeights.power,
        riderGapWeights?.[i] ?? normalizedBaseWeights.gap,
        normalizedBaseWeights.wall,
      )
      const powerWeight = weightSet.power
      const gapWeight = weightSet.gap
      const wallWeight = Math.max(0.05, weightSet.wall)
      const referenceGap = Math.max(normalizedBaseWeights.gap, 1e-3)
      const referencePower = Math.max(normalizedBaseWeights.power, 1e-3)
      const gapResponsiveness = MathUtils.clamp(
        gapWeight / referenceGap,
        0.6,
        1.4,
      )
      const repulsionGain = LONGITUDINAL_REPULSION_GAIN * MathUtils.clamp(
        gapWeight / referenceGap,
        0.7,
        1.4,
      )
      let personalMin = Math.max(effectiveMinTargetSpeed, preferredSpeed - 1.5)
      let personalMax = Math.min(effectiveMaxTargetSpeed, preferredSpeed + 1.5)
      if (personalMin > personalMax) {
        const neutral = MathUtils.clamp(
          preferredSpeed,
          effectiveMinTargetSpeed,
          effectiveMaxTargetSpeed,
        )
        personalMin = neutral
        personalMax = neutral
      }
      const currentOffset = MathUtils.clamp(offsets[i], -maxOffset, maxOffset)
      const currentDistance = progress[i]
      const {
        sampleDistance: aheadSampleDistance,
        travelDistance: lookAheadDistance,
      } = computeAheadSampleDistance(
        currentDistance,
        lookAhead,
        totalLength,
        pathBoundaryMode,
      )

      const minBound = neighborBounds.min[i]
      const maxBound = neighborBounds.max[i]

      let slope = 0
      if (lookAheadDistance > 1e-3) {
        const travelDistance = Math.max(lookAheadDistance, 1e-3)
        const currentSample = spline.sampleByDistance(currentDistance)
        const aheadSample = spline.sampleByDistance(aheadSampleDistance)
        slope = computeSlope(currentSample.position, aheadSample.position, travelDistance)
      }

      const curvatureEnvelope = computeCurvatureEnvelope(
        spline,
        progress[i],
        totalLength,
        lookAheadDistance,
        minRadius,
        undefined,
        pathBoundaryMode,
      )
      const rawCurvature = Math.max(
        curvatureEnvelope.rawMaxAbsCurvature ?? curvatureEnvelope.maxAbsCurvature,
        0,
      )
      const curvatureCap =
        minRadius > 0 && Number.isFinite(minRadius) ? 1 / minRadius : Infinity
      const boundedCurvature =
        Number.isFinite(curvatureCap) && curvatureCap > 0
          ? Math.min(rawCurvature, curvatureCap)
          : rawCurvature
      const kEnv = Math.max(boundedCurvature, 0)

      let vCorner = effectiveMaxTargetSpeed
      if (!(maxLateralAcceleration > 0)) {
        if (!warnedLateralAccel) {
          console.warn('[physics] aLatMax must stay positive to compute corner speeds')
          warnedLateralAccel = true
        }
      } else {
        const candidate = computeCorneringSpeedFromEnvelope(
          {
            ...curvatureEnvelope,
            maxAbsCurvature: kEnv,
          },
          {
            maxLateralAcceleration,
            sustainedBlendStart: 0.2,
            sustainedBlendEnd: 0.8,
            coverageExponent: 1.35,
            reliefFactor: 0.25,
            spikeRetention: 0.35,
          },
        )
        if (Number.isFinite(candidate) && candidate > 0) {
          vCorner = Math.min(vCorner, candidate)
        }
      }

      const slipLookahead = lookAheadDistance > 0
        ? Math.min(Math.max(lookAheadDistance, MIN_DRAFTING_LOOKAHEAD), MAX_DRAFTING_LOOKAHEAD)
        : MAX_DRAFTING_LOOKAHEAD
      const draftingContext = computeDraftingContext(
        i,
        progress,
        offsets,
        spline,
        totalLength,
        slipLookahead,
        riderPoses,
      )
      let S = draftingFactor(draftingContext.gapToLeader, draftingContext.leadersAhead, {
        minFactor: draftingMinFactor,
        maxReduction: draftingMaxReduction,
        characteristicDistance: draftingCharacteristicDistance,
      })
      if ((S < 0 || S > 1) && !warnedDrafting) {
        console.warn('[physics] drafting factor out of bounds, clamping to [0, 1]')
        warnedDrafting = true
      }
      S = MathUtils.clamp(S, 0, 1)

      let CdAeff = baseCdAForRider * S
      if (CdAeff < 0 && !warnedCdA) {
        console.warn('[physics] effective CdA fell below zero, clamping to zero')
        warnedCdA = true
      }
      CdAeff = Math.max(0, CdAeff)

      const { gapAhead } = computeLongitudinalGaps(
        i,
        progress,
        offsets,
        spline,
        totalLength,
        riderPoses,
      )
      const gapThreshold = GAP_MIN_LONG + HEADWAY_TIME * gapResponsiveness * previousSpeed

      const vPower = solveVelocityFromPower(maxPowerForRider, {
        airDensity,
        cdA: CdAeff,
        crr: rollingResistanceCoeff,
        mass,
        slope,
        gravity: GRAVITY,
        drivetrainEfficiency,
      })

      const candidateSpeeds = [vCorner, vPower, effectiveMaxTargetSpeed].filter(
        (value) => Number.isFinite(value) && value > 0,
      )
      const vTargetRaw =
        candidateSpeeds.length > 0
          ? Math.min(...candidateSpeeds)
          : effectiveMaxTargetSpeed
      const adaptiveMinSpeed = computeAdaptiveMinSpeed(
        vTargetRaw,
        effectiveMinTargetSpeed,
      )
      const targetSpeed = MathUtils.clamp(
        vTargetRaw,
        adaptiveMinSpeed,
        personalMax,
      )

      const planningSpeed = Math.max(0.1, effectiveMaxTargetSpeed)
      const availableTime =
        lookAheadDistance > 0 ? lookAheadDistance / planningSpeed : 0

      let compensationForBest = 1
      let offsetPlan: OffsetCandidateResult = lateralDecisions[i]

      if (lookAheadDistance > 0.25) {
        const horizon = Math.max(lookAheadDistance, laneWidth * 1.5, 3)
        const startDistance = progress[i]
        const endDistance = totalLength > 0
          ? Math.min(startDistance + horizon, totalLength)
          : startDistance + horizon
        const referenceLength = computeOffsetSegmentLength(
          spline,
          startDistance,
          endDistance,
          0,
          16,
        )

        const candidateStep = Math.max(laneWidth * 0.5, OFFSET_CANDIDATE_STEP)
        const candidates = generateOffsetCandidates(
          currentOffset,
          candidateStep,
          minBound,
          maxBound,
          maxOffset,
        )

        const candidateCompensations: number[] = []
        const candidatePowerRatios: number[] = []

        for (const candidate of candidates) {
          const clampedCandidate = MathUtils.clamp(candidate, -maxOffset, maxOffset)
          let compensation = 1
          if (referenceLength > 1e-3) {
            const segmentLength = computeOffsetSegmentLength(
              spline,
              startDistance,
              endDistance,
              clampedCandidate,
              16,
            )
            if (segmentLength > 1e-3) {
              const rawRatio = segmentLength / referenceLength
              const clampedRatio = MathUtils.clamp(
                rawRatio,
                lengthRatioRange.min,
                lengthRatioRange.max,
              )
              compensation = computeTargetSpeedCompensation(clampedRatio)
            }
          }
          candidateCompensations.push(compensation)

          const candidateSpeed = MathUtils.clamp(
            targetSpeed * compensation,
            adaptiveMinSpeed,
            personalMax,
          )
          const slopeAdjustedCandidate = adjustTargetSpeedForSlope(
            candidateSpeed,
            slope,
            {
              maxSlope: 0.25,
              maxUphillPenalty: 2,
              maxDownhillBoost: 1,
              minSpeed: Math.max(0, adaptiveMinSpeed - 0.5),
              maxSpeed: personalMax + 0.5,
            },
          )
          const candidatePower = powerDemand(slopeAdjustedCandidate, {
            airDensity,
            cdA: CdAeff,
            crr: rollingResistanceCoeff,
            mass,
            slope,
            gravity: GRAVITY,
            drivetrainEfficiency,
          })
          const normalizedPower =
            maxPowerForRider > 1e-3 ? candidatePower / maxPowerForRider : 0
          candidatePowerRatios.push(Math.max(0, normalizedPower))
        }

        offsetPlan = evaluateOffsetCandidates({
          currentOffset,
          candidates,
          powerRatios: candidatePowerRatios,
          minBound,
          maxBound,
          maxOffset,
          gapAhead,
          gapThreshold,
          weights: { power: powerWeight, gap: gapWeight, wall: wallWeight },
          wallComfort: Math.max(laneWidth * 0.5, WALL_COMFORT_MARGIN),
          referenceStep: candidateStep,
          lateralGapInfluence: LATERAL_GAP_INFLUENCE,
        })
        compensationForBest = candidateCompensations[offsetPlan.bestIndex] ?? 1
        lateralDecisions[i] = offsetPlan
      } else {
        offsetPlan = {
          targetOffset: currentOffset,
          bestIndex: 0,
          lateralForce: 0,
          cost: 0,
        }
        compensationForBest = 1
        lateralDecisions[i] = offsetPlan
      }

      const plannedOffset = constrainOffsetWithinRate(
        currentOffset,
        offsetPlan.targetOffset,
        minBound,
        maxBound,
        maxOffsetRate,
        availableTime,
      )

      const compensatedTarget = MathUtils.clamp(
        targetSpeed * compensationForBest,
        adaptiveMinSpeed,
        personalMax,
      )

      const noiseSource = noiseGenerators[i]
      const commandNoise = sampleNormal(noiseSource ?? Math.random, 0, noiseSigma)
      const baseTarget = MathUtils.clamp(
        compensatedTarget + commandNoise,
        adaptiveMinSpeed,
        personalMax,
      )
      const preferenceBias = MathUtils.clamp(
        preferredSpeed - baseTarget,
        -0.6,
        0.6,
      )
      const biasedTarget = MathUtils.clamp(
        baseTarget + preferenceBias * 0.2,
        adaptiveMinSpeed,
        personalMax,
      )

      // (B) Rate limit sur la consigne (borne les crans de montée/descente)
      const prevCmd = commandedTargetSpeeds[i]
      const maxRise = targetRiseRateLimit * dt
      const maxDrop = targetDropRateLimit * dt
      let bounded = biasedTarget
      if (bounded > prevCmd + maxRise) bounded = prevCmd + maxRise
      if (bounded < prevCmd - maxDrop) bounded = prevCmd - maxDrop

      // (C) Passe-bas 1er ordre sur la consigne
      const dampingAlpha = 1 - Math.exp(-targetSpeedDamping * dt)
      const reactionAlpha = 1 - Math.exp(-dt / reactionTime)
      const combinedAlpha = MathUtils.clamp(
        1 - (1 - dampingAlpha) * (1 - reactionAlpha),
        0,
        1,
      )
      commandedTargetSpeeds[i] = prevCmd + (bounded - prevCmd) * combinedAlpha

      const slopeAdjustedTarget = adjustTargetSpeedForSlope(commandedTargetSpeeds[i], slope, {
        maxSlope: 0.25,
        maxUphillPenalty: 2,
        maxDownhillBoost: 1,
        minSpeed: Math.max(0, adaptiveMinSpeed - 0.5),
        maxSpeed: personalMax + 0.5,
      })

      const gapShortage = Math.max(0, gapThreshold - gapAhead)
      const repulsionRatio =
        gapThreshold > 1e-3 ? MathUtils.clamp(gapShortage / gapThreshold, 0, 1) : 0
      const longitudinalRepulsion =
        repulsionRatio > 0
          ? -repulsionGain * repulsionRatio * repulsionRatio
          : 0

      const desiredAccel =
        (slopeAdjustedTarget - previousSpeed) /
          Math.max(
            SOCIAL_TAU * MathUtils.clamp(
              referencePower / Math.max(powerWeight, 1e-3),
              0.7,
              1.3,
            ),
            1e-3,
          ) -
        LATERAL_FORCE_DRAG * Math.abs(offsetPlan.lateralForce)
      const accelInput = desiredAccel + longitudinalRepulsion
      const clampedAccel = MathUtils.clamp(
        accelInput,
        -Math.abs(maxDeceleration),
        Math.abs(maxAcceleration),
      )
      let newSpeed = previousSpeed + clampedAccel * dt
      if (!Number.isFinite(newSpeed) || newSpeed < 0) {
        newSpeed = 0
      }
      newSpeed = MathUtils.clamp(
        newSpeed,
        Math.max(0, adaptiveMinSpeed - 0.5),
        personalMax + 0.5,
      )
      speeds[i] = newSpeed

      if (i === referenceRiderIndex) {
        const acceleration = dt > 0 ? (newSpeed - previousSpeed) / dt : 0
        const power = powerDemand(newSpeed, {
          airDensity,
          cdA: CdAeff,
          crr: rollingResistanceCoeff,
          mass,
          slope,
          gravity: GRAVITY,
          drivetrainEfficiency,
        })
        snapshot = {
          speed: newSpeed,
          targetRaw: biasedTarget,
          targetFiltered: commandedTargetSpeeds[i],
          acceleration,
          kEnv,
          vCorner,
          draftFactor: S,
          powerDemand: power,
        }
      }

      const updatedOffset = steerOffsetTowardTarget(
        currentOffset,
        plannedOffset,
        minBound,
        maxBound,
        dt,
        maxOffsetRate
      )
      offsets[i] = MathUtils.clamp(updatedOffset, -maxOffset, maxOffset)

      const travel = ((previousSpeed + newSpeed) / 2) * dt
      if (arcProgress) {
        arcProgress[i] += Math.max(0, travel)
      }
      const curvature = computeSignedCurvature(
        spline,
        progress[i],
        totalLength,
        undefined,
        pathBoundaryMode,
      )
      const centerlineTravel = projectWorldDistanceOntoCenterline(
        travel,
        curvature,
        updatedOffset,
        {
          minRatio: lengthRatioRange.min,
          maxRatio: lengthRatioRange.max,
        },
      )
      let s = progress[i] + centerlineTravel
      if (totalLength > 0) s = MathUtils.euclideanModulo(s, totalLength)
      progress[i] = s
      const { sampleDistance: yawAheadDistance } = computeAheadSampleDistance(
        s,
        lookAhead,
        totalLength,
        pathBoundaryMode,
      )

      const lateralOffset = offsets[i]
      const pose = samplePoseAtDistance(spline, s, lateralOffset, scratchNextPose)
      const pos = pose.position
      const tangent = pose.tangent

      const look = spline.sampleByDistance(yawAheadDistance)
      const targetYaw = Math.atan2(look.tangent.x, look.tangent.z)
      const currentYaw = state[i * 4 + 3]
      const yawState: YawState = { yawRate: yawRates[i] }
      const yaw = smoothLimitAngle(currentYaw, targetYaw, yawState, maxYawRate, maxYawAccel, dt)
      yawRates[i] = yawState.yawRate

      rb.setNextKinematicTranslation({ x: pos.x, y: pos.y + 1, z: pos.z })
      const half = yaw / 2
      rb.setNextKinematicRotation({ x: 0, y: Math.sin(half), z: 0, w: Math.cos(half) })
      rb.setAngvel({ x: 0, y: yawRates[i], z: 0 }, true)

      const base4 = i * 4
      state[base4 + 0] = s
      state[base4 + 1] = lateralOffset
      state[base4 + 2] = 1
      state[base4 + 3] = yaw
    }

    refreshRiderPoseCache()

    world.step()

    if (referenceRiderIndex < N) {
      pendingDiagnostics = snapshot
    } else {
      pendingDiagnostics = null
    }

    if (diagnosticAccumulator >= DIAGNOSTIC_INTERVAL && pendingDiagnostics) {
      const { gapAhead, gapBehind } = computeLongitudinalGaps(
        referenceRiderIndex,
        progress,
        offsets,
        spline,
        totalLength,
        riderPoses,
      )
      console.log('[physics][diagnostics]', {
        ...pendingDiagnostics,
        gapAhead,
        gapBehind,
      })
      diagnosticAccumulator = 0
    }

    ;(self as unknown as Worker).postMessage(
      { type: 'state', data: state.buffer },
      [state.buffer]
    )
    state = new Float32Array(N * 4)
  }

  if (type === 'params') {
    applyParameterOverrides(payload as SimulationParameterOverrides)
  }
}
