/**
 * Path-following helpers used by the physics worker to manage rider offsets.
 *
 * Extension: Tweak behavioural constants or introduce new neighbour models by
 * extending the exported utilities.
 */
import { MathUtils, Vector3 } from 'three'
import { PathSpline } from '../../route/pathSpline'

export type PathBoundaryMode = 'loop' | 'clamp'

export interface NeighborBounds {
  min: Float32Array
  max: Float32Array
  hasNeighbor: boolean[]
}

interface NeighborOptions {
  laneWidth: number
  maxOffset: number
  totalLength: number
  neighborArcDistance: number
  lateralGap: number
}

interface OffsetProfileOptions {
  lookAhead: number
  maxOffset: number
  totalLength: number
  minRadius: number
  boundaryMode?: PathBoundaryMode
}

const scratchP0 = new Vector3()
const scratchP1 = new Vector3()
const scratchP2 = new Vector3()

function wrapDistance(distance: number, totalLength: number): number {
  if (totalLength <= 0) return distance
  return MathUtils.euclideanModulo(distance, totalLength)
}

function normalizeDistance(
  distance: number,
  totalLength: number,
  mode: PathBoundaryMode
): number {
  if (totalLength <= 0 || !Number.isFinite(distance)) {
    return distance
  }

  if (mode === 'loop') {
    return wrapDistance(distance, totalLength)
  }

  if (distance <= 0) return 0
  if (distance >= totalLength) return totalLength
  return distance
}

function sampleXZ(
  spline: PathSpline,
  distance: number,
  totalLength: number,
  target: Vector3,
  mode: PathBoundaryMode
): Vector3 {
  const normalized = normalizeDistance(distance, totalLength, mode)
  const sample = spline.sampleByDistance(normalized)
  target.set(sample.position.x, 0, sample.position.z)
  return target
}

export function computeSignedCurvature(
  spline: PathSpline,
  distance: number,
  totalLength: number,
  sampleSpacing = 0.5,
  boundaryMode: PathBoundaryMode = 'loop'
): number {
  if (!spline || totalLength <= 0) return 0
  const spacing = Math.max(0.1, sampleSpacing ?? 0.5)
  const p0 = sampleXZ(spline, distance - spacing, totalLength, scratchP0, boundaryMode)
  const p1 = sampleXZ(spline, distance, totalLength, scratchP1, boundaryMode)
  const p2 = sampleXZ(spline, distance + spacing, totalLength, scratchP2, boundaryMode)

  const v1x = p1.x - p0.x
  const v1z = p1.z - p0.z
  const v2x = p2.x - p1.x
  const v2z = p2.z - p1.z

  const len1 = Math.hypot(v1x, v1z)
  const len2 = Math.hypot(v2x, v2z)
  if (len1 < 1e-5 || len2 < 1e-5) return 0

  const t1x = v1x / len1
  const t1z = v1z / len1
  const t2x = v2x / len2
  const t2z = v2z / len2

  const cross = t1x * t2z - t1z * t2x
  const dot = MathUtils.clamp(t1x * t2x + t1z * t2z, -1, 1)
  const angle = Math.atan2(cross, dot)
  const avgLen = (len1 + len2) / 2
  if (!isFinite(angle) || avgLen < 1e-5) return 0
  return angle / avgLen
}

export interface CurvatureEnvelope {
  /**
   * Mean absolute curvature sampled along the look-ahead window.
   */
  averageAbsCurvature: number
  /**
   * Quadratic mean of the absolute curvature, providing a profile that reacts
   * strongly to sustained bends while remaining tolerant to brief spikes.
   */
  rootMeanSquareAbsCurvature: number
  /**
   * Absolute curvature capped by the reference radius. This value is safe to
   * feed directly into corner-speed heuristics since it already enforces the
   * minimum turning radius requested by the caller.
   */
  maxAbsCurvature: number
  /**
   * Raw absolute curvature before the reference-radius cap is applied. This
   * remains available for diagnostics whenever the caller wants to inspect the
   * unbounded measurements that triggered the envelope.
   */
  rawMaxAbsCurvature: number
  /**
   * Ratio describing how much of the look-ahead horizon is dominated by the
   * peak curvature. Values near zero indicate a very localised spike whereas
   * values near one correspond to sustained bends.
   */
  coverageRatio: number
  intensity: number
}

