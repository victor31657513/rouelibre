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
- Rapport pur, déterministe et profondément immuable de qualité géométrique d’une trace GPX distancée. Il observe dans l’ordre documentaire les doublons consécutifs exacts, les segments horizontaux nuls et les sauts strictement supérieurs au seuil explicitement fourni par l’appelant, sans recalcul géodésique ni modification des points.
- Rapport pur, déterministe et profondément immuable des espacements horizontaux et pentes brutes d'une trace GPX normalisée et distancée. Il valide les distances strictement croissantes, conserve la première occurrence des extrema et compte les segments montants, descendants et à altitude constante sans transformer les données.
- Diagnostic public, pur, déterministe et profondément immuable des distributions brutes d'une ou plusieurs traces canoniques ordonnées. Il expose les percentiles empiriques au rang supérieur et les dépassements stricts de seuils explicites pour l'espacement, les variations d'altitude signées et absolues et la valeur absolue de pente, avec localisation documentaire de chaque observation, sans transformer les données.
- Corpus dérivé et testé de 43 segments uniques : union des 29 variations absolues strictement supérieures à 20 m, des 12 pentes brutes absolues strictement supérieures à 1 et des observations source aux percentiles 99, 99,9 et 100 de ces deux distributions. Chaque cas ordonne tous ses motifs, relie les indices normalisés aux indices GPX bruts et conserve ses métriques non arrondies et son voisinage, sans qualifier l’altitude réelle ni choisir une correction.
- Contrat documenté de la future préparation altimétrique déterministe : frontière d'entrée canonique, conservation de la géométrie horizontale, configuration spatiale explicite en mètres, atomicité, traçabilité, rapport avant/après, traitement explicite des intervalles longs et matrice minimale de tests. L'algorithme et ses paramètres numériques restent volontairement ouverts faute de distributions suffisantes.
- Protocole versionné et testé de comparaison altimétrique : 14 profils synthétiques ordonnés, 21 traces canoniques complètes, extraction après traitement complet des 43 cas du manifeste, 20 invariants éliminatoires, conventions mathématiques et métriques ordonnées, rapport fonctionnel reproductible et performances séparées. Il ne définit aucun score, candidat ou paramètre de préparation.
- Normalisation pure, déterministe et profondément immuable supprimant seulement les doublons GPX consécutifs exactement égaux en latitude, longitude et altitude. Elle conserve le premier point de chaque série, intervient avant le calcul des distances et ne réécrit jamais les fichiers raw.
- Normalisation canonique pure, déterministe et profondément immuable supprimant les positions horizontales consécutives exactement égales en latitude et longitude. Elle conserve le premier point et son altitude, intervient directement sur la trace parsée avant les distances et ne laisse aucun segment horizontal nul dans le corpus.
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
- Modèle de description proposé pour aider à rédiger manuellement les Pull Requests, vérifications locales obligatoires par Codex avant l'ouverture d'une Pull Request non brouillon, auto-merge fondé uniquement sur les métadonnées d'éligibilité sans vérification du code de la branche source, et audit post-fusion de la description et du diff.
- Workflow GitHub Actions pouvant publier le build Vite du laboratoire sur GitHub Pages depuis `main`, après installation, typecheck, tests et build de production.
- Documentation du projet, de l'architecture, du modèle physique longitudinal, du modèle énergétique minimal, du laboratoire visuel et de la publication GitHub Pages.
- Répertoire `docs/decisions/` pour les décisions d'architecture structurées.

## Limites

Le laboratoire observe le moteur existant et ne contient pas de nouvelle équation physique ou énergétique. La représentation visuelle est une aide d'observation dérivée de l'état simulé ; elle n'est pas une source de vérité et ne modifie jamais la simulation. Après une arrivée, le contrôleur borne la distance à la ligne et fige tous les observables, y compris les commandes de puissance et de vent ; le passage vers le parcours à pente constante sans arrivée les réactive. La réinitialisation conserve la puissance demandée, le vent, le mode de parcours et la pente constante sélectionnée pour faciliter la répétition d'un scénario.

## Non existant

Le projet ne contient pas de tolérance géométrique, de suppression des points proches, de correction des 82 sauts, d'algorithme ou d'API de préparation altimétrique, de filtrage altimétrique, de rééchantillonnage, de conversion GPX vers `PrecompiledCourse`, de projection, d’intégration GPX au laboratoire ou à la physique, de virages, de génération 3D, de position latérale, d’aspiration, d’intelligence artificielle, de tactique, de psychologie, d’exécution Web Worker, de moteur de corps rigides, de collisions, d’adhérence, de modèle physiologique complexe, de courbes de puissance personnalisées, de plusieurs réserves énergétiques, de température, d’hydratation, de nutrition, de plusieurs coureurs, de scène 3D, de Three.js, de Zustand, de sons, de sauvegarde, de backend ou d’authentification. Aucune stratégie altimétrique n'est implémentée, comparée, sélectionnée ou intégrée.

## Prochaine tâche unique

Implémenter un banc d’essai neutre et déterministe appliquant le protocole de comparaison, avec uniquement la référence identité, sans implémenter encore de stratégie candidate de préparation altimétrique.
