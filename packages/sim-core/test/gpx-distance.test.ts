import { describe, expect, it } from "vitest";

import {
  computeGpxCumulativeDistances,
  EARTH_MEAN_RADIUS_METERS,
  type ParsedGpxTrack,
  type RawGpxTrackPoint,
} from "../src/index.js";

const ONE_DEGREE_METERS = EARTH_MEAN_RADIUS_METERS * Math.PI / 180;
const NUMERIC_TOLERANCE_METERS = 1e-8;

function point(latitudeDegrees: number, longitudeDegrees: number, altitudeMeters = 0): RawGpxTrackPoint {
  return { latitudeDegrees, longitudeDegrees, altitudeMeters };
}

function track(...points: RawGpxTrackPoint[]): ParsedGpxTrack {
  return { points };
}

describe("computeGpxCumulativeDistances", () => {
  it("place l'origine exactement à zéro et dérive la longueur du dernier point", () => {
    const result = computeGpxCumulativeDistances(track(point(0, 0), point(1, 0)));
    expect(result.points[0]?.distanceMeters).toBe(0);
    expect(result.totalLengthMeters).toBe(result.points.at(-1)?.distanceMeters);
  });

  it.each([
    ["un degré de latitude", point(0, 0), point(1, 0)],
    ["un degré de longitude à l'équateur", point(0, 0), point(0, 1)],
  ])("calcule %s selon le rayon terrestre moyen", (_label, start, end) => {
    const result = computeGpxCumulativeDistances(track(start, end));
    expect(Math.abs(result.totalLengthMeters - ONE_DEGREE_METERS))
      .toBeLessThanOrEqual(NUMERIC_TOLERANCE_METERS);
  });

  it("ignore l'altitude et conserve les points de coordonnées identiques", () => {
    const result = computeGpxCumulativeDistances(track(
      point(48, 2, -500), point(48, 2, 8_000), point(48, 2, 8_000),
    ));
    expect(result.points).toHaveLength(3);
    expect(result.points.map(({ distanceMeters }) => distanceMeters)).toEqual([0, 0, 0]);
    expect(result.points.map(({ altitudeMeters }) => altitudeMeters)).toEqual([-500, 8_000, 8_000]);
  });

  it("additionne plusieurs segments dans l'ordre documentaire", () => {
    const result = computeGpxCumulativeDistances(track(
      point(0, 0), point(1, 0), point(1, 1),
    ));
    const secondSegment = EARTH_MEAN_RADIUS_METERS * 2 * Math.asin(
      Math.cos(Math.PI / 180) * Math.sin(Math.PI / 360),
    );
    expect(result.points[1]?.distanceMeters).toBeCloseTo(ONE_DEGREE_METERS, 9);
    expect(Math.abs((result.points[2]?.distanceMeters ?? 0)
      - (ONE_DEGREE_METERS + secondSegment))).toBeLessThanOrEqual(NUMERIC_TOLERANCE_METERS);
  });

  it("utilise la traversée courte de l'antiméridien", () => {
    const result = computeGpxCumulativeDistances(track(point(0, 179.9), point(0, -179.9)));
    expect(result.totalLengthMeters).toBeCloseTo(ONE_DEGREE_METERS * 0.2, 8);
    expect(result.totalLengthMeters).toBeLessThan(25_000);
  });

  it("accepte les coordonnées limites et reste fini près des pôles", () => {
    const limits = computeGpxCumulativeDistances(track(
      point(-90, -180), point(90, 180),
    ));
    const nearPole = computeGpxCumulativeDistances(track(
      point(89.999, -180), point(89.999, 180),
    ));
    expect(limits.totalLengthMeters).toBeCloseTo(Math.PI * EARTH_MEAN_RADIUS_METERS, 8);
    expect(Number.isFinite(nearPole.totalLengthMeters)).toBe(true);
    expect(nearPole.totalLengthMeters).toBe(0);
  });

  it.each([
    ["track absent", null],
    ["points absent", {}],
    ["points non tableau", { points: {} }],
    ["point non objet", { points: [point(0, 0), null] }],
    ["NaN", track(point(0, 0), point(Number.NaN, 0))],
    ["Infinity", track(point(0, 0), point(0, 0, Number.POSITIVE_INFINITY))],
  ])("rejette une structure ou valeur non finie : %s", (_label, input) => {
    expect(() => computeGpxCumulativeDistances(input as ParsedGpxTrack)).toThrow(TypeError);
  });

  it("rejette une trace contenant moins de deux points", () => {
    expect(() => computeGpxCumulativeDistances(track(point(0, 0)))).toThrow(RangeError);
  });

  it.each([
    ["latitude basse", point(-90.1, 0)],
    ["latitude haute", point(90.1, 0)],
    ["longitude basse", point(0, -180.1)],
    ["longitude haute", point(0, 180.1)],
  ])("rejette une coordonnée finie hors limites : %s", (_label, invalidPoint) => {
    expect(() => computeGpxCumulativeDistances(track(point(0, 0), invalidPoint)))
      .toThrow(RangeError);
  });

  it("copie, gèle profondément, ne modifie pas l'entrée et reste déterministe", () => {
    const input = track(point(0, 0, 10), point(0, 1, 20));
    const snapshot = structuredClone(input);
    const first = computeGpxCumulativeDistances(input);
    const second = computeGpxCumulativeDistances(input);
    expect(input).toEqual(snapshot);
    expect(first).toEqual(second);
    expect(first.points[0]).not.toBe(input.points[0]);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.points)).toBe(true);
    expect(first.points.every(Object.isFrozen)).toBe(true);
  });
});
