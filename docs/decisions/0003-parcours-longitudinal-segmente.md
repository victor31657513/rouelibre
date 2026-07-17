# Parcours longitudinal segmenté

## Statut

Accepté.

## Contexte

La pente globale unique ne permet pas de faire évoluer la résistance gravitationnelle selon la distance parcourue, tout en conservant une physique qui reçoit seulement une pente instantanée.

## Décision

Le domaine `course` de `sim-core` représente un parcours par des segments immuables définis par leur distance de début et leur pente. Le premier commence à 0 m, les débuts sont strictement croissants et les intervalles sont semi-ouverts. Le dernier segment se prolonge indéfiniment.

Le contrôleur résout le segment par recherche binaire au début de chaque tick, copie sa pente dans `LongitudinalEnvironment.roadGrade`, puis appelle l’énergie et la physique sans modifier leurs équations. Il n’existe pas de longueur totale ni d’état d’arrivée dans cette décision.

## Conséquences

Le parcours reste indépendant de React, du DOM, du navigateur, de la physique et de l’énergie. La pente au franchissement d’une frontière pendant un tick est appliquée au tick suivant, soit un retard maximal d’un tick. La résolution n’alloue pas dans la boucle de ticks ; les objets de position sont réservés aux instantanés d’observation.

## Alternatives considérées

- Conserver une pente globale unique.
- Calculer la pente dans React.
- Découper dynamiquement les ticks au franchissement.
- Introduire immédiatement le GPX.

## Date ou référence de PR

Pull Request dédiée au parcours longitudinal segmenté.
