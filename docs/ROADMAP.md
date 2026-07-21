# Roadmap

## Fonctionnalités validées

- Fondation : workspace pnpm, TypeScript strict, Vitest et CI.
- Moteur déterministe d'un coureur isolé.
- Puissance, vitesse, vent longitudinal et énergie CP/W'.
- Laboratoire visuel minimal.
- Pente longitudinale constante.
- Parcours longitudinal segmenté à pente constante par segment avec longueur totale optionnelle et arrivée minimale.
- Format interne précompilé immuable à échantillons de distance et d’altitude, avec interpolation linéaire de l’altitude.
- Publication GitHub Pages.

## Prochaine tâche unique

Dériver une pente longitudinale déterministe depuis les échantillons du format précompilé, sans l’appliquer à la physique du coureur.

## Étapes futures

Les étapes suivantes seront découpées en tâches plus petites et ne seront pas engagées avant validation de l'étape précédente :

1. dérivation déterministe d’une pente longitudinale depuis le format précompilé, sans intégration physique ;
2. conversion explicite vers une représentation consommable par le moteur ;
3. import GPX vers ce format, altitude, pente variable et virages ;
4. pilotage autonome individuel ;
5. petit groupe et aspiration ;
6. équipe de 9 coureurs ;
7. plusieurs équipes ;
8. peloton complet d'environ 184 coureurs ;
9. psychologie, tactique et classements.
