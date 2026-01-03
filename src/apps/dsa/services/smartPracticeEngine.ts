/**
 * Smart Practice Engine
 * Core algorithms for adaptive learning, weakness detection, and concept scoring
 */

import type {
  WeaknessProfile,
  WeaknessScore,
  SpacedRepetitionItem,
  PracticeProblemAttempt,
  ErrorPattern,
  StruggleMetric,
  ReviewSchedule,
  ProblemSelectionCriteria,
  SelectedProblemSet,
  AdaptiveProblem,
  UserProgress,
  InterviewReadiness,
  SkillRadar,
  ConceptScore,
  ConceptPriorityResult,
  PracticeAttempt,
} from '../types/smart-practice';

import {
  ConceptScoringEngine,
  initializeConcept,
  updateConceptScore,
  getPrioritizedConcepts,
  getMasteryLevel,
  getRecommendedDifficulty,
} from './conceptScoringEngine';

// ============= Weakness Detection Algorithm =============

/**
 * Calculate weakness score for a concept/pattern
 * Score: 0 (very weak) to 1 (strong)
 */
export function calculateWeaknessScore(
  attempts: number,
  successes: number,
  avgTimeSpent: number,
  hintsUsed: number,
  expectedTime: number = 15 * 60 * 1000 // 15 min default
): number {
  if (attempts === 0) return 0.5; // No data = neutral score

  // Base score from success rate
  const successRate = successes / attempts;
  let score = successRate;

  // Time penalty (if taking significantly longer than expected)
  const timeRatio = avgTimeSpent / expectedTime;
  if (timeRatio > 2) {
    score *= 0.8; // 20% penalty
  } else if (timeRatio > 1.5) {
    score *= 0.9; // 10% penalty
  }

  // Hint penalty (5% per hint on average)
  const hintsPerAttempt = hintsUsed / attempts;
  score *= Math.max(0.5, 1 - (hintsPerAttempt * 0.05));

  // Consistency bonus (if last 3 attempts successful)
  // This is simplified - in real implementation, track recent attempts
  if (successes >= 3 && successRate > 0.8) {
    score = Math.min(1, score * 1.1); // 10% bonus
  }

  // Ensure score is between 0 and 1
  return Math.max(0, Math.min(1, score));
}

/**
 * Update weakness profile based on a problem attempt
 */
export function updateWeaknessProfile(
  profile: WeaknessProfile,
  attempt: PracticeProblemAttempt
): WeaknessProfile {
  const updatedProfile = { ...profile };

  // Update pattern scores
  attempt.patterns.forEach(pattern => {
    const current = profile.patterns.get(pattern) || createDefaultWeaknessScore();
    const updated = updateWeaknessScoreFromAttempt(current, attempt);
    updatedProfile.patterns.set(pattern, updated);
  });

  // Update concept scores
  attempt.concepts.forEach(concept => {
    const current = profile.concepts.get(concept) || createDefaultWeaknessScore();
    const updated = updateWeaknessScoreFromAttempt(current, attempt);
    updatedProfile.concepts.set(concept, updated);
  });

  // Track error patterns
  attempt.mistakes.forEach(mistake => {
    const errorType = categorizeError(mistake);
    const current = profile.errorTypes.get(errorType) || createDefaultErrorPattern(errorType);
    current.frequency++;
    current.lastOccurred = new Date();
    current.examples.push(attempt.problemId);
    updatedProfile.errorTypes.set(errorType, current);
  });

  // Update struggle metrics
  const timeSpent = attempt.endTime
    ? attempt.endTime.getTime() - attempt.startTime.getTime()
    : 0;

  attempt.patterns.forEach(pattern => {
    const current = profile.struggleMetrics.get(pattern) || createDefaultStruggleMetric(pattern);
    current.averageSolveTime =
      (current.averageSolveTime * current.hintsUsed + timeSpent) /
      (current.hintsUsed + 1);
    current.hintsUsed += attempt.hintsUsed;
    updatedProfile.struggleMetrics.set(pattern, current);
  });

  updatedProfile.lastUpdated = new Date();
  return updatedProfile;
}

