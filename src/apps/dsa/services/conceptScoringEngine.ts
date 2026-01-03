/**
 * Concept Scoring Engine - Decay-Based Learning System
 *
 * Core principle: Each concept starts at 100% urgency (just learned) and
 * decays toward 0% (mastered) through practice. Combines urgency with
 * weakness detection for intelligent problem selection.
 */

import type { ConceptScore, PracticeAttempt, ConceptPriorityResult } from '../types/smart-practice';

export class ConceptScoringEngine {
  private static readonly URGENCY_WEIGHT = 0.4;
  private static readonly WEAKNESS_WEIGHT = 0.6;

  // Sequence-based decay
  private static readonly SEQUENCE_DECAY_FACTOR = 5;  // Each newer concept adds 5 urgency points

  // Practice-based decay
  private static readonly SUCCESS_URGENCY_DECAY_BASE = 10;  // Base reduction on success
  private static readonly FAIL_URGENCY_DECAY = 3;           // Smaller reduction on failure

  // Weakness adjustments
  private static readonly SUCCESS_WEAKNESS_IMPROVEMENT = 5;   // Base improvement
  private static readonly FAIL_WEAKNESS_PENALTY = 10;        // Base penalty
  private static readonly SPEED_BONUS = 2;                   // Extra improvement for fast solving
  private static readonly NO_HINT_BONUS = 3;                 // Extra improvement for no hints
  private static readonly MANY_HINTS_PENALTY = 5;           // Extra penalty for many hints

  /**
   * Initialize a new concept when first learned
   * @param learningSequence - The order in which this concept was learned (1, 2, 3, etc.)
   */
  static initializeConcept(
    conceptId: string,
    conceptName: string,
    learningSequence: number,
    moduleId?: string
  ): ConceptScore {
    const now = new Date();
    return {
      conceptId,
      conceptName,
      learningSequence,
      baseUrgency: 100,         // Base urgency starts at 100
      urgencyScore: 100,        // Will be recalculated with sequence decay
      weaknessScore: 50,        // Neutral starting point
      combinedPriority: this.calculateCombinedPriority(100, 50),
      practiceCount: 0,
      successCount: 0,
      failureCount: 0,
      lastPracticed: null,
      successRate: 0,
      averageSolveTime: 0,
      totalHintsUsed: 0,
      lastUpdateTime: now,
      moduleId,
      learnedAt: now
    };
  }

  /**
   * Update scores after a practice attempt
   * Updates baseUrgency (practice) and weakness (performance)
   * urgencyScore will be recalculated with sequence decay when needed
   */
  static updateScores(concept: ConceptScore, attempt: PracticeAttempt): ConceptScore {
    const updated = { ...concept };
    const now = new Date();

    // Update BASE urgency based on practice (this is the stored value)
    updated.baseUrgency = this.calculateUrgencyDecay(
      updated.baseUrgency,
      updated.practiceCount,
      attempt.success
    );

    // Update weakness based on performance
    updated.weaknessScore = this.calculateWeaknessScore(
      updated.weaknessScore,
      attempt
    );

    // Update statistics
    updated.practiceCount++;
    if (attempt.success) {
      updated.successCount++;
    } else {
      updated.failureCount++;
    }

    updated.successRate = updated.successCount / updated.practiceCount;

    // Update average solve time (rolling average)
    if (updated.practiceCount === 1) {
      updated.averageSolveTime = attempt.timeSpent;
    } else {
      updated.averageSolveTime =
        (updated.averageSolveTime * (updated.practiceCount - 1) + attempt.timeSpent) /
        updated.practiceCount;
    }

    updated.totalHintsUsed += attempt.hintsUsed;
    updated.lastPracticed = now;
    updated.lastUpdateTime = now;

    // Note: urgencyScore and combinedPriority will be recalculated
    // by getPrioritizedConcepts() considering total concepts learned

    return updated;
  }

  /**
   * Calculate urgency decay after practice
   */
  private static calculateUrgencyDecay(
    currentUrgency: number,
    practiceCount: number,
    success: boolean
  ): number {
    // Special case: first practice should have significant impact
    if (practiceCount === 0) {
      return success ?
        Math.max(0, currentUrgency - 15) :  // First success: bigger drop
        Math.max(0, currentUrgency - 5);     // First failure: smaller drop
    }

    // Base decay amount
    const baseDecay = success ?
      this.SUCCESS_URGENCY_DECAY_BASE :
      this.FAIL_URGENCY_DECAY;

    // Apply diminishing returns (harder to reduce as it gets lower)
    const decayFactor = Math.sqrt(currentUrgency / 100);
    const actualDecay = baseDecay * decayFactor;

    // Calculate new urgency
    let newUrgency = currentUrgency - actualDecay;

    // Ensure bounds
    return Math.max(0, Math.min(100, newUrgency));
  }

