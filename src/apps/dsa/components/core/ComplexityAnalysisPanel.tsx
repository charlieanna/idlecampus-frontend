/**
 * Complexity Analysis Panel
 * Shows time and space complexity quiz after code passes tests
 * User must answer ALL questions correctly before proceeding
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Box,
  HelpCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { renderStyledText } from '../../utils/styledTextRenderer';
import type { ExerciseSection, QuizSection } from '../../types/progressive-lesson-enhanced';

interface ComplexityAnalysisPanelProps {
  exercise: ExerciseSection | QuizSection;
  onComplete: () => void;
  placement?: 'before' | 'after'; // 'before' = understand first, 'after' = analyze solution (default)
  lessonTitle?: string; // Optional: Parent lesson title for context
  sectionNumber?: number; // Optional: Section number in the lesson
}

export const ComplexityAnalysisPanel: React.FC<ComplexityAnalysisPanelProps> = ({
  exercise,
  onComplete,
  placement = 'after',
  lessonTitle,
  sectionNumber
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeAnswers, setTimeAnswers] = useState<Map<string, string>>(new Map());
  const [spaceAnswer, setSpaceAnswer] = useState<string | null>(null);
  const [allAnswered, setAllAnswered] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const explanation = exercise.solutionExplanation || '';

  // Extract function names AND their correct TIME complexities
  const extractFunctionsWithComplexity = (text: string): Map<string, string> => {
    const functionPattern = /\*\*([a-zA-Z_]+\([^)]*\))\*\*:\s*(O\([^)]+\))/g;
    const funcMap = new Map<string, string>();
    let match;
    while ((match = functionPattern.exec(text)) !== null) {
      let complexity = match[2];
      // Normalize to our options
      if (complexity.includes('α') || complexity.includes('amortized')) {
        complexity = 'O(1)';
      } else if (complexity.includes('log k') || complexity.includes('log n')) {
        complexity = 'O(log n)';
      } else if (complexity.includes('n × m') || complexity.includes('n²') || complexity.includes('n^2')) {
        complexity = 'O(n²)';
      } else if (complexity.includes('n') && !complexity.includes('log')) {
        complexity = 'O(n)';
      }
      funcMap.set(match[1], complexity);
    }
    return funcMap;
  };

  // Extract SPACE complexity from explanation
  const extractSpaceComplexity = (text: string): string => {
    const spacePattern = /Space Complexity[:\s]+\*?\*?(O\([^)]+\))/i;
    const match = text.match(spacePattern);
    if (match) {
      let complexity = match[1];
      if (complexity.includes('1')) {
        return 'O(1)';
      } else if (complexity.includes('log')) {
        return 'O(log n)';
      } else if (complexity.includes('n²') || complexity.includes('n^2')) {
        return 'O(n²)';
      } else if (complexity.includes('n')) {
        return 'O(n)';
      }
    }
    return 'O(n)'; // Default fallback
  };

  const functionsWithCorrect = extractFunctionsWithComplexity(explanation);
  const functions = Array.from(functionsWithCorrect.keys());
  const correctSpaceComplexity = extractSpaceComplexity(explanation);
  const complexityOptions = ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'];

  const handleTimeAnswer = (func: string, answer: string) => {
    const newAnswers = new Map(timeAnswers);
    newAnswers.set(func, answer);
    setTimeAnswers(newAnswers);
    checkAllAnswered(newAnswers, spaceAnswer);
  };

  const handleSpaceAnswer = (answer: string) => {
    setSpaceAnswer(answer);
    checkAllAnswered(timeAnswers, answer);
  };

  const checkAllAnswered = (times: Map<string, string>, space: string | null) => {
    if (times.size === functions.length && space !== null) {
      setAllAnswered(true);
      setAttemptCount(prev => prev + 1);

      const allCorrect = isAllCorrect(times, space);
      if (allCorrect) {
        setTimeout(() => setShowExplanation(true), 1500);
      } else {
        setShowRetry(true);
      }
    }
  };

  const isAllCorrect = (times: Map<string, string>, space: string | null): boolean => {
    if (space !== correctSpaceComplexity) return false;
    for (const func of functions) {
      if (times.get(func) !== functionsWithCorrect.get(func)) return false;
    }
    return true;
  };

  const handleRetry = () => {
    setTimeAnswers(new Map());
    setSpaceAnswer(null);
    setAllAnswered(false);
    setShowRetry(false);
  };

  const getTimeFeedback = (func: string): { correct: boolean; explanation: string } | null => {
    if (!timeAnswers.has(func)) return null;
    const userAnswer = timeAnswers.get(func)!;
    const correctAnswer = functionsWithCorrect.get(func) || '';
    const isCorrect = userAnswer === correctAnswer;

    let explanation = '';
    if (!isCorrect) {
      if (correctAnswer === 'O(1)') {
        explanation = 'Constant time - no loops, direct access';
      } else if (correctAnswer === 'O(log n)') {
        explanation = 'Logarithmic - divides problem in half each step';
      } else if (correctAnswer === 'O(n)') {
        explanation = 'Linear - single pass through all elements';
      } else if (correctAnswer === 'O(n²)') {
        explanation = 'Quadratic - nested loops over elements';
      }
    }

    return { correct: isCorrect, explanation };
  };

  const getSpaceFeedback = (): { correct: boolean; explanation: string } | null => {
    if (spaceAnswer === null) return null;
    const isCorrect = spaceAnswer === correctSpaceComplexity;

    let explanation = '';
    if (!isCorrect) {
      if (correctSpaceComplexity === 'O(1)') {
        explanation = 'Constant space - only a few variables, no data structures that grow';
      } else if (correctSpaceComplexity === 'O(log n)') {
        explanation = 'Logarithmic space - usually recursion stack depth';
      } else if (correctSpaceComplexity === 'O(n)') {
        explanation = 'Linear space - storing n elements (hash map, array, etc.)';
      } else if (correctSpaceComplexity === 'O(n²)') {
        explanation = 'Quadratic space - 2D matrix or nested data structure';
      }
    }

    return { correct: isCorrect, explanation };
  };

  const countCorrect = () => {
    let correct = 0;
    functions.forEach(func => {
      if (timeAnswers.get(func) === functionsWithCorrect.get(func)) {
        correct++;
      }
    });
    if (spaceAnswer === correctSpaceComplexity) correct++;
    return correct;
  };

  const totalQuestions = functions.length + 1;

  // Auto-fill all correct answers (for testing flow)
  const showAllAnswers = () => {
    const newTimeAnswers = new Map<string, string>();
    functions.forEach(func => {
      const correctAnswer = functionsWithCorrect.get(func);
      if (correctAnswer) {
        newTimeAnswers.set(func, correctAnswer);
      }
    });
    setTimeAnswers(newTimeAnswers);
    setSpaceAnswer(correctSpaceComplexity);
    checkAllAnswered(newTimeAnswers, correctSpaceComplexity);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <div className="border-b px-6 py-4 bg-blue-100">
        <div className="space-y-2">
          {/* Main header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {placement === 'before' ? (
                <>
                  <HelpCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="text-blue-900 font-semibold">🧠 Before you code: Understand the complexity...</h3>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h3 className="text-blue-900 font-semibold">✅ Tests Passed! Now analyze your solution...</h3>
                </>
              )}
            </div>
            {/* Debug button to auto-fill answers */}
            {!showExplanation && (
              <Button
                onClick={showAllAnswers}
                variant="outline"
                size="sm"
                className="text-xs bg-yellow-100 hover:bg-yellow-200 border-yellow-400"
              >
                🔍 Show Answers
              </Button>
            )}
          </div>

          {/* Exercise context - clearly shows which exercise this quiz is for */}
          <div className="bg-white rounded-lg p-3 border-2 border-blue-200">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                {sectionNumber || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-blue-600 font-medium mb-0.5">
                  Complexity Quiz For:
                </div>
                <div className="text-sm font-semibold text-blue-900 break-words">
                  {exercise.title}
                </div>
                {lessonTitle && (
                  <div className="text-xs text-slate-600 mt-1">
                    {lessonTitle}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {!showExplanation ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* TIME COMPLEXITY SECTION */}
              <div className="bg-white rounded-lg border-2 border-blue-200 p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div className="text-blue-900 font-semibold">⏱️ Time Complexity</div>
                </div>
                <p className="text-slate-700 mb-4 text-sm">
                  {placement === 'before'
                    ? "What will be the time complexity of this approach?"
                    : "What's the time complexity of each function?"}
                </p>

                <div className="space-y-4">
                  {functions.map((func) => {
                    const feedback = getTimeFeedback(func);
                    const correctAnswer = functionsWithCorrect.get(func);

                    return (
                      <div key={func} className={`rounded-lg p-4 border transition-all ${
                        feedback
                          ? feedback.correct
                            ? 'bg-green-50 border-green-300'
                            : 'bg-red-50 border-red-300'
                          : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-mono text-sm text-blue-900 font-semibold">{func}</div>
                          {feedback && (
                            <div className={`flex items-center gap-1 text-sm font-medium ${
                              feedback.correct ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {feedback.correct ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Correct!</span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-4 h-4" />
                                  <span>Actually {correctAnswer}</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {complexityOptions.map((option) => {
                            const isSelected = timeAnswers.get(func) === option;
                            const isCorrectOption = option === correctAnswer;
                            const showResult = feedback !== null;

                            return (
                              <button
                                key={option}
                                onClick={() => handleTimeAnswer(func, option)}
                                disabled={timeAnswers.has(func) || showRetry}
                                className={`p-3 rounded-lg border-2 text-sm font-mono transition-all ${
                                  showResult && isCorrectOption
                                    ? 'border-green-500 bg-green-100 text-green-900 font-bold'
                                    : showResult && isSelected && !feedback?.correct
                                    ? 'border-red-500 bg-red-100 text-red-900'
                                    : isSelected
                                    ? 'border-blue-500 bg-blue-100 text-blue-900 font-bold'
                                    : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                } ${(timeAnswers.has(func) || showRetry) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                        {feedback && !feedback.correct && feedback.explanation && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 text-sm text-red-800 bg-red-100 p-3 rounded"
                          >
                            <strong>Why {correctAnswer}?</strong> {feedback.explanation}
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SPACE COMPLEXITY SECTION */}
              <div className="bg-white rounded-lg border-2 border-purple-200 p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Box className="w-5 h-5 text-purple-600" />
                  <div className="text-purple-900 font-semibold">💾 Space Complexity</div>
                </div>
                <p className="text-slate-700 mb-4 text-sm">
                  {placement === 'before'
                    ? "How much extra memory will this approach require?"
                    : "How much extra memory does your solution use?"}
                </p>

                {(() => {
                  const feedback = getSpaceFeedback();
                  return (
                    <div className={`rounded-lg p-4 border transition-all ${
                      feedback
                        ? feedback.correct
                          ? 'bg-green-50 border-green-300'
                          : 'bg-red-50 border-red-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-mono text-sm text-purple-900 font-semibold">Overall Space</div>
                        {feedback && (
                          <div className={`flex items-center gap-1 text-sm font-medium ${
                            feedback.correct ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {feedback.correct ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Correct!</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4" />
                                <span>Actually {correctSpaceComplexity}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {complexityOptions.map((option) => {
                          const isSelected = spaceAnswer === option;
                          const isCorrectOption = option === correctSpaceComplexity;
                          const showResult = feedback !== null;

                          return (
                            <button
                              key={option}
                              onClick={() => handleSpaceAnswer(option)}
                              disabled={spaceAnswer !== null || showRetry}
                              className={`p-3 rounded-lg border-2 text-sm font-mono transition-all ${
                                showResult && isCorrectOption
                                  ? 'border-green-500 bg-green-100 text-green-900 font-bold'
                                  : showResult && isSelected && !feedback?.correct
                                  ? 'border-red-500 bg-red-100 text-red-900'
                                  : isSelected
                                  ? 'border-purple-500 bg-purple-100 text-purple-900 font-bold'
                                  : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50'
                              } ${(spaceAnswer !== null || showRetry) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                      {feedback && !feedback.correct && feedback.explanation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 text-sm text-red-800 bg-red-100 p-3 rounded"
                        >
                          <strong>Why {correctSpaceComplexity}?</strong> {feedback.explanation}
                        </motion.div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* RESULTS AND RETRY */}
              {allAnswered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`text-center p-6 rounded-lg ${
                    countCorrect() === totalQuestions
                      ? 'bg-green-100 border-2 border-green-300'
                      : 'bg-red-100 border-2 border-red-300'
                  }`}
                >
                  <div className="font-semibold text-lg mb-2">
                    {countCorrect() === totalQuestions
                      ? '🎉 Perfect! All correct!'
                      : `❌ ${countCorrect()}/${totalQuestions} correct`}
                  </div>
                  {countCorrect() === totalQuestions ? (
                    <div className="text-sm text-green-700">
                      {placement === 'before'
                        ? "Great! You understand the complexity. Now implement it!"
                        : "Excellent understanding! Let's see the full analysis..."}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-red-800">
                        You must answer all questions correctly to proceed.
                        Review the feedback above and try again!
                      </p>
                      <Button
                        onClick={handleRetry}
                        variant="outline"
                        className="bg-white hover:bg-red-50 border-red-300 text-red-700"
                      >
                        🔄 Try Again (Attempt {attemptCount + 1})
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-lg bg-green-100 border-2 border-green-300">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">
                    ✅ All {totalQuestions} questions correct!
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  {placement === 'before'
                    ? "You understand the complexity. Now implement the solution!"
                    : "Great job understanding the time and space complexity!"}
                </p>
              </div>

              {placement === 'after' && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <div className="text-amber-900 font-semibold text-lg">Complete Complexity Analysis</div>
                  </div>
                  <div className="prose prose-sm max-w-none text-slate-800">
                    {renderStyledText(explanation, true)}
                  </div>
                </div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={onComplete}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg"
                  size="lg"
                >
                  {placement === 'before'
                    ? "Start Coding →"
                    : "Got it! Continue to next exercise →"}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
