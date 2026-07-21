# Modèle de simulation

## Statut

Le modèle implémenté couvre la physique longitudinale minimale d'un coureur isolé sur route à pente longitudinale instantanée et un parcours segmenté minimal, ainsi qu’un modèle énergétique minimal CP/W'. La physique calcule l'évolution de la vitesse et de la distance à partir de la puissance produite, du profil coureur-vélo, de l'environnement et d'un pas de temps explicite. Le modèle énergétique limite la puissance produite à partir de la puissance demandée, de la puissance critique et de la réserve anaérobie.

## Normalisation GPX exacte

Entre le parsing et le calcul des distances, la normalisation conserve le premier point de chaque série puis supprime un point seulement si sa latitude, sa longitude et son altitude sont chacune égales avec l’opérateur `===` à celles du dernier point retenu. Les indices des points supprimés restent traçables dans l’ordre de la trace source. Cette règle n’emploie aucune tolérance et ne couvre donc ni les coordonnées proches, ni une position identique assortie d’une altitude différente.

## Normalisation GPX des positions horizontales

La passe canonique du corpus compare chaque point au dernier point retenu avec `===` sur `latitudeDegrees` et `longitudeDegrees`. Elle conserve le premier point de chaque série consécutive, avec son altitude source, et supprime les suivants même si leur altitude diffère. Cette convention déterministe ne détermine pas l’altitude réelle, ne calcule ni ne remplace une altitude et n’emploie aucune tolérance. Des positions identiques non consécutives restent distinctes. La normalisation exacte sur les trois valeurs reste disponible séparément.

## Unités

Le moteur utilise les unités SI :

- temps : seconde (`s`) ;
- distance : mètre (`m`) ;
- vitesse : mètre par seconde (`m/s`) ;
- accélération : mètre par seconde carrée (`m/s²`) ;
- masse : kilogramme (`kg`) ;
- puissance : watt (`W`) ;
- travail et énergie : joule (`J`) ;
- force : newton (`N`) ;
- densité de l'air : kilogramme par mètre cube (`kg/m³`) ;
- gravité : mètre par seconde carrée (`m/s²`) ;
- pente longitudinale : ratio sans unité (`dénivelé vertical / distance horizontale`) ;
- CdA : mètre carré (`m²`).

CP et W' représentent ici de la puissance et du travail mécaniques externes. Le rendement mécanique du profil physique reste appliqué ensuite par le moteur longitudinal pour calculer la puissance transmise à la roue.

## Paramètres par défaut physiques

Les paramètres de référence exposés par `defaultSingleRiderProfile` et `defaultLongitudinalEnvironment` sont :

| Paramètre | Valeur |
| --- | ---: |
| Masse coureur | 75 kg |
| Masse vélo | 8 kg |
| CdA | 0,32 m² |
| Coefficient de résistance au roulement | 0,004 |
| Rendement mécanique | 0,97 |
| Puissance maximale | 1 200 W |
| Force propulsive maximale | 200 N |
| Densité de l'air | 1,225 kg/m³ |
| Vent longitudinal | 0 m/s |
| Gravité | 9,80665 m/s² |
| Pente longitudinale | 0,00 |

## Profil énergétique CP/W'

`SingleRiderEnergyProfile` contient :

| Champ | Unité | Signification |
| --- | ---: | --- |
| `criticalPowerWatts` | W | puissance critique mécanique externe, strictement positive et inférieure ou égale à la puissance maximale physique |
| `anaerobicCapacityJoules` | J | capacité maximale de la réserve anaérobie W', positive ou nulle |
| `recoveryEfficiency` | sans unité | fraction de l'écart sous CP convertie en récupération, comprise entre 0 et 1 |

`SingleRiderEnergyState` contient la réserve restante, la puissance anaérobie du dernier pas, la puissance de récupération réellement stockée pendant le dernier pas après plafonnement par la capacité, et l'indicateur de limitation par épuisement de la réserve.