function createDefaultWeaknessScore(): WeaknessScore {
  return {
    score: 0.5,
    attempts: 0,
    successes: 0,
    averageTime: 0,
    lastSeen: new Date(),
    trend: 'stable',
    confidence: 0.5,
  };
}

function updateWeaknessScoreFromAttempt(
  current: WeaknessScore,
  attempt: PracticeProblemAttempt
): WeaknessScore {
  const timeSpent = attempt.endTime
    ? attempt.endTime.getTime() - attempt.startTime.getTime()
    : 0;

  const newAttempts = current.attempts + 1;
  const newSuccesses = current.successes + (attempt.allTestsPassed ? 1 : 0);
  const newAvgTime = (current.averageTime * current.attempts + timeSpent) / newAttempts;

  const newScore = calculateWeaknessScore(
    newAttempts,
    newSuccesses,
    newAvgTime,
    attempt.hintsUsed
  );

  // Calculate trend
  const scoreDelta = newScore - current.score;
  const trend = scoreDelta > 0.05 ? 'improving' :
                scoreDelta < -0.05 ? 'declining' : 'stable';

  // Calculate confidence (based on number of attempts and consistency)
  const confidence = Math.min(1, newAttempts / 10) *
                     (newSuccesses / newAttempts > 0.7 ? 1 : 0.8);

  return {
    score: newScore,
    attempts: newAttempts,
    successes: newSuccesses,
    averageTime: newAvgTime,
    lastSeen: new Date(),
    trend,
    confidence,
  };
}

function createDefaultErrorPattern(type: string): ErrorPattern {
  return {
    type,
    frequency: 0,
    lastOccurred: new Date(),
    examples: [],
    fixed: false,
  };
}

function createDefaultStruggleMetric(patternId: string): StruggleMetric {
  return {
    patternId,
    averageSolveTime: 0,
    hintsUsed: 0,
    abandonRate: 0,
    debugTime: 0,
  };
}

/**
 * Categorize error into common patterns
 */
function categorizeError(mistake: string): string {
  const lowerMistake = mistake.toLowerCase();

  if (lowerMistake.includes('index') || lowerMistake.includes('bounds')) {
    return 'off-by-one';
  } else if (lowerMistake.includes('null') || lowerMistake.includes('undefined')) {
    return 'null-check';
  } else if (lowerMistake.includes('edge') || lowerMistake.includes('boundary')) {
    return 'boundary-condition';
  } else if (lowerMistake.includes('time limit') || lowerMistake.includes('timeout')) {
    return 'time-complexity';
  } else if (lowerMistake.includes('memory') || lowerMistake.includes('space')) {
    return 'space-complexity';
  } else {
    return 'logic-error';
  }
}

// ============= Spaced Repetition Algorithm (SM-2) =============

/**
 * Calculate next review date using SuperMemo SM-2 algorithm
 */
export function calculateNextReview(
  quality: number, // 0-5 (0=complete blackout, 5=perfect recall)
  item: SpacedRepetitionItem
): SpacedRepetitionItem {
  const updated = { ...item };

  // Quality < 3 means incorrect response - reset interval
  if (quality < 3) {
    updated.repetitions = 0;
    updated.interval = 1;
  } else {
    // Correct response - calculate next interval
    if (updated.repetitions === 0) {
      updated.interval = 1;
    } else if (updated.repetitions === 1) {
      updated.interval = 6;
    } else {
      updated.interval = Math.round(updated.interval * updated.easeFactor);
    }
    updated.repetitions++;
  }

  // Update ease factor (how easy the item is for the user)
  // EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
  updated.easeFactor = Math.max(
    1.3,
    updated.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + updated.interval);
  updated.nextReview = nextReviewDate;
  updated.lastReview = new Date();
  updated.quality = quality;

  // Determine stage
  if (updated.interval < 7) {
    updated.stage = 'learning';
  } else if (updated.interval < 30) {
    updated.stage = 'young';
  } else {
    updated.stage = 'mature';
  }

  return updated;
}

/**
 * Get review schedule for a user
 */
