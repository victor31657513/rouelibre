import { bench } from 'vitest'
import { PathSpline } from '../../src/domain/route/pathSpline'
import {
  computeOffsetSegmentLength,
  computeOffsetSegmentLengths,
} from '../../src/domain/simulation/physics/speedControl'
import { Vector3 } from 'three'

const spline = new PathSpline([
  new Vector3(0, 0, 0),
  new Vector3(12, 0, 0),
  new Vector3(16, 0, 4),
  new Vector3(16, 0, 14),
])

const startDistance = 3
const endDistance = Math.min(startDistance + 9, spline.totalLength)
const offsets = Array.from({ length: 12 }, (_, index) => -1.2 + (index * 0.2))

bench('scalar offset sampling', () => {
  for (const offset of offsets) {
    computeOffsetSegmentLength(spline, startDistance, endDistance, offset, 24)
  }
})

bench('batched offset sampling', () => {
  computeOffsetSegmentLengths(spline, startDistance, endDistance, offsets, {
    sampleCount: 24,
  })
})
