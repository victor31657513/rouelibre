# Longueur finie et arrivée minimale

## Statut

Accepté.

## Décision

Un `LongitudinalCourse` accepte l’option typée `totalLengthMeters`. Cette longueur est facultative pour conserver les parcours historiques sans arrivée, et elle est validée comme nombre fini strictement positif et strictement supérieur au début du dernier segment. Le parcours et ses segments restent des copies défensives gelées.

Le contrôleur du laboratoire exécute un tick fixe complet, puis détecte une distance égale ou supérieure à la longueur. Il borne la distance à la ligne, marque l’arrivée et cesse tout tick ultérieur. Temps, vitesse, énergie et observables restent figés jusqu’à une réinitialisation ou un passage vers un parcours sans arrivée.

## Conséquences

La progression, la distance restante et l’état d’arrivée sont des calculs purs d’observation. Une distance au-delà de la ligne donne une progression bornée à 1 et une distance restante de zéro. Les parcours sans longueur ne produisent pas d’état d’arrivée.

La ligne n’interrompt pas un tick et aucune interpolation sous-tick n’est effectuée. L’heure d’arrivée possède donc une précision maximale d’un pas fixe (`1 / 60 s`). Cette simplification préserve les équations physiques et énergétiques, le déterminisme et l’absence d’allocation dans la résolution de pente.
