# Corpus GPX du Tour de France 2026

Ce répertoire contient les parcours des 21 étapes du Tour de France 2026.

Les tests de `packages/sim-core` lisent les fichiers bruts, conservent tous les points dans leur ordre documentaire, calculent leurs distances horizontales puis analysent de façon déterministe les doublons consécutifs exacts, les segments horizontaux nuls et les sauts au-dessus d’un seuil diagnostique explicite. Cette couverture observe les données source ; elle ne constitue ni un nettoyage, ni une correction des fichiers GPX.