  /**
   * Calculate weakness score based on performance
   * Considers submission attempts as primary weakness indicator
   */
  private static calculateWeaknessScore(
    currentWeakness: number,
    attempt: PracticeAttempt
  ): number {
    let delta = 0;

    if (attempt.success) {
      // Base improvement
      delta = -this.SUCCESS_WEAKNESS_IMPROVEMENT;

      // MAJOR FACTOR: Submission attempts
      // 1 attempt = solved on first try (very strong!) → extra -10
      // 2-3 attempts = moderate → normal -5
      // 4+ attempts = struggled even though passed → only -2
      if (attempt.submissionAttempts === 1) {
        delta -= 10;  // First try success = strong understanding
      } else if (attempt.submissionAttempts === 2) {
        delta -= 5;   // Second try = moderate
      } else if (attempt.submissionAttempts === 3) {
        delta -= 2;   // Third try = weak even though passed
      } else {
        delta -= 0;   // 4+ tries = very weak, minimal improvement
      }

      // Bonus for solving quickly
      if (attempt.timeSpent < attempt.expectedTime * 0.8) {
        delta -= this.SPEED_BONUS;
      }

      // Bonus for not using hints
      if (attempt.hintsUsed === 0) {
        delta -= this.NO_HINT_BONUS;
      }

      // Adjust for problem difficulty
      if (attempt.problemDifficulty === 'hard') {
        delta -= 2;  // Extra improvement for hard problems
      }
    } else {
      // Base penalty for failure
      delta = this.FAIL_WEAKNESS_PENALTY;

      // Penalty based on how many attempts before giving up
      // More attempts = bigger struggle
      delta += Math.min(attempt.submissionAttempts * 3, 20);  // Cap at +20

      // Extra penalty for using many hints and still failing
      if (attempt.hintsUsed > 2) {
        delta += this.MANY_HINTS_PENALTY;
      }

      // Adjust for problem difficulty
      if (attempt.problemDifficulty === 'easy') {
        delta += 3;  // Extra penalty for failing easy problems
      }
    }

    // Apply the delta
    const newWeakness = currentWeakness + delta;

    // Ensure bounds
    return Math.max(0, Math.min(100, newWeakness));
  }


  /**
   * Calculate sequence-based urgency with weakness modulation
   * Weak concepts decay faster (forgotten more easily)
   * Strong concepts decay slower (remembered better)
   */
  static calculateSequenceUrgency(
    concept: ConceptScore,
    totalConceptsLearned: number
  ): number {
    // How many concepts were learned AFTER this one
    const conceptsAfter = totalConceptsLearned - concept.learningSequence;

    // Weakness multiplier: weak concepts forgotten faster
    // weakness=100 (struggling) → multiplier=2.0 (decay 2x faster)
    // weakness=50 (neutral) → multiplier=1.0 (normal decay)
    // weakness=25 (strong) → multiplier=0.5 (decay 0.5x slower)
    const weaknessMultiplier = concept.weaknessScore / 50;

    // Calculate sequence decay
    const sequenceDecay = conceptsAfter * this.SEQUENCE_DECAY_FACTOR * weaknessMultiplier;

    // Combine with base urgency (which is reduced by practice)
    return concept.baseUrgency + sequenceDecay;
  }

  /**
   * Calculate combined priority score for concept selection
   */
  static calculateCombinedPriority(urgency: number, weakness: number): number {
    return (urgency * this.URGENCY_WEIGHT) + (weakness * this.WEAKNESS_WEIGHT);
  }

  /**
   * Get prioritized list of concepts for practice
   * Uses sequence-based urgency with weakness modulation
   */
  static getPrioritizedConcepts(concepts: ConceptScore[]): ConceptPriorityResult[] {
    if (concepts.length === 0) return [];

    // Find total concepts learned (highest sequence number)
    const totalConceptsLearned = Math.max(...concepts.map(c => c.learningSequence));

    // Calculate current urgency for all concepts using sequence decay
    const withUpdatedUrgency = concepts.map(concept => {
      const currentUrgency = this.calculateSequenceUrgency(concept, totalConceptsLearned);
      const currentPriority = this.calculateCombinedPriority(currentUrgency, concept.weaknessScore);

      return {
        ...concept,
        urgencyScore: currentUrgency,
        combinedPriority: currentPriority
      };
    });

    // Sort by combined priority (highest first)
    const sorted = withUpdatedUrgency.sort((a, b) => {
      // If priorities are very close
      if (Math.abs(a.combinedPriority - b.combinedPriority) < 0.01) {
        // Tiebreaker 1: Less practiced first
        if (a.practiceCount !== b.practiceCount) {
          return a.practiceCount - b.practiceCount;
        }
        // Tiebreaker 2: Older concept first (lower sequence number)
        return a.learningSequence - b.learningSequence;
      }
      return b.combinedPriority - a.combinedPriority;
    });

    return sorted.map(concept => ({
      conceptId: concept.conceptId,
      conceptName: concept.conceptName,
      priority: concept.combinedPriority,
      urgencyScore: concept.urgencyScore,
      weaknessScore: concept.weaknessScore,
      reason: this.getPriorityReason(concept),
      color: this.getPriorityColor(concept.combinedPriority)
    }));
  }

