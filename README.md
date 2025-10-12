# Roue libre
Simulation de cyclisme

> Ajouter toute nouvelle route dans `public/gpx/index.json`.

## Dépendances

Ce projet utilise les versions suivantes :

- Tailwind CSS : `^4.1.12`
- daisyUI : `^5.0.50`

## Scène de test

Le fichier `src/scenes/chicane.ts` propose une petite chicane pour tester le lissage de trajectoire. Il renvoie également un helper Three.js (`LineSegments`) pour visualiser la spline et ses tangentes.

## Paramètres ajustables

L'update du peloton expose plusieurs paramètres afin d'affiner le comportement :

- `lookAhead` (m)
- `maxYawRate` (deg/s)
- `maxYawAccel` (deg/s²)
- `minRadius` (m)
- `maxTargetSpeed` (m/s)
- `minTargetSpeed` (m/s)
- `maxAcceleration` (m/s²)
- `maxDeceleration` (m/s²)

Ces valeurs peuvent être modifiées à chaud en envoyant un message `params` au worker :

```ts
worker.postMessage({
  type: 'params',
  payload: { lookAhead: 6, maxYawRate: 90 }
})
```


## Vérification du build

Après avoir exécuté `npm run build`, vérifier que la classe `.btn` est bien incluse dans les CSS générés :

```sh
grep -Hn "\.btn{" dist/**/*.css
```

Cela confirme que les composants DaisyUI sont présents dans la distribution.

