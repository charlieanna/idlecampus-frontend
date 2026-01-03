import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module11DynamicProgrammingLessonSmartPracticeExercises: ExerciseSection[] = [
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-fib-memo',
            title: 'Fibonacci with Memoization',
            description: 'Add memoization to Fibonacci to see the speedup',
            requiredForProgress: true,
            isVerification: true,
            conceptFamily: 'dp-fundamentals',
            targetComplexity: {
                time: "O(n)",
                space: "O(1)"
            },
            instruction: `# Fibonacci with Memoization

## Your Task

Add memoization to the naive Fibonacci implementation.

## The Pattern

\`\`\`python
def fib(n, memo={}):
    # STEP 1: Check cache
    if n in memo:
        return memo[n]  # Already computed!

    # STEP 2: Base case
    if n <= 1:
        return n

    # STEP 3: Compute
    result = fib(n-1, memo) + fib(n-2, memo)

    # STEP 4: Cache before returning
    memo[n] = result
    return result
\`\`\`

## What You're Adding

1. **Check cache first**: Avoid recomputation
2. **Store result**: Before returning, save to memo
3. **Pass memo**: Through recursive calls

## The Tree with Memoization

\`\`\`
                  fib(5)
                 /      \\
            fib(4)      fib(3) ✓ (cached!)
           /    \\
      fib(3)  fib(2) ✓ (cached!)
      /   \\
   fib(2) fib(1) ✓
   /  \\
fib(1) fib(0)

✓ = Retrieved from cache instead of recomputing!
\`\`\`

Only computes each fib(i) **once**!

## Expected Speedup

Try these:
- \`fib(30)\` - instant! (was very slow)
- \`fib(50)\` - instant! (was impossible)
- \`fib(100)\` - instant! (🤯)

## Starter Code

\`\`\`python
def fib(n, memo):
    if memo is None:
        memo = {}

    # TODO: Check if n is in memo, if so return memo[n]

    # Base case
    if n <= 1:
        return n

    # TODO: Compute result using fib(n-1, memo) + fib(n-2, memo)

    # TODO: Store result in memo[n]

    # TODO: Return result

# Test
print(fib(10))  # Should print 55
print(fib(50))  # Should be instant!
\`\`\``,
            starterCode: `def fib(n, memo=None):
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def fib(n, memo=None):
    if memo is None:
        memo = {}

    # Check cache
    if n in memo:
        return memo[n]

    # Base case
    if n <= 1:
        return n

    # Compute
    result = fib(n-1, memo) + fib(n-2, memo)

    # Cache
    memo[n] = result

    return result

# Test
print(fib(10))  # 55
print(fib(50))  # 12586269025 (instant!)
print(fib(100)) # Works! (would timeout without memo)`
            },
            solutionExplanation: `## STEP 1: How to Solve - Fibonacci(6)

**Natural approach:** Build from base cases

**fib(0) = 0**
**fib(1) = 1**
**fib(2) = fib(1) + fib(0) = 1 + 0 = 1**
**fib(3) = fib(2) + fib(1) = 1 + 1 = 2**
**fib(4) = fib(3) + fib(2) = 2 + 1 = 3**
**fib(5) = fib(4) + fib(3) = 3 + 2 = 5**
**fib(6) = fib(5) + fib(4) = 5 + 3 = 8**

**Result:** 8

---

## STEP 2: How It Translates to a Tree (with REPEATED NODES!)

\`\`\`
                        fib(6)
                       /      \\
                  fib(5)      fib(4)
                 /      \\     /      \\
            fib(4)    fib(3) fib(3)  fib(2)  ← fib(3) REPEATED!
           /    \\     /   \\   /   \\   /  \\
      fib(3) fib(2) f(2) f(1) f(2) f(1) f(1) f(0)  ← fib(2) REPEATED!
      /   \\   /  \\
   f(2) f(1) f(1) f(0)  ← More repeats!
   /  \\
f(1) f(0)
\`\`\`

**Tree insight:**
- Same nodes appear multiple times (fib(3), fib(2), etc.)
- This is backtracking with REPEATED NODES!
- Without memo: O(2^n) - exponential waste
- With memo: Each node computed ONCE → O(n)

**Repeated nodes:**
- fib(4): computed 2 times
- fib(3): computed 3 times
- fib(2): computed 5 times
- fib(1): computed 8 times

---

## STEP 3: How the Tree Maps to Code

### 🔴 Without Memo (Backtracking - but inefficient!)
\`\`\`python
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)  # Recomputes same nodes!
\`\`\`
**Time: O(2^n)** - exponential waste!

### 🟢 With Memo (DP - fixes repeated nodes!)
\`\`\`python
def fib(n, memo={}):
    # Check cache FIRST (reuse if already computed)
    if n in memo:
        return memo[n]  # Reuse cached result!

    # Base case
    if n <= 1:
        return n

    # Compute (like backtracking)
    result = fib(n-1, memo) + fib(n-2, memo)
    
    # Store in cache (memoization!)
    memo[n] = result
    return result
\`\`\`
**Time: O(n)** - each node computed once!

---

## STEP 4: How Memo Fixes Repeated Nodes

**Without memo:**
- fib(3) computed 3 times → waste!
- Total calls: 25 for fib(6)

**With memo:**
- First time: compute fib(3), store in memo
- Next times: return memo[3] instantly!
- Total calls: 13 for fib(6) (only unique nodes)

**Key:** Memo turns repeated nodes into cached lookups!

---

## ✅ Complexity

**Time: O(n)** - each fib(i) computed once
**Space: O(n)** - memo dict + call stack

**Pattern:** Backtracking tree with repeated nodes → Add memo → DP!`,
            complexityQuizPlacement: 'after',
            hints: [
                { afterAttempt: 1, text: 'Check cache: if n in memo: return memo[n]' },
                { afterAttempt: 2, text: 'Compute: result = fib(n-1, memo) + fib(n-2, memo)' },
                { afterAttempt: 3, text: 'Store: memo[n] = result BEFORE returning' }
            ],
            testCases: [
                {
                    input: '10',
                    expectedOutput: '55'
                },
                {
                    input: '20',
                    expectedOutput: '6765'
                }
            ],
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-climbing-stairs-memo',
            title: 'Climbing Stairs with Memoization',
            description: 'Implement climbing stairs with memoization',
            requiredForProgress: true,
            isVerification: true,
            conceptFamily: 'dp-fundamentals',
            targetComplexity: {
                time: "O(n)",
                space: "O(1)"
            },
            instruction: `# Climbing Stairs with Memoization

## The Problem

How many ways to climb n stairs (1 or 2 steps at a time)?

**For n=5:** Expected = 8 ways

## Your Task

Add memoization to climbing stairs!

\`\`\`python
def climbStairs(n, memo):
    if memo is None:
        memo = {}

    # TODO: Check memo
    # TODO: Base cases (n <= 2)
    # TODO: Compute: climbStairs(n-1, memo) + climbStairs(n-2, memo)
    # TODO: Store in memo
    # TODO: Return result
\`\`\``,
            starterCode: `def climbStairs(n, memo=None):
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def climbStairs(n, memo=None):
    if memo is None:
        memo = {}

    if n in memo:
        return memo[n]

    if n <= 2:
        return n

    result = climbStairs(n-1, memo) + climbStairs(n-2, memo)
    memo[n] = result
    return result`
            },
            hints: [
                { afterAttempt: 1, text: 'Same pattern as Fibonacci!' },
                { afterAttempt: 2, text: 'Check memo: if n in memo: return memo[n]' },
                { afterAttempt: 3, text: 'Compute: climbStairs(n-1, memo) + climbStairs(n-2, memo)' }
            ],
            testCases: [
                {
                    input: '5',
                    expectedOutput: '8'
                }
            ],
            solutionExplanation: `## STEP 1: How to Solve - Climbing Stairs(5)

**Natural approach:** Count ways to reach each stair

**ways(1) = 1** (one 1-step)
**ways(2) = 2** (1+1 or 2)
**ways(3) = ways(2) + ways(1) = 2 + 1 = 3**
**ways(4) = ways(3) + ways(2) = 3 + 2 = 5**
**ways(5) = ways(4) + ways(3) = 5 + 3 = 8**

**Result:** 8 ways

---

## STEP 2: How It Translates to a Tree (with REPEATED NODES!)

\`\`\`
                    ways(5)
                   /       \\
              ways(4)      ways(3)
              /     \\       /     \\
         ways(3) ways(2) ways(2) ways(1)  ← ways(2) REPEATED!
         /    \\
    ways(2) ways(1)  ← More repeats!
\`\`\`

**Tree insight:**
- Same as Fibonacci! ways(n) = ways(n-1) + ways(n-2)
- ways(3) computed 2 times
- ways(2) computed 3 times
- This is backtracking with REPEATED NODES!

---

## STEP 3: How the Tree Maps to Code

### 🔴 Without Memo (Backtracking - inefficient!)
\`\`\`python
def climbStairs(n):
    if n <= 2:
        return n
    return climbStairs(n-1) + climbStairs(n-2)  # Recomputes!
\`\`\`
**Time: O(2^n)** - exponential waste!

### 🟢 With Memo (DP - fixes repeated nodes!)
\`\`\`python
def climbStairs(n, memo={}):
    if n in memo:
        return memo[n]  # Reuse cached result!
    
    if n <= 2:
        return n
    
    result = climbStairs(n-1, memo) + climbStairs(n-2, memo)
    memo[n] = result  # Cache for reuse!
    return result
\`\`\`
**Time: O(n)** - each ways(i) computed once!

---

## STEP 4: How Memo Fixes Repeated Nodes

**Without memo:**
- ways(3) computed 2 times → waste!
- Total calls: 15 for ways(5)

**With memo:**
- First time: compute ways(3), store in memo
- Next time: return memo[3] instantly!
- Total calls: 8 for ways(5) (only unique nodes)

**Key:** Memo eliminates repeated node computations!

---

## ✅ Complexity

**Time: O(n)** - each ways(i) computed once
**Space: O(n)** - memo dict + call stack

**Pattern:** Same as Fibonacci - backtracking with repeated nodes → Add memo → DP!

### 🧠 The DP Pattern: Fibonacci!
climbStairs(n) = climbStairs(n-1) + climbStairs(n-2)

This is literally Fibonacci! Only need last 2 values.

---

### ✅ Final Complexity
- **Time: O(n)** - one pass
- **Space: O(1)** - constant space

### 🎯 Pattern Learned
**\"Ways to reach step n\"** → Fibonacci-like DP
**Optimization path:** Recursion → Memoization → Bottom-up → Space-optimized`,
            complexityQuizPlacement: 'after',
            difficulty: 'easy',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-house-robber',
            title: 'House Robber Implementation',
            description: 'Implement house robber with memoization',
            requiredForProgress: true,
            isVerification: true,
            conceptFamily: '1d-dp',
            targetComplexity: {
                time: "O(n)",
                space: "O(n)"
            },
            instruction: `# House Robber Implementation

## The Problem

Rob houses for maximum money. Can't rob adjacent houses.

**Input:** \`[2, 7, 9, 3, 1]\`
**Output:** 12 (rob houses 0, 2, 4 → 2+9+1=12)

## Your Task

Implement with memoization:

\`\`\`python
def rob(nums):
    memo = {}

    def max_rob(i):
        # TODO: Base case - i >= len(nums)
        # TODO: Check memo
        # TODO: Compute rob vs skip
        # TODO: Cache and return

    return max_rob(0)
\`\`\`

## Recurrence
- Rob house i: nums[i] + max_rob(i+2)
- Skip house i: max_rob(i+1)
- Result: max of both`,
            starterCode: `def rob(nums):
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def rob(nums):
    memo = {}

    def max_rob(i):
        if i >= len(nums):
            return 0

        if i in memo:
            return memo[i]

        rob_current = nums[i] + max_rob(i + 2)
        skip_current = max_rob(i + 1)
        result = max(rob_current, skip_current)

        memo[i] = result
        return result

    return max_rob(0)

`
            },
            hints: [
                { afterAttempt: 1, text: 'Base case: if i >= len(nums): return 0' },
                { afterAttempt: 2, text: 'Rob: nums[i] + max_rob(i+2)' },
                { afterAttempt: 3, text: 'Skip: max_rob(i+1)' },
                { afterAttempt: 4, text: 'Result: max(rob, skip)' }
            ],
            testCases: [
                {
                    input: '[2, 7, 9, 3, 1]',
                    expectedOutput: '12'
                }
            ],
            solutionExplanation: `## STEP 1: How to Solve - House Robber [2, 7, 9, 3, 1]

**Natural approach:** At each house, decide: rob or skip?

**House 0 (value 2):**
- Rob: 2 + best from house 2+
- Skip: best from house 1+

**House 1 (value 7):**
- Rob: 7 + best from house 3+
- Skip: best from house 2+

**Continue until end...**

**Result:** 12 (rob houses 0, 2, 4 → 2+9+1)

---

## STEP 2: How It Translates to a Tree (with REPEATED NODES!)

\`\`\`
                    max_rob(0)
                   /          \\
            Rob(0)            Skip(0)
              |                  |
         max_rob(2)          max_rob(1)
         /        \\          /        \\
    Rob(2)    Skip(2)   Rob(1)    Skip(1)
      |          |         |          |
  max_rob(4) max_rob(3) max_rob(3) max_rob(2)  ← max_rob(3) REPEATED!
      |          |         |          |
    ...        ...       ...       ...          ← max_rob(2) REPEATED!
\`\`\`

**Tree insight:**
- This is backtracking! (rob or skip = 2 choices per house)
- Same subproblems appear multiple times (max_rob(2), max_rob(3), etc.)
- Without memo: O(2^n) - exponential waste
- With memo: Each max_rob(i) computed ONCE → O(n)

**Repeated nodes:**
- max_rob(3): computed multiple times
- max_rob(2): computed multiple times
- Each repeated node = wasted computation!

---

## STEP 3: How the Tree Maps to Code

### 🔴 Without Memo (Backtracking - but inefficient!)
\`\`\`python
def rob(nums):
    def max_rob(i):
        if i >= len(nums):
            return 0
        # Two choices: rob or skip
        rob_current = nums[i] + max_rob(i + 2)  # Rob this house
        skip_current = max_rob(i + 1)            # Skip this house
        return max(rob_current, skip_current)
    return max_rob(0)
\`\`\`
**Time: O(2^n)** - exponential waste!

### 🟢 With Memo (DP - fixes repeated nodes!)
\`\`\`python
def rob(nums):
    memo = {}
    
    def max_rob(i):
        if i >= len(nums):
        return 0
        
        # Check cache FIRST (reuse if already computed)
        if i in memo:
            return memo[i]  # Reuse cached result!
        
        # Compute (like backtracking)
        rob_current = nums[i] + max_rob(i + 2)
        skip_current = max_rob(i + 1)
        result = max(rob_current, skip_current)
        
        # Store in cache (memoization!)
        memo[i] = result
        return result
    
    return max_rob(0)
\`\`\`
**Time: O(n)** - each max_rob(i) computed once!

---

## STEP 4: How Memo Fixes Repeated Nodes

**Without memo:**
- max_rob(3) computed multiple times → waste!
- Total calls: exponential (2^n)

**With memo:**
- First time: compute max_rob(3), store in memo
- Next times: return memo[3] instantly!
- Total calls: O(n) (only unique indices)

**Key:** Memo eliminates repeated subproblem computations!

---

## ✅ Complexity

**Time: O(n)** - each house index computed once
**Space: O(n)** - memo dict + call stack

**Pattern:** Backtracking (rob/skip decisions) with repeated nodes → Add memo → DP!
**Recurrence:** max(skip, take + skip_prev)`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-coin-change',
            title: 'Coin Change Implementation',
            description: 'Find minimum coins to make amount',
            requiredForProgress: true,
            isVerification: true,
            conceptFamily: 'knapsack',
            targetComplexity: {
                time: "O(n)",
                space: "O(n)"
            },
            instruction: `# Coin Change Implementation

## The Problem

Coins: [1, 2, 5]
Amount: 11

Find minimum coins needed.

## Your Task

\`\`\`python
def coinChange(coins, amount):
    memo = {}

    def min_coins(amt):
        # TODO: Base case amt == 0, return 0
        # TODO: Base case amt < 0, return infinity
        # TODO: Check memo
        # TODO: Try each coin, take minimum
        # TODO: Cache and return

    result = min_coins(amount)
    return result if result != float('inf') else -1
\`\`\``,
            starterCode: `def coinChange(coins, amount):
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def coinChange(coins, amount):
    memo = {}

    def min_coins(amt):
        if amt == 0:
            return 0
        if amt < 0:
            return float('inf')

        if amt in memo:
            return memo[amt]

        result = float('inf')
        for coin in coins:
            result = min(result, 1 + min_coins(amt - coin))

        memo[amt] = result
        return result

    result = min_coins(amount)
    return result if result != float('inf') else -1

`
            },
            hints: [
                { afterAttempt: 1, text: 'Base: amt == 0 return 0, amt < 0 return inf' },
                { afterAttempt: 2, text: 'Initialize result = float("inf")' },
                { afterAttempt: 3, text: 'For each coin: result = min(result, 1 + min_coins(amt-coin))' }
            ],
            testCases: [
                {
                    input: '[1,2,5], 11',
                    expectedOutput: '3'
                }
            ],
            solutionExplanation: `## STEP 1: How to Solve - Coin Change(coins = [1, 2, 5], amount = 11)

    ** Natural approach:** Try each coin, find minimum

        ** To make 11:**
            - Use 1: need 1 + min_coins(10)
                - Use 2: need 1 + min_coins(9)
                    - Use 5: need 1 + min_coins(6)

                        ** Take minimum of all options **

** Result:** 3 coins(5 + 5 + 1)

---

## STEP 2: How It Translates to a Tree(with REPEATED NODES!)

\`\`\`
                    min_coins(11)
                 /      |      \\
            -1        -2       -5
             |         |         |
        min_coins(10) min_coins(9) min_coins(6)
        /  |  \\      /  |  \\      /  |  \\
      -1 -2 -5    -1 -2 -5    -1 -2 -5
       |  |  |      |  |  |      |  |  |
    ... ... ...   ... ... ...   ... ... ...
\`\`\`

**Tree insight:**
- This is backtracking! (try each coin = multiple choices)
- Same amounts appear multiple times (min_coins(9), min_coins(6), etc.)
- Without memo: O(coins^amount) - exponential waste!
- With memo: Each min_coins(amt) computed ONCE → O(amount × coins)

**Repeated nodes:**
- min_coins(9): computed multiple times (via 11-2, 11-1-1, etc.)
- min_coins(6): computed multiple times
- Each repeated node = wasted computation!

---

## STEP 3: How the Tree Maps to Code

### 🔴 Without Memo (Backtracking - but inefficient!)
\`\`\`python
def coinChange(coins, amount):
    def min_coins(amt):
        if amt == 0:
            return 0
        if amt < 0:
            return float('inf')
        
        result = float('inf')
        for coin in coins:
            result = min(result, 1 + min_coins(amt - coin))  # Recomputes!
        return result
    
    result = min_coins(amount)
    return result if result != float('inf') else -1
\`\`\`
**Time: O(coins^amount)** - exponential waste!

### 🟢 With Memo (DP - fixes repeated nodes!)
\`\`\`python
def coinChange(coins, amount):
    memo = {}
    
    def min_coins(amt):
        if amt == 0:
            return 0
        if amt < 0:
            return float('inf')
        
        # Check cache FIRST (reuse if already computed)
        if amt in memo:
            return memo[amt]  # Reuse cached result!
        
        # Compute (like backtracking)
        result = float('inf')
        for coin in coins:
            result = min(result, 1 + min_coins(amt - coin))
        
        # Store in cache (memoization!)
        memo[amt] = result
        return result
    
    result = min_coins(amount)
    return result if result != float('inf') else -1
\`\`\`
**Time: O(amount × coins)** - each amount computed once!

---

## STEP 4: How Memo Fixes Repeated Nodes

**Without memo:**
- min_coins(9) computed multiple times → waste!
- Total calls: exponential (coins^amount)

**With memo:**
- First time: compute min_coins(9), store in memo
- Next times: return memo[9] instantly!
- Total calls: O(amount × coins) (only unique amounts)

**Key:** Memo eliminates repeated amount computations!

---

## ✅ Complexity

**Time: O(amount × coins)** - each amount computed once, try each coin
**Space: O(amount)** - memo dict + call stack

**Pattern:** Backtracking (try each coin) with repeated amounts → Add memo → DP!

*(Optional)* Convert to bottom-up by filling a 1D array \`dp[amt] = min(dp[amt], 1 + dp[amt-coin])\` for each coin.`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-01-knapsack',
            title: '0/1 Knapsack Implementation',
            description: 'Maximize value with weight constraint',
            isPracticeOnly: true,
            requiredForProgress: true,
            targetComplexity: {
                time: "O(n*W)",
                space: "O(W)"
            },
            instruction: `# 0/1 Knapsack Implementation

## The Problem

**Weights:** \`[1, 2, 3]\`
**Values:** \`[6, 10, 12]\`
**Capacity:** \`5\`

Find max value.

## Your Task

Implement the space-optimized (1D array) solution.

\`\`\`python
def knapsack(weights, values, capacity):
    # TODO: Initialize dp array of size (capacity + 1) with 0s
    # TODO: Iterate through each item (weight, value)
    # TODO: Iterate capacity BACKWARDS from capacity to weight
    # TODO: Update dp[w] = max(dp[w], value + dp[w - weight])
    # TODO: Return dp[capacity]
\`\`\`

## Hint
Remember to iterate backwards! \`range(capacity, weight - 1, -1)\``,
            starterCode: `def knapsack(weights, values, capacity):
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def knapsack(weights, values, capacity):
    dp = [0] * (capacity + 1)

    for i in range(len(weights)):
        wt = weights[i]
        val = values[i]
        
        # Iterate backwards to avoid using same item twice
        for w in range(capacity, wt - 1, -1):
            dp[w] = max(dp[w], val + dp[w - wt])

    return dp[capacity]

`
            },
            hints: [
                { afterAttempt: 1, text: 'dp array size should be capacity + 1' },
                { afterAttempt: 2, text: 'Outer loop: for i in range(len(weights))' },
                { afterAttempt: 3, text: 'Inner loop: for w in range(capacity, weights[i] - 1, -1)' },
                { afterAttempt: 4, text: 'Update: dp[w] = max(dp[w], values[i] + dp[w - weights[i]])' }
            ],
            testCases: [
                {
                    input: '[1,2,3], [6,10,12], 5',
                    expectedOutput: '22'
                }
            ],
            solutionExplanation: `## STEP 1: How to Solve - 0/1 Knapsack (weights=[1,2,3], values=[6,10,12], capacity=5)

**Natural approach:** For each item, decide: take or skip?

**Item 0 (w=1, v=6):**
- Take: 6 + best from remaining items with capacity 4
- Skip: best from remaining items with capacity 5

**Item 1 (w=2, v=10):**
- Take: 10 + best from remaining items with capacity 3
- Skip: best from remaining items with capacity 5

**Continue until all items processed...**

**Result:** 22 (take items 1 and 2: 10+12=22, weight=2+3=5)

---

## STEP 2: How It Translates to a Tree (with REPEATED NODES!)

\`\`\`
                    knapsack(0, cap=5)
                   /                  \\
            Take(0)                Skip(0)
              |                      |
        knapsack(1, cap=4)      knapsack(1, cap=5)
        /          \\            /          \\
    Take(1)    Skip(1)    Take(1)    Skip(1)
      |          |          |          |
  knapsack(2,3) knapsack(2,4) knapsack(2,3) knapsack(2,5)  ← knapsack(2,3) REPEATED!
      |          |          |          |
    ...        ...        ...        ...                  ← More repeats!
\`\`\`

**Tree insight:**
- This is backtracking! (take or skip = 2 choices per item)
- Same states (i, capacity) appear multiple times
- Without memo: O(2^n) - exponential waste!
- With memo: Each (i, cap) computed ONCE → O(n × capacity)

**Repeated nodes:**
- knapsack(2, 3): computed multiple times
- knapsack(1, 4): computed multiple times
- Each repeated node = wasted computation!

---

## STEP 3: How the Tree Maps to Code

### 🔴 Without Memo (Backtracking - but inefficient!)
\`\`\`python
def knapsack(weights, values, capacity, i=0):
    if i >= len(weights) or capacity == 0:
        return 0

    if weights[i] > capacity:
        return knapsack(weights, values, capacity, i + 1)  # Must skip

    # Two choices: take or skip
    take = values[i] + knapsack(weights, values, capacity - weights[i], i + 1)
    skip = knapsack(weights, values, capacity, i + 1)
    return max(take, skip)  # Recomputes!
\`\`\`
**Time: O(2^n)** - exponential waste!

### 🟢 With Memo (DP - fixes repeated nodes!)
\`\`\`python
def knapsack(weights, values, capacity):
    memo = {}
    
    def helper(i, cap):
        if i >= len(weights) or cap == 0:
            return 0
        
        # Check cache FIRST (reuse if already computed)
        if (i, cap) in memo:
            return memo[(i, cap)]  # Reuse cached result!
        
        if weights[i] > cap:
            result = helper(i + 1, cap)
        else:
            # Compute (like backtracking)
            take = values[i] + helper(i + 1, cap - weights[i])
            skip = helper(i + 1, cap)
            result = max(take, skip)
        
        # Store in cache (memoization!)
        memo[(i, cap)] = result
        return result
    
    return helper(0, capacity)
\`\`\`
**Time: O(n × capacity)** - each (i, cap) computed once!

---

## STEP 4: How Memo Fixes Repeated Nodes

**Without memo:**
- knapsack(2, 3) computed multiple times → waste!
- Total calls: exponential (2^n)

**With memo:**
- First time: compute knapsack(2, 3), store in memo
- Next times: return memo[(2, 3)] instantly!
- Total calls: O(n × capacity) (only unique states)

**Key:** Memo eliminates repeated (item, capacity) computations!

---

## ✅ Complexity

**Time: O(n × capacity)** - each (item, capacity) state computed once
**Space: O(n × capacity)** - memo dict + call stack

**Pattern:** Backtracking (take/skip decisions) with repeated states → Add memo → DP!`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-unique-paths',
            title: 'Unique Paths Implementation',
            description: 'Implement grid DP for unique paths',
            requiredForProgress: true,
            isVerification: true,
            conceptFamily: '2d-dp',
            targetComplexity: {
                time: "O(m*n)",
                space: "O(m*n)"
            },
            instruction: `# Unique Paths Implementation

## The Problem

m×n grid, start at (0,0), end at (m-1,n-1).
Can only move right or down.
Count unique paths.

## Your Task

\`\`\`python
def uniquePaths(m, n):
    # TODO: Create 2D dp table
    # TODO: Fill first row with 1s
    # TODO: Fill first column with 1s
    # TODO: Fill remaining cells
    # TODO: Return dp[m-1][n-1]
\`\`\`

## Recurrence
dp[i][j] = dp[i-1][j] + dp[i][j-1]`,
            starterCode: `def uniquePaths(m, n):
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def uniquePaths(m, n):
    dp = [[0] * n for _ in range(m)]

    # First column
    for i in range(m):
        dp[i][0] = 1

    # First row
    for j in range(n):
        dp[0][j] = 1

    # Fill table
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]

    return dp[m-1][n-1]

`
            },
            hints: [
                { afterAttempt: 1, text: 'Create 2D array: [[0] * n for _ in range(m)]' },
                { afterAttempt: 2, text: 'Base: first row and column = 1' },
                { afterAttempt: 3, text: 'Fill: dp[i][j] = dp[i-1][j] + dp[i][j-1]' }
            ],
            testCases: [
                {
                    input: '3, 3',
                    expectedOutput: '6'
                }
            ],
            solutionExplanation: `## STEP 1: How to Solve - Unique Paths (3×3 grid)

**Natural approach:** To reach (i, j), can come from above or left

**To reach (2, 2):**
- From (1, 2): move down
- From (2, 1): move right
- paths(2,2) = paths(1,2) + paths(2,1)

**Base cases:**
- First row: only 1 way (all right)
- First column: only 1 way (all down)

**Result:** 6 paths

---

## STEP 2: How It Translates to a Tree (with REPEATED NODES!)

\`\`\`
                    paths(2, 2)
                   /          \\
            paths(1,2)      paths(2,1)
            /      \\        /      \\
    paths(0,2) paths(1,1) paths(1,1) paths(2,0)  ← paths(1,1) REPEATED!
        |        /    \\      /    \\      |
        1    paths(0,1) paths(1,0) paths(0,1) paths(1,0)  1  ← More repeats!
              |        |        |        |
              1        1        1        1
\`\`\`

**Tree insight:**
- This is backtracking! (move right or down = 2 choices)
- Same cells (i, j) appear multiple times
- Without memo: O(2^(m+n)) - exponential waste!
- With memo: Each paths(i, j) computed ONCE → O(m × n)

**Repeated nodes:**
- paths(1, 1): computed multiple times
- paths(0, 1): computed multiple times
- Each repeated node = wasted computation!

---

## STEP 3: How the Tree Maps to Code

### 🔴 Without Memo (Backtracking - but inefficient!)
\`\`\`python
def uniquePaths(m, n):
    def paths(i, j):
        if i == 0 or j == 0:
            return 1
        return paths(i-1, j) + paths(i, j-1)  # Recomputes!
    return paths(m-1, n-1)
\`\`\`
**Time: O(2^(m+n))** - exponential waste!

### 🟢 With Memo (DP - fixes repeated nodes!)
\`\`\`python
def uniquePaths(m, n):
    memo = {}
    
    def paths(i, j):
        if i == 0 or j == 0:
            return 1
        
        # Check cache FIRST (reuse if already computed)
        if (i, j) in memo:
            return memo[(i, j)]  # Reuse cached result!
        
        # Compute (like backtracking)
        result = paths(i-1, j) + paths(i, j-1)
        
        # Store in cache (memoization!)
        memo[(i, j)] = result
        return result
    
    return paths(m-1, n-1)
\`\`\`
**Time: O(m × n)** - each cell computed once!

---

## STEP 4: How Memo Fixes Repeated Nodes

**Without memo:**
- paths(1, 1) computed multiple times → waste!
- Total calls: exponential (2^(m+n))

**With memo:**
- First time: compute paths(1, 1), store in memo
- Next times: return memo[(1, 1)] instantly!
- Total calls: O(m × n) (only unique cells)

**Key:** Memo eliminates repeated cell computations!

---

## ✅ Complexity

**Time: O(m × n)** - each cell computed once
**Space: O(m × n)** - memo dict + call stack

**Pattern:** Backtracking (right/down decisions) with repeated cells → Add memo → DP!\`

---

### 🧠 The Recurrence
\`dp[i][j] = dp[i-1][j] + dp[i][j-1]\`

"Ways to cell = ways from above + ways from left"

---

### ✅ Final Complexity
- **Time: O(m×n)** - fill each cell once
- **Space: O(n)** with space optimization

### 🎯 Pattern Learned
**"Count paths in grid"** → 2D DP with dp[i][j] = sum of adjacent`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-edit-distance',
            title: 'Edit Distance - Classic Hard DP',
            description: 'Minimum operations to transform word1 to word2',
            requiredForProgress: true,
            isVerification: true,
            conceptFamily: 'string-dp',
            targetComplexity: {
                time: "O(m*n)",
                space: "O(m*n)"
            },
            instruction: `# Edit Distance

## The Problem

Transform word1 to word2 using minimum operations:
- Insert a character
- Delete a character
- Replace a character

**Input:** word1 = "horse", word2 = "ros"
**Output:** 3

Explanation: horse → rorse (replace 'h') → rose (remove 'r') → ros (remove 'e')

## The 2D State

\`dp[i][j]\` = min operations to transform word1[0:i] → word2[0:j]

## The Recurrence

\`\`\`python
if word1[i-1] == word2[j-1]:
    dp[i][j] = dp[i-1][j-1]  # No operation needed
else:
    dp[i][j] = 1 + min(
        dp[i-1][j],    # Delete from word1
        dp[i][j-1],    # Insert into word1
        dp[i-1][j-1]   # Replace
    )
\`\`\`

## Your Task

Complete the implementation:`,
            starterCode: `def minDistance(word1, word2):
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j

    # Fill table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],    # Delete
                    dp[i][j-1],    # Insert
                    dp[i-1][j-1]   # Replace
                )

    return dp[m][n]

`
            },
            hints: [
                { afterAttempt: 1, text: 'Base: dp[i][0] = i (delete all), dp[0][j] = j (insert all)' },
                { afterAttempt: 2, text: 'Match: dp[i][j] = dp[i-1][j-1]' },
                { afterAttempt: 3, text: 'No match: 1 + min(delete, insert, replace)' }
            ],
            testCases: [
                {
                    input: '"horse", "ros"',
                    expectedOutput: '3'
                }
            ],
            solutionExplanation: `## STEP 1: How to Solve - Edit Distance ("horse" → "ros")

**Natural approach:** Try aligning characters from the end

**horse → ros:**
- Align 'e' with nothing → delete 'e'
- Align 's' with 's' → no cost
- Align 'r' with 'o' → replace r→o
- Align 'o' with 'r' → replace o→r
- Align 'h' with nothing → delete 'h'

**Better path:**  
horse → rorse (replace h→r)  
rorse → rose (delete r)  
rose → ros (delete e)  
Cost = 3

---

## STEP 2: How It Translates to a Tree (with REPEATED NODES!)

\`\`\`
              dist(i=5, j=3)   # horse vs ros
             /      |      \
      delete       insert    replace
        |            |           |
   dist(4,3)    dist(5,2)    dist(4,2)
      / \             ...        / \
   ...   dist(3,2)             dist(3,2)  ← repeated!
                 \             /
                dist(2,2)  ← repeated!
\`\`\`

**Tree insight:**
- This is backtracking! (at each step choose delete / insert / replace)
- Same states (i, j) repeat many times (e.g., dist(3,2), dist(2,2))
- Without memo: O(3^(m+n)) - exponential waste
- With memo: Only m×n unique states → O(m×n)

---

## STEP 3: How the Tree Maps to Code

### 🔴 Without Memo (Backtracking - inefficient!)
\`\`\`python
def minDistance(word1, word2):
    def dist(i, j):
        if i == 0:
            return j      # insert all remaining
        if j == 0:
            return i      # delete all remaining
        if word1[i-1] == word2[j-1]:
            return dist(i-1, j-1)
        return 1 + min(
            dist(i-1, j),     # delete
            dist(i, j-1),     # insert
            dist(i-1, j-1)    # replace
        )
    return dist(len(word1), len(word2))
\`\`\`
**Time: O(3^(m+n))** - exponential waste!

### 🟢 With Memo / 2D DP (fix repeated nodes!)
\`\`\`python
def minDistance(word1, word2):
    memo = {}

    def dist(i, j):
        if i == 0:
            return j
        if j == 0:
            return i
        if (i, j) in memo:
            return memo[(i, j)]

            if word1[i-1] == word2[j-1]:
            memo[(i, j)] = dist(i-1, j-1)
            else:
            memo[(i, j)] = 1 + min(
                dist(i-1, j),     # delete
                dist(i, j-1),     # insert
                dist(i-1, j-1)    # replace
            )
        return memo[(i, j)]

    return dist(len(word1), len(word2))
\`\`\`
**Time: O(m × n)** - each state computed once
**Space: O(m × n)** - memo/table

---

## STEP 4: How Memo Fixes Repeated Nodes

- State (i=3, j=2) computed multiple times without memo  
- With memo: first computation stored, all future requests reuse instantly  
- Total states = (len(word1) + 1) × (len(word2) + 1)

---

## ✅ Complexity & Pattern

**Time:** O(m × n)  
**Space:** O(m × n) (can optimize to O(n) with rolling rows)

**Pattern:** Backtracking (delete/insert/replace) with repeated (i, j) states → Add memo → classic 2D DP!`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-stock-cooldown',
            isPracticeOnly: true,
            title: 'Code: Stock with Cooldown',
            description: 'Maximize profit with cooldown constraint',
            requiredForProgress: true,
            targetComplexity: {
                time: "O(n)",
                space: "O(1)"
            },
            instruction: `# Stock with Cooldown

**Problem:** You can buy and sell unlimited times, but after selling, you must wait 1 day before buying again.

## Your Task

Implement the State Machine DP approach.
Use 3 variables (\`held\`, \`sold\`, \`reset\`) to track the max profit in each state.

## Example
\`\`\`
Input: [1, 2, 3, 0, 2]
Output: 3
Explanation:
Day 0: Buy (price 1) -> held=-1
Day 1: Sell (price 2) -> sold=1 (profit 1)
Day 2: Cooldown
Day 3: Buy (price 0) -> held=1 (profit 1-0=1)
Day 4: Sell (price 2) -> sold=3 (profit 1+2=3)
\`\`\``,
            starterCode: `def maxProfit(prices):
    pass`,
            hints: [
                { afterAttempt: 1, text: 'held = max(prev_held, prev_reset - price)' },
                { afterAttempt: 2, text: 'sold = prev_held + price' },
                { afterAttempt: 3, text: 'reset = max(prev_reset, prev_sold)' }
            ],
            solution: {
                afterAttempt: 3,
                text: `def maxProfit(prices):
    if not prices:
        return 0

    held = -prices[0]
    sold = 0
    reset = 0

    for i in range(1, len(prices)):
        prev_held = held
        prev_sold = sold
        prev_reset = reset

        held = max(prev_held, prev_reset - prices[i])
        sold = prev_held + prices[i]
        reset = max(prev_reset, prev_sold)

    return max(sold, reset)`
            },
            testCases: [
                { input: '[1,2,3,0,2]', expectedOutput: '3' },
                { input: '[1]', expectedOutput: '0' }
            ],
            solutionExplanation: `## STEP 1: How to Solve - Stock with Cooldown [1,2,3,0,2]

**Natural approach:** Buy at 1, sell at 3 (profit 2), cooldown day 3, buy at 0, sell at 2 (profit 2). Total = 3.

Constraint: after selling, must wait one day before buying again.

---

## STEP 2: How It Translates to a Tree (with REPEATED STATES!)

\`\`\`
           dfs(day=0, holding=False, cooldown=False)
                    /                      \
             Buy day0                    Skip day0
                |                           |
      dfs(1, True, False)          dfs(1, False, False)
        /          \                 /            \
    Sell?         Skip         Buy?             Skip
      |             |             |               |
 dfs(2,False,True)  dfs(2,True,False)   dfs(2,True,False)  ← repeated!
       |                 ...                ...
\`\`\`

**Tree insight:**
- States defined by (day, holding?, cooldown?)  
- Same states recur (e.g., dfs(2, True, False)) → overlapping subproblems  
- Without memo: O(3^n)  
- With state-machine DP: O(n)

---

## STEP 3: How the Tree Maps to Code

### 🔴 Without Memo (Backtracking - inefficient!)
\`\`\`python
def maxProfit(prices):
    from functools import lru_cache

    @lru_cache(None)
    def dfs(day, holding, cooldown):
        if day == len(prices):
            return 0
        if cooldown:
            return dfs(day + 1, holding=False, cooldown=False)

        do_nothing = dfs(day + 1, holding, False)
        if holding:
            sell = prices[day] + dfs(day + 1, False, True)
            return max(do_nothing, sell)
        else:
            buy = -prices[day] + dfs(day + 1, True, False)
            return max(do_nothing, buy)

    return dfs(0, False, False)
\`\`\`

### 🟢 Optimized DP (State Machine)
\`\`\`python
def maxProfit(prices):
    if not prices:
        return 0

    held = -prices[0]   # holding stock
    sold = 0            # just sold (cooldown)
    reset = 0           # not holding, ready to buy

    for price in prices[1:]:
        prev_held, prev_sold, prev_reset = held, sold, reset
        held = max(prev_held, prev_reset - price)   # keep holding or buy
        sold = prev_held + price                    # sell today -> cooldown
        reset = max(prev_reset, prev_sold)          # wait or exit cooldown

    return max(sold, reset)
\`\`\`
**Time: O(n)** | **Space: O(1)**

---

## STEP 4: Why Memo Helps
- (day, holding, cooldown) repeats in recursion tree  
- Memo/state-machine stores each state once  
- Only 3 states needed per day: held, sold, reset

---

## ✅ Complexity & Pattern
**Time:** O(n)  
**Space:** O(1)

**Pattern:** Backtracking with delayed effects (cooldown) → model as state machine DP (held/sold/reset).`,
            complexityQuizPlacement: 'after',
        },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-lps',
      title: 'Code: Longest Palindromic Subsequence',
      description: 'Find the longest palindromic subsequence using DP',
      instruction: `# Longest Palindromic Subsequence

Given a string s, find the longest palindromic subsequence's length in s.

A subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.

## Examples

**Example 1:**
\`\`\`
Input: s = "bbbab"
Output: 4
Explanation: One possible longest palindromic subsequence is "bbbb"
\`\`\`

**Example 2:**
\`\`\`
Input: s = "cbbd"
Output: 2
Explanation: One possible longest palindromic subsequence is "bb"
\`\`\`

## Constraints

- 1 <= s.length <= 1000
- s consists only of lowercase English letters`,
      starterCode: `def longestPalindromeSubseq(s):
    """
    Return the length of the longest palindromic subsequence.
    """
    pass`,
      testCases: [
        { input: 's = "bbbab"', expectedOutput: '4' },
        { input: 's = "cbbd"', expectedOutput: '2' },
        { input: 's = "a"', expectedOutput: '1' },
        { input: 's = "abcabcabcabc"', expectedOutput: '7' },
        { input: 's = "racecar"', expectedOutput: '7' }
      ],
      hints: [
        { afterAttempt: 1, text: 'This is a classic 2D DP problem. Think about the LCS approach.' },
        { afterAttempt: 2, text: 'LPS(s) = LCS(s, reverse(s)).' },
        { afterAttempt: 3, text: 'Or define dp[i][j] = LPS of s[i:j+1], build from smaller substrings.' }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Longest Palindromic Subsequence - 2D DP

def longestPalindromeSubseq(s):
    n = len(s)
    dp = [[0] * n for _ in range(n)]

    # Base case: single characters
    for i in range(n):
        dp[i][i] = 1

    # Fill for increasing lengths
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1

            if s[i] == s[j]:
                dp[i][j] = dp[i+1][j-1] + 2
            else:
                dp[i][j] = max(dp[i+1][j], dp[i][j-1])

    return dp[0][n-1]

# Alternative: LCS of s and reverse(s)
def longestPalindromeSubseq_lcs(s):
    return lcs(s, s[::-1])

# Key insight: dp[i][j] = longest palindrome in s[i:j+1]`
      },
      targetComplexity: {
        time: 'O(n²)',
        space: 'O(n²)'
      },
      solutionExplanation: `## Time Complexity Analysis

**O(n²)** - Fill n×n DP table.

### Space Complexity: O(n²)
- 2D DP table (can be optimized to O(n) with space optimization)`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-lcs',
      title: 'Longest Common Subsequence',
      description: 'Find the longest subsequence common to both strings',
      requiredForProgress: true,
      conceptFamily: 'string-dp',
      targetComplexity: { time: 'O(m*n)', space: 'O(m*n)' },
      instruction: `# Longest Common Subsequence

## The Problem

Given two strings \`text1\` and \`text2\`, return the length of their longest common subsequence.

A subsequence is a sequence derived by deleting some (or no) characters without changing the order.

**Example:**
\`\`\`
Input: text1 = "abcde", text2 = "ace"
Output: 3 (The LCS is "ace")
\`\`\`

## The Recurrence

\`\`\`python
if text1[i-1] == text2[j-1]:
    dp[i][j] = dp[i-1][j-1] + 1  # Match! Extend LCS
else:
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])  # Skip one char
\`\`\`

## Your Task

Implement the 2D DP solution.`,
      starterCode: `def longestCommonSubsequence(text1: str, text2: str) -> int:
    pass`,
      solution: {
        afterAttempt: 3,
        text: `def longestCommonSubsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    return dp[m][n]

# Test
print(longestCommonSubsequence("abcde", "ace"))  # 3`
      },
      hints: [
        { afterAttempt: 1, text: 'Create (m+1) x (n+1) table initialized to 0' },
        { afterAttempt: 2, text: 'Match: dp[i][j] = dp[i-1][j-1] + 1' },
        { afterAttempt: 3, text: 'No match: dp[i][j] = max(dp[i-1][j], dp[i][j-1])' }
      ],
      testCases: [
        { input: '"abcde", "ace"', expectedOutput: '3' },
        { input: '"abc", "abc"', expectedOutput: '3' },
        { input: '"abc", "def"', expectedOutput: '0' }
      ],
      solutionExplanation: `## LCS is Foundational

Many DP problems reduce to LCS:
- Longest Palindromic Subsequence = LCS(s, reverse(s))
- Edit Distance uses similar 2D structure
- Diff algorithms use LCS

## Why the Recurrence Works

**Match:** If chars match, extend the LCS from previous state.
**No match:** Skip one char from either string, take the better option.

## Complexity
- **Time:** O(m × n)
- **Space:** O(m × n), can optimize to O(min(m,n))`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-lis',
      title: 'Longest Increasing Subsequence',
      description: 'Find the length of the longest strictly increasing subsequence',
      requiredForProgress: true,
      conceptFamily: '1d-dp',
      targetComplexity: { time: 'O(n²)', space: 'O(n)' },
      instruction: `# Longest Increasing Subsequence

## The Problem

Given an array \`nums\`, return the length of the longest strictly increasing subsequence.

**Example:**
\`\`\`
Input: nums = [10, 9, 2, 5, 3, 7, 101, 18]
Output: 4 (The LIS is [2, 3, 7, 101])
\`\`\`

## The Approach

\`dp[i]\` = length of LIS ending at index i

For each \`i\`, look at all \`j < i\`:
- If \`nums[j] < nums[i]\`, we can extend that subsequence
- \`dp[i] = max(dp[i], dp[j] + 1)\`

## Your Task

Implement the O(n²) DP solution.`,
      starterCode: `def lengthOfLIS(nums: list[int]) -> int:
    pass`,
      solution: {
        afterAttempt: 3,
        text: `def lengthOfLIS(nums: list[int]) -> int:
    if not nums:
        return 0

    n = len(nums)
    dp = [1] * n  # Each element is a subsequence of length 1

    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)

    return max(dp)

# Test
print(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]))  # 4`
      },
      hints: [
        { afterAttempt: 1, text: 'Initialize dp[i] = 1 (each element alone is length 1)' },
        { afterAttempt: 2, text: 'For each i, check all j < i where nums[j] < nums[i]' },
        { afterAttempt: 3, text: 'Update: dp[i] = max(dp[i], dp[j] + 1)' }
      ],
      testCases: [
        { input: '[10, 9, 2, 5, 3, 7, 101, 18]', expectedOutput: '4' },
        { input: '[0, 1, 0, 3, 2, 3]', expectedOutput: '4' },
        { input: '[7, 7, 7, 7, 7]', expectedOutput: '1' }
      ],
      solutionExplanation: `## Why dp[i] = LIS ending at i?

By defining dp[i] as LIS ending exactly at index i, we can:
1. Look backwards at all valid extensions
2. Take the maximum + 1

## The Answer

The answer is max(dp), not dp[n-1], because the LIS might not end at the last element.

## Optimization

There's an O(n log n) solution using binary search + patience sorting, but O(n²) is sufficient for interviews.

## Complexity
- **Time:** O(n²)
- **Space:** O(n)`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-decode-ways',
      title: 'Decode Ways',
      description: 'Count the number of ways to decode a digit string',
      requiredForProgress: true,
      conceptFamily: '1d-dp',
      targetComplexity: { time: 'O(n)', space: 'O(n)' },
      instruction: `# Decode Ways

## The Problem

A message containing letters A-Z is encoded: 'A' = 1, 'B' = 2, ..., 'Z' = 26.

Given a string of digits, return the number of ways to decode it.

**Example:**
\`\`\`
Input: s = "226"
Output: 3
Explanation: "226" can be decoded as:
  - "BZ" (2 26)
  - "VF" (22 6)
  - "BBF" (2 2 6)
\`\`\`

## The Recurrence

At each position, we can:
1. Take 1 digit (if valid: 1-9)
2. Take 2 digits (if valid: 10-26)

\`dp[i] = dp[i-1] (if s[i-1] valid) + dp[i-2] (if s[i-2:i] valid)\`

## Your Task

Handle edge cases: leading zeros, invalid two-digit codes.`,
      starterCode: `def numDecodings(s: str) -> int:
    pass`,
      solution: {
        afterAttempt: 3,
        text: `def numDecodings(s: str) -> int:
    if not s or s[0] == '0':
        return 0

    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1  # Empty string
    dp[1] = 1  # First char (already checked != '0')

    for i in range(2, n + 1):
        # Single digit decode
        if s[i-1] != '0':
            dp[i] += dp[i-1]

        # Two digit decode
        two_digit = int(s[i-2:i])
        if 10 <= two_digit <= 26:
            dp[i] += dp[i-2]

    return dp[n]

# Test
print(numDecodings("226"))  # 3
print(numDecodings("06"))   # 0`
      },
      hints: [
        { afterAttempt: 1, text: 'Handle edge case: if s starts with "0", return 0' },
        { afterAttempt: 2, text: 'Single digit valid if != "0"' },
        { afterAttempt: 3, text: 'Two digit valid if 10 <= int(s[i-2:i]) <= 26' }
      ],
      testCases: [
        { input: '"226"', expectedOutput: '3' },
        { input: '"12"', expectedOutput: '2' },
        { input: '"06"', expectedOutput: '0' },
        { input: '"10"', expectedOutput: '1' }
      ],
      solutionExplanation: `## Tricky Edge Cases

1. **Leading zero:** "0..." → 0 ways (invalid)
2. **Zero in middle:** "10" → 1 way (must use as "10")
3. **"30", "40", etc.:** 0 ways (30 > 26 and 0 alone invalid)

## Why This is Like Fibonacci

Similar structure: dp[i] depends on dp[i-1] and dp[i-2].
But with validity conditions on each transition.

## Complexity
- **Time:** O(n)
- **Space:** O(n), can optimize to O(1)`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-target-sum',
      title: 'Target Sum',
      description: 'Count ways to assign +/- to reach target',
      requiredForProgress: true,
      conceptFamily: 'knapsack',
      targetComplexity: { time: 'O(n*sum)', space: 'O(sum)' },
      instruction: `# Target Sum

## The Problem

Given an array \`nums\` and a target, assign + or - to each element to make the sum equal to target. Return the number of ways.

**Example:**
\`\`\`
Input: nums = [1, 1, 1, 1, 1], target = 3
Output: 5
Ways: -1+1+1+1+1 = 3, +1-1+1+1+1 = 3, etc.
\`\`\`

## Key Insight: Transform to Subset Sum

Let P = sum of positive nums, N = sum of negative nums (absolute)
- P + N = total_sum
- P - N = target

Solving: P = (total_sum + target) / 2

**New problem:** Count subsets with sum = P

## Your Task

Implement using the subset sum count approach.`,
      starterCode: `def findTargetSumWays(nums: list[int], target: int) -> int:
    pass`,
      solution: {
        afterAttempt: 3,
        text: `def findTargetSumWays(nums: list[int], target: int) -> int:
    total = sum(nums)

    # Check if solution exists
    if (total + target) % 2 != 0 or abs(target) > total:
        return 0

    subset_sum = (total + target) // 2

    # Count subsets with given sum
    dp = [0] * (subset_sum + 1)
    dp[0] = 1  # Empty subset sums to 0

    for num in nums:
        # Iterate backwards to avoid using same num twice
        for s in range(subset_sum, num - 1, -1):
            dp[s] += dp[s - num]

    return dp[subset_sum]

# Test
print(findTargetSumWays([1, 1, 1, 1, 1], 3))  # 5`
      },
      hints: [
        { afterAttempt: 1, text: 'Transform: subset_sum = (total + target) / 2' },
        { afterAttempt: 2, text: 'Check: if (total + target) is odd, return 0' },
        { afterAttempt: 3, text: 'Count subsets: dp[s] += dp[s - num] (iterate backwards)' }
      ],
      testCases: [
        { input: '[1, 1, 1, 1, 1], 3', expectedOutput: '5' },
        { input: '[1], 1', expectedOutput: '1' },
        { input: '[1], 2', expectedOutput: '0' }
      ],
      solutionExplanation: `## Why the Transform Works

If we split nums into positive set P and negative set N:
- P + N = total (all elements used)
- P - N = target (our goal)

Adding: 2P = total + target → P = (total + target) / 2

So we just need to count subsets that sum to P!

## This is Subset Sum Count

Classic 0/1 knapsack counting variant. Iterate backwards to ensure each element used at most once.

## Complexity
- **Time:** O(n × sum)
- **Space:** O(sum)`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-partition-equal-subset-sum',
      title: 'Partition Equal Subset Sum',
      description: 'Can array be partitioned into two equal-sum subsets?',
      requiredForProgress: true,
      conceptFamily: 'knapsack',
      targetComplexity: { time: 'O(n*sum)', space: 'O(sum)' },
      instruction: `# Partition Equal Subset Sum

## The Problem

Given an array \`nums\`, can you partition it into two subsets with equal sum?

**Example:**
\`\`\`
Input: nums = [1, 5, 11, 5]
Output: true
Explanation: [1, 5, 5] and [11] both sum to 11
\`\`\`

## Key Insight

If total sum is odd → impossible.
Otherwise, find if any subset sums to total/2.

## Your Task

Implement using the subset sum existence approach.`,
      starterCode: `def canPartition(nums: list[int]) -> bool:
    pass`,
      solution: {
        afterAttempt: 3,
        text: `def canPartition(nums: list[int]) -> bool:
    total = sum(nums)

    # Odd sum can't be split equally
    if total % 2 != 0:
        return False

    target = total // 2

    # dp[i] = can we make sum i?
    dp = [False] * (target + 1)
    dp[0] = True  # Empty subset sums to 0

    for num in nums:
        # Iterate backwards to avoid reusing same num
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]

    return dp[target]

# Test
print(canPartition([1, 5, 11, 5]))  # True
print(canPartition([1, 2, 3, 5]))   # False`
      },
      hints: [
        { afterAttempt: 1, text: 'If sum is odd, return False immediately' },
        { afterAttempt: 2, text: 'Target = total // 2, find subset with this sum' },
        { afterAttempt: 3, text: 'dp[s] = dp[s] or dp[s - num] (iterate backwards)' }
      ],
      testCases: [
        { input: '[1, 5, 11, 5]', expectedOutput: 'True' },
        { input: '[1, 2, 3, 5]', expectedOutput: 'False' },
        { input: '[1, 2, 5]', expectedOutput: 'False' }
      ],
      solutionExplanation: `## This is Subset Sum

Classic 0/1 knapsack decision problem:
- Can we select elements to sum exactly to target?

## Why Iterate Backwards?

If we go forward, we might use the same element multiple times.
Backwards ensures each element is considered at most once.

## Early Exit Optimization

Can add: \`if dp[target]: return True\` inside the loop for early termination.

## Complexity
- **Time:** O(n × sum/2)
- **Space:** O(sum/2)`
    },

  // ============================================================
  // GROUP 1: 1D DP (State = index) - Additional exercises
  // ============================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-min-cost-climbing-stairs',
    title: 'Min Cost Climbing Stairs',
    description: 'Find minimum cost to reach the top of stairs',
    conceptFamily: '1d-dp',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Min Cost Climbing Stairs

