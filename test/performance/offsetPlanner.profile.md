# Segment sampling benchmarks

Ce répertoire contient un micro-benchmark `segmentSampling.bench.ts` exécuté via Vitest.

Pour reproduire les mesures locales :

```bash
npx vitest bench test/performance/segmentSampling.bench.ts
```

Sur la machine de développement, la variante vectorisée `batched offset sampling`
s'est montrée ~10× plus rapide que l'évaluation scalaire (`npx vitest bench`
rapporte un facteur 10.55 dans cet environnement conteneurisé).
