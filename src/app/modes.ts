/**
 * Simulation modes controlling rider counts and team configurations.
 *
 * Extension: make the palette configurable by exposing a settings panel that
 * persists the preferred colours in local storage before instantiating the
 * application controller.
 */
import type { SimulationParameterOverrides } from '../domain/simulation/physics/workerParams'

export type SimulationModeId = 'solo' | 'team' | 'peloton'

export interface SimulationMode {
  /** Stable identifier used internally to reference the mode. */
  id: SimulationModeId
  /** Human readable label displayed in the UI. */
  label: string
  /** Number of riders spawned when the mode is active. */
  riderCount: number
  /** Optional description displayed in the UI. */
  description?: string
  /**
   * Optional set of colours applied to riders. When provided, the palette is
   * consumed sequentially using {@link teamSize} riders per colour.
   */
  teamColors?: readonly string[]
  /**
   * Number of riders grouped under the same team colour. Only used when
   * {@link teamColors} is provided.
   */
  teamSize?: number
  /** Optional worker parameter overrides tailored for the mode. */
  workerParams?: SimulationParameterOverrides
}

/** Preferred default mode shown on startup. */
export const DEFAULT_MODE_ID: SimulationModeId = 'peloton'

const PELOTON_TEAM_COLOURS: readonly string[] = [
  '#ff6b6b',
  '#f7b731',
  '#20bf6b',
  '#4b7bec',
  '#a55eea',
  '#45aaf2',
  '#2bcbba',
  '#fd9644',
  '#fc5c65',
  '#26de81',
  '#3867d6',
  '#eb3b5a',
  '#fa8231',
  '#0fb9b1',
  '#f5cd79',
  '#778ca3',
  '#8854d0',
  '#4b6584',
  '#a5b1c2',
  '#2d98da',
  '#3867a6',
  '#ff9f1a',
  '#1dd1a1',
]

/** List of supported simulation modes. */
export const SIMULATION_MODES: readonly SimulationMode[] = [
  {
    id: 'solo',
    label: 'Solo',
    riderCount: 1,
    description: '1 coureur',
    workerParams: {
      corneringIntensityThreshold: 0.88,
      corneringCoverageThreshold: 0.68,
      corneringRadiusThreshold: 16,
      corneringSeverityThreshold: 0.7,
    },
  },
  { id: 'team', label: 'Équipe', riderCount: 8, description: '8 coureurs' },
  {
    id: 'peloton',
    label: 'Peloton',
    riderCount: 23 * 8,
    description: '23 équipes',
    teamColors: PELOTON_TEAM_COLOURS,
    teamSize: 8,
  },
]

/** Retrieves a simulation mode by id, falling back to the default when missing. */
export function getModeById(id: SimulationModeId | string): SimulationMode {
  const mode = SIMULATION_MODES.find((entry) => entry.id === id)
  if (mode) {
    return mode
  }
  const fallback = SIMULATION_MODES.find((entry) => entry.id === DEFAULT_MODE_ID)
  if (!fallback) {
    throw new Error('No simulation modes configured')
  }
  return fallback
}
