import type { DistanceAnnotatedGpxPoint, DistanceAnnotatedGpxTrack } from "./gpxDistance.js";

export interface GpxRawDistributionOptions {
  readonly percentiles: readonly number[];
  readonly horizontalSpacingThresholdsMeters: readonly number[];
  readonly absoluteAltitudeDeltaThresholdsMeters: readonly number[];
  readonly absoluteRawGradeThresholds: readonly number[];
}

export interface GpxRawDistributionSegmentObservation {
  readonly trackIndex: number;
  readonly startPointIndex: number;
  readonly endPointIndex: number;
  readonly horizontalSpacingMeters: number;
  readonly altitudeDeltaMeters: number;
  readonly rawGrade: number;
}

export interface GpxRawPercentileObservation extends GpxRawDistributionSegmentObservation {
  readonly percentile: number;
  readonly value: number;
}

export interface GpxRawThresholdObservation extends GpxRawDistributionSegmentObservation {
  readonly value: number;
}

export interface GpxRawThresholdResult {
  readonly threshold: number;
  readonly segmentCountAbove: number;
  readonly proportion: number;
  readonly firstObservationAbove?: Readonly<GpxRawThresholdObservation>;
}

export interface GpxRawDistribution {
  readonly percentiles: readonly Readonly<GpxRawPercentileObservation>[];
  readonly thresholds: readonly Readonly<GpxRawThresholdResult>[];
}

export interface GpxRawDistributionReport {
  readonly trackCount: number;
  readonly pointCount: number;
  readonly segmentCount: number;
  readonly options: Readonly<GpxRawDistributionOptions>;
  readonly horizontalSpacingMeters: Readonly<GpxRawDistribution>;
  readonly altitudeDeltaMeters: Readonly<GpxRawDistribution>;
  readonly absoluteAltitudeDeltaMeters: Readonly<GpxRawDistribution>;
  readonly absoluteRawGrade: Readonly<GpxRawDistribution>;
}

interface Segment extends GpxRawDistributionSegmentObservation {
  readonly absoluteAltitudeDeltaMeters: number;
  readonly absoluteRawGrade: number;
}

type Metric = (segment: Segment) => number;

function copyValidatedArray(
  value: unknown,
  path: string,
  validateValue: (entry: number) => boolean,
  requirement: string,
): readonly number[] {
  if (!Array.isArray(value)) throw new TypeError(`${path} must be an array`);
  const copy: number[] = [];
  for (let index = 0; index < value.length; index += 1) {
    const entry: unknown = value[index];
    if (typeof entry !== "number" || !Number.isFinite(entry)) {
      throw new TypeError(`${path}[${index}] must be a finite number`);
    }
    if (!validateValue(entry)) throw new RangeError(`${path}[${index}] ${requirement}`);
    if (index > 0 && entry <= (copy[index - 1] ?? entry)) {
      throw new RangeError(`${path} must be strictly increasing without duplicates`);
    }
    copy.push(entry);
  }
  return Object.freeze(copy);
}

function validateOptions(value: unknown): Readonly<GpxRawDistributionOptions> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new TypeError("options must be an object");
  }
  const options = value as Partial<GpxRawDistributionOptions>;
  return Object.freeze({
    percentiles: copyValidatedArray(options.percentiles, "options.percentiles", (entry) => entry >= 0 && entry <= 100, "must be between 0 and 100"),
    horizontalSpacingThresholdsMeters: copyValidatedArray(options.horizontalSpacingThresholdsMeters, "options.horizontalSpacingThresholdsMeters", (entry) => entry > 0, "must be strictly positive"),
    absoluteAltitudeDeltaThresholdsMeters: copyValidatedArray(options.absoluteAltitudeDeltaThresholdsMeters, "options.absoluteAltitudeDeltaThresholdsMeters", (entry) => entry > 0, "must be strictly positive"),
    absoluteRawGradeThresholds: copyValidatedArray(options.absoluteRawGradeThresholds, "options.absoluteRawGradeThresholds", (entry) => entry > 0, "must be strictly positive"),
  });
}

