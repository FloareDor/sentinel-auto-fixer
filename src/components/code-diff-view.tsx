"use client";

import { Window } from "@/components/windows95/window";
import ReactDiffViewer from 'react-diff-viewer-continued';
import { Result } from "@/hooks/use-agent-stream";

interface CodeDiffViewProps {
  result: Result | null;
}

export function CodeDiffView({ result }: CodeDiffViewProps) {
  if (!result) {
    return (
      <Window title="Code Diff View" className="h-full">
        <div className="flex items-center justify-center h-full">
          <p className="win95-ui text-sm text-win95-dark-gray">
            Code diff will appear here after processing...
          </p>
        </div>
      </Window>
    );
  }

  return (
    <Window title="Code Diff View" className="h-full">
      <div className="space-y-4 h-full flex flex-col">
        <div className="flex gap-4 text-xs win95-ui font-bold">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Original Code</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Fixed Code</span>
          </div>
        </div>

        <div className="flex-1">
          <ReactDiffViewer
            oldValue={result.originalCode}
            newValue={result.fixedCode || ""}
            splitView={true}
            useDarkTheme={false}
            showDiffOnly={false}
            disableWordDiff={false}
            styles={{
              diffContainer: {
                fontFamily: "'Courier New', monospace",
                fontSize: "14px",
              },
              diffRemoved: {
                backgroundColor: "#ffeef0",
              },
              diffAdded: {
                backgroundColor: "#e6ffed",
              },
              line: {
                fontFamily: "'Courier New', monospace",
              },
              contentText: {
                fontFamily: "'Courier New', monospace",
              },
            }}
          />
        </div>

        {result.explanation && (
          <div className="mt-4 p-3 bg-win95-gray win95-border-inset">
            <h4 className="win95-ui text-sm font-bold text-win95-black mb-2">
              Explanation:
            </h4>
            <p className="win95-ui text-sm text-win95-black">
              {result.explanation}
            </p>
          </div>
        )}
      </div>
    </Window>
  );
}
