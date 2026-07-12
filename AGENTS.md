# Instructions pour les agents

## Avant de modifier

- Lire `docs/PROJECT_STATUS.md` avant toute modification importante.
- Préserver les comportements non concernés.
- Ne pas poursuivre vers une phase suivante sans demande explicite.
- Une Pull Request doit traiter un sujet principal.

## TypeScript et tests

- Conserver TypeScript strict.
- Éviter `any`.
- Ajouter les tests et la documentation dans la même Pull Request que les changements.

## Simulation

- Utiliser les unités SI dans le moteur.
- Ne pas utiliser directement `Math.random()` dans la simulation.
- Ne pas faire dépendre `sim-core` de React, Three.js, du DOM ou du navigateur.

## Périmètre actuel

Le projet est en phase de fondation. Aucune fonctionnalité de simulation cycliste ne doit être présentée comme existante ou validée tant qu'elle n'est pas implémentée et testée dans une Pull Request dédiée.
