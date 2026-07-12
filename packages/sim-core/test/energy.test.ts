import { describe, expect, it } from "vitest";

import {
  createSingleRiderEnergyState,
  createSingleRiderState,
  defaultFlatRoadEnvironment,
  defaultSingleRiderProfile,
  stepSingleRider,
  stepSingleRiderEnergy,
  stepSingleRiderWithEnergy,
  type SingleRiderEnergyProfile,
  type SingleRiderEnergyState,
  type SingleRiderProfile,
  type SingleRiderState,
} from "../src/index.js";

const energyProfile: SingleRiderEnergyProfile = {
  criticalPowerWatts: 250,
  anaerobicCapacityJoules: 20_000,
  recoveryEfficiency: 0.5,
};

const physicalProfile: SingleRiderProfile = {
  ...defaultSingleRiderProfile,
  maxPowerWatts: 1_200,
};

const tolerance = 1e-9;

function expectClose(actual: number, expected: number): void {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
}

function clonePhysicalState(state: SingleRiderState): SingleRiderState {
  return { ...state };
}

function cloneEnergyState(state: SingleRiderEnergyState): SingleRiderEnergyState {
  return { ...state };
}

function stepEnergy(powerWatts: number, state: SingleRiderEnergyState, dtSeconds = 1): number {
  return stepSingleRiderEnergy(powerWatts, physicalProfile.maxPowerWatts, state, energyProfile, dtSeconds);
}

describe("single rider CP/W' energy model", () => {
  it("leaves the reserve unchanged exactly at CP", () => {
    const state = createSingleRiderEnergyState(energyProfile);

    const produced = stepEnergy(250, state);

    expect(produced).toBe(250);
    expect(state.anaerobicReserveJoules).toBe(20_000);
    expect(state.lastAnaerobicPowerWatts).toBe(0);
    expect(state.lastRecoveryPowerWatts).toBe(0);
  });

  it("consumes 100 J per second at 350 W with CP at 250 W", () => {
    const state = createSingleRiderEnergyState(energyProfile);

    stepEnergy(350, state);

    expect(state.lastAnaerobicPowerWatts).toBe(100);
    expect(state.anaerobicReserveJoules).toBe(19_900);
  });

  it("leaves 14,000 J after 60 seconds at 350 W from a full reserve", () => {
    const state = createSingleRiderEnergyState(energyProfile);

    for (let index = 0; index < 60; index += 1) stepEnergy(350, state);

    expect(state.anaerobicReserveJoules).toBe(14_000);
  });

  it("exhausts a full 20,000 J reserve after 200 seconds at 350 W", () => {
    const state = createSingleRiderEnergyState(energyProfile);

    for (let index = 0; index < 200; index += 1) stepEnergy(350, state);

    expect(state.anaerobicReserveJoules).toBe(0);
    expect(state.isPowerLimitedByEnergy).toBe(false);
  });

  it("produces CP once the reserve is empty and 350 W is requested", () => {
    const state = createSingleRiderEnergyState(energyProfile, 0);

    const produced = stepEnergy(350, state);

    expect(produced).toBe(250);
    expect(state.isPowerLimitedByEnergy).toBe(true);
  });

  it("produces 300 W for one second when only 50 J are available at a 350 W request", () => {
    const state = createSingleRiderEnergyState(energyProfile, 50);

    const produced = stepEnergy(350, state);

    expect(produced).toBe(300);
    expect(state.anaerobicReserveJoules).toBe(0);
    expect(state.lastAnaerobicPowerWatts).toBe(50);
  });

  it("recovers 50 J per second at 150 W with CP at 250 W and 0.5 efficiency", () => {
    const state = createSingleRiderEnergyState(energyProfile, 0);

    stepEnergy(150, state);

    expect(state.lastRecoveryPowerWatts).toBe(50);
    expect(state.anaerobicReserveJoules).toBe(50);
  });

  it("caps recovery at anaerobic capacity", () => {
    const state = createSingleRiderEnergyState(energyProfile, 19_990);

    stepEnergy(150, state);

    expect(state.anaerobicReserveJoules).toBe(20_000);
  });

  it("never combines consumption and recovery in the same step", () => {
    const state = createSingleRiderEnergyState(energyProfile, 10_000);

    for (const powerWatts of [0, 150, 250, 350, 1_500]) {
      stepEnergy(powerWatts, state);
      expect(state.lastAnaerobicPowerWatts === 0 || state.lastRecoveryPowerWatts === 0).toBe(true);
    }
  });

  it("immediately limits above-CP power to CP when anaerobic capacity is zero", () => {
    const zeroCapacityProfile = { ...energyProfile, anaerobicCapacityJoules: 0 };
    const state = createSingleRiderEnergyState(zeroCapacityProfile);

    const produced = stepSingleRiderEnergy(350, physicalProfile.maxPowerWatts, state, zeroCapacityProfile, 1);

    expect(produced).toBe(250);
    expect(state.anaerobicReserveJoules).toBe(0);
  });

  it("matches constant phases with 1 s and 0.5 s steps", () => {
    const oneSecond = createSingleRiderEnergyState(energyProfile);
    const halfSecond = createSingleRiderEnergyState(energyProfile);

    for (let index = 0; index < 60; index += 1) stepEnergy(350, oneSecond, 1);
    for (let index = 0; index < 120; index += 1) stepEnergy(350, halfSecond, 0.5);

    expectClose(halfSecond.anaerobicReserveJoules, oneSecond.anaerobicReserveJoules);
  });
});

