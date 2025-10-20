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
 * Builds a thin line following the route centre used to visualise the optimal path.
 */
export function buildShortestPathLine(centerLine: Vec3[], roadWidth: number, margin: number): THREE.Line {
  if (centerLine.length === 0) {
    const geom = new THREE.BufferGeometry()
    const mat = new THREE.LineBasicMaterial({ color: 0x00ff88 })
    const line = new THREE.Line(geom, mat)
    line.userData.segments = 0
    line.frustumCulled = false
    return line
  }

  const halfWidth = Math.max(0, roadWidth / 2 - margin)
  const isClosed = centerLine.length > 2 && centerLine[0].distanceTo(centerLine[centerLine.length - 1]) < 1
  const targetAngle = Math.PI / 3
  const rawOffsets: number[] = []

  for (let i = 0; i < centerLine.length; i++) {
    const curr = centerLine[i]
    const prev = centerLine[isClosed ? (i - 1 + centerLine.length) % centerLine.length : Math.max(0, i - 1)]
    const next = centerLine[isClosed ? (i + 1) % centerLine.length : Math.min(centerLine.length - 1, i + 1)]

    const dirPrev = prev === curr ? new THREE.Vector3(0, 0, 0) : curr.clone().sub(prev).setY(0)
    const dirNext = next === curr ? new THREE.Vector3(0, 0, 0) : next.clone().sub(curr).setY(0)

    if (dirPrev.lengthSq() === 0 || dirNext.lengthSq() === 0) {
      rawOffsets.push(0)
      continue
    }

    dirPrev.normalize()
    dirNext.normalize()
    const cross = dirPrev.x * dirNext.z - dirPrev.z * dirNext.x
    const dot = THREE.MathUtils.clamp(dirPrev.x * dirNext.x + dirPrev.z * dirNext.z, -1, 1)
    const angle = Math.atan2(cross, dot)
    const intensity = THREE.MathUtils.clamp(Math.abs(angle) / targetAngle, 0, 1)
    const offset = Math.sign(angle) * intensity * halfWidth
    rawOffsets.push(offset)
  }

  if (!isClosed) {
    rawOffsets[0] = 0
    rawOffsets[rawOffsets.length - 1] = 0
  }

  const radius = Math.min(12, Math.max(2, Math.floor(centerLine.length / 12)))
  const sigma = Math.max(1, radius / 2)
  const kernelSize = radius * 2 + 1
  const kernel: number[] = []
  let kernelSum = 0
  for (let i = 0; i < kernelSize; i++) {
    const distance = i - radius
    const weight = Math.exp(-(distance * distance) / (2 * sigma * sigma))
    kernel.push(weight)
    kernelSum += weight
  }
  const normalisedKernel = kernel.map((w) => w / kernelSum)

  const smoothedOffsets: number[] = new Array(centerLine.length).fill(0)
  for (let i = 0; i < centerLine.length; i++) {
    let acc = 0
    for (let k = -radius; k <= radius; k++) {
      const kernelIndex = k + radius
      let sampleIndex = i + k
      if (isClosed) {
        sampleIndex = (sampleIndex % centerLine.length + centerLine.length) % centerLine.length
      } else if (sampleIndex < 0 || sampleIndex >= centerLine.length) {
        sampleIndex = Math.max(0, Math.min(centerLine.length - 1, sampleIndex))
      }
      acc += rawOffsets[sampleIndex] * normalisedKernel[kernelIndex]
    }
    smoothedOffsets[i] = THREE.MathUtils.clamp(acc, -halfWidth, halfWidth)
  }

  if (!isClosed) {
    smoothedOffsets[0] = 0
    smoothedOffsets[smoothedOffsets.length - 1] = 0
  }

  const up = new THREE.Vector3(0, 1, 0)
  const positions: number[] = []

  for (let i = 0; i < centerLine.length; i++) {
    const curr = centerLine[i]
    const prev = centerLine[isClosed ? (i - 1 + centerLine.length) % centerLine.length : Math.max(0, i - 1)]
    const next = centerLine[isClosed ? (i + 1) % centerLine.length : Math.min(centerLine.length - 1, i + 1)]
    const dir = next.clone().sub(prev).setY(0)
    if (dir.lengthSq() === 0) {
      positions.push(curr.x, curr.y + 0.05, curr.z)
      continue
    }
    dir.normalize()
    const normal = new THREE.Vector3().crossVectors(up, dir).normalize()
    const offsetPoint = curr.clone().addScaledVector(normal, smoothedOffsets[i])
    positions.push(offsetPoint.x, offsetPoint.y + 0.05, offsetPoint.z)
  }

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  const mat = new THREE.LineBasicMaterial({ color: 0x00ff88 })
  const line = new THREE.Line(geom, mat)
  line.userData.segments = centerLine.length
  line.frustumCulled = false
  return line
}
