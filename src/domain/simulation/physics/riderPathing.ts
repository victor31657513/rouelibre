/**
 * Path-following helpers used by the physics worker to manage rider offsets.
 *
 * Extension: Tweak behavioural constants or introduce new neighbour models by
 * extending the exported utilities.
 */
import { MathUtils, Vector3 } from 'three'
import { PathSpline } from '../../route/pathSpline'

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
}

const scratchP0 = new Vector3()
const scratchP1 = new Vector3()
const scratchP2 = new Vector3()

function wrapDistance(distance: number, totalLength: number): number {
  if (totalLength <= 0) return distance
  return MathUtils.euclideanModulo(distance, totalLength)
}

function sampleXZ(
  spline: PathSpline,
  distance: number,
  totalLength: number,
  target: Vector3
): Vector3 {
  const wrapped = wrapDistance(distance, totalLength)
  const sample = spline.sampleByDistance(wrapped)
  target.set(sample.position.x, 0, sample.position.z)
  return target
}

export function computeSignedCurvature(
  spline: PathSpline,
  distance: number,
  totalLength: number,
  sampleSpacing = 0.5
): number {
  if (!spline || totalLength <= 0) return 0
  const spacing = Math.max(0.1, sampleSpacing)
  const p0 = sampleXZ(spline, distance - spacing, totalLength, scratchP0)
  const p1 = sampleXZ(spline, distance, totalLength, scratchP1)
  const p2 = sampleXZ(spline, distance + spacing, totalLength, scratchP2)

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
  averageAbsCurvature: number
  maxAbsCurvature: number
  intensity: number
}

export function computeCurvatureEnvelope(
  spline: PathSpline,
  distance: number,
  totalLength: number,
  lookAhead: number,
  referenceRadius: number,
  sampleCount = 5
): CurvatureEnvelope {
  if (!spline || totalLength <= 0) {
    return { averageAbsCurvature: 0, maxAbsCurvature: 0, intensity: 0 }
  }

  const safeLookAhead = Math.max(0, lookAhead)
  const safeSamples = Math.max(1, Math.floor(sampleCount))
  const step = safeSamples > 0 ? safeLookAhead / safeSamples : 0

  let maxAbsCurvature = 0
  let sumAbsCurvature = 0
  let count = 0

  for (let i = 0; i <= safeSamples; i++) {
    const sampleDistance = distance + step * i
    const curvature = Math.abs(computeSignedCurvature(spline, sampleDistance, totalLength))
    if (!Number.isFinite(curvature)) {
      continue
    }

    maxAbsCurvature = Math.max(maxAbsCurvature, curvature)
    sumAbsCurvature += curvature
    count++
  }

  const averageAbsCurvature = count > 0 ? sumAbsCurvature / count : 0
  const fallbackRadius = referenceRadius > 0 ? referenceRadius : 35
  const referenceCurvature = 1 / Math.max(fallbackRadius, 1e-3)
  const intensity = MathUtils.clamp(
    referenceCurvature > 0 ? maxAbsCurvature / referenceCurvature : 0,
    0,
    1
  )

  return { averageAbsCurvature, maxAbsCurvature, intensity }
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
  const { lookAhead, maxOffset, totalLength, minRadius } = options
  if (!spline || totalLength <= 0 || maxOffset <= 0) return 0
  const curvatureNow = computeSignedCurvature(spline, distance, totalLength)
  const halfLook = Math.max(lookAhead * 0.5, 1)
  const curvatureAhead = computeSignedCurvature(spline, distance + halfLook, totalLength)
  const curvatureFar = computeSignedCurvature(spline, distance + lookAhead, totalLength)
  const curvatureBehind = computeSignedCurvature(spline, distance - halfLook, totalLength)

  let direction = Math.sign(curvatureNow)
  if (direction === 0) direction = Math.sign(curvatureAhead)
  if (direction === 0) direction = Math.sign(curvatureFar)
  if (direction === 0) direction = Math.sign(curvatureBehind)
  if (direction === 0) return 0

  const curvatureThreshold = minRadius > 0 ? 1 / minRadius : 0.02
  const aheadAbs = Math.abs(curvatureAhead)
  const farAbs = Math.abs(curvatureFar)
  const behindAbs = Math.abs(curvatureBehind)
  const curvatureAbs = Math.abs(curvatureNow)
  const maxCurvature = Math.max(curvatureAbs, aheadAbs, farAbs, behindAbs)
  if (maxCurvature < curvatureThreshold * 0.15) {
    return 0
  }

  const normalizedCurvature = MathUtils.clamp(
    maxCurvature / Math.max(curvatureThreshold, 1e-6),
    0,
    1
  )
  const intensity = Math.pow(normalizedCurvature, 0.4)
  if (intensity <= 0) {
    return 0
  }

  const outside = direction * maxOffset * 0.75
  const inside = -direction * maxOffset * 0.85

  const safeMax = Math.max(maxCurvature, 1e-6)
  const normalizedAhead = MathUtils.clamp(Math.max(aheadAbs, farAbs) / safeMax, 0, 1)
  const normalizedBehind = MathUtils.clamp(behindAbs / safeMax, 0, 1)
  const normalizedCurrent = MathUtils.clamp(curvatureAbs / safeMax, 0, 1)

  const curvatureFactor = MathUtils.smoothstep(normalizedCurrent, 0.2, 1)
  const balance = MathUtils.clamp(0.5 + 0.5 * (normalizedAhead - normalizedBehind), 0, 1)
  const apexFactor = MathUtils.clamp(1 - Math.abs(balance - 0.5) * 2, 0, 1)

  const insideWeight = curvatureFactor * apexFactor
  const outsideWeight = Math.max(0, 1 - insideWeight)

  const blended = outside * outsideWeight + inside * insideWeight

  return MathUtils.clamp(blended * intensity, -maxOffset, maxOffset)
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

