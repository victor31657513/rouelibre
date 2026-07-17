import {
  computeSingleRiderForcesAtPower,
  defaultSingleRiderProfile,
} from "@rouelibre/sim-core";
import { describe, expect, it } from "vitest";
import {
  createLabSimulation,
  LAB_DEMONSTRATION_COURSE,
  LAB_ENERGY_PROFILE,
} from "./labSimulation.js";

const closeTo = (actual: number, expected: number, digits = 8): void => {
  expect(actual).toBeCloseTo(expected, digits);
};

function run(
  powerWatts: number,
  windMetersPerSecond: number,
  ticks: number,
  gradePercent = 0,
) {
  const simulation = createLabSimulation();
  simulation.setRequestedPowerWatts(powerWatts);
  simulation.setWindSpeedMetersPerSecond(windMetersPerSecond);
  simulation.setRoadGradePercent(gradePercent);
  simulation.stepTicks(ticks);
  return simulation.getSnapshot();
}

describe("lab simulation controller", () => {
  it("exposes the initial constant course and state", () => {
    const snapshot = createLabSimulation().getSnapshot();

    expect(snapshot.courseMode).toBe("constant");
    expect(snapshot.course.segments).toEqual([{ startDistanceMeters: 0, roadGrade: 0 }]);
    expect(snapshot.physicalState).toMatchObject({
      timeSeconds: 0,
      distanceMeters: 0,
      speedMetersPerSecond: 0,
      accelerationMetersPerSecondSquared: 0,
      requestedPowerWatts: 250,
      producedPowerWatts: 0,
    });
    expect(snapshot.energyState.anaerobicReserveJoules).toBe(20_000);
    expect(snapshot.environment.roadGrade).toBe(0);
  });

  it("preserves constant grade conversion and historical wind behavior", () => {
    expect(run(250, 0, 60, 5).environment.roadGrade).toBe(0.05);
    expect(run(250, -3, 1_800).physicalState.speedMetersPerSecond).toBeGreaterThan(
      run(250, 0, 1_800).physicalState.speedMetersPerSecond,
    );
  });

  it("consumes and recovers W prime through the controller", () => {
    const simulation = createLabSimulation();
    simulation.setRequestedPowerWatts(350);
    simulation.stepTicks(600);
    const depletedReserve = simulation.getSnapshot().energyState.anaerobicReserveJoules;

    expect(depletedReserve).toBeLessThan(LAB_ENERGY_PROFILE.anaerobicCapacityJoules);

    simulation.setRequestedPowerWatts(150);
    simulation.stepTicks(600);
    expect(simulation.getSnapshot().energyState.anaerobicReserveJoules).toBeGreaterThan(depletedReserve);
  });

  it("limits produced power to CP when W prime is empty", () => {
    const simulation = createLabSimulation();
    simulation.setRequestedPowerWatts(350);
    simulation.stepTicks(12_001);

    const snapshot = simulation.getSnapshot();
    closeTo(snapshot.physicalState.producedPowerWatts, 250);
    expect(snapshot.energyState.isPowerLimitedByEnergy).toBe(true);
  });

  it("uses produced power for exposed forces", () => {
    const snapshot = run(350, 0, 12_001);
    const producedForces = computeSingleRiderForcesAtPower(
      snapshot.physicalState,
      defaultSingleRiderProfile,
      snapshot.environment,
      snapshot.physicalState.producedPowerWatts,
    );
    const requestedForces = computeSingleRiderForcesAtPower(
      snapshot.physicalState,
      defaultSingleRiderProfile,
      snapshot.environment,
      snapshot.physicalState.requestedPowerWatts,
    );

    closeTo(snapshot.forces.propulsiveForceNewtons, producedForces.propulsiveForceNewtons);
    expect(snapshot.forces.propulsiveForceNewtons).not.toBeCloseTo(
      requestedForces.propulsiveForceNewtons,
      4,
    );
  });

  it("resets physical and energy state while preserving controls", () => {
    const simulation = createLabSimulation();
    simulation.setRequestedPowerWatts(500);
    simulation.setWindSpeedMetersPerSecond(-4);
    simulation.setRoadGradePercent(-5);
    simulation.stepTicks(600);
    simulation.reset();

    const snapshot = simulation.getSnapshot();
    expect(snapshot.physicalState).toMatchObject({
      timeSeconds: 0,
      distanceMeters: 0,
      speedMetersPerSecond: 0,
      accelerationMetersPerSecondSquared: 0,
      requestedPowerWatts: 500,
      producedPowerWatts: 0,
    });
    expect(snapshot.energyState).toMatchObject({
      anaerobicReserveJoules: LAB_ENERGY_PROFILE.anaerobicCapacityJoules,
      lastAnaerobicPowerWatts: 0,
      lastRecoveryPowerWatts: 0,
      isPowerLimitedByEnergy: false,
    });
    expect(snapshot.environment.windSpeedMetersPerSecond).toBe(-4);
    expect(snapshot.environment.roadGrade).toBe(-0.05);
  });

  it("rejects negative, fractional, and non-finite tick counts", () => {
    const simulation = createLabSimulation();

    expect(() => simulation.stepTicks(-1)).toThrow(RangeError);
    expect(() => simulation.stepTicks(1.5)).toThrow(RangeError);
    expect(() => simulation.stepTicks(Number.POSITIVE_INFINITY)).toThrow(RangeError);
    expect(() => simulation.stepTicks(Number.NaN)).toThrow(RangeError);
  });

  it("returns snapshots that cannot mutate internal simulation state", () => {
    const simulation = createLabSimulation();
    const snapshot = simulation.getSnapshot();

    expect(Object.isFrozen(snapshot.physicalState)).toBe(true);
    expect(() => {
      (snapshot.physicalState as { requestedPowerWatts: number }).requestedPowerWatts = 999;
    }).toThrow(TypeError);
    expect(simulation.getSnapshot().physicalState.requestedPowerWatts).toBe(250);
  });

  it("observes without side effects or changing the final result", () => {
    const observed = createLabSimulation();
    const reference = createLabSimulation();
    observed.setCourseMode("demonstration");
    reference.setCourseMode("demonstration");

    observed.stepTicks(1_234);
    const firstSnapshot = observed.getSnapshot();
    const secondSnapshot = observed.getSnapshot();
    reference.stepTicks(1_234);

    expect(secondSnapshot).toEqual(firstSnapshot);
    observed.stepTicks(1_234);
    reference.stepTicks(1_234);
    expect(observed.getSnapshot()).toEqual(reference.getSnapshot());
  });

  it("exposes the fixed demonstration course and frozen observations", () => {
    const simulation = createLabSimulation();
    simulation.setCourseMode("demonstration");
    const snapshot = simulation.getSnapshot();

    expect(snapshot.course).toBe(LAB_DEMONSTRATION_COURSE);
    expect(snapshot.course.segments.map((segment) => [segment.startDistanceMeters, segment.roadGrade]))
      .toEqual([[0, 0], [200, 0.05], [400, -0.05], [600, 0]]);
    expect(snapshot.coursePosition.segmentIndex).toBe(0);
    expect(Object.isFrozen(snapshot.course)).toBe(true);
    expect(Object.isFrozen(snapshot.coursePosition)).toBe(true);
  });

  it("uses the grade resolved at the start of a tick that crosses a boundary", () => {
    const simulation = createLabSimulation();
    simulation.setCourseMode("demonstration");
    simulation.setRequestedPowerWatts(1_200);
    let beforeCrossing = simulation.getSnapshot();
    let afterCrossing = beforeCrossing;
    while (afterCrossing.physicalState.distanceMeters < 200) {
      beforeCrossing = afterCrossing;
      simulation.stepTicks(1);
      afterCrossing = simulation.getSnapshot();
    }

    const gradeBeforeCrossing = beforeCrossing.environment.roadGrade;
    const oldGradeForces = computeSingleRiderForcesAtPower(
      beforeCrossing.physicalState,
      defaultSingleRiderProfile,
      beforeCrossing.environment,
      beforeCrossing.physicalState.producedPowerWatts,
    );
    const newGradeForces = computeSingleRiderForcesAtPower(
      beforeCrossing.physicalState,
      defaultSingleRiderProfile,
      { ...beforeCrossing.environment, roadGrade: 0.05 },
      beforeCrossing.physicalState.producedPowerWatts,
    );

    expect(gradeBeforeCrossing).toBe(0);
    expect(afterCrossing.physicalState.distanceMeters).toBeGreaterThanOrEqual(200);
    closeTo(
      afterCrossing.physicalState.accelerationMetersPerSecondSquared,
      oldGradeForces.accelerationMetersPerSecondSquared,
    );
    expect(afterCrossing.physicalState.accelerationMetersPerSecondSquared).not.toBeCloseTo(
      newGradeForces.accelerationMetersPerSecondSquared,
      4,
    );
    expect(afterCrossing.environment.roadGrade).toBe(0.05);

    simulation.stepTicks(1);
    expect(simulation.getSnapshot().physicalState.accelerationMetersPerSecondSquared)
      .toBeLessThan(oldGradeForces.accelerationMetersPerSecondSquared);
  });

  it("keeps mode and constant setting after reset", () => {
    const simulation = createLabSimulation();
    simulation.setRoadGradePercent(-5);
    simulation.setCourseMode("demonstration");
    simulation.stepTicks(600);
    simulation.reset();

    expect(simulation.getSnapshot().courseMode).toBe("demonstration");
    expect(simulation.getSnapshot().coursePosition.segmentIndex).toBe(0);
    simulation.setCourseMode("constant");
    expect(simulation.getSnapshot().environment.roadGrade).toBe(-0.05);
  });

  it("is deterministic for identical commands and tick counts", () => {
    const first = createLabSimulation();
    const second = createLabSimulation();
    first.setCourseMode("demonstration");
    second.setCourseMode("demonstration");
    first.stepTicks(7_200);
    second.stepTicks(7_200);

    expect(first.getSnapshot()).toEqual(second.getSnapshot());
  });

  it("matches the documented finite-course arrival benchmark", () => {
    const simulation = createLabSimulation();
    simulation.setCourseMode("demonstration");
    simulation.stepTicks(7_200);

    const snapshot = simulation.getSnapshot();
    expect(snapshot.physicalState.distanceMeters).toBe(800);
    expect(snapshot.physicalState.timeSeconds).toBeCloseTo(95.68333333332919, 10);
    expect(snapshot.physicalState.speedMetersPerSecond).toBeCloseTo(11.292604288288551, 10);
    expect(snapshot.coursePosition.segmentIndex).toBe(3);
    expect(snapshot.environment.roadGrade).toBe(0);
    expect(snapshot.energyState.anaerobicReserveJoules).toBe(20_000);
    expect(snapshot.courseProgress).toMatchObject({ totalLengthMeters: 800, remainingDistanceMeters: 0, progress: 1, isFinished: true });
  });

  it("freezes all observables after the first arrival tick and resets or changes mode deterministically", () => {
    const simulation = createLabSimulation();
    simulation.setCourseMode("demonstration");
    simulation.stepTicks(10_000);
    const arrived = simulation.getSnapshot();
    simulation.setRequestedPowerWatts(1_200);
    simulation.setWindSpeedMetersPerSecond(-10);
    simulation.stepTicks(100);
    expect(simulation.getSnapshot()).toEqual(arrived);
    simulation.reset();
    expect(simulation.getSnapshot().courseProgress).toMatchObject({ isFinished: false, remainingDistanceMeters: 800, progress: 0 });

    simulation.setCourseMode("constant");
    simulation.setRequestedPowerWatts(1_200);
    simulation.setWindSpeedMetersPerSecond(-10);
    simulation.stepTicks(10_000);
    expect(simulation.getSnapshot().courseProgress.isFinished).toBeUndefined();
    expect(simulation.getSnapshot().physicalState.distanceMeters).toBeGreaterThan(800);
    expect(simulation.getSnapshot().physicalState.requestedPowerWatts).toBe(1_200);
    expect(simulation.getSnapshot().environment.windSpeedMetersPerSecond).toBe(-10);
    simulation.setCourseMode("demonstration");
    expect(simulation.getSnapshot().physicalState.distanceMeters).toBe(800);
    expect(simulation.getSnapshot().courseProgress.isFinished).toBe(true);
  });
});
