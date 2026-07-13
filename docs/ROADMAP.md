# Roadmap

## Phase 0 — Fondation

- Workspace pnpm minimal.
- TypeScript strict.
- Vitest.
- CI Pull Request.
- Documentation initiale.
- Moteur déterministe minimal d'un coureur isolé sur route à pente longitudinale constante.
- Modèle énergétique minimal CP/W'.

## Phase laboratoire visuel

- Le laboratoire minimal du coureur isolé fournit le pilotage de la puissance demandée, du vent longitudinal, de la pente longitudinale constante, de l'exécution, de la pause, de la réinitialisation et de l'avance manuelle d'une seconde simulée.
- L'écran affiche les observables physiques, énergétiques, environnementales et les forces issues du moteur existant, avec une représentation visuelle simple dérivée de la distance et une jauge W'.
- La phase ne contient pas de GPX, virages, aspiration, plusieurs coureurs, Three.js, Zustand ni Web Worker.

## Fonctionnalités disponibles et limites proches

- La pente longitudinale constante est disponible comme paramètre global d'environnement, exprimé en ratio sans unité.
- Le parcours longitudinal segmenté reste futur : aucune succession de segments, aucun changement de pente selon la distance et aucun profil d'altitude issu d'un parcours ne sont implémentés.
- Le GPX et les virages restent non disponibles.

## Prochaine tâche

- Introduire un parcours longitudinal minimal composé de segments à pente constante, sans GPX ni virages.

## Hors périmètre actuel

Les sujets suivants ne font pas partie du périmètre disponible : altitude issue d'un parcours, profil variable, GPX, virages, aspiration, plusieurs coureurs, intelligence artificielle, tactique, psychologie, scène 3D, Three.js, Zustand, Web Worker, Rapier, collisions, adhérence, sons, sauvegarde, backend, authentification et déploiement.
