import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module8GraphsLessonSmartPracticeExercises: ExerciseSection[] = [
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-number-of-islands',
            title: 'Number of Islands',
            difficulty: 'medium',
            description: 'Count islands in a 2D grid using DFS',
            requiredForProgress: true,
            instruction: `# Number of Islands

**Interview Context:** This is a common question often asked at top tech companies in both coding screen and on-sites.

| Difficulty | Expected Time | Concepts Tested |
|------------|---------------|-----------------|
| Easy to Medium | 20-25 minutes | Iterating and managing a 2D array, Basic graph traversal DFS/BFS, Connected Components |

---

## Problem Description

You are given a 2D binary matrix as an input. You want to return the number of islands in the binary matrix. You can think of the 0's as the ocean and the 1's as land. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. Your goal is to return the correct number of islands.

### Formal Definition

For those that need a more formal definition:
- We define a **neighbor relation** as any two cells that are both 'on' (value 1) and share a north/south/east/west edge. We define 'adjacency' as N/S/E/W, and exclude diagonals.
- An **island** is the transitive closure of the neighbor relation. I.e., k's neighbors, its neighbors' neighbors, its neighbors' neighbors' neighbors, etc. comprise an island.

**NOTE:** This is a variation of the standard problem: "Counting number of connected components in an undirected graph".

---

## Examples

**Example 1:**
There are 6 islands in this matrix:
\`\`\`
{1, 1, 0, 0, 0},
{0, 1, 0, 0, 1},
{1, 0, 0, 1, 1},
{0, 0, 0, 0, 0},
{1, 0, 1, 0, 1}
\`\`\`

**Example 2:**
There is 1 island in this matrix:
\`\`\`
{1, 1, 1, 1, 1},
{1, 1, 1, 1, 1},
{1, 1, 1, 1, 1}
\`\`\`

**Example 3:**
\`\`\`
Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1
\`\`\`

**Example 4:**
\`\`\`
Input: grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3
\`\`\`

---

## Template Application (Step by Step)

This problem uses: **Template 2: DFS on Grid**

\`\`\`python
# TEMPLATE 2: DFS on Grid
def dfs_grid(grid, row, col):
    # Boundary check (SAME for all grid problems)
    if row < 0 or row >= len(grid) or col < 0 or col >= len(grid[0]):
        return

    # ✏️ CUSTOMIZE: What's an invalid cell?
    if grid[row][col] == "0":  # ← Changed: check for water "0"
        return

    # ✏️ CUSTOMIZE: How to mark visited?
    grid[row][col] = "0"  # ← Changed: mark as water (visited)

    # ✏️ CUSTOMIZE: Process cell? (Not needed here)

    # Explore 4 directions (SAME for all grid problems)
    dfs_grid(grid, row + 1, col)
    dfs_grid(grid, row - 1, col)
    dfs_grid(grid, row, col + 1)
    dfs_grid(grid, row, col - 1)
\`\`\`

## Constraints
- m == grid.length
- n == grid[i].length
- 1 <= m, n <= 300
- grid[i][j] is '0' or '1'`,
            starterCode: `def numIslands(grid):
    # Return the number of islands
    pass
`,
            hints: [
                { afterAttempt: 1, text: 'Start DFS from each unvisited land cell ("1").' },
                { afterAttempt: 2, text: 'In DFS, mark cells as visited by changing "1" to "0" or using a visited set.' },
                { afterAttempt: 3, text: 'Each DFS call marks one complete island. Count how many DFS calls you make.' }
            ],
            solution: {
                afterAttempt: 3,
                text: `def numIslands(grid):
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        # Boundary check and water check
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == "0":
            return

        grid[r][c] = "0"  # Mark as visited

        # Visit all 4 directions
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                dfs(r, c)  # Mark entire island
                count += 1

    return count
`
            },
            solutionExplanation: `## 🎯 This is a Classic Interview Problem

This problem is commonly asked at top tech companies because it tests:
- **2D array manipulation** - Iterating and managing a 2D array
- **Graph traversal** - Basic DFS/BFS understanding
- **Connected components** - Recognizing when to use graph algorithms

---

## 📊 Multiple Approaches

### Approach 1: DFS with Visited Matrix

**Idea:** Iterate through the 2D matrix. Whenever you reach a "1" that has not been visited yet, this is the start of a new island. Use a separate visited matrix to track explored cells.

\`\`\`python
def count_islands(matrix):
    visited = [[False] * len(matrix[0]) for _ in range(len(matrix))]
    num_islands = 0
    
    for row in range(len(matrix)):
        for col in range(len(matrix[row])):
            if not visited[row][col] and matrix[row][col] == "1":
                dfs(row, col, matrix, visited)
                num_islands += 1
    return num_islands

def dfs(row, col, matrix, visited):
    if (row in range(len(matrix)) and col in range(len(matrix[row]))
          and matrix[row][col] == "1"
          and not visited[row][col]):
        visited[row][col] = True
        dfs(row, col - 1, matrix, visited)  # explore left
        dfs(row, col + 1, matrix, visited)  # explore right
        dfs(row - 1, col, matrix, visited)  # explore up
        dfs(row + 1, col, matrix, visited)  # explore down
\`\`\`

**Complexity:**
- Time: O(m × n) - Visit each cell once
- Space: O(m × n) - Visited matrix storage

**Pros:** Preserves original input
**Cons:** Uses extra O(m × n) space

---

### Approach 2: DFS by Destroying Input (Recommended)

**Idea:** Same as Approach 1, but instead of allocating space for a visited matrix, we destroy the input (by changing visited islands to "0") and use that to keep track of elements that have already been explored.

\`\`\`python
def count_islands(matrix):
    num_islands = 0
    for row in range(len(matrix)):
        for col in range(len(matrix[row])):
            if matrix[row][col] == "1":
                dfs(row, col, matrix)
                num_islands += 1
    return num_islands

def dfs(row, col, matrix):
    if (row in range(len(matrix)) and col in range(len(matrix[row])) 
          and matrix[row][col] == "1"):
        matrix[row][col] = "0"  # Mark as visited
        dfs(row, col - 1, matrix)  # explore left
        dfs(row, col + 1, matrix)  # explore right
        dfs(row - 1, col, matrix)  # explore up
        dfs(row + 1, col, matrix)  # explore down
\`\`\`

**Complexity:**
- Time: O(m × n) - Visit each cell once
- Space: O(m × n) - Recursion stack (worst case)

**Pros:** No extra space for visited matrix
**Cons:** Modifies input (usually acceptable in interviews)

---

### Approach 3: Union-Find/Disjoint Set (Advanced)

**Idea:** This approach uses the Disjoint-Set data structure. It's more complex than DFS and generally not recommended for interviews unless specifically asked. For the curious, a solution is discussed here: https://leetcode.com/problems/number-of-islands/solution/

**Complexity:**
- Time: O(m × n × α(m × n)) where α is the inverse Ackermann function (effectively constant)
- Space: O(m × n) for the Union-Find structure

**When to mention:** Only if interviewer asks about alternative approaches or if you're discussing trade-offs.

---

## 🔴 Common Mistakes

### 1. Complicating the Initial Recursive Call

**Wrong:**
\`\`\`python
# Overcomplicating the check
if matrix[row][col] != None and matrix[row][col] == "1":
    if not visited[row][col]:
        if row > 0 and col > 0:  # Unnecessary checks
            dfs(row, col, matrix)
            num_islands += 1
\`\`\`

**Correct:**
\`\`\`python
# Simple and clean
if matrix[row][col] == "1":
    dfs(row, col, matrix)
    num_islands += 1
\`\`\`

**Why:** The simplest logic is to check if we have a valid new island and then flood the island. Unnecessary nested conditions make code harder to read and debug.

---

### 2. Forgetting Boundary Checks in DFS

**Wrong:**
\`\`\`python
def dfs(row, col, matrix):
    matrix[row][col] = "0"  # Crashes if out of bounds!
    dfs(row + 1, col, matrix)
    dfs(row - 1, col, matrix)
    dfs(row, col + 1, matrix)
    dfs(row, col - 1, matrix)
\`\`\`

**Correct:**
\`\`\`python
def dfs(row, col, matrix):
    # Check boundaries FIRST
    if (row < 0 or row >= len(matrix) or 
        col < 0 or col >= len(matrix[0]) or 
        matrix[row][col] != "1"):
        return
    
    matrix[row][col] = "0"
    dfs(row + 1, col, matrix)
    dfs(row - 1, col, matrix)
    dfs(row, col + 1, matrix)
    dfs(row, col - 1, matrix)
\`\`\`

**Why:** Always check boundaries before accessing array indices to avoid IndexError.

---

### 3. Counting Islands Incorrectly

**Wrong:**
\`\`\`python
count = 0
for row in range(len(matrix)):
    for col in range(len(matrix[row])):
        if matrix[row][col] == "1":
            count += 1  # Counts every "1", not islands!
            dfs(row, col, matrix)
\`\`\`

**Correct:**
\`\`\`python
count = 0
for row in range(len(matrix)):
    for col in range(len(matrix[row])):
        if matrix[row][col] == "1":
            dfs(row, col, matrix)  # Flood the island first
            count += 1  # Then count
\`\`\`

**Why:** We need to count the number of DFS calls (islands), not the number of land cells.

---

## 📈 Interview Decision Criteria

### ❌ No Hire
- Cannot produce the correct solution after multiple trials in an execution environment
- Has unnecessary if checks and recursive calls that complicate the code
- Cannot explain the time/space complexity
- Takes significantly longer than 25 minutes

### 🟡 Maybe Hire
- Needs only a few hints to get on track
- Produces a correct solution in 35 minutes or less
- Identifies bugs quickly and fixes them
- Can explain the approach but struggles with edge cases

### ✅ Hire Bar
- Needs no hints
- Produces a correct solution in 25 minutes or less
- Has clean, readable code
- No unnecessary if conditions and recursive calls
- Implements DFS with the correct base case for concise code
- Can discuss trade-offs between visited matrix vs. destroying input
- Mentions complexity unprompted

---

## 🧠 Key Takeaways

1. **Pattern:** Connected Components / Grid DFS - When you need to explore all connected cells in a 2D grid
2. **Tradeoff:** Visited matrix (preserves input) vs. Destroying input (saves space)
3. **Key Insight:** Each DFS call from the main loop marks one complete island. Count = number of DFS calls.
4. **Interview Tip:** Mention that this is essentially counting connected components in an undirected graph.`,
            targetComplexity: {
                time: 'O(m * n)',
                space: 'O(m * n)'
            },
            testCases: [
                { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expectedOutput: '1' },
                { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expectedOutput: '3' },
                { input: '[["1","1","0","0","0"],["0","1","0","0","1"],["1","0","0","1","1"],["0","0","0","0","0"],["1","0","1","0","1"]]', expectedOutput: '6' },
                { input: '[["1","1","1","1","1"],["1","1","1","1","1"],["1","1","1","1","1"]]', expectedOutput: '1' },
                { input: '[["1"]]', expectedOutput: '1' },
                { input: '[["0"]]', expectedOutput: '0' }
            ]
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-clone-graph',
            title: 'Clone Graph',
            difficulty: 'medium',
            description: 'Deep copy a connected undirected graph using DFS or BFS',
            requiredForProgress: true,
            instruction: `# Clone Graph (LeetCode 133)

Given a reference of a node in a **connected undirected graph**, return a **deep copy** (clone) of the graph.

Each node in the graph contains a value (int) and a list of its neighbors.

\`\`\`python
class Node:
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
\`\`\`

## The Challenge

You must:
1. Create new nodes (not just copy references)
2. Preserve the exact same structure
3. Handle cycles (a node can be its own neighbor's neighbor)

## Example

\`\`\`
Input: adjList = [[2,4],[1,3],[2,4],[1,3]]

Node 1 -- Node 2
 |   \\    /   |
 |    \\  /    |
Node 4 -- Node 3

Output: Clone of the above graph
\`\`\`

## Why This Problem Matters

Clone Graph tests your understanding of:
- Graph traversal (DFS or BFS)
- Handling cycles (the key challenge!)
- Hash map for tracking old → new node mapping

## Constraints
- The number of nodes is in the range [0, 100]
- Node.val is unique for each node
- There are no repeated edges or self-loops`,
            starterCode: `# class Node:
#     def __init__(self, val = 0, neighbors = None):
#         self.val = val
#         self.neighbors = neighbors if neighbors is not None else []

def cloneGraph(node):
    # Use a hash map to track: original node -> cloned node
    # This handles cycles!
    pass`,
            expectedOutput: `def cloneGraph(node):
    if not node:
        return None
    
    # Map: original node -> cloned node
    old_to_new = {}
    
    def dfs(node):
        # If already cloned, return the clone
        if node in old_to_new:
            return old_to_new[node]
        
        # Create clone (without neighbors first)
        clone = Node(node.val)
        old_to_new[node] = clone
        
        # Clone all neighbors
        for neighbor in node.neighbors:
            clone.neighbors.append(dfs(neighbor))
        
        return clone
    
    return dfs(node)`,
            hints: [
                { afterAttempt: 1, text: 'Use a hash map to track which nodes you\'ve already cloned. Map: original node -> cloned node.' },
                { afterAttempt: 2, text: 'When you visit a node: if already in map, return the clone. Otherwise, create a new clone, add to map, then clone neighbors recursively.' },
                { afterAttempt: 3, text: 'The hash map is crucial for cycles! When you encounter a node you\'ve seen, return its clone instead of creating a new one.' }
            ],
            solution: {
                afterAttempt: 4,
                text: `## Solution - O(V + E) time, O(V) space

\`\`\`python
def cloneGraph(node):
    if not node:
        return None
    
    old_to_new = {}  # original -> clone
    
    def dfs(node):
        if node in old_to_new:
            return old_to_new[node]
        
        clone = Node(node.val)
        old_to_new[node] = clone
        
        for neighbor in node.neighbors:
            clone.neighbors.append(dfs(neighbor))
        
        return clone
    
    return dfs(node)
\`\`\`

**Key insight:** The hash map handles cycles by returning existing clones.`
            },
            solutionExplanation: `## The Brute-Force Trap

Your first instinct might be:
\`\`\`python
def cloneGraph(node):
    clone = Node(node.val)
    for neighbor in node.neighbors:
        clone.neighbors.append(cloneGraph(neighbor))
    return clone
\`\`\`

**This causes infinite recursion!** In a cycle like A → B → A, you'd clone A, then clone B, then clone A again... forever.

---

## The Key Insight: Remember What You've Cloned

The fix is simple but crucial: **use a hash map to track what you've already cloned**.

Before cloning any node, check:
- Already cloned? Return the existing clone
- Not cloned? Create new clone, store it, then clone neighbors

\`\`\`python
old_to_new = {}  # original node -> cloned node

def dfs(node):
    if node in old_to_new:
        return old_to_new[node]  # Already cloned!
    
    clone = Node(node.val)
    old_to_new[node] = clone  # Store BEFORE recursing
    
    for neighbor in node.neighbors:
        clone.neighbors.append(dfs(neighbor))
    
    return clone
\`\`\`

---

## Why Store Before Recursing?

Consider a cycle: A → B → A

\`\`\`
1. dfs(A): A not in map → create clone_A, store old_to_new[A] = clone_A
2. Clone A's neighbors → dfs(B)
3. dfs(B): B not in map → create clone_B, store old_to_new[B] = clone_B
4. Clone B's neighbors → dfs(A)
5. dfs(A): A IS in map → return clone_A (no infinite loop!)
6. clone_B.neighbors.append(clone_A)
7. Back to step 2: clone_A.neighbors.append(clone_B)
\`\`\`

**The hash map breaks the cycle!**

---

## BFS Alternative

You can also use BFS (sometimes cleaner for graphs):

\`\`\`python
def cloneGraph(node):
    if not node:
        return None
    
    old_to_new = {node: Node(node.val)}
    queue = [node]
    
    while queue:
        curr = queue.pop(0)
        for neighbor in curr.neighbors:
            if neighbor not in old_to_new:
                old_to_new[neighbor] = Node(neighbor.val)
                queue.append(neighbor)
            old_to_new[curr].neighbors.append(old_to_new[neighbor])
    
    return old_to_new[node]
\`\`\`

Both are O(V + E) time, O(V) space.

---

## The Pattern

**Graph cloning = traversal + hash map for visited**

This pattern appears whenever you need to:
- Copy a structure with cycles
- Transform nodes while preserving connections
- Avoid infinite loops in cyclic structures`,
            targetComplexity: {
                time: 'O(V + E)',
                space: 'O(V)'
            },
            testCases: [
                { input: '[[2,4],[1,3],[2,4],[1,3]]', expectedOutput: '[[2,4],[1,3],[2,4],[1,3]]' },
                { input: '[[]]', expectedOutput: '[[]]' },
                { input: '[]', expectedOutput: '[]' }
            ]
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-course-schedule',
            title: 'Course Schedule (Cycle Detection)',
            difficulty: 'medium',
            description: 'Detect if all courses can be finished using cycle detection',
            requiredForProgress: true,
            instruction: `# Course Schedule (CYCLE DETECTION DEMO)

This introduces a new pattern: **Cycle Detection in Directed Graphs** using 3-color DFS.

---

## Which Template?

This uses: **Template 1: DFS on Graph** with **3-color cycle detection**

## The 3-Color Pattern

Instead of just "visited" (yes/no), use THREE states:

\`\`\`python
UNVISITED = 0  # Haven't explored yet
VISITING = 1   # Currently in DFS path (on the stack)
VISITED = 2    # Completely processed

# If we reach a VISITING node → CYCLE FOUND!
\`\`\`

\`\`\`
       ┌──────────────────────────────────┐
       │  DFS explores: 0 → 1 → 2 → 3     │
       │                                  │
       │  If 3 points back to 1 (VISITING)│
       │  → That's a cycle!               │
       └──────────────────────────────────┘
\`\`\`

## What to Change from Basic DFS

| Basic DFS Template | Cycle Detection |
|-------------------|-----------------|
| \`visited = set()\` | \`state = [0] * n\` (3 colors) |
| \`if node in visited\` | \`if state[node] == VISITING\` → cycle! |
| \`visited.add(node)\` | \`state[node] = VISITING\` (before), \`state[node] = VISITED\` (after) |

---

## Problem

There are a total of numCourses courses you have to take. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates you must take course bi first to take course ai.

Return **true** if you can finish all courses. Otherwise, return **false**.

## Examples

Example 1:
\`\`\`
Input: numCourses = 2, prerequisites = [[1,0]]
Output: true
Explanation: Take course 0, then course 1.
\`\`\`

Example 2:
\`\`\`
Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false
Explanation: Circular dependency! Course 1 requires 0, and 0 requires 1.
\`\`\`

## Key Insight

- Courses are nodes, prerequisites are directed edges
- If there's a cycle → impossible to complete all courses
- No cycle → can complete all courses

## Constraints
- 1 <= numCourses <= 2000
- 0 <= prerequisites.length <= 5000`,
            starterCode: `def canFinish(numCourses, prerequisites):
    # Return True if all courses can be finished
    pass
`,
            hints: [
                { afterAttempt: 1, text: 'Build an adjacency list from prerequisites. Edge from prereq to course.' },
                { afterAttempt: 2, text: 'Use three states: UNVISITED, VISITING, VISITED. A cycle exists if you visit a VISITING node.' },
                { afterAttempt: 3, text: 'Check all nodes - some courses might not have prerequisites but still be part of a cycle.' }
            ],
            solution: {
                afterAttempt: 3,
                text: `def canFinish(numCourses, prerequisites):
    # Build adjacency list
    graph = [[] for _ in range(numCourses)]
    for course, prereq in prerequisites:
        graph[prereq].append(course)

    # 0=unvisited, 1=visiting, 2=visited
    state = [0] * numCourses

    def hasCycle(course):
        if state[course] == 1:
            return True  # Cycle detected!
        if state[course] == 2:
            return False  # Already processed

        state[course] = 1  # Mark as visiting

        for next_course in graph[course]:
            if hasCycle(next_course):
                return True

        state[course] = 2  # Mark as visited
        return False

    # Check all courses
    for course in range(numCourses):
        if hasCycle(course):
            return False

    return True
`
            },
            targetComplexity: {
                time: 'O(n + m)',
                space: 'O(n + m)'
            },
            testCases: [
                { input: '2, [[1,0]]', expectedOutput: 'True' },
                { input: '2, [[1,0],[0,1]]', expectedOutput: 'False' },
                { input: '3, [[1,0],[2,1]]', expectedOutput: 'True' },
                { input: '4, [[1,0],[2,1],[3,2],[1,3]]', expectedOutput: 'False' }
            ]
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-course-schedule-ii',
            title: 'Course Schedule II (Topological Sort)',
            difficulty: 'medium',
            description: 'Return course ordering using topological sort - extends cycle detection',
            requiredForProgress: true,
            instruction: `# Course Schedule II (EXTENDS CYCLE DETECTION)

**Key Insight:** You already solved Course Schedule I. This is the SAME CODE with ONE line added!

---

## From Cycle Detection → Topological Sort

\`\`\`python
# Course Schedule I (Cycle Detection)         # Course Schedule II (Topological Sort)
def hasCycle(course):                         def dfs(course):
    if state[course] == VISITING:                 if state[course] == VISITING:
        return True  # Cycle!                         return True  # Cycle!
    if state[course] == VISITED:                  if state[course] == VISITED:
        return False                                  return False

    state[course] = VISITING                      state[course] = VISITING

    for next_course in graph[course]:             for next_course in graph[course]:
        if hasCycle(next_course):                     if dfs(next_course):
            return True                                   return True

    state[course] = VISITED                       state[course] = VISITED
    return False                                  result.append(course)  # ← ONLY ADDITION!
                                                  return False
\`\`\`

**The insight:** When we finish processing a course (mark it VISITED), ALL its prerequisites have been added to result. So we add it AFTER its children = **post-order traversal** = topological order!

---

## Problem

There are \`numCourses\` courses labeled from 0 to numCourses - 1. You are given an array \`prerequisites\` where \`prerequisites[i] = [ai, bi]\` indicates you must take course bi first to take course ai.

Return the ordering of courses you should take to finish all courses. If there are multiple valid orderings, return any of them. If impossible (cycle exists), return an empty array.

## Examples

Example 1:
\`\`\`
Input: numCourses = 2, prerequisites = [[1,0]]
Output: [0,1]
Explanation: Take course 0 first, then course 1.
\`\`\`

Example 2:
\`\`\`
Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
Output: [0,1,2,3] or [0,2,1,3]
Explanation: Multiple valid orderings exist.
\`\`\`

Example 3:
\`\`\`
Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: []
Explanation: Cycle detected - impossible!
\`\`\`

## Constraints
- 1 <= numCourses <= 2000
- 0 <= prerequisites.length <= 5000`,
            starterCode: `def findOrder(numCourses, prerequisites):
    # Return course ordering, or [] if impossible
    # Hint: Use your Course Schedule I code and add ONE line!
    pass
`,
            hints: [
                { afterAttempt: 1, text: 'Start with your Course Schedule I (cycle detection) code. It already has the 3-color DFS!' },
                { afterAttempt: 2, text: 'The key insight: when you mark a node as VISITED (done processing), add it to the result. This is post-order traversal.' },
                { afterAttempt: 3, text: 'Since we add nodes in post-order, we need to reverse the result at the end (or use appendleft with deque).' }
            ],
            solution: {
                afterAttempt: 3,
                text: `def findOrder(numCourses, prerequisites):
    # Build adjacency list
    graph = [[] for _ in range(numCourses)]
    for course, prereq in prerequisites:
        graph[prereq].append(course)

    # 0=unvisited, 1=visiting, 2=visited
    state = [0] * numCourses
    result = []

    def dfs(course):
        if state[course] == 1:
            return True  # Cycle!
        if state[course] == 2:
            return False

        state[course] = 1  # Mark as visiting

        for next_course in graph[course]:
            if dfs(next_course):
                return True

        state[course] = 2  # Mark as visited
        result.append(course)  # ← THE ONLY ADDITION!
        return False

    # Check all courses
    for course in range(numCourses):
        if dfs(course):
            return []  # Cycle found

    return result[::-1]  # Reverse for correct order
`
            },
            solutionExplanation: `## The Code Reuse Insight

Look at how little changed from Course Schedule I:

\`\`\`diff
  def findOrder(numCourses, prerequisites):
      graph = [[] for _ in range(numCourses)]
      for course, prereq in prerequisites:
          graph[prereq].append(course)

      state = [0] * numCourses
+     result = []  # NEW: Track ordering

      def dfs(course):
          if state[course] == 1:
              return True
          if state[course] == 2:
              return False

          state[course] = 1

          for next_course in graph[course]:
              if dfs(next_course):
                  return True

          state[course] = 2
+         result.append(course)  # NEW: Add after children
          return False

      for course in range(numCourses):
          if dfs(course):
-             return False
+             return []

-     return True
+     return result[::-1]
\`\`\`

**Just 3 lines changed!** The core algorithm is identical.

---

## Why Post-Order Works

Think about course 0 with prereqs 1 and 2:
\`\`\`
    0
   / \\
  1   2
\`\`\`

DFS exploration:
1. Start at 0, mark VISITING
2. Go to 1, process it, mark VISITED, add 1 to result
3. Go to 2, process it, mark VISITED, add 2 to result
4. Back at 0, all children done, mark VISITED, add 0 to result

Result: [1, 2, 0] → Reversed: [0, 2, 1] ✓

Prerequisites (1 and 2) appear BEFORE the dependent course (0)!

---

## Alternative: Kahn's Algorithm (BFS)

You can also use BFS with in-degree counting:

\`\`\`python
def findOrder(numCourses, prerequisites):
    graph = defaultdict(list)
    in_degree = [0] * numCourses

    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1

    # Start with courses that have no prerequisites
    queue = deque([c for c in range(numCourses) if in_degree[c] == 0])
    result = []

    while queue:
        course = queue.popleft()
        result.append(course)

        for next_course in graph[course]:
            in_degree[next_course] -= 1
            if in_degree[next_course] == 0:
                queue.append(next_course)

    return result if len(result) == numCourses else []
\`\`\`

Both approaches work, but DFS shows the connection to cycle detection better.`,
            targetComplexity: {
                time: 'O(V + E)',
                space: 'O(V + E)'
            },
            testCases: [
                { input: '2, [[1,0]]', expectedOutput: '[0, 1]' },
                { input: '4, [[1,0],[2,0],[3,1],[3,2]]', expectedOutput: '[0, 1, 2, 3]' },
                { input: '2, [[1,0],[0,1]]', expectedOutput: '[]' },
                { input: '1, []', expectedOutput: '[0]' }
            ]
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-rotting-oranges',
            title: 'Rotting Oranges (Multi-Source BFS)',
            difficulty: 'medium',
            description: 'Find minimum time for all oranges to rot using multi-source BFS',
            requiredForProgress: true,
            instruction: `# Rotting Oranges (MULTI-SOURCE BFS DEMO)

This is your **first Multi-Source BFS problem**! The key insight: start BFS from ALL sources at once.

---

## Which Template?

This problem uses: **Template 4: Multi-Source BFS**

## Template Application (Step by Step)

\`\`\`python
# TEMPLATE 4: Multi-Source BFS
from collections import deque

def orangesRotting(grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0

    # ✏️ STEP 1: Find ALL sources (rotten oranges) + count fresh
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))  # Add ALL rotten oranges
            elif grid[r][c] == 1:
                fresh += 1

    minutes = 0
    directions = [(0,1), (0,-1), (1,0), (-1,0)]

    # ✏️ STEP 2: BFS level by level (each level = 1 minute)
    while queue and fresh > 0:
        for _ in range(len(queue)):  # Process current level
            r, c = queue.popleft()

            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    if grid[nr][nc] == 1:  # Fresh orange
                        grid[nr][nc] = 2   # ✏️ Rot it!
                        fresh -= 1
                        queue.append((nr, nc))

        minutes += 1

    return minutes if fresh == 0 else -1
\`\`\`

## What to Change from Template

| Template Line | Change For This Problem |
|---------------|-------------------------|
| Find sources | All cells with value 2 (rotten) |
| Valid neighbor | \`grid[r][c] == 1\` (fresh orange) |
| Process cell | Mark as rotten, decrement fresh count |
| Track time | Count iterations of outer while loop |

---

## Problem

- **0**: empty cell
- **1**: fresh orange
- **2**: rotten orange

Every minute, fresh oranges adjacent to rotten ones become rotten. Return minimum minutes until no fresh oranges remain, or -1 if impossible.

## Example

\`\`\`
Minute 0: [[2,1,1],[1,1,0],[0,1,1]]
Minute 1: [[2,2,1],[2,1,0],[0,1,1]]
Minute 2: [[2,2,2],[2,2,0],[0,1,1]]
Minute 3: [[2,2,2],[2,2,0],[0,2,1]]
Minute 4: [[2,2,2],[2,2,0],[0,2,2]]
Output: 4
\`\`\`

## Key Insight

Multi-Source BFS = BFS starting from **multiple points simultaneously**!

All rotten oranges spread rot at the same time, like ripples expanding.

## Constraints
- 1 <= m, n <= 10
- grid[i][j] is 0, 1, or 2`,
            starterCode: `def orangesRotting(grid):
    # Return minimum minutes until all oranges rot, or -1 if impossible
    pass
`,
            hints: [
                { afterAttempt: 1, text: 'Find all initially rotten oranges and add them to the queue. Count fresh oranges.' },
                { afterAttempt: 2, text: 'Process the queue level by level (one level = one minute).' },
                { afterAttempt: 3, text: 'When a fresh orange rots, decrement the fresh count. Return -1 if fresh > 0 at the end.' }
            ],
            solution: {
                afterAttempt: 3,
                text: `from collections import deque

def orangesRotting(grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0

    # Find all rotten oranges and count fresh ones
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh += 1

    # No fresh oranges
    if fresh == 0:
        return 0

    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    minutes = 0

    while queue and fresh > 0:
        # Process all oranges at current time level
        for _ in range(len(queue)):
            r, c = queue.popleft()

            for dr, dc in directions:
                new_r, new_c = r + dr, c + dc

                if (0 <= new_r < rows and 0 <= new_c < cols and
                    grid[new_r][new_c] == 1):
                    grid[new_r][new_c] = 2  # Rot the orange
                    fresh -= 1
                    queue.append((new_r, new_c))

        minutes += 1

    return minutes if fresh == 0 else -1
`
            },
            targetComplexity: {
                time: 'O(m * n)',
                space: 'O(m * n)'
            },
            testCases: [
                { input: '[[2,1,1],[1,1,0],[0,1,1]]', expectedOutput: '4' },
                { input: '[[2,1,1],[0,1,1],[1,0,1]]', expectedOutput: '-1' },
                { input: '[[0,2]]', expectedOutput: '0' }
            ]
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-word-ladder',
            title: 'Word Ladder',
            difficulty: 'hard',
            description: 'Find shortest transformation sequence using BFS',
            requiredForProgress: true,
            instruction: `# Word Ladder (LeetCode 127)

A **transformation sequence** from word \`beginWord\` to word \`endWord\` using a dictionary \`wordList\` is a sequence of words:
- \`beginWord -> s1 -> s2 -> ... -> sk\` such that:
  - Every adjacent pair differs by exactly **one letter**
  - Every \`si\` is in \`wordList\` (Note: \`beginWord\` doesn't need to be in wordList)
  - \`sk == endWord\`

Return the **number of words** in the shortest transformation sequence, or 0 if no such sequence exists.

## Example

\`\`\`
Input: beginWord = "hit", endWord = "cog"
       wordList = ["hot","dot","dog","lot","log","cog"]

Output: 5

Explanation: "hit" -> "hot" -> "dot" -> "dog" -> "cog"
             (5 words in the sequence)
\`\`\`

## Why This is a Graph Problem

Think of it this way:
- Each word is a **node**
- Two words are **connected** if they differ by exactly one letter
- We want the **shortest path** from beginWord to endWord

**Shortest path in unweighted graph = BFS!**

## The Challenge

Building the graph naively:
- Compare every pair of words: O(n² × L) where L is word length
- For 5000 words of length 10: 250 million comparisons!

The trick: generate all possible one-letter transformations and check if they're in wordList.

## Constraints
- 1 <= beginWord.length <= 10
- endWord.length == beginWord.length
- 1 <= wordList.length <= 5000
- All words have same length
- All words consist of lowercase English letters`,
            starterCode: `def ladderLength(beginWord, endWord, wordList):
    # BFS from beginWord to endWord
    # Key: how to efficiently find words that differ by one letter?
    pass`,
            expectedOutput: `from collections import deque

def ladderLength(beginWord, endWord, wordList):
    if endWord not in wordList:
        return 0
    
    word_set = set(wordList)
    queue = deque([(beginWord, 1)])  # (word, length)
    visited = set([beginWord])
    
    while queue:
        word, length = queue.popleft()
        
        if word == endWord:
            return length
        
        # Try changing each character
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                new_word = word[:i] + c + word[i+1:]
                
                if new_word in word_set and new_word not in visited:
                    visited.add(new_word)
                    queue.append((new_word, length + 1))
    
    return 0`,
            hints: [
                { afterAttempt: 1, text: 'Use BFS starting from beginWord. Each "neighbor" is a word that differs by exactly one letter.' },
                { afterAttempt: 2, text: 'To find neighbors efficiently: for each position, try all 26 letters and check if the resulting word is in wordList.' },
                { afterAttempt: 3, text: 'Use a set for wordList for O(1) lookups. Use visited set to avoid revisiting words.' }
            ],
            solution: {
                afterAttempt: 4,
                text: `## Solution - O(M² × N) time, O(M × N) space

Where M = word length, N = number of words

\`\`\`python
from collections import deque

def ladderLength(beginWord, endWord, wordList):
    if endWord not in wordList:
        return 0
    
    word_set = set(wordList)
    queue = deque([(beginWord, 1)])
    visited = set([beginWord])
    
    while queue:
        word, length = queue.popleft()
        
        if word == endWord:
            return length
        
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                new_word = word[:i] + c + word[i+1:]
                
                if new_word in word_set and new_word not in visited:
                    visited.add(new_word)
                    queue.append((new_word, length + 1))
    
    return 0
\`\`\`

**Key insight:** Generate neighbors by trying all single-character changes, O(26 × M) per word.`
            },
            solutionExplanation: `## The Brute-Force Instinct

The obvious approach: build a graph by comparing every pair of words:

\`\`\`python
def buildGraph(wordList):
    graph = defaultdict(list)
    for i, word1 in enumerate(wordList):
        for j, word2 in enumerate(wordList):
            if differsByOne(word1, word2):
                graph[word1].append(word2)
    return graph
\`\`\`

This is O(N² × M) where N is number of words and M is word length. With 5000 words of length 10, that's 250 million comparisons. Too slow!

---

## The Optimization: Generate Neighbors

Instead of comparing all pairs, **generate** possible neighbors for each word:

\`\`\`
word = "hot"

Try changing position 0: aot, bot, cot, dot, ... (26 options)
Try changing position 1: hat, hbt, hct, hdt, ... (26 options)
Try changing position 2: hoa, hob, hoc, hod, ... (26 options)

For each generated word, check if it's in wordList (O(1) with a set)
\`\`\`

This is O(26 × M) per word = O(26 × M × N) total, much better than O(N² × M)!

---

## BFS for Shortest Path

Since all edges have weight 1 (one transformation = one step), BFS gives the shortest path:

\`\`\`python
from collections import deque

def ladderLength(beginWord, endWord, wordList):
    if endWord not in wordList:
        return 0
    
    word_set = set(wordList)  # O(1) lookup
    queue = deque([(beginWord, 1)])
    visited = set([beginWord])
    
    while queue:
        word, length = queue.popleft()
        
        if word == endWord:
            return length  # Found shortest path!
        
        # Generate all neighbors
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                new_word = word[:i] + c + word[i+1:]
                
                if new_word in word_set and new_word not in visited:
                    visited.add(new_word)
                    queue.append((new_word, length + 1))
    
    return 0  # No path exists
\`\`\`

---

## Why BFS?

BFS explores words level by level:
- Level 1: beginWord
- Level 2: words one step from beginWord
- Level 3: words two steps from beginWord
- ...

The first time we reach endWord, we've found the **shortest** path. This is why BFS is perfect for unweighted shortest path problems.

---

## The Pattern

**"Shortest path with equal-weight edges" → BFS**

This pattern appears in:
- Word Ladder (words as nodes)
- Minimum Knight Moves (positions as nodes)
- Open the Lock (lock states as nodes)
- Shortest Path in Binary Matrix (cells as nodes)`,
            targetComplexity: {
                time: 'O(M² × N)',
                space: 'O(M × N)'
            },
            testCases: [
                { input: '"hit", "cog", ["hot","dot","dog","lot","log","cog"]', expectedOutput: '5' },
                { input: '"hit", "cog", ["hot","dot","dog","lot","log"]', expectedOutput: '0' },
                { input: '"a", "c", ["a","b","c"]', expectedOutput: '2' }
            ]
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-network-delay-time',
            title: 'Network Delay Time',
            difficulty: 'medium',
            description: 'Find max time for signal to reach all nodes using Dijkstra',
            requiredForProgress: true,
            instruction: `# Network Delay Time

This is the classic **Dijkstra's Algorithm** problem.

## Problem
You are given a network of \`n\` nodes, labeled from 1 to n. You are also given \`times\`, a list of travel times as directed edges \`times[i] = (u, v, w)\`, where \`u\` is the source node, \`v\` is the target node, and \`w\` is the time it takes for a signal to travel from source to target.

We send a signal from a given node \`k\`. Return the time it takes for all nodes to receive the signal. If it is impossible for all nodes to receive the signal, return -1.

## Example
\`\`\`
Input: times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2
Output: 2
Explanation:
Node 2 -> Node 1 (cost 1)
Node 2 -> Node 3 (cost 1) -> Node 4 (cost 1+1=2)
Max time is 2.
\`\`\`

## Key Insight
1. This is a **Shortest Path** problem in a **Weighted Graph**.
2. Use **Dijkstra's Algorithm** to find the minimum time to reach every node from \`k\`.
3. The answer is the **maximum** of these shortest times (since signal travels in parallel).
4. If any node is unreachable, return -1.

## Constraints
- 1 <= k <= n <= 100
- 1 <= times.length <= 6000`,
            starterCode: `import heapq

def networkDelayTime(times, n, k):
    # Return time for all nodes to receive signal, or -1
    pass`,
            hints: [
                { afterAttempt: 1, text: 'Build an adjacency list first: graph[u] = [(v, w), ...].' },
                { afterAttempt: 2, text: 'Use a Min-Heap to store (time, node). Initialize dist map with infinity.' },
                { afterAttempt: 3, text: 'After Dijkstra, find the max value in dist map. If max is infinity, return -1.' }
            ],
            solution: {
                afterAttempt: 3,
                text: `import heapq
from collections import defaultdict

def networkDelayTime(times, n, k):
    graph = defaultdict(list)
    for u, v, w in times:
        graph[u].append((v, w))

    # Min-heap: (time_elapsed, node)
    pq = [(0, k)]
    dist = {}

    while pq:
        d, node = heapq.heappop(pq)
        
        if node in dist:
            continue
        dist[node] = d
        
        for neighbor, weight in graph[node]:
            if neighbor not in dist:
                heapq.heappush(pq, (d + weight, neighbor))

    return max(dist.values()) if len(dist) == n else -1`
            },
            targetComplexity: {
                time: 'O(E log V)',
                space: 'O(V + E)'
            },
            testCases: [
                { input: '[[2,1,1],[2,3,1],[3,4,1]], 4, 2', expectedOutput: '2' },
                { input: '[[1,2,1]], 2, 1', expectedOutput: '1' },
                { input: '[[1,2,1]], 2, 2', expectedOutput: '-1' }
            ]
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-cheapest-flights-k-stops',
            title: 'Cheapest Flights Within K Stops',
            difficulty: 'hard',
            description: 'Find cheapest path with constraint on number of stops',
            requiredForProgress: true,
            instruction: `# Cheapest Flights Within K Stops

This is a **Constrained Shortest Path** problem. Standard Dijkstra needs a modification!

## Problem
There are \`n\` cities connected by flights. You are given array \`flights\` where \`flights[i] = [from, to, price]\`.

You are also given three integers \`src\`, \`dst\`, and \`k\`, return the **cheapest price** from \`src\` to \`dst\` with at most \`k\` stops. If there is no such route, return -1.

## Top 2 Approaches

### 1. Modified Dijkstra (BFS + PQ)
Standard Dijkstra forgets "how we got there". Here, we need to track stops.
- State: \`(cost, node, stops_remaining)\`
- Don't just check \`cost < min_cost\`. We might accept a MORE expensive path if it has FEWER stops (because it might allow us to reach destination within limit).
- Actually, simply track "min cost to reach node with S stops".

### 2. Bellman-Ford (Simplified)
- Run relaxation \`k+1\` times.
- In each iteration, update costs based on previous iteration's costs.
- Cost[v] = min(Cost[v], Cost[u] + w)

## Example
\`\`\`
Input: n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1
Output: 200
Explanation:
Path 0->1->2 costs 200 and has 1 stop.
Path 0->2 costs 500 and has 0 stops.
Cheapest is 200.
\`\`\`

## Constraints
- 1 <= n <= 100
- 0 <= flights.length <= (n * (n - 1) / 2)
- 0 <= k < n`,
            starterCode: `def findCheapestPrice(n, flights, src, dst, k):
    # Return cheapest price with at most k stops
    pass`,
            hints: [
                { afterAttempt: 1, text: 'You can use Bellman-Ford: Iterate k+1 times, updating distances.' },
                { afterAttempt: 2, text: 'Alternatively, use Dijkstra logic but track prices array [node] = min_price. Be careful: allow re-visiting if stops < current_cheapest_stops? Actually simpler: Run plain BFS since we just need "k layers".' },
                { afterAttempt: 3, text: 'Simplest for interview: Bellman-Ford. Create temp array each step to ensure you only use values from previous "stop" level.' }
            ],
            solution: {
                afterAttempt: 3,
                text: `def findCheapestPrice(n, flights, src, dst, k):
    # Bellman-Ford Approach
    # Initialize prices to infinity
    prices = [float('inf')] * n
    prices[src] = 0
    
    # Run k+1 iterations (0 stops to k stops)
    for _ in range(k + 1):
        temp_prices = list(prices)
        for s, d, p in flights:
            if prices[s] == float('inf'):
                continue
            if prices[s] + p < temp_prices[d]:
                temp_prices[d] = prices[s] + p
        prices = temp_prices
        
    return prices[dst] if prices[dst] != float('inf') else -1`
            },
            targetComplexity: {
                time: 'O((n + E) * K)',
                space: 'O(n)'
            },
            testCases: [
                { input: '3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 1', expectedOutput: '200' },
                { input: '3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 0', expectedOutput: '500' }
            ]
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-alien-dictionary',
            title: 'Alien Dictionary',
            difficulty: 'hard',
            description: 'Derive character ordering from sorted words using topological sort',
            requiredForProgress: true,
            instruction: `# Alien Dictionary (HARD)

This combines two skills: **building a graph** + **topological sort**.

---

## Which Template?

This uses: **Kahn's Algorithm (Topological Sort)** from Course Schedule II!

## Two-Step Process

\`\`\`
STEP 1: Build the graph
────────────────────────
Compare adjacent words to find ordering rules:
"wrt" vs "wrf" → first difference is t vs f → t comes before f
                                            → edge: t → f

STEP 2: Topological sort (same as Course Schedule II!)
────────────────────────
Use Kahn's algorithm to find valid ordering.
\`\`\`

## What's Different from Course Schedule II

| Course Schedule II | Alien Dictionary |
|--------------------|------------------|
| Graph is given | You BUILD the graph |
| Nodes = courses | Nodes = characters |
| Edges = prerequisites | Edges = ordering rules |

## Building the Graph

\`\`\`python
# Compare adjacent words
for i in range(len(words) - 1):
    w1, w2 = words[i], words[i + 1]

    # Find first different character
    for c1, c2 in zip(w1, w2):
        if c1 != c2:
            # c1 comes before c2 → edge: c1 → c2
            graph[c1].add(c2)
            in_degree[c2] += 1
            break  # ✏️ Only first difference matters!

# Edge case: "abc" before "ab" is INVALID
if len(w1) > len(w2) and w1[:len(w2)] == w2:
    return ""
\`\`\`

---

## Problem

Given sorted words in alien language, derive the character order.

## Example

\`\`\`
Input: ["wrt","wrf","er","ett","rftt"]

Derivations:
- "wrt" < "wrf" → t < f
- "wrf" < "er" → w < e
- "er" < "ett" → r < t
- "ett" < "rftt" → e < r

Graph: w→e→r→t→f
Output: "wertf"
\`\`\`

## Key Insight

1. Build graph by comparing adjacent words
2. Use topological sort (Kahn's algorithm)
3. Cycle = invalid input (return "")

## Constraints
- 1 <= words.length <= 100
- 1 <= words[i].length <= 100`,
            starterCode: `def alienOrder(words):
    # Return the order of letters, or "" if invalid
    pass
`,
            hints: [
                { afterAttempt: 1, text: 'Compare adjacent words. The first different character tells you the ordering (earlier word\'s char < later word\'s char).' },
                { afterAttempt: 2, text: 'Edge case: if word1 is longer than word2 and word2 is a prefix of word1, it\'s invalid (e.g., ["abc", "ab"]).' },
                { afterAttempt: 3, text: 'Use Kahn\'s algorithm (BFS topological sort). If you can\'t process all characters, there\'s a cycle.' }
            ],
            solution: {
                afterAttempt: 3,
                text: `from collections import deque, defaultdict

def alienOrder(words):
    # Build graph: character -> set of characters that come after
    graph = defaultdict(set)
    in_degree = {c: 0 for word in words for c in word}

    # Compare adjacent words
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i + 1]

        # Check invalid case: w1 longer and w2 is prefix
        if len(w1) > len(w2) and w1[:len(w2)] == w2:
            return ""

        # Find first different character
        for c1, c2 in zip(w1, w2):
            if c1 != c2:
                if c2 not in graph[c1]:
                    graph[c1].add(c2)
                    in_degree[c2] += 1
                break

    # Kahn's algorithm (topological sort)
    queue = deque([c for c in in_degree if in_degree[c] == 0])
    result = []

    while queue:
        c = queue.popleft()
        result.append(c)

        for next_c in graph[c]:
            in_degree[next_c] -= 1
            if in_degree[next_c] == 0:
                queue.append(next_c)

    # Check for cycle
    if len(result) != len(in_degree):
        return ""

    return ''.join(result)
`
            },
            targetComplexity: {
                time: 'O(n)',
                space: 'O(1)'
            },
            testCases: [
                { input: '["wrt","wrf","er","ett","rftt"]', expectedOutput: '"wertf"' },
                { input: '["z","x"]', expectedOutput: '"zx"' },
                { input: '["z","x","z"]', expectedOutput: '""' }
            ]
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-is-graph-bipartite',
            title: 'Is Graph Bipartite? (2-Color DFS)',
            difficulty: 'medium',
            description: 'Determine if graph can be 2-colored using the coloring approach',
            requiredForProgress: true,
            instruction: `# Is Graph Bipartite? (USES COLORING APPROACH)

**Key Insight:** You already learned 3-color DFS for cycle detection. Bipartite checking uses the SAME coloring idea with just 2 colors!

---

## From 3-Color (Cycle Detection) → 2-Color (Bipartite)

\`\`\`
CYCLE DETECTION (3 colors):           BIPARTITE CHECK (2 colors):
─────────────────────────────         ─────────────────────────────
UNVISITED → VISITING → VISITED        No color → Color 0 or Color 1

"Is this node currently being          "Can I color neighbors with
explored? If I see it again,            the OPPOSITE color? If not,
there's a cycle!"                       it's not bipartite!"

Key check:                              Key check:
if state[node] == VISITING:             if color[neighbor] == color[node]:
    return True  # Cycle!                   return False  # Not bipartite!
\`\`\`

**The pattern:** Both use coloring to detect conflicts during graph traversal!

---

## Problem

A graph is **bipartite** if you can split all nodes into two groups such that every edge connects a node in one group to a node in the other group.

Equivalently: Can you color the graph with 2 colors such that no two adjacent nodes have the same color?

\`\`\`
BIPARTITE:                    NOT BIPARTITE:
    0 --- 1                       0 --- 1
    |     |                       |   / |
    3 --- 2                       | /   |
                                  2 --- 3
Group A: {0, 2}
Group B: {1, 3}                   No valid 2-coloring exists!
\`\`\`

## Examples

Example 1:
\`\`\`
Input: graph = [[1,2,3],[0,2],[0,1,3],[0,2]]
Output: false
Explanation: No way to 2-color this graph.
\`\`\`

Example 2:
\`\`\`
Input: graph = [[1,3],[0,2],[1,3],[0,2]]
Output: true
Explanation: Color nodes 0,2 with color 0; nodes 1,3 with color 1.
\`\`\`

## Constraints
- graph.length == n (number of nodes)
- 1 <= n <= 100
- graph[u] contains neighbors of node u`,
            starterCode: `def isBipartite(graph):
    # Return True if graph can be 2-colored
    # Hint: Use color dict like you used state array for cycle detection!
    pass
`,
            hints: [
                { afterAttempt: 1, text: 'Use a color dictionary (or array) to track each node\'s color. Start uncolored, then assign 0 or 1.' },
                { afterAttempt: 2, text: 'For each neighbor: if uncolored, assign opposite color (1 - current_color). If already colored with SAME color, not bipartite!' },
                { afterAttempt: 3, text: 'The graph may be disconnected! Run BFS/DFS from each uncolored node to handle all components.' }
            ],
            solution: {
                afterAttempt: 3,
                text: `from collections import deque

def isBipartite(graph):
    n = len(graph)
    color = [-1] * n  # -1 = uncolored, 0 or 1 = colored

    def bfs(start):
        queue = deque([start])
        color[start] = 0

        while queue:
            node = queue.popleft()
            for neighbor in graph[node]:
                if color[neighbor] == -1:
                    # Uncolored: assign opposite color
                    color[neighbor] = 1 - color[node]
                    queue.append(neighbor)
                elif color[neighbor] == color[node]:
                    # Same color as current node = not bipartite!
                    return False
        return True

    # Check all components (graph may be disconnected)
    for i in range(n):
        if color[i] == -1:
            if not bfs(i):
                return False

    return True
`
            },
            solutionExplanation: `## The Coloring Connection

Compare to cycle detection:

\`\`\`python
# Cycle Detection (3 colors)          # Bipartite Check (2 colors)
state = [0] * n                        color = [-1] * n
# 0=unvisited, 1=visiting, 2=visited   # -1=uncolored, 0 or 1 = colored

def hasCycle(node):                    def bfs(start):
    if state[node] == 1:                   queue = deque([start])
        return True  # Cycle!              color[start] = 0
    if state[node] == 2:
        return False                       while queue:
                                               node = queue.popleft()
    state[node] = 1  # Visiting               for neighbor in graph[node]:
                                                   if color[neighbor] == -1:
    for neighbor in graph[node]:                       color[neighbor] = 1 - color[node]
        if hasCycle(neighbor):                         queue.append(neighbor)
            return True                            elif color[neighbor] == color[node]:
                                                       return False  # Conflict!
    state[node] = 2  # Visited                return True
    return False
\`\`\`

**The pattern:** Both algorithms use coloring to detect conflicts during traversal.
- Cycle detection: "Am I seeing a node I'm currently processing?"
- Bipartite: "Does my neighbor have the same color as me?"

---

## DFS Alternative

You can also use DFS (more similar to cycle detection):

\`\`\`python
def isBipartite(graph):
    color = [-1] * len(graph)

    def dfs(node, c):
        color[node] = c
        for neighbor in graph[node]:
            if color[neighbor] == -1:
                if not dfs(neighbor, 1 - c):
                    return False
            elif color[neighbor] == c:
                return False
        return True

    for i in range(len(graph)):
        if color[i] == -1:
            if not dfs(i, 0):
                return False
    return True
\`\`\`

---

## Why 2 Colors?

A bipartite graph can be split into two sets where:
- All edges go BETWEEN sets (not within)
- Like a chess board: white squares only touch black squares

If you find two adjacent nodes with the same color, you've found an odd-length cycle, which means it's not bipartite.

---

## Real-World Applications

- **Matching problems**: Jobs to workers, students to dorms
- **Scheduling**: If conflicts form a bipartite graph, 2 time slots suffice
- **Social networks**: Can users be split into 2 groups with no same-group friendships?`,
            targetComplexity: {
                time: 'O(V + E)',
                space: 'O(V)'
            },
            testCases: [
                { input: '[[1,2,3],[0,2],[0,1,3],[0,2]]', expectedOutput: 'False' },
                { input: '[[1,3],[0,2],[1,3],[0,2]]', expectedOutput: 'True' },
                { input: '[[1],[0,3],[3],[1,2]]', expectedOutput: 'True' },
                { input: '[[],[2,4,6],[1,4,8,9],[7,8],[1,2,8,9],[6,9],[1,5,7,8,9],[3,6,9],[2,3,4,6,9],[2,4,5,6,7,8]]', expectedOutput: 'False' }
            ]
        },

  // ============================================================
  // GROUP 1: BASIC TRAVERSAL (REACHABILITY)
  // ============================================================
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-graph-reachability',
            title: 'Graph Reachability',
            description: 'Determine if target is reachable from source',
            targetComplexity: { time: 'O(V + E)', space: 'O(V)' },
            requiredForProgress: true,
            difficulty: 'easy',
            instruction: `# Graph Reachability

## The Problem

Given a directed graph represented as an adjacency list and two nodes \`s\` (source) and \`t\` (target), determine whether \`t\` is reachable from \`s\`.

**Example:**
\`\`\`
n = 4, edges = [[0,1], [1,2], [2,3]]
s = 0, t = 3
Output: True (path: 0 -> 1 -> 2 -> 3)

s = 3, t = 0
Output: False (no path from 3 to 0 in directed graph)
\`\`\`

## Your Task

Use DFS or BFS to check if you can reach \`t\` starting from \`s\`.`,
            starterCode: `def canReach(n: int, edges: list[list[int]], s: int, t: int) -> bool:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def canReach(n: int, edges: list[list[int]], s: int, t: int) -> bool:
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)

    visited = set()

    def dfs(node):
        if node == t:
            return True
        if node in visited:
            return False

        visited.add(node)

        for neighbor in graph[node]:
            if dfs(neighbor):
                return True

        return False

    return dfs(s)

# Test
print(canReach(4, [[0,1],[1,2],[2,3]], 0, 3))  # True`
            },
            hints: [
                { afterAttempt: 1, text: 'Build an adjacency list from the edges' },
                { afterAttempt: 2, text: 'Use DFS starting from s, return True when you reach t' },
                { afterAttempt: 3, text: 'Track visited nodes to avoid infinite loops in cycles' },
            ],
            testCases: [
                { input: '4, [[0,1],[1,2],[2,3]], 0, 3', expectedOutput: 'True' },
                { input: '4, [[0,1],[1,2],[2,3]], 3, 0', expectedOutput: 'False' }
            ],
            solutionExplanation: `## Pattern: Basic DFS Reachability

Simplest graph traversal: can we get from A to B?

**Key insight:** Just follow edges until you find the target or exhaust all possibilities.

## Complexity
- **Time:** O(V + E) - visit each node and edge once
- **Space:** O(V) for visited set and recursion stack`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-count-connected-components',
            title: 'Count Connected Components',
            description: 'Count the number of connected components in an undirected graph',
            targetComplexity: { time: 'O(V + E)', space: 'O(V)' },
            requiredForProgress: true,
            difficulty: 'easy',
            instruction: `# Count Connected Components

## The Problem

Given an undirected graph with \`n\` nodes labeled from 0 to n-1 and a list of edges, return the number of connected components.

**Example:**
\`\`\`
n = 5, edges = [[0,1], [1,2], [3,4]]

Components:
- {0, 1, 2}
- {3, 4}

Output: 2
\`\`\`

## Your Task

Use DFS to explore each component. Count how many times you start a new DFS.`,
            starterCode: `def countComponents(n: int, edges: list[list[int]]) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def countComponents(n: int, edges: list[list[int]]) -> int:
    # Build adjacency list (undirected)
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    visited = [False] * n
    count = 0

    def dfs(node):
        visited[node] = True
        for neighbor in graph[node]:
            if not visited[neighbor]:
                dfs(neighbor)

    for i in range(n):
        if not visited[i]:
            dfs(i)
            count += 1

    return count

# Test
print(countComponents(5, [[0,1],[1,2],[3,4]]))  # 2`
            },
            hints: [
                { afterAttempt: 1, text: 'Build undirected adjacency list (add edge both ways)' },
                { afterAttempt: 2, text: 'For each unvisited node, run DFS and increment count' },
                { afterAttempt: 3, text: 'Each DFS explores one entire component' },
            ],
            testCases: [
                { input: '5, [[0,1],[1,2],[3,4]]', expectedOutput: '2' },
                { input: '5, [[0,1],[1,2],[2,3],[3,4]]', expectedOutput: '1' },
                { input: '5, []', expectedOutput: '5' }
            ],
            solutionExplanation: `## Pattern: Connected Components

Same as Number of Islands but on a graph instead of a grid!

**Key insight:** Each new DFS start = one new component.

## Complexity
- **Time:** O(V + E)
- **Space:** O(V)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-all-nodes-reachable',
            title: 'All Nodes Reachable From Source',
            description: 'Return all nodes reachable from node 0',
            targetComplexity: { time: 'O(V + E)', space: 'O(V)' },
            requiredForProgress: true,
            difficulty: 'easy',
            instruction: `# All Nodes Reachable From Source

