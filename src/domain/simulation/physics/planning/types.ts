import type { OffsetCandidateResult, PathBoundaryMode } from '../riderPathing'
import type { PathSpline } from '../../route/pathSpline'
import type { Vector3 } from 'three'

export type OffsetPhaseQueueEntry = { offset: number; weight: number; ttl: number }

export type WeightTriple = { power: number; gap: number; wall: number }

export type RiderRoleProfile = { powerWeight: number; gapWeight: number }

export type RiderPose = { position: Vector3; tangent: Vector3 }

export type NeighborBounds = {
  min: Float32Array
  max: Float32Array
  hasNeighbor: boolean[]
}

export interface BaselineSpeedPlan {
  targetSpeed: number
  adaptiveMinSpeed: number
  planningSpeed: number
  rawTarget: number
}

export interface SpeedPlanResult {
  commandedTargetSpeed: number
  newSpeed: number
  biasedTarget: number
  rampTime: number
}

export interface OffsetPlanResult {
  plannedOffset: number
  compensation: number
  lateralDecision: OffsetCandidateResult
  updatedSequence: OffsetPhaseQueueEntry[]
}

export type { OffsetCandidateResult, PathBoundaryMode, PathSpline }
