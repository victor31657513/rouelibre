# Benchmarks

## Normalisation des positions horizontales du corpus GPX Tour de France 2026

La chaîne canonique `parseGpxTrack` → `removeConsecutiveSameHorizontalGpxPoints` → distances → rapport de qualité traite 160 626 points source. Elle supprime 771 points : 770 doublons exacts et 1 point à altitude différente. Elle conserve 159 855 points. La longueur horizontale de chacune des 21 étapes reste exactement inchangée, comme le segment maximal du corpus.

Le corpus normalisé ne contient aucun segment horizontal nul et conserve les 82 sauts strictement supérieurs à 250 m avec leurs distances inchangées. Dans `tour-de-france-2026-etape-03-granollers-les-angles.gpx`, la règle conserve le premier point à latitude 41,87328°, longitude 2,28579° et altitude 621,5 m, et supprime le point source suivant à la même position et à 619 m. Elle ne crée ni coordonnée ni altitude.

## Référence numérique : distance horizontale GPX

Le calcul GPX emploie la formule de Haversine sur une Terre sphérique de rayon moyen `6 371 008,8 m`. Un degré de longitude à l’équateur produit `111 195,080233526 m` avec le code réel ; le test synthétique compare ce résultat à `R × pi / 180` avec une tolérance absolue de `10⁻⁸ m`.

Le même code appliqué au corpus fournit la référence suivante :

| Source GPX | Points | Longueur horizontale calculée |
| --- | ---: | ---: |
| `tour-de-france-2026-etape-01-barcelone-barcelone.gpx` | 917 | 19 418,59596934856 m |

Cette valeur est la longueur du tracé GPX dans le modèle sphérique choisi, et non la distance officielle de l’étape. Le test de corpus exige une égalité exacte entre deux exécutions déterministes ; il vérifie aussi les valeurs finies, non négatives et monotones, sans comparer la longueur à une référence officielle ni appliquer de tolérance à cette longueur réelle.

## Qualité géométrique du corpus GPX 2026

L’analyse déterministe utilise le seuil diagnostique explicite de `250 m`. Ce seuil sert uniquement à observer les segments strictement plus longs ; il ne prescrit aucune suppression ou correction. Les résultats produits par `analyzeGpxGeometryQuality` sur les 21 fichiers sont :

- points : `160 626` ;
- segments : `160 605` ;
- doublons consécutifs exacts : `770` ;
- segments horizontaux nuls : `771` ;
- sauts strictement supérieurs à 250 m : `82` ;
- segment le plus long : `747,3787552887879 m`, dans `tour-de-france-2026-etape-03-granollers-les-angles.gpx`, des indices `1265` à `1266`.

Toutes les étapes présentent au moins une des trois observations. Le segment maximal de chaque ligne est conservé sans arrondi dans le rapport ; son affichage ci-dessous reprend la valeur numérique complète produite par le code.

| Source GPX | Points | Doublons exacts | Segments nuls | Sauts > 250 m | Segment maximal (m) |
| --- | ---: | ---: | ---: | ---: | ---: |
| `tour-de-france-2026-etape-01-barcelone-barcelone.gpx` | 917 | 2 | 2 | 0 | 141,5448893888647 |
| `tour-de-france-2026-etape-02-tarragone-barcelone.gpx` | 7 297 | 7 | 7 | 11 | 591,6775588564633 |
| `tour-de-france-2026-etape-03-granollers-les-angles.gpx` | 6 748 | 5 | 6 | 31 | 747,3787552887879 |
| `tour-de-france-2026-etape-04-carcassonne-foix.gpx` | 10 501 | 28 | 28 | 1 | 267,6079793203098 |
| `tour-de-france-2026-etape-05-lannemezan-pau.gpx` | 5 689 | 34 | 34 | 12 | 437,68961918927016 |
| `tour-de-france-2026-etape-06-pau-gavarnie-gedre.gpx` | 9 803 | 39 | 39 | 1 | 283,70567224366096 |
| `tour-de-france-2026-etape-07-hagetmau-bordeaux.gpx` | 6 428 | 44 | 44 | 5 | 348,5585477855275 |
| `tour-de-france-2026-etape-08-perigueux-bergerac.gpx` | 7 816 | 113 | 113 | 1 | 291,07448426957126 |
| `tour-de-france-2026-etape-09-malemort-ussel.gpx` | 8 680 | 25 | 25 | 1 | 275,7804127262498 |
| `tour-de-france-2026-etape-10-aurillac-le-lioran.gpx` | 9 847 | 27 | 27 | 0 | 174,28894863668575 |
| `tour-de-france-2026-etape-11-vichy-nevers.gpx` | 6 750 | 38 | 38 | 0 | 204,43309093090647 |
| `tour-de-france-2026-etape-12-circuit-nevers-magny-cours-chalon-sur-saone.gpx` | 7 198 | 53 | 53 | 3 | 384,7252989420231 |
| `tour-de-france-2026-etape-13-dole-belfort.gpx` | 9 970 | 25 | 25 | 7 | 349,9333615231735 |
| `tour-de-france-2026-etape-14-mulhouse-le-markstein.gpx` | 9 253 | 48 | 48 | 0 | 239,82976896986656 |
| `tour-de-france-2026-etape-15-champagnole-plateau-de-solaison.gpx` | 10 515 | 42 | 42 | 1 | 258,4050682822126 |
| `tour-de-france-2026-etape-16-evian-les-bains-thonon-les-bains.gpx` | 1 613 | 16 | 16 | 0 | 111,50645011413326 |
| `tour-de-france-2026-etape-17-chambery-voiron.gpx` | 8 980 | 30 | 30 | 1 | 265,182548366065 |
| `tour-de-france-2026-etape-18-voiron-orcieres-merlette.gpx` | 10 023 | 41 | 41 | 1 | 285,37188916121704 |
| `tour-de-france-2026-etape-19-gap-alpe-d-huez.gpx` | 7 474 | 26 | 26 | 0 | 223,26317889431084 |
| `tour-de-france-2026-etape-20-le-bourg-d-oisans-alpe-d-huez.gpx` | 9 968 | 41 | 41 | 3 | 463,8151410822975 |
| `tour-de-france-2026-etape-21-thoiry-paris-champs-elysees.gpx` | 5 156 | 86 | 86 | 3 | 436,6878872924499 |

