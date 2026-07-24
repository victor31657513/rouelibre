import { readFileSync, statSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import {
  altitudeAtSourceDistance, availableReferences, buildIdentityReport, buildIdentitySummary, identityReference,
  loadHarnessInputs, measureProfile, nearestRank, prepareIdentity, validateHarnessInputs, validatePreparedProfile,
  type FunctionalAudit, type IdentityConfiguration, type PreparedProfile,
} from "./support/altimetryComparisonHarness.js";

const summaryUrl = new URL("../../../data/courses/tour-de-france/2026/altimetry-identity-summary.json", import.meta.url);
const configuration: IdentityConfiguration = Object.freeze({ endpointPolicy: "preserve", longIntervalPolicy: "preserve" });
const cleanAudit: FunctionalAudit = Object.freeze({ randomCallCount: 0, dateNowCallCount: 0, performanceNowCallCount: 0, mutableGlobalStateUsed: false });
function expectDeeplyFrozen(value: unknown): void { if (value === null || typeof value !== "object") return; expect(Object.isFrozen(value)).toBe(true); Object.values(value).forEach(expectDeeplyFrozen); }

describe("banc de comparaison altimétrique identité", () => {
  it("valide les entrées dans le chemin fonctionnel et expose seulement le contrat identité non candidat", () => {
    const inputs = loadHarnessInputs();
    expect(inputs.protocol.syntheticProfiles).toHaveLength(14); expect(inputs.fileNames).toHaveLength(21); expect(inputs.manifest.cases).toHaveLength(43);
    expect(inputs.protocol.hardGates).toHaveLength(20); expect(inputs.protocol.metrics).toHaveLength(34);
    expect(availableReferences.map(({ id }) => id)).toEqual(["identity"]); expect(identityReference.candidate).toBe(false); expect(identityReference.prepare).toBe(prepareIdentity);
    const bad = structuredClone(inputs); Object.assign(bad.protocol, { schemaVersion: 99 });
    expect(() => validateHarnessInputs(bad)).toThrow("cardinality or schema"); expect(() => buildIdentityReport(bad, cleanAudit)).toThrow("cardinality or schema");
    const duplicate = structuredClone(inputs); Object.assign(duplicate.manifest.cases[1]!, { id: duplicate.manifest.cases[0]!.id });
    expect(() => buildIdentityReport(duplicate, cleanAudit)).toThrow("unique");
  }, 60_000);

  it("interpole aux distances source et calcule indépendamment les métriques non nulles", () => {
    const source = [{ distanceMeters: 0, altitudeMeters: 100 }, { distanceMeters: 100, altitudeMeters: 110 }, { distanceMeters: 200, altitudeMeters: 100 }];
    const prepared: PreparedProfile = { points: [{ distanceMeters: 0, altitudeMeters: 100, sourcePointIndices: [0, 1] }, { distanceMeters: 200, altitudeMeters: 100, sourcePointIndices: [1, 2] }] };
    const metrics = measureProfile(source, prepared, configuration);
    expect(altitudeAtSourceDistance(prepared, 100)).toBe(100); expect(() => altitudeAtSourceDistance(prepared, -1)).toThrow("cannot extrapolate"); expect(() => altitudeAtSourceDistance(prepared, 201)).toThrow("cannot extrapolate");
    expect(metrics.sourcePointChangedCountExact).toBe(1); expect(metrics.meanAbsoluteCorrectionMeters).toBe(10 / 3); expect(metrics.rootMeanSquareCorrectionMeters).toBe(10 / Math.sqrt(3));
    expect(metrics.maximumAbsoluteCorrectionMeters).toBe(10); expect(metrics.maximumAbsoluteCorrectionSourcePointIndex).toBe(1); expect(metrics.startAltitudeCorrectionMeters).toBe(0); expect(metrics.endAltitudeCorrectionMeters).toBe(0);
    expect(metrics.sourceMinimumGrade).toBe(-0.1); expect(metrics.sourceMaximumGrade).toBe(0.1); expect(metrics.preparedMinimumGrade).toBe(0); expect(metrics.preparedMaximumGrade).toBe(0);
    expect(metrics.sourcePositiveElevationGainMeters).toBe(10); expect(metrics.sourceNegativeElevationLossMeters).toBe(10); expect(metrics.preparedPositiveElevationGainMeters).toBe(0); expect(metrics.preparedNegativeElevationLossMeters).toBe(0);
    expect(metrics.sourceIntervalsContributingToPreparedPoints).toEqual([{ preparedPointIndex: 0, sourcePointIndices: [0, 1] }, { preparedPointIndex: 1, sourcePointIndices: [1, 2] }]); expect(metrics.maximumSourceContributionCount).toBe(2);
    expect(availableReferences).not.toContain(prepared);
  });

  it("applique le rang supérieur et le premier indice documentaire en cas d'égalité", () => {
    expect(nearestRank([1, 2, 3, 4], 75)).toBe(3); expect(nearestRank([4, 1, 3, 2], 99)).toBe(4);
    const source = [{ distanceMeters: 0, altitudeMeters: 0 }, { distanceMeters: 1, altitudeMeters: 0 }, { distanceMeters: 2, altitudeMeters: 0 }];
    const prepared: PreparedProfile = { points: [{ distanceMeters: 0, altitudeMeters: 1, sourcePointIndices: [0] }, { distanceMeters: 1, altitudeMeters: 0, sourcePointIndices: [1] }, { distanceMeters: 2, altitudeMeters: 1, sourcePointIndices: [2] }] };
    const metrics = measureProfile(source, prepared, configuration); expect(metrics.maximumAbsoluteCorrectionMeters).toBe(1); expect(metrics.maximumAbsoluteCorrectionSourcePointIndex).toBe(0); expect(metrics.changedSourcePointIndices).toEqual([0, 2]);
  });

  it("rejette les profils préparés non cohérents et les traçabilités invalides", () => {
    const source = [{ distanceMeters: 0, altitudeMeters: 0 }, { distanceMeters: 2, altitudeMeters: 0 }];
    expect(() => validatePreparedProfile(source, { points: [{ distanceMeters: 0, altitudeMeters: 0, sourcePointIndices: [0] }, { distanceMeters: 0, altitudeMeters: 0, sourcePointIndices: [1] }] })).toThrow("increase strictly");
    expect(() => validatePreparedProfile(source, { points: [{ distanceMeters: 0, altitudeMeters: 0, sourcePointIndices: [0] }, { distanceMeters: 1, altitudeMeters: 0, sourcePointIndices: [1] }] })).toThrow("source length");
    expect(() => validatePreparedProfile(source, { points: [{ distanceMeters: 0, altitudeMeters: 0, sourcePointIndices: [] }, { distanceMeters: 2, altitudeMeters: 0, sourcePointIndices: [1] }] })).toThrow("traceability");
    expect(() => validatePreparedProfile(source, { points: [{ distanceMeters: 0, altitudeMeters: 0, sourcePointIndices: [2] }, { distanceMeters: 2, altitudeMeters: 0, sourcePointIndices: [1] }] })).toThrow("traceability");
  });

  it("calcule les vingt invariants, leurs preuves et détecte l'audit fonctionnel altéré", () => {
    const inputs = loadHarnessInputs(); const random = vi.spyOn(Math, "random"); const date = vi.spyOn(Date, "now"); const clock = vi.spyOn(performance, "now");
    const report = buildIdentityReport(inputs, cleanAudit); expect(random).not.toHaveBeenCalled(); expect(date).not.toHaveBeenCalled(); expect(clock).not.toHaveBeenCalled(); vi.restoreAllMocks();
    expect(report.hardGateResults.map(({ id }) => id)).toEqual(inputs.protocol.hardGates.map(({ id }) => id)); expect(report.hardGateResults).toHaveLength(20);
    report.hardGateResults.forEach((result) => { expect(result.passed).toBe(true); expect(result.evidence).toBeDefined(); }); expectDeeplyFrozen(report);
    const failed = buildIdentityReport(inputs, { ...cleanAudit, randomCallCount: 1 }); expect(failed.hardGateResults.find(({ id }) => id === "no-random-clock-or-mutable-global-state")?.passed).toBe(false);
    expect(failed.hardGateResults.find(({ id }) => id === "no-random-clock-or-mutable-global-state")?.evidence).toEqual({ ...cleanAudit, randomCallCount: 1 });
  }, 60_000);

  it("échoue atomiquement pour entrée, sortie et configuration invalides", () => {
    const invalid = { points: [{ distanceMeters: 0, altitudeMeters: 1 }, { distanceMeters: 0, altitudeMeters: 2 }] }; const snapshot = structuredClone(invalid);
    expect(() => prepareIdentity(invalid)).toThrow(); expect(invalid).toEqual(snapshot);
    expect(() => measureProfile([{ distanceMeters: 0, altitudeMeters: 0 }, { distanceMeters: 1, altitudeMeters: 0 }], { points: [{ distanceMeters: 0, altitudeMeters: 0, sourcePointIndices: [0] }, { distanceMeters: 2, altitudeMeters: 0, sourcePointIndices: [1] }] }, configuration)).toThrow();
    expect(() => measureProfile([{ distanceMeters: 0, altitudeMeters: 0 }, { distanceMeters: 1, altitudeMeters: 0 }], prepareIdentity({ points: [{ distanceMeters: 0, altitudeMeters: 0 }, { distanceMeters: 1, altitudeMeters: 0 }] }), { endpointPolicy: "bad", longIntervalPolicy: "preserve" } as unknown as IdentityConfiguration)).toThrow();
  });

  it("dérive chaque indicateur du rapport et reproduit le résumé compact", () => {
    const report = buildIdentityReport(loadHarnessInputs(), cleanAudit); const summary = buildIdentitySummary(report); const second = buildIdentityReport(loadHarnessInputs(), cleanAudit); expect(report).toEqual(second);
    expect(summary.hardGateCount).toBe(report.hardGateResults.length); expect(summary.passedHardGateCount).toBe(report.hardGateResults.filter(({ passed }) => passed).length); expect(summary.metricCount).toBe(report.metricOrder.length);
    expect(summary.syntheticProfileCount).toBe(14); expect(summary.canonicalTrackCount).toBe(21); expect(summary.manifestCaseCount).toBe(43); expect(summary.allCorrectionsExactlyZero).toBe(true);
    const altered = structuredClone(report); Object.assign(altered.syntheticProfileResults[0]!.metrics, { sourcePointChangedCountExact: 1, maximumAbsoluteCorrectionMeters: 1 });
    expect(buildIdentitySummary(altered).allCorrectionsExactlyZero).toBe(false);
    const gateAltered = structuredClone(report); Object.assign(gateAltered.hardGateResults[0]!, { passed: false }); expect(buildIdentitySummary(gateAltered).passedHardGateCount).toBe(19);
    const expectedText = `${JSON.stringify(summary, null, 2)}\n`; expect(readFileSync(summaryUrl, "utf8")).toBe(expectedText); expect(summary.reportDigest).toMatch(/^[a-f0-9]{64}$/); expect(statSync(summaryUrl).size).toBeLessThan(100_000);
  }, 60_000);
});
