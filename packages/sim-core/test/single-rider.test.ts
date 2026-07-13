import { describe, expect, it } from "vitest";

import {
  computeSingleRiderForces,
  createSingleRiderState,
  defaultLongitudinalEnvironment,
  defaultSingleRiderProfile,
  stepSingleRider,
  type LongitudinalEnvironment,
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

const referenceEnvironment: LongitudinalEnvironment = {
  ...defaultLongitudinalEnvironment,
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

function simulate(
  powerWatts: number,
  durationSeconds: number,
  dtSeconds: number,
  environment: LongitudinalEnvironment = referenceEnvironment,
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
  environment: LongitudinalEnvironment = referenceEnvironment,
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

describe("single rider constant road grade", () => {
  it("keeps zero grade identical to historical flat equations", () => {
    const state = createSingleRiderState(250);
    state.speedMetersPerSecond = 10;
    const forces = computeSingleRiderForces(state, referenceProfile, referenceEnvironment);

    expect(Math.atan(referenceEnvironment.roadGrade)).toBe(0);
    expect(forces.gravityForceNewtons).toBe(0);
    expect(forces.rollingResistanceForceNewtons).toBe(
      referenceProfile.rollingResistanceCoefficient
        * (referenceProfile.riderMassKg + referenceProfile.bikeMassKg)
        * referenceEnvironment.gravityMetersPerSecondSquared,
    );
  });

  it("applies positive grade as resistance and negative grade as assistance", () => {
    const flat = simulate(250, 120, 0.5, referenceEnvironment);
    const uphillEnvironment = { ...referenceEnvironment, roadGrade: 0.05 };
    const downhillEnvironment = { ...referenceEnvironment, roadGrade: -0.05 };
    const uphill = simulate(250, 120, 0.5, uphillEnvironment);
    const downhill = simulate(250, 120, 0.5, downhillEnvironment);
    const state = createSingleRiderState(250);
    state.speedMetersPerSecond = 8;
    const flatForces = computeSingleRiderForces(state, referenceProfile, referenceEnvironment);
    const uphillForces = computeSingleRiderForces(state, referenceProfile, uphillEnvironment);
    const downhillForces = computeSingleRiderForces(state, referenceProfile, downhillEnvironment);

    expect(uphillForces.gravityForceNewtons).toBeGreaterThan(0);
    expect(uphillForces.netForceNewtons).toBeLessThan(flatForces.netForceNewtons);
    expect(uphill.speedMetersPerSecond).toBeLessThan(flat.speedMetersPerSecond);
    expect(downhillForces.gravityForceNewtons).toBeLessThan(0);
    expect(downhillForces.netForceNewtons).toBeGreaterThan(flatForces.netForceNewtons);
    expect(downhill.speedMetersPerSecond).toBeGreaterThan(flat.speedMetersPerSecond);
  });

  it("uses cos(atan(grade)) for non-negative rolling resistance", () => {
    const state = createSingleRiderState(250);
    state.speedMetersPerSecond = 8;
    const environment = { ...referenceEnvironment, roadGrade: 0.12 };
    const forces = computeSingleRiderForces(state, referenceProfile, environment);
    const expected = referenceProfile.rollingResistanceCoefficient
      * (referenceProfile.riderMassKg + referenceProfile.bikeMassKg)
      * environment.gravityMetersPerSecondSquared
      * Math.cos(Math.atan(environment.roadGrade));

    expect(forces.rollingResistanceForceNewtons).toBeCloseTo(expected, 12);
    expect(forces.rollingResistanceForceNewtons).toBeGreaterThanOrEqual(0);
  });

  it("allows coasting acceleration downhill without negative uphill speed", () => {
    const downhill = createSingleRiderState(0);
    stepSingleRider(downhill, referenceProfile, { ...referenceEnvironment, roadGrade: -0.05 }, 1);
    expect(downhill.speedMetersPerSecond).toBeGreaterThan(0);

    const uphill = createSingleRiderState(0);
    stepSingleRider(uphill, referenceProfile, { ...referenceEnvironment, roadGrade: 0.05 }, 1);
    expect(uphill.speedMetersPerSecond).toBe(0);
    expect(uphill.accelerationMetersPerSecondSquared).toBe(0);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])("rejects invalid road grade without mutation", (roadGrade) => {
    const state = createSingleRiderState(250);
    const before = cloneState(state);

    expect(() => stepSingleRider(state, referenceProfile, { ...referenceEnvironment, roadGrade }, 0.5)).toThrow(/environment\.roadGrade/);
    expect(state).toStrictEqual(before);
  });

  it("is deterministic for identical grade inputs", () => {
    expect(simulate(250, 300, 0.5, { ...referenceEnvironment, roadGrade: 0.035 })).toStrictEqual(
      simulate(250, 300, 0.5, { ...referenceEnvironment, roadGrade: 0.035 }),
    );
  });
});
