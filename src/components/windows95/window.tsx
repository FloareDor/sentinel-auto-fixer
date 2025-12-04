import React from 'react';

interface WindowProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Window({ title, children, className = '' }: WindowProps) {
  return (
    <div className={`win95-border-window bg-win95-gray ${className}`}>
      {title && (
        <div className="win95-border-raised bg-win95-blue px-2 py-1">
          <span className="win95-ui text-win95-white text-xs font-bold">
            {title}
          </span>
        </div>
      )}
      <div className="p-2">
        {children}
      </div>
    </div>
  );
}
