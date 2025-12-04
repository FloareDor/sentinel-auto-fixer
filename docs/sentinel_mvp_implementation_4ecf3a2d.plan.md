---
name: Sentinel MVP Implementation
overview: Build a portfolio-grade MVP of Sentinel - an Observable CI/CD Repair Agent using Next.js 14+, shadcn/ui, Gemini API, LangGraph.js, with positive path testing first and structured outputs to reduce hallucinations.
todos:
  - id: scaffold-project
    content: Initialize Next.js 14+ project with TypeScript, install dependencies (shadcn/ui, LangGraph, Gemini SDK, Zod, Vitest), configure tsconfig, tailwind, and vitest
    status: pending
  - id: setup-shadcn-ui
    content: Initialize shadcn/ui, configure components.json, install base UI components (Button, Card, Textarea, Badge, etc.)
    status: pending
    dependencies:
      - scaffold-project
  - id: build-windows95-theme
    content: Create Windows 95 theme system - CSS variables, 3D border utilities, classic color palette, fonts, scrollbar styling, and base window/button/dialog components
    status: pending
    dependencies:
      - setup-shadcn-ui
  - id: build-ui-shell
    content: Create app layout with Windows 95 desktop background, main dashboard page with classic window layout, taskbar, status bar, and placeholder components (CodeInputPanel, AgentActivityStream, CodeDiffView) styled with Windows 95 theme
    status: pending
    dependencies:
      - build-windows95-theme
  - id: implement-gemini-client
    content: Create Gemini API client wrapper with structured output support, Zod schemas for responses, and error handling
    status: pending
    dependencies:
      - scaffold-project
  - id: create-langgraph-state
    content: Define AgentState with Zod schema, create state.ts with validation, set up TypeScript interfaces
    status: pending
    dependencies:
      - scaffold-project
  - id: implement-agent-personalities
    content: Create personality system - define distinct voices for each agent node, create personality prompts, and quips library
    status: pending
    dependencies:
      - implement-gemini-client
  - id: implement-langgraph-nodes
    content: Implement Diagnostician, Architect, Surgeon, and Verifier nodes with structured Gemini calls, Zod validation, personality-driven prompts, and human-like reasoning traces
    status: pending
    dependencies:
      - create-langgraph-state
      - implement-gemini-client
      - implement-agent-personalities
  - id: build-langgraph-graph
    content: Create StateGraph with node connections, implement graph.ts, wire up streaming via StreamData
    status: pending
    dependencies:
      - implement-langgraph-nodes
  - id: create-api-route
    content: Implement app/api/agent/route.ts with POST handler, integrate LangGraph, set up StreamData streaming, handle errors
    status: pending
    dependencies:
      - build-langgraph-graph
  - id: implement-streaming-frontend
    content: Create use-agent-stream hook, update AgentActivityStream to consume real stream, update CodeDiffView to render final result
    status: pending
    dependencies:
      - create-api-route
      - build-ui-shell
  - id: add-easter-eggs
    content: Create easter eggs - About dialog, System Properties dialog, personality quips, and optional retro boot sequence
    status: pending
    dependencies:
      - implement-streaming-frontend
      - build-windows95-theme
  - id: write-positive-path-tests
    content: Create test files for API route, LangGraph nodes, components, and Gemini client with mocked responses, test happy paths and validation
    status: pending
    dependencies:
      - implement-streaming-frontend
---

# Sentinel MVP Implementation Plan

## Overview

Build "Sentinel" - an Observable "Glass Box" CI/CD Repair Agent that visualizes reasoning traces alongside code fixes. This demonstrates expertise in Observability, Multi-Agent Systems, and Trust Engineering.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (Strict mode)
- **UI:** shadcn/ui components + Tailwind CSS + Lucide React icons
- **AI/Agents:** LangGraph.js (State Machine), LangChain.js
- **AI Model:** Google Gemini API (gemini-2.0-flash-exp or gemini-1.5-pro)
- **Streaming:** Vercel AI SDK (StreamData)
- **Diffing:** `react-diff-viewer-continued` or `@monaco-editor/react` with diff mode
- **Validation:** Zod (for structured outputs, reducing hallucinations)
- **Testing:** Vitest + React Testing Library (positive path first)
- **Styling:** Windows 95/98 retro theme with classic beige/gray palette, 3D beveled borders, classic fonts (MS Sans Serif, Courier New)

