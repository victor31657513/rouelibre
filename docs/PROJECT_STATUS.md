# État du projet

## Phase actuelle

Roue libre est en phase de fondation technique et documentaire.

## Existant

- Workspace pnpm minimal.
- Configuration TypeScript stricte partagée.
- Configuration Vitest via le package `sim-core`.
- Package `packages/sim-core` sans dépendance graphique, navigateur, DOM, React ou Three.js.
- Vérification CI pour l'installation, le typecheck et les tests sur Pull Request.
- Documentation initiale du projet.

## Non existant

Aucune fonctionnalité de simulation cycliste n'est implémentée, validée ou exposée. Le projet ne contient pas de modèle physique, énergie, intelligence artificielle, aspiration, import GPX, rendu graphique ou exécution Web Worker.

## Prochaine tâche unique

Implémenter le moteur déterministe minimal d'un coureur isolé sur route plate.
