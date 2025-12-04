import { useState, useCallback } from 'react';

/**
 * Type for thought events from the streaming API
 */
export interface Thought {
  node: string;
  content: string;
  step: 'diagnose' | 'plan' | 'fix' | 'verify';
  timestamp: number;
}

/**
 * Type for result events from the streaming API
 */
export interface Result {
  originalCode: string;
  fixedCode: string | null;
  explanation: string;
}

/**
 * Request payload for the agent API
 */
export interface AgentRequest {
  errorLogs: string;
  sourceCode: string;
}

/**
 * Hook state
 */
export interface AgentStreamState {
  thoughts: Thought[];
  result: Result | null;
  isStreaming: boolean;
  error: string | null;
}

/**
 * Hook return type
 */
export interface UseAgentStreamReturn extends AgentStreamState {
  submit: (request: AgentRequest) => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for handling agent streaming responses
 * Consumes server-sent events from the /api/agent endpoint
 */
export function useAgentStream(): UseAgentStreamReturn {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Resets the hook state to initial values
   */
  const reset = useCallback(() => {
    setThoughts([]);
    setResult(null);
    setIsStreaming(false);
    setError(null);
  }, []);

  /**
   * Submits a request to the agent API and handles the streaming response
   */
  const submit = useCallback(async (request: AgentRequest) => {
    try {
      // Reset state before starting new request
      reset();
      setIsStreaming(true);

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');

          // Keep the last incomplete line in buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6)); // Remove 'data: ' prefix

                switch (data.type) {
                  case 'thought':
                    setThoughts(prev => [...prev, {
                      node: data.node,
                      content: data.content,
                      step: data.step,
                      timestamp: data.timestamp,
                    }]);
                    break;

                  case 'result':
                    setResult({
                      originalCode: data.originalCode,
                      fixedCode: data.fixedCode,
                      explanation: data.explanation,
                    });
                    break;

                  case 'error':
                    setError(data.message);
                    break;

                  default:
                    console.warn('Unknown event type:', data.type);
                }
              } catch (parseError) {
                console.error('Failed to parse SSE data:', line, parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Agent stream error:', err);
    } finally {
      setIsStreaming(false);
    }
  }, [reset]);

  return {
    thoughts,
    result,
    isStreaming,
    error,
    submit,
    reset,
  };
}