export function getReviewSchedule(
  userId: string,
  items: SpacedRepetitionItem[]
): ReviewSchedule {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayReviews = items.filter(item => {
    const reviewDate = new Date(item.nextReview);
    reviewDate.setHours(0, 0, 0, 0);
    return reviewDate.getTime() === today.getTime();
  });

  const overdueReviews = items.filter(item => {
    const reviewDate = new Date(item.nextReview);
    return reviewDate < today;
  });

  // Group upcoming reviews by date
  const upcomingReviews = new Map<Date, SpacedRepetitionItem[]>();
  items.forEach(item => {
    const reviewDate = new Date(item.nextReview);
    if (reviewDate > today) {
      reviewDate.setHours(0, 0, 0, 0);
      const existing = upcomingReviews.get(reviewDate) || [];
      existing.push(item);
      upcomingReviews.set(reviewDate, existing);
    }
  });

  return {
    userId,
    todayReviews,
    overdueReviews,
    upcomingReviews,
    completedToday: 0, // This would come from database
    streak: 0, // This would come from database
  };
}

// ============= Smart Problem Selection (Concept Score Based) =============

/**
 * Select problems based on concept scores (decay-based system)
 * Higher concept scores = higher priority for practice
 */
export async function selectProblemsWithConceptScoring(
  criteria: ProblemSelectionCriteria,
  conceptScores: ConceptScore[],
  problemBank: AdaptiveProblem[]
): Promise<SelectedProblemSet> {
  const selectedProblems: SelectedProblemSet['problems'] = [];

  // Apply filters to problem bank if specified
  let filteredProblemBank = [...problemBank];

  if (criteria.filters) {
    const { filters } = criteria;

    // Filter by module IDs
    if (filters.moduleIds && filters.moduleIds.length > 0) {
      // Import problem family mappings to get module associations
      const { problemFamilyMappings } = await import('../data/problemFamilyMapping');
      const moduleProblems = new Set(
        problemFamilyMappings
          .filter(m => filters.moduleIds!.includes(m.moduleId))
          .map(m => m.problemId)
      );
      filteredProblemBank = filteredProblemBank.filter(p => moduleProblems.has(p.id));
    }

    // Filter by family IDs
    if (filters.familyIds && filters.familyIds.length > 0) {
      const { problemFamilyMappings } = await import('../data/problemFamilyMapping');
      const familyProblems = new Set(
        problemFamilyMappings
          .filter(m => filters.familyIds!.includes(m.familyId))
          .map(m => m.problemId)
      );
      filteredProblemBank = filteredProblemBank.filter(p => familyProblems.has(p.id));
    }

    // Filter by concept names (for specific algorithms like Dijkstra)
    if (filters.conceptNames && filters.conceptNames.length > 0) {
      filteredProblemBank = filteredProblemBank.filter(p =>
        filters.conceptNames!.some(concept =>
          p.concepts.some(c => c.toLowerCase().includes(concept.toLowerCase())) ||
          p.patterns.some(pattern => pattern.toLowerCase().includes(concept.toLowerCase()))
        )
      );
    }

    // Filter by window items (for Module 15)
    if (filters.windowItemIds && filters.windowItemIds.length > 0) {
      const windowProblemIds = new Set(filters.windowItemIds);
      filteredProblemBank = filteredProblemBank.filter(p => windowProblemIds.has(p.id));
    }

    // Exclude solved problems if requested
    if (filters.excludeSolved) {
      // This would need to check against user's solved problems
      // For now, we'll assume unsolved if not in a solved list
    }

    // Exclude specific problem IDs
    if (filters.excludeProblemIds && filters.excludeProblemIds.length > 0) {
      const excludeSet = new Set(filters.excludeProblemIds);
      filteredProblemBank = filteredProblemBank.filter(p => !excludeSet.has(p.id));
    }
  }

  // Get prioritized concepts
  const prioritizedConcepts = getPrioritizedConcepts(conceptScores);

  // Calculate problem count based on time
  const timePerProblem = 15; // Average 15 minutes per problem
  const totalProblems = Math.floor(criteria.timeAvailable / timePerProblem);

  // Focus on highest priority concepts
  const topConcepts = prioritizedConcepts
    .filter(c => c.priority > 30) // Only concepts needing practice
    .slice(0, Math.max(5, totalProblems)); // Get top N concepts

  // For each high-priority concept, find suitable problems
  for (const conceptPriority of topConcepts) {
    if (selectedProblems.length >= totalProblems) break;

    // Find problems for this concept from the filtered bank
    const conceptProblems = filteredProblemBank.filter(problem =>
      problem.concepts.includes(conceptPriority.conceptId) ||
      problem.patterns.includes(conceptPriority.conceptId)
    );

    if (conceptProblems.length === 0) continue;

    // Get the concept score to determine difficulty
    const conceptScore = conceptScores.find(c => c.conceptId === conceptPriority.conceptId);
    if (!conceptScore) continue;

    // Get recommended difficulty
    const difficulty = getRecommendedDifficulty(conceptScore);

    // Filter by difficulty
    const suitableProblems = conceptProblems.filter(p => {
      if (criteria.difficulty === 'adaptive') {
        return p.difficulty.base === difficulty;
      }
      return p.difficulty.base === criteria.difficulty;
    });

    // Select a problem (prefer not recently attempted)
    const selectedProblem = suitableProblems[0] || conceptProblems[0];

    selectedProblems.push({
      problem: selectedProblem,
      reason: conceptPriority.weaknessScore > 70 ? 'weakness' :
              conceptPriority.urgencyScore > 70 ? 'review' : 'challenge',
      targetWeakness: conceptPriority.weaknessScore > 70 ? conceptPriority.conceptId : undefined,
      reviewConcept: conceptPriority.urgencyScore > 70 ? conceptPriority.conceptId : undefined,
      estimatedTime: selectedProblem.averageSolveTime || timePerProblem,
    });
  }

  // Add variety if we have remaining slots
  while (selectedProblems.length < totalProblems) {
    const varietyProblem = selectVarietyProblem(
      filteredProblemBank,
      selectedProblems.map(p => p.problem.id),
      conceptScores
    );

    if (!varietyProblem) break;

    selectedProblems.push({
      problem: varietyProblem,
      reason: 'challenge',
      estimatedTime: varietyProblem.averageSolveTime || timePerProblem,
    });
  }

  // Calculate session metrics
  const totalEstimatedTime = selectedProblems.reduce(
    (sum, p) => sum + p.estimatedTime,
    0
  );

  const weaknessesCovered = [...new Set(
    selectedProblems
      .filter(p => p.targetWeakness)
      .map(p => p.targetWeakness!)
  )];

  const conceptsReviewed = [...new Set(
    selectedProblems
      .filter(p => p.reviewConcept)
      .map(p => p.reviewConcept!)
  )];

  return {
    problems: selectedProblems,
    totalEstimatedTime,
    weaknessesCovered,
    conceptsReviewed,
    sessionGoals: generateSessionGoals(prioritizedConcepts, selectedProblems),
    successCriteria: generateSuccessCriteria(selectedProblems.length),
  };
}

