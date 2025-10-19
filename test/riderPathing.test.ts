import { describe, expect, it } from 'vitest'
import { MathUtils, Vector3 } from 'three'
import { PathSpline } from '../src/domain/route/pathSpline'
import {
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
})

