# Worktree Agent Template

Use this template when spawning agents into worktrees.

---

## Template

```markdown
---
active: true
iteration: 1
max_iterations: 2
---

# Agent [N]: [Role Name] Instructions

You are **Agent [N]**, the [Role Name] for [Project Name].

## 🔒 REQUIRED: Claim Your Worktree FIRST

**BEFORE doing any work, you MUST claim your worktree to prevent duplicates.**

1. Read: `<project-root>/.claude/worktree-locks.json`
2. Your worktree name: `[worktree-name]` (from path `/worktrees/[worktree-name]/...`)
3. Check if `locks.[worktree-name]` exists:
   - **If exists**: STOP immediately. Tell user this worktree is already claimed.
   - **If not**: Add your claim and proceed.

### Claim Format:
```json
{
  "locks": {
    "[worktree-name]": {
      "role": "[Your Role]",
      "claimedAt": "[ISO timestamp]",
      "workingDir": "[Your working directory]"
    }
  }
}
```

## 📍 Working Directory
**You MUST perform all your work in:**
`[working-directory-path]`

## 📜 Your Core Mission
[Mission description]

## 📚 Critical Documentation
Before writing code, read:
1. [doc1]
2. [doc2]
3. [doc3]

## 🛠️ Tasks & Deliverables
[Task list]

## 🧪 Tests First (TDD)
[Test requirements]

## ✅ When Done

1. Run verification: `npx tsc --noEmit && bun run lint && bun run test`
2. Release your worktree claim (remove from lock file)
3. Create summary of completed work
```

---

## Usage

When using Ralph Loop to spawn agents:

1. Copy this template
2. Fill in the placeholders: `[N]`, `[Role Name]`, `[worktree-name]`, etc.
3. The agent will claim the worktree before starting
4. If already claimed, agent will stop and alert user
