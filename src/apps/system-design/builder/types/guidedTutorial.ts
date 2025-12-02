import { ComponentType } from './problemDefinition';

/**
 * Guided Tutorial Mode Types
 *
 * These types support a step-by-step teaching mode where users learn
 * the system design framework by implementing one FR at a time.
 *
 * The pedagogy follows: TEACH → SOLVE → TEACH → SOLVE
 * Each step has two phases:
 * 1. Learn Phase: User reads concept explanation, sees diagrams, understands "why"
 * 2. Practice Phase: User implements what they learned on the canvas
 */

/**
 * Phase within a step: Learn first, then Practice
 */
export type StepPhase = 'learn' | 'practice';

/**
 * Key concept to highlight during teaching
 */
export interface KeyConcept {
  title: string;
  explanation: string;
  icon?: string; // emoji or icon name
}

/**
 * Common mistake to warn about
 */
export interface CommonMistake {
  mistake: string;
  why: string;
  correct: string;
}

/**
 * Rich teaching content for the "Learn" phase
 */
export interface TeachingContent {
  // Main concept being taught
  conceptTitle: string;

  // Detailed explanation (supports markdown)
  conceptExplanation: string;

  // Why this matters in real systems
  whyItMatters: string;

  // Real-world example
  realWorldExample?: {
    company: string;
    scenario: string;
    howTheyDoIt: string;
  };

  // Key points to remember (3-5 bullet points)
  keyPoints: string[];

  // Visual diagram (ASCII art or markdown table)
  diagram?: string;

  // Key concepts breakdown
  keyConcepts?: KeyConcept[];

  // Common mistakes to avoid
  commonMistakes?: CommonMistake[];

  // Interview tip
  interviewTip?: string;

  // Quick quiz question to check understanding
  quickCheck?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

/**
 * Hint about which component to add
 */
export interface ComponentHint {
  type: ComponentType | string;
  reason: string;
  displayName: string;
}

/**
 * Hint about which connection to make
 */
export interface ConnectionHint {
  from: string;
  to: string;
  reason: string;
}

/**
 * A single step in the guided tutorial
 * Each step corresponds to one userFacingFR
 *
 * Each step has two phases:
 * 1. Learn Phase: Rich teaching content, concepts, examples
 * 2. Practice Phase: User implements on canvas with hints available
 */
export interface GuidedStep {
  id: string;
  stepNumber: number;
  frIndex: number;

  // Rich teaching content for the "Learn" phase
  learnPhase: TeachingContent;

  // Practice phase content (what to build)
  practicePhase: {
    frText: string;
    taskDescription: string;
    componentsNeeded: ComponentHint[];
    connectionsNeeded: ConnectionHint[];
    successCriteria: string[];
  };

  // Validation criteria for this step (cumulative)
  validation: {
    requiredComponents: string[];
    requiredConnections: { fromType: string; toType: string }[];
  };

  // 3-tier hint system (used during practice phase)
  hints: {
    level1: string;
    level2: string;
    solutionComponents: Array<{ type: string; config?: Record<string, unknown> }>;
    solutionConnections: Array<{ from: string; to: string }>;
  };

  // Legacy field for backward compatibility
  teaching?: {
    frText: string;
    conceptExplanation: string;
    componentsNeeded: ComponentHint[];
    connectionsNeeded: ConnectionHint[];
  };
}

/**
 * Complete guided tutorial for a problem
 */
export interface GuidedTutorial {
  problemId: string;
  problemTitle: string;
  totalSteps: number;
  steps: GuidedStep[];
}

/**
 * User's progress through the guided tutorial
 */
export interface GuidedTutorialProgress {
  problemId: string;
  currentStepIndex: number;
  currentPhase: StepPhase; // 'learn' or 'practice'
  completedStepIds: string[];
  attemptCounts: Record<string, number>;
  hintLevel: HintLevel;
  startedAt: string;
  lastAccessedAt: string;
  completedAt?: string;
  // Track quiz answers for analytics
  quizAnswers?: Record<string, { selectedIndex: number; correct: boolean }>;
}

/**
 * Hint levels for the 3-tier hint system
 */
export type HintLevel = 'none' | 'level1' | 'level2' | 'solution';

/**
 * Mode selection for the system design builder
 */
export type BuilderMode = 'solve-on-own' | 'guided-tutorial';

/**
 * Result of validating the current step
 */
export interface StepValidationResult {
  passed: boolean;
  missingComponents: string[];
  missingConnections: Array<{ from: string; to: string }>;
  feedback: string;
  suggestions?: string[];
}

/**
 * Tutorial completion status for a problem
 */
export interface TutorialCompletionStatus {
  problemId: string;
  isCompleted: boolean;
  completedAt?: string;
  totalSteps: number;
  completedSteps: number;
}
