import { MathUtils } from 'three'
import { computeAheadSampleDistance } from '../lookAhead'
import {
  computeCurvatureEnvelope,
  computeSignedCurvature,
  steerOffsetTowardTarget,
} from '../riderPathing'
import {
  computeCorneringSpeedFromEnvelope,
  projectWorldDistanceOntoCenterline,
  type SegmentSamplingOptions,
} from '../speedControl'
import { draftingFactor, powerDemand, solveVelocityFromPower } from '../aero'
import type {
  OffsetPhaseQueueEntry,
  OffsetPlanResult,
  PathBoundaryMode,
  PathSpline,
  RiderPose,
  WeightTriple,
} from './types'
import {
  COMMAND_NOISE_STDDEV,
  GAP_MIN_LONG,
  HEADWAY_TIME,
  LONGITUDINAL_REPULSION_GAIN,
  computeBaselineSpeedPlan,
  evaluateHairpinCornering,
  finalizeSpeedPlan,
} from './speedPlanner'
import { planOffset } from './offsetPlanner'
import {
  computeDraftingContext,
  computeLongitudinalGaps,
  computeSlope,
  normalizeWeights,
} from './riderManagement'

export interface RiderEnvironment {
  spline: PathSpline
  totalLength: number
  lookAhead: number
  laneWidth: number
  maxOffset: number
  minRadius: number
  pathBoundaryMode: PathBoundaryMode
  maxTargetSpeed: number
  minTargetSpeed: number
  maxAcceleration: number
  maxDeceleration: number
  targetSpeedDamping: number
  targetRiseRateLimit: number
  targetDropRateLimit: number
  maxLateralAcceleration: number
  /**
   * Thresholds driving the adaptive cornering classification and braking model.
   * Intensity and coverage are expressed as normalised ratios while the radius
   * threshold is given in metres. The lateral acceleration targets the braking
   * force applied when a hairpin is detected.
   */
  cornering: {
    intensityThreshold: number
    coverageThreshold: number
    radiusThreshold: number
    lateralAcceleration: number
  }
  neighborBounds: {
    min: Float32Array
    max: Float32Array
    hasNeighbor: boolean[]
  }
  airDensity: number
  baseCdA: number
  rollingResistanceCoeff: number
  drivetrainEfficiency: number
  systemMass: number
  availablePower: number
  draftingMinFactor: number
  draftingMaxReduction: number
  draftingCharacteristicDistance: number
  gravity: number
  normalizedBaseWeights: WeightTriple
  maxOffsetRate: number
  lengthRatioRange: { min: number; max: number }
  segmentSampler?: (
    startDistance: number,
    endDistance: number,
    offsets: readonly number[],
    options?: SegmentSamplingOptions,
  ) => number[]
}

export interface RiderProperties {
  index: number
  mass: number
  cdA: number
  maxPower: number
  preferredSpeed: number
  reactionTime: number
  noiseSigma: number
  powerWeight: number
  gapWeight: number
  noiseGenerator: () => number
  desiredSequence: OffsetPhaseQueueEntry[]
  commandedTargetSpeed: number
}

export interface RiderStateInput {
  dt: number
  progress: Float32Array
  offsets: Float32Array
  speeds: Float32Array
  poses?: RiderPose[]
}

export interface RiderStepResult {
  newSpeed: number
  commandedTargetSpeed: number
  offset: number
  plannedOffset: number
  lateralDecision: OffsetPlanResult['lateralDecision']
  sequence: OffsetPhaseQueueEntry[]
  compensation: number
  targetSpeed: number
  adaptiveMinSpeed: number
  cornerSpeed: number
  slope: number
  curvature: number
  draftFactor: number
  power: number
  biasedTarget: number
  centerlineTravel: number
  yawAheadDistance: number
}

