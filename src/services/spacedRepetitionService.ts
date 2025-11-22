/**
 * Spaced Repetition Service
 *
 * Manages concept review states, scheduling, and session creation
 * using SM-2 algorithm for optimal learning retention.
 */

import {
  Concept,
  ConceptReviewState,
  ScenarioQuestion,
  ScenarioResponse,
  ResponseEvaluation,
  ReviewSession,
  ReviewSessionType,
  ConceptDueForReview,
  ReviewDueQuery,
  MasteryLevel,
  calculateNextReview,
  calculateMasteryLevel,
  calculateQuality,
  calculateReviewPriority,
} from '../types/spacedRepetition';

// ============================================================================
// Storage Keys
// ============================================================================

const STORAGE_KEYS = {
  CONCEPT_STATES: 'srs_concept_states',
  REVIEW_SESSIONS: 'srs_review_sessions',
  RESPONSES: 'srs_responses',
} as const;

// ============================================================================
// Concept Review State Management
// ============================================================================

/**
 * Get review state for a specific concept
 * Creates initial state if it doesn't exist
 */
export function getConceptState(
  userId: string,
  conceptId: string
): ConceptReviewState {
  const states = getAllConceptStates(userId);
  const existing = states.find(s => s.conceptId === conceptId);

  if (existing) {
    return existing;
  }

  // Create initial state
  const now = new Date();
  const initialState: ConceptReviewState = {
    conceptId,
    userId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    lastReviewedAt: null,
    nextReviewAt: now, // Due immediately
    totalReviews: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    averageConfidence: 0,
    averageResponseTime: 0,
    masteryLevel: 'not_started',
    answeredQuestionIds: [],
    lastQuestionId: null,
    createdAt: now,
    updatedAt: now,
  };

  saveConceptState(initialState);
  return initialState;
}

/**
 * Get all concept states for a user
 */
export function getAllConceptStates(userId: string): ConceptReviewState[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONCEPT_STATES);
    if (!stored) return [];

    const allStates = JSON.parse(stored) as ConceptReviewState[];

    // Convert date strings back to Date objects and filter by user
    return allStates
      .filter(s => s.userId === userId)
      .map(state => ({
        ...state,
        lastReviewedAt: state.lastReviewedAt ? new Date(state.lastReviewedAt) : null,
        nextReviewAt: new Date(state.nextReviewAt),
        createdAt: new Date(state.createdAt),
        updatedAt: new Date(state.updatedAt),
      }));
  } catch (error) {
    console.error('Error loading concept states:', error);
    return [];
  }
}

/**
 * Save concept state to storage
 */
export function saveConceptState(state: ConceptReviewState): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONCEPT_STATES);
    const allStates: ConceptReviewState[] = stored ? JSON.parse(stored) : [];

    // Update or add state
    const index = allStates.findIndex(
      s => s.userId === state.userId && s.conceptId === state.conceptId
    );

    if (index >= 0) {
      allStates[index] = state;
    } else {
      allStates.push(state);
    }

    localStorage.setItem(STORAGE_KEYS.CONCEPT_STATES, JSON.stringify(allStates));
  } catch (error) {
    console.error('Error saving concept state:', error);
  }
}

/**
 * Update concept state after a review
 */
