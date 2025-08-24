import * as THREE from 'three'

export function updateCameraView(
  camera: THREE.PerspectiveCamera,
  cameraPrev: THREE.Vector3,
  pivot: THREE.Vector3,
  positions: Float32Array,
  index: number,
  followDistance: number,
  cameraHeight: number,
  damping: number
): void {
  const base = index * 4
  const x = positions[base]
  const y = positions[base + 1]
  const z = positions[base + 2]
  const yaw = positions[base + 3]

  pivot.set(x, y, z)

  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw))
  const targetPos = new THREE.Vector3(
    x - forward.x * followDistance,
    y + cameraHeight,
    z - forward.z * followDistance
  )

  cameraPrev.lerp(targetPos, damping)
  camera.position.copy(cameraPrev)

  const lookAtTarget = new THREE.Vector3(
    x + forward.x * followDistance,
    y + cameraHeight,
    z + forward.z * followDistance
  )
  camera.lookAt(lookAtTarget)
}
