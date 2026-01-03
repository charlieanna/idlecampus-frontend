import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module9DynamicProgrammingLessonSmartPracticeExercises: ExerciseSection[] = [
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-climbing-stairs',
      title: 'Code: Climbing Stairs',
      description: 'DP problem for climbing stairs',
      instruction: `# Climbing Stairs - Coding Exercise

You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

## Examples

\`\`\`
Input: n = 2
Output: 2
Explanation: There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps
\`\`\`

\`\`\`
Input: n = 3
Output: 3
Explanation: There are three ways to climb to the top.
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step
\`\`\`

**Time:** O(n) - each subproblem solved once
**Space:** O(n) - cache + recursion stack

### Tabulation (Bottom-Up)
\`\`\`python
def fib_tab(n):
    if n <= 1:
        return n

    dp = [0] * (n + 1)
    dp[1] = 1

    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]

    return dp[n]
\`\`\`

**Time:** O(n)
**Space:** O(n)

### Space-Optimized
\`\`\`python
def fib_optimized(n):
    if n <= 1:
        return n

    prev2, prev1 = 0, 1

    for i in range(2, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current

    return prev1
\`\`\`

**Space:** O(1) - only need last 2 values!

---

## Climbing Stairs

**Problem:** You can climb 1 or 2 steps. How many ways to reach the top?

**Insight:** To reach step n, you either:
- Came from step n-1 (then climb 1)
- Came from step n-2 (then climb 2)

**Recurrence:** \`ways(n) = ways(n-1) + ways(n-2)\`

\`\`\`python
def climb_stairs(n):
    if n <= 2:
        return n

    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2

    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]

    return dp[n]
\`\`\`

**It's fibonacci in disguise!**

---

## House Robber

**Problem:** Houses in a row with money. Can't rob adjacent houses. Maximize money robbed.

**Insight:** At house i, either:
- Rob it: money[i] + best from houses up to i-2
- Skip it: best from houses up to i-1

**Recurrence:** \`dp[i] = max(money[i] + dp[i-2], dp[i-1])\`

\`\`\`python
def rob(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]

    dp = [0] * len(nums)
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])

    for i in range(2, len(nums)):
        dp[i] = max(nums[i] + dp[i-2], dp[i-1])

    return dp[-1]
\`\`\`

**Space-optimized:**
\`\`\`python
def rob_optimized(nums):
    if not nums:
        return 0

    prev2, prev1 = 0, 0

    for num in nums:
        current = max(num + prev2, prev1)
        prev2 = prev1
        prev1 = current

    return prev1
\`\`\`

---

## Min Cost Climbing Stairs

**Problem:** Each step has cost. Can start at index 0 or 1. Can climb 1 or 2 steps. Minimize cost.

\`\`\`python
def min_cost_climbing(cost):
    n = len(cost)
    if n <= 1:
        return 0

    dp = [0] * (n + 1)

    # Can start at 0 or 1 for free
    dp[0] = dp[1] = 0

    for i in range(2, n + 1):
        # Cost to reach i from i-1 or i-2
        dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])

    return dp[n]
\`\`\`

**Visualization for [10, 15, 20]:**
\`\`\`
Start: 0 or 1 (free)

From 0→2: cost 10
From 1→2: cost 15
Best to 2: min(0+10, 0+15) = 10

From 2→3: cost 10+20=30
From 1→3: cost 0+15=15
Best to 3 (top): 15
\`\`\`

---

## Decode Ways

**Problem:** 'A'=1, 'B'=2, ..., 'Z'=26. Count ways to decode string "226".

\`\`\`python
def num_decodings(s):
    if not s or s[0] == '0':
        return 0

    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1  # Empty string
    dp[1] = 1  # First character (if not '0')

    for i in range(2, n + 1):
        # Single digit
        if s[i-1] != '0':
            dp[i] += dp[i-1]

        # Two digits
        two_digit = int(s[i-2:i])
        if 10 <= two_digit <= 26:
            dp[i] += dp[i-2]

    return dp[n]
\`\`\`

**Example: "226"**
- Can be: 2|2|6 (B, B, F)
- Or: 22|6 (V, F)
- Or: 2|26 (B, Z)
- Total: 3 ways

---

## The 1D DP Pattern

**General structure:**
\`\`\`python
# Initialize dp array
dp = [base_case] * (n + 1)

# Set base cases
dp[0] = ...
dp[1] = ...

# Fill using recurrence relation
for i in range(2, n + 1):
    dp[i] = f(dp[i-1], dp[i-2], ...)

return dp[n]
\`\`\`

**Common recurrences:**
- \`dp[i] = dp[i-1] + dp[i-2]\` (counting paths)
- \`dp[i] = max(dp[i-1], dp[i-2] + value)\` (optimization)
- \`dp[i] = min(dp[i-1], dp[i-2]) + cost\` (min cost)`,
      starterCode: `def climbStairs(n):
    pass

# Test cases
print(climbStairs(2))  # Should print 2`,
      testCases: [
        { input: '2', expectedOutput: '2' },
        { input: '3', expectedOutput: '3' },
        { input: '1', expectedOutput: '1' },
        { input: '5', expectedOutput: '8' },
        { input: '10', expectedOutput: '89' },
      ],
      hints: [
        { afterAttempt: 1, text: 'Start by handling n <= 2 directly—they are trivial base cases.' },
        { afterAttempt: 2, text: 'Think of how many ways exist to reach step n from step n-1 or n-2.' },
        { afterAttempt: 3, text: 'Store previous results (memo array or two rolling vars) to avoid recomputation.' }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Climbing Stairs - DP Solution

\`\`\`python
def climbStairs(n):
    if n <= 2:
        return n

    prev2, prev1 = 1, 2

    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current

    return prev1
\`\`\`

# Key insight: To reach step n, come from n-1 (1 step) or n-2 (2 steps)`
      },
      targetComplexity: {
        time: 'O(n)',
        space: 'O(1)'
      },
      solutionExplanation: `## Time Complexity Analysis

**climbStairs(n)**: O(n)
- Single loop from 3 to n

### Space Complexity: O(1)
- Only track last 2 values`,
      estimatedReadTime: 420,
      autoMarkComplete: false,
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-edit-distance',
      title: 'Code: Edit Distance',
      description: 'Find minimum operations to convert one string to another',
      requiredForProgress: true,
      instruction: `# Edit Distance (LeetCode 72)

Given two strings \`word1\` and \`word2\`, return the minimum number of operations required to convert \`word1\` to \`word2\`.

You have the following three operations permitted on a word:
- **Insert** a character
- **Delete** a character
- **Replace** a character

## Examples

**Example 1:**
\`\`\`
Input: word1 = "horse", word2 = "ros"
Output: 3

Explanation: 
horse -> rorse (replace 'h' with 'r')
rorse -> rose (remove 'r')
rose -> ros (remove 'e')
\`\`\`

**Example 2:**
\`\`\`
Input: word1 = "intention", word2 = "execution"
Output: 5

Explanation: 
intention -> inention (remove 't')
inention -> enention (replace 'i' with 'e')
enention -> exention (replace 'n' with 'x')
exention -> exection (replace 'n' with 'c')
exection -> execution (insert 'u')
\`\`\`

## Constraints
- 0 <= word1.length, word2.length <= 500
- word1 and word2 consist of lowercase English letters`,
      starterCode: `def minDistance(word1, word2):
    # dp[i][j] = min operations to convert word1[0:i] to word2[0:j]
    pass`,
      expectedOutput: `def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    
    # dp[i][j] = min ops to convert word1[0:i] to word2[0:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases: converting to/from empty string
    for i in range(m + 1):
        dp[i][0] = i  # delete all chars from word1
    for j in range(n + 1):
        dp[0][j] = j  # insert all chars to word1
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]  # chars match, no op needed
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],    # delete from word1
                    dp[i][j-1],    # insert into word1
                    dp[i-1][j-1]   # replace
                )
    
    return dp[m][n]`,
      hints: [
        { afterAttempt: 1, text: 'Use 2D DP: dp[i][j] = min operations to convert word1[0:i] to word2[0:j].' },
        { afterAttempt: 2, text: 'If chars match: dp[i][j] = dp[i-1][j-1]. If not: try all 3 operations and take minimum.' },
        { afterAttempt: 3, text: 'Base cases: dp[i][0] = i (delete all), dp[0][j] = j (insert all).' }
      ],
      solution: {
        afterAttempt: 4,
        text: `## Solution - O(m×n) time, O(m×n) space

\`\`\`python
def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    
    return dp[m][n]
\`\`\`

**Key insight:** Each cell represents choosing the best of 3 operations.`
      },
      targetComplexity: { time: 'O(m×n)', space: 'O(m×n)' },
      testCases: [
        { input: '"horse", "ros"', expectedOutput: '3' },
        { input: '"intention", "execution"', expectedOutput: '5' },
        { input: '"", "a"', expectedOutput: '1' },
        { input: '"a", "a"', expectedOutput: '0' }
      ],
      solutionExplanation: `## The Brute-Force Instinct

Try all possible sequences of operations recursively:

\`\`\`python
def minDistance(word1, word2):
    def helper(i, j):
        if i == 0: return j  # insert remaining chars
        if j == 0: return i  # delete remaining chars
        
        if word1[i-1] == word2[j-1]:
            return helper(i-1, j-1)  # chars match
        
        return 1 + min(
            helper(i-1, j),    # delete
            helper(i, j-1),    # insert
            helper(i-1, j-1)   # replace
        )
    
    return helper(len(word1), len(word2))
\`\`\`

This is O(3^(m+n)) – exponential! Each state branches into 3 possibilities.

---

## Spotting the Overlapping Subproblems

Draw the recursion tree for "ab" → "a":

\`\`\`
helper(2, 1)
├── helper(1, 1) [delete 'b']
│   └── helper(0, 0) chars match
├── helper(2, 0) [insert 'a'] 
│   └── helper(1, 0) [delete 'a']
└── helper(1, 0) [replace 'b' with 'a']
    └── helper(0, 0)
\`\`\`

Notice: \`helper(1, 0)\` is computed multiple times!

---

## The DP Solution

Define: \`dp[i][j]\` = minimum operations to convert \`word1[0:i]\` to \`word2[0:j]\`

**Base cases:**
- \`dp[i][0] = i\` → delete all i characters from word1
- \`dp[0][j] = j\` → insert all j characters into word1

**Recurrence:**
\`\`\`python
if word1[i-1] == word2[j-1]:
    dp[i][j] = dp[i-1][j-1]  # characters match, no operation
else:
    dp[i][j] = 1 + min(
        dp[i-1][j],    # delete word1[i-1]
        dp[i][j-1],    # insert word2[j-1]
        dp[i-1][j-1]   # replace word1[i-1] with word2[j-1]
    )
\`\`\`

---

## Visual Walkthrough

Converting "horse" to "ros":

\`\`\`
      ""  r  o  s
  ""   0  1  2  3
  h    1  1  2  3
  o    2  2  1  2
  r    3  2  2  2
  s    4  3  3  2
  e    5  4  4  3  ← answer
\`\`\`

Reading the path backwards: 3 operations needed.

---

## The Pattern

**2D String DP** follows this structure:
- \`dp[i][j]\` relates substrings/prefixes
- If chars match: diagonal transition (no cost)
- If chars differ: try all operations, take best

This same pattern appears in:
- Longest Common Subsequence
- Regular Expression Matching
- Wildcard Matching
- Interleaving String`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-word-break',
      title: 'Code: Word Break',
      description: 'Check if string can be segmented into dictionary words',
      requiredForProgress: true,
      instruction: `# Word Break (LeetCode 139)

Given a string \`s\` and a dictionary of strings \`wordDict\`, return \`true\` if \`s\` can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.

## Examples

**Example 1:**
\`\`\`
Input: s = "leetcode", wordDict = ["leet","code"]
Output: true
Explanation: "leetcode" can be segmented as "leet code".
\`\`\`

**Example 2:**
\`\`\`
Input: s = "applepenapple", wordDict = ["apple","pen"]
Output: true
Explanation: "applepenapple" can be segmented as "apple pen apple".
Note that you can reuse "apple".
\`\`\`

**Example 3:**
\`\`\`
Input: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
Output: false
\`\`\`

## Constraints
- 1 <= s.length <= 300
- 1 <= wordDict.length <= 1000
- 1 <= wordDict[i].length <= 20
- s and wordDict[i] consist of only lowercase English letters
- All the strings of wordDict are unique`,
      starterCode: `def wordBreak(s, wordDict):
    # dp[i] = True if s[0:i] can be segmented
    pass`,
      expectedOutput: `def wordBreak(s, wordDict):
    word_set = set(wordDict)
    n = len(s)
    
    # dp[i] = True if s[0:i] can be segmented
    dp = [False] * (n + 1)
    dp[0] = True  # empty string is valid
    
    for i in range(1, n + 1):
        for j in range(i):
            # If s[0:j] is valid AND s[j:i] is in dictionary
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[n]`,
      hints: [
        { afterAttempt: 1, text: 'Use DP: dp[i] = True if s[0:i] can be segmented into dictionary words.' },
        { afterAttempt: 2, text: 'For each position i, check all possible last words: if dp[j] is True and s[j:i] is in wordDict, then dp[i] = True.' },
        { afterAttempt: 3, text: 'Convert wordDict to a set for O(1) lookup. Base case: dp[0] = True (empty string).' }
      ],
      solution: {
        afterAttempt: 4,
        text: `## Solution - O(n² × k) time, O(n) space

Where n = length of s, k = max word length

\`\`\`python
def wordBreak(s, wordDict):
    word_set = set(wordDict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[n]
\`\`\`

**Key insight:** For each position, find if ANY valid split exists.`
      },
      targetComplexity: { time: 'O(n²)', space: 'O(n)' },
      testCases: [
        { input: '"leetcode", ["leet","code"]', expectedOutput: 'True' },
        { input: '"applepenapple", ["apple","pen"]', expectedOutput: 'True' },
        { input: '"catsandog", ["cats","dog","sand","and","cat"]', expectedOutput: 'False' }
      ],
      solutionExplanation: `## The Brute-Force Instinct

Try all possible ways to split the string:

\`\`\`python
def wordBreak(s, wordDict):
    word_set = set(wordDict)
    
    def canBreak(start):
        if start == len(s):
            return True
        
        for end in range(start + 1, len(s) + 1):
            if s[start:end] in word_set and canBreak(end):
                return True
        
        return False
    
    return canBreak(0)
\`\`\`

This is exponential – O(2^n) in the worst case. Consider "aaaa...a" with wordDict = ["a", "aa", "aaa", ...].

---

## Spotting the Overlapping Subproblems

For s = "leetcode":

\`\`\`
canBreak(0)
├── try "l" (not in dict)
├── try "le" (not in dict)
├── try "lee" (not in dict)
├── try "leet" (in dict!) → canBreak(4)
│   ├── try "c" (not in dict)
│   ├── try "co" (not in dict)
│   ├── try "cod" (not in dict)
│   └── try "code" (in dict!) → canBreak(8) → True!
...
\`\`\`

What if multiple paths lead to \`canBreak(4)\`? We'd recompute it!

---

## The DP Solution

Define: \`dp[i] = True\` if \`s[0:i]\` can be segmented into dictionary words.

**Base case:** \`dp[0] = True\` (empty string is valid)

**Recurrence:**
\`\`\`python
dp[i] = True if there exists j where:
    - dp[j] is True (s[0:j] is valid)
    - s[j:i] is in wordDict (last word is valid)
\`\`\`

---

## Walking Through an Example

s = "leetcode", wordDict = ["leet", "code"]

\`\`\`
dp[0] = True  (base case)

i=1: s[0:1]="l" → no j works → dp[1] = False
i=2: s[0:2]="le" → no j works → dp[2] = False
i=3: s[0:3]="lee" → no j works → dp[3] = False
i=4: s[0:4]="leet" → j=0: dp[0]=True, "leet" in dict → dp[4] = True!

i=5: s[0:5]="leetc" → no j works → dp[5] = False
i=6: s[0:6]="leetco" → no j works → dp[6] = False
i=7: s[0:7]="leetcod" → no j works → dp[7] = False
i=8: s[0:8]="leetcode" → j=4: dp[4]=True, "code" in dict → dp[8] = True!
\`\`\`

---

## Optimization: Limit Word Length

Instead of checking all j from 0 to i, only check j values where \`s[j:i]\` could be a valid word:

\`\`\`python
def wordBreak(s, wordDict):
    word_set = set(wordDict)
    max_len = max(len(w) for w in wordDict)  # max word length
    
    dp = [False] * (len(s) + 1)
    dp[0] = True
    
    for i in range(1, len(s) + 1):
        # Only check last max_len characters
        for j in range(max(0, i - max_len), i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[len(s)]
\`\`\`

This reduces time to O(n × k) where k = max word length.

---

## The Pattern

**"Can this be composed from smaller pieces?"** → DP

Similar problems:
- Coin Change (compose amount from coins)
- Perfect Squares (compose n from squares)
- Decode Ways (compose string from codes)`
    }
];