## The Problem

Given a directed graph, return all nodes reachable from node 0.

**Example:**
\`\`\`
n = 6, edges = [[0,1], [0,2], [1,3], [2,3], [4,5]]

Reachable from 0: {0, 1, 2, 3}
(Nodes 4, 5 are not reachable)

Output: [0, 1, 2, 3]
\`\`\`

## Your Task

Run DFS from node 0 and collect all visited nodes.`,
            starterCode: `def findReachable(n: int, edges: list[list[int]]) -> list[int]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def findReachable(n: int, edges: list[list[int]]) -> list[int]:
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)

    reachable = set()

    def dfs(node):
        if node in reachable:
            return
        reachable.add(node)
        for neighbor in graph[node]:
            dfs(neighbor)

    dfs(0)
    return sorted(list(reachable))

# Test
print(findReachable(6, [[0,1],[0,2],[1,3],[2,3],[4,5]]))  # [0,1,2,3]`
            },
            hints: [
                { afterAttempt: 1, text: 'Start DFS from node 0' },
                { afterAttempt: 2, text: 'Add each visited node to a result set' },
            ],
            testCases: [
                { input: '6, [[0,1],[0,2],[1,3],[2,3],[4,5]]', expectedOutput: '[0, 1, 2, 3]' },
                { input: '3, [[0,1],[1,2]]', expectedOutput: '[0, 1, 2]' }
            ],
            solutionExplanation: `## Pattern: Single-Source Reachability

Collect all nodes visited during a traversal.

## Complexity
- **Time:** O(V + E)
- **Space:** O(V)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-path-exists',
            title: 'Path Exists',
            description: 'Determine if any path exists between two nodes',
            targetComplexity: { time: 'O(V + E)', space: 'O(V)' },
            requiredForProgress: true,
            difficulty: 'easy',
            instruction: `# Path Exists

