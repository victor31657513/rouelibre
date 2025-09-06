// src/main.ts
import * as THREE from 'three'
import pkg from '../package.json' assert { type: 'json' }
import './style.css'
import { parseGPX, projectToLocal, type GPXPoint, type Vec3 } from './gpx'
import { initRouteSelector } from './ui/routeSelector'
import { initPeloton } from './peloton'
import { resamplePath } from './systems/pathSmoothing'
import { selectedIndex, setSelectedIndex, changeSelectedIndex } from './selection'
import { StabilizedFollowCamera } from './camera/StabilizedFollowCamera'
import { projectOntoRoad } from './systems/adhesion'

const N = 184 // nombre de cyclistes
const RNG_SEED = 1234
const START_SPACING = 1.2
const LANE_WIDTH = 1.0
const CAM_DISTANCE = 10
const CAM_HEIGHT = 6
const ROAD_WIDTH = 8
const DASH_LENGTH = 2
const GAP_LENGTH = 10
const LINE_WIDTH = 0.15
const START_LINE_OFFSET = 1
const START_LINE_WIDTH = 0.3

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Renderer
const canvas = document.getElementById('app') as HTMLCanvasElement
const loaderEl = document.getElementById('loader') as HTMLDivElement
const loaderProgress = document.getElementById('loader-progress') as HTMLProgressElement
const homeBtn = document.getElementById('home-btn') as HTMLButtonElement
const startBtn = document.getElementById('start-btn') as HTMLButtonElement
const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement
const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement
let currentPath: Vec3[] | null = null
let pathData: Float32Array | null = null
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)


homeBtn.addEventListener('click', () => {
  stopAnimation()
  canvas.classList.add('hidden')
  showRouteList()
  homeBtn.classList.add('hidden')
  startBtn.disabled = true
  pauseBtn.disabled = true
  resetBtn.disabled = true
})

startBtn.addEventListener('click', () => {
  startAnimation()
  startBtn.disabled = true
  startBtn.textContent = 'Start'
  pauseBtn.disabled = false
})

pauseBtn.addEventListener('click', () => {
  stopAnimation()
  startBtn.disabled = false
  startBtn.textContent = 'Reprendre'
  pauseBtn.disabled = true
})

resetBtn.addEventListener('click', () => {
  stopAnimation()
  if (currentPath && pathData) {
    const pelotonPos = initPeloton(currentPath, N, {
      seed: RNG_SEED,
      spacing: START_SPACING,
      laneWidth: LANE_WIDTH,
      roadWidth: ROAD_WIDTH,
    })
    const yaw0 = Math.atan2(
      currentPath[1].x - currentPath[0].x,
      currentPath[1].z - currentPath[0].z
    )
    positions = new Float32Array(N * 4)
    const yawOffsets = new Float32Array(N)
    const yawRng = mulberry32(RNG_SEED + 1)
    for (let i = 0; i < N; i++) {
      const base = i * 4
      const sign = yawRng() < 0.5 ? -1 : 1
      const magnitude = 2 + yawRng() * 2 // 2-4°
      const yawOffset = sign * magnitude * (Math.PI / 180)
      yawOffsets[i] = yawOffset
      positions[base + 0] = pelotonPos[i * 3 + 0]
      positions[base + 1] = pelotonPos[i * 3 + 1]
      positions[base + 2] = pelotonPos[i * 3 + 2]
      positions[base + 3] = yaw0 + yawOffset
    }
    const pathCopy = pathData.slice()
    worker.postMessage(
      {
        type: 'init',
        payload: {
          N,
          positions: pelotonPos.buffer,
          yaw: yawOffsets.buffer,
          path: pathCopy.buffer,
        },
      },
      [pelotonPos.buffer, yawOffsets.buffer, pathCopy.buffer],
    )
    for (let i = 0; i < N; i++) {
      const base = i * 4
      const x = positions[base + 0]
      const y = positions[base + 1]
      const z = positions[base + 2]
      const yaw = positions[base + 3]
      const { position, quaternion } = roadMesh
        ? projectOntoRoad(x, y, z, yaw, roadMesh, raycaster)
        : { position: new THREE.Vector3(x, y, z), quaternion: tmp.quaternion }
      tmp.position.copy(position)
      tmp.quaternion.copy(quaternion)
      tmp.updateMatrix()
      riders.setMatrixAt(i, tmp.matrix)
      riderObjs[i].position.copy(tmp.position)
    }
    riders.instanceMatrix.needsUpdate = true
    focusSelected()
    renderer.render(scene, camera)
  }
  startBtn.disabled = false
  startBtn.textContent = 'Start'
  pauseBtn.disabled = true
})

