import React from 'react';
import { Window } from './window';

interface DialogProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export function Dialog({ title, children, className = '', onClose }: DialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Window title={title} className={`min-w-96 max-w-md ${className}`}>
        <div className="space-y-4">
          {children}
          {onClose && (
            <div className="flex justify-end space-x-2 pt-4 border-t border-win95-dark-gray">
              <button
                onClick={onClose}
                className="win95-ui win95-border-raised bg-win95-gray px-4 py-1 text-xs hover:bg-win95-blue hover:text-win95-white"
              >
                OK
              </button>
            </div>
          )}
        </div>
      </Window>
    </div>
  );
}
