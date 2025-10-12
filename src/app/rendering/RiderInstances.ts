import * as THREE from 'three'
import type { PathSpline } from '../../domain/route/pathSpline'
import { ROAD_CONFIG, SIMULATION_CONFIG } from '../config'

/**
 * @fileoverview Converts simulation buffers into instanced mesh transforms.
 * Keeps the logic responsible for translating spline coordinates to world
 * space consolidated, ensuring both rendering and camera controllers can reuse
 * the same rider objects.
 *
 * Extension: Attach additional per-rider attributes (materials, uniforms) by
 * enriching this class and exposing hooks before `instanceMatrix` updates.
 */
export class RiderInstances {
  constructor(
    private readonly mesh: THREE.InstancedMesh,
    private readonly riderObjects: THREE.Object3D[],
  ) {}

  /** Applies the latest simulation state to the instanced mesh. */
  apply(
    positions: Float32Array,
    spline: PathSpline,
    roadMesh: THREE.Mesh | null,
  ): void {
    if (!positions.length) return
    const tmp = new THREE.Object3D()
    const qRoad = roadMesh
      ? roadMesh.getWorldQuaternion(new THREE.Quaternion())
      : new THREE.Quaternion()
    const geometryAlign = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      -Math.PI / 2,
    )

    const roadHalfWidth = ROAD_CONFIG.width / 2 - SIMULATION_CONFIG.laneWidth / 2 - SIMULATION_CONFIG.roadMargin

    for (let i = 0; i < this.mesh.count; i++) {
      const base = i * 4
      const s = positions[base + 0]
      let t = positions[base + 1]
      const h = positions[base + 2]

      const clampedT = THREE.MathUtils.clamp(t, -roadHalfWidth, roadHalfWidth)
      if (clampedT !== t) {
        positions[base + 1] = clampedT
      }
      t = clampedT

      const sample = spline.sampleByDistance(s)
      const tangent = sample.tangent
      const right = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()
      const up = new THREE.Vector3(0, 1, 0)
      const tangentXZ = tangent.clone().setY(0)
      if (tangentXZ.lengthSq() < 1e-6) {
        tangentXZ.set(0, 0, 1)
      }
      tangentXZ.normalize()

      const forwardQuat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        tangentXZ,
      )
      forwardQuat.multiply(geometryAlign)

      const localPos = sample.position
        .clone()
        .add(right.multiplyScalar(t))
        .add(up.multiplyScalar(h))

      const worldPos = roadMesh ? roadMesh.localToWorld(localPos.clone()) : localPos
      const worldQuat = roadMesh ? qRoad.clone().multiply(forwardQuat) : forwardQuat

      tmp.position.copy(worldPos)
      tmp.quaternion.copy(worldQuat)
      tmp.updateMatrix()
      this.mesh.setMatrixAt(i, tmp.matrix)
      this.riderObjects[i].position.copy(worldPos)
    }
    this.mesh.instanceMatrix.needsUpdate = true
  }
}
