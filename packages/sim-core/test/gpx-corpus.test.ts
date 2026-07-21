import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { parseGpxTrack } from "../src/index.js";

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
});
