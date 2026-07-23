# Exigences de préparation altimétrique déterministe

## Statut

Accepté.

## Contexte

Après la chaîne canonique `parseGpxTrack` →
`removeConsecutiveSameHorizontalGpxPoints` →
`computeGpxCumulativeDistances`, le corpus compte 159 855 points et 159 834
segments. Les espacements extrêmes sont d'environ 0,731 m et 747,379 m, les
pentes brutes extrêmes d'environ -3,50059 et +1,15809, et 82 intervalles sont
strictement supérieurs à 250 m. La densité est donc trop irrégulière pour
définir un voisinage par un nombre fixe de points, et les altitudes brutes ne
peuvent pas alimenter directement la physique.

Les extrema et la moyenne disponibles décrivent des cas limites, mais pas leur
fréquence ni la forme des distributions. Ils ne suffisent pas à justifier une
résolution spatiale, une taille de fenêtre, une méthode de lissage, une pente
maximale ou une amplitude maximale de correction.

## Décision

Cette décision fixe le contrat de la future préparation ; elle ne choisit et
n'implémente aucun algorithme.

### Exigences obligatoires

#### Entrée et séparation des responsabilités

- L'entrée est une `DistanceAnnotatedGpxTrack` issue exactement de la chaîne
  canonique ci-dessus. Les fichiers GPX `raw` ne sont jamais réécrits.
- La préparation peut produire un profil d'altitude différent. Elle ne modifie
  ni latitude, ni longitude, ni distances horizontales cumulées, ni longueur
  horizontale totale, ni premier ou dernier emplacement horizontal de la trace
  source. Si une représentation future introduit d'autres abscisses
  d'échantillonnage, celles-ci sont dérivées explicitement en mètres sans
  réécrire les distances source.
- Elle ne répare implicitement ni saut géométrique ni trajectoire. Les anomalies
  horizontales restent identifiables et observables séparément du traitement
  altimétrique.
- Cette étape reste distincte de la conversion vers `PrecompiledCourse`, du
  parcours longitudinal, de la physique, du laboratoire et du rendu. Elle
  s'exécute hors de la boucle de simulation.

#### Déterminisme, unités et configuration

- À entrée et configuration identiques, la sortie et le rapport sont strictement
  identiques, y compris leur ordre. `Math.random()`, l'horloge, un état global
  mutable, l'ordre non déterministe de tâches et toute dépendance au fichier en
  cours de traitement sont exclus.
- Toute résolution, fenêtre ou portée de voisinage est exprimée en mètres. Un
  nombre de points peut être rapporté, mais ne définit jamais seul une fenêtre.
- Tous les paramètres sont regroupés dans une configuration explicitement
  validée avant le traitement, documentée, copiée défensivement et profondément
  immuable. Aucun nombre magique, seuil caché, valeur implicite ou paramètre
  déduit du fichier traité n'est admis.

#### Validation, stabilité numérique et atomicité

- L'entrée, la configuration et la totalité du résultat candidat sont validées.
  Une erreur ne publie ni sortie partielle ni rapport partiel et ne mute aucune
  entrée.
- Les distances et altitudes produites sont finies ; les distances commencent à
  zéro, sont strictement croissantes et finissent exactement à la longueur
  horizontale d'entrée, strictement conservée. Toute pente dérivée après
  préparation est finie. Aucun `NaN` ou `Infinity` n'est accepté.
- Le résultat, sa configuration rapportée, ses collections et leurs éléments
  sont profondément immuables.

#### Conservation et traçabilité

- La longueur horizontale totale et les emplacements horizontaux initial et
  final sont conservés exactement. Tout changement futur du nombre de points
  devra conserver ces invariants et une correspondance explicite avec les
  intervalles source.
- Chaque point ou intervalle préparé est rattachable à un ou plusieurs indices
  ou intervalles de la trace canonique source. Le rapport identifie sans
  ambiguïté les points ou intervalles dont l'altitude a changé.
- Les altitudes de départ et d'arrivée font l'objet d'une politique nommée dans
  la configuration et reproduite dans le rapport. Leur conservation ou leur
  modification reste un choix ouvert : aucune valeur d'extrémité ne peut être
  conservée, corrigée ou déplacée silencieusement.
- Un rapport avant/après profondément immuable contient au minimum : nombre de
  points, longueur horizontale, altitudes minimale et maximale, dénivelés positif
  et négatif, pentes minimale et maximale, nombre d'échantillons modifiés,
  amplitude maximale de correction d'altitude, localisation source des
  corrections extrêmes et configuration complète utilisée. Les conventions de
  calcul et règles de départage des extrema devront être documentées.

