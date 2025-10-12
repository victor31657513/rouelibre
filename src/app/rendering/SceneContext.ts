import * as THREE from 'three'
import { StabilizedFollowCamera } from '../../camera/StabilizedFollowCamera'

/**
 * @fileoverview Centralises Three.js scene setup and shared resources.
 * Creates the renderer, camera, lighting and rider instancing objects used by
 * other controllers. Keeping this logic together makes it easier to adjust the
 * render pipeline without touching simulation code.
 *
 * Extension: Add post-processing by exposing the renderer or by returning
 * additional scene graph nodes from this module.
 */
export class SceneContext {
  readonly scene: THREE.Scene
  readonly camera: THREE.PerspectiveCamera
  readonly renderer: THREE.WebGLRenderer
  readonly followCamera: StabilizedFollowCamera
  readonly riderMesh: THREE.InstancedMesh
  readonly riderObjects: THREE.Object3D[]

  constructor(canvas: HTMLCanvasElement, riderCount: number) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x111318)

    this.camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )
    this.camera.position.set(0, 10, 26)
    this.camera.lookAt(0, 0, 0)

    this.followCamera = new StabilizedFollowCamera(this.camera)

    this.setupLighting()
    this.createGround()

    const bodyGeo = new THREE.BoxGeometry(2, 2, 0.7)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x3aa6ff,
      metalness: 0.2,
      roughness: 0.7,
    })
    this.riderMesh = new THREE.InstancedMesh(bodyGeo, bodyMat, riderCount)
    this.riderMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.riderMesh.frustumCulled = false
    this.scene.add(this.riderMesh)

    this.riderObjects = Array.from({ length: riderCount }, () => new THREE.Object3D())
  }

  /** Renders the current scene from the stored perspective camera. */
  render(): void {
    this.renderer.render(this.scene, this.camera)
  }

  /** Updates renderer and camera projection when the viewport changes. */
  updateSize(width = window.innerWidth, height = window.innerHeight): void {
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  /**
   * Fills the instanced mesh with a temporary formation while the worker warms up.
   * Useful when the application boots before a route has been loaded.
   */
  seedRiderFormation(): void {
    const temp = new THREE.Object3D()
    for (let i = 0; i < this.riderMesh.count; i++) {
      const leaderIndex = this.riderMesh.count - 1 - i
      const row = Math.floor(leaderIndex / 9)
      const col = leaderIndex % 9
      temp.position.set(-20 + row * 1.2, 1, -4 + col * 1.0)
      temp.rotation.set(0, -Math.PI / 2, 0)
      temp.updateMatrix()
      this.riderMesh.setMatrixAt(i, temp.matrix)
      this.riderObjects[i].position.copy(temp.position)
    }
    this.riderMesh.instanceMatrix.needsUpdate = true
  }

  private setupLighting(): void {
    const hemi = new THREE.HemisphereLight(0xffffff, 0x222244, 0.9)
    this.scene.add(hemi)
    const dir = new THREE.DirectionalLight(0xffffff, 0.8)
    dir.position.set(10, 20, 10)
    this.scene.add(dir)
  }

  private createGround(): void {
    const groundGeo = new THREE.PlaneGeometry(200, 40)
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x1f232b, roughness: 1 })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    this.scene.add(ground)
  }
}
