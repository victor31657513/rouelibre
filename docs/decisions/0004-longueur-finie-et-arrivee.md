# Longueur finie et arrivée minimale

## Statut

Accepté.

## Contexte

Le dernier segment d’un parcours longitudinal segmenté se prolongeait indéfiniment. Une arrivée minimale est nécessaire avant les futures évolutions du domaine de parcours. Cette étape doit conserver les équations physiques et énergétiques existantes, le pas fixe déterministe et les parcours historiques sans arrivée.

## Décision

Un `LongitudinalCourse` accepte l’option typée `totalLengthMeters`. Cette longueur est facultative pour conserver les parcours historiques sans arrivée, et elle est validée comme nombre fini strictement positif et strictement supérieur au début du dernier segment. Le parcours et ses segments restent des copies défensives gelées.

Le contrôleur du laboratoire exécute un tick fixe complet, puis détecte une distance égale ou supérieure à la longueur. Il borne la distance à la ligne, marque l’arrivée et cesse tout tick ultérieur. Temps, vitesse, énergie, forces, observables et commandes de puissance et de vent restent figés jusqu’à une réinitialisation ou un passage vers un parcours sans arrivée.

## Conséquences

La progression, la distance restante et l’état d’arrivée sont des calculs purs d’observation. Une distance au-delà de la ligne donne une progression bornée à 1 et une distance restante de zéro. Les parcours sans longueur ne produisent pas d’état d’arrivée.

La ligne n’interrompt pas un tick et aucune interpolation sous-tick n’est effectuée. L’heure d’arrivée possède donc une précision maximale d’un pas fixe (`1 / 60 s`). Cette simplification préserve les équations physiques et énergétiques, le déterminisme et l’absence d’allocation dans la résolution de pente.

## Alternatives considérées

- Rendre tous les parcours obligatoirement finis : écarté pour préserver le scénario historique à pente constante et sa progression indéfinie.
- Conserver uniquement des parcours infinis : écarté car aucune ligne d’arrivée observable ne serait disponible.
- Interpoler précisément l’instant de franchissement dans le tick : écarté pour conserver une solution minimale sans calcul sous-tick.
- Découper le tick à la ligne d’arrivée : écarté car cette opération modifierait l’orchestration du pas fixe sans nécessité pour l’observation minimale.
- Introduire immédiatement chronométrage, classement ou plusieurs coureurs : écarté car ces notions dépassent l’arrivée d’un coureur isolé.

## Date ou référence de PR

Pull Request 245 — longueur finie et arrivée minimale.
