/**
 * TypeScript type definitions for ContentRouter component
 * 
 * This file contains all the props interfaces needed for the ContentRouter
 * and its routing logic.
 */

import type {
  ProgressiveLesson,
  ProgressiveLessonProgress
} from '../../types/progressive-lesson-enhanced';
import type { DSAProblem } from '../../types/dsa-course';
import type { ModuleStudyStatus } from '../../data/moduleUnifiedDSAJourney';
import type { ProblemFamilyMapping } from '../../data/problemFamilyMapping';

/**
 * Complete props interface for ContentRouter component
 * 
 * This component routes between 5 different view modes:
 * 1. Practice Dashboard
 * 2. Smart Practice (Module 15)
 * 3. Linked List Practice (Module 5)
 * 4. Progressive Lesson (Exercise/Quiz/Reading)
 * 5. Default fallback
 */
export interface ContentRouterProps {
  // ═══════════════════════════════════════════════════════════
  // Current Module Context
  // ═══════════════════════════════════════════════════════════
  currentModule: {
    id: string;
    title: string;
    description?: string;
  };
  currentModuleIndex: number;
  totalModules: number;
  
  // ═══════════════════════════════════════════════════════════
  // Progressive Lesson State
  // ═══════════════════════════════════════════════════════════
  isProgressiveLesson: boolean;
  progressiveLesson: ProgressiveLesson | null;
  progressiveLessonProgress: ProgressiveLessonProgress;
  setProgressiveLessonProgress: (progress: ProgressiveLessonProgress) => void;
  
  // ═══════════════════════════════════════════════════════════
  // Quiz State
  // ═══════════════════════════════════════════════════════════
  progressiveQuizIndex: number;
  setProgressiveQuizIndex: (index: number) => void;
  
  // ═══════════════════════════════════════════════════════════
  // Smart Practice State (Module 15)
  // ═══════════════════════════════════════════════════════════
  currentProblemId: string | null;
  setCurrentProblemId: (id: string | null) => void;
  
  // ═══════════════════════════════════════════════════════════
  // Problems & Course Data
  // ═══════════════════════════════════════════════════════════
  allProblems: DSAProblem[];
  dsaProblems: DSAProblem[];
  solvedProblems: Set<string>;
  submissionAttempts: Map<string, number>;
  
  // ═══════════════════════════════════════════════════════════
  // Module 15 Integration - Studied Modules
  // ═══════════════════════════════════════════════════════════
  studiedModules: ModuleStudyStatus[];
  
  // ═══════════════════════════════════════════════════════════
  // Problem Family Mapping (for Smart Practice)
  // ═══════════════════════════════════════════════════════════
  problemFamilyMappings: ProblemFamilyMapping[];
  
  // ═══════════════════════════════════════════════════════════
  // Linked List Practice State (Module 5)
  // ═══════════════════════════════════════════════════════════
  showLinkedListPractice: boolean;
  setShowLinkedListPractice: (show: boolean) => void;
  module5LinkedListLesson: ProgressiveLesson;
  
  // ═══════════════════════════════════════════════════════════
  // Hints & UI State
  // ═══════════════════════════════════════════════════════════
  hintsUsed: Map<string, number>;
  setHintsUsed: (hints: Map<string, number>) => void;
  expandedLessons: Set<string>;
  setExpandedLessons: (lessons: Set<string>) => void;
  collapsedDescriptions: Set<string>;
  setCollapsedDescriptions: (descriptions: Set<string>) => void;
  
  // ═══════════════════════════════════════════════════════════
  // Brute Force Tracking
  // ═══════════════════════════════════════════════════════════
  bruteForceSolved: Set<string>;
  setBruteForceSolved: (solved: Set<string>) => void;
  showBruteForceBlocker: Set<string>;
  setShowBruteForceBlocker: (show: Set<string>) => void;
  highlightBruteForceBlocker: string | null;
  setHighlightBruteForceBlocker: (id: string | null) => void;
  
  // ═══════════════════════════════════════════════════════════
  // Complexity Quiz State
  // ═══════════════════════════════════════════════════════════
  exercisesAwaitingAnalysis: Set<string>;
  setExercisesAwaitingAnalysis: (exercises: Set<string>) => void;
  exercisesWithBeforeQuizCompleted: Set<string>;
  setExercisesWithBeforeQuizCompleted: (exercises: Set<string>) => void;
  showingBeforeQuizExplanation: string | null;
  setShowingBeforeQuizExplanation: (id: string | null) => void;
  
  // ═══════════════════════════════════════════════════════════
  // Reading Quiz State
  // ═══════════════════════════════════════════════════════════
  readingQuizAnswers: Map<string, { answer: number | null; completed: boolean }>;
  setReadingQuizAnswers: (answers: Map<string, { answer: number | null; completed: boolean }>) => void;
  
  // ═══════════════════════════════════════════════════════════
  // Callbacks & Handlers
  // ═══════════════════════════════════════════════════════════
  setSolvedProblems: React.Dispatch<React.SetStateAction<Set<string>>>;
  setSubmissionAttempts: React.Dispatch<React.SetStateAction<Map<string, number>>>;
  setCurrentModuleIndex: (index: number) => void;
  setCurrentPracticeModule: (module: number) => void;
  onNavigateToSmartPractice?: (moduleId: number) => void;
  handlePracticeCodeRun: (code: string, problemId: string, complexity?: { time: string; space: string }) => Promise<{
    success: boolean;
    output: string;
    error?: string;
    complexityFeedback?: { timeCorrect: boolean; spaceCorrect: boolean; timeExpected?: string; spaceExpected?: string };
  }>;
  getRecommendedProblems: () => DSAProblem[];
  
  // ═══════════════════════════════════════════════════════════
  // Code Execution & Utilities
  // ═══════════════════════════════════════════════════════════
  runPythonCode: (code: string) => Promise<{ output: string; error?: string }>;
  renderStyledText: (text: string) => React.ReactNode;
  cleanInstruction: (instruction: string) => string;
  ensureSolutionWrapper: (options: any) => string;
  buildPythonTestHarness: (code: string, testCases: any[]) => string;
  parsePythonTestResults: (rawOutput: string) => { results: any[]; error?: string };
  formatTestResultsOutput: (results: any[]) => string;
  getDefaultPracticeForSection: (section: any) => any;
  isSectionUnlocked: (section: any, progress: ProgressiveLessonProgress, lesson: ProgressiveLesson) => boolean;
  calculateLessonProgress: (lesson: ProgressiveLesson, progress: ProgressiveLessonProgress) => number;
  
  // ═══════════════════════════════════════════════════════════
  // Theme
  // ═══════════════════════════════════════════════════════════
  colors: any;
}