## Espacements et pentes brutes du corpus normalisé

La chaîne `parseGpxTrack` → `removeConsecutiveSameHorizontalGpxPoints` →
`computeGpxCumulativeDistances` → `analyzeGpxRawProfile` produit, sans arrondi
interne, les résultats agrégés suivants sur les 21 étapes :

- points : `159 855` ;
- segments : `159 834` ;
- longueur horizontale cumulée des étapes : `3 425 268,0713700126 m` ;
- segments montants : `73 625` ;
- segments descendants : `66 626` ;
- segments à altitude constante : `19 583` ;
- espacement horizontal moyen agrégé : `21,43015923627021 m`.

| Extremum | Fichier et indices normalisés | Espacement horizontal | Variation d'altitude | Pente brute |
| --- | --- | ---: | ---: | ---: |
| Espacement minimal | `tour-de-france-2026-etape-21-thoiry-paris-champs-elysees.gpx`, `4285` → `4286` | `0,7313561113696778 m` | `0 m` | `0` |
| Espacement maximal | `tour-de-france-2026-etape-03-granollers-les-angles.gpx`, `1263` → `1264` | `747,3787552887879 m` | `7,25 m` | `0,009700570090728083` |
| Pente brute minimale | `tour-de-france-2026-etape-17-chambery-voiron.gpx`, `5134` → `5135` | `20,99645791387593 m` | `-73,5 m` | `-3,500590447278541` |
| Pente brute maximale | `tour-de-france-2026-etape-15-champagnole-plateau-de-solaison.gpx`, `3993` → `3994` | `11,225355917282286 m` | `13 m` | `1,1580924556686452` |

L'espacement moyen agrégé est la longueur agrégée divisée par le nombre agrégé de
segments. La pente brute est le ratio exact de la variation d'altitude sur
l'espacement horizontal entre deux points GPX successifs. Les valeurs extrêmes
montrent qu'elle n'est pas directement adaptée à la simulation : ce rapport ne
corrige, ne filtre, ne lisse, ne rééchantillonne et ne limite aucune donnée.


## Distributions altimétriques diagnostiques du corpus normalisé

Le diagnostic public `analyzeGpxRawDistributions` s’applique après la chaîne canonique `parseGpxTrack` → `removeConsecutiveSameHorizontalGpxPoints` → `computeGpxCumulativeDistances`. Pour `N` observations triées, `p = 0` sélectionne l’indice 0 ; sinon le rang vaut `ceil((p / 100) × N)` et l’indice vaut `rang - 1`. Cette méthode empirique du rang supérieur ne réalise aucune interpolation : chaque percentile reste une observation source localisable.

La configuration explicite utilise les percentiles `0`, `0,1`, `1`, `5`, `25`, `50`, `75`, `95`, `99`, `99,9`, `100` ; les seuils d’espacement `25`, `50`, `100`, `250`, `500 m` ; les seuils de variation absolue d’altitude `1`, `2`, `5`, `10`, `20`, `50 m` ; et les seuils de valeur absolue de pente brute `0,05`, `0,10`, `0,20`, `0,50`, `1,00`. Un dépassement est strict : une égalité au seuil n’est pas comptée.

### Percentiles agrégés — Espacement horizontal

