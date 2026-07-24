# Publication GitHub Pages du laboratoire

Le laboratoire web dispose d'un workflow GitHub Actions dédié au build et à la publication statique sur GitHub Pages. Lorsqu'un déploiement GitHub Pages réussit, le site publié correspond au contenu de la branche `main` après validation du workspace.

## Déclenchements sur `main`

Chaque push ordinaire sur `main` déclenche le workflow `Deploy Lab to GitHub Pages`. Les Pull Requests ne construisent et ne publient pas le laboratoire avant leur fusion.

GitHub n'engendre pas de nouvelle exécution de workflow à partir d'un événement `push` produit par le `GITHUB_TOKEN`, sauf exceptions documentées qui ne couvrent pas ce déclenchement. Une fusion réalisée par le workflow d'auto-merge avec ce jeton met donc `main` à jour sans lancer le déclencheur `push` de déploiement.

`Enable Pull Request Auto-Merge` conserve le chemin principal dans une seule exécution : ouverture de la Pull Request, demande d'auto-merge, interrogation de l'état toutes les deux secondes pendant au plus 60 tentatives, observation de `MERGED`, puis orchestration du déploiement. L'événement `pull_request_target: closed` reste un secours pour les fusions humaines ou réalisées avec un autre jeton ; une fusion réalisée avec `GITHUB_TOKEN` n'en dépend pas.

Après avoir confirmé `MERGED`, le workflow exige le SHA du commit de fusion, vérifie si une exécution de `deploy-pages.yml` existe pour ce commit et, en l'absence d'une telle exécution, lance :

```bash
gh workflow run deploy-pages.yml --ref main
```

Le workflow sonde ensuite les exécutions `workflow_dispatch` couvrant le SHA de fusion et exige d'en observer une avant de confirmer le déclenchement. Un retour réussi de `gh workflow run` ne constitue pas à lui seul une preuve. Le déploiement résultant construit la référence `main`. Une PR qui ne devient pas `MERGED` dans la fenêtre d'environ 120 secondes ne déclenche rien et fait échouer l'orchestration avec un diagnostic explicite. La recherche préalable et la sérialisation des exécutions par numéro de PR limitent les déploiements en double lors d'une relance ou lorsqu'un workflow `push` existe déjà.

## Déclenchement manuel

Le workflow accepte aussi un déclenchement manuel avec `workflow_dispatch` depuis l'interface GitHub Actions. Ce mode reconstruit et publie le laboratoire lorsque la branche sélectionnée est `main`.

Quelle que soit l'origine du déclenchement, `.github/workflows/deploy-pages.yml` est l'unique propriétaire de l'installation des dépendances, du typecheck, des tests, du build du laboratoire, de la création de l'artefact Pages et de son déploiement. Le workflow d'auto-merge ne contient aucune étape de construction ou de publication.

## Environnement et permissions GitHub

Le job utilise l'environnement GitHub `github-pages` et les permissions minimales nécessaires à GitHub Pages :

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

Aucun secret personnalisé n'est requis pour la publication. Le dépôt doit utiliser GitHub Pages avec la source `GitHub Actions` dans les réglages du dépôt.

## Dossier produit par Vite

La commande de build du workspace produit le laboratoire statique dans :

```text
apps/lab/dist
```

Le workflow vérifie l'existence de `apps/lab/dist/index.html`, puis téléverse `apps/lab/dist` avec `actions/upload-pages-artifact`. Le dossier `dist` reste un artefact de build local ou CI et ne doit pas être commité dans Git.

## Base Vite pour GitHub Pages

Le développement local conserve une base Vite `/`.

Pendant le workflow GitHub Pages, l'étape `Determine Vite base path` définit `VITE_BASE_PATH` à partir de `GITHUB_REPOSITORY` :

- `/` pour un dépôt utilisateur ou organisation de type `<propriétaire>.github.io` ;
- `/<nom-du-dépôt>/` pour un dépôt projet GitHub Pages.

Cette variable est l'unique entrée utilisée par `apps/lab/vite.config.ts` pour produire les chemins des bundles JavaScript, des feuilles de style, des assets Vite, des fichiers éventuels placés dans `public`, des imports dynamiques et des Web Workers gérés par Vite.

## Diagnostic d'un échec

- Échec pendant l'installation : vérifier la disponibilité de pnpm `10.28.1`, Node.js `24` et la cohérence de `pnpm-lock.yaml` avec `pnpm install --frozen-lockfile`.
- Échec de typecheck, tests ou build : reproduire localement avec `pnpm typecheck`, `pnpm test` et `pnpm build`.
- Échec `apps/lab/dist/index.html` : vérifier que le build Vite du laboratoire produit bien `apps/lab/dist`.
- Échec de publication GitHub Pages : vérifier que GitHub Pages utilise la source `GitHub Actions`, que l'environnement `github-pages` autorise le déploiement depuis `main` et que les permissions du workflow incluent `pages: write` et `id-token: write`.
- Absence de déploiement après auto-merge : vérifier les 60 observations bornées de l'état et du SHA, la présence de `actions: write`, puis la recherche d'une exécution existante. Après un déclenchement explicite, vérifier que les journaux confirment une exécution `workflow_dispatch` couvrant le SHA de fusion ; le seul succès de `gh workflow run` est insuffisant.
- Site inaccessible après publication : consulter l'URL exposée par l'environnement `github-pages` et les journaux de l'étape `Deploy to GitHub Pages`.
