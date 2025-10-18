import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('hairpin cornering evaluation', () => {
  let restoreSelf: (() => void) | undefined
  let evaluateHairpinCornering: (typeof import('../src/domain/simulation/physics/worker'))['evaluateHairpinCornering']

  beforeAll(async () => {
    const previousSelf = (globalThis as { self?: unknown }).self
    const stubSelf = {
      postMessage: () => undefined,
      onmessage: null as unknown,
    }

    ;(globalThis as { self: unknown }).self = stubSelf

    restoreSelf = () => {
      if (previousSelf === undefined) {
        delete (globalThis as { self?: unknown }).self
      } else {
        ;(globalThis as { self: unknown }).self = previousSelf
      }
    }

    ;({ evaluateHairpinCornering } = await import(
      '../src/domain/simulation/physics/worker'
    ))
  })

  afterAll(() => {
    restoreSelf?.()
  })

  it('keeps target speeds near the maximum on gentle curves', () => {
    const result = evaluateHairpinCornering({
      curvatureEnvelope: {
        averageAbsCurvature: 0.004,
        rootMeanSquareAbsCurvature: 0.005,
        maxAbsCurvature: 0.006,
        rawMaxAbsCurvature: 0.006,
        coverageRatio: 0.12,
        intensity: 0.18,
      },
      localCurvature: 1 / 90,
      maxTargetSpeed: 9,
      candidateSpeed: 6,
    })

    expect(result.activation).toBe(0)
    expect(result.cornerSpeed).toBeCloseTo(9, 5)
  })

  it('slows down noticeably when a tight hairpin is detected', () => {
    const result = evaluateHairpinCornering({
      curvatureEnvelope: {
        averageAbsCurvature: 0.06,
        rootMeanSquareAbsCurvature: 0.08,
        maxAbsCurvature: 0.09,
        rawMaxAbsCurvature: 0.11,
        coverageRatio: 0.82,
        intensity: 0.92,
      },
      localCurvature: 1 / 9,
      maxTargetSpeed: 9,
      candidateSpeed: 5.2,
    })

    expect(result.activation).toBeGreaterThan(0.8)
    expect(result.cornerSpeed).toBeLessThan(6.0)
  })

  it('blends towards the cornering limit smoothly on medium bends', () => {
    const result = evaluateHairpinCornering({
      curvatureEnvelope: {
        averageAbsCurvature: 0.03,
        rootMeanSquareAbsCurvature: 0.038,
        maxAbsCurvature: 0.05,
        rawMaxAbsCurvature: 0.058,
        coverageRatio: 0.55,
        intensity: 0.65,
      },
      localCurvature: 1 / 28,
      maxTargetSpeed: 9,
      candidateSpeed: 6.2,
    })

    expect(result.activation).toBeGreaterThan(0)
    expect(result.activation).toBeLessThan(0.7)
    expect(result.cornerSpeed).toBeLessThan(9)
    expect(result.cornerSpeed).toBeGreaterThan(6.2)
  })
})