export function updateConceptStateAfterReview(
  conceptId: string,
  userId: string,
  response: ScenarioResponse,
  evaluation: ResponseEvaluation
): ConceptReviewState {
  const currentState = getConceptState(userId, conceptId);

  // Calculate quality rating for SM-2
  const quality = calculateQuality(evaluation, response.confidence);

  // Calculate next review using SM-2
  const updates = calculateNextReview(currentState, quality);

  // Update averages
  const totalReviews = updates.totalReviews!;
  const newAverageConfidence =
    (currentState.averageConfidence * currentState.totalReviews + response.confidence) /
    totalReviews;
  const newAverageResponseTime =
    (currentState.averageResponseTime * currentState.totalReviews + response.responseTimeSeconds) /
    totalReviews;

  // Create updated state
  const updatedState: ConceptReviewState = {
    ...currentState,
    ...updates,
    averageConfidence: newAverageConfidence,
    averageResponseTime: newAverageResponseTime,
    answeredQuestionIds: [...currentState.answeredQuestionIds, response.questionId],
    lastQuestionId: response.questionId,
    masteryLevel: 'not_started', // Will be recalculated below
  };

  // Calculate mastery level
  updatedState.masteryLevel = calculateMasteryLevel(updatedState);

  // Save to storage
  saveConceptState(updatedState);

  return updatedState;
}

// ============================================================================
// Review Scheduling
// ============================================================================

/**
 * Get concepts that are due for review
 */
export function getConceptsDueForReview(
  query: ReviewDueQuery,
  allConcepts: Concept[]
): ConceptDueForReview[] {
  const states = getAllConceptStates(query.userId);
  const now = new Date();

  // Filter concepts
  let filteredConcepts = allConcepts;
  if (query.categories && query.categories.length > 0) {
    filteredConcepts = filteredConcepts.filter(c =>
      query.categories!.includes(c.category)
    );
  }

  // Find due concepts
  const dueConcepts: ConceptDueForReview[] = [];

  for (const concept of filteredConcepts) {
    const state = getConceptState(query.userId, concept.id);

    // Check if due
    const nextReview = new Date(state.nextReviewAt);
    if (nextReview <= now || state.totalReviews === 0) {
      const daysOverdue = Math.max(
        0,
        (now.getTime() - nextReview.getTime()) / (24 * 60 * 60 * 1000)
      );
      const priority = calculateReviewPriority(state);

      dueConcepts.push({
        conceptId: concept.id,
        concept,
        state,
        priority,
        daysOverdue,
      });
    }
  }

  // Sort by priority (highest first)
  dueConcepts.sort((a, b) => b.priority - a.priority);

  // Apply prioritization if requested
  if (query.prioritizeWeak) {
    dueConcepts.sort((a, b) => {
      // First by mastery level (lower = higher priority)
      const masteryOrder: Record<MasteryLevel, number> = {
        not_started: 0,
        learning: 1,
        familiar: 2,
        proficient: 3,
        mastered: 4,
      };
      const masteryDiff = masteryOrder[a.state.masteryLevel] - masteryOrder[b.state.masteryLevel];
      if (masteryDiff !== 0) return masteryDiff;

      // Then by ease factor (lower = harder for user)
      return a.state.easeFactor - b.state.easeFactor;
    });
  }

  // Limit to max concepts
  if (query.maxConcepts) {
    return dueConcepts.slice(0, query.maxConcepts);
  }

  return dueConcepts;
}

/**
 * Get concepts the user is struggling with
 */
export function getWeakConcepts(
  userId: string,
  allConcepts: Concept[],
  limit: number = 10
): ConceptDueForReview[] {
  const states = getAllConceptStates(userId);

  const weakConcepts: ConceptDueForReview[] = [];

  for (const concept of allConcepts) {
    const state = getConceptState(userId, concept.id);

    // Only include concepts that have been reviewed
    if (state.totalReviews > 0) {
      // Weak if: low mastery, low ease factor, or poor success rate
      const successRate = state.totalCorrect / state.totalReviews;
      const isWeak =
        state.masteryLevel === 'learning' ||
        state.easeFactor < 1.8 ||
        successRate < 0.6;

      if (isWeak) {
        const priority = calculateReviewPriority(state);
        weakConcepts.push({
          conceptId: concept.id,
          concept,
          state,
          priority,
          daysOverdue: 0,
        });
      }
    }
  }

  // Sort by ease factor (lowest first = hardest for user)
  weakConcepts.sort((a, b) => a.state.easeFactor - b.state.easeFactor);

  return weakConcepts.slice(0, limit);
}

