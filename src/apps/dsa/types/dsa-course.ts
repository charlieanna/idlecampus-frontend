// Data Structures and Algorithms Course Types

export interface EvolutionStep {
  type: 'brute-force' | 'bottleneck' | 'optimized';
  title: string;
  code?: string;
  explanation: string;
  complexity?: {
    time: string;
    space: string;
  };
  highlight?: string;
}

export interface ProblemHintStep {
  /**
   * Unique identifier for the hint step. Legacy hints that do not provide
   * an explicit ID will be assigned one at runtime.
   */
  id?: string;
  /**
   * Ordering for display. Legacy hints can omit this, falling back to array index.
   */
  order?: number;
  /**
   * Short descriptive label for the hint card (optional).
   */
  title?: string;
  /**
   * Main hint body (markdown supported).
   */
  body?: string;
  /**
   * Tags that identify the core concepts touched by this hint (e.g., 'two-pointers').
   */
  conceptTags?: string[];
  /**
   * Optional concept family identifier to link hints to mastery tracking.
   */
  familyId?: string;
  /**
   * Hint strength - useful for analytics and struggle detection.
   */
  severity?: 'light' | 'medium' | 'heavy';
}

export interface DSAProblem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: DSATopic;
  examples: DSAExample[];
  constraints: string[];
  /**
   * Ordered list of hints available for this problem.
   * Legacy content may still provide simple strings; they will be converted
   * into structured hint steps at runtime.
   */
  hints: (string | ProblemHintStep)[];
  starterCode: string;
  solution: string;
  testCases: DSATestCase[];
  timeComplexity: string;
  spaceComplexity: string;
  targetComplexity?: {
    time: string;
    space: string;
  };
  relatedProblems?: string[];
  tags: string[];
  evolutionSteps?: EvolutionStep[];
  /**
   * Optional curriculum ordering index used by Smart Practice.
   * Lower values = earlier in the learning journey.
   */
  curriculumOrder?: number;
  /**
   * Optional prerequisite/module information for Smart Practice.
   * Many problems (especially from Smart Practice banks) already define prerequisites;
   * lesson-extracted exercises will attach their teaching module as the last entry.
   */
  prerequisites?: string[];
  requiredModules?: string[];
  family_tree?: {
    remedial_id?: string;
    tutorial_id?: string;
    tutorial_module_id?: string;
  };
}

export type DSATopic =
  | 'arrays'
  | 'strings'
  | 'linked-lists'
  | 'stacks'
  | 'queues'
  | 'hash-tables'
  | 'trees'
  | 'graphs'
  | 'heaps'
  | 'sorting'
  | 'searching'
  | 'dynamic-programming'
  | 'recursion'
  | 'backtracking'
  | 'greedy'
  | 'divide-and-conquer'
  | 'bit-manipulation'
  | 'math'
  | 'sliding-window'
  | 'two-pointers'
  | 'trie'
  | 'union-find'
  | 'segment-tree'
  | 'fenwick-tree'
  | 'time-complexity'
  | 'general';

export interface DSAExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface DSATestCase {
  id: string;
  input: string;
  expectedOutput: string;
  hidden?: boolean;
}

export interface InteractiveTask {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  expectedOutput: string;
  hint?: string;
  solution?: string;
  validation: (code: string) => boolean;
}

export interface TimeComplexityInfo {
  timeComplexity: string;
  spaceComplexity: string;
  explanation?: string;
  comparison?: {
    bruteForce: string;
    optimized: string;
    improvement: string;
  };
}

export interface DSALesson {
  id: string;
  title: string;
  description: string;
  topic: DSATopic;
  content: string | DSALessonContent[]; // Support both string (markdown) and structured content
  problems: string[]; // Problem IDs
  quizzes?: DSAQuiz[];
  estimatedTime?: number; // in minutes (optional)
  interactiveTasks?: InteractiveTask[]; // NEW: Step-by-step interactive tasks
  complexity?: TimeComplexityInfo; // NEW: Time and space complexity information
  useProgressiveLesson?: boolean; // NEW: Use progressive learning component instead of default viewer
}

