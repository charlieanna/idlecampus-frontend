import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module6TreesLessonSmartPracticeExercises: ExerciseSection[] = [
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-max-depth',
            title: 'Code: Maximum Depth of Binary Tree',
            description: 'Find maximum depth of a binary tree',
            instruction: `# Maximum Depth of Binary Tree

Given a binary tree, find its maximum depth.

The maximum depth is the number of nodes along the longest path from root to leaf.

## Examples

**Example 1:**
\`\`\`
Input: root = [3, 9, 20, null, null, 15, 7]
        3
       / \\
      9  20
        /  \\
       15   7

Output: 3
\`\`\`

**Example 2:**
\`\`\`
Input: root = [2, null, 3]
    2
     \\
      3

Output: 2
\`\`\`

## Constraints
- Number of nodes in the tree is in the range [0, 10^4]
- -100 <= Node.val <= 100`,
            starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def maxDepth(root):
    # Your code here
    # Find the maximum depth of the binary tree
    pass`,
            expectedOutput: `def maxDepth(root):
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
            hints: [
                { afterAttempt: 1, text: 'Think recursively: the depth of a tree = 1 + max(depth of left, depth of right)' },
                { afterAttempt: 2, text: 'What is the depth of an empty tree?' }
            ],
            solution: {
                afterAttempt: 3,
                text: `# Optimal Solution: Recursive DFS

**Python:**
\`\`\`python
def maxDepth(root):
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))
\`\`\`

**Time Complexity:** O(n) - visit every node  
**Space Complexity:** O(h) - recursion stack depth = tree height`
            },
            targetComplexity: {
                time: "O(n)",
                space: "O(h)"
            },
            testCases: [
                // Basic examples
                {
                    'input': '[3, 9, 20, null, null, 15, 7]',
                    'expectedOutput': '3'
                },
                {
                    'input': '[1, null, 2]',
                    'expectedOutput': '2'
                },
                // B - Boundaries
                {
                    'input': '[]',
                    'expectedOutput': '0'
                },
                {
                    'input': '[1]',
                    'expectedOutput': '1'
                },
                {
                    'input': '[1, 2]',
                    'expectedOutput': '2'
                },
                // E - Edge cases (skewed trees)
                {
                    'input': '[1, 2, null, 3, null, 4]',
                    'expectedOutput': '4'
                },
                {
                    'input': '[1, null, 2, null, 3, null, 4]',
                    'expectedOutput': '4'
                },
                // D - Different shapes
                {
                    'input': '[1, 2, 3]',
                    'expectedOutput': '2'
                },
                {
                    'input': '[1, 2, 3, 4, 5, 6, 7]',
                    'expectedOutput': '3'
                },
                // T - Type variations
                {
                    'input': '[-1, -2, -3]',
                    'expectedOutput': '2'
                },
                // I - Interesting patterns
                {
                    'input': '[1, 2, 3, 4, 5]',
                    'expectedOutput': '3'
                },
                // M - Many elements
                {
                    'input': '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]',
                    'expectedOutput': '4'
                },
                // E - Extremes
                {
                    'input': '[100]',
                    'expectedOutput': '1'
                }
            ],
            solutionExplanation: `## 🔴 Brute Force Approach

**Idea:** Use BFS (level-order traversal) to count the number of levels.

\`\`\`python
def maxDepth(root):
    if not root:
        return 0

    queue = [root]
    depth = 0

    while queue:
        depth += 1
        level_size = len(queue)
        for _ in range(level_size):
            node = queue.pop(0)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

    return depth
\`\`\`

**Complexity:**
- Time: O(n) - visit every node
- Space: O(w) - queue stores up to w nodes (tree width)

---

## 🟡 Bottleneck Analysis

**What's inefficient?**
- BFS requires a queue with O(w) space
- For a complete binary tree, width can be n/2
- We're doing more work than necessary - we don't need to track all nodes at each level

**Key insight:** We only need to track the depth, not store entire levels!

---

## 🟢 Optimized Approach: Recursive DFS

**Idea:** Use recursion - depth of tree = 1 + max(left depth, right depth)

\`\`\`python
def maxDepth(root):
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))
\`\`\`

**Why it's better:**
- Cleaner, more concise code
- O(h) space instead of O(w)
- For balanced trees: O(log n) vs O(n/2)

---

## ✅ Final Complexity

- **Time:** O(n) - visit each node once
- **Space:** O(h) - recursion stack depth
  - Best case (balanced): O(log n)
  - Worst case (skewed): O(n)

---

## 🎯 Pattern Learned

**Recursive DFS for tree depth/height:**
- Base case: null node returns 0
- Recursive case: 1 + max(left, right)
- This pattern applies to: max depth, min depth, diameter, balanced tree check`,
            complexityQuizPlacement: 'after',
            requiredForProgress: false
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-min-depth',
            title: 'Code: Minimum Depth of Binary Tree',
            description: 'Find minimum depth of a binary tree',
            requiredForProgress: true,
            instruction: `# Minimum Depth of Binary Tree (LeetCode 111)

Given a binary tree, find its minimum depth.

The minimum depth is the number of nodes along the shortest path from the root node down to the nearest **leaf** node.

**Important:** A leaf is a node with no children!

## Examples

**Example 1:**
\`\`\`
Input: root = [3, 9, 20, null, null, 15, 7]
        3
       / \\
      9  20
        /  \\
       15   7

Output: 2 (path: 3 → 9)
\`\`\`

**Example 2:**
\`\`\`
Input: root = [2, null, 3, null, 4, null, 5, null, 6]
    2
     \\
      3
       \\
        4
         \\
          5
           \\
            6

Output: 5 (not 1! must reach a LEAF)
\`\`\`

## Key Gotcha
Unlike max depth, you can't just do \`min(left, right)\`!

If a node has only one child, the side with no child returns 0, but that's NOT a valid path to a leaf!

## Constraints
- Number of nodes in the tree is in the range [0, 10^5]
- -1000 <= Node.val <= 1000`,
            starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def minDepth(root):
    # Be careful: must reach a LEAF node!
    pass`,
            expectedOutput: `def minDepth(root):
    if not root:
        return 0
    
    # If one child is missing, must go through the other
    if not root.left:
        return 1 + minDepth(root.right)
    if not root.right:
        return 1 + minDepth(root.left)
    
    # Both children exist: take minimum
    return 1 + min(minDepth(root.left), minDepth(root.right))`,
            hints: [
                { afterAttempt: 1, text: 'What if a node has only one child? The missing child isn\'t a leaf!' },
                { afterAttempt: 2, text: 'Handle three cases: no left child, no right child, both children exist.' },
                { afterAttempt: 3, text: 'BFS also works well here - first leaf you encounter gives min depth!' }
            ],
            solution: {
                afterAttempt: 4,
                text: `## Solution - O(n) time, O(h) space

\`\`\`python
def minDepth(root):
    if not root:
        return 0
    if not root.left:
        return 1 + minDepth(root.right)
    if not root.right:
        return 1 + minDepth(root.left)
    return 1 + min(minDepth(root.left), minDepth(root.right))
\`\`\`

**Key insight:** A missing child doesn't give a valid path to a leaf!`
            },
            targetComplexity: { time: 'O(n)', space: 'O(h)' },
            testCases: [
                { input: '[3, 9, 20, null, null, 15, 7]', expectedOutput: '2' },
                { input: '[2, null, 3, null, 4, null, 5, null, 6]', expectedOutput: '5' },
                { input: '[]', expectedOutput: '0' },
                { input: '[1]', expectedOutput: '1' },
                { input: '[1, 2]', expectedOutput: '2' }
            ],
            solutionExplanation: `## The Trap: Min ≠ Max

You might think: "Max depth uses \`max(left, right)\`, so min depth uses \`min(left, right)\`!"

\`\`\`python
# WRONG!
def minDepth(root):
    if not root:
        return 0
    return 1 + min(minDepth(root.left), minDepth(root.right))
\`\`\`

**Problem:** For this tree:
\`\`\`
    2
     \\
      3
\`\`\`

- \`minDepth(root.left)\` returns 0 (no left child)
- \`minDepth(root.right)\` returns 1
- \`min(0, 1) = 0\`
- Returns 1 + 0 = 1 ❌

But the answer should be **2** (2 → 3), because 3 is the only leaf!

---

## The Fix: Handle Missing Children

A missing child (null) is NOT a leaf. We must go through the existing child.

\`\`\`python
def minDepth(root):
    if not root:
        return 0
    
    # Only right child exists → must go right
    if not root.left:
        return 1 + minDepth(root.right)
    
    # Only left child exists → must go left
    if not root.right:
        return 1 + minDepth(root.left)
    
    # Both children exist → take minimum
    return 1 + min(minDepth(root.left), minDepth(root.right))
\`\`\`

---

## Alternative: BFS Approach

BFS naturally finds the shallowest level first:

\`\`\`python
from collections import deque

def minDepth(root):
    if not root:
        return 0
    
    queue = deque([(root, 1)])
    
    while queue:
        node, depth = queue.popleft()
        
        # First leaf we find is at minimum depth!
        if not node.left and not node.right:
            return depth
        
        if node.left:
            queue.append((node.left, depth + 1))
        if node.right:
            queue.append((node.right, depth + 1))
\`\`\`

BFS can be more efficient for very unbalanced trees where the leaf is near the top!

---

## The Pattern

**Min Depth vs Max Depth:**
- Max depth: take max of children, null returns 0
- Min depth: must handle missing children specially (they don't lead to leaves)`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-balanced-tree',
            title: 'Code: Balanced Binary Tree',
            description: 'Check if a binary tree is height-balanced',
            requiredForProgress: true,
            instruction: `# Balanced Binary Tree (LeetCode 110)

Given a binary tree, determine if it is **height-balanced**.

A height-balanced binary tree is a tree in which the depth of the two subtrees of every node never differs by more than one.

## Examples

**Example 1:**
\`\`\`
Input: root = [3, 9, 20, null, null, 15, 7]
        3
       / \\
      9  20
        /  \\
       15   7

Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: root = [1, 2, 2, 3, 3, null, null, 4, 4]
           1
          / \\
         2   2
        / \\
       3   3
      / \\
     4   4

Output: false (left subtree height is 3, right is 1)
\`\`\`

## Constraints
- Number of nodes in the tree is in the range [0, 5000]
- -10^4 <= Node.val <= 10^4`,
            starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def isBalanced(root):
    # Check every node: |height(left) - height(right)| <= 1
    pass`,
            expectedOutput: `def isBalanced(root):
    def check(node):
        if not node:
            return 0  # height of empty tree
        
        left_height = check(node.left)
        if left_height == -1:
            return -1  # left subtree is unbalanced
        
        right_height = check(node.right)
        if right_height == -1:
            return -1  # right subtree is unbalanced
        
        if abs(left_height - right_height) > 1:
            return -1  # current node is unbalanced
        
        return 1 + max(left_height, right_height)
    
    return check(root) != -1`,
            hints: [
                { afterAttempt: 1, text: 'Brute force: for each node, compute heights of left and right subtrees. But this is O(n²)!' },
                { afterAttempt: 2, text: 'Can you check balance while computing height in the same pass?' },
                { afterAttempt: 3, text: 'Use a sentinel value like -1 to indicate "unbalanced" and propagate it up.' }
            ],
            solution: {
                afterAttempt: 4,
                text: `## Solution - O(n) time, O(h) space

