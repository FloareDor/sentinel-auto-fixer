# research.md

## 1\. Project Context & Strategy

**Goal:** Build a portfolio-grade MVP to secure an interview at **TraceRoot.AI** (YC S25).
**Product:** "Sentinel" — An Observable "Glass Box" CI/CD Repair Agent.
**Core Philosophy:** Unlike black-box AI coding tools, Sentinel visualizes the agent's "thought process" (Reasoning Traces) alongside the code fix. This proves expertise in **Observability**, **Multi-Agent Systems**, and **Trust Engineering**.

## 2\. Tech Stack (Strict)

  * **Framework:** Next.js 14+ (App Router).
  * **Language:** TypeScript (Strict mode).
  * **Styling:** Tailwind CSS + Lucide React (Icons).
  * **AI/Agents:** LangGraph.js (Orchestration), LangChain.js.
  * **Streaming:** Vercel AI SDK (StreamData).
  * **Diffing:** `react-diff-viewer-continued` (or similar modern React component).
  * **Model:** Google Gemini API (gemini-2.0-flash-exp or gemini-1.5-pro).
  * **Validation:** Zod (for structured outputs, reducing hallucinations).

## 3\. Architecture Overview

### A. The "Brain" (Backend - API Routes)

We are building a **State Machine** using `LangGraph.js`.

  * **Input:** Error Logs + Broken Source Code.
  * **State:**
    ```typescript
    interface AgentState {
      errorLogs: string;
      sourceCode: string; // The content of the file
      attempts: number;
      // The "Money" feature: Traceability
      reasoningTrace: Array<{
        step: "diagnose" | "plan" | "fix" | "verify";
        thought: string;
        timestamp: number;
        node: string;
      }>;
      generatedPatch: string | null;
      originalCode: string;
      fixedCode: string | null;
    }
    ```
  * **Nodes:**
    1.  `Diagnostician`: Analyzes logs -\> Identifies root cause.
    2.  `Architect`: Proposes a fix plan.
    3.  `Surgeon`: Generates the actual code patch.
    4.  `Verifier`: Validates patch format and syntax.

### B. The "Face" (Frontend - Dashboard)

A single-page "Mission Control" dashboard.

  * **Layout:** Split screen.
      * **Left:** Input (Logs + Code) / Live Agent Activity Stream (Vertical Timeline).
      * **Right:** The Result (Code Diff View: Before vs After).
  * **UX Requirement:** The UI must be **Streaming**. The user sees the "Reasoning Trace" appear line-by-line as the agent thinks on the server.

## 4\. Implementation Roadmap (MVP)

### Phase 1: Scaffolding & UI Shell

  * Initialize Next.js app.
  * Build the Layout:
      * Header: "Sentinel // Observable Repair Agent"
      * Main Grid: Two columns (Input/Trace vs Diff).
  * Create `AgentActivityStream` component (Visualizes the JSON trace).

### Phase 2: The Agent Logic (LangGraph)

  * Setup `app/api/agent/route.ts`.
  * Implement the `StateGraph`.
  * **Mock Mode:** Initially, have the nodes return static "thoughts" to test the UI streaming.
  * **Real Mode:** Connect to Gemini API to process actual logic with structured outputs (JSON mode) and Zod validation.

### Phase 3: The "Glass Box" Connection

  * Implement Vercel AI SDK `StreamData`.
  * Frontend: Use `useCompletion` or custom stream reader to append "thoughts" to the UI in real-time.
  * When the stream finishes, render the Code Diff.

## 5\. Coding Guidelines for Cursor

  * **Functional Components:** Use React functional components with Hooks.
  * **Typing:** Explicitly define interfaces for all Props and State.
  * **Server Actions:** Prefer Server Actions or Route Handlers for API logic.
  * **Simplicity:** Do not use a database for the MVP. Store state in memory or pass it client-side.
  * **Aesthetics:** Windows 95/98 retro theme with classic beige/gray palette, 3D beveled borders, classic fonts (MS Sans Serif, Courier New). Think nostalgic "Mission Control" aesthetic with personality-driven agent voices.

## 6\. Example Data Structures

**The Trace Event (Streamed to UI):**

```json
{
  "type": "thought",
  "node": "Diagnostician",
  "content": "Analyzing stack trace. Error found in auth.ts line 42. Variable 'user' is null.",
  "status": "processing"
}
```

**The Final Payload:**

```json
{
  "type": "result",
  "originalCode": "...",
  "fixedCode": "...",
  "explanation": "Added optional chaining to prevent crash."
}
```