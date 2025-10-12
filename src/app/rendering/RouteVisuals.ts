import * as THREE from 'three'
import type { RoutePoint } from '../../domain/route/gpx'
import { ROAD_CONFIG } from '../config'

/**
 * @fileoverview Manages the meshes that render the current road geometry.
 * Responsible for building and clearing the road surface, markings and helper
 * visuals whenever a new GPX track is loaded.
 *
 * Extension: Create additional decorations (spectators, signage) by attaching
 * them to the `group` field so they are automatically cleared on updates.
 */
export class RouteVisuals {
  readonly group = new THREE.Group()
  private roadMesh: THREE.Mesh | null = null
  private ready = false

  constructor(private readonly scene: THREE.Scene) {
    this.group.name = 'route'
    scene.add(this.group)
  }

  /** Removes previous meshes and rebuilds them based on the supplied path. */
  update(path: RoutePoint[]): void {
    this.clear()
    if (!path.length) {
      this.ready = false
      return
    }

    this.roadMesh = this.buildRoadMesh(path, ROAD_CONFIG.width)
    this.roadMesh.name = 'routeMesh'
    this.group.add(this.roadMesh)

    const markings = this.buildCenterDashes(
      path,
      ROAD_CONFIG.lineWidth,
      ROAD_CONFIG.dashLength,
      ROAD_CONFIG.gapLength,
    )
    markings.name = 'centerMarkings'
    this.group.add(markings)

    const startLine = this.buildStartLine(path, ROAD_CONFIG.width, ROAD_CONFIG.startLineOffset)
    startLine.name = 'startLine'
    this.group.add(startLine)

    const bounds = this.buildRoadBounds(path, ROAD_CONFIG.width)
    bounds.name = 'roadBounds'
    this.group.add(bounds)

    this.ready = true
  }

  /** Clears the current meshes from the scene. */
  clear(): void {
    while (this.group.children.length) {
      this.group.remove(this.group.children[0]!)
    }
    this.roadMesh = null
    this.ready = false
  }

  /** Exposes the road mesh for projection or collision queries. */
  getRoadMesh(): THREE.Mesh | null {
    return this.roadMesh
  }

  /** Tells controllers whether the route meshes are ready for sampling. */
  isReady(): boolean {
    return this.ready
  }

  private buildRoadMesh(centerLine: RoutePoint[], width: number): THREE.Mesh {
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
        const b = i * 2
        indices.push(b, b + 1, b + 3, b, b + 3, b + 2)
      }
    }
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geom.setIndex(indices)
    geom.computeVertexNormals()
    const mat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 })
    return new THREE.Mesh(geom, mat)
  }

  private buildCenterDashes(
    centerLine: RoutePoint[],
    lineWidth: number,
    dashLen: number,
    gapLen: number,
  ): THREE.Mesh {
    const positions: number[] = []
    const indices: number[] = []
    const up = new THREE.Vector3(0, 1, 0)
    const half = lineWidth / 2
    let idx = 0
    for (let i = 0; i < centerLine.length - 1; i++) {
      const a = centerLine[i]
      const b = centerLine[i + 1]
      const segVec = b.clone().sub(a)
      const segLen = segVec.length()
      const dir = segVec.clone().normalize()
      const right = new THREE.Vector3().crossVectors(dir, up).normalize()
      for (let d = 0; d < segLen; d += dashLen + gapLen) {
        const start = d
        const end = Math.min(segLen, d + dashLen)
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
        indices.push(idx, idx + 1, idx + 3, idx, idx + 3, idx + 2)
        idx += 4
      }
    }
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geom.setIndex(indices)
    geom.computeVertexNormals()
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff })
    return new THREE.Mesh(geom, mat)
  }

  private buildStartLine(
    centerLine: RoutePoint[],
    width: number,
    offset: number,
  ): THREE.Mesh {
    if (centerLine.length < 2) return new THREE.Mesh()
    const a = centerLine[0]
    const b = centerLine[1]
    const dir = new THREE.Vector3(b.x - a.x, 0, b.z - a.z).normalize()
    const center = new THREE.Vector3(a.x, a.y + 0.02, a.z).add(dir.clone().multiplyScalar(offset))
    const geom = new THREE.BoxGeometry(width, 0.02, ROAD_CONFIG.startLineWidth)
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const mesh = new THREE.Mesh(geom, mat)
    mesh.position.copy(center)
    mesh.rotation.y = Math.atan2(dir.x, dir.z)
    return mesh
  }

  private buildRoadBounds(centerLine: RoutePoint[], width: number): THREE.LineSegments {
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
}
