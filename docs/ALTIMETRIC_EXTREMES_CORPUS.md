# Corpus des extrêmes altimétriques GPX

## Objet et frontière

Le fichier versionné [`data/courses/tour-de-france/2026/altimetric-extremes.json`](../data/courses/tour-de-france/2026/altimetric-extremes.json) constitue un corpus diagnostique traçable. Il contient l’union dédupliquée :

- des segments dont la variation absolue d’altitude dépasse strictement `20 m` ;
- des segments dont la pente brute absolue dépasse strictement `1` ;
- des observations source aux percentiles `99`, `99,9` et `100` de chacune de ces deux distributions.

Les six observations de percentile constituent six motifs avant déduplication. Chaque segment ne figure qu’une fois et expose tous ses `selectionReasons` dans l’ordre canonique documenté par le manifeste.

La chaîne source est exactement `parseGpxTrack` → `removeConsecutiveSameHorizontalGpxPoints` → `computeGpxCumulativeDistances`. Le corpus conserve les valeurs non arrondies, les indices normalisés et bruts des extrémités, la direction, l’indicateur d’espacement strictement supérieur à `250 m` et jusqu’à deux points normalisés de contexte de chaque côté. Les indices sont indexés à partir de zéro. L’ordre des cas suit le fichier source, l’indice normalisé de départ puis celui d’arrivée.

Le test reconstruit intégralement le document depuis les 21 GPX, deux fois indépendamment, et exige une égalité profonde. Il vérifie aussi que les sources `raw/*.gpx` restent inchangées.

## Couverture

Les deux ensembles exhaustifs contiennent respectivement `29` et `12` segments. Leur intersection contient `2` segments et leur union `39`. Parmi les six observations de percentile, `4` segments ne figurent dans aucun ensemble de seuil ; le corpus fusionné contient donc `43` cas uniques.

La répartition est la suivante :

- direction : `20` montées et `23` descentes ;
- espacement horizontal strictement supérieur à `250 m` : `2` cas ;
- étapes : étape 2 (`1`), étape 3 (`12`), étape 6 (`5`), étape 15 (`5`), étape 17 (`4`), étape 18 (`1`), étape 19 (`2`) et étape 20 (`13`).

## Examen documentaire des voisinages

Les voisinages conservent les formes déjà observées : intervalles très courts à pente brute élevée, séquences monotones denses, variations importantes sur des intervalles longs et excursions locales suivies d’une variation opposée. Par exemple, le point `2918` de l’étape 3 relie une hausse de `107,1 m` à une baisse de `67,4 m`, tandis que le segment `5134` → `5135` de l’étape 17 porte une baisse de `73,5 m` sur environ `21,00 m`. Ces constats décrivent uniquement les échantillons fournis : ils ne valident pas une pente réelle et ne qualifient aucune observation d’erreur.

## Usage futur et limites

Les seuils `20 m` et `1` sont des critères diagnostiques reproductibles de constitution du corpus, et non des paramètres de préparation altimétrique. De même, les percentiles localisent des observations source sans prescrire leur traitement.

Le corpus permet une comparaison ultérieure sur des identifiants, extrémités et voisinages stables. Cette comparaison doit aussi couvrir les profils synthétiques et les invariants de la décision 0007. Aucun algorithme, fenêtre, résolution, correction, filtrage, lissage, rejet, rééchantillonnage ou paramètre de préparation n’est choisi ni évalué ici.