\`\`\`python
def isBalanced(root):
    def check(node):
        if not node:
            return 0
        left = check(node.left)
        if left == -1:
            return -1
        right = check(node.right)
        if right == -1:
            return -1
        if abs(left - right) > 1:
            return -1
        return 1 + max(left, right)
    
    return check(root) != -1
\`\`\`

**Key insight:** Return -1 to signal "unbalanced" early.`
            },
            targetComplexity: { time: 'O(n)', space: 'O(h)' },
            testCases: [
                { input: '[3, 9, 20, null, null, 15, 7]', expectedOutput: 'True' },
                { input: '[1, 2, 2, 3, 3, null, null, 4, 4]', expectedOutput: 'False' },
                { input: '[]', expectedOutput: 'True' },
                { input: '[1]', expectedOutput: 'True' },
                { input: '[1, 2, 2, 3, null, null, 3, 4, null, null, 4]', expectedOutput: 'False' }
            ],
            solutionExplanation: `## The Brute Force Approach

For each node, compute the heights of left and right subtrees:

\`\`\`python
def isBalanced(root):
    def height(node):
        if not node:
            return 0
        return 1 + max(height(node.left), height(node.right))
    
    if not root:
        return True
    
    # Check current node
    if abs(height(root.left) - height(root.right)) > 1:
        return False
    
    # Check subtrees
    return isBalanced(root.left) and isBalanced(root.right)
\`\`\`

**Time: O(n²)** – For each of the n nodes, we compute height which is O(n).

---

## The Bottleneck

We're recomputing heights! When we check the root, we compute heights of all nodes. When we check root.left, we recompute heights again!

\`\`\`
isBalanced(root)
├── height(root.left)    # visits all left nodes
├── height(root.right)   # visits all right nodes
├── isBalanced(root.left)
│   ├── height(left.left)  # recomputes!
│   └── ...
\`\`\`

---

## The Optimization: Compute Height AND Check Balance Together

Return height if balanced, or -1 if unbalanced:

\`\`\`python
def isBalanced(root):
    def check(node):
        if not node:
            return 0  # empty tree has height 0
        
        left_height = check(node.left)
        if left_height == -1:
            return -1  # propagate failure up
        
        right_height = check(node.right)
        if right_height == -1:
            return -1  # propagate failure up
        
        # Check if current node is balanced
        if abs(left_height - right_height) > 1:
            return -1  # unbalanced!
        
        # Return actual height
        return 1 + max(left_height, right_height)
    
    return check(root) != -1
\`\`\`

**Time: O(n)** – Each node visited exactly once!

---

## The Pattern

**"Compute X while checking Y"** → Combine into single traversal

Using sentinel values (-1) to signal failure is a powerful technique that avoids separate checks.

This pattern applies to:
- Checking if tree is BST while computing bounds
- Finding diameter while computing heights
- Checking symmetric while comparing subtrees`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-construct-tree-preorder-inorder',
            title: 'Code: Construct Tree from Preorder and Inorder',
            description: 'Build a binary tree from preorder and inorder traversal arrays',
            requiredForProgress: true,
            instruction: `# Construct Binary Tree from Preorder and Inorder Traversal (LeetCode 105)

Given two integer arrays \`preorder\` and \`inorder\` where:
- \`preorder\` is the preorder traversal of a binary tree
- \`inorder\` is the inorder traversal of the same tree

Construct and return the binary tree.

## Examples

**Example 1:**
\`\`\`
Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
Output: [3,9,20,null,null,15,7]

Tree:
    3
   / \\
  9  20
    /  \\
   15   7
\`\`\`

**Example 2:**
\`\`\`
Input: preorder = [-1], inorder = [-1]
Output: [-1]
\`\`\`

## Key Insights

**Preorder:** Root → Left → Right
- First element is always the root!

**Inorder:** Left → Root → Right
- Elements left of root belong to left subtree
- Elements right of root belong to right subtree

## Constraints
- 1 <= preorder.length <= 3000
- inorder.length == preorder.length
- All values are unique
- Each value of inorder also appears in preorder`,
            starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def buildTree(preorder, inorder):
    # preorder[0] is root, inorder tells us left/right split
    pass`,
            expectedOutput: `def buildTree(preorder, inorder):
    if not preorder or not inorder:
        return None
    
    # First element of preorder is the root
    root_val = preorder[0]
    root = TreeNode(root_val)
    
    # Find root in inorder to split left/right
    mid = inorder.index(root_val)
    
    # Recursively build subtrees
    root.left = buildTree(preorder[1:mid+1], inorder[:mid])
    root.right = buildTree(preorder[mid+1:], inorder[mid+1:])
    
    return root`,
            hints: [
                { afterAttempt: 1, text: 'preorder[0] is always the root. Use it to split inorder into left and right subtrees.' },
                { afterAttempt: 2, text: 'If root is at index mid in inorder, left subtree has mid elements, right has the rest.' },
                { afterAttempt: 3, text: 'Optimization: use a hash map for O(1) lookup of root position in inorder.' }
            ],
            solution: {
                afterAttempt: 4,
                text: `## Solution - O(n) time with hashmap, O(n) space

