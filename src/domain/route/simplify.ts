import type { RoutePoint } from './gpx'

/**
 * @fileoverview Douglas-Peucker simplification keeping the 3D path footprint.
 * Reduces the point count while preserving horizontal fidelity which stabilises
 * physics and rendering workloads.
 *
 * Extension: Adapt the distance metric to consider elevation or use an
 * alternative tolerance per axis by replacing `distanceXZ`.
 */
export function simplifyPath(path: RoutePoint[], epsilon: number): RoutePoint[] {
  if (path.length < 3) return [...path]
  const keep = new Array(path.length).fill(false)
  keep[0] = keep[path.length - 1] = true
  const stack: Array<[number, number]> = [[0, path.length - 1]]

  const distanceXZ = (p: RoutePoint, a: RoutePoint, b: RoutePoint): number => {
    const x0 = p.x
    const z0 = p.z
    const x1 = a.x
    const z1 = a.z
    const x2 = b.x
    const z2 = b.z
    const dx = x2 - x1
    const dz = z2 - z1
    if (dx === 0 && dz === 0) return Math.hypot(x0 - x1, z0 - z1)
    const t = ((x0 - x1) * dx + (z0 - z1) * dz) / (dx * dx + dz * dz)
    const projx = x1 + t * dx
    const projz = z1 + t * dz
    return Math.hypot(x0 - projx, z0 - projz)
  }

  while (stack.length) {
    const [start, end] = stack.pop()!
    let maxDist = 0
    let index = -1
    for (let i = start + 1; i < end; i++) {
      const d = distanceXZ(path[i], path[start], path[end])
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

  const out: RoutePoint[] = []
  for (let i = 0; i < path.length; i++) {
    if (keep[i]) out.push(path[i])
  }
  return out
}
