import { describe, expect, it } from "vitest";

import {
  removeConsecutiveExactGpxDuplicates,
  type ParsedGpxTrack,
  type RawGpxTrackPoint,
} from "../src/index.js";

const point = (latitudeDegrees: number, longitudeDegrees: number, altitudeMeters = 0): RawGpxTrackPoint =>
  ({ latitudeDegrees, longitudeDegrees, altitudeMeters });
const track = (...points: RawGpxTrackPoint[]): ParsedGpxTrack => ({ points });
const A = point(1, 2, 3);
const B = point(4, 5, 6);
const C = point(7, 8, 9);

describe("removeConsecutiveExactGpxDuplicates", () => {
  it("copie défensivement une trace sans doublon", () => {
    const input = track(A, B);
    const result = removeConsecutiveExactGpxDuplicates(input);
    expect(result.track).toEqual(input);
    expect(result.track).not.toBe(input);
    expect(result.track.points).not.toBe(input.points);
    expect(result.track.points[0]).not.toBe(input.points[0]);
    expect(result.report).toEqual({ sourcePointCount: 2, retainedPointCount: 2, removedPointCount: 0, removedSourcePointIndices: [] });
  });

  it("supprime un doublon consécutif et conserve le premier", () => {
    const result = removeConsecutiveExactGpxDuplicates(track(A, A, B));
    expect(result.track.points).toEqual([A, B]);
    expect(result.report.removedSourcePointIndices).toEqual([1]);
  });

  it("réduit une série A, A, A, B à A, B", () => {
    const result = removeConsecutiveExactGpxDuplicates(track(A, A, A, B));
    expect(result.track.points).toEqual([A, B]);
    expect(result.report.removedSourcePointIndices).toEqual([1, 2]);
  });

  it("préserve l'ordre documentaire des indices de plusieurs séries", () => {
    const result = removeConsecutiveExactGpxDuplicates(track(A, A, B, B, B, C));
    expect(result.track.points).toEqual([A, B, C]);
    expect(result.report.removedSourcePointIndices).toEqual([1, 3, 4]);
    expect(result.report.sourcePointCount).toBe(result.report.retainedPointCount + result.report.removedPointCount);
    expect(result.report.removedPointCount).toBe(result.report.removedSourcePointIndices.length);
  });

  it("conserve un point identique non consécutif", () => {
    expect(removeConsecutiveExactGpxDuplicates(track(A, B, A)).track.points).toEqual([A, B, A]);
  });

  it("conserve une même position avec des altitudes différentes", () => {
    const input = track(point(1, 2, 3), point(1, 2, 4));
    expect(removeConsecutiveExactGpxDuplicates(input).track.points).toEqual(input.points);
  });

  it("emploie === et considère +0 et -0 comme égaux", () => {
    const result = removeConsecutiveExactGpxDuplicates(track(point(+0, -0, +0), point(-0, +0, -0), B));
    expect(result.report.removedSourcePointIndices).toEqual([1]);
  });

  it("rejette une trace réduite à un seul point distinct", () => {
    expect(() => removeConsecutiveExactGpxDuplicates(track(A, A, A))).toThrow(RangeError);
  });

  it.each([
    ["track absent", null, TypeError], ["points absent", {}, TypeError],
    ["points non tableau", { points: {} }, TypeError], ["moins de deux points", track(A), RangeError],
    ["point non objet", { points: [A, null] }, TypeError],
    ["NaN", track(A, point(Number.NaN, 0)), TypeError],
    ["Infinity", track(A, point(0, 0, Number.POSITIVE_INFINITY)), TypeError],
    ["latitude hors limites", track(A, point(91, 0)), RangeError],
    ["longitude hors limites", track(A, point(0, 181)), RangeError],
  ])("rejette une entrée invalide : %s", (_label, input, error) => {
    expect(() => removeConsecutiveExactGpxDuplicates(input as ParsedGpxTrack)).toThrow(error);
  });

  it("gèle profondément le résultat", () => {
    const result = removeConsecutiveExactGpxDuplicates(track(A, A, B));
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.track)).toBe(true);
    expect(Object.isFrozen(result.track.points)).toBe(true);
    expect(result.track.points.every(Object.isFrozen)).toBe(true);
    expect(Object.isFrozen(result.report)).toBe(true);
    expect(Object.isFrozen(result.report.removedSourcePointIndices)).toBe(true);
  });

  it("ne modifie pas l'entrée et reste déterministe", () => {
    const input = track(A, A, B);
    const snapshot = structuredClone(input);
    expect(removeConsecutiveExactGpxDuplicates(input)).toEqual(removeConsecutiveExactGpxDuplicates(input));
    expect(input).toEqual(snapshot);
  });
});