/**
 * Select a variety problem for balanced practice
 */
function selectVarietyProblem(
  problemBank: AdaptiveProblem[],
  excludeIds: string[],
  conceptScores: ConceptScore[]
): AdaptiveProblem | null {
  // Find concepts with medium priority (40-70) for variety
  const mediumPriorityConcepts = conceptScores
    .filter(c => c.combinedPriority >= 40 && c.combinedPriority <= 70)
    .map(c => c.conceptId);

  const availableProblems = problemBank.filter(p =>
    !excludeIds.includes(p.id) &&
    p.concepts.some(c => mediumPriorityConcepts.includes(c))
  );

  if (availableProblems.length === 0) return null;

  // Return a random problem for variety
  return availableProblems[Math.floor(Math.random() * availableProblems.length)];
}

/**
 * Generate session goals based on selected problems
 */
function generateSessionGoals(
  priorities: ConceptPriorityResult[],
  selected: SelectedProblemSet['problems']
): string[] {
  const goals: string[] = [];

  // Add top priority concepts
  const topPriorities = priorities.slice(0, 3);
  topPriorities.forEach(p => {
    if (p.weaknessScore > 70) {
      goals.push(`Improve ${p.conceptName} (currently weak)`);
    } else if (p.urgencyScore > 80) {
      goals.push(`Reinforce ${p.conceptName} (recently learned)`);
    }
  });

  // Add general goals
  if (selected.length > 5) {
    goals.push(`Complete ${selected.length} practice problems`);
  }

  return goals;
}