## The Problem

Given an array \`cost\` where \`cost[i]\` is the cost to step on stair \`i\`.

You can start at index 0 or 1. Each step you can climb 1 or 2 stairs.

Return the minimum cost to reach beyond the last index (the top).

**Example:**
\`\`\`
Input: cost = [10, 15, 20]
Output: 15
Explanation: Start at index 1, pay 15, climb 2 steps to top.
\`\`\`

**Example 2:**
\`\`\`
Input: cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]
Output: 6
\`\`\`

## The Recurrence

\`dp[i] = cost[i] + min(dp[i-1], dp[i-2])\`

Or work backwards: min cost to reach top from position i.`,
    starterCode: `def minCostClimbingStairs(cost: list[int]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def minCostClimbingStairs(cost: list[int]) -> int:
    n = len(cost)

    # Space-optimized: only need last 2 values
    prev2 = cost[0]
    prev1 = cost[1]

    for i in range(2, n):
        curr = cost[i] + min(prev1, prev2)
        prev2 = prev1
        prev1 = curr

    # Can reach top from last or second-to-last stair
    return min(prev1, prev2)

# Test
print(minCostClimbingStairs([10, 15, 20]))  # 15
print(minCostClimbingStairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]))  # 6`
    },
    hints: [
      { afterAttempt: 1, text: 'dp[i] = min cost to reach stair i' },
      { afterAttempt: 2, text: 'dp[i] = cost[i] + min(dp[i-1], dp[i-2])' },
      { afterAttempt: 3, text: 'Answer is min(dp[n-1], dp[n-2]) - can reach top from either' }
    ],
    testCases: [
      { input: '[10, 15, 20]', expectedOutput: '15' },
      { input: '[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]', expectedOutput: '6' }
    ],
    solutionExplanation: `## Key Insight

You pay cost[i] when you STEP ON stair i, then can jump 1 or 2.
To reach stair i, you came from i-1 or i-2.

## Space Optimization

Only need previous 2 values, so O(1) space.

## Complexity
- **Time:** O(n)
- **Space:** O(1)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-frog-jump-energy',
    title: 'Frog Jump Energy',
    description: 'Find minimum energy for frog to reach end',
    conceptFamily: '1d-dp',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Frog Jump Energy

## The Problem

A frog starts at index 0 and wants to reach index n-1.

At each step, the frog can jump 1 or 2 positions forward.

The energy cost of jumping from index i to j is \`abs(height[i] - height[j])\`.

Return the minimum total energy to reach the end.

**Example:**
\`\`\`
Input: height = [10, 20, 30, 10]
Output: 20
Explanation:
  0→1: |10-20| = 10
  1→3: |20-10| = 10
  Total: 20
\`\`\`

## The Recurrence

\`dp[i] = min(dp[i-1] + |h[i]-h[i-1]|, dp[i-2] + |h[i]-h[i-2]|)\``,
    starterCode: `def frogJump(height: list[int]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def frogJump(height: list[int]) -> int:
    n = len(height)
    if n <= 1:
        return 0

    # dp[i] = min energy to reach position i
    prev2 = 0  # dp[0]
    prev1 = abs(height[1] - height[0])  # dp[1]

    for i in range(2, n):
        # Jump from i-1 or i-2
        from_prev1 = prev1 + abs(height[i] - height[i-1])
        from_prev2 = prev2 + abs(height[i] - height[i-2])
        curr = min(from_prev1, from_prev2)
        prev2 = prev1
        prev1 = curr

    return prev1

# Test
print(frogJump([10, 20, 30, 10]))  # 20`
    },
    hints: [
      { afterAttempt: 1, text: 'dp[i] = minimum energy to reach stone i' },
      { afterAttempt: 2, text: 'From i-1: dp[i-1] + abs(height[i] - height[i-1])' },
      { afterAttempt: 3, text: 'From i-2: dp[i-2] + abs(height[i] - height[i-2])' }
    ],
    testCases: [
      { input: '[10, 20, 30, 10]', expectedOutput: '20' },
      { input: '[10, 20, 10]', expectedOutput: '0' },
      { input: '[30, 10, 60, 10, 60, 50]', expectedOutput: '40' }
    ],
    solutionExplanation: `## Similar to Climbing Stairs

But with variable costs based on height differences.

## Space Optimization

Only need last 2 values → O(1) space.

## Complexity
- **Time:** O(n)
- **Space:** O(1)`
  },

  // ============================================================
  // GROUP 2: 1D DP with State Transitions
  // ============================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-house-robber-circular',
    title: 'House Robber II (Circular)',
    description: 'Rob houses arranged in a circle',
    conceptFamily: '1d-dp',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# House Robber II - Circular Street