// ============================================================================
// Review Session Management
// ============================================================================

/**
 * Create a review session
 */
export function createReviewSession(
  userId: string,
  sessionType: ReviewSessionType,
  concepts: ConceptDueForReview[],
  questions: ScenarioQuestion[]
): ReviewSession {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const session: ReviewSession = {
    id: sessionId,
    userId,
    sessionType,
    concepts: concepts.map(c => ({
      conceptId: c.conceptId,
      questionId: selectQuestionForConcept(c.state, questions.filter(q => q.conceptId === c.conceptId)),
      dueAt: c.state.nextReviewAt,
      priority: c.priority,
    })),
    currentIndex: 0,
    completedQuestions: [],
    startedAt: new Date(),
    createdAt: new Date(),
  };

  saveReviewSession(session);
  return session;
}

/**
 * Select appropriate question for a concept
 * Avoids recently answered questions to ensure variety
 */
function selectQuestionForConcept(
  state: ConceptReviewState,
  availableQuestions: ScenarioQuestion[]
): string {
  if (availableQuestions.length === 0) {
    throw new Error('No questions available for concept');
  }

  // Filter out recently answered questions
  const recentlyAnswered = new Set(state.answeredQuestionIds.slice(-3)); // Last 3
  const freshQuestions = availableQuestions.filter(q => !recentlyAnswered.has(q.id));

  // If all questions recently answered, allow any question
  const candidateQuestions = freshQuestions.length > 0 ? freshQuestions : availableQuestions;

  // Select based on mastery level
  let targetDifficulty: ScenarioQuestion['difficulty'];
  if (state.masteryLevel === 'not_started' || state.masteryLevel === 'learning') {
    targetDifficulty = 'easy';
  } else if (state.masteryLevel === 'familiar') {
    targetDifficulty = 'medium';
  } else {
    targetDifficulty = 'hard';
  }

  // Try to find question at target difficulty
  const targetQuestions = candidateQuestions.filter(q => q.difficulty === targetDifficulty);
  if (targetQuestions.length > 0) {
    return targetQuestions[Math.floor(Math.random() * targetQuestions.length)].id;
  }

  // Fallback to any available question
  return candidateQuestions[Math.floor(Math.random() * candidateQuestions.length)].id;
}

/**
 * Save review session
 */
function saveReviewSession(session: ReviewSession): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REVIEW_SESSIONS);
    const allSessions: ReviewSession[] = stored ? JSON.parse(stored) : [];

    const index = allSessions.findIndex(s => s.id === session.id);
    if (index >= 0) {
      allSessions[index] = session;
    } else {
      allSessions.push(session);
    }

    localStorage.setItem(STORAGE_KEYS.REVIEW_SESSIONS, JSON.stringify(allSessions));
  } catch (error) {
    console.error('Error saving review session:', error);
  }
}

/**
 * Get review session by ID
 */
export function getReviewSession(sessionId: string): ReviewSession | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REVIEW_SESSIONS);
    if (!stored) return null;

    const allSessions = JSON.parse(stored) as ReviewSession[];
    const session = allSessions.find(s => s.id === sessionId);

    if (!session) return null;

    // Convert date strings back to Date objects
    return {
      ...session,
      startedAt: new Date(session.startedAt),
      completedAt: session.completedAt ? new Date(session.completedAt) : undefined,
      createdAt: new Date(session.createdAt),
      concepts: session.concepts.map(c => ({
        ...c,
        dueAt: new Date(c.dueAt),
      })),
    };
  } catch (error) {
    console.error('Error loading review session:', error);
    return null;
  }
}

/**
 * Update review session progress
 */
