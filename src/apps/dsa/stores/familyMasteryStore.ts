import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  FamilyMasteryRecord,
  AdaptiveLearningQueue,
  VariationAttempt,
  QueuedFamily,
  PausedFamily,
  QueueModification
} from '../types/concept-families';
import { getAllFamilies } from '../data/problemFamilyMapping';
import { familyDependencyGraph } from '../data/familyDependencyGraph';

interface FamilyMasteryState {
  // Data
  familyRecords: Record<string, FamilyMasteryRecord>;
  learningQueue: AdaptiveLearningQueue;

  // Stats
  totalMastered: number;
  totalAttempts: number;

  // Actions
  initializeStore: () => void;
  getFamilyRecord: (familyId: string) => FamilyMasteryRecord | undefined;
  updateFamilyRecord: (familyId: string, updates: Partial<FamilyMasteryRecord>) => void;

  // Queue Actions
  setQueue: (queue: QueuedFamily[]) => void;
  setPausedFamilies: (paused: PausedFamily[]) => void;
  addQueueHistory: (modification: QueueModification) => void;

  // Reset
  resetProgress: () => void;
}

const INITIAL_QUEUE_STATE: AdaptiveLearningQueue = {
  queue: [],
  pausedFamilies: [],
  queueHistory: []
};

// Helper to create initial record
const createInitialRecord = (familyId: string): FamilyMasteryRecord => ({
  familyId,
  status: 'not-started',
  isMastered: false,
  masteredAt: null,
  masteredAtIndex: null,
  masteryVariationId: null,
  lastReviewedAtIndex: null,
  reviewAttempts: 0,
  usedHelpOnMastery: false,
  usedVariations: [],
  currentVariationId: null,
  attempts: [],
  totalAttempts: 0,
  totalTimeSpentMs: 0,
  bestTimeMs: null,
  totalHintsUsed: 0
});

export const useFamilyMasteryStore = create<FamilyMasteryState>()(
  persist(
    (set, get) => ({
      familyRecords: {},
      learningQueue: INITIAL_QUEUE_STATE,
      totalMastered: 0,
      totalAttempts: 0,

      initializeStore: () => {
        const state = get();
        // If already populated, usually we don't want to wipe it.
        // But if it's empty, let's look for missing families or init queue.

        const allFamilies = getAllFamilies();
        const currentRecordKeys = Object.keys(state.familyRecords);

        let hasChanges = false;
        const newRecords = { ...state.familyRecords };

        // 1. Ensure all families have validation records
        allFamilies.forEach(f => {
          if (!newRecords[f.familyId]) {
            newRecords[f.familyId] = createInitialRecord(f.familyId);
            hasChanges = true;
          }
        });

        // 2. Initialize Queue if empty
        let newQueue = { ...state.learningQueue };
        if (state.learningQueue.queue.length === 0 && state.totalAttempts === 0) {
          // Initial load - populate queue sorted by level
          // We use the graph levels to sort
          const sortedFamilies = [...allFamilies].sort((a, b) => {
            const levelA = familyDependencyGraph.getLevel(a.familyId);
            const levelB = familyDependencyGraph.getLevel(b.familyId);
            // Secondary sort by module ID
            if (levelA === levelB) return a.moduleId - b.moduleId;
            return levelA - levelB;
          });

          newQueue.queue = sortedFamilies.map((f, idx) => ({
            familyId: f.familyId,
            priority: idx, // Simple linear priority
            reason: 'next-in-sequence',
            addedAt: Date.now()
          }));

          newQueue.queueHistory.push({
            timestamp: Date.now(),
            action: 'reorder',
            affectedFamilies: sortedFamilies.map(f => f.familyId),
            reason: 'Initial queue generation'
          });

          hasChanges = true;
        } else {
          // MIGRATION: Check for any new families that are missing from queue/paused/mastered
          const existingQueueIds = new Set(state.learningQueue.queue.map(q => q.familyId));
          const activePausedIds = new Set(state.learningQueue.pausedFamilies.map(p => p.familyId));

          // Families that exist in code but not in any list
          const missingFamilies = allFamilies.filter(f =>
            !existingQueueIds.has(f.familyId) &&
            !activePausedIds.has(f.familyId) &&
            !state.familyRecords[f.familyId]?.isMastered
          );

          if (missingFamilies.length > 0) {
            const currentMaxPriority = state.learningQueue.queue.length > 0
              ? Math.max(...state.learningQueue.queue.map(q => q.priority))
              : 0;

            const newQueueItems = missingFamilies.map((f, idx) => ({
              familyId: f.familyId,
              priority: currentMaxPriority + idx + 1,
              reason: 'next-in-sequence' as const, // As const to satisfy type
              addedAt: Date.now()
            }));

            newQueue.queue = [...newQueue.queue, ...newQueueItems];

            newQueue.queueHistory.push({
              timestamp: Date.now(),
              action: 'reorder',
              affectedFamilies: missingFamilies.map(f => f.familyId),
              reason: 'Auto-migration: Added new families'
            });
            hasChanges = true;
          }
        }

        if (hasChanges) {
          set({
            familyRecords: newRecords,
            learningQueue: newQueue
          });
        }
      },

      getFamilyRecord: (familyId) => {
        return get().familyRecords[familyId];
      },

      updateFamilyRecord: (familyId, updates) => {
        set(state => {
          const current = state.familyRecords[familyId] || createInitialRecord(familyId);
          const updated = { ...current, ...updates };

          // Re-calculate totals if needed (simple approximation)
          const newRecords = { ...state.familyRecords, [familyId]: updated };
          const masteredCount = Object.values(newRecords).filter(r => r.isMastered).length;

          return {
            familyRecords: newRecords,
            totalMastered: masteredCount
          };
        });
      },

      setQueue: (queue) => {
        set(state => ({
          learningQueue: {
            ...state.learningQueue,
            queue
          }
        }));
      },

      setPausedFamilies: (paused) => {
        set(state => ({
          learningQueue: {
            ...state.learningQueue,
            pausedFamilies: paused
          }
        }));
      },

      addQueueHistory: (modification) => {
        set(state => ({
          learningQueue: {
            ...state.learningQueue,
            queueHistory: [...state.learningQueue.queueHistory, modification]
          }
        }));
      },

      resetProgress: () => {
        set({
          familyRecords: {},
          learningQueue: INITIAL_QUEUE_STATE,
          totalMastered: 0,
          totalAttempts: 0
        });
        get().initializeStore(); // Re-init immediately
      }
    }),
    {
      name: 'family-mastery-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
