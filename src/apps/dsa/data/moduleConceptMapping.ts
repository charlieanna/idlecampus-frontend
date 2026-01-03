/**
 * Module → Concept Mapping
 *
 * Maps each module to the concepts and patterns it teaches.
 * Used by Smart Practice to:
 * 1. Gate problems based on completed modules
 * 2. Initialize concept scores when modules complete
 * 3. Show "Learn First" UI for locked concepts
 */

export interface ModuleConceptInfo {
  moduleId: string;
  title: string;
  shortTitle: string;
  concepts: string[];
  patterns: string[];
  techniques: string[];
}

/**
 * Comprehensive mapping of modules to their taught concepts
 * Practice exercises reference these module IDs as prerequisites
 */
export const MODULE_CONCEPT_MAP: Record<string, ModuleConceptInfo> = {
  // Python Basics (Module 0)
  'python-basics-fundamentals': {
    moduleId: 'python-basics-fundamentals',
    title: 'Python Basics',
    shortTitle: 'Python',
    concepts: ['lists', 'strings', 'dicts', 'sets', 'loops', 'tuples', 'recursion-basics', 'collections'],
    patterns: ['python-basics'],
    techniques: ['python-fundamentals', 'list-operations', 'dict-operations', 'string-operations']
  },

  // Time Complexity (Module 1)
  'time-complexity-foundations': {
    moduleId: 'time-complexity-foundations',
    title: 'Time Complexity Foundations',
    shortTitle: 'Complexity',
    concepts: ['big-o', 'time-complexity', 'space-complexity'],
    patterns: ['complexity-analysis'],
    techniques: ['complexity-analysis']
  },

  // Arrays (Module 2)
  'array-iteration-techniques': {
    moduleId: 'array-iteration-techniques',
    title: 'Array Iteration Techniques',
    shortTitle: 'Arrays',
    concepts: ['arrays', 'two-pointers', 'sliding-window', 'array-partitioning'],
    patterns: ['two-pointers', 'sliding-window', 'fast-slow-pointers'],
    techniques: ['two-pointers-opposite', 'two-pointers-same-direction', 'sliding-window-fixed', 'sliding-window-variable']
  },

  // Hash Maps (Module 3)
  'hash-map-fundamentals': {
    moduleId: 'hash-map-fundamentals',
    title: 'Hash Map Fundamentals',
    shortTitle: 'Hash Maps',
    concepts: ['hash-maps', 'frequency-counting', 'two-sum-pattern', 'grouping'],
    patterns: ['hash-map', 'frequency-count'],
    techniques: ['hash-map-lookup', 'frequency-counting', 'value-to-index-mapping']
  },

  // Python OOP (Module 5)
  'python-oop-libraries': {
    moduleId: 'python-oop-libraries',
    title: 'Python OOP & Libraries',
    shortTitle: 'OOP',
    concepts: ['classes', 'objects', 'inheritance', 'heapq', 'bisect', 'itertools'],
    patterns: ['object-oriented'],
    techniques: ['class-design', 'python-libraries']
  },

  // Linked Lists (Module 6)
  'linked-list-mastery': {
    moduleId: 'linked-list-mastery',
    title: 'Linked List Mastery',
    shortTitle: 'Linked Lists',
    concepts: ['linked-lists', 'dummy-node', 'fast-slow-pointers', 'list-reversal'],
    patterns: ['linked-list', 'fast-slow-pointers'],
    techniques: ['dummy-node', 'runner-technique', 'in-place-reversal']
  },

  // Recursion & Trees Foundation (Module 7)
  'recursion-trees-foundation': {
    moduleId: 'recursion-trees-foundation',
    title: 'Recursion & Trees Foundation',
    shortTitle: 'Recursion',
    concepts: ['recursion', 'tree-recursion', 'call-stack', 'base-case'],
    patterns: ['recursion', 'divide-and-conquer'],
    techniques: ['recursive-thinking', 'memoization-intro']
  },

  // Trees & Traversals (Module 8)
  'trees-traversals': {
    moduleId: 'trees-traversals',
    title: 'Trees & Traversals',
    shortTitle: 'Trees',
    concepts: ['binary-trees', 'bst', 'dfs-traversal', 'bfs-traversal', 'tree-properties'],
    patterns: ['tree-dfs', 'tree-bfs', 'binary-search-tree'],
    techniques: ['inorder', 'preorder', 'postorder', 'level-order']
  },

  // Binary Search (Module 9)
  'binary-search-sorting': {
    moduleId: 'binary-search-sorting',
    title: 'Binary Search & Sorting',
    shortTitle: 'Search',
    concepts: ['binary-search', 'search-space', 'sorting'],
    patterns: ['binary-search', 'binary-search-on-answer'],
    techniques: ['binary-search-classic', 'left-bound', 'right-bound', 'search-space-reduction']
  },

  // Graphs (Module 10)
  'graphs-bfs-dfs': {
    moduleId: 'graphs-bfs-dfs',
    title: 'Graphs & BFS/DFS',
    shortTitle: 'Graphs',
    concepts: ['graphs', 'graph-traversal', 'cycle-detection', 'topological-sort', 'shortest-path'],
    patterns: ['graph-dfs', 'graph-bfs', 'topological-sort'],
    techniques: ['adjacency-list', 'visited-set', 'bfs-shortest-path', 'dfs-cycle-detection']
  },

  // Union-Find (Module 11)
  'union-find-disjoint-set': {
    moduleId: 'union-find-disjoint-set',
    title: 'Union-Find (Disjoint Set)',
    shortTitle: 'Union-Find',
    concepts: ['union-find', 'connected-components', 'disjoint-set'],
    patterns: ['union-find'],
    techniques: ['path-compression', 'union-by-rank']
  },

  // Backtracking (Module 12)
  'backtracking-decision-trees': {
    moduleId: 'backtracking-decision-trees',
    title: 'Backtracking & Decision Trees',
    shortTitle: 'Backtrack',
    concepts: ['backtracking', 'permutations', 'combinations', 'constraint-satisfaction'],
    patterns: ['backtracking', 'subset-generation'],
    techniques: ['backtracking-template', 'pruning', 'state-restoration']
  },

  // Dynamic Programming (Module 13)
  'dynamic-programming': {
    moduleId: 'dynamic-programming',
    title: 'Dynamic Programming',
    shortTitle: 'DP',
    concepts: ['dynamic-programming', 'memoization', '1d-dp', '2d-dp', 'state-machine-dp', 'knapsack'],
    patterns: ['dynamic-programming', 'memoization', 'tabulation'],
    techniques: ['top-down-dp', 'bottom-up-dp', 'state-optimization', 'knapsack-pattern']
  },

  // Heaps (Module 14)
  'heaps-priority-queues': {
    moduleId: 'heaps-priority-queues',
    title: 'Heaps & Priority Queues',
    shortTitle: 'Heaps',
    concepts: ['heaps', 'priority-queue', 'top-k', 'merge-k-sorted'],
    patterns: ['top-k', 'two-heaps', 'merge-k-sorted'],
    techniques: ['min-heap', 'max-heap', 'k-way-merge']
  },

  // Tries (Module 15)
  'tries-string-patterns': {
    moduleId: 'tries-string-patterns',
    title: 'Tries & String Patterns',
    shortTitle: 'Tries',
    concepts: ['tries', 'prefix-tree', 'autocomplete', 'word-search'],
    patterns: ['trie', 'prefix-matching'],
    techniques: ['trie-insert', 'trie-search', 'trie-prefix']
  },

  // advanced-topics-mastery removed - exercises moved to topic modules

  // Bit Manipulation (Module 16)
  'bit-manipulation-math': {
    moduleId: 'bit-manipulation-math',
    title: 'Bit Manipulation & Math',
    shortTitle: 'Bits',
    concepts: ['bit-manipulation', 'xor', 'bitwise-operations', 'math-tricks'],
    patterns: ['bit-manipulation', 'xor-pattern'],
    techniques: ['bit-masking', 'xor-properties', 'power-of-two']
  },

  // Concurrency (Module 17)
  'concurrency-threading': {
    moduleId: 'concurrency-threading',
    title: 'Concurrency & Threading',
    shortTitle: 'Concurrency',
    concepts: ['threading', 'locks', 'synchronization', 'parallelism'],
    patterns: ['producer-consumer', 'thread-pool'],
    techniques: ['mutex', 'semaphore', 'atomic-operations']
  },

  // System Design (Module 18)
  'system-design-patterns': {
    moduleId: 'system-design-patterns',
    title: 'System Design Patterns',
    shortTitle: 'SysDesign',
    concepts: ['scalability', 'consistency', 'availability', 'partitioning'],
    patterns: ['sharding', 'replication', 'load-balancing'],
    techniques: ['caching', 'rate-limiting', 'consistent-hashing']
  },

  // OOD (Module 19)
  'ood-patterns': {
    moduleId: 'ood-patterns',
    title: 'Object-Oriented Design Patterns',
    shortTitle: 'OOD',
    concepts: ['design-patterns', 'solid-principles', 'uml'],
    patterns: ['factory', 'observer', 'singleton', 'strategy'],
    techniques: ['encapsulation', 'inheritance', 'polymorphism']
  },

  // Async (Module 20)
  'async-patterns': {
    moduleId: 'async-patterns',
    title: 'Asynchronous Programming Patterns',
    shortTitle: 'Async',
    concepts: ['async-await', 'promises', 'event-loop', 'callbacks'],
    patterns: ['worker-pools', 'event-driven'],
    techniques: ['non-blocking-io', 'concurrent-execution']
  }
};

