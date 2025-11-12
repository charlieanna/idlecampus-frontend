# DYNAMIC-PROGRAMMING Problems

Total Problems: 38

---

## 1. Fibonacci Number

**Difficulty:** easy
**Concept:** dynamic-programming
**Family:** dp:linear-fibonacci

### Description

The Fibonacci numbers form a sequence where each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n). This is the perfect introduction to memoization - draw the recursion tree to see why naive recursion is slow, then add memoization to make it fast.

### Examples

**Example 1:**
- Input: n = 4
- Output: 3
- Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3

**Example 2:**
- Input: n = 10
- Output: 55
- Explanation: F(10) = 55

### Constraints

- 0 <= n <= 30

### Hints

1. Draw the recursion tree for F(5). Notice how many times F(3), F(2), F(1), and F(0) are computed. This is why the naive solution is O(2^n).
2. Add a memo dictionary. Before computing F(n), check if it's already in the memo. After computing it, store it in the memo before returning.
3. With memoization, each F(i) is computed only once. The time complexity becomes O(n) and space is O(n) for the memo.
4. Bottom-up alternative: Instead of top-down recursion with memo, you can build up from F(0) and F(1) iteratively in an array.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n) with memoization
- **Space Complexity:** O(n) for recursion stack and memo

### Test Cases

**Test 1:** Base case F(0)
- Input: "0"
- Expected: "0"

**Test 2:** Base case F(1)
- Input: "1"
- Expected: "1"

**Test 3:** F(2) = F(1) + F(0)
- Input: "2"
- Expected: "1"

**Test 4:** F(5) = 5
- Input: "5"
- Expected: "5"

**Test 5:** Larger input
- Input: "10"
- Expected: "55"

**Test 6:** PERFORMANCE: F(35) - Must use memoization, not naive O(2^n) recursion
- Input: "35"
- Expected: "9227465"

---

## 2. Climbing Stairs

**Difficulty:** easy
**Concept:** dynamic-programming
**Family:** dp:linear-stairs

### Description

You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top? Draw the decision tree to understand the recursive structure.

### Examples

**Example 1:**
- Input: n = 3
- Output: 3
- Explanation: Three ways: 1+1+1, 1+2, 2+1

**Example 2:**
- Input: n = 5
- Output: 8
- Explanation: Eight distinct ways to reach step 5

### Constraints

- 1 <= n <= 45

### Hints

1. Identify the recurrence. To reach stair n, you could have taken 1 step from stair n-1, or 2 steps from stair n-2. So ways(n) = ways(n-1) + ways(n-2).
2. Draw the tree for n=5. You'll see repeated subproblems like ways(3), ways(2), etc. This is why you need memoization.
3. Base cases: ways(0) = 1 (one way to stay at ground), ways(1) = 1 (one way to reach first stair).
4. Implement with top-down (recursion + memo) or bottom-up (iterative array). Both are O(n) time and O(n) space. Can optimize space to O(1) by keeping only the last two values.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n) with memo, O(1) space-optimized

### Test Cases

**Test 1:** Only one way: 1 step
- Input: "1"
- Expected: "1"

**Test 2:** Two ways: 1+1 or 2
- Input: "2"
- Expected: "2"

**Test 3:** Three ways
- Input: "3"
- Expected: "3"

**Test 4:** Eight ways
- Input: "5"
- Expected: "8"

**Test 5:** Larger input
- Input: "10"
- Expected: "89"

**Test 6:** PERFORMANCE: 40 stairs - Must use O(n) DP with memoization or iteration
- Input: "40"
- Expected: "165580141"

---

## 3. Tribonacci Number

**Difficulty:** medium
**Concept:** dynamic-programming
**Family:** dp:linear-tribonacci

### Description

The Tribonacci sequence Tn is defined as: T(0) = 0, T(1) = 1, T(2) = 1, and T(n) = T(n-1) + T(n-2) + T(n-3) for n >= 3. Given n, return the value of T(n). This extends Fibonacci to three recursive calls - draw the tree to see the explosion of repeated work.

### Examples

**Example 1:**
- Input: n = 4
- Output: 4
- Explanation: T(4) = T(3) + T(2) + T(1) = 2 + 1 + 1 = 4

**Example 2:**
- Input: n = 25
- Output: 1389537
- Explanation: T(25) = 1389537

### Constraints

- 0 <= n <= 37

### Hints

1. Three recursive calls. Unlike Fibonacci with two calls, Tribonacci makes three: T(n-1), T(n-2), and T(n-3). The tree grows even faster without memoization.
2. Base cases: T(0) = 0, T(1) = 1, T(2) = 1. Make sure to handle all three base cases.
3. Memoization pattern is the same. Use a dictionary to cache results. Without memo, time is O(3^n). With memo, it's O(n).
4. Space optimization: Can use three variables instead of an array to achieve O(1) space while iterating.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n) with memoization
- **Space Complexity:** O(n) for memo

### Test Cases

**Test 1:** Base case T(0)
- Input: "0"
- Expected: "0"

**Test 2:** Base case T(1)
- Input: "1"
- Expected: "1"

**Test 3:** Base case T(2)
- Input: "2"
- Expected: "1"

**Test 4:** T(4) = 2+1+1
- Input: "4"
- Expected: "4"

**Test 5:** T(10) = 149
- Input: "10"
- Expected: "149"

**Test 6:** Larger input
- Input: "25"
- Expected: "1389537"

---

## 4. House Robber

**Difficulty:** medium
**Concept:** dynamic-programming
**Family:** dp:house-robber-1d

### Description

You are a professional robber planning to rob houses along a street. Each house has a certain amount of money. However, adjacent houses have security systems connected - you cannot rob two adjacent houses. Given an array nums representing the amount of money in each house, return the maximum amount you can rob without alerting the police. Draw the decision tree: at each house, you decide to rob it or skip it.

### Examples

**Example 1:**
- Input: nums = [1,2,3,1]
- Output: 4
- Explanation: Rob house 1 (money = 1) and house 3 (money = 3). Total = 4.

**Example 2:**
- Input: nums = [2,7,9,3,1]
- Output: 12
- Explanation: Rob house 1 (money = 2), house 3 (money = 9), and house 5 (money = 1). Total = 12.

### Constraints

- 1 <= nums.length <= 100
- 0 <= nums[i] <= 400

### Hints

1. Decision at each house. At house i, you choose: rob it (get nums[i] + dp[i-2]) or skip it (get dp[i-1]). Take the maximum of these two options.
2. Define dp[i] = maximum money you can rob from houses 0 to i. The recurrence is: dp[i] = max(dp[i-1], nums[i] + dp[i-2]).
3. Base cases: dp[0] = nums[0] (rob the first house), dp[1] = max(nums[0], nums[1]) (choose the better of first two houses).
4. Space optimization: You only need the last two values (dp[i-1] and dp[i-2]), so you can use two variables instead of an array for O(1) space.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n) or O(1) with space optimization

### Test Cases

**Test 1:** Rob houses 0 and 2
- Input: "[1,2,3,1]"
- Expected: "4"

**Test 2:** Rob houses 0, 2, and 4
- Input: "[2,7,9,3,1]"
- Expected: "12"

**Test 3:** Rob houses 0 and 3
- Input: "[5,3,4,11,2]"
- Expected: "16"

**Test 4:** Single house
- Input: "[1]"
- Expected: "1"

**Test 5:** Rob houses 0 and 3
- Input: "[2,1,1,2]"
- Expected: "4"

**Test 6:** PERFORMANCE: 10K houses - Must use O(n) DP, not exponential recursion
- Input: "list(range(1, 10001))"
- Expected: "25005000"

---

## 5. Min Cost Climbing Stairs

**Difficulty:** easy
**Concept:** dynamic-programming
**Family:** dp:linear-stairs

### Description

You are given an integer array cost where cost[i] is the cost of the ith step on a staircase. Once you pay the cost, you can either climb one or two steps. You can start from step 0 or step 1. Return the minimum cost to reach the top of the floor. Draw the tree to visualize the choices at each step.

### Examples

**Example 1:**
- Input: cost = [10,15,20]
- Output: 15
- Explanation: Start at index 1, pay 15, and climb two steps to reach the top.

**Example 2:**
- Input: cost = [1,100,1,1,1,100,1,1,100,1]
- Output: 6
- Explanation: Start at index 0, pay 1, climb two steps to index 2, pay 1, climb two steps to index 4, pay 1, climb two steps to index 6, pay 1, climb one step to index 7, pay 1, climb two steps to index 9, pay 1, climb one step to the top.

### Constraints

- 2 <= cost.length <= 1000
- 0 <= cost[i] <= 999

### Hints

1. Think backwards. What's the minimum cost to reach the top (position n)? It's either from step n-1 or n-2. So minCost(top) = min(minCost(n-1) + cost[n-1], minCost(n-2) + cost[n-2]).
2. Define dp[i] as the minimum cost to reach step i. The recurrence is: dp[i] = cost[i] + min(dp[i-1], dp[i-2]).
3. Base cases: You can start at step 0 or 1 for free, so dp[0] = cost[0] and dp[1] = cost[1].
4. The answer is min(dp[n-1], dp[n-2]) because you can reach the top from either of the last two steps.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n) or O(1) with space optimization

### Test Cases

**Test 1:** Start at 1, climb to top
- Input: "[10,15,20]"
- Expected: "15"

**Test 2:** Skip expensive steps
- Input: "[1,100,1,1,1,100,1,1,100,1]"
- Expected: "6"

**Test 3:** Free steps until the end
- Input: "[0,0,0,1]"
- Expected: "0"

**Test 4:** Start at 0, jump by 2
- Input: "[0,1,2,2]"
- Expected: "2"

---

## 6. Decode Ways

**Difficulty:** medium
**Concept:** dynamic-programming
**Family:** dp:decode-ways

