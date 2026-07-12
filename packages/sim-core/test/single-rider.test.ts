import { describe, expect, it } from "vitest";

import {
  computeSingleRiderForces,
  computeSingleRiderForcesAtPower,
  createSingleRiderEnergyState,
  createSingleRiderState,
  defaultFlatRoadEnvironment,
  defaultSingleRiderEnergyProfile,
  defaultSingleRiderProfile,
  stepSingleRider,
  stepSingleRiderEnergy,
  stepSingleRiderWithEnergy,
  type FlatRoadEnvironment,
  type SingleRiderEnergyProfile,
  type SingleRiderEnergyState,
  type SingleRiderProfile,
  type SingleRiderState,
} from "../src/index.js";

const referenceProfile: SingleRiderProfile = {
  ...defaultSingleRiderProfile,
  riderMassKg: 75,
  bikeMassKg: 8,
  cdaSquareMeters: 0.32,
  rollingResistanceCoefficient: 0.004,
  mechanicalEfficiency: 0.97,
  maxPowerWatts: 1_200,
  maxPropulsiveForceNewtons: 200,
};

const referenceEnvironment: FlatRoadEnvironment = {
  ...defaultFlatRoadEnvironment,
  airDensityKgPerCubicMeter: 1.225,
  windSpeedMetersPerSecond: 0,
  gravityMetersPerSecondSquared: 9.80665,
};

// Les valeurs de référence sont documentées au millième de m/s.
const stabilizedSpeedToleranceMetersPerSecond = 0.001;
const convergenceToleranceMetersPerSecond = 0.001;

function expectFiniteState(state: SingleRiderState): void {
  expect(Number.isFinite(state.timeSeconds)).toBe(true);
  expect(Number.isFinite(state.distanceMeters)).toBe(true);
  expect(Number.isFinite(state.speedMetersPerSecond)).toBe(true);
  expect(Number.isFinite(state.accelerationMetersPerSecondSquared)).toBe(true);
  expect(Number.isFinite(state.producedPowerWatts)).toBe(true);
}

function cloneState(state: SingleRiderState): SingleRiderState {
  return { ...state };
}

function cloneEnergyState(state: SingleRiderEnergyState): SingleRiderEnergyState {
  return { ...state };
}

function simulate(
  powerWatts: number,
  durationSeconds: number,
  dtSeconds: number,
  environment: FlatRoadEnvironment = referenceEnvironment,
  checkInvariants = false,
): SingleRiderState {
  const state = createSingleRiderState(powerWatts);
  const steps = Math.trunc(durationSeconds / dtSeconds);

  for (let index = 0; index < steps; index += 1) {
    const previousDistance = state.distanceMeters;
    stepSingleRider(state, referenceProfile, environment, dtSeconds);

    if (checkInvariants) {
      expectFiniteState(state);
      expect(state.speedMetersPerSecond).toBeGreaterThanOrEqual(0);
      expect(state.distanceMeters).toBeGreaterThanOrEqual(previousDistance);
    }
  }

  return state;
}

function simulateWithPreviousSpeed(
  powerWatts: number,
  durationSeconds: number,
  dtSeconds: number,
  environment: FlatRoadEnvironment = referenceEnvironment,
  previousWindowSeconds = 60,
): { finalState: SingleRiderState; previousWindowSpeed: number } {
  const state = createSingleRiderState(powerWatts);
  const steps = Math.trunc(durationSeconds / dtSeconds);
  const previousWindowStep = steps - Math.trunc(previousWindowSeconds / dtSeconds);
  let previousWindowSpeed = state.speedMetersPerSecond;

  for (let index = 0; index < steps; index += 1) {
    if (index === previousWindowStep) {
      previousWindowSpeed = state.speedMetersPerSecond;
    }

    stepSingleRider(state, referenceProfile, environment, dtSeconds);
  }

  return { finalState: state, previousWindowSpeed };
}

