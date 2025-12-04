"use client";

import { useState } from "react";
import { Window } from "@/components/windows95/window";
import { Button } from "@/components/windows95/button";
import { LoadingSpinner } from "@/components/windows95/loading-spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAgentStream } from "@/hooks/use-agent-stream";

interface CodeInputPanelProps {
  onSubmit: (errorLogs: string, sourceCode: string) => Promise<void>;
  isStreaming: boolean;
}

export function CodeInputPanel({ onSubmit, isStreaming }: CodeInputPanelProps) {
  const [errorLogs, setErrorLogs] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [validationErrors, setValidationErrors] = useState<{errorLogs?: string, sourceCode?: string}>({});

  const validateInputs = () => {
    const errors: {errorLogs?: string, sourceCode?: string} = {};

    if (!errorLogs.trim()) {
      errors.errorLogs = "Error logs are required";
    }

    if (!sourceCode.trim()) {
      errors.sourceCode = "Source code is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) {
      return; // Don't submit if validation fails
    }

    await onSubmit(errorLogs, sourceCode);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter to submit
    if (e.ctrlKey && e.key === 'Enter' && !isStreaming) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <Window title="Input Panel - Error Logs & Source Code">
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4 h-full">
        <div className="space-y-2">
          <label className="win95-ui text-sm font-bold text-win95-black">
            Error Logs:
          </label>
          <Textarea
            value={errorLogs}
            onChange={(e) => {
              setErrorLogs(e.target.value);
              if (validationErrors.errorLogs) {
                setValidationErrors(prev => ({ ...prev, errorLogs: undefined }));
              }
            }}
            placeholder="Paste your CI/CD error logs here..."
            className={`win95-border-inset bg-win95-white win95-ui text-sm h-20 md:h-24 resize-none ${
              validationErrors.errorLogs ? 'border-red-500' : ''
            }`}
            disabled={isStreaming}
          />
          {validationErrors.errorLogs && (
            <div className="win95-ui text-xs text-red-600">
              {validationErrors.errorLogs}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="win95-ui text-sm font-bold text-win95-black">
            Source Code:
          </label>
          <Textarea
            value={sourceCode}
            onChange={(e) => {
              setSourceCode(e.target.value);
              if (validationErrors.sourceCode) {
                setValidationErrors(prev => ({ ...prev, sourceCode: undefined }));
              }
            }}
            placeholder="Paste your source code here..."
            className={`win95-border-inset bg-win95-white win95-code text-sm h-24 md:h-32 resize-none font-mono ${
              validationErrors.sourceCode ? 'border-red-500' : ''
            }`}
            disabled={isStreaming}
          />
          {validationErrors.sourceCode && (
            <div className="win95-ui text-xs text-red-600">
              {validationErrors.sourceCode}
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            variant="default"
            disabled={isStreaming || !errorLogs.trim() || !sourceCode.trim()}
          >
            {isStreaming ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Processing...
              </>
            ) : (
              "Diagnose & Repair"
            )}
          </Button>
        </div>
      </form>
    </Window>
  );
}