### Description

A message containing letters from A-Z can be encoded into numbers using the mapping 'A' -> '1', 'B' -> '2', ..., 'Z' -> '26'. Given a string s containing only digits, return the number of ways to decode it. For example, '11106' can be decoded as 'AAJF' (1 1 10 6) or 'KJF' (11 10 6).

### Examples

**Example 1:**
- Input: s = '12'
- Output: 2
- Explanation: It could be decoded as 'AB' (1 2) or 'L' (12).

**Example 2:**
- Input: s = '226'
- Output: 3
- Explanation: Could be 'BZ' (2 26), 'VF' (22 6), or 'BBF' (2 2 6).

**Example 3:**
- Input: s = '06'
- Output: 0
- Explanation: '06' cannot be mapped to 'F' since '6' is different from '06'.

### Constraints

- 1 <= s.length <= 100
- s contains only digits and may contain leading zero(s)

### Hints

1. DP state definition. Let dp[i] = number of ways to decode s[0:i]. You want dp[n] where n = len(s).
2. Single digit check. If s[i-1] is '1'-'9', you can decode it alone: add dp[i-1] to dp[i].
3. Two digit check. If s[i-2:i] forms '10'-'26', you can decode it as a pair: add dp[i-2] to dp[i].
4. Handle zeros carefully. '0' cannot stand alone. It must be part of '10' or '20'. Check for invalid cases like '00', '30', etc.
5. Base cases: dp[0] = 1 (empty string has one way), dp[1] = 1 if s[0] is '1'-'9', else 0.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n) or O(1) with space optimization

### Test Cases

**Test 1:** Two decodings: AB or L
- Input: "'12'"
- Expected: "2"

**Test 2:** Three decodings
- Input: "'226'"
- Expected: "3"

**Test 3:** Invalid: starts with 0
- Input: "'0'"
- Expected: "0"

**Test 4:** Invalid: 0 cannot stand alone
- Input: "'06'"
- Expected: "0"

**Test 5:** Multiple valid decodings
- Input: "'11106'"
- Expected: "2"

**Test 6:** Only one way: 2,7
- Input: "'27'"
- Expected: "1"

---

## 7. Word Break

**Difficulty:** medium
**Concept:** dynamic-programming

### Description

Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words. The same word in the dictionary may be reused multiple times in the segmentation.

### Examples

**Example 1:**
- Input: s = 'leetcode', wordDict = ['leet','code']
- Output: true
- Explanation: Return true because 'leetcode' can be segmented as 'leet code'.

**Example 2:**
- Input: s = 'applepenapple', wordDict = ['apple','pen']
- Output: true
- Explanation: Return true because 'applepenapple' can be segmented as 'apple pen apple'. Note that you can reuse 'apple'.

**Example 3:**
- Input: s = 'catsandog', wordDict = ['cats','dog','sand','and','cat']
- Output: false
- Explanation: Cannot be segmented into dictionary words.

### Constraints

- 1 <= s.length <= 300
- 1 <= wordDict.length <= 1000
- 1 <= wordDict[i].length <= 20

### Hints

1. DP state: dp[i] = true if s[0:i] can be segmented into dict words. Want dp[n] where n = len(s).
2. Recurrence: For each position i, try all positions j < i. If dp[j] is true AND s[j:i] is in wordDict, then dp[i] = true.
3. Use a set for wordDict to get O(1) lookup. Convert wordDict to a set at the start.
4. Base case: dp[0] = true (empty string is always valid).
5. Optimization: For each i, you only need to check j values where (i - j) matches the length of some word in the dictionary.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n^2 * m) where m is max word length
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** leet + code
- Input: "('leetcode', ['leet','code'])"
- Expected: "true"

**Test 2:** apple + pen + apple
- Input: "('applepenapple', ['apple','pen'])"
- Expected: "true"

**Test 3:** Cannot be segmented
- Input: "('catsandog', ['cats','dog','sand','and','cat'])"
- Expected: "false"

**Test 4:** Single character
- Input: "('a', ['a'])"
- Expected: "true"

**Test 5:** b + b
- Input: "('bb', ['a','b','bbb','bbbb'])"
- Expected: "true"

---

## 8. Coin Change

**Difficulty:** medium
**Concept:** dynamic-programming
**Family:** dp:coin-change-min

### Description

You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins needed to make up that amount. If that amount cannot be made up by any combination of the coins, return -1. You may assume you have an infinite number of each kind of coin.

### Examples

**Example 1:**
- Input: coins = [1,2,5], amount = 11
- Output: 3
- Explanation: 11 = 5 + 5 + 1

**Example 2:**
- Input: coins = [2], amount = 3
- Output: -1
- Explanation: Cannot make 3 with only 2-value coins

**Example 3:**
- Input: coins = [1], amount = 0
- Output: 0
- Explanation: Zero coins needed for amount 0

### Constraints

- 1 <= coins.length <= 12
- 1 <= coins[i] <= 2^31 - 1
- 0 <= amount <= 10^4

### Hints

1. DP state: dp[i] = minimum coins needed to make amount i. Initialize all to infinity except dp[0] = 0.
2. Recurrence: For each amount i and each coin c, if c <= i, then dp[i] = min(dp[i], dp[i-c] + 1).
3. Bottom-up approach: Build dp array from 0 to amount. For each amount, try all coins.
4. Check impossibility: If dp[amount] is still infinity after computation, return -1.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(amount * n) where n is number of coins
- **Space Complexity:** O(amount)

### Test Cases

**Test 1:** 5+5+1
- Input: "([1,2,5], 11)"
- Expected: "3"

**Test 2:** Impossible
- Input: "([2], 3)"
- Expected: "-1"

**Test 3:** Zero amount
- Input: "([1], 0)"
- Expected: "0"

**Test 4:** 3+4 or choose wisely
- Input: "([1,3,4,5], 7)"
- Expected: "2"

**Test 5:** Large amount
- Input: "([186,419,83,408], 6249)"
- Expected: "20"

---

## 9. Coin Change 2 (Combinations)

**Difficulty:** medium
**Concept:** dynamic-programming
**Family:** dp:coin-change-ways

### Description

You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the number of combinations that make up that amount. If that amount cannot be made up, return 0. You may assume you have an infinite number of each kind of coin.

### Examples

**Example 1:**
- Input: amount = 5, coins = [1,2,5]
- Output: 4
- Explanation: There are four ways: 5, 2+2+1, 2+1+1+1, 1+1+1+1+1

**Example 2:**
- Input: amount = 3, coins = [2]
- Output: 0
- Explanation: Cannot make 3 with only 2-value coins

**Example 3:**
- Input: amount = 10, coins = [10]
- Output: 1
- Explanation: Only one way: one coin of value 10

### Constraints

- 1 <= coins.length <= 300
- 1 <= coins[i] <= 5000
- 0 <= amount <= 5000

### Hints

1. This is an unbounded knapsack problem. You're counting combinations, not permutations, so order doesn't matter.
2. 2D DP approach: dp[i][j] = number of ways to make amount j using first i coins. Transition: dp[i][j] = dp[i-1][j] (don't use coin i) + dp[i][j-coins[i]] (use coin i at least once).
3. 1D DP optimization: Use a single array dp where dp[i] = ways to make amount i. Iterate through coins in outer loop, amounts in inner loop.
4. Critical: Iterate coins in outer loop to avoid counting permutations. If you iterate amounts first, you'll count [1,2] and [2,1] as different.
5. Base case: dp[0] = 1 (one way to make amount 0: use no coins).

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(amount * n) where n is number of coins
- **Space Complexity:** O(amount)

### Test Cases

**Test 1:** Four combinations
- Input: "(5, [1,2,5])"
- Expected: "4"

**Test 2:** Impossible
- Input: "(3, [2])"
- Expected: "0"

**Test 3:** Exactly one coin
- Input: "(10, [10])"
- Expected: "1"

**Test 4:** Zero amount: one way (use no coins)
- Input: "(0, [7])"
- Expected: "1"

**Test 5:** Multiple small coins
- Input: "(4, [1,2,3])"
- Expected: "4"

---

## 10. Longest Increasing Subsequence

**Difficulty:** medium
**Concept:** dynamic-programming
**Family:** dp:lis

### Description

Given an integer array nums, return the length of the longest strictly increasing subsequence. A subsequence is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements.

### Examples

**Example 1:**
- Input: nums = [10,9,2,5,3,7,101,18]
- Output: 4
- Explanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4.

**Example 2:**
- Input: nums = [0,1,0,3,2,3]
- Output: 4
- Explanation: The longest increasing subsequence is [0,1,2,3].

**Example 3:**
- Input: nums = [7,7,7,7,7,7,7]
- Output: 1
- Explanation: All elements are the same, so the longest strictly increasing subsequence is any single element.

### Constraints

- 1 <= nums.length <= 2500
- -10^4 <= nums[i] <= 10^4

### Hints

1. DP state: dp[i] = length of longest increasing subsequence ending at nums[i]. Initialize all dp[i] = 1 (each element is a subsequence of length 1).
2. Recurrence: For each i, check all j < i. If nums[j] < nums[i], then dp[i] = max(dp[i], dp[j] + 1).
3. Final answer: max(dp) because the LIS could end at any index.
4. Time complexity: O(n^2) with this DP approach. There's a O(n log n) solution using binary search and patience sorting.
5. Binary search optimization: Maintain an array 'tails' where tails[i] is the smallest ending value of all increasing subsequences of length i+1.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n^2) for DP, O(n log n) for binary search
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** [2,3,7,101]
- Input: "[10,9,2,5,3,7,101,18]"
- Expected: "4"

**Test 2:** [0,1,2,3]
- Input: "[0,1,0,3,2,3]"
- Expected: "4"

**Test 3:** All same
- Input: "[7,7,7,7,7,7,7]"
- Expected: "1"

