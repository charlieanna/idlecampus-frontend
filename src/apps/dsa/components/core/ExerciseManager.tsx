import React, { useCallback } from 'react';
import { CodeEditor } from './CodeEditor';
import { useExerciseState } from '../../hooks/useExerciseState';

/**
 * Centralized ExerciseManager component
 * Manages all exercise behavior: hints, solutions, completion, auto-scroll, Next button
 * Used by all modules to ensure consistent UX
 */

export interface ExerciseManagerProps {
  // Exercise identification
  exerciseId: string;
  exerciseType: 'practice' | 'exercise' | 'problem';

  // Exercise content
  title: string;
  instruction?: string;
  starterCode: string;
  solution?: string | { text?: string; code?: string };
  hints?: Array<{ title?: string; content?: string; text?: string }>;
  testCases?: Array<any>;
  targetComplexity?: { time: string; space: string };

  // Callbacks
  onRun: (code: string, complexity?: { time: string; space: string }) => Promise<{ success: boolean; output: string; error?: string; complexityFeedback?: any }>;
  onComplete: (exerciseId: string) => void;
  onNextLesson?: () => void;

  // Display options
  showNextButton?: boolean;
  readOnly?: boolean;
  language?: 'javascript' | 'python';

  // Utility function for rendering styled text
  renderStyledText?: (text: string, allowMarkdown?: boolean) => React.ReactNode;
}

export default function ExerciseManager({
  exerciseId,
  exerciseType,
  title,
  instruction,
  starterCode,
  solution,
  hints = [],
  testCases,
  targetComplexity,
  onRun,
  onComplete,
  onNextLesson,
  showNextButton = false,
  readOnly = false,
  language = 'python',
  renderStyledText
}: ExerciseManagerProps) {
  // Ensure targetComplexity always has a value for complexity validation
  const effectiveTargetComplexity = targetComplexity || { time: 'O(n)', space: 'O(1)' };
  const {
    hintsShown,
    solutionShown,
    isCompleted,
    attempts,
    showNextHint,
    showSolution,
    markCompleted,
    recordAttempt,
    scrollToHints,
    scrollToSolution
  } = useExerciseState(exerciseId);

  // Handle hint request from CodeEditor
  const handleHintRequest = useCallback(() => {
    showNextHint();
    scrollToHints(exerciseId);
  }, [exerciseId, showNextHint, scrollToHints]);

  // Handle solution request from CodeEditor
  const handleSolutionRequest = useCallback(() => {
    showSolution();
    scrollToSolution(exerciseId);
  }, [exerciseId, showSolution, scrollToSolution]);

  // Handle code execution
  const handleRun = useCallback(async (code: string, complexity?: { time: string; space: string }) => {
    recordAttempt();
    const result = await onRun(code, complexity);

    // If successful, mark as completed
    if (result.success) {
      markCompleted();
      onComplete(exerciseId);
      scrollToSolution(exerciseId);
    }

    return result;
  }, [exerciseId, onRun, onComplete, recordAttempt, markCompleted, scrollToSolution]);

  // Extract solution text
  const solutionText = typeof solution === 'string' ? solution : (solution?.code || solution?.text);

  // Render styled text helper (fallback if not provided)
  const renderText = (text: string) => {
    if (renderStyledText) {
      return renderStyledText(text, true);
    }
    // Simple fallback: render as-is with line breaks
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Code Editor */}
      <div className="flex-1 min-h-0">
        <CodeEditor
          key={`exercise-${exerciseId}`}
          initialCode={starterCode}
          onRun={handleRun}
          language={language}
          solution={solutionText}
          requireComplexity={true}
          targetComplexity={effectiveTargetComplexity}
          onHintRequest={handleHintRequest}
          readOnly={readOnly}
        />
      </div>

      {/* Hints and Solution Panel (shown when user requests hints or completes exercise) */}
      {(hintsShown > 0 || isCompleted) && (
        <div className="border-t bg-green-50 border-green-200" data-hints-section={exerciseId}>
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-green-900">
                💡 {isCompleted ? 'Solution Explanation' : 'Hints'}
              </h3>
            </div>

            <div className="space-y-3">
              {/* Show progressive hints */}
              {hints.slice(0, isCompleted ? hints.length : hintsShown).map((hint, idx) => (
                <div key={idx} className="bg-white border border-green-300 rounded p-4">
                  <p className="text-slate-600 text-sm font-medium mb-2">
                    {hint.title || `Hint #${idx + 1}`}
                  </p>
                  <div className="text-slate-800">
                    {renderText(hint.content || hint.text || '')}
                  </div>
                </div>
              ))}

              {/* Show solution when completed */}
              {isCompleted && solutionText && (
                <div className="bg-blue-50 border border-blue-300 rounded p-4" data-solution-section={exerciseId}>
                  <p className="text-slate-600 text-sm font-medium mb-2">
                    ✅ Complete Solution
                  </p>
                  <div className="text-slate-800">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
                      <code>{solutionText}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Next Lesson button when completed */}
              {isCompleted && showNextButton && onNextLesson && (
                <button
                  onClick={() => {
                    onNextLesson();
                    // Scroll to top of next lesson
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      const scrollContainers = document.querySelectorAll('.overflow-y-auto');
                      scrollContainers.forEach(container => {
                        container.scrollTop = 0;
                      });
                    }, 300);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Next Lesson →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
