import * as THREE from 'three'
import type { RoutePoint } from '../../domain/route/gpx'
import { CAMERA_CONFIG } from '../config'
import { SceneContext } from '../rendering/SceneContext'

/**
 * @fileoverview Bridges the stabilised follow camera with manual controls.
 * Handles initial placement, user-driven yaw offsets and camera snapping when a
 * rider selection changes.
 *
 * Extension: Add cinematic camera paths by injecting alternative update modes
 * into the `update` method while keeping the stabilised follow camera as the
 * default implementation.
 */
export class CameraController {
  private rotating = false
  private yawOffset = 0
  private lastMiddleTime = 0
  private initialPose: { position: THREE.Vector3; quaternion: THREE.Quaternion } | null = null

  constructor(private readonly sceneContext: SceneContext) {
    sceneContext.followCamera.setFollowOffset(
      new THREE.Vector3(0, CAMERA_CONFIG.followHeight, -CAMERA_CONFIG.followDistance),
    )
  }

  /** Registers mouse interactions on the provided canvas. */
  bindInteractions(canvas: HTMLCanvasElement, getTargets: () => THREE.Object3D[]): void {
    canvas.addEventListener('mousedown', (event) => {
      if (event.button === 1) {
        event.preventDefault()
        this.rotating = true
      }
    })

    window.addEventListener('mouseup', (event) => {
      if (event.button === 1) {
        const now = performance.now()
        if (now - this.lastMiddleTime < 300) {
          if (this.initialPose) this.restoreInitialPose()
          else this.applyYaw(0, getTargets())
        }
        this.lastMiddleTime = now
      }
      this.rotating = false
    })

    canvas.addEventListener('mouseleave', () => {
      this.rotating = false
    })

    canvas.addEventListener('mousemove', (event) => {
      if (this.rotating) {
        this.yawOffset += event.movementX * CAMERA_CONFIG.rotationSensitivity
      }
    })

    canvas.addEventListener(
      'wheel',
      (event) => {
        event.preventDefault()
        const { camera } = this.sceneContext
        camera.fov = THREE.MathUtils.clamp(
          camera.fov + event.deltaY * 0.05,
          CAMERA_CONFIG.minFov,
          CAMERA_CONFIG.maxFov,
        )
        camera.updateProjectionMatrix()
      },
      { passive: false },
    )
  }

  /**
   * Updates the follow camera, applying manual yaw offsets when requested.
   * @param dt Delta time in seconds since the last frame.
   * @param targets Rider objects to focus on (usually a single selected rider).
   */
  update(dt: number, targets: THREE.Object3D[]): void {
    const previous = this.sceneContext.camera.quaternion.clone()
    this.sceneContext.followCamera.update(dt, targets)
    if (this.rotating) this.sceneContext.camera.quaternion.copy(previous)
    const offsetQuat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, this.yawOffset, 0, 'YXZ'),
    )
    this.sceneContext.camera.quaternion.multiply(offsetQuat)
    ;(this.sceneContext.followCamera as unknown as { _smoothedQuat: THREE.Quaternion })._smoothedQuat.copy(
      this.sceneContext.camera.quaternion,
    )
  }

  /** Immediately snaps the follow camera to the provided targets. */
  focus(targets: THREE.Object3D[]): void {
    this.sceneContext.followCamera.snapTo(targets)
    const offsetQuat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, this.yawOffset, 0, 'YXZ'),
    )
    this.sceneContext.camera.quaternion.multiply(offsetQuat)
    ;(this.sceneContext.followCamera as unknown as { _smoothedQuat: THREE.Quaternion })._smoothedQuat.copy(
      this.sceneContext.camera.quaternion,
    )
  }

  /** Stores the initial camera pose based on the first segment of the path. */
  setInitialPose(path: RoutePoint[]): void {
    this.initialPose = null
    if (path.length < 2) return

    const start = path[0]
    let tangent: THREE.Vector3 | null = null
    for (let i = 1; i < path.length; i++) {
      const candidate = path[i].clone().sub(start)
      if (candidate.lengthSq() > 1e-6) {
        tangent = candidate.normalize()
        break
      }
    }
    if (!tangent) return

    const up = new THREE.Vector3(0, 1, 0)
    const desiredPosition = start
      .clone()
      .addScaledVector(up, CAMERA_CONFIG.followHeight)
      .addScaledVector(tangent, -CAMERA_CONFIG.followDistance)

    const { camera } = this.sceneContext
    camera.up.set(0, 1, 0)
    camera.position.copy(desiredPosition)
    const target = start.clone().add(tangent)
    camera.lookAt(target)

    this.initialPose = {
      position: camera.position.clone(),
      quaternion: camera.quaternion.clone(),
    }

    this.yawOffset = 0
    ;(this.sceneContext.followCamera as unknown as { _smoothedQuat: THREE.Quaternion })._smoothedQuat.copy(
      camera.quaternion,
    )
  }

  /** Restores the stored initial pose when the user returns home. */
  restoreInitialPose(): void {
    if (!this.initialPose) return
    const { camera } = this.sceneContext
    this.yawOffset = 0
    camera.up.set(0, 1, 0)
    camera.position.copy(this.initialPose.position)
    camera.quaternion.copy(this.initialPose.quaternion)
    ;(this.sceneContext.followCamera as unknown as { _smoothedQuat: THREE.Quaternion })._smoothedQuat.copy(
      camera.quaternion,
    )
  }

  private applyYaw(yaw: number, targets: THREE.Object3D[]): void {
    this.yawOffset = yaw
    this.focus(targets)
  }
}