  /**
   * Get human-readable reason for priority
   */
  private static getPriorityReason(concept: ConceptScore): string {
    // Never practiced
    if (concept.practiceCount === 0) {
      return '🆕 Never practiced - needs initial solidification';
    }

    // Recently learned and needs practice
    if (concept.urgencyScore > 80 && concept.practiceCount < 3) {
      return '📚 Recently learned - needs reinforcement';
    }

    // High weakness
    if (concept.weaknessScore > 70) {
      return '⚠️ Struggling with this concept - needs focus';
    }

    // Moderate weakness with some urgency
    if (concept.weaknessScore > 50 && concept.urgencyScore > 50) {
      return '📈 Room for improvement - practice recommended';
    }

    // Forgetting
    if (concept.urgencyScore > 60 && concept.practiceCount > 5) {
      return '🔄 Haven\'t practiced in a while - review needed';
    }

    // Low priority
    if (concept.combinedPriority < 30) {
      return '✅ Well understood - optional review';
    }

    return '📊 Regular practice maintains mastery';
  }

  /**
   * Get color coding for priority
   */
  private static getPriorityColor(priority: number): 'red' | 'yellow' | 'green' {
    if (priority >= 70) return 'red';     // High priority
    if (priority >= 40) return 'yellow';  // Medium priority
    return 'green';                       // Low priority
  }

  /**
   * Get mastery level for a concept
   */
  static getMasteryLevel(concept: ConceptScore): {
    level: string;
    emoji: string;
    percentage: number;
  } {
    // Invert the combined priority to get mastery (0% priority = 100% mastery)
    const masteryPercentage = 100 - concept.combinedPriority;

    if (masteryPercentage >= 80) {
      return { level: 'Mastered', emoji: '🏆', percentage: masteryPercentage };
    } else if (masteryPercentage >= 60) {
      return { level: 'Solid', emoji: '💪', percentage: masteryPercentage };
    } else if (masteryPercentage >= 40) {
      return { level: 'Improving', emoji: '📈', percentage: masteryPercentage };
    } else if (masteryPercentage >= 20) {
      return { level: 'Learning', emoji: '📚', percentage: masteryPercentage };
    } else {
      return { level: 'New', emoji: '🆕', percentage: masteryPercentage };
    }
  }

  /**
   * Check if a concept needs immediate attention
   */
  static needsImmediatePractice(concept: ConceptScore): boolean {
    // Never practiced
    if (concept.practiceCount === 0) return true;

    // Very high urgency or weakness
    if (concept.urgencyScore > 85 || concept.weaknessScore > 85) return true;

    // High combined priority
    if (concept.combinedPriority > 80) return true;

    // Recently failed multiple times
    if (concept.successRate < 0.3 && concept.practiceCount > 2) return true;

    return false;
  }

  /**
   * Get recommended difficulty for next problem based on weakness
   */
  static getRecommendedDifficulty(concept: ConceptScore): 'easy' | 'medium' | 'hard' {
    // High weakness: start with easier problems
    if (concept.weaknessScore > 70) {
      return 'easy';
    }

    // Low weakness and good success rate: challenge with harder problems
    if (concept.weaknessScore < 30 && concept.successRate > 0.7) {
      return 'hard';
    }

    // Default to medium
    return 'medium';
  }

  /**
   * Batch update multiple concepts after a session
   * NO TIME-BASED DECAY - only updates concepts that were practiced
   */
  static batchUpdateConcepts(
    concepts: ConceptScore[],
    sessionResults: Map<string, PracticeAttempt>
  ): ConceptScore[] {
    return concepts.map(concept => {
      const attempt = sessionResults.get(concept.conceptId);
      if (attempt) {
        // Only update if practiced
        return this.updateScores(concept, attempt);
      }
      // If not practiced, return unchanged
      return concept;
    });
  }
}

// Export helper functions for external use
export const initializeConcept = ConceptScoringEngine.initializeConcept.bind(ConceptScoringEngine);
export const updateConceptScore = ConceptScoringEngine.updateScores.bind(ConceptScoringEngine);
export const getPrioritizedConcepts = ConceptScoringEngine.getPrioritizedConcepts.bind(ConceptScoringEngine);
export const getMasteryLevel = ConceptScoringEngine.getMasteryLevel.bind(ConceptScoringEngine);
export const getRecommendedDifficulty = ConceptScoringEngine.getRecommendedDifficulty.bind(ConceptScoringEngine);
export const calculateSequenceUrgency = ConceptScoringEngine.calculateSequenceUrgency.bind(ConceptScoringEngine);