function assertPoint(value: unknown, trackIndex: number, pointIndex: number): asserts value is DistanceAnnotatedGpxPoint {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new TypeError(`tracks[${trackIndex}].points[${pointIndex}] must be an object`);
  }
  const point = value as Partial<DistanceAnnotatedGpxPoint>;
  for (const field of ["latitudeDegrees", "longitudeDegrees", "altitudeMeters", "distanceMeters"] as const) {
    if (typeof point[field] !== "number" || !Number.isFinite(point[field])) {
      throw new TypeError(`tracks[${trackIndex}].points[${pointIndex}].${field} must be a finite number`);
    }
  }
  const latitudeDegrees = point.latitudeDegrees as number;
  const longitudeDegrees = point.longitudeDegrees as number;
  if (latitudeDegrees < -90 || latitudeDegrees > 90) throw new RangeError(`tracks[${trackIndex}].points[${pointIndex}].latitudeDegrees is out of range`);
  if (longitudeDegrees < -180 || longitudeDegrees > 180) throw new RangeError(`tracks[${trackIndex}].points[${pointIndex}].longitudeDegrees is out of range`);
}

function validateTracks(value: unknown): asserts value is readonly DistanceAnnotatedGpxTrack[] {
  if (!Array.isArray(value)) throw new TypeError("tracks must be an array");
  if (value.length === 0) throw new RangeError("tracks must not be empty");
  for (let trackIndex = 0; trackIndex < value.length; trackIndex += 1) {
    const track: unknown = value[trackIndex];
    if (typeof track !== "object" || track === null || Array.isArray(track)) throw new TypeError(`tracks[${trackIndex}] must be an object`);
    const candidate = track as Partial<DistanceAnnotatedGpxTrack>;
    if (!Array.isArray(candidate.points)) throw new TypeError(`tracks[${trackIndex}].points must be an array`);
    if (candidate.points.length < 2) throw new RangeError(`tracks[${trackIndex}].points must contain at least two points`);
    if (typeof candidate.totalLengthMeters !== "number" || !Number.isFinite(candidate.totalLengthMeters)) throw new TypeError(`tracks[${trackIndex}].totalLengthMeters must be finite`);
    for (let pointIndex = 0; pointIndex < candidate.points.length; pointIndex += 1) assertPoint(candidate.points[pointIndex], trackIndex, pointIndex);
    if (candidate.points[0]?.distanceMeters !== 0) throw new RangeError(`tracks[${trackIndex}] must start at distance zero`);
    for (let pointIndex = 1; pointIndex < candidate.points.length; pointIndex += 1) {
      const start = candidate.points[pointIndex - 1];
      const end = candidate.points[pointIndex];
      if (start === undefined || end === undefined || end.distanceMeters <= start.distanceMeters) {
        throw new RangeError(`tracks[${trackIndex}].points distances must be strictly increasing`);
      }
      const spacing = end.distanceMeters - start.distanceMeters;
      const delta = end.altitudeMeters - start.altitudeMeters;
      const grade = delta / spacing;
      if (!Number.isFinite(spacing) || !Number.isFinite(delta) || !Number.isFinite(grade)) throw new RangeError(`tracks[${trackIndex}] segment ${pointIndex - 1}-${pointIndex} metrics must be finite`);
    }
    if (candidate.points.at(-1)?.distanceMeters !== candidate.totalLengthMeters) throw new RangeError(`tracks[${trackIndex}].totalLengthMeters must equal its last point distance`);
  }
}

function freezeObservation(segment: Segment, value: number): Readonly<GpxRawThresholdObservation> {
  return Object.freeze({ value, trackIndex: segment.trackIndex, startPointIndex: segment.startPointIndex,
    endPointIndex: segment.endPointIndex, horizontalSpacingMeters: segment.horizontalSpacingMeters,
    altitudeDeltaMeters: segment.altitudeDeltaMeters, rawGrade: segment.rawGrade });
}

