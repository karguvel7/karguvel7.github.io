#!/usr/bin/env bash
# Run locally after creating https://github.com/karguvel7/talking-portfolio (empty, public).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

git clone --depth 1 --branch talking-video-portfolio "$ROOT" "$TMP/site"
cd "$TMP/site"
rm -f .github/workflows/deploy-pages.yml
cp .github/workflows/deploy-talking-portfolio-pages.yml .github/workflows/deploy-pages.yml
git add -A
git commit -m "Configure GitHub Pages deploy (Actions)" --allow-empty
git remote add publish "https://github.com/karguvel7/talking-portfolio.git"
git push -f publish HEAD:main

gh api -X PUT "repos/karguvel7/talking-portfolio/pages" \
  -f build_type=workflow \
  -f "source[branch]=main" \
  -f "source[path]=/"

echo "Pushed to karguvel7/talking-portfolio main. Enable Pages → GitHub Actions if the API call fails."