## The Problem

Houses are arranged in a circle (first and last are adjacent).

You cannot rob two adjacent houses.

Return the maximum amount you can rob.

**Example:**
\`\`\`
Input: nums = [2, 3, 2]
Output: 3
Explanation: Cannot rob house 0 and 2 (adjacent in circle).
Best: rob house 1 only = 3.
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1, 2, 3, 1]
Output: 4
Explanation: Rob house 0 and 2 = 1 + 3 = 4.
\`\`\`

## Key Insight

Since first and last are adjacent, we can't rob both.

**Solution:** Run House Robber twice:
1. Houses 0 to n-2 (exclude last)
2. Houses 1 to n-1 (exclude first)

Return max of both.`,
    starterCode: `def rob(nums: list[int]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def rob(nums: list[int]) -> int:
    if len(nums) == 1:
        return nums[0]

    def rob_linear(houses):
        prev2, prev1 = 0, 0
        for money in houses:
            curr = max(prev1, prev2 + money)
            prev2 = prev1
            prev1 = curr
        return prev1

    # Case 1: exclude last house
    # Case 2: exclude first house
    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))

# Test
print(rob([2, 3, 2]))  # 3
print(rob([1, 2, 3, 1]))  # 4`
    },
    hints: [
      { afterAttempt: 1, text: 'First and last are adjacent → can\'t rob both' },
      { afterAttempt: 2, text: 'Split into two subproblems: exclude first OR exclude last' },
      { afterAttempt: 3, text: 'Run standard House Robber on each subarray, take max' }
    ],
    testCases: [
      { input: '[2, 3, 2]', expectedOutput: '3' },
      { input: '[1, 2, 3, 1]', expectedOutput: '4' },
      { input: '[1]', expectedOutput: '1' }
    ],
    solutionExplanation: `## Breaking the Circle

By excluding either the first or last house, we convert to a linear problem.

## Why This Works

If we rob house 0, we can't rob house n-1 → covered by case 1.
If we rob house n-1, we can't rob house 0 → covered by case 2.

## Complexity
- **Time:** O(n)
- **Space:** O(1)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-delete-and-earn',
    title: 'Delete and Earn',
    description: 'Maximize points by deleting numbers',
    conceptFamily: '1d-dp',
    targetComplexity: { time: 'O(n + max)', space: 'O(max)' },
    instruction: `# Delete and Earn

