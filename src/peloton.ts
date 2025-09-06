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
  options: PelotonOptions = {},
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

  // coordonnées du segment initial (s: longitudinal, t: latéral)
  const p0 = path[0]
  const p1 = path[1]
  const dx = p1.x - p0.x
  const dz = p1.z - p0.z
  const len = Math.hypot(dx, dz) || 1
  const nx = dx / len
  const nz = dz / len
  const rx = -nz // vecteur à droite de la route
  const rz = nx

  const halfRoad = roadWidth / 2 - laneWidth / 2

  // aire de génération en (s,t)
  const nCols = Math.max(1, Math.floor(roadWidth / laneWidth))
  const nRows = Math.ceil(N / nCols)
  const maxS = nRows * spacing
  let radius = spacing * 0.5
  const samples: { s: number; t: number }[] = []
  let attempts = 0

  while (samples.length < N) {
    attempts++
    // base sampling rectangle
    let s = -rng() * maxS
    let t = (rng() * 2 - 1) * halfRoad

    // jitter contrôlé
    s += (rng() - 0.5) * jitter * spacing
    t += (rng() - 0.5) * jitter * laneWidth
    // clamp dans les bornes de la route
    s = Math.min(0, s)
    t = Math.max(-halfRoad, Math.min(halfRoad, t))

    // Poisson disk : vérifie la distance minimale
    let ok = true
    for (const p of samples) {
      if (Math.hypot(p.s - s, p.t - t) < radius) {
        ok = false
        break
      }
    }
    if (ok) {
      samples.push({ s, t })
    }

    // détend le rayon si l'on stagne
    if (attempts > N * 10 && samples.length < N) {
      attempts = 0
      radius *= 0.95
    }
  }

  // convertit (s,t) -> (x,z)
  for (let i = 0; i < N; i++) {
    const { s, t } = samples[i]
    const x = p0.x + nx * s + rx * t
    const z = p0.z + nz * s + rz * t
    positions[i * 3 + 0] = x
    positions[i * 3 + 1] = p0.y + 1
    positions[i * 3 + 2] = z
  }
  return positions
}

