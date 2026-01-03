import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const moduleArrayPartitioningLessonSmartPracticeExercises: ExerciseSection[] = [
  // ==================== GROUP 1: Basic Partitioning ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-sort-colors',
    title: 'Sort Colors (Dutch National Flag)',
    description: 'Sort an array of 0s, 1s, and 2s in-place using the Dutch National Flag algorithm',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Sort Colors

Given an array \`nums\` with \`n\` objects colored red, white, or blue, sort them **in-place** so that objects of the same color are adjacent, with the colors in the order red, white, and blue.

We use integers 0, 1, and 2 to represent red, white, and blue respectively.

You must solve this problem without using the library's sort function.

## Examples

**Example 1:**
\`\`\`
Input: nums = [2,0,2,1,1,0]
Output: [0,0,1,1,2,2]
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [2,0,1]
Output: [0,1,2]
\`\`\`

## Constraints
- \`n == nums.length\`
- \`1 <= n <= 300\`
- \`nums[i]\` is either 0, 1, or 2

## Follow-up
Could you solve it in one pass using O(1) extra space?`,
    starterCode: `def sortColors(nums: list[int]) -> None:
    # Modify nums in-place
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def sortColors(nums: list[int]) -> None:
    # Dutch National Flag algorithm
    low = mid = 0
    high = len(nums) - 1

    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:  # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1`
    },
    hints: [
      { afterAttempt: 1, text: 'Use three pointers: low (boundary of 0s), mid (current), high (boundary of 2s)' },
      { afterAttempt: 2, text: 'When you see 0, swap with low and advance both. When you see 2, swap with high and only decrement high.' },
      { afterAttempt: 3, text: 'Why not advance mid when swapping with high? Because the swapped element is unknown!' }
    ],
    testCases: [
      { input: '[2,0,2,1,1,0]', expectedOutput: '[0, 0, 1, 1, 2, 2]' },
      { input: '[2,0,1]', expectedOutput: '[0, 1, 2]' },
      { input: '[0]', expectedOutput: '[0]' },
      { input: '[1,2,0]', expectedOutput: '[0, 1, 2]' }
    ],
    solutionExplanation: `## Dutch National Flag Algorithm

The key insight is maintaining three regions:
- [0, low): all 0s
- [low, mid): all 1s
- [mid, high]: unknown
- (high, n): all 2s

We process the unknown region by examining nums[mid]:
- If 0: swap with low, advance both low and mid
- If 1: just advance mid
- If 2: swap with high, only decrement high (the swapped element needs checking)

Time: O(n) - single pass
Space: O(1) - in-place`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-move-zeroes',
    title: 'Move Zeroes',
    description: 'Move all zeroes to the end while maintaining relative order of non-zero elements',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Move Zeroes

