# Pull Requests

La description d'une Pull Request explique son objectif et son périmètre, présente les tests réellement exécutés et signale les limites importantes. Sa structure exacte n'est pas bloquante. Les descriptions automatiques utilisant les rubriques `Motivation` / `Description` / `Testing` sont acceptées.

Le modèle `.github/pull_request_template.md` propose une structure détaillée pour les Pull Requests rédigées manuellement. Il sert d'aide à la rédaction et ne constitue pas un contrat vérifié automatiquement. Ses commentaires HTML guident la rédaction. Lorsqu'une rubrique proposée ne s'applique pas, une phrase complète peut en expliquer la raison.

La description est construite à partir du diff réel et ne mentionne que les tests effectivement exécutés. Les résultats observables sont précis et vérifiables, et le périmètre reste distinct des sujets volontairement exclus.

## Fusion automatique

Codex active l'auto-merge après avoir terminé l'implémentation, exécuté les tests prévus, mis à jour la documentation concernée, vérifié le périmètre de la tâche et renseigné la description de la Pull Request. La fusion intervient uniquement lorsque toutes les vérifications obligatoires de la CI ont réussi.

L'auto-merge reste désactivé si la CI échoue, si les tests requis n'ont pas été exécutés, si la documentation nécessaire est absente, si un problème connu compromet la cohérence de la simulation, la stabilité numérique ou le déterminisme, ou si la Pull Request est incomplète ou laissée en brouillon.

## Audit post-fusion

ChatGPT compare la description au diff réel après la fusion et rend l'un des verdicts suivants :

- **VALIDÉE** : la modification fusionnée est conforme et le projet peut passer à la tâche suivante ;
- **PR CORRECTIVE** : une correction doit être réalisée dans une nouvelle Pull Request ciblée ;
- **NOUVELLE PR** : le besoin identifié relève d'un autre périmètre ;
- **BLOQUÉE** : un problème empêche de poursuivre le développement.

La fusion automatique ne déclenche pas la tâche suivante. Codex attend le verdict **VALIDÉE** avant de commencer la phase ou la tâche suivante.

Si l'audit exige une correction, la branche `main` n'est pas réécrite et la Pull Request initiale n'est pas rouverte. Codex prépare une nouvelle Pull Request corrective minimale, testable et documentée.
