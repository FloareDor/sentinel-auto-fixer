import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Set environment variable for testing
process.env.GEMINI_API_KEY = 'test-api-key-for-vitest';

import { GeminiClient } from '../client';
import { DiagnosticianResponseSchema } from '../schemas';

// Mock the Google Generative AI
vi.mock('@google/generative-ai');

// Get the mocked constructor
const MockGoogleGenerativeAI = vi.mocked(GoogleGenerativeAI);

describe('GeminiClient', () => {
  let client: GeminiClient;
  let mockModel: any;
  let mockResponse: any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup mock response
    mockResponse = {
      response: {
        text: vi.fn(),
      },
    };

    // Setup mock model
    mockModel = {
      generateContent: vi.fn().mockResolvedValue(mockResponse),
    };

    // Setup mock GoogleGenerativeAI constructor
    MockGoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockReturnValue(mockModel),
    } as any));

    // Create client instance
    client = new GeminiClient();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateStructured', () => {
    it('should successfully generate and validate structured response', async () => {
      // Mock valid JSON response
      const mockDiagnosticianResponse = {
        thought: 'I found a syntax error in the function call',
        confidence: 0.95,
        timestamp: Date.now(),
        rootCause: 'Missing closing parenthesis in function call',
        errorCategory: 'syntax_error',
        severity: 'high',
        suggestedFix: 'Add closing parenthesis to complete the function call',
      };

      mockResponse.response.text.mockResolvedValue(JSON.stringify(mockDiagnosticianResponse));

      const result = await client.generateStructured(
        'Analyze this error log...',
        DiagnosticianResponseSchema
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockDiagnosticianResponse);
      expect(result.error).toBeUndefined();
    });

    it('should handle invalid JSON response gracefully', async () => {
      // Mock invalid JSON response
      mockResponse.response.text.mockResolvedValue('Invalid JSON response {');

      const result = await client.generateStructured(
        'Analyze this error log...',
        DiagnosticianResponseSchema
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to parse JSON response');
      expect(result.data).toBeUndefined();
    });

    it('should handle schema validation failure', async () => {
      // Mock JSON response that doesn't match schema
      const invalidResponse = {
        thought: 'Analysis complete',
        confidence: 1.5, // Invalid: should be 0-1
        timestamp: 'not-a-number', // Invalid: should be number
        rootCause: 'Missing parenthesis',
        errorCategory: 'invalid_category', // Invalid: not in enum
        severity: 'urgent', // Invalid: not in enum
        suggestedFix: 'Add parenthesis',
      };

      mockResponse.response.text.mockResolvedValue(JSON.stringify(invalidResponse));

      const result = await client.generateStructured(
        'Analyze this error log...',
        DiagnosticianResponseSchema
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Schema validation failed');
      expect(result.data).toBeUndefined();
    });

    it('should handle API errors gracefully', async () => {
      // Mock API error
      mockModel.generateContent.mockRejectedValue(new Error('API rate limit exceeded'));

      const result = await client.generateStructured(
        'Analyze this error log...',
        DiagnosticianResponseSchema
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Gemini API error: API rate limit exceeded');
      expect(result.data).toBeUndefined();
    });

    it('should handle unknown errors gracefully', async () => {
      // Mock unknown error
      mockModel.generateContent.mockRejectedValue('String error');

      const result = await client.generateStructured(
        'Analyze this error log...',
        DiagnosticianResponseSchema
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown error occurred during Gemini API call');
      expect(result.data).toBeUndefined();
    });

    it('should use custom configuration when provided', async () => {
      const mockDiagnosticianResponse = {
        thought: 'Custom config test',
        confidence: 0.8,
        timestamp: Date.now(),
        rootCause: 'Test error',
        errorCategory: 'syntax_error',
        severity: 'low',
        suggestedFix: 'Test fix',
      };

      mockResponse.response.text.mockResolvedValue(JSON.stringify(mockDiagnosticianResponse));

      await client.generateStructured(
        'Test prompt',
        DiagnosticianResponseSchema,
        {
          model: 'gemini-2.5-flash-lite',
          temperature: 0.5,
          maxTokens: 2048,
        }
      );

      // Verify that GoogleGenerativeAI was called with custom config
      expect(MockGoogleGenerativeAI).toHaveBeenCalled();
      const mockInstance = MockGoogleGenerativeAI.mock.results[0].value;
      expect(mockInstance.getGenerativeModel).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gemini-2.5-flash-lite',
          generationConfig: expect.objectContaining({
            temperature: 0.5,
            maxOutputTokens: 2048,
            responseMimeType: 'application/json',
          }),
        })
      );
    });
  });

  describe('generateText', () => {
    it('should successfully generate text response', async () => {
      const mockTextResponse = 'This is a text response from Gemini.';
      mockResponse.response.text.mockResolvedValue(mockTextResponse);

      const result = await client.generateText('Generate some text');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTextResponse);
      expect(result.error).toBeUndefined();
    });

    it('should handle API errors in text generation', async () => {
      mockModel.generateContent.mockRejectedValue(new Error('Network timeout'));

      const result = await client.generateText('Generate some text');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Gemini API error: Network timeout');
      expect(result.data).toBeUndefined();
    });
  });

  describe('withConfig', () => {
    it('should create new client instance with different config', () => {
      const newClient = client.withConfig({
        model: 'gemini-2.5-flash-lite',
        temperature: 0.3,
      });

      expect(newClient).toBeInstanceOf(GeminiClient);
      expect(newClient).not.toBe(client); // Should be different instance
    });
  });

});
