import { describe, expect, it } from "vitest";

import {
  clampLongitudinalCourseDistance,
  convertPrecompiledCourseToLongitudinalCourse,
  createPrecompiledCourse,
  createSingleRiderEnergyState,
  createSingleRiderState,
  defaultLongitudinalEnvironment,
  defaultSingleRiderProfile,
  getLongitudinalCourseProgressAtDistance,
  getLongitudinalCourseRoadGradeAtDistance,
  getLongitudinalCourseSegmentIndexAtDistance,
  stepSingleRiderWithEnergy,
  type LongitudinalEnvironment,
  type SingleRiderEnergyProfile,
} from "../src/index.js";

const tickSeconds = 1 / 60;
const maximumTicks = 7_200;
const energyProfile: SingleRiderEnergyProfile = {
  criticalPowerWatts: 250,
  anaerobicCapacityJoules: 20_000,
  recoveryEfficiency: 0.5,
};
const precompiledCourse = createPrecompiledCourse([
  { distanceMeters: 0, altitudeMeters: 0 },
  { distanceMeters: 200, altitudeMeters: 0 },
  { distanceMeters: 400, altitudeMeters: 10 },
  { distanceMeters: 600, altitudeMeters: 0 },
  { distanceMeters: 800, altitudeMeters: 0 },
]);
const course = convertPrecompiledCourseToLongitudinalCourse(precompiledCourse);

function runConvertedCourseScenario() {
  const physicalState = createSingleRiderState(250);
  const energyState = createSingleRiderEnergyState(energyProfile);
  const environment: LongitudinalEnvironment = {
    ...defaultLongitudinalEnvironment,
    windSpeedMetersPerSecond: 0,
  };
  const traversedSegmentIndices: number[] = [];
  const appliedRoadGrades: number[] = [];
  let physicsStepCount = 0;
  let progress = getLongitudinalCourseProgressAtDistance(course, physicalState.distanceMeters);

  while (!progress.isFinished && physicsStepCount < maximumTicks) {
    const previousDistanceMeters = physicalState.distanceMeters;
    const segmentIndex = getLongitudinalCourseSegmentIndexAtDistance(course, previousDistanceMeters);
    environment.roadGrade = getLongitudinalCourseRoadGradeAtDistance(course, previousDistanceMeters);
    if (traversedSegmentIndices.at(-1) !== segmentIndex) {
      traversedSegmentIndices.push(segmentIndex);
      appliedRoadGrades.push(environment.roadGrade);
    }

    stepSingleRiderWithEnergy(
      physicalState,
      energyState,
      defaultSingleRiderProfile,
      energyProfile,
      environment,
      tickSeconds,
    );
    physicsStepCount += 1;
    physicalState.distanceMeters = clampLongitudinalCourseDistance(course, physicalState.distanceMeters);
    progress = getLongitudinalCourseProgressAtDistance(course, physicalState.distanceMeters);

    expect(Number.isFinite(physicalState.distanceMeters)).toBe(true);
    expect(physicalState.distanceMeters).toBeGreaterThanOrEqual(previousDistanceMeters);
    expect(Number.isFinite(physicalState.speedMetersPerSecond)).toBe(true);
    expect(physicalState.speedMetersPerSecond).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(physicalState.accelerationMetersPerSecondSquared)).toBe(true);
    expect(Number.isFinite(physicalState.producedPowerWatts)).toBe(true);
    expect(energyState.anaerobicReserveJoules).toBeGreaterThanOrEqual(0);
    expect(energyState.anaerobicReserveJoules).toBeLessThanOrEqual(energyProfile.anaerobicCapacityJoules);
  }

  if (!progress.isFinished) throw new Error(`course did not finish within ${maximumTicks} ticks`);

  return {
    physicalState: { ...physicalState },
    energyState: { ...energyState },
    progress,
    physicsStepCount,
    traversedSegmentIndices,
    appliedRoadGrades,
  };
}

describe("precompiled course deterministic integration scenario", () => {
  it("converts and traverses every altitude interval in order", () => {
    expect(course.segments).toHaveLength(4);
    expect(course.segments.map(({ startDistanceMeters, roadGrade }) => [startDistanceMeters, roadGrade]))
      .toEqual([[0, 0], [200, 0.05], [400, -0.05], [600, 0]]);

    const result = runConvertedCourseScenario();
    expect(result.traversedSegmentIndices).toEqual([0, 1, 2, 3]);
    expect(result.appliedRoadGrades).toEqual([0, 0.05, -0.05, 0]);
  });

  it("reaches the clamped finish once with the reference numerical results", () => {
    const result = runConvertedCourseScenario();

    expect(result.physicsStepCount).toBe(5_741);
    expect(result.physicsStepCount).toBeLessThan(maximumTicks);
    expect(result.physicalState.distanceMeters).toBe(800);
    expect(result.physicalState.timeSeconds).toBeCloseTo(95.68333333332919, 10);
    expect(result.physicalState.speedMetersPerSecond).toBeCloseTo(11.292604288288551, 10);
    expect(result.physicalState.producedPowerWatts).toBe(250);
    expect(result.energyState.anaerobicReserveJoules).toBe(20_000);
    expect(result.progress).toEqual({
      totalLengthMeters: 800,
      distanceMeters: 800,
      remainingDistanceMeters: 0,
      progress: 1,
      isFinished: true,
    });
  });

  it("does not step after arrival and reproduces the exact final result", () => {
    const first = runConvertedCourseScenario();
    const stepCountAtArrival = first.physicsStepCount;

    // La condition d'arrêt est la progression publique : aucun pas physique ne suit l'arrivée.
    if (!first.progress.isFinished) throw new Error("expected a finished scenario");
    expect(first.physicsStepCount).toBe(stepCountAtArrival);
    expect(runConvertedCourseScenario()).toEqual(first);
  });
});