\`\`\`python
def buildTree(preorder, inorder):
    inorder_map = {val: i for i, val in enumerate(inorder)}
    
    def build(pre_start, pre_end, in_start, in_end):
        if pre_start > pre_end:
            return None
        
        root_val = preorder[pre_start]
        root = TreeNode(root_val)
        mid = inorder_map[root_val]
        left_size = mid - in_start
        
        root.left = build(pre_start + 1, pre_start + left_size, in_start, mid - 1)
        root.right = build(pre_start + left_size + 1, pre_end, mid + 1, in_end)
        
        return root
    
    return build(0, len(preorder) - 1, 0, len(inorder) - 1)
\`\`\`

**Key insight:** Use indices instead of slicing for O(n) total time.`
            },
            targetComplexity: { time: 'O(n)', space: 'O(n)' },
            testCases: [
                { input: '[3,9,20,15,7], [9,3,15,20,7]', expectedOutput: '[3,9,20,null,null,15,7]' },
                { input: '[-1], [-1]', expectedOutput: '[-1]' },
                { input: '[1,2,3], [2,1,3]', expectedOutput: '[1,2,3]' },
                { input: '[1,2], [2,1]', expectedOutput: '[1,2]' }
            ],
            solutionExplanation: `## Understanding the Traversals

**Preorder (Root → Left → Right):**
\`\`\`
[3, 9, 20, 15, 7]
 ↑
 root is always first!
\`\`\`

**Inorder (Left → Root → Right):**
\`\`\`
[9, 3, 15, 20, 7]
 ↑  ↑   ↑
 |  |   right subtree
 |  root
 left subtree
\`\`\`

---

## The Algorithm

1. **Get root:** First element of preorder
2. **Find root in inorder:** Elements to the left = left subtree, right = right subtree
3. **Recurse:** Build left and right subtrees

\`\`\`python
def buildTree(preorder, inorder):
    if not preorder:
        return None
    
    root_val = preorder[0]
    root = TreeNode(root_val)
    
    mid = inorder.index(root_val)  # O(n) lookup!
    
    # Left subtree: mid elements
    root.left = buildTree(preorder[1:mid+1], inorder[:mid])
    # Right subtree: remaining elements
    root.right = buildTree(preorder[mid+1:], inorder[mid+1:])
    
    return root
\`\`\`

---

## Visual Walkthrough

\`\`\`
preorder = [3, 9, 20, 15, 7]
inorder  = [9, 3, 15, 20, 7]

Step 1: root = 3, mid = 1
        left_preorder = [9], left_inorder = [9]
        right_preorder = [20, 15, 7], right_inorder = [15, 20, 7]

Step 2 (left): root = 9, no children
        
Step 3 (right): root = 20, mid = 1
        left_preorder = [15], left_inorder = [15]
        right_preorder = [7], right_inorder = [7]

Result:
    3
   / \\
  9  20
    /  \\
   15   7
\`\`\`

---

## The Bottleneck

The naive solution is O(n²) because:
- \`inorder.index(root_val)\` is O(n)
- Array slicing creates new arrays

---

## Optimized Solution: Use Hash Map + Indices

\`\`\`python
def buildTree(preorder, inorder):
    # O(1) lookup for root position
    inorder_map = {val: i for i, val in enumerate(inorder)}
    
    def build(pre_start, pre_end, in_start, in_end):
        if pre_start > pre_end:
            return None
        
        root_val = preorder[pre_start]
        root = TreeNode(root_val)
        
        mid = inorder_map[root_val]
        left_size = mid - in_start
        
        root.left = build(pre_start + 1, pre_start + left_size, 
                          in_start, mid - 1)
        root.right = build(pre_start + left_size + 1, pre_end, 
                           mid + 1, in_end)
        
        return root
    
    return build(0, len(preorder) - 1, 0, len(inorder) - 1)
\`\`\`

**Now O(n)!** Each node processed once, O(1) lookups.

---

## The Pattern

**Tree reconstruction** from traversals requires:
1. One traversal that tells us the root (preorder/postorder)
2. One traversal that tells us the left/right split (inorder)

This same pattern applies to:
- Construct from Postorder + Inorder
- Verify Preorder Sequence in BST`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-inorder-traversal',
            title: 'Code: Binary Tree Inorder Traversal',
            description: 'Return inorder traversal of binary tree',
            instruction: `# Binary Tree Inorder Traversal

Given the root of a binary tree, return the inorder traversal of its nodes\' values.

**Inorder:** Left → Root → Right

## Examples

**Example 1:**
\`\`\`
Input: root = [1, null, 2, 3]
    1
     \\
      2
     /
    3

Output: [1, 3, 2]
\`\`\`

**Example 2:**
\`\`\`
Input: root = []
Output: []
\`\`\`

## Critical Insight
For a **Binary Search Tree**, inorder traversal gives values in **sorted order**!

## Constraints
- Number of nodes in the tree is in the range [0, 100]
- -100 <= Node.val <= 100`,
            starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorderTraversal(root):
    # Your code here
    # Return the inorder traversal of the tree nodes' values
    pass`,
            expectedOutput: `def inorderTraversal(root):
    if not root:
        return []
    return inorderTraversal(root.left) + [root.val] + inorderTraversal(root.right)`,
            hints: [
                { afterAttempt: 1, text: 'Process left subtree first, then root, then right subtree' },
                { afterAttempt: 2, text: 'Remember: for BST, inorder gives sorted values!' }
            ],
            solution: {
                afterAttempt: 3,
                text: `# Optimal Solution: Recursive Inorder

