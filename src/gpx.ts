import * as THREE from 'three'

export type GPXPoint = { lat: number; lon: number; ele: number }
export type Vec3 = THREE.Vector3

export function parseGPX(xml: string): GPXPoint[] {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  const pts: GPXPoint[] = []
  const trkpts = Array.from(doc.getElementsByTagName('trkpt'))
  for (const pt of trkpts) {
    const lat = pt.getAttribute('lat')
    const lon = pt.getAttribute('lon')
    const ele = pt.getElementsByTagName('ele')[0]?.textContent
    if (lat && lon && ele) {
      pts.push({ lat: Number.parseFloat(lat), lon: Number.parseFloat(lon), ele: Number.parseFloat(ele) })
    }
  }
  return pts
}

export function projectToLocal(pts: GPXPoint[]): { path3D: Vec3[] } {
  if (pts.length === 0) return { path3D: [] }
  const R = 6371000
  const lat0 = (pts[0].lat * Math.PI) / 180
  const lon0 = (pts[0].lon * Math.PI) / 180
  const ele0 = pts[0].ele
  const path3D: Vec3[] = []
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
