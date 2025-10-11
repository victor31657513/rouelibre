import * as RAPIER from '@dimforge/rapier3d-compat'
import { MathUtils, Vector3 } from 'three'
import { PathSpline, smoothLimitAngle, YawState } from '../systems/pathSmoothing'

let world: RAPIER.World
let N = 0
// buffer envoyé au thread principal : [s, t, h, yaw]*N
let state: Float32Array
let bodies: RAPIER.RigidBody[] = []
let speeds: Float32Array
let progress: Float32Array
let offsets: Float32Array
let yawRates: Float32Array

let laneWidth = 1
let roadWidth = 8
let margin = 0
let maxOffset = Infinity

// trajectoire lissée
let spline: PathSpline
let totalLength = 0

// paramètres ajustables
let lookAhead = 5
let maxYawRate = 120
let maxYawAccel = 480
let minRadius = 12
let speedScale = 0.8

// Worker Rapier : met à jour les positions et renvoie un Float32Array transférable

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}


self.onmessage = async (e: MessageEvent) => {
  const { type, payload }: { type: string; payload: any } = e.data || {}

  if (type === 'init') {
    if (!world) await RAPIER.init() // charge le WASM
    // réinitialise le monde à chaque nouvelle préparation de parcours
    world = new RAPIER.World({ x: 0, y: 0, z: 0 })

    N = payload.N as number
    const initial = new Float32Array(payload.positions)
    const yawOffsets = new Float32Array(payload.yaw)
    const raw = new Float32Array(payload.path)
    laneWidth = payload.laneWidth ?? laneWidth
    roadWidth = payload.roadWidth ?? roadWidth
    margin = payload.margin ?? margin
    maxOffset = Math.max(0, roadWidth / 2 - laneWidth / 2 - margin)
    const waypoints: Vector3[] = []
    for (let i = 0; i < raw.length; i += 3) {
      waypoints.push(new Vector3(raw[i], raw[i + 1], raw[i + 2]))
    }
    spline = new PathSpline(waypoints)
    totalLength = spline.totalLength

    // buffers pour le calcul
    state = new Float32Array(N * 4)
    bodies = new Array(N)
    speeds = new Float32Array(N)
    progress = new Float32Array(N)
    offsets = new Float32Array(N)
    yawRates = new Float32Array(N)
    const rng = mulberry32(123456)

    for (let i = 0; i < N; i++) {
      const bd = RAPIER.RigidBodyDesc.kinematicPositionBased()
      const rb = world.createRigidBody(bd)
      const cd = RAPIER.ColliderDesc.cuboid(1, 1, 0.35)
      world.createCollider(cd, rb)
      rb.setAngularDamping(2.0)
      bodies[i] = rb

      const row = Math.floor(i / 9)
      let s = row * 1.2
      if (totalLength > 0) s = s % totalLength
      progress[i] = s

      const sample = spline.sampleByDistance(s)
      const tangent = sample.tangent
      const right = new Vector3(-tangent.z, 0, tangent.x).normalize()
      const center = sample.position
      const ix = initial[i * 3 + 0]
      const iz = initial[i * 3 + 2]
      const offset = (ix - center.x) * right.x + (iz - center.z) * right.z
      const clampedOffset = MathUtils.clamp(offset, -maxOffset, maxOffset)
      offsets[i] = clampedOffset

      const pos = center.clone().add(right.multiplyScalar(clampedOffset))
      rb.setTranslation({ x: pos.x, y: pos.y + 1, z: pos.z }, true)
      const yaw = Math.atan2(tangent.x, tangent.z) + yawOffsets[i]
      state[i * 4 + 0] = s
      state[i * 4 + 1] = clampedOffset
      state[i * 4 + 2] = 1
      state[i * 4 + 3] = yaw
      speeds[i] = 7.0 + rng() * 1.0
      yawRates[i] = 0
    }

    ;(self as unknown as Worker).postMessage(
      { type: 'state', data: state.buffer },
      [state.buffer]
    )
    state = new Float32Array(N * 4)
  }

  if (type === 'step') {
    if (!world) return // ignore steps before initialization

    const dt: number = payload.dt

    for (let i = 0; i < N; i++) {
      const rb = bodies[i]
      let s = progress[i] + speeds[i] * dt
      if (totalLength > 0) s = s % totalLength
      progress[i] = s

      let ahead = s + lookAhead
      const curvature = spline.estimateCurvature(ahead / totalLength)
      if (curvature > 1 / minRadius) {
        ahead += lookAhead
        speeds[i] *= speedScale
      }

      const sample = spline.sampleByDistance(s)
      const center = sample.position
      const tangent = sample.tangent
      const right = new Vector3(-tangent.z, 0, tangent.x).normalize()
      const offset = MathUtils.clamp(offsets[i], -maxOffset, maxOffset)
      offsets[i] = offset
      const pos = center.clone().add(right.clone().multiplyScalar(offset))

      const look = spline.sampleByDistance(ahead)
      const targetYaw = Math.atan2(look.tangent.x, look.tangent.z)
      const currentYaw = state[i * 4 + 3]
      const yawState: YawState = { yawRate: yawRates[i] }
      const yaw = smoothLimitAngle(currentYaw, targetYaw, yawState, maxYawRate, maxYawAccel, dt)
      yawRates[i] = yawState.yawRate

      rb.setNextKinematicTranslation({ x: pos.x, y: center.y + 1, z: pos.z })
      const half = yaw / 2
      rb.setNextKinematicRotation({ x: 0, y: Math.sin(half), z: 0, w: Math.cos(half) })
      rb.setAngvel({ x: 0, y: yawRates[i], z: 0 }, true)

      const base4 = i * 4
      state[base4 + 0] = s
      state[base4 + 1] = offset
      state[base4 + 2] = 1
      state[base4 + 3] = yaw
    }

    world.step()

    ;(self as unknown as Worker).postMessage(
      { type: 'state', data: state.buffer },
      [state.buffer]
    )
    state = new Float32Array(N * 4)
  }

  if (type === 'params') {
    lookAhead = payload.lookAhead ?? lookAhead
    maxYawRate = payload.maxYawRate ?? maxYawRate
    maxYawAccel = payload.maxYawAccel ?? maxYawAccel
    minRadius = payload.minRadius ?? minRadius
    speedScale = payload.speedScale ?? speedScale
  }
}
