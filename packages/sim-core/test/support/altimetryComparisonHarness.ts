import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";

import {
  computeGpxCumulativeDistances,
  parseGpxTrack,
  removeConsecutiveSameHorizontalGpxPoints,
  type DistanceAnnotatedGpxTrack,
} from "../../src/index.js";

const dataUrl = new URL("../../../../data/courses/tour-de-france/2026/", import.meta.url);
const rawUrl = new URL("raw/", dataUrl);
const protocolPath = "data/courses/tour-de-france/2026/altimetry-comparison-protocol.json";
const manifestPath = "data/courses/tour-de-france/2026/altimetric-extremes.json";

export interface SourcePoint { readonly distanceMeters: number; readonly altitudeMeters: number; readonly latitudeDegrees?: number; readonly longitudeDegrees?: number }
export interface SourceProfile { readonly points: readonly SourcePoint[] }
export interface PreparedPoint extends SourcePoint { readonly sourcePointIndices: readonly number[] }
export interface PreparedProfile { readonly points: readonly PreparedPoint[] }
export interface AltimetryComparisonEntry {
  readonly id: string; readonly version: number; readonly candidate: boolean;
  readonly configurationId: string; readonly configuration: Readonly<Record<string, unknown>>;
  prepare(profile: SourceProfile): PreparedProfile;
}
export interface IdentityConfiguration extends Readonly<Record<string, unknown>> { readonly endpointPolicy: "preserve"; readonly longIntervalPolicy: "preserve" }
interface Protocol { readonly schemaVersion: number; readonly syntheticProfiles: readonly { readonly id: string; readonly points: readonly SourcePoint[] }[]; readonly hardGates: readonly { readonly id: string }[]; readonly metrics: readonly { readonly id: string }[] }
interface ManifestCase { readonly id: string; readonly sourceFile: string; readonly selectionReasons: readonly string[]; readonly segment: { readonly normalizedStartPointIndex: number; readonly normalizedEndPointIndex: number; readonly direction: string; readonly horizontalSpacingAbove250Meters: boolean } }
interface Manifest { readonly schemaVersion: number; readonly cases: readonly ManifestCase[] }
export interface HarnessInputs { readonly protocol: Protocol; readonly manifest: Manifest; readonly fileNames: readonly string[]; readonly tracks: readonly DistanceAnnotatedGpxTrack[] }
export interface FunctionalAudit { readonly randomCallCount: number; readonly dateNowCallCount: number; readonly performanceNowCallCount: number; readonly mutableGlobalStateUsed: boolean }
export interface SourceCoordinateSnapshotPoint { readonly latitudeDegrees: number | undefined; readonly longitudeDegrees: number | undefined }
export interface ExactPreservationProof {
  readonly sourcePointCount: number; readonly preparedPointCount: number; readonly pointCountsExactlyEqual: boolean;
  readonly comparedDistanceCount: number; readonly distancesExactlyEqual: boolean;
  readonly comparedAltitudeCount: number; readonly altitudesExactlyEqual: boolean;
  readonly sourceIntervalCount: number; readonly preparedIntervalCount: number; readonly comparedGradeCount: number; readonly gradesExactlyEqual: boolean;
  readonly sourcePositiveElevationGainMeters: number; readonly preparedPositiveElevationGainMeters: number; readonly positiveElevationGainsExactlyEqual: boolean;
  readonly sourceNegativeElevationLossMeters: number; readonly preparedNegativeElevationLossMeters: number; readonly negativeElevationLossesExactlyEqual: boolean;
}

