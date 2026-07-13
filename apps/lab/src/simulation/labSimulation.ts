import {
  computeSingleRiderForcesAtPower,
  createSingleRiderEnergyState,
  createSingleRiderState,
  defaultLongitudinalEnvironment,
  defaultSingleRiderProfile,
  stepSingleRiderWithEnergy,
  type LongitudinalEnvironment,
  type SingleRiderEnergyProfile,
  type SingleRiderEnergyState,
  type SingleRiderForces,
  type SingleRiderState,
} from "@rouelibre/sim-core";

export const LAB_TICK_SECONDS = 1 / 60;
export const LAB_INITIAL_REQUESTED_POWER_WATTS = 250;
export const LAB_INITIAL_ROAD_GRADE_PERCENT = 0;
export const LAB_ENERGY_PROFILE: Readonly<SingleRiderEnergyProfile> = Object.freeze({
  criticalPowerWatts: 250,
  anaerobicCapacityJoules: 20_000,
  recoveryEfficiency: 0.5,
});

export interface LabSimulationSnapshot {
  readonly physicalState: Readonly<SingleRiderState>;
  readonly energyState: Readonly<SingleRiderEnergyState>;
  readonly energyProfile: Readonly<SingleRiderEnergyProfile>;
  readonly environment: Readonly<LongitudinalEnvironment>;
  readonly forces: Readonly<SingleRiderForces>;
  readonly tickSeconds: number;
}

export interface LabSimulation {
  setRequestedPowerWatts(value: number): void;
  setWindSpeedMetersPerSecond(value: number): void;
  setRoadGradePercent(value: number): void;
  stepTicks(count: number): void;
  reset(): void;
  getSnapshot(): LabSimulationSnapshot;
}

function assertFiniteControl(name: string, value: number): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be finite`);
  }
}

function assertTickCount(count: number): void {
  if (!Number.isFinite(count) || !Number.isInteger(count) || count < 0) {
    throw new RangeError("tick count must be a non-negative finite integer");
  }
}

function copyPhysicalState(state: SingleRiderState): SingleRiderState {
  return { ...state };
}

function copyEnergyState(state: SingleRiderEnergyState): SingleRiderEnergyState {
  return { ...state };
}

function copyEnvironment(environment: LongitudinalEnvironment): LongitudinalEnvironment {
  return { ...environment };
}

function snapshotFrom(
  physicalState: SingleRiderState,
  energyState: SingleRiderEnergyState,
  environment: LongitudinalEnvironment,
): LabSimulationSnapshot {
  const physicalStateCopy = copyPhysicalState(physicalState);
  const energyStateCopy = copyEnergyState(energyState);
  const environmentCopy = copyEnvironment(environment);
  const forces = computeSingleRiderForcesAtPower(
    physicalStateCopy,
    defaultSingleRiderProfile,
    environmentCopy,
    physicalStateCopy.producedPowerWatts,
  );
  return Object.freeze({
    physicalState: Object.freeze(physicalStateCopy),
    energyState: Object.freeze(energyStateCopy),
    energyProfile: LAB_ENERGY_PROFILE,
    environment: Object.freeze(environmentCopy),
    forces: Object.freeze({ ...forces }),
    tickSeconds: LAB_TICK_SECONDS,
  });
}

export function createLabSimulation(): LabSimulation {
  let physicalState = createSingleRiderState(LAB_INITIAL_REQUESTED_POWER_WATTS);
  let energyState = createSingleRiderEnergyState(LAB_ENERGY_PROFILE);
  let environment: LongitudinalEnvironment = { ...defaultLongitudinalEnvironment };

  return {
    setRequestedPowerWatts(value: number): void {
      assertFiniteControl("requestedPowerWatts", value);
      physicalState.requestedPowerWatts = value;
    },
    setWindSpeedMetersPerSecond(value: number): void {
      assertFiniteControl("windSpeedMetersPerSecond", value);
      environment = { ...environment, windSpeedMetersPerSecond: value };
    },
    setRoadGradePercent(value: number): void {
      assertFiniteControl("roadGradePercent", value);
      environment = { ...environment, roadGrade: value / 100 };
    },
    stepTicks(count: number): void {
      assertTickCount(count);
      for (let index = 0; index < count; index += 1) {
        stepSingleRiderWithEnergy(
          physicalState,
          energyState,
          defaultSingleRiderProfile,
          LAB_ENERGY_PROFILE,
          environment,
          LAB_TICK_SECONDS,
        );
      }
    },
    reset(): void {
      const requestedPowerWatts = physicalState.requestedPowerWatts;
      physicalState = createSingleRiderState(requestedPowerWatts);
      energyState = createSingleRiderEnergyState(LAB_ENERGY_PROFILE);
    },
    getSnapshot(): LabSimulationSnapshot {
      return snapshotFrom(physicalState, energyState, environment);
    },
  };
}
