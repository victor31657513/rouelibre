# Architecture

## Vue d'ensemble

Le dépôt est organisé en workspace pnpm. Le socle contient les éléments nécessaires aux vérifications reproductibles, au noyau de simulation longitudinal minimal et au modèle énergétique minimal d'un coureur isolé.

Les décisions d'architecture sont consignées dans [`docs/decisions/`](decisions/README.md).

## Packages

### `packages/sim-core`

`sim-core` contient le moteur de simulation sans dépendance graphique, navigateur, DOM, React, Three.js ni moteur de corps rigides.

Organisation interne :

- `src/course.ts` contient le domaine consommé par la simulation longitudinale : validation, copie défensive, fabrique de parcours fini plat depuis l’origine 0 m, segments ordonnés immuables à pente constante, longueur totale optionnelle, bornage à l’arrivée, progression pure et résolution binaire de pente depuis une distance.
- `src/gpx.ts` définit la frontière des données source GPX brutes et analyse un sous-ensemble GPX 1.1 déterministe (une trace, un segment, au moins deux points). Le scanner ignore les sections CDATA des éléments non numériques, mais les refuse dans `ele`. Il dépend uniquement d’ES2022, sans DOM, `DOMParser`, navigateur, système de fichiers, réseau, physique ou énergie. La lecture du corpus VisuGPX reste limitée aux tests. Le module conserve latitude et longitude en degrés et altitude en mètres, sans conversion vers un parcours précompilé ou consommable.
- `src/gpxNormalization.ts` fournit deux transformations de `ParsedGpxTrack` profondément immuables. `removeConsecutiveExactGpxDuplicates` reste disponible pour supprimer uniquement les doublons égaux sur les trois valeurs. `removeConsecutiveSameHorizontalGpxPoints` constitue la passe canonique du corpus avant le calcul des distances : elle conserve le premier point de chaque série consécutive égale exactement en latitude et longitude. Ces passes restent indépendantes de la géodésie, de la physique et du laboratoire.
- `src/gpxDistance.ts` valide une `ParsedGpxTrack`, copie chaque point et l’annote avec sa distance horizontale cumulée selon Haversine. Il dépend uniquement des types GPX bruts et d’ES2022, sans dépendance vers le parseur XML, `PrecompiledCourse`, le parcours longitudinal, la physique, l’énergie, le laboratoire, le rendu, le DOM, le système de fichiers ou le réseau. Cette transformation préparatoire s’exécute hors de la boucle de simulation et ne nettoie ni ne transforme la géométrie.
- `src/gpxQuality.ts` valide et analyse une `DistanceAnnotatedGpxTrack` en une passe ordonnée. Il consomme exclusivement les distances cumulées déjà calculées pour observer doublons exacts, segments horizontaux nuls, sauts au-dessus d’un seuil explicite et premier segment maximal. Il ne recalcule pas la géodésie, ne copie ou ne modifie aucun point et ne dépend que des types de `gpxDistance.ts` et d’ES2022.
- `src/gpxRawProfile.ts` valide et analyse en une passe une `DistanceAnnotatedGpxTrack` issue de la normalisation canonique. Il expose les espacements, variations d'altitude et pentes brutes extrêmes avec leurs indices, ainsi que les effectifs directionnels, sans modifier les points ni dépendre de la simulation, de l'énergie ou du rendu.
- `src/gpxRawDistribution.ts` valide une liste ordonnée non vide de `DistanceAnnotatedGpxTrack` et une configuration sans valeur implicite, puis diagnostique les distributions agrégées. Ses tris utilisent explicitement la valeur, l'index de trace et l'index de départ ; ses percentiles au rang supérieur et dépassements stricts restent localisables. Le rapport et sa copie défensive de configuration sont profondément immuables. Le module ne connaît ni fichiers, ni simulation, ni rendu et ne transforme aucun point.
- La future préparation altimétrique consommera exclusivement la sortie de `parseGpxTrack` → `removeConsecutiveSameHorizontalGpxPoints` → `computeGpxCumulativeDistances`. Conformément à la [décision 0007](decisions/0007-exigences-preparation-altimetrique.md), elle pourra transformer le profil d'altitude mais conservera exactement la géométrie et la longueur horizontales, publiera une sortie atomique traçable et restera distincte de `PrecompiledCourse`. Aucun module ou API de préparation n'existe à ce stade.
- Le [protocole JSON de comparaison altimétrique](../data/courses/tour-de-france/2026/altimetry-comparison-protocol.json) et son banc d'essai résident exclusivement sous `packages/sim-core/test`. Le banc fournit seulement la référence neutre `identity`, reconstruit son rapport complet en mémoire et versionne un résumé compact. Il n'est ni exporté par l'API publique, ni consommé par `apps/lab` ou la simulation, et reste séparé d'une future préparation de production et de sa conversion vers `PrecompiledCourse`, conformément à la [décision 0008](decisions/0008-protocole-comparaison-preparation-altimetrique.md).
- `src/precompiledCourse.ts` contient une configuration de parcours précompilée indépendante : échantillons ordonnés de distance et d’altitude en mètres, validation, copie défensive, immutabilité, interpolation linéaire d’altitude et consultation de la pente de chaque intervalle. Ce module ne connaît ni GPX ni coordonnées GPS et dépend uniquement du langage JavaScript. Il ne dépend ni de la physique, de l’énergie ou du rendu, ni de React, Three.js, du DOM ou du navigateur.
- `src/courseConversion.ts` convertit explicitement la configuration source `PrecompiledCourse` en représentation consommable `LongitudinalCourse`. Sa direction de dépendance va uniquement vers les types du parcours précompilé et vers le domaine et la fabrique de `course.ts` ; ni `course.ts` ni `precompiledCourse.ts` ne dépendent de la conversion. Le module ne dépend pas de la physique, de l’énergie, du laboratoire ou du rendu.
- `src/longitudinal.ts` contient le profil physique, l'environnement longitudinal à pente instantanée, l'état physique, les forces longitudinales et le pas physique historique.
- `src/energy.ts` contient le profil énergétique CP/W', l'état énergétique, la logique de consommation/récupération et l'orchestration énergie puis physique.
- `src/index.ts` expose uniquement l'API publique nécessaire aux consommateurs du package.