Given an integer array \`nums\`, move all 0's to the end of it while maintaining the relative order of the non-zero elements.

**Note:** You must do this in-place without making a copy of the array.

## Examples

**Example 1:**
\`\`\`
Input: nums = [0,1,0,3,12]
Output: [1,3,12,0,0]
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [0]
Output: [0]
\`\`\`

## Constraints
- \`1 <= nums.length <= 10^4\`
- \`-2^31 <= nums[i] <= 2^31 - 1\`

## Follow-up
Could you minimize the total number of operations?`,
    starterCode: `def moveZeroes(nums: list[int]) -> None:
    # Modify nums in-place
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def moveZeroes(nums: list[int]) -> None:
    # Write pointer for next non-zero position
    write = 0

    # Move all non-zero elements to the front
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write] = nums[read]
            write += 1

    # Fill the rest with zeros
    while write < len(nums):
        nums[write] = 0
        write += 1`
    },
    hints: [
      { afterAttempt: 1, text: 'Use two pointers: one for reading, one for writing non-zero values' },
      { afterAttempt: 2, text: 'First pass: copy all non-zero elements to the front. Second pass: fill remaining with zeros' },
      { afterAttempt: 3, text: 'Alternative: swap approach - swap non-zero with position at write pointer' }
    ],
    testCases: [
      { input: '[0,1,0,3,12]', expectedOutput: '[1, 3, 12, 0, 0]' },
      { input: '[0]', expectedOutput: '[0]' },
      { input: '[1,2,3]', expectedOutput: '[1, 2, 3]' },
      { input: '[0,0,1]', expectedOutput: '[1, 0, 0]' }
    ],
    solutionExplanation: `## Two Pointer Approach

Maintain a write pointer that tracks where the next non-zero should go.

**Pass 1:** Scan through array, copying non-zero elements to write position
**Pass 2:** Fill remaining positions with zeros

Alternative (single pass with swaps):
\`\`\`python
write = 0
for i in range(len(nums)):
    if nums[i] != 0:
        nums[write], nums[i] = nums[i], nums[write]
        write += 1
\`\`\`

Time: O(n)
Space: O(1)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-partition-array-by-parity',
    title: 'Sort Array By Parity',
    description: 'Rearrange array so all even integers come before odd integers',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Sort Array By Parity

Given an integer array \`nums\`, move all the even integers at the beginning of the array followed by all the odd integers.

Return **any array** that satisfies this condition.

## Examples

**Example 1:**
\`\`\`
Input: nums = [3,1,2,4]
Output: [2,4,3,1]
Explanation: [4,2,3,1], [2,4,1,3], [4,2,1,3] are also accepted.
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [0]
Output: [0]
\`\`\`

## Constraints
- \`1 <= nums.length <= 5000\`
- \`0 <= nums[i] <= 5000\``,
    starterCode: `def sortArrayByParity(nums: list[int]) -> list[int]:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def sortArrayByParity(nums: list[int]) -> list[int]:
    # Two pointer approach - swap from both ends
    left, right = 0, len(nums) - 1

    while left < right:
        # Find odd on left
        while left < right and nums[left] % 2 == 0:
            left += 1
        # Find even on right
        while left < right and nums[right] % 2 == 1:
            right -= 1
        # Swap
        if left < right:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
            right -= 1

    return nums`
    },
    hints: [
      { afterAttempt: 1, text: 'Use two pointers from both ends of the array' },
      { afterAttempt: 2, text: 'Move left pointer right until you find an odd number. Move right pointer left until you find an even number.' },
      { afterAttempt: 3, text: 'When both pointers find a mismatch, swap the elements' }
    ],
    testCases: [
      { input: '[3,1,2,4]', expectedOutput: '[4, 2, 1, 3]' },
      { input: '[0]', expectedOutput: '[0]' },
      { input: '[2,4,6]', expectedOutput: '[2, 4, 6]' },
      { input: '[1,3,5]', expectedOutput: '[1, 3, 5]' }
    ],
    solutionExplanation: `## Two Pointer Swap

This is a classic 2-way partition:
1. Left pointer finds odd numbers (wrong position)
2. Right pointer finds even numbers (wrong position)
3. Swap them

The invariant:
- Everything left of left pointer is even
- Everything right of right pointer is odd

Time: O(n)
Space: O(1)`
  },

  // ==================== GROUP 2: QuickSort Partition ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-partition-list',
    title: 'Partition List',
    description: 'Partition linked list around a value x',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Partition List

Given the head of a linked list and a value \`x\`, partition it such that all nodes **less than** \`x\` come before nodes **greater than or equal** to \`x\`.

You should **preserve the original relative order** of the nodes in each partition.

## Examples

**Example 1:**
\`\`\`
Input: head = [1,4,3,2,5,2], x = 3
Output: [1,2,2,4,3,5]
\`\`\`

**Example 2:**
\`\`\`
Input: head = [2,1], x = 2
Output: [1,2]
\`\`\`

## Constraints
- The number of nodes is in range [0, 200]
- \`-100 <= Node.val <= 100\`
- \`-200 <= x <= 200\``,
    starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def partition(head: ListNode, x: int) -> ListNode:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def partition(head: ListNode, x: int) -> ListNode:
    # Create two dummy heads for two partitions
    before_head = ListNode(0)
    after_head = ListNode(0)

    before = before_head
    after = after_head

    # Traverse and distribute nodes
    while head:
        if head.val < x:
            before.next = head
            before = before.next
        else:
            after.next = head
            after = after.next
        head = head.next

    # Connect the two lists
    after.next = None  # Important: terminate the after list
    before.next = after_head.next

    return before_head.next`
    },
    hints: [
      { afterAttempt: 1, text: 'Create two separate lists: one for nodes < x, one for nodes >= x' },
      { afterAttempt: 2, text: 'Use dummy heads to simplify edge cases' },
      { afterAttempt: 3, text: 'Don\'t forget to terminate the second list and connect the two lists at the end' }
    ],
    testCases: [
      { input: '[1,4,3,2,5,2], 3', expectedOutput: '[1, 2, 2, 4, 3, 5]' },
      { input: '[2,1], 2', expectedOutput: '[1, 2]' },
      { input: '[1], 0', expectedOutput: '[1]' }
    ],
    solutionExplanation: `## Two List Approach

