# État du projet

## Phase actuelle

Roue libre est en phase de fondation technique, documentaire, physique minimale, énergétique minimale et laboratoire visuel minimal pour un coureur isolé.

## Existant

- Workspace pnpm minimal.
- Configuration TypeScript stricte partagée.
- Configuration Vitest pour `sim-core` et le laboratoire.
- Package `packages/sim-core` sans dépendance graphique, navigateur, DOM, React ou Three.js.
- Moteur longitudinal déterministe minimal pour un coureur isolé sur route à pente constante.
- Pente longitudinale constante signée dans l'environnement physique, exprimée comme ratio sans unité, nulle par défaut.
- Distinction entre puissance demandée et puissance produite.
- Environnement longitudinal avec vent de face ou vent arrière.
- Modèle énergétique déterministe CP/W' pour un coureur isolé.
- Consommation de la réserve anaérobie au-dessus de CP et récupération sous CP.
- Limitation de la puissance produite lorsque la réserve anaérobie ne permet pas de soutenir la demande.
- Application `apps/lab` Vite/React permettant de piloter la puissance demandée, le vent longitudinal, la pente longitudinale constante, l'exécution, la pause, la réinitialisation et l'avance manuelle d'une seconde simulée.
- Contrôleur de laboratoire indépendant de React et du DOM, utilisant uniquement l'API publique de `@rouelibre/sim-core`.
- Adaptateur temporel navigateur à pas fixe `1 / 60 s` avec accumulateur, multiplicateurs ×1, ×5 et ×20, et plafonnement du temps réel rattrapable après une frame longue avant application du multiplicateur.
- Affichage des observables physiques, énergétiques, environnementales et des forces du coureur isolé, dont la force gravitationnelle longitudinale.
- Représentation visuelle minimale dérivée de la distance simulée et jauge W'.
- Vérification CI pour l'installation, le typecheck, les tests et le build sur Pull Request.
- Workflow GitHub Actions pouvant publier le build Vite du laboratoire sur GitHub Pages depuis `main`, après installation, typecheck, tests et build de production.
- Documentation du projet, de l'architecture, du modèle physique longitudinal, du modèle énergétique minimal, du laboratoire visuel et de la publication GitHub Pages.

## Limites

Le laboratoire observe le moteur existant et ne contient pas de nouvelle équation physique ou énergétique. La représentation visuelle est une aide d'observation dérivée de l'état simulé ; elle n'est pas une source de vérité. La réinitialisation conserve la puissance demandée, le vent et la pente pour faciliter la répétition d'un scénario.

## Non existant

Le projet ne contient pas de GPX, altitude issue d'un parcours, profil variable, virages, position latérale, aspiration, intelligence artificielle, tactique, psychologie, exécution Web Worker, moteur de corps rigides, collisions, adhérence, modèle physiologique complexe, courbes de puissance personnalisées, plusieurs réserves énergétiques, température, hydratation, nutrition, plusieurs coureurs, scène 3D, Three.js, Zustand, sons, sauvegarde, backend ou authentification.

## Prochaine tâche unique

Introduire un parcours longitudinal minimal composé de segments à pente constante, sans GPX ni virages.
