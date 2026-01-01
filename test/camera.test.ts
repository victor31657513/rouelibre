import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import { updateCameraView } from '../src/camera'

const followDistance = 10
const cameraHeight = 1.7
const damping = 8
const lookAhead = 15
  const dt = 1

  describe('camera', () => {
    it('chases the median rider aligned with the road', () => {
      const positions = new Float32Array([
        0, 0, 0, 0, 0, 0, 1,
        10, 0, 0, 0, 0, 0, 1,
      ])
    const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 1000)
    const pivot = new THREE.Vector3()
    const cameraVel = new THREE.Vector3()

    updateCameraView(
      camera,
      cameraVel,
      pivot,
      positions,
      followDistance,
      cameraHeight,
      damping,
      lookAhead,
      dt
    )
    expect(pivot.x).toBeCloseTo(10)
    expect(pivot.z).toBeCloseTo(0)
    expect(camera.position.x).toBeCloseTo(10, 1)
    expect(camera.position.y).toBeCloseTo(cameraHeight, 1)
    expect(camera.position.z).toBeCloseTo(-followDistance, 1)
    const dir = new THREE.Vector3()
    camera.getWorldDirection(dir)
    expect(dir.x).toBeCloseTo(0, 2)
    expect(dir.z).toBeCloseTo(1, 2)
  })
})
