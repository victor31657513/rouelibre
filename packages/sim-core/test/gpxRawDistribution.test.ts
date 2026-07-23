import { describe, expect, it } from "vitest";

import { analyzeGpxRawDistributions, type DistanceAnnotatedGpxTrack, type GpxRawDistributionOptions } from "../src/index.js";

function track(distances: readonly number[], altitudes: readonly number[]): DistanceAnnotatedGpxTrack {
  return { points: distances.map((distanceMeters, index) => ({ latitudeDegrees: 45, longitudeDegrees: 2,
    altitudeMeters: altitudes[index] ?? 0, distanceMeters })), totalLengthMeters: distances.at(-1) ?? 0 };
}

const options = (): GpxRawDistributionOptions => ({ percentiles: [0, 0.1, 50, 99.9, 100],
  horizontalSpacingThresholdsMeters: [10, 20, 100], absoluteAltitudeDeltaThresholdsMeters: [1, 2, 20],
  absoluteRawGradeThresholds: [0.1, 0.2, 2] });

describe("analyzeGpxRawDistributions", () => {
  it("calcule exactement les quatre métriques, le rang supérieur et les seuils stricts", () => {
    const report = analyzeGpxRawDistributions([track([0, 10, 30, 35], [0, 2, 2, -1])], options());
    expect(report).toMatchObject({ trackCount: 1, pointCount: 4, segmentCount: 3 });
    expect(report.horizontalSpacingMeters.percentiles.map(({ percentile, value }) => [percentile, value]))
      .toEqual([[0, 5], [0.1, 5], [50, 10], [99.9, 20], [100, 20]]);
    expect(report.altitudeDeltaMeters.percentiles.map(({ value }) => value)).toEqual([-3, -3, 0, 2, 2]);
    expect(report.absoluteAltitudeDeltaMeters.percentiles.map(({ value }) => value)).toEqual([0, 0, 2, 3, 3]);
    expect(report.absoluteRawGrade.percentiles.map(({ value }) => value)).toEqual([0, 0, 0.2, 0.6, 0.6]);
    expect(report.horizontalSpacingMeters.thresholds).toMatchObject([
      { threshold: 10, segmentCountAbove: 1, proportion: 1 / 3, firstObservationAbove: { startPointIndex: 1 } },
      { threshold: 20, segmentCountAbove: 0, proportion: 0 }, { threshold: 100, segmentCountAbove: 0, proportion: 0 },
    ]);
    expect(report.absoluteAltitudeDeltaMeters.thresholds[0]).toMatchObject({ threshold: 1, segmentCountAbove: 2, firstObservationAbove: { value: 2, startPointIndex: 0 } });
    expect(report.absoluteRawGrade.thresholds[0]).toMatchObject({ threshold: 0.1, segmentCountAbove: 2 });
    expect(report.absoluteRawGrade.thresholds[1]).toMatchObject({ threshold: 0.2, segmentCountAbove: 1 });
  });

  it.each([
    { name: "plate", source: track([0, 10, 20], [5, 5, 5]), deltas: [0, 0] },
    { name: "montée régulière", source: track([0, 10, 20], [0, 1, 2]), deltas: [1, 1] },
    { name: "descente régulière", source: track([0, 10, 20], [2, 1, 0]), deltas: [-1, -1] },
    { name: "sommet et vallée", source: track([0, 10, 20, 30, 40], [0, 2, 0, -2, 0]), deltas: [-2, -2, 2, 2] },
  ])("diagnostique une trace $name", ({ source, deltas }) => {
    expect(analyzeGpxRawDistributions([source], options()).altitudeDeltaMeters.percentiles.map(({ value }) => value))
      .toEqual([deltas[0], deltas[0], deltas[Math.ceil(deltas.length / 2) - 1], deltas.at(-1), deltas.at(-1)]);
  });

  it("agrège deux traces et départage les égalités par ordre documentaire", () => {
    const report = analyzeGpxRawDistributions([track([0, 10, 20], [0, 1, 0]), track([0, 10], [0, 1])], options());
    expect(report).toMatchObject({ trackCount: 2, pointCount: 5, segmentCount: 3 });
    expect(report.horizontalSpacingMeters.percentiles[0]).toMatchObject({ trackIndex: 0, startPointIndex: 0, endPointIndex: 1 });
    expect(report.absoluteAltitudeDeltaMeters.percentiles[0]).toMatchObject({ trackIndex: 0, startPointIndex: 0 });
    expect(report.absoluteRawGrade.percentiles[0]).toMatchObject({ trackIndex: 0, startPointIndex: 0 });
  });

  it("applique le rang supérieur à des effectifs pairs et impairs", () => {
    const even = analyzeGpxRawDistributions([track([0, 1, 3, 6, 10], [0, 0, 0, 0, 0])], options());
    const odd = analyzeGpxRawDistributions([track([0, 1, 3, 6], [0, 0, 0, 0])], options());
    expect(even.horizontalSpacingMeters.percentiles.find(({ percentile }) => percentile === 50)?.value).toBe(2);
    expect(odd.horizontalSpacingMeters.percentiles.find(({ percentile }) => percentile === 50)?.value).toBe(2);
  });

  it("est déterministe, défensif, sans mutation et profondément immuable", () => {
    const tracks = [track([0, 10, 30], [0, 1, -1])];
    const configuration = options();
    const snapshot = structuredClone({ tracks, configuration });
    const report = analyzeGpxRawDistributions(tracks, configuration);
    expect(report).toEqual(analyzeGpxRawDistributions(tracks, configuration));
    expect({ tracks, configuration }).toEqual(snapshot);
    (configuration.percentiles as number[])[0] = 12;
    expect(report.options.percentiles[0]).toBe(0);
    expect(Object.isFrozen(report)).toBe(true);
    expect(Object.isFrozen(report.options.percentiles)).toBe(true);
    expect(Object.isFrozen(report.horizontalSpacingMeters)).toBe(true);
    expect(Object.isFrozen(report.horizontalSpacingMeters.percentiles)).toBe(true);
    expect(Object.isFrozen(report.horizontalSpacingMeters.percentiles[0])).toBe(true);
    expect(Object.isFrozen(report.horizontalSpacingMeters.thresholds[0])).toBe(true);
    expect(Object.isFrozen(report.horizontalSpacingMeters.thresholds[0]?.firstObservationAbove)).toBe(true);
  });

  it.each([null, {}, [], [null], [track([0], [0])]])("rejette les tableaux de traces invalides %#", (value) => {
    expect(() => analyzeGpxRawDistributions(value as readonly DistanceAnnotatedGpxTrack[], options())).toThrow();
  });

  it.each([
    { key: "percentiles", value: [0, Number.NaN] }, { key: "percentiles", value: [-1, 0] },
    { key: "percentiles", value: [0, 101] }, { key: "percentiles", value: [50, 49] },
    { key: "percentiles", value: [50, 50] }, { key: "horizontalSpacingThresholdsMeters", value: [0] },
    { key: "horizontalSpacingThresholdsMeters", value: [2, 1] }, { key: "absoluteAltitudeDeltaThresholdsMeters", value: [1, 1] },
    { key: "absoluteRawGradeThresholds", value: [Number.POSITIVE_INFINITY] },
  ])("rejette l'option invalide $key=$value", ({ key, value }) => {
    expect(() => analyzeGpxRawDistributions([track([0, 1], [0, 0])], { ...options(), [key]: value })).toThrow();
  });

  it("rejette atomiquement les distances ou valeurs non finies", () => {
    const valid = track([0, 1], [0, 0]);
    const invalidDistance = { ...valid, points: [valid.points[0]!, { ...valid.points[1]!, distanceMeters: 0 }] };
    expect(() => analyzeGpxRawDistributions([valid, invalidDistance], options())).toThrow(/strictly increasing/);
    const invalidAltitude = { ...valid, points: [valid.points[0]!, { ...valid.points[1]!, altitudeMeters: Number.NaN }] };
    expect(() => analyzeGpxRawDistributions([valid, invalidAltitude], options())).toThrow(/finite/);
    const overflowing = track([0, Number.MAX_VALUE], [-Number.MAX_VALUE, Number.MAX_VALUE]);
    expect(() => analyzeGpxRawDistributions([overflowing], options())).toThrow(/metrics must be finite/);
  });
});
