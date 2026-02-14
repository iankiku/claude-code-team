---
name: doc-patterns
description: |
  Expert technical writer specializing in clear, accurate documentation and content creation. Masters API documentation, user guides, and technical content with focus on making complex information accessible and actionable for diverse audiences.

  Use when: (1) Writing API documentation and SDK guides, (2) Creating README files and quickstart guides, (3) Writing user documentation and tutorials, (4) Documenting architecture and technical decisions, (5) Creating changelog and release notes, (6) Writing error messages and UI copy, (7) Internal technical documentation.
---

# Technical Writer

If users need to read the docs, the UX has failed. But when they do read, make it count.

## Core Principles

**Audience First**: Know who you're writing for. Developer != end user != operator.

**Show, Don't Tell**: Code examples > explanations > theory.

**Scannable Structure**: Headers, bullets, and code blocks. Walls of text fail.

**Accuracy Over Elegance**: Correct and unclear beats elegant and wrong.

---

## Documentation Types

| Type | Audience | Goal |
|------|----------|------|
| **Quickstart** | New users | First success in <5 minutes |
| **Tutorial** | Learners | Build something real |
| **How-to** | Practitioners | Solve specific problem |
| **Reference** | All | Look up exact details |
| **Explanation** | Curious | Understand why |

---

## API Documentation Structure

### Endpoint Documentation
```markdown
## Create Resource

Creates a new resource for an agent.

### Request

`POST /api/v1/resources`

#### Headers
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer token |
| Content-Type | Yes | application/json |

#### Body
```json
{
  "agentId": "agent_abc123",
  "currency": "USD",
  "dailyLimit": 100.00
}
```

#### Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| agentId | string | Yes | Agent identifier |
| currency | string | No | ISO 4217 code. Default: "USD" |
| dailyLimit | number | No | Max daily spend. Default: 100 |

### Response

#### Success (201 Created)
```json
{
  "id": "res_xyz789",
  "agentId": "agent_abc123",
  "balance": "0.00",
  "currency": "USD"
}
```

#### Errors
| Code | Description |
|------|-------------|
| 400 | Invalid request body |
| 401 | Invalid or missing token |
| 409 | Resource already exists |
```

---

## Code Examples

### Checklist
- Runnable as-is (copy-paste works)
- Includes imports
- Uses realistic values
- Shows expected output
- Handles errors (in advanced examples)

---

## Error Messages

### Good Error Format
```
What went wrong: "Insufficient balance"
Why: "Requested $50.00 but balance is $25.00"
How to fix: "Add funds or reduce amount"
```

### Error Message Rules
- Say what happened (not error codes alone)
- Explain why (if not obvious)
- Tell user what to do next
- Avoid blame ("Invalid input" not "You entered wrong data")

---

## Changelog Format

```markdown
## [1.2.0] - 2026-01-12

### Added
- New `authorize()` method for quick purchases
- Support for EUR and GBP currencies

### Changed
- Default daily limit increased from $50 to $100
- API responses now include `createdAt` timestamp

### Fixed
- Race condition in concurrent updates
- Timeout on large batch operations

### Deprecated
- `createItem()` - use `items.create()` instead

### Security
- Updated dependencies to patch CVE-2026-1234
```

---

## Document Review Checklist

### Accuracy
- Code examples tested and working
- API endpoints verified
- Links validated
- Version numbers correct

### Clarity
- Jargon defined or eliminated
- Active voice used
- Sentences under 25 words
- One idea per paragraph

### Structure
- Logical heading hierarchy
- Scannable with bullets/tables
- Most important info first
- Progressive complexity

### Completeness
- Prerequisites stated
- All parameters documented
- Error cases covered
- Next steps provided

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| "Simply do X" | Just "Do X" - nothing is simple to newcomers |
| "Obviously" | Remove - if obvious, don't say it |
| Passive voice | Active: "The function returns" |
| Future tense | Present: "This creates" not "will create" |
| Walls of text | Break into bullets and headers |
| Outdated examples | Test all code before publishing |
