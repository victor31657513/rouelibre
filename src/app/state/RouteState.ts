import { PathSpline } from '../../domain/route/pathSpline'
import type { RoutePoint } from '../../domain/route/gpx'
import { SIMULATION_CONFIG } from '../config'
import type { LoadedRoute } from '../route/RouteLoader'

/**
 * @fileoverview Holds the currently loaded route and rider buffers.
 * Centralises computed artefacts shared across controllers (spline, path buffer,
 * simulation positions) so consumers do not have to recompute them.
 *
 * Extension: Track additional derived data (segments, checkpoints) by extending
 * this class and exposing typed getters to keep consumers decoupled.
 */
export class RouteState {
  currentPath: RoutePoint[] | null = null
  simplifiedPath: RoutePoint[] | null = null
  spline: PathSpline | null = null
  pathBuffer: Float32Array | null = null
  positions = new Float32Array(SIMULATION_CONFIG.riderCount * 4)

  /** Resets the state using the output of the RouteLoader. */
  applyLoadedRoute(route: LoadedRoute): void {
    this.currentPath = route.resampled
    this.simplifiedPath = route.simplified
    this.pathBuffer = route.pathBuffer
    this.spline = new PathSpline(route.simplified)
    this.positions = new Float32Array(SIMULATION_CONFIG.riderCount * 4)
  }

  clear(): void {
    this.currentPath = null
    this.simplifiedPath = null
    this.spline = null
    this.pathBuffer = null
    this.positions = new Float32Array(SIMULATION_CONFIG.riderCount * 4)
  }
}
