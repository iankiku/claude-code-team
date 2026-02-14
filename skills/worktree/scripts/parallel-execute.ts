#!/usr/bin/env bun
/**
 * Execute multiple tasks in parallel using worktrees
 * Usage: bun scripts/parallel-execute.ts <tasks-json-file>
 *
 * Example tasks.json:
 * [
 *   { "name": "backend-api", "prompt": "Create POST /api/auth/login endpoint" },
 *   { "name": "frontend-ui", "prompt": "Build login form component" }
 * ]
 */

import { readFileSync } from "fs";
import { execSync } from "child_process";
import { join } from "path";

const tasksFile = process.argv[2];

if (!tasksFile) {
  console.error("Usage: bun parallel-execute.ts <tasks-json-file>");
  process.exit(1);
}

interface Task {
  name: string;
  prompt: string;
  baseBranch?: string;
}

try {
  // Read tasks
  const tasks: Task[] = JSON.parse(readFileSync(tasksFile, "utf-8"));

  console.log(`🚀 Executing ${tasks.length} tasks in parallel...\n`);

  // Create worktrees for all tasks
  for (const task of tasks) {
    const baseBranch = task.baseBranch || "main";
    console.log(`📦 Setting up worktree for: ${task.name}`);

    execSync(`bun .claude/skills/worktree/scripts/create-worktree.ts ${task.name} ${baseBranch}`, {
      stdio: "inherit",
    });
  }

  console.log(`\n✅ All worktrees created!`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Agents can now work in parallel in each worktree`);
  console.log(`   2. When done, review changes in each worktree`);
  console.log(`   3. Merge branches back to main`);
  console.log(`   4. Run cleanup: bun .claude/skills/worktree/scripts/cleanup-worktrees.ts`);
} catch (error) {
  console.error("❌ Parallel execution setup failed:", error);
  process.exit(1);
}
