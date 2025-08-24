import { describe, it, expect } from 'vitest'
import { smoothLimitAngle, YawState } from '../src/systems/pathSmoothing'

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