function distribution(segments: readonly Segment[], percentiles: readonly number[], thresholds: readonly number[], metric: Metric): Readonly<GpxRawDistribution> {
  const sorted = segments.slice().sort((left, right) => {
    const valueDifference = metric(left) - metric(right);
    if (valueDifference !== 0) return valueDifference;
    if (left.trackIndex !== right.trackIndex) return left.trackIndex - right.trackIndex;
    return left.startPointIndex - right.startPointIndex;
  });
  const percentileResults = percentiles.map((percentile) => {
    const index = percentile === 0 ? 0 : Math.ceil((percentile / 100) * sorted.length) - 1;
    const segment = sorted[index];
    if (segment === undefined) throw new RangeError("a percentile observation is missing");
    return Object.freeze({ percentile, ...freezeObservation(segment, metric(segment)) });
  });
  const thresholdResults = thresholds.map((threshold) => {
    let segmentCountAbove = 0;
    let first: Segment | undefined;
    for (const segment of segments) {
      if (metric(segment) > threshold) {
        segmentCountAbove += 1;
        first ??= segment;
      }
    }
    return Object.freeze({ threshold, segmentCountAbove, proportion: segmentCountAbove / segments.length,
      ...(first === undefined ? {} : { firstObservationAbove: freezeObservation(first, metric(first)) }) });
  });
  return Object.freeze({ percentiles: Object.freeze(percentileResults), thresholds: Object.freeze(thresholdResults) });
}

/**
 * Diagnostique plusieurs traces canoniques sans les transformer. Les percentiles
 * utilisent le rang supérieur empirique, sans interpolation.
 */
export function analyzeGpxRawDistributions(tracks: readonly DistanceAnnotatedGpxTrack[], options: GpxRawDistributionOptions): GpxRawDistributionReport {
  const validatedOptions = validateOptions(options);
  validateTracks(tracks);
  const segments: Segment[] = [];
  let pointCount = 0;
  for (let trackIndex = 0; trackIndex < tracks.length; trackIndex += 1) {
    const track = tracks[trackIndex];
    if (track === undefined) throw new RangeError(`tracks[${trackIndex}] is missing`);
    pointCount += track.points.length;
    for (let endPointIndex = 1; endPointIndex < track.points.length; endPointIndex += 1) {
      const start = track.points[endPointIndex - 1];
      const end = track.points[endPointIndex];
      if (start === undefined || end === undefined) throw new RangeError("validated point is missing");
      const horizontalSpacingMeters = end.distanceMeters - start.distanceMeters;
      const altitudeDeltaMeters = end.altitudeMeters - start.altitudeMeters;
      const rawGrade = altitudeDeltaMeters / horizontalSpacingMeters;
      segments.push({ trackIndex, startPointIndex: endPointIndex - 1, endPointIndex,
        horizontalSpacingMeters, altitudeDeltaMeters, rawGrade,
        absoluteAltitudeDeltaMeters: Math.abs(altitudeDeltaMeters), absoluteRawGrade: Math.abs(rawGrade) });
    }
  }
  const none = Object.freeze([]) as readonly number[];
  return Object.freeze({ trackCount: tracks.length, pointCount, segmentCount: segments.length, options: validatedOptions,
    horizontalSpacingMeters: distribution(segments, validatedOptions.percentiles, validatedOptions.horizontalSpacingThresholdsMeters, (segment) => segment.horizontalSpacingMeters),
    altitudeDeltaMeters: distribution(segments, validatedOptions.percentiles, none, (segment) => segment.altitudeDeltaMeters),
    absoluteAltitudeDeltaMeters: distribution(segments, validatedOptions.percentiles, validatedOptions.absoluteAltitudeDeltaThresholdsMeters, (segment) => segment.absoluteAltitudeDeltaMeters),
    absoluteRawGrade: distribution(segments, validatedOptions.percentiles, validatedOptions.absoluteRawGradeThresholds, (segment) => segment.absoluteRawGrade),
  });
}
