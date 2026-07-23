import type {
  DistanceAnnotatedGpxPoint,
  DistanceAnnotatedGpxTrack,
} from "./gpxDistance.js";

/** Observation traçable d'un intervalle GPX normalisé. */
export interface GpxRawSegmentObservation {
  readonly startPointIndex: number;
  readonly endPointIndex: number;
  readonly horizontalSpacingMeters: number;
  readonly altitudeDeltaMeters: number;
  readonly rawGrade: number;
}

/** Statistiques brutes d'espacement et d'altimétrie d'une trace normalisée. */
export interface GpxRawProfileReport {
  readonly pointCount: number;
  readonly segmentCount: number;
  readonly totalHorizontalLengthMeters: number;
  readonly minimumHorizontalSpacing: Readonly<GpxRawSegmentObservation>;
  readonly maximumHorizontalSpacing: Readonly<GpxRawSegmentObservation>;
  readonly averageHorizontalSpacingMeters: number;
  readonly minimumRawGrade: Readonly<GpxRawSegmentObservation>;
  readonly maximumRawGrade: Readonly<GpxRawSegmentObservation>;
  readonly ascendingSegmentCount: number;
  readonly descendingSegmentCount: number;
  readonly constantAltitudeSegmentCount: number;
}

function assertFiniteNumber(value: unknown, path: string): asserts value is number {
  if (!Number.isFinite(value)) throw new TypeError(`${path} must be a finite number`);
}

function assertPoint(value: unknown, index: number): asserts value is DistanceAnnotatedGpxPoint {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new TypeError(`track.points[${index}] must be an object`);
  }
  const point = value as Partial<DistanceAnnotatedGpxPoint>;
  assertFiniteNumber(point.latitudeDegrees, `track.points[${index}].latitudeDegrees`);
  assertFiniteNumber(point.longitudeDegrees, `track.points[${index}].longitudeDegrees`);
  assertFiniteNumber(point.altitudeMeters, `track.points[${index}].altitudeMeters`);
  assertFiniteNumber(point.distanceMeters, `track.points[${index}].distanceMeters`);
  if (point.latitudeDegrees < -90 || point.latitudeDegrees > 90) {
    throw new RangeError(`track.points[${index}].latitudeDegrees must be between -90 and 90`);
  }
  if (point.longitudeDegrees < -180 || point.longitudeDegrees > 180) {
    throw new RangeError(`track.points[${index}].longitudeDegrees must be between -180 and 180`);
  }
}

function observe(
  startPointIndex: number,
  horizontalSpacingMeters: number,
  altitudeDeltaMeters: number,
): Readonly<GpxRawSegmentObservation> {
  return Object.freeze({
    startPointIndex,
    endPointIndex: startPointIndex + 1,
    horizontalSpacingMeters,
    altitudeDeltaMeters,
    rawGrade: altitudeDeltaMeters / horizontalSpacingMeters,
  });
}

/**
 * Observe les espacements et pentes point à point sans transformer la trace.
 * Les distances doivent provenir d'une trace normalisée et être strictement croissantes.
 */
export function analyzeGpxRawProfile(track: DistanceAnnotatedGpxTrack): GpxRawProfileReport {
  if (typeof track !== "object" || track === null || Array.isArray(track)) {
    throw new TypeError("track must be an object");
  }
  if (!Array.isArray(track.points)) throw new TypeError("track.points must be an array");
  if (track.points.length < 2) throw new RangeError("track.points must contain at least two points");
  assertFiniteNumber(track.totalLengthMeters, "track.totalLengthMeters");

  const first = track.points[0];
  assertPoint(first, 0);
  if (first.distanceMeters !== 0) throw new RangeError("track.points[0].distanceMeters must equal zero");

  let minimumHorizontalSpacing: Readonly<GpxRawSegmentObservation> | undefined;
  let maximumHorizontalSpacing: Readonly<GpxRawSegmentObservation> | undefined;
  let minimumRawGrade: Readonly<GpxRawSegmentObservation> | undefined;
  let maximumRawGrade: Readonly<GpxRawSegmentObservation> | undefined;
  let ascendingSegmentCount = 0;
  let descendingSegmentCount = 0;
  let constantAltitudeSegmentCount = 0;

  for (let endPointIndex = 1; endPointIndex < track.points.length; endPointIndex += 1) {
    const start = track.points[endPointIndex - 1];
    const end = track.points[endPointIndex];
    if (start === undefined) throw new RangeError(`track.points[${endPointIndex - 1}] is missing`);
    assertPoint(end, endPointIndex);
    const horizontalSpacingMeters = end.distanceMeters - start.distanceMeters;
    if (!Number.isFinite(horizontalSpacingMeters)) {
      throw new RangeError(`horizontal spacing for segment ${endPointIndex - 1}-${endPointIndex} must be finite`);
    }
    if (horizontalSpacingMeters <= 0) {
      throw new RangeError(`track.points[${endPointIndex}].distanceMeters must be strictly increasing`);
    }
    const altitudeDeltaMeters = end.altitudeMeters - start.altitudeMeters;
    if (!Number.isFinite(altitudeDeltaMeters)) {
      throw new RangeError(`altitude delta for segment ${endPointIndex - 1}-${endPointIndex} must be finite`);
    }
    const segment = observe(endPointIndex - 1, horizontalSpacingMeters, altitudeDeltaMeters);
    if (!Number.isFinite(segment.rawGrade)) {
      throw new RangeError(`raw grade for segment ${endPointIndex - 1}-${endPointIndex} must be finite`);
    }

    if (minimumHorizontalSpacing === undefined
      || horizontalSpacingMeters < minimumHorizontalSpacing.horizontalSpacingMeters) {
      minimumHorizontalSpacing = segment;
    }
    if (maximumHorizontalSpacing === undefined
      || horizontalSpacingMeters > maximumHorizontalSpacing.horizontalSpacingMeters) {
      maximumHorizontalSpacing = segment;
    }
    if (minimumRawGrade === undefined || segment.rawGrade < minimumRawGrade.rawGrade) {
      minimumRawGrade = segment;
    }
    if (maximumRawGrade === undefined || segment.rawGrade > maximumRawGrade.rawGrade) {
      maximumRawGrade = segment;
    }
    if (altitudeDeltaMeters > 0) ascendingSegmentCount += 1;
    else if (altitudeDeltaMeters < 0) descendingSegmentCount += 1;
    else constantAltitudeSegmentCount += 1;
  }

  const last = track.points.at(-1);
  if (last === undefined || track.totalLengthMeters !== last.distanceMeters) {
    throw new RangeError("track.totalLengthMeters must equal the last point distance");
  }
  if (minimumHorizontalSpacing === undefined || maximumHorizontalSpacing === undefined
    || minimumRawGrade === undefined || maximumRawGrade === undefined) {
    throw new RangeError("track must contain a segment");
  }
  const segmentCount = track.points.length - 1;
  return Object.freeze({
    pointCount: track.points.length,
    segmentCount,
    totalHorizontalLengthMeters: track.totalLengthMeters,
    minimumHorizontalSpacing,
    maximumHorizontalSpacing,
    averageHorizontalSpacingMeters: track.totalLengthMeters / segmentCount,
    minimumRawGrade,
    maximumRawGrade,
    ascendingSegmentCount,
    descendingSegmentCount,
    constantAltitudeSegmentCount,
  });
}
