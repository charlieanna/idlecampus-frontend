/**
 * Problem Selector Service
 * Selects from ~280 unique problems for Smart Practice
 * Uses spaced repetition to prioritize weak concepts
 */

import { getAllPracticeExercises, type PracticeExercise } from '../utils/practiceExerciseRegistry';

export interface UserProblemHistory {
  // Map of pattern -> list of attempted problem IDs
  attemptedProblems: Map<string, string[]>;
  // Map of problemId -> performance (0-100)
  problemScores: Map<string, number>;
  // Map of problemId -> timestamp of last attempt
  lastAttempted: Map<string, number>;
}

export interface ProblemSelection {
  problem: PracticeExercise;
  isNew: boolean;
  previousScore?: number;
  daysSinceLastAttempt?: number;
}

// Cache problems grouped by pattern
const problemsByPattern = new Map<string, PracticeExercise[]>();
const practiceExercises = getAllPracticeExercises();

const getPatternId = (problem: PracticeExercise): string => {
  if (problem.conceptFamily && problem.conceptFamily.trim().length > 0) {
    return problem.conceptFamily;
  }
  return problem.moduleId;
};

function initializePatternCache() {
  if (problemsByPattern.size > 0) return;

  for (const problem of practiceExercises) {
    const pattern = getPatternId(problem);
    if (!problemsByPattern.has(pattern)) {
      problemsByPattern.set(pattern, []);
    }
    problemsByPattern.get(pattern)!.push(problem);
  }
}

/**
 * Get problems by pattern
 */
export function getProblemsByPattern(pattern: string): PracticeExercise[] {
  initializePatternCache();
  return problemsByPattern.get(pattern) || [];
}

/**
 * Select a problem for a pattern/concept
 * Prioritizes unseen problems, then based on time decay and past performance
 */
export function selectProblemForPattern(
  pattern: string,
  history: UserProblemHistory
): ProblemSelection {
  const patternProblems = getProblemsByPattern(pattern);

  if (patternProblems.length === 0) {
    throw new Error(`No problems found for pattern: ${pattern}`);
  }

  const attemptedIds = history.attemptedProblems.get(pattern) || [];
  const untriedProblems = patternProblems.filter(
    p => !attemptedIds.includes(p.id)
  );

  // If there are untried problems, pick one randomly
  if (untriedProblems.length > 0) {
    const selected = untriedProblems[Math.floor(Math.random() * untriedProblems.length)];
    return {
      problem: selected,
      isNew: true
    };
  }

  // All problems tried - select based on spaced repetition
  // Pick the one attempted longest ago with lowest score
  let bestProblem: PracticeExercise | null = null;
  let bestPriority = -Infinity;

  for (const problem of patternProblems) {
    const lastAttempt = history.lastAttempted.get(problem.id) || 0;
    const score = history.problemScores.get(problem.id) || 50;
    const daysSince = (Date.now() - lastAttempt) / (1000 * 60 * 60 * 24);

    // Priority: low score + long time since attempt
    const priority = (100 - score) + (daysSince * 10);

    if (priority > bestPriority) {
      bestPriority = priority;
      bestProblem = problem;
    }
  }

  const selected = bestProblem || patternProblems[0];
  const previousScore = history.problemScores.get(selected.id);
  const lastAttempt = history.lastAttempted.get(selected.id);
  const daysSince = lastAttempt ? (Date.now() - lastAttempt) / (1000 * 60 * 60 * 24) : undefined;

  return {
    problem: selected,
    isNew: false,
    previousScore,
    daysSinceLastAttempt: daysSince
  };
}

/**
 * Select multiple problems for a practice session
 * Balances variety and weak concept reinforcement
 */
