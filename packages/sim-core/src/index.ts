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
  maxPropulsiveForceNewtons?: number;
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
  maxPropulsiveForceNewtons: 1_200,
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
  const totalMassKg = profile.riderMassKg + profile.bikeMassKg;
  const producedPowerWatts = clamp(state.requestedPowerWatts, 0, profile.maxPowerWatts);
  const maxPropulsiveForceNewtons = profile.maxPropulsiveForceNewtons ?? 1_200;
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
  assertFinite("dtSeconds", dtSeconds);
  if (dtSeconds <= 0) {
    throw new RangeError("dtSeconds must be greater than zero");
  }

  const forces = computeSingleRiderForces(state, profile, environment);
  const previousSpeedMetersPerSecond = Math.max(0, state.speedMetersPerSecond);
  const nextSpeedMetersPerSecond = Math.max(
    0,
    previousSpeedMetersPerSecond + forces.accelerationMetersPerSecondSquared * dtSeconds,
  );

  state.timeSeconds += dtSeconds;
  state.distanceMeters += ((previousSpeedMetersPerSecond + nextSpeedMetersPerSecond) / 2) * dtSeconds;
  state.speedMetersPerSecond = nextSpeedMetersPerSecond;
  state.accelerationMetersPerSecondSquared = forces.accelerationMetersPerSecondSquared;
  state.producedPowerWatts = forces.producedPowerWatts;

  assertFinite("timeSeconds", state.timeSeconds);
  assertFinite("distanceMeters", state.distanceMeters);
  assertFinite("speedMetersPerSecond", state.speedMetersPerSecond);
  assertFinite("accelerationMetersPerSecondSquared", state.accelerationMetersPerSecondSquared);
  assertFinite("producedPowerWatts", state.producedPowerWatts);
}
