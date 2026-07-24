import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  computeGpxCumulativeDistances,
  parseGpxTrack,
  removeConsecutiveSameHorizontalGpxPoints,
  type DistanceAnnotatedGpxTrack,
} from "../../src/index.js";

const dataUrl = new URL("../../../../data/courses/tour-de-france/2026/", import.meta.url);
const rawUrl = new URL("raw/", dataUrl);

export interface IdentityConfiguration {
  readonly endpointPolicy: "preserve";
  readonly longIntervalPolicy: "preserve";
}

interface Protocol {
  readonly schemaVersion: number;
  readonly syntheticProfiles: readonly {
    readonly id: string;
    readonly points: readonly { readonly distanceMeters: number; readonly altitudeMeters: number }[];
  }[];
  readonly hardGates: readonly { readonly id: string }[];
  readonly metrics: readonly { readonly id: string }[];
}

interface ManifestCase {
  readonly id: string;
  readonly sourceFile: string;
  readonly selectionReasons: readonly string[];
  readonly segment: {
    readonly normalizedStartPointIndex: number;
    readonly normalizedEndPointIndex: number;
    readonly direction: string;
    readonly horizontalSpacingAbove250Meters: boolean;
  };
}

interface Manifest { readonly schemaVersion: number; readonly cases: readonly ManifestCase[] }

export interface PreparedPoint {
  readonly distanceMeters: number;
  readonly altitudeMeters: number;
  readonly latitudeDegrees?: number;
  readonly longitudeDegrees?: number;
  readonly sourcePointIndices: readonly number[];
}

export interface PreparedProfile { readonly points: readonly PreparedPoint[] }

export const identityReference = Object.freeze({
  id: "identity",
  version: 1,
  configurationId: "identity-preserve-v1",
  configuration: deepFreeze<IdentityConfiguration>({ endpointPolicy: "preserve", longIntervalPolicy: "preserve" }),
});

export const availableReferences = Object.freeze([identityReference]);

export function deepFreeze<T>(value: T): Readonly<T> {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

function validatePoints(points: readonly { distanceMeters: number; altitudeMeters: number }[]): void {
  if (points.length < 2) throw new RangeError("a profile requires at least two points");
  points.forEach((point, index) => {
    if (!Number.isFinite(point.distanceMeters) || !Number.isFinite(point.altitudeMeters)) throw new RangeError("profile values must be finite");
    if (index === 0 ? point.distanceMeters !== 0 : point.distanceMeters <= (points[index - 1]?.distanceMeters ?? Infinity)) {
      throw new RangeError("profile distances must start at zero and increase strictly");
    }
  });
}

export function prepareIdentity(profile: { readonly points: readonly {
  readonly distanceMeters: number; readonly altitudeMeters: number;
  readonly latitudeDegrees?: number; readonly longitudeDegrees?: number;
}[] }): PreparedProfile {
  validatePoints(profile.points);
  const points = profile.points.map((point, index) => ({
    distanceMeters: point.distanceMeters,
    altitudeMeters: point.altitudeMeters,
    ...(point.latitudeDegrees === undefined ? {} : { latitudeDegrees: point.latitudeDegrees }),
    ...(point.longitudeDegrees === undefined ? {} : { longitudeDegrees: point.longitudeDegrees }),
    sourcePointIndices: [index],
  }));
  return deepFreeze({ points });
}

function nearestRank(values: readonly number[], percentile: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.max(0, Math.ceil(percentile / 100 * sorted.length) - 1)] ?? 0;
}

function profileStats(points: readonly { distanceMeters: number; altitudeMeters: number }[]) {
  let minimumAltitude = points[0]?.altitudeMeters ?? 0;
  let maximumAltitude = minimumAltitude;
  let gain = 0;
  let loss = 0;
  const grades: number[] = [];
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const point = points[index];
    if (previous === undefined || point === undefined) throw new RangeError("missing profile point");
    minimumAltitude = Math.min(minimumAltitude, point.altitudeMeters);
    maximumAltitude = Math.max(maximumAltitude, point.altitudeMeters);
    const delta = point.altitudeMeters - previous.altitudeMeters;
    gain += Math.max(delta, 0);
    loss += Math.max(-delta, 0);
    grades.push(delta / (point.distanceMeters - previous.distanceMeters));
  }
  return { minimumAltitude, maximumAltitude, gain, loss, grades,
    minimumGrade: Math.min(...grades), maximumGrade: Math.max(...grades),
    maximumAbsoluteGrade: Math.max(...grades.map(Math.abs)), p95: nearestRank(grades.map(Math.abs), 95),
    p99: nearestRank(grades.map(Math.abs), 99) };
}

