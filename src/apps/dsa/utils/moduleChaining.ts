/**
 * Centralized Module Chaining System
 *
 * This utility provides a single source of truth for:
 * 1. Module order and dependencies
 * 2. Module completion detection
 * 3. Automatic unlocking of next modules
 *
 * Access Modes:
 * - 'sequential': Modules unlock one at a time (default)
 * - 'open': All modules are accessible from the start
 *
 * Fix bugs once here, use everywhere!
 */

// Access mode configuration - 'prerequisite' uses DAG, 'open' unlocks all
export type AccessMode = 'prerequisite' | 'open';

// Global access mode - 'prerequisite' enforces DAG-based progression
// Set to 'open' to unlock all modules for testing/development
export const ACCESS_MODE: AccessMode = 'open';

/**
 * Module Prerequisites DAG Definition
 * Each module maps to an array of prerequisite module IDs that must be completed.
 * Empty array = always unlocked.
 *
 * DAG Structure:
 * - Python (0) → Time Complexity (1) → Arrays (2), Hash Maps (3) [parallel]
 * - Arrays + Hash Maps → Array+HashMap (4)
 * - Python → OOP (5)
 * - Arrays + OOP → Linked Lists (6)
 * - Arrays → Binary Search (9) [can run parallel to other tracks]
 * - Linked Lists → Recursion (7) → Trees (8)
 * - Trees → Graphs (10), Backtracking (12), Heaps (14), Tries (15) [parallel]
 * - Graphs → Union-Find (11)
 * - Recursion + Array+HashMap → DP (13)
 * - DP + Graphs + Heaps → Advanced (16)
 * - DP + Graphs → Bit Manipulation (17) [late access]
 */
export const MODULE_PREREQUISITES: Record<string, string[]> = {
  // Always unlocked
  'python-basics-fundamentals': [],
  'smart-practice': [],

  // Requires Python
  'time-complexity-foundations': ['python-basics-fundamentals'],
  'python-oop-libraries': ['python-basics-fundamentals'],

  // Requires Time Complexity
  'array-iteration-techniques': ['time-complexity-foundations'],
  'hash-map-fundamentals': ['time-complexity-foundations'],


  // Sliding Window requires Array Iteration (can run parallel with other modules)
  'sliding-window-mastery': ['array-iteration-techniques'],

  // Prefix/Suffix requires Array Iteration
  'prefix-suffix-arrays': ['array-iteration-techniques'],

  // Stack and Queue require Array Iteration (can run parallel with other modules)
  'stack-discovery-lifo': ['array-iteration-techniques'],
  'queue-discovery-fifo': ['array-iteration-techniques'],

  // Binary Search can run parallel (only needs Arrays)
  'binary-search-sorting': ['array-iteration-techniques'],

  // Linked Lists requires Arrays + OOP
  'linked-list-mastery': ['array-iteration-techniques', 'python-oop-libraries'],

  // Recursion requires Linked Lists
  'recursion-trees-foundation': ['linked-list-mastery'],

  // Trees requires Recursion
  'trees-traversals': ['recursion-trees-foundation'],

  // These all unlock after Trees (can run parallel)
  'graphs-bfs-dfs': ['trees-traversals'],
  'backtracking-decision-trees': ['recursion-trees-foundation'],
  'heaps-priority-queues': ['trees-traversals'],
  'tries-string-patterns': ['trees-traversals', 'hash-map-fundamentals'],

  // Union-Find requires Graphs
  'union-find-disjoint-set': ['graphs-bfs-dfs'],

  // DP requires Recursion + Hash Maps
  'dynamic-programming': ['recursion-trees-foundation', 'hash-map-fundamentals'],

  // advanced-topics-mastery removed - exercises moved to topic modules

  // Bit Manipulation is late access (requires DP + Graphs)
  'bit-manipulation-math': ['dynamic-programming', 'graphs-bfs-dfs'],
};

export interface ModuleInfo {
  id: string;
  moduleId: string; // The ID used in progressiveLessonsMap or dsaCourse.modules
  title: string;
  shortTitle: string;
  icon: string;
  nextModuleId?: string; // ID of the next module to unlock
}

/**
 * Define the complete module chain in order
 * PYTHON (Module 0) IS FIRST - must complete before anything else unlocks!
 * When one module completes, the next automatically unlocks
 */
