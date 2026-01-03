/**
 * Practice Store - Zustand State Management
 *
 * Manages Smart Practice mode, problem selection, concept scoring, and mastery decay
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ConceptScore } from '../types/smart-practice';
import type { ProblemMastery, ReviewStatus, MasteryStats } from '../utils/decayEngine';
import {
  createInitialMastery,
  updateMasteryAfterReview,
  calculateCurrentMastery,
  getReviewStatus,
  calculateMasteryStats,
  getProblemsForReview,
} from '../utils/decayEngine';
import type { ProblemHintStep } from '../types/dsa-course';
import type { HintResolution } from '../utils/hintUtils';

/**
 * Inferred Mastery - tracks user's knowledge of a module based on problem performance
 * Used for adaptive problem selection in Smart Practice
 */
export interface InferredMastery {
  moduleId: string;
  confidence: number;      // 0-100: how confident we are user knows this module
  evidenceCount: number;   // Number of problems that informed this
  successCount: number;    // Problems solved successfully
  failureCount: number;    // Problems where user struggled
  lastAssessed: number;    // Timestamp of last assessment
}

/**
 * Failure Record - tracks when user struggles with a problem
 * Used to trigger fallback to prerequisite problems
 */
export interface FailureRecord {
  problemId: string;
  prereqs: string[];
  attempts: number;
  hintsUsed: number;
  failedAt: number;
}

/**
 * Practice Event - Chronological log of user activity
 * Used for session history and timeline visualization
 */
export type PracticeEventType = 'solve' | 'fail' | 'hint' | 'skip';

export interface PracticeEvent {
  id: string;
  type: PracticeEventType;
  problemId: string;
  problemTitle: string; // Denormalized for easier display
  timestamp: number;
  timeSpentMs?: number; // Only for solve/fail events
  metadata?: Record<string, any>; // Flexible for future needs (e.g., complexity analysis results)
}

export interface HintUsageStep {
  hintId: string;
  order: number;
  severity?: 'light' | 'medium' | 'heavy';
  conceptTags?: string[];
  familyId?: string;
  revealedAt: number;
  resolution: HintResolution;
  resolvedAt?: number;
}

export interface HintUsageRecord {
  problemId: string;
  steps: HintUsageStep[];
  totalRevealed: number;
  lastUpdated: number;
}

export interface PracticeState {
  // Smart Practice state
  currentPracticeModule: number;

  // Problem tracking
  currentProblemId: string | null;
  solvedProblems: Set<string>;
  attemptedProblems: Set<string>;

  // Concept scoring (63 problem families)
  conceptScores: ConceptScore[];

  // Submission tracking (unified for Learn and Practice modes)
  submissionAttempts: Map<string, number>;
  hintsUsed: Map<string, number>;
  hintUsage: Map<string, HintUsageRecord>;
  hintWeaknessByFamily: Map<string, { score: number; lastUpdated: number }>;

  // Brute force tracking
  bruteForceSolved: Set<string>;
  showBruteForceBlocker: Set<string>;
  highlightBruteForceBlocker: string | null;

  // Module 15 integration
  module15CompletedItems: Set<string>;

  // Progress-Aware Decay Engine (Mastery tracking)
  masteryRecords: Map<string, ProblemMastery>;
  problemStartTime: number | null;  // When current problem attempt started

  // Speed goals (fluency): track if user is meeting time budgets for problem families
  // Keyed by family tag (e.g., 'two-sum-family'), so we can practice \"such problems\"
  // until the user consistently solves within the time budget.
  speedGoals: Map<string, {
    familyTag: string;
    targetMs: number;
    lastTriggeredByProblemId: string;
    lastTimeSpentMs: number;
    lastUpdatedAt: number;
    recentOnTime: boolean[]; // rolling window, newest last
  }>;

  // Inferred Mastery System (for adaptive Smart Practice)
  inferredMastery: Map<string, InferredMastery>;
  failedProblems: Map<string, FailureRecord>;
  recentStruggleModules: string[]; // Modules where user recently struggled

  // Activity Log (Recent 50 events)
  activityLog: PracticeEvent[];

