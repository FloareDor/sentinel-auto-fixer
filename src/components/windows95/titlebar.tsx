import React from 'react';

interface TitleBarProps {
  title: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  className?: string;
}

export function TitleBar({
  title,
  onMinimize,
  onMaximize,
  onClose,
  className = ''
}: TitleBarProps) {
  return (
    <div className={`win95-border-raised bg-win95-blue flex items-center justify-between px-2 py-1 ${className}`}>
      <span className="win95-ui text-win95-white text-xs font-bold flex-1">
        {title}
      </span>
      <div className="flex space-x-1">
        <button
          onClick={onMinimize}
          className="win95-border-raised bg-win95-gray w-4 h-4 flex items-center justify-center text-win95-black text-xs hover:bg-win95-dark-gray"
          title="Minimize"
        >
          _
        </button>
        <button
          onClick={onMaximize}
          className="win95-border-raised bg-win95-gray w-4 h-4 flex items-center justify-center text-win95-black text-xs hover:bg-win95-dark-gray"
          title="Maximize"
        >
          □
        </button>
        <button
          onClick={onClose}
          className="win95-border-raised bg-win95-gray w-4 h-4 flex items-center justify-center text-win95-black text-xs hover:bg-win95-dark-gray"
          title="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}
