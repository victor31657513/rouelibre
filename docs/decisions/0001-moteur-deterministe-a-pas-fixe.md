# Moteur déterministe à pas fixe

## Statut

Accepté.

## Contexte

Le socle doit produire des résultats reproductibles pour un même état initial et les mêmes entrées, indépendamment de la cadence de rendu du laboratoire.

## Décision

Le projet utilise un moteur cycliste spécifique à pas de temps fixe. Le moteur ne dépend pas du temps de rendu et n'utilise pas directement `Math.random()`.

Les multiplicateurs du laboratoire modifient le nombre de ticks exécutés ; ils ne modifient jamais `dt`.

## Conséquences

Les tests et les scénarios peuvent vérifier des résultats identiques à entrées identiques. La progression simulée reste découplée des variations de cadence des frames. Cette approche impose de traiter les ticks de manière contrôlée et ne modélise pas la variabilité aléatoire sans une source déterministe explicitement conçue à cet effet.

## Alternatives considérées

- Utiliser directement le temps écoulé entre les frames de rendu.
- Modifier `dt` pour accélérer le laboratoire.
- Utiliser `Math.random()` directement dans le moteur.

## Date ou référence de PR

Socle validé avant cette documentation ; état vérifié à la Pull Request #241.
