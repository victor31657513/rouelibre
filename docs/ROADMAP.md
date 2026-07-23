# Roadmap

## Fonctionnalités validées

- Fondation : workspace pnpm, TypeScript strict, Vitest et CI.
- Moteur déterministe d'un coureur isolé.
- Puissance, vitesse, vent longitudinal et énergie CP/W'.
- Laboratoire visuel minimal.
- Pente longitudinale constante.
- Parcours longitudinal segmenté à pente constante par segment avec longueur totale optionnelle et arrivée minimale.
- Normalisations internes des GPX : suppression exacte sur latitude, longitude et altitude toujours disponible, et passe canonique supprimant les positions horizontales consécutives exactement identiques en conservant le premier point et son altitude avant le calcul des distances.
- Format interne précompilé immuable à échantillons de distance et d’altitude, avec interpolation linéaire de l’altitude et dérivation déterministe de la pente de chaque intervalle.
- Conversion explicite du format précompilé vers un parcours longitudinal fini, avec conservation de chaque intervalle et de la longueur totale.
- Scénario déterministe de `sim-core` utilisant le parcours précompilé converti pour piloter la pente, la physique et l’énergie jusqu’à l’arrivée bornée.
- Laboratoire utilisant les échantillons distance/altitude de référence via un `PrecompiledCourse` converti une fois, sans coût de conversion dans la boucle de ticks.
- Publication GitHub Pages.
- Type de point GPX brut et parseur déterministe du sous-ensemble GPX 1.1 à une trace et un segment, validé contre les 21 exports VisuGPX bruts du Tour de France 2026, sans conversion de parcours.
- Distance horizontale cumulée déterministe des points GPX par Haversine sur une Terre sphérique, sans nettoyage, filtrage altimétrique, conversion de parcours ou intégration physique.
- Rapport déterministe et immuable de qualité géométrique des tracés GPX distancés : doublons consécutifs exacts, segments horizontaux nuls, sauts selon un seuil diagnostique explicite et premier segment maximal, sans nettoyage ni modification de point.
- Rapport déterministe et profondément immuable des espacements, variations d'altitude et pentes brutes du corpus GPX normalisé, avec extrema traçables et compteurs directionnels.
- Diagnostic déterministe et profondément immuable des distributions brutes, sur une étape ou plusieurs traces ordonnées : percentiles au rang supérieur, seuils diagnostiques explicites et observations source traçables, sans transformation des données.
- Corpus dérivé, reproductible et documenté des 20 segments dépassant les derniers seuils diagnostiques de variation absolue ou de pente brute, avec correspondance entre indices normalisés et bruts et voisinages source.
- Exigences de préparation altimétrique déterministe : géométrie horizontale conservée, voisinages exprimés en mètres, configuration explicite, sortie atomique et finie, traçabilité, rapport avant/après et comportement déclaré sur les intervalles longs, sans choix prématuré d'algorithme ou de seuil.

## Prochaine tâche unique

Choisir une stratégie minimale de préparation altimétrique à comparer sur le corpus traçable et les profils synthétiques, sans implémenter dans la même tâche la conversion vers le format précompilé.

## Étapes futures

Les étapes suivantes seront découpées en tâches plus petites et ne seront pas engagées avant validation de l'étape précédente :

1. choix puis implémentation, dans des tâches séparées, de la préparation altimétrique et de la conversion vers le format précompilé ;
2. pilotage autonome individuel ;
3. petit groupe et aspiration ;
4. équipe de 9 coureurs ;
5. plusieurs équipes ;
6. peloton complet d'environ 184 coureurs ;
7. psychologie, tactique et classements.
