import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module7BinarySearchLessonSmartPracticeExercises: ExerciseSection[] = [
  {
                        type: 'exercise',
                        placement: 'module',
                        id: 'exercise-binary-search',
                        title: 'Code: Binary Search',
                        description: 'Implement binary search to find target in sorted array',
                        instruction: `# Binary Search

Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.

## Examples

**Example 1:**
\`\`\`
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 does not exist in nums so return -1
\`\`\`

## Constraints
- \`1 <= nums.length <= 10^4\`
- \`-10^4 < nums[i], target < 10^4\`
- All the integers in \`nums\` are unique
- \`nums\` is sorted in ascending order

**Time Complexity:** O(log n) - eliminate half the search space each step
**Space Complexity:** O(1) - constant extra space`,
                        starterCode: `def search(nums, target):
    pass`,
                        hints: [],
                        solutionExplanation: `## Time Complexity Analysis

**search(nums, target)**: O(log n)
- Each iteration halves the search space
- log₂(n) iterations maximum

---

### Why O(log n)? 🤔

Each step eliminates **half** the remaining elements:
- n → n/2 → n/4 → n/8 → ... → 1
- How many halvings? log₂(n)

For n = 1,000,000:
- log₂(1,000,000) ≈ 20 steps
- Only 20 comparisons to search 1 million elements!

---

### Comparison: Linear vs Binary Search

**Linear Search (Brute Force):**
\`\`\`python
complexityQuizPlacement: 'after',
for i in range(len(nums)):
    if nums[i] == target:
        return i
\`\`\`
Time: O(n) - check every element

**Binary Search:**
\`\`\`python
while left <= right:
    mid = left + (right - left) // 2
    # Eliminate half each time
\`\`\`
Time: O(log n) - divide and conquer

For n = 1,000,000:
- Linear: up to 1,000,000 comparisons
- Binary: only ~20 comparisons
- **50,000x faster!** 🚀

---

### Key Requirement

**Array must be sorted!**
- Unsorted array → can't eliminate halves
- Sorting first: O(n log n)
- Single search: O(log n)
- Multiple searches: sort once, search many times O(log n)`,
                        targetComplexity: {
                                time: "O(log n)",
                                space: "O(1)"
                        },
                        testCases: [
                                {
                                        'input': '[-1, 0, 3, 5, 9, 12], 9',
                                        'expectedOutput': '4'
                                },
                                {
                                        'input': '[-1, 0, 3, 5, 9, 12], 2',
                                        'expectedOutput': '-1'
                                },
                                {
                                        'input': '[1], 1',
                                        'expectedOutput': '0'
                                },
                                {
                                        'input': '[1], 0',
                                        'expectedOutput': '-1'
                                },
                                {
                                        'input': '[1, 2], 1',
                                        'expectedOutput': '0'
                                },
                                {
                                        'input': '[1, 2], 2',
                                        'expectedOutput': '1'
                                },
                                {
                                        'input': '[1, 3, 5, 7, 9], 5',
                                        'expectedOutput': '2'
                                },
                                {
                                        'input': '[2, 4, 6, 8, 10, 12, 14], 10',
                                        'expectedOutput': '4'
                                }
                        ],
                        solution: {
                                afterAttempt: 3,
                                text: `# Binary Search Solution - O(log n) time, O(1) space

\`\`\`python
def search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1
\`\`\`

# Key insight: Eliminate half the search space each iteration`
                        },
                        requiredForProgress: true
                },
  {
                        type: 'exercise',
                        placement: 'module',
                        id: 'exercise-first-last-position',
                        title: 'Code: Find First and Last Position',
                        description: 'Find the starting and ending position of a target value',
                        instruction: `# Find First and Last Position of Element in Sorted Array

Given an array of integers \`nums\` sorted in non-decreasing order, find the starting and ending position of a given \`target\` value.

If \`target\` is not found in the array, return \`[-1, -1]\`.

You must write an algorithm with \`O(log n)\` runtime complexity.

## Examples

**Example 1:**
\`\`\`
Input: nums = [5,7,7,8,8,10], target = 8
Output: [3,4]
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [5,7,7,8,8,10], target = 6
Output: [-1,-1]
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [], target = 0
Output: [-1,-1]
\`\`\`

## Constraints
- \`0 <= nums.length <= 10^5\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`nums\` is a non-decreasing array
- \`-10^9 <= target <= 10^9\`

**Time Complexity:** O(log n) - Two binary searches  
**Space Complexity:** O(1)

**Key Insight:**
Don't return immediately when finding target. Instead, save it as a potential answer and keep searching in the direction you need (left for first, right for last).`,
                        starterCode: `def searchRange(nums, target):
    pass`,
                        hints: [],
                        targetComplexity: {
                                time: "O(log n)",
                                space: "O(1)"
                        },
                        testCases: [
                                // Basic examples
                                {
                                        'input': '[5, 7, 7, 8, 8, 10], 8',
                                        'expectedOutput': '[3, 4]'
                                },
                                {
                                        'input': '[5, 7, 7, 8, 8, 10], 6',
                                        'expectedOutput': '[-1, -1]'
                                },
                                {
                                        'input': '[], 0',
                                        'expectedOutput': '[-1, -1]'
                                },
                                // B - Boundaries
                                {
                                        'input': '[1], 1',
                                        'expectedOutput': '[0, 0]'
                                },
                                {
                                        'input': '[1], 2',
                                        'expectedOutput': '[-1, -1]'
                                },
                                // E - Edge cases (single occurrence)
                                {
                                        'input': '[1, 2, 3], 2',
                                        'expectedOutput': '[1, 1]'
                                },
                                {
                                        'input': '[1, 2, 3], 1',
                                        'expectedOutput': '[0, 0]'
                                },
                                // D - Duplicates (many same values)
                                {
                                        'input': '[2, 2, 2, 2], 2',
                                        'expectedOutput': '[0, 3]'
                                },
                                {
                                        'input': '[1, 1, 1, 2, 3], 1',
                                        'expectedOutput': '[0, 2]'
                                },
                                // T - Type variations
                                {
                                        'input': '[1, 2, 3, 3, 3, 4, 5], 3',
                                        'expectedOutput': '[2, 4]'
                                },
                                // I - Interesting patterns
                                {
                                        'input': '[1, 2, 5, 5, 5, 5, 5, 9], 5',
                                        'expectedOutput': '[2, 6]'
                                },
                                {
                                        'input': '[1, 3, 5, 7, 9], 6',
                                        'expectedOutput': '[-1, -1]'
                                },
                                // M - Many elements
                                {
                                        'input': '[0, 0, 1, 1, 1, 2, 2, 3, 3], 1',
                                        'expectedOutput': '[2, 4]'
                                },
                                // E - Extremes
                                {
                                        'input': '[2, 2], 2',
                                        'expectedOutput': '[0, 1]'
                                }
                        ],
                        solution: {
                                afterAttempt: 3,
                                text: `# Find First and Last Position - O(log n) time, O(1) space

\`\`\`python
def searchRange(nums, target):
    def findFirst(nums, target):
        left, right = 0, len(nums) - 1
        result = -1
        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                result = mid
                right = mid - 1  # Keep searching left
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return result

    def findLast(nums, target):
        left, right = 0, len(nums) - 1
        result = -1
        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                result = mid
                left = mid + 1  # Keep searching right
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return result

    return [findFirst(nums, target), findLast(nums, target)]
\`\`\`

# Key insight: Run two binary searches - one to find first, one to find last`
                        },
                        solutionExplanation: `## Time Complexity Analysis

**searchRange(nums, target)**: O(log n)
- Two binary searches: O(log n) + O(log n) = O(log n)
- Each search halves the space independently

---

### The Key Trick: Don't Stop When Found! 🎯

**Standard binary search:** Return immediately when found
**This problem:** Save result and keep searching!

**Finding First Occurrence:**
\`\`\`python
if nums[mid] == target:
    result = mid
    right = mid - 1  # Keep searching LEFT for earlier occurrence
\`\`\`

**Finding Last Occurrence:**
\`\`\`python
if nums[mid] == target:
    result = mid
    left = mid + 1   # Keep searching RIGHT for later occurrence
\`\`\`

---

### Visual Example

\`\`\`
nums = [5, 7, 7, 8, 8, 8, 10], target = 8

Finding FIRST 8:
mid=3, nums[3]=8 ✓ → result=3, search left
mid=1, nums[1]=7 < 8 → search right
mid=2, nums[2]=7 < 8 → search right
→ First = 3

Finding LAST 8:
mid=3, nums[3]=8 ✓ → result=3, search right
mid=5, nums[5]=8 ✓ → result=5, search right
mid=6, nums[6]=10 > 8 → search left
→ Last = 5

Result: [3, 5] ✓
\`\`\`

---

### Why Two Searches?

Could we find both in one pass? Yes, but:
- More complex code
- Same O(log n) complexity
- Two clean searches is clearer and less error-prone

---

### Pattern Recognition 💡

This "find boundary" pattern appears in:
- Finding range of duplicates
- Counting occurrences: \`last - first + 1\`
- Lower/upper bound searches`,
                        requiredForProgress: true
                },
  {
                        type: 'exercise',
                        placement: 'module',
                        id: 'exercise-search-rotated-array',
                        title: 'Code: Search in Rotated Sorted Array',
                        description: 'Search for a target in a rotated sorted array',
                        instruction: `# Search in Rotated Sorted Array

There is an integer array \`nums\` sorted in ascending order (with distinct values).

Prior to being passed to your function, \`nums\` is possibly rotated at an unknown pivot index \`k\` (\`1 <= k < nums.length\`) such that the resulting array is \`[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]\` (0-indexed). For example, \`[0,1,2,4,5,6,7]\` might be rotated at pivot index 3 and become \`[4,5,6,7,0,1,2]\`.

Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.

You must write an algorithm with \`O(log n)\` runtime complexity.

## Examples

**Example 1:**
\`\`\`
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [4,5,6,7,0,1,2], target = 3
Output: -1
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [1], target = 0
Output: -1
\`\`\`

## Constraints
- \`1 <= nums.length <= 5000\`
- \`-10^4 <= nums[i] <= 10^4\`
- All values of \`nums\` are unique
- \`nums\` is an ascending array that is possibly rotated
- \`-10^4 <= target <= 10^4\`

**Time Complexity:** O(log n)  
**Space Complexity:** O(1)

**Key Insight:**
After rotation, one half is always sorted. Check which half is sorted, then determine if target is in that sorted range. This allows us to eliminate half the search space in each iteration, maintaining O(log n) time.`,
                        starterCode: `def search(nums, target):
    pass`,
                        hints: [],
                        targetComplexity: {
                                time: "O(log n)",
                                space: "O(1)"
                        },
                        testCases: [
                                // Basic examples
                                {
                                        'input': '[4, 5, 6, 7, 0, 1, 2], 0',
                                        'expectedOutput': '4'
                                },
                                {
                                        'input': '[4, 5, 6, 7, 0, 1, 2], 3',
                                        'expectedOutput': '-1'
                                },
                                {
                                        'input': '[1], 0',
                                        'expectedOutput': '-1'
                                },
                                // B - Boundaries (single element)
                                {
                                        'input': '[1], 1',
                                        'expectedOutput': '0'
                                },
                                {
                                        'input': '[2, 1], 1',
                                        'expectedOutput': '1'
                                },
                                {
                                        'input': '[2, 1], 2',
                                        'expectedOutput': '0'
                                },
                                // E - Edge cases (no rotation)
                                {
                                        'input': '[1, 2, 3, 4, 5], 3',
                                        'expectedOutput': '2'
                                },
                                {
                                        'input': '[1, 2, 3, 4, 5], 1',
                                        'expectedOutput': '0'
                                },
                                // D - Different rotations
                                {
                                        'input': '[3, 1], 3',
                                        'expectedOutput': '0'
                                },
                                {
                                        'input': '[5, 1, 3], 5',
                                        'expectedOutput': '0'
                                },
                                // T - Target in different halves
                                {
                                        'input': '[4, 5, 6, 7, 0, 1, 2], 6',
                                        'expectedOutput': '2'
                                },
                                {
                                        'input': '[4, 5, 6, 7, 0, 1, 2], 1',
                                        'expectedOutput': '5'
                                },
                                // I - Interesting patterns
                                {
                                        'input': '[3, 4, 5, 1, 2], 1',
                                        'expectedOutput': '3'
                                },
                                {
                                        'input': '[6, 7, 1, 2, 3, 4, 5], 4',
                                        'expectedOutput': '5'
                                },
                                // M - Many elements
                                {
                                        'input': '[8, 9, 10, 1, 2, 3, 4, 5, 6, 7], 3',
                                        'expectedOutput': '5'
                                },
                                // E - Extremes (not found)
                                {
                                        'input': '[2, 3, 4, 5, 1], 6',
                                        'expectedOutput': '-1'
                                }
                        ],
                        solution: {
                                afterAttempt: 3,
                                text: `# Search in Rotated Sorted Array - O(log n) time, O(1) space

\`\`\`python
def search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid

        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1
\`\`\`

# Key insight: One half is always sorted, check if target is in sorted half`
                        },
                        solutionExplanation: `## Time Complexity Analysis

**search(nums, target)**: O(log n)
- Each iteration eliminates half the search space
- Works despite the rotation!

---

### The Key Insight 🔑

**After rotation, ONE half is ALWAYS sorted!**

\`\`\`
[4, 5, 6, 7, 0, 1, 2]
 ↑        ↑        ↑
left     mid     right

Left half [4,5,6,7] is sorted (4 ≤ 7)
Right half [0,1,2] is also sorted, but rotation point is between
\`\`\`

---

### Decision Tree

\`\`\`
1. Is nums[left] <= nums[mid]?  (Left half sorted)
   ├── YES: Is target in [nums[left], nums[mid])?
   │        ├── YES: search left half
   │        └── NO: search right half
   └── NO: (Right half sorted)
            Is target in (nums[mid], nums[right]]?
            ├── YES: search right half
            └── NO: search left half
\`\`\`

---

### Visual Walkthrough

\`\`\`
nums = [4, 5, 6, 7, 0, 1, 2], target = 0

Step 1: left=0, right=6, mid=3
  nums[left]=4 <= nums[mid]=7 → left half sorted
  Is 4 <= 0 < 7? NO → search right
  left = 4

Step 2: left=4, right=6, mid=5
  nums[left]=0 <= nums[mid]=1 → left half sorted
  Is 0 <= 0 < 1? YES → search left
  right = 4

Step 3: left=4, right=4, mid=4
  nums[4] = 0 = target ✓

Return 4
\`\`\`

---

### Common Mistake ⚠️

**Don't forget the equals sign!**

\`\`\`python
if nums[left] <= nums[mid]:  # Use <=, not <
\`\`\`

When \`left == mid\` (2 elements), left half is "sorted" (single element).

---

### Why This Works

Rotation creates exactly ONE "break point" where order is disrupted. By identifying which half is sorted, we can:
1. Check if target is in that sorted range
2. Eliminate half the array each step
3. Maintain O(log n) even with rotation!`,
                        requiredForProgress: true
                },
  {
                        type: 'exercise',
                        placement: 'module',
                        id: 'exercise-koko-eating-bananas',
                        title: 'Code: Koko Eating Bananas',
                        description: 'Binary search on answer space to find minimum eating speed.',
                        instruction: `# Koko Eating Bananas (LC 875)

Koko loves to eat bananas. There are n piles of bananas, the ith pile has piles[i] bananas. The guards have gone and will come back in h hours.

Koko can decide her bananas-per-hour eating speed of k. Each hour, she chooses some pile and eats k bananas from it. If the pile has less than k bananas, she eats all of them and will not eat any more bananas during this hour.

Return the minimum integer k such that she can eat all the bananas within h hours.

## Examples

**Example 1:**
- Input: piles = [3,6,7,11], h = 8
- Output: 4

**Example 2:**
- Input: piles = [30,11,23,4,20], h = 5
- Output: 30

**Example 3:**
- Input: piles = [30,11,23,4,20], h = 6
- Output: 23

## Key Insight
Binary search on the answer (eating speed k). For each speed, check if Koko can finish in h hours.

## Constraints
- 1 <= piles.length <= 10^4
- piles.length <= h <= 10^9
- 1 <= piles[i] <= 10^9`,
                        starterCode: `def minEatingSpeed(piles, h):
    # Hint: Binary search on eating speed k
    # For each k, calculate total hours needed
    pass`,
                        expectedOutput: `import math

def minEatingSpeed(piles, h):
    def canFinish(speed):
        hours = 0
        for pile in piles:
            hours += math.ceil(pile / speed)
        return hours <= h

    left = 1
    right = max(piles)

    while left <= right:
        mid = left + (right - left) // 2
        if canFinish(mid):
            right = mid - 1  # Try smaller speed
        else:
            left = mid + 1  # Need faster speed

    return left`,
                        hints: [
                                {
                                        afterAttempt: 1,
                                        text: 'The answer (speed k) is between 1 and max(piles). Binary search this range!'
                                },
                                {
                                        afterAttempt: 2,
                                        text: 'For each speed k, calculate hours needed: sum of ceil(pile/k) for each pile. If hours <= h, try a smaller k. Otherwise, try larger k.'
                                }
                        ],
                        solution: {
                                afterAttempt: 3,
                                text: `# Binary Search on Answer - O(n log m) time

import math

def minEatingSpeed(piles, h):
    def canFinish(speed):
        """Check if Koko can finish at this speed in h hours"""
        hours = 0
        for pile in piles:
            hours += math.ceil(pile / speed)
            # Or: hours += (pile + speed - 1) // speed
        return hours <= h

    # Search range: 1 to max(piles)
    left = 1
    right = max(piles)

    while left <= right:
        mid = left + (right - left) // 2
        if canFinish(mid):
            right = mid - 1  # Can finish, try slower
        else:
            left = mid + 1  # Can't finish, need faster

    return left

# Example: piles = [3,6,7,11], h = 8
# k=4: ceil(3/4) + ceil(6/4) + ceil(7/4) + ceil(11/4)
#    = 1 + 2 + 2 + 3 = 8 hours ✓
# k=3: 1 + 2 + 3 + 4 = 10 hours ✗
# Answer: 4`
                        },
                        targetComplexity: {
                                time: "O(n log m)",
                                space: "O(1)"
                        },
                        testCases: [
                                { 'input': '[3, 6, 7, 11], 8', 'expectedOutput': '4' },
                                { 'input': '[30, 11, 23, 4, 20], 5', 'expectedOutput': '30' },
                                { 'input': '[30, 11, 23, 4, 20], 6', 'expectedOutput': '23' },
                                { 'input': '[1, 1, 1, 999999999], 10', 'expectedOutput': '142857143' },
                                { 'input': '[312884470], 312884469', 'expectedOutput': '2' }
                        ],
                        solutionExplanation: `## Binary Search on Answer Space

### The Pattern
1. **Answer range:** speed k from 1 to max(piles)
2. **Feasibility check:** Can Koko finish at speed k in h hours?
3. **Binary search:** Find minimum feasible speed

### Why Binary Search Works
- If Koko can finish at speed k, she can also finish at k+1, k+2, etc.
- We want the MINIMUM k that works
- This is a "find first true" pattern

### Time Complexity
- O(n) per feasibility check
- O(log m) binary search iterations (m = max pile)
- Total: O(n log m)

### Similar Problems
- Capacity to Ship Packages (LC 1011)
- Split Array Largest Sum (LC 410)
- Minimum Number of Days to Make m Bouquets (LC 1482)`,
                        requiredForProgress: false
                },

  // ============================================================================
  // GROUP 1: Direct Binary Search on Index (Additional)
  // ============================================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-count-occurrences',
    title: 'Count Occurrences in Sorted Array',
    description: 'Count how many times target appears using binary search',
    targetComplexity: { time: 'O(log n)', space: 'O(1)' },
    instruction: `# Count Occurrences

Given a sorted array \`nums\` (may contain duplicates), return how many times \`target\` appears.

## Examples

\`\`\`
Input: nums = [1,2,2,2,3,4], target = 2
Output: 3

Input: nums = [1,2,3,4,5], target = 6
Output: 0
\`\`\`

## Constraints

- 0 <= nums.length <= 10^5
- Array is sorted in ascending order

## Hidden Insight

You already know how to find first and last occurrence. What's count in terms of those?`,
    starterCode: `def countOccurrences(nums, target):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Find first occurrence and last occurrence separately.' },
      { afterAttempt: 2, text: 'If target exists, count = last - first + 1.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def countOccurrences(nums, target):
    def findFirst():
        left, right = 0, len(nums) - 1
        result = -1
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                result = mid
                right = mid - 1
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return result

    def findLast():
        left, right = 0, len(nums) - 1
        result = -1
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                result = mid
                left = mid + 1
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return result

    first = findFirst()
    if first == -1:
        return 0
    return findLast() - first + 1`
    },
    solutionExplanation: `## Combining First + Last

Once you have first and last indices:
- count = last - first + 1

Two O(log n) searches = O(log n) total.`,
    testCases: [
      { input: '[1,2,2,2,3,4], 2', expectedOutput: '3' },
      { input: '[1,2,3,4,5], 6', expectedOutput: '0' },
      { input: '[2,2,2,2,2], 2', expectedOutput: '5' },
      { input: '[1], 1', expectedOutput: '1' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-insert-position',
    title: 'Search Insert Position',
    description: 'Find index where target should be inserted',
    targetComplexity: { time: 'O(log n)', space: 'O(1)' },
    instruction: `# Search Insert Position (LeetCode 35)

Given a sorted array and a target value, return the index where target should be inserted to maintain sorted order.

If target exists, return its index.

## Examples

\`\`\`
Input: nums = [1,3,5,6], target = 5
Output: 2

Input: nums = [1,3,5,6], target = 2
Output: 1

Input: nums = [1,3,5,6], target = 7
Output: 4
\`\`\`

## Constraints

- 1 <= nums.length <= 10^4
- No duplicates in nums

## Hidden Insight

This is finding the "lower bound" - smallest index where nums[i] >= target.`,
    starterCode: `def searchInsert(nums, target):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Binary search, but what do you return when not found?' },
      { afterAttempt: 2, text: 'When loop ends with left > right, left is the insert position.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def searchInsert(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return left  # Insert position`
    },
    solutionExplanation: `## Lower Bound Pattern

When target not found, \`left\` points to first element > target.

This is exactly where we'd insert to maintain order.`,
    testCases: [
      { input: '[1,3,5,6], 5', expectedOutput: '2' },
      { input: '[1,3,5,6], 2', expectedOutput: '1' },
      { input: '[1,3,5,6], 7', expectedOutput: '4' },
      { input: '[1,3,5,6], 0', expectedOutput: '0' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-lower-bound',
    title: 'Lower Bound Query',
    description: 'Find smallest index where nums[i] >= x',
    targetComplexity: { time: 'O(log n)', space: 'O(1)' },
    instruction: `# Lower Bound

Return the smallest index \`i\` such that \`nums[i] >= x\`.

If no such index exists, return \`len(nums)\`.

## Examples

\`\`\`
Input: nums = [1,2,4,4,5,6], x = 4
Output: 2 (first index where value >= 4)

Input: nums = [1,2,4,4,5,6], x = 3
Output: 2 (first index where value >= 3, which is 4)

Input: nums = [1,2,3], x = 5
Output: 3 (no value >= 5, return length)
\`\`\`

## Constraints

- Array is sorted
- May contain duplicates`,
    starterCode: `def lowerBound(nums, x):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Binary search for first position where nums[mid] >= x.' },
      { afterAttempt: 2, text: 'When nums[mid] >= x, save result and search left for earlier occurrence.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def lowerBound(nums, x):
    left, right = 0, len(nums)

    while left < right:
        mid = (left + right) // 2
        if nums[mid] >= x:
            right = mid  # Could be answer, search left
        else:
            left = mid + 1

    return left`
    },
    solutionExplanation: `## Lower Bound Template

This is the "bisect_left" pattern.

Key: when nums[mid] >= x, mid could be the answer but there might be smaller valid indices.`,
    testCases: [
      { input: '[1,2,4,4,5,6], 4', expectedOutput: '2' },
      { input: '[1,2,4,4,5,6], 3', expectedOutput: '2' },
      { input: '[1,2,3], 5', expectedOutput: '3' },
      { input: '[2,2,2], 2', expectedOutput: '0' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-upper-bound',
    title: 'Upper Bound Query',
    description: 'Find smallest index where nums[i] > x',
    targetComplexity: { time: 'O(log n)', space: 'O(1)' },
    instruction: `# Upper Bound

Return the smallest index \`i\` such that \`nums[i] > x\`.

If no such index exists, return \`len(nums)\`.

## Examples

\`\`\`
Input: nums = [1,2,4,4,5,6], x = 4
Output: 4 (first index where value > 4, which is 5)

Input: nums = [1,2,4,4,5,6], x = 3
Output: 2 (first index where value > 3, which is 4)

Input: nums = [1,2,3], x = 5
Output: 3 (no value > 5)
\`\`\`

## Hidden Insight

How is this different from lower bound? Just change >= to >.`,
    starterCode: `def upperBound(nums, x):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Same as lower bound, but search for nums[mid] > x.' }
    ],
    solution: {
      afterAttempt: 1,
      text: `def upperBound(nums, x):
    left, right = 0, len(nums)

    while left < right:
        mid = (left + right) // 2
        if nums[mid] > x:  # Changed from >=
            right = mid
        else:
            left = mid + 1

    return left`
    },
    solutionExplanation: `## Upper Bound Template

This is the "bisect_right" pattern.

The ONLY difference from lower bound: \`>\` instead of \`>=\`.`,
    testCases: [
      { input: '[1,2,4,4,5,6], 4', expectedOutput: '4' },
      { input: '[1,2,4,4,5,6], 3', expectedOutput: '2' },
      { input: '[1,2,3], 5', expectedOutput: '3' },
      { input: '[2,2,2], 2', expectedOutput: '3' }
    ],
    requiredForProgress: true
  },

  // ============================================================================
  // GROUP 2: Binary Search on Answer (Monotonic Predicate)
  // ============================================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-ship-packages',
    title: 'Minimum Capacity to Ship Packages',
    description: 'Find minimum ship capacity to deliver all packages in D days',
    targetComplexity: { time: 'O(n log m)', space: 'O(1)' },
    instruction: `# Capacity To Ship Packages Within D Days (LeetCode 1011)

A conveyor belt has packages that must be shipped within \`days\` days.

The i-th package weighs \`weights[i]\`. Packages must be shipped in order.

Find the **minimum** ship capacity to ship all packages within \`days\` days.

## Examples

\`\`\`
Input: weights = [1,2,3,4,5,6,7,8,9,10], days = 5
Output: 15

Explanation:
Day 1: 1,2,3,4,5 (sum=15)
Day 2: 6,7 (sum=13)
Day 3: 8 (sum=8)
Day 4: 9 (sum=9)
Day 5: 10 (sum=10)
\`\`\`

## Constraints

- 1 <= days <= weights.length <= 5 * 10^4
- 1 <= weights[i] <= 500

## Hidden Insight

What's the monotonic property? If capacity C works, does C+1 work too?`,
    starterCode: `def shipWithinDays(weights, days):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Binary search on capacity. Range: max(weights) to sum(weights).' },
      { afterAttempt: 2, text: 'For each capacity, simulate: greedily fill each day until exceeding capacity.' },
      { afterAttempt: 3, text: 'If can ship in <= days, try smaller capacity. Otherwise try larger.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `def shipWithinDays(weights, days):
    def canShip(capacity):
        day_count = 1
        current_load = 0
        for w in weights:
            if current_load + w > capacity:
                day_count += 1
                current_load = w
            else:
                current_load += w
        return day_count <= days

    left = max(weights)  # Must carry heaviest package
    right = sum(weights)  # All in one day

    while left < right:
        mid = (left + right) // 2
        if canShip(mid):
            right = mid
        else:
            left = mid + 1

    return left`
    },
    solutionExplanation: `## Binary Search on Answer

**Search space:** [max(weights), sum(weights)]
- Min: must carry heaviest single package
- Max: ship everything in one day

**Monotonic property:** If capacity C works, C+1 also works.

**Feasibility check:** Greedy simulation.`,
    testCases: [
      { input: '[1,2,3,4,5,6,7,8,9,10], 5', expectedOutput: '15' },
      { input: '[3,2,2,4,1,4], 3', expectedOutput: '6' },
      { input: '[1,2,3,1,1], 4', expectedOutput: '3' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-split-array-largest-sum',
    title: 'Split Array Largest Sum',
    description: 'Minimize the maximum sum when splitting array into k parts',
    targetComplexity: { time: 'O(n log m)', space: 'O(1)' },
    instruction: `# Split Array Largest Sum (LeetCode 410)

Split array into \`k\` non-empty contiguous subarrays.

Minimize the **maximum** sum among the k subarrays.

## Examples

\`\`\`
Input: nums = [7,2,5,10,8], k = 2
Output: 18

Explanation:
Split: [7,2,5] and [10,8]
Sums: 14 and 18
Maximum is 18 (minimized)
\`\`\`

## Constraints

- 1 <= k <= nums.length <= 1000
- 0 <= nums[i] <= 10^6

## Hidden Insight

This is the same pattern as ship packages! Think about what you're binary searching on.`,
    starterCode: `def splitArray(nums, k):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Binary search on the maximum sum. If max_sum allows k or fewer splits, it works.' },
      { afterAttempt: 2, text: 'Greedy check: count splits needed when each subarray sum <= mid.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def splitArray(nums, k):
    def canSplit(max_sum):
        splits = 1
        current_sum = 0
        for num in nums:
            if current_sum + num > max_sum:
                splits += 1
                current_sum = num
            else:
                current_sum += num
        return splits <= k

    left = max(nums)
    right = sum(nums)

    while left < right:
        mid = (left + right) // 2
        if canSplit(mid):
            right = mid
        else:
            left = mid + 1

    return left`
    },
    solutionExplanation: `## Same Pattern as Ship Packages!

**Search space:** [max(nums), sum(nums)]

**Feasibility:** Can we split into <= k parts where each part <= mid?

**Greedy check:** Keep adding until exceeding mid, then start new split.`,
    testCases: [
      { input: '[7,2,5,10,8], 2', expectedOutput: '18' },
      { input: '[1,2,3,4,5], 2', expectedOutput: '9' },
      { input: '[1,4,4], 3', expectedOutput: '4' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-min-speed-arrive',
    title: 'Minimum Speed to Arrive on Time',
    description: 'Find minimum speed to reach destination within time limit',
    targetComplexity: { time: 'O(n log m)', space: 'O(1)' },
    instruction: `# Minimum Speed to Arrive on Time (LeetCode 1870)

Given \`dist\` array where \`dist[i]\` is distance of i-th train ride.

Each train departs at integer hour (wait for next whole hour between rides).

Find minimum integer speed to arrive within \`hour\` time. Return -1 if impossible.

## Examples

\`\`\`
Input: dist = [1,3,2], hour = 6
Output: 1

At speed 1:
Train 1: 1/1 = 1 hour, depart at hour 1
Train 2: 3/1 = 3 hours, arrive at hour 4
Train 3: 2/1 = 2 hours, arrive at hour 6 ✓
\`\`\`

## Constraints

- n == dist.length
- 1 <= n <= 10^5
- 1.0 <= hour <= 10^9

## Hidden Insight

The last train doesn't need to wait. How does this affect the calculation?`,
    starterCode: `import math

def minSpeedOnTime(dist, hour):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Binary search on speed. Check if total time <= hour.' },
      { afterAttempt: 2, text: 'For trains except last: ceil(dist[i]/speed). For last: dist[i]/speed (no waiting).' },
      { afterAttempt: 3, text: 'If len(dist) > ceil(hour), impossible (need at least 1 hour per train).' }
    ],
    solution: {
      afterAttempt: 3,
      text: `import math

def minSpeedOnTime(dist, hour):
    n = len(dist)
    if n > math.ceil(hour):
        return -1

    def canArrive(speed):
        total = 0
        for i in range(n - 1):
            total += math.ceil(dist[i] / speed)
        total += dist[-1] / speed  # Last train, no ceiling
        return total <= hour

    left, right = 1, 10**7

    while left < right:
        mid = (left + right) // 2
        if canArrive(mid):
            right = mid
        else:
            left = mid + 1

    return left`
    },
    solutionExplanation: `## Key Insight: Last Train Doesn't Wait

For all trains except last: must round up (wait for next hour).
For last train: exact time, no rounding.

**Edge case:** If n trains and hour < n, impossible.`,
    testCases: [
      { input: '[1,3,2], 6', expectedOutput: '1' },
      { input: '[1,3,2], 2.7', expectedOutput: '3' },
      { input: '[1,3,2], 1.9', expectedOutput: '-1' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-smallest-divisor',
    title: 'Smallest Divisor Given Threshold',
    description: 'Find smallest divisor such that sum of ceil(nums[i]/divisor) <= threshold',
    targetComplexity: { time: 'O(n log m)', space: 'O(1)' },
    instruction: `# Find the Smallest Divisor Given a Threshold (LeetCode 1283)

Find the smallest divisor such that the sum of division results is <= threshold.

Each result is rounded up: ceil(nums[i] / divisor).

## Examples

\`\`\`
Input: nums = [1,2,5,9], threshold = 6
Output: 5

divisor=5: ceil(1/5) + ceil(2/5) + ceil(5/5) + ceil(9/5)
         = 1 + 1 + 1 + 2 = 5 <= 6 ✓
\`\`\`

## Constraints

- 1 <= threshold >= nums.length

## Hidden Insight

Larger divisor = smaller sum. This is monotonic!`,
    starterCode: `import math

def smallestDivisor(nums, threshold):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Binary search on divisor from 1 to max(nums).' },
      { afterAttempt: 2, text: 'If sum <= threshold, try smaller divisor. Otherwise try larger.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `import math

def smallestDivisor(nums, threshold):
    def sumDivisions(divisor):
        return sum(math.ceil(n / divisor) for n in nums)

    left, right = 1, max(nums)

    while left < right:
        mid = (left + right) // 2
        if sumDivisions(mid) <= threshold:
            right = mid  # Try smaller divisor
        else:
            left = mid + 1

    return left`
    },
    solutionExplanation: `## Monotonic Property

Larger divisor → Smaller quotients → Smaller sum.

So if divisor D works (sum <= threshold), D+1 also works.

We want the smallest D that works.`,
    testCases: [
      { input: '[1,2,5,9], 6', expectedOutput: '5' },
      { input: '[44,22,33,11,1], 5', expectedOutput: '44' },
      { input: '[21212,10101,12121], 1000000', expectedOutput: '1' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-min-max-pair-diff',
    title: 'Minimize Maximum Pair Difference',
    description: 'Form p pairs minimizing the maximum difference',
    targetComplexity: { time: 'O(n log n + n log m)', space: 'O(1)' },
    instruction: `# Minimize the Maximum Difference of Pairs (LeetCode 2616)

Given array \`nums\` and integer \`p\`, form \`p\` pairs of indices.

Each index can only be in one pair.

Minimize the **maximum** absolute difference among chosen pairs.

## Examples

\`\`\`
Input: nums = [10,1,2,7,1,3], p = 2
Output: 1

Pairs: (1,4) and (2,5)
nums[1]=1, nums[4]=1 → diff=0
nums[2]=2, nums[5]=3 → diff=1
Max difference = 1
\`\`\`

## Constraints

- 2 <= nums.length <= 10^5
- 0 <= p <= nums.length / 2

## Hidden Insight

After sorting, optimal pairs are adjacent. Binary search on the max difference allowed.`,
    starterCode: `def minimizeMax(nums, p):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Sort the array first. Adjacent elements have smallest differences.' },
      { afterAttempt: 2, text: 'Binary search on max allowed difference. Check if we can form p pairs.' },
      { afterAttempt: 3, text: 'Greedy: scan left to right, pair adjacent if diff <= mid.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `def minimizeMax(nums, p):
    if p == 0:
        return 0

    nums.sort()

    def canForm(max_diff):
        pairs = 0
        i = 0
        while i < len(nums) - 1:
            if nums[i+1] - nums[i] <= max_diff:
                pairs += 1
                i += 2  # Skip both
            else:
                i += 1
        return pairs >= p

    left, right = 0, nums[-1] - nums[0]

    while left < right:
        mid = (left + right) // 2
        if canForm(mid):
            right = mid
        else:
            left = mid + 1

    return left`
    },
    solutionExplanation: `## Two Key Insights

1. **Sorting:** After sorting, optimal pairs are always adjacent
2. **Greedy pairing:** If adjacent elements have diff <= max_diff, pair them

Binary search finds minimum max_diff that allows p pairs.`,
    testCases: [
      { input: '[10,1,2,7,1,3], 2', expectedOutput: '1' },
      { input: '[4,2,1,2], 1', expectedOutput: '0' },
      { input: '[1,2,3,4], 0', expectedOutput: '0' }
    ],
    requiredForProgress: false
  },

  // ============================================================================
  // GROUP 3: Binary Search on Implicit Space
  // ============================================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-sqrt',
    title: 'Integer Square Root',
    description: 'Find floor of square root without using sqrt function',
    targetComplexity: { time: 'O(log n)', space: 'O(1)' },
    instruction: `# Sqrt(x) (LeetCode 69)

Given a non-negative integer \`x\`, return the integer part of sqrt(x).

Do not use built-in sqrt functions.

## Examples

\`\`\`
Input: x = 8
Output: 2 (sqrt(8) ≈ 2.83, floor is 2)

Input: x = 4
Output: 2
\`\`\`

## Constraints

- 0 <= x <= 2^31 - 1

## Hidden Insight

Find largest integer n where n*n <= x. This is monotonic!`,
    starterCode: `def mySqrt(x):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Binary search for largest n where n*n <= x.' },
      { afterAttempt: 2, text: 'If mid*mid <= x, mid could be answer, search right for larger. Otherwise search left.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def mySqrt(x):
    if x < 2:
        return x

    left, right = 1, x // 2

    while left <= right:
        mid = (left + right) // 2
        sq = mid * mid
        if sq == x:
            return mid
        elif sq < x:
            left = mid + 1
        else:
            right = mid - 1

    return right  # Largest where mid*mid <= x`
    },
    solutionExplanation: `## Binary Search on Implicit Answer Space

We're not searching an array, we're searching the integers 0 to x.

**Monotonic property:** If n² > x, then (n+1)² > x too.

Find last n where n² <= x.`,
    testCases: [
      { input: '4', expectedOutput: '2' },
      { input: '8', expectedOutput: '2' },
      { input: '0', expectedOutput: '0' },
      { input: '1', expectedOutput: '1' },
      { input: '2147395599', expectedOutput: '46339' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-nth-root',
    title: 'Nth Root of M',
    description: 'Find integer x where x^n = m',
    targetComplexity: { time: 'O(log m)', space: 'O(1)' },
    instruction: `# Nth Root

Find integer \`x\` such that \`x^n = m\`.

Return \`-1\` if no such integer exists.

## Examples

\`\`\`
Input: n = 3, m = 27
Output: 3 (3^3 = 27)

Input: n = 2, m = 8
Output: -1 (no integer x where x^2 = 8)

Input: n = 4, m = 81
Output: 3 (3^4 = 81)
\`\`\`

## Constraints

- 1 <= n <= 30
- 1 <= m <= 10^9`,
    starterCode: `def nthRoot(n, m):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Binary search on x from 1 to m. Check if x^n == m, < m, or > m.' },
      { afterAttempt: 2, text: 'Be careful with overflow! x^n can be very large.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def nthRoot(n, m):
    if m == 1:
        return 1

    left, right = 1, int(m ** (1/n)) + 1

    while left <= right:
        mid = (left + right) // 2
        power = mid ** n

        if power == m:
            return mid
        elif power < m:
            left = mid + 1
        else:
            right = mid - 1

    return -1`
    },
    solutionExplanation: `## Finding Exact Match

Unlike sqrt (floor), here we need exact match.

Binary search, but return -1 if x^n never equals m exactly.`,
    testCases: [
      { input: '3, 27', expectedOutput: '3' },
      { input: '2, 8', expectedOutput: '-1' },
      { input: '4, 81', expectedOutput: '3' },
      { input: '2, 16', expectedOutput: '4' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-peak-element',
    title: 'Find Peak Element',
    description: 'Find any peak in array where adjacent elements differ',
    targetComplexity: { time: 'O(log n)', space: 'O(1)' },
    instruction: `# Find Peak Element (LeetCode 162)

A peak element is strictly greater than its neighbors.

Given array where \`nums[i] != nums[i+1]\`, find any peak index.

Assume \`nums[-1] = nums[n] = -∞\`.

## Examples

\`\`\`
Input: nums = [1,2,3,1]
Output: 2 (nums[2] = 3 is a peak)

Input: nums = [1,2,1,3,5,6,4]
Output: 5 (or 1, both are peaks)
\`\`\`

## Constraints

- 1 <= nums.length <= 1000
- nums[i] != nums[i + 1]

## Hidden Insight

If nums[mid] < nums[mid+1], a peak exists on the right. Why?`,
    starterCode: `def findPeakElement(nums):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'If mid < mid+1, go right (uphill leads to peak). Otherwise go left.' },
      { afterAttempt: 2, text: 'Think of it as following the "uphill" direction. Must reach a peak eventually.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def findPeakElement(nums):
    left, right = 0, len(nums) - 1

    while left < right:
        mid = (left + right) // 2
        if nums[mid] < nums[mid + 1]:
            left = mid + 1  # Peak is on right
        else:
            right = mid  # Peak is on left (or at mid)

    return left`
    },
    solutionExplanation: `## Following the Uphill

If nums[mid] < nums[mid+1], we're on an ascending slope.

Since nums[n] = -∞, the slope MUST come down eventually = peak exists on right.

Same logic for left side.`,
    testCases: [
      { input: '[1,2,3,1]', expectedOutput: '2' },
      { input: '[1,2,1,3,5,6,4]', expectedOutput: '5' },
      { input: '[1]', expectedOutput: '0' },
      { input: '[1,2]', expectedOutput: '1' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-mountain-peak',
    title: 'Peak Index in Mountain Array',
    description: 'Find peak in array that strictly increases then decreases',
    targetComplexity: { time: 'O(log n)', space: 'O(1)' },
    instruction: `# Peak Index in a Mountain Array (LeetCode 852)

Array \`arr\` is a **mountain** if:
- arr[0] < arr[1] < ... < arr[i-1] < arr[i]
- arr[i] > arr[i+1] > ... > arr[arr.length - 1]

Return the peak index \`i\`.

## Examples

\`\`\`
Input: arr = [0,1,0]
Output: 1

Input: arr = [0,2,1,0]
Output: 1

Input: arr = [0,10,5,2]
Output: 1
\`\`\`

## Constraints

- 3 <= arr.length <= 10^5
- Guaranteed to be a valid mountain`,
    starterCode: `def peakIndexInMountainArray(arr):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Same as find peak element. If arr[mid] < arr[mid+1], peak is on right.' }
    ],
    solution: {
      afterAttempt: 1,
      text: `def peakIndexInMountainArray(arr):
    left, right = 0, len(arr) - 1

    while left < right:
        mid = (left + right) // 2
        if arr[mid] < arr[mid + 1]:
            left = mid + 1  # Still ascending
        else:
            right = mid  # Descending or at peak

    return left`
    },
    solutionExplanation: `## Mountain Array = Exactly One Peak

The logic is identical to Find Peak Element.

Since it's guaranteed to be a mountain, we know exactly one peak exists.`,
    testCases: [
      { input: '[0,1,0]', expectedOutput: '1' },
      { input: '[0,2,1,0]', expectedOutput: '1' },
      { input: '[0,10,5,2]', expectedOutput: '1' },
      { input: '[3,4,5,1]', expectedOutput: '2' }
    ],
    requiredForProgress: true
  },

  // ============================================================================
  // GROUP 4: Binary Search on Functions (Advanced)
  // ============================================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-kth-smallest-mult-table',
    title: 'Kth Smallest in Multiplication Table',
    description: 'Find k-th smallest number in m×n multiplication table',
    targetComplexity: { time: 'O(m log(mn))', space: 'O(1)' },
    instruction: `# Kth Smallest Number in Multiplication Table (LeetCode 668)

Given m×n multiplication table and integer k, find the k-th smallest number.

Table[i][j] = i * j (1-indexed).

## Examples

\`\`\`
Input: m = 3, n = 3, k = 5
Table:
1  2  3
2  4  6
3  6  9

Sorted: 1,2,2,3,3,4,6,6,9
k=5 → Output: 3
\`\`\`

## Constraints

- 1 <= m, n <= 3 * 10^4
- 1 <= k <= m * n

## Hidden Insight

Don't build the table! Binary search on the answer, count how many values <= mid.`,
    starterCode: `def findKthNumber(m, n, k):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Binary search on answer from 1 to m*n.' },
      { afterAttempt: 2, text: 'For each value x, count how many table entries <= x.' },
      { afterAttempt: 3, text: 'In row i, values <= x are min(x//i, n). Sum across all rows.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `def findKthNumber(m, n, k):
    def countLessOrEqual(x):
        count = 0
        for i in range(1, m + 1):
            count += min(x // i, n)
        return count

    left, right = 1, m * n

    while left < right:
        mid = (left + right) // 2
        if countLessOrEqual(mid) >= k:
            right = mid
        else:
            left = mid + 1

    return left`
    },
    solutionExplanation: `## Counting Without Building

For value x, count entries <= x:
- Row i has values i, 2i, 3i, ..., ni
- Values <= x: min(x // i, n)

Binary search: find smallest x with count >= k.`,
    testCases: [
      { input: '3, 3, 5', expectedOutput: '3' },
      { input: '2, 3, 6', expectedOutput: '6' },
      { input: '1, 1, 1', expectedOutput: '1' }
    ],
    requiredForProgress: false
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-kth-pair-distance',
    title: 'Kth Smallest Pair Distance',
    description: 'Find k-th smallest absolute difference between pairs',
    targetComplexity: { time: 'O(n log n + n log m)', space: 'O(1)' },
    instruction: `# Find K-th Smallest Pair Distance (LeetCode 719)

Given integer array \`nums\` and integer \`k\`, return the k-th smallest distance among all pairs.

Distance of pair (i, j) is |nums[i] - nums[j]|.

## Examples

\`\`\`
Input: nums = [1,3,1], k = 1
Output: 0

Pairs: (0,1)=2, (0,2)=0, (1,2)=2
Sorted distances: [0,2,2]
k=1 → 0
\`\`\`

## Constraints

- 2 <= nums.length <= 10^6
- 0 <= nums[i] <= 10^6
- 1 <= k <= n*(n-1)/2

## Hidden Insight

Sort array. Binary search on distance, count pairs with distance <= mid.`,
    starterCode: `def smallestDistancePair(nums, k):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Sort the array. Binary search on distance from 0 to max-min.' },
      { afterAttempt: 2, text: 'To count pairs with distance <= mid: use two pointers or binary search for each element.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def smallestDistancePair(nums, k):
    nums.sort()
    n = len(nums)

    def countPairs(max_dist):
        count = 0
        left = 0
        for right in range(n):
            while nums[right] - nums[left] > max_dist:
                left += 1
            count += right - left
        return count

    lo, hi = 0, nums[-1] - nums[0]

    while lo < hi:
        mid = (lo + hi) // 2
        if countPairs(mid) >= k:
            hi = mid
        else:
            lo = mid + 1

    return lo`
    },
    solutionExplanation: `## Binary Search + Two Pointers

After sorting, for each right index, find how many left indices have nums[right] - nums[left] <= mid.

This is efficiently done with two pointers: left only moves right as right increases.`,
    testCases: [
      { input: '[1,3,1], 1', expectedOutput: '0' },
      { input: '[1,1,1], 2', expectedOutput: '0' },
      { input: '[1,6,1], 3', expectedOutput: '5' }
    ],
    requiredForProgress: false
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-median-two-arrays',
    title: 'Median of Two Sorted Arrays',
    description: 'Find median of two sorted arrays in O(log(m+n))',
    targetComplexity: { time: 'O(log(min(m,n)))', space: 'O(1)' },
    instruction: `# Median of Two Sorted Arrays (LeetCode 4)

Given two sorted arrays \`nums1\` and \`nums2\`, return the median.

Overall runtime must be O(log(m+n)).

## Examples

\`\`\`
Input: nums1 = [1,3], nums2 = [2]
Output: 2.0

Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.5 ((2+3)/2)
\`\`\`

## Constraints

- nums1.length == m, nums2.length == n
- 0 <= m,n <= 1000
- m + n >= 1

## Hidden Insight

Binary search on partition position in smaller array. A valid partition splits both arrays such that all left elements <= all right elements.`,
    starterCode: `def findMedianSortedArrays(nums1, nums2):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Binary search on partition of smaller array. Partition larger array accordingly.' },
      { afterAttempt: 2, text: 'Valid partition: max(left1, left2) <= min(right1, right2).' },
      { afterAttempt: 3, text: 'If left1 > right2, move partition left in nums1. If left2 > right1, move right.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `def findMedianSortedArrays(nums1, nums2):
    # Ensure nums1 is smaller
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1

    m, n = len(nums1), len(nums2)
    left, right = 0, m
    half = (m + n + 1) // 2

    while left <= right:
        i = (left + right) // 2  # Partition in nums1
        j = half - i              # Partition in nums2

        left1 = float('-inf') if i == 0 else nums1[i-1]
        right1 = float('inf') if i == m else nums1[i]
        left2 = float('-inf') if j == 0 else nums2[j-1]
        right2 = float('inf') if j == n else nums2[j]

        if left1 <= right2 and left2 <= right1:
            # Valid partition
            if (m + n) % 2 == 1:
                return max(left1, left2)
            return (max(left1, left2) + min(right1, right2)) / 2
        elif left1 > right2:
            right = i - 1
        else:
            left = i + 1

    return 0`
    },
    solutionExplanation: `## Partition-Based Binary Search

The key insight: we're looking for a partition that splits the combined array into two halves.

Binary search on where to partition the smaller array. The other partition is derived.

Valid partition: all elements on left <= all elements on right.`,
    testCases: [
      { input: '[1,3], [2]', expectedOutput: '2.0' },
      { input: '[1,2], [3,4]', expectedOutput: '2.5' },
      { input: '[0,0], [0,0]', expectedOutput: '0.0' },
      { input: '[], [1]', expectedOutput: '1.0' }
    ],
    requiredForProgress: false
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-aggressive-cows',
    title: 'Aggressive Cows',
    description: 'Maximize minimum distance between k cows in stalls',
    targetComplexity: { time: 'O(n log m)', space: 'O(1)' },
    instruction: `# Aggressive Cows (SPOJ Classic)

Given \`n\` stall positions and \`k\` cows, place cows to **maximize** the **minimum** distance between any two cows.

## Examples

\`\`\`
Input: stalls = [1, 2, 4, 8, 9], k = 3
Output: 3

Place at 1, 4, 9
Distances: 3, 5
Minimum = 3 (maximized!)
\`\`\`

## Constraints

- 2 <= k <= n <= 10^5
- 0 <= stalls[i] <= 10^9

## Hidden Insight

Binary search on the answer (minimum distance). Check if we can place k cows with at least that distance.`,
    starterCode: `def aggressiveCows(stalls, k):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Binary search on min distance. Range: 1 to (max - min) / (k-1).' },
      { afterAttempt: 2, text: 'Greedy check: place first cow at start, next at first stall >= distance away.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def aggressiveCows(stalls, k):
    stalls.sort()

    def canPlace(min_dist):
        cows = 1
        last = stalls[0]
        for stall in stalls[1:]:
            if stall - last >= min_dist:
                cows += 1
                last = stall
        return cows >= k

    left = 1
    right = (stalls[-1] - stalls[0]) // (k - 1)

    while left <= right:
        mid = (left + right) // 2
        if canPlace(mid):
            left = mid + 1  # Try larger distance
        else:
            right = mid - 1

    return right`
    },
    solutionExplanation: `## Maximize the Minimum (Classic Pattern)

This is the "opposite" of minimize the maximum.

Binary search for largest minimum distance that allows placing k cows.

Greedy placement: always put next cow at first valid position.`,
    testCases: [
      { input: '[1,2,4,8,9], 3', expectedOutput: '3' },
      { input: '[1,2,3,4,5,6,7,8,9,10], 4', expectedOutput: '3' },
      { input: '[5,17,100,11], 2', expectedOutput: '95' }
    ],
    requiredForProgress: false
  },

  // ============================================================================
  // GROUP 5: Edge-case-heavy Binary Search (Rotated Arrays)
  // ============================================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-search-rotated-ii',
    title: 'Search in Rotated Sorted Array II',
    description: 'Search in rotated array WITH duplicates',
    targetComplexity: { time: 'O(log n) average', space: 'O(1)' },
    instruction: `# Search in Rotated Sorted Array II (LeetCode 81)

Same as Search in Rotated Sorted Array, but array may contain **duplicates**.

Return true if target exists, false otherwise.

## Examples

\`\`\`
Input: nums = [2,5,6,0,0,1,2], target = 0
Output: true

Input: nums = [2,5,6,0,0,1,2], target = 3
Output: false
\`\`\`

## Constraints

- Duplicates allowed!

## Hidden Insight

When nums[left] == nums[mid] == nums[right], we can't determine which half is sorted. What can we do?`,
    starterCode: `def search(nums, target):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'When left == mid == right, we can\'t tell which half is sorted.' },
      { afterAttempt: 2, text: 'In that case, just shrink both ends: left++, right--.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
            return True

        # Handle duplicates: can't determine sorted half
        if nums[left] == nums[mid] == nums[right]:
            left += 1
            right -= 1
        elif nums[left] <= nums[mid]:  # Left half sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:  # Right half sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return False`
    },
    solutionExplanation: `## Handling Duplicates

When nums[left] == nums[mid] == nums[right], we can't determine which half is sorted.

Solution: shrink both ends and try again.

Worst case: all same elements → O(n).
Average case: still O(log n).`,
    testCases: [
      { input: '[2,5,6,0,0,1,2], 0', expectedOutput: 'True' },
      { input: '[2,5,6,0,0,1,2], 3', expectedOutput: 'False' },
      { input: '[1,0,1,1,1], 0', expectedOutput: 'True' },
      { input: '[1,1,1,1,1], 2', expectedOutput: 'False' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-find-min-rotated',
    title: 'Find Minimum in Rotated Sorted Array',
    description: 'Find minimum element in rotated sorted array',
    targetComplexity: { time: 'O(log n)', space: 'O(1)' },
    instruction: `# Find Minimum in Rotated Sorted Array (LeetCode 153)

Array was sorted ascending, then rotated 1 to n times.

Find the **minimum** element.

## Examples

\`\`\`
Input: nums = [3,4,5,1,2]
Output: 1

Input: nums = [4,5,6,7,0,1,2]
Output: 0

Input: nums = [11,13,15,17]
Output: 11 (not rotated)
\`\`\`

## Constraints

- All elements are unique

## Hidden Insight

The minimum is at the "rotation point". Compare mid with right to decide which half contains it.`,
    starterCode: `def findMin(nums):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'If nums[mid] > nums[right], min is in right half.' },
      { afterAttempt: 2, text: 'If nums[mid] <= nums[right], min is in left half (including mid).' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def findMin(nums):
    left, right = 0, len(nums) - 1

    while left < right:
        mid = (left + right) // 2

        if nums[mid] > nums[right]:
            left = mid + 1  # Min is in right half
        else:
            right = mid  # Min is in left half (or at mid)

    return nums[left]`
    },
    solutionExplanation: `## Finding the Rotation Point

The minimum is where the "break" occurs.

Compare with right (not left) because:
- If nums[mid] > nums[right], the break is in [mid+1, right]
- Otherwise, the break is in [left, mid]`,
    testCases: [
      { input: '[3,4,5,1,2]', expectedOutput: '1' },
      { input: '[4,5,6,7,0,1,2]', expectedOutput: '0' },
      { input: '[11,13,15,17]', expectedOutput: '11' },
      { input: '[2,1]', expectedOutput: '1' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-rotation-count',
    title: 'Find Rotation Count',
    description: 'How many times was the sorted array rotated?',
    targetComplexity: { time: 'O(log n)', space: 'O(1)' },
    instruction: `# Find Rotation Count

A sorted array was rotated k times. Find k.

Rotation: move last element to front.

## Examples

\`\`\`
Input: nums = [4,5,6,7,0,1,2]
Output: 4 (rotated 4 times, min at index 4)

Input: nums = [1,2,3,4,5]
Output: 0 (not rotated)
\`\`\`

## Hidden Insight

The rotation count equals the index of the minimum element!`,
    starterCode: `def findRotationCount(nums):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'This is just "Find Minimum", but return the index instead of the value.' }
    ],
    solution: {
      afterAttempt: 1,
      text: `def findRotationCount(nums):
    left, right = 0, len(nums) - 1

    # Already sorted (no rotation)
    if nums[left] <= nums[right]:
        return 0

    while left < right:
        mid = (left + right) // 2

        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid

    return left  # Index of minimum = rotation count`
    },
    solutionExplanation: `## Index of Minimum = Rotation Count

If minimum is at index i, the array was rotated i times.

Original: [0,1,2,3,4,5,6]
Rotated 4: [4,5,6,0,1,2,3] → min at index 3...

Wait, that's wrong! Actually rotation count = index of min when rotating moves last to front.`,
    testCases: [
      { input: '[4,5,6,7,0,1,2]', expectedOutput: '4' },
      { input: '[1,2,3,4,5]', expectedOutput: '0' },
      { input: '[2,1]', expectedOutput: '1' },
      { input: '[1]', expectedOutput: '0' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-bitonic-peak',
    title: 'Peak in Bitonic Array',
    description: 'Find peak in strictly increasing then strictly decreasing array',
    targetComplexity: { time: 'O(log n)', space: 'O(1)' },
    instruction: `# Find Peak in Bitonic Array

A **bitonic** array strictly increases, then strictly decreases.

Find the peak (maximum) element.

## Examples

\`\`\`
Input: nums = [1, 3, 8, 12, 4, 2]
Output: 12 (index 3)

Input: nums = [3, 8, 3, 1]
Output: 8
\`\`\`

## Constraints

- Guaranteed to be bitonic
- All elements distinct

## Hidden Insight

This is the same as Peak in Mountain Array!`,
    starterCode: `def findBitonicPeak(nums):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'If nums[mid] < nums[mid+1], we\'re in increasing part, go right.' }
    ],
    solution: {
      afterAttempt: 1,
      text: `def findBitonicPeak(nums):
    left, right = 0, len(nums) - 1

    while left < right:
        mid = (left + right) // 2
        if nums[mid] < nums[mid + 1]:
            left = mid + 1  # Ascending, peak is right
        else:
            right = mid  # Descending or at peak

    return nums[left]`
    },
    solutionExplanation: `## Same as Mountain Array

Bitonic = Mountain array.

Binary search: follow the ascending direction until we reach the peak.`,
    testCases: [
      { input: '[1,3,8,12,4,2]', expectedOutput: '12' },
      { input: '[3,8,3,1]', expectedOutput: '8' },
      { input: '[1,2,3]', expectedOutput: '3' },
      { input: '[3,2,1]', expectedOutput: '3' }
    ],
    requiredForProgress: true
  }
];