  // Actions
  setCurrentPracticeModule: (moduleNum: number) => void;
  setCurrentProblem: (problemId: string | null) => void;
  markProblemSolved: (problemId: string) => void;
  markProblemAttempted: (problemId: string) => void;
  setConceptScores: (scores: ConceptScore[]) => void;
  updateConceptScore: (conceptId: string, updates: Partial<ConceptScore>) => void;
  incrementSubmissionAttempts: (problemId: string) => void;
  recordHintReveal: (problemId: string, hint: ProblemHintStep) => HintUsageStep | null;
  recordHintFeedback: (problemId: string, hintId: string, resolution: Exclude<HintResolution, 'pending'>) => void;
  resetHintUsageForProblem: (problemId: string) => void;
  getHintWeaknessScore: (familyId: string) => number;
  markBruteForceSolved: (exerciseId: string) => void;
  showBruteForceBlockerFor: (exerciseId: string) => void;
  hideBruteForceBlocker: () => void;
  updateModule15Progress: (items: Set<string>) => void;
  reset: () => void;

  // Decay Engine Actions
  startProblemAttempt: () => void;
  recordProblemSolve: (
    problemId: string,
    difficulty: 'easy' | 'medium' | 'hard',
    hintsUsed: number,
    attemptNumber: number
  ) => number;
  recordSpeedResult: (
    familyTag: string,
    problemId: string,
    timeSpentMs: number,
    timeBudgetMs: number
  ) => void;
  getActiveSpeedGoals: () => Array<{ familyTag: string; targetMs: number; lastUpdatedAt: number }>;
  getMasteryForProblem: (problemId: string) => ProblemMastery | null;
  getCurrentMastery: (problemId: string) => number;
  getReviewStatusForProblem: (problemId: string) => ReviewStatus | null;
  getMasteryStats: () => MasteryStats;
  getProblemsNeedingReview: (
    problemDifficulties: Record<string, 'easy' | 'medium' | 'hard'>,
    limit?: number
  ) => Array<{ problemId: string; priority: number; status: ReviewStatus; currentMastery: number }>;

  // Inferred Mastery Actions
  recordProblemSuccess: (problemId: string, prereqs: string[]) => void;
  recordProblemFailure: (problemId: string, prereqs: string[], attempts: number, hintsUsed: number) => void;
  getInferredMastery: (moduleId: string) => InferredMastery | null;
  getOverallInferredMasteryLevel: () => number;
  isUserStruggling: (moduleId: string) => boolean;
  clearRecentStruggle: (moduleId: string) => void;
  boostMasteryFromModuleCompletion: (moduleId: string) => void;

  // Logging Action
  logEvent: (event: Omit<PracticeEvent, 'id' | 'timestamp'>) => void;
}

const initialState = {
  currentPracticeModule: 0.5,
  currentProblemId: null,
  solvedProblems: new Set<string>(),
  attemptedProblems: new Set<string>(),
  conceptScores: [] as ConceptScore[],
  submissionAttempts: new Map<string, number>(),
  hintsUsed: new Map<string, number>(),
  hintUsage: new Map<string, HintUsageRecord>(),
  hintWeaknessByFamily: new Map<string, { score: number; lastUpdated: number }>(),
  bruteForceSolved: new Set<string>(),
  showBruteForceBlocker: new Set<string>(),
  highlightBruteForceBlocker: null,
  module15CompletedItems: new Set<string>(),
  // Decay Engine state
  masteryRecords: new Map<string, ProblemMastery>(),
  problemStartTime: null as number | null,
  speedGoals: new Map(),
  // Inferred Mastery state
  inferredMastery: new Map<string, InferredMastery>(),
  failedProblems: new Map<string, FailureRecord>(),
  recentStruggleModules: [] as string[],
  activityLog: [] as PracticeEvent[],
};

