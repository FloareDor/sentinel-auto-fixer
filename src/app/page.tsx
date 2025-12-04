import { CodeInputPanel } from "@/components/code-input-panel";
import { AgentActivityStream } from "@/components/agent-activity-stream";
import { CodeDiffView } from "@/components/code-diff-view";

export default function Home() {
  return (
    <div className="h-full p-2 bg-win95-desktop">
      <div className="h-full grid grid-cols-2 gap-2">
        {/* Left Panel: Input + Activity Stream */}
        <div className="flex flex-col gap-2 h-full">
          <CodeInputPanel />
          <AgentActivityStream />
        </div>

        {/* Right Panel: Code Diff View */}
        <div className="h-full">
          <CodeDiffView />
        </div>
      </div>
    </div>
  );
}
