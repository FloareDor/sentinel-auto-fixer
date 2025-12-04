import { Window } from "@/components/windows95/window";
import { Button } from "@/components/windows95/button";
import { Textarea } from "@/components/ui/textarea";

export function CodeInputPanel() {
  return (
    <Window title="Input Panel - Error Logs & Source Code">
      <div className="space-y-4 h-full">
        <div className="space-y-2">
          <label className="win95-ui text-sm font-bold text-win95-black">
            Error Logs:
          </label>
          <Textarea
            placeholder="Paste your CI/CD error logs here..."
            className="win95-border-inset bg-win95-white win95-ui text-sm h-24 resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="win95-ui text-sm font-bold text-win95-black">
            Source Code:
          </label>
          <Textarea
            placeholder="Paste your source code here..."
            className="win95-border-inset bg-win95-white win95-code text-sm h-32 resize-none font-mono"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="default">Diagnose & Repair</Button>
        </div>
      </div>
    </Window>
  );
}
