import { describe, it, expect } from 'vitest'
import { Vector3 } from 'three'
import { buildShortestPathLine } from '../src/domain/route/roadGeometry'

type Path = Vector3[]

const UP = new Vector3(0, 1, 0)

function computeLateralOffsets(path: Path, width: number, margin: number): number[] {
  const line = buildShortestPathLine(path, width, margin)
  const attr = line.geometry.getAttribute('position')
  if (!attr) return new Array(path.length).fill(0)

  const offsets: number[] = []

  for (let i = 0; i < path.length; i++) {
    const center = path[i]
    const px = attr.getX(i)
    const py = attr.getY(i) - 0.05
    const pz = attr.getZ(i)
    const sample = new Vector3(px, py, pz)

    const prev = path[i - 1] ?? center
    const next = path[i + 1] ?? center
    const dir = next.clone().sub(prev).setY(0)

    if (dir.lengthSq() <= 1e-12) {
      const fallback = path[i + 1] ?? path[i - 1]
      if (fallback) {
        dir.copy(fallback.clone().sub(center).setY(0))
      }
    }

    if (dir.lengthSq() <= 1e-12) {
      offsets.push(0)
      continue
    }

    dir.normalize()
    const right = new Vector3().crossVectors(dir, UP).normalize()
    const diff = sample.clone().sub(center)
    diff.y = 0
    const lateral = diff.dot(right)
    offsets.push(lateral)
  }

  return offsets
}

describe('buildShortestPathLine', () => {
  const width = 8
  const margin = 0.05
  const maxOffset = width * 0.5 - margin

  it('shifts towards the inside of a left-hand corner', () => {
    const path: Path = [
      new Vector3(0, 0, 0),
      new Vector3(10, 0, 0),
      new Vector3(15, 0, 5),
      new Vector3(15, 0, 15),
    ]

    const offsets = computeLateralOffsets(path, width, margin)

    expect(offsets[1]).toBeGreaterThan(offsets[0])
    expect(offsets[2]).toBeGreaterThan(offsets[1])
    expect(offsets[2]).toBeGreaterThan(maxOffset * 0.2)
    offsets.forEach((value) => {
      expect(Math.abs(value)).toBeLessThanOrEqual(maxOffset + 1e-6)
    })
  })

  it('switches sides across an S bend without exiting the road bounds', () => {
    const path: Path = [
      new Vector3(0, 0, 0),
      new Vector3(12, 0, 0),
      new Vector3(24, 0, 9),
      new Vector3(36, 0, 12),
      new Vector3(48, 0, 0),
      new Vector3(60, 0, -12),
      new Vector3(72, 0, -9),
      new Vector3(84, 0, 0),
    ]

    const offsets = computeLateralOffsets(path, width, margin)

    const positiveThreshold = maxOffset * 0.05
    const negativeThreshold = maxOffset * 0.02
    expect(Math.max(...offsets)).toBeGreaterThan(positiveThreshold)
    expect(Math.min(...offsets)).toBeLessThan(-negativeThreshold)
    offsets.forEach((value) => {
      expect(Math.abs(value)).toBeLessThanOrEqual(maxOffset + 1e-6)
    })
  })
})
