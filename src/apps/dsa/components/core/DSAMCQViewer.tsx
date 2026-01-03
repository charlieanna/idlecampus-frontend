import { useState } from 'react';
import { CheckCircle2, XCircle, BookOpen, Brain } from 'lucide-react';
import { DSAQuiz } from '../../types/dsa-course';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

// Helper component to render text with code blocks
function QuestionContent({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  
  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          // Extract language and code
          const lines = part.split('\n');
          const firstLine = lines[0].replace(/```/g, '').trim();
          const language = firstLine || 'python';
          const code = lines.slice(1, -1).join('\n');
          
          return (
            <pre key={index} className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="font-mono">{code}</code>
            </pre>
          );
        } else if (part.trim()) {
          // Regular text
          return (
            <p key={index} className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {part}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}

interface DSAMCQViewerProps {
  quizzes: DSAQuiz[];
  onComplete?: () => void;
  lessonTitle?: string;
  progressiveMode?: boolean; // Only allow next after correct answer
}

export function DSAMCQViewer({ quizzes, onComplete, lessonTitle, progressiveMode = false }: DSAMCQViewerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showExplanation, setShowExplanation] = useState<{ [key: number]: boolean }>({});
  const [score, setScore] = useState<number | null>(null);

  const question = quizzes[currentQuestion];
  const totalQuestions = quizzes.length;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = { ...selectedAnswers, [currentQuestion]: answerIndex };
    setSelectedAnswers(newAnswers);
    
    setShowExplanation({ ...showExplanation, [currentQuestion]: true });
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
      <div className="h-full overflow-auto bg-slate-50">
        <ScrollArea className="h-full">
          <div className="max-w-3xl mx-auto p-8">
            <div className={`p-8 rounded-lg border-2 ${passed ? 'bg-green-50 border-green-500' : 'bg-blue-50 border-blue-500'}`}>
              <div className="text-center">
                {passed ? (
                  <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                ) : (
                  <Brain className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                )}
                <h2 className={passed ? 'text-green-900 mb-2' : 'text-blue-900 mb-2'}>
                  {passed ? 'Great Understanding! 🎉' : 'Keep Learning! 📚'}
                </h2>
                <p className="text-slate-700 mb-6">
                  You scored {score} out of {totalQuestions} ({percentage.toFixed(0)}%)
                </p>
                <div className="space-y-2 mb-6">
                  {quizzes.map((q, index) => (
                    <div
                      key={q.id}
                      className={`p-3 rounded text-sm ${
                        selectedAnswers[index] === q.correctAnswer
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      Question {index + 1}: {selectedAnswers[index] === q.correctAnswer ? '✓ Correct' : '✗ Incorrect'}
                    </div>
                  ))}
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setScore(null);
                    setCurrentQuestion(0);
                    setSelectedAnswers({});
                    setShowExplanation({});
                  }}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-slate-50">
      <ScrollArea className="h-full">
        <div className="max-w-3xl mx-auto p-8">
          {/* Header */}
          {lessonTitle && (
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-2">
                <Brain className="w-4 h-4" />
                <span className="text-sm">Knowledge Check</span>
              </div>
              <h2 className="text-slate-900">{lessonTitle}</h2>
            </div>
          )}

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">
                Question {currentQuestion + 1} of {totalQuestions}
              </span>
              <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                Multiple Choice
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <QuestionContent content={question.question} />

            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswers[currentQuestion] === index;
                const isCorrectOption = index === question.correctAnswer;
                const showStatus = shouldShowExplanation;

                return (
                  <button
                    key={index}
                    onClick={() => !isAnswered && handleAnswer(index)}
                    disabled={isAnswered}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      showStatus && isCorrectOption
                        ? 'border-green-500 bg-green-50'
                        : showStatus && isSelected && !isCorrectOption
                        ? 'border-red-500 bg-red-50'
                        : isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
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
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                        {showStatus && isSelected && !isCorrectOption && (
                          <XCircle className="w-4 h-4 text-white" />
                        )}
                        {!showStatus && isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-slate-900">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          {shouldShowExplanation && (
            <div className={`p-6 rounded-lg mb-8 ${isCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-blue-50 border-l-4 border-blue-500'}`}>
              <h4 className={`mb-2 flex items-center gap-2 ${isCorrect ? 'text-green-900' : 'text-blue-900'}`}>
                <BookOpen className="w-5 h-5" />
                Explanation
              </h4>
              <p className="text-slate-700">{question.explanation}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              ← Previous
            </Button>

            {isAnswered && (
              <>
                {progressiveMode && !isCorrect ? (
                  <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg">
                    <p className="text-sm text-amber-800">
                      💡 Review the explanation and understand the concept before moving forward
                    </p>
                  </div>
                ) : (
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleNext}
                  >
                    {isLastQuestion ? 'Submit Quiz' : 'Next Question →'}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
