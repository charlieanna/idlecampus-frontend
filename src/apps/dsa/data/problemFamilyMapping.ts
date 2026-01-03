/**
 * Problem Family Mapping
 * Maps each DSA problem to its concept family
 * Based on 55 families across 13 modules
 */

export interface ProblemFamilyMapping {
  problemId: string;
  familyId: string;
  familyName: string;
  moduleId: number;
  moduleName: string;
}

/**
 * Complete mapping of all 174 problems to their 63 concept families
 * Organized by module (0.5, 1-4, 4.5, 5-13)
 */
export const problemFamilyMappings: ProblemFamilyMapping[] = [
  // MODULE 0.5: Python Basics (13 exercises, 5 families)

  // Family: Python Fundamentals (3 exercises)
  { problemId: 'exercise-list-basics', familyId: 'python-fundamentals', familyName: 'Python Fundamentals', moduleId: 0.5, moduleName: 'Python Basics' },
  { problemId: 'exercise-dict-basics', familyId: 'python-fundamentals', familyName: 'Python Fundamentals', moduleId: 0.5, moduleName: 'Python Basics' },
  { problemId: 'exercise-set-operations', familyId: 'python-fundamentals', familyName: 'Python Fundamentals', moduleId: 0.5, moduleName: 'Python Basics' },

  // Family: Control Flow (2 exercises)
  { problemId: 'exercise-nested-loops', familyId: 'control-flow', familyName: 'Loops & Conditionals', moduleId: 0.5, moduleName: 'Python Basics' },

  // Family: Collections Module Basics (3 exercises)
  { problemId: 'exercise-defaultdict', familyId: 'collections-basics', familyName: 'Collections Module', moduleId: 0.5, moduleName: 'Python Basics' },
  { problemId: 'exercise-counter', familyId: 'collections-basics', familyName: 'Collections Module', moduleId: 0.5, moduleName: 'Python Basics' },
  { problemId: 'exercise-deque', familyId: 'collections-basics', familyName: 'Collections Module', moduleId: 0.5, moduleName: 'Python Basics' },

  // Family: Python Pattern Basics (2 exercises)
  { problemId: 'exercise-two-pointers-python', familyId: 'python-pattern-basics', familyName: 'Python Patterns', moduleId: 0.5, moduleName: 'Python Basics' },
  { problemId: 'exercise-sliding-window-python', familyId: 'python-pattern-basics', familyName: 'Python Patterns', moduleId: 0.5, moduleName: 'Python Basics' },

  // MODULE 1: Array Iteration Techniques (12 problems, 3 families)

  // Family: Two Pointers (4 problems)
  { problemId: 'two-sum-sorted', familyId: 'two-pointers', familyName: 'Two Pointers', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'remove-duplicates', familyId: 'two-pointers', familyName: 'Two Pointers', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'container-with-most-water', familyId: 'two-pointers', familyName: 'Two Pointers', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'trapping-rain-water', familyId: 'two-pointers', familyName: 'Two Pointers', moduleId: 1, moduleName: 'Array Iteration' },

  // Family: Array Partitioning (4 problems)
  { problemId: 'move-zeroes', familyId: 'array-partitioning', familyName: 'Array Partitioning', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'sort-colors', familyId: 'array-partitioning', familyName: 'Array Partitioning', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'partition-labels', familyId: 'array-partitioning', familyName: 'Array Partitioning', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'segregate-even-odd', familyId: 'array-partitioning', familyName: 'Array Partitioning', moduleId: 1, moduleName: 'Array Iteration' },

  // Family: Sliding Window (4 problems)
  { problemId: 'max-subarray-sum-k', familyId: 'sliding-window', familyName: 'Sliding Window', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'longest-substring-k-distinct', familyId: 'sliding-window', familyName: 'Sliding Window', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'minimum-window-substring', familyId: 'sliding-window', familyName: 'Sliding Window', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'sliding-window-maximum', familyId: 'sliding-window', familyName: 'Sliding Window', moduleId: 1, moduleName: 'Array Iteration' },

  // MODULE 2: Hash Map Fundamentals (9 problems, 4 families)

  // Family: Two Sum Pattern (3 problems)
  { problemId: 'two-sum', familyId: 'two-sum-pattern', familyName: 'Two Sum Pattern', moduleId: 2, moduleName: 'Hash Maps' },
  { problemId: 'three-sum', familyId: 'two-sum-pattern', familyName: 'Two Sum Pattern', moduleId: 2, moduleName: 'Hash Maps' },
  { problemId: 'four-sum', familyId: 'two-sum-pattern', familyName: 'Two Sum Pattern', moduleId: 2, moduleName: 'Hash Maps' },

  // Family: Frequency Counting (2 problems)
  { problemId: 'valid-anagram', familyId: 'frequency-counting', familyName: 'Frequency Counting', moduleId: 2, moduleName: 'Hash Maps' },
  { problemId: 'group-anagrams', familyId: 'frequency-counting', familyName: 'Frequency Counting', moduleId: 2, moduleName: 'Hash Maps' },

  // Family: Prefix Sum + Hash Map (2 problems)
  { problemId: 'subarray-sum-equals-k', familyId: 'prefix-sum-hashmap', familyName: 'Prefix Sum + Hash Map', moduleId: 2, moduleName: 'Hash Maps' },
  { problemId: 'continuous-subarray-sum', familyId: 'prefix-sum-hashmap', familyName: 'Prefix Sum + Hash Map', moduleId: 2, moduleName: 'Hash Maps' },

  // Family: Bidirectional Mapping (2 problems)
  { problemId: 'isomorphic-strings', familyId: 'bidirectional-mapping', familyName: 'Bidirectional Mapping', moduleId: 2, moduleName: 'Hash Maps' },
  { problemId: 'word-pattern', familyId: 'bidirectional-mapping', familyName: 'Bidirectional Mapping', moduleId: 2, moduleName: 'Hash Maps' },

  // MODULE 3: Bit Manipulation & Math (10 problems, 3 families)

  // Family: Bitwise Operations (4 problems)
  { problemId: 'single-number', familyId: 'bitwise-operations', familyName: 'Bitwise Operations', moduleId: 3, moduleName: 'Bit Manipulation' },
  { problemId: 'missing-number', familyId: 'bitwise-operations', familyName: 'Bitwise Operations', moduleId: 3, moduleName: 'Bit Manipulation' },
  { problemId: 'reverse-bits', familyId: 'bitwise-operations', familyName: 'Bitwise Operations', moduleId: 3, moduleName: 'Bit Manipulation' },
  { problemId: 'hamming-distance', familyId: 'bitwise-operations', familyName: 'Bitwise Operations', moduleId: 3, moduleName: 'Bit Manipulation' },

  // Family: Bit Tricks (3 problems)
  { problemId: 'power-of-two', familyId: 'bit-tricks', familyName: 'Bit Tricks', moduleId: 3, moduleName: 'Bit Manipulation' },
  { problemId: 'counting-bits', familyId: 'bit-tricks', familyName: 'Bit Tricks', moduleId: 3, moduleName: 'Bit Manipulation' },
  { problemId: 'subsets-bitmasking', familyId: 'bit-tricks', familyName: 'Bit Tricks', moduleId: 3, moduleName: 'Bit Manipulation' },

  // Family: Mathematical Patterns (3 problems)
  { problemId: 'greatest-common-divisor', familyId: 'mathematical-patterns', familyName: 'Mathematical Patterns', moduleId: 3, moduleName: 'Bit Manipulation' },
  { problemId: 'sieve-of-eratosthenes', familyId: 'mathematical-patterns', familyName: 'Mathematical Patterns', moduleId: 3, moduleName: 'Bit Manipulation' },
  { problemId: 'modular-exponentiation', familyId: 'mathematical-patterns', familyName: 'Mathematical Patterns', moduleId: 3, moduleName: 'Bit Manipulation' },

  // MODULE 4: Python OOP & Essential Libraries (6 exercises, 3 families)

  // Family: Python Classes & OOP (2 exercises)
  { problemId: 'exercise-rectangle-class', familyId: 'python-classes-oop', familyName: 'Python Classes & OOP', moduleId: 4.5, moduleName: 'Python OOP & Libraries' },
  { problemId: 'exercise-build-linked-list', familyId: 'python-classes-oop', familyName: 'Python Classes & OOP', moduleId: 4.5, moduleName: 'Python OOP & Libraries' },

  // Family: Collections Advanced (3 exercises)
  { problemId: 'exercise-build-graph', familyId: 'collections-advanced', familyName: 'Collections Advanced', moduleId: 4.5, moduleName: 'Python OOP & Libraries' },
  { problemId: 'exercise-first-unique-char', familyId: 'collections-advanced', familyName: 'Collections Advanced', moduleId: 4.5, moduleName: 'Python OOP & Libraries' },
  { problemId: 'exercise-recent-counter', familyId: 'collections-advanced', familyName: 'Collections Advanced', moduleId: 4.5, moduleName: 'Python OOP & Libraries' },

  // Family: Heapq Module (1 exercise)
  { problemId: 'exercise-kth-largest', familyId: 'heapq-priority-queues', familyName: 'Heapq Module', moduleId: 4.5, moduleName: 'Python OOP & Libraries' },

  // MODULE 5: Linked List Mastery (10 problems, 6 families)

  // Family: Python Classes & Nodes (1 problem)
  { problemId: 'implement-linked-list', familyId: 'python-classes-nodes', familyName: 'Python Classes & Nodes', moduleId: 5, moduleName: 'Linked Lists' },

  // Family: Dummy Node Pattern (2 problems)
  { problemId: 'remove-linked-list-elements', familyId: 'dummy-node-pattern', familyName: 'Dummy Node Pattern', moduleId: 5, moduleName: 'Linked Lists' },
  { problemId: 'merge-two-sorted-lists', familyId: 'dummy-node-pattern', familyName: 'Dummy Node Pattern', moduleId: 5, moduleName: 'Linked Lists' },

  // Family: Two Pointers in Linked Lists (2 problems)
  { problemId: 'linked-list-cycle', familyId: 'two-pointers-linked-list', familyName: 'Two Pointers in Linked Lists', moduleId: 5, moduleName: 'Linked Lists' },
  { problemId: 'middle-of-linked-list', familyId: 'two-pointers-linked-list', familyName: 'Two Pointers in Linked Lists', moduleId: 5, moduleName: 'Linked Lists' },

  // Family: Reversal Patterns (2 problems)
  { problemId: 'reverse-linked-list', familyId: 'reversal-patterns', familyName: 'Reversal Patterns', moduleId: 5, moduleName: 'Linked Lists' },
  { problemId: 'reverse-linked-list-ii', familyId: 'reversal-patterns', familyName: 'Reversal Patterns', moduleId: 5, moduleName: 'Linked Lists' },

  // Family: Linked List + Hash Map (2 problems)
  { problemId: 'lru-cache', familyId: 'linked-list-hashmap', familyName: 'Linked List + Hash Map', moduleId: 5, moduleName: 'Linked Lists' },
  { problemId: 'copy-list-random-pointer', familyId: 'linked-list-hashmap', familyName: 'Linked List + Hash Map', moduleId: 5, moduleName: 'Linked Lists' },

  // Family: Linked List + Two Pointers (Advanced) (1 problem)
  { problemId: 'reorder-list', familyId: 'linked-list-two-pointers-advanced', familyName: 'Linked List + Two Pointers (Advanced)', moduleId: 5, moduleName: 'Linked Lists' },

  // MODULE 6: Trees & Tree Traversals (15 problems, 5 families)

  // Family: Tree Basics & Traversals (4 problems)
  { problemId: 'inorder-traversal', familyId: 'tree-traversals', familyName: 'Tree Basics & Traversals', moduleId: 6, moduleName: 'Trees' },
  { problemId: 'preorder-traversal', familyId: 'tree-traversals', familyName: 'Tree Basics & Traversals', moduleId: 6, moduleName: 'Trees' },
  { problemId: 'postorder-traversal', familyId: 'tree-traversals', familyName: 'Tree Basics & Traversals', moduleId: 6, moduleName: 'Trees' },
  { problemId: 'level-order-traversal', familyId: 'tree-traversals', familyName: 'Tree Basics & Traversals', moduleId: 6, moduleName: 'Trees' },

  // Family: Binary Search Trees (3 problems)
  { problemId: 'validate-bst', familyId: 'binary-search-trees', familyName: 'Binary Search Trees', moduleId: 6, moduleName: 'Trees' },
  { problemId: 'insert-into-bst', familyId: 'binary-search-trees', familyName: 'Binary Search Trees', moduleId: 6, moduleName: 'Trees' },
  { problemId: 'delete-node-bst', familyId: 'binary-search-trees', familyName: 'Binary Search Trees', moduleId: 6, moduleName: 'Trees' },

  // Family: Tree Path Problems (3 problems)
  { problemId: 'path-sum', familyId: 'tree-path-problems', familyName: 'Tree Path Problems', moduleId: 6, moduleName: 'Trees' },
  { problemId: 'path-sum-ii', familyId: 'tree-path-problems', familyName: 'Tree Path Problems', moduleId: 6, moduleName: 'Trees' },
  { problemId: 'binary-tree-paths', familyId: 'tree-path-problems', familyName: 'Tree Path Problems', moduleId: 6, moduleName: 'Trees' },

  // Family: Tree Properties (3 problems)
  { problemId: 'max-depth-binary-tree', familyId: 'tree-properties', familyName: 'Tree Properties', moduleId: 6, moduleName: 'Trees' },
  { problemId: 'diameter-binary-tree', familyId: 'tree-properties', familyName: 'Tree Properties', moduleId: 6, moduleName: 'Trees' },
  { problemId: 'balanced-binary-tree', familyId: 'tree-properties', familyName: 'Tree Properties', moduleId: 6, moduleName: 'Trees' },

  // Family: Tree Construction (2 problems)
  { problemId: 'construct-tree-inorder-preorder', familyId: 'tree-construction', familyName: 'Tree Construction', moduleId: 6, moduleName: 'Trees' },
  { problemId: 'construct-tree-inorder-postorder', familyId: 'tree-construction', familyName: 'Tree Construction', moduleId: 6, moduleName: 'Trees' },

  // MODULE 7: Binary Search & Sorting (14 problems, 4 families)

  // Family: Binary Search on Arrays (4 problems)
  { problemId: 'binary-search', familyId: 'binary-search-arrays', familyName: 'Binary Search on Arrays', moduleId: 7, moduleName: 'Binary Search' },
  { problemId: 'search-insert-position', familyId: 'binary-search-arrays', familyName: 'Binary Search on Arrays', moduleId: 7, moduleName: 'Binary Search' },
  { problemId: 'find-first-last-position', familyId: 'binary-search-arrays', familyName: 'Binary Search on Arrays', moduleId: 7, moduleName: 'Binary Search' },
  { problemId: 'search-2d-matrix', familyId: 'binary-search-arrays', familyName: 'Binary Search on Arrays', moduleId: 7, moduleName: 'Binary Search' },

  // Family: Binary Search on Answer (4 problems)
  { problemId: 'find-peak-element', familyId: 'binary-search-answer', familyName: 'Binary Search on Answer', moduleId: 7, moduleName: 'Binary Search' },
  { problemId: 'koko-eating-bananas', familyId: 'binary-search-answer', familyName: 'Binary Search on Answer', moduleId: 7, moduleName: 'Binary Search' },
  { problemId: 'minimum-capacity-ship', familyId: 'binary-search-answer', familyName: 'Binary Search on Answer', moduleId: 7, moduleName: 'Binary Search' },
  { problemId: 'split-array-largest-sum', familyId: 'binary-search-answer', familyName: 'Binary Search on Answer', moduleId: 7, moduleName: 'Binary Search' },

  // Family: Rotated Arrays Search (3 problems)
  { problemId: 'search-rotated-sorted-array', familyId: 'rotated-arrays-search', familyName: 'Rotated Arrays Search', moduleId: 7, moduleName: 'Binary Search' },
  { problemId: 'find-minimum-rotated-array', familyId: 'rotated-arrays-search', familyName: 'Rotated Arrays Search', moduleId: 7, moduleName: 'Binary Search' },
  { problemId: 'search-rotated-duplicates', familyId: 'rotated-arrays-search', familyName: 'Rotated Arrays Search', moduleId: 7, moduleName: 'Binary Search' },

  // Family: Sorting Algorithms (3 problems)
  { problemId: 'merge-sort', familyId: 'sorting-algorithms', familyName: 'Sorting Algorithms', moduleId: 7, moduleName: 'Binary Search' },
  { problemId: 'quick-sort', familyId: 'sorting-algorithms', familyName: 'Sorting Algorithms', moduleId: 7, moduleName: 'Binary Search' },
  { problemId: 'kth-largest-element', familyId: 'sorting-algorithms', familyName: 'Sorting Algorithms', moduleId: 7, moduleName: 'Binary Search' },

  // MODULE 8: Graphs & BFS/DFS (16 problems, 5 families)

  // Family: Graph Representations (2 problems)
  { problemId: 'graph-adjacency-list', familyId: 'graph-representations', familyName: 'Graph Representations', moduleId: 8, moduleName: 'Graphs' },
  { problemId: 'graph-adjacency-matrix', familyId: 'graph-representations', familyName: 'Graph Representations', moduleId: 8, moduleName: 'Graphs' },

  // Family: Graph DFS (4 problems)
  { problemId: 'number-of-islands', familyId: 'graph-dfs', familyName: 'Graph DFS', moduleId: 8, moduleName: 'Graphs' },
  { problemId: 'clone-graph', familyId: 'graph-dfs', familyName: 'Graph DFS', moduleId: 8, moduleName: 'Graphs' },
  { problemId: 'path-exists-graph', familyId: 'graph-dfs', familyName: 'Graph DFS', moduleId: 8, moduleName: 'Graphs' },
  { problemId: 'all-paths-source-target', familyId: 'graph-dfs', familyName: 'Graph DFS', moduleId: 8, moduleName: 'Graphs' },

  // Family: Graph BFS (4 problems)
  { problemId: 'shortest-path-binary-matrix', familyId: 'graph-bfs', familyName: 'Graph BFS', moduleId: 8, moduleName: 'Graphs' },
  { problemId: 'rotting-oranges', familyId: 'graph-bfs', familyName: 'Graph BFS', moduleId: 8, moduleName: 'Graphs' },
  { problemId: 'word-ladder', familyId: 'graph-bfs', familyName: 'Graph BFS', moduleId: 8, moduleName: 'Graphs' },
  { problemId: 'open-the-lock', familyId: 'graph-bfs', familyName: 'Graph BFS', moduleId: 8, moduleName: 'Graphs' },

  // Family: Topological Sort (3 problems)
  { problemId: 'course-schedule', familyId: 'topological-sort', familyName: 'Topological Sort', moduleId: 8, moduleName: 'Graphs' },
  { problemId: 'course-schedule-ii', familyId: 'topological-sort', familyName: 'Topological Sort', moduleId: 8, moduleName: 'Graphs' },
  { problemId: 'alien-dictionary', familyId: 'topological-sort', familyName: 'Topological Sort', moduleId: 8, moduleName: 'Graphs' },

  // Family: Shortest Paths (3 problems)
  { problemId: 'network-delay-time', familyId: 'shortest-paths', familyName: 'Shortest Paths', moduleId: 8, moduleName: 'Graphs' },
  { problemId: 'cheapest-flights-k-stops', familyId: 'shortest-paths', familyName: 'Shortest Paths', moduleId: 8, moduleName: 'Graphs' },
  { problemId: 'path-with-minimum-effort', familyId: 'shortest-paths', familyName: 'Shortest Paths', moduleId: 8, moduleName: 'Graphs' },

  // MODULE 9: Dynamic Programming Foundations (15 problems, 6 families)

  // Family: DP Fundamentals (2 problems)
  { problemId: 'fibonacci', familyId: 'dp-fundamentals', familyName: 'DP Fundamentals', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'climbing-stairs', familyId: 'dp-fundamentals', familyName: 'DP Fundamentals', moduleId: 11, moduleName: 'Dynamic Programming' },

  // Family: 1D DP (3 problems)
  { problemId: 'house-robber', familyId: '1d-dp', familyName: '1D DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'decode-ways', familyId: '1d-dp', familyName: '1D DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'longest-increasing-subsequence', familyId: '1d-dp', familyName: '1D DP', moduleId: 11, moduleName: 'Dynamic Programming' },

  // Family: 2D DP (3 problems)
  { problemId: 'unique-paths', familyId: '2d-dp', familyName: '2D DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'minimum-path-sum', familyId: '2d-dp', familyName: '2D DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'edit-distance', familyId: '2d-dp', familyName: '2D DP', moduleId: 11, moduleName: 'Dynamic Programming' },

  // Family: DP State Definition (3 problems)
  { problemId: 'coin-change', familyId: 'dp-state-definition', familyName: 'DP State Definition', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'target-sum', familyId: 'dp-state-definition', familyName: 'DP State Definition', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'partition-equal-subset-sum', familyId: 'dp-state-definition', familyName: 'DP State Definition', moduleId: 11, moduleName: 'Dynamic Programming' },

  // Family: DP Optimization (2 problems)
  { problemId: 'house-robber-ii', familyId: 'dp-optimization', familyName: 'DP Optimization', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'best-time-to-buy-sell-stock', familyId: 'dp-optimization', familyName: 'DP Optimization', moduleId: 11, moduleName: 'Dynamic Programming' },

  // Family: DP Pattern Recognition (2 problems)
  { problemId: 'longest-common-subsequence', familyId: 'dp-pattern-recognition', familyName: 'DP Pattern Recognition', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'palindromic-substrings', familyId: 'dp-pattern-recognition', familyName: 'DP Pattern Recognition', moduleId: 11, moduleName: 'Dynamic Programming' },

  // === Smart Practice DP Problems (18 problems from Module 11) ===

  // Family: Knapsack DP
  { problemId: '01-knapsack', familyId: 'knapsack-dp', familyName: 'Knapsack DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'target-sum', familyId: 'knapsack-dp', familyName: 'Knapsack DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'coin-change-ii', familyId: 'knapsack-dp', familyName: 'Knapsack DP', moduleId: 11, moduleName: 'Dynamic Programming' },

  // Family: 1D DP Practice
  { problemId: 'min-cost-climbing-stairs', familyId: '1d-dp', familyName: '1D DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'word-break', familyId: '1d-dp', familyName: '1D DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'climbing-stairs-k', familyId: '1d-dp', familyName: '1D DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'dice-roll-target', familyId: '1d-dp', familyName: '1D DP', moduleId: 11, moduleName: 'Dynamic Programming' },

  // Family: House Robber Variations
  { problemId: 'house-robber-ii', familyId: 'house-robber', familyName: 'House Robber Variations', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'house-robber-iii', familyId: 'house-robber', familyName: 'House Robber Variations', moduleId: 11, moduleName: 'Dynamic Programming' },

  // Family: 2D Grid DP
  { problemId: 'unique-paths-with-obstacles', familyId: '2d-dp', familyName: '2D DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'min-path-sum', familyId: '2d-dp', familyName: '2D DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'falling-path-sum', familyId: '2d-dp', familyName: '2D DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'triangle', familyId: '2d-dp', familyName: '2D DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'longest-increasing-path', familyId: '2d-dp', familyName: '2D DP', moduleId: 11, moduleName: 'Dynamic Programming' },

  // Family: Stock Trading DP
  { problemId: 'stock-ii', familyId: 'stock-dp', familyName: 'Stock Trading DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'stock-cooldown', familyId: 'stock-dp', familyName: 'Stock Trading DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'stock-iv', familyId: 'stock-dp', familyName: 'Stock Trading DP', moduleId: 11, moduleName: 'Dynamic Programming' },

  // Family: String DP
  { problemId: 'regex-matching', familyId: 'string-dp', familyName: 'String DP', moduleId: 11, moduleName: 'Dynamic Programming' },

  // MODULE 10: Heaps & Priority Queues (12 problems, 4 families)

  // Family: Heap Basics (3 problems)
  { problemId: 'kth-largest-heap', familyId: 'heap-basics', familyName: 'Heap Basics', moduleId: 10, moduleName: 'Heaps' },
  { problemId: 'last-stone-weight', familyId: 'heap-basics', familyName: 'Heap Basics', moduleId: 10, moduleName: 'Heaps' },
  { problemId: 'k-closest-points', familyId: 'heap-basics', familyName: 'Heap Basics', moduleId: 10, moduleName: 'Heaps' },

  // Family: Top K Elements (3 problems)
  { problemId: 'top-k-frequent-elements', familyId: 'top-k-elements', familyName: 'Top K Elements', moduleId: 10, moduleName: 'Heaps' },
  { problemId: 'kth-smallest-element-sorted-matrix', familyId: 'top-k-elements', familyName: 'Top K Elements', moduleId: 10, moduleName: 'Heaps' },
  { problemId: 'find-k-pairs-smallest-sums', familyId: 'top-k-elements', familyName: 'Top K Elements', moduleId: 10, moduleName: 'Heaps' },

  // Family: Two Heap Pattern (3 problems)
  { problemId: 'find-median-data-stream', familyId: 'two-heap-pattern', familyName: 'Two Heap Pattern', moduleId: 10, moduleName: 'Heaps' },
  { problemId: 'sliding-window-median', familyId: 'two-heap-pattern', familyName: 'Two Heap Pattern', moduleId: 10, moduleName: 'Heaps' },
  { problemId: 'ipo', familyId: 'two-heap-pattern', familyName: 'Two Heap Pattern', moduleId: 10, moduleName: 'Heaps' },

  // Family: Merge K Sorted (3 problems)
  { problemId: 'merge-k-sorted-lists', familyId: 'merge-k-sorted', familyName: 'Merge K Sorted', moduleId: 10, moduleName: 'Heaps' },
  { problemId: 'smallest-range-k-lists', familyId: 'merge-k-sorted', familyName: 'Merge K Sorted', moduleId: 10, moduleName: 'Heaps' },
  { problemId: 'find-k-smallest-pairs', familyId: 'merge-k-sorted', familyName: 'Merge K Sorted', moduleId: 10, moduleName: 'Heaps' },

  // MODULE 11: Backtracking & Recursion Trees (14 problems, 4 families)

  // Family: Subsets/Combinations (4 problems)
  { problemId: 'subsets', familyId: 'subsets-combinations', familyName: 'Subsets/Combinations', moduleId: 9, moduleName: 'Backtracking' },
  { problemId: 'subsets-ii', familyId: 'subsets-combinations', familyName: 'Subsets/Combinations', moduleId: 9, moduleName: 'Backtracking' },
  { problemId: 'combinations', familyId: 'subsets-combinations', familyName: 'Subsets/Combinations', moduleId: 9, moduleName: 'Backtracking' },
  { problemId: 'combination-sum', familyId: 'subsets-combinations', familyName: 'Subsets/Combinations', moduleId: 9, moduleName: 'Backtracking' },

  // Family: Permutations (3 problems)
  { problemId: 'permutations', familyId: 'permutations', familyName: 'Permutations', moduleId: 9, moduleName: 'Backtracking' },
  { problemId: 'permutations-ii', familyId: 'permutations', familyName: 'Permutations', moduleId: 9, moduleName: 'Backtracking' },
  { problemId: 'next-permutation', familyId: 'permutations', familyName: 'Permutations', moduleId: 9, moduleName: 'Backtracking' },

  // Family: Constraint Satisfaction (4 problems)
  { problemId: 'n-queens', familyId: 'constraint-satisfaction', familyName: 'Constraint Satisfaction', moduleId: 9, moduleName: 'Backtracking' },
  { problemId: 'n-queens-ii', familyId: 'constraint-satisfaction', familyName: 'Constraint Satisfaction', moduleId: 9, moduleName: 'Backtracking' },
  { problemId: 'sudoku-solver', familyId: 'constraint-satisfaction', familyName: 'Constraint Satisfaction', moduleId: 9, moduleName: 'Backtracking' },
  { problemId: 'valid-sudoku', familyId: 'constraint-satisfaction', familyName: 'Constraint Satisfaction', moduleId: 9, moduleName: 'Backtracking' },

  // Family: Path Finding (3 problems)
  { problemId: 'word-search', familyId: 'path-finding', familyName: 'Path Finding', moduleId: 9, moduleName: 'Backtracking' },
  { problemId: 'word-search-ii', familyId: 'path-finding', familyName: 'Path Finding', moduleId: 9, moduleName: 'Backtracking' },
  { problemId: 'palindrome-partitioning', familyId: 'path-finding', familyName: 'Path Finding', moduleId: 9, moduleName: 'Backtracking' },

  // MODULE 12: Tries & Advanced String Patterns (8 problems, 3 families)

  // Family: Trie Construction (3 problems)
  { problemId: 'implement-trie', familyId: 'trie-construction', familyName: 'Trie Construction', moduleId: 12, moduleName: 'Tries' },
  { problemId: 'design-add-search-words', familyId: 'trie-construction', familyName: 'Trie Construction', moduleId: 12, moduleName: 'Tries' },
  { problemId: 'trie-with-wildcard', familyId: 'trie-construction', familyName: 'Trie Construction', moduleId: 12, moduleName: 'Tries' },

  // Family: Prefix Matching (2 problems)
  { problemId: 'longest-common-prefix', familyId: 'prefix-matching', familyName: 'Prefix Matching', moduleId: 12, moduleName: 'Tries' },
  { problemId: 'search-suggestions-system', familyId: 'prefix-matching', familyName: 'Prefix Matching', moduleId: 12, moduleName: 'Tries' },

  // Family: Word Problems (3 problems)
  { problemId: 'word-search-trie', familyId: 'word-problems', familyName: 'Word Problems', moduleId: 12, moduleName: 'Tries' },
  { problemId: 'word-break', familyId: 'word-problems', familyName: 'Word Problems', moduleId: 12, moduleName: 'Tries' },
  { problemId: 'word-break-ii', familyId: 'word-problems', familyName: 'Word Problems', moduleId: 12, moduleName: 'Tries' },

  // MODULE 8.5: Union-Find (Disjoint Set Union) (6 problems, 1 family)

  // Family: Union Find (6 problems)
  { problemId: 'union-find-implementation', familyId: 'union-find', familyName: 'Union Find', moduleId: 8.5, moduleName: 'Union-Find' },
  { problemId: 'number-of-connected-components', familyId: 'union-find', familyName: 'Union Find', moduleId: 8.5, moduleName: 'Union-Find' },
  { problemId: 'exercise-connected-components-uf', familyId: 'union-find', familyName: 'Union Find', moduleId: 8.5, moduleName: 'Union-Find' },
  { problemId: 'exercise-valid-tree', familyId: 'union-find', familyName: 'Union Find', moduleId: 8.5, moduleName: 'Union-Find' },
  { problemId: 'exercise-redundant-connection', familyId: 'union-find', familyName: 'Union Find', moduleId: 8.5, moduleName: 'Union-Find' },
  { problemId: 'exercise-accounts-merge', familyId: 'union-find', familyName: 'Union Find', moduleId: 8.5, moduleName: 'Union-Find' },

  // MODULE 13: Advanced Topics & Mastery (7 problems, 3 families)

  // Family: Segment Trees (2 problems)
  { problemId: 'range-sum-query-mutable', familyId: 'segment-trees', familyName: 'Segment Trees', moduleId: 13, moduleName: 'Advanced Topics' },
  { problemId: 'range-minimum-query', familyId: 'segment-trees', familyName: 'Segment Trees', moduleId: 13, moduleName: 'Advanced Topics' },

  // Family: Advanced Graph (3 problems)
  { problemId: 'strongly-connected-components', familyId: 'advanced-graph', familyName: 'Advanced Graph', moduleId: 13, moduleName: 'Advanced Topics' },
  { problemId: 'critical-connections', familyId: 'advanced-graph', familyName: 'Advanced Graph', moduleId: 13, moduleName: 'Advanced Topics' },
  { problemId: 'articulation-points', familyId: 'advanced-graph', familyName: 'Advanced Graph', moduleId: 13, moduleName: 'Advanced Topics' },

  // Family: Mixed Challenges (2 problems)
  { problemId: 'serialize-deserialize-tree', familyId: 'mixed-challenges', familyName: 'Mixed Challenges', moduleId: 13, moduleName: 'Advanced Topics' },
  { problemId: 'lfu-cache', familyId: 'mixed-challenges', familyName: 'Mixed Challenges', moduleId: 13, moduleName: 'Advanced Topics' },

  // MODULE 14: Edge-Case Drills (6 problems, 2 families)

  // Family: Edge-Case Data Structures (5 problems)
  { problemId: 'exercise-min-stack', familyId: 'edge-case-data-structures', familyName: 'Edge-Case Data Structures', moduleId: 14, moduleName: 'Edge-Case Drills' },
  { problemId: 'exercise-hit-counter', familyId: 'edge-case-data-structures', familyName: 'Edge-Case Data Structures', moduleId: 14, moduleName: 'Edge-Case Drills' },
  { problemId: 'exercise-randomized-set', familyId: 'edge-case-data-structures', familyName: 'Edge-Case Data Structures', moduleId: 14, moduleName: 'Edge-Case Drills' },
  { problemId: 'exercise-logger-rate-limiter', familyId: 'edge-case-data-structures', familyName: 'Edge-Case Data Structures', moduleId: 14, moduleName: 'Edge-Case Drills' },
  { problemId: 'exercise-moving-average', familyId: 'edge-case-data-structures', familyName: 'Edge-Case Data Structures', moduleId: 14, moduleName: 'Edge-Case Drills' },

  // Family: Edge-Case Ranges (1 problem)
  { problemId: 'exercise-summary-ranges', familyId: 'edge-case-ranges', familyName: 'Edge-Case Ranges', moduleId: 14, moduleName: 'Edge-Case Drills' },

  // ============= Google Interview Problems =============

  // Hash Map Problems
  { problemId: 'isomorphic-strings', familyId: 'bidirectional-mapping', familyName: 'Bidirectional Mapping', moduleId: 2, moduleName: 'Hash Maps' },
  { problemId: 'bulls-and-cows', familyId: 'frequency-counting', familyName: 'Frequency Counting', moduleId: 2, moduleName: 'Hash Maps' },
  { problemId: 'continuous-subarray-sum', familyId: 'prefix-sum-hashmap', familyName: 'Prefix Sum + Hash Map', moduleId: 2, moduleName: 'Hash Maps' },

  // Design Problems
  { problemId: 'time-based-key-value-store', familyId: 'design-data-structure', familyName: 'Design Data Structure', moduleId: 2, moduleName: 'Hash Maps' },
  { problemId: 'design-hashset', familyId: 'design-data-structure', familyName: 'Design Data Structure', moduleId: 2, moduleName: 'Hash Maps' },
  { problemId: 'insert-delete-getrandom-o1', familyId: 'design-data-structure', familyName: 'Design Data Structure', moduleId: 2, moduleName: 'Hash Maps' },
  { problemId: 'logger-rate-limiter', familyId: 'design-data-structure', familyName: 'Design Data Structure', moduleId: 2, moduleName: 'Hash Maps' },

  // Tree Problems
  { problemId: 'serialize-deserialize-binary-tree', familyId: 'tree-serialization', familyName: 'Tree Serialization', moduleId: 6, moduleName: 'Trees' },
  { problemId: 'binary-tree-coloring-game', familyId: 'tree-traversal', familyName: 'Tree Traversal', moduleId: 6, moduleName: 'Trees' },

  // Graph Problems
  { problemId: 'alien-dictionary', familyId: 'topological-sort', familyName: 'Topological Sort', moduleId: 8, moduleName: 'Graphs' },
  { problemId: 'word-ladder-ii', familyId: 'bfs-shortest-path', familyName: 'BFS Shortest Path', moduleId: 8, moduleName: 'Graphs' },
  { problemId: 'the-maze', familyId: 'graph-traversal', familyName: 'Graph Traversal', moduleId: 8, moduleName: 'Graphs' },
  { problemId: 'the-maze-ii', familyId: 'dijkstra', familyName: 'Dijkstra Shortest Path', moduleId: 8, moduleName: 'Graphs' },

  // Binary Search Problems
  { problemId: 'split-array-largest-sum', familyId: 'binary-search-answer', familyName: 'Binary Search on Answer', moduleId: 7, moduleName: 'Binary Search' },
  { problemId: 'k-closest-elements', familyId: 'binary-search-window', familyName: 'Binary Search Window', moduleId: 7, moduleName: 'Binary Search' },

  // Stack Problems
  { problemId: 'largest-rectangle-histogram', familyId: 'monotonic-stack', familyName: 'Monotonic Stack', moduleId: 5, moduleName: 'Stacks & Queues' },
  { problemId: 'decode-string', familyId: 'stack-parsing', familyName: 'Stack Parsing', moduleId: 5, moduleName: 'Stacks & Queues' },

  // ============= L5 Advanced Modules =============
  // Module 17: Concurrency & Threading
  { problemId: 'print-in-order', familyId: 'concurrency-threading', familyName: 'Concurrency & Threading', moduleId: 17, moduleName: 'Concurrency' },
  { problemId: 'building-h2o', familyId: 'concurrency-threading', familyName: 'Concurrency & Threading', moduleId: 17, moduleName: 'Concurrency' },
  { problemId: 'dining-philosophers', familyId: 'concurrency-threading', familyName: 'Concurrency & Threading', moduleId: 17, moduleName: 'Concurrency' },

  // Module 18: System Design Patterns
  { problemId: 'design-rate-limiter', familyId: 'system-design-patterns', familyName: 'System Design Patterns', moduleId: 18, moduleName: 'System Design' },
  { problemId: 'design-hit-counter', familyId: 'system-design-patterns', familyName: 'System Design Patterns', moduleId: 18, moduleName: 'System Design' },
  { problemId: 'logger-rate-limiter', familyId: 'system-design-patterns', familyName: 'System Design Patterns', moduleId: 18, moduleName: 'System Design' },

  // Module 19: OOD Patterns
  { problemId: 'design-in-memory-db', familyId: 'ood-patterns', familyName: 'OOD Patterns', moduleId: 19, moduleName: 'OOD Patterns' },
  { problemId: 'design-undo-redo', familyId: 'ood-patterns', familyName: 'OOD Patterns', moduleId: 19, moduleName: 'OOD Patterns' },

  // Module 20: Async Patterns
  { problemId: 'design-task-scheduler', familyId: 'async-patterns', familyName: 'Async Patterns', moduleId: 20, moduleName: 'Async Patterns' },
  { problemId: 'design-delayed-task-queue', familyId: 'async-patterns', familyName: 'Async Patterns', moduleId: 20, moduleName: 'Async Patterns' },

  // ==========================================
  // Arrays & Hashing Challenges (from challenges.json)
  // ==========================================

  // Module 1: Array Iteration / Partitioning
  { problemId: 'q_41', familyId: 'array-partitioning', familyName: 'Array Partitioning', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'q_54', familyId: 'array-partitioning', familyName: 'Array Partitioning', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'q_48', familyId: 'array-partitioning', familyName: 'Array Partitioning', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'q_31', familyId: 'two-pointers', familyName: 'Two Pointers', moduleId: 1, moduleName: 'Array Iteration' },

  // Module 2: Hash Map & Design
  { problemId: 'q_238', familyId: 'prefix-sum-hashmap', familyName: 'Prefix Sum + Hash Map', moduleId: 2, moduleName: 'Hash Maps' },
  { problemId: 'q_560', familyId: 'prefix-sum-hashmap', familyName: 'Prefix Sum + Hash Map', moduleId: 2, moduleName: 'Hash Maps' },
  { problemId: 'q_128', familyId: 'frequency-counting', familyName: 'Frequency Counting', moduleId: 2, moduleName: 'Hash Maps' },
  { problemId: 'q_49', familyId: 'frequency-counting', familyName: 'Frequency Counting', moduleId: 2, moduleName: 'Hash Maps' },
  { problemId: 'q_36', familyId: 'frequency-counting', familyName: 'Frequency Counting', moduleId: 2, moduleName: 'Hash Maps' },
  { problemId: 'q_271', familyId: 'design-data-structure', familyName: 'Design Data Structure', moduleId: 2, moduleName: 'Hash Maps' },

  // Module 2: Two Pointers & Sliding Window Challenges (Mapped to Module 1 Families)
  { problemId: 'q_42', familyId: 'two-pointers', familyName: 'Two Pointers', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'q_76', familyId: 'sliding-window', familyName: 'Sliding Window', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'q_15', familyId: 'two-pointers', familyName: 'Two Pointers', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'q_11', familyId: 'two-pointers', familyName: 'Two Pointers', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'q_239', familyId: 'sliding-window', familyName: 'Sliding Window', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'q_424', familyId: 'sliding-window', familyName: 'Sliding Window', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'q_340', familyId: 'sliding-window', familyName: 'Sliding Window', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'q_18', familyId: 'two-pointers', familyName: 'Two Pointers', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'q_75', familyId: 'array-partitioning', familyName: 'Array Partitioning', moduleId: 1, moduleName: 'Array Iteration' },
  { problemId: 'q_84', familyId: 'monotonic-stack', familyName: 'Monotonic Stack', moduleId: 5, moduleName: 'Linked Lists' },

  // Module 3: Stack & LinkedList Challenges (Mapped to Module 5/10 Families)
  { problemId: 'q_25', familyId: 'reversal-patterns', familyName: 'Reversal Patterns', moduleId: 5, moduleName: 'Linked Lists' },
  { problemId: 'q_23', familyId: 'merge-k-sorted', familyName: 'Merge K Sorted', moduleId: 10, moduleName: 'Heaps' },
  { problemId: 'q_138', familyId: 'linked-list-hashmap', familyName: 'Linked List + Hash Map', moduleId: 5, moduleName: 'Linked Lists' },
  { problemId: 'q_224', familyId: 'stack-parsing', familyName: 'Stack Parsing', moduleId: 5, moduleName: 'Linked Lists' },
  { problemId: 'q_853', familyId: 'monotonic-stack', familyName: 'Monotonic Stack', moduleId: 5, moduleName: 'Linked Lists' },
  { problemId: 'q_316', familyId: 'monotonic-stack', familyName: 'Monotonic Stack', moduleId: 5, moduleName: 'Linked Lists' },
  { problemId: 'q_143', familyId: 'linked-list-two-pointers-advanced', familyName: 'Linked List + Two Pointers (Advanced)', moduleId: 5, moduleName: 'Linked Lists' },
  { problemId: 'q_2', familyId: 'dummy-node-pattern', familyName: 'Dummy Node Pattern', moduleId: 5, moduleName: 'Linked Lists' },
  { problemId: 'q_19', familyId: 'two-pointers-linked-list', familyName: 'Two Pointers in Linked Lists', moduleId: 5, moduleName: 'Linked Lists' },
  { problemId: 'q_146', familyId: 'linked-list-hashmap', familyName: 'Linked List + Hash Map', moduleId: 5, moduleName: 'Linked Lists' },
  // Module 4: Trees & Graphs Challenges (Mapped to Mod 6/8/8.5 Families)
  { problemId: 'q_269', familyId: 'topological-sort', familyName: 'Topological Sort', moduleId: 8, moduleName: 'Graphs' },
  { problemId: 'q_126', familyId: 'graph-bfs', familyName: 'Graph BFS', moduleId: 8, moduleName: 'Graphs' },
  { problemId: 'q_124', familyId: 'tree-path-problems', familyName: 'Tree Path Problems', moduleId: 6, moduleName: 'Trees' },
  { problemId: 'q_297', familyId: 'tree-construction', familyName: 'Tree Construction', moduleId: 6, moduleName: 'Trees' },
  { problemId: 'q_210', familyId: 'topological-sort', familyName: 'Topological Sort', moduleId: 8, moduleName: 'Graphs' },
  { problemId: 'q_261', familyId: 'union-find', familyName: 'Union Find', moduleId: 8.5, moduleName: 'Union-Find' },
  { problemId: 'q_787', familyId: 'shortest-paths', familyName: 'Shortest Paths', moduleId: 8, moduleName: 'Graphs' },
  { problemId: 'q_105', familyId: 'tree-construction', familyName: 'Tree Construction', moduleId: 6, moduleName: 'Trees' },
  { problemId: 'q_332', familyId: 'graph-dfs', familyName: 'Graph DFS', moduleId: 8, moduleName: 'Graphs' },
  { problemId: 'q_236', familyId: 'tree-properties', familyName: 'Tree Properties', moduleId: 6, moduleName: 'Trees' },

  // Module 5: DP Challenges (Mapped to Mod 11 Families)
  { problemId: 'q_72', familyId: '2d-dp', familyName: '2D DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'q_312', familyId: 'dp-pattern-recognition', familyName: 'DP Pattern Recognition', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'q_322', familyId: 'dp-state-definition', familyName: 'DP State Definition', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'q_300', familyId: '1d-dp', familyName: '1D DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'q_139', familyId: '1d-dp', familyName: '1D DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'q_152', familyId: '1d-dp', familyName: '1D DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'q_1143', familyId: 'dp-pattern-recognition', familyName: 'DP Pattern Recognition', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'q_647', familyId: 'dp-pattern-recognition', familyName: 'DP Pattern Recognition', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'q_97', familyId: '2d-dp', familyName: '2D DP', moduleId: 11, moduleName: 'Dynamic Programming' },
  { problemId: 'q_494', familyId: 'dp-state-definition', familyName: 'DP State Definition', moduleId: 11, moduleName: 'Dynamic Programming' },
  // Module 6: Heaps & Intervals Challenges (Mapped to Mod 10 / 1 / 7 Families)
  { problemId: 'q_295', familyId: 'two-heap-pattern', familyName: 'Two Heap Pattern', moduleId: 10, moduleName: 'Heaps' },
  { problemId: 'q_253', familyId: 'two-heap-pattern', familyName: 'Two Heap Pattern', moduleId: 10, moduleName: 'Heaps' },
  { problemId: 'q_218', familyId: 'heap-basics', familyName: 'Heap Basics', moduleId: 10, moduleName: 'Heaps' },
  { problemId: 'q_480', familyId: 'two-heap-pattern', familyName: 'Two Heap Pattern', moduleId: 10, moduleName: 'Heaps' },
  { problemId: 'q_621', familyId: 'heap-basics', familyName: 'Heap Basics', moduleId: 10, moduleName: 'Heaps' },
  { problemId: 'q_56', familyId: 'sorting-algorithms', familyName: 'Sorting Algorithms', moduleId: 7, moduleName: 'Binary Search' },
  { problemId: 'q_435', familyId: 'sorting-algorithms', familyName: 'Sorting Algorithms', moduleId: 7, moduleName: 'Binary Search' },
  { problemId: 'q_502', familyId: 'two-heap-pattern', familyName: 'Two Heap Pattern', moduleId: 10, moduleName: 'Heaps' },
  { problemId: 'q_347', familyId: 'top-k-elements', familyName: 'Top K Elements', moduleId: 10, moduleName: 'Heaps' },
  { problemId: 'q_57', familyId: 'array-partitioning', familyName: 'Array Partitioning', moduleId: 1, moduleName: 'Array Iteration' },

  // Module 7: Design & Tries Challenges (Mapped to Mod 2 / 12 Families)
  { problemId: 'q_212', familyId: 'word-problems', familyName: 'Word Problems', moduleId: 12, moduleName: 'Tries' },
  { problemId: 'q_208', familyId: 'trie-construction', familyName: 'Trie Construction', moduleId: 12, moduleName: 'Tries' },
  { problemId: 'q_642', familyId: 'prefix-matching', familyName: 'Prefix Matching', moduleId: 12, moduleName: 'Tries' },
  { problemId: 'q_460', familyId: 'design-data-structure', familyName: 'Design Data Structure', moduleId: 2, moduleName: 'Hash Maps' },
  { problemId: 'q_380', familyId: 'design-data-structure', familyName: 'Design Data Structure', moduleId: 2, moduleName: 'Hash Maps' },
  { problemId: 'q_211', familyId: 'trie-construction', familyName: 'Trie Construction', moduleId: 12, moduleName: 'Tries' },
  { problemId: 'q_588', familyId: 'trie-construction', familyName: 'Trie Construction', moduleId: 12, moduleName: 'Tries' },
  { problemId: 'q_432', familyId: 'design-data-structure', familyName: 'Design Data Structure', moduleId: 2, moduleName: 'Hash Maps' },
  { problemId: 'q_622', familyId: 'design-data-structure', familyName: 'Design Data Structure', moduleId: 2, moduleName: 'Hash Maps' },
  // Module 8: Concurrency Challenges (Mapped to Mod 17 Families)
  { problemId: 'q_1115', familyId: 'concurrency-threading', familyName: 'Concurrency & Threading', moduleId: 17, moduleName: 'Concurrency' },
  { problemId: 'q_1242', familyId: 'concurrency-threading', familyName: 'Concurrency & Threading', moduleId: 17, moduleName: 'Concurrency' },
  { problemId: 'q_conc_06', familyId: 'concurrency-threading', familyName: 'Concurrency & Threading', moduleId: 17, moduleName: 'Concurrency' },

  // Module 9: System Design Challenges (Mapped to Mod 18 Families)
  { problemId: 'q_sys_04', familyId: 'system-design-patterns', familyName: 'System Design Patterns', moduleId: 18, moduleName: 'System Design' },

  // Module 10: OOD Challenges (Mapped to Mod 19 Families)
  { problemId: 'q_ood_03', familyId: 'ood-patterns', familyName: 'OOD Patterns', moduleId: 19, moduleName: 'OOD' },
  { problemId: 'q_1146', familyId: 'ood-patterns', familyName: 'OOD Patterns', moduleId: 19, moduleName: 'OOD' },

  // Module 11: Async Challenges (Mapped to Mod 20 Families)
  { problemId: 'q_1834', familyId: 'async-patterns', familyName: 'Async Patterns', moduleId: 20, moduleName: 'Async' },
];

/**
 * Helper function to get family info for a problem
 */
export function getFamilyForProblem(problemId: string): ProblemFamilyMapping | undefined {
  return problemFamilyMappings.find(m => m.problemId === problemId);
}

/**
 * Helper function to get all problems for a family
 */
export function getProblemsForFamily(familyId: string): string[] {
  return problemFamilyMappings
    .filter(m => m.familyId === familyId)
    .map(m => m.problemId);
}

/**
 * Helper function to get all unique families
 */
export function getAllFamilies(): { familyId: string; familyName: string; moduleId: number; moduleName: string }[] {
  const uniqueFamilies = new Map<string, { familyId: string; familyName: string; moduleId: number; moduleName: string }>();

  problemFamilyMappings.forEach(m => {
    if (!uniqueFamilies.has(m.familyId)) {
      uniqueFamilies.set(m.familyId, {
        familyId: m.familyId,
        familyName: m.familyName,
        moduleId: m.moduleId,
        moduleName: m.moduleName
      });
    }
  });

  return Array.from(uniqueFamilies.values()).sort((a, b) => a.moduleId - b.moduleId);
}

/**
 * Helper function to get all families for a module
 */
export function getFamiliesForModule(moduleId: number): { familyId: string; familyName: string }[] {
  const uniqueFamilies = new Map<string, { familyId: string; familyName: string }>();

  problemFamilyMappings
    .filter(m => m.moduleId === moduleId)
    .forEach(m => {
      if (!uniqueFamilies.has(m.familyId)) {
        uniqueFamilies.set(m.familyId, {
          familyId: m.familyId,
          familyName: m.familyName
        });
      }
    });

  return Array.from(uniqueFamilies.values());
}