export const MODULE_CHAIN: ModuleInfo[] = [
  // Python is FIRST - gateway to the entire course
  { id: 'module-0', moduleId: 'python-basics-fundamentals', title: 'Module 0: Python Basics', shortTitle: 'Python', icon: '🐍', nextModuleId: 'module-1' },

  // Time Complexity (foundational)
  { id: 'module-1', moduleId: 'time-complexity-foundations', title: 'Module 1: Time Complexity Foundations', shortTitle: 'Complexity', icon: '⏱️', nextModuleId: 'module-2' },

  // Core data structures and patterns
  { id: 'module-2', moduleId: 'array-iteration-techniques', title: 'Module 2: Array Iteration Techniques', shortTitle: 'Arrays', icon: '📊', nextModuleId: 'module-3' },
  { id: 'module-3', moduleId: 'hash-map-fundamentals', title: 'Module 3: Hash Map Fundamentals', shortTitle: 'Hash Maps', icon: '🗺️', nextModuleId: 'module-5' },

  // Python OOP (needed for advanced data structures)
  { id: 'module-5', moduleId: 'python-oop-libraries', title: 'Module 5: Python OOP & Essential Libraries', shortTitle: 'OOP', icon: '🏭', nextModuleId: 'module-6' },

  // Advanced data structures
  { id: 'module-6', moduleId: 'linked-list-mastery', title: 'Module 6: Linked List Mastery', shortTitle: 'Linked Lists', icon: '🔗', nextModuleId: 'module-7' },
  { id: 'module-7', moduleId: 'recursion-trees-foundation', title: 'Module 7: Recursion & Trees Foundation', shortTitle: 'Recursion', icon: '🔄', nextModuleId: 'module-8' },
  { id: 'module-8', moduleId: 'trees-traversals', title: 'Module 8: Trees & Tree Traversals', shortTitle: 'Trees', icon: '🌲', nextModuleId: 'module-9' },
  { id: 'module-9', moduleId: 'binary-search-sorting', title: 'Module 9: Binary Search & Sorting', shortTitle: 'Search', icon: '🔍', nextModuleId: 'module-10' },
  { id: 'module-10', moduleId: 'graphs-bfs-dfs', title: 'Module 10: Graphs & BFS/DFS', shortTitle: 'Graphs', icon: '🕸️', nextModuleId: 'module-11' },
  { id: 'module-11', moduleId: 'union-find-disjoint-set', title: 'Module 11: Union-Find (Disjoint Set)', shortTitle: 'Union-Find', icon: '🤝', nextModuleId: 'module-12' },

  // Advanced algorithms
  { id: 'module-12', moduleId: 'backtracking-decision-trees', title: 'Module 12: Backtracking & Decision Trees', shortTitle: 'Backtrack', icon: '↩️', nextModuleId: 'module-13' },
  { id: 'module-13', moduleId: 'dynamic-programming', title: 'Module 13: Dynamic Programming', shortTitle: 'DP', icon: '💎', nextModuleId: 'module-14' },
  { id: 'module-14', moduleId: 'heaps-priority-queues', title: 'Module 14: Heaps & Priority Queues', shortTitle: 'Heaps', icon: '📚', nextModuleId: 'module-15' },
  { id: 'module-15', moduleId: 'tries-string-patterns', title: 'Module 15: Tries & Advanced String Patterns', shortTitle: 'Tries', icon: '🔤', nextModuleId: 'module-16' },

  // advanced-topics-mastery (module-16) removed - exercises moved to topic modules

  // Bit Manipulation (specialized topic)
  { id: 'module-16', moduleId: 'bit-manipulation-math', title: 'Module 16: Bit Manipulation & Math', shortTitle: 'Bits', icon: '🔢', nextModuleId: undefined },

  // Smart Practice (always unlocked, separate from main chain)
  { id: 'smart-practice', moduleId: 'smart-practice', title: 'Smart Practice', shortTitle: 'Practice', icon: '🎯', nextModuleId: undefined },
];

/**
 * Check if dev mode is enabled (via URL param ?dev=true or ?unlockAll=true)
 */
function isDevMode(): boolean {
  if (typeof window !== 'undefined' && (window as any).__DSA_DEV_MODE__) {
    return true;
  }
  return false;
}

/**
 * Check if a module is unlocked based on DAG prerequisites
 * A module is unlocked when ALL its prerequisites are completed.
 */
export function isModuleUnlocked(
  moduleId: string,
  completedModules: string[]
): boolean {
  // In open access mode or dev mode, everything is unlocked
  if (ACCESS_MODE === 'open' || isDevMode()) return true;

  // Get prerequisites for this module
  const prerequisites = MODULE_PREREQUISITES[moduleId];

  // If no prerequisites defined, fall back to checking if it's in MODULE_CHAIN
  if (prerequisites === undefined) {
    // Module not in DAG - check if it's first module or unknown
    const moduleIndex = MODULE_CHAIN.findIndex(m => m.moduleId === moduleId);
    if (moduleIndex <= 0) return true;
    // Fall back to sequential check for unknown modules
    const previousModule = MODULE_CHAIN[moduleIndex - 1];
    return completedModules.includes(previousModule.moduleId) ||
           completedModules.includes(previousModule.id);
  }

  // Empty prerequisites = always unlocked
  if (prerequisites.length === 0) return true;

  // All prerequisites must be completed
  return prerequisites.every(prereqId =>
    completedModules.includes(prereqId)
  );
}