## Architecture

### Backend: LangGraph State Machine (`app/api/agent/route.ts`)

**State Schema (Zod-validated):**

```typescript
const AgentStateSchema = z.object({
  errorLogs: z.string(),
  sourceCode: z.string(),
  attempts: z.number().default(0),
  reasoningTrace: z.array(z.object({
    step: z.enum(["diagnose", "plan", "fix", "verify"]),
    thought: z.string(),
    timestamp: z.number(),
    node: z.string(),
  })),
  generatedPatch: z.string().nullable(),
  originalCode: z.string(),
  fixedCode: z.string().nullable(),
});
```

**Nodes (with Personality):**

1. **Diagnostician:** Analyzes error logs → Identifies root cause (structured output)
   - Personality: Curious, methodical. Thoughts like "Hmm, this error looks suspicious..." or "Let me dig into these logs..."
2. **Architect:** Proposes fix plan (structured output)
   - Personality: Confident, strategic. Thoughts like "Alright, time to fix this mess..." or "I've got a plan..."
3. **Surgeon:** Generates code patch (structured output with code validation)
   - Personality: Precise, careful. Thoughts like "Let me carefully patch this up..." or "Making the incision..."
4. **Verifier:** Validates patch format (syntax check)
   - Personality: Meticulous, reassuring. Thoughts like "Double-checking... looks good to me!" or "All systems operational!"

**AI Engineering Practices:**

- All Gemini calls use structured outputs (JSON mode) with Zod schemas
- Prompt engineering: Chain-of-thought reasoning, explicit constraints, personality-driven responses
- Personality prompts: Each node has a distinct voice and style in its reasoning traces
- Validation at each node boundary
- Error handling with retry logic (max 3 attempts)
- Streaming intermediate thoughts via StreamData with personality intact

### Frontend: Windows 95-Style Mission Control Dashboard (`app/page.tsx`)

**Layout:**

- Classic Windows 95 desktop background (subtle pattern/grid)
- Title bar: "Sentinel - Observable Repair Agent" with classic minimize/maximize/close buttons
- Split screen grid (classic window panes):
  - **Left:** Input panel (error logs + code) + Live Activity Stream (vertical timeline)
  - **Right:** Code Diff View (Before vs After)
- Bottom taskbar with status bar: "Ready" / "Processing..." / "All systems operational"
- System tray icons (optional)

**Components:**

- `components/windows95/window.tsx` - Classic window wrapper with 3D borders
- `components/windows95/button.tsx` - 3D raised/inset button component
- `components/windows95/dialog.tsx` - Classic Windows dialog box
- `components/windows95/titlebar.tsx` - Classic title bar with window controls
- `components/taskbar.tsx` - Bottom taskbar component
- `components/system-tray.tsx` - System tray with icons
- `components/agent-activity-stream.tsx` - Timeline visualization (Windows 95 style)
- `components/code-input-panel.tsx` - Classic textarea with Windows 95 styling
- `components/code-diff-view.tsx` - Diff viewer with classic scrollbars
- `components/status-bar.tsx` - Bottom status bar with messages

**Styling Details:**
- Classic Windows 95 color palette: #C0C0C0 (gray), #0080FF (blue), beige backgrounds
- 3D beveled borders using box-shadow techniques
- Classic fonts: MS Sans Serif (fallback: system-ui), Courier New for code
- Classic scrollbars (webkit-scrollbar styling)
- Classic progress bars with animated blocks
- Retro loading animations (hourglass cursor, classic progress indicators)

**Streaming:** Uses Vercel AI SDK `useCompletion` or custom stream reader to append thoughts in real-time with Windows 95-style animations.

## Implementation Phases

### Phase 1: Project Scaffolding & Testing Setup

**Files to create:**

- `package.json` - Dependencies (Next.js 14+, shadcn/ui, LangGraph, Gemini SDK, Zod, Vitest)
- `tsconfig.json` - Strict TypeScript config
- `next.config.ts` - Next.js configuration
- `vitest.config.ts` - Vitest setup
- `tailwind.config.ts` - Tailwind + shadcn/ui config
- `components.json` - shadcn/ui configuration
- `.env.example` - Environment variables template

**Testing Setup:**

