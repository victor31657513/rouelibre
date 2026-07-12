export const simCorePackageName = "@rouelibre/sim-core";

export function describeFoundation(): string {
  return "Roue libre simulation core foundation";
}

/** Profil physique minimal d'un coureur et de son vélo, en unités SI. */
export interface SingleRiderProfile {
  riderMassKg: number;
  bikeMassKg: number;
  cdaSquareMeters: number;
  rollingResistanceCoefficient: number;
  mechanicalEfficiency: number;
  maxPowerWatts: number;
  /**
   * Limite explicite de force propulsive à très basse vitesse.
   * Elle évite qu'une puissance finie produise une force infinie à l'arrêt.
   */
  maxPropulsiveForceNewtons: number;
}

/** Environnement longitudinal plat, en unités SI. */
export interface FlatRoadEnvironment {
  airDensityKgPerCubicMeter: number;
  /**
   * Vent longitudinal en m/s. Convention: valeur positive = vent de face,
   * valeur négative = vent arrière. La vitesse relative de l'air vaut
   * speedMetersPerSecond + windSpeedMetersPerSecond.
   */
  windSpeedMetersPerSecond: number;
  gravityMetersPerSecondSquared: number;
}

/** État dynamique mutable d'un coureur isolé, en unités SI. */
export interface SingleRiderState {
  timeSeconds: number;
  distanceMeters: number;
  speedMetersPerSecond: number;
  accelerationMetersPerSecondSquared: number;
  requestedPowerWatts: number;
  producedPowerWatts: number;
}

/** Paramètres énergétiques CP/W' minimaux d'un coureur isolé, en unités SI. */
export interface SingleRiderEnergyProfile {
  criticalPowerWatts: number;
  anaerobicCapacityJoules: number;
  recoveryEfficiency: number;
}

/** État énergétique mutable d'un coureur isolé, en unités SI. */
export interface SingleRiderEnergyState {
  anaerobicReserveJoules: number;
  anaerobicPowerWatts: number;
  lastRecoveryPowerWatts: number;
  isPowerLimitedByEnergy: boolean;
}

export interface SingleRiderForces {
  totalMassKg: number;
  producedPowerWatts: number;
  propulsiveForceNewtons: number;
  relativeAirSpeedMetersPerSecond: number;
  aerodynamicDragForceNewtons: number;
  rollingResistanceForceNewtons: number;
  netForceNewtons: number;
  accelerationMetersPerSecondSquared: number;
}

interface SingleRiderStepCandidate extends SingleRiderState {}

interface SingleRiderEnergyStepResult {
  producedPowerWatts: number;
  nextAnaerobicReserveJoules: number;
  anaerobicPowerWatts: number;
  recoveryPowerWatts: number;
  isPowerLimitedByEnergy: boolean;
}

export const defaultSingleRiderProfile: SingleRiderProfile = {
  riderMassKg: 75,
  bikeMassKg: 8,
  cdaSquareMeters: 0.32,
  rollingResistanceCoefficient: 0.004,
  mechanicalEfficiency: 0.97,
  maxPowerWatts: 1_200,
  maxPropulsiveForceNewtons: 200,
};

export const defaultSingleRiderEnergyProfile: SingleRiderEnergyProfile = {
  criticalPowerWatts: 250,
  anaerobicCapacityJoules: 20_000,
  recoveryEfficiency: 0.5,
};

export const defaultFlatRoadEnvironment: FlatRoadEnvironment = {
  airDensityKgPerCubicMeter: 1.225,
  windSpeedMetersPerSecond: 0,
  gravityMetersPerSecondSquared: 9.80665,
};

function assertFinite(name: string, value: number): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be finite`);
  }
}

function assertFiniteResult(name: string, value: number): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} result must be finite`);
  }
}

function assertNonNegative(name: string, value: number): void {
  assertFinite(name, value);
  if (value < 0) {
    throw new RangeError(`${name} must be greater than or equal to zero`);
  }
}

function assertPositive(name: string, value: number): void {
  assertFinite(name, value);
  if (value <= 0) {
    throw new RangeError(`${name} must be greater than zero`);
  }
}

