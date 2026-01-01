/**
 * Web worker entry point driving the peloton physics simulation via Rapier.
 *
 * Extension: expose new message types to adjust parameters at runtime without
 * blocking the main thread.
 */
import * as RAPIER from '@dimforge/rapier3d-compat'
import { MathUtils, Matrix4, Quaternion, Vector3 } from 'three'
import { PathSpline } from '../../route/pathSpline'
import {
  computeLengthRatioRange,
  computeOffsetSegmentLengths,
  type SegmentSamplingOptions,
} from './speedControl'
import { computeNeighborBounds } from './riderPathing'
import type { PathBoundaryMode } from './riderPathing'
import {
  precomputeBestLineLookup,
  sampleBestLineProfile,
  type BestLineLookup,
} from './bestLine'
import {
  createPose,
  mulberry32,
  normalizeWeights,
  recomputeRoleWeights,
  sampleClampedNormal,
  sampleNormal,
  samplePoseAtDistance,
  updateBaseWeights,
  computeRoleWeights,
  computeLongitudinalGaps,
} from './planning/riderManagement'
import type {
  OffsetCandidateResult,
  OffsetPhaseQueueEntry,
  RiderPose,
  RiderRoleProfile,
  WeightTriple,
} from './planning/types'
import { planRiderStep, type RiderEnvironment, type RiderProperties } from './planning/riderPlanner'
import { COMMAND_NOISE_STDDEV } from './planning/speedPlanner'
import {
  DEFAULT_WORKER_PARAMS,
  type SimulationParameterOverrides,
} from './workerParams'

export { computeLongitudinalGaps } from './planning/riderManagement'
export { computeAdaptiveMinSpeed, evaluateHairpinCornering } from './planning/speedPlanner'

let world: RAPIER.World
let N = 0
// buffer envoyé au thread principal : [x, y, z, qx, qy, qz, qw]*N
let renderState: Float32Array
let telemetryState: Float32Array
let bodies: RAPIER.RigidBody[] = []
let speeds: Float32Array
let progress: Float32Array
let offsets: Float32Array
let yawRates: Float32Array
let commandedTargetSpeeds: Float32Array
let lateralDecisions: OffsetCandidateResult[] = []
type OffsetPhaseQueueEntry = { offset: number; weight: number; ttl: number }
let desiredOffsetSequences: OffsetPhaseQueueEntry[][] = []
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
let riderOrientations: Quaternion[] = []
let arcProgress: Float32Array
let lastStepTimestamp: number | null = null
let bestLineLookup: BestLineLookup | null = null
let surfaceArcDistances: Float32Array | null = null
let surfaceHeights: Float32Array | null = null
let surfaceNormals: Float32Array | null = null
let riderSurfaceOffset = 0.05

let laneWidth = 1
let roadWidth = 8
let margin = 0
let maxOffset = Infinity

// trajectoire lissée
let spline: PathSpline
let totalLength = 0
let pathBoundaryMode: PathBoundaryMode = 'loop'

type SegmentLengthCacheEntry = {
  start: number
  end: number
  sampleCount: number
  offsetsKey: string
  optionsKey: string
  lengths: number[]
}

let segmentLengthCache: SegmentLengthCacheEntry | null = null

function formatSegmentOffsetsKey(offsets: readonly number[], precision = 3): string {
  if (offsets.length === 0) {
    return 'empty'
  }
  const factor = Math.pow(10, precision)
  return offsets
    .map((value) =>
      Number.isFinite(value)
        ? (Math.round(value * factor) / factor).toString()
        : '0',
    )
    .join('|')
}

function formatSegmentOptionsKey(options: SegmentSamplingOptions | undefined): string {
  if (!options) {
    return 'default'
  }
  const { sampleCount = 12, minOffsetForSampling, adaptiveStep = true } = options
  const minOffsetKey = Number.isFinite(minOffsetForSampling ?? NaN)
    ? (Math.round((minOffsetForSampling ?? 0) * 1000) / 1000).toString()
    : 'auto'
  return `${sampleCount}|${adaptiveStep ? 1 : 0}|${minOffsetKey}`
}