// Scene & Camera
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x111318)
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 10, 26)
camera.lookAt(0, 0, 0)

// Stabilized follow camera
const followCam = new StabilizedFollowCamera(camera)
followCam.setFollowOffset(new THREE.Vector3(0, CAM_HEIGHT, -CAM_DISTANCE))


// Camera rotation with middle mouse
const ROT_SENSITIVITY = 0.005
let rotating = false
let yawOffset = 0
let lastMiddleTime = 0

canvas.addEventListener('mousedown', (e: MouseEvent) => {
  if (e.button === 1) {
    e.preventDefault()
    rotating = true
  }
})

addEventListener('mouseup', (e: MouseEvent) => {
  if (e.button === 1) {
    const now = performance.now()
    if (now - lastMiddleTime < 300) {
      yawOffset = 0
      focusSelected()
    }
    lastMiddleTime = now
  }
  rotating = false
})

canvas.addEventListener('mouseleave', () => {
  rotating = false
})

canvas.addEventListener('mousemove', (e: MouseEvent) => {
  if (rotating) {
    yawOffset += e.movementX * ROT_SENSITIVITY
  }
})

// Zoom
const minFov = 20
const maxFov = 100
canvas.addEventListener(
  'wheel',
  (e: WheelEvent) => {
    e.preventDefault()
    camera.fov = THREE.MathUtils.clamp(camera.fov + e.deltaY * 0.05, minFov, maxFov)
    camera.updateProjectionMatrix()
  },
  { passive: false }
)

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
let roadMesh: THREE.Mesh | null = null

// Instanced boxes (parallélépipèdes) pour les cyclistes
const bodyGeo = new THREE.BoxGeometry(2, 2, 0.7)
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x3aa6ff, metalness: 0.2, roughness: 0.7 })
const riders = new THREE.InstancedMesh(bodyGeo, bodyMat, N)
riders.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
scene.add(riders)

// Individual rider objects for camera tracking
const riderObjs: THREE.Object3D[] = Array.from({ length: N }, () => new THREE.Object3D())

// Matrices initiales (rangées en peloton 9 de front)
const tmp = new THREE.Object3D()
for (let i = 0; i < N; i++) {
  const row = Math.floor(i / 9)
  const col = i % 9
  tmp.position.set(-20 + row * 1.2, 1, -4 + col * 1.0)
  tmp.rotation.set(0, -Math.PI / 2, 0)
  tmp.updateMatrix()
  riders.setMatrixAt(i, tmp.matrix)
  riderObjs[i].position.copy(tmp.position)
}
riders.instanceMatrix.needsUpdate = true

// Worker de physique
const worker = new Worker(new URL('./physics/worker.ts', import.meta.url), { type: 'module' })

let positions = new Float32Array(N * 4)
let last = performance.now()
let animating = false

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

worker.onmessage = (e: MessageEvent) => {
  const { type, data } = e.data || {}
  if (type === 'state') {
    positions = new Float32Array(data)
    // applique positions -> matrices
    for (let i = 0; i < N; i++) {
      const base = i * 4
      const x = positions[base + 0]
      const y = positions[base + 1]
      const z = positions[base + 2]
      const yaw = positions[base + 3]
      const { position, quaternion } = roadMesh
        ? projectOntoRoad(x, y, z, yaw, roadMesh, raycaster)
        : { position: new THREE.Vector3(x, y, z), quaternion: tmp.quaternion }
      tmp.position.copy(position)
      tmp.quaternion.copy(quaternion)
      tmp.updateMatrix()
      riders.setMatrixAt(i, tmp.matrix)
      riderObjs[i].position.copy(position)
    }
    riders.instanceMatrix.needsUpdate = true
  }
}

// Resize
addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Boucle
function updateCamera(dt: number) {
  const prevQuat = camera.quaternion.clone()
  followCam.update(dt, [riderObjs[selectedIndex]])
  if (rotating) camera.quaternion.copy(prevQuat)
  const offsetQuat = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(0, yawOffset, 0, 'YXZ')
  )
  camera.quaternion.multiply(offsetQuat)
  ;(followCam as unknown as { _smoothedQuat: THREE.Quaternion })._smoothedQuat.copy(
    camera.quaternion
  )
}

