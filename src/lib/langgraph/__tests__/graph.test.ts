import { describe, it, expect, vi, beforeEach } from 'vitest';
import { compiledGraph } from '../graph';
import { createInitialState } from '../state';

// Mock the Gemini client to avoid actual API calls during testing
vi.mock('../../gemini/client', () => ({
  createGeminiClient: () => ({
    generateStructured: vi.fn().mockResolvedValue({
      success: true,
      data: {
        thought: 'Mocked response for testing',
        rootCause: 'Mock root cause',
        category: 'syntax',
        severity: 'high',
        suggestedFix: 'Mock fix suggestion',
      },
    }),
    generateText: vi.fn().mockResolvedValue({
      success: true,
      data: 'Mocked text response',
    }),
  }),
}));

// Mock the personality prompts
vi.mock('../../gemini/prompts', () => ({
  getPersonalityPrompt: (nodeName: string, basePrompt: string) => `${nodeName}: ${basePrompt}`,
}));

describe('LangGraph Integration', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it('creates a compiled graph successfully', () => {
    expect(compiledGraph).toBeDefined();
    expect(typeof compiledGraph).toBe('object');
  });

  it('executes end-to-end with mock data', async () => {
    const initialState = createInitialState(
      'TypeError: Cannot read property "foo" of null',
      'const x = null;\nconsole.log(x.foo);'
    );

    // Execute the graph
    const result = await compiledGraph.invoke(initialState);

    // Verify the result is a valid state object
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(result.errorLogs).toBe(initialState.errorLogs);
    expect(result.sourceCode).toBe(initialState.sourceCode);
    expect(result.originalCode).toBe(initialState.originalCode);
  });

  it('adds reasoning trace entries for each node', async () => {
    const initialState = createInitialState('error', 'code');

    const result = await compiledGraph.invoke(initialState);

    // Should have 4 trace entries (one for each node)
    expect(result.reasoningTrace).toHaveLength(4);

    // Verify the steps are in the correct order
    expect(result.reasoningTrace[0].step).toBe('diagnose');
    expect(result.reasoningTrace[0].node).toBe('diagnostician');

    expect(result.reasoningTrace[1].step).toBe('plan');
    expect(result.reasoningTrace[1].node).toBe('architect');

    expect(result.reasoningTrace[2].step).toBe('fix');
    expect(result.reasoningTrace[2].node).toBe('surgeon');

    expect(result.reasoningTrace[3].step).toBe('verify');
    expect(result.reasoningTrace[3].node).toBe('verifier');
  });

  it('preserves original state properties', async () => {
    const errorLogs = 'Custom error message';
    const sourceCode = 'custom source code';
    const initialState = createInitialState(errorLogs, sourceCode);

    const result = await compiledGraph.invoke(initialState);

    // Core properties should be preserved
    expect(result.errorLogs).toBe(errorLogs);
    expect(result.sourceCode).toBe(sourceCode);
    expect(result.originalCode).toBe(sourceCode);
    expect(result.attempts).toBe(0);
  });

  it('handles the complete agent workflow sequence', async () => {
    const initialState = createInitialState(
      'SyntaxError: Unexpected token',
      'function broken() {\n  return\n}'
    );

    const result = await compiledGraph.invoke(initialState);

    // Verify we have all expected trace entries
    const steps = result.reasoningTrace.map(entry => entry.step);
    expect(steps).toEqual(['diagnose', 'plan', 'fix', 'verify']);

    // Verify all nodes are represented
    const nodes = result.reasoningTrace.map(entry => entry.node);
    expect(nodes).toEqual(['diagnostician', 'architect', 'surgeon', 'verifier']);
  });
});
