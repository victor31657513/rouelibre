import { describe, expect, it } from "vitest";

import {
  createSingleRiderState,
  defaultFlatRoadEnvironment,
  defaultSingleRiderProfile,
  stepSingleRider,
  type FlatRoadEnvironment,
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
  maxPropulsiveForceNewtons: 1_200,
};

const referenceEnvironment: FlatRoadEnvironment = {
  ...defaultFlatRoadEnvironment,
  airDensityKgPerCubicMeter: 1.225,
  windSpeedMetersPerSecond: 0,
  gravityMetersPerSecondSquared: 9.80665,
};

function expectFiniteState(state: SingleRiderState): void {
  expect(Number.isFinite(state.timeSeconds)).toBe(true);
  expect(Number.isFinite(state.distanceMeters)).toBe(true);
  expect(Number.isFinite(state.speedMetersPerSecond)).toBe(true);
  expect(Number.isFinite(state.accelerationMetersPerSecondSquared)).toBe(true);
  expect(Number.isFinite(state.producedPowerWatts)).toBe(true);
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

describe("single rider longitudinal physics", () => {
  it("starts from rest without NaN or infinite values", () => {
    const state = createSingleRiderState(250);

    stepSingleRider(state, referenceProfile, referenceEnvironment, 0.5);

    expectFiniteState(state);
    expect(state.speedMetersPerSecond).toBeGreaterThan(0);
    expect(state.distanceMeters).toBeGreaterThan(0);
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
});
