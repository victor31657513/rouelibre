import { readFileSync, statSync } from "node:fs";

import { describe, expect, it, vi } from "vitest";

import {
  availableReferences,
  buildIdentityReport,
  buildIdentitySummary,
  identityReference,
  loadHarnessInputs,
  prepareIdentity,
} from "./support/altimetryComparisonHarness.js";

const summaryUrl = new URL("../../../data/courses/tour-de-france/2026/altimetry-identity-summary.json", import.meta.url);

function expectDeeplyFrozen(value: unknown): void {
  if (value === null || typeof value !== "object") return;
  expect(Object.isFrozen(value)).toBe(true);
  Object.values(value).forEach(expectDeeplyFrozen);
}

describe("banc de comparaison altimétrique identité", () => {
  it("applique le protocole complet, dans son ordre, sans modifier les données", () => {
    const inputs = loadHarnessInputs();
    expect(inputs.protocol.syntheticProfiles).toHaveLength(14);
    expect(inputs.fileNames).toHaveLength(21);
    expect(inputs.fileNames).toEqual([...inputs.fileNames].sort());
    expect(inputs.manifest.cases).toHaveLength(43);
    expect(availableReferences.map(({ id }) => id)).toEqual(["identity"]);

    const sample = inputs.tracks[0];
    expect(sample).toBeDefined();
    const prepared = prepareIdentity(sample!);
    expect(prepared).not.toBe(sample);
    expect(prepared.points).not.toBe(sample!.points);
    expect(prepared.points.map(({ sourcePointIndices, ...point }) => point)).toEqual(sample!.points);
    prepared.points.forEach((point, index) => expect(point.sourcePointIndices).toEqual([index]));
    expectDeeplyFrozen(prepared);
    expectDeeplyFrozen(identityReference.configuration);

    const first = buildIdentityReport(inputs);
    const second = buildIdentityReport(inputs);
    expect(first).toEqual(second);
    expectDeeplyFrozen(first);
    expect(first.hardGateResults).toHaveLength(20);
    expect(first.hardGateResults.map(({ id }) => id)).toEqual(inputs.protocol.hardGates.map(({ id }) => id));
    expect(first.hardGateResults.every(({ passed }) => passed)).toBe(true);
    const metricIds = inputs.protocol.metrics.map(({ id }) => id);
    expect(metricIds).toHaveLength(34);
    [...first.syntheticProfileResults, ...first.corpusTrackResults].forEach(({ metrics }) => {
      expect(Object.keys(metrics)).toEqual(metricIds);
      expect(metrics.preparedPointCount).toBe(metrics.sourcePointCount);
      expect(metrics.preparedMinimumAltitudeMeters).toBe(metrics.sourceMinimumAltitudeMeters);
      expect(metrics.preparedMaximumAltitudeMeters).toBe(metrics.sourceMaximumAltitudeMeters);
      expect(metrics.preparedPositiveElevationGainMeters).toBe(metrics.sourcePositiveElevationGainMeters);
      expect(metrics.preparedNegativeElevationLossMeters).toBe(metrics.sourceNegativeElevationLossMeters);
      expect(metrics.preparedMinimumGrade).toBe(metrics.sourceMinimumGrade);
      expect(metrics.preparedMaximumGrade).toBe(metrics.sourceMaximumGrade);
      expect(metrics.preparedMaximumAbsoluteGrade).toBe(metrics.sourceMaximumAbsoluteGrade);
      expect(metrics.preparedP95AbsoluteGrade).toBe(metrics.sourceP95AbsoluteGrade);
      expect(metrics.preparedP99AbsoluteGrade).toBe(metrics.sourceP99AbsoluteGrade);
      expect(metrics.sourcePointChangedCountExact).toBe(0);
      expect(metrics.meanAbsoluteCorrectionMeters).toBe(0);
      expect(metrics.rootMeanSquareCorrectionMeters).toBe(0);
      expect(metrics.maximumAbsoluteCorrectionMeters).toBe(0);
      expect(metrics.startAltitudeCorrectionMeters).toBe(0);
      expect(metrics.endAltitudeCorrectionMeters).toBe(0);
      expect(metrics.changedSourcePointIndices).toEqual([]);
      expect(metrics.sourceIntervalsContributingToPreparedPoints).toEqual(
        Array.from({ length: metrics.sourcePointCount }, (_, index) => index),
      );
      expect(Object.values(metrics).every((value) => typeof value !== "number" || Number.isFinite(value))).toBe(true);
    });
    expect(first.corpusCaseResults.map(({ caseId }) => caseId)).toEqual(inputs.manifest.cases.map(({ id }) => id));
    first.corpusCaseResults.forEach((result) => {
      expect(result.preparedStartAltitudeMeters).toBe(result.sourceStartAltitudeMeters);
      expect(result.preparedEndAltitudeMeters).toBe(result.sourceEndAltitudeMeters);
      expect(result.preparedGrade).toBe(result.sourceGrade);
      expect(result.startCorrectionMeters).toBe(0);
      expect(result.endCorrectionMeters).toBe(0);
    });
  }, 60_000);

  it("n'utilise ni aléatoire ni horloge dans le chemin fonctionnel", () => {
    const inputs = loadHarnessInputs();
    const random = vi.spyOn(Math, "random");
    const date = vi.spyOn(Date, "now");
    const performanceNow = vi.spyOn(performance, "now");
    buildIdentityReport(inputs);
    expect(random).not.toHaveBeenCalled();
    expect(date).not.toHaveBeenCalled();
    expect(performanceNow).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  }, 60_000);

  it("échoue atomiquement avant de publier une sortie partielle", () => {
    const invalid = { points: [{ distanceMeters: 0, altitudeMeters: 1 }, { distanceMeters: 0, altitudeMeters: 2 }] };
    expect(() => prepareIdentity(invalid)).toThrow("increase strictly");
    expect(invalid).toEqual({ points: [{ distanceMeters: 0, altitudeMeters: 1 }, { distanceMeters: 0, altitudeMeters: 2 }] });
  });

  it("reproduit textuellement le résumé compact et son empreinte SHA-256", () => {
    const inputs = loadHarnessInputs();
    const summary = buildIdentitySummary(buildIdentityReport(inputs), inputs.manifest.schemaVersion);
    const expectedText = `${JSON.stringify(summary, null, 2)}\n`;
    expect(readFileSync(summaryUrl, "utf8")).toBe(expectedText);
    expect(JSON.parse(expectedText)).toEqual(summary);
    expect(summary.reportDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(statSync(summaryUrl).size).toBeLessThan(100_000);
  }, 60_000);
});
