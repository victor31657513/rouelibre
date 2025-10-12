import { MathUtils, Vector3 } from 'three'
import { PathSpline } from '../systems/pathSmoothing'

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

export interface SegmentLengthSpeedOptions {
  /** Target speed applied when the travelled path length hits the lower bound. */
  maxSpeed: number
  /** Target speed applied when the travelled path length hits the upper bound. */
  minSpeed: number
  /**
   * Ratio between the rider specific path length and the reference distance that still grants the
   * maximum target speed. Ratios below this value are clamped.
   */
  minLengthRatioForMaxSpeed?: number
  /**
   * Ratio between the rider specific path length and the reference distance at which the minimum
   * target speed is enforced. Ratios above this value are clamped.
   */
  maxLengthRatioForMinSpeed?: number
}

export function computeLengthRatioRange(
  maxOffset: number,
  minRadius: number,
  fallback: { min: number; max: number } = { min: 0.6, max: 1.6 }
): { min: number; max: number } {
  const fallbackMin = Math.max(0.1, fallback.min)
  const fallbackMax = Math.max(fallbackMin + 1e-3, fallback.max)

  if (!isFinite(maxOffset) || !isFinite(minRadius) || minRadius <= 0) {
    return { min: fallbackMin, max: fallbackMax }
  }

  const ratioDelta = Math.abs(maxOffset) / minRadius
  if (!isFinite(ratioDelta)) {
    return { min: fallbackMin, max: fallbackMax }
  }

  const clampedDelta = MathUtils.clamp(ratioDelta, 0, 4)
  const min = Math.max(0.1, 1 - clampedDelta)
  const max = Math.max(min + 1e-3, 1 + clampedDelta)
  return { min, max }
}

export function computeOffsetSegmentLength(
  spline: PathSpline,
  startDistance: number,
  endDistance: number,
  lateralOffset: number,
  sampleCount = 12
): number {
  const safeOffset = isFinite(lateralOffset) ? lateralOffset : 0
  if (!spline || !isFinite(startDistance) || !isFinite(endDistance)) {
    return 0
  }

  const clampedStart = MathUtils.clamp(startDistance, 0, spline.totalLength)
  const clampedEnd = MathUtils.clamp(endDistance, 0, spline.totalLength)
  const travel = clampedEnd - clampedStart
  if (!isFinite(travel) || travel <= 0) {
    return 0
  }

  const steps = Math.max(1, Math.floor(sampleCount))
  const segmentCount = Math.max(1, steps)
  const stepSize = travel / segmentCount
  const right = new Vector3()
  let total = 0
  let previousPosition: Vector3 | null = null

  for (let i = 0; i <= segmentCount; i++) {
    const distance = Math.min(clampedStart + stepSize * i, spline.totalLength)
    const sample = spline.sampleByDistance(distance)
    right.set(-sample.tangent.z, 0, sample.tangent.x).normalize()
    const position = sample.position.clone().addScaledVector(right, safeOffset)

    if (previousPosition) {
      total += position.distanceTo(previousPosition)
    }

    previousPosition = position
  }

  return total
}

export function computeTargetSpeedFromSegmentLength(
  segmentLength: number,
  referenceLength: number,
  options: SegmentLengthSpeedOptions
): number {
  const {
    maxSpeed,
    minSpeed,
    minLengthRatioForMaxSpeed = 0.6,
    maxLengthRatioForMinSpeed = 1.6,
  } = options

  if (!isFinite(maxSpeed)) {
    return maxSpeed
  }

  if (!isFinite(minSpeed)) {
    return maxSpeed
  }

  const safeReference = Math.max(1e-3, referenceLength)
  const rawRatio = isFinite(segmentLength) ? segmentLength / safeReference : 1
  const rangeMin = Math.min(minLengthRatioForMaxSpeed, maxLengthRatioForMinSpeed)
  const rangeMax = Math.max(minLengthRatioForMaxSpeed, maxLengthRatioForMinSpeed)
  const clampedRatio = MathUtils.clamp(rawRatio, rangeMin, rangeMax)
  const denominator = rangeMax - rangeMin
  const t = denominator <= 0 ? 0 : (clampedRatio - rangeMin) / denominator
  const interpolated = MathUtils.lerp(minSpeed, maxSpeed, t)

  return MathUtils.clamp(interpolated, Math.min(minSpeed, maxSpeed), Math.max(minSpeed, maxSpeed))
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