export function planRiderStep(
  env: RiderEnvironment,
  rider: RiderProperties,
  state: RiderStateInput,
): RiderStepResult {
  const { index, mass, cdA, maxPower, preferredSpeed, reactionTime, noiseSigma, powerWeight, gapWeight, noiseGenerator } = rider
  const { dt, progress, offsets, speeds, poses } = state
  const {
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
    cornering,
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
    gravity,
    normalizedBaseWeights,
    maxOffsetRate,
    segmentSampler,
  } = env

  const previousSpeed = speeds[index]
  const currentOffset = MathUtils.clamp(offsets[index], -maxOffset, maxOffset)
  const currentDistance = progress[index]

  const weightSet = normalizeWeights(
    Number.isFinite(powerWeight) ? powerWeight : normalizedBaseWeights.power,
    Number.isFinite(gapWeight) ? gapWeight : normalizedBaseWeights.gap,
    normalizedBaseWeights.wall,
    normalizedBaseWeights,
  )
  const riderPowerWeight = weightSet.power
  const riderGapWeight = weightSet.gap
  const baseWallWeight = Math.max(0.05, weightSet.wall)
  const referenceGap = Math.max(normalizedBaseWeights.gap, 1e-3)
  const referencePower = Math.max(normalizedBaseWeights.power, 1e-3)
  const gapResponsiveness = MathUtils.clamp(riderGapWeight / referenceGap, 0.6, 1.4)
  const repulsionGain =
    LONGITUDINAL_REPULSION_GAIN * MathUtils.clamp(riderGapWeight / referenceGap, 0.7, 1.4)

  const effectiveMaxTargetSpeed = Math.max(0, maxTargetSpeed)
  const effectiveMinTargetSpeed = Math.max(0, Math.min(effectiveMaxTargetSpeed, minTargetSpeed))
  let personalMin = Math.max(effectiveMinTargetSpeed, preferredSpeed - 1.5)
  let personalMax = Math.min(effectiveMaxTargetSpeed, preferredSpeed + 1.5)
  if (personalMin > personalMax) {
    const neutral = MathUtils.clamp(preferredSpeed, effectiveMinTargetSpeed, effectiveMaxTargetSpeed)
    personalMin = neutral
    personalMax = neutral
  }

  const {
    sampleDistance: aheadSampleDistance,
    travelDistance: lookAheadDistance,
  } = computeAheadSampleDistance(currentDistance, lookAhead, totalLength, pathBoundaryMode)

  const minBound = neighborBounds.min[index]
  const maxBound = neighborBounds.max[index]
  const hasNeighbor = neighborBounds.hasNeighbor?.[index] ?? false

  let slope = 0
  if (lookAheadDistance > 1e-3) {
    const travelDistance = Math.max(lookAheadDistance, 1e-3)
    const currentSample = spline.sampleByDistance(currentDistance)
    const aheadSample = spline.sampleByDistance(aheadSampleDistance)
    slope = computeSlope(currentSample.position, aheadSample.position, travelDistance)
  }

  const curvatureEnvelope = computeCurvatureEnvelope(
    spline,
    progress[index],
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
  const curvatureCap = minRadius > 0 && Number.isFinite(minRadius) ? 1 / minRadius : Infinity
  const boundedCurvature = Number.isFinite(curvatureCap) && curvatureCap > 0
    ? Math.min(rawCurvature, curvatureCap)
    : rawCurvature
  const kEnv = Math.max(boundedCurvature, 0)

  let cornerCandidate = effectiveMaxTargetSpeed
  if (maxLateralAcceleration > 0) {
    const candidate = computeCorneringSpeedFromEnvelope(
      { ...curvatureEnvelope, maxAbsCurvature: kEnv },
      {
        maxLateralAcceleration,
        sustainedBlendStart: 0.2,
        sustainedBlendEnd: 0.8,
        coverageExponent: 1.35,
        reliefFactor: 0.25,
        spikeRetention: 0.35,
        hairpinLateralAcceleration: cornering.lateralAcceleration,
        classificationOptions: {
          hairpinIntensityThreshold: cornering.intensityThreshold,
          hairpinCoverageThreshold: cornering.coverageThreshold,
          hairpinRadiusThreshold: cornering.radiusThreshold,
        },
      },
    )
    if (Number.isFinite(candidate) && candidate > 0) {
      cornerCandidate = Math.min(cornerCandidate, candidate)
    }
  }

  const { cornerSpeed: vCorner } = evaluateHairpinCornering({
    curvatureEnvelope,
    localCurvature: kEnv,
    maxTargetSpeed: effectiveMaxTargetSpeed,
    candidateSpeed: cornerCandidate,
  })

  const slipLookahead = lookAheadDistance > 0
    ? Math.min(Math.max(lookAheadDistance, 2), 12)
    : 12
  const draftingContext = computeDraftingContext(
    index,
    progress,
    offsets,
    spline,
    totalLength,
    slipLookahead,
    poses,
  )
  const draftFactor = MathUtils.clamp(
    draftingFactor(draftingContext.gapToLeader, draftingContext.leadersAhead, {
      minFactor: draftingMinFactor,
      maxReduction: draftingMaxReduction,
      characteristicDistance: draftingCharacteristicDistance,
    }),
    0,
    1,
  )

  const riderCdA = Number.isFinite(cdA) ? cdA : baseCdA
  const CdAeff = Math.max(0, riderCdA * draftFactor)
  const { gapAhead } = computeLongitudinalGaps(index, progress, offsets, spline, totalLength, poses)
  const gapThreshold = GAP_MIN_LONG + HEADWAY_TIME * gapResponsiveness * previousSpeed

  const riderMass = Number.isFinite(mass) ? mass : systemMass
  const riderMaxPower = Number.isFinite(maxPower) ? maxPower : availablePower
  const riderPreferredSpeed = Number.isFinite(preferredSpeed)
    ? preferredSpeed
    : MathUtils.clamp(
        (effectiveMinTargetSpeed + effectiveMaxTargetSpeed) / 2,
        effectiveMinTargetSpeed,
        effectiveMaxTargetSpeed,
      )
  const riderReaction = Math.max(Number.isFinite(reactionTime) ? reactionTime : 0.3, 0.05)
  const riderNoiseSigma = Number.isFinite(noiseSigma) ? noiseSigma : COMMAND_NOISE_STDDEV

  const vPower = solveVelocityFromPower(riderMaxPower, {
    airDensity,
    cdA: CdAeff,
    crr: rollingResistanceCoeff,
    mass: riderMass,
    slope,
    gravity,
    drivetrainEfficiency,
  })

  const baselinePlan = computeBaselineSpeedPlan({
    vCorner,
    vPower,
    effectiveMaxTargetSpeed,
    effectiveMinTargetSpeed,
    personalMax,
  })

  const planningSpeed = baselinePlan.planningSpeed
  const availableTime = lookAheadDistance > 0 ? lookAheadDistance / planningSpeed : 0

  const offsetPlan: OffsetPlanResult = planOffset({
    currentOffset,
    currentDistance,
    minBound,
    maxBound,
    hasLateralNeighbor: hasNeighbor,
    laneWidth,
    maxOffset,
    lookAheadDistance,
    lookAhead,
    totalLength,
    spline,
    minRadius,
    pathBoundaryMode,
    targetSpeed: baselinePlan.targetSpeed,
    adaptiveMinSpeed: baselinePlan.adaptiveMinSpeed,
    personalMax,
    slope,
    lengthRatioRange: env.lengthRatioRange,
    availableTime,
    maxOffsetRate,
    sequence: rider.desiredSequence ?? [],
    segmentSampler,
    powerWeight: riderPowerWeight,
    gapWeight: riderGapWeight,
    baseWallWeight,
    gapAhead,
    gapThreshold,
    mass: riderMass,
    cdA: riderCdA,
    airDensity,
    rollingResistanceCoeff,
    gravity,
    drivetrainEfficiency,
    maxPower: riderMaxPower,
  })

  const speedResult: SpeedPlanResult = finalizeSpeedPlan({
    previousSpeed,
    commandedTargetSpeed: rider.commandedTargetSpeed,
    targetSpeed: baselinePlan.targetSpeed,
    compensation: offsetPlan.compensation,
    adaptiveMinSpeed: baselinePlan.adaptiveMinSpeed,
    personalMax,
    preferredSpeed: riderPreferredSpeed,
    noiseSigma: riderNoiseSigma,
    noiseGenerator: noiseGenerator ?? Math.random,
    dt,
    targetRiseRateLimit,
    targetDropRateLimit,
    targetSpeedDamping,
    reactionTime: riderReaction,
    slope,
    gapAhead,
    gapThreshold,
    repulsionGain,
    referencePower,
    powerWeight: riderPowerWeight,
    maxAcceleration,
    maxDeceleration,
    lateralForce: offsetPlan.lateralDecision.lateralForce,
  })

  const nextOffset = steerOffsetTowardTarget(
    currentOffset,
    offsetPlan.plannedOffset,
    minBound,
    maxBound,
    dt,
    maxOffsetRate,
  )

  const travel = ((previousSpeed + speedResult.newSpeed) / 2) * dt
  const curvature = computeSignedCurvature(
    spline,
    progress[index],
    totalLength,
    undefined,
    pathBoundaryMode,
  )
  const centerlineTravel = projectWorldDistanceOntoCenterline(travel, curvature, nextOffset, {
    minRatio: env.lengthRatioRange.min,
    maxRatio: env.lengthRatioRange.max,
  })

  const yawAhead = computeAheadSampleDistance(progress[index] + centerlineTravel, lookAhead, totalLength, pathBoundaryMode)

  const diagnosticPower = powerDemand(speedResult.newSpeed, {
    airDensity,
    cdA: riderCdA,
    crr: rollingResistanceCoeff,
    mass: riderMass,
    slope,
    gravity,
    drivetrainEfficiency,
  })

  return {
    newSpeed: speedResult.newSpeed,
    commandedTargetSpeed: speedResult.commandedTargetSpeed,
    offset: MathUtils.clamp(nextOffset, -maxOffset, maxOffset),
    plannedOffset: offsetPlan.plannedOffset,
    lateralDecision: offsetPlan.lateralDecision,
    sequence: offsetPlan.updatedSequence,
    compensation: offsetPlan.compensation,
    targetSpeed: baselinePlan.targetSpeed,
    adaptiveMinSpeed: baselinePlan.adaptiveMinSpeed,
    cornerSpeed: vCorner,
    slope,
    curvature: kEnv,
    draftFactor,
    power: diagnosticPower,
    biasedTarget: speedResult.biasedTarget,
    centerlineTravel,
    yawAheadDistance: yawAhead.sampleDistance,
  }
}
