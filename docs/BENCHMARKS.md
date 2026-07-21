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
