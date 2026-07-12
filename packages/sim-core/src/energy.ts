import {
  assertFinite,
  assertNonNegative,
  assertPositive,
  clamp,
  stepSingleRiderWithProducedPower,
  validateFlatRoadEnvironment,
  validateSingleRiderProfile,
  validateSingleRiderState,
  type FlatRoadEnvironment,
  type SingleRiderProfile,
  type SingleRiderState,
} from "./longitudinal.js";

/** Profil énergétique minimal CP/W' d'un coureur isolé, en unités SI. */
export interface SingleRiderEnergyProfile {
  criticalPowerWatts: number;
  anaerobicCapacityJoules: number;
  recoveryEfficiency: number;
}

/** État énergétique mutable CP/W' d'un coureur isolé, en unités SI. */
export interface SingleRiderEnergyState {
  anaerobicReserveJoules: number;
  lastAnaerobicPowerWatts: number;
  lastRecoveryPowerWatts: number;
  isPowerLimitedByEnergy: boolean;
}

export function createSingleRiderEnergyState(
  profile: SingleRiderEnergyProfile,
  initialAnaerobicReserveJoules = profile.anaerobicCapacityJoules,
): SingleRiderEnergyState {
  validateSingleRiderEnergyProfileShape(profile);
  assertFinite("initialAnaerobicReserveJoules", initialAnaerobicReserveJoules);
  if (initialAnaerobicReserveJoules < 0 || initialAnaerobicReserveJoules > profile.anaerobicCapacityJoules) {
    throw new RangeError("initialAnaerobicReserveJoules must be between 0 and profile.anaerobicCapacityJoules");
  }

  return {
    anaerobicReserveJoules: initialAnaerobicReserveJoules,
    lastAnaerobicPowerWatts: 0,
    lastRecoveryPowerWatts: 0,
    isPowerLimitedByEnergy: false,
  };
}

function validateSingleRiderEnergyProfileShape(profile: SingleRiderEnergyProfile): void {
  assertPositive("energyProfile.criticalPowerWatts", profile.criticalPowerWatts);
  assertNonNegative("energyProfile.anaerobicCapacityJoules", profile.anaerobicCapacityJoules);
  assertFinite("energyProfile.recoveryEfficiency", profile.recoveryEfficiency);
  if (profile.recoveryEfficiency < 0 || profile.recoveryEfficiency > 1) {
    throw new RangeError("energyProfile.recoveryEfficiency must be between 0 and 1");
  }
}

function validateSingleRiderEnergyInputs(
  physicalState: SingleRiderState,
  energyState: SingleRiderEnergyState,
  physicalProfile: SingleRiderProfile,
  energyProfile: SingleRiderEnergyProfile,
  environment: FlatRoadEnvironment,
  dtSeconds: number,
): void {
  validateSingleRiderState(physicalState);
  validateSingleRiderProfile(physicalProfile);
  validateFlatRoadEnvironment(environment);
  validateSingleRiderEnergyProfileShape(energyProfile);
  assertPositive("dtSeconds", dtSeconds);

  if (energyProfile.criticalPowerWatts > physicalProfile.maxPowerWatts) {
    throw new RangeError("energyProfile.criticalPowerWatts must be less than or equal to physicalProfile.maxPowerWatts");
  }

  assertFinite("energyState.anaerobicReserveJoules", energyState.anaerobicReserveJoules);
  if (energyState.anaerobicReserveJoules < 0 || energyState.anaerobicReserveJoules > energyProfile.anaerobicCapacityJoules) {
    throw new RangeError("energyState.anaerobicReserveJoules must be between 0 and energyProfile.anaerobicCapacityJoules");
  }
  assertFinite("energyState.lastAnaerobicPowerWatts", energyState.lastAnaerobicPowerWatts);
  assertFinite("energyState.lastRecoveryPowerWatts", energyState.lastRecoveryPowerWatts);
}

