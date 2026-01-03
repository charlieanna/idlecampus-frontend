import { VariationAttempt } from '../types/concept-families';

export class StruggleAnalyzer {
  /**
   * Calculates a struggle score from 0-100 based on attempt performance.
   * Higher score = more struggle.
   * 
   * Criteria weighting:
   * - Failure (Wrong Answer/Error): 30 pts
   * - Multiple Attempts (>2): 25 pts
   * - Heavy Hint Usage (>1): 25 pts
   * - Time Limit Exceeded (>20m): 20 pts
   */
  public calculateStruggleScore(attempt: VariationAttempt): number {
    let score = 0;

    // 1. Did they fail the problem?
    if (!attempt.passed) {
      score += 30;
    }

    // 2. Did they spam the "Run/Submit" button?
    // We expect clean code on 1st or 2nd try for mastery.
    if (attempt.submissionAttempts > 2) {
      score += 25;
    }

    // 3. Did they rely heavily on hints?
    // 0-1 hint is acceptable. 2+ implies deeper gap.
    if (attempt.hintsUsed > 1) {
      score += 20;
    }

    if (attempt.hintInsights) {
      const unresolved = attempt.hintInsights.stuckCount;
      if (unresolved > 0) {
        score += Math.min(20, unresolved * 10);
      }

      const heavyHints = attempt.hintInsights.severities.filter(severity => severity === 'heavy').length;
      if (heavyHints > 0) {
        score += 10;
      }
    }

    // 4. Did they take too long?
    // 20 minutes is the "speed mastery" threshold.
    const TWENTY_MINUTES_MS = 20 * 60 * 1000;
    if (attempt.timeMs > TWENTY_MINUTES_MS) {
      score += 20;
    }

    return Math.min(score, 100);
  }

  /**
   * Determines if the struggle is significant enough to trigger prerequisite intervention.
   * Threshold: 50 points.
   */
  public shouldTriggerIntervention(struggleScore: number): boolean {
    return struggleScore >= 50;
  }

  /**
   * Returns a human-readable reason for the struggle score.
   * Useful for analytics or UI debugging.
   */
  public getStruggleReason(attempt: VariationAttempt): string[] {
    const reasons: string[] = [];
    const TWENTY_MINUTES_MS = 20 * 60 * 1000;

    if (!attempt.passed) reasons.push('Failed to solve');
    if (attempt.submissionAttempts > 2) reasons.push('Multiple submission attempts');
    if (attempt.hintsUsed > 1) reasons.push('Heavy hint usage');
    if (attempt.hintInsights?.stuckCount) reasons.push('Hints did not resolve confusion');
    if (attempt.hintInsights?.severities.some(severity => severity === 'heavy')) reasons.push('Required deep hints');
    if (attempt.timeMs > TWENTY_MINUTES_MS) reasons.push('Time limit exceeded');

    return reasons;
  }
}

export const struggleAnalyzer = new StruggleAnalyzer();
