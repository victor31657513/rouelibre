# Roadmap

## Phase 0 — Fondation

- Workspace pnpm minimal.
- TypeScript strict.
- Vitest.
- CI Pull Request.
- Documentation initiale.
- Moteur déterministe minimal d'un coureur isolé sur route plate.
- Modèle énergétique minimal CP/W'.

## Phase laboratoire visuel

- Le laboratoire minimal du coureur isolé fournit le pilotage de la puissance demandée, du vent longitudinal, de l'exécution, de la pause, de la réinitialisation et de l'avance manuelle d'une seconde simulée.
- L'écran affiche les observables physiques, énergétiques, environnementales et les forces issues du moteur existant, avec une représentation visuelle simple dérivée de la distance et une jauge W'.
- La phase ne contient pas de pente, GPX, virages, aspiration, plusieurs coureurs, Three.js, Zustand ni Web Worker.

## Prochaine tâche

- Ajouter une pente longitudinale constante au moteur physique, la documenter, la tester et l'exposer dans le laboratoire visuel, sans introduire encore de GPX ni de virages.

## Hors périmètre actuel

Les sujets suivants ne font pas partie du périmètre implémenté : pente, altitude, GPX, virages, aspiration, plusieurs coureurs, intelligence artificielle, tactique, psychologie, scène 3D, Three.js, Zustand, Web Worker, Rapier, collisions, adhérence, sons, sauvegarde, backend, authentification et déploiement.
