#!/usr/bin/env bun
/**
 * Clean up all worktrees in worktrees/ directory
 * Usage: bun scripts/cleanup-worktrees.ts
 */

import { execSync } from "child_process";
import { join } from "path";

try {
  console.log("🧹 Listing worktrees...");
  const output = execSync("git worktree list --porcelain", {
    encoding: "utf-8",
  });

  const lines = output.split("\n");
  const worktreesToRemove: string[] = [];

  for (const line of lines) {
    if (line.startsWith("worktree ") && line.includes("/worktrees/")) {
      const path = line.replace("worktree ", "");
      worktreesToRemove.push(path);
    }
  }

  if (worktreesToRemove.length === 0) {
    console.log("✨ No worktrees to clean up!");
    process.exit(0);
  }

  console.log(`\n📋 Found ${worktreesToRemove.length} worktrees to remove:`);
  worktreesToRemove.forEach((path) => console.log(`   - ${path}`));

  console.log("\n🗑️  Removing worktrees...");
  for (const path of worktreesToRemove) {
    try {
      execSync(`git worktree remove ${path} --force`, { stdio: "inherit" });
      console.log(`   ✅ Removed: ${path}`);
    } catch (error) {
      console.error(`   ❌ Failed to remove ${path}:`, error);
    }
  }

  console.log(`\n✅ Cleanup complete! Removed ${worktreesToRemove.length} worktrees.`);
} catch (error) {
  console.error("❌ Cleanup failed:", error);
  process.exit(1);
}