function focusSelected() {
  followCam.snapTo([riderObjs[selectedIndex]])
}

function tick() {
  if (!animating) return
  const now = performance.now()
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now

  updateCamera(dt)

  // demande un step physique
  worker.postMessage({ type: 'step', payload: { dt } })

  renderer.render(scene, camera)
  if (animating) requestAnimationFrame(tick)
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect()
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(riders)
  if (intersects.length && intersects[0].instanceId !== undefined) {
    setSelectedIndex(intersects[0].instanceId, N)
    focusSelected()
  }
})

document.addEventListener('keydown', (e) => {
  let delta = 0
  switch (e.key) {
    case 'ArrowLeft':
      delta = -1
      break
    case 'ArrowRight':
      delta = 1
      break
    case 'ArrowUp':
      delta = -9
      break
    case 'ArrowDown':
      delta = 9
      break
    default:
      return
  }
  e.preventDefault()
  changeSelectedIndex(delta, N)
  updateCamera(0.016)
})

function startAnimation() {
  if (!animating) {
    animating = true
    last = performance.now()
    requestAnimationFrame(tick)
  }
}

function stopAnimation() {
  animating = false
}
// GPX loading and road rendering

async function loadGPX(url: string, onProgress: (p: number) => void): Promise<{ path3D: Vec3[]; points: GPXPoint[] }> {
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
  for (const c of chunks) {
    merged.set(c, offset)
    offset += c.length
  }
  if (!contentLength) onProgress(100)
  const xmlText = new TextDecoder().decode(merged)
  const points = parseGPX(xmlText)
  const { path3D } = projectToLocal(points)
  return { path3D, points }
}

function hideRouteList() {
  document.getElementById('route-list')?.classList.add('hidden')
}

export function showRouteList() {
  document.getElementById('route-list')?.classList.remove('hidden')
}

function rebuildRoute() {
  if (!currentPath) return
  removeIfPresent('routeMesh')
  removeIfPresent('centerMarkings')
  removeIfPresent('startLine')
  const road = buildRoadMesh(currentPath, ROAD_WIDTH)
  road.name = 'routeMesh'
  scene.add(road)
  roadMesh = road
  const markings = buildCenterDashes(currentPath, LINE_WIDTH, DASH_LENGTH, GAP_LENGTH)
  markings.name = 'centerMarkings'
  scene.add(markings)
  const start = buildStartLine(currentPath, ROAD_WIDTH, START_LINE_OFFSET)
  start.name = 'startLine'
  scene.add(start)
}

