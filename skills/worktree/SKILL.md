---
name: worktree
user-invocable: true
argument-hint: "claim [role], check, release, list, create <name>, or cleanup"
description: "Manage git worktrees for parallel agent development. Create isolated workspaces, coordinate agent assignments with locks, execute tasks in parallel, and cleanup. Use when: (1) multiple agents need to work simultaneously without conflicts, (2) need to claim/release worktree locks for coordination, (3) setting up parallel development workflow, (4) cleaning up after parallel work"
---

# Worktree - Parallel Development & Coordination

Comprehensive worktree management for parallel agent development: creation, coordination via locks, and cleanup.

## Two Modes

### Mode 1: Creation & Execution (New Worktrees)

Create worktrees for parallel tasks:

```bash
# Create single worktree
bun .claude/skills/worktree/scripts/create-worktree.ts <task-name> [base-branch]

# List all worktrees
bun .claude/skills/worktree/scripts/list-worktrees.ts

# Clean up all worktrees
bun .claude/skills/worktree/scripts/cleanup-worktrees.ts
```

### Mode 2: Lock Coordination (Existing Worktrees)

Claim worktrees to prevent duplicate agent assignments:

- `/worktree claim [role]` - Claim current worktree BEFORE starting work
- `/worktree check` - Check if current worktree is claimed
- `/worktree release` - Release claim when done
- `/worktree list` - List all worktrees and their claim status

## Quick Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `create-worktree.ts <name>` | Create new worktree | Setting up parallel work |
| `/worktree claim [role]` | Lock a worktree | Before starting work in existing worktree |
| `/worktree check` | Check lock status | Verify worktree is available |
| `/worktree release` | Unlock worktree | When done with work |
| `list-worktrees.ts` | Show all worktrees | Check what exists |
| `cleanup-worktrees.ts` | Remove all worktrees | After merging all branches |

---

## Mode 1: Creation & Execution

### Create Worktrees

```bash
# For each task, run:
bun .claude/skills/worktree/scripts/create-worktree.ts backend-api
bun .claude/skills/worktree/scripts/create-worktree.ts frontend-ui
```

Result: `worktrees/<name>/` directories with `feature/<name>` branches.

### Cleanup

After merging all branches:
```bash
bun .claude/skills/worktree/scripts/cleanup-worktrees.ts
```

---

## Mode 2: Lock Coordination

### `/worktree claim [role]`

**MANDATORY before any work in existing worktrees.**

Steps: Detect worktree name from cwd -> Read `.claude/worktree-locks.json` -> If claimed, STOP and show who claimed it -> If available, claim and proceed.

### `/worktree release`

Release your claim when done. Removes entry from lock file.

---

## Lock File Format

Path: `.claude/worktree-locks.json`

```json
{
  "locks": {
    "worktree-name": {
      "role": "Agent Role",
      "claimedAt": "2026-02-11T00:00:00Z",
      "workingDir": "/full/path/to/worktree"
    }
  }
}
```

---

## Notes

- Worktrees are created **outside** the repo root (`../worktrees/`) to avoid build tool scanning conflicts (Next.js Turbopack, Vite, etc.)
- Always clean up worktrees after merging to avoid stale git refs
