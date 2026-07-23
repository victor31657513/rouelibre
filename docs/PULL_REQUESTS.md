# Pull Requests

La description d'une Pull Request explique son objectif et son périmètre, présente les tests réellement exécutés et signale les limites importantes. Sa structure exacte n'est pas bloquante. Les descriptions automatiques utilisant les rubriques `Motivation` / `Description` / `Testing` sont acceptées.

Le modèle `.github/pull_request_template.md` propose une structure détaillée pour les Pull Requests rédigées manuellement. Il sert d'aide à la rédaction et ne constitue pas un contrat vérifié automatiquement. Ses commentaires HTML guident la rédaction. Lorsqu'une rubrique proposée ne s'applique pas, une phrase complète peut en expliquer la raison.

La description est construite à partir du diff réel et ne mentionne que les tests effectivement exécutés. Les résultats observables sont précis et vérifiables, et le périmètre reste distinct des sujets volontairement exclus.

## Fusion automatique

Le workflow GitHub Actions `Enable Pull Request Auto-Merge` programme l'auto-merge avec la méthode `merge commit`. Il réagit aux événements `opened`, `reopened`, `ready_for_review` et `synchronize` d'une Pull Request ciblant `main`.

Une Pull Request est éligible uniquement si elle n'est pas en brouillon, si sa branche source appartient au même dépôt, si son auteur correspond au propriétaire du dépôt et si sa branche cible est `main`. Les Pull Requests provenant d'un fork, créées par un contributeur externe, en brouillon ou ciblant une autre branche sont exclues.

Le workflow utilise seulement les métadonnées de la Pull Request et la CLI GitHub préinstallée sur le runner. Il ne récupère et n'exécute aucun code de la branche source. Ses permissions en écriture sont limitées à `contents` et `pull-requests` afin de demander l'auto-merge avec le jeton éphémère fourni par GitHub Actions.

L'auto-merge ne contourne aucune protection et ne fusionne pas directement une Pull Request. Le ruleset `Protect main` et son contrôle obligatoire `Pull Request Checks / verify` déterminent si la fusion peut intervenir. Ce contrôle installe les dépendances verrouillées, vérifie les types, exécute les tests et produit le build. Le workflow d'auto-merge réussit si la demande est programmée, si elle l'était déjà ou si GitHub indique que la Pull Request est déjà fusionnée ; il échoue explicitement si la Pull Request reste ouverte sans demande d'auto-merge.

L'auto-merge reste désactivé si la CI échoue, si les tests requis n'ont pas été exécutés, si la documentation nécessaire est absente, si un problème connu compromet la cohérence de la simulation, la stabilité numérique ou le déterminisme, ou si la Pull Request est incomplète ou laissée en brouillon.

Après une mise à jour de la branche source, l'événement `synchronize` réexécute le workflow. La vérification idempotente conserve une demande d'auto-merge existante sans erreur ; les protections imposent une nouvelle exécution réussie de `Pull Request Checks / verify` avant la fusion.

### Diagnostic d'un échec

1. Vérifier que la Pull Request respecte toutes les conditions d'éligibilité et que le job n'a pas été ignoré pour une exclusion attendue.
2. Consulter les journaux du workflow `Enable Pull Request Auto-Merge` et relever l'état retourné par la CLI GitHub.
3. Vérifier que l'option `Allow auto-merge` est active, que le ruleset `Protect main` est actif et que `Pull Request Checks / verify` demeure obligatoire.
4. Vérifier les permissions effectives du `GITHUB_TOKEN` et l'absence d'une restriction d'organisation empêchant la programmation de l'auto-merge.
5. Signaler explicitement l'échec sans fusion manuelle, sans `--admin`, sans PAT et sans affaiblir le ruleset. Une correction éventuelle fait l'objet d'une Pull Request distincte.

La Pull Request qui introduit ce workflow suit le processus de fusion sécurisé existant, car le workflow n'est pas encore disponible sur `main` à son ouverture. La Pull Request suivante constitue la première validation réelle : elle doit montrer que `Pull Request Checks / verify` s'exécute et réussit avant la fusion, qu'aucune protection n'est contournée et que le push de fusion sur `main` déclenche le workflow GitHub Pages. Un défaut de déclenchement de GitHub Pages est signalé et analysé séparément, sans ajouter de PAT ou de secret personnalisé.

## Audit post-fusion

ChatGPT compare la description au diff réel après la fusion et rend l'un des verdicts suivants :

- **VALIDÉE** : la modification fusionnée est conforme et le projet peut passer à la tâche suivante ;
- **PR CORRECTIVE** : une correction doit être réalisée dans une nouvelle Pull Request ciblée ;
- **NOUVELLE PR** : le besoin identifié relève d'un autre périmètre ;
- **BLOQUÉE** : un problème empêche de poursuivre le développement.

La fusion automatique ne déclenche pas la tâche suivante. Codex attend l'audit post-fusion et le verdict **VALIDÉE** avant de commencer la phase ou la tâche suivante.

Si l'audit exige une correction, la branche `main` n'est pas réécrite et la Pull Request initiale n'est pas rouverte. Codex prépare une nouvelle Pull Request corrective minimale, testable et documentée.