La réserve initiale créée par `createSingleRiderEnergyState` est pleine par défaut. Une réserve initiale explicite peut être fournie si elle est finie et comprise entre zéro et la capacité maximale.

## Puissance demandée et puissance produite

La puissance demandée est l'intention du pilote et reste stockée dans `SingleRiderState.requestedPowerWatts`. La puissance produite est la puissance mécanique externe réellement autorisée après bornage physique et énergétique, stockée dans `SingleRiderState.producedPowerWatts`.

Sans modèle énergétique, `stepSingleRider` conserve le comportement historique :

```text
P = min(max(P_demandee, 0), P_max)
```

Avec modèle énergétique, la puissance cible respecte d'abord la contrainte physique :

```text
P_cible = min(max(P_demandee, 0), P_max)
```

La logique CP/W' détermine ensuite `P_produite`, puis la physique longitudinale utilise cette puissance produite sans recalculer une autre limite énergétique. `computeSingleRiderForces` conserve l’usage historique de la puissance demandée bornée. `computeSingleRiderForcesAtPower` utilise une puissance produite explicite et permet d’obtenir les forces correspondant à une puissance déjà limitée, sans modifier temporairement l’état.

## Consommation au-dessus de CP

Lorsque la puissance cible dépasse CP :

```text
P_anaerobie_demandee = P_cible - CP
P_anaerobie_disponible = reserve / dt
P_produite = CP + min(P_anaerobie_demandee, P_anaerobie_disponible)
P_anaerobie = P_produite - CP
E_consommee = P_anaerobie * dt
reserve_suivante = max(0, reserve - E_consommee)
```

Si l'épuisement survient au milieu d'un pas, la puissance produite moyenne du pas est `CP + reserve / dt`. Par exemple, avec CP à 250 W, une demande de 350 W, une seconde de pas et 50 J disponibles, la puissance produite du pas est 300 W et la réserve atteint zéro.

## Récupération sous CP

Lorsque la puissance produite est inférieure à CP :

```text
P_recuperation = efficacite_recuperation * (CP - P_produite)
E_recuperee = P_recuperation * dt
reserve_suivante = min(capacite, reserve + E_recuperee_potentielle)
P_recuperation_appliquee = (reserve_suivante - reserve) / dt
```

À puissance exactement égale à CP, la réserve ne diminue pas et n'augmente pas. Un même pas ne combine pas consommation et récupération. `lastRecoveryPowerWatts` expose la récupération réellement appliquée à la réserve : si la réserve atteint sa capacité pendant le pas, cette valeur est inférieure à la récupération potentielle. Avec une capacité nulle, elle vaut zéro.

## Convention du vent

Le vent longitudinal est exprimé dans le repère de déplacement du coureur :

- valeur positive : vent de face ;
- valeur négative : vent arrière ;
- zéro : absence de vent longitudinal.

La vitesse relative de l'air est :

```text
v_air = v + v_vent
```

avec `v` la vitesse du coureur et `v_vent` le vent longitudinal.

## Convention de la pente

La pente longitudinale du moteur est `roadGrade`, un ratio sans unité :

```text
grade = dénivelé vertical / distance horizontale
```

Le laboratoire expose une valeur en pourcentage et la convertit à sa frontière :

```text
grade = gradePercent / 100
```

Convention : valeur positive pour une montée dans le sens de déplacement, valeur négative pour une descente, zéro pour un profil plat. L'angle physique de la route est calculé depuis ce ratio :

```text
theta = atan(grade)
```

Une pente de 5 % correspond donc à `grade = 0,05` et non à un angle de 5 degrés.

## Parcours précompilé à altitude échantillonnée

Un `PrecompiledCourse` est une configuration statique distincte de la simulation. Chaque `PrecompiledCourseSample` contient une `distanceMeters` depuis l’origine et une `altitudeMeters`, toutes deux en mètres. Il contient au moins deux échantillons ; la première distance vaut exactement 0, toutes les distances sont finies, positives ou nulles et strictement croissantes, et toutes les altitudes sont finies. Une altitude négative est valide pour représenter une zone sous le niveau de la mer. `totalLengthMeters` est la distance finie et strictement positive du dernier échantillon. La création valide l’entrée entière, la copie défensivement, puis gèle chaque échantillon, le tableau et le parcours.

