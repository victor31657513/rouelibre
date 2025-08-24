# Roue libre
Simulation de cyclisme

> Ajouter toute nouvelle route dans `public/gpx/index.json`.

## Scène de test

Le fichier `src/scenes/chicane.ts` propose une petite chicane pour tester le lissage de trajectoire. Il renvoie également un helper Three.js (`LineSegments`) pour visualiser la spline et ses tangentes.

## Paramètres ajustables

L'update du peloton expose plusieurs paramètres afin d'affiner le comportement :

- `lookAhead` (m)
- `maxYawRate` (deg/s)
- `maxYawAccel` (deg/s²)
- `minRadius` (m)
- `speedScale`

Ces valeurs peuvent être modifiées à chaud en envoyant un message `params` au worker :

```ts
worker.postMessage({
  type: 'params',
  payload: { lookAhead: 6, maxYawRate: 90 }
})
```

