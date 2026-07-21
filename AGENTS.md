# Instructions pour les agents

## Rôles et méthode de travail

- Victor orchestre le projet, teste les livraisons et arbitre les décisions.
- Codex analyse le dépôt, implémente les tâches, exécute les tests, met à jour la documentation et prépare les Pull Requests.
- ChatGPT examine les Pull Requests et rend un verdict.
- Codex ne poursuit pas spontanément vers la tâche ou la phase suivante.
- Une Pull Request traite un sujet principal.

## Priorités du projet

L'ordre de priorité est le suivant :

1. cohérence de la simulation ;
2. stabilité numérique ;
3. reproductibilité ;
4. observabilité et lisibilité ;
5. performances mesurées ;
6. qualité graphique.

Une évolution minimale, testable et réversible est préférable à un système complet prématuré.

## Travail préalable obligatoire

Avant une modification importante, Codex doit :

1. lire `AGENTS.md` ;
2. lire `docs/PROJECT_STATUS.md` ;
3. lire les documents concernés ;
4. inspecter l'architecture et le code existants ;
5. identifier les fichiers à modifier ;
6. vérifier la phase réelle ;
7. proposer la solution minimale testable ;
8. préserver les comportements non concernés ;
9. prévoir les tests et la documentation ;
10. signaler les risques et limites.

`docs/PROJECT_STATUS.md` est la référence pour l'état courant et la prochaine tâche.

## Architecture

Les frontières suivantes sont obligatoires : parcours, simulation physique, énergie, IA individuelle, IA d'équipe, rendu et interface utilisateur.

- `sim-core` ne dépend pas de React, Three.js, du DOM ou du navigateur.
- Le parcours et la physique restent dans des modules distincts.
- Le rendu n'est jamais la source de vérité et ne modifie pas directement l'état de simulation.
- React ne contient pas de logique métier.
- Rapier ne détermine pas la progression normale des coureurs ; il est réservé à de futurs besoins réels de collisions, obstacles ou chutes.

## Simulation

- Le moteur utilise un pas de temps fixe et reste déterministe.
- `Math.random()` ne doit pas être utilisé directement dans le moteur.
- Les unités SI sont utilisées et documentées.
- Configuration, état et logique restent séparés.
- Les constantes sont centralisées.
- Les simplifications sont documentées.
- Les états ne sont pas partiellement mutés lorsqu'une validation ou un calcul échoue.

## Développement

- Conserver TypeScript strict et éviter `any`.
- Préserver les comportements non concernés.
- Ne pas réécrire plusieurs systèmes dans une seule PR.
- Ne pas ajouter de technologie sans besoin précis et justification.
- Éviter les allocations répétées dans les boucles nombreuses.
- Profiler avant d'optimiser.
- Ne pas introduire de complexité liée au peloton avant qu'elle soit nécessaire.
- Ne pas introduire `SharedArrayBuffer` prématurément.

## Documentation

Toute PR modifiant un comportement, une équation, une architecture, un paramètre, une commande ou un benchmark met à jour les documents concernés dans la même PR.

Documents de référence :

- `README.md` ;
- `AGENTS.md` ;
- `docs/PROJECT_STATUS.md` ;
- `docs/ARCHITECTURE.md` ;
- `docs/SIMULATION_MODEL.md` ;
- `docs/ROADMAP.md` ;
- `docs/BENCHMARKS.md` ;
- `docs/decisions/`.

La documentation ne présente jamais comme existante une fonctionnalité seulement prévue.

## Contenu d'une Pull Request

La description d'une PR explique son objectif et son périmètre, présente les tests réellement exécutés et signale les limites importantes. Sa structure exacte n'est pas bloquante. Le modèle `.github/pull_request_template.md` reste une aide pour les descriptions rédigées manuellement, et les descriptions automatiques structurées en `Motivation` / `Description` / `Testing` sont acceptées.

ChatGPT compare la description au diff réel lors de l'audit. Codex ne fusionne pas une PR avant la validation explicite de ChatGPT. Les recommandations détaillées sont documentées dans `docs/PULL_REQUESTS.md`.
