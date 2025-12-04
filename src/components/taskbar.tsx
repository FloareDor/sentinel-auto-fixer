import { Button } from "@/components/windows95/button";

export function TaskBar() {
  return (
    <div className="win95-border-raised bg-win95-gray h-8 flex items-center px-2 gap-1">
      <Button variant="default" className="h-6 px-2 text-xs">
        Start
      </Button>
      <div className="flex-1" />
      <div className="text-xs win95-ui text-win95-black">
        12:34 PM
      </div>
    </div>
  );
}
