export const simCorePackageName = "@rouelibre/sim-core";

export function describeFoundation(): string {
  return "Roue libre simulation core foundation";
}

export {
  computeSingleRiderForces,
  computeSingleRiderForcesAtPower,
  createSingleRiderState,
  defaultLongitudinalEnvironment,
  defaultSingleRiderProfile,
  stepSingleRider,
  type LongitudinalEnvironment,
  type SingleRiderForces,
  type SingleRiderProfile,
  type SingleRiderState,
} from "./longitudinal.js";

export {
  createSingleRiderEnergyState,
  stepSingleRiderEnergy,
  stepSingleRiderWithEnergy,
  type SingleRiderEnergyProfile,
  type SingleRiderEnergyState,
} from "./energy.js";

export {
  clampLongitudinalCourseDistance,
  createFlatLongitudinalCourse,
  createLongitudinalCourse,
  getLongitudinalCourseProgressAtDistance,
  getLongitudinalCoursePositionAtDistance,
  getLongitudinalCourseRoadGradeAtDistance,
  getLongitudinalCourseSegmentIndexAtDistance,
  type LongitudinalCourse,
  type LongitudinalCoursePosition,
  type LongitudinalCourseProgress,
  type LongitudinalCourseSegment,
  type LongitudinalCourseOptions,
} from "./course.js";

export {
  createPrecompiledCourse,
  getPrecompiledCourseAltitudeAtDistance,
  getPrecompiledCourseRoadGradeAtDistance,
  type PrecompiledCourse,
  type PrecompiledCourseSample,
} from "./precompiledCourse.js";

export {
  convertPrecompiledCourseToLongitudinalCourse,
} from "./courseConversion.js";