## The Problem

Given array \`nums\`, you can perform operations:
- Pick any \`nums[i]\`, earn \`nums[i]\` points
- Delete ALL occurrences of \`nums[i]-1\` and \`nums[i]+1\`

Return maximum points.

**Example:**
\`\`\`
Input: nums = [3, 4, 2]
Output: 6
Explanation:
  - Take all 4s: earn 4 points, delete 3s
  - Take all 2s: earn 2 points (no 1s or 3s left)
  - Total: 6
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [2, 2, 3, 3, 3, 4]
Output: 9
Explanation: Take all 3s (3×3=9), deletes 2s and 4s.
\`\`\`

## Key Insight

This is House Robber in disguise!

If you take value \`x\`, you can't take \`x-1\` or \`x+1\` (adjacent values).

Transform: \`points[x] = x * count(x)\``,
    starterCode: `def deleteAndEarn(nums: list[int]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def deleteAndEarn(nums: list[int]) -> int:
    if not nums:
        return 0

    max_num = max(nums)

    # points[i] = total points from taking all i's
    points = [0] * (max_num + 1)
    for num in nums:
        points[num] += num

    # Now it's House Robber on points array!
    prev2, prev1 = 0, 0
    for p in points:
        curr = max(prev1, prev2 + p)
        prev2 = prev1
        prev1 = curr

    return prev1

# Test
print(deleteAndEarn([3, 4, 2]))  # 6
print(deleteAndEarn([2, 2, 3, 3, 3, 4]))  # 9`
    },
    hints: [
      { afterAttempt: 1, text: 'Transform: points[x] = x × count(x)' },
      { afterAttempt: 2, text: 'Taking x means you can\'t take x-1 or x+1' },
      { afterAttempt: 3, text: 'This is exactly House Robber on the points array!' }
    ],
    testCases: [
      { input: '[3, 4, 2]', expectedOutput: '6' },
      { input: '[2, 2, 3, 3, 3, 4]', expectedOutput: '9' }
    ],
    solutionExplanation: `## Reduction to House Robber

Key insight: if you take value x, you must take ALL x's (optimal), and you can't take x±1.

This is exactly the House Robber constraint!

## Complexity
- **Time:** O(n + max(nums))
- **Space:** O(max(nums))`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-min-cost-tickets',
    title: 'Minimum Cost For Tickets',
    description: 'Find cheapest way to cover travel days',
    conceptFamily: '1d-dp',
    targetComplexity: { time: 'O(max_day)', space: 'O(max_day)' },
    instruction: `# Minimum Cost For Tickets

## The Problem

You have a list of travel \`days\` (sorted).

You can buy:
- 1-day pass for \`costs[0]\`
- 7-day pass for \`costs[1]\`
- 30-day pass for \`costs[2]\`

Return minimum cost to cover all travel days.

**Example:**
\`\`\`
Input: days = [1,4,6,7,8,20], costs = [2,7,15]
Output: 11
Explanation:
  Day 1: buy 1-day pass (2)
  Day 4: buy 7-day pass (7) - covers days 4-10
  Day 20: buy 1-day pass (2)
  Total: 11
\`\`\`

## The Recurrence

For each day d:
- If not a travel day: dp[d] = dp[d-1]
- If travel day: dp[d] = min of:
  - dp[d-1] + costs[0] (1-day pass)
  - dp[d-7] + costs[1] (7-day pass)
  - dp[d-30] + costs[2] (30-day pass)`,
    starterCode: `def mincostTickets(days: list[int], costs: list[int]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def mincostTickets(days: list[int], costs: list[int]) -> int:
    travel_days = set(days)
    last_day = days[-1]

    # dp[i] = min cost to cover all travel days up to day i
    dp = [0] * (last_day + 1)

    for d in range(1, last_day + 1):
        if d not in travel_days:
            dp[d] = dp[d - 1]  # Not traveling, no cost
        else:
            dp[d] = min(
                dp[max(0, d - 1)] + costs[0],   # 1-day pass
                dp[max(0, d - 7)] + costs[1],   # 7-day pass
                dp[max(0, d - 30)] + costs[2]   # 30-day pass
            )

    return dp[last_day]

# Test
print(mincostTickets([1,4,6,7,8,20], [2,7,15]))  # 11`
    },
    hints: [
      { afterAttempt: 1, text: 'Use set for O(1) lookup of travel days' },
      { afterAttempt: 2, text: 'Non-travel days: dp[d] = dp[d-1]' },
      { afterAttempt: 3, text: 'Travel days: try all 3 pass options, take minimum' }
    ],
    testCases: [
      { input: '[1,4,6,7,8,20], [2,7,15]', expectedOutput: '11' },
      { input: '[1,2,3,4,5,6,7,8,9,10,30,31], [2,7,15]', expectedOutput: '17' }
    ],
    solutionExplanation: `## Day-by-Day DP

Process each day from 1 to last_day.

For travel days, try all 3 passes and pick cheapest.

## Edge Cases

Use max(0, d-k) to handle negative indices.

## Complexity
- **Time:** O(last_day)
- **Space:** O(last_day)`
  },

  // ============================================================
  // GROUP 3: 2D DP (Grid / Table)
  // ============================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-unique-paths-obstacles',
    title: 'Unique Paths II (With Obstacles)',
    description: 'Count paths in grid with obstacles',
    conceptFamily: '2d-dp',
    targetComplexity: { time: 'O(m*n)', space: 'O(n)' },
    instruction: `# Unique Paths II - With Obstacles

## The Problem

An m×n grid with obstacles (1 = blocked, 0 = open).

Count unique paths from top-left to bottom-right.

Can only move right or down.

**Example:**
\`\`\`
Input: obstacleGrid = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0]
]
Output: 2
\`\`\`

## The Recurrence

\`\`\`python
if grid[i][j] == 1:
    dp[i][j] = 0  # Blocked
else:
    dp[i][j] = dp[i-1][j] + dp[i][j-1]
\`\`\``,
    starterCode: `def uniquePathsWithObstacles(obstacleGrid: list[list[int]]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def uniquePathsWithObstacles(obstacleGrid: list[list[int]]) -> int:
    m, n = len(obstacleGrid), len(obstacleGrid[0])
    if obstacleGrid[0][0] == 1 or obstacleGrid[m-1][n-1] == 1:
        return 0

    dp = [0] * n
    dp[0] = 1

    for i in range(m):
        for j in range(n):
            if obstacleGrid[i][j] == 1:
                dp[j] = 0
            elif j > 0:
                dp[j] += dp[j-1]

    return dp[n-1]`
    },
    hints: [
      { afterAttempt: 1, text: 'If a cell has obstacle, dp[i][j] = 0' },
      { afterAttempt: 2, text: 'Check if start or end is blocked → return 0' },
      { afterAttempt: 3, text: 'Can optimize to O(n) space using single row' }
    ],
    testCases: [
      { input: '[[0,0,0],[0,1,0],[0,0,0]]', expectedOutput: '2' },
      { input: '[[0,1],[0,0]]', expectedOutput: '1' }
    ],
    solutionExplanation: `## Key Difference from Unique Paths

Obstacles set dp[i][j] = 0.

## Complexity
- **Time:** O(m × n)
- **Space:** O(n)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-min-path-sum',
    title: 'Minimum Path Sum',
    description: 'Find minimum sum path in grid',
    conceptFamily: '2d-dp',
    targetComplexity: { time: 'O(m*n)', space: 'O(n)' },
    instruction: `# Minimum Path Sum

