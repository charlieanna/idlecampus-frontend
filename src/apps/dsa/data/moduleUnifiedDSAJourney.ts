/**
 * Module 15: Unified DSA Journey
 * A single, linear path through all DSA content (Modules 0.5 - 13)
 * Total: ~500+ items including lessons, exercises, quizzes, and problems
 */

import type {
  ReadingSection,
  ExerciseSection,
  QuizSection,
  CheckpointSection
} from '../types/progressive-lesson-enhanced';
import { module15CompleteContent } from './moduleContentBuilder';

// ============= Type Definitions =============

export interface UnifiedContentItem {
  // Core identifiers
  id: string;
  type: 'reading' | 'exercise' | 'quiz' | 'problem' | 'lesson' | 'checkpoint' | 'transition' | 'milestone';
  title: string;
  description?: string;

  // Source tracking
  originalModule: number;  // 0.5, 1, 2, 3, etc.
  originalModuleName: string;
  originalFamily?: string; // Problem family/concept grouping

  // Content (varies by type)
  content?: any; // The actual content: reading text, problem details, etc.

  // Navigation & Progress
  sequenceNumber: number;  // Global order (0-based index)
  estimatedTime?: number;  // In minutes
  requiredForProgress?: boolean; // Must complete to continue

  // Metadata
  difficulty?: 'easy' | 'medium' | 'hard';
  concepts?: string[];     // For future smart practice integration
  tags?: string[];         // Additional categorization
}

export interface Module15Progress {
  currentIndex: number;
  completedItems: Set<string>; // Item IDs
  totalTimeSpent: number; // In seconds
  lastAccessDate: Date;
  startDate?: Date;

  // Milestone tracking
  milestones: {
    pythonBasics: boolean;    // Module 0.5 complete
    arrays: boolean;          // Modules 1-4 complete
    dataStructures: boolean;  // Modules 5-6 complete
    algorithms: boolean;      // Modules 7-8 complete
    advanced: boolean;        // Modules 9-13 complete
  };

  // Session tracking
  currentSessionTime: number;
  sessionsCount: number;
  averageSessionLength: number;
}

export interface Module15Config {
  id: string;
  title: string;
  description: string;
  totalItems: number;
  estimatedTotalTime: number; // In hours
  items: UnifiedContentItem[];
}

// ============= Content Aggregation =============

// Module structure mapping
// Note: Modules renumbered - Module 3 is now Array+HashMap (was 4), Module 4 is Python OOP (was 4.5)
// Bit Manipulation moved to Module 16 (outside this unified journey scope)
const MODULE_INFO: Record<number, { name: string; itemCount: number; concepts: string[] }> = {
  0.5: { name: 'Python Basics', itemCount: 13, concepts: ['python-fundamentals', 'control-flow', 'collections'] },
  1: { name: 'Array Iteration', itemCount: 12, concepts: ['two-pointers', 'sliding-window', 'array-partitioning'] },
  2: { name: 'Hash Maps', itemCount: 9, concepts: ['hash-map', 'frequency-counting', 'two-sum'] },
  3: { name: 'Array + Hash Map', itemCount: 11, concepts: ['sliding-window-hashmap', 'two-pointers-hashmap'] },
  4: { name: 'Python OOP', itemCount: 6, concepts: ['classes', 'oop', 'advanced-collections'] },
  5: { name: 'Linked Lists', itemCount: 10, concepts: ['linked-list', 'dummy-node', 'reversal'] },
  6: { name: 'Trees', itemCount: 15, concepts: ['tree-traversal', 'bst', 'tree-recursion'] },
  7: { name: 'Binary Search', itemCount: 14, concepts: ['binary-search', 'search-space', 'sorting'] },
  8: { name: 'Graphs', itemCount: 16, concepts: ['graph', 'bfs', 'dfs', 'shortest-path'] },
  9: { name: 'Union Find', itemCount: 6, concepts: ['union-find', 'disjoint-sets'] },
  10: { name: 'Dynamic Programming', itemCount: 15, concepts: ['dp', 'memoization', 'bottom-up'] },
  11: { name: 'Heaps', itemCount: 12, concepts: ['heap', 'priority-queue', 'k-problems'] },
  12: { name: 'Backtracking', itemCount: 14, concepts: ['backtracking', 'recursion', 'combinations'] },
  13: { name: 'Tries', itemCount: 8, concepts: ['trie', 'prefix-tree', 'string-patterns'] },
  14: { name: 'Advanced Topics', itemCount: 7, concepts: ['segment-tree', 'advanced-patterns'] },
  15: { name: 'Advanced Topics', itemCount: 7, concepts: ['segment-tree', 'advanced-patterns'] },
  16: { name: 'Bit Manipulation', itemCount: 10, concepts: ['bitwise-operations', 'bit-tricks'] }
};

