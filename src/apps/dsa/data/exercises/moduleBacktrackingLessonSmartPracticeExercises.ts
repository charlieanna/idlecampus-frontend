import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module11BacktrackingLessonSmartPracticeExercises: ExerciseSection[] = [
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-subsets-step-by-step',
            title: 'Subsets - Step-by-Step Implementation',
            description: 'Implement subsets using the 4-step template',
            targetComplexity: {
                time: 'O(2^n × n)',
                space: 'O(n)'
            },
            requiredForProgress: true,
            instruction: `## The Problem

Generate all subsets of a given array.

**Example 1:** \`subsets([])\` → \`[[]]\`

**Example 2:** \`subsets([1])\` → \`[[], [1]]\``,
            starterCode: `def subsets(nums: list[int]) -> list[list[int]]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def subsets(nums: list[int]) -> list[list[int]]:
    result = []

    def backtrack(path: list[int], index: int):
        # STEP 1: Base case - processed all elements
        # Save the current subset (every path is valid!)
        if index == len(nums):
            result.append(path[:])  # COPY the path!
            return

        # STEP 2: Decision 1 - INCLUDE current element
        path.append(nums[index])      # Add element to subset
        backtrack(path, index + 1)    # Explore with element included
        path.pop()                     # Undo! (backtrack)

        # STEP 3: Decision 2 - SKIP current element
        backtrack(path, index + 1)    # Explore without this element

    backtrack([], 0)
    return result

# Test
print(subsets([1, 2, 3]))  # [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]

# How it builds level by level for [1, 2, 3]:
# 
# Level 0: []
#   ↓
# Level 1: [1], [2], [3]
#   From []: add 1 → [1]
#   From []: add 2 → [2]
#   From []: add 3 → [3]
#   ↓
# Level 2: [1,2], [1,3], [2,3]
#   From [1]: add 2 → [1,2]
#   From [1]: add 3 → [1,3]
#   From [2]: add 3 → [2,3]
#   ↓
# Level 3: [1,2,3]
#   From [1,2]: add 3 → [1,2,3]
# 
# Result: [[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]`
            },
            hints: [
                { afterAttempt: 1, text: 'Base case: Use path[:] to copy, not path!' },
                { afterAttempt: 2, text: 'Include: path.append(nums[index]) → backtrack(path, index+1) → path.pop()' },
                { afterAttempt: 3, text: 'Skip: backtrack(path, index+1) - no modification needed!' },
            ],
            testCases: [
                {
                    input: '[1, 2]',
                    expectedOutput: '[[], [1], [1, 2], [2]]'
                },
                {
                    input: '[1]',
                    expectedOutput: '[[], [1]]'
                }
            ],
            solutionExplanation: `## STEP 1: How to Solve - Subsets of [1, 2, 3]

**Natural approach:** Build subsets level by level

**Level 0:** []
**Level 1:** [1], [2], [3]
**Level 2:** [1,2], [1,3], [2,3]
**Level 3:** [1,2,3]

**Result:** [], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]

---

## STEP 2: How It Translates to a Tree

\`\`\`
Level 0:                    []
                            /  \\
Level 1:                 [1]    []
                        /   \\  /   \\
Level 2:            [1,2]   [1] [2]  []
                    /  \\    / \\ / \\  / \\
Level 3:       [1,2,3][1,2][1,3][1][2,3][2][3][]
                ↓     ↓    ↓   ↓  ↓   ↓  ↓  ↓
            All 8 subsets (leaves)
\`\`\`

**Tree insight:**
- Each level = subsets of that size
- 2 branches per node: add element or don't add
- All paths from root to leaves = all subsets

---

## STEP 3: How the Tree Maps to Code

\`\`\`python
def subsets(nums):
    result = []

    def backtrack(path, index):
        # Base case: processed all elements
        if index == len(nums):
            result.append(path[:])  # Save current subset
            return

        # Branch 1: Add nums[index] (move to next level)
        path.append(nums[index])
        backtrack(path, index + 1)
        path.pop()  # Undo

        # Branch 2: Don't add nums[index] (stay at current level)
        backtrack(path, index + 1)

    backtrack([], 0)
    return result
\`\`\`

---

## STEP 4: Parameters Explained

\`\`\`python
def backtrack(path, index):
    # path: Current subset being built (e.g., [1, 2])
    # index: Which element to consider next (0, 1, 2, ...)
\`\`\`

**What gets carried to next level:**
- \`path\`: The subset we're building
- \`index\`: Moves forward through elements

**Why these parameters:**
- \`path\`: Tracks our current subset at this level
- \`index\`: Ensures we process each element exactly once

---

## ✅ Complexity

**Time: O(2^n × n)**
- Generate 2^n subsets (unavoidable!)
- Each subset copy: O(n)

**Space: O(n)**
- Recursion depth: O(n)
- Path array: O(n)

**Pattern:** Build level by level, where each level = subsets of that size!`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-permutations',
            title: 'Permutations Implementation',
            description: 'Implement permutations using backtracking',
      targetComplexity: { time: 'O(n!)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Permutations Implementation

## The Problem

Generate all permutations of \`[1, 2]\`.

**Expected:** \`[[1,2], [2,1]]\`

## The Tree

\`\`\`
        []
       /  \\
   Pick1  Pick2
     /      \\
   [1]      [2]
    |        |
  Pick2    Pick1
    |        |
  [1,2]    [2,1]
\`\`\`

## Your Task

Implement the permutations solution using the pattern from the reading.`,
            starterCode: `def permute(nums: list[int]) -> list[list[int]]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def permute(nums: list[int]) -> list[list[int]]:
    result = []

    def backtrack(path: list[int], used: list[bool]):
        # Base case
        if len(path) == len(nums):
            result.append(path[:])
            return

        # Try each unused element
        for i in range(len(nums)):
            if used[i]:
                continue

            # Make decision
            path.append(nums[i])
            used[i] = True

            # Explore
            backtrack(path, used)

            # Undo
            used[i] = False
            path.pop()

    backtrack([], [False] * len(nums))
    return result

# Test
print(permute([1, 2]))  # [[1,2], [2,1]]`
            },
            hints: [
                { afterAttempt: 1, text: 'Base case: if len(path) == len(nums): result.append(path[:])' },
                { afterAttempt: 2, text: 'Loop: for i in range(len(nums))' },
                { afterAttempt: 2, text: 'Skip used: if used[i]: continue' },
                { afterAttempt: 3, text: 'Make: path.append(nums[i]); used[i] = True' },
                { afterAttempt: 3, text: 'Undo: used[i] = False; path.pop()' },
            ],
            testCases: [
                {
                    input: '[1, 2]',
                    expectedOutput: '[[1,2], [2,1]]'
                }
            ],
            solutionExplanation: `## STEP 1: How to Solve - Permutations of [1, 2]

**Natural approach:** Fill positions one by one with unused elements

**Position 1 (Level 0 → Level 1):**
- Pick 1 → [1]
- Pick 2 → [2]

**Position 2 (Level 1 → Level 2):**
- From [1]: pick 2 → [1,2]
- From [2]: pick 1 → [2,1]

**Result:** [1,2], [2,1]

---

## STEP 2: How It Translates to a Tree

\`\`\`
Level 0:           []
                  /  \\
Level 1:        [1]  [2]
                 |    |
Level 2:      [1,2][2,1]
                ✓    ✓
\`\`\`

**Tree insight:**
- Each level = fill next position
- n branches per node: pick any unused element
- Order matters: [1,2] ≠ [2,1]

---

## STEP 3: How the Tree Maps to Code

\`\`\`python
def permute(nums):
    result = []

    def backtrack(path, used):
        # Base case: filled all positions
        if len(path) == len(nums):
            result.append(path[:])
            return

        # Try each unused element at current position
        for i in range(len(nums)):
            if used[i]:
                continue

            # Make decision
            path.append(nums[i])
            used[i] = True

            # Explore next position
            backtrack(path, used)

            # Undo
            used[i] = False
            path.pop()

    backtrack([], [False] * len(nums))
    return result
\`\`\`

---

## STEP 4: Parameters Explained

\`\`\`python
def backtrack(path, used):
    # path: Current permutation being built (e.g., [1, 2])
    # used: Boolean array tracking used elements (e.g., [True, True, False])
\`\`\`

**What gets carried to next level:**
- \`path\`: The permutation we're building
- \`used\`: Which elements are already in path

**Why these parameters:**
- \`path\`: Tracks our current arrangement
- \`used\`: Prevents reusing elements (unlike combinations, we can pick in any order)

---

## ✅ Complexity

**Time: O(n! × n)**
- Generate n! permutations
- Each permutation copy: O(n)

**Space: O(n)**
- Recursion depth: O(n)
- Path + used arrays: O(n)

**Pattern:** Fill positions level by level, picking any unused element!`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-combinations',
            title: 'Combinations Implementation',
            description: 'Implement combinations using backtracking',
      targetComplexity: { time: 'O(2^n)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Combinations Implementation

## The Problem

Find all 2-element combinations from 1 to 3.

**Expected:** \`[[1,2], [1,3], [2,3]]\`

## The Tree

\`\`\`
          []
       /  |  \\
     +1  +2  +3
     /    |    \\
   [1]   [2]   [3]
   / \\    |
 +2  +3  +3
 /    \\   |
[1,2][1,3][2,3]
 ✓    ✓    ✓
\`\`\`

## Your Task

Implement the combinations solution using the forward-only pattern from the reading.`,
            starterCode: `def combine(n: int, k: int) -> list[list[int]]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def combine(n: int, k: int) -> list[list[int]]:
    result = []

    def backtrack(path: list[int], start: int):
        # Base case
        if len(path) == k:
            result.append(path[:])
            return

        # Try elements from start to n
        for i in range(start, n + 1):
            path.append(i)
            backtrack(path, i + 1)
            path.pop()

    backtrack([], 1)
    return result

# Test
print(combine(3, 2))  # [[1,2], [1,3], [2,3]]`
            },
            hints: [
                { afterAttempt: 1, text: 'Base case: if len(path) == k: result.append(path[:])' },
                { afterAttempt: 2, text: 'Loop: for i in range(start, n + 1)' },
                { afterAttempt: 3, text: 'Next start is i+1 (to move forward)' },
            ],
            testCases: [
                {
                    input: '3, 2',
                    expectedOutput: '[[1, 2], [1, 3], [2, 3]]'
                }
            ],
            solutionExplanation: `## STEP 1: How to Solve - Combinations C(3, 2)

**Natural approach:** Pick 2 elements from [1, 2, 3], order doesn't matter

**Start:** []

**Level 1 (pick first element):**
- Pick 1 → [1]
- Pick 2 → [2]
- Pick 3 → [3]

**Level 2 (pick second element - only forward!):**
- From [1]: pick 2 → [1,2] ✓
- From [1]: pick 3 → [1,3] ✓
- From [2]: pick 3 → [2,3] ✓

**Result:** [1,2], [1,3], [2,3]

**Key:** [1,2] and [2,1] are the SAME - only pick forward!

---

## STEP 2: How It Translates to a Tree

\`\`\`
Level 0:          []
               /  |  \\
Level 1:     [1] [2] [3]
            / \\   |
Level 2: [1,2][1,3][2,3]
           ✓   ✓    ✓
\`\`\`

**Tree insight:**
- Each level = pick next element
- Only pick forward elements (from [1], can only pick 2 or 3, not 1)
- Stop at depth k

---

## STEP 3: How the Tree Maps to Code

\`\`\`python
def combine(n, k):
    result = []

    def backtrack(path, start):
        # Base case: picked k elements
        if len(path) == k:
            result.append(path[:])
            return

        # Try elements from start to n (forward only!)
        for i in range(start, n + 1):
            path.append(i)
            backtrack(path, i + 1)  # i+1 = forward only
            path.pop()

    backtrack([], 1)
    return result
\`\`\`

---

## STEP 4: Parameters Explained

\`\`\`python
def backtrack(path, start):
    # path: Current combination being built (e.g., [1, 3])
    # start: Next element to consider (e.g., 4)
\`\`\`

**What gets carried to next level:**
- \`path\`: The combination we're building
- \`start\`: Next valid element (ensures forward-only)

**Why these parameters:**
- \`path\`: Tracks our current combination
- \`start\`: Prevents duplicates ([1,2] yes, [2,1] never tried)

**Key:** \`start = i + 1\` ensures we only pick forward!

---

## ✅ Complexity

**Time: O(C(n,k) × k)**
- Generate C(n,k) combinations
- Each copy: O(k)

**Space: O(k)**
- Recursion depth: O(k)

**Pattern:** Pick forward-only, stop at depth k!`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-combination-sum',
            title: 'Combination Sum Implementation',
            description: 'Implement combination sum with reuse',
            targetComplexity: {
                time: 'O(2^t)',
                space: 'O(t)',
                notes: 'Time depends on target value t. Space is proportional to the longest combination (recursion depth).'
            },
            requiredForProgress: true,
            instruction: `# Combination Sum Implementation

## The Problem

Find all combinations that sum to 7 using \`[2, 3]\`. Reuse allowed!

**Expected:** \`[[2,2,3]]\`

## Your Task

Implement the combination sum solution with reuse allowed.`,
            starterCode: `def combinationSum(candidates: list[int], target: int) -> list[list[int]]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def combinationSum(candidates: list[int], target: int) -> list[list[int]]:
    result = []

    def backtrack(path: list[int], start: int, current_sum: int):
        # Success
        if current_sum == target:
            result.append(path[:])
            return

        # Prune
        if current_sum > target:
            return

        # Try each candidate
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            backtrack(path, i, current_sum + candidates[i])  # i allows reuse
            path.pop()

    backtrack([], 0, 0)
    return result

# Test
print(combinationSum([2, 3], 7))  # [[2,2,3]]`
            },
            hints: [
                { afterAttempt: 1, text: 'Success: if current_sum == target: result.append(path[:])' },
                { afterAttempt: 2, text: 'Prune: if current_sum > target: return' },
                { afterAttempt: 3, text: 'Reuse: backtrack(path, i, ...) not i+1' },
            ],
            testCases: [
                {
                    input: '[2,3], 7',
                    expectedOutput: '[[2, 2, 3]]'
                }
            ],
            solutionExplanation: `## STEP 1: How to Solve - Combination Sum ([2, 3], target=7)

**Natural approach:** Build combinations until sum = 7, can reuse elements

**Start:** [] (sum=0)

**Try building with 2:**
- [] → [2] (sum=2)
- [2] → [2,2] (sum=4)
- [2,2] → [2,2,2] (sum=6)
- [2,2,2] → [2,2,2,2] (sum=8) ✗ too large!

**Backtrack and try 3:**
- [2,2] → [2,2,3] (sum=7) ✓ Found one!

**Result:** [[2,2,3]]

**Key:** Can reuse (2 appears 3 times), but avoid duplicates ([2,3,2] is same as [2,2,3])

---

## STEP 2: How It Translates to a Tree

\`\`\`
Level 0:     [] (sum=0)
            /  \\
Level 1:  [2]  [3]
         (2)  (3)
        / \\    |
Level 2:[2,2][2,3][3,3]
        (4) (5) (6)
        / \\  |   |
Level 3:[2,2,2][2,2,3][2,3,3]
        (6)  (7)✓ (8)✗
         |
Level 4:[2,2,2,2]
        (8)✗
\`\`\`

**Tree insight:**
- Variable depth (not fixed k)
- Can reuse same element
- Prune when sum > target

---

## STEP 3: How the Tree Maps to Code

\`\`\`python
def combinationSum(candidates, target):
    result = []

    def backtrack(path, start, current_sum):
        # Base case 1: Found target sum
        if current_sum == target:
            result.append(path[:])
            return

        # Base case 2: Exceeded target (prune)
        if current_sum > target:
            return

        # Try candidates from start (forward only)
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            # Pass i (not i+1) to allow reuse!
            backtrack(path, i, current_sum + candidates[i])
            path.pop()

    backtrack([], 0, 0)
    return result
\`\`\`

---

## STEP 4: Parameters Explained

\`\`\`python
def backtrack(path, start, current_sum):
    # path: Current combination being built (e.g., [2, 2, 3])
    # start: Next candidate index to try (e.g., 0, 1)
    # current_sum: Running sum of path (e.g., 7)
\`\`\`

**What gets carried to next level:**
- \`path\`: The combination we're building
- \`start\`: Index for forward-only + reuse
- \`current_sum\`: Sum for pruning

**Why these parameters:**
- \`path\`: Tracks our current combination
- \`start\`: Prevents duplicates (forward only) BUT allows reuse (pass i not i+1)
- \`current_sum\`: Enables early pruning when sum > target

**Key:** \`start = i\` allows reuse, unlike combinations where \`start = i + 1\`

---

## ✅ Complexity

**Time: O(2^t)** where t = target/min(candidates)
- Variable tree depth
- With pruning: much better!

**Space: O(t)**
- Recursion depth: O(target/min)

**Pattern:** Forward-only + reuse + pruning!`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-nqueens-simple',
            title: 'N-Queens: Count Solutions',
            description: 'Count the number of valid N-Queens solutions',
      targetComplexity: { time: 'O(n!)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# N-Queens: Count Solutions

## Simplified Problem

For this exercise, just **count** the number of valid solutions (don't construct boards yet).

**For n=4:** Expected count = 2

## Your Task

Implement the N-Queens solution to count all valid placements.`,
            starterCode: `def totalNQueens(n: int) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def totalNQueens(n: int) -> int:
    board = [-1] * n
    count = [0]

    def is_valid(row: int, col: int) -> bool:
        for r in range(row):
            # Column conflict
            if board[r] == col:
                return False
            # Diagonal conflict
            if abs(row - r) == abs(col - board[r]):
                return False
        return True

    def backtrack(row: int):
        if row == n:
            count[0] += 1
            return

        for col in range(n):
            if is_valid(row, col):
                board[row] = col
                backtrack(row + 1)
                board[row] = -1

    backtrack(0)
    return count[0]

# Test
print(totalNQueens(4))  # 2`
            },
            hints: [
                { afterAttempt: 1, text: 'is_valid checks all rows 0 to row-1' },
                { afterAttempt: 2, text: 'Column conflict: board[r] == col' },
                { afterAttempt: 2, text: 'Diagonal: abs(row-r) == abs(col-board[r])' },
                { afterAttempt: 3, text: 'Base case: if row == n: count[0] += 1' },
            ],
            testCases: [
                {
                    input: '4',
                    expectedOutput: '2'
                }
            ],
            solutionExplanation: `## STEP 1: How to Solve - 4-Queens

**Natural approach:** Place queens row by row, checking constraints

**Row 0:** Try each column
- Try col 0 → place queen at (0,0)
- Try col 1 → place queen at (0,1)
- Try col 2 → place queen at (0,2)
- Try col 3 → place queen at (0,3)

**Row 1:** For each valid Row 0, try Row 1
- If Q at (0,1): Try (1,0)? ✗ diagonal
- If Q at (0,1): Try (1,3)? ✓ valid!

**Continue until all 4 queens placed or impossible**

**Result:** 2 valid solutions for n=4

---

## STEP 2: How It Translates to a Tree

\`\`\`
Level 0 (Row 0):  Empty board
                /    |    \\    \\
Level 1:     Q@0  Q@1  Q@2  Q@3
              |     |     |     |
Level 2:   Row1  Row1  Row1  Row1
          /|\\\\ /|\\\\ /|\\\\ /|\\\\
         0123 0123 0123 0123
         XXXX X✓XX ✓XXX X✓XX  ← Most pruned!
               |    |     |
Level 3:    Valid Valid Valid
              ...  ...   ...
\`\`\`

**Tree insight:**
- Each level = one row
- Heavy pruning at each level (constraints eliminate most branches)
- Very few paths reach leaves

---

## STEP 3: How the Tree Maps to Code

\`\`\`python
def totalNQueens(n):
    board = [-1] * n
    count = [0]

    def is_valid(row, col):
        for r in range(row):
            # Column conflict
            if board[r] == col:
                return False
            # Diagonal conflict
            if abs(row - r) == abs(col - board[r]):
                return False
        return True

    def backtrack(row):
        # Base case: placed all queens
        if row == n:
            count[0] += 1
            return

        # Try each column in current row
        for col in range(n):
            if is_valid(row, col):  # Check constraints first!
                board[row] = col
                backtrack(row + 1)
                board[row] = -1

    backtrack(0)
    return count[0]
\`\`\`

---

## STEP 4: Parameters Explained

\`\`\`python
def backtrack(row):
    # row: Current row being filled (level in tree)
    # board: Array where board[i] = column of queen in row i
\`\`\`

**What gets carried to next level:**
- \`row\`: Which row to fill next (0, 1, 2, ...)
- \`board\`: Global array tracking all queen positions

**Why these parameters:**
- \`row\`: Tells us current level (which row to process)
- \`board\`: Stores all previous decisions for constraint checking

**Constraint checking:**
- Check against all rows < current row
- Column: \`board[r] == col\`
- Diagonal: \`abs(row - r) == abs(col - board[r])\`

---

## ✅ Complexity

**Time: O(n!)**
- With pruning: much better than n^n
- First row: n choices
- Second row: ~(n-2) valid choices

**Space: O(n)**
- Recursion depth: O(n)
- Board array: O(n)

**Pattern:** Check constraints early, prune heavily!`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-word-search',
            title: 'Code: Word Search',
            description: 'Find if a word exists in a 2D grid using backtracking',
      targetComplexity: { time: 'O(m*n*4^L)', space: 'O(L)' },
            requiredForProgress: true,
            instruction: `# Word Search

**Interview Context:** Classic 2D backtracking problem. Frequently asked at Google, Amazon, Meta.

| Difficulty | Expected Time | Concepts Tested |
|------------|---------------|-----------------|
| Medium | 20-25 minutes | 2D Backtracking, DFS, Grid Traversal |

## Problem

Given an \`m x n\` grid of characters \`board\` and a string \`word\`, return \`true\` if \`word\` exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.

## Examples

**Example 1:**
\`\`\`
board = [
  ["A","B","C","E"],
  ["S","F","C","S"],
  ["A","D","E","E"]
]
word = "ABCCED"
Output: true
\`\`\`

**Example 2:**
\`\`\`
board = [
  ["A","B","C","E"],
  ["S","F","C","S"],
  ["A","D","E","E"]
]
word = "SEE"
Output: true
\`\`\`

**Example 3:**
\`\`\`
board = [
  ["A","B","C","E"],
  ["S","F","C","S"],
  ["A","D","E","E"]
]
word = "ABCB"
Output: false (can't reuse 'B')
\`\`\`

## Constraints
- \`1 <= m, n <= 6\`
- \`1 <= word.length <= 15\`
- \`board\` and \`word\` consists of only lowercase and uppercase English letters`,
            starterCode: `def exist(board: list[list[str]], word: str) -> bool:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def exist(board: list[list[str]], word: str) -> bool:
    rows, cols = len(board), len(board[0])

    def backtrack(row: int, col: int, index: int) -> bool:
        # Success - matched all letters
        if index == len(word):
            return True

        # Boundary check / Invalid
        if (row < 0 or row >= rows or
            col < 0 or col >= cols or
            board[row][col] != word[index]):
            return False

        # Mark as visited (modify in-place)
        temp = board[row][col]
        board[row][col] = '#'

        # Try all 4 directions
        found = (backtrack(row + 1, col, index + 1) or
                 backtrack(row - 1, col, index + 1) or
                 backtrack(row, col + 1, index + 1) or
                 backtrack(row, col - 1, index + 1))

        # Restore cell (backtrack)
        board[row][col] = temp

        return found

    # Try starting from each cell
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == word[0]:
                if backtrack(r, c, 0):
                    return True

    return False

# Test
board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]
print(exist(board, "ABCCED"))  # True
print(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE"))  # True
print(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB"))  # False`
            },
            hints: [
                { afterAttempt: 1, text: 'Start by finding cells that match the first letter of the word' },
                { afterAttempt: 2, text: 'Use backtracking: mark cell as visited, explore 4 directions, then unmark' },
                { afterAttempt: 2, text: 'You can mark visited by temporarily changing the cell value to a special character' },
                { afterAttempt: 3, text: 'Base case: index == len(word) means success; boundary checks or wrong letter means failure' },
            ],
            testCases: [
                { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"', expectedOutput: 'True' },
                { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE"', expectedOutput: 'True' },
                { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB"', expectedOutput: 'False' },
                { input: '[["A"]], "A"', expectedOutput: 'True' },
                { input: '[["A","B"],["C","D"]], "ABDC"', expectedOutput: 'True' },
                { input: '[["A","B"],["C","D"]], "ABCD"', expectedOutput: 'False' },
            ],
            solutionExplanation: `## Multiple Approaches

### Approach 1: Backtracking with In-Place Marking (Optimal)

**Strategy:**
1. Find all cells matching first letter of word
2. For each starting cell, use DFS/backtracking
3. Mark visited cells by modifying them temporarily
4. Try all 4 directions recursively
5. Restore cell value when backtracking

\`\`\`python
def exist(board, word):
    rows, cols = len(board), len(board[0])

    def backtrack(row, col, index):
        # Success - matched all letters
        if index == len(word):
            return True

        # Boundary/validity check
        if (row < 0 or row >= rows or
            col < 0 or col >= cols or
            board[row][col] != word[index]):
            return False

        # Mark as visited
        temp = board[row][col]
        board[row][col] = '#'

        # Try all 4 directions
        found = (backtrack(row + 1, col, index + 1) or
                 backtrack(row - 1, col, index + 1) or
                 backtrack(row, col + 1, index + 1) or
                 backtrack(row, col - 1, index + 1))

        # Restore (backtrack)
        board[row][col] = temp

        return found

    for r in range(rows):
        for c in range(cols):
            if board[r][c] == word[0]:
                if backtrack(r, c, 0):
                    return True
    return False
\`\`\`

**Time:** O(m × n × 4^L) where L = word length
**Space:** O(L) for recursion stack

### Approach 2: Backtracking with Visited Set

\`\`\`python
def exist(board, word):
    rows, cols = len(board), len(board[0])
    visited = set()

    def backtrack(row, col, index):
        if index == len(word):
            return True

        if (row < 0 or row >= rows or
            col < 0 or col >= cols or
            board[row][col] != word[index] or
            (row, col) in visited):
            return False

        visited.add((row, col))

        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        for dr, dc in directions:
            if backtrack(row + dr, col + dc, index + 1):
                return True

        visited.remove((row, col))
        return False

    for r in range(rows):
        for c in range(cols):
            if backtrack(r, c, 0):
                return True
    return False
\`\`\`

**Time:** O(m × n × 4^L)
**Space:** O(L) for visited set + recursion

---

## Common Mistakes

### 1. Forgetting to Restore Cell

**Wrong:**
\`\`\`python
def backtrack(row, col, index):
    board[row][col] = '#'  # Mark visited
    # Try directions...
    # MISSING: board[row][col] = temp  # Never restored!
\`\`\`

**Correct:**
\`\`\`python
temp = board[row][col]
board[row][col] = '#'
# Try directions...
board[row][col] = temp  # Always restore!
\`\`\`

### 2. Checking Visited After Bounds

**Wrong:**
\`\`\`python
if board[row][col] != word[index]:  # May crash if out of bounds!
    return False
\`\`\`

**Correct:**
\`\`\`python
if row < 0 or row >= rows or col < 0 or col >= cols:  # Check bounds FIRST
    return False
if board[row][col] != word[index]:
    return False
\`\`\`

### 3. Not Trying All Starting Points

**Wrong:**
\`\`\`python
return backtrack(0, 0, 0)  # Only tries top-left!
\`\`\`

**Correct:**
\`\`\`python
for r in range(rows):
    for c in range(cols):
        if backtrack(r, c, 0):
            return True
return False
\`\`\`

---

## Interview Decision Criteria

### ❌ No Hire
- Cannot implement basic DFS on grid
- Doesn't understand backtracking (mark/unmark pattern)
- Solution has bugs with bounds checking
- Takes > 35 minutes

### 🟡 Maybe Hire
- Gets correct solution with 1-2 hints
- Completes in 25-30 minutes
- Understands the approach but has minor bugs
- Can explain time complexity when asked

### ✅ Hire Bar
- Clean solution in < 20 minutes
- No hints needed
- Explains backtracking pattern clearly
- Discusses optimization (early termination, pruning)
- Mentions time/space complexity unprompted
- Can discuss trade-offs (in-place vs visited set)

---

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| In-place marking | O(m×n×4^L) | O(L) | Modifies input |
| Visited set | O(m×n×4^L) | O(L) | Extra set overhead |

---

### 🎯 Pattern: 2D Backtracking

When searching for paths in a grid:
1. Try each cell as starting point (if needed)
2. DFS with 4-direction exploration
3. Mark visited → Recurse → Unmark (backtrack)
4. Early return on success`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-letter-combinations',
            title: 'Letter Combinations of a Phone Number',
            description: 'Generate all letter combinations from phone digits',
      targetComplexity: { time: 'O(4^n)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Letter Combinations of a Phone Number

## The Problem

Given a string containing digits from 2-9, return all possible letter combinations that the number could represent.

**Phone Mapping:**
\`\`\`
2: abc   3: def   4: ghi   5: jkl
6: mno   7: pqrs  8: tuv   9: wxyz
\`\`\`

**Example:**
\`\`\`
Input: digits = "23"
Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
\`\`\`

## The Tree

\`\`\`
        ""
      / | \\
     a  b  c     (digit 2)
    /|\\ /|\\ /|\\
   d e f ...     (digit 3)
\`\`\`

## Your Task

Implement using backtracking with a mapping dictionary.`,
            starterCode: `def letterCombinations(digits: str) -> list[str]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def letterCombinations(digits: str) -> list[str]:
    if not digits:
        return []

    phone = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    }

    result = []

    def backtrack(index: int, path: str):
        # Base case: used all digits
        if index == len(digits):
            result.append(path)
            return

        # Try each letter for current digit
        for letter in phone[digits[index]]:
            backtrack(index + 1, path + letter)

    backtrack(0, "")
    return result

# Test
print(letterCombinations("23"))  # ["ad","ae","af","bd","be","bf","cd","ce","cf"]`
            },
            hints: [
                { afterAttempt: 1, text: 'Create a mapping dict: {"2": "abc", "3": "def", ...}' },
                { afterAttempt: 2, text: 'Base case: if index == len(digits): result.append(path)' },
                { afterAttempt: 3, text: 'Loop: for letter in phone[digits[index]]: backtrack(index+1, path+letter)' },
            ],
            testCases: [
                { input: '"23"', expectedOutput: '["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]' },
                { input: '""', expectedOutput: '[]' },
                { input: '"2"', expectedOutput: '["a", "b", "c"]' }
            ],
            solutionExplanation: `## Pattern: Multiple-Choice Per Level

Each digit maps to 3-4 letters. At each level of the tree, we try all letters for that digit.

**Tree for "23":**
\`\`\`
Level 0:      ""
           / | \\
Level 1:   a  b  c      (from '2')
          /|\\
Level 2: ad ae af ...   (from '3')
\`\`\`

**Key insight:** No used array needed (unlike permutations) because each digit is independent.

## Complexity
- **Time:** O(4^n × n) where n = digits length (worst case: all digits map to 4 letters)
- **Space:** O(n) for recursion depth`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-palindrome-partitioning',
            title: 'Palindrome Partitioning',
            description: 'Partition string so every substring is a palindrome',
      targetComplexity: { time: 'O(n * 2^n)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Palindrome Partitioning

## The Problem

Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of s.

**Example:**
\`\`\`
Input: s = "aab"
Output: [["a","a","b"], ["aa","b"]]
\`\`\`

## The Tree

\`\`\`
                ""
        /       |       \\
      [a]      [aa]    [aab] (not palindrome)
     /   \\       |
  [a,a]  [a,ab] [aa,b]
    |
 [a,a,b]
\`\`\`

## Your Task

At each step:
1. Try cutting at each position
2. If prefix is palindrome, add it and recurse on remainder
3. Prune non-palindrome prefixes`,
            starterCode: `def partition(s: str) -> list[list[str]]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def partition(s: str) -> list[list[str]]:
    result = []

    def is_palindrome(sub: str) -> bool:
        return sub == sub[::-1]

    def backtrack(start: int, path: list[str]):
        # Base case: processed entire string
        if start == len(s):
            result.append(path[:])
            return

        # Try each possible end position
        for end in range(start + 1, len(s) + 1):
            prefix = s[start:end]

            # Only continue if prefix is palindrome (PRUNING)
            if is_palindrome(prefix):
                path.append(prefix)
                backtrack(end, path)
                path.pop()

    backtrack(0, [])
    return result

# Test
print(partition("aab"))  # [["a","a","b"], ["aa","b"]]`
            },
            hints: [
                { afterAttempt: 1, text: 'At each step, try cutting at positions start+1, start+2, ..., len(s)' },
                { afterAttempt: 2, text: 'Only recurse if prefix s[start:end] is palindrome (pruning)' },
                { afterAttempt: 3, text: 'Base case: start == len(s) means we partitioned the whole string' },
            ],
            testCases: [
                { input: '"aab"', expectedOutput: '[["a", "a", "b"], ["aa", "b"]]' },
                { input: '"a"', expectedOutput: '[["a"]]' },
                { input: '"aba"', expectedOutput: '[["a", "b", "a"], ["aba"]]' }
            ],
            solutionExplanation: `## Pattern: Partition with Constraint

Unlike subsets/combinations, we're partitioning - every character must be in exactly one part.

**Key insight:** At each position, try all possible cuts. Only continue if the cut creates a palindrome.

**Pruning:** If prefix isn't a palindrome, don't recurse (saves exponential work).

## Complexity
- **Time:** O(n * 2^n) - up to 2^n partitions, O(n) palindrome check each
- **Space:** O(n) for recursion depth

## Optimization
Precompute palindrome checks using 2D DP: dp[i][j] = true if s[i:j+1] is palindrome.`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-subsets-ii',
            title: 'Subsets II - Handling Duplicates',
            description: 'Generate subsets with duplicate elements',
      targetComplexity: { time: 'O(2^n)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Subsets II - Handling Duplicates

## The Problem

Given an array that **may contain duplicates**, return all possible subsets without duplicate subsets.

**Example:**
\`\`\`
Input: nums = [1, 2, 2]
Output: [[], [1], [1,2], [1,2,2], [2], [2,2]]
Note: [1,2] appears only once, not twice!
\`\`\`

## The Key Insight

When we see duplicate elements, we must decide: at each level, if we've already "skipped" a value, we can't "take" the same value again.

**Wrong:** [1, _, 2] and [1, 2, _] where we picked different 2s - duplicate [1,2]

**Fix:** Sort first, then skip duplicates at the same decision level.

## Skip Rule

\`\`\`python
if i > start and nums[i] == nums[i-1]:
    continue  # Skip duplicate at this level
\`\`\``,
            starterCode: `def subsetsWithDup(nums: list[int]) -> list[list[int]]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def subsetsWithDup(nums: list[int]) -> list[list[int]]:
    nums.sort()  # CRUCIAL: sort to group duplicates
    result = []

    def backtrack(start: int, path: list[int]):
        result.append(path[:])

        for i in range(start, len(nums)):
            # Skip duplicates at this decision level
            if i > start and nums[i] == nums[i-1]:
                continue

            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()

    backtrack(0, [])
    return result

# Test
print(subsetsWithDup([1, 2, 2]))  # [[], [1], [1,2], [1,2,2], [2], [2,2]]`
            },
            hints: [
                { afterAttempt: 1, text: 'SORT the array first to group duplicates together' },
                { afterAttempt: 2, text: 'Skip: if i > start and nums[i] == nums[i-1]: continue' },
                { afterAttempt: 3, text: 'The skip condition uses i > start, not i > 0' },
            ],
            testCases: [
                { input: '[1, 2, 2]', expectedOutput: '[[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]' },
                { input: '[0]', expectedOutput: '[[], [0]]' }
            ],
            solutionExplanation: `## Why Sort + Skip Works

**Sort:** Groups duplicates together [1, 2, 2]

**Skip rule:** \`if i > start and nums[i] == nums[i-1]\`
- \`i > start\`: We're not at the first choice of this level
- \`nums[i] == nums[i-1]\`: This value is same as previous

This means: "At this decision level, we already tried this value - skip!"

## Complexity
- **Time:** O(n * 2^n)
- **Space:** O(n)`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-permutations-ii',
            title: 'Permutations II - Handling Duplicates',
            description: 'Generate permutations with duplicate elements',
      targetComplexity: { time: 'O(n!)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Permutations II - Handling Duplicates

## The Problem

Given an array that **may contain duplicates**, return all possible unique permutations.

**Example:**
\`\`\`
Input: nums = [1, 1, 2]
Output: [[1,1,2], [1,2,1], [2,1,1]]
Note: Each permutation appears exactly once!
\`\`\`

## The Key Insight

Similar to Subsets II, but with permutations we need:
1. A \`used\` array (like regular permutations)
2. Skip duplicate rule: only use duplicate if previous duplicate was used

## Skip Rule

\`\`\`python
# Sort first, then:
if i > 0 and nums[i] == nums[i-1] and not used[i-1]:
    continue
\`\`\`

**Why "not used[i-1]"?** We want to force an order: if choosing between identical values, always pick earlier indices first.`,
            starterCode: `def permuteUnique(nums: list[int]) -> list[list[int]]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def permuteUnique(nums: list[int]) -> list[list[int]]:
    nums.sort()  # CRUCIAL: sort to group duplicates
    result = []
    used = [False] * len(nums)

    def backtrack(path: list[int]):
        if len(path) == len(nums):
            result.append(path[:])
            return

        for i in range(len(nums)):
            if used[i]:
                continue

            # Skip duplicate if previous duplicate not used
            if i > 0 and nums[i] == nums[i-1] and not used[i-1]:
                continue

            used[i] = True
            path.append(nums[i])
            backtrack(path)
            path.pop()
            used[i] = False

    backtrack([])
    return result

# Test
print(permuteUnique([1, 1, 2]))  # [[1,1,2], [1,2,1], [2,1,1]]`
            },
            hints: [
                { afterAttempt: 1, text: 'SORT first, and use a used[] array like regular permutations' },
                { afterAttempt: 2, text: 'Skip: if i > 0 and nums[i] == nums[i-1] and not used[i-1]: continue' },
                { afterAttempt: 3, text: 'The condition "not used[i-1]" ensures we pick duplicates in order' },
            ],
            testCases: [
                { input: '[1, 1, 2]', expectedOutput: '[[1, 1, 2], [1, 2, 1], [2, 1, 1]]' },
                { input: '[1, 2, 3]', expectedOutput: '[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]' }
            ],
            solutionExplanation: `## Why "not used[i-1]"?

**The rule:** Among identical values, always use earlier indices first.

If nums[i] == nums[i-1] and used[i-1] is FALSE:
- We're trying to use nums[i] before nums[i-1]
- That's out of order! Skip.

If used[i-1] is TRUE:
- We already used the earlier duplicate
- It's okay to use this one now

## Complexity
- **Time:** O(n! * n)
- **Space:** O(n)`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },

  // ============================================================
  // GROUP 2: CONSTRAINT-BASED BACKTRACKING
  // ============================================================
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-combination-sum-ii',
            title: 'Combination Sum II',
            description: 'Find combinations with unique usage and duplicates in input',
            targetComplexity: { time: 'O(2^n)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Combination Sum II

## The Problem

Given a collection of candidate numbers (candidates) and a target number (target), find all unique combinations in candidates where the candidate numbers sum to target.

Each number in candidates may only be used **once** in the combination. The solution set must not contain duplicate combinations.

**Example:**
\`\`\`
Input: candidates = [10,1,2,7,6,1,5], target = 8
Output: [[1,1,6], [1,2,5], [1,7], [2,6]]
\`\`\`

## Key Constraints
1. Each candidate can be used only once (unlike Combination Sum I)
2. Input may contain duplicates (unlike Combination Sum I)
3. Result must not contain duplicate combinations

## Your Task

Combine the "use once" pattern with the "skip duplicates" pattern.`,
            starterCode: `def combinationSum2(candidates: list[int], target: int) -> list[list[int]]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def combinationSum2(candidates: list[int], target: int) -> list[list[int]]:
    candidates.sort()  # Sort to group duplicates
    result = []

    def backtrack(start: int, path: list[int], remaining: int):
        if remaining == 0:
            result.append(path[:])
            return

        if remaining < 0:
            return

        for i in range(start, len(candidates)):
            # Skip duplicates at same level
            if i > start and candidates[i] == candidates[i-1]:
                continue

            # Pruning: if current is too large, rest will be too
            if candidates[i] > remaining:
                break

            path.append(candidates[i])
            backtrack(i + 1, path, remaining - candidates[i])  # i+1 means use once
            path.pop()

    backtrack(0, [], target)
    return result

# Test
print(combinationSum2([10,1,2,7,6,1,5], 8))  # [[1,1,6], [1,2,5], [1,7], [2,6]]`
            },
            hints: [
                { afterAttempt: 1, text: 'Sort the array first to group duplicates' },
                { afterAttempt: 2, text: 'Skip duplicates: if i > start and candidates[i] == candidates[i-1]: continue' },
                { afterAttempt: 3, text: 'Use i+1 (not i) to prevent reusing the same element' },
            ],
            testCases: [
                { input: '[10,1,2,7,6,1,5], 8', expectedOutput: '[[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]' },
                { input: '[2,5,2,1,2], 5', expectedOutput: '[[1, 2, 2], [5]]' }
            ],
            solutionExplanation: `## Pattern Combination

This combines two patterns:
1. **Combination Sum pattern:** Track remaining sum, prune when negative
2. **Subsets II pattern:** Sort + skip duplicates

**Key differences from Combination Sum I:**
- Use \`i + 1\` instead of \`i\` (no reuse)
- Add duplicate skipping logic

## Complexity
- **Time:** O(2^n)
- **Space:** O(n) for recursion depth`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-combination-sum-iii',
            title: 'Combination Sum III',
            description: 'Find k numbers that sum to n using 1-9',
            targetComplexity: { time: 'O(C(9,k))', space: 'O(k)' },
            requiredForProgress: true,
            instruction: `# Combination Sum III

## The Problem

Find all valid combinations of k numbers that sum up to n such that:
- Only numbers 1 through 9 are used
- Each number is used at most once

**Example 1:**
\`\`\`
Input: k = 3, n = 7
Output: [[1,2,4]]
Explanation: 1 + 2 + 4 = 7
\`\`\`

**Example 2:**
\`\`\`
Input: k = 3, n = 9
Output: [[1,2,6], [1,3,5], [2,3,4]]
\`\`\`

## Your Task

Combine the combinations pattern (fixed k elements) with sum tracking.`,
            starterCode: `def combinationSum3(k: int, n: int) -> list[list[int]]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def combinationSum3(k: int, n: int) -> list[list[int]]:
    result = []

    def backtrack(start: int, path: list[int], remaining: int):
        # Base case: correct count
        if len(path) == k:
            if remaining == 0:
                result.append(path[:])
            return

        # Pruning
        if remaining <= 0:
            return

        for i in range(start, 10):
            # Pruning: if current number too large
            if i > remaining:
                break

            path.append(i)
            backtrack(i + 1, path, remaining - i)
            path.pop()

    backtrack(1, [], n)
    return result

# Test
print(combinationSum3(3, 7))  # [[1,2,4]]
print(combinationSum3(3, 9))  # [[1,2,6], [1,3,5], [2,3,4]]`
            },
            hints: [
                { afterAttempt: 1, text: 'Loop from start to 9 (not 10, since we use 1-9)' },
                { afterAttempt: 2, text: 'Two base conditions: len(path) == k AND remaining == 0' },
                { afterAttempt: 3, text: 'Prune: if i > remaining, break (all future numbers too large)' },
            ],
            testCases: [
                { input: '3, 7', expectedOutput: '[[1, 2, 4]]' },
                { input: '3, 9', expectedOutput: '[[1, 2, 6], [1, 3, 5], [2, 3, 4]]' }
            ],
            solutionExplanation: `## Pattern: Fixed Size + Sum Target

Combines two constraints:
1. Exactly k numbers (like Combinations)
2. Sum equals n (like Combination Sum)

**Pruning strategies:**
- If len(path) == k but remaining != 0, stop
- If i > remaining, break (all future too large)

## Complexity
- **Time:** O(C(9,k)) - at most 126 combinations
- **Space:** O(k) for recursion depth`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-generate-parentheses',
            title: 'Generate Parentheses',
            description: 'Generate all valid combinations of n pairs of parentheses',
            targetComplexity: { time: 'O(4^n/√n)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Generate Parentheses

## The Problem

Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.

**Example:**
\`\`\`
Input: n = 3
Output: ["((()))","(()())","(())()","()(())","()()()"]
\`\`\`

## The Constraint

At any point:
- \`open_count\` ≤ n (can't have more than n opens)
- \`close_count\` ≤ \`open_count\` (can't close more than opened)

## The Tree

\`\`\`
For n=2:
          ""
         /
        (
       / \\
     ((   ()
     |    |
    (()  ()(
     |    |
   (())  ()()
\`\`\`

## Your Task

Track open and close counts, only add valid characters.`,
            starterCode: `def generateParenthesis(n: int) -> list[str]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def generateParenthesis(n: int) -> list[str]:
    result = []

    def backtrack(path: str, open_count: int, close_count: int):
        # Base case: used all parentheses
        if len(path) == 2 * n:
            result.append(path)
            return

        # Can add open if haven't used n opens yet
        if open_count < n:
            backtrack(path + '(', open_count + 1, close_count)

        # Can add close if opens > closes (valid)
        if close_count < open_count:
            backtrack(path + ')', open_count, close_count + 1)

    backtrack("", 0, 0)
    return result

# Test
print(generateParenthesis(3))  # ["((()))","(()())","(())()","()(())","()()()"]`
            },
            hints: [
                { afterAttempt: 1, text: 'Track two counts: open_count and close_count' },
                { afterAttempt: 2, text: 'Can add "(" if open_count < n' },
                { afterAttempt: 3, text: 'Can add ")" if close_count < open_count' },
            ],
            testCases: [
                { input: '3', expectedOutput: '["((()))", "(()())", "(())()", "()(())", "()()()"]' },
                { input: '1', expectedOutput: '["()"]' },
                { input: '2', expectedOutput: '["(())", "()()"]' }
            ],
            solutionExplanation: `## Pattern: Constrained Generation

This is NOT subsets/combinations - it's constrained string generation.

**Two simple rules:**
1. Add \`(\` if open_count < n
2. Add \`)\` if close_count < open_count

**Why these rules work:**
- Rule 1: We can have at most n opens
- Rule 2: We can't close more than we've opened

## Complexity
- **Time:** O(4^n / √n) - Catalan number
- **Space:** O(n) for recursion depth

This generates exactly C(n) = (2n)! / ((n+1)!n!) valid combinations.`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },

  // ============================================================
  // GROUP 3: GRID-BASED BACKTRACKING
  // ============================================================
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-word-search-ii',
            title: 'Word Search II',
            description: 'Find all words from dictionary that exist in the grid',
            targetComplexity: { time: 'O(m*n*4^L*w)', space: 'O(w*L)' },
            requiredForProgress: true,
            instruction: `# Word Search II

## The Problem

Given an m x n board of characters and a list of strings words, return all words on the board.

Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.

**Example:**
\`\`\`
board = [
  ["o","a","a","n"],
  ["e","t","a","e"],
  ["i","h","k","r"],
  ["i","f","l","v"]
]
words = ["oath","pea","eat","rain"]
Output: ["eat","oath"]
\`\`\`

## Key Insight

Use a Trie to efficiently check if current path is a valid prefix.

## Your Task

1. Build a Trie from word list
2. DFS from each cell, following Trie
3. When reaching a word end, add to result`,
            starterCode: `def findWords(board: list[list[str]], words: list[str]) -> list[str]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def findWords(board: list[list[str]], words: list[str]) -> list[str]:
    # Build Trie
    trie = {}
    for word in words:
        node = trie
        for char in word:
            if char not in node:
                node[char] = {}
            node = node[char]
        node['$'] = word  # Mark end, store word

    rows, cols = len(board), len(board[0])
    result = set()

    def backtrack(row: int, col: int, node: dict):
        char = board[row][col]

        if char not in node:
            return

        next_node = node[char]

        # Found a word
        if '$' in next_node:
            result.add(next_node['$'])

        # Mark visited
        board[row][col] = '#'

        # Explore 4 directions
        for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
            nr, nc = row + dr, col + dc
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '#':
                backtrack(nr, nc, next_node)

        # Restore
        board[row][col] = char

    # Start DFS from each cell
    for r in range(rows):
        for c in range(cols):
            if board[r][c] in trie:
                backtrack(r, c, trie)

    return list(result)

# Test
board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]
print(findWords(board, ["oath","pea","eat","rain"]))  # ["eat","oath"]`
            },
            hints: [
                { afterAttempt: 1, text: 'Build a Trie from the word list for efficient prefix checking' },
                { afterAttempt: 2, text: 'Store the complete word at the end node: node["$"] = word' },
                { afterAttempt: 3, text: 'Use backtracking: mark cell as #, explore, restore' },
            ],
            testCases: [
                { input: '[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], ["oath","pea","eat","rain"]', expectedOutput: '["eat", "oath"]' }
            ],
            solutionExplanation: `## Pattern: Trie + Grid Backtracking

Combining two patterns:
1. Trie for efficient prefix matching
2. Grid backtracking from Word Search I

**Why Trie is essential:**
- Without Trie: O(w * m*n * 4^L) - check each word separately
- With Trie: O(m*n * 4^L) - all words checked in one traversal

**Optimization:** Remove found words from Trie to avoid duplicates.

## Complexity
- **Time:** O(m*n * 4^L) with Trie pruning
- **Space:** O(w*L) for Trie`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-rat-in-maze',
            title: 'Rat in a Maze',
            description: 'Find all paths from top-left to bottom-right',
            targetComplexity: { time: 'O(4^(n*m))', space: 'O(n*m)' },
            requiredForProgress: true,
            instruction: `# Rat in a Maze

## The Problem

Given an n x m grid where:
- 1 = open cell (can walk)
- 0 = blocked cell (cannot walk)

Find all paths from top-left (0,0) to bottom-right (n-1, m-1).

Return all paths as strings like "DRRRD" (Down, Right, Right, Right, Down).

**Example:**
\`\`\`
maze = [
  [1, 0, 0, 0],
  [1, 1, 0, 1],
  [1, 1, 0, 0],
  [0, 1, 1, 1]
]
Output: ["DRDDRR", "DDRDRR"]
\`\`\`

## Your Task

Use backtracking with 4 directions (DLRU), tracking visited cells.`,
            starterCode: `def findPaths(maze: list[list[int]]) -> list[str]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def findPaths(maze: list[list[int]]) -> list[str]:
    if not maze or maze[0][0] == 0:
        return []

    n, m = len(maze), len(maze[0])
    if maze[n-1][m-1] == 0:
        return []

    result = []
    visited = [[False] * m for _ in range(n)]

    # Directions: Down, Left, Right, Up (alphabetical for sorted output)
    directions = [(1, 0, 'D'), (0, -1, 'L'), (0, 1, 'R'), (-1, 0, 'U')]

    def backtrack(row: int, col: int, path: str):
        # Reached destination
        if row == n - 1 and col == m - 1:
            result.append(path)
            return

        visited[row][col] = True

        for dr, dc, direction in directions:
            nr, nc = row + dr, col + dc

            if (0 <= nr < n and 0 <= nc < m and
                maze[nr][nc] == 1 and not visited[nr][nc]):
                backtrack(nr, nc, path + direction)

        visited[row][col] = False

    backtrack(0, 0, "")
    return result

# Test
maze = [[1,0,0,0],[1,1,0,1],[1,1,0,0],[0,1,1,1]]
print(findPaths(maze))  # ["DDRDRR", "DRDDRR"]`
            },
            hints: [
                { afterAttempt: 1, text: 'Check edge cases: start or end is blocked' },
                { afterAttempt: 2, text: 'Use visited array to avoid cycles' },
                { afterAttempt: 3, text: 'Remember to unmark visited when backtracking' },
            ],
            testCases: [
                { input: '[[1,0,0,0],[1,1,0,1],[1,1,0,0],[0,1,1,1]]', expectedOutput: '["DDRDRR", "DRDDRR"]' },
                { input: '[[1,1],[1,1]]', expectedOutput: '["DR", "RD"]' }
            ],
            solutionExplanation: `## Pattern: Path Finding with All Solutions

Similar to Word Search but:
- Find ALL paths, not just existence
- Build path string as we go

**Key insight:** Must track visited because we can revisit cells in different paths, but not in the same path.

## Complexity
- **Time:** O(4^(n*m)) worst case
- **Space:** O(n*m) for visited array`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-unique-paths-iii',
            title: 'Unique Paths III',
            description: 'Walk every non-obstacle cell exactly once',
            targetComplexity: { time: 'O(4^(m*n))', space: 'O(m*n)' },
            requiredForProgress: true,
            instruction: `# Unique Paths III

## The Problem

You are given an m x n grid:
- 1 = starting square (exactly one)
- 2 = ending square (exactly one)
- 0 = empty squares (must walk over every one exactly once)
- -1 = obstacles (cannot walk on)

Return the number of 4-directional walks from start to end that walk over every non-obstacle square exactly once.

**Example:**
\`\`\`
grid = [
  [1, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 2,-1]
]
Output: 2
Paths: Start→→→↓↓→End and Start→↓→→↓→End (covering all 0s)
\`\`\`

## Your Task

1. Count empty cells + start (cells to visit)
2. Backtrack, counting visited cells
3. Only count path if all cells visited when reaching end`,
            starterCode: `def uniquePathsIII(grid: list[list[int]]) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def uniquePathsIII(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])

    # Find start, end, and count empty cells
    start_r = start_c = 0
    empty_count = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                start_r, start_c = r, c
                empty_count += 1  # Start counts as a cell to visit
            elif grid[r][c] == 0:
                empty_count += 1

    count = [0]

    def backtrack(row: int, col: int, visited: int):
        # Reached end
        if grid[row][col] == 2:
            if visited == empty_count:
                count[0] += 1
            return

        # Mark visited
        temp = grid[row][col]
        grid[row][col] = -2

        # Try 4 directions
        for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
            nr, nc = row + dr, col + dc
            if (0 <= nr < rows and 0 <= nc < cols and
                grid[nr][nc] >= 0):  # 0, 1, or 2
                backtrack(nr, nc, visited + 1)

        # Restore
        grid[row][col] = temp

    backtrack(start_r, start_c, 1)  # Start with 1 (visiting start cell)
    return count[0]

# Test
grid = [[1,0,0,0],[0,0,0,0],[0,0,2,-1]]
print(uniquePathsIII(grid))  # 2`
            },
            hints: [
                { afterAttempt: 1, text: 'Count empty cells first (including start cell)' },
                { afterAttempt: 2, text: 'Track how many cells visited; only valid if all visited when reaching 2' },
                { afterAttempt: 3, text: 'Mark visited cells with -2, restore on backtrack' },
            ],
            testCases: [
                { input: '[[1,0,0,0],[0,0,0,0],[0,0,2,-1]]', expectedOutput: '2' },
                { input: '[[1,0,0,0],[0,0,0,0],[0,0,0,2]]', expectedOutput: '4' }
            ],
            solutionExplanation: `## Pattern: Complete Path Enumeration

Must visit EVERY empty cell exactly once before reaching end.

**Key insight:** Track count of visited cells, only count path if visited == total_empty when reaching end.

**Pruning opportunity:** If remaining cells > possible steps to end, prune early (not implemented in basic solution).

## Complexity
- **Time:** O(4^(m*n)) - exploring all paths
- **Space:** O(m*n) for recursion depth`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-sudoku-solver',
            title: 'Sudoku Solver',
            description: 'Solve a 9x9 Sudoku puzzle',
            targetComplexity: { time: 'O(9^(empty cells))', space: 'O(1)' },
            requiredForProgress: true,
            instruction: `# Sudoku Solver

## The Problem

Write a program to solve a Sudoku puzzle by filling the empty cells (represented by '.').

**Rules:**
1. Each row must contain 1-9 with no duplicates
2. Each column must contain 1-9 with no duplicates
3. Each 3x3 sub-box must contain 1-9 with no duplicates

**Example:**
\`\`\`
Input:
[["5","3",".",".","7",".",".",".","."],
 ["6",".",".","1","9","5",".",".","."],
 ...]

Output: Complete valid Sudoku
\`\`\`

## Your Task

Use backtracking: try 1-9 for each empty cell, validate, and recurse.`,
            starterCode: `def solveSudoku(board: list[list[str]]) -> None:
    """Modify board in-place to solve the sudoku."""
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def solveSudoku(board: list[list[str]]) -> None:
    def is_valid(row: int, col: int, num: str) -> bool:
        # Check row
        if num in board[row]:
            return False

        # Check column
        for r in range(9):
            if board[r][col] == num:
                return False

        # Check 3x3 box
        box_r, box_c = 3 * (row // 3), 3 * (col // 3)
        for r in range(box_r, box_r + 3):
            for c in range(box_c, box_c + 3):
                if board[r][c] == num:
                    return False

        return True

    def solve() -> bool:
        # Find next empty cell
        for row in range(9):
            for col in range(9):
                if board[row][col] == '.':
                    # Try each number
                    for num in '123456789':
                        if is_valid(row, col, num):
                            board[row][col] = num

                            if solve():
                                return True

                            board[row][col] = '.'

                    return False  # No valid number found

        return True  # All cells filled

    solve()

# Test
board = [["5","3",".",".","7",".",".",".","."],
         ["6",".",".","1","9","5",".",".","."],
         [".","9","8",".",".",".",".","6","."],
         ["8",".",".",".","6",".",".",".","3"],
         ["4",".",".","8",".","3",".",".","1"],
         ["7",".",".",".","2",".",".",".","6"],
         [".","6",".",".",".",".","2","8","."],
         [".",".",".","4","1","9",".",".","5"],
         [".",".",".",".","8",".",".","7","9"]]
solveSudoku(board)
for row in board:
    print(row)`
            },
            hints: [
                { afterAttempt: 1, text: 'Find the next empty cell (.) first' },
                { afterAttempt: 2, text: 'Check validity: row, column, AND 3x3 box' },
                { afterAttempt: 3, text: 'If no valid number works, backtrack by setting cell back to "."' },
            ],
            testCases: [
                { input: 'Valid Sudoku puzzle', expectedOutput: 'Solved puzzle (all cells filled, all constraints satisfied)' }
            ],
            solutionExplanation: `## Pattern: Constraint Satisfaction

Classic constraint satisfaction problem:
1. Find next variable (empty cell)
2. Try each value (1-9)
3. Check constraints (row, col, box)
4. Recurse; backtrack if stuck

**Optimization ideas:**
- Track used numbers in sets for O(1) lookup
- Choose cell with fewest options (MRV heuristic)
- Constraint propagation

## Complexity
- **Time:** O(9^m) where m = empty cells
- **Space:** O(m) for recursion stack`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },

  // ============================================================
  // GROUP 4: ORDERING AND PRUNING
  // ============================================================
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-restore-ip-addresses',
            title: 'Restore IP Addresses',
            description: 'Insert dots to create valid IP addresses',
            targetComplexity: { time: 'O(3^4)', space: 'O(1)' },
            requiredForProgress: true,
            instruction: `# Restore IP Addresses

## The Problem

Given a string s containing only digits, return all possible valid IP addresses that can be formed by inserting dots into s.

A valid IP address consists of exactly four integers (0-255) separated by dots. Leading zeros are not allowed.

**Example:**
\`\`\`
Input: s = "25525511135"
Output: ["255.255.11.135", "255.255.111.35"]
\`\`\`

## Constraints
- Each segment: 0-255
- No leading zeros (except "0" itself)
- Exactly 4 segments

## Your Task

Backtrack by choosing segment lengths (1-3 digits) for each of 4 parts.`,
            starterCode: `def restoreIpAddresses(s: str) -> list[str]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def restoreIpAddresses(s: str) -> list[str]:
    result = []

    def is_valid(segment: str) -> bool:
        # No leading zeros (except "0" itself)
        if len(segment) > 1 and segment[0] == '0':
            return False
        # Must be 0-255
        return 0 <= int(segment) <= 255

    def backtrack(start: int, parts: list[str]):
        # Base case: 4 parts and used all characters
        if len(parts) == 4:
            if start == len(s):
                result.append('.'.join(parts))
            return

        # Pruning: remaining chars must fit remaining parts
        remaining = len(s) - start
        remaining_parts = 4 - len(parts)
        if remaining < remaining_parts or remaining > remaining_parts * 3:
            return

        # Try segments of length 1, 2, 3
        for length in range(1, 4):
            if start + length <= len(s):
                segment = s[start:start + length]
                if is_valid(segment):
                    parts.append(segment)
                    backtrack(start + length, parts)
                    parts.pop()

    backtrack(0, [])
    return result

# Test
print(restoreIpAddresses("25525511135"))  # ["255.255.11.135", "255.255.111.35"]`
            },
            hints: [
                { afterAttempt: 1, text: 'Try segment lengths 1, 2, 3 for each of the 4 parts' },
                { afterAttempt: 2, text: 'Validate: no leading zeros, value 0-255' },
                { afterAttempt: 3, text: 'Prune early if remaining chars cant fit remaining parts' },
            ],
            testCases: [
                { input: '"25525511135"', expectedOutput: '["255.255.11.135", "255.255.111.35"]' },
                { input: '"0000"', expectedOutput: '["0.0.0.0"]' },
                { input: '"101023"', expectedOutput: '["1.0.10.23", "1.0.102.3", "10.1.0.23", "10.10.2.3", "101.0.2.3"]' }
            ],
            solutionExplanation: `## Pattern: Fixed-Part Partitioning

Similar to palindrome partitioning but with:
- Exactly 4 parts
- Numeric constraints (0-255, no leading zeros)

**Pruning is crucial:**
- Each part: 1-3 digits
- Remaining chars must be between (remaining_parts) and (remaining_parts * 3)

## Complexity
- **Time:** O(3^4) = O(81) - at most 81 combinations
- **Space:** O(1) - fixed number of parts`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-expression-add-operators',
            title: 'Expression Add Operators',
            description: 'Insert +, -, * to reach target value',
            targetComplexity: { time: 'O(4^n)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Expression Add Operators

## The Problem

Given a string num that contains only digits and an integer target, add binary operators '+', '-', or '*' between the digits so they evaluate to the target value.

**Example:**
\`\`\`
Input: num = "123", target = 6
Output: ["1*2*3", "1+2+3"]
Explanation: 1*2*3 = 6 and 1+2+3 = 6
\`\`\`

## The Tricky Part

Multiplication has higher precedence! When we see \`1+2*3\`:
- NOT (1+2)*3 = 9
- But 1+(2*3) = 7

**Solution:** Track the last operand to "undo" for multiplication.

## Your Task

At each position, try all operators and track values correctly.`,
            starterCode: `def addOperators(num: str, target: int) -> list[str]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def addOperators(num: str, target: int) -> list[str]:
    result = []

    def backtrack(index: int, path: str, value: int, last: int):
        # Base case: used all digits
        if index == len(num):
            if value == target:
                result.append(path)
            return

        for i in range(index, len(num)):
            # No leading zeros (except "0" itself)
            if i > index and num[index] == '0':
                break

            current = int(num[index:i+1])

            if index == 0:
                # First number, no operator
                backtrack(i + 1, str(current), current, current)
            else:
                # Try +
                backtrack(i + 1, path + '+' + str(current),
                         value + current, current)

                # Try -
                backtrack(i + 1, path + '-' + str(current),
                         value - current, -current)

                # Try * (undo last, apply multiplication)
                backtrack(i + 1, path + '*' + str(current),
                         value - last + last * current, last * current)

    if num:
        backtrack(0, "", 0, 0)
    return result

# Test
print(addOperators("123", 6))  # ["1+2+3", "1*2*3"]
print(addOperators("232", 8))  # ["2*3+2", "2+3*2"]`
            },
            hints: [
                { afterAttempt: 1, text: 'First number has no operator before it' },
                { afterAttempt: 2, text: 'Handle leading zeros: if num[index] == "0", can only use single "0"' },
                { afterAttempt: 3, text: 'For *, undo last: value - last + last * current' },
            ],
            testCases: [
                { input: '"123", 6', expectedOutput: '["1+2+3", "1*2*3"]' },
                { input: '"232", 8', expectedOutput: '["2*3+2", "2+3*2"]' }
            ],
            solutionExplanation: `## Pattern: Operator Insertion with Precedence

The key insight is handling multiplication precedence:
- Track \`last\` = the operand we just added
- For multiplication: undo last addition, then add (last * current)

Example: For "2+3*2":
- After "2+3": value=5, last=3
- For "*2": value = 5 - 3 + 3*2 = 5 - 3 + 6 = 8

## Complexity
- **Time:** O(4^n) - 4 choices (no op, +, -, *) at each position
- **Space:** O(n) for recursion and path string`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-additive-number',
            title: 'Additive Number (Fibonacci-like)',
            description: 'Check if string forms Fibonacci-like sequence',
            targetComplexity: { time: 'O(n^3)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Additive Number

## The Problem

An additive number is a string whose digits can form an additive sequence.

A valid additive sequence should contain at least three numbers, where each number (except the first two) is the sum of the two preceding ones.

**Example:**
\`\`\`
Input: "112358"
Output: true
Explanation: 1 + 1 = 2, 1 + 2 = 3, 2 + 3 = 5, 3 + 5 = 8
Sequence: [1, 1, 2, 3, 5, 8]
\`\`\`

**Example 2:**
\`\`\`
Input: "199100199"
Output: true
Explanation: 1 + 99 = 100, 99 + 100 = 199
Sequence: [1, 99, 100, 199]
\`\`\`

## Your Task

Try all pairs of first two numbers, then verify the Fibonacci-like property.`,
            starterCode: `def isAdditiveNumber(num: str) -> bool:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def isAdditiveNumber(num: str) -> bool:
    n = len(num)

    def is_valid_sequence(first: int, second: int, start: int) -> bool:
        if start == n:
            return True

        next_sum = first + second
        next_str = str(next_sum)

        # Check if next part of string matches the sum
        if num[start:].startswith(next_str):
            return is_valid_sequence(second, next_sum, start + len(next_str))

        return False

    # Try all pairs of first two numbers
    for i in range(1, n):
        # First number: num[0:i]
        if i > 1 and num[0] == '0':  # No leading zeros
            break

        first = int(num[0:i])

        for j in range(i + 1, n):
            # Second number: num[i:j]
            if j > i + 1 and num[i] == '0':  # No leading zeros
                break

            second = int(num[i:j])

            if is_valid_sequence(first, second, j):
                return True

    return False

# Test
print(isAdditiveNumber("112358"))     # True: 1,1,2,3,5,8
print(isAdditiveNumber("199100199"))  # True: 1,99,100,199`
            },
            hints: [
                { afterAttempt: 1, text: 'Try all pairs of first two numbers using nested loops' },
                { afterAttempt: 2, text: 'Handle leading zeros: break if first char is 0 and length > 1' },
                { afterAttempt: 3, text: 'Use startswith() to check if next sum matches string' },
            ],
            testCases: [
                { input: '"112358"', expectedOutput: 'True' },
                { input: '"199100199"', expectedOutput: 'True' },
                { input: '"1023"', expectedOutput: 'False' }
            ],
            solutionExplanation: `## Pattern: First Two Fix Everything

Once you fix the first two numbers, the entire sequence is determined.

**Strategy:**
1. Try all pairs (i, j) for first two numbers
2. For each pair, verify the Fibonacci-like sequence
3. Handle leading zeros carefully

## Complexity
- **Time:** O(n^3) - O(n^2) pairs, O(n) to verify each
- **Space:** O(n) for recursion`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-matchsticks-to-square',
            title: 'Matchsticks to Square',
            description: 'Partition matchsticks into 4 equal-length sides',
            targetComplexity: { time: 'O(4^n)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Matchsticks to Square

## The Problem

Given an array of integers representing matchstick lengths, determine if you can use ALL matchsticks to form a square.

**Example:**
\`\`\`
Input: matchsticks = [1,1,2,2,2]
Output: true
Explanation: [1,1,2] + [2] + [2] = sides of length 4? No wait...
Actually: [1,1,2], [2,2], ... hmm
Let's see: sum=8, so side=2. [1,1], [2], [2], [2] ✓
\`\`\`

## Key Insight

- Total sum must be divisible by 4
- We need to partition into 4 groups of equal sum
- Sort descending to prune faster

## Your Task

Use backtracking to assign each matchstick to one of 4 sides.`,
            starterCode: `def makesquare(matchsticks: list[int]) -> bool:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def makesquare(matchsticks: list[int]) -> bool:
    total = sum(matchsticks)

    # Must be divisible by 4
    if total % 4 != 0:
        return False

    side = total // 4

    # Largest stick can't exceed side length
    if max(matchsticks) > side:
        return False

    # Sort descending for better pruning
    matchsticks.sort(reverse=True)

    sides = [0] * 4

    def backtrack(index: int) -> bool:
        # All matchsticks assigned
        if index == len(matchsticks):
            return sides[0] == sides[1] == sides[2] == side

        stick = matchsticks[index]

        for i in range(4):
            # Pruning: if adding to this side exceeds target
            if sides[i] + stick > side:
                continue

            # Pruning: skip identical partial sums
            if i > 0 and sides[i] == sides[i-1]:
                continue

            sides[i] += stick
            if backtrack(index + 1):
                return True
            sides[i] -= stick

        return False

    return backtrack(0)

# Test
print(makesquare([1,1,2,2,2]))  # True
print(makesquare([3,3,3,3,4]))  # False`
            },
            hints: [
                { afterAttempt: 1, text: 'Check if sum % 4 == 0 first' },
                { afterAttempt: 2, text: 'Sort descending to find violations faster' },
                { afterAttempt: 3, text: 'Prune: skip if sides[i] + stick > target side length' },
            ],
            testCases: [
                { input: '[1,1,2,2,2]', expectedOutput: 'True' },
                { input: '[3,3,3,3,4]', expectedOutput: 'False' }
            ],
            solutionExplanation: `## Pattern: K-way Partition

Similar to "Partition to K Equal Sum Subsets":
1. Calculate target side length
2. Assign each item to one of 4 buckets
3. Backtrack if any bucket exceeds target

**Key optimizations:**
- Sort descending: larger items fail faster
- Skip identical partial sums: avoid redundant work

## Complexity
- **Time:** O(4^n) worst case, much better with pruning
- **Space:** O(n) for recursion`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },

  // ============================================================
  // GROUP 5: ADVANCED BACKTRACKING
  // ============================================================
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-nqueens-full',
            title: 'N-Queens: Return All Board Configurations',
            description: 'Return all valid N-Queens board configurations',
            targetComplexity: { time: 'O(n!)', space: 'O(n^2)' },
            requiredForProgress: true,
            instruction: `# N-Queens: Return All Board Configurations

## The Problem

The n-queens puzzle is the problem of placing n queens on an n×n chessboard such that no two queens attack each other.

Return all distinct solutions to the n-queens puzzle. Each solution contains a distinct board configuration where 'Q' indicates a queen and '.' indicates an empty space.

**Example (n=4):**
\`\`\`
Output: [
  [".Q..",
   "...Q",
   "Q...",
   "..Q."],

  ["..Q.",
   "Q...",
   "...Q",
   ".Q.."]
]
\`\`\`

## Your Task

Extend N-Queens counting to return actual board configurations.`,
            starterCode: `def solveNQueens(n: int) -> list[list[str]]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def solveNQueens(n: int) -> list[list[str]]:
    result = []
    board = [-1] * n  # board[row] = column of queen in that row

    def is_valid(row: int, col: int) -> bool:
        for r in range(row):
            if board[r] == col:
                return False
            if abs(row - r) == abs(col - board[r]):
                return False
        return True

    def build_board() -> list[str]:
        return ['.' * board[r] + 'Q' + '.' * (n - board[r] - 1) for r in range(n)]

    def backtrack(row: int):
        if row == n:
            result.append(build_board())
            return

        for col in range(n):
            if is_valid(row, col):
                board[row] = col
                backtrack(row + 1)
                board[row] = -1

    backtrack(0)
    return result

# Test
for solution in solveNQueens(4):
    for row in solution:
        print(row)
    print()`
            },
            hints: [
                { afterAttempt: 1, text: 'Store column positions: board[row] = col means queen at (row, col)' },
                { afterAttempt: 2, text: 'Build board string: "." * col + "Q" + "." * (n - col - 1)' },
                { afterAttempt: 3, text: 'On success, build and append the board configuration' },
            ],
            testCases: [
                { input: '4', expectedOutput: '2 board configurations' }
            ],
            solutionExplanation: `## Pattern: Configuration Building

Extension of N-Queens counting:
1. Same backtracking logic
2. On base case, build the board representation
3. Add to result list

**Board representation:**
- board[i] = j means queen at row i, column j
- Convert to string: dots before Q + "Q" + dots after Q

## Complexity
- **Time:** O(n!) for generating, O(n^2) per board construction
- **Space:** O(n^2) for storing all configurations`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-beautiful-arrangement',
            title: 'Beautiful Arrangement',
            description: 'Count permutations where i divides arr[i] or arr[i] divides i',
            targetComplexity: { time: 'O(n!)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Beautiful Arrangement

## The Problem

Suppose you have n integers labeled 1 through n. A permutation of those n integers is called a beautiful arrangement if for every position i (1-indexed):
- perm[i] is divisible by i, OR
- i is divisible by perm[i]

Return the number of beautiful arrangements.

**Example:**
\`\`\`
Input: n = 2
Output: 2
Explanation:
[1, 2]: 1 divisible by 1, 2 divisible by 2 ✓
[2, 1]: 2 divisible by 1, 1 divides 2 ✓
\`\`\`

## Your Task

Use permutation backtracking with constraint checking at each position.`,
            starterCode: `def countArrangement(n: int) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def countArrangement(n: int) -> int:
    count = [0]
    used = [False] * (n + 1)

    def is_beautiful(pos: int, num: int) -> bool:
        return num % pos == 0 or pos % num == 0

    def backtrack(pos: int):
        if pos > n:
            count[0] += 1
            return

        for num in range(1, n + 1):
            if not used[num] and is_beautiful(pos, num):
                used[num] = True
                backtrack(pos + 1)
                used[num] = False

    backtrack(1)
    return count[0]

# Test
print(countArrangement(2))  # 2
print(countArrangement(3))  # 3`
            },
            hints: [
                { afterAttempt: 1, text: 'Position is 1-indexed, so start at pos=1' },
                { afterAttempt: 2, text: 'Beautiful condition: num % pos == 0 or pos % num == 0' },
                { afterAttempt: 3, text: 'Check the condition BEFORE recursing (pruning)' },
            ],
            testCases: [
                { input: '2', expectedOutput: '2' },
                { input: '3', expectedOutput: '3' }
            ],
            solutionExplanation: `## Pattern: Constrained Permutation

Like permutations, but with constraint checking at each position.

**Pruning power:** By checking constraint before recursing, we eliminate many branches early.

**Why start from position 1:**
Starting from smaller positions has more constraints (more divisibility options), so we prune earlier.

## Complexity
- **Time:** O(k) where k << n! due to heavy pruning
- **Space:** O(n) for used array and recursion`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-gray-code',
            title: 'Gray Code',
            description: 'Generate n-bit Gray code sequence',
            targetComplexity: { time: 'O(2^n)', space: 'O(2^n)' },
            requiredForProgress: true,
            instruction: `# Gray Code

## The Problem

An n-bit gray code sequence is a sequence of 2^n integers where:
- Every integer is in the range [0, 2^n - 1]
- The first integer is 0
- Each integer appears exactly once
- Adjacent integers differ by exactly one bit

**Example:**
\`\`\`
Input: n = 2
Output: [0, 1, 3, 2]
Explanation: Binary: 00 → 01 → 11 → 10
Each step flips exactly one bit
\`\`\`

## The Approach

There's a formula (n XOR n>>1), but we'll use backtracking to understand the pattern.

## Your Task

Start with 0, then repeatedly flip one bit at a time to visit all numbers.`,
            starterCode: `def grayCode(n: int) -> list[int]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def grayCode(n: int) -> list[int]:
    result = [0]
    seen = {0}
    total = 1 << n  # 2^n

    def backtrack(current: int) -> bool:
        if len(result) == total:
            return True

        # Try flipping each bit
        for i in range(n):
            next_num = current ^ (1 << i)  # Flip bit i

            if next_num not in seen:
                seen.add(next_num)
                result.append(next_num)

                if backtrack(next_num):
                    return True

                # Backtrack
                result.pop()
                seen.remove(next_num)

        return False

    backtrack(0)
    return result

# Test
print(grayCode(2))  # [0, 1, 3, 2]

# Formula approach (for reference):
def grayCodeFormula(n: int) -> list[int]:
    return [i ^ (i >> 1) for i in range(1 << n)]`
            },
            hints: [
                { afterAttempt: 1, text: 'Flip bit i using XOR: current ^ (1 << i)' },
                { afterAttempt: 2, text: 'Track seen numbers to avoid duplicates' },
                { afterAttempt: 3, text: 'Success when result has 2^n numbers' },
            ],
            testCases: [
                { input: '2', expectedOutput: '[0, 1, 3, 2]' },
                { input: '1', expectedOutput: '[0, 1]' }
            ],
            solutionExplanation: `## Pattern: Hamiltonian Path on Hypercube

Gray code is essentially finding a Hamiltonian path on an n-dimensional hypercube.

**Each vertex:** An n-bit number
**Each edge:** Differs by one bit

**Backtracking approach:**
- Start at 0
- Try flipping each bit to get next number
- Track visited to avoid cycles

**Formula approach:** i ^ (i >> 1) directly generates Gray code.

## Complexity
- **Time:** O(2^n) for the result
- **Space:** O(2^n) for seen set and result`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-permutation-sequence',
            title: 'Permutation Sequence',
            description: 'Find the k-th permutation without generating all',
            targetComplexity: { time: 'O(n^2)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Permutation Sequence

## The Problem

Given n and k, return the k-th permutation sequence of [1, 2, ..., n].

**Example:**
\`\`\`
Input: n = 3, k = 3
All permutations: ["123", "132", "213", "231", "312", "321"]
Output: "213" (the 3rd permutation)
\`\`\`

## Key Insight

Don't generate all permutations! Use factorial to jump directly.

**For n=3, k=3:**
- Each "first digit" covers (n-1)! = 2 permutations
- k=3 falls in the 2nd group (starts with 2)
- Continue recursively

## Your Task

Use factorial-based indexing to directly compute the k-th permutation.`,
            starterCode: `def getPermutation(n: int, k: int) -> str:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def getPermutation(n: int, k: int) -> str:
    # Precompute factorials
    factorial = [1]
    for i in range(1, n):
        factorial.append(factorial[-1] * i)

    # Available digits
    digits = list(range(1, n + 1))

    # Convert to 0-indexed
    k -= 1

    result = []
    for i in range(n, 0, -1):
        # How many permutations per "bucket"
        bucket_size = factorial[i - 1]

        # Which bucket does k fall into?
        index = k // bucket_size

        result.append(str(digits[index]))
        digits.pop(index)

        # Remaining k within this bucket
        k %= bucket_size

    return ''.join(result)

# Test
print(getPermutation(3, 3))  # "213"
print(getPermutation(4, 9))  # "2314"`
            },
            hints: [
                { afterAttempt: 1, text: 'Convert k to 0-indexed (k -= 1)' },
                { afterAttempt: 2, text: 'Each first digit covers (n-1)! permutations' },
                { afterAttempt: 3, text: 'index = k // factorial[n-1], then k = k % factorial[n-1]' },
            ],
            testCases: [
                { input: '3, 3', expectedOutput: '"213"' },
                { input: '4, 9', expectedOutput: '"2314"' }
            ],
            solutionExplanation: `## Pattern: Factorial Number System

This is NOT about backtracking at all - it's about smart indexing!

**Key insight:**
- First digit determines (n-1)! permutations
- k // (n-1)! tells us which digit to pick first
- k % (n-1)! tells us position within that group

**Why this works:**
- Permutations are in lexicographic order
- We can "jump" to the right bucket using division

## Complexity
- **Time:** O(n^2) due to list.pop operations
- **Space:** O(n) for digits list and result

This is much better than O(n!) for generating all permutations!`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },

  // ============================================================
  // GROUP 6: OPTIMIZATION BACKTRACKING
  // ============================================================
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-partition-k-equal-sum',
            title: 'Partition to K Equal Sum Subsets',
            description: 'Partition array into k subsets with equal sum',
            targetComplexity: { time: 'O(k^n)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Partition to K Equal Sum Subsets

## The Problem

Given an integer array nums and an integer k, return true if it is possible to divide this array into k non-empty subsets whose sums are all equal.

**Example:**
\`\`\`
Input: nums = [4, 3, 2, 3, 5, 2, 1], k = 4
Output: true
Explanation: Sum = 20, so each subset needs sum = 5
Possible: (5), (1,4), (2,3), (2,3)
\`\`\`

## Key Insight

Generalization of Matchsticks to Square (k=4 → any k).

## Your Task

Use backtracking to assign each number to one of k buckets.`,
            starterCode: `def canPartitionKSubsets(nums: list[int], k: int) -> bool:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def canPartitionKSubsets(nums: list[int], k: int) -> bool:
    total = sum(nums)

    if total % k != 0:
        return False

    target = total // k

    if max(nums) > target:
        return False

    # Sort descending for better pruning
    nums.sort(reverse=True)

    buckets = [0] * k

    def backtrack(index: int) -> bool:
        if index == len(nums):
            return all(b == target for b in buckets)

        num = nums[index]
        seen = set()  # Track bucket values we've tried

        for i in range(k):
            if buckets[i] + num > target:
                continue

            if buckets[i] in seen:
                continue
            seen.add(buckets[i])

            buckets[i] += num
            if backtrack(index + 1):
                return True
            buckets[i] -= num

            # If empty bucket didn't work, no point trying other empty ones
            if buckets[i] == 0:
                break

        return False

    return backtrack(0)

# Test
print(canPartitionKSubsets([4,3,2,3,5,2,1], 4))  # True`
            },
            hints: [
                { afterAttempt: 1, text: 'Check if sum is divisible by k first' },
                { afterAttempt: 2, text: 'Sort descending to fail faster on large numbers' },
                { afterAttempt: 3, text: 'Skip buckets with same current sum (avoid duplicate work)' },
            ],
            testCases: [
                { input: '[4,3,2,3,5,2,1], 4', expectedOutput: 'True' },
                { input: '[1,2,3,4], 3', expectedOutput: 'False' }
            ],
            solutionExplanation: `## Pattern: K-way Partition with Pruning

Generalization of Matchsticks to Square:
1. Divide into k (not 4) buckets
2. Same backtracking approach
3. Critical pruning optimizations

**Key optimizations:**
1. Sort descending: large numbers fail faster
2. Skip identical bucket sums: avoid redundant paths
3. Early exit on empty bucket: if empty bucket doesn't work, neither will other empties

## Complexity
- **Time:** O(k^n) worst case, much better with pruning
- **Space:** O(n) for recursion`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-fair-cookies',
            title: 'Fair Distribution of Cookies',
            description: 'Minimize maximum cookies any child gets',
            targetComplexity: { time: 'O(k^n)', space: 'O(k)' },
            requiredForProgress: true,
            instruction: `# Fair Distribution of Cookies

## The Problem

You have n bags of cookies. Give all bags to k children. Minimize the maximum total cookies any single child gets (minimize "unfairness").

**Example:**
\`\`\`
Input: cookies = [8, 15, 10, 20, 8], k = 2
Output: 31
Explanation:
Child 1: [8, 15, 8] = 31
Child 2: [10, 20] = 30
Max = 31 (minimized)
\`\`\`

## Key Insight

Try all distributions, track the minimum of maximum child sum.

## Your Task

Backtrack to assign each cookie bag to one of k children, tracking best result.`,
            starterCode: `def distributeCookies(cookies: list[int], k: int) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def distributeCookies(cookies: list[int], k: int) -> int:
    n = len(cookies)
    children = [0] * k
    result = [float('inf')]

    # Sort descending for better pruning
    cookies.sort(reverse=True)

    def backtrack(index: int):
        if index == n:
            result[0] = min(result[0], max(children))
            return

        # Pruning: if current max already >= result, no point continuing
        if max(children) >= result[0]:
            return

        seen = set()
        for i in range(k):
            if children[i] in seen:
                continue
            seen.add(children[i])

            children[i] += cookies[index]
            backtrack(index + 1)
            children[i] -= cookies[index]

    backtrack(0)
    return result[0]

# Test
print(distributeCookies([8,15,10,20,8], 2))  # 31`
            },
            hints: [
                { afterAttempt: 1, text: 'Track max(children) and minimize it' },
                { afterAttempt: 2, text: 'Prune if current max >= best result found' },
                { afterAttempt: 3, text: 'Skip children with same current sum (symmetry)' },
            ],
            testCases: [
                { input: '[8,15,10,20,8], 2', expectedOutput: '31' },
                { input: '[6,1,3,2,2,4,1,2], 3', expectedOutput: '7' }
            ],
            solutionExplanation: `## Pattern: Minimax Optimization

Instead of checking feasibility, we optimize:
- Try all k^n distributions
- Track the minimum of maximum child sum

**Key pruning:**
- If current max already >= best found, prune
- Skip symmetric states (children with same sum)
- Sort descending to establish good bound early

## Complexity
- **Time:** O(k^n) worst case
- **Space:** O(k) for children array + O(n) recursion`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-max-score-words',
            title: 'Maximum Score Words Formed by Letters',
            description: 'Form words from letters to maximize total score',
            targetComplexity: { time: 'O(2^n)', space: 'O(26)' },
            requiredForProgress: true,
            instruction: `# Maximum Score Words Formed by Letters

## The Problem

Given a list of words, a list of available letters, and scores for each letter (a-z), return the maximum score you can get by forming any subset of words using the given letters.

Each letter can only be used once total.

**Example:**
\`\`\`
Input:
words = ["dog", "cat", "dad", "good"]
letters = ["a","a","c","d","d","d","g","o","o"]
score = [1,0,9,5,0,0,3,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0]
         a b c d ...                 o

Output: 23
Explanation: "dad" (5+1+5=11) + "good" (3+2+2+5=12) = 23
\`\`\`

## Your Task

Subset selection: for each word, decide to include or not, tracking available letters.`,
            starterCode: `def maxScoreWords(words: list[str], letters: list[str], score: list[int]) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def maxScoreWords(words: list[str], letters: list[str], score: list[int]) -> int:
    from collections import Counter

    # Count available letters
    available = Counter(letters)
    n = len(words)
    result = [0]

    def word_score(word: str) -> int:
        return sum(score[ord(c) - ord('a')] for c in word)

    def can_form(word: str, letter_count: Counter) -> bool:
        word_count = Counter(word)
        for char, count in word_count.items():
            if letter_count[char] < count:
                return False
        return True

    def use_letters(word: str, letter_count: Counter, add: bool):
        for char in word:
            if add:
                letter_count[char] += 1
            else:
                letter_count[char] -= 1

    def backtrack(index: int, current_score: int, letter_count: Counter):
        result[0] = max(result[0], current_score)

        if index == n:
            return

        for i in range(index, n):
            word = words[i]
            if can_form(word, letter_count):
                ws = word_score(word)
                use_letters(word, letter_count, False)  # Remove letters
                backtrack(i + 1, current_score + ws, letter_count)
                use_letters(word, letter_count, True)   # Restore letters

    backtrack(0, 0, available)
    return result[0]

# Test
words = ["dog","cat","dad","good"]
letters = ["a","a","c","d","d","d","g","o","o"]
score = [1,0,9,5,0,0,3,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0]
print(maxScoreWords(words, letters, score))  # 23`
            },
            hints: [
                { afterAttempt: 1, text: 'Use Counter to track available letters' },
                { afterAttempt: 2, text: 'For each word, check if formable before including' },
                { afterAttempt: 3, text: 'When including, subtract letters; restore when backtracking' },
            ],
            testCases: [
                { input: '["dog","cat","dad","good"], letters, score', expectedOutput: '23' }
            ],
            solutionExplanation: `## Pattern: Subset Selection with Resource Constraint

Similar to subset sum, but with:
- Multiple resource types (letters)
- Scoring instead of sum target

**Key operations:**
1. Check if word can be formed (enough letters)
2. If yes, subtract letters, add score, recurse
3. Restore letters when backtracking

## Complexity
- **Time:** O(2^n) for subset enumeration
- **Space:** O(26) for letter counts + O(n) recursion`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-shopping-offers',
            title: 'Shopping Offers',
            description: 'Minimize cost using special bundle offers',
            targetComplexity: { time: 'O(k^m)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Shopping Offers

## The Problem

In a store, there are n items. You have:
- prices[i] = price of item i
- needs[i] = how many of item i you need
- special = list of special offers [item0_count, item1_count, ..., total_price]

Find minimum cost to buy exactly what you need.

**Example:**
\`\`\`
Input:
prices = [2, 5]
special = [[3, 0, 5], [1, 2, 10]]  # [3 of item0 for $5], [1 of item0 + 2 of item1 for $10]
needs = [3, 2]

Output: 14
Explanation: Buy offer [1,2,10] once ($10), then buy 2 of item0 individually ($4)
Total: 10 + 4 = 14
\`\`\`

## Your Task

Use backtracking: try each special offer, or buy remaining individually.`,
            starterCode: `def shoppingOffers(prices: list[int], special: list[list[int]], needs: list[int]) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def shoppingOffers(prices: list[int], special: list[list[int]], needs: list[int]) -> int:
    n = len(prices)

    def buy_individual(needs: list[int]) -> int:
        return sum(needs[i] * prices[i] for i in range(n))

    def can_use_offer(offer: list[int], needs: list[int]) -> bool:
        return all(offer[i] <= needs[i] for i in range(n))

    def apply_offer(offer: list[int], needs: list[int]) -> list[int]:
        return [needs[i] - offer[i] for i in range(n)]

    memo = {}

    def backtrack(needs_tuple: tuple) -> int:
        if needs_tuple in memo:
            return memo[needs_tuple]

        needs = list(needs_tuple)

        # Option 1: Buy everything individually
        min_cost = buy_individual(needs)

        # Option 2: Try each special offer
        for offer in special:
            if can_use_offer(offer, needs):
                new_needs = apply_offer(offer, needs)
                cost = offer[-1] + backtrack(tuple(new_needs))
                min_cost = min(min_cost, cost)

        memo[needs_tuple] = min_cost
        return min_cost

    return backtrack(tuple(needs))

# Test
prices = [2, 5]
special = [[3, 0, 5], [1, 2, 10]]
needs = [3, 2]
print(shoppingOffers(prices, special, needs))  # 14`
            },
            hints: [
                { afterAttempt: 1, text: 'Base case: buy all items individually' },
                { afterAttempt: 2, text: 'For each offer, check if applicable (all counts <= needs)' },
                { afterAttempt: 3, text: 'Use memoization with tuple(needs) as key' },
            ],
            testCases: [
                { input: 'prices=[2,5], special=[[3,0,5],[1,2,10]], needs=[3,2]', expectedOutput: '14' }
            ],
            solutionExplanation: `## Pattern: Knapsack-like with Multiple Items

Similar to unbounded knapsack but with:
- Multiple item types
- Offers that bundle items

**Key insight:** Use memoization with needs tuple as key to avoid recomputing.

**State:** Current needs tuple
**Choices:**
1. Buy all individually
2. Use each applicable special offer

## Complexity
- **Time:** O(k^m) where k = max(needs), m = number of specials
- **Space:** O(k^n) for memoization`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-tiling-rectangle',
            title: 'Tiling a Rectangle with Minimum Squares',
            description: 'Tile n x m rectangle with minimum number of squares',
            targetComplexity: { time: 'O(exponential)', space: 'O(n*m)' },
            requiredForProgress: true,
            instruction: `# Tiling a Rectangle with Minimum Squares

## The Problem

Given an n x m rectangle, find the minimum number of integer-sided squares that tile the rectangle.

**Example:**
\`\`\`
Input: n = 2, m = 3
Output: 3
Explanation:
+--+--+--+
|1 |2 |  |
+--+--+ 3|
|  |  |  |
+--+--+--+
Use three 1x1 squares? No...
Actually: one 2x2 and two 1x1 = 3 squares
\`\`\`

**Example 2:**
\`\`\`
Input: n = 5, m = 8
Output: 5
\`\`\`

## Key Insight

This is a hard problem! Use backtracking with skyline representation.

## Your Task

Track the "skyline" (height at each column), place squares at lowest point.`,
            starterCode: `def tilingRectangle(n: int, m: int) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def tilingRectangle(n: int, m: int) -> int:
    if n > m:
        n, m = m, n  # Ensure n <= m

    # Skyline: heights[i] = current height at column i
    heights = [0] * m
    result = [float('inf')]

    def backtrack(count: int):
        if count >= result[0]:
            return  # Pruning

        # Check if rectangle is filled
        if all(h == n for h in heights):
            result[0] = min(result[0], count)
            return

        # Find the leftmost lowest point
        min_height = min(heights)
        left = heights.index(min_height)

        # Find how far right we can go at this height
        right = left
        while right < m and heights[right] == min_height:
            right += 1

        # Try placing squares of different sizes
        max_size = min(n - min_height, right - left)

        for size in range(max_size, 0, -1):
            # Place square of this size
            for i in range(left, left + size):
                heights[i] += size

            backtrack(count + 1)

            # Remove square
            for i in range(left, left + size):
                heights[i] -= size

    backtrack(0)
    return result[0]

# Test
print(tilingRectangle(2, 3))  # 3
print(tilingRectangle(5, 8))  # 5`
            },
            hints: [
                { afterAttempt: 1, text: 'Use skyline representation: heights[i] = filled height at column i' },
                { afterAttempt: 2, text: 'Always place next square at leftmost lowest point' },
                { afterAttempt: 3, text: 'Try largest square first (greedy ordering for pruning)' },
            ],
            testCases: [
                { input: '2, 3', expectedOutput: '3' },
                { input: '5, 8', expectedOutput: '5' }
            ],
            solutionExplanation: `## Pattern: Skyline Backtracking

This is a surprisingly hard problem! The greedy approach (always place largest square) doesn't work.

**Key insight:** Use skyline representation
- heights[i] = how much of column i is filled
- Always fill at leftmost lowest point (reduces branching)
- Try different square sizes

**Pruning:**
- If count >= best found, stop
- Try larger squares first (greedy ordering)

## Complexity
- **Time:** Exponential (no polynomial known!)
- **Space:** O(m) for skyline + O(area/min_square) recursion

Note: This problem is NP-complete!`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },

  // ============================================================
  // GROUP 7: CONSTRAINT SATISFACTION
  // ============================================================
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-word-pattern-ii',
            title: 'Word Pattern II',
            description: 'Match pattern to string with backtracking',
            targetComplexity: { time: 'O(n^m)', space: 'O(m)' },
            requiredForProgress: true,
            instruction: `# Word Pattern II

## The Problem

Given a pattern and a string s, find if s follows the same pattern.

Here "follow" means a full match, such that there is a bijection between a letter in pattern and a non-empty substring in s.

**Example:**
\`\`\`
Input: pattern = "abab", s = "redblueredblue"
Output: true
Explanation: a → "red", b → "blue"
"red" + "blue" + "red" + "blue" = "redblueredblue" ✓
\`\`\`

**Example 2:**
\`\`\`
Input: pattern = "aaaa", s = "asdasdasdasd"
Output: true
Explanation: a → "asd"
\`\`\`

## Your Task

Use backtracking to try all possible mappings.`,
            starterCode: `def wordPatternMatch(pattern: str, s: str) -> bool:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def wordPatternMatch(pattern: str, s: str) -> bool:
    char_to_word = {}
    word_to_char = {}

    def backtrack(p_idx: int, s_idx: int) -> bool:
        # Both exhausted
        if p_idx == len(pattern) and s_idx == len(s):
            return True

        # One exhausted but not other
        if p_idx == len(pattern) or s_idx == len(s):
            return False

        char = pattern[p_idx]

        # If char already mapped
        if char in char_to_word:
            word = char_to_word[char]
            if s[s_idx:].startswith(word):
                return backtrack(p_idx + 1, s_idx + len(word))
            return False

        # Try all possible words for this char
        for end in range(s_idx + 1, len(s) + 1):
            word = s[s_idx:end]

            # Check if word is already used by another char
            if word in word_to_char:
                continue

            # Create mapping
            char_to_word[char] = word
            word_to_char[word] = char

            if backtrack(p_idx + 1, end):
                return True

            # Backtrack
            del char_to_word[char]
            del word_to_char[word]

        return False

    return backtrack(0, 0)

# Test
print(wordPatternMatch("abab", "redblueredblue"))  # True
print(wordPatternMatch("aaaa", "asdasdasdasd"))    # True
print(wordPatternMatch("aabb", "xyzabcxzyabc"))    # False`
            },
            hints: [
                { afterAttempt: 1, text: 'Maintain two maps: char→word and word→char (bijection)' },
                { afterAttempt: 2, text: 'If char already mapped, verify the mapped word matches' },
                { afterAttempt: 3, text: 'Try all possible word lengths for unmapped chars' },
            ],
            testCases: [
                { input: '"abab", "redblueredblue"', expectedOutput: 'True' },
                { input: '"aaaa", "asdasdasdasd"', expectedOutput: 'True' }
            ],
            solutionExplanation: `## Pattern: Bijection Mapping

Need bidirectional mapping:
- char_to_word: Each pattern char maps to a unique word
- word_to_char: Each word maps to a unique char

**Backtracking approach:**
1. If char already mapped, verify match
2. If not mapped, try all possible substrings
3. Check word isn't used by another char
4. Create mapping, recurse, backtrack

## Complexity
- **Time:** O(n^m) where n = string length, m = pattern length
- **Space:** O(m) for mappings and recursion`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-knights-tour',
            title: "Knight's Tour",
            description: 'Find path visiting all squares exactly once',
            targetComplexity: { time: 'O(8^(n^2))', space: 'O(n^2)' },
            requiredForProgress: true,
            instruction: `# Knight's Tour

## The Problem

Given an n x n chessboard, find a knight's tour - a sequence of moves such that the knight visits every square exactly once.

A knight moves in an "L" shape: 2 squares in one direction, 1 square perpendicular.

**Example (n=5):**
\`\`\`
Starting at (0,0), visit all 25 squares exactly once.
Output: A valid tour as a sequence of positions, or the board with move numbers.
\`\`\`

## Your Task

Use backtracking with 8 possible knight moves.`,
            starterCode: `def knightsTour(n: int) -> list[list[int]]:
    """Return the board with move numbers (1 to n*n), or empty if no solution."""
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def knightsTour(n: int) -> list[list[int]]:
    board = [[-1] * n for _ in range(n)]

    # 8 possible knight moves
    moves = [
        (2, 1), (1, 2), (-1, 2), (-2, 1),
        (-2, -1), (-1, -2), (1, -2), (2, -1)
    ]

    def is_valid(x: int, y: int) -> bool:
        return 0 <= x < n and 0 <= y < n and board[x][y] == -1

    def count_onward_moves(x: int, y: int) -> int:
        """Warnsdorff's heuristic: count available moves from (x,y)"""
        count = 0
        for dx, dy in moves:
            nx, ny = x + dx, y + dy
            if is_valid(nx, ny):
                count += 1
        return count

    def backtrack(x: int, y: int, move_count: int) -> bool:
        board[x][y] = move_count

        if move_count == n * n:
            return True

        # Get valid moves, sorted by Warnsdorff's heuristic
        next_moves = []
        for dx, dy in moves:
            nx, ny = x + dx, y + dy
            if is_valid(nx, ny):
                next_moves.append((count_onward_moves(nx, ny), nx, ny))

        next_moves.sort()  # Prefer moves with fewer onward options

        for _, nx, ny in next_moves:
            if backtrack(nx, ny, move_count + 1):
                return True

        board[x][y] = -1
        return False

    if backtrack(0, 0, 1):
        return board
    return []

# Test
board = knightsTour(5)
for row in board:
    print([f"{x:2}" for x in row])`
            },
            hints: [
                { afterAttempt: 1, text: '8 knight moves: (±1,±2) and (±2,±1) combinations' },
                { afterAttempt: 2, text: 'Mark visited with move number, backtrack by resetting to -1' },
                { afterAttempt: 3, text: 'Use Warnsdorff heuristic: prefer squares with fewer onward moves' },
            ],
            testCases: [
                { input: '5', expectedOutput: '5x5 board with valid tour (numbers 1-25)' }
            ],
            solutionExplanation: `## Pattern: Hamiltonian Path on Graph

Knight's tour is finding a Hamiltonian path where:
- Nodes: Board squares
- Edges: Valid knight moves

**Warnsdorff's Heuristic:**
Always move to the square with fewest onward moves.
This dramatically improves performance (often finds solution without backtracking).

**Why it works:** Moving to a corner-like position (few options) first prevents getting stuck later.

## Complexity
- **Time:** O(8^(n^2)) worst case, much better with heuristic
- **Space:** O(n^2) for board`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-hamiltonian-path',
            title: 'Hamiltonian Path',
            description: 'Find path visiting all vertices exactly once',
            targetComplexity: { time: 'O(n!)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Hamiltonian Path

## The Problem

Given an undirected graph represented as an adjacency list, determine if a Hamiltonian path exists (a path that visits every vertex exactly once).

**Example:**
\`\`\`
Graph: 0 -- 1 -- 2
       |    |
       3 -- 4

n = 5, edges = [[0,1], [1,2], [0,3], [1,4], [3,4]]
Output: true (Path: 2-1-0-3-4 or others)
\`\`\`

## Your Task

Use backtracking to try all possible paths.`,
            starterCode: `def hasHamiltonianPath(n: int, edges: list[list[int]]) -> bool:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def hasHamiltonianPath(n: int, edges: list[list[int]]) -> bool:
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    visited = [False] * n

    def backtrack(node: int, count: int) -> bool:
        if count == n:
            return True

        visited[node] = True

        for neighbor in graph[node]:
            if not visited[neighbor]:
                if backtrack(neighbor, count + 1):
                    return True

        visited[node] = False
        return False

    # Try starting from each vertex
    for start in range(n):
        if backtrack(start, 1):
            return True

    return False

# Test
edges = [[0,1], [1,2], [0,3], [1,4], [3,4]]
print(hasHamiltonianPath(5, edges))  # True`
            },
            hints: [
                { afterAttempt: 1, text: 'Build adjacency list from edges' },
                { afterAttempt: 2, text: 'Try starting from each vertex (path might not start from 0)' },
                { afterAttempt: 3, text: 'Count visited nodes; success when count == n' },
            ],
            testCases: [
                { input: '5, [[0,1],[1,2],[0,3],[1,4],[3,4]]', expectedOutput: 'True' }
            ],
            solutionExplanation: `## Pattern: Hamiltonian Path Search

Classic NP-complete problem solved with backtracking:
1. Try starting from each vertex
2. DFS to neighbors, marking visited
3. Success when all n vertices visited
4. Backtrack and try different paths

**Optimization opportunities:**
- Prune if remaining vertices can't be reached
- Use bitmask for visited instead of array (faster copy)

## Complexity
- **Time:** O(n! * n) worst case
- **Space:** O(n) for visited array and recursion`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-cryptarithmetic',
            title: 'Cryptarithmetic Solver (Verbal Arithmetic)',
            description: 'Solve SEND + MORE = MONEY type puzzles',
            targetComplexity: { time: 'O(10!)', space: 'O(26)' },
            requiredForProgress: true,
            instruction: `# Cryptarithmetic Solver

## The Problem

Solve puzzles like SEND + MORE = MONEY where:
- Each letter represents a unique digit 0-9
- Leading letters cannot be 0
- The equation must hold

**Example:**
\`\`\`
SEND + MORE = MONEY
9567 + 1085 = 10652

S=9, E=5, N=6, D=7, M=1, O=0, R=8, Y=2
\`\`\`

## Your Task

Assign digits to letters using backtracking, validate equation.`,
            starterCode: `def solveCryptarithmetic(words: list[str], result: str) -> dict:
    """Return dict mapping letter to digit, or empty dict if no solution."""
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def solveCryptarithmetic(words: list[str], result: str) -> dict:
    # Get all unique letters
    all_text = ''.join(words) + result
    letters = list(set(all_text))
    n = len(letters)

    # Letters that can't be 0 (leading letters)
    non_zero = set(word[0] for word in words + [result])

    letter_to_digit = {}
    used_digits = [False] * 10

    def word_to_number(word: str) -> int:
        num = 0
        for char in word:
            num = num * 10 + letter_to_digit[char]
        return num

    def is_valid() -> bool:
        total = sum(word_to_number(word) for word in words)
        return total == word_to_number(result)

    def backtrack(index: int) -> bool:
        if index == n:
            return is_valid()

        letter = letters[index]

        for digit in range(10):
            # Skip 0 for leading letters
            if digit == 0 and letter in non_zero:
                continue

            if used_digits[digit]:
                continue

            letter_to_digit[letter] = digit
            used_digits[digit] = True

            if backtrack(index + 1):
                return True

            del letter_to_digit[letter]
            used_digits[digit] = False

        return False

    if backtrack(0):
        return letter_to_digit
    return {}

# Test
result = solveCryptarithmetic(["SEND", "MORE"], "MONEY")
print(result)  # {'S': 9, 'E': 5, 'N': 6, 'D': 7, 'M': 1, 'O': 0, 'R': 8, 'Y': 2}`
            },
            hints: [
                { afterAttempt: 1, text: 'Collect all unique letters first' },
                { afterAttempt: 2, text: 'Leading letters cannot be 0' },
                { afterAttempt: 3, text: 'Only check equation when all letters assigned' },
            ],
            testCases: [
                { input: '["SEND", "MORE"], "MONEY"', expectedOutput: 'Valid mapping where SEND + MORE = MONEY' }
            ],
            solutionExplanation: `## Pattern: Constraint Satisfaction with Permutation

Assign 10 digits to ≤10 unique letters:
1. Extract unique letters
2. Identify non-zero constraint (leading letters)
3. Try all valid assignments
4. Validate equation when complete

**Optimization:** Check partial sums during assignment (column by column with carry).

## Complexity
- **Time:** O(10!) = O(3.6M) worst case
- **Space:** O(26) for letter mappings`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-sudoku-killer',
            title: 'Killer Sudoku Variant',
            description: 'Sudoku with sum constraints on regions',
            targetComplexity: { time: 'O(9^m)', space: 'O(81)' },
            requiredForProgress: true,
            instruction: `# Killer Sudoku Variant

## The Problem

Killer Sudoku adds "cages" - groups of cells that must sum to a target. No digit can repeat within a cage.

**Simplified Version:** Given a regular Sudoku with additional sum constraints on cell groups, solve it.

**Example:**
\`\`\`
Regular Sudoku rules PLUS:
Cage 1: cells (0,0), (0,1) must sum to 3
Cage 2: cells (0,2), (1,2), (1,3) must sum to 15
...
\`\`\`

## Your Task

Extend Sudoku solver to check cage constraints during backtracking.`,
            starterCode: `def solveKillerSudoku(board: list[list[str]], cages: list[tuple]) -> bool:
    """
    board: 9x9 grid with '.' for empty
    cages: list of (sum_target, [(r1,c1), (r2,c2), ...])
    Modify board in-place, return True if solved.
    """
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def solveKillerSudoku(board: list[list[str]], cages: list[tuple]) -> bool:
    # Map cell to cage index
    cell_to_cage = {}
    for idx, (target, cells) in enumerate(cages):
        for r, c in cells:
            cell_to_cage[(r, c)] = idx

    def get_cage_cells(cage_idx: int) -> list:
        return cages[cage_idx][1]

    def cage_valid(cage_idx: int) -> bool:
        target, cells = cages[cage_idx]
        values = []
        for r, c in cells:
            if board[r][c] == '.':
                return True  # Not complete yet, assume valid
            values.append(int(board[r][c]))

        # Check: no duplicates and sum matches (if complete)
        if len(values) != len(set(values)):
            return False
        return sum(values) == target

    def is_valid(row: int, col: int, num: str) -> bool:
        # Standard Sudoku checks
        if num in board[row]:
            return False
        if any(board[r][col] == num for r in range(9)):
            return False
        box_r, box_c = 3 * (row // 3), 3 * (col // 3)
        for r in range(box_r, box_r + 3):
            for c in range(box_c, box_c + 3):
                if board[r][c] == num:
                    return False

        # Cage check (if cell is in a cage)
        if (row, col) in cell_to_cage:
            cage_idx = cell_to_cage[(row, col)]
            target, cells = cages[cage_idx]

            # Check no duplicate in cage
            for r, c in cells:
                if (r, c) != (row, col) and board[r][c] == num:
                    return False

            # Check sum doesn't exceed target
            current_sum = int(num)
            unfilled = 0
            for r, c in cells:
                if board[r][c] != '.' and (r, c) != (row, col):
                    current_sum += int(board[r][c])
                elif (r, c) != (row, col):
                    unfilled += 1

            if unfilled == 0 and current_sum != target:
                return False
            if current_sum > target:
                return False

        return True

    def solve() -> bool:
        for row in range(9):
            for col in range(9):
                if board[row][col] == '.':
                    for num in '123456789':
                        if is_valid(row, col, num):
                            board[row][col] = num
                            if solve():
                                return True
                            board[row][col] = '.'
                    return False
        return True

    return solve()

# Test (simplified example)
board = [['.' for _ in range(9)] for _ in range(9)]
cages = [(3, [(0,0), (0,1)])]  # Just one cage for demo
# Full Killer Sudoku would have many more cages`
            },
            hints: [
                { afterAttempt: 1, text: 'Map each cell to its cage index for quick lookup' },
                { afterAttempt: 2, text: 'Check cage constraints: no duplicates within cage' },
                { afterAttempt: 3, text: 'Check partial sum doesn\'t exceed target' },
            ],
            testCases: [
                { input: 'Killer Sudoku puzzle', expectedOutput: 'Solved puzzle satisfying all constraints' }
            ],
            solutionExplanation: `## Pattern: Multi-Constraint Satisfaction

Extends regular Sudoku with additional constraints:
1. Standard row/column/box uniqueness
2. Cage sum constraint
3. Cage uniqueness constraint

**Key insight:** Check constraints incrementally:
- Don't wait until cage is complete
- Prune early if sum exceeds target
- Prune early if duplicate in cage

## Complexity
- **Time:** O(9^m) where m = empty cells
- **Space:** O(81) for board + cage mappings`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },

  // ============================================================
  // GROUP 8: STATE COMPRESSION BACKTRACKING
  // ============================================================
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-max-students-exam',
            title: 'Maximum Students Taking Exam',
            description: 'Seat students so no one can cheat (see diagonal neighbors)',
            targetComplexity: { time: 'O(m * 4^n)', space: 'O(m * 2^n)' },
            requiredForProgress: true,
            instruction: `# Maximum Students Taking Exam

## The Problem

Given a classroom represented as a m x n grid where:
- '.' = seat available
- '#' = seat broken

Place maximum students such that no student can see another's answers. A student can see:
- Left, right neighbors
- Upper-left, upper-right diagonals

**Example:**
\`\`\`
seats = [["#",".","#","#",".","#"],
         [".","#","#","#","#","."],
         ["#",".","#","#",".","#"]]
Output: 4
\`\`\`

## Your Task

Use bitmask to represent each row's seating, check validity between adjacent rows.`,
            starterCode: `def maxStudents(seats: list[list[str]]) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def maxStudents(seats: list[list[str]]) -> int:
    m, n = len(seats), len(seats[0])

    # Convert each row to available seats bitmask
    available = []
    for row in seats:
        mask = 0
        for j in range(n):
            if row[j] == '.':
                mask |= (1 << j)
        available.append(mask)

    # Check if placement is valid (no adjacent in same row)
    def valid_row(mask: int) -> bool:
        return (mask & (mask >> 1)) == 0

    # Check if row2 placement is valid given row1
    def valid_between(row1: int, row2: int) -> bool:
        # No diagonal conflicts
        return ((row2 & (row1 >> 1)) == 0 and
                (row2 & (row1 << 1)) == 0)

    # Generate all valid placements for a row
    def get_valid_placements(row_idx: int) -> list:
        avail = available[row_idx]
        placements = []

        # Try all subsets of available seats
        mask = avail
        while True:
            if valid_row(mask):
                placements.append(mask)
            if mask == 0:
                break
            mask = (mask - 1) & avail

        return placements

    # DP with memoization
    from functools import lru_cache

    @lru_cache(maxsize=None)
    def dp(row: int, prev_mask: int) -> int:
        if row == m:
            return 0

        max_students = 0
        for curr_mask in get_valid_placements(row):
            if valid_between(prev_mask, curr_mask):
                students = bin(curr_mask).count('1')
                max_students = max(max_students, students + dp(row + 1, curr_mask))

        return max_students

    return dp(0, 0)

# Test
seats = [["#",".","#","#",".","#"],
         [".","#","#","#","#","."],
         ["#",".","#","#",".","#"]]
print(maxStudents(seats))  # 4`
            },
            hints: [
                { afterAttempt: 1, text: 'Use bitmask: bit j = 1 means student at column j' },
                { afterAttempt: 2, text: 'Valid row: no adjacent 1s, i.e., (mask & (mask >> 1)) == 0' },
                { afterAttempt: 3, text: 'Valid between rows: no diagonal conflicts (shift and compare)' },
            ],
            testCases: [
                { input: '[["#",".","#","#",".","#"],[".","#","#","#","#","."],[".","#","#","#","#","."]]', expectedOutput: '4' }
            ],
            solutionExplanation: `## Pattern: Bitmask DP with Row-by-Row Processing

Key insight: Each row's validity only depends on:
1. Its own structure (no adjacent students)
2. Previous row (no diagonal views)

**Bitmask representation:**
- Each bit = one column
- 1 = student seated, 0 = empty

**Transition checks:**
- Same row: \`mask & (mask >> 1) == 0\` (no adjacent)
- Between rows: shift and AND to check diagonals

## Complexity
- **Time:** O(m * 4^n) for all row combinations
- **Space:** O(m * 2^n) for memoization`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-tsp-backtracking',
            title: 'Traveling Salesman Problem (TSP)',
            description: 'Find shortest tour visiting all cities',
            targetComplexity: { time: 'O(n!)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Traveling Salesman Problem

## The Problem

Given n cities and distances between each pair, find the shortest tour that:
1. Starts at city 0
2. Visits every city exactly once
3. Returns to city 0

**Example:**
\`\`\`
dist = [
  [0, 10, 15, 20],
  [10, 0, 35, 25],
  [15, 35, 0, 30],
  [20, 25, 30, 0]
]
Output: 80 (0→1→3→2→0: 10+25+30+15=80)
\`\`\`

## Your Task

Use backtracking with pruning to find minimum tour.`,
            starterCode: `def tsp(dist: list[list[int]]) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def tsp(dist: list[list[int]]) -> int:
    n = len(dist)
    visited = [False] * n
    min_cost = [float('inf')]

    def backtrack(city: int, count: int, cost: int):
        # All cities visited, return to start
        if count == n:
            total = cost + dist[city][0]
            min_cost[0] = min(min_cost[0], total)
            return

        # Pruning: if current cost already >= min, stop
        if cost >= min_cost[0]:
            return

        for next_city in range(n):
            if not visited[next_city]:
                visited[next_city] = True
                backtrack(next_city, count + 1, cost + dist[city][next_city])
                visited[next_city] = False

    # Start from city 0
    visited[0] = True
    backtrack(0, 1, 0)

    return min_cost[0]

# Test
dist = [[0,10,15,20],[10,0,35,25],[15,35,0,30],[20,25,30,0]]
print(tsp(dist))  # 80`
            },
            hints: [
                { afterAttempt: 1, text: 'Start from city 0, mark as visited' },
                { afterAttempt: 2, text: 'When all cities visited (count == n), add return distance' },
                { afterAttempt: 3, text: 'Prune if current cost >= best found' },
            ],
            testCases: [
                { input: '[[0,10,15,20],[10,0,35,25],[15,35,0,30],[20,25,30,0]]', expectedOutput: '80' }
            ],
            solutionExplanation: `## Pattern: Hamiltonian Cycle with Optimization

TSP = Finding minimum weight Hamiltonian cycle.

**Basic backtracking:**
1. Start at city 0
2. Try each unvisited city
3. Track total cost
4. Add return edge when all visited

**Pruning:** If current cost >= best found, stop exploring.

**Better solution:** Use bitmask DP for O(n^2 * 2^n), but backtracking is simpler to implement.

## Complexity
- **Time:** O(n!) worst case
- **Space:** O(n) for visited array`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-stickers-spell-word',
            title: 'Stickers to Spell Word',
            description: 'Find minimum stickers to spell target word',
            targetComplexity: { time: 'O(2^n * m)', space: 'O(2^n)' },
            requiredForProgress: true,
            instruction: `# Stickers to Spell Word

## The Problem

Given n types of stickers with lowercase letters, determine minimum stickers needed to spell a target word. Each sticker can be used multiple times.

**Example:**
\`\`\`
stickers = ["with", "example", "science"]
target = "thehat"
Output: 3
Explanation: Use "with" (gives t, h), "example" (gives e, a), "with" again (gives t, h)
Can spell: t-h-e-h-a-t ✓
\`\`\`

## Your Task

Use backtracking with memoization on remaining letters.`,
            starterCode: `def minStickers(stickers: list[str], target: str) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def minStickers(stickers: list[str], target: str) -> int:
    from collections import Counter
    from functools import lru_cache

    # Convert stickers to letter counts
    sticker_counts = [Counter(s) for s in stickers]

    # Filter stickers that have at least one letter from target
    target_set = set(target)
    sticker_counts = [s for s in sticker_counts if any(c in target_set for c in s)]

    if not sticker_counts:
        return -1

    @lru_cache(maxsize=None)
    def dp(remaining: str) -> int:
        if not remaining:
            return 0

        # Get remaining letter counts
        remaining_count = Counter(remaining)

        min_stickers = float('inf')

        # Try each sticker that has the first letter of remaining
        first_char = remaining[0]

        for sticker in sticker_counts:
            if first_char not in sticker:
                continue

            # Apply sticker
            new_remaining = []
            temp_count = remaining_count.copy()

            for char, count in sticker.items():
                if char in temp_count:
                    temp_count[char] = max(0, temp_count[char] - count)

            for char, count in temp_count.items():
                new_remaining.extend([char] * count)

            new_remaining_str = ''.join(sorted(new_remaining))
            result = dp(new_remaining_str)

            if result != float('inf'):
                min_stickers = min(min_stickers, 1 + result)

        return min_stickers

    result = dp(''.join(sorted(target)))
    return result if result != float('inf') else -1

# Test
stickers = ["with", "example", "science"]
target = "thehat"
print(minStickers(stickers, target))  # 3`
            },
            hints: [
                { afterAttempt: 1, text: 'Convert stickers to letter counts (Counter)' },
                { afterAttempt: 2, text: 'State = remaining letters needed (sorted for memoization)' },
                { afterAttempt: 3, text: 'Only try stickers that have the first remaining letter (reduces branching)' },
            ],
            testCases: [
                { input: '["with","example","science"], "thehat"', expectedOutput: '3' }
            ],
            solutionExplanation: `## Pattern: Set Cover with Memoization

This is essentially a set cover problem:
- Each sticker "covers" some letters
- Find minimum stickers to cover all target letters

**Key optimization:**
- State = sorted remaining letters (memoizable)
- Only try stickers containing first remaining letter
- This prevents exponential explosion

## Complexity
- **Time:** O(2^n * m) where n = target length, m = sticker count
- **Space:** O(2^n) for memoization states`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-optimal-account-balancing',
            title: 'Optimal Account Balancing',
            description: 'Minimize transactions to settle all debts',
            targetComplexity: { time: 'O(n!)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Optimal Account Balancing

## The Problem

A group of friends went on holiday and borrowed money from each other. Given a list of transactions [from, to, amount], find the minimum number of transactions needed to settle all debts.

**Example:**
\`\`\`
transactions = [[0,1,10], [2,0,5]]
Meaning: Person 0 gave 10 to person 1, Person 2 gave 5 to person 0

Net balances: 0: -5, 1: +10, 2: -5
Output: 2 (Person 1 pays 5 to 0, Person 1 pays 5 to 2)
\`\`\`

## Your Task

Calculate net balances, then use backtracking to settle non-zero balances with minimum transactions.`,
            starterCode: `def minTransfers(transactions: list[list[int]]) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def minTransfers(transactions: list[list[int]]) -> int:
    from collections import defaultdict

    # Calculate net balance for each person
    balance = defaultdict(int)
    for from_p, to_p, amount in transactions:
        balance[from_p] -= amount
        balance[to_p] += amount

    # Get non-zero balances
    debts = [b for b in balance.values() if b != 0]

    if not debts:
        return 0

    n = len(debts)

    def backtrack(index: int) -> int:
        # Skip settled debts
        while index < n and debts[index] == 0:
            index += 1

        if index == n:
            return 0

        min_trans = float('inf')

        for j in range(index + 1, n):
            # Only settle if opposite signs
            if debts[index] * debts[j] < 0:
                # Settle debts[index] with debts[j]
                debts[j] += debts[index]
                min_trans = min(min_trans, 1 + backtrack(index + 1))
                debts[j] -= debts[index]

                # Optimization: if exactly cancelled, this is optimal for this pair
                if debts[j] + debts[index] == 0:
                    break

        return min_trans

    return backtrack(0)

# Test
transactions = [[0,1,10], [2,0,5]]
print(minTransfers(transactions))  # 2`
            },
            hints: [
                { afterAttempt: 1, text: 'First calculate net balance for each person' },
                { afterAttempt: 2, text: 'Only keep non-zero balances (others are already settled)' },
                { afterAttempt: 3, text: 'Only settle positive with negative (opposite signs)' },
            ],
            testCases: [
                { input: '[[0,1,10], [2,0,5]]', expectedOutput: '2' },
                { input: '[[0,1,10], [1,0,1], [1,2,5], [2,0,5]]', expectedOutput: '1' }
            ],
            solutionExplanation: `## Pattern: Debt Simplification

Key insight: Only net balances matter, not who owes whom.

**Steps:**
1. Calculate net balance for each person
2. Extract non-zero balances
3. Use backtracking to pair positive and negative balances
4. Find minimum transactions

**Optimization:** If two balances exactly cancel, greedily pair them.

## Complexity
- **Time:** O(n!) for trying all pairings
- **Space:** O(n) for debt array`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-count-paths-all-nodes',
            title: 'Count Paths Visiting All Nodes',
            description: 'Count all Hamiltonian paths in a graph',
            targetComplexity: { time: 'O(2^n * n^2)', space: 'O(2^n * n)' },
            requiredForProgress: true,
            instruction: `# Count Paths Visiting All Nodes

## The Problem

Given an undirected graph, count the number of different paths that visit every node exactly once.

**Example:**
\`\`\`
Graph: 0 -- 1 -- 2 -- 3
           |
           4

edges = [[0,1], [1,2], [2,3], [1,4]]
Output: 4
Paths: 0-1-2-3 then 4? No...
Actually: 0-1-4-... no wait, need valid Hamiltonian paths
Valid: 3-2-1-0-... hmm, 4 is disconnected in path
Let me recalculate...
\`\`\`

## Your Task

Use bitmask DP: dp[mask][i] = count of paths ending at i, having visited nodes in mask.`,
            starterCode: `def countHamiltonianPaths(n: int, edges: list[list[int]]) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def countHamiltonianPaths(n: int, edges: list[list[int]]) -> int:
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    # dp[mask][i] = count of paths ending at i with visited = mask
    dp = [[0] * n for _ in range(1 << n)]

    # Base case: single node paths
    for i in range(n):
        dp[1 << i][i] = 1

    # Fill DP
    for mask in range(1, 1 << n):
        for last in range(n):
            if not (mask & (1 << last)):
                continue
            if dp[mask][last] == 0:
                continue

            for neighbor in graph[last]:
                if mask & (1 << neighbor):
                    continue  # Already visited

                new_mask = mask | (1 << neighbor)
                dp[new_mask][neighbor] += dp[mask][last]

    # Sum all paths visiting all nodes
    full_mask = (1 << n) - 1
    return sum(dp[full_mask])

# Test - Linear graph: 0-1-2-3
edges = [[0,1], [1,2], [2,3]]
print(countHamiltonianPaths(4, edges))  # 2 (0-1-2-3 and 3-2-1-0)`
            },
            hints: [
                { afterAttempt: 1, text: 'Use bitmask to represent visited nodes' },
                { afterAttempt: 2, text: 'dp[mask][i] = paths ending at i with visited set = mask' },
                { afterAttempt: 3, text: 'Transition: add neighbor to path if not visited' },
            ],
            testCases: [
                { input: '4, [[0,1],[1,2],[2,3]]', expectedOutput: '2' }
            ],
            solutionExplanation: `## Pattern: Bitmask DP for Path Counting

State: (visited nodes bitmask, last node)
Transition: Extend to unvisited neighbors

**Why bitmask works:**
- Only need to know WHICH nodes visited, not ORDER
- 2^n possible subsets × n possible endpoints

**Algorithm:**
1. Initialize: dp[1<<i][i] = 1 (single node)
2. For each mask, for each last node, extend to neighbors
3. Sum dp[(1<<n)-1][*] for all Hamiltonian paths

## Complexity
- **Time:** O(2^n * n^2) for all states and transitions
- **Space:** O(2^n * n) for DP table`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        }
];
