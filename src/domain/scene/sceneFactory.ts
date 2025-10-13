/**
 * Provides a single entry point to assemble the Three.js scene used throughout
 * the application.
 *
 * The factory keeps all scene level resources (lights, ground plane, rider
 * instances) together so other modules can simply consume the returned
 * {@link SceneContext} without worrying about construction details.
 *
 * Extension: add new environment props (trees, crowd, etc.) by extending this
 * factory. Keep the returned interface backward compatible to avoid rippling
 * changes.
 */
import * as THREE from 'three'

export interface SceneContext {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  ridersMesh: THREE.InstancedMesh
  riderObjects: THREE.Object3D[]
  raycaster: THREE.Raycaster
  resize(width: number, height: number): void
}

export interface SceneOptions {
  riderCount: number
  cameraHeight: number
  cameraDistance: number
}

/**
 * Creates the Three.js renderer, camera and base scene used for the simulation
 * visualisation.
 *
 * @param canvas Target canvas element controlled by Vite.
 * @param options Numeric parameters defining the initial layout.
 * @returns A context aggregating all reusable scene assets.
 */
export function createSceneContext(
  canvas: HTMLCanvasElement,
  options: SceneOptions,
): SceneContext {
  const { riderCount, cameraDistance, cameraHeight } = options

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x111318)

  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, cameraHeight, cameraDistance + cameraHeight)
  camera.lookAt(0, 0, 0)

  // Lighting
  const hemi = new THREE.HemisphereLight(0xffffff, 0x222244, 0.9)
  scene.add(hemi)
  const dir = new THREE.DirectionalLight(0xffffff, 0.8)
  dir.position.set(10, 20, 10)
  scene.add(dir)

  // Instanced riders + helper objects for camera tracking
  const bodyGeo = new THREE.BoxGeometry(2, 2, 0.7)
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x3aa6ff, metalness: 0.2, roughness: 0.7 })
  const ridersMesh = new THREE.InstancedMesh(bodyGeo, bodyMat, riderCount)
  ridersMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  ridersMesh.frustumCulled = false
  scene.add(ridersMesh)

  const riderObjects: THREE.Object3D[] = Array.from({ length: riderCount }, () => new THREE.Object3D())
  const temp = new THREE.Object3D()
  for (let i = 0; i < riderCount; i++) {
    const leaderIndex = riderCount - 1 - i
    const row = Math.floor(leaderIndex / 9)
    const col = leaderIndex % 9
    temp.position.set(-20 + row * 1.2, 1, -4 + col * 1.0)
    temp.rotation.set(0, -Math.PI / 2, 0)
    temp.updateMatrix()
    ridersMesh.setMatrixAt(i, temp.matrix)
    riderObjects[i].position.copy(temp.position)
  }
  ridersMesh.instanceMatrix.needsUpdate = true

  const raycaster = new THREE.Raycaster()

  return {
    scene,
    camera,
    renderer,
    ridersMesh,
    riderObjects,
    raycaster,
    resize: (width: number, height: number) => {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    },
  }
}
