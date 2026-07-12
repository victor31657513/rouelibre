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

interface SingleRiderStepCandidate {
  timeSeconds: number;
  distanceMeters: number;
  speedMetersPerSecond: number;
  accelerationMetersPerSecondSquared: number;
  producedPowerWatts: number;
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

export const defaultFlatRoadEnvironment: FlatRoadEnvironment = {
  airDensityKgPerCubicMeter: 1.225,
  windSpeedMetersPerSecond: 0,
  gravityMetersPerSecondSquared: 9.80665,
};

export function assertFinite(name: string, value: number): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be finite`);
  }
}

export function assertNonNegative(name: string, value: number): void {
  assertFinite(name, value);
  if (value < 0) {
    throw new RangeError(`${name} must be greater than or equal to zero`);
  }
}

export function assertPositive(name: string, value: number): void {
  assertFinite(name, value);
  if (value <= 0) {
    throw new RangeError(`${name} must be greater than zero`);
  }
}

export function validateSingleRiderProfile(profile: SingleRiderProfile): void {
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

export function validateFlatRoadEnvironment(environment: FlatRoadEnvironment): void {
  assertNonNegative("environment.airDensityKgPerCubicMeter", environment.airDensityKgPerCubicMeter);
  assertFinite("environment.windSpeedMetersPerSecond", environment.windSpeedMetersPerSecond);
  assertPositive("environment.gravityMetersPerSecondSquared", environment.gravityMetersPerSecondSquared);
}

export function validateSingleRiderState(state: SingleRiderState): void {
  assertNonNegative("state.timeSeconds", state.timeSeconds);
  assertNonNegative("state.distanceMeters", state.distanceMeters);
  assertNonNegative("state.speedMetersPerSecond", state.speedMetersPerSecond);
  assertFinite("state.accelerationMetersPerSecondSquared", state.accelerationMetersPerSecondSquared);
  assertFinite("state.requestedPowerWatts", state.requestedPowerWatts);
  assertNonNegative("state.producedPowerWatts", state.producedPowerWatts);
}

export function validateSingleRiderStepInputs(
  state: SingleRiderState,
  profile: SingleRiderProfile,
  environment: FlatRoadEnvironment,
  dtSeconds: number,
): void {
  validateSingleRiderState(state);
  validateSingleRiderProfile(profile);
  validateFlatRoadEnvironment(environment);
  assertPositive("dtSeconds", dtSeconds);
}

export function clamp(value: number, minimum: number, maximum: number): number {
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

function assertFiniteForces(forces: SingleRiderForces): void {
  assertFinite("forces.totalMassKg", forces.totalMassKg);
  assertFinite("forces.producedPowerWatts", forces.producedPowerWatts);
  assertFinite("forces.propulsiveForceNewtons", forces.propulsiveForceNewtons);
  assertFinite("forces.relativeAirSpeedMetersPerSecond", forces.relativeAirSpeedMetersPerSecond);
  assertFinite("forces.aerodynamicDragForceNewtons", forces.aerodynamicDragForceNewtons);
  assertFinite("forces.rollingResistanceForceNewtons", forces.rollingResistanceForceNewtons);
  assertFinite("forces.netForceNewtons", forces.netForceNewtons);
  assertFinite("forces.accelerationMetersPerSecondSquared", forces.accelerationMetersPerSecondSquared);
}

function assertProducedPowerInRange(producedPowerWatts: number, maxPowerWatts: number): void {
  assertFinite("producedPowerWatts", producedPowerWatts);
  if (producedPowerWatts < 0 || producedPowerWatts > maxPowerWatts) {
    throw new RangeError("producedPowerWatts must be between 0 and profile.maxPowerWatts");
  }
}

/**
 * Calcule les forces longitudinales avec une puissance produite explicite.
 * Cette fonction sert aux usages où la puissance a déjà été limitée, par
 * exemple par le modèle énergétique CP/W'.
 */
export function computeSingleRiderForcesAtPower(
  state: SingleRiderState,
  profile: SingleRiderProfile,
  environment: FlatRoadEnvironment,
  producedPowerWatts: number,
): SingleRiderForces {
  validateSingleRiderState(state);
  validateSingleRiderProfile(profile);
  validateFlatRoadEnvironment(environment);
  assertProducedPowerInRange(producedPowerWatts, profile.maxPowerWatts);

  const totalMassKg = profile.riderMassKg + profile.bikeMassKg;
  const maxPropulsiveForceNewtons = profile.maxPropulsiveForceNewtons;
  const effectivePowerWatts = producedPowerWatts * profile.mechanicalEfficiency;
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
    producedPowerWatts,
    propulsiveForceNewtons,
    relativeAirSpeedMetersPerSecond,
    aerodynamicDragForceNewtons,
    rollingResistanceForceNewtons,
    netForceNewtons,
    accelerationMetersPerSecondSquared,
  };

  assertFiniteForces(forces);

  return forces;
}

/**
 * Calcule les forces historiques en bornant `state.requestedPowerWatts` entre
 * zéro et `profile.maxPowerWatts`. Utiliser `computeSingleRiderForcesAtPower`
 * lorsque la puissance produite est déjà connue.
 */
export function computeSingleRiderForces(
  state: SingleRiderState,
  profile: SingleRiderProfile,
  environment: FlatRoadEnvironment,
): SingleRiderForces {
  validateSingleRiderState(state);
  validateSingleRiderProfile(profile);
  validateFlatRoadEnvironment(environment);

  return computeSingleRiderForcesAtPower(
    state,
    profile,
    environment,
    clamp(state.requestedPowerWatts, 0, profile.maxPowerWatts),
  );
}

export function computeSingleRiderStepCandidateAtPower(
  state: SingleRiderState,
  profile: SingleRiderProfile,
  environment: FlatRoadEnvironment,
  dtSeconds: number,
  producedPowerWatts: number,
): SingleRiderStepCandidate {
  validateSingleRiderStepInputs(state, profile, environment, dtSeconds);
  const forces = computeSingleRiderForcesAtPower(state, profile, environment, producedPowerWatts);
  const previousSpeedMetersPerSecond = Math.max(0, state.speedMetersPerSecond);
  const nextSpeedMetersPerSecond = Math.max(
    0,
    previousSpeedMetersPerSecond + forces.accelerationMetersPerSecondSquared * dtSeconds,
  );
  const nextTimeSeconds = state.timeSeconds + dtSeconds;
  const nextDistanceMeters = state.distanceMeters
    + ((previousSpeedMetersPerSecond + nextSpeedMetersPerSecond) / 2) * dtSeconds;
  const nextAccelerationMetersPerSecondSquared = (nextSpeedMetersPerSecond - previousSpeedMetersPerSecond) / dtSeconds;

  assertFinite("candidate.timeSeconds", nextTimeSeconds);
  assertFinite("candidate.distanceMeters", nextDistanceMeters);
  assertFinite("candidate.speedMetersPerSecond", nextSpeedMetersPerSecond);
  assertFinite("candidate.accelerationMetersPerSecondSquared", nextAccelerationMetersPerSecondSquared);
  assertFinite("candidate.producedPowerWatts", producedPowerWatts);

  return {
    timeSeconds: nextTimeSeconds,
    distanceMeters: nextDistanceMeters,
    speedMetersPerSecond: nextSpeedMetersPerSecond,
    accelerationMetersPerSecondSquared: nextAccelerationMetersPerSecondSquared,
    producedPowerWatts,
  };
}

export function stepSingleRiderWithProducedPower(
  state: SingleRiderState,
  profile: SingleRiderProfile,
  environment: FlatRoadEnvironment,
  dtSeconds: number,
  producedPowerWatts: number,
): void {
  const candidate = computeSingleRiderStepCandidateAtPower(state, profile, environment, dtSeconds, producedPowerWatts);

  state.timeSeconds = candidate.timeSeconds;
  state.distanceMeters = candidate.distanceMeters;
  state.speedMetersPerSecond = candidate.speedMetersPerSecond;
  state.accelerationMetersPerSecondSquared = candidate.accelerationMetersPerSecondSquared;
  state.producedPowerWatts = candidate.producedPowerWatts;
}

export function stepSingleRider(
  state: SingleRiderState,
  profile: SingleRiderProfile,
  environment: FlatRoadEnvironment,
  dtSeconds: number,
): void {
  validateSingleRiderStepInputs(state, profile, environment, dtSeconds);
  const candidate = computeSingleRiderStepCandidateAtPower(
    state,
    profile,
    environment,
    dtSeconds,
    clamp(state.requestedPowerWatts, 0, profile.maxPowerWatts),
  );

  state.timeSeconds = candidate.timeSeconds;
  state.distanceMeters = candidate.distanceMeters;
  state.speedMetersPerSecond = candidate.speedMetersPerSecond;
  state.accelerationMetersPerSecondSquared = candidate.accelerationMetersPerSecondSquared;
  state.producedPowerWatts = candidate.producedPowerWatts;
}
