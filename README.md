# Team Skills — Agent Orchestration & Skills

Orchestrate agents in parallel and enforce agent task loop closing and cleanup.

**Spawn agent teams that work in parallel, prove their work with self-healing gates, and ship PRs without human touch.**

Drop into any repo, run `cli init`, and get team orchestration, self-healing verification, parallel worktree development, and 25 specialized skills.

![Team Skills Preview](preview.png)

## How It Works

```
cli init → project.json → team-lead spawns agents → gate-verify runs checks → worktree isolates branches
```

1. **`cli init`** detects your build system and writes `project.json` (one-time)
2. **`team-lead`** reads the task, picks a team recipe, spawns agents with model tiers
3. **Agents work** using skills, scripts, and the task list for coordination
4. **`gate-verify`** runs lint/typecheck/build/test iteratively, fixing errors until clean
5. **`worktree`** creates isolated git branches for parallel agent work without conflicts

---

## Requirements

Agent teams are disabled by default in Claude Code. Follow these steps to enable them:

### 1. Enable Agent Teams

Set the environment variable in your `settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Or export it in your shell:

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

> See the full guide: [Enable agent teams](https://code.claude.com/docs/en/agent-teams#enable-agent-teams)

### 2. Choose a Display Mode

Agent teams support multiple display modes for monitoring agent activity. Pick one:

| Mode | What you see |
|------|-------------|
| **Default** | Inline output in a single terminal |
| **Split-pane** | Each agent gets its own pane (requires tmux or iTerm2) |

> See all options: [Choose a display mode](https://code.claude.com/docs/en/agent-teams#choose-a-display-mode)

### 3. Install tmux or iTerm2 (for split-pane mode)

Split-pane mode requires one of:

- **tmux** — Install via your package manager:
  - macOS:
    ```bash
    brew install tmux
    ```
  - Ubuntu/Debian:
    ```bash
    sudo apt install tmux
    ```
- **iTerm2** — Install the [it2 CLI](https://iterm2.com/utilities/it2), then enable **iTerm2 → Settings → General → Magic → Enable Python API**

---

## Quick Start

### One-Prompt Setup

Paste this into Claude Code inside your project:

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

### Manual Setup

**Clone the repo:**

```bash
git clone git@github.com:iankiku/claude-code-team.git
```

**Copy `.claude/` into your project:**

```bash
cp -r claude-code-team/.claude /path/to/your/project/
```

**Configure agent teams** — add to `.claude/settings.local.json` (create if it doesn't exist):

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  },
  "teammateMode": "tmux"
}
```

**Initialize (detects your build system and writes `project.json`):**

```bash
.claude/scripts/cli init
```

**Run the full gate (lint + typecheck + build + test):**

```bash
.claude/scripts/cli gate
```

**Or use slash commands in Claude Code:**

```
/team-lead build a user auth system
```

```
/gate-verify
```

```
/worktree create backend-api
```

---

## Core System

### Project Config (`project.json`)

I run `cli init` once to cache your build system config. Instead of every agent re-detecting "is this Bun or npm or Go?", they just read this 200-byte JSON. This saves me from loading package.json, pyproject.toml, Cargo.toml—all the bloat that inflates context.

```json
{
  "buildSystem": "bun",
  "language": "typescript",
  "framework": "nextjs",
  "commands": {
    "install": "bun install",
    "dev": "bun run dev",
    "build": "bun run build",
    "test": "bun run test",
    "lint": "bun run lint",
    "typecheck": "npx tsc --noEmit"
  },
  "verification": {
    "appUrl": "http://localhost:3000"
  }
}
```

Supports: **Bun, npm, pnpm, Yarn, Cargo, Go, Python, Make.**

**Why it matters**: Each spawned agent gets this config via `settingSources: ["project"]`. No re-detection, no wasted context tokens.

### CLI (`scripts/cli`)

Central command runner. Config-first with auto-detection fallback.

| Command | Purpose |
|---------|---------|
| `cli init` | Detect build system, write project.json |
| `cli gate` | lint + typecheck + build + test (stops on failure) |
| `cli gatekeep -g` | Same, with structured PASS/FAIL report |
| `cli gatekeep -a` | Start app, verify it responds |
| `cli gatekeep --all` | Everything: lint + typecheck + build + test + app + UI |
| `cli lint\|build\|test` | Run individual checks |

### Scripts (`scripts/`)

| Script | Purpose |
|--------|---------|
| `cli` | Central command runner with init, gate, and individual check subcommands |
| `docker-compose.yml` | Generic Postgres + optional Redis. All values env-configurable. |
| `worktree.sh` | Shell-based worktree management (alternative to the TypeScript scripts) |

---

## Orchestration Skills

These three skills form the core orchestration loop. The team-lead picks a recipe, spawns agents, and each agent runs gate-verify to prove its work. Worktrees isolate parallel branches.

