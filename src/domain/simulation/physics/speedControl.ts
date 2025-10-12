/**
 * Utilities that compute safe target speeds for riders based on curvature,
 * slope and neighbour positions.
 *
 * Extension: expose additional heuristics (e.g. drafting) by composing new
 * helpers here rather than inside the worker loop.
 */
import { MathUtils, Vector3 } from 'three'
import { PathSpline } from '../../route/pathSpline'
import { constrainOffsetWithinRate, steerOffsetTowardTarget } from './riderPathing'

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

export interface LengthCompensationTuning {
  /** Amplification applied when the rider travels a shorter arc than the reference. */
  insideCompensation?: number
  /** Amplification applied when the rider travels a longer arc than the reference. */
  outsideCompensation?: number
}

export interface SegmentLengthSpeedOptions extends LengthCompensationTuning {
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

export interface RelaxedOffsetTargetOptions {
  /** Optional override for the margin that still counts as comfortable. */
  relaxationMargin?: number
}

export function computeRelaxedOffsetTarget(
  currentOffset: number,
  desiredOffset: number,
  minBound: number,
  maxBound: number,
  maxOffset: number,
  options: RelaxedOffsetTargetOptions = {},
): number {
  const boundedMaxOffset = Number.isFinite(maxOffset) ? Math.abs(maxOffset) : Infinity
  const rawMin = Math.min(minBound, maxBound)
  const rawMax = Math.max(minBound, maxBound)
  const clampedMin = Math.max(-boundedMaxOffset, rawMin)
  const clampedMax = Math.min(boundedMaxOffset, rawMax)

  if (!(Number.isFinite(clampedMin) && Number.isFinite(clampedMax))) {
    return desiredOffset
  }

  const safeMin = Math.min(clampedMin, clampedMax)
  const safeMax = Math.max(clampedMin, clampedMax)
  const safeCurrent = MathUtils.clamp(currentOffset, safeMin, safeMax)
  const safeDesired = MathUtils.clamp(desiredOffset, safeMin, safeMax)
  const corridorWidth = safeMax - safeMin

  if (!Number.isFinite(corridorWidth) || corridorWidth <= 1e-6) {
    return safeDesired
  }

  const leftMargin = safeCurrent - safeMin
  const rightMargin = safeMax - safeCurrent
  const minMargin = Math.max(0, Math.min(leftMargin, rightMargin))

  const fallbackComfort = Math.min(corridorWidth * 0.5, Math.max(0.3, Math.min(0.9, boundedMaxOffset * 0.45)))
  const comfortMargin = Math.max(0, options.relaxationMargin ?? fallbackComfort)

  if (!Number.isFinite(comfortMargin) || comfortMargin <= 1e-6) {
    return safeDesired
  }

  const relaxedRatio = MathUtils.clamp(
    MathUtils.smoothstep(minMargin, comfortMargin * 0.3, comfortMargin),
    0,
    1,
  )

  return MathUtils.lerp(safeDesired, safeCurrent, relaxedRatio)
}

export function computeTargetSpeedCompensation(
  ratio: number,
  options: LengthCompensationTuning = {}
): number {
  const {
    insideCompensation = 0.35,
    outsideCompensation = 0.8,
  } = options

  if (!Number.isFinite(ratio)) {
    return 1
  }

  const clampedRatio = Math.max(0, ratio)
  const deviation = clampedRatio - 1
  if (Math.abs(deviation) < 1e-6) {
    return 1
  }

  if (deviation > 0) {
    const gain = Math.max(0, outsideCompensation)
    return Math.max(0, 1 + deviation * gain)
  }

  const gain = Math.max(0, insideCompensation)
  return Math.max(0, 1 + -deviation * gain)
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
  const interpolated = MathUtils.lerp(maxSpeed, minSpeed, t)
  const compensation = computeTargetSpeedCompensation(clampedRatio, options)
  const compensated = interpolated * compensation

  return MathUtils.clamp(
    compensated,
    Math.min(minSpeed, maxSpeed),
    Math.max(minSpeed, maxSpeed)
  )
}

export function computeOffsetArcLengthRatio(
  curvature: number,
  lateralOffset: number,
  options: { minRatio?: number; maxRatio?: number } = {}
): number {
  const { minRatio = 0.2, maxRatio = 5 } = options
  const clampedMin = Math.max(1e-3, Math.min(minRatio, maxRatio))
  const clampedMax = Math.max(clampedMin, Math.max(minRatio, maxRatio))

  if (!Number.isFinite(curvature) || Math.abs(curvature) < 1e-6) {
    return MathUtils.clamp(1, clampedMin, clampedMax)
  }

  const baseRadius = 1 / Math.abs(curvature)
  if (!Number.isFinite(baseRadius) || baseRadius <= 0) {
    return MathUtils.clamp(1, clampedMin, clampedMax)
  }

  if (!Number.isFinite(lateralOffset) || lateralOffset === 0) {
    return MathUtils.clamp(1, clampedMin, clampedMax)
  }

  const orientation = Math.sign(curvature)
  const towardCenter = lateralOffset * orientation
  const effectiveRadius = baseRadius - towardCenter
  if (!Number.isFinite(effectiveRadius) || effectiveRadius <= 0) {
    return clampedMin
  }

  const ratio = effectiveRadius / baseRadius
  return MathUtils.clamp(ratio, clampedMin, clampedMax)
}

export function projectWorldDistanceOntoCenterline(
  worldDistance: number,
  curvature: number,
  lateralOffset: number,
  options: { minRatio?: number; maxRatio?: number } = {},
): number {
  if (!Number.isFinite(worldDistance) || Math.abs(worldDistance) <= 1e-9) {
    return 0
  }

  const ratio = computeOffsetArcLengthRatio(curvature, lateralOffset, options)
  if (!Number.isFinite(ratio) || ratio <= 1e-6) {
    return worldDistance
  }

  return worldDistance / ratio
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
  diagnostics?: SafeSpeedDiagnostics
}

export type SafeSpeedLimitReason =
  | 'none'
  | 'neighbor-bounds'
  | 'road-bounds'
  | 'geometry'

export interface SafeSpeedDiagnostics {
  limitingSpeed: number
  limitingReason: SafeSpeedLimitReason
  limitingStep: number
  candidateSpeed: number
  offset: number
  minBound: number
  maxBound: number
  minLeftMargin: number
  minRightMargin: number
}

function wrapDistance(distance: number, totalLength: number): number {
  if (totalLength <= 0) return distance
  return MathUtils.euclideanModulo(distance, totalLength)
}

function isFiniteNumber(value: number): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

interface SpeedCheckDetail {
  speed: number
  reason: SafeSpeedLimitReason
  step: number
  offset: number
  minBound: number
  maxBound: number
  minLeftMargin: number
  minRightMargin: number
}

function createSpeedCheckDetail(
  initialOffset: number,
  minBound: number,
  maxBound: number
): SpeedCheckDetail {
  const clampedOffset = MathUtils.clamp(initialOffset, minBound, maxBound)
  return {
    speed: 0,
    reason: 'none',
    step: 0,
    offset: clampedOffset,
    minBound,
    maxBound,
    minLeftMargin: clampedOffset - minBound,
    minRightMargin: maxBound - clampedOffset,
  }
}

function resetSpeedCheckDetail(
  detail: SpeedCheckDetail,
  speed: number,
  offset: number,
  minBound: number,
  maxBound: number
): void {
  detail.speed = speed
  detail.reason = 'none'
  detail.step = 0
  detail.offset = offset
  detail.minBound = minBound
  detail.maxBound = maxBound
  detail.minLeftMargin = offset - minBound
  detail.minRightMargin = maxBound - offset
}

function copySpeedCheckDetail(target: SpeedCheckDetail, source: SpeedCheckDetail): void {
  target.speed = source.speed
  target.reason = source.reason
  target.step = source.step
  target.offset = source.offset
  target.minBound = source.minBound
  target.maxBound = source.maxBound
  target.minLeftMargin = source.minLeftMargin
  target.minRightMargin = source.minRightMargin
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
    diagnostics,
  } = options