API exposée :

- `SingleRiderProfile` décrit le couple coureur-vélo avec masses, CdA, coefficient de roulement, rendement mécanique, puissance maximale et limite de force propulsive basse vitesse.
- `LongitudinalEnvironment` décrit l'air, la densité de l'air, le vent longitudinal, la gravité et la pente longitudinale instantanée `roadGrade`. `roadGrade` est exprimée comme un ratio sans unité, positif en montée, négatif en descente et nul par défaut.
- `LongitudinalCourseSegment` décrit le début en mètres et la pente d'un segment de parcours ; `LongitudinalCourseOptions` définit une longueur totale optionnelle ; `LongitudinalCourse` contient ses segments ordonnés immuables et cette longueur ; `LongitudinalCoursePosition` expose le segment résolu et les distances utiles à l'observation ; `LongitudinalCourseProgress` expose les observables de progression et d’arrivée.
- `RawGpxTrackPoint` décrit latitude et longitude brutes en degrés décimaux et altitude en mètres ; `ParsedGpxTrack` contient les points profondément immuables. `parseGpxTrack` valide le sous-ensemble GPX 1.1 pris en charge sans calculer distance, projection, pente ou parcours.
- `removeConsecutiveExactGpxDuplicates` reste disponible pour supprimer seulement les points consécutifs égaux en latitude, longitude et altitude. `removeConsecutiveSameHorizontalGpxPoints` est la passe canonique du corpus avant `computeGpxCumulativeDistances` ; elle conserve le premier point et son altitude et classe les indices source supprimés selon que leur altitude est égale ou différente.
- `DistanceAnnotatedGpxPoint` ajoute une distance horizontale cumulée en mètres aux coordonnées et à l’altitude copiées ; `DistanceAnnotatedGpxTrack` contient ces points profondément immuables et la longueur du dernier point. `computeGpxCumulativeDistances` applique le modèle sphérique déterministe sans supprimer de point et sans créer de parcours précompilé.
- `GpxGeometryQualityReport` conserve les effectifs, la longueur existante, le seuil diagnostique explicite, le premier segment maximal et les observations géométriques profondément immuables dans leur ordre documentaire. `analyzeGpxGeometryQuality` ne produit aucune version transformée des points.
- `GpxRawProfileReport` conserve les effectifs, la longueur et l'espacement moyen, les premières observations atteignant les extrema d'espacement et de pente brute, et les compteurs montée, descente et altitude constante. `analyzeGpxRawProfile` exige des distances strictement croissantes et produit un rapport profondément immuable sans transformer la trace.
- `PrecompiledCourseSample` décrit une distance et une altitude en mètres ; `PrecompiledCourse` conserve au moins deux échantillons immuables et une longueur totale dérivée du dernier. `createPrecompiledCourse` valide et copie défensivement ces données. `getPrecompiledCourseAltitudeAtDistance` consulte sans mutation l’altitude exacte ou interpolée linéairement. `getPrecompiledCourseRoadGradeAtDistance` résout par recherche binaire l’intervalle d’échantillons et calcule sa pente sans allocation. `convertPrecompiledCourseToLongitudinalCourse` traduit cette configuration source en segments validés par `createLongitudinalCourse`, sans rendre le parcours précompilé responsable du stockage consommable et sans utilisation par la boucle physique.
- `createLongitudinalCourse` valide et copie défensivement les segments et `LongitudinalCourseOptions.totalLengthMeters`. `createFlatLongitudinalCourse` construit la configuration minimale finie, plate et rectiligne depuis 0 m. `clampLongitudinalCourseDistance` centralise le bornage pur de la distance à l’arrivée. `getLongitudinalCourseSegmentIndexAtDistance` et `getLongitudinalCourseRoadGradeAtDistance` résolvent sans allocation l'index et la pente actifs. `getLongitudinalCoursePositionAtDistance` produit les informations détaillées réservées aux observateurs. `getLongitudinalCourseProgressAtDistance` est une fonction pure d’observation : elle borne la progression à 1 et la distance restante à zéro, et ne produit pas d’état d’arrivée pour un parcours sans longueur totale.
- `SingleRiderState` contient l'état dynamique physique mutable.
- `createSingleRiderState` crée un état physique initial typé.
- `computeSingleRiderForces` calcule les forces longitudinales instantanées en utilisant la puissance demandée bornée, pour les usages historiques sans modèle énergétique.
- `computeSingleRiderForcesAtPower` calcule les forces longitudinales instantanées avec une puissance produite explicite, utile lorsque la puissance est limitée par le modèle énergétique.
- `stepSingleRider` valide les entrées publiques puis avance un état physique d'un pas temporel explicite sans modèle énergétique.
- `SingleRiderEnergyProfile` décrit la puissance critique, la capacité anaérobie W' et l'efficacité de récupération.
- `SingleRiderEnergyState` contient la réserve anaérobie mutable et les observables du dernier pas énergétique.
- `createSingleRiderEnergyState` crée un état énergétique initial, plein par défaut ou avec une réserve explicite bornée.
- `stepSingleRiderEnergy` applique uniquement la logique énergétique CP/W' et retourne la puissance produite autorisée.
- `stepSingleRiderWithEnergy` orchestre un pas complet : validation, calcul énergétique pur, calcul physique candidat pur, validation des candidats, puis commit atomique des états énergétique et physique.