Create two separate lists:
- "before" list: nodes with value < x
- "after" list: nodes with value >= x

Traverse once, appending each node to the appropriate list. Finally, connect before to after.

Key: Use dummy heads to avoid null checks, and remember to set after.next = None to prevent cycles.

Time: O(n)
Space: O(1) - reusing existing nodes`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-kth-largest',
    title: 'Kth Largest Element (QuickSelect)',
    description: 'Find the kth largest element using partition-based selection',
    targetComplexity: { time: 'O(n) average', space: 'O(1)' },
    instruction: `# Kth Largest Element in an Array

Given an integer array \`nums\` and an integer \`k\`, return the \`k\`th largest element in the array.

Note that it is the kth largest element in sorted order, not the kth distinct element.

Can you solve it without sorting?

## Examples

**Example 1:**
\`\`\`
Input: nums = [3,2,1,5,6,4], k = 2
Output: 5
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [3,2,3,1,2,4,5,5,6], k = 4
Output: 4
\`\`\`

## Constraints
- \`1 <= k <= nums.length <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\``,
    starterCode: `def findKthLargest(nums: list[int], k: int) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `import random

def findKthLargest(nums: list[int], k: int) -> int:
    # Convert to kth smallest from end
    target = len(nums) - k

    def partition(left, right):
        # Random pivot to avoid worst case
        pivot_idx = random.randint(left, right)
        nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]
        pivot = nums[right]

        # Lomuto partition
        i = left - 1
        for j in range(left, right):
            if nums[j] <= pivot:
                i += 1
                nums[i], nums[j] = nums[j], nums[i]
        nums[i + 1], nums[right] = nums[right], nums[i + 1]
        return i + 1

    left, right = 0, len(nums) - 1
    while left <= right:
        pivot_idx = partition(left, right)
        if pivot_idx == target:
            return nums[pivot_idx]
        elif pivot_idx < target:
            left = pivot_idx + 1
        else:
            right = pivot_idx - 1

    return -1  # Should never reach here`
    },
    hints: [
      { afterAttempt: 1, text: 'kth largest = (n-k)th smallest. Use QuickSelect algorithm.' },
      { afterAttempt: 2, text: 'Partition the array. If pivot is at target position, return it. Otherwise, recurse on the correct half.' },
      { afterAttempt: 3, text: 'Use random pivot selection to avoid O(n²) worst case' }
    ],
    testCases: [
      { input: '[3,2,1,5,6,4], 2', expectedOutput: '5' },
      { input: '[3,2,3,1,2,4,5,5,6], 4', expectedOutput: '4' },
      { input: '[1], 1', expectedOutput: '1' }
    ],
    solutionExplanation: `## QuickSelect Algorithm

Based on QuickSort's partition:
1. Partition array around a pivot
2. If pivot is at target position, we're done
3. Otherwise, recurse on the half containing the target

Key insight: We only need to sort the half containing our target, not the entire array.

Average Time: O(n)
Worst Time: O(n²) - mitigated by random pivot
Space: O(1) iterative, O(log n) recursive`
  },

  // ==================== GROUP 3: Stable Partition ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-sort-array-by-parity-ii',
    title: 'Sort Array By Parity II',
    description: 'Arrange array so even indices have even values and odd indices have odd values',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Sort Array By Parity II

