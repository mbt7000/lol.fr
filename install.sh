#!/usr/bin/env sh
# Install the skills into a Claude Code skills directory.
#
#   ./install.sh            -> ./.claude/skills of the current directory
#   ./install.sh --global   -> ~/.claude/skills
#   ./install.sh <path>     -> <path>/.claude/skills
set -eu

SRC="$(cd "$(dirname "$0")" && pwd)/skills"

case "${1:-}" in
  --global) DEST="$HOME/.claude/skills" ;;
  "")       DEST="$(pwd)/.claude/skills" ;;
  *)        DEST="$1/.claude/skills" ;;
esac

[ -d "$SRC" ] || { echo "error: skills/ not found next to install.sh" >&2; exit 1; }

mkdir -p "$DEST"
installed=0
for dir in "$SRC"/*/; do
  name="$(basename "$dir")"
  [ -f "$dir/SKILL.md" ] || continue
  mkdir -p "$DEST/$name"
  cp "$dir/SKILL.md" "$DEST/$name/SKILL.md"
  echo "  installed: $name"
  installed=$((installed + 1))
done

echo "done: $installed skills -> $DEST"
echo "try:  /orchestrate <your big task>"
