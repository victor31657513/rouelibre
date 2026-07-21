import type { ParsedGpxTrack, RawGpxTrackPoint } from "./gpx.js";

export interface GpxExactDuplicateNormalizationReport {
  readonly sourcePointCount: number;
  readonly retainedPointCount: number;
  readonly removedPointCount: number;
  readonly removedSourcePointIndices: readonly number[];
}

export interface GpxExactDuplicateNormalizationResult {
  readonly track: ParsedGpxTrack;
  readonly report: GpxExactDuplicateNormalizationReport;
}

function assertPoint(point: unknown, index: number): asserts point is RawGpxTrackPoint {
  if (typeof point !== "object" || point === null) {
    throw new TypeError(`track.points[${index}] must be an object`);
  }
  const candidate = point as Partial<RawGpxTrackPoint>;
  if (!Number.isFinite(candidate.latitudeDegrees)
    || !Number.isFinite(candidate.longitudeDegrees)
    || !Number.isFinite(candidate.altitudeMeters)) {
    throw new TypeError(`track.points[${index}] coordinates and altitude must be finite numbers`);
  }
  if ((candidate.latitudeDegrees as number) < -90
    || (candidate.latitudeDegrees as number) > 90) {
    throw new RangeError(`track.points[${index}].latitudeDegrees must be between -90 and 90`);
  }
  if ((candidate.longitudeDegrees as number) < -180
    || (candidate.longitudeDegrees as number) > 180) {
    throw new RangeError(`track.points[${index}].longitudeDegrees must be between -180 and 180`);
  }
}

function copyPoint(point: RawGpxTrackPoint): Readonly<RawGpxTrackPoint> {
  return Object.freeze({
    latitudeDegrees: point.latitudeDegrees,
    longitudeDegrees: point.longitudeDegrees,
    altitudeMeters: point.altitudeMeters,
  });
}

/** Supprime uniquement les points consécutifs égaux sur leurs trois valeurs numériques. */
export function removeConsecutiveExactGpxDuplicates(
  track: ParsedGpxTrack,
): GpxExactDuplicateNormalizationResult {
  if (typeof track !== "object" || track === null) throw new TypeError("track must be an object");
  if (!Array.isArray(track.points)) throw new TypeError("track.points must be an array");
  if (track.points.length < 2) throw new RangeError("track.points must contain at least two points");
  for (let index = 0; index < track.points.length; index += 1) assertPoint(track.points[index], index);

  const first = track.points[0];
  if (first === undefined) throw new RangeError("track.points[0] is missing");
  const retainedPoints: Readonly<RawGpxTrackPoint>[] = [copyPoint(first)];
  const removedSourcePointIndices: number[] = [];
  let previousRetained = first;

  for (let index = 1; index < track.points.length; index += 1) {
    const current = track.points[index];
    if (current === undefined) throw new RangeError(`track.points[${index}] is missing`);
    if (previousRetained.latitudeDegrees === current.latitudeDegrees
      && previousRetained.longitudeDegrees === current.longitudeDegrees
      && previousRetained.altitudeMeters === current.altitudeMeters) {
      removedSourcePointIndices.push(index);
    } else {
      retainedPoints.push(copyPoint(current));
      previousRetained = current;
    }
  }

  if (retainedPoints.length < 2) {
    throw new RangeError("exact duplicate normalization must retain at least two points");
  }
  const frozenRemovedIndices = Object.freeze(removedSourcePointIndices);
  const normalizedTrack = Object.freeze({ points: Object.freeze(retainedPoints) });
  const report = Object.freeze({
    sourcePointCount: track.points.length,
    retainedPointCount: retainedPoints.length,
    removedPointCount: removedSourcePointIndices.length,
    removedSourcePointIndices: frozenRemovedIndices,
  });
  return Object.freeze({ track: normalizedTrack, report });
}
