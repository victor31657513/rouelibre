/**
 * Domain utilities dedicated to manipulating 3D routes.
 *
 * The helpers defined here operate on arrays of {@link Vec3} describing a GPX
 * track projected in local space. They are intentionally stateless to keep
 * them reusable across rendering, physics and testing layers.
 *
 * Extension: Add new preprocessing steps (e.g. smoothing variants) by exposing
 * additional pure functions from this module. Ensure they only depend on the
 * {@link Vec3} contract so they stay decoupled from Three.js scene objects.
 */
import { Vector3 } from 'three'
import type { Vec3 } from './gpx'

export interface SurfaceSmoothingOptions {
  /** Number of neighbouring samples considered on each side. */
  windowSize?: number
  /**
   * Strength of the smoothing toward the local neighbourhood average.
   * 0 preserves the original point, 1 fully adopts the averaged position.
   */
  blend?: number
  /**
   * Number of passes applied to progressively dampen small-scale artefacts.
   */
  iterations?: number
}

export interface ProgressivePathOptions {
  /** Minimum distance (in meters) required to keep a point ahead of the previous kept point. */
  minForwardDistance?: number
  /**
   * Maximum cosine allowed between two consecutive segments before considering the middle point
   * a backtracking artefact.
   */
  maxBacktrackCosine?: number
  /**
   * Upper bound on the length of the segments considered for backtracking removal. Longer
   * segments are preserved even if they bend sharply since they likely represent true corners.
   */
  maxShortTurnLength?: number
}

const DEFAULT_PROGRESSIVE_OPTIONS: Required<ProgressivePathOptions> = {
  minForwardDistance: 0.35,
  maxBacktrackCosine: -0.15,
  maxShortTurnLength: 2.5,
}

function getProgressiveOptions(options: ProgressivePathOptions = {}): Required<ProgressivePathOptions> {
  return {
    minForwardDistance: options.minForwardDistance ?? DEFAULT_PROGRESSIVE_OPTIONS.minForwardDistance,
    maxBacktrackCosine: options.maxBacktrackCosine ?? DEFAULT_PROGRESSIVE_OPTIONS.maxBacktrackCosine,
    maxShortTurnLength: options.maxShortTurnLength ?? DEFAULT_PROGRESSIVE_OPTIONS.maxShortTurnLength,
  }
}

/**
 * Filters GPX samples that fail to provide forward progression along the path.
 *
 * The function removes duplicate points and short zig-zag artefacts caused by GPS jitter, helping
 * downstream consumers keep a consistent notion of progression.
 */
export function ensureProgressivePath(path: Vec3[], options?: ProgressivePathOptions): Vec3[] {
  if (path.length === 0) return []

  const { minForwardDistance, maxBacktrackCosine, maxShortTurnLength } = getProgressiveOptions(options)

  const progressive: Vec3[] = [path[0].clone()]

  for (let i = 1; i < path.length; i++) {
    const sourcePoint = path[i]
    const candidate = sourcePoint.clone()
    const isLast = i === path.length - 1
    const lastKept = progressive[progressive.length - 1]
    const distance = candidate.distanceTo(lastKept)

    if (!isLast && distance < minForwardDistance) {
      continue
    }

    if (progressive.length >= 2) {
      const prev = progressive[progressive.length - 2]
      const prevSegment = lastKept.clone().sub(prev)
      const nextSegment = candidate.clone().sub(lastKept)
      const prevLength = prevSegment.length()
      const nextLength = nextSegment.length()

      if (prevLength > 1e-6 && nextLength > 1e-6) {
        const prevDir = prevSegment.multiplyScalar(1 / prevLength)
        const nextDir = nextSegment.multiplyScalar(1 / nextLength)
        const cosine = prevDir.dot(nextDir)

        if (
          cosine < maxBacktrackCosine &&
          Math.min(prevLength, nextLength) < maxShortTurnLength
        ) {
          if (prevLength <= nextLength) {
            progressive[progressive.length - 1] = candidate
          }
          continue
        }
      }
    }

    progressive.push(candidate)
  }

  if (progressive.length === 1 && path.length > 1) {
    progressive.push(path[path.length - 1].clone())
  }

  return progressive
}

/**
 * Softens small lateral bumps that can appear after GPX projection or
 * simplification.
 *
 * The smoothing is intentionally gentle to preserve large scale turns while
 * ironing out the sharp micro dents that can create artificial slowdown when
 * computing curvature-based speeds.
 */
