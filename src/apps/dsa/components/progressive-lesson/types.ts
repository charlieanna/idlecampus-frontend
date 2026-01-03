/**
 * Shared TypeScript interfaces and types for Progressive Lesson components
 * This file contains all the type definitions needed for the extracted components
 */

import type {
  ProgressiveLessonProgress,
  SectionProgress,
  ProgressiveLesson,
  ExerciseSection,
  LessonSection,
  QuizSection,
  ReadingSection,
  CheckpointSection,
} from '../../types/progressive-lesson-enhanced';

// Define Hint type based on ExerciseSection structure
export interface Hint {
  afterAttempt: number;
  text?: string;
  question?: string;
  thinkAbout?: string[];
}

// ============================================
// Core State Management Types
// ============================================

/**
 * Complete state interface for all Progressive Lesson state variables
 */
export interface ProgressiveLessonState {
  // Progress tracking
  progressiveLessonProgress: ProgressiveLessonProgress;
  setProgressiveLessonProgress: (progress: ProgressiveLessonProgress) => void;

  // Hints and lesson expansion
  expandedLessons: Set<string>;
  setExpandedLessons: (lessons: Set<string>) => void;
  hintsUsed: Map<string, number>;
  setHintsUsed: (hints: Map<string, number>) => void;
  
  // UI collapse state
  collapsedDescriptions: Set<string>;
  setCollapsedDescriptions: (descriptions: Set<string>) => void;

  // Brute force tracking
  bruteForceSolved: Set<string>;
  setBruteForceSolved: (solved: Set<string>) => void;
  showBruteForceBlocker: Set<string>;
  setShowBruteForceBlocker: (show: Set<string>) => void;
  highlightBruteForceBlocker: string | null;
  setHighlightBruteForceBlocker: (id: string | null) => void;

  // Complexity quiz state
  exercisesAwaitingAnalysis: Set<string>;
  setExercisesAwaitingAnalysis: (exercises: Set<string>) => void;
  exercisesWithBeforeQuizCompleted: Set<string>;
  setExercisesWithBeforeQuizCompleted: (exercises: Set<string>) => void;
  showingBeforeQuizExplanation: string | null;
  setShowingBeforeQuizExplanation: (id: string | null) => void;

  // Reading quiz state
  readingQuizAnswers: Map<string, { answer: number | null; completed: boolean }>;
  setReadingQuizAnswers: (answers: Map<string, { answer: number | null; completed: boolean }>) => void;

  // Quiz progression
  progressiveQuizIndex: number;
  setProgressiveQuizIndex: (index: number) => void;

  // Linked list practice
  showLinkedListPractice: boolean;
  setShowLinkedListPractice: (show: boolean) => void;
}

// ============================================
// Component Props Interfaces
// ============================================

/**
 * Props for the main ProgressiveLessonRouter component
 */
export interface ProgressiveLessonRouterProps extends ProgressiveLessonState {
  progressiveLesson: ProgressiveLesson;
  currentModuleIndex: number;
  colors: any; // Theme colors
  runPythonCode: (code: string) => Promise<{ output: string; error?: string }>;
}

/**
 * Props for ExerciseBasedLesson component
 */
export interface ExerciseBasedLessonProps extends ProgressiveLessonState {
  progressiveLesson: ProgressiveLesson;
  runPythonCode: (code: string) => Promise<{ output: string; error?: string }>;
  setCurrentModuleIndex?: (index: number) => void;
  setCurrentPracticeModule?: (module: number) => void;
  onNavigateToSmartPractice?: () => void;
}

/**
 * Props for QuizBasedLesson component
 */
export interface QuizBasedLessonProps {
  progressiveLesson: ProgressiveLesson;
  progressiveQuizIndex: number;
  setProgressiveQuizIndex: (index: number) => void;
  progressiveLessonProgress?: ProgressiveLessonProgress;
  setProgressiveLessonProgress?: (progress: ProgressiveLessonProgress) => void;
}

/**
 * Props for ReadingOnlyLesson component
 */
