
export type FamilyCategory =
  | 'arrays-hashing'
  | 'two-pointers'
  | 'sliding-window'
  | 'stack'
  | 'binary-search'
  | 'linked-list'
  | 'trees'
  | 'tries'
  | 'heap-priority-queue'
  | 'backtracking'
  | 'graphs'
  | 'dynamic-programming-1d'
  | 'dynamic-programming-2d'
  | 'greedy'
  | 'intervals'
  | 'math-geometry'
  | 'bit-manipulation'
  | 'advanced-topics'
  | 'edge-cases';

export interface ConceptFamily {
  familyId: string;              // e.g., "two-sum-family"
  familyName: string;            // e.g., "Two Sum Pattern"
  category: FamilyCategory;      // e.g., "arrays-hashing"

  // Core concepts this family teaches
  concepts: string[];            // e.g., ["hashmap", "complement-lookup"]

  // Pool of problem variations (3-10 per family)
  variations: ProblemVariation[];

  // Metadata
  level: number;                 // 1-5 Difficulty Tier
  moduleId: number;              // Maps to course modules (0.5 to 14)
}

export interface ProblemVariation {
  variationId: string;           // Unique ID
  problemId: string;             // Links to existing DSAProblem
  variationName: string;         // e.g., "Two Sum - Basic"
  difficulty: 'easy' | 'medium' | 'hard';
  order: number;                 // Suggested order within family
}

// ------------------------------------------------------------------
// Mastery Tracking
// ------------------------------------------------------------------

export type FamilyMasteryStatus =
  | 'not-started'
  | 'learning'          // In learning mode (tutorial, guided problems)
  | 'ready-for-mastery' // Completed learning, ready for mastery challenge
  | 'attempting'        // Actively attempting mastery (has seen 1+ variations)
  | 'struggling'        // Major struggle, sent back to learning mode
  | 'mastered';         // Passed mastery challenge

export interface FamilyMasteryRecord {
  familyId: string;

  // Mastery Status
  status: FamilyMasteryStatus;
  isMastered: boolean;
  masteredAt: number | null;           // Timestamp
  masteredAtIndex: number | null;      // Problem index when mastered (for progress-based decay)
  masteryVariationId: string | null;   // Which variation proved mastery

  // Decay & Review Tracking (for spaced repetition)
  lastReviewedAtIndex: number | null;  // Last review position
  reviewAttempts: number;              // Number of review attempts
  usedHelpOnMastery: boolean;          // Did user need help to master?

  // Variation Tracking
  usedVariations: string[];            // Variations user has seen
  currentVariationId: string | null;   // Currently assigned variation

  // Attempt History
  attempts: VariationAttempt[];

  // Stats
  totalAttempts: number;
  totalTimeSpentMs: number;
  bestTimeMs: number | null;
  totalHintsUsed: number;
}

export type LearningPhase =
  | 'concept-explanation'  // Reading/watching explanation
  | 'guided-walkthrough'   // Step-by-step traced example
  | 'template-study'       // Studying the code template
  | 'practice-problem'     // Solving with hints available
  | 'mastery-challenge';   // Fresh variation, first-attempt rule

export interface VariationAttempt {
  variationId: string;
  problemId: string;
  attemptNumber: number;        // Which attempt on THIS variation (1 = first)
  timestamp: number;
  phase: LearningPhase;         // Which phase this attempt was in

  // Performance
  timeMs: number;
  hintsUsed: number;
  hintInsights?: VariationHintInsights;
  passed: boolean;
  submissionAttempts: number;   // How many Run/Submit before passing

  // Mastery qualification (only applies in 'mastery-challenge' phase)
  isFirstAttempt: boolean;      // First time seeing this variation
  qualifiesForMastery: boolean; // passed && isFirstAttempt && ≤20min && ≤1hint && phase === 'mastery-challenge'

  // Struggle analysis
  struggleScore: number;        // 0-100 calculated from performance
  triggeredPrerequisites: string[]; // Prerequisites inserted due to this struggle
  triggeredLearningReturn: boolean; // If true, user was sent back to learning mode
}

export interface VariationHintInsights {
  totalRevealed: number;
  helpedCount: number;
  stuckCount: number;
  severities: ('light' | 'medium' | 'heavy')[];
  conceptTags: string[];
  families: string[];
}

// ------------------------------------------------------------------
// Adaptive Queue
// ------------------------------------------------------------------

export interface AdaptiveLearningQueue {
  // Current queue of families to practice (dynamically reordered)
  queue: QueuedFamily[];

  // Families temporarily paused due to prerequisites
  pausedFamilies: PausedFamily[];

  // History of queue modifications for transparency
  queueHistory: QueueModification[];
}

export interface QueuedFamily {
  familyId: string;
  priority: number;           // Lower = more urgent
  reason: 'next-in-sequence' | 'prerequisite-needed' | 'retry-after-prereqs';
  addedAt: number;
}

export interface PausedFamily {
  familyId: string;
  pausedAt: number;
  requiredPrerequisites: string[];   // Which prereqs must be mastered first
  prereqProgress: Record<string, boolean>; // prereqId → isMastered (boolean)
}

// Note: Map is not serializable in JSON implicitly, so for store we might use Record<string, boolean>
// Identifying that PausedFamily using Map might be an issue for local storage persistence.
// For now keeping interface aligned with plan, but aware of storage implications.

export interface QueueModification {
  timestamp: number;
  action: 'insert-prereqs' | 'resume-paused' | 'mark-mastered' | 'reorder';
  affectedFamilies: string[];
  reason: string;
}