/**
 * Generate success criteria for the session
 */
function generateSuccessCriteria(problemCount: number): string {
  const targetSuccess = Math.ceil(problemCount * 0.7);
  return `Solve at least ${targetSuccess} out of ${problemCount} problems correctly`;
}

// ============= Legacy Smart Problem Selection (for backward compatibility) =============

/**
 * Select problems based on user's weaknesses and review schedule
 * @deprecated Use selectProblemsWithConceptScoring instead
 */
export async function selectProblems(
  criteria: ProblemSelectionCriteria,
  weaknessProfile: WeaknessProfile,
  reviewSchedule: ReviewSchedule,
  problemBank: AdaptiveProblem[]
): Promise<SelectedProblemSet> {
  const selectedProblems: SelectedProblemSet['problems'] = [];

  // Get weak areas (score < 0.5)
  const weakConcepts = Array.from(weaknessProfile.concepts.entries())
    .filter(([_, score]) => score.score < 0.5)
    .sort((a, b) => a[1].score - b[1].score)
    .map(([concept]) => concept);

  const weakPatterns = Array.from(weaknessProfile.patterns.entries())
    .filter(([_, score]) => score.score < 0.5)
    .sort((a, b) => a[1].score - b[1].score)
    .map(([pattern]) => pattern);

  // Get due reviews
  const dueReviews = [
    ...reviewSchedule.todayReviews,
    ...reviewSchedule.overdueReviews,
  ];

  // Calculate problem count based on weights
  const timePerProblem = 15; // Average 15 minutes per problem
  const totalProblems = Math.floor(criteria.timeAvailable / timePerProblem);

  const weaknessCount = Math.floor(totalProblems * criteria.weaknessWeight);
  const reviewCount = Math.floor(totalProblems * criteria.reviewWeight);
  const challengeCount = Math.max(1, totalProblems - weaknessCount - reviewCount);

  // Select weakness-targeting problems
  if (weakConcepts.length > 0 || weakPatterns.length > 0) {
    const weaknessProblems = selectWeaknessProblems(
      problemBank,
      weakConcepts,
      weakPatterns,
      weaknessCount,
      criteria.difficulty
    );

    weaknessProblems.forEach(problem => {
      selectedProblems.push({
        problem,
        reason: 'weakness',
        targetWeakness: problem.targetWeaknesses[0],
        estimatedTime: problem.averageSolveTime || timePerProblem,
      });
    });
  }

  // Select review problems
  if (dueReviews.length > 0) {
    const reviewProblems = selectReviewProblems(
      problemBank,
      dueReviews.map(r => r.conceptId),
      reviewCount
    );

    reviewProblems.forEach(problem => {
      selectedProblems.push({
        problem,
        reason: 'review',
        reviewConcept: problem.concepts[0],
        estimatedTime: problem.averageSolveTime || timePerProblem,
      });
    });
  }

  // Add challenge problems for variety
  const challengeProblems = selectChallengeProblems(
    problemBank,
    challengeCount,
    selectedProblems.map(p => p.problem.id)
  );

  challengeProblems.forEach(problem => {
    selectedProblems.push({
      problem,
      reason: 'challenge',
      estimatedTime: problem.averageSolveTime || timePerProblem,
    });
  });

  // Calculate total time and coverage
  const totalEstimatedTime = selectedProblems.reduce(
    (sum, p) => sum + p.estimatedTime,
    0
  );

  const weaknessesCovered = [...new Set(
    selectedProblems
      .filter(p => p.reason === 'weakness')
      .map(p => p.targetWeakness!)
  )];

  const conceptsReviewed = [...new Set(
    selectedProblems
      .filter(p => p.reason === 'review')
      .map(p => p.reviewConcept!)
  )];

  // Generate session goals
  const sessionGoals: string[] = [];
  if (weaknessesCovered.length > 0) {
    sessionGoals.push(`Improve ${weaknessesCovered[0]} skills`);
  }
  if (conceptsReviewed.length > 0) {
    sessionGoals.push(`Review ${conceptsReviewed[0]}`);
  }
  if (challengeProblems.length > 0) {
    sessionGoals.push('Tackle new challenges');
  }

  return {
    problems: selectedProblems,
    totalEstimatedTime,
    weaknessesCovered,
    conceptsReviewed,
    sessionGoals,
    successCriteria: `Complete ${Math.ceil(selectedProblems.length * 0.7)} problems successfully`,
  };
}

