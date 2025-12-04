import { z } from 'zod';

/**
 * Schema for reasoning trace entries
 */
const ReasoningTraceEntrySchema = z.object({
  step: z.enum(['diagnose', 'plan', 'fix', 'verify']),
  thought: z.string(),
  timestamp: z.number(),
  node: z.string(),
});

/**
 * Main agent state schema for LangGraph
 */
export const AgentStateSchema = z.object({
  errorLogs: z.string(),
  sourceCode: z.string(),
  attempts: z.number().default(0),
  reasoningTrace: z.array(ReasoningTraceEntrySchema),
  generatedPatch: z.string().nullable(),
  originalCode: z.string(),
  fixedCode: z.string().nullable(),
});

/**
 * TypeScript type inferred from the schema
 */
export type AgentState = z.infer<typeof AgentStateSchema>;

/**
 * Type for reasoning trace entries
 */
export type ReasoningTraceEntry = z.infer<typeof ReasoningTraceEntrySchema>;

/**
 * Creates an initial agent state from error logs and source code
 * @param errorLogs - The error logs to analyze
 * @param sourceCode - The source code to fix
 * @returns A valid AgentState object
 */
export function createInitialState(
  errorLogs: string,
  sourceCode: string
): AgentState {
  return {
    errorLogs,
    sourceCode,
    attempts: 0,
    reasoningTrace: [],
    generatedPatch: null,
    originalCode: sourceCode,
    fixedCode: null,
  };
}

