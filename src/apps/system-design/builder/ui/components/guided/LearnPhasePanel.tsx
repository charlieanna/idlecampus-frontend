import { useState } from 'react';
import { TeachingContent } from '../../../types/guidedTutorial';

interface LearnPhasePanelProps {
  stepNumber: number;
  totalSteps: number;
  teaching: TeachingContent;
  onContinueToPractice: () => void;
  onQuizAnswer?: (selectedIndex: number, correct: boolean) => void;
}

/**
 * LearnPhasePanel - The "TEACH" phase of the guided tutorial
 *
 * Shows rich educational content including:
 * - Concept explanation
 * - Why it matters
 * - Real-world examples
 * - Key points
 * - Diagrams
 * - Quick quiz
 */
export function LearnPhasePanel({
  stepNumber,
  totalSteps,
  teaching,
  onContinueToPractice,
  onQuizAnswer,
}: LearnPhasePanelProps) {
  const [quizState, setQuizState] = useState<{
    selectedIndex: number | null;
    submitted: boolean;
  }>({ selectedIndex: null, submitted: false });

  const handleQuizSubmit = () => {
    if (quizState.selectedIndex === null || !teaching.quickCheck) return;

    const correct = quizState.selectedIndex === teaching.quickCheck.correctIndex;
    setQuizState((prev) => ({ ...prev, submitted: true }));
    onQuizAnswer?.(quizState.selectedIndex, correct);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium opacity-80">
            Step {stepNumber} of {totalSteps}
          </span>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
            Learn Phase
          </span>
        </div>
        <h2 className="text-xl font-bold">{teaching.conceptTitle}</h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Concept Explanation */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {teaching.conceptExplanation}
            </p>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="bg-amber-50 rounded-xl p-5 border border-amber-100">
          <h3 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <span className="text-lg">💡</span>
            Why This Matters
          </h3>
          <p className="text-sm text-amber-900 leading-relaxed">
            {teaching.whyItMatters}
          </p>
        </section>

        {/* Real World Example */}
        {teaching.realWorldExample && (
          <section className="bg-purple-50 rounded-xl p-5 border border-purple-100">
            <h3 className="text-sm font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <span className="text-lg">🏢</span>
              Real-World Example: {teaching.realWorldExample.company}
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-purple-900">
                <strong>Scenario:</strong> {teaching.realWorldExample.scenario}
              </p>
              <p className="text-sm text-purple-900">
                <strong>How they do it:</strong>{' '}
                {teaching.realWorldExample.howTheyDoIt}
              </p>
            </div>
          </section>
        )}

        {/* Diagram */}
        {teaching.diagram && (
          <section className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-lg">📊</span>
              Architecture Diagram
            </h3>
            <pre className="text-xs bg-white p-4 rounded-lg overflow-x-auto font-mono text-gray-700 border border-gray-200">
              {teaching.diagram}
            </pre>
          </section>
        )}

        {/* Key Points */}
        <section className="bg-green-50 rounded-xl p-5 border border-green-100">
          <h3 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
            <span className="text-lg">✅</span>
            Key Points to Remember
          </h3>
          <ul className="space-y-2">
            {teaching.keyPoints.map((point, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-green-900"
              >
                <span className="text-green-600 font-bold mt-0.5">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Key Concepts */}
        {teaching.keyConcepts && teaching.keyConcepts.length > 0 && (
          <section className="bg-blue-50 rounded-xl p-5 border border-blue-100">
            <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <span className="text-lg">🔑</span>
              Key Concepts
            </h3>
            <div className="space-y-3">
              {teaching.keyConcepts.map((concept, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    {concept.icon && <span>{concept.icon}</span>}
                    <span className="font-medium text-blue-900">
                      {concept.title}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800">{concept.explanation}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Common Mistakes */}
        {teaching.commonMistakes && teaching.commonMistakes.length > 0 && (
          <section className="bg-red-50 rounded-xl p-5 border border-red-100">
            <h3 className="text-sm font-semibold text-red-800 mb-3 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              Common Mistakes to Avoid
            </h3>
            <div className="space-y-3">
              {teaching.commonMistakes.map((mistake, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 border border-red-100">
                  <p className="text-sm text-red-700 mb-1">
                    <strong>Mistake:</strong> {mistake.mistake}
                  </p>
                  <p className="text-sm text-red-600 mb-1">
                    <strong>Why it's wrong:</strong> {mistake.why}
                  </p>
                  <p className="text-sm text-green-700">
                    <strong>Instead:</strong> {mistake.correct}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interview Tip */}
        {teaching.interviewTip && (
          <section className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
            <h3 className="text-sm font-semibold text-indigo-800 mb-2 flex items-center gap-2">
              <span className="text-lg">🎯</span>
              Interview Tip
            </h3>
            <p className="text-sm text-indigo-900 italic">
              "{teaching.interviewTip}"
            </p>
          </section>
        )}

        {/* Quick Quiz */}
        {teaching.quickCheck && (
          <section className="bg-orange-50 rounded-xl p-5 border border-orange-100">
            <h3 className="text-sm font-semibold text-orange-800 mb-3 flex items-center gap-2">
              <span className="text-lg">🧠</span>
              Quick Check
            </h3>
            <p className="text-sm text-orange-900 mb-4">
              {teaching.quickCheck.question}
            </p>
            <div className="space-y-2">
              {teaching.quickCheck.options.map((option, idx) => {
                const isSelected = quizState.selectedIndex === idx;
                const isCorrect = idx === teaching.quickCheck!.correctIndex;
                const showResult = quizState.submitted;

                let bgClass = 'bg-white hover:bg-orange-100';
                let borderClass = 'border-orange-200';

                if (showResult) {
                  if (isCorrect) {
                    bgClass = 'bg-green-100';
                    borderClass = 'border-green-400';
                  } else if (isSelected && !isCorrect) {
                    bgClass = 'bg-red-100';
                    borderClass = 'border-red-400';
                  }
                } else if (isSelected) {
                  bgClass = 'bg-orange-100';
                  borderClass = 'border-orange-400';
                }

                return (
                  <button
                    key={idx}
                    onClick={() =>
                      !quizState.submitted &&
                      setQuizState({ selectedIndex: idx, submitted: false })
                    }
                    disabled={quizState.submitted}
                    className={`w-full text-left p-3 rounded-lg border ${borderClass} ${bgClass} transition-colors text-sm`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                          isSelected
                            ? 'border-orange-500 bg-orange-500 text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-gray-800">{option}</span>
                      {showResult && isCorrect && (
                        <span className="ml-auto text-green-600">✓</span>
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <span className="ml-auto text-red-600">✗</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quiz Submit / Result */}
            {!quizState.submitted ? (
              <button
                onClick={handleQuizSubmit}
                disabled={quizState.selectedIndex === null}
                className="mt-4 w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                Check Answer
              </button>
            ) : (
              <div
                className={`mt-4 p-3 rounded-lg ${
                  quizState.selectedIndex === teaching.quickCheck.correctIndex
                    ? 'bg-green-100 border border-green-300'
                    : 'bg-red-100 border border-red-300'
                }`}
              >
                <p
                  className={`text-sm ${
                    quizState.selectedIndex === teaching.quickCheck.correctIndex
                      ? 'text-green-800'
                      : 'text-red-800'
                  }`}
                >
                  {quizState.selectedIndex === teaching.quickCheck.correctIndex
                    ? '✓ Correct!'
                    : '✗ Not quite.'}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {teaching.quickCheck.explanation}
                </p>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Footer - Continue Button */}
      <div className="p-4 bg-white border-t border-gray-200">
        <button
          onClick={onContinueToPractice}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
        >
          <span>I understand, let's practice!</span>
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
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