  const finiteMaxTarget = isFiniteNumber(maxTargetSpeed) ? maxTargetSpeed : 0
  const maxSpeed = Math.max(0, finiteMaxTarget)
  const clampedMinBound = Math.max(-maxOffset, neighborMin)
  const clampedMaxBound = Math.min(maxOffset, neighborMax)
  const clampedOffset = MathUtils.clamp(currentOffset, clampedMinBound, clampedMaxBound)
  const computeStepTarget = (offset: number) =>
    computeRelaxedOffsetTarget(offset, desiredOffset, clampedMinBound, clampedMaxBound, maxOffset)

  if (diagnostics) {
    diagnostics.limitingSpeed = maxSpeed
    diagnostics.limitingReason = 'none'
    diagnostics.limitingStep = 0
    diagnostics.candidateSpeed = maxSpeed
    diagnostics.offset = clampedOffset
    diagnostics.minBound = clampedMinBound
    diagnostics.maxBound = clampedMaxBound
    diagnostics.minLeftMargin = clampedOffset - clampedMinBound
    diagnostics.minRightMargin = clampedMaxBound - clampedOffset
  }

  if (!spline || finiteMaxTarget <= 0) {
    return Math.max(0, finiteMaxTarget)
  }

  if (clampedMinBound > clampedMaxBound) {
    if (diagnostics) {
      diagnostics.limitingSpeed = 0
      diagnostics.limitingReason = 'neighbor-bounds'
      diagnostics.candidateSpeed = maxSpeed
      diagnostics.offset = clampedOffset
      diagnostics.minBound = clampedMinBound
      diagnostics.maxBound = clampedMaxBound
      diagnostics.minLeftMargin = 0
      diagnostics.minRightMargin = 0
    }
    return 0
  }

