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
import { DEFAULT_MODE_ID, SIMULATION_MODES, getModeById, type SimulationMode } from './modes'
import { createSceneContext, type SceneContext } from '../domain/scene/sceneFactory'
import { CameraRig } from '../domain/camera/CameraRig'
import { PelotonSceneUpdater } from '../domain/simulation/PelotonSceneUpdater'
import { SimulationClient } from '../domain/simulation/SimulationClient'
import { initPeloton } from '../domain/simulation/peloton'
import { PathSpline, resamplePath } from '../domain/route/pathSpline'
import { elevationStats, ensureProgressivePath, simplifyPath } from '../domain/route/pathProcessing'
import {
  buildCenterDashes,
  buildRoadBounds,
  buildRoadMesh,
  buildShortestPathLine,
  buildStartLine,
} from '../domain/route/roadGeometry'
import { loadGPX } from '../domain/route/routeLoader'
import type { GPXPoint, Vec3 } from '../domain/route/gpx'
import { changeSelectedIndex, selectedIndex, setSelectedIndex } from '../domain/state/selection'
import { initModeSelector, type ModeSelectorHandle } from '../ui/modeSelector'
import { initRouteSelector } from '../ui/routeSelector'
import type { SimulationParameterOverrides } from '../domain/simulation/physics/workerParams'

interface DomRefs {
  canvas: HTMLCanvasElement
  loader: HTMLDivElement
  loaderProgress: HTMLProgressElement
  homeBtn: HTMLButtonElement
  startBtn: HTMLButtonElement
  pauseBtn: HTMLButtonElement
  resetBtn: HTMLButtonElement
  controls: HTMLDivElement
  homePanel: HTMLDivElement
  modeSelector: HTMLDivElement
  routeList: HTMLElement
  speedIndicator: HTMLDivElement
  distanceIndicator: HTMLDivElement
  distanceTravelled: HTMLSpanElement
  distanceRemaining: HTMLSpanElement
  shortestPathToggle: HTMLInputElement
}

type RoadAssets = {
  road?: THREE.Mesh
  markings?: THREE.Mesh
  startLine?: THREE.Mesh
  bounds?: THREE.LineSegments
  shortestPath?: THREE.Line
}

export class AppController {
  private readonly dom: DomRefs
  private readonly scene: SceneContext
  private readonly cameraRig: CameraRig
  private readonly pelotonScene: PelotonSceneUpdater
  private readonly simulation: SimulationClient

  private readonly maxRiderCount = APP_CONFIG.riderCount
  private mode: SimulationMode
  private riderCount: number
  private modeSelectorHandle: ModeSelectorHandle | null = null
  private showShortestPath: boolean

  private currentPath: Vec3[] | null = null
  private simplifiedPath: Vec3[] | null = null
  private spline: PathSpline | null = null
  private pathData: Float32Array | null = null
  private positions: Float32Array
  private roadReady = false
  private roadAssets: RoadAssets = {}
  private routeClosed = false

