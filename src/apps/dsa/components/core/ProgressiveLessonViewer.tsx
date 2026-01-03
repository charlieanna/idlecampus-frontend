import { EnhancedReadingSection } from './EnhancedReadingSection';
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
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  ProgressiveLesson,
  LessonSection,
  ProgressiveLessonProgress,
  SectionProgress,
  isSectionUnlocked,
  isProgressGated,
  calculateLessonProgress,
  ExerciseSection,
  QuizSection,
} from '../../types/progressive-lesson-enhanced';
import { renderStyledText } from '../../utils/styledTextRenderer';

interface ProgressiveLessonViewerProps {
  lesson: ProgressiveLesson;
  progress: ProgressiveLessonProgress;
  onSectionComplete: (sectionId: string) => void;
  onExerciseAttempt: (sectionId: string, input: string, success: boolean) => void;
  renderExercise?: (section: ExerciseSection, sectionProgress: SectionProgress) => React.ReactNode;
}

export function ProgressiveLessonViewer({
  lesson,
  progress,
  onSectionComplete,
  onExerciseAttempt,
  renderExercise,
}: ProgressiveLessonViewerProps) {
  const [expandedHints, setExpandedHints] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const overallProgress = calculateLessonProgress(lesson, progress);

  // Auto-scroll to current section
  useEffect(() => {
    const currentSection = lesson.sections[progress.currentSectionIndex];
    const ref = sectionRefs.current.get(currentSection?.id);
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [progress.currentSectionIndex]);

  const getSectionIcon = (section: LessonSection) => {
    switch (section.type) {
      case 'reading':
        return <BookOpen className="w-4 h-4" />;
      case 'exercise':
        return <Code className="w-4 h-4" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4" />;
      case 'checkpoint':
        return <Trophy className="w-4 h-4" />;
    }
  };

  const getSectionProgress = (sectionId: string): SectionProgress => {
    return progress.sectionsProgress.get(sectionId) || {
      sectionId,
      status: 'locked',
      attempts: 0,
      timeSpent: 0,
    };
  };

  const renderReadingSection = (section: LessonSection & { type: 'reading' }, sectionProgress: SectionProgress) => {
    const isCompleted = sectionProgress.status === 'completed';

    return (
      <EnhancedReadingSection
        content={section.content}
        isCompleted={isCompleted}
        onComplete={() => onSectionComplete(section.id)}
      />
    );
  };

  const renderExerciseSection = (section: ExerciseSection, sectionProgress: SectionProgress) => {
    const isCompleted = sectionProgress.status === 'completed';
    const attempts = sectionProgress.attempts;

    // Show hints that are unlocked
    const availableHints = section.hints.filter(h => attempts >= h.afterAttempt);
    const solutionUnlocked = section.solution && attempts >= section.solution.afterAttempt;

    // Use custom renderer if provided, otherwise show basic UI
    if (renderExercise) {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg">
            {renderStyledText(section.instruction, true)}
          </div>

          {section.targetComplexity && (
            <div className="p-4 bg-slate-50 border rounded-lg">
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Complexity Focus</div>
              <div className="text-sm text-slate-800">
                <span className="font-medium">Time:</span> {section.targetComplexity.time} &nbsp;•&nbsp; <span className="font-medium">Space:</span> {section.targetComplexity.space}
              </div>
              {section.targetComplexity.notes && (
                <div className="text-xs text-slate-600 mt-1">{section.targetComplexity.notes}</div>
              )}
            </div>
          )}

          {renderExercise(section, sectionProgress)}

          {attempts > 0 && (
            <div className="text-sm text-slate-600">
              Attempts: {attempts}
            </div>
          )}

          {/* Hints */}
          {availableHints.length > 0 && (
            <div className="space-y-2">
              {availableHints.map((hint, idx) => (
                <SocraticHint key={idx} hint={hint} index={idx} />
              ))}
            </div>
          )}

          {/* Solution */}
          {solutionUnlocked && section.solution && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-slate-900 rounded-lg"
            >
              <div className="flex items-start gap-2 mb-2">
                <Eye className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-amber-400 text-sm">Solution:</div>
              </div>
              <pre className="text-green-400 text-sm overflow-x-auto">
                {section.solution.text}
              </pre>
            </motion.div>
          )}

          {/* Solution Explanation - Time Complexity Analysis */}
          {isCompleted && section.solutionExplanation && (
            <ComplexityAnalysisReveal explanation={section.solutionExplanation} />
          )}
        </div>
      );
    }

    return null;
  };

  // Component to ask user about complexity before revealing analysis
  const ComplexityAnalysisReveal = ({ explanation }: { explanation: string }) => {
    const [showExplanation, setShowExplanation] = useState(false);
    const [answers, setAnswers] = useState<Map<string, string>>(new Map());
    const [allAnswered, setAllAnswered] = useState(false);

    // Extract function names from the explanation to ask about
    const extractFunctions = (text: string): string[] => {
      const functionPattern = /\*\*([a-zA-Z_]+\([^)]*\))\*\*:\s*O\(/g;
      const functions: string[] = [];
      let match;
      while ((match = functionPattern.exec(text)) !== null) {
        functions.push(match[1]);
      }
      return functions.length > 0 ? functions : ['main operation'];
    };

    const functions = extractFunctions(explanation);
    const complexityOptions = ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'];

    const handleAnswer = (func: string, answer: string) => {
      const newAnswers = new Map(answers);
      newAnswers.set(func, answer);
      setAnswers(newAnswers);

      // Check if all functions answered
      if (newAnswers.size === functions.length) {
        setAllAnswered(true);
        setTimeout(() => setShowExplanation(true), 800);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Question Phase */}
        {!showExplanation && (
          <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <div className="text-blue-900 font-semibold">🤔 Before we continue...</div>
            </div>
            <p className="text-slate-800 mb-4">
              You just implemented the solution. What's the <strong>time complexity</strong> of each function?
            </p>

            <div className="space-y-4">
              {functions.map((func) => (
                <div key={func} className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="font-mono text-sm text-blue-900 mb-3">{func}</div>
                  <div className="grid grid-cols-4 gap-2">
                    {complexityOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(func, option)}
                        disabled={answers.has(func)}
                        className={`p-2 rounded border-2 text-xs font-mono transition-all ${answers.get(func) === option
                            ? 'border-blue-500 bg-blue-100 text-blue-900'
                            : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                          } ${answers.has(func) ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {allAnswered && (
              <div className="mt-4 text-center text-blue-700 text-sm">
                ✓ Great! Let's see the analysis...
              </div>
            )}

            {!allAnswered && (
              <button
                onClick={() => setShowExplanation(true)}
                className="mt-4 text-sm text-slate-500 hover:text-slate-700 underline"
              >
                Skip and reveal analysis →
              </button>
            )}
          </div>
        )}

        {/* Explanation Phase */}
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <div className="text-amber-900 font-semibold">Complexity Analysis</div>
            </div>
            <div className="prose prose-sm max-w-none text-slate-800">
              {renderStyledText(explanation, true)}
            </div>
          </motion.div>
        )}
      </motion.div>
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
                className={`flex items-center gap-2 text-sm ${isComplete ? 'text-green-700' : 'text-slate-600'
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

  const renderQuizSection = (section: QuizSection, sectionProgress: SectionProgress) => {
    const [selectedAnswers, setSelectedAnswers] = useState<Map<string, number>>(new Map());
    const [showExplanations, setShowExplanations] = useState<Set<string>>(new Set());
    const isCompleted = sectionProgress.status === 'completed';

    const handleAnswerSelect = (questionId: string, optionIndex: number) => {
      if (isCompleted) return; // Don't allow changes after completion
      setSelectedAnswers(prev => new Map(prev).set(questionId, optionIndex));
    };

    const handleSubmit = () => {
      // Check if all questions are answered correctly
      const allCorrect = section.questions.every(q => {
        const selected = selectedAnswers.get(q.id);
        return selected === q.correctAnswer;
      });

      if (allCorrect) {
        setShowExplanations(new Set(section.questions.map(q => q.id)));
        onSectionComplete(section.id);
      } else {
        // Show only the first incorrect answer's explanation
        const firstIncorrect = section.questions.find(q => {
          const selected = selectedAnswers.get(q.id);
          return selected !== undefined && selected !== q.correctAnswer;
        });
        if (firstIncorrect) {
          setShowExplanations(new Set([firstIncorrect.id]));
          onExerciseAttempt(section.id, String(selectedAnswers.get(firstIncorrect.id)), false);
        }
      }
    };

    return (
      <div className="space-y-6">
        {section.questions.map((question, qIndex) => {
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
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${showResult && isCorrectOption
                              ? 'border-green-500 bg-green-50'
                              : showResult && isSelected && !isCorrect
                                ? 'border-red-500 bg-red-50'
                                : isSelected
                                  ? 'border-indigo-500 bg-indigo-50'
                                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                            } ${isCompleted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${showResult && isCorrectOption
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
                            <span className={`flex-1 ${showResult && isCorrectOption
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
                      className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                        }`}
                    >
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 whitespace-pre-wrap">
                          {question.explanation}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Submit Button */}
        {!isCompleted && (
          <div className="pt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const correctAnswers = new Map<string, number>();
                section.questions.forEach(q => {
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
              disabled={selectedAnswers.size < section.questions.length}
              className="flex-1"
              size="lg"
            >
              {selectedAnswers.size < section.questions.length
                ? `Answer ${section.questions.length - selectedAnswers.size} more question${section.questions.length - selectedAnswers.size === 1 ? '' : 's'}`
                : 'Submit Answer'}
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderSection = (section: LessonSection, sectionIndex: number) => {
    const sectionProgress = getSectionProgress(section.id);
    const isUnlocked = isSectionUnlocked(section, sectionIndex, progress, lesson);
    const isCompleted = sectionProgress.status === 'completed';
    const isPracticeOnlyExercise =
      section.type === 'exercise' && (section as ExerciseSection).isPracticeOnly;
    const isRequired = !isPracticeOnlyExercise && isProgressGated(section);

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
        <Card className={`mb-6 overflow-hidden border-2 ${isCompleted
            ? 'border-green-200 bg-green-50/30'
            : isUnlocked
              ? 'border-indigo-200'
              : 'border-slate-200'
          }`}>
          {/* Section Header */}
          <div className={`px-6 py-4 border-b ${isCompleted
              ? 'bg-green-50 border-green-200'
              : isUnlocked
                ? 'bg-indigo-50 border-indigo-200'
                : 'bg-slate-50 border-slate-200'
            }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isCompleted
                    ? 'bg-green-100 text-green-600'
                    : isUnlocked
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                  {getSectionIcon(section)}
                </div>
                <div>
                  <h3 className={`${isCompleted ? 'text-green-900' : isUnlocked ? 'text-indigo-900' : 'text-slate-400'
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

              <div className="flex items-center flex-wrap gap-2">
                {isRequired && !isCompleted && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Required
                  </Badge>
                )}
                {isPracticeOnlyExercise && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                    Smart Practice
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
            ) : section.type === 'exercise' ? (
              <>
                {isPracticeOnlyExercise && (
                  <div className="mb-4 rounded-lg border border-dashed border-purple-300 bg-purple-50/70 p-4 text-sm text-purple-900">
                    Optional Smart Practice drill — use it to reinforce the pattern, but it won’t block your progress.
                  </div>
                )}
                {renderExerciseSection(section as ExerciseSection, sectionProgress)}
              </>
            ) : section.type === 'quiz' ? (
              renderQuizSection(section as QuizSection, sectionProgress)
            ) : section.type === 'checkpoint' ? (
              renderCheckpointSection(section)
            ) : null}
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="w-full">
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
        {lesson.sections.map((section, index) => renderSection(section, index))}
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
          <Button className="mt-4 bg-white/90 hover:bg-white text-green-700 font-semibold shadow-md">
            Continue to Next Lesson
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// Socratic Hint Component
function SocraticHint({ hint, index }: { hint: any; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSocratic = !!hint.question;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-r-lg border-l-4 ${isSocratic
          ? 'bg-blue-50 border-blue-400'
          : 'bg-yellow-50 border-yellow-400'
        }`}
    >
      <div className="flex items-start gap-2">
        {isSocratic ? (
          <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        ) : (
          <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
        )}
        <div className="flex-1">
          <div className={`text-sm mb-1 ${isSocratic ? 'text-blue-900' : 'text-yellow-900'}`}>
            {isSocratic ? '🤔' : '💡'} Hint {index + 1}:
          </div>
          {isSocratic ? (
            <>
              <p className={`text-blue-800 font-medium`}>{hint.question}</p>
              {hint.thinkAbout && hint.thinkAbout.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-1 text-sm text-blue-700 hover:text-blue-900 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <span className="font-medium">Think about this...</span>
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 pl-5 space-y-2"
                      >
                        {hint.thinkAbout.map((item: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-blue-600 text-xs mt-1">→</span>
                            <p className="text-sm text-blue-700">{item}</p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </>
          ) : (
            <p className="text-yellow-800">{hint.text}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
