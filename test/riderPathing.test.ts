import { describe, expect, it } from 'vitest'
import { Vector3 } from 'three'
import { PathSpline } from '../src/domain/route/pathSpline'
import {
  computeArcLengthScale,
  computeDesiredOffsetProfile,
  computeNeighborBounds,
  steerOffsetTowardTarget,
} from '../src/domain/simulation/physics/riderPathing'

function createCurvedSpline(): PathSpline {
  const radius = 40
  const points: Vector3[] = []
  for (let i = 0; i <= 24; i++) {
    const angle = (Math.PI * i) / 24
    const x = radius * Math.cos(angle)
    const z = radius * Math.sin(angle)
    points.push(new Vector3(x, 0, z))
  }
  return new PathSpline(points)
}

describe('rider pathing helpers', () => {
  it('steers isolated riders toward the inside line through a bend', () => {
    const spline = createCurvedSpline()
    const totalLength = spline.totalLength
    const lookAhead = 12
    const maxOffset = 2.5
    const laneWidth = 1
    const dt = 0.1
    const speed = 10
    const neighborArcDistance = 5
    const lateralGap = 0.8

    let progress = 5
    let offset = 0
    let minOffset = Number.POSITIVE_INFINITY
    const outsideProgress = { value: progress }

    for (let step = 0; step < 180; step++) {
      const progressArray = new Float32Array([progress])
      const offsetArray = new Float32Array([offset])
      const neighborBounds = computeNeighborBounds(progressArray, offsetArray, {
        laneWidth,
        maxOffset,
        totalLength,
        neighborArcDistance,
        lateralGap,
      })

      const desired = computeDesiredOffsetProfile(spline, progress, {
        lookAhead,
        maxOffset,
        totalLength,
        minRadius: 20,
      })

      offset = steerOffsetTowardTarget(
        offset,
        desired,
        neighborBounds.min[0],
        neighborBounds.max[0],
        dt,
        2.5
      )

      const travel = speed * dt
      const scale = computeArcLengthScale(spline, progress, totalLength, offset)
      progress += travel / scale
      outsideProgress.value += travel / computeArcLengthScale(
        spline,
        outsideProgress.value,
        totalLength,
        maxOffset
      )

      minOffset = Math.min(minOffset, offset)
    }

    expect(minOffset).toBeLessThan(-0.6 * maxOffset)
    expect(progress).toBeGreaterThan(outsideProgress.value)
  })
})

