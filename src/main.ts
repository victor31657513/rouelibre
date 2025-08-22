import * as THREE from 'three'
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