Contraintes :

- pas de dépendance à React ;
- pas de dépendance à Three.js ;
- pas de dépendance au DOM ou au navigateur ;
- pas de dépendance graphique ;
- pas d'utilisation directe de `Math.random()` dans le code de simulation ;
- unités SI dans le moteur ;
- séparation entre profil physique, profil énergétique, état physique, état énergétique, logique énergétique et orchestration combinée.

## Publication GitHub Pages

La publication statique du laboratoire est assurée par le workflow GitHub Actions `.github/workflows/deploy-pages.yml`. Il construit le workspace avec Node.js 24 et pnpm 10.28.1, exécute le typecheck, les tests et le build, vérifie `apps/lab/dist/index.html`, configure GitHub Pages, téléverse `apps/lab/dist` avec `actions/upload-pages-artifact` et déploie l’artefact dans l’environnement `github-pages`.

Le workflow se déclenche manuellement ou lors d’un push sur `main`. Une fusion automatique produite avec le `GITHUB_TOKEN` ne déclenche pas le workflow `push` ; après avoir confirmé l'état `MERGED` et l'absence d'une exécution pour le commit de fusion, `.github/workflows/enable-auto-merge.yml` déclenche donc explicitement `deploy-pages.yml` sur `main` par `workflow_dispatch`. Une Pull Request non fusionnée ne publie aucun déploiement.

