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
