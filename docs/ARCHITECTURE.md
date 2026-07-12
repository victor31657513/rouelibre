# Architecture

## Vue d'ensemble

Le dépôt est organisé en workspace pnpm. Le socle contient les éléments nécessaires aux vérifications reproductibles, au noyau de simulation longitudinal minimal et au modèle énergétique minimal d'un coureur isolé.

## Packages

### `packages/sim-core`

`sim-core` contient le moteur de simulation sans dépendance graphique, navigateur, DOM, React, Three.js ni moteur de corps rigides.

Organisation interne :

- `src/longitudinal.ts` contient le profil physique, l'environnement plat, l'état physique, les forces longitudinales et le pas physique historique.
- `src/energy.ts` contient le profil énergétique CP/W', l'état énergétique, la logique de consommation/récupération et l'orchestration énergie puis physique.
- `src/index.ts` expose uniquement l'API publique nécessaire aux consommateurs du package.

API exposée :

- `SingleRiderProfile` décrit le couple coureur-vélo avec masses, CdA, coefficient de roulement, rendement mécanique, puissance maximale et limite de force propulsive basse vitesse.
- `FlatRoadEnvironment` décrit l'air, le vent longitudinal et la gravité.
- `SingleRiderState` contient l'état dynamique physique mutable.
- `createSingleRiderState` crée un état physique initial typé.
- `computeSingleRiderForces` calcule les forces longitudinales instantanées.
- `stepSingleRider` valide les entrées publiques puis avance un état physique d'un pas temporel explicite sans modèle énergétique.
- `SingleRiderEnergyProfile` décrit la puissance critique, la capacité anaérobie W' et l'efficacité de récupération.
- `SingleRiderEnergyState` contient la réserve anaérobie mutable et les observables du dernier pas énergétique.
- `createSingleRiderEnergyState` crée un état énergétique initial, plein par défaut ou avec une réserve explicite bornée.
- `stepSingleRiderEnergy` applique uniquement la logique énergétique CP/W' et retourne la puissance produite autorisée.
- `stepSingleRiderWithEnergy` orchestre un pas complet : validation, calcul énergétique, mise à jour de la réserve, transmission de la puissance produite au moteur longitudinal et mise à jour de l'état physique.

Contraintes :

- pas de dépendance à React ;
- pas de dépendance à Three.js ;
- pas de dépendance au DOM ou au navigateur ;
- pas de dépendance graphique ;
- pas d'utilisation directe de `Math.random()` dans le code de simulation ;
- unités SI dans le moteur ;
- séparation entre profil physique, profil énergétique, état physique, état énergétique, logique énergétique et orchestration combinée.

## Scripts racine

- `pnpm install` installe le workspace.
- `pnpm typecheck` exécute le typecheck des packages.
- `pnpm test` exécute les tests des packages.

Aucun script `build` racine n'est défini parce qu'aucun build pertinent n'existe.
