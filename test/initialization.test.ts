import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import { initPeloton } from '../src/peloton'
import { selectedIndex, setSelectedIndex } from '../src/selection'

const N = 184
const cameraHeight = 1.7

describe('initialization', () => {
  it('centers camera on the median rider', () => {
    const path = [
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 }
    ]
    const positions = initPeloton(path, N)

    const median = Math.floor(N / 2)
    setSelectedIndex(median, N)

    const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 1000)
    const cameraPrev = new THREE.Vector3()

    const base = median * 3
    const x = positions[base]
    const y = positions[base + 1]
    const z = positions[base + 2]

    camera.position.set(x, y + cameraHeight, z)
    camera.lookAt(x, y + cameraHeight, z)
    cameraPrev.copy(camera.position)

    expect(selectedIndex).toBe(median)
    expect(camera.position.x).toBeCloseTo(x)
    expect(camera.position.y).toBeCloseTo(y + cameraHeight)
    expect(camera.position.z).toBeCloseTo(z)
    expect(cameraPrev.equals(camera.position)).toBe(true)
  })

  it('places all riders on or ahead of the start line', () => {
    const path = [
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 }
    ]
    const positions = initPeloton(path, N)
    let previousX = Infinity
    for (let i = 0; i < N; i++) {
      const x = positions[i * 3 + 0]
      expect(x).toBeGreaterThanOrEqual(path[0].x)
      expect(x).toBeLessThanOrEqual(previousX + 1e-5)
      previousX = x
    }
  })
})

