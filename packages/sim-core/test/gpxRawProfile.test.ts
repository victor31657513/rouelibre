import { describe, expect, it } from "vitest";

import { analyzeGpxRawProfile, type DistanceAnnotatedGpxTrack } from "../src/index.js";

function track(distances: readonly number[], altitudes: readonly number[]): DistanceAnnotatedGpxTrack {
  return {
    points: distances.map((distanceMeters, index) => ({
      latitudeDegrees: 45 + index / 100,
      longitudeDegrees: 2,
      altitudeMeters: altitudes[index] ?? 0,
      distanceMeters,
    })),
    totalLengthMeters: distances.at(-1) ?? 0,
  };
}

describe("analyzeGpxRawProfile", () => {
  it("observe exactement une trace plate et ses espacements", () => {
    const report = analyzeGpxRawProfile(track([0, 10, 30], [100, 100, 100]));
    expect(report).toEqual({
      pointCount: 3,
      segmentCount: 2,
      totalHorizontalLengthMeters: 30,
      minimumHorizontalSpacing: {
        startPointIndex: 0, endPointIndex: 1, horizontalSpacingMeters: 10,
        altitudeDeltaMeters: 0, rawGrade: 0,
      },
      maximumHorizontalSpacing: {
        startPointIndex: 1, endPointIndex: 2, horizontalSpacingMeters: 20,
        altitudeDeltaMeters: 0, rawGrade: 0,
      },
      averageHorizontalSpacingMeters: 15,
      minimumRawGrade: {
        startPointIndex: 0, endPointIndex: 1, horizontalSpacingMeters: 10,
        altitudeDeltaMeters: 0, rawGrade: 0,
      },
      maximumRawGrade: {
        startPointIndex: 0, endPointIndex: 1, horizontalSpacingMeters: 10,
        altitudeDeltaMeters: 0, rawGrade: 0,
      },
      ascendingSegmentCount: 0,
      descendingSegmentCount: 0,
      constantAltitudeSegmentCount: 2,
    });
  });

  it("calcule exactement une montée et une descente", () => {
    expect(analyzeGpxRawProfile(track([0, 25], [10, 15])).maximumRawGrade.rawGrade).toBe(0.2);
    const descent = analyzeGpxRawProfile(track([0, 40], [10, 0]));
    expect(descent.minimumRawGrade).toMatchObject({ altitudeDeltaMeters: -10, rawGrade: -0.25 });
    expect(descent.descendingSegmentCount).toBe(1);
  });

  it("compte une alternance montée, plat et descente et trouve les extrema", () => {
    const report = analyzeGpxRawProfile(track([0, 10, 30, 35], [0, 2, 2, -1]));
    expect(report.ascendingSegmentCount).toBe(1);
    expect(report.constantAltitudeSegmentCount).toBe(1);
    expect(report.descendingSegmentCount).toBe(1);
    expect(report.minimumHorizontalSpacing.startPointIndex).toBe(2);
    expect(report.maximumHorizontalSpacing.startPointIndex).toBe(1);
    expect(report.minimumRawGrade).toMatchObject({ startPointIndex: 2, rawGrade: -0.6 });
    expect(report.maximumRawGrade).toMatchObject({ startPointIndex: 0, rawGrade: 0.2 });
  });

  it("conserve la première occurrence lors des égalités exactes", () => {
    const report = analyzeGpxRawProfile(track([0, 10, 20], [0, 1, 2]));
    expect(report.minimumHorizontalSpacing.startPointIndex).toBe(0);
    expect(report.maximumHorizontalSpacing.startPointIndex).toBe(0);
    expect(report.minimumRawGrade.startPointIndex).toBe(0);
    expect(report.maximumRawGrade.startPointIndex).toBe(0);
  });

  it("est déterministe, ne mute pas l'entrée et produit un rapport profondément immuable", () => {
    const source = track([0, 10, 25], [0, 1, 0]);
    const snapshot = structuredClone(source);
    const first = analyzeGpxRawProfile(source);
    expect(first).toEqual(analyzeGpxRawProfile(source));
    expect(source).toEqual(snapshot);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.minimumHorizontalSpacing)).toBe(true);
    expect(Object.isFrozen(first.maximumHorizontalSpacing)).toBe(true);
    expect(Object.isFrozen(first.minimumRawGrade)).toBe(true);
    expect(Object.isFrozen(first.maximumRawGrade)).toBe(true);
  });

  it.each([
    { label: "track nul", value: null },
    { label: "track tableau", value: [] },
    { label: "points absent", value: {} },
    { label: "points non tableau", value: { points: {}, totalLengthMeters: 0 } },
    { label: "point non objet", value: { points: [null, {}], totalLengthMeters: 1 } },
  ])("rejette les objets ou tableaux invalides: $label", ({ value }) => {
    expect(() => analyzeGpxRawProfile(value as DistanceAnnotatedGpxTrack)).toThrow(TypeError);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "rejette la distance totale non finie %s",
    (value) => expect(() => analyzeGpxRawProfile({ ...track([0, 1], [0, 0]), totalLengthMeters: value }))
      .toThrow(TypeError),
  );

  it("rejette les valeurs de point non finies", () => {
    for (const field of ["latitudeDegrees", "longitudeDegrees", "altitudeMeters", "distanceMeters"] as const) {
      const source = track([0, 1], [0, 0]);
      const points = source.points.map((point, index) => index === 1 ? { ...point, [field]: Number.NaN } : point);
      expect(() => analyzeGpxRawProfile({ points, totalLengthMeters: 1 })).toThrow(TypeError);
    }
  });

  it("rejette les différences non finies issues de valeurs finies extrêmes", () => {
    expect(() => analyzeGpxRawProfile(track([0, Number.MAX_VALUE], [-Number.MAX_VALUE, Number.MAX_VALUE])))
      .toThrow(/altitude delta/);
  });

  it.each([[[0, 0]], [[0, -1]]])("rejette les distances non strictement croissantes %j", (distances) => {
    expect(() => analyzeGpxRawProfile(track(distances, [0, 1]))).toThrow(/strictly increasing/);
  });

  it("rejette une longueur incohérente et une trace trop courte", () => {
    expect(() => analyzeGpxRawProfile({ ...track([0, 1], [0, 0]), totalLengthMeters: 2 })).toThrow(/last point/);
    expect(() => analyzeGpxRawProfile(track([0], [0]))).toThrow(/at least two/);
  });
});