export interface DSALessonContent {
  type: 'text' | 'code' | 'visualization' | 'complexity-analysis' | 'tips' | 'task' | 'component';
  content?: string;
  language?: 'python' | 'pseudocode';
  title?: string;
  task?: InteractiveTask; // For type: 'task'
  componentName?: string; // For type: 'component' - name of the component to render
}

export interface DSAQuiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface DSAModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: DSALesson[];
  estimatedTime?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  progressiveLesson?: boolean;
  isUnifiedJourney?: boolean;
}

export interface DSACourse {
  id: string;
  title: string;
  description: string;
  modules: DSAModule[];
  problems: DSAProblem[];
}

export interface CodeSubmission {
  code: string;
  timestamp: Date;
  testResults: TestResult[];
  passed: boolean;
  executionTime?: number;
}

export interface TestResult {
  testCaseId: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  error?: string;
  executionTime?: number;
}

export interface DSAProgress {
  moduleId: string;
  lessonId: string;
  problemsSolved: Set<string>;
  problemsAttempted: Set<string>;
  quizzesCompleted: Set<string>;
  lastAccessed: Date;
  timeSpent: number;
}

// Visualization types for data structures
export interface VisualizationStep {
  id: string;
  description: string;
  dataStructure: any;
  highlightedIndices?: number[];
  highlightedNodes?: string[];
  code?: string;
  lineHighlight?: number;
}

export interface ArrayVisualization {
  array: (number | string)[];
  highlightedIndices?: number[];
  labels?: string[];
}

export interface TreeNode {
  value: number | string;
  left?: TreeNode;
  right?: TreeNode;
  id?: string;
}

export interface GraphNode {
  id: string;
  value: number | string;
  neighbors: string[];
}

export interface LinkedListNode {
  value: number | string;
  next?: string; // ID of next node
  id: string;
}

// Complexity analysis
export interface ComplexityAnalysis {
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  explanation: string;
}

// Problem patterns
export const problemPatterns = {
  'two-pointers': {
    name: 'Two Pointers',
    description: 'Use two pointers to traverse array/string from different positions',
    useCases: ['Sorted arrays', 'Palindromes', 'Pair sums'],
  },
  'sliding-window': {
    name: 'Sliding Window',
    description: 'Maintain a window and slide it across the data',
    useCases: ['Subarray problems', 'Substring problems'],
  },
  'fast-slow-pointers': {
    name: 'Fast & Slow Pointers',
    description: 'Two pointers moving at different speeds',
    useCases: ['Cycle detection', 'Middle of list', 'Palindrome list'],
  },
  'merge-intervals': {
    name: 'Merge Intervals',
    description: 'Deal with overlapping intervals',
    useCases: ['Scheduling', 'Ranges', 'Meeting rooms'],
  },
  'cyclic-sort': {
    name: 'Cyclic Sort',
    description: 'Sort array containing numbers in given range',
    useCases: ['Missing numbers', 'Duplicate numbers'],
  },
  'in-place-reversal': {
    name: 'In-place Reversal',
    description: 'Reverse linked list without extra memory',
    useCases: ['Reverse list', 'Reverse sublist'],
  },
  'bfs': {
    name: 'Breadth First Search',
    description: 'Level-by-level traversal',
    useCases: ['Tree traversal', 'Shortest path', 'Graph traversal'],
  },
  'dfs': {
    name: 'Depth First Search',
    description: 'Explore as deep as possible',
    useCases: ['Tree traversal', 'Backtracking', 'Path finding'],
  },
  'top-k-elements': {
    name: 'Top K Elements',
    description: 'Find top/bottom K elements',
    useCases: ['Kth largest', 'Top K frequent', 'K closest'],
  },
  'k-way-merge': {
    name: 'K-way Merge',
    description: 'Merge K sorted arrays/lists',
    useCases: ['Merge sorted arrays', 'Smallest range'],
  },
  'dp': {
    name: 'Dynamic Programming',
    description: 'Break problem into overlapping subproblems',
    useCases: ['Optimization', 'Counting', 'Decision making'],
  },
  'backtracking': {
    name: 'Backtracking',
    description: 'Build solution incrementally and backtrack when stuck',
    useCases: ['Permutations', 'Combinations', 'Subsets'],
  },
  'greedy': {
    name: 'Greedy',
    description: 'Make locally optimal choice at each step',
    useCases: ['Activity selection', 'Huffman coding'],
  },
};

