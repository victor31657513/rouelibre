import * as THREE from 'three'
import pkg from '../package.json' assert { type: 'json' }
import { CameraController } from './camera/CameraController'
import { SIMULATION_CONFIG, ROAD_CONFIG } from './config'
import { RouteLoader } from './route/RouteLoader'
import { RouteListController } from './route/RouteListController'
import { SceneContext } from './rendering/SceneContext'
import { RiderInstances } from './rendering/RiderInstances'
import { RouteVisuals } from './rendering/RouteVisuals'
import { SimulationBridge } from './simulation/SimulationBridge'
import { RouteState } from './state/RouteState'
import { SelectionState } from './state/selectionState'
import { LoaderOverlay } from './ui/LoaderOverlay'
import { PlaybackControls } from './ui/PlaybackControls'
import { initPeloton } from '../domain/peloton/formation'

/**
 * @fileoverview High level application orchestrator wiring all controllers.
 * Manages route loading, physics simulation and UI interactions while keeping
 * individual components decoupled and reusable.
 *
 * Extension: Compose this class with a router or state machine if additional
 * screens are introduced. The current implementation focuses on the GPX viewer
 * lifecycle only.
 */
export class Application {
  private readonly canvas: HTMLCanvasElement
  private readonly routeList: HTMLElement
  private readonly scene: SceneContext
  private readonly routeVisuals: RouteVisuals
  private readonly riderInstances: RiderInstances
  private readonly cameraController: CameraController
  private readonly selection = new SelectionState()
  private readonly routeState = new RouteState()
  private readonly loaderOverlay: LoaderOverlay
  private readonly playbackControls: PlaybackControls
  private readonly routeLoader = new RouteLoader()
  private readonly raycaster = new THREE.Raycaster()
  private readonly mouse = new THREE.Vector2()
  private readonly yawOffsets = new Float32Array(SIMULATION_CONFIG.riderCount)
  private readonly simulation: SimulationBridge
  private readonly routeListController: RouteListController

  private animating = false
  private lastFrame = performance.now()

  constructor() {
    const canvas = document.getElementById('app') as HTMLCanvasElement | null
    const loaderEl = document.getElementById('loader') as HTMLDivElement | null
    const progressEl = document.getElementById('loader-progress') as HTMLProgressElement | null
    const homeBtn = document.getElementById('home-btn') as HTMLButtonElement | null
    const startBtn = document.getElementById('start-btn') as HTMLButtonElement | null
    const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement | null
    const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement | null
    const routeList = document.getElementById('route-list')

    if (!canvas || !loaderEl || !progressEl || !homeBtn || !startBtn || !pauseBtn || !resetBtn || !routeList) {
      throw new Error('Impossible d\'initialiser l\'interface utilisateur')
    }

    this.canvas = canvas
    this.routeList = routeList
    this.scene = new SceneContext(canvas, SIMULATION_CONFIG.riderCount)
    this.routeVisuals = new RouteVisuals(this.scene.scene)
    this.riderInstances = new RiderInstances(this.scene.riderMesh, this.scene.riderObjects)
    this.cameraController = new CameraController(this.scene)
    this.loaderOverlay = new LoaderOverlay(loaderEl, progressEl)
    this.playbackControls = new PlaybackControls(startBtn, pauseBtn, resetBtn, homeBtn)
    this.routeListController = new RouteListController('route-list', (_path, _points, url) => {
      void this.prepareRoute(url)
    })

    this.simulation = new SimulationBridge((state) => this.handleSimulationUpdate(state))
  }