function buildRoadFrame(
  tangent: Vector3,
  normalHint?: Vector3,
): {
  forward: Vector3
  normal: Vector3
  binormal: Vector3
} {
  scratchRoadFrameForward.copy(tangent)
  if (scratchRoadFrameForward.lengthSq() < 1e-8) {
    scratchRoadFrameForward.set(0, 0, 1)
  } else {
    scratchRoadFrameForward.normalize()
  }

  scratchRoadFrameNormal.copy(normalHint ?? WORLD_UP)
  const projection = scratchRoadFrameForward.dot(scratchRoadFrameNormal)
  scratchRoadFrameNormal.addScaledVector(scratchRoadFrameForward, -projection)
  if (scratchRoadFrameNormal.lengthSq() < 1e-8) {
    scratchRoadFrameNormal.copy(WORLD_UP)
  } else {
    scratchRoadFrameNormal.normalize()
  }

  const binormal = scratchRoadFrameRight.crossVectors(
    scratchRoadFrameNormal,
    scratchRoadFrameForward,
  )

  if (binormal.lengthSq() < 1e-8) {
    binormal.crossVectors(WORLD_UP, scratchRoadFrameForward)
  }
  if (binormal.lengthSq() < 1e-8) {
    binormal.set(1, 0, 0)
  } else {
    binormal.normalize()
  }

  const correctedNormal = scratchRoadFrameNormal.crossVectors(
    scratchRoadFrameForward,
    binormal,
  )
  if (correctedNormal.lengthSq() > 1e-8) {
    correctedNormal.normalize()
  }

  return {
    forward: scratchRoadFrameForward,
    normal: correctedNormal.lengthSq() > 0 ? correctedNormal : scratchRoadFrameNormal,
    binormal,
  }
}

function frameToQuaternion(frame: {
  forward: Vector3
  normal: Vector3
  binormal: Vector3
}): Quaternion {
  scratchOrientationMatrix.makeBasis(frame.binormal, frame.normal, frame.forward)
  return scratchOrientationQuat.setFromRotationMatrix(scratchOrientationMatrix)
}

function smoothOrientation(
  current: Quaternion,
  target: Quaternion,
  dt: number,
  store: Quaternion,
): { orientation: Quaternion; yawRate: number } {
  scratchPrevOrientation.copy(store)
  const forwardBefore = scratchPrevForward.set(0, 0, 1).applyQuaternion(scratchPrevOrientation)
  const prevYaw = Math.atan2(forwardBefore.x, forwardBefore.z)

  const rate = 1 - Math.exp(-ORIENTATION_SMOOTHING_RATE * Math.max(dt, 0))
  store.copy(current).slerp(target, MathUtils.clamp(rate, 0, 1))

  const forwardAfter = scratchPrevForward.set(0, 0, 1).applyQuaternion(store)
  const nextYaw = Math.atan2(forwardAfter.x, forwardAfter.z)
  let yawDelta = nextYaw - prevYaw
  yawDelta = Math.atan2(Math.sin(yawDelta), Math.cos(yawDelta))
  const yawRate = dt > 0 ? yawDelta / dt : 0

  return { orientation: store, yawRate }
}

function sampleOffsetSegmentLengths(
  startDistance: number,
  endDistance: number,
  offsets: readonly number[],
  options?: SegmentSamplingOptions,
): number[] {
  if (!spline) {
    return offsets.map(() => 0)
  }

  const resolvedSampleCount = Math.max(1, Math.floor(options?.sampleCount ?? 12))
  const resolvedOptions: SegmentSamplingOptions = {
    ...options,
    sampleCount: resolvedSampleCount,
  }
  const offsetsKey = formatSegmentOffsetsKey(offsets)
  const optionsKey = formatSegmentOptionsKey(resolvedOptions)

  if (
    segmentLengthCache &&
    Math.abs(segmentLengthCache.start - startDistance) < 1e-3 &&
    Math.abs(segmentLengthCache.end - endDistance) < 1e-3 &&
    segmentLengthCache.sampleCount === resolvedSampleCount &&
    segmentLengthCache.offsetsKey === offsetsKey &&
    segmentLengthCache.optionsKey === optionsKey
  ) {
    return segmentLengthCache.lengths.slice()
  }

  const lengths = computeOffsetSegmentLengths(
    spline,
    startDistance,
    endDistance,
    offsets,
    resolvedOptions,
  )

  segmentLengthCache = {
    start: startDistance,
    end: endDistance,
    sampleCount: resolvedSampleCount,
    offsetsKey,
    optionsKey,
    lengths,
  }

  return lengths.slice()
}

