import { useState } from "react";
import { Button } from "@/components/windows95/button";

interface TaskBarProps {
  onAboutClick?: () => void;
  onSystemPropertiesClick?: () => void;
}

export function TaskBar({ onAboutClick, onSystemPropertiesClick }: TaskBarProps) {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const handleStartClick = () => {
    setShowStartMenu(!showStartMenu);
  };

  const handleAboutClick = () => {
    setShowStartMenu(false);
    onAboutClick?.();
  };

  const handleSystemPropertiesClick = () => {
    setShowStartMenu(false);
    onSystemPropertiesClick?.();
  };

  return (
    <div className="relative">
      <div className="win95-border-raised bg-win95-gray h-8 flex items-center px-2 gap-1">
        <Button
          variant="default"
          className="h-6 px-2 text-xs"
          onClick={handleStartClick}
        >
          Start
        </Button>
        <div className="flex-1" />
        <div className="text-xs win95-ui text-win95-black">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Start Menu */}
      {showStartMenu && (
        <div className="absolute bottom-8 left-2 win95-border-raised bg-win95-gray w-48 z-50">
          <div className="p-1">
            {/* Programs */}
            <div className="text-xs font-bold text-win95-dark-gray px-2 py-1">
              Sentinel
            </div>

            {/* Menu Items */}
            <div className="space-y-0">
              <button
                onClick={handleAboutClick}
                className="w-full text-left px-2 py-1 text-xs hover:bg-win95-blue hover:text-win95-white"
              >
                About Sentinel
              </button>
              <button
                onClick={handleSystemPropertiesClick}
                className="w-full text-left px-2 py-1 text-xs hover:bg-win95-blue hover:text-win95-white"
              >
                System Properties
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showStartMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowStartMenu(false)}
        />
      )}
    </div>
  );
}
