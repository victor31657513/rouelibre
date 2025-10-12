# Roue Libre

Visualisation d'un peloton cycliste suivant une trace GPX rendue en 3D avec Three.js.
L'application charge un parcours, prépare un peloton initial et délègue la physique
à un worker Rapier avant d'animer les cyclistes autour d'une caméra suiveuse.

## Aperçu fonctionnel

1. L'utilisateur sélectionne un parcours depuis la liste générée dynamiquement.
2. Le `RouteLoader` télécharge le fichier GPX, le simplifie et calcule les métriques
   d'altitude.
3. `Application` construit la scène Three.js, instancie le peloton et initialise le
   worker physique via `SimulationBridge`.
4. Les positions renvoyées par le worker sont converties en matrices d'instance par
   `RiderInstances`, et la caméra stabilisée suit automatiquement le coureur sélectionné.

## Architecture applicative

```text
src/
├─ app/                # Orchestration de l'IHM et de la simulation
│  ├─ Application.ts   # Point d'entrée de l'application
│  ├─ camera/          # Contrôleurs de caméra (follow + interactions)
│  ├─ rendering/       # Contexte Three.js, route et cyclistes
│  ├─ route/           # Chargement GPX et UI de sélection
│  ├─ simulation/      # Pont avec le worker physique
│  ├─ state/           # États partagés (route, sélection)
│  └─ ui/              # Utilitaires UI (loader, contrôles)
├─ domain/
│  ├─ peloton/         # Génération du peloton initial
│  └─ route/           # Parsing GPX, simplification, spline
├─ physics/            # Worker Rapier et règles de déplacement
├─ systems/            # Utilitaires partagés (adhésion au sol)
└─ main.ts             # Bootstrap Vite → Application
```

### Flux principal

- `main.ts` importe `Application` et appelle `initialise()`.
- `Application` crée `SceneContext`, `RouteVisuals`, `SimulationBridge` et lie les
  contrôles UI (`PlaybackControls`, `LoaderOverlay`, `RouteListController`).
- À chaque frame active, `CameraController` met à jour la caméra et `SimulationBridge`
  demande un nouveau step physique; les résultats sont transmis à `RiderInstances`.

## Lancer le projet

```bash
npm install
npm run dev
```

Tests et linting :

```bash
npm run lint
npm test
```

## Étendre l'application

- **Nouveau format de parcours** : implémenter un nouveau loader dans `app/route`
  et le brancher dans `RouteLoader` en conservant l'API `LoadedRoute`.
- **Paramètres de simulation** : centraliser les constantes dans `app/config.ts`.
  Les contrôleurs y accèdent par import; ajouter un champ ne nécessite aucune
  modification dans le reste du code.
- **Caméra alternative** : créer un nouveau contrôleur dans `app/camera/` et
  l'injecter depuis `Application`.
- **UI additionnelle** : exploiter `PlaybackControls` pour étendre les boutons ou
  brancher des raccourcis via la méthode `bind`.

## Lexique rapide

- **RoutePoint** : `THREE.Vector3` positionnée le long du parcours projeté.
- **PathSpline** : Catmull-Rom spline utilisée par la physique et le rendu pour
  échantillonner la route.
- **SimulationBridge** : wrapper qui sérialise les messages à destination du worker
  Rapier (`physics/worker.ts`).
- **RiderInstances** : convertit l'état `[s, t, h, yaw]` du worker en matrices
  d'instances pour l'`InstancedMesh` Three.js.

## Navigation

- `public/gpx/` : ressources GPX consommées par la liste de parcours.
- `test/` : tests unitaires Vitest couvrant la projection route/rider.
- `ui-test.html` : page de démonstration pour DaisyUI (non connectée à la logique principale).
