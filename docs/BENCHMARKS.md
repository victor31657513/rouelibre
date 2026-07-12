# Benchmarks

## Scénario de référence : coureur isolé sur route plate

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
| Durée | 7 200 s |
| Pas de temps | 0,5 s |

Convention du vent : valeur positive pour un vent de face, valeur négative pour un vent arrière.

| Cas | Vent | Vitesse stabilisée | Vitesse stabilisée |
| --- | ---: | ---: | ---: |
| 200 W sans vent | 0 m/s | 9,411 m/s | 33,88 km/h |
| 250 W sans vent | 0 m/s | 10,220 m/s | 36,79 km/h |
| 300 W sans vent | 0 m/s | 10,923 m/s | 39,32 km/h |
| 250 W avec vent de face | +3 m/s | 8,418 m/s | 30,30 km/h |
| 250 W avec vent arrière | -3 m/s | 12,206 m/s | 43,94 km/h |

## Limites d'interprétation

Ces résultats valident uniquement le comportement numérique du modèle longitudinal plat avec les paramètres indiqués. Ils ne constituent pas une validation physiologique ou aérodynamique complète.