**Python:**
\`\`\`python
def inorderTraversal(root):
    if not root:
        return []
    return inorderTraversal(root.left) + [root.val] + inorderTraversal(root.right)
\`\`\`

**Time Complexity:** O(n) - visit every node  
**Space Complexity:** O(h) - recursion stack`
            },
            targetComplexity: {
                time: "O(n)",
                space: "O(h)"
            },
            testCases: [
                // Basic examples
                {
                    'input': '[1, null, 2, 3]',
                    'expectedOutput': '[1, 3, 2]'
                },
                {
                    'input': '[]',
                    'expectedOutput': '[]'
                },
                // B - Boundaries
                {
                    'input': '[1]',
                    'expectedOutput': '[1]'
                },
                {
                    'input': '[1, 2]',
                    'expectedOutput': '[2, 1]'
                },
                {
                    'input': '[1, null, 2]',
                    'expectedOutput': '[1, 2]'
                },
                // E - Edge cases (complete tree)
                {
                    'input': '[1, 2, 3]',
                    'expectedOutput': '[2, 1, 3]'
                },
                {
                    'input': '[1, 2, 3, 4, 5]',
                    'expectedOutput': '[4, 2, 5, 1, 3]'
                },
                // D - Different shapes
                {
                    'input': '[1, 2, 3, 4, 5, 6, 7]',
                    'expectedOutput': '[4, 2, 5, 1, 6, 3, 7]'
                },
                // T - Type variations
                {
                    'input': '[-1, -2, -3]',
                    'expectedOutput': '[-2, -1, -3]'
                },
                // I - Interesting patterns (BST inorder = sorted)
                {
                    'input': '[4, 2, 6, 1, 3, 5, 7]',
                    'expectedOutput': '[1, 2, 3, 4, 5, 6, 7]'
                },
                // M - Many elements
                {
                    'input': '[5, 3, 7, 2, 4, 6, 8]',
                    'expectedOutput': '[2, 3, 4, 5, 6, 7, 8]'
                },
                // E - Extremes (left skewed)
                {
                    'input': '[3, 2, null, 1]',
                    'expectedOutput': '[1, 2, 3]'
                }
            ],
            solutionExplanation: `## 🔴 Brute Force Approach

**Idea:** Use iterative approach with explicit stack to simulate recursion.

\`\`\`python
def inorderTraversal(root):
    result = []
    stack = []
    current = root

    while current or stack:
        # Go to leftmost node
        while current:
            stack.append(current)
            current = current.left

        # Process node
        current = stack.pop()
        result.append(current.val)

        # Move to right subtree
        current = current.right

    return result
\`\`\`

**Complexity:**
- Time: O(n) - visit every node
- Space: O(h) - explicit stack

---

## 🟡 Bottleneck Analysis

**What's inefficient?**
- Explicit stack management is verbose
- Need to manually track current pointer
- More complex logic than necessary

**Key insight:** Recursion naturally handles the stack for us!

---

## 🟢 Optimized Approach: Recursive Inorder

**Idea:** Left → Root → Right using clean recursion.

\`\`\`python
def inorderTraversal(root):
    if not root:
        return []
    return inorderTraversal(root.left) + [root.val] + inorderTraversal(root.right)
\`\`\`

**Why it's better:**
- Clean, elegant 3-line solution
- No manual stack management
- Easy to understand and maintain

---

## ✅ Final Complexity

- **Time:** O(n) - visit each node once
- **Space:** O(h) - recursion stack
  - Average: O(log n) for balanced tree
  - Worst: O(n) for skewed tree

---

## 🎯 Pattern Learned

**Inorder Traversal Pattern (Left-Root-Right):**
- For BST: produces sorted values!
- Use for: BST validation, kth smallest element, range queries
- Template: \`recurse(left) + [root] + recurse(right)\`
- Critical property: inorder of BST = sorted array`,
            complexityQuizPlacement: 'after',
            requiredForProgress: false
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-level-order',
            title: 'Code: Binary Tree Level Order Traversal',
            description: 'Return level order traversal of binary tree',
            instruction: `# Binary Tree Level Order Traversal

Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).

## Examples

**Example 1:**
\`\`\`
Input: root = [3, 9, 20, null, null, 15, 7]
    3
   / \\
  9  20
    /  \\
   15   7

Output: [[3], [9, 20], [15, 7]]
\`\`\`

**Example 2:**
\`\`\`
Input: root = [1]
Output: [[1]]
\`\`\`

**Example 3:**
\`\`\`
Input: root = []
Output: []
\`\`\`

## Key Insight
This is BFS (Breadth-First Search) - use a queue!

## Constraints
- Number of nodes in the tree is in the range [0, 2000]
- -1000 <= Node.val <= 1000`,
            starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def levelOrder(root):
    # Your code here
    # Return the level order traversal of the tree nodes' values
    pass`,
            expectedOutput: `def levelOrder(root):
    if not root:
        return []
    result = []
    queue = [root]
    while queue:
        level = []
        level_size = len(queue)
        for _ in range(level_size):
            node = queue.pop(0)
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result`,
            hints: [
                { afterAttempt: 1, text: 'Use a queue for BFS - process all nodes at current level before moving to next' },
                { afterAttempt: 2, text: 'Track level size before processing to know when a level ends' }
            ],
            solution: {
                afterAttempt: 3,
                text: `# Optimal Solution: BFS with Queue

