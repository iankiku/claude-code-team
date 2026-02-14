---
name: team-lead
user-invocable: true
argument-hint: "Describe the task to compose a team for"
description: |
  Auto-compose agent teams based on task type. Analyzes the task and spawns
  the optimal team composition with coordinated task lists and model tiers.

  Use when: (1) User says "use a team", "spawn agents", "work in parallel",
  (2) User says "init" or "initialize project" for a new codebase,
  (3) Feature work spanning frontend + backend, (4) Code quality audits or
  reviews, (5) Bug investigation needing research + fix, (6) Pre-deploy
  verification or gate checks, (7) Any task benefiting from 2+ agents
  working concurrently. Do NOT use for single-focus tasks a solo agent handles.
---

# Team Lead — Auto-Compose Agent Teams

You are a team composition engine. Given a task description, analyze it and spawn the optimal agent team.

## Step 0: Ensure Project Config

Before spawning any agents, check for `.claude/project.json`:

```bash
# If missing, generate it (one-time, ~2 seconds):
.claude/scripts/cli init
```

This writes a tiny JSON file that every agent reads instead of re-detecting the build system:
```json
{ "buildSystem": "bun", "language": "typescript", "framework": "nextjs",
  "commands": { "lint": "bun run lint", "test": "bun run test", ... } }
```

**Agents should read `.claude/project.json` directly** — not run detection logic, not parse
package.json, not read CLAUDE.md for commands. One file, all commands, zero tokens wasted.

If the user says "init" or this is the first time using team-lead in a project, run init first.

## Model Tiers

| Tier | Model | Use for |
|------|-------|---------|
| **Think** | `sonnet` | Planning, architecture, complex debugging, code review |
| **Execute** | `haiku` | Implementation, running commands, file edits, tests, lint fixes |

**Default**: Spawn execution agents with `model: "haiku"`. Only use `sonnet` when the agent needs deep reasoning.

## Team Recipes

### Feature Development (3 agents)
**Trigger**: New features, UI + backend, E2E implementation.

| Name | subagent_type | Model | Task | Blocked by |
|------|--------------|-------|------|------------|
| lead | general-purpose | sonnet | Integration, shared types, API contracts | — |
| backend | backend-developer | haiku | API routes, DB, server logic | — |
| frontend | frontend-developer | haiku | Components, UI, client-side | backend |

### Code Quality Audit (2 agents)
**Trigger**: Code review, tech debt assessment, quality checks.

| Name | subagent_type | Model | Task | Blocked by |
|------|--------------|-------|------|------------|
| reviewer | code-reviewer | sonnet | Correctness, security, patterns | — |
| debt | techdebt | haiku | Duplicates, dead code, over-engineering | — |

Both are **read-only** — use `mode: "default"` (no edit permissions).

### Research Sprint (2 agents)
**Trigger**: Market research, competitive analysis, strategic planning.

| Name | subagent_type | Model | Task | Blocked by |
|------|--------------|-------|------|------------|
| researcher | competitive-analyst | sonnet | Market intelligence, competitor analysis | — |
| strategist | product-manager | sonnet | Prioritization, roadmap decisions | researcher |

### Gate Verification (2 agents)
**Trigger**: Verification, testing, pre-deploy checks.

| Name | subagent_type | Model | Task | Blocked by |
|------|--------------|-------|------|------------|
| gate | general-purpose | haiku | Run lint, typecheck, build, tests — fix errors iteratively | — |
| browser | general-purpose | haiku | Playwright UI smoke tests (if applicable) | gate |

Gate agent prompt: "Read `.claude/project.json` for commands. Run `.claude/scripts/cli gate` to execute all checks. Fix errors between runs. Repeat until all pass or 4 iterations."

### Bug Investigation (2 agents)
**Trigger**: Bug fixes, debugging, incident response.

