import { describe, it, expect } from 'vitest'
import {
  adjustSpeedTowardsTarget,
  adjustTargetSpeedForSlope,
  computeLengthRatioRange,
  computeOffsetSegmentLength,
  computeOffsetArcLengthRatio,
  computeRelaxedOffsetTarget,
  computeTargetSpeedFromSegmentLength,
  computeTargetSpeedCompensation,
  estimateSafeTargetSpeed,
  SafeSpeedDiagnostics,
  projectWorldDistanceOntoCenterline,
} from '../src/domain/simulation/physics/speedControl'
import { computeSignedCurvature } from '../src/domain/simulation/physics/riderPathing'
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

    const veryShort = computeTargetSpeedFromSegmentLength(reference * 0.25, reference, options)
    const midLength = computeTargetSpeedFromSegmentLength(reference, reference, options)
    const veryLong = computeTargetSpeedFromSegmentLength(reference * 2, reference, options)

    expect(veryShort).toBeLessThanOrEqual(maxSpeed)
    expect(veryShort).toBeGreaterThan(midLength)
    expect(midLength).toBeGreaterThanOrEqual(minSpeed)
    expect(veryLong).toBeGreaterThanOrEqual(minSpeed)
    expect(veryLong).toBeGreaterThanOrEqual(midLength)
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

    const midDistance = (startDistance + endDistance) / 2
    const curvature = computeSignedCurvature(spline, midDistance, spline.totalLength)
    const insideOffset = (Math.sign(curvature) || 1) * 1.5
    const outsideOffset = -insideOffset

    const insideLength = computeOffsetSegmentLength(
      spline,
      startDistance,
      endDistance,
      insideOffset,
      20
    )
    const outsideLength = computeOffsetSegmentLength(
      spline,
      startDistance,
      endDistance,
      outsideOffset,
      20
    )

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
    const insideOffset = (Math.sign(curvature) || 1) * 2
    const outsideOffset = -insideOffset
    const insideRatio = computeOffsetArcLengthRatio(curvature, insideOffset)
    const outsideRatio = computeOffsetArcLengthRatio(curvature, outsideOffset)

    expect(insideRatio).toBeLessThan(1)
    expect(outsideRatio).toBeGreaterThan(1)
    expect(outsideRatio).toBeGreaterThan(insideRatio)
  })

  it('projects world distance onto the centerline according to the arc ratio', () => {
    const curvature = 1 / 25
    const insideOffset = (Math.sign(curvature) || 1) * 2
    const outsideOffset = -insideOffset
    const worldDistance = 10

    const insideTravel = projectWorldDistanceOntoCenterline(worldDistance, curvature, insideOffset)
    const outsideTravel = projectWorldDistanceOntoCenterline(worldDistance, curvature, outsideOffset)

    expect(insideTravel).toBeGreaterThan(worldDistance)
    expect(outsideTravel).toBeLessThan(worldDistance)
    expect(insideTravel).toBeGreaterThan(outsideTravel)
  })

  it('pursues desired offsets when ample lateral margin is available', () => {
    const relaxed = computeRelaxedOffsetTarget(0, 1.4, -2, 2, 3.5)
    expect(relaxed).toBeCloseTo(1.4, 5)
  })

  it('sticks to the current offset when the corridor collapses', () => {
    const relaxed = computeRelaxedOffsetTarget(0.25, -0.4, -0.2, 0.3, 3.5)
    expect(relaxed).toBeCloseTo(0.25, 5)
  })

  it('keeps compensation neutral around unit ratios', () => {
    expect(computeTargetSpeedCompensation(1)).toBe(1)
  })

  it('avoids penalising shorter projected segments', () => {
    const factor = computeTargetSpeedCompensation(0.82)
    expect(factor).toBeCloseTo(1, 6)
  })

  it('amplifies target speed moderately for longer segments', () => {
    const factor = computeTargetSpeedCompensation(1.35)
    expect(factor).toBeGreaterThan(1)
    expect(factor).toBeLessThanOrEqual(1.35)
    expect(factor).toBeCloseTo(1.35, 6)
  })

  it('caps outside boost when requested', () => {
    const factor = computeTargetSpeedCompensation(1.5, {
      outsideCompensation: 1,
      maxOutsideBoost: 1.25,
    })
    expect(factor).toBeCloseTo(1.25, 6)
  })

  it('offers gradual attenuation for shorter segments when desired', () => {
    const factor = computeTargetSpeedCompensation(0.7, {
      insideCompensation: 0.5,
    })
    expect(factor).toBeLessThan(1)
    expect(factor).toBeGreaterThan(0.7)
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

  it('keeps inside riders near top speed on the same corner', () => {
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

    const curvature = computeSignedCurvature(spline, (startDistance + endDistance) / 2, spline.totalLength)
    const insideOffset = (Math.sign(curvature) || 1) * 1.5
    const outsideOffset = -insideOffset
    const insideLength = computeOffsetSegmentLength(
      spline,
      startDistance,
      endDistance,
      insideOffset,
      24
    )
    const outsideLength = computeOffsetSegmentLength(
      spline,
      startDistance,
      endDistance,
      outsideOffset,
      24
    )
    const centerLength = computeOffsetSegmentLength(spline, startDistance, endDistance, 0, 24)

    const insideSpeed = computeTargetSpeedFromSegmentLength(insideLength, travelDistance, options)
    const outsideSpeed = computeTargetSpeedFromSegmentLength(outsideLength, travelDistance, options)
    const centerSpeed = computeTargetSpeedFromSegmentLength(centerLength, travelDistance, options)

    expect(insideSpeed).toBeCloseTo(options.maxSpeed, 5)
    expect(centerSpeed).toBeLessThanOrEqual(insideSpeed)
    expect(outsideSpeed).toBeGreaterThanOrEqual(options.minSpeed)
    expect(outsideSpeed).toBeLessThanOrEqual(centerSpeed)
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

  it('keeps target speed high when the desired offset exceeds reachable change', () => {
    const spline = new PathSpline([
      new Vector3(0, 0, 0),
      new Vector3(12, 0, 0),
    ])

    const diagnostics: SafeSpeedDiagnostics = {
      limitingSpeed: 0,
      limitingReason: 'none',
      limitingStep: 0,
      candidateSpeed: 0,
      offset: 0,
      minBound: 0,
      maxBound: 0,
      minLeftMargin: 0,
      minRightMargin: 0,
    }

    const speed = estimateSafeTargetSpeed({
      spline,
      totalLength: spline.totalLength,
      currentDistance: 3,
      currentOffset: 2.4,
      desiredOffset: -2.6,
      neighborMin: -3.5,
      neighborMax: 3.5,
      lookAheadDistance: 5,
      maxOffset: 3.5,
      maxOffsetRate: 2.5,
      maxTargetSpeed: 9,
      minTargetSpeed: 5,
      dt: 0.12,
      diagnostics,
    })

    expect(speed).toBeCloseTo(9, 5)
    expect(diagnostics.limitingReason).toBe('none')
    expect(diagnostics.candidateSpeed).toBeCloseTo(9, 5)
  })

  it('reports positive margins and no limiting reason when the path is fully clear', () => {
    const spline = new PathSpline([
      new Vector3(0, 0, 0),
      new Vector3(12, 0, 0),
    ])

    const diagnostics: SafeSpeedDiagnostics = {
      limitingSpeed: 0,
      limitingReason: 'none',
      limitingStep: 0,
      candidateSpeed: 0,
      offset: 0,
      minBound: 0,
      maxBound: 0,
      minLeftMargin: 0,
      minRightMargin: 0,
    }

    const speed = estimateSafeTargetSpeed({
      spline,
      totalLength: spline.totalLength,
      currentDistance: 3,
      currentOffset: 0,
      desiredOffset: 0,
      neighborMin: -0.6,
      neighborMax: 0.6,
      lookAheadDistance: 6,
      maxOffset: 1,
      maxOffsetRate: 3,
      maxTargetSpeed: 9,
      minTargetSpeed: 5,
      dt: 0.12,
      diagnostics,
    })

    expect(speed).toBe(9)
    expect(diagnostics.limitingReason).toBe('none')
    expect(diagnostics.candidateSpeed).toBeCloseTo(9, 5)
    expect(diagnostics.minLeftMargin).toBeGreaterThan(0)
    expect(diagnostics.minRightMargin).toBeGreaterThan(0)
  })

  it('tracks collapsed neighbor corridors as the limiting factor', () => {
    const spline = new PathSpline([
      new Vector3(0, 0, 0),
      new Vector3(10, 0, 0),
    ])

    const diagnostics: SafeSpeedDiagnostics = {
      limitingSpeed: 0,
      limitingReason: 'none',
      limitingStep: 0,
      candidateSpeed: 0,
      offset: 0,
      minBound: 0,
      maxBound: 0,
      minLeftMargin: 0,
      minRightMargin: 0,
    }

    const speed = estimateSafeTargetSpeed({
      spline,
      totalLength: spline.totalLength,
      currentDistance: 2,
      currentOffset: 0.15,
      desiredOffset: 0,
      neighborMin: 0.15,
      neighborMax: 0.1,
      lookAheadDistance: 5,
      maxOffset: 1,
      maxOffsetRate: 2.5,
      maxTargetSpeed: 9,
      minTargetSpeed: 5,
      dt: 0.1,
      diagnostics,
    })

    expect(speed).toBeLessThan(5)
    expect(diagnostics.limitingReason).toBe('neighbor-bounds')
    expect(diagnostics.candidateSpeed).toBeCloseTo(9, 5)
    expect(diagnostics.minLeftMargin).toBeLessThanOrEqual(0)
    expect(diagnostics.minRightMargin).toBeLessThanOrEqual(0)
  })

  it('keeps the maximum speed when a narrow but valid corridor exists', () => {
    const spline = new PathSpline([
      new Vector3(0, 0, 0),
      new Vector3(12, 0, 0),
      new Vector3(18, 0, 4),
      new Vector3(18, 0, 12),
    ])

    const speed = estimateSafeTargetSpeed({
      spline,
      totalLength: spline.totalLength,
      currentDistance: 4,
      currentOffset: 0.05,
      desiredOffset: 0.05,
      neighborMin: -0.05,
      neighborMax: 0.2,
      lookAheadDistance: 6,
      maxOffset: 3.5,
      maxOffsetRate: 2.5,
      maxTargetSpeed: 9,
      minTargetSpeed: 5,
      dt: 0.12,
    })

    expect(speed).toBeCloseTo(9, 5)
  })

  it('clamps desired offsets outside the corridor without reducing speed', () => {
    const spline = new PathSpline([
      new Vector3(0, 0, 0),
      new Vector3(12, 0, 0),
      new Vector3(18, 0, 4),
      new Vector3(18, 0, 12),
    ])

    const speed = estimateSafeTargetSpeed({
      spline,
      totalLength: spline.totalLength,
      currentDistance: 4,
      currentOffset: 0.05,
      desiredOffset: 0.4,
      neighborMin: -0.05,
      neighborMax: 0.2,
      lookAheadDistance: 6,
      maxOffset: 3.5,
      maxOffsetRate: 2.5,
      maxTargetSpeed: 9,
      minTargetSpeed: 5,
      dt: 0.12,
    })

    expect(speed).toBeCloseTo(9, 5)
  })

})