### team-lead — `/team-lead <task>`

Auto-composes agent teams based on task type. Analyzes the task and spawns the optimal team.

**5 built-in recipes:**

| Recipe | Agents | When to use |
|--------|--------|-------------|
| **Feature Dev** | lead (sonnet) + backend (haiku) + frontend (haiku) | New features, fullstack work |
| **Code Quality** | reviewer (sonnet) + debt (haiku) | Reviews, tech debt audits |
| **Research** | researcher (sonnet) + strategist (sonnet) | Market research, planning |
| **Gate Verification** | gate (haiku) + browser (haiku) | Pre-deploy checks, CI |
| **Bug Investigation** | investigator (sonnet) + fixer (haiku) | Debugging, incident response |

**Model tiers:** haiku for execution (cheap, fast), sonnet for reasoning (deep thinking).

#### Example: Parallel Feature Development

```
/team-lead build user auth (backend) and admin dashboard (frontend) in parallel
```

Here's what happens end-to-end:

**1. Init & Plan** — Team-lead ensures `.claude/project.json` exists (runs `cli init` if not), picks the **Feature Dev** recipe, creates a team with 5 tasks:

```
Task 1: "Define shared types and API contracts"          → lead (sonnet)
Task 2: "Implement auth API routes and middleware"        → backend (haiku)
Task 3: "Implement admin dashboard pages"                 → frontend (haiku)
Task 4: "Gate-verify backend branch"                      → backend
Task 5: "Gate-verify frontend branch"                     → frontend
```

**2. Create worktrees** — Team-lead creates isolated branches so agents don't conflict:

```bash
bun .claude/skills/worktree/scripts/create-worktree.ts backend-auth
bun .claude/skills/worktree/scripts/create-worktree.ts frontend-dash
```
```
../worktrees/backend-auth/   → feature/backend-auth branch
../worktrees/frontend-dash/  → feature/frontend-dash branch
```

**3. Spawn agents** — Each agent gets a worktree, claims its lock, and starts working:

- `lead` (sonnet) — writes shared types in `main`, sends the contract to both agents via `SendMessage`
- `backend` (haiku) — claims `backend-auth` worktree lock, implements auth routes, runs `/gate-verify`
- `frontend` (haiku) — claims `frontend-dash` worktree lock, builds dashboard pages, blocked until backend's types are ready

**4. Gate-verify** — Each agent runs the self-healing loop in its worktree:
```
/gate-verify    → lint fails (unused import) → fix → re-run → typecheck fails → fix → all pass
```

**5. Open PRs** — Each agent pushes its branch and opens a PR:
```bash
gh pr create --title "feat: add auth API" --body "..."
gh pr create --title "feat: add admin dashboard" --body "..."
```

**6. Merge** — Team-lead reviews and merges each PR to main:
```bash
gh pr merge 1 --squash --delete-branch
gh pr merge 2 --squash --delete-branch
```

**7. Cleanup** — Remove worktrees, save learnings, delete team:
```bash
bun .claude/skills/worktree/scripts/cleanup-worktrees.ts
```

### gate-verify — `/gate-verify`

Self-healing verification loop. Runs checks, reads errors, fixes them, repeats.

1. Reads `project.json` for commands (or detects manually)
2. Runs lint → typecheck → build → test in order
3. If any fail: reads full error output, fixes the issue, runs again
4. Repeats up to 4 iterations (configurable)
5. Circuit breaker: reports remaining failures honestly, never fakes a PASS

**Anti-shortcut rules:** Must EXECUTE and observe output. Source code review is not verification.

#### Usage Examples

| Command | Purpose |
|---------|---------|
| `/gate-verify` | Full gate: lint + typecheck + build + test (up to 4 iterations) |
| `/gate-verify 6` | Custom max iterations |
| `/gate-verify -t` | Tests only |
| `/gate-verify -l` | Lint only |
| `/gate-verify -b` | Build only |
| `/gate-verify -a` | Start dev server, verify it responds |
| `/gate-verify --all` | Everything including app startup and UI tests |

Typical flow: agent writes code → runs `/gate-verify` → lint fails on unused import → agent removes it → re-runs → typecheck fails on missing type → agent adds it → re-runs → all pass → GATE PASSED.

### worktree — `/worktree`

Git worktree management for parallel agent development.

**Create isolated worktrees** (placed outside repo root to avoid build tool scanning):

```bash
bun .claude/skills/worktree/scripts/create-worktree.ts backend-api
```

```bash
bun .claude/skills/worktree/scripts/create-worktree.ts frontend-ui
```

**List all worktrees:**

```bash
bun .claude/skills/worktree/scripts/list-worktrees.ts
```

**Clean up after merging:**

```bash
bun .claude/skills/worktree/scripts/cleanup-worktrees.ts
```