describe("single rider energy and physics integration", () => {
  it("preserves requested power and exposes produced power when energy limits output", () => {
    const physicalState = createSingleRiderState(350);
    const energyState = createSingleRiderEnergyState(energyProfile, 0);

    stepSingleRiderWithEnergy(physicalState, energyState, physicalProfile, energyProfile, defaultFlatRoadEnvironment, 1);

    expect(physicalState.requestedPowerWatts).toBe(350);
    expect(physicalState.producedPowerWatts).toBe(250);
  });

  it("produces requested above-CP power while reserve is available and CP after exhaustion", () => {
    const physicalState = createSingleRiderState(350);
    const energyState = createSingleRiderEnergyState(energyProfile, 100);

    stepSingleRiderWithEnergy(physicalState, energyState, physicalProfile, energyProfile, defaultFlatRoadEnvironment, 0.5);
    expect(physicalState.producedPowerWatts).toBe(350);

    stepSingleRiderWithEnergy(physicalState, energyState, physicalProfile, energyProfile, defaultFlatRoadEnvironment, 0.5);
    expect(physicalState.producedPowerWatts).toBe(350);

    stepSingleRiderWithEnergy(physicalState, energyState, physicalProfile, energyProfile, defaultFlatRoadEnvironment, 1);
    expect(physicalState.producedPowerWatts).toBe(250);
  });

  it("evolves speed according to produced power after exhaustion", () => {
    const energyLimited = createSingleRiderState(350);
    const cpOnly = createSingleRiderState(250);
    const energyState = createSingleRiderEnergyState(energyProfile, 0);

    for (let index = 0; index < 120; index += 1) {
      stepSingleRiderWithEnergy(energyLimited, energyState, physicalProfile, energyProfile, defaultFlatRoadEnvironment, 1);
      stepSingleRider(cpOnly, physicalProfile, defaultFlatRoadEnvironment, 1);
    }

    expectClose(energyLimited.speedMetersPerSecond, cpOnly.speedMetersPerSecond);
    expect(energyLimited.producedPowerWatts).toBe(250);
  });

  it("keeps the historical stepSingleRider benchmark behavior", () => {
    const state = createSingleRiderState(250);

    for (let index = 0; index < 14_400; index += 1) {
      stepSingleRider(state, physicalProfile, defaultFlatRoadEnvironment, 0.5);
    }

    expect(Math.abs(state.speedMetersPerSecond - 10.220)).toBeLessThanOrEqual(0.001);
  });

  it("is exactly deterministic for identical energy and physics inputs", () => {
    const run = (): { physicalState: SingleRiderState; energyState: SingleRiderEnergyState } => {
      const physicalState = createSingleRiderState(350);
      const energyState = createSingleRiderEnergyState(energyProfile);
      for (let index = 0; index < 1_000; index += 1) {
        stepSingleRiderWithEnergy(physicalState, energyState, physicalProfile, energyProfile, defaultFlatRoadEnvironment, 0.5);
      }
      return { physicalState, energyState };
    };

    expect(run()).toStrictEqual(run());
  });

  it("keeps finite values during a long combined simulation", () => {
    const physicalState = createSingleRiderState(225);
    const energyState = createSingleRiderEnergyState(energyProfile, 10_000);

    for (let index = 0; index < 86_400; index += 1) {
      stepSingleRiderWithEnergy(physicalState, energyState, physicalProfile, energyProfile, defaultFlatRoadEnvironment, 1);
      expect(Number.isFinite(physicalState.speedMetersPerSecond)).toBe(true);
      expect(Number.isFinite(energyState.anaerobicReserveJoules)).toBe(true);
    }
  });

  it.each<{
    label: string;
    energyProfilePatch?: Partial<SingleRiderEnergyProfile>;
    energyStatePatch?: Partial<SingleRiderEnergyState>;
    dtSeconds?: number;
    expectedMessage: RegExp;
  }>([
    { label: "CP above max", energyProfilePatch: { criticalPowerWatts: 2_000 }, expectedMessage: /criticalPowerWatts/ },
    { label: "negative capacity", energyProfilePatch: { anaerobicCapacityJoules: -1 }, expectedMessage: /anaerobicCapacityJoules/ },
    { label: "efficiency below zero", energyProfilePatch: { recoveryEfficiency: -0.1 }, expectedMessage: /recoveryEfficiency/ },
    { label: "efficiency above one", energyProfilePatch: { recoveryEfficiency: 1.1 }, expectedMessage: /recoveryEfficiency/ },
    { label: "reserve above capacity", energyStatePatch: { anaerobicReserveJoules: 20_001 }, expectedMessage: /anaerobicReserveJoules/ },
    { label: "NaN reserve", energyStatePatch: { anaerobicReserveJoules: Number.NaN }, expectedMessage: /anaerobicReserveJoules/ },
    { label: "invalid dt", dtSeconds: 0, expectedMessage: /dtSeconds/ },
  ])("rejects invalid configuration without mutating either state: $label", ({ energyProfilePatch, energyStatePatch, dtSeconds, expectedMessage }) => {
    const physicalState = createSingleRiderState(350);
    const testedEnergyState = { ...createSingleRiderEnergyState(energyProfile), ...energyStatePatch };
    const physicalBefore = clonePhysicalState(physicalState);
    const energyBefore = cloneEnergyState(testedEnergyState);
    const testedEnergyProfile = { ...energyProfile, ...energyProfilePatch };

    expect(() => {
      stepSingleRiderWithEnergy(
        physicalState,
        testedEnergyState,
        physicalProfile,
        testedEnergyProfile,
        defaultFlatRoadEnvironment,
        dtSeconds ?? 1,
      );
    }).toThrow(expectedMessage);
    expect(physicalState).toStrictEqual(physicalBefore);
    expect(testedEnergyState).toStrictEqual(energyBefore);
  });
});
