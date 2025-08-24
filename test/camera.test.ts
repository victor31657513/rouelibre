import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import { updateCameraView } from '../src/camera'

const orbitYaw = 0
const orbitPitch = 0
const orbitRadius = 10
const cameraHeight = 1.7

describe('camera', () => {
  it('uses new coordinates immediately when index changes', () => {
    const positions = new Float32Array([
      0, 0, 0, 0,
      10, 0, 0, 0
    ])
    const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 1000)
    const pivot = new THREE.Vector3()

    updateCameraView(
      camera,
      pivot,
      positions,
      0,
      orbitYaw,
      orbitPitch,
      orbitRadius,
      cameraHeight
    )
    expect(pivot.x).toBeCloseTo(0)

    updateCameraView(
      camera,
      pivot,
      positions,
      1,
      orbitYaw,
      orbitPitch,
      orbitRadius,
      cameraHeight
    )
    expect(pivot.x).toBeCloseTo(10)
    expect(camera.position.x).toBeCloseTo(10)
    expect(camera.position.y).toBeCloseTo(cameraHeight)
    expect(camera.position.z).toBeCloseTo(orbitRadius)
  })
})
