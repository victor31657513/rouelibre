/**
 * Updates the rider instanced mesh and helper objects according to the state
 * coming from the physics worker.
 *
 * Extension: If more visual representations are needed (e.g. shadows), expose
 * additional callbacks from this module to keep rendering logic centralised.
 */
import * as THREE from 'three'
import type { PathSpline } from '../route/pathSpline'

export interface PelotonSceneConfig {
  laneWidth: number
  roadWidth: number
  margin: number
}

export class PelotonSceneUpdater {
  private readonly ridersMesh: THREE.InstancedMesh
  private readonly riderObjects: THREE.Object3D[]
  private readonly tempObject = new THREE.Object3D()
  private readonly geometryAlign = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    -Math.PI / 2,
  )

  private config: PelotonSceneConfig
  private spline: PathSpline | null = null
  private roadMesh: THREE.Mesh | null = null

  constructor(
    ridersMesh: THREE.InstancedMesh,
    riderObjects: THREE.Object3D[],
    config: PelotonSceneConfig,
  ) {
    this.ridersMesh = ridersMesh
    this.riderObjects = riderObjects
    this.config = config
  }

  /** Updates clamping settings applied when projecting riders on the road. */
  setConfig(config: PelotonSceneConfig): void {
    this.config = config
  }

  /** Registers the spline used to project longitudinal progress into 3D space. */
  setSpline(spline: PathSpline | null): void {
    this.spline = spline
  }

  /** Sets the road mesh so offsets are transformed in world space correctly. */
  setRoadMesh(mesh: THREE.Mesh | null): void {
    this.roadMesh = mesh
  }

  /** Applies the latest state buffer to the instanced mesh. */
  applyState(state: Float32Array): void {
    if (!this.spline) return

    const { laneWidth, roadWidth, margin } = this.config
    const qRoad = this.roadMesh
      ? this.roadMesh.getWorldQuaternion(new THREE.Quaternion())
      : new THREE.Quaternion()
    const count = Math.min(
      this.riderObjects.length,
      this.ridersMesh.count,
      Math.floor(state.length / 4),
    )

    for (let i = 0; i < count; i++) {
      const base = i * 4
      const s = state[base + 0]
      let t = state[base + 1]
      const h = state[base + 2]

      const maxT = roadWidth / 2 - laneWidth / 2 - margin
      const clampedT = THREE.MathUtils.clamp(t, -maxT, maxT)
      if (clampedT !== t) {
        state[base + 1] = clampedT
      }
      t = clampedT

      const sample = this.spline.sampleByDistance(s)
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
      forwardQuat.multiply(this.geometryAlign)

      const localPos = sample.position
        .clone()
        .add(right.multiplyScalar(t))
        .add(up.multiplyScalar(h))

      const worldPos = this.roadMesh ? this.roadMesh.localToWorld(localPos.clone()) : localPos
      const worldQuat = this.roadMesh ? qRoad.clone().multiply(forwardQuat) : forwardQuat

      this.tempObject.position.copy(worldPos)
      this.tempObject.quaternion.copy(worldQuat)
      this.tempObject.updateMatrix()
      this.ridersMesh.setMatrixAt(i, this.tempObject.matrix)
      this.riderObjects[i].position.copy(worldPos)
    }

    this.ridersMesh.instanceMatrix.needsUpdate = true
  }
}
