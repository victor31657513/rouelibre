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
- Publication GitHub Pages.

## Prochaine tâche unique

Remplacer le parcours segmenté écrit manuellement du laboratoire par un `PrecompiledCourse` converti, sans changer les équations ni les résultats de référence.

## Étapes futures

Les étapes suivantes seront découpées en tâches plus petites et ne seront pas engagées avant validation de l'étape précédente :

1. remplacement du parcours segmenté écrit manuellement du laboratoire par un `PrecompiledCourse` converti, sans changer les équations ni les résultats de référence ;
2. import GPX vers ce format, altitude, pente variable et virages ;
3. pilotage autonome individuel ;
4. petit groupe et aspiration ;
5. équipe de 9 coureurs ;
6. plusieurs équipes ;
7. peloton complet d'environ 184 coureurs ;
8. psychologie, tactique et classements.
