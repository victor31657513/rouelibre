/**
 * Computes the geometric shortest path ("racing line") constrained within the
 * road corridor described by the centre line and width.
 *
 * The implementation mirrors the funnel algorithm used by
 * {@link buildShortestPathLine} while remaining stateless so it can be reused by
 * the simulation worker.
 */
import * as THREE from 'three'
import type { Vec3 } from './gpx'

/**
 * Returns a sequence of points describing the shortest admissible path inside
 * the provided road envelope. When the road has no lateral clearance the
 * centre line is returned unchanged.
 */
export function computeShortestPath(
  centerLine: Vec3[],
  roadWidth: number,
  margin: number,
): Vec3[] {
  if (centerLine.length === 0) {
    return []
  }

  const halfWidth = Math.max(0, roadWidth / 2 - margin)
  if (halfWidth <= 1e-6 || centerLine.length === 1) {
    return centerLine.map((point) => point.clone())
  }

  const up = new THREE.Vector3(0, 1, 0)
  const leftEdge: THREE.Vector3[] = []
  const rightEdge: THREE.Vector3[] = []
  let lastRight = new THREE.Vector3(1, 0, 0)

  for (let i = 0; i < centerLine.length; i++) {
    const curr = centerLine[i]
    const prev = centerLine[Math.max(0, i - 1)]
    const next = centerLine[Math.min(centerLine.length - 1, i + 1)]

    const tangent = next.clone().sub(prev).setY(0)
    if (tangent.lengthSq() <= 1e-6) {
      tangent.copy(new THREE.Vector3(-lastRight.z, 0, lastRight.x))
    }
    tangent.normalize()

    const right = new THREE.Vector3().crossVectors(tangent, up)
    if (right.lengthSq() <= 1e-6) {
      right.copy(lastRight)
    } else {
      right.normalize()
      lastRight = right.clone()
    }

    const left = right.clone().multiplyScalar(-1)
    leftEdge.push(curr.clone().addScaledVector(left, halfWidth))
    rightEdge.push(curr.clone().addScaledVector(right, halfWidth))
  }

  type Portal = { left: THREE.Vector3; right: THREE.Vector3 }
  const portals: Portal[] = []
  for (let i = 0; i < centerLine.length; i++) {
    portals.push({ left: leftEdge[i], right: rightEdge[i] })
  }

  const endPoint = centerLine[centerLine.length - 1].clone()
  portals.push({ left: endPoint, right: endPoint })

  const triarea2 = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): number => {
    return (b.x - a.x) * (c.z - a.z) - (c.x - a.x) * (b.z - a.z)
  }

  const startPoint = centerLine[0].clone()
  const path: Vec3[] = [startPoint.clone()]
  let apex = startPoint.clone()
  let left = portals[0].left.clone()
  let right = portals[0].right.clone()
  let apexIndex = 0
  let leftIndex = 0
  let rightIndex = 0

  for (let i = 1; i < portals.length; i++) {
    const portal = portals[i]
    const leftPoint = portal.left
    const rightPoint = portal.right

    if (triarea2(apex, right, rightPoint) <= 0) {
      if (apex.equals(right) || triarea2(apex, left, rightPoint) > 0) {
        right = rightPoint.clone()
        rightIndex = i
      } else {
        apex = left.clone()
        path.push(apex.clone())
        apexIndex = leftIndex
        right = apex.clone()
        rightIndex = apexIndex
        left = apex.clone()
        leftIndex = apexIndex
        i = apexIndex
        continue
      }
    }

    if (triarea2(apex, left, leftPoint) >= 0) {
      if (apex.equals(left) || triarea2(apex, right, leftPoint) < 0) {
        left = leftPoint.clone()
        leftIndex = i
      } else {
        apex = right.clone()
        path.push(apex.clone())
        apexIndex = rightIndex
        left = apex.clone()
        leftIndex = apexIndex
        right = apex.clone()
        rightIndex = apexIndex
        i = apexIndex
        continue
      }
    }
  }

  path.push(endPoint.clone())
  return path
}