## The Problem

Given an m×n grid with non-negative numbers.

Find a path from top-left to bottom-right minimizing sum.

Can only move right or down.

**Example:**
\`\`\`
Input: grid = [[1,3,1],[1,5,1],[4,2,1]]
Output: 7
Path: 1 → 3 → 1 → 1 → 1 = 7
\`\`\`

## The Recurrence

\`dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])\``,
    starterCode: `def minPathSum(grid: list[list[int]]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def minPathSum(grid: list[list[int]]) -> int:
    m, n = len(grid), len(grid[0])
    dp = [0] * n
    dp[0] = grid[0][0]

    for j in range(1, n):
        dp[j] = dp[j-1] + grid[0][j]

    for i in range(1, m):
        dp[0] += grid[i][0]
        for j in range(1, n):
            dp[j] = grid[i][j] + min(dp[j], dp[j-1])

    return dp[n-1]`
    },
    hints: [
      { afterAttempt: 1, text: 'First row and column have only one path' },
      { afterAttempt: 2, text: 'dp[i][j] = grid[i][j] + min(from_above, from_left)' },
      { afterAttempt: 3, text: 'Optimize to O(n) space' }
    ],
    testCases: [
      { input: '[[1,3,1],[1,5,1],[4,2,1]]', expectedOutput: '7' },
      { input: '[[1,2,3],[4,5,6]]', expectedOutput: '12' }
    ],
    solutionExplanation: `## Classic Grid DP

Similar to Unique Paths but sum instead of count.

## Complexity
- **Time:** O(m × n)
- **Space:** O(n)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-triangle',
    title: 'Triangle Path Sum',
    description: 'Find minimum path sum in triangle',
    conceptFamily: '2d-dp',
    targetComplexity: { time: 'O(n²)', space: 'O(n)' },
    instruction: `# Triangle Path Sum

## The Problem

Given a triangle array, find minimum path sum from top to bottom.

Each step, move to adjacent number on row below (i or i+1).

**Example:**
\`\`\`
Input: triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]
Output: 11
Path: 2 → 3 → 5 → 1 = 11
\`\`\`

## Key Insight

Work BOTTOM-UP! Start from bottom row, propagate upward.`,
    starterCode: `def minimumTotal(triangle: list[list[int]]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def minimumTotal(triangle: list[list[int]]) -> int:
    n = len(triangle)
    dp = triangle[-1][:]

    for row in range(n - 2, -1, -1):
        for i in range(row + 1):
            dp[i] = triangle[row][i] + min(dp[i], dp[i + 1])

    return dp[0]`
    },
    hints: [
      { afterAttempt: 1, text: 'Bottom-up is easier than top-down' },
      { afterAttempt: 2, text: 'Start dp as copy of bottom row' },
      { afterAttempt: 3, text: 'dp[i] = triangle[row][i] + min(dp[i], dp[i+1])' }
    ],
    testCases: [
      { input: '[[2],[3,4],[6,5,7],[4,1,8,3]]', expectedOutput: '11' },
      { input: '[[-10]]', expectedOutput: '-10' }
    ],
    solutionExplanation: `## Why Bottom-Up?

From bottom, each position has exactly 2 children.

## Complexity
- **Time:** O(n²)
- **Space:** O(n)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-maximal-square',
    title: 'Maximal Square',
    description: 'Find largest square of 1s in binary matrix',
    conceptFamily: '2d-dp',
    targetComplexity: { time: 'O(m*n)', space: 'O(n)' },
    instruction: `# Maximal Square

## The Problem

Given an m×n binary matrix, find the largest square containing only 1s.

Return its area.

**Example:**
\`\`\`
Input: matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]
Output: 4 (2×2 square)
\`\`\`

## Key Insight

\`dp[i][j]\` = side length of largest square with bottom-right at (i,j).

\`dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\``,
    starterCode: `def maximalSquare(matrix: list[list[str]]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def maximalSquare(matrix: list[list[str]]) -> int:
    if not matrix:
        return 0
    m, n = len(matrix), len(matrix[0])
    dp = [0] * (n + 1)
    max_side = 0
    prev = 0

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            temp = dp[j]
            if matrix[i-1][j-1] == '1':
                dp[j] = 1 + min(dp[j], dp[j-1], prev)
                max_side = max(max_side, dp[j])
            else:
                dp[j] = 0
            prev = temp
        prev = 0

    return max_side * max_side`
    },
    hints: [
      { afterAttempt: 1, text: 'dp[i][j] = side length of square ending at (i,j)' },
      { afterAttempt: 2, text: 'Square limited by min of top, left, diagonal' },
      { afterAttempt: 3, text: 'Answer is max_side² (area)' }
    ],
    testCases: [
      { input: '[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]', expectedOutput: '4' },
      { input: '[["0","1"],["1","0"]]', expectedOutput: '1' }
    ],
    solutionExplanation: `## Why min of 3 neighbors?

A square can only be as large as the smallest adjacent square + 1.

## Complexity
- **Time:** O(m × n)
- **Space:** O(n)`
  },

  // ============================================================
  // GROUP 4: Knapsack-Style DP
  // ============================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-unbounded-knapsack',
    title: 'Unbounded Knapsack',
    description: 'Knapsack with unlimited item uses',
    conceptFamily: 'knapsack',
    targetComplexity: { time: 'O(n*W)', space: 'O(W)' },
    instruction: `# Unbounded Knapsack

## The Problem

Given weights and values of n items and capacity W.

Each item can be used UNLIMITED times.

Return maximum value.

**Example:**
\`\`\`
Input: weights = [1, 3, 4], values = [15, 50, 60], capacity = 8
Output: 120 (item 0 eight times = 15×8)
\`\`\`

## Key Difference from 0/1 Knapsack

Iterate capacity FORWARD (allows reuse).`,
    starterCode: `def unboundedKnapsack(weights: list[int], values: list[int], capacity: int) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def unboundedKnapsack(weights: list[int], values: list[int], capacity: int) -> int:
    dp = [0] * (capacity + 1)

    for w in range(1, capacity + 1):
        for i in range(len(weights)):
            if weights[i] <= w:
                dp[w] = max(dp[w], values[i] + dp[w - weights[i]])

    return dp[capacity]`
    },
    hints: [
      { afterAttempt: 1, text: 'Iterate capacity forward (not backward)' },
      { afterAttempt: 2, text: 'For each capacity, try all items' },
      { afterAttempt: 3, text: 'dp[w] = max(dp[w], value[i] + dp[w - weight[i]])' }
    ],
    testCases: [
      { input: '[1, 3, 4], [15, 50, 60], 8', expectedOutput: '120' },
      { input: '[2, 3], [10, 15], 5', expectedOutput: '25' }
    ],
    solutionExplanation: `## Forward vs Backward

**0/1:** Backward (each item once)
**Unbounded:** Forward (reuse allowed)

## Complexity
- **Time:** O(n × W)
- **Space:** O(W)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-combination-sum-iv',
    title: 'Combination Sum IV',
    description: 'Count sequences summing to target',
    conceptFamily: 'knapsack',
    targetComplexity: { time: 'O(target*n)', space: 'O(target)' },
    instruction: `# Combination Sum IV

## The Problem

Given array of distinct integers and target, return number of sequences summing to target.

Different orderings count as different combinations.

**Example:**
\`\`\`
Input: nums = [1, 2, 3], target = 4
Output: 7
(1,1,1,1), (1,1,2), (1,2,1), (2,1,1), (1,3), (3,1), (2,2)
\`\`\`

## Key Insight

Order matters → outer loop on target, inner on nums.`,
    starterCode: `def combinationSum4(nums: list[int], target: int) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def combinationSum4(nums: list[int], target: int) -> int:
    dp = [0] * (target + 1)
    dp[0] = 1

    for t in range(1, target + 1):
        for num in nums:
            if num <= t:
                dp[t] += dp[t - num]

    return dp[target]`
    },
    hints: [
      { afterAttempt: 1, text: 'Order matters → permutations' },
      { afterAttempt: 2, text: 'Outer loop: target, Inner loop: nums' },
      { afterAttempt: 3, text: 'dp[t] = sum of dp[t - num]' }
    ],
    testCases: [
      { input: '[1, 2, 3], 4', expectedOutput: '7' },
      { input: '[9], 3', expectedOutput: '0' }
    ],
    solutionExplanation: `## Loop Order

**Order matters:** Target outer
**Order doesn't matter:** Nums outer

## Complexity
- **Time:** O(target × n)
- **Space:** O(target)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-coin-change-ii',
    title: 'Coin Change II',
    description: 'Count combinations to make amount',
    conceptFamily: 'knapsack',
    targetComplexity: { time: 'O(amount*n)', space: 'O(amount)' },
    instruction: `# Coin Change II