/**
 * Module order for curriculum progression (used for prerequisite depth calculation)
 * Lower index = more foundational, higher index = more advanced
 */
export const MODULE_ORDER: string[] = [
  'python-basics-fundamentals',      // 0 - Most foundational
  'time-complexity-foundations',     // 1
  'array-iteration-techniques',      // 2
  'hash-map-fundamentals',           // 3
  'python-oop-libraries',            // 4
  'linked-list-mastery',             // 6
  'recursion-trees-foundation',      // 7
  'trees-traversals',                // 8
  'binary-search-sorting',           // 9
  'graphs-bfs-dfs',                  // 10
  'union-find-disjoint-set',         // 11
  'backtracking-decision-trees',     // 12
  'dynamic-programming',             // 13
  'heaps-priority-queues',           // 14
  'tries-string-patterns',           // 15
  'bit-manipulation-math',           // 16
  'concurrency-threading',           // 17
  'system-design-patterns',          // 18
  'ood-patterns',                    // 19
  'async-patterns',                  // 20 - Most advanced
];

/**
 * Get the prerequisite depth of a problem based on its required modules
 * Higher depth = more prerequisites = more advanced problem
 * Used for intelligent problem selection in Smart Practice
 */
export function getPrerequisiteDepth(prereqs: string[] | undefined): number {
  if (!prereqs || prereqs.length === 0) return 0;

  const indices = prereqs
    .map(p => MODULE_ORDER.indexOf(p))
    .filter(i => i >= 0);

  // Return the highest module index + 1 (so depth 0 = no prereqs)
  return indices.length > 0 ? Math.max(...indices) + 1 : 0;
}

