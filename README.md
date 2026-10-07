# Karguvel K — talking-video portfolio

Production-ready personal portfolio (Next.js 15 App Router, static export for GitHub Pages).

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Static export to `out/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run test:e2e` | Playwright screenshots + overflow checks |
| `npm run hero:assets` | Build hero video loop from a Flow export |

## Sections

| # | Section | ID |
| --- | --- | --- |
| 01 | Hero | `#hero` |
| 02 | About | `#about` |
| 03 | Skills | `#skills` |
| 04 | Work | `#work` |
| 05 | Experience | `#experience` |
| 06 | Contact | `#contact` |

Content lives in `src/lib/data.ts`.

## Hero video (Google Flow)

1. Export your talking-head clip from Flow using `uploads/flow-prompt` as the script reference.
2. Run `python3 scripts/build-hero-assets.py --input /path/to/flow-export.mp4`.
3. Outputs `public/hero/hero.mp4` and `public/hero/hero.webm`. The site auto-detects them via `HEAD` and swaps the still for video.

Until then, `public/character.jpg` is shown with `mix-blend-mode: multiply`.

## Still assets

`python3 scripts/generate-static-images.py` rebuilds `public/portrait-bust.webp` and `public/og.jpg` from `public/character.jpg`.

## Résumé PDF

Add `public/resume.pdf` to show the Résumé button (hidden until the file exists).

## Logo credits

Brand marks under `public/logos/` are from [Simple Icons](https://simpleicons.org/) (MIT). See `public/logos/LICENSE`.

## Deploy (GitHub Pages)

| Branch | Role |
| --- | --- |
| **`main`** | Application source (this repo). Push here to ship changes. |
| **`gh-pages`** | Generated static site only (`out/`). Do not edit by hand. |

On every push to **`main`**, [Deploy to GitHub Pages](.github/workflows/deploy-pages.yml) runs `npm run build` and replaces `gh-pages` with the contents of `out/`.

### After you merge the portfolio PR

1. **Merge into `main`** (not into `gh-pages`). The PR should target `main`.
2. Wait for the **Deploy to GitHub Pages** workflow on `main` to finish (about one minute).
3. In the repo **Settings → Pages**, set **Build and deployment** to **Deploy from a branch**, branch **`gh-pages`**, folder **`/ (root)`**. (If it already points at `gh-pages`, leave it.)

No local build is required. Merging to `main` is the only step.

If source is ever pushed to `gh-pages` by mistake, the same workflow runs (when `package.json` is present), rebuilds, and restores the static site.

### Screenshots (CI / local)

`npm run test:e2e` writes viewport captures under `tests/artifacts/`:

- `desktop-{hero|about|skills|work|experience}-1440x900.png`
- `mobile-{hero|about|skills|work|experience}-390x844.png`
