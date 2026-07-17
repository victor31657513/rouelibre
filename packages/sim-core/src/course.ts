/** Segment de parcours longitudinal, défini à partir de sa distance de début en mètres. */
export interface LongitudinalCourseSegment {
  readonly startDistanceMeters: number;
  /** Pente signée, ratio sans unité. */
  readonly roadGrade: number;
}

/** Parcours ordonné immuable. Le dernier segment se prolonge indéfiniment. */
export interface LongitudinalCourse {
  readonly segments: readonly Readonly<LongitudinalCourseSegment>[];
}

/** Informations d'observation allouées à la demande, jamais nécessaires dans la boucle de ticks. */
export interface LongitudinalCoursePosition {
  readonly segmentIndex: number;
  readonly segmentCount: number;
  readonly segmentStartDistanceMeters: number;
  readonly distanceIntoSegmentMeters: number;
  readonly nextSegmentStartDistanceMeters: number | undefined;
  readonly roadGrade: number;
}

function assertFiniteDistance(distanceMeters: number): void {
  if (!Number.isFinite(distanceMeters) || distanceMeters < 0) {
    throw new RangeError("distanceMeters must be a non-negative finite number");
  }
}

/** Crée une copie défensive et gelée de segments validés. */
export function createLongitudinalCourse(segments: readonly LongitudinalCourseSegment[]): LongitudinalCourse {
  if (segments.length === 0) {
    throw new RangeError("course must contain at least one segment");
  }

  const copiedSegments: LongitudinalCourseSegment[] = [];
  let previousStartDistanceMeters = -1;
  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    if (segment === undefined) {
      throw new RangeError("course segment is missing");
    }
    if (!Number.isFinite(segment.startDistanceMeters) || segment.startDistanceMeters < 0) {
      throw new RangeError("segment.startDistanceMeters must be a non-negative finite number");
    }
    if (!Number.isFinite(segment.roadGrade)) {
      throw new RangeError("segment.roadGrade must be finite");
    }
    if (index === 0 && segment.startDistanceMeters !== 0) {
      throw new RangeError("first segment.startDistanceMeters must be exactly zero");
    }
    if (segment.startDistanceMeters <= previousStartDistanceMeters) {
      throw new RangeError("segment.startDistanceMeters values must be strictly increasing");
    }
    copiedSegments.push(Object.freeze({ ...segment }));
    previousStartDistanceMeters = segment.startDistanceMeters;
  }

  return Object.freeze({ segments: Object.freeze(copiedSegments) });
}

/** Recherche binaire sans allocation du segment actif à une distance donnée. */
export function getLongitudinalCourseSegmentIndexAtDistance(course: LongitudinalCourse, distanceMeters: number): number {
  assertFiniteDistance(distanceMeters);
  let low = 0;
  let high = course.segments.length - 1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const segment = course.segments[middle];
    if (segment === undefined) {
      throw new RangeError("course segment is missing");
    }
    if (segment.startDistanceMeters <= distanceMeters) {
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  return high;
}

/** Retourne directement la pente active pour l'usage dans la boucle physique. */
export function getLongitudinalCourseRoadGradeAtDistance(course: LongitudinalCourse, distanceMeters: number): number {
  const segment = course.segments[getLongitudinalCourseSegmentIndexAtDistance(course, distanceMeters)];
  if (segment === undefined) throw new RangeError("course segment is missing");
  return segment.roadGrade;
}

/** Produit les informations détaillées réservées aux observateurs. */
export function getLongitudinalCoursePositionAtDistance(course: LongitudinalCourse, distanceMeters: number): LongitudinalCoursePosition {
  const segmentIndex = getLongitudinalCourseSegmentIndexAtDistance(course, distanceMeters);
  const segment = course.segments[segmentIndex];
  if (segment === undefined) throw new RangeError("course segment is missing");
  const nextSegment = course.segments[segmentIndex + 1];
  return Object.freeze({
    segmentIndex,
    segmentCount: course.segments.length,
    segmentStartDistanceMeters: segment.startDistanceMeters,
    distanceIntoSegmentMeters: distanceMeters - segment.startDistanceMeters,
    nextSegmentStartDistanceMeters: nextSegment?.startDistanceMeters,
    roadGrade: segment.roadGrade,
  });
}
