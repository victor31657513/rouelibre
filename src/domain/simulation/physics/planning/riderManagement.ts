import { MathUtils, Vector3 } from 'three'
import { wrapDistance } from '../speedControl'
import type { PathSpline } from '../../route/pathSpline'
import type { OffsetPhaseQueueEntry, RiderPose, RiderRoleProfile, WeightTriple } from './types'

export function createPose(): RiderPose {
  return { position: new Vector3(), tangent: new Vector3() }
}

const scratchRightVector = new Vector3()
const scratchReferencePose = createPose()
const scratchNeighborPose = createPose()
const scratchRelative = new Vector3()

export function samplePoseAtDistance(
  spline: PathSpline,
  distance: number,
  offset: number,
  target: RiderPose,
): RiderPose {
  const sample = spline.sampleByDistance(distance)
  target.position.copy(sample.position)
  target.tangent.copy(sample.tangent).normalize()
  scratchRightVector.set(-target.tangent.z, 0, target.tangent.x).normalize()
  target.position.addScaledVector(scratchRightVector, offset)
  return target
}

export function alignProjectionToArc(
  projection: number,
  arc: number,
  totalLength: number,
): number {
  if (!Number.isFinite(totalLength) || totalLength <= 0 || !Number.isFinite(arc)) {
    return projection
  }
  let best = projection
  let bestError = Math.abs(projection - arc)
  for (const step of [-1, 1]) {
    const candidate = projection + step * totalLength
    const error = Math.abs(candidate - arc)
    if (error < bestError) {
      best = candidate
      bestError = error
    }
  }
  return best
}

export function computeLongitudinalGaps(
  index: number,
  progress: Float32Array,
  offsets: Float32Array,
  spline: PathSpline,
  totalLength: number,
  poses?: RiderPose[],
): { gapAhead: number; gapBehind: number } {
  const count = progress.length
  if (index < 0 || index >= count) {
    return { gapAhead: Infinity, gapBehind: Infinity }
  }

  const referencePose =
    poses?.[index] ??
    samplePoseAtDistance(spline, progress[index], offsets[index], scratchReferencePose)
  const referencePosition = referencePose.position
  const referenceTangent = referencePose.tangent

  let gapAhead = Infinity
  let gapBehind = Infinity

  for (let j = 0; j < count; j++) {
    if (j === index) continue

    const neighborPose =
      poses?.[j] ??
      samplePoseAtDistance(spline, progress[j], offsets[j], scratchNeighborPose)
    scratchRelative.subVectors(neighborPose.position, referencePosition)
    let projection = scratchRelative.dot(referenceTangent)

    if (totalLength > 0) {
      const rawDiff = progress[j] - progress[index]
      const forwardArc = wrapDistance(rawDiff, totalLength)
      const backwardArc = -wrapDistance(-rawDiff, totalLength)

      if (forwardArc > 1e-3) {
        const alignedForward = alignProjectionToArc(projection, forwardArc, totalLength)
        if (alignedForward > 1e-3 && alignedForward < gapAhead) {
          gapAhead = alignedForward
        }
      }

      if (Math.abs(backwardArc) > 1e-3) {
        const alignedBackward = alignProjectionToArc(projection, backwardArc, totalLength)
        if (alignedBackward < -1e-3) {
          const behind = Math.abs(alignedBackward)
          if (behind < gapBehind) {
            gapBehind = behind
          }
        }
      }
    } else {
      if (projection > 1e-3 && projection < gapAhead) {
        gapAhead = projection
      } else if (projection < -1e-3) {
        const behind = -projection
        if (behind < gapBehind) {
          gapBehind = behind
        }
      }
    }
  }

  return { gapAhead, gapBehind }
}

export function computeDraftingContext(
  index: number,
  progress: Float32Array,
  offsets: Float32Array,
  spline: PathSpline,
  totalLength: number,
  maxDistance: number,
  poses?: RiderPose[],
): { gapToLeader: number; leadersAhead: number } {
  if (!Number.isFinite(maxDistance) || maxDistance <= 0) {
    return { gapToLeader: Infinity, leadersAhead: 0 }
  }

  const count = progress.length
  if (index < 0 || index >= count) {
    return { gapToLeader: Infinity, leadersAhead: 0 }
  }

  const referencePose =
    poses?.[index] ??
    samplePoseAtDistance(spline, progress[index], offsets[index], scratchReferencePose)
  const origin = referencePose.position
  const tangent = referencePose.tangent

  let bestGap = Infinity
  let leaders = 0

  for (let j = 0; j < count; j++) {
    if (j === index) continue

    const neighborPose =
      poses?.[j] ??
      samplePoseAtDistance(spline, progress[j], offsets[j], scratchNeighborPose)
    scratchRelative.subVectors(neighborPose.position, origin)
    let projection = scratchRelative.dot(tangent)

    if (totalLength > 0) {
      const rawDiff = progress[j] - progress[index]
      const forwardArc = wrapDistance(rawDiff, totalLength)
      projection = alignProjectionToArc(projection, forwardArc, totalLength)
    }

    if (projection > 1e-3 && projection <= maxDistance) {
      leaders++
      if (projection < bestGap) {
        bestGap = projection
      }
    }
  }

  return { gapToLeader: leaders > 0 ? bestGap : Infinity, leadersAhead: leaders }
}

