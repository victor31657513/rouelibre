import { MathUtils, Vector3 } from 'three'
import type { PathSpline } from '../../route/pathSpline'
import type { PathBoundaryMode } from './riderPathing'

export interface BestLineLookup {
  offsets: Float32Array
  step: number
}

const scratchProjection = new Vector3()
const scratchSegment = new Vector3()
const scratchCenter = new Vector3()

function projectPointOntoSegmentXZ(
  point: Vector3,
  a: Vector3,
  b: Vector3,
  target: Vector3,
): Vector3 {
  const abx = b.x - a.x
  const abz = b.z - a.z
  const apx = point.x - a.x
  const apz = point.z - a.z
  const denom = abx * abx + abz * abz
  let t = 0
  if (denom > 1e-6) {
    t = MathUtils.clamp((apx * abx + apz * abz) / denom, 0, 1)
  }
  target.set(a.x + abx * t, MathUtils.lerp(a.y, b.y, t), a.z + abz * t)
  return target
}

function nearestPointOnPolylineXZ(point: Vector3, polyline: readonly Vector3[]): Vector3 {
  if (polyline.length === 0) {
    return scratchProjection.copy(point)
  }

  let best = scratchProjection.copy(polyline[0])
  let bestDistSq = point.distanceToSquared(best)

  for (let i = 0; i < polyline.length - 1; i++) {
    const a = polyline[i]
    const b = polyline[i + 1]
    const candidate = projectPointOntoSegmentXZ(point, a, b, scratchSegment)
    const distSq = point.distanceToSquared(candidate)
    if (distSq < bestDistSq) {
      bestDistSq = distSq
      best = candidate.clone()
    }
  }

  return best
}

function smoothOffsets(offsets: Float32Array): void {
  if (offsets.length < 3) return
  const tmp = new Float32Array(offsets.length)
  tmp[0] = offsets[0]
  tmp[offsets.length - 1] = offsets[offsets.length - 1]
  for (let i = 1; i < offsets.length - 1; i++) {
    const prev = offsets[i - 1]
    const curr = offsets[i]
    const next = offsets[i + 1]
    tmp[i] = curr * 0.5 + (prev + next) * 0.25
  }
  offsets.set(tmp)
}

export function precomputeBestLineLookup(
  spline: PathSpline,
  bestLinePoints: readonly Vector3[],
  totalLength: number,
  maxOffset: number,
  sampleStep = 0.6,
): BestLineLookup | null {
  if (!spline || totalLength <= 0 || bestLinePoints.length === 0) {
    return null
  }

  const step = Math.max(0.25, sampleStep)
  const count = Math.max(2, Math.ceil(totalLength / step) + 1)
  const offsets = new Float32Array(count)
  let lastRight = new Vector3(1, 0, 0)

  for (let i = 0; i < count; i++) {
    const distance = Math.min(i * step, totalLength)
    const sample = spline.sampleByDistance(distance)
    scratchCenter.copy(sample.position)
    const tangent = sample.tangent
    const right = new Vector3(-tangent.z, 0, tangent.x)
    if (right.lengthSq() <= 1e-6) {
      right.copy(lastRight)
    } else {
      right.normalize()
      lastRight = right.clone()
    }

    const projection = nearestPointOnPolylineXZ(scratchCenter, bestLinePoints)
    const lateral = projection.sub(scratchCenter).dot(right)
    offsets[i] = MathUtils.clamp(lateral, -Math.abs(maxOffset), Math.abs(maxOffset))
  }

  smoothOffsets(offsets)

  for (let i = 0; i < offsets.length; i++) {
    const value = offsets[i]
    offsets[i] = Math.abs(value) < 1e-4 ? 0 : value
  }

  return { offsets, step }
}

export function sampleBestLineOffset(
  lookup: BestLineLookup | null,
  distance: number,
  totalLength: number,
  mode: PathBoundaryMode,
): number {
  if (!lookup || !lookup.offsets || lookup.offsets.length === 0) {
    return 0
  }
  if (!Number.isFinite(distance) || totalLength <= 0) {
    return 0
  }

  let normalized = distance
  if (mode === 'loop') {
    normalized = MathUtils.euclideanModulo(distance, totalLength)
  } else {
    normalized = MathUtils.clamp(distance, 0, totalLength)
  }

  const step = Math.max(lookup.step, 1e-3)
  const scaled = Math.min(normalized / step, lookup.offsets.length - 1)
  const lower = Math.floor(scaled)
  const upper = Math.min(lower + 1, lookup.offsets.length - 1)
  const frac = MathUtils.clamp(scaled - lower, 0, 1)
  const lowerValue = lookup.offsets[lower] ?? 0
  const upperValue = lookup.offsets[upper] ?? lowerValue
  return MathUtils.lerp(lowerValue, upperValue, frac)
}

export interface BestLineProfile {
  target: number
  entry: number
  apex: number
  exit: number
  intensity: number
}

export function sampleBestLineProfile(
  lookup: BestLineLookup | null,
  distance: number,
  horizon: number,
  totalLength: number,
  progressionHint: number,
  maxOffset: number,
  mode: PathBoundaryMode,
): BestLineProfile | null {
  if (!lookup || lookup.offsets.length === 0 || totalLength <= 0) {
    return null
  }

  const safeHorizon = Math.max(0, horizon)
  const normalizedProgress = Number.isFinite(progressionHint)
    ? MathUtils.clamp(progressionHint, 0, 1)
    : 0.5

  const entryDistance = distance
  const apexDistance = distance + safeHorizon * MathUtils.lerp(0.4, 0.65, normalizedProgress)
  const exitDistance = distance + safeHorizon
  const targetDistance = distance + safeHorizon * normalizedProgress

  const entryRaw = sampleBestLineOffset(lookup, entryDistance, totalLength, mode)
  const apexRaw = sampleBestLineOffset(lookup, apexDistance, totalLength, mode)
  const exitRaw = sampleBestLineOffset(lookup, exitDistance, totalLength, mode)
  const targetRaw = sampleBestLineOffset(lookup, targetDistance, totalLength, mode)

  const clamp = (value: number) => MathUtils.clamp(value, -Math.abs(maxOffset), Math.abs(maxOffset))
  const entry = clamp(entryRaw)
  const apex = clamp(apexRaw)
  const exit = clamp(exitRaw)
  const target = clamp(targetRaw)

  const amplitude = Math.max(
    Math.abs(entry - apex),
    Math.abs(apex - exit),
    Math.abs(entry - exit),
    Math.abs(target - apex),
  )
  const intensity = MathUtils.clamp(amplitude / Math.max(Math.abs(maxOffset), 1e-3), 0, 1)

  if (intensity <= 1e-4 && Math.abs(target) <= 1e-4) {
    return { target: 0, entry: 0, apex: 0, exit: 0, intensity: 0 }
  }

  return { target, entry, apex, exit, intensity }
}
