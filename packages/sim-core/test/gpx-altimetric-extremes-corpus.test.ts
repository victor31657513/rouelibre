import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  analyzeGpxRawDistributions,
  computeGpxCumulativeDistances,
  parseGpxTrack,
  removeConsecutiveSameHorizontalGpxPoints,
} from "../src/index.js";

const corpusDirectoryUrl = new URL("../../../data/courses/tour-de-france/2026/raw/", import.meta.url);
const manifestUrl = new URL("../../../data/courses/tour-de-france/2026/altimetric-extremes.json", import.meta.url);
const corpusFiles = readdirSync(fileURLToPath(corpusDirectoryUrl))
  .filter((fileName) => fileName.endsWith(".gpx"))
  .sort();

const selectionReasonOrder = [
  "absolute-altitude-delta-above-20-m",
  "absolute-raw-grade-above-1",
  "absolute-altitude-delta-p99",
  "absolute-altitude-delta-p99.9",
  "absolute-altitude-delta-p100",
  "absolute-raw-grade-p99",
  "absolute-raw-grade-p99.9",
  "absolute-raw-grade-p100",
] as const;
type SelectionReason = (typeof selectionReasonOrder)[number];
type Direction = "ascending" | "descending";

interface CorpusCase {
  readonly id: string;
  readonly sourceFile: string;
  readonly selectionReasons: readonly SelectionReason[];
  readonly segment: {
    readonly normalizedStartPointIndex: number;
    readonly normalizedEndPointIndex: number;
    readonly rawStartPointIndex: number;
    readonly rawEndPointIndex: number;
    readonly horizontalSpacingMeters: number;
    readonly altitudeDeltaMeters: number;
    readonly rawGrade: number;
    readonly absoluteAltitudeDeltaMeters: number;
    readonly absoluteRawGrade: number;
    readonly direction: Direction;
    readonly horizontalSpacingAbove250Meters: boolean;
  };
  readonly context: readonly {
    readonly normalizedPointIndex: number;
    readonly rawPointIndex: number;
    readonly distanceMeters: number;
    readonly latitudeDegrees: number;
    readonly longitudeDegrees: number;
    readonly altitudeMeters: number;
  }[];
}

