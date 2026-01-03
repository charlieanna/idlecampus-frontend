/**
 * Progress-Aware Decay System Types
 * 
 * Tracks user mastery across modules with decay based on
 * learning progress (not calendar time).
 */

// ============= Decay Classification =============

export type DecayClassification = 
  | 'fresh'       // < 10% decay - just learned, still solid
  | 'stable'      // 10-25% decay - good retention
  | 'fading'      // 25-40% decay - should review soon
  | 'decayed'     // 40-60% decay - needs practice
  | 'critical';   // > 60% decay - significant forgetting

// ============= Core Data Models =============

export interface ModuleCompletion {
  moduleId: string;
  moduleName: string;
  sequenceNumber: number;               // 1st, 2nd, 3rd module completed
  completedAt: Date;                    // For reference only, not used for decay
  completionScore: number;              // 0-100 score from exercises
  problemsSolvedInModule: number;       // Problems solved in this module
  totalProblemsAtCompletion: number;    // Global problem count at time of completion
  conceptsLearned: string[];            // Concept IDs introduced in this module
}

export interface ConceptMastery {
  conceptId: string;
  conceptName: string;
  
  // === LEARNING SEQUENCE TRACKING ===
  moduleId: string;                     // Module where concept was learned
  moduleSequence: number;               // Order: 1st, 2nd, 3rd module completed
  problemsAtTimeOfLearning: number;     // Total problems solved when this was learned
  
  // === PERFORMANCE METRICS ===
  masteryScore: number;                 // Raw mastery (0-100) from exercises
  practiceCount: number;                // Total practices in this concept
  successRate: number;                  // Success rate in practices (0-1)
  averageSubmissionAttempts: number;    // Avg attempts before passing
  
  // === CLASSIFICATION ===
  isStrength: boolean;                  // Top 25% of concepts
  isWeakness: boolean;                  // Bottom 25% or struggling
  
  // === PROGRESS-AWARE DECAY (calculated on-demand) ===
  decayedMasteryScore?: number;         // Mastery after progress decay applied
  decayPercentage?: number;             // How much has decayed (0-1)
  decayClassification?: DecayClassification;
  
  // === PRACTICE RECOVERY ===
  practiceCountAfterModule: number;     // Practices in Smart Practice after completing module
  lastPracticedInSmartMode: Date | null;
}

export interface StrengthWeakness {
  conceptId: string;
  conceptName: string;
  classification: 'strength' | 'weakness' | 'improving' | 'neutral';
  confidence: number;                   // 0-1, how confident in this classification
  lastAssessed: Date;
  evidence: string;                     // Why classified this way
  decayedScore: number;                 // Current decayed mastery
}

export interface LearningEvent {
  type: 'module-completion' | 'smart-practice' | 'problem-solved' | 'assessment';
  timestamp: Date;
  moduleId?: string;
  conceptIds?: string[];
  problemId?: string;
  score?: number;
  details?: Record<string, unknown>;
}

// ============= User Mastery Profile =============

export interface UserMasteryProfile {
  userId: string;
  
  // === MODULE PROGRESS ===
  moduleCompletions: ModuleCompletion[];
  currentModuleIndex: number;           // Which module user is on now
  totalModulesCompleted: number;
  
  // === PROBLEM PROGRESS ===
  totalProblemsCompleted: number;       // Global counter across all modules
  totalSmartPracticeProblems: number;   // Problems done in smart practice mode
  
  // === CONCEPT MASTERY (with decay) ===
  conceptMastery: Map<string, ConceptMastery>;
  
  // === STRENGTHS & WEAKNESSES ===
  strengths: StrengthWeakness[];
  weaknesses: StrengthWeakness[];
  
  // === LEARNING TIMELINE ===
  learningTimeline: LearningEvent[];
  
  // === METADATA ===
  createdAt: Date;
  lastUpdatedAt: Date;
}

// ============= Decay Calculation Results =============

export interface ProgressDecayResult {
  originalMastery: number;
  decayedMastery: number;
  decayPercentage: number;              // 0-1 (e.g., 0.2 = 20% decay)
  modulesAfter: number;                 // How many modules learned since
  problemsAfter: number;                // How many problems solved since
  practiceRecovery: number;             // How much recovered from smart practice
  urgencyToReview: number;              // 0-100, higher = more urgent
  classification: DecayClassification;
}

export interface ConceptWithDecay extends ConceptMastery {
  decay: ProgressDecayResult;
  priority: number;                     // Combined priority for practice selection
}