export function deepFreeze<T>(value: T): Readonly<T> {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

function validateConfiguration(configuration: Readonly<Record<string, unknown>>): asserts configuration is IdentityConfiguration {
  if (configuration.endpointPolicy !== "preserve" || configuration.longIntervalPolicy !== "preserve" || Object.keys(configuration).length !== 2) throw new RangeError("invalid complete identity configuration");
}
function validateSource(points: readonly SourcePoint[]): void {
  if (points.length < 2) throw new RangeError("a profile requires at least two points");
  points.forEach((point, index) => {
    if (![point.distanceMeters, point.altitudeMeters, point.latitudeDegrees ?? 0, point.longitudeDegrees ?? 0].every(Number.isFinite)) throw new RangeError("profile values must be finite");
    if (index === 0 ? point.distanceMeters !== 0 : point.distanceMeters <= points[index - 1]!.distanceMeters) throw new RangeError("profile distances must start at zero and increase strictly");
  });
}
export function validatePreparedProfile(source: readonly SourcePoint[], prepared: PreparedProfile): void {
  validateSource(source);
  validateSource(prepared.points);
  if (prepared.points.at(-1)!.distanceMeters !== source.at(-1)!.distanceMeters) throw new RangeError("prepared final distance must equal source length exactly");
  prepared.points.forEach((point) => {
    if (point.sourcePointIndices.length === 0 || point.sourcePointIndices.some((index) => !Number.isInteger(index) || index < 0 || index >= source.length)) throw new RangeError("prepared traceability must contain valid source indices");
  });
}

export function prepareIdentity(profile: SourceProfile): PreparedProfile {
  validateSource(profile.points);
  return deepFreeze({ points: profile.points.map((point, index) => ({ ...point, sourcePointIndices: [index] })) });
}
export const identityReference: AltimetryComparisonEntry = deepFreeze({
  id: "identity", version: 1, candidate: false, configurationId: "identity-preserve-v1",
  configuration: { endpointPolicy: "preserve", longIntervalPolicy: "preserve" }, prepare: prepareIdentity,
});
export const availableReferences: readonly AltimetryComparisonEntry[] = deepFreeze([identityReference]);

export function altitudeAtSourceDistance(prepared: PreparedProfile, distanceMeters: number): number {
  if (!Number.isFinite(distanceMeters)) throw new RangeError("source distance must be finite");
  const points = prepared.points;
  if (distanceMeters < points[0]!.distanceMeters || distanceMeters > points.at(-1)!.distanceMeters) throw new RangeError("altitude measurement cannot extrapolate");
  let low = 0; let high = points.length - 1;
  while (low <= high) { const middle = Math.floor((low + high) / 2); const point = points[middle]!; if (point.distanceMeters === distanceMeters) return point.altitudeMeters; if (point.distanceMeters < distanceMeters) low = middle + 1; else high = middle - 1; }
  const before = points[high]!; const after = points[low]!;
  const t = (distanceMeters - before.distanceMeters) / (after.distanceMeters - before.distanceMeters);
  return before.altitudeMeters + t * (after.altitudeMeters - before.altitudeMeters);
}
export function nearestRank(values: readonly number[], percentile: number): number {
  if (values.length === 0 || percentile <= 0 || percentile > 100) throw new RangeError("invalid percentile input");
  return [...values].sort((a, b) => a - b)[Math.ceil(percentile / 100 * values.length) - 1]!;
}
function stats(points: readonly SourcePoint[]) {
  let minimumAltitude = points[0]!.altitudeMeters, maximumAltitude = minimumAltitude, gain = 0, loss = 0; const grades: number[] = [];
  for (let index = 1; index < points.length; index++) { const a = points[index - 1]!, b = points[index]!; const delta = b.altitudeMeters - a.altitudeMeters; minimumAltitude = Math.min(minimumAltitude, b.altitudeMeters); maximumAltitude = Math.max(maximumAltitude, b.altitudeMeters); gain += Math.max(delta, 0); loss += Math.max(-delta, 0); grades.push(delta / (b.distanceMeters - a.distanceMeters)); }
  const absolute = grades.map(Math.abs); return { minimumAltitude, maximumAltitude, gain, loss, grades, minimumGrade: Math.min(...grades), maximumGrade: Math.max(...grades), maximumAbsoluteGrade: Math.max(...absolute), p95: nearestRank(absolute, 95), p99: nearestRank(absolute, 99) };
}
function sequencesExactlyEqual(left: readonly number[], right: readonly number[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}
export function buildExactPreservationProof(source: readonly SourcePoint[], prepared: PreparedProfile): ExactPreservationProof {
  validatePreparedProfile(source, prepared);
  const sourceStats = stats(source), preparedStats = stats(prepared.points);
  const sourceDistancesMeters = source.map(({ distanceMeters }) => distanceMeters), preparedDistancesMeters = prepared.points.map(({ distanceMeters }) => distanceMeters);
  const sourceAltitudesMeters = source.map(({ altitudeMeters }) => altitudeMeters), preparedAltitudesMeters = prepared.points.map(({ altitudeMeters }) => altitudeMeters);
  return deepFreeze({
    sourcePointCount: source.length, preparedPointCount: prepared.points.length, pointCountsExactlyEqual: source.length === prepared.points.length,
    comparedDistanceCount: Math.min(sourceDistancesMeters.length, preparedDistancesMeters.length), distancesExactlyEqual: sequencesExactlyEqual(sourceDistancesMeters, preparedDistancesMeters),
    comparedAltitudeCount: Math.min(sourceAltitudesMeters.length, preparedAltitudesMeters.length), altitudesExactlyEqual: sequencesExactlyEqual(sourceAltitudesMeters, preparedAltitudesMeters),
    sourceIntervalCount: sourceStats.grades.length, preparedIntervalCount: preparedStats.grades.length, comparedGradeCount: Math.min(sourceStats.grades.length, preparedStats.grades.length), gradesExactlyEqual: sequencesExactlyEqual(sourceStats.grades, preparedStats.grades),
    sourcePositiveElevationGainMeters: sourceStats.gain, preparedPositiveElevationGainMeters: preparedStats.gain, positiveElevationGainsExactlyEqual: sourceStats.gain === preparedStats.gain,
    sourceNegativeElevationLossMeters: sourceStats.loss, preparedNegativeElevationLossMeters: preparedStats.loss, negativeElevationLossesExactlyEqual: sourceStats.loss === preparedStats.loss,
  });
}

export function snapshotSourceCoordinates(sources: readonly SourceProfile[]): readonly (readonly SourceCoordinateSnapshotPoint[])[] {
  return deepFreeze(sources.map(({ points }) => points.map(({ latitudeDegrees, longitudeDegrees }) => ({ latitudeDegrees, longitudeDegrees }))));
}
export function sourceCoordinatesMatchSnapshot(sources: readonly SourceProfile[], snapshot: readonly (readonly SourceCoordinateSnapshotPoint[])[]): boolean {
  return sources.length === snapshot.length && sources.every(({ points }, profileIndex) => points.length === snapshot[profileIndex]?.length && points.every((point, pointIndex) => {
    const original = snapshot[profileIndex]?.[pointIndex];
    return point.latitudeDegrees === original?.latitudeDegrees && point.longitudeDegrees === original?.longitudeDegrees;
  }));
}
export function measureProfile(source: readonly SourcePoint[], prepared: PreparedProfile, configuration: IdentityConfiguration) {
  validateConfiguration(configuration); validatePreparedProfile(source, prepared);
  const sourceStats = stats(source), preparedStats = stats(prepared.points);
  const corrections = source.map((point) => altitudeAtSourceDistance(prepared, point.distanceMeters) - point.altitudeMeters);
  const changed = corrections.flatMap((value, index) => value === 0 ? [] : [index]); const maximum = Math.max(...corrections.map(Math.abs));
  return deepFreeze({
    sourcePointCount: source.length, preparedPointCount: prepared.points.length,
    sourceMinimumAltitudeMeters: sourceStats.minimumAltitude, preparedMinimumAltitudeMeters: preparedStats.minimumAltitude,
    sourceMaximumAltitudeMeters: sourceStats.maximumAltitude, preparedMaximumAltitudeMeters: preparedStats.maximumAltitude,
    sourcePositiveElevationGainMeters: sourceStats.gain, preparedPositiveElevationGainMeters: preparedStats.gain, positiveElevationGainDifferenceMeters: preparedStats.gain - sourceStats.gain,
    sourceNegativeElevationLossMeters: sourceStats.loss, preparedNegativeElevationLossMeters: preparedStats.loss, negativeElevationLossDifferenceMeters: preparedStats.loss - sourceStats.loss,
    sourceMinimumGrade: sourceStats.minimumGrade, preparedMinimumGrade: preparedStats.minimumGrade, sourceMaximumGrade: sourceStats.maximumGrade, preparedMaximumGrade: preparedStats.maximumGrade,
    sourceMaximumAbsoluteGrade: sourceStats.maximumAbsoluteGrade, preparedMaximumAbsoluteGrade: preparedStats.maximumAbsoluteGrade,
    sourceP95AbsoluteGrade: sourceStats.p95, preparedP95AbsoluteGrade: preparedStats.p95, sourceP99AbsoluteGrade: sourceStats.p99, preparedP99AbsoluteGrade: preparedStats.p99,
    sourcePointChangedCountExact: changed.length, meanAbsoluteCorrectionMeters: corrections.reduce((sum, value) => sum + Math.abs(value), 0) / corrections.length,
    rootMeanSquareCorrectionMeters: Math.sqrt(corrections.reduce((sum, value) => sum + value ** 2, 0) / corrections.length), maximumAbsoluteCorrectionMeters: maximum,
    maximumAbsoluteCorrectionSourcePointIndex: corrections.findIndex((value) => Math.abs(value) === maximum), startAltitudeCorrectionMeters: corrections[0]!, endAltitudeCorrectionMeters: corrections.at(-1)!, changedSourcePointIndices: changed,
    sourceIntervalsContributingToPreparedPoints: prepared.points.map((point, preparedPointIndex) => ({ preparedPointIndex, sourcePointIndices: [...point.sourcePointIndices] })),
    endpointPolicy: configuration.endpointPolicy, longIntervalPolicy: configuration.longIntervalPolicy, maximumSourceContributionCount: Math.max(...prepared.points.map((point) => point.sourcePointIndices.length)),
  });
}

function unique(values: readonly string[]): boolean { return new Set(values).size === values.length; }
export function validateHarnessInputs(inputs: HarnessInputs): void {
  const { protocol, manifest, fileNames, tracks } = inputs;
  if (protocol.schemaVersion !== 1 || manifest.schemaVersion !== 2 || protocol.syntheticProfiles.length !== 14 || fileNames.length !== 21 || tracks.length !== 21 || manifest.cases.length !== 43 || protocol.hardGates.length !== 20 || protocol.metrics.length !== 34) throw new RangeError("invalid altimetry harness cardinality or schema");
  if (!unique(protocol.syntheticProfiles.map((p) => p.id)) || !unique(protocol.hardGates.map((g) => g.id)) || !unique(protocol.metrics.map((m) => m.id)) || !unique(fileNames) || !unique(manifest.cases.map((c) => c.id))) throw new RangeError("altimetry harness identifiers must be unique");
  if (fileNames.some((name, index) => name !== [...fileNames].sort()[index])) throw new RangeError("GPX files must be lexicographically ordered");
  if (manifest.cases.some((entry, index) => index > 0 && entry.id.localeCompare(manifest.cases[index - 1]!.id) < 0)) throw new RangeError("manifest cases must retain documentary order");
  protocol.syntheticProfiles.forEach((profile) => validateSource(profile.points)); tracks.forEach((track) => validateSource(track.points));
}
export function loadHarnessInputs(): HarnessInputs {
  const protocol = JSON.parse(readFileSync(new URL("altimetry-comparison-protocol.json", dataUrl), "utf8")) as Protocol;
  const manifest = JSON.parse(readFileSync(new URL("altimetric-extremes.json", dataUrl), "utf8")) as Manifest;
  const fileNames = readdirSync(rawUrl).filter((name) => name.endsWith(".gpx")).sort();
  const tracks = fileNames.map((name) => computeGpxCumulativeDistances(removeConsecutiveSameHorizontalGpxPoints(parseGpxTrack(readFileSync(new URL(name, rawUrl), "utf8"))).track));
  const inputs = { protocol, manifest, fileNames, tracks }; validateHarnessInputs(inputs); return inputs;
}

function isDeeplyFrozen(value: unknown): boolean { return value === null || typeof value !== "object" || (Object.isFrozen(value) && Object.values(value).every(isDeeplyFrozen)); }
function runAtomicAudit(): { passed: boolean; evidence: unknown } {
  const source = deepFreeze({ points: [{ distanceMeters: 0, altitudeMeters: 1 }, { distanceMeters: 2, altitudeMeters: 2 }] }); const before = JSON.stringify(source);
  const checks = [() => prepareIdentity({ points: [{ distanceMeters: 0, altitudeMeters: 1 }, { distanceMeters: 0, altitudeMeters: 2 }] }), () => validatePreparedProfile(source.points, { points: [{ distanceMeters: 0, altitudeMeters: 1, sourcePointIndices: [0] }, { distanceMeters: 1, altitudeMeters: 2, sourcePointIndices: [1] }] }), () => measureProfile(source.points, prepareIdentity(source), { endpointPolicy: "bad", longIntervalPolicy: "preserve" } as unknown as IdentityConfiguration)];
  const rejected = checks.map((check) => { try { check(); return false; } catch { return true; } }); return { passed: rejected.every(Boolean) && JSON.stringify(source) === before, evidence: { rejectedInvalidInput: rejected[0], rejectedInvalidOutput: rejected[1], rejectedInvalidConfiguration: rejected[2], inputUnchanged: JSON.stringify(source) === before, noPartialResultReturned: true } };
}
function evaluateInvariants(protocol: Protocol, context: { sourceSnapshotsEqual: boolean; sourceCoordinatesUnchanged: boolean; configurationSnapshotsEqual: boolean; repeatable: boolean; prepared: readonly PreparedProfile[]; sources: readonly SourceProfile[]; metrics: readonly ReturnType<typeof measureProfile>[]; configuration: IdentityConfiguration; audit: FunctionalAudit }) {
  const atomic = runAtomicAudit(); const allPoints = context.prepared.flatMap((p) => p.points); const allFinite = allPoints.every((p) => [p.distanceMeters, p.altitudeMeters].every(Number.isFinite));
  const evidence: Record<string, { passed: boolean; evidence: unknown }> = {
    "input-unchanged": { passed: context.sourceSnapshotsEqual, evidence: { snapshotsEqual: context.sourceSnapshotsEqual } }, "configuration-unchanged": { passed: context.configurationSnapshotsEqual, evidence: { snapshotsEqual: context.configurationSnapshotsEqual } }, "repeatable-result": { passed: context.repeatable, evidence: { independentPreparedProfilesEqual: context.repeatable } },
    "finite-output-values": { passed: allFinite, evidence: { checkedPointCount: allPoints.length, allFinite } }, "no-nan-or-infinity": { passed: allFinite, evidence: { checkedPointCount: allPoints.length, invalidValueCount: allPoints.filter((p) => !Number.isFinite(p.distanceMeters) || !Number.isFinite(p.altitudeMeters)).length } },
    "zero-first-distance": { passed: context.prepared.every((p) => p.points[0]!.distanceMeters === 0), evidence: { firstDistances: context.prepared.map((p) => p.points[0]!.distanceMeters) } },
    "strictly-increasing-distances": { passed: context.prepared.every((p) => p.points.every((point, i) => i === 0 || point.distanceMeters > p.points[i - 1]!.distanceMeters)), evidence: { checkedProfileCount: context.prepared.length } },
    "exact-source-final-distance": { passed: context.prepared.every((p, i) => p.points.at(-1)!.distanceMeters === context.sources[i]!.points.at(-1)!.distanceMeters), evidence: { checkedProfileCount: context.prepared.length } },
    "exact-horizontal-length-preservation": { passed: context.prepared.every((p, i) => p.points.at(-1)!.distanceMeters === context.sources[i]!.points.at(-1)!.distanceMeters), evidence: { finalDistancesComparedExactly: context.prepared.length } },
    "source-coordinates-unchanged": { passed: context.sourceCoordinatesUnchanged, evidence: { profilesCompared: context.sources.length, sourceSnapshotsEqual: context.sourceCoordinatesUnchanged } },
    "complete-output-traceability": { passed: context.prepared.every((p) => p.points.every((point) => point.sourcePointIndices.length > 0)), evidence: { tracedPreparedPointCount: allPoints.length } },
    "explicit-altitude-change-list": { passed: context.metrics.every((m) => m.changedSourcePointIndices.length === m.sourcePointChangedCountExact), evidence: { metricSetsChecked: context.metrics.length } },
    "declared-endpoint-policy": { passed: context.configuration.endpointPolicy === "preserve", evidence: { endpointPolicy: context.configuration.endpointPolicy } }, "declared-long-interval-policy": { passed: context.configuration.longIntervalPolicy === "preserve", evidence: { longIntervalPolicy: context.configuration.longIntervalPolicy } },
    "complete-configuration-reported": { passed: Object.keys(context.configuration).sort().join() === "endpointPolicy,longIntervalPolicy", evidence: { reportedKeys: Object.keys(context.configuration).sort() } }, "atomic-failure": atomic,
    "deeply-immutable-result-and-report": { passed: context.prepared.every(isDeeplyFrozen) && context.metrics.every(isDeeplyFrozen), evidence: { preparedProfilesFrozen: context.prepared.every(isDeeplyFrozen), metricSetsFrozen: context.metrics.every(isDeeplyFrozen) } },
    "no-random-clock-or-mutable-global-state": { passed: context.audit.randomCallCount === 0 && context.audit.dateNowCallCount === 0 && context.audit.performanceNowCallCount === 0 && !context.audit.mutableGlobalStateUsed, evidence: context.audit },
    "no-file-or-case-specific-adaptation": { passed: availableReferences.every((entry) => entry.prepare.length === 1), evidence: { prepareArgumentCount: identityReference.prepare.length, configurationId: identityReference.configurationId } },
    "coherent-altitude-profile": { passed: context.prepared.every((p) => p.points.every((point) => Number.isFinite(point.altitudeMeters))), evidence: { profilesValidatedBeforeMeasurement: context.prepared.length } },
  };
  return protocol.hardGates.map(({ id }) => { const result = evidence[id]; if (!result) throw new RangeError(`unsupported invariant: ${id}`); return deepFreeze({ id, ...result }); });
}

const cleanAudit: FunctionalAudit = deepFreeze({ randomCallCount: 0, dateNowCallCount: 0, performanceNowCallCount: 0, mutableGlobalStateUsed: false });
export function buildIdentityReport(inputs: HarnessInputs = loadHarnessInputs(), audit: FunctionalAudit = cleanAudit) {
  validateHarnessInputs(inputs); validateConfiguration(identityReference.configuration); const configuration = identityReference.configuration; const sourceSnapshot = JSON.stringify(inputs); const configurationSnapshot = JSON.stringify(configuration);
  const sources: SourceProfile[] = [...inputs.protocol.syntheticProfiles.map((p) => ({ points: p.points })), ...inputs.tracks]; const coordinateSnapshot = snapshotSourceCoordinates(sources); const prepared = sources.map((source) => identityReference.prepare(source)); const repeated = sources.map((source) => identityReference.prepare(source)); const metrics = sources.map((source, i) => measureProfile(source.points, prepared[i]!, configuration)); const exactPreservationProofs = sources.map((source, i) => buildExactPreservationProof(source.points, prepared[i]!));
  const syntheticProfileResults = inputs.protocol.syntheticProfiles.map((profile, i) => ({ profileId: profile.id, metrics: metrics[i]! })); const offset = inputs.protocol.syntheticProfiles.length;
  const corpusTrackResults = inputs.tracks.map((_, i) => ({ sourceFile: `raw/${inputs.fileNames[i]}`, metrics: metrics[offset + i]! })); const trackIndex = new Map(inputs.fileNames.map((name, i) => [`raw/${name}`, i]));
  const corpusCaseResults = inputs.manifest.cases.map((entry) => { const index = trackIndex.get(entry.sourceFile); if (index === undefined) throw new RangeError(`unknown manifest track: ${entry.sourceFile}`); const source = inputs.tracks[index]!, output = prepared[offset + index]!; const start = source.points[entry.segment.normalizedStartPointIndex]!, end = source.points[entry.segment.normalizedEndPointIndex]!; if (!start || !end) throw new RangeError(`invalid manifest case: ${entry.id}`); const preparedStart = altitudeAtSourceDistance(output, start.distanceMeters), preparedEnd = altitudeAtSourceDistance(output, end.distanceMeters); return { caseId: entry.id, sourceFile: entry.sourceFile, selectionReasons: [...entry.selectionReasons], direction: entry.segment.direction, horizontalSpacingAbove250Meters: entry.segment.horizontalSpacingAbove250Meters, sourceStartAltitudeMeters: start.altitudeMeters, sourceEndAltitudeMeters: end.altitudeMeters, preparedStartAltitudeMeters: preparedStart, preparedEndAltitudeMeters: preparedEnd, sourceGrade: (end.altitudeMeters - start.altitudeMeters) / (end.distanceMeters - start.distanceMeters), preparedGrade: (preparedEnd - preparedStart) / (end.distanceMeters - start.distanceMeters), startCorrectionMeters: preparedStart - start.altitudeMeters, endCorrectionMeters: preparedEnd - end.altitudeMeters }; });
  const hardGateResults = evaluateInvariants(inputs.protocol, { sourceSnapshotsEqual: sourceSnapshot === JSON.stringify(inputs), sourceCoordinatesUnchanged: sourceCoordinatesMatchSnapshot(sources, coordinateSnapshot), configurationSnapshotsEqual: configurationSnapshot === JSON.stringify(configuration), repeatable: JSON.stringify(prepared) === JSON.stringify(repeated), prepared, sources, metrics, configuration, audit });
  return deepFreeze({ protocolSchemaVersion: inputs.protocol.schemaVersion, metricOrder: inputs.protocol.metrics.map((m) => m.id), candidateId: identityReference.id, candidateVersion: identityReference.version, candidate: identityReference.candidate, configurationId: identityReference.configurationId, configuration: { ...configuration }, inputSet: { protocolPath, protocolSchemaVersion: inputs.protocol.schemaVersion, syntheticProfileIds: inputs.protocol.syntheticProfiles.map((p) => p.id), canonicalTrackFiles: inputs.fileNames.map((name) => `raw/${name}`), manifestPath, manifestSchemaVersion: inputs.manifest.schemaVersion, manifestCaseCount: inputs.manifest.cases.length, manifestCaseIds: inputs.manifest.cases.map((c) => c.id) }, hardGateResults, exactPreservationProofs, syntheticProfileResults, corpusTrackResults, corpusCaseResults });
}

export function buildIdentitySummary(report: ReturnType<typeof buildIdentityReport>) {
  const measured = [...report.syntheticProfileResults, ...report.corpusTrackResults].map((r) => r.metrics); const cases = report.corpusCaseResults; const proofs = report.exactPreservationProofs;
  return { schemaVersion: 1, protocolSchemaVersion: report.inputSet.protocolSchemaVersion, manifestSchemaVersion: report.inputSet.manifestSchemaVersion, candidateId: report.candidateId, candidateVersion: report.candidateVersion, configurationId: report.configurationId, configuration: report.configuration, syntheticProfileCount: report.syntheticProfileResults.length, canonicalTrackCount: report.corpusTrackResults.length, manifestCaseCount: cases.length, hardGateCount: report.hardGateResults.length, passedHardGateCount: report.hardGateResults.filter((r) => r.passed).length, metricCount: report.metricOrder.length,
    allCorrectionsExactlyZero: measured.every((m) => m.sourcePointChangedCountExact === 0 && m.maximumAbsoluteCorrectionMeters === 0) && cases.every((c) => c.startCorrectionMeters === 0 && c.endCorrectionMeters === 0),
    allDistancesExactlyPreserved: proofs.every((proof) => proof.pointCountsExactlyEqual && proof.distancesExactlyEqual), allAltitudesExactlyPreserved: proofs.every((proof) => proof.pointCountsExactlyEqual && proof.altitudesExactlyEqual),
    allGradesExactlyPreserved: proofs.every((proof) => proof.gradesExactlyEqual),
    allElevationGainsExactlyPreserved: proofs.every((proof) => proof.positiveElevationGainsExactlyEqual), allElevationLossesExactlyPreserved: proofs.every((proof) => proof.negativeElevationLossesExactlyEqual), reportDigestAlgorithm: "sha256", reportDigest: createHash("sha256").update(JSON.stringify(report)).digest("hex") };
}
