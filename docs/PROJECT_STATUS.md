# État du projet

## Phase actuelle

Roue libre est en phase de fondation technique, documentaire et physique minimale.

## Existant

- Workspace pnpm minimal.
- Configuration TypeScript stricte partagée.
- Configuration Vitest via le package `sim-core`.
- Package `packages/sim-core` sans dépendance graphique, navigateur, DOM, React ou Three.js.
- Moteur longitudinal déterministe minimal pour un coureur isolé sur route plate.
- Vérification CI pour l'installation, le typecheck et les tests sur Pull Request.
- Documentation initiale du projet et du modèle physique longitudinal.

## Non existant

Le projet ne contient pas de modèle d'énergie, puissance critique, fatigue, récupération, pente, GPX, virages, position latérale, aspiration, intelligence artificielle, rendu graphique, exécution Web Worker ou moteur de corps rigides.

## Prochaine tâche unique

La prochaine tâche doit rester limitée à un seul sujet explicitement demandé. Le moteur longitudinal plat constitue le seul comportement de simulation cycliste implémenté et testé.
