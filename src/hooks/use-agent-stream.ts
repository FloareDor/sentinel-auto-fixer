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
    let controller: AbortController | null = null;
    let retryCount = 0;
    const maxRetries = 2;
    const retryDelay = 2000; // 2 seconds

    const attemptSubmit = async (): Promise<void> => {
      try {
        // Reset state before starting new request (only on first attempt)
        if (retryCount === 0) {
          reset();
          setIsStreaming(true);
        }

        // Create AbortController for request cancellation
        controller = new AbortController();

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
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
      let timeoutId: NodeJS.Timeout | null = null;

      // Set up timeout for stream inactivity (30 seconds)
      const resetTimeout = () => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          throw new Error('Stream timeout - no data received for 30 seconds');
        }, 30000);
      };

      resetTimeout();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          // Reset timeout on each chunk received
          resetTimeout();

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
                // Continue processing other lines even if one fails
              }
            }
          }
        }
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
        reader.releaseLock();
      }

      } catch (err) {
        // Handle different types of errors
        let errorMessage = 'Unknown error occurred';
        let shouldRetry = false;

        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            errorMessage = 'Request was cancelled';
          } else if (err.message.includes('fetch') || err.message.includes('network')) {
            errorMessage = 'Network error - please check your connection';
            shouldRetry = retryCount < maxRetries;
          } else if (err.message.includes('timeout')) {
            errorMessage = 'Request timed out';
            shouldRetry = retryCount < maxRetries;
          } else {
            errorMessage = err.message;
            // Don't retry for API validation errors or other client errors
            shouldRetry = false;
          }
        }

        if (shouldRetry) {
          retryCount++;
          console.warn(`Retrying request (attempt ${retryCount}/${maxRetries}):`, errorMessage);
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return attemptSubmit(); // Recursive retry
        } else {
          setError(errorMessage);
          console.error('Agent stream error:', err);
        }
      } finally {
        setIsStreaming(false);
        // Clean up AbortController
        if (controller) {
          controller.abort();
        }
      }
    };

    // Start the submission process
    return attemptSubmit();
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
