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
  private readonly tempQuaternion = new THREE.Quaternion()
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
    const count = Math.min(
      this.riderObjects.length,
      this.ridersMesh.count,
      Math.floor(state.length / 7),
    )

    for (let i = 0; i < count; i++) {
      const base = i * 7
      const x = state[base + 0]
      const y = state[base + 1]
      const z = state[base + 2]
      const qx = state[base + 3]
      const qy = state[base + 4]
      const qz = state[base + 5]
      const qw = state[base + 6]

      this.tempObject.position.set(x, y, z)
      this.tempQuaternion.set(qx, qy, qz, qw).normalize()
      this.tempObject.quaternion.copy(
        this.tempQuaternion.multiply(this.geometryAlign),
      )
      this.tempObject.updateMatrix()
      this.ridersMesh.setMatrixAt(i, this.tempObject.matrix)
      this.riderObjects[i].position.set(x, y, z)
      this.riderObjects[i].quaternion.copy(this.tempObject.quaternion)
    }

    this.ridersMesh.instanceMatrix.needsUpdate = true
  }
}
