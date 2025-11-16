/**
 * LessonPlayer Component
 *
 * Interactive lesson player that guides users through DDIA concepts
 * with theory, simulations, break scenarios, and trade-off decisions.
 */

import { useState } from 'react';
import {
  Lesson,
  LessonStep,
  TradeoffOption,
  BreakScenario,
  SimulationStep,
} from '../../types/lesson';

// Simple markdown renderer (no external dependencies)
function renderMarkdown(text: string): JSX.Element {
  const lines = text.trim().split('\n');
  const elements: JSX.Element[] = [];
  let currentList: string[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 ml-4 my-2">
          {currentList.map((item, i) => (
            <li key={i} className="text-gray-700">{formatInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const formatInlineMarkdown = (text: string): (string | JSX.Element)[] => {
    // Handle bold, italic, code
    const parts: (string | JSX.Element)[] = [];
    let remaining = text;
    let keyIdx = 0;

    // Match patterns: **bold**, *italic*, `code`
    const patterns = [
      { regex: /\*\*(.+?)\*\*/g, render: (m: string) => <strong key={keyIdx++}>{m}</strong> },
      { regex: /\*(.+?)\*/g, render: (m: string) => <em key={keyIdx++}>{m}</em> },
      { regex: /`(.+?)`/g, render: (m: string) => <code key={keyIdx++} className="bg-gray-100 px-1 rounded text-sm">{m}</code> },
    ];

    // Simple approach: process text sequentially
    let result: (string | JSX.Element)[] = [remaining];

    for (const pattern of patterns) {
      const newResult: (string | JSX.Element)[] = [];
      for (const part of result) {
        if (typeof part === 'string') {
          const segments = part.split(pattern.regex);
          const matches = part.match(pattern.regex) || [];
          let matchIdx = 0;

          for (let i = 0; i < segments.length; i++) {
            if (segments[i]) newResult.push(segments[i]);
            if (matchIdx < matches.length && i < segments.length - 1) {
              const matchText = matches[matchIdx].replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '');
              newResult.push(pattern.render(matchText));
              matchIdx++;
            }
          }
        } else {
          newResult.push(part);
        }
      }
      result = newResult;
    }

    return result;
  };

  lines.forEach((line, i) => {
    // Code block handling
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${elements.length}`} className="bg-gray-900 text-green-400 p-4 rounded-lg my-3 overflow-x-auto">
            <code>{codeContent.join('\n')}</code>
          </pre>
        );
        codeContent = [];
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }

    // List items
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      currentList.push(line.trim().substring(2));
      return;
    }

    // Numbered lists
    if (/^\d+\.\s/.test(line.trim())) {
      flushList();
      const content = line.trim().replace(/^\d+\.\s/, '');
      elements.push(
        <p key={i} className="text-gray-700 my-1 ml-4">
          {line.trim().match(/^\d+\./)?.[0]} {formatInlineMarkdown(content)}
        </p>
      );
      return;
    }

    flushList();

    // Headers
    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-2xl font-bold text-gray-900 mt-6 mb-3">{formatInlineMarkdown(line.substring(2))}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-xl font-semibold text-gray-900 mt-5 mb-2">{formatInlineMarkdown(line.substring(3))}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-lg font-semibold text-gray-900 mt-4 mb-2">{formatInlineMarkdown(line.substring(4))}</h3>);
    } else if (line.trim()) {
      elements.push(<p key={i} className="text-gray-700 my-2">{formatInlineMarkdown(line)}</p>);
    }
  });

  flushList();

  return <>{elements}</>;
}

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete?: () => void;
  onExit?: () => void;
}

export function LessonPlayer({ lesson, onComplete, onExit }: LessonPlayerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [showDecisionExplanation, setShowDecisionExplanation] = useState(false);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any[]>([]);
  const [breakScenarioRevealed, setBreakScenarioRevealed] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const currentStep = lesson.steps[currentStepIndex];
  const isLastStep = currentStepIndex === lesson.steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.();
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
      // Reset state for new step
      setSelectedDecision(null);
      setShowDecisionExplanation(false);
      setSimulationResults([]);
      setBreakScenarioRevealed(false);
      setUserAnswer('');
      setShowCorrectAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const runSimulation = async (steps: SimulationStep[]) => {
    setSimulationRunning(true);
    setSimulationResults([]);

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSimulationResults(prev => [...prev, steps[i]]);
    }

    setSimulationRunning(false);
  };

  const renderStepContent = () => {
    switch (currentStep.type) {
      case 'theory':
        return renderTheoryStep();
      case 'demo':
        return renderDemoStep();
      case 'simulate':
        return renderSimulateStep();
      case 'break':
        return renderBreakStep();
      case 'decision':
        return renderDecisionStep();
      case 'summary':
        return renderSummaryStep();
      default:
        return <div>Unknown step type</div>;
    }
  };

  const renderTheoryStep = () => {
    const content = currentStep.theoryContent;
    if (!content) return null;

    return (
      <div className="space-y-6">
        {/* Main explanation */}
        <div className="max-w-none">
          {renderMarkdown(content.explanation)}
        </div>

        {/* Key points */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Key Points</h4>
          <ul className="space-y-2">
            {content.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-blue-800">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* DDIA Reference */}
        {content.ddiaReference && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📖</span>
              <h4 className="font-semibold text-amber-900">DDIA Reference</h4>
            </div>
            <div className="text-sm text-amber-800">
              <p>
                <strong>Chapter {content.ddiaReference.chapter}:</strong>{' '}
                {content.ddiaReference.title}
              </p>
              {content.ddiaReference.section && (
                <p>
                  <strong>Section:</strong> {content.ddiaReference.section}
                </p>
              )}
              {content.ddiaReference.pageRange && (
                <p>
                  <strong>Pages:</strong> {content.ddiaReference.pageRange}
                </p>
              )}
              {content.ddiaReference.keyQuote && (
                <blockquote className="mt-2 italic border-l-4 border-amber-300 pl-3">
                  "{content.ddiaReference.keyQuote}"
                </blockquote>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDemoStep = () => {
    const content = currentStep.demoContent;
    if (!content) return null;

    return (
      <div className="space-y-6">
        <div className="max-w-none">
          {renderMarkdown(content.description)}
        </div>

        {/* System Graph Visualization (simplified) */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">System Architecture</h4>
          <div className="flex flex-col items-center gap-4">
            {content.initialGraph.components.map(comp => (
              <div
                key={comp.id}
                className={`px-4 py-2 rounded-lg border-2 ${
                  content.highlightComponents?.includes(comp.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <div className="font-medium text-gray-900">{comp.type.replace('_', ' ')}</div>
                <div className="text-xs text-gray-500">{comp.id}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            {content.initialGraph.connections.map((conn, i) => (
              <span key={i}>
                {conn.from} → {conn.to}
                {i < content.initialGraph.connections.length - 1 ? ' | ' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSimulateStep = () => {
    const content = currentStep.simulateContent;
    if (!content) return null;

    return (
      <div className="space-y-6">
        <div className="max-w-none">
          {renderMarkdown(content.description)}
        </div>

        {/* Simulation Controls */}
        <div className="flex justify-center">
          <button
            onClick={() => runSimulation(content.steps)}
            disabled={simulationRunning}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
          >
            {simulationRunning ? 'Running Simulation...' : 'Run Traffic Simulation'}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {simulationResults.map((result, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border-2 ${
                result.expectedOutcome.type === 'success'
                  ? 'border-green-500 bg-green-50'
                  : result.expectedOutcome.type === 'degraded'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-red-500 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold">{result.description}</h5>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    result.expectedOutcome.type === 'success'
                      ? 'bg-green-200 text-green-800'
                      : result.expectedOutcome.type === 'degraded'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-red-200 text-red-800'
                  }`}
                >
                  {result.expectedOutcome.type.toUpperCase()}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium">{result.expectedOutcome.metric}</p>
                <p className="text-gray-600 mt-1">{result.expectedOutcome.explanation}</p>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Traffic: {result.traffic.totalRps} RPS ({Math.round(result.traffic.readRatio * 100)}%
                reads)
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBreakStep = () => {
    const content = currentStep.breakContent;
    if (!content) return null;

    return (
      <div className="space-y-6">
        <div className="max-w-none">
          {renderMarkdown(content.description)}
        </div>

        {/* Reveal Break Scenario */}
        {!breakScenarioRevealed ? (
          <div className="flex justify-center">
            <button
              onClick={() => setBreakScenarioRevealed(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
            >
              Reveal What Happens
            </button>
          </div>
        ) : (
          <>
            {/* Break Visualization */}
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⚠️</span>
                <div>
                  <h4 className="font-bold text-red-900 text-lg">{content.scenario.name}</h4>
                  <p className="text-red-700">{content.scenario.visualization.errorMessage}</p>
                </div>
              </div>
              <div className="bg-white rounded p-4 text-sm">
                <p className="font-medium text-gray-900 mb-2">What happened:</p>
                <p className="text-gray-700">{content.scenario.lesson}</p>
              </div>
            </div>

            {/* User Understanding Check */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{content.questionToUser}</h4>
              <textarea
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows={3}
              />
              <button
                onClick={() => setShowCorrectAnswer(true)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Check Answer
              </button>

              {showCorrectAnswer && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded p-4">
                  <h5 className="font-semibold text-green-900 mb-1">Explanation:</h5>
                  <p className="text-green-800">{content.correctAnswer}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderDecisionStep = () => {
    const content = currentStep.decisionContent;
    if (!content) return null;

    return (
      <div className="space-y-6">
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="font-bold text-purple-900 text-xl mb-2">{content.question}</h4>
          <div className="max-w-none text-purple-800">
            {renderMarkdown(content.context)}
          </div>
        </div>

        {/* Options */}
        <div className="grid gap-4">
          {content.options.map(option => (
            <div
              key={option.id}
              onClick={() => setSelectedDecision(option.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedDecision === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-lg">{option.title}</h5>
                {selectedDecision === option.id && (
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Selected</span>
                )}
              </div>
              <p className="text-gray-700 mb-3">{option.description}</p>

              {/* Expected Results */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(option.expectedMetrics).map(([key, value]) => (
                  <div key={key} className="bg-gray-100 rounded px-2 py-1">
                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>{' '}
                    {value}
                  </div>
                ))}
              </div>

              {/* Good/Bad For */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-green-600 font-medium">Good for:</span>
                  <ul className="mt-1">
                    {option.goodFor.map((item, i) => (
                      <li key={i} className="text-green-700">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-red-600 font-medium">Bad for:</span>
                  <ul className="mt-1">
                    {option.badFor.map((item, i) => (
                      <li key={i} className="text-red-700">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hint */}
        {content.hint && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
            <span className="font-semibold text-yellow-800">💡 Hint:</span>{' '}
            <span className="text-yellow-700">{content.hint}</span>
          </div>
        )}

        {/* Confirm Decision */}
        {selectedDecision && !showDecisionExplanation && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowDecisionExplanation(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
            >
              Confirm My Decision
            </button>
          </div>
        )}

        {/* Explanation */}
        {showDecisionExplanation && content.explanation && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h5 className="font-semibold text-green-900 mb-2">Expert Analysis:</h5>
            <div className="max-w-none text-green-800">
              {renderMarkdown(content.explanation)}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSummaryStep = () => {
    const content = currentStep.summaryContent;
    if (!content) return null;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🎉 Lesson Complete: {content.conceptLearned}
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Key Takeaways:</h4>
              <ul className="space-y-2">
                {content.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">📚 Further Reading (DDIA):</h4>
              <ul className="space-y-2">
                {content.ddiaReferences.map((ref, i) => (
                  <li key={i} className="text-sm text-gray-700">
                    <strong>Chapter {ref.chapter}:</strong> {ref.title} - {ref.section}
                    {ref.pageRange && ` (pp. ${ref.pageRange})`}
                  </li>
                ))}
              </ul>
            </div>

            {content.nextLesson && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-1">Next Up:</h4>
                <p className="text-blue-800">
                  Continue your learning journey with the next lesson on {content.nextLesson}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{lesson.title}</h2>
            <p className="text-sm text-gray-600">{lesson.subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Step {currentStepIndex + 1} of {lesson.steps.length}
            </span>
            <button onClick={onExit} className="text-gray-500 hover:text-gray-700">
              ✕ Exit
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${((currentStepIndex + 1) / lesson.steps.length) * 100}%` }}
          />
        </div>

        {/* Step Title */}
        <div className="mt-3">
          <h3 className="text-lg font-semibold text-gray-900">{currentStep.title}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">{renderStepContent()}</div>

      {/* Navigation */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={isFirstStep}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          ← Previous
        </button>

        <button
          onClick={handleNext}
          disabled={
            (currentStep.type === 'simulate' && simulationResults.length === 0) ||
            (currentStep.type === 'break' && !showCorrectAnswer) ||
            (currentStep.type === 'decision' && !showDecisionExplanation)
          }
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLastStep ? 'Complete Lesson' : 'Next Step →'}
        </button>
      </div>
    </div>
  );
}