**Python:**
\`\`\`python
from collections import deque

def levelOrder(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level = []
        level_size = len(queue)
        
        # Process all nodes at current level
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            
            # Add children for next level
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level)
    
    return result
\`\`\`

**Time Complexity:** O(n) - visit every node once
**Space Complexity:** O(w) - maximum width of tree (queue size)`
            },
            targetComplexity: {
                time: "O(n)",
                space: "O(w)"
            },
            testCases: [
                // Basic examples
                {
                    'input': '[3, 9, 20, null, null, 15, 7]',
                    'expectedOutput': '[[3], [9, 20], [15, 7]]'
                },
                {
                    'input': '[1]',
                    'expectedOutput': '[[1]]'
                },
                {
                    'input': '[]',
                    'expectedOutput': '[]'
                },
                // B - Boundaries
                {
                    'input': '[1, 2]',
                    'expectedOutput': '[[1], [2]]'
                },
                {
                    'input': '[1, null, 2]',
                    'expectedOutput': '[[1], [2]]'
                },
                {
                    'input': '[1, 2, 3]',
                    'expectedOutput': '[[1], [2, 3]]'
                },
                // E - Edge cases (skewed)
                {
                    'input': '[1, 2, null, 3, null, 4]',
                    'expectedOutput': '[[1], [2], [3], [4]]'
                },
                {
                    'input': '[1, null, 2, null, 3]',
                    'expectedOutput': '[[1], [2], [3]]'
                },
                // D - Different shapes
                {
                    'input': '[1, 2, 3, 4, 5, 6, 7]',
                    'expectedOutput': '[[1], [2, 3], [4, 5, 6, 7]]'
                },
                // T - Type variations
                {
                    'input': '[-1, -2, -3]',
                    'expectedOutput': '[[-1], [-2, -3]]'
                },
                // I - Interesting patterns
                {
                    'input': '[1, 2, 3, 4, null, null, 5]',
                    'expectedOutput': '[[1], [2, 3], [4, 5]]'
                },
                // M - Many elements
                {
                    'input': '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]',
                    'expectedOutput': '[[1], [2, 3], [4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14, 15]]'
                },
                // E - Extremes
                {
                    'input': '[0, 0, 0]',
                    'expectedOutput': '[[0], [0, 0]]'
                }
            ],
            solutionExplanation: `## 🔴 Brute Force Approach

**Idea:** Recursively find nodes at each depth level.

\`\`\`python
def levelOrder(root):
    if not root:
        return []

    def getHeight(node):
        if not node:
            return 0
        return 1 + max(getHeight(node.left), getHeight(node.right))

    def getLevel(node, level):
        if not node:
            return []
        if level == 1:
            return [node.val]
        return getLevel(node.left, level - 1) + getLevel(node.right, level - 1)

    height = getHeight(root)
    result = []
    for i in range(1, height + 1):
        result.append(getLevel(root, i))

    return result
\`\`\`

**Complexity:**
- Time: O(n²) - for each level, traverse tree from root
- Space: O(h) - recursion depth

---

## 🟡 Bottleneck Analysis

**What's inefficient?**
- Visiting nodes multiple times (once per level)
- Computing height separately is extra work
- O(n²) time when tree is skewed

**Key insight:** We should visit each node exactly once! Use a queue for BFS.

---

## 🟢 Optimized Approach: BFS with Queue

**Idea:** Use queue to process nodes level by level in one pass.

\`\`\`python
from collections import deque

def levelOrder(root):
    if not root:
        return []

    result = []
    queue = deque([root])

    while queue:
        level = []
        level_size = len(queue)  # Capture current level size

        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)

            # Add children for next level
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        result.append(level)

    return result
\`\`\`

**Why it's better:**
- Visit each node exactly once: O(n) instead of O(n²)
- No need to compute height separately
- Natural BFS pattern with queue

---

## ✅ Final Complexity

- **Time:** O(n) - visit each node once
- **Space:** O(w) - queue size = maximum tree width
  - Complete tree: w = n/2
  - Skewed tree: w = 1

---

## 🎯 Pattern Learned

**BFS Level-Order Traversal:**
- Use queue (FIFO) for breadth-first search
- Capture level size BEFORE processing to separate levels
- Pattern: \`while queue: process current level, add next level\`
- Essential for: level-based problems, shortest path in trees, right side view`,
            complexityQuizPlacement: 'after',
            requiredForProgress: false
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-lca',
            title: 'Code: Lowest Common Ancestor of Binary Tree',
            description: 'Find deepest ancestor shared by two nodes',
            instruction: `# Lowest Common Ancestor of Binary Tree

Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.

The LCA is defined between two nodes p and q as the lowest node in the tree that has both p and q as descendants (where we allow **a node to be a descendant of itself**).

## Examples

**Example 1:**
\`\`\`
Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
        3
       / \\
      5   1
     / \\ / \\
    6  2 0  8
      / \\
     7   4

Output: 3
Explanation: LCA of 5 and 1 is 3
\`\`\`

**Example 2:**
\`\`\`
Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
        3
       / \\
      5   1
     / \\ / \\
    6  2 0  8
      / \\
     7   4

Output: 5
Explanation: LCA of 5 and 4 is 5 (node can be ancestor of itself!)
\`\`\`

## Hint
Use **postorder traversal** (process children first, then decide)!

## Constraints
- Number of nodes in tree is in range [2, 10^5]
- -10^9 <= Node.val <= 10^9
- All node values are unique`,
            starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def lowestCommonAncestor(root, p, q):
    # Your code here
    # Find the lowest common ancestor of two given nodes in the tree
    pass`,
            expectedOutput: `def lowestCommonAncestor(root, p, q):
    if not root:
        return None
    if root.val == p or root.val == q:
        return root.val
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    if left is not None and right is not None:
        return root.val
    return left if left is not None else right`,
            hints: [
                { afterAttempt: 1, text: 'Use postorder DFS: recursively search left and right first' },
                { afterAttempt: 2, text: 'If both left and right return non-null, current node is LCA' }
            ],
            solution: {
                afterAttempt: 3,
                text: `# Optimal Solution: Postorder DFS

