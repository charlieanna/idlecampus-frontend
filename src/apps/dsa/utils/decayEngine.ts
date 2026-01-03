/**
 * Progress-Aware Decay Engine
 *
 * Implements spaced repetition with performance-aware decay for Smart Practice.
 * Based on SM-2 algorithm with modifications for coding problems.
 *
 * Key concepts:
 * - Mastery decays over time (forgetting curve)
 * - Harder problems decay faster
 * - Problems solved with hints decay faster
 * - Multiple attempts to solve = lower initial mastery
 * - Review timing follows spaced repetition intervals
 */

// Types
export interface ProblemAttempt {
  timestamp: number;        // Unix timestamp
  success: boolean;         // Did they solve it?
  hintsUsed: number;        // How many hints were revealed
  attemptNumber: number;    // Which attempt was this (1st, 2nd, etc.)
  timeSpentMs: number;      // Time from start to submission
  wasReview: boolean;       // Was this a review or first-time solve?
}

export interface ProblemMastery {
  problemId: string;

  // SM-2 style parameters
  easeFactor: number;       // 1.3 to 2.5 (default 2.5) - how easy is this problem for user
  interval: number;         // Current interval in days until next review
  repetitions: number;      // Number of successful reviews in a row

  // Timestamps
  firstSolvedAt: number;    // When first successfully solved
  lastReviewedAt: number;   // When last reviewed/solved
  nextReviewAt: number;     // Calculated next review date

  // Performance metrics
  totalAttempts: number;    // Total solve attempts
  successfulAttempts: number;
  averageHintsUsed: number;
  averageTimeMs: number;

  // Decay state
  currentMasteryScore: number;  // 0-100, decays over time
  decayRate: number;            // How fast this problem decays (based on difficulty + performance)

  // History
  attempts: ProblemAttempt[];
}

export interface DecayEngineConfig {
  // Decay parameters
  baseDecayRate: number;        // Default: 0.1 (10% per interval)
  difficultyMultiplier: {
    easy: number;               // Default: 0.7
    medium: number;             // Default: 1.0
    hard: number;               // Default: 1.4
  };
  hintPenalty: number;          // Default: 0.15 per hint
  multiAttemptPenalty: number;  // Default: 0.1 per extra attempt

  // Spaced repetition intervals (in days)
  initialInterval: number;      // Default: 1
  maxInterval: number;          // Default: 180

  // Review thresholds
  masteryThreshold: number;     // Default: 70 (below this = needs review)
  criticalThreshold: number;    // Default: 40 (below this = urgent review)
}

const DEFAULT_CONFIG: DecayEngineConfig = {
  baseDecayRate: 0.1,
  difficultyMultiplier: {
    easy: 0.7,
    medium: 1.0,
    hard: 1.4,
  },
  hintPenalty: 0.15,
  multiAttemptPenalty: 0.1,
  initialInterval: 1,
  maxInterval: 180,
  masteryThreshold: 70,
  criticalThreshold: 40,
};

/**
 * Calculate the decay rate for a problem based on difficulty and performance
 */
export function calculateDecayRate(
  difficulty: 'easy' | 'medium' | 'hard',
  hintsUsed: number,
  attemptsToSolve: number,
  config: DecayEngineConfig = DEFAULT_CONFIG
): number {
  let rate = config.baseDecayRate;

  // Apply difficulty multiplier
  rate *= config.difficultyMultiplier[difficulty] || 1.0;

  // Apply hint penalty (more hints = faster decay)
  rate *= 1 + (hintsUsed * config.hintPenalty);

  // Apply multi-attempt penalty (more attempts = faster decay)
  const extraAttempts = Math.max(0, attemptsToSolve - 1);
  rate *= 1 + (extraAttempts * config.multiAttemptPenalty);

  return Math.min(rate, 0.5); // Cap at 50% decay per interval
}

/**
 * Calculate current mastery score with decay applied
 */
export function calculateCurrentMastery(
  mastery: ProblemMastery,
  now: number = Date.now()
): number {
  if (!mastery.lastReviewedAt) return 0;

  const daysSinceReview = (now - mastery.lastReviewedAt) / (1000 * 60 * 60 * 24);
  const intervalsElapsed = daysSinceReview / mastery.interval;

  // Exponential decay: mastery * e^(-decay_rate * intervals)
  const decayedMastery = mastery.currentMasteryScore * Math.exp(-mastery.decayRate * intervalsElapsed);

  return Math.max(0, Math.min(100, decayedMastery));
}

/**
 * Calculate initial mastery score based on solve performance
 */
export function calculateInitialMastery(
  success: boolean,
  hintsUsed: number,
  attemptNumber: number,
  difficulty: 'easy' | 'medium' | 'hard'
): number {
  if (!success) return 0;

  let mastery = 100;

  // Deduct for hints used (up to 30 points)
  mastery -= Math.min(30, hintsUsed * 10);

  // Deduct for multiple attempts (up to 30 points)
  const extraAttempts = Math.max(0, attemptNumber - 1);
  mastery -= Math.min(30, extraAttempts * 10);

  // Bonus/penalty for difficulty (easy = no bonus, hard = +10)
  if (difficulty === 'hard') mastery = Math.min(100, mastery + 10);
  if (difficulty === 'easy') mastery = Math.max(0, mastery - 5);

  return Math.max(40, mastery); // Minimum 40 for any successful solve
}