| Percentile | Valeur | Fichier, segment normalisé |
| ---: | ---: | --- |
| 0 | `0.731356111369678 m` | `tour-de-france-2026-etape-21-thoiry-paris-champs-elysees.gpx`, `4285` → `4286` |
| 0.1 | `0.783967787800066 m` | `tour-de-france-2026-etape-18-voiron-orcieres-merlette.gpx`, `1889` → `1890` |
| 1 | `1.86070797098364 m` | `tour-de-france-2026-etape-14-mulhouse-le-markstein.gpx`, `2055` → `2056` |
| 5 | `3.70165191848355 m` | `tour-de-france-2026-etape-07-hagetmau-bordeaux.gpx`, `979` → `980` |
| 25 | `8.9494787337826 m` | `tour-de-france-2026-etape-14-mulhouse-le-markstein.gpx`, `2438` → `2439` |
| 50 | `15.1383220533717 m` | `tour-de-france-2026-etape-04-carcassonne-foix.gpx`, `939` → `940` |
| 75 | `25.9575151287863 m` | `tour-de-france-2026-etape-02-tarragone-barcelone.gpx`, `1072` → `1073` |
| 95 | `59.4304003316647 m` | `tour-de-france-2026-etape-03-granollers-les-angles.gpx`, `3400` → `3401` |
| 99 | `108.528128978593 m` | `tour-de-france-2026-etape-07-hagetmau-bordeaux.gpx`, `4158` → `4159` |
| 99.9 | `216.096502857166 m` | `tour-de-france-2026-etape-05-lannemezan-pau.gpx`, `3893` → `3894` |
| 100 | `747.378755288788 m` | `tour-de-france-2026-etape-03-granollers-les-angles.gpx`, `1263` → `1264` |

### Percentiles agrégés — Variation d’altitude signée

| Percentile | Valeur | Fichier, segment normalisé |
| ---: | ---: | --- |
| 0 | `-93.4000000000001 m` | `tour-de-france-2026-etape-20-le-bourg-d-oisans-alpe-d-huez.gpx`, `8112` → `8113` |
| 0.1 | `-7.29999999999995 m` | `tour-de-france-2026-etape-18-voiron-orcieres-merlette.gpx`, `3995` → `3996` |
| 1 | `-3.59999999999997 m` | `tour-de-france-2026-etape-06-pau-gavarnie-gedre.gpx`, `2766` → `2767` |
| 5 | `-1.79999999999995 m` | `tour-de-france-2026-etape-06-pau-gavarnie-gedre.gpx`, `8423` → `8424` |
| 25 | `-0.400000000000091 m` | `tour-de-france-2026-etape-20-le-bourg-d-oisans-alpe-d-huez.gpx`, `7284` → `7285` |
| 50 | `0 m` | `tour-de-france-2026-etape-13-dole-belfort.gpx`, `9109` → `9110` |
| 75 | `0.5 m` | `tour-de-france-2026-etape-18-voiron-orcieres-merlette.gpx`, `4694` → `4695` |
| 95 | `2 m` | `tour-de-france-2026-etape-08-perigueux-bergerac.gpx`, `7521` → `7522` |
| 99 | `3.89999999999998 m` | `tour-de-france-2026-etape-14-mulhouse-le-markstein.gpx`, `1148` → `1149` |
| 99.9 | `7.5 m` | `tour-de-france-2026-etape-20-le-bourg-d-oisans-alpe-d-huez.gpx`, `1410` → `1411` |
| 100 | `107.1 m` | `tour-de-france-2026-etape-03-granollers-les-angles.gpx`, `2917` → `2918` |

### Percentiles agrégés — Variation absolue d’altitude

| Percentile | Valeur | Fichier, segment normalisé |
| ---: | ---: | --- |
| 0 | `0 m` | `tour-de-france-2026-etape-01-barcelone-barcelone.gpx`, `1` → `2` |
| 0.1 | `0 m` | `tour-de-france-2026-etape-01-barcelone-barcelone.gpx`, `268` → `269` |
| 1 | `0 m` | `tour-de-france-2026-etape-02-tarragone-barcelone.gpx`, `3380` → `3381` |
| 5 | `0 m` | `tour-de-france-2026-etape-08-perigueux-bergerac.gpx`, `1592` → `1593` |
| 25 | `0.199999999999989 m` | `tour-de-france-2026-etape-09-malemort-ussel.gpx`, `1048` → `1049` |
| 50 | `0.5 m` | `tour-de-france-2026-etape-08-perigueux-bergerac.gpx`, `1022` → `1023` |
| 75 | `1 m` | `tour-de-france-2026-etape-20-le-bourg-d-oisans-alpe-d-huez.gpx`, `4661` → `4662` |
| 95 | `2.60000000000014 m` | `tour-de-france-2026-etape-06-pau-gavarnie-gedre.gpx`, `5108` → `5109` |
| 99 | `4.70000000000005 m` | `tour-de-france-2026-etape-18-voiron-orcieres-merlette.gpx`, `8783` → `8784` |
| 99.9 | `9.25 m` | `tour-de-france-2026-etape-02-tarragone-barcelone.gpx`, `6572` → `6573` |
| 100 | `107.1 m` | `tour-de-france-2026-etape-03-granollers-les-angles.gpx`, `2917` → `2918` |

### Percentiles agrégés — Valeur absolue de pente brute