**Python:**
\`\`\`python
def lowestCommonAncestor(root, p, q):
    if not root:
        return None
    if root.val == p or root.val == q:
        return root.val

    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)

    # Both found in different subtrees? Current node is LCA
    if left is not None and right is not None:
        return root.val

    # Otherwise return whichever is non-null
    return left if left is not None else right
\`\`\`

**Time Complexity:** O(n) - visit each node once
**Space Complexity:** O(h) - recursion stack height`
            },
            targetComplexity: {
                time: "O(n)",
                space: "O(h)"
            },
            testCases: [
                // LCA test cases use node references
                // Format: tree, p_val, q_val -> LCA node value
                {
                    'input': '[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1',
                    'expectedOutput': '3'
                },
                {
                    'input': '[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4',
                    'expectedOutput': '5'
                },
                // B - Boundaries
                {
                    'input': '[1, 2], 1, 2',
                    'expectedOutput': '1'
                },
                {
                    'input': '[1, 2, 3], 2, 3',
                    'expectedOutput': '1'
                },
                // E - Edge cases (same node)
                {
                    'input': '[1], 1, 1',
                    'expectedOutput': '1'
                },
                {
                    'input': '[1, 2, 3], 2, 2',
                    'expectedOutput': '2'
                },
                // D - Different depths
                {
                    'input': '[1, 2, 3, 4, 5], 4, 5',
                    'expectedOutput': '2'
                },
                {
                    'input': '[1, 2, 3, 4, 5], 4, 3',
                    'expectedOutput': '1'
                },
                // T - Type variations
                {
                    'input': '[-1, -2, -3], -2, -3',
                    'expectedOutput': '-1'
                },
                // I - Interesting patterns
                {
                    'input': '[1, 2, 3, null, 4], 4, 3',
                    'expectedOutput': '1'
                },
                // M - Many elements
                {
                    'input': '[3, 5, 1, 6, 2, 0, 8], 6, 8',
                    'expectedOutput': '3'
                },
                // E - Extremes (ancestor of itself)
                {
                    'input': '[5, 3, 8, 1, 4], 3, 4',
                    'expectedOutput': '3'
                }
            ],
            solutionExplanation: `## 🔴 Brute Force Approach

**Idea:** Find paths to both nodes, then find where paths diverge.

\`\`\`python
def lowestCommonAncestor(root, p, q):
    def findPath(node, target, path):
        if not node:
            return False

        path.append(node)

        if node == target:
            return True

        if findPath(node.left, target, path) or findPath(node.right, target, path):
            return True

        path.pop()
        return False

    # Find paths to p and q
    path_p = []
    path_q = []
    findPath(root, p, path_p)
    findPath(root, q, path_q)

    # Find last common node in paths
    lca = None
    for i in range(min(len(path_p), len(path_q))):
        if path_p[i] == path_q[i]:
            lca = path_p[i]
        else:
            break

    return lca
\`\`\`

**Complexity:**
- Time: O(n) - find each path once
- Space: O(n) - store both paths

---

## 🟡 Bottleneck Analysis

**What's inefficient?**
- Storing complete paths to both nodes
- Two separate traversals to find paths
- Extra space for path arrays

**Key insight:** We don't need to store paths! Use postorder DFS and bubble up results.

---

## 🟢 Optimized Approach: Postorder DFS

**Idea:** Recursively search both subtrees, return when found.

\`\`\`python
def lowestCommonAncestor(root, p, q):
    if not root or root == p or root == q:
        return root

    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)

    # Both found in different subtrees? Current is LCA
    if left and right:
        return root

    # Otherwise return whichever is non-null
    return left if left else right
\`\`\`

**Why it's better:**
- Single traversal, no path storage
- O(h) space instead of O(n)
- Elegant postorder solution
- Returns as soon as LCA found

---

## ✅ Final Complexity

- **Time:** O(n) - visit each node at most once
- **Space:** O(h) - recursion depth
  - Balanced: O(log n)
  - Skewed: O(n)

---

## 🎯 Pattern Learned

**LCA Postorder Pattern:**
- Base case: if node is null or matches p/q, return it
- Recursively search left and right
- If BOTH return non-null → current node is LCA
- If ONE returns non-null → propagate it up
- Postorder ensures we process children before parent`,
            complexityQuizPlacement: 'after',
            requiredForProgress: false
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-lca-parent',
            title: 'Code: LCA with Parent Pointers',
            description: 'Find LCA when nodes have pointers to their parents',
            instruction: `# Lowest Common Ancestor with Parent Pointers
            
Given a binary tree where **each node contains a reference to its parent**, find the Lowest Common Ancestor (LCA) of two given nodes, \`p\` and \`q\`.

**Note:** You are **NOT** given the root of the tree. You only have access to nodes \`p\` and \`q\`.

## Class Definition
\`\`\`python
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.parent = None
\`\`\`

## Examples

**Example 1:**
\`\`\`
Tree:
        3
       / \\
      5   1
     / \\
    6   2
       / \\
      7   4

p = 5, q = 1
Output: 3
\`\`\`

**Example 2:**
\`\`\`
p = 5, q = 4
Output: 5
Explanation: The LCA of 5 and 4 is 5 itself.
\`\`\`

## Constraints
- All Node.val are unique.
- p and q exist in the tree.
- Time Complexity Target: O(h)
- Space Complexity Target: O(h)
`,
            starterCode: `class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.parent = None

def lowestCommonAncestor(p, q):
    # p and q are nodes with a .parent pointer
    # Return the Node acting as LCA
    pass`,
            expectedOutput: `def lowestCommonAncestor(p, q):
    ancestors = set()
    while p:
        ancestors.add(p)
        p = p.parent
    while q:
        if q in ancestors:
            return q
        q = q.parent
    return None`,
            hints: [
                { afterAttempt: 1, text: 'Since we have parent pointers, we can trace the path from each node UP to the root.' },
                { afterAttempt: 2, text: 'This problem is equivalent to finding the intersection of two Linked Lists.' },
                { afterAttempt: 3, text: 'Store the ancestors of p in a HashSet, then traverse up from q until you find a match.' }
            ],
            solution: {
                afterAttempt: 3,
                text: `# Optimal Solution: HashSet Approach

**Python:**
\`\`\`python
def lowestCommonAncestor(p, q):
    ancestors = set()
    
    # Collect all ancestors of p
    while p:
        ancestors.add(p)
        p = p.parent
        
    # Traverse up from q; first match is LCA
    while q:
        if q in ancestors:
            return q
        q = q.parent
        
    return None
\`\`\`

**Time Complexity:** O(h) - where h is height of the tree (length of path to root)
**Space Complexity:** O(h) - to store ancestors of p`
            },
            targetComplexity: {
                time: "O(h)",
                space: "O(h)"
            },
            testCases: [
                {
                    'input': '[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1',
                    'expectedOutput': '3'
                },
                {
                    'input': '[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4',
                    'expectedOutput': '5'
                },
                {
                    'input': '[1, 2], 1, 2',
                    'expectedOutput': '1'
                }
            ],
            solutionExplanation: `## Approach: Intersection of Two Paths

Because we have \`parent\` pointers, each node's path to the root acts like a **Linked List**.

The problem effectively transforms into: **"Find the intersection node of two Linked Lists."**

### 🟢 Solution 1: Using a Hash Set
1. Traverse from \`p\` up to the root, adding every node to a \`visited\` set.
2. Traverse from \`q\` up to the root.
3. The first node from \`q\`'s path that is already in \`visited\` is the LCA.

**Complexity:**
- **Time:** O(h) to walk up the tree.
- **Space:** O(h) to store the set.

---

## 🟡 Improving Space?
Can we solve this **without** the extra space for the set?
YES! Just like "Intersection of Two Linked Lists", we can do this in O(1) space. Check out the next challenge!`,
            complexityQuizPlacement: 'after',
            requiredForProgress: false
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-lca-parent-constant',
            title: 'Code: LCA with Parent Pointers (O(1) Space)',
            description: 'Find LCA using parent pointers with constant space',
            instruction: `# LCA with Parent Pointers (Constant Space)

Same problem as before: find the LCA of \`p\` and \`q\` given parent pointers.

**Challenge:** Can you solve this with **O(1) extra space**? (i.e., NO HashSet, NO recursion stack)

## Class Definition
\`\`\`python
class Node:
    def __init__(self, val):
        self.val = val
        self.parent = None
\`\`\`

## Constraints
- Time Complexity Target: O(h)
- **Space Complexity Target: O(1)**
`,
            starterCode: `class Node:
    def __init__(self, val):
        self.val = val
        self.parent = None

def lowestCommonAncestor(p, q):
    # Solve in O(1) space!
    pass`,
            expectedOutput: `def lowestCommonAncestor(p, q):
    a, b = p, q
    while a != b:
        a = a.parent if a else q
        b = b.parent if b else p
    return a`,
            hints: [
                { afterAttempt: 1, text: 'Think about the "Two Pointer" solution for Intersection of Two Linked Lists.' },
                { afterAttempt: 2, text: 'If you reach the end of a path (root), jump to the START of the OTHER node\'s path.' },
                { afterAttempt: 3, text: 'This equalizes the travel distance. They will meet at the intersection point.' }
            ],
            solution: {
                afterAttempt: 4,
                text: `# Optimal Solution: Two Pointers (O(1) Space)

**Python:**
\`\`\`python
def lowestCommonAncestor(p, q):
    a, b = p, q
    
    # Traverse until they meet
    while a != b:
        # If reached root (None), jump to start of other path
        a = a.parent if a else q
        b = b.parent if b else p
        
    return a
\`\`\`

**Time Complexity:** O(h)
**Space Complexity:** O(1)`
            },
            targetComplexity: {
                time: "O(h)",
                space: "O(1)"
            },
            testCases: [
                {
                    'input': '[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1',
                    'expectedOutput': '3'
                },
                {
                    'input': '[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4',
                    'expectedOutput': '5'
                },
                {
                    'input': '[1, 2], 1, 2',
                    'expectedOutput': '1'
                }
            ],
            solutionExplanation: `## The "Run and Switch" Trick

This uses the classic **Intersection of Two Linked Lists** algorithm.

### Logic
The paths from \`p\` and \`q\` to the root may have different lengths.
- Path A length: \`L1 + C\` (where C is common path length)
- Path B length: \`L2 + C\`

If we walk to the end of one path and then **switch to the start of the other**, both pointers will travel exactly \`L1 + L2 + C\`.

**Visual:**
\`\`\`
Pointer A: [Path p] ... (root) -> (jump to q) -> [Path q until intersection]
Pointer B: [Path q] ... (root) -> (jump to p) -> [Path p until intersection]
\`\`\`

They are guaranteed to meet at the exact intersection node (the LCA), or at \`None\` if no intersection (which implies different trees, though problem constraints usually imply same tree).

**Complexity:**
- **Time:** O(h) (each pointer traverses each non-common part once and common part once)
- **Space:** O(1) (only two pointers used)
`,
            complexityQuizPlacement: 'after',
            requiredForProgress: true
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-validate-bst',
            title: 'Code: Validate Binary Search Tree',
            description: 'Determine if a binary tree is a valid BST',
            requiredForProgress: true,
            instruction: `# Validate Binary Search Tree (LeetCode 98)

Given the root of a binary tree, determine if it is a **valid binary search tree (BST)**.

A valid BST is defined as follows:
- The left subtree of a node contains only nodes with keys **less than** the node's key.
- The right subtree of a node contains only nodes with keys **greater than** the node's key.
- Both the left and right subtrees must also be binary search trees.

## Examples

**Example 1:**
\`\`\`
Input: root = [2,1,3]
    2
   / \\
  1   3
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: root = [5,1,4,null,null,3,6]
    5
   / \\
  1   4
     / \\
    3   6
Output: false

Explanation: Root's right child is 4, which is less than 5!
\`\`\`

## Key Gotcha
Don't just check immediate children! This tree is INVALID:
\`\`\`
    5
   / \\
  1   6
     / \\
    3   7
\`\`\`
Even though 6 > 5 (good), node 3 is in the right subtree of 5 but is less than 5!

## Constraints
- Number of nodes in the tree is in the range [1, 10^4]
- -2^31 <= Node.val <= 2^31 - 1`,
            starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def isValidBST(root):
    # Every node must be within valid range
    pass`,
            expectedOutput: `def isValidBST(root):
    def validate(node, min_val, max_val):
        if not node:
            return True
        
        if node.val <= min_val or node.val >= max_val:
            return False
        
        return (validate(node.left, min_val, node.val) and
                validate(node.right, node.val, max_val))
    
    return validate(root, float('-inf'), float('inf'))`,
            hints: [
                { afterAttempt: 1, text: 'Checking only immediate children is not enough. Each node must be within a valid RANGE.' },
                { afterAttempt: 2, text: 'Pass down min/max bounds. Left child must be < current, right must be > current.' },
                { afterAttempt: 3, text: 'Alternative: inorder traversal of BST produces sorted values. Check if inorder is strictly increasing!' }
            ],
            solution: {
                afterAttempt: 4,
                text: `## Solution - O(n) time, O(h) space