  const safeDt = isFiniteNumber(dt) && dt > 0 ? dt : 0
  const safeLookAhead = isFiniteNumber(lookAheadDistance) ? Math.max(0, lookAheadDistance) : 0
  if (safeLookAhead <= 1e-3 || safeDt <= 0) {
    const minSpeed = Math.max(0, Math.min(maxSpeed, minTargetSpeed))
    const result = Math.max(minSpeed, maxSpeed)
    if (diagnostics) {
      diagnostics.limitingSpeed = result
      diagnostics.limitingReason = 'none'
      diagnostics.candidateSpeed = maxSpeed
      diagnostics.offset = clampedOffset
      diagnostics.minBound = clampedMinBound
      diagnostics.maxBound = clampedMaxBound
      diagnostics.minLeftMargin = clampedOffset - clampedMinBound
      diagnostics.minRightMargin = clampedMaxBound - clampedOffset
    }
    return result
  }

  const lookAheadRelaxation = 0.85
  const evaluationLookAhead = Math.max(safeLookAhead * lookAheadRelaxation, 1e-3)
  const eps = 1e-3

  const scratchDetail = diagnostics
    ? createSpeedCheckDetail(clampedOffset, clampedMinBound, clampedMaxBound)
    : null
  const bestSuccessDetail = diagnostics
    ? createSpeedCheckDetail(clampedOffset, clampedMinBound, clampedMaxBound)
    : null
  const lastFailureDetail = diagnostics
    ? createSpeedCheckDetail(clampedOffset, clampedMinBound, clampedMaxBound)
    : null
  let bestSuccessSpeedRecorded = diagnostics ? -Infinity : 0

  const evaluateSpeed = (speed: number): boolean => {
    if (!isFiniteNumber(speed) || speed <= 0) {
      if (scratchDetail) {
        resetSpeedCheckDetail(
          scratchDetail,
          Math.max(0, speed),
          clampedOffset,
          clampedMinBound,
          clampedMaxBound
        )
      }
      return true
    }

    const safeSpeed = Math.max(0, speed)
    let offset = clampedOffset
    const distancePerStep = Math.max(safeSpeed * safeDt, evaluationLookAhead / 8)
    const stepCount = Math.max(1, Math.ceil(evaluationLookAhead / Math.max(distancePerStep, eps)))
    const stepDistance = evaluationLookAhead / stepCount

    if (scratchDetail) {
      resetSpeedCheckDetail(scratchDetail, safeSpeed, offset, clampedMinBound, clampedMaxBound)
    }

    for (let step = 1; step <= stepCount; step++) {
      const traveled = stepDistance * step
      const nextDistance = wrapDistance(currentDistance + traveled, totalLength)
      const sampleDistance = MathUtils.clamp(nextDistance, 0, spline.totalLength)
      const sample = spline.sampleByDistance(sampleDistance)
      scratchRight.set(-sample.tangent.z, 0, sample.tangent.x).normalize()
      scratchPosition.copy(sample.position).addScaledVector(scratchRight, offset)

      const stepTime = stepDistance / Math.max(safeSpeed, eps)
      const remainingDistance = Math.max(
        evaluationLookAhead - stepDistance * (step - 1),
        0,
      )
      const timeRemaining = remainingDistance / Math.max(safeSpeed, eps)
      const targetOffset = computeStepTarget(offset)
      const reachableDesired = constrainOffsetWithinRate(
        offset,
        targetOffset,
        clampedMinBound,
        clampedMaxBound,
        maxOffsetRate,
        timeRemaining,
      )

      offset = steerOffsetTowardTarget(
        offset,
        reachableDesired,
        clampedMinBound,
        clampedMaxBound,
        stepTime,
        maxOffsetRate
      )

      if (scratchDetail) {
        const leftMargin = offset - clampedMinBound
        const rightMargin = clampedMaxBound - offset
        if (leftMargin < scratchDetail.minLeftMargin) {
          scratchDetail.minLeftMargin = leftMargin
        }
        if (rightMargin < scratchDetail.minRightMargin) {
          scratchDetail.minRightMargin = rightMargin
        }
      }

      if (offset < clampedMinBound - eps || offset > clampedMaxBound + eps) {
        if (scratchDetail) {
          scratchDetail.reason = 'neighbor-bounds'
          scratchDetail.step = step
          scratchDetail.offset = offset
          scratchDetail.minBound = clampedMinBound
          scratchDetail.maxBound = clampedMaxBound
        }
        return false
      }
      if (Math.abs(offset) > maxOffset + eps) {
        if (scratchDetail) {
          scratchDetail.reason = 'road-bounds'
          scratchDetail.step = step
          scratchDetail.offset = offset
          scratchDetail.minBound = -maxOffset
          scratchDetail.maxBound = maxOffset
        }
        return false
      }
      if (
        !Number.isFinite(scratchPosition.x) ||
        !Number.isFinite(scratchPosition.y) ||
        !Number.isFinite(scratchPosition.z)
      ) {
        if (scratchDetail) {
          scratchDetail.reason = 'geometry'
          scratchDetail.step = step
          scratchDetail.offset = offset
        }
        return false
      }
    }

    if (scratchDetail) {
      scratchDetail.step = stepCount
      scratchDetail.offset = offset
      scratchDetail.minBound = clampedMinBound
      scratchDetail.maxBound = clampedMaxBound
    }

    return true
  }