**Test 4:** [1,3,6,7,9,10]
- Input: "[1,3,6,7,9,4,10,5,6]"
- Expected: "6"

**Test 5:** Single element
- Input: "[1]"
- Expected: "1"

---

## 11. Maximum Subarray (Kadane's Algorithm)

**Difficulty:** medium
**Concept:** dynamic-programming

### Description

Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum. This is a classic DP problem known as Kadane's Algorithm.

### Examples

**Example 1:**
- Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
- Output: 6
- Explanation: The subarray [4,-1,2,1] has the largest sum 6.

**Example 2:**
- Input: nums = [1]
- Output: 1
- Explanation: Single element array.

**Example 3:**
- Input: nums = [5,4,-1,7,8]
- Output: 23
- Explanation: The subarray [5,4,-1,7,8] has the largest sum 23.

### Constraints

- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4

### Hints

1. Kadane's Algorithm: At each position i, track the maximum sum of subarrays ending at i. Let this be current_sum.
2. Decision at each step: current_sum = max(nums[i], current_sum + nums[i]). If current_sum is negative, it's better to start fresh from nums[i].
3. Track global maximum: Keep a variable max_sum = max(max_sum, current_sum) as you iterate.
4. Base case: current_sum = nums[0], max_sum = nums[0].
5. This is O(n) time and O(1) space - a very elegant solution to a classic problem.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

### Test Cases

**Test 1:** [4,-1,2,1]
- Input: "[-2,1,-3,4,-1,2,1,-5,4]"
- Expected: "6"

**Test 2:** Single element
- Input: "[1]"
- Expected: "1"

**Test 3:** Entire array
- Input: "[5,4,-1,7,8]"
- Expected: "23"

**Test 4:** Single negative
- Input: "[-1]"
- Expected: "-1"

**Test 5:** All negative
- Input: "[-2,-1]"
- Expected: "-1"

---

## 12. House Robber II (Circular)

**Difficulty:** medium
**Concept:** dynamic-programming
**Family:** dp:house-robber-1d

### Description

You are a professional robber planning to rob houses along a street. Each house has money, but this time all houses are arranged in a circle - the first and last houses are adjacent. You cannot rob two adjacent houses. Return the maximum amount you can rob without alerting the police.

### Examples

**Example 1:**
- Input: nums = [2,3,2]
- Output: 3
- Explanation: You cannot rob both house 1 and house 3 since they are adjacent. Rob house 2 for max of 3.

**Example 2:**
- Input: nums = [1,2,3,1]
- Output: 4
- Explanation: Rob house 1 (money = 1) and house 3 (money = 3). Total = 4.

**Example 3:**
- Input: nums = [1,2,3]
- Output: 3
- Explanation: Cannot rob both house 1 and 3. Rob house 3 for max of 3.

### Constraints

- 1 <= nums.length <= 100
- 0 <= nums[i] <= 1000

### Hints

1. Break the circle. The constraint is: you can't rob both house 0 and house n-1. So solve two linear House Robber problems.
2. Scenario 1: Rob from houses 0 to n-2 (exclude the last house). This allows you to potentially rob house 0.
3. Scenario 2: Rob from houses 1 to n-1 (exclude the first house). This allows you to potentially rob house n-1.
4. Return max of the two scenarios. Reuse the House Robber I solution for each range.
5. Edge case: If there's only one house, return nums[0].

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

### Test Cases

**Test 1:** Rob middle house
- Input: "[2,3,2]"
- Expected: "3"

**Test 2:** Rob houses 0 and 2
- Input: "[1,2,3,1]"
- Expected: "4"

**Test 3:** Rob last house
- Input: "[1,2,3]"
- Expected: "3"

**Test 4:** Single house
- Input: "[1]"
- Expected: "1"

**Test 5:** Rob houses 1 and 3
- Input: "[1,2,1,1]"
- Expected: "3"

---

## 13. Delete and Earn

**Difficulty:** medium
**Concept:** dynamic-programming

### Description

You are given an integer array nums. You want to maximize the number of points you get by performing operations. In each operation, you pick any nums[i] and delete it to earn nums[i] points. After deleting nums[i], you must delete all elements equal to nums[i] - 1 and nums[i] + 1. Return the maximum points you can earn.

### Examples

**Example 1:**
- Input: nums = [3,4,2]
- Output: 6
- Explanation: Delete 4 to earn 4 points. 3 is deleted too. Then delete 2 to earn 2 points. Total = 6.

**Example 2:**
- Input: nums = [2,2,3,3,3,4]
- Output: 9
- Explanation: Delete a 3 to earn 3 points. All 2's and 4's are deleted. Delete another 3 to earn 3 points. Delete the last 3 to earn 3 points. Total = 9.

### Constraints

- 1 <= nums.length <= 2 * 10^4
- 1 <= nums[i] <= 10^4

### Hints

1. Transform to House Robber. Count occurrences of each number. If you take all x's, you earn x * count[x] but can't take (x-1) or (x+1).
2. Create points array. Let points[i] = i * count[i]. Now you can't take adjacent indices - this is House Robber!
3. Handle sparse values. If nums contains [1, 100], you don't want an array of size 100. Use a dictionary or find max value and create array up to that.
4. Apply House Robber DP: dp[i] = max(dp[i-1], dp[i-2] + points[i]).
5. Optimization: You can skip values that don't appear in nums to save time.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n + m) where m is max(nums)
- **Space Complexity:** O(m)

### Test Cases

**Test 1:** Take 4, then 2
- Input: "[3,4,2]"
- Expected: "6"

**Test 2:** Take all 3's
- Input: "[2,2,3,3,3,4]"
- Expected: "9"

**Test 3:** Take all 1's and 5's
- Input: "[1,1,1,2,4,5,5,5,6]"
- Expected: "18"

**Test 4:** Single element
- Input: "[1]"
- Expected: "1"

**Test 5:** Take 1 and 3
- Input: "[1,2,3]"
- Expected: "4"

---

## 14. Paint House

**Difficulty:** medium
**Concept:** dynamic-programming

### Description

There is a row of n houses, where each house can be painted one of three colors: red, blue, or green. The cost of painting each house with a certain color is different. You have to paint all the houses such that no two adjacent houses have the same color. The cost of painting each house with a certain color is represented by an n x 3 cost matrix costs. Return the minimum cost to paint all houses.

### Examples

**Example 1:**
- Input: costs = [[17,2,17],[16,16,5],[14,3,19]]
- Output: 10
- Explanation: Paint house 0 blue (2), house 1 green (5), house 2 blue (3). Total: 2+5+3 = 10.

**Example 2:**
- Input: costs = [[7,6,2]]
- Output: 2
- Explanation: Only one house. Choose the minimum cost color: green (2).

### Constraints

- costs.length == n
- costs[i].length == 3
- 1 <= n <= 100
- 1 <= costs[i][j] <= 20

### Hints

1. DP state: dp[i][c] = minimum cost to paint houses 0 to i, with house i painted color c (0=red, 1=blue, 2=green).
2. Recurrence: dp[i][c] = costs[i][c] + min(dp[i-1][c'] for all c' != c). You add current cost and the min of previous house with different color.
3. Base case: dp[0][0] = costs[0][0], dp[0][1] = costs[0][1], dp[0][2] = costs[0][2].
4. Final answer: min(dp[n-1][0], dp[n-1][1], dp[n-1][2]).
5. Space optimization: You only need the previous row, so use two arrays or three variables for O(1) space.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n) or O(1) with space optimization

### Test Cases

**Test 1:** Three houses
- Input: "[[17,2,17],[16,16,5],[14,3,19]]"
- Expected: "10"

**Test 2:** Single house
- Input: "[[7,6,2]]"
- Expected: "2"

**Test 3:** Two houses
- Input: "[[1,2,3],[1,4,6]]"
- Expected: "3"

**Test 4:** Four houses
- Input: "[[5,8,6],[19,14,13],[7,5,12],[14,15,17]]"
- Expected: "43"

---

## 15. Perfect Squares

**Difficulty:** medium
**Concept:** dynamic-programming

### Description

Given an integer n, return the least number of perfect square numbers that sum to n. A perfect square is an integer that is the square of an integer (e.g., 1, 4, 9, 16, ...).

### Examples

**Example 1:**
- Input: n = 12
- Output: 3
- Explanation: 12 = 4 + 4 + 4

**Example 2:**
- Input: n = 13
- Output: 2
- Explanation: 13 = 4 + 9

### Constraints

- 1 <= n <= 10^4

### Hints

1. This is Coin Change with perfect squares as coins. Perfect squares up to n are: 1, 4, 9, 16, ..., i^2 where i^2 <= n.
2. DP state: dp[i] = minimum number of perfect squares that sum to i. Initialize all to infinity except dp[0] = 0.
3. Recurrence: For each i from 1 to n, try all perfect squares j^2 where j^2 <= i. dp[i] = min(dp[i], dp[i - j^2] + 1).
4. Generate squares efficiently: Iterate j from 1 while j*j <= n.
5. Mathematical note: By Lagrange's four-square theorem, every positive integer can be expressed as the sum of at most four perfect squares. So the answer is always <= 4.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n * sqrt(n))
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** 4+4+4
- Input: "12"
- Expected: "3"

**Test 2:** 4+9
- Input: "13"
- Expected: "2"

**Test 3:** 1 = 1^2
- Input: "1"
- Expected: "1"

**Test 4:** 4 = 2^2
- Input: "4"
- Expected: "1"

**Test 5:** 1+1+1+4
- Input: "7"
- Expected: "4"

**Test 6:** 1+9
- Input: "10"
- Expected: "2"

---

## 16. Unique Paths

**Difficulty:** medium
**Concept:** dynamic-programming
**Family:** dp:unique-paths

### Description

