import type { GPXPoint } from './gpx'

/**
 * @fileoverview Elevation helpers summarising cumulative climb and descent.
 *
 * Extension: Add moving averages or gradient distribution by building on top
 * of `computeElevationStats`. Keep the return type explicit to ease destructuring.
 */
export interface ElevationStats {
  totalGain: number
  totalLoss: number
}

/** Computes cumulative positive and negative elevation gain for a GPX track. */
export function computeElevationStats(pts: GPXPoint[]): ElevationStats {
  let totalGain = 0
  let totalLoss = 0
  for (let i = 1; i < pts.length; i++) {
    const diff = pts[i].ele - pts[i - 1].ele
    if (diff > 0) totalGain += diff
    else totalLoss -= diff
  }
  return { totalGain, totalLoss }
}
