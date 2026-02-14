#!/bin/bash
# Usage: .claude/scripts/worktree.sh <create|merge|cleanup|list> [branch-name]
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
WORKTREE_DIR="$REPO_ROOT/worktrees"
LOCK_FILE="$REPO_ROOT/.claude/worktree-locks.json"

case "$1" in
  create)
    BRANCH="${2:?Branch name required}"
    git worktree add "$WORKTREE_DIR/$BRANCH" -b "$BRANCH" 2>/dev/null || \
    git worktree add "$WORKTREE_DIR/$BRANCH" "$BRANCH"
    echo "Worktree created at $WORKTREE_DIR/$BRANCH"
    ;;
  merge)
    BRANCH="${2:?Branch name required}"
    cd "$REPO_ROOT" && git merge "$BRANCH"
    ;;
  cleanup)
    BRANCH="${2:?Branch name required}"
    # Remove lock
    jq "del(.locks[\"$BRANCH\"])" "$LOCK_FILE" > "$LOCK_FILE.tmp" && mv "$LOCK_FILE.tmp" "$LOCK_FILE"
    git worktree remove "$WORKTREE_DIR/$BRANCH" --force
    git branch -d "$BRANCH" 2>/dev/null
    echo "Cleaned up worktree: $BRANCH"
    ;;
  list)
    git worktree list
    echo "---"
    echo "Locks:"
    cat "$LOCK_FILE" | jq '.locks'
    ;;
  *) echo "Usage: $0 <create|merge|cleanup|list> [branch-name]" ;;
esac
