import { describe, it, expect } from 'vitest'
import {
  adjustSpeedTowardsTarget,
  adjustTargetSpeedForSlope,
  computeLengthRatioRange,
  computeOffsetSegmentLength,
  computeOffsetArcLengthRatio,
  computeTargetSpeedFromSegmentLength,
  estimateSafeTargetSpeed,
} from '../src/domain/simulation/physics/speedControl'
import { PathSpline } from '../src/domain/route/pathSpline'
import { Vector3 } from 'three'

describe('speed control helpers', () => {
  it('maps rider segment length ratios to bounded target speeds', () => {
    const maxSpeed = 9
    const minSpeed = 5
    const reference = 10
    const options = {
      maxSpeed,
      minSpeed,
      minLengthRatioForMaxSpeed: 0.5,
      maxLengthRatioForMinSpeed: 1.5,
    }

    expect(computeTargetSpeedFromSegmentLength(reference * 0.25, reference, options)).toBe(maxSpeed)
    expect(computeTargetSpeedFromSegmentLength(reference * 2, reference, options)).toBe(minSpeed)

    const midLength = reference
    const expected = (maxSpeed + minSpeed) / 2
    expect(computeTargetSpeedFromSegmentLength(midLength, reference, options)).toBeCloseTo(expected, 5)
  })

  it('computes longer trajectories for outside offsets around curves', () => {
    const spline = new PathSpline([
      new Vector3(0, 0, 0),
      new Vector3(8, 0, 0),
      new Vector3(12, 0, 4),
      new Vector3(12, 0, 12),
    ])
    const startDistance = 3
    const endDistance = Math.min(startDistance + 6, spline.totalLength)

    const insideLength = computeOffsetSegmentLength(spline, startDistance, endDistance, -1.5, 20)
    const outsideLength = computeOffsetSegmentLength(spline, startDistance, endDistance, 1.5, 20)

    expect(outsideLength).toBeGreaterThan(insideLength)
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

  it('computes arc length ratios reflecting inside and outside lines', () => {
    const curvature = 1 / 25
    const insideOffset = -2
    const outsideOffset = 2

    const insideRatio = computeOffsetArcLengthRatio(curvature, insideOffset)
    const outsideRatio = computeOffsetArcLengthRatio(curvature, outsideOffset)

    expect(insideRatio).toBeLessThan(1)
    expect(outsideRatio).toBeGreaterThan(1)
    expect(outsideRatio).toBeGreaterThan(insideRatio)
  })

  it('adjusts target speed according to positive and negative slopes', () => {
    const baseSpeed = 8
    const options = {
      maxSlope: 0.25,
      maxUphillPenalty: 2,
      maxDownhillBoost: 1,
      minSpeed: 4,
      maxSpeed: 10,
    }

    const uphillSpeed = adjustTargetSpeedForSlope(baseSpeed, 0.2, options)
    const downhillSpeed = adjustTargetSpeedForSlope(baseSpeed, -0.2, options)

    expect(uphillSpeed).toBeLessThan(baseSpeed)
    expect(downhillSpeed).toBeGreaterThan(baseSpeed)
    expect(uphillSpeed).toBeGreaterThanOrEqual(options.minSpeed)
    expect(downhillSpeed).toBeLessThanOrEqual(options.maxSpeed)
  })

  it('lets inside riders keep higher speeds than outside riders on the same corner', () => {
    const spline = new PathSpline([
      new Vector3(0, 0, 0),
      new Vector3(8, 0, 0),
      new Vector3(12, 0, 4),
      new Vector3(12, 0, 12),
    ])
    const lookAhead = 6
    const startDistance = 3
    const endDistance = Math.min(startDistance + lookAhead, spline.totalLength)
    const travelDistance = endDistance - startDistance
    const { min: minRatio, max: maxRatio } = computeLengthRatioRange(1.5, 12)

    const options = {
      maxSpeed: 9,
      minSpeed: 5,
      minLengthRatioForMaxSpeed: minRatio,
      maxLengthRatioForMinSpeed: maxRatio,
    }

    const insideLength = computeOffsetSegmentLength(spline, startDistance, endDistance, -1.5, 24)
    const outsideLength = computeOffsetSegmentLength(spline, startDistance, endDistance, 1.5, 24)
    const centerLength = computeOffsetSegmentLength(spline, startDistance, endDistance, 0, 24)

    const insideSpeed = computeTargetSpeedFromSegmentLength(insideLength, travelDistance, options)
    const outsideSpeed = computeTargetSpeedFromSegmentLength(outsideLength, travelDistance, options)
    const centerSpeed = computeTargetSpeedFromSegmentLength(centerLength, travelDistance, options)

    expect(insideSpeed).toBeGreaterThan(centerSpeed)
    expect(centerSpeed).toBeGreaterThan(outsideSpeed)
    expect(insideSpeed).toBeLessThanOrEqual(options.maxSpeed)
    expect(outsideSpeed).toBeGreaterThanOrEqual(options.minSpeed)
  })

  it('keeps the maximum target speed when the projected path stays within bounds', () => {
    const spline = new PathSpline([
      new Vector3(0, 0, 0),
      new Vector3(10, 0, 0),
    ])

    const targetSpeed = estimateSafeTargetSpeed({
      spline,
      totalLength: spline.totalLength,
      currentDistance: 2,
      currentOffset: 0,
      desiredOffset: 0,
      neighborMin: -0.5,
      neighborMax: 0.5,
      lookAheadDistance: 5,
      maxOffset: 1,
      maxOffsetRate: 2.5,
      maxTargetSpeed: 9,
      minTargetSpeed: 5,
      dt: 0.1,
    })

    expect(targetSpeed).toBe(9)
  })

  it('reduces the target speed when no safe lateral corridor is available', () => {
    const spline = new PathSpline([
      new Vector3(0, 0, 0),
      new Vector3(10, 0, 0),
    ])

    const targetSpeed = estimateSafeTargetSpeed({
      spline,
      totalLength: spline.totalLength,
      currentDistance: 2,
      currentOffset: 0.2,
      desiredOffset: 0,
      neighborMin: 0.2,
      neighborMax: 0.1,
      lookAheadDistance: 5,
      maxOffset: 1,
      maxOffsetRate: 2.5,
      maxTargetSpeed: 9,
      minTargetSpeed: 5,
      dt: 0.1,
    })

    expect(targetSpeed).toBeLessThan(5)
    expect(targetSpeed).toBeGreaterThanOrEqual(0)
  })

  it('keeps outside riders at top speed on wide corners when space allows it', () => {
    const spline = new PathSpline([
      new Vector3(0, 0, 0),
      new Vector3(10, 0, 0),
      new Vector3(16, 0, 4),
      new Vector3(16, 0, 12),
    ])

    const targetSpeed = estimateSafeTargetSpeed({
      spline,
      totalLength: spline.totalLength,
      currentDistance: 4,
      currentOffset: 2.5,
      desiredOffset: 2.5,
      neighborMin: -3,
      neighborMax: 3,
      lookAheadDistance: 8,
      maxOffset: 3.5,
      maxOffsetRate: 2.5,
      maxTargetSpeed: 9,
      minTargetSpeed: 5,
      dt: 0.12,
    })

    expect(targetSpeed).toBeCloseTo(9, 5)
  })

})
