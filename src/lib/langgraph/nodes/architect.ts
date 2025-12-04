import { AgentState } from '../state';
import { createGeminiClient } from '../../gemini/client';
import { ArchitectResponseSchema } from '../../gemini/schemas';
import { getPersonalityPrompt } from '../../gemini/prompts';

/**
 * Architect node - proposes comprehensive fix plans with clear steps and risk assessments
 * @param state - Current agent state
 * @returns Updated state with fix plan and reasoning trace
 */
export async function architectNode(state: AgentState): Promise<AgentState> {
  const client = createGeminiClient();

  // Get the diagnostician's analysis from the reasoning trace
  const diagnosticianTrace = state.reasoningTrace.find(trace => trace.node === 'diagnostician');

  // Create the architect prompt
  const basePrompt = `
Based on the diagnostic analysis, you need to create a comprehensive plan to fix the identified issue.

Error Logs:
${state.errorLogs}

Source Code:
${state.sourceCode}

${diagnosticianTrace ? `Diagnostician's Analysis: ${diagnosticianTrace.thought}` : ''}

Your task is to:
1. Analyze the diagnostician's findings
2. Create a detailed, step-by-step fix plan
3. Assess the complexity and risk level of the fix
4. Identify any prerequisites needed
5. Ensure the plan is practical and addresses the root cause

Respond with a structured plan that includes ordered steps, actions, rationale, complexity assessment, risk level, and prerequisites.`;

  const prompt = getPersonalityPrompt('architect', basePrompt);

  // Call Gemini with structured output
  const result = await client.generateStructured(
    prompt,
    ArchitectResponseSchema,
    {
      temperature: 0.4, // Moderate temperature for strategic planning
      systemInstruction: 'You are an architect planning code fixes. Be strategic and thorough.',
    }
  );

  if (!result.success || !result.data) {
    throw new Error(`Architect failed: ${result.error}`);
  }

  // Add reasoning trace entry
  const traceEntry = {
    step: 'plan' as const,
    thought: result.data.thought,
    timestamp: Date.now(),
    node: 'architect',
  };

  // Return updated state
  return {
    ...state,
    reasoningTrace: [...state.reasoningTrace, traceEntry],
  };
}
