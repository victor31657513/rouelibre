/**
 * Coordinates UI interactions, scene management and simulation updates.
 *
 * The controller glues together the domain modules while keeping the entry
 * point (`main.ts`) minimal. All DOM event binding and Three.js orchestration
 * lives here to avoid scattering side effects across the codebase.
 *
 * Extension: when introducing new UI panels or simulation controls add helper
 * methods here so the overall lifecycle remains centralised.
 */
import * as THREE from 'three'
import { APP_CONFIG, CAMERA_BOUNDS, CAMERA_CONTROL } from './config'
import { createSceneContext, type SceneContext } from '../domain/scene/sceneFactory'
import { CameraRig } from '../domain/camera/CameraRig'
import { PelotonSceneUpdater } from '../domain/simulation/PelotonSceneUpdater'
import { SimulationClient } from '../domain/simulation/SimulationClient'
import { initPeloton } from '../domain/simulation/peloton'
import { PathSpline, resamplePath } from '../domain/route/pathSpline'
import { elevationStats, simplifyPath } from '../domain/route/pathProcessing'
import { buildCenterDashes, buildRoadBounds, buildRoadMesh, buildStartLine } from '../domain/route/roadGeometry'
import { loadGPX } from '../domain/route/routeLoader'
import type { GPXPoint, Vec3 } from '../domain/route/gpx'
import { changeSelectedIndex, selectedIndex, setSelectedIndex } from '../domain/state/selection'
import { initRouteSelector } from '../ui/routeSelector'

interface DomRefs {
  canvas: HTMLCanvasElement
  loader: HTMLDivElement
  loaderProgress: HTMLProgressElement
  homeBtn: HTMLButtonElement
  startBtn: HTMLButtonElement
  pauseBtn: HTMLButtonElement
  resetBtn: HTMLButtonElement
  routeList: HTMLElement
}

type RoadAssets = {
  road?: THREE.Mesh
  markings?: THREE.Mesh
  startLine?: THREE.Mesh
  bounds?: THREE.LineSegments
}

export class AppController {
  private readonly dom: DomRefs
  private readonly scene: SceneContext
  private readonly cameraRig: CameraRig
  private readonly pelotonScene: PelotonSceneUpdater
  private readonly simulation: SimulationClient

  private currentPath: Vec3[] | null = null
  private simplifiedPath: Vec3[] | null = null
  private spline: PathSpline | null = null
  private pathData: Float32Array | null = null
  private positions = new Float32Array(APP_CONFIG.riderCount * 4)
  private roadReady = false
  private roadAssets: RoadAssets = {}

  private animating = false
  private lastTick = performance.now()
  private rotating = false
  private lastMiddleTime = 0
  private readonly mouse = new THREE.Vector2()

  constructor(dom: DomRefs) {
    this.dom = dom
    this.scene = createSceneContext(this.dom.canvas, {
      riderCount: APP_CONFIG.riderCount,
      cameraDistance: APP_CONFIG.camDistance,
      cameraHeight: APP_CONFIG.camHeight,
    })
    this.cameraRig = new CameraRig(this.scene.camera, {
      followOffset: new THREE.Vector3(0, APP_CONFIG.camHeight, -APP_CONFIG.camDistance),
    })
    this.pelotonScene = new PelotonSceneUpdater(this.scene.ridersMesh, this.scene.riderObjects, {
      laneWidth: APP_CONFIG.laneWidth,
      roadWidth: APP_CONFIG.roadWidth,
      margin: APP_CONFIG.roadMargin,
    })
    this.simulation = new SimulationClient((state) => this.onSimulationState(state))
    this.attachEventListeners()
  }

  /** Prepares the route selector UI and initial button states. */
  async initialize(): Promise<void> {
    this.dom.startBtn.disabled = true
    this.dom.pauseBtn.disabled = true
    this.dom.resetBtn.disabled = true
    await initRouteSelector('route-list', async (path, points, url) => {
      await this.loadRoute(url, { path3D: path, points })
    })
  }