## The Problem

Given an undirected graph and two nodes \`source\` and \`destination\`, determine if there is a valid path from source to destination.

**Example:**
\`\`\`
n = 3, edges = [[0,1], [1,2], [2,0]]
source = 0, destination = 2
Output: True
\`\`\`

## Your Task

Use DFS or BFS to find if destination is reachable from source.`,
            starterCode: `def validPath(n: int, edges: list[list[int]], source: int, destination: int) -> bool:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def validPath(n: int, edges: list[list[int]], source: int, destination: int) -> bool:
    if source == destination:
        return True

    # Build undirected adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    visited = set()

    def dfs(node):
        if node == destination:
            return True
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                if dfs(neighbor):
                    return True
        return False

    return dfs(source)

# Test
print(validPath(3, [[0,1],[1,2],[2,0]], 0, 2))  # True`
            },
            hints: [
                { afterAttempt: 1, text: 'Build undirected graph (edges go both ways)' },
                { afterAttempt: 2, text: 'DFS from source, return True if you reach destination' },
            ],
            testCases: [
                { input: '3, [[0,1],[1,2],[2,0]], 0, 2', expectedOutput: 'True' },
                { input: '6, [[0,1],[0,2],[3,5],[5,4],[4,3]], 0, 5', expectedOutput: 'False' }
            ],
            solutionExplanation: `## LeetCode 1971: Find if Path Exists in Graph

Basic connectivity check in undirected graph.

## Complexity
- **Time:** O(V + E)
- **Space:** O(V)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-dfs-traversal-order',
            title: 'DFS Traversal Order',
            description: 'Return the order of nodes visited using DFS',
            targetComplexity: { time: 'O(V + E)', space: 'O(V)' },
            requiredForProgress: true,
            difficulty: 'easy',
            instruction: `# DFS Traversal Order