La consultation à la distance exacte d’un échantillon retourne son altitude exacte. Entre deux échantillons, une recherche binaire détermine l’intervalle puis applique l’interpolation linéaire suivante :

```text
ratio = (distance - distance_debut) / (distance_fin - distance_debut)
altitude = altitude_debut + (altitude_fin - altitude_debut) × ratio
```

À partir de la longueur totale, la consultation retourne l’altitude du dernier échantillon. La pente d’un intervalle entre deux échantillons successifs est calculée directement, sans lissage ni filtrage :

```text
roadGrade = (altitude_fin - altitude_debut) / (distance_fin - distance_debut)
```

Les altitudes et distances étant exprimées en mètres, `roadGrade` est un ratio sans unité : une valeur positive désigne une montée, zéro une portion plate et une valeur négative une descente. L’intervalle `i` couvre `[distance_i, distance_i+1[` ; une frontière intérieure exacte sélectionne donc le nouvel intervalle. À la distance du dernier échantillon et au-delà, la consultation conserve la pente du dernier intervalle valide.

Une distance de consultation négative, infinie ou `NaN` est rejetée. La dérivation n’effectue ni lissage, ni estimation multi-échantillons, ni limitation artificielle. Le format ne décrit ni coordonnées GPS ni courbure ; sa pente n’est pas appliquée à la physique ou à la progression du coureur.

La conversion explicite vers `LongitudinalCourse` produit `n - 1` segments pour `n` échantillons. Chaque paire successive produit exactement un segment selon la formule suivante :

```text
startDistanceMeters_i = distance_i
roadGrade_i = (altitude_i+1 - altitude_i) / (distance_i+1 - distance_i)
```

Le dernier échantillon fournit uniquement la fin du dernier intervalle et `totalLengthMeters`, transféré à l’identique. Les frontières restent semi-ouvertes `[distance_i, distance_i+1[` et une frontière intérieure active le nouveau segment. Deux intervalles de même pente restent deux segments distincts : aucune fusion ou compression n’est effectuée. La conversion est pure et déterministe, puis `createLongitudinalCourse` assure la validation, la copie défensive et le gel de la sortie. Le scénario d’intégration de `sim-core` et le laboratoire consomment cette représentation convertie.

## Données GPX brutes

Le parseur GPX accepte le sous-ensemble GPX 1.1 suivant : une racine `gpx` de version 1.1, exactement un `trk`, exactement un `trkseg`, au moins deux `trkpt`, les attributs uniques `lat` et `lon` et exactement un `ele` par point. Les noms locaux avec namespace optionnel, la déclaration XML, les commentaires, les éléments supplémentaires et leurs sections CDATA opaques sont acceptés. Seuls les `trkpt` de l'unique `trkseg` alimentent le résultat ; les `wpt` et `rtept` sont ignorés. Les structures ambiguës ou mal formées, DOCTYPE, CDATA dans `ele` et entités dans les nombres obligatoires sont rejetés par `SyntaxError`. Le corpus de test couvre les 21 exports VisuGPX du Tour de France 2026.

`latitudeDegrees` et `longitudeDegrees` restent en degrés décimaux, respectivement dans `[-90, 90]` et `[-180, 180]`. Une coordonnée finie hors limites produit une `RangeError`. `altitudeMeters` est exprimée en mètres et doit être finie, sans borne artificielle. Ces points source profondément immuables ne subissent ni projection, ni normalisation, filtrage ou correction. Aucune distance, pente ou représentation `PrecompiledCourse` n’est calculée par le parseur.

## Distance horizontale cumulée des points GPX

