import { describe, it, expect } from 'vitest'
import { initPeloton } from '../src/peloton'

describe('peloton distribution', () => {
  it('avoids perfect alignment and stays on road', () => {
    const path = [
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 }
    ]
    const N = 30
    const roadWidth = 8
    const positions = initPeloton(path, N, { seed: 1, roadWidth })
    const offsets: number[] = []
    for (let i = 0; i < N; i++) {
      const x = positions[i * 3 + 0]
      const z = positions[i * 3 + 2]
      offsets.push(z)
      expect(Math.abs(z)).toBeLessThanOrEqual(roadWidth / 2)
      for (let j = i + 1; j < N; j++) {
        const dx = positions[j * 3 + 0] - x
        const dz = positions[j * 3 + 2] - z
        const dist = Math.hypot(dx, dz)
        expect(dist).toBeGreaterThan(0.2)
      }
    }
    const unique = new Set(offsets.map((o) => o.toFixed(2)))
    expect(unique.size).toBeGreaterThan(9)
  })
})