  private animating = false
  private lastTick = performance.now()
  private lastStateDt = 0
  private readonly pendingStepDts: number[] = []
  private rotating = false
  private touchRotating = false
  private activeTouchId: number | null = null
  private lastTouchX = 0
  private lastTouchTap = 0
  private lastTouchPosition: { x: number; y: number } | null = null
  private touchStartX = 0
  private touchStartY = 0
  private touchStartTime = 0
  private touchAccumulatedDeltaX = 0
  private touchIsDragging = false
  private lastMiddleTime = 0
  private readonly mouse = new THREE.Vector2()
  private lastTelemetryRefresh = Number.NEGATIVE_INFINITY
  private readonly telemetryRefreshIntervalMs = 300
  private readonly speedFormatter = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  private readonly distanceFormatter = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  constructor(dom: DomRefs) {
    this.dom = dom
    this.mode = getModeById(DEFAULT_MODE_ID)
    this.showShortestPath = dom.shortestPathToggle.checked
    this.riderCount = Math.max(1, Math.min(this.mode.riderCount, this.maxRiderCount))

    this.scene = createSceneContext(this.dom.canvas, {
      riderCount: this.maxRiderCount,
      cameraDistance: APP_CONFIG.camDistance,
      cameraHeight: APP_CONFIG.camHeight,
    })
    this.scene.ridersMesh.count = this.riderCount
    this.cameraRig = new CameraRig(this.scene.camera, {
      followOffset: new THREE.Vector3(0, APP_CONFIG.camHeight, -APP_CONFIG.camDistance),
    })
    this.pelotonScene = new PelotonSceneUpdater(this.scene.ridersMesh, this.scene.riderObjects, {
      laneWidth: APP_CONFIG.laneWidth,
      roadWidth: APP_CONFIG.roadWidth,
      margin: APP_CONFIG.roadMargin,
    })
    this.simulation = new SimulationClient((state) => this.onSimulationState(state))
    this.positions = new Float32Array(this.riderCount * 4)
    setSelectedIndex(Math.min(selectedIndex, this.riderCount - 1), this.riderCount)
    this.dom.shortestPathToggle.checked = this.showShortestPath
    this.applyModeColors()
    this.attachEventListeners()
    this.hideControls()
    this.hideTelemetry()
  }

  /** Prepares the route selector UI and initial button states. */
  async initialize(): Promise<void> {
    this.dom.startBtn.disabled = true
    this.dom.pauseBtn.disabled = true
    this.dom.resetBtn.disabled = true
    this.dom.canvas.classList.add('hidden')
    this.modeSelectorHandle = initModeSelector({
      containerId: 'mode-selector',
      modes: SIMULATION_MODES,
      activeId: this.mode.id,
      onSelect: (mode) => this.onModeSelected(mode),
    })
    this.showRouteList()
    await initRouteSelector('route-list', async (path, points, url) => {
      await this.loadRoute(url, { path3D: path, points })
    })
  }

  private onModeSelected(mode: SimulationMode): void {
    if (this.mode.id === mode.id && this.riderCount === mode.riderCount) {
      return
    }

    this.mode = mode
    const nextCount = Math.max(1, Math.min(mode.riderCount, this.maxRiderCount))
    const countChanged = nextCount !== this.riderCount
    this.riderCount = nextCount
    this.scene.ridersMesh.count = this.riderCount
    this.positions = new Float32Array(this.riderCount * 4)
    setSelectedIndex(Math.min(selectedIndex, this.riderCount - 1), this.riderCount)
    this.applyModeColors()
    this.modeSelectorHandle?.setActive(this.mode.id)

    if (this.currentPath && this.spline && this.simplifiedPath && this.pathData) {
      this.stopAnimation()
      this.preparePeloton()
      this.dom.startBtn.disabled = false
      this.dom.startBtn.textContent = 'Start'
      this.dom.pauseBtn.disabled = true
      this.hideTelemetry()
    } else if (countChanged) {
      this.refreshTelemetryDisplay()
    }
  }