function validateProfile(profile: SingleRiderProfile): void {
  assertPositive("profile.riderMassKg", profile.riderMassKg);
  assertNonNegative("profile.bikeMassKg", profile.bikeMassKg);
  assertPositive("profile.totalMassKg", profile.riderMassKg + profile.bikeMassKg);
  assertNonNegative("profile.cdaSquareMeters", profile.cdaSquareMeters);
  assertNonNegative("profile.rollingResistanceCoefficient", profile.rollingResistanceCoefficient);
  assertFinite("profile.mechanicalEfficiency", profile.mechanicalEfficiency);
  if (profile.mechanicalEfficiency < 0 || profile.mechanicalEfficiency > 1) {
    throw new RangeError("profile.mechanicalEfficiency must be between 0 and 1");
  }
  assertNonNegative("profile.maxPowerWatts", profile.maxPowerWatts);
  assertPositive("profile.maxPropulsiveForceNewtons", profile.maxPropulsiveForceNewtons);
}

function validateEnergyProfile(energyProfile: SingleRiderEnergyProfile): void {
  assertNonNegative("energyProfile.criticalPowerWatts", energyProfile.criticalPowerWatts);
  assertNonNegative("energyProfile.anaerobicCapacityJoules", energyProfile.anaerobicCapacityJoules);
  assertFinite("energyProfile.recoveryEfficiency", energyProfile.recoveryEfficiency);
  if (energyProfile.recoveryEfficiency < 0 || energyProfile.recoveryEfficiency > 1) {
    throw new RangeError("energyProfile.recoveryEfficiency must be between 0 and 1");
  }
}

function validateEnvironment(environment: FlatRoadEnvironment): void {
  assertNonNegative("environment.airDensityKgPerCubicMeter", environment.airDensityKgPerCubicMeter);
  assertFinite("environment.windSpeedMetersPerSecond", environment.windSpeedMetersPerSecond);
  assertPositive("environment.gravityMetersPerSecondSquared", environment.gravityMetersPerSecondSquared);
}

function validateState(state: SingleRiderState): void {
  assertNonNegative("state.timeSeconds", state.timeSeconds);
  assertNonNegative("state.distanceMeters", state.distanceMeters);
  assertNonNegative("state.speedMetersPerSecond", state.speedMetersPerSecond);
  assertFinite("state.accelerationMetersPerSecondSquared", state.accelerationMetersPerSecondSquared);
  assertFinite("state.requestedPowerWatts", state.requestedPowerWatts);
  assertNonNegative("state.producedPowerWatts", state.producedPowerWatts);
}

function validateEnergyState(energyState: SingleRiderEnergyState, energyProfile: SingleRiderEnergyProfile): void {
  assertNonNegative("energyState.anaerobicReserveJoules", energyState.anaerobicReserveJoules);
  if (energyState.anaerobicReserveJoules > energyProfile.anaerobicCapacityJoules) {
    throw new RangeError("energyState.anaerobicReserveJoules must be less than or equal to energyProfile.anaerobicCapacityJoules");
  }
  assertNonNegative("energyState.anaerobicPowerWatts", energyState.anaerobicPowerWatts);
  assertNonNegative("energyState.lastRecoveryPowerWatts", energyState.lastRecoveryPowerWatts);
}

function validateStepInputs(
  state: SingleRiderState,
  profile: SingleRiderProfile,
  environment: FlatRoadEnvironment,
  dtSeconds: number,
): void {
  validateState(state);
  validateProfile(profile);
  validateEnvironment(environment);
  assertPositive("dtSeconds", dtSeconds);
}

function validateCombinedStepInputs(
  state: SingleRiderState,
  energyState: SingleRiderEnergyState,
  profile: SingleRiderProfile,
  energyProfile: SingleRiderEnergyProfile,
  environment: FlatRoadEnvironment,
  dtSeconds: number,
): void {
  validateStepInputs(state, profile, environment, dtSeconds);
  validateEnergyProfile(energyProfile);
  validateEnergyState(energyState, energyProfile);
}

function validateForces(forces: SingleRiderForces): void {
  assertFiniteResult("forces.totalMassKg", forces.totalMassKg);
  assertFiniteResult("forces.producedPowerWatts", forces.producedPowerWatts);
  assertFiniteResult("forces.propulsiveForceNewtons", forces.propulsiveForceNewtons);
  assertFiniteResult("forces.relativeAirSpeedMetersPerSecond", forces.relativeAirSpeedMetersPerSecond);
  assertFiniteResult("forces.aerodynamicDragForceNewtons", forces.aerodynamicDragForceNewtons);
  assertFiniteResult("forces.rollingResistanceForceNewtons", forces.rollingResistanceForceNewtons);
  assertFiniteResult("forces.netForceNewtons", forces.netForceNewtons);
  assertFiniteResult("forces.accelerationMetersPerSecondSquared", forces.accelerationMetersPerSecondSquared);
}