## The Problem

Given a graph, return the order of nodes visited using DFS starting from node 0.

**Example:**
\`\`\`
n = 4, edges = [[0,1], [0,2], [1,3], [2,3]]

DFS from 0: Visit 0, then 1, then 3, then 2 (or other valid orders)
Output: [0, 1, 3, 2]
\`\`\`

## Your Task

Track the order in which nodes are first visited during DFS.`,
            starterCode: `def dfsOrder(n: int, edges: list[list[int]]) -> list[int]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def dfsOrder(n: int, edges: list[list[int]]) -> list[int]:
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    visited = [False] * n
    order = []

    def dfs(node):
        visited[node] = True
        order.append(node)
        for neighbor in graph[node]:
            if not visited[neighbor]:
                dfs(neighbor)

    dfs(0)
    return order

# Test
print(dfsOrder(4, [[0,1],[0,2],[1,3],[2,3]]))  # [0, 1, 3, 2] or similar`
            },
            hints: [
                { afterAttempt: 1, text: 'Append to order list when you first visit a node' },
                { afterAttempt: 2, text: 'This is pre-order traversal (record before recursing)' },
            ],
            testCases: [
                { input: '4, [[0,1],[0,2],[1,3],[2,3]]', expectedOutput: '[0, 1, 3, 2]' }
            ],
            solutionExplanation: `## Pattern: Pre-order Graph Traversal

Record nodes in the order they're first discovered.

**Note:** Order depends on adjacency list order. Multiple valid answers exist.

## Complexity
- **Time:** O(V + E)
- **Space:** O(V)`
        },

  // ============================================================
  // GROUP 2: BFS SHORTEST PATH (UNWEIGHTED)
  // ============================================================
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-shortest-path-unweighted',
            title: 'Shortest Path in Unweighted Graph',
            description: 'Return shortest distances from source to all nodes',
            targetComplexity: { time: 'O(V + E)', space: 'O(V)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Shortest Path in Unweighted Graph

## The Problem

Given an unweighted graph and a source node \`s\`, return the shortest distance from \`s\` to all other nodes.

**Example:**
\`\`\`
n = 5, edges = [[0,1], [0,2], [1,3], [2,3], [3,4]]
s = 0

Distances: [0, 1, 1, 2, 3]
(node 0: dist 0, node 1: dist 1, node 2: dist 1, node 3: dist 2, node 4: dist 3)
\`\`\`

## Key Insight

In unweighted graphs, **BFS gives shortest paths!**

## Your Task

Use BFS and track distances level by level.`,
            starterCode: `def shortestPath(n: int, edges: list[list[int]], s: int) -> list[int]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `from collections import deque

def shortestPath(n: int, edges: list[list[int]], s: int) -> list[int]:
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    dist = [-1] * n
    dist[s] = 0
    queue = deque([s])

    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if dist[neighbor] == -1:
                dist[neighbor] = dist[node] + 1
                queue.append(neighbor)

    return dist

# Test
print(shortestPath(5, [[0,1],[0,2],[1,3],[2,3],[3,4]], 0))  # [0, 1, 1, 2, 3]`
            },
            hints: [
                { afterAttempt: 1, text: 'BFS explores nodes level by level = shortest path order' },
                { afterAttempt: 2, text: 'dist[neighbor] = dist[node] + 1 when first visited' },
                { afterAttempt: 3, text: 'Initialize dist[s] = 0, others as -1 (unreachable)' },
            ],
            testCases: [
                { input: '5, [[0,1],[0,2],[1,3],[2,3],[3,4]], 0', expectedOutput: '[0, 1, 1, 2, 3]' }
            ],
            solutionExplanation: `## Pattern: BFS for Shortest Path

In unweighted graphs, BFS gives shortest paths because it explores nodes in increasing order of distance from source.

**Why BFS works:**
- Level 0: source (distance 0)
- Level 1: neighbors of source (distance 1)
- Level 2: neighbors of level 1 (distance 2)
- ...

First time you reach a node is the shortest path!

## Complexity
- **Time:** O(V + E)
- **Space:** O(V)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-min-edges-between-nodes',
            title: 'Minimum Edges Between Two Nodes',
            description: 'Return minimum edge count from u to v',
            targetComplexity: { time: 'O(V + E)', space: 'O(V)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Minimum Edges Between Two Nodes

## The Problem

Given an undirected graph and two nodes \`u\` and \`v\`, return the minimum number of edges needed to travel from \`u\` to \`v\`. Return -1 if no path exists.

**Example:**
\`\`\`
n = 5, edges = [[0,1], [1,2], [2,3], [0,4], [4,3]]
u = 0, v = 3

Paths:
- 0 -> 1 -> 2 -> 3 (3 edges)
- 0 -> 4 -> 3 (2 edges) ✓

Output: 2
\`\`\`

## Your Task

BFS from u, return distance when you reach v.`,
            starterCode: `def minEdges(n: int, edges: list[list[int]], u: int, v: int) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `from collections import deque

def minEdges(n: int, edges: list[list[int]], u: int, v: int) -> int:
    if u == v:
        return 0

    graph = [[] for _ in range(n)]
    for a, b in edges:
        graph[a].append(b)
        graph[b].append(a)

    visited = [False] * n
    visited[u] = True
    queue = deque([(u, 0)])

    while queue:
        node, dist = queue.popleft()

        for neighbor in graph[node]:
            if neighbor == v:
                return dist + 1
            if not visited[neighbor]:
                visited[neighbor] = True
                queue.append((neighbor, dist + 1))

    return -1

# Test
print(minEdges(5, [[0,1],[1,2],[2,3],[0,4],[4,3]], 0, 3))  # 2`
            },
            hints: [
                { afterAttempt: 1, text: 'BFS guarantees shortest path in unweighted graphs' },
                { afterAttempt: 2, text: 'Track distance with each node in the queue' },
            ],
            testCases: [
                { input: '5, [[0,1],[1,2],[2,3],[0,4],[4,3]], 0, 3', expectedOutput: '2' },
                { input: '3, [[0,1]], 0, 2', expectedOutput: '-1' }
            ],
            solutionExplanation: `## Pattern: Single-Pair Shortest Path

Variant of BFS shortest path: stop as soon as you reach the target.

## Complexity
- **Time:** O(V + E)
- **Space:** O(V)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-shortest-path-blocked',
            title: 'Shortest Path With Blocked Nodes',
            description: 'Find shortest path avoiding blocked nodes',
            targetComplexity: { time: 'O(V + E)', space: 'O(V)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Shortest Path With Blocked Nodes

## The Problem

Given a graph, source, destination, and a set of blocked nodes, find the shortest path length avoiding blocked nodes.

**Example:**
\`\`\`
n = 5, edges = [[0,1], [1,2], [0,3], [3,4], [4,2]]
blocked = {1}
source = 0, dest = 2

Without blocked: 0 -> 1 -> 2 (2 edges)
With blocked: 0 -> 3 -> 4 -> 2 (3 edges)

Output: 3
\`\`\`

## Your Task

BFS but skip blocked nodes.`,
            starterCode: `def shortestPathBlocked(n: int, edges: list[list[int]], blocked: set, source: int, dest: int) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `from collections import deque

def shortestPathBlocked(n: int, edges: list[list[int]], blocked: set, source: int, dest: int) -> int:
    if source in blocked or dest in blocked:
        return -1
    if source == dest:
        return 0

    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    visited = [False] * n
    visited[source] = True
    queue = deque([(source, 0)])

    while queue:
        node, dist = queue.popleft()

        for neighbor in graph[node]:
            if neighbor == dest:
                return dist + 1
            if not visited[neighbor] and neighbor not in blocked:
                visited[neighbor] = True
                queue.append((neighbor, dist + 1))

    return -1

# Test
print(shortestPathBlocked(5, [[0,1],[1,2],[0,3],[3,4],[4,2]], {1}, 0, 2))  # 3`
            },
            hints: [
                { afterAttempt: 1, text: 'Standard BFS but skip nodes in blocked set' },
                { afterAttempt: 2, text: 'Check if source or dest is blocked (edge case)' },
            ],
            testCases: [
                { input: '5, [[0,1],[1,2],[0,3],[3,4],[4,2]], {1}, 0, 2', expectedOutput: '3' }
            ],
            solutionExplanation: `## Pattern: Constrained BFS

Same as regular BFS, but add a condition to skip certain nodes.

## Complexity
- **Time:** O(V + E)
- **Space:** O(V)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-multi-source-bfs',
            title: 'Multi-Source BFS',
            description: 'Compute minimum distance from any source to all nodes',
            targetComplexity: { time: 'O(V + E)', space: 'O(V)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Multi-Source BFS

## The Problem

Given a graph and multiple source nodes, compute the minimum distance from ANY source to each node.

**Example:**
\`\`\`
n = 5, edges = [[0,1], [1,2], [3,4], [2,4]]
sources = [0, 3]

Distances:
- node 0: 0 (is source)
- node 1: 1 (from 0)
- node 2: 2 (from 0)
- node 3: 0 (is source)
- node 4: 1 (from 3)

Output: [0, 1, 2, 0, 1]
\`\`\`

## Key Insight

Start BFS from ALL sources simultaneously!

## Your Task

Initialize queue with all sources (distance 0).`,
            starterCode: `def multiSourceBFS(n: int, edges: list[list[int]], sources: list[int]) -> list[int]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `from collections import deque