function buildCorpus(rawSources: readonly string[]) {
  const normalized = rawSources.map((xml) => {
    const parsed = parseGpxTrack(xml);
    const normalization = removeConsecutiveSameHorizontalGpxPoints(parsed);
    const removed = new Set(normalization.report.removedSourcePointIndices);
    const rawPointIndices = parsed.points.map((_, index) => index).filter((index) => !removed.has(index));
    return { parsed, rawPointIndices, track: computeGpxCumulativeDistances(normalization.track) };
  });
  const distribution = analyzeGpxRawDistributions(normalized.map(({ track }) => track), {
    percentiles: [99, 99.9, 100],
    horizontalSpacingThresholdsMeters: [],
    absoluteAltitudeDeltaThresholdsMeters: [20],
    absoluteRawGradeThresholds: [1],
  });
  const reasons = new Map<string, Set<SelectionReason>>();
  const key = (trackIndex: number, start: number, end: number) => `${trackIndex}:${start}:${end}`;
  const add = (trackIndex: number, start: number, end: number, reason: SelectionReason) => {
    const segmentKey = key(trackIndex, start, end);
    const entries = reasons.get(segmentKey) ?? new Set<SelectionReason>();
    entries.add(reason);
    reasons.set(segmentKey, entries);
  };

  normalized.forEach(({ track }, trackIndex) => {
    for (let end = 1; end < track.points.length; end += 1) {
      const startPoint = track.points[end - 1];
      const endPoint = track.points[end];
      if (startPoint === undefined || endPoint === undefined) throw new RangeError("corpus point is missing");
      const spacing = endPoint.distanceMeters - startPoint.distanceMeters;
      const delta = endPoint.altitudeMeters - startPoint.altitudeMeters;
      if (Math.abs(delta) > 20) add(trackIndex, end - 1, end, "absolute-altitude-delta-above-20-m");
      if (Math.abs(delta / spacing) > 1) add(trackIndex, end - 1, end, "absolute-raw-grade-above-1");
    }
  });
  for (const observation of distribution.absoluteAltitudeDeltaMeters.percentiles) {
    add(observation.trackIndex, observation.startPointIndex, observation.endPointIndex,
      `absolute-altitude-delta-p${observation.percentile}` as SelectionReason);
  }
  for (const observation of distribution.absoluteRawGrade.percentiles) {
    add(observation.trackIndex, observation.startPointIndex, observation.endPointIndex,
      `absolute-raw-grade-p${observation.percentile}` as SelectionReason);
  }

  const cases: CorpusCase[] = [];
  normalized.forEach(({ rawPointIndices, track }, trackIndex) => {
    for (let end = 1; end < track.points.length; end += 1) {
      const selected = reasons.get(key(trackIndex, end - 1, end));
      if (selected === undefined) continue;
      const startPoint = track.points[end - 1];
      const endPoint = track.points[end];
      if (startPoint === undefined || endPoint === undefined) throw new RangeError("selected point is missing");
      const horizontalSpacingMeters = endPoint.distanceMeters - startPoint.distanceMeters;
      const altitudeDeltaMeters = endPoint.altitudeMeters - startPoint.altitudeMeters;
      if (altitudeDeltaMeters === 0) throw new RangeError("selected segment must not be flat");
      const context = [];
      for (let pointIndex = Math.max(0, end - 3); pointIndex <= Math.min(track.points.length - 1, end + 2); pointIndex += 1) {
        const point = track.points[pointIndex];
        const rawPointIndex = rawPointIndices[pointIndex];
        if (point === undefined || rawPointIndex === undefined) throw new RangeError("context point is missing");
        context.push({ normalizedPointIndex: pointIndex, rawPointIndex, distanceMeters: point.distanceMeters,
          latitudeDegrees: point.latitudeDegrees, longitudeDegrees: point.longitudeDegrees, altitudeMeters: point.altitudeMeters });
      }
      const fileName = corpusFiles[trackIndex];
      const rawStartPointIndex = rawPointIndices[end - 1];
      const rawEndPointIndex = rawPointIndices[end];
      if (fileName === undefined || rawStartPointIndex === undefined || rawEndPointIndex === undefined) throw new RangeError("case identity is missing");
      const rawGrade = altitudeDeltaMeters / horizontalSpacingMeters;
      cases.push({
        id: `${fileName.replace(".gpx", "")}-${end - 1}-${end}`,
        sourceFile: `raw/${fileName}`,
        selectionReasons: selectionReasonOrder.filter((reason) => selected.has(reason)),
        segment: { normalizedStartPointIndex: end - 1, normalizedEndPointIndex: end,
          rawStartPointIndex, rawEndPointIndex, horizontalSpacingMeters, altitudeDeltaMeters, rawGrade,
          absoluteAltitudeDeltaMeters: Math.abs(altitudeDeltaMeters), absoluteRawGrade: Math.abs(rawGrade),
          direction: altitudeDeltaMeters > 0 ? "ascending" : "descending",
          horizontalSpacingAbove250Meters: horizontalSpacingMeters > 250 },
        context,
      });
    }
  });
  return { schemaVersion: 2, provenance: { pipeline: ["parseGpxTrack", "removeConsecutiveSameHorizontalGpxPoints", "computeGpxCumulativeDistances"],
    selection: { absoluteAltitudeDeltaMetersStrictlyAbove: 20, absoluteRawGradeStrictlyAbove: 1,
      percentileMethod: "empirical nearest-rank", percentiles: [99, 99.9, 100] },
    selectionReasonOrder, context: "two retained points before and after each selected segment when available" }, cases };
}