\`\`\`python
def isValidBST(root):
    def validate(node, min_val, max_val):
        if not node:
            return True
        if node.val <= min_val or node.val >= max_val:
            return False
        return (validate(node.left, min_val, node.val) and
                validate(node.right, node.val, max_val))
    
    return validate(root, float('-inf'), float('inf'))
\`\`\`

**Key insight:** Each node must be within a valid range based on its ancestors!`
            },
            targetComplexity: { time: 'O(n)', space: 'O(h)' },
            testCases: [
                { input: '[2,1,3]', expectedOutput: 'True' },
                { input: '[5,1,4,null,null,3,6]', expectedOutput: 'False' },
                { input: '[1]', expectedOutput: 'True' },
                { input: '[5,4,6,null,null,3,7]', expectedOutput: 'False' }
            ],
            solutionExplanation: `## The Trap: Only Checking Immediate Children

\`\`\`python
# WRONG!
def isValidBST(root):
    if not root:
        return True
    if root.left and root.left.val >= root.val:
        return False
    if root.right and root.right.val <= root.val:
        return False
    return isValidBST(root.left) and isValidBST(root.right)
\`\`\`

This fails for:
\`\`\`
    5
   / \\
  1   6
     / \\
    3   7
\`\`\`

Each local check passes (1 < 5, 6 > 5, 3 < 6, 7 > 6), but 3 is in the RIGHT subtree of 5, so it must be > 5!

---

## The Fix: Track Valid Range

Every node must satisfy bounds from ALL ancestors:
- Left child must be between (parent's lower bound, parent's value)
- Right child must be between (parent's value, parent's upper bound)

\`\`\`python
def isValidBST(root):
    def validate(node, min_val, max_val):
        if not node:
            return True
        
        # Must be strictly between min and max
        if node.val <= min_val or node.val >= max_val:
            return False
        
        # Left: range is (min_val, node.val)
        # Right: range is (node.val, max_val)
        return (validate(node.left, min_val, node.val) and
                validate(node.right, node.val, max_val))
    
    return validate(root, float('-inf'), float('inf'))
\`\`\`

---

## Visual Walkthrough

\`\`\`
    5 (range: -∞ to +∞)
   / \\
  1   6
     / \\
    3   7

Check 5: -∞ < 5 < +∞ ✓
Check 1: -∞ < 1 < 5 ✓
Check 6: 5 < 6 < +∞ ✓
Check 3: 5 < 3 < 6 ✗ INVALID!
\`\`\`

Node 3 fails because it's in the right subtree of 5, so must be > 5.

---

## Alternative: Inorder Traversal

BST property: inorder traversal produces sorted values.

\`\`\`python
def isValidBST(root):
    prev = float('-inf')
    
    def inorder(node):
        nonlocal prev
        if not node:
            return True
        
        # Process left
        if not inorder(node.left):
            return False
        
        # Check current (must be > previous)
        if node.val <= prev:
            return False
        prev = node.val
        
        # Process right
        return inorder(node.right)
    
    return inorder(root)
\`\`\`

If the inorder sequence is strictly increasing, it's a valid BST!

---

## The Pattern

**"Constraint Propagation"** – Pass down constraints (min/max) through recursion.

This pattern applies to:
- Validate BST (this problem)
- Construct BST from ranges
- Any tree problem where child constraints depend on parent values`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-construct-bst-preorder',
            title: 'Code: Construct BST from Preorder',
            description: 'Build a connection-valid BST from preorder values',
            instruction: `# Construct BST from Preorder Traversal

Given an array of integers \`preorder\`, which represents the **preorder traversal** of a BST (Binary Search Tree), construct the tree and return its root.

It is guaranteed that there is always possible to find a binary search tree with the given requirements for the given test cases.

## Examples

**Example 1:**
\`\`\`
Input: preorder = [8,5,1,7,10,12]
Output: [8,5,10,1,7,null,12]
      8
     / \\
    5   10
   / \\    \\
  1   7    12
\`\`\`

**Example 2:**
\`\`\`
Input: preorder = [1,3]
Output: [1,null,3]
\`\`\`

## Key Insight
Preorder is **Root → Left → Right**. The first element is always the root!
For a BST, all values in the left subtree are smaller than the root, and all values in the right subtree are larger.

## Constraints
- 1 <= preorder.length <= 100
- 1 <= preorder[i] <= 1000
- All values of preorder are unique`,
            starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def bstFromPreorder(preorder):
    # Your code here
    pass`,
            expectedOutput: `def bstFromPreorder(preorder):
    if not preorder:
        return None
    root = TreeNode(preorder[0])
    i = 1
    while i < len(preorder) and preorder[i] < root.val:
        i += 1
    root.left = bstFromPreorder(preorder[1:i])
    root.right = bstFromPreorder(preorder[i:])
    return root`,
            hints: [
                { afterAttempt: 1, text: 'First element is the root. Find the pivot where values become larger than root.' },
                { afterAttempt: 2, text: 'Elements smaller than root belong to left subtree; larger belong to right.' }
            ],
            solution: {
                afterAttempt: 3,
                text: `# Optimal Solution: Bound-Based Recursion

