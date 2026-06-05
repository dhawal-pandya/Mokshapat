#!/usr/bin/env bash
#
# scripts/setup.sh — install the post-commit hook for auto-deploy
#
# Run once per clone:
#   npm run setup

set -e

HOOK=".git/hooks/post-commit"

cp scripts/post-commit.sh "$HOOK"
chmod +x "$HOOK"

echo "✅  post-commit hook installed."
echo "    Every commit on main will now auto-deploy to GitHub Pages."
echo "    To deploy manually at any time: npm run deploy"