`computeGpxCumulativeDistances` copie les points dans leur ordre documentaire et annote le premier avec `distanceMeters = 0`. Chaque point suivant reçoit la somme, en mètres, des distances horizontales des segments précédents. `totalLengthMeters` reprend exactement la distance du dernier point. Le résultat, son tableau et chaque point sont gelés ; aucun point source n’est supprimé, fusionné, déplacé ou muté. L’altitude en mètres est copiée sans modification mais ne participe pas au calcul : une différence d’altitude seule produit donc une distance horizontale nulle.

Chaque segment utilise une distance de grand cercle par la formule de Haversine sur une Terre sphérique simplifiée. Le rayon terrestre moyen unique vaut `R = 6 371 008,8 m`. Pour les latitudes `phi1`, `phi2` en radians, `deltaPhi = phi2 - phi1` et la différence de longitude `deltaLambda` normalisée dans `[-pi, pi]` :

```text
a = sin²(deltaPhi / 2)
  + cos(phi1) × cos(phi2) × sin²(deltaLambda / 2)
a_borne = min(1, max(0, a))
c = 2 × atan2(sqrt(a_borne), sqrt(1 - a_borne))
distanceMeters = R × c
```

La normalisation de `deltaLambda` sélectionne la traversée courte lors d’un passage de l’antiméridien. Le bornage de `a` protège les racines carrées près des cas limites numériques. Les segments sont additionnés dans l’ordre fixe, sans arrondi stocké ; les coordonnées identiques conservent deux points portant la même distance cumulée. Ce modèle ne représente pas un ellipsoïde terrestre, une projection cartographique ou une distance tridimensionnelle. Cette préparation est indépendante de `PrecompiledCourse` et s’exécute hors de la boucle physique.

## Rapport de qualité géométrique GPX

`analyzeGpxGeometryQuality` consomme une `DistanceAnnotatedGpxTrack` validée et parcourt une seule fois ses segments dans l’ordre documentaire. Le segment d’indice `i` relie les points `i - 1` et `i` ; sa distance horizontale est exclusivement `points[i].distanceMeters - points[i - 1].distanceMeters`. L’analyse ne recalcule donc pas Haversine, n’arrondit aucune distance et ne modifie ou ne copie aucun point.

Trois catégories sont observées :

- un doublon consécutif exact possède les mêmes `latitudeDegrees`, `longitudeDegrees` et `altitudeMeters` selon l’égalité numérique exacte, sans tolérance ;
- un segment horizontal nul possède une différence de distance cumulée exactement égale à zéro ; les doublons exacts peuvent donc être un sous-ensemble de cette catégorie, qui contient aussi une même position horizontale avec des altitudes différentes ;
- un saut possède une distance strictement supérieure à `jumpThresholdMeters`. Ce seuil fini et strictement positif est toujours fourni explicitement par l’appelant ; un segment égal au seuil n’est pas signalé.

Le seuil de saut est diagnostique : une observation ne déclare pas le point invalide et n’entraîne ni rejet, ni suppression, ni correction. Le rapport conserve les indices source, les distances non arrondies, la longueur totale existante et le premier segment maximal en cas d’égalité exacte. Le rapport, ses tableaux et chaque observation sont gelés profondément.

## Parcours longitudinal segmenté

Un `LongitudinalCourse` contient des segments immuables `{ startDistanceMeters, roadGrade }`. La distance de début est en mètres et la pente est un ratio sans unité. Le premier segment commence exactement à 0 m ; les débuts sont finis et strictement croissants. Le segment `i` couvre `[début_i, début_suivant[` : une frontière exacte sélectionne le nouveau segment. Le dernier segment se prolonge indéfiniment lorsqu’aucune longueur totale n’est définie. Une option explicite `totalLengthMeters`, finie, positive et strictement supérieure au début du dernier segment, définit une arrivée ; elle est immuable après création.

