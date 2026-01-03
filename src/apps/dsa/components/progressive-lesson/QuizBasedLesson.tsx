/**
 * QuizBasedLesson Component
 *
 * Renders quiz sections with interactive question answering.
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { MarkdownWithSyntaxHighlight } from '../core/MarkdownWithSyntaxHighlight';
import type { QuizBasedLessonProps } from './types';
import type { QuizSection } from '../../types/progressive-lesson-enhanced';

const QuizBasedLesson: React.FC<QuizBasedLessonProps> = ({
  progressiveLesson,
  progressiveQuizIndex,
  setProgressiveQuizIndex,
  progressiveLessonProgress,
  setProgressiveLessonProgress,
}) => {
  // Get current section from progress
  const currentIndex = progressiveLessonProgress?.currentSectionIndex ?? progressiveQuizIndex;
  const currentSection = progressiveLesson.sections[currentIndex];

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Map<string, number>>(new Map());
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<string>>(new Set());
  const [showExplanations, setShowExplanations] = useState<Set<string>>(new Set());

  // Reset state when quiz changes
  useEffect(() => {
    setSelectedAnswers(new Map());
    setSubmittedQuestions(new Set());
    setShowExplanations(new Set());
  }, [currentIndex]);

  if (!currentSection || currentSection.type !== 'quiz') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No quiz available</p>
      </div>
    );
  }

  const quizSection = currentSection as QuizSection;

  const handleSelectAnswer = (questionId: string, answerIndex: number) => {
    if (submittedQuestions.has(questionId)) return;
    setSelectedAnswers(prev => new Map(prev).set(questionId, answerIndex));
  };

  const handleSubmitAnswer = (questionId: string, correctAnswer: number) => {
    const answer = selectedAnswers.get(questionId);
    if (answer === undefined) return;

    setSubmittedQuestions(prev => new Set(prev).add(questionId));
    setShowExplanations(prev => new Set(prev).add(questionId));
  };

  const handleContinue = () => {
    if (!setProgressiveLessonProgress || !progressiveLessonProgress) return;

    const newSectionsProgress = new Map(progressiveLessonProgress.sectionsProgress);

    // Mark current quiz as completed
    newSectionsProgress.set(currentSection.id, {
      sectionId: currentSection.id,
      status: 'completed',
      attempts: 1,
      timeSpent: 0,
      completedAt: new Date().toISOString(),
    });

    // Unlock next section
    const nextIndex = currentIndex + 1;
    if (nextIndex < progressiveLesson.sections.length) {
      const nextSection = progressiveLesson.sections[nextIndex];
      if (!newSectionsProgress.has(nextSection.id)) {
        newSectionsProgress.set(nextSection.id, {
          sectionId: nextSection.id,
          status: 'unlocked',
          attempts: 0,
          timeSpent: 0,
        });
      }
    }

    setProgressiveLessonProgress({
      ...progressiveLessonProgress,
      sectionsProgress: newSectionsProgress,
      currentSectionIndex: nextIndex,
    });
  };

  const allAnswered = quizSection.questions.every(q => submittedQuestions.has(q.id));
  const correctCount = quizSection.questions.filter(q =>
    selectedAnswers.get(q.id) === q.correctAnswer
  ).length;

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="max-w-4xl mx-auto p-8 pb-24">
        {/* Quiz Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{quizSection.title}</h1>
              <p className="text-slate-500">{quizSection.questions.length} questions</p>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {quizSection.questions.map((question, qIdx) => {
            const isSubmitted = submittedQuestions.has(question.id);
            const selectedAnswer = selectedAnswers.get(question.id);
            const isCorrect = selectedAnswer === question.correctAnswer;
            const showExplanation = showExplanations.has(question.id);

            return (
              <div key={question.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-start gap-4 mb-6">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                    {qIdx + 1}
                  </span>
                  <div className="flex-1 text-slate-800">
                    <MarkdownWithSyntaxHighlight className="prose prose-slate max-w-none prose-pre:my-2">
                      {question.question}
                    </MarkdownWithSyntaxHighlight>
                  </div>
                </div>

                <div className="space-y-3 ml-12">
                  {question.options.map((option, oIdx) => {
                    const isSelected = selectedAnswer === oIdx;
                    const isCorrectOption = oIdx === question.correctAnswer;

                    let optionClass = "p-4 rounded-lg border-2 cursor-pointer transition-all ";
                    if (isSubmitted) {
                      if (isCorrectOption) {
                        optionClass += "bg-green-50 border-green-400 text-green-800";
                      } else if (isSelected && !isCorrectOption) {
                        optionClass += "bg-red-50 border-red-400 text-red-800";
                      } else {
                        optionClass += "bg-slate-50 border-slate-200 text-slate-500";
                      }
                    } else {
                      optionClass += isSelected
                        ? "bg-indigo-50 border-indigo-400 text-indigo-800"
                        : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50";
                    }

                    return (
                      <div
                        key={oIdx}
                        className={optionClass}
                        onClick={() => handleSelectAnswer(question.id, oIdx)}
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="flex-1">{option}</span>
                          {isSubmitted && isCorrectOption && (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          )}
                          {isSubmitted && isSelected && !isCorrectOption && (
                            <XCircle className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!isSubmitted && selectedAnswer !== undefined && (
                  <div className="mt-6 ml-12">
                    <Button
                      onClick={() => handleSubmitAnswer(question.id, question.correctAnswer)}
                    >
                      Check Answer
                    </Button>
                  </div>
                )}

                {showExplanation && question.explanation && (
                  <div className={`mt-6 ml-12 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                    <MarkdownWithSyntaxHighlight className="prose prose-slate prose-sm max-w-none">
                      {question.explanation}
                    </MarkdownWithSyntaxHighlight>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion Section */}
        {allAnswered && (
          <div className="mt-10 p-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Quiz Complete!</h3>
                <p className="text-slate-600 mt-1">
                  You got {correctCount} out of {quizSection.questions.length} correct
                  ({Math.round((correctCount / quizSection.questions.length) * 100)}%)
                </p>
              </div>
              <Button size="lg" onClick={handleContinue} className="gap-2">
                Continue <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default QuizBasedLesson;