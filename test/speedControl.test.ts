import { describe, it, expect } from 'vitest'
import { adjustSpeedTowardsTarget, computeTargetSpeed } from '../src/physics/speedControl'

describe('speed control helpers', () => {
  it('computes target speeds based on curvature thresholds', () => {
    const maxSpeed = 9
    const minSpeed = 5
    const curvatureForMin = 0.2

    expect(computeTargetSpeed(0, maxSpeed, minSpeed, curvatureForMin)).toBe(maxSpeed)
    expect(computeTargetSpeed(curvatureForMin * 2, maxSpeed, minSpeed, curvatureForMin)).toBe(minSpeed)

    const midCurvature = curvatureForMin * 0.5
    const expected = (maxSpeed + minSpeed) / 2
    expect(computeTargetSpeed(midCurvature, maxSpeed, minSpeed, curvatureForMin)).toBeCloseTo(expected, 5)
  })

  it('limits acceleration and deceleration when approaching the target speed', () => {
    const dt = 0.5
    const maxAcceleration = 3
    const maxDeceleration = 4

    const accelerated = adjustSpeedTowardsTarget(6, 8, dt, maxAcceleration, maxDeceleration)
    expect(accelerated).toBeCloseTo(6 + maxAcceleration * dt, 5)

    const decelerated = adjustSpeedTowardsTarget(8, 4, dt, maxAcceleration, maxDeceleration)
    expect(decelerated).toBeCloseTo(8 - maxDeceleration * dt, 5)
  })
})
