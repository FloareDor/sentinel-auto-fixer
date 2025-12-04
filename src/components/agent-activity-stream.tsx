import { Window } from "@/components/windows95/window";
import { Badge } from "@/components/ui/badge";

const mockActivities = [
  {
    id: 1,
    node: "Diagnostician",
    step: "diagnose",
    thought: "Hmm, this error looks suspicious... Let me dig into these logs...",
    timestamp: Date.now() - 30000,
  },
  {
    id: 2,
    node: "Architect",
    step: "plan",
    thought: "Alright, time to fix this mess. I've got a plan...",
    timestamp: Date.now() - 25000,
  },
  {
    id: 3,
    node: "Surgeon",
    step: "fix",
    thought: "Let me carefully patch this up... Making the incision...",
    timestamp: Date.now() - 20000,
  },
  {
    id: 4,
    node: "Verifier",
    step: "verify",
    thought: "Double-checking... looks good to me! All systems operational!",
    timestamp: Date.now() - 15000,
  },
];

export function AgentActivityStream() {
  return (
    <Window title="Agent Activity Stream">
      <div className="space-y-3 h-64 overflow-y-auto">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="border-l-2 border-win95-blue pl-3 py-2">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="win95-ui text-xs px-2 py-0">
                {activity.node}
              </Badge>
              <span className="win95-ui text-xs text-win95-dark-gray">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="win95-ui text-sm text-win95-black italic">
              "{activity.thought}"
            </p>
          </div>
        ))}
      </div>
    </Window>
  );
}