  /** Configures event bindings and prepares the initial UI state. */
  async initialise(): Promise<void> {
    this.scene.seedRiderFormation()
    this.scene.render()
    this.playbackControls.setRouteLoaded(false)
    this.canvas.classList.add('hidden')

    this.cameraController.bindInteractions(this.canvas, () => [this.getSelectedRider()])

    window.addEventListener('resize', () => {
      this.scene.updateSize()
      this.scene.render()
    })

    this.playbackControls.bind({
      onStart: () => this.startAnimation(),
      onPause: () => this.pauseAnimation(),
      onReset: () => this.resetSimulation(),
      onHome: () => this.returnHome(),
    })

    this.canvas.addEventListener('click', (event) => this.handleCanvasClick(event))
    document.addEventListener('keydown', (event) => this.handleKeyboard(event))

    const versionEl = document.getElementById('version') as HTMLDivElement | null
    if (versionEl) {
      versionEl.textContent = `v${pkg.version}`
    }

    await this.routeListController.initialise()
    this.showRouteList()
  }

  private handleSimulationUpdate(buffer: Float32Array): void {
    this.routeState.positions = buffer
    if (this.routeState.spline && this.routeVisuals.isReady()) {
      this.riderInstances.apply(buffer, this.routeState.spline, this.routeVisuals.getRoadMesh())
      this.scene.render()
    }
  }

  private async prepareRoute(url: string): Promise<void> {
    const base = import.meta.env.BASE_URL
    this.stopAnimation()
    this.playbackControls.disableDuringLoad()
    this.loaderOverlay.show()
    this.canvas.classList.add('hidden')

    try {
      const route = await this.routeLoader.load(`${base}${url}`, (progress) =>
        this.loaderOverlay.updateProgress(progress),
      )
      this.routeState.applyLoadedRoute(route)
      this.routeVisuals.update(route.resampled)
      this.cameraController.setInitialPose(route.resampled)

      const pelotonInitial = initPeloton(route.resampled, SIMULATION_CONFIG.riderCount, {
        spacing: SIMULATION_CONFIG.startSpacing,
        laneWidth: SIMULATION_CONFIG.laneWidth,
        roadWidth: ROAD_CONFIG.width,
        margin: SIMULATION_CONFIG.roadMargin,
      })
      this.populateYawOffsets()
      this.populatePositions(pelotonInitial)

      if (this.routeState.pathBuffer) {
        this.simulation.initialise({
          positions: pelotonInitial,
          yawOffsets: this.yawOffsets.slice(),
          path: this.routeState.pathBuffer.slice(),
          laneWidth: SIMULATION_CONFIG.laneWidth,
          roadWidth: ROAD_CONFIG.width,
          margin: SIMULATION_CONFIG.roadMargin,
        })
      }

      if (this.routeState.spline) {
        this.riderInstances.apply(
          this.routeState.positions,
          this.routeState.spline,
          this.routeVisuals.getRoadMesh(),
        )
      }

      const median = Math.floor(SIMULATION_CONFIG.riderCount / 2)
      this.selection.set(median, SIMULATION_CONFIG.riderCount)
      this.cameraController.focus([this.getSelectedRider()])

      this.playbackControls.setRouteLoaded(true)
      this.playbackControls.setPaused(true)
      this.canvas.classList.remove('hidden')
      this.hideRouteList()
      this.scene.render()
    } catch (error) {
      console.error(error)
      alert('Impossible de charger le parcours sélectionné')
    } finally {
      this.loaderOverlay.hide()
    }
  }

  private populateYawOffsets(): void {
    const rng = mulberry32(SIMULATION_CONFIG.rngSeed + 1)
    for (let i = 0; i < this.yawOffsets.length; i++) {
      const sign = rng() < 0.5 ? -1 : 1
      const magnitude = 2 + rng() * 2
      this.yawOffsets[i] = sign * magnitude * (Math.PI / 180)
    }
  }

