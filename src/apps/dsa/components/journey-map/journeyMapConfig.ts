/**
 * Journey Map Configuration
 *
 * Defines the visual layout and connections for the 17 modules
 * in the DSA Mastery Journey.
 */

export interface JourneyNodeConfig {
  id: string;
  moduleId: string;
  title: string;
  shortTitle: string;
  icon: string;
  position: 'left' | 'right';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

/**
 * The complete journey path through all 17 modules
 * PYTHON IS FIRST - Gateway to the entire course!
 * Arranged in a serpentine pattern (left → right → left → right...)
 */
export const JOURNEY_NODES: JourneyNodeConfig[] = [
  // PYTHON FIRST - Gateway to the course (always unlocked)
  {
    id: 'module-0a',
    moduleId: 'python-mechanics',
    title: 'Module 0A: Python Mechanics',
    shortTitle: 'Mechanics',
    icon: '🐍',
    position: 'left',
    difficulty: 'beginner',
  },
  {
    id: 'module-0b',
    moduleId: 'python-algorithmic-thinking',
    title: 'Module 0B: Python Algorithmics',
    shortTitle: 'Algorithms',
    icon: '🧩',
    position: 'right',
    difficulty: 'beginner',
  },

  // Foundation Phase (Beginner)
  {
    id: 'module-1',
    moduleId: 'time-complexity-foundations',
    title: 'Module 1: Time Complexity',
    shortTitle: 'Complexity',
    icon: '⏱️',
    position: 'right',
    difficulty: 'beginner',
  },
  {
    id: 'module-2',
    moduleId: 'array-iteration-techniques',
    title: 'Module 2: Array Iteration',
    shortTitle: 'Arrays',
    icon: '📊',
    position: 'left',
    difficulty: 'beginner',
  },
  {
    id: 'module-3',
    moduleId: 'hash-map-fundamentals',
    title: 'Module 3: Hash Maps',
    shortTitle: 'Hash Maps',
    icon: '🗺️',
    position: 'right',
    difficulty: 'beginner',
  },

  // Building Phase (Intermediate)
  {
    id: 'module-sliding-window',
    moduleId: 'sliding-window-mastery',
    title: 'Sliding Window Mastery',
    shortTitle: 'Sliding Window',
    icon: '🪟',
    position: 'right',
    difficulty: 'intermediate',
  },
  {
    id: 'module-prefix-suffix',
    moduleId: 'prefix-suffix-arrays',
    title: 'Prefix & Suffix Arrays',
    shortTitle: 'Prefix/Suffix',
    icon: '↔️',
    position: 'left',
    difficulty: 'intermediate',
  },
  {
    id: 'module-stack',
    moduleId: 'stack-discovery-lifo',
    title: 'Stack Discovery (LIFO)',
    shortTitle: 'Stacks',
    icon: '📚',
    position: 'right',
    difficulty: 'intermediate',
  },
  {
    id: 'module-queue',
    moduleId: 'queue-discovery-fifo',
    title: 'Queue Discovery (FIFO)',
    shortTitle: 'Queues',
    icon: '🚶',
    position: 'left',
    difficulty: 'intermediate',
  },
  {
    id: 'module-intervals',
    moduleId: 'intervals-mastery',
    title: 'Module: Intervals',
    shortTitle: 'Intervals',
    icon: '📅',
    position: 'right',
    difficulty: 'intermediate',
  },
  {
    id: 'module-5',
    moduleId: 'python-oop-libraries',
    title: 'Module 5: Python OOP',
    shortTitle: 'OOP',
    icon: '🏭',
    position: 'left',
    difficulty: 'intermediate',
  },
  {
    id: 'module-6',
    moduleId: 'linked-list-mastery',
    title: 'Module 6: Linked Lists',
    shortTitle: 'Linked Lists',
    icon: '🔗',
    position: 'left',
    difficulty: 'intermediate',
  },
  {
    id: 'module-7',
    moduleId: 'recursion-trees-foundation',
    title: 'Module 7: Recursion',
    shortTitle: 'Recursion',
    icon: '🔄',
    position: 'right',
    difficulty: 'intermediate',
  },
  {
    id: 'module-8',
    moduleId: 'trees-traversals',
    title: 'Module 8: Trees',
    shortTitle: 'Trees',
    icon: '🌲',
    position: 'left',
    difficulty: 'intermediate',
  },
  {
    id: 'module-9',
    moduleId: 'binary-search-sorting',
    title: 'Module 9: Binary Search',
    shortTitle: 'Search',
    icon: '🔍',
    position: 'right',
    difficulty: 'intermediate',
  },

  // Advanced Phase
  {
    id: 'module-10',
    moduleId: 'graphs-bfs-dfs',
    title: 'Module 10: Graphs',
    shortTitle: 'Graphs',
    icon: '🕸️',
    position: 'left',
    difficulty: 'advanced',
  },
  {
    id: 'module-11',
    moduleId: 'union-find-disjoint-set',
    title: 'Module 11: Union-Find',
    shortTitle: 'Union-Find',
    icon: '🤝',
    position: 'right',
    difficulty: 'advanced',
  },
  {
    id: 'module-12',
    moduleId: 'backtracking-decision-trees',
    title: 'Module 12: Backtracking',
    shortTitle: 'Backtrack',
    icon: '↩️',
    position: 'left',
    difficulty: 'advanced',
  },
  {
    id: 'module-13',
    moduleId: 'dynamic-programming',
    title: 'Module 13: Dynamic Programming',
    shortTitle: 'DP',
    icon: '💎',
    position: 'right',
    difficulty: 'advanced',
  },
  {
    id: 'module-concurrency',
    moduleId: 'concurrency-threading',
    title: 'Concurrency & Threading',
    shortTitle: 'Concurrency',
    icon: '🔄',
    position: 'left',
    difficulty: 'advanced',
  },

  // Expert Phase
  {
    id: 'module-14',
    moduleId: 'heaps-priority-queues',
    title: 'Module 14: Heaps',
    shortTitle: 'Heaps',
    icon: '📚',
    position: 'left',
    difficulty: 'advanced',
  },
  {
    id: 'module-15',
    moduleId: 'tries-string-patterns',
    title: 'Module 15: Tries',
    shortTitle: 'Tries',
    icon: '🔤',
    position: 'right',
    difficulty: 'expert',
  },
  // advanced-topics-mastery (module-16) removed - exercises moved to topic modules
  {
    id: 'module-16',
    moduleId: 'bit-manipulation-math',
    title: 'Module 16: Bit Manipulation',
    shortTitle: 'Bits',
    icon: '🔢',
    position: 'left',
    difficulty: 'expert',
  },

  // Smart Practice - Always available
  {
    id: 'smart-practice',
    moduleId: 'smart-practice',
    title: 'Smart Practice',
    shortTitle: 'Practice',
    icon: '🎯',
    position: 'left',
    difficulty: 'intermediate',
  },
];

/**
 * Difficulty phase labels and colors
 */
export const DIFFICULTY_PHASES = {
  beginner: {
    label: 'Foundation',
    color: 'from-green-400 to-emerald-500',
    // Keep phase identity mostly in the small gradient dot; keep labels/borders neutral for a cleaner UI.
    bgColor: 'bg-transparent',
    textColor: 'text-slate-700 dark:text-slate-200',
    borderColor: 'border-slate-200 dark:border-slate-700',
  },
  intermediate: {
    label: 'Building Skills',
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-transparent',
    textColor: 'text-slate-700 dark:text-slate-200',
    borderColor: 'border-slate-200 dark:border-slate-700',
  },
  advanced: {
    label: 'Advanced',
    color: 'from-purple-400 to-violet-500',
    bgColor: 'bg-transparent',
    textColor: 'text-slate-700 dark:text-slate-200',
    borderColor: 'border-slate-200 dark:border-slate-700',
  },
  expert: {
    label: 'Expert',
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-transparent',
    textColor: 'text-slate-700 dark:text-slate-200',
    borderColor: 'border-slate-200 dark:border-slate-700',
  },
};

/**
 * Get the next module in the journey
 */
export function getNextNode(currentId: string): JourneyNodeConfig | undefined {
  const currentIndex = JOURNEY_NODES.findIndex(n => n.id === currentId);
  if (currentIndex === -1 || currentIndex >= JOURNEY_NODES.length - 1) {
    return undefined;
  }
  return JOURNEY_NODES[currentIndex + 1];
}

/**
 * Get the previous module in the journey
 */
export function getPreviousNode(currentId: string): JourneyNodeConfig | undefined {
  const currentIndex = JOURNEY_NODES.findIndex(n => n.id === currentId);
  if (currentIndex <= 0) {
    return undefined;
  }
  return JOURNEY_NODES[currentIndex - 1];
}

/**
 * Find node by moduleId
 */
export function getNodeByModuleId(moduleId: string): JourneyNodeConfig | undefined {
  return JOURNEY_NODES.find(n => n.moduleId === moduleId);
}
