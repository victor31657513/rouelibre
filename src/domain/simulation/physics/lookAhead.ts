import { MathUtils } from 'three'
import type { PathBoundaryMode } from './riderPathing'

export interface AheadSampleResult {
  sampleDistance: number
  travelDistance: number
}

export function computeAheadSampleDistance(
  baseDistance: number,
  desiredLookAhead: number,
  totalLength: number,
  mode: PathBoundaryMode,
): AheadSampleResult {
  const positiveLookAhead = Math.max(0, desiredLookAhead)

  if (!(totalLength > 0)) {
    const travelDistance = positiveLookAhead
    return {
      sampleDistance: baseDistance + travelDistance,
      travelDistance,
    }
  }

  if (mode === 'loop') {
    const boundedLookAhead = Math.min(positiveLookAhead, totalLength)
    const sampleDistance = MathUtils.euclideanModulo(
      baseDistance + boundedLookAhead,
      totalLength,
    )
    return {
      sampleDistance,
      travelDistance: boundedLookAhead,
    }
  }

  const sampleDistance = Math.min(baseDistance + positiveLookAhead, totalLength)
  return {
    sampleDistance,
    travelDistance: Math.max(0, sampleDistance - baseDistance),
  }
}
