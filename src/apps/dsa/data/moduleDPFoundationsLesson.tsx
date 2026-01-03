import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { module9DynamicProgrammingLessonSmartPracticeExercises } from './exercises/moduleDPFoundationsLessonSmartPracticeExercises';

export const module9DynamicProgrammingLesson: ProgressiveLesson = {
  id: 'dynamic-programming-foundations',
  title: 'Module: Dynamic Programming Foundations',
  description: 'Master memoization, tabulation, and fundamental DP patterns',
  unlockMode: 'sequential',
  sections: [
    {
      type: 'reading',
      id: 'dp-two-conditions',
      title: 'DP Fundamentals: Two Conditions',
      estimatedReadTime: 240,
      autoMarkComplete: false,
      content: `<hr>
<h2>Two Conditions for DP</h2>
<p><strong>1. Overlapping Subproblems</strong></p>
<ul>
<li>Same subproblems computed multiple times</li>
<li>Example: fib(5) calls fib(3) multiple times</li>
</ul>
<p><strong>2. Optimal Substructure</strong></p>
<ul>
<li>Optimal solution contains optimal solutions to subproblems</li>
<li>Example: shortest path from A→C through B uses shortest A→B and B→C</li>
</ul>
<hr>
<h2>Two Approaches</h2>
<h3>Top-Down (Memoization)</h3>
<ul>
<li>Start with original problem</li>
<li>Recursively solve, caching results</li>
<li>Easier to write</li>
<li>Uses recursion stack</li>
</ul>
<h3>Bottom-Up (Tabulation)</h3>
<ul>
<li>Start with base cases</li>
<li>Build up to solution</li>
<li>More efficient (no recursion overhead)</li>
<li>Iterative approach</li>
</ul>
<hr>
<h2>Classic Example: Fibonacci</h2>
<h3>Naive Recursion - O(2ⁿ)</h3>
<pre><code class="language-python">def fib(n):
    if n &lt;= 1:
        return n
    return fib(n-1) + fib(n-2)
</code></pre>
<p><strong>Problem:</strong> Recalculates same values repeatedly!</p>
<pre><code>fib(5)
├── fib(4)
│   ├── fib(3)
│   │   ├── fib(2)
│   │   │   ├── fib(1)
│   │   │   └── fib(0)
│   │   └── fib(1)
│   └── fib(2)  ← Recalculated!
│       ├── fib(1)
│       └── fib(0)
└── fib(3)  ← Recalculated!
    └── ...
</code></pre>
<hr>
<h2>Pattern Recognition</h2>
<p><strong>See &quot;optimal&quot; or &quot;minimum/maximum&quot;?</strong> → Might be DP</p>
<p><strong>See &quot;count number of ways&quot;?</strong> → Likely DP</p>
<p><strong>Recursive solution recalculates subproblems?</strong> → Add memoization</p>
<p><strong>Decision at each step (take/skip)?</strong> → DP pattern</p>
<p>Let&#39;s master DP! 🚀</p>
`,
    },// SECTION 3: 2D DP Problems
    {
      type: 'reading',
      id: '2d-dp-problems',
      title: '2D Dynamic Programming',
      content: `<h1>2D Dynamic Programming 🎲</h1>
<h2>Unique Paths</h2>
<p><strong>Problem:</strong> Robot in m×n grid. Can only move right or down. How many unique paths to bottom-right?</p>
<p><strong>Insight:</strong> To reach cell (i, j), must come from:</p>
<ul>
<li>Cell above (i-1, j)</li>
<li>Cell left (i, j-1)</li>
</ul>
<p><strong>Recurrence:</strong> <code>dp[i][j] = dp[i-1][j] + dp[i][j-1]</code></p>
<pre><code class="language-python">def unique_paths(m, n):
    # Create 2D dp array
    dp = [[0] * n for _ in range(m)]

    # Base cases: first row and column have 1 path
    for i in range(m):
        dp[i][0] = 1
    for j in range(n):
        dp[0][j] = 1

    # Fill the rest
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]

    return dp[m-1][n-1]
</code></pre>
<p><strong>Visualization (3×3):</strong></p>
<pre><code>1  1  1
1  2  3
1  3  6

Cell (2,2) has 6 paths!
</code></pre>
<p><strong>Space-optimized to O(n):</strong></p>
<pre><code class="language-python">def unique_paths_optimized(m, n):
    dp = [1] * n

    for i in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j-1]

    return dp[n-1]
</code></pre>
<hr>
<h2>Minimum Path Sum</h2>
<p><strong>Problem:</strong> Grid with numbers. Move right or down. Find path with minimum sum.</p>
<pre><code class="language-python">def min_path_sum(grid):
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]

    # Base case: top-left
    dp[0][0] = grid[0][0]

    # First row: can only come from left
    for j in range(1, n):
        dp[0][j] = dp[0][j-1] + grid[0][j]

    # First column: can only come from above
    for i in range(1, m):
        dp[i][0] = dp[i-1][0] + grid[i][0]

    # Fill rest: minimum of coming from top or left
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]

    return dp[m-1][n-1]
</code></pre>
<p><strong>Example:</strong></p>
<pre><code>Grid:        DP table:
1  3  1      1  4  5
1  5  1      2  7  6
4  2  1      6  8  7

Minimum sum path: 1→1→5→2→1 = 10? No!
Actually: 1→3→1→1→1 = 7 ✓
</code></pre>
<hr>
<h2>Longest Common Subsequence (LCS)</h2>
<p><strong>Problem:</strong> Find length of longest subsequence common to both strings.</p>
<p><strong>Subsequence:</strong> Not necessarily consecutive! &quot;ace&quot; is subsequence of &quot;abcde&quot;</p>
<pre><code class="language-python">def longest_common_subsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                # Characters match: add 1 to previous diagonal
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                # Take max of excluding one character
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    return dp[m][n]
</code></pre>
<p><strong>Example: &quot;abcde&quot; and &quot;ace&quot;</strong></p>
<pre><code>    &quot;&quot;  a  c  e
&quot;&quot;   0  0  0  0
a    0  1  1  1
b    0  1  1  1
c    0  1  2  2
d    0  1  2  2
e    0  1  2  3

LCS = &quot;ace&quot; with length 3
</code></pre>
<hr>
<h2>Edit Distance</h2>
<p><strong>Problem:</strong> Minimum operations (insert, delete, replace) to convert string1 to string2.</p>
<pre><code class="language-python">def edit_distance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases
    for i in range(m + 1):
        dp[i][0] = i  # Delete all characters
    for j in range(n + 1):
        dp[0][j] = j  # Insert all characters

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                # Characters match: no operation needed
                dp[i][j] = dp[i-1][j-1]
            else:
                # Take minimum of:
                # 1. Replace: dp[i-1][j-1] + 1
                # 2. Delete from word1: dp[i-1][j] + 1
                # 3. Insert into word1: dp[i][j-1] + 1
                dp[i][j] = min(
                    dp[i-1][j-1],  # Replace
                    dp[i-1][j],    # Delete
                    dp[i][j-1]     # Insert
                ) + 1

    return dp[m][n]
</code></pre>
<p><strong>Example: &quot;horse&quot; → &quot;ros&quot;</strong></p>
<pre><code>Replace h→r
Delete o
Delete r
Delete s
Delete e

Actually optimal: 3 operations
</code></pre>
<hr>
<h2>Coin Change</h2>
<p><strong>Problem:</strong> Given coins and amount, find minimum coins to make amount.</p>
<pre><code class="language-python">def coin_change(coins, amount):
    dp = [float(&#39;inf&#39;)] * (amount + 1)
    dp[0] = 0  # 0 coins for amount 0

    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)

    return dp[amount] if dp[amount] != float(&#39;inf&#39;) else -1
</code></pre>
<p><strong>Example: coins=[1,2,5], amount=11</strong></p>
<pre><code>dp[0] = 0
dp[1] = 1 (one 1-coin)
dp[2] = 1 (one 2-coin)
dp[3] = 2 (1+2)
...
dp[11] = 3 (5+5+1)
</code></pre>
<hr>
<h2>2D DP Pattern</h2>
<p><strong>Grid problems:</strong></p>
<pre><code class="language-python">dp = [[0] * n for _ in range(m)]

# Set base cases (first row/column)
# Fill table:
for i in range(1, m):
    for j in range(1, n):
        dp[i][j] = f(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
</code></pre>
<p><strong>String problems:</strong></p>
<pre><code class="language-python">dp = [[0] * (n+1) for _ in range(m+1)]

# Set base cases
# Fill table:
for i in range(1, m+1):
    for j in range(1, n+1):
        if strings_match:
            dp[i][j] = dp[i-1][j-1] + ...
        else:
            dp[i][j] = max/min(dp[i-1][j], dp[i][j-1], ...)
</code></pre>
`,
      estimatedReadTime: 420,
      autoMarkComplete: false,
    },

    // SECTION 4: Module Summary
    {
      type: 'reading',
      id: 'module9-summary',
      title: 'Module Complete!',
      content: `<h1>🎉 Module 9 Complete!</h1>
<h2>What You Mastered</h2>
<h3>DP Fundamentals 💎</h3>
<p>✅ Overlapping subproblems + optimal substructure
✅ Memoization (top-down recursive)
✅ Tabulation (bottom-up iterative)
✅ Space optimization techniques
✅ When to use DP vs other approaches</p>
<h3>1D DP Patterns 📊</h3>
<p>✅ <strong>Fibonacci:</strong> Classic recurrence f(n) = f(n-1) + f(n-2)
✅ <strong>Climbing stairs:</strong> Counting ways (same as fibonacci)
✅ <strong>House robber:</strong> Decision pattern (rob or skip)
✅ <strong>Min cost climbing:</strong> Optimization with choices
✅ <strong>Decode ways:</strong> Counting with constraints</p>
<h3>2D DP Patterns 🎲</h3>
<p>✅ <strong>Unique paths:</strong> Grid navigation
✅ <strong>Minimum path sum:</strong> Optimization in grid
✅ <strong>Longest common subsequence:</strong> String matching
✅ <strong>Edit distance:</strong> String transformation
✅ <strong>Coin change:</strong> Unbounded knapsack variant</p>
<h3>DP Techniques 🛠️</h3>
<p>✅ Identifying recurrence relations
✅ Setting up base cases
✅ Space optimization (2D → 1D)
✅ Iterative vs recursive trade-offs</p>
<hr>
<h2>Pattern Recognition Guide</h2>
<p><strong>&quot;Count number of ways&quot;?</strong> → DP (usually addition in recurrence)</p>
<p><strong>&quot;Find minimum/maximum&quot;?</strong> → DP (min/max in recurrence)</p>
<p><strong>&quot;Is it possible to...?&quot;</strong> → DP (boolean)</p>
<p><strong>Decision at each step (include/exclude)?</strong> → DP decision pattern</p>
<p><strong>Grid navigation (paths)?</strong> → 2D DP</p>
<p><strong>String matching/transformation?</strong> → 2D DP with string comparison</p>
<p><strong>Fibonacci-like pattern?</strong> → 1D DP with f(n) = f(n-1) + f(n-2)</p>
<p><strong>Choice at each step?</strong> → DP with max/min of choices</p>
<hr>
<h2>Common DP Recurrences</h2>
<h3>1D Problems:</h3>
<pre><code>Counting paths: dp[i] = dp[i-1] + dp[i-2]
Optimization: dp[i] = max(dp[i-1], dp[i-2] + value[i])
Min cost: dp[i] = min(dp[i-1], dp[i-2]) + cost[i]
</code></pre>
<h3>2D Grid Problems:</h3>
<pre><code>Paths: dp[i][j] = dp[i-1][j] + dp[i][j-1]
Min sum: dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
</code></pre>
<h3>2D String Problems:</h3>
<pre><code>Match: dp[i][j] = dp[i-1][j-1] + 1
No match: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
</code></pre>
<hr>
<h2>Complexity Patterns</h2>
<table>
<thead>
<tr>
<th>Problem Type</th>
<th>Time</th>
<th>Space</th>
<th>Can Optimize</th>
</tr>
</thead>
<tbody><tr>
<td>1D DP</td>
<td>O(n)</td>
<td>O(n)</td>
<td>→ O(1)</td>
</tr>
<tr>
<td>2D Grid DP</td>
<td>O(m×n)</td>
<td>O(m×n)</td>
<td>→ O(n)</td>
</tr>
<tr>
<td>2D String DP</td>
<td>O(m×n)</td>
<td>O(m×n)</td>
<td>→ O(n)</td>
</tr>
</tbody></table>
<hr>
<h2>Classic Problems to Practice</h2>
<h3>1D DP:</h3>
<ul>
<li>Fibonacci number</li>
<li>Climbing stairs</li>
<li>House robber (I, II, III)</li>
<li>Min cost climbing stairs</li>
<li>Decode ways</li>
<li>Jump game</li>
<li>Maximum subarray</li>
</ul>
<h3>2D DP:</h3>
<ul>
<li>Unique paths (I, II)</li>
<li>Minimum path sum</li>
<li>Longest common subsequence</li>
<li>Edit distance</li>
<li>Coin change</li>
<li>Longest increasing subsequence</li>
<li>Triangle minimum path sum</li>
</ul>
<h3>Advanced:</h3>
<ul>
<li>Knapsack problem (0/1, unbounded)</li>
<li>Partition equal subset sum</li>
<li>Word break</li>
<li>Maximum product subarray</li>
<li>Interleaving string</li>
</ul>
`,
    },

    // Edit Distance - Classic 2D String DP
    ,// Word Break - 1D DP with string checking
    ,{
      type: 'reading',
      id: 'dp-summary',
      title: 'DP Patterns Summary',
      content: `<h1>Dynamic Programming Patterns Summary</h1>
<hr>
<h2>DP Development Process</h2>
<ol>
<li><p><strong>Identify if DP is applicable:</strong></p>
<ul>
<li>Overlapping subproblems?</li>
<li>Optimal substructure?</li>
</ul>
</li>
<li><p><strong>Define state:</strong></p>
<ul>
<li>What does dp[i] or dp[i][j] represent?</li>
</ul>
</li>
<li><p><strong>Find recurrence relation:</strong></p>
<ul>
<li>How to compute dp[i] from previous states?</li>
</ul>
</li>
<li><p><strong>Determine base cases:</strong></p>
<ul>
<li>What are dp[0], dp[1], etc.?</li>
</ul>
</li>
<li><p><strong>Decide direction:</strong></p>
<ul>
<li>Build bottom-up or top-down?</li>
</ul>
</li>
<li><p><strong>Optimize space:</strong></p>
<ul>
<li>Can we reduce dimensions?</li>
</ul>
</li>
</ol>
<hr>
<h2>Key Insights</h2>
<ol>
<li><p><strong>DP = Careful brute force with memory</strong></p>
</li>
<li><p><strong>Memoization easier to write, tabulation often faster</strong></p>
</li>
<li><p><strong>Space optimization: only keep what you need for next step</strong></p>
</li>
<li><p><strong>Draw small examples to find patterns</strong></p>
</li>
<li><p><strong>Base cases are crucial - get them right first</strong></p>
</li>
<li><p><strong>2D DP often optimizable to 1D</strong></p>
</li>
</ol>
<hr>
<h2>Next Steps</h2>
<p><strong>Module 10: Heaps &amp; Priority Queues</strong> - Master heap data structure and top-K patterns!</p>
<p>You&#39;ll learn:</p>
<ul>
<li>Heap properties and operations</li>
<li>Min-heap vs max-heap</li>
<li>Top K problems</li>
<li>Merge K sorted lists</li>
</ul>
<p><strong>Ready to continue?</strong> Let&#39;s go! 🚀</p>
`,
      estimatedReadTime: 300,
      autoMarkComplete: false,
    },
  
  ...module9DynamicProgrammingLessonSmartPracticeExercises,
  ],
};
