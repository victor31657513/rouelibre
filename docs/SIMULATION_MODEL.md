# Modèle de simulation

## Statut

Le modèle implémenté couvre la physique longitudinale minimale d'un coureur isolé sur route plate et un modèle énergétique minimal CP/W'. La physique calcule l'évolution de la vitesse et de la distance à partir de la puissance produite, du profil coureur-vélo, de l'environnement et d'un pas de temps explicite. Le modèle énergétique limite la puissance produite à partir de la puissance demandée, de la puissance critique et de la réserve anaérobie.

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
- CdA : mètre carré (`m²`).

CP et W' représentent ici de la puissance et du travail mécaniques externes. Le rendement mécanique du profil physique reste appliqué ensuite par le moteur longitudinal pour calculer la puissance transmise à la roue.

## Paramètres par défaut physiques

Les paramètres de référence exposés par `defaultSingleRiderProfile` et `defaultFlatRoadEnvironment` sont :

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

## Profil énergétique CP/W'

`SingleRiderEnergyProfile` contient :

| Champ | Unité | Signification |
| --- | ---: | --- |
| `criticalPowerWatts` | W | puissance critique mécanique externe, strictement positive et inférieure ou égale à la puissance maximale physique |
| `anaerobicCapacityJoules` | J | capacité maximale de la réserve anaérobie W', positive ou nulle |
| `recoveryEfficiency` | sans unité | fraction de l'écart sous CP convertie en récupération, comprise entre 0 et 1 |

`SingleRiderEnergyState` contient la réserve restante, la puissance anaérobie du dernier pas, la puissance de récupération du dernier pas et l'indicateur de limitation par épuisement de la réserve.

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

La logique CP/W' détermine ensuite `P_produite`, puis la physique longitudinale utilise cette puissance produite sans recalculer une autre limite énergétique.

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
reserve_suivante = min(capacite, reserve + E_recuperee)
```

À puissance exactement égale à CP, la réserve ne diminue pas et n'augmente pas. Un même pas ne combine pas consommation et récupération.

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

La résistance au roulement sur route plate est :

```text
F_rr = Crr * m * g
```

La force nette et l'accélération sont :

```text
F_net = F_prop - F_aero - F_rr
a = F_net / m
```

## Ordre d'exécution

`stepSingleRiderWithEnergy` exécute un pas combiné dans cet ordre :

1. validation du profil physique, du profil énergétique, de l'environnement, de l'état physique, de l'état énergétique et du pas temporel ;
2. calcul de `P_cible` ;
3. calcul de la consommation ou récupération énergétique ;
4. calcul de `P_produite` ;
5. mise à jour de la réserve et des observables énergétiques ;
6. transmission de `P_produite` au moteur longitudinal ;
7. mise à jour du temps, de la distance, de la vitesse, de l'accélération appliquée et de `producedPowerWatts`.

Les validations et calculs susceptibles d'échouer précèdent les mutations. Une entrée invalide lève une `RangeError` claire et ne modifie ni l'état physique ni l'état énergétique.

## Méthode d'intégration

Chaque pas utilise un pas temporel explicite `dt` strictement positif. La vitesse suivante est calculée par Euler explicite puis bornée à zéro :

```text
v_suivante = max(0, v + a * dt)
```

La distance utilise la vitesse moyenne du pas :

```text
distance_suivante = distance + ((v + v_suivante) / 2) * dt
```

Le temps simulé augmente de `dt`. L'accélération exposée correspond à l'accélération effectivement appliquée à la vitesse après bornage.

## Validation des entrées

Les contraintes minimales sont : masse coureur strictement positive, masse vélo positive ou nulle, masse totale strictement positive, CdA positif ou nul, coefficient de roulement positif ou nul, rendement mécanique entre 0 et 1, puissance maximale positive ou nulle, force propulsive maximale strictement positive, densité de l'air positive ou nulle, gravité strictement positive, vent fini, état physique fini, temps, distance et vitesse non négatifs, puissance demandée finie, CP finie et strictement positive, CP inférieure ou égale à la puissance maximale physique, capacité W' finie et positive ou nulle, efficacité de récupération entre 0 et 1, réserve finie et comprise entre zéro et la capacité, observables énergétiques finis et `dt` strictement positif.

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
- conservation des benchmarks physiques historiques de `stepSingleRider`.

## Simplifications et limites

Le modèle énergétique CP/W' est minimal et déterministe. Il ne prétend pas valider une physiologie universelle. Il ne couvre pas plusieurs réserves énergétiques, les cinétiques physiologiques complexes, les courbes de puissance personnalisées, la température, l'hydratation, la nutrition, la fatigue neuromusculaire, la psychologie ou la tactique. Le modèle physique ne couvre pas la pente, l'altitude, les virages, la position latérale, l'aspiration, les changements de posture, les pertes dépendantes de la transmission, le freinage, l'adhérence, les collisions, le GPX, l'intelligence artificielle, le rendu graphique ou l'exécution Web Worker.
