/**
 * Streaming utilities for retrieving and decoding GPX assets.
 *
 * The exported helpers isolate network and decoding concerns away from the UI
 * layer so tests can mock them easily.
 *
 * Extension: When supporting alternative formats (e.g. FIT files) introduce
 * new loader functions here that share the same return signature.
 */
import { parseGPX, projectToLocal, type GPXPoint, type Vec3 } from './gpx'

export interface GPXLoadResult {
  path3D: Vec3[]
  points: GPXPoint[]
}

/**
 * Downloads a GPX file and converts it to local coordinates while reporting
 * progress through the provided callback.
 *
 * @param url Absolute or public-path-relative URL of the GPX resource.
 * @param onProgress Callback receiving completion percentage (0-100).
 * @returns The parsed samples along with their projected path.
 *
 * Side effects: performs network requests and parses XML, no DOM mutation.
 * Extension: To add caching, wrap this function and delegate to the existing
 * implementation before storing the result.
 */
export async function loadGPX(
  url: string,
  onProgress: (percent: number) => void,
): Promise<GPXLoadResult> {
  const res = await fetch(url)
  const contentLength = Number(res.headers.get('Content-Length')) || 0
  const reader = res.body?.getReader()
  const chunks: Uint8Array[] = []
  let received = 0

  while (true) {
    const { done, value } = await reader!.read()
    if (done) break
    if (value) {
      chunks.push(value)
      received += value.length
      if (contentLength) {
        onProgress(Math.round((received / contentLength) * 100))
      }
    }
  }

  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0)
  const merged = new Uint8Array(totalLength)
  let offset = 0
  for (const chunk of chunks) {
    merged.set(chunk, offset)
    offset += chunk.length
  }

  if (!contentLength) onProgress(100)

  const xmlText = new TextDecoder().decode(merged)
  const points = parseGPX(xmlText)
  const { path3D } = projectToLocal(points)
  return { path3D, points }
}
