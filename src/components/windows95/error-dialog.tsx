"use client";

import { Button } from "@/components/windows95/button";
import { Window } from "@/components/windows95/window";

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  details?: string;
}

export function ErrorDialog({
  isOpen,
  onClose,
  title = "Error",
  message,
  details
}: ErrorDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Window title={title} className="w-96">
        <div className="p-4 space-y-4">
          {/* Error Icon */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-win95-white win95-border-inset flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="win95-ui text-sm text-win95-black">
                {message}
              </p>
              {details && (
                <details className="mt-2">
                  <summary className="win95-ui text-xs cursor-pointer text-win95-blue hover:underline">
                    Show Details
                  </summary>
                  <pre className="win95-code text-xs mt-2 p-2 bg-win95-white win95-border-inset overflow-auto max-h-32">
                    {details}
                  </pre>
                </details>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <Button onClick={onClose} variant="default">
              OK
            </Button>
          </div>
        </div>
      </Window>
    </div>
  );
}
