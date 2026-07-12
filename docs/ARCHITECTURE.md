# Architecture

## Vue d'ensemble

Le dépôt est organisé en workspace pnpm. Le socle contient les éléments nécessaires aux vérifications reproductibles et au noyau de simulation longitudinal minimal.

## Packages

### `packages/sim-core`

`sim-core` contient le moteur de simulation sans dépendance graphique, navigateur, DOM, React, Three.js ni moteur de corps rigides.

API exposée :

- `SingleRiderProfile` décrit le couple coureur-vélo avec masses, CdA, coefficient de roulement, rendement mécanique, puissance maximale et limite de force propulsive basse vitesse.
- `FlatRoadEnvironment` décrit l'air, le vent longitudinal et la gravité.
- `SingleRiderState` contient l'état dynamique mutable.
- `createSingleRiderState` crée un état initial typé.
- `computeSingleRiderForces` calcule les forces longitudinales instantanées.
- `stepSingleRider` avance un état d'un pas temporel explicite.

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
