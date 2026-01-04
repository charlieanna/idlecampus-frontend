import { ProgressiveLesson, LessonSection } from '../types/progressive-lesson-enhanced';
import { module11BacktrackingLessonSmartPracticeExercises } from './exercises/moduleBacktrackingLessonSmartPracticeExercises';

export const module11BacktrackingLesson: ProgressiveLesson = {
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
<h3>The Natural Approach: Build Level by Level</h3>
<p><strong>Start with an empty array: <code>[]</code></strong></p>
<p>Think of building subsets <strong>level by level</strong>:</p>
<table>
<thead>
<tr>
<th>Level</th>
<th>Description</th>
<th>Subsets</th>
</tr>
</thead>
<tbody><tr>
<td><strong>0</strong></td>
<td>Empty subset</td>
<td><code>[]</code></td>
</tr>
<tr>
<td><strong>1</strong></td>
<td>Single elements</td>
<td><code>[1]</code>, <code>[2]</code>, <code>[3]</code></td>
</tr>
<tr>
<td><strong>2</strong></td>
<td>Pairs</td>
<td><code>[1, 2]</code>, <code>[1, 3]</code>, <code>[2, 3]</code></td>
</tr>
<tr>
<td><strong>3</strong></td>
<td>Triple</td>
<td><code>[1, 2, 3]</code></td>
</tr>
</tbody></table>
<p><strong>Complete Result:</strong> <code>[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]</code></p>
<h3>How Do We Build This?</h3>
<p><strong>Start:</strong> <code>[]</code></p>
<ol>
<li><p><strong>To get Level 1:</strong> Add each element to <code>[]</code></p>
<ul>
<li><code>[]</code> + 1 → <code>[1]</code></li>
<li><code>[]</code> + 2 → <code>[2]</code></li>
<li><code>[]</code> + 3 → <code>[3]</code></li>
</ul>
</li>
<li><p><strong>To get Level 2:</strong> Add remaining elements to Level 1 subsets</p>
<ul>
<li><code>[1]</code> + 2 → <code>[1, 2]</code></li>
<li><code>[1]</code> + 3 → <code>[1, 3]</code></li>
<li><code>[2]</code> + 3 → <code>[2, 3]</code></li>
</ul>
</li>
<li><p><strong>To get Level 3:</strong> Add remaining elements to Level 2 subsets</p>
<ul>
<li><code>[1, 2]</code> + 3 → <code>[1, 2, 3]</code></li>
</ul>
</li>
</ol>
<h2>The Pattern</h2>
<p>At each level:</p>
<ol>
<li><strong>Take each subset from the previous level</strong></li>
<li><strong>Add the next available element</strong> to create new subsets</li>
<li><strong>Continue</strong> until all elements are used</li>
<li><strong>Collect</strong> all subsets from all levels</li>
</ol>
<h2>Visualizing the Process Level by Level</h2>
<pre><code>Level 0: []
         ↓
Level 1: [1], [2], [3]
         ↓
Level 2: [1,2], [1,3], [2,3]
         ↓
Level 3: [1,2,3]

All subsets: [], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]
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
<h2>The Subsets Tree for [1, 2, 3] - Level by Level</h2>
<pre><code>                    []         ← Level 0 (empty)
                 /  |  \\
              [1]  [2]  [3]    ← Level 1 (size 1)
              /\\    |
          [1,2][1,3][2,3]      ← Level 2 (size 2)
            |
        [1,2,3]                ← Level 3 (size 3)
</code></pre>
<p><strong>Organized by levels:</strong></p>
<pre><code>Level 0:        []
               /|\\
Level 1:    [1] [2] [3]
            /\\   |
Level 2: [1,2] [1,3] [2,3]
           |
