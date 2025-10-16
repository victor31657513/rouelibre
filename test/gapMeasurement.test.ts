import { beforeAll, describe, expect, it } from 'vitest'
import { PathSpline } from '../src/domain/route/pathSpline'
import { Vector3 } from 'three'

let computeLongitudinalGaps: (typeof import('../src/domain/simulation/physics/worker'))['computeLongitudinalGaps']

beforeAll(async () => {
  const globalAny = globalThis as any
  const previousSelf = globalAny.self
  if (!previousSelf) {
    globalAny.self = { onmessage: null, postMessage: () => {} }
  }
  ;({ computeLongitudinalGaps } = await import('../src/domain/simulation/physics/worker'))
  if (!previousSelf) {
    delete globalAny.self
  } else {
    globalAny.self = previousSelf
  }
})

function buildPose(
  spline: PathSpline,
  distance: number,
  offset: number,
): { position: Vector3; tangent: Vector3 } {
  const sample = spline.sampleByDistance(distance)
  const tangent = sample.tangent.clone().normalize()
  const right = new Vector3(-tangent.z, 0, tangent.x).normalize()
  const position = sample.position.clone().addScaledVector(right, offset)
  return { position, tangent }
}

describe('gap measurement', () => {
  it('keeps a forward headway for riders sharing a tight bend', () => {
    expect(typeof computeLongitudinalGaps).toBe('function')

    const spline = new PathSpline([
      new Vector3(0, 0, 0),
      new Vector3(6, 0, 0),
      new Vector3(10, 0, 4),
      new Vector3(10, 0, 10),
    ])
    const totalLength = spline.totalLength
    const innerDistance = Math.min(totalLength * 0.45, totalLength - 0.8)
    const outerDistance = Math.min(innerDistance + 0.55, totalLength - 0.2)
    const progress = new Float32Array([innerDistance, outerDistance])
    const offsets = new Float32Array([-1.4, 1.4])
    const poses = [
      buildPose(spline, progress[0], offsets[0]),
      buildPose(spline, progress[1], offsets[1]),
    ]

    const { gapAhead } = computeLongitudinalGaps(
      0,
      progress,
      offsets,
      spline,
      totalLength,
      poses,
    )

    expect(gapAhead).toBeGreaterThan(0.25)

    const assumedSpeed = 8
    const gapThreshold = 1.1 + 0.4 * assumedSpeed
    const gapShortage = Math.max(0, gapThreshold - gapAhead)
    const repulsionRatio = gapThreshold > 0 ? gapShortage / gapThreshold : 0
    expect(repulsionRatio).toBeLessThan(0.95)
  })
})
