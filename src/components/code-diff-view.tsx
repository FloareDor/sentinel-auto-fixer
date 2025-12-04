import { Window } from "@/components/windows95/window";

const mockOriginalCode = `function processUser(user) {
  if (user.age < 18) {
    return "minor";
  }
  return "adult";
}`;

const mockFixedCode = `function processUser(user) {
  if (!user || typeof user.age !== 'number') {
    throw new Error("Invalid user object");
  }
  if (user.age < 18) {
    return "minor";
  }
  return "adult";
}`;

export function CodeDiffView() {
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

        <div className="flex-1 grid grid-cols-2 gap-4">
          {/* Original Code */}
          <div className="space-y-2">
            <h3 className="win95-ui text-sm font-bold text-red-600">Original</h3>
            <pre className="win95-border-inset bg-win95-white p-3 win95-code text-sm overflow-x-auto h-full">
              {mockOriginalCode}
            </pre>
          </div>

          {/* Fixed Code */}
          <div className="space-y-2">
            <h3 className="win95-ui text-sm font-bold text-green-600">Fixed</h3>
            <pre className="win95-border-inset bg-win95-white p-3 win95-code text-sm overflow-x-auto h-full">
              {mockFixedCode}
            </pre>
          </div>
        </div>
      </div>
    </Window>
  );
}