describe("corpus des extrêmes altimétriques", () => {
  it("reproduit et valide les cas tracés depuis les 21 sources GPX sans les modifier", () => {
    expect(corpusFiles).toHaveLength(21);
    expect(corpusFiles).toEqual([...corpusFiles].sort());
    const rawSources = corpusFiles.map((fileName) => readFileSync(new URL(fileName, corpusDirectoryUrl), "utf8"));
    const first = buildCorpus(rawSources);
    const second = buildCorpus(rawSources);
    const expected: unknown = JSON.parse(readFileSync(manifestUrl, "utf8"));
    expect(first).toEqual(second);
    expect(first).toEqual(expected);

    const altitudeCases = first.cases.filter(({ selectionReasons }) => selectionReasons.includes("absolute-altitude-delta-above-20-m"));
    const gradeCases = first.cases.filter(({ selectionReasons }) => selectionReasons.includes("absolute-raw-grade-above-1"));
    const altitudeIds = new Set(altitudeCases.map(({ id }) => id));
    expect(altitudeCases).toHaveLength(29);
    expect(gradeCases).toHaveLength(12);
    expect(gradeCases.filter(({ id }) => altitudeIds.has(id))).toHaveLength(2);
    expect(new Set([...altitudeCases, ...gradeCases].map(({ id }) => id))).toHaveLength(39);
    for (const reason of selectionReasonOrder.filter((entry) => entry.includes("-p"))) {
      expect(first.cases.filter(({ selectionReasons }) => selectionReasons.includes(reason))).toHaveLength(1);
    }
    expect(first.cases.filter(({ selectionReasons }) => selectionReasons.every((reason) => reason.includes("-p")))).toHaveLength(4);
    expect(first.cases).toHaveLength(43);

    expect(new Set(first.cases.map(({ id }) => id)).size).toBe(first.cases.length);
    expect(new Set(first.cases.map(({ sourceFile, segment }) => `${sourceFile}:${segment.normalizedStartPointIndex}:${segment.normalizedEndPointIndex}`)).size).toBe(first.cases.length);
    expect(first.cases.map(({ sourceFile, segment }) => [sourceFile, segment.normalizedStartPointIndex, segment.normalizedEndPointIndex]))
      .toEqual([...first.cases].sort((a, b) => a.sourceFile.localeCompare(b.sourceFile)
        || a.segment.normalizedStartPointIndex - b.segment.normalizedStartPointIndex
        || a.segment.normalizedEndPointIndex - b.segment.normalizedEndPointIndex)
        .map(({ sourceFile, segment }) => [sourceFile, segment.normalizedStartPointIndex, segment.normalizedEndPointIndex]));
    for (const corpusCase of first.cases) {
      const { segment, selectionReasons, context } = corpusCase;
      expect(new Set(selectionReasons).size).toBe(selectionReasons.length);
      expect(selectionReasons).toEqual(selectionReasonOrder.filter((reason) => selectionReasons.includes(reason)));
      expect(Object.values(segment).filter((value) => typeof value === "number").every(Number.isFinite)).toBe(true);
      expect(segment.absoluteAltitudeDeltaMeters).toBe(Math.abs(segment.altitudeDeltaMeters));
      expect(segment.absoluteRawGrade).toBe(Math.abs(segment.rawGrade));
      expect(segment.rawGrade).toBe(segment.altitudeDeltaMeters / segment.horizontalSpacingMeters);
      expect(segment.direction).toBe(segment.altitudeDeltaMeters > 0 ? "ascending" : "descending");
      expect(segment.horizontalSpacingAbove250Meters).toBe(segment.horizontalSpacingMeters > 250);
      expect(segment.normalizedEndPointIndex).toBe(segment.normalizedStartPointIndex + 1);
      const endpoints = context.filter(({ normalizedPointIndex }) => normalizedPointIndex === segment.normalizedStartPointIndex || normalizedPointIndex === segment.normalizedEndPointIndex);
      expect(endpoints).toHaveLength(2);
      expect(endpoints.map(({ rawPointIndex }) => rawPointIndex)).toEqual([segment.rawStartPointIndex, segment.rawEndPointIndex]);
    }
    corpusFiles.forEach((fileName, index) => expect(readFileSync(new URL(fileName, corpusDirectoryUrl), "utf8")).toBe(rawSources[index]));
  }, 30_000);
});
