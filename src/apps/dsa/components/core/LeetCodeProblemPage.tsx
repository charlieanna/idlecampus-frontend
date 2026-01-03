import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/resizable';
import { CodeEditor } from './CodeEditor';
import { DSAProblem, CodeSubmission } from '../../types/dsa-course';
import { renderStyledText } from '../../utils/styledTextRenderer';
import { SolutionEvolutionPanel } from './SolutionEvolutionPanel';
import { PracticeStorage } from '../../services/practiceStorage';

interface LeetCodeProblemPageProps {
  problem: DSAProblem;
  onBack?: () => void;
  onSubmit?: (code: string, complexity?: { time: string; space: string }) => Promise<{ success: boolean; output: string; error?: string; testResults?: any[]; complexityFeedback?: { timeCorrect: boolean; spaceCorrect: boolean; timeExpected?: string; spaceExpected?: string } }>;
  submissionAttempts?: number;
  isSolved?: boolean;
  currentProblemIndex?: number;
  totalProblems?: number;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function LeetCodeProblemPage({
  problem,
  onBack,
  onSubmit,
  submissionAttempts = 0,
  isSolved = false,
  currentProblemIndex = 0,
  totalProblems = 1,
  onNext,
  onPrevious
}: LeetCodeProblemPageProps) {
  const [showEvolution, setShowEvolution] = useState(false);
  const [justSolved, setJustSolved] = useState(false);
  const [totalHintsRevealed, setTotalHintsRevealed] = useState(0);
  const [hintsAtLastAttempt, setHintsAtLastAttempt] = useState(0);
  const attemptStartTimeRef = useRef<number>(Date.now());
  const progressPercent = ((currentProblemIndex + 1) / totalProblems) * 100;

  // Reset state when problem changes
  useEffect(() => {
    setShowEvolution(false);
    setJustSolved(false);
    setTotalHintsRevealed(0);
    setHintsAtLastAttempt(0);
    attemptStartTimeRef.current = Date.now();
  }, [problem.id]);

  // Handle successful submission - show evolution if available
  const handleSubmit = async (code: string, complexity?: { time: string; space: string }) => {
    if (onSubmit) {
      const result = await onSubmit(code, complexity);
      
      // Calculate time spent on THIS attempt only
      const attemptTimeSeconds = Math.floor((Date.now() - attemptStartTimeRef.current) / 1000);
      
      // Calculate NEW hints revealed during this attempt
      const newHintsThisAttempt = totalHintsRevealed - hintsAtLastAttempt;
      
      // Record this attempt with per-attempt deltas
      PracticeStorage.recordAttempt(
        problem.id,
        result.success,
        newHintsThisAttempt, // Only NEW hints during this attempt
        attemptTimeSeconds // Time for this attempt only
      );
      
      // Update state for next attempt
      setHintsAtLastAttempt(totalHintsRevealed);
      attemptStartTimeRef.current = Date.now();
      
      // If just solved and has evolution steps, show evolution panel
      if (result.success && !justSolved && problem.evolutionSteps && problem.evolutionSteps.length > 0) {
        setJustSolved(true);
        setShowEvolution(true);
      }
      
      return result;
    }
    return { success: false, output: '', error: 'No submit handler' };
  };


  const handleEvolutionComplete = () => {
    setShowEvolution(false);
  };

  const handleNextProblem = () => {
    // Reset state for next problem
    setShowEvolution(false);
    setJustSolved(false);
    if (onNext) {
      onNext();
    }
  };

  // If showing evolution panel, render it instead
  if (showEvolution && problem.evolutionSteps) {
    return (
      <SolutionEvolutionPanel
        evolutionSteps={problem.evolutionSteps}
        onComplete={handleEvolutionComplete}
        onNextProblem={onNext ? handleNextProblem : undefined}
      />
    );
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full"
    >
      {/* Left Panel: Problem Description */}
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="h-full flex flex-col bg-white">
          {/* Header with Progress */}
          <div className="border-b bg-gradient-to-r from-slate-50 to-white px-6 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {onBack && (
                  <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-slate-100">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Problem {currentProblemIndex + 1} / {totalProblems}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">{Math.round(progressPercent)}%</span>
                <Progress value={progressPercent} className="h-2 w-32" />
              </div>
            </div>
          </div>

          {/* Current Problem Content - Scrollable */}
          <ScrollArea className="flex-1">
            <div className="p-6 max-w-4xl mx-auto">
              {/* Problem Title */}
              <div className="mb-6 pb-4 border-b border-slate-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900 mb-3">{problem.title}</h1>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${problem.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' :
                          problem.difficulty === 'medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-rose-100 text-rose-700'
                        }`}>
                        {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                      </span>
                      {isSolved && (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" />
                          Solved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Problem Description */}
              <div className="mb-6">
                {renderStyledText(problem.description, true)}
              </div>

              {/* Examples */}
              {problem.examples && problem.examples.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Examples</h2>
                  <div className="space-y-4">
                    {problem.examples.map((example, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-3">
                        <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
                            {idx + 1}
                          </span>
                          Example {idx + 1}
                        </p>
                        <div className="space-y-2.5 pl-8">
                          <div className="text-sm">
                            <span className="font-semibold text-slate-600">Input: </span>
                            <code className="ml-2 px-2 py-1 bg-white rounded border border-slate-200 font-mono text-slate-800 text-xs">
                              {example.input}
                            </code>
                          </div>
                          <div className="text-sm">
                            <span className="font-semibold text-slate-600">Output: </span>
                            <code className="ml-2 px-2 py-1 bg-white rounded border border-slate-200 font-mono text-slate-800 text-xs">
                              {example.output}
                            </code>
                          </div>
                          {example.explanation && (
                            <div className="text-sm pt-1">
                              <span className="font-semibold text-slate-600">Explanation: </span>
                              <span className="text-slate-700 ml-1">{example.explanation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Constraints */}
              {problem.constraints && problem.constraints.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-3">Constraints</h2>
                  <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                    <ul className="space-y-2 text-sm text-slate-700">
                      {problem.constraints.map((constraint, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-slate-400 mt-1.5">•</span>
                          <code className="font-mono text-xs text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {constraint}
                          </code>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            </div>
          </ScrollArea>

          {/* Navigation Footer */}
          <div className="border-t bg-slate-50 px-6 py-4">
            <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={onPrevious}
                disabled={!onPrevious || currentProblemIndex === 0}
                className="text-xs hover:bg-white"
              >
                ← Previous
              </Button>

              <div className="text-center text-xs text-slate-500 font-medium">
                Solve on the right →
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={onNext}
                disabled={!onNext || currentProblemIndex === totalProblems - 1 || !isSolved}
                className="text-xs hover:bg-white"
              >
                Next →
              </Button>
            </div>
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Right Panel: Code Editor */}
      <ResizablePanel defaultSize={50} minSize={30}>
        <CodeEditor
          key={`code-editor-${problem.id}`}
          language="python"
          initialCode={problem.starterCode}
          onRun={handleSubmit}
          solution={problem.solution}
          requireComplexity={true}
          targetComplexity={
            problem.targetComplexity ||
            (problem.timeComplexity && problem.spaceComplexity
              ? { time: problem.timeComplexity, space: problem.spaceComplexity }
              : { time: 'O(n)', space: 'O(1)' })
          }
          hasNext={!!onNext && currentProblemIndex < totalProblems - 1}
          onNext={handleNextProblem}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
