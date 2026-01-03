import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const moduleSlidingWindowLessonSmartPracticeExercises: ExerciseSection[] = [
  // NOTE: "Window Sums" (exercise-sw-window-sums) removed - duplicate of exercise-fixed-window-sums in main module
  // NOTE: "Maximum Sum Subarray of Size K" (exercise-max-sum-subarray-k) removed - duplicate of exercise-max-sum-subarray in main module
  {
  type: 'exercise',
  placement: 'module',
  id: 'exercise-google-average-continuous-substring',
  title: 'Maximum Average Subarray',
  description: 'Given an array of integers and a window size k, find the maximum average of any contiguous subarray of length k.',
  requiredForProgress: false,
  targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Fixed-size sliding window with running sum' },
  difficulty: 'easy',
  instruction: `# Average of Continuous Substring

Given an array of integers and a window size k, find the maximum average of any contiguous subarray of length k.

## Examples

**Example 1:**
- Input: \`nums = [1, 12, -5, -6, 50, 3], k = 4\`
- Output: \`12.75\`
- Explanation: Max average is (12 + -5 + -6 + 50) / 4 = 12.75

## Constraints
- \`n == nums.length\`
- \`1 <= k <= n <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\`

## Approach
Use sliding window to avoid recomputing sum. Track max sum, then divide by k.`,
  starterCode: `def findMaxAverage(nums: list[int], k: int) -> float:
    # Write your solution here
    pass`,
  solution: {
    afterAttempt: 3,
    text: `def findMaxAverage(nums: list[int], k: int) -> float:
    # Initial window sum
    window_sum = sum(nums[:k])
    max_sum = window_sum

    # Slide window
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum / k`
  },
  hints: [
    { afterAttempt: 1, text: 'Use sliding window to avoid recomputing sum' },
    { afterAttempt: 2, text: 'Maintain running sum: add new element, remove old element' },
    { afterAttempt: 3, text: 'Track max sum and divide by k at the end' }
  ],
  testCases: [
    { input: '[1, 12, -5, -6, 50, 3], 4', expectedOutput: '12.75' },
    { input: '[5], 1', expectedOutput: '5.0' },
    { input: '[0, 4, 0, 3, 2], 1', expectedOutput: '4.0' }
  ],
  solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand (30 sec)
Find max average of any subarray of size k.
Average = sum / k, so maximize sum.

### Step 2: Solution - Fixed Window
\`\`\`python
def findMaxAverage(nums, k):
    window = sum(nums[:k])
    max_sum = window
    
    for i in range(k, len(nums)):
        window += nums[i] - nums[i-k]
        max_sum = max(max_sum, window)
    
    return max_sum / k
\`\`\`
Time: O(n), Space: O(1)

### Key Takeaways
1. Same as max sum subarray of size k
2. Divide by k at the end for average`
  },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-contiguous-subarray-sum',
      title: 'Contiguous Subarray Sum',
      description: 'Classic sliding window problem - determine if any contiguous subarray sums to target.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Variable-size sliding window; each element added/removed at most once' },
      instruction: `# Contiguous Subarray Sum - Coding Exercise

Given an array of **non-negative integers** and an integer target, return \`True\` if a contiguous subarray sums up to the target. Otherwise, return \`False\`.

## Examples

**Example 1:**
- Input: \`arr = [1, 4, 6, 21]\`, \`target = 10\`
- Output: \`True\`
- Explanation: Subarray \`[4, 6]\` sums to 10.

**Example 2:**
- Input: \`arr = [1, 4, 6, 21]\`, \`target = 9\`
- Output: \`False\`
- Explanation: No contiguous subarray sums to 9.

**Example 3:**
- Input: \`arr = [1, 2, 3, 4, 5]\`, \`target = 9\`
- Output: \`True\`
- Explanation: Subarray \`[2, 3, 4]\` or \`[4, 5]\` sums to 9.

**Example 4:**
- Input: \`arr = [5, 0, 0, 5]\`, \`target = 5\`
- Output: \`True\`
- Explanation: Multiple subarrays work: \`[5]\`, \`[5, 0]\`, \`[5, 0, 0]\`, \`[0, 0, 5]\`, etc.

## Constraints
- \`1 <= arr.length <= 10^5\`
- \`0 <= arr[i] <= 10^4\`
- \`0 <= target <= 10^9\`

## Challenge
Implement both the O(n) sliding window approach AND the O(n) prefix sum approach. Which one uses less space?`,
      starterCode: `def contains_subarray_sum(arr, target):
    # Implement the sliding window approach
    # Time: O(n), Space: O(1)
    pass

# Test your solution
print(contains_subarray_sum([1, 4, 6, 21], 10))  # Should print True
print(contains_subarray_sum([1, 4, 6, 21], 9))   # Should print False
print(contains_subarray_sum([1, 2, 3, 4, 5], 9)) # Should print True
print(contains_subarray_sum([5, 0, 0, 5], 5))    # Should print True`,
      expectedOutput: `def contains_subarray_sum(arr, target):
    start = end = 0
    subtotal = 0

    while end < len(arr):
        subtotal += arr[end]
        end += 1

        while subtotal > target and start < end - 1:
            subtotal -= arr[start]
            start += 1

        if subtotal == target:
            return True

    return False

# Test your solution
print(contains_subarray_sum([1, 4, 6, 21], 10))  # Should print True
print(contains_subarray_sum([1, 4, 6, 21], 9))   # Should print False
print(contains_subarray_sum([1, 2, 3, 4, 5], 9)) # Should print True
print(contains_subarray_sum([5, 0, 0, 5], 5))    # Should print True`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Use two pointers: start and end. Expand by adding arr[end], shrink by subtracting arr[start] when sum exceeds target.',
          thinkAbout: [
            'Why can we shrink the window when sum > target?',
            'What property of positive integers makes this work?'
          ]
        },
        {
          afterAttempt: 2,
          text: 'Be careful with zero! Make sure start < end - 1 when shrinking to avoid empty windows causing issues.',
          thinkAbout: [
            'What happens if target is 0?',
            'What if the array contains zeros?'
          ]
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimal Solution - O(n) time, O(1) space

def contains_subarray_sum(arr, target):
    start = end = 0
    subtotal = 0

    while end < len(arr):
        # Expand window
        subtotal += arr[end]
        end += 1

        # Shrink window if sum exceeds target
        while subtotal > target and start < end - 1:
            subtotal -= arr[start]
            start += 1

        # Check if we found target
        if subtotal == target:
            return True

    return False

# Alternative: Prefix Sum + Set approach (O(n) time, O(n) space)
def contains_subarray_sum_set(arr, target):
    sums = set([0])  # Empty prefix sum
    prefix_sum = 0
    
    for num in arr:
        prefix_sum += num
        if (prefix_sum - target) in sums:
            return True
        sums.add(prefix_sum)
    
    return False`
      },
      testCases: [
        { input: '[1, 4, 6, 21], 10', expectedOutput: 'True' },
        { input: '[1, 4, 6, 21], 9', expectedOutput: 'False' },
        { input: '[1, 2, 3, 4, 5], 9', expectedOutput: 'True' },
        { input: '[5, 0, 0, 5], 5', expectedOutput: 'True' },
        { input: '[1, 2, 3], 6', expectedOutput: 'True' },
        { input: '[1, 2, 3], 10', expectedOutput: 'False' },
        { input: '[0, 0, 0], 0', expectedOutput: 'True' }
      ],
      solutionExplanation: `## Solution Evolution: O(n³) → O(n²) → O(n)

### 🔴 Approach 1: Triple Nested Loop - O(n³)
Generate all possible subarrays and compute their sums:
\`\`\`python
for i in range(len(arr)):
    for j in range(i, len(arr)):
        subtotal = sum(arr[i:j+1])  # O(n) per pair
        if subtotal == target:
            return True
\`\`\`

### 🟡 Approach 2: Double Loop - O(n²)
Build sum incrementally:
\`\`\`python
for i in range(len(arr)):
    subtotal = 0
    for j in range(i, len(arr)):
        subtotal += arr[j]  # O(1) per pair
        if subtotal == target:
            return True
\`\`\`

### 🟢 Approach 3: Prefix Sum + Set - O(n) time, O(n) space
\`\`\`python
sums = {0}
prefix_sum = 0
for num in arr:
    prefix_sum += num
    if (prefix_sum - target) in sums:
        return True
    sums.add(prefix_sum)
\`\`\`

### ✅ Approach 4: Sliding Window - O(n) time, O(1) space
The optimal solution! Works because all values are non-negative:
- Adding elements increases sum
- Removing elements decreases sum
- Each element enters and leaves window at most once

**Key insight:** With non-negative integers, if sum > target, shrinking window will decrease sum. If sum < target, expanding will increase sum.

### 🎯 Pattern Learned
**"Subarray Sum = Target with Non-Negative Integers"** → Variable-size sliding window. Expand right, shrink left, O(n) time, O(1) space.

### ⚠️ When Sliding Window DOESN'T Work
If the array contains **negative numbers**, sliding window fails! Use the prefix sum + set approach instead (Approach 3).`,
      complexityQuizPlacement: 'after',
      difficulty: 'medium',
      timeLimit: 1200,
      passingScore: 100
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-subarray-product-less-than-k',
      title: 'Code: Subarray Product Less Than K',
      description: 'Count contiguous subarrays where product is less than k using variable-size sliding window.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Variable-size sliding window, each element processed once' },
      instruction: `# Subarray Product Less Than K

Given an array of **positive integers** \`nums\` and an integer \`k\`, return the number of contiguous subarrays where the product of all elements is less than \`k\`.

## Examples

**Example 1:**
- Input: \`nums = [10,5,2,6]\`, \`k = 100\`
- Output: \`8\`
- Explanation: The 8 subarrays with product < 100 are: [10], [5], [2], [6], [10,5], [5,2], [2,6], [5,2,6]

**Example 2:**
- Input: \`nums = [1,2,3]\`, \`k = 0\`
- Output: \`0\`
- Explanation: No subarray has product < 0 (all numbers are positive)

## Constraints
- \`1 <= nums.length <= 3 * 10^4\`
- \`1 <= nums[i] <= 1000\`
- \`0 <= k <= 10^6\``,
      starterCode: `def num_subarray_product_less_than_k(nums, k):
    pass

# Test your solution
print(num_subarray_product_less_than_k([10,5,2,6], 100))  # Should print 8
print(num_subarray_product_less_than_k([1,2,3], 0))       # Should print 0`,
      expectedOutput: `def num_subarray_product_less_than_k(nums, k):
    if k <= 1:
        return 0
    
    left = 0
    product = 1
    count = 0
    
    for right in range(len(nums)):
        product *= nums[right]
        
        while product >= k and left <= right:
            product //= nums[left]
            left += 1
        
        count += right - left + 1
    
    return count

# Test your solution
print(num_subarray_product_less_than_k([10,5,2,6], 100))  # Should print 8
print(num_subarray_product_less_than_k([1,2,3], 0))       # Should print 0`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Use two pointers. Expand by multiplying nums[right]. Shrink by dividing nums[left] when product >= k.',
          thinkAbout: [
            'How do you count all valid subarrays ending at position right?',
            'If window [left...right] is valid, how many subarrays end at right?'
          ]
        },
        {
          afterAttempt: 2,
          text: 'When window [left...right] is valid, all subarrays ending at right are valid: [right], [right-1,right], ..., [left...right]. That\'s (right - left + 1) subarrays.',
          thinkAbout: [
            'Why do we count (right - left + 1) subarrays?',
            'What if k <= 1?'
          ]
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution: Variable-Size Sliding Window

def num_subarray_product_less_than_k(nums, k):
    if k <= 1:
        return 0  # No positive product can be < 1
    
    left = 0
    product = 1
    count = 0
    
    for right in range(len(nums)):
        # Expand window: multiply by new element
        product *= nums[right]
        
        # Shrink window: divide by left element when product >= k
        while product >= k and left <= right:
            product //= nums[left]
            left += 1
        
        # Count all valid subarrays ending at 'right'
        # If [left...right] is valid, then [right], [right-1,right], ..., [left...right] are all valid
        count += right - left + 1
    
    return count

# Key insight: When window [left...right] has product < k,
# all subarrays ending at 'right' are valid: (right - left + 1) subarrays`
      },
      testCases: [
        { input: '[10,5,2,6], 100', expectedOutput: '8' },
        { input: '[1,2,3], 0', expectedOutput: '0' },
        { input: '[1,1,1], 2', expectedOutput: '6' },
        { input: '[10,5,2,6], 1', expectedOutput: '0' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Count subarrays where product of all elements < k
- All elements are positive integers
- Need to count ALL valid subarrays, not just find one

### Step 2: Work Through Example (2 min)
\`\`\`
nums = [10, 5, 2, 6], k = 100

Valid subarrays (product < 100):
[10] = 10 ✓
[5] = 5 ✓
[2] = 2 ✓
[6] = 6 ✓
[10,5] = 50 ✓
[5,2] = 10 ✓
[2,6] = 12 ✓
[5,2,6] = 60 ✓

Invalid:
[10,5,2] = 100 ✗ (not less than 100)
[10,5,2,6] = 600 ✗

Answer: 8 subarrays
\`\`\`

### Step 3: Brute Force Approach (2 min)
\`\`\`python
def numSubarrayProductLessThanK_brute(nums, k):
    count = 0
    n = len(nums)
    for i in range(n):
        product = 1
        for j in range(i, n):
            product *= nums[j]
            if product < k:
                count += 1
            else:
                break  # Product only increases with positive numbers
    return count
\`\`\`
**Time: O(n²)**, Space: O(1)

### Step 4: Identify the Pattern (2 min)
"Since all numbers are positive, products only increase as we add elements. This means we can use a **sliding window**!"

**Key Insight:** When window [left...right] has product < k:
- All subarrays ending at 'right' are valid: [right], [left+1...right], ..., [left...right]
- That's (right - left + 1) subarrays!

### Step 5: Optimized Solution (2 min)
\`\`\`python
def numSubarrayProductLessThanK(nums, k):
    if k <= 1:
        return 0
    
    left = 0
    product = 1
    count = 0
    
    for right in range(len(nums)):
        product *= nums[right]
        
        while product >= k:
            product //= nums[left]
            left += 1
        
        count += right - left + 1  # All subarrays ending at right
    
    return count
\`\`\`

### Step 6: Trace Through (1 min)
\`\`\`
nums = [10, 5, 2, 6], k = 100

right=0: product=10, window=[10], count += 1 = 1
right=1: product=50, window=[10,5], count += 2 = 3
right=2: product=100 >= k! Shrink: product=10, left=1
         window=[5,2], count += 2 = 5
right=3: product=60, window=[5,2,6], count += 3 = 8

Answer: 8 ✓
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Each element enters and leaves window at most once
- **Space: O(1)** - Only tracking product, left pointer, count

### Key Takeaways
1. Positive integers → products are monotonic → sliding window works
2. Count subarrays ending at each position: (right - left + 1)
3. Edge case: k ≤ 1 means no valid subarrays (all products ≥ 1)`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-binary-subarray-with-sum',
      title: 'Code: Binary Subarray With Sum',
      description: 'Count subarrays with specific sum in binary array using variable-size sliding window.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Variable-size sliding window, count all valid windows' },
      instruction: `# Binary Subarray With Sum

Given a binary array \`nums\` and an integer \`goal\`, return the number of non-empty subarrays with sum equal to \`goal\`.

A subarray is a contiguous part of the array.

## Examples

**Example 1:**
- Input: \`nums = [1,0,1,0,1]\`, \`goal = 2\`
- Output: \`4\`
- Explanation: The 4 subarrays with sum 2 are: [1,0,1], [1,0,1,0], [0,1,0,1], [1,0,1]

**Example 2:**
- Input: \`nums = [0,0,0,0,0]\`, \`goal = 0\`
- Output: \`15\`
- Explanation: All 15 subarrays have sum 0

## Constraints
- \`1 <= nums.length <= 3 * 10^4\`
- \`nums[i]\` is either \`0\` or \`1\`
- \`0 <= goal <= nums.length\``,
      starterCode: `def num_subarrays_with_sum(nums, goal):
    pass

# Test your solution
print(num_subarrays_with_sum([1,0,1,0,1], 2))  # Should print 4
print(num_subarrays_with_sum([0,0,0,0,0], 0))  # Should print 15`,
      expectedOutput: `def num_subarrays_with_sum(nums, goal):
    def at_most(goal):
        if goal < 0:
            return 0
        left = 0
        count = 0
        current_sum = 0
        
        for right in range(len(nums)):
            current_sum += nums[right]
            
            while current_sum > goal:
                current_sum -= nums[left]
                left += 1
            
            count += right - left + 1
        
        return count
    
    return at_most(goal) - at_most(goal - 1)

# Test your solution
print(num_subarrays_with_sum([1,0,1,0,1], 2))  # Should print 4
print(num_subarrays_with_sum([0,0,0,0,0], 0))  # Should print 15`,
      hints: [
        {
          afterAttempt: 1,
          text: 'This is trickier than checking existence! You need to count ALL subarrays with sum == goal. Hint: Use the "at most" technique.',
          thinkAbout: [
            'How can you count subarrays with sum == goal?',
            'Can you count subarrays with sum <= goal and sum <= (goal-1)?'
          ]
        },
        {
          afterAttempt: 2,
          text: 'Count subarrays with sum <= goal, then count subarrays with sum <= (goal-1). The difference gives you exactly sum == goal.',
          thinkAbout: [
            'Why does (at_most(goal) - at_most(goal-1)) work?',
            'How do you count "at most" using sliding window?'
          ]
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution: Variable-Size Sliding Window with "At Most" Technique

def num_subarrays_with_sum(nums, goal):
    def at_most(goal):
        if goal < 0:
            return 0
        left = 0
        count = 0
        current_sum = 0
        
        for right in range(len(nums)):
            current_sum += nums[right]
            
            # Shrink window when sum > goal
            while current_sum > goal:
                current_sum -= nums[left]
                left += 1
            
            # Count all subarrays ending at 'right' with sum <= goal
            count += right - left + 1
        
        return count
    
    # Count subarrays with sum == goal
    # = Count subarrays with sum <= goal - Count subarrays with sum <= (goal-1)
    return at_most(goal) - at_most(goal - 1)

# Key insight: 
# - at_most(goal) counts all subarrays with sum <= goal
# - at_most(goal-1) counts all subarrays with sum <= goal-1
# - Their difference = subarrays with sum exactly == goal`
      },
      testCases: [
        { input: '[1,0,1,0,1], 2', expectedOutput: '4' },
        { input: '[0,0,0,0,0], 0', expectedOutput: '15' },
        { input: '[1,1,1,1], 3', expectedOutput: '2' },
        { input: '[1,0,1,0,1], 0', expectedOutput: '2' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Binary array (only 0s and 1s)
- Count subarrays with sum **exactly equal** to goal
- This is harder than just finding one subarray!

### Step 2: Work Through Example (2 min)
\`\`\`
nums = [1, 0, 1, 0, 1], goal = 2

All subarrays and their sums:
[1] = 1
[1,0] = 1
[1,0,1] = 2 ✓
[1,0,1,0] = 2 ✓
[1,0,1,0,1] = 3
[0] = 0
[0,1] = 1
[0,1,0] = 1
[0,1,0,1] = 2 ✓
[1] = 1
[1,0] = 1
[1,0,1] = 2 ✓
...

Answer: 4 subarrays with sum = 2
\`\`\`

### Step 3: Brute Force Approach (2 min)
\`\`\`python
def numSubarraysWithSum_brute(nums, goal):
    count = 0
    n = len(nums)
    for i in range(n):
        current_sum = 0
        for j in range(i, n):
            current_sum += nums[j]
            if current_sum == goal:
                count += 1
    return count
\`\`\`
**Time: O(n²)**, Space: O(1)

### Step 4: Key Insight - "At Most" Technique (2 min)
"Counting exactly equal is tricky with sliding window. But I can use a clever trick!"

**The Insight:**
- count(sum == k) = count(sum ≤ k) - count(sum ≤ k-1)
- I can count "at most" easily with sliding window!

\`\`\`
Subarrays with sum ≤ 2: [1], [1,0], [1,0,1], [0], [0,1], [0,1,0], etc.
Subarrays with sum ≤ 1: [1], [1,0], [0], [0,1], [0,1,0], etc.
Difference = subarrays with sum exactly 2
\`\`\`

### Step 5: Optimized Solution (2 min)
\`\`\`python
def numSubarraysWithSum(nums, goal):
    def atMost(k):
        if k < 0:
            return 0
        left = 0
        current_sum = 0
        count = 0
        
        for right in range(len(nums)):
            current_sum += nums[right]
            while current_sum > k:
                current_sum -= nums[left]
                left += 1
            count += right - left + 1
        
        return count
    
    return atMost(goal) - atMost(goal - 1)
\`\`\`

### Step 6: Trace "At Most" (1 min)
\`\`\`
atMost(2) for [1,0,1,0,1]:
right=0: sum=1, count+=1=1
right=1: sum=1, count+=2=3
right=2: sum=2, count+=3=6
right=3: sum=2, count+=4=10
right=4: sum=3>2, shrink→sum=2, count+=4=14
atMost(2) = 14

atMost(1) = 10

Answer: 14 - 10 = 4 ✓
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Two passes through array, each O(n)
- **Space: O(1)** - Only tracking sum, pointers, count

### Key Takeaways
1. **"At Most" Technique**: count(== k) = count(≤ k) - count(≤ k-1)
2. Sliding window easily counts "at most" by counting all subarrays ending at each position
3. This technique works for any "exact count" problem where elements are non-negative`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-subarray-sum-equals-k-negatives',
      title: 'Subarray Sum Equals K',
      description: 'Count subarrays with sum k when array can contain negatives - requires prefix sum approach, NOT sliding window.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(n)', notes: 'Prefix sum + hash map, sliding window fails with negatives' },
      instruction: `# Subarray Sum Equals K (With Negatives)

Given an array of integers \`nums\` and an integer \`k\`, return the total number of contiguous subarrays whose sum equals \`k\`.

**Important:** The array may contain **negative numbers**, so sliding window won't work! Use prefix sum + hash map approach.

## Examples

**Example 1:**
- Input: \`nums = [1,1,1]\`, \`k = 2\`
- Output: \`2\`
- Explanation: The 2 subarrays with sum 2 are: [1,1] (indices 0-1) and [1,1] (indices 1-2)

**Example 2:**
- Input: \`nums = [1,2,3]\`, \`k = 3\`
- Output: \`2\`
- Explanation: The 2 subarrays with sum 3 are: [1,2] and [3]

**Example 3:**
- Input: \`nums = [1,-1,0]\`, \`k = 0\`
- Output: \`3\`
- Explanation: The 3 subarrays with sum 0 are: [1,-1], [1,-1,0], [0]

## Constraints
- \`1 <= nums.length <= 2 * 10^4\`
- \`-1000 <= nums[i] <= 1000\`
- \`-10^7 <= k <= 10^7\``,
      starterCode: `def subarray_sum_equals_k(nums, k):
    pass

# Test your solution
print(subarray_sum_equals_k([1,1,1], 2))      # Should print 2
print(subarray_sum_equals_k([1,2,3], 3))      # Should print 2
print(subarray_sum_equals_k([1,-1,0], 0))    # Should print 3`,
      expectedOutput: `def subarray_sum_equals_k(nums, k):
    prefix_sum_count = {0: 1}  # Empty prefix sum
    prefix_sum = 0
    count = 0
    
    for num in nums:
        prefix_sum += num
        
        # Check if (prefix_sum - k) exists in map
        # If yes, prefix_sum - some_previous_prefix = k
        # Which means subarray between those indices sums to k
        if (prefix_sum - k) in prefix_sum_count:
            count += prefix_sum_count[prefix_sum - k]
        
        # Store current prefix sum
        prefix_sum_count[prefix_sum] = prefix_sum_count.get(prefix_sum, 0) + 1
    
    return count

# Test your solution
print(subarray_sum_equals_k([1,1,1], 2))      # Should print 2
print(subarray_sum_equals_k([1,2,3], 3))     # Should print 2
print(subarray_sum_equals_k([1,-1,0], 0))    # Should print 3`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Use prefix sums. Store each prefix sum in a hash map with its count. Check if (current_prefix_sum - k) exists.',
          thinkAbout: [
            'Why do we need to count occurrences of prefix sums?',
            'What does it mean if (prefix_sum - k) is in the map?'
          ]
        },
        {
          afterAttempt: 2,
          text: 'If prefix_sum[j] - prefix_sum[i] = k, then subarray[i+1...j] sums to k. We check if (prefix_sum - k) exists, and add its count to our answer.',
          thinkAbout: [
            'Why do we store count instead of just existence?',
            'What if multiple prefix sums have the same value?'
          ]
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution: Prefix Sum + Hash Map (Required for Negative Numbers)

def subarray_sum_equals_k(nums, k):
    prefix_sum_count = {0: 1}  # Empty prefix sum (before index 0)
    prefix_sum = 0
    count = 0
    
    for num in nums:
        prefix_sum += num
        
        # Check: if (prefix_sum - k) exists, we found valid subarrays
        # prefix_sum - some_previous_prefix = k
        # means subarray between those indices sums to k
        if (prefix_sum - k) in prefix_sum_count:
            count += prefix_sum_count[prefix_sum - k]
        
        # Store current prefix sum (with count for multiple occurrences)
        prefix_sum_count[prefix_sum] = prefix_sum_count.get(prefix_sum, 0) + 1
    
    return count

# Why sliding window fails with negatives:
# - Expanding might decrease sum
# - Shrinking might increase sum
# - Can't safely adjust window based on sum > or < k

# Why prefix sum works:
# - Works with any numbers (positive, negative, zero)
# - prefix_sum[j] - prefix_sum[i] = sum of subarray[i+1...j]
# - O(n) time, O(n) space`
      },
      testCases: [
        { input: '[1,1,1], 2', expectedOutput: '2' },
        { input: '[1,2,3], 3', expectedOutput: '2' },
        { input: '[1,-1,0], 0', expectedOutput: '3' },
        { input: '[-1,-1,1], 0', expectedOutput: '1' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Array can have **negative numbers**
- Count subarrays with sum exactly equal to k
- This is a critical constraint that changes everything!

### Step 2: Why Sliding Window Fails (1 min)
\`\`\`
nums = [1, -1, 1], k = 1

With negatives:
- Adding element might DECREASE sum
- Removing element might INCREASE sum
- Can't determine window direction from sum comparison!

Example: sum = 2, k = 1
- Should we shrink? But removing -1 might give sum = 3!
- Sliding window logic breaks completely.
\`\`\`

### Step 3: Brute Force Approach (2 min)
\`\`\`python
def subarraySum_brute(nums, k):
    count = 0
    for i in range(len(nums)):
        current_sum = 0
        for j in range(i, len(nums)):
            current_sum += nums[j]
            if current_sum == k:
                count += 1
    return count
\`\`\`
**Time: O(n²)**, Space: O(1)

### Step 4: Key Insight - Prefix Sum (2 min)
"I need a different approach. What if I use prefix sums?"

**Key Math:**
- prefix[j] = sum of nums[0...j]
- sum(nums[i+1...j]) = prefix[j] - prefix[i]
- If prefix[j] - prefix[i] = k, then subarray[i+1...j] sums to k
- So I need to find: prefix[j] - k = prefix[i]

### Step 5: Optimized Solution (2 min)
\`\`\`python
def subarraySum(nums, k):
    prefix_count = {0: 1}  # Empty prefix
    prefix_sum = 0
    count = 0
    
    for num in nums:
        prefix_sum += num
        
        # How many times have we seen (prefix_sum - k)?
        if (prefix_sum - k) in prefix_count:
            count += prefix_count[prefix_sum - k]
        
        # Store current prefix sum
        prefix_count[prefix_sum] = prefix_count.get(prefix_sum, 0) + 1
    
    return count
\`\`\`

### Step 6: Trace Through (1 min)
\`\`\`
nums = [1, -1, 0], k = 0

i=0: prefix=1, check 1-0=1 not in {0:1}, store {0:1, 1:1}
i=1: prefix=0, check 0-0=0 in {0:1}! count=1, store {0:2, 1:1}
i=2: prefix=0, check 0-0=0 in {0:2}! count=3, store {0:3, 1:1}

Answer: 3 ✓ ([1,-1], [-1,0]... wait, let me recount)
Actually: [1,-1]=0, [1,-1,0]=0, [0]=0 → 3 subarrays ✓
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Single pass through array
- **Space: O(n)** - Hash map stores prefix sums

### Key Takeaways
1. **Negatives break sliding window!** Sum not monotonic with window changes
2. **Prefix Sum + Hash Map** works for any integers
3. This is a common interview question - know when to switch from sliding window to prefix sum
4. Pattern: "count subarrays with sum = k" + negatives → prefix sum`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-max-vowels-substring',
      title: 'Code: Maximum Number of Vowels in a Substring of Given Length',
      description: 'Find the maximum number of vowels in any substring of length k.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Single pass, track vowel count incrementally' },
      instruction: `# Maximum Number of Vowels in a Substring of Given Length

Given a string \`s\` and an integer \`k\`, return the maximum number of vowel letters in any substring of \`s\` with length \`k\`.

Vowel letters in English are \`'a'\`, \`'e'\`, \`'i'\`, \`'o'\`, and \`'u'\`.

## Examples

**Example 1:**
- Input: \`s = "abciiidef"\`, \`k = 3\`
- Output: \`3\`
- Explanation: The substring "iii" contains 3 vowel letters.

**Example 2:**
- Input: \`s = "aeiou"\`, \`k = 2\`
- Output: \`2\`
- Explanation: Any substring of length 2 contains 2 vowels.

**Example 3:**
- Input: \`s = "leetcode"\`, \`k = 3\`
- Output: \`2\`
- Explanation: "lee", "eet", "cod", etc. all have 2 vowels.

## Constraints
- \`1 <= s.length <= 10^5\`
- \`s\` consists of lowercase English letters.
- \`1 <= k <= s.length\`

## Challenge
Use fixed-length window: track vowel count incrementally!`,
      starterCode: `def maxVowels(s, k):
    pass`,
      expectedOutput: `def maxVowels(s, k):
    vowels = set('aeiou')
    
    # Initialize: count vowels in first k characters
    vowel_count = sum(1 for char in s[:k] if char in vowels)
    max_vowels = vowel_count
    
    # Slide window
    for r in range(k, len(s)):
        # Add new character if vowel
        if s[r] in vowels:
            vowel_count += 1
        # Remove old character if vowel
        if s[r - k] in vowels:
            vowel_count -= 1
        
        max_vowels = max(max_vowels, vowel_count)
    
    return max_vowels`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Track vowel count in current window. Initialize by counting vowels in first k characters. When sliding, add 1 if s[r] is vowel, subtract 1 if s[r-k] is vowel.'
        },
        {
          afterAttempt: 2,
          text: 'Use a set to check if a character is a vowel. Update vowel_count incrementally as you slide the window.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimal Solution - O(n) time, O(1) space

def maxVowels(s, k):
    vowels = set('aeiou')
    
    # Initialize: count vowels in first k characters
    vowel_count = sum(1 for char in s[:k] if char in vowels)
    max_vowels = vowel_count
    
    # Slide window
    for r in range(k, len(s)):
        # Add new character if vowel
        if s[r] in vowels:
            vowel_count += 1
        # Remove old character if vowel
        if s[r - k] in vowels:
            vowel_count -= 1
        
        max_vowels = max(max_vowels, vowel_count)
    
    return max_vowels

# Key insight: Track vowel count incrementally using fixed window pattern`
      },
      testCases: [
        { input: '"abciiidef", 3', expectedOutput: '3' },
        { input: '"aeiou", 2', expectedOutput: '2' },
        { input: '"leetcode", 3', expectedOutput: '2' },
        { input: '"rhythms", 4', expectedOutput: '0' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Find maximum vowels in any substring of **exactly** length k
- Vowels: a, e, i, o, u
- Fixed window size = k

### Step 2: Work Through Example (1 min)
\`\`\`
s = "abciiidef", k = 3

Windows of size 3:
"abc" → 1 vowel (a)
"bci" → 1 vowel (i)
"cii" → 2 vowels (i, i)
"iii" → 3 vowels ← Maximum!
"iid" → 2 vowels
"ide" → 2 vowels
"def" → 1 vowel

Answer: 3
\`\`\`

### Step 3: Brute Force Approach (2 min)
\`\`\`python
def maxVowels_brute(s, k):
    vowels = set('aeiou')
    max_count = 0
    for i in range(len(s) - k + 1):
        count = sum(1 for c in s[i:i+k] if c in vowels)
        max_count = max(max_count, count)
    return max_count
\`\`\`
**Time: O(n × k)** - For each window, count all k characters
**Space: O(1)**

### Step 4: Identify the Pattern (1 min)
"Fixed window size k... I should use the **Fixed-Size Sliding Window** pattern!"

**Key Insight:** Instead of recounting all k characters each time, I can:
- Add the new character entering the window
- Remove the old character leaving the window
- Update count in O(1) per slide!

### Step 5: Optimized Solution (2 min)
\`\`\`python
def maxVowels(s, k):
    vowels = set('aeiou')
    
    # Initialize: count vowels in first window
    count = sum(1 for c in s[:k] if c in vowels)
    max_count = count
    
    # Slide window
    for r in range(k, len(s)):
        if s[r] in vowels:      # Add new char
            count += 1
        if s[r - k] in vowels:  # Remove old char
            count -= 1
        max_count = max(max_count, count)
    
    return max_count
\`\`\`

### Step 6: Trace Through (1 min)
\`\`\`
s = "abciiidef", k = 3

Init: "abc" → count = 1, max = 1
r=3: add 'i'(+1), remove 'a'(-1) → count = 1, max = 1
r=4: add 'i'(+1), remove 'b'(0) → count = 2, max = 2
r=5: add 'i'(+1), remove 'c'(0) → count = 3, max = 3
r=6: add 'd'(0), remove 'i'(-1) → count = 2, max = 3
r=7: add 'e'(+1), remove 'i'(-1) → count = 2, max = 3
r=8: add 'f'(0), remove 'i'(-1) → count = 1, max = 3

Answer: 3 ✓
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Single pass after O(k) initialization
- **Space: O(1)** - Just a counter and vowel set (fixed size)

### Key Takeaways
1. **Fixed-Size Window** = slide and update incrementally
2. O(n × k) brute → O(n) optimized by avoiding recount
3. Pattern: "find max/min in all windows of size k" → fixed sliding window`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-permutation-in-string',
      title: 'Code: Permutation in String',
      description: 'Check if one string contains a permutation of another string.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Fixed window with frequency comparison' },
      instruction: `# Permutation in String

Given two strings \`s1\` and \`s2\`, return \`true\` if \`s2\` contains a permutation of \`s1\`, or \`false\` otherwise.

In other words, return \`true\` if one of \`s1\`'s permutations is the substring of \`s2\`.

## Examples

**Example 1:**
- Input: \`s1 = "ab"\`, \`s2 = "eidbaooo"\`
- Output: \`true\`
- Explanation: \`s2\` contains one permutation of \`s1\` ("ba").

**Example 2:**
- Input: \`s1 = "ab"\`, \`s2 = "eidboaoo"\`
- Output: \`false\`

**Example 3:**
- Input: \`s1 = "adc"\`, \`s2 = "dcda"\`
- Output: \`true\`

## Constraints
- \`1 <= s1.length, s2.length <= 10^4\`
- \`s1\` and \`s2\` consist of lowercase English letters.

## Challenge
Use fixed-length window (size = len(s1)) and compare character frequencies!`,
      starterCode: `def checkInclusion(s1, s2):
    pass`,
      expectedOutput: `def checkInclusion(s1, s2):
    if len(s1) > len(s2):
        return False
    
    # Frequency map for s1
    s1_freq = {}
    for char in s1:
        s1_freq[char] = s1_freq.get(char, 0) + 1
    
    # Initialize window frequency for first len(s1) characters
    window_freq = {}
    for i in range(len(s1)):
        window_freq[s2[i]] = window_freq.get(s2[i], 0) + 1
    
    # Check if first window matches
    if window_freq == s1_freq:
        return True
    
    # Slide window
    for r in range(len(s1), len(s2)):
        # Add new character
        window_freq[s2[r]] = window_freq.get(s2[r], 0) + 1
        # Remove old character
        window_freq[s2[r - len(s1)]] -= 1
        if window_freq[s2[r - len(s1)]] == 0:
            del window_freq[s2[r - len(s1)]]
        
        # Check if window matches s1
        if window_freq == s1_freq:
            return True
    
    return False`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Build frequency map for s1. Use fixed window of size len(s1) in s2. Track frequency of characters in current window. Compare window frequency with s1 frequency.'
        },
        {
          afterAttempt: 2,
          text: 'Initialize window frequency for first len(s1) characters. Slide window: add s2[r], remove s2[r-len(s1)]. After each slide, check if window_freq == s1_freq.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimal Solution - O(n) time, O(1) space (26 characters max)

def checkInclusion(s1, s2):
    if len(s1) > len(s2):
        return False
    
    # Frequency map for s1
    s1_freq = {}
    for char in s1:
        s1_freq[char] = s1_freq.get(char, 0) + 1
    
    # Initialize window frequency for first len(s1) characters
    window_freq = {}
    for i in range(len(s1)):
        window_freq[s2[i]] = window_freq.get(s2[i], 0) + 1
    
    # Check if first window matches
    if window_freq == s1_freq:
        return True
    
    # Slide window
    for r in range(len(s1), len(s2)):
        # Add new character
        window_freq[s2[r]] = window_freq.get(s2[r], 0) + 1
        # Remove old character
        window_freq[s2[r - len(s1)]] -= 1
        if window_freq[s2[r - len(s1)]] == 0:
            del window_freq[s2[r - len(s1)]]
        
        # Check if window matches s1
        if window_freq == s1_freq:
            return True
    
    return False

# Key insight: Fixed window with frequency comparison
# Permutation = same character frequencies`
      },
      testCases: [
        { input: '"ab", "eidbaooo"', expectedOutput: 'True' },
        { input: '"ab", "eidboaoo"', expectedOutput: 'False' },
        { input: '"adc", "dcda"', expectedOutput: 'True' },
        { input: '"hello", "ooolleoooleh"', expectedOutput: 'False' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Check if s2 contains ANY permutation of s1
- Permutation = same characters, different order
- Need to find a window in s2 that has exact same character frequencies as s1

### Step 2: Work Through Example (1 min)
\`\`\`
s1 = "ab", s2 = "eidbaooo"

s1 frequencies: {a:1, b:1}

Check windows of size 2 in s2:
"ei" → {e:1, i:1} ✗
"id" → {i:1, d:1} ✗
"db" → {d:1, b:1} ✗
"ba" → {b:1, a:1} ✓ Match!

Answer: True
\`\`\`

### Step 3: Brute Force Approach (2 min)
\`\`\`python
def checkInclusion_brute(s1, s2):
    from collections import Counter
    s1_count = Counter(s1)
    k = len(s1)
    
    for i in range(len(s2) - k + 1):
        window = s2[i:i+k]
        if Counter(window) == s1_count:
            return True
    return False
\`\`\`
**Time: O(n × k)** - Create Counter for each window
**Space: O(k)**

### Step 4: Identify the Pattern (1 min)
"Fixed window size len(s1)... I can update frequency counts incrementally!"

**Key Insight:** A permutation has the **exact same character frequencies**. Use a sliding window and update frequencies in O(1) per slide.

### Step 5: Optimized Solution (2 min)
\`\`\`python
def checkInclusion(s1, s2):
    from collections import Counter
    if len(s1) > len(s2):
        return False
    
    s1_count = Counter(s1)
    window = Counter(s2[:len(s1)])
    
    if window == s1_count:
        return True
    
    for r in range(len(s1), len(s2)):
        window[s2[r]] += 1
        old = s2[r - len(s1)]
        window[old] -= 1
        if window[old] == 0:
            del window[old]
        if window == s1_count:
            return True
    
    return False
\`\`\`

### Step 6: Trace Through (1 min)
\`\`\`
s1 = "ab", s2 = "eidbaooo"

s1_count = {a:1, b:1}
Init window "ei": {e:1, i:1} ≠ s1_count

r=2: add 'd', remove 'e' → {i:1, d:1} ≠
r=3: add 'b', remove 'i' → {d:1, b:1} ≠
r=4: add 'a', remove 'd' → {b:1, a:1} = s1_count ✓

Answer: True ✓
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Single pass, O(26) comparison per step = O(1)
- **Space: O(1)** - At most 26 characters in frequency maps

### Key Takeaways
1. Permutation = same character frequencies
2. Fixed window of size len(s1), update incrementally
3. Compare Counter objects (or use matches counter for O(1) comparison)`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-find-all-anagrams',
      title: 'Code: Find All Anagrams in a String',
      description: 'Find all starting indices of anagrams of a pattern.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Fixed window with frequency comparison' },
      instruction: `# Find All Anagrams in a String

Given two strings \`s\` and \`p\`, return an array of all the start indices of \`p\`'s anagrams in \`s\`. You may return the answer in any order.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

## Examples

**Example 1:**
- Input: \`s = "cbaebabacd"\`, \`p = "abc"\`
- Output: \`[0, 6]\`
- Explanation: The substring with start index = 0 is "cba", which is an anagram of "abc". The substring with start index = 6 is "bac", which is an anagram of "abc".

**Example 2:**
- Input: \`s = "abab"\`, \`p = "ab"\`
- Output: \`[0, 1, 2]\`
- Explanation: All substrings with length 2 are anagrams of "ab".

## Constraints
- \`1 <= s.length, p.length <= 3 * 10^4\`
- \`s\` and \`p\` consist of lowercase English letters.

## Challenge
Use fixed-length window (size = len(p)) and track character frequencies!`,
      starterCode: `def findAnagrams(s, p):
    pass`,
      expectedOutput: `def findAnagrams(s, p):
    if len(p) > len(s):
        return []
    
    result = []
    
    # Frequency map for p
    p_freq = {}
    for char in p:
        p_freq[char] = p_freq.get(char, 0) + 1
    
    # Initialize window frequency for first len(p) characters
    window_freq = {}
    for i in range(len(p)):
        window_freq[s[i]] = window_freq.get(s[i], 0) + 1
    
    # Check if first window is anagram
    if window_freq == p_freq:
        result.append(0)
    
    # Slide window
    for r in range(len(p), len(s)):
        # Add new character
        window_freq[s[r]] = window_freq.get(s[r], 0) + 1
        # Remove old character
        window_freq[s[r - len(p)]] -= 1
        if window_freq[s[r - len(p)]] == 0:
            del window_freq[s[r - len(p)]]
        
        # Check if window is anagram
        if window_freq == p_freq:
            result.append(r - len(p) + 1)
    
    return result`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Similar to Permutation in String, but collect all starting indices. Build frequency map for p, use fixed window of size len(p) in s, compare frequencies.'
        },
        {
          afterAttempt: 2,
          text: 'Initialize window frequency for first len(p) characters. Slide window: add s[r], remove s[r-len(p)]. After each slide, if frequencies match, add starting index (r-len(p)+1) to result.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimal Solution - O(n) time, O(1) space

def findAnagrams(s, p):
    if len(p) > len(s):
        return []
    
    result = []
    
    # Frequency map for p
    p_freq = {}
    for char in p:
        p_freq[char] = p_freq.get(char, 0) + 1
    
    # Initialize window frequency for first len(p) characters
    window_freq = {}
    for i in range(len(p)):
        window_freq[s[i]] = window_freq.get(s[i], 0) + 1
    
    # Check if first window is anagram
    if window_freq == p_freq:
        result.append(0)
    
    # Slide window
    for r in range(len(p), len(s)):
        # Add new character
        window_freq[s[r]] = window_freq.get(s[r], 0) + 1
        # Remove old character
        window_freq[s[r - len(p)]] -= 1
        if window_freq[s[r - len(p)]] == 0:
            del window_freq[s[r - len(p)]]
        
        # Check if window is anagram
        if window_freq == p_freq:
            result.append(r - len(p) + 1)
    
    return result

# Key insight: Fixed window with frequency comparison
# Collect all starting indices where frequencies match`
      },
      testCases: [
        { input: '"cbaebabacd", "abc"', expectedOutput: '[0, 6]' },
        { input: '"abab", "ab"', expectedOutput: '[0, 1, 2]' },
        { input: '"baa", "aa"', expectedOutput: '[1]' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Find ALL starting indices of anagrams (not just one)
- Anagram = permutation = same character frequencies
- Return list of all valid starting positions

### Step 2: Work Through Example (1 min)
\`\`\`
s = "cbaebabacd", p = "abc"

p frequencies: {a:1, b:1, c:1}

Windows of size 3:
"cba" at 0 → {c:1, b:1, a:1} ✓
"bae" at 1 → {b:1, a:1, e:1} ✗
"aeb" at 2 → {a:1, e:1, b:1} ✗
...
"bac" at 6 → {b:1, a:1, c:1} ✓

Answer: [0, 6]
\`\`\`

### Step 3: Brute Force (1 min)
\`\`\`python
def findAnagrams_brute(s, p):
    from collections import Counter
    result = []
    p_count = Counter(p)
    for i in range(len(s) - len(p) + 1):
        if Counter(s[i:i+len(p)]) == p_count:
            result.append(i)
    return result
\`\`\`
**Time: O(n × k)**, Space: O(k)

### Step 4: Optimized Solution (2 min)
\`\`\`python
def findAnagrams(s, p):
    from collections import Counter
    if len(p) > len(s):
        return []
    
    p_count = Counter(p)
    window = Counter(s[:len(p)])
    result = []
    
    if window == p_count:
        result.append(0)
    
    for r in range(len(p), len(s)):
        window[s[r]] += 1
        old = s[r - len(p)]
        window[old] -= 1
        if window[old] == 0:
            del window[old]
        if window == p_count:
            result.append(r - len(p) + 1)
    
    return result
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Single pass with O(26) comparison per step
- **Space: O(1)** - Fixed alphabet size (26 letters)

### Key Takeaways
1. Same as Permutation in String, but collect ALL indices instead of returning on first match
2. Fixed window + frequency comparison
3. Delete keys with 0 count to ensure proper Counter comparison`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-grumpy-bookstore-owner',
      title: 'Code: Grumpy Bookstore Owner',
      description: 'Find maximum customers satisfied using a fixed window of minutes.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Fixed window to find best minutes to be not grumpy' },
      instruction: `# Grumpy Bookstore Owner

There is a bookstore owner that has a store open for \`n\` minutes. Every minute, some number of customers enter the store. You are given an integer array \`customers\` of length \`n\` where \`customers[i]\` is the number of customers that enter the store at the start of the \`i\`th minute, and all those customers leave after the end of that minute.

On some minutes, the bookstore owner is grumpy. You are given a binary array \`grumpy\` where \`grumpy[i] = 1\` if the bookstore owner is grumpy during the \`i\`th minute, and \`grumpy[i] = 0\` otherwise.

When the bookstore owner is grumpy, the customers of that minute are not satisfied, otherwise, they are satisfied.

The bookstore owner knows a secret technique to keep themselves not grumpy for \`minutes\` consecutive minutes, but can only use it once.

Return the maximum number of customers that can be satisfied throughout the day.

## Examples

**Example 1:**
- Input: \`customers = [1,0,1,2,1,1,7,5]\`, \`grumpy = [0,1,0,1,0,1,0,1]\`, \`minutes = 3\`
- Output: \`16\`
- Explanation: The bookstore owner keeps themselves not grumpy for the last 3 minutes. The maximum number of customers that can be satisfied = 1 + 1 + 1 + 1 + 7 + 5 = 16.

**Example 2:**
- Input: \`customers = [1]\`, \`grumpy = [0]\`, \`minutes = 1\`
- Output: \`1\`

## Constraints
- \`n == customers.length == grumpy.length\`
- \`1 <= minutes <= n <= 2 * 10^4\`
- \`0 <= customers[i] <= 1000\`
- \`grumpy[i]\` is either \`0\` or \`1\`.

## Challenge
Use fixed window to find the best minutes window where being not grumpy maximizes satisfied customers!`,
      starterCode: `def maxSatisfied(customers, grumpy, minutes):
    pass`,
      expectedOutput: `def maxSatisfied(customers, grumpy, minutes):
    # Base satisfied customers (when owner is not grumpy)
    base_satisfied = sum(customers[i] for i in range(len(customers)) if grumpy[i] == 0)
    
    # Find window of 'minutes' where being not grumpy adds most customers
    # This is customers[i] where grumpy[i] == 1
    max_extra = 0
    current_extra = 0
    
    # Initialize: extra customers in first window
    for i in range(minutes):
        if grumpy[i] == 1:
            current_extra += customers[i]
    max_extra = current_extra
    
    # Slide window
    for r in range(minutes, len(customers)):
        # Add new minute if grumpy
        if grumpy[r] == 1:
            current_extra += customers[r]
        # Remove old minute if grumpy
        if grumpy[r - minutes] == 1:
            current_extra -= customers[r - minutes]
        
        max_extra = max(max_extra, current_extra)
    
    return base_satisfied + max_extra`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Calculate base satisfied customers (when not grumpy). Then use fixed window to find the minutes-length window where being not grumpy adds the most customers (sum of customers[i] where grumpy[i]==1).'
        },
        {
          afterAttempt: 2,
          text: 'Track extra customers (from grumpy minutes) in current window. Slide window: add customers[r] if grumpy[r], subtract customers[r-minutes] if grumpy[r-minutes]. Find maximum extra.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimal Solution - O(n) time, O(1) space

def maxSatisfied(customers, grumpy, minutes):
    # Base satisfied customers (when owner is not grumpy)
    base_satisfied = sum(customers[i] for i in range(len(customers)) if grumpy[i] == 0)
    
    # Find window of 'minutes' where being not grumpy adds most customers
    # This is customers[i] where grumpy[i] == 1
    max_extra = 0
    current_extra = 0
    
    # Initialize: extra customers in first window
    for i in range(minutes):
        if grumpy[i] == 1:
            current_extra += customers[i]
    max_extra = current_extra
    
    # Slide window
    for r in range(minutes, len(customers)):
        # Add new minute if grumpy
        if grumpy[r] == 1:
            current_extra += customers[r]
        # Remove old minute if grumpy
        if grumpy[r - minutes] == 1:
            current_extra -= customers[r - minutes]
        
        max_extra = max(max_extra, current_extra)
    
    return base_satisfied + max_extra

# Key insight: Fixed window to find best minutes to use secret technique
# Maximize extra customers from grumpy minutes`
      },
      testCases: [
        { input: '[1,0,1,2,1,1,7,5], [0,1,0,1,0,1,0,1], 3', expectedOutput: '16' },
        { input: '[1], [0], 1', expectedOutput: '1' },
        { input: '[4,10,10], [1,1,0], 2', expectedOutput: '24' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Owner is grumpy some minutes (customers not satisfied)
- Secret technique: be NOT grumpy for 'minutes' consecutive minutes
- Maximize total satisfied customers

### Step 2: Break Down the Problem (2 min)
\`\`\`
customers = [1,0,1,2,1,1,7,5]
grumpy    = [0,1,0,1,0,1,0,1]
minutes = 3

Base satisfied (grumpy=0): 1+1+1+7 = 10
Now find which 3-minute window gives most "extra" from grumpy minutes
\`\`\`

### Step 3: Key Insight (1 min)
"I need to find the window where using the technique saves the most customers!"

**The Trick:**
- Base = customers when NOT grumpy (always satisfied)
- Extra = customers during grumpy minutes that we "save" with technique
- Answer = Base + max(Extra in any window of size 'minutes')

### Step 4: Optimized Solution (2 min)
\`\`\`python
def maxSatisfied(customers, grumpy, minutes):
    # Step 1: Base satisfied (non-grumpy)
    base = sum(c for c, g in zip(customers, grumpy) if g == 0)
    
    # Step 2: Find window with max extra (grumpy customers)
    extra = sum(customers[i] for i in range(minutes) if grumpy[i])
    max_extra = extra
    
    for r in range(minutes, len(customers)):
        if grumpy[r]:
            extra += customers[r]
        if grumpy[r - minutes]:
            extra -= customers[r - minutes]
        max_extra = max(max_extra, extra)
    
    return base + max_extra
\`\`\`

### Step 5: Trace Through (1 min)
\`\`\`
customers = [1,0,1,2,1,1,7,5], grumpy = [0,1,0,1,0,1,0,1], minutes = 3

Base = 1+1+1+7 = 10
Window [0-2]: extra from grumpy = 0 (only grumpy[1]=0 customers)
Window [1-3]: extra = 0+2 = 2
...
Window [5-7]: extra = 1+0+5 = 6 ← Maximum!

Answer: 10 + 6 = 16 ✓
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Single pass for base + single pass sliding window
- **Space: O(1)** - Just counters

### Key Takeaways
1. Decompose problem: base satisfaction + extra from technique
2. Fixed window to find optimal position for technique
3. Only count grumpy minutes in window (those are the ones we "save")`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-max-points-cards',
      title: 'Code: Maximum Points You Can Obtain from Cards',
      description: 'Find maximum points by taking k cards from either end.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(k)', space: 'O(1)', notes: 'Fixed window approach: find minimum sum of n-k cards' },
      instruction: `# Maximum Points You Can Obtain from Cards

There are several cards arranged in a row, and each card has an associated number of points. The points are given in the integer array \`cardPoints\`.

In one step, you can take one card from the beginning or from the end of the row. You have to take exactly \`k\` cards.

Your score is the sum of the points of the cards you have taken.

Given the integer array \`cardPoints\` and the integer \`k\`, return the maximum score you can obtain.

## Examples

**Example 1:**
- Input: \`cardPoints = [1,2,3,4,5,6,1]\`, \`k = 3\`
- Output: \`12\`
- Explanation: After the first step, your score will always be 1. However, choosing the rightmost card first will maximize your total score. The optimal strategy is to take the three cards on the right, giving a final score of 1 + 6 + 5 = 12.

**Example 2:**
- Input: \`cardPoints = [2,2,2]\`, \`k = 2\`
- Output: \`4\`
- Explanation: Regardless of which two cards you take, your score will always be 4.

**Example 3:**
- Input: \`cardPoints = [9,7,7,9,7,7,9]\`, \`k = 7\`
- Output: \`55\`
- Explanation: You have to take all the cards. Your score is the sum of all points.

## Constraints
- \`1 <= cardPoints.length <= 10^5\`
- \`1 <= k <= cardPoints.length\`
- \`1 <= cardPoints[i] <= 10^4\`

## Challenge
Think: if we take k cards from ends, we leave n-k cards in the middle. Use fixed window to find minimum sum of n-k consecutive cards!`,
      starterCode: `def maxScore(cardPoints, k):
    pass`,
      expectedOutput: `def maxScore(cardPoints, k):
    n = len(cardPoints)
    total_sum = sum(cardPoints)
    
    # If k == n, take all cards
    if k == n:
        return total_sum
    
    # Find minimum sum of n-k consecutive cards (middle window)
    window_size = n - k
    window_sum = sum(cardPoints[:window_size])
    min_window_sum = window_sum
    
    # Slide window to find minimum
    for r in range(window_size, n):
        window_sum = window_sum - cardPoints[r - window_size] + cardPoints[r]
        min_window_sum = min(min_window_sum, window_sum)
    
    # Maximum score = total - minimum middle window
    return total_sum - min_window_sum`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Key insight: Taking k cards from ends = leaving n-k cards in the middle. Maximum score = total_sum - minimum_sum_of_middle_window. Use fixed window to find minimum sum of n-k consecutive cards.'
        },
        {
          afterAttempt: 2,
          text: 'Calculate total sum. Use fixed window of size n-k to find minimum sum of consecutive cards. Return total_sum - min_window_sum.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimal Solution - O(n) time, O(1) space

def maxScore(cardPoints, k):
    n = len(cardPoints)
    total_sum = sum(cardPoints)
    
    # If k == n, take all cards
    if k == n:
        return total_sum
    
    # Find minimum sum of n-k consecutive cards (middle window)
    window_size = n - k
    window_sum = sum(cardPoints[:window_size])
    min_window_sum = window_sum
    
    # Slide window to find minimum
    for r in range(window_size, n):
        window_sum = window_sum - cardPoints[r - window_size] + cardPoints[r]
        min_window_sum = min(min_window_sum, window_sum)
    
    # Maximum score = total - minimum middle window
    return total_sum - min_window_sum

# Key insight: Taking k from ends = leaving n-k in middle
# Maximize score = minimize middle window sum
# Use fixed window to find minimum sum of n-k consecutive cards`
      },
      testCases: [
        { input: '[1,2,3,4,5,6,1], 3', expectedOutput: '12' },
        { input: '[2,2,2], 2', expectedOutput: '4' },
        { input: '[9,7,7,9,7,7,9], 7', expectedOutput: '55' },
        { input: '[1,79,80,1,1,1,200,1], 3', expectedOutput: '202' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Take exactly k cards from beginning OR end
- Maximize sum of taken cards
- Can mix: some from front, some from back

### Step 2: Key Insight (2 min)
"If I take k cards from the ends, I'm leaving n-k cards in the middle!"

\`\`\`
cards = [1, 2, 3, 4, 5, 6, 1], k = 3

Taking 3 from ends = leaving 4 in middle
[1, 2, 3, 4, 5, 6, 1]
     └───────┘
     middle (n-k)

max(taken) = total - min(middle)
\`\`\`

### Step 3: Brute Force (1 min)
\`\`\`python
def maxScore_brute(cardPoints, k):
    # Try all combinations: i from left, k-i from right
    max_score = 0
    for i in range(k + 1):
        score = sum(cardPoints[:i]) + sum(cardPoints[-(k-i):] if k-i > 0 else [])
        max_score = max(max_score, score)
    return max_score
\`\`\`
**Time: O(k²)** if using slices, can be O(k) with precomputation

### Step 4: Optimized Solution (2 min)
\`\`\`python
def maxScore(cardPoints, k):
    n = len(cardPoints)
    window_size = n - k
    
    # Find minimum sum of middle window
    window_sum = sum(cardPoints[:window_size])
    min_sum = window_sum
    
    for r in range(window_size, n):
        window_sum += cardPoints[r] - cardPoints[r - window_size]
        min_sum = min(min_sum, window_sum)
    
    return sum(cardPoints) - min_sum
\`\`\`

### Complexity Analysis
- **Time: O(n)** - One pass to find minimum window
- **Space: O(1)** - Just counters

### Key Takeaways
1. **Complement thinking**: maximize ends = minimize middle
2. Fixed window of size (n - k) to find minimum middle sum
3. Answer = total_sum - min_middle_sum`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-min-swaps-group-ones',
      title: 'Code: Minimum Swaps to Group All 1\'s Together',
      description: 'Find minimum swaps needed to group all 1\'s together.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Fixed window: find window with most 1\'s' },
      instruction: `# Minimum Swaps to Group All 1's Together

Given a binary array \`data\`, return the minimum number of swaps required to group all 1's present in the array together in any place in the array.

## Examples

**Example 1:**
- Input: \`data = [1,0,1,0,1]\`
- Output: \`1\`
- Explanation: There are 3 ways to group all 1's together:
  - [1,1,1,0,0] using 1 swap.
  - [0,1,1,1,0] using 2 swaps.
  - [0,0,1,1,1] using 1 swap.
  The minimum is 1.

**Example 2:**
- Input: \`data = [0,0,0,1,0]\`
- Output: \`0\`
- Explanation: Since there is only one 1 in the array, no swaps needed.

**Example 3:**
- Input: \`data = [1,0,1,0,1,0,0,1,1,0,1]\`
- Output: \`3\`
- Explanation: One possible solution that uses 3 swaps is [0,0,0,0,0,1,1,1,1,1,1].

## Constraints
- \`1 <= data.length <= 10^5\`
- \`data[i]\` is either \`0\` or \`1\`.

## Challenge
Key insight: Find the window of length (total_ones) with the most 1's. Swaps needed = total_ones - ones_in_best_window!`,
      starterCode: `def minSwaps(data):
    pass`,
      expectedOutput: `def minSwaps(data):
    total_ones = sum(data)
    
    if total_ones == 0:
        return 0
    
    # Find window of length total_ones with most 1's
    # Initialize: count 1's in first window
    window_ones = sum(data[:total_ones])
    max_ones = window_ones
    
    # Slide window
    for r in range(total_ones, len(data)):
        window_ones += data[r]      # Add new element
        window_ones -= data[r - total_ones]  # Remove old element
        max_ones = max(max_ones, window_ones)
    
    # Swaps needed = total_ones - max_ones_in_window
    return total_ones - max_ones`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Count total 1\'s. Use fixed window of size total_ones. Find window with maximum 1\'s. Swaps needed = total_ones - max_ones_in_window (we need to swap 0\'s in the best window).'
        },
        {
          afterAttempt: 2,
          text: 'The best window has the most 1\'s. The number of 0\'s in that window = swaps needed. So swaps = total_ones - max_ones_in_window.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimal Solution - O(n) time, O(1) space

def minSwaps(data):
    total_ones = sum(data)
    
    if total_ones == 0:
        return 0
    
    # Find window of length total_ones with most 1's
    # Initialize: count 1's in first window
    window_ones = sum(data[:total_ones])
    max_ones = window_ones
    
    # Slide window
    for r in range(total_ones, len(data)):
        window_ones += data[r]      # Add new element
        window_ones -= data[r - total_ones]  # Remove old element
        max_ones = max(max_ones, window_ones)
    
    # Swaps needed = total_ones - max_ones_in_window
    # (number of 0's in the best window)
    return total_ones - max_ones

# Key insight: Best window has most 1's
# Swaps = 0's in best window = total_ones - max_ones_in_window`
      },
      testCases: [
        { input: '[1,0,1,0,1]', expectedOutput: '1' },
        { input: '[0,0,0,1,0]', expectedOutput: '0' },
        { input: '[1,0,1,0,1,0,0,1,1,0,1]', expectedOutput: '3' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Group all 1's together (contiguous)
- Swap = exchange any two elements
- Minimize number of swaps

### Step 2: Key Insight (2 min)
"If I have k ones, they need to end up in k consecutive positions!"

\`\`\`
data = [1, 0, 1, 0, 1]
total_ones = 3

Final state must have 3 consecutive 1's:
[1,1,1,0,0] or [0,1,1,1,0] or [0,0,1,1,1]

Which window of size 3 already has the most 1's?
\`\`\`

**The Trick:** Find window of size total_ones with MAXIMUM 1's.
Swaps needed = 0's in that window = total_ones - max_ones_in_window

### Step 3: Brute Force (1 min)
\`\`\`python
def minSwaps_brute(data):
    total_ones = sum(data)
    min_swaps = float('inf')
    for i in range(len(data) - total_ones + 1):
        zeros_in_window = total_ones - sum(data[i:i+total_ones])
        min_swaps = min(min_swaps, zeros_in_window)
    return min_swaps if min_swaps != float('inf') else 0
\`\`\`
**Time: O(n × k)**, Space: O(1)

### Step 4: Optimized Solution (2 min)
\`\`\`python
def minSwaps(data):
    k = sum(data)  # total ones = window size
    if k == 0:
        return 0
    
    ones = sum(data[:k])  # ones in first window
    max_ones = ones
    
    for r in range(k, len(data)):
        ones += data[r] - data[r - k]
        max_ones = max(max_ones, ones)
    
    return k - max_ones  # zeros in best window
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Single pass sliding window
- **Space: O(1)** - Just counters

### Key Takeaways
1. Window size = total number of 1's (that's how many must be grouped)
2. Find window with most 1's already there (least work needed)
3. Swaps = 0's in best window = positions we need to fill`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-substring-concatenation-words',
      title: 'Code: Substring with Concatenation of All Words',
      description: 'Find all starting indices of substring that is a concatenation of all words.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n × m × k)', space: 'O(m × k)', notes: 'Fixed window with word matching' },
      instruction: `# Substring with Concatenation of All Words

You are given a string \`s\` and an array of strings \`words\`. All strings of \`words\` are of the same length.

A concatenated substring in \`s\` is a substring that contains all the strings of \`words\` concatenated in any order.

Return the starting indices of all the concatenated substrings in \`s\`. You can return the answer in any order.

## Examples

**Example 1:**
- Input: \`s = "barfoothefoobarman"\`, \`words = ["foo","bar"]\`
- Output: \`[0,9]\`
- Explanation: The substring starting at 0 is "barfoo". It is the concatenation of ["bar","foo"].
The substring starting at 9 is "foobar". It is the concatenation of ["foo","bar"].

**Example 2:**
- Input: \`s = "wordgoodgoodgoodbestword"\`, \`words = ["word","good","best","word"]\`
- Output: \`[]\`

**Example 3:**
- Input: \`s = "barfoofoobarthefoobarman"\`, \`words = ["bar","foo","the"]\`
- Output: \`[6,9,12]\`

## Constraints
- \`1 <= s.length <= 10^4\`
- \`1 <= words.length <= 5000\`
- \`1 <= words[i].length <= 30\`
- \`s\` and \`words[i]\` consist of lowercase English letters.

## Challenge
Use fixed window approach: window size = total length of all words. Check if window contains all words!`,
      starterCode: `def findSubstring(s, words):
    pass`,
      expectedOutput: `def findSubstring(s, words):
    if not words or not s:
        return []
    
    word_len = len(words[0])
    total_len = len(words) * word_len
    
    # Frequency map for words
    word_freq = {}
    for word in words:
        word_freq[word] = word_freq.get(word, 0) + 1
    
    result = []
    
    # Try each starting position
    for start in range(len(s) - total_len + 1):
        # Extract words from current window
        window_words = {}
        for i in range(len(words)):
            word_start = start + i * word_len
            word = s[word_start:word_start + word_len]
            window_words[word] = window_words.get(word, 0) + 1
        
        # Check if frequencies match
        if window_words == word_freq:
            result.append(start)
    
    return result`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Window size = len(words) * len(words[0]). For each starting position, extract all words from the window and compare frequencies with words array.'
        },
        {
          afterAttempt: 2,
          text: 'Build frequency map for words. For each starting position, extract words of length word_len from s, build frequency map, compare with words frequency.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution - O(n × m × k) time, O(m × k) space
# where n = len(s), m = len(words), k = len(words[0])

def findSubstring(s, words):
    if not words or not s:
        return []
    
    word_len = len(words[0])
    total_len = len(words) * word_len
    
    # Frequency map for words
    word_freq = {}
    for word in words:
        word_freq[word] = word_freq.get(word, 0) + 1
    
    result = []
    
    # Try each starting position
    for start in range(len(s) - total_len + 1):
        # Extract words from current window
        window_words = {}
        for i in range(len(words)):
            word_start = start + i * word_len
            word = s[word_start:word_start + word_len]
            window_words[word] = window_words.get(word, 0) + 1
        
        # Check if frequencies match
        if window_words == word_freq:
            result.append(start)
    
    return result

# Key insight: Fixed window of size total_len
# Extract words and compare frequencies`
      },
      testCases: [
        { input: '"barfoothefoobarman", ["foo","bar"]', expectedOutput: '[0, 9]' },
        { input: '"wordgoodgoodgoodbestword", ["word","good","best","word"]', expectedOutput: '[]' },
        { input: '"barfoofoobarthefoobarman", ["bar","foo","the"]', expectedOutput: '[6, 9, 12]' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Find substrings that contain ALL words (any order)
- All words have same length
- Return starting indices of all such substrings

### Step 2: Key Insight (2 min)
\`\`\`
s = "barfoothefoobarman", words = ["foo","bar"]

word_len = 3, total_len = 6
Window of size 6:
"barfoo" at 0 → {bar:1, foo:1} = {foo:1, bar:1} ✓
"thefoo" at 6 → {the:1, foo:1} ≠ ✗
"foobar" at 9 → {foo:1, bar:1} ✓
\`\`\`

### Step 3: Brute Force (1 min)
\`\`\`python
def findSubstring_brute(s, words):
    from collections import Counter
    word_freq = Counter(words)
    word_len = len(words[0])
    total_len = word_len * len(words)
    result = []
    
    for i in range(len(s) - total_len + 1):
        window_words = [s[i+j:i+j+word_len] for j in range(0, total_len, word_len)]
        if Counter(window_words) == word_freq:
            result.append(i)
    return result
\`\`\`
**Time: O(n × m × k)**, Space: O(m × k)

### Step 4: Optimized with Sliding Window (2 min)
\`\`\`python
def findSubstring(s, words):
    if not s or not words:
        return []
    
    word_len = len(words[0])
    word_count = len(words)
    total_len = word_len * word_count
    word_freq = Counter(words)
    result = []
    
    for i in range(word_len):  # Start at each offset
        left = i
        window = Counter()
        count = 0
        
        for j in range(i, len(s) - word_len + 1, word_len):
            word = s[j:j + word_len]
            if word in word_freq:
                window[word] += 1
                count += 1
                
                while window[word] > word_freq[word]:
                    left_word = s[left:left + word_len]
                    window[left_word] -= 1
                    count -= 1
                    left += word_len
                
                if count == word_count:
                    result.append(left)
            else:
                window.clear()
                count = 0
                left = j + word_len
    
    return result
\`\`\`

### Complexity Analysis
- **Time: O(n × word_len)** with sliding window optimization
- **Space: O(m)** for frequency maps

### Key Takeaways
1. Fixed window size = sum of all word lengths
2. Can optimize by sliding word-by-word (not char-by-char)
3. Compare word frequencies, not string matching`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-max-consecutive-ones-iii',
      title: 'Code: Max Consecutive Ones III',
      description: 'Find the longest subarray containing at most k zeros using sliding window.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Sliding window tracking zeros' },
      instruction: `# Max Consecutive Ones III

Given an array of 0's and 1's and a number \`k\`, find the longest subarray that contains at most k 0's.

## Examples

**Example 1:**
- Input: \`nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2\`
- Output: \`6\`
- Explanation: Flip two 0s to get \`[1,1,1,0,0,1,1,1,1,1,1]\` with 6 consecutive 1s

**Example 2:**
- Input: \`nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3\`
- Output: \`10\`

## Constraints
- \`1 <= nums.length <= 10^5\`
- \`nums[i]\` is 0 or 1
- \`0 <= k <= nums.length\`

## Challenge
Implement an O(n) solution using the sliding window technique.`,
      starterCode: `def longestOnes(nums, k):
    # Your solution here
    pass`,
      expectedOutput: `def longestOnes(nums, k):
    left = 0
    zeros = 0
    max_length = 0
    
    for right in range(len(nums)):
        if nums[right] == 0:
            zeros += 1
        
        while zeros > k:
            if nums[left] == 0:
                zeros -= 1
            left += 1
        
        max_length = max(max_length, right - left + 1)
    
    return max_length`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Track the number of zeros in your current window. When zeros exceed k, shrink from the left.'
        },
        {
          afterAttempt: 2,
          text: 'Use two pointers (left and right). Expand right, count zeros. If zeros > k, shrink left until zeros <= k.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `def longestOnes(nums, k):
    left = 0
    zeros = 0
    max_length = 0
    
    for right in range(len(nums)):
        if nums[right] == 0:
            zeros += 1
        
        while zeros > k:
            if nums[left] == 0:
                zeros -= 1
            left += 1
        
        max_length = max(max_length, right - left + 1)
    
    return max_length`
      },
      testCases: [
        { input: '[1,1,1,0,0,0,1,1,1,1,0], 2', expectedOutput: '6' },
        { input: '[0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], 3', expectedOutput: '10' },
        { input: '[0,0,0,0,0], 0', expectedOutput: '0' },
        { input: '[1,1,1,1], 0', expectedOutput: '4' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Find longest contiguous subarray with at most k zeros
- Can "flip" up to k zeros to ones
- Maximize the length of consecutive 1's

### Step 2: Work Through Example (1 min)
\`\`\`
nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2

Can flip 2 zeros:
[1,1,1,0,0,0,1,1,1,1,0]
       ↑ ↑         ← flip these two
[1,1,1,0,0,1,1,1,1,1,1] = 6 consecutive 1's
\`\`\`

### Step 3: Brute Force (2 min)
\`\`\`python
def longestOnes_brute(nums, k):
    max_len = 0
    for i in range(len(nums)):
        zeros = 0
        for j in range(i, len(nums)):
            if nums[j] == 0:
                zeros += 1
            if zeros <= k:
                max_len = max(max_len, j - i + 1)
            else:
                break
    return max_len
\`\`\`
**Time: O(n²)**, Space: O(1)

### Step 4: Key Insight (1 min)
"This is finding the longest window with at most k zeros!"

The **Maximum Window** pattern:
- Expand as long as constraint (zeros ≤ k) is satisfied
- Shrink when constraint is violated
- Track maximum valid window size

### Step 5: Optimized Solution (2 min)
\`\`\`python
def longestOnes(nums, k):
    left = zeros = max_length = 0
    
    for right in range(len(nums)):
        if nums[right] == 0:
            zeros += 1
        
        while zeros > k:
            if nums[left] == 0:
                zeros -= 1
            left += 1
        
        max_length = max(max_length, right - left + 1)
    
    return max_length
\`\`\`

### Step 6: Trace Through (1 min)
\`\`\`
nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2

r=0-2: window=[1,1,1], zeros=0, max=3
r=3: window=[1,1,1,0], zeros=1, max=4
r=4: window=[1,1,1,0,0], zeros=2, max=5
r=5: zeros=3>k! shrink until zeros=2
     window=[0,0,0,1,1,1,1], zeros=2, max=6
...

Answer: 6 ✓
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Each element added once, removed at most once
- **Space: O(1)** - Just counters

### Key Takeaways
1. "Flip k zeros" = "window with at most k zeros"
2. Maximum window pattern: expand while valid, shrink when invalid
3. Each element enters and leaves window at most once → O(n)`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-longest-substring-no-repeat',
      title: 'Code: Longest Substring Without Repeating Characters',
      description: 'Find longest substring without repeating characters using maximum window pattern.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(k)', notes: 'Single pass, hash set for uniqueness' },
      instruction: `# Longest Substring Without Repeating Characters

Given a string \`s\`, find the length of the **longest substring** without repeating characters.

## Examples

**Example 1:**
- Input: \`s = "abcabcbb"\`
- Output: \`3\`
- Explanation: The answer is "abc", with length 3

**Example 2:**
- Input: \`s = "bbbbb"\`
- Output: \`1\`

**Example 3:**
- Input: \`s = "pwwkew"\`
- Output: \`3\`

## Constraints
- \`0 <= s.length <= 50,000\`
- \`s\` consists of English letters, digits, symbols and spaces

## Challenge
Use maximum window: expand when unique, shrink when duplicate found!`,
      starterCode: `def lengthOfLongestSubstring(s):
    pass`,
      expectedOutput: `def lengthOfLongestSubstring(s):
    seen = set()
    left = 0
    max_len = 0

    for right in range(len(s)):
        # Shrink window while duplicate exists
        while s[right] in seen:
            seen.remove(s[left])
            left += 1

        # Window is valid now, expand
        seen.add(s[right])
        max_len = max(max_len, right - left + 1)

    return max_len`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Use a hash set to track characters in current window. When duplicate found, shrink from left until duplicate removed. Then expand and update max.'
        },
        {
          afterAttempt: 2,
          text: 'Track seen characters. When s[right] in seen, shrink window (remove s[left]) until duplicate gone. Then add s[right] and update max length.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimal Solution - O(n) time, O(k) space

def lengthOfLongestSubstring(s):
    seen = set()
    left = 0
    max_len = 0

    for right in range(len(s)):
        # Shrink window while duplicate exists
        while s[right] in seen:
            seen.remove(s[left])
            left += 1

        # Window is valid now, expand
        seen.add(s[right])
        max_len = max(max_len, right - left + 1)

    return max_len

# Key insight: Maximum window pattern - shrink when duplicate, expand otherwise`
      },
      testCases: [
        { input: '"abcabcbb"', expectedOutput: '3' },
        { input: '"bbbbb"', expectedOutput: '1' },
        { input: '"pwwkew"', expectedOutput: '3' },
        { input: '""', expectedOutput: '0' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Find longest substring with NO repeating characters
- Classic interview problem (LeetCode #3)

### Step 2: Work Through Example (1 min)
\`\`\`
s = "abcabcbb"

Substrings without repeats:
"a" ✓, "ab" ✓, "abc" ✓ (len=3)
"abca" ✗ (a repeats)
"bca" ✓, "cab" ✓, "abc" ✓
...
Maximum: 3 ("abc")
\`\`\`

### Step 3: Brute Force (1 min)
\`\`\`python
def lengthOfLongestSubstring_brute(s):
    max_len = 0
    for i in range(len(s)):
        seen = set()
        for j in range(i, len(s)):
            if s[j] in seen:
                break
            seen.add(s[j])
            max_len = max(max_len, j - i + 1)
    return max_len
\`\`\`
**Time: O(n²)**, Space: O(k)

### Step 4: Key Insight (1 min)
"When I find a duplicate, I don't need to restart from scratch - just shrink from the left until the duplicate is gone!"

### Step 5: Optimized Solution (2 min)
\`\`\`python
def lengthOfLongestSubstring(s):
    seen = set()
    left = max_len = 0
    
    for right in range(len(s)):
        while s[right] in seen:
            seen.remove(s[left])
            left += 1
        seen.add(s[right])
        max_len = max(max_len, right - left + 1)
    
    return max_len
\`\`\`

### Step 6: Trace Through (1 min)
\`\`\`
s = "abcabcbb"

r=0: seen={a}, max=1
r=1: seen={a,b}, max=2
r=2: seen={a,b,c}, max=3
r=3: 'a' in seen! shrink: remove 'a', seen={b,c}
     add 'a': seen={b,c,a}, max=3
...

Answer: 3 ✓
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Each character added once, removed at most once
- **Space: O(k)** - k = size of character set (at most 128 ASCII)

### Key Takeaways
1. Maximum window: expand while unique, shrink when duplicate
2. Set tracks characters in current window
3. Alternative: use hash map to track last index of each character for O(n) single pass`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-longest-repeating-character-replacement',
      title: 'Code: Longest Repeating Character Replacement',
      description: 'Find longest substring with same letter after at most k replacements.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Single pass, track character frequencies' },
      instruction: `# Longest Repeating Character Replacement

You are given a string \`s\` and an integer \`k\`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most \`k\` times.

Return the length of the longest substring containing the same letter you can get after performing the above operations.

## Examples

**Example 1:**
- Input: \`s = "ABAB"\`, \`k = 2\`
- Output: \`4\`
- Explanation: Replace the two 'A's with two 'B's or vice versa.

**Example 2:**
- Input: \`s = "AABABBA"\`, \`k = 1\`
- Output: \`4\`
- Explanation: Replace the one 'A' in the middle with 'B' and form "AABBBBA". The substring "BBBB" has length 4.

## Constraints
- \`1 <= s.length <= 10^5\`
- \`s\` consists of only uppercase English letters
- \`0 <= k <= s.length\`

## Challenge
Use maximum window: expand when replacements needed <= k, shrink when too many replacements needed!`,
      starterCode: `def characterReplacement(s, k):
    pass`,
      expectedOutput: `def characterReplacement(s, k):
    freq = {}
    left = 0
    max_len = 0
    max_freq = 0  # Frequency of most common character in window
    
    for right in range(len(s)):
        # Add current character
        freq[s[right]] = freq.get(s[right], 0) + 1
        max_freq = max(max_freq, freq[s[right]])
        
        # Shrink if replacements needed > k
        # Replacements needed = window_size - max_freq
        while (right - left + 1) - max_freq > k:
            freq[s[left]] -= 1
            left += 1
            # Update max_freq (can recalculate or track)
            max_freq = max(freq.values()) if freq else 0
        
        max_len = max(max_len, right - left + 1)
    
    return max_len`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Track character frequencies in window. Replacements needed = window_size - max_frequency. Expand when replacements <= k, shrink when replacements > k.'
        },
        {
          afterAttempt: 2,
          text: 'Maintain frequency map. Track max_freq (most common char). Shrink when (right-left+1) - max_freq > k. Update max_len after each valid window.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimal Solution - O(n) time, O(1) space (26 chars max)

def characterReplacement(s, k):
    freq = {}
    left = 0
    max_len = 0
    max_freq = 0  # Frequency of most common character in window
    
    for right in range(len(s)):
        # Add current character
        freq[s[right]] = freq.get(s[right], 0) + 1
        max_freq = max(max_freq, freq[s[right]])
        
        # Shrink if replacements needed > k
        # Replacements needed = window_size - max_freq
        while (right - left + 1) - max_freq > k:
            freq[s[left]] -= 1
            left += 1
            # Recalculate max_freq (or track more efficiently)
            max_freq = max(freq.values()) if freq else 0
        
        max_len = max(max_len, right - left + 1)
    
    return max_len

# Key insight: Replacements needed = window_size - max_frequency
# Maximum window: expand when valid, shrink when too many replacements`
      },
      testCases: [
        { input: '"ABAB", 2', expectedOutput: '4' },
        { input: '"AABABBA", 1', expectedOutput: '4' },
        { input: '"AAAA", 2', expectedOutput: '4' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Replace at most k characters to make longest uniform substring
- Uppercase letters only
- Want ALL same character (can be any character)

### Step 2: Work Through Example (1 min)
\`\`\`
s = "AABABBA", k = 1

Window "AABA": A=3, B=1. Need to replace 1 B → valid!
Window "AABAB": A=3, B=2. Need to replace 2 chars → invalid!
Window "ABABB": A=2, B=3. Need to replace 2 chars → invalid!
Window "BABBA": A=1, B=4. Need to replace 1 A → valid! len=5... 

Wait, let me check "AABB" → A=2, B=2, need 2 replacements.
Best: "BBBB" (after replacing middle A) = length 4
\`\`\`

### Step 3: Key Insight (2 min)
"To make all chars same, I need to replace (window_size - max_frequency) characters!"

**The Formula:**
- replacements_needed = window_size - count_of_most_frequent_char
- If replacements_needed ≤ k → window is valid

### Step 4: Optimized Solution (2 min)
\`\`\`python
def characterReplacement(s, k):
    freq = {}
    left = max_len = max_freq = 0
    
    for right in range(len(s)):
        freq[s[right]] = freq.get(s[right], 0) + 1
        max_freq = max(max_freq, freq[s[right]])
        
        # Window invalid: need more than k replacements
        while (right - left + 1) - max_freq > k:
            freq[s[left]] -= 1
            left += 1
        
        max_len = max(max_len, right - left + 1)
    
    return max_len
\`\`\`

### Step 5: Trace Through (1 min)
\`\`\`
s = "AABABBA", k = 1

r=0: freq={A:1}, max_freq=1, replacements=0, max_len=1
r=1: freq={A:2}, max_freq=2, replacements=0, max_len=2
r=2: freq={A:2,B:1}, max_freq=2, replacements=1, max_len=3
r=3: freq={A:3,B:1}, max_freq=3, replacements=1, max_len=4
r=4: freq={A:3,B:2}, max_freq=3, replacements=2>k! shrink
     left=1, freq={A:2,B:2}, replacements=2>k! shrink
     left=2, freq={A:1,B:2}, replacements=2>k! shrink
     left=3, freq={A:1,B:1}, replacements=1, max_len=4
...

Answer: 4 ✓
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Each char enters/leaves window once
- **Space: O(1)** - At most 26 letters

### Key Takeaways
1. Key formula: replacements = window_size - max_freq
2. Track most frequent char in window
3. Shrink when more than k replacements needed`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-equal-substrings-budget',
      title: 'Code: Get Equal Substrings Within Budget',
      description: 'Find longest substring where cost to make equal <= budget.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Single pass, track cost incrementally' },
      instruction: `# Get Equal Substrings Within Budget

You are given two strings \`s\` and \`t\` of the same length and an integer \`maxCost\`.

You want to change \`s\` to \`t\`. Changing the \`i\`th character of \`s\` to \`i\`th character of \`t\` costs \`|s[i] - t[i]|\` (the absolute difference between the ASCII values).

Return the maximum length of a substring of \`s\` that can be changed to be the same as the corresponding substring of \`t\` with a cost less than or equal to \`maxCost\`.

## Examples

**Example 1:**
- Input: \`s = "abcd"\`, \`t = "bcdf"\`, \`maxCost = 3\`
- Output: \`3\`
- Explanation: "abc" of s can be changed to "bcd" of t. Cost = |1-2| + |2-3| + |3-4| = 3.

**Example 2:**
- Input: \`s = "abcd"\`, \`t = "cdef"\`, \`maxCost = 3\`
- Output: \`1\`
- Explanation: Each character in s costs too much to change to corresponding character in t.

## Constraints
- \`1 <= s.length <= 10^5\`
- \`t.length == s.length\`
- \`0 <= maxCost <= 10^6\`
- \`s\` and \`t\` consist of only lowercase English letters.

## Challenge
Use maximum window: expand when cost <= maxCost, shrink when cost > maxCost!`,
      starterCode: `def equalSubstring(s, t, maxCost):
    pass`,
      expectedOutput: `def equalSubstring(s, t, maxCost):
    left = 0
    current_cost = 0
    max_len = 0
    
    for right in range(len(s)):
        # Add cost of current character
        current_cost += abs(ord(s[right]) - ord(t[right]))
        
        # Shrink if cost exceeds maxCost
        while current_cost > maxCost:
            current_cost -= abs(ord(s[left]) - ord(t[left]))
            left += 1
        
        # Window is valid, update max length
        max_len = max(max_len, right - left + 1)
    
    return max_len`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Track current cost in window. Add cost when expanding (abs(s[r]-t[r])). Shrink when cost > maxCost. Update max_len for valid windows.'
        },
        {
          afterAttempt: 2,
          text: 'Calculate cost incrementally. When adding s[right], add abs(ord(s[right])-ord(t[right])). When removing s[left], subtract its cost. Track max length.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimal Solution - O(n) time, O(1) space

def equalSubstring(s, t, maxCost):
    left = 0
    current_cost = 0
    max_len = 0
    
    for right in range(len(s)):
        # Add cost of current character
        current_cost += abs(ord(s[right]) - ord(t[right]))
        
        # Shrink if cost exceeds maxCost
        while current_cost > maxCost:
            current_cost -= abs(ord(s[left]) - ord(t[left]))
            left += 1
        
        # Window is valid, update max length
        max_len = max(max_len, right - left + 1)
    
    return max_len

# Key insight: Maximum window with cost constraint
# Expand when cost <= maxCost, shrink when cost > maxCost`
      },
      testCases: [
        { input: '"abcd", "bcdf", 3', expectedOutput: '3' },
        { input: '"abcd", "cdef", 3', expectedOutput: '1' },
        { input: '"abcd", "acde", 0', expectedOutput: '1' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Change s to match t (character by character)
- Cost = sum of |ASCII differences| for positions we change
- Find longest substring where total cost ≤ maxCost

### Step 2: Work Through Example (1 min)
\`\`\`
s = "abcd", t = "bcdf", maxCost = 3

Position costs:
i=0: |a-b| = 1
i=1: |b-c| = 1
i=2: |c-d| = 1
i=3: |d-f| = 2

Windows:
"a"→"b": cost=1 ✓
"ab"→"bc": cost=2 ✓
"abc"→"bcd": cost=3 ✓ (length 3)
"abcd"→"bcdf": cost=5 > 3 ✗

Answer: 3
\`\`\`

### Step 3: Brute Force (1 min)
\`\`\`python
def equalSubstring_brute(s, t, maxCost):
    n = len(s)
    costs = [abs(ord(s[i]) - ord(t[i])) for i in range(n)]
    max_len = 0
    for i in range(n):
        total = 0
        for j in range(i, n):
            total += costs[j]
            if total <= maxCost:
                max_len = max(max_len, j - i + 1)
            else:
                break
    return max_len
\`\`\`
**Time: O(n²)**, Space: O(n)

### Step 4: Optimized Solution (2 min)
\`\`\`python
def equalSubstring(s, t, maxCost):
    left = cost = max_len = 0
    
    for right in range(len(s)):
        cost += abs(ord(s[right]) - ord(t[right]))
        
        while cost > maxCost:
            cost -= abs(ord(s[left]) - ord(t[left]))
            left += 1
        
        max_len = max(max_len, right - left + 1)
    
    return max_len
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Single pass
- **Space: O(1)** - Just counters

### Key Takeaways
1. Pre-compute position costs or compute on the fly
2. Maximum window pattern with sum constraint
3. Similar to "max subarray with sum ≤ k"`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-fruit-into-baskets',
      title: 'Code: Fruit Into Baskets',
      description: 'Find longest subarray with at most 2 distinct values.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Single pass, frequency map for distinct count' },
      instruction: `# Fruit Into Baskets

You are visiting a farm that has a single row of fruit trees arranged from left to right. The trees are represented by an integer array \`fruits\` where \`fruits[i]\` is the type of fruit the \`i\`th tree produces.

You want to collect as much fruit as possible. However, the owner has some strict rules:

- You only have **two baskets**, and each basket can only hold a **single type** of fruit.
- There is no limit on the amount of fruit each basket can hold.
- Starting from any tree of your choice, you must pick **exactly one fruit** from every tree (including the start tree) while moving to the right. The picked fruits must fit in one of your baskets.
- Once you reach a tree with fruit that cannot fit in your baskets, you must stop.

Given the integer array \`fruits\`, return the **maximum** number of fruits you can pick.

## Examples

**Example 1:**
- Input: \`fruits = [1,2,1]\`
- Output: \`3\`
- Explanation: We can pick from all 3 trees.

**Example 2:**
- Input: \`fruits = [0,1,2,2]\`
- Output: \`3\`
- Explanation: We can pick [1,2,2]. If we started at the first tree, we would only pick [0,1].

**Example 3:**
- Input: \`fruits = [1,2,3,2,2]\`
- Output: \`4\`
- Explanation: We can pick [2,3,2,2].

## Constraints
- \`1 <= fruits.length <= 10^5\`
- \`0 <= fruits[i] < fruits.length\`

## Challenge
Use maximum window: expand when distinct fruits <= 2, shrink when distinct fruits > 2!`,
      starterCode: `def totalFruit(fruits):
    pass`,
      expectedOutput: `def totalFruit(fruits):
    freq = {}
    left = 0
    max_fruits = 0
    
    for right in range(len(fruits)):
        # Add current fruit
        freq[fruits[right]] = freq.get(fruits[right], 0) + 1
        
        # Shrink if more than 2 distinct fruits
        while len(freq) > 2:
            freq[fruits[left]] -= 1
            if freq[fruits[left]] == 0:
                del freq[fruits[left]]
            left += 1
        
        # Window is valid, update max
        max_fruits = max(max_fruits, right - left + 1)
    
    return max_fruits`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Track fruit frequencies in window. Expand when distinct fruits <= 2. Shrink when distinct fruits > 2 (remove from left until back to 2).'
        },
        {
          afterAttempt: 2,
          text: 'Use frequency map. When len(freq) > 2, shrink window from left. Update max_fruits after each valid window.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimal Solution - O(n) time, O(1) space

def totalFruit(fruits):
    freq = {}
    left = 0
    max_fruits = 0
    
    for right in range(len(fruits)):
        # Add current fruit
        freq[fruits[right]] = freq.get(fruits[right], 0) + 1
        
        # Shrink if more than 2 distinct fruits
        while len(freq) > 2:
            freq[fruits[left]] -= 1
            if freq[fruits[left]] == 0:
                del freq[fruits[left]]
            left += 1
        
        # Window is valid, update max
        max_fruits = max(max_fruits, right - left + 1)
    
    return max_fruits

# Key insight: Maximum window with at most 2 distinct values
# Expand when distinct <= 2, shrink when distinct > 2`
      },
      testCases: [
        { input: '[1,2,1]', expectedOutput: '3' },
        { input: '[0,1,2,2]', expectedOutput: '3' },
        { input: '[1,2,3,2,2]', expectedOutput: '4' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- 2 baskets = can collect at most 2 types of fruit
- Must collect from contiguous trees
- Find maximum fruits we can collect

This is "Longest Subarray with At Most 2 Distinct Values"!

### Step 2: Work Through Example (1 min)
\`\`\`
fruits = [1, 2, 3, 2, 2]

Subarrays with ≤2 distinct:
[1] = 1 fruit
[1,2] = 2 fruits
[1,2,3] ✗ (3 distinct)
[2,3,2,2] = 4 fruits ← Maximum!
\`\`\`

### Step 3: Brute Force (1 min)
\`\`\`python
def totalFruit_brute(fruits):
    max_count = 0
    for i in range(len(fruits)):
        types = set()
        for j in range(i, len(fruits)):
            types.add(fruits[j])
            if len(types) > 2:
                break
            max_count = max(max_count, j - i + 1)
    return max_count
\`\`\`
**Time: O(n²)**, Space: O(1)

### Step 4: Optimized Solution (2 min)
\`\`\`python
def totalFruit(fruits):
    freq = {}
    left = max_len = 0
    
    for right in range(len(fruits)):
        freq[fruits[right]] = freq.get(fruits[right], 0) + 1
        
        while len(freq) > 2:
            freq[fruits[left]] -= 1
            if freq[fruits[left]] == 0:
                del freq[fruits[left]]
            left += 1
        
        max_len = max(max_len, right - left + 1)
    
    return max_len
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Each element enters/leaves once
- **Space: O(1)** - At most 3 keys in map (before shrinking)

### Key Takeaways
1. "2 baskets" = at most 2 distinct values
2. Generalization: "k baskets" = at most k distinct
3. Maximum window with distinct count constraint`
    },
  // NOTE: "Longest Substring with At Most K Distinct Characters" (exercise-longest-substring-k-distinct) removed - duplicate of exercise-frequency-k-distinct in main module
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-maximum-erasure-value',
      title: 'Code: Maximum Erasure Value',
      description: 'Find maximum sum of subarray with all unique elements.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(n)', notes: 'Single pass, track sum and seen elements' },
      instruction: `# Maximum Erasure Value

You are given an array of positive integers \`nums\` and want to erase a subarray containing **unique elements**. The score you get by erasing this subarray is equal to the **sum** of its elements.

Return the **maximum score** you can get by erasing exactly one subarray.

An array \`b\` is called to be a subarray of \`a\` if it forms a contiguous subsequence of \`a\`, that is, if it is equal to \`a[l],a[l+1],...,a[r]\` for some \`(l,r)\`.

## Examples

**Example 1:**
- Input: \`nums = [4,2,4,5,6]\`
- Output: \`17\`
- Explanation: The optimal subarray is [2,4,5,6].

**Example 2:**
- Input: \`nums = [5,2,1,2,5,2,1,2,5]\`
- Output: \`8\`
- Explanation: The optimal subarray is [5,2,1] or [1,2,5].

## Constraints
- \`1 <= nums.length <= 10^5\`
- \`1 <= nums[i] <= 10^4\`

## Challenge
Use maximum window: expand when elements unique, shrink when duplicate found!`,
      starterCode: `def maximumUniqueSubarray(nums):
    pass`,
      expectedOutput: `def maximumUniqueSubarray(nums):
    seen = set()
    left = 0
    current_sum = 0
    max_sum = 0
    
    for right in range(len(nums)):
        # Shrink window while duplicate exists
        while nums[right] in seen:
            seen.remove(nums[left])
            current_sum -= nums[left]
            left += 1
        
        # Add current element
        seen.add(nums[right])
        current_sum += nums[right]
        max_sum = max(max_sum, current_sum)
    
    return max_sum`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Track seen elements and current sum. When duplicate found, shrink window (remove from left) until duplicate gone. Then add current element and update max sum.'
        },
        {
          afterAttempt: 2,
          text: 'Use set to track seen elements. Maintain current_sum. Shrink when nums[right] in seen. Expand by adding nums[right] and updating max_sum.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimal Solution - O(n) time, O(n) space

def maximumUniqueSubarray(nums):
    seen = set()
    left = 0
    current_sum = 0
    max_sum = 0
    
    for right in range(len(nums)):
        # Shrink window while duplicate exists
        while nums[right] in seen:
            seen.remove(nums[left])
            current_sum -= nums[left]
            left += 1
        
        # Add current element
        seen.add(nums[right])
        current_sum += nums[right]
        max_sum = max(max_sum, current_sum)
    
    return max_sum

# Key insight: Maximum window with unique elements constraint
# Expand when unique, shrink when duplicate found`
      },
      testCases: [
        { input: '[4,2,4,5,6]', expectedOutput: '17' },
        { input: '[5,2,1,2,5,2,1,2,5]', expectedOutput: '8' },
        { input: '[1,2,3,4,5]', expectedOutput: '15' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Find a contiguous subarray with **all unique elements**
- Maximize the **sum** of that subarray
- Key constraint: no duplicates allowed in the chosen subarray

### Step 2: Work Through Examples (2 min)
\`\`\`
nums = [4, 2, 4, 5, 6]

Subarrays with unique elements:
[4] = 4
[4,2] = 6
[2] = 2
[2,4] = 6
[2,4,5] = 11
[2,4,5,6] = 17 ← Maximum!
[4,5] = 9
[4,5,6] = 15
[5,6] = 11
[6] = 6

Answer: 17 (subarray [2,4,5,6])
\`\`\`

### Step 3: Brute Force Approach (2 min)
"Let me start with the obvious approach..."

\`\`\`python
def maximumUniqueSubarray_brute(nums):
    max_sum = 0
    n = len(nums)
    
    # Try every possible subarray
    for i in range(n):
        seen = set()
        current_sum = 0
        for j in range(i, n):
            # If duplicate found, stop extending
            if nums[j] in seen:
                break
            seen.add(nums[j])
            current_sum += nums[j]
            max_sum = max(max_sum, current_sum)
    
    return max_sum
\`\`\`

**Complexity Analysis:**
- Time: O(n²) - For each starting position, we may scan the rest of the array
- Space: O(n) - Set to track unique elements

"This works but is too slow for n = 10^5. Let me optimize..."

### Step 4: Identify the Pattern (2 min)
"I notice this is about finding the **maximum** subarray with a constraint (uniqueness). This suggests the **Maximum Window** pattern!"

**Key Insight:** Instead of restarting from scratch when we find a duplicate, we can **shrink** the window from the left until the duplicate is removed.

**Why this works:**
- If [i...j] has a duplicate at position j, we don't need to try [i+1...j] separately
- We just shrink from the left until the duplicate is gone
- This eliminates redundant work!

### Step 5: Optimized Solution (2 min)

\`\`\`python
def maximumUniqueSubarray(nums):
    seen = set()
    left = 0
    current_sum = 0
    max_sum = 0
    
    for right in range(len(nums)):
        # Shrink window while duplicate exists
        while nums[right] in seen:
            seen.remove(nums[left])
            current_sum -= nums[left]
            left += 1
        
        # Add current element (now guaranteed unique)
        seen.add(nums[right])
        current_sum += nums[right]
        max_sum = max(max_sum, current_sum)
    
    return max_sum
\`\`\`

### Step 6: Trace Through Example (1 min)
\`\`\`
nums = [4, 2, 4, 5, 6]

right=0: seen={4}, sum=4, max=4
right=1: seen={4,2}, sum=6, max=6
right=2: 4 in seen! Shrink: remove 4, sum=2, seen={2}
         Add 4: seen={2,4}, sum=6, max=6
right=3: seen={2,4,5}, sum=11, max=11
right=4: seen={2,4,5,6}, sum=17, max=17

Answer: 17 ✓
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Each element is added to the set once and removed at most once
- **Space: O(n)** - Set stores at most n unique elements

### Key Takeaways
1. **Brute Force → Optimized:** O(n²) → O(n) by avoiding redundant restarts
2. **Pattern Recognition:** "Maximum subarray with constraint" = Maximum Window
3. **Window Maintenance:** Track both the set (for uniqueness) and running sum (for the score)
4. **Shrink Strategy:** Remove from left until constraint is satisfied again`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-longest-continuous-subarray-absolute-diff',
      title: 'Code: Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit',
      description: 'Find longest subarray where max - min <= limit.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(n)', notes: 'Single pass, use deque to track min/max' },
      instruction: `# Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit

Given an array of integers \`nums\` and an integer \`limit\`, return the size of the longest non-empty subarray such that the absolute difference between any two elements of this subarray is less than or equal to \`limit\`.

## Examples

**Example 1:**
- Input: \`nums = [8,2,4,7]\`, \`limit = 4\`
- Output: \`2\`
- Explanation: All subarrays are:
  - [8] max-min=8-8=0 <= 4.
  - [8,2] max-min=8-2=6 > 4.
  - [8,2,4] max-min=8-2=6 > 4.
  - [8,2,4,7] max-min=8-2=6 > 4.
  - [2] max-min=2-2=0 <= 4.
  - [2,4] max-min=4-2=2 <= 4.
  - [2,4,7] max-min=7-2=5 > 4.
  - [4] max-min=4-4=0 <= 4.
  - [4,7] max-min=7-4=3 <= 4.
  - [7] max-min=7-7=0 <= 4.
  Therefore, the size of the longest subarray is 2.

**Example 2:**
- Input: \`nums = [10,1,2,4,7,2]\`, \`limit = 5\`
- Output: \`4\`
- Explanation: The subarray [2,4,7,2] is the longest since the maximum absolute diff is |2-7| = 5 <= 5.

## Constraints
- \`1 <= nums.length <= 10^5\`
- \`1 <= nums[i] <= 10^9\`
- \`0 <= limit <= 10^9\`

## Challenge
Use maximum window: expand when max-min <= limit, shrink when max-min > limit!`,
      starterCode: `def longestSubarray(nums, limit):
    pass`,
      expectedOutput: `def longestSubarray(nums, limit):
    from collections import deque
    
    min_deque = deque()  # Monotonic deque for minimum
    max_deque = deque()  # Monotonic deque for maximum
    left = 0
    max_len = 0
    
    for right in range(len(nums)):
        # Maintain min deque (increasing)
        while min_deque and nums[min_deque[-1]] > nums[right]:
            min_deque.pop()
        min_deque.append(right)
        
        # Maintain max deque (decreasing)
        while max_deque and nums[max_deque[-1]] < nums[right]:
            max_deque.pop()
        max_deque.append(right)
        
        # Shrink if max - min > limit
        while nums[max_deque[0]] - nums[min_deque[0]] > limit:
            if min_deque[0] == left:
                min_deque.popleft()
            if max_deque[0] == left:
                max_deque.popleft()
            left += 1
        
        max_len = max(max_len, right - left + 1)
    
    return max_len`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Use two deques to track min and max in window. Maintain monotonic deques. Shrink when max-min > limit. Update max_len for valid windows.'
        },
        {
          afterAttempt: 2,
          text: 'Use min_deque (increasing) and max_deque (decreasing). When adding nums[right], maintain deque properties. Shrink when difference > limit.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimal Solution - O(n) time, O(n) space

def longestSubarray(nums, limit):
    from collections import deque
    
    min_deque = deque()  # Monotonic deque for minimum
    max_deque = deque()  # Monotonic deque for maximum
    left = 0
    max_len = 0
    
    for right in range(len(nums)):
        # Maintain min deque (increasing)
        while min_deque and nums[min_deque[-1]] > nums[right]:
            min_deque.pop()
        min_deque.append(right)
        
        # Maintain max deque (decreasing)
        while max_deque and nums[max_deque[-1]] < nums[right]:
            max_deque.pop()
        max_deque.append(right)
        
        # Shrink if max - min > limit
        while nums[max_deque[0]] - nums[min_deque[0]] > limit:
            if min_deque[0] == left:
                min_deque.popleft()
            if max_deque[0] == left:
                max_deque.popleft()
            left += 1
        
        max_len = max(max_len, right - left + 1)
    
    return max_len

# Key insight: Maximum window with max-min constraint
# Use monotonic deques to track min and max efficiently`
      },
      testCases: [
        { input: '[8,2,4,7], 4', expectedOutput: '2' },
        { input: '[10,1,2,4,7,2], 5', expectedOutput: '4' },
        { input: '[1,5,6,7,8,10,6,5,6], 4', expectedOutput: '5' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Find longest subarray where max - min ≤ limit
- "Any two elements" → just need to check max and min difference

### Step 2: Key Challenge (1 min)
"How do I efficiently track min and max in a sliding window?"

Options:
1. Brute: O(n) to find min/max each time → O(n²) total
2. Sorted container: O(log n) per operation
3. **Monotonic Deques: O(1) amortized** ← Best!

### Step 3: Monotonic Deque Insight (2 min)
\`\`\`
Two deques:
- max_deque: decreasing order (front = max)
- min_deque: increasing order (front = min)

When adding element:
- Remove smaller elements from max_deque
- Remove larger elements from min_deque
\`\`\`

### Step 4: Optimized Solution (2 min)
\`\`\`python
from collections import deque

def longestSubarray(nums, limit):
    max_d = deque()  # Decreasing (front = max)
    min_d = deque()  # Increasing (front = min)
    left = max_len = 0
    
    for right in range(len(nums)):
        # Maintain max deque
        while max_d and nums[max_d[-1]] < nums[right]:
            max_d.pop()
        max_d.append(right)
        
        # Maintain min deque
        while min_d and nums[min_d[-1]] > nums[right]:
            min_d.pop()
        min_d.append(right)
        
        # Shrink if constraint violated
        while nums[max_d[0]] - nums[min_d[0]] > limit:
            if max_d[0] == left:
                max_d.popleft()
            if min_d[0] == left:
                min_d.popleft()
            left += 1
        
        max_len = max(max_len, right - left + 1)
    
    return max_len
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Each element added/removed from deques once
- **Space: O(n)** - Deques can store up to n elements

### Key Takeaways
1. **Monotonic Deque** = efficient min/max in sliding window
2. Store indices (not values) to know when elements leave window
3. This pattern appears in many window-based optimization problems`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-maximal-rectangle',
      title: 'Code: Maximal Rectangle',
      description: 'Find largest rectangle containing only 1\'s in binary matrix.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(m × n)', space: 'O(n)', notes: 'Use histogram approach with maximum window' },
      instruction: `# Maximal Rectangle

Given a \`rows x cols\` binary \`matrix\` filled with \`0\`'s and \`1\`'s, find the largest rectangle containing only \`1\`'s and return its area.

## Examples

**Example 1:**
- Input: \`matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]\`
- Output: \`6\`
- Explanation: The maximal rectangle is shown in the above picture and has area = 6.

**Example 2:**
- Input: \`matrix = [["0"]]\`
- Output: \`0\`

**Example 3:**
- Input: \`matrix = [["1"]]\`
- Output: \`1\`

## Constraints
- \`rows == matrix.length\`
- \`cols == matrix[i].length\`
- \`1 <= row, cols <= 200\`
- \`matrix[i][j]\` is \`'0'\` or \`'1'\`.

## Challenge
This is an advanced problem! Build histogram for each row, then use maximum window (or stack) to find largest rectangle in histogram.`,
      starterCode: `def maximalRectangle(matrix):
    pass`,
      expectedOutput: `def maximalRectangle(matrix):
    if not matrix or not matrix[0]:
        return 0
    
    rows, cols = len(matrix), len(matrix[0])
    heights = [0] * cols
    max_area = 0
    
    for row in matrix:
        # Update heights for current row
        for i in range(cols):
            heights[i] = heights[i] + 1 if row[i] == '1' else 0
        
        # Find largest rectangle in histogram (using stack)
        stack = []
        for i in range(cols + 1):
            h = heights[i] if i < cols else 0
            while stack and heights[stack[-1]] > h:
                height = heights[stack.pop()]
                width = i if not stack else i - stack[-1] - 1
                max_area = max(max_area, height * width)
            stack.append(i)
    
    return max_area`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Build histogram for each row (cumulative heights). For each histogram, use stack to find largest rectangle. This is a 2D extension of "Largest Rectangle in Histogram".'
        },
        {
          afterAttempt: 2,
          text: 'Maintain heights array. For each row, update heights (add 1 if \'1\', reset to 0 if \'0\'). Use monotonic stack to find max rectangle in each histogram.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution - O(m × n) time, O(n) space

def maximalRectangle(matrix):
    if not matrix or not matrix[0]:
        return 0
    
    rows, cols = len(matrix), len(matrix[0])
    heights = [0] * cols
    max_area = 0
    
    for row in matrix:
        # Update heights for current row
        for i in range(cols):
            heights[i] = heights[i] + 1 if row[i] == '1' else 0
        
        # Find largest rectangle in histogram (using stack)
        stack = []
        for i in range(cols + 1):
            h = heights[i] if i < cols else 0
            while stack and heights[stack[-1]] > h:
                height = heights[stack.pop()]
                width = i if not stack else i - stack[-1] - 1
                max_area = max(max_area, height * width)
            stack.append(i)
    
    return max_area

# Key insight: Convert to histogram problem
# Build histogram row by row, find max rectangle in each`
      },
      testCases: [
        { input: '[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]', expectedOutput: '6' },
        { input: '[["0"]]', expectedOutput: '0' },
        { input: '[["1"]]', expectedOutput: '1' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Find largest rectangle of 1's in a binary matrix
- This is a HARD problem - requires combining techniques

### Step 2: Key Insight (2 min)
"I can convert this to a histogram problem!"

For each row, treat 1's as building up a histogram:
\`\`\`
Row 0: [1,0,1,0,0] → heights = [1,0,1,0,0]
Row 1: [1,0,1,1,1] → heights = [2,0,2,1,1]
Row 2: [1,1,1,1,1] → heights = [3,1,3,2,2]
Row 3: [1,0,0,1,0] → heights = [4,0,0,3,0]
\`\`\`

Then find "Largest Rectangle in Histogram" for each row!

### Step 3: Solution (2 min)
\`\`\`python
def maximalRectangle(matrix):
    if not matrix:
        return 0
    
    cols = len(matrix[0])
    heights = [0] * cols
    max_area = 0
    
    for row in matrix:
        # Update histogram heights
        for i in range(cols):
            heights[i] = heights[i] + 1 if row[i] == '1' else 0
        
        # Find max rectangle in histogram (stack approach)
        stack = []
        for i in range(cols + 1):
            h = heights[i] if i < cols else 0
            while stack and heights[stack[-1]] > h:
                height = heights[stack.pop()]
                width = i if not stack else i - stack[-1] - 1
                max_area = max(max_area, height * width)
            stack.append(i)
    
    return max_area
\`\`\`

### Complexity Analysis
- **Time: O(m × n)** - Process each cell once, histogram is O(n) per row
- **Space: O(n)** - Heights array and stack

### Key Takeaways
1. 2D problem → reduce to 1D histogram
2. "Largest Rectangle in Histogram" uses monotonic stack
3. Build histogram row-by-row (cumulative if '1', reset to 0 if '0')`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-shortest-subarray-k-ones',
      title: 'Code: Shortest Subarray with k Ones',
      description: 'Find the shortest subarray containing exactly k ones using sliding window.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Minimum window pattern' },
      instruction: `# Shortest Subarray with k Ones

Given an array of 0's and 1's and a number \`k\`, return the **length** of the shortest subarray that contains exactly \`k\` ones. If no such subarray exists, return \`0\`.

## Examples

**Example 1:**
- Input: \`nums = [1,0,0,1,1,0,1,0,1], k = 3\`
- Output: \`4\`
- Explanation: The shortest subarray with 3 ones is \`[1,1,0,1]\` or \`[1,0,1,1]\`

**Example 2:**
- Input: \`nums = [1,1,1], k = 2\`
- Output: \`2\`

**Example 3:**
- Input: \`nums = [0,0,0], k = 1\`
- Output: \`0\` (no ones exist)

## Constraints
- \`1 <= nums.length <= 10^5\`
- \`nums[i]\` is 0 or 1
- \`1 <= k <= sum(nums)\`

## Challenge
Use the minimum window pattern: expand until valid, then shrink to minimize.`,
      starterCode: `def shortestSubarrayWithKOnes(nums, k):
    # Your solution here
    pass`,
      expectedOutput: `def shortestSubarrayWithKOnes(nums, k):
    left = 0
    ones = 0
    min_len = float('inf')
    
    for right in range(len(nums)):
        if nums[right] == 1:
                ones += 1
        
        while ones == k:
            min_len = min(min_len, right - left + 1)
            if nums[left] == 1:
                ones -= 1
            left += 1
    
    return 0 if min_len == float('inf') else min_len`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Track number of ones in your window. When ones == k, you have a valid window - try to shrink it!'
        },
        {
          afterAttempt: 2,
          text: 'Expand right pointer, count ones. When ones == k, shrink from left while updating minimum length.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `def shortestSubarrayWithKOnes(nums, k):
    left = 0
    ones = 0
    min_len = float('inf')
    
    for right in range(len(nums)):
        if nums[right] == 1:
                ones += 1
        
        while ones == k:
            min_len = min(min_len, right - left + 1)
            if nums[left] == 1:
                ones -= 1
            left += 1
    
    return 0 if min_len == float('inf') else min_len`
      },
      testCases: [
        { input: '[1,0,0,1,1,0,1,0,1], 3', expectedOutput: '4' },
        { input: '[1,1,1], 2', expectedOutput: '2' },
        { input: '[0,0,0], 1', expectedOutput: '0' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Find SHORTEST subarray with EXACTLY k ones
- This is a **minimum window** problem (opposite of maximum)

### Step 2: Work Through Example (1 min)
\`\`\`
nums = [1,0,0,1,1,0,1,0,1], k = 3

Subarrays with 3 ones:
[1,0,0,1,1] = len 5
[0,1,1,0,1] = len 5
[1,1,0,1] = len 4 ← shortest
[1,0,1,0,1] = len 5

Answer: 4
\`\`\`

### Step 3: Brute Force (1 min)
\`\`\`python
def shortestSubarray_brute(nums, k):
    min_len = float('inf')
    for i in range(len(nums)):
        ones = 0
        for j in range(i, len(nums)):
            if nums[j] == 1:
                ones += 1
            if ones == k:
                min_len = min(min_len, j - i + 1)
                break
    return 0 if min_len == float('inf') else min_len
\`\`\`
**Time: O(n²)**, Space: O(1)

### Step 4: Key Insight (1 min)
"For minimum window: expand until valid, then SHRINK while still valid!"

**Maximum vs Minimum Window:**
- Maximum: shrink when INvalid, track max while valid
- Minimum: expand until valid, SHRINK while valid, track min

### Step 5: Optimized Solution (2 min)
\`\`\`python
def shortestSubarrayWithKOnes(nums, k):
    left = ones = 0
    min_len = float('inf')
    
    for right in range(len(nums)):
        if nums[right] == 1:
            ones += 1
        
        while ones == k:  # Valid! Shrink to minimize
            min_len = min(min_len, right - left + 1)
            if nums[left] == 1:
                ones -= 1
            left += 1
    
    return 0 if min_len == float('inf') else min_len
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Each element enters/leaves once
- **Space: O(1)** - Just counters

### Key Takeaways
1. **Minimum Window Pattern**: expand → valid → shrink while valid → track min
2. Opposite of maximum window (shrink when INvalid)
3. while ones == k means "while still valid, keep shrinking"`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-minimum-size-subarray-sum',
      title: 'Code: Minimum Size Subarray Sum',
      description: 'Find the minimum length subarray with sum ≥ target.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Single pass, maintain running sum' },
      instruction: `# Minimum Size Subarray Sum

Given an array of **positive integers** \`nums\` and an integer \`target\`, return the **minimum length** of a contiguous subarray whose sum is ≥ \`target\`. If no such subarray exists, return \`0\`.

## Examples

**Example 1:**
- Input: \`target = 7, nums = [2,3,1,2,4,3]\`
- Output: \`2\`
- Explanation: \`[4,3]\` is the shortest subarray with sum ≥ 7.

**Example 2:**
- Input: \`target = 4, nums = [1,4,4]\`
- Output: \`1\`

**Example 3:**
- Input: \`target = 11, nums = [1,1,1,1,1,1,1,1]\`
- Output: \`0\`

## Challenge
Expand window until sum ≥ target, then shrink to minimize length!`,
      starterCode: `def minSubArrayLen(target, nums):
    pass`,
      expectedOutput: `def minSubArrayLen(target, nums):
    left = 0
    current_sum = 0
    min_len = float('inf')
    
    for right in range(len(nums)):
        current_sum += nums[right]
        
        while current_sum >= target:
            min_len = min(min_len, right - left + 1)
            current_sum -= nums[left]
            left += 1
    
    return 0 if min_len == float('inf') else min_len`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Grow window by adding nums[right] until sum ≥ target. Then shrink from left to see if it can be shorter.'
        },
        {
          afterAttempt: 2,
          text: 'Use two pointers and a running sum. After shrinking, continue expanding with next right element.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimal Solution - O(n) time, O(1) space

def minSubArrayLen(target, nums):
    left = 0
    current_sum = 0
    min_len = float('inf')
    
    for right in range(len(nums)):
        current_sum += nums[right]
        
        while current_sum >= target:
            min_len = min(min_len, right - left + 1)
            current_sum -= nums[left]
            left += 1
    
    return 0 if min_len == float('inf') else min_len`
      },
      testCases: [
        { input: '7, [2,3,1,2,4,3]', expectedOutput: '2' },
        { input: '4, [1,4,4]', expectedOutput: '1' },
        { input: '11, [1,1,1,1,1,1,1,1]', expectedOutput: '0' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Find SHORTEST subarray with sum ≥ target
- All positive integers (key constraint!)
- Minimum window pattern

### Step 2: Why Sliding Window Works (1 min)
"All positive = sum only increases when expanding, decreases when shrinking!"

This monotonicity allows sliding window to work.

### Step 3: Solution (2 min)
\`\`\`python
def minSubArrayLen(target, nums):
    left = current_sum = 0
    min_len = float('inf')
    
    for right in range(len(nums)):
        current_sum += nums[right]
        
        while current_sum >= target:  # Valid! Shrink
            min_len = min(min_len, right - left + 1)
            current_sum -= nums[left]
            left += 1
    
    return 0 if min_len == float('inf') else min_len
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Each element enters/leaves once
- **Space: O(1)** - Just counters

### Key Takeaways
1. Minimum window: expand → valid → shrink while valid → track min
2. Works because all positive (sum is monotonic)
3. Would NOT work with negatives (use prefix sum instead)`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-minimum-window-substring',
      title: 'Code: Minimum Window Substring',
      description: 'Find the smallest substring of s that contains all characters of t.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Fixed alphabet (ASCII) frequency tracking' },
      instruction: `# Minimum Window Substring

Given two strings \`s\` and \`t\`, return the **minimum window substring** of \`s\` such that every character in \`t\` (including duplicates) is included in the window. If no such substring exists, return an empty string "".

## Examples

**Example 1:**
- Input: \`s = "ADOBECODEBANC"\`, \`t = "ABC"\`
- Output: \`"BANC"\`

**Example 2:**
- Input: \`s = "a"\`, \`t = "a"\`
- Output: \`"a"\`

**Example 3:**
- Input: \`s = "a"\`, \`t = "aa"\`
- Output: \`""\`

## Constraints
- \`1 <= s.length, t.length <= 10^5\`
- \`s\` and \`t\` consist of English letters

## Challenge
Track frequency requirements. Expand until all required characters are in the window, then shrink to find the minimum substring.`,
      starterCode: `def minWindow(s, t):
    pass`,
      expectedOutput: `from collections import Counter

def minWindow(s, t):
    if len(t) > len(s):
        return ""
    
    need = Counter(t)
    have = {}
    required = len(need)
    formed = 0
    left = 0
    best = (float('inf'), None, None)
    
    for right, ch in enumerate(s):
        have[ch] = have.get(ch, 0) + 1
        if ch in need and have[ch] == need[ch]:
            formed += 1
        
        while formed == required:
            if right - left + 1 < best[0]:
                best = (right - left + 1, left, right)
            left_char = s[left]
            have[left_char] -= 1
            if left_char in need and have[left_char] < need[left_char]:
                formed -= 1
            left += 1
    
    return "" if best[0] == float('inf') else s[best[1]:best[2]+1]`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Use two hash maps: one for required counts (t) and one for current window. When all required characters are satisfied, try shrinking from left.'
        },
        {
          afterAttempt: 2,
          text: 'Track how many distinct characters meet their required frequency (`formed`). Shrink while `formed == required`, updating best window.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `from collections import Counter

def minWindow(s, t):
    if len(t) > len(s):
        return ""
    
    need = Counter(t)
    have = {}
    required = len(need)
    formed = 0
    left = 0
    best = (float('inf'), None, None)
    
    for right, ch in enumerate(s):
        have[ch] = have.get(ch, 0) + 1
        if ch in need and have[ch] == need[ch]:
            formed += 1
        
        while formed == required:
            if right - left + 1 < best[0]:
                best = (right - left + 1, left, right)
            left_char = s[left]
            have[left_char] -= 1
            if left_char in need and have[left_char] < need[left_char]:
                formed -= 1
            left += 1
    
    return "" if best[0] == float('inf') else s[best[1]:best[2]+1]`
      },
      testCases: [
        { input: '"ADOBECODEBANC", "ABC"', expectedOutput: '"BANC"' },
        { input: '"a", "a"', expectedOutput: '"a"' },
        { input: '"a", "aa"', expectedOutput: '""' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Find smallest substring of s containing ALL characters of t
- Must include correct counts (if t has "AA", need 2 A's)
- Classic "Minimum Window Substring" problem (LeetCode #76)

### Step 2: Key Insight (2 min)
"Minimum window = expand until valid, shrink while valid!"

Track:
- need: what we need (frequency of t)
- have: what we have in window
- formed: how many unique chars satisfy requirement

### Step 3: Brute Force (conceptual)
Check all substrings, find minimum containing t → O(n² × m)

### Step 4: Optimized Solution (2 min)
\`\`\`python
from collections import Counter

def minWindow(s, t):
    need = Counter(t)
    have = {}
    required, formed = len(need), 0
    left = 0
    result = (float('inf'), 0, 0)
    
    for right in range(len(s)):
        ch = s[right]
        have[ch] = have.get(ch, 0) + 1
        if ch in need and have[ch] == need[ch]:
            formed += 1
        
        while formed == required:
            if right - left + 1 < result[0]:
                result = (right - left + 1, left, right)
            
            left_ch = s[left]
            have[left_ch] -= 1
            if left_ch in need and have[left_ch] < need[left_ch]:
                formed -= 1
            left += 1
    
    return "" if result[0] == float('inf') else s[result[1]:result[2]+1]
\`\`\`

### Complexity Analysis
- **Time: O(|s| + |t|)** - Each char processed once
- **Space: O(|t|)** - Frequency maps

### Key Takeaways
1. Track "formed" = count of unique chars that meet requirement
2. formed == required means window is valid
3. Shrink while valid to minimize`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-smallest-range-k-lists',
      title: 'Code: Smallest Range Covering Elements from K Lists',
      description: 'Find the smallest range that includes at least one number from each list.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n log k)', space: 'O(k)', notes: 'Use heap to expand and shrink range' },
      instruction: `# Smallest Range Covering Elements from K Lists

You are given \`k\` sorted integer lists \`nums\`. Return the **smallest range** \`[a, b]\` such that at least one number from each list is in the range.

If there are multiple answers, return the one with the smallest \`a\`. If there is still a tie, return the range with the smallest \`b\`.

## Examples

**Example 1:**
- Input: \`nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]\`
- Output: \`[20,24]\`
- Explanation: 20 is from list2, 21-23 (none), 24 from list1, 22 from list3 – every list contributes.

**Example 2:**
- Input: \`nums = [[1,2,3],[1,2,3],[1,2,3]]\`
- Output: \`[1,1]\`

## Strategy
Use a min-heap to always expand the range by pulling the smallest current value. Track the current maximum. When all lists are represented, try to shrink by popping from the heap.`,
      starterCode: `import heapq

def smallestRange(nums):
    pass`,
      expectedOutput: `import heapq

def smallestRange(nums):
    # Initialize heap with first element from each list
    heap = []
    current_max = float('-inf')
    for i, lst in enumerate(nums):
        heapq.heappush(heap, (lst[0], i, 0))
        current_max = max(current_max, lst[0])
    
    best_range = [float('-inf'), float('inf')]
    
    while heap:
        value, list_idx, elem_idx = heapq.heappop(heap)
        if current_max - value < best_range[1] - best_range[0]:
            best_range = [value, current_max]
        
        # Move pointer in the list we just popped from
        if elem_idx + 1 == len(nums[list_idx]):
            break  # can't include all lists anymore
        next_val = nums[list_idx][elem_idx + 1]
        heapq.heappush(heap, (next_val, list_idx, elem_idx + 1))
        current_max = max(current_max, next_val)
    
    return best_range`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Use a heap to track the current minimum across lists, and a variable for the current maximum. The window is [min, max].'
        },
        {
          afterAttempt: 2,
          text: 'When you pop the smallest element, push the next element from the same list. If that list is exhausted, you can stop.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `import heapq

def smallestRange(nums):
    heap = []
    current_max = float('-inf')
    for i, lst in enumerate(nums):
        heapq.heappush(heap, (lst[0], i, 0))
        current_max = max(current_max, lst[0])
    
    best_range = [float('-inf'), float('inf')]
    
    while heap:
        value, list_idx, elem_idx = heapq.heappop(heap)
        if current_max - value < best_range[1] - best_range[0]:
            best_range = [value, current_max]
        
        if elem_idx + 1 == len(nums[list_idx]):
            break
        next_val = nums[list_idx][elem_idx + 1]
        heapq.heappush(heap, (next_val, list_idx, elem_idx + 1))
        current_max = max(current_max, next_val)
    
    return best_range`
      },
      testCases: [
        { input: '[[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]', expectedOutput: '[20, 24]' },
        { input: '[[1,2,3],[1,2,3],[1,2,3]]', expectedOutput: '[1, 1]' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- k sorted lists
- Find smallest range [a,b] containing at least one element from EACH list
- Hard problem - requires heap + sliding window concept

### Step 2: Key Insight (2 min)
"Use a min-heap to track current minimum across all lists!"

**Window Concept:**
- Current window = [min_in_heap, current_max]
- Each list must contribute one element
- Expand by replacing the minimum with next element from same list

### Step 3: Solution (2 min)
\`\`\`python
import heapq

def smallestRange(nums):
    heap = []
    curr_max = float('-inf')
    
    # Initialize: one element from each list
    for i, lst in enumerate(nums):
        heapq.heappush(heap, (lst[0], i, 0))
        curr_max = max(curr_max, lst[0])
    
    best = [float('-inf'), float('inf')]
    
    while heap:
        val, list_idx, elem_idx = heapq.heappop(heap)
        
        # Update best range
        if curr_max - val < best[1] - best[0]:
            best = [val, curr_max]
        
        # Try to shrink by moving forward in this list
        if elem_idx + 1 == len(nums[list_idx]):
            break  # List exhausted, can't continue
        
        next_val = nums[list_idx][elem_idx + 1]
        heapq.heappush(heap, (next_val, list_idx, elem_idx + 1))
        curr_max = max(curr_max, next_val)
    
    return best
\`\`\`

### Complexity Analysis
- **Time: O(n log k)** - n total elements, heap ops are O(log k)
- **Space: O(k)** - Heap stores k elements

### Key Takeaways
1. Heap maintains current minimum across k lists
2. Track maximum separately (can't get from heap efficiently)
3. Expand by advancing the list that provided minimum`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-replace-substring-balanced',
      title: 'Code: Replace the Substring for Balanced String',
      description: 'Find the shortest substring that can be replaced to make the string balanced.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Fixed alphabet (QWER)' },
      instruction: `# Replace the Substring for Balanced String

Given a string \`s\` of length \`4n\` consisting only of 'Q', 'W', 'E', and 'R', return the **minimum length** of the substring that can be replaced with any string (of the same length) so that the resulting string is balanced (each character appears exactly \`n\` times).`,
      starterCode: `def balancedString(s):
    pass`,
      expectedOutput: `from collections import Counter

def balancedString(s):
    n = len(s)
    target = n // 4
    freq = Counter(s)

    # Already balanced
    if all(freq[ch] == target for ch in "QWER"):
        return 0

    left = 0
    res = len(s)

    for right, ch in enumerate(s):
        freq[ch] -= 1

        # Shrink while remaining string (outside window) is balanced
        while left <= right and all(freq[c] <= target for c in "QWER"):
            res = min(res, right - left + 1)
            freq[s[left]] += 1
            left += 1

    return res`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Count how many extra characters we have beyond n/4. When the remaining string (outside window) is already balanced, the current window is a valid candidate to replace.'
        },
        {
          afterAttempt: 2,
          text: 'Treat the window as the substring you will replace. When all freq[ch] ≤ target, shrink from the left to minimize the window.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `from collections import Counter

def balancedString(s):
    n = len(s)
    target = n // 4
    freq = Counter(s)

    if all(freq[ch] == target for ch in "QWER"):
        return 0

    left = 0
    res = len(s)

    for right, ch in enumerate(s):
        freq[ch] -= 1

        while left <= right and all(freq[c] <= target for c in "QWER"):
            res = min(res, right - left + 1)
            freq[s[left]] += 1
            left += 1

    return res`
      },
      testCases: [
        { input: '"QWER"', expectedOutput: '0' },
        { input: '"QQWE"', expectedOutput: '1' },
        { input: '"QQQW"', expectedOutput: '2' },
        { input: '"WQWRQQQW"', expectedOutput: '3' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- String has QWER only
- "Balanced" = each char appears exactly n/4 times
- Find shortest substring to replace to achieve balance

### Step 2: Key Insight (2 min)
"The substring I replace can become ANYTHING. So I just need the REST of the string to be balance-able!"

**The Trick:**
- Count chars OUTSIDE the window
- If all outside chars ≤ n/4, we can make balanced
- Find minimum such window

### Step 3: Solution (2 min)
\`\`\`python
from collections import Counter

def balancedString(s):
    n = len(s)
    target = n // 4
    freq = Counter(s)  # Count all chars
    
    if all(freq[c] == target for c in "QWER"):
        return 0
    
    left = 0
    result = n
    
    for right in range(n):
        freq[s[right]] -= 1  # Remove from outside
        
        # While outside is balance-able
        while all(freq[c] <= target for c in "QWER"):
            result = min(result, right - left + 1)
            freq[s[left]] += 1  # Add back to outside
            left += 1
    
    return result
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Each char enters/leaves once
- **Space: O(1)** - Fixed 4 characters

### Key Takeaways
1. Think about complement: what's OUTSIDE the window
2. Window is what we'll replace, outside must be ≤ target
3. Minimum window when constraint is satisfied`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-max-consecutive-ones',
      title: 'Code: Max Consecutive Ones',
      description: 'Find the maximum number of consecutive 1s in a binary array.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Single pass with restarting window' },
      instruction: `# Max Consecutive Ones

Given a binary array \`nums\`, return the maximum number of consecutive 1's.

## Examples

**Example 1:**
- Input: \`nums = [1,1,0,1,1,1]\`
- Output: \`3\`
- Explanation: The first two digits or the last three digits are consecutive 1s. The maximum consecutive 1s is 3.

**Example 2:**
- Input: \`nums = [1,0,1,1,0,1]\`
- Output: \`2\`

## Constraints
- \`1 <= nums.length <= 10^5\`
- \`nums[i]\` is either 0 or 1

## Challenge
Solve this in O(n) time with O(1) space using a single pass.`,
      starterCode: `def findMaxConsecutiveOnes(nums):
    # Your solution here
    pass`,
      expectedOutput: `def findMaxConsecutiveOnes(nums):
    max_len = 0
    current = 0
    
    for num in nums:
        if num == 1:
            current += 1
            max_len = max(max_len, current)
        else:
            current = 0
    
    return max_len`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Keep a counter for the current streak of 1s. Reset it when you see a 0.'
        },
        {
          afterAttempt: 2,
          text: 'Track maximum seen so far. On each 1, increment current count and update max. On 0, reset current count.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `def findMaxConsecutiveOnes(nums):
    max_len = 0
    current = 0
    
    for num in nums:
        if num == 1:
            current += 1
            max_len = max(max_len, current)
        else:
            current = 0
    
    return max_len`
      },
      testCases: [
        { input: '[1,1,0,1,1,1]', expectedOutput: '3' },
        { input: '[1,0,1,1,0,1]', expectedOutput: '2' },
        { input: '[0]', expectedOutput: '0' },
        { input: '[1,1,1,1]', expectedOutput: '4' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (30 sec)
- Find longest consecutive sequence of 1s
- Simple but foundational problem

### Step 2: Work Through Example (30 sec)
\`\`\`
nums = [1,1,0,1,1,1]

Streaks: [1,1] = 2, [1,1,1] = 3
Answer: 3
\`\`\`

### Step 3: Brute Force (1 min)
\`\`\`python
def findMaxConsecutiveOnes_brute(nums):
    max_len = 0
    for i in range(len(nums)):
        count = 0
        for j in range(i, len(nums)):
            if nums[j] == 1:
                count += 1
            else:
                break
        max_len = max(max_len, count)
    return max_len
\`\`\`
**Time: O(n²)**

### Step 4: Optimized - Restarting Window (1 min)
\`\`\`python
def findMaxConsecutiveOnes(nums):
    max_len = current = 0
    for num in nums:
        if num == 1:
            current += 1
            max_len = max(max_len, current)
        else:
            current = 0  # RESTART!
    return max_len
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Single pass
- **Space: O(1)** - Two variables

### Key Takeaways
1. **Restarting Window**: reset on invalid element
2. Simpler than shrinking window (no left pointer needed)
3. Pattern: "longest consecutive X" often uses restarting window`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-consecutive-characters',
      title: 'Code: Consecutive Characters',
      description: 'Find the maximum length of a substring containing only one unique character.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Single pass, restart when character changes' },
      instruction: `# Consecutive Characters

Given a string \`s\`, return the **power** of the string.

The **power** of the string is the maximum length of a non-empty substring that contains only one unique character.

## Examples

**Example 1:**
- Input: \`s = "leetcode"\`
- Output: \`2\`
- Explanation: The substring "ee" is of length 2 with the character 'e' only.

**Example 2:**
- Input: \`s = "abbcccddddeeeeedcba"\`
- Output: \`5\`
- Explanation: The substring "eeeee" is of length 5 with the character 'e' only.

**Example 3:**
- Input: \`s = "triplepillooooow"\`
- Output: \`5\`

**Example 4:**
- Input: \`s = "hooraaaaaaaaaaay"\`
- Output: \`11\`

## Constraints
- \`1 <= s.length <= 500\`
- \`s\` contains only lowercase English letters.

## Challenge
Use restarting window: restart when the character changes!`,
      starterCode: `def maxPower(s):
    pass`,
      expectedOutput: `def maxPower(s):
    if not s:
        return 0
    
    left = 0
    max_len = 1
    
    for right in range(1, len(s)):
        if s[right] != s[right - 1]:
            # Character changed: restart window
            left = right
        else:
            # Same character: expand window
            max_len = max(max_len, right - left + 1)
    
    return max_len`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Track the start of the current consecutive character sequence. When s[right] != s[right-1], restart the window at right. Otherwise, expand and update max.'
        },
        {
          afterAttempt: 2,
          text: 'Compare current character with previous character. If different, restart window. If same, calculate length and update maximum.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimal Solution - O(n) time, O(1) space

def maxPower(s):
    if not s:
        return 0
    
    left = 0
    max_len = 1
    
    for right in range(1, len(s)):
        if s[right] != s[right - 1]:
            # Character changed: restart window
            left = right
        else:
            # Same character: expand window
            max_len = max(max_len, right - left + 1)
    
    return max_len

# Key insight: Restart window when character changes,
# similar to restarting on 0 in max consecutive ones`
      },
      testCases: [
        { input: '"leetcode"', expectedOutput: '2' },
        { input: '"abbcccddddeeeeedcba"', expectedOutput: '5' },
        { input: '"triplepillooooow"', expectedOutput: '5' },
        { input: '"hooraaaaaaaaaaay"', expectedOutput: '11' },
        { input: '"a"', expectedOutput: '1' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (30 sec)
- Find longest substring with same character repeated
- "Power" = maximum length of such substring

### Step 2: Work Through Example (30 sec)
\`\`\`
s = "abbcccddddeeeeedcba"

Streaks: a(1), bb(2), ccc(3), dddd(4), eeeee(5), ...
Answer: 5 ("eeeee")
\`\`\`

### Step 3: Solution - Restarting Window (1 min)
\`\`\`python
def maxPower(s):
    max_len = current = 1
    
    for i in range(1, len(s)):
        if s[i] == s[i-1]:
            current += 1
            max_len = max(max_len, current)
        else:
            current = 1  # RESTART
    
    return max_len
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Single pass
- **Space: O(1)** - Just counters

### Key Takeaways
1. Generalization of "Max Consecutive Ones"
2. Restart when character changes (instead of when 0 is seen)
3. Same restarting window pattern`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-maximum-subarray',
      title: 'Maximum Subarray',
      description: 'Find the contiguous subarray with the largest sum.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Single pass, restart when sum becomes negative' },
      instruction: `# Maximum Subarray

Given an integer array \`nums\`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

A **subarray** is a contiguous part of an array.

## Examples

**Example 1:**
- Input: \`nums = [-2,1,-3,4,-1,2,1,-5,4]\`
- Output: \`6\`
- Explanation: \`[4,-1,2,1]\` has the largest sum = 6.

**Example 2:**
- Input: \`nums = [1]\`
- Output: \`1\`

**Example 3:**
- Input: \`nums = [5,4,-1,7,8]\`
- Output: \`23\`

## Constraints
- \`1 <= nums.length <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\`

## Challenge
Use restarting window: restart when the running sum becomes negative!`,
      starterCode: `def maxSubArray(nums):
    pass`,
      expectedOutput: `def maxSubArray(nums):
    max_sum = nums[0]
    current_sum = nums[0]
    
    for i in range(1, len(nums)):
        # Restart if current sum becomes negative
        if current_sum < 0:
            current_sum = nums[i]
        else:
            # Expand window
            current_sum += nums[i]
        
        max_sum = max(max_sum, current_sum)
    
    return max_sum`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Track the current running sum. If it becomes negative, restart the window (set current_sum = nums[i]). Otherwise, add nums[i] to current_sum. Always update max_sum.'
        },
        {
          afterAttempt: 2,
          text: 'Key insight: If the running sum becomes negative, starting a new window from the current element will always be better than continuing with the negative sum.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimal Solution (Kadane's Algorithm) - O(n) time, O(1) space

