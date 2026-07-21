/** Segment de parcours longitudinal, défini à partir de sa distance de début en mètres. */
export interface LongitudinalCourseSegment {
  readonly startDistanceMeters: number;
  /** Pente signée, ratio sans unité. */
  readonly roadGrade: number;
}

/** Options explicites de création d'un parcours. */
export interface LongitudinalCourseOptions {
  /** Longueur totale finie en mètres. Absente pour un parcours sans arrivée. */
  readonly totalLengthMeters?: number;
}

/** Parcours ordonné immuable. Le dernier segment se prolonge indéfiniment sans longueur totale. */
export interface LongitudinalCourse {
  readonly segments: readonly Readonly<LongitudinalCourseSegment>[];
  readonly totalLengthMeters: number | undefined;
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

/** Observation de progression. Les champs d'arrivée sont absents pour un parcours sans fin. */
export interface LongitudinalCourseProgress {
  readonly totalLengthMeters: number | undefined;
  readonly distanceMeters: number;
  readonly remainingDistanceMeters: number | undefined;
  readonly progress: number | undefined;
  readonly isFinished: boolean | undefined;
}

const FLAT_ROAD_GRADE = 0;

function assertFiniteDistance(distanceMeters: number): void {
  if (!Number.isFinite(distanceMeters) || distanceMeters < 0) {
    throw new RangeError("distanceMeters must be a non-negative finite number");
  }
}

/** Crée une copie défensive et gelée de segments validés. */
export function createLongitudinalCourse(
  segments: readonly LongitudinalCourseSegment[],
  options: LongitudinalCourseOptions = {},
): LongitudinalCourse {
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

  const totalLengthMeters = options.totalLengthMeters;
  if (totalLengthMeters !== undefined) {
    if (!Number.isFinite(totalLengthMeters) || totalLengthMeters <= 0) {
      throw new RangeError("totalLengthMeters must be a positive finite number");
    }
    if (totalLengthMeters <= previousStartDistanceMeters) {
      throw new RangeError("totalLengthMeters must be greater than the final segment start distance");
    }
  }

  return Object.freeze({ segments: Object.freeze(copiedSegments), totalLengthMeters });
}

/** Crée le parcours fini minimal, rectiligne et plat, depuis l'origine 0 m. */
export function createFlatLongitudinalCourse(totalLengthMeters: number): LongitudinalCourse {
  return createLongitudinalCourse(
    [{ startDistanceMeters: 0, roadGrade: FLAT_ROAD_GRADE }],
    { totalLengthMeters },
  );
}

/** Borne une distance validée à l'arrivée d'un parcours fini. */
export function clampLongitudinalCourseDistance(course: LongitudinalCourse, distanceMeters: number): number {
  assertFiniteDistance(distanceMeters);
  return course.totalLengthMeters === undefined
    ? distanceMeters
    : Math.min(distanceMeters, course.totalLengthMeters);
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

/** Produit les observables de progression et d'arrivée sans muter le parcours. */
export function getLongitudinalCourseProgressAtDistance(
  course: LongitudinalCourse,
  distanceMeters: number,
): LongitudinalCourseProgress {
  assertFiniteDistance(distanceMeters);
  const totalLengthMeters = course.totalLengthMeters;
  if (totalLengthMeters === undefined) {
    return Object.freeze({
      totalLengthMeters,
      distanceMeters,
      remainingDistanceMeters: undefined,
      progress: undefined,
      isFinished: undefined,
    });
  }
  const remainingDistanceMeters = Math.max(0, totalLengthMeters - distanceMeters);
  return Object.freeze({
    totalLengthMeters,
    distanceMeters,
    remainingDistanceMeters,
    progress: Math.min(1, distanceMeters / totalLengthMeters),
    isFinished: distanceMeters >= totalLengthMeters,
  });
}
