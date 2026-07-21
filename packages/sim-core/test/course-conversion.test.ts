import {
  clampLongitudinalCourseDistance,
  convertPrecompiledCourseToLongitudinalCourse,
  createPrecompiledCourse,
  getLongitudinalCourseProgressAtDistance,
  getLongitudinalCourseRoadGradeAtDistance,
  getPrecompiledCourseRoadGradeAtDistance,
} from "@rouelibre/sim-core";
import { describe, expect, it } from "vitest";

describe("precompiled course conversion", () => {
  it("converts the minimal course into one finite segment", () => {
    const converted = convertPrecompiledCourseToLongitudinalCourse(createPrecompiledCourse([
      { distanceMeters: 0, altitudeMeters: 100 },
      { distanceMeters: 100, altitudeMeters: 105 },
    ]));

    expect(converted).toEqual({
      segments: [{ startDistanceMeters: 0, roadGrade: 0.05 }],
      totalLengthMeters: 100,
    });
  });

  it("preserves every irregular interval including equal grades", () => {
    const converted = convertPrecompiledCourseToLongitudinalCourse(createPrecompiledCourse([
      { distanceMeters: 0, altitudeMeters: 100 },
      { distanceMeters: 30, altitudeMeters: 101 },
      { distanceMeters: 50, altitudeMeters: 103 },
      { distanceMeters: 70, altitudeMeters: 105 },
      { distanceMeters: 100, altitudeMeters: 105 },
      { distanceMeters: 125, altitudeMeters: 100 },
    ]));

    expect(converted.segments).toEqual([
      { startDistanceMeters: 0, roadGrade: 1 / 30 },
      { startDistanceMeters: 30, roadGrade: 2 / 20 },
      { startDistanceMeters: 50, roadGrade: 2 / 20 },
      { startDistanceMeters: 70, roadGrade: 0 },
      { startDistanceMeters: 100, roadGrade: -5 / 25 },
    ]);
    expect(converted.totalLengthMeters).toBe(125);
  });

  it("uses the longitudinal semi-open boundaries and final-grade extension", () => {
    const converted = convertPrecompiledCourseToLongitudinalCourse(createPrecompiledCourse([
      { distanceMeters: 0, altitudeMeters: 100 },
      { distanceMeters: 100, altitudeMeters: 105 },
      { distanceMeters: 250, altitudeMeters: 95 },
    ]));

    for (const [distance, grade] of [
      [0, 0.05],
      [50, 0.05],
      [99.999, 0.05],
      [100, -10 / 150],
      [200, -10 / 150],
      [250, -10 / 150],
      [500, -10 / 150],
    ] as const) {
      expect(getLongitudinalCourseRoadGradeAtDistance(converted, distance)).toBe(grade);
    }
  });

  it("matches precompiled grade resolution throughout and beyond the course", () => {
    const precompiled = createPrecompiledCourse([
      { distanceMeters: 0, altitudeMeters: 12 },
      { distanceMeters: 30, altitudeMeters: 13 },
      { distanceMeters: 50, altitudeMeters: 15 },
      { distanceMeters: 80, altitudeMeters: 14 },
    ]);
    const converted = convertPrecompiledCourseToLongitudinalCourse(precompiled);

    for (const distance of [0, 15, 30, 40, 50, 70, 80, 200]) {
      expect(getLongitudinalCourseRoadGradeAtDistance(converted, distance))
        .toBe(getPrecompiledCourseRoadGradeAtDistance(precompiled, distance));
    }
  });

  it("transfers the finish to existing progress and clamping functions", () => {
    const precompiled = createPrecompiledCourse([
      { distanceMeters: 0, altitudeMeters: 100 },
      { distanceMeters: 100, altitudeMeters: 105 },
    ]);
    const converted = convertPrecompiledCourseToLongitudinalCourse(precompiled);

    expect(converted.totalLengthMeters).toBe(precompiled.totalLengthMeters);
    expect(clampLongitudinalCourseDistance(converted, 101)).toBe(100);
    expect(getLongitudinalCourseProgressAtDistance(converted, 100)).toMatchObject({
      totalLengthMeters: 100,
      remainingDistanceMeters: 0,
      progress: 1,
      isFinished: true,
    });
  });

  it("keeps source and output immutable and defensively copied", () => {
    const input = [
      { distanceMeters: 0, altitudeMeters: 100 },
      { distanceMeters: 100, altitudeMeters: 105 },
    ];
    const precompiled = createPrecompiledCourse(input);
    const sourceSnapshot = JSON.stringify(precompiled);
    const converted = convertPrecompiledCourseToLongitudinalCourse(precompiled);

    input[1]!.altitudeMeters = 999;
    input.push({ distanceMeters: 200, altitudeMeters: 1_000 });
    expect(JSON.stringify(precompiled)).toBe(sourceSnapshot);
    expect(converted).toEqual({
      segments: [{ startDistanceMeters: 0, roadGrade: 0.05 }],
      totalLengthMeters: 100,
    });
    expect(Object.isFrozen(converted)).toBe(true);
    expect(Object.isFrozen(converted.segments)).toBe(true);
    expect(converted.segments.every(Object.isFrozen)).toBe(true);
  });

  it("is structurally and numerically deterministic", () => {
    const values = [
      { distanceMeters: 0, altitudeMeters: 100 },
      { distanceMeters: 100, altitudeMeters: 105 },
      { distanceMeters: 250, altitudeMeters: 95 },
    ];
    const first = convertPrecompiledCourseToLongitudinalCourse(createPrecompiledCourse(values));
    const second = convertPrecompiledCourseToLongitudinalCourse(createPrecompiledCourse(
      values.map((sample) => ({ ...sample })),
    ));

    expect(first).toEqual(second);
  });
});
