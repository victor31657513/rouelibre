# AGENTS

Ce dépôt utilise TypeScript et Vite.

## Instructions générales

- Exécuter `npm run lint` et `npm test` après toute modification de code source.
- Si la modification concerne uniquement la documentation ou les commentaires, ces vérifications peuvent être ignorées.
- Incrémenter le champ `version` de `package.json` lors de toute modification de code source.

## Commandes utiles

- `npm run dev` : lance l'environnement de développement local.
- `npm run build` : construit l'application pour la production.
- `npm test` : lance les tests unitaires.
- `npm run lint` : vérifie le linting du code.

## Structure fonctionnelle

- `src/app/` contient l'orchestrateur (`Application.ts`), les contrôleurs de
  caméra, les modules de rendu (`SceneContext`, `RouteVisuals`, `RiderInstances`),
  la passerelle worker (`SimulationBridge`) et les états partagés (`RouteState`,
  `SelectionState`).
- `src/domain/route/` regroupe le parsing GPX, la simplification et la spline.
- `src/domain/peloton/formation.ts` calcule la formation initiale du peloton.
- `src/physics/worker.ts` exécute la simulation Rapier et doit rester isolé des
  APIs navigateur.

