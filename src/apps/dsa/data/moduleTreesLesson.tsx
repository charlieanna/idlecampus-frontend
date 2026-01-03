import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { module6TreesLessonSmartPracticeExercises } from './exercises/moduleTreesLessonSmartPracticeExercises';

// Helper function to find exercise by ID
const getExercise = (id: string) => {
    const exercise = module6TreesLessonSmartPracticeExercises.find(ex => ex.id === id);
    if (!exercise) {
        throw new Error(`Exercise not found: ${id}`);
    }
    return exercise;
};

export const module6TreesLesson: ProgressiveLesson = {
  id: 'trees-traversals',
    title: 'Module: Trees & Tree Traversals',
    description: 'Master tree data structures, DFS/BFS traversals, and binary search trees',
    unlockMode: 'sequential',
    sections: [
        // SECTION: DFS Traversals
        {
            type: 'reading',
            id: 'dfs-traversals',
            title: 'DFS Traversals: Preorder, Inorder, Postorder',
            content: `<h1>DFS Traversals 🔍</h1>
<h2>The Three Orders</h2>
<p>All use recursion naturally, visiting nodes in different orders.</p>
<hr>
<h2>1. Preorder (Root → Left → Right)</h2>
<p><strong>Visit root BEFORE children</strong></p>
<pre><code class="language-python">def preorder(root):
    if not root:
        return []

    result = []
    result.append(root.val)           # Root
    result.extend(preorder(root.left))   # Left
    result.extend(preorder(root.right))  # Right
    return result
</code></pre>
<p><strong>Use cases:</strong></p>
<ul>
<li>Copy a tree</li>
<li>Create prefix expressions</li>
<li>Serialize tree structure</li>
</ul>
<p><strong>Example:</strong></p>
<pre><code>    1
   / \
  2   3
 / \
4   5

Preorder: [1, 2, 4, 5, 3]
</code></pre>
<hr>
<h2>2. Inorder (Left → Root → Right)</h2>
<p><strong>Visit root BETWEEN children</strong></p>
<pre><code class="language-python">def inorder(root):
    if not root:
        return []

    result = []
    result.extend(inorder(root.left))   # Left
    result.append(root.val)           # Root
    result.extend(inorder(root.right))  # Right
    return result
</code></pre>
<p><strong>Critical for BSTs: Gives sorted order!</strong></p>
<p><strong>Example:</strong></p>
<pre><code>    4
   / \
  2   6
 / \ / \
1  3 5  7

Inorder: [1, 2, 3, 4, 5, 6, 7] ← Sorted!
</code></pre>
<hr>
<h2>3. Postorder (Left → Right → Root)</h2>
<p><strong>Visit root AFTER children</strong></p>
<pre><code class="language-python">def postorder(root):
    if not root:
        return []

    result = []
    result.extend(postorder(root.left))   # Left
    result.extend(postorder(root.right))  # Right
    result.append(root.val)            # Root
    return result
</code></pre>
<p><strong>Use cases:</strong></p>
<ul>
<li>Delete a tree (delete children first!)</li>
<li>Postfix expressions</li>
<li>Calculate directory sizes</li>
</ul>
<p><strong>Example:</strong></p>
<pre><code>    1
   / \
  2   3
 / \
4   5

Postorder: [4, 5, 2, 3, 1]
</code></pre>
<hr>
<h2>Iterative Approach (Stack-Based)</h2>
<p><strong>Iterative Preorder:</strong></p>
<pre><code class="language-python">def preorder_iterative(root):
    if not root:
        return []

    result = []
    stack = [root]

    while stack:
        node = stack.pop()
        result.append(node.val)

        # Push right first (so left is processed first)
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)

    return result
</code></pre>
<p><strong>Time:</strong> O(n) - visit each node once
<strong>Space:</strong> O(h) - recursion stack depth = tree height</p>
<hr>
<h2>Pattern Recognition</h2>
<p><strong>Need nodes in sorted order (BST)?</strong> → Inorder
<strong>Need to copy/serialize tree?</strong> → Preorder
<strong>Need to delete tree or calculate from leaves up?</strong> → Postorder</p>
`,
            estimatedReadTime: 300,
            autoMarkComplete: false,
        },

        // DFS Exercises
        getExercise('exercise-max-depth'),
        getExercise('exercise-min-depth'),
        getExercise('exercise-inorder-traversal'),

        // SECTION: BFS and Level Order
        {
            type: 'reading',
            id: 'bfs-level-order',
            title: 'BFS: Level-Order Traversal',
            content: `<h1>BFS: Level-Order Traversal 📊</h1>
<h2>The Core Idea</h2>
<p>Visit all nodes at depth d before visiting nodes at depth d+1.</p>
<p><strong>Use a queue!</strong> (FIFO: First In, First Out)</p>
<hr>
<h2>Basic Level-Order Traversal</h2>
<pre><code class="language-python">from collections import deque

def level_order(root):
    if not root:
        return []

    result = []
    queue = deque([root])

    while queue:
        node = queue.popleft()
        result.append(node.val)

        # Add children to queue
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)

    return result
</code></pre>
<p><strong>Example:</strong></p>
<pre><code>    1
   / \
  2   3
 / \ / \
4  5 6  7

Level-order: [1, 2, 3, 4, 5, 6, 7]
</code></pre>
<hr>
<h2>Level-by-Level (with sublists)</h2>
<p>Often want results grouped by level:</p>
<pre><code class="language-python">def level_order_grouped(root):
    if not root:
        return []

    result = []
    queue = deque([root])

    while queue:
        level_size = len(queue)
        level = []

        # Process all nodes at current level
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)

            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        result.append(level)

    return result
</code></pre>
<p><strong>Result:</strong> <code>[[1], [2, 3], [4, 5, 6, 7]]</code> ← Grouped by level!</p>
<hr>
<h2>Why BFS Uses a Queue</h2>
<p><strong>DFS uses stack</strong> (LIFO): Go deep first
<strong>BFS uses queue</strong> (FIFO): Go wide first</p>
<pre><code>Queue Processing:
Initial: [1]
Level 0: Process 1, add [2, 3]
Level 1: Process 2, add [4, 5], then process 3, add [6, 7]
Level 2: Process 4, 5, 6, 7
</code></pre>
<hr>
<h2>Common BFS Applications</h2>
<h3>1. Find Tree Depth</h3>
<pre><code class="language-python">def max_depth(root):
    if not root:
        return 0

    depth = 0
    queue = deque([root])

    while queue:
        depth += 1
        for _ in range(len(queue)):
            node = queue.popleft()
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

    return depth
</code></pre>
<h3>2. Right Side View</h3>
<pre><code class="language-python">def right_side_view(root):
    if not root:
        return []

    result = []
    queue = deque([root])

    while queue:
        level_size = len(queue)
        for i in range(level_size):
            node = queue.popleft()
            # Last node at this level
            if i == level_size - 1:
                result.append(node.val)

            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

    return result
</code></pre>
<hr>
<h2>DFS vs BFS</h2>
<table>
<thead>
<tr>
<th>Aspect</th>
<th>DFS</th>
<th>BFS</th>
</tr>
</thead>
<tbody><tr>
<td>Data Structure</td>
<td>Stack (recursion)</td>
<td>Queue</td>
</tr>
<tr>
<td>Space</td>
<td>O(h) height</td>
<td>O(w) width</td>
</tr>
<tr>
<td>Best for</td>
<td>Path finding, tree traversals</td>
<td>Shortest path, level problems</td>
</tr>
<tr>
<td>Implementation</td>
<td>Simpler (recursive)</td>
<td>Slightly more code</td>
</tr>
</tbody></table>
<hr>
<h2>Pattern Recognition</h2>
<p><strong>Need level-by-level processing?</strong> → BFS
<strong>Need shortest path in tree?</strong> → BFS
<strong>Need right/left view?</strong> → BFS
<strong>Need sorted values (BST)?</strong> → DFS (inorder)</p>
`,
            estimatedReadTime: 300,
            autoMarkComplete: false,
        },

        // BFS Exercise
        getExercise('exercise-level-order'),

        // SECTION: Binary Search Trees
        {
            type: 'reading',
            id: 'binary-search-trees',
            title: 'Binary Search Trees',
            content: `<h1>Binary Search Trees 🎯</h1>
<h2>The BST Property</h2>
<p><strong>For every node:</strong></p>
<ul>
<li>All values in <strong>left subtree</strong> &lt; node.val</li>
<li>All values in <strong>right subtree</strong> &gt; node.val</li>
</ul>
<p>This enables O(log n) search in balanced trees!</p>
<hr>
<h2>Search Operation</h2>
<pre><code class="language-python">def search_bst(root, target):
    if not root:
        return None

    if target == root.val:
        return root
    elif target &lt; root.val:
        return search_bst(root.left, target)
    else:
        return search_bst(root.right, target)
</code></pre>
<p><strong>Time:</strong> O(h) where h = height</p>
<ul>
<li>Balanced tree: O(log n)</li>
<li>Skewed tree: O(n)</li>
</ul>
<hr>
<h2>Insert Operation</h2>
<pre><code class="language-python">def insert_bst(root, val):
    if not root:
        return TreeNode(val)

    if val &lt; root.val:
        root.left = insert_bst(root.left, val)
    else:
        root.right = insert_bst(root.right, val)

    return root
</code></pre>
<p><strong>Always insert at leaf position!</strong></p>
<hr>
<h2>Validate BST (Tricky!)</h2>
<p><strong>Wrong approach:</strong></p>
<pre><code class="language-python"># This only checks immediate children!
def is_valid_bst_WRONG(root):
    if not root:
        return True
    if root.left and root.left.val &gt;= root.val:
        return False
    if root.right and root.right.val &lt;= root.val:
        return False
    return is_valid_bst_WRONG(root.left) and is_valid_bst_WRONG(root.right)
</code></pre>
<p><strong>Problem:</strong> Doesn&#39;t check ALL left subtree &lt; root &lt; ALL right subtree!</p>
<p><strong>Correct approach: Track valid range</strong></p>
<pre><code class="language-python">def is_valid_bst(root, min_val=float(&#39;-inf&#39;), max_val=float(&#39;inf&#39;)):
    if not root:
        return True

    # Current node must be in range
    if not (min_val &lt; root.val &lt; max_val):
        return False

    # Left subtree: all values &lt; root.val
    # Right subtree: all values &gt; root.val
    return (is_valid_bst(root.left, min_val, root.val) and
            is_valid_bst(root.right, root.val, max_val))
</code></pre>
<p><strong>Example of what naive check misses:</strong></p>
<pre><code>    5
   / \
  1   6
     / \
    4   7

Node 4 is &lt; its parent 6 ✓
BUT: Node 4 is &lt; root 5 ✗ (should be in right subtree!)
Not a valid BST!
</code></pre>
<hr>
<h2>Finding Min/Max</h2>
<pre><code class="language-python">def find_min(root):
    # Minimum is leftmost node
    current = root
    while current.left:
        current = current.left
    return current.val

def find_max(root):
    # Maximum is rightmost node
    current = root
    while current.right:
        current = current.right
    return current.val
</code></pre>
<hr>
<h2>BST from Sorted Array</h2>
<pre><code class="language-python">def sorted_array_to_bst(nums):
    if not nums:
        return None

    # Middle element becomes root
    mid = len(nums) // 2
    root = TreeNode(nums[mid])

    # Recursively build left and right subtrees
    root.left = sorted_array_to_bst(nums[:mid])
    root.right = sorted_array_to_bst(nums[mid+1:])

    return root
</code></pre>
<p><strong>Produces balanced BST!</strong></p>
<hr>
<h2>Pattern Recognition</h2>
<p><strong>See &quot;Binary Search Tree&quot;?</strong> → Think about BST property
<strong>Need to validate BST?</strong> → Track min/max ranges
<strong>Given sorted array?</strong> → Use middle element for balanced BST
<strong>Need sorted output?</strong> → Inorder traversal</p>
`,
            estimatedReadTime: 300,
            autoMarkComplete: false,
        },

        // BST Exercises
        getExercise('exercise-validate-bst'),
        getExercise('exercise-construct-bst-preorder'),
        getExercise('exercise-serialize-deserialize-bst'),

        // SECTION: Tree Properties
        {
            type: 'reading',
            id: 'tree-properties',
            title: 'Tree Properties: Height, Diameter, Balance',
            content: `<h1>Tree Properties 📏</h1>
<h2>Height of Tree</h2>
<p><strong>Height:</strong> Longest path from root to any leaf</p>
<pre><code class="language-python">def max_depth(root):
    if not root:
        return 0

    left_height = max_depth(root.left)
    right_height = max_depth(root.right)

    return 1 + max(left_height, right_height)
</code></pre>
<p><strong>Time:</strong> O(n) - visit every node</p>
<hr>
<h2>Diameter of Tree</h2>
<p><strong>Diameter:</strong> Longest path between any two nodes</p>
<p><strong>Key insight:</strong> Diameter through a node = left_height + right_height</p>
<pre><code class="language-python">def diameter_of_tree(root):
    diameter = [0]  # Use list for closure

    def height(node):
        if not node:
            return 0

        left_h = height(node.left)
        right_h = height(node.right)

        # Update diameter if path through this node is longer
        diameter[0] = max(diameter[0], left_h + right_h)

        return 1 + max(left_h, right_h)

    height(root)
    return diameter[0]
</code></pre>
<p><strong>Example:</strong></p>
<pre><code>      1
     / \
    2   3
   / \
  4   5

Diameter = 3 (path: 4→2→5 or 4→2→1→3)
</code></pre>
<hr>
<h2>Balanced Tree</h2>
<p><strong>Balanced:</strong> For every node, height difference between left and right subtrees ≤ 1</p>
<pre><code class="language-python">def is_balanced(root):
    def check_height(node):
        if not node:
            return 0

        left_h = check_height(node.left)
        if left_h == -1:  # Left subtree unbalanced
            return -1

        right_h = check_height(node.right)
        if right_h == -1:  # Right subtree unbalanced
            return -1

        # Check if current node is balanced
        if abs(left_h - right_h) &gt; 1:
            return -1

        return 1 + max(left_h, right_h)

    return check_height(root) != -1
</code></pre>
<p><strong>Use -1 as sentinel for &quot;unbalanced&quot;</strong></p>
<hr>
<h2>Lowest Common Ancestor (LCA)</h2>
<p><strong>LCA:</strong> Deepest node that is ancestor of both p and q</p>
<pre><code class="language-python">def lowest_common_ancestor(root, p, q):
    if not root or root == p or root == q:
        return root

    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)

    # If both sides found nodes, root is LCA
    if left and right:
        return root

    # Return whichever side found a node
    return left if left else right
</code></pre>
<p><strong>For BST, it&#39;s simpler:</strong></p>
<pre><code class="language-python">def lca_bst(root, p, q):
    # Ensure p &lt;= q
    if p.val &gt; q.val:
        p, q = q, p

    # If current node is between p and q, it&#39;s the LCA
    if p.val &lt;= root.val &lt;= q.val:
        return root
    elif q.val &lt; root.val:
        return lca_bst(root.left, p, q)
    else:
        return lca_bst(root.right, p, q)
</code></pre>
<hr>
<h2>Complete Binary Tree</h2>
<p><strong>Complete:</strong> All levels full except possibly last, which is filled left to right</p>
<p><strong>Check if complete:</strong></p>
<pre><code class="language-python">def is_complete(root):
    if not root:
        return True

    queue = deque([root])
    saw_none = False

    while queue:
        node = queue.popleft()

        if node is None:
            saw_none = True
        else:
            # If we saw None before, tree is not complete
            if saw_none:
                return False
            queue.append(node.left)
            queue.append(node.right)

    return True
</code></pre>
<hr>
<h2>Summary of Properties</h2>
<table>
<thead>
<tr>
<th>Property</th>
<th>Definition</th>
<th>Time Complexity</th>
</tr>
</thead>
<tbody><tr>
<td>Height</td>
<td>Longest root-to-leaf path</td>
<td>O(n)</td>
</tr>
<tr>
<td>Diameter</td>
<td>Longest path between any nodes</td>
<td>O(n)</td>
</tr>
<tr>
<td>Balanced</td>
<td>Height difference ≤ 1 everywhere</td>
<td>O(n)</td>
</tr>
<tr>
<td>Complete</td>
<td>All levels full (except last, left-filled)</td>
<td>O(n)</td>
</tr>
</tbody></table>
`,
            estimatedReadTime: 300,
            autoMarkComplete: false,
        },

        // Tree Property Exercises
        getExercise('exercise-balanced-tree'),
        getExercise('exercise-construct-tree-preorder-inorder'),

        // LCA Exercises
        getExercise('exercise-lca'),
        getExercise('exercise-lca-parent'),
        getExercise('exercise-lca-parent-constant'),

        // BONUS: The Infinite Tree (after LCA exercises)
        {
            type: 'reading',
            id: 'reading-lca-infinite',
            title: 'Thought Experiment: The Infinite Tree',
            content: `<h1>Bonus: The Infinite Tree 🌌</h1>
<h2>The Problem</h2>
<p>Imagine the same setup as before (nodes have parent pointers), but the tree has an <strong>infinite number of nodes</strong>.</p>
<p>Specifically, this means:</p>
<ul>
<li>You can never reach the root (it is infinitely far away).</li>
<li>Or, the root doesn&#39;t exist (it extends infinitely upwards).</li>
</ul>
<p><strong>Question:</strong> Can you still find the LCA of two nodes?</p>
<hr>
<h2>The Answer: No... and Yes?</h2>
<h3>❌ Why the "Root Jump" Algorithm Fails</h3>
<p>Our O(1) space algorithm relied on checking <code>if node is None</code>. In an infinite tree, <code>node.parent</code> is <strong>never</strong> <code>None</code>. You would keep traversing up forever!</p>
<h3>❌ Why the HashSet Algorithm Fails</h3>
<p>You would start adding ancestors of <code>p</code> to your set... 10... 100... 1,000,000...
You&#39;d run out of memory before you ever switched to traversing <code>q</code>, because you&#39;d never hit a stopping condition (root).</p>
<h3>✅ Potential Solution: Zig-Zag (or Lock-Step)</h3>
<p>To solve this in an infinite context (assuming an intersection <em>does</em> exist at some finite distance above), you cannot process one path entirely before the other.</p>
<p>You must move <strong>interleaved</strong>:</p>
<ol>
<li>Move <code>p</code> up one step. Check if <code>p</code> is in <code>q</code>&#39;s visited path.</li>
<li>Move <code>q</code> up one step. Check if <code>q</code> is in <code>p</code>&#39;s visited path.</li>
<li>Repeat.</li>
</ol>
<p>This requires storing <strong>two</strong> growing sets of ancestors, which violates constant space.</p>
<h3>🧠 The "Real" Answer</h3>
<p>For a truly "Infinite Tree" where the root is unreachable, <strong>you typically cannot find the LCA</strong> without maintaining state (O(distance) space), because you need to know <em>when</em> you&#39;ve intersected.</p>
<p>The O(1) space "Two Pointer" trick relies specifically on the <strong>finite length</strong> of the paths to align them. Without a "root" or "end of list" acting as a synchronization barrier, the O(1) space trick falls apart!</p>
`,
            estimatedReadTime: 120,
            autoMarkComplete: true
        },

        // SECTION: Module Summary
        {
            type: 'reading',
            id: 'module6-summary',
            title: 'Module Complete!',
            content: `<h1>🎉 Module 6 Complete!</h1>
<h2>What You Mastered</h2>
<h3>Tree Fundamentals 🌳</h3>
<p>✅ Node structure and terminology
✅ Tree properties (height, depth, balance)
✅ Binary trees and their characteristics</p>
<h3>DFS Traversals 🔍</h3>
<p>✅ <strong>Preorder</strong> (Root → Left → Right) - copying, serialization
✅ <strong>Inorder</strong> (Left → Root → Right) - BST sorted output
✅ <strong>Postorder</strong> (Left → Right → Root) - deletion, calculation
✅ Recursive and iterative implementations</p>
<h3>BFS Traversal 📊</h3>
<p>✅ Level-order traversal with queue
✅ Level-by-level grouping
✅ Applications (depth, right view)
✅ Understanding DFS vs BFS tradeoffs</p>
<h3>Binary Search Trees 🎯</h3>
<p>✅ BST property and validation
✅ Search, insert operations (O(log n) avg)
✅ Min/max finding
✅ Building balanced BST from sorted array</p>
<h3>Tree Properties 📏</h3>
<p>✅ Height and diameter calculation
✅ Balance checking
✅ Lowest common ancestor
✅ Complete tree verification</p>
<hr>
<h2>Pattern Recognition Guide</h2>
<p><strong>&quot;Traverse&quot; or &quot;visit all nodes&quot;?</strong> → Choose DFS or BFS based on need</p>
<p><strong>&quot;In sorted order&quot; (BST)?</strong> → Inorder DFS</p>
<p><strong>&quot;Copy/serialize tree&quot;?</strong> → Preorder DFS</p>
<p><strong>&quot;Delete tree&quot; or &quot;calculate from bottom&quot;?</strong> → Postorder DFS</p>
<p><strong>&quot;Level by level&quot; or &quot;shortest path&quot;?</strong> → BFS</p>
<p><strong>&quot;Binary Search Tree&quot;?</strong> → Use BST property, think O(log n)</p>
<p><strong>&quot;Validate BST&quot;?</strong> → Track min/max ranges, not just parent</p>
<p><strong>&quot;Diameter/height/balanced&quot;?</strong> → Recursive DFS with state tracking</p>
<hr>
<h2>Complexity Summary</h2>
<table>
<thead>
<tr>
<th>Operation</th>
<th>Time</th>
<th>Space</th>
</tr>
</thead>
<tbody><tr>
<td>Any traversal</td>
<td>O(n)</td>
<td>O(h) for DFS, O(w) for BFS</td>
</tr>
<tr>
<td>BST search</td>
<td>O(h)</td>
<td>O(h) recursive</td>
</tr>
<tr>
<td>BST insert</td>
<td>O(h)</td>
<td>O(h) recursive</td>
</tr>
<tr>
<td>Height/diameter</td>
<td>O(n)</td>
<td>O(h)</td>
</tr>
<tr>
<td>Balance check</td>
<td>O(n)</td>
<td>O(h)</td>
</tr>
</tbody></table>
<p>h = height (O(log n) balanced, O(n) skewed)
w = max width (O(n) for complete tree)</p>
<hr>
<h2>Common Problems to Practice</h2>
<h3>DFS Problems:</h3>
<ul>
<li>Invert binary tree</li>
<li>Maximum depth</li>
<li>Same tree</li>
<li>Path sum</li>
<li>Binary tree paths</li>
<li>Sum root to leaf numbers</li>
</ul>
<h3>BFS Problems:</h3>
<ul>
<li>Binary tree level order traversal</li>
<li>Binary tree right side view</li>
<li>Average of levels</li>
<li>Binary tree zigzag level order</li>
<li>Minimum depth</li>
</ul>
<h3>BST Problems:</h3>
<ul>
<li>Validate BST</li>
<li>Kth smallest in BST</li>
<li>Two sum BST</li>
<li>Convert sorted array to BST</li>
<li>Inorder successor</li>
</ul>
<h3>Property Problems:</h3>
<ul>
<li>Balanced binary tree</li>
<li>Diameter of binary tree</li>
<li>Lowest common ancestor</li>
<li>Maximum path sum</li>
</ul>
<hr>
<h2>Next Steps</h2>
<p><strong>Module 7: Binary Search &amp; Sorting</strong> - Master binary search patterns and sorting algorithms!</p>
<p>You&#39;ll learn:</p>
<ul>
<li>Binary search fundamentals</li>
<li>Search variations (rotated array, find boundary)</li>
<li>Merge sort and quick sort</li>
<li>Time complexity analysis</li>
</ul>
<p><strong>Ready to continue?</strong> Let&#39;s go! 🚀</p>
`,
            estimatedReadTime: 240,
            autoMarkComplete: false,
        },

        // SMART PRACTICE EXERCISES - All practice problems for this module
        ...module6TreesLessonSmartPracticeExercises,
    ],
};
