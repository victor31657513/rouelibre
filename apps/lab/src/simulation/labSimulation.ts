import {
  computeSingleRiderForcesAtPower,
  createLongitudinalCourse,
  createSingleRiderEnergyState,
  createSingleRiderState,
  defaultLongitudinalEnvironment,
  defaultSingleRiderProfile,
  getLongitudinalCoursePositionAtDistance,
  getLongitudinalCourseRoadGradeAtDistance,
  stepSingleRiderWithEnergy,
  type LongitudinalCourse,
  type LongitudinalCoursePosition,
  type LongitudinalEnvironment,
  type SingleRiderEnergyProfile,
  type SingleRiderEnergyState,
  type SingleRiderForces,
  type SingleRiderState,
} from "@rouelibre/sim-core";

export const LAB_TICK_SECONDS = 1 / 60;
export const LAB_INITIAL_REQUESTED_POWER_WATTS = 250;
export const LAB_INITIAL_ROAD_GRADE_PERCENT = 0;
export const LAB_ENERGY_PROFILE: Readonly<SingleRiderEnergyProfile> = Object.freeze({ criticalPowerWatts: 250, anaerobicCapacityJoules: 20_000, recoveryEfficiency: 0.5 });
export const LAB_DEMONSTRATION_COURSE = createLongitudinalCourse([
  { startDistanceMeters: 0, roadGrade: 0 }, { startDistanceMeters: 200, roadGrade: 0.05 },
  { startDistanceMeters: 400, roadGrade: -0.05 }, { startDistanceMeters: 600, roadGrade: 0 },
]);
export type LabCourseMode = "constant" | "demonstration";

export interface LabSimulationSnapshot {
  readonly physicalState: Readonly<SingleRiderState>;
  readonly energyState: Readonly<SingleRiderEnergyState>;
  readonly energyProfile: Readonly<SingleRiderEnergyProfile>;
  readonly environment: Readonly<LongitudinalEnvironment>;
  readonly forces: Readonly<SingleRiderForces>;
  readonly courseMode: LabCourseMode;
  readonly course: LongitudinalCourse;
  readonly coursePosition: LongitudinalCoursePosition;
  readonly tickSeconds: number;
}
export interface LabSimulation {
  setRequestedPowerWatts(value: number): void;
  setWindSpeedMetersPerSecond(value: number): void;
  setRoadGradePercent(value: number): void;
  setCourseMode(mode: LabCourseMode): void;
  stepTicks(count: number): void;
  reset(): void;
  getSnapshot(): LabSimulationSnapshot;
}
function assertFiniteControl(name: string, value: number): void { if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`); }
function assertTickCount(count: number): void { if (!Number.isFinite(count) || !Number.isInteger(count) || count < 0) throw new RangeError("tick count must be a non-negative finite integer"); }
function createConstantCourse(roadGradePercent: number): LongitudinalCourse { return createLongitudinalCourse([{ startDistanceMeters: 0, roadGrade: roadGradePercent / 100 }]); }

function snapshotFrom(physicalState: SingleRiderState, energyState: SingleRiderEnergyState, environment: LongitudinalEnvironment, courseMode: LabCourseMode, course: LongitudinalCourse): LabSimulationSnapshot {
  const physicalStateCopy = { ...physicalState };
  const energyStateCopy = { ...energyState };
  const environmentCopy = { ...environment };
  const forces = computeSingleRiderForcesAtPower(physicalStateCopy, defaultSingleRiderProfile, environmentCopy, physicalStateCopy.producedPowerWatts);
  return Object.freeze({ physicalState: Object.freeze(physicalStateCopy), energyState: Object.freeze(energyStateCopy), energyProfile: LAB_ENERGY_PROFILE, environment: Object.freeze(environmentCopy), forces: Object.freeze({ ...forces }), courseMode, course, coursePosition: getLongitudinalCoursePositionAtDistance(course, physicalState.distanceMeters), tickSeconds: LAB_TICK_SECONDS });
}

export function createLabSimulation(): LabSimulation {
  let physicalState = createSingleRiderState(LAB_INITIAL_REQUESTED_POWER_WATTS);
  let energyState = createSingleRiderEnergyState(LAB_ENERGY_PROFILE);
  const environment: LongitudinalEnvironment = { ...defaultLongitudinalEnvironment };
  let constantRoadGradePercent = LAB_INITIAL_ROAD_GRADE_PERCENT;
  let constantCourse = createConstantCourse(constantRoadGradePercent);
  let courseMode: LabCourseMode = "constant";
  const activeCourse = (): LongitudinalCourse => courseMode === "constant" ? constantCourse : LAB_DEMONSTRATION_COURSE;
  const applyCourseRoadGrade = (): void => { environment.roadGrade = getLongitudinalCourseRoadGradeAtDistance(activeCourse(), physicalState.distanceMeters); };
  applyCourseRoadGrade();
  return {
    setRequestedPowerWatts(value) { assertFiniteControl("requestedPowerWatts", value); physicalState.requestedPowerWatts = value; },
    setWindSpeedMetersPerSecond(value) { assertFiniteControl("windSpeedMetersPerSecond", value); environment.windSpeedMetersPerSecond = value; },
    setRoadGradePercent(value) { assertFiniteControl("roadGradePercent", value); constantRoadGradePercent = value; constantCourse = createConstantCourse(value); applyCourseRoadGrade(); },
    setCourseMode(mode) { if (mode !== "constant" && mode !== "demonstration") throw new RangeError("courseMode must be constant or demonstration"); courseMode = mode; applyCourseRoadGrade(); },
    stepTicks(count) { assertTickCount(count); for (let index = 0; index < count; index += 1) { applyCourseRoadGrade(); stepSingleRiderWithEnergy(physicalState, energyState, defaultSingleRiderProfile, LAB_ENERGY_PROFILE, environment, LAB_TICK_SECONDS); } },
    reset() { const requestedPowerWatts = physicalState.requestedPowerWatts; physicalState = createSingleRiderState(requestedPowerWatts); energyState = createSingleRiderEnergyState(LAB_ENERGY_PROFILE); applyCourseRoadGrade(); },
    getSnapshot() { const course = activeCourse(); applyCourseRoadGrade(); return snapshotFrom(physicalState, energyState, environment, courseMode, course); },
  };
}
