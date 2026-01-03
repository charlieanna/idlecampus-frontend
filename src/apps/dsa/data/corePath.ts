/**
 * Core Path: ~120 Essential Problems for Interview Readiness
 *
 * This curated list covers all major patterns needed for technical interviews.
 * Complete these problems in order for optimal learning progression.
 *
 * Estimated time: 4-6 weeks at 3-4 problems per day
 */

export interface CorePathSection {
  id: string;
  title: string;
  description: string;
  exercises: string[]; // Exercise IDs
  estimatedHours: number;
}

export const corePath: CorePathSection[] = [
  // ============== WEEK 1: Foundations ==============
  {
    id: 'core-arrays-basics',
    title: '1. Arrays & Hashing Fundamentals',
    description: 'Master the most common interview patterns: frequency counting, two-pass algorithms, and hash-based lookups',
    exercises: [
      'exercise-two-sum',
      'exercise-valid-anagram',
      'exercise-group-anagrams',
      'exercise-product-except-self',
      'exercise-longest-consecutive',
      'exercise-subarray-sum-equals-k',
      'exercise-find-all-duplicates',
      'exercise-intersection-of-two-arrays',
    ],
    estimatedHours: 6,
  },
  {
    id: 'core-two-pointers',
    title: '2. Two Pointers',
    description: 'Essential technique for array manipulation and optimization',
    exercises: [
      'exercise-three-sum',
      'exercise-remove-duplicates-sorted',
      'exercise-move-zeroes',
      'exercise-sort-colors',
      'exercise-partition-array-by-parity',
      'exercise-boats-save-people',
    ],
    estimatedHours: 4,
  },
  {
    id: 'core-sliding-window',
    title: '3. Sliding Window',
    description: 'Fixed and variable window patterns for subarray/substring problems',
    exercises: [
      'exercise-max-sum-subarray',
      'exercise-longest-substring-no-repeat',
      'exercise-minimum-window-substring',
      'exercise-longest-repeating-character-replacement',
      'exercise-permutation-in-string',
      'exercise-find-all-anagrams',
      'exercise-max-consecutive-ones-iii',
      'exercise-fruit-into-baskets',
    ],
    estimatedHours: 6,
  },

  // ============== WEEK 2: Core Data Structures ==============
  {
    id: 'core-stack',
    title: '4. Stack',
    description: 'LIFO operations, monotonic stack, and expression evaluation',
    exercises: [
      'exercise-valid-parentheses',
      'exercise-min-stack',
      'exercise-daily-temperatures',
      'exercise-next-greater-element',
      'exercise-largest-rectangle-histogram',
      'exercise-evaluate-reverse-polish-notation',
      'exercise-remove-k-digits',
      'exercise-asteroid-collision',
    ],
    estimatedHours: 6,
  },
  {
    id: 'core-linked-list',
    title: '5. Linked List',
    description: 'Pointer manipulation, cycle detection, and list operations',
    exercises: [
      'exercise-reverse-list',
      'exercise-merge-sorted-lists',
      'exercise-detect-cycle',
      'exercise-find-cycle-start',
      'exercise-remove-nth-from-end',
      'exercise-reorder-list',
      'exercise-copy-random-list',
      'exercise-add-two-numbers',
    ],
    estimatedHours: 6,
  },
  {
    id: 'core-binary-search',
    title: '6. Binary Search',
    description: 'Classic binary search and its variations',
    exercises: [
      'exercise-binary-search',
      'exercise-first-last-position',
      'exercise-search-rotated-array',
      'exercise-find-min-rotated',
      'exercise-peak-element',
      'exercise-koko-eating-bananas',
      'exercise-capacity-ship-packages',
      'exercise-median-two-arrays',
    ],
    estimatedHours: 6,
  },

  // ============== WEEK 3: Trees & Graphs ==============
  {
    id: 'core-trees',
    title: '7. Binary Trees',
    description: 'Tree traversals, properties, and manipulation',
    exercises: [
      'exercise-inorder-traversal',
      'exercise-level-order',
      'exercise-max-depth',
      'exercise-validate-bst',
      'exercise-lca',
      'exercise-serialize-tree',
      'exercise-construct-tree-preorder-inorder',
      'exercise-max-path-sum',
    ],
    estimatedHours: 6,
  },
  {
    id: 'core-graphs-bfs-dfs',
    title: '8. Graphs: BFS & DFS',
    description: 'Graph traversal, connected components, and path finding',
    exercises: [
      'exercise-number-of-islands',
      'exercise-clone-graph',
      'exercise-course-schedule',
      'exercise-course-schedule-ii',
      'exercise-pacific-atlantic',
      'exercise-rotting-oranges',
      'exercise-word-ladder',
      'exercise-shortest-path-binary-matrix',
    ],
    estimatedHours: 8,
  },
  {
    id: 'core-graphs-advanced',
    title: '9. Graphs: Advanced',
    description: 'Topological sort, Union-Find, and specialized algorithms',
    exercises: [
      'exercise-topological-kahn',
      'exercise-alien-dictionary',
      'exercise-redundant-connection',
      'exercise-count-connected-components',
      'exercise-graph-reachability',
      'exercise-is-graph-bipartite',
    ],
    estimatedHours: 5,
  },

  // ============== WEEK 4: Dynamic Programming ==============
  {
    id: 'core-dp-1d',
    title: '10. DP: 1D Problems',
    description: 'Foundation of dynamic programming with single dimension',
    exercises: [
      'exercise-climbing-stairs',
      'exercise-house-robber',
      'exercise-coin-change',
      'exercise-lis',
      'exercise-word-break',
      'exercise-decode-ways',
      'exercise-maximum-subarray',
      'exercise-jump-game',
    ],
    estimatedHours: 8,
  },
  {
    id: 'core-dp-2d',
    title: '11. DP: 2D & Advanced',
    description: 'Grid DP, string DP, and complex state transitions',
    exercises: [
      'exercise-unique-paths',
      'exercise-unique-paths-obstacles',
      'exercise-min-path-sum',
      'exercise-lcs',
      'exercise-edit-distance',
      'exercise-01-knapsack',
      'exercise-partition-equal-subset-sum',
      'exercise-target-sum',
    ],
    estimatedHours: 8,
  },

  // ============== WEEK 5: Backtracking & Heaps ==============
  {
    id: 'core-backtracking',
    title: '12. Backtracking',
    description: 'Generate combinations, permutations, and solve constraint problems',
    exercises: [
      'exercise-subsets-step-by-step',
      'exercise-permutations',
      'exercise-combinations',
      'exercise-combination-sum',
      'exercise-combination-sum-ii',
      'exercise-generate-parentheses',
      'exercise-word-search',
      'exercise-nqueens-simple',
    ],
    estimatedHours: 8,
  },
  {
    id: 'core-heaps',
    title: '13. Heaps & Priority Queues',
    description: 'Top-K problems, scheduling, and merge operations',
    exercises: [
      'exercise-kth-largest-stream',
      'exercise-top-k-frequent',
      'exercise-k-closest-points',
      'exercise-find-median-stream',
      'exercise-merge-k-sorted-lists',
      'exercise-task-scheduler-priority',
    ],
    estimatedHours: 5,
  },

  // ============== WEEK 6: Greedy & Intervals ==============
  {
    id: 'core-greedy',
    title: '14. Greedy Algorithms',
    description: 'Local optimal choices for global solutions',
    exercises: [
      'exercise-activity-selection',
      'exercise-jump-game-ii',
      'exercise-gas-station',
      'exercise-candy',
      'exercise-partition-labels',
      'exercise-queue-reconstruction-height',
      'exercise-non-overlapping-meetings',
      'exercise-task-scheduling-deadlines',
    ],
    estimatedHours: 6,
  },
  {
    id: 'core-intervals',
    title: '15. Intervals',
    description: 'Merge, insert, and schedule interval problems',
    exercises: [
      'exercise-merge-intervals',
      'exercise-insert-interval',
      'exercise-meeting-rooms-ii',
      'exercise-erase-overlapping-intervals',
    ],
    estimatedHours: 3,
  },

  // ============== Bonus: Advanced Topics ==============
  {
    id: 'core-tries',
    title: '16. Tries',
    description: 'Prefix trees for string operations',
    exercises: [
      'exercise-trie-insert',
      'exercise-trie-search',
      'exercise-add-search-word',
      'exercise-word-search-ii',
      'exercise-search-suggestions',
    ],
    estimatedHours: 4,
  },
  {
    id: 'core-bit-manipulation',
    title: '17. Bit Manipulation',
    description: 'Bitwise operations and tricks',
    exercises: [
      'exercise-single-number',
      'exercise-number-of-1-bits',
      'exercise-counting-bits',
      'exercise-reverse-bits',
      'exercise-sum-of-two-integers',
    ],
    estimatedHours: 3,
  },
];

// Helper to get all core exercise IDs
export const coreExerciseIds: Set<string> = new Set(
  corePath.flatMap(section => section.exercises)
);

// Get total count
export const coreExerciseCount = coreExerciseIds.size;

// Get total estimated hours
export const coreEstimatedHours = corePath.reduce(
  (sum, section) => sum + section.estimatedHours,
  0
);

// Check if an exercise is in the core path
export const isCoreProblem = (exerciseId: string): boolean => {
  return coreExerciseIds.has(exerciseId);
};

// Get section for an exercise
export const getCoreSection = (exerciseId: string): CorePathSection | undefined => {
  return corePath.find(section => section.exercises.includes(exerciseId));
};

// Summary stats
export const corePathStats = {
  totalExercises: coreExerciseCount,
  totalSections: corePath.length,
  estimatedHours: coreEstimatedHours,
  estimatedWeeks: Math.ceil(coreEstimatedHours / 15), // ~15 hours per week
};
