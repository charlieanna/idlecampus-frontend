/**
 * LessonContentPanel Component
 *
 * Renders the top panel content for exercise-based lessons.
 * Handles both reading sections and exercise sections with:
 * - Section navigation
 * - Progress tracking
 * - Content rendering based on section type
 * - Quick quiz and practice exercise integration
 *
 * This component manages the instructional content side of the lesson.
 * Users read the lesson content here first, then scroll down to the
 * code editor panel below when ready to practice.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, ChevronLeft, ChevronDown, Target, Lightbulb, Code } from 'lucide-react';
import { EnhancedReadingSection } from '../core/EnhancedReadingSection';
import { Button } from '../ui/button';
import { renderStyledText } from '../../utils/styledTextRenderer';
import { isSectionUnlocked, calculateLessonProgress } from '../../types/progressive-lesson-enhanced';
import type { LessonContentPanelProps } from './types';
import type { ExerciseSection, SectionProgress } from '../../types/progressive-lesson-enhanced';

const LessonContentPanel: React.FC<LessonContentPanelProps> = ({
  currentSection,
  activeSectionIdx,
  progressiveLesson,
  runPythonCode,
  // State management props
  progressiveLessonProgress,
  setProgressiveLessonProgress,
  expandedLessons,
  setExpandedLessons,
  hintsUsed,
  setHintsUsed,
  collapsedDescriptions,
  setCollapsedDescriptions,
  bruteForceSolved,
  setBruteForceSolved,
  showBruteForceBlocker,
  setShowBruteForceBlocker,
  highlightBruteForceBlocker,
  setHighlightBruteForceBlocker,
  exercisesAwaitingAnalysis,
  setExercisesAwaitingAnalysis,
  exercisesWithBeforeQuizCompleted,
  setExercisesWithBeforeQuizCompleted,
  showingBeforeQuizExplanation,
  setShowingBeforeQuizExplanation,
  readingQuizAnswers,
  setReadingQuizAnswers,
  progressiveQuizIndex,
  setProgressiveQuizIndex,
  showLinkedListPractice,
  setShowLinkedListPractice,
  setCurrentModuleIndex,
  setCurrentPracticeModule,
  onNavigateToSmartPractice,
}) => {
  /**
   * Get section progress for the current section
   */
  const getSectionProgress = (): SectionProgress => {
    return progressiveLessonProgress.sectionsProgress.get(currentSection.id) || {
      sectionId: currentSection.id,
      status: 'locked',
      attempts: 0,
      timeSpent: 0,
    };
  };

  /**
   * Render appropriate content based on section type
   */
  const renderSectionContent = () => {
    const sectionProgress = getSectionProgress();
    const isCompleted = sectionProgress.status === 'completed';

    switch (currentSection.type) {
      case 'reading':
        // Check if this is the last section of the backtracking lesson
        const isLastSection = activeSectionIdx === progressiveLesson.sections.length - 1;
        const isBacktrackingLesson = progressiveLesson.id === 'backtracking-decision-trees';
        const shouldShowPracticeButton = isLastSection && isBacktrackingLesson && setCurrentModuleIndex && setCurrentPracticeModule;

        const handlePracticeClick = () => {
          if (onNavigateToSmartPractice) {
            onNavigateToSmartPractice(11); // Module 11 is Backtracking
          } else if (setCurrentPracticeModule) {
            // Fallback: just set the practice module
            setCurrentPracticeModule(11);
          }
        };

        const practiceButton = shouldShowPracticeButton ? (
          <Button
            onClick={handlePracticeClick}
            className="mt-6 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <Target className="w-5 h-5" />
            Practice Backtracking Problems
          </Button>
        ) : null;

        return (
          <div className="p-6">
            <EnhancedReadingSection
              content={currentSection.content}
              isCompleted={isCompleted}
              onComplete={() => {
                // Mark reading section as complete and unlock next section
                const newSectionsProgress = new Map(progressiveLessonProgress.sectionsProgress);

                // Mark current section as completed
                newSectionsProgress.set(currentSection.id, {
                  sectionId: currentSection.id,
                  status: 'completed',
                  attempts: sectionProgress.attempts,
                  timeSpent: sectionProgress.timeSpent,
                });

                // Unlock the next section if it exists
                const nextSectionIndex = activeSectionIdx + 1;
                if (nextSectionIndex < progressiveLesson.sections.length) {
                  const nextSection = progressiveLesson.sections[nextSectionIndex];
                  const nextSectionProgress = newSectionsProgress.get(nextSection.id);

                  // Only unlock if not already unlocked or completed
                  if (!nextSectionProgress || nextSectionProgress.status === 'locked') {
                    newSectionsProgress.set(nextSection.id, {
                      sectionId: nextSection.id,
                      status: 'unlocked',
                      attempts: 0,
                      timeSpent: 0,
                    });
                  }

                  // Auto-navigate to next section
                  setProgressiveLessonProgress({
                    ...progressiveLessonProgress,
                    currentSectionIndex: nextSectionIndex,
                    sectionsProgress: newSectionsProgress,
                  });
                  // Scroll to top of the page when navigating to next section
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  // No next section, just update progress
                  setProgressiveLessonProgress({
                    ...progressiveLessonProgress,
                    sectionsProgress: newSectionsProgress,
                  });
                }
              }}
              customAction={practiceButton}
            />
          </div>
        );

      case 'exercise':
        const exerciseSection = currentSection as ExerciseSection;
        const attempts = sectionProgress.attempts;

        // Check if solution should be shown based on attempts
        const solutionAfterAttempt = typeof exerciseSection.solution === 'object' && exerciseSection.solution?.afterAttempt
          ? exerciseSection.solution.afterAttempt
          : null;
        const shouldShowSolutionByAttempts = solutionAfterAttempt !== null && attempts >= solutionAfterAttempt;

        // Check if we should show complexity analysis
        const quizPlacement = exerciseSection.complexityQuizPlacement || 'after';
        const hasBeforeQuizCompleted = exercisesWithBeforeQuizCompleted.has(exerciseSection.id);
        // Show complexity analysis if:
        // 1. Exercise is completed OR solution should be shown by attempts
        // 2. Has solutionExplanation
        // 3. Placement is 'after' (or not specified, defaults to 'after')
        // 4. Not already showing before quiz explanation
        const shouldShowAfterQuiz = (isCompleted || shouldShowSolutionByAttempts) &&
          exerciseSection.solutionExplanation &&
          quizPlacement === 'after' &&
          showingBeforeQuizExplanation !== exerciseSection.id;

        // Use useEffect to unlock next section when solution should be shown by attempts
        React.useEffect(() => {
          if (shouldShowSolutionByAttempts && !isCompleted) {
            const nextIndex = activeSectionIdx + 1;
            if (nextIndex < progressiveLesson.sections.length) {
              const nextSection = progressiveLesson.sections[nextIndex];
              // Check current attempts from the latest progress
              const currentProgress = progressiveLessonProgress.sectionsProgress.get(exerciseSection.id);
              const currentAttempts = currentProgress?.attempts || 0;
              
              // Double-check that attempts are sufficient
              const solutionAfterAttempt = typeof exerciseSection.solution === 'object' && exerciseSection.solution !== null && 'afterAttempt' in exerciseSection.solution
                ? (exerciseSection.solution as { afterAttempt: number }).afterAttempt
                : null;
              
              if (solutionAfterAttempt !== null && currentAttempts >= solutionAfterAttempt) {
                if (!progressiveLessonProgress.sectionsProgress.has(nextSection.id)) {
                  // Unlock next section when solution is shown
                  const updatedSectionProgress = new Map(progressiveLessonProgress.sectionsProgress);
                  updatedSectionProgress.set(nextSection.id, {
                    sectionId: nextSection.id,
                    status: 'unlocked',
                    attempts: 0,
                    timeSpent: 0,
                  });
                  setProgressiveLessonProgress({
                    ...progressiveLessonProgress,
                    sectionsProgress: updatedSectionProgress,
                  });
                }
              }
            }
          }
        }, [shouldShowSolutionByAttempts, isCompleted, activeSectionIdx, exerciseSection.id, attempts]);

        return (
          <div className="p-6 space-y-4 w-full min-w-0" style={{ width: '100%', minWidth: 0, maxWidth: '100%' }}>
            {/* Exercise Header - Title, Difficulty, Description */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{exerciseSection.title}</h2>
                {exerciseSection.difficulty && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    exerciseSection.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    exerciseSection.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {exerciseSection.difficulty.charAt(0).toUpperCase() + exerciseSection.difficulty.slice(1)}
                  </span>
                )}
              </div>
              {exerciseSection.description && (
                <p className="text-gray-600 text-sm mb-0">{exerciseSection.description}</p>
              )}
            </div>

            {/* Exercise Instruction - Always visible, especially after completion */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm w-full min-w-0" style={{ width: '100%', minWidth: 0, maxWidth: '100%' }}>
              {/* Always show problem description - make it non-collapsible when completed */}
              {isCompleted ? (
                /* Always show problem description when exercise is completed */
                <div className="p-4 bg-indigo-50">
                  <div className="mb-3">
                    <span className="font-semibold text-gray-700 text-base">Problem Description</span>
                  </div>
                  {renderStyledText(exerciseSection.instruction || exerciseSection.description || '', true)}
                </div>
              ) : (
                /* Always show instruction for exercises - make it non-collapsible or expanded by default */
                <>
                  {exerciseSection.instruction ? (
                    /* If instruction exists, show it directly (non-collapsible) */
                    <div className="p-4 bg-indigo-50">
                      <div className="mb-3">
                        <span className="font-semibold text-gray-700 text-base">Problem Description</span>
                      </div>
                      {renderStyledText(exerciseSection.instruction, true)}
                    </div>
                  ) : (
                    /* Fallback: collapsible if only description exists */
                    <>
                      <button
                        onClick={() => {
                          const newCollapsed = new Set(collapsedDescriptions);
                          if (newCollapsed.has(exerciseSection.id)) {
                            newCollapsed.delete(exerciseSection.id);
                          } else {
                            newCollapsed.add(exerciseSection.id);
                          }
                          setCollapsedDescriptions(newCollapsed);
                        }}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <span className="font-semibold text-gray-700">Problem Description</span>
                        {collapsedDescriptions.has(exerciseSection.id) ? (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>

                      {/* Show description - expanded by default for exercises (not in collapsed set) */}
                      {!collapsedDescriptions.has(exerciseSection.id) && (
                        <div className="p-4 bg-indigo-50 border-t border-gray-200">
                          {renderStyledText(exerciseSection.description || '', true)}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Hints Section - Show hints based on hintsUsed count */}
            {!isCompleted && exerciseSection.hints && exerciseSection.hints.length > 0 && (hintsUsed.get(exerciseSection.id) || 0) > 0 && (
              <div
                className="p-4 bg-amber-50 border border-amber-200 rounded-lg"
                data-hints-section={exerciseSection.id}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Hints</span>
                </div>
                <div className="space-y-2">
                  {exerciseSection.hints
                    .filter((hint: { afterAttempt: number; text: string }) =>
                      hint.afterAttempt <= (hintsUsed.get(exerciseSection.id) || 0)
                    )
                    .map((hint: { afterAttempt: number; text: string }, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-amber-900">
                        <span className="font-medium text-amber-600 flex-shrink-0">#{idx + 1}:</span>
                        <span>{hint.text}</span>
                      </div>
                    ))
                  }
                </div>
                {/* Show how many more hints are available */}
                {(() => {
                  const currentHintCount = hintsUsed.get(exerciseSection.id) || 0;
                  const totalHints = exerciseSection.hints.length;
                  const shownHints = exerciseSection.hints.filter(
                    (h: { afterAttempt: number }) => h.afterAttempt <= currentHintCount
                  ).length;
                  const remainingHints = totalHints - shownHints;
                  if (remainingHints > 0) {
                    return (
                      <div className="mt-3 text-xs text-amber-600">
                        {remainingHints} more hint{remainingHints > 1 ? 's' : ''} available - click "Hint" button again
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}

            {/* Target Complexity */}
            {exerciseSection.targetComplexity && (
              <div className="p-4 bg-slate-50 border rounded-lg">
                <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Complexity Focus</div>
                <div className="text-sm text-slate-800">
                  <span className="font-medium">Time:</span> {exerciseSection.targetComplexity.time} &nbsp;•&nbsp; <span className="font-medium">Space:</span> {exerciseSection.targetComplexity.space}
                </div>
                {exerciseSection.targetComplexity.notes && (
                  <div className="text-xs text-slate-600 mt-1">{exerciseSection.targetComplexity.notes}</div>
                )}
              </div>
            )}

            {/* Completion Status */}
            {isCompleted && (
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-semibold">✓ Exercise Completed!</span>
                </div>
              </div>
            )}

            {/* Attempts counter */}
            {attempts > 0 && (
              <div className="text-sm text-slate-600">
                Attempts: {attempts}
              </div>
            )}

            {/* Solution - Show if attempts >= afterAttempt or if completed */}
            {(() => {
              const solutionAfterAttempt = typeof exerciseSection.solution === 'object' && exerciseSection.solution?.afterAttempt
                ? exerciseSection.solution.afterAttempt
                : null;
              const shouldShowSolution = solutionAfterAttempt !== null && attempts >= solutionAfterAttempt;
              
              if (shouldShowSolution && exerciseSection.solution) {
                const solutionText = typeof exerciseSection.solution === 'string'
                  ? exerciseSection.solution
                  : exerciseSection.solution.text || '';
                
                return (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 w-full min-w-0"
                    data-solution-section={exerciseSection.id}
                    style={{ width: '100%', minWidth: 0, maxWidth: '100%' }}
                  >
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 shadow-lg w-full min-w-0" style={{ width: '100%', minWidth: 0, maxWidth: '100%' }}>
                      <div className="flex items-center gap-2 mb-4">
                        <Code className="w-5 h-5 text-blue-600" />
                        <div className="text-blue-900 font-semibold text-lg">Solution</div>
                      </div>
                      <div className="prose prose-sm max-w-none text-slate-800 overflow-x-auto w-full min-w-0" style={{ width: '100%', minWidth: 0, maxWidth: '100%', overflowX: 'auto' }}>
                        <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto"><code>{solutionText}</code></pre>
                      </div>
                    </div>
                  </motion.div>
                );
              }
              return null;
            })()}

            {/* Solution Explanation - Show after completion if placement is 'after' */}
            {shouldShowAfterQuiz && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 w-full min-w-0"
                data-solution-section={exerciseSection.id}
                style={{ width: '100%', minWidth: 0, maxWidth: '100%' }}
              >
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-6 shadow-lg w-full min-w-0" style={{ width: '100%', minWidth: 0, maxWidth: '100%' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-amber-600" />
                    <div className="text-amber-900 font-semibold text-lg">Solution Explanation</div>
                  </div>
                  <div className="prose prose-sm max-w-none text-slate-800 overflow-x-auto w-full min-w-0" style={{ width: '100%', minWidth: 0, maxWidth: '100%', overflowX: 'auto' }}>
                    {renderStyledText(exerciseSection.solutionExplanation || '', true)}
                  </div>
                </div>

                {/* Next Challenge Button - REMOVED to avoid duplication with footer Next button
                {(() => {
                  const nextIndex = activeSectionIdx + 1;
                  const hasNext = nextIndex < progressiveLesson.sections.length;
                  if (!hasNext) return null;

                  const nextSection = progressiveLesson.sections[nextIndex];
                  return (
                    <Button
                      onClick={() => {
                        const newSectionsProgress = new Map(progressiveLessonProgress.sectionsProgress);
                        // Ensure next section is unlocked
                        const nextProgress = newSectionsProgress.get(nextSection.id);
                        if (!nextProgress || nextProgress.status === 'locked') {
                          newSectionsProgress.set(nextSection.id, {
                            sectionId: nextSection.id,
                            status: 'unlocked',
                            attempts: 0,
                            timeSpent: 0,
                          });
                        }
                        setProgressiveLessonProgress({
                          ...progressiveLessonProgress,
                          currentSectionIndex: nextIndex,
                          sectionsProgress: newSectionsProgress,
                        });
                      }}
                      className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      Next Challenge
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  );
                })()}
                */}
              </motion.div>
            )}
          </div>
        );

      case 'quiz':
        // Quiz sections are handled differently (not in left panel)
        return (
          <div className="p-6">
            <div className="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg">
              <p className="text-indigo-800">
                Answer the quiz questions in the right panel to proceed.
              </p>
            </div>
          </div>
        );

      case 'checkpoint':
        return (
          <div className="p-6">
            <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg text-center">
              {currentSection.description && (
                <p className="text-green-800 mb-4">{currentSection.description}</p>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <p className="text-gray-500">
              Unknown section type: {(currentSection as any).type}
            </p>
          </div>
        );
    }
  };

  /**
   * Render section navigation
   * TODO: Implement full navigation logic in Phase 2
   */
  const renderSectionNavigation = () => {
    return (
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Section {activeSectionIdx + 1} of {progressiveLesson.sections.length}
            </span>
            <span className="text-sm font-medium">
              {currentSection.title}
            </span>
          </div>
          <div className="flex space-x-2">
            {/* Navigation buttons will be added in Phase 2 */}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render progress indicator
   */
  const renderProgressIndicator = () => {
    // Calculate overall progress using the helper function
    const overallProgress = calculateLessonProgress(progressiveLesson, progressiveLessonProgress);

    return (
      <div className="px-4 py-2 border-b border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{Math.round(overallProgress)}%</span>
        </div>
        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden min-w-0">
      {/* Progress Indicator */}
      {renderProgressIndicator()}

      {/* Section Navigation */}
      {renderSectionNavigation()}

      {/* Section Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-8">
        {renderSectionContent()}
      </div>

      {/* Footer with navigation controls */}
      <div className="border-t border-gray-200 p-4 bg-slate-50">
        <div className="flex justify-end items-center">
          {/* Show Next button only when current exercise is completed (all tests pass) */}
          {(() => {
            const nextIndex = activeSectionIdx + 1;
            const hasNext = nextIndex < progressiveLesson.sections.length;
            if (!hasNext) return null;

            const nextSection = progressiveLesson.sections[nextIndex];
            const sectionProgress = getSectionProgress();
            const isCurrentCompleted = sectionProgress.status === 'completed';

            // Debug: Log completion status (remove in production)
            // console.log('Section progress:', sectionProgress, 'Is completed:', isCurrentCompleted);

            // Show Next button ONLY when current exercise is completed (all tests pass)
            if (isCurrentCompleted) {
              return (
                <button
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-sm transition-all hover:shadow-md"
                  onClick={() => {
                    const newSectionsProgress = new Map(progressiveLessonProgress.sectionsProgress);
                    
                    // Unlock next section if not already unlocked
                    if (!newSectionsProgress.has(nextSection.id)) {
                      newSectionsProgress.set(nextSection.id, {
                        sectionId: nextSection.id,
                        status: 'unlocked',
                        attempts: 0,
                        timeSpent: 0,
                      });
                    }
                    
                    // Navigate to next section
                    setProgressiveLessonProgress({
                      ...progressiveLessonProgress,
                      currentSectionIndex: nextIndex,
                      sectionsProgress: newSectionsProgress,
                    });
                  }}
                >
                  Next: {nextSection.title.length > 30 ? nextSection.title.substring(0, 30) + '...' : nextSection.title}
                  <ChevronRight className="w-4 h-4" />
                </button>
              );
            }
            return null;
          })()}
        </div>
      </div>
    </div>
  );
};

export default LessonContentPanel;