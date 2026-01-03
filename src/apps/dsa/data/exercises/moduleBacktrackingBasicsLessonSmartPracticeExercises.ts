import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module10BacktrackingLessonSmartPracticeExercises: ExerciseSection[] = [
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
            instruction: `# Subsets - Step-by-Step Implementation

## The Problem

Generate all subsets of \`[1, 2]\`.

**Expected output:** \`[[], [1], [2], [1, 2]]\`

## The Tree

\`\`\`
                []
               /  \\
            [1]    []
           /  \\   /  \\
       [1,2] [1] [2]  []  ← Save these 4!
\`\`\`

## Your Task

Implement the backtracking solution using the 4-step template from the reading.`,
            starterCode: `def subsets(nums: list[int]) -> list[list[int]]:
    result = []

    def backtrack(path: list[int], index: int):
        pass

    backtrack([], 0)
    return result

# Test
print(subsets([1, 2]))`,
            solution: {
                afterAttempt: 3,
                text: `def subsets(nums: list[int]) -> list[list[int]]:
    result = []

    def backtrack(path: list[int], index: int):
        # STEP 1: Base case - reached a leaf
        if index == len(nums):
            result.append(path[:])  # COPY the path!
            return

        # STEP 2: Decision 1 - Include current element
        path.append(nums[index])
        backtrack(path, index + 1)
        path.pop()  # Undo!

        # STEP 3: Decision 2 - Skip current element
        backtrack(path, index + 1)

    backtrack([], 0)
    return result

# Test
print(subsets([1, 2]))  # [[], [1], [2], [1, 2]]

# The tree this code explores:
#         []
#        /  \\
#     [1]    []
#    /  \\   /  \\
#  [1,2][1][2]  []`
            },
            hints: [
                { afterAttempt: 1, text: 'Base case: Use path[:] to copy, not path!' },
                { afterAttempt: 2, text: 'Include: path.append(nums[index]) → backtrack(path, index+1) → path.pop()' },
                { afterAttempt: 3, text: 'Skip: backtrack(path, index+1) - no modification needed!' },
            ],
            testCases: [
                {
                    input: '[1, 2]',
                    expectedOutput: '[[], [1], [2], [1, 2]]'
                },
                {
                    input: '[1]',
                    expectedOutput: '[[], [1]]'
                }
            ],
            solutionExplanation: `## Time Complexity Analysis

**Time Complexity: O(2^n × n)**
- We generate 2^n subsets (each element can be included or excluded)
- For each subset, we copy the path which takes O(n) time
- Total: O(2^n) subsets × O(n) copy time = O(2^n × n)

**Space Complexity: O(n)**
- Recursion depth: O(n) for the call stack
- The path array: O(n) at maximum
- Output space is O(2^n × n) but typically not counted in auxiliary space

### Key Insight
Backtracking explores all possibilities. The time complexity is exponential (2^n) because we have 2 choices (include/exclude) for each of n elements.`,
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
    result = []

    def backtrack(path: list[int], used: list[bool]):
        pass

    backtrack([], [False] * len(nums))
    return result

# Test
print(permute([1, 2]))`,
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
            solutionExplanation: `## Time Complexity Analysis

**Time Complexity: O(n! × n)**
- We generate n! permutations (n choices for first position, n-1 for second, etc.)
- For each permutation, we copy the path which takes O(n) time
- Total: n! permutations × O(n) copy time = O(n! × n)

**Space Complexity: O(n)**
- Recursion depth: O(n) for the call stack
- The path array: O(n) at maximum
- The used array: O(n)

### Key Insight
Permutations have factorial time complexity (n!) because order matters. For n=10, that's 3.6 million permutations!`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-combinations',
            title: 'Combinations Implementation',
            description: 'Implement combinations using backtracking',
            targetComplexity: { time: 'O(C(n,k))', space: 'O(k)' },
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
    result = []

    def backtrack(path: list[int], start: int):
        pass

    backtrack([], 1)
    return result

# Test
print(combine(3, 2))`,
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
                    input: 'n=3, k=2',
                    expectedOutput: '[[1,2], [1,3], [2,3]]'
                }
            ],
            solutionExplanation: `## Time Complexity Analysis

**Time Complexity: O(C(n,k) × k)**
- We generate C(n,k) = n!/(k!(n-k)!) combinations
- For each combination, we copy the path which takes O(k) time
- Total: C(n,k) combinations × O(k) copy time = O(C(n,k) × k)

**Space Complexity: O(k)**
- Recursion depth: O(k) for the call stack
- The path array: O(k) at maximum

### Key Insight
Combinations are more efficient than permutations because order doesn't matter. For C(10,5) = 252, much less than 10! = 3.6M.`,
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
    result = []

    def backtrack(path: list[int], start: int, current_sum: int):
        pass

    backtrack([], 0, 0)
    return result

# Test
print(combinationSum([2, 3], 7))`,
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
                    input: 'candidates=[2,3], target=7',
                    expectedOutput: '[[2,2,3]]'
                }
            ],
            solutionExplanation: `## Time Complexity Analysis

**Time Complexity: O(2^t) where t = target/min(candidates)**
- The depth of recursion is at most target/min(candidates)
- At each level, we have up to n branches (number of candidates)
- In worst case, we explore 2^(target/min) paths
- This is approximate; actual complexity depends on pruning efficiency

**Space Complexity: O(t)**
- Recursion depth is proportional to target value
- The path array can grow up to target/min(candidates) in length

### Key Insight
Combination Sum has variable depth trees. Early pruning (when sum > target) significantly reduces the search space.`,
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
    board = [-1] * n
    count = [0]

    def is_valid(row: int, col: int) -> bool:
        pass

    def backtrack(row: int):
        pass

    backtrack(0)
    return count[0]

# Test
print(totalNQueens(4))`,
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
                    input: 'n=4',
                    expectedOutput: '2'
                }
            ],
            solutionExplanation: `## Time Complexity Analysis

**Time Complexity: O(n!)**
- In the worst case, we try placing queens in all possible positions
- First row: n choices, second row: ~(n-2) valid choices, etc.
- Heavy constraint checking prunes most branches early
- Actual runtime is much better than n! due to pruning

**Space Complexity: O(n)**
- Recursion depth: O(n) for n rows
- The board array: O(n)
- is_valid() uses O(n) iterations but no extra space

### Key Insight
N-Queens demonstrates the power of constraint-based pruning. Without pruning, we'd check n^n positions!`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        }
];
