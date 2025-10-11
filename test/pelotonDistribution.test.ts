import { describe, it, expect } from 'vitest'
import { initPeloton } from '../src/peloton'

describe('peloton distribution', () => {
  it('keeps riders within the road and preserves longitudinal spacing', () => {
    const path = [
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 }
    ]
    const N = 30
    const roadWidth = 8
    const laneWidth = 1
    const spacing = 1.2
    const positions = initPeloton(path, N, { roadWidth, laneWidth, spacing })

    const nCols = Math.max(1, Math.floor(roadWidth / laneWidth))
    const maxOffset = roadWidth / 2 - 0.05
    const offsets: number[] = []

    for (let i = 0; i < N; i++) {
      const x = positions[i * 3 + 0]
      const z = positions[i * 3 + 2]
      offsets.push(z)
      expect(Math.abs(z)).toBeLessThanOrEqual(maxOffset + 1e-5)

      const row = Math.floor(i / nCols)
      const col = i % nCols
      if (row > 0) {
        const prevIndex = (row - 1) * nCols + col
        const prevX = positions[prevIndex * 3 + 0]
        expect(x - prevX).toBeCloseTo(spacing, 1e-3)
      }
    }

    const uniqueOffsets = new Set(offsets.map((o) => o.toFixed(2)))
    expect(uniqueOffsets.size).toBe(nCols)
    const maxVal = Math.max(...offsets)
    const minVal = Math.min(...offsets)
    expect(maxVal).toBeCloseTo(-minVal, 1e-3)
  })
})