#### Intervalles longs et cohérence du profil

- Un intervalle long ne peut pas être assimilé silencieusement à une zone dense.
  L'algorithme devra appliquer et rapporter une politique explicite parmi la
  conservation, le signalement, la séparation de traitement ou le rejet. Cette
  politique ne corrige pas implicitement la géométrie.
- Une éventuelle limitation de pente agit en construisant un profil d'altitude
  cohérent, puis les pentes sont dérivées de ce profil. Un clamp direct de
  `rawGrade` est exclu : il risquerait des discontinuités et un déplacement
  implicite de l'altitude d'arrivée.

#### Tests d'acceptation futurs

La future implémentation couvrira au minimum, par tests synthétiques aux résultats
explicitement attendus : profil plat, montée régulière, descente régulière,
sommet, vallée, pic isolé, creux isolé, espacements irréguliers, intervalle
horizontal très long, altitude négative, très petite distance horizontale et
traitement des deux extrémités. Des tests transversaux vérifieront le
déterminisme par exécutions répétées, l'immutabilité des entrées/configuration/
sorties, les invariants numériques et horizontaux, la traçabilité et l'échec de
validation sans sortie partielle.

#### Performance

La cible algorithmique est `O(n)` ou `O(n log n)` en temps, avec une mémoire
documentée et proportionnée au résultat. Les allocations temporaires par segment
dans les boucles nombreuses sont évitées. Cette cible sera mesurée avant toute
optimisation ; elle ne justifie ni dépendance supplémentaire ni complexité
prématurée.

### Choix encore ouverts

- la résolution spatiale et une éventuelle stratégie de rééchantillonnage ;
- la portée des fenêtres en mètres et leur traitement aux extrémités ;
- la méthode de détection et de préparation des anomalies altimétriques ;
- la politique des altitudes de départ et d'arrivée et sa justification ;
- la politique applicable aux intervalles longs ;
- les seuils de pente ou de correction, s'ils sont finalement justifiés ;
- la représentation détaillée de la traçabilité et du rapport ;
- le traitement d'un point source contribuant à plusieurs échantillons préparés.

### Informations manquantes avant le choix d'un algorithme

Une analyse déterministe doit fournir, pour chaque étape et pour le corpus agrégé :

- les percentiles des espacements horizontaux ;
- les percentiles des variations d'altitude signées et absolues ;
- les percentiles des valeurs absolues de pente brute ;
- les effectifs au-dessus de seuils diagnostiques explicites et documentés ;
- les localisations source nécessaires à l'examen des queues de distribution.

Cette analyse est uniquement diagnostique, ne transforme aucune donnée et
conserve les valeurs sans les présenter comme des seuils de préparation. Elle
constitue la prochaine tâche unique.

### Hors périmètre

Cette décision n'ajoute aucun filtrage, lissage, rejet de point, correction
d'altitude, rééchantillonnage, moyenne glissante, filtre médian, gaussien ou de
Savitzky-Golay, clamp, correction des 82 sauts, seuil numérique de préparation,
API de transformation, dépendance, conversion GPX vers `PrecompiledCourse`,
intégration au laboratoire ou modification de la physique. Elle ne prétend pas
déterminer l'altitude réelle ni corriger les fichiers source.

## Conséquences

La préparation future possède une frontière testable qui préserve la géométrie
horizontale et rend toute correction altimétrique observable. Le choix de
l'algorithme est différé jusqu'à l'obtention de distributions reproductibles ;
aucun paramètre n'est inventé depuis les seuls extrema et moyennes disponibles.

## Alternatives considérées

- Fenêtre définie par un nombre fixe de voisins : rejetée, car l'espacement varie
  de moins d'un mètre à plusieurs centaines de mètres.
- Clamp direct des pentes brutes : rejeté, car il ne garantit pas un profil
  d'altitude continu ni la maîtrise de l'altitude finale.
- Choisir immédiatement un filtre et ses seuils depuis les extrema : rejeté, car
  les distributions et la fréquence des anomalies sont inconnues.
- Corriger les sauts horizontaux dans la préparation altimétrique : rejeté, car
  cette responsabilité appartient à la qualité géométrique.

## Date ou référence de PR

Pull Request dédiée à la définition des exigences de préparation altimétrique.