| Percentile | Valeur | Fichier, segment normalisé |
| ---: | ---: | --- |
| 0 | `0` | `tour-de-france-2026-etape-01-barcelone-barcelone.gpx`, `1` → `2` |
| 0.1 | `0` | `tour-de-france-2026-etape-01-barcelone-barcelone.gpx`, `268` → `269` |
| 1 | `0` | `tour-de-france-2026-etape-02-tarragone-barcelone.gpx`, `3380` → `3381` |
| 5 | `0` | `tour-de-france-2026-etape-08-perigueux-bergerac.gpx`, `1592` → `1593` |
| 25 | `0.0118613668168517` | `tour-de-france-2026-etape-18-voiron-orcieres-merlette.gpx`, `7539` → `7540` |
| 50 | `0.0321186510226732` | `tour-de-france-2026-etape-08-perigueux-bergerac.gpx`, `653` → `654` |
| 75 | `0.0647585410731171` | `tour-de-france-2026-etape-15-champagnole-plateau-de-solaison.gpx`, `10319` → `10320` |
| 95 | `0.140917969216188` | `tour-de-france-2026-etape-04-carcassonne-foix.gpx`, `7282` → `7283` |
| 99 | `0.256748561241057` | `tour-de-france-2026-etape-20-le-bourg-d-oisans-alpe-d-huez.gpx`, `7184` → `7185` |
| 99.9 | `0.545636702640709` | `tour-de-france-2026-etape-19-gap-alpe-d-huez.gpx`, `6876` → `6877` |
| 100 | `3.50059044727854` | `tour-de-france-2026-etape-17-chambery-voiron.gpx`, `5134` → `5135` |

### Dépassements agrégés — Espacement horizontal

| Seuil | Segments strictement supérieurs | Proportion | Première observation documentaire |
| ---: | ---: | ---: | --- |
| `25 m` | 42450 | `0.265588047599384` | `tour-de-france-2026-etape-01-barcelone-barcelone.gpx`, `7` → `8` (`49.1447363565778 m`) |
| `50 m` | 11842 | `0.0740893677190085` | `tour-de-france-2026-etape-01-barcelone-barcelone.gpx`, `8` → `9` (`65.6847218041054 m`) |
| `100 m` | 2130 | `0.0133263260632907` | `tour-de-france-2026-etape-01-barcelone-barcelone.gpx`, `9` → `10` (`101.039795247154 m`) |
| `250 m` | 82 | `0.000513032270981143` | `tour-de-france-2026-etape-02-tarragone-barcelone.gpx`, `350` → `351` (`495.198500129994 m`) |
| `500 m` | 10 | `6.25649110952613e-05` | `tour-de-france-2026-etape-02-tarragone-barcelone.gpx`, `355` → `356` (`591.677558856463 m`) |

### Dépassements agrégés — Variation absolue d’altitude

| Seuil | Segments strictement supérieurs | Proportion | Première observation documentaire |
| ---: | ---: | ---: | --- |
| `1 m` | 39602 | `0.247769560919454` | `tour-de-france-2026-etape-01-barcelone-barcelone.gpx`, `35` → `36` (`1.25 m`) |
| `2 m` | 13617 | `0.0851946394384174` | `tour-de-france-2026-etape-01-barcelone-barcelone.gpx`, `129` → `130` (`3 m`) |
| `5 m` | 1268 | `0.00793323072687914` | `tour-de-france-2026-etape-01-barcelone-barcelone.gpx`, `832` → `833` (`5.25 m`) |
| `10 m` | 132 | `0.00082585682645745` | `tour-de-france-2026-etape-02-tarragone-barcelone.gpx`, `1882` → `1883` (`14.75 m`) |
| `20 m` | 29 | `0.000181438242176258` | `tour-de-france-2026-etape-03-granollers-les-angles.gpx`, `2811` → `2812` (`59.1999999999999 m`) |
| `50 m` | 9 | `5.63084199857352e-05` | `tour-de-france-2026-etape-03-granollers-les-angles.gpx`, `2811` → `2812` (`59.1999999999999 m`) |

### Dépassements agrégés — Valeur absolue de pente brute

| Seuil | Segments strictement supérieurs | Proportion | Première observation documentaire |
| ---: | ---: | ---: | --- |
| `0.05` | 55112 | `0.344807738028204` | `tour-de-france-2026-etape-01-barcelone-barcelone.gpx`, `30` → `31` (`0.0623509725723542`) |
| `0.1` | 18181 | `0.113749264862295` | `tour-de-france-2026-etape-01-barcelone-barcelone.gpx`, `297` → `298` (`0.105992180672848`) |
| `0.2` | 3170 | `0.0198330768171978` | `tour-de-france-2026-etape-01-barcelone-barcelone.gpx`, `779` → `780` (`0.218109186464779`) |
| `0.5` | 219 | `0.00137017155298622` | `tour-de-france-2026-etape-02-tarragone-barcelone.gpx`, `335` → `336` (`0.994768396396803`) |
| `1` | 12 | `7.50778933143136e-05` | `tour-de-france-2026-etape-03-granollers-les-angles.gpx`, `1890` → `1891` (`1.20781813063215`) |

### Synthèse par étape — Espacements

