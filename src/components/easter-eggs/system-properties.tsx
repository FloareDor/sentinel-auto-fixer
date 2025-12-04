import React, { useEffect } from 'react';
import { Dialog } from '../windows95/dialog';

interface SystemPropertiesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SystemPropertiesDialog({ isOpen, onClose }: SystemPropertiesDialogProps) {
  // Handle Ctrl+Shift+P keyboard shortcut (classic Windows shortcut)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        onClose(); // This will toggle the dialog in the parent component
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Dialog
      title="System Properties"
      onClose={onClose}
      className="min-w-96"
    >
      <div className="space-y-4">
        {/* Header with Windows logo */}
        <div className="flex items-center space-x-3">
          <div className="win95-border-raised bg-win95-blue p-2 w-12 h-12 flex items-center justify-center">
            <span className="text-win95-white font-bold text-lg">🪟</span>
          </div>
          <div>
            <h2 className="text-lg font-bold win95-ui">Windows 95</h2>
            <p className="text-sm">Sentinel Edition</p>
          </div>
        </div>

        {/* System Information */}
        <div className="win95-border-inset bg-win95-gray p-3">
          <h3 className="font-bold text-sm mb-2">System</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>System:</span>
              <span>Sentinel Repair Agent</span>
            </div>
            <div className="flex justify-between">
              <span>Version:</span>
              <span>1.0.0 (Build 1995)</span>
            </div>
            <div className="flex justify-between">
              <span>Build Date:</span>
              <span>2025-01-04</span>
            </div>
            <div className="flex justify-between">
              <span>Architecture:</span>
              <span>Multi-Agent System</span>
            </div>
          </div>
        </div>

        {/* Agent Information */}
        <div className="win95-border-inset bg-win95-gray p-3">
          <h3 className="font-bold text-sm mb-2">Agent Configuration</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>AI Provider:</span>
              <span>Google Gemini 2.0 Flash</span>
            </div>
            <div className="flex justify-between">
              <span>Agent Nodes:</span>
              <span>4 (Diagnostician, Architect, Surgeon, Verifier)</span>
            </div>
            <div className="flex justify-between">
              <span>Personality System:</span>
              <span>Enabled</span>
            </div>
            <div className="flex justify-between">
              <span>Streaming:</span>
              <span>Vercel AI SDK</span>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="win95-border-inset bg-win95-gray p-3">
          <h3 className="font-bold text-sm mb-2">Performance</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Response Time:</span>
              <span>~2-5 seconds</span>
            </div>
            <div className="flex justify-between">
              <span>Reliability:</span>
              <span>99.9%</span>
            </div>
            <div className="flex justify-between">
              <span>Memory Usage:</span>
              <span>Low</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-center text-win95-dark-gray border-t border-win95-dark-gray pt-2">
          <p>© 2025 Sentinel Technologies - Powered by AI</p>
          <p className="mt-1">
            Press Ctrl+Shift+P or click OK to close
          </p>
        </div>
      </div>
    </Dialog>
  );
}
