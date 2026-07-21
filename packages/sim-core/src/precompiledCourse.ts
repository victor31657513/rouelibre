/** Échantillon longitudinal précompilé, exprimé exclusivement en unités SI. */
export interface PrecompiledCourseSample {
  readonly distanceMeters: number;
  readonly altitudeMeters: number;
}

/** Configuration immuable d'un parcours précompilé à altitude échantillonnée. */
export interface PrecompiledCourse {
  readonly samples: readonly Readonly<PrecompiledCourseSample>[];
  readonly totalLengthMeters: number;
}

const MINIMUM_SAMPLE_COUNT = 2;

function assertReadableDistance(distanceMeters: number): void {
  if (!Number.isFinite(distanceMeters) || distanceMeters < 0) {
    throw new RangeError("distanceMeters must be a non-negative finite number");
  }
}

/** Résout l'intervalle semi-ouvert actif, en prolongeant le dernier intervalle. */
function getIntervalStartIndexAtDistance(
  samples: readonly Readonly<PrecompiledCourseSample>[],
  distanceMeters: number,
): number {
  let low = 0;
  let high = samples.length - 1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const sample = samples[middle];
    if (sample === undefined) throw new RangeError("precompiled course sample is missing");
    if (sample.distanceMeters <= distanceMeters) low = middle + 1;
    else high = middle - 1;
  }
  return Math.min(high, samples.length - 2);
}

/** Valide puis copie et gèle une suite d'échantillons longitudinaux. */
export function createPrecompiledCourse(
  samples: readonly PrecompiledCourseSample[],
): PrecompiledCourse {
  if (samples.length < MINIMUM_SAMPLE_COUNT) {
    throw new RangeError("precompiled course must contain at least two samples");
  }

  let previousDistanceMeters = -1;
  for (let index = 0; index < samples.length; index += 1) {
    const sample = samples[index];
    if (sample === undefined) {
      throw new RangeError("precompiled course sample is missing");
    }
    assertReadableDistance(sample.distanceMeters);
    if (!Number.isFinite(sample.altitudeMeters)) {
      throw new RangeError("sample.altitudeMeters must be finite");
    }
    if (index === 0 && sample.distanceMeters !== 0) {
      throw new RangeError("first sample.distanceMeters must be exactly zero");
    }
    if (sample.distanceMeters <= previousDistanceMeters) {
      throw new RangeError("sample.distanceMeters values must be strictly increasing");
    }
    previousDistanceMeters = sample.distanceMeters;
  }

  const totalLengthMeters = previousDistanceMeters;
  if (!Number.isFinite(totalLengthMeters) || totalLengthMeters <= 0) {
    throw new RangeError("totalLengthMeters must be a positive finite number");
  }

  const copiedSamples = samples.map((sample) => Object.freeze({
    distanceMeters: sample.distanceMeters,
    altitudeMeters: sample.altitudeMeters,
  }));
  return Object.freeze({
    samples: Object.freeze(copiedSamples),
    totalLengthMeters,
  });
}

/** Lit l'altitude interpolée sans modifier ni allouer depuis le parcours. */
export function getPrecompiledCourseAltitudeAtDistance(
  course: PrecompiledCourse,
  distanceMeters: number,
): number {
  assertReadableDistance(distanceMeters);
  const samples = course.samples;
  const finalSample = samples[samples.length - 1];
  if (finalSample === undefined) throw new RangeError("precompiled course sample is missing");
  if (distanceMeters >= course.totalLengthMeters) return finalSample.altitudeMeters;

  const startIndex = getIntervalStartIndexAtDistance(samples, distanceMeters);
  const start = samples[startIndex];
  const end = samples[startIndex + 1];
  if (start === undefined || end === undefined) {
    throw new RangeError("precompiled course interpolation interval is missing");
  }
  const ratio = (distanceMeters - start.distanceMeters)
    / (end.distanceMeters - start.distanceMeters);
  return start.altitudeMeters + (end.altitudeMeters - start.altitudeMeters) * ratio;
}

/** Lit la pente de l'intervalle actif comme ratio sans unité, sans modifier ni allouer. */
export function getPrecompiledCourseRoadGradeAtDistance(
  course: PrecompiledCourse,
  distanceMeters: number,
): number {
  assertReadableDistance(distanceMeters);
  const samples = course.samples;
  const startIndex = getIntervalStartIndexAtDistance(samples, distanceMeters);
  const start = samples[startIndex];
  const end = samples[startIndex + 1];
  if (start === undefined || end === undefined) {
    throw new RangeError("precompiled course grade interval is missing");
  }
  return (end.altitudeMeters - start.altitudeMeters)
    / (end.distanceMeters - start.distanceMeters);
}
