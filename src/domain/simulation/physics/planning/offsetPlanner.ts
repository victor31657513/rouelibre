import { MathUtils } from 'three'
import {
  computeDesiredOffsetProfile,
  constrainOffsetWithinRate,
  evaluateOffsetCandidates,
  generateOffsetCandidates,
} from '../riderPathing'
import {
  adjustTargetSpeedForSlope,
  computeOffsetSegmentLengths,
  computeTargetSpeedCompensation,
  type SegmentSamplingOptions,
} from '../speedControl'
import { powerDemand } from '../aero'
import { pruneOffsetSequence } from './riderManagement'
import type {
  OffsetPhaseQueueEntry,
  OffsetPlanResult,
  PathBoundaryMode,
  PathSpline,
} from './types'

export const OFFSET_CANDIDATE_STEP = 0.65
export const WALL_COMFORT_MARGIN = 0.75
export const LATERAL_GAP_INFLUENCE = 0.35
export const TRAJECTORY_PREFERENCE_FACTOR = 0.65

function formatCacheKey(value: number, precision = 5): string {
  if (!Number.isFinite(value)) {
    return 'nan'
  }
  const factor = Math.pow(10, precision)
  return (Math.round(value * factor) / factor).toString()
}

interface OffsetPlanInput {
  currentOffset: number
  currentDistance: number
  minBound: number
  maxBound: number
  hasLateralNeighbor: boolean
  laneWidth: number
  maxOffset: number
  lookAheadDistance: number
  lookAhead: number
  totalLength: number
  spline: PathSpline
  minRadius: number
  pathBoundaryMode: PathBoundaryMode
  targetSpeed: number
  adaptiveMinSpeed: number
  personalMax: number
  slope: number
  lengthRatioRange: { min: number; max: number }
  availableTime: number
  maxOffsetRate: number
  sequence: OffsetPhaseQueueEntry[]
  powerWeight: number
  gapWeight: number
  baseWallWeight: number
  gapAhead: number
  gapThreshold: number
  mass: number
  cdA: number
  airDensity: number
  rollingResistanceCoeff: number
  gravity: number
  drivetrainEfficiency: number
  maxPower: number
  segmentSampler?: (
    startDistance: number,
    endDistance: number,
    offsets: readonly number[],
    options?: SegmentSamplingOptions,
  ) => number[]
}

