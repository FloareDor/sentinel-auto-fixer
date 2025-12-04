import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GeminiClient, createGeminiClient, getGeminiApiKey } from '../../../lib/gemini/client';
import { z } from 'zod';

// Mock the Vercel AI SDK
vi.mock('ai', () => ({
  generateObject: vi.fn(),
  generateText: vi.fn(),
}));

// Mock the Google AI SDK
vi.mock('@ai-sdk/google', () => ({
  google: vi.fn(() => 'mocked-google-model'),
}));

import { generateObject, generateText } from 'ai';
import { google } from '@ai-sdk/google';

describe('GeminiClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getGeminiApiKey', () => {
    it('should return GEMINI_API_KEY when set', () => {
      process.env.GEMINI_API_KEY = 'test-gemini-key';
      expect(getGeminiApiKey()).toBe('test-gemini-key');
    });

    it('should return GOOGLE_GENERATIVE_AI_API_KEY when GEMINI_API_KEY is not set', () => {
      delete process.env.GEMINI_API_KEY;
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-google-key';
      expect(getGeminiApiKey()).toBe('test-google-key');
    });

    it('should prioritize GEMINI_API_KEY over GOOGLE_GENERATIVE_AI_API_KEY', () => {
      process.env.GEMINI_API_KEY = 'gemini-key';
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'google-key';
      expect(getGeminiApiKey()).toBe('gemini-key');
    });

    it('should throw error when no API key is set', () => {
      delete process.env.GEMINI_API_KEY;
      delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      expect(() => getGeminiApiKey()).toThrow('GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY environment variable is required');
    });
  });

  describe('GeminiClient constructor', () => {
    it('should initialize with default config when no config provided', () => {
      process.env.GEMINI_API_KEY = 'test-key';

      const client = new GeminiClient();

      expect(google).toHaveBeenCalledWith('models/gemini-2.5-flash-lite');
      expect(process.env.GOOGLE_GENERATIVE_AI_API_KEY).toBe('test-key');
    });

    it('should merge provided config with defaults', () => {
      process.env.GEMINI_API_KEY = 'test-key';

      const config = {
        model: 'custom-model',
        temperature: 0.5,
      };

      const client = new GeminiClient(config);

      expect(google).toHaveBeenCalledWith('custom-model');
    });

    it('should throw error when API key is not available', () => {
      delete process.env.GEMINI_API_KEY;
      delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;

      expect(() => new GeminiClient()).toThrow('GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY environment variable is required');
    });
  });

  describe('generateStructured', () => {
    let client: GeminiClient;

    beforeEach(() => {
      process.env.GEMINI_API_KEY = 'test-key';
      client = new GeminiClient();
    });

    it('should successfully generate structured output', async () => {
      const mockSchema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const mockResponse = {
        object: {
          name: 'John Doe',
          age: 30,
        },
      };

      const mockedGenerateObject = vi.mocked(generateObject);
      mockedGenerateObject.mockResolvedValue(mockResponse);

      const result = await client.generateStructured('Test prompt', mockSchema);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        name: 'John Doe',
        age: 30,
      });
      expect(result.error).toBeUndefined();

      expect(mockedGenerateObject).toHaveBeenCalledWith({
        model: 'mocked-google-model',
        schema: mockSchema,
        prompt: 'Test prompt',
        temperature: 0.7, // default temperature
      });
    });

    it('should include system instruction when provided', async () => {
      const mockSchema = z.object({
        response: z.string(),
      });

      const mockResponse = {
        object: {
          response: 'Hello',
        },
      };

      const mockedGenerateObject = vi.mocked(generateObject);
      mockedGenerateObject.mockResolvedValue(mockResponse);

      const config = { systemInstruction: 'You are a helpful assistant' };
      const result = await client.generateStructured('Test prompt', mockSchema, config);

      expect(mockedGenerateObject).toHaveBeenCalledWith({
        model: 'mocked-google-model',
        schema: mockSchema,
        prompt: 'You are a helpful assistant\n\nTest prompt',
        temperature: 0.7,
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockSchema = z.object({
        response: z.string(),
      });

      const mockedGenerateObject = vi.mocked(generateObject);
      mockedGenerateObject.mockRejectedValue(new Error('API rate limit exceeded'));

      const result = await client.generateStructured('Test prompt', mockSchema);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBe('API rate limit exceeded');
    });

    it('should handle non-Error exceptions', async () => {
      const mockSchema = z.object({
        response: z.string(),
      });

      const mockedGenerateObject = vi.mocked(generateObject);
      mockedGenerateObject.mockRejectedValue('String error');

      const result = await client.generateStructured('Test prompt', mockSchema);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error');
    });
  });

  describe('generateText', () => {
    let client: GeminiClient;

    beforeEach(() => {
      process.env.GEMINI_API_KEY = 'test-key';
      client = new GeminiClient();
    });

    it('should successfully generate text response', async () => {
      const mockResponse = {
        text: 'Hello, this is a response from Gemini!',
      };

      const mockedGenerateText = vi.mocked(generateText);
      mockedGenerateText.mockResolvedValue(mockResponse);

      const result = await client.generateText('Test prompt');

      expect(result.success).toBe(true);
      expect(result.data).toBe('Hello, this is a response from Gemini!');
      expect(result.error).toBeUndefined();

      expect(mockedGenerateText).toHaveBeenCalledWith({
        model: 'mocked-google-model',
        prompt: 'Test prompt',
        temperature: 0.7,
      });
    });

    it('should include system instruction in prompt', async () => {
      const mockResponse = {
        text: 'Response',
      };

      const mockedGenerateText = vi.mocked(generateText);
      mockedGenerateText.mockResolvedValue(mockResponse);

      const config = { systemInstruction: 'Be concise' };
      const result = await client.generateText('Test prompt', config);

      expect(mockedGenerateText).toHaveBeenCalledWith({
        model: 'mocked-google-model',
        prompt: 'Be concise\n\nTest prompt',
        temperature: 0.7,
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockedGenerateText = vi.mocked(generateText);
      mockedGenerateText.mockRejectedValue(new Error('Network timeout'));

      const result = await client.generateText('Test prompt');

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBe('Network timeout');
    });
  });

  describe('withConfig', () => {
    it('should create new client instance with merged config', () => {
      process.env.GEMINI_API_KEY = 'test-key';

      const client = new GeminiClient({ temperature: 0.5 });
      const newClient = client.withConfig({ model: 'custom-model' });

      expect(newClient).toBeInstanceOf(GeminiClient);
      expect(newClient).not.toBe(client); // Should be a new instance
    });
  });

  describe('createGeminiClient', () => {
    it('should return a new GeminiClient instance', () => {
      process.env.GEMINI_API_KEY = 'test-key';

      const client = createGeminiClient();

      expect(client).toBeInstanceOf(GeminiClient);
    });
  });
});
