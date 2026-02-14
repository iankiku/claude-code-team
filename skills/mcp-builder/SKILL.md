---
name: mcp-builder
description: Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Use when building MCP servers to integrate external APIs or services, whether in Python (FastMCP) or Node/TypeScript (MCP SDK).
license: Complete terms in LICENSE.txt
---

# MCP Server Development Guide

## Overview

Create MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. The quality of an MCP server is measured by how well it enables LLMs to accomplish real-world tasks.

---

# Process

## High-Level Workflow

Creating a high-quality MCP server involves four main phases:

### Phase 1: Deep Research and Planning

#### 1.1 Understand Modern MCP Design

**API Coverage vs. Workflow Tools:**
Balance comprehensive API endpoint coverage with specialized workflow tools. When uncertain, prioritize comprehensive API coverage.

**Tool Naming and Discoverability:**
Clear, descriptive tool names help agents find the right tools quickly. Use consistent prefixes (e.g., `github_create_issue`, `github_list_repos`) and action-oriented naming.

**Context Management:**
Design tools that return focused, relevant data. Support filtering and pagination.

**Actionable Error Messages:**
Error messages should guide agents toward solutions with specific suggestions and next steps.

#### 1.2 Study MCP Protocol

Start with the sitemap: `https://modelcontextprotocol.io/sitemap.xml`. Fetch pages with `.md` suffix for markdown format.

#### 1.3 Study Framework Documentation

**Recommended stack:**
- **Language**: TypeScript (high-quality SDK, broad compatibility, good AI code generation)
- **Transport**: Streamable HTTP for remote servers (stateless JSON), stdio for local servers.

**Load framework documentation:**
- **MCP Best Practices**: [View Best Practices](./reference/mcp_best_practices.md)
- **TypeScript SDK**: Fetch `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md`
- [TypeScript Guide](./reference/node_mcp_server.md)
- **Python SDK**: Fetch `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md`
- [Python Guide](./reference/python_mcp_server.md)

#### 1.4 Plan Your Implementation

Review the service's API docs. Prioritize comprehensive API coverage. List endpoints to implement, starting with the most common operations.

---

### Phase 2: Implementation

#### 2.1 Set Up Project Structure

See language-specific guides:
- [TypeScript Guide](./reference/node_mcp_server.md)
- [Python Guide](./reference/python_mcp_server.md)

#### 2.2 Implement Core Infrastructure

Create shared utilities: API client with auth, error handling helpers, response formatting (JSON/Markdown), pagination support.

#### 2.3 Implement Tools

For each tool:

**Input Schema:** Use Zod (TypeScript) or Pydantic (Python) with constraints, clear descriptions, and examples.

**Output Schema:** Define `outputSchema` where possible. Use `structuredContent` in tool responses.

**Tool Description:** Concise summary, parameter descriptions, return type schema.

**Implementation:** Async/await for I/O, proper error handling with actionable messages, pagination support.

**Annotations:** `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint` (true/false).

---

### Phase 3: Review and Test

#### 3.1 Code Quality
Review for: no duplicated code, consistent error handling, full type coverage, clear tool descriptions.

#### 3.2 Build and Test

**TypeScript:** `npm run build` then `npx @modelcontextprotocol/inspector`
**Python:** `python -m py_compile your_server.py` then MCP Inspector

See language-specific guides for detailed testing approaches and quality checklists.
