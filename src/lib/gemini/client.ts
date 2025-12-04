import { google } from '@ai-sdk/google';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';

/**
 * Get Gemini API key from environment
 * Vercel AI SDK expects GOOGLE_GENERATIVE_AI_API_KEY
 * @returns The API key
 * @throws Error if API key is not set
 */
export function getGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY environment variable is required');
  }
  return apiKey;
}

/**
 * Configuration for Gemini API calls
 */
export interface GeminiConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
}

/**
 * Default configuration for Gemini calls
 */
const DEFAULT_CONFIG: Required<GeminiConfig> = {
  model: 'models/gemini-2.5-flash-lite',
  temperature: 0.7,
  maxTokens: 4096,
  systemInstruction: '',
};

/**
 * Result of a structured Gemini API call
 */
export interface GeminiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  rawResponse?: string;
}

/**
 * Gemini API client using Vercel AI SDK
 * Clean, type-safe, and easy to use!
 */
export class GeminiClient {
  private model: any;

  constructor(config: GeminiConfig = {}) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };

    // Set the environment variable that Vercel AI SDK expects
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = getGeminiApiKey();

    this.model = google(finalConfig.model);
  }

  /**
   * Generate structured output using Vercel AI SDK
   * Clean and type-safe!
   */
  async generateStructured<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    config: Partial<GeminiConfig> = {}
  ): Promise<GeminiResult<T>> {
    try {
      const finalConfig = { ...DEFAULT_CONFIG, ...config };

      const result = await generateObject({
        model: this.model,
        schema,
        prompt,
        temperature: finalConfig.temperature,
        maxTokens: finalConfig.maxTokens,
        system: finalConfig.systemInstruction || undefined,
      });

      return {
        success: true,
        data: result.object,
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate text response using Vercel AI SDK
   */
  async generateText(
    prompt: string,
    config: Partial<GeminiConfig> = {}
  ): Promise<GeminiResult<string>> {
    try {
      const finalConfig = { ...DEFAULT_CONFIG, ...config };

      const result = await generateText({
        model: this.model,
        prompt,
        temperature: finalConfig.temperature,
        maxTokens: finalConfig.maxTokens,
        system: finalConfig.systemInstruction || undefined,
      });

      return {
        success: true,
        data: result.text,
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Create new client instance with different config
   */
  withConfig(config: Partial<GeminiConfig>): GeminiClient {
    return new GeminiClient({ ...DEFAULT_CONFIG, ...config });
  }
}

/**
 * Factory function to create Gemini client
 */
export function createGeminiClient(config: GeminiConfig = {}): GeminiClient {
  return new GeminiClient(config);
}
