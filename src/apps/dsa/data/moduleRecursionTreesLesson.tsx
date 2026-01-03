import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { module9RecursionTreesLessonSmartPracticeExercises } from './exercises/moduleRecursionTreesLessonSmartPracticeExercises';

const getRecursionExercise = (id: string) => {
  const exercise = module9RecursionTreesLessonSmartPracticeExercises.find(e => e.id === id);
  if (!exercise) {
    throw new Error(`Exercise ${id} not found in recursion exercises`);
  }
  return exercise;
};

export const module9RecursionTreesLesson: ProgressiveLesson = {
  id: 'recursion-trees-foundation',
  title: 'Module: Recursion & Trees Foundation',
  description: 'Master recursion fundamentals and learn to visualize recursive calls as trees - foundation for backtracking and DP',
  unlockMode: 'sequential',
  sections: [
    // ============================================================
    // PART 0: RECURSION FUNDAMENTALS (Items 1-3)
    // ============================================================

    // ITEM 1: What is Recursion? (Reading)
    {
      type: 'reading',
      id: 'what-is-recursion',
      title: 'What is Recursion?',
      content: `<h1>What is Recursion? 🔄</h1>
<p><strong>Recursion</strong> is when a function calls itself to solve smaller versions of the same problem.</p>
<p>Think of it like <strong>Russian nesting dolls</strong> - each doll contains a smaller version of itself until you reach the tiniest one!</p>
<h2>The Pattern</h2>
<p>Every recursive function has TWO essential parts:</p>
<h3>1. Base Case (When to STOP)</h3>
<p>The simplest version of the problem that can be solved directly.
<strong>Without this, your function runs forever!</strong> 💥 (Stack overflow)</p>
<h3>2. Recursive Case (Break it down)</h3>
<p>Break the problem into a smaller version and call yourself on it.</p>
<h2>Simple Example: Countdown</h2>
<pre><code class="language-python">def countdown(n):
    # BASE CASE: Stop when n &lt; 0
    if n &lt; 0:
        return

    # Do work at this level
    print(n)

    # RECURSIVE CASE: Solve smaller problem
    countdown(n - 1)

countdown(3)
# Output:
# 3
# 2
# 1
# 0
</code></pre>
<h2>The Call Stack</h2>
<p>When <code>countdown(3)</code> runs, here&#39;s what happens:</p>
<pre><code>countdown(3) → print 3 → calls countdown(2)
  countdown(2) → print 2 → calls countdown(1)
    countdown(1) → print 1 → calls countdown(0)
      countdown(0) → print 0 → calls countdown(-1)
        countdown(-1) → return (base case!)
</code></pre>
<p>Each call <strong>waits</strong> for the next to finish before returning.
This creates a <strong>call stack</strong> in memory!</p>
<h2>Why Recursion?</h2>
<p>✅ Elegant solutions to complex problems
✅ Natural for tree/graph problems
✅ Foundation for backtracking and dynamic programming
✅ Often simpler than iterative approaches</p>
<h2>The Golden Rule</h2>
<p><strong>Always identify the BASE CASE first!</strong></p>
<p>Otherwise... 💀 Stack overflow error!</p>
<p>Ready to write your first recursive function? Let&#39;s go! 🚀</p>
`,
      estimatedReadTime: 180,
      autoMarkComplete: false,
    },

    // ITEM 2: Factorial Exercise
    getRecursionExercise('exercise-factorial'),

    // ITEM 3: Sum Array Exercise
    getRecursionExercise('exercise-sum-array'),

    // ITEM 5: Grow List Exercise
    getRecursionExercise('exercise-grow-list'),

    // ITEM 6: Enter/Exit Trace
    getRecursionExercise('exercise-enter-exit-trace'),

    // ITEM 7: Push/Pop Trace (Make → Undo Pattern)
    getRecursionExercise('exercise-push-pop-trace'),

    // ============================================================
    // PART 2: RECURSION CREATES TREES (Items 8-11)
    // ============================================================

    // ITEM 8: Linear vs Branching Recursion
    {
      type: 'reading',
      id: 'linear-vs-branching',
      title: 'Linear vs Branching Recursion',
      content: `<h1>Linear vs Branching Recursion 🌳</h1>
<p>Recursion creates <strong>tree structures</strong>. The shape of the tree depends on how many recursive calls you make!</p>
<h2>Linear Recursion (One Child)</h2>
<p>Functions with <strong>ONE recursive call</strong> create a &quot;chain&quot; or linear tree.</p>
<h3>Example: Factorial</h3>
<pre><code class="language-python">def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)  # One call
</code></pre>
<h3>Tree for factorial(4):</h3>
<pre><code>factorial(4)
    ↓
factorial(3)
    ↓
factorial(2)
    ↓
factorial(1)
    ↓
factorial(0) ← base case
</code></pre>
<p>This is a <strong>linear tree</strong> - just a straight path down!</p>
<p><strong>Depth:</strong> 5 nodes
<strong>Branching factor:</strong> 1 (each node has 1 child)</p>
<h2>Branching Recursion (Multiple Children)</h2>
<p>Functions with <strong>MULTIPLE recursive calls</strong> create a tree that branches!</p>
<h3>Example: Fibonacci</h3>
<pre><code class="language-python">def fib(n):
    if n &lt;= 1:
        return n
    return fib(n-1) + fib(n-2)  # TWO calls!
</code></pre>
<h3>Tree for fib(4):</h3>
<pre><code>                  fib(4)
                 /      \
           fib(3)        fib(2)
          /      \       /     \
     fib(2)    fib(1) fib(1)  fib(0)
     /    \
 fib(1)  fib(0)
</code></pre>
<p>This is a <strong>binary tree</strong> - each node has 2 children!</p>
<p><strong>Depth:</strong> 5 levels
<strong>Branching factor:</strong> 2 (each node has 2 children)
<strong>Total nodes:</strong> 9 function calls</p>
<h2>Key Differences</h2>
<table>
<thead>
<tr>
<th>Aspect</th>
<th>Linear Recursion</th>
<th>Branching Recursion</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Recursive calls</strong></td>
<td>1 per function</td>
<td>2+ per function</td>
</tr>
<tr>
<td><strong>Tree shape</strong></td>
<td>Straight line (chain)</td>
<td>Tree with branches</td>
</tr>
<tr>
<td><strong>Examples</strong></td>
<td>factorial, sum, countdown</td>
<td>fibonacci, subsets, backtracking</td>
</tr>
<tr>
<td><strong>Time complexity</strong></td>
<td>Usually O(n)</td>
<td>Often O(2ⁿ) or worse!</td>
</tr>
<tr>
<td><strong>Space (stack)</strong></td>
<td>O(n) depth</td>
<td>O(n) depth but more calls</td>
</tr>
</tbody></table>
<h2>Why This Matters</h2>
<h3>1. Performance</h3>
<p>Branching recursion grows <strong>exponentially</strong>!</p>
<ul>
<li>fib(10): ~100 calls</li>
<li>fib(20): ~10,000 calls</li>
<li>fib(30): ~1,000,000 calls 😱</li>
</ul>
<h3>2. Backtracking</h3>
<p>In Module 10 (Backtracking), you&#39;ll use branching recursion to explore <strong>decision trees</strong>:</p>
<ul>
<li>Each decision = a branch</li>
<li>Multiple choices = multiple children</li>
</ul>
<h3>3. Dynamic Programming</h3>
<p>In Module 11 (DP), you&#39;ll <strong>optimize</strong> branching recursion by caching results!</p>
<h2>Visualizing Your Code</h2>
<p><strong>Rule of thumb:</strong></p>
<ul>
<li><strong>Count</strong> the number of recursive calls in your function</li>
<li>That&#39;s your <strong>branching factor</strong></li>
<li>Imagine a tree where each node has that many children</li>
</ul>
<p>Let&#39;s see branching recursion in action with Fibonacci! 🚀</p>
`,
      estimatedReadTime: 180,
      autoMarkComplete: false,
    },

    // ITEM 9: Fibonacci Exercise
    getRecursionExercise('exercise-fibonacci'),

    // ITEM 10: Every Call is a Node
    {
      type: 'reading',
      id: 'every-call-is-node',
      title: 'Every Call is a Node',
      content: `<h1>Every Call is a Node 🌳</h1>
<p>Let&#39;s formalize the connection between recursion and trees!</p>
<h2>The Mental Model</h2>
<p><strong>Every recursive function call = a node in a tree</strong></p>
<pre><code>Function call → Node
Recursive call → Edge (parent to child)
Base case → Leaf (no children)
</code></pre>
<h2>Tree Terminology → Recursion</h2>
<table>
<thead>
<tr>
<th>Tree Term</th>
<th>Recursion Meaning</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Node</strong></td>
<td>A function call with specific parameters</td>
</tr>
<tr>
<td><strong>Edge</strong></td>
<td>A recursive call from parent to child</td>
</tr>
<tr>
<td><strong>Root</strong></td>
<td>The initial function call</td>
</tr>
<tr>
<td><strong>Leaf</strong></td>
<td>Base case (recursion stops)</td>
</tr>
<tr>
<td><strong>Depth</strong></td>
<td>How many calls deep in the stack</td>
</tr>
<tr>
<td><strong>Height</strong></td>
<td>Maximum recursion depth</td>
</tr>
<tr>
<td><strong>Branching factor</strong></td>
<td>Number of recursive calls per function</td>
</tr>
</tbody></table>
<h2>Example: fib(4)</h2>
<p>Let&#39;s label the tree:</p>
<pre><code>                  fib(4) ← Root
                 /      \
           fib(3)        fib(2) ← Internal nodes
          /      \       /     \
     fib(2)    fib(1) fib(1)  fib(0) ← Leaves (base cases)
     /    \
 fib(1)  fib(0) ← More leaves
</code></pre>
<p><strong>Nodes:</strong> 9 total (9 function calls)
<strong>Leaves:</strong> 5 nodes (fib(0) or fib(1))
<strong>Height:</strong> 3 levels deep
<strong>Branching factor:</strong> 2 (each internal node has 2 children)</p>
<h2>Counting Operations</h2>
<p><strong>Number of nodes = number of function calls!</strong></p>
<p>This is how we analyze time complexity:</p>
<ul>
<li>Linear recursion (branching factor 1): O(n) nodes</li>
<li>Binary recursion (branching factor 2): O(2ⁿ) nodes</li>
<li>Ternary recursion (branching factor 3): O(3ⁿ) nodes</li>
</ul>
<h2>Different Recursion Patterns</h2>
<h3>Pattern 1: Linear (Chain)</h3>
<pre><code>factorial(4) → factorial(3) → factorial(2) → factorial(1) → factorial(0)
</code></pre>
<ul>
<li><strong>Nodes:</strong> n+1</li>
<li><strong>Shape:</strong> Straight line</li>
<li><strong>Time:</strong> O(n)</li>
</ul>
<h3>Pattern 2: Binary (Tree)</h3>
<pre><code>              fib(4)
             /      \
        fib(3)      fib(2)
         / \        / \
       ...  ...    ... ...
</code></pre>
<ul>
<li><strong>Nodes:</strong> ~2ⁿ</li>
<li><strong>Shape:</strong> Full binary tree</li>
<li><strong>Time:</strong> O(2ⁿ)</li>
</ul>
<h3>Pattern 3: Backtracking (Decision Tree)</h3>
<pre><code>           subsets([1,2])
              /        \
        Include 1    Skip 1
         /     \      /    \
      [1,2]   [1]   [2]    []
</code></pre>
<ul>
<li><strong>Nodes:</strong> Depends on choices</li>
<li><strong>Shape:</strong> Varies by problem</li>
<li><strong>Time:</strong> Often O(2ⁿ) or O(n!)</li>
</ul>
<h2>Why Visualize Trees?</h2>
<ol>
<li><strong>Understand the algorithm</strong>: See what&#39;s really happening</li>
<li><strong>Count operations</strong>: Determine time complexity</li>
<li><strong>Spot repeated work</strong>: Identify opportunities for DP</li>
<li><strong>Debug</strong>: Find where recursion goes wrong</li>
<li><strong>Design algorithms</strong>: Plan backtracking solutions</li>
</ol>
<h2>The Power of This Model</h2>
<p>Once you can <strong>draw the tree</strong>, you can:</p>
<ul>
<li>✅ Write the code (tree structure → code structure)</li>
<li>✅ Analyze performance (count nodes)</li>
<li>✅ Optimize (spot repeated nodes → memo!)</li>
<li>✅ Debug (find wrong branches)</li>
</ul>
<p><strong>This is the KEY skill for Modules 10 (Backtracking) and 11 (DP)!</strong></p>
<p>Let&#39;s practice drawing trees for different recursive functions! 🎨</p>
`,
      estimatedReadTime: 180,
      autoMarkComplete: false,
    },

    // ITEM 11: Understanding Call Trees (Reading Section)
    {
      type: 'reading',
      id: 'understanding-call-trees',
      title: 'Understanding Call Trees',
      content: `<h1>Understanding Call Trees: Step-by-Step Examples</h1>
<p>Now let&#39;s walk through three complete examples to see how different recursive patterns create different tree structures.</p>
<hr>
<h2>Example 1: Linear Recursion - countdown(3)</h2>
<pre><code class="language-python">def countdown(n):
    if n &lt; 0:
        return
    print(n)
    countdown(n - 1)
</code></pre>
<h3>Step-by-Step Tree Construction</h3>
<p><strong>Step 1:</strong> Start with the initial call</p>
<pre><code>countdown(3)
</code></pre>
<p><strong>Step 2:</strong> n=3 ≥ 0, so we print and make one recursive call</p>
<pre><code>countdown(3)  → prints &quot;3&quot;
    ↓
countdown(2)
</code></pre>
<p><strong>Step 3:</strong> Continue until we hit the base case</p>
<pre><code>countdown(3)  → prints &quot;3&quot;
    ↓
countdown(2)  → prints &quot;2&quot;
    ↓
countdown(1)  → prints &quot;1&quot;
    ↓
countdown(0)  → prints &quot;0&quot;
    ↓
countdown(-1) → base case! returns immediately
</code></pre>
<h3>Analysis</h3>
<table>
<thead>
<tr>
<th>Property</th>
<th>Value</th>
<th>Explanation</th>
</tr>
</thead>
<tbody><tr>
<td>Total nodes</td>
<td>5</td>
<td>5 function calls total</td>
</tr>
<tr>
<td>Tree depth</td>
<td>5</td>
<td>5 levels from root to leaf</td>
</tr>
<tr>
<td>Branching factor</td>
<td>1</td>
<td>Each node has exactly 1 child</td>
</tr>
<tr>
<td>Time complexity</td>
<td>O(n)</td>
<td>Linear chain = linear time</td>
</tr>
<tr>
<td>Space complexity</td>
<td>O(n)</td>
<td>Stack grows to depth n</td>
</tr>
</tbody></table>
<p><strong>Key Insight:</strong> One recursive call creates a <strong>linear chain</strong>, not a branching tree!</p>
<hr>
<h2>Example 2: Linear Recursion with Return Values - sum_list([1,2,3])</h2>
<pre><code class="language-python">def sum_list(nums, index=0):
    if index &gt;= len(nums):
        return 0
    return nums[index] + sum_list(nums, index + 1)
</code></pre>
<h3>Step-by-Step Tree Construction</h3>
<p><strong>Step 1:</strong> Start with initial call</p>
<pre><code>sum_list([1,2,3], 0)
</code></pre>
<p><strong>Step 2:</strong> Build the chain of calls</p>
<pre><code>sum_list([1,2,3], 0)  → returns 1 + sum_list(..., 1)
         ↓
sum_list([1,2,3], 1)  → returns 2 + sum_list(..., 2)
         ↓
sum_list([1,2,3], 2)  → returns 3 + sum_list(..., 3)
         ↓
sum_list([1,2,3], 3)  → index &gt;= len! returns 0 (base case)
</code></pre>
<h3>Tracing Return Values (Bottom-Up)</h3>
<pre><code>sum_list(..., 3) → returns 0
         ↑
sum_list(..., 2) → returns 3 + 0 = 3
         ↑
sum_list(..., 1) → returns 2 + 3 = 5
         ↑
sum_list(..., 0) → returns 1 + 5 = 6  ✓ Final answer!
</code></pre>
<h3>Analysis</h3>
<table>
<thead>
<tr>
<th>Property</th>
<th>Value</th>
<th>Explanation</th>
</tr>
</thead>
<tbody><tr>
<td>Total nodes</td>
<td>4</td>
<td>4 function calls</td>
</tr>
<tr>
<td>Tree depth</td>
<td>4</td>
<td>Matches length of list + 1</td>
</tr>
<tr>
<td>Branching factor</td>
<td>1</td>
<td>Still a linear chain</td>
</tr>
<tr>
<td>Return values</td>
<td>0, 3, 5, 6</td>
<td>Build up from base case</td>
</tr>
</tbody></table>
<p><strong>Key Insight:</strong> Even with return values, one recursive call still creates a linear chain!</p>
<hr>
<h2>Example 3: Binary Recursion - fib(4)</h2>
<pre><code class="language-python">def fib(n):
    if n &lt;= 1:
        return n
    return fib(n-1) + fib(n-2)
</code></pre>
<h3>Step-by-Step Tree Construction</h3>
<p><strong>Step 1:</strong> Start with initial call</p>
<pre><code>fib(4)
</code></pre>
<p><strong>Step 2:</strong> fib(4) makes TWO recursive calls</p>
<pre><code>            fib(4)
           /      \
      fib(3)      fib(2)
</code></pre>
<p><strong>Step 3:</strong> Expand fib(3) - also makes two calls</p>
<pre><code>            fib(4)
           /      \
      fib(3)      fib(2)
     /      \
 fib(2)   fib(1)  ← fib(1) is a base case!
</code></pre>
<p><strong>Step 4:</strong> Expand all remaining fib(2) nodes</p>
<pre><code>                      fib(4)
                    /        \
              fib(3)          fib(2)
             /      \         /      \
        fib(2)    fib(1)  fib(1)    fib(0)
       /    \       ↑        ↑        ↑
   fib(1)  fib(0)   base!   base!   base!
      ↑      ↑
    base!  base!
</code></pre>
<h3>Counting Nodes by Level</h3>
<pre><code>Level 0: 1 node   → fib(4)
Level 1: 2 nodes  → fib(3), fib(2)
Level 2: 4 nodes  → fib(2), fib(1), fib(1), fib(0)
Level 3: 2 nodes  → fib(1), fib(0)
─────────────────────────────────────
Total:   9 nodes
</code></pre>
<h3>Spotting Repeated Work</h3>
<pre><code>fib(2) computed: 3 times
fib(1) computed: 5 times
fib(0) computed: 3 times
</code></pre>
<p><strong>This is massive waste!</strong> We&#39;re computing the same values over and over.</p>
<h3>Analysis</h3>
<table>
<thead>
<tr>
<th>Property</th>
<th>Value</th>
<th>Explanation</th>
</tr>
</thead>
<tbody><tr>
<td>Total nodes</td>
<td>9</td>
<td>Many more calls than input!</td>
</tr>
<tr>
<td>Tree depth</td>
<td>4</td>
<td>n levels deep</td>
</tr>
<tr>
<td>Branching factor</td>
<td>2</td>
<td>Each node has 2 children</td>
</tr>
<tr>
<td>Time complexity</td>
<td>O(2^n)</td>
<td><strong>Exponential!</strong></td>
</tr>
<tr>
<td>Repeated work</td>
<td>fib(2)×3, fib(1)×5, fib(0)×3</td>
<td>Huge inefficiency</td>
</tr>
</tbody></table>
<p><strong>Critical Insight:</strong> Two recursive calls create a <strong>binary tree</strong> with exponential nodes!</p>
<hr>
<h2>Pattern Summary: Number of Recursive Calls → Tree Shape</h2>
<table>
<thead>
<tr>
<th>Recursive Calls</th>
<th>Tree Shape</th>
<th>Time Complexity</th>
<th>Example</th>
</tr>
</thead>
<tbody><tr>
<td>1 call</td>
<td>Linear chain</td>
<td>O(n)</td>
<td>factorial, countdown</td>
</tr>
<tr>
<td>2 calls</td>
<td>Binary tree</td>
<td>O(2^n)</td>
<td>fibonacci, merge sort</td>
</tr>
<tr>
<td>3 calls</td>
<td>Ternary tree</td>
<td>O(3^n)</td>
<td>(rare)</td>
</tr>
<tr>
<td>k calls</td>
<td>k-ary tree</td>
<td>O(k^n)</td>
<td>general branching</td>
</tr>
</tbody></table>
<hr>
<h2>The Power of Tree Visualization</h2>
<p>When you can visualize the call tree, you can:</p>
<p><strong>1. Count Total Operations</strong></p>
<pre><code># Count nodes = count function calls = time complexity
fib(4) → 9 nodes → 9 operations
</code></pre>
<p><strong>2. Find Maximum Stack Depth</strong></p>
<pre><code># Tree depth = max stack depth = space complexity
fib(4) → depth 4 → O(n) space
</code></pre>
<p><strong>3. Spot Optimization Opportunities</strong></p>
<pre><code># Repeated nodes = repeated work = needs memoization!
fib(2) computed 3 times → CACHE IT!
</code></pre>
<p><strong>4. Predict Performance</strong></p>
<pre><code>Linear tree → O(n) → fast for large n
Binary tree → O(2^n) → slow for n &gt; 30
</code></pre>
<hr>
<h2>Looking Ahead</h2>
<p>This visualization skill becomes essential for:</p>
<ul>
<li><strong>Module 10 (Backtracking):</strong> The tree shows all paths; pruning cuts branches</li>
<li><strong>Module 11 (Dynamic Programming):</strong> Repeated nodes → memoize → eliminate waste</li>
</ul>
<p><strong>You now have the mental model to understand any recursive algorithm!</strong></p>
`,
      estimatedReadTime: 300,
      autoMarkComplete: false,
    },

    // ============================================================
    // PART 3: TREE TERMINOLOGY & TRAVERSALS (Items 12-14)
    // ============================================================

    // ITEM 12: Tree Terminology
    {
      type: 'reading',
      id: 'tree-terminology',
      title: 'Tree Terminology',
      content: `<h1>Tree Terminology 🌳</h1>
<p>Now that you understand recursion creates trees, let&#39;s learn the formal terminology!</p>
<h2>Basic Structure</h2>
<pre><code>                Root
               /    \
          Child1    Child2
          /    \
      Leaf1    Leaf2
</code></pre>
<h3>Node</h3>
<p>A single element in the tree.</p>
<ul>
<li>In recursion: <strong>One function call</strong></li>
<li>Example: <code>fib(3)</code> is a node</li>
</ul>
<h3>Edge</h3>
<p>Connection between parent and child.</p>
<ul>
<li>In recursion: <strong>A recursive call</strong></li>
<li>Example: <code>fib(4)</code> calling <code>fib(3)</code> creates an edge</li>
</ul>
<h3>Root</h3>
<p>The first/top node.</p>
<ul>
<li>In recursion: <strong>The initial function call</strong></li>
<li>Example: When you call <code>fib(5)</code>, that&#39;s the root</li>
</ul>
<h3>Leaf</h3>
<p>A node with <strong>no children</strong>.</p>
<ul>
<li>In recursion: <strong>Base case</strong> (doesn&#39;t make recursive calls)</li>
<li>Example: <code>fib(0)</code> and <code>fib(1)</code> are leaves</li>
</ul>
<h3>Parent &amp; Child</h3>
<ul>
<li><strong>Parent</strong>: Node that calls another</li>
<li><strong>Child</strong>: Node that is called</li>
<li>Example: <code>fib(4)</code> is parent of <code>fib(3)</code> and <code>fib(2)</code></li>
</ul>
<h2>Measuring Trees</h2>
<h3>Depth of a Node</h3>
<p>Distance from root to that node (how many edges).</p>
<pre><code>          fib(4)      ← Depth 0
         /      \
    fib(3)    fib(2)  ← Depth 1
    /    \
fib(2)  fib(1)        ← Depth 2
</code></pre>
<ul>
<li><strong>Depth of fib(4):</strong> 0 (it&#39;s the root)</li>
<li><strong>Depth of fib(3):</strong> 1</li>
<li><strong>Depth of fib(2)</strong> (left one): 2</li>
</ul>
<h3>Height of Tree</h3>
<p><strong>Maximum depth</strong> - distance from root to deepest leaf.</p>
<pre><code>fib(4) tree has height 3:
fib(4) → fib(3) → fib(2) → fib(1)
</code></pre>
<ul>
<li>In recursion: <strong>Maximum call stack depth</strong></li>
</ul>
<h3>Branching Factor</h3>
<p>Number of children per node (on average or maximum).</p>
<ul>
<li>factorial: <strong>1</strong> (each call makes 1 recursive call)</li>
<li>fibonacci: <strong>2</strong> (each call makes 2 recursive calls)</li>
<li>backtracking subsets: <strong>2</strong> (include/exclude)</li>
<li>permutations: <strong>varies</strong> (n, then n-1, then n-2, ...)</li>
</ul>
<h2>Tree Properties</h2>
<h3>Complete Tree</h3>
<p>All levels are fully filled (except possibly the last).</p>
<pre><code>        A
       / \
      B   C      ← Complete
     / \  /
    D  E F
</code></pre>
<h3>Binary Tree</h3>
<p>Each node has <strong>at most 2 children</strong>.</p>
<ul>
<li>Example: Fibonacci tree</li>
</ul>
<h3>N-ary Tree</h3>
<p>Each node can have <strong>N children</strong>.</p>
<ul>
<li>Example: Backtracking with N choices</li>
</ul>
<h2>Mapping to Recursion</h2>
<table>
<thead>
<tr>
<th>Term</th>
<th>Recursion Meaning</th>
<th>Example (fib)</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Node</strong></td>
<td>Function call</td>
<td><code>fib(3)</code></td>
</tr>
<tr>
<td><strong>Edge</strong></td>
<td>Recursive call</td>
<td><code>fib(3)</code> → <code>fib(2)</code></td>
</tr>
<tr>
<td><strong>Root</strong></td>
<td>Initial call</td>
<td><code>fib(5)</code></td>
</tr>
<tr>
<td><strong>Leaf</strong></td>
<td>Base case</td>
<td><code>fib(0)</code>, <code>fib(1)</code></td>
</tr>
<tr>
<td><strong>Depth</strong></td>
<td>Call stack depth</td>
<td>How nested</td>
</tr>
<tr>
<td><strong>Height</strong></td>
<td>Max recursion depth</td>
<td>Stack size</td>
</tr>
<tr>
<td><strong>Branching</strong></td>
<td># of recursive calls</td>
<td>2 for fib</td>
</tr>
</tbody></table>
<h2>Why This Matters</h2>
<p>Understanding tree terminology helps you:</p>
<ol>
<li><strong>Communicate</strong>: &quot;The base case is at the leaves&quot;</li>
<li><strong>Analyze</strong>: &quot;Height of n means O(n) space for call stack&quot;</li>
<li><strong>Optimize</strong>: &quot;Reducing branching factor speeds things up&quot;</li>
<li><strong>Debug</strong>: &quot;The recursion is too deep (height too large)&quot;</li>
</ol>
<h2>Connection to Future Modules</h2>
<h3>Module 10 (Backtracking)</h3>
<ul>
<li>You&#39;ll explore <strong>decision trees</strong></li>
<li>Each decision = branch</li>
<li>Leaves = complete solutions</li>
</ul>
<h3>Module 11 (DP)</h3>
<ul>
<li>You&#39;ll optimize trees with <strong>memoization</strong></li>
<li>Avoid recomputing nodes</li>
<li>Turn O(2ⁿ) into O(n)!</li>
</ul>
<p>Now let&#39;s learn when to collect results! 📊</p>
`,
      estimatedReadTime: 180,
      autoMarkComplete: false,
    },

    // ITEM 13: When to Collect Results
    {
      type: 'reading',
      id: 'when-to-collect-results',
      title: 'When to Collect Results - Pre vs Post',
      content: `<h1>When to Collect Results - Pre vs Post 📊</h1>
<p>When building solutions recursively, <strong>WHEN you save results matters</strong>!</p>
<h2>Two Approaches</h2>
<h3>Approach 1: Collect at Each Step (Pre-order)</h3>
<p>Save the current state <strong>before recursing</strong> on children.</p>
<h3>Approach 2: Collect at Leaves (Post-order)</h3>
<p>Save only when you reach a <strong>complete solution</strong> (base case).</p>
<h2>Example: Generating Subsets</h2>
<p>Let&#39;s say we want all subsets of <code>[1, 2]</code>.</p>
<h3>Approach 1: Save at Each Step</h3>
<pre><code class="language-python">def subsets(nums):
    result = []

    def backtrack(path, start):
        result.append(path[:])  # Save at EVERY step!

        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(path, i + 1)
            path.pop()

    backtrack([], 0)
    return result

print(subsets([1, 2]))
# Output: [[], [1], [1, 2], [2]]
</code></pre>
<p><strong>When we save:</strong> At every node (pre-order)
<strong>What we get:</strong> All subsets (including partial ones)</p>
<p>Tree with save points marked:</p>
<pre><code>          []  ← SAVE
         /  \
      [1]    [2]  ← SAVE both
       |
    [1,2]  ← SAVE
</code></pre>
<h3>Approach 2: Save at Leaves Only</h3>
<pre><code class="language-python">def generate_complete(nums):
    result = []

    def backtrack(path, index):
        if index == len(nums):
            result.append(path[:])  # Save ONLY at leaves!
            return

        # Include current element
        path.append(nums[index])
        backtrack(path, index + 1)
        path.pop()

        # Skip current element
        backtrack(path, index + 1)

    backtrack([], 0)
    return result

print(generate_complete([1, 2]))
# Output: [[], [1], [2], [1, 2]]  (different order but same sets)
</code></pre>
<p><strong>When we save:</strong> Only at base case (post-order)
<strong>What we get:</strong> Complete solutions only</p>
<p>Tree with save points:</p>
<pre><code>              []
            /    \
         [1]      []
        /   \    /   \
    [1,2]   [1] [2]   []  ← SAVE at leaves only
      ↓      ↓   ↓     ↓
    SAVE   SAVE SAVE  SAVE
</code></pre>
<h2>When to Use Each Approach</h2>
<h3>Use Pre-Order (Save at Each Step) When:</h3>
<p>✅ You want <strong>all possible states</strong> (partial + complete)
✅ Building incrementally matters
✅ Problem asks for &quot;all prefixes&quot; or &quot;all combinations&quot;</p>
<p><strong>Examples:</strong></p>
<ul>
<li>All subsets of an array</li>
<li>All paths in a tree (including partial paths)</li>
<li>Generating all prefixes of a string</li>
</ul>
<h3>Use Post-Order (Save at Leaves) When:</h3>
<p>✅ You want only <strong>complete solutions</strong>
✅ Partial states don&#39;t count
✅ Problem specifies &quot;valid&quot; solutions with specific criteria</p>
<p><strong>Examples:</strong></p>
<ul>
<li>Permutations (only full-length permutations count)</li>
<li>N-Queens (only complete valid board states)</li>
<li>Sudoku solutions (only filled boards)</li>
</ul>
<h2>Three Traversal Orders</h2>
<p>Formally, these are tree traversal orders:</p>
<h3>1. Pre-Order</h3>
<p>Process node <strong>before</strong> children.</p>
<pre><code class="language-python">def traverse(node):
    process(node)          # ← Do work FIRST
    for child in children:
        traverse(child)
</code></pre>
<h3>2. Post-Order</h3>
<p>Process node <strong>after</strong> children.</p>
<pre><code class="language-python">def traverse(node):
    for child in children:
        traverse(child)
    process(node)          # ← Do work LAST
</code></pre>
<h3>3. In-Order (Binary Trees Only)</h3>
<p>Process node <strong>between</strong> left and right children.</p>
<pre><code class="language-python">def traverse(node):
    traverse(node.left)
    process(node)          # ← Do work IN MIDDLE
    traverse(node.right)
</code></pre>
<h2>Backtracking Connection</h2>
<p>In <strong>Module 10 (Backtracking)</strong>, you&#39;ll use both:</p>
<ul>
<li><strong>Pre-order</strong> for subset problems</li>
<li><strong>Post-order</strong> for permutation/combination problems</li>
</ul>
<p>The key is understanding <strong>what</strong> you want to collect!</p>
<h2>The Pattern</h2>
<pre><code class="language-python">def backtrack(state):
    # PRE-ORDER: Save here if you want all states
    # result.append(state[:])

    if is_complete(state):
        # POST-ORDER: Save here if you want only complete solutions
        # result.append(state[:])
        return

    for choice in get_choices():
        make_choice(choice)
        backtrack(new_state)
        undo_choice(choice)
</code></pre>
<p>Choose where to save based on what the problem asks for!</p>
<p>Let&#39;s practice this pattern! 🎯</p>
`,
      estimatedReadTime: 240,
      autoMarkComplete: false,
    },

    // ITEM 14: Collect Results Practice
    getRecursionExercise('exercise-collect-pre'),

    // ============================================================
    // PART 4: COMPLETION (Item 15)
    // ============================================================

    // Transition / Completion Message
    {
      type: 'reading',
      id: 'module-complete',
      title: 'Module Complete!',
      content: `<h1>Module Complete!</h1>
<h2>What You&#39;ve Mastered</h2>
<p>Congratulations! You now understand:</p>
<h3>✅ Recursion Fundamentals</h3>
<ul>
<li><strong>Base cases</strong> and <strong>recursive cases</strong></li>
<li>How the <strong>call stack</strong> builds and unwinds</li>
<li>When to use recursion vs iteration</li>
</ul>
<h3>✅ Recursion as Trees</h3>
<ul>
<li>Every recursive call = a node in a tree</li>
<li><strong>Linear recursion</strong> (factorial, sum) vs <strong>branching recursion</strong> (fibonacci, backtracking)</li>
<li>Drawing and analyzing recursion trees</li>
</ul>
<h3>✅ Critical Patterns</h3>
<ul>
<li><strong>The copy problem</strong>: <code>path[:]</code> vs <code>path</code></li>
<li><strong>Make → Recurse → Undo</strong> pattern (foundation of backtracking!)</li>
<li><strong>Pre-order</strong> vs <strong>post-order</strong> result collection</li>
</ul>
<h3>✅ Tree Terminology</h3>
<ul>
<li>Nodes, edges, leaves, depth, height, branching factor</li>
<li>How to map tree concepts to recursion</li>
</ul>
<h3>✅ Problem-Solving Skills</h3>
<ul>
<li>Draw the tree FIRST, then write the code</li>
<li>Count nodes to determine time complexity</li>
<li>Identify repeated work (leads to DP optimization!)</li>
</ul>
<hr>
<h2>Why This Matters</h2>
<p>You just built the <strong>foundation</strong> for two crucial topics:</p>
<h3>Module 10: Backtracking &amp; Decision Trees</h3>
<p>In Module 10, you&#39;ll apply recursion to explore decision spaces:</p>
<ul>
<li>Include or exclude? → 2 branches</li>
<li>Which element to pick? → n branches</li>
<li>The recursion tree becomes a <strong>decision tree</strong></li>
<li>You already learned the pattern: make → recurse → undo!</li>
</ul>
<h3>Module 11: Dynamic Programming</h3>
<p>In Module 11, you&#39;ll <strong>optimize</strong> recursive solutions:</p>
<ul>
<li>Identify repeated nodes in the tree</li>
<li><strong>Memoization</strong>: Cache results to avoid recomputation</li>
<li>Transform O(2^n) → O(n)!</li>
<li>You already spotted the waste in fibonacci!</li>
</ul>
<hr>
<h2>The Core Insight</h2>
<p><strong>🌳 Recursion IS a Tree</strong></p>
<p>Once you can <strong>draw the tree</strong>, you can:</p>
<ul>
<li>✅ <strong>Understand</strong> the algorithm (visualize what&#39;s happening)</li>
<li>✅ <strong>Analyze</strong> performance (count nodes)</li>
<li>✅ <strong>Optimize</strong> (spot repeated nodes → memo!)</li>
<li>✅ <strong>Debug</strong> (find wrong branches)</li>
<li>✅ <strong>Design</strong> new algorithms (plan the tree, then code it)</li>
</ul>
<p>This is the <strong>KEY skill</strong> that separates good programmers from great ones!</p>
<hr>
<h2>What&#39;s Next</h2>
<h3>Module 10: Backtracking &amp; Decision Trees</h3>
<p>Ready to explore decision spaces? 🚀</p>
<p>In Module 10, you&#39;ll learn:</p>
<ul>
<li>How to go from empty array → final answer</li>
<li>Visualizing problems as decision trees</li>
<li>The 4-step backtracking template</li>
<li>Solving: Subsets, Permutations, Combinations, N-Queens, and more!</li>
</ul>
<p><strong>The best part?</strong> You already know the core pattern from Item 7:</p>
<ol>
<li>Make a choice</li>
<li>Recurse</li>
<li>Undo the choice</li>
</ol>
<p>That&#39;s backtracking! We just need to apply it to decision trees.</p>
<p><strong>Are you ready?</strong> 🔥</p>
<hr>
<h2>Quick Reference Card</h2>
<p>Keep this handy!</p>
<h3>The Recursive Pattern</h3>
<pre><code class="language-python">def solve(state):
    # BASE CASE
    if is_done(state):
        return result

    # RECURSIVE CASE
    smaller = solve(smaller_problem)
    return combine(state, smaller)
</code></pre>
<h3>The Backtracking Pattern (Preview!)</h3>
<pre><code class="language-python">def backtrack(state, path):
    # BASE CASE
    if is_complete(state):
        result.append(path[:])  # Don&#39;t forget to copy!
        return

    # TRY EACH CHOICE
    for choice in get_choices(state):
        path.append(choice)        # MAKE
        backtrack(next_state, path)  # RECURSE
        path.pop()                  # UNDO
</code></pre>
<h3>Remember</h3>
<ul>
<li>✅ Always identify base case first</li>
<li>✅ Draw the tree before coding</li>
<li>✅ Copy when saving: <code>path[:]</code></li>
<li>✅ Branching factor determines time complexity</li>
<li>✅ Repeated nodes = opportunity for DP!</li>
</ul>
<hr>
<p><strong>Next:</strong> Module 10: Backtracking &amp; Decision Trees →</p>
`,
      estimatedReadTime: 180,
      autoMarkComplete: false,
    },
  
  ...module9RecursionTreesLessonSmartPracticeExercises,
  ],
};
