import { AgentState } from '../state';
import { createGeminiClient } from '../../gemini/client';
import { DiagnosticianResponseSchema } from '../../gemini/schemas';
import { getPersonalityPrompt } from '../../gemini/prompts';

/**
 * Diagnostician node - analyzes error logs and source code to identify root causes
 * @param state - Current agent state
 * @returns Updated state with diagnostic analysis and reasoning trace
 */
export async function diagnosticianNode(state: AgentState): Promise<AgentState> {
  const client = createGeminiClient();

  // Create the diagnostic prompt
  const basePrompt = `
You are analyzing error logs and source code to identify the root cause of an issue.

Error Logs:
${state.errorLogs}

Source Code:
${state.sourceCode}

Your task is to:
1. Carefully analyze the error logs for patterns and clues
2. Examine the source code for potential issues
3. Identify the root cause and categorize the error
4. Assess the severity level
5. Provide a high-level suggestion for fixing the issue

Respond with a structured analysis that includes your thought process, root cause identification, error category, severity assessment, and suggested fix approach.`;

  const prompt = getPersonalityPrompt('diagnostician', basePrompt);

  // Call Gemini with structured output
  const result = await client.generateStructured(
    prompt,
    DiagnosticianResponseSchema,
    {
      temperature: 0.3, // Lower temperature for more analytical responses
      systemInstruction: 'You are a diagnostician analyzing code errors. Be thorough and methodical.',
    }
  );

  if (!result.success || !result.data) {
    throw new Error(`Diagnostician failed: ${result.error}`);
  }

  // Add reasoning trace entry
  const traceEntry = {
    step: 'diagnose' as const,
    thought: result.data.thought,
    timestamp: Date.now(),
    node: 'diagnostician',
  };

  // Return updated state
  return {
    ...state,
    reasoningTrace: [...state.reasoningTrace, traceEntry],
  };
}
