import * as THREE from 'three'
import type { PathSpline } from '../route/pathSpline'

export interface SurfaceProfile {
  distances: Float32Array
  heights: Float32Array
  normals: Float32Array
}

export interface SurfaceSamplingOptions {
  /** Step in meters between two consecutive samples along the arc length. */
  step?: number
  /** Height in meters above the spline used as ray origin. */
  rayHeight?: number
}

/**
 * Samples the road mesh to retrieve surface height and normals along the
 * provided spline.
 */
export function sampleRoadSurfaceProfile(
  spline: PathSpline,
  roadMesh: THREE.Mesh,
  raycaster: THREE.Raycaster,
  options: SurfaceSamplingOptions = {},
): SurfaceProfile {
  const step = Math.max(0.1, options.step ?? 1)
  const rayHeight = Math.max(1, options.rayHeight ?? 30)
  const totalLength = Math.max(0, spline.totalLength)
  const sampleCount = Math.max(2, Math.ceil(totalLength / step) + 1)
  const distances = new Float32Array(sampleCount)
  const heights = new Float32Array(sampleCount)
  const normals = new Float32Array(sampleCount * 3)
  const down = new THREE.Vector3(0, -1, 0)
  const origin = new THREE.Vector3()
  const normal = new THREE.Vector3(0, 1, 0)
  const fallbackNormal = new THREE.Vector3(0, 1, 0)
  const previousNear = raycaster.near
  const previousFar = raycaster.far
  const raycasterWithFirstHit = raycaster as THREE.Raycaster & {
    firstHitOnly?: boolean
  }
  const previousFirstHit = raycasterWithFirstHit.firstHitOnly

  raycaster.near = 0
  raycaster.far = rayHeight + 5
  raycasterWithFirstHit.firstHitOnly = true

  for (let i = 0; i < sampleCount; i++) {
    const distance = i === sampleCount - 1 ? totalLength : Math.min(i * step, totalLength)
    const sample = spline.sampleByDistance(distance)
    origin.copy(sample.position)
    origin.y += rayHeight
    raycaster.set(origin, down)
    const [hit] = raycaster.intersectObject(roadMesh, false)

    distances[i] = distance
    if (hit) {
      heights[i] = hit.point.y
      if (hit.face?.normal) {
        normal.copy(hit.face.normal).transformDirection(roadMesh.matrixWorld)
      } else if ('normal' in hit && hit.normal instanceof THREE.Vector3) {
        normal.copy(hit.normal)
      } else {
        normal.copy(fallbackNormal)
      }
      normal.normalize()
    } else {
      heights[i] = sample.position.y
      normal.copy(fallbackNormal)
    }

    normals[i * 3 + 0] = normal.x
    normals[i * 3 + 1] = normal.y
    normals[i * 3 + 2] = normal.z
  }

  raycaster.near = previousNear
  raycaster.far = previousFar
  raycasterWithFirstHit.firstHitOnly = previousFirstHit

  return { distances, heights, normals }
}