  const recordSuccess = () => {
    if (!diagnostics || !scratchDetail || !bestSuccessDetail) return
    if (scratchDetail.speed >= bestSuccessSpeedRecorded - 1e-6) {
      copySpeedCheckDetail(bestSuccessDetail, scratchDetail)
      bestSuccessSpeedRecorded = scratchDetail.speed
    }
  }

  const recordFailure = () => {
    if (!diagnostics || !scratchDetail || !lastFailureDetail) return
    copySpeedCheckDetail(lastFailureDetail, scratchDetail)
  }

  let best = 0

  if (evaluateSpeed(maxSpeed)) {
    best = maxSpeed
    recordSuccess()
    if (diagnostics && bestSuccessDetail) {
      diagnostics.limitingSpeed = bestSuccessDetail.speed
      diagnostics.limitingReason = 'none'
      diagnostics.limitingStep = bestSuccessDetail.step
      diagnostics.candidateSpeed = bestSuccessDetail.speed
      diagnostics.offset = bestSuccessDetail.offset
      diagnostics.minBound = bestSuccessDetail.minBound
      diagnostics.maxBound = bestSuccessDetail.maxBound
      diagnostics.minLeftMargin = bestSuccessDetail.minLeftMargin
      diagnostics.minRightMargin = bestSuccessDetail.minRightMargin
    }
    return best
  }

  recordFailure()

  let low = 0
  let high = maxSpeed
  for (let i = 0; i < 16; i++) {
    const mid = (low + high) / 2
    if (evaluateSpeed(mid)) {
      best = mid
      low = mid
      recordSuccess()
    } else {
      high = mid
      recordFailure()
    }
  }

  const minSpeed = Math.max(0, Math.min(maxSpeed, minTargetSpeed))
  const result = best >= minSpeed ? Math.max(minSpeed, best) : best

  if (diagnostics) {
    diagnostics.limitingSpeed = result
    if (lastFailureDetail && lastFailureDetail.reason !== 'none' && lastFailureDetail.speed > result + 1e-4) {
      diagnostics.limitingReason = lastFailureDetail.reason
      diagnostics.limitingStep = lastFailureDetail.step
      diagnostics.candidateSpeed = lastFailureDetail.speed
      diagnostics.offset = lastFailureDetail.offset
      diagnostics.minBound = lastFailureDetail.minBound
      diagnostics.maxBound = lastFailureDetail.maxBound
      diagnostics.minLeftMargin = lastFailureDetail.minLeftMargin
      diagnostics.minRightMargin = lastFailureDetail.minRightMargin
    } else if (bestSuccessDetail) {
      diagnostics.limitingReason = 'none'
      diagnostics.limitingStep = bestSuccessDetail.step
      diagnostics.candidateSpeed = bestSuccessDetail.speed
      diagnostics.offset = bestSuccessDetail.offset
      diagnostics.minBound = bestSuccessDetail.minBound
      diagnostics.maxBound = bestSuccessDetail.maxBound
      diagnostics.minLeftMargin = bestSuccessDetail.minLeftMargin
      diagnostics.minRightMargin = bestSuccessDetail.minRightMargin
    }
  }

  return result
}
