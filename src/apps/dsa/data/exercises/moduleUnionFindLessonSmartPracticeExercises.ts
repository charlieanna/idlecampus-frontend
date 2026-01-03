import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module9UnionFindLessonSmartPracticeExercises: ExerciseSection[] = [
  // ============================================================================
  // BASICS (1-5): DSU fundamentals + size/aggregate tracking
  // ============================================================================
  {
  type: 'exercise',
  placement: 'module',
  id: 'exercise-connected-components-uf',
  title: 'Connected Components with Union-Find',
  difficulty: 'medium',
  description: 'Count the number of connected components using the complete UnionFind class',
  requiredForProgress: true,
  instruction: `# Connected Components with Union-Find

Given \`n\` nodes and a list of undirected edges, count how many connected components exist.

**Example:**
\`\`\`
Input: n = 5, edges = [[0,1], [1,2], [3,4]]
Output: 2

Components: {0,1,2} and {3,4}
\`\`\`

**Strategy:**
1. Start with n separate components
2. For each edge, union the two nodes
3. Each successful union reduces component count by 1`,
  starterCode: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x == root_y:
            return False
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        return True

def countComponents(n, edges):
    """Count the number of connected components."""
    pass`,
  targetComplexity: {
    time: 'O(E * α(n))',
    space: 'O(n)'
  },
  targetFunction: 'countComponents',
  testCases: [
    { input: '5, [[0,1], [1,2], [3,4]]', expectedOutput: '2' },
    { input: '5, [[0,1], [0,2], [1,2], [3,4]]', expectedOutput: '2' },
    { input: '4, []', expectedOutput: '4' },
    { input: '4, [[0,1], [1,2], [2,3]]', expectedOutput: '1' }
  ],
  hints: [
    { afterAttempt: 1, text: 'Start with components = n, then decrement each time union() returns True' },
    { afterAttempt: 2, text: 'union() returns True when it successfully merges two different components' }
  ],
  solution: {
    afterAttempt: 3,
    text: `def countComponents(n, edges):
    uf = UnionFind(n)
    components = n

    for u, v in edges:
        if uf.union(u, v):
            components -= 1

    return components`
  },
  solutionExplanation: `Each successful union merges 2 components into 1, so we decrement the count.

Time: O(E * α(n)) ≈ O(E) where E is number of edges
Space: O(n) for Union-Find structure`,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
},
  {
  type: 'exercise',
  placement: 'module',
  id: 'exercise-group-size-queries',
  title: 'Group Size Queries',
  difficulty: 'easy',
  description: 'Track and query the size of each connected component',
  requiredForProgress: false,
  instruction: `# Group Size Queries

Given \`n\` nodes and a list of edges that are added over time, answer queries about the size of each component.

**Example:**
\`\`\`
n = 5
edges = [[0,1], [1,2], [3,4]]
queries = [0, 3, 2]

After all edges added:
- Component of node 0: {0,1,2} → size 3
- Component of node 3: {3,4} → size 2
- Component of node 2: {0,1,2} → size 3

Output: [3, 2, 3]
\`\`\`

**Strategy:**
Extend Union-Find to track the size of each component. When two components merge, add their sizes together.`,
  starterCode: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.size = [1] * n  # Track size of each component

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x == root_y:
            return False
        # TODO: Update size when merging
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        return True

    def get_size(self, x):
        """Return the size of the component containing x."""
        pass

def group_size_queries(n, edges, queries):
    """Return the size of component for each query node."""
    pass`,
  targetComplexity: {
    time: 'O(E * α(n) + Q)',
    space: 'O(n)'
  },
  targetFunction: 'group_size_queries',
  testCases: [
    { input: '5, [[0,1], [1,2], [3,4]], [0, 3, 2]', expectedOutput: '[3, 2, 3]' },
    { input: '4, [], [0, 1, 2, 3]', expectedOutput: '[1, 1, 1, 1]' },
    { input: '3, [[0,1], [1,2]], [0, 1, 2]', expectedOutput: '[3, 3, 3]' }
  ],
  hints: [
    { afterAttempt: 1, text: 'When unioning, the new root should have size = size[root_x] + size[root_y]' },
    { afterAttempt: 2, text: 'get_size(x) should return size[find(x)], not size[x]' }
  ],
  solution: {
    afterAttempt: 3,
    text: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.size = [1] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x == root_y:
            return False
        # Merge smaller into larger by rank
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
            self.size[root_y] += self.size[root_x]
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
            self.size[root_x] += self.size[root_y]
        else:
            self.parent[root_y] = root_x
            self.size[root_x] += self.size[root_y]
            self.rank[root_x] += 1
        return True

    def get_size(self, x):
        return self.size[self.find(x)]

def group_size_queries(n, edges, queries):
    uf = UnionFind(n)
    for u, v in edges:
        uf.union(u, v)
    return [uf.get_size(q) for q in queries]`
  },
  solutionExplanation: `Key insight: Store size at the root of each component.

When merging:
- New root gets sum of both sizes
- Old root's size becomes stale (but we always query via find())

Time: O(E * α(n)) for unions + O(Q * α(n)) for queries
Space: O(n) for size array`,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
},
  {
  type: 'exercise',
  placement: 'module',
  id: 'tax-number-of-provinces',
  title: 'Code: Number of Provinces',
  description: 'Find number of connected components (provinces).',
  instruction: `# Number of Provinces

Find number of connected components (provinces).

## Examples

**Example 1:**
- Input: \`See problem\`
- Output: \`See solution\`

## Constraints

- See problem description`,
  starterCode: `def find_circle_num(is_connected):
    # Count connected components
    pass`,
  hints: [
    {
      afterAttempt: 1,
      text: 'Use Union-Find with path compression'
    },
    {
      afterAttempt: 2,
      text: 'Count unique roots'
    }
  ],
  solution: {
    afterAttempt: 3,
    text: `def find_circle_num(is_connected):
    n = len(is_connected)
    parent = list(range(n))
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py
    for i in range(n):
        for j in range(i + 1, n):
            if is_connected[i][j]:
                union(i, j)
    return len(set(find(i) for i in range(n)))`
  },
  solutionExplanation: `## 10-Minute Interview Thinking Process
### Step 1: Understand the Problem
- Find number of connected components (provinces).
- Example Input: \`See problem\` => Output: \`See solution\`
### Step 2: Explore Examples
- Example Input: \`See problem\` => Output: \`See solution\`
### Step 3: Brute Force
- Start with the most direct approach, even if it is inefficient (nested loops, try all combinations, etc.).
### Step 4: Key Insight
- Recognize patterns (union-find) to eliminate redundant work or encode state efficiently.
### Step 5: Optimized Solution
- Translate the insight into code using the appropriate pattern/data structure.
### Step 6: Complexity
- Time: O(n²)
- Space: O(n)`,
  targetComplexity: {
    time: 'O(n²)',
    space: 'O(n)'
  },
  testCases: [
    {
      input: '[[1, 1, 0], [1, 1, 0], [0, 0, 1]]',
      expectedOutput: '2',
      description: 'public case'
    },
    {
      input: '[[1, 0, 0], [0, 1, 0], [0, 0, 1]]',
      expectedOutput: '3',
      description: 'public case'
    },
    {
      input: '[[1]]',
      expectedOutput: '1',
      description: 'hidden case'
    }
  ],
  requiredForProgress: false,
  difficulty: 'medium',
  isPracticeOnly: true,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
  },
  {
  type: 'exercise',
  placement: 'module',
  id: 'exercise-component-sum',
  title: 'Component Sum Queries',
  difficulty: 'medium',
  description: 'Track the sum of values in each connected component',
  requiredForProgress: false,
  instruction: `# Component Sum Queries

Each of \`n\` nodes has a value. Given edges that connect nodes, answer queries asking for the sum of all values in a component.

**Example:**
\`\`\`
values = [10, 20, 30, 40, 50]  (node 0=10, node 1=20, ...)
edges = [[0,1], [3,4]]
queries = [0, 3]

Components:
- {0,1,2}: sum = 10+20+30 = 60... wait, node 2 not connected
- Actually: {0,1} sum=30, {2} sum=30, {3,4} sum=90

Output: [30, 90]
\`\`\`

**Strategy:**
Similar to size tracking, but track sum of values instead of count.`,
  starterCode: `def component_sum_queries(values, edges, queries):
    """Return the sum of values in each queried component."""
    n = len(values)
    parent = list(range(n))
    comp_sum = values[:]  # Sum stored at root

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        # TODO: Merge components and update sums
        pass

    # Process edges
    for u, v in edges:
        union(u, v)

    # Answer queries
    return [comp_sum[find(q)] for q in queries]`,
  targetComplexity: {
    time: 'O(E * α(n) + Q)',
    space: 'O(n)'
  },
  targetFunction: 'component_sum_queries',
  testCases: [
    { input: '[10, 20, 30, 40, 50], [[0,1], [3,4]], [0, 2, 3]', expectedOutput: '[30, 30, 90]' },
    { input: '[5, 5, 5], [[0,1], [1,2]], [0]', expectedOutput: '[15]' },
    { input: '[100], [], [0]', expectedOutput: '[100]' }
  ],
  hints: [
    { afterAttempt: 1, text: 'When unioning, add the sum of the smaller component to the larger' },
    { afterAttempt: 2, text: 'Always query comp_sum[find(x)] to get the current root\'s sum' }
  ],
  solution: {
    afterAttempt: 3,
    text: `def component_sum_queries(values, edges, queries):
    n = len(values)
    parent = list(range(n))
    rank = [0] * n
    comp_sum = values[:]  # Sum stored at root

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        root_x, root_y = find(x), find(y)
        if root_x == root_y:
            return
        if rank[root_x] < rank[root_y]:
            parent[root_x] = root_y
            comp_sum[root_y] += comp_sum[root_x]
        elif rank[root_x] > rank[root_y]:
            parent[root_y] = root_x
            comp_sum[root_x] += comp_sum[root_y]
        else:
            parent[root_y] = root_x
            comp_sum[root_x] += comp_sum[root_y]
            rank[root_x] += 1

    for u, v in edges:
        union(u, v)

    return [comp_sum[find(q)] for q in queries]`
  },
  solutionExplanation: `This extends Union-Find with aggregate tracking:

1. Initialize comp_sum[i] = values[i] (each node starts as its own component)
2. On union: new_root.sum += old_root.sum
3. Query: return comp_sum[find(x)]

Pattern generalizes to any associative operation (sum, product, XOR, etc.)`,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
},
  {
  type: 'exercise',
  placement: 'module',
  id: 'exercise-component-max',
  title: 'Component Maximum Queries',
  difficulty: 'medium',
  description: 'Track the maximum value in each connected component',
  requiredForProgress: false,
  instruction: `# Component Maximum Queries

Each node has a value. As edges connect nodes, track the maximum value in each component.

**Example:**
\`\`\`
values = [3, 7, 2, 9, 1]
edges = [[0,1], [2,3], [0,2]]
queries = [0, 4]

After edges:
- {0,1,2,3}: max = max(3,7,2,9) = 9
- {4}: max = 1

Output: [9, 1]
\`\`\`

**Strategy:**
Store max value at component root. On merge, take max of both components' max values.`,
  starterCode: `def component_max_queries(values, edges, queries):
    """Return the max value in each queried component."""
    n = len(values)
    parent = list(range(n))
    comp_max = values[:]

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        # TODO: Merge and track max
        pass

    for u, v in edges:
        union(u, v)

    return [comp_max[find(q)] for q in queries]`,
  targetComplexity: {
    time: 'O(E * α(n) + Q)',
    space: 'O(n)'
  },
  targetFunction: 'component_max_queries',
  testCases: [
    { input: '[3, 7, 2, 9, 1], [[0,1], [2,3], [0,2]], [0, 4]', expectedOutput: '[9, 1]' },
    { input: '[5, 5, 5], [[0,1], [1,2]], [1]', expectedOutput: '[5]' },
    { input: '[1, 2, 3], [], [0, 1, 2]', expectedOutput: '[1, 2, 3]' }
  ],
  hints: [
    { afterAttempt: 1, text: 'comp_max[new_root] = max(comp_max[root_x], comp_max[root_y])' },
    { afterAttempt: 2, text: 'The new root should hold the max of both components' }
  ],
  solution: {
    afterAttempt: 3,
    text: `def component_max_queries(values, edges, queries):
    n = len(values)
    parent = list(range(n))
    rank = [0] * n
    comp_max = values[:]

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        root_x, root_y = find(x), find(y)
        if root_x == root_y:
            return
        # Determine new max before merging
        new_max = max(comp_max[root_x], comp_max[root_y])
        if rank[root_x] < rank[root_y]:
            parent[root_x] = root_y
            comp_max[root_y] = new_max
        elif rank[root_x] > rank[root_y]:
            parent[root_y] = root_x
            comp_max[root_x] = new_max
        else:
            parent[root_y] = root_x
            comp_max[root_x] = new_max
            rank[root_x] += 1

    for u, v in edges:
        union(u, v)

    return [comp_max[find(q)] for q in queries]`
  },
  solutionExplanation: `Similar pattern to sum tracking, but use max() instead of addition.

Key insight: max is associative and commutative, so order doesn't matter.

Works for any aggregate that satisfies:
- agg(A ∪ B) = combine(agg(A), agg(B))

Examples: sum, max, min, gcd, xor, product`,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
},
  // ============================================================================
  // INTERMEDIATE (6-12): Cycle detection, offline, equivalence groups
  // ============================================================================
  {
  type: 'exercise',
  placement: 'module',
  id: 'exercise-redundant-connection',
  title: 'Redundant Connection',
  difficulty: 'medium',
  description: 'Find the edge that creates a cycle in a tree',
  requiredForProgress: true,
  instruction: `# Redundant Connection

A tree is an undirected graph that is connected and has no cycles.

You are given a graph that started as a tree with \`n\` nodes, but one additional edge was added. Find and return the edge that can be removed to make the graph a tree again.

**Example:**
\`\`\`
Input: edges = [[1,2], [1,3], [2,3]]
Output: [2,3]

  1
 / \\
2---3  ← edge [2,3] creates a cycle
\`\`\`

**Strategy:**
Process edges in order. The first edge where union() fails (nodes already connected) is the redundant one!`,
  starterCode: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n + 1))  # +1 for 1-indexed
        self.rank = [0] * (n + 1)

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x == root_y:
            return False
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        return True

