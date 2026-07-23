# Corpus GPX du Tour de France 2026

Ce répertoire contient les parcours des 21 étapes du Tour de France 2026.

Les fichiers du répertoire `raw/` sont des sources immuables et ne sont jamais réécrits. Les tests de `packages/sim-core` les analysent puis appliquent la suppression des positions horizontales consécutives exactement identiques uniquement dans une représentation interne, en conservant le premier point et son altitude, avant le calcul des distances. Les sources `raw` restent inchangées avant et après cette transformation. Les tests analysent ensuite de façon déterministe les segments horizontaux nuls et les sauts au-dessus d’un seuil diagnostique explicite.

Le fichier dérivé `altimetric-extremes.json` recense, avec leurs indices bruts et normalisés et leur voisinage source, les segments dont la variation absolue d’altitude dépasse strictement `50 m` ou dont la pente brute absolue dépasse strictement `1`. Un test le reconstruit depuis les sources immuables. Ces critères sont diagnostiques et ne définissent aucune correction.
