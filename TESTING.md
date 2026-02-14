# Verification Protocol

> Code that compiles is not code that works. Every change must be verified by execution.

---

## Anti-Shortcut Rules

1. **NEVER declare PASS based on reading source code.** You must EXECUTE the code and observe OUTPUT.
2. **Source code review is research, not verification.** It can inform your approach but is NOT a pass criterion.
3. If a layer cannot be executed (missing dependency, broken infra), report **BLOCKED** — never fake a PASS.

---

## Quick Reference

| What changed | Minimum verification |
|---|---|
| API routes | Run tests |
| Frontend components | Run tests |
| Database schema | Run migration + query |
| Docker config | docker compose up + health check |
| Cross-cutting (auth, config, env) | All test suites |

---

## Commands

Use the CLI for all verification. It reads commands from `project.json`.

```bash
# Initialize (one-time)
.claude/scripts/cli init

# Individual checks
.claude/scripts/cli lint
.claude/scripts/cli typecheck
.claude/scripts/cli build
.claude/scripts/cli test

# Full gate (all checks in sequence)
.claude/scripts/cli gate

# Structured report with flags
.claude/scripts/cli gatekeep -g       # Full gate with PASS/FAIL report
.claude/scripts/cli gatekeep -a       # App startup verification
.claude/scripts/cli gatekeep --all    # Everything including app + UI tests
```

---

## Gate Verification Skill

For self-healing verification (fix errors iteratively), use the gate-verify skill:

```
/gate-verify           # Default: lint + typecheck + build + test, up to 4 iterations
/gate-verify 6         # Custom max iterations
/gate-verify -t        # Tests only
```

The skill reads errors, fixes them, and re-runs until clean or max iterations reached.

---

## Docker

```bash
# Start services (uses .claude/scripts/docker-compose.yml)
docker compose -f .claude/scripts/docker-compose.yml up -d

# Verify
curl http://localhost:3000/health
```
