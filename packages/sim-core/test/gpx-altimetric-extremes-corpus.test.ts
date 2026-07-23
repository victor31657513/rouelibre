import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  computeGpxCumulativeDistances,
  parseGpxTrack,
  removeConsecutiveSameHorizontalGpxPoints,
} from "../src/index.js";

const corpusDirectory = fileURLToPath(
  new URL("../../../data/courses/tour-de-france/2026/raw/", import.meta.url),
);
const corpusFiles = readdirSync(corpusDirectory)
  .filter((fileName) => fileName.endsWith(".gpx"))
  .sort();

describe("corpus des extrêmes altimétriques", () => {
  it("reproduit les cas tracés depuis les sources GPX sans les modifier", () => {
    const rawSources = corpusFiles.map((fileName) => readFileSync(
      new URL(`../../../data/courses/tour-de-france/2026/raw/${fileName}`, import.meta.url),
      "utf8",
    ));
    const cases: unknown[] = [];

    corpusFiles.forEach((fileName, trackIndex) => {
      const parsed = parseGpxTrack(rawSources[trackIndex] ?? "");
      const normalization = removeConsecutiveSameHorizontalGpxPoints(parsed);
      const track = computeGpxCumulativeDistances(normalization.track);
      const removedIndices = new Set(normalization.report.removedSourcePointIndices);
      const rawPointIndices: number[] = [];
      for (let rawPointIndex = 0; rawPointIndex < parsed.points.length; rawPointIndex += 1) {
        if (!removedIndices.has(rawPointIndex)) rawPointIndices.push(rawPointIndex);
      }

      for (let endPointIndex = 1; endPointIndex < track.points.length; endPointIndex += 1) {
        const start = track.points[endPointIndex - 1];
        const end = track.points[endPointIndex];
        if (start === undefined || end === undefined) throw new RangeError("corpus point is missing");
        const horizontalSpacingMeters = end.distanceMeters - start.distanceMeters;
        const altitudeDeltaMeters = end.altitudeMeters - start.altitudeMeters;
        const rawGrade = altitudeDeltaMeters / horizontalSpacingMeters;
        const categories = [
          ...(Math.abs(altitudeDeltaMeters) > 50 ? ["absolute-altitude-delta-above-50-m"] : []),
          ...(Math.abs(rawGrade) > 1 ? ["absolute-raw-grade-above-1"] : []),
        ];
        if (categories.length === 0) continue;

        const context = [];
        const firstContextIndex = Math.max(0, endPointIndex - 3);
        const lastContextIndex = Math.min(track.points.length - 1, endPointIndex + 2);
        for (let pointIndex = firstContextIndex; pointIndex <= lastContextIndex; pointIndex += 1) {
          const point = track.points[pointIndex];
          if (point === undefined) throw new RangeError("context point is missing");
          context.push({
            normalizedPointIndex: pointIndex,
            rawPointIndex: rawPointIndices[pointIndex],
            distanceMeters: point.distanceMeters,
            latitudeDegrees: point.latitudeDegrees,
            longitudeDegrees: point.longitudeDegrees,
            altitudeMeters: point.altitudeMeters,
          });
        }
        cases.push({
          id: `${fileName.replace(".gpx", "")}-${endPointIndex - 1}-${endPointIndex}`,
          sourceFile: `raw/${fileName}`,
          categories,
          segment: {
            normalizedStartPointIndex: endPointIndex - 1,
            normalizedEndPointIndex: endPointIndex,
            rawStartPointIndex: rawPointIndices[endPointIndex - 1],
            rawEndPointIndex: rawPointIndices[endPointIndex],
            horizontalSpacingMeters,
            altitudeDeltaMeters,
            rawGrade,
          },
          context,
        });
      }
    });

    const actual = {
      schemaVersion: 1,
      provenance: {
        pipeline: [
          "parseGpxTrack",
          "removeConsecutiveSameHorizontalGpxPoints",
          "computeGpxCumulativeDistances",
        ],
        selection: {
          absoluteAltitudeDeltaMetersStrictlyAbove: 50,
          absoluteRawGradeStrictlyAbove: 1,
        },
        context: "two retained points before and after each selected segment when available",
      },
      cases,
    };
    const expected: unknown = JSON.parse(readFileSync(
      new URL("../../../data/courses/tour-de-france/2026/altimetric-extremes.json", import.meta.url),
      "utf8",
    ));

    expect(actual).toEqual(expected);
    expect(cases).toHaveLength(20);
    expect(cases.filter((entry) => JSON.stringify(entry).includes("absolute-altitude-delta-above-50-m")))
      .toHaveLength(9);
    expect(cases.filter((entry) => JSON.stringify(entry).includes("absolute-raw-grade-above-1")))
      .toHaveLength(12);
    corpusFiles.forEach((fileName, index) => expect(readFileSync(
      new URL(`../../../data/courses/tour-de-france/2026/raw/${fileName}`, import.meta.url),
      "utf8",
    )).toBe(rawSources[index]));
  }, 30_000);
});
