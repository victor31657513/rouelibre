# Pull Requests

Chaque Pull Request utilise, sans renommer ni réordonner ses rubriques, la structure de `.github/pull_request_template.md`. Chaque rubrique contient une réponse concrète issue de l’état initial et du diff réel. Les commentaires HTML du modèle sont des guides et ne constituent pas une réponse.

Lorsqu’une rubrique ne s’applique pas, une phrase complète en explique la raison, par exemple : « Sans objet : cette PR ne modifie aucune boucle de simulation ni aucun comportement d’exécution. » Les réponses isolées `N/A`, `RAS`, `TODO`, `TBD` et `à compléter` sont refusées, de même que les listes vides.

Le workflow séparé `PR Description Check` relance le validateur à la création, à la modification, à la synchronisation, à la réouverture et au passage en revue d’une Pull Request. Il utilise l’événement `pull_request` avec des permissions de lecture minimales et transmet le corps par le fichier d’événement GitHub, sans interpolation dans le shell. Les Pull Requests issues de forks exécutent le code de leur branche dans un contexte en lecture seule et sans secret.

Le contrôle garantit la structure et la présence d’un contenu utile, pas la véracité de la description. ChatGPT compare donc toujours la description au diff réel. Les titres exacts constituent un contrat : toute évolution du modèle nécessite une mise à jour simultanée du validateur et de ses tests.

Pour bloquer la fusion d’une description incomplète, l’administration du dépôt ajoute manuellement le check `PR Description Check / Validate PR description` aux vérifications requises de la branche `main`. Les règles de protection GitHub ne sont pas gérées par ce dépôt.
