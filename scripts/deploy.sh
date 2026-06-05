#!/usr/bin/env bash
#
# scripts/deploy.sh — build Mokshapat and publish dist/ to gh-pages
#
# HOW IT WORKS
# ─────────────────────────────────────────────────────────────────────────────
# GitHub Pages wants a branch (gh-pages) containing built files at its root,
# but dist/ is gitignored on main. This script solves that with two ideas:
#
# 1. git worktree
#    Checks out gh-pages into a temp directory while staying on main.
#    The temp dir is removed on exit (via trap) so a crash never leaves mess.
#    First deploy: creates gh-pages as an orphan branch (no history from main).
#    Later deploys: fetches existing gh-pages, syncs the new build over it.
#
# 2. base: './' in vite.config.ts
#    Makes every asset path relative so they resolve correctly under the
#    github.io/Mokshapat/ subdirectory rather than at the domain root.
#
# USAGE
#   npm run deploy            (manual one-shot)
#   git commit → auto-deploy  (if post-commit hook is installed via npm run setup)
# ─────────────────────────────────────────────────────────────────────────────

set -e

# ── Build ─────────────────────────────────────────────────────────────────────
echo "🔨  Building Mokshapat..."
npm run build

# ── Deploy ────────────────────────────────────────────────────────────────────
DEPLOY_DIR=$(mktemp -d)

cleanup() {
  git worktree remove --force "$DEPLOY_DIR" 2>/dev/null || true
}
trap cleanup EXIT

echo "🚀  Preparing gh-pages branch..."

git worktree prune

if git ls-remote --exit-code origin gh-pages &>/dev/null; then
  git fetch origin gh-pages:gh-pages --force 2>/dev/null || true
  git worktree add "$DEPLOY_DIR" gh-pages
else
  # First deploy — orphan branch shares no history with main
  git branch -D gh-pages 2>/dev/null || true
  git worktree add --no-checkout "$DEPLOY_DIR" HEAD
  (cd "$DEPLOY_DIR" && git checkout --orphan gh-pages && git rm -rf . &>/dev/null || true)
fi

# Sync dist/ → worktree, deleting stale files.
# --exclude='.git' protects the worktree pointer file (it's a plain file in a
# worktree, not a directory; rsync --delete would remove it otherwise).
rsync -a --delete --exclude='.git' dist/ "$DEPLOY_DIR/"

(
  cd "$DEPLOY_DIR"
  git add -A
  if git diff --cached --quiet; then
    echo "ℹ️   Nothing changed — skipping deploy."
  else
    git commit -m "deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    git push origin gh-pages --force
    echo ""
    echo "✅  Live at: https://dhawal-pandya.github.io/Mokshapat/"
  fi
)
