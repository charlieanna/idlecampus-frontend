import { useState, useEffect } from 'react';
import {
  GuidedTutorial,
  GuidedTutorialProgress,
  StepValidationResult,
  StepPhase,
} from '../../../types/guidedTutorial';
import { LearnPhasePanel } from './LearnPhasePanel';
import { PracticePhasePanel } from './PracticePhasePanel';
import { PhaseIndicator } from './PhaseIndicator';
import { StepProgressIndicator, StepProgressIndicatorCompact } from './StepProgressIndicator';
import { HintSystem } from './HintSystem';
import { StepValidationFeedback } from './StepValidationFeedback';

interface GuidedTeachingPanelProps {
  tutorial: GuidedTutorial;
  progress: GuidedTutorialProgress;
  validationResult: StepValidationResult | null;
  isValidating: boolean;
  onCheckDesign: () => void;
  onNextStep: () => void;
  onGoToStep: (stepIndex: number) => void;
  onRequestHint: () => void;
  onShowSolution: () => void;
  isTutorialComplete: boolean;
  // Phase control
  onPhaseChange?: (phase: StepPhase) => void;
  onQuizAnswer?: (stepId: string, selectedIndex: number, correct: boolean) => void;
}

/**
 * GuidedTeachingPanel - Main container for the guided tutorial
 *
 * Orchestrates between LearnPhasePanel and PracticePhasePanel based on current phase.
 * Supports both new phase-based tutorials and legacy tutorials for backward compatibility.
 */
export function GuidedTeachingPanel({
  tutorial,
  progress,
  validationResult,
  isValidating,
  onCheckDesign,
  onNextStep,
  onGoToStep,
  onRequestHint,
  onShowSolution,
  isTutorialComplete,
  onPhaseChange,
  onQuizAnswer,
}: GuidedTeachingPanelProps) {
  const currentStep = tutorial.steps[progress.currentStepIndex];
  const currentPhase = progress.currentPhase || 'practice'; // Default to practice for legacy

  // Transition animation state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedPhase, setDisplayedPhase] = useState<StepPhase>(currentPhase);

  // Handle phase transition with animation
  useEffect(() => {
    if (currentPhase !== displayedPhase) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayedPhase(currentPhase);
        setIsTransitioning(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentPhase, displayedPhase]);

  if (!currentStep) {
    return (
      <div className="w-96 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <div className="text-center text-gray-500">No steps available</div>
      </div>
    );
  }

  // Check if this step has the new phase-based content
  const hasLearnPhase = currentStep.learnPhase && currentStep.learnPhase.conceptTitle;

  // If we have new phase-based content, render phase panels
  if (hasLearnPhase) {
    return (
      <div className="w-96 border-r border-gray-200 flex flex-col h-full">
        {/* Step Progress Header */}
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-900">{tutorial.problemTitle}</h3>
            <StepProgressIndicatorCompact tutorial={tutorial} progress={progress} />
          </div>
          {/* Clickable step indicators */}
          <StepProgressIndicator
            tutorial={tutorial}
            progress={progress}
            onStepClick={onGoToStep}
          />
          {/* Phase indicator showing Learn → Practice */}
          <PhaseIndicator
            currentPhase={currentPhase}
            currentStep={currentStep.stepNumber}
            totalSteps={tutorial.totalSteps}
          />
        </div>

        {/* Phase Content with transition animation */}
        <div
          className={`
            flex-1 overflow-hidden
            transition-opacity duration-150 ease-in-out
            ${isTransitioning ? 'opacity-0' : 'opacity-100'}
          `}
        >
          {displayedPhase === 'learn' ? (
            <LearnPhasePanel
              stepNumber={currentStep.stepNumber}
              totalSteps={tutorial.totalSteps}
              teaching={currentStep.learnPhase}
              onContinueToPractice={() => onPhaseChange?.('practice')}
              onQuizAnswer={(selectedIndex, correct) =>
                onQuizAnswer?.(currentStep.id, selectedIndex, correct)
              }
            />
          ) : (
            <PracticePhasePanel
              step={currentStep}
              progress={progress}
              validationResult={validationResult}
              isValidating={isValidating}
              isTutorialComplete={isTutorialComplete}
              onCheckDesign={onCheckDesign}
              onNextStep={onNextStep}
              onRequestHint={onRequestHint}
              onShowSolution={onShowSolution}
              onBackToLearn={() => onPhaseChange?.('learn')}
            />
          )}
        </div>
      </div>
    );
  }

  // Legacy mode: Use the old teaching field
  const teaching = currentStep.teaching;
  const attemptCount = progress.attemptCounts[currentStep.id] || 0;

  if (!teaching) {
    return (
      <div className="w-96 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <div className="text-center text-gray-500">No teaching content available</div>
      </div>
    );
  }

  return (
    <div className="w-96 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900">{tutorial.problemTitle}</h2>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
            Step {currentStep.stepNumber}/{tutorial.totalSteps}
          </span>
        </div>

        {/* Progress indicator */}
        <StepProgressIndicatorCompact tutorial={tutorial} progress={progress} />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Tutorial Complete State */}
        {isTutorialComplete && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎉</span>
              <h3 className="font-semibold text-green-800">Tutorial Complete!</h3>
            </div>
            <p className="text-sm text-green-700">
              Great job! You've completed the guided tutorial.
              You can now try "Solve on Your Own" mode or review any step.
            </p>
          </div>
        )}

        {/* Step Progress Visual */}
        {!isTutorialComplete && (
          <div className="bg-gray-50 rounded-lg p-3">
            <StepProgressIndicator
              tutorial={tutorial}
              progress={progress}
              onStepClick={onGoToStep}
            />
          </div>
        )}

        {/* Current Functional Requirement */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
            Functional Requirement
          </h3>
          <p className="text-sm font-medium text-gray-900">{teaching.frText}</p>
        </div>

        {/* Concept Explanation */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-1">
            <span>💡</span> Why This Matters
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {teaching.conceptExplanation}
          </p>
        </div>

        {/* Components Needed */}
        {teaching.componentsNeeded.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-1">
              <span>🧩</span> Components to Add
            </h3>
            <div className="space-y-2">
              {teaching.componentsNeeded.map((comp, idx) => (
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
          </div>
        )}

        {/* Connections Needed */}
        {teaching.connectionsNeeded.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-1">
              <span>🔗</span> Connections to Make
            </h3>
            <div className="space-y-2">
              {teaching.connectionsNeeded.map((conn, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm"
                >
                  <span className="font-medium text-gray-700">{conn.from}</span>
                  <span className="text-blue-500">→</span>
                  <span className="font-medium text-gray-700">{conn.to}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hint System */}
        <HintSystem
          step={currentStep}
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
            className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue to Next Step</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button
            onClick={onCheckDesign}
            disabled={isValidating}
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isValidating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
    'compute': '🖥️',
    'app_server': '🖥️',
    'storage': '💾',
    'postgresql': '💾',
    'database': '💾',
    'cache': '💨',
    'redis': '💨',
    'object_storage': '📦',
    's3': '📦',
    'cdn': '🌐',
    'load_balancer': '⚖️',
    'message_queue': '📬',
    'realtime_messaging': '⚡',
  };

  return (
    <span className="text-xl flex-shrink-0" role="img" aria-label={type}>
      {icons[type] || '🔷'}
    </span>
  );
}
