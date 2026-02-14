# Worktree Rules

**MANDATORY** for all agents working in `/worktrees/*` directories.

---

## Rule 1: Claim Before Work

**BEFORE doing ANY work**, you MUST claim your worktree:

1. Read the lock file: `.claude/worktree-locks.json`
2. Extract your worktree name from your working directory path
3. Check if already claimed in `locks` object

### If Already Claimed:
```
STOP - This worktree is already claimed!

Claimed by: [role]
Claimed at: [timestamp]

DO NOT proceed. Ask user to resolve the conflict first.
```

### If Available:
Update the lock file to claim it:
```json
{
  "locks": {
    "your-worktree-name": {
      "role": "Your Agent Role",
      "claimedAt": "2026-02-01T20:00:00Z",
      "workingDir": "/full/path/to/worktree"
    }
  }
}
```

Then proceed with your work.

---

## Rule 2: Release When Done

When you complete your work or the session ends, release your claim:

1. Read the lock file
2. Remove your worktree entry from `locks`
3. Write updated lock file

---

## Rule 3: Check Before Resuming

When resuming a session, always re-check the lock file to ensure your claim is still valid.

---

## Lock File Location

**Relative path:** `.claude/worktree-locks.json` (from project root)

---

## Example: Claiming my-feature

```bash
# Your working directory
<project-root>/worktrees/my-feature

# Worktree name extracted: my-feature

# Lock file after claiming:
{
  "locks": {
    "my-feature": {
      "role": "Feature Developer",
      "claimedAt": "2026-02-01T20:00:00Z",
      "workingDir": "<project-root>/worktrees/my-feature"
    }
  }
}
```