There is a robot on an m x n grid. The robot is initially located at the top-left corner (0, 0). The robot tries to move to the bottom-right corner (m-1, n-1). The robot can only move either down or right at any point in time. Given the two integers m and n, return the number of possible unique paths the robot can take to reach the bottom-right corner.

### Examples

**Example 1:**
- Input: m = 3, n = 7
- Output: 28
- Explanation: There are 28 unique paths from (0,0) to (2,6).

**Example 2:**
- Input: m = 3, n = 2
- Output: 3
- Explanation: Three paths: Right->Down->Down, Down->Right->Down, Down->Down->Right

### Constraints

- 1 <= m, n <= 100

### Hints

1. DP state: dp[i][j] = number of ways to reach cell (i, j). You want dp[m-1][n-1].
2. Recurrence: dp[i][j] = dp[i-1][j] + dp[i][j-1] (ways from above + ways from left).
3. Base cases: dp[0][j] = 1 for all j (only one way to reach first row: keep moving right). dp[i][0] = 1 for all i (only one way to reach first column: keep moving down).
4. Space optimization: You only need the previous row, so can use O(n) space instead of O(m*n).
5. Mathematical insight: This is actually a combinatorics problem. The answer is C(m+n-2, m-1) = (m+n-2)! / ((m-1)! * (n-1)!). But DP is more intuitive.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(m * n)
- **Space Complexity:** O(m * n) or O(n) with space optimization

### Test Cases

**Test 1:** 3x7 grid
- Input: "(3, 7)"
- Expected: "28"

**Test 2:** 3x2 grid
- Input: "(3, 2)"
- Expected: "3"

**Test 3:** 1x1 grid (already at destination)
- Input: "(1, 1)"
- Expected: "1"

**Test 4:** 2x2 grid
- Input: "(2, 2)"
- Expected: "2"

**Test 5:** Larger grid
- Input: "(10, 10)"
- Expected: "48620"

---

## 17. Unique Paths II

**Difficulty:** medium
**Concept:** dynamic-programming
**Family:** dp:unique-paths

### Description

A robot is on an m x n grid starting at (0, 0) trying to reach (m-1, n-1). It can only move down or right. Now consider that some obstacles are added to the grid. An obstacle is marked as 1 in the grid, and empty space is marked as 0. Return the number of possible unique paths the robot can take to reach the bottom-right corner.

### Examples

**Example 1:**
- Input: obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]
- Output: 2
- Explanation: There are two ways to reach (2,2): Right->Right->Down->Down or Down->Down->Right->Right. The center cell is blocked.

**Example 2:**
- Input: obstacleGrid = [[0,1],[0,0]]
- Output: 1
- Explanation: Only one path: Down->Right.

### Constraints

- m == obstacleGrid.length
- n == obstacleGrid[i].length
- 1 <= m, n <= 100
- obstacleGrid[i][j] is 0 or 1

### Hints

1. Same as Unique Paths, but check for obstacles. If obstacleGrid[i][j] == 1, set dp[i][j] = 0 (no ways to reach an obstacle).
2. Handle base cases carefully. If obstacleGrid[0][0] == 1 or obstacleGrid[m-1][n-1] == 1, return 0 immediately.
3. First row/column: If there's an obstacle, all cells after it in that row/column are unreachable (dp = 0).
4. Recurrence: If obstacleGrid[i][j] == 0, then dp[i][j] = dp[i-1][j] + dp[i][j-1]. Otherwise dp[i][j] = 0.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(m * n)
- **Space Complexity:** O(m * n) or O(n) with space optimization

### Test Cases

**Test 1:** Center obstacle
- Input: "[[0,0,0],[0,1,0],[0,0,0]]"
- Expected: "2"

**Test 2:** Top-right obstacle
- Input: "[[0,1],[0,0]]"
- Expected: "1"

**Test 3:** Start blocked
- Input: "[[1,0]]"
- Expected: "0"

**Test 4:** No obstacles
- Input: "[[0,0],[0,0]]"
- Expected: "2"

**Test 5:** Path blocked
- Input: "[[0,0],[1,1],[0,0]]"
- Expected: "0"

---

## 18. Minimum Path Sum

**Difficulty:** medium
**Concept:** dynamic-programming

### Description

Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right which minimizes the sum of all numbers along its path. You can only move either down or right at any point in time.

### Examples

**Example 1:**
- Input: grid = [[1,3,1],[1,5,1],[4,2,1]]
- Output: 7
- Explanation: Path: 1 → 3 → 1 → 1 → 1 minimizes the sum to 7.

**Example 2:**
- Input: grid = [[1,2,3],[4,5,6]]
- Output: 12
- Explanation: Path: 1 → 2 → 3 → 6 minimizes the sum to 12.

### Constraints

- m == grid.length
- n == grid[i].length
- 1 <= m, n <= 200
- 0 <= grid[i][j] <= 100

### Hints

1. DP state: dp[i][j] = minimum path sum to reach cell (i, j) from (0, 0).
2. Recurrence: dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]). Take the minimum from above or left, then add current cell value.
3. Base cases: dp[0][0] = grid[0][0]. For first row: dp[0][j] = dp[0][j-1] + grid[0][j]. For first column: dp[i][0] = dp[i-1][0] + grid[i][0].
4. Space optimization: Can modify grid in-place or use O(n) space with a single row.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(m * n)
- **Space Complexity:** O(m * n) or O(n) with space optimization

### Test Cases

**Test 1:** 3x3 grid
- Input: "[[1,3,1],[1,5,1],[4,2,1]]"
- Expected: "7"

**Test 2:** 2x3 grid
- Input: "[[1,2,3],[4,5,6]]"
- Expected: "12"

**Test 3:** Single cell
- Input: "[[1]]"
- Expected: "1"

**Test 4:** 2x2 grid
- Input: "[[1,2],[1,1]]"
- Expected: "3"

---

## 19. Longest Common Subsequence

**Difficulty:** medium
**Concept:** dynamic-programming
**Family:** dp:lcs

### Description

Given two strings text1 and text2, return the length of their longest common subsequence (LCS). A subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements. If there is no common subsequence, return 0.

### Examples

**Example 1:**
- Input: text1 = 'abcde', text2 = 'ace'
- Output: 3
- Explanation: The longest common subsequence is 'ace' with length 3.

**Example 2:**
- Input: text1 = 'abc', text2 = 'abc'
- Output: 3
- Explanation: The entire strings are the same.

**Example 3:**
- Input: text1 = 'abc', text2 = 'def'
- Output: 0
- Explanation: No common subsequence.

### Constraints

- 1 <= text1.length, text2.length <= 1000
- text1 and text2 consist of only lowercase English characters

### Hints

1. DP state: dp[i][j] = length of LCS of text1[0:i] and text2[0:j]. You want dp[len(text1)][len(text2)].
2. Recurrence: If text1[i-1] == text2[j-1], then dp[i][j] = dp[i-1][j-1] + 1 (match! extend LCS). Otherwise, dp[i][j] = max(dp[i-1][j], dp[i][j-1]) (skip one character from either string).
3. Base cases: dp[0][j] = 0 for all j (empty text1). dp[i][0] = 0 for all i (empty text2).
4. Build a 2D table of size (m+1) x (n+1) where m = len(text1), n = len(text2).
5. Space optimization: You only need the previous row, so can use O(min(m, n)) space.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(m * n) where m, n are lengths of text1, text2
- **Space Complexity:** O(m * n) or O(min(m, n)) with space optimization

### Test Cases

**Test 1:** LCS: 'ace'
- Input: "('abcde', 'ace')"
- Expected: "3"

**Test 2:** Identical strings
- Input: "('abc', 'abc')"
- Expected: "3"

**Test 3:** No common subsequence
- Input: "('abc', 'def')"
- Expected: "0"

**Test 4:** LCS: 'b'
- Input: "('bl', 'yby')"
- Expected: "1"

**Test 5:** LCS: 'up'
- Input: "('ezupkr', 'ubmrapg')"
- Expected: "2"

---

## 20. Edit Distance

**Difficulty:** medium
**Concept:** dynamic-programming
**Family:** dp:edit-distance

### Description

Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have three operations: insert a character, delete a character, or replace a character. This is also known as Levenshtein distance.

### Examples

**Example 1:**
- Input: word1 = 'horse', word2 = 'ros'
- Output: 3
- Explanation: horse -> rorse (replace 'h' with 'r') -> rose (remove 'r') -> ros (remove 'e')

**Example 2:**
- Input: word1 = 'intention', word2 = 'execution'
- Output: 5
- Explanation: intention -> inention (delete 't') -> enention (replace 'i' with 'e') -> exention (replace 'n' with 'x') -> exection (replace 'n' with 'c') -> execution (insert 'u')

### Constraints

- 0 <= word1.length, word2.length <= 500
- word1 and word2 consist of lowercase English letters

### Hints

1. DP state: dp[i][j] = minimum operations to convert word1[0:i] to word2[0:j].
2. Recurrence: If word1[i-1] == word2[j-1], then dp[i][j] = dp[i-1][j-1] (no operation needed). Otherwise, dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).
3. Three operations: dp[i-1][j] + 1 (delete from word1), dp[i][j-1] + 1 (insert into word1), dp[i-1][j-1] + 1 (replace in word1).
4. Base cases: dp[0][j] = j (insert j characters to convert '' to word2[0:j]). dp[i][0] = i (delete i characters to convert word1[0:i] to '').
5. This is a fundamental algorithm in NLP for spell checking, DNA sequence alignment, and more.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(m * n) where m, n are lengths of word1, word2
- **Space Complexity:** O(m * n) or O(min(m, n)) with space optimization

### Test Cases

**Test 1:** Replace, delete, delete
- Input: "('horse', 'ros')"
- Expected: "3"