Given an array of integers \`nums\`, half of the integers are odd and half are even.

Sort the array so that whenever \`nums[i]\` is odd, \`i\` is odd, and whenever \`nums[i]\` is even, \`i\` is even.

Return **any answer array** that satisfies this condition.

## Examples

**Example 1:**
\`\`\`
Input: nums = [4,2,5,7]
Output: [4,5,2,7]
Explanation: [4,7,2,5], [2,5,4,7], [2,7,4,5] are also accepted.
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [2,3]
Output: [2,3]
\`\`\`

## Constraints
- \`2 <= nums.length <= 2 * 10^4\`
- \`nums.length\` is even
- Half of the integers are even, half are odd
- \`0 <= nums[i] <= 1000\``,
    starterCode: `def sortArrayByParityII(nums: list[int]) -> list[int]:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def sortArrayByParityII(nums: list[int]) -> list[int]:
    n = len(nums)
    even_ptr = 0  # Points to even indices
    odd_ptr = 1   # Points to odd indices

    while even_ptr < n and odd_ptr < n:
        # Find even index with odd value
        while even_ptr < n and nums[even_ptr] % 2 == 0:
            even_ptr += 2
        # Find odd index with even value
        while odd_ptr < n and nums[odd_ptr] % 2 == 1:
            odd_ptr += 2
        # Swap if both found
        if even_ptr < n and odd_ptr < n:
            nums[even_ptr], nums[odd_ptr] = nums[odd_ptr], nums[even_ptr]
            even_ptr += 2
            odd_ptr += 2

    return nums`
    },
    hints: [
      { afterAttempt: 1, text: 'Use two pointers: one for even indices, one for odd indices' },
      { afterAttempt: 2, text: 'Find an even index with wrong value (odd) and an odd index with wrong value (even), then swap' },
      { afterAttempt: 3, text: 'Increment pointers by 2 to stay in even/odd index lanes' }
    ],
    testCases: [
      { input: '[4,2,5,7]', expectedOutput: '[4, 5, 2, 7]' },
      { input: '[2,3]', expectedOutput: '[2, 3]' },
      { input: '[3,4]', expectedOutput: '[4, 3]' }
    ],
    solutionExplanation: `## Two Pointer with Parity Lanes

Use two pointers that only traverse their respective "lanes":
- even_ptr: 0, 2, 4, ... (even indices)
- odd_ptr: 1, 3, 5, ... (odd indices)

Find misplaced elements in each lane and swap them.

Time: O(n)
Space: O(1)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-wiggle-sort',
    title: 'Wiggle Sort',
    description: 'Rearrange array into wiggle pattern: nums[0] <= nums[1] >= nums[2] <= nums[3]...',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Wiggle Sort

Given an integer array \`nums\`, reorder it such that:
\`nums[0] <= nums[1] >= nums[2] <= nums[3]...\`

You may assume the input array always has a valid answer.

## Examples

**Example 1:**
\`\`\`
Input: nums = [3,5,2,1,6,4]
Output: [3,5,1,6,2,4]
Explanation: [1,6,2,5,3,4] is also accepted.
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [6,6,5,6,3,8]
Output: [5,6,3,6,3,8]
\`\`\`

## Constraints
- \`1 <= nums.length <= 5 * 10^4\`
- \`0 <= nums[i] <= 10^4\`
- It is guaranteed there is an answer for the given input`,
    starterCode: `def wiggleSort(nums: list[int]) -> None:
    # Modify nums in-place
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def wiggleSort(nums: list[int]) -> None:
    for i in range(len(nums) - 1):
        # At even index: should be <= next
        # At odd index: should be >= next
        if (i % 2 == 0 and nums[i] > nums[i + 1]) or \\
           (i % 2 == 1 and nums[i] < nums[i + 1]):
            nums[i], nums[i + 1] = nums[i + 1], nums[i]`
    },
    hints: [
      { afterAttempt: 1, text: 'Process pairs of adjacent elements one at a time' },
      { afterAttempt: 2, text: 'At even index i: ensure nums[i] <= nums[i+1]. At odd index i: ensure nums[i] >= nums[i+1]' },
      { afterAttempt: 3, text: 'If the condition is violated, just swap the pair. This won\'t break previous pairs!' }
    ],
    testCases: [
      { input: '[3,5,2,1,6,4]', expectedOutput: '[3, 5, 1, 6, 2, 4]' },
      { input: '[1,2,3]', expectedOutput: '[1, 3, 2]' },
      { input: '[1]', expectedOutput: '[1]' }
    ],
    solutionExplanation: `## Greedy Single Pass

The key insight: swapping adjacent elements to fix the current position doesn't break previous positions.

For position i:
- If i is even: we need nums[i] <= nums[i+1]
- If i is odd: we need nums[i] >= nums[i+1]

If violated, swap. The swap is safe because:
- We already ensured nums[i-1] and nums[i] satisfy their condition
- Swapping nums[i] with nums[i+1] only makes nums[i] smaller (even) or larger (odd)

Time: O(n)
Space: O(1)`
  },

  // ==================== GROUP 4: Advanced Partition ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-sort-array-largest-number',
    title: 'Largest Number',
    description: 'Arrange numbers to form the largest possible number',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Largest Number

Given a list of non-negative integers \`nums\`, arrange them such that they form the largest number and return it.

Since the result may be very large, return it as a **string** instead of an integer.

## Examples

**Example 1:**
\`\`\`
Input: nums = [10,2]
Output: "210"
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [3,30,34,5,9]
Output: "9534330"
\`\`\`

## Constraints
- \`1 <= nums.length <= 100\`
- \`0 <= nums[i] <= 10^9\``,
    starterCode: `def largestNumber(nums: list[int]) -> str:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `from functools import cmp_to_key

