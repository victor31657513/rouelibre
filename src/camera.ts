/**
 * Legacy utility for tests that simulates a simple chase camera behaviour.
 *
 * Extension: kept separate from the in-app {@link CameraRig} so unit tests can
 * validate core maths without instantiating the full scene.
 */
import * as THREE from 'three'

/**
 * Updates the main chase camera to follow the median rider.
 * The camera is positioned behind the rider along the road tangent
 * and smoothly approaches its target using a spring–damper filter.
 * Optional collision detection prevents the camera from clipping
 * through obstacles.
 */
export function updateCameraView(
  camera: THREE.PerspectiveCamera,
  cameraVelocity: THREE.Vector3,
  pivot: THREE.Vector3,
  positions: Float32Array,
  followDistance: number,
  cameraHeight: number,
  damping: number,
  lookAhead: number,
  dt: number,
  obstacles: THREE.Object3D[] = []
): void {
  const count = positions.length / 7
  const index = Math.floor(count / 2)
  const base = index * 7
  const x = positions[base]
  const y = positions[base + 1]
  const z = positions[base + 2]
  const orientation = new THREE.Quaternion(
    positions[base + 3],
    positions[base + 4],
    positions[base + 5],
    positions[base + 6],
  )

  pivot.set(x, y, z)

  const tangent = new THREE.Vector3(0, 0, 1).applyQuaternion(orientation)
  const targetPos = new THREE.Vector3(x, y, z)
  const desiredPos = targetPos
    .clone()
    .addScaledVector(tangent, -followDistance)
    .add(new THREE.Vector3(0, cameraHeight, 0))

  // spring-damper smoothing (critically damped)
  const xVec = camera.position.clone().sub(desiredPos)
  const exp = Math.exp(-damping * dt)
  const temp = cameraVelocity.clone().addScaledVector(xVec, damping).multiplyScalar(dt)
  const newPos = desiredPos
    .clone()
    .add(xVec.add(temp).multiplyScalar(exp))
  const newVel = cameraVelocity
    .addScaledVector(xVec, damping)
    .addScaledVector(temp, -damping)
    .multiplyScalar(exp)

  // collision detection: raycast towards camera
  if (obstacles.length > 0) {
    const rayDir = newPos.clone().sub(targetPos)
    const dist = rayDir.length()
    if (dist > 1e-4) {
      rayDir.normalize()
      const raycaster = new THREE.Raycaster(targetPos, rayDir, 0, dist)
      const hits = raycaster.intersectObjects(obstacles, true)
      if (hits.length > 0) {
        newPos.copy(hits[0].point).addScaledVector(rayDir, -0.3)
        newVel.set(0, 0, 0)
      }
    }
  }

  camera.position.copy(newPos)
  cameraVelocity.copy(newVel)

  const lookAtTarget = targetPos
    .clone()
    .addScaledVector(tangent, lookAhead)
    .add(new THREE.Vector3(0, cameraHeight, 0))
  camera.lookAt(lookAtTarget)
}
