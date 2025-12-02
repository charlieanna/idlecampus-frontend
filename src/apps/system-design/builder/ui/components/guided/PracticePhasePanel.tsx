import { GuidedStep, GuidedTutorialProgress, StepValidationResult } from '../../../types/guidedTutorial';
import { HintSystem } from './HintSystem';
import { StepValidationFeedback } from './StepValidationFeedback';

interface PracticePhasePanelProps {
  step: GuidedStep;
  progress: GuidedTutorialProgress;
  validationResult: StepValidationResult | null;
  isValidating: boolean;
  isTutorialComplete: boolean;
  onCheckDesign: () => void;
  onNextStep: () => void;
  onRequestHint: () => void;
  onShowSolution: () => void;
  onBackToLearn: () => void;
}

/**
 * PracticePhasePanel - The "SOLVE" phase of the guided tutorial
 *
 * Shows:
 * - The task to complete (FR)
 * - Success criteria
 * - Component/connection hints
 * - Validation results
 * - 3-tier hint system
 */
export function PracticePhasePanel({
  step,
  progress,
  validationResult,
  isValidating,
  isTutorialComplete,
  onCheckDesign,
  onNextStep,
  onRequestHint,
  onShowSolution,
  onBackToLearn,
}: PracticePhasePanelProps) {
  const attemptCount = progress.attemptCounts[step.id] || 0;
  const { practicePhase } = step;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium opacity-80">
            Step {step.stepNumber}
          </span>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
            Practice Phase
          </span>
        </div>
        <h2 className="text-lg font-bold">Now it's your turn!</h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Tutorial Complete State */}
        {isTutorialComplete && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎉</span>
              <h3 className="font-semibold text-green-800">
                Tutorial Complete!
              </h3>
            </div>
            <p className="text-sm text-green-700">
              Great job! You've completed the guided tutorial. You can now try
              "Solve on Your Own" mode or review any step.
            </p>
          </div>
        )}

        {/* Back to Learn Link */}
        <button
          onClick={onBackToLearn}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 17l-5-5m0 0l5-5m-5 5h12"
            />
          </svg>
          Review the concept again
        </button>

        {/* Task Description */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">
            Your Task
          </h3>
          <p className="text-sm font-medium text-gray-900 mb-3">
            {practicePhase.frText}
          </p>
          <p className="text-sm text-gray-700">{practicePhase.taskDescription}</p>
        </section>

        {/* Success Criteria */}
        {practicePhase.successCriteria.length > 0 && (
          <section className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-1">
              <span>🎯</span> Success Criteria
            </h3>
            <ul className="space-y-2">
              {practicePhase.successCriteria.map((criteria, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{criteria}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Components Needed */}
        {practicePhase.componentsNeeded.length > 0 && (
          <section className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-1">
              <span>🧩</span> Components to Add
            </h3>
            <div className="space-y-2">
              {practicePhase.componentsNeeded.map((comp, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg"
                >
                  <ComponentIcon type={comp.type} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      {comp.displayName}
                    </div>
                    <div className="text-xs text-gray-600">{comp.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Connections Needed */}
        {practicePhase.connectionsNeeded.length > 0 && (
          <section className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-1">
              <span>🔗</span> Connections to Make
            </h3>
            <div className="space-y-2">
              {practicePhase.connectionsNeeded.map((conn, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm"
                >
                  <span className="font-medium text-gray-700">{conn.from}</span>
                  <span className="text-green-500">→</span>
                  <span className="font-medium text-gray-700">{conn.to}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hint System */}
        <HintSystem
          step={step}
          hintLevel={progress.hintLevel}
          attemptCount={attemptCount}
          onRequestHint={onRequestHint}
          onShowSolution={onShowSolution}
        />

        {/* Validation Feedback */}
        {validationResult && (
          <StepValidationFeedback
            result={validationResult}
            isValidating={isValidating}
          />
        )}
      </div>

      {/* Footer with action button */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        {validationResult?.passed && !isTutorialComplete ? (
          <button
            onClick={onNextStep}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/25"
          >
            <span>Continue to Next Step</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={onCheckDesign}
            disabled={isValidating}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 disabled:shadow-none"
          >
            {isValidating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Check My Design</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Component icon based on type
 */
function ComponentIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    compute: '🖥️',
    app_server: '🖥️',
    storage: '💾',
    postgresql: '💾',
    database: '💾',
    cache: '💨',
    redis: '💨',
    object_storage: '📦',
    s3: '📦',
    cdn: '🌐',
    load_balancer: '⚖️',
    message_queue: '📬',
    realtime_messaging: '⚡',
  };

  return (
    <span className="text-xl flex-shrink-0" role="img" aria-label={type}>
      {icons[type] || '🔷'}
    </span>
  );
}
