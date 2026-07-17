# Benchmarks

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

## Scénario de référence : parcours segmenté

Le scénario exécute le contrôleur du laboratoire pendant 120 s avec un pas fixe de `1 / 60 s`, une puissance demandée de 250 W, un vent nul, CP = 250 W et une réserve W' initiale de 20 000 J. Le parcours comporte les segments 0 m : 0 %, 200 m : +5 %, 400 m : -5 % et 600 m : 0 %. La pente est résolue au début de chaque tick ; les valeurs proviennent de l’exécution du code réel et sont couvertes par un test numérique.

| Observable final | Valeur |
| --- | ---: |
| Distance | 1 060,509 m |
| Vitesse | 10,388276 m/s |
| Vitesse | 37,398 km/h |
| Segment actif | 4 / 4 |
| Pente active | 0,00 (0 %) |
| Réserve W' | 20 000 J |

La résolution binaire est en `O(log n)` et ne crée ni parcours, ni tableau, ni position d’observation dans la boucle physique. Son impact est négligeable pour un coureur et quatre segments ; aucune optimisation supplémentaire n’est engagée sans mesure.
