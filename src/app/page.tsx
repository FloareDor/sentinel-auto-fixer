"use client";

import { CodeInputPanel } from "@/components/code-input-panel";
import { AgentActivityStream } from "@/components/agent-activity-stream";
import { CodeDiffView } from "@/components/code-diff-view";
import { StatusBar } from "@/components/status-bar";
import { TaskBar } from "@/components/taskbar";
import { useAgentStream } from "@/hooks/use-agent-stream";

export default function Home() {
  const { thoughts, result, isStreaming, error, submit } = useAgentStream();

  const handleSubmit = async (errorLogs: string, sourceCode: string) => {
    await submit({ errorLogs, sourceCode });
  };

  return (
    <div className="h-screen flex flex-col bg-win95-desktop">
      {/* Main Content */}
      <div className="flex-1 p-2 overflow-hidden">
        <div className="h-full grid grid-cols-2 gap-2">
          {/* Left Panel: Input + Activity Stream */}
          <div className="flex flex-col gap-2 h-full">
            <CodeInputPanel onSubmit={handleSubmit} isStreaming={isStreaming} />
            <AgentActivityStream thoughts={thoughts} />
          </div>

          {/* Right Panel: Code Diff View */}
          <div className="h-full">
            <CodeDiffView result={result} />
          </div>
        </div>
      </div>

      {/* Bottom UI: Taskbar + Status Bar */}
      <div className="flex flex-col">
        <StatusBar
          isStreaming={isStreaming}
          hasResult={result !== null}
          error={error}
        />
        <TaskBar />
      </div>
    </div>
  );
}