function loadSurfaceProfile(
  distances?: ArrayBuffer,
  heights?: ArrayBuffer,
  normals?: ArrayBuffer,
): void {
  if (distances && heights && normals) {
    const distanceArray = new Float32Array(distances)
    const heightArray = new Float32Array(heights)
    const normalArray = new Float32Array(normals)
    const hasConsistentLengths =
      distanceArray.length === heightArray.length &&
      normalArray.length === distanceArray.length * 3
    if (hasConsistentLengths && distanceArray.length > 0) {
      surfaceArcDistances = distanceArray
      surfaceHeights = heightArray
      surfaceNormals = normalArray
      return
    }
  }

  surfaceArcDistances = null
  surfaceHeights = null
  surfaceNormals = null
}

function wrapSurfaceDistance(distance: number): number {
  if (pathBoundaryMode === 'loop' && totalLength > 0) {
    return MathUtils.euclideanModulo(distance, totalLength)
  }
  if (totalLength > 0) {
    return MathUtils.clamp(distance, 0, totalLength)
  }
  return Math.max(0, distance)
}

function readSurfaceNormal(index: number, target: Vector3): Vector3 {
  if (!surfaceNormals) {
    return target.copy(WORLD_UP)
  }

  const base = index * 3
  target.set(
    surfaceNormals[base] ?? 0,
    surfaceNormals[base + 1] ?? 1,
    surfaceNormals[base + 2] ?? 0,
  )

  if (target.lengthSq() < 1e-9) {
    target.copy(WORLD_UP)
  } else {
    target.normalize()
  }

  return target
}

function findSurfaceIndex(distance: number): number {
  if (!surfaceArcDistances || surfaceArcDistances.length === 0) {
    return -1
  }

  const lastIndex = surfaceArcDistances.length - 1
  if (distance <= surfaceArcDistances[0]) return 0
  if (distance >= surfaceArcDistances[lastIndex]) return lastIndex

  let low = 0
  let high = lastIndex
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const value = surfaceArcDistances[mid]
    if (value < distance) {
      low = mid + 1
    } else if (value > distance) {
      high = mid - 1
    } else {
      return mid
    }
  }

  return Math.min(Math.max(low, 1), lastIndex)
}

function sampleSurfaceInfo(distance: number): { height: number; normal: Vector3 } {
  const clamped = wrapSurfaceDistance(distance)
  const fallbackSample = spline?.sampleByDistance(clamped)
  let height = fallbackSample?.position.y ?? 0
  const defaultNormal = scratchSurfaceNormal.copy(WORLD_UP)

  if (!surfaceArcDistances || !surfaceHeights || !surfaceNormals || surfaceArcDistances.length === 0) {
    return { height, normal: defaultNormal }
  }

  const upperIndex = findSurfaceIndex(clamped)
  if (upperIndex < 0) {
    return { height, normal: defaultNormal }
  }

  const lowerIndex = Math.max(0, upperIndex - 1)

  if (upperIndex === lowerIndex) {
    height = surfaceHeights[upperIndex] ?? height
    return { height, normal: readSurfaceNormal(upperIndex, scratchSurfaceNormal) }
  }

  const d0 = surfaceArcDistances[lowerIndex]
  const d1 = surfaceArcDistances[upperIndex]
  const span = Math.max(1e-6, d1 - d0)
  const t = MathUtils.clamp((clamped - d0) / span, 0, 1)
  const h0 = surfaceHeights[lowerIndex] ?? height
  const h1 = surfaceHeights[upperIndex] ?? h0
  height = MathUtils.lerp(h0, h1, t)
  const n0 = readSurfaceNormal(lowerIndex, scratchSurfaceNormalA)
  const n1 = readSurfaceNormal(upperIndex, scratchSurfaceNormalB)
  scratchSurfaceNormal.lerpVectors(n0, n1, t)
  if (scratchSurfaceNormal.lengthSq() < 1e-8) {
    scratchSurfaceNormal.copy(WORLD_UP)
  } else {
    scratchSurfaceNormal.normalize()
  }

  return { height, normal: scratchSurfaceNormal }
}

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