| Étape | p50 | p95 | p99 | Maximum |
| --- | ---: | ---: | ---: | ---: |
| `tour-de-france-2026-etape-01-barcelone-barcelone.gpx` | `15.1852579133156 m` | `63.2965072459901 m` | `92.3859582303849 m` | `141.544889388865 m` |
| `tour-de-france-2026-etape-02-tarragone-barcelone.gpx` | `13.9820933101 m` | `77.2864324077054 m` | `138.178978542739 m` | `591.677558856463 m` |
| `tour-de-france-2026-etape-03-granollers-les-angles.gpx` | `18.5119577610603 m` | `95.990231950942 m` | `193.705046576695 m` | `747.378755288788 m` |
| `tour-de-france-2026-etape-04-carcassonne-foix.gpx` | `12.6571625358192 m` | `51.4084361024568 m` | `99.5089531915728 m` | `267.60797932031 m` |
| `tour-de-france-2026-etape-05-lannemezan-pau.gpx` | `19.1766352558843 m` | `88.0259965413716 m` | `162.866386229342 m` | `437.68961918927 m` |
| `tour-de-france-2026-etape-06-pau-gavarnie-gedre.gpx` | `13.135970206029 m` | `58.8336977716681 m` | `108.260206299485 m` | `283.705672243661 m` |
| `tour-de-france-2026-etape-07-hagetmau-bordeaux.gpx` | `20.2453576293483 m` | `79.1432133894123 m` | `133.639435476711 m` | `348.558547785527 m` |
| `tour-de-france-2026-etape-08-perigueux-bergerac.gpx` | `19.7380261719227 m` | `59.285629108228 m` | `102.166239053593 m` | `291.074484269571 m` |
| `tour-de-france-2026-etape-09-malemort-ussel.gpx` | `13.5211265518956 m` | `49.0253438860236 m` | `81.2658712973935 m` | `275.78041272625 m` |
| `tour-de-france-2026-etape-10-aurillac-le-lioran.gpx` | `14.156395322294 m` | `43.123037751182 m` | `65.7402394766541 m` | `174.288948636686 m` |
| `tour-de-france-2026-etape-11-vichy-nevers.gpx` | `20.3734572646645 m` | `67.8462980186232 m` | `103.482351388098 m` | `204.433090930906 m` |
| `tour-de-france-2026-etape-12-circuit-nevers-magny-cours-chalon-sur-saone.gpx` | `19.1512926811192 m` | `63.0501378160625 m` | `119.141650206293 m` | `384.725298942023 m` |
| `tour-de-france-2026-etape-13-dole-belfort.gpx` | `16.1383209948362 m` | `58.4446664994321 m` | `107.322687086809 m` | `349.933361523174 m` |
| `tour-de-france-2026-etape-14-mulhouse-le-markstein.gpx` | `14.2540950502953 m` | `45.1026276027696 m` | `76.062975209883 m` | `239.829768969867 m` |
| `tour-de-france-2026-etape-15-champagnole-plateau-de-solaison.gpx` | `14.6393509681802 m` | `43.7633801852789 m` | `69.4294046228879 m` | `258.405068282213 m` |
| `tour-de-france-2026-etape-16-evian-les-bains-thonon-les-bains.gpx` | `13.0922681633401 m` | `41.0468621317486 m` | `60.5898617197363 m` | `111.506450114133 m` |
| `tour-de-france-2026-etape-17-chambery-voiron.gpx` | `14.0028867337205 m` | `57.9102985838545 m` | `99.8435734724699 m` | `265.182548366065 m` |
| `tour-de-france-2026-etape-18-voiron-orcieres-merlette.gpx` | `14.5416864503932 m` | `52.5566918713448 m` | `91.3976361079694 m` | `285.371889161217 m` |
| `tour-de-france-2026-etape-19-gap-alpe-d-huez.gpx` | `13.3665953394957 m` | `48.0490469641863 m` | `85.3336236743489 m` | `223.263178894311 m` |
| `tour-de-france-2026-etape-20-le-bourg-d-oisans-alpe-d-huez.gpx` | `14.1144452125154 m` | `42.8175246713654 m` | `75.5521355289411 m` | `463.815141082297 m` |
| `tour-de-france-2026-etape-21-thoiry-paris-champs-elysees.gpx` | `14.291113960091 m` | `90.5607630648774 m` | `163.176279997948 m` | `436.68788729245 m` |

### Synthèse par étape — Variations absolues d’altitude