export const usePracticeStore = create<PracticeState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setCurrentPracticeModule: (moduleNum) =>
          set({ currentPracticeModule: moduleNum }, false, 'setCurrentPracticeModule'),

        setCurrentProblem: (problemId) =>
          set({ currentProblemId: problemId }, false, 'setCurrentProblem'),

        markProblemSolved: (problemId) =>
          set((state) => ({
            solvedProblems: new Set([...state.solvedProblems, problemId]),
          }), false, 'markProblemSolved'),

        markProblemAttempted: (problemId) =>
          set((state) => ({
            attemptedProblems: new Set([...state.attemptedProblems, problemId]),
          }), false, 'markProblemAttempted'),

        setConceptScores: (scores) =>
          set({ conceptScores: scores }, false, 'setConceptScores'),

        updateConceptScore: (conceptId, updates) =>
          set((state) => {
            const index = state.conceptScores.findIndex(c => c.conceptId === conceptId);
            if (index === -1) return state;

            const newScores = [...state.conceptScores];
            newScores[index] = { ...newScores[index], ...updates };
            return { conceptScores: newScores };
          }, false, 'updateConceptScore'),

        incrementSubmissionAttempts: (problemId) =>
          set((state) => {
            const newMap = new Map(state.submissionAttempts);
            newMap.set(problemId, (newMap.get(problemId) || 0) + 1);
            return { submissionAttempts: newMap };
          }, false, 'incrementSubmissionAttempts'),

        recordHintReveal: (problemId, hint) => {
          let createdStep: HintUsageStep | null = null;
          set((state) => {
            if (!problemId || !hint) return null;

            const hintsUsed = new Map(state.hintsUsed);
            hintsUsed.set(problemId, (hintsUsed.get(problemId) || 0) + 1);

            const hintUsage = new Map(state.hintUsage);
            const record = hintUsage.get(problemId) ?? {
              problemId,
              steps: [] as HintUsageStep[],
              totalRevealed: 0,
              lastUpdated: Date.now(),
            };

            const step: HintUsageStep = {
              hintId: hint.id ?? `${problemId}-hint-${record.steps.length + 1}`,
              order: hint.order ?? record.steps.length + 1,
              severity: hint.severity ?? 'light',
              conceptTags: hint.conceptTags,
              familyId: hint.familyId,
              revealedAt: Date.now(),
              resolution: 'pending',
            };
            createdStep = step;

            const updatedRecord: HintUsageRecord = {
              ...record,
              steps: [...record.steps, step],
              totalRevealed: record.totalRevealed + 1,
              lastUpdated: step.revealedAt,
            };

            hintUsage.set(problemId, updatedRecord);
            return { hintsUsed, hintUsage };
          }, false, 'recordHintReveal');
          return createdStep;
        },

        recordHintFeedback: (problemId, hintId, resolution) =>
          set((state) => {
            if (!problemId || !hintId) return null;
            const usage = state.hintUsage.get(problemId);
            if (!usage) return null;

            const updatedSteps = usage.steps.map((step) =>
              step.hintId === hintId
                ? {
                    ...step,
                    resolution,
                    resolvedAt: Date.now(),
                  }
                : step
            );

            const hintUsage = new Map(state.hintUsage);
            hintUsage.set(problemId, {
              ...usage,
              steps: updatedSteps,
              lastUpdated: Date.now(),
            });

            let targetStep = updatedSteps.find(step => step.hintId === hintId);
            const hintWeaknessByFamily = new Map(state.hintWeaknessByFamily);
            if (targetStep?.familyId) {
              const familyState = hintWeaknessByFamily.get(targetStep.familyId) ?? { score: 0, lastUpdated: Date.now() };
              if (resolution === 'still-stuck') {
                const newScore = Math.min(100, familyState.score + 15);
                hintWeaknessByFamily.set(targetStep.familyId, { score: newScore, lastUpdated: Date.now() });
              } else if (resolution === 'helped' && familyState.score > 0) {
                const newScore = Math.max(0, familyState.score - 10);
                hintWeaknessByFamily.set(targetStep.familyId, { score: newScore, lastUpdated: Date.now() });
              }
            }

            return { hintUsage, hintWeaknessByFamily };
          }, false, 'recordHintFeedback'),

        resetHintUsageForProblem: (problemId) =>
          set((state) => {
            if (!problemId) return null;
            const hintUsage = new Map(state.hintUsage);
            hintUsage.delete(problemId);

            const hintsUsed = new Map(state.hintsUsed);
            hintsUsed.delete(problemId);

            return { hintUsage, hintsUsed };
          }, false, 'resetHintUsageForProblem'),

        getHintWeaknessScore: (familyId) => {
          const state = get();
          return state.hintWeaknessByFamily.get(familyId)?.score ?? 0;
        },

        markBruteForceSolved: (exerciseId) =>
          set((state) => ({
            bruteForceSolved: new Set([...state.bruteForceSolved, exerciseId]),
          }), false, 'markBruteForceSolved'),

        showBruteForceBlockerFor: (exerciseId) =>
          set((state) => ({
            showBruteForceBlocker: new Set([...state.showBruteForceBlocker, exerciseId]),
            highlightBruteForceBlocker: exerciseId,
          }), false, 'showBruteForceBlockerFor'),

        hideBruteForceBlocker: () =>
          set({ highlightBruteForceBlocker: null }, false, 'hideBruteForceBlocker'),

        updateModule15Progress: (items) =>
          set({ module15CompletedItems: items }, false, 'updateModule15Progress'),

        // Decay Engine Actions
        startProblemAttempt: () =>
          set({ problemStartTime: Date.now() }, false, 'startProblemAttempt'),

        recordProblemSolve: (problemId, difficulty, hintsUsed, attemptNumber) => {
          const state = get();
          const now = Date.now();
          const timeSpentMs = state.problemStartTime ? now - state.problemStartTime : 60000; // Default 1 min

          const existingMastery = state.masteryRecords.get(problemId);
          let newMastery: ProblemMastery;

          if (existingMastery) {
            // Update existing mastery (review)
            newMastery = updateMasteryAfterReview(
              existingMastery,
              true, // success
              hintsUsed,
              attemptNumber,
              timeSpentMs,
              difficulty
            );
          } else {
            // Create new mastery record (first solve)
            newMastery = createInitialMastery(
              problemId,
              difficulty,
              hintsUsed,
              attemptNumber,
              timeSpentMs
            );
          }

          const newRecords = new Map(state.masteryRecords);
          newRecords.set(problemId, newMastery);

          set({
            masteryRecords: newRecords,
            problemStartTime: null,
          }, false, 'recordProblemSolve');

          return timeSpentMs;
        },

        recordSpeedResult: (familyTag, problemId, timeSpentMs, timeBudgetMs) => {
          set((state) => {
            const newGoals = new Map(state.speedGoals);
            const existing = newGoals.get(familyTag);
            const onTime = timeSpentMs <= timeBudgetMs;
            const windowSize = 3;

            const nextRecent = existing?.recentOnTime ? [...existing.recentOnTime] : [];
            nextRecent.push(onTime);
            while (nextRecent.length > windowSize) nextRecent.shift();

            // If user is consistently on-time, clear the speed goal for this family
            const onTimeCount = nextRecent.filter(Boolean).length;
            const isFluent = nextRecent.length >= 3 && onTimeCount >= 2;

            if (isFluent) {
              newGoals.delete(familyTag);
            } else {
              newGoals.set(familyTag, {
                familyTag,
                targetMs: timeBudgetMs,
                lastTriggeredByProblemId: problemId,
                lastTimeSpentMs: timeSpentMs,
                lastUpdatedAt: Date.now(),
                recentOnTime: nextRecent,
              });
            }

            return { speedGoals: newGoals };
          }, false, 'recordSpeedResult');
        },

        getActiveSpeedGoals: () => {
          const goals = Array.from(get().speedGoals.values());
          return goals
            .map(g => ({
              familyTag: g.familyTag,
              targetMs: g.targetMs,
              lastUpdatedAt: g.lastUpdatedAt,
              recentOnTime: g.recentOnTime
            }))
            .sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt);
        },

        getMasteryForProblem: (problemId) => {
          return get().masteryRecords.get(problemId) || null;
        },

        getCurrentMastery: (problemId) => {
          const mastery = get().masteryRecords.get(problemId);
          if (!mastery) return 0;
          return calculateCurrentMastery(mastery);
        },

        getReviewStatusForProblem: (problemId) => {
          const mastery = get().masteryRecords.get(problemId);
          if (!mastery) return null;
          return getReviewStatus(mastery);
        },

        getMasteryStats: () => {
          const records = Array.from(get().masteryRecords.values());
          return calculateMasteryStats(records);
        },

        getProblemsNeedingReview: (problemDifficulties, limit = 10) => {
          const records = Array.from(get().masteryRecords.values());
          return getProblemsForReview(records, problemDifficulties, limit);
        },

        // Inferred Mastery Actions
        recordProblemSuccess: (problemId, prereqs) => {
          const state = get();
          const newInferredMastery = new Map(state.inferredMastery);

          // Boost confidence for all prerequisite modules
          prereqs.forEach(moduleId => {
            const existing = newInferredMastery.get(moduleId);
            if (existing) {
              // Increase confidence, max 100
              const newConfidence = Math.min(100, existing.confidence + 15);
              newInferredMastery.set(moduleId, {
                ...existing,
                confidence: newConfidence,
                evidenceCount: existing.evidenceCount + 1,
                successCount: existing.successCount + 1,
                lastAssessed: Date.now(),
              });
            } else {
              // Create new mastery record with moderate initial confidence
              newInferredMastery.set(moduleId, {
                moduleId,
                confidence: 40, // Start with moderate confidence on success
                evidenceCount: 1,
                successCount: 1,
                failureCount: 0,
                lastAssessed: Date.now(),
              });
            }
          });

          // Remove from failed problems if it was there
          const newFailedProblems = new Map(state.failedProblems);
          newFailedProblems.delete(problemId);

          set({
            inferredMastery: newInferredMastery,
            failedProblems: newFailedProblems,
          }, false, 'recordProblemSuccess');
        },

        recordProblemFailure: (problemId, prereqs, attempts, hintsUsed) => {
          const state = get();
          const newInferredMastery = new Map(state.inferredMastery);
          const newFailedProblems = new Map(state.failedProblems);
          let newRecentStruggleModules = [...state.recentStruggleModules];

          // Record the failure
          newFailedProblems.set(problemId, {
            problemId,
            prereqs,
            attempts,
            hintsUsed,
            failedAt: Date.now(),
          });

          // Reduce confidence for prerequisite modules
          prereqs.forEach(moduleId => {
            const existing = newInferredMastery.get(moduleId);
            if (existing) {
              // Decrease confidence based on severity
              const severityMultiplier = Math.min(3, attempts) + (hintsUsed > 2 ? 1 : 0);
              const confidenceReduction = 10 * severityMultiplier;
              const newConfidence = Math.max(0, existing.confidence - confidenceReduction);

              newInferredMastery.set(moduleId, {
                ...existing,
                confidence: newConfidence,
                evidenceCount: existing.evidenceCount + 1,
                failureCount: existing.failureCount + 1,
                lastAssessed: Date.now(),
              });

              // Mark as struggling if confidence drops below threshold
              if (newConfidence < 30 && !newRecentStruggleModules.includes(moduleId)) {
                newRecentStruggleModules.push(moduleId);
              }
            } else {
              // Create new mastery record with low confidence
              newInferredMastery.set(moduleId, {
                moduleId,
                confidence: 10, // Low confidence on first failure
                evidenceCount: 1,
                successCount: 0,
                failureCount: 1,
                lastAssessed: Date.now(),
              });

              // Mark as struggling
              if (!newRecentStruggleModules.includes(moduleId)) {
                newRecentStruggleModules.push(moduleId);
              }
            }
          });

          set({
            inferredMastery: newInferredMastery,
            failedProblems: newFailedProblems,
            recentStruggleModules: newRecentStruggleModules,
          }, false, 'recordProblemFailure');
        },

        getInferredMastery: (moduleId) => {
          return get().inferredMastery.get(moduleId) || null;
        },

        getOverallInferredMasteryLevel: () => {
          const mastery = get().inferredMastery;
          if (mastery.size === 0) return 0;

          let totalConfidence = 0;
          mastery.forEach(m => {
            totalConfidence += m.confidence;
          });

          return totalConfidence / mastery.size;
        },

        isUserStruggling: (moduleId) => {
          const state = get();
          // Check if module is in recent struggle list
          if (state.recentStruggleModules.includes(moduleId)) {
            return true;
          }
          // Also check if confidence is very low
          const mastery = state.inferredMastery.get(moduleId);
          return mastery ? mastery.confidence < 25 : false;
        },

        clearRecentStruggle: (moduleId) => {
          set((state) => ({
            recentStruggleModules: state.recentStruggleModules.filter(m => m !== moduleId),
          }), false, 'clearRecentStruggle');
        },

        boostMasteryFromModuleCompletion: (moduleId) => {
          const state = get();
          const newInferredMastery = new Map(state.inferredMastery);

          // Set high confidence for completed module
          const existing = newInferredMastery.get(moduleId);
          newInferredMastery.set(moduleId, {
            moduleId,
            confidence: 85, // High confidence from module completion
            evidenceCount: (existing?.evidenceCount || 0) + 5, // Count as significant evidence
            successCount: (existing?.successCount || 0) + 5,
            failureCount: existing?.failureCount || 0,
            lastAssessed: Date.now(),
          });

          // Remove from struggle list if present
          const newRecentStruggleModules = state.recentStruggleModules.filter(m => m !== moduleId);

          set({
            inferredMastery: newInferredMastery,
            recentStruggleModules: newRecentStruggleModules,
          }, false, 'boostMasteryFromModuleCompletion');
        },

        logEvent: (eventData) => {
          set((state) => {
            const newEvent: PracticeEvent = {
              ...eventData,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
            };

            // Keep last 50 events
            const newLog = [newEvent, ...state.activityLog].slice(0, 50);

            return { activityLog: newLog };
          }, false, 'logEvent');
        },

        reset: () =>
          set(initialState, false, 'reset'),
      }),
      {
        name: 'practice-storage',
        version: 1,
        migrate: (persistedState: any) => persistedState,
        partialize: (state) => ({
          currentPracticeModule: state.currentPracticeModule,
          solvedProblems: Array.from(state.solvedProblems),
          attemptedProblems: Array.from(state.attemptedProblems),
          conceptScores: state.conceptScores,
          module15CompletedItems: Array.from(state.module15CompletedItems),
          // Decay Engine - serialize Map to array of entries
          masteryRecords: Array.from(state.masteryRecords.entries()),
          // Speed goals - serialize Map to array of entries
          speedGoals: Array.from(state.speedGoals.entries()),
          // Inferred Mastery - serialize Maps
          inferredMastery: Array.from(state.inferredMastery.entries()),
          failedProblems: Array.from(state.failedProblems.entries()),
          recentStruggleModules: state.recentStruggleModules,
          activityLog: state.activityLog,
        }),
        // Custom storage handler to properly deserialize Maps and Sets
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            const parsed = JSON.parse(str);
            if (parsed.state) {
              // Restore Sets
              if (parsed.state.solvedProblems) {
                parsed.state.solvedProblems = new Set(parsed.state.solvedProblems);
              }
              if (parsed.state.attemptedProblems) {
                parsed.state.attemptedProblems = new Set(parsed.state.attemptedProblems);
              }
              if (parsed.state.module15CompletedItems) {
                parsed.state.module15CompletedItems = new Set(parsed.state.module15CompletedItems);
              }
              // Restore mastery Map
              if (parsed.state.masteryRecords) {
                parsed.state.masteryRecords = new Map(parsed.state.masteryRecords);
              }
              // Restore speed goals Map
              if (parsed.state.speedGoals) {
                parsed.state.speedGoals = new Map(parsed.state.speedGoals);
              }
              // Restore inferred mastery Maps
              if (parsed.state.inferredMastery) {
                parsed.state.inferredMastery = new Map(parsed.state.inferredMastery);
              }
              if (parsed.state.failedProblems) {
                parsed.state.failedProblems = new Map(parsed.state.failedProblems);
              }
            }
            return parsed;
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            localStorage.removeItem(name);
          },
        },
      }
    ),
    { name: 'PracticeStore' }
  )
);

// Selectors
export const practiceSelectors = {
  currentPracticeModule: (state: PracticeState) => state.currentPracticeModule,
  solvedProblems: (state: PracticeState) => state.solvedProblems,
  currentProblemId: (state: PracticeState) => state.currentProblemId,
  conceptScores: (state: PracticeState) => state.conceptScores,
  submissionAttempts: (state: PracticeState) => state.submissionAttempts,
  hintsUsed: (state: PracticeState) => state.hintsUsed,
  masteryRecords: (state: PracticeState) => state.masteryRecords,
  activityLog: (state: PracticeState) => state.activityLog,
};

// Re-export types from decayEngine for convenience
export type { ProblemMastery, ProblemAttempt, ReviewStatus, MasteryStats } from '../utils/decayEngine';