**Test 2:** 5 operations
- Input: "('intention', 'execution')"
- Expected: "5"

**Test 3:** Insert 3 characters
- Input: "('', 'abc')"
- Expected: "3"

**Test 4:** Delete 3 characters
- Input: "('abc', '')"
- Expected: "3"

**Test 5:** Identical strings
- Input: "('abc', 'abc')"
- Expected: "0"

---

## 21. Distinct Subsequences

**Difficulty:** hard
**Concept:** dynamic-programming

### Description

Given two strings s and t, return the number of distinct subsequences of s which equals t. A subsequence is a sequence derived by deleting some or no characters without changing the order of remaining elements. The answer is guaranteed to fit in a 32-bit integer.

### Examples

**Example 1:**
- Input: s = 'rabbbit', t = 'rabbit'
- Output: 3
- Explanation: There are 3 ways to form 'rabbit' from 'rabbbit': rabb(b)it, rab(b)bit, ra(b)bbit

**Example 2:**
- Input: s = 'babgbag', t = 'bag'
- Output: 5
- Explanation: Five distinct ways to form 'bag' from 'babgbag'

### Constraints

- 1 <= s.length, t.length <= 1000
- s and t consist of English letters

### Hints

1. DP state: dp[i][j] = number of ways to form t[0:j] from s[0:i]. You want dp[len(s)][len(t)].
2. Recurrence: If s[i-1] == t[j-1], then dp[i][j] = dp[i-1][j-1] (use this match) + dp[i-1][j] (don't use this match). Otherwise, dp[i][j] = dp[i-1][j] (can't match, skip s[i-1]).
3. Base cases: dp[i][0] = 1 for all i (one way to form empty string: select nothing). dp[0][j] = 0 for j > 0 (can't form non-empty t from empty s).
4. Think of it as: at each character of s, you decide whether to use it to match t or skip it.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(m * n) where m = len(s), n = len(t)
- **Space Complexity:** O(m * n) or O(n) with space optimization

### Test Cases

**Test 1:** Three ways
- Input: "('rabbbit', 'rabbit')"
- Expected: "3"

**Test 2:** Five ways
- Input: "('babgbag', 'bag')"
- Expected: "5"

**Test 3:** Exact match
- Input: "('abc', 'abc')"
- Expected: "1"

**Test 4:** No match
- Input: "('abc', 'def')"
- Expected: "0"

**Test 5:** Choose 2 from 3 a's
- Input: "('aaa', 'aa')"
- Expected: "3"

---

## 22. 0/1 Knapsack

**Difficulty:** medium
**Concept:** dynamic-programming

### Description

Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack. Each item can be taken at most once (0/1 knapsack).

### Examples

**Example 1:**
- Input: values = [60, 100, 120], weights = [10, 20, 30], W = 50
- Output: 220
- Explanation: Take items with values 100 and 120 (weights 20 + 30 = 50). Total value = 220.

**Example 2:**
- Input: values = [1, 4, 5, 7], weights = [1, 3, 4, 5], W = 7
- Output: 9
- Explanation: Take items with values 4 and 5 (weights 3 + 4 = 7). Total value = 9.

### Constraints

- 1 <= n <= 1000
- 1 <= W <= 1000
- 1 <= weights[i], values[i] <= 1000

### Hints

1. DP state: dp[i][w] = maximum value using first i items with capacity w. You want dp[n][W].
2. Recurrence: For item i with weight[i] and value[i], you have two choices: take it or leave it. dp[i][w] = max(dp[i-1][w], dp[i-1][w-weights[i]] + values[i]) if weights[i] <= w, else dp[i][w] = dp[i-1][w].
3. Base case: dp[0][w] = 0 for all w (no items, no value). dp[i][0] = 0 for all i (no capacity, no value).
4. Space optimization: You only need the previous row, so can use 1D array. But iterate capacity from right to left to avoid overwriting values you still need.
5. 1D optimization: dp[w] = max(dp[w], dp[w-weights[i]] + values[i]). Iterate w from W down to weights[i].

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n * W)
- **Space Complexity:** O(n * W) or O(W) with space optimization

### Test Cases

**Test 1:** Take last two items
- Input: "([60, 100, 120], [10, 20, 30], 50)"
- Expected: "220"

**Test 2:** Take items 2 and 3
- Input: "([1, 4, 5, 7], [1, 3, 4, 5], 7)"
- Expected: "9"

**Test 3:** Take items with weights 4 and 3
- Input: "([10, 40, 30, 50], [5, 4, 6, 3], 10)"
- Expected: "90"

**Test 4:** Take only item 3
- Input: "([1, 2, 3], [4, 5, 1], 4)"
- Expected: "3"

---

## 23. Unbounded Knapsack

**Difficulty:** medium
**Concept:** dynamic-programming

### Description

Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value. Unlike 0/1 knapsack, you can take each item unlimited number of times (unbounded knapsack).

### Examples

**Example 1:**
- Input: values = [10, 40, 50, 70], weights = [1, 3, 4, 5], W = 8
- Output: 110
- Explanation: Take item with value 10 three times and item with value 40 once. Total weight = 3 + 3 + 3 + 3 = 12... wait, that's wrong. Actually take item with weight 1 eight times or items with weights 3+5 for values 40+70=110 (weight 8). Best is 70 + 40 = 110.

**Example 2:**
- Input: values = [1, 4, 5, 7], weights = [1, 3, 4, 5], W = 8
- Output: 11
- Explanation: Take item with weight 1 and value 1 multiple times, or item with weight 4 twice. Best is 5 + 5 + 1 = 11 (weights 4+4 = 8).

### Constraints

- 1 <= n <= 1000
- 1 <= W <= 1000
- 1 <= weights[i], values[i] <= 1000

### Hints

1. Similar to 0/1 Knapsack but items can be reused. This changes the recurrence.
2. 1D DP approach: dp[w] = maximum value with capacity w. For each item i, update dp[w] for all w >= weights[i].
3. Recurrence: dp[w] = max(dp[w], dp[w - weights[i]] + values[i]) for all items i where weights[i] <= w.
4. Key difference from 0/1: Iterate capacity from left to right (not right to left), so you can reuse items in the same iteration.
5. Order: Outer loop over items, inner loop over capacities from weights[i] to W.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n * W)
- **Space Complexity:** O(W)

### Test Cases

**Test 1:** Mix of items
- Input: "([10, 40, 50, 70], [1, 3, 4, 5], 8)"
- Expected: "110"

**Test 2:** Take weight 4 twice
- Input: "([1, 4, 5, 7], [1, 3, 4, 5], 8)"
- Expected: "11"

**Test 3:** Take weight 1 five times
- Input: "([5, 10, 15], [1, 2, 3], 5)"
- Expected: "25"

**Test 4:** Take weight 1 five times
- Input: "([6, 10, 12], [1, 2, 3], 5)"
- Expected: "30"

---

## 24. Target Sum

**Difficulty:** medium
**Concept:** dynamic-programming

### Description

You are given an integer array nums and an integer target. You want to build an expression by adding '+' or '-' before each integer in nums and then concatenate all the integers. Return the number of different expressions that evaluate to target.

### Examples

**Example 1:**
- Input: nums = [1,1,1,1,1], target = 3
- Output: 5
- Explanation: There are 5 ways: +1+1+1+1-1=3, +1+1+1-1+1=3, +1+1-1+1+1=3, +1-1+1+1+1=3, -1+1+1+1+1=3

**Example 2:**
- Input: nums = [1], target = 1
- Output: 1
- Explanation: Only one way: +1 = 1

### Constraints

- 1 <= nums.length <= 20
- 0 <= nums[i] <= 1000
- 0 <= sum(nums[i]) <= 1000
- -1000 <= target <= 1000

### Hints

1. Transform the problem. Let P = subset with + sign, N = subset with - sign. Then sum(P) - sum(N) = target and sum(P) + sum(N) = sum(nums). Solve to get: sum(P) = (target + sum(nums)) / 2.
2. Subset sum problem. Now the problem is: count number of subsets with sum = (target + sum(nums)) / 2. This is the classic subset sum counting problem.
3. DP state: dp[s] = number of ways to make sum s. Iterate through nums, and for each num, update dp array.
4. Recurrence: For each num in nums, update dp[s] += dp[s - num] for s from sum_target down to num. Iterate backwards to avoid using updated values.
5. Base case: dp[0] = 1 (one way to make sum 0: select nothing). Check if (target + sum(nums)) is even and non-negative.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n * sum) where sum = (target + sum(nums)) / 2
- **Space Complexity:** O(sum)

### Test Cases

**Test 1:** Five ways
- Input: "([1,1,1,1,1], 3)"
- Expected: "5"

**Test 2:** Only +1
- Input: "([1], 1)"
- Expected: "1"

**Test 3:** Impossible
- Input: "([1], 2)"
- Expected: "0"

**Test 4:** Many zeros
- Input: "([0,0,0,0,0,0,0,0,1], 1)"
- Expected: "256"

**Test 5:** Two ways
- Input: "([1,2,3,4,5], 3)"
- Expected: "2"

---

## 25. Interleaving String

**Difficulty:** medium
**Concept:** dynamic-programming
**Family:** dp:interleaving-string

### Description

Given strings s1, s2, and s3, find whether s3 is formed by an interleaving of s1 and s2. An interleaving of two strings s and t is a configuration where they are divided into n and m substrings respectively, and s3 = s1[0] + s2[0] + s1[1] + s2[1] + ... (in some order).

### Examples

**Example 1:**
- Input: s1 = 'aabcc', s2 = 'dbbca', s3 = 'aadbbcbcac'
- Output: true
- Explanation: s3 is formed by interleaving s1 and s2: aa (s1) + d (s2) + bb (s2) + c (s1) + bc (s1) + a (s2) + c (s1)

