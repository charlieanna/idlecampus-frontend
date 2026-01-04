import { ProgressiveLesson, LessonSection } from '../types/progressive-lesson-enhanced';
import { module11DynamicProgrammingLessonSmartPracticeExercises } from './exercises/moduleDynamicProgrammingLessonSmartPracticeExercises';

export const module11DynamicProgrammingLesson: ProgressiveLesson = {
  id: 'dynamic-programming',
    title: 'Module: Dynamic Programming',
    description: 'Transform slow recursion into fast DP using memoization - spot and cache repeated subproblems in recursion trees',
    unlockMode: 'sequential',
    sections: [
        // ============================================================
        // PART 0: IDENTIFYING THE PROBLEM (Items 1-3)
        // ============================================================

        // ITEM 1: Review Fibonacci
        {
            type: 'reading',
            id: 'review-fibonacci',
            title: 'Review: Fibonacci from Module 6',
            content: `<h1>Review: Fibonacci from Module 6 🔄</h1>
<p>Remember Fibonacci from Module 6? Let&#39;s revisit it with fresh eyes!</p>
<h2>The Naive Recursive Solution</h2>
<pre><code class="language-python">def fib(n):
    if n &lt;= 1:
        return n
    return fib(n-1) + fib(n-2)
</code></pre>
<p>Simple and elegant! But there&#39;s a problem...</p>
<h2>Draw the Tree for fib(6)</h2>
<p>From Module 9, you learned to draw recursion trees. Let&#39;s draw fib(6):</p>
<pre><code>                          fib(6)
                        /        \
                  fib(5)          fib(4)
                 /      \         /      \
            fib(4)    fib(3)  fib(3)    fib(2)
           /    \     /   \    /   \     /   \
      fib(3) fib(2) f(2) f(1) f(2) f(1) f(1) f(0)
      /   \   /  \
   f(2) f(1) f(1) f(0)
   /  \
f(1) f(0)
</code></pre>
<h2>Count the Repeated Work! 🔍</h2>
<p>Let&#39;s count how many times each value is computed:</p>
<ul>
<li><strong>fib(4)</strong>: computed <strong>2 times</strong></li>
<li><strong>fib(3)</strong>: computed <strong>3 times</strong></li>
<li><strong>fib(2)</strong>: computed <strong>5 times</strong></li>
<li><strong>fib(1)</strong>: computed <strong>8 times</strong></li>
<li><strong>fib(0)</strong>: computed <strong>5 times</strong></li>
</ul>
<p><strong>We&#39;re doing the SAME work over and over!</strong> 😱</p>
<h2>The Waste</h2>
<p>For fib(6), we make <strong>25 function calls</strong> total!</p>
<p>For fib(10): <strong>177 calls</strong>
For fib(20): <strong>21,891 calls</strong>
For fib(30): <strong>2,692,537 calls</strong> 💥</p>
<p><strong>Time complexity</strong>: O(2ⁿ) - exponential!</p>
<p>Try running fib(50) - you&#39;ll wait forever!</p>
<h2>The Question</h2>
<p><strong>What if we could remember the answers we already computed?</strong></p>
<p>Instead of computing fib(3) three times, compute it ONCE and remember it!</p>
<p>That&#39;s the key insight of <strong>Dynamic Programming</strong>! 🎯</p>
<hr>
<h2>The Inefficiency Pattern</h2>
<p>Notice the pattern:</p>
<ol>
<li>✅ <strong>Recursive solution exists</strong> (we have one!)</li>
<li>❌ <strong>Same subproblems computed multiple times</strong> (fib(3), fib(2), etc.)</li>
<li>💡 <strong>Solution</strong>: Cache the results!</li>
</ol>
<p><strong>Next</strong>: Let&#39;s see another problem with the same pattern! 🚀</p>
`,
            estimatedReadTime: 180,
            autoMarkComplete: false,
        },

        // ITEM 2: Climbing Stairs
        {
            type: 'reading',
            id: 'climbing-stairs-pattern',
            title: 'Climbing Stairs - Same Pattern!',
            content: `<h1>Climbing Stairs - Same Pattern! 🪜</h1>
<h2>The Problem</h2>
<p>You&#39;re climbing stairs. You can take <strong>1 step</strong> or <strong>2 steps</strong> at a time.</p>
<p><strong>Question</strong>: How many <strong>distinct ways</strong> can you climb to the top?</p>
<h3>Example</h3>
<pre><code>n = 3 stairs

Ways:
1. 1 + 1 + 1 (three 1-steps)
2. 1 + 2     (1-step then 2-step)
3. 2 + 1     (2-step then 1-step)

Answer: 3 ways
</code></pre>
<h2>The Recursive Insight</h2>
<p>To reach stair <strong>n</strong>, you could have come from:</p>
<ul>
<li>Stair <strong>n-1</strong> (take 1 step)</li>
<li>Stair <strong>n-2</strong> (take 2 steps)</li>
</ul>
<p><strong>Recurrence relation:</strong></p>
<pre><code>ways(n) = ways(n-1) + ways(n-2)
</code></pre>
<p><strong>Wait... that&#39;s exactly like Fibonacci!</strong> 🤔</p>
<h2>The Naive Solution</h2>
<pre><code class="language-python">def climbStairs(n):
    if n &lt;= 2:
        return n
    return climbStairs(n-1) + climbStairs(n-2)
</code></pre>
<h2>Draw the Tree for n=5</h2>
<pre><code>                    ways(5)
                   /       \
              ways(4)      ways(3)
              /     \       /     \
         ways(3) ways(2) ways(2) ways(1)
         /    \
    ways(2) ways(1)
</code></pre>
<p><strong>Same problem!</strong> ways(3) computed 2 times, ways(2) computed 3 times!</p>
<h2>The Pattern</h2>
<p>Different problems, <strong>same inefficiency</strong>:</p>
<ul>
<li>✅ Recursive structure (problem breaks into subproblems)</li>
<li>❌ Overlapping subproblems (same subproblems repeated)</li>
<li>💡 Solution: <strong>Memoization</strong>!</li>
</ul>
<h2>Time Complexity</h2>
<p>Naive: <strong>O(2ⁿ)</strong> - exponential waste!</p>
<p>With memoization: <strong>O(n)</strong> - each ways(i) computed once!</p>
<p><strong>Next</strong>: Let&#39;s formally define Dynamic Programming! 📚</p>
`,
            estimatedReadTime: 180,
            autoMarkComplete: false,
        },

        // ITEM 3: What is DP?
        {
            type: 'reading',
            id: 'what-is-dp',
            title: 'What is Dynamic Programming?',
            content: `<h1>What is Dynamic Programming? 💎</h1>
<p><strong>Dynamic Programming (DP)</strong> is <strong>backtracking with repeated nodes</strong>!</p>
<p>Remember Module 11 (Backtracking)? You learned to:</p>
<ul>
<li>Draw decision trees</li>
<li>Build solutions level by level</li>
<li>Use backtracking to explore all possibilities</li>
</ul>
<p><strong>DP is the same, BUT:</strong></p>
<ul>
<li>Your backtracking tree has <strong>repeated nodes</strong> (same subproblem computed multiple times)</li>
<li><strong>Solution</strong>: Cache results with memoization!</li>
</ul>
<p><strong>Simple formula:</strong></p>
<pre><code>DP = Backtracking + Memoization (for repeated nodes)
</code></pre>
<hr>
<h2>When to Use DP</h2>
<p>A problem is a good DP candidate if it has:</p>
<h3>1. Optimal Substructure</h3>
<p>The optimal solution contains optimal solutions to subproblems.</p>
<p><strong>Example</strong>: Shortest path from A→C through B = shortest(A→B) + shortest(B→C)</p>
<h3>2. Overlapping Subproblems ⭐</h3>
<p>The same subproblems are computed <strong>multiple times</strong> (repeated nodes in the tree).</p>
<p><strong>Example</strong>: Fibonacci - fib(3) computed multiple times in fib(6) tree</p>
<p><strong>Key insight:</strong></p>
<ul>
<li><strong>Backtracking</strong>: Each node is unique (no repeats) → explore all paths</li>
<li><strong>DP</strong>: Same nodes appear multiple times → cache results!</li>
</ul>
<p><strong>Visual:</strong></p>
<pre><code>Backtracking Tree:        DP Tree (with repeats):
     []                        fib(6)
    /  \                      /      \
  [1]  [2]              fib(5)      fib(4)
  / \  / \              /    \      /    \
[1,2][1,3][2,3]      fib(4) fib(3) fib(3) fib(2)  ← fib(3) repeated!
                      /  \   /  \   /  \   /  \
                   fib(3) f(2) f(2) f(1) f(2) f(1)  ← fib(2) repeated!
</code></pre>
<hr>
<h2>The DP Approach: Memoization (Top-Down) ⬇️</h2>
<p>Start with recursive solution, add caching:</p>
<pre><code class="language-python">def fib(n, memo={}):
    # Check cache
    if n in memo:
        return memo[n]  # Reuse!

    # Base case
    if n &lt;= 1:
        return n

    # Compute
    result = fib(n-1, memo) + fib(n-2, memo)

    # Cache before returning
    memo[n] = result
    return result
</code></pre>
<p><strong>Process</strong>: Problem → smaller problems → ... → base case</p>
<p><strong>Why memoization?</strong></p>
<ul>
<li><strong>Natural</strong>: Matches the recursive thinking</li>
<li><strong>Efficient</strong>: Only computes states that are actually needed</li>
<li><strong>Pattern-based</strong>: Same 3 steps for every problem (check cache, compute, store)</li>
</ul>
<hr>
<h2>Time Complexity Comparison</h2>
<p><strong>Fibonacci Example:</strong></p>
<table>
<thead>
<tr>
<th>Approach</th>
<th>Time</th>
<th>Space</th>
<th>Notes</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Naive recursion</strong></td>
<td>O(2ⁿ)</td>
<td>O(n)</td>
<td>Recomputes everything</td>
</tr>
<tr>
<td><strong>Memoization</strong></td>
<td>O(n)</td>
<td>O(n)</td>
<td>Each fib(i) computed once + call stack</td>
</tr>
<tr>
<td><strong>Memoization optimized</strong></td>
<td>O(n)</td>
<td>O(1)</td>
<td>Track only last 2 values instead of full memo</td>
</tr>
</tbody></table>
<p><strong>From O(2ⁿ) to O(n) - that&#39;s the power of memoization!</strong> 🚀</p>
<hr>
<h2>How to Identify DP Problems</h2>
<p>🔍 <strong>Draw the recursion tree</strong></p>
<ul>
<li>Same nodes appear multiple times? → Overlapping subproblems!</li>
</ul>
<p>🔍 <strong>Look for these keywords</strong>:</p>
<ul>
<li>&quot;Maximum/minimum...&quot; (optimization)</li>
<li>&quot;How many ways...&quot; (counting)</li>
<li>&quot;Longest/shortest...&quot; (optimization)</li>
<li>&quot;Can you...&quot; with choices (yes/no decision)</li>
</ul>
<p>🔍 <strong>Can you define a recurrence relation?</strong></p>
<ul>
<li>If yes, and subproblems overlap → DP!</li>
</ul>
<hr>
<h2>The Memoization Recipe</h2>
<ol>
<li><strong>Define the state</strong>: What information uniquely identifies a subproblem?</li>
<li><strong>Find the recurrence</strong>: How does the current state relate to smaller states?</li>
<li><strong>Identify base cases</strong>: What are the simplest cases?</li>
<li><strong>Add memoization</strong>: Check cache → Compute → Store result</li>
</ol>
<hr>
<p><strong>Next</strong>: Let&#39;s implement memoization! Time to see the speedup! 🎯</p>
`,
            estimatedReadTime: 240,
            autoMarkComplete: false,
        },

        // ============================================================
        // PART 1: RECURSION → MEMOIZATION (Items 4-7)
        // ============================================================

        // ITEM 4: Fibonacci with Memo
        ,// ITEM 5: Climbing Stairs with Memo
        ,// ITEM 6: Memoization Template
        {
            type: 'reading',
            id: 'memoization-template',
            title: 'The Universal Memoization Template',
            content: `<h1>The Universal Memoization Template 📋</h1>
<p>Every memoization solution follows the same pattern!</p>
<h2>The Template</h2>
<pre><code class="language-python">def solve(state, memo={}):
    # STEP 1: Convert state to hashable key
    key = make_key(state)

    # STEP 2: Check cache
    if key in memo:
        return memo[key]  # Reuse cached result!

    # STEP 3: Base case
    if is_base_case(state):
        return base_value

    # STEP 4: Recursive computation
    result = recursive_computation(state, memo)

    # STEP 5: Cache before returning
    memo[key] = result
    return result
</code></pre>
<hr>
<h2>Key Components</h2>
<h3>1. The Memo Key</h3>
<p><strong>Must be hashable!</strong></p>
<p>Good keys:</p>
<ul>
<li><code>n</code> (single integer)</li>
<li><code>(i, j)</code> (tuple)</li>
<li><code>(index, sum)</code> (tuple of values)</li>
</ul>
<p>Bad keys:</p>
<ul>
<li><code>[1, 2, 3]</code> (list - not hashable!)</li>
<li><code>{&quot;key&quot;: &quot;value&quot;}</code> (dict - not hashable!)</li>
</ul>
<p><strong>Fix:</strong> Convert to tuple: <code>tuple([1,2,3])</code></p>
<hr>
<h3>2. Check Cache First</h3>
<pre><code class="language-python">if key in memo:
    return memo[key]
</code></pre>
<p>This is the <strong>optimization</strong>! Skip recomputation.</p>
<hr>
<h3>3. Store Before Returning</h3>
<pre><code class="language-python">memo[key] = result
return result
</code></pre>
<p><strong>Common mistake:</strong> Forgetting to store!</p>
<hr>
<h2>Common Patterns</h2>
<h3>Pattern 1: Single Parameter</h3>
<pre><code class="language-python">def fib(n, memo={}):
    if n in memo:
        return memo[n]
    # ...
    memo[n] = result
    return result
</code></pre>
<p><strong>Key:</strong> Just <code>n</code></p>
<hr>
<h3>Pattern 2: Multiple Parameters</h3>
<pre><code class="language-python">def dp(i, j, memo={}):
    key = (i, j)
    if key in memo:
        return memo[key]
    # ...
    memo[key] = result
    return result
</code></pre>
<p><strong>Key:</strong> Tuple <code>(i, j)</code></p>
<hr>
<h3>Pattern 3: State + Array</h3>
<pre><code class="language-python">def solve(index, nums, memo={}):
    # nums doesn&#39;t change, so key is just index
    if index in memo:
        return memo[index]
    # ...
    memo[index] = result
    return result
</code></pre>
<p><strong>Key:</strong> Just the changing part (<code>index</code>)</p>
<hr>
<h2>Time Complexity Analysis</h2>
<p><strong>Without memo:</strong> O(2ⁿ) - tree has 2ⁿ nodes</p>
<p><strong>With memo:</strong> O(n) - each unique state computed once</p>
<h3>Example: Fibonacci</h3>
<ul>
<li><strong>Unique states:</strong> fib(0), fib(1), ..., fib(n) = n+1 states</li>
<li><strong>Work per state:</strong> O(1) (just addition)</li>
<li><strong>Total:</strong> O(n)</li>
</ul>
<p>🎯 <strong>Massive speedup!</strong> 2ⁿ → n</p>
<hr>
<h2>Space Complexity</h2>
<p><strong>Memo size:</strong> O(number of unique states)</p>
<ul>
<li>Fibonacci: O(n) - n unique values</li>
<li>Grid paths: O(m × n) - m×n unique cells</li>
<li>Subset sum: O(n × target) - n indices × target values</li>
</ul>
<hr>
<h2>Common Mistakes</h2>
<h3>❌ Mistake 1: Forgetting to Store</h3>
<pre><code class="language-python">def fib(n, memo={}):
    if n in memo:
        return memo[n]
    if n &lt;= 1:
        return n
    result = fib(n-1, memo) + fib(n-2, memo)
    return result  # ❌ Didn&#39;t store!
</code></pre>
<p><strong>Fix:</strong> <code>memo[n] = result</code> before returning</p>
<hr>
<h3>❌ Mistake 2: Wrong Key</h3>
<pre><code class="language-python">def dp(nums, memo={}):
    key = nums  # ❌ List is not hashable!
    # ...
</code></pre>
<p><strong>Fix:</strong> <code>key = tuple(nums)</code></p>
<hr>
<h3>❌ Mistake 3: Mutable Default</h3>
<pre><code class="language-python">def solve(n, memo={}):  # ❌ Shared across calls!
    # ...
</code></pre>
<p><strong>Fix:</strong></p>
<pre><code class="language-python">def solve(n, memo=None):
    if memo is None:
        memo = {}
    # ...
</code></pre>
<hr>
<p><strong>Next:</strong> When does memoization help? 🚀</p>
`,
            estimatedReadTime: 180,
            autoMarkComplete: false,
        },

        // ITEM 7: When Does Memoization Help?
        {
            type: 'reading',
            id: 'when-memoization-helps',
            title: 'When Does Memoization Help?',
            content: `<h1>When Does Memoization Help? 🤔</h1>
<p>Not every recursive problem needs memoization!</p>
<h2>The Key Question</h2>
<p><strong>Are there repeated subproblems?</strong></p>
<p>Draw the recursion tree. If same nodes appear multiple times → use memo!</p>
<hr>
<h2>Example 1: Factorial (NO repeated nodes)</h2>
<pre><code>                fact(5)
                  |
                fact(4)
                  |
                fact(3)
                  |
                fact(2)
                  |
                fact(1)
</code></pre>
<p><strong>Each node appears once</strong> → Linear chain → <strong>Memo doesn&#39;t help!</strong></p>
<p>Time complexity: O(n) with or without memo</p>
<hr>
<h2>Example 2: Fibonacci (MANY repeated nodes)</h2>
<pre><code>                fib(5)
               /      \
          fib(4)      fib(3)
         /    \       /    \
    fib(3)  fib(2)  fib(2) fib(1)
     ...
</code></pre>
<p><strong>fib(3) appears 2 times</strong>
<strong>fib(2) appears 3 times</strong></p>
<p>Massive repetition → <strong>Memo helps!</strong></p>
<ul>
<li>Without memo: O(2ⁿ)</li>
<li>With memo: O(n)</li>
</ul>
<hr>
<h2>How to Identify</h2>
<h3>Method 1: Draw the Tree</h3>
<ol>
<li>Draw recursion tree for small input (n=5)</li>
<li>Look for duplicate nodes</li>
<li>If duplicates exist → use memo!</li>
</ol>
<h3>Method 2: Check Branching</h3>
<p><strong>Linear recursion:</strong> Each call makes 1 recursive call</p>
<ul>
<li>factorial(n) → factorial(n-1)</li>
<li><strong>Usually no repetition</strong></li>
</ul>
<p><strong>Branching recursion:</strong> Each call makes 2+ recursive calls</p>
<ul>
<li>fib(n) → fib(n-1) + fib(n-2)</li>
<li><strong>Often has repetition</strong></li>
</ul>
<h3>Method 3: Parameter Changes</h3>
<p>If recursive calls <strong>overlap</strong> in parameter space:</p>
<ul>
<li>fib(n-1) and fib(n-2) both eventually call fib(3)</li>
<li><strong>Overlap → repeated subproblems → memo helps!</strong></li>
</ul>
<hr>
<h2>Decision Flowchart</h2>
<pre><code>Start with recursive solution
        |
        ↓
Draw recursion tree
        |
        ↓
   Same nodes?
    /        \
  YES         NO
   |           |
   ↓           ↓
Use memo!   Plain recursion
(DP)       is fine
</code></pre>
<hr>
<h2>Examples</h2>
<h3>✅ Needs Memoization</h3>
<ol>
<li><strong>Fibonacci</strong> - fib(n-1) and fib(n-2) overlap</li>
<li><strong>Climbing Stairs</strong> - Same recurrence as Fibonacci</li>
<li><strong>Longest Common Subsequence</strong> - Same (i,j) pairs visited multiple times</li>
<li><strong>Edit Distance</strong> - Overlapping (i,j) states</li>
<li><strong>Coin Change</strong> - Same amounts reached via different paths</li>
</ol>
<h3>❌ Doesn&#39;t Need Memoization</h3>
<ol>
<li><strong>Factorial</strong> - Linear chain, no overlap</li>
<li><strong>Sum Array</strong> - Each element processed once</li>
<li><strong>Binary Search</strong> - Each call unique range</li>
<li><strong>Tree Traversal</strong> - Each node visited once</li>
</ol>
<hr>
<h2>The Memoization Test</h2>
<p><strong>Quick test:</strong> If you add memoization and it speeds up significantly → you had repeated subproblems!</p>
<pre><code class="language-python"># Test without memo
import time
start = time.time()
result = fib_no_memo(35)
print(f&quot;No memo: {time.time() - start:.2f}s&quot;)  # ~3 seconds

# Test with memo
start = time.time()
result = fib_with_memo(35)
print(f&quot;With memo: {time.time() - start:.6f}s&quot;)  # ~0.000050s
</code></pre>
<p><strong>1000x+ speedup = definitely needed memo!</strong></p>
<hr>
<h2>Summary</h2>
<p><strong>Use memoization when:</strong></p>
<ul>
<li>✅ Branching recursion (2+ recursive calls)</li>
<li>✅ Overlapping subproblems (repeated nodes)</li>
<li>✅ Exponential time complexity without memo</li>
</ul>
<p><strong>Skip memoization when:</strong></p>
<ul>
<li>❌ Linear recursion (1 recursive call)</li>
<li>❌ Unique subproblems (no repeated nodes)</li>
<li>❌ Already O(n) time</li>
</ul>
<hr>
<p><strong>Key insight:</strong> <strong>Overlapping subproblems</strong> is the hallmark of DP!</p>
<p><strong>Next:</strong> Let&#39;s solve classic 1D DP problems! 🚀</p>
`,
            estimatedReadTime: 180,
            autoMarkComplete: false,
        },

        // ============================================================
        // PART 2: CLASSIC 1D DP PROBLEMS (Items 8-14)
        // ============================================================

        // ITEM 8: House Robber - Drawing the Tree
        {
            type: 'reading',
            id: 'house-robber-pattern',
            title: 'Pattern: House Robber',
            content: `<h1>Pattern: House Robber 🏠</h1>
<p>A classic DP problem with constraints!</p>
<h2>The Problem</h2>
<p>You&#39;re robbing houses along a street. Each house has money. <strong>Can&#39;t rob adjacent houses</strong> (alarms!).</p>
<p><strong>What&#39;s the maximum money you can rob?</strong></p>
<p><strong>Example:</strong> <code>houses = [2, 7, 9, 3, 1]</code></p>
<hr>
<h2>Drawing the Decision Tree</h2>
<p>At each house, you have 2 choices:</p>
<ol>
<li><strong>Rob it</strong> (can&#39;t rob next house)</li>
<li><strong>Skip it</strong> (can rob next house)</li>
</ol>
<p><strong>Tree for [2, 7, 9]:</strong></p>
<pre><code>                    Start
                   /      \
               Rob(2)    Skip(2)
                 |          |
            Skip(7)      /     \
               |      Rob(7)  Skip(7)
            /     \      |       |
        Rob(9)  Skip(9) Skip(9) Rob(9)
          |       |       |       |
         $11     $2      $7      $9
</code></pre>
<p><strong>Repeated subproblems:</strong> Notice we compute &quot;what&#39;s best starting from house[2]&quot; multiple times!</p>
<hr>
<h2>The Recurrence Relation</h2>
<p>At house <code>i</code>, you have two options:</p>
<ol>
<li><p><strong>Rob house i:</strong></p>
<ul>
<li>Take money[i]</li>
<li>Can&#39;t rob house i+1</li>
<li>Best is: money[i] + max_rob(i+2)</li>
</ul>
</li>
<li><p><strong>Skip house i:</strong></p>
<ul>
<li>Take $0 from this house</li>
<li>Can rob house i+1</li>
<li>Best is: max_rob(i+1)</li>
</ul>
</li>
</ol>
<p><strong>Recurrence:</strong></p>
<pre><code>max_rob(i) = max(
    money[i] + max_rob(i+2),  # Rob this house
    max_rob(i+1)               # Skip this house
)
</code></pre>
<hr>
<h2>Naive Recursive Solution</h2>
<pre><code class="language-python">def rob(nums):
    def max_rob(i):
        if i &gt;= len(nums):
            return 0

        # Rob this house or skip it
        rob_current = nums[i] + max_rob(i + 2)
        skip_current = max_rob(i + 1)

        return max(rob_current, skip_current)

    return max_rob(0)
</code></pre>
<p><strong>Time:</strong> O(2ⁿ) - exponential!</p>
<hr>
<h2>Adding Memoization</h2>
<p>Same subproblems computed multiple times → Add memo!</p>
<pre><code class="language-python">def rob(nums):
    memo = {}

    def max_rob(i):
        if i &gt;= len(nums):
            return 0

        # Check memo
        if i in memo:
            return memo[i]

        # Compute
        rob_current = nums[i] + max_rob(i + 2)
        skip_current = max_rob(i + 1)
        result = max(rob_current, skip_current)

        # Cache
        memo[i] = result
        return result

    return max_rob(0)
</code></pre>
<p><strong>Time:</strong> O(n) - each house computed once!</p>
<hr>
<h2>Key Insight</h2>
<p><strong>Constraint (can&#39;t rob adjacent)</strong> becomes part of the recurrence:</p>
<ul>
<li>Rob house i → skip to i+2</li>
<li>Skip house i → go to i+1</li>
</ul>
<p><strong>The tree shows why memo helps:</strong></p>
<ul>
<li>Same starting positions reached via different paths</li>
<li>Cache the result for each position!</li>
</ul>
<hr>
<p><strong>Next:</strong> Let&#39;s implement it! 🚀</p>
`,
            estimatedReadTime: 240,
            autoMarkComplete: false,
        },

        // ITEM 9: House Robber Exercise
        ,// ITEM 10: Coin Change Reading
        {
            type: 'reading',
            id: 'coin-change-pattern',
            title: 'Pattern: Coin Change - Minimum Coins',
            content: `<h1>Pattern: Coin Change - Minimum Coins 💰</h1>
<p>Find the <strong>minimum</strong> number of coins to make an amount.</p>
<h2>The Problem</h2>
<p><strong>Coins:</strong> <code>[1, 2, 5]</code>
<strong>Amount:</strong> 11</p>
<p><strong>What&#39;s the minimum coins needed?</strong></p>
<p>Answer: 3 coins (5+5+1)</p>
<hr>
<h2>Drawing the Tree</h2>
<pre><code>                amount=11
           /      |      \
        -1      -2       -5
       /         |         \
    amt=10     amt=9     amt=6
    / | \      / | \      / | \
   ...  ...   ...  ...  ...  ...
</code></pre>
<p><strong>Key observation:</strong> Same amounts reached via different paths!</p>
<ul>
<li>amt=6 can be reached by: 11-5, 11-2-2-1, etc.</li>
</ul>
<hr>
<h2>The Recurrence</h2>
<p>To make amount <code>n</code>:</p>
<ol>
<li>Try each coin <code>c</code></li>
<li>If we use coin <code>c</code>, we need <code>1 + min_coins(n - c)</code> coins total</li>
<li>Try all coins, take minimum</li>
</ol>
<p><strong>Recurrence:</strong></p>
<pre><code>min_coins(amount) = 1 + min(
    min_coins(amount - coin1),
    min_coins(amount - coin2),
    ...
)
</code></pre>
<p><strong>Base cases:</strong></p>
<ul>
<li>amount == 0: Need 0 coins ✓</li>
<li>amount &lt; 0: Invalid (return ∞)</li>
</ul>
<hr>
<h2>Naive Recursive Solution</h2>
<pre><code class="language-python">def coinChange(coins, amount):
    def min_coins(amt):
        # Base cases
        if amt == 0:
            return 0
        if amt &lt; 0:
            return float(&#39;inf&#39;)

        # Try each coin
        result = float(&#39;inf&#39;)
        for coin in coins:
            result = min(result, 1 + min_coins(amt - coin))

        return result

    result = min_coins(amount)
    return result if result != float(&#39;inf&#39;) else -1
</code></pre>
<p><strong>Time:</strong> O(coins^amount) - exponential!</p>
<hr>
<h2>With Memoization</h2>
<pre><code class="language-python">def coinChange(coins, amount):
    memo = {}

    def min_coins(amt):
        if amt == 0:
            return 0
        if amt &lt; 0:
            return float(&#39;inf&#39;)

        # Check memo
        if amt in memo:
            return memo[amt]

        # Compute
        result = float(&#39;inf&#39;)
        for coin in coins:
            result = min(result, 1 + min_coins(amt - coin))

        # Cache
        memo[amt] = result
        return result

    result = min_coins(amount)
    return result if result != float(&#39;inf&#39;) else -1
</code></pre>
<p><strong>Time:</strong> O(amount × coins) - much better!</p>
<hr>
<h2>Key Pattern: Minimization</h2>
<p>This is a <strong>minimization DP</strong>:</p>
<ul>
<li>Initialize with <code>float(&#39;inf&#39;)</code></li>
<li>Take <code>min</code> of all options</li>
<li>Return -1 if result is still infinity (impossible)</li>
</ul>
<hr>
<p><strong>Next:</strong> Implement it! 🚀</p>
`,
            estimatedReadTime: 240,
            autoMarkComplete: false,
        },

        // ITEM 11: Coin Change Exercise
        ,// ITEM 12: Reading - Knapsack Pattern
        {
            type: 'reading',
            id: 'knapsack-pattern',
            title: 'Pattern: The Knapsack Problem 🎒',
            content: `<h1>Pattern: The Knapsack Problem 🎒</h1>
<p>This is the <strong>most famous</strong> DP pattern!</p>
<h2>The Problem (0/1 Knapsack)</h2>
<p>You have a backpack with capacity <strong>W</strong>.
You have items, each with a <strong>weight</strong> and a <strong>value</strong>.
You can take each item <strong>once</strong> (0 or 1).</p>
<p><strong>Goal:</strong> Maximize total value without exceeding capacity.</p>
<h2>The Choice</h2>
<p>For each item, you have two choices:</p>
<ol>
<li><strong>Skip it:</strong> Value stays same.</li>
<li><strong>Take it:</strong> Add value, subtract weight from capacity.</li>
</ol>
<h2>The 2D State</h2>
<p><code>dp[i][w]</code> = Max value using first <code>i</code> items with capacity <code>w</code>.</p>
<pre><code class="language-python">if weight[i] &gt; w:
    dp[i][w] = dp[i-1][w]  # Too heavy, must skip
else:
    dp[i][w] = max(
        dp[i-1][w],                     # Skip
        value[i] + dp[i-1][w-weight[i]] # Take
    )
</code></pre>
<h2>Space Optimization (The &quot;Backwards&quot; Trick) 🧙‍♂️</h2>
<p>We can optimize space to O(W) using a 1D array!
But we must be careful not to use the same item twice.</p>
<p><strong>Rule of Thumb:</strong></p>
<ul>
<li><strong>0/1 Knapsack (Use once):</strong> Iterate capacity <strong>BACKWARDS</strong>.</li>
<li><strong>Unbounded Knapsack (Use unlimited):</strong> Iterate capacity <strong>FORWARDS</strong>.</li>
</ul>
<h3>Why Backwards?</h3>
<p>If we go forwards, <code>dp[w-weight]</code> might already include the current item!
Going backwards ensures <code>dp[w-weight]</code> comes from the <em>previous</em> iteration (without current item).</p>
<pre><code class="language-python"># 0/1 Knapsack (Backwards)
for item in items:
    for w in range(Capacity, item.weight - 1, -1):
        dp[w] = max(dp[w], item.value + dp[w - item.weight])
</code></pre>
<p><strong>Next:</strong> Let&#39;s implement it!</p>
`,
            estimatedReadTime: 240,
            autoMarkComplete: false,
        },

        // ITEM 13: Exercise - 0/1 Knapsack
        ,// ============================================================
        // TARGET SUM - Multi-Approach Deep Dive
        // ============================================================

        // ITEM 13.5: Target Sum Approaches
        {
            type: 'reading',
            id: 'target-sum-approaches',
            title: 'Target Sum: Multiple Approaches',
            content: `<h1>Target Sum: Multiple Approaches 🎯</h1>
<h2>The Problem</h2>
<p>Given an integer array <code>nums</code> and a target <code>S</code>, assign <strong>+</strong> or <strong>-</strong> to each number such that the total equals <code>S</code>. Return the <strong>count of ways</strong> to achieve this.</p>
<p><strong>Example:</strong></p>
<pre><code>nums = [1, 1, 1, 1, 1], S = 3

Ways:
-1 +1 +1 +1 +1 = 3 ✓
+1 -1 +1 +1 +1 = 3 ✓
+1 +1 -1 +1 +1 = 3 ✓
+1 +1 +1 -1 +1 = 3 ✓
+1 +1 +1 +1 -1 = 3 ✓

Answer: 5 ways
</code></pre>
<h2>Why This Problem is Special</h2>
<p>This is a <strong>classic multi-approach DP problem</strong>. You can solve it three different ways:</p>
<ol>
<li><strong>Backtracking</strong> (brute force)</li>
<li><strong>Memoization</strong> (fix repeated subproblems)</li>
<li><strong>Mathematical Reduction</strong> (transform to subset sum)</li>
</ol>
<p>Each approach teaches different insights!</p>
<hr>
<h2>Approach 1: Backtracking (Brute Force)</h2>
<h3>The Intuition</h3>
<p>For each number, you have <strong>2 choices</strong>: add (+) or subtract (-).</p>
<p>This creates a <strong>decision tree</strong>:</p>
<pre><code>                    index=0, sum=0
                   /              \
              +nums[0]          -nums[0]
                /                   \
           sum=1                  sum=-1
          /     \                /      \
     +nums[1] -nums[1]     +nums[1]  -nums[1]
        /         \          /           \
      sum=2     sum=0     sum=0       sum=-2
       ...       ...       ...          ...
</code></pre>
<h3>Code</h3>
<pre><code class="language-python">def findTargetSumWays(nums, S):
    def backtrack(i, current_sum):
        # Base case: processed all numbers
        if i == len(nums):
            return 1 if current_sum == S else 0

        # Two choices: add or subtract nums[i]
        add = backtrack(i + 1, current_sum + nums[i])
        subtract = backtrack(i + 1, current_sum - nums[i])

        return add + subtract

    return backtrack(0, 0)
</code></pre>
<h3>Complexity</h3>
<ul>
<li><strong>Time: O(2^n)</strong> - 2 choices per number, n numbers</li>
<li><strong>Space: O(n)</strong> - recursion depth</li>
</ul>
<p><strong>Problem:</strong> Exponential time! For n=20, that&#39;s 2^20 = 1,048,576 calls.</p>
<hr>
<h2>Approach 2: Memoization (DP)</h2>
<h3>The Insight</h3>
<p>Look at the tree again - <strong>same states repeat!</strong></p>
<pre><code>                    (0, 0)
                   /      \
              (1, +1)    (1, -1)
              /    \     /    \
          (2,+2) (2,0) (2,0) (2,-2)
                   ↑      ↑
                  SAME STATE!
</code></pre>
<p>State <strong>(2, 0)</strong> appears twice! As the tree grows, repetition explodes.</p>
<h3>Fix: Cache Results</h3>
<pre><code class="language-python">def findTargetSumWays(nums, S):
    memo = {}

    def dp(i, current_sum):
        # Base case
        if i == len(nums):
            return 1 if current_sum == S else 0

        # Check cache
        if (i, current_sum) in memo:
            return memo[(i, current_sum)]

        # Two choices
        result = dp(i + 1, current_sum + nums[i]) + dp(i + 1, current_sum - nums[i])

        # Store in cache
        memo[(i, current_sum)] = result
        return result

    return dp(0, 0)
</code></pre>
<h3>Complexity</h3>
<ul>
<li><strong>Time: O(n × sum_range)</strong> - where sum_range = 2 × sum(nums) + 1</li>
<li><strong>Space: O(n × sum_range)</strong> - memoization table</li>
</ul>
<p><strong>Much better!</strong> But can we do even better?</p>
<hr>
<h2>Approach 3: Mathematical Reduction (Subset Sum)</h2>
<h3>The Key Insight 💡</h3>
<p>Let&#39;s say we split numbers into two groups:</p>
<ul>
<li><strong>P</strong> = numbers we assign <strong>+</strong></li>
<li><strong>N</strong> = numbers we assign <strong>-</strong></li>
</ul>
<p>Then:</p>
<ul>
<li>sum(P) - sum(N) = S  (our target)</li>
<li>sum(P) + sum(N) = total  (sum of all nums)</li>
</ul>
<p>Adding these equations:</p>
<pre><code>2 × sum(P) = S + total
sum(P) = (S + total) / 2
</code></pre>
<h3>The Transformation 🔄</h3>
<p><strong>Original problem:</strong> Count ways to assign +/- to reach S</p>
<p><strong>Transformed problem:</strong> Count subsets with sum = (S + total) / 2</p>
<p>This is just <strong>0/1 Knapsack counting</strong>!</p>
<h3>Code</h3>
<pre><code class="language-python">def findTargetSumWays(nums, S):
    total = sum(nums)

    # Edge cases
    if abs(S) &gt; total:  # Impossible to reach S
        return 0
    if (S + total) % 2 != 0:  # Not divisible, impossible
        return 0

    target = (S + total) // 2

    # Count subsets that sum to target
    dp = [0] * (target + 1)
    dp[0] = 1  # One way to make sum 0: take nothing

    for num in nums:
        # Iterate backwards (0/1 knapsack style)
        for j in range(target, num - 1, -1):
            dp[j] += dp[j - num]

    return dp[target]
</code></pre>
<h3>Complexity</h3>
<ul>
<li><strong>Time: O(n × target)</strong> - where target = (S + total) / 2</li>
<li><strong>Space: O(target)</strong> - 1D DP array</li>
</ul>
<p><strong>Best approach!</strong> Often target &lt;&lt; sum_range, making this faster.</p>
<hr>
<h2>Comparison Table</h2>
<table>
<thead>
<tr>
<th>Approach</th>
<th>Time</th>
<th>Space</th>
<th>When to Use</th>
</tr>
</thead>
<tbody><tr>
<td>Backtracking</td>
<td>O(2^n)</td>
<td>O(n)</td>
<td>Understanding only, never in production</td>
</tr>
<tr>
<td>Memoization</td>
<td>O(n × sum_range)</td>
<td>O(n × sum_range)</td>
<td>When sum range is small</td>
</tr>
<tr>
<td>Subset Sum</td>
<td>O(n × target)</td>
<td>O(target)</td>
<td><strong>Best for most cases</strong></td>
</tr>
</tbody></table>
<hr>
<h2>Decision Framework</h2>
<pre><code>Start with Problem
       |
       v
Can I split into +/- groups?
       |
       v
Transform: sum(P) = (S + total) / 2
       |
       v
Is (S + total) even?
      / \
    No   Yes
     |     |
     v     v
 Return 0  Use 0/1 Knapsack counting
</code></pre>
<hr>
<h2>Pattern Recognition</h2>
<p>This problem teaches you to recognize <strong>Partition Problems</strong>:</p>
<ul>
<li>Partition Equal Subset Sum → subset sum = total/2</li>
<li>Target Sum → subset sum = (S + total)/2</li>
<li>Partition to K Equal Subsets → multiple groups</li>
</ul>
<p><strong>Key insight:</strong> Many +/- problems transform to subset selection!</p>
<p><strong>Next:</strong> Practice implementing Target Sum! 🚀</p>
`,
            estimatedReadTime: 360,
            autoMarkComplete: false,
        },

        // ============================================================
        // PART 3: 2D DP PROBLEMS (Items 15-18)
        // ============================================================

        // ITEM 15: Unique Paths (Grid DP)
        {
            type: 'reading',
            id: 'unique-paths-grid-dp',
            title: '2D DP: Unique Paths',
            content: `<h1>2D DP: Unique Paths 🗺️</h1>
<p>Now let&#39;s handle <strong>2D state spaces</strong>!</p>
<h2>The Problem</h2>
<p>Robot in top-left of m×n grid. Can only move <strong>right</strong> or <strong>down</strong>.</p>
<p><strong>How many unique paths to bottom-right?</strong></p>
<pre><code>Grid 3×3:
S . .
. . .
. . E

S = start (0,0)
E = end (2,2)
</code></pre>
<hr>
<h2>The 2D State</h2>
<p><strong>State:</strong> <code>dp[row][col]</code> = number of paths to reach (row, col)</p>
<p><strong>Question:</strong> How to reach (row, col)?</p>
<ul>
<li>From (row-1, col) - move down</li>
<li>From (row, col-1) - move right</li>
</ul>
<p><strong>Recurrence:</strong></p>
<pre><code>dp[row][col] = dp[row-1][col] + dp[row][col-1]
</code></pre>
<hr>
<h2>Base Cases</h2>
<p><strong>First row:</strong> Only 1 way (all right)</p>
<pre><code>dp[0][j] = 1 for all j
</code></pre>
<p><strong>First column:</strong> Only 1 way (all down)</p>
<pre><code>dp[i][0] = 1 for all i
</code></pre>
<hr>
<h2>Visualization</h2>
<pre><code>Grid 3×3 with path counts:

1   1   1
1   2   3
1   3   6

dp[2][2] = 6 unique paths!
</code></pre>
<p><strong>How we fill it:</strong></p>
<pre><code>Step 1: Fill first row with 1s
Step 2: Fill first column with 1s
Step 3: For each cell (i,j):
        dp[i][j] = dp[i-1][j] + dp[i][j-1]
</code></pre>
<hr>
<h2>Memoization Solution</h2>
<pre><code class="language-python">def uniquePaths(m, n):
    memo = {}

    def paths(row, col):
        # Base cases
        if row == 0 or col == 0:
            return 1  # Only one way along edge

        # Check cache
        if (row, col) in memo:
            return memo[(row, col)]

        # Recurse
        result = paths(row-1, col) + paths(row, col-1)

        # Cache
        memo[(row, col)] = result
        return result

    return paths(m-1, n-1)
</code></pre>
<p><strong>Time:</strong> O(m × n) - each cell computed once
<strong>Space:</strong> O(m × n) - memo dictionary</p>
<hr>
<h2>Key Pattern: 2D DP with Memoization</h2>
<ol>
<li><strong>Define 2D state:</strong> <code>memo[(i, j)]</code> = paths to (i, j)</li>
<li><strong>Find recurrence:</strong> paths(i, j) = paths(i-1, j) + paths(i, j-1)</li>
<li><strong>Identify base cases:</strong> First row/column = 1</li>
<li><strong>Add memoization:</strong> Check cache → Compute → Store</li>
<li><strong>Return:</strong> Call with target coordinates</li>
</ol>
<hr>
<p><strong>Next:</strong> Implement it! 🚀</p>
`,
            estimatedReadTime: 240,
            autoMarkComplete: false,
        },

        // ITEM 16: Unique Paths Exercise
        ,// ITEM 17-18: LCS and Summary
        {
            type: 'reading',
            id: 'lcs-and-2d-summary',
            title: 'LCS & 2D DP Summary',
            content: `<h1>Longest Common Subsequence &amp; 2D DP Summary 📚</h1>
<h2>Pattern: Longest Common Subsequence (LCS)</h2>
<p><strong>Problem:</strong> Find longest common subsequence of two strings.</p>
<p><strong>Input:</strong> s1 = &quot;ABCDE&quot;, s2 = &quot;ACE&quot;
<strong>Output:</strong> 3 (subsequence: &quot;ACE&quot;)</p>
<h3>The 2D State</h3>
<p><code>dp[i][j]</code> = LCS length for s1[0:i] and s2[0:j]</p>
<h3>The Recurrence</h3>
<pre><code class="language-python">if s1[i-1] == s2[j-1]:
    dp[i][j] = 1 + dp[i-1][j-1]  # Characters match!
else:
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])  # Skip one
</code></pre>
<h3>Memoization Solution</h3>
<pre><code class="language-python">def longestCommonSubsequence(s1, s2):
    memo = {}

    def lcs(i, j):
        # Base case
        if i == 0 or j == 0:
            return 0

        # Check cache
        if (i, j) in memo:
            return memo[(i, j)]

        # Recurrence
        if s1[i-1] == s2[j-1]:
            result = 1 + lcs(i-1, j-1)  # Match!
        else:
            result = max(lcs(i-1, j), lcs(i, j-1))  # Skip one

        # Cache
        memo[(i, j)] = result
        return result

    return lcs(len(s1), len(s2))
</code></pre>
<p><strong>Time:</strong> O(m × n)</p>
<hr>
<h2>2D DP Patterns Summary</h2>
<table>
<thead>
<tr>
<th>Problem</th>
<th>State</th>
<th>Recurrence</th>
<th>Time</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Unique Paths</strong></td>
<td>dp[i][j]</td>
<td>dp[i-1][j] + dp[i][j-1]</td>
<td>O(m×n)</td>
</tr>
<tr>
<td><strong>Min Path Sum</strong></td>
<td>dp[i][j]</td>
<td>val + min(dp[i-1][j], dp[i][j-1])</td>
<td>O(m×n)</td>
</tr>
<tr>
<td><strong>LCS</strong></td>
<td>dp[i][j]</td>
<td>match? 1+dp[i-1][j-1] : max(...)</td>
<td>O(m×n)</td>
</tr>
<tr>
<td><strong>Edit Distance</strong></td>
<td>dp[i][j]</td>
<td>1 + min(insert, delete, replace)</td>
<td>O(m×n)</td>
</tr>
</tbody></table>
<hr>
<h2>Common 2D DP Structure</h2>
<pre><code class="language-python">def solve_2d_dp(params):
    # Create 2D table
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases (first row/column)
    for i in range(m + 1):
        dp[i][0] = base_value
    for j in range(n + 1):
        dp[0][j] = base_value

    # Fill table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            # Compute from neighbors
            dp[i][j] = function(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])

    return dp[m][n]
</code></pre>
<hr>
<p><strong>Next:</strong> Edit Distance - the ultimate 2D DP! 🚀</p>
`,
            estimatedReadTime: 240,
            autoMarkComplete: false,
        },

        // ============================================================
        // PART 4: ADVANCED DP (Items 19-20)
        // ============================================================

        // ITEM 19: Edit Distance
        ,// ITEM 20: Space Optimization 101
        {
            type: 'reading',
            id: 'space-optimization-intro',
            title: 'Space Optimization: From O(n) to O(1)',
            content: `<h1>Space Optimization: From O(n) to O(1) 📉</h1>
<p>You&#39;ve mastered <strong>Time Optimization</strong> (Memoization).
Now let&#39;s talk about <strong>Space Optimization</strong>.</p>
<h2>The Observation</h2>
<p>Look at the Fibonacci recurrence:</p>
<pre><code class="language-python">dp[i] = dp[i-1] + dp[i-2]
</code></pre>
<p>To calculate <code>dp[i]</code>, we <strong>ONLY</strong> need:</p>
<ol>
<li><code>dp[i-1]</code> (the previous value)</li>
<li><code>dp[i-2]</code> (the value before that)</li>
</ol>
<p>We <strong>DON&#39;T</strong> need <code>dp[i-3]</code>, <code>dp[i-4]</code>, or <code>dp[0]</code>.</p>
<h2>The Waste</h2>
<p>If we store the entire <code>dp</code> array for <code>fib(100)</code>, we use an array of size 101.
But at any moment, we only care about <strong>2 values</strong>.</p>
<p><strong>We are wasting O(n) space!</strong> 🗑️</p>
<h2>The Fix: Rolling Variables</h2>
<p>Instead of an array, let&#39;s just keep the 2 values we need in variables.</p>
<h3>Visualizing the Window</h3>
<pre><code>[ ... 5, 8, 13, ... ]
      ^  ^   ^
  prev2 prev1 current
</code></pre>
<p>When we move to the next step, we &quot;slide&quot; the window:</p>
<ul>
<li><code>prev2</code> becomes the old <code>prev1</code></li>
<li><code>prev1</code> becomes the old <code>current</code></li>
</ul>
<h3>Code Transformation</h3>
<p><strong>O(n) Space (Array):</strong></p>
<pre><code class="language-python">dp = [0] * (n + 1)
dp[0], dp[1] = 0, 1
for i in range(2, n + 1):
    dp[i] = dp[i-1] + dp[i-2]
return dp[n]
</code></pre>
<p><strong>O(1) Space (Variables):</strong></p>
<pre><code class="language-python">if n &lt;= 1: return n
prev2, prev1 = 0, 1

for i in range(2, n + 1):
    current = prev1 + prev2
    # Slide window
    prev2 = prev1
    prev1 = current

return prev1
</code></pre>
<h2>Trade-offs</h2>
<table>
<thead>
<tr>
<th>Approach</th>
<th>Time</th>
<th>Space</th>
<th>Notes</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Recursion (Naive)</strong></td>
<td>O(2ⁿ)</td>
<td>O(n)</td>
<td>Too slow</td>
</tr>
<tr>
<td><strong>Memoization (Top-Down)</strong></td>
<td>O(n)</td>
<td>O(n)</td>
<td>Easy to write, uses stack space</td>
</tr>
<tr>
<td><strong>Tabulation (Bottom-Up)</strong></td>
<td>O(n)</td>
<td>O(n)</td>
<td>Iterative, uses heap space</td>
</tr>
<tr>
<td><strong>Space Optimized</strong></td>
<td>O(n)</td>
<td>O(1)</td>
<td><strong>Best for production!</strong> 🏆</td>
</tr>
</tbody></table>
<p><strong>Next:</strong> Let&#39;s practice this optimization on Climbing Stairs! 🪜</p>
`,
            estimatedReadTime: 180,
            autoMarkComplete: false,
        },

        // ITEM 27: Reading - Stock with Cooldown
        {
            type: 'reading',
            id: 'stock-cooldown-intro',
            title: 'Handling Cooldowns (State Machines)',
            content: `<h1>Handling Cooldowns ❄️</h1>
<p>Now things get interesting.
<strong>Constraint:</strong> After you sell your stock, you cannot buy stock on the next day (i.e., cooldown one day).</p>
<h2>The State Machine</h2>
<p>We now have 3 distinct states:</p>
<ol>
<li><strong>Held:</strong> We have the stock.</li>
<li><strong>Sold:</strong> We just sold the stock (Cooldown state).</li>
<li><strong>Reset:</strong> We don&#39;t have the stock and are not in cooldown (Ready to buy).</li>
</ol>
<h2>Transitions</h2>
<pre><code class="language-mermaid">graph TD
    Reset -- Buy --&gt; Held
    Held -- Sell --&gt; Sold
    Sold -- Wait --&gt; Reset
    Reset -- Wait --&gt; Reset
    Held -- Wait --&gt; Held
</code></pre>
<h2>The Recurrence</h2>
<p>Let&#39;s define 3 variables for the max profit ending in each state:</p>
<ol>
<li><p><code>held[i]</code>: Max profit if we end day <code>i</code> holding the stock.</p>
<ul>
<li>From <code>held[i-1]</code> (kept holding)</li>
<li>From <code>reset[i-1]</code> (bought today)</li>
</ul>
<pre><code class="language-python">held[i] = max(held[i-1], reset[i-1] - price[i])
</code></pre>
</li>
<li><p><code>sold[i]</code>: Max profit if we end day <code>i</code> having just sold.</p>
<ul>
<li>From <code>held[i-1]</code> (sold today)</li>
</ul>
<pre><code class="language-python">sold[i] = held[i-1] + price[i]
</code></pre>
</li>
<li><p><code>reset[i]</code>: Max profit if we end day <code>i</code> ready to buy (not holding, not cooldown).</p>
<ul>
<li>From <code>reset[i-1]</code> (did nothing)</li>
<li>From <code>sold[i-1]</code> (came out of cooldown)</li>
</ul>
<pre><code class="language-python">reset[i] = max(reset[i-1], sold[i-1])
</code></pre>
</li>
</ol>
<p><strong>Base Cases (Day 0):</strong></p>
<ul>
<li><code>held = -prices[0]</code> (Bought on day 0)</li>
<li><code>sold = 0</code> (Impossible to sell on day 0, but profit is 0)</li>
<li><code>reset = 0</code> (Did nothing)</li>
</ul>
<p><strong>Next:</strong> Implement this State Machine!</p>
`,
            estimatedReadTime: 300,
            autoMarkComplete: false,
        },

        // ITEM 28: Exercise - Stock with Cooldown
        ,// 2D Matrix DP Mastery - Teaching Section
        {
            type: 'reading',
            id: '2d-matrix-dp-mastery',
            title: '2D Matrix DP Mastery',
            estimatedReadTime: 360,
            content: `<h1>2D Matrix DP Mastery</h1>
<p>Matrix DP problems are <strong>interview favorites</strong>! They test your ability to think in two dimensions and handle various movement patterns.</p>
<h2>The Core Pattern</h2>
<p>Every 2D matrix DP problem follows this template:</p>
<pre><code class="language-python">def solve(grid):
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]

    # 1. Base case (usually top-left or edges)
    dp[0][0] = grid[0][0]  # or some initial value

    # 2. Fill edges (if movement restricted)
    for j in range(1, n):
        dp[0][j] = f(dp[0][j-1], grid[0][j])  # first row
    for i in range(1, m):
        dp[i][0] = f(dp[i-1][0], grid[i][0])  # first col

    # 3. Fill rest using recurrence
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = combine(neighbors) + grid[i][j]

    return dp[m-1][n-1]
</code></pre>
<h2>Problem Variants</h2>
<table>
<thead>
<tr>
<th>Variant</th>
<th>Movement</th>
<th>Recurrence</th>
<th>Example</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Count Paths</strong></td>
<td>Right, Down</td>
<td><code>dp[i][j] = dp[i-1][j] + dp[i][j-1]</code></td>
<td>Unique Paths</td>
</tr>
<tr>
<td><strong>Min Cost</strong></td>
<td>Right, Down</td>
<td><code>dp[i][j] = min(...) + grid[i][j]</code></td>
<td>Min Path Sum</td>
</tr>
<tr>
<td><strong>Max Sum</strong></td>
<td>Right, Down</td>
<td><code>dp[i][j] = max(...) + grid[i][j]</code></td>
<td>Max Path Sum</td>
</tr>
<tr>
<td><strong>With Obstacles</strong></td>
<td>Right, Down</td>
<td>Skip if <code>grid[i][j] == 1</code></td>
<td>Unique Paths II</td>
</tr>
<tr>
<td><strong>4 Directions</strong></td>
<td>All 4</td>
<td>Need Dijkstra or special order</td>
<td>Min Cost Path</td>
</tr>
</tbody></table>
<h2>Movement Pattern Analysis</h2>
<h3>Pattern 1: Right + Down Only</h3>
<ul>
<li>Simple nested loops work</li>
<li>Fill order: top-to-bottom, left-to-right</li>
<li>Each cell depends on cells already computed</li>
</ul>
<pre><code>Direction: → ↓
Fill order:
1  2  3
4  5  6
7  8  9
</code></pre>
<h3>Pattern 2: All 4 Directions</h3>
<ul>
<li><strong>Problem:</strong> Circular dependencies!</li>
<li><strong>Solution 1:</strong> Dijkstra&#39;s algorithm (for min cost)</li>
<li><strong>Solution 2:</strong> BFS with visited tracking</li>
<li><strong>Solution 3:</strong> Multiple passes (special cases)</li>
</ul>
<pre><code>Directions: ← → ↑ ↓
Can&#39;t use simple DP - need graph algorithms!
</code></pre>
<h3>Pattern 3: Variable Start/End Points</h3>
<ul>
<li><strong>Max falling path:</strong> Any column start, any column end</li>
<li>Need to consider ALL starting positions</li>
</ul>
<h2>Space Optimization</h2>
<p>Most 2D DP can be optimized to O(n) space!</p>
<pre><code class="language-python"># Before: O(m×n) space
dp = [[0] * n for _ in range(m)]
for i in range(m):
    for j in range(n):
        dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]

# After: O(n) space
dp = [0] * n
for i in range(m):
    for j in range(n):
        if j == 0:
            dp[j] = dp[j] + grid[i][j]  # top only
        else:
            dp[j] = min(dp[j], dp[j-1]) + grid[i][j]
            #          ↑ top   ↑ left (already updated)
</code></pre>
<p><strong>Key insight:</strong> <code>dp[j]</code> before update = value from previous row (top neighbor)!</p>
<h2>Common Mistakes</h2>
<h3>1. Wrong Fill Order</h3>
<pre><code class="language-python"># WRONG for right+down movement
for j in range(n):
    for i in range(m):  # Column-first doesn&#39;t work!
        dp[i][j] = ...
</code></pre>
<h3>2. Forgetting Edge Cases</h3>
<pre><code class="language-python"># WRONG - first row/col need special handling
for i in range(m):
    for j in range(n):
        dp[i][j] = min(dp[i-1][j], dp[i][j-1])  # IndexError!
</code></pre>
<h3>3. Not Handling Obstacles</h3>
<pre><code class="language-python"># Need to check for obstacles BEFORE computing
if grid[i][j] == 1:
    dp[i][j] = 0  # or float(&#39;inf&#39;) for min problems
    continue
</code></pre>
<h2>Complexity Summary</h2>
<table>
<thead>
<tr>
<th>Problem</th>
<th>Time</th>
<th>Space</th>
<th>Optimized Space</th>
</tr>
</thead>
<tbody><tr>
<td>Unique Paths</td>
<td>O(m×n)</td>
<td>O(m×n)</td>
<td>O(n)</td>
</tr>
<tr>
<td>Min Path Sum</td>
<td>O(m×n)</td>
<td>O(m×n)</td>
<td>O(n)</td>
</tr>
<tr>
<td>With Obstacles</td>
<td>O(m×n)</td>
<td>O(m×n)</td>
<td>O(n)</td>
</tr>
<tr>
<td>4 Directions</td>
<td>O(m×n×log(m×n))</td>
<td>O(m×n)</td>
<td>Cannot optimize</td>
</tr>
</tbody></table>
<p>Let&#39;s practice with more challenging variants!</p>
`,
        },

        // ITEM: Regular Expression Matching
        {
            type: 'reading',
            id: 'regex-matching-intro',
            title: 'Regular Expression Matching: Problem Introduction',
            estimatedReadTime: 300,
            content: `<h1>Regular Expression Matching</h1>
<h2>The Problem</h2>
<p>Given an input string <code>s</code> and a pattern <code>p</code>, implement regular expression matching with support for <code>.</code> and <code>*</code>.</p>
<p><strong>Special Characters:</strong></p>
<ul>
<li><code>.</code> → Matches <strong>any single character</strong></li>
<li><code>*</code> → Matches <strong>zero or more</strong> of the preceding element</li>
</ul>
<p>The matching should cover the <strong>entire</strong> input string (not partial).</p>
<hr>
<h2>Examples</h2>
<p><strong>Example 1:</strong></p>
<pre><code>s = &quot;aa&quot;
p = &quot;a&quot;
Output: false

Explanation: &quot;a&quot; does not match the entire string &quot;aa&quot;.
</code></pre>
<p><strong>Example 2:</strong></p>
<pre><code>s = &quot;aa&quot;
p = &quot;a*&quot;
Output: true

Explanation: &#39;*&#39; means zero or more of &#39;a&#39;.
By repeating &#39;a&#39; once, we get &quot;aa&quot;.
</code></pre>
<p><strong>Example 3:</strong></p>
<pre><code>s = &quot;ab&quot;
p = &quot;.*&quot;
Output: true

Explanation: &quot;.*&quot; means &quot;zero or more (*) of any character (.)&quot;.
So it can match any string!
</code></pre>
<p><strong>Example 4:</strong></p>
<pre><code>s = &quot;aab&quot;
p = &quot;c*a*b&quot;
Output: true

Explanation:
- c* → matches zero &#39;c&#39;s (empty)
- a* → matches two &#39;a&#39;s
- b  → matches &#39;b&#39;
Result: &quot;&quot; + &quot;aa&quot; + &quot;b&quot; = &quot;aab&quot; ✓
</code></pre>
<p><strong>Example 5:</strong></p>
<pre><code>s = &quot;mississippi&quot;
p = &quot;mis*is*p*.&quot;
Output: false

Explanation:
- mis* → &quot;miss&quot; (s consumed)
- is*  → &quot;iss&quot; (more s consumed)
- p*   → &quot;&quot; (zero p&#39;s)
- .    → &quot;i&quot;
Result: &quot;mississ&quot; + &quot;i&quot; = &quot;mississi&quot; ≠ &quot;mississippi&quot;
</code></pre>
<hr>
<h2>Key Insight: Why is This DP?</h2>
<p>At each position, we have <strong>choices</strong>:</p>
<ul>
<li>For <code>*</code>: Use it <strong>zero times</strong> OR <strong>one or more times</strong></li>
<li>These choices lead to <strong>overlapping subproblems</strong>!</li>
</ul>
<p>Consider matching &quot;aaa&quot; with &quot;a*&quot;:</p>
<ul>
<li>Use a* to match 0 &#39;a&#39;s, then try to match &quot;aaa&quot; with &quot;&quot;</li>
<li>Use a* to match 1 &#39;a&#39;, then try to match &quot;aa&quot; with &quot;a*&quot;</li>
<li>Use a* to match 2 &#39;a&#39;s, then try to match &quot;a&quot; with &quot;a*&quot;</li>
</ul>
<p>The subproblem of matching smaller strings repeats!</p>
<hr>
<h2>The State</h2>
<p><code>dp[i][j]</code> = Does <code>s[0:i]</code> match <code>p[0:j]</code>?</p>
<p>We need to fill an (m+1) × (n+1) table where:</p>
<ul>
<li>m = len(s)</li>
<li>n = len(p)</li>
</ul>
`
        },

        // Final completion message
        {
            type: 'reading',
            id: 'module-complete',
            title: '🎉 Dynamic Programming Complete!',
            content: `<h1>🎉 Dynamic Programming Complete!</h1>
<h2>What You&#39;ve Mastered</h2>
<p>Congratulations! You&#39;ve completed the <strong>Recursion → Backtracking → DP trilogy</strong>!</p>
<h3>✅ Module 9: Recursion &amp; Trees (Foundation)</h3>
<ul>
<li>Draw recursion trees</li>
<li>Understand base cases and call stack</li>
</ul>
<h3>✅ Module 10: Backtracking (Exploration)</h3>
<ul>
<li>Apply recursion to decision problems</li>
<li>Explore all possibilities (decision trees)</li>
</ul>
<h3>✅ Module 11: Dynamic Programming (Optimization)</h3>
<ul>
<li>Spot repeated subproblems</li>
<li><strong>Memoization:</strong> Cache results (Time Optimization)</li>
<li><strong>Tabulation:</strong> Iterative building</li>
<li><strong>Space Optimization:</strong> Rolling variables/arrays (Space Optimization)</li>
</ul>
<hr>
<h2>The Ultimate DP Checklist</h2>
<p>When you see a problem in an interview:</p>
<ol>
<li><strong>Can I define it recursively?</strong> (Recurrence relation)</li>
<li><strong>Are there overlapping subproblems?</strong> (Draw tree)</li>
<li><strong>Can I memoize it?</strong> (Top-down DP)</li>
<li><strong>Can I do it iteratively?</strong> (Bottom-up DP)</li>
<li><strong>Can I optimize space?</strong> (O(n) → O(1) or O(m×n) → O(n))</li>
</ol>
<p>If you can answer YES to #5, you are performing at an <strong>L5/L6 level</strong>! 🌟</p>
<hr>
<h2>What&#39;s Next</h2>
<p>You&#39;ve mastered the core algorithmic thinking. Now let&#39;s move to advanced data structures!</p>
<p><strong>Next Module:</strong> Heaps &amp; Priority Queues 🚀</p>
`,
            estimatedReadTime: 180,
            autoMarkComplete: false,
        },
    
    ...module11DynamicProgrammingLessonSmartPracticeExercises,
    ].filter(Boolean) as LessonSection[],
};
