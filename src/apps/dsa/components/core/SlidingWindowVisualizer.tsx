import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, RotateCcw, Monitor } from 'lucide-react';

interface SlidingWindowVisualizerProps {
  initialNums?: number[];
  k?: number;
}

export const SlidingWindowVisualizer: React.FC<SlidingWindowVisualizerProps> = ({
  initialNums = [2, 1, 5, 1, 3, 2],
  k = 3
}) => {
  const [mode, setMode] = useState<'brute' | 'optimized'>('brute');
  const [step, setStep] = useState(0);

  const maxSteps = initialNums.length - k + 1;

  // Reset when switching modes
  const handleModeChange = (newMode: 'brute' | 'optimized') => {
    setMode(newMode);
    setStep(0);
  };

  const currentWindowStart = step;
  const currentWindowEnd = step + k - 1;
  const currentWindow = initialNums.slice(currentWindowStart, currentWindowEnd + 1);
  const currentSum = currentWindow.reduce((a, b) => a + b, 0);

  const prevWindowStart = step - 1;
  const prevWindowEnd = step + k - 2; // End of previous window before slide
  const prevSum = step > 0 ? initialNums.slice(prevWindowStart, prevWindowStart + k).reduce((a, b) => a + b, 0) : 0;

  const leavingVal = step > 0 ? initialNums[prevWindowStart] : null;
  const enteringVal = step > 0 ? initialNums[currentWindowEnd] : null;

  return (
    <div className="my-8 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => handleModeChange('brute')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${mode === 'brute'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
              }`}
          >
            Brute Force (Redundant)
          </button>
          <button
            onClick={() => handleModeChange('optimized')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${mode === 'optimized'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
              }`}
          >
            Optimized (Sliding)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 font-mono mr-2">
            Step {step + 1} / {maxSteps}
          </span>
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setStep(Math.min(maxSteps - 1, step + 1))}
            disabled={step === maxSteps - 1}
            className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => setStep(0)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors ml-1"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="relative mb-12">
        <div className="flex justify-center gap-3">
          {initialNums.map((num, idx) => {
            let state = 'default';
            // Determine state based on mode and step
            const isInWindow = idx >= currentWindowStart && idx <= currentWindowEnd;

            if (mode === 'brute') {
              if (isInWindow) state = 'active';
            } else {
              // Optimized mode logic
              if (step === 0) {
                if (isInWindow) state = 'active';
              } else {
                // Sliding logic
                if (idx === prevWindowStart) state = 'leaving';
                else if (idx === currentWindowEnd) state = 'entering';
                else if (isInWindow) state = 'overlap';
              }
            }

            // Style mapping
            const baseStyle = "w-14 h-14 flex items-center justify-center rounded-lg text-lg font-bold border-2 transition-all duration-300 relative";
            const styles = {
              default: "border-slate-200 bg-slate-50 text-slate-400",
              active: "border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-110 z-10",
              leaving: "border-red-300 bg-red-50 text-red-400 opacity-60 scale-90",
              entering: "border-green-500 bg-green-100 text-green-700 shadow-md scale-105",
              overlap: "border-blue-300 bg-blue-50/50 text-blue-600"
            };

            return (
              <div key={idx} className={`${baseStyle} ${styles[state as keyof typeof styles]}`}>
                <span className="absolute -top-6 text-xs text-slate-400 font-mono font-normal">
                  {idx}
                </span>
                {num}
              </div>
            );
          })}
        </div>

        {/* Brackets / Indicators */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* Can add SVGs or lines here if needed, but styling boxes is usually cleaner */}
        </div>
      </div>

      {/* Logic / Formula Display */}
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
        <div className="font-mono text-sm space-y-4">
          {mode === 'brute' ? (
            <div>
              <div className="text-slate-500 mb-3 border-b border-slate-200 pb-2">
                         // <span className="text-red-600 font-bold">Brute Force:</span> Recalculating everything from scratch
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-purple-600 font-bold">current_sum</span>
                  <span>=</span>
                  {currentWindow.map((num, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span>+</span>}
                      <span className={`px-2 py-1 rounded bg-white border border-slate-200 font-bold ${
                        // Visual highlight for the overlap re-calculation
                        step > 0 && idx < currentWindow.length - 1
                          ? "text-orange-600 bg-orange-50 border-orange-200 ring-2 ring-orange-100"
                          : "text-slate-700"
                        }`}>
                        {num}
                      </span>
                    </React.Fragment>
                  ))}
                  <span>=</span>
                  <span className="font-bold text-slate-900 text-lg">{currentSum}</span>
                </div>

                {step > 0 && (
                  <div className="text-sm text-orange-600 flex items-start gap-2 bg-orange-50 p-3 rounded-md border border-orange-100">
                    <RotateCcw className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <strong>Redundant Work Detected!</strong><br />
                      We just added <span className="font-bold">{initialNums.slice(currentWindowStart, currentWindowEnd).join(" + ")}</span> again.<br />
                      We already calculated this in the previous step!
                    </div>
                  </div>
                )}

                <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <Monitor className="w-3 h-3" />
                  Operations: {k} additions performed this step.
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-slate-500 mb-3 border-b border-slate-200 pb-2">
                        // <span className="text-blue-600 font-bold">Optimized:</span> Reusing previous sum
              </div>

              {step === 0 ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">current_sum</span>
                    <span>=</span>
                    <span>{currentWindow.join(' + ')}</span>
                    <span>=</span>
                    <span className="font-bold text-slate-900">{currentSum}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    (Initial window requires full calculation)
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-lg">
                    <div className="flex items-center gap-2 opacity-50">
                      <span className="text-purple-600">old_sum</span>
                      <span className="font-mono text-slate-600">({prevSum})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">→</span>

                      <div className="flex items-center gap-1 bg-red-50 border border-red-200 px-2 py-1 rounded text-red-600 shadow-sm">
                        <span>-</span>
                        <span className="font-bold">{leavingVal}</span>
                        <span className="text-xs ml-1 opacity-70">(left)</span>
                      </div>

                      <div className="flex items-center gap-1 bg-green-50 border border-green-200 px-2 py-1 rounded text-green-700 shadow-sm">
                        <span>+</span>
                        <span className="font-bold">{enteringVal}</span>
                        <span className="text-xs ml-1 opacity-70">(right)</span>
                      </div>

                      <span>=</span>
                      <span className="font-bold text-slate-900 text-xl bg-blue-50 px-2 py-1 rounded border border-blue-100">{currentSum}</span>
                    </div>
                  </div>

                  <div className="text-sm text-green-700 bg-green-50 p-3 rounded-md border border-green-100 flex items-start gap-2">
                    <Monitor className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <strong>Efficient!</strong><br />
                      We completely ignored the middle part <span className="font-mono bg-white px-1 rounded border text-slate-500 h-5 inline-block align-middle leading-5 text-center">[{initialNums.slice(currentWindowStart, currentWindowEnd).join(", ")}]</span>.<br />
                      Only touched the edges!
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
