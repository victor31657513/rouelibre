# Roue libre

Roue libre est un projet de simulation cycliste en phase de fondation technique, physique minimale, énergétique minimale et laboratoire visuel minimal pour un coureur isolé.

## État du projet

Le dépôt contient un moteur longitudinal déterministe pour un coureur isolé, un parcours longitudinal segmenté fini à pente constante par segment, un modèle énergétique minimal CP/W' et une application web de laboratoire destinée à observer ces modèles. Le laboratoire expose les modèles implémentés et testés ; il ne valide pas de fonctionnalité hors périmètre comme le GPX, les virages, l'aspiration ou plusieurs coureurs.

Consultez [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md) avant toute modification importante.

## Prérequis locaux

- Node.js 24 (`>=24 <25`)
- pnpm 10.28.1

## Installation

```bash
pnpm install
```

## Workspace

Le dépôt utilise un workspace pnpm avec TypeScript strict et Vitest.

Packages présents :

- `packages/sim-core` : moteur de simulation longitudinal et énergétique minimal, sans dépendance à React, Vite, Three.js, au DOM, au navigateur ou à une technologie graphique.
- `apps/lab` : laboratoire web Vite/React qui dépend de l'API publique de `@rouelibre/sim-core` pour piloter et observer un coureur isolé.

## Commandes

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm build
```

- `pnpm dev` lance le laboratoire visuel.
- `pnpm typecheck` vérifie le workspace en TypeScript strict.
- `pnpm test` exécute les tests du moteur, du contrôleur du laboratoire, de l'adaptateur temporel et des composants React.
- `pnpm build` produit le build de production du laboratoire.

## Laboratoire visuel

Le laboratoire permet de régler la puissance demandée de 0 à 1 200 W, le vent longitudinal de -10 à +10 m/s, la pente longitudinale constante de -20 % à +20 % dans le mode `Pente constante`, et de sélectionner un parcours segmenté fixe de 800 m (0 %, +5 %, -5 %, 0 % aux frontières 0, 200, 400 et 600 m), dont la ligne d’arrivée borne la distance et fige l’état au premier tick qui l’atteint ou la dépasse. Le laboratoire affiche la longueur, la distance restante, la progression et l’état d’arrivée ; le parcours à pente constante indique explicitement qu’il ne possède pas d’arrivée. Il permet de démarrer ou mettre en pause l'exécution, de réinitialiser le scénario et d'avancer exactement une seconde simulée lorsque l'exécution est en pause.

Le pas de simulation est fixe (`1 / 60 s`). Le sélecteur ×1, ×5 ou ×20 change uniquement le nombre de ticks exécutés par seconde réelle : en fonctionnement normal, ×20 exécute vingt secondes simulées par seconde réelle sans modifier `dt`. Le plafond de sécurité concerne le temps réel rattrapable après une frame longue avant application du multiplicateur, afin d'éviter un rattrapage illimité après un gel ou un onglet inactif. La réinitialisation remet le temps, la distance, la vitesse, l'accélération, la réserve W' et les observables du dernier pas à zéro ou à leur capacité maximale, tout en conservant la puissance, le vent, le mode de parcours et la pente constante sélectionnée pour répéter un scénario.

## Publication GitHub Pages

Le laboratoire web dispose d’un workflow GitHub Actions qui construit le workspace, vérifie TypeScript, exécute les tests, produit `apps/lab/dist` et publie cet artefact avec GitHub Pages depuis la branche `main`. Le workflow peut aussi être lancé manuellement avec `workflow_dispatch` lorsque la branche sélectionnée est `main`.

Le développement local conserve une base Vite `/`. Le workflow GitHub Pages définit `VITE_BASE_PATH` pendant le build : `/` pour un dépôt de type `<propriétaire>.github.io`, ou `/<nom-du-dépôt>/` pour un dépôt projet. L’URL GitHub Pages est indiquée par l’environnement GitHub `github-pages` lorsqu’un déploiement réussit.

Consultez [`docs/GITHUB_PAGES_DEPLOYMENT.md`](docs/GITHUB_PAGES_DEPLOYMENT.md) pour la configuration GitHub Pages, le dossier téléversé, la stratégie de base Vite et le diagnostic des échecs.

## Hors périmètre du socle actuel

Le dépôt ne contient pas de GPX, altitude issue d'un parcours, virages, position latérale, aspiration, plusieurs coureurs, intelligence artificielle, tactique, psychologie, Three.js, scène 3D, Zustand, Web Worker, moteur de corps rigides, collisions, adhérence, sons, sauvegarde, backend applicatif ou authentification.
