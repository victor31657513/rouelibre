export interface SimulationParameterOverrides {
  /** Look-ahead distance used when sampling the route ahead of each rider. */
  lookAhead?: number
  /** Maximum yaw rate applied when orienting riders along the spline. */
  maxYawRate?: number
  /** Maximum yaw acceleration applied when orienting riders along the spline. */
  maxYawAccel?: number
  /** Minimum curvature radius used when computing safe corner speeds. */
  minRadius?: number
  /** Absolute ceiling applied to commanded target speeds. */
  maxTargetSpeed?: number
  /** Absolute floor applied to commanded target speeds. */
  minTargetSpeed?: number
  /** Maximum longitudinal acceleration achievable by riders. */
  maxAcceleration?: number
  /** Maximum longitudinal deceleration achievable by riders. */
  maxDeceleration?: number
  /** First-order damping applied to the commanded target speed filter. */
  targetSpeedDamping?: number
  /** Upward slew rate applied to the commanded target speed. */
  targetRiseRateLimit?: number
  /** Downward slew rate applied to the commanded target speed. */
  targetDropRateLimit?: number
  /** Lateral acceleration limit enforced when deriving safe corner speeds. */
  aLatMax?: number
  /** Rolling resistance coefficient (dimensionless). */
  Crr?: number
  /** Baseline drag area (CdA) before drafting adjustments. */
  CdA0?: number
  /** Air density expressed in kg/m^3. */
  rho?: number
  /** Drivetrain efficiency factor. */
  drivetrainEfficiency?: number
  /** Average combined system mass for riders sampled at initialisation. */
  systemMass?: number
  /** Nominal power available for riders sampled at initialisation. */
  powerAvailable?: number
  /** Maximum drafting reduction applied to CdA (S_max). */
  S_max?: number
  /** Minimum aerodynamic factor reached in dense packs (β). */
  beta?: number
  /** Characteristic distance controlling drafting falloff (λ_draft). */
  lambdaDraft?: number
  /** Weight applied to the power term in lateral cost evaluation. */
  wP?: number
  /** Weight applied to the gap term in lateral cost evaluation. */
  wG?: number
  /** Weight applied to the wall proximity term in lateral cost evaluation. */
  wW?: number
  /** Intensity threshold above which a bend is considered a hairpin. */
  corneringIntensityThreshold?: number
  /** Coverage threshold complementing the hairpin detection. */
  corneringCoverageThreshold?: number
  /** Effective radius threshold (in metres) below which a hairpin is assumed. */
  corneringRadiusThreshold?: number
  /** Target lateral acceleration enforced specifically for hairpins. */
  corneringLateralAcceleration?: number
  /** Severity threshold above which the cornering limit becomes active. */
  corneringSeverityThreshold?: number
  /** Optional floor applied to cornering speed on very wide bends. */
  cornerSpeedFloor?: number
  /** Range multiplier controlling how quickly the cornering floor fades out. */
  cornerFloorTransitionFactor?: number
  /** Exponent applied to hairpin braking activation. */
  hairpinBrakingExponent?: number
  /** Ratio used to reduce speed in hairpins based on target speed. */
  curveSpeedMarginRatio?: number
  /** Minimum margin applied when reducing speed for hairpins. */
  curveSpeedMarginMin?: number
  /** Maximum margin applied when reducing speed for hairpins. */
  curveSpeedMarginMax?: number
}

export type SimulationParameterDefaults = Required<SimulationParameterOverrides>

export const DEFAULT_WORKER_PARAMS: SimulationParameterDefaults = {
  lookAhead: 5,
  maxYawRate: 360,
  maxYawAccel: 1440,
  minRadius: 30,
  maxTargetSpeed: 9,
  minTargetSpeed: 5,
  maxAcceleration: 0.8,
  maxDeceleration: 1.6,
  targetSpeedDamping: 4.0,
  targetRiseRateLimit: 0.8,
  targetDropRateLimit: 1.0,
  aLatMax: 5.5,
  Crr: 0.004,
  CdA0: 0.32,
  rho: 1.2,
  drivetrainEfficiency: 0.97,
  systemMass: 82,
  powerAvailable: 380,
  S_max: 0.45,
  beta: 0.45,
  lambdaDraft: 6,
  wP: 0.55,
  wG: 0.3,
  wW: 0.15,
  corneringIntensityThreshold: 0.7,
  corneringCoverageThreshold: 0.55,
  corneringRadiusThreshold: 22,
  corneringLateralAcceleration: 4.6,
  corneringSeverityThreshold: 0.58,
  cornerSpeedFloor: 0.94,
  cornerFloorTransitionFactor: 1.8,
  hairpinBrakingExponent: 1.6,
  curveSpeedMarginRatio: 0.04,
  curveSpeedMarginMin: 0.05,
  curveSpeedMarginMax: 0.25,
}
