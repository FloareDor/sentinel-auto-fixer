import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock the compiled graph
vi.mock('@/lib/langgraph/graph', () => ({
  compiledGraph: {
    invoke: vi.fn(),
  },
}));

// Import after mocking
import { POST } from '../../app/api/agent/route';
import { compiledGraph } from '@/lib/langgraph/graph';

describe('Agent API Route', () => {
  const mockInvoke = vi.mocked(compiledGraph.invoke);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/agent', () => {
    it('should accept valid request and return streaming response', async () => {
      // Mock successful graph execution
      const mockFinalState = {
        errorLogs: 'TypeError: Cannot read property',
        sourceCode: 'console.log(data.foo)',
        attempts: 0,
        reasoningTrace: [
          {
            step: 'diagnose' as const,
            thought: 'This looks like a null reference error',
            timestamp: Date.now(),
            node: 'diagnostician',
          },
          {
            step: 'plan' as const,
            thought: 'I need to add null checks',
            timestamp: Date.now(),
            node: 'architect',
          },
          {
            step: 'fix' as const,
            thought: 'Adding null check before accessing foo',
            timestamp: Date.now(),
            node: 'surgeon',
          },
          {
            step: 'verify' as const,
            thought: 'Code looks good now',
            timestamp: Date.now(),
            node: 'verifier',
          },
        ],
        generatedPatch: 'console.log(data?.foo)',
        originalCode: 'console.log(data.foo)',
        fixedCode: 'console.log(data?.foo)',
      };

      // Mock the invoke method to return the final state
      mockInvoke.mockResolvedValue(mockFinalState);

      const requestBody = {
        errorLogs: 'TypeError: Cannot read property \'foo\' of undefined',
        sourceCode: 'console.log(data.foo)',
      };

      const request = new NextRequest('http://localhost:3000/api/agent', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'content-type': 'application/json',
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('text/event-stream');

      // Check that the response body contains streaming data
      if (!response.body) {
        throw new Error('Response body is null');
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let responseBody = '';
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          responseBody += decoder.decode(value, { stream: true });
        }
      } finally {
        reader.releaseLock();
      }
      
      expect(responseBody).toBeDefined();
      expect(responseBody.length).toBeGreaterThan(0);
      expect(responseBody).toContain('data:');
    });

    it('should validate request body and return 400 for invalid input', async () => {
      const invalidRequestBody = {
        // Missing required fields
        errorLogs: '',
      };

      const request = new NextRequest('http://localhost:3000/api/agent', {
        method: 'POST',
        body: JSON.stringify(invalidRequestBody),
        headers: {
          'content-type': 'application/json',
        },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Invalid request body');
      expect(responseData.details).toBeDefined();
    });

    it('should handle graph execution errors and return 500', async () => {
      // Mock graph execution error
      mockInvoke.mockRejectedValue(new Error('Graph execution failed'));

      const requestBody = {
        errorLogs: 'Some error',
        sourceCode: 'some code',
      };

      const request = new NextRequest('http://localhost:3000/api/agent', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'content-type': 'application/json',
        },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.error).toBe('Internal server error');
      expect(responseData.message).toContain('Graph execution failed after 1 attempts');
    });

    it('should handle malformed JSON and return 400', async () => {
      const request = new NextRequest('http://localhost:3000/api/agent', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'content-type': 'application/json',
        },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Invalid JSON in request body');
    });
  });
});
