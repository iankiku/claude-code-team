#!/bin/bash
# PreToolUse hook for Bash — blocks dangerous commands
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
# Block destructive git operations unless explicitly allowed
if echo "$COMMAND" | grep -iE '(git push --force|git reset --hard|rm -rf /|DROP TABLE)' > /dev/null; then
  echo "Blocked: Destructive command detected. Use with explicit user approval." >&2
  exit 2
fi
exit 0
