import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { compiledGraph } from '@/lib/langgraph/graph';
import { createInitialState, AgentState } from '@/lib/langgraph/state';
import { Octokit } from '@octokit/rest';

// Schema for GitHub integration data
const GitHubIntegrationSchema = z.object({
  repo: z.string(),
  sha: z.string(),
  workflow: z.string().optional(),
}).optional();

// Schema for API request body
const AgentRequestSchema = z.object({
  errorLogs: z.string().min(1, 'Error logs are required'),
  sourceCode: z.string().min(1, 'Source code is required'),
  retryDepth: z.number().min(1).max(3).default(1),
  github: GitHubIntegrationSchema,
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
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
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

    const { errorLogs, sourceCode, retryDepth, github } = validationResult.data;

    // Create initial state
    const initialState = createInitialState(errorLogs, sourceCode);

    // Run the compiled graph with configurable retry logic
    let finalState: AgentState | null = null;
    let attempts = 0;
    const maxAttempts = retryDepth;
    const retryDelay = 1000; // 1 second

    while (attempts < maxAttempts) {
      try {
        finalState = await compiledGraph.invoke(initialState);
        break; // Success, exit retry loop
      } catch (graphError) {
        attempts++;
        console.error(`Graph execution attempt ${attempts}/${maxAttempts} failed:`, graphError);

        if (attempts >= maxAttempts) {
          // All attempts failed - return failure response for GitHub integration
          if (github) {
            return NextResponse.json({
              success: false,
              error: `Failed to fix after ${maxAttempts} attempts`,
              attempts: maxAttempts,
              github: github
            });
          }
          // For regular API calls, still throw error
          throw new Error(`Graph execution failed after ${maxAttempts} attempts: ${graphError instanceof Error ? graphError.message : 'Unknown error'}`);
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempts));
      }
    }

    // Ensure finalState is assigned (should always be true after successful loop)
    if (!finalState) {
      throw new Error('Unexpected error: finalState was not assigned after graph execution');
    }

    // Handle GitHub integration if provided
    if (github && finalState.fixedCode) {
      try {
        const octokit = new Octokit({
          auth: process.env.GITHUB_TOKEN || process.env.SENTINEL_GITHUB_TOKEN
        });

        const [owner, repo] = github.repo.split('/');
        const branchName = `sentinel-fix-${Date.now()}`;
        const commitMessage = `🤖 Sentinel Auto-Fix: ${finalState.reasoningTrace.map(t => t.thought).slice(-1)[0]?.substring(0, 50)}...`;

        // Create new branch
        const { data: ref } = await octokit.git.createRef({
          owner,
          repo,
          ref: `refs/heads/${branchName}`,
          sha: github.sha
        });

        // Create blob with fixed code
        const { data: blob } = await octokit.git.createBlob({
          owner,
          repo,
          content: Buffer.from(finalState.fixedCode).toString('base64'),
          encoding: 'base64'
        });

        // Get current tree
        const { data: commit } = await octokit.git.getCommit({
          owner,
          repo,
          commit_sha: github.sha
        });

        // Create new tree with fixed file
        // Note: This is simplified - you'd need to handle the actual file path
        const { data: tree } = await octokit.git.createTree({
          owner,
          repo,
          tree: [{
            path: 'fixed-file.js', // TODO: Determine actual file path from sourceCode
            mode: '100644',
            type: 'blob',
            content: finalState.fixedCode
          }],
          base_tree: commit.tree.sha
        });

        // Create commit
        const { data: newCommit } = await octokit.git.createCommit({
          owner,
          repo,
          message: commitMessage,
          tree: tree.sha,
          parents: [github.sha]
        });

        // Update branch reference
        await octokit.git.updateRef({
          owner,
          repo,
          ref: `heads/${branchName}`,
          sha: newCommit.sha
        });

        // Create pull request
        const { data: pr } = await octokit.pulls.create({
          owner,
          repo,
          title: `🤖 Sentinel Auto-Fix: ${github.workflow || 'Build Fix'}`,
          head: branchName,
          base: 'main', // TODO: Determine base branch
          body: `
## 🤖 Sentinel Auto-Fix

**Original Issue:** Build failure in workflow "${github.workflow || 'CI/CD'}"
**Fixed Files:** 1 file(s) modified
**Retry Depth:** ${retryDepth}

### What Sentinel Did

${finalState.reasoningTrace.map(trace => `**${trace.node}:** ${trace.thought}`).join('\n\n')}

### Code Changes
\`\`\`diff
${finalState.originalCode}
---
${finalState.fixedCode}
\`\`\`

### Next Steps
- Review the changes above
- Test the fix in your CI/CD pipeline
- Merge if the fix looks correct

---
*This PR was created automatically by [Sentinel](https://github.com/your-org/sentinel)*
          `
        });

        // Return success response for GitHub integration
        return NextResponse.json({
          success: true,
          pr_url: pr.html_url,
          branch: branchName,
          fix_summary: `Fixed build error with ${retryDepth} retry attempts. Created PR: ${pr.html_url}`,
          attempts: attempts + 1,
          github: github
        });

      } catch (githubError) {
        console.error('GitHub integration error:', githubError);
        // Fall back to regular streaming response if GitHub integration fails
      }
    }

    // Create a ReadableStream for server-sent events (original behavior)
    const stream = new ReadableStream({
      start(controller) {
        // Emit thought events for all reasoning traces
        finalState.reasoningTrace.forEach((trace) => {
          const eventData = JSON.stringify({
            type: 'thought',
            node: trace.node,
            content: trace.thought,
            step: trace.step,
            timestamp: trace.timestamp,
          });
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(`data: ${eventData}\n\n`));
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
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(`data: ${resultData}\n\n`));
        } else {
          // Handle case where no fix was generated
          const resultData = JSON.stringify({
            type: 'result',
            originalCode: initialState.originalCode,
            fixedCode: null,
            explanation: 'Unable to generate a fix for the provided error logs and source code.',
          });
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(`data: ${resultData}\n\n`));
        }

        // Close the stream
        controller.close();
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
