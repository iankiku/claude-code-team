---
name: memory
user-invocable: true
argument-hint: "load, update, clear, status, or describe an insight to capture"
description: |
  Track work state and capture insights across sessions. Combines session
  continuity (load/update context) with learning capture (save discoveries).

  Use when: (1) Session start to load context, (2) "/memory" or "/memory update",
  (3) "/learn" or "remember this", (4) Preserving decisions, patterns, or blockers.
---

# Session Memory -- State Tracking & Learning Capture

Track work state across sessions and capture insights for future reference.

## Memory Files

All paths are project-local, relative to cwd:

- `.claude/memory/session-state.json` -- Primary state file
- `.claude/memory/learnings/notes.md` -- Captured insights (most recent first)

## Commands

### `/session-memory` or `/session-memory load`
Load and display current session context.

### `/session-memory update`
Save current session progress (focus, files, decisions, blockers, action items).

### `/session-memory clear`
Reset state. Requires confirmation: "This will clear all session state. Type 'yes' to confirm."

### `/session-memory [insight description]`
Capture a learning/insight to notes.md.

## Session State Schema

```json
{
  "meta": { "last_updated": "ISO-8601", "session_count": 0 },
  "current_work": { "focus": "", "files_touched": [], "branch": "" },
  "context": { "decisions": [], "blockers": [], "open_questions": [] },
  "action_items": [],
  "recent_sessions": [
    { "date": "YYYY-MM-DD", "summary": "...", "outcome": "..." }
  ]
}
```

## Workflow

### Session Start (load)
1. Read `session-state.json` if exists
2. Read `learnings/notes.md` for recent insights
3. Summarize: current focus, branch, recent sessions, open items, recent learnings

### During Session
Track files modified, decisions made, blockers encountered.

### Session End (update)
1. Update `current_work` with focus and files
2. Append to `decisions`, `blockers`, `open_questions`
3. Update `action_items`
4. Add entry to `recent_sessions` (keep last 10)
5. Increment `session_count`, update `last_updated`

## Capturing Insights

When user says "/learn [title]" or "remember this":

1. Format entry:
   ```markdown
   ## [Learning Title]
   **Date**: YYYY-MM-DD
   **Context**: [What we were working on]

   [Description of the insight]

   **Key takeaway**: [One-liner summary]

   ---
   ```
2. Prepend to `.claude/memory/learnings/notes.md` (most recent first)
3. Create directory/file if they don't exist
4. Confirm what was saved

### Archive When Large
If notes.md exceeds 500 lines: archive older entries to `notes-archive-YYYY-MM.md`,
keep last 50 in main file.

## Rules

- **Always use project-local paths** derived from cwd, never global paths
- **JSON state**: Read before writing, merge changes, don't overwrite
- **Learnings**: Prepend (newest first), include date and context
