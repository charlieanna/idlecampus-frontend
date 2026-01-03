import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import { ProgressiveLesson, QuizSection } from '../../types/progressive-lesson-enhanced';

interface GenericLessonQuizPanelProps {
  lesson: ProgressiveLesson;
  currentQuizIndex: number;
  onQuizComplete: () => void;
}

export function GenericLessonQuizPanel({ lesson, currentQuizIndex, onQuizComplete }: GenericLessonQuizPanelProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>(undefined);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Get quiz sections
  const quizSections = lesson.sections.filter(s => s.type === 'quiz') as QuizSection[];
  const currentQuizSection = quizSections[currentQuizIndex];

  // Reset state when quiz or question changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(undefined);
    setShowExplanation(false);
    setIsCorrect(false);
  }, [currentQuizIndex]);

  if (!currentQuizSection) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="text-center p-8 max-w-md">
          <HelpCircle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-slate-700 mb-2">No Quiz Available</h3>
          <p className="text-sm">
            Complete the previous stages to unlock more quizzes.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = currentQuizSection?.questions[currentQuestionIndex];

  const handleAnswerSelect = (optionIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === undefined || !currentQuestion) return;

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowExplanation(true);

    if (correct) {
      // If correct, move to next question after 2 seconds
      setTimeout(() => {
        if (currentQuestionIndex < currentQuizSection.questions.length - 1) {
          // Move to next question
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(undefined);
          setShowExplanation(false);
          setIsCorrect(false);
        } else {
          // All questions completed, notify parent
          setTimeout(() => {
            onQuizComplete();
          }, 1000);
        }
      }, 2000);
    }
    // If incorrect, user can change their answer and try again
  };

  const handleTryAgain = () => {
    setSelectedAnswer(undefined);
    setShowExplanation(false);
    setIsCorrect(false);
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-white">
      <div className="flex flex-col pb-6">
        {/* Header */}
        <div className="border-b px-6 py-4 bg-indigo-50 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <h3 className="text-indigo-900">{currentQuizSection.title}</h3>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full">
              Question {currentQuestionIndex + 1} / {currentQuizSection.questions.length}
            </span>
          </div>
          {/* Progress dots */}
          <div className="flex gap-1">
            {currentQuizSection.questions.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  idx < currentQuestionIndex
                    ? 'bg-green-500'
                    : idx === currentQuestionIndex
                    ? 'bg-blue-500'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          {showExplanation && isCorrect && currentQuestionIndex === currentQuizSection.questions.length - 1 && (
            <Badge className="bg-green-600 text-white mt-2">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Quiz completed! Moving to next stage...
            </Badge>
          )}
        </div>

        {/* Quiz Content - Show only current question */}
        <div className="flex-1 p-6">
          {currentQuestion && (
            <div className="space-y-4">
              {/* Question */}
              <div className="text-slate-900 mb-6 prose prose-slate max-w-none">
                <ReactMarkdown>
                  {currentQuestion.question}
                </ReactMarkdown>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, optionIndex) => {
                  const isSelected = selectedAnswer === optionIndex;
                  const isCorrectOption = optionIndex === currentQuestion.correctAnswer;
                  const showResult = showExplanation;

                  return (
                    <button
                      key={optionIndex}
                      onClick={() => handleAnswerSelect(optionIndex)}
                      disabled={showExplanation}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        showResult && isCorrectOption
                          ? 'border-green-500 bg-green-50'
                          : showResult && isSelected && !isCorrect
                          ? 'border-red-500 bg-red-50'
                          : isSelected
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                      } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          showResult && isCorrectOption
                            ? 'border-green-500 bg-green-500'
                            : showResult && isSelected && !isCorrect
                            ? 'border-red-500 bg-red-500'
                            : isSelected
                            ? 'border-indigo-500 bg-indigo-500'
                            : 'border-slate-300'
                        }`}>
                          {(isSelected || (showResult && isCorrectOption)) && (
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className={`flex-1 ${
                          showResult && isCorrectOption
                            ? 'text-green-900 font-medium'
                            : showResult && isSelected && !isCorrect
                            ? 'text-red-900'
                            : isSelected
                            ? 'text-indigo-900 font-medium'
                            : 'text-slate-700'
                        }`}>
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-lg ${
                    isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className={`flex-1 prose prose-sm max-w-none ${
                      isCorrect ? 'prose-green' : 'prose-red'
                    }`}>
                      <ReactMarkdown>
                        {currentQuestion.explanation}
                      </ReactMarkdown>
                    </div>
                  </div>
                  {isCorrect && currentQuestionIndex < currentQuizSection.questions.length - 1 && (
                    <div className="mt-3 text-sm text-green-700">
                      ✓ Moving to next question...
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button - At bottom */}
        <div className="border-t px-6 py-4 bg-slate-50">
          {showExplanation && !isCorrect ? (
            <div className="flex gap-2">
              <Button
                onClick={handleTryAgain}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                size="lg"
              >
                Try Again
              </Button>
            </div>
          ) : !showExplanation ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentQuestion) {
                    setSelectedAnswer(currentQuestion.correctAnswer);
                  }
                }}
                className="bg-yellow-100 hover:bg-yellow-200 border-yellow-400"
              >
                Show Answer
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === undefined}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {selectedAnswer === undefined ? 'Select an answer' : 'Submit Answer'}
              </Button>
            </div>
          ) : (
            <div className="w-full bg-green-50 border border-green-500 text-green-700 py-3 px-4 rounded-lg text-center font-medium">
              ✓ Correct! Moving to next question...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