  private attachEventListeners(): void {
    const { canvas, homeBtn, startBtn, pauseBtn, resetBtn, shortestPathToggle } = this.dom

    homeBtn.addEventListener('click', () => {
      this.stopAnimation()
      canvas.classList.add('hidden')
      this.showRouteList()
      homeBtn.classList.add('hidden')
      startBtn.disabled = true
      pauseBtn.disabled = true
      resetBtn.disabled = true
      this.hideControls()
      this.hideTelemetry()
    })

    startBtn.addEventListener('click', () => {
      this.startAnimation()
      startBtn.disabled = true
      startBtn.textContent = 'Start'
      pauseBtn.disabled = false
      this.showControls()
      this.showTelemetry()
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
      this.hideTelemetry()
    })

    shortestPathToggle.addEventListener('change', () => {
      this.showShortestPath = shortestPathToggle.checked
      this.updateShortestPathVisibility()
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
          this.resetCameraToDefault()
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

    canvas.addEventListener('pointerdown', (event: PointerEvent) => {
      if (event.pointerType !== 'touch') return
      if (this.activeTouchId !== null) return
      const now = performance.now()
      const previousTap = this.lastTouchTap
      const previousPosition = this.lastTouchPosition

      if (previousTap && now - previousTap < CAMERA_CONTROL.touchDoubleTapMaxDelay && previousPosition) {
        const dx = Math.abs(event.clientX - previousPosition.x)
        const dy = Math.abs(event.clientY - previousPosition.y)
        if (dx < CAMERA_CONTROL.touchDoubleTapMaxDistance && dy < CAMERA_CONTROL.touchDoubleTapMaxDistance) {
          event.preventDefault()
          this.resetCameraToDefault()
          this.lastTouchTap = 0
          this.lastTouchPosition = null
          return
        }
      }

      this.touchRotating = true
      this.activeTouchId = event.pointerId
      this.lastTouchX = event.clientX
      this.lastTouchTap = now
      this.lastTouchPosition = { x: event.clientX, y: event.clientY }
      this.touchStartX = event.clientX
      this.touchStartY = event.clientY
      this.touchStartTime = event.timeStamp
      this.touchAccumulatedDeltaX = 0
      this.touchIsDragging = false
      canvas.setPointerCapture(event.pointerId)
      event.preventDefault()
    })

    const endTouch = (event: PointerEvent) => {
      if (event.pointerId !== this.activeTouchId) return
      if (event.type === 'pointerup') {
        this.evaluateTouchSwipe(event)
      }
      this.touchRotating = false
      this.activeTouchId = null
      this.touchIsDragging = false
      this.touchAccumulatedDeltaX = 0
      this.touchStartTime = 0
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId)
      }
    }

    canvas.addEventListener('pointerup', endTouch)
    canvas.addEventListener('pointercancel', endTouch)

    canvas.addEventListener('pointermove', (event: PointerEvent) => {
      if (!this.touchRotating || event.pointerId !== this.activeTouchId) return
      const deltaX = event.clientX - this.lastTouchX
      this.touchAccumulatedDeltaX += Math.abs(deltaX)
      const elapsed = event.timeStamp - this.touchStartTime
      if (!this.touchIsDragging) {
        this.touchIsDragging =
          elapsed > CAMERA_CONTROL.touchSwipeMaxDuration ||
          this.touchAccumulatedDeltaX > CAMERA_CONTROL.touchSwipeMinDistance
      }
      if (this.touchIsDragging && deltaX !== 0) {
        this.cameraRig.addYaw(deltaX * CAMERA_CONTROL.rotationSensitivity)
      }
      this.lastTouchX = event.clientX
      event.preventDefault()
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

  private evaluateTouchSwipe(event: PointerEvent): void {
    if (this.touchIsDragging) return
    const totalDeltaX = event.clientX - this.touchStartX
    const totalDeltaY = event.clientY - this.touchStartY
    const duration = this.touchStartTime ? event.timeStamp - this.touchStartTime : Number.POSITIVE_INFINITY

    if (
      Math.abs(totalDeltaX) >= CAMERA_CONTROL.touchSwipeMinDistance &&
      Math.abs(totalDeltaY) <= CAMERA_CONTROL.touchSwipeVerticalTolerance &&
      duration <= CAMERA_CONTROL.touchSwipeMaxDuration
    ) {
      const direction = Math.sign(totalDeltaX)
      if (direction !== 0) {
        this.cameraRig.addYaw(direction * CAMERA_CONTROL.swipeRotationStep)
      }
    }
  }

  private resetCameraToDefault(): void {
    if (this.currentPath) {
      this.cameraRig.restoreInitialPose()
    } else {
      this.cameraRig.resetYaw()
      this.focusSelected()
    }
  }

  private handleCanvasClick(event: MouseEvent): void {
    const rect = this.dom.canvas.getBoundingClientRect()
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    this.scene.raycaster.setFromCamera(this.mouse, this.scene.camera)
    const intersects = this.scene.raycaster.intersectObject(this.scene.ridersMesh)
    if (intersects.length && intersects[0].instanceId !== undefined) {
      setSelectedIndex(intersects[0].instanceId, this.riderCount)
      this.focusSelected()
      this.refreshTelemetryDisplay()
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
    changeSelectedIndex(delta, this.riderCount)
    const target = this.getSelectedRiderObject()
    if (target) {
      this.cameraRig.update(0.016, [target])
    }
    this.refreshTelemetryDisplay()
  }

  private async loadRoute(
    url: string,
    preloaded?: { path3D: Vec3[]; points: GPXPoint[] },
  ): Promise<void> {
    this.hideTelemetry()
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

    const progressive = ensureProgressivePath(path3D)
    const simplified = simplifyPath(progressive, 1.0)
    const smoothed = resamplePath(simplified, 1.0)
    this.cameraRig.setInitialPose(smoothed, APP_CONFIG.camHeight, APP_CONFIG.camDistance)

    this.currentPath = smoothed
    this.simplifiedPath = simplified
    this.routeClosed = this.detectClosedLoop(simplified)
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
    this.showControls()
  }

  private preparePeloton(): void {
    if (!this.currentPath || !this.spline || !this.simplifiedPath) return

    const riderCount = this.riderCount
    this.scene.ridersMesh.count = riderCount
    this.applyModeColors()

    const pelotonPositions = initPeloton(this.currentPath, riderCount, {
      seed: APP_CONFIG.rngSeed,
      spacing: APP_CONFIG.startSpacing,
      laneWidth: APP_CONFIG.laneWidth,
      roadWidth: APP_CONFIG.roadWidth,
      margin: APP_CONFIG.roadMargin,
    })

    const yawOffsets = new Float32Array(riderCount)
    const yawRng = this.createMulberry(APP_CONFIG.rngSeed + 1)
    this.positions = new Float32Array(riderCount * 4)
    this.lastStateDt = 0
    this.pendingStepDts.length = 0

    const totalLength = this.spline.totalLength
    const yaw0 = Math.atan2(
      this.currentPath[1].x - this.currentPath[0].x,
      this.currentPath[1].z - this.currentPath[0].z,
    )

    for (let i = 0; i < riderCount; i++) {
      const base = i * 4
      const sign = yawRng() < 0.5 ? -1 : 1
      const magnitude = 2 + yawRng() * 2
      const yawOffset = sign * magnitude * (Math.PI / 180)
      yawOffsets[i] = yawOffset

      const leaderIndex = riderCount - 1 - i
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

    const median = Math.floor(riderCount / 2)
    setSelectedIndex(median, riderCount)

    const pathArray = new Float32Array(this.simplifiedPath.length * 3)
    for (let i = 0; i < this.simplifiedPath.length; i++) {
      const p = this.simplifiedPath[i]
      pathArray[i * 3 + 0] = p.x
      pathArray[i * 3 + 1] = p.y
      pathArray[i * 3 + 2] = p.z
    }
    this.pathData = pathArray.slice()

    this.simulation.initialize({
      riderCount,
      positions: pelotonPositions.buffer,
      yaw: yawOffsets.buffer,
      path: pathArray.buffer,
      laneWidth: APP_CONFIG.laneWidth,
      roadWidth: APP_CONFIG.roadWidth,
      margin: APP_CONFIG.roadMargin,
      params: this.resolveWorkerParams(),
      closedLoop: this.routeClosed,
    })

    this.pelotonScene.applyState(this.positions)
    this.cameraRig.restoreInitialPose()
    this.focusSelected()
    this.scene.renderer.render(this.scene.scene, this.scene.camera)
    this.refreshTelemetryDisplay()
  }

  private resetPeloton(): void {
    if (!this.currentPath || !this.pathData || !this.spline) return

    const riderCount = this.riderCount
    this.scene.ridersMesh.count = riderCount

    const pelotonPositions = initPeloton(this.currentPath, riderCount, {
      seed: APP_CONFIG.rngSeed,
      spacing: APP_CONFIG.startSpacing,
      laneWidth: APP_CONFIG.laneWidth,
      roadWidth: APP_CONFIG.roadWidth,
      margin: APP_CONFIG.roadMargin,
    })

    const yawOffsets = new Float32Array(riderCount)
    const yawRng = this.createMulberry(APP_CONFIG.rngSeed + 1)
    this.positions = new Float32Array(riderCount * 4)
    this.lastStateDt = 0
    this.pendingStepDts.length = 0
    const totalLength = this.spline.totalLength
    const yaw0 = Math.atan2(
      this.currentPath[1].x - this.currentPath[0].x,
      this.currentPath[1].z - this.currentPath[0].z,
    )

    for (let i = 0; i < riderCount; i++) {
      const base = i * 4
      const sign = yawRng() < 0.5 ? -1 : 1
      const magnitude = 2 + yawRng() * 2
      const yawOffset = sign * magnitude * (Math.PI / 180)
      yawOffsets[i] = yawOffset

      const leaderIndex = riderCount - 1 - i
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
      riderCount,
      positions: pelotonPositions.buffer,
      yaw: yawOffsets.buffer,
      path: pathCopy.buffer,
      laneWidth: APP_CONFIG.laneWidth,
      roadWidth: APP_CONFIG.roadWidth,
      margin: APP_CONFIG.roadMargin,
      params: this.resolveWorkerParams(),
      closedLoop: this.routeClosed,
    })

    this.pelotonScene.applyState(this.positions)
    this.cameraRig.restoreInitialPose()
    this.focusSelected()
    this.scene.renderer.render(this.scene.scene, this.scene.camera)
    this.refreshTelemetryDisplay()
  }

  private detectClosedLoop(path: Vec3[]): boolean {
    if (path.length < 2) return false
    const first = path[0]
    const last = path[path.length - 1]
    const separation = Math.hypot(last.x - first.x, last.y - first.y, last.z - first.z)
    const threshold = Math.max(APP_CONFIG.laneWidth * 4, 10)
    return separation <= threshold
  }

  private resolveWorkerParams(): SimulationParameterOverrides {
    const baseParams: SimulationParameterOverrides = { ...APP_CONFIG.workerParams }
    const overrides = this.mode.workerParams
    if (!overrides) {
      return baseParams
    }
    return { ...baseParams, ...overrides }
  }

  private rebuildRoute(): void {
    if (!this.currentPath) return

    const { scene } = this.scene
    if (this.roadAssets.road) scene.remove(this.roadAssets.road)
    if (this.roadAssets.markings) scene.remove(this.roadAssets.markings)
    if (this.roadAssets.startLine) scene.remove(this.roadAssets.startLine)
    if (this.roadAssets.bounds) scene.remove(this.roadAssets.bounds)
    if (this.roadAssets.shortestPath) scene.remove(this.roadAssets.shortestPath)

    const road = buildRoadMesh(this.currentPath, APP_CONFIG.roadWidth)
    const markings = buildCenterDashes(
      this.currentPath,
      APP_CONFIG.lineWidth,
      APP_CONFIG.dashLength,
      APP_CONFIG.gapLength,
    )
    const startLineOffset = this.computeStartLineOffset()
    const startLine = buildStartLine(
      this.currentPath,
      APP_CONFIG.roadWidth,
      startLineOffset,
    )
    const bounds = buildRoadBounds(this.currentPath, APP_CONFIG.roadWidth)
    const shortestPath = buildShortestPathLine(
      this.currentPath,
      APP_CONFIG.roadWidth,
      APP_CONFIG.roadMargin,
    )

    road.name = 'routeMesh'
    markings.name = 'centerMarkings'
    startLine.name = 'startLine'
    bounds.name = 'roadBounds'
    shortestPath.name = 'shortestPath'
    shortestPath.visible = this.showShortestPath

    scene.add(road)
    scene.add(markings)
    scene.add(startLine)
    scene.add(bounds)
    scene.add(shortestPath)

    this.roadAssets = { road, markings, startLine, bounds, shortestPath }
    this.pelotonScene.setRoadMesh(road)
    this.roadReady = true
    this.pelotonScene.applyState(this.positions)
    this.updateShortestPathVisibility()
  }

  private updateShortestPathVisibility(): void {
    const pathLine = this.roadAssets.shortestPath
    if (!pathLine) {
      if (this.showShortestPath && this.currentPath) {
        const newLine = buildShortestPathLine(
          this.currentPath,
          APP_CONFIG.roadWidth,
          APP_CONFIG.roadMargin,
        )
        newLine.name = 'shortestPath'
        newLine.visible = true
        this.scene.scene.add(newLine)
        this.roadAssets.shortestPath = newLine
      }
      return
    }

    pathLine.visible = this.showShortestPath
  }

  private computeStartLineOffset(): number {
    const { startLineOffset, startSpacing, riderCount, roadWidth, laneWidth } = APP_CONFIG
    if (!Number.isFinite(startSpacing) || startSpacing <= 0) {
      return startLineOffset
    }
    if (!Number.isFinite(riderCount) || riderCount <= 0) {
      return startLineOffset
    }

    const width = Number.isFinite(roadWidth) && roadWidth > 0 ? roadWidth : laneWidth
    const lane = Number.isFinite(laneWidth) && laneWidth > 0 ? laneWidth : roadWidth
    const rawColumns = lane > 0 ? Math.floor(width / lane) : 0
    const columns = Math.max(1, rawColumns)
    const rows = Math.ceil(riderCount / columns)
    const frontDistance = Math.max(0, (rows - 1) * startSpacing)
    const safetyMargin = startSpacing * 0.5

    return Math.max(startLineOffset, frontDistance + safetyMargin)
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
    this.pendingStepDts.length = 0
    this.lastStateDt = 0
  }

  private setSpeedDisplay(speedKmh: number | null): void {
    this.dom.speedIndicator.textContent = this.formatSpeed(speedKmh)
  }

  private setDistanceDisplay(travelledKm: number | null, remainingKm: number | null): void {
    this.dom.distanceTravelled.textContent = `Parcourus : ${this.formatDistance(travelledKm)}`
    this.dom.distanceRemaining.textContent = `Restants : ${this.formatDistance(remainingKm)}`
  }

  private showControls(): void {
    this.dom.controls.classList.remove('hidden')
  }

  private hideControls(): void {
    this.dom.controls.classList.add('hidden')
  }

  private showTelemetry(): void {
    this.dom.speedIndicator.classList.remove('hidden')
    this.dom.distanceIndicator.classList.remove('hidden')
  }

  private hideTelemetry(): void {
    this.dom.speedIndicator.classList.add('hidden')
    this.dom.distanceIndicator.classList.add('hidden')
    this.setSpeedDisplay(null)
    this.setDistanceDisplay(null, null)
  }

  private formatSpeed(speedKmh: number | null): string {
    if (speedKmh === null || !Number.isFinite(speedKmh)) {
      return '-- km/h'
    }
    const roundedSpeed = Math.round(Math.max(0, speedKmh) * 10) / 10
    return `${this.speedFormatter.format(roundedSpeed)} km/h`
  }

  private formatDistance(distanceKm: number | null): string {
    if (distanceKm === null || !Number.isFinite(distanceKm)) {
      return '-- km'
    }
    return `${this.distanceFormatter.format(Math.max(0, distanceKm))} km`
  }

  private refreshTelemetryDisplay(): void {
    if (!this.positions || this.positions.length === 0) {
      this.setSpeedDisplay(null)
      this.setDistanceDisplay(null, null)
      return
    }
    this.updateTelemetry(null, this.positions, true)
  }

  private updateTelemetry(
    previousState: Float32Array | null,
    currentState: Float32Array,
    force = false,
  ): void {
    const now = performance.now()
    if (!force && now - this.lastTelemetryRefresh < this.telemetryRefreshIntervalMs) {
      return
    }
    this.lastTelemetryRefresh = now

    if (!this.spline) {
      this.setSpeedDisplay(null)
      this.setDistanceDisplay(null, null)
      return
    }

    const totalLength = this.spline.totalLength
    const base = selectedIndex * 4
    const progress = currentState[base]
    let speedMs = 0

    if (
      previousState &&
      previousState.length === currentState.length &&
      this.lastStateDt > 0 &&
      Number.isFinite(progress) &&
      Number.isFinite(previousState[base])
    ) {
      let delta = progress - previousState[base]
      if (Number.isFinite(totalLength) && totalLength > 0) {
        const halfLength = totalLength / 2
        if (delta < -halfLength) {
          delta += totalLength
        } else if (delta > halfLength) {
          delta -= totalLength
        }
      }
      const dt = this.lastStateDt
      if (dt > 0 && Number.isFinite(dt)) {
        speedMs = delta / dt
      }
      if (!Number.isFinite(speedMs)) {
        speedMs = 0
      }
    }

    const speedKmh = Math.max(0, speedMs * 3.6)
    const travelledKm = Number.isFinite(progress) ? Math.max(0, progress) / 1000 : null
    let remainingKm: number | null = null
    if (Number.isFinite(totalLength) && totalLength > 0 && Number.isFinite(progress)) {
      remainingKm = Math.max(0, totalLength - progress) / 1000
    }

    this.setSpeedDisplay(Number.isFinite(speedKmh) ? speedKmh : null)
    this.setDistanceDisplay(travelledKm, remainingKm)
  }

  private tick(): void {
    if (!this.animating) return
    const now = performance.now()
    const dt = Math.min(0.05, (now - this.lastTick) / 1000)
    this.lastTick = now

    const focusTarget = this.getSelectedRiderObject()
    this.cameraRig.update(dt, focusTarget ? [focusTarget] : [], this.rotating)
    this.pendingStepDts.push(dt)
    this.simulation.step(dt)
    this.scene.renderer.render(this.scene.scene, this.scene.camera)

    if (this.animating) requestAnimationFrame(() => this.tick())
  }

  private focusSelected(): void {
    const target = this.getSelectedRiderObject()
    if (target) {
      this.cameraRig.focus([target])
    }
  }

  private getSelectedRiderObject(): THREE.Object3D | null {
    if (this.riderCount <= 0) return null
    const index = Math.min(Math.max(selectedIndex, 0), this.riderCount - 1)
    return this.scene.riderObjects[index] ?? null
  }

  private onSimulationState(state: Float32Array): void {
    const previous = this.positions
    this.positions = state
    this.pelotonScene.applyState(this.positions)
    const queuedDt = this.pendingStepDts.shift()
    this.lastStateDt =
      typeof queuedDt === 'number' && Number.isFinite(queuedDt) && queuedDt > 0 ? queuedDt : 0
    this.updateTelemetry(previous, this.positions)
  }

  private applyModeColors(): void {
    const mesh = this.scene.ridersMesh
    if (!mesh.instanceColor || mesh.instanceColor.count < this.maxRiderCount) {
      mesh.instanceColor = new THREE.InstancedBufferAttribute(
        new Float32Array(this.maxRiderCount * 3),
        3,
      )
    }

    const baseColor = new THREE.Color(0x3aa6ff)
    for (let i = 0; i < this.maxRiderCount; i++) {
      mesh.setColorAt(i, baseColor)
    }

    const { teamColors, teamSize } = this.mode
    if (teamColors && teamColors.length > 0 && teamSize && teamSize > 0) {
      const clampedTeamSize = Math.max(1, Math.floor(teamSize))
      teamColors.forEach((hex, teamIndex) => {
        const colour = new THREE.Color(hex)
        for (let member = 0; member < clampedTeamSize; member++) {
          const riderIndex = teamIndex * clampedTeamSize + member
          if (riderIndex >= this.maxRiderCount) break
          mesh.setColorAt(riderIndex, colour)
        }
      })
    }

    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true
    }
  }

  private showRouteList(): void {
    this.dom.homePanel.classList.remove('hidden')
  }

  private hideRouteList(): void {
    this.dom.homePanel.classList.add('hidden')
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