export function updateReviewSessionProgress(
  sessionId: string,
  questionId: string,
  moveNext: boolean = true
): ReviewSession | null {
  const session = getReviewSession(sessionId);
  if (!session) return null;

  // Mark question as completed
  if (!session.completedQuestions.includes(questionId)) {
    session.completedQuestions.push(questionId);
  }

  // Move to next question if requested
  if (moveNext && session.currentIndex < session.concepts.length - 1) {
    session.currentIndex++;
  }

  // Check if session is complete
  if (session.completedQuestions.length === session.concepts.length && !session.completedAt) {
    session.completedAt = new Date();
    session.totalTimeSeconds = Math.round(
      (session.completedAt.getTime() - session.startedAt.getTime()) / 1000
    );
  }

  saveReviewSession(session);
  return session;
}

// ============================================================================
// Response Management
// ============================================================================

/**
 * Save user response
 */
export function saveResponse(response: ScenarioResponse): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RESPONSES);
    const allResponses: ScenarioResponse[] = stored ? JSON.parse(stored) : [];

    allResponses.push(response);

    // Keep only last 1000 responses to avoid storage issues
    const recentResponses = allResponses.slice(-1000);

    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(recentResponses));
  } catch (error) {
    console.error('Error saving response:', error);
  }
}

/**
 * Get responses for a concept
 */
export function getConceptResponses(
  userId: string,
  conceptId: string
): ScenarioResponse[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RESPONSES);
    if (!stored) return [];

    const allResponses = JSON.parse(stored) as ScenarioResponse[];

    return allResponses
      .filter(r => r.userId === userId && r.conceptId === conceptId)
      .map(r => ({
        ...r,
        answeredAt: new Date(r.answeredAt),
      }))
      .sort((a, b) => b.answeredAt.getTime() - a.answeredAt.getTime());
  } catch (error) {
    console.error('Error loading responses:', error);
    return [];
  }
}

// ============================================================================
// Statistics
// ============================================================================

/**
 * Get user statistics
 */
export function getUserStatistics(userId: string): {
  totalConceptsReviewed: number;
  totalReviews: number;
  averageScore: number;
  masteryBreakdown: Record<MasteryLevel, number>;
  streakDays: number;
  nextReviewDate: Date | null;
} {
  const states = getAllConceptStates(userId);

  const totalConceptsReviewed = states.filter(s => s.totalReviews > 0).length;
  const totalReviews = states.reduce((sum, s) => sum + s.totalReviews, 0);
  const totalCorrect = states.reduce((sum, s) => sum + s.totalCorrect, 0);
  const averageScore = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;

  // Mastery breakdown
  const masteryBreakdown: Record<MasteryLevel, number> = {
    not_started: 0,
    learning: 0,
    familiar: 0,
    proficient: 0,
    mastered: 0,
  };
  states.forEach(s => {
    masteryBreakdown[s.masteryLevel]++;
  });

  // Next review date
  const reviewedStates = states.filter(s => s.totalReviews > 0);
  const nextReviewDate =
    reviewedStates.length > 0
      ? new Date(Math.min(...reviewedStates.map(s => new Date(s.nextReviewAt).getTime())))
      : null;

  // Streak calculation (simplified - could be enhanced)
  const streakDays = calculateStreak(states);

  return {
    totalConceptsReviewed,
    totalReviews,
    averageScore,
    masteryBreakdown,
    streakDays,
    nextReviewDate,
  };
}

/**
 * Calculate review streak (consecutive days with reviews)
 */
function calculateStreak(states: ConceptReviewState[]): number {
  // Get all review dates
  const reviewDates = states
    .filter(s => s.lastReviewedAt)
    .map(s => {
      const date = new Date(s.lastReviewedAt!);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    })
    .sort((a, b) => b.getTime() - a.getTime());

  if (reviewDates.length === 0) return 0;

  const uniqueDates = Array.from(new Set(reviewDates.map(d => d.getTime()))).map(t => new Date(t));

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < uniqueDates.length; i++) {
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (uniqueDates[i].getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
