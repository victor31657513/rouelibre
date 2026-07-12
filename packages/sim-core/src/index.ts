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

function assertFinite(name: string, value: number): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be finite`);
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

export function computeSingleRiderForces(
  state: SingleRiderState,
  profile: SingleRiderProfile,
  environment: FlatRoadEnvironment,
): SingleRiderForces {
  validateState(state);
  validateProfile(profile);
  validateEnvironment(environment);

  const totalMassKg = profile.riderMassKg + profile.bikeMassKg;
  const producedPowerWatts = clamp(state.requestedPowerWatts, 0, profile.maxPowerWatts);
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

  return {
    totalMassKg,
    producedPowerWatts,
    propulsiveForceNewtons,
    relativeAirSpeedMetersPerSecond,
    aerodynamicDragForceNewtons,
    rollingResistanceForceNewtons,
    netForceNewtons,
    accelerationMetersPerSecondSquared,
  };
}

export function stepSingleRider(
  state: SingleRiderState,
  profile: SingleRiderProfile,
  environment: FlatRoadEnvironment,
  dtSeconds: number,
): void {
  validateStepInputs(state, profile, environment, dtSeconds);

  const forces = computeSingleRiderForces(state, profile, environment);
  const previousSpeedMetersPerSecond = Math.max(0, state.speedMetersPerSecond);
  const nextSpeedMetersPerSecond = Math.max(
    0,
    previousSpeedMetersPerSecond + forces.accelerationMetersPerSecondSquared * dtSeconds,
  );

  state.timeSeconds += dtSeconds;
  state.distanceMeters += ((previousSpeedMetersPerSecond + nextSpeedMetersPerSecond) / 2) * dtSeconds;
  state.speedMetersPerSecond = nextSpeedMetersPerSecond;
  state.accelerationMetersPerSecondSquared = (nextSpeedMetersPerSecond - previousSpeedMetersPerSecond) / dtSeconds;
  state.producedPowerWatts = forces.producedPowerWatts;

  assertFinite("timeSeconds", state.timeSeconds);
  assertFinite("distanceMeters", state.distanceMeters);
  assertFinite("speedMetersPerSecond", state.speedMetersPerSecond);
  assertFinite("accelerationMetersPerSecondSquared", state.accelerationMetersPerSecondSquared);
  assertFinite("producedPowerWatts", state.producedPowerWatts);
}