  private attachEventListeners(): void {
    const { canvas, homeBtn, startBtn, pauseBtn, resetBtn } = this.dom

    homeBtn.addEventListener('click', () => {
      this.stopAnimation()
      canvas.classList.add('hidden')
      this.showRouteList()
      homeBtn.classList.add('hidden')
      startBtn.disabled = true
      pauseBtn.disabled = true
      resetBtn.disabled = true
    })

    startBtn.addEventListener('click', () => {
      this.startAnimation()
      startBtn.disabled = true
      startBtn.textContent = 'Start'
      pauseBtn.disabled = false
    })

    pauseBtn.addEventListener('click', () => {
      this.stopAnimation()
      startBtn.disabled = false
      startBtn.textContent = 'Reprendre'
      pauseBtn.disabled = true
    })

    resetBtn.addEventListener('click', () => {
      this.stopAnimation()
      this.resetPeloton()
      startBtn.disabled = false
      startBtn.textContent = 'Start'
      pauseBtn.disabled = true
    })

    canvas.addEventListener('mousedown', (event: MouseEvent) => {
      if (event.button === 1) {
        event.preventDefault()
        this.rotating = true
      }
    })

    addEventListener('mouseup', (event: MouseEvent) => {
      if (event.button === 1) {
        const now = performance.now()
        if (now - this.lastMiddleTime < 300) {
          if (this.currentPath) {
            this.cameraRig.restoreInitialPose()
          } else {
            this.cameraRig.resetYaw()
            this.focusSelected()
          }
        }
        this.lastMiddleTime = now
      }
      this.rotating = false
    })

    canvas.addEventListener('mouseleave', () => {
      this.rotating = false
    })

    canvas.addEventListener('mousemove', (event: MouseEvent) => {
      if (this.rotating) {
        this.cameraRig.addYaw(event.movementX * CAMERA_CONTROL.rotationSensitivity)
      }
    })

    canvas.addEventListener(
      'wheel',
      (event: WheelEvent) => {
        event.preventDefault()
        const camera = this.scene.camera
        camera.fov = THREE.MathUtils.clamp(
          camera.fov + event.deltaY * 0.05,
          CAMERA_BOUNDS.minFov,
          CAMERA_BOUNDS.maxFov,
        )
        camera.updateProjectionMatrix()
      },
      { passive: false },
    )

    canvas.addEventListener('click', (event) => this.handleCanvasClick(event))

    addEventListener('resize', () => {
      this.scene.resize(window.innerWidth, window.innerHeight)
    })

    document.addEventListener('keydown', (event) => this.handleKeydown(event))
  }