| Étape | p50 | p95 | p99 | Maximum |
| --- | ---: | ---: | ---: | ---: |
| `tour-de-france-2026-etape-01-barcelone-barcelone.gpx` | `0.25 m` | `1.75 m` | `2.75 m` | `5.25 m` |
| `tour-de-france-2026-etape-02-tarragone-barcelone.gpx` | `0.25 m` | `2.75 m` | `5.5 m` | `19.25 m` |
| `tour-de-france-2026-etape-03-granollers-les-angles.gpx` | `0.75 m` | `4 m` | `7.75 m` | `107.1 m` |
| `tour-de-france-2026-etape-04-carcassonne-foix.gpx` | `0.5 m` | `2.20000000000005 m` | `3.89999999999998 m` | `9.30000000000007 m` |
| `tour-de-france-2026-etape-05-lannemezan-pau.gpx` | `0.400000000000006 m` | `2.80000000000001 m` | `4.80000000000001 m` | `14 m` |
| `tour-de-france-2026-etape-06-pau-gavarnie-gedre.gpx` | `0.600000000000023 m` | `3.09999999999997 m` | `5.5 m` | `14.3 m` |
| `tour-de-france-2026-etape-07-hagetmau-bordeaux.gpx` | `0.200000000000003 m` | `1.5 m` | `2.8 m` | `6.4 m` |
| `tour-de-france-2026-etape-08-perigueux-bergerac.gpx` | `0.399999999999991 m` | `1.90000000000001 m` | `3.59999999999999 m` | `8.89999999999999 m` |
| `tour-de-france-2026-etape-09-malemort-ussel.gpx` | `0.5 m` | `2.39999999999998 m` | `4.10000000000002 m` | `8.70000000000005 m` |
| `tour-de-france-2026-etape-10-aurillac-le-lioran.gpx` | `0.600000000000023 m` | `2.60000000000002 m` | `4.10000000000002 m` | `8.79999999999995 m` |
| `tour-de-france-2026-etape-11-vichy-nevers.gpx` | `0.300000000000011 m` | `1.90000000000001 m` | `3.20000000000002 m` | `11.1 m` |
| `tour-de-france-2026-etape-12-circuit-nevers-magny-cours-chalon-sur-saone.gpx` | `0.399999999999977 m` | `2 m` | `4.19999999999999 m` | `15.2 m` |
| `tour-de-france-2026-etape-13-dole-belfort.gpx` | `0.400000000000006 m` | `2.09999999999991 m` | `3.40000000000001 m` | `14.1 m` |
| `tour-de-france-2026-etape-14-mulhouse-le-markstein.gpx` | `0.5 m` | `2.79999999999995 m` | `4.30000000000007 m` | `15.2 m` |
| `tour-de-france-2026-etape-15-champagnole-plateau-de-solaison.gpx` | `0.599999999999909 m` | `2.5 m` | `4.20000000000005 m` | `55.5 m` |
| `tour-de-france-2026-etape-16-evian-les-bains-thonon-les-bains.gpx` | `0.5 m` | `2.30000000000007 m` | `3.39999999999998 m` | `6 m` |
| `tour-de-france-2026-etape-17-chambery-voiron.gpx` | `0.400000000000034 m` | `2.40000000000003 m` | `4.40000000000009 m` | `73.5 m` |
| `tour-de-france-2026-etape-18-voiron-orcieres-merlette.gpx` | `0.5 m` | `2.5 m` | `4.10000000000002 m` | `9.60000000000002 m` |
| `tour-de-france-2026-etape-19-gap-alpe-d-huez.gpx` | `0.799999999999955 m` | `3.60000000000002 m` | `5.79999999999995 m` | `22.0999999999999 m` |
| `tour-de-france-2026-etape-20-le-bourg-d-oisans-alpe-d-huez.gpx` | `0.899999999999977 m` | `3.60000000000014 m` | `5.90000000000009 m` | `93.4000000000001 m` |
| `tour-de-france-2026-etape-21-thoiry-paris-champs-elysees.gpx` | `0.199999999999996 m` | `1.80000000000001 m` | `4.2 m` | `11.1 m` |

### Synthèse par étape — Valeurs absolues de pente brute

| Étape | p50 | p95 | p99 | Maximum |
| --- | ---: | ---: | ---: | ---: |
| `tour-de-france-2026-etape-01-barcelone-barcelone.gpx` | `0.00426782604857653` | `0.0842700901042973` | `0.134863288650867` | `0.298319933231027` |
| `tour-de-france-2026-etape-02-tarragone-barcelone.gpx` | `0.0230170497068689` | `0.128234517272557` | `0.207510786878418` | `0.994768396396803` |
| `tour-de-france-2026-etape-03-granollers-les-angles.gpx` | `0.0361678544202619` | `0.120036739854491` | `0.20802098299207` | `1.20781813063215` |
| `tour-de-france-2026-etape-04-carcassonne-foix.gpx` | `0.0369960069365696` | `0.137814733842878` | `0.243266464043418` | `0.632974625138381` |
| `tour-de-france-2026-etape-05-lannemezan-pau.gpx` | `0.0223909428857878` | `0.0972656539729894` | `0.131916995843825` | `0.277010175556474` |
| `tour-de-france-2026-etape-06-pau-gavarnie-gedre.gpx` | `0.0461050839449933` | `0.190007996469808` | `0.317756475660407` | `1.20713322371632` |
| `tour-de-france-2026-etape-07-hagetmau-bordeaux.gpx` | `0.0119393555900848` | `0.061483118856354` | `0.101878928072087` | `0.27009454138244` |
| `tour-de-france-2026-etape-08-perigueux-bergerac.gpx` | `0.0194522746132169` | `0.0977560969339058` | `0.172038347823561` | `0.449660182089764` |
| `tour-de-france-2026-etape-09-malemort-ussel.gpx` | `0.0383506795513019` | `0.12159387623364` | `0.174453417552839` | `0.382451977403676` |
| `tour-de-france-2026-etape-10-aurillac-le-lioran.gpx` | `0.0445108852858601` | `0.147391477426355` | `0.226139397935062` | `0.524918707769899` |
| `tour-de-france-2026-etape-11-vichy-nevers.gpx` | `0.0181521481053868` | `0.0720902462370117` | `0.112585678648328` | `0.370240076688796` |
| `tour-de-france-2026-etape-12-circuit-nevers-magny-cours-chalon-sur-saone.gpx` | `0.0213530739521867` | `0.0734385199504192` | `0.111309599844367` | `0.403164216819719` |
| `tour-de-france-2026-etape-13-dole-belfort.gpx` | `0.0256299286407323` | `0.10223074239239` | `0.165772315402464` | `0.519668844460233` |
| `tour-de-france-2026-etape-14-mulhouse-le-markstein.gpx` | `0.0432458642762872` | `0.142391852012398` | `0.218919775781369` | `0.520610534142035` |
| `tour-de-france-2026-etape-15-champagnole-plateau-de-solaison.gpx` | `0.0392390980625466` | `0.149201857802141` | `0.274309516236305` | `1.15809245566865` |
| `tour-de-france-2026-etape-16-evian-les-bains-thonon-les-bains.gpx` | `0.037882225162305` | `0.130341341200904` | `0.224830090900341` | `0.355286079774848` |
| `tour-de-france-2026-etape-17-chambery-voiron.gpx` | `0.0287037712938214` | `0.139114381233656` | `0.284354665327067` | `3.50059044727854` |
| `tour-de-france-2026-etape-18-voiron-orcieres-merlette.gpx` | `0.0387189031874485` | `0.145883884995412` | `0.243563644752127` | `0.643809363700935` |
| `tour-de-france-2026-etape-19-gap-alpe-d-huez.gpx` | `0.0586265844310507` | `0.25415633686593` | `0.537102421508482` | `0.930499685392915` |
| `tour-de-france-2026-etape-20-le-bourg-d-oisans-alpe-d-huez.gpx` | `0.0654816252222557` | `0.232324427288264` | `0.390235617248808` | `1.10445651240272` |
| `tour-de-france-2026-etape-21-thoiry-paris-champs-elysees.gpx` | `0.01399471031849` | `0.0786025913522119` | `0.138826974760361` | `0.48792284714767` |