**Python:**
\`\`\`python
def bstFromPreorder(preorder):
    if not preorder:
        return None
    
    # First element is root
    root = TreeNode(preorder[0])
    
    # Find split point: first element larger than root
    i = 1
    while i < len(preorder) and preorder[i] < root.val:
        i += 1
        
    # Recursively build subtrees
    root.left = bstFromPreorder(preorder[1:i])
    root.right = bstFromPreorder(preorder[i:])
    
    return root
\`\`\`

**Time Complexity:** O(n^2) for this simple approach (O(n) possible with bounds)
**Space Complexity:** O(h) recursion stack`
            },
            targetComplexity: {
                time: "O(n²)",
                space: "O(h)"
            },
            testCases: [
                {
                    'input': '[8,5,1,7,10,12]',
                    'expectedOutput': '[8, 5, 10, 1, 7, null, 12]'
                },
                {
                    'input': '[1, 3]',
                    'expectedOutput': '[1, null, 3]'
                },
                {
                    'input': '[10, 5, 2, 7, 15, 12, 20]',
                    'expectedOutput': '[10, 5, 15, 2, 7, 12, 20]'
                }
            ],
            solutionExplanation: `## 🔴 Brute Force / Simple Recursion

**Idea:** The first element is root. Find the first element in the array larger than root. That element marks the start of the right subtree.

\`\`\`python
def bstFromPreorder(preorder):
    if not preorder:
        return None
    root = TreeNode(preorder[0])
    
    # Linear scan to find split point
    i = 1
    while i < len(preorder) and preorder[i] < root.val:
        i += 1
        
    root.left = bstFromPreorder(preorder[1:i])
    root.right = bstFromPreorder(preorder[i:])
    return root
\`\`\`

**Complexity:**
- Time: O(n²) in worst case (skewed tree) because we scan array at each step
- Space: O(h)

## 🟢 O(n) Approach (Bound-Based)

We can pass \`lower\` and \`upper\` bounds to avoid scanning.

\`\`\`python
def bstFromPreorder(self, preorder):
    self.idx = 0
    n = len(preorder)
    
    def helper(lower=float('-inf'), upper=float('inf')):
        if self.idx == n:
            return None
            
        val = preorder[self.idx]
        if val < lower or val > upper:
            return None
            
        self.idx += 1
        root = TreeNode(val)
        root.left = helper(lower, val)
        root.right = helper(val, upper)
        return root
        
    return helper()
\`\`\``,
            complexityQuizPlacement: 'after',
            requiredForProgress: false
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-serialize-deserialize-bst',
            title: 'Code: Serialize and Deserialize BST',
            description: 'Convert BST to string and back',
            instruction: `# Serialize and Deserialize BST

Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer. Deserialization is the reverse process.

Design an algorithm to serialize and deserialize a **Binary Search Tree**.

## Examples

**Example 1:**
\`\`\`
Input: root = [2,1,3]
Output: [2,1,3]
\`\`\`

**Example 2:**
\`\`\`
Input: root = []
Output: []
\`\`\`

## Key Insight
Since it's a **BST**, a simple **Preorder Traversal** is enough to uniquely identify the tree structure!
- **Serialize:** Convert to space-separated string using Preorder.
- **Deserialize:** Reconstruct using the "Construct BST from Preorder" logic you just learned!

## Constraints
- The number of nodes in the tree is in the range [0, 10^4]
- 0 <= Node.val <= 10^4
- All values are unique`,
            starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Codec:

    def serialize(self, root):
        """Encodes a tree to a single string.
        
        :type root: TreeNode
        :rtype: str
        """
        pass

    def deserialize(self, data):
        """Decodes your encoded data to tree.
        
        :type data: str
        :rtype: TreeNode
        """
        pass
        

# Your Codec object will be instantiated and called as such:
# ser = Codec()
# deser = Codec()
# tree = ser.serialize(root)
# ans = deser.deserialize(tree)
# return ans`,
            expectedOutput: `class Codec:
    def serialize(self, root):
        if not root:
            return ""
        # Preorder: Root -> Left -> Right
        return str(root.val) + " " + self.serialize(root.left) + " " + self.serialize(root.right)

    def deserialize(self, data):
        if not data:
            return None
        
        # Convert string back to list of integers
        vals = [int(x) for x in data.split()]
        
        # Helper to rebuild BST (same as previous exercise!)
        def build(min_val, max_val, q):
            if not q:
                return None
            
            val = q[0]
            if val < min_val or val > max_val:
                return None
            
            q.pop(0)
            root = TreeNode(val)
            root.left = build(min_val, val, q)
            root.right = build(val, max_val, q)
            return root
            
        return build(float('-inf'), float('inf'), vals)`,
            hints: [
                { afterAttempt: 1, text: 'For serialization, use Preorder traversal to join values with spaces.' },
                { afterAttempt: 2, text: 'For deserialization, convert string to list and use the bound-based approach from "Construct BST from Preorder".' }
            ],
            solution: {
                afterAttempt: 3,
                text: `# Optimal Solution: Preorder with Bounds

**Python:**
\`\`\`python
class Codec:
    def serialize(self, root):
        vals = []
        def preorder(node):
            if node:
                vals.append(str(node.val))
                preorder(node.left)
                preorder(node.right)
        preorder(root)
        return " ".join(vals)

    def deserialize(self, data):
        if not data:
            return None
        vals = collections.deque([int(x) for x in data.split()])
        
        def build(min_val, max_val):
            if vals and min_val < vals[0] < max_val:
                val = vals.popleft()
                node = TreeNode(val)
                node.left = build(min_val, val)
                node.right = build(val, max_val)
                return node
            return None
            
        return build(float('-inf'), float('inf'))
\`\`\`

**Time Complexity:** O(n)
**Space Complexity:** O(n)`
            },
            targetComplexity: {
                time: "O(n)",
                space: "O(n)"
            },
            testCases: [
                {
                    'input': '[2,1,3]',
                    'expectedOutput': '[2, 1, 3]'
                },
                {
                    'input': '[]',
                    'expectedOutput': '[]'
                }
            ],
            solutionExplanation: `## Solution Analysis

### 🟢 Approach (Preorder + Bounds)
1. **Serialize**: Simply perform a preorder traversal (Root, Left, Right) and join values with spaces. Since typical serializations use delimiters (like ','), space is fine.
2. **Deserialize**: Split the string into a queue of values. Then, rebuild the BST.
   - We know the first value is the root.
   - We use the properties of BST (lower/upper bounds) to decide where each subsequent value goes, exactly like in "Construct BST from Preorder".

\`\`\`python
# Reusing the logic from Construct BST from Preorder!
def build(min_val, max_val):
    if vals and min_val < vals[0] < max_val:
        val = vals.popleft()
        node = TreeNode(val)
        node.left = build(min_val, val)
        node.right = build(val, max_val)
        return node
    return None
\`\`\`

### ✅ Complexity
- **Time: O(n)** - we visit each node once during serialization and deserialization.
- **Space: O(n)** - to store the string/list of values.

### 🎯 Key Concept
**"BST Serialization"** → Preorder provides a compact unique representation because the BST property rigidly defines position based on value. (Note: For generic binary trees, Preorder alone is NOT unique without null markers).`,
            complexityQuizPlacement: 'after',
            requiredForProgress: false
        }
];
