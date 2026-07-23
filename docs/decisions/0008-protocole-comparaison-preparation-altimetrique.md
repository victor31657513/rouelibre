# Protocole de comparaison des préparations altimétriques

## Contexte

La chaîne canonique fournit 21 profils GPX complets et le manifeste versionné de
43 cas extrêmes. La décision 0007 fixe les exigences d'une préparation, mais ne
permet pas encore de comparer objectivement plusieurs couples stratégie et
configuration. Le fichier
[`altimetry-comparison-protocol.json`](../../data/courses/tour-de-france/2026/altimetry-comparison-protocol.json)
constitue le protocole versionné et sa source de vérité exécutable par un futur
banc d'essai.

## Décision

### Frontière

Le protocole est un artefact de données et non une configuration de production.
Il reste hors de la boucle de simulation, de l'API publique, du laboratoire et de
la conversion vers `PrecompiledCourse`. Il décrit une mesure future sans fournir
le banc, la référence identité ou une stratégie candidate.

L'entrée réelle suit exclusivement `parseGpxTrack` →
`removeConsecutiveSameHorizontalGpxPoints` →
`computeGpxCumulativeDistances`. Les 21 fichiers sont lus dans l'ordre
lexicographique. Une exécution porte sur un triplet `candidateId`,
`configurationId`, `configuration` immuable.

### Profils synthétiques

Quatorze profils longitudinaux ordonnés couvrent le plat, les montées et descentes
régulières, un sommet, une vallée, un pic et un creux isolés, un espacement
irrégulier à pente constante, un intervalle long, des altitudes négatives, un pic
sur très faible espacement, les deux extrémités et un sommet à densité mixte.
Chaque point exprime une distance cumulée et une altitude en mètres. Le protocole
ne prescrit aucune sortie attendue : ces profils rendent visibles conservation,
forme, politique et robustesse numérique sans qualifier un relief d'erreur.

### Invariants éliminatoires

Vingt contrôles invalident une exécution en cas d'échec : non-mutation des entrées
et de la configuration, répétabilité exacte, finitude, distances valides et
longueur conservée, coordonnées intactes, traçabilité et changements explicites,
politiques d'extrémité et d'intervalle long déclarées, configuration rapportée,
atomicité, immutabilité profonde, absence d'aléatoire, d'horloge et d'état global,
absence d'adaptation au fichier ou au cas, et construction obligatoire d'un profil
d'altitude cohérent plutôt qu'une limitation directe de `rawGrade`. Ces contrôles
ne départagent pas les exécutions valides.

### Conventions de mesure et métriques

Un profil préparé est linéaire par morceaux pour la seule mesure aux distances
sources. Une distance préparée exactement présente fournit directement son
altitude ; sinon, entre `(d0, altitude0)` et `(d1, altitude1)`, le protocole pose
`t = (d - d0) / (d1 - d0)` puis `altitude0 + t × (altitude1 - altitude0)`.
Les extrémités conservées interdisent l'extrapolation. Cette interpolation n'est
pas une préparation.

Sur chaque intervalle, `deltaAltitude = altitudeFin - altitudeDébut` et
`grade = deltaAltitude / espacementHorizontal`. Les gains positifs somment
`max(deltaAltitude, 0)` et les pertes négatives somment
`max(-deltaAltitude, 0)`. Les percentiles de pente absolue utilisent le rang
supérieur empirique sans interpolation, comme `analyzeGpxRawDistributions`, et
les égalités retiennent la première observation documentaire.

Les métriques ordonnées couvrent les nombres de points, extrema d'altitude,
dénivelés avant/après et différences, extrema et percentiles 95 et 99 des pentes,
ainsi que les corrections aux points sources. Une correction vaut l'altitude
préparée évaluée moins l'altitude source. Le nombre de points changés compare
exactement à zéro, sans epsilon. Moyenne absolue, moyenne quadratique, correction
absolue maximale et premier indice qui la porte sont rapportés, avec les
corrections des extrémités. La traçabilité expose aussi les indices changés, les
intervalles sources contributeurs, les politiques appliquées et le maximum de
contributions sources.