/**
 * Get the list of missing prerequisites for a module
 */
export function getMissingPrerequisites(
  moduleId: string,
  completedModules: string[]
): string[] {
  const prerequisites = MODULE_PREREQUISITES[moduleId];
  if (!prerequisites || prerequisites.length === 0) return [];

  return prerequisites.filter(prereqId =>
    !completedModules.includes(prereqId)
  );
}

/**
 * Get count of missing prerequisites (for "almost unlocked" feature)
 */
export function getMissingPrerequisiteCount(
  moduleId: string,
  completedModules: string[]
): number {
  return getMissingPrerequisites(moduleId, completedModules).length;
}

/**
 * Check if a module is "almost unlocked" (only 1 prerequisite remaining)
 */
export function isAlmostUnlocked(
  moduleId: string,
  completedModules: string[]
): boolean {
  return getMissingPrerequisiteCount(moduleId, completedModules) === 1;
}

/**
 * Get all modules that would become unlocked when a module is completed
 */
export function getNewlyUnlockedModules(
  completedModuleId: string,
  completedModules: string[]
): string[] {
  const newCompletedList = [...completedModules, completedModuleId];
  const newlyUnlocked: string[] = [];

  for (const moduleId of Object.keys(MODULE_PREREQUISITES)) {
    // Skip if already unlocked
    if (isModuleUnlocked(moduleId, completedModules)) continue;

    // Check if now unlocked
    if (isModuleUnlocked(moduleId, newCompletedList)) {
      newlyUnlocked.push(moduleId);
    }
  }

  return newlyUnlocked;
}

/**
 * Get prerequisite module names for display in UI
 */
export function getPrerequisiteNames(moduleId: string): string[] {
  const prereqs = MODULE_PREREQUISITES[moduleId] || [];
  return prereqs.map(prereqId => {
    const moduleInfo = MODULE_CHAIN.find(m => m.moduleId === prereqId);
    return moduleInfo?.shortTitle || prereqId;
  });
}

/**
 * Get missing prerequisite names for display in UI
 */
export function getMissingPrerequisiteNames(
  moduleId: string,
  completedModules: string[]
): string[] {
  const missingIds = getMissingPrerequisites(moduleId, completedModules);
  return missingIds.map(prereqId => {
    const moduleInfo = MODULE_CHAIN.find(m => m.moduleId === prereqId);
    return moduleInfo?.shortTitle || prereqId;
  });
}

/**
 * Get the index of a module in the chain
 */
export function getModuleChainIndex(moduleId: string): number {
  return MODULE_CHAIN.findIndex(m => m.moduleId === moduleId || m.id === moduleId);
}

/**
 * Get module info by moduleId (the ID used in progressiveLessonsMap)
 */
export function getModuleInfoByModuleId(moduleId: string): ModuleInfo | undefined {
  return MODULE_CHAIN.find(m => m.moduleId === moduleId);
}

/**
 * Get module info by UI id (e.g., 'module-9')
 */
export function getModuleInfoById(id: string): ModuleInfo | undefined {
  return MODULE_CHAIN.find(m => m.id === id);
}

/**
 * Get the next module in the chain
 */
export function getNextModule(currentModuleId: string): ModuleInfo | undefined {
  const current = getModuleInfoByModuleId(currentModuleId);
  if (!current || !current.nextModuleId) return undefined;
  return getModuleInfoById(current.nextModuleId);
}

/**
 * Check if a module is complete
 * This is the CENTRALIZED logic - fix bugs here, use everywhere!
 */
export interface ModuleCompletionCheck {
  isComplete: boolean;
  progress: number; // 0-100
  reason?: string; // Why it's not complete (for debugging)
}

