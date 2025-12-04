"use client";

interface StatusBarProps {
  isStreaming: boolean;
  hasResult: boolean;
  error: string | null;
}

export function StatusBar({ isStreaming, hasResult, error }: StatusBarProps) {
  let statusMessage = "Ready - Sentinel Repair Agent v1.0";

  if (error) {
    statusMessage = `Error: ${error}`;
  } else if (isStreaming) {
    statusMessage = "Processing...";
  } else if (hasResult) {
    statusMessage = "All systems operational!";
  }

  return (
    <div className="win95-border-raised bg-win95-gray h-6 flex items-center px-2">
      <div className="text-xs win95-ui text-win95-black transition-colors duration-200">
        {statusMessage}
      </div>
    </div>
  );
}
