import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, BookOpen, Brain, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { DSAQuiz } from '../../types/dsa-course';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

// Helper component to render text with code blocks
function QuestionContent({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  
  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          // Extract language and code
          const lines = part.split('\n');
          const firstLine = lines[0].replace(/```/g, '').trim();
          const language = firstLine || 'python';
          const code = lines.slice(1, -1).join('\n');
          
          return (
            <pre key={index} className="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto text-xs">
              <code className="font-mono">{code}</code>
            </pre>
          );
        } else if (part.trim()) {
          // Regular text
          return (
            <p key={index} className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {part}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}

interface DSAMCQSidePanelProps {
  quizzes: DSAQuiz[];
  onComplete?: () => void;
  onQuizComplete?: (quizId: string) => void; // Called when each quiz is answered correctly
  progressiveMode?: boolean; // Only allow next after correct answer
  currentQuizIndex?: number; // For progressive mode - control which quiz to show
}

export function DSAMCQSidePanel({ quizzes, onComplete, onQuizComplete, progressiveMode = false, currentQuizIndex }: DSAMCQSidePanelProps) {
  const [currentQuestion, setCurrentQuestion] = useState(currentQuizIndex || 0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showExplanation, setShowExplanation] = useState<{ [key: number]: boolean }>({});
  const [score, setScore] = useState<number | null>(null);

  // Update current question when currentQuizIndex changes (for progressive mode)
  useEffect(() => {
    if (currentQuizIndex !== undefined && progressiveMode) {
      setCurrentQuestion(currentQuizIndex);
    }
  }, [currentQuizIndex, progressiveMode]);

  const question = quizzes[currentQuestion];
  const totalQuestions = quizzes.length;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = { ...selectedAnswers, [currentQuestion]: answerIndex };
    setSelectedAnswers(newAnswers);

    setShowExplanation({ ...showExplanation, [currentQuestion]: true });

    // Check if answer is correct
    const isCorrectAnswer = answerIndex === question.correctAnswer;

    // If correct answer in progressive mode, notify parent
    if (isCorrectAnswer && onQuizComplete) {
      onQuizComplete(question.id);
    }

    // Auto-advance to next question after 2 seconds if correct
    if (isCorrectAnswer && currentQuestion < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 2000);
    }
  };

  const handleNext = () => {
    // In progressive mode, only allow next if correct
    if (progressiveMode && !isCorrect) {
      return;
    }
    
    if (isLastQuestion) {
      calculateScore();
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quizzes.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    setScore(correct);
    if (onComplete && correct >= totalQuestions * 0.7) {
      onComplete();
    }
  };

  const isAnswered = selectedAnswers[currentQuestion] !== undefined;
  const isCorrect = selectedAnswers[currentQuestion] === question.correctAnswer;
  const shouldShowExplanation = showExplanation[currentQuestion];

  if (score !== null) {
    const percentage = (score / totalQuestions) * 100;
    const passed = percentage >= 70;

    return (
      <div className="h-full flex flex-col bg-white">
        <div className="border-b px-4 py-3 bg-slate-50">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <h3 className="text-slate-900">Quiz Results</h3>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className={`p-6 rounded-lg border-2 ${passed ? 'bg-green-50 border-green-500' : 'bg-blue-50 border-blue-500'}`}>
              <div className="text-center">
                {passed ? (
                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                ) : (
                  <Brain className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                )}
                <h3 className={passed ? 'text-green-900 mb-2' : 'text-blue-900 mb-2'}>
                  {passed ? 'Great Job! 🎉' : 'Keep Learning! 📚'}
                </h3>
                <p className="text-sm text-slate-700 mb-4">
                  Score: {score}/{totalQuestions} ({percentage.toFixed(0)}%)
                </p>
                
                <div className="space-y-2 mb-4">
                  {quizzes.map((q, index) => (
                    <div
                      key={q.id}
                      className={`p-2 rounded text-xs ${
                        selectedAnswers[index] === q.correctAnswer
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      Q{index + 1}: {selectedAnswers[index] === q.correctAnswer ? '✓ Correct' : '✗ Incorrect'}
                    </div>
                  ))}
                </div>
                
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => {
                    setScore(null);
                    setCurrentQuestion(0);
                    setSelectedAnswers({});
                    setShowExplanation({});
                  }}
                >
                  Retake Quiz
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b px-4 py-3 bg-slate-50">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <h3 className="text-slate-900">Quiz Questions</h3>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>Question {currentQuestion + 1} of {totalQuestions}</span>
          <div className="flex gap-1">
            {quizzes.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  selectedAnswers[index] !== undefined
                    ? selectedAnswers[index] === quizzes[index].correctAnswer
                      ? 'bg-green-500'
                      : 'bg-red-500'
                    : index === currentQuestion
                    ? 'bg-blue-500'
                    : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Question */}
          <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <QuestionContent content={question.question} />
          </div>

          {/* Options */}
          <div className="space-y-2 mb-4">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;
              const isCorrectOption = index === question.correctAnswer;
              const showStatus = shouldShowExplanation;

              return (
                <button
                  key={index}
                  onClick={() => !isAnswered && handleAnswer(index)}
                  disabled={isAnswered}
                  className={`w-full p-3 text-left rounded-lg border-2 transition-all text-sm ${
                    showStatus && isCorrectOption
                      ? 'border-green-500 bg-green-50'
                      : showStatus && isSelected && !isCorrectOption
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        showStatus && isCorrectOption
                          ? 'border-green-500 bg-green-500'
                          : showStatus && isSelected && !isCorrectOption
                          ? 'border-red-500 bg-red-500'
                          : isSelected
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-slate-300'
                      }`}
                    >
                      {showStatus && isCorrectOption && (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      )}
                      {showStatus && isSelected && !isCorrectOption && (
                        <XCircle className="w-3 h-3 text-white" />
                      )}
                      {!showStatus && isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation with Animation */}
          <AnimatePresence>
            {shouldShowExplanation && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-blue-50 border-l-4 border-blue-500'}`}
              >
                {isCorrect && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="flex justify-center mb-3"
                  >
                    <Sparkles className="w-8 h-8 text-green-500" />
                  </motion.div>
                )}
                <h4 className={`text-sm mb-2 flex items-center gap-2 ${isCorrect ? 'text-green-900' : 'text-blue-900'}`}>
                  {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                  {isCorrect ? '✓ Correct!' : 'Explanation'}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">{question.explanation}</p>
                {isCorrect && currentQuestion < totalQuestions - 1 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs text-green-700 mt-2 font-medium"
                  >
                    Moving to next stage...
                  </motion.p>
                )}
                {isCorrect && currentQuestion === totalQuestions - 1 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs text-green-700 mt-2 font-medium"
                  >
                    🎉 All stages completed!
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Navigation Footer */}
      <div className="border-t px-4 py-3 bg-slate-50">
        <div className="flex items-center justify-between gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Prev
          </Button>

          {isAnswered && (
            <>
              {progressiveMode && !isCorrect ? (
                <div className="flex-1 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg text-xs text-amber-800">
                  💡 Get it right to continue!
                </div>
              ) : (
                <Button 
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                  onClick={handleNext}
                >
                  {isLastQuestion ? 'Submit' : 'Next'}
                  {!isLastQuestion && <ChevronRight className="w-4 h-4 ml-1" />}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
