/**
 * ContentRouter Component
 * 
 * Routes between different content views in the DSA application.
 * This component handles the massive content area (3,100+ lines extracted from AppDSA.tsx).
 * 
 * **View Modes:**
 * 1. **Practice Dashboard** - Track progress & weak areas
 * 2. **Smart Practice** - Module 15 integration with smart problem selection
 * 3. **Linked List Practice** - Special practice section for Module 5
 * 4. **Progressive Lesson** - Exercise-based, quiz-based, or reading-only lessons
 * 5. **Default Fallback** - "Select a lesson" message
 * 
 * **Routing Logic:**
 * - Checks `currentModule.id` to determine which view to show
 * - For progressive lessons, detects lesson type (exercise/quiz/reading) and renders appropriately
 * - Handles all state management for progressive lesson navigation
 * 
 * **Extracted from AppDSA.tsx lines 1984-4862**
 * 
 * @example
 * ```tsx
 * <ContentRouter
 *   currentModule={currentModule}
 *   isProgressiveLesson={isProgressiveLesson}
 *   progressiveLesson={progressiveLesson}
 *   currentProblemId={currentProblemId}
 *   setCurrentProblemId={setCurrentProblemId}
 *   // ... other props
 * />
 * ```
 */

import { PracticeDashboard } from '../core/PracticeDashboard';
import LinkedListPracticeSection from '../core/LinkedListPracticeSection';
import ExerciseBasedLesson from '../progressive-lesson/ExerciseBasedLesson';
import QuizBasedLesson from '../progressive-lesson/QuizBasedLesson';
import { ReadingOnlyLesson } from '../progressive-lesson/ReadingOnlyLesson';
import { AdaptiveStreamView } from '../core/AdaptiveStreamView';
import { ProblemValidator } from '../core/ProblemValidator';
import type { ContentRouterProps } from './types';
import { dsaModules } from '../../data/dsaCourseData';
import type { DSAProblem } from '../../types/dsa-course';