def multiSourceBFS(n: int, edges: list[list[int]], sources: list[int]) -> list[int]:
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    dist = [-1] * n
    queue = deque()

    # Add all sources with distance 0
    for s in sources:
        dist[s] = 0
        queue.append(s)

    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if dist[neighbor] == -1:
                dist[neighbor] = dist[node] + 1
                queue.append(neighbor)

    return dist

# Test
print(multiSourceBFS(5, [[0,1],[1,2],[3,4],[2,4]], [0, 3]))  # [0, 1, 2, 0, 1]`
            },
            hints: [
                { afterAttempt: 1, text: 'Initialize queue with ALL sources at distance 0' },
                { afterAttempt: 2, text: 'BFS explores outward from all sources simultaneously' },
            ],
            testCases: [
                { input: '5, [[0,1],[1,2],[3,4],[2,4]], [0, 3]', expectedOutput: '[0, 1, 2, 0, 1]' }
            ],
            solutionExplanation: `## Pattern: Multi-Source BFS

Same as Rotting Oranges! Instead of one source, start from multiple.

**Key insight:** BFS expands like ripples from all sources at once.

## Complexity
- **Time:** O(V + E)
- **Space:** O(V)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-level-order-grouping',
            title: 'Level Order Grouping',
            description: 'Return nodes grouped by distance from source',
            targetComplexity: { time: 'O(V + E)', space: 'O(V)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Level Order Grouping

## The Problem

Given a graph and source node, return nodes grouped by their distance from the source.

**Example:**
\`\`\`
n = 5, edges = [[0,1], [0,2], [1,3], [2,3], [3,4]]
source = 0

Level 0: [0]
Level 1: [1, 2]
Level 2: [3]
Level 3: [4]

Output: [[0], [1, 2], [3], [4]]
\`\`\`

## Your Task

BFS level by level, collecting nodes at each level.`,
            starterCode: `def levelOrder(n: int, edges: list[list[int]], source: int) -> list[list[int]]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `from collections import deque

def levelOrder(n: int, edges: list[list[int]], source: int) -> list[list[int]]:
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    visited = [False] * n
    visited[source] = True
    queue = deque([source])
    result = []

    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node)

            for neighbor in graph[node]:
                if not visited[neighbor]:
                    visited[neighbor] = True
                    queue.append(neighbor)

        result.append(level)

    return result

# Test
print(levelOrder(5, [[0,1],[0,2],[1,3],[2,3],[3,4]], 0))  # [[0], [1, 2], [3], [4]]`
            },
            hints: [
                { afterAttempt: 1, text: 'Process entire level before moving to next' },
                { afterAttempt: 2, text: 'Use len(queue) at start of each level to know how many nodes' },
            ],
            testCases: [
                { input: '5, [[0,1],[0,2],[1,3],[2,3],[3,4]], 0', expectedOutput: '[[0], [1, 2], [3], [4]]' }
            ],
            solutionExplanation: `## Pattern: Level-by-Level BFS

Same pattern as tree level-order traversal, applied to graphs.

## Complexity
- **Time:** O(V + E)
- **Space:** O(V)`
        },

  // ============================================================
  // GROUP 3: GRID BFS/DFS (ADDITIONAL)
  // ============================================================
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-max-area-island',
            title: 'Max Area of Island',
            description: 'Return maximum island area',
            targetComplexity: { time: 'O(m * n)', space: 'O(m * n)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Max Area of Island

## The Problem

Given a 2D binary grid where 1 represents land and 0 represents water, return the maximum area of an island.

**Example:**
\`\`\`
grid = [
  [0,0,1,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,1,1,0,0,0],
  [0,1,1,0,1,0,0,0,0,0,0,0,0],
  [0,1,0,0,1,1,0,0,1,0,1,0,0],
  [0,1,0,0,1,1,0,0,1,1,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,0,0],
  [0,0,0,0,0,0,0,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,1,1,0,0,0,0]
]
Output: 6 (the island in the bottom right)
\`\`\`

## Your Task

DFS to find area of each island, track maximum.`,
            starterCode: `def maxAreaOfIsland(grid: list[list[int]]) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def maxAreaOfIsland(grid: list[list[int]]) -> int:
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    max_area = 0

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == 0:
            return 0

        grid[r][c] = 0  # Mark as visited
        area = 1

        area += dfs(r + 1, c)
        area += dfs(r - 1, c)
        area += dfs(r, c + 1)
        area += dfs(r, c - 1)

        return area

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                max_area = max(max_area, dfs(r, c))

    return max_area

# Test
grid = [[0,0,1,0,0],[0,0,0,0,0],[0,1,1,1,0],[0,1,0,0,0]]
print(maxAreaOfIsland(grid))  # 4`
            },
            hints: [
                { afterAttempt: 1, text: 'DFS returns area count instead of just marking' },
                { afterAttempt: 2, text: 'Sum up 1 + DFS results from all 4 directions' },
            ],
            testCases: [
                { input: '[[0,0,1,0,0],[0,0,0,0,0],[0,1,1,1,0],[0,1,0,0,0]]', expectedOutput: '4' },
                { input: '[[0,0,0,0,0]]', expectedOutput: '0' }
            ],
            solutionExplanation: `## LeetCode 695

Variation of Number of Islands: return size instead of count.

**Key change:** DFS returns area count (1 + sum of neighbors).

## Complexity
- **Time:** O(m * n)
- **Space:** O(m * n) for recursion`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-flood-fill',
            title: 'Flood Fill',
            description: 'Replace connected region with new color',
            targetComplexity: { time: 'O(m * n)', space: 'O(m * n)' },
            requiredForProgress: true,
            difficulty: 'easy',
            instruction: `# Flood Fill

## The Problem

Given an image represented by a 2D array, and a starting pixel (sr, sc) with a new color, perform a "flood fill": replace the color of the starting pixel and all connected pixels with the same original color.

**Example:**
\`\`\`
image = [[1,1,1],[1,1,0],[1,0,1]]
sr = 1, sc = 1, color = 2

All 1's connected to (1,1) become 2:
Output: [[2,2,2],[2,2,0],[2,0,1]]
\`\`\`

## Your Task

DFS from starting pixel, change color for all connected same-color pixels.`,
            starterCode: `def floodFill(image: list[list[int]], sr: int, sc: int, color: int) -> list[list[int]]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def floodFill(image: list[list[int]], sr: int, sc: int, color: int) -> list[list[int]]:
    rows, cols = len(image), len(image[0])
    original_color = image[sr][sc]

    if original_color == color:
        return image

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if image[r][c] != original_color:
            return

        image[r][c] = color
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    dfs(sr, sc)
    return image

# Test
image = [[1,1,1],[1,1,0],[1,0,1]]
print(floodFill(image, 1, 1, 2))  # [[2,2,2],[2,2,0],[2,0,1]]`
            },
            hints: [
                { afterAttempt: 1, text: 'Store original color before DFS' },
                { afterAttempt: 2, text: 'Edge case: if original == new color, return immediately' },
            ],
            testCases: [
                { input: '[[1,1,1],[1,1,0],[1,0,1]], 1, 1, 2', expectedOutput: '[[2,2,2],[2,2,0],[2,0,1]]' },
                { input: '[[0,0,0],[0,0,0]], 0, 0, 0', expectedOutput: '[[0,0,0],[0,0,0]]' }
            ],
            solutionExplanation: `## LeetCode 733

Classic DFS grid problem - like using paint bucket tool.

**Edge case:** If original color equals new color, infinite loop! Return early.

## Complexity
- **Time:** O(m * n)
- **Space:** O(m * n) for recursion`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-shortest-path-binary-matrix',
            title: 'Shortest Path in Binary Matrix',
            description: 'Shortest path from top-left to bottom-right through 0s',
            targetComplexity: { time: 'O(n^2)', space: 'O(n^2)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Shortest Path in Binary Matrix

## The Problem

Given an n x n binary matrix grid, return the length of the shortest clear path from top-left to bottom-right.

A clear path:
- Only goes through cells with value 0
- Can move in 8 directions (including diagonals!)
- Path length = number of cells visited

**Example:**
\`\`\`
grid = [[0,1],[1,0]]
Output: 2 (path: (0,0) -> (1,1))

grid = [[0,0,0],[1,1,0],[1,1,0]]
Output: 4
\`\`\`

## Your Task

BFS with 8 directions.`,
            starterCode: `def shortestPathBinaryMatrix(grid: list[list[int]]) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `from collections import deque

def shortestPathBinaryMatrix(grid: list[list[int]]) -> int:
    n = len(grid)

    if grid[0][0] == 1 or grid[n-1][n-1] == 1:
        return -1

    if n == 1:
        return 1

    # 8 directions including diagonals
    directions = [
        (-1,-1), (-1,0), (-1,1),
        (0,-1),          (0,1),
        (1,-1),  (1,0),  (1,1)
    ]

    queue = deque([(0, 0, 1)])  # (row, col, path_length)
    grid[0][0] = 1  # Mark visited

    while queue:
        r, c, length = queue.popleft()

        for dr, dc in directions:
            nr, nc = r + dr, c + dc

            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                if nr == n - 1 and nc == n - 1:
                    return length + 1

                grid[nr][nc] = 1  # Mark visited
                queue.append((nr, nc, length + 1))

    return -1

# Test
print(shortestPathBinaryMatrix([[0,0,0],[1,1,0],[1,1,0]]))  # 4`
            },
            hints: [
                { afterAttempt: 1, text: 'Use 8 directions instead of 4' },
                { afterAttempt: 2, text: 'Check if start or end is blocked (value 1)' },
                { afterAttempt: 3, text: 'Path length = number of cells, not edges' },
            ],
            testCases: [
                { input: '[[0,1],[1,0]]', expectedOutput: '2' },
                { input: '[[0,0,0],[1,1,0],[1,1,0]]', expectedOutput: '4' },
                { input: '[[1,0,0],[1,1,0],[1,1,0]]', expectedOutput: '-1' }
            ],
            solutionExplanation: `## LeetCode 1091

BFS on grid with 8 directions.

**Note:** Path length counts cells, not edges. So a single cell path has length 1.

## Complexity
- **Time:** O(n^2)
- **Space:** O(n^2)`
        },

  // ============================================================
  // GROUP 4: BFS WITH STATE
  // ============================================================
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-shortest-path-keys',
            title: 'Shortest Path to Get All Keys',
            description: 'Find shortest path collecting all keys to open locks',
            targetComplexity: { time: 'O(m * n * 2^k)', space: 'O(m * n * 2^k)' },
            requiredForProgress: true,
            difficulty: 'hard',
            instruction: `# Shortest Path to Get All Keys

## The Problem

Given a grid where:
- '@' is starting point
- 'a'-'f' are keys
- 'A'-'F' are locks (need corresponding lowercase key)
- '.' is empty, '#' is wall

Find the shortest path to collect all keys.

**Example:**
\`\`\`
grid = ["@.a.#","###.#","b.A.B"]
Output: 8

Path: @ -> . -> a -> . -> . -> . -> A -> . -> B
\`\`\`

## Key Insight

**State = (row, col, keys_collected)**

You can visit the same cell multiple times with different sets of keys!

## Your Task

BFS with state (position + bitmask of keys collected).`,
            starterCode: `def shortestPathAllKeys(grid: list[str]) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `from collections import deque

def shortestPathAllKeys(grid: list[str]) -> int:
    rows, cols = len(grid), len(grid[0])

    # Find start and count keys
    start_r = start_c = 0
    total_keys = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '@':
                start_r, start_c = r, c
            elif 'a' <= grid[r][c] <= 'f':
                total_keys += 1

    all_keys = (1 << total_keys) - 1  # All keys collected

    # BFS: state = (row, col, keys_bitmask)
    queue = deque([(start_r, start_c, 0, 0)])  # (r, c, keys, steps)
    visited = set()
    visited.add((start_r, start_c, 0))

    while queue:
        r, c, keys, steps = queue.popleft()

        if keys == all_keys:
            return steps

        for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
            nr, nc = r + dr, c + dc

            if 0 <= nr < rows and 0 <= nc < cols:
                cell = grid[nr][nc]

                if cell == '#':
                    continue

                # Lock without key
                if 'A' <= cell <= 'F':
                    key_needed = 1 << (ord(cell) - ord('A'))
                    if not (keys & key_needed):
                        continue

                new_keys = keys
                # Collect key
                if 'a' <= cell <= 'f':
                    new_keys |= (1 << (ord(cell) - ord('a')))

                if (nr, nc, new_keys) not in visited:
                    visited.add((nr, nc, new_keys))
                    queue.append((nr, nc, new_keys, steps + 1))

    return -1

# Test
print(shortestPathAllKeys(["@.a.#","###.#","b.A.B"]))  # 8`
            },
            hints: [
                { afterAttempt: 1, text: 'State needs to track which keys you have, not just position' },
                { afterAttempt: 2, text: 'Use bitmask for keys: key "a" = bit 0, "b" = bit 1, etc.' },
                { afterAttempt: 3, text: 'Can revisit same cell with different key sets' },
            ],
            testCases: [
                { input: '["@.a.#","###.#","b.A.B"]', expectedOutput: '8' }
            ],
            solutionExplanation: `## Pattern: BFS with Complex State

Regular BFS: visited = set of positions
This BFS: visited = set of (position, keys_collected)

**Key insight:** Same position with different keys = different states.

**Bitmask for keys:**
- key 'a' = bit 0 (1)
- key 'b' = bit 1 (2)
- all 3 keys = 111 = 7

## Complexity
- **Time:** O(m * n * 2^k) where k = number of keys
- **Space:** O(m * n * 2^k)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-walls-and-gates',
            title: 'Walls and Gates',
            description: 'Fill each empty room with distance to nearest gate',
            targetComplexity: { time: 'O(m * n)', space: 'O(m * n)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Walls and Gates

## The Problem

Given a grid where:
- -1 = wall
- 0 = gate
- INF = empty room (use 2^31 - 1)

Fill each empty room with the distance to its nearest gate. If impossible, leave as INF.

**Example:**
\`\`\`
INF  -1  0  INF
INF INF INF  -1
INF  -1 INF  -1
  0  -1 INF INF

Output:
  3  -1  0   1
  2   2  1  -1
  1  -1  2  -1
  0  -1  3   4
\`\`\`

## Key Insight

This is **multi-source BFS**! Start from all gates simultaneously.

## Your Task

BFS from all gates at once, updating distances as you go.`,
            starterCode: `def wallsAndGates(rooms: list[list[int]]) -> None:
    """Modify rooms in-place."""
    pass`,
            solution: {
                afterAttempt: 3,
                text: `from collections import deque

def wallsAndGates(rooms: list[list[int]]) -> None:
    if not rooms:
        return

    rows, cols = len(rooms), len(rooms[0])
    INF = 2147483647
    queue = deque()

    # Add all gates to queue
    for r in range(rows):
        for c in range(cols):
            if rooms[r][c] == 0:
                queue.append((r, c))

    # Multi-source BFS
    while queue:
        r, c = queue.popleft()

        for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
            nr, nc = r + dr, c + dc

            if (0 <= nr < rows and 0 <= nc < cols and
                rooms[nr][nc] == INF):
                rooms[nr][nc] = rooms[r][c] + 1
                queue.append((nr, nc))

# Test
rooms = [[2147483647,-1,0,2147483647],[2147483647,2147483647,2147483647,-1],[2147483647,-1,2147483647,-1],[0,-1,2147483647,2147483647]]
wallsAndGates(rooms)
print(rooms)`
            },
            hints: [
                { afterAttempt: 1, text: 'This is like Rotting Oranges - multi-source BFS' },
                { afterAttempt: 2, text: 'Add all gates (0s) to queue initially' },
                { afterAttempt: 3, text: 'Only update cells that are INF (empty rooms)' },
            ],
            testCases: [
                { input: 'INF grid with gates', expectedOutput: 'Distance grid' }
            ],
            solutionExplanation: `## LeetCode 286

Same pattern as Rotting Oranges:
1. Add all sources (gates) to queue
2. BFS outward, updating distances

**Why multi-source works:** All gates expand simultaneously, so first to reach a room gives shortest distance.

## Complexity
- **Time:** O(m * n)
- **Space:** O(m * n)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-escape-fire',
            title: 'Escape the Spreading Fire',
            description: 'Find if you can escape before fire reaches you',
            targetComplexity: { time: 'O(m * n)', space: 'O(m * n)' },
            requiredForProgress: true,
            difficulty: 'hard',
            instruction: `# Escape the Spreading Fire

## The Problem

Given a grid where:
- 0 = empty
- 1 = fire
- 2 = wall

You start at (0, 0) and need to reach (m-1, n-1). Fire spreads to adjacent cells each minute. Can you escape?

**Example:**
\`\`\`
[[0,2,0,0,0,0,0],
 [0,0,0,2,2,1,0],
 [0,2,0,0,1,2,0],
 [0,0,2,2,2,0,2],
 [0,0,0,0,0,0,0]]

Output: 3 (can wait 3 minutes at start)
\`\`\`

## Key Insight

First, BFS to find when fire reaches each cell. Then BFS to find when you can reach the exit.

## Your Task

Two BFS passes: fire spread times, then player path.`,
            starterCode: `def maximumMinutes(grid: list[list[int]]) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `from collections import deque

