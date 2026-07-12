# Modèle de simulation

## Statut

Le modèle implémenté couvre la physique longitudinale minimale d'un coureur isolé sur route plate et un modèle énergétique CP/W' minimal. Il calcule l'évolution de la vitesse et de la distance à partir de la puissance, du profil coureur-vélo, de l'environnement et d'un pas de temps explicite. Le modèle énergétique limite la puissance produite lorsque la réserve anaérobie est insuffisante et récupère la réserve sous la puissance critique.

## Unités

Le moteur utilise les unités SI :

- temps : seconde (`s`) ;
- distance : mètre (`m`) ;
- vitesse : mètre par seconde (`m/s`) ;
- accélération : mètre par seconde carrée (`m/s²`) ;
- masse : kilogramme (`kg`) ;
- puissance : watt (`W`) ;
- énergie : joule (`J`) ;
- force : newton (`N`) ;
- densité de l'air : kilogramme par mètre cube (`kg/m³`) ;
- gravité : mètre par seconde carrée (`m/s²`) ;
- CdA : mètre carré (`m²`).

## Paramètres par défaut

Les paramètres de référence exposés par `defaultSingleRiderProfile`, `defaultSingleRiderEnergyProfile` et `defaultFlatRoadEnvironment` sont :

| Paramètre | Valeur |
| --- | ---: |
| Masse coureur | 75 kg |
| Masse vélo | 8 kg |
| CdA | 0,32 m² |
| Coefficient de résistance au roulement | 0,004 |
| Rendement mécanique | 0,97 |
| Puissance maximale physique | 1 200 W |
| Force propulsive maximale | 200 N |
| Puissance critique | 250 W |
| Capacité anaérobie | 20 000 J |
| Efficacité de récupération | 0,5 |
| Densité de l'air | 1,225 kg/m³ |
| Vent longitudinal | 0 m/s |
| Gravité | 9,80665 m/s² |

## Convention du vent

Le vent longitudinal est exprimé dans le repère de déplacement du coureur :

- valeur positive : vent de face ;
- valeur négative : vent arrière ;
- zéro : absence de vent longitudinal.

La vitesse relative de l'air est :

```text
v_air = v + v_vent
```

avec `v` la vitesse du coureur et `v_vent` le vent longitudinal. Une vitesse relative positive produit une traînée opposée au déplacement. Une vitesse relative négative représente un vent arrière plus rapide que le coureur et produit une force aérodynamique signée dans le sens du déplacement.

## Puissance demandée, produite et forces

`SingleRiderState.requestedPowerWatts` représente la puissance demandée par le contrôle de simulation. `SingleRiderState.producedPowerWatts` représente la puissance effectivement appliquée par le dernier pas physique ou énergétique.

`computeSingleRiderForces` utilise `state.requestedPowerWatts`, bornée dans `[0, profile.maxPowerWatts]`. Cette fonction décrit le comportement physique historique sans modèle énergétique.

`computeSingleRiderForcesAtPower` utilise la puissance fournie explicitement en argument, bornée dans `[0, profile.maxPowerWatts]`. Cette fonction permet de calculer les forces correspondant à la puissance réellement produite par le modèle énergétique, sans modifier temporairement l'état et sans construire un faux état.

`stepSingleRiderWithEnergy` calcule d'abord la puissance produite par le modèle énergétique, puis calcule les forces physiques avec cette puissance produite.

## Équations physiques

La masse totale est :

```text
m = m_coureur + m_velo
```

La puissance utilisée par le calcul de forces est bornée :

```text
P = min(max(P_source, 0), P_max)
```

`P_source` vaut la puissance demandée pour `computeSingleRiderForces` et la puissance explicite pour `computeSingleRiderForcesAtPower`.

La puissance à la roue tient compte du rendement mécanique :

```text
P_roue = P * rendement
```

La force propulsive basse vitesse utilise une limite explicite :

```text
F_prop = min(P_roue / max(v, P_roue / F_prop_max), F_prop_max)
```

Si `P_roue` vaut zéro, `F_prop` vaut zéro. La limite par défaut vaut 200 N. Avec le profil de référence de 83 kg, elle borne l'accélération propulsive initiale sous 3 m/s² en tenant compte de la résistance au roulement, tout en permettant un départ progressif depuis l'arrêt. Cette méthode évite la division par zéro, garantit des nombres finis et ne dépend pas d'un pas de temps caché.

La traînée aérodynamique signée est :

```text
F_aero = 0,5 * rho * CdA * v_air * abs(v_air)
```

La résistance au roulement sur route plate est :

```text
F_rr = Crr * m * g
```

Elle s'applique lorsque le coureur avance ou lorsqu'une force propulsive est produite. À l'arrêt sans puissance, elle vaut zéro pour éviter une accélération négative artificielle.

