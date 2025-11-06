import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Trophy, RotateCcw, Terminal as TerminalIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';

// ============================================
// TYPES
// ============================================

export type QuizQuestion =
  | {
      id: string;
      type: 'mcq';
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }
  | {
      id: string;
      type: 'command';
      question: string;
      expectedCommand: string;
      hint: string;
      explanation: string;
    };

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

// ============================================
// QUIZ VIEWER COMPONENT
// ============================================

export interface QuizViewerProps {
  quiz: Quiz;
  onComplete: () => void;
  isCompleted: boolean;
  onRegisterCommandHandler: (handler: (command: string) => { correct: boolean; message: string } | null) => void;
  onGoToLab?: () => void;
}

export function QuizViewer({ quiz, onComplete, isCompleted, onRegisterCommandHandler, onGoToLab }: QuizViewerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, number | string>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  // Check if quiz has valid questions
  const hasQuestions = quiz && Array.isArray(quiz.questions) && quiz.questions.length > 0;

  const currentQuestion = hasQuestions ? quiz.questions[currentQuestionIndex] : null;
  const totalQuestions = hasQuestions ? quiz.questions.length : 0;
  const progress = hasQuestions ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  // Handler for command-based questions
  const handleCommandAnswer = (command: string) => {
    if (showResults) return null;
    if (!currentQuestion || currentQuestion.type !== 'command') return null;

    const expectedCommand = currentQuestion.expectedCommand.trim();
    const userCommand = command.trim();

    if (userCommand === expectedCommand) {
      const newAnswers = new Map(selectedAnswers);
      newAnswers.set(currentQuestionIndex, command);
      setSelectedAnswers(newAnswers);

      const newAnswered = new Set(answeredQuestions);
      newAnswered.add(currentQuestionIndex);
      setAnsweredQuestions(newAnswered);

      return { correct: true, message: '✓ Correct! Command matched.' };
    } else {
      return { correct: false, message: '✗ Incorrect. Try again or check the hint.' };
    }
  };

  // Register command handler - must be called unconditionally
  useEffect(() => {
    if (hasQuestions && onRegisterCommandHandler) {
      onRegisterCommandHandler(handleCommandAnswer);
    }
  }, [currentQuestionIndex, answeredQuestions, showResults, hasQuestions]);

  // Defensive: if there are no questions, show empty state
  if (!hasQuestions) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <Card className="p-6 max-w-2xl">
          <div className="mb-2">
            <h2 className="text-slate-900">{quiz?.title || 'Quiz'}</h2>
            <p className="text-slate-600 mt-2">{quiz?.description || 'This quiz has no questions yet.'}</p>
          </div>
          <div className="mt-4">
            <p className="text-sm text-slate-500">Questions are not available right now. They may be loaded on demand when you select the quiz.</p>
          </div>
        </Card>
      </div>
    );
  }

  const handleSelectMCQAnswer = (optionIndex: number) => {
    if (showResults) return;

    const newAnswers = new Map(selectedAnswers);
    newAnswers.set(currentQuestionIndex, optionIndex);
    setSelectedAnswers(newAnswers);

    const newAnswered = new Set(answeredQuestions);
    newAnswered.add(currentQuestionIndex);
    setAnsweredQuestions(newAnswered);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
    const correctCount = quiz.questions.filter((q, i) => {
      const answer = selectedAnswers.get(i);
      if (q.type === 'mcq') {
        return answer === q.correctAnswer;
      } else {
        return answer !== undefined;
      }
    }).length;

    if (correctCount >= Math.ceil(totalQuestions * 0.7)) {
      onComplete();
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Map());
    setShowResults(false);
    setAnsweredQuestions(new Set());
  };

  const correctCount = quiz.questions.filter((q, i) => {
    const answer = selectedAnswers.get(i);
    if (q.type === 'mcq') {
      return answer === q.correctAnswer;
    } else {
      return answer !== undefined;
    }
  }).length;
  const score = Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= 70;

  if (showResults) {
    return (
      <div className="h-full flex flex-col bg-white">
        <ScrollArea className="flex-1">
          <div className="p-6 max-w-4xl min-h-full pb-12">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-slate-900">{quiz.title}</h1>
                {isCompleted && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              <p className="text-slate-600 mt-2">{quiz.description}</p>
            </div>

            <Card className={`p-6 mb-6 ${passed ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
              <div className="flex items-center gap-4">
                {passed ? (
                  <Trophy className="w-12 h-12 text-green-600" />
                ) : (
                  <AlertCircle className="w-12 h-12 text-orange-600" />
                )}
                <div className="flex-1">
                  <h2 className={passed ? 'text-green-900' : 'text-orange-900'}>
                    {passed ? '🎉 Congratulations!' : 'Keep Practicing'}
                  </h2>
                  <p className={`mt-1 ${passed ? 'text-green-700' : 'text-orange-700'}`}>
                    You scored {correctCount} out of {totalQuestions} ({score}%)
                  </p>
                  {passed ? (
                    <p className="text-green-600 text-sm mt-1">You've passed the quiz!</p>
                  ) : (
                    <p className="text-orange-600 text-sm mt-1">You need 70% to pass. Review the lessons and try again.</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleRetry} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retry Quiz
                  </Button>
                </div>
              </div>
            </Card>

            {passed && onGoToLab && (
              <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-blue-900 mb-1">Ready for Hands-On Practice?</h3>
                    <p className="text-blue-700 text-sm">
                      Apply what you've learned in the lab exercises
                    </p>
                  </div>
                  <Button onClick={onGoToLab} className="bg-blue-600 hover:bg-blue-700">
                    Go to Lab →
                  </Button>
                </div>
              </Card>
            )}

            <div className="space-y-6">
              <h3 className="text-slate-900">Review Answers</h3>
              {quiz.questions.map((question, index) => {
                const selectedAnswer = selectedAnswers.get(index);
                let isCorrect = false;

                if (question.type === 'mcq') {
                  isCorrect = selectedAnswer === question.correctAnswer;
                } else {
                  isCorrect = selectedAnswer !== undefined;
                }

                return (
                  <Card key={question.id} className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-slate-500">{index + 1}.</span>
                          {question.type === 'command' && (
                            <Badge variant="outline" className="text-xs">
                              <TerminalIcon className="w-3 h-3 mr-1" />
                              Command
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-900">{question.question}</p>
                      </div>
                    </div>

                    <div className="ml-8 space-y-2">
                      {question.type === 'mcq' ? (
                        question.options.map((option, optionIndex) => {
                          const isSelected = selectedAnswer === optionIndex;
                          const isCorrectOption = optionIndex === question.correctAnswer;
                          const optionText = typeof option === 'string' ? option : option.text;

                          return (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded border ${
                                isCorrectOption
                                  ? 'bg-green-50 border-green-300'
                                  : isSelected
                                  ? 'bg-red-50 border-red-300'
                                  : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isCorrectOption && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                {isSelected && !isCorrectOption && <XCircle className="w-4 h-4 text-red-600" />}
                                <span className={
                                  isCorrectOption ? 'text-green-900' :
                                  isSelected ? 'text-red-900' :
                                  'text-slate-700'
                                }>
                                  {optionText}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="bg-slate-900 text-green-400 p-3 rounded">
                          <div className="mb-2 text-slate-400 text-sm">Expected command:</div>
                          <code className="text-sm">{question.expectedCommand}</code>
                          {selectedAnswer && (
                            <>
                              <div className="mt-3 mb-2 text-slate-400 text-sm">Your answer:</div>
                              <code className="text-sm text-blue-400">{selectedAnswer as string}</code>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="ml-8 mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-blue-900 text-sm">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-4xl min-h-full pb-12">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-slate-900">{quiz.title}</h1>
              {isCompleted && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
            <p className="text-slate-600 mt-2">{quiz.description}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="text-sm text-slate-600">
                {answeredQuestions.size} answered
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <Card className="p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  {currentQuestion.type === 'command' && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                      <TerminalIcon className="w-3 h-3 mr-1" />
                      Command Question
                    </Badge>
                  )}
                </div>

                <h2 className="text-slate-900 mb-6">{currentQuestion.question}</h2>

                {currentQuestion.type === 'mcq' ? (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, optionIndex) => {
                      const isSelected = selectedAnswers.get(currentQuestionIndex) === optionIndex;
                      const optionText = typeof option === 'string' ? option : option.text;

                      return (
                        <button
                          key={optionIndex}
                          onClick={() => handleSelectMCQAnswer(optionIndex)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'bg-blue-50 border-blue-500 shadow-md'
                              : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                            }`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className={isSelected ? 'text-blue-900' : 'text-slate-700'}>
                              {optionText}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-blue-900 text-sm">
                            <strong>Hint:</strong> {currentQuestion.hint}
                          </p>
                        </div>
                      </div>
                    </div>

                    {answeredQuestions.has(currentQuestionIndex) ? (
                      <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Command entered correctly! Use the terminal on the right to practice.</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-900 border-2 border-blue-500 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-blue-400 mb-2">
                          <TerminalIcon className="w-4 h-4" />
                          <span className="text-sm">Type your command in the terminal on the right →</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {quiz.questions.map((_q, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentQuestionIndex
                      ? 'bg-blue-600 w-6'
                      : answeredQuestions.has(index)
                      ? 'bg-green-600'
                      : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>

            {currentQuestionIndex === totalQuestions - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={answeredQuestions.size < totalQuestions}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
