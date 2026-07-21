import {
  createPrecompiledCourse,
  getPrecompiledCourseAltitudeAtDistance,
} from "@rouelibre/sim-core";
import { describe, expect, it } from "vitest";

const samples = [
  { distanceMeters: 0, altitudeMeters: 120 },
  { distanceMeters: 25, altitudeMeters: 121.2 },
  { distanceMeters: 50, altitudeMeters: 123.1 },
];

describe("precompiled course", () => {
  it("creates an ordered course whose length is the final sample distance", () => {
    expect(createPrecompiledCourse(samples)).toEqual({ samples, totalLengthMeters: 50 });
  });

  it("requires at least two samples and an exact 0 m origin", () => {
    expect(() => createPrecompiledCourse([])).toThrow(RangeError);
    expect(() => createPrecompiledCourse([{ distanceMeters: 0, altitudeMeters: 10 }])).toThrow(RangeError);
    expect(() => createPrecompiledCourse([{ distanceMeters: 1, altitudeMeters: 10 }, { distanceMeters: 2, altitudeMeters: 11 }])).toThrow(RangeError);
  });

  it("rejects invalid or unordered distances", () => {
    const invalidDistances = [-1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
    for (const distanceMeters of invalidDistances) {
      expect(() => createPrecompiledCourse([{ distanceMeters: 0, altitudeMeters: 0 }, { distanceMeters, altitudeMeters: 1 }])).toThrow(RangeError);
    }
    for (const input of [
      [{ distanceMeters: 0, altitudeMeters: 0 }, { distanceMeters: 10, altitudeMeters: 1 }, { distanceMeters: 10, altitudeMeters: 2 }],
      [{ distanceMeters: 0, altitudeMeters: 0 }, { distanceMeters: 10, altitudeMeters: 1 }, { distanceMeters: 5, altitudeMeters: 2 }],
    ]) expect(() => createPrecompiledCourse(input)).toThrow(RangeError);
  });

  it("rejects non-finite altitudes and accepts a finite negative altitude", () => {
    for (const altitudeMeters of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      expect(() => createPrecompiledCourse([{ distanceMeters: 0, altitudeMeters: 0 }, { distanceMeters: 10, altitudeMeters }])).toThrow(RangeError);
    }
    expect(createPrecompiledCourse([{ distanceMeters: 0, altitudeMeters: -5 }, { distanceMeters: 10, altitudeMeters: -2 }]).samples[0]?.altitudeMeters).toBe(-5);
  });

  it("makes a deeply immutable defensive copy", () => {
    const input: { distanceMeters: number; altitudeMeters: number }[] = samples.map((sample) => ({ ...sample }));
    const course = createPrecompiledCourse(input);
    const changed = input[1];
    if (changed === undefined) throw new Error("missing test sample");
    changed.altitudeMeters = 999;
    input.push({ distanceMeters: 75, altitudeMeters: 125 });
    expect(course.samples).toEqual(samples);
    expect(Object.isFrozen(course)).toBe(true);
    expect(Object.isFrozen(course.samples)).toBe(true);
    expect(course.samples.every(Object.isFrozen)).toBe(true);
    expect(() => { (course.samples[0] as { altitudeMeters: number }).altitudeMeters = 1; }).toThrow(TypeError);
  });

  it("returns exact sample altitudes and clamps reads beyond the finish", () => {
    const course = createPrecompiledCourse(samples);
    for (const [distance, altitude] of [[0, 120], [25, 121.2], [50, 123.1], [500, 123.1]] as const) {
      expect(getPrecompiledCourseAltitudeAtDistance(course, distance)).toBe(altitude);
    }
  });

  it("interpolates ascending and descending intervals linearly", () => {
    const ascending = createPrecompiledCourse([{ distanceMeters: 0, altitudeMeters: 100 }, { distanceMeters: 100, altitudeMeters: 110 }]);
    const descending = createPrecompiledCourse([{ distanceMeters: 0, altitudeMeters: 110 }, { distanceMeters: 100, altitudeMeters: 90 }]);
    expect(getPrecompiledCourseAltitudeAtDistance(ascending, 50)).toBe(105);
    expect(getPrecompiledCourseAltitudeAtDistance(descending, 25)).toBe(105);
  });

  it("rejects invalid read distances", () => {
    const course = createPrecompiledCourse(samples);
    for (const distance of [-1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      expect(() => getPrecompiledCourseAltitudeAtDistance(course, distance)).toThrow(RangeError);
    }
  });

  it("is structurally and numerically deterministic", () => {
    const first = createPrecompiledCourse(samples);
    const second = createPrecompiledCourse(samples.map((sample) => ({ ...sample })));
    expect(first).toEqual(second);
    for (const distance of [0, 12.5, 25, 37.5, 50, 100]) {
      expect(getPrecompiledCourseAltitudeAtDistance(first, distance)).toBe(getPrecompiledCourseAltitudeAtDistance(second, distance));
    }
  });
});