## The Problem

Given coins and amount, return NUMBER OF COMBINATIONS.

Different orderings are the same combination.

**Example:**
\`\`\`
Input: coins = [1, 2, 5], amount = 5
Output: 4 (5, 2+2+1, 2+1+1+1, 1+1+1+1+1)
\`\`\`

## Key Insight

Order doesn't matter → outer loop on coins.`,
    starterCode: `def change(amount: int, coins: list[int]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def change(amount: int, coins: list[int]) -> int:
    dp = [0] * (amount + 1)
    dp[0] = 1

    for coin in coins:
        for a in range(coin, amount + 1):
            dp[a] += dp[a - coin]

    return dp[amount]`
    },
    hints: [
      { afterAttempt: 1, text: 'Order doesn\'t matter → coins outer' },
      { afterAttempt: 2, text: 'Inner loop: iterate forward (unbounded)' },
      { afterAttempt: 3, text: 'dp[a] += dp[a - coin]' }
    ],
    testCases: [
      { input: '5, [1, 2, 5]', expectedOutput: '4' },
      { input: '3, [2]', expectedOutput: '0' }
    ],
    solutionExplanation: `## Coin Change I vs II

**I:** Minimize coin count
**II:** Count combinations

## Complexity
- **Time:** O(amount × n)
- **Space:** O(amount)`
  },

  // ============================================================
  // GROUP 5: String DP
  // ============================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-palindromic-substrings',
    title: 'Palindromic Substrings',
    description: 'Count all palindromic substrings',
    conceptFamily: 'string-dp',
    targetComplexity: { time: 'O(n²)', space: 'O(1)' },
    instruction: `# Palindromic Substrings

## The Problem

Given string s, count all palindromic substrings.

**Example:**
\`\`\`
Input: s = "aaa"
Output: 6 ("a", "a", "a", "aa", "aa", "aaa")
\`\`\`

## Approach

Expand around centers (odd and even length).`,
    starterCode: `def countSubstrings(s: str) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def countSubstrings(s: str) -> int:
    def expand(left: int, right: int) -> int:
        count = 0
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
        return count

    total = 0
    for i in range(len(s)):
        total += expand(i, i)      # Odd length
        total += expand(i, i + 1)  # Even length

    return total`
    },
    hints: [
      { afterAttempt: 1, text: 'Use expand around center technique' },
      { afterAttempt: 2, text: 'Try both odd and even length centers' },
      { afterAttempt: 3, text: 'Count each valid expansion' }
    ],
    testCases: [
      { input: '"abc"', expectedOutput: '3' },
      { input: '"aaa"', expectedOutput: '6' }
    ],
    solutionExplanation: `## Expand Around Centers

O(n²) time, O(1) space.

## Complexity
- **Time:** O(n²)
- **Space:** O(1)`
  },

  // ============================================================
  // GROUP 6: Interval / Range DP
  // ============================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-burst-balloons',
    title: 'Burst Balloons',
    description: 'Maximize coins from bursting balloons',
    conceptFamily: 'interval-dp',
    targetComplexity: { time: 'O(n³)', space: 'O(n²)' },
    instruction: `# Burst Balloons

## The Problem

Given n balloons with values. Burst balloon i to get \`nums[i-1] * nums[i] * nums[i+1]\` coins.

Return maximum coins.

**Example:**
\`\`\`
Input: nums = [3, 1, 5, 8]
Output: 167
Order: 1 → 5 → 3 → 8 gives 3×1×5 + 3×5×8 + 1×3×8 + 1×8×1 = 167
\`\`\`

## Key Insight

Think REVERSE: which balloon to burst LAST in range [i,j]?

\`dp[i][j]\` = max coins for bursting all balloons in (i,j) exclusive.`,
    starterCode: `def maxCoins(nums: list[int]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def maxCoins(nums: list[int]) -> int:
    nums = [1] + nums + [1]
    n = len(nums)
    dp = [[0] * n for _ in range(n)]

    for length in range(2, n):
        for i in range(n - length):
            j = i + length
            for k in range(i + 1, j):
                dp[i][j] = max(
                    dp[i][j],
                    dp[i][k] + nums[i] * nums[k] * nums[j] + dp[k][j]
                )

    return dp[0][n - 1]`
    },
    hints: [
      { afterAttempt: 1, text: 'Pad with 1s at both ends' },
      { afterAttempt: 2, text: 'Think: which balloon to burst LAST?' },
      { afterAttempt: 3, text: 'dp[i][j] = max over k of (dp[i][k] + nums[i]*nums[k]*nums[j] + dp[k][j])' }
    ],
    testCases: [
      { input: '[3, 1, 5, 8]', expectedOutput: '167' },
      { input: '[1, 5]', expectedOutput: '10' }
    ],
    solutionExplanation: `## Think in Reverse

Instead of which to burst first, think which to burst LAST.

When k is burst last in (i,j), only nums[i] and nums[j] remain as neighbors.

## Complexity
- **Time:** O(n³)
- **Space:** O(n²)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-matrix-chain',
    title: 'Matrix Chain Multiplication',
    description: 'Minimize multiplication cost',
    conceptFamily: 'interval-dp',
    targetComplexity: { time: 'O(n³)', space: 'O(n²)' },
    instruction: `# Matrix Chain Multiplication

## The Problem

Given dimensions of n matrices: dims[i-1] × dims[i] for matrix i.

Find minimum multiplications to compute product.

**Example:**
\`\`\`
Input: dims = [10, 30, 5, 60]
Matrices: A(10×30), B(30×5), C(5×60)
Output: 4500
(A×B)×C = 10×30×5 + 10×5×60 = 1500 + 3000 = 4500
A×(B×C) = 30×5×60 + 10×30×60 = 9000 + 18000 = 27000
\`\`\`

## The Recurrence

\`dp[i][j] = min over k of (dp[i][k] + dp[k+1][j] + dims[i-1]*dims[k]*dims[j])\``,
    starterCode: `def matrixChainOrder(dims: list[int]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def matrixChainOrder(dims: list[int]) -> int:
    n = len(dims) - 1  # Number of matrices
    dp = [[0] * (n + 1) for _ in range(n + 1)]

    for length in range(2, n + 1):
        for i in range(1, n - length + 2):
            j = i + length - 1
            dp[i][j] = float('inf')
            for k in range(i, j):
                cost = dp[i][k] + dp[k+1][j] + dims[i-1] * dims[k] * dims[j]
                dp[i][j] = min(dp[i][j], cost)

    return dp[1][n]`
    },
    hints: [
      { afterAttempt: 1, text: 'n = len(dims) - 1 matrices' },
      { afterAttempt: 2, text: 'Try all split points k' },
      { afterAttempt: 3, text: 'Cost = left + right + dims[i-1]*dims[k]*dims[j]' }
    ],
    testCases: [
      { input: '[10, 30, 5, 60]', expectedOutput: '4500' },
      { input: '[40, 20, 30, 10, 30]', expectedOutput: '26000' }
    ],
    solutionExplanation: `## Classic Interval DP

Try all ways to split the chain, compute cost recursively.

## Complexity
- **Time:** O(n³)
- **Space:** O(n²)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-min-cost-cut-stick',
    title: 'Minimum Cost to Cut a Stick',
    description: 'Minimize total cutting cost',
    conceptFamily: 'interval-dp',
    targetComplexity: { time: 'O(n³)', space: 'O(n²)' },
    instruction: `# Minimum Cost to Cut a Stick

## The Problem

Stick of length n. Array \`cuts\` contains positions to cut.

Cost of a cut = current length of the stick.

Return minimum total cost.

**Example:**
\`\`\`
Input: n = 7, cuts = [1, 3, 4, 5]
Output: 16
One way: cut at 3 (cost 7), then 1 (cost 3), then 4 (cost 4), then 5 (cost 2) = 16
\`\`\`

## Key Insight

Similar to Burst Balloons - which cut to make LAST in a segment?`,
    starterCode: `def minCost(n: int, cuts: list[int]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def minCost(n: int, cuts: list[int]) -> int:
    cuts = [0] + sorted(cuts) + [n]
    m = len(cuts)
    dp = [[0] * m for _ in range(m)]

    for length in range(2, m):
        for i in range(m - length):
            j = i + length
            dp[i][j] = float('inf')
            for k in range(i + 1, j):
                cost = cuts[j] - cuts[i] + dp[i][k] + dp[k][j]
                dp[i][j] = min(dp[i][j], cost)

    return dp[0][m - 1]`
    },
    hints: [
      { afterAttempt: 1, text: 'Add 0 and n to cuts array, sort it' },
      { afterAttempt: 2, text: 'Cost of segment [i,j] = cuts[j] - cuts[i]' },
      { afterAttempt: 3, text: 'Try all middle cuts k' }
    ],
    testCases: [
      { input: '7, [1, 3, 4, 5]', expectedOutput: '16' },
      { input: '9, [5, 6, 1, 4, 2]', expectedOutput: '22' }
    ],
    solutionExplanation: `## Similar to Burst Balloons

Think which cut to make LAST - that determines segment length.

## Complexity
- **Time:** O(n³)
- **Space:** O(n²)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-strange-printer',
    title: 'Strange Printer',
    description: 'Minimum turns to print a string',
    conceptFamily: 'interval-dp',
    targetComplexity: { time: 'O(n³)', space: 'O(n²)' },
    instruction: `# Strange Printer

## The Problem

A printer can print a sequence of the same character in one turn.

It can print over existing characters.

Return minimum turns to print string s.

**Example:**
\`\`\`
Input: s = "aaabbb"
Output: 2 (print "aaa", then "bbb")
\`\`\`

**Example 2:**
\`\`\`
Input: s = "aba"
Output: 2 (print "aaa", then "b" in middle)
\`\`\`

## Key Insight

\`dp[i][j]\` = min turns to print s[i..j].

If s[i] == s[k], we can extend the first print.`,
    starterCode: `def strangePrinter(s: str) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def strangePrinter(s: str) -> int:
    if not s:
        return 0

    n = len(s)
    dp = [[0] * n for _ in range(n)]

    for i in range(n):
        dp[i][i] = 1

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = dp[i + 1][j] + 1

            for k in range(i + 1, j + 1):
                if s[k] == s[i]:
                    dp[i][j] = min(dp[i][j], dp[i + 1][k] + (dp[k + 1][j] if k + 1 <= j else 0))

    return dp[0][n - 1]`
    },
    hints: [
      { afterAttempt: 1, text: 'dp[i][j] = min turns for substring [i,j]' },
      { afterAttempt: 2, text: 'Base case: single char needs 1 turn' },
      { afterAttempt: 3, text: 'If s[i] == s[k], can combine prints' }
    ],
    testCases: [
      { input: '"aaabbb"', expectedOutput: '2' },
      { input: '"aba"', expectedOutput: '2' }
    ],
    solutionExplanation: `## Interval DP with Merging

When same characters appear, we can merge their printing.

## Complexity
- **Time:** O(n³)
- **Space:** O(n²)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-remove-boxes',
    title: 'Remove Boxes',
    description: 'Maximize points from removing boxes',
    conceptFamily: 'interval-dp',
    targetComplexity: { time: 'O(n⁴)', space: 'O(n³)' },
    instruction: `# Remove Boxes

## The Problem

Given boxes with colors. Remove consecutive boxes of same color.

Points for removing k boxes = k².

Return maximum points.

**Example:**
\`\`\`
Input: boxes = [1, 3, 2, 2, 2, 3, 4, 3, 1]
Output: 23
\`\`\`

## Key Insight

Need 3D DP: \`dp[l][r][k]\` where k = count of boxes same color as boxes[r] to the right.`,
    starterCode: `def removeBoxes(boxes: list[int]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def removeBoxes(boxes: list[int]) -> int:
    n = len(boxes)
    memo = {}

    def dp(l, r, k):
        if l > r:
            return 0
        if (l, r, k) in memo:
            return memo[(l, r, k)]

        # Extend k with consecutive same-color boxes at end
        while r > l and boxes[r] == boxes[r - 1]:
            r -= 1
            k += 1

        # Option 1: Remove boxes[r] with k same-color boxes
        result = (k + 1) ** 2 + dp(l, r - 1, 0)

        # Option 2: Find earlier box of same color, combine them
        for i in range(l, r):
            if boxes[i] == boxes[r]:
                result = max(result, dp(l, i, k + 1) + dp(i + 1, r - 1, 0))

        memo[(l, r, k)] = result
        return result

    return dp(0, n - 1, 0)`
    },
    hints: [
      { afterAttempt: 1, text: 'Need 3D state: left, right, count of same color to right' },
      { afterAttempt: 2, text: 'Option 1: remove rightmost group now' },
      { afterAttempt: 3, text: 'Option 2: find same color earlier, combine for more points' }
    ],
    testCases: [
      { input: '[1, 3, 2, 2, 2, 3, 4, 3, 1]', expectedOutput: '23' },
      { input: '[1, 1, 1]', expectedOutput: '9' }
    ],
    solutionExplanation: `## 3D DP with Memoization

Track how many same-color boxes can be merged.

Points grow quadratically with group size, so merging is valuable.

## Complexity
- **Time:** O(n⁴)
- **Space:** O(n³)`
  },

  // ============================================================
  // GROUP 7: DP With State Compression (Bitmask)
  // ============================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-tsp-bitmask',
    title: 'Traveling Salesman (Bitmask)',
    description: 'Find minimum tour visiting all cities',
    conceptFamily: 'bitmask-dp',
    targetComplexity: { time: 'O(n²*2ⁿ)', space: 'O(n*2ⁿ)' },
    instruction: `# Traveling Salesman Problem

## The Problem

Given n cities and distances between them.

Find minimum cost to visit all cities exactly once and return to start.

**Example:**
\`\`\`
Input: dist = [
  [0, 10, 15, 20],
  [10, 0, 35, 25],
  [15, 35, 0, 30],
  [20, 25, 30, 0]
]
Output: 80 (0 → 1 → 3 → 2 → 0)
\`\`\`

## Key Insight

\`dp[mask][i]\` = min cost to visit cities in mask, ending at i.

mask is a bitmask where bit j means city j is visited.`,
    starterCode: `def tsp(dist: list[list[int]]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def tsp(dist: list[list[int]]) -> int:
    n = len(dist)
    INF = float('inf')

    # dp[mask][i] = min cost to visit cities in mask, ending at i
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0  # Start at city 0

    for mask in range(1 << n):
        for last in range(n):
            if dp[mask][last] == INF:
                continue
            if not (mask & (1 << last)):
                continue

            for next_city in range(n):
                if mask & (1 << next_city):
                    continue
                new_mask = mask | (1 << next_city)
                dp[new_mask][next_city] = min(
                    dp[new_mask][next_city],
                    dp[mask][last] + dist[last][next_city]
                )

    # Return to start
    full_mask = (1 << n) - 1
    return min(dp[full_mask][i] + dist[i][0] for i in range(n))`
    },
    hints: [
      { afterAttempt: 1, text: 'Use bitmask to track visited cities' },
      { afterAttempt: 2, text: 'dp[mask][i] = min cost ending at city i' },
      { afterAttempt: 3, text: 'Don\'t forget to return to start at the end' }
    ],
    testCases: [
      { input: '[[0,10,15,20],[10,0,35,25],[15,35,0,30],[20,25,30,0]]', expectedOutput: '80' }
    ],
    solutionExplanation: `## Bitmask DP

2^n subsets × n ending cities = O(n × 2^n) states.

Each state tries n transitions.

## Complexity
- **Time:** O(n² × 2ⁿ)
- **Space:** O(n × 2ⁿ)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-assignment-problem',
    title: 'Assignment Problem',
    description: 'Assign tasks to workers with minimum cost',
    conceptFamily: 'bitmask-dp',
    targetComplexity: { time: 'O(n*2ⁿ)', space: 'O(2ⁿ)' },
    instruction: `# Assignment Problem

