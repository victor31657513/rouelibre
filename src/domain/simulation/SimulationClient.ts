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
}

export type SimulationStateListener = (state: Float32Array) => void

export class SimulationClient {
  private readonly worker: Worker
  private readonly listener: SimulationStateListener

  constructor(listener: SimulationStateListener) {
    this.listener = listener
    this.worker = new Worker(new URL('./physics/worker.ts', import.meta.url), { type: 'module' })
    this.worker.onmessage = (event: MessageEvent) => {
      const { type, data } = event.data || {}
      if (type === 'state' && data) {
        this.listener(new Float32Array(data))
      }
    }
  }

  /** Sends initial conditions to the worker. */
  initialize(config: SimulationInitConfig): void {
    this.worker.postMessage(
      {
        type: 'init',
        payload: {
          N: config.riderCount,
          positions: config.positions,
          yaw: config.yaw,
          path: config.path,
          laneWidth: config.laneWidth,
          roadWidth: config.roadWidth,
          margin: config.margin,
          params: config.params,
        },
      },
      [config.positions, config.yaw, config.path],
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
