#!/usr/bin/env bash
#
# scripts/post-commit.sh — auto-deploy after every commit on main
#
# This is the *source* for .git/hooks/post-commit.
# It lives in scripts/ so it's tracked by git and survives fresh clones.
#
# Activate with:
#   npm run setup
#
# HOW IT WORKS
# ─────────────────────────────────────────────────────────────────────────────
# Git runs .git/hooks/post-commit after every successful commit.
# This script:
#   1. Exits silently if not on main (feature branches, etc.)
#   2. Checks GitHub SSH access — fails fast with a clear fix guide if missing.
#   3. Calls `npm run deploy` (build + push dist/ to gh-pages).
#
# The hook fires *after* the commit is recorded, so a deploy failure never
# rolls back or blocks your commit.
# ─────────────────────────────────────────────────────────────────────────────

# Git injects GIT_DIR, GIT_INDEX_FILE, GIT_WORK_TREE etc. into hook processes.
# Those vars are inherited by child processes, including npm run deploy.
# git worktree add then tries to reuse the hook's index file, hits a path
# conflict, and dies with "Not a directory". Unsetting them here lets all
# child git commands behave normally.
unset GIT_DIR GIT_INDEX_FILE GIT_WORK_TREE GIT_OBJECT_DIRECTORY GIT_PREFIX

CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null)

[ "$CURRENT_BRANCH" = "main" ] || exit 0

echo ""
echo "📦  Commit on main — running deploy..."

# ── SSH check ────────────────────────────────────────────────────────────────
SSH_RESULT=$(ssh -o ConnectTimeout=5 -T git@github.com 2>&1)

if ! echo "$SSH_RESULT" | grep -q "successfully authenticated"; then
  echo ""
  echo "⚠️   GitHub SSH access not available. Deploy skipped."
  echo "     Fix:"
  echo ""
  echo "  1. Generate a key (skip if you have one):"
  echo "       ssh-keygen -t ed25519 -C \"you@example.com\""
  echo ""
  echo "  2. Copy public key:"
  echo "       cat ~/.ssh/id_ed25519.pub | pbcopy"
  echo ""
  echo "  3. Add to GitHub → Settings → SSH keys:"
  echo "       https://github.com/settings/ssh/new"
  echo ""
  echo "  4. Verify:"
  echo "       ssh -T git@github.com"
  echo ""
  echo "  Then deploy manually:"
  echo "       npm run deploy"
  echo ""
  exit 0
fi

npm run deploy
