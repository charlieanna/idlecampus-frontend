import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module1ArrayIterationLessonSmartPracticeExercises: ExerciseSection[] = [
  {
                        type: 'exercise',
                        placement: 'module',
                        id: 'exercise-valid-palindrome',
                        title: 'Code: Valid Palindrome',
                        description: 'Check if a string is a palindrome efficiently.',
                        targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Two pointers scan the string once while skipping non-alphanumeric characters' },
                        instruction: `# Valid Palindrome - Your First Challenge

Given a string, determine if it's a palindrome, considering only alphanumeric characters and ignoring cases.

## Examples

**Example 1:**
- Input: \`"A man, a plan, a canal: Panama"\`
- Output: \`true\`

**Example 2:**
- Input: \`"race a car"\`
- Output: \`false\`

## Constraints
- \`1 <= s.length <= 2 * 10^5\`
- \`s\` consists of printable ASCII characters

## Your Task

Solve this however you want! We'll analyze your solution together afterward.

**Questions to think about:**
- What's the simplest approach?
- Can you avoid creating extra data structures?
- How would you measure if it's slow?`,
                        starterCode: `def is_palindrome(s):
    pass`,
                        expectedOutput: `def is_palindrome(s):
    left, right = 0, len(s) - 1

    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1

        if s[left].lower() != s[right].lower():
            return False

        left += 1
        right -= 1

    return True`,
                        hints: [
                                {
                                        afterAttempt: 1,
                                        question: 'What would be the simplest way to check if a string equals its reverse?',
                                        thinkAbout: [
                                                'Could you create a reversed copy and compare? What would be the space complexity?',
                                                'Is there a way to check without creating a copy?',
                                                'What if you compared characters from both ends moving inward?'
                                        ]
                                },
                                {
                                        afterAttempt: 2,
                                        question: 'How do you handle non-alphanumeric characters efficiently?',
                                        thinkAbout: [
                                                'Should you filter them out first, or skip them during comparison?',
                                                'What happens to your space complexity if you create a filtered string?',
                                                'How can you skip invalid characters while comparing from both ends?'
                                        ]
                                },
                                {
                                        afterAttempt: 3,
                                        question: 'What variables do you need to track as you scan the string?',
                                        thinkAbout: [
                                                'You need two positions - one at each end. How do they move?',
                                                'When do you stop the comparison?',
                                                'How do you handle case sensitivity (\'A\' vs \'a\')?'
                                        ]
                                }
                        ],
                        solution: {
                                afterAttempt: 4,
                                text: `# Two Pointer Solution - O(n) time, O(1) space

def is_palindrome(s):
    left, right = 0, len(s) - 1

    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1

        if s[left].lower() != s[right].lower():
            return False

        left += 1
        right -= 1

    return True

	# Optimization: Using two indices from both ends eliminates need for reversed copy
	# Space: O(1) - no extra data structures`
                        },
                        testCases: [
                                // Basic examples
                                {
                                        'input': '\'A man, a plan, a canal: Panama\'',
                                        'expectedOutput': 'True'
                                },
                                {
                                        'input': '\'race a car\'',
                                        'expectedOutput': 'False'
                                },
                                // B - Boundaries
                                {
                                        'input': '\'\'',
                                        'expectedOutput': 'True'
                                },
                                {
                                        'input': '\'a\'',
                                        'expectedOutput': 'True'
                                },
                                {
                                        'input': '\'ab\'',
                                        'expectedOutput': 'False'
                                },
                                {
                                        'input': '\'aa\'',
                                        'expectedOutput': 'True'
                                },
                                // E - Empty/Near-empty
                                {
                                        'input': '\'   \'',
                                        'expectedOutput': 'True'
                                },
                                {
                                        'input': '\'.,,\'',
                                        'expectedOutput': 'True'
                                },
                                {
                                        'input': '\'!!!@#$%\'',
                                        'expectedOutput': 'True'
                                },
                                // D - Duplicates
                                {
                                        'input': '\'aaaa\'',
                                        'expectedOutput': 'True'
                                },
                                {
                                        'input': '\'aabaa\'',
                                        'expectedOutput': 'True'
                                },
                                // T - Types (mixed case, numbers)
                                {
                                        'input': '\'Aa\'',
                                        'expectedOutput': 'True'
                                },
                                {
                                        'input': '\'0P\'',
                                        'expectedOutput': 'False'
                                },
                                {
                                        'input': '\'12321\'',
                                        'expectedOutput': 'True'
                                },
                                {
                                        'input': '\'12345\'',
                                        'expectedOutput': 'False'
                                },
                                {
                                        'input': '\'A1b2B1a\'',
                                        'expectedOutput': 'True'
                                },
                                // I - Invalid-like (only non-alphanumeric)
                                {
                                        input: '".,;:!?"',
                                        expectedOutput: 'true'
                                },
                                // E - Extremes
                                {
                                        'input': '\'Was it a car or a cat I saw?\'',
                                        'expectedOutput': 'True'
                                },
                                {
                                        'input': '\'No lemon, no melon\'',
                                        'expectedOutput': 'True'
                                },
                                {
                                        'input': '\'ab_a\'',
                                        'expectedOutput': 'True'
                                },
                                {
                                        'input': '\'race car\'',
                                        'expectedOutput': 'True'
                                }
                        ],
                        solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Brute Force (Create Cleaned String)
\`\`\`python
def is_palindrome(s):
    # Clean: keep only alphanumeric, lowercase
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    # Reverse and compare
    return cleaned == cleaned[::-1]
\`\`\`
**Time: O(n)** | **Space: O(n)** - creates new string

---

### 🟡 Bottleneck Analysis
**What's inefficient?** We create TWO extra strings:
1. \`cleaned\` string (O(n) space)
2. \`cleaned[::-1]\` reversed string (O(n) space)

**Why it matters:** For a 1GB string, we'd use 3GB of memory!

---

### 🟢 Optimization: Two Pointers (No Extra Space)
**Key insight:** We don't need to store the cleaned string. We can compare characters directly from both ends!

\`\`\`python
def is_palindrome(s):
    left, right = 0, len(s) - 1

    while left < right:
        # Skip non-alphanumeric from left
        while left < right and not s[left].isalnum():
            left += 1
        # Skip non-alphanumeric from right
        while left < right and not s[right].isalnum():
            right -= 1

        # Compare characters
        if s[left].lower() != s[right].lower():
            return False

        left += 1
        right -= 1

    return True
\`\`\`

---

### ✅ Final Complexity
- **Time: O(n)** - each character visited at most once
- **Space: O(1)** - only two integer pointers

### 🎯 Pattern Learned
**"Compare from both ends"** → Use two pointers instead of creating copies
**Bottleneck removed:** Extra string storage`,
                        complexityQuizPlacement: 'after',
                        requiredForProgress: true
                },
  {
                        type: 'exercise',
                        placement: 'module',
                        id: 'exercise-move-zeroes',
                        title: 'Code: Move Zeroes',
                        description: 'Move all zeros to the end while maintaining order of non-zeros.',
                        targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Two-phase in-place partitioning of non-zeros and zeros' },
                        instruction: `# Move Zeroes - Optimization Challenge

Given an integer array \`nums\`, move all \`0\`'s to the end while maintaining the relative order of the non-zero elements.

**Note:** You must do this in-place without making a copy of the array.

## Examples

**Example 1:**
- Input: \`nums = [0,1,0,3,12]\`
- Output: \`[1,3,12,0,0]\`

**Example 2:**
- Input: \`nums = [0]\`
- Output: \`[0]\`

**Example 3:**
- Input: \`nums = [1,2,3]\`
- Output: \`[1,2,3]\`

## Constraints
- \`1 <= nums.length <= 10^4\`
- \`-2^31 <= nums[i] <= 2^31 - 1\`

## Your Task

Solve this in-place (O(1) space). Any working solution is a good start!

**Think about:**
- Can you do it in a single pass?
- Do you need to create a new array?
- How would you track which elements to keep?`,
                        starterCode: `def moveZeroes(nums):
    pass`,
                        expectedOutput: `def moveZeroes(nums):
    write = 0

    # Move all non-zeros to front
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write] = nums[read]
            write += 1

    # Fill rest with zeros
    while write < len(nums):
        nums[write] = 0
        write += 1

    return nums`,
                        hints: [
                                {
                                        afterAttempt: 1,
                                        question: 'How can you rearrange elements without losing track of where to place them?',
                                        thinkAbout: [
                                                'What if you use one pointer to read and another to write?',
                                                'Which elements should you focus on moving first - zeros or non-zeros?',
                                                'Can you maintain the relative order of non-zero elements?'
                                        ]
                                },
                                {
                                        afterAttempt: 2,
                                        question: 'After moving all non-zeros to the front, what needs to happen to the rest?',
                                        thinkAbout: [
                                                'How many positions are left after non-zeros?',
                                                'Can you fill remaining positions in a second pass?',
                                                'What\'s the relationship between write pointer position and array length?'
                                        ]
                                }
                        ],
                        solution: {
                                afterAttempt: 3,
                                text: `# Array Partitioning Solution - O(n) time, O(1) space

def moveZeroes(nums):
    write = 0

    # Phase 1: Move all non-zeros to front
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write] = nums[read]
            write += 1

    # Phase 2: Fill rest with zeros
    while write < len(nums):
        nums[write] = 0
        write += 1

    return nums

# Optimization: Using separate read and write indices for in-place modification
# Space: O(1) - no extra array needed`
                        },
                        testCases: [
                                // Basic examples
                                {
                                        'input': '[0, 1, 0, 3, 12]',
                                        'expectedOutput': '[1, 3, 12, 0, 0]'
                                },
                                // B - Boundaries
                                {
                                        'input': '[0]',
                                        'expectedOutput': '[0]'
                                },
                                {
                                        'input': '[1]',
                                        'expectedOutput': '[1]'
                                },
                                {
                                        'input': '[0, 1]',
                                        'expectedOutput': '[1, 0]'
                                },
                                {
                                        'input': '[1, 0]',
                                        'expectedOutput': '[1, 0]'
                                },
                                // E - Empty/All zeros
                                {
                                        'input': '[0, 0, 0]',
                                        'expectedOutput': '[0, 0, 0]'
                                },
                                {
                                        'input': '[0, 0, 0, 0, 0]',
                                        'expectedOutput': '[0, 0, 0, 0, 0]'
                                },
                                // D - Duplicates
                                {
                                        'input': '[1, 1, 0, 1]',
                                        'expectedOutput': '[1, 1, 1, 0]'
                                },
                                {
                                        'input': '[2, 2, 0, 0, 2]',
                                        'expectedOutput': '[2, 2, 2, 0, 0]'
                                },
                                // T - Types (negatives)
                                {
                                        'input': '[-1, 0, -2]',
                                        'expectedOutput': '[-1, -2, 0]'
                                },
                                {
                                        'input': '[0, -1, 0, -2, 0]',
                                        'expectedOutput': '[-1, -2, 0, 0, 0]'
                                },
                                {
                                        'input': '[-5, 0, 5, 0, -10]',
                                        'expectedOutput': '[-5, 5, -10, 0, 0]'
                                },
                                // E - Extremes
                                {
                                        'input': '[1, 2, 3]',
                                        'expectedOutput': '[1, 2, 3]'
                                },
                                {
                                        'input': '[0, 0, 1]',
                                        'expectedOutput': '[1, 0, 0]'
                                },
                                {
                                        'input': '[1, 0, 0]',
                                        'expectedOutput': '[1, 0, 0]'
                                },
                                {
                                        'input': '[2, 1, 0, 0, 3, 0, 4]',
                                        'expectedOutput': '[2, 1, 3, 4, 0, 0, 0]'
                                },
                                {
                                        'input': '[0, 1, 0, 2, 0, 3, 0]',
                                        'expectedOutput': '[1, 2, 3, 0, 0, 0, 0]'
                                },
                                {
                                        'input': '[1, 0, 2, 0, 3, 0, 4, 0]',
                                        'expectedOutput': '[1, 2, 3, 4, 0, 0, 0, 0]'
                                },
                                // M - Larger values
                                {
                                        'input': '[1000000, 0, -1000000]',
                                        'expectedOutput': '[1000000, -1000000, 0]'
                                }
                        ],
                        solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Create New Array
\`\`\`python
def moveZeroes(nums):
    result = []
    # Add all non-zeros
    for num in nums:
        if num != 0:
            result.append(num)
    # Add zeros
    result.extend([0] * (len(nums) - len(result)))
    return result
\`\`\`
**Time: O(n)** | **Space: O(n)** - creates new array

---

### 🟡 Bottleneck Analysis
**What's inefficient?** Creating a new array when we can modify in-place.
- Uses O(n) extra space
- Problem explicitly asks for in-place modification!

---

### 🟢 Optimization: Two-Pointer In-Place
**Key insight:** Use a "write" pointer to track where to place non-zeros!

\`\`\`python
def moveZeroes(nums):
    write = 0

    # Phase 1: Move all non-zeros to front
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write] = nums[read]
            write += 1

    # Phase 2: Fill rest with zeros
    while write < len(nums):
        nums[write] = 0
        write += 1
\`\`\`

---

### 🔵 Even Better: Single-Pass with Swap
\`\`\`python
def moveZeroes(nums):
    write = 0
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write], nums[read] = nums[read], nums[write]
            write += 1
\`\`\`
Same complexity but fewer writes when zeros are at the end!

---

### ✅ Final Complexity
- **Time: O(n)** - single pass through array
- **Space: O(1)** - in-place modification

### 🎯 Pattern Learned
**"Partition array by condition"** → Use read/write pointers
**Bottleneck removed:** Extra array storage`,
                        complexityQuizPlacement: 'after',
                        requiredForProgress: true
                },
  {
                        type: 'exercise',
                        placement: 'module',
                        id: 'exercise-max-sum-subarray',
                        title: 'Code: Maximum Sum Subarray of Size K (Fixed-Size Sliding Window)',
                        description: 'Find the maximum sum of k consecutive elements.',
                        targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Maintain running sum and update incrementally instead of recalculating for each subarray' },
                        instruction: `# Maximum Sum Subarray of Size K

Given an array of **positive integers** \`arr\` and an integer \`k\`, find the maximum sum of any contiguous subarray of size \`k\`.

## Examples

**Example 1:**
- Input: \`arr = [2, 1, 5, 1, 3, 2], k = 3\`
- Output: \`9\`
- Explanation: Subarray \`[5, 1, 3]\` has the maximum sum of 9.

**Example 2:**
- Input: \`arr = [2, 3, 4, 1, 5], k = 2\`
- Output: \`7\`
- Explanation: Subarray \`[3, 4]\` has the maximum sum of 7.

## Constraints
- \`1 <= arr.length <= 100,000\`
- \`1 <= k <= arr.length\`
- **All numbers are positive** (\`arr[i] > 0\`)

## Why "Positive Only" Matters

This constraint is **critical**. In interviews, always clarify this!

- **Positive only:** The window size is fixed at \`k\`. Simple problem.
- **With negatives:** The optimal subarray size could vary. Different problem entirely (Kadane's algorithm).

For now, we're solving the fixed-size window with positive numbers.

## Your Task

**Just make it work.** Use whatever approach comes to mind first.

Once you have a working solution, think about:
- What's the time complexity?
- Are you doing any repeated work?`,
                        starterCode: `def maxSumSubarray(arr, k):
    pass`,
                        expectedOutput: `def maxSumSubarray(arr, k):
    # Calculate first window
    window_sum = sum(arr[:k])
    max_sum = window_sum

    # Slide window
    for i in range(k, len(arr)):
        window_sum = window_sum - arr[i-k] + arr[i]
        max_sum = max(max_sum, window_sum)

    return max_sum`,
                        hints: [
                                {
                                        afterAttempt: 1,
                                        question: 'What\'s inefficient about recalculating the entire window sum each time?',
                                        thinkAbout: [
                                                'How much of the previous window overlaps with the next window?',
                                                'Can you reuse part of the previous calculation?',
                                                'What changes between consecutive windows of the same size?'
                                        ]
                                },
                                {
                                        afterAttempt: 2,
                                        question: 'When the window slides by one position, what gets added and what gets removed?',
                                        thinkAbout: [
                                                'Which element leaves the window on the left?',
                                                'Which new element enters on the right?',
                                                'Can you express new_sum in terms of old_sum plus/minus these elements?'
                                        ]
                                }
                        ],
                        solution: {
                                afterAttempt: 3,
                                text: `# Optimized Solution - O(n) time, O(1) space

def maxSumSubarray(arr, k):
    # Calculate sum of first k elements
    window_sum = sum(arr[:k])
    max_sum = window_sum

    # Update sum incrementally instead of recalculating
    for i in range(k, len(arr)):
        window_sum = window_sum - arr[i-k] + arr[i]
        max_sum = max(max_sum, window_sum)

    return max_sum

	# Optimization: Instead of recalculating sum of k elements each time (O(n×k)),
	# we update incrementally by removing left element and adding right element (O(n))`
                        },
                        testCases: [
                                // Basic examples
                                {
                                        'input': '[2, 1, 5, 1, 3, 2], 3',
                                        'expectedOutput': '9'
                                },
                                {
                                        'input': '[2, 3, 4, 1, 5], 2',
                                        'expectedOutput': '7'
                                },
                                // B - Boundaries
                                {
                                        'input': '[1], 1',
                                        'expectedOutput': '1'
                                },
                                {
                                        'input': '[1, 2], 1',
                                        'expectedOutput': '2'
                                },
                                {
                                        'input': '[1, 2], 2',
                                        'expectedOutput': '3'
                                },
                                {
                                        'input': '[1, 2, 3], 3',
                                        'expectedOutput': '6'
                                },
                                // E - Zeros
                                {
                                        'input': '[0, 0, 0], 2',
                                        'expectedOutput': '0'
                                },
                                {
                                        'input': '[0, 1, 0], 2',
                                        'expectedOutput': '1'
                                },
                                // D - Duplicates
                                {
                                        'input': '[5, 5, 5, 5], 2',
                                        'expectedOutput': '10'
                                },
                                {
                                        'input': '[3, 3, 3], 3',
                                        'expectedOutput': '9'
                                },
                                // T - Types (negatives)
                                {
                                        'input': '[-1, -2, -3], 2',
                                        'expectedOutput': '-3'
                                },
                                {
                                        'input': '[-5, -1, -3], 1',
                                        'expectedOutput': '-1'
                                },
                                {
                                        'input': '[-2, 5, -1, 7, -3], 2',
                                        'expectedOutput': '6'
                                },
                                {
                                        'input': '[1, -1, 1, -1, 1], 3',
                                        'expectedOutput': '1'
                                },
                                // E - Extremes
                                {
                                        'input': '[1, 2, 3, 4, 5], 2',
                                        'expectedOutput': '9'
                                },
                                {
                                        'input': '[5, 4, 3, 2, 1], 2',
                                        'expectedOutput': '9'
                                },
                                {
                                        'input': '[1, 4, 2, 10, 23, 3, 1, 0, 20], 4',
                                        'expectedOutput': '39'
                                },
                                {
                                        'input': '[1, 3, -1, -3, 5, 3, 6, 7], 3',
                                        'expectedOutput': '16'
                                },
                                // M - Larger values
                                {
                                        'input': '[10000, -10000, 10000], 2',
                                        'expectedOutput': '0'
                                },
                                {
                                        'input': '[100, 200, 300, 400], 2',
                                        'expectedOutput': '700'
                                }
                        ],
                        solutionExplanation: `## First: Understand the Input!

Before coding, **always clarify the constraints**. This problem has a critical one:

| Constraint | This Problem | Different Problem |
|------------|--------------|-------------------|
| Numbers | **Positive only** | Can be negative |
| Window size | **Fixed at k** | Variable (find best size) |
| Algorithm | Sliding Window | Kadane's Algorithm |

**Why it matters:** If you assume negatives are allowed, you might solve "Maximum Subarray" (variable size) instead of "Maximum Sum of Size K" (fixed size). Wrong problem = wrong solution.

**Interview tip:** Ask "Can the array contain negative numbers?" before writing any code.

---

## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Brute Force (Nested Loops)
\`\`\`python
def maxSumSubarray(arr, k):
    max_sum = float('-inf')
    for i in range(len(arr) - k + 1):
        current_sum = 0
        for j in range(i, i + k):  # Sum k elements
            current_sum += arr[j]
        max_sum = max(max_sum, current_sum)
    return max_sum
\`\`\`
**Time: O(n × k)** | **Space: O(1)**

For n=10,000 and k=1,000: 10 million operations!

---

### 🟡 Bottleneck Analysis

**What's inefficient?** Look at what happens with brute force on \`[1, 2, 3, 4, 5]\`, k=3:

\`\`\`
Window 1:
┌─────────────────────────┐
│  1  │  2  │  3  │  4  │  5  │
└─────────────────────────┘
   └──────┬──────┘
     sum these 3
     = 1 + 2 + 3 = 6

Window 2:
┌─────────────────────────┐
│  1  │  2  │  3  │  4  │  5  │
└─────────────────────────┘
        └──────┬──────┘
          sum these 3
          = 2 + 3 + 4 = 9

Window 3:
┌─────────────────────────┐
│  1  │  2  │  3  │  4  │  5  │
└─────────────────────────┘
             └──────┬──────┘
               sum these 3
               = 3 + 4 + 5 = 12
\`\`\`

**See the problem?**

\`\`\`
Window 1:  [1] + [2] + [3]        = 6
Window 2:       [2] + [3] + [4]   = 9
                 ↑─────↑
              We already added these!
\`\`\`

We're adding 2+3 again even though we just did it. With k=1000, we'd re-add 999 numbers!

---

### 🟢 The Fix: Sliding Window

**Key insight:** When the window slides by 1, only 2 things change:
- One element **leaves** (the leftmost)
- One element **enters** (the new rightmost)

\`\`\`
Window 1 → Window 2:

       REMOVE         KEEP           ADD
         ↓       ┌─────────────┐      ↓
┌─────────────────────────────────────────┐
│  1  │  2  │  3  │  4  │  5  │
└─────────────────────────────────────────┘
   ↑                          ↑
  old                        new

New sum = Old sum - removed + added
        = 6 - 1 + 4
        = 9 ✓
\`\`\`

**Instead of recalculating 3 numbers, we just do 2 operations!**

\`\`\`
Brute Force:     sum = 2 + 3 + 4           → 3 additions
Sliding Window:  sum = 6 - 1 + 4           → 1 subtraction + 1 addition
\`\`\`

---

### 🟢 The Code

\`\`\`python
def maxSumSubarray(arr, k):
    # Step 1: Calculate first window
    window_sum = sum(arr[:k])
    max_sum = window_sum

    # Step 2: Slide the window
    for i in range(k, len(arr)):
        window_sum = window_sum - arr[i-k] + arr[i]
        #            └─ remove left ─┘   └─ add right ─┘
        max_sum = max(max_sum, window_sum)

    return max_sum
\`\`\`

---

### ✅ Final Complexity
- **Time: O(n)** - each element added/removed once
- **Space: O(1)** - only tracking running sum

### 📊 Performance Improvement
| n | k | Brute Force | Sliding Window |
|---|---|-------------|----------------|
| 10,000 | 1,000 | 10,000,000 ops | 10,000 ops |

**1000x faster!**

### 🎯 Pattern Learned
**"Fixed-size window sum"** → Sliding window with incremental updates
**Bottleneck removed:** Redundant sum calculations`,
                        complexityQuizPlacement: 'after',
                        requiredForProgress: true
                },
  {
                        type: 'exercise',
                        placement: 'module',
                        id: 'exercise-sort-colors',
                        title: 'Code: Sort Colors (Dutch National Flag)',
                        description: 'Use 3-way partitioning to sort array with only 0s, 1s, and 2s.',
                        targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Dutch National Flag 3-way partition in a single pass' },
                        instruction: `# Sort Colors - Coding Exercise

Given an array \`nums\` with \`n\` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with colors in the order red, white, and blue.

We use the integers \`0\`, \`1\`, and \`2\` to represent red, white, and blue respectively.

**You must solve this without using the library's sort function.**

## Examples

**Example 1:**
- Input: \`nums = [2,0,2,1,1,0]\`
- Output: \`[0,0,1,1,2,2]\`

**Example 2:**
- Input: \`nums = [2,0,1]\`
- Output: \`[0,1,2]\`

**Example 3:**
- Input: \`nums = [0]\`
- Output: \`[0]\`

## Constraints
- \`n == nums.length\`
- \`1 <= n <= 300\`
- \`nums[i]\` is either \`0\`, \`1\`, or \`2\`

## Challenge
Solve in O(n) time and O(1) space with a single pass!`,
                        starterCode: `def sortColors(nums):
    pass`,
                        expectedOutput: `def sortColors(nums):
    low, mid, high = 0, 0, len(nums) - 1

    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:  # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1

    return nums`,
                        hints: [
                                {
                                        afterAttempt: 1,
                                        question: 'How can you partition an array into three regions in a single pass?',
                                        thinkAbout: [
                                                'This is the Dutch National Flag problem. Can you use 3 pointers to partition into [0s | 1s | 2s]?',
                                                'What happens when you swap elements with each pointer?',
                                                'Which pointer should you advance after each swap?'
                                        ]
                                },
                                {
                                        afterAttempt: 2,
                                        question: 'What should happen when you encounter each value (0, 1, or 2)?',
                                        thinkAbout: [
                                                'Use low, mid, high pointers. Swap 0s to low region, 2s to high region, and leave 1s in middle.',
                                                'Why do you need to check the swapped element when swapping with high?',
                                                'When should mid pointer advance?'
                                        ]
                                }
                        ],
                        solution: {
                                afterAttempt: 3,
                                text: `# Dutch National Flag - O(n) time, O(1) space

def sortColors(nums):
    low, mid, high = 0, 0, len(nums) - 1

    while mid <= high:
        if nums[mid] == 0:
            # Swap with low and advance both
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            # Already in correct region
            mid += 1
        else:  # nums[mid] == 2
            # Swap with high, don't advance mid (need to check swapped element)
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1

    return nums

# Optimization: Using three indices to partition array into three regions in-place
# Creates three regions: [0s | 1s | 2s]`
                        },
                        testCases: [
                                // Basic examples
                                {
                                        'input': '[2,0,2,1,1,0]',
                                        'expectedOutput': '[0,0,1,1,2,2]'
                                },
                                {
                                        'input': '[2,0,1]',
                                        'expectedOutput': '[0,1,2]'
                                },
                                // B - Boundaries
                                {
                                        'input': '[0]',
                                        'expectedOutput': '[0]'
                                },
                                {
                                        'input': '[1]',
                                        'expectedOutput': '[1]'
                                },
                                {
                                        'input': '[2]',
                                        'expectedOutput': '[2]'
                                },
                                {
                                        'input': '[0,1]',
                                        'expectedOutput': '[0,1]'
                                },
                                {
                                        'input': '[1,0]',
                                        'expectedOutput': '[0,1]'
                                },
                                {
                                        'input': '[2,1]',
                                        'expectedOutput': '[1,2]'
                                },
                                // D - Duplicates (all same)
                                {
                                        'input': '[0,0,0]',
                                        'expectedOutput': '[0,0,0]'
                                },
                                {
                                        'input': '[1,1,1]',
                                        'expectedOutput': '[1,1,1]'
                                },
                                {
                                        'input': '[2,2,2]',
                                        'expectedOutput': '[2,2,2]'
                                },
                                // E - Extremes (already sorted)
                                {
                                        'input': '[0,0,1,1,2,2]',
                                        'expectedOutput': '[0,0,1,1,2,2]'
                                },
                                {
                                        'input': '[0,1,2]',
                                        'expectedOutput': '[0,1,2]'
                                },
                                // E - Reverse sorted
                                {
                                        'input': '[2,2,1,1,0,0]',
                                        'expectedOutput': '[0,0,1,1,2,2]'
                                },
                                {
                                        'input': '[2,1,0]',
                                        'expectedOutput': '[0,1,2]'
                                },
                                // T - Only two values
                                {
                                        'input': '[0,0,1,1]',
                                        'expectedOutput': '[0,0,1,1]'
                                },
                                {
                                        'input': '[1,1,2,2]',
                                        'expectedOutput': '[1,1,2,2]'
                                },
                                {
                                        'input': '[0,0,2,2]',
                                        'expectedOutput': '[0,0,2,2]'
                                },
                                {
                                        'input': '[2,0,2,0]',
                                        'expectedOutput': '[0,0,2,2]'
                                },
                                // Complex cases
                                {
                                        'input': '[1,2,0]',
                                        'expectedOutput': '[0,1,2]'
                                },
                                {
                                        'input': '[0,2,1,2,0,1]',
                                        'expectedOutput': '[0,0,1,1,2,2]'
                                },
                                {
                                        'input': '[2,2,0,0,1,1,2,0,1]',
                                        'expectedOutput': '[0,0,0,1,1,1,2,2,2]'
                                }
                        ],
                        solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Use Built-in Sort
\`\`\`python
def sortColors(nums):
    nums.sort()
\`\`\`
**Time: O(n log n)** | **Space: O(1) or O(n)**

**Problem:** We only have 3 distinct values! Sorting is overkill.

---

### 🟡 Approach 2: Counting Sort (Two Passes)
\`\`\`python
def sortColors(nums):
    # Count each color
    count = [0, 0, 0]
    for num in nums:
        count[num] += 1

    # Overwrite array
    idx = 0
    for color in range(3):
        for _ in range(count[color]):
            nums[idx] = color
            idx += 1
\`\`\`
**Time: O(n)** | **Space: O(1)** (only 3 counters)

**Better, but can we do it in ONE pass?**

---

### 🟢 Optimal: Dutch National Flag (Single Pass)
**Key insight:** Maintain 3 regions using 3 pointers!

\`\`\`
[0...low-1] = 0s (red)
[low...mid-1] = 1s (white)
[mid...high] = unknown
[high+1...n-1] = 2s (blue)
\`\`\`

\`\`\`python
def sortColors(nums):
    low, mid, high = 0, 0, len(nums) - 1

    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:  # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
            # Don't increment mid! Need to check swapped value
\`\`\`

---

### 🧠 Why mid Doesn't Move After Swapping with High
When we swap with \`high\`:
- We got an unknown value from the right
- Must check it before moving on!

When we swap with \`low\`:
- \`low\` region only contains 0s and 1s (already processed)
- Safe to move \`mid\` forward

---

### ✅ Final Complexity
- **Time: O(n)** - single pass, each element moved at most once
- **Space: O(1)** - three pointers only

### 🎯 Pattern Learned
**"3-way partition"** → Dutch National Flag algorithm
**Classic application:** QuickSort's partition step`,
                        complexityQuizPlacement: 'after',
                        requiredForProgress: true
                },
  {
                        type: 'exercise',
                        placement: 'module',
                        id: 'exercise-find-all-duplicates',
                        title: 'Code: Find All Duplicates in an Array',
                        description: 'Find duplicates using in-place marking technique.',
                        instruction: `# Find All Duplicates in an Array (LC 442)

Given an integer array nums of length n where all integers are in the range [1, n] and each integer appears once or twice, return an array of all integers that appear twice.

**Constraint:** You must use O(1) extra space (excluding the output array).

## Examples

**Example 1:**
- Input: nums = [4,3,2,7,8,2,3,1]
- Output: [2,3]

**Example 2:**
- Input: nums = [1,1,2]
- Output: [1]

**Example 3:**
- Input: nums = [1]
- Output: []

## Key Insight
Since values are in range [1, n], use the value as an index and mark visited elements by negating!

## Constraints
- n == nums.length
- 1 <= n <= 10^5
- 1 <= nums[i] <= n`,
                        starterCode: `def findDuplicates(nums):
    # Hint: Mark visited by making value at index negative
    pass`,
                        expectedOutput: `def findDuplicates(nums):
    result = []

    for num in nums:
        index = abs(num) - 1  # Convert value to 0-indexed
        if nums[index] < 0:
            # Already seen - it's a duplicate!
            result.append(abs(num))
        else:
            # Mark as visited by negating
            nums[index] = -nums[index]

    return result`,
                        hints: [
                                {
                                        afterAttempt: 1,
                                        text: 'Values are 1 to n, indices are 0 to n-1. Map value v to index v-1.'
                                },
                                {
                                        afterAttempt: 2,
                                        text: 'When you see a number, negate the value at that index. If already negative, you found a duplicate!'
                                }
                        ],
                        solution: {
                                afterAttempt: 3,
                                text: `# In-Place Marking - O(n) time, O(1) space

def findDuplicates(nums):
    result = []

    for num in nums:
        # Get the index this number points to (0-indexed)
        index = abs(num) - 1

        if nums[index] < 0:
            # This index was already visited = duplicate!
            result.append(abs(num))
        else:
            # Mark as visited by making it negative
            nums[index] = -nums[index]

    return result

# Example walkthrough: [4,3,2,7,8,2,3,1]
# num=4: index=3, mark nums[3]=-7 → [4,3,2,-7,8,2,3,1]
# num=3: index=2, mark nums[2]=-2 → [4,3,-2,-7,8,2,3,1]
# num=-2: index=1, mark nums[1]=-3 → [4,-3,-2,-7,8,2,3,1]
# num=-7: index=6, mark nums[6]=-3 → [4,-3,-2,-7,8,2,-3,1]
# num=8: index=7, mark nums[7]=-1 → [4,-3,-2,-7,8,2,-3,-1]
# num=2: index=1, nums[1]<0 → DUPLICATE! Add 2
# num=-3: index=2, nums[2]<0 → DUPLICATE! Add 3
# num=-1: index=0, mark nums[0]=-4
# Result: [2, 3]`
                        },
                        targetComplexity: {
                                time: "O(n)",
                                space: "O(1)"
                        },
                        testCases: [
                                { 'input': '[4, 3, 2, 7, 8, 2, 3, 1]', 'expectedOutput': '[2, 3]' },
                                { 'input': '[1, 1, 2]', 'expectedOutput': '[1]' },
                                { 'input': '[1]', 'expectedOutput': '[]' },
                                { 'input': '[2, 2]', 'expectedOutput': '[2]' },
                                { 'input': '[1, 2, 3, 4, 5]', 'expectedOutput': '[]' },
                                { 'input': '[5, 4, 6, 7, 9, 3, 10, 9, 5, 6]', 'expectedOutput': '[9, 5, 6]' }
                        ],
                        solutionExplanation: `## The In-Place Marking Trick

### Key Insight
Since all values are in range [1, n], each value can serve as an index!

### Algorithm
1. For each number, compute index = |num| - 1
2. Check if nums[index] is negative (already visited)
3. If yes → duplicate found!
4. If no → mark as visited by negating: nums[index] *= -1

### Why Use Absolute Value?
Numbers might already be negative from previous marking, so always use abs(num).

### Time: O(n) | Space: O(1)
Single pass, no extra data structures!`,
                        complexityQuizPlacement: 'after',
                        requiredForProgress: false
                },
  {
                        type: 'exercise',
                        placement: 'module',
                        id: 'exercise-merge-intervals',
                        title: 'Code: Merge Intervals',
                        description: 'Merge all overlapping intervals using sort + single pass.',
                        targetComplexity: { time: 'O(n log n)', space: 'O(n)', notes: 'Sorting dominates; output array for merged intervals' },
                        instruction: `# Merge Intervals (LeetCode 56)

Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

## Examples

**Example 1:**
- Input: \`intervals = [[1,3],[2,6],[8,10],[15,18]]\`
- Output: \`[[1,6],[8,10],[15,18]]\`
- Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].

**Example 2:**
- Input: \`intervals = [[1,4],[4,5]]\`
- Output: \`[[1,5]]\`
- Explanation: Intervals [1,4] and [4,5] are considered overlapping (they touch at 4).

## Constraints
- \`1 <= intervals.length <= 10^4\`
- \`intervals[i].length == 2\`
- \`0 <= start_i <= end_i <= 10^4\``,
                        starterCode: `def merge(intervals):
    # Sort first, then merge overlapping intervals
    pass`,
                        expectedOutput: `def merge(intervals):
    if not intervals:
        return []
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        previous = merged[-1]
        
        # Check if current overlaps with previous
        if current[0] <= previous[1]:
            # Merge: extend the end of previous
            previous[1] = max(previous[1], current[1])
        else:
            # No overlap: add current as new interval
            merged.append(current)
    
    return merged`,
                        hints: [
                                { afterAttempt: 1, text: 'Sort intervals by start time first. This ensures you only need to check adjacent intervals for overlap.' },
                                { afterAttempt: 2, text: 'Two intervals overlap if current_start <= previous_end. When they overlap, merge by extending previous_end to max(previous_end, current_end).' },
                                { afterAttempt: 3, text: 'Keep a result list. For each interval, either merge with the last result or append as new.' }
                        ],
                        solution: {
                                afterAttempt: 4,
                                text: `## Solution - O(n log n) time, O(n) space

\`\`\`python
def merge(intervals):
    if not intervals:
        return []
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        previous = merged[-1]
        
        if current[0] <= previous[1]:
            # Overlap: extend end
            previous[1] = max(previous[1], current[1])
        else:
            # No overlap: new interval
            merged.append(current)
    
    return merged
\`\`\`

**Key insight:** Sorting by start time means you only compare each interval with the previous one.`
                        },
                        testCases: [
                                { input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
                                { input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]' },
                                { input: '[[1,4],[0,4]]', expectedOutput: '[[0,4]]' },
                                { input: '[[1,4],[2,3]]', expectedOutput: '[[1,4]]' }
                        ],
                        requiredForProgress: true,
                        solutionExplanation: `## The Brute-Force Instinct

Without thinking, you might try comparing every interval with every other interval:

\`\`\`python
def merge(intervals):
    # For each interval, check if it overlaps with any other
    # If overlap found, merge them and restart
    # Repeat until no more merges possible
    ...
\`\`\`

This approach has problems:
- Multiple passes needed as merges create new overlaps
- Tracking which intervals are "used" gets messy
- Worst case O(n²) or worse

---

## The Sorting Insight

Here's what changes everything: **sort by start time first**.

\`\`\`
Before: [[1,3], [8,10], [2,6], [15,18]]
After:  [[1,3], [2,6], [8,10], [15,18]]
\`\`\`

Now look at what happens:
- [1,3] and [2,6]: start of second (2) ≤ end of first (3) → **overlap!**
- [1,6] and [8,10]: start of second (8) > end of first (6) → **no overlap**
- [8,10] and [15,18]: start of second (15) > end of first (10) → **no overlap**

Once sorted, you only need to compare **adjacent** intervals!

---

## The Algorithm

\`\`\`python
def merge(intervals):
    if not intervals:
        return []
    
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        previous = merged[-1]
        
        if current[0] <= previous[1]:
            # Overlap: merge by extending end
            previous[1] = max(previous[1], current[1])
        else:
            # No overlap: start new interval
            merged.append(current)
    
    return merged
\`\`\`

---

## Why max(previous[1], current[1])?

Consider: [[1,6], [2,4]]

The second interval is completely inside the first! We need:
\`\`\`
merged_end = max(6, 4) = 6  ✓
\`\`\`

Not just \`current[1]\`, which would shrink the interval incorrectly.

---

## Complexity

- **Time:** O(n log n) for sorting, O(n) for the merge pass → O(n log n) total
- **Space:** O(n) for the output array (O(1) extra if we don't count output)

The sorting step is what makes this linear scan possible. Without it, you'd need nested comparisons.`
                },
  {
                        type: 'exercise',
                        placement: 'module',
                        id: 'exercise-insert-interval',
                        title: 'Code: Insert Interval',
                        description: 'Insert a new interval into a sorted list, merging if necessary.',
                        targetComplexity: { time: 'O(n)', space: 'O(n)', notes: 'Single pass; already sorted input' },
                        instruction: `# Insert Interval (LeetCode 57)

You are given an array of non-overlapping intervals \`intervals\` where \`intervals[i] = [start_i, end_i]\` represent the start and the end of the \`i-th\` interval and intervals is sorted in ascending order by \`start_i\`.

You are also given an interval \`newInterval = [start, end]\` that represents the start and end of another interval.

Insert \`newInterval\` into \`intervals\` such that \`intervals\` is still sorted in ascending order by \`start_i\` and \`intervals\` still does not have any overlapping intervals (merge overlapping intervals if necessary).

Return \`intervals\` after the insertion.

## Examples

**Example 1:**
- Input: \`intervals = [[1,3],[6,9]], newInterval = [2,5]\`
- Output: \`[[1,5],[6,9]]\`

**Example 2:**
- Input: \`intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]\`
- Output: \`[[1,2],[3,10],[12,16]]\`
- Explanation: The new interval [4,8] overlaps with [3,5],[6,7],[8,10].

## Constraints
- \`0 <= intervals.length <= 10^4\`
- \`intervals[i].length == 2\`
- \`0 <= start_i <= end_i <= 10^5\`
- intervals is sorted by \`start_i\` in ascending order
- \`newInterval.length == 2\`
- \`0 <= start <= end <= 10^5\``,
                        starterCode: `def insert(intervals, newInterval):
    # Intervals are already sorted
    # Find where newInterval fits and merge if needed
    pass`,
                        expectedOutput: `def insert(intervals, newInterval):
    result = []
    i = 0
    n = len(intervals)
    
    # Add all intervals that come before newInterval
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    
    # Merge all overlapping intervals with newInterval
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    result.append(newInterval)
    
    # Add all intervals that come after
    while i < n:
        result.append(intervals[i])
        i += 1
    
    return result`,
                        hints: [
                                { afterAttempt: 1, text: 'Since intervals are sorted, think of three phases: intervals before newInterval, intervals overlapping with newInterval, intervals after newInterval.' },
                                { afterAttempt: 2, text: 'Phase 1: Add intervals where interval_end < newInterval_start (completely before).' },
                                { afterAttempt: 3, text: 'Phase 2: Merge intervals where interval_start <= newInterval_end (overlapping). Update newInterval bounds.' }
                        ],
                        solution: {
                                afterAttempt: 4,
                                text: `## Solution - O(n) time, O(n) space

\`\`\`python
def insert(intervals, newInterval):
    result = []
    i = 0
    n = len(intervals)
    
    # Phase 1: Add intervals before newInterval
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    
    # Phase 2: Merge overlapping intervals
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    result.append(newInterval)
    
    # Phase 3: Add intervals after
    while i < n:
        result.append(intervals[i])
        i += 1
    
    return result
\`\`\`

**Key insight:** Three phases – before, overlapping, after – each handled by a simple while loop.`
                        },
                        testCases: [
                                { input: '[[1,3],[6,9]], [2,5]', expectedOutput: '[[1,5],[6,9]]' },
                                { input: '[[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]', expectedOutput: '[[1,2],[3,10],[12,16]]' },
                                { input: '[], [5,7]', expectedOutput: '[[5,7]]' },
                                { input: '[[1,5]], [2,3]', expectedOutput: '[[1,5]]' }
                        ],
                        requiredForProgress: true,
                        solutionExplanation: `## The Brute-Force Instinct

You might think: add the new interval to the list, sort, then merge like before:

\`\`\`python
def insert(intervals, newInterval):
    intervals.append(newInterval)
    intervals.sort(key=lambda x: x[0])
    return merge(intervals)  # reuse merge function
\`\`\`

This works but is O(n log n) due to sorting. Since the input is **already sorted**, we can do better!

---

## The O(n) Insight

Since intervals are sorted, we can process them in one pass with three phases:

**Phase 1:** Add all intervals that end **before** newInterval starts (no overlap possible)
\`\`\`
interval_end < newInterval_start → completely before
\`\`\`

**Phase 2:** Merge all intervals that **overlap** with newInterval
\`\`\`
interval_start <= newInterval_end → overlap exists
\`\`\`

**Phase 3:** Add all intervals that start **after** newInterval ends (no overlap possible)

---

## Walking Through an Example

\`\`\`
intervals = [[1,2], [3,5], [6,7], [8,10], [12,16]]
newInterval = [4,8]

Phase 1: interval_end < 4?
  [1,2]: 2 < 4? Yes → add to result
  [3,5]: 5 < 4? No → stop phase 1
  result = [[1,2]]

Phase 2: interval_start <= 8?
  [3,5]: 3 <= 8? Yes → merge: newInterval = [min(4,3), max(8,5)] = [3,8]
  [6,7]: 6 <= 8? Yes → merge: newInterval = [min(3,6), max(8,7)] = [3,8]
  [8,10]: 8 <= 8? Yes → merge: newInterval = [min(3,8), max(8,10)] = [3,10]
  [12,16]: 12 <= 10? No → stop phase 2
  Add merged newInterval: result = [[1,2], [3,10]]

Phase 3: Add remaining
  [12,16]: add to result
  result = [[1,2], [3,10], [12,16]]
\`\`\`

---

## The Clean Code

\`\`\`python
def insert(intervals, newInterval):
    result = []
    i = 0
    n = len(intervals)
    
    # Phase 1: Before
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    
    # Phase 2: Merge overlapping
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    result.append(newInterval)
    
    # Phase 3: After
    while i < n:
        result.append(intervals[i])
        i += 1
    
    return result
\`\`\`

O(n) time – single pass through the sorted intervals. No sorting needed!`
                }
];