describe("single rider longitudinal physics", () => {
  it("starts from rest without NaN or infinite values", () => {
    const state = createSingleRiderState(250);

    stepSingleRider(state, referenceProfile, referenceEnvironment, 0.5);

    expectFiniteState(state);
    expect(state.speedMetersPerSecond).toBeGreaterThan(0);
    expect(state.distanceMeters).toBeGreaterThan(0);
  });

  it("starts progressively at 60 Hz with bounded acceleration and speed", () => {
    const state = createSingleRiderState(250);
    const dtSeconds = 1 / 60;

    stepSingleRider(state, referenceProfile, referenceEnvironment, dtSeconds);

    expectFiniteState(state);
    expect(state.accelerationMetersPerSecondSquared).toBeGreaterThan(0);
    expect(state.accelerationMetersPerSecondSquared).toBeLessThanOrEqual(3);
    expect(state.speedMetersPerSecond).toBeLessThanOrEqual(3 * dtSeconds);
  });

  it("keeps speed non-negative while coasting under resistance", () => {
    const state = createSingleRiderState(0);
    state.speedMetersPerSecond = 2;

    for (let index = 0; index < 1_000; index += 1) {
      stepSingleRider(state, referenceProfile, referenceEnvironment, 0.1);
      expect(state.speedMetersPerSecond).toBeGreaterThanOrEqual(0);
    }
  });

  it("keeps distance increasing when the rider moves forward", () => {
    const state = simulate(200, 60, 0.5, referenceEnvironment, true);

    expect(state.distanceMeters).toBeGreaterThan(0);
  });

  it("caps produced power at the rider maximum", () => {
    const state = createSingleRiderState(2_000);

    stepSingleRider(state, referenceProfile, referenceEnvironment, 0.5);

    expect(state.producedPowerWatts).toBe(referenceProfile.maxPowerWatts);
  });

  it("stabilizes at a higher speed with 300 W than with 200 W", () => {
    const speed200 = simulate(200, 7_200, 0.5).speedMetersPerSecond;
    const speed300 = simulate(300, 7_200, 0.5).speedMetersPerSecond;

    expect(speed300).toBeGreaterThan(speed200);
  });

  it("stabilizes slower with headwind than without wind", () => {
    const noWind = simulate(250, 7_200, 0.5).speedMetersPerSecond;
    const headwind = simulate(250, 7_200, 0.5, {
      ...referenceEnvironment,
      windSpeedMetersPerSecond: 3,
    }).speedMetersPerSecond;

    expect(headwind).toBeLessThan(noWind);
  });

  it("stabilizes faster with tailwind than without wind", () => {
    const noWind = simulate(250, 7_200, 0.5).speedMetersPerSecond;
    const tailwind = simulate(250, 7_200, 0.5, {
      ...referenceEnvironment,
      windSpeedMetersPerSecond: -3,
    }).speedMetersPerSecond;

    expect(tailwind).toBeGreaterThan(noWind);
  });

  it("decelerates without power under aerodynamic and rolling resistance", () => {
    const state = createSingleRiderState(0);
    state.speedMetersPerSecond = 10;

    stepSingleRider(state, referenceProfile, referenceEnvironment, 1);

    expect(state.speedMetersPerSecond).toBeLessThan(10);
    expect(state.accelerationMetersPerSecondSquared).toBeLessThan(0);
  });

  it("keeps exposed acceleration consistent with clamped speed at rest", () => {
    const state = createSingleRiderState(0);

    stepSingleRider(state, referenceProfile, {
      ...referenceEnvironment,
      windSpeedMetersPerSecond: 3,
    }, 0.5);

    expect(state.speedMetersPerSecond).toBe(0);
    expect(state.accelerationMetersPerSecondSquared).toBe(0);
  });

  it("is deterministic for identical inputs", () => {
    const first = simulate(250, 3_600, 0.5, {
      ...referenceEnvironment,
      windSpeedMetersPerSecond: 1.5,
    });
    const second = simulate(250, 3_600, 0.5, {
      ...referenceEnvironment,
      windSpeedMetersPerSecond: 1.5,
    });

    expect(second).toStrictEqual(first);
  });

  it("keeps finite values during a long simulation", () => {
    const state = simulate(250, 24 * 60 * 60, 1);

    expectFiniteState(state);
    expect(state.timeSeconds).toBe(86_400);
  });

  it.each([
    ["200 W sans vent", 200, 0, 9.411],
    ["250 W sans vent", 250, 0, 10.220],
    ["300 W sans vent", 300, 0, 10.923],
    ["250 W vent de face", 250, 3, 8.418],
    ["250 W vent arrière", 250, -3, 12.206],
  ])("matches the documented stabilized speed for %s", (_label, powerWatts, windSpeedMetersPerSecond, expectedSpeed) => {
    const { finalState, previousWindowSpeed } = simulateWithPreviousSpeed(powerWatts, 7_200, 0.5, {
      ...referenceEnvironment,
      windSpeedMetersPerSecond,
    });

    expect(Math.abs(finalState.speedMetersPerSecond - expectedSpeed)).toBeLessThanOrEqual(
      stabilizedSpeedToleranceMetersPerSecond,
    );
    expect(Math.abs(finalState.speedMetersPerSecond - previousWindowSpeed)).toBeLessThan(
      convergenceToleranceMetersPerSecond,
    );
  });
});

