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
- `computeSingleRiderForces` calcule les forces longitudinales instantanées en utilisant la puissance demandée bornée, pour les usages historiques sans modèle énergétique.
- `computeSingleRiderForcesAtPower` calcule les forces longitudinales instantanées avec une puissance produite explicite, utile lorsque la puissance est limitée par le modèle énergétique.
- `stepSingleRider` valide les entrées publiques puis avance un état physique d'un pas temporel explicite sans modèle énergétique.
- `SingleRiderEnergyProfile` décrit la puissance critique, la capacité anaérobie W' et l'efficacité de récupération.
- `SingleRiderEnergyState` contient la réserve anaérobie mutable et les observables du dernier pas énergétique.
- `createSingleRiderEnergyState` crée un état énergétique initial, plein par défaut ou avec une réserve explicite bornée.
- `stepSingleRiderEnergy` applique uniquement la logique énergétique CP/W' et retourne la puissance produite autorisée.
- `stepSingleRiderWithEnergy` orchestre un pas complet : validation, calcul énergétique pur, calcul physique candidat pur, validation des candidats, puis commit atomique des états énergétique et physique.

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
- `pnpm build` exécute le build de production des workspaces qui en définissent un, notamment le laboratoire visuel.

### `apps/lab`

`apps/lab` contient le laboratoire visuel minimal du coureur isolé. L'application utilise Vite, React, TypeScript strict et du CSS simple. Elle dépend de `@rouelibre/sim-core` par son API publique et ne copie pas le moteur.

Direction des dépendances :

```text
apps/lab → packages/sim-core
```

`sim-core` ne dépend pas du laboratoire, de React, de Vite, du DOM, du navigateur, de Three.js ni d'une bibliothèque graphique.

Organisation :

- `src/simulation/labSimulation.ts` contient le contrôleur indépendant de React et du DOM. Il possède les états physique et énergétique, applique CP = 250 W, W' = 20 000 J, une efficacité de récupération de 0,5, un pas fixe `1 / 60 s` et calcule les forces avec la puissance réellement produite.
- `src/simulation/fixedStepRunner.ts` contient l'adaptateur temporel. Il transforme le temps réel issu de `requestAnimationFrame` en ticks entiers, conserve un reliquat, plafonne le temps réel rattrapable après une frame longue avant application du multiplicateur, puis réinitialise sa référence temporelle lors d'une reprise. Le multiplicateur ×20 produit vingt secondes simulées par seconde réelle en fonctionnement normal sans modifier le pas fixe `1 / 60 s`.
- `src/App.tsx` contient les composants React d'affichage et de commande. Les composants ne portent pas la logique de simulation et ne reçoivent que des instantanés copiés et gelés.
- `src/styles.css` fournit une présentation CSS simple, responsive et lisible.

Choix temporaires et réversibles :

- Three.js est reporté parce qu'une route plate et un bloc cycliste suffisent à observer un seul coureur isolé.
- Zustand est reporté parce qu'une page unique peut rester pilotée par l'état React local et un contrôleur explicite.
- Web Worker est reporté parce qu'un seul coureur à 60 Hz ne justifie pas encore un protocole de messages dédié. La séparation entre contrôleur, adaptateur temporel et UI permet de déplacer ultérieurement l'exécution dans un Web Worker sans modifier `sim-core`.
- Les bibliothèques de graphiques, de composants et les frameworks CSS sont reportés parce que les observables sont des valeurs numériques et des jauges simples.
