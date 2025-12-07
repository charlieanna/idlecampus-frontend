import { ComponentType } from './problemDefinition';
import { TestCase } from './testCase';

/**
 * Guided Tutorial Mode Types
 *
 * These types support a step-by-step teaching mode where users learn
 * the system design framework by implementing one FR at a time.
 *
 * The pedagogy follows:
 * 1. FR-First: Gather FRs → Build Brute Force → Make it work
 * 2. NFR-Later: Gather NFRs → Optimize → Make it scale
 *
 * Each step has phases:
 * - Story → Learn → Practice → Celebrate
 *
 * Step 0 (Requirements Gathering) has special phases:
 * - requirements-intro → requirements-questions → requirements-summary
 */

/**
 * Phase within a step: Story intro → Learn → Practice → Celebrate
 * Step 0 has special phases for requirements gathering
 */
export type StepPhase =
  | 'story'
  | 'learn'
  | 'practice'
  | 'celebrate'
  // Special phases for Step 0 (Requirements Gathering)
  | 'requirements-intro'      // Story intro explaining the interview context
  | 'requirements-questions'  // Interactive Q&A with interviewer
  | 'requirements-summary';   // Confirm FRs before building

/**
 * Narrative content for story-driven tutorials
 * Each step tells part of a story that motivates the task
 */
export interface StoryContent {
  // The scenario/situation (e.g., "Your server just crashed...")
  scenario: string;

  // The emotional hook - what went wrong or what's at stake
  hook: string;

  // The challenge/question that leads to the task
  challenge: string;

  // Visual/emoji to set the mood
  emoji?: string;

  // Optional illustration description
  illustration?: string;
}

/**
 * Celebration content shown after completing a step
 */
export interface CelebrationContent {
  // Celebration message (e.g., "Your data now survives crashes!")
  message: string;

  // What they achieved
  achievement: string;

  // Stats/metrics to show (e.g., "Latency: 50ms → 2ms")
  metrics?: Array<{ label: string; before?: string; after: string }>;

  // Teaser for next challenge (e.g., "But wait, traffic is spiking...")
  nextTeaser?: string;

