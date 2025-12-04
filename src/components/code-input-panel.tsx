"use client";

import { useState } from "react";
import { Window } from "@/components/windows95/window";
import { Button } from "@/components/windows95/button";
import { Textarea } from "@/components/ui/textarea";
import { useAgentStream } from "@/hooks/use-agent-stream";

interface CodeInputPanelProps {
  onSubmit: (errorLogs: string, sourceCode: string) => Promise<void>;
  isStreaming: boolean;
}

export function CodeInputPanel({ onSubmit, isStreaming }: CodeInputPanelProps) {
  const [errorLogs, setErrorLogs] = useState("");
  const [sourceCode, setSourceCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!errorLogs.trim() || !sourceCode.trim()) {
      return; // Don't submit if fields are empty
    }
    await onSubmit(errorLogs, sourceCode);
  };

  return (
    <Window title="Input Panel - Error Logs & Source Code">
      <form onSubmit={handleSubmit} className="space-y-4 h-full">
        <div className="space-y-2">
          <label className="win95-ui text-sm font-bold text-win95-black">
            Error Logs:
          </label>
          <Textarea
            value={errorLogs}
            onChange={(e) => setErrorLogs(e.target.value)}
            placeholder="Paste your CI/CD error logs here..."
            className="win95-border-inset bg-win95-white win95-ui text-sm h-24 resize-none"
            disabled={isStreaming}
          />
        </div>

        <div className="space-y-2">
          <label className="win95-ui text-sm font-bold text-win95-black">
            Source Code:
          </label>
          <Textarea
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            placeholder="Paste your source code here..."
            className="win95-border-inset bg-win95-white win95-code text-sm h-32 resize-none font-mono"
            disabled={isStreaming}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            variant="default"
            disabled={isStreaming || !errorLogs.trim() || !sourceCode.trim()}
          >
            {isStreaming ? "Processing..." : "Diagnose & Repair"}
          </Button>
        </div>
      </form>
    </Window>
  );
}
