# État du projet

## Phase actuelle

Roue libre est en phase de fondation technique, documentaire, physique minimale et énergétique minimale pour un coureur isolé.

## Existant

- Workspace pnpm minimal.
- Configuration TypeScript stricte partagée.
- Configuration Vitest via le package `sim-core`.
- Package `packages/sim-core` sans dépendance graphique, navigateur, DOM, React ou Three.js.
- Moteur longitudinal déterministe minimal pour un coureur isolé sur route plate.
- Distinction entre puissance demandée et puissance produite.
- Environnement longitudinal avec vent de face ou vent arrière.
- Modèle énergétique déterministe CP/W' pour un coureur isolé.
- Consommation de la réserve anaérobie au-dessus de CP et récupération sous CP.
- Limitation de la puissance produite lorsque la réserve anaérobie ne permet pas de soutenir la demande.
- Vérification CI pour l'installation, le typecheck et les tests sur Pull Request.
- Documentation du projet, du modèle physique longitudinal et du modèle énergétique minimal.

## Non existant

Le projet ne contient pas de pente, GPX, virages, position latérale, aspiration, intelligence artificielle, tactique, psychologie, rendu graphique, interface React, exécution Web Worker, moteur de corps rigides, collisions, adhérence, modèle physiologique complexe, courbes de puissance personnalisées, plusieurs réserves énergétiques, température, hydratation ou nutrition.

## Prochaine tâche unique

Créer un laboratoire visuel minimal permettant de piloter la puissance et le vent et d'observer la vitesse, la distance, les forces, la puissance produite et la réserve énergétique.
