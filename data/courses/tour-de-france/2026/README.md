# Corpus GPX du Tour de France 2026

Ce répertoire contient les parcours des 21 étapes du Tour de France 2026.

Les fichiers du répertoire `raw/` sont des sources immuables et ne sont jamais réécrits. Les tests de `packages/sim-core` les analysent puis appliquent la suppression des positions horizontales consécutives exactement identiques uniquement dans une représentation interne, en conservant le premier point et son altitude, avant le calcul des distances. Les sources `raw` restent inchangées avant et après cette transformation. Les tests analysent ensuite de façon déterministe les segments horizontaux nuls et les sauts au-dessus d’un seuil diagnostique explicite.

Le fichier dérivé `altimetric-extremes.json` recense l’union dédupliquée des segments dont la variation absolue d’altitude dépasse strictement `20 m`, de ceux dont la pente brute absolue dépasse strictement `1`, et des observations aux percentiles `99`, `99,9` et `100` de ces deux distributions. Il conserve tous leurs motifs, leurs indices bruts et normalisés et leur voisinage source. Un test le reconstruit depuis les sources immuables. Ces critères sont diagnostiques et ne définissent aucune correction ni aucun paramètre de préparation.