let corneringIntensityThreshold = DEFAULT_WORKER_PARAMS.corneringIntensityThreshold
let corneringCoverageThreshold = DEFAULT_WORKER_PARAMS.corneringCoverageThreshold
let corneringRadiusThreshold = DEFAULT_WORKER_PARAMS.corneringRadiusThreshold
let corneringLateralAcceleration = DEFAULT_WORKER_PARAMS.corneringLateralAcceleration
let corneringSeverityThreshold = DEFAULT_WORKER_PARAMS.corneringSeverityThreshold
let hairpinBrakingExponent = DEFAULT_WORKER_PARAMS.hairpinBrakingExponent

let cornerSpeedFloor = DEFAULT_WORKER_PARAMS.cornerSpeedFloor
let cornerFloorTransitionFactor = DEFAULT_WORKER_PARAMS.cornerFloorTransitionFactor
let curveSpeedMarginRatio = DEFAULT_WORKER_PARAMS.curveSpeedMarginRatio
let curveSpeedMarginMin = DEFAULT_WORKER_PARAMS.curveSpeedMarginMin
let curveSpeedMarginMax = DEFAULT_WORKER_PARAMS.curveSpeedMarginMax

const GRAVITY = 9.80665
const DEFAULT_AIR_DENSITY = DEFAULT_WORKER_PARAMS.rho
const BASE_CDA = DEFAULT_WORKER_PARAMS.CdA0
const DEFAULT_CRR = DEFAULT_WORKER_PARAMS.Crr
const DEFAULT_DRIVETRAIN_EFFICIENCY = DEFAULT_WORKER_PARAMS.drivetrainEfficiency
const MAX_SHORTEST_PATH_POINTS = 1000
const DEFAULT_SYSTEM_MASS = DEFAULT_WORKER_PARAMS.systemMass
const DEFAULT_POWER_AVAILABLE = DEFAULT_WORKER_PARAMS.powerAvailable
const DEFAULT_LATERAL_ACCEL = DEFAULT_WORKER_PARAMS.aLatMax
const MIN_STEP_DT = 1 / 120
const MAX_STEP_DT = 0.2

const FALLBACK_POWER_WEIGHT = DEFAULT_WORKER_PARAMS.wP
const FALLBACK_GAP_WEIGHT = DEFAULT_WORKER_PARAMS.wG
const FALLBACK_WALL_WEIGHT = DEFAULT_WORKER_PARAMS.wW

const ORIENTATION_SMOOTHING_RATE = 6.0
const WORLD_UP = new Vector3(0, 1, 0)
const DEFAULT_RIDER_SURFACE_OFFSET = 0.05

const scratchRoadFrameRight = new Vector3()
const scratchRoadFrameNormal = new Vector3()
const scratchRoadFrameForward = new Vector3()
const scratchOrientationMatrix = new Matrix4()
const scratchOrientationQuat = new Quaternion()
const scratchPrevOrientation = new Quaternion()
const scratchPrevForward = new Vector3(0, 0, 1)
const scratchSurfaceNormal = new Vector3()
const scratchSurfaceNormalA = new Vector3()
const scratchSurfaceNormalB = new Vector3()

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
  hairpinSeverity: number
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
  FALLBACK_WEIGHT_TRIPLE,
)

let diagnosticAccumulator = 0
let pendingDiagnostics: DiagnosticSnapshot | null = null

