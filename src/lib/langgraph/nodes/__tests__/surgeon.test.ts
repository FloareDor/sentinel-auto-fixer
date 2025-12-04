import { describe, it, expect, vi, beforeEach } from 'vitest';
import { surgeonNode } from '../surgeon';
import { createInitialState } from '../../state';
import { createGeminiClient } from '../../../gemini/client';

// Mock the Gemini client
vi.mock('../../../gemini/client', () => ({
  createGeminiClient: vi.fn(),
}));

// Mock the prompts
vi.mock('../../../gemini/prompts', () => ({
  getPersonalityPrompt: vi.fn(),
}));

describe('surgeonNode', () => {
  let mockClient: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockClient = {
      generateStructured: vi.fn(),
    };

    const { createGeminiClient } = require('../../../gemini/client');
    createGeminiClient.mockReturnValue(mockClient);

    const { getPersonalityPrompt } = require('../../../gemini/prompts');
    getPersonalityPrompt.mockReturnValue('Enhanced surgeon prompt');
  });

  it('should execute surgeon node and return structured response', async () => {
    const mockResponse = {
      thought: 'Let me carefully patch this up...',
      confidence: 0.95,
      timestamp: Date.now(),
      codePatch: 'const obj = null;\nif (obj) {\n  console.log(obj.property);\n}',
      language: 'javascript',
      modifiedFiles: [
        {
          fileName: 'main.js',
          originalContent: 'const obj = null; console.log(obj.property);',
          modifiedContent: 'const obj = null;\nif (obj) {\n  console.log(obj.property);\n}',
        },
      ],
      backupStrategy: 'Create backup of original file before applying patch',
      validationSteps: ['Run tests', 'Check for syntax errors'],
    };

    mockClient.generateStructured.mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    const initialState = createInitialState(
      'Error: Cannot read property of null',
      'const obj = null; console.log(obj.property);'
    );

    const result = await surgeonNode(initialState);

    expect(result.reasoningTrace).toHaveLength(1);
    expect(result.reasoningTrace[0]).toMatchObject({
      step: 'fix',
      thought: mockResponse.thought,
      node: 'surgeon',
    });
    expect(result.generatedPatch).toBe(mockResponse.codePatch);
    expect(result.reasoningTrace[0].timestamp).toBeGreaterThan(0);

    expect(mockClient.generateStructured).toHaveBeenCalledWith(
      'Enhanced surgeon prompt',
      expect.any(Object), // SurgeonResponseSchema
      expect.objectContaining({
        temperature: 0.2,
        systemInstruction: expect.stringContaining('surgeon'),
      })
    );
  });

  it('should throw error when Gemini client fails', async () => {
    mockClient.generateStructured.mockResolvedValue({
      success: false,
      error: 'Invalid response format',
    });

    const initialState = createInitialState('Error logs', 'source code');

    await expect(surgeonNode(initialState)).rejects.toThrow('Surgeon failed: Invalid response format');
  });
});