def maximumMinutes(grid: list[list[int]]) -> int:
    m, n = len(grid), len(grid[0])
    INF = float('inf')

    # BFS to find when fire reaches each cell
    fire_time = [[INF] * n for _ in range(m)]
    queue = deque()

    for r in range(m):
        for c in range(n):
            if grid[r][c] == 1:
                fire_time[r][c] = 0
                queue.append((r, c, 0))

    while queue:
        r, c, t = queue.popleft()
        for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
            nr, nc = r + dr, c + dc
            if (0 <= nr < m and 0 <= nc < n and
                grid[nr][nc] == 0 and fire_time[nr][nc] == INF):
                fire_time[nr][nc] = t + 1
                queue.append((nr, nc, t + 1))

    # Binary search on wait time
    def canEscape(wait: int) -> bool:
        if fire_time[0][0] <= wait:
            return False

        visited = [[False] * n for _ in range(m)]
        visited[0][0] = True
        queue = deque([(0, 0, wait)])

        while queue:
            r, c, t = queue.popleft()

            for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
                nr, nc = r + dr, c + dc

                if not (0 <= nr < m and 0 <= nc < n):
                    continue
                if grid[nr][nc] != 0 or visited[nr][nc]:
                    continue

                new_time = t + 1
                # At destination, can arrive at same time as fire
                if nr == m - 1 and nc == n - 1:
                    if new_time <= fire_time[nr][nc]:
                        return True
                else:
                    if new_time < fire_time[nr][nc]:
                        visited[nr][nc] = True
                        queue.append((nr, nc, new_time))

        return False

    # Binary search
    left, right = 0, m * n
    result = -1

    while left <= right:
        mid = (left + right) // 2
        if canEscape(mid):
            result = mid
            left = mid + 1
        else:
            right = mid - 1

    return result if result <= 10**9 else 10**9

# Test
grid = [[0,2,0,0,0,0,0],[0,0,0,2,2,1,0],[0,2,0,0,1,2,0],[0,0,2,2,2,0,2],[0,0,0,0,0,0,0]]
print(maximumMinutes(grid))  # 3`
            },
            hints: [
                { afterAttempt: 1, text: 'First BFS: compute fire arrival time for each cell' },
                { afterAttempt: 2, text: 'Second: check if you can reach destination before fire' },
                { afterAttempt: 3, text: 'Use binary search on wait time for optimal answer' },
            ],
            testCases: [
                { input: '[[0,2,0,0,0,0,0],[0,0,0,2,2,1,0],[0,2,0,0,1,2,0],[0,0,2,2,2,0,2],[0,0,0,0,0,0,0]]', expectedOutput: '3' }
            ],
            solutionExplanation: `## LeetCode 2258

Two-phase BFS + binary search:
1. BFS from all fire sources to get fire arrival times
2. Binary search on wait time
3. For each wait time, BFS to check if escape possible

**Edge case:** At destination, can arrive at same time as fire (escape just in time).

## Complexity
- **Time:** O(m * n * log(m * n))
- **Space:** O(m * n)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-jump-game-bfs',
            title: 'Jump Game III (BFS)',
            description: 'Check if you can reach index with value 0',
            targetComplexity: { time: 'O(n)', space: 'O(n)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Jump Game III

## The Problem

Given an array arr and a starting index start. From index i, you can jump to:
- i + arr[i]
- i - arr[i]

Return true if you can reach any index with value 0.

**Example:**
\`\`\`
arr = [4,2,3,0,3,1,2], start = 5
Output: true

Path: 5 -> 4 -> 1 -> 3, and arr[3] = 0
\`\`\`

## Your Task

BFS from start, check if you can reach any 0.`,
            starterCode: `def canReach(arr: list[int], start: int) -> bool:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `from collections import deque

def canReach(arr: list[int], start: int) -> bool:
    n = len(arr)
    visited = [False] * n
    queue = deque([start])
    visited[start] = True

    while queue:
        i = queue.popleft()

        if arr[i] == 0:
            return True

        # Try both jumps
        for next_i in [i + arr[i], i - arr[i]]:
            if 0 <= next_i < n and not visited[next_i]:
                visited[next_i] = True
                queue.append(next_i)

    return False

# Test
print(canReach([4,2,3,0,3,1,2], 5))  # True`
            },
            hints: [
                { afterAttempt: 1, text: 'This is graph traversal where indices are nodes' },
                { afterAttempt: 2, text: 'From index i, you have two edges: i+arr[i] and i-arr[i]' },
            ],
            testCases: [
                { input: '[4,2,3,0,3,1,2], 5', expectedOutput: 'True' },
                { input: '[3,0,2,1,2], 2', expectedOutput: 'False' }
            ],
            solutionExplanation: `## LeetCode 1306

Array as implicit graph:
- Nodes: indices 0 to n-1
- Edges: i → i+arr[i] and i → i-arr[i]
- Target: any node with arr[node] == 0

## Complexity
- **Time:** O(n)
- **Space:** O(n)`
        },

  // ============================================================
  // GROUP 5: CYCLE DETECTION (ADDITIONAL)
  // ============================================================
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-cycle-directed',
            title: 'Detect Cycle in Directed Graph',
            description: 'Return true if cycle exists in directed graph',
            targetComplexity: { time: 'O(V + E)', space: 'O(V)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Detect Cycle in Directed Graph

## The Problem

Given a directed graph, return true if it contains a cycle.

**Example:**
\`\`\`
n = 4, edges = [[0,1], [1,2], [2,0], [2,3]]
Output: true (cycle: 0 -> 1 -> 2 -> 0)

n = 4, edges = [[0,1], [1,2], [2,3]]
Output: false
\`\`\`

## Key Insight

Use 3-color DFS:
- WHITE (0): unvisited
- GRAY (1): currently in DFS path
- BLACK (2): completely processed

If you visit a GRAY node, there's a cycle!

## Your Task

Implement 3-color DFS for cycle detection.`,
            starterCode: `def hasCycle(n: int, edges: list[list[int]]) -> bool:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def hasCycle(n: int, edges: list[list[int]]) -> bool:
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)

    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * n

    def dfs(node):
        color[node] = GRAY

        for neighbor in graph[node]:
            if color[neighbor] == GRAY:
                return True  # Cycle found
            if color[neighbor] == WHITE:
                if dfs(neighbor):
                    return True

        color[node] = BLACK
        return False

    for i in range(n):
        if color[i] == WHITE:
            if dfs(i):
                return True

    return False

# Test
print(hasCycle(4, [[0,1],[1,2],[2,0],[2,3]]))  # True
print(hasCycle(4, [[0,1],[1,2],[2,3]]))        # False`
            },
            hints: [
                { afterAttempt: 1, text: 'Use 3 colors: WHITE, GRAY, BLACK' },
                { afterAttempt: 2, text: 'GRAY = currently exploring. If you see GRAY, it\'s a back edge = cycle' },
                { afterAttempt: 3, text: 'Mark BLACK when done with all descendants' },
            ],
            testCases: [
                { input: '4, [[0,1],[1,2],[2,0],[2,3]]', expectedOutput: 'True' },
                { input: '4, [[0,1],[1,2],[2,3]]', expectedOutput: 'False' }
            ],
            solutionExplanation: `## Pattern: 3-Color DFS

Same as Course Schedule, isolated as a pattern:
- GRAY = on current DFS path
- Seeing GRAY again = back edge = cycle

## Complexity
- **Time:** O(V + E)
- **Space:** O(V)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-cycle-undirected',
            title: 'Detect Cycle in Undirected Graph',
            description: 'Return true if cycle exists in undirected graph',
            targetComplexity: { time: 'O(V + E)', space: 'O(V)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Detect Cycle in Undirected Graph

## The Problem

Given an undirected graph, return true if it contains a cycle.

**Example:**
\`\`\`
n = 4, edges = [[0,1], [1,2], [2,0]]
Output: true (cycle: 0 - 1 - 2 - 0)

n = 4, edges = [[0,1], [1,2], [2,3]]
Output: false
\`\`\`

## Key Difference from Directed

In undirected graphs, you need to track the **parent** to avoid counting the edge you came from.

## Your Task

DFS with parent tracking.`,
            starterCode: `def hasCycle(n: int, edges: list[list[int]]) -> bool:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def hasCycle(n: int, edges: list[list[int]]) -> bool:
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    visited = [False] * n

    def dfs(node, parent):
        visited[node] = True

        for neighbor in graph[node]:
            if not visited[neighbor]:
                if dfs(neighbor, node):
                    return True
            elif neighbor != parent:
                return True  # Visited but not parent = cycle

        return False

    for i in range(n):
        if not visited[i]:
            if dfs(i, -1):
                return True

    return False

# Test
print(hasCycle(4, [[0,1],[1,2],[2,0]]))  # True
print(hasCycle(4, [[0,1],[1,2],[2,3]]))  # False`
            },
            hints: [
                { afterAttempt: 1, text: 'In undirected, each edge creates two entries in adjacency list' },
                { afterAttempt: 2, text: 'Track parent: if neighbor is visited AND not parent, it\'s a cycle' },
                { afterAttempt: 3, text: 'Parent = the node we came from (ignore that edge)' },
            ],
            testCases: [
                { input: '4, [[0,1],[1,2],[2,0]]', expectedOutput: 'True' },
                { input: '4, [[0,1],[1,2],[2,3]]', expectedOutput: 'False' }
            ],
            solutionExplanation: `## Undirected vs Directed Cycle Detection

**Directed:** Use 3-color (GRAY = cycle)
**Undirected:** Use parent tracking

In undirected, edge A-B appears twice:
- A's neighbors include B
- B's neighbors include A

Without parent tracking, we'd think A-B-A is a cycle!

## Complexity
- **Time:** O(V + E)
- **Space:** O(V)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-eventual-safe-states',
            title: 'Find Eventual Safe States',
            description: 'Find nodes not part of any cycle',
            targetComplexity: { time: 'O(V + E)', space: 'O(V)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Find Eventual Safe States

## The Problem

A node is a **safe node** if every possible path starting from that node leads to a terminal node (a node with no outgoing edges).

Return all safe nodes in sorted order.

**Example:**
\`\`\`
graph = [[1,2],[2,3],[5],[0],[5],[],[]]

Node 0 -> 1 or 2
Node 1 -> 2 or 3
Node 2 -> 5 (terminal)
Node 3 -> 0 (leads to cycle!)
...

Output: [2, 4, 5, 6]
Nodes in or leading to cycles are unsafe.
\`\`\`

## Key Insight

Safe nodes are those NOT part of any cycle and NOT leading to a cycle.

## Your Task

Use 3-color DFS. Safe nodes are marked BLACK.`,
            starterCode: `def eventualSafeNodes(graph: list[list[int]]) -> list[int]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def eventualSafeNodes(graph: list[list[int]]) -> list[int]:
    n = len(graph)
    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * n

    def isSafe(node):
        if color[node] != WHITE:
            return color[node] == BLACK

        color[node] = GRAY

        for neighbor in graph[node]:
            if not isSafe(neighbor):
                return False

        color[node] = BLACK
        return True

    return [i for i in range(n) if isSafe(i)]

# Test
print(eventualSafeNodes([[1,2],[2,3],[5],[0],[5],[],[]]))  # [2, 4, 5, 6]`
            },
            hints: [
                { afterAttempt: 1, text: 'Terminal nodes (no outgoing edges) are safe' },
                { afterAttempt: 2, text: 'A node is safe if ALL its neighbors are safe' },
                { afterAttempt: 3, text: 'Use 3-color: BLACK = safe, GRAY = in cycle' },
            ],
            testCases: [
                { input: '[[1,2],[2,3],[5],[0],[5],[],[]]', expectedOutput: '[2, 4, 5, 6]' }
            ],
            solutionExplanation: `## LeetCode 802

Variation of cycle detection:
- GRAY nodes are in a cycle (unsafe)
- BLACK nodes are safe
- A node is safe iff ALL neighbors are safe

**Key insight:** If any path leads to a cycle, the node is unsafe.

## Complexity
- **Time:** O(V + E)
- **Space:** O(V)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-redundant-connection',
            title: 'Redundant Connection',
            description: 'Find the edge that creates a cycle',
            targetComplexity: { time: 'O(n)', space: 'O(n)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Redundant Connection

## The Problem

Given a graph that started as a tree with n nodes, one additional edge was added. Find and return this edge.

If there are multiple answers, return the one that appears last in the input.

**Example:**
\`\`\`
edges = [[1,2],[1,3],[2,3]]

Original tree: 1-2, 1-3
Added edge: 2-3 (creates cycle 1-2-3-1)

Output: [2,3]
\`\`\`

## Key Insight

Use Union-Find. The first edge that connects already-connected nodes creates the cycle.

## Your Task

Process edges in order. Return the first edge where both nodes are already in the same component.`,
            starterCode: `def findRedundantConnection(edges: list[list[int]]) -> list[int]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def findRedundantConnection(edges: list[list[int]]) -> list[int]:
    n = len(edges)
    parent = list(range(n + 1))
    rank = [0] * (n + 1)

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])  # Path compression
        return parent[x]

    def union(x, y):
        px, py = find(x), find(y)
        if px == py:
            return False  # Already connected - cycle!

        # Union by rank
        if rank[px] < rank[py]:
            parent[px] = py
        elif rank[px] > rank[py]:
            parent[py] = px
        else:
            parent[py] = px
            rank[px] += 1

        return True

    for u, v in edges:
        if not union(u, v):
            return [u, v]

    return []

# Test
print(findRedundantConnection([[1,2],[1,3],[2,3]]))  # [2, 3]`
            },
            hints: [
                { afterAttempt: 1, text: 'Use Union-Find (Disjoint Set Union)' },
                { afterAttempt: 2, text: 'If two nodes are already in same set, this edge creates cycle' },
                { afterAttempt: 3, text: 'Process edges in order, return first redundant edge' },
            ],
            testCases: [
                { input: '[[1,2],[1,3],[2,3]]', expectedOutput: '[2, 3]' },
                { input: '[[1,2],[2,3],[3,4],[1,4],[1,5]]', expectedOutput: '[1, 4]' }
            ],
            solutionExplanation: `## LeetCode 684

Classic Union-Find application:
1. Process edges in order
2. For each edge, try to union the two nodes
3. If already in same set, this edge is redundant

**Why Union-Find:** More efficient than DFS for repeated connectivity queries.

## Complexity
- **Time:** O(n * α(n)) ≈ O(n)
- **Space:** O(n)`
        },

  // ============================================================
  // GROUP 6: TOPOLOGICAL SORT (ADDITIONAL)
  // ============================================================
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-topological-dfs',
            title: 'Topological Sort (DFS)',
            description: 'Return topological ordering using DFS post-order',
            targetComplexity: { time: 'O(V + E)', space: 'O(V)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Topological Sort (DFS-based)

## The Problem

Given a DAG (Directed Acyclic Graph), return a valid topological ordering.

**Example:**
\`\`\`
n = 6, edges = [[5,2], [5,0], [4,0], [4,1], [2,3], [3,1]]

Valid orderings: [5,4,2,3,1,0], [4,5,2,3,1,0], etc.
\`\`\`

## Key Insight

**Post-order DFS + reverse = topological order!**

When you finish processing a node (all descendants done), add it to result. Reverse at the end.

## Your Task

DFS with post-order recording.`,
            starterCode: `def topologicalSort(n: int, edges: list[list[int]]) -> list[int]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def topologicalSort(n: int, edges: list[list[int]]) -> list[int]:
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)

    visited = [False] * n
    result = []

    def dfs(node):
        visited[node] = True

        for neighbor in graph[node]:
            if not visited[neighbor]:
                dfs(neighbor)

        result.append(node)  # Post-order

    for i in range(n):
        if not visited[i]:
            dfs(i)

    return result[::-1]  # Reverse for topological order

# Test
print(topologicalSort(6, [[5,2],[5,0],[4,0],[4,1],[2,3],[3,1]]))
# Possible output: [5, 4, 2, 3, 1, 0]`
            },
            hints: [
                { afterAttempt: 1, text: 'Add node to result AFTER processing all its neighbors' },
                { afterAttempt: 2, text: 'This is post-order traversal' },
                { afterAttempt: 3, text: 'Reverse the result at the end' },
            ],
            testCases: [
                { input: '6, [[5,2],[5,0],[4,0],[4,1],[2,3],[3,1]]', expectedOutput: 'Valid topological order' }
            ],
            solutionExplanation: `## Pattern: Post-Order DFS

Same as Course Schedule II but isolated as a pattern.

**Why post-order + reverse works:**
- Post-order: add node after all descendants
- Descendants appear AFTER the node in result
- Reverse: descendants appear BEFORE the node

## Complexity
- **Time:** O(V + E)
- **Space:** O(V)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-topological-kahn',
            title: "Topological Sort (Kahn's Algorithm / BFS)",
            description: 'Return topological ordering using BFS with in-degree',
            targetComplexity: { time: 'O(V + E)', space: 'O(V)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Topological Sort (Kahn's Algorithm)

## The Problem

Same as DFS topological sort, but using BFS approach.

**Algorithm:**
1. Count in-degree for each node
2. Add nodes with in-degree 0 to queue
3. Process queue, reducing in-degrees
4. Add new zero in-degree nodes to queue

**Example:**
\`\`\`
n = 6, edges = [[5,2], [5,0], [4,0], [4,1], [2,3], [3,1]]
\`\`\`

## Your Task

Implement Kahn's algorithm with in-degree tracking.`,
            starterCode: `def topologicalSortKahn(n: int, edges: list[list[int]]) -> list[int]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `from collections import deque

