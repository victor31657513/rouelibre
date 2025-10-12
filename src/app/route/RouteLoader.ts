import { computeElevationStats } from '../../domain/route/elevation'
import { parseGPX, projectToLocal, type GPXPoint, type RoutePoint } from '../../domain/route/gpx'
import { resamplePath } from '../../domain/route/pathSpline'
import { simplifyPath } from '../../domain/route/simplify'

/**
 * @fileoverview Loads GPX files and prepares the derived route artefacts used
 * across the application (simplified path, spline buffers, elevation stats).
 *
 * Extension: Cache responses by URL or support additional file formats by
 * branching inside `load` and keeping the return contract unchanged.
 */
export interface LoadedRoute {
  simplified: RoutePoint[]
  resampled: RoutePoint[]
  stats: { totalGain: number; totalLoss: number }
  originalPoints: GPXPoint[]
  pathBuffer: Float32Array
}

export type ProgressCallback = (progress: number) => void

export class RouteLoader {
  async load(url: string, onProgress: ProgressCallback): Promise<LoadedRoute> {
    const xmlText = await this.fetchWithProgress(url, onProgress)
    const points = parseGPX(xmlText)
    const { path3D } = projectToLocal(points)
    const simplified = simplifyPath(path3D, 1.0)
    const resampled = resamplePath(simplified, 1.0)
    const stats = computeElevationStats(points)

    const pathBuffer = new Float32Array(simplified.length * 3)
    for (let i = 0; i < simplified.length; i++) {
      const point = simplified[i]
      pathBuffer[i * 3 + 0] = point.x
      pathBuffer[i * 3 + 1] = point.y
      pathBuffer[i * 3 + 2] = point.z
    }

    return { simplified, resampled, stats, originalPoints: points, pathBuffer }
  }

  private async fetchWithProgress(url: string, onProgress: ProgressCallback): Promise<string> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Impossible de charger ${url}`)
    }

    const contentLength = Number(response.headers.get('Content-Length')) || 0
    const reader = response.body?.getReader()
    if (!reader) {
      onProgress(100)
      return await response.text()
    }

    const chunks: Uint8Array[] = []
    let received = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) {
        chunks.push(value)
        received += value.length
        if (contentLength) {
          onProgress(Math.round((received / contentLength) * 100))
        }
      }
    }

    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
    const merged = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of chunks) {
      merged.set(chunk, offset)
      offset += chunk.length
    }
    if (!contentLength) onProgress(100)
    return new TextDecoder().decode(merged)
  }
}
