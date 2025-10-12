import * as THREE from 'three'

/**
 * @fileoverview Utilities to parse GPX content and project it into the local
 * 3D coordinate system used by the simulation.
 *
 * Extension: Add support for waypoints or metadata by extending the returned
 * structures; the projection contract only relies on the array of `RoutePoint`s.
 */
export interface GPXPoint {
  lat: number
  lon: number
  ele: number
}

/** Alias used through the app for 3D coordinates along the route. */
export type RoutePoint = THREE.Vector3

/** Parses a GPX XML string and extracts the track points as numeric tuples. */
export function parseGPX(xml: string): GPXPoint[] {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  const pts: GPXPoint[] = []
  const trkpts = Array.from(doc.getElementsByTagName('trkpt'))
  for (const pt of trkpts) {
    const lat = pt.getAttribute('lat')
    const lon = pt.getAttribute('lon')
    const ele = pt.getElementsByTagName('ele')[0]?.textContent
    if (lat && lon && ele) {
      pts.push({
        lat: Number.parseFloat(lat),
        lon: Number.parseFloat(lon),
        ele: Number.parseFloat(ele),
      })
    }
  }
  return pts
}

/**
 * Projects the geographic GPX coordinates into the simulation local frame.
 * Returns an array of Vector3 positioned around the first track point.
 */
export function projectToLocal(pts: GPXPoint[]): { path3D: RoutePoint[] } {
  if (pts.length === 0) return { path3D: [] }
  const R = 6_371_000
  const lat0 = (pts[0].lat * Math.PI) / 180
  const lon0 = (pts[0].lon * Math.PI) / 180
  const ele0 = pts[0].ele
  const path3D: RoutePoint[] = []
  for (const p of pts) {
    const lat = (p.lat * Math.PI) / 180
    const lon = (p.lon * Math.PI) / 180
    const x = (lon - lon0) * Math.cos(lat0) * R
    const z = (lat - lat0) * R
    const y = p.ele - ele0
    path3D.push(new THREE.Vector3(x, y, z))
  }
  return { path3D }
}