- Configure Vitest with React Testing Library
- Create test utilities for mocking Gemini API responses
- Set up positive path test structure

### Phase 2: Windows 95 Theme System & Core UI Shell

**Files:**

- `app/layout.tsx` - Root layout with Windows 95 desktop background
- `app/page.tsx` - Main dashboard page with classic window layout
- `app/globals.css` - Windows 95 theme CSS (colors, fonts, 3D borders, scrollbars)
- `components/ui/` - shadcn/ui components (base, will be styled with Windows 95 theme)
- `components/windows95/window.tsx` - Classic window wrapper component
- `components/windows95/button.tsx` - 3D button component (raised/inset states)
- `components/windows95/dialog.tsx` - Classic dialog box component
- `components/windows95/titlebar.tsx` - Title bar with window controls
- `components/windows95/scrollbar.tsx` - Classic scrollbar styling
- `components/taskbar.tsx` - Bottom taskbar component
- `components/status-bar.tsx` - Status bar with classic Windows messages
- `components/system-tray.tsx` - System tray icons (optional)
- `components/header.tsx` - App header (Windows 95 style)
- `components/code-input-panel.tsx` - Input form with classic Windows styling
- `components/agent-activity-stream.tsx` - Timeline visualization (Windows 95 style, mock data initially)
- `components/code-diff-view.tsx` - Diff viewer with classic scrollbars (mock initially)

**Styling:** Windows 95/98 retro theme:
- Classic color palette: #C0C0C0 gray, #0080FF blue, beige backgrounds
- 3D beveled borders (box-shadow: inset/outset techniques)
- Classic fonts: MS Sans Serif (fallback: system-ui), Courier New for code
- Classic scrollbars, buttons, and UI elements
- Desktop background pattern
- Classic progress bars and loading animations

### Phase 3: LangGraph State Machine (Backend)

**Files:**

- `app/api/agent/route.ts` - API route handler
- `lib/langgraph/state.ts` - State schema (Zod)
- `lib/langgraph/nodes/diagnostician.ts` - Diagnose node
- `lib/langgraph/nodes/architect.ts` - Plan node
- `lib/langgraph/nodes/surgeon.ts` - Fix node
- `lib/langgraph/nodes/verifier.ts` - Verify node
- `lib/langgraph/graph.ts` - StateGraph definition
- `lib/gemini/client.ts` - Gemini API client wrapper
- `lib/gemini/prompts.ts` - Structured prompts with constraints and personality
- `lib/gemini/personalities.ts` - Personality definitions for each agent node
- `lib/gemini/schemas.ts` - Zod schemas for structured outputs

**Implementation:**

- Use Gemini API with JSON mode for structured outputs
- Inject personality into prompts: Each node has distinct voice and style
- Each node validates output against Zod schema
- Stream intermediate thoughts via StreamData with personality intact
- Error handling with retry logic
- Human-like reasoning traces: "Hmm...", "Aha!", "Let me check...", etc.

### Phase 4: Streaming Integration

**Files:**

- `lib/streaming/stream-handler.ts` - StreamData utilities
- `hooks/use-agent-stream.ts` - Custom hook for consuming stream
- Update `components/agent-activity-stream.tsx` - Connect to real stream
- Update `components/code-diff-view.tsx` - Render final diff

**Stream Format:**

```typescript
// Stream event
{ type: "thought", node: string, content: string, step: string, timestamp: number }
// Final event
{ type: "result", originalCode: string, fixedCode: string, explanation: string }
```

### Phase 5: Easter Eggs & Personality Polish

**Files:**

- `components/easter-eggs/about-dialog.tsx` - Classic "About Sentinel" dialog (Windows 95 style)
- `components/easter-eggs/system-properties.tsx` - "System Properties" showing agent version
- `lib/personality/quips.ts` - Collection of personality-driven messages and quips
- Update prompts with more personality variations

**Features:**

- Hidden "About" dialog accessible via Help menu or Alt+H
- Classic Windows-style "System Properties" showing:
  - Agent version
  - Build date
  - "Sentinel Repair Agent v1.0"
  - Retro credits
- Personality quips: Randomize agent messages for variety
- Classic Windows sounds (optional, via Web Audio API)
- Retro boot sequence on first load (optional)

### Phase 6: Positive Path Testing

**Test Files:**