export interface ReadingOnlyLessonProps {
  progressiveLesson: ProgressiveLesson;
  colors: any;
  progressiveLessonProgress: ProgressiveLessonProgress;
  setProgressiveLessonProgress: (progress: ProgressiveLessonProgress) => void;
  readingQuizAnswers?: Map<string, { answer: number | null; completed: boolean }>;
  setReadingQuizAnswers?: (answers: Map<string, { answer: number | null; completed: boolean }>) => void;
  // Module navigation for last section
  currentModuleIndex?: number;
  setCurrentModuleIndex?: (index: number) => void;
  totalModules?: number;
  // For inline code editors in reading sections
  runPythonCode?: (code: string) => Promise<{ output: string; error?: string }>;
}

/**
 * Props for LessonContentPanel (left panel)
 */
export interface LessonContentPanelProps extends ProgressiveLessonState {
  currentSection: LessonSection | ExerciseSection;
  activeSectionIdx: number;
  progressiveLesson: ProgressiveLesson;
  runPythonCode: (code: string) => Promise<{ output: string; error?: string }>;
  setCurrentModuleIndex?: (index: number) => void;
  setCurrentPracticeModule?: (module: number) => void;
  onNavigateToSmartPractice?: () => void;
}

/**
 * Props for CodeEditorPanel (right panel)
 */
export interface CodeEditorPanelProps extends ProgressiveLessonState {
  currentSection: LessonSection | ExerciseSection;
  progressiveLesson: ProgressiveLesson;
  runPythonCode: (code: string) => Promise<{ output: string; error?: string }>;
  activeExercise?: ExerciseSection;
  onUpdateProgress?: (updates: Partial<ProgressiveLessonProgress>) => void;
  onHintRequest?: (sectionId: string) => void;
  onExpandLesson?: (sectionId: string) => void;
  onCollapseDescription?: (sectionId: string) => void;
  onCompleteBeforeQuiz?: (sectionId: string) => void;
  onShowBeforeQuizExplanation?: (sectionId: string) => void;
  onBruteForceSolved?: (sectionId: string) => void;
  onShowBruteForceBlocker?: (sectionId: string) => void;
  onHighlightBruteForceBlocker?: (sectionId: string | null) => void;
  onQuizAnswer?: (sectionId: string, answer: number) => void;
}

// ============================================
// Sub-component Props
// ============================================

/**
 * Props for ReadingSection component
 */
export interface ReadingSectionProps {
  section: LessonSection;
  sectionIndex: number;
  sectionProgress: SectionProgress;
  isUnlocked: boolean;
  isCompleted: boolean;
  expandedLessons: Set<string>;
  hintsUsed: Map<string, number>;
  collapsedDescriptions: Set<string>;
  progressiveLessonProgress: ProgressiveLessonProgress;
  progressiveLesson: ProgressiveLesson;
  setProgressiveLessonProgress: (progress: ProgressiveLessonProgress) => void;
  setExpandedLessons: (lessons: Set<string>) => void;
  setHintsUsed: (hints: Map<string, number>) => void;
  setCollapsedDescriptions: (descriptions: Set<string>) => void;
  setShowLinkedListPractice: (show: boolean) => void;
}

/**
 * Props for ExerciseSection component
 */
export interface ExerciseSectionProps {
  section: ExerciseSection;
  sectionIndex: number;
  sectionProgress: SectionProgress;
  isUnlocked: boolean;
  isCompleted: boolean;
  expandedLessons: Set<string>;
  hintsUsed: Map<string, number>;
  collapsedDescriptions: Set<string>;
  bruteForceSolved: Set<string>;
  showBruteForceBlocker: Set<string>;
  highlightBruteForceBlocker: string | null;
  showingBeforeQuizExplanation: string | null;
  progressiveLessonProgress: ProgressiveLessonProgress;
  progressiveLesson: ProgressiveLesson;
  setProgressiveLessonProgress: (progress: ProgressiveLessonProgress) => void;
  setCollapsedDescriptions: (descriptions: Set<string>) => void;
}

/**
 * Props for PracticeExercisePreview component
 */
export interface PracticeExercisePreviewProps {
  practiceExercise: any;
  sectionId: string;
  hintsUsed: Map<string, number>;
  expandedLessons: Set<string>;
  isCompleted: boolean;
}

