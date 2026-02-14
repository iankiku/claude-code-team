#!/bin/bash
# PostToolUse hook for Edit/Write — runs lint check on changed files
INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
if [ -z "$FILE" ]; then exit 0; fi
# Only check TS/TSX files
case "$FILE" in *.ts|*.tsx)
  DIR=$(dirname "$FILE")
  # Walk up to find nearest node_modules (project root)
  while [ "$DIR" != "/" ]; do
    if [ -d "$DIR/node_modules" ]; then
      cd "$DIR" && npx eslint --no-warn-ignored "$FILE" 2>/dev/null || true
      break
    fi
    DIR=$(dirname "$DIR")
  done
  ;; esac
exit 0