Les queues principales sont localisées dans les tableaux agrégés : le maximum de variation absolue (`107,1 m`) appartient à l’étape 3, segment `2917` → `2918`, tandis que le maximum de pente absolue (`3,50059044727854`) appartient à l’étape 17, segment `5134` → `5135`. Les percentiles décrivent uniquement le corpus fourni et les seuils sont des repères diagnostiques. Aucune valeur ne constitue un paramètre de préparation altimétrique ; aucune donnée n’est filtrée, lissée, rééchantillonnée, corrigée, convertie ou autrement transformée.

## Corpus traçable des extrêmes altimétriques

Le [corpus des extrêmes altimétriques](ALTIMETRIC_EXTREMES_CORPUS.md) matérialise l’union des derniers dépassements diagnostiques : variation absolue strictement supérieure à `50 m` ou pente brute absolue strictement supérieure à `1`. Il contient `20` segments (`9` dans la première queue, `12` dans la seconde et `1` commun aux deux), leurs indices bruts et normalisés, leurs valeurs non arrondies et jusqu’à deux points de contexte de chaque côté. Le test dédié reconstruit exactement le fichier JSON depuis les 21 GPX bruts sans les modifier.

Le traitement s’exécute hors de la boucle de simulation. Pour `n` segments et `p` percentiles, il coûte `O(n log n + tn + p)` en temps pour `t` seuils et `p` percentiles (quatre tris et parcours ordonnés des seuils) et `O(n + p)` en mémoire. Les allocations principales sont le tableau d’observations de segments, quatre copies triées, puis les tableaux immuables de percentiles et de seuils ; aucune dépendance ni optimisation prématurée n’est introduite.

## Scénario de référence : coureur isolé sur route à pente constante

Le scénario de référence exécute le moteur longitudinal minimal pendant 7 200 s avec un pas de 0,5 s. Les vitesses reportées correspondent à l'état final, utilisé comme approximation de vitesse stabilisée pour ces paramètres.

Paramètres coureur-vélo :

| Paramètre | Valeur |
| --- | ---: |
| Masse coureur | 75 kg |
| Masse vélo | 8 kg |
| CdA | 0,32 m² |
| Coefficient de résistance au roulement | 0,004 |
| Rendement mécanique | 0,97 |
| Puissance maximale | 1 200 W |
| Force propulsive maximale | 200 N |

Paramètres environnement :

| Paramètre | Valeur |
| --- | ---: |
| Densité de l'air | 1,225 kg/m³ |
| Gravité | 9,80665 m/s² |
| Pente longitudinale par défaut | 0,00 (0 %) |
| Durée | 7 200 s |
| Pas de temps | 0,5 s |

Convention du vent : valeur positive pour un vent de face, valeur négative pour un vent arrière. Convention de pente : ratio sans unité, positif en montée, négatif en descente.

| Cas | Vent | Vitesse stabilisée | Vitesse stabilisée |
| --- | ---: | ---: | ---: |
| 200 W sans vent | 0 m/s | 9,411 m/s | 33,88 km/h |
| 250 W sans vent | 0 m/s | 10,220 m/s | 36,79 km/h |
| 300 W sans vent | 0 m/s | 10,923 m/s | 39,32 km/h |
| 250 W avec vent de face | +3 m/s | 8,418 m/s | 30,30 km/h |
| 250 W avec vent arrière | -3 m/s | 12,206 m/s | 43,94 km/h |


