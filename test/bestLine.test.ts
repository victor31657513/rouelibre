import { describe, expect, it } from 'vitest'
import { Vector3 } from 'three'
import { PathSpline } from '../src/domain/route/pathSpline'
import { computeShortestPath } from '../src/domain/route/shortestPath'
import {
  precomputeBestLineLookup,
  sampleBestLineProfile,
} from '../src/domain/simulation/physics/bestLine'

describe('best line helpers', () => {
  it('suggests an outside-inside-outside trajectory for a right-hand bend', () => {
    const center = [
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 6),
      new Vector3(0, 0, 12),
      new Vector3(6, 0, 12),
      new Vector3(12, 0, 12),
    ]
    const spline = new PathSpline(center)
    const shortest = computeShortestPath(center, 8, 0.1)
    const lookup = precomputeBestLineLookup(spline, shortest, spline.totalLength, 3, 0.5)
    expect(lookup).not.toBeNull()

    const profile = sampleBestLineProfile(lookup, 2, 14, spline.totalLength, 0.5, 3, 'clamp')
    expect(profile).not.toBeNull()
    const result = profile!

    expect(result.intensity).toBeGreaterThan(0)
    expect(Math.abs(result.apex)).toBeGreaterThan(Math.abs(result.entry))
    expect(Math.abs(result.apex)).toBeGreaterThan(Math.abs(result.exit))
    expect(Math.abs(result.entry)).toBeGreaterThan(0)
    expect(Math.abs(result.exit)).toBeGreaterThan(0)
  })

  it('returns a constant target when the best line stays parallel to the centre', () => {
    const center = [
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 5),
      new Vector3(0, 0, 10),
    ]
    const spline = new PathSpline(center)
    const parallel = center.map((point) => point.clone().add(new Vector3(1.5, 0, 0)))
    const lookup = precomputeBestLineLookup(spline, parallel, spline.totalLength, 3, 0.5)
    expect(lookup).not.toBeNull()

    const profile = sampleBestLineProfile(lookup, 1, 6, spline.totalLength, 0.5, 3, 'clamp')
    expect(profile).not.toBeNull()
    const result = profile!

    expect(result.intensity).toBeCloseTo(0)
    expect(result.entry).toBeCloseTo(result.target)
    expect(Math.abs(result.target)).toBeCloseTo(1.5)
  })
})
