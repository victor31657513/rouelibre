import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import { PathSpline } from '../src/systems/pathSmoothing'

describe('curvature estimation', () => {
  it('Curvature ≤ 1/MinRadius', () => {
    const pts = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(20, 0, 0),
      new THREE.Vector3(40, 0, 10),
      new THREE.Vector3(60, 0, 0),
      new THREE.Vector3(80, 0, 0)
    ]
    const spline = new PathSpline(pts)
    const minRadius = 12
    const samples = 20
    for (let i = 0; i <= samples; i++) {
      const t = i / samples
      const curvature = spline.estimateCurvature(t)
      expect(curvature).toBeLessThanOrEqual(1 / minRadius + 1e-6)
    }
  })
})