La fabrique `createFlatLongitudinalCourse` expose la configuration minimale : un unique segment de pente nulle commençant à l’origine 0 m et une longueur totale finie. Le bornage pur `clampLongitudinalCourseDistance` conserve la distance sur un parcours sans arrivée et retourne au plus `totalLengthMeters` sur un parcours fini.

Au début de chaque tick fixe, le contrôleur résout le segment depuis `distanceMeters`, copie sa pente dans `LongitudinalEnvironment.roadGrade`, puis appelle l’étape énergie et physique existante. Un franchissement pendant le tick utilise donc encore l’ancienne pente pendant ce tick ; la nouvelle pente s’applique au tick suivant. Avec `dt = 1 / 60 s`, le retard maximal est un tick. Pour un parcours fini, le contrôleur détecte à la fin d’un tick la première distance égale ou supérieure à la longueur totale, borne alors la distance à la ligne et fige temps, vitesse, énergie, forces, observables et commandes de puissance et de vent. Le passage vers un parcours sans longueur totale réactive ces commandes. Il ne découpe pas le tick : l’horodatage d’arrivée a une précision limitée à `1 / 60 s`, avec une erreur maximale d’un tick. Il n’existe pas d’interpolation sous-tick. Un parcours sans longueur totale ne produit pas d’état d’arrivée.

Le scénario d’intégration précompilé utilise les échantillons `(distance m, altitude m)` `(0, 0)`, `(200, 0)`, `(400, 10)`, `(600, 0)` et `(800, 0)`. La conversion donne successivement les pentes sans unité `0`, `+0,05`, `-0,05` et `0`. Le coureur utilise le profil physique de référence, une puissance demandée et une CP de 250 W, une W′ initiale et maximale de 20 000 J, une efficacité de récupération de 0,5, un vent de 0 m/s et `dt = 1 / 60 s`. À chaque tick, la pente est résolue par recherche binaire depuis la distance au début du tick, l’étape énergie puis physique est exécutée, la distance est bornée à 800 m et la progression est vérifiée. Le tick d’arrivée reste entier : le scénario n’interpole ni le temps, ni la distance, ni la pente à l’intérieur du tick.

Le parcours de démonstration du laboratoire utilise ces mêmes cinq échantillons distance/altitude de référence. Le `PrecompiledCourse` et sa conversion en `LongitudinalCourse` sont créés une fois à l’initialisation du module, jamais dans la boucle de ticks, lors d’un reset ou d’un changement de mode. Cette source de parcours ne modifie ni les équations physiques et énergétiques, ni la résolution de pente au début du tick, ni le retard maximal d’un tick aux frontières et à l’arrivée.

## Équations physiques longitudinales

La masse totale est :

```text
m = m_coureur + m_velo
```

La puissance à la roue tient compte du rendement mécanique :

```text
P_roue = P_produite * rendement
```

La force propulsive basse vitesse utilise une limite explicite :

```text
F_prop = min(P_roue / max(v, P_roue / F_prop_max), F_prop_max)
```

Si `P_roue` vaut zéro, `F_prop` vaut zéro. La traînée aérodynamique signée est :

```text
F_aero = 0,5 * rho * CdA * v_air * abs(v_air)
```

La force gravitationnelle longitudinale signée est :

```text
F_gravite = m * g * sin(theta)
```

Elle est positive en montée et s'oppose au déplacement ; elle est négative en descente et favorise le déplacement. La résistance au roulement utilise la force normale :

```text
F_rr = Crr * m * g * cos(theta)
```

À pente nulle, `theta = 0`, `F_gravite = 0` et `F_rr = Crr * m * g`. La force nette et l'accélération sont :

```text
F_net = F_prop - F_aero - F_rr - F_gravite
a = F_net / m
```

## Ordre d'exécution

`stepSingleRiderWithEnergy` exécute un pas combiné dans cet ordre :

