# Corpus GPX du Tour de France 2026

Ce répertoire contient les parcours des 21 étapes du Tour de France 2026.

Les fichiers du répertoire `raw/` sont des sources immuables et ne sont jamais réécrits. Les tests de `packages/sim-core` les analysent puis appliquent la suppression des doublons consécutifs exactement identiques uniquement à une représentation interne, avant le calcul des distances. Ils analysent ensuite de façon déterministe les segments horizontaux nuls et les sauts au-dessus d’un seuil diagnostique explicite.
