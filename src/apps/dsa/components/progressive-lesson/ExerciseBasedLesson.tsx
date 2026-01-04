/**
 * ExerciseBasedLesson Component
 *
 * Renders exercise sections with a LeetCode-style HORIZONTAL two-panel layout:
 * - Left panel: Problem description (instruction, examples, hints)
 * - Right panel: Code editor with test execution
 *
 * This layout provides the familiar LeetCode experience where users can
 * see the problem description while coding their solution.
 */

import React from 'react';
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from '../ui/resizable';
import type { ExerciseBasedLessonProps, LessonSection } from './types';
import type { ProgressiveLessonProgress } from '../../types/progressive-lesson-enhanced';
import LessonContentPanel from './LessonContentPanel';
import CodeEditorPanel from './CodeEditorPanel';

const ExerciseBasedLesson: React.FC<ExerciseBasedLessonProps> = ({
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
   * Determine the active section based on current progress
   * Uses the currentSectionIndex from progressiveLessonProgress to show the correct section
   */
  const getActiveSection = (): { section: LessonSection; index: number } => {
    // Get the current section index from progress, defaulting to 0 if not set
    const currentIndex = progressiveLessonProgress.currentSectionIndex ?? 0;
    
    // Ensure index is within bounds
    const safeIndex = Math.max(0, Math.min(currentIndex, progressiveLesson.sections.length - 1));
    
    return {
      section: progressiveLesson.sections[safeIndex],
      index: safeIndex,
    };
  };

  const { section: currentSection, index: activeSectionIdx } = getActiveSection();

  // Ensure exercise descriptions are expanded by default when first viewed
  React.useEffect(() => {
    if (currentSection.type === 'exercise' && currentSection.instruction) {
      const sectionProgress = progressiveLessonProgress.sectionsProgress.get(currentSection.id);
      // If exercise hasn't been started or completed, ensure description is visible
      if (!sectionProgress || sectionProgress.status === 'locked' || sectionProgress.status === 'unlocked') {
        if (collapsedDescriptions.has(currentSection.id)) {
          const newCollapsed = new Set(collapsedDescriptions);
          newCollapsed.delete(currentSection.id);
          setCollapsedDescriptions(newCollapsed);
        }
      }
    }
  }, [currentSection.id, currentSection.type, progressiveLessonProgress.sectionsProgress, collapsedDescriptions, setCollapsedDescriptions]);

  // Callback functions for CodeEditorPanel
  const handleUpdateProgress = (updates: Partial<ProgressiveLessonProgress>) => {
    // Ensure we always create a new Map reference for React to detect changes
    const newSectionsProgress = updates.sectionsProgress
      ? new Map(updates.sectionsProgress)
      : new Map(progressiveLessonProgress.sectionsProgress);

    const newProgress: ProgressiveLessonProgress = {
      ...progressiveLessonProgress,
      ...updates,
      sectionsProgress: newSectionsProgress,
    };

    // If any section was just completed, ensure its description is expanded (visible)
    if (updates.sectionsProgress) {
      const completedSectionIds = Array.from(updates.sectionsProgress.entries())
        .filter(([_, progress]) => progress.status === 'completed')
        .map(([id]) => id);

      if (completedSectionIds.length > 0) {
        // Remove completed sections from collapsedDescriptions to ensure they're visible
        const newCollapsed = new Set(collapsedDescriptions);
        completedSectionIds.forEach(id => newCollapsed.delete(id));
        if (newCollapsed.size !== collapsedDescriptions.size) {
          setCollapsedDescriptions(newCollapsed);
        }
      }
    }

    setProgressiveLessonProgress(newProgress);
  };

  const handleHintRequest = (sectionId: string) => {
    const currentHints = hintsUsed.get(sectionId) || 0;
    setHintsUsed(new Map(hintsUsed).set(sectionId, currentHints + 1));
  };

  const handleExpandLesson = (sectionId: string) => {
    setExpandedLessons(new Set([...expandedLessons, sectionId]));
  };

  const handleCollapseDescription = (sectionId: string) => {
    setCollapsedDescriptions(new Set([...collapsedDescriptions, sectionId]));
  };

  const handleCompleteBeforeQuiz = (sectionId: string) => {
    setExercisesWithBeforeQuizCompleted(new Set([...exercisesWithBeforeQuizCompleted, sectionId]));
  };

  const handleShowBeforeQuizExplanation = (sectionId: string) => {
    setShowingBeforeQuizExplanation(sectionId);
  };

  const handleBruteForceSolved = (sectionId: string) => {
    setBruteForceSolved(new Set([...bruteForceSolved, sectionId]));
  };

  const handleShowBruteForceBlocker = (sectionId: string) => {
    setShowBruteForceBlocker(new Set([...showBruteForceBlocker, sectionId]));
  };

  const handleHighlightBruteForceBlocker = (sectionId: string | null) => {
    setHighlightBruteForceBlocker(sectionId);
  };

  const handleQuizAnswer = (sectionId: string, answer: number) => {
    const newAnswers = new Map(readingQuizAnswers);
    const currentAnswer = newAnswers.get(sectionId) || { answer: null, completed: false };
    newAnswers.set(sectionId, { answer, completed: true });
    setReadingQuizAnswers(newAnswers);
  };

  // Determine if we should show the code editor panel
  // Only show it when the current section is an exercise
  const isExerciseSection = currentSection.type === 'exercise';
  const shouldShowCodeEditor = isExerciseSection;

  return (
    <div className="flex-1 h-full w-full flex min-w-0">
      {/* Left Panel: Problem Description (LeetCode-style) */}
      <div className="h-full overflow-hidden" style={{ flexBasis: '50%', flexGrow: 0, flexShrink: 0, minWidth: 0, maxWidth: '50%' }}>
        <LessonContentPanel
          currentSection={currentSection}
          activeSectionIdx={activeSectionIdx}
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
          setCurrentModuleIndex={setCurrentModuleIndex}
          setCurrentPracticeModule={setCurrentPracticeModule}
          onNavigateToSmartPractice={onNavigateToSmartPractice}
        />
      </div>

      {/* Right Panel: Code Editor (LeetCode-style) */}
      <div className="h-full overflow-hidden" style={{ flexBasis: '50%', flexGrow: 0, flexShrink: 0, minWidth: '50%', maxWidth: '50%' }}>
        <CodeEditorPanel
          activeExercise={currentSection.type === 'exercise' ? (currentSection as any) : undefined}
          currentSection={currentSection}
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
          // Callback functions
          onUpdateProgress={handleUpdateProgress}
          onHintRequest={handleHintRequest}
          onExpandLesson={handleExpandLesson}
          onCollapseDescription={handleCollapseDescription}
          onCompleteBeforeQuiz={handleCompleteBeforeQuiz}
          onShowBeforeQuizExplanation={handleShowBeforeQuizExplanation}
          onBruteForceSolved={handleBruteForceSolved}
          onShowBruteForceBlocker={handleShowBruteForceBlocker}
          onHighlightBruteForceBlocker={handleHighlightBruteForceBlocker}
          onQuizAnswer={handleQuizAnswer}
        />
      </div>
    </div>
  );
};

export default ExerciseBasedLesson;