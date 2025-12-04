import { describe, it, expect, vi, beforeEach } from 'vitest';
import { architectNode } from '../architect';
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

describe('architectNode', () => {
  let mockClient: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockClient = {
      generateStructured: vi.fn(),
    };

    const mockedCreateGeminiClient = vi.mocked(createGeminiClient);
    const mockedGetPersonalityPrompt = vi.mocked(getPersonalityPrompt);

    mockedCreateGeminiClient.mockReturnValue(mockClient);
    mockedGetPersonalityPrompt.mockReturnValue('Enhanced architect prompt');
  });

  it('should execute architect node and return structured response', async () => {
    const mockResponse = {
      thought: 'Alright, time to fix this mess...',
      confidence: 0.9,
      timestamp: Date.now(),
      plan: [
        {
          step: 'Add null check',
          action: 'Add if statement to check for null before accessing property',
          rationale: 'Prevents null pointer exception',
        },
      ],
      estimatedComplexity: 'low' as const,
      riskLevel: 'low' as const,
      prerequisites: ['Access to source code'],
    };

    mockClient.generateStructured.mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    const initialState = createInitialState(
      'Error: Cannot read property of null',
      'const obj = null; console.log(obj.property);'
    );

    const result = await architectNode(initialState);

    expect(result.reasoningTrace).toHaveLength(1);
    expect(result.reasoningTrace[0]).toMatchObject({
      step: 'plan',
      thought: mockResponse.thought,
      node: 'architect',
    });
    expect(result.reasoningTrace[0].timestamp).toBeGreaterThan(0);

    expect(mockClient.generateStructured).toHaveBeenCalledWith(
      'Enhanced architect prompt',
      expect.any(Object), // ArchitectResponseSchema
      expect.objectContaining({
        temperature: 0.4,
        systemInstruction: expect.stringContaining('architect'),
      })
    );
  });

  it('should throw error when Gemini client fails', async () => {
    mockClient.generateStructured.mockResolvedValue({
      success: false,
      error: 'Network error',
    });

    const initialState = createInitialState('Error logs', 'source code');

    await expect(architectNode(initialState)).rejects.toThrow('Architect failed: Network error');
  });
});
