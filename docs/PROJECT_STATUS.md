# État du projet

## Phase actuelle

Roue libre est en phase de fondation technique, documentaire, physique minimale et énergétique minimale.

## Existant

- Workspace pnpm minimal.
- Configuration TypeScript stricte partagée.
- Configuration Vitest via le package `sim-core`.
- Package `packages/sim-core` sans dépendance graphique, navigateur, DOM, React ou Three.js.
- Moteur longitudinal déterministe minimal pour un coureur isolé sur route plate.
- Modèle énergétique minimal CP/W' pour un coureur isolé avec réserve anaérobie, limitation de puissance et récupération plafonnée.
- Pas couplé énergie/physique atomique : les états physique et énergétique sont appliqués uniquement après validation complète des candidats.
- Vérification CI pour l'installation, le typecheck et les tests sur Pull Request.
- Documentation initiale du projet, du modèle physique longitudinal et du modèle énergétique minimal.

## Non existant

Le projet ne contient pas de pente, GPX, virages, position latérale, aspiration, intelligence artificielle, rendu graphique, exécution Web Worker ou moteur de corps rigides.

## Prochaine tâche unique

Implémenter le laboratoire visuel minimal sans ajouter de fonctionnalité de simulation au-delà du modèle physique et énergétique existant.