// ============= Transition Points =============

function createTransition(
  afterModule: number,
  nextModule: number,
  sequenceNumber: number
): UnifiedContentItem {
  const current = MODULE_INFO[afterModule];
  const next = MODULE_INFO[nextModule];

  return {
    id: `transition-${afterModule}-to-${nextModule}`,
    type: 'transition',
    title: `${current.name} Complete!`,
    description: `Great job completing ${current.name}! Next up: ${next.name}`,
    originalModule: afterModule,
    originalModuleName: current.name,
    sequenceNumber,
    estimatedTime: 1,
    content: {
      message: `You've mastered ${current.itemCount} items in ${current.name}!`,
      nextTopic: next.name,
      motivation: getMotivationalMessage(sequenceNumber)
    }
  };
}

function getMotivationalMessage(sequenceNumber: number): string {
  const progress = (sequenceNumber / 500) * 100;

  if (progress < 10) return "Great start! Keep going!";
  if (progress < 25) return "You're building strong foundations!";
  if (progress < 50) return "Halfway there! You're doing amazing!";
  if (progress < 75) return "You're in the advanced territory now!";
  if (progress < 90) return "Almost there! Final push!";
  return "You're a DSA master in the making!";
}

// ============= Milestone Celebrations =============

function createMilestone(
  percentage: number,
  sequenceNumber: number,
  title: string
): UnifiedContentItem {
  return {
    id: `milestone-${percentage}`,
    type: 'milestone',
    title: `🎉 ${percentage}% Complete!`,
    description: title,
    originalModule: 0,
    originalModuleName: 'Milestone',
    sequenceNumber,
    estimatedTime: 1,
    content: {
      percentage,
      itemsCompleted: sequenceNumber,
      message: getMilestoneMessage(percentage),
      achievement: getMilestoneAchievement(percentage)
    }
  };
}

function getMilestoneMessage(percentage: number): string {
  switch(percentage) {
    case 25: return "You've completed the foundations! Time to dive into data structures!";
    case 50: return "Halfway through your DSA journey! You're unstoppable!";
    case 75: return "You're in the final stretch! Advanced topics mastered!";
    case 100: return "🏆 CONGRATULATIONS! You've completed the entire DSA journey!";
    default: return "Keep going! You're doing great!";
  }
}

function getMilestoneAchievement(percentage: number): string {
  switch(percentage) {
    case 25: return "Foundation Builder";
    case 50: return "Data Structure Expert";
    case 75: return "Algorithm Master";
    case 100: return "DSA Champion";
    default: return "DSA Learner";
  }
}

// ============= Module 15 Data Builder =============

export function buildModule15Content(): UnifiedContentItem[] {
  // Use the real content built from all modules
  return module15CompleteContent;
}

// ============= Main Module 15 Configuration =============

const module15Items = buildModule15Content();

export const module15UnifiedDSAJourney: Module15Config = {
  id: 'module-15-unified-dsa',
  title: 'Complete DSA Mastery Path',
  description: 'Your complete journey from DSA basics to interview readiness - all in one linear path',
  totalItems: module15Items.length, // Actual count from built content
  estimatedTotalTime: Math.ceil(module15Items.reduce((total, item) => total + (item.estimatedTime || 15), 0) / 60), // hours
  items: module15Items
};

// ============= Helper Functions =============

export function getNextItem(
  progress: Module15Progress,
  items: UnifiedContentItem[]
): UnifiedContentItem | null {
  const nextIndex = progress.currentIndex + 1;
  if (nextIndex < items.length) {
    return items[nextIndex];
  }
  return null;
}

export function getPreviousItem(
  progress: Module15Progress,
  items: UnifiedContentItem[]
): UnifiedContentItem | null {
  const prevIndex = progress.currentIndex - 1;
  if (prevIndex >= 0) {
    return items[prevIndex];
  }
  return null;
}

export function calculateProgress(progress: Module15Progress, totalItems: number): number {
  return Math.round((progress.completedItems.size / totalItems) * 100);
}

export function estimateTimeRemaining(
  progress: Module15Progress,
  items: UnifiedContentItem[]
): number {
  const remainingItems = items.slice(progress.currentIndex + 1);
  return remainingItems.reduce((total, item) => total + (item.estimatedTime || 15), 0);
}

