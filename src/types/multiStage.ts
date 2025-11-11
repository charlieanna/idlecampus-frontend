// Types for multi-stage lesson system
// Extends the progressive learning system with multi-stage capabilities

import { LessonItem } from './progressive';

/**
 * Different types of stages in a multi-stage lesson
 */
export type StageType =
  | 'concept'       // Introduce the concept with theory
  | 'visualization' // Interactive visualization/animation
  | 'example'       // Worked example with explanation
  | 'practice'      // Interactive practice problem
  | 'code'          // Code lab/editor
  | 'quiz'          // Quiz/assessment
  | 'terminal'      // Terminal-based exercise
  | 'custom';       // Custom stage type

/**
 * Base interface for all stage types
 */
export interface BaseStage {
  id: string;
  type: StageType;
  title: string;
  description?: string;
  estimatedMinutes?: number;
  optional?: boolean;
  completionCriteria?: CompletionCriteria;
}

/**
 * Criteria for completing a stage
 */
export interface CompletionCriteria {
  type: 'auto' | 'manual' | 'validation' | 'quiz' | 'code_submission';
  requiresScore?: number; // Minimum score (0-100) if applicable
  allowSkip?: boolean;
}

/**
 * Concept stage - introduces theory and explanations
 */
export interface ConceptStage extends BaseStage {
  type: 'concept';
  content: {
    markdown: string;
    images?: string[];
    videos?: string[];
    externalLinks?: ExternalLink[];
  };
  keyPoints?: string[]; // Bullet points of key takeaways
}

/**
 * Visualization stage - interactive animations
 */
export interface VisualizationStage extends BaseStage {
  type: 'visualization';
  visualizationType:
    | 'array'
    | 'sliding_window'
    | 'tree'
    | 'graph'
    | 'sorting'
    | 'custom';
  config: ArrayVisualizationConfig | SlidingWindowConfig | TreeConfig | GraphConfig | CustomVisualizationConfig;
  explanation?: string; // Markdown explanation shown alongside
}

/**
 * Array visualization configuration
 */
export interface ArrayVisualizationConfig {
  type: 'array';
  array: (number | string)[];
  highlightIndices?: number[];
  pointers?: Record<number, string>;
  activeRange?: [number, number];
  animate?: boolean;
}

/**
 * Sliding window visualization configuration
 */
export interface SlidingWindowConfig {
  type: 'sliding_window';
  array: (number | string)[];
  steps: Array<{
    windowStart: number;
    windowEnd: number;
    currentValue?: number;
    explanation: string;
    code?: string;
  }>;
  valueLabel?: string;
}

/**
 * Tree visualization configuration
 */
export interface TreeConfig {
  type: 'tree';
  root: TreeNode;
  highlightPath?: string[]; // Node IDs to highlight
  animate?: boolean;
}

export interface TreeNode {
  value: number | string | null;
  left?: TreeNode;
  right?: TreeNode;
  id?: string;
  highlighted?: boolean;
}

/**
 * Graph visualization configuration
 */
export interface GraphConfig {
  type: 'graph';
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed?: boolean;
  weighted?: boolean;
  highlightPath?: string[]; // Node IDs in path
}

export interface GraphNode {
  id: string;
  label: string;
  x?: number; // Position (optional, will auto-layout if not provided)
  y?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  label?: string;
}

/**
 * Custom visualization configuration
 */
export interface CustomVisualizationConfig {
  type: 'custom';
  componentName: string; // Name of custom component to render
  props: Record<string, any>; // Props to pass to component
}

/**
 * Example stage - worked example with step-by-step solution
 */
export interface ExampleStage extends BaseStage {
  type: 'example';
  problem: string; // Problem statement
  solution: {
    steps: ExampleStep[];
    finalAnswer?: string;
    codeSnippet?: string;
    language?: string;
  };
}

export interface ExampleStep {
  stepNumber: number;
  title: string;
  explanation: string;
  visualization?: VisualizationStage['config'];
  code?: string;
}

/**
 * Practice stage - interactive problem for learner to solve
 */
export interface PracticeStage extends BaseStage {
  type: 'practice';
  problem: string;
  hints?: string[];
  validation: {
    type: 'code' | 'multiple_choice' | 'free_form' | 'command';
    testCases?: any[]; // For code validation
    correctAnswer?: any; // For multiple choice
    checker?: string; // Custom validation function name
  };
  starterCode?: string;
  language?: string;
}

/**
 * Code lab stage - full code editor with tests
 */
export interface CodeStage extends BaseStage {
  type: 'code';
  labId: number; // Reference to CodeLab in backend
  // OR inline definition:
  inlineConfig?: {
    title: string;
    description: string;
    starterCode: string;
    language: string;
    testCases: any[];
    solution?: string;
  };
}

/**
 * Quiz stage - assessment questions
 */
export interface QuizStage extends BaseStage {
  type: 'quiz';
  questions: QuizQuestion[];
  passingScore?: number; // Percentage (0-100)
  allowRetry?: boolean;
  showAnswersAfter?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'multiple_select' | 'true_false' | 'short_answer';
  options?: string[]; // For multiple choice
  correctAnswer: string | string[]; // Single or multiple correct answers
  explanation?: string;
  points?: number;
}

/**
 * Terminal stage - command-line exercises
 */
export interface TerminalStage extends BaseStage {
  type: 'terminal';
  items: LessonItem[]; // Reuse from progressive system
  environment?: {
    image?: string; // Docker image
    files?: Record<string, string>; // Files to pre-create
    workingDir?: string;
  };
}

/**
 * Custom stage - for future extensibility
 */
export interface CustomStage extends BaseStage {
  type: 'custom';
  componentName: string;
  props: Record<string, any>;
}

/**
 * Union type of all possible stages
 */
export type MultiStage =
  | ConceptStage
  | VisualizationStage
  | ExampleStage
  | PracticeStage
  | CodeStage
  | QuizStage
  | TerminalStage
  | CustomStage;

/**
 * Multi-stage lesson containing multiple stages
 */
export interface MultiStageLesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  tags?: string[];
  prerequisites?: string[]; // Slugs of prerequisite lessons
  stages: MultiStage[];

  // Optional metadata
  learningObjectives?: string[];
  author?: string;
  version?: string;
  lastUpdated?: string;
}

/**
 * Progress tracking for multi-stage lessons
 */
export interface MultiStageProgress {
  lessonId: string;
  userId?: number;
  currentStageIndex: number;
  completedStages: Set<string>; // Stage IDs
  stageScores: Map<string, number>; // Stage ID -> score (0-100)
  startedAt?: Date;
  lastAccessedAt?: Date;
  completedAt?: Date;
  timeSpentSeconds?: number;
}

/**
 * External link reference
 */
export interface ExternalLink {
  title: string;
  url: string;
  type?: 'documentation' | 'tutorial' | 'video' | 'article';
}

/**
 * Stage navigation controls
 */
export interface StageNavigation {
  canGoBack: boolean;
  canGoNext: boolean;
  canSkip: boolean;
  totalStages: number;
  currentStageIndex: number;
  completionPercentage: number;
}

/**
 * Response from backend API for multi-stage lessons
 */
export interface MultiStageLessonResponse {
  lesson: MultiStageLesson;
  progress?: MultiStageProgress;
  navigation?: StageNavigation;
}

/**
 * Request to update stage progress
 */
export interface UpdateStageProgressRequest {
  lessonId: string;
  stageId: string;
  completed: boolean;
  score?: number;
  timeSpentSeconds?: number;
  userResponse?: any; // For quiz answers, code submissions, etc.
}