export function selectPracticeSession(
  targetPatterns: string[],
  history: UserProblemHistory,
  count: number = 5
): ProblemSelection[] {
  const selections: ProblemSelection[] = [];
  const usedIds = new Set<string>();

  // First, pick one problem per target pattern
  for (const pattern of targetPatterns) {
    if (selections.length >= count) break;

    try {
      const selection = selectProblemForPattern(pattern, history);
      if (!usedIds.has(selection.problem.id)) {
        selections.push(selection);
        usedIds.add(selection.problem.id);
      }
    } catch {
      // Skip if no problems for pattern
    }
  }

  // If we need more problems, cycle through patterns
  if (selections.length < count && targetPatterns.length > 0) {
    let patternIndex = 0;
    while (selections.length < count) {
      const pattern = targetPatterns[patternIndex % targetPatterns.length];
      try {
        const selection = selectProblemForPattern(pattern, history);
        if (!usedIds.has(selection.problem.id)) {
          selections.push(selection);
          usedIds.add(selection.problem.id);
        }
      } catch {
        // Skip
      }
      patternIndex++;
      // Prevent infinite loop
      if (patternIndex > targetPatterns.length * 3) break;
    }
  }

  return selections;
}

/**
 * Get all unique patterns from problem bank
 */
export function getAllPatterns(): Array<{ id: string; count: number }> {
  initializePatternCache();
  
  return Array.from(problemsByPattern.entries()).map(([id, problems]) => ({
    id,
    count: problems.length
  }));
}

/**
 * Get problem statistics
 */
export function getProblemStats() {
  const patterns = getAllPatterns();
  const difficultyStats = { easy: 0, medium: 0, hard: 0 };

  for (const problem of practiceExercises) {
    const diff = problem.difficulty;
    if (diff in difficultyStats) {
      difficultyStats[diff as keyof typeof difficultyStats]++;
    }
  }

  return {
    totalProblems: practiceExercises.length,
    totalPatterns: patterns.length,
    problemsByDifficulty: difficultyStats,
    patterns
  };
}

/**
 * Get a revision problem for spaced repetition
 * Selects from concepts that need review based on forgetting curve
 */
export function getRevisionProblem(
  conceptScores: Map<string, number>,
  history: UserProblemHistory
): ProblemSelection | null {
  // Find concepts with decaying scores
  const weakConcepts: string[] = [];

  for (const [conceptId, score] of conceptScores.entries()) {
    if (score < 70) {
      weakConcepts.push(conceptId);
    }
  }

  if (weakConcepts.length === 0) {
    return null;
  }

  // Pick the weakest concept
  const targetConcept = weakConcepts[0];

  // Find matching pattern
  const patterns = getAllPatterns();
  const matchingPattern = patterns.find(p =>
    p.id.toLowerCase().includes(targetConcept.toLowerCase()) ||
    targetConcept.toLowerCase().includes(p.id.toLowerCase())
  );

  if (!matchingPattern) {
    // Fallback to first weak concept as pattern
    try {
      return selectProblemForPattern(weakConcepts[0], history);
    } catch {
      return null;
    }
  }

  return selectProblemForPattern(matchingPattern.id, history);
}

/**
 * Update history after problem attempt
 */
export function updateProblemHistory(
  history: UserProblemHistory,
  problemId: string,
  pattern: string,
  score: number
): UserProblemHistory {
  const newHistory: UserProblemHistory = {
    attemptedProblems: new Map(history.attemptedProblems),
    problemScores: new Map(history.problemScores),
    lastAttempted: new Map(history.lastAttempted)
  };

  // Add problem to attempted list for pattern
  const patternProblems = newHistory.attemptedProblems.get(pattern) || [];
  if (!patternProblems.includes(problemId)) {
    patternProblems.push(problemId);
  }
  newHistory.attemptedProblems.set(pattern, patternProblems);

  // Update score and timestamp
  newHistory.problemScores.set(problemId, score);
  newHistory.lastAttempted.set(problemId, Date.now());

  return newHistory;
}

/**
 * Create empty history
 */
export function createEmptyHistory(): UserProblemHistory {
  return {
    attemptedProblems: new Map(),
    problemScores: new Map(),
    lastAttempted: new Map()
  };
}

// Export the total count for easy access
export const TOTAL_PROBLEMS = practiceExercises.length;
