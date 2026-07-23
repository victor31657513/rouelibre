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

export {
  parseGpxTrack,
  type ParsedGpxTrack,
  type RawGpxTrackPoint,
} from "./gpx.js";

export {
  computeGpxCumulativeDistances,
  EARTH_MEAN_RADIUS_METERS,
  type DistanceAnnotatedGpxPoint,
  type DistanceAnnotatedGpxTrack,
} from "./gpxDistance.js";

export {
  removeConsecutiveExactGpxDuplicates,
  removeConsecutiveSameHorizontalGpxPoints,
  type GpxExactDuplicateNormalizationReport,
  type GpxExactDuplicateNormalizationResult,
  type GpxHorizontalPositionNormalizationReport,
  type GpxHorizontalPositionNormalizationResult,
} from "./gpxNormalization.js";

export {
  analyzeGpxGeometryQuality,
  type GpxGeometryQualityOptions,
  type GpxGeometryQualityReport,
  type GpxGeometrySegmentObservation,
} from "./gpxQuality.js";

export {
  analyzeGpxRawProfile,
  type GpxRawProfileReport,
  type GpxRawSegmentObservation,
} from "./gpxRawProfile.js";

export {
  analyzeGpxRawDistributions,
  type GpxRawDistribution,
  type GpxRawDistributionOptions,
  type GpxRawDistributionReport,
  type GpxRawDistributionSegmentObservation,
  type GpxRawPercentileObservation,
  type GpxRawThresholdObservation,
  type GpxRawThresholdResult,
} from "./gpxRawDistribution.js";
