import { MathUtils } from 'three'
import type { CurvatureEnvelope } from './riderPathing'

export type CorneringCategory = 'straight' | 'standard' | 'hairpin'

export interface CorneringClassificationOptions {
  hairpinIntensityThreshold?: number
  hairpinCoverageThreshold?: number
  hairpinRadiusThreshold?: number
  minimumCornerIntensity?: number
  minimumCoverageForCorner?: number
  minimumHairpinBrakingFactor?: number
  hairpinBrakingExponent?: number
}

export interface CorneringAssessmentResult {
  category: CorneringCategory
  brakingFactor: number
  activation: number
  effectiveRadius: number
}

function computeActivation(value: number, threshold: number): number {
  const safeThreshold = MathUtils.clamp(threshold, 0, 1)
  return MathUtils.clamp(
    (value - safeThreshold) / Math.max(1 - safeThreshold, 1e-3),
    0,
    1,
  )
}

function computeRadiusActivation(radius: number, threshold: number): number {
  if (!(Number.isFinite(radius) && radius > 0)) {
    return 0
  }
  const safeThreshold = Math.max(1, threshold)
  if (radius >= safeThreshold) {
    return 0
  }
  return MathUtils.clamp((safeThreshold - radius) / safeThreshold, 0, 1)
}

export function assessCorneringProfile(
  envelope: CurvatureEnvelope,
  options: CorneringClassificationOptions = {},
): CorneringAssessmentResult {
  const {
    hairpinIntensityThreshold = 0.72,
    hairpinCoverageThreshold = 0.58,
    hairpinRadiusThreshold = 22,
    minimumCornerIntensity = 0.18,
    minimumCoverageForCorner = 0.2,
    minimumHairpinBrakingFactor = 0.45,
    hairpinBrakingExponent = 1.6,
  } = options

  const intensity = MathUtils.clamp(envelope.intensity ?? 0, 0, 1)
  const coverage = MathUtils.clamp(envelope.coverageRatio ?? 0, 0, 1)
  const curvature = Math.max(0, envelope.maxAbsCurvature ?? 0)
  const effectiveRadius = curvature > 1e-6 ? 1 / curvature : Infinity

  const isCorner =
    intensity >= Math.max(0, minimumCornerIntensity) &&
    coverage >= Math.max(0, minimumCoverageForCorner)

  if (!isCorner) {
    return {
      category: 'straight',
      brakingFactor: 1,
      activation: 0,
      effectiveRadius,
    }
  }

  const intensityActivation = computeActivation(intensity, hairpinIntensityThreshold)
  const coverageActivation = computeActivation(coverage, hairpinCoverageThreshold)
  const radiusActivation = computeRadiusActivation(
    effectiveRadius,
    Math.max(4, hairpinRadiusThreshold),
  )

  const activation = Math.max(radiusActivation, Math.max(intensityActivation, coverageActivation))
  const meetsIntensity = intensity >= hairpinIntensityThreshold
  const meetsCoverage = coverage >= hairpinCoverageThreshold
  const meetsRadius = radiusActivation > 0
  const dominantRadius = radiusActivation >= Math.max(intensityActivation, coverageActivation)
  const isHairpin =
    meetsRadius &&
    meetsIntensity &&
    (meetsCoverage || dominantRadius)

  if (!isHairpin) {
    return {
      category: 'standard',
      brakingFactor: 1,
      activation: Math.max(intensityActivation, coverageActivation),
      effectiveRadius,
    }
  }

  const brakingFloor = MathUtils.clamp(minimumHairpinBrakingFactor, 0.25, 0.95)
  const easedActivation = Math.pow(MathUtils.clamp(activation, 0, 1), Math.max(1, hairpinBrakingExponent))
  const brakingFactor = MathUtils.lerp(1, brakingFloor, easedActivation)

  return {
    category: 'hairpin',
    brakingFactor,
    activation,
    effectiveRadius,
  }
}
