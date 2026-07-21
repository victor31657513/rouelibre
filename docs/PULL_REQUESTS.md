# Pull Requests

La description d'une Pull Request explique son objectif et son périmètre, présente les tests réellement exécutés et signale les limites importantes. Sa structure exacte n'est pas bloquante. Les descriptions automatiques utilisant les rubriques `Motivation` / `Description` / `Testing` sont acceptées.

Le modèle `.github/pull_request_template.md` propose une structure détaillée pour les Pull Requests rédigées manuellement. Il sert d'aide à la rédaction et ne constitue pas un contrat vérifié automatiquement. Ses commentaires HTML guident la rédaction. Lorsqu'une rubrique proposée ne s'applique pas, une phrase complète peut en expliquer la raison.

La description est construite à partir du diff réel et ne mentionne que les tests effectivement exécutés. Les résultats observables sont précis et vérifiables, et le périmètre reste distinct des sujets volontairement exclus.

ChatGPT compare la description au diff réel lors de l'audit humain. Une Pull Request n'est pas fusionnée avant son verdict explicite.
