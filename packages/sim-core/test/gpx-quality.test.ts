import { describe, expect, it } from "vitest";

import {
  analyzeGpxGeometryQuality,
  type DistanceAnnotatedGpxPoint,
  type DistanceAnnotatedGpxTrack,
} from "../src/index.js";

function point(
  latitudeDegrees: number,
  longitudeDegrees: number,
  altitudeMeters: number,
  distanceMeters: number,
): DistanceAnnotatedGpxPoint {
  return { latitudeDegrees, longitudeDegrees, altitudeMeters, distanceMeters };
}

function track(...points: DistanceAnnotatedGpxPoint[]): DistanceAnnotatedGpxTrack {
  return { points, totalLengthMeters: points.at(-1)?.distanceMeters ?? 0 };
}

const options = { jumpThresholdMeters: 100 };

describe("analyzeGpxGeometryQuality", () => {
  it("rapporte une trace sans anomalie et son premier segment maximal", () => {
    const report = analyzeGpxGeometryQuality(track(
      point(0, 0, 0, 0), point(0, 1, 1, 40), point(0, 2, 2, 100),
      point(0, 3, 3, 160),
    ), options);
    expect(report).toEqual({
      pointCount: 4,
      segmentCount: 3,
      totalLengthMeters: 160,
      jumpThresholdMeters: 100,
      longestSegment: { startPointIndex: 1, endPointIndex: 2, segmentDistanceMeters: 60 },
      exactDuplicateSegments: [],
      zeroHorizontalSegments: [],
      jumpSegments: [],
    });
  });

  it("classe un doublon exact parmi les doublons et les segments nuls", () => {
    const report = analyzeGpxGeometryQuality(track(
      point(1, 2, 3, 0), point(1, 2, 3, 0), point(2, 3, 4, 10),
    ), options);
    const duplicate = { startPointIndex: 0, endPointIndex: 1, segmentDistanceMeters: 0 };
    expect(report.exactDuplicateSegments).toEqual([duplicate]);
    expect(report.zeroHorizontalSegments).toEqual([duplicate]);
  });

  it("distingue une altitude différente à la même position horizontale", () => {
    const report = analyzeGpxGeometryQuality(track(
      point(1, 2, 3, 0), point(1, 2, 4, 0), point(2, 3, 4, 10),
    ), options);
    expect(report.exactDuplicateSegments).toEqual([]);
    expect(report.zeroHorizontalSegments).toEqual([
      { startPointIndex: 0, endPointIndex: 1, segmentDistanceMeters: 0 },
    ]);
  });

  it("signale seulement les segments strictement supérieurs au seuil", () => {
    const report = analyzeGpxGeometryQuality(track(
      point(0, 0, 0, 0), point(0, 1, 0, 99), point(0, 2, 0, 199),
      point(0, 3, 0, 300),
    ), options);
    expect(report.jumpSegments).toEqual([
      { startPointIndex: 2, endPointIndex: 3, segmentDistanceMeters: 101 },
    ]);
  });

  it("préserve les indices, distances et ordre documentaire de plusieurs anomalies", () => {
    const report = analyzeGpxGeometryQuality(track(
      point(0, 0, 0, 0), point(0, 0, 0, 0), point(1, 1, 1, 150),
      point(1, 1, 2, 150), point(2, 2, 2, 260),
    ), options);
    expect(report.zeroHorizontalSegments).toEqual([
      { startPointIndex: 0, endPointIndex: 1, segmentDistanceMeters: 0 },
      { startPointIndex: 2, endPointIndex: 3, segmentDistanceMeters: 0 },
    ]);
    expect(report.jumpSegments).toEqual([
      { startPointIndex: 1, endPointIndex: 2, segmentDistanceMeters: 150 },
      { startPointIndex: 3, endPointIndex: 4, segmentDistanceMeters: 110 },
    ]);
  });

  it("gèle profondément le rapport et toutes ses observations", () => {
    const report = analyzeGpxGeometryQuality(track(
      point(0, 0, 0, 0), point(0, 0, 0, 0), point(1, 1, 1, 150),
    ), options);
    expect(Object.isFrozen(report)).toBe(true);
    expect(Object.isFrozen(report.longestSegment)).toBe(true);
    for (const observations of [
      report.exactDuplicateSegments, report.zeroHorizontalSegments, report.jumpSegments,
    ]) {
      expect(Object.isFrozen(observations)).toBe(true);
      expect(observations.every(Object.isFrozen)).toBe(true);
    }
  });

  it("est déterministe et ne modifie pas l'entrée", () => {
    const input = track(point(0, 0, 0, 0), point(1, 1, 1, 10));
    const snapshot = structuredClone(input);
    expect(analyzeGpxGeometryQuality(input, options))
      .toEqual(analyzeGpxGeometryQuality(input, options));
    expect(input).toEqual(snapshot);
  });

  it.each([
    ["track absent", null, options, TypeError],
    ["points absent", {}, options, TypeError],
    ["points non tableau", { points: {} }, options, TypeError],
    ["moins de deux points", track(point(0, 0, 0, 0)), options, RangeError],
    ["point non objet", { points: [point(0, 0, 0, 0), null], totalLengthMeters: 0 }, options, TypeError],
    ["nombre non fini", track(point(0, 0, 0, 0), point(1, 1, Number.NaN, 1)), options, TypeError],
    ["latitude hors limites", track(point(0, 0, 0, 0), point(91, 1, 0, 1)), options, RangeError],
    ["longitude hors limites", track(point(0, 0, 0, 0), point(1, 181, 0, 1)), options, RangeError],
    ["origine non nulle", track(point(0, 0, 0, 1), point(1, 1, 0, 2)), options, RangeError],
    ["distance décroissante", track(point(0, 0, 0, 0), point(1, 1, 0, 2), point(2, 2, 0, 1)), options, RangeError],
    ["longueur incohérente", { ...track(point(0, 0, 0, 0), point(1, 1, 0, 1)), totalLengthMeters: 2 }, options, RangeError],
    ["options absentes", track(point(0, 0, 0, 0), point(1, 1, 0, 1)), null, TypeError],
  ])("rejette une entrée invalide : %s", (_label, input, candidateOptions, error) => {
    expect(() => analyzeGpxGeometryQuality(
      input as DistanceAnnotatedGpxTrack,
      candidateOptions as { jumpThresholdMeters: number },
    )).toThrow(error);
  });

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejette le seuil invalide %s", (jumpThresholdMeters) => {
      expect(() => analyzeGpxGeometryQuality(
        track(point(0, 0, 0, 0), point(1, 1, 0, 1)), { jumpThresholdMeters },
      )).toThrow(jumpThresholdMeters <= 0 ? RangeError : TypeError);
    },
  );
});