// ============= Smart Practice Configuration =============

export interface SmartPracticeConfig {
  problemCount: number;                 // How many problems to select
  
  // Targeting preferences
  focusWeaknesses: boolean;             // Prioritize weak concepts
  mixInStrengths: boolean;              // Include some strengths for confidence
  weaknessRatio: number;                // 0-1, e.g., 0.7 = 70% weakness problems
  
  // Decay preferences
  prioritizeDecayed: boolean;           // Focus on fading/decayed concepts
  excludeFresh: boolean;                // Skip concepts just learned
  
  // Cross-module
  crossModuleReview: boolean;           // Pull from multiple modules
  moduleWindow: number;                 // How many past modules to include (0 = all)
}

// ============= Decay Engine Configuration =============

export interface DecayConfig {
  // Base decay rates
  moduleDecayRate: number;              // Decay per module completed after (default: 0.05 = 5%)
  problemDecayRate: number;             // Decay per 10 problems in other topics (default: 0.005 = 0.5%)
  problemDecayDampenPerModule: number;  // How aggressively problem decay fades after additional modules
  
  // Strength/weakness modifiers
  strengthDecayMultiplier: number;      // Multiplier for strengths (default: 0.6 = 40% slower)
  weaknessDecayMultiplier: number;      // Multiplier for weaknesses (default: 1.4 = 40% faster)
  
  // Practice recovery
  practiceRecoveryRate: number;         // Recovery per smart practice session (default: 0.03 = 3%)
  
  // Caps
  maxDecay: number;                     // Maximum decay allowed (default: 0.8 = 80%)
  
  // Thresholds for classification
  freshThreshold: number;               // Below this = fresh (default: 0.10)
  stableThreshold: number;              // Below this = stable (default: 0.25)
  fadingThreshold: number;              // Below this = fading (default: 0.40)
  decayedThreshold: number;             // Below this = decayed (default: 0.60)
  // Above decayedThreshold = critical
}

export const DEFAULT_DECAY_CONFIG: DecayConfig = {
  moduleDecayRate: 0.05,
  problemDecayRate: 0.005,
  problemDecayDampenPerModule: 0.5,
  strengthDecayMultiplier: 0.6,
  weaknessDecayMultiplier: 1.4,
  practiceRecoveryRate: 0.03,
  maxDecay: 0.8,
  freshThreshold: 0.10,
  stableThreshold: 0.25,
  fadingThreshold: 0.40,
  decayedThreshold: 0.60,
};

// ============= Storage Keys =============

export const STORAGE_KEYS = {
  USER_MASTERY_PROFILE: 'dsa-user-mastery-profile',
  DECAY_CONFIG: 'dsa-decay-config',
  LEARNING_TIMELINE: 'dsa-learning-timeline',
} as const;

// ============= Helper Types =============

export interface ModuleProgressSummary {
  moduleId: string;
  moduleName: string;
  sequenceNumber: number;
  originalScore: number;
  currentRetention: number;             // After decay
  decayPercentage: number;
  classification: DecayClassification;
  conceptCount: number;
  strengthCount: number;
  weaknessCount: number;
}

// ============= Module-Level Mastery Record =============

/**
 * Tracks module-level mastery with progress-based decay.
 * Used by gamificationStore to show module health and prioritize practice.
 */
export interface ModuleMasteryRecord {
  moduleId: string;
  moduleName: string;

  // Learning sequence
  sequenceNumber: number;               // 1st, 2nd, 3rd module completed
  completedAt: number;                  // Timestamp when completed

  // Mastery scores
  initialScore: number;                 // 0-100 score at completion
  currentMastery: number;               // Decayed score (calculated on-demand)

  // Decay tracking
  decayPercentage: number;              // 0-1 (e.g., 0.2 = 20% decay)
  classification: DecayClassification;

  // Strength/weakness flags (affects decay rate)
  isStrength: boolean;
  isWeakness: boolean;

  // Practice recovery
  lastPracticedAt: number | null;       // Timestamp of last Smart Practice session
  practiceCountAfterModule: number;     // Number of practice sessions after completion

  // Problem tracking
  problemCount: number;                 // Total problems in this module
  solvedProblemsInModule: number;       // Problems solved during learning
}

export interface ConceptProgressSummary {
  conceptId: string;
  conceptName: string;
  moduleId: string;
  originalMastery: number;
  currentRetention: number;
  decayPercentage: number;
  classification: DecayClassification;
  isStrength: boolean;
  isWeakness: boolean;
  practiceCount: number;
  urgency: number;
}