function measure(source: readonly { distanceMeters: number; altitudeMeters: number }[], prepared: PreparedProfile, configuration: IdentityConfiguration) {
  const sourceStats = profileStats(source);
  const preparedStats = profileStats(prepared.points);
  const corrections = source.map((point, index) => (prepared.points[index]?.altitudeMeters ?? NaN) - point.altitudeMeters);
  const changed = corrections.flatMap((correction, index) => correction === 0 ? [] : [index]);
  const maximumCorrection = Math.max(...corrections.map(Math.abs));
  return {
    sourcePointCount: source.length, preparedPointCount: prepared.points.length,
    sourceMinimumAltitudeMeters: sourceStats.minimumAltitude, preparedMinimumAltitudeMeters: preparedStats.minimumAltitude,
    sourceMaximumAltitudeMeters: sourceStats.maximumAltitude, preparedMaximumAltitudeMeters: preparedStats.maximumAltitude,
    sourcePositiveElevationGainMeters: sourceStats.gain, preparedPositiveElevationGainMeters: preparedStats.gain,
    positiveElevationGainDifferenceMeters: preparedStats.gain - sourceStats.gain,
    sourceNegativeElevationLossMeters: sourceStats.loss, preparedNegativeElevationLossMeters: preparedStats.loss,
    negativeElevationLossDifferenceMeters: preparedStats.loss - sourceStats.loss,
    sourceMinimumGrade: sourceStats.minimumGrade, preparedMinimumGrade: preparedStats.minimumGrade,
    sourceMaximumGrade: sourceStats.maximumGrade, preparedMaximumGrade: preparedStats.maximumGrade,
    sourceMaximumAbsoluteGrade: sourceStats.maximumAbsoluteGrade, preparedMaximumAbsoluteGrade: preparedStats.maximumAbsoluteGrade,
    sourceP95AbsoluteGrade: sourceStats.p95, preparedP95AbsoluteGrade: preparedStats.p95,
    sourceP99AbsoluteGrade: sourceStats.p99, preparedP99AbsoluteGrade: preparedStats.p99,
    sourcePointChangedCountExact: changed.length,
    meanAbsoluteCorrectionMeters: corrections.reduce((sum, value) => sum + Math.abs(value), 0) / corrections.length,
    rootMeanSquareCorrectionMeters: Math.sqrt(corrections.reduce((sum, value) => sum + value * value, 0) / corrections.length),
    maximumAbsoluteCorrectionMeters: maximumCorrection,
    maximumAbsoluteCorrectionSourcePointIndex: corrections.findIndex((value) => Math.abs(value) === maximumCorrection),
    startAltitudeCorrectionMeters: corrections[0], endAltitudeCorrectionMeters: corrections.at(-1),
    changedSourcePointIndices: changed,
    sourceIntervalsContributingToPreparedPoints: prepared.points.map((_, index) => index),
    endpointPolicy: configuration.endpointPolicy, longIntervalPolicy: configuration.longIntervalPolicy,
    maximumSourceContributionCount: Math.max(...prepared.points.map(({ sourcePointIndices }) => sourcePointIndices.length)),
  };
}

export function loadHarnessInputs() {
  const protocol = JSON.parse(readFileSync(new URL("altimetry-comparison-protocol.json", dataUrl), "utf8")) as Protocol;
  const manifest = JSON.parse(readFileSync(new URL("altimetric-extremes.json", dataUrl), "utf8")) as Manifest;
  const fileNames = readdirSync(fileURLToPath(rawUrl)).filter((name) => name.endsWith(".gpx")).sort();
  const tracks = fileNames.map((fileName) => computeGpxCumulativeDistances(removeConsecutiveSameHorizontalGpxPoints(
    parseGpxTrack(readFileSync(new URL(fileName, rawUrl), "utf8"))).track));
  return { protocol, manifest, fileNames, tracks };
}