export function computeCurvatureEnvelope(
  spline: PathSpline,
  distance: number,
  totalLength: number,
  lookAhead: number,
  referenceRadius: number,
  sampleCount = 5,
  boundaryMode: PathBoundaryMode = 'loop'
): CurvatureEnvelope {
  if (!spline || totalLength <= 0) {
    return {
      averageAbsCurvature: 0,
      maxAbsCurvature: 0,
      rawMaxAbsCurvature: 0,
      intensity: 0,
    }
  }

  const safeLookAhead = Math.max(0, lookAhead)
  const safeSamples = Math.max(1, Math.floor(sampleCount ?? 5))
  const step = safeSamples > 0 ? safeLookAhead / safeSamples : 0

  let maxAbsCurvature = 0
  let sumAbsCurvature = 0
  let sumSquares = 0
  let count = 0

  for (let i = 0; i <= safeSamples; i++) {
    const sampleDistance = distance + step * i
    const curvature = Math.abs(
      computeSignedCurvature(spline, sampleDistance, totalLength, undefined, boundaryMode)
    )
    if (!Number.isFinite(curvature)) {
      continue
    }

    maxAbsCurvature = Math.max(maxAbsCurvature, curvature)
    sumAbsCurvature += curvature
    sumSquares += curvature * curvature
    count++
  }

  const averageAbsCurvature = count > 0 ? sumAbsCurvature / count : 0
  const rootMeanSquareAbsCurvature =
    count > 0 ? Math.sqrt(sumSquares / count) : 0
  const fallbackRadius = referenceRadius > 0 ? referenceRadius : 35
  const clampedRadius = Math.max(fallbackRadius, 1e-3)
  const referenceCurvature = 1 / clampedRadius
  const cappedCurvature =
    Number.isFinite(referenceCurvature) && referenceCurvature > 0
      ? Math.min(maxAbsCurvature, referenceCurvature)
      : maxAbsCurvature
  const safeMaxAbsCurvature = Math.max(cappedCurvature, 0)
  const coverageRatio = safeMaxAbsCurvature > 1e-6
    ? MathUtils.clamp(averageAbsCurvature / safeMaxAbsCurvature, 0, 1)
    : 0
  const intensity = MathUtils.clamp(
    referenceCurvature > 0 ? safeMaxAbsCurvature / referenceCurvature : 0,
    0,
    1
  )

  return {
    averageAbsCurvature,
    rootMeanSquareAbsCurvature,
    maxAbsCurvature: safeMaxAbsCurvature,
    rawMaxAbsCurvature: maxAbsCurvature,
    coverageRatio,
    intensity,
  }
}

function computeProgressDistance(a: number, b: number, totalLength: number): number {
  if (totalLength <= 0) return Math.abs(a - b)
  let diff = Math.abs(a - b)
  if (diff > totalLength / 2) diff = totalLength - diff
  return diff
}

export function computeNeighborBounds(
  progress: Float32Array,
  offsets: Float32Array,
  options: NeighborOptions
): NeighborBounds {
  const { laneWidth, maxOffset, totalLength, neighborArcDistance, lateralGap } = options
  const count = progress.length
  const minBounds = new Float32Array(count)
  const maxBounds = new Float32Array(count)
  const hasNeighbor = new Array(count).fill(false)

  for (let i = 0; i < count; i++) {
    minBounds[i] = -maxOffset
    maxBounds[i] = maxOffset
  }

  for (let i = 0; i < count; i++) {
    let bestLeftGap = Infinity
    let bestLeftIndex = -1
    let bestRightGap = Infinity
    let bestRightIndex = -1
    for (let j = 0; j < count; j++) {
      if (i === j) continue
      const arc = computeProgressDistance(progress[i], progress[j], totalLength)
      if (arc > neighborArcDistance) continue
      const offsetDiff = offsets[j] - offsets[i]
      if (offsetDiff < 0 && -offsetDiff < bestLeftGap) {
        bestLeftGap = -offsetDiff
        bestLeftIndex = j
      } else if (offsetDiff > 0 && offsetDiff < bestRightGap) {
        bestRightGap = offsetDiff
        bestRightIndex = j
      }
    }

    if (bestLeftIndex !== -1) {
      hasNeighbor[i] = true
      minBounds[i] = Math.max(minBounds[i], offsets[bestLeftIndex] + lateralGap)
    }
    if (bestRightIndex !== -1) {
      hasNeighbor[i] = true
      maxBounds[i] = Math.min(maxBounds[i], offsets[bestRightIndex] - lateralGap)
    }

    const roadMin = -maxOffset
    const roadMax = maxOffset
    minBounds[i] = Math.max(minBounds[i], roadMin)
    maxBounds[i] = Math.min(maxBounds[i], roadMax)

    if (minBounds[i] > maxBounds[i]) {
      const mid = (minBounds[i] + maxBounds[i]) / 2
      minBounds[i] = mid
      maxBounds[i] = mid
    }
  }

  return { min: minBounds, max: maxBounds, hasNeighbor }
}