export function stepSingleRiderEnergy(
  requestedPowerWatts: number,
  physicalMaxPowerWatts: number,
  energyState: SingleRiderEnergyState,
  energyProfile: SingleRiderEnergyProfile,
  dtSeconds: number,
): number {
  assertFinite("requestedPowerWatts", requestedPowerWatts);
  assertNonNegative("physicalMaxPowerWatts", physicalMaxPowerWatts);
  validateSingleRiderEnergyProfileShape(energyProfile);
  assertPositive("dtSeconds", dtSeconds);
  if (energyProfile.criticalPowerWatts > physicalMaxPowerWatts) {
    throw new RangeError("energyProfile.criticalPowerWatts must be less than or equal to physicalMaxPowerWatts");
  }
  assertFinite("energyState.anaerobicReserveJoules", energyState.anaerobicReserveJoules);
  if (energyState.anaerobicReserveJoules < 0 || energyState.anaerobicReserveJoules > energyProfile.anaerobicCapacityJoules) {
    throw new RangeError("energyState.anaerobicReserveJoules must be between 0 and energyProfile.anaerobicCapacityJoules");
  }
  assertFinite("energyState.lastAnaerobicPowerWatts", energyState.lastAnaerobicPowerWatts);
  assertFinite("energyState.lastRecoveryPowerWatts", energyState.lastRecoveryPowerWatts);

  const targetPowerWatts = clamp(requestedPowerWatts, 0, physicalMaxPowerWatts);
  const availableAnaerobicPowerWatts = energyState.anaerobicReserveJoules / dtSeconds;
  const requestedAnaerobicPowerWatts = Math.max(0, targetPowerWatts - energyProfile.criticalPowerWatts);
  const producedPowerWatts = targetPowerWatts > energyProfile.criticalPowerWatts
    ? energyProfile.criticalPowerWatts + Math.min(requestedAnaerobicPowerWatts, availableAnaerobicPowerWatts)
    : targetPowerWatts;
  const lastAnaerobicPowerWatts = producedPowerWatts > energyProfile.criticalPowerWatts
    ? producedPowerWatts - energyProfile.criticalPowerWatts
    : 0;
  const lastRecoveryPowerWatts = producedPowerWatts < energyProfile.criticalPowerWatts
    ? energyProfile.recoveryEfficiency * (energyProfile.criticalPowerWatts - producedPowerWatts)
    : 0;
  const nextReserveJoules = clamp(
    energyState.anaerobicReserveJoules - lastAnaerobicPowerWatts * dtSeconds + lastRecoveryPowerWatts * dtSeconds,
    0,
    energyProfile.anaerobicCapacityJoules,
  );
  const isPowerLimitedByEnergy = producedPowerWatts < targetPowerWatts;

  energyState.anaerobicReserveJoules = nextReserveJoules;
  energyState.lastAnaerobicPowerWatts = lastAnaerobicPowerWatts;
  energyState.lastRecoveryPowerWatts = lastRecoveryPowerWatts;
  energyState.isPowerLimitedByEnergy = isPowerLimitedByEnergy;

  return producedPowerWatts;
}

export function stepSingleRiderWithEnergy(
  physicalState: SingleRiderState,
  energyState: SingleRiderEnergyState,
  physicalProfile: SingleRiderProfile,
  energyProfile: SingleRiderEnergyProfile,
  environment: FlatRoadEnvironment,
  dtSeconds: number,
): void {
  validateSingleRiderEnergyInputs(physicalState, energyState, physicalProfile, energyProfile, environment, dtSeconds);

  const targetPowerWatts = clamp(physicalState.requestedPowerWatts, 0, physicalProfile.maxPowerWatts);
  const availableAnaerobicPowerWatts = energyState.anaerobicReserveJoules / dtSeconds;
  const requestedAnaerobicPowerWatts = Math.max(0, targetPowerWatts - energyProfile.criticalPowerWatts);
  const producedPowerWatts = targetPowerWatts > energyProfile.criticalPowerWatts
    ? energyProfile.criticalPowerWatts + Math.min(requestedAnaerobicPowerWatts, availableAnaerobicPowerWatts)
    : targetPowerWatts;
  const lastAnaerobicPowerWatts = producedPowerWatts > energyProfile.criticalPowerWatts
    ? producedPowerWatts - energyProfile.criticalPowerWatts
    : 0;
  const lastRecoveryPowerWatts = producedPowerWatts < energyProfile.criticalPowerWatts
    ? energyProfile.recoveryEfficiency * (energyProfile.criticalPowerWatts - producedPowerWatts)
    : 0;
  const nextReserveJoules = clamp(
    energyState.anaerobicReserveJoules - lastAnaerobicPowerWatts * dtSeconds + lastRecoveryPowerWatts * dtSeconds,
    0,
    energyProfile.anaerobicCapacityJoules,
  );
  const isPowerLimitedByEnergy = producedPowerWatts < targetPowerWatts;

  energyState.anaerobicReserveJoules = nextReserveJoules;
  energyState.lastAnaerobicPowerWatts = lastAnaerobicPowerWatts;
  energyState.lastRecoveryPowerWatts = lastRecoveryPowerWatts;
  energyState.isPowerLimitedByEnergy = isPowerLimitedByEnergy;
  stepSingleRiderWithProducedPower(physicalState, physicalProfile, environment, dtSeconds, producedPowerWatts);
}
