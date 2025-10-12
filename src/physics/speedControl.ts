import { MathUtils, Vector3 } from 'three'
import { PathSpline } from '../systems/pathSmoothing'
import { steerOffsetTowardTarget } from './riderPathing'

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

const scratchRight = new Vector3()
const scratchPosition = new Vector3()

export interface SafeSpeedEstimateOptions {
  spline: PathSpline
  totalLength: number
  currentDistance: number
  currentOffset: number
  desiredOffset: number
  neighborMin: number
  neighborMax: number
  lookAheadDistance: number
  maxOffset: number
  maxOffsetRate: number
  maxTargetSpeed: number
  minTargetSpeed?: number
  dt: number
}

function wrapDistance(distance: number, totalLength: number): number {
  if (totalLength <= 0) return distance
  return MathUtils.euclideanModulo(distance, totalLength)
}

function isFiniteNumber(value: number): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function estimateSafeTargetSpeed(options: SafeSpeedEstimateOptions): number {
  const {
    spline,
    totalLength,
    currentDistance,
    currentOffset,
    desiredOffset,
    neighborMin,
    neighborMax,
    lookAheadDistance,
    maxOffset,
    maxOffsetRate,
    maxTargetSpeed,
    minTargetSpeed = 0,
    dt,
  } = options

  if (!spline || !isFiniteNumber(maxTargetSpeed) || maxTargetSpeed <= 0) {
    return Math.max(0, maxTargetSpeed)
  }

  const safeDt = isFiniteNumber(dt) && dt > 0 ? dt : 0
  const safeLookAhead = isFiniteNumber(lookAheadDistance) ? Math.max(0, lookAheadDistance) : 0
  if (safeLookAhead <= 1e-3 || safeDt <= 0) {
    const minSpeed = Math.max(0, Math.min(maxTargetSpeed, minTargetSpeed))
    return Math.max(minSpeed, Math.max(0, maxTargetSpeed))
  }

  const clampedMinBound = Math.max(-maxOffset, neighborMin)
  const clampedMaxBound = Math.min(maxOffset, neighborMax)
  if (clampedMinBound > clampedMaxBound) {
    return 0
  }

  const eps = 1e-3
  const maxSpeed = Math.max(0, maxTargetSpeed)

  const isSpeedSafe = (speed: number): boolean => {
    if (!isFiniteNumber(speed) || speed <= 0) {
      return true
    }

    const safeSpeed = Math.max(0, speed)
    const distancePerStep = Math.max(safeSpeed * safeDt, safeLookAhead / 8)
    const stepCount = Math.max(1, Math.ceil(safeLookAhead / Math.max(distancePerStep, eps)))
    const stepDistance = safeLookAhead / stepCount
    const stepTime = stepDistance / Math.max(safeSpeed, eps)
    let offset = MathUtils.clamp(currentOffset, clampedMinBound, clampedMaxBound)

    for (let step = 1; step <= stepCount; step++) {
      const traveled = stepDistance * step
      const nextDistance = wrapDistance(currentDistance + traveled, totalLength)
      const sampleDistance = MathUtils.clamp(nextDistance, 0, spline.totalLength)
      const sample = spline.sampleByDistance(sampleDistance)
      scratchRight.set(-sample.tangent.z, 0, sample.tangent.x).normalize()
      scratchPosition.copy(sample.position).addScaledVector(scratchRight, offset)

      offset = steerOffsetTowardTarget(
        offset,
        desiredOffset,
        clampedMinBound,
        clampedMaxBound,
        stepTime,
        maxOffsetRate
      )

      if (offset < clampedMinBound - eps || offset > clampedMaxBound + eps) {
        return false
      }
      if (Math.abs(offset) > maxOffset + eps) {
        return false
      }
      if (
        !Number.isFinite(scratchPosition.x) ||
        !Number.isFinite(scratchPosition.y) ||
        !Number.isFinite(scratchPosition.z)
      ) {
        return false
      }
    }

    return true
  }

  if (isSpeedSafe(maxSpeed)) {
    return maxSpeed
  }

  let best = 0
  let low = 0
  let high = maxSpeed
  for (let i = 0; i < 16; i++) {
    const mid = (low + high) / 2
    if (isSpeedSafe(mid)) {
      best = mid
      low = mid
    } else {
      high = mid
    }
  }

  const minSpeed = Math.max(0, Math.min(maxSpeed, minTargetSpeed))
  if (best >= minSpeed) {
    return Math.max(minSpeed, best)
  }

  return best
}
