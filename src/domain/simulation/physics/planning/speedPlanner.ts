import { MathUtils } from 'three'
import type { BaselineSpeedPlan, SpeedPlanResult } from './types'
import { sampleNormal } from './riderManagement'

export const SOCIAL_TAU = 0.6
export const GAP_MIN_LONG = 1.1
export const HEADWAY_TIME = 0.4
export const LONGITUDINAL_REPULSION_GAIN = 3.0
export const LATERAL_FORCE_DRAG = 0.45
export const COMMAND_NOISE_STDDEV = 0.1
const CURVE_SCRUB_RELIEF_GAIN = 0.35
const CURVE_SCRUB_RELIEF_CLAMP = 0.65

const CURVE_SPEED_MARGIN_RATIO = 0.04
const CURVE_SPEED_MARGIN_MIN = 0.05
const CURVE_SPEED_MARGIN_MAX = 0.25
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
  marginRatio?: number
  maxSpeedMargin?: number
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
    minSpeedMargin = CURVE_SPEED_MARGIN_MIN,
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
  const marginSeed = MathUtils.clamp(
    safeMaxSpeed * Math.max(0, options.marginRatio ?? CURVE_SPEED_MARGIN_RATIO),
    Math.max(0, minSpeedMargin),
    options.maxSpeedMargin !== undefined
      ? Math.max(Math.max(0, minSpeedMargin), options.maxSpeedMargin)
      : CURVE_SPEED_MARGIN_MAX,
  )
  const margin = marginSeed * (1 - activation)
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
  const { vCorner, vPower, effectiveMaxTargetSpeed, effectiveMinTargetSpeed, personalMax } = input

  const candidateSpeeds = [vCorner, vPower, effectiveMaxTargetSpeed].filter(
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
  availablePower: number
  mass: number
  maxLateralAcceleration: number
  localCurvature: number
  yawDampingGain?: number
  rollingResistanceCoeff: number
  gravity: number
}

function computeCurveScrubRelief(
  localCurvature: number,
  speed: number,
  rollingResistanceCoeff: number,
  gravity: number,
): { yawAttenuation: number; frictionRelief: number } {
  if (!(Number.isFinite(localCurvature) && Number.isFinite(speed))) {
    return { yawAttenuation: 1, frictionRelief: 0 }
  }

  const yawRate = Math.abs(localCurvature * speed)
  if (yawRate <= 1e-6) {
    return { yawAttenuation: 1, frictionRelief: 0 }
  }

  const baseResistance = Math.max(0, rollingResistanceCoeff) * Math.max(0, gravity)
  const reliefTarget = MathUtils.clamp(
    yawRate * CURVE_SCRUB_RELIEF_GAIN,
    0,
    CURVE_SCRUB_RELIEF_CLAMP,
  )

  const yawAttenuation = MathUtils.clamp(1 - reliefTarget * 0.55, 0.35, 1)
  const frictionRelief = baseResistance * reliefTarget

  return { yawAttenuation, frictionRelief }
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
    slope,
    gapAhead,
    gapThreshold,
    repulsionGain,
    referencePower,
    powerWeight,
    maxAcceleration,
    maxDeceleration,
    lateralForce,
    availablePower,
    mass,
    maxLateralAcceleration,
    localCurvature,
    yawDampingGain = 0.9,
    rollingResistanceCoeff,
    gravity,
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

  const safeMass = Math.max(1, mass)
  const safeSpeed = Math.max(previousSpeed, 0.8)
  const powerAccelBudget = availablePower > 0
    ? availablePower / (safeMass * safeSpeed)
    : maxAcceleration
  const curvatureSpeedLimit = localCurvature > 1e-6 && maxLateralAcceleration > 0
    ? Math.sqrt(maxLateralAcceleration / Math.max(localCurvature, 1e-6))
    : Infinity
  const curvatureAccelBudget = Number.isFinite(curvatureSpeedLimit)
    ? (curvatureSpeedLimit - previousSpeed) / Math.max(dt, 1e-3)
    : Infinity
  const positiveBudget = Math.max(
    0,
    Math.min(
      Math.abs(maxAcceleration),
      Math.max(0, powerAccelBudget),
      Math.max(0, curvatureAccelBudget),
    ),
  )

  const maxRise = Math.min(targetRiseRateLimit * dt, positiveBudget * dt)
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

  const responseTime = Math.max(
    SOCIAL_TAU * MathUtils.clamp(referencePower / Math.max(powerWeight, 1e-3), 0.7, 1.3),
    1e-3,
  )
  const yawRate = Math.abs(previousSpeed * localCurvature)
  const curveScrub = computeCurveScrubRelief(
    localCurvature,
    previousSpeed,
    rollingResistanceCoeff,
    gravity,
  )
  const dampingFactor = 1 /
    (1 + Math.max(0, yawDampingGain) * yawRate * curveScrub.yawAttenuation)

  const baseAccel = ((slopeAdjustedTarget - previousSpeed) / responseTime) * dampingFactor
  const lateralPenalty = Math.max(
    0,
    LATERAL_FORCE_DRAG * Math.abs(lateralForce) - curveScrub.frictionRelief,
  )
  const desiredAccel = baseAccel >= 0 ? Math.max(0, baseAccel - lateralPenalty) : baseAccel - lateralPenalty

  const longitudinalRepulsion = gapAhead > 0 && gapAhead < gapThreshold
    ? -repulsionGain * MathUtils.smoothstep(gapAhead, gapThreshold * 0.25, gapThreshold)
    : 0

  const accelInput = desiredAccel + longitudinalRepulsion
  const positiveAccel = Math.min(accelInput, positiveBudget)
  const clampedAccel = accelInput >= 0
    ? Math.min(positiveAccel, Math.abs(maxAcceleration))
    : Math.max(accelInput, -Math.abs(maxDeceleration))

  let newSpeed = previousSpeed + clampedAccel * dt
  if (!Number.isFinite(newSpeed) || newSpeed < 0) {
    newSpeed = 0
  }
  newSpeed = MathUtils.clamp(newSpeed, Math.max(0, adaptiveMinSpeed - 0.5), personalMax + 0.5)

  const rampTime = slopeAdjustedTarget > previousSpeed && positiveBudget > 1e-6
    ? (slopeAdjustedTarget - previousSpeed) / positiveBudget
    : 0

  return {
    commandedTargetSpeed: nextCommand,
    newSpeed,
    biasedTarget,
    rampTime,
  }
}