Level 3: [1,2,3]
</code></pre>
<p><strong>Key insight:</strong> Each level contains all subsets of that size!</p>
<ul>
<li>Level 0: 1 subset of size 0 → []</li>
<li>Level 1: 3 subsets of size 1 → [1], [2], [3]</li>
<li>Level 2: 3 subsets of size 2 → [1,2], [1,3], [2,3]</li>
<li>Level 3: 1 subset of size 3 → [1,2,3]</li>
</ul>
<h2>The Big Reveal</h2>
<p><strong>The decision-making process YOU did IS this tree!</strong> 🎯</p>
<h3>Tree Structure = Problem Structure</h3>
<ul>
<li><strong>Root</strong>: Starting state (<code>[]</code>) - Level 0</li>
<li><strong>Each level</strong>: All subsets of that size</li>
<li><strong>Each node</strong>: A subset at a particular level</li>
<li><strong>Each edge</strong>: Adding the next element</li>
</ul>
<h2>Mapping to Module 9 Concepts</h2>
<p>Remember from Module 9:</p>
<ul>
<li>This is <strong>branching recursion</strong></li>
<li><strong>Each call</strong> = a node in this tree</li>
<li><strong>Each level</strong> = all subsets of that size</li>
</ul>
<h2>How to Read the Tree Level by Level</h2>
<p><strong>Level 0 (root):</strong></p>
<ul>
<li>Start with empty subset: <code>[]</code></li>
</ul>
<p><strong>Level 1:</strong></p>
<ul>
<li>From <code>[]</code>, add 1 → <code>[1]</code></li>
<li>From <code>[]</code>, add 2 → <code>[2]</code></li>
<li>From <code>[]</code>, add 3 → <code>[3]</code></li>
</ul>
<p><strong>Level 2:</strong></p>
<ul>
<li>From <code>[1]</code>, add 2 → <code>[1,2]</code></li>
<li>From <code>[1]</code>, add 3 → <code>[1,3]</code></li>
<li>From <code>[2]</code>, add 3 → <code>[2,3]</code></li>
</ul>
<p><strong>Level 3:</strong></p>
<ul>
<li>From <code>[1,2]</code>, add 3 → <code>[1,2,3]</code></li>
</ul>
<p><strong>All leaves = all subsets!</strong></p>
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

        {
            type: 'reading',
            id: 'progressive-subsets-lab',
            title: 'Hands-on Lab: Progressive Subsets',
            estimatedReadTime: 420,
            content: `<h1>Progressive Subsets Lab 🧪</h1>
<p>The interactive Subsets lesson walked through five bite-sized tasks. Capture the takeaways here so you can revisit the drills without the UI.</p>
<h2>Task 1 · List Copying Matters</h2>
<ul>
<li>Python stores references, not value copies.</li>
<li>Appending <code>current</code> directly means every entry in <code>result</code> points to the same list.</li>
<li>Fix: append <code>current[:]</code> or <code>list(current)</code> before storing.</li>
<li>Backtracking solutions break instantly without this step.</li>
</ul>
<h2>Task 2 · Build Subsets Manually</h2>
<p>For <code>[1, 2]</code>, push/pop your way through the four subsets:</p>
<ol>
<li>Save <code>[]</code>.</li>
<li>Append 1 → save copy.</li>
<li>Append 2 → save copy (<code>[1, 2]</code>).</li>
<li>Pop 2 → pop 1 → append 2 → save copy.</li>
</ol>
<p>That “append → save → pop” loop IS the backtracking rhythm.</p>
<h2>Task 3 · Why We Need <code>start</code></h2>
<ul>
<li>Loop from <code>start</code> to <code>len(nums)</code>.</li>
<li>After choosing index <code>i</code>, recurse with <code>i + 1</code>.</li>
<li>Ensures we only look forward so [2,1] never appears after [1,2] already exists.</li>
</ul>
<h2>Task 4 · Backtrack Helper Template</h2>
<pre><code class="language-python">def backtrack(start, current):
    result.append(current[:])      # 1. Save snapshot
    for i in range(start, len(nums)):
        current.append(nums[i])    # 2. Choose
        backtrack(i + 1, current)  # 3. Explore deeper
        current.pop()              # 4. Undo choice
</code></pre>
<p>Those four lines are the universal subsets template.</p>
<h2>Task 5 · Stitch Everything Together</h2>
<ul>
<li>Initialise <code>result = []</code>.</li>
<li>Define nested <code>backtrack</code>.</li>
<li>Kick off with <code>backtrack(0, [])</code>.</li>
<li>Return <code>result</code>.</li>
</ul>
<h3>Quick Checklist Before You Submit</h3>
<ul>
<li><input disabled="" type="checkbox"> Every time I log a subset I copy first.</li>
<li><input disabled="" type="checkbox"> My loop respects <code>start</code>.</li>
<li><input disabled="" type="checkbox"> I undo choices (pop) after recursion.</li>
<li><input disabled="" type="checkbox"> I started the helper with the correct arguments.</li>
</ul>
<p>Use this lab whenever backtracking feels fuzzy—five minutes of manual reps reinstalls the intuition.</p>
`,
        },

        // ============================================================
    // ==========================================
    // BACKTRACKING: DFS + SEARCH SPACES
    // ==========================================

    {
      type: 'reading',
      id: 'backtracking-dfs-search-spaces',
      title: 'Backtracking: DFS + Search Spaces',
      content: `<h1>Backtracking = DFS through Search Space</h1>
<h2>The Big Picture</h2>
<p><strong>Backtracking is DFS applied to a search space.</strong></p>
<p>Instead of exploring a graph, you&#39;re exploring a <strong>decision tree</strong> - a tree of all possible choices.</p>
<hr>
<h2>What&#39;s a Search Space?</h2>
<p>A search space is the <strong>set of all possible solutions</strong> to explore.</p>
<p>Each node = a partial solution path
Each branch = a choice you can make
Each leaf = a complete solution</p>
<hr>
<h2>DFS through Search Space</h2>
<pre><code class="language-python">def backtrack(path, candidates):
    # BASE CASE: Found a solution
    if is_solution(path):
        result.append(path)
        return
    
    # RECURSIVE CASE: Try each choice
    for choice in get_choices(candidates):
        path.append(choice)      # Make choice
        backtrack(path, rest)    # Explore
        path.pop()               # Undo choice (BACKTRACK!)
</code></pre>
<p>The key: <strong>UNDO after exploring</strong> so you can try other branches!</p>
<hr>
<h2>The 3 Key Questions</h2>
<p>For ANY backtracking problem, answer:</p>
<ol>
<li><p><strong>What is the search space?</strong></p>
<ul>
<li>All subsets? Permutations? Combinations? Valid placements?</li>
</ul>
</li>
<li><p><strong>What are the choices at each step?</strong></p>
<ul>
<li>Which elements can I pick/place next?</li>
</ul>
</li>
<li><p><strong>When do I stop (base case)?</strong></p>
<ul>
<li>When path has k elements? All elements used? Goal reached?</li>
</ul>
</li>
</ol>
<hr>
<h2>Common Patterns</h2>
<table>
<thead>
<tr>
<th>Problem</th>
<th>Search Space</th>
<th>Choices</th>
<th>Base Case</th>
</tr>
</thead>
<tbody><tr>
<td>Subsets</td>
<td>All subsets</td>
<td>Include/exclude each</td>
<td>All processed</td>
</tr>
<tr>
<td>Permutations</td>
<td>All orderings</td>
<td>Any remaining element</td>
<td>All used</td>
</tr>
<tr>
<td>Combinations</td>
<td>k elements chosen</td>
<td>Next elements</td>
<td>k chosen</td>
</tr>
<tr>
<td>N-Queens</td>
<td>Valid placements</td>
<td>Next row positions</td>
<td>All rows filled</td>
</tr>
<tr>
<td>Word Search</td>
<td>Paths in grid</td>
<td>Adjacent cells (4 dirs)</td>
<td>Word found</td>
</tr>
</tbody></table>
<hr>
<h2>Complexity Note</h2>
<p>Search space size often = <strong>O(2^n) or O(n!)</strong></p>
<p>Backtracking is for <strong>&quot;find all&quot;</strong> problems with moderate-size inputs.</p>
<p>Not for:</p>
<ul>
<li>Find ONE solution (use greedy)</li>
<li>Shortest path (use BFS)</li>
<li>Optimization (use DP)</li>
</ul>
`,
    },

        // PART 1: TREE → CODE MAPPING (Items 3-7)
        // ============================================================

        // ITEM 3: The 4-Step Template
        {
            type: 'reading',
            id: 'four-step-template',
            title: 'The 4-Step Backtracking Template',
            content: `<h1>The 4-Step Backtracking Template 📋</h1>
<p>Now we map the <strong>tree structure</strong> to <strong>code structure</strong>.</p>
<h2>The Tree (from Section 2)</h2>
<p>Remember our tree for subsets of [1, 2, 3]:</p>
<pre><code>Level 0:                    []
                         /   |   \
Level 1:              [1]   [2]   [3]
                     /   \     \
Level 2:         [1,2]  [1,3] [2,3]
                   |
Level 3:        [1,2,3]
</code></pre>
<p><strong>All nodes are valid subsets!</strong> We collect every node as we traverse.</p>
<h2>How the Code Explores This Tree</h2>
<p>For a simpler example with [1, 2]:</p>
<pre><code>Start: []
  ├── Add 1 → [1]
  │     ├── Add 2 → [1,2] ✓
  │     └── Done with 2 → [1] ✓
  └── Skip 1, Add 2 → [2]
        └── Done → [2] ✓
Final: [] ✓
</code></pre>
<p><strong>Key insight:</strong> At each element, we either <strong>include it</strong> or <strong>skip to next</strong>.</p>
<h2>The 4 Steps</h2>
<p>Every backtracking solution has these 4 steps:</p>
<h3>STEP 1: Save Current State (Every node is a valid subset!)</h3>
<p><strong>Tree:</strong> Unlike permutations, <strong>every node</strong> in the subsets tree is a valid answer!</p>
<p><strong>Code:</strong></p>
<pre><code class="language-python">result.append(path[:])  # Save current subset immediately!
</code></pre>
<p><strong>Why:</strong> We save at EVERY node, not just leaves. The empty set <code>[]</code>, single elements <code>[1]</code>, pairs <code>[1,2]</code>, etc. are ALL valid subsets!</p>
<hr>
<h3>⚠️ Wait - Why <code>path[:]</code> instead of <code>path</code>?</h3>
<p>This is <strong>critical</strong>! Let&#39;s understand why we need the copy.</p>
<p><strong>The Bug (without copy):</strong></p>
<pre><code class="language-python">result.append(path)   # ❌ Stores a REFERENCE
</code></pre>
<p>All saved &quot;solutions&quot; point to the <strong>same list object</strong>. Since we keep modifying <code>path</code>, they all show the final state!</p>
<p><strong>Memory without copy:</strong></p>
<pre><code>path = [1, 2, 3]  ← One list object
         ↑   ↑   ↑
         |   |   |
result = [•   •   •]  ← All point to SAME object!
</code></pre>
<p><strong>The Fix (with copy):</strong></p>
<pre><code class="language-python">result.append(path[:])  # ✅ Creates a COPY (snapshot)
</code></pre>
<p>Each saved solution is an <strong>independent copy</strong>. Changes to <code>path</code> don&#39;t affect saved copies.</p>
<p><strong>Memory with copy:</strong></p>
<pre><code>[1]         ← Copy 1 (independent)
[1, 2]      ← Copy 2 (independent)
[1, 2, 3]   ← Copy 3 (independent)
  ↑   ↑   ↑
result = [•   •   •]  ← Three DIFFERENT objects!
</code></pre>
<p><strong>Three equivalent ways to copy:</strong></p>
<pre><code class="language-python">path[:]        # Slice notation (most common)
list(path)     # list() constructor
path.copy()    # .copy() method
</code></pre>
<blockquote>
<p>🔑 <strong>Rule: Always use <code>path[:]</code> when saving a solution!</strong></p>
</blockquote>
<hr>
<h3>STEP 2: Decisions (What branches from this node?)</h3>
<p><strong>Tree:</strong> From each node, we can add any <strong>remaining</strong> element (elements after current position).</p>
<p>Looking at the tree:</p>
<ul>
<li>From <code>[]</code>: can add 1, 2, or 3 → branches to <code>[1]</code>, <code>[2]</code>, <code>[3]</code></li>
<li>From <code>[1]</code>: can add 2 or 3 → branches to <code>[1,2]</code>, <code>[1,3]</code></li>
<li>From <code>[2]</code>: can only add 3 → branches to <code>[2,3]</code></li>
</ul>
<p><strong>Code:</strong> Loop through remaining elements:</p>
<pre><code class="language-python">for i in range(start, len(nums)):
    # Try adding nums[i]
</code></pre>
<hr>
<h3>STEP 3: Make Decision → Explore → Undo</h3>
<p>For each element we can add:</p>
<pre><code class="language-python">for i in range(start, len(nums)):
    # MAKE the decision - add this element
    path.append(nums[i])

    # EXPLORE - recurse with next starting position
    backtrack(path, i + 1)

    # UNDO the decision (backtrack!)
    path.pop()
</code></pre>
<p><strong>Key:</strong> <code>i + 1</code> ensures we only pick elements <strong>after</strong> the current one (no duplicates like <code>[2,1]</code>).</p>
<hr>
<h3>Why is <code>path.pop()</code> Required?</h3>
<p>The <code>path.pop()</code> <strong>undoes</strong> your choice, allowing you to try a different branch.</p>
<p><strong>Tree visualization for subsets of [1, 2, 3]:</strong></p>
<pre><code>                    []
                   /  \
            [1]         []          ← choose 1 or skip 1
           /   \       /   \
      [1,2]   [1]    [2]    []      ← choose 2 or skip 2
       / \    / \    / \    / \
   [1,2,3] [1,2] [1,3] [1] [2,3] [2] [3] []
</code></pre>
<p><strong>Step-by-step execution:</strong></p>
<pre><code>path = []
backtrack([], 0)
    │
    ├── path.append(1)  →  path = [1]
    │   │
    │   ├── path.append(2)  →  path = [1,2]
    │   │   │
    │   │   ├── path.append(3)  →  path = [1,2,3]  ✓ Found!
    │   │   │
    │   │   └── path.pop()      →  path = [1,2]    ← UNDO 3, go back up
    │   │
    │   └── path.pop()          →  path = [1]      ← UNDO 2, try skipping 2
    │       │
    │       ├── path.append(3)  →  path = [1,3]    ✓ Found!
    │       │
    │       └── path.pop()      →  path = [1]      ← UNDO 3
    │
    └── path.pop()              →  path = []       ← UNDO 1, try skipping 1
        │
        ├── path.append(2)      →  path = [2]
        ...
</code></pre>
<p><strong>Without <code>path.pop()</code>:</strong></p>
<pre><code class="language-python"># After exploring [1,2,3], path stays [1,2,3]
# Next iteration tries to build [1,3] but path is corrupted!
# You&#39;d get [1,2,3,3] instead of [1,3]
</code></pre>
<p><strong>The key insight:</strong></p>
<ul>
<li><code>path</code> is a <strong>shared</strong> variable across all recursive calls</li>
<li>When you go <strong>down</strong> the tree: <code>append()</code> adds your choice</li>
<li>When you come <strong>back up</strong>: <code>pop()</code> removes it so you can try another branch</li>
</ul>
<p><strong>Mental model - walking through a maze:</strong></p>
<ol>
<li><code>append()</code> = take a step forward, leave a breadcrumb</li>
<li><code>recurse</code> = explore that path fully</li>
<li><code>pop()</code> = pick up the breadcrumb, step backward</li>
<li><code>next iteration</code> = try a different direction</li>
</ol>
<p>Without popping, you&#39;d be stuck carrying all your previous choices!</p>
<hr>
<h3>STEP 4: Return (After exploring all branches)</h3>
<p>After trying all possible additions, return to parent node.</p>
<h2>The Complete Template</h2>
<pre><code class="language-python">def subsets(nums):
    result = []

    def backtrack(path, start):
        # STEP 1: Save current subset (every node is valid!)
        result.append(path[:])

        # STEP 2 &amp; 3: Try adding each remaining element
        for i in range(start, len(nums)):
            path.append(nums[i])      # MAKE decision
            backtrack(path, i + 1)    # EXPLORE (only elements after i)
            path.pop()                # UNDO decision

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
<td><strong>Root node <code>[]</code></strong></td>
<td><code>backtrack([], 0)</code></td>
</tr>
<tr>
<td><strong>Every node is a subset</strong></td>
<td><code>result.append(path[:])</code> at start</td>
</tr>
<tr>
<td><strong>Branches = remaining elements</strong></td>
<td><code>for i in range(start, len(nums))</code></td>
</tr>
<tr>
<td><strong>Add element to go deeper</strong></td>
<td><code>path.append(nums[i])</code></td>
</tr>
<tr>
<td><strong>Only pick forward elements</strong></td>
<td><code>i + 1</code> prevents <code>[2,1]</code> duplicates</td>
</tr>
<tr>
<td><strong>Backtrack to try siblings</strong></td>
<td><code>path.pop()</code></td>
</tr>
</tbody></table>
<h2>Why This Works</h2>
<ol>
<li><strong>Save immediately</strong> - every path (including <code>[]</code>) is a valid subset</li>
<li><strong>Loop through remaining</strong> - from <code>[1]</code>, we can add <code>2</code> or <code>3</code></li>
<li><strong>Forward-only (<code>i + 1</code>)</strong> - prevents duplicate subsets</li>
<li><strong>Make/undo</strong> - try <code>[1,2]</code>, backtrack to <code>[1]</code>, try <code>[1,3]</code></li>
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
<h2>STEP 1: How to Solve the Problem</h2>
<p>Generate all permutations of <code>[1, 2, 3]</code>.</p>
<p><strong>Example output:</strong></p>
<pre><code>[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]
</code></pre>
<p>6 permutations = 3!</p>
<h3>The Natural Approach: Build Position by Position</h3>
<p><strong>How would YOU generate all permutations?</strong></p>
<p><strong>Position 1 (empty → 1 element):</strong></p>
<ul>
<li>Pick 1 → <strong>[1]</strong></li>
<li>Pick 2 → <strong>[2]</strong></li>
<li>Pick 3 → <strong>[3]</strong></li>
</ul>
<p><strong>Position 2 (from [1]):</strong></p>
<ul>
<li>Pick 2 → <strong>[1, 2]</strong></li>
<li>Pick 3 → <strong>[1, 3]</strong></li>
</ul>
<p><strong>Position 2 (from [2]):</strong></p>
<ul>
<li>Pick 1 → <strong>[2, 1]</strong></li>
<li>Pick 3 → <strong>[2, 3]</strong></li>
</ul>
<p><strong>Position 2 (from [3]):</strong></p>
<ul>
<li>Pick 1 → <strong>[3, 1]</strong></li>
<li>Pick 2 → <strong>[3, 2]</strong></li>
</ul>
<p><strong>Position 3 (complete all permutations):</strong></p>
<ul>
<li>From [1,2]: add 3 → <strong>[1,2,3]</strong></li>
<li>From [1,3]: add 2 → <strong>[1,3,2]</strong></li>
<li>From [2,1]: add 3 → <strong>[2,1,3]</strong></li>
<li>From [2,3]: add 1 → <strong>[2,3,1]</strong></li>
<li>From [3,1]: add 2 → <strong>[3,1,2]</strong></li>
<li>From [3,2]: add 1 → <strong>[3,2,1]</strong></li>
</ul>
<p><strong>Key difference from Subsets:</strong> [1,2] and [2,1] are <strong>different</strong> (order matters!)</p>
<hr>
<h2>STEP 2: How It Translates to a Tree</h2>
<pre><code>Level 0:                      []
                  /           |           \
Level 1:       [1]          [2]          [3]
              / \           / \           / \
Level 2:  [1,2] [1,3]   [2,1] [2,3]   [3,1] [3,2]
            |     |       |     |       |     |
Level 3: [1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]
            ✓     ✓       ✓     ✓       ✓     ✓
</code></pre>
<p><strong>6 leaves = 3! = 6 permutations</strong></p>
<h3>Tree Structure</h3>
<ul>
<li><strong>Level 0</strong>: Empty array []</li>
<li><strong>Level 1</strong>: 3 nodes (pick any element: 1, 2, or 3)</li>
<li><strong>Level 2</strong>: 6 nodes (pick any unused element)</li>
<li><strong>Level 3</strong>: 6 leaves (all permutations complete)</li>
</ul>
<p><strong>Key insight:</strong> At each level, we have <strong>n branches</strong> (one for each unused element).</p>
<hr>
<h2>STEP 3: How the Tree Maps to Code</h2>
<h3>Base Case (Leaves)</h3>
<p><strong>When:</strong> We&#39;ve filled all n positions</p>
<pre><code class="language-python">if len(path) == len(nums):
    result.append(path[:])  # Save this permutation
    return
</code></pre>
<h3>Decisions (Branches at each level)</h3>
<p><strong>What:</strong> Try each unused element at current position</p>
<pre><code class="language-python">for i in range(len(nums)):
    if used[i]:  # Skip if already used
        continue

    # Make decision - add element to current position
    path.append(nums[i])
    used[i] = True

    # Explore - move to next position
    backtrack(path, used)

    # Undo - backtrack to try other options
    used[i] = False
    path.pop()
</code></pre>
<hr>
<h2>STEP 4: Parameters to Carry to Next Level</h2>
<pre><code class="language-python">def backtrack(path, used):
    # path: Current permutation being built
    # used: Which elements are already used
</code></pre>
<p><strong>What we track:</strong></p>
<ul>
<li><code>path</code>: The permutation so far (e.g., [1, 2])</li>
<li><code>used</code>: Boolean array marking used elements (e.g., [True, True, False])</li>
</ul>
<p><strong>Why we need <code>used</code>:</strong></p>
<ul>
<li>Unlike subsets (where we track index), permutations can use any element</li>
<li>Need to remember which elements are already in the current path</li>
<li><code>used[i] = True</code> means nums[i] is already in path</li>
</ul>
<hr>
<h2>Complete Code</h2>
<pre><code class="language-python">def permute(nums):
    result = []

    def backtrack(path, used):
        # Base case: filled all positions
        if len(path) == len(nums):
            result.append(path[:])
            return

        # Try each unused element at current position
        for i in range(len(nums)):
            if used[i]:
                continue

            # Make decision
            path.append(nums[i])
            used[i] = True

            # Explore next position
            backtrack(path, used)

            # Undo
            used[i] = False
            path.pop()

    backtrack([], [False] * len(nums))
    return result
</code></pre>
<hr>
<h2>Key Differences from Subsets</h2>
<table>
<thead>
<tr>
<th>Aspect</th>
<th>Subsets</th>
<th>Permutations</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Order</strong></td>
<td>Doesn&#39;t matter</td>
<td><strong>Matters!</strong></td>
</tr>
<tr>
<td><strong>Branches</strong></td>
<td>2 (add or don&#39;t add)</td>
<td>n (pick any unused)</td>
</tr>
<tr>
<td><strong>Tracking</strong></td>
<td><code>index</code> (which element to consider)</td>
<td><code>used</code> (which elements already picked)</td>
</tr>
<tr>
<td><strong>Base case</strong></td>
<td><code>index == len(nums)</code></td>
<td><code>len(path) == len(nums)</code></td>
</tr>
<tr>
<td><strong>Solutions</strong></td>
<td>2ⁿ</td>
<td>n!</td>
</tr>
</tbody></table>
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
<h2>STEP 1: How to Solve the Problem</h2>
<p>Find all 2-element combinations from <code>[1, 2, 3, 4]</code>.</p>
<p><strong>Example output:</strong></p>
<pre><code>[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]
</code></pre>
<p>C(4, 2) = 6 combinations</p>
<h3>The Natural Approach: Build Forward Only</h3>
<p><strong>How would YOU generate all combinations?</strong></p>
<p><strong>Start:</strong> []</p>
<p><strong>Level 1 (pick first element):</strong></p>
<ul>
<li>Pick 1 → <strong>[1]</strong></li>
<li>Pick 2 → <strong>[2]</strong></li>
<li>Pick 3 → <strong>[3]</strong></li>
<li>Pick 4 → <strong>[4]</strong></li>
</ul>
<p><strong>Level 2 (pick second element - only forward!):</strong></p>
<ul>
<li>From [1]: pick 2 → <strong>[1,2]</strong> ✓</li>
<li>From [1]: pick 3 → <strong>[1,3]</strong> ✓</li>
<li>From [1]: pick 4 → <strong>[1,4]</strong> ✓</li>
<li>From [2]: pick 3 → <strong>[2,3]</strong> ✓</li>
<li>From [2]: pick 4 → <strong>[2,4]</strong> ✓</li>
<li>From [3]: pick 4 → <strong>[3,4]</strong> ✓</li>
</ul>
<p><strong>Key insight:</strong> [1,2] and [2,1] are the SAME combination!</p>
<p>To avoid duplicates, we only move <strong>forward</strong>:</p>
<ul>
<li>If we picked 1, next we can pick 2, 3, or 4 (not 1 again)</li>
<li>If we picked 2, next we can pick 3 or 4 (not 1 or 2)</li>
</ul>
<hr>
<h2>STEP 2: How It Translates to a Tree</h2>
<pre><code>Level 0:              []
           /       /       \       \
Level 1:  [1]     [2]      [3]    [4]
         / | \    / \       |
Level 2: [1,2][1,3][1,4][2,3][2,4][3,4]
          ✓    ✓    ✓    ✓    ✓    ✓
</code></pre>
<p><strong>6 leaves = C(4,2) = 6</strong></p>
<h3>Tree Structure</h3>
<ul>
<li><strong>Level 0</strong>: Empty array []</li>
<li><strong>Level 1</strong>: Pick first element (any of 1,2,3,4)</li>
<li><strong>Level 2</strong>: Pick second element (only from remaining forward elements)</li>
<li><strong>Leaves</strong>: All k-element combinations</li>
</ul>
<p><strong>Key:</strong> From [1], we only consider 2,3,4 (not 1). This prevents duplicates!</p>
<hr>
<h2>STEP 3: How the Tree Maps to Code</h2>
<h3>Base Case (Leaves)</h3>
<p><strong>When:</strong> We&#39;ve picked k elements</p>
<pre><code class="language-python">if len(path) == k:
    result.append(path[:])  # Save this combination
    return
</code></pre>
<h3>Decisions (Branches - forward only!)</h3>
<p><strong>What:</strong> Pick from <code>start</code> to <code>n</code> (forward only)</p>
<pre><code class="language-python">for i in range(start, n + 1):
    # Make decision - add element i
    path.append(i)

    # Explore - continue with elements after i
    backtrack(path, i + 1)  # Next start = i+1 (forward only!)

    # Undo - backtrack
    path.pop()
</code></pre>
<hr>
<h2>STEP 4: Parameters to Carry to Next Level</h2>
<pre><code class="language-python">def backtrack(path, start):
    # path: Current combination being built
    # start: Next element to consider (ensures forward-only)
</code></pre>
<p><strong>What we track:</strong></p>
<ul>
<li><code>path</code>: The combination so far (e.g., [1, 3])</li>
<li><code>start</code>: Next valid element to pick (e.g., if path=[1,3], start=4)</li>
</ul>
<p><strong>Why we need <code>start</code>:</strong></p>
<ul>
<li>Prevents duplicates: [1,2] yes, [2,1] never generated</li>
<li>Only pick elements <strong>after</strong> the last picked element</li>
<li><code>start = i + 1</code> ensures forward-only exploration</li>
</ul>
<p><strong>Key difference from Permutations:</strong></p>
<ul>
<li>Permutations use <code>used[]</code> array (can pick any unused)</li>
<li>Combinations use <code>start</code> index (can only pick forward)</li>
</ul>
<hr>
<h2>Complete Code</h2>
<pre><code class="language-python">def combine(n, k):
    result = []

    def backtrack(path, start):
        # Base case: picked k elements
        if len(path) == k:
            result.append(path[:])
            return

        # Try elements from start to n (forward only)
        for i in range(start, n + 1):
            # Make decision
            path.append(i)

            # Explore next level (start = i+1 for forward-only)
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
<h2>STEP 1: How to Solve the Problem</h2>
<p>Given <code>candidates = [2, 3, 5]</code> and <code>target = 8</code>, find all combinations that sum to 8.</p>
<p><strong>Output:</strong></p>
<pre><code>[[2,2,2,2], [2,3,3], [3,5]]
</code></pre>
<p><strong>Key:</strong> You can use the same number multiple times!</p>
<h3>The Natural Approach</h3>
<p><strong>How would YOU find combinations that sum to 8?</strong></p>
<p><strong>Start:</strong> [] (sum=0)</p>
<p><strong>Try adding 2:</strong></p>
<ul>
<li>[] → [2] (sum=2)</li>
<li>[2] → [2,2] (sum=4)</li>
<li>[2,2] → [2,2,2] (sum=6)</li>
<li>[2,2,2] → [2,2,2,2] (sum=8) ✓ Found one!</li>
</ul>
<p><strong>Try adding 3 instead:</strong></p>
<ul>
<li>[] → [2] → [2,3] (sum=5)</li>
<li>[2,3] → [2,3,3] (sum=8) ✓ Found one!</li>
</ul>
<p><strong>Try starting with 3:</strong></p>
<ul>
<li>[] → [3] → [3,5] (sum=8) ✓ Found one!</li>
</ul>
<p><strong>Avoid duplicates:</strong> [2,3,3] yes, but [3,2,3] no (same combination, different order)</p>
<hr>
<h2>STEP 2: How It Translates to a Tree</h2>
<pre><code>Level 0:          [] (sum=0)
                /  |  \
Level 1:      [2] [3] [5]
             (2) (3) (5)
            / | \  |\  |
Level 2: [2,2][2,3][2,5][3,3][3,5][5,5]
          (4) (5) (7) (6) (8)✓(10)✗
          / |\  |\
Level 3:[2,2,2][2,2,3][2,2,5][2,3,3]...
         (6)  (7)  (9)✗ (8)✓
          |    |
Level 4:[2,2,2,2][2,2,3,3]...
         (8)✓   (10)✗
</code></pre>
<p><strong>Variable depth:</strong> Stop when sum = target (not fixed depth like combinations)</p>
<h3>Tree Structure</h3>
<ul>
<li><strong>Level 0</strong>: Empty (sum=0)</li>
<li><strong>Each level</strong>: Add another element (can reuse!)</li>
<li><strong>Branches</strong>: Only forward elements (avoids duplicates)</li>
<li><strong>Pruning</strong>: Stop if sum &gt; target</li>
</ul>
<p><strong>Key:</strong> Tree depth varies! [2,2,2,2] has 4 levels, [3,5] has 2 levels.</p>
<hr>
<h2>STEP 3: How the Tree Maps to Code</h2>
<h3>Base Case (2 conditions!)</h3>
<p><strong>Success:</strong></p>
<pre><code class="language-python">if current_sum == target:
    result.append(path[:])  # Found a valid combination!
    return
</code></pre>
<p><strong>Failure (prune):</strong></p>
<pre><code class="language-python">if current_sum &gt; target:
    return  # Stop exploring this branch
</code></pre>
<h3>Decisions (Branches)</h3>
<p><strong>What:</strong> Try each candidate from <code>start</code> onwards</p>
<pre><code class="language-python">for i in range(start, len(candidates)):
    # Make decision - add candidate
    path.append(candidates[i])

    # Explore - CAN REUSE! Pass i (not i+1)
    backtrack(path, i, current_sum + candidates[i])

    # Undo
    path.pop()
</code></pre>
<p><strong>Key:</strong> <code>backtrack(path, i, ...)</code> not <code>i+1</code> → allows reuse!</p>
<hr>
<h2>STEP 4: Parameters to Carry to Next Level</h2>
<pre><code class="language-python">def backtrack(path, start, current_sum):
    # path: Current combination being built
    # start: Next candidate to consider (for forward-only)
    # current_sum: Running sum of path
</code></pre>
<p><strong>What we track:</strong></p>
<ul>
<li><code>path</code>: The combination so far (e.g., [2, 3, 3])</li>
<li><code>start</code>: Index of next candidate to try (e.g., 0, 1, or 2)</li>
<li><code>current_sum</code>: Sum of elements in path (e.g., 8)</li>
</ul>
<p><strong>Why we need these parameters:</strong></p>
<ul>
<li><code>path</code>: Builds the solution level by level</li>
<li><code>start</code>: Prevents duplicates (only pick forward elements)</li>
<li><code>current_sum</code>: For pruning (stop if exceeds target)</li>
</ul>
<p><strong>Key difference from Combinations:</strong></p>
<ul>
<li>Combinations: <code>backtrack(path, i + 1)</code> (no reuse, fixed depth k)</li>
<li>Combination Sum: <code>backtrack(path, i, current_sum)</code> (reuse!, variable depth)</li>
</ul>
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

        # Try each candidate from start (forward only)
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            # Note: Pass i (not i+1) to allow reuse
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
<h2>STEP 1: How to Solve the Problem</h2>
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
<h3>The Natural Approach: Row by Row</h3>
<p><strong>How would YOU place 4 queens?</strong></p>
<p><strong>Strategy: One Queen Per Row</strong></p>
<p><strong>Row 0:</strong> Try each column</p>
<ul>
<li>Try col 0: Place Q at (0,0)</li>
<li>Try col 1: Place Q at (0,1)</li>
<li>Try col 2: Place Q at (0,2)</li>
<li>Try col 3: Place Q at (0,3)</li>
</ul>
<p><strong>Row 1:</strong> For each valid Row 0 placement, try Row 1</p>
<ul>
<li>If Q at (0,1): Try (1,0)? ✗ diagonal attack</li>
<li>If Q at (0,1): Try (1,1)? ✗ same column</li>
<li>If Q at (0,1): Try (1,2)? ✗ diagonal attack</li>
<li>If Q at (0,1): Try (1,3)? ✓ valid!</li>
</ul>
<p><strong>Continue for all rows until all queens placed or impossible</strong></p>
<p>This <strong>eliminates row conflicts</strong> by design (one queen per row)!</p>
<hr>
<h2>STEP 2: How It Translates to a Tree</h2>
<pre><code>Level 0 (Row 0):         Empty board
                    /    |    \    \
Level 1 (Row 1):  Q@col0 Q@col1 Q@col2 Q@col3
                    |      |      |      |
                  Try    Try    Try    Try
                  Row1   Row1   Row1   Row1
                  /|\\   /|\\   /|\\   /|\\
                 0123   0123   0123   0123
                 XXXX   X✓XX   ✓XXX   X✓XX  ← Most pruned!
                         |      |       |
Level 2:              Valid  Valid   Valid
                      placements...
</code></pre>
<p><strong>Key:</strong> Many branches are pruned early due to constraint violations!</p>
<h3>Tree Structure</h3>
<ul>
<li><strong>Level 0</strong>: Empty board</li>
<li><strong>Level 1</strong>: Place queen in row 0 (4 choices)</li>
<li><strong>Level 2</strong>: Place queen in row 1 (check constraints!)</li>
<li><strong>Level n</strong>: All n queens placed (solution!)</li>
</ul>
<p><strong>Pruning:</strong> At each level, most positions are invalid (attacked by previous queens)</p>
<hr>
<h2>STEP 3: How the Tree Maps to Code</h2>
<h3>Base Case (Leaves)</h3>
<p><strong>When:</strong> Placed all n queens (row == n)</p>
<pre><code class="language-python">if row == n:
    result.append(construct_board(board))  # Save valid solution
    return
</code></pre>
<h3>Constraint Checking</h3>
<p><strong>Before placing queen, check if valid:</strong></p>
<p><strong>Column Conflict:</strong></p>
<pre><code class="language-python"># Any queen in same column?
for r in range(row):
    if board[r] == col:
        return False
</code></pre>
<p><strong>Diagonal Conflicts:</strong></p>
<pre><code class="language-python"># Main diagonal (↘): row - col is constant
# Anti-diagonal (↙): row + col is constant
for r in range(row):
    if abs(row - r) == abs(col - board[r]):
        return False
</code></pre>
<h3>Decisions (Branches)</h3>
<p><strong>What:</strong> Try each column in current row (if valid)</p>
<pre><code class="language-python">for col in range(n):
    if is_valid(board, row, col):  # Check constraints FIRST!
        # Make decision - place queen
        board[row] = col
        
        # Explore - move to next row
        backtrack(row + 1)
        
        # Undo - remove queen
        board[row] = -1
</code></pre>
<hr>
<h2>STEP 4: Parameters to Carry to Next Level</h2>
<pre><code class="language-python">def backtrack(row):
    # row: Current row being processed (0 to n-1)
    # board: Array where board[i] = column of queen in row i
</code></pre>
<p><strong>What we track:</strong></p>
<ul>
<li><code>row</code>: Which row we&#39;re placing a queen in (e.g., 0, 1, 2, 3)</li>
<li><code>board</code>: Array storing queen positions (e.g., [1, 3, 0, 2])<ul>
<li><code>board[0] = 1</code> means queen in row 0 at column 1</li>
<li><code>board[1] = 3</code> means queen in row 1 at column 3</li>
</ul>
</li>
</ul>
<p><strong>Why we need these:</strong></p>
<ul>
<li><code>row</code>: Tells us current level in tree (which row to fill)</li>
<li><code>board</code>: Tracks all previous decisions for constraint checking</li>
</ul>
<p><strong>Key insight:</strong> We don&#39;t need <code>used</code> or <code>start</code> here!</p>
<ul>
<li>One queen per row (so row parameter is enough)</li>
<li>Board array tracks column positions for constraint checking</li>
</ul>
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
        # Base: placed all n queens
        if row == n:
            result.append(construct_board(board))
            return

        # Try each column in current row
        for col in range(n):
            if is_valid(row, col):  # Check constraints first!
                board[row] = col      # Place queen
                backtrack(row + 1)    # Next row
                board[row] = -1       # Remove queen

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

        // Word Search Exercise
        ,// ============================================================
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
<h2>The Issue (Without Duplicate Handling)</h2>
<pre><code>Level 0:           []
                /   |   \
Level 1:      [1]  [2]  [2]     ← Two branches for the two 2s!
             / \    |     |
Level 2: [1,2][1,2][2,2] [2,2]  ← Duplicate [2,2]!
           |    |
Level 3: [1,2,2][1,2,2]         ← Duplicate [1,2,2]!
</code></pre>
<p><strong>Problem:</strong> Both 2s create separate branches, generating duplicates!</p>
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
<h2>Visualization (With Duplicate Handling)</h2>
<pre><code>Input: [1, 2, 2] (sorted)

Level 0:           []
                /   |
Level 1:      [1]  [2]     ← Only ONE branch for 2 (skip duplicate!)
             / |     |
Level 2: [1,2][1,2] [2,2]  ← Second [1,2] uses 2nd &quot;2&quot;
           |
Level 3: [1,2,2]
</code></pre>
<p><strong>How it works at each level:</strong></p>
<ul>
<li>From <code>[]</code>: Try 1 → <code>[1]</code>, Try first 2 → <code>[2]</code>, Skip second 2 (duplicate!)</li>
<li>From <code>[1]</code>: Try first 2 → <code>[1,2]</code>, Try second 2 → <code>[1,2]</code> (same value, different index)</li>
<li>From <code>[1,2]</code>: Try second 2 → <code>[1,2,2]</code></li>
</ul>
<p><strong>Result:</strong> <code>[], [1], [2], [1,2], [2,2], [1,2,2]</code> - No duplicates!</p>
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
<h2>Pattern 1: Subsets (Level by Level)</h2>
<p><strong>Structure:</strong> Binary tree (2 branches per node)
<strong>Reuse:</strong> No
<strong>Order:</strong> Doesn&#39;t matter
<strong>Tree:</strong> Build level by level - each level = subsets of that size</p>
<pre><code class="language-python">def subsets(nums):
    result = []

    def backtrack(path, index):
        # Parameters:
        # - path: Current subset being built
        # - index: Which element to consider next
        
        if index == len(nums):
            result.append(path[:])
            return

        # Add element (move to next level)
        path.append(nums[index])
        backtrack(path, index + 1)
        path.pop()

        # Don&#39;t add element (stay at current level)
        backtrack(path, index + 1)

    backtrack([], 0)
    return result
</code></pre>
<p><strong>Parameters to carry:</strong></p>
<ul>
<li><code>path</code>: Current subset</li>
<li><code>index</code>: Next element to consider</li>
</ul>
<p><strong>Time:</strong> O(2ⁿ × n)
<strong>Applications:</strong> Power set, subset sum</p>
<hr>
<h2>Pattern 2: Permutations (Pick Unused)</h2>
<p><strong>Structure:</strong> n-ary tree (n branches per node)
<strong>Reuse:</strong> No
<strong>Order:</strong> Matters!
<strong>Tree:</strong> Build position by position - each level picks next position</p>
<pre><code class="language-python">def permute(nums):
    result = []

    def backtrack(path, used):
        # Parameters:
        # - path: Current permutation being built
        # - used: Boolean array tracking which elements are used
        
        if len(path) == len(nums):
            result.append(path[:])
            return

        # Try each unused element at current position
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
<p><strong>Parameters to carry:</strong></p>
<ul>
<li><code>path</code>: Current permutation</li>
<li><code>used</code>: Which elements already picked</li>
</ul>
<p><strong>Time:</strong> O(n! × n)
<strong>Applications:</strong> Arrangements, schedules</p>
<hr>
<h2>Pattern 3: Combinations (Forward Only)</h2>
<p><strong>Structure:</strong> Pruned tree (forward only to avoid duplicates)
<strong>Reuse:</strong> No
<strong>Order:</strong> Doesn&#39;t matter
<strong>Tree:</strong> Build level by level - only pick forward elements</p>
<pre><code class="language-python">def combine(n, k):
    result = []

    def backtrack(path, start):
        # Parameters:
        # - path: Current combination being built
        # - start: Next element to consider (forward only)
        
        if len(path) == k:
            result.append(path[:])
            return

        # Try elements from start to n (forward only!)
        for i in range(start, n + 1):
            path.append(i)
            backtrack(path, i + 1)  # i+1 = no reuse, forward only
            path.pop()

    backtrack([], 1)
    return result
</code></pre>
<p><strong>Parameters to carry:</strong></p>
<ul>
<li><code>path</code>: Current combination</li>
<li><code>start</code>: Next valid element (ensures forward-only)</li>
</ul>
<p><strong>Time:</strong> O(C(n,k) × k)
<strong>Applications:</strong> Selecting teams, committees</p>
<hr>
<h2>Pattern 4: Combination Sum (Forward + Reuse)</h2>
<p><strong>Structure:</strong> Variable depth tree
<strong>Reuse:</strong> Yes!
<strong>Order:</strong> Doesn&#39;t matter
<strong>Tree:</strong> Build until sum = target - depth varies</p>
<pre><code class="language-python">def combinationSum(candidates, target):
    result = []

    def backtrack(path, start, current_sum):
        # Parameters:
        # - path: Current combination being built
        # - start: Next candidate to consider (forward only)
        # - current_sum: Running sum of elements in path
        
        if current_sum == target:
            result.append(path[:])
            return
        if current_sum &gt; target:
            return  # Prune!

        # Try candidates from start (forward only)
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            backtrack(path, i, current_sum + candidates[i])  # i = reuse!
            path.pop()

    backtrack([], 0, 0)
    return result
</code></pre>
<p><strong>Parameters to carry:</strong></p>
<ul>
<li><code>path</code>: Current combination</li>
<li><code>start</code>: Next candidate index (forward-only + reuse)</li>
<li><code>current_sum</code>: Sum for pruning</li>
</ul>
<p><strong>Time:</strong> O(2^target) approximately
<strong>Applications:</strong> Coin change, ways to sum</p>
<hr>
<h2>Pattern 5: Constraint Satisfaction (N-Queens)</h2>
<p><strong>Structure:</strong> Constraint-heavy tree
<strong>Validation:</strong> Check before recursing
<strong>Pruning:</strong> Essential!
<strong>Tree:</strong> Build row by row - each level = one queen placement</p>
<pre><code class="language-python">def solveNQueens(n):
    result = []
    board = [-1] * n

    def is_valid(row, col):
        # Check constraints against all previous rows
        for r in range(row):
            if board[r] == col or abs(row - r) == abs(col - board[r]):
                return False
        return True

    def backtrack(row):
        # Parameters:
        # - row: Current row being filled (level in tree)
        # - board: Array storing queen positions
        
        if row == n:
            result.append(construct_board(board))
            return

        # Try each column in current row
        for col in range(n):
            if is_valid(row, col):  # Constraint check!
                board[row] = col
                backtrack(row + 1)
                board[row] = -1

    backtrack(0)
    return result
</code></pre>
<p><strong>Parameters to carry:</strong></p>
<ul>
<li><code>row</code>: Current row (tree level)</li>
<li><code>board</code>: Queen positions for constraint checking</li>
</ul>
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
            title: '🎉 Module 11 Complete!',
            content: `<h1>🎉 Module 11 Complete!</h1>
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
<hr>
<h2>🎯 Practice More Backtracking Problems</h2>
<p>Want to solidify your backtracking skills? Practice with more problems in Smart Practice!</p>
<p><strong>Available Problems:</strong></p>
<ul>
<li>Subsets &amp; Subsets II</li>
<li>Permutations &amp; Permutations II  </li>
<li>Combinations &amp; Combination Sum</li>
<li>N-Queens &amp; N-Queens II</li>
<li>Word Search &amp; Word Search II</li>
<li>Sudoku Solver</li>
<li>Palindrome Partitioning</li>
<li>And more!</li>
</ul>
<p><strong>Ready to practice?</strong> Click the button below to go to Smart Practice with backtracking problems pre-selected! 🚀</p>
`,
            estimatedReadTime: 180,
            autoMarkComplete: false,
        },
    
        ...module11BacktrackingLessonSmartPracticeExercises,
    ].filter(Boolean) as LessonSection[],
};
