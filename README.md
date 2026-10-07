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

## Deploy

| Branch | Role |
| --- | --- |
| **`gh-pages`** | **Live** portfolio (default branch). Do not overwrite from this project. |
| **`talking-video-portfolio`** | Next.js talking-video source. CI builds `out/` and uploads a workflow artifact only. |

To preview locally: `npm run build` then `npx serve out`.

**Live preview (project site):** https://karguvel7.github.io/talking-portfolio/ — built from repo [karguvel7/talking-portfolio](https://github.com/karguvel7/talking-portfolio) (`main`). Uses `basePath` `/talking-portfolio`.

The default site at https://karguvel7.github.io/ remains the `gh-pages` branch in this repo and is not modified by this project.

### Screenshots (CI / local)

`npm run test:e2e` writes viewport captures under `tests/artifacts/`:

- `desktop-{hero|about|skills|work|experience}-1440x900.png`
- `mobile-{hero|about|skills|work|experience}-390x844.png`