function selectWeaknessProblems(
  problemBank: AdaptiveProblem[],
  weakConcepts: string[],
  weakPatterns: string[],
  count: number,
  difficulty: string
): AdaptiveProblem[] {
  // Filter problems that target weaknesses
  const relevantProblems = problemBank.filter(problem => {
    const targetsWeakConcept = problem.concepts.some(c => weakConcepts.includes(c));
    const targetsWeakPattern = problem.patterns.some(p => weakPatterns.includes(p));
    const matchesDifficulty = difficulty === 'adaptive' ||
                              problem.difficulty.base === difficulty;

    return (targetsWeakConcept || targetsWeakPattern) && matchesDifficulty;
  });

  // Sort by how well they target the weakest areas
  relevantProblems.sort((a, b) => {
    const aScore = a.targetWeaknesses.filter(w =>
      weakConcepts.includes(w) || weakPatterns.includes(w)
    ).length;
    const bScore = b.targetWeaknesses.filter(w =>
      weakConcepts.includes(w) || weakPatterns.includes(w)
    ).length;
    return bScore - aScore;
  });

  return relevantProblems.slice(0, count);
}

function selectReviewProblems(
  problemBank: AdaptiveProblem[],
  reviewConcepts: string[],
  count: number
): AdaptiveProblem[] {
  const reviewProblems = problemBank.filter(problem =>
    problem.concepts.some(c => reviewConcepts.includes(c)) &&
    problem.reviewValue > 0.5
  );

  // Sort by review value
  reviewProblems.sort((a, b) => b.reviewValue - a.reviewValue);

  return reviewProblems.slice(0, count);
}

