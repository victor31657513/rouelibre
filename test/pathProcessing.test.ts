import { describe, it, expect } from 'vitest'
import { Vector3 } from 'three'
import { ensureProgressivePath, smoothPathSurface } from '../src/domain/route/pathProcessing'

describe('ensureProgressivePath', () => {
  it('removes near-duplicate points while preserving endpoints', () => {
    const path = [
      new Vector3(0, 0, 0),
      new Vector3(0.1, 0, 0),
      new Vector3(0.2, 0, 0),
      new Vector3(0.3, 0, 0),
      new Vector3(1.0, 0, 0),
      new Vector3(2.0, 0, 0),
    ]

    const filtered = ensureProgressivePath(path)

    expect(filtered.length).toBe(3)
    expect(filtered[0].distanceTo(path[0])).toBeLessThan(1e-6)
    expect(filtered[filtered.length - 1].distanceTo(path[path.length - 1])).toBeLessThan(1e-6)
  })

  it('drops short backtracking artefacts', () => {
    const path = [
      new Vector3(0, 0, 0),
      new Vector3(10, 0, 0),
      new Vector3(9.3, 0, 0.8),
      new Vector3(11, 0, 0.1),
      new Vector3(20, 0, 0),
    ]

    const filtered = ensureProgressivePath(path)

    expect(filtered.length).toBe(4)
    const coords = filtered.map((p) => [Number(p.x.toFixed(2)), Number(p.z.toFixed(2))])
    expect(coords).toEqual([
      [0, 0],
      [10, 0],
      [11, 0.1],
      [20, 0],
    ])
    const hasBacktrack = filtered.some((_, index, arr) => {
      if (index <= 0 || index >= arr.length - 1) return false
      const prev = arr[index - 1]
      const curr = arr[index]
      const next = arr[index + 1]
      const v1 = curr.clone().sub(prev)
      const v2 = next.clone().sub(curr)
      if (v1.length() < 1e-6 || v2.length() < 1e-6) return false
      const cosine = v1.normalize().dot(v2.normalize())
      return cosine < -0.5
    })
    expect(hasBacktrack).toBe(false)
  })
})

describe('smoothPathSurface', () => {
  it('reduces small zig-zag artefacts while keeping endpoints', () => {
    const path = [
      new Vector3(0, 0, 0),
      new Vector3(1, 0, 0.5),
      new Vector3(2, 0, -0.4),
      new Vector3(3, 0, 0.45),
      new Vector3(4, 0, 0),
    ]

    const smoothed = smoothPathSurface(path, { windowSize: 2, blend: 0.5, iterations: 2 })

    expect(smoothed[0].equals(path[0])).toBe(true)
    expect(smoothed[smoothed.length - 1].equals(path[path.length - 1])).toBe(true)
    const originalDeviation = path.slice(1, -1).reduce((sum, p) => sum + Math.abs(p.z), 0)
    const smoothedDeviation = smoothed.slice(1, -1).reduce((sum, p) => sum + Math.abs(p.z), 0)
    expect(smoothedDeviation).toBeLessThan(originalDeviation)
  })

  it('preserves general direction while smoothing elevations', () => {
    const path = [
      new Vector3(0, 0, 0),
      new Vector3(1, 0.2, 0.1),
      new Vector3(2, -0.1, -0.15),
      new Vector3(3, 0.25, 0.05),
      new Vector3(4, 0, 0),
    ]

    const smoothed = smoothPathSurface(path, { windowSize: 2, blend: 0.6, iterations: 1 })

    expect(smoothed[0].equals(path[0])).toBe(true)
    expect(smoothed[smoothed.length - 1].equals(path[path.length - 1])).toBe(true)
    const originalYVariance = path.slice(1, -1).reduce((sum, p) => sum + Math.abs(p.y), 0)
    const smoothedYVariance = smoothed.slice(1, -1).reduce((sum, p) => sum + Math.abs(p.y), 0)
    expect(smoothedYVariance).toBeLessThan(originalYVariance)
  })
})

