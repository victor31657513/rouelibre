# Simulation indépendante du rendu

## Statut

Accepté.

## Contexte

Le moteur doit rester testable et maintenable sans dépendre de l'interface ou des choix de rendu du laboratoire.

## Décision

Les frontières architecturales distinguent `sim-core`, le domaine de parcours lorsqu'il sera introduit, le contrôleur de laboratoire, le rendu et l'interface. Le rendu n'est pas la source de vérité et ne modifie pas directement l'état de simulation. `sim-core` ne dépend pas de React, Three.js, du DOM ou du navigateur.

Three.js, Rapier, Zustand et Web Worker sont reportés jusqu'à l'existence d'un besoin réel.

## Conséquences

La simulation peut être testée hors navigateur et les changements de rendu restent isolés du moteur. Cette séparation facilite la maintenance et permet de faire évoluer les adaptateurs sans introduire de dépendance graphique dans le noyau. Elle maintient volontairement un laboratoire minimal tant que les besoins concernés ne sont pas établis.

## Alternatives considérées

- Placer l'état et la logique de simulation dans les composants React.
- Utiliser le rendu comme état de référence.
- Ajouter dès le socle les dépendances de rendu, de physique, de stockage ou d'exécution asynchrone.

## Date ou référence de PR

Socle validé avant cette documentation ; état vérifié à la Pull Request #241.
