import { describe, it, expect } from 'vitest'
import { MathUtils, Vector3 } from 'three'
import {
  PathSpline,
  smoothLimitAngle,
  YawState,
} from '../src/domain/route/pathSpline'
import { computeAheadSampleDistance } from '../src/domain/simulation/physics/lookAhead'

describe('smoothLimitAngle', () => {
  it('AngleStep ≤ maxRate*dt', () => {
    const state: YawState = { yawRate: 0 }
    let yaw = 0
    const dt = 1 / 60
    const maxRate = 120
    const maxAccel = 480
    for (let i = 0; i < 500; i++) {
      const prev = yaw
      yaw = smoothLimitAngle(prev, Math.PI, state, maxRate, maxAccel, dt)
      const delta = Math.abs(Math.atan2(Math.sin(yaw - prev), Math.cos(yaw - prev)))
      const maxStep = (maxRate * Math.PI) / 180 * dt + 1e-6
      expect(delta).toBeLessThanOrEqual(maxStep)
    }
  })
})

describe('looped yaw targets', () => {
  const angleDifference = (a: number, b: number) =>
    Math.atan2(Math.sin(a - b), Math.cos(a - b))

  const yawAtDistance = (spline: PathSpline, distance: number) => {
    const { tangent } = spline.sampleByDistance(distance)
    return Math.atan2(tangent.x, tangent.z)
  }

  it('wraps look-ahead sampling across lap boundary', () => {
    const waypoints = [
      new Vector3(0, 0, 0),
      new Vector3(30, 0, 0),
      new Vector3(30, 0, 20),
      new Vector3(0, 0, 20),
      new Vector3(0, 0, 0),
    ]
    const spline = new PathSpline(waypoints)
    const totalLength = spline.totalLength
    const lookAhead = 5
    const sBefore = totalLength - lookAhead * 0.4
    const travelPastBoundary = lookAhead * 0.6

    const beforeWrapped = computeAheadSampleDistance(
      sBefore,
      lookAhead,
      totalLength,
      'loop',
    )
    const yawBefore = yawAtDistance(spline, beforeWrapped.sampleDistance)

    const beforeClampedDistance = Math.min(sBefore + lookAhead, totalLength)
    const yawClamped = yawAtDistance(spline, beforeClampedDistance)

    const sAfter = MathUtils.euclideanModulo(
      sBefore + travelPastBoundary,
      totalLength,
    )
    const afterWrapped = computeAheadSampleDistance(
      sAfter,
      lookAhead,
      totalLength,
      'loop',
    )
    const yawAfter = yawAtDistance(spline, afterWrapped.sampleDistance)

    const wrappedDelta = Math.abs(angleDifference(yawAfter, yawBefore))
    const clampedDelta = Math.abs(angleDifference(yawAfter, yawClamped))

    expect(wrappedDelta).toBeLessThan(clampedDelta)
    expect(wrappedDelta).toBeLessThan(0.1)
  })
})
