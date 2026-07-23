import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const dataDirectoryUrl = new URL("../../../data/courses/tour-de-france/2026/", import.meta.url);
const protocolUrl = new URL("altimetry-comparison-protocol.json", dataDirectoryUrl);
const rawDirectoryUrl = new URL("raw/", dataDirectoryUrl);

interface Protocol {
  schemaVersion: number;
  units: Record<string, string>;
  canonicalInputPipeline: string[];
  corpusSelection: Record<string, unknown>;
  syntheticProfiles: { id: string; tags: string[]; points: { distanceMeters: number; altitudeMeters: number }[] }[];
  hardGates: { id: string }[];
  metrics: { id: string }[];
  executionPolicy: Record<string, unknown>;
  reportContract: { fieldOrder: string[]; functionalAndPerformanceSeparated: boolean };
  neutralReference: { id: string; candidate: boolean; implementationRequiredInThisArtifact: boolean };
}

const profileIds = ["flat", "regular-ascent", "regular-descent", "summit", "valley", "isolated-peak",
  "isolated-trough", "irregular-spacing-constant-grade", "long-horizontal-interval", "negative-altitude",
  "tiny-spacing-spike", "start-outlier", "end-outlier", "mixed-density-summit"];
const profileTags = [
  ["flat", "ordinary", "preservation"], ["ascending", "ordinary", "monotonic", "preservation"],
  ["descending", "ordinary", "monotonic", "preservation"], ["summit", "ordinary", "shape"],
  ["valley", "ordinary", "shape"], ["isolated-peak", "extreme"], ["isolated-trough", "extreme"],
  ["irregular-spacing", "monotonic", "preservation"], ["long-interval", "monotonic", "policy-required"],
  ["negative-altitude", "monotonic", "numeric"], ["tiny-spacing", "isolated-peak", "extreme", "numeric"],
  ["start-endpoint", "isolated-peak", "policy-required"], ["end-endpoint", "isolated-peak", "policy-required"],
  ["irregular-spacing", "summit", "shape"],
];
const profileCoordinates = [
  [[0, 100], [100, 100], [200, 100], [300, 100], [400, 100]],
  [[0, 100], [100, 105], [200, 110], [300, 115], [400, 120]],
  [[0, 120], [100, 115], [200, 110], [300, 105], [400, 100]],
  [[0, 100], [100, 105], [200, 110], [300, 105], [400, 100]],
  [[0, 110], [100, 105], [200, 100], [300, 105], [400, 110]],
  [[0, 100], [100, 100], [200, 130], [300, 100], [400, 100]],
  [[0, 100], [100, 100], [200, 70], [300, 100], [400, 100]],
  [[0, 100], [5, 100.25], [20, 101], [80, 104], [200, 110], [500, 125]],
  [[0, 100], [20, 101], [40, 102], [540, 127], [560, 128]],
  [[0, -20], [100, -15], [200, -10], [300, -5]],
  [[0, 100], [0.5, 101], [1, 100], [100, 100]],
  [[0, 130], [100, 100], [200, 100], [300, 100]],
  [[0, 100], [100, 100], [200, 100], [300, 130]],
  [[0, 100], [10, 101], [50, 106], [150, 111], [400, 100]],
];
const hardGateIds = ["input-unchanged", "configuration-unchanged", "repeatable-result", "finite-output-values",
  "no-nan-or-infinity", "zero-first-distance", "strictly-increasing-distances", "exact-source-final-distance",
  "exact-horizontal-length-preservation", "source-coordinates-unchanged", "complete-output-traceability",
  "explicit-altitude-change-list", "declared-endpoint-policy", "declared-long-interval-policy",
  "complete-configuration-reported", "atomic-failure", "deeply-immutable-result-and-report",
  "no-random-clock-or-mutable-global-state", "no-file-or-case-specific-adaptation", "coherent-altitude-profile"];
const metricIds = ["sourcePointCount", "preparedPointCount", "sourceMinimumAltitudeMeters", "preparedMinimumAltitudeMeters",
  "sourceMaximumAltitudeMeters", "preparedMaximumAltitudeMeters", "sourcePositiveElevationGainMeters",
  "preparedPositiveElevationGainMeters", "positiveElevationGainDifferenceMeters", "sourceNegativeElevationLossMeters",
  "preparedNegativeElevationLossMeters", "negativeElevationLossDifferenceMeters", "sourceMinimumGrade", "preparedMinimumGrade",
  "sourceMaximumGrade", "preparedMaximumGrade", "sourceMaximumAbsoluteGrade", "preparedMaximumAbsoluteGrade",
  "sourceP95AbsoluteGrade", "preparedP95AbsoluteGrade", "sourceP99AbsoluteGrade", "preparedP99AbsoluteGrade",
  "sourcePointChangedCountExact", "meanAbsoluteCorrectionMeters", "rootMeanSquareCorrectionMeters",
  "maximumAbsoluteCorrectionMeters", "maximumAbsoluteCorrectionSourcePointIndex", "startAltitudeCorrectionMeters",
  "endAltitudeCorrectionMeters", "changedSourcePointIndices", "sourceIntervalsContributingToPreparedPoints", "endpointPolicy",
  "longIntervalPolicy", "maximumSourceContributionCount"];
