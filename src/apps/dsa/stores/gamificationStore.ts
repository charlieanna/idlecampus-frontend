/**
 * Gamification Store - XP, Levels, Streaks, Badges
 *
 * Core gamification state for the progressive learning journey.
 * Persisted to localStorage for continuity across sessions.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ModuleMasteryRecord, DecayClassification } from '../types/progress-decay';
import { DEFAULT_DECAY_CONFIG } from '../types/progress-decay';

// Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt?: Date;
}

export interface XPEvent {
  id: string;
  timestamp: Date;
  amount: number;
  source: 'reading' | 'exercise' | 'quiz' | 'module' | 'streak' | 'bonus';
  sourceId: string;
  description: string;
}

interface GamificationState {
  // XP & Levels
  totalXP: number;
  currentLevel: number;

  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;

  // Badges
  unlockedBadges: string[];

  // XP History (last 50 events)
  xpHistory: XPEvent[];

  // Module progress (for journey map)
  moduleProgress: Record<string, number>; // moduleId -> percentage (0-100)
  completedModules: string[];
  currentModuleId: string | null;

  // Module Mastery with Decay (for Smart Practice)
  moduleMastery: Map<string, ModuleMasteryRecord>;
  currentSequenceNumber: number; // How many modules completed (for decay calculation)

  // Actions
  addXP: (amount: number, source: XPEvent['source'], sourceId: string, description: string) => void;
  checkAndUpdateStreak: () => void;
  unlockBadge: (badgeId: string) => void;
  setModuleProgress: (moduleId: string, progress: number) => void;
  completeModule: (moduleId: string, moduleName?: string, score?: number, problemCount?: number) => void;
  completeAllModules: () => void; // Dev helper to mark all modules complete
  setCurrentModule: (moduleId: string) => void;
  calculateLevel: (xp: number) => number;
  getXPForNextLevel: () => number;
  getXPProgress: () => { current: number; required: number; percentage: number };
  reset: () => void;

  // Module Decay Actions
  triggerModuleDecay: () => void;
  updateModuleMasteryFromPractice: (moduleId: string, success: boolean) => void;
  getModuleMasteryForModule: (moduleId: string) => ModuleMasteryRecord | null;
  calculateCurrentModuleMastery: (moduleId: string) => number;
  getModulesNeedingReview: () => ModuleMasteryRecord[];
  getModuleDecaySummary: () => {
    totalModules: number;
    freshCount: number;
    stableCount: number;
    fadingCount: number;
    decayedCount: number;
    criticalCount: number;
    averageRetention: number;
  };
}

// Level thresholds - XP required to reach each level
const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  800,    // Level 5
  1200,   // Level 6
  1700,   // Level 7
  2300,   // Level 8
  3000,   // Level 9
  4000,   // Level 10
  5200,   // Level 11
  6600,   // Level 12
  8200,   // Level 13
  10000,  // Level 14
  12000,  // Level 15 (Master)
];

const initialState = {
  totalXP: 0,
  currentLevel: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  unlockedBadges: [],
  xpHistory: [],
  moduleProgress: {},
  completedModules: [],
  currentModuleId: null,
  moduleMastery: new Map<string, ModuleMasteryRecord>(),
  currentSequenceNumber: 0,
};

// Helper function to classify decay level
function classifyDecayLevel(decayPercent: number): DecayClassification {
  if (decayPercent < DEFAULT_DECAY_CONFIG.freshThreshold) return 'fresh';
  if (decayPercent < DEFAULT_DECAY_CONFIG.stableThreshold) return 'stable';
  if (decayPercent < DEFAULT_DECAY_CONFIG.fadingThreshold) return 'fading';
  if (decayPercent < DEFAULT_DECAY_CONFIG.decayedThreshold) return 'decayed';
  return 'critical';
}

// Helper function to calculate module decay based on learning progress
function calculateModuleDecayPercentage(
  module: ModuleMasteryRecord,
  currentSequence: number
): number {
  // Validate inputs
  if (!module || typeof currentSequence !== 'number' || isNaN(currentSequence)) {
    return 0;
  }

  // Validate sequenceNumber
  const sequenceNumber = typeof module.sequenceNumber === 'number' && !isNaN(module.sequenceNumber)
    ? module.sequenceNumber
    : 0;

  // How many modules were completed AFTER this module?
  const modulesAfter = Math.max(0, currentSequence - sequenceNumber);

  // Base decay per module completed after (5% per module)
  let decay = modulesAfter * DEFAULT_DECAY_CONFIG.moduleDecayRate;

  // Apply strength/weakness modifiers
  if (module.isStrength) {
    decay *= DEFAULT_DECAY_CONFIG.strengthDecayMultiplier; // Strengths decay 40% slower
  } else if (module.isWeakness) {
    decay *= DEFAULT_DECAY_CONFIG.weaknessDecayMultiplier; // Weaknesses decay 40% faster
  }

  // Apply practice recovery (3% per practice session)
  const practiceCount = typeof module.practiceCountAfterModule === 'number' && !isNaN(module.practiceCountAfterModule)
    ? module.practiceCountAfterModule
    : 0;
  const practiceRecovery = practiceCount * DEFAULT_DECAY_CONFIG.practiceRecoveryRate;
  decay = Math.max(0, decay - practiceRecovery);

  // Cap at maximum decay (80%)
  return Math.min(DEFAULT_DECAY_CONFIG.maxDecay, Math.max(0, decay));
}

export const useGamificationStore = create<GamificationState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        calculateLevel: (xp: number) => {
          let level = 1;
          for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
            if (xp >= LEVEL_THRESHOLDS[i]) {
              level = i + 1;
            } else {
              break;
            }
          }
          return Math.min(level, LEVEL_THRESHOLDS.length);
        },

        getXPForNextLevel: () => {
          const { totalXP, currentLevel } = get();
          if (currentLevel >= LEVEL_THRESHOLDS.length) {
            return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
          }
          return LEVEL_THRESHOLDS[currentLevel];
        },

        getXPProgress: () => {
          const { totalXP, currentLevel } = get();
          const currentLevelXP = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
          const nextLevelXP = LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
          const xpInCurrentLevel = totalXP - currentLevelXP;
          const xpRequired = nextLevelXP - currentLevelXP;
          return {
            current: xpInCurrentLevel,
            required: xpRequired,
            percentage: Math.min(100, (xpInCurrentLevel / xpRequired) * 100),
          };
        },

        addXP: (amount, source, sourceId, description) => {
          const state = get();
          const newTotalXP = state.totalXP + amount;
          const newLevel = state.calculateLevel(newTotalXP);

          const newEvent: XPEvent = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            amount,
            source,
            sourceId,
            description,
          };

          set({
            totalXP: newTotalXP,
            currentLevel: newLevel,
            xpHistory: [newEvent, ...state.xpHistory].slice(0, 50), // Keep last 50
          }, false, 'addXP');

          // Check streak after activity
          get().checkAndUpdateStreak();
        },

        checkAndUpdateStreak: () => {
          const state = get();
          const today = new Date().toDateString();
          const lastActivity = state.lastActivityDate;

          if (!lastActivity) {
            // First activity ever
            set({
              currentStreak: 1,
              longestStreak: Math.max(1, state.longestStreak),
              lastActivityDate: today,
            }, false, 'checkAndUpdateStreak');
            return;
          }

          if (lastActivity === today) {
            // Already active today, no change
            return;
          }

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toDateString();

          if (lastActivity === yesterdayStr) {
            // Continuing streak
            const newStreak = state.currentStreak + 1;
            set({
              currentStreak: newStreak,
              longestStreak: Math.max(newStreak, state.longestStreak),
              lastActivityDate: today,
            }, false, 'checkAndUpdateStreak');
          } else {
            // Streak broken, reset to 1
            set({
              currentStreak: 1,
              lastActivityDate: today,
            }, false, 'checkAndUpdateStreak');
          }
        },

        unlockBadge: (badgeId) => {
          const state = get();
          if (!state.unlockedBadges.includes(badgeId)) {
            set({
              unlockedBadges: [...state.unlockedBadges, badgeId],
            }, false, 'unlockBadge');
          }
        },

        setModuleProgress: (moduleId, progress) => {
          set((state) => ({
            moduleProgress: {
              ...state.moduleProgress,
              [moduleId]: Math.min(100, Math.max(0, progress)),
            },
          }), false, 'setModuleProgress');
        },

        completeModule: (moduleId, moduleName = moduleId, score = 100, problemCount = 0) => {
          const state = get();
          if (!state.completedModules.includes(moduleId)) {
            const newSequence = state.currentSequenceNumber + 1;

            // Create mastery record for the new module
            const newMasteryRecord: ModuleMasteryRecord = {
              moduleId,
              moduleName,
              sequenceNumber: newSequence,
              completedAt: Date.now(),
              initialScore: score,
              currentMastery: score,
              decayPercentage: 0,
              classification: 'fresh',
              isStrength: score >= 80,
              isWeakness: score < 50,
              lastPracticedAt: null,
              practiceCountAfterModule: 0,
              problemCount,
              solvedProblemsInModule: problemCount,
            };

            // Copy existing mastery map and add new record
            const newMasteryMap = new Map(state.moduleMastery);
            newMasteryMap.set(moduleId, newMasteryRecord);

            // Trigger decay on all previously completed modules
            for (const [id, record] of newMasteryMap.entries()) {
              if (id !== moduleId) {
                // Validate initialScore - if invalid, use default
                const initialScore = typeof record.initialScore === 'number' && !isNaN(record.initialScore) 
                  ? record.initialScore 
                  : 100; // Default to 100 if invalid
                
                const decayPercentage = calculateModuleDecayPercentage(record, newSequence);
                const currentMastery = initialScore * (1 - decayPercentage);
                
                // Only update if currentMastery is valid
                if (!isNaN(currentMastery)) {
                  newMasteryMap.set(id, {
                    ...record,
                    initialScore, // Use validated initialScore
                    decayPercentage,
                    currentMastery,
                    classification: classifyDecayLevel(decayPercentage),
                  });
                }
              }
            }

            set({
              completedModules: [...state.completedModules, moduleId],
              moduleProgress: {
                ...state.moduleProgress,
                [moduleId]: 100,
              },
              moduleMastery: newMasteryMap,
              currentSequenceNumber: newSequence,
            }, false, 'completeModule');
          }
        },

        completeAllModules: () => {
          const allModules = [
            { id: 'python-basics-fundamentals', name: 'Python Basics' },
            { id: 'time-complexity-foundations', name: 'Time Complexity' },
            { id: 'array-iteration-techniques', name: 'Array Iteration' },
            { id: 'hash-map-fundamentals', name: 'Hash Maps' },
            { id: 'python-oop-libraries', name: 'Python OOP' },
            { id: 'linked-list-mastery', name: 'Linked Lists' },
            { id: 'recursion-trees-foundation', name: 'Recursion' },
            { id: 'trees-traversals', name: 'Trees' },
            { id: 'binary-search-sorting', name: 'Binary Search' },
            { id: 'graphs-bfs-dfs', name: 'Graphs' },
            { id: 'union-find-disjoint-set', name: 'Union-Find' },
            { id: 'backtracking-decision-trees', name: 'Backtracking' },
            { id: 'dynamic-programming', name: 'DP' },
            { id: 'heaps-priority-queues', name: 'Heaps' },
            { id: 'tries-string-patterns', name: 'Tries' },
            // advanced-topics-mastery removed
            { id: 'bit-manipulation-math', name: 'Bit Manipulation' },
          ];

          const state = get();
          const newMasteryMap = new Map(state.moduleMastery);
          const newModuleProgress = { ...state.moduleProgress };
          const newCompletedModules = [...state.completedModules];
          let sequence = state.currentSequenceNumber;

          allModules.forEach(({ id, name }) => {
            if (!newCompletedModules.includes(id)) {
              sequence++;
              newCompletedModules.push(id);
              newModuleProgress[id] = 100;

              const masteryRecord: ModuleMasteryRecord = {
                moduleId: id,
                moduleName: name,
                sequenceNumber: sequence,
                completedAt: Date.now(),
                initialScore: 100,
                currentMastery: 100,
                decayPercentage: 0,
                classification: 'fresh' as DecayClassification,
                lastPracticedAt: Date.now(),
                practiceCountAfterModule: 0,
                problemsSolvedInModule: 0,
              };
              newMasteryMap.set(id, masteryRecord);
            }
          });

          set({
            completedModules: newCompletedModules,
            moduleProgress: newModuleProgress,
            moduleMastery: newMasteryMap,
            currentSequenceNumber: sequence,
          }, false, 'completeAllModules');

          console.log('✅ All modules marked as completed!', newCompletedModules);
        },

        setCurrentModule: (moduleId) => {
          set({ currentModuleId: moduleId }, false, 'setCurrentModule');
        },

        // === Module Decay Actions ===

        triggerModuleDecay: () => {
          const state = get();
          const newMasteryMap = new Map(state.moduleMastery);

          for (const [id, record] of newMasteryMap.entries()) {
            // Validate initialScore - if invalid, use default
            const initialScore = typeof record.initialScore === 'number' && !isNaN(record.initialScore) 
              ? record.initialScore 
              : 100; // Default to 100 if invalid
            
            const decayPercentage = calculateModuleDecayPercentage(record, state.currentSequenceNumber);
            const currentMastery = initialScore * (1 - decayPercentage);
            
            // Only update if currentMastery is valid
            if (!isNaN(currentMastery)) {
              newMasteryMap.set(id, {
                ...record,
                initialScore, // Use validated initialScore
                decayPercentage,
                currentMastery,
                classification: classifyDecayLevel(decayPercentage),
              });
            }
          }

          set({ moduleMastery: newMasteryMap }, false, 'triggerModuleDecay');
        },

        updateModuleMasteryFromPractice: (moduleId, success) => {
          const state = get();
          const record = state.moduleMastery.get(moduleId);
          if (!record) return;

          const newMasteryMap = new Map(state.moduleMastery);
          const practiceCount = record.practiceCountAfterModule + (success ? 1 : 0);

          // Validate initialScore - if invalid, use default
          const initialScore = typeof record.initialScore === 'number' && !isNaN(record.initialScore) 
            ? record.initialScore 
            : 100; // Default to 100 if invalid

          // Recalculate decay with new practice count
          const updatedRecord = {
            ...record,
            initialScore, // Use validated initialScore
            lastPracticedAt: Date.now(),
            practiceCountAfterModule: practiceCount,
          };

          const decayPercentage = calculateModuleDecayPercentage(updatedRecord, state.currentSequenceNumber);
          const currentMastery = initialScore * (1 - decayPercentage);

          // Only update if currentMastery is valid
          if (!isNaN(currentMastery)) {
            newMasteryMap.set(moduleId, {
              ...updatedRecord,
              decayPercentage,
              currentMastery,
              classification: classifyDecayLevel(decayPercentage),
            });

            set({ moduleMastery: newMasteryMap }, false, 'updateModuleMasteryFromPractice');
          }
        },

        getModuleMasteryForModule: (moduleId) => {
          return get().moduleMastery.get(moduleId) || null;
        },

        calculateCurrentModuleMastery: (moduleId) => {
          const state = get();
          const record = state.moduleMastery.get(moduleId);
          if (!record) return 0;

          // Validate initialScore - if invalid, return 0
          const initialScore = typeof record.initialScore === 'number' && !isNaN(record.initialScore) 
            ? record.initialScore 
            : 0;
          
          const decayPercentage = calculateModuleDecayPercentage(record, state.currentSequenceNumber);
          const currentMastery = initialScore * (1 - decayPercentage);
          
          return isNaN(currentMastery) ? 0 : currentMastery;
        },

        getModulesNeedingReview: () => {
          const state = get();
          const modulesNeedingReview: ModuleMasteryRecord[] = [];

          for (const [_, record] of state.moduleMastery) {
            // Validate initialScore - if invalid, skip this record or use default
            const initialScore = typeof record.initialScore === 'number' && !isNaN(record.initialScore) 
              ? record.initialScore 
              : 100; // Default to 100 if invalid
            
            const decayPercentage = calculateModuleDecayPercentage(record, state.currentSequenceNumber);
            const classification = classifyDecayLevel(decayPercentage);
            const currentMastery = initialScore * (1 - decayPercentage);

            // Only include if currentMastery is valid and module needs review
            if (!isNaN(currentMastery) && ['fading', 'decayed', 'critical'].includes(classification)) {
              modulesNeedingReview.push({
                ...record,
                initialScore, // Use validated initialScore
                decayPercentage,
                currentMastery,
                classification,
              });
            }
          }

          // Sort by decay percentage (highest first)
          return modulesNeedingReview.sort((a, b) => b.decayPercentage - a.decayPercentage);
        },

        getModuleDecaySummary: () => {
          const state = get();
          const counts = {
            fresh: 0,
            stable: 0,
            fading: 0,
            decayed: 0,
            critical: 0,
          };

          let totalRetention = 0;
          let validModules = 0;

          for (const [_, record] of state.moduleMastery) {
            // Validate initialScore - if invalid, skip this record
            const initialScore = typeof record.initialScore === 'number' && !isNaN(record.initialScore) 
              ? record.initialScore 
              : null;
            
            if (initialScore === null) continue; // Skip invalid records
            
            const decayPercentage = calculateModuleDecayPercentage(record, state.currentSequenceNumber);
            const classification = classifyDecayLevel(decayPercentage);
            const currentMastery = initialScore * (1 - decayPercentage);

            // Only count if currentMastery is valid
            if (!isNaN(currentMastery)) {
              counts[classification]++;
              totalRetention += currentMastery;
              validModules++;
            }
          }

          const averageRetention = validModules > 0 ? totalRetention / validModules : 100;

          return {
            totalModules: validModules,
            freshCount: counts.fresh,
            stableCount: counts.stable,
            fadingCount: counts.fading,
            decayedCount: counts.decayed,
            criticalCount: counts.critical,
            averageRetention,
          };
        },

        reset: () => set(initialState, false, 'reset'),
      }),
      {
        name: 'gamification-storage',
        partialize: (state) => ({
          totalXP: state.totalXP,
          currentLevel: state.currentLevel,
          currentStreak: state.currentStreak,
          longestStreak: state.longestStreak,
          lastActivityDate: state.lastActivityDate,
          unlockedBadges: state.unlockedBadges,
          xpHistory: state.xpHistory,
          moduleProgress: state.moduleProgress,
          completedModules: state.completedModules,
          currentModuleId: state.currentModuleId,
          // Serialize Map to array of entries for persistence
          moduleMastery: Array.from(state.moduleMastery.entries()),
          currentSequenceNumber: state.currentSequenceNumber,
        }),
        // Custom storage handler to properly deserialize Map
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            const parsed = JSON.parse(str);
            if (parsed.state) {
              // Restore moduleMastery Map from array
              if (parsed.state.moduleMastery && Array.isArray(parsed.state.moduleMastery)) {
                parsed.state.moduleMastery = new Map(parsed.state.moduleMastery);
              } else {
                parsed.state.moduleMastery = new Map();
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
        // Clean up bad data on rehydration
        onRehydrateStorage: () => (state) => {
          if (state && state.moduleMastery) {
            const cleanedMap = new Map<string, ModuleMasteryRecord>();
            let needsUpdate = false;

            for (const [id, record] of state.moduleMastery.entries()) {
              // Validate and fix initialScore
              const initialScore = typeof record.initialScore === 'number' && !isNaN(record.initialScore)
                ? record.initialScore
                : 100; // Default to 100 if invalid

              // Validate sequenceNumber
              const sequenceNumber = typeof record.sequenceNumber === 'number' && !isNaN(record.sequenceNumber)
                ? record.sequenceNumber
                : 0;

              // Validate practiceCountAfterModule
              const practiceCountAfterModule = typeof record.practiceCountAfterModule === 'number' && !isNaN(record.practiceCountAfterModule)
                ? record.practiceCountAfterModule
                : 0;

              // Recalculate decay and mastery with validated values
              const validatedRecord = {
                ...record,
                initialScore,
                sequenceNumber,
                practiceCountAfterModule,
              };

              const decayPercentage = calculateModuleDecayPercentage(validatedRecord, state.currentSequenceNumber || 0);
              const currentMastery = initialScore * (1 - decayPercentage);

              // Only keep records with valid currentMastery
              if (!isNaN(currentMastery) && !isNaN(decayPercentage)) {
                cleanedMap.set(id, {
                  ...validatedRecord,
                  decayPercentage,
                  currentMastery,
                  classification: classifyDecayLevel(decayPercentage),
                });
              } else {
                needsUpdate = true; // Mark that we removed invalid records
              }

              // Check if we fixed any values
              if (initialScore !== record.initialScore || 
                  sequenceNumber !== record.sequenceNumber ||
                  practiceCountAfterModule !== record.practiceCountAfterModule) {
                needsUpdate = true;
              }
            }

            // Update state if we cleaned up any bad data
            if (needsUpdate || cleanedMap.size !== state.moduleMastery.size) {
              state.moduleMastery = cleanedMap;
              console.log('🧹 Cleaned up invalid module mastery records');
            }
          }
        },
      }
    ),
    { name: 'GamificationStore' }
  )
);

// Export level thresholds for UI components
export { LEVEL_THRESHOLDS };

// Re-export ModuleMasteryRecord type for convenience
export type { ModuleMasteryRecord } from '../types/progress-decay';
