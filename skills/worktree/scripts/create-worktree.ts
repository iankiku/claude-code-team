#!/usr/bin/env bun
/**
 * Create a git worktree for parallel development
 * Usage: bun scripts/create-worktree.ts <task-name> [base-branch]
 */

import { execSync } from "child_process";
import { join } from "path";
import { mkdirSync, existsSync } from "fs";

const taskName = process.argv[2];
const baseBranch = process.argv[3] || "main";

if (!taskName) {
  console.error("Usage: bun create-worktree.ts <task-name> [base-branch]");
  process.exit(1);
}

// Generate branch and path names
const branchName = `feature/${taskName}`;

// Create worktrees at project root (parent directory), not inside the repo
// This avoids merge conflicts by keeping worktrees outside the main repository
const currentDir = process.cwd();
const repoName = currentDir.split("/").pop(); // e.g., "forward-deployed-agent"
const projectRoot = join(currentDir, "..");
const worktreesDir = join(projectRoot, "worktrees");
const worktreePath = join(worktreesDir, taskName);

try {
  // Ensure worktrees directory exists at project root
  if (!existsSync(worktreesDir)) {
    mkdirSync(worktreesDir, { recursive: true });
  }

  // Update base branch
  console.log(`📥 Updating ${baseBranch}...`);
  execSync(`git checkout ${baseBranch} && git pull`, { stdio: "inherit" });

  // Create worktree at project root level (outside the repo)
  console.log(`🌿 Creating worktree: ${worktreePath}`);
  execSync(`git worktree add ${worktreePath} -b ${branchName}`, {
    stdio: "inherit",
  });

  console.log(`\n✅ Worktree created!`);
  console.log(`   Path: ${worktreePath}`);
  console.log(`   Branch: ${branchName}`);
  console.log(`   Location: Project root (not in ${repoName})`);
  console.log(`\n📁 To work in this worktree:`);
  console.log(`   cd ${worktreePath}`);
} catch (error) {
  console.error("❌ Failed to create worktree:", error);
  process.exit(1);
}