**Example 2:**
- Input: s1 = 'aabcc', s2 = 'dbbca', s3 = 'aadbbbaccc'
- Output: false
- Explanation: s3 cannot be formed by interleaving s1 and s2

### Constraints

- 0 <= s1.length, s2.length <= 100
- 0 <= s3.length <= 200
- s1, s2, and s3 consist of lowercase English letters

### Hints

1. First check: len(s3) must equal len(s1) + len(s2). If not, return False immediately.
2. DP state: dp[i][j] = True if s3[0:i+j] can be formed by interleaving s1[0:i] and s2[0:j]. You want dp[len(s1)][len(s2)].
3. Recurrence: dp[i][j] is True if (dp[i-1][j] is True AND s1[i-1] == s3[i+j-1]) OR (dp[i][j-1] is True AND s2[j-1] == s3[i+j-1]).
4. Base case: dp[0][0] = True (all empty strings). dp[i][0] = True if s1[0:i] == s3[0:i]. dp[0][j] = True if s2[0:j] == s3[0:j].
5. Visualize as a grid where you try to reach (m, n) from (0, 0), moving right (take from s1) or down (take from s2), matching s3.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(m * n) where m = len(s1), n = len(s2)
- **Space Complexity:** O(m * n) or O(n) with space optimization

### Test Cases

**Test 1:** Valid interleaving
- Input: "('aabcc', 'dbbca', 'aadbbcbcac')"
- Expected: "true"

**Test 2:** Invalid interleaving
- Input: "('aabcc', 'dbbca', 'aadbbbaccc')"
- Expected: "false"

**Test 3:** All empty
- Input: "('', '', '')"
- Expected: "true"

**Test 4:** One empty
- Input: "('a', '', 'a')"
- Expected: "true"

**Test 5:** Simple case
- Input: "('a', 'b', 'ab')"
- Expected: "true"

---

## 26. Regular Expression Matching

**Difficulty:** hard
**Concept:** dynamic-programming

### Description

Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where: '.' matches any single character, and '*' matches zero or more of the preceding element. The matching should cover the entire input string (not partial).

### Examples

**Example 1:**
- Input: s = 'aa', p = 'a'
- Output: false
- Explanation: Pattern 'a' does not match the entire string 'aa'.

**Example 2:**
- Input: s = 'aa', p = 'a*'
- Output: true
- Explanation: '*' means zero or more of the preceding element 'a'. So 'a*' matches 'aa'.

**Example 3:**
- Input: s = 'ab', p = '.*'
- Output: true
- Explanation: '.*' means zero or more of any character, so it matches 'ab'.

### Constraints

- 1 <= s.length <= 20
- 1 <= p.length <= 30
- s contains only lowercase English letters
- p contains only lowercase English letters, '.', and '*'

### Hints

1. DP state: dp[i][j] = True if s[0:i] matches p[0:j]. You want dp[len(s)][len(p)].
2. Base case: dp[0][0] = True (empty matches empty). dp[0][j] can be True if p[0:j] is like 'a*b*c*' (all * patterns that match empty).
3. Recurrence without '*': If p[j-1] == s[i-1] or p[j-1] == '.', then dp[i][j] = dp[i-1][j-1].
4. Recurrence with '*': If p[j-1] == '*', you have two choices: (1) Use * zero times: dp[i][j] = dp[i][j-2]. (2) Use * one or more times: if s[i-1] matches p[j-2] (the char before *), then dp[i][j] = dp[i-1][j].
5. Careful with '*': It matches zero or more of the *preceding* element, not itself. So check p[j-2] against s[i-1].

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(m * n) where m = len(s), n = len(p)
- **Space Complexity:** O(m * n) or O(n) with space optimization

### Test Cases

**Test 1:** Pattern too short
- Input: "('aa', 'a')"
- Expected: "false"

**Test 2:** * matches multiple
- Input: "('aa', 'a*')"
- Expected: "true"

**Test 3:** .* matches anything
- Input: "('ab', '.*')"
- Expected: "true"

**Test 4:** c* matches 0, a* matches aa
- Input: "('aab', 'c*a*b')"
- Expected: "true"

**Test 5:** Complex pattern
- Input: "('mississippi', 'mis*is*p*.')"
- Expected: "false"

---

## 27. Wildcard Matching

**Difficulty:** hard
**Concept:** dynamic-programming

### Description

Given an input string s and a pattern p, implement wildcard pattern matching with support for '?' and '*' where: '?' matches any single character, and '*' matches any sequence of characters (including the empty sequence). The matching should cover the entire input string (not partial).

### Examples

**Example 1:**
- Input: s = 'aa', p = 'a'
- Output: false
- Explanation: Pattern 'a' does not match the entire string 'aa'.

**Example 2:**
- Input: s = 'aa', p = '*'
- Output: true
- Explanation: '*' matches any sequence.

**Example 3:**
- Input: s = 'cb', p = '?a'
- Output: false
- Explanation: '?' matches 'c', but the second letter is 'a' which does not match 'b'.

**Example 4:**
- Input: s = 'adceb', p = '*a*b'
- Output: true
- Explanation: First '*' matches 'ad'. Second '*' matches 'ce'.

### Constraints

- 0 <= s.length, p.length <= 2000
- s contains only lowercase English letters
- p contains only lowercase English letters, '?' or '*'

### Hints

1. DP state: dp[i][j] = True if s[0:i] matches p[0:j]. You want dp[len(s)][len(p)].
2. Base case: dp[0][0] = True. dp[0][j] = True if p[0:j] is all '*' characters.
3. Recurrence for '?': If p[j-1] == '?' or p[j-1] == s[i-1], then dp[i][j] = dp[i-1][j-1].
4. Recurrence for '*': If p[j-1] == '*', then dp[i][j] = dp[i][j-1] (match empty) OR dp[i-1][j] (match one or more characters). The * can consume any number of characters.
5. Difference from regex: In wildcard, '*' matches any sequence directly, not zero or more of preceding element.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(m * n) where m = len(s), n = len(p)
- **Space Complexity:** O(m * n) or O(n) with space optimization

### Test Cases

**Test 1:** Pattern too short
- Input: "('aa', 'a')"
- Expected: "false"

**Test 2:** * matches everything
- Input: "('aa', '*')"
- Expected: "true"

**Test 3:** Second char doesn't match
- Input: "('cb', '?a')"
- Expected: "false"

**Test 4:** Complex wildcard
- Input: "('adceb', '*a*b')"
- Expected: "true"

**Test 5:** No match
- Input: "('acdcb', 'a*c?b')"
- Expected: "false"

**Test 6:** * matches empty
- Input: "('', '*')"
- Expected: "true"

---

## 28. Burst Balloons

**Difficulty:** hard
**Concept:** dynamic-programming

### Description

You are given n balloons, indexed from 0 to n-1. Each balloon is painted with a number on it represented by an array nums. You are asked to burst all the balloons. If you burst the ith balloon, you get nums[i-1] * nums[i] * nums[i+1] coins. If i-1 or i+1 goes out of bounds, treat it as if there is a balloon with a 1 painted on it. Return the maximum coins you can collect by bursting the balloons wisely.

### Examples

**Example 1:**
- Input: nums = [3,1,5,8]
- Output: 167
- Explanation: Burst balloons in order [3, 5, 1, 8] for maximum coins: 3*1*5 + 3*5*8 + 1*3*8 + 1*8*1 = 167

**Example 2:**
- Input: nums = [1,5]
- Output: 10
- Explanation: Burst balloon 0 first, then balloon 1: 1*1*5 + 1*5*1 = 10

### Constraints

- n == nums.length
- 1 <= n <= 300
- 0 <= nums[i] <= 100

### Hints

1. Add boundary balloons. Prepend and append 1 to nums: nums = [1] + nums + [1]. This simplifies the logic.
2. Think backwards. Instead of deciding which balloon to burst first, decide which balloon to burst LAST in a range [left, right].
3. DP state: dp[left][right] = maximum coins from bursting all balloons between left and right (exclusive). You want dp[0][len(nums)-1].
4. Recurrence: For each range [left, right], try bursting each balloon k in (left, right) as the LAST one. Coins = nums[left] * nums[k] * nums[right] + dp[left][k] + dp[k][right]. Take the maximum over all k.
5. Build bottom-up. Start with small ranges (length 3, 4, ...) and build up to the full range. Use a loop for length, then for left, then for k.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n^3)
- **Space Complexity:** O(n^2)

### Test Cases

**Test 1:** Four balloons
- Input: "[3,1,5,8]"
- Expected: "167"

**Test 2:** Two balloons
- Input: "[1,5]"
- Expected: "10"

**Test 3:** Optimal: burst 1, then 3, then 5
- Input: "[3,1,5]"
- Expected: "35"

**Test 4:** Single balloon
- Input: "[1]"
- Expected: "1"

**Test 5:** Larger values
- Input: "[9,76,64,21]"
- Expected: "116136"

---

## 29. Longest Palindromic Substring

**Difficulty:** hard
**Concept:** dynamic-programming
**Family:** dp:palindrome

### Description

Given a string s, return the longest palindromic substring in s. A palindrome is a string that reads the same backward as forward.

### Examples

**Example 1:**
- Input: s = 'babad'
- Output: 'bab'
- Explanation: 'aba' is also a valid answer.

**Example 2:**
- Input: s = 'cbbd'
- Output: 'bb'
- Explanation: The longest palindrome is 'bb'.

### Constraints

- 1 <= s.length <= 1000
- s consist of only digits and English letters

### Hints

