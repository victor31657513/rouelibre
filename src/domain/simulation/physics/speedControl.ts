/**
 * Utilities that compute safe target speeds for riders based on curvature,
 * slope and neighbour positions.
 *
 * Extension: expose additional heuristics (e.g. drafting) by composing new
 * helpers here rather than inside the worker loop.
 */
import { MathUtils, Vector3 } from 'three'
import { PathSpline } from '../../route/pathSpline'
import { sampleBestLineOffset, type BestLineLookup } from './bestLine'
import {
  constrainOffsetWithinRate,
  steerOffsetTowardTarget,
  type CurvatureEnvelope,
  type PathBoundaryMode,
} from './riderPathing'
import {
  assessCorneringProfile,
  type CorneringAssessmentResult,
  type CorneringClassificationOptions,
} from './cornering'

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
  /** Optional ceiling applied to the outside boost factor. */
  maxOutsideBoost?: number
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

  return MathUtils.lerp(safeCurrent, safeDesired, relaxedRatio)
}

export function computeTargetSpeedCompensation(
  ratio: number,
  options: LengthCompensationTuning = {}
): number {
  const {
    insideCompensation = 0,
    outsideCompensation = 1,
    maxOutsideBoost = Infinity,
  } = options

  if (!Number.isFinite(ratio)) {
    return 1
  }

  const clampedRatio = Math.max(1e-3, ratio)

  if (clampedRatio >= 1) {
    const targetBoost = Math.min(Math.max(1, clampedRatio), Math.max(1, maxOutsideBoost))
    const lerpT = MathUtils.clamp(outsideCompensation, 0, 1)
    const boosted = MathUtils.lerp(1, targetBoost, lerpT)
    return Math.max(0, boosted)
  }

  const attenuationTarget = Math.max(0, Math.min(1, clampedRatio))
  const lerpT = MathUtils.clamp(insideCompensation, 0, 1)
  const compensated = MathUtils.lerp(1, attenuationTarget, lerpT)
  return Math.max(0, compensated)
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

const DEFAULT_MIN_OFFSET_FOR_SAMPLING = 0.05

export interface SegmentSamplingOptions {
  sampleCount?: number
  minOffsetForSampling?: number
  adaptiveStep?: boolean
}

export type OffsetSegmentSampler = (
  spline: PathSpline,
  startDistance: number,
  endDistance: number,
  lateralOffsets: readonly number[],
  options?: SegmentSamplingOptions,
) => number[]

function normalizeYawFromTangent(tangent: Vector3): number {
  return Math.atan2(tangent.x, tangent.z)
}

function shortestAngleDelta(from: number, to: number): number {
  const raw = to - from
  return Math.atan2(Math.sin(raw), Math.cos(raw))
}

function estimateSegmentCurvature(
  spline: PathSpline,
  startDistance: number,
  endDistance: number,
): number {
  const travel = endDistance - startDistance
  if (!Number.isFinite(travel) || travel <= 1e-6) {
    return 0
  }

  const startSample = spline.sampleByDistance(startDistance)
  const endSample = spline.sampleByDistance(endDistance)
  const yawStart = normalizeYawFromTangent(startSample.tangent)
  const yawEnd = normalizeYawFromTangent(endSample.tangent)
  let curvature = shortestAngleDelta(yawStart, yawEnd) / travel

  const midDistance = startDistance + travel / 2
  if (travel > 0.5 && midDistance < spline.totalLength) {
    const midSample = spline.sampleByDistance(midDistance)
    const yawMid = normalizeYawFromTangent(midSample.tangent)
    const firstSpan = midDistance - startDistance
    const secondSpan = endDistance - midDistance
    const firstCurvature =
      firstSpan > 1e-6
        ? shortestAngleDelta(yawStart, yawMid) / firstSpan
        : curvature
    const secondCurvature =
      secondSpan > 1e-6
        ? shortestAngleDelta(yawMid, yawEnd) / secondSpan
        : curvature
    const weighted =
      (firstCurvature * firstSpan + secondCurvature * secondSpan) / travel
    if (Number.isFinite(weighted)) {
      curvature = weighted
    }
  }

  if (!Number.isFinite(curvature)) {
    return 0
  }

  return curvature
}

export function computeOffsetSegmentLengths(
  spline: PathSpline,
  startDistance: number,
  endDistance: number,
  lateralOffsets: readonly number[],
  options: SegmentSamplingOptions = {},
): number[] {
  if (!spline || lateralOffsets.length === 0) {
    return []
  }

  const safeOffsets = lateralOffsets.map((offset) =>
    Number.isFinite(offset) ? offset : 0,
  )

  if (!isFinite(startDistance) || !isFinite(endDistance)) {
    return safeOffsets.map(() => 0)
  }

  const clampedStart = MathUtils.clamp(startDistance, 0, spline.totalLength)
  const clampedEnd = MathUtils.clamp(endDistance, 0, spline.totalLength)
  const travel = clampedEnd - clampedStart
  if (!isFinite(travel) || travel <= 0) {
    return safeOffsets.map(() => 0)
  }

  const { minOffsetForSampling = DEFAULT_MIN_OFFSET_FOR_SAMPLING } = options
  const minOffset = Math.max(0, minOffsetForSampling)
  const centerlineLength = travel
  const curvature = estimateSegmentCurvature(spline, clampedStart, clampedEnd)

  return safeOffsets.map((offset) => {
    const magnitude = Math.abs(offset)
    if (!Number.isFinite(magnitude) || magnitude <= minOffset) {
      return centerlineLength
    }
    const ratio = computeOffsetArcLengthRatio(curvature, offset)
    return centerlineLength * ratio
  })
}

export function computeOffsetSegmentLength(
  spline: PathSpline,
  startDistance: number,
  endDistance: number,
  lateralOffset: number,
  sampleCount = 12,
): number {
  const [length] = computeOffsetSegmentLengths(
    spline,
    startDistance,
    endDistance,
    [lateralOffset],
    { sampleCount },
  )
  return length ?? 0
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

  const orientation = -Math.sign(curvature)
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
  options: { minRatio?: number; maxRatio?: number; softening?: number } = {},
): number {
  if (!Number.isFinite(worldDistance) || Math.abs(worldDistance) <= 1e-9) {
    return 0
  }

  const { softening = 0.55, minRatio, maxRatio } = options
  const ratio = computeOffsetArcLengthRatio(curvature, lateralOffset, { minRatio, maxRatio })
  if (!Number.isFinite(ratio) || ratio <= 1e-6) {
    return worldDistance
  }

  const blend = MathUtils.clamp(softening, 0, 1)
  if (blend === 0) {
    return worldDistance
  }

  const deviation = ratio - 1
  const blendedRatio = 1 + deviation * blend

  if (!Number.isFinite(blendedRatio) || Math.abs(blendedRatio) <= 1e-6) {
    return worldDistance
  }

  return worldDistance / blendedRatio
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

export interface CorneringSpeedOptions {
  maxLateralAcceleration: number
  sustainedBlendStart?: number
  sustainedBlendEnd?: number
  coverageExponent?: number
  reliefFactor?: number
  spikeRetention?: number
  hairpinLateralAcceleration?: number
  classificationOptions?: CorneringClassificationOptions
  severityOptions?: HairpinSeverityOptions
  cornerSpeedFloor?: number
  cornerFloorTransitionFactor?: number
  minRadius?: number
  smoothingWindow?: number
  smoothingState?: CurvatureSmoothingState
}

export interface CurvatureSmoothingState {
  averageAbsCurvature: number[]
  rootMeanSquareAbsCurvature: number[]
  maxAbsCurvature: number[]
  rawMaxAbsCurvature: number[]
}

function pushAndAverage(history: number[], value: number, windowSize: number): number {
  const safeWindow = Math.max(1, Math.floor(windowSize))
  const safeValue = Number.isFinite(value) ? value : 0

  history.push(safeValue)
  if (history.length > safeWindow) {
    history.shift()
  }

  const sum = history.reduce((acc, v) => acc + v, 0)
  return history.length > 0 ? sum / history.length : safeValue
}

const defaultSmoothingState: CurvatureSmoothingState = {
  averageAbsCurvature: [],
  rootMeanSquareAbsCurvature: [],
  maxAbsCurvature: [],
  rawMaxAbsCurvature: [],
}

export function smoothCurvatureEnvelope(
  envelope: CurvatureEnvelope,
  windowSize = 5,
  state: CurvatureSmoothingState = defaultSmoothingState,
): CurvatureEnvelope {
  const smoothedAverage = pushAndAverage(
    state.averageAbsCurvature,
    envelope.averageAbsCurvature,
    windowSize,
  )
  const smoothedRms = pushAndAverage(
    state.rootMeanSquareAbsCurvature,
    envelope.rootMeanSquareAbsCurvature,
    windowSize,
  )
  const smoothedMax = pushAndAverage(state.maxAbsCurvature, envelope.maxAbsCurvature, windowSize)
  const smoothedRawMax = pushAndAverage(
    state.rawMaxAbsCurvature,
    envelope.rawMaxAbsCurvature,
    windowSize,
  )

  return {
    ...envelope,
    averageAbsCurvature: smoothedAverage,
    rootMeanSquareAbsCurvature: smoothedRms,
    maxAbsCurvature: smoothedMax,
    rawMaxAbsCurvature: smoothedRawMax,
  }
}

export function resetCurvatureSmoothing(state: CurvatureSmoothingState = defaultSmoothingState): void {
  state.averageAbsCurvature.length = 0
  state.rootMeanSquareAbsCurvature.length = 0
  state.maxAbsCurvature.length = 0
  state.rawMaxAbsCurvature.length = 0
}

export interface HairpinSeverityOptions {
  coverageExponent?: number
  intensityExponent?: number
  radiusTight?: number
  radiusRelaxed?: number
  standardCornerPenalty?: number
  classificationOptions?: CorneringClassificationOptions
}

export interface HairpinSeverityResult {
  severity: number
  classification: CorneringAssessmentResult
}

export interface LocalCorneringOptions {
  spline: PathSpline
  totalLength: number
  distance: number
  offset: number
  maxOffset: number
  maxLateralAcceleration: number
  pathBoundaryMode: PathBoundaryMode
  lookAheadDistance?: number
  bestLine?: BestLineLookup | null
  surfaceNormalSampler?: (distance: number) => Vector3 | null
  smoothingWindow?: number
  sampleStep?: number
  cornerSpeedFloor?: number
  openRadiusFloor?: number
  gravity?: number
}

export interface LocalCorneringResult {
  maxSpeed: number
  curvature: number
  support: number
  effectiveLateralAcceleration: number
  limitingReason: 'geometry-local' | 'none'
}

const scratchLocalRight = new Vector3(1, 0, 0)
const scratchLocalRightSupport = new Vector3(1, 0, 0)
const scratchLocalPosition = new Vector3()
const scratchLocalNormal = new Vector3(0, 1, 0)
const scratchGravity = new Vector3()
const scratchLocalPoints: Vector3[] = [new Vector3(), new Vector3(), new Vector3(), new Vector3()]

function normalizeLocalDistance(
  distance: number,
  totalLength: number,
  mode: PathBoundaryMode,
): number {
  if (totalLength <= 0) return distance
  if (mode === 'loop') return wrapDistance(distance, totalLength)
  if (distance <= 0) return 0
  if (distance >= totalLength) return totalLength
  return distance
}

function sampleOffsetPosition(
  spline: PathSpline,
  distance: number,
  totalLength: number,
  offset: number,
  maxOffset: number,
  pathBoundaryMode: PathBoundaryMode,
  bestLine?: BestLineLookup | null,
  surfaceNormal?: Vector3 | null,
  target: Vector3 = scratchLocalPosition,
): Vector3 {
  const normalized = normalizeLocalDistance(distance, totalLength, pathBoundaryMode)
  const sample = spline.sampleByDistance(normalized)
  const usableNormal = surfaceNormal && surfaceNormal.lengthSq() > 1e-8
    ? scratchLocalNormal.copy(surfaceNormal).normalize()
    : null
  if (usableNormal) {
    scratchLocalRight.crossVectors(sample.tangent, usableNormal)
  } else {
    scratchLocalRight.set(-sample.tangent.z, 0, sample.tangent.x)
  }
  if (scratchLocalRight.lengthSq() <= 1e-6) {
    scratchLocalRight.set(1, 0, 0)
  }
  scratchLocalRight.normalize()

  const bestLineOffset = bestLine
    ? sampleBestLineOffset(bestLine, normalized, totalLength, pathBoundaryMode)
    : 0
  const totalOffset = MathUtils.clamp(offset + bestLineOffset, -Math.abs(maxOffset), Math.abs(maxOffset))

  return target.copy(sample.position).addScaledVector(scratchLocalRight, totalOffset)
}

function curvatureFromPoints(p0: Vector3, p1: Vector3, p2: Vector3): number {
  const v1x = p1.x - p0.x
  const v1z = p1.z - p0.z
  const v2x = p2.x - p1.x
  const v2z = p2.z - p1.z

  const len1 = Math.hypot(v1x, v1z)
  const len2 = Math.hypot(v2x, v2z)
  if (len1 < 1e-6 || len2 < 1e-6) return 0

  const t1x = v1x / len1
  const t1z = v1z / len1
  const t2x = v2x / len2
  const t2z = v2z / len2

  const cross = t1x * t2z - t1z * t2x
  const dot = MathUtils.clamp(t1x * t2x + t1z * t2z, -1, 1)
  const angle = Math.atan2(cross, dot)
  const avgLen = (len1 + len2) / 2
  if (!Number.isFinite(angle) || avgLen < 1e-6) return 0
  const signedCurvature = angle / avgLen
  if (!Number.isFinite(signedCurvature)) return 0
  return signedCurvature
}

export function computeLocalCorneringSpeed(options: LocalCorneringOptions): LocalCorneringResult {
  const {
    spline,
    totalLength,
    distance,
    offset,
    maxOffset,
    maxLateralAcceleration,
    pathBoundaryMode,
    lookAheadDistance,
    bestLine,
    surfaceNormalSampler,
    smoothingWindow = 3,
    sampleStep = 0.7,
    cornerSpeedFloor = 0.92,
    openRadiusFloor = 140,
    gravity = 9.80665,
  } = options

  if (!spline || totalLength <= 0 || !(maxLateralAcceleration > 0)) {
    return { maxSpeed: Infinity, curvature: 0, limitingReason: 'none' }
  }

  const spacing = Math.max(0.3, sampleStep)
  const evaluationHorizon = Math.max(lookAheadDistance ?? spacing * 3, spacing * 2)
  const sampleCount = Math.max(3, Math.min(8, Math.round(evaluationHorizon / spacing) + 1))

  for (let i = scratchLocalPoints.length; i < sampleCount; i++) {
    scratchLocalPoints.push(new Vector3())
  }

  for (let i = 0; i < sampleCount; i++) {
    const travel = spacing * i
    const surfaceNormal = surfaceNormalSampler?.(distance + travel)
    sampleOffsetPosition(
      spline,
      distance + travel,
      totalLength,
      offset,
      maxOffset,
      pathBoundaryMode,
      bestLine,
      surfaceNormal ?? undefined,
      scratchLocalPoints[i],
    )
  }

  const curvatures: number[] = []
  for (let i = 0; i < sampleCount - 2; i++) {
    const p0 = scratchLocalPoints[i]
    const p1 = scratchLocalPoints[i + 1]
    const p2 = scratchLocalPoints[i + 2]
    curvatures.push(curvatureFromPoints(p0, p1, p2))
  }

  const window = Math.max(1, Math.round(smoothingWindow))
  const smoothed: number[] = []
  for (let i = 0; i < curvatures.length; i++) {
    const start = Math.max(0, i - window + 1)
    const end = i
    let acc = 0
    let count = 0
    for (let j = start; j <= end; j++) {
      acc += curvatures[j]
      count++
    }
    smoothed.push(count > 0 ? acc / count : 0)
  }

  let effectiveCurvature = 0
  let curvatureSign = 0
  for (const value of smoothed) {
    const absValue = Math.abs(value)
    if (absValue > effectiveCurvature) {
      effectiveCurvature = absValue
      curvatureSign = Math.sign(value)
    }
  }
  const curvatureFloor = openRadiusFloor > 0 ? 1 / Math.max(openRadiusFloor, 1e-3) : 0
  const limitingCurvature = Math.max(effectiveCurvature, curvatureFloor)

  if (!(limitingCurvature > 0)) {
    return {
      maxSpeed: Infinity,
      curvature: effectiveCurvature,
      support: 0,
      effectiveLateralAcceleration: maxLateralAcceleration,
      limitingReason: 'none',
    }
  }

  const referenceSample = spline.sampleByDistance(distance)
  const roadNormal = surfaceNormalSampler?.(distance)
  if (roadNormal && roadNormal.lengthSq() > 1e-8) {
    scratchLocalNormal.copy(roadNormal).normalize()
  } else {
    scratchLocalNormal.set(0, 1, 0)
  }
  scratchLocalRightSupport.crossVectors(referenceSample.tangent, scratchLocalNormal)
  if (scratchLocalRightSupport.lengthSq() <= 1e-8) {
    scratchLocalRightSupport.set(-referenceSample.tangent.z, 0, referenceSample.tangent.x)
  }
  scratchLocalRightSupport.normalize()
  scratchGravity.set(0, -Math.abs(gravity), 0)
  const lateralGravity = scratchGravity.dot(scratchLocalRightSupport)
  const inwardDirection = curvatureSign >= 0 ? -1 : 1
  const bankAssist = Math.max(0, lateralGravity * inwardDirection)

  const effectiveLateralAcceleration = Math.max(0, maxLateralAcceleration + bankAssist)

  const safeSpeed = Math.sqrt(effectiveLateralAcceleration / limitingCurvature)
  const flooredSpeed = Math.sqrt(effectiveLateralAcceleration / Math.max(curvatureFloor, 1e-6))
  const floorAttenuation = MathUtils.lerp(
    cornerSpeedFloor,
    1,
    MathUtils.clamp(bankAssist / Math.max(maxLateralAcceleration, 1e-6), 0, 1),
  )
  const maxSpeed = limitingCurvature > effectiveCurvature
    ? Math.max(safeSpeed * floorAttenuation, safeSpeed)
    : Math.max(safeSpeed, flooredSpeed * floorAttenuation)

  return {
    maxSpeed: Number.isFinite(maxSpeed) ? maxSpeed : Infinity,
    curvature: effectiveCurvature,
    support: bankAssist,
    effectiveLateralAcceleration,
    limitingReason: effectiveCurvature > 0 ? 'geometry-local' : 'none',
  }
}

export function computeHairpinSeverityFromEnvelope(
  envelope: CurvatureEnvelope,
  options: HairpinSeverityOptions = {},
): HairpinSeverityResult {
  const {
    coverageExponent = 1.15,
    intensityExponent = 1.05,
    radiusTight = 18,
    radiusRelaxed = 48,
    standardCornerPenalty = 0.35,
    classificationOptions,
  } = options

  const classification = assessCorneringProfile(envelope, classificationOptions)
  const coverage = MathUtils.clamp(envelope.coverageRatio ?? 0, 0, 1)
  const intensity = MathUtils.clamp(envelope.intensity ?? 0, 0, 1)
  const effectiveRadius = classification.effectiveRadius

  const sustainedSeverity = Math.pow(coverage, Math.max(coverageExponent, 1e-3))
  const intensitySeverity = Math.pow(intensity, Math.max(intensityExponent, 1e-3))
  const blendedProfile = Math.max(intensitySeverity, (intensitySeverity + sustainedSeverity) * 0.5)

  const radiusSeverity = Number.isFinite(effectiveRadius)
    ? 1 - MathUtils.smoothstep(effectiveRadius, radiusTight, radiusRelaxed)
    : 0

  const combined = Math.max(blendedProfile, radiusSeverity)
  const severity = classification.category === 'hairpin'
    ? Math.max(combined, MathUtils.clamp(classification.activation, 0, 1))
    : combined * MathUtils.clamp(standardCornerPenalty, 0, 1)

  return {
    severity: MathUtils.clamp(severity, 0, 1),
    classification,
  }
}

export function computeCorneringSpeedFromEnvelope(
  envelope: CurvatureEnvelope,
  options: CorneringSpeedOptions,
): number {
  const smoothedEnvelope = smoothCurvatureEnvelope(
    envelope,
    options.smoothingWindow ?? 3,
    options.smoothingState,
  )
  const baseAcceleration = Number.isFinite(options.maxLateralAcceleration)
    ? Math.max(0, options.maxLateralAcceleration as number)
    : 0
  if (!(baseAcceleration > 0)) {
    return Infinity
  }

  const localCurvature = Math.max(
    smoothedEnvelope.maxAbsCurvature ?? 0,
    smoothedEnvelope.rawMaxAbsCurvature ?? 0,
    0,
  )
  const curvatureFloor = options.minRadius && options.minRadius > 0 ? 1 / options.minRadius : 0
  const limitingCurvature = Math.max(localCurvature, curvatureFloor)

  if (!(limitingCurvature > 0)) {
    return Infinity
  }

  const nominalSpeed = Math.sqrt(baseAcceleration / limitingCurvature)
  const openRoadSpeed = curvatureFloor > 0 ? Math.sqrt(baseAcceleration / curvatureFloor) : nominalSpeed
  const floorFactor = MathUtils.clamp(options.cornerSpeedFloor ?? 0.92, 0, 1)
  const transitionFactor = Math.max(1, options.cornerFloorTransitionFactor ?? 1.8)

  if (limitingCurvature === curvatureFloor && Number.isFinite(openRoadSpeed)) {
    const transitionStartRadius = curvatureFloor > 0 ? 1 / curvatureFloor : Infinity
    const transitionEndRadius = transitionStartRadius * transitionFactor
    const currentRadius = localCurvature > 1e-6 ? 1 / localCurvature : transitionEndRadius
    const blend = Number.isFinite(currentRadius)
      ? MathUtils.smoothstep(currentRadius, transitionStartRadius, transitionEndRadius)
      : 1
    // Apply the floor progressively: near the minimum radius we enforce the floor, and we fade it out
    // on wider bends to avoid penalising gentle curves.
    const blendedFloor = MathUtils.lerp(openRoadSpeed * floorFactor, openRoadSpeed, MathUtils.clamp(blend, 0, 1))
    return blendedFloor
  }

  return Number.isFinite(nominalSpeed) ? nominalSpeed : Infinity
}

const scratchRight = new Vector3()
const scratchPosition = new Vector3()

export interface SafeSpeedEstimateOptions {
  spline: PathSpline
  totalLength: number
  currentDistance: number
  currentOffset: number
  desiredOffset: number
  hasNeighbor?: boolean
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

export function wrapDistance(distance: number, totalLength: number): number {
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
  const hasNeighbor = options.hasNeighbor ?? true
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

  const hasFiniteRoadLimit = isFiniteNumber(maxOffset) && maxOffset > 0
  const roadOnlyCorridor =
    !hasNeighbor &&
    hasFiniteRoadLimit &&
    Math.abs(clampedMinBound + maxOffset) < 1e-4 &&
    Math.abs(clampedMaxBound - maxOffset) < 1e-4

  if (roadOnlyCorridor) {
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
