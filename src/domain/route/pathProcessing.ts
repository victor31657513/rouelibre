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
import type { Vec3 } from './gpx'

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
