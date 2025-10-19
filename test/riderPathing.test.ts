import { describe, expect, it } from 'vitest'
import { MathUtils, Vector3 } from 'three'
import { PathSpline } from '../src/domain/route/pathSpline'
import {
  computeDesiredOffsetProfile,
  computeNeighborBounds,
  steerOffsetTowardTarget,
} from '../src/domain/simulation/physics/riderPathing'
import { planOffset } from '../src/domain/simulation/physics/planning/offsetPlanner'

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

function createShallowSpline(): PathSpline {
  const radius = 120
  const span = Math.PI / 2
  const segments = 36
  const points: Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const angle = (span * i) / segments
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
    let orientationSign = 1
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

      const desiredProfile = computeDesiredOffsetProfile(spline, progress, {
        lookAhead,
        maxOffset,
        totalLength,
        minRadius: 20,
        hasNeighbor: false,
      })

      if (Math.abs(desiredProfile.orientation) > 0) {
        orientationSign = Math.sign(desiredProfile.orientation)
      }

      offset = steerOffsetTowardTarget(
        offset,
        desiredProfile.target,
        neighborBounds.min[0],
        neighborBounds.max[0],
        dt,
        2.5
      )

      const travel = speed * dt
      progress += travel

      minOffset = Math.min(minOffset, offset * orientationSign)
    }

    expect(minOffset).toBeLessThan(-0.2 * maxOffset)
  })

  it('keeps an isolated leader on the ideal line without touching boundaries', () => {
    const spline = createCurvedSpline()
    const totalLength = spline.totalLength
    const lookAhead = 18
    const maxOffset = 3.2
    const laneWidth = 1
    const dt = 0.16
    const speed = 11.2
    const neighborArcDistance = 6
    const lateralGap = 0.8

    let progress = 3
    let offset = 0
    let orientationSign = 1
    const offsetsHistory: number[] = []
    const progressionHistory: number[] = []
    const targetHistory: number[] = []
    const orientationHistory: number[] = []
    const phaseEntryHistory: number[] = []
    const phaseApexHistory: number[] = []
    const phaseExitHistory: number[] = []

    for (let step = 0; step < 150; step++) {
      const progressArray = new Float32Array([progress])
      const offsetArray = new Float32Array([offset])
      const neighborBounds = computeNeighborBounds(progressArray, offsetArray, {
        laneWidth,
        maxOffset,
        totalLength,
        neighborArcDistance,
        lateralGap,
      })

      const desiredProfile = computeDesiredOffsetProfile(spline, progress, {
        lookAhead,
        maxOffset,
        totalLength,
        minRadius: 18,
        hasNeighbor: false,
        boundaryMode: 'clamp',
      })

      if (Math.abs(desiredProfile.orientation) > 0) {
        orientationSign = Math.sign(desiredProfile.orientation)
      }

      phaseEntryHistory.push(desiredProfile.phases.entry * orientationSign)
      phaseApexHistory.push(desiredProfile.phases.apex * orientationSign)
      phaseExitHistory.push(desiredProfile.phases.exit * orientationSign)

      offset = steerOffsetTowardTarget(
        offset,
        desiredProfile.target,
        neighborBounds.min[0],
        neighborBounds.max[0],
        dt,
        2.2,
      )

      offsetsHistory.push(offset)
      progressionHistory.push(desiredProfile.progression)
      targetHistory.push(desiredProfile.target)
      orientationHistory.push(orientationSign)

      const travel = speed * dt
      progress = MathUtils.euclideanModulo(progress + travel, totalLength)
    }

    expect(offsetsHistory.every((value) => Math.abs(value) <= maxOffset + 1e-3)).toBe(true)

    const orientedTargets = targetHistory.map((value, index) =>
      value * (orientationHistory[index] || 1)
    )

    const hasOutsideEntry = orientedTargets.some(
      (value, index) =>
        progressionHistory[index] >= 0.8 && index < offsetsHistory.length / 3 &&
        value > 0.18 * maxOffset,
    )
    const hasInsideApex = orientedTargets.some(
      (value, index) =>
        progressionHistory[index] >= 0.35 &&
        progressionHistory[index] <= 0.65 &&
        value < -0.18 * maxOffset,
    )
    const hasOutsideExit = orientedTargets.some(
      (value, index) =>
        progressionHistory[index] <= 0.25 &&
        index > offsetsHistory.length / 2 &&
        value > 0.18 * maxOffset,
    )

    const entryPhaseOutside = phaseEntryHistory.some(
      (value, index) =>
        progressionHistory[index] >= 0.7 && index < offsetsHistory.length / 2 &&
        value > 0.2 * maxOffset,
    )
    const apexPhaseInside = phaseApexHistory.some(
      (value, index) =>
        progressionHistory[index] >= 0.35 &&
        progressionHistory[index] <= 0.65 &&
        value < -0.2 * maxOffset,
    )
    const exitPhaseOutside = phaseExitHistory.some(
      (value, index) =>
        progressionHistory[index] <= 0.3 &&
        index > offsetsHistory.length / 2 &&
        value > 0.18 * maxOffset,
    )

    expect(hasOutsideEntry).toBe(true)
    expect(hasInsideApex).toBe(true)
    expect(hasOutsideExit).toBe(true)
    expect(entryPhaseOutside).toBe(true)
    expect(apexPhaseInside).toBe(true)
    expect(exitPhaseOutside).toBe(true)
  })

  it('enforces the classic racing line for an isolated rider on a gentle bend', () => {
    const spline = createCurvedSpline()
    const totalLength = spline.totalLength
    const lookAhead = 10
    const maxOffset = 2.8
    const progress = 7

    const desiredProfile = computeDesiredOffsetProfile(spline, progress, {
      lookAhead,
      maxOffset,
      totalLength,
      minRadius: 55,
      hasNeighbor: false,
    })

    expect(desiredProfile.intensity).toBeGreaterThan(0)
    expect(desiredProfile.orientation).not.toBe(0)

    const orientation = Math.sign(desiredProfile.orientation)
    const orientedEntry = desiredProfile.phases.entry * orientation
    const orientedApex = desiredProfile.phases.apex * orientation
    const orientedExit = desiredProfile.phases.exit * orientation

    expect(orientedEntry).toBeGreaterThan(0.05 * maxOffset)
    expect(orientedApex).toBeLessThan(-0.05 * maxOffset)
    expect(orientedExit).toBeGreaterThan(0.05 * maxOffset)
  })

  it('maintains a strong outside target for isolated riders on shallow curves', () => {
    const spline = createCurvedSpline()
    const totalLength = spline.totalLength
    const maxOffset = 2.4

    let weakestOutside = Number.POSITIVE_INFINITY
    let parameters:
      | {
          progress: number
          lookAhead: number
          minRadius: number
          progression: number
        }
      | null = null

    for (let lookAhead = 4; lookAhead <= 14; lookAhead += 1) {
      for (let minRadius = 60; minRadius <= 180; minRadius += 10) {
        for (let progress = 0; progress < totalLength; progress += 0.5) {
          const profile = computeDesiredOffsetProfile(spline, progress, {
            lookAhead,
            maxOffset,
            totalLength,
            minRadius,
            hasNeighbor: false,
          })

          if (profile.orientation === 0 || profile.intensity <= 1e-4) {
            continue
          }

          const orientation = Math.sign(profile.orientation)
          const orientedTarget = profile.target * orientation
          if (
            orientedTarget <= 0 ||
            (profile.progression > 0.25 && profile.progression < 0.75)
          ) {
            continue
          }

          if (orientedTarget < weakestOutside) {
            weakestOutside = orientedTarget
            parameters = { progress, lookAhead, minRadius, progression: profile.progression }
          }
        }
      }
    }

    expect(parameters).not.toBeNull()
    expect(weakestOutside).toBeGreaterThanOrEqual(0.25 * maxOffset)
  })

  it('keeps isolated riders committed to the apex on gentle bends', () => {
    const spline = createShallowSpline()
    const totalLength = spline.totalLength
    const laneWidth = 1
    const maxOffset = 2.6
    const lookAhead = 4.5
    const minRadius = 85
    const currentDistance = totalLength * 0.42

    const desiredProfile = computeDesiredOffsetProfile(spline, currentDistance, {
      lookAhead,
      maxOffset,
      totalLength,
      minRadius,
      hasNeighbor: false,
    })

    expect(desiredProfile.intensity).toBeGreaterThan(0)
    expect(desiredProfile.progression).toBeGreaterThan(0.3)
    expect(desiredProfile.progression).toBeLessThan(0.7)

    const orientation = Math.sign(desiredProfile.orientation) || 1

    const plan = planOffset({
      currentOffset: 0,
      currentDistance,
      minBound: -maxOffset,
      maxBound: maxOffset,
      hasLateralNeighbor: false,
      laneWidth,
      maxOffset,
      lookAheadDistance: lookAhead,
      lookAhead,
      totalLength,
      spline,
      minRadius,
      pathBoundaryMode: 'loop',
      targetSpeed: 11,
      adaptiveMinSpeed: 8.5,
      personalMax: 12,
      slope: 0,
      lengthRatioRange: { min: 0.92, max: 1.08 },
      availableTime: lookAhead / 11,
      maxOffsetRate: 3,
      sequence: [],
      powerWeight: 0.55,
      gapWeight: 0.3,
      baseWallWeight: 0.15,
      gapAhead: 18,
      gapThreshold: 6,
      mass: 80,
      cdA: 0.32,
      airDensity: 1.2,
      rollingResistanceCoeff: 0.004,
      gravity: 9.81,
      drivetrainEfficiency: 0.97,
      maxPower: 380,
    })

    const insideComponent = plan.lateralDecision.targetOffset * -orientation
    expect(insideComponent).toBeGreaterThan(0.12 * maxOffset)
  })
})