- `__tests__/api/agent.test.ts` - API route tests (positive paths)
- `__tests__/lib/langgraph/nodes/diagnostician.test.ts` - Node tests
- `__tests__/lib/langgraph/nodes/architect.test.ts`
- `__tests__/lib/langgraph/nodes/surgeon.test.ts`
- `__tests__/components/agent-activity-stream.test.tsx` - Component tests
- `__tests__/lib/gemini/client.test.ts` - Gemini client tests

**Test Strategy:**

- Mock Gemini API responses with valid structured outputs
- Test happy paths: valid error logs → successful diagnosis → fix → diff
- Validate Zod schemas are enforced
- Test streaming behavior

## Key Files Structure

```
observe/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css (Windows 95 theme)
│   └── api/
│       └── agent/
│           └── route.ts
├── components/
│   ├── ui/ (shadcn/ui base components)
│   ├── windows95/
│   │   ├── window.tsx
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── titlebar.tsx
│   │   └── scrollbar.tsx
│   ├── easter-eggs/
│   │   ├── about-dialog.tsx
│   │   └── system-properties.tsx
│   ├── header.tsx
│   ├── taskbar.tsx
│   ├── status-bar.tsx
│   ├── system-tray.tsx
│   ├── code-input-panel.tsx
│   ├── agent-activity-stream.tsx
│   └── code-diff-view.tsx
├── lib/
│   ├── langgraph/
│   │   ├── state.ts
│   │   ├── graph.ts
│   │   └── nodes/
│   ├── gemini/
│   │   ├── client.ts
│   │   ├── prompts.ts
│   │   ├── personalities.ts
│   │   └── schemas.ts
│   ├── streaming/
│   │   └── stream-handler.ts
│   └── personality/
│       └── quips.ts
├── hooks/
│   └── use-agent-stream.ts
├── __tests__/
│   ├── api/
│   ├── lib/
│   └── components/
├── docs/
│   └── research.md
└── package.json
```

## AI Engineering Best Practices

1. **Structured Outputs:** All Gemini calls use JSON mode with Zod validation
2. **Prompt Engineering:** Chain-of-thought, explicit constraints, examples, personality-driven responses
3. **Personality System:** Each agent node has distinct voice and style to make reasoning traces feel human
4. **Validation:** Zod schemas at every boundary (API → Node → Node → API)
5. **Error Handling:** Retry with exponential backoff, graceful degradation
6. **Streaming:** Real-time thought visibility for transparency with personality intact
7. **Testing:** Mock Gemini responses, test validation logic, positive paths first

## Windows 95 Theme Implementation

**Color Palette:**
- Background: #C0C0C0 (classic gray)
- Highlight: #0080FF (classic blue)
- Button face: #C0C0C0
- Button shadow: #808080 (darker gray)
- Button highlight: #FFFFFF (white)
- Desktop: #008080 (teal) or beige pattern

**3D Border Techniques:**
- Raised: `border-top: 2px solid white; border-left: 2px solid white; border-right: 2px solid #808080; border-bottom: 2px solid #808080;`
- Inset: `border-top: 2px solid #808080; border-left: 2px solid #808080; border-right: 2px solid white; border-bottom: 2px solid white;`
- Or use box-shadow for modern approach

**Classic Fonts:**
- UI: MS Sans Serif (fallback: system-ui, -apple-system)
- Code: Courier New, monospace
- Title bars: MS Sans Serif, bold

**Personality Examples:**

- Diagnostician: "Hmm, this error looks suspicious...", "Let me dig into these logs...", "Aha! Found something interesting..."
- Architect: "Alright, time to fix this mess...", "I've got a plan...", "Let me think about the best approach..."
- Surgeon: "Let me carefully patch this up...", "Making the incision...", "Applying the fix..."
- Verifier: "Double-checking... looks good to me!", "All systems operational!", "Verification complete!"

## Environment Variables

```
GEMINI_API_KEY=your_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Dependencies (Key)

- `next@latest`
- `@google/generative-ai`
- `langchain@latest`
- `@langchain/langgraph`
- `zod`
- `@vercel/ai`
- `react-diff-viewer-continued` or `@monaco-editor/react`
- `shadcn/ui` components (base, styled with Windows 95 theme)
- `vitest`
- `@testing-library/react`
- Optional: `98.css` or custom Windows 95 CSS framework