const versionEl = document.getElementById('version') as HTMLDivElement | null
if (versionEl) {
  versionEl.textContent = `v${pkg.version}`
}
initRouteSelector('route-list', async (_path3D, _points, url) => {
    loaderEl.classList.add('flex')
    loaderEl.classList.toggle('hidden', false)
    loaderProgress.value = 0
    canvas.classList.toggle('hidden', true)
    const { path3D, points } = await loadGPX(url, (p) => {
      loaderProgress.value = p
    })
    hideRouteList()
    const simplified = simplifyPath(path3D, 1.0)
    const smoothed = resamplePath(simplified, 1.0)
    const { totalGain, totalLoss } = elevationStats(points)
    currentPath = smoothed
    rebuildRoute()

    // initialise le peloton sur la route sélectionnée
  const pelotonPos = initPeloton(smoothed, N, {
    seed: RNG_SEED,
    spacing: START_SPACING,
    laneWidth: LANE_WIDTH,
    roadWidth: ROAD_WIDTH,
  })
  const yaw0 = Math.atan2(smoothed[1].x - smoothed[0].x, smoothed[1].z - smoothed[0].z)
  const yawOffsets = new Float32Array(N)
  const yawRng = mulberry32(RNG_SEED + 1)
  positions = new Float32Array(N * 4)
  for (let i = 0; i < N; i++) {
    const base = i * 4
    const sign = yawRng() < 0.5 ? -1 : 1
    const magnitude = 2 + yawRng() * 2
    const yawOffset = sign * magnitude * (Math.PI / 180)
    yawOffsets[i] = yawOffset
    positions[base + 0] = pelotonPos[i * 3 + 0]
    positions[base + 1] = pelotonPos[i * 3 + 1]
    positions[base + 2] = pelotonPos[i * 3 + 2]
    positions[base + 3] = yaw0 + yawOffset
  }

    const median = Math.floor(N / 2)
    setSelectedIndex(median, N)

  const pathArray = new Float32Array(simplified.length * 3)
    for (let i = 0; i < simplified.length; i++) {
      const p = simplified[i]
      pathArray[i * 3 + 0] = p.x
      pathArray[i * 3 + 1] = p.y
      pathArray[i * 3 + 2] = p.z
    }

  pathData = pathArray.slice()
  worker.postMessage(
    {
      type: 'init',
      payload: { N, positions: pelotonPos.buffer, yaw: yawOffsets.buffer, path: pathArray.buffer },
    },
    [pelotonPos.buffer, yawOffsets.buffer, pathArray.buffer],
  )
  for (let i = 0; i < N; i++) {
    const base = i * 4
    const x = positions[base + 0]
    const y = positions[base + 1]
    const z = positions[base + 2]
    const yaw = positions[base + 3]
    const { position, quaternion } = roadMesh
      ? projectOntoRoad(x, y, z, yaw, roadMesh, raycaster)
      : { position: new THREE.Vector3(x, y, z), quaternion: tmp.quaternion }
    tmp.position.copy(position)
    tmp.quaternion.copy(quaternion)
    tmp.updateMatrix()
    riders.setMatrixAt(i, tmp.matrix)
    riderObjs[i].position.copy(tmp.position)
  }
    riders.instanceMatrix.needsUpdate = true
    focusSelected()
    renderer.render(scene, camera)

    console.log(`D+ ${Math.round(totalGain)} m · D- ${Math.round(totalLoss)} m`)
    loaderEl.classList.remove('flex')
    loaderEl.classList.toggle('hidden', true)
    canvas.classList.toggle('hidden', false)
    homeBtn.classList.remove('hidden')
    startBtn.disabled = false
    startBtn.textContent = 'Start'
    pauseBtn.disabled = true
    resetBtn.disabled = false
  })


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

function simplifyPath(path: Vec3[], epsilon: number): Vec3[] {
  if (path.length < 3) return [...path]
  const keep = new Array(path.length).fill(false)
  keep[0] = keep[path.length - 1] = true
  const stack: Array<[number, number]> = [[0, path.length - 1]]

  const distXZ = (p: Vec3, a: Vec3, b: Vec3): number => {
    const x0 = p.x, z0 = p.z
    const x1 = a.x, z1 = a.z
    const x2 = b.x, z2 = b.z
    const dx = x2 - x1
    const dz = z2 - z1
    if (dx === 0 && dz === 0) return Math.hypot(x0 - x1, z0 - z1)
    const t = ((x0 - x1) * dx + (z0 - z1) * dz) / (dx * dx + dz * dz)
    const projx = x1 + t * dx
    const projz = z1 + t * dz
    return Math.hypot(x0 - projx, z0 - projz)
  }

  while (stack.length) {
    const [start, end] = stack.pop()!
    let maxDist = 0
    let index = -1
    for (let i = start + 1; i < end; i++) {
      const d = distXZ(path[i], path[start], path[end])
      if (d > maxDist) {
        maxDist = d
        index = i
      }
    }
    if (index !== -1 && maxDist > epsilon) {
      keep[index] = true
      stack.push([start, index], [index, end])
    }
  }

  const out: Vec3[] = []
  for (let i = 0; i < path.length; i++) if (keep[i]) out.push(path[i])
  return out
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

function buildStartLine(centerLine: Vec3[], width: number, offset: number): THREE.Mesh {
  if (centerLine.length < 2) return new THREE.Mesh()
  const a = centerLine[0]
  const b = centerLine[1]
  const dir = new THREE.Vector3(b.x - a.x, 0, b.z - a.z).normalize()
  const center = new THREE.Vector3(a.x, a.y + 0.02, a.z).add(dir.clone().multiplyScalar(offset))
  const geom = new THREE.BoxGeometry(width, 0.02, START_LINE_WIDTH)
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const mesh = new THREE.Mesh(geom, mat)
  mesh.position.copy(center)
  mesh.rotation.y = Math.atan2(dir.x, dir.z)
  return mesh
}

function removeIfPresent(name: string): void {
  const o = scene.getObjectByName(name)
  if (o) {
    if (name === 'routeMesh') roadMesh = null
    scene.remove(o)
  }
}
