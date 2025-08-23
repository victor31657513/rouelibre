import * as THREE from 'three'

export function updateCameraView(
  camera: THREE.PerspectiveCamera,
  pivot: THREE.Vector3,
  positions: Float32Array,
  index: number,
  orbitYaw: number,
  orbitPitch: number,
  orbitRadius: number,
  cameraHeight: number
): void {
  const base = index * 3
  pivot.set(
    positions[base],
    positions[base + 1],
    positions[base + 2]
  )
  const cosPitch = Math.cos(orbitPitch)
  camera.position.set(
    pivot.x + orbitRadius * cosPitch * Math.sin(orbitYaw),
    pivot.y + cameraHeight + orbitRadius * Math.sin(orbitPitch),
    pivot.z + orbitRadius * cosPitch * Math.cos(orbitYaw)
  )
  camera.lookAt(pivot.x, pivot.y + cameraHeight, pivot.z)
}
