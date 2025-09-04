import type { Vec3 } from './gpx'

/**
 * Initialise les positions des cyclistes sur le début du parcours sélectionné
 * en formant un peloton de 9 de front.
 */
export function initPeloton(path: Vec3[], N: number): Float32Array {
  const positions = new Float32Array(N * 3)
  if (path.length < 2) return positions

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

  for (let i = 0; i < N; i++) {
    const row = Math.floor(i / 9)
    const col = i % 9 - 4 // centré
    // les rangées sont placées en arrière de la ligne de départ
    const x = p0.x - nx * row * 1.2 + rx * col * 1.0
    const z = p0.z - nz * row * 1.2 + rz * col * 1.0
    positions[i * 3 + 0] = x
    positions[i * 3 + 1] = p0.y + 1
    positions[i * 3 + 2] = z
  }
  return positions
}
