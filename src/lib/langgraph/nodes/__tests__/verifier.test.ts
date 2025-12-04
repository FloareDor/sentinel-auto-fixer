import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifierNode } from '../verifier';
import { createInitialState } from '../../state';
import { createGeminiClient } from '../../../gemini/client';
import { getPersonalityPrompt } from '../../../gemini/prompts';

// Mock the Gemini client
vi.mock('../../../gemini/client', () => ({
  createGeminiClient: vi.fn(),
}));

// Mock the prompts
vi.mock('../../../gemini/prompts', () => ({
  getPersonalityPrompt: vi.fn(),
}));

describe('verifierNode', () => {
  let mockClient: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockClient = {
      generateStructured: vi.fn(),
    };

    const mockedCreateGeminiClient = vi.mocked(createGeminiClient);
    const mockedGetPersonalityPrompt = vi.mocked(getPersonalityPrompt);

    mockedCreateGeminiClient.mockReturnValue(mockClient);
    mockedGetPersonalityPrompt.mockReturnValue('Enhanced verifier prompt');
  });

  it('should execute verifier node and approve patch', async () => {
    const mockResponse = {
      thought: 'Double-checking... looks good to me!',
      confidence: 0.9,
      timestamp: Date.now(),
      isValid: true,
      issues: [],
      recommendations: ['Consider adding more test cases'],
      canProceed: true,
    };

    mockClient.generateStructured.mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    const initialState = createInitialState(
      'Error: Cannot read property of null',
      'const obj = null; console.log(obj.property);'
    );
    initialState.generatedPatch = 'const obj = null;\nif (obj) {\n  console.log(obj.property);\n}';

    const result = await verifierNode(initialState);

    expect(result.reasoningTrace).toHaveLength(1);
    expect(result.reasoningTrace[0]).toMatchObject({
      step: 'verify',
      thought: mockResponse.thought,
      node: 'verifier',
    });
    expect(result.fixedCode).toBe(initialState.generatedPatch);
    expect(result.reasoningTrace[0].timestamp).toBeGreaterThan(0);

    expect(mockClient.generateStructured).toHaveBeenCalledWith(
      'Enhanced verifier prompt',
      expect.any(Object), // VerifierResponseSchema
      expect.objectContaining({
        temperature: 0.1,
        systemInstruction: expect.stringContaining('verifier'),
      })
    );
  });

  it('should reject invalid patch', async () => {
    const mockResponse = {
      thought: 'This patch has issues...',
      confidence: 0.3,
      timestamp: Date.now(),
      isValid: false,
      issues: [
        {
          type: 'logic' as const,
          description: 'Patch does not handle all edge cases',
          severity: 'error' as const,
        },
      ],
      recommendations: ['Add comprehensive error handling'],
      canProceed: false,
    };

    mockClient.generateStructured.mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    const initialState = createInitialState('Error logs', 'source code');
    initialState.generatedPatch = 'invalid patch';

    const result = await verifierNode(initialState);

    expect(result.reasoningTrace).toHaveLength(1);
    expect(result.fixedCode).toBeNull(); // Should not set fixedCode for invalid patches
  });

  it('should throw error when Gemini client fails', async () => {
    mockClient.generateStructured.mockResolvedValue({
      success: false,
      error: 'Validation timeout',
    });

    const initialState = createInitialState('Error logs', 'source code');

    await expect(verifierNode(initialState)).rejects.toThrow('Verifier failed: Validation timeout');
  });
});