// Common data structure operations complexity
export const complexityReference = {
  array: {
    access: 'O(1)',
    search: 'O(n)',
    insertion: 'O(n)',
    deletion: 'O(n)',
  },
  linkedList: {
    access: 'O(n)',
    search: 'O(n)',
    insertion: 'O(1)',
    deletion: 'O(1)',
  },
  hashTable: {
    access: 'N/A',
    search: 'O(1) average, O(n) worst',
    insertion: 'O(1) average, O(n) worst',
    deletion: 'O(1) average, O(n) worst',
  },
  binarySearchTree: {
    access: 'O(log n) average, O(n) worst',
    search: 'O(log n) average, O(n) worst',
    insertion: 'O(log n) average, O(n) worst',
    deletion: 'O(log n) average, O(n) worst',
  },
  heap: {
    access: 'O(n)',
    search: 'O(n)',
    insertion: 'O(log n)',
    deletion: 'O(log n)',
  },
};

// Python code templates
export const pythonTemplates = {
  basicFunction: `def solution():
    # Write your code here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(result)`,

  arrayProblem: `def solve_array_problem(arr):
    """
    Args:
        arr: List[int] - Input array
    Returns:
        result - Your solution
    """
    # Write your code here
    pass

# Test cases
if __name__ == "__main__":
    test_cases = [
        [1, 2, 3, 4, 5],
        [5, 4, 3, 2, 1],
    ]
    
    for test in test_cases:
        result = solve_array_problem(test)
        print(f"Input: {test}")
        print(f"Output: {result}")
        print()`,

  linkedListProblem: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def solve_linked_list(head):
    """
    Args:
        head: ListNode - Head of the linked list
    Returns:
        ListNode - Modified/new linked list
    """
    # Write your code here
    pass`,

  treeProblem: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def solve_tree_problem(root):
    """
    Args:
        root: TreeNode - Root of binary tree
    Returns:
        result - Your solution
    """
    # Write your code here
    pass`,

  graphProblem: `from collections import defaultdict, deque

def solve_graph_problem(n, edges):
    """
    Args:
        n: int - Number of nodes
        edges: List[List[int]] - Edge list
    Returns:
        result - Your solution
    """
    # Build adjacency list
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
    
    # Write your code here
    pass`,

  dpProblem: `def solve_dp_problem(n):
    """
    Args:
        n: int - Input parameter
    Returns:
        result - Your solution
    """
    # Initialize DP table
    dp = [0] * (n + 1)
    
    # Write your code here
    pass`,
};

// Helper for creating test cases
export function createTestCase(
  id: string,
  input: string,
  expectedOutput: string,
  hidden: boolean = false
): DSATestCase {
  return { id, input, expectedOutput, hidden };
}

// Helper for creating problems
export function createProblem(
  id: string,
  title: string,
  description: string,
  difficulty: 'easy' | 'medium' | 'hard',
  topic: DSATopic,
  starterCode: string,
  solution: string,
  testCases: DSATestCase[],
  timeComplexity: string,
  spaceComplexity: string
): DSAProblem {
  return {
    id,
    title,
    description,
    difficulty,
    topic,
    examples: [],
    constraints: [],
    hints: [],
    starterCode,
    solution,
    testCases,
    timeComplexity,
    spaceComplexity,
    tags: [],
  };
}
