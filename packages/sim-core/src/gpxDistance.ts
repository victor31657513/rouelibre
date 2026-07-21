import type { ParsedGpxTrack, RawGpxTrackPoint } from "./gpx.js";

/** Rayon terrestre moyen du modèle sphérique simplifié, en mètres. */
export const EARTH_MEAN_RADIUS_METERS = 6_371_008.8;

/** Point GPX brut annoté avec sa distance horizontale cumulée, en mètres. */
export interface DistanceAnnotatedGpxPoint extends RawGpxTrackPoint {
  readonly distanceMeters: number;
}

/** Trace GPX annotée, profondément immuable, sans transformation géométrique. */
export interface DistanceAnnotatedGpxTrack {
  readonly points: readonly Readonly<DistanceAnnotatedGpxPoint>[];
  readonly totalLengthMeters: number;
}

const MINIMUM_POINT_COUNT = 2;
const DEGREES_TO_RADIANS = Math.PI / 180;
const TWO_PI = 2 * Math.PI;

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

function horizontalSegmentDistanceMeters(
  start: RawGpxTrackPoint,
  end: RawGpxTrackPoint,
): number {
  const latitudeStart = start.latitudeDegrees * DEGREES_TO_RADIANS;
  const latitudeEnd = end.latitudeDegrees * DEGREES_TO_RADIANS;
  const deltaLatitude = latitudeEnd - latitudeStart;
  const rawDeltaLongitude = (end.longitudeDegrees - start.longitudeDegrees)
    * DEGREES_TO_RADIANS;
  const deltaLongitude = ((rawDeltaLongitude + Math.PI) % TWO_PI + TWO_PI) % TWO_PI
    - Math.PI;
  const sinHalfLatitude = Math.sin(deltaLatitude / 2);
  const sinHalfLongitude = Math.sin(deltaLongitude / 2);
  const rawHaversine = sinHalfLatitude * sinHalfLatitude
    + Math.cos(latitudeStart) * Math.cos(latitudeEnd)
      * sinHalfLongitude * sinHalfLongitude;
  const haversine = Math.min(1, Math.max(0, rawHaversine));
  const centralAngle = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  return EARTH_MEAN_RADIUS_METERS * centralAngle;
}

/**
 * Annote une trace GPX avec les distances horizontales cumulées de Haversine.
 * L'altitude est copiée sans participer au calcul et aucun point n'est modifié.
 */
export function computeGpxCumulativeDistances(
  track: ParsedGpxTrack,
): DistanceAnnotatedGpxTrack {
  if (typeof track !== "object" || track === null) {
    throw new TypeError("track must be an object");
  }
  if (!Array.isArray(track.points)) {
    throw new TypeError("track.points must be an array");
  }
  if (track.points.length < MINIMUM_POINT_COUNT) {
    throw new RangeError("track.points must contain at least two points");
  }
  for (let index = 0; index < track.points.length; index += 1) {
    assertPoint(track.points[index], index);
  }

  const first = track.points[0];
  if (first === undefined) throw new RangeError("track.points[0] is missing");
  const annotatedPoints: DistanceAnnotatedGpxPoint[] = [Object.freeze({
    latitudeDegrees: first.latitudeDegrees,
    longitudeDegrees: first.longitudeDegrees,
    altitudeMeters: first.altitudeMeters,
    distanceMeters: 0,
  })];
  let totalLengthMeters = 0;

  for (let index = 1; index < track.points.length; index += 1) {
    const previous = track.points[index - 1];
    const point = track.points[index];
    if (previous === undefined || point === undefined) {
      throw new RangeError(`track.points[${index}] is missing`);
    }
    const segmentDistanceMeters = horizontalSegmentDistanceMeters(previous, point);
    totalLengthMeters += segmentDistanceMeters;
    if (!Number.isFinite(segmentDistanceMeters) || segmentDistanceMeters < 0
      || !Number.isFinite(totalLengthMeters) || totalLengthMeters < 0) {
      throw new RangeError(`distance calculation failed at track.points[${index}]`);
    }
    annotatedPoints.push(Object.freeze({
      latitudeDegrees: point.latitudeDegrees,
      longitudeDegrees: point.longitudeDegrees,
      altitudeMeters: point.altitudeMeters,
      distanceMeters: totalLengthMeters,
    }));
  }

  return Object.freeze({
    points: Object.freeze(annotatedPoints),
    totalLengthMeters,
  });
}
