/**
 * Types Index
 *
 * Central export point for all type definitions
 *
 * Note: Due to naming conflicts between type files, we export selectively
 * to avoid ambiguity. Import directly from specific files if you need
 * types that are not exported here.
 */

// Progress Decay types - Primary focus for this implementation
export * from './progress-decay';

// Smart Practice types
export type {
  ConceptScore,
  WeaknessProfile,
  WeaknessScore,
  ErrorPattern,
  StruggleMetric,
  PracticeAttempt,
  ConceptPriorityResult,
  ConceptMasteryLevel,
  SpacedRepetitionItem,
  ReviewSchedule,
  ConceptRetentionTest,
  TestQuestion,
  AdaptiveProblem,
  DifficultyLevel,
  Example,
  HintLevel,
  UserProgress,
  SkillRadar,
  MasteryLevel,
  WeaknessEvolution,
  EfficiencyMetrics,
  InterviewReadiness,
  Achievement,
  UserLevel,
  PracticeSession,
  PracticeProblemAttempt,
  ProblemSelectionCriteria,
  SelectedProblemSet,
  UserGamificationProfile,
  WeeklyChallenge,
  Badge,
  Title,
  PowerUp,
  ActivePowerUp,
  SmartPracticeAPI,
  AnalyticsEvent,
} from './smart-practice';

// Practice types
export * from './practice';

// Review System types
export * from './review-system';

// Drill System types
export * from './drill-system';

// DSA Course types (primary)
export type {
  DSACourse,
  DSAModule,
  DSALesson,
  DSAProblem,
  DSATopic,
  DSAExample,
  DSATestCase,
  DSAQuiz,
  DSALessonContent,
  InteractiveTask,
  TimeComplexityInfo,
  CodeSubmission,
  TestResult,
  DSAProgress,
  VisualizationStep,
  ArrayVisualization,
  TreeNode,
  GraphNode,
  LinkedListNode,
  ComplexityAnalysis,
  EvolutionStep,
} from './dsa-course';

export {
  problemPatterns,
  complexityReference,
  pythonTemplates,
  createTestCase,
  createProblem,
} from './dsa-course';