function getCurrentTimestamp(): number {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now()
  }
  return Date.now()
}
const scratchNextPose = createPose()
function refreshRiderPoseCache(): void {
  if (!riderPoses || riderPoses.length !== N) return
  for (let i = 0; i < riderPoses.length; i++) {
    const pose = samplePoseAtDistance(spline, progress[i], offsets[i], riderPoses[i])
    const surface = sampleSurfaceInfo(progress[i])
    pose.position.y = surface.height
  }
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
  if (
    overrides.corneringIntensityThreshold !== undefined &&
    Number.isFinite(overrides.corneringIntensityThreshold)
  ) {
    corneringIntensityThreshold = MathUtils.clamp(overrides.corneringIntensityThreshold, 0, 1)
  }
  if (
    overrides.corneringCoverageThreshold !== undefined &&
    Number.isFinite(overrides.corneringCoverageThreshold)
  ) {
    corneringCoverageThreshold = MathUtils.clamp(overrides.corneringCoverageThreshold, 0, 1)
  }
  if (
    overrides.corneringRadiusThreshold !== undefined &&
    Number.isFinite(overrides.corneringRadiusThreshold)
  ) {
    corneringRadiusThreshold = Math.max(1, overrides.corneringRadiusThreshold)
  }
  if (
    overrides.corneringLateralAcceleration !== undefined &&
    Number.isFinite(overrides.corneringLateralAcceleration)
  ) {
    corneringLateralAcceleration = Math.max(0, overrides.corneringLateralAcceleration)
  }
  if (
    overrides.corneringSeverityThreshold !== undefined &&
    Number.isFinite(overrides.corneringSeverityThreshold)
  ) {
    corneringSeverityThreshold = MathUtils.clamp(overrides.corneringSeverityThreshold, 0, 1)
  }
  if (
    overrides.hairpinBrakingExponent !== undefined &&
    Number.isFinite(overrides.hairpinBrakingExponent)
  ) {
    hairpinBrakingExponent = Math.max(1, overrides.hairpinBrakingExponent)
  }
  if (overrides.cornerSpeedFloor !== undefined && Number.isFinite(overrides.cornerSpeedFloor)) {
    cornerSpeedFloor = MathUtils.clamp(overrides.cornerSpeedFloor, 0, 1)
  }
  if (
    overrides.cornerFloorTransitionFactor !== undefined &&
    Number.isFinite(overrides.cornerFloorTransitionFactor)
  ) {
    cornerFloorTransitionFactor = Math.max(1, overrides.cornerFloorTransitionFactor)
  }
  if (overrides.curveSpeedMarginRatio !== undefined && Number.isFinite(overrides.curveSpeedMarginRatio)) {
    curveSpeedMarginRatio = Math.max(0, overrides.curveSpeedMarginRatio)
  }
  if (overrides.curveSpeedMarginMin !== undefined && Number.isFinite(overrides.curveSpeedMarginMin)) {
    curveSpeedMarginMin = Math.max(0, overrides.curveSpeedMarginMin)
  }
  if (overrides.curveSpeedMarginMax !== undefined && Number.isFinite(overrides.curveSpeedMarginMax)) {
    curveSpeedMarginMax = Math.max(0, overrides.curveSpeedMarginMax)
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
    const normalized = updateBaseWeights(nextPower, nextGap, nextWall, FALLBACK_WEIGHT_TRIPLE)
    baseWeightPowerRaw = normalized.power
    baseWeightGapRaw = normalized.gap
    baseWeightWallRaw = normalized.wall
    normalizedBaseWeights = normalized

    if (riderRoles && riderPowerWeights && riderGapWeights) {
      const recomputed = recomputeRoleWeights(
        riderRoles,
        normalized,
        ROLE_PROFILES,
        FALLBACK_POWER_WEIGHT,
        FALLBACK_GAP_WEIGHT,
      )
      riderPowerWeights.set(recomputed.power)
      riderGapWeights.set(recomputed.gap)
    }
  }
}


const rapierWasmUrl = new URL(
  '@dimforge/rapier3d-compat/rapier_wasm3d_bg.wasm',
  import.meta.url,
).href

let rapierInitPromise: Promise<void> | null = null

async function ensureRapier(): Promise<void> {
  if (!rapierInitPromise) {
    rapierInitPromise = RAPIER.init(rapierWasmUrl)
  }
  await rapierInitPromise
}