def findRedundantConnection(edges):
    """Find the redundant edge that creates a cycle."""
    pass`,
  targetComplexity: {
    time: 'O(n * α(n))',
    space: 'O(n)'
  },
  targetFunction: 'findRedundantConnection',
  testCases: [
    { input: '[[1,2], [1,3], [2,3]]', expectedOutput: '[2, 3]' },
    { input: '[[1,2], [2,3], [3,4], [1,4], [1,5]]', expectedOutput: '[1, 4]' },
    { input: '[[1,2], [2,3], [1,3]]', expectedOutput: '[1, 3]' }
  ],
  hints: [
    { afterAttempt: 1, text: 'Process edges in order and try to union each pair' },
    { afterAttempt: 2, text: 'When union() returns False, those nodes are already connected - that edge is redundant!' }
  ],
  solution: {
    afterAttempt: 3,
    text: `def findRedundantConnection(edges):
    n = len(edges)
    uf = UnionFind(n)

    for u, v in edges:
        if not uf.union(u, v):
            return [u, v]

    return []`
  },
  solutionExplanation: `If union() returns False, the nodes are already connected.
This means adding this edge creates a cycle - it's redundant!

Time: O(n * α(n)) ≈ O(n)
Space: O(n) for Union-Find structure`,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
},
  {
  type: 'exercise',
  placement: 'module',
  id: 'exercise-offline-connectivity',
  title: 'Offline Connectivity Queries',
  difficulty: 'medium',
  description: 'Answer all connectivity queries after processing all edges',
  requiredForProgress: false,
  instruction: `# Offline Connectivity Queries

Given edges and queries upfront (offline), answer "are A and B connected?" for each query.

