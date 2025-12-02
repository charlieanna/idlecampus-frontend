import { StepPhase } from '../../../types/guidedTutorial';

interface PhaseIndicatorProps {
  currentPhase: StepPhase;
  currentStep: number;
  totalSteps: number;
}

export function PhaseIndicator({
  currentPhase,
  currentStep,
  totalSteps,
}: PhaseIndicatorProps) {
  const isLearnActive = currentPhase === 'learn';
  const isPracticeActive = currentPhase === 'practice';

  return (
    <div className="flex items-center justify-between mb-4 px-1">
      {/* Step counter */}
      <span className="text-sm font-medium text-gray-600">
        Step {currentStep} of {totalSteps}
      </span>

      {/* Phase pills */}
      <div className="flex items-center gap-2">
        {/* Learn pill */}
        <span
          className={`
            px-3 py-1 text-xs font-medium rounded-full transition-all duration-200
            ${isLearnActive
              ? 'bg-blue-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-500'
            }
          `}
        >
          📖 Learn
        </span>

        {/* Arrow */}
        <svg
          className={`w-4 h-4 ${isPracticeActive ? 'text-green-500' : 'text-gray-300'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>

        {/* Practice pill */}
        <span
          className={`
            px-3 py-1 text-xs font-medium rounded-full transition-all duration-200
            ${isPracticeActive
              ? 'bg-green-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-500'
            }
          `}
        >
          🛠️ Practice
        </span>
      </div>
    </div>
  );
}