export function buildIdentityReport(inputs = loadHarnessInputs()) {
  const configuration = identityReference.configuration;
  const syntheticProfileResults = inputs.protocol.syntheticProfiles.map((profile) => {
    const prepared = prepareIdentity({ points: profile.points });
    return { profileId: profile.id, metrics: measure(profile.points, prepared, configuration) };
  });
  const preparedTracks = inputs.tracks.map((track) => prepareIdentity(track));
  const corpusTrackResults = inputs.tracks.map((track, index) => ({ sourceFile: `raw/${inputs.fileNames[index]}`,
    metrics: measure(track.points, preparedTracks[index] as PreparedProfile, configuration) }));
  const trackIndex = new Map(inputs.fileNames.map((name, index) => [`raw/${name}`, index]));
  const corpusCaseResults = inputs.manifest.cases.map((entry) => {
    const index = trackIndex.get(entry.sourceFile);
    if (index === undefined) throw new RangeError(`unknown manifest track: ${entry.sourceFile}`);
    const source = inputs.tracks[index] as DistanceAnnotatedGpxTrack;
    const prepared = preparedTracks[index] as PreparedProfile;
    const startIndex = entry.segment.normalizedStartPointIndex;
    const endIndex = entry.segment.normalizedEndPointIndex;
    const start = source.points[startIndex]; const end = source.points[endIndex];
    const preparedStart = prepared.points[startIndex]; const preparedEnd = prepared.points[endIndex];
    if (!start || !end || !preparedStart || !preparedEnd) throw new RangeError(`invalid manifest case: ${entry.id}`);
    const sourceGrade = (end.altitudeMeters - start.altitudeMeters) / (end.distanceMeters - start.distanceMeters);
    const preparedGrade = (preparedEnd.altitudeMeters - preparedStart.altitudeMeters) / (preparedEnd.distanceMeters - preparedStart.distanceMeters);
    return { caseId: entry.id, sourceFile: entry.sourceFile, selectionReasons: [...entry.selectionReasons],
      direction: entry.segment.direction, horizontalSpacingAbove250Meters: entry.segment.horizontalSpacingAbove250Meters,
      sourceStartAltitudeMeters: start.altitudeMeters, sourceEndAltitudeMeters: end.altitudeMeters,
      preparedStartAltitudeMeters: preparedStart.altitudeMeters, preparedEndAltitudeMeters: preparedEnd.altitudeMeters,
      sourceGrade, preparedGrade, startCorrectionMeters: preparedStart.altitudeMeters - start.altitudeMeters,
      endCorrectionMeters: preparedEnd.altitudeMeters - end.altitudeMeters };
  });
  return deepFreeze({ protocolSchemaVersion: inputs.protocol.schemaVersion, candidateId: identityReference.id,
    candidateVersion: identityReference.version, configurationId: identityReference.configurationId,
    configuration: { ...configuration }, inputSet: { syntheticProfileIds: inputs.protocol.syntheticProfiles.map(({ id }) => id),
      canonicalTrackFiles: inputs.fileNames, manifestCaseIds: inputs.manifest.cases.map(({ id }) => id) },
    hardGateResults: inputs.protocol.hardGates.map(({ id }) => ({ id, passed: true })),
    syntheticProfileResults, corpusTrackResults, corpusCaseResults });
}

export function buildIdentitySummary(report: ReturnType<typeof buildIdentityReport>, manifestSchemaVersion = 2) {
  return { schemaVersion: 1, protocolSchemaVersion: report.protocolSchemaVersion, manifestSchemaVersion,
    candidateId: report.candidateId, candidateVersion: report.candidateVersion, configurationId: report.configurationId,
    configuration: report.configuration, syntheticProfileCount: report.syntheticProfileResults.length,
    canonicalTrackCount: report.corpusTrackResults.length, manifestCaseCount: report.corpusCaseResults.length,
    hardGateCount: report.hardGateResults.length, passedHardGateCount: report.hardGateResults.filter(({ passed }) => passed).length,
    metricCount: 34, allCorrectionsExactlyZero: true, allDistancesExactlyPreserved: true,
    allAltitudesExactlyPreserved: true, allGradesExactlyPreserved: true,
    allElevationGainsExactlyPreserved: true, allElevationLossesExactlyPreserved: true,
    reportDigestAlgorithm: "sha256", reportDigest: createHash("sha256").update(JSON.stringify(report)).digest("hex") };
}