export function computeDesiredOffsetProfile(
  spline: PathSpline,
  distance: number,
  options: OffsetProfileOptions
): number {
  const { lookAhead, maxOffset, totalLength, minRadius, boundaryMode = 'loop' } = options
  if (!spline || totalLength <= 0 || maxOffset <= 0) return 0
  const curvatureThreshold = minRadius > 0 ? 1 / minRadius : 0.02
  const halfLook = Math.max(lookAhead * 0.5, 1)
  const sampleOffsets = [-halfLook, -halfLook * 0.4, 0, halfLook * 0.25, halfLook, lookAhead]

  let signedSum = 0
  let aheadAbs = 0
  let behindAbs = 0
  let forwardSigned = 0
  let maxAbsCurvature = 0

  for (const offset of sampleOffsets) {
    const sampleDistance = distance + offset
    const curvature = computeSignedCurvature(
      spline,
      sampleDistance,
      totalLength,
      undefined,
      boundaryMode,
    )
    if (!Number.isFinite(curvature)) {
      continue
    }

    const weight = 1 - Math.min(Math.abs(offset) / Math.max(lookAhead, 1), 1)
    const clampedWeight = Math.max(weight, 0.1)
    signedSum += curvature * clampedWeight

    const absCurvature = Math.abs(curvature)
    maxAbsCurvature = Math.max(maxAbsCurvature, absCurvature)
    if (offset >= 0) {
      aheadAbs += absCurvature * clampedWeight
      forwardSigned += curvature * clampedWeight
    } else {
      behindAbs += absCurvature * clampedWeight
    }
  }

  if (maxAbsCurvature < curvatureThreshold * 0.15) {
    return 0
  }

  let orientation = 0
  const forwardStrength = Math.abs(forwardSigned)
  if (forwardStrength > maxAbsCurvature * 0.1) {
    orientation = Math.sign(forwardSigned)
  }
  if (orientation === 0) {
    const combinedStrength = Math.abs(signedSum)
    if (combinedStrength > maxAbsCurvature * 0.1) {
      orientation = Math.sign(signedSum)
    }
  }
  if (orientation === 0) {
    return 0
  }

  const normalizedCurvature = MathUtils.clamp(
    maxAbsCurvature / Math.max(curvatureThreshold, 1e-6),
    0,
    1,
  )
  const intensity = Math.pow(normalizedCurvature, 0.35)
  if (intensity <= 1e-3) {
    return 0
  }

  const totalEnvelope = aheadAbs + behindAbs
  const progression =
    totalEnvelope > 1e-6 ? MathUtils.clamp(aheadAbs / totalEnvelope, 0, 1) : 0.5
  const apexWeight = MathUtils.smoothstep(progression, 0.35, 0.75)
  const outsideWeight = 1 - apexWeight

  const outsideTarget = orientation * maxOffset * 0.55
  const insideTarget = -orientation * maxOffset
  const blended = outsideTarget * outsideWeight + insideTarget * apexWeight

  return MathUtils.clamp(blended * intensity, -maxOffset, maxOffset)
}

export function constrainOffsetWithinRate(
  current: number,
  desired: number,
  minBound: number,
  maxBound: number,
  maxRate: number,
  timeBudget: number
): number {
  const clampedMin = Math.min(minBound, maxBound)
  const clampedMax = Math.max(minBound, maxBound)
  const clampedCurrent = MathUtils.clamp(current, clampedMin, clampedMax)
  const clampedTarget = MathUtils.clamp(desired, clampedMin, clampedMax)

  if (!Number.isFinite(maxRate) || maxRate <= 0) {
    return clampedTarget
  }

  if (!Number.isFinite(timeBudget) || timeBudget <= 0) {
    return clampedCurrent
  }

  const maxDelta = Math.abs(maxRate) * timeBudget
  if (!Number.isFinite(maxDelta) || maxDelta <= 0) {
    return clampedCurrent
  }

  const minReachable = clampedCurrent - maxDelta
  const maxReachable = clampedCurrent + maxDelta
  return MathUtils.clamp(clampedTarget, minReachable, maxReachable)
}

