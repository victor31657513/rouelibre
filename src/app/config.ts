/**
 * Centralised constants describing the application behaviour.
 *
 * Extension: Turn values into user-configurable settings by reading from a
 * preferences store before exporting the final configuration object.
 */
import { DEFAULT_WORKER_PARAMS } from '../domain/simulation/physics/workerParams'

export const APP_CONFIG = {
  riderCount: 184,
  rngSeed: 1234,
  startSpacing: 1.2,
  laneWidth: 1.0,
  roadWidth: 8,
  roadMargin: 0.05,
  dashLength: 2,
  gapLength: 10,
  lineWidth: 0.15,
  startLineOffset: 1,
  camDistance: 10,
  camHeight: 6,
  surfaceSampleStep: 1,
  surfaceRayHeight: 30,
  riderSurfaceOffset: 0.05,
  workerParams: { ...DEFAULT_WORKER_PARAMS, minRadius: DEFAULT_WORKER_PARAMS.minRadius },
}

export const CAMERA_BOUNDS = {
  minFov: 20,
  maxFov: 100,
}

export const CAMERA_CONTROL = {
  rotationSensitivity: 0.005,
  touchDoubleTapMaxDelay: 300,
  touchDoubleTapMaxDistance: 30,
  touchSwipeMinDistance: 45,
  touchSwipeMaxDuration: 350,
  touchSwipeVerticalTolerance: 60,
  swipeRotationStep: 0.35,
}