1. DP state: dp[i][j] = True if s[i:j+1] is a palindrome. Build for increasing lengths.
2. Base cases: Single characters are palindromes: dp[i][i] = True. Two characters: dp[i][i+1] = (s[i] == s[i+1]).
3. Recurrence: dp[i][j] = (s[i] == s[j] AND dp[i+1][j-1]). A substring is a palindrome if its ends match and the inside is a palindrome.
4. Track max length. As you fill the DP table, keep track of the longest palindrome found and its starting index.
5. Expand around center (alternative O(n^2) time, O(1) space): For each possible center (single char or between two chars), expand outwards while characters match.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n^2)
- **Space Complexity:** O(n^2) for DP, O(1) for expand around center

### Test Cases

**Test 1:** 'aba' also valid
- Input: "'babad'"
- Expected: "'bab'"

**Test 2:** Even length palindrome
- Input: "'cbbd'"
- Expected: "'bb'"

**Test 3:** Single character
- Input: "'a'"
- Expected: "'a'"

**Test 4:** No palindrome longer than 1
- Input: "'ac'"
- Expected: "'a'"

**Test 5:** Entire string is palindrome
- Input: "'racecar'"
- Expected: "'racecar'"

---

## 30. Palindrome Partitioning II

**Difficulty:** hard
**Concept:** dynamic-programming

### Description

Given a string s, partition s such that every substring of the partition is a palindrome. Return the minimum cuts needed for a palindrome partitioning of s.

### Examples

**Example 1:**
- Input: s = 'aab'
- Output: 1
- Explanation: The palindrome partitioning ['aa','b'] requires 1 cut.

**Example 2:**
- Input: s = 'a'
- Output: 0
- Explanation: No cut needed since 'a' is a palindrome.

**Example 3:**
- Input: s = 'ab'
- Output: 1
- Explanation: One cut: ['a', 'b']

### Constraints

- 1 <= s.length <= 2000
- s consists of lowercase English letters only

### Hints

1. Precompute palindromes. Build a 2D table is_palindrome[i][j] = True if s[i:j+1] is a palindrome. Use DP as in Longest Palindromic Substring.
2. DP for cuts. Let cuts[i] = minimum cuts needed to partition s[0:i] into palindromes. You want cuts[n] where n = len(s).
3. Recurrence: cuts[i] = min(cuts[j] + 1 for all j < i where s[j:i] is a palindrome). Try all possible last partitions.
4. Base case: cuts[0] = 0 (empty string needs 0 cuts). If s[0:i] is entirely a palindrome, cuts[i] = 0.
5. Optimization: For each i, iterate j from i-1 down to 0 and break early when you find a palindrome with cuts[j] + 1 matching the current minimum.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n^2)
- **Space Complexity:** O(n^2) for palindrome table, O(n) for cuts array

### Test Cases

**Test 1:** aa|b
- Input: "'aab'"
- Expected: "1"

**Test 2:** No cut needed
- Input: "'a'"
- Expected: "0"

**Test 3:** a|b
- Input: "'ab'"
- Expected: "1"

**Test 4:** aaa|baa or a|aabaa
- Input: "'aaabaa'"
- Expected: "1"

**Test 5:** Each char separate
- Input: "'abcdefg'"
- Expected: "6"

---

## 31. Matrix Chain Multiplication

**Difficulty:** hard
**Concept:** dynamic-programming

### Description

Given a sequence of matrices, find the most efficient way to multiply them together. The problem is not actually to perform the multiplications, but merely to decide the order of multiplications. Given dimensions p where matrix i has dimensions p[i-1] x p[i], find the minimum number of scalar multiplications needed.

### Examples

**Example 1:**
- Input: p = [10, 20, 30, 40, 30]
- Output: 30000
- Explanation: Optimal: ((A(BC))D) or (A((BC)D)). Cost = 10*20*30 + 10*30*40 + 10*40*30 = 30000.

**Example 2:**
- Input: p = [10, 20, 30]
- Output: 6000
- Explanation: Only two matrices: 10*20*30 = 6000

### Constraints

- 1 <= p.length <= 100
- 1 <= p[i] <= 100

### Hints

1. DP state: dp[i][j] = minimum scalar multiplications to compute matrices from i to j. You want dp[1][n-1] where n = len(p).
2. Recurrence: For range [i, j], try all split points k where i <= k < j. Cost = dp[i][k] + dp[k+1][j] + p[i-1] * p[k] * p[j]. Take minimum over all k.
3. Base case: dp[i][i] = 0 (single matrix needs no multiplication).
4. Build bottom-up. Start with chain length 2, then 3, etc., up to n-1. For each length, try all starting positions i.
5. The order of matrix multiplication matters! (AB)C might be cheaper than A(BC) depending on dimensions.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n^3)
- **Space Complexity:** O(n^2)

### Test Cases

**Test 1:** Four matrices
- Input: "[10, 20, 30, 40, 30]"
- Expected: "30000"

**Test 2:** Two matrices
- Input: "[10, 20, 30]"
- Expected: "6000"

**Test 3:** Small dimensions
- Input: "[1, 2, 3, 4]"
- Expected: "18"

**Test 4:** Six matrices
- Input: "[5, 10, 3, 12, 5, 50, 6]"
- Expected: "2010"

---

## 32. Maximum Profit in Job Scheduling

**Difficulty:** hard
**Concept:** dynamic-programming

### Description

We have n jobs, where every job is scheduled to be done from startTime[i] to endTime[i], obtaining a profit of profit[i]. You're given the startTime, endTime and profit arrays, return the maximum profit you can take such that there are no two jobs in the subset with overlapping time range.

### Examples

**Example 1:**
- Input: startTime = [1,2,3,3], endTime = [3,4,5,6], profit = [50,10,40,70]
- Output: 120
- Explanation: Select jobs 1 and 4 for max profit of 50 + 70 = 120.

**Example 2:**
- Input: startTime = [1,2,3,4,6], endTime = [3,5,10,6,9], profit = [20,20,100,70,60]
- Output: 150
- Explanation: Select jobs 1, 4, and 5 for max profit of 20 + 70 + 60 = 150.

### Constraints

- 1 <= startTime.length == endTime.length == profit.length <= 5 * 10^4
- 1 <= startTime[i] < endTime[i] <= 10^9
- 1 <= profit[i] <= 10^4

### Hints

1. Sort jobs by end time. Create a list of (start, end, profit) tuples and sort by end time.
2. DP state: dp[i] = maximum profit using jobs 0 to i (after sorting). You want dp[n-1].
3. Recurrence: For job i, you have two choices: (1) Skip it: dp[i] = dp[i-1]. (2) Take it: find the latest job j where endTime[j] <= startTime[i], then dp[i] = profit[i] + dp[j].
4. Binary search optimization. Use binary search to find the latest non-overlapping job. This reduces time from O(n^2) to O(n log n).
5. Alternative: Use a dictionary with memoization on sorted jobs. Define a recursive function and cache results.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n log n) for sorting and binary search
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** Take jobs 0 and 3
- Input: "([1,2,3,3], [3,4,5,6], [50,10,40,70])"
- Expected: "120"

**Test 2:** Take jobs 0, 3, 4
- Input: "([1,2,3,4,6], [3,5,10,6,9], [20,20,100,70,60])"
- Expected: "150"

**Test 3:** Take job 1
- Input: "([1,1,1], [2,3,4], [5,6,4])"
- Expected: "6"

**Test 4:** Complex scheduling
- Input: "([4,2,4,8,2], [5,5,5,10,8], [1,2,8,10,4])"
- Expected: "18"

---

## 33. Partition Equal Subset Sum

**Difficulty:** hard
**Concept:** dynamic-programming
**Family:** dp:subset-sum

### Description

Given a non-empty array nums containing only positive integers, find if the array can be partitioned into two subsets such that the sum of elements in both subsets is equal.

### Examples

**Example 1:**
- Input: nums = [1,5,11,5]
- Output: true
- Explanation: The array can be partitioned as [1, 5, 5] and [11].

**Example 2:**
- Input: nums = [1,2,3,5]
- Output: false
- Explanation: Cannot be partitioned into equal sum subsets.

### Constraints

- 1 <= nums.length <= 200
- 1 <= nums[i] <= 100

### Hints

1. Check if sum is even. If sum(nums) is odd, it's impossible to partition into equal subsets. Return False.
2. Subset sum problem. If sum is even, the problem becomes: find if there's a subset with sum = total_sum / 2. This is 0/1 Knapsack.
3. DP state: dp[i] = True if we can make sum i using some subset of nums. Initialize dp[0] = True (sum 0 with empty subset).
4. Recurrence: For each num in nums, update dp array backwards: for s from target down to num, dp[s] = dp[s] OR dp[s - num].
5. Return dp[target] where target = sum(nums) / 2. If True, we can partition the array.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n * sum) where sum = sum(nums) / 2
- **Space Complexity:** O(sum)

### Test Cases

**Test 1:** [1,5,5] and [11]
- Input: "[1,5,11,5]"
- Expected: "true"

**Test 2:** Cannot partition
- Input: "[1,2,3,5]"
- Expected: "false"

**Test 3:** Odd sum
- Input: "[1,2,5]"
- Expected: "false"

**Test 4:** [1] and [1]
- Input: "[1,1]"
- Expected: "true"

**Test 5:** Single element
- Input: "[100]"
- Expected: "false"

---

## 34. Best Time to Buy and Sell Stock with Cooldown

**Difficulty:** hard
**Concept:** dynamic-programming
**Family:** dp:stock-profit

### Description

You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve. You may complete as many transactions as you like (buy and sell the stock multiple times), but you must sell before you buy again. After you sell your stock, you cannot buy stock on the next day (cooldown period of 1 day).

### Examples

**Example 1:**
- Input: prices = [1,2,3,0,2]
- Output: 3
- Explanation: Buy on day 1 (price = 1), sell on day 2 (price = 2), profit = 1. Cooldown on day 3. Buy on day 4 (price = 0), sell on day 5 (price = 2), profit = 2. Total profit = 3.

**Example 2:**
- Input: prices = [1]
- Output: 0
- Explanation: Cannot make any profit with a single day.