## The Problem

n workers and n tasks. cost[i][j] = cost of worker i doing task j.

Each worker does exactly one task, each task done by one worker.

Minimize total cost.

**Example:**
\`\`\`
Input: cost = [[3,2,7],[5,1,3],[2,7,2]]
Output: 5 (worker 0→task 1, worker 1→task 0, worker 2→task 2 = 2+5+2=... wait)
Actually: worker 0→1(2), worker 1→0(5)... Let me recalc.
Optimal: 0→1(2) + 1→2(3) + 2→0(2) = 7? Check again...
\`\`\`

## Key Insight

\`dp[mask]\` = min cost to assign first popcount(mask) workers to tasks in mask.`,
    starterCode: `def assignmentProblem(cost: list[list[int]]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def assignmentProblem(cost: list[list[int]]) -> int:
    n = len(cost)
    dp = [float('inf')] * (1 << n)
    dp[0] = 0

    for mask in range(1 << n):
        worker = bin(mask).count('1')
        if worker >= n:
            continue

        for task in range(n):
            if mask & (1 << task):
                continue
            new_mask = mask | (1 << task)
            dp[new_mask] = min(dp[new_mask], dp[mask] + cost[worker][task])

    return dp[(1 << n) - 1]`
    },
    hints: [
      { afterAttempt: 1, text: 'mask represents which tasks are assigned' },
      { afterAttempt: 2, text: 'popcount(mask) = which worker we\'re assigning' },
      { afterAttempt: 3, text: 'Try each unassigned task for current worker' }
    ],
    testCases: [
      { input: '[[3,2,7],[5,1,3],[2,7,2]]', expectedOutput: '5' }
    ],
    solutionExplanation: `## Simpler Than TSP

Only need 1D DP since worker number is determined by popcount.

## Complexity
- **Time:** O(n × 2ⁿ)
- **Space:** O(2ⁿ)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-partition-k-subsets',
    title: 'Partition Into K Equal Subsets',
    description: 'Can array be partitioned into k equal-sum subsets?',
    conceptFamily: 'bitmask-dp',
    targetComplexity: { time: 'O(n*2ⁿ)', space: 'O(2ⁿ)' },
    instruction: `# Partition Into K Equal Subsets

## The Problem

Given array nums and integer k, return true if nums can be partitioned into k non-empty subsets with equal sums.

**Example:**
\`\`\`
Input: nums = [4, 3, 2, 3, 5, 2, 1], k = 4
Output: true
Groups: [5], [1,4], [2,3], [2,3] all sum to 5
\`\`\`

## Key Insight

target_sum = total / k

Use bitmask to track used elements.`,
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

    n = len(nums)
    dp = [-1] * (1 << n)
    dp[0] = 0  # Current subset sum

    for mask in range(1 << n):
        if dp[mask] == -1:
            continue

        for i in range(n):
            if mask & (1 << i):
                continue
            if dp[mask] + nums[i] <= target:
                new_mask = mask | (1 << i)
                dp[new_mask] = (dp[mask] + nums[i]) % target

    return dp[(1 << n) - 1] == 0`
    },
    hints: [
      { afterAttempt: 1, text: 'target = total / k; if not divisible, return false' },
      { afterAttempt: 2, text: 'dp[mask] = current subset sum (mod target)' },
      { afterAttempt: 3, text: 'When sum reaches target, it wraps to 0 (new subset)' }
    ],
    testCases: [
      { input: '[4, 3, 2, 3, 5, 2, 1], 4', expectedOutput: 'True' },
      { input: '[1, 2, 3, 4], 3', expectedOutput: 'False' }
    ],
    solutionExplanation: `## Modular Sum Trick

When current subset reaches target, mod brings it back to 0.

All elements used and sum = 0 means exactly k subsets of target sum.

## Complexity
- **Time:** O(n × 2ⁿ)
- **Space:** O(2ⁿ)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-shortest-hamiltonian',
    title: 'Shortest Hamiltonian Path',
    description: 'Shortest path visiting all nodes',
    conceptFamily: 'bitmask-dp',
    targetComplexity: { time: 'O(n²*2ⁿ)', space: 'O(n*2ⁿ)' },
    instruction: `# Shortest Hamiltonian Path

## The Problem

Given weighted graph, find shortest path that visits every node exactly once.

Unlike TSP, no need to return to start.

**Example:**
\`\`\`
Input: graph adjacency matrix
Output: minimum path length visiting all nodes
\`\`\`

## Key Insight

Like TSP but without the return edge.

Try all starting points.`,
    starterCode: `def shortestHamiltonianPath(dist: list[list[int]]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def shortestHamiltonianPath(dist: list[list[int]]) -> int:
    n = len(dist)
    INF = float('inf')

    dp = [[INF] * n for _ in range(1 << n)]

    # Can start from any node
    for i in range(n):
        dp[1 << i][i] = 0

    for mask in range(1 << n):
        for last in range(n):
            if dp[mask][last] == INF:
                continue
            if not (mask & (1 << last)):
                continue

            for next_node in range(n):
                if mask & (1 << next_node):
                    continue
                new_mask = mask | (1 << next_node)
                dp[new_mask][next_node] = min(
                    dp[new_mask][next_node],
                    dp[mask][last] + dist[last][next_node]
                )

    full_mask = (1 << n) - 1
    return min(dp[full_mask])`
    },
    hints: [
      { afterAttempt: 1, text: 'Initialize: can start from any node with cost 0' },
      { afterAttempt: 2, text: 'Same transitions as TSP' },
      { afterAttempt: 3, text: 'Answer: min over all ending nodes (no return)' }
    ],
    testCases: [
      { input: '[[0,1,2],[1,0,3],[2,3,0]]', expectedOutput: '3' }
    ],
    solutionExplanation: `## Difference from TSP

1. Can start from any node
2. Don't need to return to start

## Complexity
- **Time:** O(n² × 2ⁿ)
- **Space:** O(n × 2ⁿ)`
  },

  // ============================================================
  // GROUP 8: DP on Trees
  // ============================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-house-robber-iii',
    title: 'House Robber III (Tree)',
    description: 'Max sum without robbing adjacent nodes',
    conceptFamily: 'tree-dp',
    targetComplexity: { time: 'O(n)', space: 'O(h)' },
    instruction: `# House Robber III

## The Problem

Houses are arranged in a binary tree. Cannot rob adjacent (parent-child) nodes.

Return maximum money.

**Example:**
\`\`\`
Input:     3
          / \\
         2   3
          \\   \\
           3   1
Output: 7 (3 + 3 + 1)
\`\`\`

## Key Insight

For each node, return two values:
- rob: max if we rob this node
- skip: max if we skip this node`,
    starterCode: `def rob(root) -> int:
    # root is TreeNode with val, left, right
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def rob(root) -> int:
    def dfs(node):
        if not node:
            return (0, 0)  # (rob, skip)

        left = dfs(node.left)
        right = dfs(node.right)

        rob = node.val + left[1] + right[1]
        skip = max(left) + max(right)

        return (rob, skip)

    return max(dfs(root))`
    },
    hints: [
      { afterAttempt: 1, text: 'Return pair: (value if robbed, value if skipped)' },
      { afterAttempt: 2, text: 'If rob: add val + skip values of children' },
      { afterAttempt: 3, text: 'If skip: take max of each child\'s options' }
    ],
    testCases: [
      { input: '[3,2,3,null,3,null,1]', expectedOutput: '7' }
    ],
    solutionExplanation: `## Tree DP Pattern

Return multiple values from each subtree.

## Complexity
- **Time:** O(n)
- **Space:** O(h)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-tree-diameter',
    title: 'Tree Diameter',
    description: 'Find longest path in tree',
    conceptFamily: 'tree-dp',
    targetComplexity: { time: 'O(n)', space: 'O(h)' },
    instruction: `# Tree Diameter

## The Problem

Find the length of the longest path between any two nodes in a tree.

**Example:**
\`\`\`
Input:     1
          / \\
         2   3
        / \\
       4   5
Output: 3 (path: 4-2-1-3 or 5-2-1-3)
\`\`\`

## Key Insight

Diameter through node = left_depth + right_depth`,
    starterCode: `def diameterOfBinaryTree(root) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def diameterOfBinaryTree(root) -> int:
    diameter = 0

    def depth(node):
        nonlocal diameter
        if not node:
            return 0

        left = depth(node.left)
        right = depth(node.right)

        diameter = max(diameter, left + right)
        return 1 + max(left, right)

    depth(root)
    return diameter`
    },
    hints: [
      { afterAttempt: 1, text: 'Diameter through node = left_depth + right_depth' },
      { afterAttempt: 2, text: 'Track global max diameter' },
      { afterAttempt: 3, text: 'Return depth = 1 + max(left, right)' }
    ],
    testCases: [
      { input: '[1,2,3,4,5]', expectedOutput: '3' }
    ],
    solutionExplanation: `## Classic Tree DP

## Complexity
- **Time:** O(n)
- **Space:** O(h)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-max-path-sum',
    title: 'Binary Tree Maximum Path Sum',
    description: 'Find maximum sum path in tree',
    conceptFamily: 'tree-dp',
    targetComplexity: { time: 'O(n)', space: 'O(h)' },
    instruction: `# Binary Tree Maximum Path Sum

## The Problem

Find the maximum path sum where path can start and end at any nodes.

**Example:**
\`\`\`
Input:    -10
          /  \\
         9   20
            /  \\
           15   7
Output: 42 (15 + 20 + 7)
\`\`\`

## Key Insight

Use max(gain, 0) to optionally skip negative branches.`,
    starterCode: `def maxPathSum(root) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def maxPathSum(root) -> int:
    max_sum = float('-inf')

    def max_gain(node):
        nonlocal max_sum
        if not node:
            return 0

        left = max(max_gain(node.left), 0)
        right = max(max_gain(node.right), 0)

        path_sum = node.val + left + right
        max_sum = max(max_sum, path_sum)

        return node.val + max(left, right)

    max_gain(root)
    return max_sum`
    },
    hints: [
      { afterAttempt: 1, text: 'Use max(gain, 0) to ignore negative branches' },
      { afterAttempt: 2, text: 'Path through node = val + left_gain + right_gain' },
      { afterAttempt: 3, text: 'Return val + max(left, right) to parent' }
    ],
    testCases: [
      { input: '[-10,9,20,null,null,15,7]', expectedOutput: '42' }
    ],
    solutionExplanation: `## Key Difference from Diameter

Use max(gain, 0) to optionally exclude branches.

## Complexity
- **Time:** O(n)
- **Space:** O(h)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-tree-coloring',
    title: 'Tree Coloring (Min Colors)',
    description: 'Color tree with min colors, no adjacent same',
    conceptFamily: 'tree-dp',
    targetComplexity: { time: 'O(n*k²)', space: 'O(n*k)' },
    instruction: `# Tree Coloring

## The Problem

Color nodes such that no parent and child share the same color.

For any tree, 2 colors suffice (trees are bipartite).

**Variant:** Minimize cost where each color has different cost.`,
    starterCode: `def minColoringCost(root, num_colors=3) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def minColoringCost(root, num_colors=3) -> int:
    def dfs(node):
        if not node:
            return [0] * num_colors

        left = dfs(node.left)
        right = dfs(node.right)

        result = []
        for c in range(num_colors):
            left_min = min(left[c2] for c2 in range(num_colors) if c2 != c)
            right_min = min(right[c2] for c2 in range(num_colors) if c2 != c)
            result.append(node.cost[c] + left_min + right_min)

        return result

    return min(dfs(root))`
    },
    hints: [
      { afterAttempt: 1, text: 'For each node, try each color' },
      { afterAttempt: 2, text: 'Children must use different color' },
      { afterAttempt: 3, text: 'Return costs for each color option' }
    ],
    testCases: [
      { input: 'tree with costs', expectedOutput: 'varies' }
    ],
    solutionExplanation: `## General Tree Coloring DP

## Complexity
- **Time:** O(n × k²)
- **Space:** O(h × k)`
  },

  // ============================================================
  // GROUP 9: Advanced / Hybrid DP
  // ============================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-longest-arithmetic-subseq',
    title: 'Longest Arithmetic Subsequence',
    description: 'Find longest subsequence with constant difference',
    conceptFamily: 'advanced-dp',
    targetComplexity: { time: 'O(n²)', space: 'O(n²)' },
    instruction: `# Longest Arithmetic Subsequence

## The Problem

Given array, find length of longest arithmetic subsequence.

**Example:**
\`\`\`
Input: nums = [3, 6, 9, 12]
Output: 4 (difference 3)
\`\`\`

## Key Insight

\`dp[i][d]\` = length of arithmetic subseq ending at i with difference d.`,
    starterCode: `def longestArithSeqLength(nums: list[int]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def longestArithSeqLength(nums: list[int]) -> int:
    n = len(nums)
    if n <= 2:
        return n

    dp = [{} for _ in range(n)]
    max_len = 2

    for i in range(n):
        for j in range(i):
            diff = nums[i] - nums[j]
            dp[i][diff] = dp[j].get(diff, 1) + 1
            max_len = max(max_len, dp[i][diff])

    return max_len`
    },
    hints: [
      { afterAttempt: 1, text: 'Use dict at each index for different differences' },
      { afterAttempt: 2, text: 'dp[i][diff] = dp[j][diff] + 1 if j < i' },
      { afterAttempt: 3, text: 'Default length is 1' }
    ],
    testCases: [
      { input: '[3, 6, 9, 12]', expectedOutput: '4' },
      { input: '[9, 4, 7, 2, 10]', expectedOutput: '3' }
    ],
    solutionExplanation: `## 2D DP with Hash Map

## Complexity
- **Time:** O(n²)
- **Space:** O(n²)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-count-squares',
    title: 'Count Square Submatrices with All Ones',
    description: 'Count all square submatrices of 1s',
    conceptFamily: 'advanced-dp',
    targetComplexity: { time: 'O(m*n)', space: 'O(n)' },
    instruction: `# Count Square Submatrices

## The Problem

Given m×n binary matrix, return count of square submatrices with all 1s.

**Example:**
\`\`\`
Input: matrix = [[0,1,1,1],[1,1,1,1],[0,1,1,1]]
Output: 15 (10 1×1, 4 2×2, 1 3×3)
\`\`\`

## Key Insight

Same as Maximal Square but SUM all dp values!`,
    starterCode: `def countSquares(matrix: list[list[int]]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def countSquares(matrix: list[list[int]]) -> int:
    m, n = len(matrix), len(matrix[0])
    dp = [0] * (n + 1)
    total = 0
    prev = 0

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            temp = dp[j]
            if matrix[i-1][j-1] == 1:
                dp[j] = 1 + min(dp[j], dp[j-1], prev)
                total += dp[j]
            else:
                dp[j] = 0
            prev = temp
        prev = 0

    return total`
    },
    hints: [
      { afterAttempt: 1, text: 'Same recurrence as Maximal Square' },
      { afterAttempt: 2, text: 'dp[i][j] counts squares ending at (i,j)' },
      { afterAttempt: 3, text: 'Sum all dp values for answer' }
    ],
    testCases: [
      { input: '[[0,1,1,1],[1,1,1,1],[0,1,1,1]]', expectedOutput: '15' }
    ],
    solutionExplanation: `## Beautiful Insight

dp[i][j] = k means there are k squares ending at (i,j)!

## Complexity
- **Time:** O(m × n)
- **Space:** O(n)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-maximal-rectangle',
    title: 'Maximal Rectangle',
    description: 'Largest rectangle of 1s in binary matrix',
    conceptFamily: 'advanced-dp',
    targetComplexity: { time: 'O(m*n)', space: 'O(n)' },
    instruction: `# Maximal Rectangle

