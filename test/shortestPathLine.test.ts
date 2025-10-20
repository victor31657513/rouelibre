import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { buildShortestPathLine } from '../src/domain/route/roadGeometry'

function readPositions(line: THREE.Line): THREE.Vector3[] {
  const attr = line.geometry.getAttribute('position') as THREE.BufferAttribute
  const result: THREE.Vector3[] = []
  for (let i = 0; i < attr.count; i++) {
    const x = attr.getX(i)
    const y = attr.getY(i) - 0.05
    const z = attr.getZ(i)
    result.push(new THREE.Vector3(x, y, z))
  }
  return result
}

function pathLength(points: THREE.Vector3[]): number {
  let length = 0
  for (let i = 1; i < points.length; i++) {
    length += points[i].distanceTo(points[i - 1])
  }
  return length
}

describe('buildShortestPathLine', () => {
  it('falls back to the centre line when the corridor has no width', () => {
    const center = [
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 2, 5),
      new THREE.Vector3(0, 3, 10),
    ]

    const line = buildShortestPathLine(center, 0, 0)
    const positions = readPositions(line)

    expect(positions).toHaveLength(center.length)
    positions.forEach((point, index) => {
      expect(point.x).toBeCloseTo(center[index].x)
      expect(point.y).toBeCloseTo(center[index].y)
      expect(point.z).toBeCloseTo(center[index].z)
    })
  })

  it('cuts the inside of a 90° turn while staying within the corridor', () => {
    const center = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(10, 0, 10),
    ]

    const line = buildShortestPathLine(center, 10, 0)
    const positions = readPositions(line)

    expect(positions[0].x).toBeCloseTo(center[0].x)
    expect(positions[0].z).toBeCloseTo(center[0].z)
    expect(positions[positions.length - 1].x).toBeCloseTo(center[center.length - 1].x)
    expect(positions[positions.length - 1].z).toBeCloseTo(center[center.length - 1].z)

    const straightLength = pathLength(center)
    const shortestLength = pathLength(positions)

    expect(shortestLength).toBeLessThan(straightLength - 1)

    const hasCornerPoint = positions.some((point) => point.x > 0 && point.z > 0 && point.x < 10 && point.z < 10)
    expect(hasCornerPoint).toBe(true)
  })
})

