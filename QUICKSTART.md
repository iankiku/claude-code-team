# Quick Start — Team Skills

Get up and running in 5 steps — or paste one prompt into Claude Code.

## One-Prompt Setup

Copy and paste this into Claude Code inside your project:

```
Clone git@github.com:iankiku/claude-code-team.git and set up Team Skills in this project:

1. If a .claude/ directory already exists, merge the cloned repo's .claude/ contents into it (add new files, don't overwrite existing ones). If no .claude/ directory exists, copy the entire .claude/ folder in.
2. Update .claude/settings.local.json — if the file exists, merge these keys into it (preserve existing settings). If it doesn't exist, create it with this content:
   {
     "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" },
     "teammateMode": "tmux"
   }
3. Run .claude/scripts/cli init to detect my build system.
4. Delete the cloned claude-code-team repo to clean up.
```

That's it. Claude Code will clone the repo, merge skills into your project, configure agent teams with tmux split-pane mode, initialize, and clean up.

---

## Manual Setup

### 1. Clone the Repo

```bash
git clone git@github.com:iankiku/claude-code-team.git
```

### 2. Copy `.claude/` into Your Project

```bash
cp -r claude-code-team/.claude /path/to/your/project/
```

### 3. Configure Agent Teams

Add these keys to `.claude/settings.local.json` (create the file if it doesn't exist):

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  },
  "teammateMode": "tmux"
}
```

### 4. Initialize

```bash
.claude/scripts/cli init
```

This detects your build system (Bun, npm, Cargo, Go, etc.) and writes `.claude/project.json`.

### 5. Spawn a Team

```
/team-lead build a login page with auth and dashboard
```

Team Skills will:
- Create a team with 3 agents (lead, backend, frontend)
- Create worktrees for parallel development
- Agents work in isolation, prove code with `/gate-verify`
- Open PRs when done

## What Happens

1. **team-lead** designs API contracts
2. **backend** implements auth routes
3. **frontend** builds login form (blocked until backend types ready)
4. Each agent runs `/gate-verify` — self-heals lint/typecheck/build/test errors
5. Both open PRs
6. You merge PRs (or team-lead auto-merges if configured)

## Use Cases

**Build a feature:**

```
/team-lead add Stripe checkout to the app
```

**Debug production:**

```
/team-lead users getting 500 errors on /api/orders
```

**Code review:**

```
/team-lead audit the codebase for security
```

**Pre-deploy checks:**

```
/team-lead run full gate verification
```

## Key Skills

- **`team-lead`** — Auto-compose teams, orchestrate work
- **`gate-verify`** — Self-healing lint/build/test loop
- **`worktree`** — Parallel development with lock coordination
- **`memory`** — Track patterns across sessions

See [README.md](README.md) for full documentation.

## Need Help?

- [Full README](README.md) for complete documentation
- [Agent Teams Docs](https://code.claude.com/docs/en/agent-teams) for enabling teams and display modes
- Check `.claude/TESTING.md` for verification commands
- Read `.claude/skills/team-lead/SKILL.md` for orchestration details
- See `.claude/rules/worktree-rules.md` for parallel work protocol

---

**Repo:** [github.com/iankiku/claude-code-team](https://github.com/iankiku/claude-code-team)
