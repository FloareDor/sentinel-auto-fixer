import { AgentState } from '../state';
import { createGeminiClient } from '../../gemini/client';
import { VerifierResponseSchema } from '../../gemini/schemas';
import { getPersonalityPrompt } from '../../gemini/prompts';

/**
 * Verifier node - validates patches and ensures fixes are safe and correct
 * @param state - Current agent state
 * @returns Updated state with validation results and final fixed code
 */
export async function verifierNode(state: AgentState): Promise<AgentState> {
  const client = createGeminiClient();

  // Get previous traces for context
  const diagnosticianTrace = state.reasoningTrace.find(trace => trace.node === 'diagnostician');
  const architectTrace = state.reasoningTrace.find(trace => trace.node === 'architect');
  const surgeonTrace = state.reasoningTrace.find(trace => trace.node === 'surgeon');

  // Create the verifier prompt
  const basePrompt = `
You are now performing final quality assurance on the generated code patch. You need to validate that the fix is safe, correct, and complete.

Original Source Code:
${state.sourceCode}

Generated Patch:
${state.generatedPatch || 'No patch generated'}

${diagnosticianTrace ? `Diagnostician's Analysis: ${diagnosticianTrace.thought}` : ''}
${architectTrace ? `Architect's Plan: ${architectTrace.thought}` : ''}
${surgeonTrace ? `Surgeon's Patch: ${surgeonTrace.thought}` : ''}

Your task is to:
1. Validate the patch format and syntax
2. Check for potential issues (logic errors, security concerns, performance issues, compatibility problems)
3. Ensure the patch addresses the original problem
4. Verify that the fix is safe to apply
5. Assess whether it can proceed

Respond with a structured validation that includes issue assessment, recommendations, and final approval. Be extremely thorough and cautious.`;

  const prompt = getPersonalityPrompt('verifier', basePrompt);

  // Call Gemini with structured output
  const result = await client.generateStructured(
    prompt,
    VerifierResponseSchema,
    {
      temperature: 0.1, // Very low temperature for validation decisions
      systemInstruction: 'You are a verifier performing quality assurance. Be extremely thorough and cautious.',
    }
  );

  if (!result.success || !result.data) {
    throw new Error(`Verifier failed: ${result.error}`);
  }

  // Determine the fixed code based on verification
  let fixedCode = null;
  if (result.data.canProceed && state.generatedPatch) {
    // If verification passes, apply the patch to get fixed code
    // For now, we'll use the generated patch as the fixed code
    // In a real implementation, this would apply the patch to the original code
    fixedCode = state.generatedPatch;
  }

  // Add reasoning trace entry
  const traceEntry = {
    step: 'verify' as const,
    thought: result.data.thought,
    timestamp: Date.now(),
    node: 'verifier',
  };

  // Return updated state with verification results
  return {
    ...state,
    reasoningTrace: [...state.reasoningTrace, traceEntry],
    fixedCode,
  };
}
