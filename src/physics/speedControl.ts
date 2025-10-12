import { MathUtils } from 'three'

export interface SlopeAdjustmentOptions {
  /**
   * Maximum absolute slope considered when computing the adjustment, expressed as rise over run.
   * Slopes beyond this threshold are clamped to avoid unrealistic boosts or penalties.
   */
  maxSlope?: number
  /** Maximum speed reduction applied when climbing the steepest admissible slope. */
  maxUphillPenalty?: number
  /** Maximum speed increase applied when descending the steepest admissible slope. */
  maxDownhillBoost?: number
  /** Lower bound applied to the adjusted target speed. */
  minSpeed?: number
  /** Upper bound applied to the adjusted target speed. */
  maxSpeed?: number
}

export function computeTargetSpeed(
  curvature: number,
  maxTargetSpeed: number,
  minTargetSpeed: number,
  curvatureForMinSpeed: number
): number {
  if (!isFinite(curvature) || curvature <= 0) {
    return maxTargetSpeed
  }
  if (!isFinite(curvatureForMinSpeed) || curvatureForMinSpeed <= 0) {
    return MathUtils.clamp(maxTargetSpeed, minTargetSpeed, maxTargetSpeed)
  }

  const t = MathUtils.clamp(curvature / curvatureForMinSpeed, 0, 1)
  return MathUtils.lerp(maxTargetSpeed, minTargetSpeed, t)
}

export function adjustSpeedTowardsTarget(
  currentSpeed: number,
  targetSpeed: number,
  dt: number,
  maxAcceleration: number,
  maxDeceleration: number
): number {
  if (!isFinite(dt) || dt <= 0) {
    return currentSpeed
  }

  const delta = targetSpeed - currentSpeed
  if (delta === 0) {
    return currentSpeed
  }

  const accelLimit = Math.max(0, maxAcceleration) * dt
  const decelLimit = Math.max(0, maxDeceleration) * dt
  const minDelta = -decelLimit
  const maxDelta = accelLimit

  const clampedDelta = MathUtils.clamp(delta, minDelta, maxDelta)
  return currentSpeed + clampedDelta
}

export function adjustTargetSpeedForSlope(
  baseSpeed: number,
  slope: number,
  options: SlopeAdjustmentOptions = {}
): number {
  const {
    maxSlope = 0.25,
    maxUphillPenalty = 2,
    maxDownhillBoost = 1,
    minSpeed = 0,
    maxSpeed = Infinity,
  } = options

  if (!isFinite(baseSpeed)) {
    return MathUtils.clamp(baseSpeed, minSpeed, maxSpeed)
  }

  if (!isFinite(slope) || slope === 0 || maxSlope <= 0) {
    return MathUtils.clamp(baseSpeed, minSpeed, maxSpeed)
  }

  const clampedSlope = MathUtils.clamp(slope, -maxSlope, maxSlope)
  const slopeRatio = Math.abs(clampedSlope) / maxSlope

  let adjustedSpeed = baseSpeed
  if (clampedSlope > 0) {
    adjustedSpeed -= slopeRatio * Math.max(0, maxUphillPenalty)
  } else if (clampedSlope < 0) {
    adjustedSpeed += slopeRatio * Math.max(0, maxDownhillBoost)
  }

  return MathUtils.clamp(adjustedSpeed, minSpeed, maxSpeed)
}
