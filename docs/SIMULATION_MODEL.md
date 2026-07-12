# Modèle de simulation

## Statut

Aucun modèle de simulation cycliste n'est implémenté ou validé.

## Principes prévus

Les futures implémentations du moteur utilisent les unités SI et évitent les sources de hasard implicites. Le code de simulation ne doit pas appeler directement `Math.random()` ; toute variabilité doit passer par une abstraction déterministe et testable.

## Prochaine étape prévue

La prochaine tâche projet est le moteur déterministe minimal d'un coureur isolé sur route plate. Cette étape reste hors du périmètre du socle actuel.
