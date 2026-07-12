export const simCorePackageName = "@rouelibre/sim-core";

export function describeFoundation(): string {
  return "Roue libre simulation core foundation";
}

export {
  computeSingleRiderForces,
  createSingleRiderState,
  defaultFlatRoadEnvironment,
  defaultSingleRiderProfile,
  stepSingleRider,
  type FlatRoadEnvironment,
  type SingleRiderForces,
  type SingleRiderProfile,
  type SingleRiderState,
} from "./longitudinal.js";

export {
  createSingleRiderEnergyState,
  stepSingleRiderEnergy,
  stepSingleRiderWithEnergy,
  type SingleRiderEnergyProfile,
  type SingleRiderEnergyState,
} from "./energy.js";
