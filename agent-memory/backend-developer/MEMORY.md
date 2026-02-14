# Backend Developer - Agent Memory

## Agent SDK Migration (2026-02-12)

### Key Learnings

**Agent SDK API Patterns:**
- `query()` function returns an async iterable of `SDKMessage`
- Can't iterate the same async generator twice - need to buffer messages
- `permissionMode: "bypassPermissions"` requires `allowDangerouslySkipPermissions: true`
- Tool restrictions via `tools: ["Read", "Glob", "Grep"]` array (read-only for PRD/TDD)
- Budget controls: `maxTurns: 15, maxBudgetUsd: 1.0`

**Streaming Pattern:**
```typescript
const messages: SDKMessage[] = [];
let streamCompleted = false;

const stream = sdkMessageToTextStream((async function* () {
  for await (const message of result) {
    messages.push(message); // Buffer for later reuse
    yield message;
  }
  streamCompleted = true;
})());

const textPromise = (async () => {
  while (!streamCompleted) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return collectAgentText((async function* () {
    for (const msg of messages) yield msg;
  })());
})();
```

**Breaking Changes from Vercel AI SDK:**
- Old: `generatePrd(transcript)` returns `StreamTextResult` with `.text` and `.toTextStreamResponse()`
- New: `generatePrd({ transcript, repoPath })` returns `{ stream, textPromise }`
- API routes need to switch from `result.toTextStreamResponse()` to `new Response(result.stream)`
- Database saves need to switch from `await result.text` to `await result.textPromise`

### Project Structure

**Foundation Files:**
- `/Users/iankiku/starbase/hackathon/fdagent/src/services/agent-sdk.ts` - Stream adapters
- `/Users/iankiku/starbase/hackathon/fdagent/src/services/repo.ts` - Git operations
- `/Users/iankiku/starbase/hackathon/fdagent/src/services/pipeline-events.ts` - Event bus

**Agent Files:**
- `/Users/iankiku/starbase/hackathon/fdagent/src/agents/prd-agent.ts`
- `/Users/iankiku/starbase/hackathon/fdagent/src/agents/tdd-agent.ts`

**Files Needing Updates (Task #3):**
- API routes: generate-prd, generate-tdd, regenerate
- Test files: prd-agent.test.ts, tdd-agent.test.ts
- API route tests for all three routes

### Workflow Patterns

**Feature Branch Workflow:**
1. Checkout main
2. Create feature branch: `git checkout -b feature/name`
3. Merge foundation if needed: `git merge feature/agent-sdk-foundation --no-edit`
4. Make changes
5. Commit with detailed message
6. Push with `git push -u origin feature/name`
7. Create PR with `gh pr create`

**Testing:**
- Use `bunx tsc --noEmit` to check TypeScript errors
- Use `bun run test` (NOT `bun test`) for Vitest
- Check specific paths: `bunx tsc --noEmit 2>&1 | grep "src/agents"`