function validateStateCandidate(candidate: SingleRiderStepCandidate): void {
  assertNonNegative("candidate.timeSeconds", candidate.timeSeconds);
  assertNonNegative("candidate.distanceMeters", candidate.distanceMeters);
  assertNonNegative("candidate.speedMetersPerSecond", candidate.speedMetersPerSecond);
  assertFiniteResult("candidate.accelerationMetersPerSecondSquared", candidate.accelerationMetersPerSecondSquared);
  assertFinite("candidate.requestedPowerWatts", candidate.requestedPowerWatts);
  assertNonNegative("candidate.producedPowerWatts", candidate.producedPowerWatts);
}

function validateEnergyStepResult(
  result: SingleRiderEnergyStepResult,
  energyProfile: SingleRiderEnergyProfile,
): void {
  assertFiniteResult("energy.producedPowerWatts", result.producedPowerWatts);
  assertFiniteResult("energy.nextAnaerobicReserveJoules", result.nextAnaerobicReserveJoules);
  assertFiniteResult("energy.anaerobicPowerWatts", result.anaerobicPowerWatts);
  assertFiniteResult("energy.recoveryPowerWatts", result.recoveryPowerWatts);
  if (result.producedPowerWatts < 0) {
    throw new RangeError("energy.producedPowerWatts result must be greater than or equal to zero");
  }
  if (result.nextAnaerobicReserveJoules < 0) {
    throw new RangeError("energy.nextAnaerobicReserveJoules result must be greater than or equal to zero");
  }
  if (result.nextAnaerobicReserveJoules > energyProfile.anaerobicCapacityJoules) {
    throw new RangeError("energy.nextAnaerobicReserveJoules result must be less than or equal to capacity");
  }
  if (result.anaerobicPowerWatts < 0) {
    throw new RangeError("energy.anaerobicPowerWatts result must be greater than or equal to zero");
  }
  if (result.recoveryPowerWatts < 0) {
    throw new RangeError("energy.recoveryPowerWatts result must be greater than or equal to zero");
  }
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export function createSingleRiderState(requestedPowerWatts: number): SingleRiderState {
  assertFinite("requestedPowerWatts", requestedPowerWatts);

  return {
    timeSeconds: 0,
    distanceMeters: 0,
    speedMetersPerSecond: 0,
    accelerationMetersPerSecondSquared: 0,
    requestedPowerWatts,
    producedPowerWatts: 0,
  };
}

export function createSingleRiderEnergyState(
  energyProfile: SingleRiderEnergyProfile = defaultSingleRiderEnergyProfile,
): SingleRiderEnergyState {
  validateEnergyProfile(energyProfile);

  return {
    anaerobicReserveJoules: energyProfile.anaerobicCapacityJoules,
    anaerobicPowerWatts: 0,
    lastRecoveryPowerWatts: 0,
    isPowerLimitedByEnergy: false,
  };
}

/**
 * Calcule les forces avec la puissance demandée de l'état, bornée par la puissance maximale du profil.
 * Pour une simulation couplée à l'énergie, utiliser `computeSingleRiderForcesAtPower` avec la puissance produite.
 */
export function computeSingleRiderForces(
  state: SingleRiderState,
  profile: SingleRiderProfile,
  environment: FlatRoadEnvironment,
): SingleRiderForces {
  return computeSingleRiderForcesAtPower(state, profile, environment, state.requestedPowerWatts);
}

/** Calcule les forces avec une puissance explicitement fournie, sans modifier l'état. */
export function computeSingleRiderForcesAtPower(
  state: SingleRiderState,
  profile: SingleRiderProfile,
  environment: FlatRoadEnvironment,
  producedPowerWatts: number,
): SingleRiderForces {
  validateState(state);
  validateProfile(profile);
  validateEnvironment(environment);
  assertFinite("producedPowerWatts", producedPowerWatts);

  const totalMassKg = profile.riderMassKg + profile.bikeMassKg;
  const boundedProducedPowerWatts = clamp(producedPowerWatts, 0, profile.maxPowerWatts);
  const maxPropulsiveForceNewtons = profile.maxPropulsiveForceNewtons;
  const effectivePowerWatts = boundedProducedPowerWatts * profile.mechanicalEfficiency;
  const forceFromPowerNewtons = effectivePowerWatts > 0
    ? effectivePowerWatts / Math.max(state.speedMetersPerSecond, effectivePowerWatts / maxPropulsiveForceNewtons)
    : 0;
  const propulsiveForceNewtons = Math.min(forceFromPowerNewtons, maxPropulsiveForceNewtons);
  const relativeAirSpeedMetersPerSecond = state.speedMetersPerSecond + environment.windSpeedMetersPerSecond;
  const aerodynamicDragForceNewtons = 0.5
    * environment.airDensityKgPerCubicMeter
    * profile.cdaSquareMeters
    * relativeAirSpeedMetersPerSecond
    * Math.abs(relativeAirSpeedMetersPerSecond);
  const rollingResistanceForceNewtons = profile.rollingResistanceCoefficient
    * totalMassKg
    * environment.gravityMetersPerSecondSquared
    * (state.speedMetersPerSecond > 0 || propulsiveForceNewtons > 0 ? 1 : 0);
  const netForceNewtons = propulsiveForceNewtons - aerodynamicDragForceNewtons - rollingResistanceForceNewtons;
  const accelerationMetersPerSecondSquared = netForceNewtons / totalMassKg;

  const forces = {
    totalMassKg,
    producedPowerWatts: boundedProducedPowerWatts,
    propulsiveForceNewtons,
    relativeAirSpeedMetersPerSecond,
    aerodynamicDragForceNewtons,
    rollingResistanceForceNewtons,
    netForceNewtons,
    accelerationMetersPerSecondSquared,
  };
  validateForces(forces);
  return forces;
}

function computeSingleRiderStepCandidate(
  state: SingleRiderState,
  forces: SingleRiderForces,
  dtSeconds: number,
): SingleRiderStepCandidate {
  const previousSpeedMetersPerSecond = Math.max(0, state.speedMetersPerSecond);
  const nextSpeedMetersPerSecond = Math.max(
    0,
    previousSpeedMetersPerSecond + forces.accelerationMetersPerSecondSquared * dtSeconds,
  );

  const candidate = {
    timeSeconds: state.timeSeconds + dtSeconds,
    distanceMeters: state.distanceMeters + ((previousSpeedMetersPerSecond + nextSpeedMetersPerSecond) / 2) * dtSeconds,
    speedMetersPerSecond: nextSpeedMetersPerSecond,
    accelerationMetersPerSecondSquared: (nextSpeedMetersPerSecond - previousSpeedMetersPerSecond) / dtSeconds,
    requestedPowerWatts: state.requestedPowerWatts,
    producedPowerWatts: forces.producedPowerWatts,
  };
  validateStateCandidate(candidate);
  return candidate;
}

function commitSingleRiderStep(state: SingleRiderState, candidate: SingleRiderStepCandidate): void {
  state.timeSeconds = candidate.timeSeconds;
  state.distanceMeters = candidate.distanceMeters;
  state.speedMetersPerSecond = candidate.speedMetersPerSecond;
  state.accelerationMetersPerSecondSquared = candidate.accelerationMetersPerSecondSquared;
  state.producedPowerWatts = candidate.producedPowerWatts;
}

function computeSingleRiderEnergyStep(
  requestedPowerWatts: number,
  energyState: SingleRiderEnergyState,
  energyProfile: SingleRiderEnergyProfile,
  dtSeconds: number,
): SingleRiderEnergyStepResult {
  assertFinite("requestedPowerWatts", requestedPowerWatts);
  validateEnergyProfile(energyProfile);
  validateEnergyState(energyState, energyProfile);
  assertPositive("dtSeconds", dtSeconds);

  const requestedPositivePowerWatts = Math.max(0, requestedPowerWatts);
  const requestedAnaerobicPowerWatts = Math.max(0, requestedPositivePowerWatts - energyProfile.criticalPowerWatts);
  const availableAnaerobicPowerWatts = energyState.anaerobicReserveJoules / dtSeconds;
  const anaerobicPowerWatts = Math.min(requestedAnaerobicPowerWatts, availableAnaerobicPowerWatts);
  const isPowerLimitedByEnergy = anaerobicPowerWatts < requestedAnaerobicPowerWatts;
  const producedPowerWatts = requestedPositivePowerWatts > energyProfile.criticalPowerWatts
    ? energyProfile.criticalPowerWatts + anaerobicPowerWatts
    : requestedPositivePowerWatts;

  if (requestedPositivePowerWatts >= energyProfile.criticalPowerWatts) {
    const nextAnaerobicReserveJoules = energyState.anaerobicReserveJoules - anaerobicPowerWatts * dtSeconds;
    const result = {
      producedPowerWatts,
      nextAnaerobicReserveJoules,
      anaerobicPowerWatts,
      recoveryPowerWatts: 0,
      isPowerLimitedByEnergy,
    };
    validateEnergyStepResult(result, energyProfile);
    return result;
  }

  const potentialRecoveryPowerWatts = (energyProfile.criticalPowerWatts - requestedPositivePowerWatts)
    * energyProfile.recoveryEfficiency;
  const nextAnaerobicReserveJoules = Math.min(
    energyProfile.anaerobicCapacityJoules,
    energyState.anaerobicReserveJoules + potentialRecoveryPowerWatts * dtSeconds,
  );
  const recoveryPowerWatts = (nextAnaerobicReserveJoules - energyState.anaerobicReserveJoules) / dtSeconds;
  const result = {
    producedPowerWatts,
    nextAnaerobicReserveJoules,
    anaerobicPowerWatts: 0,
    recoveryPowerWatts,
    isPowerLimitedByEnergy: false,
  };
  validateEnergyStepResult(result, energyProfile);
  return result;
}

function commitSingleRiderEnergyStep(
  energyState: SingleRiderEnergyState,
  result: SingleRiderEnergyStepResult,
): void {
  energyState.anaerobicReserveJoules = result.nextAnaerobicReserveJoules;
  energyState.anaerobicPowerWatts = result.anaerobicPowerWatts;
  energyState.lastRecoveryPowerWatts = result.recoveryPowerWatts;
  energyState.isPowerLimitedByEnergy = result.isPowerLimitedByEnergy;
}

export function stepSingleRiderEnergy(
  state: SingleRiderState,
  energyState: SingleRiderEnergyState,
  energyProfile: SingleRiderEnergyProfile,
  dtSeconds: number,
): void {
  validateState(state);
  validateEnergyProfile(energyProfile);
  validateEnergyState(energyState, energyProfile);
  assertPositive("dtSeconds", dtSeconds);

  const result = computeSingleRiderEnergyStep(state.requestedPowerWatts, energyState, energyProfile, dtSeconds);
  commitSingleRiderEnergyStep(energyState, result);
  state.producedPowerWatts = result.producedPowerWatts;
}

export function stepSingleRider(
  state: SingleRiderState,
  profile: SingleRiderProfile,
  environment: FlatRoadEnvironment,
  dtSeconds: number,
): void {
  validateStepInputs(state, profile, environment, dtSeconds);

  const forces = computeSingleRiderForces(state, profile, environment);
  const candidate = computeSingleRiderStepCandidate(state, forces, dtSeconds);
  commitSingleRiderStep(state, candidate);
}

export function stepSingleRiderWithEnergy(
  state: SingleRiderState,
  energyState: SingleRiderEnergyState,
  profile: SingleRiderProfile,
  energyProfile: SingleRiderEnergyProfile,
  environment: FlatRoadEnvironment,
  dtSeconds: number,
): void {
  validateCombinedStepInputs(state, energyState, profile, energyProfile, environment, dtSeconds);

  const energyResult = computeSingleRiderEnergyStep(state.requestedPowerWatts, energyState, energyProfile, dtSeconds);
  const forces = computeSingleRiderForcesAtPower(state, profile, environment, energyResult.producedPowerWatts);
  const candidate = computeSingleRiderStepCandidate(state, forces, dtSeconds);

  validateEnergyStepResult(energyResult, energyProfile);
  validateStateCandidate(candidate);

  commitSingleRiderEnergyStep(energyState, energyResult);
  commitSingleRiderStep(state, candidate);
}
