import { AgentState } from '../state';
import { createGeminiClient } from '../../gemini/client';
import { SurgeonResponseSchema } from '../../gemini/schemas';
import { getPersonalityPrompt } from '../../gemini/prompts';

/**
 * Surgeon node - generates precise code patches with surgical precision
 * @param state - Current agent state
 * @returns Updated state with generated patch and reasoning trace
 */
export async function surgeonNode(state: AgentState): Promise<AgentState> {
  const client = createGeminiClient();

  // Get previous traces for context
  const diagnosticianTrace = state.reasoningTrace.find(trace => trace.node === 'diagnostician');
  const architectTrace = state.reasoningTrace.find(trace => trace.node === 'architect');

  // Create the surgeon prompt
  const basePrompt = `
You are now performing the actual code fix with surgical precision. Based on the diagnostic analysis and architectural plan, you need to generate the exact code patch.

Error Logs:
${state.errorLogs}

Original Source Code:
${state.sourceCode}

${diagnosticianTrace ? `Diagnostician's Analysis: ${diagnosticianTrace.thought}` : ''}
${architectTrace ? `Architect's Plan: ${architectTrace.thought}` : ''}

Your task is to:
1. Review the diagnostician's root cause analysis
2. Follow the architect's fix plan precisely
3. Generate the exact code patch that fixes the issue
4. Identify which files would be modified
5. Provide backup strategy and validation steps
6. Ensure the patch is minimal and targeted

Respond with a structured patch that includes the code changes, modified files, backup strategy, and validation steps. Be extremely careful and precise with your changes.`;

  const prompt = getPersonalityPrompt('surgeon', basePrompt);

  // Call Gemini with structured output
  const result = await client.generateStructured(
    prompt,
    SurgeonResponseSchema,
    {
      temperature: 0.2, // Low temperature for precise code generation
      systemInstruction: 'You are a surgeon performing precise code operations. Be extremely careful and methodical.',
    }
  );

  if (!result.success || !result.data) {
    throw new Error(`Surgeon failed: ${result.error}`);
  }

  // Generate the patch string from the structured response
  const patchContent = result.data.codePatch;

  // Add reasoning trace entry
  const traceEntry = {
    step: 'fix' as const,
    thought: result.data.thought,
    timestamp: Date.now(),
    node: 'surgeon',
  };

  // Return updated state with the generated patch
  return {
    ...state,
    reasoningTrace: [...state.reasoningTrace, traceEntry],
    generatedPatch: patchContent,
  };
}