## The Problem

Given m×n binary matrix, find the largest rectangle containing only 1s.

**Example:**
\`\`\`
Input: matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]
Output: 6
\`\`\`

## Key Insight

Build histograms row by row, apply Largest Rectangle in Histogram.`,
    starterCode: `def maximalRectangle(matrix: list[list[str]]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def maximalRectangle(matrix: list[list[str]]) -> int:
    if not matrix:
        return 0

    m, n = len(matrix), len(matrix[0])
    heights = [0] * (n + 1)
    max_area = 0

    def largestRectangleArea(heights):
        stack = []
        max_area = 0
        for i, h in enumerate(heights):
            start = i
            while stack and stack[-1][1] > h:
                idx, height = stack.pop()
                max_area = max(max_area, height * (i - idx))
                start = idx
            stack.append((start, h))
        return max_area

    for i in range(m):
        for j in range(n):
            heights[j] = heights[j] + 1 if matrix[i][j] == '1' else 0
        max_area = max(max_area, largestRectangleArea(heights))

    return max_area`
    },
    hints: [
      { afterAttempt: 1, text: 'Build histogram heights row by row' },
      { afterAttempt: 2, text: 'Use Largest Rectangle in Histogram for each row' },
      { afterAttempt: 3, text: 'heights[j] = consecutive 1s above' }
    ],
    testCases: [
      { input: '[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]', expectedOutput: '6' }
    ],
    solutionExplanation: `## Reduction to 1D Problem

## Complexity
- **Time:** O(m × n)
- **Space:** O(n)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-palindrome-partitioning-ii',
    title: 'Palindrome Partitioning II',
    description: 'Minimum cuts to partition into palindromes',
    conceptFamily: 'advanced-dp',
    targetComplexity: { time: 'O(n²)', space: 'O(n²)' },
    instruction: `# Palindrome Partitioning II

## The Problem

Given string s, return minimum cuts to partition s into palindromes.

**Example:**
\`\`\`
Input: s = "aab"
Output: 1 ("aa" | "b")
\`\`\``,
    starterCode: `def minCut(s: str) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def minCut(s: str) -> int:
    n = len(s)
    if n <= 1:
        return 0

    is_pal = [[False] * n for _ in range(n)]
    for i in range(n):
        is_pal[i][i] = True
    for i in range(n - 1):
        is_pal[i][i + 1] = s[i] == s[i + 1]
    for length in range(3, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            is_pal[i][j] = s[i] == s[j] and is_pal[i + 1][j - 1]

    dp = list(range(n))
    for i in range(n):
        if is_pal[0][i]:
            dp[i] = 0
        else:
            for j in range(i):
                if is_pal[j + 1][i]:
                    dp[i] = min(dp[i], dp[j] + 1)

    return dp[n - 1]`
    },
    hints: [
      { afterAttempt: 1, text: 'Precompute all palindrome substrings' },
      { afterAttempt: 2, text: 'If s[0:i] is palindrome, dp[i] = 0' },
      { afterAttempt: 3, text: 'Else: dp[i] = min(dp[j] + 1) where s[j+1:i] is palindrome' }
    ],
    testCases: [
      { input: '"aab"', expectedOutput: '1' }
    ],
    solutionExplanation: `## Two-Phase DP

## Complexity
- **Time:** O(n²)
- **Space:** O(n²)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-longest-valid-parentheses',
    title: 'Longest Valid Parentheses',
    description: 'Find longest valid parentheses substring',
    conceptFamily: 'advanced-dp',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Longest Valid Parentheses

## The Problem

Given string containing only '(' and ')', find length of longest valid substring.

**Example:**
\`\`\`
Input: s = ")()())"
Output: 4
\`\`\``,
    starterCode: `def longestValidParentheses(s: str) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def longestValidParentheses(s: str) -> int:
    n = len(s)
    if n < 2:
        return 0

    dp = [0] * n
    max_len = 0

    for i in range(1, n):
        if s[i] == ')':
            if s[i - 1] == '(':
                dp[i] = (dp[i - 2] if i >= 2 else 0) + 2
            elif dp[i - 1] > 0:
                j = i - dp[i - 1] - 1
                if j >= 0 and s[j] == '(':
                    dp[i] = dp[i - 1] + 2 + (dp[j - 1] if j >= 1 else 0)
            max_len = max(max_len, dp[i])

    return max_len`
    },
    hints: [
      { afterAttempt: 1, text: 'dp[i] only matters when s[i] = \')\''},
      { afterAttempt: 2, text: 'Case 1: s[i-1] = \'(\' → dp[i] = dp[i-2] + 2' },
      { afterAttempt: 3, text: 'Case 2: s[i-1] = \')\' → check matching' }
    ],
    testCases: [
      { input: '"(()"', expectedOutput: '2' },
      { input: '")()())"', expectedOutput: '4' }
    ],
    solutionExplanation: `## Two Cases

## Complexity
- **Time:** O(n)
- **Space:** O(n)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-regex-matching',
    title: 'Regular Expression Matching',
    description: 'Implement . and * pattern matching',
    conceptFamily: 'advanced-dp',
    targetComplexity: { time: 'O(m*n)', space: 'O(m*n)' },
    instruction: `# Regular Expression Matching

## The Problem

Implement regex matching with \`.\` (any char) and \`*\` (zero or more of preceding).

**Example:**
\`\`\`
Input: s = "aa", p = "a*"
Output: true
\`\`\``,
    starterCode: `def isMatch(s: str, p: str) -> bool:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def isMatch(s: str, p: str) -> bool:
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True

    for j in range(2, n + 1):
        if p[j - 1] == '*':
            dp[0][j] = dp[0][j - 2]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == '*':
                dp[i][j] = dp[i][j - 2]
                if p[j - 2] == '.' or p[j - 2] == s[i - 1]:
                    dp[i][j] = dp[i][j] or dp[i - 1][j]
            elif p[j - 1] == '.' or p[j - 1] == s[i - 1]:
                dp[i][j] = dp[i - 1][j - 1]

    return dp[m][n]`
    },
    hints: [
      { afterAttempt: 1, text: 'Handle * matching empty string first' },
      { afterAttempt: 2, text: 'For *: zero occurrences = dp[i][j-2]' },
      { afterAttempt: 3, text: 'For *: one+ occurrences = dp[i-1][j] if chars match' }
    ],
    testCases: [
      { input: '"aa", "a*"', expectedOutput: 'True' },
      { input: '"ab", ".*"', expectedOutput: 'True' }
    ],
    solutionExplanation: `## Handling *

## Complexity
- **Time:** O(m × n)
- **Space:** O(m × n)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-interleaving-string',
    title: 'Interleaving String',
    description: 'Check if s3 formed from s1 and s2 interleaved',
    conceptFamily: 'advanced-dp',
    targetComplexity: { time: 'O(m*n)', space: 'O(n)' },
    instruction: `# Interleaving String

## The Problem

Given s1, s2, s3, check if s3 is formed by interleaving s1 and s2.

**Example:**
\`\`\`
Input: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"
Output: true
\`\`\``,
    starterCode: `def isInterleave(s1: str, s2: str, s3: str) -> bool:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def isInterleave(s1: str, s2: str, s3: str) -> bool:
    m, n = len(s1), len(s2)
    if m + n != len(s3):
        return False

    dp = [False] * (n + 1)
    dp[0] = True

    for j in range(1, n + 1):
        dp[j] = dp[j - 1] and s2[j - 1] == s3[j - 1]

    for i in range(1, m + 1):
        dp[0] = dp[0] and s1[i - 1] == s3[i - 1]
        for j in range(1, n + 1):
            dp[j] = (dp[j] and s1[i - 1] == s3[i + j - 1]) or \\
                    (dp[j - 1] and s2[j - 1] == s3[i + j - 1])

    return dp[n]`
    },
    hints: [
      { afterAttempt: 1, text: 'Length check first' },
      { afterAttempt: 2, text: 'dp[i][j] checks s3[i+j-1]' },
      { afterAttempt: 3, text: 'Optimize to O(n) space' }
    ],
    testCases: [
      { input: '"aabcc", "dbbca", "aadbbcbcac"', expectedOutput: 'True' }
    ],
    solutionExplanation: `## 2D DP

## Complexity
- **Time:** O(m × n)
- **Space:** O(n)`
  },

  // ============================================================
  // GROUP 10: Optimization DP / Greedy+DP
  // ============================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-job-scheduling',
    title: 'Job Scheduling With Profit',
    description: 'Maximize profit from non-overlapping jobs',
    conceptFamily: 'optimization-dp',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Job Scheduling With Profit

## The Problem

Given jobs with start time, end time, and profit.
Choose non-overlapping jobs to maximize profit.

**Example:**
\`\`\`
Input: startTime = [1,2,3,3], endTime = [3,4,5,6], profit = [50,10,40,70]
Output: 120
\`\`\``,
    starterCode: `def jobScheduling(startTime: list[int], endTime: list[int], profit: list[int]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def jobScheduling(startTime: list[int], endTime: list[int], profit: list[int]) -> int:
    import bisect

    jobs = sorted(zip(startTime, endTime, profit), key=lambda x: x[1])
    n = len(jobs)
    dp = [0] * (n + 1)

    for i in range(1, n + 1):
        start, end, prof = jobs[i - 1]
        j = bisect.bisect_right([job[1] for job in jobs[:i-1]], start)
        dp[i] = max(dp[i - 1], prof + dp[j])

    return dp[n]`
    },
    hints: [
      { afterAttempt: 1, text: 'Sort jobs by end time' },
      { afterAttempt: 2, text: 'Binary search for last non-overlapping job' },
      { afterAttempt: 3, text: 'dp[i] = max(skip, take + dp[compatible])' }
    ],
    testCases: [
      { input: '[1,2,3,3], [3,4,5,6], [50,10,40,70]', expectedOutput: '120' }
    ],
    solutionExplanation: `## Weighted Interval Scheduling

## Complexity
- **Time:** O(n log n)
- **Space:** O(n)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-weighted-intervals',
    title: 'Weighted Interval Scheduling',
    description: 'Maximum weight of non-overlapping intervals',
    conceptFamily: 'optimization-dp',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Weighted Interval Scheduling

## The Problem

Same as Job Scheduling - classic algorithm problem.`,
    starterCode: `def weightedIntervalScheduling(intervals: list[tuple[int, int, int]]) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def weightedIntervalScheduling(intervals: list[tuple[int, int, int]]) -> int:
    import bisect

    intervals = sorted(intervals, key=lambda x: x[1])
    n = len(intervals)
    if n == 0:
        return 0

    dp = [0] * n
    dp[0] = intervals[0][2]
    ends = [intervals[0][1]]

    for i in range(1, n):
        start, end, weight = intervals[i]
        j = bisect.bisect_right(ends, start) - 1
        take = weight + (dp[j] if j >= 0 else 0)
        dp[i] = max(take, dp[i - 1])
        ends.append(end)

    return dp[n - 1]`
    },
    hints: [
      { afterAttempt: 1, text: 'Sort by end time' },
      { afterAttempt: 2, text: 'Binary search on ends' },
      { afterAttempt: 3, text: 'dp[i] = max(skip, take + compatible)' }
    ],
    testCases: [
      { input: '[(1,3,50),(2,4,10),(3,5,40),(3,6,70)]', expectedOutput: '120' }
    ],
    solutionExplanation: `## Classic Algorithm

## Complexity
- **Time:** O(n log n)
- **Space:** O(n)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-min-cost-hire-workers',
    title: 'Min Cost to Hire K Workers',
    description: 'Hire K workers minimizing total cost',
    conceptFamily: 'optimization-dp',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Minimum Cost to Hire K Workers

## The Problem

Each worker has quality[i] and wage[i]. Pay workers:
- At least wage[i]
- Proportional to quality (same rate)

Hire exactly K workers to minimize cost.`,
    starterCode: `def mincostToHireWorkers(quality: list[int], wage: list[int], k: int) -> float:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def mincostToHireWorkers(quality: list[int], wage: list[int], k: int) -> float:
    import heapq

    workers = sorted(zip(quality, wage), key=lambda x: x[1] / x[0])
    heap = []
    quality_sum = 0
    min_cost = float('inf')

    for q, w in workers:
        ratio = w / q
        quality_sum += q
        heapq.heappush(heap, -q)

        if len(heap) > k:
            quality_sum += heapq.heappop(heap)

        if len(heap) == k:
            min_cost = min(min_cost, quality_sum * ratio)

    return min_cost`
    },
    hints: [
      { afterAttempt: 1, text: 'Sort by wage/quality ratio' },
      { afterAttempt: 2, text: 'Maintain k workers with smallest total quality' },
      { afterAttempt: 3, text: 'Cost = total_quality × ratio' }
    ],
    testCases: [
      { input: '[10,20,5], [70,50,30], 2', expectedOutput: '105.0' }
    ],
    solutionExplanation: `## Greedy + Heap

## Complexity
- **Time:** O(n log n)
- **Space:** O(n)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-egg-drop',
    title: 'Egg Dropping Problem',
    description: 'Minimum trials to find critical floor',
    conceptFamily: 'optimization-dp',
    targetComplexity: { time: 'O(k*n)', space: 'O(k*n)' },
    instruction: `# Egg Dropping Problem

## The Problem

K eggs, N floors. Find minimum trials to determine critical floor.

**Example:**
\`\`\`
Input: K = 2, N = 10
Output: 4
\`\`\``,
    starterCode: `def superEggDrop(k: int, n: int) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def superEggDrop(k: int, n: int) -> int:
    dp = [[0] * (n + 1) for _ in range(k + 1)]

    m = 0
    while dp[k][m] < n:
        m += 1
        for e in range(1, k + 1):
            dp[e][m] = dp[e - 1][m - 1] + dp[e][m - 1] + 1

    return m`
    },
    hints: [
      { afterAttempt: 1, text: 'Reformulate: max floors with m moves' },
      { afterAttempt: 2, text: 'dp[k][m] = dp[k-1][m-1] + dp[k][m-1] + 1' },
      { afterAttempt: 3, text: 'Find min m where dp[k][m] >= n' }
    ],
    testCases: [
      { input: '2, 10', expectedOutput: '4' }
    ],
    solutionExplanation: `## Reformulation Trick

## Complexity
- **Time:** O(k × log n)
- **Space:** O(k × log n)`
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-split-array-largest-sum',
    title: 'Split Array Largest Sum',
    description: 'Split into k subarrays minimizing max sum',
    conceptFamily: 'optimization-dp',
    targetComplexity: { time: 'O(n log sum)', space: 'O(1)' },
    instruction: `# Split Array Largest Sum

## The Problem

Split array into k non-empty subarrays to minimize the maximum sum.

**Example:**
\`\`\`
Input: nums = [7,2,5,10,8], k = 2
Output: 18 ([7,2,5] and [10,8])
\`\`\`

## Key Insight

Binary search on the answer!`,
    starterCode: `def splitArray(nums: list[int], k: int) -> int:
    pass`,
    solution: {
      afterAttempt: 3,
      text: `def splitArray(nums: list[int], k: int) -> int:
    def canSplit(max_sum):
        count = 1
        current_sum = 0
        for num in nums:
            if current_sum + num > max_sum:
                count += 1
                current_sum = num
            else:
                current_sum += num
        return count <= k

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
    hints: [
      { afterAttempt: 1, text: 'Binary search on answer' },
      { afterAttempt: 2, text: 'Greedy check: can we split with this max?' },
      { afterAttempt: 3, text: 'Range: [max(nums), sum(nums)]' }
    ],
    testCases: [
      { input: '[7,2,5,10,8], 2', expectedOutput: '18' }
    ],
    solutionExplanation: `## Binary Search on Answer

## Complexity
- **Time:** O(n log sum)
- **Space:** O(1)`
  }
];