def largestNumber(nums: list[int]) -> str:
    # Custom comparator: compare concatenations
    def compare(x, y):
        if x + y > y + x:
            return -1  # x should come first
        elif x + y < y + x:
            return 1   # y should come first
        else:
            return 0

    # Convert to strings and sort
    strs = [str(num) for num in nums]
    strs.sort(key=cmp_to_key(compare))

    # Handle edge case: all zeros
    if strs[0] == '0':
        return '0'

    return ''.join(strs)`
    },
    hints: [
      { afterAttempt: 1, text: 'This is a sorting problem with a custom comparator' },
      { afterAttempt: 2, text: 'To compare two numbers a and b: compare "ab" vs "ba" as strings' },
      { afterAttempt: 3, text: 'Use cmp_to_key from functools to convert comparator to key function' }
    ],
    testCases: [
      { input: '[10,2]', expectedOutput: '"210"' },
      { input: '[3,30,34,5,9]', expectedOutput: '"9534330"' },
      { input: '[0,0]', expectedOutput: '"0"' }
    ],
    solutionExplanation: `## Custom Sort Comparator

The key insight: to decide if a should come before b, compare "ab" vs "ba".

Example: 3 vs 30
- "330" vs "303"
- "330" > "303", so 3 comes first

This defines a total ordering that produces the largest number.

Edge case: [0, 0] should return "0", not "00".

Time: O(n log n) for sorting
Space: O(n) for string array`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-wiggle-sort-ii',
    title: 'Wiggle Sort II',
    description: 'Rearrange array into strict wiggle pattern with O(n) time and O(1) space',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Wiggle Sort II

Given an integer array \`nums\`, reorder it such that:
\`nums[0] < nums[1] > nums[2] < nums[3]...\`

You may assume the input array always has a valid answer.

## Examples

**Example 1:**
\`\`\`
Input: nums = [1,5,1,1,6,4]
Output: [1,6,1,5,1,4]
Explanation: [1,4,1,5,1,6] is also accepted.
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1,3,2,2,3,1]
Output: [2,3,1,3,1,2]
\`\`\`

## Constraints
- \`1 <= nums.length <= 5 * 10^4\`
- \`0 <= nums[i] <= 5000\`
- It is guaranteed that there is an answer

## Follow-up
Can you do it in O(n) time and/or in-place with O(1) extra space?`,
    starterCode: `def wiggleSort(nums: list[int]) -> None:
    # Modify nums in-place
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def wiggleSort(nums: list[int]) -> None:
    # Simple O(n log n) approach with O(n) space
    # For O(n) time O(1) space, use virtual indexing with median finding

    n = len(nums)
    sorted_nums = sorted(nums)

    # Split into smaller and larger halves
    mid = (n + 1) // 2
    smaller = sorted_nums[:mid][::-1]  # Reverse for interleaving from end
    larger = sorted_nums[mid:][::-1]

    # Interleave: smaller at even indices, larger at odd indices
    for i in range(len(smaller)):
        nums[2 * i] = smaller[i]
    for i in range(len(larger)):
        nums[2 * i + 1] = larger[i]`
    },
    hints: [
      { afterAttempt: 1, text: 'Unlike Wiggle Sort I, we need STRICT inequality. Simple adjacent swaps won\'t work.' },
      { afterAttempt: 2, text: 'One approach: sort, split into two halves, interleave them' },
      { afterAttempt: 3, text: 'Place smaller values at even indices, larger values at odd indices. Reverse each half to handle duplicates.' }
    ],
    testCases: [
      { input: '[1,5,1,1,6,4]', expectedOutput: '[1, 6, 1, 5, 1, 4]' },
      { input: '[1,3,2,2,3,1]', expectedOutput: '[2, 3, 1, 3, 1, 2]' },
      { input: '[1,2,3]', expectedOutput: '[1, 3, 2]' }
    ],
    solutionExplanation: `## Sort and Interleave

The key insight: split sorted array into smaller and larger halves, then interleave.

Tricky part: duplicates! If we have [4,5,5,6], naive interleaving gives [4,5,5,6] which violates 5 > 5.

Solution: Reverse each half before interleaving. This places duplicates as far apart as possible.

The O(n) time O(1) space solution uses:
1. Median finding (O(n) via QuickSelect)
2. Dutch National Flag partition around median
3. Virtual indexing to map logical positions to physical positions

Time: O(n log n) for this solution, O(n) possible
Space: O(n) for this solution, O(1) possible`
  },
];
