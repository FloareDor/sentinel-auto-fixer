import { describe, it, expect, vi, beforeEach } from 'vitest';
import { diagnosticianNode } from '../diagnostician';
import { createInitialState } from '../../state';

// Mock the Gemini client
vi.mock('../../../gemini/client', () => ({
  createGeminiClient: vi.fn(),
}));

// Mock the prompts
vi.mock('../../../gemini/prompts', () => ({
  getPersonalityPrompt: vi.fn(),
}));

describe('diagnosticianNode', () => {
  let mockClient: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockClient = {
      generateStructured: vi.fn(),
    };

    // Import the mocked modules
    const { createGeminiClient } = vi.mocked(require('../../../gemini/client'));
    const { getPersonalityPrompt } = vi.mocked(require('../../../gemini/prompts'));

    createGeminiClient.mockReturnValue(mockClient);
    getPersonalityPrompt.mockReturnValue('Enhanced diagnostician prompt');
  });

  it('should execute diagnostician node and return structured response', async () => {
    const mockResponse = {
      thought: 'Hmm, this error looks suspicious...',
      confidence: 0.8,
      timestamp: Date.now(),
      rootCause: 'Null pointer exception in line 15',
      errorCategory: 'runtime_error' as const,
      severity: 'high' as const,
      suggestedFix: 'Add null check before accessing object property',
    };

    mockClient.generateStructured.mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    const initialState = createInitialState(
      'Error: Cannot read property of null',
      'const obj = null; console.log(obj.property);'
    );

    const result = await diagnosticianNode(initialState);

    expect(result.reasoningTrace).toHaveLength(1);
    expect(result.reasoningTrace[0]).toMatchObject({
      step: 'diagnose',
      thought: mockResponse.thought,
      node: 'diagnostician',
    });
    expect(result.reasoningTrace[0].timestamp).toBeGreaterThan(0);

    expect(mockClient.generateStructured).toHaveBeenCalledWith(
      'Enhanced diagnostician prompt',
      expect.any(Object), // DiagnosticianResponseSchema
      expect.objectContaining({
        temperature: 0.3,
        systemInstruction: expect.stringContaining('diagnostician'),
      })
    );
  });

  it('should throw error when Gemini client fails', async () => {
    mockClient.generateStructured.mockResolvedValue({
      success: false,
      error: 'API rate limit exceeded',
    });

    const initialState = createInitialState('Error logs', 'source code');

    await expect(diagnosticianNode(initialState)).rejects.toThrow('Diagnostician failed: API rate limit exceeded');
  });
});