export function planOffset(input: OffsetPlanInput): OffsetPlanResult {
  const {
    currentOffset,
    currentDistance,
    minBound,
    maxBound,
    hasLateralNeighbor,
    laneWidth,
    maxOffset,
    lookAheadDistance,
    lookAhead,
    totalLength,
    spline,
    minRadius,
    pathBoundaryMode,
    targetSpeed,
    adaptiveMinSpeed,
    personalMax,
    slope,
    lengthRatioRange,
    availableTime,
    maxOffsetRate,
    sequence,
    powerWeight,
    gapWeight,
    baseWallWeight,
    gapAhead,
    gapThreshold,
    mass,
    cdA,
    airDensity,
    rollingResistanceCoeff,
    gravity,
    drivetrainEfficiency,
    maxPower,
    segmentSampler,
  } = input

  if (lookAheadDistance <= 0.25) {
    return {
      plannedOffset: currentOffset,
      compensation: 1,
      lateralDecision: {
        targetOffset: currentOffset,
        bestIndex: 0,
        lateralForce: 0,
        cost: 0,
      },
      updatedSequence: sequence,
    }
  }

  const decay = hasLateralNeighbor ? 0.97 : 0.99
  const preservedSequence = pruneOffsetSequence(sequence ?? [], decay, maxOffset).slice(-9)

  const baseWallComfort = Math.max(laneWidth * 0.5, WALL_COMFORT_MARGIN)
  const wallComfort = !hasLateralNeighbor
    ? Number.isFinite(maxOffset)
      ? Math.max(baseWallComfort, Math.abs(maxOffset) * 0.9)
      : baseWallComfort * 2
    : baseWallComfort
  const offsetWallWeight = hasLateralNeighbor ? baseWallWeight : Math.max(0.02, baseWallWeight * 0.55)

  const horizon = Math.max(lookAheadDistance, laneWidth * 1.5, 3)
  const startDistance = currentDistance
  const endDistance = totalLength > 0 ? Math.min(startDistance + horizon, totalLength) : startDistance + horizon
  const samplingOptions: SegmentSamplingOptions = { sampleCount: 16, adaptiveStep: true }

  const candidateStep = Math.max(laneWidth * 0.5, OFFSET_CANDIDATE_STEP)
  const baseCandidates = generateOffsetCandidates(
    currentOffset,
    candidateStep,
    minBound,
    maxBound,
    maxOffset,
  )

  const desiredProfile = computeDesiredOffsetProfile(spline, startDistance, {
    lookAhead: horizon,
    maxOffset,
    totalLength,
    minRadius,
    boundaryMode: pathBoundaryMode,
    hasNeighbor: hasLateralNeighbor,
  })

  const activeSequence = preservedSequence
  let sequenceForEvaluation: OffsetPhaseQueueEntry[] = activeSequence
  if (desiredProfile.intensity > 1e-3) {
    const entryStrength = Math.pow(MathUtils.clamp(1 - desiredProfile.progression, 0, 1), 0.9)
    const exitStrength = Math.pow(MathUtils.clamp(desiredProfile.progression, 0, 1), 0.9)
    const apexStrength = Math.max(
      0.2,
      Math.pow(1 - Math.abs(desiredProfile.progression - 0.5) * 2, 0.75),
    )
    const strengthSum = entryStrength + apexStrength + exitStrength || 1
    const neighborBoost = hasLateralNeighbor ? 1 : 1.35
    const baseSequenceWeight = Math.min(
      1.25,
      desiredProfile.intensity * neighborBoost + (hasLateralNeighbor ? 0 : 0.12),
    )
    const baseTtl = Math.max(3, Math.round(MathUtils.lerp(3, 5, desiredProfile.intensity)))
    const newPhases: OffsetPhaseQueueEntry[] = [
      {
        offset: MathUtils.clamp(desiredProfile.phases.entry, -maxOffset, maxOffset),
        weight: (entryStrength / strengthSum) * baseSequenceWeight,
        ttl: baseTtl + 3,
      },
      {
        offset: MathUtils.clamp(desiredProfile.phases.apex, -maxOffset, maxOffset),
        weight: (apexStrength / strengthSum) * baseSequenceWeight,
        ttl: baseTtl + 2,
      },
      {
        offset: MathUtils.clamp(desiredProfile.phases.exit, -maxOffset, maxOffset),
        weight: (exitStrength / strengthSum) * baseSequenceWeight,
        ttl: baseTtl + 1,
      },
    ]
    const merged = [...activeSequence, ...newPhases].filter(
      (phase) => phase.weight > 1e-4 && Number.isFinite(phase.offset),
    )
    merged.sort((a, b) => (b.ttl ?? 0) - (a.ttl ?? 0))
    sequenceForEvaluation = merged.slice(0, 9)
  }

  const sequenceWeightSum = sequenceForEvaluation.reduce((sum, phase) => {
    const ttlInfluence = Math.max(1, Math.min(3, phase.ttl ?? 1))
    return sum + Math.max(0, phase.weight) * ttlInfluence
  }, 0)

  let preferredOffset: number | null = null
  if (sequenceForEvaluation.length > 0) {
    let bestScore = -Infinity
    for (const phase of sequenceForEvaluation) {
      const phaseWeight = Math.max(0, phase.weight)
      if (phaseWeight <= 1e-6) continue
      const phaseScore = phaseWeight * ((phase.ttl ?? 1) + 0.5)
      if (phaseScore > bestScore) {
        bestScore = phaseScore
        preferredOffset = MathUtils.clamp(phase.offset, -maxOffset, maxOffset)
      }
    }
  }
  if (preferredOffset === null && desiredProfile.intensity > 1e-3) {
    preferredOffset = MathUtils.clamp(desiredProfile.target, -maxOffset, maxOffset)
  }

  let trajectoryWeight = 0
  if (preferredOffset !== null || sequenceForEvaluation.length > 0) {
    const baseWeight =
      TRAJECTORY_PREFERENCE_FACTOR * MathUtils.clamp((gapWeight + baseWallWeight) * 0.5, 0.1, 1.4)
    const effectiveIntensity = MathUtils.clamp(
      sequenceWeightSum > 0 ? sequenceWeightSum : desiredProfile.intensity,
      0,
      1,
    )
    const intensityFactor = MathUtils.lerp(0.45, hasLateralNeighbor ? 1.1 : 1.25, effectiveIntensity)
    const neighborFactor = hasLateralNeighbor ? 1 : 1.65
    trajectoryWeight = baseWeight * intensityFactor * neighborFactor
  }

  const candidateSet = new Set(baseCandidates)
  if (preferredOffset !== null) {
    candidateSet.add(preferredOffset)
  }
  for (const phase of sequenceForEvaluation) {
    candidateSet.add(MathUtils.clamp(phase.offset, -maxOffset, maxOffset))
  }
  const candidates = Array.from(candidateSet)

  const candidateCompensations: number[] = []
  const candidatePowerRatios: number[] = []

  const clampedCandidates = candidates.map((candidate) =>
    MathUtils.clamp(candidate, -maxOffset, maxOffset),
  )
  const offsetsToSample = [0, ...clampedCandidates]
  const sampledLengths = segmentSampler
    ? segmentSampler(startDistance, endDistance, offsetsToSample, samplingOptions)
    : computeOffsetSegmentLengths(
        spline,
        startDistance,
        endDistance,
        offsetsToSample,
        samplingOptions,
      )
  const referenceLength = sampledLengths[0] ?? 0
  const candidateLengths =
    sampledLengths.length >= offsetsToSample.length
      ? sampledLengths.slice(1)
      : clampedCandidates.map(() => referenceLength)
  const safeReference = Math.max(1e-3, referenceLength)

  const compensationCache = new Map<string, number>()
  const powerCache = new Map<string, number>()
  const powerParams = {
    airDensity,
    cdA,
    crr: rollingResistanceCoeff,
    mass,
    slope,
    gravity,
    drivetrainEfficiency,
  }

  for (let index = 0; index < candidates.length; index++) {
    const segmentLength = candidateLengths[index] ?? referenceLength

    let compensation = 1
    if (segmentLength > 1e-3 && safeReference > 1e-3) {
      const rawRatio = segmentLength / safeReference
      const clampedRatio = MathUtils.clamp(
        rawRatio,
        lengthRatioRange.min,
        lengthRatioRange.max,
      )
      const cacheKey = formatCacheKey(clampedRatio)
      let cached = compensationCache.get(cacheKey)
      if (cached === undefined) {
        cached = computeTargetSpeedCompensation(clampedRatio)
        compensationCache.set(cacheKey, cached)
      }
      compensation = cached
    }
    candidateCompensations.push(compensation)

    const candidateSpeed = MathUtils.clamp(
      targetSpeed * compensation,
      adaptiveMinSpeed,
      personalMax,
    )
    const slopeAdjustedCandidate = adjustTargetSpeedForSlope(candidateSpeed, slope, {
      maxSlope: 0.25,
      maxUphillPenalty: 2,
      maxDownhillBoost: 1,
      minSpeed: Math.max(0, adaptiveMinSpeed - 0.5),
      maxSpeed: personalMax + 0.5,
    })

    if (!Number.isFinite(slopeAdjustedCandidate) || slopeAdjustedCandidate <= 0) {
      candidatePowerRatios.push(0)
      continue
    }

    const speedKey = formatCacheKey(slopeAdjustedCandidate, 4)
    let candidatePower = powerCache.get(speedKey)
    if (candidatePower === undefined) {
      candidatePower = powerDemand(slopeAdjustedCandidate, powerParams)
      powerCache.set(speedKey, candidatePower)
    }
    const normalizedPower = maxPower > 1e-3 ? candidatePower / maxPower : 0
    candidatePowerRatios.push(Math.max(0, normalizedPower))
  }

  const desiredSequence = sequenceForEvaluation
    .filter((phase) => phase.weight > 1e-4)
    .map((phase) => ({ offset: phase.offset, weight: phase.weight }))

  const offsetPlan = evaluateOffsetCandidates({
    currentOffset,
    candidates,
    powerRatios: candidatePowerRatios,
    minBound,
    maxBound,
    maxOffset,
    gapAhead,
    gapThreshold,
    weights: { power: powerWeight, gap: gapWeight, wall: offsetWallWeight },
    wallComfort,
    referenceStep: candidateStep,
    lateralGapInfluence: LATERAL_GAP_INFLUENCE,
    desiredOffset: preferredOffset ?? undefined,
    desiredSequence,
    desiredWeight: trajectoryWeight,
  })

  const compensationForBest = candidateCompensations[offsetPlan.bestIndex] ?? 1

  const plannedOffset = constrainOffsetWithinRate(
    currentOffset,
    offsetPlan.targetOffset,
    minBound,
    maxBound,
    maxOffsetRate,
    availableTime,
  )

  return {
    plannedOffset: MathUtils.clamp(plannedOffset, -maxOffset, maxOffset),
    compensation: compensationForBest,
    lateralDecision: offsetPlan,
    updatedSequence: sequenceForEvaluation,
  }
}
