import { MathUtils } from 'three'
import type { BaselineSpeedPlan, SpeedPlanResult } from './types'
import { sampleNormal } from './riderManagement'

export const SOCIAL_TAU = 0.6
export const GAP_MIN_LONG = 1.1
export const HEADWAY_TIME = 0.4
export const LONGITUDINAL_REPULSION_GAIN = 3.0
export const COMMAND_NOISE_STDDEV = 0.1

const MIN_CURVE_SPEED_MARGIN = 0.35
const HAIRPIN_RADIUS_TIGHT = 16
const HAIRPIN_RADIUS_RELAXED = 40
const HAIRPIN_ACTIVATION_THRESHOLD = 0.35

export function computeAdaptiveMinSpeed(
  vTargetRaw: number,
  effectiveMinTargetSpeed: number,
): number {
  return Math.max(0, Math.min(vTargetRaw, effectiveMinTargetSpeed))
}

interface HairpinOptions {
  curvatureEnvelope: {
    coverageRatio?: number
    intensity?: number
  }
  localCurvature: number
  maxTargetSpeed: number
  candidateSpeed: number
  minSpeedMargin?: number
  activationThreshold?: number
}

export function evaluateHairpinCornering(options: HairpinOptions): {
  activation: number
  cornerSpeed: number
} {
  const {
    curvatureEnvelope,
    localCurvature,
    maxTargetSpeed,
    candidateSpeed,
    minSpeedMargin = MIN_CURVE_SPEED_MARGIN,
    activationThreshold = HAIRPIN_ACTIVATION_THRESHOLD,
  } = options

  const safeMaxSpeed = Number.isFinite(maxTargetSpeed) ? Math.max(0, maxTargetSpeed) : 0

  if (!(safeMaxSpeed > 0)) {
    return { activation: 0, cornerSpeed: 0 }
  }

  const coverage = MathUtils.clamp(curvatureEnvelope.coverageRatio ?? 0, 0, 1)
  const intensity = MathUtils.clamp(curvatureEnvelope.intensity ?? 0, 0, 1)
  const localCurvatureSafe = Number.isFinite(localCurvature)
    ? Math.max(0, localCurvature)
    : 0
  const localRadius = localCurvatureSafe > 1e-6 ? 1 / localCurvatureSafe : Infinity

  const radiusSeverity = Number.isFinite(localRadius)
    ? 1 - MathUtils.smoothstep(localRadius, HAIRPIN_RADIUS_TIGHT, HAIRPIN_RADIUS_RELAXED)
    : 0
  const sustainedSeverity = Math.pow(coverage, 1.2)
  const curvatureSeverity = Math.pow(intensity, 1.1)
  const combinedSeed = Math.max(
    radiusSeverity,
    curvatureSeverity * (0.6 + 0.4 * sustainedSeverity),
  )

  const activation = MathUtils.clamp(
    (combinedSeed - activationThreshold) / Math.max(1 - activationThreshold, 1e-3),
    0,
    1,
  )

  if (activation <= 0) {
    return { activation: 0, cornerSpeed: safeMaxSpeed }
  }

  const safeCandidate = Number.isFinite(candidateSpeed) && candidateSpeed > 0
    ? Math.min(candidateSpeed, safeMaxSpeed)
    : safeMaxSpeed

  const baseline = MathUtils.lerp(safeMaxSpeed, safeCandidate, activation)
  const margin = MathUtils.clamp(minSpeedMargin * (1 - activation), 0, safeMaxSpeed)
  const reduced = baseline - margin
  const cornerSpeed = Math.max(safeCandidate, Math.min(safeMaxSpeed, reduced))

  return { activation, cornerSpeed }
}

export interface BaselineSpeedInput {
  vCorner: number
  vPower: number
  effectiveMaxTargetSpeed: number
  effectiveMinTargetSpeed: number
  personalMax: number
}

