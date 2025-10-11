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

    let previousX = Infinity
    for (let i = 0; i < N; i++) {
      const x = positions[i * 3 + 0]
      const z = positions[i * 3 + 2]
      expect(x).toBeLessThanOrEqual(previousX + 1e-5)
      previousX = x
      offsets.push(z)
      expect(Math.abs(z)).toBeLessThanOrEqual(maxOffset + 1e-5)

      const leaderIndex = N - 1 - i
      const row = Math.floor(leaderIndex / nCols)
      const col = leaderIndex % nCols
      const aheadLeaderIndex = (row + 1) * nCols + col
      if (aheadLeaderIndex < N) {
        const frontIndex = N - 1 - aheadLeaderIndex
        const frontX = positions[frontIndex * 3 + 0]
        expect(frontX - x).toBeCloseTo(spacing, 1e-3)
      }
    }

    const uniqueOffsets = new Set(offsets.map((o) => o.toFixed(2)))
    expect(uniqueOffsets.size).toBe(nCols)
    const maxVal = Math.max(...offsets)
    const minVal = Math.min(...offsets)
    expect(maxVal).toBeCloseTo(-minVal, 1e-3)
  })
})
