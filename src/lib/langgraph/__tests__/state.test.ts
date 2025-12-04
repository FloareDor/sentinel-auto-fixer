import { describe, it, expect } from 'vitest';
import { AgentStateSchema, createInitialState, type AgentState } from '../state';

describe('AgentStateSchema', () => {
  it('validates a valid state object', () => {
    const validState = {
      errorLogs: 'Error: Cannot read property of undefined',
      sourceCode: 'const x = null;\nx.foo();',
      attempts: 0,
      reasoningTrace: [
        {
          step: 'diagnose' as const,
          thought: 'Hmm, this error looks suspicious...',
          timestamp: Date.now(),
          node: 'diagnostician',
        },
      ],
      generatedPatch: null,
      originalCode: 'const x = null;\nx.foo();',
      fixedCode: null,
    };

    const result = AgentStateSchema.safeParse(validState);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.errorLogs).toBe(validState.errorLogs);
      expect(result.data.sourceCode).toBe(validState.sourceCode);
    }
  });

  it('rejects invalid state with missing required fields', () => {
    const invalidState = {
      errorLogs: 'Some error',
      // missing sourceCode
    };

    const result = AgentStateSchema.safeParse(invalidState);
    expect(result.success).toBe(false);
  });

  it('rejects invalid reasoning trace entry', () => {
    const invalidState = {
      errorLogs: 'Error',
      sourceCode: 'code',
      attempts: 0,
      reasoningTrace: [
        {
          step: 'invalid_step', // invalid enum value
          thought: 'test',
          timestamp: Date.now(),
          node: 'test',
        },
      ],
      generatedPatch: null,
      originalCode: 'code',
      fixedCode: null,
    };

    const result = AgentStateSchema.safeParse(invalidState);
    expect(result.success).toBe(false);
  });

  it('applies default value for attempts when not provided', () => {
    const stateWithoutAttempts = {
      errorLogs: 'Error',
      sourceCode: 'code',
      reasoningTrace: [],
      generatedPatch: null,
      originalCode: 'code',
      fixedCode: null,
    };

    const result = AgentStateSchema.parse(stateWithoutAttempts);
    expect(result.attempts).toBe(0);
  });

  it('validates all step enum values', () => {
    const steps: Array<'diagnose' | 'plan' | 'fix' | 'verify'> = [
      'diagnose',
      'plan',
      'fix',
      'verify',
    ];

    steps.forEach((step) => {
      const state = {
        errorLogs: 'Error',
        sourceCode: 'code',
        attempts: 0,
        reasoningTrace: [
          {
            step,
            thought: 'test',
            timestamp: Date.now(),
            node: 'test',
          },
        ],
        generatedPatch: null,
        originalCode: 'code',
        fixedCode: null,
      };

      const result = AgentStateSchema.safeParse(state);
      expect(result.success).toBe(true);
    });
  });
});

describe('createInitialState', () => {
  it('creates a valid initial state', () => {
    const errorLogs = 'Error: Cannot read property of undefined';
    const sourceCode = 'const x = null;\nx.foo();';

    const state = createInitialState(errorLogs, sourceCode);

    expect(state.errorLogs).toBe(errorLogs);
    expect(state.sourceCode).toBe(sourceCode);
    expect(state.attempts).toBe(0);
    expect(state.reasoningTrace).toEqual([]);
    expect(state.generatedPatch).toBeNull();
    expect(state.originalCode).toBe(sourceCode);
    expect(state.fixedCode).toBeNull();
  });

  it('creates state that validates against schema', () => {
    const errorLogs = 'Some error message';
    const sourceCode = 'function test() { return 42; }';

    const state = createInitialState(errorLogs, sourceCode);
    const result = AgentStateSchema.safeParse(state);

    expect(result.success).toBe(true);
  });

  it('preserves original code in originalCode field', () => {
    const sourceCode = 'const x = 1;';
    const state = createInitialState('error', sourceCode);

    expect(state.originalCode).toBe(sourceCode);
    expect(state.sourceCode).toBe(sourceCode);
  });
});