`deploy-pages.yml` reste l'unique propriétaire de l'installation, du typecheck, des tests, du build, de l'artefact Pages et de la publication. Le workflow d'auto-merge orchestre seulement la demande de fusion et, après fusion confirmée, le déclenchement idempotent du workflow dédié.

Le développement local conserve une base Vite `/`. Le workflow GitHub Pages définit `VITE_BASE_PATH` à partir de `GITHUB_REPOSITORY` : `/` pour un dépôt de type `<propriétaire>.github.io`, ou `/<nom-du-dépôt>/` pour un dépôt projet GitHub Pages.

## Scripts racine

- `pnpm install` installe le workspace.
- `pnpm typecheck` exécute le typecheck des packages.
- `pnpm test` exécute les tests des packages.
- `pnpm build` exécute le build de production des workspaces qui en définissent un, notamment le laboratoire visuel.

### `apps/lab`

`apps/lab` contient le laboratoire visuel minimal du coureur isolé. L'application utilise Vite, React, TypeScript strict et du CSS simple. Elle dépend de `@rouelibre/sim-core` par son API publique et ne copie pas le moteur.

Direction des dépendances :

```text
apps/lab → precompiled course conversion + course + energy + longitudinal

GPX XML brut → ParsedGpxTrack → normalisation horizontale exacte → DistanceAnnotatedGpxTrack → diagnostics géométrique et altimétrique → préparation altimétrique future → conversion PrecompiledCourse future → LongitudinalCourse → simulation
```

`sim-core` ne dépend pas du laboratoire, de React, de Vite, du DOM, du navigateur, de Three.js ni d'une bibliothèque graphique.

Organisation :

- `src/simulation/labSimulation.ts` contient le contrôleur indépendant de React et du DOM. Il possède les états physique et énergétique, un état d’arrivée, le mode de parcours et la pente constante sélectionnée. Le parcours de démonstration est construit au chargement du module depuis un `PrecompiledCourse` et converti une fois par l’API publique de `sim-core`. Le laboratoire ne calcule pas les pentes : la conversion de parcours les dérive, puis le contrôleur résout au début de chaque tick la pente du `LongitudinalCourse` depuis la distance et la copie dans `environment.roadGrade`. Il applique ensuite CP = 250 W, W' = 20 000 J, une efficacité de récupération de 0,5, un pas fixe `1 / 60 s` et calcule les forces avec la puissance réellement produite.
- `src/simulation/fixedStepRunner.ts` contient l'adaptateur temporel. Il transforme le temps réel issu de `requestAnimationFrame` en ticks entiers, conserve un reliquat, plafonne le temps réel rattrapable après une frame longue avant application du multiplicateur, puis réinitialise sa référence temporelle lors d'une reprise. Le multiplicateur ×20 produit vingt secondes simulées par seconde réelle en fonctionnement normal sans modifier le pas fixe `1 / 60 s`.
- `src/App.tsx` contient les composants React d'affichage et de commande. Les composants ne portent pas la logique de simulation et ne reçoivent que des instantanés copiés et gelés.
- `src/styles.css` fournit une présentation CSS simple, responsive et lisible.

Le parcours source, sa conversion, la physique et l’interface restent des responsabilités séparées. La conversion ne s’exécute ni pendant un tick, ni lors d’une réinitialisation ou d’un changement de mode. React observe le contrôleur sans construire le parcours et le rendu reste dérivé de la simulation, jamais source de vérité.

Choix temporaires et réversibles :

- Three.js est reporté parce qu'une route à pente constante et un bloc cycliste suffisent à observer un seul coureur isolé.
- Zustand est reporté parce qu'une page unique peut rester pilotée par l'état React local et un contrôleur explicite.
- Web Worker est reporté parce qu'un seul coureur à 60 Hz ne justifie pas encore un protocole de messages dédié. La séparation entre contrôleur, adaptateur temporel et UI permet de déplacer ultérieurement l'exécution dans un Web Worker sans modifier `sim-core`.
- Les bibliothèques de graphiques, de composants et les frameworks CSS sont reportés parce que les observables sont des valeurs numériques et des jauges simples.