function selectChallengeProblems(
  problemBank: AdaptiveProblem[],
  count: number,
  excludeIds: string[]
): AdaptiveProblem[] {
  const challengeProblems = problemBank.filter(problem =>
    !excludeIds.includes(problem.id) &&
    problem.difficulty.base === 'hard'
  );

  // Randomly select for variety
  const shuffled = [...challengeProblems].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ============= Interview Readiness Calculator =============

/**
 * Calculate interview readiness based on user progress
 */
export function calculateInterviewReadiness(
  progress: UserProgress
): InterviewReadiness {
  // Calculate overall readiness
  const patternScores = Array.from(progress.patternMastery.values())
    .map(m => m.score);
  const conceptScores = Array.from(progress.conceptMastery.values())
    .map(m => m.score);

  const allScores = [...patternScores, ...conceptScores];
  const overall = allScores.length > 0
    ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length
    : 0;

  // Calculate readiness by difficulty
  const byDifficulty = {
    easy: calculateDifficultyReadiness(progress, 'easy'),
    medium: calculateDifficultyReadiness(progress, 'medium'),
    hard: calculateDifficultyReadiness(progress, 'hard'),
  };

  // Find weakest and strongest areas
  const topicScores = new Map<string, number>();
  progress.patternMastery.forEach((mastery, pattern) => {
    topicScores.set(pattern, mastery.score);
  });

  const sortedTopics = Array.from(topicScores.entries())
    .sort((a, b) => b[1] - a[1]);

  const strongestAreas = sortedTopics.slice(0, 3).map(([topic]) => topic);
  const weakestAreas = sortedTopics.slice(-3).map(([topic]) => topic);

  // Calculate recommended focus
  const recommendedFocus = weakestAreas.filter(area => {
    const score = topicScores.get(area) || 0;
    return score < 70;
  });

  // Estimate study hours needed
  const targetReadiness = 85;
  const currentReadiness = overall;
  const gap = Math.max(0, targetReadiness - currentReadiness);
  const estimatedStudyHours = Math.ceil(gap * 2); // ~2 hours per percentage point

  // Predict readiness date
  const hoursPerDay = 2; // Assuming 2 hours study per day
  const daysNeeded = Math.ceil(estimatedStudyHours / hoursPerDay);
  const readinessDate = new Date();
  readinessDate.setDate(readinessDate.getDate() + daysNeeded);

  return {
    overall,
    byDifficulty,
    byTopic: topicScores,
    weakestAreas,
    strongestAreas,
    recommendedFocus,
    estimatedStudyHours,
    readinessDate,
  };
}

function calculateDifficultyReadiness(
  progress: UserProgress,
  difficulty: 'easy' | 'medium' | 'hard'
): number {
  // This would analyze success rates for problems of each difficulty
  // Simplified implementation here
  const difficultyMultiplier = {
    easy: 1.2,
    medium: 1.0,
    hard: 0.8,
  };

  const baseScore = progress.efficiencyMetrics.firstAttemptSuccess * 100;
  return Math.min(100, baseScore * difficultyMultiplier[difficulty]);
}

// ============= Skill Radar Generator =============

/**
 * Generate skill radar chart data from practice attempts
 */
export function generateSkillRadar(
  attempts: PracticeProblemAttempt[]
): SkillRadar {
  const skills = {
    arrays: 0,
    strings: 0,
    twoPointers: 0,
    slidingWindow: 0,
    hashMaps: 0,
    linkedLists: 0,
    trees: 0,
    graphs: 0,
    dynamicProgramming: 0,
    heaps: 0,
    backtracking: 0,
    timeComplexity: 0,
    spaceOptimization: 0,
    debugging: 0,
    problemSolving: 0,
  };

  const counts: Record<string, number> = {};

  // Calculate success rate for each skill
  attempts.forEach(attempt => {
    const score = attempt.allTestsPassed ? 100 : (attempt.score || 0);

    attempt.concepts.forEach(concept => {
      const key = normalizeConceptToSkill(concept);
      if (key in skills) {
        skills[key as keyof SkillRadar] += score;
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    attempt.patterns.forEach(pattern => {
      const key = normalizePatternToSkill(pattern);
      if (key in skills) {
        skills[key as keyof SkillRadar] += score;
        counts[key] = (counts[key] || 0) + 1;
      }
    });
  });

  // Average the scores
  Object.keys(skills).forEach(skill => {
    if (counts[skill]) {
      (skills as any)[skill] = Math.round((skills as any)[skill] / counts[skill]);
    }
  });

  return skills as SkillRadar;
}

function normalizeConceptToSkill(concept: string): string {
  const conceptMap: Record<string, string> = {
    'array': 'arrays',
    'string': 'strings',
    'two-pointer': 'twoPointers',
    'sliding-window': 'slidingWindow',
    'hash-map': 'hashMaps',
    'linked-list': 'linkedLists',
    'tree': 'trees',
    'graph': 'graphs',
    'dynamic-programming': 'dynamicProgramming',
    'heap': 'heaps',
    'backtracking': 'backtracking',
    'time-complexity': 'timeComplexity',
    'space-optimization': 'spaceOptimization',
  };

  return conceptMap[concept.toLowerCase()] || concept;
}

function normalizePatternToSkill(pattern: string): string {
  // Similar mapping for patterns
  return normalizeConceptToSkill(pattern);
}

// ============= Export Main API =============

export const SmartPracticeEngine = {
  // Concept Scoring (Decay-Based System)
  initializeConcept,
  updateConceptScore,
  getPrioritizedConcepts,
  getMasteryLevel,
  getRecommendedDifficulty,

  // Weakness Detection
  calculateWeaknessScore,
  updateWeaknessProfile,

  // Problem Selection
  selectProblemsWithConceptScoring, // New concept-based selection
  selectProblems, // Legacy (deprecated)

  // Progress Analytics
  calculateInterviewReadiness,
  generateSkillRadar,

  // Legacy Spaced Repetition (deprecated)
  calculateNextReview,
  getReviewSchedule,
};