export function computeSlope(current: Vector3, ahead: Vector3, distance: number): number {
  if (!isFinite(distance) || distance <= 0) {
    return 0
  }
  return (ahead.y - current.y) / distance
}

export function normalizeWeights(
  power: number,
  gap: number,
  wall: number,
  fallback: WeightTriple,
): WeightTriple {
  const safePower = Number.isFinite(power) ? Math.max(0, power) : 0
  const safeGap = Number.isFinite(gap) ? Math.max(0, gap) : 0
  const safeWall = Number.isFinite(wall) ? Math.max(0, wall) : 0
  const sum = safePower + safeGap + safeWall
  if (sum <= 1e-6) {
    return { ...fallback }
  }
  return {
    power: safePower / sum,
    gap: safeGap / sum,
    wall: safeWall / sum,
  }
}

export function updateBaseWeights(
  powerRaw: number,
  gapRaw: number,
  wallRaw: number,
  fallback: WeightTriple,
): WeightTriple {
  return normalizeWeights(powerRaw, gapRaw, wallRaw, fallback)
}

export function computeRoleWeights(
  roleIndex: number,
  base: WeightTriple,
  roleProfiles: RiderRoleProfile[],
  fallbackPower: number,
  fallbackGap: number,
): WeightTriple {
  if (!Number.isFinite(roleIndex) || roleIndex < 0 || roleIndex >= roleProfiles.length) {
    return { ...base }
  }

  const role = roleProfiles[roleIndex]
  const referencePower = fallbackPower > 1e-6 ? fallbackPower : 1
  const referenceGap = fallbackGap > 1e-6 ? fallbackGap : 1
  const powerScale = MathUtils.clamp(role.powerWeight / referencePower, 0.3, 1.7)
  const gapScale = MathUtils.clamp(role.gapWeight / referenceGap, 0.3, 1.7)
  return normalizeWeights(base.power * powerScale, base.gap * gapScale, base.wall, base)
}

export function recomputeRoleWeights(
  roles: Int16Array,
  base: WeightTriple,
  roleProfiles: RiderRoleProfile[],
  fallbackPower: number,
  fallbackGap: number,
): { power: Float32Array; gap: Float32Array } {
  const count = roles.length
  const powerWeights = new Float32Array(count)
  const gapWeights = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const weights = computeRoleWeights(roles[i], base, roleProfiles, fallbackPower, fallbackGap)
    powerWeights[i] = weights.power
    gapWeights[i] = weights.gap
  }
  return { power: powerWeights, gap: gapWeights }
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function sampleNormal(generator: () => number, mean: number, stdDev: number): number {
  const u1 = Math.max(generator(), 1e-7)
  const u2 = Math.max(generator(), 1e-7)
  const mag = Math.sqrt(-2 * Math.log(u1))
  const z0 = mag * Math.cos(2 * Math.PI * u2)
  const value = mean + z0 * stdDev
  return Number.isFinite(value) ? value : mean
}

export function sampleClampedNormal(
  generator: () => number,
  mean: number,
  stdDev: number,
  min: number,
  max: number,
): number {
  const value = sampleNormal(generator, mean, stdDev)
  return MathUtils.clamp(value, min, max)
}

export function pruneOffsetSequence(
  sequence: OffsetPhaseQueueEntry[],
  decay: number,
  maxOffset: number,
): OffsetPhaseQueueEntry[] {
  const preserved: OffsetPhaseQueueEntry[] = []
  for (const phase of sequence) {
    const nextTtl = (phase.ttl ?? 0) - 1
    const safeWeight = Math.max(0, Number.isFinite(phase.weight) ? phase.weight : 0)
    const safeOffset = MathUtils.clamp(
      Number.isFinite(phase.offset) ? phase.offset : 0,
      Number.isFinite(maxOffset) ? -Math.abs(maxOffset) : -Infinity,
      Number.isFinite(maxOffset) ? Math.abs(maxOffset) : Infinity,
    )
    const decayedWeight = safeWeight * decay
    if (nextTtl > 0 && decayedWeight > 1e-4) {
      preserved.push({ offset: safeOffset, weight: decayedWeight, ttl: nextTtl })
    }
  }
  return preserved
}
