import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface OutputPanelProps {
  isRunning: boolean;
  isSuccess: boolean | null;
  error: string;
  output: string;
  onClose: () => void;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  isRunning,
  isSuccess,
  error,
  output,
  onClose,
}) => {
  return (
    <div className="flex-1 min-h-0">
      <div className="h-full flex flex-col border-t border-slate-700 bg-slate-950">
        <div className="p-3 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Output</span>
              {isSuccess === true && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              {isSuccess === false && (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded hover:bg-slate-800"
              title="Close output"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 font-mono text-sm">
            {error && (
              <div className="text-red-400 mb-2 whitespace-pre-wrap">
                <span className="text-red-500">Error:</span> {error}
              </div>
            )}
            {output && (
              <div className={`whitespace-pre-wrap ${isSuccess ? 'text-green-400' : 'text-slate-300'}`}>
                {output}
              </div>
            )}
            {!output && !error && !isRunning && (
              <div className="text-slate-500 italic">
                Click "Run" to execute your code
              </div>
            )}
            {isRunning && (
              <div className="text-blue-400 italic">
                Running code...
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

