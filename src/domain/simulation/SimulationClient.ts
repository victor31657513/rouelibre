/**
 * Thin wrapper around the physics web worker used to animate the peloton.
 *
 * Extension: Expose additional methods (pause, parameter tuning) by relaying
 * messages with distinct `type` identifiers. Keep payloads serialisable.
 */
import type { SimulationParameterOverrides } from './physics/workerParams'

export interface SimulationInitConfig {
  riderCount: number
  positions: ArrayBuffer
  yaw: ArrayBuffer
  path: ArrayBuffer
  laneWidth: number
  roadWidth: number
  margin: number
  params?: SimulationParameterOverrides
  closedLoop?: boolean
  shortestPath?: ArrayBuffer
}

export type SimulationStateListener = (
  state: Float32Array,
  telemetry?: Float32Array,
  dt?: number,
) => void

export class SimulationClient {
  private readonly worker: Worker
  private readonly listener: SimulationStateListener

  constructor(listener: SimulationStateListener) {
    this.listener = listener
    this.worker = new Worker(new URL('./physics/worker.ts', import.meta.url), { type: 'module' })
    this.worker.onmessage = (event: MessageEvent) => {
      const { type, data } = event.data || {}
      if (type === 'state' && data) {
        const stateSource: ArrayBuffer | Float32Array | undefined = data.state || data.buffer || data
        const telemetrySource: ArrayBuffer | Float32Array | undefined = data.telemetry
        const dt: number | undefined = data.dt
        if (stateSource) {
          const stateArray =
            stateSource instanceof Float32Array ? stateSource : new Float32Array(stateSource)
          const telemetryArray = telemetrySource
            ? telemetrySource instanceof Float32Array
              ? telemetrySource
              : new Float32Array(telemetrySource)
            : undefined
          this.listener(stateArray, telemetryArray, dt)
        }
      }
    }
  }

  /** Sends initial conditions to the worker. */
  initialize(config: SimulationInitConfig): void {
    const payload: Record<string, unknown> = {
      N: config.riderCount,
      positions: config.positions,
      yaw: config.yaw,
      path: config.path,
      laneWidth: config.laneWidth,
      roadWidth: config.roadWidth,
      margin: config.margin,
      params: config.params,
      closedLoop: config.closedLoop,
    }
    if (config.shortestPath) {
      payload.shortestPath = config.shortestPath
    }

    const transfers: ArrayBuffer[] = [config.positions, config.yaw, config.path]
    if (config.shortestPath) {
      transfers.push(config.shortestPath)
    }

    this.worker.postMessage(
      {
        type: 'init',
        payload,
      },
      transfers,
    )
  }

  /** Requests a simulation step with the provided delta time. */
  step(dt: number): void {
    this.worker.postMessage({ type: 'step', payload: { dt } })
  }

  /** Updates the worker tuning parameters without reinitialising buffers. */
  updateParams(params: SimulationParameterOverrides): void {
    this.worker.postMessage({ type: 'params', payload: params })
  }

  /** Terminates the worker to release resources (currently unused). */
  dispose(): void {
    this.worker.terminate()
  }
}
