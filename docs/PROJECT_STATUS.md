# État du projet

## Phase actuelle

Roue libre est en phase de fondation technique, documentaire, physique minimale, énergétique minimale et laboratoire visuel minimal pour un coureur isolé.

## Existant

- Workspace pnpm minimal.
- Configuration TypeScript stricte partagée.
- Configuration Vitest pour `sim-core` et le laboratoire.
- Package `packages/sim-core` sans dépendance graphique, navigateur, DOM, React ou Three.js.
- Moteur longitudinal déterministe minimal pour un coureur isolé sur route à pente constante ou sur un parcours longitudinal déterministe composé de segments à pente constante.
- Pente longitudinale instantanée signée dans l'environnement physique, exprimée comme ratio sans unité, nulle par défaut.
- Domaine de parcours longitudinal distinct avec segments immuables, frontières semi-ouvertes et longueur totale optionnelle.
- Format interne précompilé immuable et copié défensivement, composé d’échantillons ordonnés de distance et d’altitude en mètres, avec longueur totale dérivée, consultation d’altitude par interpolation linéaire et consultation déterministe de la pente entre deux échantillons successifs sous forme de ratio sans unité.
- Type de point GPX brut immuable (latitude et longitude en degrés décimaux, altitude en mètres) et parseur GPX 1.1 déterministe, indépendant du DOM et du navigateur. Le sous-ensemble accepte exactement une trace, un segment et au moins deux points avec `lat`, `lon` et un unique `ele`, ainsi que les namespaces, commentaires, métadonnées supplémentaires et CDATA dans les éléments ignorés. Les tests valident le parseur contre le corpus brut des 21 étapes du Tour de France 2026 exporté par VisuGPX.
- Annotation pure, déterministe et profondément immuable des points GPX avec leur distance horizontale cumulée. Chaque segment emploie la formule de Haversine sur une Terre sphérique de rayon moyen 6 371 008,8 m, normalise le passage de l’antiméridien et ignore l’altitude ; les 21 traces brutes sont couvertes sans suppression ni déplacement de point.
- Conversion explicite, pure et déterministe de `PrecompiledCourse` vers `LongitudinalCourse`, avec un segment par intervalle, conservation des frontières d’échantillons et transfert de la longueur totale, indépendante de la physique.
- Scénario d’intégration déterministe de `sim-core` parcourant 800 m depuis des échantillons distance/altitude convertis : la pente est résolue depuis la distance au début de chaque tick, puis alimente la physique et l’énergie jusqu’à l’arrivée bornée. Ses résultats numériques sont couverts par le benchmark de référence.
- Fabrique explicite du parcours minimal fini, plat et rectiligne depuis l’origine 0 m, avec bornage pur de la distance à la ligne.
- Scénario segmenté de démonstration fini de 800 m avec arrivée, en plus du scénario historique à pente constante sans arrivée.
- Parcours de démonstration du laboratoire construit une fois au chargement du module depuis les échantillons distance/altitude de référence d’un `PrecompiledCourse`, puis converti une fois en `LongitudinalCourse` par l’API publique de `sim-core`.
- Distinction entre puissance demandée et puissance produite.
- Environnement longitudinal avec vent de face ou vent arrière.
- Modèle énergétique déterministe CP/W' pour un coureur isolé.
- Consommation de la réserve anaérobie au-dessus de CP et récupération sous CP.
- Limitation de la puissance produite lorsque la réserve anaérobie ne permet pas de soutenir la demande.
- Application `apps/lab` Vite/React permettant de piloter la puissance demandée, le vent longitudinal, la pente longitudinale constante, l'exécution, la pause, la réinitialisation et l'avance manuelle d'une seconde simulée.
- Contrôleur de laboratoire indépendant de React et du DOM, utilisant uniquement l'API publique de `@rouelibre/sim-core`.
- Adaptateur temporel navigateur à pas fixe `1 / 60 s` avec accumulateur, multiplicateurs ×1, ×5 et ×20, et plafonnement du temps réel rattrapable après une frame longue avant application du multiplicateur.
- Affichage des observables physiques, énergétiques, environnementales et des forces du coureur isolé, dont la force gravitationnelle longitudinale.
- Représentation visuelle minimale dont la position sur un parcours fini est dérivée de `LongitudinalCourseProgress.progress`, bornée visuellement entre 0 % et 100 %. Le parcours constant sans arrivée conserve une animation cyclique fondée sur la distance modulo 100 m.
- Vérification CI pour l'installation, le typecheck, les tests et le build sur Pull Request.
- Modèle de description proposé pour aider à rédiger manuellement les Pull Requests, avec audit humain de la description et du diff.
- Workflow GitHub Actions pouvant publier le build Vite du laboratoire sur GitHub Pages depuis `main`, après installation, typecheck, tests et build de production.
- Documentation du projet, de l'architecture, du modèle physique longitudinal, du modèle énergétique minimal, du laboratoire visuel et de la publication GitHub Pages.
- Répertoire `docs/decisions/` pour les décisions d'architecture structurées.

## Limites

Le laboratoire observe le moteur existant et ne contient pas de nouvelle équation physique ou énergétique. La représentation visuelle est une aide d'observation dérivée de l'état simulé ; elle n'est pas une source de vérité et ne modifie jamais la simulation. Après une arrivée, le contrôleur borne la distance à la ligne et fige tous les observables, y compris les commandes de puissance et de vent ; le passage vers le parcours à pente constante sans arrivée les réactive. La réinitialisation conserve la puissance demandée, le vent, le mode de parcours et la pente constante sélectionnée pour faciliter la répétition d'un scénario.

## Non existant

Le projet ne contient pas de normalisation ou nettoyage GPX, de suppression des doublons, de filtrage altimétrique, de rééchantillonnage, de conversion GPX vers `PrecompiledCourse`, de projection, d’intégration GPX au laboratoire ou à la physique, de virages, de génération 3D, de position latérale, d’aspiration, d’intelligence artificielle, de tactique, de psychologie, d’exécution Web Worker, de moteur de corps rigides, de collisions, d’adhérence, de modèle physiologique complexe, de courbes de puissance personnalisées, de plusieurs réserves énergétiques, de température, d’hydratation, de nutrition, de plusieurs coureurs, de scène 3D, de Three.js, de Zustand, de sons, de sauvegarde, de backend ou d’authentification.

## Prochaine tâche unique

Produire un rapport déterministe de qualité géométrique des tracés GPX distancés — doublons consécutifs exacts, segments horizontaux nuls et sauts de distance — sans supprimer ni modifier aucun point.