  private populatePositions(initialPositions: Float32Array): void {
    if (!this.routeState.spline || !this.routeState.currentPath) return
    if (this.routeState.currentPath.length < 2) return
    const spline = this.routeState.spline
    const positions = this.routeState.positions
    const path = this.routeState.currentPath

    const yaw0 = Math.atan2(path[1].x - path[0].x, path[1].z - path[0].z)
    for (let i = 0; i < SIMULATION_CONFIG.riderCount; i++) {
      const base = i * 4
      const leaderIndex = SIMULATION_CONFIG.riderCount - 1 - i
      const row = Math.floor(leaderIndex / 9)
      let s = row * SIMULATION_CONFIG.startSpacing
      if (spline.totalLength > 0) s = s % spline.totalLength
      const sample = spline.sampleByDistance(s)
      const tangent = sample.tangent
      const right = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()
      const center = sample.position
      const x = initialPositions[i * 3 + 0]
      const y = initialPositions[i * 3 + 1]
      const z = initialPositions[i * 3 + 2]
      const t = (x - center.x) * right.x + (z - center.z) * right.z
      const h = y - center.y
      positions[base + 0] = s
      positions[base + 1] = t
      positions[base + 2] = h
      positions[base + 3] = yaw0 + this.yawOffsets[i]
    }
  }

  private startAnimation(): void {
    if (this.animating) return
    this.animating = true
    this.playbackControls.setRunning(true)
    this.playbackControls.setPaused(false)
    this.lastFrame = performance.now()
    requestAnimationFrame(() => this.tick())
  }

  private pauseAnimation(): void {
    this.animating = false
    this.playbackControls.setPaused(true)
  }

  private stopAnimation(): void {
    this.animating = false
  }

  private resetSimulation(): void {
    this.stopAnimation()
    if (this.routeState.currentPath && this.routeState.pathBuffer && this.routeState.spline) {
      const pelotonInitial = initPeloton(this.routeState.currentPath, SIMULATION_CONFIG.riderCount, {
        spacing: SIMULATION_CONFIG.startSpacing,
        laneWidth: SIMULATION_CONFIG.laneWidth,
        roadWidth: ROAD_CONFIG.width,
        margin: SIMULATION_CONFIG.roadMargin,
      })
      this.populateYawOffsets()
      this.populatePositions(pelotonInitial)
      this.simulation.initialise({
        positions: pelotonInitial,
        yawOffsets: this.yawOffsets.slice(),
        path: this.routeState.pathBuffer.slice(),
        laneWidth: SIMULATION_CONFIG.laneWidth,
        roadWidth: ROAD_CONFIG.width,
        margin: SIMULATION_CONFIG.roadMargin,
      })
      this.riderInstances.apply(
        this.routeState.positions,
        this.routeState.spline,
        this.routeVisuals.getRoadMesh(),
      )
      this.cameraController.restoreInitialPose()
      this.cameraController.focus([this.getSelectedRider()])
      this.scene.render()
    }
    this.playbackControls.setPaused(true)
  }

  private returnHome(): void {
    this.stopAnimation()
    this.canvas.classList.add('hidden')
    this.showRouteList()
    this.playbackControls.setRouteLoaded(false)
    this.cameraController.restoreInitialPose()
  }

  private tick(): void {
    if (!this.animating) return
    const now = performance.now()
    const dt = Math.min(0.05, (now - this.lastFrame) / 1000)
    this.lastFrame = now

    this.cameraController.update(dt, [this.getSelectedRider()])
    this.simulation.step(dt)
    this.scene.render()

    if (this.animating) requestAnimationFrame(() => this.tick())
  }

  private handleCanvasClick(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect()
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    this.raycaster.setFromCamera(this.mouse, this.scene.camera)
    const intersects = this.raycaster.intersectObject(this.scene.riderMesh)
    if (intersects.length && intersects[0].instanceId !== undefined) {
      this.selection.set(intersects[0].instanceId, SIMULATION_CONFIG.riderCount)
      this.cameraController.focus([this.getSelectedRider()])
      this.scene.render()
    }
  }

  private handleKeyboard(event: KeyboardEvent): void {
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
    this.selection.move(delta, SIMULATION_CONFIG.riderCount)
    this.cameraController.update(0.016, [this.getSelectedRider()])
    this.scene.render()
  }

  private getSelectedRider(): THREE.Object3D {
    return this.scene.riderObjects[this.selection.value]
  }

  private showRouteList(): void {
    this.routeList.classList.remove('hidden')
  }

  private hideRouteList(): void {
    this.routeList.classList.add('hidden')
  }
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
