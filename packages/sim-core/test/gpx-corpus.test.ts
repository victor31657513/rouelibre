import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  analyzeGpxRawDistributions,
  analyzeGpxGeometryQuality,
  analyzeGpxRawProfile,
  computeGpxCumulativeDistances,
  parseGpxTrack,
  removeConsecutiveSameHorizontalGpxPoints,
} from "../src/index.js";

const CORPUS_JUMP_THRESHOLD_METERS = 250;
const DISTRIBUTION_OPTIONS = Object.freeze({
  percentiles: Object.freeze([0, 0.1, 1, 5, 25, 50, 75, 95, 99, 99.9, 100]),
  horizontalSpacingThresholdsMeters: Object.freeze([25, 50, 100, 250, 500]),
  absoluteAltitudeDeltaThresholdsMeters: Object.freeze([1, 2, 5, 10, 20, 50]),
  absoluteRawGradeThresholds: Object.freeze([0.05, 0.10, 0.20, 0.50, 1.00]),
});

const corpusDirectory = fileURLToPath(
  new URL("../../../data/courses/tour-de-france/2026/raw/", import.meta.url),
);
const corpusFiles = readdirSync(corpusDirectory)
  .filter((fileName) => fileName.endsWith(".gpx"))
  .sort();

describe("corpus GPX du Tour de France 2026", () => {
  it("contient les 21 sources attendues", () => {
    expect(corpusFiles).toHaveLength(21);
  });

  it.each(corpusFiles)("analyse %s de façon déterministe", (fileName) => {
    const xml = readFileSync(new URL(`../../../data/courses/tour-de-france/2026/raw/${fileName}`, import.meta.url), "utf8");
    const first = parseGpxTrack(xml);
    const second = parseGpxTrack(xml);

    expect(first.points.length).toBeGreaterThanOrEqual(2);
    expect(first).toEqual(second);
    for (const point of first.points) {
      expect(Number.isFinite(point.latitudeDegrees)).toBe(true);
      expect(Number.isFinite(point.longitudeDegrees)).toBe(true);
      expect(Number.isFinite(point.altitudeMeters)).toBe(true);
      expect(point.latitudeDegrees).toBeGreaterThanOrEqual(-90);
      expect(point.latitudeDegrees).toBeLessThanOrEqual(90);
      expect(point.longitudeDegrees).toBeGreaterThanOrEqual(-180);
      expect(point.longitudeDegrees).toBeLessThanOrEqual(180);
    }
  });

  it.each(corpusFiles)("calcule les distances horizontales de %s sans modifier les points", (fileName) => {
    const xml = readFileSync(new URL(`../../../data/courses/tour-de-france/2026/raw/${fileName}`, import.meta.url), "utf8");
    const parsed = parseGpxTrack(xml);
    const first = computeGpxCumulativeDistances(parsed);
    const second = computeGpxCumulativeDistances(parsed);

    expect(first.points).toHaveLength(parsed.points.length);
    expect(first.points[0]?.distanceMeters).toBe(0);
    expect(first).toEqual(second);
    expect(Number.isFinite(first.totalLengthMeters)).toBe(true);
    expect(first.totalLengthMeters).toBeGreaterThan(0);
    expect(first.points.at(-1)?.distanceMeters).toBe(first.totalLengthMeters);
    for (let index = 0; index < first.points.length; index += 1) {
      const point = first.points[index];
      const source = parsed.points[index];
      expect(point?.latitudeDegrees).toBe(source?.latitudeDegrees);
      expect(point?.longitudeDegrees).toBe(source?.longitudeDegrees);
      expect(point?.altitudeMeters).toBe(source?.altitudeMeters);
      expect(Number.isFinite(point?.distanceMeters)).toBe(true);
      expect(point?.distanceMeters).toBeGreaterThanOrEqual(0);
      if (index > 0) {
        expect(point?.distanceMeters).toBeGreaterThanOrEqual(first.points[index - 1]?.distanceMeters ?? 0);
      }
    }
  });

  it.each(corpusFiles)("observe la qualité géométrique de %s sans modifier les données", (fileName) => {
    const xml = readFileSync(new URL(`../../../data/courses/tour-de-france/2026/raw/${fileName}`, import.meta.url), "utf8");
    const distanceAnnotated = computeGpxCumulativeDistances(parseGpxTrack(xml));
    const snapshot = structuredClone(distanceAnnotated);
    const first = analyzeGpxGeometryQuality(distanceAnnotated, {
      jumpThresholdMeters: CORPUS_JUMP_THRESHOLD_METERS,
    });
    const second = analyzeGpxGeometryQuality(distanceAnnotated, {
      jumpThresholdMeters: CORPUS_JUMP_THRESHOLD_METERS,
    });

    expect(first).toEqual(second);
    expect(first.pointCount).toBe(distanceAnnotated.points.length);
    expect(first.segmentCount).toBe(first.pointCount - 1);
    expect(first.totalLengthMeters).toBe(distanceAnnotated.totalLengthMeters);
    expect(Number.isFinite(first.longestSegment.segmentDistanceMeters)).toBe(true);
    expect(first.longestSegment.segmentDistanceMeters).toBeGreaterThanOrEqual(0);

    const observations = [
      ...first.exactDuplicateSegments,
      ...first.zeroHorizontalSegments,
      ...first.jumpSegments,
      first.longestSegment,
    ];
    for (const observation of observations) {
      expect(observation.startPointIndex).toBeGreaterThanOrEqual(0);
      expect(observation.endPointIndex).toBe(observation.startPointIndex + 1);
      expect(observation.endPointIndex).toBeLessThan(first.pointCount);
    }
    for (const observation of first.zeroHorizontalSegments) {
      const start = distanceAnnotated.points[observation.startPointIndex];
      const end = distanceAnnotated.points[observation.endPointIndex];
      expect((end?.distanceMeters ?? Number.NaN) - (start?.distanceMeters ?? Number.NaN)).toBe(0);
    }
    for (const observation of first.jumpSegments) {
      expect(observation.segmentDistanceMeters).toBeGreaterThan(CORPUS_JUMP_THRESHOLD_METERS);
    }
    expect(distanceAnnotated).toEqual(snapshot);
    expect(readFileSync(new URL(`../../../data/courses/tour-de-france/2026/raw/${fileName}`, import.meta.url), "utf8"))
      .toBe(xml);
  });

  it("supprime les 771 positions horizontales consécutives identiques du corpus", () => {
    let sourcePointCount = 0;
    let retainedPointCount = 0;
    let removedPointCount = 0;
    let removedExactDuplicateCount = 0;
    let removedDifferentAltitudeCount = 0;
    let zeroHorizontalCount = 0;
    let jumpCount = 0;
    let sourceLongest = { fileName: "", distance: -1 };
    let normalizedLongest = { fileName: "", distance: -1 };
    const remainingZeroSegments: Array<{ fileName: string; start: number; end: number; latitude: number; longitude: number; startAltitude: number; endAltitude: number; distance: number }> = [];

    for (const fileName of corpusFiles) {
      const url = new URL(`../../../data/courses/tour-de-france/2026/raw/${fileName}`, import.meta.url);
      const xml = readFileSync(url, "utf8");
      const parsed = parseGpxTrack(xml);
      const sourceDistances = computeGpxCumulativeDistances(parsed);
      const sourceQuality = analyzeGpxGeometryQuality(sourceDistances, { jumpThresholdMeters: CORPUS_JUMP_THRESHOLD_METERS });
      const first = removeConsecutiveSameHorizontalGpxPoints(parsed);
      const second = removeConsecutiveSameHorizontalGpxPoints(parsed);
      const normalizedDistances = computeGpxCumulativeDistances(first.track);
      const normalizedQuality = analyzeGpxGeometryQuality(normalizedDistances, { jumpThresholdMeters: CORPUS_JUMP_THRESHOLD_METERS });

      expect(first).toEqual(second);
      expect(normalizedDistances.totalLengthMeters).toBe(sourceDistances.totalLengthMeters);
      expect(normalizedQuality.exactDuplicateSegments).toEqual([]);
      expect(normalizedQuality.jumpSegments.map(({ segmentDistanceMeters }) => segmentDistanceMeters))
        .toEqual(sourceQuality.jumpSegments.map(({ segmentDistanceMeters }) => segmentDistanceMeters));
      const removed = new Set(first.report.removedSourcePointIndices);
      let normalizedIndex = 0;
      let previousRetainedSourceIndex = -1;
      for (let sourceIndex = 0; sourceIndex < parsed.points.length; sourceIndex += 1) {
        const sourcePoint = parsed.points[sourceIndex];
        if (removed.has(sourceIndex)) {
          const previous = parsed.points[previousRetainedSourceIndex];
          expect(sourcePoint?.latitudeDegrees).toBe(previous?.latitudeDegrees);
          expect(sourcePoint?.longitudeDegrees).toBe(previous?.longitudeDegrees);
          if (first.report.removedExactDuplicateSourcePointIndices.includes(sourceIndex)) {
            expect(sourcePoint?.altitudeMeters).toBe(previous?.altitudeMeters);
          } else {
            expect(first.report.removedDifferentAltitudeSourcePointIndices).toContain(sourceIndex);
            expect(sourcePoint?.altitudeMeters).not.toBe(previous?.altitudeMeters);
          }
        } else {
          expect(first.track.points[normalizedIndex]).toEqual(sourcePoint);
          previousRetainedSourceIndex = sourceIndex;
          normalizedIndex += 1;
        }
      }
      expect(normalizedIndex).toBe(first.track.points.length);
      if (fileName === "tour-de-france-2026-etape-03-granollers-les-angles.gpx") {
        expect(first.report.removedDifferentAltitudeSourcePointIndices).toEqual([1864]);
        expect(parsed.points[1863]).toEqual({
          latitudeDegrees: 41.87328, longitudeDegrees: 2.28579, altitudeMeters: 621.5,
        });
        expect(parsed.points[1864]).toEqual({
          latitudeDegrees: 41.87328, longitudeDegrees: 2.28579, altitudeMeters: 619,
        });
        expect(first.track.points[1861]).toEqual(parsed.points[1863]);
        expect(first.track.points[1862]).toEqual(parsed.points[1865]);
      }
      expect(readFileSync(url, "utf8")).toBe(xml);

      sourcePointCount += parsed.points.length;
      retainedPointCount += first.track.points.length;
      removedPointCount += first.report.removedPointCount;
      removedExactDuplicateCount += first.report.removedExactDuplicatePointCount;
      removedDifferentAltitudeCount += first.report.removedDifferentAltitudePointCount;
      zeroHorizontalCount += normalizedQuality.zeroHorizontalSegments.length;
      jumpCount += normalizedQuality.jumpSegments.length;
      if (sourceQuality.longestSegment.segmentDistanceMeters > sourceLongest.distance) {
        sourceLongest = { fileName, distance: sourceQuality.longestSegment.segmentDistanceMeters };
      }
      if (normalizedQuality.longestSegment.segmentDistanceMeters > normalizedLongest.distance) {
        normalizedLongest = { fileName, distance: normalizedQuality.longestSegment.segmentDistanceMeters };
      }
      for (const segment of normalizedQuality.zeroHorizontalSegments) {
        const start = normalizedDistances.points[segment.startPointIndex];
        const end = normalizedDistances.points[segment.endPointIndex];
        if (start !== undefined && end !== undefined) remainingZeroSegments.push({
          fileName, start: segment.startPointIndex, end: segment.endPointIndex,
          latitude: start.latitudeDegrees, longitude: start.longitudeDegrees,
          startAltitude: start.altitudeMeters, endAltitude: end.altitudeMeters,
          distance: segment.segmentDistanceMeters,
        });
      }
    }

    expect({ sourcePointCount, removedPointCount, retainedPointCount }).toEqual({
      sourcePointCount: 160_626, removedPointCount: 771, retainedPointCount: 159_855,
    });
    expect(removedExactDuplicateCount).toBe(770);
    expect(removedDifferentAltitudeCount).toBe(1);
    expect(zeroHorizontalCount).toBe(0);
    expect(jumpCount).toBe(82);
    expect(normalizedLongest).toEqual(sourceLongest);
    expect(remainingZeroSegments).toEqual([]);
  }, 15_000);

  it("agrège les espacements et pentes brutes des 21 traces normalisées", () => {
    const rawSources = new Map(corpusFiles.map((fileName) => [
      fileName,
      readFileSync(new URL(`../../../data/courses/tour-de-france/2026/raw/${fileName}`, import.meta.url), "utf8"),
    ]));
    let pointCount = 0;
    let segmentCount = 0;
    let totalHorizontalLengthMeters = 0;
    let ascendingSegmentCount = 0;
    let descendingSegmentCount = 0;
    let constantAltitudeSegmentCount = 0;
    let minimumSpacing: { fileName: string; startPointIndex: number; endPointIndex: number;
      horizontalSpacingMeters: number; altitudeDeltaMeters: number; rawGrade: number; value: number } | undefined;
    let maximumSpacing: typeof minimumSpacing;
    let minimumGrade: typeof minimumSpacing;
    let maximumGrade: typeof minimumSpacing;

    for (const fileName of corpusFiles) {
      const parsed = parseGpxTrack(rawSources.get(fileName) ?? "");
      const normalized = removeConsecutiveSameHorizontalGpxPoints(parsed).track;
      const distances = computeGpxCumulativeDistances(normalized);
      const first = analyzeGpxRawProfile(distances);
      const second = analyzeGpxRawProfile(distances);
      expect(first).toEqual(second);
      expect(first.pointCount).toBe(normalized.points.length);
      expect(first.segmentCount).toBe(first.pointCount - 1);
      for (const observation of [
        first.minimumHorizontalSpacing, first.maximumHorizontalSpacing,
        first.minimumRawGrade, first.maximumRawGrade,
      ]) {
        expect(Number.isFinite(observation.horizontalSpacingMeters)).toBe(true);
        expect(Number.isFinite(observation.altitudeDeltaMeters)).toBe(true);
        expect(Number.isFinite(observation.rawGrade)).toBe(true);
        expect(observation.horizontalSpacingMeters).toBeGreaterThan(0);
      }

      pointCount += first.pointCount;
      segmentCount += first.segmentCount;
      totalHorizontalLengthMeters += first.totalHorizontalLengthMeters;
      ascendingSegmentCount += first.ascendingSegmentCount;
      descendingSegmentCount += first.descendingSegmentCount;
      constantAltitudeSegmentCount += first.constantAltitudeSegmentCount;
      const candidates = [
        ["minimumSpacing", first.minimumHorizontalSpacing.horizontalSpacingMeters, first.minimumHorizontalSpacing],
        ["maximumSpacing", first.maximumHorizontalSpacing.horizontalSpacingMeters, first.maximumHorizontalSpacing],
        ["minimumGrade", first.minimumRawGrade.rawGrade, first.minimumRawGrade],
        ["maximumGrade", first.maximumRawGrade.rawGrade, first.maximumRawGrade],
      ] as const;
      for (const [kind, value, observation] of candidates) {
        const current = kind === "minimumSpacing" ? minimumSpacing : kind === "maximumSpacing" ? maximumSpacing
          : kind === "minimumGrade" ? minimumGrade : maximumGrade;
        const shouldReplace = current === undefined
          || (kind.startsWith("minimum") ? value < current.value : value > current.value);
        if (shouldReplace) {
          const candidate = { fileName, startPointIndex: observation.startPointIndex,
            endPointIndex: observation.endPointIndex,
            horizontalSpacingMeters: observation.horizontalSpacingMeters,
            altitudeDeltaMeters: observation.altitudeDeltaMeters,
            rawGrade: observation.rawGrade, value };
          if (kind === "minimumSpacing") minimumSpacing = candidate;
          else if (kind === "maximumSpacing") maximumSpacing = candidate;
          else if (kind === "minimumGrade") minimumGrade = candidate;
          else maximumGrade = candidate;
        }
      }
    }

    expect({ pointCount, segmentCount, totalHorizontalLengthMeters,
      ascendingSegmentCount, descendingSegmentCount, constantAltitudeSegmentCount })
      .toEqual({ pointCount: 159_855, segmentCount: 159_834,
        totalHorizontalLengthMeters: 3_425_268.0713700126,
        ascendingSegmentCount: 73_625, descendingSegmentCount: 66_626,
        constantAltitudeSegmentCount: 19_583 });
    expect(minimumSpacing).toEqual({
      fileName: "tour-de-france-2026-etape-21-thoiry-paris-champs-elysees.gpx",
      startPointIndex: 4285, endPointIndex: 4286, value: 0.7313561113696778,
      horizontalSpacingMeters: 0.7313561113696778, altitudeDeltaMeters: 0, rawGrade: 0,
    });
    expect(maximumSpacing).toEqual({
      fileName: "tour-de-france-2026-etape-03-granollers-les-angles.gpx",
      startPointIndex: 1263, endPointIndex: 1264, value: 747.3787552887879,
      horizontalSpacingMeters: 747.3787552887879, altitudeDeltaMeters: 7.25,
      rawGrade: 0.009700570090728083,
    });
    expect(minimumGrade).toEqual({
      fileName: "tour-de-france-2026-etape-17-chambery-voiron.gpx",
      startPointIndex: 5134, endPointIndex: 5135, value: -3.500590447278541,
      horizontalSpacingMeters: 20.99645791387593, altitudeDeltaMeters: -73.5,
      rawGrade: -3.500590447278541,
    });
    expect(maximumGrade).toEqual({
      fileName: "tour-de-france-2026-etape-15-champagnole-plateau-de-solaison.gpx",
      startPointIndex: 3993, endPointIndex: 3994, value: 1.1580924556686452,
      horizontalSpacingMeters: 11.225355917282286, altitudeDeltaMeters: 13,
      rawGrade: 1.1580924556686452,
    });
    for (const [fileName, xml] of rawSources) {
      expect(readFileSync(new URL(`../../../data/courses/tour-de-france/2026/raw/${fileName}`, import.meta.url), "utf8"))
        .toBe(xml);
    }
  }, 20_000);

  it("diagnostique les distributions par étape et sur le corpus agrégé", () => {
    const rawSources = corpusFiles.map((fileName) => readFileSync(
      new URL(`../../../data/courses/tour-de-france/2026/raw/${fileName}`, import.meta.url), "utf8",
    ));
    const tracks = rawSources.map((xml) => computeGpxCumulativeDistances(
      removeConsecutiveSameHorizontalGpxPoints(parseGpxTrack(xml)).track,
    ));
    const stageReports = tracks.map((track) => analyzeGpxRawDistributions([track], DISTRIBUTION_OPTIONS));
    const aggregate = analyzeGpxRawDistributions(tracks, DISTRIBUTION_OPTIONS);

    expect(stageReports).toEqual(tracks.map((track) => analyzeGpxRawDistributions([track], DISTRIBUTION_OPTIONS)));
    expect(aggregate).toEqual(analyzeGpxRawDistributions(tracks, DISTRIBUTION_OPTIONS));
    expect(aggregate).toMatchObject({ trackCount: 21, pointCount: 159_855, segmentCount: 159_834 });
    const distributions = [aggregate.horizontalSpacingMeters, aggregate.altitudeDeltaMeters,
      aggregate.absoluteAltitudeDeltaMeters, aggregate.absoluteRawGrade];
    for (const distribution of distributions) {
      expect(distribution.percentiles.map(({ percentile }) => percentile)).toEqual(DISTRIBUTION_OPTIONS.percentiles);
      for (const observation of distribution.percentiles) {
        for (const value of [observation.percentile, observation.value, observation.horizontalSpacingMeters,
          observation.altitudeDeltaMeters, observation.rawGrade]) expect(Number.isFinite(value)).toBe(true);
      }
      for (const threshold of distribution.thresholds) {
        expect(Number.isFinite(threshold.threshold)).toBe(true);
        expect(Number.isFinite(threshold.proportion)).toBe(true);
        expect(threshold.segmentCountAbove).toBeGreaterThanOrEqual(0);
      }
    }
    for (const key of ["horizontalSpacingMeters", "absoluteAltitudeDeltaMeters", "absoluteRawGrade"] as const) {
      expect(aggregate[key].thresholds.map(({ segmentCountAbove }) => segmentCountAbove)).toEqual(
        aggregate[key].thresholds.map((_, thresholdIndex) => stageReports.reduce(
          (sum, report) => sum + (report[key].thresholds[thresholdIndex]?.segmentCountAbove ?? 0), 0,
        )),
      );
    }
    expect(aggregate.horizontalSpacingMeters.percentiles.map(({ value }) => value)).toEqual([
      0.7313561113696778, 0.7839677878000657, 1.8607079709836398, 3.701651918483549,
      8.949478733782598, 15.138322053371667, 25.957515128786326, 59.430400331664714,
      108.52812897859258, 216.09650285716634, 747.3787552887879,
    ]);
    expect(aggregate.altitudeDeltaMeters.percentiles.map(({ value }) => value)).toEqual([
      -93.40000000000009, -7.2999999999999545, -3.599999999999966, -1.7999999999999545,
      -0.40000000000009095, 0, 0.5, 2, 3.8999999999999773, 7.5, 107.10000000000002,
    ]);
    expect(aggregate.absoluteAltitudeDeltaMeters.thresholds.map(({ segmentCountAbove }) => segmentCountAbove))
      .toEqual([39_602, 13_617, 1_268, 132, 29, 9]);
    expect(aggregate.absoluteRawGrade.thresholds.map(({ segmentCountAbove }) => segmentCountAbove))
      .toEqual([55_112, 18_181, 3_170, 219, 12]);

    const directionCounts = tracks.map(analyzeGpxRawProfile).reduce((counts, report) => ({
      ascending: counts.ascending + report.ascendingSegmentCount,
      descending: counts.descending + report.descendingSegmentCount,
      constant: counts.constant + report.constantAltitudeSegmentCount,
    }), { ascending: 0, descending: 0, constant: 0 });
    expect(directionCounts).toEqual({ ascending: 73_625, descending: 66_626, constant: 19_583 });
    corpusFiles.forEach((fileName, index) => expect(readFileSync(
      new URL(`../../../data/courses/tour-de-france/2026/raw/${fileName}`, import.meta.url), "utf8",
    )).toBe(rawSources[index]));
  }, 30_000);
});