**Example:**
\`\`\`
n = 5
edges = [[0,1], [1,2], [3,4]]
queries = [[0,2], [0,3], [3,4]]

After all edges:
- 0 and 2: connected via 0-1-2 → True
- 0 and 3: different components → False
- 3 and 4: directly connected → True

Output: [True, False, True]
\`\`\`

**Why "Offline"?**
- Online: answer queries as they arrive (may need complex data structure)
- Offline: know all queries upfront, process edges first, then answer all

Union-Find naturally handles offline connectivity in O(α(n)) per query!`,
  starterCode: `def offline_connectivity(n, edges, queries):
    """Answer connectivity queries after processing all edges."""
    parent = list(range(n))

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py

    # TODO: Process edges and answer queries
    pass`,
  targetComplexity: {
    time: 'O(E * α(n) + Q * α(n))',
    space: 'O(n)'
  },
  targetFunction: 'offline_connectivity',
  testCases: [
    { input: '5, [[0,1], [1,2], [3,4]], [[0,2], [0,3], [3,4]]', expectedOutput: '[True, False, True]' },
    { input: '3, [], [[0,1], [1,2]]', expectedOutput: '[False, False]' },
    { input: '4, [[0,1], [1,2], [2,3]], [[0,3]]', expectedOutput: '[True]' }
  ],
  hints: [
    { afterAttempt: 1, text: 'First process ALL edges with union(), then answer ALL queries with find()' },
    { afterAttempt: 2, text: 'Two nodes are connected iff find(a) == find(b)' }
  ],
  solution: {
    afterAttempt: 3,
    text: `def offline_connectivity(n, edges, queries):
    parent = list(range(n))

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py

    # Process all edges
    for u, v in edges:
        union(u, v)

    # Answer all queries
    return [find(a) == find(b) for a, b in queries]`
  },
  solutionExplanation: `"Offline" means we know all operations upfront, so we can:
1. Process ALL edges first → build final connectivity
2. Answer ALL queries against final state

This is simpler than "online" where we'd need to answer queries
interleaved with edge additions.

Time: O((E + Q) * α(n)) ≈ O(E + Q)
Space: O(n)`,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
},
  {
  type: 'exercise',
  placement: 'module',
  id: 'exercise-merge-intervals-connectivity',
  title: 'Merge Intervals via Connectivity',
  difficulty: 'medium',
  description: 'Merge overlapping intervals using Union-Find',
  requiredForProgress: false,
  instruction: `# Merge Intervals via Connectivity

Given a list of intervals, merge all overlapping intervals.

**Example:**
\`\`\`
intervals = [[1,3], [2,6], [8,10], [15,18]]
Output: [[1,6], [8,10], [15,18]]

[1,3] and [2,6] overlap → merge to [1,6]
[8,10] and [15,18] don't overlap with anything else
\`\`\`

**Union-Find Approach:**
1. Sort intervals by start
2. If interval[i] overlaps with interval[i+1], union them
3. Group intervals by component, take min start and max end`,
  starterCode: `def merge_intervals(intervals):
    """Merge overlapping intervals using Union-Find."""
    if not intervals:
        return []

    n = len(intervals)
    parent = list(range(n))

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py

    # Sort by start time
    indexed = sorted(enumerate(intervals), key=lambda x: x[1][0])

    # TODO: Union overlapping intervals and merge results
    pass`,
  targetComplexity: {
    time: 'O(n log n)',
    space: 'O(n)'
  },
  targetFunction: 'merge_intervals',
  testCases: [
    { input: '[[1,3], [2,6], [8,10], [15,18]]', expectedOutput: '[[1, 6], [8, 10], [15, 18]]' },
    { input: '[[1,4], [4,5]]', expectedOutput: '[[1, 5]]' },
    { input: '[[1,4], [0,4]]', expectedOutput: '[[0, 4]]' },
    { input: '[]', expectedOutput: '[]' }
  ],
  hints: [
    { afterAttempt: 1, text: 'After sorting, intervals i and i+1 overlap if intervals[i][1] >= intervals[i+1][0]' },
    { afterAttempt: 2, text: 'Group by find(i), then for each group compute min(starts) and max(ends)' }
  ],
  solution: {
    afterAttempt: 3,
    text: `def merge_intervals(intervals):
    if not intervals:
        return []

    n = len(intervals)
    parent = list(range(n))

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py

    # Sort by start time, keep original indices
    indexed = sorted(enumerate(intervals), key=lambda x: x[1][0])

    # Union overlapping consecutive intervals
    for i in range(len(indexed) - 1):
        idx1, (s1, e1) = indexed[i]
        idx2, (s2, e2) = indexed[i + 1]
        if e1 >= s2:  # Overlapping
            union(idx1, idx2)

    # Group by component
    from collections import defaultdict
    groups = defaultdict(list)
    for i in range(n):
        groups[find(i)].append(intervals[i])

    # Merge each group
    result = []
    for group in groups.values():
        start = min(iv[0] for iv in group)
        end = max(iv[1] for iv in group)
        result.append([start, end])

    return sorted(result)`
  },
  solutionExplanation: `While the standard approach (sort + linear merge) is simpler,
Union-Find demonstrates the "connectivity" perspective:

- Overlapping intervals = "connected"
- Find merged intervals = find connected components

This pattern generalizes to cases where overlap detection is more complex
or when intervals arrive in an online fashion.

Note: For this specific problem, the linear scan approach is preferred.
This exercise teaches the pattern for when UF is genuinely needed.`,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
},
  {
  type: 'exercise',
  placement: 'module',
  id: 'google-sentence-similarity-ii',
  title: 'Code: Sentence Similarity II',
  description: 'Use union-find to group similar words and compare two sentences.',
  instruction: `# Sentence Similarity II

Two sentences are similar if they have the same length and a pair of words at the same index are similar. Similarity is transitive: if \`word1 ~ word2\` and \`word2 ~ word3\`, then \`word1 ~ word3\`.

You are given two string arrays \`sentence1\` and \`sentence2\` of equal length, and an array \`similarPairs\` describing direct similarities. Determine if the sentences are similar.

## Examples

**Example 1:**
- Input: \`sentence1 = [\"great\",\"acting\",\"skills\"]\`, \`sentence2 = [\"fine\",\"drama\",\"talent\"]\`, \`similarPairs = [[\"great\",\"fine\"],[\"drama\",\"acting\"],[\"skills\",\"talent\"]]\`
- Output: \`true\`

**Example 2:**
- Input: \`sentence1 = [\"I\",\"love\",\"leetcode\"]\`, \`sentence2 = [\"I\",\"love\",\"onepiece\"]\`, \`similarPairs = [[\"manga\",\"onepiece\"],[\"platform\",\"anime\"],[\"leetcode\",\"platform\"],[\"anime\",\"manga\"]]\`
- Output: \`true\`
- Explanation: \`leetcode ~ platform ~ anime ~ manga ~ onepiece\`.

## Constraints

- \`sentence1.length == sentence2.length\`
- \`1 <= sentence1.length <= 1000\`
- \`0 <= similarPairs.length <= 2000\`
- All words are lowercase/uppercase English letters`,
  starterCode: `def are_sentences_similar_two(sentence1, sentence2, similar_pairs):
    # Union words via DSU and compare components
    pass`,
  hints: [
    {
      afterAttempt: 1,
      text: 'Similarity is transitive; whenever you see transitivity, think connected components.'
    },
    {
      afterAttempt: 2,
      text: 'Use a Union-Find keyed by strings. Lazily initialize parent entries.'
    },
    {
      afterAttempt: 3,
      text: 'After building groups, iterate both sentences in lockstep and compare roots.'
    }
  ],
  solution: {
    afterAttempt: 3,
    text: `def are_sentences_similar_two(sentence1, sentence2, similar_pairs):
    if len(sentence1) != len(sentence2):
        return False

    parent = {}

    def find(x):
        if x not in parent:
            parent[x] = x
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py

    for a, b in similar_pairs:
        union(a, b)

    for w1, w2 in zip(sentence1, sentence2):
        if find(w1) != find(w2):
            return False
    return True`
  },
  solutionExplanation: `## 10-Minute Interview Thinking Process
### Step 1: Understand the Problem
- Need to know if sentences align word-by-word under transitive similarity.
### Step 2: Explore Examples
- Build components such as great~fine to allow substitution.
### Step 3: Brute Force
- DFS for every word pair is too slow (O(N·pairs)).
### Step 4: Key Insight
- Union similar pairs so every word maps to its component representative. Then equality check is O(N·α(n)).
### Step 5: Optimized Solution
- Build DSU keyed by strings with path compression; lazily insert unseen words.
### Step 6: Complexity
- Time: O((P + N) · α(N))
- Space: O(P)`,
  targetComplexity: {
    time: 'O((P + N) * α(N))',
    space: 'O(P)'
  },
  testCases: [
    {
      input: '["great","acting","skills"], ["fine","drama","talent"], [["great","fine"],["drama","acting"],["skills","talent"]]',
      expectedOutput: 'true',
      description: 'basic positive case'
    },
    {
      input: '["a"], ["b"], []',
      expectedOutput: 'false',
      description: 'no pairs available'
    }
  ],
  requiredForProgress: false,
  difficulty: 'medium',
  isPracticeOnly: true,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
},
  {
  type: 'exercise',
  placement: 'module',
  id: 'google-accounts-merge',
  title: 'Code: Accounts Merge',
  description: 'Merge accounts sharing common emails using union-find.',
  instruction: `# Accounts Merge

Each \`accounts[i] = [name, email1, email2, ...]\` belongs to a person. Two accounts belong to the same person if they share at least one email. Merge the accounts and return the result with emails sorted lexicographically inside each account and the resulting list sorted by name.

## Example

**Input:** \`[[\"John\",\"johnsmith@mail.com\",\"john00@mail.com\"],[\"John\",\"johnnybravo@mail.com\"],[\"John\",\"johnsmith@mail.com\",\"john_newyork@mail.com\"],[\"Mary\",\"mary@mail.com\"],[\"John\",\"johnnybravo@mail.com\",\"johnny@mail.com\"]]\`

**Output:** \`[[\"John\",\"john00@mail.com\",\"john_newyork@mail.com\",\"johnsmith@mail.com\"],[\"John\",\"johnny@mail.com\",\"johnnybravo@mail.com\"],[\"Mary\",\"mary@mail.com\"]]\`

## Constraints
- \`1 <= accounts.length <= 1000\`
- \`2 <= accounts[i].length\`
- Each account name is not empty
- Emails are unique strings`,
  starterCode: `def accounts_merge(accounts):
    # Union all emails that appear together, then group by root
    pass`,
  hints: [
    {
      afterAttempt: 1,
      text: 'Use a Union-Find keyed by email rather than by account index.'
    },
    {
      afterAttempt: 2,
      text: 'Map each email to its owner name separately while DSU tracks connectivity.'
    },
    {
      afterAttempt: 3,
      text: 'After unions, gather emails belonging to each root and sort.'
    }
  ],
  solution: {
    afterAttempt: 3,
    text: `def accounts_merge(accounts):
    parent = {}

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[py] = px

    email_to_name = {}
    for acc in accounts:
        name = acc[0]
        first_email = acc[1]
        for email in acc[1:]:
            if email not in parent:
                parent[email] = email
            if first_email not in parent:
                parent[first_email] = first_email
            union(first_email, email)
            email_to_name[email] = name
        email_to_name[first_email] = name

    groups = {}
    for email in parent:
        root = find(email)
        groups.setdefault(root, []).append(email)

    result = []
    for root, emails in groups.items():
        result.append([email_to_name[root]] + sorted(emails))

    result.sort(key=lambda x: (x[0], x[1:]))
    return result`
  },
  solutionExplanation: `## 10-Minute Interview Thinking Process
### Step 1: Understand the Problem
- Accounts connect if any email overlaps; need canonical merged account per person.
### Step 2: Explore Examples
- John accounts share \`johnsmith@\`, so they merge.
### Step 3: Brute Force
- Comparing every pair of accounts is O(n² · emails).
### Step 4: Key Insight
- Union emails appearing in the same account; each connected component represents a person.
### Step 5: Optimized Solution
- DSU on email nodes + map to owner names. After unions, aggregate by root and sort.
### Step 6: Complexity
- Time: O(N·α(N) + E log E)
- Space: O(E) emails`,
  targetComplexity: {
    time: 'O(E log E)',
    space: 'O(E)'
  },
  testCases: [
    {
      input: '[[\"John\",\"a@mail.com\",\"b@mail.com\"],[\"John\",\"b@mail.com\",\"c@mail.com\"],[\"Mary\",\"mary@mail.com\"]]',
      expectedOutput: '[[\"John\",\"a@mail.com\",\"b@mail.com\",\"c@mail.com\"],[\"Mary\",\"mary@mail.com\"]]',
      description: 'shared emails merge'
    },
    {
      input: '[[\"Alex\",\"alex@mail.com\"],[\"Alex\",\"alex@mail.com\",\"alex2@mail.com\"]]',
      expectedOutput: '[[\"Alex\",\"alex@mail.com\",\"alex2@mail.com\"]]',
      description: 'single user multiple accounts'
    }
  ],
  requiredForProgress: false,
  difficulty: 'medium',
  isPracticeOnly: true,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
},
  {
  type: 'exercise',
  placement: 'module',
  id: 'lc-128-longest-consecutive',
  title: 'Code: Longest Consecutive Sequence',
  description: 'Find the longest consecutive sequence in an unsorted array.',
  instruction: `# 128. Longest Consecutive Sequence

Given an unsorted array of integers \`nums\`, return the length of the longest consecutive elements sequence.

You must write an algorithm that runs in **O(n)** time.

## Examples

**Example 1:**
\`\`\`
Input: nums = [100, 4, 200, 1, 3, 2]
Output: 4
Explanation: The longest consecutive sequence is [1, 2, 3, 4]. Length = 4.
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]
Output: 9
Explanation: [0, 1, 2, 3, 4, 5, 6, 7, 8]. Length = 9.
\`\`\`

## Constraints
- \`0 <= nums.length <= 10^5\`
- \`-10^9 <= nums[i] <= 10^9\`

## Note
This problem can be solved with HashSet (optimal) or Union-Find. Both achieve O(n).`,
  starterCode: `def longest_consecutive(nums):
    # Find longest consecutive sequence in O(n)
    pass`,
  hints: [
    {
      afterAttempt: 1,
      text: 'Union-Find approach: treat consecutive numbers as connected. Union num with num+1 if both exist.'
    },
    {
      afterAttempt: 2,
      text: 'HashSet approach: for each number, only start counting if num-1 doesn\'t exist (sequence start).'
    },
    {
      afterAttempt: 3,
      text: 'Track component sizes in Union-Find, or count forward from sequence starts with HashSet.'
    }
  ],
  solution: {
    afterAttempt: 3,
    text: `# Solution 1: Union-Find Approach
def longest_consecutive_uf(nums):
    if not nums:
        return 0
    
    parent = {}
    size = {}
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        if x not in parent or y not in parent:
            return
        px, py = find(x), find(y)
        if px != py:
            if size[px] < size[py]:
                px, py = py, px
            parent[py] = px
            size[px] += size[py]
    
    # Initialize each number as its own component
    for num in nums:
        if num not in parent:
            parent[num] = num
            size[num] = 1
    
    # Union consecutive numbers
    for num in nums:
        union(num, num + 1)
        union(num, num - 1)
    
    return max(size[find(num)] for num in parent) if parent else 0

# Solution 2: HashSet Approach (more elegant)
def longest_consecutive(nums):
    num_set = set(nums)
    longest = 0
    
    for num in num_set:
        # Only start counting from sequence beginning
        if num - 1 not in num_set:
            current = num
            length = 1
            
            while current + 1 in num_set:
                current += 1
                length += 1
            
            longest = max(longest, length)
    
    return longest`
  },
  solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem
- Find longest run of consecutive integers
- Array is unsorted: [100, 4, 200, 1, 3, 2]
- Must be O(n) - can't sort!

### Step 2: Explore Examples
- [100, 4, 200, 1, 3, 2] → sequence [1,2,3,4] → length 4
- Numbers don't need to be adjacent in array

### Step 3: Brute Force
\`\`\`python
def brute(nums):
    longest = 0
    for num in nums:
        current = num
        while current in nums:  # O(n) lookup
            current += 1
        longest = max(longest, current - num)
    return longest
\`\`\`
Time: O(n²) with list, O(n) with set but counts same sequences multiple times

### Step 4: Key Insight
**HashSet Approach:** Only start counting from "sequence starts" (numbers where num-1 doesn't exist)

**Union-Find Approach:** Union consecutive numbers, track component sizes

### Step 5: Optimized Solutions

**HashSet (Preferred):**
1. Put all numbers in a set
2. For each num where (num-1) NOT in set → it's a sequence start
3. Count forward: num, num+1, num+2... while in set
4. Track maximum length

**Union-Find:**
1. Each number is a node with size 1
2. Union num with num±1 if they exist
3. Track component sizes, return max

### Step 6: Complexity
- **Time:** O(n) - each number visited at most twice
- **Space:** O(n) for set/Union-Find

### Why HashSet is Better Here
- Simpler code
- Same complexity
- Union-Find overkill for this specific problem

### Key Takeaways
- "Only start from sequence beginning" eliminates redundant work
- Union-Find works but HashSet is more elegant here
- O(n) requirement rules out sorting`,
  targetComplexity: {
    time: 'O(n)',
    space: 'O(n)'
  },
  testCases: [
    {
      input: '[100, 4, 200, 1, 3, 2]',
      expectedOutput: '4',
      description: 'sequence 1-2-3-4'
    },
    {
      input: '[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]',
      expectedOutput: '9',
      description: 'sequence 0-8'
    },
    {
      input: '[]',
      expectedOutput: '0',
      description: 'empty array'
    },
    {
      input: '[1, 2, 0, 1]',
      expectedOutput: '3',
      description: 'with duplicates'
    }
  ],
  requiredForProgress: false,
  difficulty: 'medium',
  isPracticeOnly: true,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
},
  {
  type: 'exercise',
  placement: 'module',
  id: 'lc-305-number-of-islands-ii',
  title: 'Code: Number of Islands II',
  description: 'Count islands dynamically as land is added to the grid.',
  instruction: `# 305. Number of Islands II

You are given an empty 2D binary grid of size \`m x n\`. The grid represents a map where \`0\` represents water and \`1\` represents land.

Initially, all cells are water (\`0\`). You are given an array \`positions\` where \`positions[i] = [r_i, c_i]\` represents a cell to turn into land.

Return an array of integers \`answer\` where \`answer[i]\` is the number of islands after the \`i-th\` operation.

## Example

\`\`\`
Input: m = 3, n = 3
positions = [[0,0], [0,1], [1,2], [2,1]]
Output: [1, 1, 2, 3]

Step by step:
[0,0]: 1 island      [1,0,0]
                     [0,0,0]
                     [0,0,0]

[0,1]: 1 island      [1,1,0]  (connects to existing)
                     [0,0,0]
                     [0,0,0]

[1,2]: 2 islands     [1,1,0]
                     [0,0,1]  (separate island)
                     [0,0,0]

[2,1]: 3 islands     [1,1,0]
                     [0,0,1]
                     [0,1,0]  (another separate)
\`\`\`

## Constraints
- \`1 <= m, n <= 10^4\`
- \`1 <= positions.length <= 10^4\`
- \`positions[i].length == 2\``,
  starterCode: `def num_islands_2(m, n, positions):
    # Track islands dynamically as land is added
    pass`,
  hints: [
    {
      afterAttempt: 1,
      text: 'Standard BFS/DFS would be O(k · m · n) for k operations. Use Union-Find for efficiency.'
    },
    {
      afterAttempt: 2,
      text: 'When adding land at (r,c): increment island count, then union with any adjacent land (which may decrement count).'
    },
    {
      afterAttempt: 3,
      text: 'Use a set to track which cells are land. Handle duplicates in positions (adding land twice).'
    }
  ],
  solution: {
    afterAttempt: 3,
    text: `def num_islands_2(m, n, positions):
    parent = {}
    rank = {}
    count = 0
    result = []
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        nonlocal count
        px, py = find(x), find(y)
        if px == py:
            return
        if rank[px] < rank[py]:
            parent[px] = py
        elif rank[px] > rank[py]:
            parent[py] = px
        else:
            parent[py] = px
            rank[px] += 1
        count -= 1  # Merged two islands into one
    
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    land = set()
    
    for r, c in positions:
        if (r, c) in land:
            result.append(count)
            continue
        
        # Add new land
        land.add((r, c))
        parent[(r, c)] = (r, c)
        rank[(r, c)] = 0
        count += 1  # New island
        
        # Union with adjacent land
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if (nr, nc) in land:
                union((r, c), (nr, nc))
        
        result.append(count)
    
    return result`
  },
  solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem
- Start with empty grid (all water)
- Add land one position at a time
- After each addition, report total island count
- Key: need DYNAMIC connectivity updates

### Step 2: Explore Examples
\`\`\`
Add (0,0): count=1  (new island)
Add (0,1): count=1  (connects to (0,0))
Add (1,2): count=2  (separate, no neighbors)
Add (2,1): count=3  (separate, no neighbors)
\`\`\`

### Step 3: Brute Force
\`\`\`python
def brute(m, n, positions):
    grid = [[0]*n for _ in range(m)]
    result = []
    for r, c in positions:
        grid[r][c] = 1
        # Run BFS/DFS to count islands from scratch
        count = count_islands_bfs(grid)
        result.append(count)
    return result
\`\`\`
Time: O(k · m · n) - recounting all islands each time!

### Step 4: Key Insight
Use Union-Find for incremental updates:
- Adding land: count++
- Merging with neighbor: count--
- Each operation is O(α(k)) instead of O(m·n)

### Step 5: Optimized Solution
For each new land cell (r, c):
1. If already land, skip (handle duplicates)
2. Add to Union-Find, count++
3. Check 4 neighbors: if neighbor is land, union them
4. Each successful union decrements count
5. Record current count

### Step 6: Complexity
- **Time:** O(k · α(k)) ≈ O(k) for k operations
- **Space:** O(k) for positions added

### Why Union-Find Excels Here
- Dynamic connectivity: elements added over time
- Need to answer "how many components?" after each change
- BFS/DFS would recompute from scratch each time

### Key Takeaways
- "Number of Islands II" = classic Union-Find problem
- Track count: +1 for new land, -1 for each merge
- Handle duplicate positions gracefully`,
  targetComplexity: {
    time: 'O(k * α(k))',
    space: 'O(k)'
  },
  testCases: [
    {
      input: '3, 3, [[0,0],[0,1],[1,2],[2,1]]',
      expectedOutput: '[1, 1, 2, 3]',
      description: 'basic example'
    },
    {
      input: '1, 1, [[0,0]]',
      expectedOutput: '[1]',
      description: 'single cell'
    },
    {
      input: '3, 3, [[0,0],[0,1],[0,1]]',
      expectedOutput: '[1, 1, 1]',
      description: 'duplicate position'
    }
  ],
  requiredForProgress: false,
  difficulty: 'hard',
  isPracticeOnly: true,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
},
  // ============================================================================
  // ADVANCED (13-21): Constraints, weighted UF, rollback, MST
  // ============================================================================
  {
  type: 'exercise',
  placement: 'module',
  id: 'google-satisfiability-equality',
  title: 'Code: Satisfiability of Equality Equations',
  description: 'Decide whether all equality/inequality constraints can hold simultaneously.',
  instruction: `# Satisfiability of Equality Equations

You are given an array of strings \`equations\`, each representing either an equality (\`"a==b"\`) or inequality (\`"a!=b"\`) between two variables \`a\` and \`b\`. Return \`true\` if it is possible to assign integers to satisfy all equations, otherwise return \`false\`.

## Example

- Input: \`["a==b","b!=c","c==a"]\`
- Output: \`false\`

- Input: \`["c==c","b==d","x!=z"]\`
- Output: \`true\`

## Constraints
- \`1 <= equations.length <= 500\`
- Variables are lowercase English letters`,
  starterCode: `def equations_possible(equations):
    # Union equal variables, then verify inequalities
    pass`,
  hints: [
    {
      afterAttempt: 1,
      text: 'Process all equalities first so that DSU represents equivalence classes.'
    },
    {
      afterAttempt: 2,
      text: 'Inequalities should fail when both variables share the same root.'
    },
    {
      afterAttempt: 3,
      text: 'There are only 26 variables, so DSU can be a simple array.'
    }
  ],
  solution: {
    afterAttempt: 3,
    text: `def equations_possible(equations):
    parent = list(range(26))

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[py] = px

    # First union all equalities
    for eq in equations:
        if eq[1:3] == '==':
            a = ord(eq[0]) - ord('a')
            b = ord(eq[3]) - ord('a')
            union(a, b)

    # Then validate inequalities
    for eq in equations:
        if eq[1:3] == '!=':
            a = ord(eq[0]) - ord('a')
            b = ord(eq[3]) - ord('a')
            if find(a) == find(b):
                return False
    return True`
  },
  solutionExplanation: `## 10-Minute Interview Thinking Process
### Step 1: Understand the Problem
- Equalities form equivalence classes; inequalities must span different classes.
### Step 2: Explore Examples
- If a==b and b==c, then any inequality involving (a,c) fails.
### Step 3: Brute Force
- Trying assignments is exponential.
### Step 4: Key Insight
- Union-equals first, then check each inequality.
### Step 5: Optimized Solution
- DSU with 26 variables is trivial; just union and compare roots.
### Step 6: Complexity
- Time: O(n · α(26))
- Space: O(1)`,
  targetComplexity: {
    time: 'O(n)',
    space: 'O(1)'
  },
  testCases: [
    {
      input: '["a==b","b!=c","c==a"]',
      expectedOutput: 'false',
      description: 'conflict'
    },
    {
      input: '["c==c","b==d","x!=z"]',
      expectedOutput: 'true',
      description: 'consistent constraints'
    }
  ],
  requiredForProgress: false,
  difficulty: 'easy',
  isPracticeOnly: true,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
},
  {
  type: 'exercise',
  placement: 'module',
  id: 'lc-1101-earliest-friends',
  title: 'Code: Earliest Moment When Everyone Become Friends',
  description: 'Find the earliest time when all people are connected.',
  instruction: `# 1101. The Earliest Moment When Everyone Become Friends

There are \`n\` people in a social group labeled from \`0\` to \`n - 1\`. You are given an array \`logs\` where \`logs[i] = [timestamp_i, x_i, y_i]\` indicates that \`x_i\` and \`y_i\` will be friends at time \`timestamp_i\`.

Friendship is symmetric and transitive. Return the earliest time when every person became acquainted with every other person. Return \`-1\` if there is no such time.

## Examples

**Example 1:**
\`\`\`
Input: logs = [[20190101,0,1],[20190104,3,4],[20190107,2,3],[20190211,1,5],
               [20190224,2,4],[20190301,0,3],[20190312,1,2],[20190322,4,5]], n = 6
Output: 20190301
Explanation: At time 20190301, all people [0,1,2,3,4,5] become connected.
\`\`\`

**Example 2:**
\`\`\`
Input: logs = [[0,2,0],[1,0,1],[3,0,3],[4,1,2],[7,3,1]], n = 4
Output: 3
\`\`\`

## Constraints
- \`2 <= n <= 100\`
- \`1 <= logs.length <= 10^4\`
- \`logs[i].length == 3\`
- All timestamps are unique`,
  starterCode: `def earliest_acq(logs, n):
    # Sort by timestamp, union friends, return when all connected
    pass`,
  hints: [
    {
      afterAttempt: 1,
      text: 'Sort logs by timestamp first to process friendships in order.'
    },
    {
      afterAttempt: 2,
      text: 'Track number of components. When it reaches 1, everyone is connected.'
    },
    {
      afterAttempt: 3,
      text: 'Each successful union reduces component count by 1. Start with n components.'
    }
  ],
  solution: {
    afterAttempt: 3,
    text: `def earliest_acq(logs, n):
    parent = list(range(n))
    rank = [0] * n
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px == py:
            return False
        if rank[px] < rank[py]:
            parent[px] = py
        elif rank[px] > rank[py]:
            parent[py] = px
        else:
            parent[py] = px
            rank[px] += 1
        return True
    
    # Sort by timestamp
    logs.sort(key=lambda x: x[0])
    
    components = n
    for timestamp, x, y in logs:
        if union(x, y):
            components -= 1
            if components == 1:
                return timestamp
    
    return -1`
  },
  solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem
- We have n people and friendship events with timestamps
- Need to find when ALL people become connected (directly or transitively)
- This is asking: when does the graph become a single connected component?

### Step 2: Explore Examples
- 6 people, process friendships in time order
- Track connected components: 6 → 5 → 4 → ... → 1
- When components = 1, everyone is friends

### Step 3: Brute Force
\`\`\`python
def earliest_acq_brute(logs, n):
    logs.sort(key=lambda x: x[0])
    for i in range(len(logs)):
        # Build graph up to log i
        # Run DFS/BFS to count components
        # If 1 component, return timestamp
        # O(k * n) per check = O(k^2 * n) total
    return -1
\`\`\`
Time: O(k² · n) where k = number of logs

### Step 4: Key Insight
- Union-Find lets us track components dynamically
- Each successful union() decrements component count
- When count hits 1, all connected!

### Step 5: Optimized Solution
1. Sort logs by timestamp
2. Initialize n components
3. Process each log: if union succeeds, decrement count
4. Return timestamp when count = 1

### Step 6: Complexity
- **Time:** O(k log k + k · α(n)) ≈ O(k log k) for sorting
- **Space:** O(n) for Union-Find structure

### Key Takeaways
- "All connected" = single connected component
- Sort events chronologically when order matters
- Union-Find excels at dynamic connectivity`,
  targetComplexity: {
    time: 'O(k log k)',
    space: 'O(n)'
  },
  testCases: [
    {
      input: '[[20190101,0,1],[20190104,3,4],[20190107,2,3],[20190211,1,5],[20190224,2,4],[20190301,0,3],[20190312,1,2],[20190322,4,5]], 6',
      expectedOutput: '20190301',
      description: 'all become friends at 20190301'
    },
    {
      input: '[[0,2,0],[1,0,1],[3,0,3],[4,1,2],[7,3,1]], 4',
      expectedOutput: '3',
      description: 'all connected at time 3'
    },
    {
      input: '[[0,0,1]], 3',
      expectedOutput: '-1',
      description: 'not all connected'
    }
  ],
  requiredForProgress: false,
  difficulty: 'medium',
  isPracticeOnly: true,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
},
  {
  type: 'exercise',
  placement: 'module',
  id: 'exercise-connectivity-with-constraints',
  title: 'Connectivity With Cost Constraints',
  difficulty: 'hard',
  description: 'Check connectivity where edges have costs and only edges below threshold count',
  requiredForProgress: false,
  instruction: `# Connectivity With Cost Constraints

Given weighted edges, answer queries: "Are A and B connected using only edges with cost ≤ limit?"

**Example:**
\`\`\`
n = 5
edges = [[0,1,2], [1,2,4], [2,3,1], [3,4,7]]  # [u, v, cost]
queries = [[0,3,4], [0,4,6]]  # [a, b, limit]

Query 1: 0 to 3, limit=4
  - Can use edges with cost ≤ 4: [0,1,2], [1,2,4], [2,3,1]
  - Path: 0→1→2→3 ✓

Query 2: 0 to 4, limit=6
  - Edge [3,4,7] costs 7 > 6, can't use it
  - No path from 0 to 4 ✗

Output: [True, False]
\`\`\`

**Strategy:**
Sort edges by cost, sort queries by limit. Process together!`,
  starterCode: `def connectivity_with_limits(n, edges, queries):
    """Answer connectivity queries with edge cost constraints."""
    # TODO: Sort edges and queries, process together
    pass`,
  targetComplexity: {
    time: 'O(E log E + Q log Q)',
    space: 'O(n + Q)'
  },
  targetFunction: 'connectivity_with_limits',
  testCases: [
    { input: '5, [[0,1,2], [1,2,4], [2,3,1], [3,4,7]], [[0,3,4], [0,4,6], [0,4,8]]', expectedOutput: '[True, False, True]' },
    { input: '3, [[0,1,5], [1,2,5]], [[0,2,4], [0,2,5]]', expectedOutput: '[False, True]' }
  ],
  hints: [
    { afterAttempt: 1, text: 'Sort both edges (by cost) and queries (by limit)' },
    { afterAttempt: 2, text: 'For each query, add all edges with cost ≤ limit before checking connectivity' },
    { afterAttempt: 3, text: 'Keep original query indices to return answers in correct order' }
  ],
  solution: {
    afterAttempt: 3,
    text: `def connectivity_with_limits(n, edges, queries):
    parent = list(range(n))

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py

    # Sort edges by cost
    edges_sorted = sorted(edges, key=lambda e: e[2])

    # Sort queries by limit, keep original index
    queries_indexed = sorted(enumerate(queries), key=lambda x: x[1][2])

    result = [False] * len(queries)
    edge_idx = 0

    for orig_idx, (a, b, limit) in queries_indexed:
        # Add all edges with cost <= limit
        while edge_idx < len(edges_sorted) and edges_sorted[edge_idx][2] <= limit:
            u, v, _ = edges_sorted[edge_idx]
            union(u, v)
            edge_idx += 1

        # Answer query
        result[orig_idx] = find(a) == find(b)

    return result`
  },
  solutionExplanation: `This is the "offline query" technique with constraints:

1. Sort edges by cost (ascending)
2. Sort queries by limit (ascending), keep original indices
3. Process queries in order of increasing limit:
   - Before each query, add all edges with cost ≤ query's limit
   - Check if query nodes are connected
4. Return results in original query order

Key insight: As limit increases, we only ADD edges (never remove).
So we can process queries in sorted order and incrementally build the graph.

Time: O(E log E + Q log Q + (E + Q) * α(n))
Space: O(n + Q)`,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
},
  {
  type: 'exercise',
  placement: 'module',
  id: 'google-evaluate-division',
  title: 'Code: Evaluate Division',
  description: 'Evaluate division queries using relationships from equations.',
  instruction: `# Evaluate Division

You are given an array of equations where \`equations[i] = [Ai, Bi]\` represents the equation \`Ai / Bi = values[i]\`. You are also given queries where \`queries[j] = [Cj, Dj]\` asks for the value of \`Cj / Dj\`.

Return the answer for each query. If the equation cannot be evaluated, return \`-1.0\` for that query.

Use Union-Find with weights so that each variable belongs to a component whose root encodes the conversion rate.

## Examples

**Example 1:**
- Input: \`equations = [[\"a\",\"b\"],[\"b\",\"c\"]], \`values = [2.0,3.0]\`, \`queries = [[\"a\",\"c\"],[\"b\",\"a\"],[\"a\",\"e\"],[\"a\",\"a\"],[\"x\",\"x\"]]\`
- Output: \`[6.0,0.5,-1.0,1.0,-1.0]\`
- Explanation: We can derive \`a/c = 2 * 3 = 6\` and the reverse \`b/a = 1/2\`.

**Example 2:**
- Input: \`[[\"x\",\"y\"],[\"y\",\"z\"]], [4.0,2.0], [[\"x\",\"z\"],[\"z\",\"x\"],[\"x\",\"w\"],[\"x\",\"x\"]]\`
- Output: \`[8.0,0.125,-1.0,1.0]\`

## Constraints

- \`1 <= equations.length, values.length <= 20\`
- \`0 <= queries.length <= 20\`
- \`Ai\`, \`Bi\`, \`Cj\`, \`Dj\` consist of lowercase letters only
- Division by zero does not occur
- If the answer does not exist, return \`-1.0\``,
  starterCode: `def calc_equation(equations, values, queries):
    # Build weighted DSU and evaluate queries
    pass`,
  hints: [
    {
      afterAttempt: 1,
      text: 'Treat each variable as a node. When you union A/B = k, store the ratio between parents.'
    },
    {
      afterAttempt: 2,
      text: 'Maintain a weight map so weight[x] represents x/root. The ratio between two variables is weight[x] / weight[y] once roots match.'
    },
    {
      afterAttempt: 3,
      text: 'Remember to initialize unseen variables so that every symbol is in the disjoint set.'
    }
  ],
  solution: {
    afterAttempt: 3,
    text: `def calc_equation(equations, values, queries):
    parent = {}
    weight = {}

    def find(x):
        if parent[x] != x:
            px = parent[x]
            root = find(px)
            weight[x] *= weight[px]
            parent[x] = root
        return parent[x]

    def union(x, y, value):
        if x not in parent:
            parent[x] = x
            weight[x] = 1.0
        if y not in parent:
            parent[y] = y
            weight[y] = 1.0
        px, py = find(x), find(y)
        if px == py:
            return
        parent[px] = py
        weight[px] = weight[y] * value / weight[x]

    for (a, b), val in zip(equations, values):
        if a not in parent:
            parent[a] = a
            weight[a] = 1.0
        if b not in parent:
            parent[b] = b
            weight[b] = 1.0
        union(a, b, val)

    result = []
    for c, d in queries:
        if c not in parent or d not in parent:
            result.append(-1.0)
            continue
        pc, pd = find(c), find(d)
        if pc != pd:
            result.append(-1.0)
        else:
            result.append(weight[c] / weight[d])
    return result`
  },
  solutionExplanation: `## 10-Minute Interview Thinking Process
### Step 1: Understand the Problem
- Each equation ties two symbols with a ratio. Queries ask for any reachable ratio.
### Step 2: Explore Examples
- Convert \`a/b=2\`, \`b/c=3\` to get \`a/c=6\` and \`c/a=1/6\`.
### Step 3: Brute Force
- DFS for every query works but re-traverses graphs repeatedly.
### Step 4: Key Insight
- Union-Find with weights stores conversion factors relative to component roots so queries become O(α(n)).
### Step 5: Optimized Solution
- When unioning \`a/b=k\`, connect roots and adjust child weight so \`weight[a_root] * k = weight[b_root]\`.
### Step 6: Complexity
- Time: O((E+Q)·α(n))
- Space: O(N) variables`,
  targetComplexity: {
    time: 'O((E + Q) * α(N))',
    space: 'O(N)'
  },
  testCases: [
    {
      input: '[[\"a\",\"b\"],[\"b\",\"c\"]], [2.0,3.0], [[\"a\",\"c\"],[\"b\",\"a\"],[\"a\",\"e\"],[\"a\",\"a\"],[\"x\",\"x\"]]',
      expectedOutput: '[6.0,0.5,-1.0,1.0,-1.0]',
      description: 'mixed reachable/unreachable'
    },
    {
      input: '[[\"x\",\"y\"],[\"y\",\"z\"]], [4.0,2.0], [[\"x\",\"z\"],[\"z\",\"x\"],[\"x\",\"w\"],[\"x\",\"x\"]]',
      expectedOutput: '[8.0,0.125,-1.0,1.0]',
      description: 'second sample'
    }
  ],
  requiredForProgress: false,
  difficulty: 'medium',
  isPracticeOnly: true,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
},
  {
  type: 'exercise',
  placement: 'module',
  id: 'google-remove-stones',
  title: 'Code: Remove Stones to Minimize Remaining',
  description: 'Use union-find to count connected components of stones sharing rows or columns.',
  instruction: `# Remove Stones to Minimize Remaining

On a 2D plane, we place \`n\` stones at integer coordinates. A stone can be removed if there is another stone in the same row or column. Determine the maximum number of stones that can be removed.

## Example

- Input: \`[[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]\`
- Output: \`5\`
- Explanation: Remove stones until one remains per connected component.

## Constraints
- \`1 <= stones.length <= 1000\`
- \`0 <= stones[i][j] <= 10^4\``,
  starterCode: `def remove_stones(stones):
    # Union stones by row and column groups
    pass`,
  hints: [
    {
      afterAttempt: 1,
      text: 'Think of each row and column as nodes; connect a stone\'s row node to its column node.'
    },
    {
      afterAttempt: 2,
      text: 'The answer is total stones minus number of connected components.'
    },
    {
      afterAttempt: 3,
      text: 'Compress row and column indices to avoid collisions (e.g., add offset for columns).'
    }
  ],
  solution: {
    afterAttempt: 3,
    text: `def remove_stones(stones):
    parent = {}

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[py] = px

    OFFSET = 100_001
    for r, c in stones:
        row = r
        col = c + OFFSET
        if row not in parent:
            parent[row] = row
        if col not in parent:
            parent[col] = col
        union(row, col)

    components = set()
    for node in parent:
        components.add(find(node))

    return len(stones) - len(components)`
  },
  solutionExplanation: `## 10-Minute Interview Thinking Process
### Step 1: Understand the Problem
- Remove stones while leaving at least one in each connected group of shared rows/columns.
### Step 2: Explore Examples
- Stones connected via row/column behave like graph components.
### Step 3: Brute Force
- DFS removal simulation is messy and inefficient.
### Step 4: Key Insight
- Build DSU connecting row nodes to column nodes for each stone. Component size k contributes k-1 removable stones.
### Step 5: Optimized Solution
- Use DSU with offset columns, union row and column for each stone, answer = n - #components.
### Step 6: Complexity
- Time: O(n · α(n))
- Space: O(n)`,
  targetComplexity: {
    time: 'O(n * α(n))',
    space: 'O(n)'
  },
  testCases: [
    {
      input: '[[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]',
      expectedOutput: '5',
      description: 'sample case'
    },
    {
      input: '[[0,0]]',
      expectedOutput: '0',
      description: 'single stone cannot be removed'
    }
  ],
  requiredForProgress: false,
  difficulty: 'medium',
  isPracticeOnly: true,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
},
  {
  type: 'exercise',
  placement: 'module',
  id: 'lc-959-regions-cut-by-slashes',
  title: 'Code: Regions Cut By Slashes',
  description: 'Count regions in a grid divided by / and \\ slashes.',
  instruction: `# 959. Regions Cut By Slashes

An \`n x n\` grid is composed of \`1 x 1\` squares where each \`1 x 1\` square consists of a \`'/'\`, \`'\\'\`, or blank space \`' '\`. These characters divide the square into contiguous regions.

Return the number of regions.

## Examples

**Example 1:**
\`\`\`
Input: grid = [" /","/ "]
Output: 2
\`\`\`

**Example 2:**
\`\`\`
Input: grid = [" /","  "]
Output: 1
\`\`\`

**Example 3:**
\`\`\`
Input: grid = ["/\\\\","\\\\/"]
Output: 5
Explanation: The 2x2 grid creates 5 separate regions.
\`\`\`

## Key Insight
Divide each cell into 4 triangles (North, East, South, West). 
- '/' connects NW with SW, and NE with SE
- '\\' connects NW with NE, and SW with SE
- ' ' connects all 4 triangles

## Constraints
- \`n == grid.length == grid[i].length\`
- \`1 <= n <= 30\`
- \`grid[i][j]\` is \`'/'\`, \`'\\'\`, or \`' '\``,
  starterCode: `def regions_by_slashes(grid):
    # Subdivide each cell into 4 triangles, use Union-Find
    pass`,
  hints: [
    {
      afterAttempt: 1,
      text: 'Think of each 1x1 cell as 4 triangular regions: North (0), East (1), South (2), West (3).'
    },
    {
      afterAttempt: 2,
      text: 'For "/": union(N,W) and union(S,E). For "\\": union(N,E) and union(S,W). For " ": union all 4.'
    },
    {
      afterAttempt: 3,
      text: 'Also union adjacent triangles between cells: cell[r][c].South with cell[r+1][c].North, etc.'
    }
  ],
  solution: {
    afterAttempt: 3,
    text: `def regions_by_slashes(grid):
    n = len(grid)
    # Each cell has 4 triangles: 0=North, 1=East, 2=South, 3=West
    parent = list(range(4 * n * n))
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py
    
    def index(r, c, k):
        return (r * n + c) * 4 + k
    
    N, E, S, W = 0, 1, 2, 3
    
    for r in range(n):
        for c in range(n):
            # Connect within cell based on character
            if grid[r][c] == '/':
                union(index(r, c, N), index(r, c, W))
                union(index(r, c, S), index(r, c, E))
            elif grid[r][c] == '\\\\':
                union(index(r, c, N), index(r, c, E))
                union(index(r, c, S), index(r, c, W))
            else:  # space
                union(index(r, c, N), index(r, c, E))
                union(index(r, c, E), index(r, c, S))
                union(index(r, c, S), index(r, c, W))
            
            # Connect to adjacent cells
            if r > 0:  # Connect to cell above
                union(index(r, c, N), index(r-1, c, S))
            if c > 0:  # Connect to cell left
                union(index(r, c, W), index(r, c-1, E))
    
    # Count unique roots
    return len(set(find(i) for i in range(4 * n * n)))`
  },
  solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem
- Grid cells contain '/', '\\', or ' '
- These create regions we need to count
- Challenge: slashes cut cells diagonally!

### Step 2: Explore Examples
\`\`\`
" /"    Each slash divides its cell diagonally.
"/ "    Creates 2 separate triangular regions.
\`\`\`

### Step 3: Brute Force (Upscaling)
\`\`\`python
def regions_brute(grid):
    # Scale each cell to 3x3 and draw slashes
    # Then run flood fill to count regions
    # Works but uses 9x memory
\`\`\`
Time: O(n²), Space: O(9n²)

### Step 4: Key Insight - Triangle Subdivision
Divide each 1x1 cell into 4 triangles:
\`\`\`
    N
   /|\\
  W-+-E
   \\|/
    S
\`\`\`
- '/' connects N↔W and S↔E (slash separates them)
- '\\' connects N↔E and S↔W
- ' ' connects all four N↔E↔S↔W

Adjacent cells share edges: my South = neighbor's North

### Step 5: Optimized Solution
1. Create 4n² nodes (4 triangles per cell)
2. For each cell, union based on character
3. Union adjacent triangles between cells
4. Count connected components

### Step 6: Complexity
- **Time:** O(n² · α(n²)) ≈ O(n²)
- **Space:** O(n²) for Union-Find

### Key Takeaways
- Geometric problems often need creative subdivision
- 4-triangle split handles diagonal cuts elegantly
- Alternative: upscale to 3x3 grid per cell`,
  targetComplexity: {
    time: 'O(n²)',
    space: 'O(n²)'
  },
  testCases: [
    {
      input: '[" /","/ "]',
      expectedOutput: '2',
      description: 'two triangular regions'
    },
    {
      input: '[" /","  "]',
      expectedOutput: '1',
      description: 'single connected region'
    },
    {
      input: '["  ","  "]',
      expectedOutput: '1',
      description: 'empty grid = 1 region'
    }
  ],
  requiredForProgress: false,
  difficulty: 'medium',
  isPracticeOnly: true,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
},
  {
  type: 'exercise',
  placement: 'module',
  id: 'lc-839-similar-string-groups',
  title: 'Code: Similar String Groups',
  description: 'Group strings that can be transformed via character swaps.',
  instruction: `# 839. Similar String Groups

Two strings \`X\` and \`Y\` are similar if we can swap two letters (at different positions) of \`X\` so that it equals \`Y\`. Also, two strings \`X\` and \`Y\` are similar if they are equal.

For example, \`"tars"\` and \`"rats"\` are similar (swap at positions 0 and 2), and \`"rats"\` and \`"arts"\` are similar, but \`"star"\` is not similar to \`"tars"\`, \`"rats"\`, or \`"arts"\`.

Together, these form two connected groups: \`{"tars", "rats", "arts"}\` and \`{"star"}\`. Notice that \`"tars"\` and \`"arts"\` are in the same group even though they are not similar (connected via \`"rats"\`).

Given a list of strings \`strs\`, return the number of groups.

## Examples

**Example 1:**
\`\`\`
Input: strs = ["tars","rats","arts","star"]
Output: 2
\`\`\`

**Example 2:**
\`\`\`
Input: strs = ["omv","ovm"]
Output: 1
\`\`\`

## Constraints
- \`1 <= strs.length <= 300\`
- \`1 <= strs[i].length <= 300\`
- \`strs[i]\` consists of lowercase letters only
- All words have the same length and are anagrams of each other`,
  starterCode: `def num_similar_groups(strs):
    # Group strings by transitive similarity
    pass`,
  hints: [
    {
      afterAttempt: 1,
      text: 'Two strings are similar if they differ in exactly 0 or 2 positions (and those 2 chars are swapped).'
    },
    {
      afterAttempt: 2,
      text: 'Compare all pairs and union similar strings. Count remaining components.'
    },
    {
      afterAttempt: 3,
      text: 'Optimization: if n is small compared to string length, compare all pairs. If string length is small, generate all possible swaps.'
    }
  ],
  solution: {
    afterAttempt: 3,
    text: `def num_similar_groups(strs):
    n = len(strs)
    parent = list(range(n))
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py
            return True
        return False
    
    def is_similar(s1, s2):
        diff = []
        for i in range(len(s1)):
            if s1[i] != s2[i]:
                diff.append(i)
                if len(diff) > 2:
                    return False
        # Similar if equal (0 diffs) or exactly 2 swapped positions
        if len(diff) == 0:
            return True
        if len(diff) == 2:
            i, j = diff
            return s1[i] == s2[j] and s1[j] == s2[i]
        return False
    
    # Compare all pairs
    for i in range(n):
        for j in range(i + 1, n):
            if is_similar(strs[i], strs[j]):
                union(i, j)
    
    # Count unique roots
    return len(set(find(i) for i in range(n)))`
  },
  solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem
- Similar = equal OR differ by exactly one swap
- Similarity is transitive (connected components)
- Count groups of transitively similar strings

### Step 2: Explore Examples
\`\`\`
"tars" ~ "rats" (swap t↔r)
"rats" ~ "arts" (swap r↔a)
So "tars" and "arts" are in same group via "rats"
"star" has no similar strings → separate group
Answer: 2 groups
\`\`\`

### Step 3: Brute Force
\`\`\`python
def brute(strs):
    # Build adjacency graph
    # Run DFS/BFS to count components
    # O(n² · L) to build graph
\`\`\`

### Step 4: Key Insight
Similarity is an equivalence relation (reflexive, symmetric, transitive) → Union-Find!

\`\`\`
is_similar(s1, s2):
  - Count positions where they differ
  - If 0: equal → similar
  - If 2: check if swapping makes them equal
  - Otherwise: not similar
\`\`\`

### Step 5: Optimized Solution
1. Check all pairs (i, j) for similarity
2. If similar, union(i, j)
3. Count connected components

### Step 6: Complexity
- **Time:** O(n² · L) where n = #strings, L = string length
  - n² pairs, O(L) per comparison
- **Space:** O(n) for Union-Find

### Advanced Optimization
If L is small: generate all single-swap variants of each string
If n is small: compare all pairs (current approach)

### Key Takeaways
- "Transitive similarity" = connected components
- Check similarity in O(L): count differences, verify swap
- All pairs comparison acceptable when n ≤ 300`,
  targetComplexity: {
    time: 'O(n² · L)',
    space: 'O(n)'
  },
  testCases: [
    {
      input: '["tars","rats","arts","star"]',
      expectedOutput: '2',
      description: 'two groups'
    },
    {
      input: '["omv","ovm"]',
      expectedOutput: '1',
      description: 'single group'
    },
    {
      input: '["abc","abc"]',
      expectedOutput: '1',
      description: 'identical strings'
    }
  ],
  requiredForProgress: false,
  difficulty: 'hard',
  isPracticeOnly: true,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
},
  {
  type: 'exercise',
  placement: 'module',
  id: 'exercise-union-with-rollback',
  title: 'Union-Find With Rollback',
  difficulty: 'hard',
  description: 'Implement Union-Find that can undo union operations',
  requiredForProgress: false,
  instruction: `# Union-Find With Rollback

Implement Union-Find that supports:
1. \`union(x, y)\` - merge components
2. \`find(x)\` - find representative
3. \`snapshot()\` - save current state
4. \`rollback()\` - restore to last snapshot

**Example:**
\`\`\`
union(0, 1)  # {0,1}, {2}
union(1, 2)  # {0,1,2}
snapshot()   # Save state
union(0, 3)  # {0,1,2,3}
find(3) == find(0)  # True
rollback()   # Restore to {0,1,2}, {3}
find(3) == find(0)  # False!
\`\`\`

**Key Insight:**
Cannot use path compression (makes rollback impossible).
Use union-by-rank without compression, store operations on a stack.`,
  starterCode: `class UnionFindRollback:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.history = []  # Stack of (node, old_parent, old_rank) or 'SNAPSHOT'

    def find(self, x):
        # NO path compression - just walk up
        while self.parent[x] != x:
            x = self.parent[x]
        return x

    def union(self, x, y):
        # TODO: Union and record history for rollback
        pass

    def snapshot(self):
        # TODO: Mark a restore point
        pass

    def rollback(self):
        # TODO: Restore to last snapshot
        pass`,
  targetComplexity: {
    time: 'O(log n) per operation',
    space: 'O(n + operations)'
  },
  targetFunction: 'UnionFindRollback',
  testCases: [
    { input: 'test_rollback_basic', expectedOutput: 'True' },
    { input: 'test_rollback_multiple', expectedOutput: 'True' }
  ],
  hints: [
    { afterAttempt: 1, text: 'Path compression destroys history - use union-by-rank only (O(log n) per find)' },
    { afterAttempt: 2, text: 'Before changing parent[x], save (x, parent[x], rank[x]) to history' },
    { afterAttempt: 3, text: 'On rollback, pop and restore until you hit a SNAPSHOT marker' }
  ],
  solution: {
    afterAttempt: 3,
    text: `class UnionFindRollback:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.history = []

    def find(self, x):
        # NO path compression!
        while self.parent[x] != x:
            x = self.parent[x]
        return x

    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False

        # Union by rank, record history
        if self.rank[px] < self.rank[py]:
            self.history.append((px, self.parent[px], self.rank[px]))
            self.parent[px] = py
        elif self.rank[px] > self.rank[py]:
            self.history.append((py, self.parent[py], self.rank[py]))
            self.parent[py] = px
        else:
            self.history.append((py, self.parent[py], self.rank[py]))
            self.history.append((px, self.parent[px], self.rank[px]))
            self.parent[py] = px
            self.rank[px] += 1
        return True

    def snapshot(self):
        self.history.append('SNAPSHOT')

    def rollback(self):
        while self.history and self.history[-1] != 'SNAPSHOT':
            node, old_parent, old_rank = self.history.pop()
            self.parent[node] = old_parent
            self.rank[node] = old_rank
        if self.history:
            self.history.pop()  # Remove SNAPSHOT marker

# Test functions
def test_rollback_basic():
    uf = UnionFindRollback(4)
    uf.union(0, 1)
    uf.union(1, 2)
    uf.snapshot()
    uf.union(2, 3)
    assert uf.find(0) == uf.find(3)
    uf.rollback()
    return uf.find(0) != uf.find(3)

def test_rollback_multiple():
    uf = UnionFindRollback(5)
    uf.snapshot()
    uf.union(0, 1)
    uf.snapshot()
    uf.union(2, 3)
    uf.rollback()
    return uf.find(0) == uf.find(1) and uf.find(2) != uf.find(3)`
  },
  solutionExplanation: `Rollback requires giving up path compression:

**Why no path compression?**
- Path compression flattens trees, losing parent history
- With it, we can't know what the original parents were

**Time complexity trade-off:**
- Standard UF: O(α(n)) ≈ O(1) with path compression
- Rollback UF: O(log n) with union-by-rank only

**History tracking:**
- Before each parent change, save (node, old_parent, old_rank)
- SNAPSHOT markers separate rollback points
- Rollback: pop and restore until SNAPSHOT

**Use cases:**
- Divide and conquer algorithms
- Game trees with undo
- Constraint satisfaction with backtracking`,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
},
  {
  type: 'exercise',
  placement: 'module',
  id: 'exercise-mst-progress',
  title: 'MST Weight Progress (Kruskal\'s)',
  difficulty: 'hard',
  description: 'Track the running MST weight as edges are added',
  requiredForProgress: false,
  instruction: `# MST Weight Progress

Implement Kruskal's MST algorithm and track the total MST weight after each edge is considered.

**Kruskal's Algorithm:**
1. Sort edges by weight
2. For each edge, if it connects two different components, add it to MST
3. Stop when MST has n-1 edges

**Example:**
\`\`\`
n = 4
edges = [[0,1,10], [0,2,6], [0,3,5], [1,3,15], [2,3,4]]

Sorted: [2,3,4], [0,3,5], [0,2,6], [0,1,10], [1,3,15]

Process:
1. [2,3,4]: Accept (different components). MST weight = 4
2. [0,3,5]: Accept. MST weight = 4 + 5 = 9
3. [0,2,6]: Accept. MST weight = 9 + 6 = 15
4. [0,1,10]: Accept. MST weight = 15 + 10 = 25. Done (n-1 = 3 edges)
5. [1,3,15]: Skip (0 and 3 already connected)

Final MST weight: 25
Progress: [4, 9, 15, 25]
\`\`\``,
  starterCode: `def kruskal_mst_progress(n, edges):
    """
    Return (mst_weight, progress) where:
    - mst_weight: total weight of MST
    - progress: list of running MST weights after each accepted edge
    """
    parent = list(range(n))

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py
            return True
        return False

    # TODO: Implement Kruskal's with progress tracking
    pass`,
  targetComplexity: {
    time: 'O(E log E)',
    space: 'O(n)'
  },
  targetFunction: 'kruskal_mst_progress',
  testCases: [
    { input: '4, [[0,1,10], [0,2,6], [0,3,5], [1,3,15], [2,3,4]]', expectedOutput: '(15, [4, 9, 15])' },
    { input: '3, [[0,1,1], [1,2,2], [0,2,3]]', expectedOutput: '(3, [1, 3])' },
    { input: '2, [[0,1,5]]', expectedOutput: '(5, [5])' }
  ],
  hints: [
    { afterAttempt: 1, text: 'Sort edges by weight first' },
    { afterAttempt: 2, text: 'Use Union-Find to check if edge connects different components' },
    { afterAttempt: 3, text: 'Track running total and stop after n-1 edges accepted' }
  ],
  solution: {
    afterAttempt: 3,
    text: `def kruskal_mst_progress(n, edges):
    parent = list(range(n))
    rank = [0] * n

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        px, py = find(x), find(y)
        if px == py:
            return False
        if rank[px] < rank[py]:
            parent[px] = py
        elif rank[px] > rank[py]:
            parent[py] = px
        else:
            parent[py] = px
            rank[px] += 1
        return True

    # Sort edges by weight
    edges_sorted = sorted(edges, key=lambda e: e[2])

    mst_weight = 0
    progress = []
    edges_used = 0

    for u, v, weight in edges_sorted:
        if union(u, v):  # Different components
            mst_weight += weight
            progress.append(mst_weight)
            edges_used += 1
            if edges_used == n - 1:  # MST complete
                break

    return (mst_weight, progress)`
  },
  solutionExplanation: `Kruskal's Algorithm with Union-Find:

1. **Sort edges** by weight (greedy: try cheapest first)
2. **For each edge (u, v, w):**
   - If find(u) ≠ find(v): edge connects different trees
   - Accept edge: union(u, v), add weight to total
   - Reject edge: would create cycle
3. **Stop** when n-1 edges accepted (MST property)

**Why Union-Find?**
- "Different components?" = O(α(n)) with find()
- "Merge components" = O(α(n)) with union()
- Total: O(E log E) for sorting + O(E · α(n)) for UF operations

**MST Properties:**
- Spans all n vertices
- Has exactly n-1 edges
- Minimum total weight
- No cycles`,
  conceptFamily: 'union-find',
  metadata: {
    failureCategory: 'union-find'
  }
}
];
