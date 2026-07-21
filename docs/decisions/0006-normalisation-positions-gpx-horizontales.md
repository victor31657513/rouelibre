# Normalisation des positions GPX horizontales consécutives identiques

## Statut

Accepté.

## Contexte

Après la normalisation exacte validée par la PR 260, le corpus des 21 étapes du Tour de France 2026 conserve un segment horizontal nul dans `tour-de-france-2026-etape-03-granollers-les-angles.gpx`. Ses deux points ont exactement la latitude 41,87328° et la longitude 2,28579°, avec respectivement 621,5 m et 619 m d'altitude. Les points précédents portent des altitudes autour de 621,5 m (notamment 621,5 m) et les points suivants se poursuivent à 619 m.

## Décision

Une transformation pure de `ParsedGpxTrack` conserve le premier point de chaque série de points consécutifs dont `latitudeDegrees` et `longitudeDegrees` sont exactement égales avec `===`, puis supprime les suivants, quelle que soit leur altitude. Le premier point conserve son altitude source : cette convention déterministe ne calcule, n'estime et ne remplace aucune altitude réelle.

La règle n'emploie ni tolérance ni seuil de distance et ne concerne que les points consécutifs. L'ordre de tous les autres points est conservé. La représentation interne résultante est copiée et profondément immuable ; les fichiers GPX `raw` ne sont jamais modifiés.

Le rapport distingue les suppressions dont l'altitude est également égale avec `===` de celles dont l'altitude diffère, et conserve les indices de la `ParsedGpxTrack` source.

## Conséquences

La transformation s'exécute en une passe O(n) avant le calcul géodésique. Elle supprime 771 points du corpus, dont 770 doublons exacts et le point à 619 m de l'étape 3, et conserve 159 855 points. Aucun segment horizontal nul ne subsiste. Les longueurs horizontales, les sauts et le segment maximal restent inchangés.

## Alternatives considérées

- Conserver les deux points : rejeté, car le segment horizontal nul resterait présent.
- Conserver systématiquement le dernier : rejeté, car la convention retenue préserve le premier point documentaire.
- Faire une moyenne des altitudes : rejeté, car elle créerait une altitude absente de la source.
- Retenir systématiquement l'altitude minimale ou maximale : rejeté, car ce choix prétendrait corriger l'altitude sans fondement.
- Interpoler une nouvelle altitude : rejeté, car la règle n'est pas un filtrage altimétrique.
- Déplacer une coordonnée : rejeté, car la géométrie source ne doit pas être inventée.
- Supprimer des points seulement parce qu'ils sont proches : rejeté, car la proximité n'est pas l'égalité exacte.
- Employer un seuil de distance : rejeté, car cela introduirait une tolérance géométrique hors périmètre.

## Date ou référence de PR

Pull Request dédiée à la suppression des positions GPX horizontales consécutives identiques.
