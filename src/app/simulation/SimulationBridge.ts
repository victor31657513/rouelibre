import { SIMULATION_CONFIG } from '../config'

/**
 * @fileoverview Thin wrapper around the physics web worker.
 * Hides the message passing details and exposes a declarative API to initialise
 * and tick the simulation.
 *
 * Extension: Emit additional events (collisions, metrics) by expanding the
 * message handling inside the `onmessage` callback.
 */
export interface SimulationInitPayload {
  positions: Float32Array
  yawOffsets: Float32Array
  path: Float32Array
  laneWidth: number
  roadWidth: number
  margin: number
}

export type SimulationUpdateHandler = (state: Float32Array) => void

export class SimulationBridge {
  private readonly worker: Worker
  private readonly onUpdate: SimulationUpdateHandler

  constructor(onUpdate: SimulationUpdateHandler) {
    this.worker = new Worker(new URL('../../physics/worker.ts', import.meta.url), {
      type: 'module',
    })
    this.onUpdate = onUpdate
    this.worker.onmessage = (event: MessageEvent) => {
      const { type, data } = event.data || {}
      if (type === 'state') {
        this.onUpdate(new Float32Array(data))
      }
    }
  }

  /** Transfers initial buffers and parameters to the worker thread. */
  initialise(payload: SimulationInitPayload): void {
    this.worker.postMessage(
      {
        type: 'init',
        payload: {
          N: SIMULATION_CONFIG.riderCount,
          positions: payload.positions.buffer,
          yaw: payload.yawOffsets.buffer,
          path: payload.path.buffer,
          laneWidth: payload.laneWidth,
          roadWidth: payload.roadWidth,
          margin: payload.margin,
        },
      },
      [payload.positions.buffer, payload.yawOffsets.buffer, payload.path.buffer],
    )
  }

  /** Requests the worker to advance the simulation by dt seconds. */
  step(dt: number): void {
    this.worker.postMessage({ type: 'step', payload: { dt } })
  }
}