def maxSubArray(nums):
    max_sum = nums[0]
    current_sum = nums[0]
    
    for i in range(1, len(nums)):
        # Restart if current sum becomes negative
        if current_sum < 0:
            current_sum = nums[i]
        else:
            # Expand window
            current_sum += nums[i]
        
        max_sum = max(max_sum, current_sum)
    
    return max_sum

# Key insight: If running sum < 0, restarting from current element
# is always better than continuing with negative sum
# This is Kadane's algorithm - a form of restarting window!`
      },
      testCases: [
        { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
        { input: '[1]', expectedOutput: '1' },
        { input: '[5,4,-1,7,8]', expectedOutput: '23' },
        { input: '[-1]', expectedOutput: '-1' },
        { input: '[-2,-1]', expectedOutput: '-1' }
      ],
      solutionExplanation: `## The Brute-Force Instinct

The most direct interpretation: try every possible subarray, sum it up, track the maximum.

\`\`\`python
def maxSubArray(nums):
    n = len(nums)
    max_sum = float('-inf')
    
    for i in range(n):           # start index
        for j in range(i, n):    # end index
            current_sum = 0
            for k in range(i, j+1):  # sum elements i..j
                current_sum += nums[k]
            max_sum = max(max_sum, current_sum)
    
    return max_sum
\`\`\`

Three nested loops. O(n³). On an array of 10,000 elements, that's a trillion operations. Brutal.

---

## First Optimization: Eliminate the Inner Loop

Notice what happens when we extend a subarray from [i..j] to [i..j+1]. We're re-summing from scratch, but we only added one element! The sum of [i..j+1] is just sum([i..j]) + nums[j+1].

\`\`\`python
def maxSubArray(nums):
    n = len(nums)
    max_sum = float('-inf')
    
    for i in range(n):           # start index
        current_sum = 0
        for j in range(i, n):    # end index
            current_sum += nums[j]   # accumulate instead of re-sum
            max_sum = max(max_sum, current_sum)
    
    return max_sum
\`\`\`

Down to O(n²). Better, but still too slow for 100,000 elements.

---

## Spotting the Deeper Redundancy

Let's trace through nums = [-2, 4, -1, 2, 1]:

\`\`\`
Starting at i=0: sums are -2, 2, 1, 3, 4
Starting at i=1: sums are 4, 3, 5, 6        ← best is 6
Starting at i=2: sums are -1, 1, 2
Starting at i=3: sums are 2, 3
Starting at i=4: sums are 1
\`\`\`

Here's the key observation: when we start at i=1, our running sum is 4. If instead we had started at i=0, our running sum at position 1 would be -2 + 4 = 2. 

**The sum starting at i=1 (which is 4) is better than the sum that includes index 0 (which is 2).**

Why? Because -2 dragged us down. A negative prefix *hurts* future sums.

---

## The Aha Moment

As we walk through the array, we maintain a running sum. At each position, we ask:

*"Is my running sum helping me or hurting me?"*

If the running sum is negative, it's hurting. Starting fresh from the current element is always better than carrying forward a negative burden.

\`\`\`python
def maxSubArray(nums):
    max_sum = nums[0]
    current_sum = nums[0]
    
    for i in range(1, len(nums)):
        if current_sum < 0:
            # Negative sum hurts us - restart here
            current_sum = nums[i]
        else:
            # Positive sum helps us - keep extending
            current_sum += nums[i]
        
        max_sum = max(max_sum, current_sum)
    
    return max_sum
\`\`\`

One pass. O(n) time, O(1) space.

---

## Why This Works

Think of it as a "restarting window":
- The window expands as long as the running sum stays non-negative
- The moment it goes negative, we "restart" the window from the current element
- We never need to look back because a negative prefix can't help any future subarray

This is **Kadane's algorithm** – one of the most elegant examples of turning an O(n³) brute force into O(n) by recognizing what information we actually need to carry forward.`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-longest-turbulent-subarray',
      title: 'Code: Longest Turbulent Subarray',
      description: 'Find the longest subarray where adjacent elements alternate between increasing and decreasing.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Single pass, restart when pattern breaks' },
      instruction: `# Longest Turbulent Subarray

Given an integer array \`arr\`, return the length of a maximum size turbulent subarray of \`arr\`.

A subarray is **turbulent** if the comparison sign flips between each adjacent pair of elements in the subarray.

More formally, a subarray \`[arr[i], arr[i+1], ..., arr[j]]\` of \`arr\` is said to be turbulent if and only if:
- For \`i <= k < j\`:
  - \`arr[k] > arr[k+1]\` when \`k\` is odd, and
  - \`arr[k] < arr[k+1]\` when \`k\` is even, OR
- For \`i <= k < j\`:
  - \`arr[k] > arr[k+1]\` when \`k\` is even, and
  - \`arr[k] < arr[k+1]\` when \`k\` is odd.

## Examples

**Example 1:**
- Input: \`arr = [9,4,2,10,7,8,8,1,9]\`
- Output: \`5\`
- Explanation: \`arr[1] > arr[2] < arr[3] > arr[4] < arr[5]\`

**Example 2:**
- Input: \`arr = [4,8,12,16]\`
- Output: \`2\`

**Example 3:**
- Input: \`arr = [100]\`
- Output: \`1\`

## Constraints
- \`1 <= arr.length <= 4 * 10^4\`
- \`0 <= arr[i] <= 10^9\`

## Challenge
Use restarting window: restart when the alternating pattern breaks!`,
      starterCode: `def maxTurbulenceSize(arr):
    pass`,
      expectedOutput: `def maxTurbulenceSize(arr):
    if len(arr) == 1:
        return 1
    
    max_len = 1
    left = 0
    
    for right in range(1, len(arr)):
        # Check if pattern breaks
        if right == len(arr) - 1:
            # Last element: always valid if previous was valid
            if arr[right] != arr[right - 1]:
                max_len = max(max_len, right - left + 1)
        elif (arr[right] > arr[right - 1] and arr[right] > arr[right + 1]) or \\
             (arr[right] < arr[right - 1] and arr[right] < arr[right + 1]):
            # Pattern continues: expand window
            max_len = max(max_len, right - left + 1)
        else:
            # Pattern breaks: restart window
            if arr[right] != arr[right - 1]:
                left = right
            else:
                left = right + 1
    
    return max_len`,
      hints: [
        {
          afterAttempt: 1,
          text: 'For a turbulent subarray, each element (except first and last) must be either a peak (greater than neighbors) or a valley (less than neighbors). Check if arr[right] maintains this pattern.'
        },
        {
          afterAttempt: 2,
          text: 'Compare arr[right] with arr[right-1] and arr[right+1]. If it\'s a peak or valley, expand. If pattern breaks (equal or wrong direction), restart window.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimal Solution - O(n) time, O(1) space

def maxTurbulenceSize(arr):
    if len(arr) == 1:
        return 1
    
    max_len = 1
    left = 0
    
    for right in range(1, len(arr)):
        if right == len(arr) - 1:
            # Last element: valid if different from previous
            if arr[right] != arr[right - 1]:
                max_len = max(max_len, right - left + 1)
        elif (arr[right] > arr[right - 1] and arr[right] > arr[right + 1]) or \\
             (arr[right] < arr[right - 1] and arr[right] < arr[right + 1]):
            # Pattern continues: expand window
            max_len = max(max_len, right - left + 1)
        else:
            # Pattern breaks: restart window
            if arr[right] != arr[right - 1]:
                left = right
            else:
                left = right + 1
    
    return max_len

# Key insight: Restart window when alternating pattern breaks
# Each element (except ends) must be peak or valley`
      },
      testCases: [
        { input: '[9,4,2,10,7,8,8,1,9]', expectedOutput: '5' },
        { input: '[4,8,12,16]', expectedOutput: '2' },
        { input: '[100]', expectedOutput: '1' },
        { input: '[9,9]', expectedOutput: '1' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- "Turbulent" = alternating >, <, >, <, ...
- Find longest turbulent subarray
- Each middle element must be peak or valley

### Step 2: Work Through Example (1 min)
\`\`\`
arr = [9, 4, 2, 10, 7, 8, 8, 1, 9]

9 > 4 > 2 - NOT turbulent (same direction)
2 < 10 > 7 < 8 - turbulent! length 4
But 8 = 8 breaks it

Answer: 5 (indices 2-6)
\`\`\`

### Step 3: Solution - Restarting Window (2 min)
\`\`\`python
def maxTurbulenceSize(arr):
    n = len(arr)
    if n == 1:
        return 1
    
    max_len = 1
    inc = dec = 1  # Track increasing/decreasing streaks
    
    for i in range(1, n):
        if arr[i] > arr[i-1]:
            inc = dec + 1
            dec = 1
        elif arr[i] < arr[i-1]:
            dec = inc + 1
            inc = 1
        else:  # Equal - restart both
            inc = dec = 1
        
        max_len = max(max_len, inc, dec)
    
    return max_len
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Single pass
- **Space: O(1)** - Just counters

### Key Takeaways
1. Track two states: ending with increase vs decrease
2. Alternating pattern: if > now, must < next (or vice versa)
3. Equal elements reset both streaks`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-maximum-sum-circular-subarray',
      title: 'Code: Maximum Sum Circular Subarray',
      description: 'Find the maximum sum subarray in a circular array.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Two passes: normal max subarray and circular case' },
      instruction: `# Maximum Sum Circular Subarray

Given a **circular integer array** \`nums\` of length \`n\`, return the maximum possible sum of a non-empty **subarray** of \`nums\`.

A **circular array** means the end of the array connects to the beginning of the array. Formally, the next element of \`nums[i]\` is \`nums[(i + 1) % n]\` and the previous element of \`nums[i]\` is \`nums[(i - 1 + n) % n]\`.

A **subarray** may only include each element of the fixed buffer \`nums\` at most once. Formally, for a subarray \`nums[i], nums[i+1], ..., nums[j]\`, there does not exist \`i <= k1, k2 <= j\` with \`k1 % n == k2 % n\`.

## Examples

**Example 1:**
- Input: \`nums = [1,-2,3,-2]\`
- Output: \`3\`
- Explanation: Subarray \`[3]\` has maximum sum 3.

**Example 2:**
- Input: \`nums = [5,-3,5]\`
- Output: \`10\`
- Explanation: Subarray \`[5,5]\` has maximum sum 10 (circular).

**Example 3:**
- Input: \`nums = [-3,-2,-3]\`
- Output: \`-2\`
- Explanation: Subarray \`[-2]\` has maximum sum -2.

## Constraints
- \`n == nums.length\`
- \`1 <= n <= 3 * 10^4\`
- \`-3 * 10^4 <= nums[i] <= 3 * 10^4\`

## Challenge
There are two cases: normal max subarray and circular max subarray (wraps around). Use restarting window for both!`,
      starterCode: `def maxSubarraySumCircular(nums):
    pass`,
      expectedOutput: `def maxSubarraySumCircular(nums):
    # Case 1: Maximum subarray in normal array (Kadane's)
    max_normal = nums[0]
    current = nums[0]
    for i in range(1, len(nums)):
        if current < 0:
            current = nums[i]
        else:
            current += nums[i]
        max_normal = max(max_normal, current)
    
    # Case 2: Maximum circular subarray = total_sum - minimum_subarray
    total_sum = sum(nums)
    min_normal = nums[0]
    current = nums[0]
    for i in range(1, len(nums)):
        if current > 0:
            current = nums[i]
        else:
            current += nums[i]
        min_normal = min(min_normal, current)
    
    max_circular = total_sum - min_normal
    
    # Edge case: if all negative, return max_normal
    if max_circular == 0:
        return max_normal
    
    return max(max_normal, max_circular)`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Two cases: 1) Normal max subarray (Kadane\'s algorithm), 2) Circular max subarray = total_sum - minimum_subarray. The circular case wraps around, so we find the minimum subarray and subtract it from total.'
        },
        {
          afterAttempt: 2,
          text: 'For circular case: maximum circular sum = total_sum - minimum_subarray_sum. Use restarting window to find minimum subarray (restart when sum > 0).'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimal Solution - O(n) time, O(1) space

def maxSubarraySumCircular(nums):
    # Case 1: Maximum subarray in normal array (Kadane's)
    max_normal = nums[0]
    current = nums[0]
    for i in range(1, len(nums)):
        if current < 0:
            current = nums[i]  # Restart
        else:
            current += nums[i]  # Expand
        max_normal = max(max_normal, current)
    
    # Case 2: Maximum circular subarray = total_sum - minimum_subarray
    total_sum = sum(nums)
    min_normal = nums[0]
    current = nums[0]
    for i in range(1, len(nums)):
        if current > 0:
            current = nums[i]  # Restart (for minimum, restart when positive)
        else:
            current += nums[i]  # Expand
        min_normal = min(min_normal, current)
    
    max_circular = total_sum - min_normal
    
    # Edge case: if all negative, circular case gives 0 (wrong)
    if max_circular == 0:
        return max_normal
    
    return max(max_normal, max_circular)

# Key insight: Circular max = total - minimum_subarray
# Use restarting window for both normal max and minimum subarray`
      },
      testCases: [
        { input: '[1,-2,3,-2]', expectedOutput: '3' },
        { input: '[5,-3,5]', expectedOutput: '10' },
        { input: '[-3,-2,-3]', expectedOutput: '-2' },
        { input: '[3,-1,2,-1]', expectedOutput: '4' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (1 min)
- Array is circular (end connects to start)
- Find max sum subarray (can wrap around)

### Step 2: Key Insight (2 min)
**Two cases:**
1. Max subarray is in the middle (normal Kadane's)
2. Max subarray wraps around (uses both ends)

**For Case 2:**
If max wraps around, it means the MINIMUM is in the middle!
\`\`\`
[...max...][min in middle][...max...]
max_circular = total_sum - min_subarray
\`\`\`

### Step 3: Solution (2 min)
\`\`\`python
def maxSubarraySumCircular(nums):
    # Case 1: Normal Kadane's
    max_sum = curr_max = nums[0]
    for num in nums[1:]:
        curr_max = max(num, curr_max + num)
        max_sum = max(max_sum, curr_max)
    
    # Case 2: Circular = total - min_subarray
    min_sum = curr_min = nums[0]
    total = sum(nums)
    for num in nums[1:]:
        curr_min = min(num, curr_min + num)
        min_sum = min(min_sum, curr_min)
    
    max_circular = total - min_sum
    
    # Edge: all negative → max_circular = 0 (empty), use max_sum
    return max(max_sum, max_circular) if max_circular != 0 else max_sum
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Two passes
- **Space: O(1)** - Just counters

### Key Takeaways
1. Circular max = max(normal_max, total - min_subarray)
2. Use Kadane's for both max and min
3. Edge case: all negative → circular wraps entire array`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-reverse-words-string-iii',
      title: 'Code: Reverse Words in a String III',
      description: 'Reverse the order of characters in each word while preserving whitespace.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(n)', notes: 'Single pass, restart window at word boundaries' },
      instruction: `# Reverse Words in a String III

Given a string \`s\`, reverse the order of characters in each word within a sentence while still preserving whitespace and initial word order.

## Examples

**Example 1:**
- Input: \`s = "Let's take LeetCode contest"\`
- Output: \`"s'teL ekat edoCteeL tsetnoc"\`

**Example 2:**
- Input: \`s = "God Ding"\`
- Output: \`"doG gniD"\`

## Constraints
- \`1 <= s.length <= 5 * 10^4\`
- \`s\` contains printable ASCII characters.
- \`s\` does not contain any leading or trailing spaces.
- There is at least one word in \`s\`.
- All the words in \`s\` are separated by a single space.

## Challenge
Use restarting window: restart at each word boundary (space), reverse each word!`,
      starterCode: `def reverseWords(s):
    pass`,
      expectedOutput: `def reverseWords(s):
    result = []
    left = 0
    
    for right in range(len(s)):
        if s[right] == ' ':
            # Word boundary: reverse word from left to right-1
            word = s[left:right]
            result.append(word[::-1])
            result.append(' ')
            left = right + 1  # Restart window after space
    
    # Handle last word
    word = s[left:]
    result.append(word[::-1])
    
    return ''.join(result)`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Track the start of each word. When you hit a space, reverse the word from left to right-1, add it to result, then restart window at right+1. Don\'t forget the last word!'
        },
        {
          afterAttempt: 2,
          text: 'Use left pointer to track word start. When s[right] == \' \', reverse s[left:right] and restart at right+1. Handle the last word separately.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimal Solution - O(n) time, O(n) space

def reverseWords(s):
    result = []
    left = 0
    
    for right in range(len(s)):
        if s[right] == ' ':
            # Word boundary: reverse word from left to right-1
            word = s[left:right]
            result.append(word[::-1])
            result.append(' ')
            left = right + 1  # Restart window after space
    
    # Handle last word (no space after it)
    word = s[left:]
    result.append(word[::-1])
    
    return ''.join(result)

# Key insight: Restart window at each space (word boundary)
# Reverse each word segment independently`
      },
      testCases: [
        { input: '"Let\'s take LeetCode contest"', expectedOutput: '"s\'teL ekat edoCteeL tsetnoc"' },
        { input: '"God Ding"', expectedOutput: '"doG gniD"' },
        { input: '"Hello"', expectedOutput: '"olleH"' }
      ],
      solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand the Problem (30 sec)
- Reverse each word individually
- Keep words in original order
- Preserve spaces

### Step 2: Solution - Restarting Window (1 min)
\`\`\`python
def reverseWords(s):
    words = s.split(' ')
    return ' '.join(word[::-1] for word in words)
\`\`\`

Or with explicit window:
\`\`\`python
def reverseWords(s):
    result = []
    left = 0
    
    for right in range(len(s)):
        if s[right] == ' ':
            result.append(s[left:right][::-1])
            result.append(' ')
            left = right + 1  # RESTART
    
    result.append(s[left:][::-1])  # Last word
    return ''.join(result)
\`\`\`

### Complexity Analysis
- **Time: O(n)** - Single pass
- **Space: O(n)** - Output string

### Key Takeaways
1. Restarting window at word boundaries (spaces)
2. Python's split/join is cleaner for this problem
3. Don't forget the last word (no trailing space)`
    },
  // NOTE: "Longest Substring with K Distinct" (exercise-longest-substring-k-distinct-comprehensive) removed - duplicate of exercise-frequency-k-distinct in main module
  {
  type: 'exercise',
  placement: 'module',
  id: 'exercise-tax-sliding-window-maximum',
  title: 'Sliding Window Maximum',
  description: 'Return max value in each sliding window of size k.',
  requiredForProgress: false,
  targetComplexity: { time: 'O(n)', space: 'O(k)', notes: 'Fixed-size sliding window with monotonic deque' },
  difficulty: 'hard',
  instruction: `# Sliding Window Maximum

Return max value in each sliding window of size k.

## Examples

**Example 1:**
- Input: \`nums = [1,3,-1,-3,5,3,6,7], k = 3\`
- Output: \`[3, 3, 5, 5, 6, 7]\`
- Explanation: Maximum values in each window of size 3

## Approach
Use a monotonic deque to efficiently track the maximum in each window.`,
  starterCode: `def max_sliding_window(nums, k):
    # Return max in each window
    pass`,
      solution: {
        afterAttempt: 3,
    text: `def max_sliding_window(nums, k):
    from collections import deque
    result = []
    dq = deque()  # stores indices
    for i in range(len(nums)):
        # Remove indices outside window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        # Remove smaller elements
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result`
  },
  hints: [
    { afterAttempt: 1, text: 'Use monotonic deque' },
    { afterAttempt: 2, text: 'Keep indices of decreasing elements' }
  ],
  testCases: [
    { input: '[1,3,-1,-3,5,3,6,7], 3', expectedOutput: '[3, 3, 5, 5, 6, 7]' },
    { input: '[1], 1', expectedOutput: '[1]' },
    { input: '[1, -1], 1', expectedOutput: '[1, -1]' }
  ],
  solutionExplanation: `## 10-Minute Interview Thinking Process

### Step 1: Understand (30 sec)
Return max element in each sliding window of size k.

### Step 2: Brute Force
\`\`\`python
def maxSlidingWindow_brute(nums, k):
    return [max(nums[i:i+k]) for i in range(len(nums)-k+1)]
\`\`\`
Time: O(n × k)

### Step 3: Optimized - Monotonic Deque
\`\`\`python
from collections import deque

def maxSlidingWindow(nums, k):
    dq = deque()  # Store indices
    result = []
    
    for i in range(len(nums)):
        # Remove indices outside window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        # Remove smaller elements
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        dq.append(i)
        
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
\`\`\`
Time: O(n), Space: O(k)

### Key Takeaways
1. Monotonic deque maintains max at front
2. Remove smaller elements (they'll never be max)
3. Each element enters/leaves deque once`
},
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-sw-min-recolors-k-black',
    title: 'Minimum Recolors to Get K Consecutive Black Blocks',
    description: 'Fixed window: minimize the number of W in any window of length k.',
    requiredForProgress: false,
    targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Fixed-size sliding window counting “bad” chars' },
    difficulty: 'easy',
    instruction: `# Minimum Recolors to Get K Consecutive Black Blocks

You are given a string \`blocks\` where:
- \`'B'\` means black
- \`'W'\` means white

In one operation, you can recolor a white block (\`'W'\`) to black (\`'B'\`).

Return the minimum number of operations needed so that the string contains **at least one** substring of length \`k\` that is all black.

## Example

Input: blocks = "WBBWWBBWBW", k = 7  
Output: 3

## Constraints

- \`1 <= len(blocks) <= 10^5\`
- \`1 <= k <= len(blocks)\``,
    starterCode: `def minimumRecolors(blocks, k):
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def minimumRecolors(blocks, k):
    # Count whites in the first window
    whites = sum(1 for c in blocks[:k] if c == 'W')
    best = whites

    for i in range(k, len(blocks)):
        if blocks[i] == 'W':
            whites += 1
        if blocks[i - k] == 'W':
            whites -= 1
        best = min(best, whites)

    return best`
    },
    hints: [
      { afterAttempt: 1, text: 'In a window of length k, the number of recolors needed is just the number of W inside it.' },
      { afterAttempt: 2, text: 'Slide a fixed window and track “whites in window”; take the minimum.' }
    ],
    testCases: [
      { input: '"WBBWWBBWBW", 7', expectedOutput: '3' },
      { input: '"WBWBBBW", 2', expectedOutput: '0' },
      { input: '"WW", 2', expectedOutput: '2' }
    ],
    solutionExplanation: `Fixed window + counting. Minimize a window “bad count” (W) instead of maximizing a “good count”.`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-sw-longest-subarray-ones-delete-one',
    title: 'Longest Subarray of 1s After Deleting One Element',
    description: 'Maximum window: keep at most one 0 in the window, then delete it.',
    requiredForProgress: false,
    targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Maximum window with at most one violation' },
    difficulty: 'medium',
    instruction: `# Longest Subarray of 1s After Deleting One Element

Given a binary array \`nums\`, you must delete **exactly one** element.

Return the length of the longest subarray containing only \`1\`'s you can get after deleting one element.

## Examples

- nums = [1,1,0,1] → 3  
- nums = [1,1,1] → 2 (must delete one element)

## Constraints

- \`1 <= len(nums) <= 10^5\`
- \`nums[i]\` is 0 or 1`,
    starterCode: `def longestSubarray(nums):
    pass`,
    solution: {
      afterAttempt: 4,
      text: `def longestSubarray(nums):
    left = 0
    zeros = 0
    best = 0

    for right, x in enumerate(nums):
        if x == 0:
            zeros += 1

        while zeros > 1:
            if nums[left] == 0:
                zeros -= 1
            left += 1

        # Window [left..right] has at most one 0.
        # We must delete one element:
        # - If there's a 0 in the window, delete it -> window_len - 1
        # - If there isn't, still must delete one -> window_len - 1
        best = max(best, (right - left + 1) - 1)

    return best`
    },
    hints: [
      { afterAttempt: 1, text: 'Use a sliding window that allows at most one 0.' },
      { afterAttempt: 2, text: 'Answer is (window length - 1) because you must delete exactly one element.' },
      { afterAttempt: 3, text: 'When zeros > 1, shrink from the left until zeros <= 1 again.' }
    ],
    testCases: [
      { input: '[1, 1, 0, 1]', expectedOutput: '3' },
      { input: '[1, 1, 1]', expectedOutput: '2' },
      { input: '[0, 0, 0]', expectedOutput: '0' },
      { input: '[1, 0, 1, 0, 1]', expectedOutput: '2' }
    ],
    solutionExplanation: `This is a “maximum window” with a small allowed violation (at most one 0). The “delete exactly one” rule is handled by subtracting 1 from the window length.`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-sw-sliding-window-median',
    title: 'Sliding Window Median',
    description: 'Hard combo: sliding window + two heaps + lazy deletions.',
    requiredForProgress: false,
    targetComplexity: { time: 'O(n log k)', space: 'O(k)', notes: 'Maintain two heaps and lazily remove outgoing indices' },
    difficulty: 'hard',
    instruction: `# Sliding Window Median

Given an integer array \`nums\` and an integer \`k\`, return the median of every sliding window of size \`k\`.

- If \`k\` is odd, the median is the middle element after sorting the window.
- If \`k\` is even, the median is the average of the two middle elements.

## Example

Input: nums = [1,3,-1,-3,5,3,6,7], k = 3  
Output: [1, -1, -1, 3, 5, 6]

## Constraints

- \`1 <= len(nums) <= 10^5\`
- \`1 <= k <= len(nums)\``,
    starterCode: `def medianSlidingWindow(nums, k):
    pass`,
    solution: {
      afterAttempt: 5,
      text: `import heapq

def medianSlidingWindow(nums, k):
    # small: max-heap (store (-value, idx))
    # large: min-heap (store (value, idx))
    small = []
    large = []
    removed = set()  # indices marked for lazy removal
    where = {}       # idx -> 'small' or 'large'
    small_size = 0   # count of VALID elements in small
    large_size = 0   # count of VALID elements in large

    def prune(heap):
        # Remove invalid elements from heap top
        while heap and heap[0][1] in removed:
            _, idx = heapq.heappop(heap)
            removed.remove(idx)

    def balance():
        nonlocal small_size, large_size
        prune(small)
        prune(large)

        # small should have either same size as large, or one more
        if small_size > large_size + 1:
            val, idx = heapq.heappop(small)
            prune(small)
            heapq.heappush(large, (-val, idx))
            where[idx] = 'large'
            small_size -= 1
            large_size += 1
        elif small_size < large_size:
            val, idx = heapq.heappop(large)
            prune(large)
            heapq.heappush(small, (-val, idx))
            where[idx] = 'small'
            large_size -= 1
            small_size += 1

    def add(idx):
        nonlocal small_size, large_size
        x = nums[idx]
        if not small:
            heapq.heappush(small, (-x, idx))
            where[idx] = 'small'
            small_size += 1
        else:
            prune(small)
            if x <= -small[0][0]:
                heapq.heappush(small, (-x, idx))
                where[idx] = 'small'
                small_size += 1
            else:
                heapq.heappush(large, (x, idx))
                where[idx] = 'large'
                large_size += 1
        balance()

    def remove(idx):
        nonlocal small_size, large_size
        removed.add(idx)
        if where.get(idx) == 'small':
            small_size -= 1
        else:
            large_size -= 1
        balance()

    def median():
        prune(small)
        prune(large)
        if k % 2 == 1:
            return -small[0][0]
        return (-small[0][0] + large[0][0]) / 2.0

    # Initialize
    for i in range(k):
        add(i)

    res = [median()]

    for right in range(k, len(nums)):
        left = right - k
        add(right)
        remove(left)
        res.append(median())

    return res`
    },
    hints: [
      { afterAttempt: 1, text: 'Maintain two heaps: max-heap for lower half and min-heap for upper half.' },
      { afterAttempt: 2, text: 'You can’t delete arbitrary elements from a heap efficiently — use lazy deletion (mark outgoing indices and prune when they reach the top).' },
      { afterAttempt: 3, text: 'Keep heaps balanced: small has either the same number of valid elements as large, or one extra.' }
    ],
    testCases: [
      { input: '[1,3,-1,-3,5,3,6,7], 3', expectedOutput: '[1, -1, -1, 3, 5, 6]' },
      { input: '[1, 2, 3, 4], 2', expectedOutput: '[1.5, 2.5, 3.5]' },
      { input: '[1, 4, 2, 3], 4', expectedOutput: '[2.5]' }
    ],
    solutionExplanation: `This is an advanced sliding window: the window changes by one element each step, but the statistic (median) needs a balanced data structure. Two heaps + lazy deletions yields O(n log k).`
  }
];
