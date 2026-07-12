# Déploiement de prévisualisation

Le workflow `deploy-preview.yml` publie le contenu généré de `apps/lab/dist/` vers l'environnement GitHub `preview` lorsque la branche `preview` reçoit un push ou lorsqu'il est lancé manuellement avec `workflow_dispatch`.

## Paramètres requis

Les secrets ou variables d'environnement du déploiement fournissent les paramètres SSH suivants :

- `PREVIEW_USER` : nom d'utilisateur Unix utilisé pour la connexion SSH.
- `PREVIEW_HOST` : hôte SSH de prévisualisation.
- `PREVIEW_PORT` : port SSH, entier compris entre `1` et `65 535`.
- `PREVIEW_PATH` : chemin absolu de destination situé sous `/var/www/`.
- `PREVIEW_SSH_KEY` : clé privée SSH temporaire utilisée par le workflow.
- `PREVIEW_KNOWN_HOSTS` : entrée `known_hosts` attendue pour l'hôte de prévisualisation.

## Contraintes de destination

`PREVIEW_PATH` doit commencer par `/var/www/` et désigner un sous-répertoire de `/var/www/`. Les valeurs `/`, `/var` et `/var/www` sont refusées. Le chemin ne contient pas de segment `.` ou `..`, d'espace, de tabulation, de retour à la ligne ou de caractère de contrôle.

Après la création du dossier distant, le workflow résout le chemin avec `realpath` côté serveur et vérifie que le chemin canonique commence par `/var/www/` et n'est pas exactement `/var/www`. La synchronisation `rsync --delete` utilise ce chemin canonique et ne s'exécute pas si cette vérification échoue.