const reportFields = ["protocolSchemaVersion", "candidateId", "candidateVersion", "configurationId", "configuration", "inputSet",
  "hardGateResults", "syntheticProfileResults", "corpusTrackResults", "corpusCaseResults", "performance", "environment"];

describe("protocole de comparaison des préparations altimétriques", () => {
  it("fige les entrées, contrôles, métriques et règles reproductibles sans candidat", () => {
    const rawFiles = readdirSync(fileURLToPath(rawDirectoryUrl)).filter((name) => name.endsWith(".gpx")).sort();
    const rawBefore = rawFiles.map((name) => readFileSync(new URL(name, rawDirectoryUrl), "utf8"));
    const protocolText = readFileSync(protocolUrl, "utf8");
    const protocol = JSON.parse(protocolText) as Protocol;
    const manifest = JSON.parse(readFileSync(new URL("altimetric-extremes.json", dataDirectoryUrl), "utf8")) as { schemaVersion: number; cases: unknown[] };

    expect(protocol.schemaVersion).toBe(1);
    expect(protocol.units).toEqual({ distance: "meters", altitude: "meters", altitudeCorrection: "meters",
      horizontalSpacing: "meters", grade: "unitless-ratio", counts: "unitless-integers" });
    expect(protocol.canonicalInputPipeline).toEqual(["parseGpxTrack", "removeConsecutiveSameHorizontalGpxPoints", "computeGpxCumulativeDistances"]);
    expect(protocol.corpusSelection).toMatchObject({ expectedTrackCount: 21, inputFileOrder: "lexicographic",
      manifestPath: "data/courses/tour-de-france/2026/altimetric-extremes.json", manifestSchemaVersion: 2,
      expectedCaseCount: 43, selectionMode: "all-cases" });
    expect(manifest.schemaVersion).toBe(2);
    expect(manifest.cases).toHaveLength(43);
    expect(rawFiles).toHaveLength(21);
    expect(rawFiles).toEqual([...rawFiles].sort());

    expect(protocol.syntheticProfiles).toHaveLength(14);
    expect(protocol.syntheticProfiles.map(({ id }) => id)).toEqual(profileIds);
    expect(new Set(profileIds).size).toBe(profileIds.length);
    expect(protocol.syntheticProfiles.map(({ tags }) => tags)).toEqual(profileTags);
    expect(protocol.syntheticProfiles.map(({ points }) => points.map(({ distanceMeters, altitudeMeters }) => [distanceMeters, altitudeMeters])))
      .toEqual(profileCoordinates);
    protocol.syntheticProfiles.forEach(({ tags, points }) => {
      expect(new Set(tags).size).toBe(tags.length);
      expect(points.length).toBeGreaterThanOrEqual(2);
      expect(points[0]?.distanceMeters).toBe(0);
      points.forEach(({ distanceMeters, altitudeMeters }, index) => {
        expect(Number.isFinite(distanceMeters) && Number.isFinite(altitudeMeters)).toBe(true);
        if (index > 0) expect(distanceMeters).toBeGreaterThan(points[index - 1]?.distanceMeters ?? Number.POSITIVE_INFINITY);
      });
    });

    expect(protocol.hardGates.map(({ id }) => id)).toEqual(hardGateIds);
    expect(new Set(hardGateIds).size).toBe(hardGateIds.length);
    expect(protocol.metrics.map(({ id }) => id)).toEqual(metricIds);
    expect(new Set(metricIds).size).toBe(metricIds.length);
    expect(protocol.executionPolicy).toEqual(expect.objectContaining({ nodeMajorVersion: 24, sortedInputFiles: true,
      repeatabilityRuns: 2, configurationFrozen: true, fullTracksBeforeCaseExtraction: true,
      randomnessAllowed: false, clockAllowedInFunctionalResults: false }));
    expect(protocol.reportContract.fieldOrder).toEqual(reportFields);
    expect(protocol.reportContract.functionalAndPerformanceSeparated).toBe(true);
    expect(protocol.neutralReference).toEqual(expect.objectContaining({ id: "identity", candidate: false,
      implementationRequiredInThisArtifact: false }));

    const forbiddenPreparationParameter = /"(?:window|windowMeters|resolution|resolutionMeters|correctionThreshold|maximumCorrectionMeters|maximumGrade)"\s*:/i;
    expect(protocolText).not.toMatch(forbiddenPreparationParameter);
    expect(protocolText).not.toMatch(/"candidateId"\s*:\s*"(?!identity)/);
    rawFiles.forEach((name, index) => expect(readFileSync(new URL(name, rawDirectoryUrl), "utf8")).toBe(rawBefore[index]));
  });
});
