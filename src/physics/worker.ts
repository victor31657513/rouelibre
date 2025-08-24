import * as RAPIER from '@dimforge/rapier3d-compat'

let world: RAPIER.World
let N = 0
// buffer envoyé au thread principal : [x, y, z, yaw]*N
let state: Float32Array
let bodies: RAPIER.RigidBody[] = []
let speeds: Float32Array
// trajectoire à suivre
let path: Float32Array
let segLengths: Float32Array
let cumLengths: Float32Array
let totalLength = 0
let progress: Float32Array
let offsets: Float32Array
let segments: Uint32Array

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
    path = new Float32Array(payload.path)

    const pts = path.length / 3
    segLengths = new Float32Array(pts - 1)
    cumLengths = new Float32Array(pts)
    cumLengths[0] = 0
    for (let i = 0; i < pts - 1; i++) {
      const ax = path[i * 3 + 0]
      const ay = path[i * 3 + 1]
      const az = path[i * 3 + 2]
      const bx = path[(i + 1) * 3 + 0]
      const by = path[(i + 1) * 3 + 1]
      const bz = path[(i + 1) * 3 + 2]
      const len = Math.hypot(bx - ax, by - ay, bz - az)
      segLengths[i] = len
      cumLengths[i + 1] = cumLengths[i] + len
    }
    totalLength = cumLengths[pts - 1]

    // buffers pour le calcul
    state = new Float32Array(N * 4)
    bodies = new Array(N)
    speeds = new Float32Array(N)
    progress = new Float32Array(N)
    offsets = new Float32Array(N)
    segments = new Uint32Array(N)
    const rng = mulberry32(123456)

    for (let i = 0; i < N; i++) {
      const bd = RAPIER.RigidBodyDesc.kinematicPositionBased()
      const rb = world.createRigidBody(bd)
      const cd = RAPIER.ColliderDesc.cuboid(1, 1, 0.35)
      world.createCollider(cd, rb)
      bodies[i] = rb

      // progression initiale le long de la route
      const row = Math.floor(i / 9)
      let s = row * 1.2
      if (totalLength > 0) s = s % totalLength
      let seg = 0
      while (seg < segLengths.length && s > cumLengths[seg + 1]) seg++
      segments[i] = seg
      progress[i] = s

      const base = seg * 3
      const segLen = segLengths[seg] || 1
      const ax = path[base]
      const ay = path[base + 1]
      const az = path[base + 2]
      const bx = path[base + 3]
      const by = path[base + 4]
      const bz = path[base + 5]
      const t = (s - cumLengths[seg]) / segLen
      const dirx = (bx - ax) / segLen
      const dirz = (bz - az) / segLen
      const rightx = -dirz
      const rightz = dirx
      const centerx = ax + dirx * (s - cumLengths[seg])
      const centerz = az + dirz * (s - cumLengths[seg])
      const ix = initial[i * 3 + 0]
      const iz = initial[i * 3 + 2]
      const offset = (ix - centerx) * rightx + (iz - centerz) * rightz
      offsets[i] = offset

      const x = centerx + rightx * offset
      const y = ay + (by - ay) * t + 1
      const z = centerz + rightz * offset
      rb.setTranslation({ x, y, z }, true)
      const yaw = Math.atan2(dirx, dirz)
      state[i * 4 + 0] = x
      state[i * 4 + 1] = y
      state[i * 4 + 2] = z
      state[i * 4 + 3] = yaw
      speeds[i] = 7.0 + rng() * 1.0 // ~25–29 km/h pour démo
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
      let seg = segments[i]
      while (seg < segLengths.length && s > cumLengths[seg + 1]) seg++
      segments[i] = seg
      progress[i] = s

      const base = seg * 3
      const segLen = segLengths[seg] || 1
      const ax = path[base]
      const ay = path[base + 1]
      const az = path[base + 2]
      const bx = path[base + 3]
      const by = path[base + 4]
      const bz = path[base + 5]
      const dirx = (bx - ax) / segLen
      const dirz = (bz - az) / segLen
      const rightx = -dirz
      const rightz = dirx
      const sAlong = s - cumLengths[seg]
      const centerx = ax + dirx * sAlong
      const centery = ay + (by - ay) * (sAlong / segLen)
      const centerz = az + dirz * sAlong
      const offset = offsets[i]
      const x = centerx + rightx * offset
      const y = centery + 1
      const z = centerz + rightz * offset
      rb.setNextKinematicTranslation({ x, y, z })
      const yaw = Math.atan2(dirx, dirz)
      const base4 = i * 4
      state[base4 + 0] = x
      state[base4 + 1] = y
      state[base4 + 2] = z
      state[base4 + 3] = yaw
    }

    world.step()

    ;(self as unknown as Worker).postMessage(
      { type: 'state', data: state.buffer },
      [state.buffer]
    )
    state = new Float32Array(N * 4)
  }
}