  // Emoji/visual
  emoji?: string;
}

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

  // Famous incident/outage that teaches what can go wrong
  famousIncident?: {
    title: string;
    company: string;
    year: string;
    whatHappened: string;
    lessonLearned: string;
    icon?: string;
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
  frIndex?: number;  // Optional - not all steps map to a specific FR
  title?: string;    // Optional step title

  // NEW: Narrative story that introduces this step (shown full-screen)
  story?: StoryContent;

  // NEW: Celebration shown after completing this step
  celebration?: CelebrationContent;

  // Rich teaching content for the "Learn" phase
  learnPhase: TeachingContent;

  // Practice phase content (what to build)
  practicePhase: {
    frText: string;
    taskDescription: string;
    componentsNeeded?: ComponentHint[];  // Optional - some steps don't add new components
    connectionsNeeded?: ConnectionHint[];  // Optional - some steps don't add new connections
    successCriteria: string[];
  };

  // Validation criteria for this step (cumulative)
  validation: {
    requiredComponents: string[];
    requiredConnections?: { fromType: string; toType: string }[];  // Optional - some steps don't need specific connections
    // If true, requires App Server to have at least one API configured
    requireAPIConfiguration?: boolean;
    // If true, requires user to have written/edited Python code (basic presence check)
    requireCodeImplementation?: boolean;
    // If true, requires Database to have replication configured
    requireDatabaseReplication?: boolean;
    // If true, requires App Server to have multiple instances
    requireMultipleAppInstances?: boolean;
    // If true, requires Cache to have TTL and strategy configured
    requireCacheStrategy?: boolean;
    // If true, requires Database to have sufficient write capacity
    requireDatabaseCapacity?: boolean;
    // If true, requires total cost to be under budget ($500)
    requireCostUnderBudget?: boolean;
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

// =============================================================================
// REQUIREMENTS GATHERING TYPES (Step 0)
// =============================================================================

/**
 * A question the candidate can ask the interviewer about requirements
 *
 * Categories follow the interview discovery order:
 * 1. functional/clarification/scope - Core FR questions
 * 2. throughput - RPS, read/write ratio
 * 3. payload - Request/response size, storage
 * 4. burst - Peak traffic, spikes
 * 5. latency - Response time SLAs (request/response and processing)
 */
export interface InterviewQuestion {
  id: string;
  category:
    | 'functional'      // Core functionality questions
    | 'clarification'   // Scope clarifications
    | 'scope'           // What's in/out of scope
    | 'throughput'      // RPS, read/write ratio
    | 'payload'         // Request/response size, storage
    | 'burst'           // Peak traffic, spikes
    | 'latency'         // Response time SLAs
    | 'availability'    // Uptime, fault tolerance
    | 'cdn'             // CDN strategy, edge caching
    | 'consistency'     // Consistency vs availability trade-offs
    | 'reliability'     // Fault tolerance, recovery
    | 'quality'         // Media quality, encoding
    | 'security';       // Security, compliance, encryption
  question: string;
  answer: string;
  importance: 'critical' | 'important' | 'nice-to-have';
  // What FR this question reveals
  revealsRequirement?: string;
  // Learning point from asking this question
  learningPoint?: string;
  // Follow-up insight shown after asking
  insight?: string;
  // For scale questions, include the math calculation
  calculation?: {
    formula: string;
    result: string;
  };
}

/**
 * A functional requirement confirmed through the interview
 */
export interface ConfirmedFR {
  id: string;
  text: string;
  description: string;
  emoji?: string;
}

/**
 * Scale metrics summary for the system
 */
export interface ScaleMetrics {
  dailyActiveUsers: string;
  writesPerDay: string;
  readsPerDay: string;
  peakMultiplier: number;
  readWriteRatio: string;
  calculatedWriteRPS: { average: number; peak: number };
  calculatedReadRPS: { average: number; peak: number };
  // Optional payload metrics
  maxPayloadSize?: string;
  storagePerRecord?: string;
  storageGrowthPerYear?: string;
  // Optional latency metrics
  redirectLatencySLA?: string;
  createLatencySLA?: string;
}

/**
 * Content for the requirements gathering phase (Step 0)
 * Now includes both FR and NFR (scale) questions
 */
export interface RequirementsGatheringContent {
  // Initial problem statement from interviewer
  problemStatement: string;
  
  // Interviewer persona
  interviewer: {
    name: string;
    role: string;
    avatar: string; // emoji
  };
  
  // Available questions to ask (FR + NFR combined)
  questions: InterviewQuestion[];
  
  // Minimum questions required before proceeding
  minimumQuestionsRequired: number;
  
  // Critical question IDs that must be asked
  criticalQuestionIds: string[];
  
  // NEW: Separate critical IDs by category for UI grouping
  criticalFRQuestionIds?: string[];
  criticalScaleQuestionIds?: string[];
  
  // FRs that will be confirmed at the end
  confirmedFRs: ConfirmedFR[];
  
  // NEW: Scale metrics summary (calculated from throughput questions)
  scaleMetrics?: ScaleMetrics;
  
  // NEW: Architectural implications derived from scale
  architecturalImplications?: string[];
  
  // Items explicitly out of scope
  outOfScope: string[];
  
  // Key insight to show at the end (e.g., "Focus on functionality first!")
  keyInsight: string;
}

/**
 * Story content specifically for requirements intro
 */
export interface RequirementsIntroContent extends StoryContent {
  // The interview context
  interviewContext: string;
}

/**
 * Welcome story shown at the start of the tutorial
 */
export interface WelcomeStory {
  emoji: string;
  hook: string;
  scenario: string;
  challenge: string;
}

/**
 * Complete guided tutorial for a problem
 */
export interface GuidedTutorial {
  problemId: string;
  problemTitle?: string;  // Optional - can use title instead
  title?: string;         // Alternative to problemTitle
  description?: string;   // Brief description of the tutorial
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes?: number;  // Estimated time to complete

  // Welcome story shown before the tutorial starts
  welcomeStory?: WelcomeStory;

  // NEW: Requirements gathering phase (Step 0) - optional for backwards compatibility
  requirementsPhase?: RequirementsGatheringContent;

  totalSteps?: number;  // Optional - can be derived from steps.length
  steps: GuidedStep[];

  // Final exam test cases - the same test cases as the regular challenge page
  // When users complete the final step, they are validated against these test cases
  finalExamTestCases?: TestCase[];

  // Meta information for the tutorial
  concepts?: string[];           // Key concepts covered in the tutorial
  ddiaReferences?: string[];     // DDIA chapter references
  prerequisites?: string[];      // Prerequisites for the tutorial
}

/**
 * User's progress through the guided tutorial
 */
export interface GuidedTutorialProgress {
  problemId: string;
  currentStepIndex: number;
  currentPhase: StepPhase; // 'learn' or 'practice' or requirements phases
  completedStepIds: string[];
  attemptCounts: Record<string, number>;
  hintLevel: HintLevel;
  startedAt: string;
  lastAccessedAt: string;
  completedAt?: string;
  // Track quiz answers for analytics
  quizAnswers?: Record<string, { selectedIndex: number; correct: boolean }>;
  // NEW: Track which interview questions have been asked (for Step 0)
  askedQuestionIds?: string[];
  // NEW: Whether requirements phase (Step 0) is complete
  requirementsPhaseComplete?: boolean;
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
