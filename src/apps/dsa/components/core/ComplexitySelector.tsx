import React from 'react';

export interface ComplexityFeedback {
  timeCorrect: boolean;
  spaceCorrect: boolean;
  timeExpected?: string;
  spaceExpected?: string;
}

interface ComplexitySelectorProps {
  timeComplexity: string;
  spaceComplexity: string;
  onTimeChange: (value: string) => void;
  onSpaceChange: (value: string) => void;
  complexityFeedback: ComplexityFeedback | null;
  complexityOptions: string[];
}

export const ComplexitySelector: React.FC<ComplexitySelectorProps> = ({
  timeComplexity,
  spaceComplexity,
  onTimeChange,
  onSpaceChange,
  complexityFeedback,
  complexityOptions,
}) => {
  return (
    <div className="flex-shrink-0 bg-slate-900 p-4">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
          <span className="text-slate-300 text-sm font-semibold">📊 Complexity Analysis (Required)</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Time Complexity Dropdown */}
          <div>
            <label className="text-slate-400 text-xs block mb-1">Time Complexity</label>
            <select
              value={timeComplexity}
              onChange={(e) => onTimeChange(e.target.value)}
              className="w-full bg-slate-800 text-slate-200 border border-slate-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">Select...</option>
              {complexityOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {complexityFeedback && !complexityFeedback.timeCorrect && (
              <div className="text-red-400 text-xs mt-1">
                ✗ Expected: {complexityFeedback.timeExpected}
              </div>
            )}
            {complexityFeedback && complexityFeedback.timeCorrect && (
              <div className="text-green-400 text-xs mt-1">
                ✓ Correct!
              </div>
            )}
          </div>

          {/* Space Complexity Dropdown */}
          <div>
            <label className="text-slate-400 text-xs block mb-1">Space Complexity</label>
            <select
              value={spaceComplexity}
              onChange={(e) => onSpaceChange(e.target.value)}
              className="w-full bg-slate-800 text-slate-200 border border-slate-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">Select...</option>
              {complexityOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {complexityFeedback && !complexityFeedback.spaceCorrect && (
              <div className="text-red-400 text-xs mt-1">
                ✗ Expected: {complexityFeedback.spaceExpected}
              </div>
            )}
            {complexityFeedback && complexityFeedback.spaceCorrect && (
              <div className="text-green-400 text-xs mt-1">
                ✓ Correct!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

