import React from 'react';
import { GuidedTutorial, GuidedTutorialProgress } from '../../../types/guidedTutorial';

interface StepProgressIndicatorProps {
  tutorial: GuidedTutorial;
  progress: GuidedTutorialProgress;
  onStepClick?: (stepIndex: number) => void;
}

export function StepProgressIndicator({
  tutorial,
  progress,
  onStepClick,
}: StepProgressIndicatorProps) {
  const { steps } = tutorial;
  const { currentStepIndex, completedStepIds } = progress;

  return (
    <div className="flex items-center justify-center gap-1 py-3">
      {steps.map((step, index) => {
        const isCompleted = completedStepIds.includes(step.id);
        const isCurrent = index === currentStepIndex;
        const isPast = index < currentStepIndex;
        const canNavigate = isPast || isCompleted;

        return (
          <React.Fragment key={step.id}>
            {/* Step circle */}
            <button
              onClick={() => canNavigate && onStepClick?.(index)}
              disabled={!canNavigate}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                transition-all duration-200
                ${isCompleted
                  ? 'bg-green-500 text-white'
                  : isCurrent
                    ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                    : 'bg-gray-200 text-gray-500'
                }
                ${canNavigate ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
              `}
              title={`Step ${index + 1}: ${(step.practicePhase?.frText || step.teaching?.frText || '').slice(0, 50)}...`}
            >
              {isCompleted ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </button>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  w-6 h-1 rounded
                  ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/**
 * Compact version for smaller spaces
 */
export function StepProgressIndicatorCompact({
  tutorial,
  progress,
}: Omit<StepProgressIndicatorProps, 'onStepClick'>) {
  const completedCount = progress.completedStepIds.length;
  const totalSteps = tutorial.totalSteps;
  const percentage = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="flex items-center gap-3">
      {/* Progress bar */}
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step count */}
      <span className="text-sm font-medium text-gray-600">
        {completedCount}/{totalSteps}
      </span>
    </div>
  );
}
