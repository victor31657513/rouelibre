import {
  assertFinite,
  assertNonNegative,
  assertPositive,
  clamp,
  computeSingleRiderStepCandidateAtPower,
  validateLongitudinalEnvironment,
  validateSingleRiderProfile,
  validateSingleRiderState,
  type LongitudinalEnvironment,
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

interface SingleRiderEnergyStepResult {
  producedPowerWatts: number;
  nextAnaerobicReserveJoules: number;
  anaerobicPowerWatts: number;
  recoveryPowerWatts: number;
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

function validateSingleRiderEnergyState(
  energyState: SingleRiderEnergyState,
  energyProfile: SingleRiderEnergyProfile,
): void {
  assertFinite("energyState.anaerobicReserveJoules", energyState.anaerobicReserveJoules);
  if (energyState.anaerobicReserveJoules < 0 || energyState.anaerobicReserveJoules > energyProfile.anaerobicCapacityJoules) {
    throw new RangeError("energyState.anaerobicReserveJoules must be between 0 and energyProfile.anaerobicCapacityJoules");
  }
  assertFinite("energyState.lastAnaerobicPowerWatts", energyState.lastAnaerobicPowerWatts);
  assertFinite("energyState.lastRecoveryPowerWatts", energyState.lastRecoveryPowerWatts);
}

function validateCriticalPowerLimit(criticalPowerWatts: number, maxPowerWatts: number, maxPowerName: string): void {
  if (criticalPowerWatts > maxPowerWatts) {
    throw new RangeError(`energyProfile.criticalPowerWatts must be less than or equal to ${maxPowerName}`);
  }
}

function validateEnergyStepResult(result: SingleRiderEnergyStepResult, energyProfile: SingleRiderEnergyProfile): void {
  assertFinite("energyStep.producedPowerWatts", result.producedPowerWatts);
  assertFinite("energyStep.nextAnaerobicReserveJoules", result.nextAnaerobicReserveJoules);
  assertFinite("energyStep.anaerobicPowerWatts", result.anaerobicPowerWatts);
  assertFinite("energyStep.recoveryPowerWatts", result.recoveryPowerWatts);
  if (result.nextAnaerobicReserveJoules < 0 || result.nextAnaerobicReserveJoules > energyProfile.anaerobicCapacityJoules) {
    throw new RangeError("energyStep.nextAnaerobicReserveJoules must be between 0 and energyProfile.anaerobicCapacityJoules");
  }
  if (result.producedPowerWatts < 0) {
    throw new RangeError("energyStep.producedPowerWatts must be greater than or equal to zero");
  }
  if (result.anaerobicPowerWatts < 0 || result.recoveryPowerWatts < 0) {
    throw new RangeError("energyStep power components must be greater than or equal to zero");
  }
  if (result.anaerobicPowerWatts > 0 && result.recoveryPowerWatts > 0) {
    throw new RangeError("energyStep cannot consume and recover during the same step");
  }
}

function calculateSingleRiderEnergyStep(
  requestedPowerWatts: number,
  physicalMaxPowerWatts: number,
  energyState: SingleRiderEnergyState,
  energyProfile: SingleRiderEnergyProfile,
  dtSeconds: number,
): SingleRiderEnergyStepResult {
  const targetPowerWatts = clamp(requestedPowerWatts, 0, physicalMaxPowerWatts);
  const availableAnaerobicPowerWatts = energyState.anaerobicReserveJoules / dtSeconds;
  const requestedAnaerobicPowerWatts = Math.max(0, targetPowerWatts - energyProfile.criticalPowerWatts);
  const producedPowerWatts = targetPowerWatts > energyProfile.criticalPowerWatts
    ? energyProfile.criticalPowerWatts + Math.min(requestedAnaerobicPowerWatts, availableAnaerobicPowerWatts)
    : targetPowerWatts;
  const anaerobicPowerWatts = producedPowerWatts > energyProfile.criticalPowerWatts
    ? producedPowerWatts - energyProfile.criticalPowerWatts
    : 0;
  const potentialRecoveryPowerWatts = producedPowerWatts < energyProfile.criticalPowerWatts
    ? energyProfile.recoveryEfficiency * (energyProfile.criticalPowerWatts - producedPowerWatts)
    : 0;
  const reserveAfterConsumptionJoules = energyState.anaerobicReserveJoules - anaerobicPowerWatts * dtSeconds;
  const nextAnaerobicReserveJoules = clamp(
    reserveAfterConsumptionJoules + potentialRecoveryPowerWatts * dtSeconds,
    0,
    energyProfile.anaerobicCapacityJoules,
  );
  const recoveryPowerWatts = potentialRecoveryPowerWatts > 0
    ? (nextAnaerobicReserveJoules - reserveAfterConsumptionJoules) / dtSeconds
    : 0;
  const result = {
    producedPowerWatts,
    nextAnaerobicReserveJoules,
    anaerobicPowerWatts,
    recoveryPowerWatts,
    isPowerLimitedByEnergy: producedPowerWatts < targetPowerWatts,
  };

  validateEnergyStepResult(result, energyProfile);

  return result;
}

function validateSingleRiderEnergyInputs(
  physicalState: SingleRiderState,
  energyState: SingleRiderEnergyState,
  physicalProfile: SingleRiderProfile,
  energyProfile: SingleRiderEnergyProfile,
  environment: LongitudinalEnvironment,
  dtSeconds: number,
): void {
  validateSingleRiderState(physicalState);
  validateSingleRiderProfile(physicalProfile);
  validateLongitudinalEnvironment(environment);
  validateSingleRiderEnergyProfileShape(energyProfile);
  assertPositive("dtSeconds", dtSeconds);
  validateCriticalPowerLimit(energyProfile.criticalPowerWatts, physicalProfile.maxPowerWatts, "physicalProfile.maxPowerWatts");
  validateSingleRiderEnergyState(energyState, energyProfile);
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
  validateCriticalPowerLimit(energyProfile.criticalPowerWatts, physicalMaxPowerWatts, "physicalMaxPowerWatts");
  validateSingleRiderEnergyState(energyState, energyProfile);

  const result = calculateSingleRiderEnergyStep(
    requestedPowerWatts,
    physicalMaxPowerWatts,
    energyState,
    energyProfile,
    dtSeconds,
  );

  energyState.anaerobicReserveJoules = result.nextAnaerobicReserveJoules;
  energyState.lastAnaerobicPowerWatts = result.anaerobicPowerWatts;
  energyState.lastRecoveryPowerWatts = result.recoveryPowerWatts;
  energyState.isPowerLimitedByEnergy = result.isPowerLimitedByEnergy;

  return result.producedPowerWatts;
}

export function stepSingleRiderWithEnergy(
  physicalState: SingleRiderState,
  energyState: SingleRiderEnergyState,
  physicalProfile: SingleRiderProfile,
  energyProfile: SingleRiderEnergyProfile,
  environment: LongitudinalEnvironment,
  dtSeconds: number,
): void {
  validateSingleRiderEnergyInputs(physicalState, energyState, physicalProfile, energyProfile, environment, dtSeconds);

  const energyResult = calculateSingleRiderEnergyStep(
    physicalState.requestedPowerWatts,
    physicalProfile.maxPowerWatts,
    energyState,
    energyProfile,
    dtSeconds,
  );
  const physicalCandidate = computeSingleRiderStepCandidateAtPower(
    physicalState,
    physicalProfile,
    environment,
    dtSeconds,
    energyResult.producedPowerWatts,
  );

  energyState.anaerobicReserveJoules = energyResult.nextAnaerobicReserveJoules;
  energyState.lastAnaerobicPowerWatts = energyResult.anaerobicPowerWatts;
  energyState.lastRecoveryPowerWatts = energyResult.recoveryPowerWatts;
  energyState.isPowerLimitedByEnergy = energyResult.isPowerLimitedByEnergy;
  physicalState.timeSeconds = physicalCandidate.timeSeconds;
  physicalState.distanceMeters = physicalCandidate.distanceMeters;
  physicalState.speedMetersPerSecond = physicalCandidate.speedMetersPerSecond;
  physicalState.accelerationMetersPerSecondSquared = physicalCandidate.accelerationMetersPerSecondSquared;
  physicalState.producedPowerWatts = physicalCandidate.producedPowerWatts;
}
