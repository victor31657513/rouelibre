import { beforeEach, describe, it, expect } from 'vitest'
import {
  adjustSpeedTowardsTarget,
  adjustTargetSpeedForSlope,
  computeLengthRatioRange,
  computeOffsetSegmentLength,
  computeOffsetSegmentLengths,
  computeOffsetArcLengthRatio,
  computeRelaxedOffsetTarget,
  computeTargetSpeedFromSegmentLength,
  computeTargetSpeedCompensation,
  computeCorneringSpeedFromEnvelope,
  computeHairpinSeverityFromEnvelope,
  computeLocalCorneringSpeed,
  resetCurvatureSmoothing,
  estimateSafeTargetSpeed,
  SafeSpeedDiagnostics,
  projectWorldDistanceOntoCenterline,
} from '../src/domain/simulation/physics/speedControl'
import {
  computeCurvatureEnvelope,
  computeSignedCurvature,
  type CurvatureEnvelope,
} from '../src/domain/simulation/physics/riderPathing'
import { PathSpline } from '../src/domain/route/pathSpline'
import { MathUtils, Vector3 } from 'three'

describe('speed control helpers', () => {
  beforeEach(() => {
    resetCurvatureSmoothing()
  })

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
    const offsetMagnitude = 1.5
    const lengthPositive = computeOffsetSegmentLength(
      spline,
      startDistance,
      endDistance,
      offsetMagnitude,
      20
    )
    const lengthNegative = computeOffsetSegmentLength(
      spline,
      startDistance,
      endDistance,
      -offsetMagnitude,
      20
    )
    const insideLength = Math.min(lengthPositive, lengthNegative)
    const outsideLength = Math.max(lengthPositive, lengthNegative)

    expect(outsideLength).toBeGreaterThan(insideLength)
  })

  it('reuses the centerline length for negligible offsets', () => {
    const spline = new PathSpline([
      new Vector3(0, 0, 0),
      new Vector3(10, 0, 0),
    ])
    const startDistance = 1
    const endDistance = Math.min(startDistance + 4, spline.totalLength)
    const centerLength = computeOffsetSegmentLength(spline, startDistance, endDistance, 0, 24)
    const tinyOffsetLength = computeOffsetSegmentLength(
      spline,
      startDistance,
      endDistance,
      0.01,
      24,
    )

    expect(tinyOffsetLength).toBeCloseTo(centerLength, 6)
  })

  it('offers a batched API matching scalar segment evaluations', () => {
    const spline = new PathSpline([
      new Vector3(0, 0, 0),
      new Vector3(6, 0, 0),
      new Vector3(10, 0, 3),
      new Vector3(10, 0, 12),
    ])
    const startDistance = 2
    const endDistance = Math.min(startDistance + 7, spline.totalLength)
    const offsets = [0, -0.6, 0.6, 1.2]
    const batched = computeOffsetSegmentLengths(
      spline,
      startDistance,
      endDistance,
      offsets,
      { sampleCount: 28 },
    )

    offsets.forEach((offset, index) => {
      const scalar = computeOffsetSegmentLength(
        spline,
        startDistance,
        endDistance,
        offset,
        28,
      )
      expect(batched[index]).toBeCloseTo(scalar, 6)
    })
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
    const offsetMagnitude = 2
    const ratioPositive = computeOffsetArcLengthRatio(curvature, offsetMagnitude)
    const ratioNegative = computeOffsetArcLengthRatio(curvature, -offsetMagnitude)
    const insideRatio = Math.min(ratioPositive, ratioNegative)
    const outsideRatio = Math.max(ratioPositive, ratioNegative)

    expect(insideRatio).toBeLessThan(1)
    expect(outsideRatio).toBeGreaterThan(1)
    expect(outsideRatio).toBeGreaterThan(insideRatio)
  })

  it('projects world distance onto the centerline according to the arc ratio', () => {
    const curvature = 1 / 25
    const offsetMagnitude = 2
    const ratioPositive = computeOffsetArcLengthRatio(curvature, offsetMagnitude)
    const ratioNegative = computeOffsetArcLengthRatio(curvature, -offsetMagnitude)
    const insideOffset = ratioPositive < ratioNegative ? offsetMagnitude : -offsetMagnitude
    const outsideOffset = -insideOffset
    const worldDistance = 10

    const insideTravel = projectWorldDistanceOntoCenterline(worldDistance, curvature, insideOffset)
    const outsideTravel = projectWorldDistanceOntoCenterline(worldDistance, curvature, outsideOffset)

    expect(insideTravel).toBeGreaterThan(worldDistance)
    expect(outsideTravel).toBeLessThan(worldDistance)
    expect(insideTravel).toBeGreaterThan(outsideTravel)
  })

  it('softens the projection to avoid exaggerated speed swings', () => {
    const curvature = 1 / 12
    const insideOffset = -3
    const outsideOffset = 3
    const worldDistance = 10

    const rawInsideRatio = computeOffsetArcLengthRatio(curvature, insideOffset)
    const rawOutsideRatio = computeOffsetArcLengthRatio(curvature, outsideOffset)
    const rawInsideTravel = worldDistance / rawInsideRatio
    const rawOutsideTravel = worldDistance / rawOutsideRatio

    const insideTravel = projectWorldDistanceOntoCenterline(worldDistance, curvature, insideOffset, {
      minRatio: 0.5,
      maxRatio: 1.5,
    })
    const outsideTravel = projectWorldDistanceOntoCenterline(worldDistance, curvature, outsideOffset, {
      minRatio: 0.5,
      maxRatio: 1.5,
    })

    expect(insideTravel).toBeGreaterThan(worldDistance)
    expect(outsideTravel).toBeLessThan(worldDistance)
    expect(insideTravel).toBeGreaterThan(outsideTravel)
    expect(Math.abs(insideTravel - worldDistance)).toBeLessThan(Math.abs(rawInsideTravel - worldDistance))
    expect(Math.abs(worldDistance - outsideTravel)).toBeLessThan(Math.abs(worldDistance - rawOutsideTravel))
    expect(insideTravel - outsideTravel).toBeLessThan(rawInsideTravel - rawOutsideTravel)
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
    const offsetMagnitude = 1.5
    const lengthPositive = computeOffsetSegmentLength(
      spline,
      startDistance,
      endDistance,
      offsetMagnitude,
      24
    )
    const lengthNegative = computeOffsetSegmentLength(
      spline,
      startDistance,
      endDistance,
      -offsetMagnitude,
      24
    )
    const insideLength = Math.min(lengthPositive, lengthNegative)
    const outsideLength = Math.max(lengthPositive, lengthNegative)
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

  it('ignores road boundaries when no lateral neighbor is present', () => {
    const spline = new PathSpline([
      new Vector3(0, 0, 0),
      new Vector3(16, 0, 0),
    ])

    const speed = estimateSafeTargetSpeed({
      spline,
      totalLength: spline.totalLength,
      currentDistance: 2,
      currentOffset: 0.95,
      desiredOffset: -0.95,
      hasNeighbor: false,
      neighborMin: -1,
      neighborMax: 1,
      lookAheadDistance: 5,
      maxOffset: 1,
      maxOffsetRate: 2.5,
      maxTargetSpeed: 9,
      minTargetSpeed: 3,
      dt: 0.1,
    })

    expect(speed).toBeCloseTo(9, 5)
  })

  it('computes local cornering speed from the ridden trajectory', () => {
    const spline = new PathSpline([
      new Vector3(0, 0, 0),
      new Vector3(10, 0, 0),
      new Vector3(16, 0, 6),
      new Vector3(20, 0, 14),
      new Vector3(24, 0, 22),
    ])

    const result = computeLocalCorneringSpeed({
      spline,
      totalLength: spline.totalLength,
      distance: 6,
      offset: 0.8,
      maxOffset: 2.5,
      maxLateralAcceleration: 4.5,
      pathBoundaryMode: 'loop',
      lookAheadDistance: 8,
      openRadiusFloor: 110,
    })

    expect(result.curvature).toBeGreaterThan(0)
    const curvatureFloor = 1 / 110
    const limitingCurvature = Math.max(result.curvature, curvatureFloor)
    const safeSpeed = Math.sqrt(4.5 / limitingCurvature)
    const flooredSpeed = Math.sqrt(4.5 / curvatureFloor)
    const expected = limitingCurvature > result.curvature
      ? Math.max(safeSpeed * 0.92, safeSpeed)
      : Math.max(safeSpeed, flooredSpeed * 0.92)
    expect(result.maxSpeed).toBeCloseTo(expected, 4)
  })

  it('applies an open-radius floor on straights', () => {
    const spline = new PathSpline([
      new Vector3(0, 0, 0),
      new Vector3(30, 0, 0),
      new Vector3(60, 0, 0),
    ])

    const result = computeLocalCorneringSpeed({
      spline,
      totalLength: spline.totalLength,
      distance: 10,
      offset: 0,
      maxOffset: 3,
      maxLateralAcceleration: 4,
      pathBoundaryMode: 'clamp',
      openRadiusFloor: 150,
    })

    const curvatureFloor = 1 / 150
    const safeSpeed = Math.sqrt(4 / curvatureFloor)
    const expected = Math.max(safeSpeed * 0.92, safeSpeed)
    expect(result.curvature).toBeGreaterThanOrEqual(0)
    expect(result.maxSpeed).toBeCloseTo(expected, 4)
  })

  it('classifies sustained but wide bends as standard corners', () => {
    const envelope: CurvatureEnvelope = {
      averageAbsCurvature: 0.028,
      rootMeanSquareAbsCurvature: 0.031,
      maxAbsCurvature: 0.034,
      rawMaxAbsCurvature: 0.036,
      coverageRatio: 0.78,
      intensity: 0.82,
    }

    const { severity, classification } = computeHairpinSeverityFromEnvelope(envelope, {
      classificationOptions: {
        hairpinIntensityThreshold: 0.7,
        hairpinCoverageThreshold: 0.55,
        hairpinRadiusThreshold: 20,
      },
    })

    expect(classification.category).toBe('standard')
    expect(classification.brakingFactor).toBe(1)
    expect(severity).toBeLessThan(0.5)
  })

  it('applies stronger braking when a hairpin is detected', () => {
    const envelope: CurvatureEnvelope = {
      averageAbsCurvature: 0.072,
      rootMeanSquareAbsCurvature: 0.078,
      maxAbsCurvature: 0.09,
      rawMaxAbsCurvature: 0.095,
      coverageRatio: 0.86,
      intensity: 0.92,
    }

    const options = {
      maxLateralAcceleration: 5.2,
      sustainedBlendStart: 0.2,
      sustainedBlendEnd: 0.8,
      coverageExponent: 1.35,
      reliefFactor: 0.25,
      spikeRetention: 0.35,
      hairpinLateralAcceleration: 4.6,
      classificationOptions: {
        hairpinIntensityThreshold: 0.7,
        hairpinCoverageThreshold: 0.55,
        hairpinRadiusThreshold: 18,
      },
    }

    const severity = computeHairpinSeverityFromEnvelope(envelope, {
      classificationOptions: options.classificationOptions,
    }).severity
    const vCorner = computeCorneringSpeedFromEnvelope(envelope, options)
    const limitingCurvature = Math.max(
      envelope.maxAbsCurvature,
      envelope.rawMaxAbsCurvature as number,
    )
    const expected = Math.sqrt(options.maxLateralAcceleration / limitingCurvature)

    expect(vCorner).toBeCloseTo(expected, 4)
    expect(severity).toBeGreaterThan(0.75)
  })

  it('keeps curvature low at open route endpoints when clamping sampling', () => {
    const spline = new PathSpline([
      new Vector3(0, 0, 0),
      new Vector3(50, 0, 0),
      new Vector3(100, 0, 0),
      new Vector3(150, 0, 0),
      new Vector3(150, 0, 30),
    ])
    const totalLength = spline.totalLength
    const lookAhead = 20
    const minRadius = 80

    const loopEnvelope = computeCurvatureEnvelope(
      spline,
      0,
      totalLength,
      lookAhead,
      minRadius,
      undefined,
      'loop',
    )
    const clampedStart = computeCurvatureEnvelope(
      spline,
      0,
      totalLength,
      lookAhead,
      minRadius,
      undefined,
      'clamp',
    )
    const clampedEnd = computeCurvatureEnvelope(
      spline,
      totalLength,
      totalLength,
      lookAhead,
      minRadius,
      undefined,
      'clamp',
    )

    expect(clampedStart.maxAbsCurvature).toBeLessThan(1e-4)
    expect(clampedEnd.maxAbsCurvature).toBeLessThan(1e-4)
    expect(loopEnvelope.maxAbsCurvature).toBeGreaterThan(0.01)
  })

  it('follows adaptive cornering floors when they drop below the personal minimum', async () => {
    const previousSelf = (globalThis as { self?: unknown }).self
    const stubSelf = {
      postMessage: () => undefined,
      onmessage: null,
    }
    const restoreSelf = () => {
      if (previousSelf === undefined) {
        delete (globalThis as { self?: unknown }).self
      } else {
        ;(globalThis as { self: unknown }).self = previousSelf
      }
    }
    ;(globalThis as { self: unknown }).self = stubSelf

    try {
      const { computeAdaptiveMinSpeed } = await import(
        '../src/domain/simulation/physics/worker'
      )

      const vCorner = 4.6
      const effectiveMinTargetSpeed = 6.2
      const personalMax = 9.1
      const effectiveMaxTargetSpeed = 9.1
      const vTargetRaw = Math.min(vCorner, effectiveMaxTargetSpeed)
      const adaptiveMinSpeed = computeAdaptiveMinSpeed(
        vTargetRaw,
        effectiveMinTargetSpeed,
      )

      expect(adaptiveMinSpeed).toBeCloseTo(vCorner, 6)

      const targetSpeed = MathUtils.clamp(vTargetRaw, adaptiveMinSpeed, personalMax)
      const compensationForBest = 1
      const commandNoise = 0
      const preferredSpeed = 4.6
      const baseTarget = MathUtils.clamp(
        targetSpeed * compensationForBest + commandNoise,
        adaptiveMinSpeed,
        personalMax,
      )
      const preferenceBias = MathUtils.clamp(preferredSpeed - baseTarget, -0.6, 0.6)
      const biasedTarget = MathUtils.clamp(
        baseTarget + preferenceBias * 0.2,
        adaptiveMinSpeed,
        personalMax,
      )

      const dt = 5
      const prevCommand = 8.2
      const targetRiseRateLimit = 0.8
      const targetDropRateLimit = 1.0
      const maxRise = targetRiseRateLimit * dt
      const maxDrop = targetDropRateLimit * dt
      let bounded = biasedTarget
      if (bounded > prevCommand + maxRise) bounded = prevCommand + maxRise
      if (bounded < prevCommand - maxDrop) bounded = prevCommand - maxDrop

      const targetSpeedDamping = 4.0
      const reactionTime = 0.3
      const dampingAlpha = 1 - Math.exp(-targetSpeedDamping * dt)
      const reactionAlpha = 1 - Math.exp(-dt / reactionTime)
      const combinedAlpha = MathUtils.clamp(
        1 - (1 - dampingAlpha) * (1 - reactionAlpha),
        0,
        1,
      )
      const commandedTarget = prevCommand + (bounded - prevCommand) * combinedAlpha

      expect(commandedTarget).toBeCloseTo(vCorner, 5)
    } finally {
      restoreSelf()
    }
  })

})
