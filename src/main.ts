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

const N = 184 // nombre de cyclistes

// Renderer
const canvas = document.getElementById('app') as HTMLCanvasElement
const loaderEl = document.getElementById('loader') as HTMLDivElement
const loaderProgress = document.getElementById('loader-progress') as HTMLDivElement
const homeBtn = document.getElementById('home-btn') as HTMLButtonElement
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)


homeBtn.addEventListener('click', () => {
  stopAnimation()
  canvas.classList.add('hidden')
  showRouteList()
  homeBtn.classList.add('hidden')
})

// Scene & Camera
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x111318)
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 10, 26)
camera.lookAt(0, 0, 0)

// Stabilized follow camera
const followCam = new StabilizedFollowCamera(camera)


// Camera rotation with middle mouse
let rotating = false
let lastX = 0
let yawOffset = 0
let lastMiddleTime = 0

canvas.addEventListener('mousedown', (e: MouseEvent) => {
  if (e.button === 1) {
    e.preventDefault()
    rotating = true
    lastX = e.clientX
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
    rotating = false
  }
})

canvas.addEventListener('mousemove', (e: MouseEvent) => {
  if (rotating) {
    const dx = e.clientX - lastX
    yawOffset += dx * 0.002
    lastX = e.clientX
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

function initCameraUI(cam: StabilizedFollowCamera): void {
  const root = document.getElementById('ui-root')
  if (!root) return
  const panel = document.createElement('div')
  panel.className =
    'absolute top-4 right-4 bg-gray-800/70 text-white p-2 rounded pointer-events-auto space-y-1'
  panel.innerHTML = `
    <label class="flex items-center gap-2 text-xs">Deadzone
      <input id="deadzone" type="range" min="0" max="30" value="${cam.deadzoneDeg}" class="w-24" />
      <span id="deadzoneVal">${cam.deadzoneDeg}</span>
    </label>
    <label class="flex items-center gap-2 text-xs">Damping
      <input id="damping" type="range" min="1" max="20" value="${cam.posDamping}" class="w-24" />
      <span id="dampingVal">${cam.posDamping}</span>
    </label>
    <label class="flex items-center gap-2 text-xs">Bypass
      <input id="bypass" type="range" min="0" max="1" step="0.01" value="${cam.chicaneBypassWeight}" class="w-24" />
      <span id="bypassVal">${cam.chicaneBypassWeight}</span>
    </label>
  `
  root.appendChild(panel)
  const deadzoneInput = panel.querySelector('#deadzone') as HTMLInputElement
  const dampingInput = panel.querySelector('#damping') as HTMLInputElement
  const bypassInput = panel.querySelector('#bypass') as HTMLInputElement
  const deadzoneVal = panel.querySelector('#deadzoneVal') as HTMLSpanElement
  const dampingVal = panel.querySelector('#dampingVal') as HTMLSpanElement
  const bypassVal = panel.querySelector('#bypassVal') as HTMLSpanElement
  deadzoneInput.addEventListener('input', () => {
    const v = parseFloat(deadzoneInput.value)
    cam.setDeadzoneDeg(v)
    deadzoneVal.textContent = v.toFixed(1)
  })
  dampingInput.addEventListener('input', () => {
    const v = parseFloat(dampingInput.value)
    cam.setPosDamping(v)
    dampingVal.textContent = v.toFixed(1)
  })
  bypassInput.addEventListener('input', () => {
    const v = parseFloat(bypassInput.value)
    cam.setChicaneBypassWeight(v)
    bypassVal.textContent = v.toFixed(2)
  })
}

initCameraUI(followCam)

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
      tmp.position.set(x, y, z)
      tmp.rotation.set(0, yaw - Math.PI / 2, 0)
      tmp.updateMatrix()
      riders.setMatrixAt(i, tmp.matrix)
      riderObjs[i].position.set(x, y, z)
    }
    riders.instanceMatrix.needsUpdate = true
    if (!animating) startAnimation()
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
  followCam.update(dt, [riderObjs[selectedIndex]])
  const offsetQuat = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(0, yawOffset, 0, 'YXZ')
  )
  camera.quaternion.multiply(offsetQuat)
  ;(followCam as unknown as { _smoothedQuat: THREE.Quaternion })._smoothedQuat.copy(
    camera.quaternion
  )
}

function focusSelected() {
  updateCamera(0.016)
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

const ROAD_WIDTH = 8
const DASH_LENGTH = 2
const GAP_LENGTH = 10
const LINE_WIDTH = 0.15

let currentPath: Vec3[] | null = null

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
  const road = buildRoadMesh(currentPath, ROAD_WIDTH)
  road.name = 'routeMesh'
  scene.add(road)
  const markings = buildCenterDashes(currentPath, LINE_WIDTH, DASH_LENGTH, GAP_LENGTH)
  markings.name = 'centerMarkings'
  scene.add(markings)
}

document.addEventListener('DOMContentLoaded', () => {
  const versionEl = document.getElementById('version') as HTMLDivElement | null
  if (versionEl) {
    versionEl.textContent = `v${pkg.version}`
  }
  initRouteSelector('route-list', async (_path3D, _points, url) => {
    loaderEl.classList.add('flex')
    loaderEl.classList.toggle('hidden', false)
    loaderProgress.style.width = '0%'
    canvas.classList.toggle('hidden', true)
    const { path3D, points } = await loadGPX(url, (p) => {
      loaderProgress.style.width = `${p}%`
    })
    hideRouteList()
    const simplified = simplifyPath(path3D, 1.0)
    const smoothed = resamplePath(simplified, 1.0)
    const { totalGain, totalLoss } = elevationStats(points)
    currentPath = smoothed
    rebuildRoute()

    // initialise le peloton sur la route sélectionnée
    const pelotonPos = initPeloton(smoothed, N)
    positions = new Float32Array(N * 4)
    for (let i = 0; i < N; i++) {
      positions[i * 4 + 0] = pelotonPos[i * 3 + 0]
      positions[i * 4 + 1] = pelotonPos[i * 3 + 1]
      positions[i * 4 + 2] = pelotonPos[i * 3 + 2]
      positions[i * 4 + 3] = 0
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

    worker.postMessage(
      { type: 'init', payload: { N, positions: pelotonPos.buffer, path: pathArray.buffer } },
      [pelotonPos.buffer, pathArray.buffer]
    )
    for (let i = 0; i < N; i++) {
      const base = i * 4
      const x = positions[base + 0]
      const y = positions[base + 1]
      const z = positions[base + 2]
      tmp.position.set(x, y, z)
      tmp.rotation.set(0, 0, 0)
      tmp.updateMatrix()
      riders.setMatrixAt(i, tmp.matrix)
      riderObjs[i].position.copy(tmp.position)
    }
    riders.instanceMatrix.needsUpdate = true
    focusSelected()

    console.log(`D+ ${Math.round(totalGain)} m · D- ${Math.round(totalLoss)} m`)
    loaderEl.classList.remove('flex')
    loaderEl.classList.toggle('hidden', true)
    canvas.classList.toggle('hidden', false)
    homeBtn.classList.remove('hidden')
  })
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

function removeIfPresent(name: string): void {
  const o = scene.getObjectByName(name)
  if (o) scene.remove(o)
}