/**
 * Get the module index in the curriculum order
 * Returns -1 if module not found
 */
export function getModuleIndex(moduleId: string): number {
  return MODULE_ORDER.indexOf(moduleId);
}

/**
 * Get all concepts available based on completed modules
 */
export function getAvailableConcepts(completedModules: string[]): Set<string> {
  const concepts = new Set<string>();

  for (const moduleId of completedModules) {
    const moduleInfo = MODULE_CONCEPT_MAP[moduleId];
    if (moduleInfo) {
      moduleInfo.concepts.forEach(c => concepts.add(c));
      moduleInfo.patterns.forEach(p => concepts.add(p));
      moduleInfo.techniques.forEach(t => concepts.add(t));
    }
  }

  return concepts;
}

/**
 * Get all patterns available based on completed modules
 */
export function getAvailablePatterns(completedModules: string[]): string[] {
  const patterns = new Set<string>();

  for (const moduleId of completedModules) {
    const moduleInfo = MODULE_CONCEPT_MAP[moduleId];
    if (moduleInfo) {
      moduleInfo.patterns.forEach(p => patterns.add(p));
    }
  }

  return Array.from(patterns);
}

/**
 * Check if a problem's prerequisites are satisfied
 */
export function arePrerequisitesMet(
  problemPrerequisites: string[] | undefined,
  completedModules: string[]
): boolean {
  if (!problemPrerequisites || problemPrerequisites.length === 0) {
    return true; // No prerequisites = always available
  }

  return problemPrerequisites.every(prereq => completedModules.includes(prereq));
}

/**
 * Get list of modules needed to unlock a problem
 */
export function getMissingPrerequisites(
  problemPrerequisites: string[] | undefined,
  completedModules: string[]
): string[] {
  if (!problemPrerequisites || problemPrerequisites.length === 0) {
    return [];
  }

  return problemPrerequisites.filter(prereq => !completedModules.includes(prereq));
}

/**
 * Get module info by moduleId
 */
export function getModuleInfo(moduleId: string): ModuleConceptInfo | undefined {
  return MODULE_CONCEPT_MAP[moduleId];
}

/**
 * Get all module IDs in order
 */
export function getAllModuleIds(): string[] {
  return Object.keys(MODULE_CONCEPT_MAP);
}
