#!/usr/bin/env bun
/**
 * List all git worktrees
 * Usage: bun scripts/list-worktrees.ts
 */

import { execSync } from "child_process";

try {
  console.log("📋 Git Worktrees:\n");

  const output = execSync("git worktree list", { encoding: "utf-8" });

  if (!output.trim()) {
    console.log("No worktrees found (only main workspace exists)");
    process.exit(0);
  }

  console.log(output);

  // Count worktrees (excluding main)
  const lines = output.split("\n").filter((l) => l.trim());
  const worktreeCount = lines.length - 1; // Exclude main workspace

  console.log(`\n✅ Found ${worktreeCount} additional worktree(s)`);
} catch (error) {
  console.error("❌ Failed to list worktrees:", error);
  process.exit(1);
}
