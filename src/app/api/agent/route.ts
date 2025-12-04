import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { compiledGraph } from '@/lib/langgraph/graph';
import { createInitialState, AgentState } from '@/lib/langgraph/state';

// Schema for API request body
const AgentRequestSchema = z.object({
  errorLogs: z.string().min(1, 'Error logs are required'),
  sourceCode: z.string().min(1, 'Source code is required'),
});

/**
 * POST handler for the Sentinel repair agent API
 * Accepts error logs and source code, runs the LangGraph, and streams results
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      const text = await request.text();
      console.error('Raw request body:', text);
      return NextResponse.json(
        { error: 'Invalid JSON in request body', raw: text },
        { status: 400 }
      );
    }
    const validationResult = AgentRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { errorLogs, sourceCode } = validationResult.data;

    // Create initial state
    const initialState = createInitialState(errorLogs, sourceCode);

    // Create a ReadableStream for server-sent events
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Run the compiled graph
          const finalState = await compiledGraph.invoke(initialState);

          // Emit thought events for all reasoning traces
          finalState.reasoningTrace.forEach((trace) => {
            const eventData = JSON.stringify({
              type: 'thought',
              node: trace.node,
              content: trace.thought,
              step: trace.step,
              timestamp: trace.timestamp,
            });
            controller.enqueue(`data: ${eventData}\n\n`);
          });

          // Emit final result
          if (finalState.fixedCode) {
            const resultData = JSON.stringify({
              type: 'result',
              originalCode: finalState.originalCode,
              fixedCode: finalState.fixedCode,
              explanation: finalState.reasoningTrace
                .map(trace => `${trace.node}: ${trace.thought}`)
                .join('\n'),
            });
            controller.enqueue(`data: ${resultData}\n\n`);
          } else {
            // Handle case where no fix was generated
            const resultData = JSON.stringify({
              type: 'result',
              originalCode: initialState.originalCode,
              fixedCode: null,
              explanation: 'Unable to generate a fix for the provided error logs and source code.',
            });
            controller.enqueue(`data: ${resultData}\n\n`);
          }

          // Close the stream
          controller.close();
        } catch (error) {
          // Emit error event
          const errorData = JSON.stringify({
            type: 'error',
            message: error instanceof Error ? error.message : 'Unknown error occurred',
          });
          controller.enqueue(`data: ${errorData}\n\n`);
          controller.close();
        }
      },
    });

    // Return streaming response with proper headers
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Agent API error:', error);

    // Return error response
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
