import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Lightbulb,
  Eye,
  BookOpen,
  Code,
  HelpCircle,
  Trophy,
  ChevronRight
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import {
  ProgressiveLesson,
  LessonSection,
  ProgressiveLessonProgress,
  SectionProgress,
  isSectionUnlocked,
  isProgressGated,
  calculateLessonProgress,
  QuizSection,
} from '../../types/progressive-lesson-enhanced';
import { renderStyledText } from '../../utils/styledTextRenderer';

interface ProgressiveLessonTwoPanelProps {
  lesson: ProgressiveLesson;
  progress: ProgressiveLessonProgress;
  onSectionComplete: (sectionId: string) => void;
  onExerciseAttempt: (sectionId: string, input: string, success: boolean) => void;
}

export function ProgressiveLessonTwoPanel({
  lesson,
  progress,
  onSectionComplete,
  onExerciseAttempt,
}: ProgressiveLessonTwoPanelProps) {
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const overallProgress = calculateLessonProgress(lesson, progress);

  // Auto-scroll to current section in left panel
  useEffect(() => {
    const currentSection = lesson.sections[progress.currentSectionIndex];
    const ref = sectionRefs.current.get(currentSection?.id);
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [progress.currentSectionIndex]);

  // Auto-complete reading sections when they become unlocked
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    lesson.sections.forEach((section) => {
      if (section.type === 'reading') {
        const sectionProgress = progress.sectionsProgress.get(section.id);
        if (sectionProgress?.status === 'unlocked') {
          // Auto-complete after 2 seconds to allow user to see the content first
          const timer = setTimeout(() => {
            onSectionComplete(section.id);
          }, 2000);
          timers.push(timer);
        }
      }
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [lesson.sections, progress.sectionsProgress, onSectionComplete]);

  const getSectionProgress = (sectionId: string): SectionProgress => {
    return progress.sectionsProgress.get(sectionId) || {
      sectionId,
      status: 'locked',
      attempts: 0,
      timeSpent: 0,
    };
  };

  const getSectionIcon = (section: LessonSection) => {
    switch (section.type) {
      case 'reading':
        return <BookOpen className="w-4 h-4" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4" />;
      case 'checkpoint':
        return <Trophy className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  // Get current active quiz section for right panel
  const currentQuizSection = lesson.sections.find(s => {
    const sectionProgress = getSectionProgress(s.id);
    return s.type === 'quiz' && 
           (sectionProgress.status === 'in-progress' || sectionProgress.status === 'unlocked');
  }) as QuizSection | undefined;

  const renderReadingSection = (section: LessonSection & { type: 'reading' }, sectionProgress: SectionProgress) => {
    return (
      <div className="max-w-none">
        {typeof section.content === 'string' ? (
          renderStyledText(section.content, true)
        ) : (
          section.content
        )}
      </div>
    );
  };

  const renderLockedSection = (section: LessonSection, sectionIndex: number) => {
    const previousSection = lesson.sections[sectionIndex - 1];
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        {/* Blurred preview */}
        <div className="filter blur-sm pointer-events-none select-none">
          <div className="h-32 bg-gradient-to-b from-slate-100 to-slate-200 rounded-lg p-6">
            <div className="h-4 bg-slate-300 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-slate-300 rounded w-full mb-2"></div>
            <div className="h-3 bg-slate-300 rounded w-5/6"></div>
          </div>
        </div>

        {/* Lock overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 rounded-lg backdrop-blur-sm">
          <div className="text-center px-6 py-4 bg-white rounded-lg shadow-lg">
            <Lock className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 text-sm">
              Complete <span className="font-semibold">{previousSection.title}</span> to unlock
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderQuizInstructions = (section: QuizSection, sectionProgress: SectionProgress) => {
    const isCompleted = sectionProgress.status === 'completed';
    const isActive = sectionProgress.status === 'in-progress' || sectionProgress.status === 'unlocked';

    return (
      <div className="space-y-4">
        {/* Quiz description/context */}
        <div className="max-w-none text-slate-700">
          <p>
            This quiz tests your understanding of the concepts covered. Answer all questions correctly to unlock the next section.
          </p>
        </div>

        <div className={`p-4 border-l-4 rounded-r-lg ${
          isCompleted 
            ? 'bg-green-50 border-green-500' 
            : 'bg-indigo-50 border-indigo-500'
        }`}>
          <div className="flex items-start gap-3">
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <HelpCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <div className={`mb-1 ${isCompleted ? 'text-green-900' : 'text-indigo-900'}`}>
                {isCompleted ? 'Quiz Completed!' : 'Quiz Challenge'}
              </div>
              <p className={`text-sm ${isCompleted ? 'text-green-800' : 'text-indigo-800'}`}>
                {isCompleted 
                  ? '✓ You\'ve successfully completed this quiz! The next section is now unlocked.' 
                  : 'Answer the questions in the quiz panel on the right to proceed.'}
              </p>
            </div>
          </div>
        </div>
        
        {isActive && !isCompleted && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg"
          >
            <ChevronRight className="w-4 h-4" />
            <span>Answer the quiz on the right to continue →</span>
          </motion.div>
        )}
      </div>
    );
  };

  const renderCheckpointSection = (section: LessonSection & { type: 'checkpoint' }) => {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 3 }}
        >
          <Trophy className="w-12 h-12 text-green-600 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-green-900 mb-2">{section.title}</h3>
        <p className="text-green-800 mb-4">{section.description}</p>
        
        <div className="space-y-2 mb-6">
          {section.requirements.map((req, idx) => {
            const reqProgress = getSectionProgress(req.sectionId);
            const isComplete = reqProgress.status === 'completed';
            
            return (
              <div
                key={idx}
                className={`flex items-center gap-2 text-sm ${
                  isComplete ? 'text-green-700' : 'text-slate-600'
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <div className="w-4 h-4 border-2 border-slate-300 rounded-full" />
                )}
                <span>{req.description}</span>
              </div>
            );
          })}
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <Badge className="bg-green-600 text-white px-4 py-2">
            {section.celebrationMessage}
          </Badge>
        </motion.div>
      </motion.div>
    );
  };

  const renderLeftSection = (section: LessonSection, sectionIndex: number) => {
    const sectionProgress = getSectionProgress(section.id);
    const isUnlocked = isSectionUnlocked(section, sectionIndex, progress, lesson);
    const isCompleted = sectionProgress.status === 'completed';
    const isRequired = isProgressGated(section);

    // Status badge color
    let statusColor = 'bg-slate-500';
    let statusText = 'Locked';
    let statusIcon = <Lock className="w-3 h-3" />;

    if (isCompleted) {
      statusColor = 'bg-green-500';
      statusText = 'Completed';
      statusIcon = <CheckCircle2 className="w-3 h-3" />;
    } else if (sectionProgress.status === 'in-progress') {
      statusColor = 'bg-blue-500';
      statusText = 'In Progress';
      statusIcon = <Clock className="w-3 h-3" />;
    } else if (isUnlocked) {
      statusColor = 'bg-amber-500';
      statusText = 'Unlocked';
      statusIcon = <Unlock className="w-3 h-3" />;
    }

    return (
      <motion.div
        key={section.id}
        ref={(el) => el && sectionRefs.current.set(section.id, el)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`mb-6 overflow-hidden border-2 ${
          isCompleted 
            ? 'border-green-200 bg-green-50/30' 
            : isUnlocked 
            ? 'border-indigo-200' 
            : 'border-slate-200'
        }`}>
          {/* Section Header */}
          <div className={`px-6 py-4 border-b ${
            isCompleted 
              ? 'bg-green-50 border-green-200' 
              : isUnlocked 
              ? 'bg-indigo-50 border-indigo-200' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  isCompleted 
                    ? 'bg-green-100 text-green-600' 
                    : isUnlocked 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {getSectionIcon(section)}
                </div>
                <div>
                  <h3 className={`${
                    isCompleted ? 'text-green-900' : isUnlocked ? 'text-indigo-900' : 'text-slate-400'
                  }`}>
                    {section.title}
                  </h3>
                  {section.type === 'reading' && section.estimatedReadTime && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{section.estimatedReadTime}s read</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isRequired && !isCompleted && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Required
                  </Badge>
                )}
                <Badge className={`${statusColor} text-white`}>
                  {statusIcon}
                  <span className="ml-1">{statusText}</span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Section Content */}
          <div className="px-6 py-6">
            {!isUnlocked ? (
              renderLockedSection(section, sectionIndex)
            ) : section.type === 'reading' ? (
              renderReadingSection(section, sectionProgress)
            ) : section.type === 'quiz' ? (
              renderQuizInstructions(section as QuizSection, sectionProgress)
            ) : section.type === 'checkpoint' ? (
              renderCheckpointSection(section)
            ) : null}
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <>
      {/* Left Panel: Lesson Content */}
      <ScrollArea className="h-full">
        <div className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="space-y-2">
              <div className="flex items-center justify-end text-sm">
                <span className="text-slate-600">{overallProgress}% complete</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
              {typeof lesson.estimatedTime === 'number' && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>Estimated time: {lesson.estimatedTime} minutes</span>
                </div>
              )}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {lesson.sections.map((section, index) => renderLeftSection(section, index))}
          </div>

          {/* Completion Message */}
          {overallProgress === 100 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-8 p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-center"
            >
              <Trophy className="w-12 h-12 mx-auto mb-4" />
              <h2 className="mb-2">Lesson Complete! 🎉</h2>
              <p className="text-green-100">
                You've mastered all sections. Ready for the next challenge?
              </p>
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </>
  );
}

// Export the right panel separately so it can be used in the two-panel layout
export function ProgressiveLessonRightPanel({
  lesson,
  progress,
  onSectionComplete,
  onExerciseAttempt,
}: ProgressiveLessonTwoPanelProps) {
  const getSectionProgress = (sectionId: string): SectionProgress => {
    return progress.sectionsProgress.get(sectionId) || {
      sectionId,
      status: 'locked',
      attempts: 0,
      timeSpent: 0,
    };
  };

  // Get current active quiz section for right panel
  const currentQuizSection = lesson.sections.find(s => {
    const sectionProgress = getSectionProgress(s.id);
    return s.type === 'quiz' && 
           (sectionProgress.status === 'in-progress' || sectionProgress.status === 'unlocked');
  }) as QuizSection | undefined;

  return (
    <RightQuizPanel
      currentQuizSection={currentQuizSection}
      progress={progress}
      onSectionComplete={onSectionComplete}
      onExerciseAttempt={onExerciseAttempt}
      getSectionProgress={getSectionProgress}
    />
  );
}

// Right panel component for quiz answering
function RightQuizPanel({
  currentQuizSection,
  progress,
  onSectionComplete,
  onExerciseAttempt,
  getSectionProgress,
}: {
  currentQuizSection: QuizSection | undefined;
  progress: ProgressiveLessonProgress;
  onSectionComplete: (sectionId: string) => void;
  onExerciseAttempt: (sectionId: string, input: string, success: boolean) => void;
  getSectionProgress: (sectionId: string) => SectionProgress;
}) {
  const [selectedAnswers, setSelectedAnswers] = useState<Map<string, number>>(new Map());
  const [showExplanations, setShowExplanations] = useState<Set<string>>(new Set());

  // Reset state when quiz section changes
  useEffect(() => {
    if (currentQuizSection) {
      setSelectedAnswers(new Map());
      setShowExplanations(new Set());
    }
  }, [currentQuizSection?.id]);

  if (!currentQuizSection) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="text-center p-8 max-w-md">
          <HelpCircle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-slate-700 mb-2">No Active Quiz</h3>
          <p className="text-sm">
            Complete the reading sections on the left to unlock quiz challenges.
          </p>
        </div>
      </div>
    );
  }

  const sectionProgress = getSectionProgress(currentQuizSection.id);
  const isCompleted = sectionProgress.status === 'completed';

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (isCompleted) return;
    setSelectedAnswers(prev => new Map(prev).set(questionId, optionIndex));
  };

  const handleSubmit = () => {
    // Check if all questions are answered correctly
    const allCorrect = currentQuizSection.questions.every(q => {
      const selected = selectedAnswers.get(q.id);
      return selected === q.correctAnswer;
    });

    if (allCorrect) {
      setShowExplanations(new Set(currentQuizSection.questions.map(q => q.id)));
      onSectionComplete(currentQuizSection.id);
    } else {
      // Show only the first incorrect answer's explanation
      const firstIncorrect = currentQuizSection.questions.find(q => {
        const selected = selectedAnswers.get(q.id);
        return selected !== undefined && selected !== q.correctAnswer;
      });
      if (firstIncorrect) {
        setShowExplanations(new Set([firstIncorrect.id]));
        onExerciseAttempt(currentQuizSection.id, String(selectedAnswers.get(firstIncorrect.id)), false);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b px-6 py-4 bg-indigo-50">
        <div className="flex items-center gap-3 mb-1">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="text-indigo-900">{currentQuizSection.title}</h3>
        </div>
        {isCompleted && (
          <Badge className="bg-green-600 text-white">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )}
      </div>

      {/* Quiz Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {currentQuizSection.questions.map((question, qIndex) => {
            const selected = selectedAnswers.get(question.id);
            const isAnswered = selected !== undefined;
            const isCorrect = selected === question.correctAnswer;
            const showExplanation = showExplanations.has(question.id);

            return (
              <div key={question.id} className="space-y-4">
                {/* Question */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm">
                    {qIndex + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-900 mb-4 whitespace-pre-wrap">
                      {question.question}
                    </div>

                    {/* Options */}
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = selected === optionIndex;
                        const isCorrectOption = optionIndex === question.correctAnswer;
                        const showResult = isCompleted || (isAnswered && showExplanation);

                        return (
                          <button
                            key={optionIndex}
                            onClick={() => handleAnswerSelect(question.id, optionIndex)}
                            disabled={isCompleted}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                              showResult && isCorrectOption
                                ? 'border-green-500 bg-green-50'
                                : showResult && isSelected && !isCorrect
                                ? 'border-red-500 bg-red-50'
                                : isSelected
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                            } ${isCompleted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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
                                  ? 'text-green-900'
                                  : showResult && isSelected && !isCorrect
                                  ? 'text-red-900'
                                  : isSelected
                                  ? 'text-indigo-900'
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
                        className={`mt-4 p-4 rounded-lg ${
                          isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className="text-base text-slate-700 leading-7 whitespace-pre-wrap">
                              {question.explanation}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Submit Button */}
      {!isCompleted && (
        <div className="border-t px-6 py-4 bg-slate-50">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const correctAnswers = new Map<string, number>();
                currentQuizSection.questions.forEach(q => {
                  correctAnswers.set(q.id, q.correctAnswer);
                });
                setSelectedAnswers(correctAnswers);
              }}
              className="bg-yellow-100 hover:bg-yellow-200 border-yellow-400"
            >
              Show Answers
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswers.size < currentQuizSection.questions.length}
              className="flex-1"
              size="lg"
            >
              {selectedAnswers.size < currentQuizSection.questions.length
                ? `Answer ${currentQuizSection.questions.length - selectedAnswers.size} more question${currentQuizSection.questions.length - selectedAnswers.size === 1 ? '' : 's'}`
                : 'Submit Answer'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
