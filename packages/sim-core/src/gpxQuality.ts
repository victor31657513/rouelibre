import type {
  DistanceAnnotatedGpxPoint,
  DistanceAnnotatedGpxTrack,
} from "./gpxDistance.js";

const MINIMUM_POINT_COUNT = 2;

export interface GpxGeometryQualityOptions {
  readonly jumpThresholdMeters: number;
}

export interface GpxGeometrySegmentObservation {
  readonly startPointIndex: number;
  readonly endPointIndex: number;
  readonly segmentDistanceMeters: number;
}

export interface GpxGeometryQualityReport {
  readonly pointCount: number;
  readonly segmentCount: number;
  readonly totalLengthMeters: number;
  readonly jumpThresholdMeters: number;
  readonly longestSegment: Readonly<GpxGeometrySegmentObservation>;
  readonly exactDuplicateSegments: readonly Readonly<GpxGeometrySegmentObservation>[];
  readonly zeroHorizontalSegments: readonly Readonly<GpxGeometrySegmentObservation>[];
  readonly jumpSegments: readonly Readonly<GpxGeometrySegmentObservation>[];
}

function assertFiniteNumber(value: unknown, path: string): asserts value is number {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${path} must be a finite number`);
  }
}

function assertPoint(value: unknown, index: number): asserts value is DistanceAnnotatedGpxPoint {
  if (typeof value !== "object" || value === null) {
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

function observation(
  startPointIndex: number,
  endPointIndex: number,
  segmentDistanceMeters: number,
): Readonly<GpxGeometrySegmentObservation> {
  return Object.freeze({ startPointIndex, endPointIndex, segmentDistanceMeters });
}

/**
 * Observe la qualité géométrique d'une trace déjà distancée, sans recalcul
 * géodésique et sans mutation. Un doublon exact peut aussi être un segment nul.
 */
export function analyzeGpxGeometryQuality(
  track: DistanceAnnotatedGpxTrack,
  options: GpxGeometryQualityOptions,
): GpxGeometryQualityReport {
  if (typeof track !== "object" || track === null) {
    throw new TypeError("track must be an object");
  }
  if (!Array.isArray(track.points)) {
    throw new TypeError("track.points must be an array");
  }
  if (track.points.length < MINIMUM_POINT_COUNT) {
    throw new RangeError("track.points must contain at least two points");
  }
  assertFiniteNumber(track.totalLengthMeters, "track.totalLengthMeters");
  if (track.totalLengthMeters < 0) {
    throw new RangeError("track.totalLengthMeters must be non-negative");
  }
  if (typeof options !== "object" || options === null) {
    throw new TypeError("options must be an object");
  }
  assertFiniteNumber(options.jumpThresholdMeters, "options.jumpThresholdMeters");
  if (options.jumpThresholdMeters <= 0) {
    throw new RangeError("options.jumpThresholdMeters must be strictly positive");
  }

  const firstPoint = track.points[0];
  assertPoint(firstPoint, 0);
  if (firstPoint.distanceMeters !== 0) {
    throw new RangeError("track.points[0].distanceMeters must equal zero");
  }

  const exactDuplicateSegments: Readonly<GpxGeometrySegmentObservation>[] = [];
  const zeroHorizontalSegments: Readonly<GpxGeometrySegmentObservation>[] = [];
  const jumpSegments: Readonly<GpxGeometrySegmentObservation>[] = [];
  let longestSegment: Readonly<GpxGeometrySegmentObservation> | undefined;

  for (let endPointIndex = 1; endPointIndex < track.points.length; endPointIndex += 1) {
    const startPointIndex = endPointIndex - 1;
    const startPoint = track.points[startPointIndex];
    const endPoint = track.points[endPointIndex];
    // Le point précédent a été validé à l'itération précédente.
    if (startPoint === undefined) throw new RangeError(`track.points[${startPointIndex}] is missing`);
    assertPoint(endPoint, endPointIndex);
    if (endPoint.distanceMeters < startPoint.distanceMeters) {
      throw new RangeError(`track.points[${endPointIndex}].distanceMeters must be non-decreasing`);
    }

    const segmentDistanceMeters = endPoint.distanceMeters - startPoint.distanceMeters;
    const isExactDuplicate = startPoint.latitudeDegrees === endPoint.latitudeDegrees
      && startPoint.longitudeDegrees === endPoint.longitudeDegrees
      && startPoint.altitudeMeters === endPoint.altitudeMeters;
    const isZeroHorizontal = segmentDistanceMeters === 0;
    const isJump = segmentDistanceMeters > options.jumpThresholdMeters;
    const isLongest = longestSegment === undefined
      || segmentDistanceMeters > longestSegment.segmentDistanceMeters;

    if (isExactDuplicate || isZeroHorizontal || isJump || isLongest) {
      const segment = observation(startPointIndex, endPointIndex, segmentDistanceMeters);
      if (isExactDuplicate) exactDuplicateSegments.push(segment);
      if (isZeroHorizontal) zeroHorizontalSegments.push(segment);
      if (isJump) jumpSegments.push(segment);
      if (isLongest) longestSegment = segment;
    }
  }

  const lastPoint = track.points.at(-1);
  if (lastPoint === undefined || track.totalLengthMeters !== lastPoint.distanceMeters) {
    throw new RangeError("track.totalLengthMeters must equal the last point distance");
  }
  if (longestSegment === undefined) throw new RangeError("track must contain a segment");

  return Object.freeze({
    pointCount: track.points.length,
    segmentCount: track.points.length - 1,
    totalLengthMeters: track.totalLengthMeters,
    jumpThresholdMeters: options.jumpThresholdMeters,
    longestSegment,
    exactDuplicateSegments: Object.freeze(exactDuplicateSegments),
    zeroHorizontalSegments: Object.freeze(zeroHorizontalSegments),
    jumpSegments: Object.freeze(jumpSegments),
  });
}
