"use client";

import { Window } from "@/components/windows95/window";
import { Badge } from "@/components/ui/badge";
import { Thought } from "@/hooks/use-agent-stream";

interface AgentActivityStreamProps {
  thoughts: Thought[];
}

export function AgentActivityStream({ thoughts }: AgentActivityStreamProps) {
  return (
    <Window title="Agent Activity Stream">
      <div className="space-y-3 h-48 md:h-64 overflow-y-auto scroll-smooth">
        {thoughts.length === 0 ? (
          <div className="text-center py-8">
            <p className="win95-ui text-sm text-win95-dark-gray">
              Agent thoughts will appear here during processing...
            </p>
          </div>
        ) : (
          thoughts.map((thought, index) => (
            <div
              key={`${thought.timestamp}-${index}`}
              className="border-l-2 border-win95-blue pl-3 py-2 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-in-out"
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="win95-ui text-xs px-2 py-0">
                  {thought.node}
                </Badge>
                <span className="win95-ui text-xs text-win95-dark-gray">
                  {new Date(thought.timestamp).toLocaleTimeString()}
                </span>
                <Badge
                  variant="secondary"
                  className="win95-ui text-xs px-2 py-0 ml-auto"
                >
                  {thought.step}
                </Badge>
              </div>
              <p className="win95-ui text-sm text-win95-black italic">
                "{thought.content}"
              </p>
            </div>
          ))
        )}
      </div>
    </Window>
  );
}
