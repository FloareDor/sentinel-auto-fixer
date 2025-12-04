import { describe, it, expect, beforeAll } from 'vitest';
import { GeminiClient, createGeminiClient } from '../client';
import {
  DiagnosticianResponseSchema,
  ArchitectResponseSchema,
  SurgeonResponseSchema,
  VerifierResponseSchema,
} from '../schemas';

/**
 * Integration tests for GeminiClient
 * These tests make actual API calls to Gemini via Vercel AI SDK
 *
 * To run these tests:
 * 1. Create a .env file in the project root
 * 2. Add GEMINI_API_KEY=your_actual_api_key
 * 3. Run: npm test -- client-vercel.test.ts
 *
 * These tests will be skipped if GEMINI_API_KEY is not set
 */

const API_KEY = process.env.GEMINI_API_KEY;

describe('GeminiClient Integration Tests', () => {
  beforeAll(() => {
    if (!API_KEY || API_KEY === 'test-api-key-for-vitest' || API_KEY === 'your_key_here') {
      console.warn(
        '⚠️  GEMINI_API_KEY not set or using placeholder. Skipping integration tests.'
      );
    }
  });

  const shouldSkip = !API_KEY || API_KEY === 'test-api-key-for-vitest' || API_KEY === 'your_key_here';

  describe('generateStructured - Diagnostician', () => {
    it(
      'should successfully analyze error logs and return structured response',
      { timeout: 30000 },
      async () => {
        if (shouldSkip) {
          return;
        }

        const client = createGeminiClient();
        const errorLogs = `
Error: Cannot read property 'foo' of undefined
    at Object.<anonymous> (/path/to/file.js:10:5)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
        `;

        const prompt = `Analyze the following error log and identify the root cause:
${errorLogs}

Provide a structured analysis of the error.`;

        const result = await client.generateStructured(
          prompt,
          DiagnosticianResponseSchema
        );

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        if (result.data) {
          expect(result.data.rootCause).toBeDefined();
          expect(result.data.errorCategory).toBeDefined();
          expect(result.data.severity).toBeDefined();
          expect(result.data.thought).toBeDefined();
          expect(result.data.confidence).toBeGreaterThanOrEqual(0);
          expect(result.data.confidence).toBeLessThanOrEqual(1);
        }
      }
    );
  });

  describe('generateStructured - Surgeon', () => {
    it(
      'should successfully generate a code patch',
      { timeout: 30000 },
      async () => {
        if (shouldSkip) {
          return;
        }

        const client = createGeminiClient();
        const sourceCode = `function processData(data) {
  return data.foo.bar;
}`;

        const prompt = `Generate a code patch to fix the following code by adding null checks:
\`\`\`javascript
${sourceCode}
\`\`\`

Provide the patched code.`;

        const result = await client.generateStructured(
          prompt,
          SurgeonResponseSchema
        );

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        if (result.data) {
          expect(result.data.codePatch).toBeDefined();
          expect(result.data.language).toBeDefined();
          expect(Array.isArray(result.data.modifiedFiles)).toBe(true);
          expect(result.data.modifiedFiles.length).toBeGreaterThan(0);

          // Check the structure of modifiedFiles (objects with file details)
          result.data.modifiedFiles.forEach(file => {
            expect(file.fileName).toBeDefined();
            expect(typeof file.fileName).toBe('string');
            expect(file.originalContent).toBeDefined();
            expect(typeof file.originalContent).toBe('string');
            expect(file.modifiedContent).toBeDefined();
            expect(typeof file.modifiedContent).toBe('string');
          });
        }
      }
    );
  });

  describe('generateText', () => {
    it(
      'should successfully generate text response',
      { timeout: 30000 },
      async () => {
        if (shouldSkip) {
          return;
        }

        const client = createGeminiClient();
        const prompt = 'Say hello in one sentence.';

        const result = await client.generateText(prompt);

        if (!result.success) {
          console.error('Vercel AI SDK error:', result.error);
        }

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(typeof result.data).toBe('string');
        expect(result.data!.length).toBeGreaterThan(0);
      }
    );
  });

  describe('Configuration', () => {
    it(
      'should use custom model configuration',
      { timeout: 30000 },
      async () => {
        if (shouldSkip) {
          return;
        }

        const client = createGeminiClient({
          model: 'models/gemini-2.5-flash-lite',
          temperature: 0.1,
          maxTokens: 100,
        });

        const result = await client.generateText('Say hello.');

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
      }
    );
  });
});
