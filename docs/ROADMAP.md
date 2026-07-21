# Roadmap

## Fonctionnalités validées

- Fondation : workspace pnpm, TypeScript strict, Vitest et CI.
- Moteur déterministe d'un coureur isolé.
- Puissance, vitesse, vent longitudinal et énergie CP/W'.
- Laboratoire visuel minimal.
- Pente longitudinale constante.
- Parcours longitudinal segmenté à pente constante par segment avec longueur totale optionnelle et arrivée minimale.
- Format interne précompilé immuable à échantillons de distance et d’altitude, avec interpolation linéaire de l’altitude et dérivation déterministe de la pente de chaque intervalle.
- Conversion explicite du format précompilé vers un parcours longitudinal fini, avec conservation de chaque intervalle et de la longueur totale.
- Scénario déterministe de `sim-core` utilisant le parcours précompilé converti pour piloter la pente, la physique et l’énergie jusqu’à l’arrivée bornée.
- Laboratoire utilisant les échantillons distance/altitude de référence via un `PrecompiledCourse` converti une fois, sans coût de conversion dans la boucle de ticks.
- Publication GitHub Pages.
- Type de point GPX brut et parseur déterministe du sous-ensemble GPX 1.1 à une trace et un segment, validé contre les 21 exports VisuGPX bruts du Tour de France 2026, sans conversion de parcours.
- Distance horizontale cumulée déterministe des points GPX par Haversine sur une Terre sphérique, sans nettoyage, filtrage altimétrique, conversion de parcours ou intégration physique.
- Rapport déterministe et immuable de qualité géométrique des tracés GPX distancés : doublons consécutifs exacts, segments horizontaux nuls, sauts selon un seuil diagnostique explicite et premier segment maximal, sans nettoyage ni modification de point.

## Prochaine tâche unique

Arbitrer, à partir du rapport de qualité géométrique validé, la première règle minimale de normalisation GPX. Aucun nettoyage ne doit être implémenté avant cet arbitrage.

## Étapes futures

Les étapes suivantes seront découpées en tâches plus petites et ne seront pas engagées avant validation de l'étape précédente :

1. arbitrage de la première règle minimale de normalisation GPX à partir du rapport validé, sans nettoyage avant décision ;
2. conversion ultérieure des points GPX vers le format précompilé, altitude, pente variable et virages ;
3. pilotage autonome individuel ;
4. petit groupe et aspiration ;
5. équipe de 9 coureurs ;
6. plusieurs équipes ;
7. peloton complet d'environ 184 coureurs ;
8. psychologie, tactique et classements.
