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
const { type, payload } = e.data || {}


if (type === 'init') {
await init() // charge le WASM
world = new RAPIER.World({ x: 0, y: 0, z: 0 }) // pas de gravité pour commencer


N = payload.N as number
const initial = new Float32Array(payload.positions)
positions = new Float32Array(N * 3)
positions.set(initial)


// corps cinématiques (on contrôle la translation)
bodies = new Array(N)
const rng = mulberry32(123456)
speeds = new Float32Array(N)


for (let i = 0; i < N; i++) {
const bd = RAPIER.RigidBodyDesc.kinematicPositionBased()
const rb = world.createRigidBody(bd)
// largeur/hauteur/profondeur proches du rendu
const cd = RAPIER.ColliderDesc.cuboid(0.25, 0.85, 0.5)
world.createCollider(cd, rb)
rb.setTranslation({ x: initial[i * 3 + 0], y: initial[i * 3 + 1], z: initial[i * 3 + 2] }, true)
bodies[i] = rb
// vitesse de base + petite variance (m/s)
speeds[i] = 7.0 + rng() * 1.0 // ~25–29 km/h pour démo
}


// premier envoi
;(self as unknown as Worker).postMessage({ type: 'state', data: positions.buffer }, [positions.buffer])
}


if (type === 'step') {
const dt: number = payload.dt


// simple logique : avance sur +X avec légère ondulation en Z
for (let i = 0; i < N; i++) {
const rb = bodies[i]
const cur = rb.translation()
const speed = speeds[i]
const nx = cur.x + speed * dt
const nz = cur.z + Math.sin((cur.x + i * 0.1) * 0.2) * 0.02 // micro oscillation
rb.setNextKinematicTranslation({ x: nx, y: 0.85, z: nz })
}


world.step()


// remplir le buffer positions
for (let i = 0; i < N; i++) {
const t = bodies[i].translation()
positions[i * 3 + 0] = t.x
positions[i * 3 + 1] = t.y
positions[i * 3 + 2] = t.z
}


// transférer le buffer (zéro copie)
;(self as unknown as Worker).postMessage({ type: 'state', data: positions.buffer }, [positions.buffer])
// recréer un buffer côté worker (car transféré)
positions = new Float32Array(N * 3)
}
}
