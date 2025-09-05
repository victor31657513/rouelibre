import type { Vec3 } from './gpx'

export interface PelotonOptions {
  seed?: number
  spacing?: number
  laneWidth?: number
  roadWidth?: number
  jitter?: number
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Initialise les positions des cyclistes sur le début du parcours sélectionné
 * via un échantillonnage pseudo-aléatoire jitteré.
 */
export function initPeloton(
  path: Vec3[],
  N: number,
  options: PelotonOptions = {}
): Float32Array {
  const positions = new Float32Array(N * 3)
  if (path.length < 2) return positions

  const {
    seed = 1234,
    spacing = 1.2,
    laneWidth = 1.0,
    roadWidth = 8.0,
    jitter = 0.3,
  } = options
  const rng = mulberry32(seed)

  const p0 = path[0]
  const p1 = path[1]
  const dx = p1.x - p0.x
  const dz = p1.z - p0.z
  const len = Math.hypot(dx, dz) || 1
  const nx = dx / len
  const nz = dz / len
  // vecteur à droite de la route
  const rx = -nz
  const rz = nx

  const halfRoad = roadWidth / 2 - laneWidth / 2

  for (let i = 0; i < N; i++) {
    const row = Math.floor(i / 9)
    const col = i % 9 - 4 // centré
    const jitterForward = (rng() - 0.5) * jitter * spacing
    const jitterSide = (rng() - 0.5) * jitter * laneWidth
    let forward = row * spacing + jitterForward
    if (row === 0) forward = Math.max(0, jitterForward)
    let lateral = col * laneWidth + jitterSide
    lateral = Math.max(-halfRoad, Math.min(halfRoad, lateral))
    const x = p0.x - nx * forward + rx * lateral
    const z = p0.z - nz * forward + rz * lateral
    positions[i * 3 + 0] = x
    positions[i * 3 + 1] = p0.y + 1
    positions[i * 3 + 2] = z
  }
  return positions
}