  private handleCanvasClick(event: MouseEvent): void {
    const rect = this.dom.canvas.getBoundingClientRect()
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    this.scene.raycaster.setFromCamera(this.mouse, this.scene.camera)
    const intersects = this.scene.raycaster.intersectObject(this.scene.ridersMesh)
    if (intersects.length && intersects[0].instanceId !== undefined) {
      setSelectedIndex(intersects[0].instanceId, APP_CONFIG.riderCount)
      this.focusSelected()
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    let delta = 0
    switch (event.key) {
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
    event.preventDefault()
    changeSelectedIndex(delta, APP_CONFIG.riderCount)
    this.cameraRig.update(0.016, [this.scene.riderObjects[selectedIndex]])
  }

  private async loadRoute(
    url: string,
    preloaded?: { path3D: Vec3[]; points: GPXPoint[] },
  ): Promise<void> {
    this.dom.loader.classList.add('flex')
    this.dom.loader.classList.remove('hidden')
    this.dom.loaderProgress.value = 0
    this.dom.canvas.classList.add('hidden')

    let path3D: Vec3[]
    let points: GPXPoint[]
    if (preloaded) {
      ;({ path3D, points } = preloaded)
      this.dom.loaderProgress.value = 100
    } else {
      const result = await loadGPX(url, (progress) => {
        this.dom.loaderProgress.value = progress
      })
      path3D = result.path3D
      points = result.points
    }

    this.hideRouteList()

    const simplified = simplifyPath(path3D, 1.0)
    const smoothed = resamplePath(simplified, 1.0)
    this.cameraRig.setInitialPose(smoothed, APP_CONFIG.camHeight, APP_CONFIG.camDistance)

    this.currentPath = smoothed
    this.simplifiedPath = simplified
    this.spline = new PathSpline(simplified)
    this.pelotonScene.setSpline(this.spline)

    this.rebuildRoute()
    if (!this.roadReady) return

    const { totalGain, totalLoss } = elevationStats(points)
    console.log(`D+ ${Math.round(totalGain)} m · D- ${Math.round(totalLoss)} m`)

    this.preparePeloton()

    this.dom.loader.classList.remove('flex')
    this.dom.loader.classList.add('hidden')
    this.dom.canvas.classList.remove('hidden')
    this.dom.homeBtn.classList.remove('hidden')
    this.dom.startBtn.disabled = false
    this.dom.startBtn.textContent = 'Start'
    this.dom.pauseBtn.disabled = true
    this.dom.resetBtn.disabled = false
  }

  private preparePeloton(): void {
    if (!this.currentPath || !this.spline || !this.simplifiedPath) return

    const pelotonPositions = initPeloton(this.currentPath, APP_CONFIG.riderCount, {
      seed: APP_CONFIG.rngSeed,
      spacing: APP_CONFIG.startSpacing,
      laneWidth: APP_CONFIG.laneWidth,
      roadWidth: APP_CONFIG.roadWidth,
      margin: APP_CONFIG.roadMargin,
    })

    const yawOffsets = new Float32Array(APP_CONFIG.riderCount)
    const yawRng = this.createMulberry(APP_CONFIG.rngSeed + 1)
    this.positions = new Float32Array(APP_CONFIG.riderCount * 4)

    const totalLength = this.spline.totalLength
    const yaw0 = Math.atan2(
      this.currentPath[1].x - this.currentPath[0].x,
      this.currentPath[1].z - this.currentPath[0].z,
    )

    for (let i = 0; i < APP_CONFIG.riderCount; i++) {
      const base = i * 4
      const sign = yawRng() < 0.5 ? -1 : 1
      const magnitude = 2 + yawRng() * 2
      const yawOffset = sign * magnitude * (Math.PI / 180)
      yawOffsets[i] = yawOffset

      const leaderIndex = APP_CONFIG.riderCount - 1 - i
      const row = Math.floor(leaderIndex / 9)
      let s = row * APP_CONFIG.startSpacing
      if (totalLength > 0) s = s % totalLength
      const sample = this.spline.sampleByDistance(s)
      const tangent = sample.tangent
      const right = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()
      const center = sample.position
      const x = pelotonPositions[i * 3 + 0]
      const y = pelotonPositions[i * 3 + 1]
      const z = pelotonPositions[i * 3 + 2]
      const t = (x - center.x) * right.x + (z - center.z) * right.z
      const h = y - center.y
      this.positions[base + 0] = s
      this.positions[base + 1] = t
      this.positions[base + 2] = h
      this.positions[base + 3] = yaw0 + yawOffset
    }

    const median = Math.floor(APP_CONFIG.riderCount / 2)
    setSelectedIndex(median, APP_CONFIG.riderCount)

    const pathArray = new Float32Array(this.simplifiedPath.length * 3)
    for (let i = 0; i < this.simplifiedPath.length; i++) {
      const p = this.simplifiedPath[i]
      pathArray[i * 3 + 0] = p.x
      pathArray[i * 3 + 1] = p.y
      pathArray[i * 3 + 2] = p.z
    }
    this.pathData = pathArray.slice()

    this.simulation.initialize({
      riderCount: APP_CONFIG.riderCount,
      positions: pelotonPositions.buffer,
      yaw: yawOffsets.buffer,
      path: pathArray.buffer,
      laneWidth: APP_CONFIG.laneWidth,
      roadWidth: APP_CONFIG.roadWidth,
      margin: APP_CONFIG.roadMargin,
    })

    this.pelotonScene.applyState(this.positions)
    this.scene.renderer.render(this.scene.scene, this.scene.camera)
    this.focusSelected()
  }

  private resetPeloton(): void {
    if (!this.currentPath || !this.pathData || !this.spline) return

    const pelotonPositions = initPeloton(this.currentPath, APP_CONFIG.riderCount, {
      seed: APP_CONFIG.rngSeed,
      spacing: APP_CONFIG.startSpacing,
      laneWidth: APP_CONFIG.laneWidth,
      roadWidth: APP_CONFIG.roadWidth,
      margin: APP_CONFIG.roadMargin,
    })

    const yawOffsets = new Float32Array(APP_CONFIG.riderCount)
    const yawRng = this.createMulberry(APP_CONFIG.rngSeed + 1)
    this.positions = new Float32Array(APP_CONFIG.riderCount * 4)
    const totalLength = this.spline.totalLength
    const yaw0 = Math.atan2(
      this.currentPath[1].x - this.currentPath[0].x,
      this.currentPath[1].z - this.currentPath[0].z,
    )

    for (let i = 0; i < APP_CONFIG.riderCount; i++) {
      const base = i * 4
      const sign = yawRng() < 0.5 ? -1 : 1
      const magnitude = 2 + yawRng() * 2
      const yawOffset = sign * magnitude * (Math.PI / 180)
      yawOffsets[i] = yawOffset

      const leaderIndex = APP_CONFIG.riderCount - 1 - i
      const row = Math.floor(leaderIndex / 9)
      let s = row * APP_CONFIG.startSpacing
      if (totalLength > 0) s = s % totalLength
      const sample = this.spline.sampleByDistance(s)
      const tangent = sample.tangent
      const right = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()
      const center = sample.position
      const x = pelotonPositions[i * 3 + 0]
      const y = pelotonPositions[i * 3 + 1]
      const z = pelotonPositions[i * 3 + 2]
      const t = (x - center.x) * right.x + (z - center.z) * right.z
      const h = y - center.y
      this.positions[base + 0] = s
      this.positions[base + 1] = t
      this.positions[base + 2] = h
      this.positions[base + 3] = yaw0 + yawOffset
    }

    const pathCopy = this.pathData.slice()
    this.simulation.initialize({
      riderCount: APP_CONFIG.riderCount,
      positions: pelotonPositions.buffer,
      yaw: yawOffsets.buffer,
      path: pathCopy.buffer,
      laneWidth: APP_CONFIG.laneWidth,
      roadWidth: APP_CONFIG.roadWidth,
      margin: APP_CONFIG.roadMargin,
    })

    this.pelotonScene.applyState(this.positions)
    this.cameraRig.restoreInitialPose()
    this.focusSelected()
    this.scene.renderer.render(this.scene.scene, this.scene.camera)
  }

  private rebuildRoute(): void {
    if (!this.currentPath) return

    const { scene } = this.scene
    if (this.roadAssets.road) scene.remove(this.roadAssets.road)
    if (this.roadAssets.markings) scene.remove(this.roadAssets.markings)
    if (this.roadAssets.startLine) scene.remove(this.roadAssets.startLine)
    if (this.roadAssets.bounds) scene.remove(this.roadAssets.bounds)

    const road = buildRoadMesh(this.currentPath, APP_CONFIG.roadWidth)
    const markings = buildCenterDashes(
      this.currentPath,
      APP_CONFIG.lineWidth,
      APP_CONFIG.dashLength,
      APP_CONFIG.gapLength,
    )
    const startLine = buildStartLine(
      this.currentPath,
      APP_CONFIG.roadWidth,
      APP_CONFIG.startLineOffset,
    )
    const bounds = buildRoadBounds(this.currentPath, APP_CONFIG.roadWidth)

    road.name = 'routeMesh'
    markings.name = 'centerMarkings'
    startLine.name = 'startLine'
    bounds.name = 'roadBounds'

    scene.add(road)
    scene.add(markings)
    scene.add(startLine)
    scene.add(bounds)

    this.roadAssets = { road, markings, startLine, bounds }
    this.pelotonScene.setRoadMesh(road)
    this.roadReady = true
    this.pelotonScene.applyState(this.positions)
  }

  private startAnimation(): void {
    if (!this.animating) {
      this.animating = true
      this.lastTick = performance.now()
      requestAnimationFrame(() => this.tick())
    }
  }

  private stopAnimation(): void {
    this.animating = false
  }

  private tick(): void {
    if (!this.animating) return
    const now = performance.now()
    const dt = Math.min(0.05, (now - this.lastTick) / 1000)
    this.lastTick = now

    this.cameraRig.update(dt, [this.scene.riderObjects[selectedIndex]], this.rotating)
    this.simulation.step(dt)
    this.scene.renderer.render(this.scene.scene, this.scene.camera)

    if (this.animating) requestAnimationFrame(() => this.tick())
  }

  private focusSelected(): void {
    this.cameraRig.focus([this.scene.riderObjects[selectedIndex]])
  }

  private onSimulationState(state: Float32Array): void {
    this.positions = state
    this.pelotonScene.applyState(this.positions)
  }

  private showRouteList(): void {
    this.dom.routeList.classList.remove('hidden')
  }

  private hideRouteList(): void {
    this.dom.routeList.classList.add('hidden')
  }

  private createMulberry(seed: number): () => number {
    return () => {
      seed += 0x6d2b79f5
      let t = seed
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }
}
