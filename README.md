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

GitHub Actions workflow `.github/workflows/deploy-pages.yml` builds and publishes `out/` to the `gh-pages` branch.