/**
 * Calculate new SM-2 parameters after a review
 */
export function updateSpacedRepetition(
  mastery: ProblemMastery,
  quality: number, // 0-5 rating (0-2 = fail, 3 = hard, 4 = good, 5 = easy)
  config: DecayEngineConfig = DEFAULT_CONFIG
): Partial<ProblemMastery> {
  let { easeFactor, interval, repetitions } = mastery;

  if (quality < 3) {
    // Failed review - reset
    repetitions = 0;
    interval = config.initialInterval;
  } else {
    // Successful review
    repetitions++;

    if (repetitions === 1) {
      interval = config.initialInterval;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }

    // Update ease factor
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    easeFactor = Math.max(1.3, Math.min(2.5, easeFactor));
  }

  interval = Math.min(interval, config.maxInterval);

  const now = Date.now();
  const nextReviewAt = now + (interval * 24 * 60 * 60 * 1000);

  return {
    easeFactor,
    interval,
    repetitions,
    lastReviewedAt: now,
    nextReviewAt,
  };
}

/**
 * Convert solve performance to SM-2 quality rating (0-5)
 */
export function performanceToQuality(
  success: boolean,
  hintsUsed: number,
  attemptNumber: number
): number {
  if (!success) return 1; // Complete failure

  // Start at 5 (perfect)
  let quality = 5;

  // Deduct for hints
  quality -= Math.min(2, hintsUsed * 0.5);

  // Deduct for multiple attempts
  quality -= Math.min(2, (attemptNumber - 1) * 0.5);

  return Math.max(0, Math.min(5, Math.round(quality)));
}

/**
 * Priority score for problem selection
 * Higher = more urgent to review
 */
export function calculateReviewPriority(
  mastery: ProblemMastery,
  difficulty: 'easy' | 'medium' | 'hard',
  now: number = Date.now(),
  config: DecayEngineConfig = DEFAULT_CONFIG
): number {
  const currentMastery = calculateCurrentMastery(mastery, now);
  const daysPastDue = Math.max(0, (now - mastery.nextReviewAt) / (1000 * 60 * 60 * 24));

  let priority = 0;

  // Base priority from mastery decay (lower mastery = higher priority)
  priority += (100 - currentMastery) * 0.5;

  // Urgency from being past due
  priority += Math.min(50, daysPastDue * 5);

  // Difficulty weighting (harder problems get slight priority)
  if (difficulty === 'hard') priority += 10;
  if (difficulty === 'medium') priority += 5;

  // Critical threshold boost
  if (currentMastery < config.criticalThreshold) {
    priority += 20;
  }

  return Math.max(0, Math.min(100, priority));
}

/**
 * Get review status for a problem
 */
export type ReviewStatus = 'mastered' | 'fresh' | 'due' | 'overdue' | 'critical';

export function getReviewStatus(
  mastery: ProblemMastery,
  now: number = Date.now(),
  config: DecayEngineConfig = DEFAULT_CONFIG
): ReviewStatus {
  const currentMastery = calculateCurrentMastery(mastery, now);
  const daysPastDue = (now - mastery.nextReviewAt) / (1000 * 60 * 60 * 24);

  if (currentMastery < config.criticalThreshold) {
    return 'critical';
  }

  if (daysPastDue > 7) {
    return 'overdue';
  }

  if (daysPastDue > 0) {
    return 'due';
  }

  if (currentMastery >= 90 && mastery.repetitions >= 3) {
    return 'mastered';
  }

  return 'fresh';
}

/**
 * Create initial mastery record for a newly solved problem
 */
export function createInitialMastery(
  problemId: string,
  difficulty: 'easy' | 'medium' | 'hard',
  hintsUsed: number,
  attemptNumber: number,
  timeSpentMs: number,
  config: DecayEngineConfig = DEFAULT_CONFIG
): ProblemMastery {
  const now = Date.now();
  const initialScore = calculateInitialMastery(true, hintsUsed, attemptNumber, difficulty);
  const decayRate = calculateDecayRate(difficulty, hintsUsed, attemptNumber, config);

  const attempt: ProblemAttempt = {
    timestamp: now,
    success: true,
    hintsUsed,
    attemptNumber,
    timeSpentMs,
    wasReview: false,
  };

  return {
    problemId,
    easeFactor: 2.5,
    interval: config.initialInterval,
    repetitions: 1,
    firstSolvedAt: now,
    lastReviewedAt: now,
    nextReviewAt: now + (config.initialInterval * 24 * 60 * 60 * 1000),
    totalAttempts: attemptNumber,
    successfulAttempts: 1,
    averageHintsUsed: hintsUsed,
    averageTimeMs: timeSpentMs,
    currentMasteryScore: initialScore,
    decayRate,
    attempts: [attempt],
  };
}