def topologicalSortKahn(n: int, edges: list[list[int]]) -> list[int]:
    graph = [[] for _ in range(n)]
    in_degree = [0] * n

    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1

    # Start with nodes having no dependencies
    queue = deque([i for i in range(n) if in_degree[i] == 0])
    result = []

    while queue:
        node = queue.popleft()
        result.append(node)

        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If not all nodes processed, there's a cycle
    return result if len(result) == n else []

# Test
print(topologicalSortKahn(6, [[5,2],[5,0],[4,0],[4,1],[2,3],[3,1]]))
# Possible output: [4, 5, 0, 2, 3, 1]`
            },
            hints: [
                { afterAttempt: 1, text: 'Count incoming edges (in-degree) for each node' },
                { afterAttempt: 2, text: 'Nodes with in-degree 0 have no dependencies - process first' },
                { afterAttempt: 3, text: 'When processing node, decrement in-degree of neighbors' },
            ],
            testCases: [
                { input: '6, [[5,2],[5,0],[4,0],[4,1],[2,3],[3,1]]', expectedOutput: 'Valid topological order' }
            ],
            solutionExplanation: `## Kahn's Algorithm (BFS approach)

Alternative to DFS:
1. Compute in-degrees
2. Process nodes with in-degree 0
3. Decrement neighbors' in-degrees
4. Add new zero-degree nodes to queue

**Cycle detection:** If result.length < n, there's a cycle.

## Complexity
- **Time:** O(V + E)
- **Space:** O(V)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-build-order',
            title: 'Build System Dependencies',
            description: 'Return build order or detect circular dependency',
            targetComplexity: { time: 'O(V + E)', space: 'O(V)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Build System Dependencies

## The Problem

You're given a list of projects and a list of dependencies (pairs of projects where the second depends on the first).

Return a build order, or empty list if circular dependency exists.

**Example:**
\`\`\`
projects = ['a', 'b', 'c', 'd', 'e', 'f']
dependencies = [('a', 'd'), ('f', 'b'), ('b', 'd'), ('f', 'a'), ('d', 'c')]

d depends on a and b
a depends on f
b depends on f

Output: ['f', 'e', 'a', 'b', 'd', 'c'] or similar valid order
\`\`\`

## Your Task

Map project names to indices, then run topological sort.`,
            starterCode: `def findBuildOrder(projects: list[str], dependencies: list[tuple]) -> list[str]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `from collections import deque

def findBuildOrder(projects: list[str], dependencies: list[tuple]) -> list[str]:
    # Map project names to indices
    proj_to_idx = {p: i for i, p in enumerate(projects)}
    n = len(projects)

    graph = [[] for _ in range(n)]
    in_degree = [0] * n

    for first, second in dependencies:
        u, v = proj_to_idx[first], proj_to_idx[second]
        graph[u].append(v)
        in_degree[v] += 1

    # Kahn's algorithm
    queue = deque([i for i in range(n) if in_degree[i] == 0])
    result = []

    while queue:
        node = queue.popleft()
        result.append(projects[node])

        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return result if len(result) == n else []

# Test
projects = ['a', 'b', 'c', 'd', 'e', 'f']
deps = [('a', 'd'), ('f', 'b'), ('b', 'd'), ('f', 'a'), ('d', 'c')]
print(findBuildOrder(projects, deps))  # ['f', 'e', 'a', 'b', 'd', 'c'] or similar`
            },
            hints: [
                { afterAttempt: 1, text: 'Map project names to numbers for easier graph handling' },
                { afterAttempt: 2, text: 'Use topological sort (Kahn\'s or DFS)' },
                { afterAttempt: 3, text: 'If result has fewer items than projects, there\'s a cycle' },
            ],
            testCases: [
                { input: 'projects, dependencies', expectedOutput: 'Valid build order' }
            ],
            solutionExplanation: `## Real-World Topological Sort

Same as Course Schedule II, but with named nodes.

**Steps:**
1. Create project name → index mapping
2. Build graph and in-degrees
3. Run topological sort
4. Map indices back to names

## Complexity
- **Time:** O(P + D) where P = projects, D = dependencies
- **Space:** O(P)`
        },

  // ============================================================
  // GROUP 7: GRAPH COLORING (ADDITIONAL)
  // ============================================================
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-possible-bipartition',
            title: 'Possible Bipartition',
            description: 'Split people into two groups where dislikes are in different groups',
            targetComplexity: { time: 'O(V + E)', space: 'O(V)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Possible Bipartition

## The Problem

Given n people labeled from 1 to n, and an array of dislikes where dislikes[i] = [a, b] means person a and person b dislike each other.

Return true if it's possible to split everyone into two groups such that no two people who dislike each other are in the same group.

**Example:**
\`\`\`
n = 4, dislikes = [[1,2],[1,3],[2,4]]
Output: true (Group 1: {1,4}, Group 2: {2,3})

n = 3, dislikes = [[1,2],[1,3],[2,3]]
Output: false (triangle - can't 2-color)
\`\`\`

## Key Insight

This is exactly the bipartite check problem!

## Your Task

2-color the graph formed by dislike edges.`,
            starterCode: `def possibleBipartition(n: int, dislikes: list[list[int]]) -> bool:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `from collections import deque

def possibleBipartition(n: int, dislikes: list[list[int]]) -> bool:
    graph = [[] for _ in range(n + 1)]
    for a, b in dislikes:
        graph[a].append(b)
        graph[b].append(a)

    color = [-1] * (n + 1)  # -1 = uncolored

    def bfs(start):
        queue = deque([start])
        color[start] = 0

        while queue:
            node = queue.popleft()
            for neighbor in graph[node]:
                if color[neighbor] == -1:
                    color[neighbor] = 1 - color[node]
                    queue.append(neighbor)
                elif color[neighbor] == color[node]:
                    return False
        return True

    for i in range(1, n + 1):
        if color[i] == -1:
            if not bfs(i):
                return False

    return True

# Test
print(possibleBipartition(4, [[1,2],[1,3],[2,4]]))  # True
print(possibleBipartition(3, [[1,2],[1,3],[2,3]]))  # False`
            },
            hints: [
                { afterAttempt: 1, text: 'Build graph from dislikes (undirected edges)' },
                { afterAttempt: 2, text: 'Run bipartite check (2-coloring)' },
                { afterAttempt: 3, text: 'If same color on both ends of any edge, return False' },
            ],
            testCases: [
                { input: '4, [[1,2],[1,3],[2,4]]', expectedOutput: 'True' },
                { input: '3, [[1,2],[1,3],[2,3]]', expectedOutput: 'False' }
            ],
            solutionExplanation: `## LeetCode 886

Exactly the same as "Is Bipartite":
- Nodes = people
- Edges = dislikes
- 2-colorable = can split into two groups

## Complexity
- **Time:** O(V + E)
- **Space:** O(V)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-odd-length-cycle',
            title: 'Check Odd-Length Cycle',
            description: 'Return true if graph has an odd-length cycle',
            targetComplexity: { time: 'O(V + E)', space: 'O(V)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Check Odd-Length Cycle

## The Problem

Given an undirected graph, return true if it contains a cycle of odd length.

**Example:**
\`\`\`
n = 3, edges = [[0,1], [1,2], [2,0]]
Output: true (triangle has length 3 = odd)

n = 4, edges = [[0,1], [1,2], [2,3], [3,0]]
Output: false (square has length 4 = even)
\`\`\`

## Key Insight

**Graph has odd cycle ⟺ Graph is NOT bipartite!**

A bipartite graph only has even-length cycles. If you can't 2-color it, there's an odd cycle.

## Your Task

Check if graph is NOT bipartite.`,
            starterCode: `def hasOddCycle(n: int, edges: list[list[int]]) -> bool:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `from collections import deque

def hasOddCycle(n: int, edges: list[list[int]]) -> bool:
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    color = [-1] * n

    def isBipartite(start):
        queue = deque([start])
        color[start] = 0

        while queue:
            node = queue.popleft()
            for neighbor in graph[node]:
                if color[neighbor] == -1:
                    color[neighbor] = 1 - color[node]
                    queue.append(neighbor)
                elif color[neighbor] == color[node]:
                    return False
        return True

    for i in range(n):
        if color[i] == -1:
            if not isBipartite(i):
                return True  # Not bipartite = has odd cycle

    return False

# Test
print(hasOddCycle(3, [[0,1],[1,2],[2,0]]))  # True (triangle)
print(hasOddCycle(4, [[0,1],[1,2],[2,3],[3,0]]))  # False (square)`
            },
            hints: [
                { afterAttempt: 1, text: 'Odd cycle ⟺ Not bipartite' },
                { afterAttempt: 2, text: 'Run bipartite check, return NOT result' },
            ],
            testCases: [
                { input: '3, [[0,1],[1,2],[2,0]]', expectedOutput: 'True' },
                { input: '4, [[0,1],[1,2],[2,3],[3,0]]', expectedOutput: 'False' }
            ],
            solutionExplanation: `## Mathematical Connection

**Theorem:** A graph is bipartite if and only if it contains no odd-length cycles.

**Proof intuition:**
- Bipartite = alternating colors along any path
- If cycle has odd length, you return to start with wrong color

## Complexity
- **Time:** O(V + E)
- **Space:** O(V)`
        },

  // ============================================================
  // GROUP 8: DFS TREE PROPERTIES
  // ============================================================
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-time-inform-employees',
            title: 'Time to Inform All Employees',
            description: 'Find time for news to reach all employees in a hierarchy',
            targetComplexity: { time: 'O(n)', space: 'O(n)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Time to Inform All Employees

## The Problem

A company has n employees with IDs from 0 to n-1. Each employee has one direct manager given by manager[i]. The head of the company is the employee with headID.

informTime[i] is the time employee i needs to inform all their direct subordinates.

Return the time needed for all employees to be informed.

**Example:**
\`\`\`
n = 6, headID = 2
manager = [2,2,-1,2,2,2]
informTime = [0,0,1,0,0,0]

Employee 2 (head) informs employees 0,1,3,4,5 in 1 minute.
Output: 1
\`\`\`

## Key Insight

This is a tree! DFS from head, sum inform times along each path.

## Your Task

Build tree from manager array, DFS to find longest path.`,
            starterCode: `def numOfMinutes(n: int, headID: int, manager: list[int], informTime: list[int]) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def numOfMinutes(n: int, headID: int, manager: list[int], informTime: list[int]) -> int:
    # Build tree: subordinates[i] = list of direct reports
    subordinates = [[] for _ in range(n)]
    for i in range(n):
        if manager[i] != -1:
            subordinates[manager[i]].append(i)

    def dfs(emp):
        if not subordinates[emp]:
            return 0  # No subordinates

        max_time = 0
        for sub in subordinates[emp]:
            max_time = max(max_time, dfs(sub))

        return informTime[emp] + max_time

    return dfs(headID)

# Test
print(numOfMinutes(6, 2, [2,2,-1,2,2,2], [0,0,1,0,0,0]))  # 1`
            },
            hints: [
                { afterAttempt: 1, text: 'Build subordinates list from manager array' },
                { afterAttempt: 2, text: 'DFS returns max time to inform all employees in subtree' },
                { afterAttempt: 3, text: 'Total = informTime[node] + max of children\'s times' },
            ],
            testCases: [
                { input: '6, 2, [2,2,-1,2,2,2], [0,0,1,0,0,0]', expectedOutput: '1' },
                { input: '1, 0, [-1], [0]', expectedOutput: '0' }
            ],
            solutionExplanation: `## LeetCode 1376

Tree DFS with accumulation:
1. Build tree from parent pointers
2. DFS to find max path time

**Key insight:** News spreads in parallel to all subordinates. Time = inform time + max of children's times.

## Complexity
- **Time:** O(n)
- **Space:** O(n)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-sum-distances-tree',
            title: 'Sum of Distances in Tree',
            description: 'Calculate sum of distances from each node to all others',
            targetComplexity: { time: 'O(n)', space: 'O(n)' },
            requiredForProgress: true,
            difficulty: 'hard',
            instruction: `# Sum of Distances in Tree

## The Problem

Given a tree with n nodes, return an array answer where answer[i] is the sum of distances from node i to all other nodes.