### Cas réels

Chaque stratégie traite d'abord chacune des 21 traces complètes. Les mesures des
43 cas sont ensuite extraites aux distances sources par la convention linéaire,
dans l'ordre du manifeste de schéma 2. Le rapport conserve identité, motifs,
direction, indicateur d'intervalle supérieur à 250 m, altitudes avant/après,
pentes et corrections des deux extrémités. Cette règle évite les effets de bord
artificiels d'un traitement de fragments.

### Configuration et adaptation

La configuration complète est déclarée avant l'exécution, exprimée en unités SI,
copiée défensivement, profondément immuable et identique pour toutes les traces.
Elle ne contient aucun seuil caché et ne peut être ajustée manuellement par étape
ou par cas. Une stratégie intrinsèquement adaptative reste admissible si sa règle
est explicite, déterministe et interne à l'algorithme ; elle ne peut consulter ni
nom de fichier, ni étape, ni manifeste.

### Absence de score global

Le protocole ne pondère ni n'agrège les métriques, ne fixe aucun seuil de
correction ou de pente acceptable, et ne désigne aucun gagnant. Il ne privilégie
ni lissage maximal ni conservation maximale. Une comparaison présente
séparément les échecs éliminatoires, profils synthétiques, traces complètes, cas,
compromis et performances. Le choix exige une décision dédiée.

### Référence neutre future

Le futur banc comporte la référence non candidate `identity`. Elle reproduit
exactement distances, altitudes, nombre de points, dénivelés et pentes, avec une
correction nulle. Elle valide uniquement le banc de mesure et n'est pas
implémentée par cette décision.

### Exécution et performances

Les résultats fonctionnels utilisent Node.js majeur 24, deux exécutions
indépendantes, des fichiers triés, une configuration gelée, aucune source
aléatoire et aucune horloge. Ils excluent dates, durées, chemins absolus,
identifiants de machine et données d'environnement.

La mesure informative de performance reste future : cinq chauffes et vingt
exécutions mesurées sur les 21 traces complètes, dans un processus et un résultat
séparés après validation fonctionnelle. Médiane et percentile 95 des millisecondes
sont accompagnés des versions Node.js et pnpm, du système et du processeur. Ils
n'alimentent aucun score et ne portent aucun seuil d'acceptation.

## Choix encore ouverts

- algorithmes candidats et ordre de leur introduction ;
- paramètres explicites de chaque configuration ;
- représentation TypeScript détaillée de la traçabilité ;
- stratégie finalement retenue et justification de ses compromis ;
- intégration de production et conversion précompilée ultérieures.

## Alternatives rejetées

- Choisir une stratégie avant le protocole : les critères seraient ajustables a
  posteriori.
- Comparer uniquement les 43 extrêmes sans traiter les traces complètes : les
  fragments créeraient des effets de bord artificiels.
- Comparer des fenêtres définies seulement en nombre de points : leur portée
  physique varierait avec la densité GPX.
- Adapter les paramètres séparément à chaque étape : la comparaison ne serait ni
  générale ni reproductible.
- Utiliser un score pondéré arbitraire : il masquerait les compromis et
  présupposerait leur importance.
- Comparer des profils rééchantillonnés sans convention commune d'évaluation :
  leurs points ne seraient pas directement comparables.
- Intégrer directement un candidat au moteur ou au laboratoire : la mesure, la
  préparation de production et la simulation seraient indûment couplées.

## Conséquences

Les futures exécutions produisent des rapports ordonnés et comparables, sans
adaptation opportuniste. Le protocole augmente le travail préalable à tout choix,
mais rend les hypothèses, modifications et compromis auditables. Il n'existe
encore ni banc d'essai, ni stratégie candidate, ni paramètre de préparation, ni
classement, ni intégration de production.
