import {
  createLongitudinalCourse,
  type LongitudinalCourse,
  type LongitudinalCourseSegment,
} from "./course.js";
import type { PrecompiledCourse } from "./precompiledCourse.js";

/** Convertit chaque intervalle précompilé en un segment longitudinal distinct. */
export function convertPrecompiledCourseToLongitudinalCourse(
  course: PrecompiledCourse,
): LongitudinalCourse {
  const segments: LongitudinalCourseSegment[] = [];

  for (let index = 0; index < course.samples.length - 1; index += 1) {
    const start = course.samples[index];
    const end = course.samples[index + 1];
    if (start === undefined || end === undefined) {
      throw new RangeError("precompiled course conversion interval is missing");
    }
    segments.push({
      startDistanceMeters: start.distanceMeters,
      roadGrade: (end.altitudeMeters - start.altitudeMeters)
        / (end.distanceMeters - start.distanceMeters),
    });
  }

  return createLongitudinalCourse(segments, {
    totalLengthMeters: course.totalLengthMeters,
  });
}
