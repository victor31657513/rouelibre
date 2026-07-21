import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  analyzeGpxGeometryQuality,
  computeGpxCumulativeDistances,
  parseGpxTrack,
} from "../src/index.js";

const CORPUS_JUMP_THRESHOLD_METERS = 250;

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
});
