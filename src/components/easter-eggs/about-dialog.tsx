import React, { useEffect } from 'react';
import { Dialog } from '../windows95/dialog';

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutDialog({ isOpen, onClose }: AboutDialogProps) {
  // Handle Alt+H keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'h') {
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
      title="About Sentinel"
      onClose={onClose}
      className="min-w-80"
    >
      <div className="space-y-4 text-center">
        {/* Logo/Icon area */}
        <div className="flex justify-center">
          <div className="win95-border-raised bg-win95-blue p-2 w-16 h-16 flex items-center justify-center">
            <span className="text-win95-white font-bold text-2xl">S</span>
          </div>
        </div>

        {/* Product name */}
        <div>
          <h2 className="text-lg font-bold win95-ui mb-1">
            Sentinel Repair Agent
          </h2>
          <p className="text-sm text-win95-dark-gray">
            Version 1.0.0
          </p>
        </div>

        {/* Description */}
        <div className="text-xs text-center space-y-2">
          <p>
            An Observable "Glass Box" CI/CD Repair Agent
          </p>
          <p className="text-win95-dark-gray">
            Built with Next.js 14+, LangGraph.js, and Gemini AI
          </p>
        </div>

        {/* Build info */}
        <div className="bg-win95-gray win95-border-inset p-2 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Build Date:</span>
              <span>2025-01-04</span>
            </div>
            <div className="flex justify-between">
              <span>Architecture:</span>
              <span>Multi-Agent System</span>
            </div>
            <div className="flex justify-between">
              <span>AI Provider:</span>
              <span>Google Gemini 2.0</span>
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="text-xs text-center">
          <p className="font-bold mb-1">Credits</p>
          <p className="text-win95-dark-gray">
            Built with ❤️ using Windows 95 nostalgia
          </p>
          <p className="text-win95-dark-gray mt-1">
            Powered by Vercel AI SDK & LangGraph.js
          </p>
        </div>

        {/* Copyright */}
        <div className="text-xs text-win95-dark-gray text-center border-t border-win95-dark-gray pt-2">
          <p>© 2025 Sentinel Technologies</p>
          <p className="mt-1">
            Press Alt+H or click OK to close
          </p>
        </div>
      </div>
    </Dialog>
  );
}
