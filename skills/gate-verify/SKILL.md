---
name: gate-verify
user-invocable: true
argument-hint: "Optional: max iterations (default 4), flags: -l lint, -b build, -t test, -c typecheck, -g full gate, --all"
description: |
  Self-healing gate verification loop. Runs lint, type-check, build, and tests
  iteratively -- fixes errors automatically until everything passes or max
  iterations reached. Proves code WORKS by executing it, not reading source.

  Use when: (1) After feature work to get a clean build, (2) Before committing,
  (3) Declaring a task "complete", (4) Pre-deploy checks, (5) Any request to
  "verify", "close the loop", or "make sure it works".

  Works with any build system: Node/Bun/pnpm/yarn, Cargo, Go, Python, Make.
---

# Gate Verify -- Self-Healing Verification

You are a gate verification agent. Your job is to get the project to a clean
build state by running checks, reading errors, and fixing them iteratively.

## Anti-Shortcut Rules

1. **NEVER declare PASS based on reading source code.** You must EXECUTE and observe OUTPUT.
2. **NEVER declare PASS without seeing actual command output.** "It should work" is not evidence.
3. **If something cannot be executed, report BLOCKED** -- never fake a PASS.

## Step 0: Read Project Config

Before running any commands, get the project's commands:

1. **Check `.claude/project.json`** -- if it exists, read commands from it:
   ```json
   {
     "commands": { "lint": "...", "build": "...", "test": "...", "dev": "..." },
     "verification": { "appUrl": "http://localhost:3000", "uiTest": "npx playwright test" }
   }
   ```
2. **If no project.json**, check for `.claude/scripts/cli` and run `cli init` to generate it.
3. **If neither exists**, detect build system manually:
   - `bun.lockb` / `bun.lock` -> bun
   - `pnpm-lock.yaml` -> pnpm | `yarn.lock` -> yarn | `package-lock.json` -> npm
   - `Cargo.toml` -> cargo | `go.mod` -> go
   - `pyproject.toml` / `setup.py` -> python | `Makefile` -> make

## Step 1: Execute the Gate Loop

Run up to MAX_ITERATIONS (default 4). Each iteration:

1. Run checks in order: **lint -> typecheck -> build -> test**
2. If ALL pass with exit code 0: **GATE PASSED** -- stop.
3. If any fail: read the FULL error output, fix the errors, run again.

### Optional: Ralph Loop Integration

If the `ralph-loop` plugin is installed, write `.claude/ralph-loop.local.md` to
enable automatic re-prompting after each fix iteration. Otherwise, manage the
loop manually by re-running checks after each fix.

### Flag Reference

| Flag | Layer | What it does |
|------|-------|-------------|
| `-l` | Lint | Run linter only |
| `-c` | Typecheck | Run type checker only |
| `-b` | Build | Run build only |
| `-t` | Test | Run tests only |
| `-a` | App | Start dev server, verify it responds at configured URL |
| `-u` | UI | Run Playwright/Cypress tests |
| `-g` | Gate | Full gate: lint + typecheck + build + test |
| `--all` | Everything | All layers including app startup and UI tests |

**Default (no flags)**: lint + typecheck + build + test

### Build System Commands

| Layer | Node (bun/pnpm/yarn/npm) | Cargo | Go | Python |
|-------|--------------------------|-------|----|--------|
| Lint | `<pkg> run lint` | `cargo clippy` | `go vet ./...` | `ruff check .` |
| Typecheck | `npx tsc --noEmit` | (part of build) | (part of build) | `mypy .` |
| Build | `<pkg> run build` | `cargo build` | `go build ./...` | -- |
| Test | `<pkg> run test` | `cargo test` | `go test ./...` | `pytest` |

### App Verification (-a)

1. Run `commands.dev` in background
2. Wait for boot (use `verification.appWait` or default 8s)
3. `curl -sf <verification.appUrl>` -- must get a response
4. Kill the background process
5. PASS only if URL responds

## Error Fixing Rules

1. **Type errors**: Fix the type, add the import. Never use `@ts-ignore` or `# type: ignore`.
2. **Build errors**: Fix imports, exports, missing modules.
3. **Lint errors**: Fix the actual issue. Minimize lint-disable usage.
4. **Logic changes**: NEVER change business logic. Only fix types, imports, lint.
5. **Pre-existing failures**: If project has known failing tests, document and ignore.

## Circuit Breaker

If max iterations reached without all checks passing:
1. Report which checks still fail with last error output
2. Do NOT fake a PASS
3. Message the team lead (if in team) or inform the user
