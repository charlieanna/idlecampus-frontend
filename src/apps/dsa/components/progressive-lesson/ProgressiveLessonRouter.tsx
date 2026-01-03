/**
 * ProgressiveLessonRouter Component
 * 
 * Main routing component that determines which lesson type to render:
 * - Exercise-based lessons (with ResizablePanelGroup)
 * - Quiz-based lessons (with CKAD components)
 * - Reading-only lessons (simple content display)
 * 
 * This component handles the top-level routing logic for progressive lessons
 * and delegates to the appropriate sub-components based on lesson type.
 */

import React from 'react';
import type { ProgressiveLessonRouterProps } from './types';
import ExerciseBasedLesson from './ExerciseBasedLesson';
import QuizBasedLesson from './QuizBasedLesson';
import ReadingOnlyLesson from './ReadingOnlyLesson';

const ProgressiveLessonRouter: React.FC<ProgressiveLessonRouterProps> = ({
  progressiveLesson,
  currentModuleIndex,
  colors,
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
}) => {
  /**
   * Determine layout type based on CURRENT section type
   *
   * This routes to different layouts per-section rather than per-lesson:
   * - 'reading' sections -> Full-screen reading content (no code editor)
   * - 'exercise' sections -> LeetCode-style horizontal split (problem | editor)
   * - 'quiz' sections -> Quiz-based layout
   * - 'checkpoint' sections -> Reading layout
   */
  const determinePageType = () => {
    // Get current section based on progress
    const currentIndex = progressiveLessonProgress?.currentSectionIndex ?? 0;
    const safeIndex = Math.max(0, Math.min(currentIndex, progressiveLesson.sections.length - 1));
    const currentSection = progressiveLesson.sections[safeIndex];

    // Route based on current section type
    switch (currentSection.type) {
      case 'exercise':
        return 'exercise';
      case 'quiz':
        return 'quiz';
      case 'reading':
      case 'checkpoint':
      default:
        return 'reading';
    }
  };

  const pageType = determinePageType();

  // Render based on lesson type
  switch (pageType) {
    case 'exercise':
      return (
        <ExerciseBasedLesson
          progressiveLesson={progressiveLesson}
          runPythonCode={runPythonCode}
          // Pass all state management props
          progressiveLessonProgress={progressiveLessonProgress}
          setProgressiveLessonProgress={setProgressiveLessonProgress}
          expandedLessons={expandedLessons}
          setExpandedLessons={setExpandedLessons}
          hintsUsed={hintsUsed}
          setHintsUsed={setHintsUsed}
          collapsedDescriptions={collapsedDescriptions}
          setCollapsedDescriptions={setCollapsedDescriptions}
          bruteForceSolved={bruteForceSolved}
          setBruteForceSolved={setBruteForceSolved}
          showBruteForceBlocker={showBruteForceBlocker}
          setShowBruteForceBlocker={setShowBruteForceBlocker}
          highlightBruteForceBlocker={highlightBruteForceBlocker}
          setHighlightBruteForceBlocker={setHighlightBruteForceBlocker}
          exercisesAwaitingAnalysis={exercisesAwaitingAnalysis}
          setExercisesAwaitingAnalysis={setExercisesAwaitingAnalysis}
          exercisesWithBeforeQuizCompleted={exercisesWithBeforeQuizCompleted}
          setExercisesWithBeforeQuizCompleted={setExercisesWithBeforeQuizCompleted}
          showingBeforeQuizExplanation={showingBeforeQuizExplanation}
          setShowingBeforeQuizExplanation={setShowingBeforeQuizExplanation}
          readingQuizAnswers={readingQuizAnswers}
          setReadingQuizAnswers={setReadingQuizAnswers}
          progressiveQuizIndex={progressiveQuizIndex}
          setProgressiveQuizIndex={setProgressiveQuizIndex}
          showLinkedListPractice={showLinkedListPractice}
          setShowLinkedListPractice={setShowLinkedListPractice}
        />
      );

    case 'quiz':
      return (
        <QuizBasedLesson
          progressiveLesson={progressiveLesson}
          progressiveQuizIndex={progressiveQuizIndex}
          setProgressiveQuizIndex={setProgressiveQuizIndex}
          progressiveLessonProgress={progressiveLessonProgress}
          setProgressiveLessonProgress={setProgressiveLessonProgress}
        />
      );

    case 'reading':
      return (
        <ReadingOnlyLesson
          progressiveLesson={progressiveLesson}
          colors={colors}
          progressiveLessonProgress={progressiveLessonProgress}
          setProgressiveLessonProgress={setProgressiveLessonProgress}
          readingQuizAnswers={readingQuizAnswers}
          setReadingQuizAnswers={setReadingQuizAnswers}
          runPythonCode={runPythonCode}
        />
      );

    default:
      // Fallback - should not reach here
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">
            Please select a lesson to begin learning.
          </p>
        </div>
      );
  }
};

export default ProgressiveLessonRouter;