self.onmessage = async (e: MessageEvent) => {
  const { type, payload }: { type: string; payload: any } = e.data || {}

  if (type === 'init') {
    try {
      if (!world) await ensureRapier() // charge le WASM
      // réinitialise le monde à chaque nouvelle préparation de parcours
      world = new RAPIER.World({ x: 0, y: 0, z: 0 })
    lastStepTimestamp = getCurrentTimestamp()

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
    segmentLengthCache = null
    totalLength = spline.totalLength
    const closedLoopFlag = payload.closedLoop
    const isClosed =
      typeof closedLoopFlag === 'boolean'
        ? closedLoopFlag
        : detectClosedLoop(waypoints, laneWidth)
    pathBoundaryMode = isClosed ? 'loop' : 'clamp'

    bestLineLookup = null
    const shortestBuffer: ArrayBuffer | undefined = payload.shortestPath
    if (shortestBuffer) {
      const shortestRaw = new Float32Array(shortestBuffer)
      const bestPoints: Vector3[] = []
      for (let i = 0; i < shortestRaw.length; i += 3) {
        bestPoints.push(new Vector3(shortestRaw[i], shortestRaw[i + 1], shortestRaw[i + 2]))
      }
      if (bestPoints.length > 0) {
        let lookupPoints = bestPoints
        if (bestPoints.length > MAX_SHORTEST_PATH_POINTS) {
          const decimated: Vector3[] = []
          const step = Math.ceil(bestPoints.length / MAX_SHORTEST_PATH_POINTS)
          for (let i = 0; i < bestPoints.length; i += step) {
            decimated.push(bestPoints[i])
          }
          if (decimated[decimated.length - 1] !== bestPoints[bestPoints.length - 1]) {
            decimated.push(bestPoints[bestPoints.length - 1])
          }
          lookupPoints = decimated
        }
        bestLineLookup = precomputeBestLineLookup(
          spline,
          lookupPoints,
          totalLength,
          maxOffset,
          Math.max(0.4, laneWidth * 0.5),
        )
      }
    }

    loadSurfaceProfile(
      payload.surfaceDistances as ArrayBuffer | undefined,
      payload.surfaceHeights as ArrayBuffer | undefined,
      payload.surfaceNormals as ArrayBuffer | undefined,
    )
    riderSurfaceOffset = Number.isFinite(payload.surfaceOffset)
      ? Math.max(0, payload.surfaceOffset)
      : DEFAULT_RIDER_SURFACE_OFFSET

    // buffers pour le calcul
    renderState = new Float32Array(N * 7)
    telemetryState = new Float32Array(N)
    bodies = new Array(N)
    speeds = new Float32Array(N)
    progress = new Float32Array(N)
    offsets = new Float32Array(N)
    yawRates = new Float32Array(N)
    commandedTargetSpeeds = new Float32Array(N)
    lateralDecisions = new Array(N)
    desiredOffsetSequences = new Array(N)
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
    riderOrientations = new Array(N)
    arcProgress = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      riderPoses[i] = createPose()
      riderOrientations[i] = new Quaternion()
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
      const roleWeights = computeRoleWeights(
        roleIndex,
        normalizedBaseWeights,
        ROLE_PROFILES,
        FALLBACK_POWER_WEIGHT,
        FALLBACK_GAP_WEIGHT,
      )
      riderPowerWeights[i] = roleWeights.power
      riderGapWeights[i] = roleWeights.gap

      const leaderIndex = N - 1 - i
      const row = Math.floor(leaderIndex / 9)
      let s = row * 1.2
      if (totalLength > 0) {
        if (pathBoundaryMode === 'loop') {
          s = MathUtils.euclideanModulo(s, totalLength)
        } else {
          s = MathUtils.clamp(s, 0, totalLength)
        }
      }
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
      const surface = sampleSurfaceInfo(s)
      pos.y = surface.height + riderSurfaceOffset
      rb.setTranslation({ x: pos.x, y: pos.y, z: pos.z }, true)
      const frame = buildRoadFrame(sample.tangent, surface.normal)
      const baseOrientation = frameToQuaternion(frame)
      const orientation = riderOrientations[i]
      orientation.copy(baseOrientation)
      if (Number.isFinite(yawOffsets[i])) {
        scratchPrevOrientation.setFromAxisAngle(frame.normal, yawOffsets[i])
        orientation.multiply(scratchPrevOrientation)
      }

      const baseState = i * 7
      renderState[baseState + 0] = pos.x
      renderState[baseState + 1] = pos.y
      renderState[baseState + 2] = pos.z
      renderState[baseState + 3] = orientation.x
      renderState[baseState + 4] = orientation.y
      renderState[baseState + 5] = orientation.z
      renderState[baseState + 6] = orientation.w
      telemetryState[i] = s
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
      desiredOffsetSequences[i] = []
    }

    refreshRiderPoseCache()
    const dt = 0
    ;(self as unknown as Worker).postMessage(
      { type: 'state', data: { state: renderState.buffer, telemetry: telemetryState.buffer, dt } },
      [renderState.buffer, telemetryState.buffer]
    )
    renderState = new Float32Array(N * 7)
    telemetryState = new Float32Array(N)
    } catch (error) {
      console.error('[worker] init failed', error)
    }
  }

  if (type === 'step') {
    if (!world) return // ignore steps before initialization

    try {

    const requestedDt = Number.isFinite(payload?.dt)
      ? MathUtils.clamp(payload.dt, MIN_STEP_DT, MAX_STEP_DT)
      : MIN_STEP_DT
    const currentTimestamp = getCurrentTimestamp()
    let dt = requestedDt
    if (Number.isFinite(currentTimestamp)) {
      if (lastStepTimestamp !== null && Number.isFinite(lastStepTimestamp)) {
        const elapsedSeconds = Math.max(0, (currentTimestamp - lastStepTimestamp) / 1000)
        if (elapsedSeconds > 0) {
          dt = MathUtils.clamp(elapsedSeconds, MIN_STEP_DT, MAX_STEP_DT)
        }
      }
      lastStepTimestamp = currentTimestamp
    }
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

    const lengthRatioRange = computeLengthRatioRange(maxOffset, minRadius)
    const resolvedCorneringAcceleration = Number.isFinite(corneringLateralAcceleration)
      ? Math.max(0, corneringLateralAcceleration)
      : maxLateralAcceleration

    const stepEnvironment: RiderEnvironment = {
      spline,
      totalLength,
      lookAhead,
      laneWidth,
      maxOffset,
      minRadius,
      pathBoundaryMode,
      maxTargetSpeed,
      minTargetSpeed,
      maxAcceleration,
      maxDeceleration,
      targetSpeedDamping,
      targetRiseRateLimit,
      targetDropRateLimit,
      maxLateralAcceleration,
      cornering: {
        intensityThreshold: MathUtils.clamp(corneringIntensityThreshold, 0, 1),
        coverageThreshold: MathUtils.clamp(corneringCoverageThreshold, 0, 1),
        radiusThreshold: Math.max(1, corneringRadiusThreshold),
        lateralAcceleration: resolvedCorneringAcceleration,
        severityThreshold: MathUtils.clamp(corneringSeverityThreshold, 0, 1),
        brakingExponent: hairpinBrakingExponent,
        speedFloor: cornerSpeedFloor,
        speedFloorTransition: cornerFloorTransitionFactor,
        speedMarginRatio: curveSpeedMarginRatio,
        speedMarginMin: curveSpeedMarginMin,
        speedMarginMax: curveSpeedMarginMax,
      },
      neighborBounds,
      airDensity,
      baseCdA,
      rollingResistanceCoeff,
      drivetrainEfficiency,
      systemMass,
      availablePower,
      draftingMinFactor,
      draftingMaxReduction,
      draftingCharacteristicDistance,
      gravity: GRAVITY,
      normalizedBaseWeights,
      maxOffsetRate,
      lengthRatioRange,
      segmentSampler: (startDistance, endDistance, offsets, options) =>
        sampleOffsetSegmentLengths(startDistance, endDistance, offsets, options),
      bestLine: bestLineLookup,
    }

    let snapshot: DiagnosticSnapshot | null = null

    for (let i = 0; i < N; i++) {
      const rb = bodies[i]
      const previousSpeed = speeds[i]

      const riderProps: RiderProperties = {
        index: i,
        mass: riderMasses?.[i] ?? systemMass,
        cdA: riderCdA?.[i] ?? baseCdA,
        maxPower: riderMaxPower?.[i] ?? availablePower,
        preferredSpeed: riderPreferredSpeeds?.[i] ?? NaN,
        reactionTime: riderReactionTimes?.[i] ?? 0.3,
        noiseSigma: riderNoiseSigma?.[i] ?? COMMAND_NOISE_STDDEV,
        powerWeight: riderPowerWeights?.[i] ?? normalizedBaseWeights.power,
        gapWeight: riderGapWeights?.[i] ?? normalizedBaseWeights.gap,
        noiseGenerator: noiseGenerators[i] ?? Math.random,
        desiredSequence: desiredOffsetSequences[i] ?? [],
        commandedTargetSpeed: commandedTargetSpeeds[i],
      }

      const result = planRiderStep(stepEnvironment, riderProps, {
        dt,
        progress,
        offsets,
        speeds,
        poses: riderPoses,
      })

      speeds[i] = result.newSpeed
      commandedTargetSpeeds[i] = result.commandedTargetSpeed
      offsets[i] = result.offset
      desiredOffsetSequences[i] = result.sequence
      lateralDecisions[i] = result.lateralDecision

      if (arcProgress) {
        const travel = ((previousSpeed + result.newSpeed) / 2) * dt
        arcProgress[i] += Math.max(0, travel)
      }

      let s = progress[i] + result.centerlineTravel
      if (totalLength > 0) {
        if (pathBoundaryMode === 'loop') {
          s = MathUtils.euclideanModulo(s, totalLength)
        } else {
          s = MathUtils.clamp(s, 0, totalLength)
        }
      }
      progress[i] = s

      const pose = samplePoseAtDistance(spline, s, result.offset, scratchNextPose)
      const pos = pose.position

      const surface = sampleSurfaceInfo(s)
      pos.y = surface.height + riderSurfaceOffset

      const look = spline.sampleByDistance(result.yawAheadDistance)
      const lookSurface = sampleSurfaceInfo(result.yawAheadDistance)
      const targetFrame = buildRoadFrame(look.tangent, lookSurface.normal)
      const targetOrientation = frameToQuaternion(targetFrame)
      const smoothed = smoothOrientation(
        riderOrientations[i],
        targetOrientation,
        dt,
        riderOrientations[i],
      )
      yawRates[i] = smoothed.yawRate

      rb.setNextKinematicTranslation({ x: pos.x, y: pos.y, z: pos.z })
      rb.setNextKinematicRotation({
        x: smoothed.orientation.x,
        y: smoothed.orientation.y,
        z: smoothed.orientation.z,
        w: smoothed.orientation.w,
      })
      rb.setAngvel({ x: 0, y: yawRates[i], z: 0 }, true)

      const base7 = i * 7
      renderState[base7 + 0] = pos.x
      renderState[base7 + 1] = pos.y
      renderState[base7 + 2] = pos.z
      renderState[base7 + 3] = smoothed.orientation.x
      renderState[base7 + 4] = smoothed.orientation.y
      renderState[base7 + 5] = smoothed.orientation.z
      renderState[base7 + 6] = smoothed.orientation.w
      telemetryState[i] = s

      if (i === referenceRiderIndex) {
        const acceleration = dt > 0 ? (result.newSpeed - previousSpeed) / dt : 0
        snapshot = {
          speed: result.newSpeed,
          targetRaw: result.biasedTarget,
          targetFiltered: commandedTargetSpeeds[i],
          acceleration,
          kEnv: result.curvature,
          vCorner: result.cornerSpeed,
          hairpinSeverity: result.hairpinSeverity,
          draftFactor: result.draftFactor,
          powerDemand: result.power,
        }
      }
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
      { type: 'state', data: { state: renderState.buffer, telemetry: telemetryState.buffer, dt } },
      [renderState.buffer, telemetryState.buffer]
    )
    renderState = new Float32Array(N * 7)
    telemetryState = new Float32Array(N)
    } catch (error) {
      console.error('[worker] step failed', error)
    }
  }

  if (type === 'params') {
    applyParameterOverrides(payload as SimulationParameterOverrides)
  }
}
