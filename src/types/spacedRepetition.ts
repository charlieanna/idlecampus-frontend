/**
 * Spaced Repetition System (SRS) for Concept Mastery
 *
 * Based on SM-2 algorithm with scenario-based questions to ensure
 * users truly understand concepts rather than memorize answers.
 */

// ============================================================================
// Core Concept Tracking
// ============================================================================

/**
 * A concept is a specific learning unit that can be reviewed
 * Examples: "Redis vs Kafka", "Write-through vs Write-back caching", "CAP Theorem"
 */
export interface Concept {
  id: string;
  title: string;
  category: ConceptCategory;
  description: string;
  prerequisites?: string[]; // Other concept IDs that should be learned first
  relatedConcepts?: string[]; // Related concept IDs
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  estimatedTimeMinutes: number;
  tags: string[]; // e.g., ["caching", "performance", "database"]
}

export type ConceptCategory =
  | 'caching'
  | 'storage'
  | 'messaging'
  | 'networking'
  | 'consistency'
  | 'availability'
  | 'scalability'
  | 'performance'
  | 'security'
  | 'architecture';

// ============================================================================
// Spaced Repetition State (SM-2 Algorithm)
// ============================================================================

/**
 * User's learning state for a specific concept
 * Uses SM-2 algorithm for optimal review scheduling
 */
export interface ConceptReviewState {
  conceptId: string;
  userId: string;

  // SM-2 Algorithm State
  easeFactor: number;        // 1.3 to 2.5, default 2.5 (how "easy" this concept is for user)
  interval: number;          // Days until next review
  repetitions: number;       // Number of consecutive correct reviews

  // Review History
  lastReviewedAt: Date | null;
  nextReviewAt: Date;
  totalReviews: number;
  totalCorrect: number;
  totalIncorrect: number;

  // Performance Metrics
  averageConfidence: number;  // 0-100, user's self-reported confidence
  averageResponseTime: number; // Seconds taken to answer
  masteryLevel: MasteryLevel;

  // Question History (to ensure variety)
  answeredQuestionIds: string[];
  lastQuestionId: string | null;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export type MasteryLevel =
  | 'not_started'    // Never reviewed
  | 'learning'       // 0-2 repetitions
  | 'familiar'       // 3-5 repetitions
  | 'proficient'     // 6-9 repetitions
  | 'mastered';      // 10+ repetitions with high ease factor

// ============================================================================
// Scenario-Based Questions
// ============================================================================

/**
 * Scenario-based question that requires critical thinking
 * Not simple MCQ - requires understanding trade-offs and context
 */
export interface ScenarioQuestion {
  id: string;
  conceptId: string;

  // The Scenario
  scenario: {
    context: string;          // Business/technical context
    requirements: string[];   // What needs to be achieved
    constraints?: string[];   // Limitations (budget, latency, etc.)
    metrics?: Record<string, string>; // Traffic, data size, etc.
  };

  // The Question
  question: string;
  questionType: ScenarioQuestionType;

  // Expected Answer Components
  expectedAnswer: {
    keyPoints: KeyPoint[];      // Must mention these concepts
    tradeoffs?: Tradeoff[];     // Should discuss these tradeoffs
    antipatterns?: string[];    // Should NOT suggest these
    optionalPoints?: string[];  // Bonus points for mentioning
  };

  // Hints (progressive disclosure)
  hints?: {
    condition: HintCondition;
    text: string;
  }[];

  // Learning Material
  explanation: string;           // Detailed explanation after answering
  relatedResources?: Resource[];

  // Metadata
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTimeSeconds: number;
  tags: string[];

  // Variations (to prevent memorization)
  variationGroup?: string; // Questions in same group are similar
}

export type ScenarioQuestionType =
  | 'component_choice'      // "Should you use Redis or Kafka?"
  | 'architecture_decision' // "How would you design X?"
  | 'tradeoff_analysis'     // "What are pros/cons of approach Y?"
  | 'debugging_scenario'    // "System has problem X, what's wrong?"
  | 'optimization_scenario' // "How to improve performance of Z?"
  | 'scale_planning';       // "System needs to scale 10x, what changes?"

export interface KeyPoint {
  concept: string;              // The key concept that must be mentioned
  keywords: string[];           // Variations of how it might be expressed
  weight: number;               // Importance (0-1)
  mustMention: boolean;         // Required vs. optional
}

export interface Tradeoff {
  aspect: string;               // e.g., "Consistency vs Availability"
  options: {
    name: string;
    pros: string[];
    cons: string[];
  }[];
}

export type HintCondition =
  | 'time_exceeded'    // User took too long
  | 'attempt_failed'   // User got it wrong
  | 'requested';       // User explicitly asked

export interface Resource {
  type: 'article' | 'video' | 'documentation' | 'example';
  title: string;
  url?: string;
  description?: string;
}

// ============================================================================
// User Responses & Grading
// ============================================================================

/**
 * User's response to a scenario question
 */
export interface ScenarioResponse {
  id: string;
  questionId: string;
  conceptId: string;
  userId: string;

  // User's Answer
  answer: string;              // Free-form text response
  confidence: 1 | 2 | 3 | 4 | 5; // 1=guessing, 5=very confident
  responseTimeSeconds: number;
  hintsUsed: number;

  // Evaluation
  evaluation: ResponseEvaluation;

  // Metadata
  answeredAt: Date;
  reviewSessionId?: string;
}

export interface ResponseEvaluation {
  score: number;               // 0-100
  passed: boolean;             // Score >= 70

  // Detailed Breakdown
  keyPointsFound: {
    concept: string;
    found: boolean;
    matchedKeywords: string[];
  }[];