**Lock coordination** prevents two agents from working in the same worktree:
- `worktree-locks.json` tracks claims
- Agents must claim before work, release when done
- See `rules/worktree-rules.md` for the full protocol

#### Why Outside the Repo Root?

Worktrees are created at `../worktrees/<name>/` (sibling to the project) because build tools like Next.js Turbopack and Vite scan all subdirectories. Placing worktrees inside the repo causes build conflicts and duplicate module resolution.

#### Why Worktrees At All?

I use worktrees so parallel agents don't load the same monorepo into context. Agent A works in `backend-auth/` branch, Agent B works in `frontend-dash/` branch. They each see only their changed files, not the union of all changes. This keeps context lean—no redundant file reads, no duplicate dependency analysis. Each agent focuses on its scope.

---

## Session Management

| Skill | Command | Purpose |
|-------|---------|---------|
| **memory** | `/memory` | Track work state and capture insights across sessions. Load context at session start, save progress at end. |
| **skill-creator** | `/skill-creator` | Guide for creating new skills with proper structure, frontmatter, progressive disclosure. |

---

## Engineering Skills

| Skill | Description |
|-------|-------------|
| **senior-engineer** | Senior fullstack: TypeScript, React, Next.js, SQL, modern patterns |
| **security-engineer** | Secure design, vulnerability prevention, threat modeling |
| **qa-engineer** | Test strategy, automation, release quality |
| **ai-chat-engineer** | AI chat interfaces (assistant-ui + shadcn + Vercel AI SDK) |
| **ai-engineer** | AI patterns: Mastra, LangChain/LangGraph, LangFlow, MCP |
| **mcp-builder** | Creating MCP servers for LLM integrations |
| **webapp-testing** | Playwright toolkit for testing local web apps |

## Framework Patterns

| Skill | Description |
|-------|-------------|
| **drizzle-patterns** | Drizzle ORM: schema, migrations, relations, decimal handling |
| **supabase-patterns** | Auth, RLS policies, Edge Functions, Realtime, Storage |
| **deploy-ops** | Deployment: Vercel, Railway, Convex. CI/CD patterns |

## Content & Strategy

| Skill | Description |
|-------|-------------|
| **content-writer** | First-person content for X/Twitter, blogs, newsletters |
| **vibe-marketer** | Engineer virality through emotional resonance and growth loops |
| **strategic-discovery** | Guided strategic discovery interview for startups |
| **strategy-advisor** | Strategic leadership across executive, technical, product perspectives |
| **data-analyst** | Insights, dashboards, data-informed decisions |
| **doc-patterns** | Technical writing: API docs, guides, reference material |

## Document Skills (`skills/document-skills/`)

| Skill | Description |
|-------|-------------|
| **docx** | Word documents: create, edit, tracked changes, comments |
| **pdf** | PDF: extract text/tables, create, merge/split, forms |
| **pptx** | PowerPoint: layouts, templates, charts, slide generation |
| **xlsx** | Excel: formulas, formatting, data analysis, visualization |

---

## Rules (`rules/`)

| Rule | Purpose |
|------|---------|
| **worktree-rules.md** | Mandatory claim/release protocol for agents in worktrees |

## Hooks

| Hook | Purpose |
|------|---------|
| **task-gate.sh** | Runs lint on changed files after edits |
| **validate-command.sh** | Blocks dangerous commands (destructive git ops) |

---

## Portability

```bash
git clone git@github.com:iankiku/claude-code-team.git
```

```bash
cp -r claude-code-team/.claude /path/to/your/project/
```

```bash
.claude/scripts/cli init
```

Then delete any skills you don't need — each is self-contained.

**25 skills, 4,400 lines total. Zero project-specific content.**

---

## Learn More

Learn how Claude Code agent teams work: [Agent Teams Documentation](https://code.claude.com/docs/en/agent-teams)

---

## Contributing

This is open-source. To contribute:

1. **Clone the repo:**
   ```bash
   git clone git@github.com:iankiku/claude-code-team.git
   ```
2. **Test locally** — Copy `.claude/` into a test project, run `cli init` and `cli gate`
3. **Keep it portable** — No project-specific paths, configs, or dependencies
4. **Add to existing skills** or create new ones in `skills/`
5. **Open an issue first** if adding major features — discuss before PR
6. **Keep SKILL.md lean** — Progressive disclosure: metadata → body → references

**Key rule**: Every skill must work in any repo without modification.

---

## Roadmap

- [ ] Plugin setup — package as a one-click installable Claude Code plugin
- [ ] Add to plugin marketplace — publish to the Claude Code plugin marketplace for discovery

---

## License

Open source. Built by [@iankiku](https://github.com/iankiku)

### Contributor

**Ian Kiku** — [X/Twitter](https://x.com/iankiku) · [LinkedIn](https://linkedin.com/in/iankiku) · [GitHub](https://github.com/iankiku)