/**
 * Props for QuickQuizPanel component
 */
export interface QuickQuizPanelProps {
  quickQuiz: any;
  sectionId: string;
  readingQuizAnswers: Map<string, { answer: number | null; completed: boolean }>;
  setReadingQuizAnswers: (answers: Map<string, { answer: number | null; completed: boolean }>) => void;
  progressiveLessonProgress: ProgressiveLessonProgress;
  setProgressiveLessonProgress: (progress: ProgressiveLessonProgress) => void;
}

/**
 * Props for HintsSolutionPanel component
 */
export interface HintsSolutionPanelProps {
  sectionId: string;
  hints: Hint[];
  solution?: string | { afterAttempt: number; text: string };
  hintLevel: number;
  isCompleted: boolean;
  showBruteForceBlocker: boolean;
  highlightBruteForceBlocker: boolean;
  isBruteForceSolved: boolean;
}

/**
 * Props for ProblemDescription component
 */
export interface ProblemDescriptionProps {
  sectionId: string;
  title: string;
  instruction: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

/**
 * Props for TestCasesDisplay component
 */
export interface TestCasesDisplayProps {
  testCases: any[];
  maxDisplay?: number;
}

// ============================================
// Utility Types
// ============================================

/**
 * Problem type detection flags
 */
export interface ProblemTypeFlags {
  isLinkedListProblem: boolean;
  isTreeProblem: boolean;
  isTrieProblem: boolean;
  isListOfStringsExercise: boolean;
  isNestedDictTrieExercise: boolean;
}

/**
 * Test execution result
 */
export interface TestResult {
  test: number;
  passed: boolean;
  result: any;
  expected: any;
  error?: string;
}

/**
 * Code execution result
 */
export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  complexityFeedback?: ComplexityFeedback;
  testResults?: TestResult[];
}

/**
 * Complexity analysis feedback
 */
export interface ComplexityFeedback {
  timeCorrect: boolean;
  spaceCorrect: boolean;
  timeExpected: string;
  spaceExpected: string;
}

/**
 * Normalized test case format
 */
export interface NormalizedTestCase {
  mode: 'snippet' | 'json';
  inputExpr?: string;
  expectedExpr?: string;
  inputJson?: string;
  expectedJson?: string;
}

// ============================================
// Callback Types
// ============================================

/**
 * Progress-related callbacks
 */
export interface ProgressCallbacks {
  onUpdateProgress: (updates: Partial<ProgressiveLessonProgress>) => void;
  onComplete: () => void;
  onNavigateNext: () => void;
}

/**
 * Hint-related callbacks
 */
export interface HintCallbacks {
  onRequestHint: (sectionId: string) => void;
  onExpandLesson: (sectionId: string) => void;
}

/**
 * UI-related callbacks
 */
export interface UICallbacks {
  onToggleDescription: (sectionId: string) => void;
  onCollapseDescription: (sectionId: string) => void;
}

/**
 * Combined callbacks interface
 */
export interface AllCallbacks extends ProgressCallbacks, HintCallbacks, UICallbacks {}

// ============================================
// Helper Function Types
// ============================================

/**
 * Solution wrapper configuration
 */
export interface SolutionWrapperOptions {
  code: string;
  defaultFuncName?: string;
  isLinkedListProblem: boolean;
  isTreeProblem: boolean;
  isTrieProblem: boolean;
  isListOfStringsExercise: boolean;
  isNestedDictTrieExercise: boolean;
}

/**
 * Test harness building function
 */
export type BuildTestHarnessFunction = (
  code: string,
  testCases: NormalizedTestCase[]
) => string;

/**
 * Python test results parser
 */
export type ParseTestResultsFunction = (
  rawOutput: string
) => { results: TestResult[]; error?: string };

/**
 * Test results formatter
 */
export type FormatTestResultsFunction = (
  results: TestResult[]
) => string;

// Re-export types from the main progressive lesson types
export type {
  ProgressiveLessonProgress,
  SectionProgress,
  ProgressiveLesson,
  ExerciseSection,
  LessonSection,
  QuizSection,
  ReadingSection,
  CheckpointSection,
};