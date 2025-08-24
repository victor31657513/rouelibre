import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import { updateCameraView } from '../src/camera'

const followDistance = 10
const cameraHeight = 1.7
const damping = 1

describe('camera', () => {
  it('positions camera behind selected rider looking forward', () => {
    const positions = new Float32Array([
      0, 0, 0, 0,
      10, 0, 0, 0
    ])
    const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 1000)
    const pivot = new THREE.Vector3()
    const cameraPrev = new THREE.Vector3()

    updateCameraView(
      camera,
      cameraPrev,
      pivot,
      positions,
      0,
      followDistance,
      cameraHeight,
      damping
    )
    expect(pivot.x).toBeCloseTo(0)

    updateCameraView(
      camera,
      cameraPrev,
      pivot,
      positions,
      1,
      followDistance,
      cameraHeight,
      damping
    )
    expect(pivot.x).toBeCloseTo(10)
    expect(camera.position.x).toBeCloseTo(10)
    expect(camera.position.y).toBeCloseTo(cameraHeight)
    expect(camera.position.z).toBeCloseTo(-followDistance)
    const dir = new THREE.Vector3()
    camera.getWorldDirection(dir)
    expect(dir.x).toBeCloseTo(0)
    expect(dir.z).toBeCloseTo(1)
  })
})
