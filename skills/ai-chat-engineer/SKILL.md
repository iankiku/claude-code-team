---
name: ai-chat-engineer
description: |
  Specialist in building AI chat interfaces like ChatGPT and Claude. Uses assistant-ui (React + shadcn) with Vercel AI SDK for backend-agnostic, streaming chat UIs. Creates agentic interfaces with tool calling, generative UI, and real-time streaming.

  Use when: (1) Building ChatGPT/Claude-like chat interfaces, (2) Creating AI assistants with streaming responses, (3) Implementing tool calling with visual UI, (4) Building copilot/agentic interfaces, (5) Adding AI chat to existing React/Next.js apps.
---

# AI Chat Engineer

The best chat UI is invisible. Users should focus on the conversation, not the interface.

## Core Principles

**Backend Agnostic**: Same UI works with OpenAI, Anthropic, Gemini, Groq, Ollama, or any provider.

**Stream Everything**: Never make users wait for complete responses. Stream text, tools, and state.

**Progressive Enhancement**: Start simple (text chat), add features (tools, attachments) as needed.

**Shadcn Foundation**: Consistent with modern React patterns. Customizable, not opinionated.

---

## Framework Choice: assistant-ui

| Feature | assistant-ui | CopilotKit | Raw Vercel AI SDK |
|---------|--------------|------------|-------------------|
| **Setup** | 3 commands | Moderate | DIY everything |
| **Backend agnostic** | Yes | Yes | Yes |
| **Pre-built UI** | Shadcn-based | Custom | No |
| **Tool UI** | Generative UI | Yes | Manual |
| **Streaming** | Built-in | Built-in | Built-in |

Use assistant-ui for ChatGPT/Claude-like interfaces. CopilotKit only for specific copilot patterns (sidebar, popup).

---

## Quick Start

```bash
npx assistant-ui@latest create    # New project
npx assistant-ui@latest init      # Add to existing Next.js
```

---

## Backend Setup

All providers follow the same pattern. Pick your provider and model:

| Provider | Package | Model Example |
|----------|---------|---------------|
| OpenAI | `@ai-sdk/openai` | `openai("gpt-4o")` |
| Anthropic | `@ai-sdk/anthropic` | `anthropic("claude-sonnet-4-5-20250929")` |
| Google | `@ai-sdk/google` | `google("gemini-2.0-flash")` |
| Groq | `@ai-sdk/openai` (custom baseURL) | `groq("llama-3.3-70b-versatile")` |
| Ollama | `ollama-ai-provider-v2` | `ollama("llama3")` |

### Route Handler (same for all providers)
```typescript
// app/api/chat/route.ts
import { streamText, convertToModelMessages } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: yourProvider("model-name"),
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

---

## Frontend Components

### Basic Thread
```tsx
"use client";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";

export default function ChatPage() {
  const runtime = useChatRuntime({ api: "/api/chat" });
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <Thread />
    </AssistantRuntimeProvider>
  );
}
```

### With Thread List (Multiple Conversations)
```tsx
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { Thread } from "@/components/assistant-ui/thread";

export default function ChatPage() {
  const runtime = useChatRuntime({ api: "/api/chat" });
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-screen">
        <ThreadList className="w-64 border-r" />
        <Thread className="flex-1" />
      </div>
    </AssistantRuntimeProvider>
  );
}
```

### Modal/Popup Chat
```tsx
import { AssistantModal } from "@/components/assistant-ui/assistant-modal";

export default function AppWithChat() {
  const runtime = useChatRuntime({ api: "/api/chat" });
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <YourApp />
      <AssistantModal />
    </AssistantRuntimeProvider>
  );
}
```

---

## Tool Calling (Agentic UI)

### Define Tools (Backend)
```typescript
import { streamText, convertToModelMessages, tool } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: openai("gpt-4o"),
    messages: convertToModelMessages(messages),
    tools: {
      getWeather: tool({
        description: "Get weather for a location",
        parameters: z.object({ location: z.string() }),
        execute: async ({ location }) => {
          return { temperature: 72, condition: "sunny" };
        },
      }),
    },
  });
  return result.toUIMessageStreamResponse();
}
```

### Tool UI (Frontend)
```tsx
import { makeAssistantToolUI } from "@assistant-ui/react";

export const WeatherToolUI = makeAssistantToolUI<
  { location: string },
  { temperature: number; condition: string }
>({
  toolName: "getWeather",
  render: ({ args, result, status }) => {
    if (status === "running") return <div>Loading weather for {args.location}...</div>;
    if (result) {
      return (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3>{args.location}</h3>
          <p>{result.temperature}F - {result.condition}</p>
        </div>
      );
    }
    return null;
  },
});

// Register in page: <WeatherToolUI /> inside AssistantRuntimeProvider
```

---

## Attachments (Images, Files)

```tsx
const runtime = useChatRuntime({
  api: "/api/chat",
  adapters: {
    attachments: {
      accept: "image/*,.pdf,.txt",
      maxFileSize: 5 * 1024 * 1024, // 5MB
    },
  },
});
```

---

## Styling & Customization

### CSS Variables
```css
:root {
  --assistant-ui-thread-max-width: 768px;
  --assistant-ui-message-padding: 1rem;
  --assistant-ui-user-message-bg: hsl(var(--primary));
  --assistant-ui-assistant-message-bg: hsl(var(--muted));
}
```

### Custom Components
```tsx
import { ThreadPrimitive } from "@assistant-ui/react";

function CustomMessage() {
  return (
    <ThreadPrimitive.Messages
      components={{
        UserMessage: ({ children }) => (
          <div className="my-custom-user-message">{children}</div>
        ),
        AssistantMessage: ({ children }) => (
          <div className="my-custom-assistant-message">{children}</div>
        ),
      }}
    />
  );
}
```

---

## Runtime Options

| Runtime | Use Case |
|---------|----------|
| `useChatRuntime` | Simple chat with AI SDK |
| `useLocalRuntime` | Custom backend, full control |
| `useExternalStoreRuntime` | Redux/Zustand state management |
| `useLangGraphRuntime` | LangGraph agent workflows |
| `useMastraRuntime` | Mastra orchestration |

---

## Common Patterns

### System Prompt
```typescript
const result = streamText({
  model: openai("gpt-4o"),
  system: "You are a helpful assistant for our e-commerce platform...",
  messages: convertToModelMessages(messages),
});
```

### Conversation Memory
```typescript
const recentMessages = messages.slice(-10);
const result = streamText({
  model: openai("gpt-4o"),
  messages: convertToModelMessages(recentMessages),
});
```

### Streaming with Callbacks
```tsx
const runtime = useChatRuntime({
  api: "/api/chat",
  onResponse: (response) => console.log("Stream started"),
  onFinish: (message) => console.log("Complete:", message),
  onError: (error) => console.error("Error:", error),
});
```
