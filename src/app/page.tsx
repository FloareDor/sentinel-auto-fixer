"use client";

import { useState, useEffect } from "react";
import { CodeInputPanel } from "@/components/code-input-panel";
import { AgentActivityStream } from "@/components/agent-activity-stream";
import { CodeDiffView } from "@/components/code-diff-view";
import { StatusBar } from "@/components/status-bar";
import { TaskBar } from "@/components/taskbar";
import { useAgentStream } from "@/hooks/use-agent-stream";
import { AboutDialog } from "@/components/easter-eggs/about-dialog";
import { SystemPropertiesDialog } from "@/components/easter-eggs/system-properties";
import { ErrorDialog } from "@/components/windows95/error-dialog";

export default function Home() {
  const { thoughts, result, isStreaming, error, submit } = useAgentStream();
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [showSystemPropertiesDialog, setShowSystemPropertiesDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDetails, setErrorDetails] = useState<{message: string, details?: string} | null>(null);

  const handleSubmit = async (errorLogs: string, sourceCode: string) => {
    await submit({ errorLogs, sourceCode });
  };

  const toggleAboutDialog = () => setShowAboutDialog(!showAboutDialog);
  const toggleSystemPropertiesDialog = () => setShowSystemPropertiesDialog(!showSystemPropertiesDialog);
  const closeErrorDialog = () => {
    setShowErrorDialog(false);
    setErrorDetails(null);
  };

  // Show error dialog when error occurs
  useEffect(() => {
    if (error) {
      setErrorDetails({ message: error });
      setShowErrorDialog(true);
    }
  }, [error]);

  return (
    <div className={`h-screen flex flex-col bg-win95-desktop transition-all duration-300 ${isStreaming ? 'processing' : ''}`}>
      {/* Main Content */}
      <div className="flex-1 p-2 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Left Panel: Input + Activity Stream */}
          <div className="flex flex-col gap-2 h-full min-h-0">
            <CodeInputPanel onSubmit={handleSubmit} isStreaming={isStreaming} />
            <AgentActivityStream thoughts={thoughts} />
          </div>

          {/* Right Panel: Code Diff View */}
          <div className="h-full min-h-0">
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
        <TaskBar
          onAboutClick={toggleAboutDialog}
          onSystemPropertiesClick={toggleSystemPropertiesDialog}
        />
      </div>

      {/* Easter Egg Dialogs */}
      <AboutDialog isOpen={showAboutDialog} onClose={toggleAboutDialog} />
      <SystemPropertiesDialog isOpen={showSystemPropertiesDialog} onClose={toggleSystemPropertiesDialog} />
      <ErrorDialog
        isOpen={showErrorDialog}
        onClose={closeErrorDialog}
        message={errorDetails?.message || "An unknown error occurred"}
        details={errorDetails?.details}
      />
    </div>
  );
}
