import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const modulePrefixSuffixLessonSmartPracticeExercises: ExerciseSection[] = [
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-running-sum-1d-array',
      title: 'Very Easy: Running Sum of 1D Array',
      description: 'Warm up by building a simple prefix sum array.',
      instruction: `# Running Sum of 1D Array (LeetCode 1480)

Given an array \`nums\`, return the running sum of \`nums\`.

The running sum at index i is the sum of all elements from index 0 to i.

## Example 1

Input: nums = [1,2,3,4]  
Output: [1,3,6,10]

## Example 2

Input: nums = [1,1,1,1,1]  
Output: [1,2,3,4,5]

## Constraints

- \`1 <= nums.length <= 1000\`  
- \`-10^4 <= nums[i] <= 10^4\``,
      starterCode: `def runningSum(nums):
    pass`,
      expectedOutput: `def runningSum(nums):
    running = 0
    result = []
    for x in nums:
        running += x
        result.append(running)
    return result`,
      hints: [
        { afterAttempt: 1, text: 'Keep a running total and append it to a result list at each step.' }
      ],
      solution: {
        afterAttempt: 3,
        text: `## Solution - O(n) time, O(1) extra space

\`\`\`python
def runningSum(nums):
    running = 0
    result = []
    for x in nums:
        running += x
        result.append(running)
    return result
\`\`\`

Key idea: "current state = previous state + current value" – accumulate as you go.`
      },
      testCases: [
        { input: '[1, 2, 3, 4]', expectedOutput: '[1, 3, 6, 10]' },
        { input: '[1, 1, 1, 1, 1]', expectedOutput: '[1, 2, 3, 4, 5]' },
        { input: '[3, 1, 2, 10, 1]', expectedOutput: '[3, 4, 6, 16, 17]' }
      ],
      targetComplexity: { time: "O(n)", space: "O(1)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: false,
      difficulty: 'easy',
      solutionExplanation: `This exercise is purely about getting comfortable with accumulating a running value – the core mechanic behind prefix sums.`
  },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-build-suffix-sum-array',
      title: 'Very Easy: Build Suffix Sum Array',
      description: 'Warm up by doing the mirror-image pass: right → left.',
      instruction: `# Build Suffix Sum Array (Very Easy)

Given an integer array \`nums\`, return an array \`suffix\` where:

- \`suffix[i]\` = \`nums[i] + nums[i+1] + ... + nums[n-1]\`

This is the same idea as prefix sums — just computed from the other direction.

## Example

Input: nums = [1, 2, 3, 4]  
Output: [10, 9, 7, 4]

## Constraints

- \`1 <= nums.length <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\``,
      starterCode: `def suffixSums(nums):
    pass`,
      expectedOutput: `def suffixSums(nums):
    n = len(nums)
    suffix = [0] * n
    running = 0
    for i in range(n - 1, -1, -1):
        running += nums[i]
        suffix[i] = running
    return suffix`,
      hints: [
        { afterAttempt: 1, text: 'Scan from right to left and keep a running sum.' },
        { afterAttempt: 2, text: 'At each index i: running += nums[i]; suffix[i] = running' }
      ],
      solution: {
        afterAttempt: 3,
        text: `## Solution - O(n) time, O(1) extra space

\`\`\`python
def suffixSums(nums):
    n = len(nums)
    suffix = [0] * n
    running = 0
    for i in range(n - 1, -1, -1):
        running += nums[i]
        suffix[i] = running
    return suffix
\`\`\`

Same accumulation principle as a running sum, just walking right-to-left.`
      },
      testCases: [
        { input: '[1, 2, 3, 4]', expectedOutput: '[10, 9, 7, 4]' },
        { input: '[-2, 0, 3, -5, 2, -1]', expectedOutput: '[-3, -1, -1, -4, 1, -1]' },
        { input: '[5]', expectedOutput: '[5]' }
      ],
      targetComplexity: { time: "O(n)", space: "O(1)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: false,
      difficulty: 'easy',
      solutionExplanation: `Suffix arrays are just prefix arrays built from the right. This drill makes the backward loop feel natural.`
  },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-build-prefix-min-array',
      title: 'Very Easy: Build Prefix Minimum Array',
      description: 'Prefix ideas work for min/max too — not just sums.',
      instruction: `# Build Prefix Minimum Array (Very Easy)

Given an integer array \`nums\`, return an array \`prefMin\` where:

- \`prefMin[i]\` = minimum value in \`nums[0..i]\`

## Example

Input: nums = [3, 1, 4, 2]  
Output: [3, 1, 1, 1]

## Constraints

- \`1 <= nums.length <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\``,
      starterCode: `def prefixMins(nums):
    pass`,
      expectedOutput: `def prefixMins(nums):
    result = []
    current = float('inf')
    for x in nums:
        current = min(current, x)
        result.append(current)
    return result`,
      hints: [
        { afterAttempt: 1, text: 'Keep a running minimum instead of a running sum.' },
        { afterAttempt: 2, text: 'Update current = min(current, nums[i]) then append it.' }
      ],
      solution: {
        afterAttempt: 3,
        text: `## Solution - O(n) time, O(1) extra space

\`\`\`python
def prefixMins(nums):
    result = []
    current = float('inf')
    for x in nums:
        current = min(current, x)
        result.append(current)
    return result
\`\`\`

Same principle, different accumulator.`
      },
      testCases: [
        { input: '[3, 1, 4, 2]', expectedOutput: '[3, 1, 1, 1]' },
        { input: '[-1, -2, 0]', expectedOutput: '[-1, -2, -2]' },
        { input: '[5]', expectedOutput: '[5]' }
      ],
      targetComplexity: { time: "O(n)", space: "O(1)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: false,
      difficulty: 'easy',
      solutionExplanation: `Many “prefix/suffix” problems are really “state-so-far” problems. Here the state is the best (minimum) value so far.`
  },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-range-sum-query-immutable',
      title: 'Code: Range Sum Query (Immutable)',
      description: 'Use a prefix array to answer multiple range sum queries efficiently.',
      instruction: `# Range Sum Query (Immutable) – Prefix Sum Version

You are given an integer array \`nums\` and a list of queries. Each query is a pair \`[left, right]\` asking for the sum of \`nums[left:right+1]\`.

Return an array of answers where each entry is the sum for one query.

## Example

Input:  
- nums = [-2, 0, 3, -5, 2, -1]  
- queries = [[0,2], [2,5], [0,5]]

Output: [1, -1, -3]

Explanation:
- sum(nums[0:3]) = -2 + 0 + 3 = 1  
- sum(nums[2:6]) = 3 + (-5) + 2 + (-1) = -1  
- sum(nums[0:6]) = -2 + 0 + 3 + (-5) + 2 + (-1) = -3

## Constraints

- \`1 <= nums.length <= 10^4\`  
- \`-10^4 <= nums[i] <= 10^4\`  
- \`1 <= len(queries) <= 10^4\``,
      starterCode: `def rangeSumQuery(nums, queries):
    pass`,
      expectedOutput: `def rangeSumQuery(nums, queries):
    n = len(nums)
    prefix = [0] * (n + 1)
    for i, x in enumerate(nums):
        prefix[i + 1] = prefix[i] + x
    result = []
    for left, right in queries:
        result.append(prefix[right + 1] - prefix[left])
    return result`,
      hints: [
        { afterAttempt: 1, text: 'Build prefix[i] = sum of nums[0:i]. Then each query is prefix[right+1] - prefix[left].' }
      ],
      solution: {
        afterAttempt: 3,
        text: `## Solution - O(n + q) time, O(n) space

\`\`\`python
def rangeSumQuery(nums, queries):
    n = len(nums)
    prefix = [0] * (n + 1)
    for i, x in enumerate(nums):
        prefix[i + 1] = prefix[i] + x
    result = []
    for left, right in queries:
        result.append(prefix[right + 1] - prefix[left])
    return result
\`\`\`

We pay O(n) once to build the prefix array, then each query is O(1).`
      },
      testCases: [
        { input: '[-2, 0, 3, -5, 2, -1], [[0,2],[2,5],[0,5]]', expectedOutput: '[1, -1, -3]' },
        { input: '[1, 2, 3, 4], [[0,3],[1,2]]', expectedOutput: '[10, 5]' }
      ],
      targetComplexity: { time: "O(n + q)", space: "O(n)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: false,
      difficulty: 'easy',
      solutionExplanation: `This problem forces you to see prefix sums as a way to answer many range queries after a single pre-computation.`
  },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-pivot-index',
      title: 'Code: Find Pivot Index',
      description: 'Find index where left sum equals right sum.',
      instruction: `# Find Pivot Index (LeetCode 724)

Given an array of integers nums, calculate the **pivot index** - where sum of left equals sum of right.

## Examples

**Example 1:**
- Input: nums = [1, 7, 3, 6, 5, 6]
- Output: 3
- Explanation: Left sum = 1+7+3 = 11, Right sum = 5+6 = 11

**Example 2:**
- Input: nums = [1, 2, 3]
- Output: -1

## Why Prefix/Suffix (Not Sliding Window)?

- No fixed window size
- Need BOTH left and right sums
- Can't "slide" - different elements each time`,
      starterCode: `def pivotIndex(nums):
    pass`,
      expectedOutput: `def pivotIndex(nums):
    total = sum(nums)
    left_sum = 0
    
    for i in range(len(nums)):
        right_sum = total - left_sum - nums[i]
        if left_sum == right_sum:
            return i
        left_sum += nums[i]
    
    return -1`,
      hints: [
        { afterAttempt: 1, text: 'Compute total first. Think: left + current + right = total.' },
        { afterAttempt: 2, text: 'Track left_sum as you iterate. Can you derive right_sum from total without storing it?' }
      ],
      solution: {
        afterAttempt: 3,
        text: `## Solution - O(n) time, O(1) space

\`\`\`python
def pivotIndex(nums):
    total = sum(nums)
    left_sum = 0
    
    for i in range(len(nums)):
        right_sum = total - left_sum - nums[i]
        if left_sum == right_sum:
            return i
        left_sum += nums[i]
    
    return -1
\`\`\`

**Key Insight:** right_sum = total - left_sum - nums[i]
- No need to store suffix array
- Calculate right_sum dynamically each iteration`
      },
      testCases: [
        { input: '[1, 7, 3, 6, 5, 6]', expectedOutput: '3' },
        { input: '[1, 2, 3]', expectedOutput: '-1' },
        { input: '[2, 1, -1]', expectedOutput: '0' }
      ],
      targetComplexity: { time: "O(n)", space: "O(1)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: true,
      difficulty: 'easy',
      solutionExplanation: `## The Brute-Force Instinct

When you first see this problem, the obvious move is: *for every index, add up everything on the left, add up everything on the right, and compare*. You might write something like:

\`\`\`python
def pivotIndex(nums):
    for i in range(len(nums)):
        left_sum = sum(nums[:i])
        right_sum = sum(nums[i+1:])
        if left_sum == right_sum:
            return i
    return -1
\`\`\`

It works, but on a 10 000-element array you're doing roughly n × n additions – O(n²). The test cases will time out.

---

## Spotting the Wasted Work - A Detailed Walkthrough

Let's trace through the brute force approach step-by-step to see **exactly** where redundant work happens:

\`\`\`
nums = [1, 7, 3, 6, 5, 6]

i=0: left_sum = sum([])           = 0        (0 additions)
     right_sum = sum([7,3,6,5,6]) = 27       (5 additions)
     Total: 5 additions

i=1: left_sum = sum([1])          = 1        (1 addition)
     right_sum = sum([3,6,5,6])   = 20       (4 additions)
     Total: 5 additions
     
i=2: left_sum = sum([1,7])        = 8        (2 additions: 1+7)
     right_sum = sum([6,5,6])     = 17       (3 additions)
     Total: 5 additions
     
i=3: left_sum = sum([1,7,3])      = 11       (3 additions: 1+7+3)
     right_sum = sum([5,6])        = 11       (2 additions)
     Total: 5 additions
\`\`\`

**Total operations:** 5 + 5 + 5 + 5 = 20 additions

---

## 🔍 The Redundancy Revealed

### Left Side: Recalculating What You Already Know

Look at the left_sum calculations:

**At i=1:** \`left_sum = 1\` (we added: 1)

**At i=2:** \`left_sum = 1+7\` (we added: 1 + 7)

**The waste:** When computing \`left_sum\` at i=2, we're adding \`1+7\` from scratch. But we **already calculated** \`1\` at i=1! 

**What we should do:**
- Keep the previous \`left_sum = 1\`
- Just add the new element: \`left_sum = 1 + 7 = 8\`
- **Saved:** 1 unnecessary addition

**Pattern:** \`left_sum[i] = left_sum[i-1] + nums[i-1]\`

### Right Side: Even More Wasteful

Look at the right_sum calculations:

**At i=0:** \`right_sum = 7+3+6+5+6 = 27\` (5 additions)

**At i=1:** \`right_sum = 3+6+5+6 = 20\` (4 additions)

**The waste:** We're recalculating \`3+6+5+6\` from scratch, even though we already computed \`7+3+6+5+6\`!

**Better approach:** If we know \`total = sum(nums) = 28\`, then:
- \`right_sum = total - left_sum - nums[i]\`
- At i=1: \`right_sum = 28 - 1 - 7 = 20\` ✅
- **Saved:** 4 unnecessary additions!

---

## 💡 How to Recognize This Approach

When you see nested loops or repeated calculations, ask:

1. **"What did I compute in the previous iteration?"**
   - At i=1: We computed \`left_sum = 1\`
   
2. **"What's different now?"**
   - At i=2: We need \`left_sum = 1+7\`
   
3. **"Can I reuse the previous result?"**
   - Yes! \`new_left_sum = old_left_sum + new_element\`
   
4. **"Am I recalculating something I could derive?"**
   - Yes! \`right_sum\` can be derived from \`total - left_sum - nums[i]\`

**The bottleneck:** **Redundant re-summation** - throwing away previous calculations and starting over.

---

## The Fix

If you already know the total of all elements, then once you have the left sum, the right sum is just \`total - left_sum - nums[i]\`. No second loop required.

So you walk the array once, keeping a running *left_sum*. At each position you ask whether that left sum equals the implied right sum. If so, you've found the pivot.

\`\`\`python
def pivotIndex(nums):
    total = sum(nums)
    left_sum = 0
    
    for i in range(len(nums)):
        right_sum = total - left_sum - nums[i]
        if left_sum == right_sum:
            return i
        left_sum += nums[i]
    
    return -1
\`\`\`

This is O(n) time and O(1) space – a single pass with no extra arrays. The insight is the same one that drives all prefix/suffix problems: *don't recalculate what you can remember*.`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-left-right-sum-differences',
      title: 'Easy: Left and Right Sum Differences',
      description: 'Compute the absolute difference between left-sum and right-sum at every index.',
      instruction: `# Left and Right Sum Differences (Easy)

Given an integer array \`nums\`, return an array \`answer\` where:

- \`answer[i] = abs(sum(nums[0..i-1]) - sum(nums[i+1..n-1]))\`

## Example

Input: nums = [10, 4, 8, 3]  
Output: [15, 1, 11, 22]

Explanation:
- i=0: left=0, right=4+8+3=15 → 15
- i=1: left=10, right=8+3=11 → 1

## Constraints

- \`1 <= nums.length <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\``,
      starterCode: `def leftRightDifference(nums):
    pass`,
      expectedOutput: `def leftRightDifference(nums):
    total = sum(nums)
    left = 0
    result = []
    for x in nums:
        right = total - left - x
        result.append(abs(left - right))
        left += x
    return result`,
      hints: [
        { afterAttempt: 1, text: 'Compute total first. You can derive right from total, left, and current.' },
        { afterAttempt: 2, text: 'At each position append abs(left - right), then update left += current.' }
      ],
      solution: {
        afterAttempt: 3,
        text: `## Solution - O(n) time, O(1) space

\`\`\`python
def leftRightDifference(nums):
    total = sum(nums)
    left = 0
    result = []
    for x in nums:
        right = total - left - x
        result.append(abs(left - right))
        left += x
    return result
\`\`\`

Same derivation principle: right = total - left - current.`
      },
      testCases: [
        { input: '[10, 4, 8, 3]', expectedOutput: '[15, 1, 11, 22]' },
        { input: '[1]', expectedOutput: '[0]' },
        { input: '[1, 2, 3]', expectedOutput: '[5, 2, 3]' }
      ],
      targetComplexity: { time: "O(n)", space: "O(1)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: false,
      difficulty: 'easy',
      solutionExplanation: `You’re building “left history” as you scan, and deriving the “right future” from the total — a classic prefix/suffix move.`
  },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-max-score-split-binary-string',
      title: 'Easy: Max Score After Splitting a Binary String',
      description: 'At each split, score = (#0 on the left) + (#1 on the right).',
      instruction: `# Max Score After Splitting a Binary String (Easy)

You are given a binary string \`s\` (only \`'0'\` and \`'1'\`).

Split \`s\` into two **non-empty** parts: \`left\` and \`right\`.

The score of a split is:

- \`(# of '0' in left) + (# of '1' in right)\`

Return the maximum score across all possible splits.

## Example

Input: s = "011101"  
Output: 5

## Constraints

- \`2 <= len(s) <= 10^5\`
- \`s[i]\` is \`'0'\` or \`'1'\``,
      starterCode: `def maxScoreSplit(s):
    pass`,
      expectedOutput: `def maxScoreSplit(s):
    right_ones = s.count('1')
    left_zeros = 0
    best = 0
    for i in range(len(s) - 1):
        if s[i] == '0':
            left_zeros += 1
        else:
            right_ones -= 1
        best = max(best, left_zeros + right_ones)
    return best`,
      hints: [
        { afterAttempt: 1, text: 'Count total ones first (that’s the initial right side).' },
        { afterAttempt: 2, text: 'Move the split from left → right: update leftZeros/rightOnes in O(1).' }
      ],
      solution: {
        afterAttempt: 3,
        text: `## Solution - O(n) time, O(1) space

\`\`\`python
def maxScoreSplit(s):
    right_ones = s.count('1')
    left_zeros = 0
    best = 0
    for i in range(len(s) - 1):  # split after i
        if s[i] == '0':
            left_zeros += 1
        else:
            right_ones -= 1
        best = max(best, left_zeros + right_ones)
    return best
\`\`\`

Think “prefix count” on the left and “suffix count” on the right.`
      },
      testCases: [
        { input: '"011101"', expectedOutput: '5' },
        { input: '"00111"', expectedOutput: '5' },
        { input: '"1111"', expectedOutput: '3' },
        { input: '"00"', expectedOutput: '1' }
      ],
      targetComplexity: { time: "O(n)", space: "O(1)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: false,
      difficulty: 'easy',
      solutionExplanation: `Two-direction state in its simplest form: left side accumulates zeros, right side tracks remaining ones.`
  },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-product-except-self',
      title: 'Code: Product of Array Except Self',
      description: 'Classic prefix/suffix - compute products without division.',
      difficulty: 'medium',
      instruction: `# Product of Array Except Self (LeetCode 238)

Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

You must write an algorithm that runs in **O(n)** time and **without using the division operation**.

## Examples

**Example 1:**
- Input: \`nums = [1, 2, 3, 4]\`
- Output: \`[24, 12, 8, 6]\`
- Explanation: 
  - answer[0] = 2×3×4 = 24
  - answer[1] = 1×3×4 = 12
  - answer[2] = 1×2×4 = 8
  - answer[3] = 1×2×3 = 6

**Example 2:**
- Input: \`nums = [-1, 1, 0, -3, 3]\`
- Output: \`[0, 0, 9, 0, 0]\`

## Constraints
- \`2 <= nums.length <= 10^5\`
- \`-30 <= nums[i] <= 30\`
- The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer`,
      starterCode: `def productExceptSelf(nums):
    pass`,
      expectedOutput: `def productExceptSelf(nums):
    n = len(nums)
    answer = [1] * n
    
    # Pass 1: prefix products
    prefix = 1
    for i in range(n):
        answer[i] = prefix
        prefix *= nums[i]
    
    # Pass 2: multiply by suffix products
    suffix = 1
    for i in range(n-1, -1, -1):
        answer[i] *= suffix
        suffix *= nums[i]
    
    return answer`,
      hints: [
        { afterAttempt: 1, text: 'answer[i] = (product of 0..i-1) × (product of i+1..n-1)' },
        { afterAttempt: 2, text: 'Build prefix products left→right, then multiply by suffix right→left' }
      ],
      solution: {
        afterAttempt: 3,
        text: `## Solution - O(n) time, O(1) space

\`\`\`python
def productExceptSelf(nums):
    n = len(nums)
    answer = [1] * n
    
    # Pass 1: prefix products
    prefix = 1
    for i in range(n):
        answer[i] = prefix
        prefix *= nums[i]
    
    # Pass 2: multiply by suffix products
    suffix = 1
    for i in range(n-1, -1, -1):
        answer[i] *= suffix
        suffix *= nums[i]
    
    return answer
\`\`\`

**Key Insight:** answer[i] = prefix_product × suffix_product`
      },
      testCases: [
        { input: '[1, 2, 3, 4]', expectedOutput: '[24, 12, 8, 6]' },
        { input: '[-1, 1, 0, -3, 3]', expectedOutput: '[0, 0, 9, 0, 0]' },
        { input: '[1, 0]', expectedOutput: '[0, 1]' }
      ],
      targetComplexity: { time: "O(n)", space: "O(1)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: true,
      solutionExplanation: `## The Brute-Force Instinct

The straightforward interpretation of "product of everything except myself" is to loop through and multiply everything that isn't me:

\`\`\`python
def productExceptSelf(nums):
    n = len(nums)
    answer = []
    for i in range(n):
        product = 1
        for j in range(n):
            if i != j:
                product *= nums[j]
        answer.append(product)
    return answer
\`\`\`

That's two nested loops – O(n²). On a 100 000-element array you'll be waiting a while.

---

## Why Not Just Divide?

Your next thought might be: *multiply everything together once, then divide by nums[i]*. Clever, but the problem explicitly bans division, and zeros would blow it up anyway. So we need a different trick.

---

## Noticing the Redundancy

Look at what the answer at index 3 needs versus index 4. The *left product* for index 4 is exactly the left product for index 3, times nums[3]. Similarly for the *right product* – it's incrementally related.

In other words, every prefix product can be built from its predecessor in O(1). Same for suffixes going the other direction.

---

## Two Quick Passes

Walk left to right, accumulating the running product *before* each index into an answer array. Then walk right to left, accumulating the running product *after* each index and multiplying it in.

\`\`\`python
def productExceptSelf(nums):
    n = len(nums)
    answer = [1] * n
    
    # Pass 1: store "product of everything to my left"
    prefix = 1
    for i in range(n):
        answer[i] = prefix
        prefix *= nums[i]
    
    # Pass 2: multiply by "product of everything to my right"
    suffix = 1
    for i in range(n-1, -1, -1):
        answer[i] *= suffix
        suffix *= nums[i]
    
    return answer
\`\`\`

Two O(n) passes, constant extra space beyond the output. The nested loops vanish because you stopped throwing away cumulative work.`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-good-splits',
      title: 'Code: Number of Good Ways to Split a String',
      description: 'Count splits where both parts have equal distinct characters.',
      difficulty: 'medium',
      instruction: `# Number of Good Ways to Split a String (LeetCode 1525)

You are given a string \`s\`, a split is called **good** if you can split \`s\` into two non-empty strings \`sleft\` and \`sright\` where their concatenation equals \`s\` (i.e., \`sleft + sright = s\`) and the number of distinct characters in \`sleft\` and \`sright\` is the same.

Return the number of **good splits** you can make in \`s\`.

## Examples

**Example 1:**
- Input: s = "aacaba"
- Output: 2
- Explanation: 
  - Split at index 2: "aa" | "caba" → distinct("aa") = 1, distinct("caba") = 3 ✗
  - Split at index 3: "aac" | "aba" → distinct("aac") = 2, distinct("aba") = 2 ✓
  - Split at index 4: "aaca" | "ba" → distinct("aaca") = 2, distinct("ba") = 2 ✓

**Example 2:**
- Input: s = "abcd"
- Output: 1
- Explanation: Split at index 1: "a" | "bcd" → distinct("a") = 1, distinct("bcd") = 3 ✗
- Actually, split at index 2: "ab" | "cd" → distinct("ab") = 2, distinct("cd") = 2 ✓

## Constraints
- \`1 <= s.length <= 10^5\`
- \`s\` contains only lowercase English letters.`,
      starterCode: `def numSplits(s):
    pass`,
      expectedOutput: `def numSplits(s):
    n = len(s)
    
    # Prefix: distinct chars from left
    prefix_distinct = [0] * n
    seen = set()
    for i in range(n):
        seen.add(s[i])
        prefix_distinct[i] = len(seen)
    
    # Suffix: distinct chars from right
    suffix_distinct = [0] * n
    seen = set()
    for i in range(n-1, -1, -1):
        seen.add(s[i])
        suffix_distinct[i] = len(seen)
    
    # Count good splits: split after index i
    # Left = s[0:i+1], Right = s[i+1:n]
    count = 0
    for i in range(n-1):
        if prefix_distinct[i] == suffix_distinct[i+1]:
            count += 1
    
    return count`,
      hints: [
        { afterAttempt: 1, text: 'Build prefix[i] = distinct chars in s[0:i+1], suffix[i] = distinct chars in s[i:n]' },
        { afterAttempt: 2, text: 'Split after index i: compare prefix[i] with suffix[i+1] (note the offset!)' }
      ],
      solution: {
        afterAttempt: 3,
        text: `## Solution - O(n) time, O(n) space

\`\`\`python
def numSplits(s):
    n = len(s)
    
    # Prefix: distinct chars from left
    prefix_distinct = [0] * n
    seen = set()
    for i in range(n):
        seen.add(s[i])
        prefix_distinct[i] = len(seen)
    
    # Suffix: distinct chars from right
    suffix_distinct = [0] * n
    seen = set()
    for i in range(n-1, -1, -1):
        seen.add(s[i])
        suffix_distinct[i] = len(seen)
    
    # Count good splits: split after index i
    # Left = s[0:i+1], Right = s[i+1:n]
    count = 0
    for i in range(n-1):
        if prefix_distinct[i] == suffix_distinct[i+1]:
            count += 1
    
    return count
\`\`\`

**Key Insight:** 
- prefix[i] = distinct chars in s[0:i+1]
- suffix[i+1] = distinct chars in s[i+1:n]
- Split after index i is good if prefix[i] == suffix[i+1]`
      },
      testCases: [
        { input: '"aacaba"', expectedOutput: '2' },
        { input: '"abcd"', expectedOutput: '1' },
        { input: '"aaaaa"', expectedOutput: '4' }
      ],
      targetComplexity: { time: "O(n)", space: "O(n)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: true,
      solutionExplanation: `## The Brute-Force Instinct

The problem literally asks *how many places can I cut the string so both halves have the same number of unique letters?* The most direct translation is: try every cut, count distinct characters on each side, compare.

\`\`\`python
def numSplits(s):
    count = 0
    for i in range(len(s) - 1):
        left = s[:i+1]
        right = s[i+1:]
        if len(set(left)) == len(set(right)):
            count += 1
    return count
\`\`\`

Building a \`set\` is O(n), and you do it twice for each of the n-1 split positions. That's roughly O(n²).

---

## Spotting the Redundant Work

Think about what happens as you slide the cut from position 2 to position 3. The left side gains one character and the right side loses one. *Most* of the distinct-character counts stay the same – yet the brute-force version re-scans both halves entirely.

If you could somehow *remember* how many distinct characters exist in the left half up to every position, and similarly remember distinct counts in the right half from every position, you could answer the question in O(1) per split.

---

## Two Passes to the Rescue

Walk left to right, maintaining a set of seen characters. After processing index i, record how many distinct characters are in s[0..i]. Store that in a prefix array.

Then walk right to left doing the same thing; store those counts in a suffix array.

Finally, iterate through possible split positions. Cutting *after* index i means the left part covers indices 0..i (use prefix[i]) and the right part covers i+1..n-1 (use suffix[i+1]). If those counts match, it's a good split.

\`\`\`python
def numSplits(s):
    n = len(s)
    
    prefix_distinct = [0] * n
    seen = set()
    for i in range(n):
        seen.add(s[i])
        prefix_distinct[i] = len(seen)
    
    suffix_distinct = [0] * n
    seen = set()
    for i in range(n-1, -1, -1):
        seen.add(s[i])
        suffix_distinct[i] = len(seen)
    
    count = 0
    for i in range(n-1):
        if prefix_distinct[i] == suffix_distinct[i+1]:
            count += 1
    
    return count
\`\`\`

O(n) time, O(n) space. The key insight is the same as before: *don't recount what you can accumulate*. Watch the index offset – it trips people up more than the algorithm itself.`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-candy',
      title: 'Code: Candy',
      description: 'Distribute candies based on ratings with constraints from both neighbors.',
      difficulty: 'hard',
      instruction: `# Candy (LeetCode 135)

There are \`n\` children standing in a line. Each child is assigned a rating value given in the integer array \`ratings\`.

You are giving candies to these children subjected to the following requirements:
- Each child must have at least one candy.
- Children with a higher rating get more candies than their neighbors.

Return the **minimum number of candies** you need to have to distribute the candies to the children.

## Examples

**Example 1:**
- Input: ratings = [1, 0, 2]
- Output: 5
- Explanation: You can allocate to the first, second and third child with 2, 1, 2 candies respectively.

**Example 2:**
- Input: ratings = [1, 2, 2]
- Output: 4
- Explanation: You can allocate to the first, second and third child with 1, 2, 1 candies respectively.

## Constraints
- \`n == ratings.length\`
- \`1 <= n <= 2 * 10^4\`
- \`0 <= ratings[i] <= 2 * 10^4\``,
      starterCode: `def candy(ratings):
    pass`,
      expectedOutput: `def candy(ratings):
    n = len(ratings)
    
    # Pass 1: Left to right - handle left neighbor constraint
    left = [1] * n
    for i in range(1, n):
        if ratings[i] > ratings[i-1]:
            left[i] = left[i-1] + 1
    
    # Pass 2: Right to left - handle right neighbor constraint
    right = [1] * n
    for i in range(n-2, -1, -1):
        if ratings[i] > ratings[i+1]:
            right[i] = right[i+1] + 1
    
    # Take maximum at each position
    total = 0
    for i in range(n):
        total += max(left[i], right[i])
    
    return total`,
      hints: [
        { afterAttempt: 1, text: 'Process left→right: if rating[i] > rating[i-1], candy[i] = candy[i-1] + 1' },
        { afterAttempt: 2, text: 'Process right→left: if rating[i] > rating[i+1], candy[i] = candy[i+1] + 1' },
        { afterAttempt: 3, text: 'Take max(left[i], right[i]) at each position to satisfy both constraints' }
      ],
      solution: {
        afterAttempt: 4,
        text: `## Solution - O(n) time, O(n) space

\`\`\`python
def candy(ratings):
    n = len(ratings)
    
    # Pass 1: Left to right - handle left neighbor constraint
    left = [1] * n
    for i in range(1, n):
        if ratings[i] > ratings[i-1]:
            left[i] = left[i-1] + 1
    
    # Pass 2: Right to left - handle right neighbor constraint
    right = [1] * n
    for i in range(n-2, -1, -1):
        if ratings[i] > ratings[i+1]:
            right[i] = right[i+1] + 1
    
    # Take maximum at each position
    total = 0
    for i in range(n):
        total += max(left[i], right[i])
    
    return total
\`\`\`

**Key Insight:** 
- Left pass handles "higher than left neighbor"
- Right pass handles "higher than right neighbor"
- Take max to satisfy both constraints`
      },
      testCases: [
        { input: '[1, 0, 2]', expectedOutput: '5' },
        { input: '[1, 2, 2]', expectedOutput: '4' },
        { input: '[1, 2, 87, 87, 87, 2, 1]', expectedOutput: '13' }
      ],
      targetComplexity: { time: "O(n)", space: "O(n)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: true,
      solutionExplanation: `## The Tricky Part

At first glance you might try simulating candy distribution in one pass, but the rules pull in opposite directions: *a child with a higher rating than the neighbour to the left deserves more*, and *a child with a higher rating than the neighbour to the right also deserves more*. You can't satisfy both constraints looking at a single direction because a decision at index 5 might depend on what's still coming at index 6.

A brute-force approach—iterating until nothing changes—would work, but the worst case can spiral into O(n²) passes.

---

## Breaking the Deadlock

The insight is to **separate the two constraints**. First, walk left to right and enforce only the "higher than my left neighbour" rule. If rating[i] > rating[i-1], give that child one more candy than the child on the left; otherwise reset to 1 (the minimum). Store the results in an array.

Then walk right to left doing the same for the "higher than my right neighbour" rule.

Finally, for each child, the candy count that satisfies *both* rules is simply the max of the two arrays at that position.

---

## The Code

\`\`\`python
def candy(ratings):
    n = len(ratings)
    
    # Enforce left-neighbour rule
    left = [1] * n
    for i in range(1, n):
        if ratings[i] > ratings[i-1]:
            left[i] = left[i-1] + 1
    
    # Enforce right-neighbour rule
    right = [1] * n
    for i in range(n-2, -1, -1):
        if ratings[i] > ratings[i+1]:
            right[i] = right[i+1] + 1
    
    # Merge
    return sum(max(left[i], right[i]) for i in range(n))
\`\`\`

Two O(n) passes, O(n) space for the auxiliary arrays. The mental trick is realising you don't have to juggle both constraints simultaneously – handle each direction on its own, then combine.

---

## Why This Works

Consider ratings = [1, 0, 2]. The left pass produces [1, 1, 2] – the middle child has no claim over the left, and the rightmost child beats the middle one. The right pass produces [1, 1, 1] – nobody beats their right neighbour in a way that matters here. Taking the element-wise max gives [1, 1, 2], total = 4... wait, that's 4, but the expected answer is 5. Let me re-check.

Ah, the middle child (rating 0) is lower than *both* neighbours, so left[1] stays 1 and right[1] stays 1. But the first child has rating 1 which is higher than the middle child's 0, so in the *right* pass we actually get right[0] = right[1] + 1 = 2. So right = [2, 1, 1], and max([1, 1, 2], [2, 1, 1]) = [2, 1, 2] → total = 5 ✓.

The lesson: trace through a few examples by hand to internalise how the two passes complement each other.`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-non-overlapping-subarrays',
      title: 'Code: Find Two Non-overlapping Sub-arrays Each With Target Sum',
      description: 'Find two non-overlapping subarrays that each sum to target.',
      difficulty: 'hard',
      instruction: `# Find Two Non-overlapping Sub-arrays Each With Target Sum (LeetCode 1477)

Given an array of integers \`arr\` and an integer \`target\`, you have to find **two non-overlapping sub-arrays** of \`arr\` each with a sum equal \`target\`. There can be multiple answers so you have to find an answer where the sum of the lengths of the two sub-arrays is **minimum**.

Return the minimum sum of the lengths of the two required sub-arrays, or return -1 if you cannot find such two sub-arrays.

## Examples

**Example 1:**
- Input: arr = [3, 2, 2, 4, 3], target = 3
- Output: 2
- Explanation: Only two sub-arrays have sum = 3 ([3] and [3]). The minimum length of the two required sub-arrays is 2, and their lengths sum to 2.

**Example 2:**
- Input: arr = [7, 3, 4, 7], target = 7
- Output: 2
- Explanation: Although we have three non-overlapping sub-arrays with sum = 7 ([7], [4,3] and [7]), but we will choose the first and third sub-arrays as the sum of their lengths is 2.

**Example 3:**
- Input: arr = [4, 3, 2, 6, 2, 3, 4], target = 6
- Output: -1
- Explanation: We have only one sub-array of sum = 6.

## Constraints
- \`1 <= arr.length <= 10^5\`
- \`1 <= arr[i] <= 1000\`
- \`1 <= target <= 10^8\``,
      starterCode: `def minSumOfLengths(arr, target):
    pass`,
      expectedOutput: `def minSumOfLengths(arr, target):
    n = len(arr)
    
    # Find all subarrays with sum = target using prefix sum + hash map
    prefix_sum = 0
    sum_to_idx = {0: -1}
    subarrays = []  # (start, end) pairs
    
    for i in range(n):
        prefix_sum += arr[i]
        if prefix_sum - target in sum_to_idx:
            start = sum_to_idx[prefix_sum - target] + 1
            subarrays.append((start, i))
        sum_to_idx[prefix_sum] = i
    
    if len(subarrays) < 2:
        return -1
    
    # Build prefix array: best length from left
    prefix_best = [float('inf')] * n
    for start, end in subarrays:
        length = end - start + 1
        prefix_best[end] = min(prefix_best[end], length)
    
    # Propagate prefix best forward
    for i in range(1, n):
        prefix_best[i] = min(prefix_best[i], prefix_best[i-1])
    
    # Build suffix array: best length from right
    suffix_best = [float('inf')] * n
    for start, end in subarrays:
        length = end - start + 1
        if suffix_best[start] == float('inf'):
            suffix_best[start] = length
        else:
            suffix_best[start] = min(suffix_best[start], length)
    
    # Propagate suffix best backward
    for i in range(n-2, -1, -1):
        suffix_best[i] = min(suffix_best[i], suffix_best[i+1])
    
    # Find minimum sum
    result = float('inf')
    for start, end in subarrays:
        # Try subarray ending at end, find best before start
        if start > 0 and prefix_best[start-1] != float('inf'):
            result = min(result, (end - start + 1) + prefix_best[start-1])
        # Try subarray starting at start, find best after end
        if end < n-1 and suffix_best[end+1] != float('inf'):
            result = min(result, (end - start + 1) + suffix_best[end+1])
    
    return result if result != float('inf') else -1`,
      hints: [
        { afterAttempt: 1, text: 'First, find all subarrays with sum = target using prefix sum + hash map' },
        { afterAttempt: 2, text: 'Build prefix array: for each position, track best subarray length seen so far from left' },
        { afterAttempt: 3, text: 'Build suffix array: for each position, track best subarray length seen so far from right' },
        { afterAttempt: 4, text: 'For each subarray, check if there\'s a non-overlapping one before (prefix) or after (suffix)' }
      ],
      solution: {
        afterAttempt: 5,
        text: `## Solution - O(n) time, O(n) space

\`\`\`python
def minSumOfLengths(arr, target):
    n = len(arr)
    
    # Step 1: Find all subarrays with sum = target
    prefix_sum = 0
    sum_to_idx = {0: -1}
    subarrays = []
    
    for i in range(n):
        prefix_sum += arr[i]
        if prefix_sum - target in sum_to_idx:
            start = sum_to_idx[prefix_sum - target] + 1
            subarrays.append((start, i))
        sum_to_idx[prefix_sum] = i
    
    if len(subarrays) < 2:
        return -1
    
    # Step 2: Build prefix array - best length from left
    prefix_best = [float('inf')] * n
    for start, end in subarrays:
        length = end - start + 1
        prefix_best[end] = min(prefix_best[end], length)
    
    # Propagate forward
    for i in range(1, n):
        prefix_best[i] = min(prefix_best[i], prefix_best[i-1])
    
    # Step 3: Build suffix array - best length from right
    suffix_best = [float('inf')] * n
    for start, end in subarrays:
        length = end - start + 1
        suffix_best[start] = min(suffix_best[start], length)
    
    # Propagate backward
    for i in range(n-2, -1, -1):
        suffix_best[i] = min(suffix_best[i], suffix_best[i+1])
    
    # Step 4: Find minimum sum
    result = float('inf')
    for start, end in subarrays:
        length = end - start + 1
        # Check for non-overlapping subarray before
        if start > 0 and prefix_best[start-1] != float('inf'):
            result = min(result, length + prefix_best[start-1])
        # Check for non-overlapping subarray after
        if end < n-1 and suffix_best[end+1] != float('inf'):
            result = min(result, length + suffix_best[end+1])
    
    return result if result != float('inf') else -1
\`\`\`

**Key Insight:** 
- Use prefix sum + hash map to find all subarrays with target sum
- Use prefix/suffix arrays to track best solution from each direction
- Combine to find two non-overlapping subarrays`
      },
      testCases: [
        { input: '[3, 2, 2, 4, 3], 3', expectedOutput: '2' },
        { input: '[7, 3, 4, 7], 7', expectedOutput: '2' },
        { input: '[4, 3, 2, 6, 2, 3, 4], 6', expectedOutput: '-1' }
      ],
      targetComplexity: { time: "O(n)", space: "O(n)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: true,
      solutionExplanation: `## The Brute-Force Instinct

The literal approach: enumerate every subarray that sums to target (O(n²) using nested loops), then check every pair to see if they overlap, keeping the shortest combined length. On a long array with many valid subarrays this blows up quickly – O(n²) just to find candidates, then O(k²) to compare pairs.

\`\`\`python
# sketch of brute force
    subarrays = []
    for i in range(len(arr)):
    running = 0
        for j in range(i, len(arr)):
        running += arr[j]
        if running == target:
                subarrays.append((i, j))
    
best = infinity
for a in subarrays:
    for b in subarrays:
        if non_overlapping(a, b):
            best = min(best, len(a) + len(b))
\`\`\`

---

## Where's the Redundancy?

Once you've found a valid subarray ending at index 10, you don't need to know *all* the other subarrays – you just need to know the *shortest* valid subarray that lies entirely before index 10 (or entirely after). Comparing with every other subarray individually is overkill.

---

## Prefix / Suffix to the Rescue

First, find all subarrays with the target sum in O(n) using the classic prefix-sum + hash-map trick. Then build:

1. **prefix_best[i]** = length of the shortest valid subarray that ends at or before index i.
2. **suffix_best[i]** = length of the shortest valid subarray that starts at or after index i.

Both arrays can be computed in O(n) by propagating the running minimum.

Finally, for each valid subarray, combine it with the best non-overlapping partner from the opposite side.

\`\`\`python
def minSumOfLengths(arr, target):
    n = len(arr)
    
    # Step 1: find all target-sum subarrays via prefix sum
    prefix_sum, sum_to_idx, subarrays = 0, {0: -1}, []
    for i in range(n):
        prefix_sum += arr[i]
        if prefix_sum - target in sum_to_idx:
            start = sum_to_idx[prefix_sum - target] + 1
            subarrays.append((start, i))
        sum_to_idx[prefix_sum] = i
    
    if len(subarrays) < 2:
        return -1
    
    # Step 2: build prefix_best
    prefix_best = [float('inf')] * n
    for s, e in subarrays:
        prefix_best[e] = min(prefix_best[e], e - s + 1)
    for i in range(1, n):
        prefix_best[i] = min(prefix_best[i], prefix_best[i-1])
    
    # Step 3: build suffix_best
    suffix_best = [float('inf')] * n
    for s, e in subarrays:
        suffix_best[s] = min(suffix_best[s], e - s + 1)
    for i in range(n-2, -1, -1):
        suffix_best[i] = min(suffix_best[i], suffix_best[i+1])
    
    # Step 4: combine
    result = float('inf')
    for s, e in subarrays:
        length = e - s + 1
        if s > 0 and prefix_best[s-1] < float('inf'):
            result = min(result, length + prefix_best[s-1])
        if e < n-1 and suffix_best[e+1] < float('inf'):
            result = min(result, length + suffix_best[e+1])
    
    return result if result < float('inf') else -1
\`\`\`

O(n) overall. The insight is classic prefix/suffix thinking: precompute *the best you can do* from each direction so you can answer "what's the best partner for this subarray?" in O(1).`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-shortest-palindrome',
      title: 'Code: Shortest Palindrome',
      description: 'Find shortest palindrome by adding characters to the front.',
      difficulty: 'hard',
      instruction: `# Shortest Palindrome (LeetCode 214)

You are given a string \`s\`. You can convert it to a palindrome by adding characters in front of it.

Return the shortest palindrome you can find by performing this transformation.

## Examples

**Example 1:**
- Input: s = "aacecaaa"
- Output: "aaacecaaa"
- Explanation: Add "aa" to the front: "aa" + "aacecaaa" = "aaacecaaa"

**Example 2:**
- Input: s = "abcd"
- Output: "dcbabcd"
- Explanation: Add "dcb" to the front: "dcb" + "abcd" = "dcbabcd"

## Constraints
- \`0 <= s.length <= 5 * 10^4\`
- \`s\` consists of lowercase English letters only.`,
      starterCode: `def shortestPalindrome(s):
    pass`,
      expectedOutput: `def shortestPalindrome(s):
    if not s:
        return ""
    
    # Find longest palindrome prefix
    n = len(s)
    for i in range(n, 0, -1):
        if s[:i] == s[:i][::-1]:
            # Found palindrome prefix of length i
            # Need to add reverse of remaining suffix
            return s[i:][::-1] + s
    
    return s[::-1] + s`,
      hints: [
        { afterAttempt: 1, text: 'Find the longest prefix that is a palindrome' },
        { afterAttempt: 2, text: 'Reverse the remaining suffix and prepend it to the original string' }
      ],
      solution: {
        afterAttempt: 3,
        text: `## Solution - O(n²) time, O(n) space

\`\`\`python
def shortestPalindrome(s):
    if not s:
        return ""
    
    # Find longest palindrome prefix
    n = len(s)
    for i in range(n, 0, -1):
        if s[:i] == s[:i][::-1]:
            # Found palindrome prefix of length i
            # Need to add reverse of remaining suffix
            return s[i:][::-1] + s
    
    return s[::-1] + s
\`\`\`

**Key Insight:** 
- Find longest palindrome prefix
- Reverse the remaining suffix and prepend it
- This gives the shortest palindrome`
      },
      testCases: [
        { input: '"aacecaaa"', expectedOutput: '"aaacecaaa"' },
        { input: '"abcd"', expectedOutput: '"dcbabcd"' },
        { input: '""', expectedOutput: '""' }
      ],
      targetComplexity: { time: "O(n²)", space: "O(n)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: true,
      solutionExplanation: `## The Brute-Force Instinct

You're only allowed to add characters *in front* of the string. So the question becomes: what's the minimum stuff I have to prepend to make the whole thing read the same forwards and backwards?

The naïve idea: try prepending the reverse of increasingly long suffixes and check whether the result is a palindrome.

\`\`\`python
def shortestPalindrome(s):
    for i in range(len(s)):
        candidate = s[len(s)-i-1:][::-1] + s
        if candidate == candidate[::-1]:
            return candidate
    return s[::-1] + s
\`\`\`

Each palindrome check is O(n), and you might do it up to n times – O(n²).

---

## Reframing the Problem

Here's a more useful lens: if the *prefix* of s is already a palindrome, you don't need to add anything for those characters – they'll mirror themselves. The characters you *do* need to mirror are the ones in the leftover suffix.

So the real task is: **find the longest prefix of s that's already a palindrome**, then reverse whatever's left over and stick it on the front.

---

## A Direct O(n²) Implementation

Check prefixes from longest to shortest until you find one that's a palindrome:

\`\`\`python
def shortestPalindrome(s):
    if not s:
        return ""
    
    for length in range(len(s), 0, -1):
        if s[:length] == s[:length][::-1]:
            return s[length:][::-1] + s
    
    return s[::-1] + s
\`\`\`

Worst case is still O(n²) because each palindrome check is O(n). For LeetCode's constraints this usually passes, but if you need true O(n) you'd reach for KMP or rolling hashes – beyond the scope of this module.

---

## Walking Through an Example

s = "aacecaaa"

Check s[:8] = "aacecaaa" – is it a palindrome? Reverse is "aaacecaa", not equal.  
Check s[:7] = "aacecaa" – reverse is "aacecaa" – yes, it's a palindrome!

So the longest palindromic prefix has length 7. The suffix left over is s[7:] = "a". Reverse that and prepend: "a" + "aacecaaa" = "aaacecaaa" ✓.

The thinking at play: you're computing *prefix* information (what's the longest palindrome starting at index 0?) and *suffix* information (what do I need to mirror?) and combining them.`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-maximum-sum-subarray-split',
      title: 'Code: Maximum Sum Subarray Split (Custom)',
      description: 'Find split where sum of maximum subarray in prefix equals sum of maximum subarray in suffix.',
      difficulty: 'medium',
      instruction: `# Maximum Sum Subarray Split (Custom Problem)

Given an array of integers \`nums\`, define:

- \`prefBest[i]\` = the maximum subarray sum within \`nums[0..i]\`
- \`sufBest[i]\` = the maximum subarray sum within \`nums[i..n-1]\`

Find a split index \`i\` (where \`1 <= i <= n-1\`) such that:

\`prefBest[i-1] == sufBest[i]\`

Return the **smallest** such \`i\`, or \`-1\` if no such split exists.

## Example

Input: nums = [5, -2, 5]  
Output: 1

Explanation:
- \`prefBest[0]\` (best in [5]) = 5
- \`sufBest[1]\` (best in [-2, 5]) = 5
- They match at i=1

## Constraints

- \`1 <= nums.length <= 10^4\`
- \`-10^4 <= nums[i] <= 10^4\``,
      starterCode: `def maxSubarraySplit(nums):
    pass`,
      expectedOutput: `def maxSubarraySplit(nums):
    n = len(nums)
    
    # Prefix: max subarray sum ending at each index
    prefix_max = [0] * n
    max_ending_here = 0
    max_so_far = float('-inf')
    
    for i in range(n):
        max_ending_here = max(nums[i], max_ending_here + nums[i])
        max_so_far = max(max_so_far, max_ending_here)
        prefix_max[i] = max_so_far
    
    # Suffix: max subarray sum starting from each index
    suffix_max = [0] * n
    max_ending_here = 0
    max_so_far = float('-inf')
    
    for i in range(n-1, -1, -1):
        max_ending_here = max(nums[i], max_ending_here + nums[i])
        max_so_far = max(max_so_far, max_ending_here)
        suffix_max[i] = max_so_far
    
    # Find index where prefix_max[i-1] == suffix_max[i]
    for i in range(1, n):
        if prefix_max[i-1] == suffix_max[i]:
            return i
    
    return -1`,
      hints: [
        { afterAttempt: 1, text: 'Use Kadane\'s algorithm to compute max subarray sum for each prefix' },
        { afterAttempt: 2, text: 'Use Kadane\'s algorithm to compute max subarray sum for each suffix' },
        { afterAttempt: 3, text: 'Find index i where prefix_max[i-1] == suffix_max[i]' }
      ],
      solution: {
        afterAttempt: 4,
        text: `## Solution - O(n) time, O(n) space

\`\`\`python
def maxSubarraySplit(nums):
    n = len(nums)
    
    # Prefix: max subarray sum ending at each index
    prefix_max = [0] * n
    max_ending_here = 0
    max_so_far = float('-inf')
    
    for i in range(n):
        max_ending_here = max(nums[i], max_ending_here + nums[i])
        max_so_far = max(max_so_far, max_ending_here)
        prefix_max[i] = max_so_far
    
    # Suffix: max subarray sum starting from each index
    suffix_max = [0] * n
    max_ending_here = 0
    max_so_far = float('-inf')
    
    for i in range(n-1, -1, -1):
        max_ending_here = max(nums[i], max_ending_here + nums[i])
        max_so_far = max(max_so_far, max_ending_here)
        suffix_max[i] = max_so_far
    
    # Find index where prefix_max[i-1] == suffix_max[i]
    for i in range(1, n):
        if prefix_max[i-1] == suffix_max[i]:
            return i
    
    return -1
\`\`\`

**Key Insight:** 
- Use Kadane's algorithm for prefix and suffix
- prefix_max[i] = max subarray sum in nums[0:i+1]
- suffix_max[i] = max subarray sum in nums[i:n]
- Find split where they're equal`
      },
      testCases: [
        { input: '[1, 2, 3, 4]', expectedOutput: '-1' },
        { input: '[3, -1, 3, -1, 3]', expectedOutput: '-1' },
        { input: '[5, -2, 5]', expectedOutput: '1' }
      ],
      targetComplexity: { time: "O(n)", space: "O(n)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: false,
      solutionExplanation: `## Thinking It Through

This problem is a mashup: you need the classic *maximum subarray sum* (Kadane's algorithm) combined with the prefix/suffix technique. The brute-force version would run Kadane's separately on every possible prefix and every possible suffix, then compare – that's O(n²).

The improvement is straightforward once you see the redundancy: Kadane's is inherently incremental. As you walk left to right, you can record the best subarray sum seen *so far* – that's your prefix array. Do the same walking right to left for the suffix array. Both passes are O(n).

---

## The Code

\`\`\`python
def maxSubarraySplit(nums):
    n = len(nums)
    
    # Prefix: max subarray sum in nums[0..i]
    prefix_max = [0] * n
    current, best = 0, float('-inf')
    for i in range(n):
        current = max(nums[i], current + nums[i])
        best = max(best, current)
        prefix_max[i] = best
    
    # Suffix: max subarray sum in nums[i..n-1]
    suffix_max = [0] * n
    current, best = 0, float('-inf')
    for i in range(n-1, -1, -1):
        current = max(nums[i], current + nums[i])
        best = max(best, current)
        suffix_max[i] = best
    
    # Find split where prefix_max[i-1] == suffix_max[i]
    for i in range(1, n):
        if prefix_max[i-1] == suffix_max[i]:
            return i
    
    return -1
\`\`\`

O(n) time, O(n) space. The conceptual leap is realising that Kadane's "best so far" variable is itself a prefix-style accumulation – so you're just recording those intermediate values instead of discarding them.

---

## Why This Matters

Interview problems love to combine two techniques like this. Once you're comfortable with the prefix/suffix mindset, slotting Kadane's (or any other incremental algorithm) into that frame becomes natural.`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-trapping-rain-water',
      title: 'Code: Trapping Rain Water',
      description: 'Use prefix max and suffix max arrays to compute trapped water.',
      difficulty: 'hard',
      instruction: `# Trapping Rain Water (LeetCode 42)

Given \`n\` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

## Example

Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]  
Output: 6

Explanation: The elevation map can trap 6 units of water.

## Constraints

- \`1 <= height.length <= 2 * 10^4\`  
- \`0 <= height[i] <= 10^5\``,
      starterCode: `def trap(height):
    pass`,
      expectedOutput: `def trap(height):
    if not height:
        return 0
    n = len(height)
    left_max = [0] * n
    right_max = [0] * n
    left_max[0] = height[0]
    for i in range(1, n):
        left_max[i] = max(left_max[i - 1], height[i])
    right_max[n - 1] = height[n - 1]
    for i in range(n - 2, -1, -1):
        right_max[i] = max(right_max[i + 1], height[i])
    water = 0
    for i in range(n):
        water += max(0, min(left_max[i], right_max[i]) - height[i])
    return water`,
      hints: [
        { afterAttempt: 1, text: 'For each index, you need the max height to the left and to the right. Precompute them.' }
      ],
      solution: {
        afterAttempt: 3,
        text: `## Solution - O(n) time, O(n) space

\`\`\`python
def trap(height):
    if not height:
        return 0
    n = len(height)
    left_max = [0] * n
    right_max = [0] * n
    left_max[0] = height[0]
    for i in range(1, n):
        left_max[i] = max(left_max[i - 1], height[i])
    right_max[n - 1] = height[n - 1]
    for i in range(n - 2, -1, -1):
        right_max[i] = max(right_max[i + 1], height[i])
    water = 0
    for i in range(n):
        water += max(0, min(left_max[i], right_max[i]) - height[i])
    return water
\`\`\`

Prefix-style thinking: left_max and right_max are just prefix/suffix max arrays.`
      },
      testCases: [
        { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6' },
        { input: '[4,2,0,3,2,5]', expectedOutput: '9' }
      ],
      targetComplexity: { time: "O(n)", space: "O(n)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: false,
      solutionExplanation: `This problem shows how prefix/suffix ideas apply to max/min state, not just sums.`
  },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-best-time-to-buy-and-sell-stock',
      title: 'Code: Best Time to Buy and Sell Stock',
      description: 'Use a running prefix minimum to track the best buy price so far.',
      difficulty: 'easy',
      instruction: `# Best Time to Buy and Sell Stock (LeetCode 121)

You are given an array \`prices\` where \`prices[i]\` is the price of a stock on day \`i\`.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve. If you cannot achieve any profit, return 0.

## Examples

- prices = [7,1,5,3,6,4] → 5  
- prices = [7,6,4,3,1] → 0

## Constraints

- \`1 <= prices.length <= 10^5\`  
- \`0 <= prices[i] <= 10^4\``,
      starterCode: `def maxProfit(prices):
    pass`,
      expectedOutput: `def maxProfit(prices):
    min_price = float('inf')
    best = 0
    for price in prices:
        if price < min_price:
            min_price = price
        best = max(best, price - min_price)
    return best`,
      hints: [
        { afterAttempt: 1, text: 'Track the minimum price seen so far and the best profit you can get if you sell today.' }
      ],
      solution: {
        afterAttempt: 3,
        text: `## Solution - O(n) time, O(1) space

\`\`\`python
def maxProfit(prices):
    min_price = float('inf')
    best = 0
    for price in prices:
        if price < min_price:
            min_price = price
        best = max(best, price - min_price)
    return best
\`\`\`

Here the \"prefix\" is the best (minimum) price seen so far, not a sum.`
      },
      testCases: [
        { input: '[7,1,5,3,6,4]', expectedOutput: '5' },
        { input: '[7,6,4,3,1]', expectedOutput: '0' }
      ],
      targetComplexity: { time: "O(n)", space: "O(1)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: false,
      solutionExplanation: `This problem reinforces that prefix ideas can track \"best state so far\", not just totals.`
  },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-maximum-subarray',
      title: 'Code: Maximum Subarray',
      description: 'Implement Kadane’s algorithm as a conditional prefix sum.',
      difficulty: 'medium',
      instruction: `# Maximum Subarray (LeetCode 53)

Given an integer array \`nums\`, find the contiguous subarray (containing at least one number) with the largest sum and return its sum.

## Examples

- nums = [-2,1,-3,4,-1,2,1,-5,4] → 6 (subarray [4,-1,2,1])  
- nums = [1] → 1  
- nums = [5,4,-1,7,8] → 23

## Constraints

- \`1 <= nums.length <= 10^5\`  
- \`-10^4 <= nums[i] <= 10^4\``,
      starterCode: `def maxSubArray(nums):
    pass`,
      expectedOutput: `def maxSubArray(nums):
    current = nums[0]
    best = nums[0]
    for x in nums[1:]:
        current = max(x, current + x)
        best = max(best, current)
    return best`,
      hints: [
        { afterAttempt: 1, text: 'Maintain a running sum. If it ever drops below the current element, restart at the current element.' }
      ],
      solution: {
        afterAttempt: 3,
        text: `## Solution - O(n) time, O(1) space

\`\`\`python
def maxSubArray(nums):
    current = nums[0]
    best = nums[0]
    for x in nums[1:]:
        current = max(x, current + x)
        best = max(best, current)
    return best
\`\`\`

Kadane’s algorithm is a form of conditional prefix sum: you keep a running sum, but reset it when it becomes harmful (negative).`
      },
      testCases: [
        { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
        { input: '[1]', expectedOutput: '1' },
        { input: '[5,4,-1,7,8]', expectedOutput: '23' }
      ],
      targetComplexity: { time: "O(n)", space: "O(1)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: false,
      solutionExplanation: `This consolidates your intuition that many DP-like problems are just smarter versions of prefix accumulation.`
  },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-subarray-sum-equals-k',
      title: 'Combo (Hash Map): Subarray Sum Equals K',
      description: 'Count subarrays with a target sum using prefix sums + a frequency map.',
      difficulty: 'medium',
      instruction: `# Subarray Sum Equals K (Combo: Prefix Sum + Hash Map)

Given an integer array \`nums\` and an integer \`k\`, return the number of **contiguous subarrays** whose sum equals \`k\`.

This is a classic combo problem:
- Prefix sums (this module)
- Hash map / frequency counting (another core module)

## Example

Input: nums = [1, 1, 1], k = 2  
Output: 2

## Constraints

- \`1 <= nums.length <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\`
- \`-10^9 <= k <= 10^9\``,
      starterCode: `def subarraySum(nums, k):
    pass`,
      expectedOutput: `def subarraySum(nums, k):
    prefix = 0
    freq = {0: 1}  # prefix sum -> count
    count = 0
    for x in nums:
        prefix += x
        count += freq.get(prefix - k, 0)
        freq[prefix] = freq.get(prefix, 0) + 1
    return count`,
      hints: [
        { afterAttempt: 1, text: 'Let prefix[i] be sum(nums[0..i]). A subarray (j+1..i) sums to k if prefix[i] - prefix[j] = k.' },
        { afterAttempt: 2, text: 'Track how many times each prefix sum has occurred in a hash map.' }
      ],
      solution: {
        afterAttempt: 3,
        text: `## Solution - O(n) time, O(n) space

\`\`\`python
def subarraySum(nums, k):
    prefix = 0
    freq = {0: 1}
    count = 0
    for x in nums:
        prefix += x
        count += freq.get(prefix - k, 0)
        freq[prefix] = freq.get(prefix, 0) + 1
    return count
\`\`\`

The hash map turns “how many previous prefix sums equal prefix-k?” into O(1).`
      },
      testCases: [
        { input: '[1, 1, 1], 2', expectedOutput: '2' },
        { input: '[1, 2, 3], 3', expectedOutput: '2' },
        { input: '[1, -1, 0], 0', expectedOutput: '3' }
      ],
      targetComplexity: { time: "O(n)", space: "O(n)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: false,
      solutionExplanation: `Prefix sums give you the equation. The hash map lets you count matches fast. This is one of the most common prefix sum interview techniques.`
  },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-xor-queries-subarray',
      title: 'Combo (Bitwise): XOR Queries of a Subarray',
      description: 'Answer many XOR range queries using a prefix XOR array.',
      difficulty: 'medium',
      instruction: `# XOR Queries of a Subarray (Combo: Prefix + Bitwise XOR)

You are given an integer array \`arr\` and a list of queries \`queries\`, where each query is \`[L, R]\`.

Return an array where each element is the XOR of \`arr[L] ^ arr[L+1] ^ ... ^ arr[R]\`.

## Example

Input:
- arr = [1, 3, 4, 8]
- queries = [[0,1],[1,2],[0,3],[3,3]]

Output: [2, 7, 14, 8]

## Constraints

- \`1 <= arr.length <= 10^5\`
- \`0 <= arr[i] <= 10^9\`
- \`1 <= len(queries) <= 10^5\``,
      starterCode: `def xorQueries(arr, queries):
    pass`,
      expectedOutput: `def xorQueries(arr, queries):
    n = len(arr)
    px = [0] * (n + 1)
    for i, x in enumerate(arr):
        px[i + 1] = px[i] ^ x
    result = []
    for l, r in queries:
        result.append(px[r + 1] ^ px[l])
    return result`,
      hints: [
        { afterAttempt: 1, text: 'Use prefix XOR: px[i+1] = px[i] ^ arr[i].' },
        { afterAttempt: 2, text: 'Range XOR is px[r+1] ^ px[l] (because XOR cancels like subtraction for sums).' }
      ],
      solution: {
        afterAttempt: 3,
        text: `## Solution - O(n + q) time, O(n) space

\`\`\`python
def xorQueries(arr, queries):
    n = len(arr)
    px = [0] * (n + 1)
    for i, x in enumerate(arr):
        px[i + 1] = px[i] ^ x
    result = []
    for l, r in queries:
        result.append(px[r + 1] ^ px[l])
    return result
\`\`\`

Same structure as prefix sums — just replace + with XOR.`
      },
      testCases: [
        { input: '[1, 3, 4, 8], [[0,1],[1,2],[0,3],[3,3]]', expectedOutput: '[2, 7, 14, 8]' },
        { input: '[4, 8, 2, 10], [[2,3],[1,3],[0,0],[0,3]]', expectedOutput: '[8, 0, 4, 4]' }
      ],
      targetComplexity: { time: "O(n + q)", space: "O(n)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: false,
      solutionExplanation: `XOR has an “undo” property: a ^ b ^ b = a. That makes prefix XOR work exactly like prefix sums for range queries.`
  },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-shortest-subarray-at-least-k',
      title: 'Combo (Deque): Shortest Subarray with Sum at Least K',
      description: 'Hard combo: prefix sums + a monotonic deque to handle negatives.',
      difficulty: 'hard',
      instruction: `# Shortest Subarray with Sum at Least K (Hard Combo)

Given an integer array \`nums\` (can contain negative numbers) and an integer \`k\`, return the length of the **shortest non-empty subarray** with sum at least \`k\`.

If there is no such subarray, return \`-1\`.

This is a hard combo problem:
- Prefix sums
- Monotonic deque (data structures)

## Example

Input: nums = [2, -1, 2], k = 3  
Output: 3

## Constraints

- \`1 <= nums.length <= 10^5\`
- \`-10^5 <= nums[i] <= 10^5\`
- \`1 <= k <= 10^9\``,
      starterCode: `def shortestSubarrayAtLeastK(nums, k):
    pass`,
      expectedOutput: `from collections import deque

def shortestSubarrayAtLeastK(nums, k):
    n = len(nums)
    prefix = [0] * (n + 1)
    for i, x in enumerate(nums):
        prefix[i + 1] = prefix[i] + x

    ans = n + 1
    dq = deque()  # indices of prefix[], increasing by prefix value

    for i in range(n + 1):
        # Try to shrink from the left while we meet the sum condition
        while dq and prefix[i] - prefix[dq[0]] >= k:
            ans = min(ans, i - dq[0])
            dq.popleft()

        # Maintain increasing prefix sums in deque
        while dq and prefix[i] <= prefix[dq[-1]]:
            dq.pop()

        dq.append(i)

    return ans if ans <= n else -1`,
      hints: [
        { afterAttempt: 1, text: 'Use prefix sums so any subarray sum is prefix[r] - prefix[l].' },
        { afterAttempt: 2, text: 'Maintain a deque of candidate left indices with increasing prefix sums.' },
        { afterAttempt: 3, text: 'While prefix[i] - prefix[dq[0]] >= k, you can update the answer and pop from the front.' }
      ],
      solution: {
        afterAttempt: 4,
        text: `## Solution - O(n) time, O(n) space

\`\`\`python
from collections import deque

def shortestSubarrayAtLeastK(nums, k):
    n = len(nums)
    prefix = [0] * (n + 1)
    for i, x in enumerate(nums):
        prefix[i + 1] = prefix[i] + x

    ans = n + 1
    dq = deque()

    for i in range(n + 1):
        while dq and prefix[i] - prefix[dq[0]] >= k:
            ans = min(ans, i - dq[0])
            dq.popleft()
        while dq and prefix[i] <= prefix[dq[-1]]:
            dq.pop()
        dq.append(i)

    return ans if ans <= n else -1
\`\`\`

The deque keeps the best “left boundaries” to check in O(1) amortized time.`
      },
      testCases: [
        { input: '[1], 1', expectedOutput: '1' },
        { input: '[1, 2], 4', expectedOutput: '-1' },
        { input: '[2, -1, 2], 3', expectedOutput: '3' },
        { input: '[84, -37, 32, 40, 95], 167', expectedOutput: '3' }
      ],
      targetComplexity: { time: "O(n)", space: "O(n)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: false,
      solutionExplanation: `Negatives break sliding window. Prefix sums restore structure, and the monotonic deque lets you find the best left boundary for each right boundary efficiently.`
  }
];
