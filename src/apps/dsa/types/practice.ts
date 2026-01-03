export interface ProblemAttempt {
  timestamp: number;
  successful: boolean;
  hintsUsed: number;
  timeSpentSeconds: number;
}

export interface ProblemProgress {
  problemId: string;
  attempts: ProblemAttempt[];
  totalAttempts: number;
  successfulAttempts: number;
  failedAttempts: number;
  totalHintsUsed: number;
  firstAttemptDate: number;
  lastAttemptDate: number;
  isSolved: boolean;
  bestTimeSeconds?: number;
  averageHintsPerAttempt: number;
  nextReviewDate?: number;
}

export interface WeaknessMetrics {
  problemId: string;
  weaknessScore: number;
  failureRate: number;
  avgHintsUsed: number;
  daysSinceLastPractice: number;
  needsReview: boolean;
}

export interface SpacedRepetitionConfig {
  easyInterval: number;
  mediumInterval: number;
  hardInterval: number;
  failedInterval: number;
}