describe("single rider input validation", () => {
  it.each([
    ["zero total mass", { riderMassKg: 0, bikeMassKg: 0 }, /profile\.riderMassKg/],
    ["negative maximum power", { maxPowerWatts: -1 }, /profile\.maxPowerWatts/],
    ["efficiency below zero", { mechanicalEfficiency: -0.1 }, /profile\.mechanicalEfficiency/],
    ["efficiency above one", { mechanicalEfficiency: 1.1 }, /profile\.mechanicalEfficiency/],
    ["zero maximum propulsive force", { maxPropulsiveForceNewtons: 0 }, /profile\.maxPropulsiveForceNewtons/],
    ["NaN CdA", { cdaSquareMeters: Number.NaN }, /profile\.cdaSquareMeters/],
  ])("rejects invalid profile input: %s", (_label, profilePatch, expectedMessage) => {
    const state = createSingleRiderState(250);
    const before = cloneState(state);

    expect(() => {
      stepSingleRider(state, { ...referenceProfile, ...profilePatch }, referenceEnvironment, 0.5);
    }).toThrow(expectedMessage);
    expect(state).toStrictEqual(before);
  });

  it.each([0, -0.5])("rejects a non-positive dt without mutating state: %s", (dtSeconds) => {
    const state = createSingleRiderState(250);
    const before = cloneState(state);

    expect(() => {
      stepSingleRider(state, referenceProfile, referenceEnvironment, dtSeconds);
    }).toThrow(/dtSeconds/);
    expect(state).toStrictEqual(before);
  });

  it("rejects invalid state values before mutation", () => {
    const state = createSingleRiderState(250);
    state.distanceMeters = Number.NaN;
    const before = cloneState(state);

    expect(() => {
      stepSingleRider(state, referenceProfile, referenceEnvironment, 0.5);
    }).toThrow(/state\.distanceMeters/);
    expect(state).toStrictEqual(before);
  });
});

describe("single rider energy model", () => {
  const energyProfile: SingleRiderEnergyProfile = {
    ...defaultSingleRiderEnergyProfile,
    criticalPowerWatts: 250,
    anaerobicCapacityJoules: 20_000,
    recoveryEfficiency: 0.5,
  };

  it("stores only the recovery that fits below capacity", () => {
    const state = createSingleRiderState(150);
    const energyState = createSingleRiderEnergyState(energyProfile);
    energyState.anaerobicReserveJoules = 19_990;

    stepSingleRiderEnergy(state, energyState, energyProfile, 1);

    expect(energyState.anaerobicReserveJoules).toBe(20_000);
    expect(energyState.lastRecoveryPowerWatts).toBe(10);
    expect(state.producedPowerWatts).toBe(150);
  });

  it("reports zero applied recovery when capacity is zero", () => {
    const zeroCapacityProfile: SingleRiderEnergyProfile = {
      criticalPowerWatts: 250,
      anaerobicCapacityJoules: 0,
      recoveryEfficiency: 0.5,
    };
    const state = createSingleRiderState(150);
    const energyState = createSingleRiderEnergyState(zeroCapacityProfile);

    stepSingleRiderEnergy(state, energyState, zeroCapacityProfile, 1);

    expect(energyState.anaerobicReserveJoules).toBe(0);
    expect(energyState.lastRecoveryPowerWatts).toBe(0);
  });
});

