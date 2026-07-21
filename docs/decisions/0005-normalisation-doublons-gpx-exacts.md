# Normalisation des doublons GPX consécutifs exacts

## Statut

Accepté.

## Contexte

Le rapport déterministe du corpus des 21 étapes du Tour de France 2026 observe 770 doublons consécutifs ayant exactement les mêmes latitude, longitude et altitude parmi 160 626 points.

## Décision

Une transformation pure intervient sur `ParsedGpxTrack` avant le calcul des distances. Elle conserve le premier point, puis compare chaque point source au dernier point retenu avec `===` sur `latitudeDegrees`, `longitudeDegrees` et `altitudeMeters`. Elle supprime le point si, et seulement si, les trois égalités sont vraies. Aucune tolérance numérique, aucun arrondi et aucun seuil ne s’appliquent. Le premier point de chaque série est conservé.

La transformation copie et gèle la trace résultante, conserve l’ordre de tous les autres points et rapporte dans l’ordre documentaire les indices source supprimés. Les fichiers GPX raw restent immuables : la normalisation produit uniquement une représentation interne.

## Conséquences

Les 770 points redondants disparaissent avant la géodésie. Leur suppression conserve la géométrie horizontale et la longueur exacte de chaque trace. La transformation est déterministe, en une passe O(n), et indépendante des distances cumulées, de la physique et du laboratoire.

Le segment horizontal nul dont les altitudes diffèrent et les 82 sauts supérieurs à 250 m restent présents.

## Alternatives considérées

- Supprimer tous les segments horizontaux nuls : rejeté, car une altitude différente exige un arbitrage distinct.
- Supprimer les points proches ou appliquer un seuil de distance : rejeté, car cela introduirait une tolérance géométrique.
- Corriger les sauts : rejeté, car le seuil de 250 m reste diagnostique.
- Filtrer ou rééchantillonner la trace : rejeté, car cela modifierait d’autres points et la géométrie source.

## Date ou référence de PR

Pull Request #260 dédiée à la suppression des doublons GPX consécutifs exacts.
