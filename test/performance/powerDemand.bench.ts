import { bench } from 'vitest'
import { powerDemand } from '../../src/domain/simulation/physics/aero'

const params = {
  airDensity: 1.2,
  cdA: 0.28,
  crr: 0.004,
  mass: 78,
  slope: 0.02,
  gravity: 9.81,
  drivetrainEfficiency: 0.97,
}

const candidateSpeeds = Array.from({ length: 12 }, (_, index) => 6 + index * 0.35)
const cachedValues = candidateSpeeds.map((speed) => powerDemand(speed, params))

bench('powerDemand candidate evaluation', () => {
  let accumulator = 0
  for (let iteration = 0; iteration < 256; iteration++) {
    for (const speed of candidateSpeeds) {
      accumulator += powerDemand(speed, params)
    }
  }
  return accumulator
})

bench('powerDemand lookup evaluation', () => {
  let accumulator = 0
  for (let iteration = 0; iteration < 256; iteration++) {
    for (let index = 0; index < cachedValues.length; index++) {
      accumulator += cachedValues[index]
    }
  }
  return accumulator
})