/**
 * Update mastery after a review attempt
 */
export function updateMasteryAfterReview(
  mastery: ProblemMastery,
  success: boolean,
  hintsUsed: number,
  attemptNumber: number,
  timeSpentMs: number,
  difficulty: 'easy' | 'medium' | 'hard',
  config: DecayEngineConfig = DEFAULT_CONFIG
): ProblemMastery {
  const now = Date.now();
  const quality = performanceToQuality(success, hintsUsed, attemptNumber);

  // Create attempt record
  const attempt: ProblemAttempt = {
    timestamp: now,
    success,
    hintsUsed,
    attemptNumber,
    timeSpentMs,
    wasReview: true,
  };

  // Calculate new mastery score
  let newMasteryScore = mastery.currentMasteryScore;
  if (success) {
    // Boost mastery on successful review
    const boost = 20 - (hintsUsed * 5) - ((attemptNumber - 1) * 5);
    newMasteryScore = Math.min(100, newMasteryScore + Math.max(5, boost));
  } else {
    // Decrease mastery on failure
    newMasteryScore = Math.max(0, newMasteryScore - 20);
  }

  // Get SM-2 updates
  const spacedRepUpdates = updateSpacedRepetition(mastery, quality, config);

  // Update decay rate based on overall performance
  const totalAttempts = mastery.totalAttempts + attemptNumber;
  const successfulAttempts = mastery.successfulAttempts + (success ? 1 : 0);
  const successRate = successfulAttempts / Math.max(1, totalAttempts);

  // Better success rate = slower decay
  const decayModifier = 1.5 - successRate; // 0.5 to 1.5
  const newDecayRate = calculateDecayRate(difficulty, mastery.averageHintsUsed, 1, config) * decayModifier;

  // Update averages
  const allAttempts = [...mastery.attempts, attempt];
  const avgHints = allAttempts.reduce((sum, a) => sum + a.hintsUsed, 0) / allAttempts.length;
  const avgTime = allAttempts.reduce((sum, a) => sum + a.timeSpentMs, 0) / allAttempts.length;

  return {
    ...mastery,
    ...spacedRepUpdates,
    totalAttempts,
    successfulAttempts,
    averageHintsUsed: avgHints,
    averageTimeMs: avgTime,
    currentMasteryScore: newMasteryScore,
    decayRate: newDecayRate,
    attempts: allAttempts.slice(-20), // Keep last 20 attempts
  };
}

/**
 * Get problems that need review, sorted by priority
 */
export function getProblemsForReview(
  masteryRecords: ProblemMastery[],
  problemDifficulties: Record<string, 'easy' | 'medium' | 'hard'>,
  limit: number = 10,
  config: DecayEngineConfig = DEFAULT_CONFIG
): Array<{ problemId: string; priority: number; status: ReviewStatus; currentMastery: number }> {
  const now = Date.now();

  const scored = masteryRecords
    .map(mastery => ({
      problemId: mastery.problemId,
      priority: calculateReviewPriority(
        mastery,
        problemDifficulties[mastery.problemId] || 'medium',
        now,
        config
      ),
      status: getReviewStatus(mastery, now, config),
      currentMastery: calculateCurrentMastery(mastery, now),
    }))
    .filter(item => item.status !== 'fresh' || item.currentMastery < config.masteryThreshold)
    .sort((a, b) => b.priority - a.priority);

  return scored.slice(0, limit);
}

/**
 * Get mastery statistics for UI display
 */
export interface MasteryStats {
  totalProblems: number;
  masteredCount: number;
  freshCount: number;
  dueCount: number;
  overdueCount: number;
  criticalCount: number;
  averageMastery: number;
  streakDays: number;
}

export function calculateMasteryStats(
  masteryRecords: ProblemMastery[],
  config: DecayEngineConfig = DEFAULT_CONFIG
): MasteryStats {
  const now = Date.now();

  let masteredCount = 0;
  let freshCount = 0;
  let dueCount = 0;
  let overdueCount = 0;
  let criticalCount = 0;
  let totalMastery = 0;

  for (const mastery of masteryRecords) {
    const status = getReviewStatus(mastery, now, config);
    const currentMastery = calculateCurrentMastery(mastery, now);

    totalMastery += currentMastery;

    switch (status) {
      case 'mastered': masteredCount++; break;
      case 'fresh': freshCount++; break;
      case 'due': dueCount++; break;
      case 'overdue': overdueCount++; break;
      case 'critical': criticalCount++; break;
    }
  }

  // Calculate streak (days with activity)
  const uniqueDays = new Set(
    masteryRecords
      .flatMap(m => m.attempts)
      .map(a => new Date(a.timestamp).toDateString())
  );

  return {
    totalProblems: masteryRecords.length,
    masteredCount,
    freshCount,
    dueCount,
    overdueCount,
    criticalCount,
    averageMastery: masteryRecords.length > 0 ? totalMastery / masteryRecords.length : 0,
    streakDays: uniqueDays.size,
  };
}