1. validation du profil physique, du profil énergétique, de l'environnement, de l'état physique, de l'état énergétique et du pas temporel ;
2. calcul pur de `P_cible`, `P_produite`, de la réserve candidate et des observables énergétiques candidats ;
3. calcul pur du futur état physique à partir de `P_produite` ;
4. vérification des forces et états candidats finis et conformes aux invariants ;
5. commit des champs énergétiques ;
6. commit du temps, de la distance, de la vitesse, de l'accélération appliquée et de `producedPowerWatts`.

Les validations et calculs susceptibles d'échouer précèdent les mutations. Une entrée invalide, une force non finie ou un état candidat non fini lève une `RangeError` claire et ne modifie ni l'état physique ni l'état énergétique.

## Méthode d'intégration

Chaque pas utilise un pas temporel explicite `dt` strictement positif. La vitesse suivante est calculée par Euler explicite puis bornée à zéro. Le modèle ne permet pas au coureur de repartir en marche arrière :

```text
v_suivante = max(0, v + a * dt)
```

La distance longitudinale du coureur est portée par `SingleRiderState.distanceMeters` et sa vitesse par `SingleRiderState.speedMetersPerSecond`. La distance utilise la vitesse moyenne du pas, conformément à l’intégration trapézoïdale déjà employée par le moteur :

```text
distance_suivante = distance + ((v + v_suivante) / 2) * dt
```

Le temps simulé augmente de `dt`. L'accélération exposée correspond à l'accélération effectivement appliquée à la vitesse après bornage.

## Validation des entrées

Les contraintes minimales sont : masse coureur strictement positive, masse vélo positive ou nulle, masse totale strictement positive, CdA positif ou nul, coefficient de roulement positif ou nul, rendement mécanique entre 0 et 1, puissance maximale positive ou nulle, force propulsive maximale strictement positive, densité de l'air positive ou nulle, gravité strictement positive, vent fini, pente finie, état physique fini, temps, distance et vitesse non négatifs, puissance demandée finie, CP finie et strictement positive, CP inférieure ou égale à la puissance maximale physique, capacité W' finie et positive ou nulle, efficacité de récupération entre 0 et 1, réserve finie et comprise entre zéro et la capacité, observables énergétiques finis et `dt` strictement positif.

## Invariants couverts par les tests

Les tests vérifient :

- absence de `NaN` et d'infini ;
- réserve comprise entre zéro et sa capacité maximale ;
- puissance produite positive ou nulle ;
- puissance produite inférieure ou égale à la puissance demandée bornée et à la puissance maximale ;
- puissance produite égale à CP avec réserve vide et demande supérieure à CP ;
- aucune consommation sous CP ;
- aucune récupération au-dessus de CP ;
- aucune consommation et récupération simultanées ;
- déterminisme exact pour des entrées identiques ;
- cohérence entre pas de 1 s et pas de 0,5 s sur phases constantes alignées ;
- validation des entrées invalides sans mutation ;
- conservation des benchmarks physiques historiques de `stepSingleRider` ;
- rejet des forces non finies et des états candidats non finis sans mutation du pas combiné.

## Simplifications et limites

Le modèle énergétique CP/W' est minimal et déterministe. Il ne prétend pas valider une physiologie universelle. Il ne couvre pas plusieurs réserves énergétiques, les cinétiques physiologiques complexes, les courbes de puissance personnalisées, la température, l'hydratation, la nutrition, la fatigue neuromusculaire, la psychologie ou la tactique. Le modèle physique couvre une pente longitudinale instantanée, sans freinage. Le parcours segmenté ne consomme ni points GPX bruts, ni altitude, ni virages, ni chronométrage intermédiaire. Le format précompilé permet de stocker et consulter une altitude échantillonnée et la pente directe de ses intervalles : il ne couvre pas la conversion des coordonnées GPX, le calcul de distance GPS, la projection, le lissage ou l’application de cette pente, ni les virages. Le modèle ne couvre pas les virages, la position latérale, l'aspiration, les changements de posture, les pertes dépendantes de la transmission, l'adhérence, les collisions, l’intégration GPX à la simulation, l'intelligence artificielle, le rendu graphique ou l'exécution Web Worker.
