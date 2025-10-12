import { MathUtils } from 'three'

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
