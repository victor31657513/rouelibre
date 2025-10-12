# AGENTS

Ce dépôt utilise TypeScript et Vite.

## Instructions générales

- Exécuter `npm run lint` et `npm test` après toute modification de code source.
- Si la modification concerne uniquement la documentation ou les commentaires, ces vérifications peuvent être ignorées.
- Incrémenter le champ `version` de `package.json` lors de toute modification de code source.
- Préserver une logique de simulation minimaliste : aucun ralentissement par défaut lié aux courbes, les vitesses doivent découler uniquement de la trajectoire propre de chaque coureur et des contraintes locales (tenue de route, marges de sécurité), et les adaptations doivent rester généralisables.

## Architecture à respecter

- `src/app/` contient l'orchestrateur (`AppController`) et la configuration statique.
- `src/domain/` regroupe les modules métier par domaine (route, simulation, scène, caméra, état). Préserver cette organisation en cas d'ajout.
- `src/ui/` héberge les composants DOM légers.
- Les helpers hérités (`src/camera.ts`, `src/road.ts`) sont utilisés principalement par les tests : éviter d'y introduire des dépendances côté app.

## Commandes utiles

- `npm run dev` : lance l'environnement de développement local.
- `npm run build` : construit l'application pour la production.
- `npm test` : lance les tests unitaires.
- `npm run lint` : vérifie le linting du code.

## Principes de contribution

- Favoriser des ajustements globaux et une logique minimaliste dans la simulation afin de préserver la scalabilité et d'éviter la prolifération d'exceptions ponctuelles.

