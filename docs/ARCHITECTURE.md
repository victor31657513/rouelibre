# Architecture

## Vue d'ensemble

Le dépôt est organisé en workspace pnpm. Le socle contient les éléments nécessaires aux vérifications reproductibles, au noyau de simulation longitudinal minimal et au modèle énergétique CP/W' minimal pour un coureur isolé.

## Packages

### `packages/sim-core`

`sim-core` contient le moteur de simulation sans dépendance graphique, navigateur, DOM, React, Three.js ni moteur de corps rigides.

API exposée :

- `SingleRiderProfile` décrit le couple coureur-vélo avec masses, CdA, coefficient de roulement, rendement mécanique, puissance maximale et limite de force propulsive basse vitesse.
- `FlatRoadEnvironment` décrit l'air, le vent longitudinal et la gravité.
- `SingleRiderState` contient l'état dynamique mutable.
- `SingleRiderEnergyProfile` décrit les paramètres énergétiques CP/W' : puissance critique, capacité anaérobie et efficacité de récupération.
- `SingleRiderEnergyState` contient la réserve anaérobie mutable, la puissance anaérobie appliquée, la récupération réellement stockée sur le dernier pas et l'indicateur de limitation énergétique.
- `createSingleRiderState` crée un état physique initial typé.
- `createSingleRiderEnergyState` crée un état énergétique initial typé avec une réserve pleine.
- `computeSingleRiderForces` calcule les forces longitudinales instantanées avec `state.requestedPowerWatts`, bornée par la puissance maximale du profil. Cette fonction sert aux usages physiques historiques sans couplage énergétique.
- `computeSingleRiderForcesAtPower` calcule les forces longitudinales instantanées avec une puissance explicitement fournie. Cette fonction sert aux consommateurs qui doivent analyser les forces correspondant à la puissance réellement produite, sans mutation temporaire de l'état.
- `stepSingleRider` valide les entrées publiques puis avance un état physique d'un pas temporel explicite avec la puissance demandée.
- `stepSingleRiderEnergy` valide les entrées publiques puis avance uniquement l'état énergétique à partir de la puissance demandée.
- `stepSingleRiderWithEnergy` valide les entrées publiques, calcule un candidat énergétique et un candidat physique sans mutation, valide les résultats candidats, puis applique les deux états de façon atomique.

Contraintes :

- pas de dépendance à React ;
- pas de dépendance à Three.js ;
- pas de dépendance au DOM ou au navigateur ;
- pas de dépendance graphique ;
- pas d'utilisation directe de `Math.random()` dans le code de simulation ;
- unités SI dans le moteur.

## Scripts racine

- `pnpm install` installe le workspace.
- `pnpm typecheck` exécute le typecheck des packages.
- `pnpm test` exécute les tests des packages.

Aucun script `build` racine n'est défini parce qu'aucun build pertinent n'existe.
