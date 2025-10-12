/**
 * Encapsulates the follow camera behaviour and user controlled yaw offset.
 *
 * The rig keeps track of the underlying orientation returned by the stabilised
 * follow camera and applies an additional yaw rotation driven by user input.
 *
 * Extension: introduce new controls (e.g. pitch locks) by adding methods that
 * operate on {@link baseOrientation} while keeping the API stable.
 */
import * as THREE from 'three'
import { StabilizedFollowCamera } from './StabilizedFollowCamera'
import type { Vec3 } from '../route/gpx'

export interface CameraRigOptions {
  followOffset: THREE.Vector3
}

interface CameraPose {
  position: THREE.Vector3
  quaternion: THREE.Quaternion
}

export class CameraRig {
  readonly camera: THREE.PerspectiveCamera
  readonly followCamera: StabilizedFollowCamera

  private readonly smoothedQuat: THREE.Quaternion
  private baseOrientation: THREE.Quaternion
  private yawOffset = 0
  private initialPose: CameraPose | null = null

  constructor(camera: THREE.PerspectiveCamera, options: CameraRigOptions) {
    this.camera = camera
    this.followCamera = new StabilizedFollowCamera(camera)
    this.followCamera.setFollowOffset(options.followOffset.clone())
    this.baseOrientation = camera.quaternion.clone()
    this.smoothedQuat = (this.followCamera as unknown as { _smoothedQuat: THREE.Quaternion })._smoothedQuat
  }

  /**
   * Updates the follow camera and reapplies the user yaw offset.
   *
   * @param dt Delta time in seconds.
   * @param targets Objects the follow camera should keep in frame.
   * @param lockOrientation Keep the previous orientation when true (used while
   * the user drags with the middle mouse button).
   */
  update(dt: number, targets: THREE.Object3D[], lockOrientation = false): void {
    const previousBase = this.baseOrientation.clone()
    const previousFinal = this.camera.quaternion.clone()

    this.followCamera.update(dt, targets)

    if (lockOrientation) {
      this.baseOrientation.copy(previousBase)
      this.camera.quaternion.copy(previousFinal)
      this.smoothedQuat.copy(this.camera.quaternion)
      return
    }

    this.baseOrientation.copy(this.camera.quaternion)
    this.applyCurrentYaw()
  }

  /**
   * Instantly snaps the camera towards the provided targets while respecting
   * the stored yaw offset.
   */
  focus(targets: THREE.Object3D[]): void {
    this.followCamera.snapTo(targets)
    this.baseOrientation.copy(this.camera.quaternion)
    this.applyCurrentYaw()
  }

  /**
   * Adds an incremental yaw offset, expressed in radians.
   */
  addYaw(delta: number): void {
    this.yawOffset += delta
    this.applyCurrentYaw()
  }

  /**
   * Removes any user defined yaw offset.
   */
  resetYaw(): void {
    this.yawOffset = 0
    this.applyCurrentYaw()
  }

  /**
   * Saves an initial pose based on the first segment of the provided path.
   * Calling {@link restoreInitialPose} will bring the camera back to this
   * configuration.
   */
  setInitialPose(path: Vec3[], cameraHeight: number, cameraDistance: number): void {
    this.initialPose = null
    if (path.length < 2) return

    const start = new THREE.Vector3(path[0].x, path[0].y, path[0].z)
    let tangent: THREE.Vector3 | null = null
    for (let i = 1; i < path.length; i++) {
      const candidate = new THREE.Vector3(path[i].x, path[i].y, path[i].z).sub(start)
      if (candidate.lengthSq() > 1e-6) {
        tangent = candidate.normalize()
        break
      }
    }

    if (!tangent) return

    const up = new THREE.Vector3(0, 1, 0)
    const desiredPosition = start
      .clone()
      .addScaledVector(up, cameraHeight)
      .addScaledVector(tangent, -cameraDistance)

    this.camera.up.set(0, 1, 0)
    this.camera.position.copy(desiredPosition)
    const target = start.clone().add(tangent)
    this.camera.lookAt(target)

    this.baseOrientation.copy(this.camera.quaternion)
    this.resetYaw()

    this.initialPose = {
      position: this.camera.position.clone(),
      quaternion: this.camera.quaternion.clone(),
    }
  }

  /** Restores the pose stored by {@link setInitialPose}. */
  restoreInitialPose(): void {
    if (!this.initialPose) return
    this.camera.up.set(0, 1, 0)
    this.camera.position.copy(this.initialPose.position)
    this.baseOrientation.copy(this.initialPose.quaternion)
    this.resetYaw()
  }

  private applyCurrentYaw(): void {
    const offsetQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, this.yawOffset, 0, 'YXZ'))
    const finalQuat = this.baseOrientation.clone().multiply(offsetQuat)
    this.camera.quaternion.copy(finalQuat)
    this.smoothedQuat.copy(this.camera.quaternion)
  }
}