export function computeBaselineSpeedPlan(input: BaselineSpeedInput): BaselineSpeedPlan {
  const { vCorner, effectiveMaxTargetSpeed, effectiveMinTargetSpeed, personalMax } = input

  const candidateSpeeds = [vCorner, effectiveMaxTargetSpeed].filter(
    (value) => Number.isFinite(value) && value > 0,
  )
  const rawTarget =
    candidateSpeeds.length > 0
      ? Math.min(...candidateSpeeds)
      : effectiveMaxTargetSpeed
  const adaptiveMinSpeed = computeAdaptiveMinSpeed(rawTarget, effectiveMinTargetSpeed)
  const targetSpeed = MathUtils.clamp(rawTarget, adaptiveMinSpeed, personalMax)
  const planningSpeed = Math.max(0.1, effectiveMaxTargetSpeed)

  return {
    targetSpeed,
    adaptiveMinSpeed,
    planningSpeed,
    rawTarget,
  }
}

export interface FinalizeSpeedPlanInput {
  previousSpeed: number
  commandedTargetSpeed: number
  targetSpeed: number
  compensation: number
  adaptiveMinSpeed: number
  personalMax: number
  preferredSpeed: number
  noiseSigma: number
  noiseGenerator: () => number
  dt: number
  targetRiseRateLimit: number
  targetDropRateLimit: number
  targetSpeedDamping: number
  reactionTime: number
  slope: number
  gapAhead: number
  gapThreshold: number
  repulsionGain: number
  referencePower: number
  powerWeight: number
  maxAcceleration: number
  maxDeceleration: number
  lateralForce: number
}

export function finalizeSpeedPlan(input: FinalizeSpeedPlanInput): SpeedPlanResult {
  const {
    previousSpeed,
    commandedTargetSpeed,
    targetSpeed,
    compensation,
    adaptiveMinSpeed,
    personalMax,
    preferredSpeed,
    noiseSigma,
    noiseGenerator,
    dt,
    targetRiseRateLimit,
    targetDropRateLimit,
    targetSpeedDamping,
    reactionTime,
    referencePower,
    powerWeight,
    maxAcceleration,
    maxDeceleration,
  } = input

  const compensatedTarget = MathUtils.clamp(
    targetSpeed * compensation,
    adaptiveMinSpeed,
    personalMax,
  )

  const commandNoise = sampleNormal(noiseGenerator, 0, noiseSigma)
  const baseTarget = MathUtils.clamp(
    compensatedTarget + commandNoise,
    adaptiveMinSpeed,
    personalMax,
  )
  const preferenceBias = MathUtils.clamp(preferredSpeed - baseTarget, -0.6, 0.6)
  const biasedTarget = MathUtils.clamp(
    baseTarget + preferenceBias * 0.2,
    adaptiveMinSpeed,
    personalMax,
  )

  const maxRise = targetRiseRateLimit * dt
  const maxDrop = targetDropRateLimit * dt
  let bounded = biasedTarget
  if (bounded > commandedTargetSpeed + maxRise) bounded = commandedTargetSpeed + maxRise
  if (bounded < commandedTargetSpeed - maxDrop) bounded = commandedTargetSpeed - maxDrop

  const dampingAlpha = 1 - Math.exp(-targetSpeedDamping * dt)
  const reactionAlpha = 1 - Math.exp(-dt / reactionTime)
  const combinedAlpha = MathUtils.clamp(
    1 - (1 - dampingAlpha) * (1 - reactionAlpha),
    0,
    1,
  )

  const nextCommand = commandedTargetSpeed + (bounded - commandedTargetSpeed) * combinedAlpha

  const slopeAdjustedTarget = nextCommand

  const longitudinalRepulsion = 0

  const baseAccel =
    (slopeAdjustedTarget - previousSpeed) /
    Math.max(
      SOCIAL_TAU * MathUtils.clamp(referencePower / Math.max(powerWeight, 1e-3), 0.7, 1.3),
      1e-3,
    )
  // Preserve the longitudinal command even when riders adjust their line in a
  // corner so that lateral motion alone does not introduce artificial drag.
  const desiredAccel = baseAccel
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
  newSpeed = MathUtils.clamp(newSpeed, Math.max(0, adaptiveMinSpeed - 0.5), personalMax + 0.5)

  return {
    commandedTargetSpeed: nextCommand,
    newSpeed,
    biasedTarget,
  }
}