export function smoothPathSurface(
  path: Vec3[],
  options: SurfaceSmoothingOptions = {},
): Vec3[] {
  if (path.length < 3) return path.map((p) => p.clone())

  const windowSize = Math.max(1, Math.floor(options.windowSize ?? 3))
  const blend = Math.min(1, Math.max(0, options.blend ?? 0.45))
  const iterations = Math.max(1, Math.floor(options.iterations ?? 2))

  let current = path.map((p) => p.clone())

  for (let iter = 0; iter < iterations; iter++) {
    const next: Vec3[] = [current[0].clone()]

    for (let i = 1; i < current.length - 1; i++) {
      const start = Math.max(0, i - windowSize)
      const end = Math.min(current.length - 1, i + windowSize)
      let sumX = 0
      let sumY = 0
      let sumZ = 0
      let weightSum = 0

      for (let j = start; j <= end; j++) {
        const distance = Math.abs(j - i)
        const weight = windowSize - distance + 1
        sumX += current[j].x * weight
        sumY += current[j].y * weight
        sumZ += current[j].z * weight
        weightSum += weight
      }

      const avgX = sumX / weightSum
      const avgY = sumY / weightSum
      const avgZ = sumZ / weightSum

      const original = current[i]
      const blended = original.clone().lerp(new Vector3(avgX, avgY, avgZ), blend)
      next.push(blended)
    }

    next.push(current[current.length - 1].clone())
    current = next
  }

  return current
}

/**
 * Computes the cumulative positive and negative elevation gain along a GPX
 * profile.
 *
 * @param points Ordered elevation samples along the route.
 * @returns Total ascent and descent in meters.
 *
 * Side effects: none (pure function).
 * Extension: To support more detailed statistics (e.g. grade histogram) add
 * sibling functions that consume the same `points` input.
 */
export function elevationStats(
  points: { ele: number }[],
): { totalGain: number; totalLoss: number } {
  let totalGain = 0
  let totalLoss = 0
  for (let i = 1; i < points.length; i++) {
    const diff = points[i].ele - points[i - 1].ele
    if (diff > 0) totalGain += diff
    else totalLoss -= diff
  }
  return { totalGain, totalLoss }
}

/**
 * Simplifies a path using the Ramer–Douglas–Peucker algorithm on the XZ plane
 * while preserving vertical information.
 *
 * @param path Route waypoints expressed as local coordinates.
 * @param epsilon Maximum lateral error allowed in meters.
 * @returns A new array containing only the kept samples.
 *
 * Side effects: none (input array is not mutated).
 * Extension: If additional simplification heuristics are needed (e.g. adaptive
 * epsilon), wrap this function and expose a dedicated helper rather than
 * modifying it.
 */
export function simplifyPath(path: Vec3[], epsilon: number): Vec3[] {
  if (path.length < 3) return [...path]

  const keep = new Array(path.length).fill(false)
  keep[0] = true
  keep[path.length - 1] = true
  const stack: Array<[number, number]> = [[0, path.length - 1]]

  const distXZ = (p: Vec3, a: Vec3, b: Vec3): number => {
    const x0 = p.x,
      z0 = p.z
    const x1 = a.x,
      z1 = a.z
    const x2 = b.x,
      z2 = b.z
    const dx = x2 - x1
    const dz = z2 - z1
    if (dx === 0 && dz === 0) return Math.hypot(x0 - x1, z0 - z1)
    const denom = dx * dx + dz * dz
    if (denom <= 0) return Math.hypot(x0 - x1, z0 - z1)
    const rawT = ((x0 - x1) * dx + (z0 - z1) * dz) / denom
    const t = Math.max(0, Math.min(1, rawT))
    const projx = x1 + t * dx
    const projz = z1 + t * dz
    return Math.hypot(x0 - projx, z0 - projz)
  }

  while (stack.length) {
    const [start, end] = stack.pop()!
    let maxDist = 0
    let index = -1
    for (let i = start + 1; i < end; i++) {
      const d = distXZ(path[i], path[start], path[end])
      if (d > maxDist) {
        maxDist = d
        index = i
      }
    }
    if (index !== -1 && maxDist > epsilon) {
      keep[index] = true
      stack.push([start, index], [index, end])
    }
  }

  const simplified: Vec3[] = []
  for (let i = 0; i < path.length; i++) if (keep[i]) simplified.push(path[i])
  return simplified
}
