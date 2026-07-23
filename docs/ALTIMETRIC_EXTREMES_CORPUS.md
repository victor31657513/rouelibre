# Corpus des extrêmes altimétriques GPX

## Objet et frontière

Le fichier versionné [`data/courses/tour-de-france/2026/altimetric-extremes.json`](../data/courses/tour-de-france/2026/altimetric-extremes.json) constitue un corpus de comparaison traçable. Il recense l’union des segments du diagnostic agrégé dont la variation absolue d’altitude est strictement supérieure à `50 m` ou dont la valeur absolue de pente brute est strictement supérieure à `1`. Ces deux bornes reprennent les derniers seuils diagnostiques de chaque distribution ; elles sélectionnent des cas à examiner et ne sont ni des seuils de correction ni des paramètres de préparation.

La chaîne source est exactement `parseGpxTrack` → `removeConsecutiveSameHorizontalGpxPoints` → `computeGpxCumulativeDistances`. Le corpus contient les valeurs numériques non arrondies produites par cette chaîne. Pour chaque cas, il conserve le fichier GPX relatif, les indices du segment dans la trace normalisée, les indices correspondants dans le fichier brut, les métriques du segment, ses deux extrémités et jusqu’à deux points normalisés de contexte de chaque côté. Les indices sont nuls et l’ordre des cas suit celui des fichiers puis des points source.

Le test de corpus reconstruit intégralement ce document depuis les 21 fichiers bruts et exige une égalité profonde. Les fichiers `raw/*.gpx` restent immuables. Le JSON ne prétend pas établir l’altitude réelle, qualifier automatiquement une observation d’erreur, ni prescrire un lissage, une correction, un rejet ou un rééchantillonnage.

## Couverture

L’union contient `20` segments répartis sur les étapes 3, 6, 15, 17 et 20 :

- `9` segments dépassent strictement `50 m` de variation absolue ;
- `12` segments dépassent strictement `1` en valeur absolue de pente brute ;
- le segment `5134` → `5135` de l’étape 17 appartient aux deux ensembles ;
- `11` cas ont une variation absolue inférieure ou égale à `50 m` mais une pente absolue supérieure à `1`, ce qui conserve des intervalles courts que la seule variation d’altitude ne révélerait pas ;
- `8` cas ont une pente absolue inférieure ou égale à `1` mais une variation absolue supérieure à `50 m`, ce qui conserve des intervalles plus longs que la seule pente ne révélerait pas.

## Examen documentaire des voisinages

Les voisinages montrent plusieurs formes distinctes qui devront rester représentées lors d’une comparaison ultérieure :

| Groupe source | Cas | Observation factuelle du contexte conservé |
| --- | --- | --- |
| Étape 3 | `1890` → `1891`, `6523` → `6524` | Deux intervalles très courts portent respectivement `-1 m` sur `0,8279 m` et `+2,25 m` sur `1,9793 m`; les altitudes voisines continuent dans le même sens ou restent stables. |
| Étape 3 | `2811` → `2812` | La hausse de `59,2 m` sur `199,12 m` est suivie d’une baisse de `46 m` sur le segment suivant. |
| Étape 3 | `2917` → `2919` | Le point `2918` à `761 m` relie une hausse de `107,1 m` puis une baisse de `67,4 m`; les quatre autres altitudes du contexte vont de `601,1 m` à `693,6 m`. |
| Étape 3 | `2949` → `2950` | La hausse de `70,1 m` sur `174,70 m` est suivie de baisses successives de `38,2 m` puis `48,8 m`. |
| Étape 6 | `8842` → `8846`, `8854` → `8855` | Quatre cas consécutifs appartiennent à une descente monotone de `784,9 m` à `754,7 m` sur environ `26,5 m`; un autre appartient à la remontée monotone qui suit. |
| Étape 15 | `3993` → `3994`, `3995` → `3996` | Une hausse courte de `13 m` précède un point à `818,4 m`, puis une baisse de `55,5 m` sur `180,97 m`. |
| Étape 17 | `5133` → `5136` | Une hausse de `64,2 m` sur un intervalle de `265,18 m` est suivie d’une baisse de `73,5 m` sur `21,00 m`, puis de `12,9 m` sur `6,38 m`. |
| Étape 20 | `7447` → `7448` | Le cas de pente appartient à une descente locale continue, après une baisse de `35,1 m` sur le segment antérieur. |
| Étape 20 | `8101` → `8102` | La hausse de `71,1 m` sur `299,75 m` se prolonge par une hausse de `28 m` sur le segment suivant. |
| Étape 20 | `8111` → `8113` | La baisse de `28 m` sur `25,35 m` précède une baisse de `93,4 m` sur `189,79 m`; la descente se poursuit dans les points suivants. |

Ces descriptions distinguent notamment les excursions locales, les séquences monotones très denses et les grandes variations sur intervalles plus longs. Elles restent des constats numériques sur les échantillons fournis. Une continuité apparente ne valide pas la pente réelle, et une inversion apparente ne démontre pas une erreur source.

## Usage futur et limites

Une stratégie candidate pourra être comparée sur les mêmes identifiants, extrémités et voisinages, puis rapporter explicitement les altitudes avant/après et leur provenance. La comparaison devra aussi couvrir des profils synthétiques et l’ensemble des invariants définis par la décision d’architecture 0007 : ce petit corpus extrême ne représente ni toutes les étapes, ni les pentes ordinaires, ni les extrémités de trace, ni les intervalles horizontaux longs à lui seul.

Aucun algorithme et aucun paramètre de préparation ne sont choisis dans ce document. Les seuils `50 m` et `1` restent exclusivement des critères reproductibles de constitution de ce corpus.
