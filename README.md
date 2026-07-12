# Roue libre

Roue libre est un projet de simulation cycliste en phase de fondation technique.

## État du projet

Le dépôt contient le socle minimal pour développer, tester et examiner les futures Pull Requests de manière reproductible. Aucune fonctionnalité de simulation cycliste n'est implémentée, validée ou exposée.

Consultez [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md) avant toute modification importante.

## Workspace

Le dépôt utilise un workspace pnpm avec TypeScript strict et Vitest.

Packages présents :

- `packages/sim-core` : package de base destiné au futur moteur de simulation. Il ne dépend pas de React, Three.js, du DOM, du navigateur ou d'une technologie graphique.

## Commandes

```bash
pnpm install
pnpm typecheck
pnpm test
```

Le dépôt ne définit pas de script `build` racine parce qu'aucun build pertinent n'existe dans le socle actuel.

## Hors périmètre du socle actuel

Le dépôt ne contient pas de moteur physique, d'énergie, d'intelligence artificielle, d'aspiration, de rendu graphique, d'import GPX, de Web Worker, de React, de Three.js, de Zustand ou de Rapier.
