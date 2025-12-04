import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { z } from 'zod';

/**
 * Get Gemini API key from environment
 * @returns The API key
 * @throws Error if API key is not set
 */
export function getGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return apiKey;
}

/**
 * Configuration for structured Gemini API calls
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
  model: 'gemini-2.5-flash-lite',
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
 * Gemini API client wrapper with structured output support and Zod validation
 */
export class GeminiClient {
  private model: GenerativeModel;

  constructor(config: GeminiConfig = {}) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    const genAI = new GoogleGenerativeAI(getGeminiApiKey());
    this.model = genAI.getGenerativeModel({
      model: finalConfig.model,
      systemInstruction: finalConfig.systemInstruction,
    });
  }

  /**
   * Make a structured API call with JSON response and Zod validation
   * @param prompt - The prompt to send to Gemini
   * @param schema - Zod schema for response validation
   * @param config - Optional configuration override
   * @returns Validated result or error
   */
  async generateStructured<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    config: Partial<GeminiConfig> = {}
  ): Promise<GeminiResult<T>> {
    try {
      const finalConfig = { ...DEFAULT_CONFIG, ...config };

      // Configure for JSON mode
      const generationConfig = {
        temperature: finalConfig.temperature,
        maxOutputTokens: finalConfig.maxTokens,
        responseMimeType: 'application/json',
      };

      // Create model with JSON configuration
      const jsonGenAI = new GoogleGenerativeAI(getGeminiApiKey());
      const jsonModel = jsonGenAI.getGenerativeModel({
        model: finalConfig.model,
        generationConfig,
        systemInstruction: finalConfig.systemInstruction,
      });

      // Make the API call
      const result = await jsonModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      let parsedData: unknown;
      try {
        parsedData = JSON.parse(text);
      } catch (parseError) {
        return {
          success: false,
          error: `Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`,
          rawResponse: text,
        };
      }

      // Validate with Zod schema
      const validationResult = schema.safeParse(parsedData);
      if (!validationResult.success) {
        return {
          success: false,
          error: `Schema validation failed: ${validationResult.error.message}`,
          rawResponse: text,
        };
      }

      return {
        success: true,
        data: validationResult.data,
        rawResponse: text,
      };

    } catch (error) {
      // Handle Gemini API errors
      if (error instanceof Error) {
        return {
          success: false,
          error: `Gemini API error: ${error.message}`,
        };
      }

      return {
        success: false,
        error: 'Unknown error occurred during Gemini API call',
      };
    }
  }

  /**
   * Make a regular text generation call (non-structured)
   * @param prompt - The prompt to send to Gemini
   * @param config - Optional configuration override
   * @returns Text result or error
   */
  async generateText(
    prompt: string,
    config: Partial<GeminiConfig> = {}
  ): Promise<GeminiResult<string>> {
    try {
      const finalConfig = { ...DEFAULT_CONFIG, ...config };

      const generationConfig = {
        temperature: finalConfig.temperature,
        maxOutputTokens: finalConfig.maxTokens,
      };

      // Create model with text configuration
      const textGenAI = new GoogleGenerativeAI(getGeminiApiKey());
      const textModel = textGenAI.getGenerativeModel({
        model: finalConfig.model,
        generationConfig,
        systemInstruction: finalConfig.systemInstruction,
      });

      // Make the API call
      const result = await textModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        data: text,
        rawResponse: text,
      };

    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          error: `Gemini API error: ${error.message}`,
        };
      }

      return {
        success: false,
        error: 'Unknown error occurred during Gemini API call',
      };
    }
  }

  /**
   * Create a new client instance with different configuration
   * @param config - New configuration
   * @returns New GeminiClient instance
   */
  withConfig(config: GeminiConfig): GeminiClient {
    return new GeminiClient(config);
  }
}

// Export a default client factory function to avoid module-level instantiation
export function createGeminiClient(config?: GeminiConfig): GeminiClient {
  return new GeminiClient(config);
}
