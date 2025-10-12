import {
  BufferGeometry,
  CatmullRomCurve3,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Vector3,
} from 'three'

/**
 * @fileoverview Helpers to sample a Catmull-Rom spline built from route points.
 * Provides resampling utilities shared between the renderer and the physics
 * worker so both pipelines operate on the same representation.
 *
 * Extension: Add banking or superelevation information by augmenting the
 * `sampleByDistance` return type without altering the existing API surface.
 */
export class PathSpline {
  curve: CatmullRomCurve3
  totalLength: number

  constructor(waypoints: Vector3[]) {
    this.curve = new CatmullRomCurve3(waypoints)
    this.totalLength = this.curve.getLength()
  }

  sampleByDistance(d: number): { position: Vector3; tangent: Vector3 } {
    const dist = Math.max(0, Math.min(d, this.totalLength))
    const u = dist / this.totalLength
    const t = this.curve.getUtoTmapping(u, dist)
    const position = this.curve.getPoint(t)
    const tangent = this.curve.getTangent(t).normalize()
    return { position, tangent }
  }

  estimateCurvature(t: number): number {
    const delta = 0.01
    const t1 = Math.max(0, t - delta)
    const t2 = t
    const t3 = Math.min(1, t + delta)
    const p1 = this.curve.getPoint(t1)
    const p2 = this.curve.getPoint(t2)
    const p3 = this.curve.getPoint(t3)
    const v1 = p2.clone().sub(p1)
    const v2 = p3.clone().sub(p2)
    const angle = v1.angleTo(v2)
    const len = (v1.length() + v2.length()) / 2
    return len > 0 ? (angle / len) * 0.02 : 0
  }
}

export interface YawState {
  yawRate: number
}

export function smoothLimitAngle(
  currentYaw: number,
  targetYaw: number,
  state: YawState,
  maxRateDeg = 120,
  maxAccelDeg = 480,
  dt: number,
): number {
  const maxRate = MathUtils.degToRad(maxRateDeg)
  const maxAccel = MathUtils.degToRad(maxAccelDeg)
  let yawRate = state.yawRate
  let delta = targetYaw - currentYaw
  delta = Math.atan2(Math.sin(delta), Math.cos(delta))
  const desiredRate = delta / dt
  let rateDiff = desiredRate - yawRate
  const maxChange = maxAccel * dt
  if (rateDiff > maxChange) rateDiff = maxChange
  else if (rateDiff < -maxChange) rateDiff = -maxChange
  yawRate += rateDiff
  if (yawRate > maxRate) yawRate = maxRate
  else if (yawRate < -maxRate) yawRate = -maxRate
  state.yawRate = yawRate
  return currentYaw + yawRate * dt
}

export function createSplineHelper(spline: PathSpline, segments = 100): LineSegments {
  const points: number[] = []
  for (let i = 0; i < segments; i++) {
    const d0 = (spline.totalLength * i) / segments
    const d1 = (spline.totalLength * (i + 1)) / segments
    const p0 = spline.sampleByDistance(d0).position
    const p1 = spline.sampleByDistance(d1).position
    points.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z)
  }
  const geom = new BufferGeometry()
  geom.setAttribute('position', new Float32BufferAttribute(points, 3))
  const mat = new LineBasicMaterial({ color: 0xff0000 })
  return new LineSegments(geom, mat)
}

export function resamplePath(waypoints: Vector3[], step: number): Vector3[] {
  const spline = new PathSpline(waypoints)
  const resampled: Vector3[] = []
  for (let d = 0; d <= spline.totalLength; d += step) {
    resampled.push(spline.sampleByDistance(d).position)
  }
  const last = resampled[resampled.length - 1]
  const end = waypoints[waypoints.length - 1]
  if (!last.equals(end)) resampled.push(end.clone())
  return resampled
}