La force nette et l'accélération sont :

```text
F_net = F_prop - F_aero - F_rr
a = F_net / m
```

## Modèle énergétique CP/W'

La puissance critique `CP` est la puissance durable minimale du modèle. La réserve anaérobie `W'` fournit la partie de la demande située au-dessus de `CP` tant que de l'énergie est disponible.

Pour une demande au-dessus de `CP` :

```text
P_anaerobie_demandee = P_demandee - CP
P_anaerobie_disponible = reserve / dt
P_anaerobie = min(P_anaerobie_demandee, P_anaerobie_disponible)
P_produite = CP + P_anaerobie
reserve_suivante = reserve - P_anaerobie * dt
```

L'indicateur `isPowerLimitedByEnergy` vaut vrai lorsque la réserve disponible ne permet pas de fournir toute la puissance anaérobie demandée.

Pour une demande sous `CP`, la réserve récupère selon l'efficacité configurée et reste plafonnée à la capacité :

```text
P_recuperation_potentielle = (CP - P_demandee) * efficacite
reserve_suivante = min(capacite, reserve + P_recuperation_potentielle * dt)
P_recuperation_appliquee = (reserve_suivante - reserve) / dt
```

`SingleRiderEnergyState.lastRecoveryPowerWatts` représente la récupération réellement stockée pendant le dernier pas, après plafonnement par la capacité. Une réserve presque pleine peut donc exposer une récupération appliquée inférieure à la récupération potentielle. Une capacité nulle expose une récupération appliquée nulle.

## Méthode d'intégration

Chaque pas utilise un pas temporel explicite `dt` strictement positif. La vitesse suivante est calculée par Euler explicite puis bornée à zéro :

```text
v_suivante = max(0, v + a * dt)
```

La distance utilise la vitesse moyenne du pas :

```text
distance_suivante = distance + ((v + v_suivante) / 2) * dt
```

Le temps simulé augmente de `dt`.

L'accélération exposée dans `SingleRiderState.accelerationMetersPerSecondSquared` correspond à l'accélération effectivement appliquée à la vitesse après bornage :

```text
a_appliquee = (v_suivante - v) / dt
```

Cette définition rend l'état cohérent avec l'évolution observée de la vitesse. Un coureur immobile qui reste à vitesse nulle après bornage expose donc une accélération appliquée nulle, même si la somme théorique des forces pointe vers l'arrière.

## Atomicité et validation

Les données publiques sont validées avant mutation de l'état. Les contraintes minimales sont : masse coureur strictement positive, masse vélo positive ou nulle, masse totale strictement positive, CdA positif ou nul, coefficient de roulement positif ou nul, rendement mécanique entre 0 et 1, puissance maximale positive ou nulle, force propulsive maximale strictement positive, densité de l'air positive ou nulle, gravité strictement positive, vent fini, état physique fini, temps, distance et vitesse non négatifs, puissance demandée finie, paramètres énergétiques non négatifs, réserve comprise entre zéro et capacité, efficacité de récupération entre 0 et 1 et `dt` strictement positif.

Une entrée invalide lève une `RangeError` avec le nom du champ concerné avant toute mutation de l'état.

Les forces calculées, les candidats physiques et les candidats énergétiques sont vérifiés comme finis avant commit. `stepSingleRiderWithEnergy` applique l'état physique et l'état énergétique uniquement après validation complète des deux candidats. Une erreur numérique pendant le calcul des forces ou des candidats laisse les deux états strictement inchangés.

## Invariants couverts par les tests

Les tests vérifient :

- démarrage depuis l'arrêt sans `NaN` ni infini ;
- démarrage progressif à 60 Hz avec accélération initiale inférieure ou égale à 3 m/s² ;
- vitesse jamais négative ;
- distance non décroissante ;
- puissance produite plafonnée ;
- vitesse stabilisée plus élevée à 300 W qu'à 200 W ;
- effet cohérent du vent de face et du vent arrière ;
- décélération sans puissance ;
- déterminisme exact pour des entrées identiques ;
- validation des entrées invalides sans mutation ;
- vitesses stabilisées de référence avec tolérances explicites ;
- accélération appliquée cohérente avec la vitesse bornée ;
- valeurs finies sur simulation longue ;
- récupération réellement appliquée après plafonnement ;
- atomicité du pas couplé énergie/physique en cas d'erreur numérique ;
- forces explicites à la puissance réellement produite ;
- transition de vitesse après épuisement de la réserve anaérobie.

## Simplifications et limites

Le modèle ne couvre pas la pente, l'altitude, les virages, la position latérale, l'aspiration, les changements de posture, les pertes dépendantes de la transmission, le freinage, l'adhérence, les collisions, le GPX, l'intelligence artificielle, le rendu graphique ou l'exécution Web Worker.
