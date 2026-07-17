# Modèle de simulation

## Statut

Le modèle implémenté couvre la physique longitudinale minimale d'un coureur isolé sur route à pente longitudinale constante et un modèle énergétique minimal CP/W'. La physique calcule l'évolution de la vitesse et de la distance à partir de la puissance produite, du profil coureur-vélo, de l'environnement et d'un pas de temps explicite. Le modèle énergétique limite la puissance produite à partir de la puissance demandée, de la puissance critique et de la réserve anaérobie.

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

La distance utilise la vitesse moyenne du pas :

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

Le modèle énergétique CP/W' est minimal et déterministe. Il ne prétend pas valider une physiologie universelle. Il ne couvre pas plusieurs réserves énergétiques, les cinétiques physiologiques complexes, les courbes de puissance personnalisées, la température, l'hydratation, la nutrition, la fatigue neuromusculaire, la psychologie ou la tactique. Le modèle physique couvre une pente longitudinale constante, sans freinage et sans changement de pente selon la distance. Il ne couvre pas l'altitude issue d'un parcours, le profil variable, les virages, la position latérale, l'aspiration, les changements de posture, les pertes dépendantes de la transmission, l'adhérence, les collisions, le GPX, l'intelligence artificielle, le rendu graphique ou l'exécution Web Worker.
