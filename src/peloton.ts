import * as THREE from 'three'
import type { Vec3 } from './gpx'

export interface PelotonOptions {
  seed?: number
  spacing?: number
  laneWidth?: number
  roadWidth?: number
  margin?: number
}

/**
 * Initialise les positions des cyclistes en suivant la ligne médiane de la route
 * et en appliquant un décalage latéral borné à l'intérieur de la chaussée.
 */
export function initPeloton(
  path: Vec3[],
  N: number,
  options: PelotonOptions = {},
): Float32Array {
  const positions = new Float32Array(N * 3)
  if (path.length === 0 || N === 0) {
    return positions
  }

  const {
    spacing = 1.2,
    laneWidth = 1.0,
    roadWidth = 8.0,
    margin = 0.05,
  } = options

  const waypoints = path.map((point) => {
    if (point instanceof THREE.Vector3) {
      return point.clone()
    }
    return new THREE.Vector3(point.x, point.y, point.z)
  })

  const curve = new THREE.CatmullRomCurve3(waypoints, false)
  const totalLength = curve.getLength() || 1

  const nCols = Math.max(1, Math.floor(roadWidth / laneWidth))
  const maxOffset = Math.max(0, roadWidth / 2 - margin)

  let previousDirection = new THREE.Vector3(1, 0, 0)

  for (let i = 0; i < N; i++) {
    const leaderIndex = N - 1 - i
    const row = Math.floor(leaderIndex / nCols)
    const col = leaderIndex % nCols
    const longitudinal = row * spacing
    const maxDistance = totalLength
    const distance = Math.min(longitudinal, maxDistance)
    const u = distance / totalLength
    const center = curve.getPointAt(u)
    const tangent = curve.getTangentAt(u).normalize()

    const tangentXZ = new THREE.Vector3(tangent.x, 0, tangent.z)
    if (tangentXZ.lengthSq() < 1e-6) {
      tangentXZ.copy(previousDirection)
    } else {
      tangentXZ.normalize()
      previousDirection.copy(tangentXZ)
    }
    const normal = new THREE.Vector3(-tangentXZ.z, 0, tangentXZ.x)
    if (normal.lengthSq() > 0) {
      normal.normalize()
    }

    const centeredCol = col - (nCols - 1) / 2
    const baseOffset = centeredCol * laneWidth
    const offset = Math.max(-maxOffset, Math.min(maxOffset, baseOffset))

    const finalPosition = center.clone().addScaledVector(normal, offset)

    positions[i * 3 + 0] = finalPosition.x
    positions[i * 3 + 1] = finalPosition.y + 1
    positions[i * 3 + 2] = finalPosition.z
  }

  return positions
}