export function steerOffsetTowardTarget(
  current: number,
  desired: number,
  minBound: number,
  maxBound: number,
  dt: number,
  maxRate: number
): number {
  const clampedTarget = MathUtils.clamp(desired, minBound, maxBound)
  if (maxRate <= 0 || dt <= 0) {
    return MathUtils.clamp(clampedTarget, minBound, maxBound)
  }
  const maxChange = maxRate * dt
  const delta = clampedTarget - current
  if (Math.abs(delta) <= maxChange) {
    return MathUtils.clamp(clampedTarget, minBound, maxBound)
  }
  const next = current + Math.sign(delta) * maxChange
  return MathUtils.clamp(next, minBound, maxBound)
}

export interface OffsetCostWeights {
  power: number
  gap: number
  wall: number
}

export interface OffsetCandidateEvaluationParams {
  currentOffset: number
  candidates: number[]
  powerRatios: number[]
  minBound: number
  maxBound: number
  maxOffset: number
  gapAhead: number
  gapThreshold: number
  weights: OffsetCostWeights
  wallComfort: number
  referenceStep: number
  lateralGapInfluence?: number
}

export interface OffsetCandidateResult {
  targetOffset: number
  bestIndex: number
  lateralForce: number
  cost: number
}

function clampOffset(offset: number, minBound: number, maxBound: number, maxOffset: number): number {
  const roadMin = -Math.abs(maxOffset)
  const roadMax = Math.abs(maxOffset)
  const clampedMin = Math.max(Math.min(minBound, maxBound), roadMin)
  const clampedMax = Math.min(Math.max(minBound, maxBound), roadMax)
  return MathUtils.clamp(offset, clampedMin, clampedMax)
}

export function generateOffsetCandidates(
  currentOffset: number,
  delta: number,
  minBound: number,
  maxBound: number,
  maxOffset: number,
): number[] {
  const safeDelta = Math.max(0.05, Math.abs(delta))
  const values = new Set<number>()
  const push = (value: number) => {
    const clamped = clampOffset(value, minBound, maxBound, maxOffset)
    values.add(Number.isFinite(clamped) ? clamped : 0)
  }

  push(currentOffset)
  push(currentOffset + safeDelta)
  push(currentOffset - safeDelta)
  push(currentOffset + safeDelta * 2)
  push(currentOffset - safeDelta * 2)
  push(minBound)
  push(maxBound)

  return Array.from(values)
}

export function evaluateOffsetCandidates(
  params: OffsetCandidateEvaluationParams,
): OffsetCandidateResult {
  const {
    currentOffset,
    candidates,
    powerRatios,
    minBound,
    maxBound,
    maxOffset,
    gapAhead,
    gapThreshold,
    weights,
    wallComfort,
    referenceStep,
    lateralGapInfluence = 0.25,
  } = params

  const safeWallComfort = Math.max(0.05, Math.abs(wallComfort))
  const safeStep = Math.max(0.05, Math.abs(referenceStep))

  let bestIndex = 0
  let bestCost = Infinity

  for (let i = 0; i < candidates.length; i++) {
    const candidate = clampOffset(candidates[i], minBound, maxBound, maxOffset)
    const powerRatio = Math.max(0, powerRatios[i] ?? powerRatios[0] ?? 0)

    const clampedMin = clampOffset(minBound, minBound, maxBound, maxOffset)
    const clampedMax = clampOffset(maxBound, minBound, maxBound, maxOffset)
    const leftClearance = Math.max(0, candidate - clampedMin)
    const rightClearance = Math.max(0, clampedMax - candidate)
    const minClearance = Math.min(leftClearance, rightClearance)

    const normalizedClearance = MathUtils.clamp(minClearance / safeWallComfort, 0, 1)
    const wallPenalty = Math.pow(1 - normalizedClearance, 2)

    const effectiveGap = gapAhead + minClearance * lateralGapInfluence
    const gapShortage = Math.max(0, gapThreshold - effectiveGap)
    const normalizedGapShortage =
      gapThreshold > 1e-3 ? Math.min(1, gapShortage / gapThreshold) : 0
    const gapPenalty = normalizedGapShortage ** 2

    const cost =
      weights.power * powerRatio +
      weights.gap * gapPenalty +
      weights.wall * wallPenalty

    if (cost < bestCost) {
      bestCost = cost
      bestIndex = i
    }
  }

  const bestOffset = clampOffset(candidates[bestIndex], minBound, maxBound, maxOffset)
  const delta = bestOffset - currentOffset
  const lateralForce = MathUtils.clamp(delta / safeStep, -1, 1)

  return {
    targetOffset: bestOffset,
    bestIndex,
    lateralForce,
    cost: bestCost,
  }
}