### Constraints

- 1 <= prices.length <= 5000
- 0 <= prices[i] <= 1000

### Hints

1. State machine. At any day, you're in one of 3 states: (1) hold - you own a stock, (2) sold - you just sold (cooldown), (3) rest - you don't own a stock and not in cooldown.
2. Transitions: From 'rest', you can buy (go to 'hold') or stay in 'rest'. From 'hold', you can sell (go to 'sold') or stay in 'hold'. From 'sold', you must go to 'rest' (cooldown).
3. DP arrays: hold[i] = max profit on day i if you hold a stock. sold[i] = max profit if you just sold. rest[i] = max profit if you're resting.
4. Recurrence: hold[i] = max(hold[i-1], rest[i-1] - prices[i]). sold[i] = hold[i-1] + prices[i]. rest[i] = max(rest[i-1], sold[i-1]).
5. Base cases: hold[0] = -prices[0] (buy on day 0), sold[0] = 0 (can't sell on day 0), rest[0] = 0 (start resting).

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n) or O(1) with state variables

### Test Cases

**Test 1:** Multiple transactions with cooldown
- Input: "[1,2,3,0,2]"
- Expected: "3"

**Test 2:** Single day
- Input: "[1]"
- Expected: "0"

**Test 3:** Buy at 1, sell at 4
- Input: "[1,2,4]"
- Expected: "3"

**Test 4:** Buy at 1, sell at 4
- Input: "[2,1,4]"
- Expected: "3"

**Test 5:** Buy at 1, sell at 3, buy at 2, sell at 7
- Input: "[6,1,3,2,4,7]"
- Expected: "6"

---

## 35. Best Time to Buy and Sell Stock IV

**Difficulty:** hard
**Concept:** dynamic-programming
**Family:** dp:stock-profit

### Description

You are given an integer array prices where prices[i] is the price of a given stock on the ith day, and an integer k. Find the maximum profit you can achieve. You may complete at most k transactions. A transaction consists of buying and selling the stock once.

### Examples

**Example 1:**
- Input: k = 2, prices = [2,4,1]
- Output: 2
- Explanation: Buy on day 1 (price = 2) and sell on day 2 (price = 4), profit = 2.

**Example 2:**
- Input: k = 2, prices = [3,2,6,5,0,3]
- Output: 7
- Explanation: Buy on day 2 (price = 2) and sell on day 3 (price = 6), profit = 4. Buy on day 5 (price = 0) and sell on day 6 (price = 3), profit = 3. Total = 7.

### Constraints

- 0 <= k <= 100
- 0 <= prices.length <= 1000
- 0 <= prices[i] <= 1000

### Hints

1. DP state: dp[t][i] = maximum profit using at most t transactions up to day i. You want dp[k][n-1] where n = len(prices).
2. Recurrence: For transaction t and day i, you either don't trade on day i (dp[t][i] = dp[t][i-1]), or you sell on day i. If you sell on day i, you bought on some earlier day j: dp[t][i] = max(prices[i] - prices[j] + dp[t-1][j-1]) for all j < i.
3. Optimization: Avoid O(n^2 * k) time. Instead of checking all j for each i, maintain a variable max_diff = max(dp[t-1][j-1] - prices[j]) and update it as you go. This makes it O(n * k).
4. Alternative approach: Use buy[t] and sell[t] arrays. buy[t] = max profit after buying for tth transaction. sell[t] = max profit after selling for tth transaction.
5. Handle large k. If k >= n/2, you can make unlimited transactions (it's impossible to do more than n/2 buy-sell pairs in n days). Use a greedy approach for that case.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n * k) or O(n) if k >= n/2
- **Space Complexity:** O(n * k) or O(k) with optimization

### Test Cases

**Test 1:** One transaction
- Input: "(2, [2,4,1])"
- Expected: "2"

**Test 2:** Two transactions
- Input: "(2, [3,2,6,5,0,3])"
- Expected: "7"

**Test 3:** Multiple opportunities
- Input: "(2, [3,3,5,0,0,3,1,4])"
- Expected: "6"

**Test 4:** No transactions allowed
- Input: "(0, [1,2,3,4,5])"
- Expected: "0"

**Test 5:** One transaction max
- Input: "(1, [1,2,3,4,5])"
- Expected: "4"

---

## 36. Russian Doll Envelopes

**Difficulty:** hard
**Concept:** dynamic-programming

### Description

You are given a 2D array of integers envelopes where envelopes[i] = [wi, hi] represents the width and the height of an envelope. One envelope can fit into another if and only if both the width and height of one envelope are strictly greater than the other. Return the maximum number of envelopes you can Russian doll (put one inside another). You cannot rotate an envelope.

### Examples

**Example 1:**
- Input: envelopes = [[5,4],[6,4],[6,7],[2,3]]
- Output: 3
- Explanation: The maximum number of envelopes you can Russian doll is 3: [2,3] => [5,4] => [6,7].

**Example 2:**
- Input: envelopes = [[1,1],[1,1],[1,1]]
- Output: 1
- Explanation: All envelopes are the same size, so you can only use one.

### Constraints

- 1 <= envelopes.length <= 10^5
- envelopes[i].length == 2
- 1 <= wi, hi <= 10^5

### Hints

1. This is 2D Longest Increasing Subsequence. You need both width and height to be strictly increasing.
2. Sort by width. First sort envelopes by width in ascending order. If widths are equal, sort by height in descending order (important!).
3. Why descending height for same width? If width is the same, envelopes can't fit into each other. By sorting height descending, we ensure at most one envelope per width group is selected in the LIS.
4. LIS on heights. After sorting, find the LIS of heights using the O(n log n) binary search method (patience sorting).
5. Binary search LIS. Maintain an array 'tails' where tails[i] is the smallest ending height of all increasing subsequences of length i+1. Use binary search to update this array.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(n log n) for sorting and LIS
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** [2,3] => [5,4] => [6,7]
- Input: "[[5,4],[6,4],[6,7],[2,3]]"
- Expected: "3"

**Test 2:** All same size
- Input: "[[1,1],[1,1],[1,1]]"
- Expected: "1"

**Test 3:** Multiple options
- Input: "[[1,3],[3,5],[6,7],[6,8],[8,4],[9,5]]"
- Expected: "3"

**Test 4:** Sort first
- Input: "[[4,5],[4,6],[6,7],[2,3],[1,1]]"
- Expected: "4"

---

## 37. Number of Ways to Stay in the Same Place After Some Steps

**Difficulty:** hard
**Concept:** dynamic-programming

### Description

You have a pointer at index 0 in an array of size arrLen. At each step, you can move 1 position to the left, 1 position to the right, or stay in the same place. Given two integers steps and arrLen, return the number of ways such that your pointer still at index 0 after exactly steps steps. Since the answer may be too large, return it modulo 10^9 + 7.

### Examples

**Example 1:**
- Input: steps = 3, arrLen = 2
- Output: 4
- Explanation: Four ways: stay-stay-stay, stay-right-left, right-left-stay, left(blocked)-stay-stay

**Example 2:**
- Input: steps = 2, arrLen = 4
- Output: 2
- Explanation: Two ways: stay-stay, right-left

**Example 3:**
- Input: steps = 4, arrLen = 2
- Output: 8
- Explanation: Eight ways to return to index 0 after 4 steps

### Constraints

- 1 <= steps <= 500
- 1 <= arrLen <= 10^6

### Hints

1. DP state: dp[i][j] = number of ways to be at position j after i steps. You want dp[steps][0].
2. Recurrence: dp[i][j] = dp[i-1][j-1] (came from left) + dp[i-1][j] (stayed) + dp[i-1][j+1] (came from right). Handle boundaries: j-1 >= 0 and j+1 < arrLen.
3. Optimization: You can't move further than steps from index 0 and still return. So max_pos = min(arrLen - 1, steps // 2 + 1). Only track positions 0 to max_pos.
4. Space optimization: Use two 1D arrays (current and previous) instead of 2D array. Or use a single array with careful updating.
5. Modulo arithmetic: Since the answer can be large, take modulo 10^9 + 7 at each step.

### Starter Code

### Complexity Analysis

- **Time Complexity:** O(steps * min(arrLen, steps))
- **Space Complexity:** O(min(arrLen, steps))

### Test Cases

**Test 1:** Small steps and array
- Input: "(3, 2)"
- Expected: "4"

**Test 2:** Two steps
- Input: "(2, 4)"
- Expected: "2"

**Test 3:** Four steps
- Input: "(4, 2)"
- Expected: "8"

**Test 4:** Larger values with mod
- Input: "(27, 7)"
- Expected: "127784505"

**Test 5:** One step, must stay
- Input: "(1, 1)"
- Expected: "1"

---

## 38. Best Time to Buy and Sell Stock

**Difficulty:** easy
**Concept:** dynamic-programming
**Family:** dp:stock-profit

### Description

You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.

### Examples

**Example 1:**
- Input: prices = [7,1,5,3,6,4]
- Output: 5
- Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5

**Example 2:**
- Input: prices = [7,6,4,3,1]
- Output: 0
- Explanation: In this case, no transactions are done and the max profit = 0

### Hints

1. Think about what information you need to track as you go through each day.
2. What is the minimum price you have seen so far?
3. For each day, what would be the profit if you sold today?

### Starter Code

**Python:**
```python
def maxProfit(prices):
    # Your code here
    pass
```

### Solution

**Python:**
```python
def maxProfit(prices):
    if not prices:
        return 0
    
    min_price = prices[0]
    max_profit = 0
    
    for price in prices:
        # Update minimum price seen so far
        min_price = min(min_price, price)
        
        # Calculate profit if we sell today
        profit = price - min_price
        
        # Update maximum profit
        max_profit = max(max_profit, profit)
    
    return max_profit
```

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

---