**Example:**
\`\`\`
n = 6, edges = [[0,1],[0,2],[2,3],[2,4],[2,5]]

Tree:
    0
   / \\
  1   2
     /|\\
    3 4 5

answer[0] = dist(0,1) + dist(0,2) + dist(0,3) + dist(0,4) + dist(0,5)
          = 1 + 1 + 2 + 2 + 2 = 8

Output: [8, 12, 6, 10, 10, 10]
\`\`\`

## Key Insight

Naive approach: O(n²) DFS from each node. Too slow!

**Optimization:** Use re-rooting technique. Compute for root, then derive others.

## Your Task

Two DFS passes: compute subtree sizes, then use re-rooting.`,
            starterCode: `def sumOfDistancesInTree(n: int, edges: list[list[int]]) -> list[int]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def sumOfDistancesInTree(n: int, edges: list[list[int]]) -> list[int]:
    if n == 1:
        return [0]

    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    count = [1] * n  # Subtree size
    answer = [0] * n

    # First DFS: compute subtree sizes and answer[0]
    def dfs1(node, parent):
        for child in graph[node]:
            if child != parent:
                dfs1(child, node)
                count[node] += count[child]
                answer[0] += count[child]  # Each node in subtree adds its depth

    # Second DFS: compute answer for all nodes using re-rooting
    def dfs2(node, parent):
        for child in graph[node]:
            if child != parent:
                # Moving root from node to child:
                # - Nodes in child's subtree get 1 closer: -count[child]
                # - Other nodes get 1 farther: +(n - count[child])
                answer[child] = answer[node] - count[child] + (n - count[child])
                dfs2(child, node)

    dfs1(0, -1)
    dfs2(0, -1)

    return answer

# Test
print(sumOfDistancesInTree(6, [[0,1],[0,2],[2,3],[2,4],[2,5]]))
# [8, 12, 6, 10, 10, 10]`
            },
            hints: [
                { afterAttempt: 1, text: 'First compute answer for root (node 0)' },
                { afterAttempt: 2, text: 'When moving root from parent to child, some nodes get closer, others farther' },
                { afterAttempt: 3, text: 'answer[child] = answer[parent] - count[child] + (n - count[child])' },
            ],
            testCases: [
                { input: '6, [[0,1],[0,2],[2,3],[2,4],[2,5]]', expectedOutput: '[8, 12, 6, 10, 10, 10]' }
            ],
            solutionExplanation: `## LeetCode 834

**Re-rooting technique:**

1. First DFS: Compute answer for root
   - Also compute subtree sizes

2. Second DFS: Derive answers for other nodes
   - When moving root from parent to child:
   - count[child] nodes get 1 closer
   - (n - count[child]) nodes get 1 farther
   - answer[child] = answer[parent] - count[child] + (n - count[child])

## Complexity
- **Time:** O(n)
- **Space:** O(n)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-tree-diameter',
            title: 'Tree Diameter',
            description: 'Find the longest path in a tree',
            targetComplexity: { time: 'O(n)', space: 'O(n)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Tree Diameter

## The Problem

Given an undirected tree, find the length of the longest path between any two nodes.

**Example:**
\`\`\`
edges = [[0,1],[0,2],[0,3],[3,4],[4,5]]

Tree:
    1
    |
    0 - 2
    |
    3
    |
    4
    |
    5

Longest path: 1 - 0 - 3 - 4 - 5 (length 4)
Output: 4
\`\`\`

## Key Insight

Two approaches:
1. Two BFS: Find farthest from any node, then farthest from that
2. DFS: At each node, diameter passes through it OR through children

## Your Task

DFS to compute longest path through each node.`,
            starterCode: `def treeDiameter(edges: list[list[int]]) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def treeDiameter(edges: list[list[int]]) -> int:
    if not edges:
        return 0

    n = len(edges) + 1
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    diameter = [0]

    def dfs(node, parent):
        # Returns longest path starting from this node going down
        max1 = max2 = 0  # Two longest paths to children

        for child in graph[node]:
            if child != parent:
                child_depth = dfs(child, node) + 1

                if child_depth > max1:
                    max2 = max1
                    max1 = child_depth
                elif child_depth > max2:
                    max2 = child_depth

        # Diameter through this node = max1 + max2
        diameter[0] = max(diameter[0], max1 + max2)

        return max1

    dfs(0, -1)
    return diameter[0]

# Test
print(treeDiameter([[0,1],[0,2],[0,3],[3,4],[4,5]]))  # 4`
            },
            hints: [
                { afterAttempt: 1, text: 'Diameter might pass through any node as the "highest point"' },
                { afterAttempt: 2, text: 'For each node, track two longest paths to children' },
                { afterAttempt: 3, text: 'Diameter through node = longest + second longest path down' },
            ],
            testCases: [
                { input: '[[0,1],[0,2],[0,3],[3,4],[4,5]]', expectedOutput: '4' }
            ],
            solutionExplanation: `## LeetCode 1245

**Key insight:** The diameter passes through some node as its "apex".

For each node:
- Find two longest paths going down to children
- Diameter through this node = sum of these paths
- Track global maximum

## Complexity
- **Time:** O(n)
- **Space:** O(n)`
        },

  // ============================================================
  // GROUP 9: GRID + GRAPH HYBRIDS
  // ============================================================
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-pacific-atlantic',
            title: 'Pacific Atlantic Water Flow',
            description: 'Find cells that can reach both oceans',
            targetComplexity: { time: 'O(m * n)', space: 'O(m * n)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Pacific Atlantic Water Flow

## The Problem

Given an m x n grid of heights, water can flow from a cell to neighboring cells with equal or lower height. The Pacific touches the left and top edges. The Atlantic touches the right and bottom edges.

Return all cells from which water can flow to both oceans.

**Example:**
\`\`\`
heights = [[1,2,2,3,5],
           [3,2,3,4,4],
           [2,4,5,3,1],
           [6,7,1,4,5],
           [5,1,1,2,4]]

Output: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
\`\`\`

## Key Insight

Instead of flowing down from each cell, **flow UP from oceans!**

DFS from ocean edges, moving to cells with >= height.

## Your Task

Two DFS sets (Pacific and Atlantic), find intersection.`,
            starterCode: `def pacificAtlantic(heights: list[list[int]]) -> list[list[int]]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def pacificAtlantic(heights: list[list[int]]) -> list[list[int]]:
    if not heights:
        return []

    m, n = len(heights), len(heights[0])
    pacific = set()
    atlantic = set()

    def dfs(r, c, visited, prev_height):
        if (r, c) in visited:
            return
        if r < 0 or r >= m or c < 0 or c >= n:
            return
        if heights[r][c] < prev_height:
            return

        visited.add((r, c))

        for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
            dfs(r + dr, c + dc, visited, heights[r][c])

    # DFS from Pacific (top and left edges)
    for c in range(n):
        dfs(0, c, pacific, 0)
    for r in range(m):
        dfs(r, 0, pacific, 0)

    # DFS from Atlantic (bottom and right edges)
    for c in range(n):
        dfs(m - 1, c, atlantic, 0)
    for r in range(m):
        dfs(r, n - 1, atlantic, 0)

    # Intersection
    return [[r, c] for r, c in pacific & atlantic]

# Test
heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
print(pacificAtlantic(heights))`
            },
            hints: [
                { afterAttempt: 1, text: 'Reverse the flow direction: DFS from ocean edges' },
                { afterAttempt: 2, text: 'Can only move to cells with >= height (flowing uphill)' },
                { afterAttempt: 3, text: 'Answer = cells in both Pacific set AND Atlantic set' },
            ],
            testCases: [
                { input: '[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]', expectedOutput: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]' }
            ],
            solutionExplanation: `## LeetCode 417

**Reverse thinking:** Instead of checking each cell → ocean, check ocean → cells.

Two DFS from ocean edges:
1. Pacific: top and left edges
2. Atlantic: bottom and right edges

Move to cells with >= height (water flows downhill, so going backwards = uphill).

## Complexity
- **Time:** O(m * n)
- **Space:** O(m * n)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-surrounded-regions',
            title: 'Surrounded Regions',
            description: "Capture O's that are completely surrounded by X's",
            targetComplexity: { time: 'O(m * n)', space: 'O(m * n)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Surrounded Regions

## The Problem

Given a grid containing 'X' and 'O', capture all regions of 'O' that are completely surrounded by 'X' by flipping them to 'X'.

A region is NOT captured if any 'O' in it is on the border.

**Example:**
\`\`\`
Input:
X X X X
X O O X
X X O X
X O X X

Output:
X X X X
X X X X
X X X X
X O X X
\`\`\`

## Key Insight

**Reverse thinking:** Mark O's connected to border as safe, then flip the rest.

## Your Task

DFS from border O's to mark them, then flip remaining O's.`,
            starterCode: `def solve(board: list[list[str]]) -> None:
    """Modify board in-place."""
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def solve(board: list[list[str]]) -> None:
    if not board or not board[0]:
        return

    m, n = len(board), len(board[0])

    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n:
            return
        if board[r][c] != 'O':
            return

        board[r][c] = 'S'  # Mark as safe

        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    # Mark all O's connected to border as safe
    for r in range(m):
        dfs(r, 0)
        dfs(r, n - 1)
    for c in range(n):
        dfs(0, c)
        dfs(m - 1, c)

    # Flip: O -> X (surrounded), S -> O (safe)
    for r in range(m):
        for c in range(n):
            if board[r][c] == 'O':
                board[r][c] = 'X'
            elif board[r][c] == 'S':
                board[r][c] = 'O'

# Test
board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]
solve(board)
print(board)`
            },
            hints: [
                { afterAttempt: 1, text: 'O\'s connected to border cannot be captured' },
                { afterAttempt: 2, text: 'DFS from border O\'s to mark them as safe' },
                { afterAttempt: 3, text: 'After marking, remaining O\'s are surrounded - flip them' },
            ],
            testCases: [
                { input: '[["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]', expectedOutput: '[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]' }
            ],
            solutionExplanation: `## LeetCode 130

**Three-pass approach:**
1. DFS from border to mark safe O's as 'S'
2. Flip remaining O's to X (they're surrounded)
3. Flip S's back to O (they're safe)

## Complexity
- **Time:** O(m * n)
- **Space:** O(m * n) for recursion`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-shortest-bridge',
            title: 'Shortest Bridge',
            description: 'Minimum flips to connect two islands',
            targetComplexity: { time: 'O(m * n)', space: 'O(m * n)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Shortest Bridge

## The Problem

Given a grid with exactly two islands (connected 1's), return the minimum number of 0's you need to flip to connect the two islands.

**Example:**
\`\`\`
[[0,1,0],
 [0,0,0],
 [0,0,1]]

Flip one 0 to connect: Answer = 1
\`\`\`

## Key Insight

1. DFS to find first island and mark all its cells
2. BFS from all cells of first island to reach second island

## Your Task

DFS to collect first island, then BFS to find shortest path to second.`,
            starterCode: `def shortestBridge(grid: list[list[int]]) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `from collections import deque

def shortestBridge(grid: list[list[int]]) -> int:
    m, n = len(grid), len(grid[0])

    # Find first island using DFS, mark as 2
    def dfs(r, c, queue):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != 1:
            return
        grid[r][c] = 2
        queue.append((r, c))
        dfs(r + 1, c, queue)
        dfs(r - 1, c, queue)
        dfs(r, c + 1, queue)
        dfs(r, c - 1, queue)

    # Find first 1 and DFS to mark entire first island
    queue = deque()
    found = False
    for r in range(m):
        if found:
            break
        for c in range(n):
            if grid[r][c] == 1:
                dfs(r, c, queue)
                found = True
                break

    # BFS from first island to find second
    steps = 0
    while queue:
        for _ in range(len(queue)):
            r, c = queue.popleft()

            for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
                nr, nc = r + dr, c + dc

                if 0 <= nr < m and 0 <= nc < n:
                    if grid[nr][nc] == 1:
                        return steps  # Found second island
                    if grid[nr][nc] == 0:
                        grid[nr][nc] = 2  # Mark as visited
                        queue.append((nr, nc))

        steps += 1

    return -1

# Test
print(shortestBridge([[0,1,0],[0,0,0],[0,0,1]]))  # 2`
            },
            hints: [
                { afterAttempt: 1, text: 'First find one island completely using DFS' },
                { afterAttempt: 2, text: 'Add all cells of first island to BFS queue' },
                { afterAttempt: 3, text: 'BFS until you hit a cell with value 1 (second island)' },
            ],
            testCases: [
                { input: '[[0,1,0],[0,0,0],[0,0,1]]', expectedOutput: '2' },
                { input: '[[0,1],[1,0]]', expectedOutput: '1' }
            ],
            solutionExplanation: `## LeetCode 934

Combines DFS + BFS:
1. DFS: Find and mark first island
2. BFS: Expand from first island until reaching second

**Key insight:** BFS expansion level = distance = number of flips.

## Complexity
- **Time:** O(m * n)
- **Space:** O(m * n)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-number-enclaves',
            title: 'Number of Enclaves',
            description: 'Count land cells that cannot reach the border',
            targetComplexity: { time: 'O(m * n)', space: 'O(m * n)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Number of Enclaves

## The Problem

Given a grid where 1 = land and 0 = water, an enclave is a land cell from which you cannot walk off the boundary.

Return the number of land cells in enclaves.

**Example:**
\`\`\`
[[0,0,0,0],
 [1,0,1,0],
 [0,1,1,0],
 [0,0,0,0]]

Output: 3 (the 1's in the middle that can't reach border)
\`\`\`

## Key Insight

Same as Surrounded Regions! Mark land connected to border, count remaining.

## Your Task

DFS from border 1's, count unmarked 1's.`,
            starterCode: `def numEnclaves(grid: list[list[int]]) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def numEnclaves(grid: list[list[int]]) -> int:
    m, n = len(grid), len(grid[0])

    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != 1:
            return
        grid[r][c] = 0  # Mark as visited
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    # Mark all land connected to border
    for r in range(m):
        dfs(r, 0)
        dfs(r, n - 1)
    for c in range(n):
        dfs(0, c)
        dfs(m - 1, c)

    # Count remaining land cells
    return sum(grid[r][c] for r in range(m) for c in range(n))

# Test
print(numEnclaves([[0,0,0,0],[1,0,1,0],[0,1,1,0],[0,0,0,0]]))  # 3`
            },
            hints: [
                { afterAttempt: 1, text: 'Same approach as Surrounded Regions' },
                { afterAttempt: 2, text: 'DFS from border to mark reachable land' },
                { afterAttempt: 3, text: 'Count remaining 1\'s' },
            ],
            testCases: [
                { input: '[[0,0,0,0],[1,0,1,0],[0,1,1,0],[0,0,0,0]]', expectedOutput: '3' }
            ],
            solutionExplanation: `## LeetCode 1020

Same pattern as Surrounded Regions:
1. DFS from border 1's to mark them as 0
2. Count remaining 1's

## Complexity
- **Time:** O(m * n)
- **Space:** O(m * n)`
        },

  // ============================================================
  // GROUP 10: ADVANCED BFS/DFS
  // ============================================================
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-word-ladder-ii',
            title: 'Word Ladder II',
            description: 'Return all shortest transformation sequences',
            targetComplexity: { time: 'O(n * k^2)', space: 'O(n * k)' },
            requiredForProgress: true,
            difficulty: 'hard',
            instruction: `# Word Ladder II

## The Problem

Given beginWord, endWord, and wordList, return ALL shortest transformation sequences from beginWord to endWord.

**Example:**
\`\`\`
beginWord = "hit", endWord = "cog"
wordList = ["hot","dot","dog","lot","log","cog"]

Output: [
  ["hit","hot","dot","dog","cog"],
  ["hit","hot","lot","log","cog"]
]
\`\`\`

## Key Insight

1. BFS to find shortest path length and build parent map
2. DFS to reconstruct all paths

## Your Task

BFS for distances, then backtrack to find all paths.`,
            starterCode: `def findLadders(beginWord: str, endWord: str, wordList: list[str]) -> list[list[str]]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `from collections import deque, defaultdict

def findLadders(beginWord: str, endWord: str, wordList: list[str]) -> list[list[str]]:
    wordSet = set(wordList)
    if endWord not in wordSet:
        return []

    # BFS to build graph of valid transitions
    layer = {beginWord}
    parents = defaultdict(set)
    found = False

    while layer and not found:
        wordSet -= layer  # Remove used words
        next_layer = set()

        for word in layer:
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    new_word = word[:i] + c + word[i+1:]

                    if new_word in wordSet:
                        if new_word == endWord:
                            found = True
                        next_layer.add(new_word)
                        parents[new_word].add(word)

        layer = next_layer

    # Backtrack to find all paths
    if not found:
        return []

    result = []

    def backtrack(word, path):
        if word == beginWord:
            result.append(path[::-1])
            return

        for parent in parents[word]:
            path.append(parent)
            backtrack(parent, path)
            path.pop()

    backtrack(endWord, [endWord])
    return result

# Test
print(findLadders("hit", "cog", ["hot","dot","dog","lot","log","cog"]))`
            },
            hints: [
                { afterAttempt: 1, text: 'BFS level by level, tracking all parents for each word' },
                { afterAttempt: 2, text: 'Stop BFS at the level where you find endWord' },
                { afterAttempt: 3, text: 'Backtrack from endWord using parent map to find all paths' },
            ],
            testCases: [
                { input: '"hit", "cog", ["hot","dot","dog","lot","log","cog"]', expectedOutput: '[["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]' }
            ],
            solutionExplanation: `## LeetCode 126

More complex than Word Ladder I:
1. BFS layer by layer, tracking ALL parents
2. Stop when endWord is found
3. Backtrack to reconstruct all shortest paths

**Key insight:** Need to track all possible parents, not just one.

## Complexity
- **Time:** O(n * k^2) where k = word length
- **Space:** O(n * k)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-evaluate-division',
            title: 'Evaluate Division',
            description: 'Evaluate equations using graph traversal',
            targetComplexity: { time: 'O(Q * (V + E))', space: 'O(V + E)' },
            requiredForProgress: true,
            difficulty: 'medium',
            instruction: `# Evaluate Division

## The Problem

Given equations like a/b = 2.0 and queries like a/c, compute the results.

**Example:**
\`\`\`
equations = [["a","b"],["b","c"]]
values = [2.0, 3.0]  (a/b = 2, b/c = 3)
queries = [["a","c"],["b","a"],["a","e"],["a","a"],["x","x"]]

Output: [6.0, 0.5, -1.0, 1.0, -1.0]

a/c = (a/b) * (b/c) = 2 * 3 = 6
b/a = 1 / (a/b) = 0.5
a/e = -1 (e not in graph)
\`\`\`

## Key Insight

Build a weighted directed graph:
- a/b = k → edge a→b with weight k, edge b→a with weight 1/k
- Query a/c → find path from a to c, multiply weights

## Your Task

Build graph, DFS to find paths and multiply weights.`,
            starterCode: `def calcEquation(equations: list[list[str]], values: list[float], queries: list[list[str]]) -> list[float]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `from collections import defaultdict

def calcEquation(equations: list[list[str]], values: list[float], queries: list[list[str]]) -> list[float]:
    # Build weighted graph
    graph = defaultdict(dict)
    for (a, b), val in zip(equations, values):
        graph[a][b] = val
        graph[b][a] = 1.0 / val

    def dfs(start, end, visited):
        if start not in graph or end not in graph:
            return -1.0

        if start == end:
            return 1.0

        visited.add(start)

        for neighbor, weight in graph[start].items():
            if neighbor not in visited:
                result = dfs(neighbor, end, visited)
                if result != -1.0:
                    return weight * result

        return -1.0

    return [dfs(a, b, set()) for a, b in queries]

# Test
equations = [["a","b"],["b","c"]]
values = [2.0, 3.0]
queries = [["a","c"],["b","a"],["a","e"],["a","a"],["x","x"]]
print(calcEquation(equations, values, queries))  # [6.0, 0.5, -1.0, 1.0, -1.0]`
            },
            hints: [
                { afterAttempt: 1, text: 'Build graph: a/b = k means edge a→b with weight k' },
                { afterAttempt: 2, text: 'Also add reverse edge: b→a with weight 1/k' },
                { afterAttempt: 3, text: 'Query = find path, multiply all edge weights' },
            ],
            testCases: [
                { input: 'equations, values, queries', expectedOutput: '[6.0, 0.5, -1.0, 1.0, -1.0]' }
            ],
            solutionExplanation: `## LeetCode 399

Graph interpretation:
- Nodes = variables
- Edge a→b with weight k means a/b = k
- Query a/c = product of weights on path a→c

## Complexity
- **Time:** O(Q * (V + E)) for Q queries
- **Space:** O(V + E)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-reconstruct-itinerary',
            title: 'Reconstruct Itinerary',
            description: 'Find Eulerian path with lexicographically smallest result',
            targetComplexity: { time: 'O(E log E)', space: 'O(E)' },
            requiredForProgress: true,
            difficulty: 'hard',
            instruction: `# Reconstruct Itinerary

## The Problem

Given a list of airline tickets [from, to], reconstruct the itinerary starting from "JFK". Use all tickets exactly once. Return the lexicographically smallest itinerary.

**Example:**
\`\`\`
tickets = [["MU","LHR"],["JFK","MU"],["SF","JFK"],["LHR","SF"]]
Output: ["JFK","MU","LHR","SF","JFK"]
\`\`\`

## Key Insight

This is an **Eulerian path** problem! Use Hierholzer's algorithm:
- Visit edges (not nodes)
- Use a min-heap or sorted list for lexicographic order
- Append to result in reverse (post-order)

## Your Task

DFS with edge deletion, post-order append.`,
            starterCode: `def findItinerary(tickets: list[list[str]]) -> list[str]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `from collections import defaultdict
import heapq

def findItinerary(tickets: list[list[str]]) -> list[str]:
    # Build graph with min-heap for lexicographic order
    graph = defaultdict(list)
    for src, dst in tickets:
        heapq.heappush(graph[src], dst)

    result = []

    def dfs(airport):
        while graph[airport]:
            next_airport = heapq.heappop(graph[airport])
            dfs(next_airport)
        result.append(airport)

    dfs("JFK")
    return result[::-1]

# Test
tickets = [["MU","LHR"],["JFK","MU"],["SF","JFK"],["LHR","SF"]]
print(findItinerary(tickets))  # ["JFK","MU","LHR","SF","JFK"]`
            },
            hints: [
                { afterAttempt: 1, text: 'Use Hierholzer\'s algorithm for Eulerian path' },
                { afterAttempt: 2, text: 'Use min-heap for destinations to get lexicographic order' },
                { afterAttempt: 3, text: 'Append to result AFTER all outgoing edges used (post-order)' },
            ],
            testCases: [
                { input: '[["MU","LHR"],["JFK","MU"],["SF","JFK"],["LHR","SF"]]', expectedOutput: '["JFK","MU","LHR","SF","JFK"]' }
            ],
            solutionExplanation: `## LeetCode 332

**Hierholzer's Algorithm:**
1. Start at source
2. Greedily take smallest edge (min-heap)
3. Recurse
4. Append to result in post-order
5. Reverse at end

**Why post-order?** Dead ends get appended first, so they end up at the end after reversal.

## Complexity
- **Time:** O(E log E) for heap operations
- **Space:** O(E)`
        }
];
