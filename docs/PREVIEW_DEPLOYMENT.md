# Déploiement de prévisualisation du laboratoire

Le laboratoire web dispose d'un workflow GitHub Actions dédié au build et au déploiement statique de prévisualisation. Le site produit est destiné à être servi à la racine d'un sous-domaine dédié, par exemple `https://preview.example.com/`.

## Branche `preview`

La branche longue durée `preview` sert de source automatique pour l'environnement de prévisualisation. Chaque push sur `preview` déclenche le workflow `Deploy Preview Lab` et remplace le contenu distant par le dernier build validé.

Les Pull Requests ne déclenchent pas ce workflow. Les vérifications de Pull Request restent portées par le workflow CI dédié.

## Déclenchement manuel

Le workflow accepte aussi un déclenchement manuel avec `workflow_dispatch` depuis l'interface GitHub Actions. Ce mode permet de reconstruire et redéployer le laboratoire depuis la branche sélectionnée dans GitHub, sans pousser de nouveau commit.

## Environnement et secrets GitHub

Le job utilise l'environnement GitHub `preview`. Les secrets suivants doivent être configurés dans cet environnement :

| Secret | Rôle |
| --- | --- |
| `PREVIEW_HOST` | Adresse IP ou nom d'hôte SSH du serveur de prévisualisation. |
| `PREVIEW_PORT` | Port SSH, généralement `22`. |
| `PREVIEW_USER` | Utilisateur SSH autorisé à écrire dans le dossier de destination. |
| `PREVIEW_SSH_KEY` | Clé privée SSH utilisée par GitHub Actions pour la connexion. |
| `PREVIEW_PATH` | Chemin absolu de destination sur le serveur, par exemple `/var/www/roue-libre-preview`. |

Le workflow vérifie explicitement la présence des cinq secrets avant la connexion SSH. Il vérifie aussi que `PREVIEW_PATH` est un chemin absolu non vide et différent de `/`, afin d'empêcher l'utilisation de `rsync --delete` sur la racine du serveur.

## Dossier produit par Vite

La commande de build du workspace produit le laboratoire statique dans :

```text
apps/lab/dist
```

Le workflow vérifie l'existence de `apps/lab/dist/index.html` avant de publier l'artefact et avant le déploiement. Le dossier `dist` reste un artefact de build local ou CI et ne doit pas être commité dans Git.

Le build Vite conserve une base `/`, car le serveur de prévisualisation sert l'application à la racine du sous-domaine et non dans un sous-répertoire.

## Configuration serveur attendue

Le serveur doit :

- accepter une connexion SSH avec l'utilisateur configuré dans `PREVIEW_USER` ;
- autoriser cet utilisateur à créer et écrire dans `PREVIEW_PATH` ;
- servir le contenu de `PREVIEW_PATH` comme site statique à la racine du sous-domaine de prévisualisation ;
- retourner `index.html` et les assets produits par Vite depuis ce même dossier.

Le workflow crée le dossier distant si nécessaire, puis synchronise le contenu de `apps/lab/dist/` vers `PREVIEW_PATH/` avec `rsync -az --delete`. La barre oblique finale sur `apps/lab/dist/` signifie que le contenu du dossier est copié, pas le dossier `dist` lui-même.

## Artefact GitHub Actions

Chaque exécution publie l'artefact `roue-libre-lab-preview` avec une rétention de 7 jours. Cet artefact contient le site statique compilé et permet de récupérer manuellement le build même si la configuration SSH du serveur n'est pas encore opérationnelle.

## Diagnostic d'un échec

- Échec pendant l'installation : vérifier la disponibilité de pnpm `10.28.1`, Node.js `24` et la cohérence de `pnpm-lock.yaml` avec `pnpm install --frozen-lockfile`.
- Échec de typecheck, tests ou build : reproduire localement avec `pnpm typecheck`, `pnpm test` et `pnpm build`.
- Échec `apps/lab/dist/index.html` : vérifier que le build Vite du laboratoire produit bien `apps/lab/dist`.
- Échec de validation des secrets : configurer les cinq secrets dans l'environnement GitHub `preview` et vérifier que `PREVIEW_PATH` est absolu et différent de `/`.
- Échec `ssh-keyscan` ou SSH : vérifier `PREVIEW_HOST`, `PREVIEW_PORT`, les règles réseau, la clé privée et la présence de la clé publique correspondante dans `authorized_keys` côté serveur.
- Échec `rsync` : vérifier que `rsync` est disponible côté serveur et que `PREVIEW_USER` peut écrire dans `PREVIEW_PATH`.
- Site inaccessible après déploiement : vérifier la configuration du serveur web et le pointage du sous-domaine vers le dossier `PREVIEW_PATH`.
