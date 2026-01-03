import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { module10BacktrackingLessonSmartPracticeExercises } from './exercises/moduleBacktrackingBasicsLessonSmartPracticeExercises';

export const module10BacktrackingLesson: ProgressiveLesson = {
  id: 'backtracking-decision-trees',
    title: 'Module: Backtracking & Decision Trees',
    description: 'Master backtracking through tree visualization: empty array → decision tree → code',
    unlockMode: 'sequential',
    sections: [
        // ============================================================
        // PART 0: FROM DECISIONS TO TREES (Items 1-2)
        // ============================================================

        // ITEM 1: Empty Array → Final Answer Visualization
        {
            type: 'reading',
            id: 'empty-to-final-visualization',
            title: 'Empty Array → Final Answer',
            content: `<h1>Empty Array → Final Answer 🎯</h1>
<p>Welcome to backtracking! You already mastered recursion in Module 9. Now let&#39;s apply it to <strong>decision problems</strong>.</p>
<h2>The Problem: All Subsets</h2>
<p>Generate <strong>all possible subsets</strong> of <code>[1, 2, 3]</code>.</p>
<p><strong>Example output:</strong></p>
<pre><code>[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]
</code></pre>
<h2>How Do You Solve This? 🤔</h2>
<p>Forget code for a moment. How would YOU find all subsets?</p>
<h3>The Natural Approach</h3>
<p><strong>Start with an empty array: <code>[]</code></strong></p>
<p>Now, for element <strong>1</strong>, you have <strong>2 choices</strong>:</p>
<ol>
<li><strong>Include 1</strong> → <code>[1]</code></li>
<li><strong>Skip 1</strong> → <code>[]</code></li>
</ol>
<p>Let&#39;s say you <strong>include 1</strong>. Now you have <code>[1]</code>.</p>
<p>For element <strong>2</strong>, you again have <strong>2 choices</strong>:</p>
<ol>
<li><strong>Include 2</strong> → <code>[1, 2]</code></li>
<li><strong>Skip 2</strong> → <code>[1]</code></li>
</ol>
<p>Let&#39;s say you <strong>include 2</strong>. Now you have <code>[1, 2]</code>.</p>
<p>For element <strong>3</strong>, again <strong>2 choices</strong>:</p>
<ol>
<li><strong>Include 3</strong> → <code>[1, 2, 3]</code></li>
<li><strong>Skip 3</strong> → <code>[1, 2]</code></li>
</ol>
<p>Both <code>[1, 2, 3]</code> and <code>[1, 2]</code> are valid subsets! ✅</p>
<h2>The Pattern</h2>
<p>At each step:</p>
<ol>
<li><strong>Look at the current element</strong></li>
<li><strong>Make a decision</strong>: Include it or skip it?</li>
<li><strong>Continue</strong> with remaining elements</li>
<li><strong>Collect</strong> complete solutions</li>
</ol>
<h2>Visualizing the Process</h2>
<pre><code>Start: []

Element 1:
  Include 1: []  → [1]
  Skip 1:    []  → []

Element 2 (if we included 1):
  Include 2: [1]    → [1, 2]
  Skip 2:    [1]    → [1]

Element 2 (if we skipped 1):
  Include 2: []     → [2]
  Skip 2:    []     → []

... and so on
</code></pre>
<h2>Key Insights</h2>
<p>🔑 <strong>We&#39;re making decisions at each step</strong>
🔑 <strong>Each decision leads to a new state</strong>
🔑 <strong>We explore ALL possibilities</strong> (that&#39;s backtracking!)
🔑 <strong>NOT interested in intermediate results</strong>, just final answers</p>
<h2>The Questions</h2>
<ul>
<li>How do we organize all these decisions?</li>
<li>How do we make sure we explore every possibility?</li>
<li>How do we know when we&#39;ve found a complete solution?</li>
</ul>
<p><strong>Next:</strong> We&#39;ll see how these decisions naturally form a tree! 🌳</p>
`,
            estimatedReadTime: 180,
            autoMarkComplete: false,
        },

        // ITEM 2: The Tree Emerges
        {
            type: 'reading',
            id: 'tree-emerges-naturally',
            title: 'The Tree Emerges Naturally',
            content: `<h1>The Tree Emerges Naturally 🌳</h1>
<p>Remember the decision-making process you just went through?</p>
<p><strong>Let&#39;s draw it as a tree!</strong></p>
<h2>The Subsets Tree for [1, 2, 3]</h2>
<pre><code>                      []
                     /  \
              Include 1  Skip 1
                 /          \
               [1]          []
              /  \         /  \
        Include 2  Skip 2  Include 2  Skip 2
           /        \       /          \
       [1,2]       [1]    [2]          []
       /  \        / \    / \          / \
      ...  ...    ... ... ... ...    ... ...
</code></pre>
<p><strong>Complete tree (showing all leaves):</strong></p>
<pre><code>                          []
                      /        \
                   [1]          []
                  /   \        /   \
              [1,2]   [1]    [2]    []
              /  \    / \   / \    / \
          [1,2,3][1,2][1,3][1][2,3][2][3][]
             ↓     ↓    ↓   ↓  ↓   ↓  ↓  ↓
          All 8 subsets (leaves)
</code></pre>
<h2>The Big Reveal</h2>
<p><strong>The decision-making process YOU did IS this tree!</strong> 🎯</p>
<h3>Tree Structure = Problem Structure</h3>
<ul>
<li><strong>Root</strong>: Starting state (<code>[]</code>)</li>
<li><strong>Each node</strong>: A state after some decisions</li>
<li><strong>Each edge</strong>: A decision (include or skip)</li>
<li><strong>Leaves</strong>: Complete solutions (processed all elements)</li>
<li><strong>Paths from root to leaf</strong>: Different ways to build subsets</li>
</ul>
<h2>Mapping to Module 9 Concepts</h2>
<p>Remember from Module 9:</p>
<ul>
<li>This is <strong>branching recursion</strong> (2 children per node)</li>
<li><strong>Branching factor</strong>: 2 (include/exclude)</li>
<li><strong>Depth</strong>: 3 (for 3 elements)</li>
<li><strong>Total nodes</strong>: 2³ = 8 leaves + internal nodes = 15 total</li>
<li><strong>Each call</strong> = a node in this tree</li>
</ul>
<h2>How to Read the Tree</h2>
<p><strong>Start at root:</strong></p>
<ul>
<li>&quot;At <code>[]</code>, what can I do with element 1?&quot;</li>
</ul>
<p><strong>Follow left branch (Include 1):</strong></p>
<ul>
<li>&quot;Now at <code>[1]</code>, what can I do with element 2?&quot;</li>
</ul>
<p><strong>Keep going until you reach a leaf:</strong></p>
<ul>
<li>&quot;I&#39;ve made decisions for all elements → complete subset!&quot;</li>
</ul>
<h2>The Power of This Visualization</h2>
<p>Once you see the tree, you understand:</p>
<ol>
<li><strong>What decisions</strong> to make at each step</li>
<li><strong>When to stop</strong> (reached a leaf)</li>
<li><strong>How many solutions</strong> (count the leaves)</li>
<li><strong>The code structure</strong> (tree traversal!)</li>
</ol>
<h2>Next Step</h2>
<p>Now that you can SEE the tree, let&#39;s map it to code!</p>
<p>The tree structure will <strong>directly translate</strong> to the code structure. 🎯</p>
<p>Ready? Let&#39;s learn the 4-step template! 🚀</p>
`,
            estimatedReadTime: 180,
            autoMarkComplete: false,
        },

        // ============================================================
        // PART 1: TREE → CODE MAPPING (Items 3-7)
        // ============================================================

        // ITEM 3: The 4-Step Template
        {
            type: 'reading',
            id: 'four-step-template',
            title: 'The 4-Step Backtracking Template',
            content: `<h1>The 4-Step Backtracking Template 📋</h1>
<p>Now we map the <strong>tree structure</strong> to <strong>code structure</strong>.</p>
<h2>The Tree</h2>
<pre><code>                []
               /  \
            [1]    []
           /  \   /  \
       [1,2] [1] [2]  []  ← Complete solutions (leaves)
</code></pre>
<h2>The 4 Steps</h2>
<p>Every backtracking solution has these 4 steps:</p>
<h3>STEP 1: Base Case (Are we at a leaf?)</h3>
<p><strong>Tree:</strong> Leaves = when we&#39;ve processed all elements</p>
<p><strong>Code:</strong></p>
<pre><code class="language-python">if index == len(nums):
    result.append(path[:])  # Save solution!
    return
</code></pre>
<p><strong>Why:</strong> We&#39;ve made decisions for all elements → complete subset!</p>
<hr>
<h3>STEP 2: Decisions (What branches from this node?)</h3>
<p><strong>Tree:</strong> Each node has 2 branches (include/skip)</p>
<p><strong>Code:</strong> We explore BOTH branches:</p>
<ul>
<li>Branch 1: Include current element</li>
<li>Branch 2: Skip current element</li>
</ul>
<hr>
<h3>STEP 3: Make Decision → Explore → Undo</h3>
<p>This is the pattern from <strong>Module 9, Item 7</strong>!</p>
<p><strong>For the &quot;Include&quot; branch:</strong></p>
<pre><code class="language-python"># MAKE the decision
path.append(nums[index])

# EXPLORE that branch (recurse)
backtrack(path, index + 1)

# UNDO the decision (backtrack!)
path.pop()
</code></pre>
<p><strong>For the &quot;Skip&quot; branch:</strong></p>
<pre><code class="language-python"># No make/undo needed (we&#39;re not changing anything)
# Just EXPLORE that branch
backtrack(path, index + 1)
</code></pre>
<hr>
<h3>STEP 4: Return (After exploring all branches)</h3>
<p>After exploring both branches, return to parent node.</p>
<h2>The Complete Template</h2>
<pre><code class="language-python">def subsets(nums):
    result = []

    def backtrack(path, index):
        # STEP 1: BASE CASE (leaf node?)
        if index == len(nums):
            result.append(path[:])  # Save solution
            return

        # STEP 2 &amp; 3: DECISIONS (branches)

        # Branch 1: Include nums[index]
        path.append(nums[index])        # MAKE
        backtrack(path, index + 1)      # EXPLORE
        path.pop()                       # UNDO

        # Branch 2: Skip nums[index]
        backtrack(path, index + 1)      # EXPLORE

    backtrack([], 0)
    return result
</code></pre>
<h2>Side-by-Side: Tree ↔ Code</h2>
<table>
<thead>
<tr>
<th>Tree Concept</th>
<th>Code</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Leaf node</strong></td>
<td><code>if index == len(nums)</code></td>
</tr>
<tr>
<td><strong>2 branches</strong></td>
<td>Two recursive calls</td>
</tr>
<tr>
<td><strong>Include branch</strong></td>
<td><code>path.append(...)</code> → recurse → <code>path.pop()</code></td>
</tr>
<tr>
<td><strong>Skip branch</strong></td>
<td>Just recurse (no state change)</td>
</tr>
<tr>
<td><strong>Traversal</strong></td>
<td>DFS (explore left, then right)</td>
</tr>
</tbody></table>
<h2>Why This Works</h2>
<ol>
<li><strong>Recursion explores the tree</strong> (DFS)</li>
<li><strong>Each call = a node</strong> in the tree</li>
<li><strong>Base case = leaves</strong> (save complete solutions)</li>
<li><strong>Make/undo = backtracking</strong> (try one branch, undo, try another)</li>
</ol>
<h2>The Universal Pattern</h2>
<p>This template works for <strong>ALL backtracking problems</strong>!</p>
<p>Only the <strong>decisions</strong> change:</p>
<ul>
<li>Subsets: Include/exclude</li>
<li>Permutations: Pick unused element</li>
<li>Combinations: Pick from remaining</li>
<li>N-Queens: Place queen in column</li>
</ul>
<p>The <strong>structure</strong> stays the same! 🎯</p>
<p>Ready to implement it? Let&#39;s code subsets! 🚀</p>
`,
            estimatedReadTime: 240,
            autoMarkComplete: false,
        },

        // ITEM 4: Subsets Implementation
        ,// ITEM 5: Drawing Trees Practice
        {
            type: 'reading',
            id: 'drawing-trees-practice',
            title: 'Practice: Drawing Your Own Trees',
            content: `<h1>Practice: Drawing Your Own Trees</h1>

<p>Before we continue, let's practice drawing decision trees for different problems.</p>

<h2>Why This Matters</h2>

<p><strong>If you can draw the tree, you can write the code!</strong></p>

<p>Drawing the tree helps you:</p>
<ol>
<li><strong>See all decisions</strong> at each step</li>
<li><strong>Identify the base case</strong> (leaves)</li>
<li><strong>Understand the structure</strong> before coding</li>
<li><strong>Debug</strong> when something goes wrong</li>
</ol>

<h2>Problem 1: Subsets of [A, B, C]</h2>

<p><strong>Draw the tree</strong> for generating all subsets of <code>['A', 'B', 'C']</code>.</p>

<details>
<summary>Click to see solution</summary>
<div class="p-4">
<pre><code>                         []
              ┌──────────┼──────────┐
             [A]        [B]        [C]
           ┌──┴──┐       │
        [A,B]  [A,C]   [B,C]
           │
       [A,B,C]</code></pre>
<p><strong>8 total subsets</strong> (2^3 = 8): [], [A], [B], [C], [A,B], [A,C], [B,C], [A,B,C]</p>
<p><strong>Pattern:</strong> From each node, branch to add remaining elements (forward only to avoid duplicates).</p>
</div>
</details>

<h2>Problem 2: Permutations of [1, 2, 3]</h2>

<p><strong>Draw the tree</strong> for generating all permutations of <code>[1, 2, 3]</code>.</p>

<p><strong>Hint:</strong> At each step, pick an unused element!</p>

<details>
<summary>Click to see solution</summary>
<div class="p-4">
<pre><code>                              []
               ┌───────────────┼───────────────┐
              [1]             [2]             [3]
           ┌───┴───┐       ┌───┴───┐       ┌───┴───┐
         [1,2]   [1,3]   [2,1]   [2,3]   [3,1]   [3,2]
           │       │       │       │       │       │
        [1,2,3] [1,3,2] [2,1,3] [2,3,1] [3,1,2] [3,2,1]</code></pre>
<p><strong>6 leaves = 6 permutations</strong> (3! = 6)</p>
<p><strong>Key difference from subsets:</strong></p>
<ul>
<li>Subsets: branch forward only (no duplicates)</li>
<li>Permutations: branch to ANY unused element</li>
</ul>
</div>
</details>

<h2>Problem 3: Combinations of [1, 2, 3], k=2</h2>

<p><strong>Draw the tree</strong> for generating all 2-element combinations.</p>

<p><strong>Hint:</strong> Like subsets, but stop at depth k=2!</p>

<details>
<summary>Click to see solution</summary>
<div class="p-4">
<pre><code>                    []
                   /  \
                [1]    [] (skip 1)
               /  \      \
           [1,2] [1]     [2]
             ↓    /\      /\
          STOP [1,3] [1] [2,3] [2]
                 ↓    ↓    ↓    ↓
              STOP STOP STOP STOP</code></pre>
<p><strong>3 valid 2-element combinations:</strong> <code>[1,2]</code>, <code>[1,3]</code>, <code>[2,3]</code></p>
<p><strong>Base case:</strong> Stop when <code>len(path) == k</code></p>
</div>
</details>

<h2>The Pattern Emerges</h2>

<p>Notice:</p>
<ul>
<li><strong>Subsets:</strong> Branch to add remaining elements (forward only)</li>
<li><strong>Permutations:</strong> Branch to any unused element</li>
<li><strong>Combinations:</strong> Like subsets, but stop at size k</li>
</ul>

<p><strong>All follow the same structure:</strong></p>
<ol>
<li>Start with empty state</li>
<li>Make decisions (branches)</li>
<li>Reach complete solution (leaves)</li>
<li>Backtrack and try other branches</li>
</ol>

<h2>Exercise: Draw Before You Code</h2>

<p>For the next problems, <strong>always</strong>:</p>
<ol>
<li>Draw the tree first</li>
<li>Identify leaves (base case)</li>
<li>Count branches (decisions)</li>
<li>Then write code</li>
</ol>

<p><strong>Next:</strong> Let's trace through the execution!</p>`,
            estimatedReadTime: 180,
            autoMarkComplete: false,
        },

        // ITEM 6: Tracing Execution
        {
            type: 'reading',
            id: 'tracing-execution',
            title: 'Tracing the Execution',
            content: `<h1>Tracing the Execution 🔍</h1>
<p>Let&#39;s trace exactly what happens when we run <code>subsets([1, 2])</code>.</p>
<h2>The Code</h2>
<pre><code class="language-python">def subsets(nums):
    result = []

    def backtrack(path, index):
        if index == len(nums):
            result.append(path[:])
            return

        # Include nums[index]
        path.append(nums[index])
        backtrack(path, index + 1)
        path.pop()

        # Skip nums[index]
        backtrack(path, index + 1)

    backtrack([], 0)
    return result
</code></pre>
<h2>The Tree (for reference)</h2>
<pre><code>         []
        /  \
     [1]    []
    /  \   /  \
  [1,2][1][2]  []
</code></pre>
<h2>Step-by-Step Trace</h2>
<pre><code>Call 1: backtrack([], 0)
  index=0, path=[]
  Not at base (0 != 2)

  Decision 1: Include nums[0]=1
    path.append(1) → path=[1]

    Call 2: backtrack([1], 1)
      index=1, path=[1]
      Not at base (1 != 2)

      Decision 1: Include nums[1]=2
        path.append(2) → path=[1,2]

        Call 3: backtrack([1,2], 2)
          index=2, path=[1,2]
          BASE CASE! (2 == 2)
          result.append([1,2][:]) → result=[[1,2]]
          return

        path.pop() → path=[1]

      Decision 2: Skip nums[1]=2

        Call 4: backtrack([1], 2)
          index=2, path=[1]
          BASE CASE! (2 == 2)
          result.append([1][:]) → result=[[1,2], [1]]
          return

      return (back to Call 1)

    path.pop() → path=[]

  Decision 2: Skip nums[0]=1

    Call 5: backtrack([], 1)
      index=1, path=[]
      Not at base (1 != 2)

      Decision 1: Include nums[1]=2
        path.append(2) → path=[2]

        Call 6: backtrack([2], 2)
          index=2, path=[2]
          BASE CASE! (2 == 2)
          result.append([2][:]) → result=[[1,2], [1], [2]]
          return

        path.pop() → path=[]

      Decision 2: Skip nums[1]=2

        Call 7: backtrack([], 2)
          index=2, path=[]
          BASE CASE! (2 == 2)
          result.append([][:]) → result=[[1,2], [1], [2], []]
          return

      return (back to Call 1)

  return (back to main)

Final result: [[1,2], [1], [2], []]
</code></pre>
<h2>Key Observations</h2>
<h3>1. DFS Exploration</h3>
<p>The recursion explores <strong>left (include) branches first</strong>, going deep before backtracking.</p>
<h3>2. The Call Stack</h3>
<ul>
<li><strong>Push</strong> when making a recursive call</li>
<li><strong>Pop</strong> when returning</li>
<li>Maximum depth = len(nums) + 1</li>
</ul>
<h3>3. The path Variable</h3>
<ul>
<li><strong>Shared</strong> across all calls (that&#39;s why we copy with <code>path[:]</code>)</li>
<li><strong>Modified</strong> by append/pop</li>
<li><strong>Restored</strong> after each branch (backtracking!)</li>
</ul>
<h3>4. Base Case Hits</h3>
<p>We hit the base case <strong>4 times</strong> (once per leaf):</p>
<ul>
<li>Call 3: path=[1,2]</li>
<li>Call 4: path=[1]</li>
<li>Call 6: path=[2]</li>
<li>Call 7: path=[]</li>
</ul>
<hr>
<h2>Visualization: Call Stack Over Time</h2>
<pre><code>Time →

Call 1: backtrack([], 0)
  Call 2: backtrack([1], 1)
    Call 3: backtrack([1,2], 2) ✓ Save [1,2]
  [pop back to Call 2]
    Call 4: backtrack([1], 2) ✓ Save [1]
  [pop back to Call 1]
  Call 5: backtrack([], 1)
    Call 6: backtrack([2], 2) ✓ Save [2]
  [pop back to Call 5]
    Call 7: backtrack([], 2) ✓ Save []
</code></pre>
<hr>
<h2>Why Tracing Helps</h2>
<ol>
<li><strong>Understand the flow</strong> - see the DFS traversal</li>
<li><strong>Debug issues</strong> - find where logic goes wrong</li>
<li><strong>Build intuition</strong> - connect tree to execution</li>
<li><strong>Optimize</strong> - identify repeated work (→ Module 11!)</li>
</ol>
<hr>
<p><strong>Next:</strong> Let&#39;s implement more patterns! 🚀</p>
`,
            estimatedReadTime: 240,
            autoMarkComplete: false,
        },

        // ITEM 7: Complexity Analysis
        {
            type: 'reading',
            id: 'complexity-analysis',
            title: 'Time and Space Complexity',
            content: `<h1>Time and Space Complexity ⏱️</h1>
<p>Understanding the complexity of backtracking helps you know when to use it.</p>
<h2>Subsets Analysis</h2>
<pre><code class="language-python">def subsets(nums):
    result = []
    def backtrack(path, index):
        if index == len(nums):
            result.append(path[:])
            return
        path.append(nums[index])
        backtrack(path, index + 1)
        path.pop()
        backtrack(path, index + 1)
    backtrack([], 0)
    return result
</code></pre>
<h3>Time Complexity: O(2ⁿ × n)</h3>
<p><strong>Why?</strong></p>
<ol>
<li><p><strong>Number of subsets:</strong> 2ⁿ</p>
<ul>
<li>Each element has 2 choices: include or exclude</li>
<li>n elements → 2 × 2 × ... × 2 (n times) = 2ⁿ</li>
</ul>
</li>
<li><p><strong>Work per subset:</strong> O(n)</p>
<ul>
<li>Copying the path: <code>path[:]</code> takes O(n) time</li>
</ul>
</li>
<li><p><strong>Total:</strong> O(2ⁿ) subsets × O(n) copy time = <strong>O(2ⁿ × n)</strong></p>
</li>
</ol>
<h3>Space Complexity: O(n)</h3>
<p><strong>Why?</strong></p>
<ol>
<li><p><strong>Recursion depth:</strong> O(n)</p>
<ul>
<li>Maximum depth = n (one decision per element)</li>
<li>Call stack size = O(n)</li>
</ul>
</li>
<li><p><strong>path array:</strong> O(n)</p>
<ul>
<li>Maximum size = n (all elements included)</li>
</ul>
</li>
<li><p><strong>Output:</strong> O(2ⁿ × n)</p>
<ul>
<li>2ⁿ subsets, each up to size n</li>
<li>Usually <strong>not counted</strong> in space complexity</li>
</ul>
</li>
</ol>
<p><strong>Total auxiliary space:</strong> O(n) (excluding output)</p>
<hr>
<h2>Permutations Analysis</h2>
<pre><code class="language-python">def permute(nums):
    result = []
    def backtrack(path, used):
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            path.append(nums[i])
            used[i] = True
            backtrack(path, used)
            used[i] = False
            path.pop()
    backtrack([], [False] * len(nums))
    return result
</code></pre>
<h3>Time Complexity: O(n! × n)</h3>
<p><strong>Why?</strong></p>
<ol>
<li><p><strong>Number of permutations:</strong> n!</p>
<ul>
<li>First position: n choices</li>
<li>Second position: n-1 choices</li>
<li>Third position: n-2 choices</li>
<li>...</li>
<li>n × (n-1) × (n-2) × ... × 1 = n!</li>
</ul>
</li>
<li><p><strong>Work per permutation:</strong> O(n)</p>
<ul>
<li>Copying: <code>path[:]</code> takes O(n)</li>
</ul>
</li>
<li><p><strong>Total:</strong> n! permutations × O(n) copy = <strong>O(n! × n)</strong></p>
</li>
</ol>
<h3>Space Complexity: O(n)</h3>
<ul>
<li>Recursion depth: O(n)</li>
<li>path array: O(n)</li>
<li>used array: O(n)</li>
</ul>
<hr>
<h2>Combinations Analysis (k elements from n)</h2>
<h3>Time Complexity: O(C(n,k) × k)</h3>
<p><strong>Why?</strong></p>
<ol>
<li><p><strong>Number of combinations:</strong> C(n, k) = n! / (k! × (n-k)!)</p>
<ul>
<li>For k=2, n=4: C(4,2) = 6</li>
</ul>
</li>
<li><p><strong>Work per combination:</strong> O(k)</p>
<ul>
<li>Copying path of size k</li>
</ul>
</li>
<li><p><strong>Total:</strong> C(n,k) × k</p>
</li>
</ol>
<h3>Space Complexity: O(k)</h3>
<ul>
<li>Maximum recursion depth: O(k)</li>
<li>path size: O(k)</li>
</ul>
<hr>
<h2>General Pattern</h2>
<table>
<thead>
<tr>
<th>Problem</th>
<th>Time</th>
<th>Space</th>
<th># Solutions</th>
</tr>
</thead>
<tbody><tr>
<td>Subsets</td>
<td>O(2ⁿ × n)</td>
<td>O(n)</td>
<td>2ⁿ</td>
</tr>
<tr>
<td>Permutations</td>
<td>O(n! × n)</td>
<td>O(n)</td>
<td>n!</td>
</tr>
<tr>
<td>Combinations</td>
<td>O(C(n,k) × k)</td>
<td>O(k)</td>
<td>C(n,k)</td>
</tr>
<tr>
<td>N-Queens</td>
<td>O(n!)</td>
<td>O(n)</td>
<td>depends</td>
</tr>
</tbody></table>
<hr>
<h2>When to Use Backtracking</h2>
<p>✅ <strong>Use when:</strong></p>
<ul>
<li>Need to find <strong>all solutions</strong> (not just one)</li>
<li>Solutions have <strong>constraints</strong> (N-Queens, Sudoku)</li>
<li>Input size is <strong>small</strong> (n ≤ 20 typically)</li>
</ul>
<p>❌ <strong>Avoid when:</strong></p>
<ul>
<li>Just need <strong>one solution</strong> (use greedy/DP)</li>
<li>Input is <strong>large</strong> (n &gt; 25)</li>
<li>Can optimize with <strong>memoization</strong> (→ DP)</li>
</ul>
<hr>
<h2>Comparison: Backtracking vs DP</h2>
<table>
<thead>
<tr>
<th>Aspect</th>
<th>Backtracking</th>
<th>DP</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Goal</strong></td>
<td>Find all solutions</td>
<td>Find optimal solution</td>
</tr>
<tr>
<td><strong>Tree</strong></td>
<td>Explore all paths</td>
<td>Overlapping subproblems</td>
</tr>
<tr>
<td><strong>Time</strong></td>
<td>Exponential (2ⁿ, n!)</td>
<td>Polynomial (n, n²)</td>
</tr>
<tr>
<td><strong>When</strong></td>
<td>Small input, all solutions</td>
<td>Repeated subproblems</td>
</tr>
</tbody></table>
<p><strong>Key insight:</strong> If backtracking tree has <strong>repeated nodes</strong> → use DP! (Module 11)</p>
<hr>
<p><strong>Next:</strong> Let&#39;s master the core patterns! 🚀</p>
`,
            estimatedReadTime: 240,
            autoMarkComplete: false,
        },

        // ============================================================
        // PART 2: CLASSIC PATTERNS (Items 8-13)
        // ============================================================

        // ITEM 8: Permutations Pattern
        {
            type: 'reading',
            id: 'permutations-pattern',
            title: 'Pattern: Permutations',
            content: `<h1>Pattern: Permutations 🔄</h1>
<p>Permutations are <strong>arrangements</strong> where <strong>order matters</strong>.</p>
<h2>The Problem</h2>
<p>Generate all permutations of <code>[1, 2, 3]</code>.</p>
<p><strong>Example output:</strong></p>
<pre><code>[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]
</code></pre>
<p>6 permutations = 3!</p>
<hr>
<h2>How It&#39;s Different from Subsets</h2>
<table>
<thead>
<tr>
<th>Subsets</th>
<th>Permutations</th>
</tr>
</thead>
<tbody><tr>
<td>[1,2] and [2,1] are the <strong>same</strong></td>
<td>[1,2] and [2,1] are <strong>different</strong></td>
</tr>
<tr>
<td>Each element: include or skip</td>
<td>Each position: pick unused element</td>
</tr>
<tr>
<td>2 branches per node</td>
<td>n branches per node</td>
</tr>
<tr>
<td>2ⁿ solutions</td>
<td>n! solutions</td>
</tr>
</tbody></table>
<hr>
<h2>The Tree for [1, 2]</h2>
<pre><code>                    []
           /                  \
        Pick 1              Pick 2
         /                      \
       [1]                      [2]
        |                        |
    Pick 2 (only 2 left)     Pick 1 (only 1 left)
        |                        |
      [1,2]                    [2,1]
       ✓                        ✓
</code></pre>
<p><strong>Key insight:</strong> At each step, we have <strong>n branches</strong> (one for each unused element).</p>
<hr>
<h2>The Tree for [1, 2, 3]</h2>
<pre><code>                      []
          /           |           \
       Pick 1      Pick 2      Pick 3
        /            |             \
      [1]           [2]           [3]
      / \           / \           / \
  Pick2 Pick3   Pick1 Pick3   Pick1 Pick2
    /     \      /     \       /     \
 [1,2]  [1,3]  [2,1]  [2,3]  [3,1]  [3,2]
   |      |      |      |      |      |
Pick3  Pick2  Pick3  Pick1  Pick2  Pick1
   |      |      |      |      |      |
[1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]
  ✓      ✓      ✓      ✓      ✓      ✓
</code></pre>
<p><strong>6 leaves = 3! = 6 permutations</strong></p>
<hr>
<h2>Mapping to Code</h2>
<h3>Base Case (Leaves)</h3>
<p><strong>When:</strong> We&#39;ve used all n elements</p>
<pre><code class="language-python">if len(path) == len(nums):
    result.append(path[:])
    return
</code></pre>
<h3>Decisions (Branches)</h3>
<p><strong>What:</strong> Pick any unused element</p>
<pre><code class="language-python">for i in range(len(nums)):
    if used[i]:  # Skip if already used
        continue

    # Make decision
    path.append(nums[i])
    used[i] = True

    # Explore
    backtrack(path, used)

    # Undo
    used[i] = False
    path.pop()
</code></pre>
<hr>
<h2>Complete Code</h2>
<pre><code class="language-python">def permute(nums):
    result = []

    def backtrack(path, used):
        # Base case: used all elements
        if len(path) == len(nums):
            result.append(path[:])
            return

        # Try each unused element
        for i in range(len(nums)):
            if used[i]:
                continue

            # Make decision
            path.append(nums[i])
            used[i] = True

            # Explore
            backtrack(path, used)

            # Undo
            used[i] = False
            path.pop()

    backtrack([], [False] * len(nums))
    return result
</code></pre>
<hr>
<h2>Key Differences from Subsets</h2>
<ol>
<li><strong>Branches:</strong> n branches (one per unused element) vs 2 branches (include/skip)</li>
<li><strong>Tracking:</strong> Need <code>used</code> array to track which elements are used</li>
<li><strong>Base case:</strong> <code>len(path) == len(nums)</code> vs <code>index == len(nums)</code></li>
<li><strong>Loop:</strong> <code>for i in range(len(nums))</code> instead of two recursive calls</li>
</ol>
<hr>
<h2>Time Complexity</h2>
<ul>
<li><strong>Permutations:</strong> n!</li>
<li><strong>Work per permutation:</strong> O(n) (copying)</li>
<li><strong>Total:</strong> O(n! × n)</li>
</ul>
<p>For n=10: 10! = 3,628,800 permutations! 😱</p>
<hr>
<p><strong>Next:</strong> Let&#39;s implement permutations! 🚀</p>
`,
            estimatedReadTime: 240,
            autoMarkComplete: false,
        },

        // ITEM 9: Permutations Exercise
        ,// ITEM 10: Combinations Pattern
        {
            type: 'reading',
            id: 'combinations-pattern',
            title: 'Pattern: Combinations',
            content: `<h1>Pattern: Combinations 🎯</h1>
<p>Combinations select <strong>k elements</strong> from n, where <strong>order doesn&#39;t matter</strong>.</p>
<h2>The Problem</h2>
<p>Find all 2-element combinations from <code>[1, 2, 3, 4]</code>.</p>
<p><strong>Example output:</strong></p>
<pre><code>[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]
</code></pre>
<p>C(4, 2) = 6 combinations</p>
<hr>
<h2>Key Insight</h2>
<p><strong>[1,2] and [2,1] are the SAME combination!</strong></p>
<p>To avoid duplicates, we only move <strong>forward</strong>:</p>
<ul>
<li>If we picked 1, next we can pick 2, 3, or 4 (not 1 again)</li>
<li>If we picked 2, next we can pick 3 or 4 (not 1 or 2)</li>
</ul>
<hr>
<h2>The Tree for C(4, 2)</h2>
<pre><code>                      []
           /       /       \       \
        +1       +2        +3      +4
        /        |          |       \
      [1]       [2]        [3]     [4]
     / | \      / \         |
   +2 +3 +4   +3 +4       +4
   /   |   \   /   \       |
[1,2][1,3][1,4][2,3][2,4][3,4]
  ✓    ✓    ✓    ✓    ✓    ✓
</code></pre>
<p><strong>6 leaves = C(4,2) = 6</strong></p>
<p><strong>Key:</strong> From [1], we only consider 2,3,4 (not 1). This prevents duplicates!</p>
<hr>
<h2>Avoiding Duplicates</h2>
<h3>Wrong Approach (generates duplicates):</h3>
<pre><code class="language-python">for i in range(len(nums)):  # Can pick any
    if used[i]:
        continue
    # This would generate [1,2] and [2,1]
</code></pre>
<h3>Correct Approach (forward only):</h3>
<pre><code class="language-python">for i in range(start, len(nums)):  # Only from start onwards
    path.append(nums[i])
    backtrack(path, i + 1)  # Next start = i+1
    path.pop()
</code></pre>
<p><strong>The <code>start</code> parameter ensures we only pick elements AFTER the last picked element!</strong></p>
<hr>
<h2>Mapping to Code</h2>
<h3>Base Case</h3>
<p><strong>When:</strong> We&#39;ve picked k elements</p>
<pre><code class="language-python">if len(path) == k:
    result.append(path[:])
    return
</code></pre>
<h3>Decisions</h3>
<p><strong>What:</strong> Pick from <code>start</code> to <code>n</code> (forward only)</p>
<pre><code class="language-python">for i in range(start, len(nums)):
    path.append(nums[i])
    backtrack(path, i + 1)  # Next start
    path.pop()
</code></pre>
<hr>
<h2>Complete Code</h2>
<pre><code class="language-python">def combine(n, k):
    result = []

    def backtrack(path, start):
        # Base case: picked k elements
        if len(path) == k:
            result.append(path[:])
            return

        # Try elements from start to n
        for i in range(start, n + 1):
            # Make decision
            path.append(i)

            # Explore (next start = i+1)
            backtrack(path, i + 1)

            # Undo
            path.pop()

    backtrack([], 1)
    return result
</code></pre>
<hr>
<h2>Comparison: Subsets vs Combinations</h2>
<table>
<thead>
<tr>
<th>Aspect</th>
<th>Subsets</th>
<th>Combinations</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Goal</strong></td>
<td>All subsets (any size)</td>
<td>Subsets of size k</td>
</tr>
<tr>
<td><strong>Base case</strong></td>
<td><code>index == n</code></td>
<td><code>len(path) == k</code></td>
</tr>
<tr>
<td><strong>Branches</strong></td>
<td>2 (include/skip)</td>
<td>n-start (pick forward)</td>
</tr>
<tr>
<td><strong>Count</strong></td>
<td>2ⁿ</td>
<td>C(n,k)</td>
</tr>
</tbody></table>
<p><strong>Insight:</strong> Combinations = Subsets with size constraint!</p>
<hr>
<h2>Time Complexity</h2>
<ul>
<li><strong>Combinations:</strong> C(n, k) = n! / (k! × (n-k)!)</li>
<li><strong>Work per combination:</strong> O(k) (copying)</li>
<li><strong>Total:</strong> O(C(n,k) × k)</li>
</ul>
<hr>
<p><strong>Next:</strong> Combination Sum with reuse! 🚀</p>
`,
            estimatedReadTime: 240,
            autoMarkComplete: false,
        },

        // ITEM 11: Combinations Exercise
        ,// ITEM 12: Combination Sum
        {
            type: 'reading',
            id: 'combination-sum-pattern',
            title: 'Pattern: Combination Sum',
            content: `<h1>Pattern: Combination Sum 💰</h1>
<p>Find combinations that sum to a target, <strong>with reuse allowed</strong>.</p>
<h2>The Problem</h2>
<p>Given <code>candidates = [2, 3, 5]</code> and <code>target = 8</code>, find all combinations that sum to 8.</p>
<p><strong>Output:</strong></p>
<pre><code>[[2,2,2,2], [2,3,3], [3,5]]
</code></pre>
<p><strong>Key:</strong> You can use the same number multiple times!</p>
<hr>
<h2>The Tree (partial)</h2>
<pre><code>                    [] (sum=0)
           /        |         \
         +2        +3         +5
        /           |           \
      [2]          [3]         [5]
    (sum=2)      (sum=3)     (sum=5)
    / | \         / \          |
  +2 +3 +5      +3 +5        +5
  /   |  \      /   \         |
[2,2] ... ... [3,3] [3,5]   [5,5]
(sum=4)       (sum=6)(sum=8) (sum=10)
  |             |     ✓       ✗(over)
 +2            +3
  |             |
[2,2,2]       [3,3,3]
(sum=6)       (sum=9)
  |            ✗(over)
 +2
  |
[2,2,2,2]
(sum=8)
  ✓
</code></pre>
<hr>
<h2>Key Differences from Regular Combinations</h2>
<ol>
<li><p><strong>Reuse allowed:</strong> Can pick same element multiple times</p>
<ul>
<li><code>[2,2,2,2]</code> is valid!</li>
</ul>
</li>
<li><p><strong>Variable depth:</strong> Tree depth varies (not fixed k)</p>
<ul>
<li>Keep going until sum == target</li>
</ul>
</li>
<li><p><strong>Pruning:</strong> Stop early if sum &gt; target</p>
<ul>
<li>No point exploring if we&#39;ve exceeded target</li>
</ul>
</li>
</ol>
<hr>
<h2>Mapping to Code</h2>
<h3>Base Case (2 conditions!)</h3>
<p><strong>Success:</strong></p>
<pre><code class="language-python">if current_sum == target:
    result.append(path[:])
    return
</code></pre>
<p><strong>Failure (prune):</strong></p>
<pre><code class="language-python">if current_sum &gt; target:
    return  # Stop exploring this branch
</code></pre>
<h3>Decisions</h3>
<p><strong>What:</strong> Try each candidate from <code>start</code> onwards (forward only, but can reuse)</p>
<pre><code class="language-python">for i in range(start, len(candidates)):
    path.append(candidates[i])
    # Can reuse! So next start is i (not i+1)
    backtrack(path, i, current_sum + candidates[i])
    path.pop()
</code></pre>
<p><strong>Key:</strong> <code>backtrack(path, i, ...)</code> not <code>i+1</code> → allows reuse!</p>
<hr>
<h2>Complete Code</h2>
<pre><code class="language-python">def combinationSum(candidates, target):
    result = []

    def backtrack(path, start, current_sum):
        # Success!
        if current_sum == target:
            result.append(path[:])
            return

        # Prune (exceeded target)
        if current_sum &gt; target:
            return

        # Try each candidate from start
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            # Note: i (not i+1) allows reuse
            backtrack(path, i, current_sum + candidates[i])
            path.pop()

    backtrack([], 0, 0)
    return result
</code></pre>
<hr>
<h2>Why <code>start</code> is Still Needed</h2>
<p>Even though we can reuse, we still need <code>start</code> to avoid duplicates:</p>
<p><strong>Without start:</strong> <code>[2,3]</code> and <code>[3,2]</code> are both generated (duplicates!)
<strong>With start:</strong> Only <code>[2,3]</code> is generated (forward only)</p>
<hr>
<h2>Optimization: Early Pruning</h2>
<p>Instead of checking <code>current_sum &gt; target</code> at the start, prune in the loop:</p>
<pre><code class="language-python">for i in range(start, len(candidates)):
    # Prune before recursing
    if current_sum + candidates[i] &gt; target:
        continue

    path.append(candidates[i])
    backtrack(path, i, current_sum + candidates[i])
    path.pop()
</code></pre>
<p>Even better: <strong>sort candidates first</strong>, then break when exceeded:</p>
<pre><code class="language-python">candidates.sort()  # Sort first
for i in range(start, len(candidates)):
    if current_sum + candidates[i] &gt; target:
        break  # All remaining will also exceed
    # ...
</code></pre>
<hr>
<h2>Pattern Summary</h2>
<table>
<thead>
<tr>
<th>Problem</th>
<th>Reuse?</th>
<th>Depth</th>
<th>Next start</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Combinations</strong></td>
<td>❌</td>
<td>Fixed (k)</td>
<td>i+1</td>
</tr>
<tr>
<td><strong>Combination Sum</strong></td>
<td>✅</td>
<td>Variable</td>
<td>i (reuse!)</td>
</tr>
</tbody></table>
<hr>
<p><strong>Next:</strong> Handling duplicates! 🚀</p>
`,
            estimatedReadTime: 240,
            autoMarkComplete: false,
        },

        // ITEM 13: Combination Sum Exercise
        ,// ============================================================
        // PART 3: CONSTRAINT PROBLEMS (Items 14-17)
        // ============================================================

        // ITEM 14: N-Queens Introduction
        {
            type: 'reading',
            id: 'nqueens-introduction',
            title: 'Constraint Problems: N-Queens',
            content: `<h1>Constraint Problems: N-Queens ♛</h1>
<p>N-Queens is a classic <strong>constraint satisfaction problem</strong>.</p>
<h2>The Problem</h2>
<p>Place <strong>n queens</strong> on an n×n chessboard so that <strong>no two queens attack each other</strong>.</p>
<p><strong>Rules:</strong></p>
<ul>
<li>Queens attack horizontally, vertically, and diagonally</li>
<li>Need to place all n queens</li>
</ul>
<p><strong>Example: 4-Queens</strong></p>
<pre><code>. Q . .    (Q at row=0, col=1)
. . . Q    (Q at row=1, col=3)
Q . . .    (Q at row=2, col=0)
. . Q .    (Q at row=3, col=2)
</code></pre>
<hr>
<h2>Why It&#39;s Different</h2>
<p>Previous problems had <strong>simple constraints:</strong></p>
<ul>
<li>Subsets: No constraints</li>
<li>Permutations: Each element used once</li>
<li>Combinations: Pick k elements</li>
</ul>
<p>N-Queens has <strong>complex constraints:</strong></p>
<ul>
<li>No two queens in same row</li>
<li>No two queens in same column</li>
<li>No two queens in same diagonal</li>
</ul>
<p><strong>We need to check validity at each step!</strong></p>
<hr>
<h2>The Approach</h2>
<h3>Strategy: One Queen Per Row</h3>
<p>Instead of trying all positions, <strong>place one queen per row</strong>:</p>
<ul>
<li>Row 0: Try columns 0, 1, 2, 3</li>
<li>Row 1: Try columns 0, 1, 2, 3 (but check constraints!)</li>
<li>Row 2: Try columns 0, 1, 2, 3 (but check constraints!)</li>
<li>Row 3: Try columns 0, 1, 2, 3 (but check constraints!)</li>
</ul>
<p>This <strong>eliminates row conflicts</strong> by design!</p>
<hr>
<h2>The Tree (4-Queens, partial)</h2>
<pre><code>                     Row 0
           /      /      \      \
        Col0   Col1    Col2   Col3
         |       |       |       |
      Row 1   Row 1   Row 1   Row 1
     / | \ \  / | \ \  / | \ \  / | \ \
    0 1 2 3  0 1 2 3  0 1 2 3  0 1 2 3
    ✗ ✗ ✓ ✓  ✗ ✗ ✗ ✓  ✓ ✗ ✗ ✗  ✓ ✓ ✗ ✗
    (many invalid due to attacks)
</code></pre>
<p><strong>Key:</strong> Many branches are pruned early due to constraint violations!</p>
<hr>
<h2>Checking Constraints</h2>
<p>For a new queen at (row, col), check:</p>
<h3>1. Column Conflict</h3>
<pre><code class="language-python"># Any queen in same column?
for r in range(row):
    if board[r] == col:
        return False
</code></pre>
<h3>2. Diagonal Conflicts</h3>
<p><strong>Main diagonal (↘):</strong> row - col is constant
<strong>Anti-diagonal (↙):</strong> row + col is constant</p>
<pre><code class="language-python">for r in range(row):
    # Same diagonal?
    if abs(row - r) == abs(col - board[r]):
        return False
</code></pre>
<hr>
<h2>Mapping to Code</h2>
<h3>Base Case</h3>
<p><strong>When:</strong> Placed all n queens (row == n)</p>
<pre><code class="language-python">if row == n:
    result.append(construct_board(board))
    return
</code></pre>
<h3>Decisions</h3>
<p><strong>What:</strong> Try each column in current row</p>
<pre><code class="language-python">for col in range(n):
    if is_valid(board, row, col):  # Check constraints
        board[row] = col  # Place queen
        backtrack(row + 1)
        board[row] = -1   # Remove queen
</code></pre>
<hr>
<h2>Complete Code (Simplified)</h2>
<pre><code class="language-python">def solveNQueens(n):
    result = []
    board = [-1] * n  # board[i] = col of queen in row i

    def is_valid(row, col):
        for r in range(row):
            # Column conflict
            if board[r] == col:
                return False
            # Diagonal conflict
            if abs(row - r) == abs(col - board[r]):
                return False
        return True

    def backtrack(row):
        if row == n:
            result.append(construct_board(board))
            return

        for col in range(n):
            if is_valid(row, col):
                board[row] = col
                backtrack(row + 1)
                board[row] = -1

    backtrack(0)
    return result
</code></pre>
<hr>
<h2>Why Backtracking Shines Here</h2>
<p><strong>Pruning is powerful!</strong></p>
<ul>
<li>4×4 board has 4⁴ = 256 possible placements</li>
<li>But backtracking prunes most branches early</li>
<li>Only explores ~280 nodes (not 256 leaves!)</li>
</ul>
<hr>
<h2>Time Complexity</h2>
<p>Worst case: O(n!)</p>
<ul>
<li>First row: n choices</li>
<li>Second row: ~n-2 choices (pruned)</li>
<li>Third row: ~n-4 choices</li>
<li>...</li>
</ul>
<p>Not all n! permutations are explored due to early pruning!</p>
<hr>
<p><strong>Next:</strong> Implement N-Queens! 🚀</p>
`,
            estimatedReadTime: 300,
            autoMarkComplete: false,
        },

        // ITEM 15: N-Queens Exercise (simplified version)
        ,// ITEM 16: Sudoku Solver (Reading only - very complex to implement)
        {
            type: 'reading',
            id: 'sudoku-solver',
            title: 'Advanced: Sudoku Solver',
            content: `<h1>Advanced: Sudoku Solver 🧩</h1>
<p>Sudoku is the ultimate constraint satisfaction problem!</p>
<h2>The Problem</h2>
<p>Fill a 9×9 grid so that:</p>
<ol>
<li>Each row contains digits 1-9 (no repeats)</li>
<li>Each column contains digits 1-9 (no repeats)</li>
<li>Each 3×3 box contains digits 1-9 (no repeats)</li>
</ol>
<hr>
<h2>The Approach</h2>
<h3>Strategy</h3>
<ol>
<li>Find next empty cell</li>
<li>Try digits 1-9</li>
<li>Check if valid (row, column, box constraints)</li>
<li>If valid, recurse to next empty cell</li>
<li>If stuck, backtrack!</li>
</ol>
<hr>
<h2>The Tree (Conceptual)</h2>
<pre><code>             Empty cell (0,0)
          /   |   ...   |   \
        Try1 Try2 ... Try8 Try9
         |    |          |    |
       Valid? Valid?  Valid? Valid?
         |    ✗          ✗    |
    Next empty         Next empty
      / | \              / | \
    Try1...9          Try1...9
    ...               ...
</code></pre>
<p><strong>Key:</strong> Multiple constraint checks at each step!</p>
<hr>
<h2>Constraint Checking</h2>
<pre><code class="language-python">def is_valid(board, row, col, num):
    # Check row
    if num in board[row]:
        return False

    # Check column
    if num in [board[r][col] for r in range(9)]:
        return False

    # Check 3×3 box
    box_row, box_col = 3 * (row // 3), 3 * (col // 3)
    for r in range(box_row, box_row + 3):
        for c in range(box_col, box_col + 3):
            if board[r][c] == num:
                return False

    return True
</code></pre>
<hr>
<h2>Backtracking Code (Simplified)</h2>
<pre><code class="language-python">def solveSudoku(board):
    def backtrack():
        # Find next empty cell
        for row in range(9):
            for col in range(9):
                if board[row][col] == &#39;.&#39;:
                    # Try digits 1-9
                    for num in &#39;123456789&#39;:
                        if is_valid(board, row, col, num):
                            # Make
                            board[row][col] = num

                            # Explore
                            if backtrack():
                                return True

                            # Undo
                            board[row][col] = &#39;.&#39;

                    return False  # No valid digit found

        return True  # All cells filled!

    backtrack()
</code></pre>
<hr>
<h2>Optimizations</h2>
<h3>1. Track Valid Digits</h3>
<p>Instead of trying all 1-9, maintain sets of valid digits for each cell.</p>
<h3>2. Choose Smartest Cell</h3>
<p>Instead of going left-to-right, fill cell with <strong>fewest options</strong> first (MRV heuristic).</p>
<h3>3. Constraint Propagation</h3>
<p>When placing a digit, immediately eliminate it from related cells.</p>
<hr>
<h2>Why Backtracking Works</h2>
<p><strong>Pruning is extreme!</strong></p>
<ul>
<li>81 cells, 9 choices each = 9⁸¹ possibilities</li>
<li>But constraints eliminate most branches early</li>
<li>Typical easy Sudoku: ~thousands of backtracks (not 9⁸¹!)</li>
</ul>
<hr>
<h2>Pattern Recognition</h2>
<p>All these problems follow the same template:</p>
<pre><code class="language-python">def backtrack(state):
    if is_complete(state):
        save_solution()
        return

    for decision in get_decisions(state):
        if is_valid(state, decision):
            make_decision(state, decision)
            backtrack(next_state)
            undo_decision(state, decision)
</code></pre>
<p><strong>The only differences:</strong></p>
<ul>
<li>What&#39;s a decision?</li>
<li>How to check validity?</li>
<li>When are we done?</li>
</ul>
<hr>
<p><strong>Next:</strong> 2D Backtracking! 🚀</p>
`,
            estimatedReadTime: 240,
            autoMarkComplete: false,
        },

        // ITEM 17: Word Search
        {
            type: 'reading',
            id: 'word-search-2d',
            title: '2D Backtracking: Word Search',
            content: `<h1>2D Backtracking: Word Search 🔍</h1>
<p>Now let&#39;s backtrack in <strong>2D space</strong> (grids)!</p>
<h2>The Problem</h2>
<p>Given a 2D board and a word, find if the word exists in the grid.</p>
<p><strong>Rules:</strong></p>
<ul>
<li>Word can be constructed from letters of adjacent cells</li>
<li>Adjacent = horizontally or vertically (not diagonal)</li>
<li>Same cell can&#39;t be used twice</li>
</ul>
<p><strong>Example:</strong></p>
<pre><code>Board:
[
  [&#39;A&#39;, &#39;B&#39;, &#39;C&#39;, &#39;E&#39;],
  [&#39;S&#39;, &#39;F&#39;, &#39;C&#39;, &#39;S&#39;],
  [&#39;A&#39;, &#39;D&#39;, &#39;E&#39;, &#39;E&#39;]
]

exist(board, &quot;ABCCED&quot;) → True
exist(board, &quot;SEE&quot;) → True
exist(board, &quot;ABCB&quot;) → False (can&#39;t reuse B)
</code></pre>
<hr>
<h2>The Approach</h2>
<h3>Strategy</h3>
<ol>
<li>Find starting cell (first letter of word)</li>
<li>Try all 4 directions (up, down, left, right)</li>
<li>Mark current cell as visited</li>
<li>Recurse on next letter</li>
<li>Unmark cell (backtrack!)</li>
</ol>
<hr>
<h2>The Tree (for &quot;SEE&quot; starting at S)</h2>
<pre><code>             S(1,0)
        /    |    \    \
      Up   Down  Left Right
       |     |     |     |
      None  F✗   A✗    F✗
       ✗

    Try next S:
             S(1,3)
        /    |    \    \
      Up   Down  Left Right
       |     |     |     |
      E✓   E✓    C✗    None
       |     |           ✗
      C✗   E✓ ← Success!
       ✗    ✓
</code></pre>
<hr>
<h2>Mapping to Code</h2>
<h3>Base Case (Success)</h3>
<p><strong>When:</strong> Matched all letters</p>
<pre><code class="language-python">if index == len(word):
    return True
</code></pre>
<h3>Boundary/Validity Checks</h3>
<pre><code class="language-python">if (row &lt; 0 or row &gt;= len(board) or
    col &lt; 0 or col &gt;= len(board[0]) or
    board[row][col] != word[index] or
    visited[row][col]):
    return False
</code></pre>
<h3>Decisions (4 directions)</h3>
<pre><code class="language-python">directions = [(0,1), (1,0), (0,-1), (-1,0)]  # right, down, left, up

for dr, dc in directions:
    new_row, new_col = row + dr, col + dc
    if backtrack(new_row, new_col, index + 1):
        return True
</code></pre>
<hr>
<h2>Complete Code</h2>
<pre><code class="language-python">def exist(board, word):
    rows, cols = len(board), len(board[0])
    visited = [[False] * cols for _ in range(rows)]

    def backtrack(row, col, index):
        # Success - matched all letters
        if index == len(word):
            return True

        # Boundary check / Invalid
        if (row &lt; 0 or row &gt;= rows or
            col &lt; 0 or col &gt;= cols or
            board[row][col] != word[index] or
            visited[row][col]):
            return False

        # Make decision - mark visited
        visited[row][col] = True

        # Try all 4 directions
        directions = [(0,1), (1,0), (0,-1), (-1,0)]
        for dr, dc in directions:
            if backtrack(row + dr, col + dc, index + 1):
                visited[row][col] = False  # Restore
                return True

        # Undo - unmark visited
        visited[row][col] = False
        return False

    # Try starting from each cell
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == word[0]:
                if backtrack(r, c, 0):
                    return True

    return False
</code></pre>
<hr>
<h2>Key Patterns</h2>
<h3>1. Multiple Starting Points</h3>
<p>Need to try every cell as potential start.</p>
<h3>2. Visited Tracking</h3>
<p>2D boolean array to track used cells.</p>
<h3>3. 4 Directions</h3>
<p>Standard grid traversal pattern:</p>
<pre><code class="language-python">directions = [(0,1), (1,0), (0,-1), (-1,0)]
# right, down, left, up
</code></pre>
<h3>4. Early Return</h3>
<p>Return True immediately on success (no need to explore all paths).</p>
<hr>
<h2>Time Complexity</h2>
<p>Worst case: O(m × n × 4^L)</p>
<ul>
<li>m×n cells to start from</li>
<li>L = length of word</li>
<li>4 directions at each step</li>
<li>Actually better due to pruning!</li>
</ul>
<hr>
<h2>2D Backtracking Applications</h2>
<ul>
<li><strong>Word Search</strong></li>
<li><strong>Island problems</strong> (DFS with visited tracking)</li>
<li><strong>Path finding</strong> in mazes</li>
<li><strong>Flood fill</strong></li>
<li><strong>Sudoku</strong> (2D grid decisions)</li>
</ul>
<p><strong>Common pattern:</strong> Explore 4 directions + backtrack visited state</p>
<hr>
<p><strong>Next:</strong> Let&#39;s practice! 🚀</p>
`,
            estimatedReadTime: 300,
            autoMarkComplete: false,
        },

        // ============================================================
        // PART 4: OPTIMIZATIONS & MASTERY (Items 18-20)
        // ============================================================

        // ITEM 18: Handling Duplicates
        {
            type: 'reading',
            id: 'handling-duplicates',
            title: 'Optimization: Handling Duplicates',
            content: `<h1>Optimization: Handling Duplicates 🔄</h1>
<p>When input has duplicates, we need to avoid generating duplicate solutions.</p>
<h2>The Problem</h2>
<p>Generate subsets of <code>[1, 2, 2]</code>.</p>
<p><strong>Without handling duplicates:</strong></p>
<pre><code>[[], [1], [1,2], [1,2,2], [2], [2,2], [2], [2,2]]
     Duplicates: [2] appears twice!
</code></pre>
<p><strong>With handling duplicates:</strong></p>
<pre><code>[[], [1], [1,2], [1,2,2], [2], [2,2]]
</code></pre>
<hr>
<h2>The Issue</h2>
<pre><code>                []
              /    \
           [1]      []
          /  \      /  \
      [1,2] [1]  [2]  []
       /      \    /    \
   [1,2,2] [1,2] [2,2] [2]  ← [2] and [2] are duplicates!
</code></pre>
<p><strong>When we skip the first 2, we get [2]</strong>
<strong>When we skip the second 2, we also get [2]</strong></p>
<hr>
<h2>The Solution: Skip Duplicates</h2>
<p><strong>Key insight:</strong> At each level, skip duplicate elements!</p>
<pre><code class="language-python"># Skip duplicates at same level
if i &gt; start and nums[i] == nums[i-1]:
    continue
</code></pre>
<p><strong>Why <code>i &gt; start</code>?</strong></p>
<ul>
<li>At the current recursion level (start), we WANT to try nums[start]</li>
<li>But at next iterations (i &gt; start), skip if same as previous</li>
</ul>
<hr>
<h2>Modified Code</h2>
<pre><code class="language-python">def subsetsWithDup(nums):
    result = []
    nums.sort()  # MUST sort first!

    def backtrack(path, start):
        result.append(path[:])

        for i in range(start, len(nums)):
            # Skip duplicates at same level
            if i &gt; start and nums[i] == nums[i-1]:
                continue

            path.append(nums[i])
            backtrack(path, i + 1)
            path.pop()

    backtrack([], 0)
    return result
</code></pre>
<p><strong>Key steps:</strong></p>
<ol>
<li><strong>Sort</strong> the input (groups duplicates together)</li>
<li><strong>Skip</strong> if <code>i &gt; start</code> and current == previous</li>
</ol>
<hr>
<h2>Visualization</h2>
<pre><code>Input: [1, 2, 2] (sorted)

                []
              /    \
           [1]      []
          /  \      |
      [1,2] [1]    [2]    ← Skip second 2!
       /      \     |
   [1,2,2] [1,2] [2,2]
</code></pre>
<p><strong>At start=1 (after skipping first element):</strong></p>
<ul>
<li>i=1: Try nums[1]=2 ✓</li>
<li>i=2: Skip! (i &gt; start and nums[2]==nums[1])</li>
</ul>
<hr>
<h2>Why Sorting Matters</h2>
<p><strong>Unsorted: [2, 1, 2]</strong></p>
<ul>
<li>Can&#39;t detect duplicates with <code>nums[i] == nums[i-1]</code></li>
</ul>
<p><strong>Sorted: [1, 2, 2]</strong></p>
<ul>
<li>Duplicates are adjacent</li>
<li>Easy to skip!</li>
</ul>
<hr>
<h2>The Pattern for Other Problems</h2>
<h3>Combination Sum II (with duplicates, no reuse)</h3>
<pre><code class="language-python">def combinationSum2(candidates, target):
    candidates.sort()  # Sort!
    result = []

    def backtrack(path, start, current_sum):
        if current_sum == target:
            result.append(path[:])
            return
        if current_sum &gt; target:
            return

        for i in range(start, len(candidates)):
            # Skip duplicates at same level
            if i &gt; start and candidates[i] == candidates[i-1]:
                continue

            path.append(candidates[i])
            backtrack(path, i + 1, current_sum + candidates[i])
            path.pop()

    backtrack([], 0, 0)
    return result
</code></pre>
<hr>
<h2>Summary: Duplicate Handling Template</h2>
<pre><code class="language-python">def backtrack_with_dups(nums):
    nums.sort()  # Step 1: Sort

    def backtrack(path, start):
        # Save solution
        result.append(path[:])

        for i in range(start, len(nums)):
            # Step 2: Skip duplicates
            if i &gt; start and nums[i] == nums[i-1]:
                continue

            # Standard backtracking
            path.append(nums[i])
            backtrack(path, i + 1)
            path.pop()
</code></pre>
<p><strong>Two steps:</strong></p>
<ol>
<li>Sort input</li>
<li>Skip when <code>i &gt; start and nums[i] == nums[i-1]</code></li>
</ol>
<hr>
<p><strong>Next:</strong> Pruning for performance! 🚀</p>
`,
            estimatedReadTime: 240,
            autoMarkComplete: false,
        },

        // ITEM 19: Pruning Strategies
        {
            type: 'reading',
            id: 'pruning-strategies',
            title: 'Optimization: Pruning Strategies',
            content: `<h1>Optimization: Pruning Strategies ✂️</h1>
<p><strong>Pruning</strong> = Stopping early when we know a branch won&#39;t lead to a solution.</p>
<h2>Why Pruning Matters</h2>
<p><strong>Without pruning:</strong></p>
<pre><code>Try all 2ⁿ possibilities → Slow!
</code></pre>
<p><strong>With pruning:</strong></p>
<pre><code>Skip branches that can&#39;t work → Fast!
</code></pre>
<hr>
<h2>Strategy 1: Bound Checking</h2>
<p><strong>Problem:</strong> Combination Sum with target=7, candidates=[2,3,6,7]</p>
<p><strong>Without pruning:</strong></p>
<pre><code>[] → +2 → +2 → +2 → +2 → ... (keeps going even after exceeding 7)
</code></pre>
<p><strong>With pruning:</strong></p>
<pre><code class="language-python">if current_sum &gt; target:
    return  # Stop! No point continuing
</code></pre>
<hr>
<h2>Strategy 2: Early Break with Sorted Input</h2>
<p><strong>Optimization:</strong> If candidates are sorted, we can break early!</p>
<pre><code class="language-python">candidates.sort()  # [2, 3, 6, 7]

for i in range(start, len(candidates)):
    if current_sum + candidates[i] &gt; target:
        break  # All remaining are also too large!

    path.append(candidates[i])
    backtrack(path, i, current_sum + candidates[i])
    path.pop()
</code></pre>
<p><strong>Why break not continue?</strong></p>
<ul>
<li>Array is sorted</li>
<li>If candidates[i] is too large, candidates[i+1], candidates[i+2], ... are also too large!</li>
</ul>
<hr>
<h2>Strategy 3: Remaining Elements Check</h2>
<p><strong>Problem:</strong> Combinations where we need k elements</p>
<p><strong>Pruning idea:</strong> If not enough elements remaining, stop!</p>
<pre><code class="language-python">def combine(n, k):
    result = []

    def backtrack(path, start):
        if len(path) == k:
            result.append(path[:])
            return

        # Pruning: need k - len(path) more elements
        # Available: n - start + 1 elements
        # If not enough, stop!
        need = k - len(path)
        remaining = n - start + 1
        if remaining &lt; need:
            return

        for i in range(start, n + 1):
            path.append(i)
            backtrack(path, i + 1)
            path.pop()
</code></pre>
<p><strong>Example:</strong> n=4, k=3, current path=[1], start=4</p>
<ul>
<li>Need: 3 - 1 = 2 more elements</li>
<li>Remaining: 4 - 4 + 1 = 1 element</li>
<li>1 &lt; 2 → Stop! Can&#39;t get 2 elements from [4]</li>
</ul>
<hr>
<h2>Strategy 4: Constraint Pre-checking (N-Queens)</h2>
<p><strong>Idea:</strong> Check validity BEFORE recursing (not after)</p>
<p><strong>Less efficient:</strong></p>
<pre><code class="language-python">for col in range(n):
    board[row] = col
    if is_valid(row, col):  # Check after placing
        backtrack(row + 1)
    board[row] = -1
</code></pre>
<p><strong>More efficient:</strong></p>
<pre><code class="language-python">for col in range(n):
    if is_valid(row, col):  # Check before placing
        board[row] = col
        backtrack(row + 1)
        board[row] = -1
</code></pre>
<p><strong>Why?</strong> Avoid the make/undo overhead if we know it&#39;s invalid!</p>
<hr>
<h2>Strategy 5: Memoization (→ Dynamic Programming!)</h2>
<p><strong>Problem:</strong> Some backtracking problems have overlapping subproblems.</p>
<p><strong>Example:</strong> Word Break</p>
<ul>
<li>Input: &quot;leetcode&quot;, dictionary=[&quot;leet&quot;, &quot;code&quot;]</li>
<li>Without memo: Check &quot;code&quot; multiple times</li>
<li>With memo: Check &quot;code&quot; once, cache result!</li>
</ul>
<pre><code class="language-python">def wordBreak(s, wordDict):
    memo = {}

    def backtrack(start):
        if start == len(s):
            return True

        if start in memo:  # Already computed!
            return memo[start]

        for end in range(start + 1, len(s) + 1):
            if s[start:end] in wordDict:
                if backtrack(end):
                    memo[start] = True
                    return True

        memo[start] = False
        return False

    return backtrack(0)
</code></pre>
<p><strong>This is Dynamic Programming!</strong> (Module 11)</p>
<hr>
<h2>Pruning Impact: Example</h2>
<p><strong>Combination Sum: candidates=[2,3,6,7], target=7</strong></p>
<p><strong>Without any pruning:</strong></p>
<ul>
<li>Explores ~50 nodes in the tree</li>
</ul>
<p><strong>With bound checking:</strong></p>
<ul>
<li>Prunes when sum &gt; 7</li>
<li>Explores ~30 nodes</li>
</ul>
<p><strong>With early break (sorted):</strong></p>
<ul>
<li>Breaks when candidate &gt; remaining</li>
<li>Explores ~20 nodes</li>
</ul>
<p><strong>Impact: ~60% reduction!</strong> 🚀</p>
<hr>
<h2>Pruning Checklist</h2>
<p>When writing backtracking solutions:</p>
<p>✅ Can I check bounds? (sum, count, size)
✅ Can I sort and break early?
✅ Can I check remaining elements?
✅ Can I validate before make/undo?
✅ Are there overlapping subproblems? (→ memo)</p>
<hr>
<p><strong>Next:</strong> Final practice and mastery! 🚀</p>
`,
            estimatedReadTime: 300,
            autoMarkComplete: false,
        },

        // ITEM 20: Backtracking Patterns Summary
        {
            type: 'reading',
            id: 'patterns-summary',
            title: 'Backtracking Patterns: Complete Reference',
            content: `<h1>Backtracking Patterns: Complete Reference 📚</h1>
<p>Here&#39;s your complete reference for all backtracking patterns!</p>
<hr>
<h2>Pattern 1: Subsets (Include/Exclude)</h2>
<p><strong>Structure:</strong> Binary tree (2 branches)
<strong>Reuse:</strong> No
<strong>Order:</strong> Doesn&#39;t matter</p>
<pre><code class="language-python">def subsets(nums):
    result = []

    def backtrack(path, index):
        if index == len(nums):
            result.append(path[:])
            return

        # Include nums[index]
        path.append(nums[index])
        backtrack(path, index + 1)
        path.pop()

        # Exclude nums[index]
        backtrack(path, index + 1)

    backtrack([], 0)
    return result
</code></pre>
<p><strong>Time:</strong> O(2ⁿ × n)
<strong>Applications:</strong> Power set, subset sum</p>
<hr>
<h2>Pattern 2: Permutations (Pick Unused)</h2>
<p><strong>Structure:</strong> n-ary tree (n branches)
<strong>Reuse:</strong> No
<strong>Order:</strong> Matters!</p>
<pre><code class="language-python">def permute(nums):
    result = []

    def backtrack(path, used):
        if len(path) == len(nums):
            result.append(path[:])
            return

        for i in range(len(nums)):
            if used[i]:
                continue

            path.append(nums[i])
            used[i] = True
            backtrack(path, used)
            used[i] = False
            path.pop()

    backtrack([], [False] * len(nums))
    return result
</code></pre>
<p><strong>Time:</strong> O(n! × n)
<strong>Applications:</strong> Arrangements, schedules</p>
<hr>
<h2>Pattern 3: Combinations (Forward Only)</h2>
<p><strong>Structure:</strong> Pruned tree (forward only)
<strong>Reuse:</strong> No
<strong>Order:</strong> Doesn&#39;t matter</p>
<pre><code class="language-python">def combine(n, k):
    result = []

    def backtrack(path, start):
        if len(path) == k:
            result.append(path[:])
            return

        for i in range(start, n + 1):
            path.append(i)
            backtrack(path, i + 1)
            path.pop()

    backtrack([], 1)
    return result
</code></pre>
<p><strong>Time:</strong> O(C(n,k) × k)
<strong>Applications:</strong> Selecting teams, committees</p>
<hr>
<h2>Pattern 4: Combination Sum (Forward + Reuse)</h2>
<p><strong>Structure:</strong> Variable depth tree
<strong>Reuse:</strong> Yes!
<strong>Order:</strong> Doesn&#39;t matter</p>
<pre><code class="language-python">def combinationSum(candidates, target):
    result = []

    def backtrack(path, start, current_sum):
        if current_sum == target:
            result.append(path[:])
            return
        if current_sum &gt; target:
            return

        for i in range(start, len(candidates)):
            path.append(candidates[i])
            backtrack(path, i, current_sum + candidates[i])  # i allows reuse
            path.pop()

    backtrack([], 0, 0)
    return result
</code></pre>
<p><strong>Time:</strong> O(2^target) approximately
<strong>Applications:</strong> Coin change, ways to sum</p>
<hr>
<h2>Pattern 5: Constraint Satisfaction (N-Queens)</h2>
<p><strong>Structure:</strong> Constraint-heavy tree
<strong>Validation:</strong> Check before recursing
<strong>Pruning:</strong> Essential!</p>
<pre><code class="language-python">def solveNQueens(n):
    result = []
    board = [-1] * n

    def is_valid(row, col):
        for r in range(row):
            if board[r] == col or abs(row - r) == abs(col - board[r]):
                return False
        return True

    def backtrack(row):
        if row == n:
            result.append(construct_board(board))
            return

        for col in range(n):
            if is_valid(row, col):
                board[row] = col
                backtrack(row + 1)
                board[row] = -1

    backtrack(0)
    return result
</code></pre>
<p><strong>Time:</strong> O(n!) with heavy pruning
<strong>Applications:</strong> Sudoku, scheduling with constraints</p>
<hr>
<h2>Pattern 6: 2D Grid Traversal (Word Search)</h2>
<p><strong>Structure:</strong> 4-direction tree
<strong>Tracking:</strong> Visited cells
<strong>Restoration:</strong> Backtrack visited state</p>
<pre><code class="language-python">def exist(board, word):
    rows, cols = len(board), len(board[0])
    visited = [[False] * cols for _ in range(rows)]

    def backtrack(row, col, index):
        if index == len(word):
            return True

        if (row &lt; 0 or row &gt;= rows or col &lt; 0 or col &gt;= cols or
            board[row][col] != word[index] or visited[row][col]):
            return False

        visited[row][col] = True

        directions = [(0,1), (1,0), (0,-1), (-1,0)]
        for dr, dc in directions:
            if backtrack(row + dr, col + dc, index + 1):
                visited[row][col] = False
                return True

        visited[row][col] = False
        return False

    for r in range(rows):
        for c in range(cols):
            if board[r][c] == word[0] and backtrack(r, c, 0):
                return True
    return False
</code></pre>
<p><strong>Time:</strong> O(m × n × 4^L)
<strong>Applications:</strong> Path finding, flood fill</p>
<hr>
<h2>Quick Reference Table</h2>
<table>
<thead>
<tr>
<th>Pattern</th>
<th>Branches</th>
<th>Reuse</th>
<th>Order</th>
<th>Next Param</th>
<th>Time</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Subsets</strong></td>
<td>2</td>
<td>No</td>
<td>No</td>
<td>index+1</td>
<td>O(2ⁿ×n)</td>
</tr>
<tr>
<td><strong>Permutations</strong></td>
<td>n</td>
<td>No</td>
<td>Yes</td>
<td>used[]</td>
<td>O(n!×n)</td>
</tr>
<tr>
<td><strong>Combinations</strong></td>
<td>n-start</td>
<td>No</td>
<td>No</td>
<td>i+1</td>
<td>O(C(n,k)×k)</td>
</tr>
<tr>
<td><strong>Combo Sum</strong></td>
<td>n-start</td>
<td>Yes</td>
<td>No</td>
<td>i</td>
<td>O(2^target)</td>
</tr>
<tr>
<td><strong>N-Queens</strong></td>
<td>n</td>
<td>No</td>
<td>N/A</td>
<td>row+1</td>
<td>O(n!)</td>
</tr>
<tr>
<td><strong>Word Search</strong></td>
<td>4</td>
<td>No</td>
<td>Yes</td>
<td>index+1</td>
<td>O(m×n×4^L)</td>
</tr>
</tbody></table>
<hr>
<h2>Decision Tree: Which Pattern?</h2>
<pre><code>Does order matter?
├─ Yes → Permutations (try all unused)
└─ No
    ├─ Can reuse elements?
    │   ├─ Yes → Combination Sum (i, not i+1)
    │   └─ No
    │       ├─ Fixed size k? → Combinations (forward only)
    │       └─ All subsets? → Subsets (include/exclude)

2D grid? → Word Search pattern (4 directions + visited)

Complex constraints? → N-Queens pattern (validate + prune)
</code></pre>
<hr>
<h2>The Universal Template</h2>
<pre><code class="language-python">def backtrack(state):
    # BASE CASE
    if is_complete(state):
        save_solution(state)
        return

    # PRUNING (optional but recommended)
    if should_prune(state):
        return

    # DECISIONS
    for decision in get_decisions(state):
        if is_valid(state, decision):
            # MAKE
            make_decision(state, decision)

            # EXPLORE
            backtrack(next_state(state, decision))

            # UNDO
            undo_decision(state, decision)
</code></pre>
<p><strong>Every backtracking problem fits this template!</strong></p>
<hr>
<h2>Remember</h2>
<p>✅ <strong>Draw the tree first</strong> - understand the structure
✅ <strong>Identify the pattern</strong> - which type is it?
✅ <strong>Apply the template</strong> - map pattern to code
✅ <strong>Add pruning</strong> - optimize with bounds/breaks
✅ <strong>Handle duplicates</strong> - sort + skip if needed</p>
<hr>
<p><strong>You&#39;ve mastered backtracking!</strong> 🎉</p>
<p><strong>Next: Module 11</strong> - When your backtracking tree has repeated nodes, use <strong>Dynamic Programming</strong> to cache results! 🚀</p>
`,
            estimatedReadTime: 360,
            autoMarkComplete: false,
        },

        // Completion message
        {
            type: 'reading',
            id: 'backtracking-complete',
            title: '🎉 Module 10 Complete!',
            content: `<h1>🎉 Module 10 Complete!</h1>
<h2>What You&#39;ve Mastered</h2>
<p>Congratulations! You now understand:</p>
<h3>✅ Decision Trees</h3>
<ul>
<li>Visualizing problems as trees (empty → final answer)</li>
<li>Each decision = a branch in the tree</li>
<li>Leaves = complete solutions</li>
</ul>
<h3>✅ The 4-Step Template</h3>
<ul>
<li>Base case = leaves (when to save)</li>
<li>Decisions = branches (what choices?)</li>
<li>Make → Explore → Undo pattern</li>
<li>Tree structure = code structure</li>
</ul>
<h3>✅ Core Patterns</h3>
<ul>
<li><strong>Subsets</strong>: 2 branches (include/exclude)</li>
<li><strong>Permutations</strong>: n branches (pick unused)</li>
<li><strong>Combinations</strong>: forward-only (avoid duplicates)</li>
<li><strong>Combination Sum</strong>: variable depth (can reuse)</li>
</ul>
<h3>✅ Advanced Techniques</h3>
<ul>
<li>Handling duplicates</li>
<li>Constraint checking (N-Queens)</li>
<li>Pruning for performance</li>
<li>2D backtracking (Word Search)</li>
</ul>
<hr>
<h2>The Universal Truth</h2>
<p><strong>If you can draw the tree, you can write the code!</strong> 🌳</p>
<p>Every backtracking problem follows the same pattern:</p>
<ol>
<li>Draw the decision tree</li>
<li>Identify: branches (decisions), leaves (base case)</li>
<li>Map to template</li>
<li>Code it!</li>
</ol>
<hr>
<h2>What&#39;s Next: Module 11 - Dynamic Programming</h2>
<p>You&#39;re ready for the final optimization! 🚀</p>
<p>In <strong>Module 11</strong>, you&#39;ll learn to spot and fix <strong>inefficiency in recursion trees</strong>:</p>
<h3>The Problem: Repeated Nodes</h3>
<p>Remember Fibonacci from Module 9?</p>
<pre><code>                fib(5)
               /      \
          fib(4)      fib(3)
          /    \      /    \
      fib(3) fib(2) fib(2) fib(1)
      ...
</code></pre>
<p><strong>fib(3) computed twice!</strong>
<strong>fib(2) computed three times!</strong></p>
<h3>The Solution: Memoization</h3>
<p><strong>Cache the results</strong> of repeated subproblems:</p>
<pre><code class="language-python">memo = {}

def fib(n):
    if n in memo:
        return memo[n]  # Reuse!

    # Compute only if not cached
    result = fib(n-1) + fib(n-2)
    memo[n] = result
    return result
</code></pre>
<p><strong>Time: O(2ⁿ) → O(n)</strong> 🎯</p>
<h3>Backtracking + Memoization = DP</h3>
<p>When your backtracking tree has <strong>repeated nodes</strong>:</p>
<ul>
<li>Draw the tree (you already know how!)</li>
<li>Spot the repeated subproblems</li>
<li>Add memo to cache results</li>
<li>Transform O(2ⁿ) → O(n) or O(n²)!</li>
</ul>
<hr>
<h2>Key Takeaways</h2>
<p>✅ <strong>Draw the tree first, code second</strong>
✅ <strong>Tree structure directly maps to code</strong>
✅ <strong>Make → Recurse → Undo is universal</strong>
✅ <strong>When nodes repeat → use memoization (Module 11)</strong></p>
<p><strong>Ready for Dynamic Programming?</strong> Let&#39;s optimize! 🚀</p>
`,
            estimatedReadTime: 180,
            autoMarkComplete: false,
        },
    
    ...module10BacktrackingLessonSmartPracticeExercises,
    ],
};