export function checkModuleCompletion(
  moduleId: string,
  progressiveLessonProgress?: Map<string, any>, // Map of lessonId -> ProgressiveLessonProgress
  module15CompletedItems?: Set<string> // For Module 15 specifically
): ModuleCompletionCheck {
  const moduleInfo = getModuleInfoByModuleId(moduleId);
  if (!moduleInfo) {
    return { isComplete: false, progress: 0, reason: 'Module not found' };
  }

  // Special handling for unified journey modules
  // Note: advanced-topics-mastery has been removed
  if (moduleInfo.id === 'module-15') {
    // Module 15 completion logic
    if (!module15CompletedItems) {
      return { isComplete: false, progress: 0, reason: 'Module 15 progress not available' };
    }
    
    // Check if all required items are completed
    // This is a simplified check - you may need to adjust based on your Module 15 structure
    const totalItems = 13; // Adjust based on your actual Module 15 structure
    const completedCount = module15CompletedItems.size;
    const progress = (completedCount / totalItems) * 100;
    const isComplete = progress >= 100;
    
    return { 
      isComplete, 
      progress, 
      reason: isComplete ? undefined : `${completedCount}/${totalItems} items completed` 
    };
  }

  // For progressive lessons, check if all sections are completed
  if (progressiveLessonProgress) {
    const progress = progressiveLessonProgress.get(moduleId);
    if (!progress) {
      return { isComplete: false, progress: 0, reason: 'No progress found' };
    }

    const sectionsProgress = progress.sectionsProgress;
    if (!sectionsProgress || sectionsProgress.size === 0) {
      return { isComplete: false, progress: 0, reason: 'No sections found' };
    }

    // Count completed sections
    let completedCount = 0;
    let totalSections = 0;
    
    sectionsProgress.forEach((sectionProgress: any) => {
      totalSections++;
      if (sectionProgress.status === 'completed') {
        completedCount++;
      }
    });

    const progressPercent = totalSections > 0 ? (completedCount / totalSections) * 100 : 0;
    const isComplete = totalSections > 0 && completedCount === totalSections;

    return {
      isComplete,
      progress: progressPercent,
      reason: isComplete ? undefined : `${completedCount}/${totalSections} sections completed`
    };
  }

  return { isComplete: false, progress: 0, reason: 'No progress data available' };
}

/**
 * Unlock the next module when current module completes
 * This is the CENTRALIZED unlocking logic - fix bugs here, use everywhere!
 */
export interface UnlockResult {
  success: boolean;
  nextModuleId?: string;
  nextModuleInfo?: ModuleInfo;
  error?: string;
}

export function unlockNextModule(
  completedModuleId: string,
  setProgressiveLessonProgress?: (updater: (prev: any) => any) => void,
  setModule15CompletedItems?: (updater: (prev: Set<string>) => Set<string>) => void
): UnlockResult {
  const nextModule = getNextModule(completedModuleId);
  
  if (!nextModule) {
    return {
      success: false,
      error: 'No next module found (this is the last module)'
    };
  }

  // Unlock the next module
  if (setProgressiveLessonProgress && nextModule.moduleId) {
    setProgressiveLessonProgress((prev: any) => {
      const newProgress = { ...prev };
      
      // Initialize progress for next module if it doesn't exist
      if (!newProgress.has(nextModule.moduleId)) {
        // Get the lesson from progressiveLessonsMap to find first section
        // This would need to be passed in or accessed differently
        // For now, we'll create a basic structure
        newProgress.set(nextModule.moduleId, {
          lessonId: nextModule.moduleId,
          currentSectionIndex: 0,
          sectionsProgress: new Map(),
          overallProgress: 0,
          startedAt: new Date(),
          lastActivityAt: new Date(),
          totalTimeSpent: 0
        });
      }

      // Unlock the first section
      const nextModuleProgress = newProgress.get(nextModule.moduleId);
      if (nextModuleProgress) {
        // Find first section ID (this would need to come from the lesson data)
        // For now, we'll mark it as unlocked in the progress structure
        // The actual section unlocking should happen when the module is opened
        nextModuleProgress.sectionsProgress = nextModuleProgress.sectionsProgress || new Map();
      }

      return newProgress;
    });
  }

  return {
    success: true,
    nextModuleId: nextModule.moduleId,
    nextModuleInfo: nextModule
  };
}

/**
 * Hook to automatically unlock next module when current completes
 * Use this in your components to handle module chaining
 */
export function useModuleChaining(
  currentModuleId: string,
  progressiveLessonProgress?: Map<string, any>,
  module15CompletedItems?: Set<string>,
  setProgressiveLessonProgress?: (updater: (prev: any) => any) => void,
  setModule15CompletedItems?: (updater: (prev: Set<string>) => Set<string>) => void
) {
  // Check if current module is complete
  const completion = checkModuleCompletion(
    currentModuleId,
    progressiveLessonProgress,
    module15CompletedItems
  );

  // Auto-unlock next module when current completes
  const handleModuleComplete = () => {
    if (completion.isComplete) {
      const result = unlockNextModule(
        currentModuleId,
        setProgressiveLessonProgress,
        setModule15CompletedItems
      );
      
      if (result.success && result.nextModuleInfo) {
        // Module completed, next module unlocked
      }
    }
  };

  return {
    isComplete: completion.isComplete,
    progress: completion.progress,
    reason: completion.reason,
    nextModule: getNextModule(currentModuleId),
    handleModuleComplete
  };
}

