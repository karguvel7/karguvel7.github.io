# Karguvel K — portfolio

Source for [karguvel7.github.io](https://karguvel7.github.io).

This repository used to contain only a static Next.js export on `gh-pages` (`index.html`, `_next/`, and related files). There was no `package.json`, `app/`, or component source on any branch. This tree is a maintainable Next.js (App Router) + TypeScript rewrite of that site. Copy, projects, and links were taken from the export. Nothing in the content invents employers, metrics, or repositories.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run typecheck
npm run lint
npm run build
```

`npm run build` writes a static site to `out/` (`output: 'export'` in `next.config.ts`). This is a user/organization site at the domain root, so `basePath` and `assetPrefix` are unset.

## Deploy

GitHub Pages should keep serving the **static export** from the `gh-pages` branch. Application source belongs on **`main`**.

1. Publish this source to `main` (do not replace `gh-pages` with the source tree — Pages would serve `package.json` instead of `index.html`).
2. In the repository settings, leave GitHub Pages set to deploy from the `gh-pages` branch (root).
3. Push to `main`. [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) installs dependencies, runs `npm run build`, and publishes `out/` to `gh-pages` as an orphan branch.

The workflow runs only on `main` (push or manual dispatch from `main`). It does not run on pull requests, so reviewing source cannot overwrite the live site.

You can also build locally and publish by hand:

```bash
npm ci
npm run build
# publish the contents of out/ to the gh-pages branch (orphan history)
```

`public/.nojekyll` is copied into the export so GitHub Pages does not run Jekyll.

## Content

Editable copy lives in [`lib/content.ts`](lib/content.ts). Project cards are case studies. They do not link to invented repository URLs; the only GitHub link is [github.com/karguvel7](https://github.com/karguvel7).
