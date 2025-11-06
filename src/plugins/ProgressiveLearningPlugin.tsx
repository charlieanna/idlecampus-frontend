/**
 * Progressive Learning Plugin
 *
 * Enables Docker-style step-by-step command practice with:
 * - Progressive reveal of commands
 * - Command validation with hints
 * - Step-by-step guidance
 *
 * Corresponds to backend: progressive_learning_plugin.rb
 */

import { useState } from 'react';
import { ChevronRight, CheckCircle, HelpCircle } from 'lucide-react';

export interface ProgressiveLearningPluginProps {
  courseSlug: string;
  enabled?: boolean;
  validation_strict?: boolean;
  hints_enabled?: boolean;
}

export default function ProgressiveLearningPlugin({
  courseSlug,
  enabled = true,
  validation_strict = true,
  hints_enabled = true
}: ProgressiveLearningPluginProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);

  if (!enabled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-900 flex items-center">
          <ChevronRight className="w-4 h-4 mr-1 text-blue-600" />
          Progressive Learning
        </h3>
        <span className="text-xs text-slate-500">
          Step {currentStep + 1}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-start">
          <CheckCircle className={`w-4 h-4 mr-2 mt-0.5 ${completed.includes(currentStep) ? 'text-green-600' : 'text-slate-300'}`} />
          <div className="flex-1">
            <p className="text-sm text-slate-700">
              Follow the instructions to complete each step
            </p>
            {hints_enabled && (
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center mt-1"
              >
                <HelpCircle className="w-3 h-3 mr-1" />
                {showHint ? 'Hide' : 'Show'} Hint
              </button>
            )}
            {showHint && (
              <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-slate-600">
                Complete the command in the terminal on the right
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{completed.length} steps completed</span>
          <span className="text-blue-600 font-medium">
            {validation_strict ? 'Strict Mode' : 'Guided Mode'}
          </span>
        </div>
      </div>
    </div>
  );
}
