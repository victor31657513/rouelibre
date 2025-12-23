# Roue libre

Simulation WebGL d'un peloton cycliste suivant des traces GPX.

> La logique de simulation privilégie des règles globales et minimalistes pour rester facilement extensible et limiter les correctifs ponctuels.
> Chaque coureur gère sa vitesse à partir de sa propre trajectoire, sans pénalité automatique en virage : seules la tenue de route, les marges de sécurité et l'adaptation individuelle des trajectoires peuvent influer sur le rythme.

## Démarrage rapide

1. Installer les dépendances : `npm install`
2. Lancer le serveur de développement : `npm run dev`
3. Ouvrir le navigateur sur l'URL indiquée (par défaut `http://localhost:5173`).
4. Exécuter le lint et les tests avant toute livraison :
   - `npm run lint`
   - `npm test`

Pour créer un build de production : `npm run build` puis `npm run preview` pour vérifier le résultat.

## Structure fonctionnelle

```
src/
├─ app/                → orchestration, AppController, configuration statique
├─ domain/
│  ├─ camera/          → caméra de suivi stabilisée et rig utilisateur
│  ├─ route/           → parsing GPX, traitement des trajectoires, géométrie de route
│  ├─ scene/           → création de la scène Three.js et projection sur la route
│  ├─ simulation/
│  │  ├─ physics/      → worker Rapier et règles de déplacement
│  │  ├─ peloton.ts    → génération de la grille de départ
│  │  └─ SimulationClient.ts / PelotonSceneUpdater.ts
│  └─ state/           → état global minimal (sélection du coureur)
├─ ui/                 → composants DOM (liste des parcours)
├─ camera.ts           → utilitaire de caméra legacy utilisé par les tests unitaires
├─ road.ts             → helpers simples de validation de position
└─ main.ts             → bootstrap de l'application
```

Flux principal :

1. `main.ts` instancie `AppController`.
2. `AppController` construit la scène via `createSceneContext`, attache les événements UI et prépare `SimulationClient`.
3. Lors de la sélection d'une route, `routeSelector` fournit le GPX → `AppController` simplifie la trace (`pathProcessing`), construit la route (`roadGeometry`) puis initialises le peloton (`peloton.ts`).
4. `SimulationClient` transmet les buffers au worker Rapier (`domain/simulation/physics/worker.ts`) qui renvoie les états mis à jour.
5. `PelotonSceneUpdater` applique ces états aux instances Three.js et `CameraRig` suit le coureur sélectionné.

## Points d'extension

- **Ajouter un paramètre de simulation** :
  - Exposer la valeur dans `APP_CONFIG` (ou ajouter un store dédié).
  - La transmettre au worker via `SimulationClient` et la consommer dans `physics/worker.ts`.
- **Nouveau décor / effet visuel** :
  - Étendre `createSceneContext` ou ajouter un module dans `domain/scene/` pour instancier les objets, puis référencer ces objets dans `AppController` si besoin.
- **Nouvelle source de parcours** :
  - Implémenter un loader dans `domain/route/routeLoader.ts` renvoyant le même contrat `{ path3D, points }` et l'utiliser dans `AppController`.
- **Interaction UI supplémentaire** :
  - Définir les éléments DOM dans `main.ts`, puis connecter les handlers dans `AppController`.

Veiller à documenter toute nouvelle fonction publique avec son rôle, ses entrées/sorties et les effets de bord éventuels.

## Routes ouvertes vs circuits fermés

Les parcours GPX sont traités comme des routes ouvertes par défaut lors de l'échantillonnage de la courbure afin d'éviter les pics artificiels qui font chuter `vCorner` aux extrémités. Lorsque vous initialisez manuellement le worker via `SimulationClient`, transmettez `closedLoop: true` si votre circuit boucle réellement : le worker continuera alors à réenrouler les distances. Pensez à marquer explicitement les tracés fermés dans vos intégrations (ou à laisser l'heuristique de `AppController` détecter un départ/arrivée superposés) pour conserver le comportement historique.

## Calibrer le rayon minimal (`minRadius`)

Le paramètre `minRadius` limite les ralentissements déclenchés par des pics de courbure locaux. Pour conserver des vitesses crédibles :

- Commencer par analyser la trace source (profil latéral ou export CSV) et repérer les virages les plus serrés réellement franchissables par le peloton.
- Définir `minRadius` légèrement en dessous de ce rayon réel (5 à 10 % de marge) afin d'autoriser une adaptation progressive sans provoquer de freinage prématuré.
- Ajuster si nécessaire en fonction des spécificités du parcours : circuits urbains (rayon plus faible), descentes rapides (rayon plus élevé).
- Valider l'ajustement avec `npm run lint && npm test` puis une lecture visuelle in-app pour vérifier que les micro-accrocs ou le bruit de mesure n'entraînent plus de ralentissements artificiels.

## Ajouter des parcours GPX

1. Copier le fichier GPX dans `public/gpx/`.
2. Ajouter une entrée `{ "name": "Titre", "url": "gpx/mon-parcours.gpx" }` dans `public/gpx/index.json`.
3. Le sélecteur de parcours affichera automatiquement la nouvelle route avec son profil altimétrique.

## Lexique minimal

- **Peloton** : ensemble de cyclistes simulés. Chaque entrée de l'état contient `[distance, décalage latéral, hauteur, yaw]`.
- **Spline** : interpolation Catmull-Rom utilisée pour échantillonner la trajectoire lissée.
- **Progress** : distance parcourue le long de la spline, en mètres.
- **Offset** : position latérale par rapport à la ligne médiane de la route.

## Vérifications recommandées

- Après `npm run build`, confirmer que les composants DaisyUI sont présents :
  ```sh
  grep -Hn "\.btn{" dist/**/*.css
  ```
- Inspecter la console lors du chargement d'une route : le log `D+ … / D- …` confirme le calcul des dénivelés.

