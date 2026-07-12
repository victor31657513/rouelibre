# Architecture

## Vue d'ensemble

Le dépôt est organisé en workspace pnpm. Le socle actuel contient uniquement les éléments nécessaires aux vérifications reproductibles et au futur noyau de simulation.

## Packages

### `packages/sim-core`

`sim-core` est le package destiné au futur moteur de simulation. Dans l'état actuel, il fournit seulement un marqueur typé vérifié par Vitest afin de valider la chaîne TypeScript et test.

Contraintes :

- pas de dépendance à React ;
- pas de dépendance à Three.js ;
- pas de dépendance au DOM ou au navigateur ;
- pas de dépendance graphique ;
- pas d'utilisation directe de `Math.random()` dans le futur code de simulation.

## Scripts racine

- `pnpm install` installe le workspace.
- `pnpm typecheck` exécute le typecheck des packages.
- `pnpm test` exécute les tests des packages.

Aucun script `build` racine n'est défini parce qu'aucun build pertinent n'existe.
