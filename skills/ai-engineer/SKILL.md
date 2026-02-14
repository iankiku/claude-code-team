---
name: ai-engineer
description: "AI engineering patterns: Mastra agents/workflows, LangChain/LangGraph, LangFlow, MCP servers."
---

# AI Engineer

Patterns for building AI systems with Mastra, LangChain, LangGraph, and MCP servers.

## Mastra

### Agent Definition
```typescript
import { Agent } from '@mastra/core';

const researchAgent = new Agent({
  name: 'researcher',
  instructions: `You are a research assistant. Find accurate information
    and cite your sources. Be concise.`,
  model: {
    provider: 'ANTHROPIC',
    name: 'claude-sonnet-4-5-20250929',
  },
  tools: [webSearchTool, readUrlTool],
});

const response = await researchAgent.generate('What is UCP?');
```

### Workflow Patterns
```typescript
import { Workflow, Step } from '@mastra/core';

const contentPipeline = new Workflow({
  name: 'content-pipeline',
  triggerSchema: z.object({ topic: z.string() }),
});

const research = new Step({
  id: 'research',
  execute: async ({ context }) => {
    const agent = mastra.getAgent('researcher');
    const result = await agent.generate(`Research: ${context.topic}`);
    return { research: result.text };
  },
});

const write = new Step({
  id: 'write',
  execute: async ({ context }) => {
    const agent = mastra.getAgent('writer');
    const result = await agent.generate(
      `Write article based on: ${context.research}`
    );
    return { article: result.text };
  },
});

contentPipeline.step(research).then(write).commit();
```

### Tool Creation
```typescript
import { createTool } from '@mastra/core';

const calculatorTool = createTool({
  id: 'calculator',
  description: 'Performs basic math calculations',
  inputSchema: z.object({
    expression: z.string().describe('Math expression to evaluate'),
  }),
  execute: async ({ context }) => {
    const result = Function(`return (${context.expression})`)();
    return { result: String(result) };
  },
});
```

### Memory
```typescript
const agentWithMemory = new Agent({
  name: 'assistant',
  instructions: 'You are a helpful assistant with memory.',
  model: { provider: 'ANTHROPIC', name: 'claude-sonnet-4-5-20250929' },
  memory: {
    provider: 'postgres',
    connectionString: process.env.DATABASE_URL,
  },
});

// Conversations persist across calls via threadId
await agentWithMemory.generate('My name is Alice', { threadId: 'user-123' });
```

## LangChain / LangGraph

### Tools & Agents
```typescript
import { tool } from '@langchain/core/tools';
import { createReactAgent } from '@langchain/langgraph/prebuilt';

const searchTool = tool(
  async ({ query }) => `Results for: ${query}`,
  {
    name: 'search',
    description: 'Search the web for information',
    schema: z.object({ query: z.string() }),
  }
);

const agent = createReactAgent({
  llm: new ChatAnthropic({ model: 'claude-sonnet-4-5-20250929' }),
  tools: [searchTool],
});

const result = await agent.invoke({
  messages: [{ role: 'user', content: 'Search for latest AI news' }],
});
```

### LangGraph State Graph
```typescript
import { StateGraph, MessagesAnnotation } from '@langchain/langgraph';

const workflow = new StateGraph(MessagesAnnotation)
  .addNode('agent', callModel)
  .addNode('tools', toolNode)
  .addEdge('__start__', 'agent')
  .addConditionalEdges('agent', shouldUseTool, {
    tools: 'tools',
    end: '__end__',
  })
  .addEdge('tools', 'agent');

const app = workflow.compile();
```

### Checkpointing (State Persistence)
```typescript
import { MemorySaver } from '@langchain/langgraph';

const checkpointer = new MemorySaver();
const app = workflow.compile({ checkpointer });

const config = { configurable: { thread_id: 'conversation-1' } };
await app.invoke({ messages: [{ role: 'user', content: 'Hello' }] }, config);
// Later -- continues from where it left off
await app.invoke({ messages: [{ role: 'user', content: 'What did I say?' }] }, config);
```

### Human-in-the-Loop
```typescript
import { interrupt } from '@langchain/langgraph';

async function reviewNode(state) {
  const approval = interrupt({
    question: 'Should I proceed with this action?',
    action: state.pendingAction,
  });
  return { ...state, approved: approval === 'approved' };
}
```

## MCP Server Patterns

### Basic MCP Server
```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({ name: 'my-service', version: '1.0.0' });

server.tool(
  'get_user',
  'Get user by ID',
  { userId: z.string().describe('The user ID') },
  async ({ userId }) => {
    const user = await db.users.findById(userId);
    return { content: [{ type: 'text', text: JSON.stringify(user) }] };
  }
);

server.resource(
  'user-list',
  'users://list',
  async () => ({
    contents: [{
      uri: 'users://list',
      mimeType: 'application/json',
      text: JSON.stringify(await db.users.list()),
    }],
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

## Key Rules

1. **Start with Mastra** for simple agent tasks -- most ergonomic
2. **Use LangGraph** for complex multi-step workflows with branching logic
3. **MCP servers** should be stateless -- let the client manage conversation state
4. **Always use structured output** (Zod schemas) for tool inputs/outputs
5. **Stream responses** for long-running generations -- better UX
6. **Rate limit & cache** LLM calls -- they are expensive
