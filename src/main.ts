/**
 * Entry point that wires DOM elements to the {@link AppController}.
 *
 * Extension: For additional bootstrapping concerns (e.g. feature flags) extend
 * this file while keeping the controller API unchanged.
 */
import pkg from '../package.json' assert { type: 'json' }
import './style.css'
import { AppController } from './app/AppController'

const canvas = document.getElementById('app') as HTMLCanvasElement | null
const loader = document.getElementById('loader') as HTMLDivElement | null
const loaderProgress = document.getElementById('loader-progress') as HTMLProgressElement | null
const homeBtn = document.getElementById('home-btn') as HTMLButtonElement | null
const startBtn = document.getElementById('start-btn') as HTMLButtonElement | null
const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement | null
const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement | null
const controls = document.getElementById('controls') as HTMLDivElement | null
const routeList = document.getElementById('route-list') as HTMLElement | null
const speedIndicator = document.getElementById('speed-indicator') as HTMLDivElement | null
const distanceIndicator = document.getElementById('distance-indicator') as HTMLDivElement | null
const distanceTravelled = document.getElementById('distance-travelled') as HTMLSpanElement | null
const distanceRemaining = document.getElementById('distance-remaining') as HTMLSpanElement | null

if (
  !canvas ||
  !loader ||
  !loaderProgress ||
  !homeBtn ||
  !startBtn ||
  !pauseBtn ||
  !resetBtn ||
  !controls ||
  !routeList ||
  !speedIndicator ||
  !distanceIndicator ||
  !distanceTravelled ||
  !distanceRemaining
) {
  throw new Error('Missing required DOM elements to bootstrap the application')
}

const controller = new AppController({
  canvas,
  loader,
  loaderProgress,
  homeBtn,
  startBtn,
  pauseBtn,
  resetBtn,
  controls,
  routeList,
  speedIndicator,
  distanceIndicator,
  distanceTravelled,
  distanceRemaining,
})

void controller.initialize()

const versionEl = document.getElementById('version') as HTMLDivElement | null
if (versionEl) {
  versionEl.textContent = `v${pkg.version}`
}
