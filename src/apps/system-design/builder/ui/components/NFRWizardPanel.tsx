import React, { useState, useEffect } from 'react';
import { NFRWizardFlow, WizardQuestion, WizardState, ArchitectureChange } from '../../types/nfrWizard';
import { SystemGraph } from '../../types/graph';
import { ArchitectureVisualization } from './ArchitectureVisualization';

interface NFRWizardPanelProps {
  wizardFlow: NFRWizardFlow;
  systemGraph: SystemGraph;
  onArchitectureChange: (changes: ArchitectureChange[]) => void;
  onWizardComplete: (state: WizardState) => void;
}

export function NFRWizardPanel({
  wizardFlow,
  systemGraph,
  onArchitectureChange,
  onWizardComplete,
}: NFRWizardPanelProps) {
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 0,
    answers: {},
    architectureChanges: [],
    completed: false,
  });

  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Get visible questions based on showIf conditions
  const visibleQuestions = wizardFlow.questions.filter((q) => {
    if (!q.showIf) return true;
    return q.showIf(wizardState.answers);
  });

  const currentQuestion = visibleQuestions[wizardState.currentStep];
  const isLastStep = wizardState.currentStep === visibleQuestions.length - 1;
  const canProceed = currentAnswer !== null && currentAnswer !== '';

  // Handle answer submission
  const handleContinue = () => {
    if (!currentQuestion || !canProceed) return;

    // Store answer
    const newAnswers = {
      ...wizardState.answers,
      [currentQuestion.id]: currentAnswer,
    };

    // Calculate architecture changes
    let newChanges: ArchitectureChange[] = [];
    if (currentQuestion.onAnswer) {
      newChanges = currentQuestion.onAnswer(currentAnswer, newAnswers);
      onArchitectureChange(newChanges);
    }

    // Update state
    if (isLastStep) {
      const finalState: WizardState = {
        currentStep: wizardState.currentStep,
        answers: newAnswers,
        architectureChanges: [...wizardState.architectureChanges, ...newChanges],
        completed: true,
      };
      setWizardState(finalState);
      onWizardComplete(finalState);
    } else {
      setWizardState({
        currentStep: wizardState.currentStep + 1,
        answers: newAnswers,
        architectureChanges: [...wizardState.architectureChanges, ...newChanges],
        completed: false,
      });
      setCurrentAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleBack = () => {
    if (wizardState.currentStep > 0) {
      setWizardState({
        ...wizardState,
        currentStep: wizardState.currentStep - 1,
      });
      // Restore previous answer
      const prevQuestion = visibleQuestions[wizardState.currentStep - 1];
      setCurrentAnswer(wizardState.answers[prevQuestion.id] || null);
      setShowExplanation(false);
    }
  };

  const progressPercentage = ((wizardState.currentStep + 1) / visibleQuestions.length) * 100;

  if (wizardState.completed && wizardFlow.summary) {
    return (
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        {/* Summary Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-xl font-bold text-gray-900">{wizardFlow.summary.title}</h2>
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">🎯 Key Takeaways</h3>
            <ul className="space-y-2">
              {wizardFlow.summary.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {wizardFlow.summary.nextSteps && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-xs font-semibold text-blue-900 mb-2">📚 Next Steps</h3>
              <p className="text-xs text-blue-800">{wizardFlow.summary.nextSteps}</p>
            </div>
          )}

          {/* Your Answers Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-xs font-semibold text-gray-900 mb-3">Your Design Decisions</h3>
            <div className="space-y-2">
              {visibleQuestions.map((q, idx) => (
                <div key={q.id} className="text-xs">
                  <span className="font-medium text-gray-700">{q.title}:</span>
                  <span className="ml-2 text-gray-600">
                    {typeof wizardState.answers[q.id] === 'object'
                      ? JSON.stringify(wizardState.answers[q.id])
                      : wizardState.answers[q.id]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              setWizardState({
                currentStep: 0,
                answers: {},
                architectureChanges: [],
                completed: false,
              });
              setCurrentAnswer(null);
            }}
            className="w-full px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Start Over
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="w-96 bg-white border-r border-gray-200 p-6">
        <p className="text-gray-500">Loading wizard...</p>
      </div>
    );
  }

  return (
    <div className="w-96 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="mb-2">
          <span className="inline-block px-2 py-1 bg-orange-600 text-white text-xs font-bold rounded">
            NFR WIZARD
          </span>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">{wizardFlow.title}</h2>
        <p className="text-xs text-gray-600">{wizardFlow.subtitle}</p>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700">
            Step {wizardState.currentStep + 1} of {visibleQuestions.length}
          </span>
          <span className="text-xs text-gray-500">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Category Badge */}
        <div className="mb-3">
          <span
            className={`inline-block px-2 py-1 text-xs font-medium rounded ${getCategoryColor(
              currentQuestion.category
            )}`}
          >
            {getCategoryLabel(currentQuestion.category)}
          </span>
        </div>

        {/* Question Title */}
        <h3 className="text-base font-bold text-gray-900 mb-2">
          🎯 {currentQuestion.title}
        </h3>

        {/* Question Description */}
        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
          {currentQuestion.description}
        </p>

        {/* Question Input */}
        <div className="mb-4">
          {currentQuestion.questionType === 'numeric_input' && currentQuestion.numericConfig && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Your Answer:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={currentAnswer || ''}
                  onChange={(e) => setCurrentAnswer(Number(e.target.value))}
                  placeholder={currentQuestion.numericConfig.placeholder}
                  min={currentQuestion.numericConfig.min}
                  max={currentQuestion.numericConfig.max}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {currentQuestion.numericConfig.unit && (
                  <span className="text-sm text-gray-600">
                    {currentQuestion.numericConfig.unit}
                  </span>
                )}
              </div>
              {currentQuestion.numericConfig.suggestedValue && (
                <p className="mt-1 text-xs text-gray-500">
                  Typical: {currentQuestion.numericConfig.suggestedValue}{' '}
                  {currentQuestion.numericConfig.unit}
                </p>
              )}
            </div>
          )}

          {currentQuestion.questionType === 'single_choice' && currentQuestion.options && (
            <div className="space-y-2">
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setCurrentAnswer(option.id)}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    currentAnswer === option.id
                      ? 'border-orange-600 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        currentAnswer === option.id
                          ? 'border-orange-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {currentAnswer === option.id && (
                        <div className="w-2 h-2 rounded-full bg-orange-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                      )}
                      {option.consequence && currentAnswer === option.id && (
                        <div className="text-xs text-orange-700 mt-2 p-2 bg-orange-50 rounded">
                          💡 {option.consequence}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentQuestion.questionType === 'multi_choice' && currentQuestion.options && (
            <div className="space-y-2">
              {currentQuestion.options.map((option) => {
                const selected = Array.isArray(currentAnswer) && currentAnswer.includes(option.id);
                return (
                  <div
                    key={option.id}
                    onClick={() => {
                      const current = Array.isArray(currentAnswer) ? currentAnswer : [];
                      if (selected) {
                        setCurrentAnswer(current.filter((id) => id !== option.id));
                      } else {
                        setCurrentAnswer([...current, option.id]);
                      }
                    }}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selected
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center ${
                          selected ? 'border-orange-600 bg-orange-600' : 'border-gray-300'
                        }`}
                      >
                        {selected && <span className="text-white text-xs">✓</span>}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{option.label}</div>
                        {option.description && (
                          <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {currentQuestion.questionType === 'calculation' && currentQuestion.calculation && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-xs font-semibold text-blue-900 mb-2">📐 Calculation</div>
              <div className="text-sm text-blue-800 mb-3">
                {currentQuestion.calculation.explanation}
              </div>
              <div className="font-mono text-sm text-blue-900 bg-white p-3 rounded border border-blue-200">
                {currentQuestion.calculation.formula}
              </div>
              {currentQuestion.calculation.exampleInputs && (
                <div className="mt-3 text-xs text-blue-800">
                  <div className="font-medium mb-1">Example:</div>
                  <div className="space-y-1">
                    {Object.entries(currentQuestion.calculation.exampleInputs).map(
                      ([key, value]) => (
                        <div key={key}>
                          {key}: {value}
                        </div>
                      )
                    )}
                    {currentQuestion.calculation.exampleOutput && (
                      <div className="font-medium mt-2">
                        Result: {currentQuestion.calculation.exampleOutput}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <button
                onClick={() => setCurrentAnswer('understood')}
                className={`mt-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentAnswer === 'understood'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                }`}
              >
                {currentAnswer === 'understood' ? '✓ Got it!' : 'I understand'}
              </button>
            </div>
          )}

          {currentQuestion.questionType === 'decision_matrix' &&
            currentQuestion.decisionMatrix && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-gray-300 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">
                        Condition
                      </th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">
                        Recommendation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentQuestion.decisionMatrix.map((row, idx) => (
                      <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-700">{row.condition}</td>
                        <td className="px-3 py-2 text-gray-900 font-medium">
                          {row.recommendation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={() => setCurrentAnswer('reviewed')}
                  className={`mt-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentAnswer === 'reviewed'
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-orange-600 border border-orange-600 hover:bg-orange-50'
                  }`}
                >
                  {currentAnswer === 'reviewed' ? '✓ Reviewed' : 'Mark as reviewed'}
                </button>
              </div>
            )}
        </div>

        {/* Why It Matters */}
        <div className="mb-4">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-sm text-orange-600 hover:text-orange-800 font-medium flex items-center gap-1"
          >
            {showExplanation ? '▼' : '▶'} Why does this matter?
          </button>
          {showExplanation && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-900 leading-relaxed">
                {currentQuestion.whyItMatters}
              </p>
            </div>
          )}
        </div>

        {/* Common Mistakes */}
        {currentQuestion.commonMistakes && currentQuestion.commonMistakes.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-xs font-semibold text-red-900 mb-2">⚠️ Common Mistakes</div>
            <ul className="space-y-1">
              {currentQuestion.commonMistakes.map((mistake, idx) => (
                <li key={idx} className="text-xs text-red-800 flex items-start gap-2">
                  <span>•</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Architecture Visualization */}
        {wizardState.architectureChanges.length > 0 && (
          <div className="mt-4">
            <ArchitectureVisualization changes={wizardState.architectureChanges} />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
        <button
          onClick={handleContinue}
          disabled={!canProceed}
          className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
            canProceed
              ? 'bg-orange-600 text-white hover:bg-orange-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLastStep ? '✓ Complete Wizard' : 'Continue →'}
        </button>
        {wizardState.currentStep > 0 && (
          <button
            onClick={handleBack}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}

// Helper functions
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    throughput: 'bg-blue-100 text-blue-800',
    latency: 'bg-purple-100 text-purple-800',
    durability: 'bg-green-100 text-green-800',
    dataset_size: 'bg-yellow-100 text-yellow-800',
    consistency: 'bg-pink-100 text-pink-800',
    cost: 'bg-gray-100 text-gray-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    throughput: 'THROUGHPUT',
    latency: 'LATENCY',
    durability: 'DURABILITY',
    dataset_size: 'DATASET SIZE',
    consistency: 'CONSISTENCY',
    cost: 'COST',
  };
  return labels[category] || category.toUpperCase();
}
