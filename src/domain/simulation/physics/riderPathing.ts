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
  if (maxCurvature < curvatureThreshold * 0.2) {
    return 0
  }

  const outside = direction * maxOffset * 0.8
  const inside = -direction * maxOffset * 0.9

  if (maxCurvature < 1e-5) {
    return 0
  }

  const curvatureRatio = curvatureAbs / maxCurvature
  if (curvatureRatio < 0.55) {
    return outside
  }

  const aheadRatio = aheadAbs / maxCurvature
  if (aheadRatio > curvatureRatio + 0.1) {
    return outside
  }

  const behindRatio = behindAbs / maxCurvature
  if (behindRatio > curvatureRatio + 0.1) {
    return outside
  }

  return inside
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