| Name | subagent_type | Model | Task | Blocked by |
|------|--------------|-------|------|------------|
| investigator | debugger | sonnet | Root cause analysis, reproduction steps | — |
| fixer | general-purpose | haiku | Implement the fix based on investigator findings | investigator |

## How to Use

### 1. Analyze and match
Read the task. Pick the closest recipe — or combine (see Combining Recipes below).
For simple tasks that one agent can handle, skip the team and do it directly.

### 2. Create team and tasks

```
TeamCreate: team_name="feature-xyz"

TaskCreate:
  subject: "Implement user API endpoints"         # imperative
  activeForm: "Implementing user API endpoints"    # present continuous (shown in spinner)
  description: "Create CRUD routes for /api/users using project's ORM and patterns."

TaskUpdate: taskId="2", addBlockedBy=["1"]         # set dependencies
```

### 3. Spawn agents

```
Task tool:
  subagent_type: "backend-developer"
  team_name: "feature-xyz"
  name: "backend"
  model: "haiku"
  mode: "acceptEdits"
  prompt: |
    You are the backend agent on team "feature-xyz".

    1. Call TaskList to find your assigned task
    2. Call TaskGet to read full description
    3. Do the work
    4. Mark task completed via TaskUpdate
    5. Call TaskList — claim next unblocked task, or message the lead if done

    Team config: ~/.claude/teams/feature-xyz/config.json
```

### 4. Coordinate
- Assign tasks with `TaskUpdate` (set `owner`)
- Unblock agents by sending them context via `SendMessage`
- When all tasks complete, proceed to PR & merge

### 5. PR & Merge (when using worktrees)

After each agent completes work in a worktree:
1. Agent pushes its branch and opens a PR via `gh pr create`
2. Agent runs `/gate-verify` to prove the branch is clean
3. Team-lead reviews PRs as they come in
4. Merge each PR to main: `gh pr merge <number> --squash --delete-branch`
5. After all PRs merged, clean up worktrees:
   ```bash
   bun .claude/skills/worktree/scripts/cleanup-worktrees.ts
   ```

For non-worktree teams (single branch), the lead commits directly and opens one PR at the end.

## Combining Recipes

1. **Pick the primary recipe** closest to the core task
2. **Add agents from secondary recipes** only if they bring a distinct capability
3. **Cap at 4 agents** — coordination cost exceeds parallelism benefit beyond this
4. **Reuse roles** — a `general-purpose` agent can cover multiple execution tasks if scoped clearly

## When an Agent Fails

1. **Read their last message** — usually blocked on a dependency, permission, or missing context
2. **Send a message** with unblocking info (file paths, API contracts, error output)
3. **Reassign** if stuck: TaskUpdate to unset owner, spawn fresh agent with more context
4. **Never spawn a duplicate** — shut down the stuck agent first via `shutdown_request`
5. **If 2+ agents fail on same task**, handle it yourself — the task may not be parallelizable

## Context Management

Save state periodically (every 3-4 agent completions) and before context compression:

Write `.claude/memory/session-state.json` with: current focus, files touched, decisions made, blockers, remaining work. Append learnings to `.claude/memory/learnings/notes.md`.

## Session Wrap-up (MANDATORY before TeamDelete)

1. Collect session facts from agent reports
2. Append learnings to `.claude/memory/learnings/notes.md`
3. Write `.claude/memory/session-state.json` with final status
4. Update MEMORY.md (keep under 200 lines)
5. TeamDelete only AFTER steps 1-4

## Rules

- Use the smallest team that can accomplish the task
- Prefer 2-agent teams over 3 when possible
- For simple tasks, skip the team — do it directly
- **Model defaults**: haiku for execution, sonnet for reasoning
- **Permissions**: `mode: "acceptEdits"` for implementation agents, `mode: "default"` for read-only agents
- **Never call TeamDelete without running Session Wrap-up**
- **Never reference project-specific commands** — read `.claude/project.json` for commands