export function getModuleProgress(
  progress: Module15Progress,
  moduleId: number,
  items: UnifiedContentItem[]
): { completed: number; total: number; percentage: number } {
  const moduleItems = items.filter(item => item.originalModule === moduleId);
  const completedModuleItems = moduleItems.filter(item =>
    progress.completedItems.has(item.id)
  );

  return {
    completed: completedModuleItems.length,
    total: moduleItems.length,
    percentage: Math.round((completedModuleItems.length / moduleItems.length) * 100)
  };
}

// ============= Smart Practice Utilities =============

export interface ModuleStudyStatus {
  moduleId: number;
  name: string;
  concepts: string[];
  status: 'completed' | 'in-progress' | 'not-started';
  completedItems: number;
  totalItems: number;
  percentage: number;
}

export function getStudiedModules(
  completedItems: Set<string>,
  items: UnifiedContentItem[]
): ModuleStudyStatus[] {
  const moduleStatuses: ModuleStudyStatus[] = [];
  const processedModules = new Set<number>();

  // Get all unique modules from items
  items.forEach(item => {
    if (!processedModules.has(item.originalModule)) {
      processedModules.add(item.originalModule);
    }
  });

  // Sort modules by their typical order
  const sortedModules = Array.from(processedModules).sort((a, b) => a - b);

  sortedModules.forEach(moduleId => {
    const moduleItems = items.filter(i => i.originalModule === moduleId);
    const completedCount = moduleItems.filter(i => completedItems.has(i.id)).length;
    const totalCount = moduleItems.length;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    let status: 'completed' | 'in-progress' | 'not-started' = 'not-started';
    if (completedCount === totalCount && totalCount > 0) {
      status = 'completed';
    } else if (completedCount > 0) {
      status = 'in-progress';
    }

    const moduleInfo = MODULE_INFO[moduleId as keyof typeof MODULE_INFO];

    moduleStatuses.push({
      moduleId,
      name: moduleInfo?.name || `Module ${moduleId}`,
      concepts: moduleInfo?.concepts || [],
      status,
      completedItems: completedCount,
      totalItems: totalCount,
      percentage
    });
  });

  return moduleStatuses;
}

export function getCurrentModuleStatus(
  completedItems: Set<string>,
  items: UnifiedContentItem[]
): ModuleStudyStatus | null {
  const statuses = getStudiedModules(completedItems, items);
  return statuses.find(s => s.status === 'in-progress') || null;
}

export function getCompletedModules(
  completedItems: Set<string>,
  items: UnifiedContentItem[]
): ModuleStudyStatus[] {
  const statuses = getStudiedModules(completedItems, items);
  return statuses.filter(s => s.status === 'completed');
}

export function getRemainingModules(
  completedItems: Set<string>,
  items: UnifiedContentItem[]
): ModuleStudyStatus[] {
  const statuses = getStudiedModules(completedItems, items);
  return statuses.filter(s => s.status === 'not-started');
}

export function getProblemsForStudiedModules(
  completedItems: Set<string>,
  items: UnifiedContentItem[],
  selectedModules?: number[]
): UnifiedContentItem[] {
  // Show ALL problems from ALL modules - users can start solving without reading
  // Each question comes with its own lesson, so no prerequisite needed

  const statuses = getStudiedModules(completedItems, items);

  // Get all module IDs that have problems
  const allModuleIds = statuses.map(s => s.moduleId);

  // Filter to selected modules if provided, otherwise show all
  const targetModules = selectedModules && selectedModules.length > 0
    ? selectedModules
    : allModuleIds;


  // Get problems from target modules
  return items.filter(item =>
    (item.type === 'problem' || item.type === 'exercise' || item.type === 'quiz') &&
    targetModules.includes(item.originalModule)
  );
}

// ============= Progress Management =============

export function initializeProgress(): Module15Progress {
  return {
    currentIndex: 0,
    completedItems: new Set(),
    totalTimeSpent: 0,
    lastAccessDate: new Date(),
    startDate: new Date(),
    milestones: {
      pythonBasics: false,
      arrays: false,
      dataStructures: false,
      algorithms: false,
      advanced: false
    },
    currentSessionTime: 0,
    sessionsCount: 1,
    averageSessionLength: 0
  };
}

export function updateProgress(
  progress: Module15Progress,
  completedItemId: string,
  timeSpent: number
): Module15Progress {
  const updated = { ...progress };
  updated.completedItems.add(completedItemId);
  updated.currentIndex++;
  updated.totalTimeSpent += timeSpent;
  updated.currentSessionTime += timeSpent;
  updated.lastAccessDate = new Date();

  // Update milestone tracking based on completed modules
  // This will be refined when actual content is integrated

  return updated;
}

export default module15UnifiedDSAJourney;