---
name: skill-creator
user-invocable: true
argument-hint: "Name or describe the skill to create or update"
description: Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations.
license: Complete terms in LICENSE.txt
---

# Skill Creator

This skill provides guidance for creating effective skills.

## About Skills

Skills are modular, self-contained packages that extend Claude's capabilities by providing
specialized knowledge, workflows, and tools. Think of them as "onboarding guides" for specific
domains or tasks—they transform Claude from a general-purpose agent into a specialized agent
equipped with procedural knowledge that no model can fully possess.

### What Skills Provide

1. Specialized workflows - Multi-step procedures for specific domains
2. Tool integrations - Instructions for working with specific file formats or APIs
3. Domain expertise - Company-specific knowledge, schemas, business logic
4. Bundled resources - Scripts, references, and assets for complex and repetitive tasks

## Core Principles

### Concise is Key

The context window is a public good. Only add context Claude doesn't already have. Challenge each piece of information: "Does Claude really need this explanation?" and "Does this paragraph justify its token cost?"

Prefer concise examples over verbose explanations.

### Set Appropriate Degrees of Freedom

- **High freedom (text instructions)**: Multiple approaches valid, decisions depend on context
- **Medium freedom (pseudocode/scripts with params)**: Preferred pattern exists, some variation acceptable
- **Low freedom (specific scripts, few params)**: Fragile operations, consistency critical, specific sequence required

### Anatomy of a Skill

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter: name + description (required)
│   └── Markdown instructions (required)
└── Bundled Resources (optional)
    ├── scripts/          - Executable code (deterministic, token-efficient)
    ├── references/       - Documentation loaded into context as needed
    └── assets/           - Files used in output (templates, icons, fonts)
```

#### SKILL.md Frontmatter
- `name`: The skill name
- `description`: Primary triggering mechanism. Include both what it does AND when to use it. All "when to use" info goes here, not in the body.

#### Bundled Resources
- **Scripts**: When same code is rewritten repeatedly or deterministic reliability needed
- **References**: Documentation Claude should reference while working (schemas, API docs, policies). Keep SKILL.md lean; move detailed info here
- **Assets**: Files used in output, not loaded into context (templates, images, boilerplate)

Do NOT create extraneous files (README.md, CHANGELOG.md, INSTALLATION_GUIDE.md, etc.).

### Progressive Disclosure

Keep SKILL.md under 500 lines. Split content into separate files when approaching this limit.

Three loading levels:
1. **Metadata (name + description)** - Always in context (~100 words)
2. **SKILL.md body** - When skill triggers (<5k words)
3. **Bundled resources** - As needed (unlimited)

When splitting: reference files from SKILL.md with clear descriptions of when to read them. Keep references one level deep. Structure files >100 lines with a table of contents.

## Skill Creation Process

### Step 1: Understand the Skill with Concrete Examples

Understand concrete examples of how the skill will be used. Ask targeted questions:
- What functionality should the skill support?
- Can you give examples of how it would be used?
- What would a user say that should trigger this skill?

### Step 2: Plan Reusable Skill Contents

Analyze each example to identify what scripts, references, and assets would be helpful for repeated execution.

### Step 3: Initialize the Skill

```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

Creates skill directory with SKILL.md template, example `scripts/`, `references/`, `assets/` directories. Skip if skill already exists.

### Step 4: Edit the Skill

#### Learn Proven Design Patterns
- **Multi-step processes**: See references/workflows.md
- **Specific output formats**: See references/output-patterns.md

#### Start with Reusable Skill Contents
Implement `scripts/`, `references/`, `assets/` files. Test scripts by running them. Delete unused example files.

#### Update SKILL.md
Use imperative/infinitive form. Write frontmatter with `name` and `description` only.

### Step 5: Package the Skill

```bash
scripts/package_skill.py <path/to/skill-folder>
# Optional output dir:
scripts/package_skill.py <path/to/skill-folder> ./dist
```

Validates (frontmatter, naming, structure, descriptions) then creates `.skill` file (zip with .skill extension). Fix errors and re-run if validation fails.

### Step 6: Iterate

1. Use the skill on real tasks
2. Notice struggles or inefficiencies
3. Update SKILL.md or bundled resources
4. Test again