describe("single rider energy and physics coupling", () => {
  const energyProfile: SingleRiderEnergyProfile = {
    ...defaultSingleRiderEnergyProfile,
    criticalPowerWatts: 250,
    anaerobicCapacityJoules: 20_000,
    recoveryEfficiency: 0.5,
  };

  it("keeps both states unchanged when a finite time step overflows a candidate", () => {
    const state = createSingleRiderState(350);
    const energyState = createSingleRiderEnergyState(energyProfile);
    const beforeState = cloneState(state);
    const beforeEnergyState = cloneEnergyState(energyState);

    expect(() => {
      stepSingleRiderWithEnergy(
        state,
        energyState,
        referenceProfile,
        energyProfile,
        referenceEnvironment,
        Number.MAX_VALUE,
      );
    }).toThrow(
      /candidate\.(timeSeconds|distanceMeters|speedMetersPerSecond|accelerationMetersPerSecondSquared).*finite/,
    );
    expect(state).toStrictEqual(beforeState);
    expect(energyState).toStrictEqual(beforeEnergyState);
  });

  it("rejects non-finite calculated forces before any mutation", () => {
    const state = createSingleRiderState(250);
    state.speedMetersPerSecond = 1;
    const energyState = createSingleRiderEnergyState(energyProfile);
    const beforeState = cloneState(state);
    const beforeEnergyState = cloneEnergyState(energyState);
    const extremeEnvironment: FlatRoadEnvironment = {
      ...referenceEnvironment,
      windSpeedMetersPerSecond: Number.MAX_VALUE,
    };

    expect(() => computeSingleRiderForces(state, referenceProfile, extremeEnvironment)).toThrow(
      /forces\.aerodynamicDragForceNewtons result must be finite/,
    );
    expect(() => {
      stepSingleRiderWithEnergy(state, energyState, referenceProfile, energyProfile, extremeEnvironment, 1);
    }).toThrow(/forces\.aerodynamicDragForceNewtons result must be finite/);
    expect(state).toStrictEqual(beforeState);
    expect(energyState).toStrictEqual(beforeEnergyState);
  });

  it("exposes forces for the produced power after energy limiting", () => {
    const state = createSingleRiderState(350);
    state.speedMetersPerSecond = 10;
    const energyState = createSingleRiderEnergyState(energyProfile);
    energyState.anaerobicReserveJoules = 0;

    stepSingleRiderWithEnergy(state, energyState, referenceProfile, energyProfile, referenceEnvironment, 1);

    const limitedForces = computeSingleRiderForcesAtPower(
      state,
      referenceProfile,
      referenceEnvironment,
      state.producedPowerWatts,
    );
    const physical250WState = { ...state, requestedPowerWatts: 250, producedPowerWatts: 0 };
    const expectedForces = computeSingleRiderForces(physical250WState, referenceProfile, referenceEnvironment);
    const requestedForces = computeSingleRiderForcesAtPower(state, referenceProfile, referenceEnvironment, 350);

    expect(state.requestedPowerWatts).toBe(350);
    expect(state.producedPowerWatts).toBe(250);
    expect(limitedForces).toStrictEqual(expectedForces);
    expect(limitedForces.propulsiveForceNewtons).not.toBeCloseTo(requestedForces.propulsiveForceNewtons, 12);
  });

  it("reduces speed progressively toward the critical-power behavior after reserve depletion", () => {
    const state = createSingleRiderState(350);
    const scenarioEnergyProfile = { ...energyProfile, anaerobicCapacityJoules: 20_000 };
    const energyState = createSingleRiderEnergyState(scenarioEnergyProfile);
    const cpState = createSingleRiderState(250);
    const dtSeconds = 1;
    let speedAtDepletion = 0;
    let speedImmediatelyAfterDepletion = 0;
    let observedAboveCriticalPower = false;

    for (let index = 0; index < 240; index += 1) {
      stepSingleRider(cpState, referenceProfile, referenceEnvironment, dtSeconds);
      stepSingleRiderWithEnergy(
        state,
        energyState,
        referenceProfile,
        scenarioEnergyProfile,
        referenceEnvironment,
        dtSeconds,
      );

      expect(state.requestedPowerWatts).toBe(350);
      if (!energyState.isPowerLimitedByEnergy) {
        expect(state.producedPowerWatts).toBeGreaterThan(250);
        observedAboveCriticalPower = true;
      } else {
        expect(state.producedPowerWatts).toBe(250);
        speedAtDepletion = state.speedMetersPerSecond;
        break;
      }
    }

    expect(observedAboveCriticalPower).toBe(true);
    expect(energyState.anaerobicReserveJoules).toBe(0);
    speedImmediatelyAfterDepletion = state.speedMetersPerSecond;

    for (let index = 0; index < 1_200; index += 1) {
      stepSingleRider(cpState, referenceProfile, referenceEnvironment, dtSeconds);
      stepSingleRiderWithEnergy(
        state,
        energyState,
        referenceProfile,
        scenarioEnergyProfile,
        referenceEnvironment,
        dtSeconds,
      );
      expect(state.requestedPowerWatts).toBe(350);
      expect(state.producedPowerWatts).toBe(250);
    }

    expect(state.speedMetersPerSecond).toBeLessThan(speedAtDepletion);
    expect(state.speedMetersPerSecond).toBeLessThan(speedImmediatelyAfterDepletion);
    expect(Math.abs(state.speedMetersPerSecond - cpState.speedMetersPerSecond)).toBeLessThanOrEqual(0.05);
  });
});
