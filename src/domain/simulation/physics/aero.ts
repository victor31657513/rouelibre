export interface DraftingFactorOptions {
  /** Minimum aerodynamic factor applied when riding in a dense pack. */
  minFactor?: number
  /** Maximum reduction applied when tucked closely behind several riders. */
  maxReduction?: number
  /** Characteristic distance controlling how fast drafting benefits decay. */
  characteristicDistance?: number
}

/**
 * Returns the aerodynamic scaling S(d, n_front) applied to the reference CdA.
 * A value of 1 means no drafting benefit whereas values closer to `minFactor`
 * reflect strong slipstream protection.
 */
export function draftingFactor(
  distanceToLeader: number,
  ridersAhead: number,
  options: DraftingFactorOptions = {},
): number {
  if (!Number.isFinite(distanceToLeader) || distanceToLeader < 0) {
    distanceToLeader = 0
  }
  if (!Number.isFinite(ridersAhead) || ridersAhead <= 0) {
    return 1
  }

  const {
    minFactor = 0.45,
    maxReduction = 0.45,
    characteristicDistance = 6,
  } = options

  const safeMinFactor = Math.min(Math.max(minFactor, 0.1), 1)
  const safeMaxReduction = Math.min(Math.max(maxReduction, 0), 0.9)
  const safeCharacteristic = Math.max(characteristicDistance, 0.5)

  const effectiveAhead = Math.max(0, Math.min(ridersAhead, 8))
  const densityFactor = effectiveAhead / 8
  const spacing = distanceToLeader
  const draftingStrength = Math.exp(-spacing / safeCharacteristic)
  const reduction = safeMaxReduction * draftingStrength * (0.35 + 0.65 * densityFactor)
  const rawFactor = 1 - reduction
  return Math.min(1, Math.max(safeMinFactor, rawFactor))
}

export interface PowerDemandParams {
  /** Air density in kg/m^3. */
  airDensity: number
  /** Effective drag area (CdA) in m^2. */
  cdA: number
  /** Rolling resistance coefficient (dimensionless). */
  crr: number
  /** Combined mass of rider and bike in kg. */
  mass: number
  /** Road slope expressed as rise over run (dimensionless). */
  slope?: number
  /** Gravitational acceleration in m/s^2 (defaults to 9.80665). */
  gravity?: number
  /** Drivetrain efficiency as a unitless ratio (defaults to 0.97). */
  drivetrainEfficiency?: number
}

/** Computes the mechanical power required to maintain the provided velocity. */
export function powerDemand(velocity: number, params: PowerDemandParams): number {
  if (!Number.isFinite(velocity) || velocity <= 0) {
    return 0
  }

  const {
    airDensity,
    cdA,
    crr,
    mass,
    slope = 0,
    gravity = 9.80665,
    drivetrainEfficiency = 0.97,
  } = params

  const safeDensity = Math.max(0, airDensity)
  const safeCdA = Math.max(0, cdA)
  const safeCrr = Math.max(0, crr)
  const safeMass = Math.max(0, mass)
  const safeEfficiency = Math.min(Math.max(drivetrainEfficiency, 1e-3), 1)

  const dragPower = 0.5 * safeDensity * safeCdA * velocity * velocity * velocity
  const normalForce = safeMass * gravity
  const rollingPower = safeCrr * normalForce * velocity
  const climbPower = safeMass * gravity * slope * velocity

  const mechanicalPower = dragPower + rollingPower + climbPower
  return mechanicalPower / safeEfficiency
}

export interface SolveVelocityOptions extends PowerDemandParams {
  /** Maximum number of iterations used when refining the solution. */
  maxIterations?: number
  /** Tolerance applied to the power difference when converging. */
  tolerance?: number
  /** Upper bound used to expand the search window (defaults to 25 m/s). */
  initialUpperBound?: number
}

/**
 * Finds the steady-state velocity yielding the provided power output using a
 * monotonic bisection search. Returns 0 if the available power is insufficient.
 */
export function solveVelocityFromPower(
  powerAvailable: number,
  options: SolveVelocityOptions,
): number {
  if (!Number.isFinite(powerAvailable) || powerAvailable <= 0) {
    return 0
  }

  const {
    maxIterations = 32,
    tolerance = 0.05,
    initialUpperBound = 25,
    ...params
  } = options

  let upper = Math.max(initialUpperBound, 5)
  let lower = 0
  const target = powerAvailable

  while (powerDemand(upper, params) < target && upper < 60) {
    upper *= 1.5
  }

  for (let i = 0; i < maxIterations; i++) {
    const mid = (lower + upper) / 2
    const required = powerDemand(mid, params)
    const diff = required - target
    if (Math.abs(diff) <= tolerance) {
      return mid
    }
    if (required > target) {
      upper = mid
    } else {
      lower = mid
    }
  }

  return (lower + upper) / 2
}
