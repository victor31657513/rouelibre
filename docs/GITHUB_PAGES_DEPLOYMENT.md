# Publication GitHub Pages du laboratoire

Le laboratoire web dispose d'un workflow GitHub Actions dédié au build et à la publication statique sur GitHub Pages. Lorsqu'un déploiement GitHub Pages réussit, le site publié correspond au contenu de la branche `main` après validation du workspace.

## Branche `main`

Chaque push sur `main` déclenche le workflow `Deploy Lab to GitHub Pages`. Les Pull Requests ne déclenchent pas de workflow GitHub Actions et ne publient pas de site GitHub Pages.

## Déclenchement manuel

Le workflow accepte aussi un déclenchement manuel avec `workflow_dispatch` depuis l'interface GitHub Actions. Ce mode reconstruit et publie le laboratoire lorsque la branche sélectionnée est `main`.

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
- Site inaccessible après publication : consulter l'URL exposée par l'environnement `github-pages` et les journaux de l'étape `Deploy to GitHub Pages`.