  tradeoffsDiscussed: string[]; // Which tradeoffs were mentioned
  antipatternsMentioned: string[]; // Flagged if any anti-patterns found
  optionalPointsFound: string[];

  // Quality Metrics
  completeness: number;        // 0-100, how thorough was the answer
  accuracy: number;            // 0-100, correctness of concepts
  depth: number;               // 0-100, level of detail and understanding

  // Feedback
  strengths: string[];         // What they did well
  improvements: string[];      // What to work on
  nextSteps?: string[];        // Suggested learning paths
}

// ============================================================================
// Review Sessions
// ============================================================================

/**
 * A review session containing multiple concept questions
 */
export interface ReviewSession {
  id: string;
  userId: string;
  sessionType: ReviewSessionType;

  // Session Content
  concepts: {
    conceptId: string;
    questionId: string;
    dueAt: Date;
    priority: number;  // Higher = more urgent
  }[];

  // Progress
  currentIndex: number;
  completedQuestions: string[];

  // Performance
  startedAt: Date;
  completedAt?: Date;
  totalTimeSeconds?: number;
  averageScore?: number;

  // Session Metadata
  createdAt: Date;
}

export type ReviewSessionType =
  | 'daily_review'      // Scheduled daily reviews
  | 'due_concepts'      // Only concepts that are due
  | 'weak_concepts'     // Focus on concepts with low mastery
  | 'category_review'   // Review specific category (e.g., all caching)
  | 'pre_challenge';    // Review before attempting a challenge

// ============================================================================
// SM-2 Algorithm Implementation
// ============================================================================

/**
 * Calculate next review interval using SM-2 algorithm
 *
 * @param currentState Current review state
 * @param quality User's response quality (0-5)
 *   0: Complete blackout
 *   1: Incorrect, but felt familiar
 *   2: Incorrect, but correct answer seemed easy to recall
 *   3: Correct, but required significant effort
 *   4: Correct, with some hesitation
 *   5: Perfect recall
 * @returns Updated review state
 */
export function calculateNextReview(
  currentState: ConceptReviewState,
  quality: 0 | 1 | 2 | 3 | 4 | 5
): Partial<ConceptReviewState> {
  const MIN_EASE_FACTOR = 1.3;

  // Calculate new ease factor
  let newEaseFactor = currentState.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEaseFactor = Math.max(newEaseFactor, MIN_EASE_FACTOR);

  let newInterval: number;
  let newRepetitions: number;

  if (quality < 3) {
    // Answer was incorrect or too difficult - reset
    newRepetitions = 0;
    newInterval = 1; // Review tomorrow
  } else {
    // Answer was correct
    newRepetitions = currentState.repetitions + 1;

    if (newRepetitions === 1) {
      newInterval = 1; // First review: 1 day
    } else if (newRepetitions === 2) {
      newInterval = 6; // Second review: 6 days
    } else {
      // Subsequent reviews: multiply by ease factor
      newInterval = Math.round(currentState.interval * newEaseFactor);
    }
  }

  const now = new Date();
  const nextReviewAt = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    lastReviewedAt: now,
    nextReviewAt,
    totalReviews: currentState.totalReviews + 1,
    totalCorrect: currentState.totalCorrect + (quality >= 3 ? 1 : 0),
    totalIncorrect: currentState.totalIncorrect + (quality < 3 ? 1 : 0),
    updatedAt: now,
  };
}

/**
 * Determine mastery level based on repetitions and ease factor
 */
export function calculateMasteryLevel(state: ConceptReviewState): MasteryLevel {
  if (state.totalReviews === 0) return 'not_started';
  if (state.repetitions < 3) return 'learning';
  if (state.repetitions < 6) return 'familiar';
  if (state.repetitions < 10) return 'proficient';
  if (state.repetitions >= 10 && state.easeFactor >= 2.0) return 'mastered';
  return 'proficient';
}

/**
 * Calculate quality rating from scenario response
 */
export function calculateQuality(evaluation: ResponseEvaluation, confidence: number): 0 | 1 | 2 | 3 | 4 | 5 {
  const score = evaluation.score;

  if (score < 30) return 0; // Complete failure
  if (score < 50) return 1; // Incorrect but some familiarity
  if (score < 70) return 2; // Close but not quite

  // Passed (>= 70), now factor in confidence
  if (score >= 90 && confidence >= 4) return 5; // Perfect
  if (score >= 80 && confidence >= 3) return 4; // Good recall
  return 3; // Correct but took effort
}

// ============================================================================
// Review Scheduling
// ============================================================================

/**
 * Get concepts that are due for review
 */
export interface ReviewDueQuery {
  userId: string;
  maxConcepts?: number;
  categories?: ConceptCategory[];
  prioritizeWeak?: boolean; // Prioritize concepts with low mastery
}

export interface ConceptDueForReview {
  conceptId: string;
  concept: Concept;
  state: ConceptReviewState;
  priority: number;    // How urgent (based on how overdue)
  daysOverdue: number;
}

/**
 * Calculate priority for review
 * Higher priority = more urgent to review
 */
export function calculateReviewPriority(state: ConceptReviewState): number {
  const now = new Date();
  const nextReview = new Date(state.nextReviewAt);
  const daysOverdue = Math.max(0, (now.getTime() - nextReview.getTime()) / (24 * 60 * 60 * 1000));

  // Base priority on how overdue
  let priority = daysOverdue;

  // Boost priority for concepts with low mastery
  if (state.masteryLevel === 'learning') priority *= 2;
  if (state.masteryLevel === 'familiar') priority *= 1.5;

  // Boost priority for concepts with low ease factor (user struggles with them)
  if (state.easeFactor < 1.8) priority *= 1.5;

  // Boost priority for concepts never reviewed
  if (state.totalReviews === 0) priority = 1000; // Highest priority

  return priority;
}
