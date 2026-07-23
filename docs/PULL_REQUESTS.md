# Pull Requests

La description d'une Pull Request explique son objectif et son périmètre, présente les tests réellement exécutés et signale les limites importantes. Sa structure exacte n'est pas bloquante. Les descriptions automatiques utilisant les rubriques `Motivation` / `Description` / `Testing` sont acceptées.

Le modèle `.github/pull_request_template.md` propose une structure détaillée pour les Pull Requests rédigées manuellement. Il sert d'aide à la rédaction et ne constitue pas un contrat vérifié automatiquement. Ses commentaires HTML guident la rédaction. Lorsqu'une rubrique proposée ne s'applique pas, une phrase complète peut en expliquer la raison.

La description est construite à partir du diff réel et ne mentionne que les tests effectivement exécutés. Les résultats observables sont précis et vérifiables, et le périmètre reste distinct des sujets volontairement exclus.

## Vérifications avant ouverture

Les Pull Requests ne déclenchent aucun workflow GitHub Actions de vérification du code. Avant d'ouvrir une Pull Request non brouillon, Codex exécute donc systématiquement :

```text
pnpm typecheck
pnpm test
pnpm build
git diff --check
```

Codex exécute également les tests ciblés nécessaires au périmètre modifié. La description de la Pull Request indique uniquement les commandes réellement exécutées et leurs résultats. Si une vérification échoue, Codex corrige l'échec ou arrête la tâche en signalant précisément le problème ; il ne rend pas la Pull Request prête à être fusionnée automatiquement.

L'absence de CI sur les Pull Requests ne réduit pas les exigences de tests, de documentation, de déterminisme ou de stabilité numérique. Le workflow GitHub Pages réalise ses vérifications et son build seulement après un push sur `main`, ou lors d'un déclenchement manuel sur `main` ; il ne valide pas le code d'une Pull Request avant sa fusion.

## Fusion automatique

Le workflow GitHub Actions `Enable Pull Request Auto-Merge` programme l'auto-merge avec la méthode `merge commit`. Il réagit aux événements `opened`, `reopened`, `ready_for_review` et `synchronize` d'une Pull Request ciblant `main`.

Une Pull Request est éligible uniquement si elle n'est pas en brouillon, si sa branche source appartient au même dépôt, si son auteur correspond au propriétaire du dépôt et si sa branche cible est `main`. Les Pull Requests provenant d'un fork, créées par un contributeur externe, en brouillon ou ciblant une autre branche sont exclues.

Le workflow vérifie uniquement ces critères d'éligibilité à partir des métadonnées de la Pull Request et utilise la CLI GitHub préinstallée sur le runner. Il ne récupère et n'exécute aucun code de la branche source et ne réalise aucun typecheck, test ou build. Ses permissions en écriture sont limitées à `contents` et `pull-requests` afin de demander l'auto-merge avec le jeton éphémère fourni par GitHub Actions.

Le dépôt ne configure aucun contrôle obligatoire ni protection équivalente conditionnant la fusion à une vérification du code. Une Pull Request éligible peut donc être fusionnée dès que GitHub accepte la demande d'auto-merge. Il ne s'agit pas d'un contournement de protection : aucune protection de ce type n'est configurée. Le workflow réussit si la demande est programmée, si elle l'était déjà ou si GitHub indique que la Pull Request est déjà fusionnée ; il échoue explicitement si la Pull Request reste ouverte sans demande d'auto-merge.

Codex ne rend pas la Pull Request prête à être fusionnée automatiquement si une vérification locale échoue, si les tests requis n'ont pas été exécutés, si la documentation nécessaire est absente, si un problème connu compromet la cohérence de la simulation, la stabilité numérique ou le déterminisme, ou si la Pull Request est incomplète.

Après une mise à jour de la branche source, l'événement `synchronize` réexécute uniquement le workflow d'auto-merge. Sa vérification idempotente conserve une demande d'auto-merge existante sans erreur ; aucune vérification du code de la Pull Request n'est déclenchée.

### Diagnostic d'un échec

1. Vérifier que la Pull Request respecte toutes les conditions d'éligibilité et que le job n'a pas été ignoré pour une exclusion attendue.
2. Consulter les journaux du workflow `Enable Pull Request Auto-Merge` et relever l'état retourné par la CLI GitHub.
3. Vérifier que l'option `Allow auto-merge` est active.
4. Vérifier les permissions effectives du `GITHUB_TOKEN` et l'absence d'une restriction d'organisation empêchant la programmation de l'auto-merge.
5. Signaler explicitement l'échec sans fusion manuelle, sans `--admin` et sans PAT. Une correction éventuelle fait l'objet d'une Pull Request distincte.

## Audit post-fusion

ChatGPT compare la description au diff réel après la fusion et rend l'un des verdicts suivants :

- **VALIDÉE** : la modification fusionnée est conforme et le projet peut passer à la tâche suivante ;
- **PR CORRECTIVE** : une correction doit être réalisée dans une nouvelle Pull Request ciblée ;
- **NOUVELLE PR** : le besoin identifié relève d'un autre périmètre ;
- **BLOQUÉE** : un problème empêche de poursuivre le développement.

La fusion automatique ne déclenche pas la tâche suivante. Codex attend l'audit post-fusion et le verdict **VALIDÉE** avant de commencer la phase ou la tâche suivante.

Si l'audit exige une correction, la branche `main` n'est pas réécrite et la Pull Request initiale n'est pas rouverte. Codex prépare une nouvelle Pull Request corrective minimale, testable et documentée.
