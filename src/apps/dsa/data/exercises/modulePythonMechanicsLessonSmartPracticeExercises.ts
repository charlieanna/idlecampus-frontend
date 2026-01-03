import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module00a_PythonMechanicsLessonSmartPracticeExercises: ExerciseSection[] = [
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-list-references',
      title: 'Exercise: Fix the Bug',
      description: 'Fix a bug caused by list aliasing',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(n)', notes: 'Copying takes O(n)' },
      instruction: `# Fix the Bug

The following code tries to create a backup of the list, modify the original, and then verify the backup.
But it fails because of reference behavior.

**Fix it so \`backup\` remains unchanged!**`,
      starterCode: `def safe_modify(nums):
    backup = nums  # <--- BUG HERE
    
    # Modify original
    nums.append(999)
    
    return backup, nums`,
      solution: {
        afterAttempt: 2,
        text: `def safe_modify(nums):
    backup = nums[:]  # Fix: Make a copy
    
    # Modify original
    nums.append(999)
    
    return backup, nums`
      },
      testCases: [
        { input: '[1, 2, 3]', expectedOutput: '([1, 2, 3], [1, 2, 3, 999])' }
      ],
      hints: [
        { afterAttempt: 1, text: 'Use slicing [:] to create a copy.' }
      ],
      solutionExplanation: `## Solution

\`\`\`python
def safe_modify(nums):
    backup = nums[:]  # Copy!
    nums.append(999)
    return backup, nums
\`\`\`

Using \`backup = nums\` just creates another reference/label to the same list object.
Using \`backup = nums[:]\` creates a new list object with the same elements.`,
      difficulty: 'easy',
      timeLimit: 300,
      passingScore: 100
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-loops-sum',
      title: 'Exercise: Sum of Evens',
      description: 'Calculate sum of even numbers in a list',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Single pass' },
      instruction: `# Sum of Evens

Write a function that returns the sum of all even numbers in the list.

## Examples
\`\`\`python
sum_evens([1, 2, 3, 4]) # 2 + 4 = 6
sum_evens([1, 3, 5])    # 0
\`\`\``,
      starterCode: `def sum_evens(nums):
    # Your code here
    pass`,
      solution: {
        afterAttempt: 2,
        text: `def sum_evens(nums):
    total = 0
    for x in nums:
        if x % 2 == 0:
            total += x
    return total`
      },
      testCases: [
        { input: '[1, 2, 3, 4]', expectedOutput: '6' },
        { input: '[1, 3, 5]', expectedOutput: '0' }
      ],
      hints: [
        { afterAttempt: 1, text: 'Iterate with `for x in nums:`' },
        { afterAttempt: 2, text: 'Check if even with `if x % 2 == 0: `' }
      ],
      solutionExplanation: `## Solution

\`\`\`python
def sum_evens(nums):
    total = 0
    for x in nums:
        if x % 2 == 0:
            total += x
    return total
\`\`\`

Simple iteration. Time Complexity: O(n).`,
      difficulty: 'easy',
      timeLimit: 300,
      passingScore: 100
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-reverse-string',
      title: 'Exercise: Reverse String',
      description: 'Reverse a string manually',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(n)', notes: 'Building new string' },
      instruction: `# Reverse String

Return the reverse of the input string.

## Examples
\`\`\`python
reverse_str("hello") # "olleh"
\`\`\`

**Constraint:** Do not use \`s[::-1]\`. Implement it with a loop or list.`,
      starterCode: `def reverse_str(s):
    # Your code here
    pass`,
      solution: {
        afterAttempt: 2,
        text: `def reverse_str(s):
    res = []
    for i in range(len(s) - 1, -1, -1):
        res.append(s[i])
    return "".join(res)`
      },
      testCases: [
        { input: '"hello"', expectedOutput: '"olleh"' },
        { input: '"OpenAI"', expectedOutput: '"IAnepO"' }
      ],
      hints: [
        { afterAttempt: 1, text: 'Iterate backwards using range(len(s)-1, -1, -1)' },
        { afterAttempt: 2, text: 'Append to a list, then join.' }
      ],
      solutionExplanation: `## Solution

\`\`\`python
def reverse_str(s):
    res = []
    # Loop backwards
    for i in range(len(s) - 1, -1, -1):
        res.append(s[i])
    return "".join(res)
\`\`\`

**Why not string concatenation?**
Because strings are immutable, \`s += char\` creates a new string every time. That's O(n²). Using a list is O(n) for the output size.`,
      difficulty: 'easy',
      timeLimit: 300,
      passingScore: 100
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'mastery-matrix-sum',
      title: 'Grid Navigation (Matrix Sum)',
      description: 'Calculate the sum of all elements in a 2D grid',
      targetComplexity: { time: 'O(m*n)', space: 'O(1)', notes: 'Traverse grid' },
      requiredForProgress: true,
      metadata: { failureCategory: 'matrix-traversal' },
      instruction: `# Problem 1: Grid Navigation

Given a 2D list (matrix) of integers, return the sum of all elements.

Input:
[
  [1, 2],
  [3, 4]
]
Output: 10 (1+2+3+4)

---

## Constraints

- Input is a list of lists
- Matrix can be empty or have empty rows

## Explanation Required

After solving, explain: How would you modify this to sum only the **diagonal** elements (where row == col)?

---

## Starter Code

\`\`\`python
def matrix_sum(grid):
    # TODO
    pass
\`\`\``,
      starterCode: `def matrix_sum(grid):
    # TODO
    pass`,
      solution: {
        afterAttempt: 1,
        text: `def matrix_sum(grid):
    total = 0
    for row in grid:
        for val in row:
            total += val
    return total`
      },
      testCases: [
        { input: '[[1, 2], [3, 4]]', expectedOutput: '10' },
        { input: '[[5]]', expectedOutput: '5' },
        { input: '[]', expectedOutput: '0' }
      ],
      hints: [
        { afterAttempt: 1, text: 'Use nested loops: for row in grid: for val in row:' }
      ],
      solutionExplanation: `## Solution Explanation

\`\`\`python
def matrix_sum(grid):
    total = 0
    for row in grid:
        for val in row:
            total += val
    return total
\`\`\`

### Explanation (Required)
**How to sum diagonal elements?**
We would use indices:
\`\`\`python
for i in range(len(grid)):
    total += grid[i][i]
\`\`\`
This accesses elements where row index equals column index, which is the main diagonal.

### Complexity
* **Time:** O(R * C) where R=rows, C=cols. We visit every cell once.
* **Space:** O(1) - just an accumulator.`,
      difficulty: 'medium',
      timeLimit: 300,
      passingScore: 100
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'mastery-valid-palindrome',
      title: 'Two Pointers (Valid Palindrome)',
      description: 'Check if a string is a palindrome (simple version)',
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Two pointers' },
      requiredForProgress: true,
      metadata: { failureCategory: 'two-pointers-arrays' },
      instruction: `# Problem 2: Valid Palindrome (Simple)

Given a string \`s\`, return \`True\` if it is a palindrome, \`False\` otherwise.
Assume the string contains only lowercase English letters.

Input: "radar"
Output: True

Input: "hello"
Output: False

---

## Constraints

- O(n) Time
- O(1) Space (Don't create a reversed string!)

## Explanation Required

After solving, explain: Why is the space complexity O(1)? Why didn't we use \`s[::-1]\`?

---

## Starter Code

\`\`\`python
def is_palindrome(s):
    # Use two pointers
    pass
\`\`\``,
      starterCode: `def is_palindrome(s):
    # Use two pointers
    pass`,
      solution: {
        afterAttempt: 1,
        text: `def is_palindrome(s):
    left = 0
    right = len(s) - 1
    
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
        
    return True`
      },
      testCases: [
        { input: '"radar"', expectedOutput: 'True' },
        { input: '"hello"', expectedOutput: 'False' },
        { input: '"a"', expectedOutput: 'True' }
      ],
      hints: [
        { afterAttempt: 1, text: 'Initialize left=0, right=len(s)-1. Compare s[left] and s[right].' }
      ],
      solutionExplanation: `## Solution Explanation

\`\`\`python
def is_palindrome(s):
    left = 0
    right = len(s) - 1
    
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
        
    return True
\`\`\`

### Explanation (Required)
**Why is space O(1)?**
We only store two integer variables (\`left\` and \`right\`) regardless of the input size. We don't create new strings or lists.

**Why didn't we use \`s[::-1]\`?**
\`s[::-1]\` creates a **copy** of the string in reverse, which takes O(n) space. In interviews, solving this in O(1) space is often required!

### Complexity
* **Time:** O(n) - traverse half the string
* **Space:** O(1)`,
      difficulty: 'medium',
      timeLimit: 300,
      passingScore: 100
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'mastery-find-max',
      title: 'State Tracking (Find Max)',
      description: 'Find the maximum number in a list without using max()',
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Single pass' },
      requiredForProgress: true,
      metadata: { failureCategory: 'linear-scan' },
      instruction: `# Problem 3: Find Maximum

Find the maximum integer in a list, without using the built-in \`max()\` function.
Return \`None\` if list is empty.

Input: [1, 5, 2, 9, 3]
Output: 9

---

## Constraints

- O(n) Time
- Handle negative numbers correcty

## Explanation Required

After solving, explain: Why did you initialize \`current_max\` the way you did? Why is initializing it to 0 dangerous?

---

## Starter Code

\`\`\`python
def find_max(nums):
    # TODO
    pass
\`\`\``,
      starterCode: `def find_max(nums):
    # TODO
    pass`,
      solution: {
        afterAttempt: 1,
        text: `def find_max(nums):
    if not nums:
        return None
        
    current_max = nums[0]
    for x in nums:
        if x > current_max:
            current_max = x
            
    return current_max`
      },
      testCases: [
        { input: '[1, 5, 2, 9, 3]', expectedOutput: '9' },
        { input: '[-5, -1, -10]', expectedOutput: '-1' },
        { input: '[]', expectedOutput: 'None' }
      ],
      hints: [
        { afterAttempt: 1, text: 'Initialize current_max to nums[0] (if exists).' }
      ],
      solutionExplanation: `## Solution Explanation

\`\`\`python
def find_max(nums):
    if not nums:
        return None
        
    current_max = nums[0]
    for x in nums:
        if x > current_max:
            current_max = x
            
    return current_max
\`\`\`

### Explanation (Required)
**Why initialize to \`nums[0]\`?**
\`nums[0]\` is guaranteed to be a valid candidate.

**Why is initializing to 0 dangerous?**
If the list contains only negative numbers like \`[-5, -2, -10]\`, then 0 would be greater than all of them and we would incorrectly return 0, even though it's not in the list! Always initialize to the first element or \`-infinity\`.

### Complexity
* **Time:** O(n)
* **Space:** O(1)`,
      difficulty: 'medium',
      timeLimit: 300,
      passingScore: 100
    }
];
