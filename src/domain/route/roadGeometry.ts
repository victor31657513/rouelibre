/**
 * Utilities responsible for constructing the Three.js meshes that visualise a
 * road surface and its markings.
 *
 * Extension: When adding new decorative elements (crowds, barriers, etc.)
 * create additional builders that follow the same stateless pattern.
 */
import * as THREE from 'three'
import type { Vec3 } from './gpx'

/**
 * Builds a strip of asphalt mesh following the provided centre line.
 *
 * @param centerLine Simplified route used as the road centre.
 * @param width Total road width in meters.
 * @returns A mesh ready to be added to the scene graph.
 *
 * Side effects: none beyond mesh creation.
 */
export function buildRoadMesh(centerLine: Vec3[], width: number): THREE.Mesh {
  const positions: number[] = []
  const indices: number[] = []
  const half = width / 2
  const up = new THREE.Vector3(0, 1, 0)

  for (let i = 0; i < centerLine.length; i++) {
    const curr = centerLine[i]
    const prev = centerLine[i - 1] ?? curr
    const next = centerLine[i + 1] ?? curr
    const dir = next.clone().sub(prev).setY(0).normalize()
    const right = new THREE.Vector3().crossVectors(dir, up).normalize()
    const leftPt = curr.clone().addScaledVector(right, -half)
    const rightPt = curr.clone().addScaledVector(right, half)
    positions.push(leftPt.x, leftPt.y, leftPt.z, rightPt.x, rightPt.y, rightPt.z)
    if (i < centerLine.length - 1) {
      const base = i * 2
      indices.push(base, base + 1, base + 3, base, base + 3, base + 2)
    }
  }

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geom.setIndex(indices)
  geom.computeVertexNormals()

  const mat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 })
  return new THREE.Mesh(geom, mat)
}

/**
 * Creates the dashed line running down the centre of the road.
 *
 * @param centerLine Simplified route used as the road centre.
 * @param lineWidth Width of a stripe in meters.
 * @param dashLen Length of visible paint segments.
 * @param gapLen Gap between two stripes.
 * @returns Instanced quad mesh drawing all stripes.
 */
export function buildCenterDashes(
  centerLine: Vec3[],
  lineWidth: number,
  dashLen: number,
  gapLen: number,
): THREE.Mesh {
  const positions: number[] = []
  const indices: number[] = []
  const up = new THREE.Vector3(0, 1, 0)
  const half = lineWidth / 2
  let index = 0
  // Persist dash progression across segments so that dashes remain evenly
  // spaced even when the underlying centre line is heavily segmented (curves).
  let inDash = true
  let progress = 0

  for (let i = 0; i < centerLine.length - 1; i++) {
    const a = centerLine[i]
    const b = centerLine[i + 1]
    const segment = b.clone().sub(a)
    const segLen = segment.length()
    const dir = segment.clone().normalize()
    const right = new THREE.Vector3().crossVectors(dir, up).normalize()

    let travelled = 0
    while (travelled < segLen) {
      const stateLength = inDash ? dashLen : gapLen
      const remainingInState = Math.max(0, stateLength - progress)
      if (remainingInState <= 1e-6) {
        progress = 0
        inDash = !inDash
        continue
      }
      const step = Math.min(segLen - travelled, remainingInState)

      if (inDash && step > 0) {
        const start = travelled
        const end = travelled + step
        const p0 = a.clone().addScaledVector(dir, start)
        const p1 = a.clone().addScaledVector(dir, end)
        const left0 = p0.clone().addScaledVector(right, -half).setY(p0.y + 0.01)
        const right0 = p0.clone().addScaledVector(right, half).setY(p0.y + 0.01)
        const left1 = p1.clone().addScaledVector(right, -half).setY(p1.y + 0.01)
        const right1 = p1.clone().addScaledVector(right, half).setY(p1.y + 0.01)

        positions.push(
          left0.x,
          left0.y,
          left0.z,
          right0.x,
          right0.y,
          right0.z,
          left1.x,
          left1.y,
          left1.z,
          right1.x,
          right1.y,
          right1.z,
        )
        indices.push(index, index + 1, index + 3, index, index + 3, index + 2)
        index += 4
      }

      travelled += step
      progress += step

      if (progress + 1e-6 >= stateLength) {
        // Advance to the next dash/gap while avoiding floating point drift.
        progress = progress - stateLength
        if (progress < 1e-6) progress = 0
        inDash = !inDash
      }

      if (step === 0) {
        // Avoid infinite loops when the remaining progression equals the
        // current segment length due to precision issues.
        travelled = segLen
      }
    }
  }

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geom.setIndex(indices)
  geom.computeVertexNormals()

  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff })
  return new THREE.Mesh(geom, mat)
}