## Scénario de référence : pente longitudinale constante

Le scénario de pente utilise les mêmes paramètres, la même durée de 7 200 s et le même pas de 0,5 s que le scénario de référence. Les résultats proviennent d'une exécution reproductible du moteur avec `defaultSingleRiderProfile`, une puissance demandée de 250 W, un vent nul et les pentes indiquées.

| Cas | Vent | Pente moteur | Pente affichée | Vitesse finale | Vitesse finale | Force gravitationnelle |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 250 W descente constante | 0 m/s | -0,05 | -5 % | 16,327 m/s | 58,78 km/h | -40,647 N |
| 250 W sans vent | 0 m/s | 0,00 | 0 % | 10,220 m/s | 36,79 km/h | 0,000 N |
| 250 W montée constante | 0 m/s | 0,05 | +5 % | 4,974 m/s | 17,91 km/h | 40,647 N |

## Limites d'interprétation

Ces résultats valident uniquement le comportement numérique du modèle longitudinal à pente constante avec les paramètres indiqués. Ils ne constituent pas une validation physiologique ou aérodynamique complète.

## Scénario de référence : énergie CP/W' du coureur isolé

Le scénario énergétique de référence utilise la logique CP/W' sans validation physiologique universelle. Les valeurs constituent des paramètres numériques de projet.

Paramètres énergétiques :

| Paramètre | Valeur |
| --- | ---: |
| Puissance critique (CP) | 250 W |
| Réserve anaérobie W' | 20 000 J |
| Efficacité de récupération | 0,5 |

Résultats de référence pour des phases constantes :

| Scénario | Résultat attendu |
| --- | ---: |
| 60 s à 250 W, réserve initiale 20 000 J | 20 000 J |
| 60 s à 350 W, réserve initiale 20 000 J | 14 000 J |
| 200 s à 350 W, réserve initiale 20 000 J | 0 J |
| Pas suivant à 350 W avec réserve vide | 250 W produits |
| 60 s à 150 W, réserve initiale 0 J | 3 000 J |
| 120 s à 150 W, réserve initiale 0 J | 6 000 J |

Scénario combiné avec un pas de 1 s :

| Transition | Demande | Puissance produite | Réserve après transition |
| --- | ---: | ---: | ---: |
| Départ avec réserve pleine | 350 W | 350 W | 19 900 J après 1 s |
| Après 200 s d'effort au-dessus de CP | 350 W | 350 W | 0 J |
| Pas suivant avec réserve épuisée | 350 W | 250 W | 0 J |
| Après 60 s sous CP depuis réserve vide | 150 W | 150 W | 3 000 J |
| Reprise d'un effort au-dessus de CP pendant 30 s | 350 W | 350 W | 0 J |
| Pas suivant après la seconde exhaustion | 350 W | 250 W | 0 J |

Dans ce scénario combiné, l'effort à 350 W consomme 100 J/s au-dessus de CP. La phase à 150 W récupère 50 J/s avec une efficacité de 0,5. Après 60 s de récupération, 3 000 J permettent 30 s supplémentaires à 350 W avant une nouvelle limitation à CP.

## Scénario de référence : arrivée sur parcours précompilé converti

Le scénario d’intégration de `sim-core` et le laboratoire construisent les échantillons distance/altitude `(0 m, 0 m)`, `(200 m, 0 m)`, `(400 m, 10 m)`, `(600 m, 0 m)` et `(800 m, 0 m)`, puis convertissent une seule fois leur `PrecompiledCourse` en `LongitudinalCourse`. Ils utilisent le profil coureur-vélo de référence, une puissance demandée de 250 W, un vent nul, CP = 250 W, W′ initiale = 20 000 J, une efficacité de récupération de 0,5 et un pas fixe de `1 / 60 s`. Les quatre segments parcourus sont, dans l’ordre, 0 %, +5 %, -5 % et 0 %. Une limite explicite de 7 200 ticks empêche une boucle infinie. Les résultats proviennent du code réel et sont couverts par les tests numériques de `sim-core` et du laboratoire.

| Observable à l’arrivée | Valeur |
| --- | ---: |
| Distance finale | 800 m |
| Nombre de ticks | 5 741 |
| Temps simulé | 95,683333333329 s |
| Vitesse au tick d’arrivée | 11,292604288289 m/s |
| Puissance produite | 250 W |
| Réserve W′ | 20 000 J |
| Segments traversés | 0, 1, 2, 3 |
| État | Arrivé |

La détection intervient après le tick qui atteint ou dépasse la ligne. La distance est bornée à 800 m sans interpolation sous-tick ; l’horodatage a donc une erreur maximale d’un tick. La boucle s’arrête dès que la progression signale l’arrivée et n’exécute aucun pas physique supplémentaire. La résolution de pente s’effectue au début du tick en `O(log n)` par la recherche binaire sans allocation de la couche parcours ; le parcours et sa conversion restent hors de la boucle.
