/**
 * @fileoverview Centralised configuration constants for the Roue Libre demo.
 * Exposes immutable values describing the simulation scale, camera setup and
 * road appearance so that other modules can share the same source of truth.
 *
 * Extension: Adjust the exported objects or extend them with new fields when
 * introducing new tunable parameters. All controllers consume the config via
 * named imports, so adding new constants is safe as long as they remain read-only.
 */
export const SIMULATION_CONFIG = {
  /** Total number of riders simulated both in the worker and the renderer. */
  riderCount: 184,
  /** Seed used by pseudo random utilities to keep the simulation deterministic. */
  rngSeed: 1234,
  /** Longitudinal spacing (in meters) between riders at start up. */
  startSpacing: 1.2,
  /** Width of an individual lane used to clamp lateral offsets. */
  laneWidth: 1.0,
  /** Horizontal clearance applied around the available road surface. */
  roadMargin: 0.05,
}

export const CAMERA_CONFIG = {
  /** Distance behind the tracked rider for the follow camera. */
  followDistance: 10,
  /** Vertical offset used when snapping the camera to a rider. */
  followHeight: 6,
  /** Minimum field of view allowed during zooming interactions. */
  minFov: 20,
  /** Maximum field of view allowed during zooming interactions. */
  maxFov: 100,
  /** Sensitivity factor for manual yaw offsets when using the middle mouse. */
  rotationSensitivity: 0.005,
}

export const ROAD_CONFIG = {
  /** Width of the rendered and simulated road surface. */
  width: 8,
  /** Length of each centre dash painted on the road mesh. */
  dashLength: 2,
  /** Gap between consecutive dashes on the road centre line. */
  gapLength: 10,
  /** Width of the centre line geometry. */
  lineWidth: 0.15,
  /** Offset (in metres) applied to the start line placement. */
  startLineOffset: 1,
  /** Width of the rendered start line mesh. */
  startLineWidth: 0.3,
}