/**
 * Builds the mesh representing the start/finish line.
 */
export function buildStartLine(
  centerLine: Vec3[],
  width: number,
  offset: number,
  startLineWidth = 0.3,
): THREE.Mesh {
  if (centerLine.length < 2) return new THREE.Mesh()
  const a = centerLine[0]
  const b = centerLine[1]
  const dir = new THREE.Vector3(b.x - a.x, 0, b.z - a.z).normalize()
  const center = new THREE.Vector3(a.x, a.y + 0.02, a.z).add(dir.clone().multiplyScalar(offset))

  const geom = new THREE.BoxGeometry(width, 0.02, startLineWidth)
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const mesh = new THREE.Mesh(geom, mat)
  mesh.position.copy(center)
  mesh.rotation.y = Math.atan2(dir.x, dir.z)
  return mesh
}

/**
 * Generates thin red lines along both road edges to help visual debugging.
 */
export function buildRoadBounds(centerLine: Vec3[], width: number): THREE.LineSegments {
  const positions: number[] = []
  const half = width / 2
  const up = new THREE.Vector3(0, 1, 0)

  for (let i = 0; i < centerLine.length - 1; i++) {
    const a = centerLine[i]
    const b = centerLine[i + 1]
    const dir = new THREE.Vector3(b.x - a.x, 0, b.z - a.z).normalize()
    const right = new THREE.Vector3().crossVectors(dir, up).normalize()
    const left0 = a.clone().addScaledVector(right, -half)
    const right0 = a.clone().addScaledVector(right, half)
    const left1 = b.clone().addScaledVector(right, -half)
    const right1 = b.clone().addScaledVector(right, half)

    positions.push(
      left0.x,
      left0.y + 0.05,
      left0.z,
      left1.x,
      left1.y + 0.05,
      left1.z,
      right0.x,
      right0.y + 0.05,
      right0.z,
      right1.x,
      right1.y + 0.05,
      right1.z,
    )
  }

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  const mat = new THREE.LineBasicMaterial({ color: 0xff0000 })
  return new THREE.LineSegments(geom, mat)
}

/**
 * Builds a thin line representing the geometric shortest path between the
 * start and end of the route while staying inside the road boundaries.
 */
export function buildShortestPathLine(centerLine: Vec3[], roadWidth: number, margin: number): THREE.Line {
  const mat = new THREE.LineBasicMaterial({ color: 0x00ff88 })
  const geom = new THREE.BufferGeometry()
  const line = new THREE.Line(geom, mat)
  line.frustumCulled = false

  if (centerLine.length === 0) {
    line.userData.segments = 0
    return line
  }

  const halfWidth = Math.max(0, roadWidth / 2 - margin)
  const up = new THREE.Vector3(0, 1, 0)

  if (halfWidth <= 1e-6 || centerLine.length === 1) {
    const positions: number[] = []
    for (const point of centerLine) {
      positions.push(point.x, point.y + 0.05, point.z)
    }
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    line.userData.segments = centerLine.length
    return line
  }

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
  const path: THREE.Vector3[] = [startPoint.clone()]
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

  const positions: number[] = []
  for (const point of path) {
    positions.push(point.x, point.y + 0.05, point.z)
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  line.userData.segments = path.length
  return line
}
