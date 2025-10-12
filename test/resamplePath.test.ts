import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import { resamplePath } from '../src/systems/pathSmoothing'

describe('resamplePath', () => {
  it('adds intermediate points', () => {
    const pts = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(5, 0, 0),
      new THREE.Vector3(10, 0, 5)
    ]
    const res = resamplePath(pts, 1)
    expect(res.length).toBeGreaterThan(pts.length)
    expect(res[0].distanceTo(pts[0])).toBeLessThan(1e-6)
    expect(res[res.length - 1].distanceTo(pts[pts.length - 1])).toBeLessThan(1e-6)
  })
})