export function ContentRouter({
  currentModule,
  currentModuleIndex,
  totalModules,
  isProgressiveLesson,
  progressiveLesson,
  currentProblemId: _currentProblemId,
  setCurrentProblemId,
  allProblems,
  setCurrentModuleIndex,
  setCurrentPracticeModule,
  onNavigateToSmartPractice: _onNavigateToSmartPractice,
  solvedProblems: _solvedProblems,
  setSolvedProblems: _setSolvedProblems,
  handlePracticeCodeRun: _handlePracticeCodeRun,
  getRecommendedProblems: _getRecommendedProblems,
  colors,
  studiedModules: _studiedModules,
  problemFamilyMappings: _problemFamilyMappings,
  dsaProblems: _dsaProblems,
  showLinkedListPractice,
  setShowLinkedListPractice,
  module5LinkedListLesson,
  progressiveLessonProgress,
  setProgressiveLessonProgress,
  exercisesAwaitingAnalysis,
  setExercisesAwaitingAnalysis,
  exercisesWithBeforeQuizCompleted,
  setExercisesWithBeforeQuizCompleted,
  showingBeforeQuizExplanation,
  setShowingBeforeQuizExplanation,
  submissionAttempts: _submissionAttempts,
  setSubmissionAttempts: _setSubmissionAttempts,
  hintsUsed,
  setHintsUsed,
  expandedLessons,
  setExpandedLessons,
  collapsedDescriptions,
  setCollapsedDescriptions,
  bruteForceSolved,
  setBruteForceSolved,
  showBruteForceBlocker,
  setShowBruteForceBlocker,
  highlightBruteForceBlocker,
  setHighlightBruteForceBlocker,
  readingQuizAnswers,
  setReadingQuizAnswers,
  progressiveQuizIndex,
  setProgressiveQuizIndex,
  runPythonCode,
  renderStyledText: _renderStyledText,
  cleanInstruction: _cleanInstruction,
  ensureSolutionWrapper: _ensureSolutionWrapper,
  buildPythonTestHarness: _buildPythonTestHarness,
  parsePythonTestResults: _parsePythonTestResults,
  formatTestResultsOutput: _formatTestResultsOutput,
  getDefaultPracticeForSection: _getDefaultPracticeForSection,
  isSectionUnlocked: _isSectionUnlocked,
  calculateLessonProgress: _calculateLessonProgress,
}: ContentRouterProps) {

  // ═══════════════════════════════════════════════════════════
  // PROBLEM VALIDATOR VIEW (for testing/debugging)
  // ═══════════════════════════════════════════════════════════
  if (currentModule.id === 'problem-validator') {
    return (
      <div className="flex-1 overflow-auto p-6">
        <ProblemValidator />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // PRACTICE DASHBOARD VIEW
  // ═══════════════════════════════════════════════════════════
  if (currentModule.id === 'practice-dashboard') {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <PracticeDashboard
          problems={allProblems.map(p => ({
            id: p.id,
            title: p.title,
            difficulty: p.difficulty
          }))}
          onSelectProblem={(problemId) => {
            // Find the Smart Practice module and navigate to it
            // Note: dsaCourse is not passed as a prop anymore, so we'll just set the problem
            setCurrentProblemId(problemId);
          }}
        />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // SMART PRACTICE VIEW - Adaptive Stream with challenges.json
  // ═══════════════════════════════════════════════════════════
  // Shows standalone challenges from /src/content/modules/*/challenges.json
  if (currentModule.id === 'smart-practice') {
    return (
      <AdaptiveStreamView
        moduleId="01_arrays_hashing"
        onBack={() => {
          // Navigate back to dashboard
          setCurrentModuleIndex(0);
        }}
        onNavigateToModule={(moduleId: string) => {
          // Map folder names to module IDs
          const FOLDER_TO_MODULE_ID: Record<string, string> = {
            '01_arrays_hashing': 'array-iteration-techniques',
            '02_pointers_window': 'sliding-window-mastery',
            '03_stack_linkedlist': 'stack-discovery-lifo',
            '04_trees_graphs': 'trees-traversals',
            '05_dp_recursion': 'dynamic-programming',
            '06_heaps_intervals': 'heaps-priority-queues',
            '07_design_tries': 'tries-string-patterns',
            '08_concurrency_threading': 'concurrency-threading',
            '09_system_design': 'system-design-patterns',
            '10_ood_patterns': 'ood-patterns',
            '11_async_patterns': 'async-patterns',
            'prefix-suffix-arrays': 'prefix-suffix-arrays', // Self-check
          };

          const targetId = FOLDER_TO_MODULE_ID[moduleId] || moduleId;

          // Find module index and navigate
          const index = dsaModules.findIndex(m => m.id === targetId);
          if (index !== -1) {
            console.log(`Navigating to module: ${targetId} (from ${moduleId}) at index ${index}`);
            setCurrentModuleIndex(index);
          } else {
            console.warn(`Module ID not found: ${targetId} (original: ${moduleId})`);
          }
        }}
      />
    );
  }

  // ═══════════════════════════════════════════════════════════
  // LINKED LIST PRACTICE VIEW
  // ═══════════════════════════════════════════════════════════
  if (showLinkedListPractice) {
    // Convert Module 5 exercises to DSAProblem format
    const linkedListProblems: DSAProblem[] = module5LinkedListLesson.sections
      .filter(s => s.type === 'exercise')
      .map(section => {
        const hints = (section.hints || []).map(hint =>
          typeof hint === 'string' ? hint : hint.text
        );
        const testCases = (section.testCases || []).map((tc, idx) => ({
          id: `${section.id}-test-${idx}`,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          hidden: false
        }));

        return {
          id: section.id,
          title: section.title,
          description: section.instruction || section.description || '',
          difficulty: section.difficulty || 'easy',
          topic: 'linked-lists' as const,
          examples: [],
          constraints: [],
          hints: hints.filter((h): h is string => h !== undefined),
          starterCode: section.starterCode || '',
          solution: typeof section.solution === 'string' ? section.solution : section.solution?.text || '',
          testCases: testCases,
          tags: ['linked-list', 'dummy-node'],
          timeComplexity: '',
          spaceComplexity: ''
        } as DSAProblem;
      });

    return (
      <div className="h-full overflow-auto bg-slate-50">
        <LinkedListPracticeSection
          problems={linkedListProblems}
          onBack={() => setShowLinkedListPractice(false)}
        />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // PROGRESSIVE LESSON VIEW
  // Routes based on CURRENT SECTION TYPE (not lesson type)
  // - Reading sections → Full-screen reading (no code editor)
  // - Exercise sections → LeetCode-style horizontal split
  // - Quiz sections → Quiz-based layout
  // ═══════════════════════════════════════════════════════════
  if (isProgressiveLesson && progressiveLesson) {
    // Safety check: if no sections exist, show fallback
    if (!progressiveLesson.sections || progressiveLesson.sections.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">No sections available</p>
            <p className="text-sm text-muted-foreground">
              This lesson doesn't have any sections yet.
            </p>
          </div>
        </div>
      );
    }

    // Get current section based on progress
    const currentIndex = progressiveLessonProgress?.currentSectionIndex ?? 0;
    const safeIndex = Math.max(0, Math.min(currentIndex, progressiveLesson.sections.length - 1));
    const currentSection = progressiveLesson.sections[safeIndex];

    // Safety check: if currentSection is undefined, show fallback
    if (!currentSection) {
      return (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">No sections available</p>
            <p className="text-sm text-muted-foreground">
              This lesson doesn't have any sections yet.
            </p>
          </div>
        </div>
      );
    }

    // Route based on CURRENT section type
    switch (currentSection.type) {
      case 'exercise':
        // EXERCISE SECTION → LeetCode-style horizontal split
        return (
          <ExerciseBasedLesson
            progressiveLesson={progressiveLesson}
            progressiveLessonProgress={progressiveLessonProgress}
            setProgressiveLessonProgress={setProgressiveLessonProgress}
            exercisesAwaitingAnalysis={exercisesAwaitingAnalysis}
            setExercisesAwaitingAnalysis={setExercisesAwaitingAnalysis}
            exercisesWithBeforeQuizCompleted={exercisesWithBeforeQuizCompleted}
            setExercisesWithBeforeQuizCompleted={setExercisesWithBeforeQuizCompleted}
            showingBeforeQuizExplanation={showingBeforeQuizExplanation}
            setShowingBeforeQuizExplanation={setShowingBeforeQuizExplanation}
            hintsUsed={hintsUsed}
            setHintsUsed={setHintsUsed}
            expandedLessons={expandedLessons}
            setExpandedLessons={setExpandedLessons}
            collapsedDescriptions={collapsedDescriptions}
            setCollapsedDescriptions={setCollapsedDescriptions}
            bruteForceSolved={bruteForceSolved}
            setBruteForceSolved={setBruteForceSolved}
            showBruteForceBlocker={showBruteForceBlocker}
            setShowBruteForceBlocker={setShowBruteForceBlocker}
            highlightBruteForceBlocker={highlightBruteForceBlocker}
            setHighlightBruteForceBlocker={setHighlightBruteForceBlocker}
            readingQuizAnswers={readingQuizAnswers}
            setReadingQuizAnswers={setReadingQuizAnswers}
            showLinkedListPractice={showLinkedListPractice}
            setShowLinkedListPractice={setShowLinkedListPractice}
            progressiveQuizIndex={progressiveQuizIndex}
            setProgressiveQuizIndex={setProgressiveQuizIndex}
            runPythonCode={runPythonCode}
            setCurrentModuleIndex={setCurrentModuleIndex}
            setCurrentPracticeModule={setCurrentPracticeModule}
          />
        );

      case 'quiz':
        // QUIZ SECTION → Quiz-based layout
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
      case 'checkpoint':
      default:
        // READING/CHECKPOINT SECTION → Full-screen reading (no code editor)
        return (
          <ReadingOnlyLesson
            progressiveLesson={progressiveLesson}
            colors={colors}
            progressiveLessonProgress={progressiveLessonProgress}
            setProgressiveLessonProgress={setProgressiveLessonProgress}
            readingQuizAnswers={readingQuizAnswers}
            setReadingQuizAnswers={setReadingQuizAnswers}
            currentModuleIndex={currentModuleIndex}
            setCurrentModuleIndex={setCurrentModuleIndex}
            totalModules={totalModules}
            runPythonCode={runPythonCode}
          />
        );
    }
  }

  // ═══════════════════════════════════════════════════════════
  // DEFAULT FALLBACK
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="flex-1 flex items-center justify-center text-slate-500">
      <p>Select a lesson from the sidebar</p>
    </div>
  );
}

export default ContentRouter;