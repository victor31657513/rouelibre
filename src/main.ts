// src/main.ts
import * as THREE from 'three'

const N = 184 // nombre de cyclistes

// Renderer
const canvas = document.getElementById('app') as HTMLCanvasElement
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)

// Scene & Camera
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x111318)
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 10, 26)
camera.lookAt(0, 0, 0)

// Lights
const hemi = new THREE.HemisphereLight(0xffffff, 0x222244, 0.9)
scene.add(hemi)
const dir = new THREE.DirectionalLight(0xffffff, 0.8)
dir.position.set(10, 20, 10)
scene.add(dir)

// Ground
const groundGeo = new THREE.PlaneGeometry(200, 40)
const groundMat = new THREE.MeshStandardMaterial({ color: 0x1f232b, roughness: 1 })
const ground = new THREE.Mesh(groundGeo, groundMat)
ground.rotation.x = -Math.PI / 2
scene.add(ground)

// Instanced boxes (parallélépipèdes) pour les cyclistes
const bodyGeo = new THREE.BoxGeometry(0.5, 1.7, 1.0)
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x3aa6ff, metalness: 0.2, roughness: 0.7 })
const riders = new THREE.InstancedMesh(bodyGeo, bodyMat, N)
riders.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
scene.add(riders)

// Matrices initiales (rangées en peloton 9 de front)
const tmp = new THREE.Object3D()
for (let i = 0; i < N; i++) {
  const row = Math.floor(i / 9)
  const col = i % 9
  tmp.position.set(-20 + row * 1.2, 0.85, -4 + col * 1.0)
  tmp.rotation.set(0, 0, 0)
  tmp.updateMatrix()
  riders.setMatrixAt(i, tmp.matrix)
}
riders.instanceMatrix.needsUpdate = true

// Worker de physique
const worker = new Worker(new URL('./physics/worker.ts', import.meta.url), { type: 'module' })

let positions = new Float32Array(N * 3)
let last = performance.now()

worker.onmessage = (e: MessageEvent) => {
  const { type, data } = e.data || {}
  if (type === 'state') {
    positions = new Float32Array(data)
    // applique positions -> matrices
    for (let i = 0; i < N; i++) {
      const x = positions[i * 3 + 0]
      const y = positions[i * 3 + 1]
      const z = positions[i * 3 + 2]
      tmp.position.set(x, y, z)
      tmp.rotation.set(0, 0, 0)
      tmp.updateMatrix()
      riders.setMatrixAt(i, tmp.matrix)
    }
    riders.instanceMatrix.needsUpdate = true
  }
}

// Envoi init avec positions de départ
const initialPositions = new Float32Array(N * 3)
for (let i = 0; i < N; i++) {
  const row = Math.floor(i / 9)
  const col = i % 9
  initialPositions[i * 3 + 0] = -20 + row * 1.2
  initialPositions[i * 3 + 1] = 0.85
  initialPositions[i * 3 + 2] = -4 + col * 1.0
}
worker.postMessage({ type: 'init', payload: { N, positions: initialPositions.buffer } }, [initialPositions.buffer])

// Resize
addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Boucle
function tick() {
  const now = performance.now()
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now

  // demande un step physique
  worker.postMessage({ type: 'step', payload: { dt } })

  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

requestAnimationFrame(tick)
// GPX loading and road rendering

// Types
export type GPXPoint = { lat: number; lon: number; ele: number }
export type Vec3 = THREE.Vector3

const gpxInput = document.getElementById('gpx') as HTMLInputElement | null

gpxInput?.addEventListener('change', async () => {
  const file = gpxInput.files?.[0]
  if (!file) return
  const xmlText = await file.text()

  const points = parseGPX(xmlText)
  const { path3D } = projectToLocal(points)
  const { totalGain, totalLoss } = elevationStats(points)

  removeIfPresent('routeMesh')
  removeIfPresent('centerMarkings')

  const road = buildRoadMesh(path3D, 6)
  road.name = 'routeMesh'
  scene.add(road)

  const markings = buildCenterDashes(path3D, 0.2, 3, 5)
  markings.name = 'centerMarkings'
  scene.add(markings)

  console.log(`D+ ${Math.round(totalGain)} m · D- ${Math.round(totalLoss)} m`)
})

function parseGPX(xml: string): GPXPoint[] {
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

function projectToLocal(pts: GPXPoint[]): { path3D: Vec3[] } {
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

function elevationStats(pts: GPXPoint[]): { totalGain: number; totalLoss: number } {
  let totalGain = 0
  let totalLoss = 0
  for (let i = 1; i < pts.length; i++) {
    const diff = pts[i].ele - pts[i - 1].ele
    if (diff > 0) totalGain += diff
    else totalLoss -= diff
  }
  return { totalGain, totalLoss }
}

function buildRoadMesh(centerLine: Vec3[], width: number): THREE.Mesh {
  const positions: number[] = []
  const indices: number[] = []
  const half = width / 2
  const up = new THREE.Vector3(0, 1, 0)
  for (let i = 0; i < centerLine.length; i++) {
    const curr = centerLine[i]
    const prev = centerLine[i - 1] ?? curr
    const next = centerLine[i + 1] ?? curr
    const dir = next.clone().sub(prev).setY(0).normalize()
    const right = new THREE.Vector3().crossVectors(dir, up).normalize()
    const leftPt = curr.clone().addScaledVector(right, -half)
    const rightPt = curr.clone().addScaledVector(right, half)
    positions.push(leftPt.x, leftPt.y, leftPt.z, rightPt.x, rightPt.y, rightPt.z)
    if (i < centerLine.length - 1) {
      const b = i * 2
      indices.push(b, b + 1, b + 3, b, b + 3, b + 2)
    }
  }
  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geom.setIndex(indices)
  geom.computeVertexNormals()
  const mat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 })
  return new THREE.Mesh(geom, mat)
}

function buildCenterDashes(centerLine: Vec3[], lineWidth: number, dashLen: number, gapLen: number): THREE.Mesh {
  const positions: number[] = []
  const indices: number[] = []
  const up = new THREE.Vector3(0, 1, 0)
  const half = lineWidth / 2
  let idx = 0
  for (let i = 0; i < centerLine.length - 1; i++) {
    const a = centerLine[i]
    const b = centerLine[i + 1]
    const segVec = b.clone().sub(a)
    const segLen = segVec.length()
    const dir = segVec.clone().normalize()
    const right = new THREE.Vector3().crossVectors(dir, up).normalize()
    for (let d = 0; d < segLen; d += dashLen + gapLen) {
      const start = d
      const end = Math.min(segLen, d + dashLen)
      const p0 = a.clone().addScaledVector(dir, start)
      const p1 = a.clone().addScaledVector(dir, end)
      const left0 = p0.clone().addScaledVector(right, -half).setY(p0.y + 0.01)
      const right0 = p0.clone().addScaledVector(right, half).setY(p0.y + 0.01)
      const left1 = p1.clone().addScaledVector(right, -half).setY(p1.y + 0.01)
      const right1 = p1.clone().addScaledVector(right, half).setY(p1.y + 0.01)
      positions.push(left0.x, left0.y, left0.z, right0.x, right0.y, right0.z, left1.x, left1.y, left1.z, right1.x, right1.y, right1.z)
      indices.push(idx, idx + 1, idx + 3, idx, idx + 3, idx + 2)
      idx += 4
    }
  }
  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geom.setIndex(indices)
  geom.computeVertexNormals()
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff })
  return new THREE.Mesh(geom, mat)
}

function removeIfPresent(name: string): void {
  const o = scene.getObjectByName(name)
  if (o) scene.remove(o)
}
