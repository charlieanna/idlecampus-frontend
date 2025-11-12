# TREES Problems

Total Problems: 20

---

## 1. Validate Binary Search Tree

**Difficulty:** medium
**Concept:** trees
**Family:** trees:bst-operations

### Description

Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined as follows: The left subtree of a node contains only nodes with keys less than the node's key. The right subtree of a node contains only nodes with keys greater than the node's key. Both the left and right subtrees must also be binary search trees.

### Key Insight

Use the min/max bounds approach: track the valid range for each node. Left children must be within (min, node.val) and right children within (node.val, max). This handles the case where a node deep in the tree violates BST property with an ancestor. Alternatively, use inorder traversal which should produce strictly increasing values for a valid BST.

### Examples

**Example 1:**
- Input: root = [2,1,3]
- Output: true
- Explanation: The tree is a valid BST where 1 < 2 < 3.

**Example 2:**
- Input: root = [5,1,4,null,null,3,6]
- Output: false
- Explanation: The root node's value is 5 but its right child's value is 4, violating BST property. Also, node 3 is less than root 5.

**Example 3:**
- Input: root = [2,2,2]
- Output: false
- Explanation: BST cannot have duplicate values (left must be strictly less, right strictly greater).

### Hints

1. Cannot just check node.left.val < node.val < node.right.val - a node deep in the tree might violate BST property with an ancestor
2. Use a helper function validate(node, min_val, max_val) that tracks the valid range for the current node
3. For the left child, the new maximum becomes the parent's value: validate(node.left, min_val, node.val)
4. For the right child, the new minimum becomes the parent's value: validate(node.right, node.val, max_val)
5. Base case: if node is None, return True (empty tree is valid BST)
6. Alternative approach: perform inorder traversal and check if values are strictly increasing

### Starter Code

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def isValidBST(root):
    """
    Validate if tree is a valid BST using bounds.
    
    Args:
        root: TreeNode - root of binary tree
    
    Returns:
        bool - True if valid BST, False otherwise
    """
    def validate(node, min_val, max_val):
        # TODO: Base case - empty node is valid
        
        # TODO: Check if current node's value is within bounds
        # If not, return False
        
        # TODO: Recursively validate left subtree with updated max bound
        # and right subtree with updated min bound
        
        pass
    
    # Start with infinite bounds
    return validate(root, float('-inf'), float('inf'))

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function isValidBST(root) {
    """
    Validate if tree is a valid BST using bounds.
    
    Args:
        root: TreeNode - root of binary tree
    
    Returns:
        bool - true if valid BST, false otherwise
    """
    function validate(node, min_val, max_val) {
        // TODO: Base case - empty node is valid
        
        // TODO: Check if current node's value is within bounds
        # If not, return false
        
        // TODO: Recursively validate left subtree with updated max bound
        # and right subtree with updated min bound
  // TODO: implement
    # Start with infinite bounds
    return validate(root, float('-inf'), float('inf'))

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Solution

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def isValidBST(root):
    """
    Validate BST using min/max bounds approach.
    
    Time: O(n) - visit each node once
    Space: O(h) - recursion stack depth equals tree height
    """
    def validate(node, min_val, max_val):
        # Empty node is valid
        if not node:
            return True
        
        # Check if current value is within valid range
        if node.val <= min_val or node.val >= max_val:
            return False
        
        # Validate left subtree (values must be < node.val)
        # and right subtree (values must be > node.val)
        return (validate(node.left, min_val, node.val) and 
                validate(node.right, node.val, max_val))
    
    return validate(root, float('-inf'), float('inf'))

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function isValidBST(root) {
    """
    Validate BST using min/max bounds approach.
    
    Time: O(n) - visit each node once
    Space: O(h) - recursion stack depth equals tree height
    """
    function validate(node, min_val, max_val) {
        # Empty node is valid
        if not node:
            return true
        
        # Check if current value is within valid range
        if node.val <= min_val or node.val >= max_val:
            return false
        
        # Validate left subtree (values must be < node.val)
        # and right subtree (values must be > node.val)
        return (validate(node.left, min_val, node.val) and 
                validate(node.right, node.val, max_val))
    
    return validate(root, float('-inf'), float('inf'))

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Complexity Analysis

- **Time Complexity:** O(n) - We visit each node exactly once to validate
- **Space Complexity:** O(h) - Recursion stack uses space proportional to tree height (O(log n) balanced, O(n) skewed)

### Test Cases

**Test 1:** Valid simple BST
- Input: "([2,1,3])"
- Expected: "True"

**Test 2:** Node 3 violates ancestor rule
- Input: "([5,1,4,None,None,3,6])"
- Expected: "False"

**Test 3:** Single node is valid
- Input: "([1])"
- Expected: "True"

**Test 4:** Duplicates not allowed
- Input: "([2,2,2])"
- Expected: "False"

**Test 5:** Right subtree has node 3 < root 5
- Input: "([5,4,6,None,None,3,7])"
- Expected: "False"

**Test 6:** Empty tree is valid
- Input: "([])"
- Expected: "True"

**Test 7:** PERFORMANCE: Large skewed tree (10K nodes) - Must use O(n) single pass, not O(n²)
- Input: "(list(range(10000)))"
- Expected: "True"

---

## 2. Lowest Common Ancestor of a Binary Tree

**Difficulty:** medium
**Concept:** trees
**Family:** trees:lca

### Description

Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree. According to the definition of LCA on Wikipedia: "The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself)."

### Key Insight

Use postorder DFS traversal (process children before parent). If current node is p or q, return it. Recursively search left and right subtrees. If both return non-null, current node is the LCA. If only one side returns non-null, return that (LCA is further up or one node is ancestor of the other).

### Examples

**Example 1:**
- Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
- Output: 3
- Explanation: The LCA of nodes 5 and 1 is 3.

**Example 2:**
- Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
- Output: 5
- Explanation: The LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself.

**Example 3:**
- Input: root = [1,2], p = 1, q = 2
- Output: 1
- Explanation: The LCA of nodes 1 and 2 is 1.

### Hints

1. Use postorder traversal (left, right, then process current node)
2. Base case: if node is None or equals p or q, return node
3. Recursively search both left and right subtrees
4. If both subtrees return non-null, current node is the LCA (p and q are in different subtrees)
5. If only left returns non-null, return left (both p and q are in left subtree, or LCA is left)
6. If only right returns non-null, return right (both p and q are in right subtree, or LCA is right)

### Starter Code

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def lowestCommonAncestor(root, p, q):
    """
    Find lowest common ancestor of two nodes.
    
    Args:
        root: TreeNode - root of binary tree
        p: TreeNode - first node
        q: TreeNode - second node
    
    Returns:
        TreeNode - lowest common ancestor
    """
    # TODO: Base case - if node is None or matches p or q, return node
    
    # TODO: Recursively search left and right subtrees
    
    # TODO: If both left and right return non-null, current node is LCA
    
    # TODO: Otherwise, return whichever is non-null (or None if both null)
    
    pass

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function lowestCommonAncestor(root, p, q) {
    """
    Find lowest common ancestor of two nodes.
    
    Args:
        root: TreeNode - root of binary tree
        p: TreeNode - first node
        q: TreeNode - second node
    
    Returns:
        TreeNode - lowest common ancestor
    """
    // TODO: Base case - if node is null or matches p or q, return node
    
    // TODO: Recursively search left and right subtrees
    
    // TODO: If both left and right return non-null, current node is LCA
    
    // TODO: Otherwise, return whichever is non-null (or null if both null)
  // TODO: implement
function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Solution

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def lowestCommonAncestor(root, p, q):
    """
    Find LCA using postorder DFS.
    
    Time: O(n) - visit each node once in worst case
    Space: O(h) - recursion stack depth
    """
    # Base case: empty node or found one of the targets
    if not root or root == p or root == q:
        return root
    
    # Search left and right subtrees
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    
    # If both left and right are non-null, current node is LCA
    if left and right:
        return root
    
    # Otherwise, return whichever is non-null
    # (both in same subtree, or one is ancestor of the other)
    return left if left else right

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function lowestCommonAncestor(root, p, q) {
    """
    Find LCA using postorder DFS.
    
    Time: O(n) - visit each node once in worst case
    Space: O(h) - recursion stack depth
    """
    # Base case: empty node or found one of the targets
    if not root or root == p or root == q:
        return root
    
    # Search left and right subtrees
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    
    # If both left and right are non-null, current node is LCA
    if left and right:
        return root
    
    # Otherwise, return whichever is non-null
    # (both in same subtree, or one is ancestor of the other)
    return left if left else right

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Complexity Analysis

- **Time Complexity:** O(n) - May need to visit all nodes in worst case
- **Space Complexity:** O(h) - Recursion stack depth equals tree height

### Test Cases

**Test 1:** LCA in different subtrees
- Input: "([3,5,1,6,2,0,8,None,None,7,4], 5, 1)"
- Expected: "3"

**Test 2:** One node is ancestor of other
- Input: "([3,5,1,6,2,0,8,None,None,7,4], 5, 4)"
- Expected: "5"

**Test 3:** Parent-child relationship
- Input: "([1,2], 1, 2)"
- Expected: "1"

**Test 4:** Siblings
- Input: "([1,2,3], 2, 3)"
- Expected: "1"

**Test 5:** Same node
- Input: "([1], 1, 1)"
- Expected: "1"

**Test 6:** Root is LCA
- Input: "([2,1,3], 1, 3)"
- Expected: "2"

**Test 7:** PERFORMANCE: Large skewed tree (10K nodes) - Must use O(n) DFS, not O(n²)
- Input: "(list(range(10000)), 1, 9999)"
- Expected: "0"

---

## 3. Lowest Common Ancestor of a Binary Search Tree

**Difficulty:** easy
**Concept:** trees
**Family:** trees:lca

### Description

Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes in the BST. According to the definition of LCA: "The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself)."

### Key Insight

Leverage BST property: if both p and q are less than current node, LCA is in left subtree. If both are greater, LCA is in right subtree. Otherwise, current node is the LCA (one node is on each side, or current node is one of them). Can be solved iteratively in O(h) time without recursion.

### Examples

**Example 1:**
- Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
- Output: 6
- Explanation: The LCA of nodes 2 and 8 is 6.

**Example 2:**
- Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4
- Output: 2
- Explanation: The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself.

**Example 3:**
- Input: root = [2,1], p = 2, q = 1
- Output: 2
- Explanation: The LCA is the root node 2.

### Hints

1. This is simpler than general binary tree LCA because BST has ordering property
2. Compare p.val and q.val with current node's value
3. If both p and q are less than current: LCA must be in left subtree
4. If both p and q are greater than current: LCA must be in right subtree
5. Otherwise: current node is the LCA (values split here, or current equals p or q)
6. Can be solved iteratively without recursion for O(1) space (excluding output)

### Starter Code

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def lowestCommonAncestor(root, p, q):
    """
    Find LCA in BST leveraging BST property.
    
    Args:
        root: TreeNode - root of BST
        p: TreeNode - first node
        q: TreeNode - second node
    
    Returns:
        TreeNode - lowest common ancestor
    """
    # TODO: Start from root
    # while current node exists:
    
    # TODO: If both p and q are smaller than current, go left
    
    # TODO: If both p and q are greater than current, go right
    
    # TODO: Otherwise, current node is LCA
    
    pass

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function lowestCommonAncestor(root, p, q) {
    """
    Find LCA in BST leveraging BST property.
    
    Args:
        root: TreeNode - root of BST
        p: TreeNode - first node
        q: TreeNode - second node
    
    Returns:
        TreeNode - lowest common ancestor
    """
    // TODO: Start from root
    # while current node exists:
    
    // TODO: If both p and q are smaller than current, go left
    
    // TODO: If both p and q are greater than current, go right
    
    // TODO: Otherwise, current node is LCA
  // TODO: implement
function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Solution

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def lowestCommonAncestor(root, p, q):
    """
    Find LCA in BST using iterative approach.
    
    Time: O(h) - traverse down one path
    Space: O(1) - no extra space needed
    """
    current = root
    
    while current:
        # Both nodes in left subtree
        if p.val < current.val and q.val < current.val:
            current = current.left
        # Both nodes in right subtree
        elif p.val > current.val and q.val > current.val:
            current = current.right
        # Values split here or current is one of the nodes
        else:
            return current
    
    return None

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function lowestCommonAncestor(root, p, q) {
    """
    Find LCA in BST using iterative approach.
    
    Time: O(h) - traverse down one path
    Space: O(1) - no extra space needed
    """
    current = root
    
    while current:
        # Both nodes in left subtree
        if p.val < current.val and q.val < current.val:
            current = current.left
        # Both nodes in right subtree
        elif p.val > current.val and q.val > current.val:
            current = current.right
        # Values split here or current is one of the nodes
        else:
            return current
    
    return null

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Complexity Analysis

- **Time Complexity:** O(h) - Traverse one path down the tree, where h is height
- **Space Complexity:** O(1) - Iterative solution uses constant extra space

### Test Cases

**Test 1:** Values on different sides
- Input: "([6,2,8,0,4,7,9,None,None,3,5], 2, 8)"
- Expected: "6"

**Test 2:** One is ancestor of other
- Input: "([6,2,8,0,4,7,9,None,None,3,5], 2, 4)"
- Expected: "2"

**Test 3:** Parent-child
- Input: "([2,1], 2, 1)"
- Expected: "2"

**Test 4:** Root is LCA
- Input: "([2,1,3], 1, 3)"
- Expected: "2"

**Test 5:** LCA is root
- Input: "([5,3,8,1,4,7,9], 4, 7)"
- Expected: "5"

**Test 6:** LCA in subtree
- Input: "([5,3,8,1,4,7,9], 1, 4)"
- Expected: "3"

---

## 4. Delete Node in a BST

**Difficulty:** medium
**Concept:** trees
**Family:** trees:bst-operations

### Description

Given a root node reference of a BST and a key, delete the node with the given key in the BST. Return the root node reference (possibly updated) of the BST. The deletion can be divided into two stages: (1) Search for the node to delete. (2) If the node is found, delete it. Follow up: Can you solve it in O(h) time where h is the height of the tree?

### Key Insight

Three cases for deletion: (1) Node has no children - simply remove it. (2) Node has one child - replace it with its child. (3) Node has two children - find inorder successor (smallest in right subtree), copy its value to current node, then delete the successor. The successor is guaranteed to have at most one child.

### Examples

**Example 1:**
- Input: root = [5,3,6,2,4,null,7], key = 3
- Output: [5,4,6,2,null,null,7]
- Explanation: Delete node 3. Replace it with its inorder successor 4.

**Example 2:**
- Input: root = [5,3,6,2,4,null,7], key = 0
- Output: [5,3,6,2,4,null,7]
- Explanation: The key 0 is not in the tree, so return unchanged.

**Example 3:**
- Input: root = [], key = 0
- Output: []
- Explanation: Empty tree remains empty.

### Hints

1. Use BST property to search for the node: go left if key < node.val, right if key > node.val
2. Case 1 (no children): if not root.left and not root.right: return None
3. Case 2 (one child): if not root.left: return root.right (or vice versa)
4. Case 3 (two children): find inorder successor - the minimum value in right subtree
5. To find minimum: go left repeatedly until you find a node with no left child
6. After copying successor's value to current node, delete the successor from right subtree

### Starter Code

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def deleteNode(root, key):
    """
    Delete node with given key from BST.
    
    Args:
        root: TreeNode - root of BST
        key: int - value to delete
    
    Returns:
        TreeNode - new root after deletion
    """
    # TODO: Base case - if root is None, return None
    
    # TODO: Search for the node to delete using BST property
    # if key < root.val: search left
    # if key > root.val: search right
    
    # TODO: Found the node to delete (key == root.val)
    # Case 1: No left child - return right child
    # Case 2: No right child - return left child
    # Case 3: Both children exist:
    #   - Find inorder successor (min node in right subtree)
    #   - Copy successor's value to current node
    #   - Delete successor from right subtree
    
    pass

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function deleteNode(root, key) {
    """
    Delete node with given key from BST.
    
    Args:
        root: TreeNode - root of BST
        key: int - value to delete
    
    Returns:
        TreeNode - new root after deletion
    """
    // TODO: Base case - if root is null, return null
    
    // TODO: Search for the node to delete using BST property
    # if key < root.val: search left
    # if key > root.val: search right
    
    // TODO: Found the node to delete (key == root.val)
    # Case 1: No left child - return right child
    # Case 2: No right child - return left child
    # Case 3: Both children exist:
    #   - Find inorder successor (min node in right subtree)
    #   - Copy successor's value to current node
    #   - Delete successor from right subtree
  // TODO: implement
function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Solution

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def deleteNode(root, key):
    """
    Delete node from BST handling all three cases.
    
    Time: O(h) - search for node plus find successor if needed
    Space: O(h) - recursion stack depth
    """
    if not root:
        return None
    
    # Search for the node to delete
    if key < root.val:
        root.left = deleteNode(root.left, key)
    elif key > root.val:
        root.right = deleteNode(root.right, key)
    else:
        # Found the node to delete
        
        # Case 1: No left child
        if not root.left:
            return root.right
        
        # Case 2: No right child
        if not root.right:
            return root.left
        
        # Case 3: Two children - find inorder successor
        # (minimum in right subtree)
        successor = root.right
        while successor.left:
            successor = successor.left
        
        # Replace current node's value with successor's value
        root.val = successor.val
        
        # Delete the successor from right subtree
        root.right = deleteNode(root.right, successor.val)
    
    return root

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function deleteNode(root, key) {
    """
    Delete node from BST handling all three cases.
    
    Time: O(h) - search for node plus find successor if needed
    Space: O(h) - recursion stack depth
    """
    if not root:
        return null
    
    # Search for the node to delete
    if key < root.val:
        root.left = deleteNode(root.left, key)
    elif key > root.val:
        root.right = deleteNode(root.right, key)
    else:
        # Found the node to delete
        
        # Case 1: No left child
        if not root.left:
            return root.right
        
        # Case 2: No right child
        if not root.right:
            return root.left
        
        # Case 3: Two children - find inorder successor
        # (minimum in right subtree)
        successor = root.right
        while successor.left:
            successor = successor.left
        
        # Replace current node's value with successor's value
        root.val = successor.val
        
        # Delete the successor from right subtree
        root.right = deleteNode(root.right, successor.val)
    
    return root

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Complexity Analysis

- **Time Complexity:** O(h) - Search for node O(h), find successor O(h) in worst case
- **Space Complexity:** O(h) - Recursion stack depth proportional to tree height

### Test Cases

**Test 1:** Delete node with two children
- Input: "([5,3,6,2,4,None,7], 3)"
- Expected: "[5,4,6,2,None,None,7]"

**Test 2:** Key not found
- Input: "([5,3,6,2,4,None,7], 0)"
- Expected: "[5,3,6,2,4,None,7]"

**Test 3:** Delete leaf node
- Input: "([5,3,6,2,4,None,7], 7)"
- Expected: "[5,3,6,2,4]"

**Test 4:** Delete root
- Input: "([5,3,6,2,4,None,7], 5)"
- Expected: "[6,3,7,2,4]"

**Test 5:** Delete only node
- Input: "([1], 1)"
- Expected: "[]"

**Test 6:** Delete node with no children
- Input: "([2,1,3], 1)"
- Expected: "[2,None,3]"

---

## 5. Construct Binary Tree from Preorder and Inorder Traversal

**Difficulty:** medium
**Concept:** trees
**Family:** trees:dfs-traversal

### Description

Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree. You may assume that duplicates do not exist in the tree.

### Key Insight

Preorder gives root first, then left subtree, then right. Inorder gives left subtree, then root, then right. Use preorder[0] as root, find it in inorder to split into left/right subtrees. Build recursively using corresponding slices. Use a hashmap to find root index in inorder in O(1) time.

### Examples

**Example 1:**
- Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
- Output: [3,9,20,null,null,15,7]
- Explanation: Root is 3. Left subtree is [9]. Right subtree is [20,15,7].

**Example 2:**
- Input: preorder = [-1], inorder = [-1]
- Output: [-1]
- Explanation: Single node tree.

**Example 3:**
- Input: preorder = [1,2,3], inorder = [2,1,3]
- Output: [1,2,null,null,3]
- Explanation: Node 1 has left child 2 and right child 3.

### Hints

1. First element of preorder is always the root
2. Find root in inorder array to determine left and right subtree sizes
3. Create hashmap: {value: index} for inorder to find root position in O(1)
4. Left subtree size = (root_index_in_inorder - inorder_start)
5. Left subtree in preorder: [pre_start+1, pre_start+left_size]
6. Right subtree in preorder: [pre_start+left_size+1, pre_end]

### Starter Code

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def buildTree(preorder, inorder):
    """
    Build tree from preorder and inorder traversals.
    
    Args:
        preorder: List[int] - preorder traversal
        inorder: List[int] - inorder traversal
    
    Returns:
        TreeNode - root of constructed tree
    """
    # TODO: Create hashmap of inorder values to indices for O(1) lookup
    
    # TODO: Create helper function build(pre_start, pre_end, in_start, in_end)
    
    # TODO: Base case - if start > end, return None
    
    # TODO: Root is preorder[pre_start]
    # Find root index in inorder using hashmap
    
    # TODO: Calculate left subtree size
    
    # TODO: Recursively build left and right subtrees with correct index ranges
    
    pass
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function buildTree(preorder, inorder) {
    """
    Build tree from preorder and inorder traversals.
    
    Args:
        preorder: Array - preorder traversal
        inorder: Array - inorder traversal
    
    Returns:
        TreeNode - root of constructed tree
    """
    // TODO: Create hashmap of inorder values to indices for O(1) lookup
    
    // TODO: Create helper function build(pre_start, pre_end, in_start, in_end)
    
    // TODO: Base case - if start > end, return null
    
    // TODO: Root is preorder[pre_start]
    # Find root index in inorder using hashmap
    
    // TODO: Calculate left subtree size
    
    // TODO: Recursively build left and right subtrees with correct index ranges
  // TODO: implement
```

### Solution

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def buildTree(preorder, inorder):
    """
    Build tree using preorder and inorder traversals.
    
    Time: O(n) - process each node once
    Space: O(n) - hashmap and recursion stack
    """
    # Create hashmap for O(1) lookup of root in inorder
    inorder_map = {val: idx for idx, val in enumerate(inorder)}
    
    def build(pre_start, pre_end, in_start, in_end):
        if pre_start > pre_end:
            return None
        
        # Root is first element in preorder range
        root_val = preorder[pre_start]
        root = TreeNode(root_val)
        
        # Find root position in inorder
        root_index = inorder_map[root_val]
        
        # Calculate left subtree size
        left_size = root_index - in_start
        
        # Build left and right subtrees
        root.left = build(pre_start + 1, pre_start + left_size,
                         in_start, root_index - 1)
        root.right = build(pre_start + left_size + 1, pre_end,
                          root_index + 1, in_end)
        
        return root
    
    return build(0, len(preorder) - 1, 0, len(inorder) - 1)
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function buildTree(preorder, inorder) {
    """
    Build tree using preorder and inorder traversals.
    
    Time: O(n) - process each node once
    Space: O(n) - hashmap and recursion stack
    """
    # Create hashmap for O(1) lookup of root in inorder
    inorder_map = {val: idx for idx, val in enumerate(inorder)}
    
    function build(pre_start, pre_end, in_start, in_end) {
        if pre_start > pre_end:
            return null
        
        # Root is first element in preorder range
        root_val = preorder[pre_start]
        root = TreeNode(root_val)
        
        # Find root position in inorder
        root_index = inorder_map[root_val]
        
        # Calculate left subtree size
        left_size = root_index - in_start
        
        # Build left and right subtrees
        root.left = build(pre_start + 1, pre_start + left_size,
                         in_start, root_index - 1)
        root.right = build(pre_start + left_size + 1, pre_end,
                          root_index + 1, in_end)
        
        return root
    
    return build(0, len(preorder) - 1, 0, len(inorder) - 1)
```

### Complexity Analysis

- **Time Complexity:** O(n) - Visit each node once, hashmap lookups are O(1)
- **Space Complexity:** O(n) - Hashmap stores n elements, recursion depth O(h)

### Test Cases

**Test 1:** Standard tree
- Input: "([3,9,20,15,7], [9,3,15,20,7])"
- Expected: "[3,9,20,None,None,15,7]"

**Test 2:** Single node
- Input: "([-1], [-1])"
- Expected: "[-1]"

**Test 3:** Left and right children
- Input: "([1,2,3], [2,1,3])"
- Expected: "[1,2,None,None,3]"

**Test 4:** Only left child
- Input: "([1,2], [2,1])"
- Expected: "[1,2]"

**Test 5:** Only right child
- Input: "([1,2], [1,2])"
- Expected: "[1,None,2]"

**Test 6:** Complete tree
- Input: "([1,2,4,5,3,6,7], [4,2,5,1,6,3,7])"
- Expected: "[1,2,3,4,5,6,7]"

---

## 6. Serialize and Deserialize Binary Tree

**Difficulty:** hard
**Concept:** trees
**Family:** trees:construction

### Description

Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment. Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.

### Key Insight

Use preorder DFS with null markers. Serialize: traverse preorder, appending node values and "null" for empty nodes. Deserialize: split string and recursively build tree using preorder pattern. Alternatively, use BFS level-order traversal with queue. Both approaches maintain tree structure with null markers.

### Examples

**Example 1:**
- Input: root = [1,2,3,null,null,4,5]
- Output: "1,2,null,null,3,4,null,null,5,null,null"
- Explanation: Serialize tree to string with null markers, then deserialize back to original tree.

**Example 2:**
- Input: root = []
- Output: "null"
- Explanation: Empty tree serializes to null marker.

**Example 3:**
- Input: root = [1]
- Output: "1,null,null"
- Explanation: Single node with two null children.

### Hints

1. Use preorder traversal (root, left, right) for serialization
2. Mark null nodes with a special value like "null" or "#"
3. Separate values with a delimiter like comma
4. For deserialization, split the string and use an index/iterator to track position
5. Recursively build: read current value, if "null" return None, else create node and build left/right
6. Alternative: use BFS with a queue for level-order serialization

### Starter Code

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Codec:
    def serialize(self, root):
        """Encode tree to string using preorder DFS.
        
        Args:
            root: TreeNode - root of tree
        
        Returns:
            str - serialized tree
        """
        # TODO: Implement preorder traversal
        # Append node values or "null" for empty nodes
        # Join with delimiter (e.g., comma)
        
        pass
    
    def deserialize(self, data):
        """Decode string to tree.
        
        Args:
            data: str - serialized tree
        
        Returns:
            TreeNode - root of reconstructed tree
        """
        # TODO: Split string by delimiter
        # Use index or queue to track current position
        # Recursively build tree using preorder pattern
        
        pass

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

class Codec:
    function serialize(self, root) {
        """Encode tree to string using preorder DFS.
        
        Args:
            root: TreeNode - root of tree
        
        Returns:
            str - serialized tree
        """
        // TODO: Implement preorder traversal
        # Append node values or "null" for empty nodes
        # Join with delimiter (e.g., comma)
  // TODO: implement
    function deserialize(self, data) {
        """Decode string to tree.
        
        Args:
            data: str - serialized tree
        
        Returns:
            TreeNode - root of reconstructed tree
        """
        // TODO: Split string by delimiter
        # Use index or queue to track current position
        # Recursively build tree using preorder pattern
  // TODO: implement
function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Solution

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Codec:
    def serialize(self, root):
        """
        Serialize using preorder DFS.
        
        Time: O(n) - visit each node once
        Space: O(n) - result string
        """
        result = []
        
        def dfs(node):
            if not node:
                result.append("null")
                return
            
            result.append(str(node.val))
            dfs(node.left)
            dfs(node.right)
        
        dfs(root)
        return ",".join(result)
    
    def deserialize(self, data):
        """
        Deserialize using preorder pattern.
        
        Time: O(n) - process each value once
        Space: O(n) - recursion stack and tree
        """
        values = data.split(",")
        self.index = 0
        
        def dfs():
            if values[self.index] == "null":
                self.index += 1
                return None
            
            node = TreeNode(int(values[self.index]))
            self.index += 1
            node.left = dfs()
            node.right = dfs()
            return node
        
        return dfs()

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

class Codec:
    function serialize(self, root) {
        """
        Serialize using preorder DFS.
        
        Time: O(n) - visit each node once
        Space: O(n) - result string
        """
        result = []
        
        function dfs(node) {
            if not node:
                result.append("null")
                return
            
            result.append(str(node.val))
            dfs(node.left)
            dfs(node.right)
        
        dfs(root)
        return ",".join(result)
    
    function deserialize(self, data) {
        """
        Deserialize using preorder pattern.
        
        Time: O(n) - process each value once
        Space: O(n) - recursion stack and tree
        """
        values = data.split(",")
        self.index = 0
        
        function dfs() {
            if values[self.index] == "null":
                self.index += 1
                return null
            
            node = TreeNode(int(values[self.index]))
            self.index += 1
            node.left = dfs()
            node.right = dfs()
            return node
        
        return dfs()

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Complexity Analysis

- **Time Complexity:** O(n) - Both serialize and deserialize visit each node once
- **Space Complexity:** O(n) - Result string and recursion stack both use O(n) space

### Test Cases

**Test 1:** Standard tree
- Input: "([1,2,3,None,None,4,5])"
- Expected: "[1,2,3,None,None,4,5]"

**Test 2:** Empty tree
- Input: "([])"
- Expected: "[]"

**Test 3:** Single node
- Input: "([1])"
- Expected: "[1]"

**Test 4:** Only left child
- Input: "([1,2])"
- Expected: "[1,2]"

**Test 5:** Only right child
- Input: "([1,None,2])"
- Expected: "[1,None,2]"

**Test 6:** Complete binary tree
- Input: "([1,2,3,4,5,6,7])"
- Expected: "[1,2,3,4,5,6,7]"

---

## 7. Flatten Binary Tree to Linked List

**Difficulty:** medium
**Concept:** trees
**Family:** trees:transformation

### Description

Given the root of a binary tree, flatten the tree into a "linked list": The "linked list" should use the same TreeNode class where the right child pointer points to the next node in the list and the left child pointer is always null. The "linked list" should be in the same order as a preorder traversal of the binary tree.

### Key Insight

Use modified preorder traversal. For each node, save the right subtree, flatten left subtree and move it to right, then append the saved right subtree to the end of the flattened left. Alternatively, use reverse postorder (right, left, root) and maintain a prev pointer to build the list backwards.

### Examples

**Example 1:**
- Input: root = [1,2,5,3,4,null,6]
- Output: [1,null,2,null,3,null,4,null,5,null,6]
- Explanation: Preorder: 1,2,3,4,5,6. Flatten to right-only linked list.

**Example 2:**
- Input: root = []
- Output: []
- Explanation: Empty tree remains empty.

**Example 3:**
- Input: root = [0]
- Output: [0]
- Explanation: Single node has no children.

### Hints

1. The flattened list should follow preorder traversal: root, left subtree, right subtree
2. Approach 1: For each node, temporarily save right, move left to right, find end, attach saved right
3. Approach 2: Use reverse postorder (right, left, root) with prev pointer
4. In reverse postorder: current.right = prev, current.left = None, prev = current
5. Reverse postorder builds the list from back to front
6. Both approaches work in O(n) time, O(1) extra space (excluding recursion stack)

### Starter Code

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def flatten(root):
    """
    Flatten tree to linked list in-place (preorder).
    
    Args:
        root: TreeNode - root of tree (modified in-place)
    
    Returns:
        None - modifies tree in-place
    """
    # TODO: Approach 1 - Modified preorder:
    # For each node:
    #   1. Save right subtree temporarily
    #   2. Move left subtree to right
    #   3. Set left to None
    #   4. Find end of new right subtree
    #   5. Attach saved right subtree
    
    # TODO: Approach 2 - Reverse postorder with prev pointer:
    # Traverse: right, left, root
    # Maintain prev pointer
    # Set current.right = prev, current.left = None
    
    pass

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function flatten(root) {
    """
    Flatten tree to linked list in-place (preorder).
    
    Args:
        root: TreeNode - root of tree (modified in-place)
    
    Returns:
        null - modifies tree in-place
    """
    // TODO: Approach 1 - Modified preorder:
    # For each node:
    #   1. Save right subtree temporarily
    #   2. Move left subtree to right
    #   3. Set left to null
    #   4. Find end of new right subtree
    #   5. Attach saved right subtree
    
    // TODO: Approach 2 - Reverse postorder with prev pointer:
    # Traverse: right, left, root
    # Maintain prev pointer
    # Set current.right = prev, current.left = null
  // TODO: implement
function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Solution

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def flatten(root):
    """
    Flatten using reverse postorder with prev pointer.
    
    Time: O(n) - visit each node once
    Space: O(h) - recursion stack
    """
    # Use nonlocal to maintain prev across recursive calls
    prev = [None]
    
    def dfs(node):
        if not node:
            return
        
        # Reverse postorder: right, left, then current
        dfs(node.right)
        dfs(node.left)
        
        # Set current node's right to prev, left to None
        node.right = prev[0]
        node.left = None
        prev[0] = node
    
    dfs(root)

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function flatten(root) {
    """
    Flatten using reverse postorder with prev pointer.
    
    Time: O(n) - visit each node once
    Space: O(h) - recursion stack
    """
    # Use nonlocal to maintain prev across recursive calls
    prev = [null]
    
    function dfs(node) {
        if not node:
            return
        
        # Reverse postorder: right, left, then current
        dfs(node.right)
        dfs(node.left)
        
        # Set current node's right to prev, left to null
        node.right = prev[0]
        node.left = null
        prev[0] = node
    
    dfs(root)

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Complexity Analysis

- **Time Complexity:** O(n) - Visit each node exactly once
- **Space Complexity:** O(h) - Recursion stack depth (O(log n) balanced, O(n) skewed)

### Test Cases

**Test 1:** Standard tree
- Input: "([1,2,5,3,4,None,6])"
- Expected: "[1,None,2,None,3,None,4,None,5,None,6]"

**Test 2:** Empty tree
- Input: "([])"
- Expected: "[]"

**Test 3:** Single node
- Input: "([0])"
- Expected: "[0]"

**Test 4:** Only left child
- Input: "([1,2])"
- Expected: "[1,None,2]"

**Test 5:** Only right child
- Input: "([1,None,2])"
- Expected: "[1,None,2]"

**Test 6:** Complete tree
- Input: "([1,2,3,4,5,6,7])"
- Expected: "[1,None,2,None,4,None,5,None,3,None,6,None,7]"

---

## 8. Binary Tree Inorder Traversal

**Difficulty:** easy
**Concept:** trees
**Family:** trees:dfs-traversal

### Description

Given the root of a binary tree, return the inorder traversal of its nodes' values. Follow up: Recursive solution is trivial, could you do it iteratively?

### Key Insight

Inorder: left, root, right. Recursive is simple. Iterative: use stack to simulate recursion. Go left as far as possible (pushing nodes), then pop, visit, and go right once. This simulates the recursive call stack.

### Examples

**Example 1:**
- Input: root = [1,null,2,3]
- Output: [1,3,2]
- Explanation: Inorder traversal: left(none), root(1), right: left(3), root(2), right(none).

**Example 2:**
- Input: root = []
- Output: []
- Explanation: Empty tree.

**Example 3:**
- Input: root = [1]
- Output: [1]
- Explanation: Single node.

### Hints

1. Inorder: process left subtree, then root, then right subtree
2. Use a stack to track nodes while going left
3. Pattern: go left (push to stack), pop (visit), go right once
4. Continue while current node exists OR stack is not empty
5. When going left: while current: stack.append(current); current = current.left
6. After reaching leftmost: current = stack.pop(); result.append(current.val); current = current.right

### Starter Code

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorderTraversal(root):
    """
    Inorder traversal iteratively using stack.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        List[int] - inorder traversal
    """
    # TODO: Initialize result list and stack
    
    # TODO: Start with current = root
    
    # TODO: While current or stack:
    #   - Go left as far as possible, pushing to stack
    #   - Pop from stack, add value to result
    #   - Move to right child
    
    pass

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function inorderTraversal(root) {
    """
    Inorder traversal iteratively using stack.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        Array - inorder traversal
    """
    // TODO: Initialize result list and stack
    
    // TODO: Start with current = root
    
    // TODO: While current or stack:
    #   - Go left as far as possible, pushing to stack
    #   - Pop from stack, add value to result
    #   - Move to right child
  // TODO: implement
function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Solution

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorderTraversal(root):
    """
    Iterative inorder using stack.
    
    Time: O(n) - visit each node once
    Space: O(h) - stack depth
    """
    result = []
    stack = []
    current = root
    
    while current or stack:
        # Go left as far as possible
        while current:
            stack.append(current)
            current = current.left
        
        # Pop and visit
        current = stack.pop()
        result.append(current.val)
        
        # Go right once
        current = current.right
    
    return result

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function inorderTraversal(root) {
    """
    Iterative inorder using stack.
    
    Time: O(n) - visit each node once
    Space: O(h) - stack depth
    """
    result = []
    stack = []
    current = root
    
    while current or stack:
        # Go left as far as possible
        while current:
            stack.append(current)
            current = current.left
        
        # Pop and visit
        current = stack.pop()
        result.append(current.val)
        
        # Go right once
        current = current.right
    
    return result

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Complexity Analysis

- **Time Complexity:** O(n) - Visit each node exactly once
- **Space Complexity:** O(h) - Stack depth equals tree height

### Test Cases

**Test 1:** Right-skewed with left child
- Input: "([1,None,2,3])"
- Expected: "[1,3,2]"

**Test 2:** Empty tree
- Input: "([])"
- Expected: "[]"

**Test 3:** Single node
- Input: "([1])"
- Expected: "[1]"

**Test 4:** Standard tree
- Input: "([1,2,3,4,5])"
- Expected: "[4,2,5,1,3]"

**Test 5:** Tree with gaps
- Input: "([1,2,3,None,None,4,5])"
- Expected: "[2,1,4,3,5]"

**Test 6:** BST (sorted output)
- Input: "([5,3,7,2,4,6,8])"
- Expected: "[2,3,4,5,6,7,8]"

**Test 7:** PERFORMANCE: Large skewed tree (10K nodes) - Must use O(n) traversal with stack
- Input: "(list(range(10000)))"
- Expected: "list(range(10000))"

---

## 9. Binary Tree Preorder Traversal

**Difficulty:** easy
**Concept:** trees
**Family:** trees:dfs-traversal

### Description

Given the root of a binary tree, return the preorder traversal of its nodes' values. Follow up: Recursive solution is trivial, could you do it iteratively?

### Key Insight

Preorder: root, left, right. Iterative: use stack. Visit node immediately when popped, then push right child first (so left is processed first from stack). This ensures left subtree is fully processed before right.

### Examples

**Example 1:**
- Input: root = [1,null,2,3]
- Output: [1,2,3]
- Explanation: Preorder: root(1), left(none), right: root(2), left(3), right(none).

**Example 2:**
- Input: root = []
- Output: []
- Explanation: Empty tree.

**Example 3:**
- Input: root = [1]
- Output: [1]
- Explanation: Single node.

### Hints

1. Preorder: visit root first, then left subtree, then right subtree
2. Use a stack, starting with root
3. When popping a node: visit it immediately, then push children
4. Push right child first, then left child (so left is on top of stack)
5. This ensures left subtree is fully processed before right subtree
6. Continue until stack is empty

### Starter Code

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def preorderTraversal(root):
    """
    Preorder traversal iteratively using stack.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        List[int] - preorder traversal
    """
    # TODO: Initialize result list and stack
    
    # TODO: If root exists, push to stack
    
    # TODO: While stack not empty:
    #   - Pop node from stack
    #   - Visit (add value to result)
    #   - Push right child first, then left (so left is processed first)
    
    pass

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function preorderTraversal(root) {
    """
    Preorder traversal iteratively using stack.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        Array - preorder traversal
    """
    // TODO: Initialize result list and stack
    
    // TODO: If root exists, push to stack
    
    // TODO: While stack not empty:
    #   - Pop node from stack
    #   - Visit (add value to result)
    #   - Push right child first, then left (so left is processed first)
  // TODO: implement
function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Solution

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def preorderTraversal(root):
    """
    Iterative preorder using stack.
    
    Time: O(n) - visit each node once
    Space: O(h) - stack depth
    """
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        # Pop and visit immediately
        node = stack.pop()
        result.append(node.val)
        
        # Push right first, then left (so left is processed first)
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    
    return result

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function preorderTraversal(root) {
    """
    Iterative preorder using stack.
    
    Time: O(n) - visit each node once
    Space: O(h) - stack depth
    """
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        # Pop and visit immediately
        node = stack.pop()
        result.append(node.val)
        
        # Push right first, then left (so left is processed first)
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    
    return result

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Complexity Analysis

- **Time Complexity:** O(n) - Visit each node exactly once
- **Space Complexity:** O(h) - Stack depth equals tree height

### Test Cases

**Test 1:** Right-skewed with left child
- Input: "([1,None,2,3])"
- Expected: "[1,2,3]"

**Test 2:** Empty tree
- Input: "([])"
- Expected: "[]"

**Test 3:** Single node
- Input: "([1])"
- Expected: "[1]"

**Test 4:** Standard tree
- Input: "([1,2,3,4,5])"
- Expected: "[1,2,4,5,3]"

**Test 5:** Tree with gaps
- Input: "([1,2,3,None,None,4,5])"
- Expected: "[1,2,3,4,5]"

**Test 6:** Complete tree
- Input: "([5,3,7,2,4,6,8])"
- Expected: "[5,3,2,4,7,6,8]"

---

## 10. Binary Tree Postorder Traversal

**Difficulty:** hard
**Concept:** trees
**Family:** trees:dfs-traversal

### Description

Given the root of a binary tree, return the postorder traversal of its nodes' values. Follow up: Recursive solution is trivial, could you do it iteratively?

### Key Insight

Postorder: left, right, root. Hardest iterative traversal. Method 1: Use two stacks - first does reverse postorder (root, right, left), second reverses it. Method 2: Use one stack with prev pointer to track whether we're coming from left, right, or parent. Method 3: Modified preorder (root, right, left) then reverse result.

### Examples

**Example 1:**
- Input: root = [1,null,2,3]
- Output: [3,2,1]
- Explanation: Postorder: left(none), right: left(3), right(none), root(2), root(1).

**Example 2:**
- Input: root = []
- Output: []
- Explanation: Empty tree.

**Example 3:**
- Input: root = [1]
- Output: [1]
- Explanation: Single node.

### Hints

1. Postorder: process left subtree, right subtree, then root
2. Reverse of postorder is root, right, left (almost preorder but reversed children)
3. Method 1: Do reverse postorder using stack, push to second stack, then pop second stack
4. Method 2: Modified preorder with children swapped: visit root, push left first, then right
5. After modified preorder, reverse the result to get postorder
6. Two-stack is clearer but uses O(n) space, reverse approach uses O(1) extra space

### Starter Code

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def postorderTraversal(root):
    """
    Postorder traversal iteratively using two stacks.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        List[int] - postorder traversal
    """
    # TODO: Method - Use two stacks or reverse preorder
    
    # TODO: Two-stack approach:
    # Stack1: regular traversal (root, then right, then left)
    # Stack2: collects nodes in reverse postorder
    # Pop from stack2 to get postorder
    
    # TODO: Or: Do modified preorder (root, right, left)
    # Then reverse the result
    
    pass

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function postorderTraversal(root) {
    """
    Postorder traversal iteratively using two stacks.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        Array - postorder traversal
    """
    // TODO: Method - Use two stacks or reverse preorder
    
    // TODO: Two-stack approach:
    # Stack1: regular traversal (root, then right, then left)
    # Stack2: collects nodes in reverse postorder
    # Pop from stack2 to get postorder
    
    // TODO: Or: Do modified preorder (root, right, left)
    # Then reverse the result
  // TODO: implement
function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Solution

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def postorderTraversal(root):
    """
    Iterative postorder using modified preorder then reverse.
    
    Time: O(n) - visit each node once
    Space: O(h) - stack depth
    """
    if not root:
        return []
    
    stack = [root]
    result = []
    
    # Modified preorder: root, right, left
    while stack:
        node = stack.pop()
        result.append(node.val)
        
        # Push left first, then right (opposite of preorder)
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
    
    # Reverse to get postorder
    return result[::-1]

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function postorderTraversal(root) {
    """
    Iterative postorder using modified preorder then reverse.
    
    Time: O(n) - visit each node once
    Space: O(h) - stack depth
    """
    if not root:
        return []
    
    stack = [root]
    result = []
    
    # Modified preorder: root, right, left
    while stack:
        node = stack.pop()
        result.append(node.val)
        
        # Push left first, then right (opposite of preorder)
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
    
    # Reverse to get postorder
    return result[::-1]

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Complexity Analysis

- **Time Complexity:** O(n) - Visit each node once, reverse is O(n)
- **Space Complexity:** O(h) - Stack depth plus O(n) for result (which is required output)

### Test Cases

**Test 1:** Right-skewed with left child
- Input: "([1,None,2,3])"
- Expected: "[3,2,1]"

**Test 2:** Empty tree
- Input: "([])"
- Expected: "[]"

**Test 3:** Single node
- Input: "([1])"
- Expected: "[1]"

**Test 4:** Standard tree
- Input: "([1,2,3,4,5])"
- Expected: "[4,5,2,3,1]"

**Test 5:** Tree with gaps
- Input: "([1,2,3,None,None,4,5])"
- Expected: "[2,4,5,3,1]"

**Test 6:** Complete tree
- Input: "([5,3,7,2,4,6,8])"
- Expected: "[2,4,3,6,8,7,5]"

---

## 11. Binary Tree Level Order Traversal

**Difficulty:** medium
**Concept:** trees
**Family:** trees:bfs-level-order

### Description

Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).

### Key Insight

Use BFS with queue. Key: capture level size before inner loop. Process exactly level_size nodes in each iteration. Add their children to queue for next level. This separates levels cleanly.

### Examples

**Example 1:**
- Input: root = [3,9,20,null,null,15,7]
- Output: [[3],[9,20],[15,7]]
- Explanation: Level 0: [3], Level 1: [9,20], Level 2: [15,7].

**Example 2:**
- Input: root = [1]
- Output: [[1]]
- Explanation: Single node at level 0.

**Example 3:**
- Input: root = []
- Output: []
- Explanation: Empty tree.

### Hints

1. Use BFS (breadth-first search) with a queue
2. Start by adding root to queue
3. CRITICAL: Before inner loop, capture level_size = len(queue)
4. Inner loop: for _ in range(level_size): process exactly this many nodes
5. For each node: dequeue, add value to current_level, enqueue children
6. After inner loop, append current_level to result

### Starter Code

**Python:**
```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def levelOrder(root):
    """
    Level order traversal using BFS.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        List[List[int]] - nodes grouped by level
    """
    # TODO: Handle empty tree
    
    # TODO: Initialize queue with root
    
    # TODO: While queue not empty:
    #   - Get level_size = len(queue) BEFORE inner loop
    #   - Process exactly level_size nodes
    #   - Add their children to queue
    #   - Append current level to result
    
    pass

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
from collections import deque

class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function levelOrder(root) {
    """
    Level order traversal using BFS.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        Array] - nodes grouped by level
    """
    // TODO: Handle empty tree
    
    // TODO: Initialize queue with root
    
    // TODO: While queue not empty:
    #   - Get level_size = len(queue) BEFORE inner loop
    #   - Process exactly level_size nodes
    #   - Add their children to queue
    #   - Append current level to result
  // TODO: implement
function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Solution

**Python:**
```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def levelOrder(root):
    """
    BFS level order traversal.
    
    Time: O(n) - visit each node once
    Space: O(w) - queue size equals max width of tree
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)  # CRITICAL: capture before loop
        current_level = []
        
        # Process all nodes at current level
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            # Add children for next level
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(current_level)
    
    return result

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
from collections import deque

class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function levelOrder(root) {
    """
    BFS level order traversal.
    
    Time: O(n) - visit each node once
    Space: O(w) - queue size equals max width of tree
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)  # CRITICAL: capture before loop
        current_level = []
        
        # Process all nodes at current level
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            # Add children for next level
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(current_level)
    
    return result

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Complexity Analysis

- **Time Complexity:** O(n) - Visit each node exactly once
- **Space Complexity:** O(w) - Queue size equals maximum width of tree

### Test Cases

**Test 1:** Standard tree
- Input: "([3,9,20,None,None,15,7])"
- Expected: "[[3],[9,20],[15,7]]"

**Test 2:** Single node
- Input: "([1])"
- Expected: "[[1]]"

**Test 3:** Empty tree
- Input: "([])"
- Expected: "[]"

**Test 4:** Complete tree
- Input: "([1,2,3,4,5,6,7])"
- Expected: "[[1],[2,3],[4,5,6,7]]"

**Test 5:** Left-skewed
- Input: "([1,2,None,3,None,4])"
- Expected: "[[1],[2],[3],[4]]"

**Test 6:** Right-skewed
- Input: "([1,None,2,None,3,None,4])"
- Expected: "[[1],[2],[3],[4]]"

**Test 7:** PERFORMANCE: Large skewed tree (10K nodes) - Must use O(n) BFS with queue
- Input: "(list(range(10000)))"
- Expected: "str([[i] for i in range(10000)])"

---

## 12. Binary Tree Zigzag Level Order Traversal

**Difficulty:** medium
**Concept:** trees
**Family:** trees:bfs-level-order

### Description

Given the root of a binary tree, return the zigzag level order traversal of its nodes' values. (i.e., from left to right, then right to left for the next level and alternate between).

### Key Insight

Use standard level-order BFS, but track level number. On even levels (0, 2, 4...), append normally left-to-right. On odd levels (1, 3, 5...), reverse the level list before adding to result. Alternatively, use deque and alternate append/appendleft.

### Examples

**Example 1:**
- Input: root = [3,9,20,null,null,15,7]
- Output: [[3],[20,9],[15,7]]
- Explanation: Level 0: [3] (L→R), Level 1: [20,9] (R→L), Level 2: [15,7] (L→R).

**Example 2:**
- Input: root = [1]
- Output: [[1]]
- Explanation: Single node.

**Example 3:**
- Input: root = []
- Output: []
- Explanation: Empty tree.

### Hints

1. Use standard BFS level-order traversal
2. Track level number (start with 0)
3. For even levels (0, 2, 4...), append normally
4. For odd levels (1, 3, 5...), reverse the level list before adding to result
5. Alternatively: check if level % 2 == 1, then reverse
6. Or use deque and alternate between appendleft/append based on level

### Starter Code

**Python:**
```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def zigzagLevelOrder(root):
    """
    Zigzag level order traversal.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        List[List[int]] - zigzag level order
    """
    # TODO: Similar to regular level order, but track level number
    
    # TODO: For even levels (0, 2, 4...), add nodes left-to-right
    
    # TODO: For odd levels (1, 3, 5...), reverse before adding to result
    
    pass

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
from collections import deque

class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function zigzagLevelOrder(root) {
    """
    Zigzag level order traversal.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        Array] - zigzag level order
    """
    // TODO: Similar to regular level order, but track level number
    
    // TODO: For even levels (0, 2, 4...), add nodes left-to-right
    
    // TODO: For odd levels (1, 3, 5...), reverse before adding to result
  // TODO: implement
function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Solution

**Python:**
```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def zigzagLevelOrder(root):
    """
    Zigzag traversal with direction toggle.
    
    Time: O(n) - visit each node once
    Space: O(w) - queue width
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    left_to_right = True
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        # Reverse on odd levels
        if not left_to_right:
            current_level.reverse()
        
        result.append(current_level)
        left_to_right = not left_to_right  # Toggle direction
    
    return result

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
from collections import deque

class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function zigzagLevelOrder(root) {
    """
    Zigzag traversal with direction toggle.
    
    Time: O(n) - visit each node once
    Space: O(w) - queue width
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    left_to_right = true
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        # Reverse on odd levels
        if not left_to_right:
            current_level.reverse()
        
        result.append(current_level)
        left_to_right = not left_to_right  # Toggle direction
    
    return result

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Complexity Analysis

- **Time Complexity:** O(n) - Visit each node once, reversing levels is O(level width)
- **Space Complexity:** O(w) - Queue size equals maximum width of tree

### Test Cases

**Test 1:** Standard zigzag
- Input: "([3,9,20,None,None,15,7])"
- Expected: "[[3],[20,9],[15,7]]"

**Test 2:** Single node
- Input: "([1])"
- Expected: "[[1]]"

**Test 3:** Empty tree
- Input: "([])"
- Expected: "[]"

**Test 4:** Complete tree
- Input: "([1,2,3,4,5,6,7])"
- Expected: "[[1],[3,2],[4,5,6,7]]"

**Test 5:** Incomplete tree
- Input: "([1,2,3,4,None,None,5])"
- Expected: "[[1],[3,2],[4,5]]"

**Test 6:** Two levels
- Input: "([1,2])"
- Expected: "[[1],[2]]"

---

## 13. Symmetric Tree

**Difficulty:** easy
**Concept:** trees
**Family:** trees:structural-check

### Description

Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).

### Key Insight

Use helper function isMirror(left, right). Both null → symmetric. One null → not symmetric. Values different → not symmetric. Recursively check: left.left with right.right AND left.right with right.left. This is the cross-check that validates symmetry.

### Examples

**Example 1:**
- Input: root = [1,2,2,3,4,4,3]
- Output: true
- Explanation: Tree is symmetric.

**Example 2:**
- Input: root = [1,2,2,null,3,null,3]
- Output: false
- Explanation: Not symmetric - inner nodes are 3, but outer nodes are null.

**Example 3:**
- Input: root = [1]
- Output: true
- Explanation: Single node is symmetric.

### Hints

1. Create helper function isMirror(left, right) to compare two subtrees
2. Base cases: if not left and not right: return True
3. If not left or not right: return False (one is null, other is not)
4. Check if left.val == right.val
5. Recursively check: left.left mirrors right.right AND left.right mirrors right.left
6. This is the KEY: cross-check outer and inner children

### Starter Code

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def isSymmetric(root):
    """
    Check if tree is symmetric (mirror image).
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        bool - True if symmetric, False otherwise
    """
    def isMirror(left, right):
        # TODO: Both null → symmetric
        
        # TODO: One null → not symmetric
        
        # TODO: Values different → not symmetric
        
        # TODO: Cross-check: left.left with right.right
        # AND left.right with right.left
        
        pass
    
    if not root:
        return True
    
    return isMirror(root.left, root.right)

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function isSymmetric(root) {
    """
    Check if tree is symmetric (mirror image).
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        bool - true if symmetric, false otherwise
    """
    function isMirror(left, right) {
        // TODO: Both null → symmetric
        
        // TODO: One null → not symmetric
        
        // TODO: Values different → not symmetric
        
        // TODO: Cross-check: left.left with right.right
        # AND left.right with right.left
  // TODO: implement
    if not root:
        return true
    
    return isMirror(root.left, root.right)

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Solution

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def isSymmetric(root):
    """
    Check symmetry using mirror comparison.
    
    Time: O(n) - visit each node once
    Space: O(h) - recursion stack
    """
    def isMirror(left, right):
        # Both null - symmetric
        if not left and not right:
            return True
        
        # One null - not symmetric
        if not left or not right:
            return False
        
        # Values must match, and cross-check children
        return (left.val == right.val and
                isMirror(left.left, right.right) and
                isMirror(left.right, right.left))
    
    if not root:
        return True
    
    return isMirror(root.left, root.right)

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function isSymmetric(root) {
    """
    Check symmetry using mirror comparison.
    
    Time: O(n) - visit each node once
    Space: O(h) - recursion stack
    """
    function isMirror(left, right) {
        # Both null - symmetric
        if not left and not right:
            return true
        
        # One null - not symmetric
        if not left or not right:
            return false
        
        # Values must match, and cross-check children
        return (left.val == right.val and
                isMirror(left.left, right.right) and
                isMirror(left.right, right.left))
    
    if not root:
        return true
    
    return isMirror(root.left, root.right)

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Complexity Analysis

- **Time Complexity:** O(n) - Visit each node once in worst case
- **Space Complexity:** O(h) - Recursion stack depth equals tree height

### Test Cases

**Test 1:** Symmetric tree
- Input: "([1,2,2,3,4,4,3])"
- Expected: "True"

**Test 2:** Not symmetric
- Input: "([1,2,2,None,3,None,3])"
- Expected: "False"

**Test 3:** Single node
- Input: "([1])"
- Expected: "True"

**Test 4:** Empty tree is symmetric
- Input: "([])"
- Expected: "True"

**Test 5:** Simple symmetric
- Input: "([1,2,2])"
- Expected: "True"

**Test 6:** Different values
- Input: "([1,2,3])"
- Expected: "False"

---

## 14. Balanced Binary Tree

**Difficulty:** easy
**Concept:** trees
**Family:** trees:tree-metrics

### Description

Given a binary tree, determine if it is height-balanced. A height-balanced binary tree is a binary tree in which the depth of the two subtrees of every node never differs by more than one.

### Key Insight

Use postorder DFS to compute heights bottom-up. Return -1 to signal imbalance (early termination). Otherwise return height. At each node, check if |left_height - right_height| > 1. This avoids redundant height calculations and detects imbalance early.

### Examples

**Example 1:**
- Input: root = [3,9,20,null,null,15,7]
- Output: true
- Explanation: Heights differ by at most 1 at each node.

**Example 2:**
- Input: root = [1,2,2,3,3,null,null,4,4]
- Output: false
- Explanation: Root's left subtree has height 3, right has height 1 (diff > 1).

**Example 3:**
- Input: root = []
- Output: true
- Explanation: Empty tree is balanced.

### Hints

1. Use -1 as a signal for imbalance (allows early termination)
2. Helper function returns height if balanced, -1 if imbalanced
3. Base case: null node has height 0
4. If left_height == -1 or right_height == -1: return -1 (propagate imbalance)
5. If abs(left_height - right_height) > 1: return -1 (current node is imbalanced)
6. Otherwise: return 1 + max(left_height, right_height)

### Starter Code

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def isBalanced(root):
    """
    Check if tree is height-balanced.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        bool - True if balanced, False otherwise
    """
    def checkBalance(node):
        # TODO: Base case - null node has height 0
        
        # TODO: Get left subtree height
        # If -1, propagate imbalance up
        
        # TODO: Get right subtree height
        # If -1, propagate imbalance up
        
        # TODO: Check if current node is balanced
        # If |left - right| > 1, return -1
        
        # TODO: Return height of current node: 1 + max(left, right)
        
        pass
    
    return checkBalance(root) != -1

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function isBalanced(root) {
    """
    Check if tree is height-balanced.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        bool - true if balanced, false otherwise
    """
    function checkBalance(node) {
        // TODO: Base case - null node has height 0
        
        // TODO: Get left subtree height
        # If -1, propagate imbalance up
        
        // TODO: Get right subtree height
        # If -1, propagate imbalance up
        
        // TODO: Check if current node is balanced
        # If |left - right| > 1, return -1
        
        // TODO: Return height of current node: 1 + max(left, right)
  // TODO: implement
    return checkBalance(root) != -1

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Solution

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def isBalanced(root):
    """
    Check balance using height calculation with -1 signal.
    
    Time: O(n) - visit each node once
    Space: O(h) - recursion stack
    """
    def checkBalance(node):
        # Null node has height 0
        if not node:
            return 0
        
        # Check left subtree
        left_height = checkBalance(node.left)
        if left_height == -1:
            return -1  # Propagate imbalance
        
        # Check right subtree
        right_height = checkBalance(node.right)
        if right_height == -1:
            return -1  # Propagate imbalance
        
        # Check if current node is balanced
        if abs(left_height - right_height) > 1:
            return -1  # Imbalanced at current node
        
        # Return height
        return 1 + max(left_height, right_height)
    
    return checkBalance(root) != -1

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function isBalanced(root) {
    """
    Check balance using height calculation with -1 signal.
    
    Time: O(n) - visit each node once
    Space: O(h) - recursion stack
    """
    function checkBalance(node) {
        # Null node has height 0
        if not node:
            return 0
        
        # Check left subtree
        left_height = checkBalance(node.left)
        if left_height == -1:
            return -1  # Propagate imbalance
        
        # Check right subtree
        right_height = checkBalance(node.right)
        if right_height == -1:
            return -1  # Propagate imbalance
        
        # Check if current node is balanced
        if abs(left_height - right_height) > 1:
            return -1  # Imbalanced at current node
        
        # Return height
        return 1 + max(left_height, right_height)
    
    return checkBalance(root) != -1

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Complexity Analysis

- **Time Complexity:** O(n) - Visit each node exactly once
- **Space Complexity:** O(h) - Recursion stack depth equals tree height

### Test Cases

**Test 1:** Balanced tree
- Input: "([3,9,20,None,None,15,7])"
- Expected: "True"

**Test 2:** Imbalanced deep left
- Input: "([1,2,2,3,3,None,None,4,4])"
- Expected: "False"

**Test 3:** Empty is balanced
- Input: "([])"
- Expected: "True"

**Test 4:** Single node
- Input: "([1])"
- Expected: "True"

**Test 5:** Complete tree
- Input: "([1,2,3,4,5,6,7])"
- Expected: "True"

**Test 6:** Left-skewed
- Input: "([1,2,None,3,None,4])"
- Expected: "False"

---

## 15. Minimum Depth of Binary Tree

**Difficulty:** easy
**Concept:** trees
**Family:** trees:tree-metrics

### Description

Given a binary tree, find its minimum depth. The minimum depth is the number of nodes along the shortest path from the root node down to the nearest leaf node. Note: A leaf is a node with no children.

### Key Insight

DFS approach: handle three cases carefully. (1) Leaf: return 1. (2) Only left child: must go left (cannot use null path). (3) Only right child: must go right. (4) Both children: return 1 + min(left, right). BFS approach is simpler: first leaf encountered is at minimum depth.

### Examples

**Example 1:**
- Input: root = [3,9,20,null,null,15,7]
- Output: 2
- Explanation: Shortest path is 3→9 with 2 nodes.

**Example 2:**
- Input: root = [2,null,3,null,4,null,5,null,6]
- Output: 5
- Explanation: Skewed tree requires traversing entire path.

**Example 3:**
- Input: root = [1]
- Output: 1
- Explanation: Single node has depth 1.

### Hints

1. A leaf node is a node with no children (not None itself)
2. CRITICAL: If only one child exists, you MUST go that direction (cannot use null path)
3. Case 1: if not root: return 0
4. Case 2: if not root.left and not root.right: return 1 (leaf)
5. Case 3: if not root.left: return 1 + minDepth(root.right) (only right child)
6. Case 4: if not root.right: return 1 + minDepth(root.left) (only left child)
7. Case 5: return 1 + min(minDepth(root.left), minDepth(root.right)) (both children)

### Starter Code

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def minDepth(root):
    """
    Find minimum depth to nearest leaf.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        int - minimum depth
    """
    # TODO: Handle empty tree
    
    # TODO: If leaf node, return 1
    
    # TODO: If only left child exists, return 1 + minDepth(left)
    # (cannot use null right path!)
    
    # TODO: If only right child exists, return 1 + minDepth(right)
    
    # TODO: Both children exist: return 1 + min(left, right)
    
    pass

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function minDepth(root) {
    """
    Find minimum depth to nearest leaf.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        int - minimum depth
    """
    // TODO: Handle empty tree
    
    // TODO: If leaf node, return 1
    
    // TODO: If only left child exists, return 1 + minDepth(left)
    # (cannot use null right path!)
    
    // TODO: If only right child exists, return 1 + minDepth(right)
    
    // TODO: Both children exist: return 1 + min(left, right)
  // TODO: implement
function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Solution

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def minDepth(root):
    """
    Find minimum depth using DFS.
    
    Time: O(n) - worst case visit all nodes
    Space: O(h) - recursion stack
    """
    if not root:
        return 0
    
    # Leaf node
    if not root.left and not root.right:
        return 1
    
    # Only right child exists
    if not root.left:
        return 1 + minDepth(root.right)
    
    # Only left child exists
    if not root.right:
        return 1 + minDepth(root.left)
    
    # Both children exist
    return 1 + min(minDepth(root.left), minDepth(root.right))

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function minDepth(root) {
    """
    Find minimum depth using DFS.
    
    Time: O(n) - worst case visit all nodes
    Space: O(h) - recursion stack
    """
    if not root:
        return 0
    
    # Leaf node
    if not root.left and not root.right:
        return 1
    
    # Only right child exists
    if not root.left:
        return 1 + minDepth(root.right)
    
    # Only left child exists
    if not root.right:
        return 1 + minDepth(root.left)
    
    # Both children exist
    return 1 + min(minDepth(root.left), minDepth(root.right))

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Complexity Analysis

- **Time Complexity:** O(n) - May need to visit all nodes in worst case
- **Space Complexity:** O(h) - Recursion stack depth equals tree height

### Test Cases

**Test 1:** Min path: 3→9
- Input: "([3,9,20,None,None,15,7])"
- Expected: "2"

**Test 2:** Right-skewed
- Input: "([2,None,3,None,4,None,5,None,6])"
- Expected: "5"

**Test 3:** Single node
- Input: "([1])"
- Expected: "1"

**Test 4:** Only left child
- Input: "([1,2])"
- Expected: "2"

**Test 5:** Only right child
- Input: "([1,None,2])"
- Expected: "2"

**Test 6:** Leaves at level 2
- Input: "([1,2,3,4,5])"
- Expected: "2"

---

## 16. Binary Tree Paths

**Difficulty:** easy
**Concept:** trees
**Family:** trees:path-sum

### Description

Given the root of a binary tree, return all root-to-leaf paths in any order. A leaf is a node with no children.

### Key Insight

Use DFS with path tracking. Build path string as you go down. When reaching a leaf, add complete path to result. Key: properly format path string with "->" separator. Can use path string or path list.

### Examples

**Example 1:**
- Input: root = [1,2,3,null,5]
- Output: ["1->2->5","1->3"]
- Explanation: Two paths from root to leaves: 1→2→5 and 1→3.

**Example 2:**
- Input: root = [1]
- Output: ["1"]
- Explanation: Single node is a leaf itself.

**Example 3:**
- Input: root = [1,2,3,4,5]
- Output: ["1->2->4","1->2->5","1->3"]
- Explanation: Three root-to-leaf paths.

### Hints

1. Use DFS to traverse from root to each leaf
2. Build path as string: start with str(node.val), then add "->" + str(node.val) for subsequent nodes
3. Path building: if path: path = path + "->" + str(node.val) else: path = str(node.val)
4. Leaf check: if not node.left and not node.right: result.append(path)
5. Recursively call dfs for left and right children with updated path
6. Alternative: use list for path and join with "->" when appending to result

### Starter Code

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def binaryTreePaths(root):
    """
    Return all root-to-leaf paths.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        List[str] - list of path strings
    """
    result = []
    
    def dfs(node, path):
        # TODO: Build path string
        # If path is empty: path = str(node.val)
        # Else: path = path + "->" + str(node.val)
        
        # TODO: Check if leaf node
        # If leaf: add path to result
        
        # TODO: Recursively explore children with updated path
        
        pass
    
    if root:
        dfs(root, "")
    
    return result

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function binaryTreePaths(root) {
    """
    Return all root-to-leaf paths.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        Array - list of path strings
    """
    result = []
    
    function dfs(node, path) {
        // TODO: Build path string
        # If path is empty: path = str(node.val)
        # Else: path = path + "->" + str(node.val)
        
        // TODO: Check if leaf node
        # If leaf: add path to result
        
        // TODO: Recursively explore children with updated path
  // TODO: implement
    if root:
        dfs(root, "")
    
    return result

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Solution

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def binaryTreePaths(root):
    """
    Find all root-to-leaf paths using DFS.
    
    Time: O(n) - visit each node once
    Space: O(h) - recursion stack
    """
    result = []
    
    def dfs(node, path):
        # Build current path
        path = path + "->" + str(node.val) if path else str(node.val)
        
        # Check if leaf
        if not node.left and not node.right:
            result.append(path)
            return
        
        # Explore children
        if node.left:
            dfs(node.left, path)
        if node.right:
            dfs(node.right, path)
    
    if root:
        dfs(root, "")
    
    return result

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function binaryTreePaths(root) {
    """
    Find all root-to-leaf paths using DFS.
    
    Time: O(n) - visit each node once
    Space: O(h) - recursion stack
    """
    result = []
    
    function dfs(node, path) {
        # Build current path
        path = path + "->" + str(node.val) if path else str(node.val)
        
        # Check if leaf
        if not node.left and not node.right:
            result.append(path)
            return
        
        # Explore children
        if node.left:
            dfs(node.left, path)
        if node.right:
            dfs(node.right, path)
    
    if root:
        dfs(root, "")
    
    return result

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Complexity Analysis

- **Time Complexity:** O(n) - Visit each node once, path building is O(h) per node
- **Space Complexity:** O(h) - Recursion stack depth, path storage is O(h)

### Test Cases

**Test 1:** Two paths
- Input: "([1,2,3,None,5])"
- Expected: "[\"1->2->5\",\"1->3\"]"

**Test 2:** Single node
- Input: "([1])"
- Expected: "[\"1\"]"

**Test 3:** Three paths
- Input: "([1,2,3,4,5])"
- Expected: "[\"1->2->4\",\"1->2->5\",\"1->3\"]"

**Test 4:** Only left child
- Input: "([1,2])"
- Expected: "[\"1->2\"]"

**Test 5:** Only right child
- Input: "([1,None,2])"
- Expected: "[\"1->2\"]"

**Test 6:** Multiple paths
- Input: "([5,3,8,1,None,None,9])"
- Expected: "[\"5->3->1\",\"5->8->9\"]"

---

## 17. Sum Root to Leaf Numbers

**Difficulty:** medium
**Concept:** trees
**Family:** trees:path-sum

### Description

You are given the root of a binary tree containing digits from 0 to 9 only. Each root-to-leaf path in the tree represents a number. For example, the root-to-leaf path 1 -> 2 -> 3 represents the number 123. Return the total sum of all root-to-leaf numbers. A leaf node is a node with no children.

### Key Insight

Use DFS with accumulated value. As you go down, multiply current accumulated value by 10 and add current node's value. When reaching a leaf, add the accumulated value to total sum. Use nonlocal or pass sum as parameter.

### Examples

**Example 1:**
- Input: root = [1,2,3]
- Output: 25
- Explanation: Path 1→2 represents 12. Path 1→3 represents 13. Total: 12 + 13 = 25.

**Example 2:**
- Input: root = [4,9,0,5,1]
- Output: 1026
- Explanation: Paths: 4→9→5 = 495, 4→9→1 = 491, 4→0 = 40. Total: 495 + 491 + 40 = 1026.

**Example 3:**
- Input: root = [1]
- Output: 1
- Explanation: Single node represents 1.

### Hints

1. Use DFS to traverse all paths from root to leaf
2. Maintain current number as you traverse: current_sum = current_sum * 10 + node.val
3. When reaching a leaf (no children), add current_sum to total
4. Use nonlocal total to accumulate sum across all paths
5. Example: path 1→2→3: start with 0 → 1 → 12 → 123
6. Alternative: return sum from DFS and add: return dfs(left) + dfs(right)

### Starter Code

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def sumNumbers(root):
    """
    Sum all root-to-leaf numbers.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        int - total sum of all path numbers
    """
    total = 0
    
    def dfs(node, current_sum):
        nonlocal total
        
        # TODO: Update current sum: current_sum = current_sum * 10 + node.val
        
        # TODO: If leaf, add current_sum to total
        
        # TODO: Recursively explore children with updated current_sum
        
        pass
    
    if root:
        dfs(root, 0)
    
    return total

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function sumNumbers(root) {
    """
    Sum all root-to-leaf numbers.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        int - total sum of all path numbers
    """
    total = 0
    
    function dfs(node, current_sum) {
        nonlocal total
        
        // TODO: Update current sum: current_sum = current_sum * 10 + node.val
        
        // TODO: If leaf, add current_sum to total
        
        // TODO: Recursively explore children with updated current_sum
  // TODO: implement
    if root:
        dfs(root, 0)
    
    return total

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Solution

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def sumNumbers(root):
    """
    Sum all path numbers using DFS.
    
    Time: O(n) - visit each node once
    Space: O(h) - recursion stack
    """
    total = 0
    
    def dfs(node, current_sum):
        nonlocal total
        
        if not node:
            return
        
        # Update current number
        current_sum = current_sum * 10 + node.val
        
        # If leaf, add to total
        if not node.left and not node.right:
            total += current_sum
            return
        
        # Explore children
        dfs(node.left, current_sum)
        dfs(node.right, current_sum)
    
    dfs(root, 0)
    return total

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function sumNumbers(root) {
    """
    Sum all path numbers using DFS.
    
    Time: O(n) - visit each node once
    Space: O(h) - recursion stack
    """
    total = 0
    
    function dfs(node, current_sum) {
        nonlocal total
        
        if not node:
            return
        
        # Update current number
        current_sum = current_sum * 10 + node.val
        
        # If leaf, add to total
        if not node.left and not node.right:
            total += current_sum
            return
        
        # Explore children
        dfs(node.left, current_sum)
        dfs(node.right, current_sum)
    
    dfs(root, 0)
    return total

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Complexity Analysis

- **Time Complexity:** O(n) - Visit each node exactly once
- **Space Complexity:** O(h) - Recursion stack depth equals tree height

### Test Cases

**Test 1:** 12 + 13 = 25
- Input: "([1,2,3])"
- Expected: "25"

**Test 2:** 495 + 491 + 40 = 1026
- Input: "([4,9,0,5,1])"
- Expected: "1026"

**Test 3:** Single node
- Input: "([1])"
- Expected: "1"

**Test 4:** Zero value
- Input: "([0])"
- Expected: "0"

**Test 5:** Path 1→0 = 10
- Input: "([1,0])"
- Expected: "10"

**Test 6:** Multiple paths
- Input: "([5,3,8,1,4,7,9])"
- Expected: "2975"

---

## 18. Count Complete Tree Nodes

**Difficulty:** medium
**Concept:** trees
**Family:** trees:tree-metrics

### Description

Given the root of a complete binary tree, return the number of the nodes in the tree. According to Wikipedia, every level, except possibly the last, is completely filled in a complete binary tree, and all nodes in the last level are as far left as possible. It can have between 1 and 2^h nodes inclusive at the last level h. Design an algorithm that runs in less than O(n) time complexity.

### Key Insight

Leverage complete tree property. Compute left height and right height. If equal, tree is perfect → return 2^h - 1. Otherwise, recursively count left and right subtrees plus 1 for root. This achieves O(log²n) by pruning perfect subtrees without visiting all nodes.

### Examples

**Example 1:**
- Input: root = [1,2,3,4,5,6]
- Output: 6
- Explanation: Complete tree with 6 nodes.

**Example 2:**
- Input: root = []
- Output: 0
- Explanation: Empty tree has 0 nodes.

**Example 3:**
- Input: root = [1]
- Output: 1
- Explanation: Single node.

### Hints

1. Complete tree property: all levels full except possibly last, which is filled left-to-right
2. Compute left height: go left from root repeatedly
3. Compute right height: go right from root repeatedly
4. If left_height == right_height: tree is perfect, count = 2^height - 1 (no need to visit all nodes!)
5. Otherwise: recursively count left and right subtrees: 1 + countNodes(left) + countNodes(right)
6. Time complexity: O(log²n) because each recursion level does O(log n) work and has O(log n) depth

### Starter Code

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def countNodes(root):
    """
    Count nodes in complete binary tree efficiently.
    
    Args:
        root: TreeNode - root of complete tree
    
    Returns:
        int - number of nodes
    """
    # TODO: Handle empty tree
    
    # TODO: Compute left height (go left repeatedly)
    
    # TODO: Compute right height (go right repeatedly)
    
    # TODO: If left_height == right_height:
    #   Tree is perfect, return 2^height - 1
    
    # TODO: Otherwise, recursively count:
    #   return 1 + countNodes(left) + countNodes(right)
    
    pass

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function countNodes(root) {
    """
    Count nodes in complete binary tree efficiently.
    
    Args:
        root: TreeNode - root of complete tree
    
    Returns:
        int - number of nodes
    """
    // TODO: Handle empty tree
    
    // TODO: Compute left height (go left repeatedly)
    
    // TODO: Compute right height (go right repeatedly)
    
    // TODO: If left_height == right_height:
    #   Tree is perfect, return 2^height - 1
    
    // TODO: Otherwise, recursively count:
    #   return 1 + countNodes(left) + countNodes(right)
  // TODO: implement
function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Solution

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def countNodes(root):
    """
    Count complete tree nodes in O(log²n).
    
    Time: O(log²n) - log n levels, each does log n height computation
    Space: O(log n) - recursion depth
    """
    if not root:
        return 0
    
    # Compute left height
    left_height = 0
    node = root
    while node.left:
        left_height += 1
        node = node.left
    
    # Compute right height
    right_height = 0
    node = root
    while node.right:
        right_height += 1
        node = node.right
    
    # If heights equal, tree is perfect
    if left_height == right_height:
        return (1 << (left_height + 1)) - 1  # 2^(height+1) - 1
    
    # Otherwise, recursively count
    return 1 + countNodes(root.left) + countNodes(root.right)

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function countNodes(root) {
    """
    Count complete tree nodes in O(log²n).
    
    Time: O(log²n) - log n levels, each does log n height computation
    Space: O(log n) - recursion depth
    """
    if not root:
        return 0
    
    # Compute left height
    left_height = 0
    node = root
    while node.left:
        left_height += 1
        node = node.left
    
    # Compute right height
    right_height = 0
    node = root
    while node.right:
        right_height += 1
        node = node.right
    
    # If heights equal, tree is perfect
    if left_height == right_height:
        return (1 << (left_height + 1)) - 1  # 2^(height+1) - 1
    
    # Otherwise, recursively count
    return 1 + countNodes(root.left) + countNodes(root.right)

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Complexity Analysis

- **Time Complexity:** O(log²n) - Each of O(log n) levels does O(log n) height calculation
- **Space Complexity:** O(log n) - Recursion depth in complete tree

### Test Cases

**Test 1:** Complete tree
- Input: "([1,2,3,4,5,6])"
- Expected: "6"

**Test 2:** Empty tree
- Input: "([])"
- Expected: "0"

**Test 3:** Single node
- Input: "([1])"
- Expected: "1"

**Test 4:** Perfect tree (2^3 - 1)
- Input: "([1,2,3,4,5,6,7])"
- Expected: "7"

**Test 5:** Incomplete last level
- Input: "([1,2,3,4])"
- Expected: "4"

**Test 6:** Only left child
- Input: "([1,2])"
- Expected: "2"

---

## 19. Kth Smallest Element in a BST

**Difficulty:** medium
**Concept:** trees
**Family:** trees:bst-operations

### Description

Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.

### Key Insight

Inorder traversal of BST produces sorted order. Perform inorder traversal and count nodes. When count reaches k, return current node's value. Can use iterative inorder with stack for early termination.

### Examples

**Example 1:**
- Input: root = [3,1,4,null,2], k = 1
- Output: 1
- Explanation: Inorder: [1,2,3,4]. 1st smallest is 1.

**Example 2:**
- Input: root = [5,3,6,2,4,null,null,1], k = 3
- Output: 3
- Explanation: Inorder: [1,2,3,4,5,6]. 3rd smallest is 3.

**Example 3:**
- Input: root = [1], k = 1
- Output: 1
- Explanation: Single node is the 1st smallest.

### Hints

1. Inorder traversal of BST visits nodes in sorted (ascending) order
2. Use iterative inorder with stack to allow early termination
3. Count nodes as you visit them in inorder
4. When count reaches k, return current node's value
5. Pattern: go left, pop and count, go right
6. Optimization: stop as soon as kth element is found (no need to visit remaining nodes)

### Starter Code

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def kthSmallest(root, k):
    """
    Find kth smallest element in BST.
    
    Args:
        root: TreeNode - root of BST
        k: int - 1-indexed position
    
    Returns:
        int - kth smallest value
    """
    # TODO: Perform inorder traversal (produces sorted order in BST)
    
    # TODO: Count nodes visited
    
    # TODO: When count == k, return node.val
    
    # TODO: Can use iterative inorder with stack for early termination
    
    pass

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function kthSmallest(root, k) {
    """
    Find kth smallest element in BST.
    
    Args:
        root: TreeNode - root of BST
        k: int - 1-indexed position
    
    Returns:
        int - kth smallest value
    """
    // TODO: Perform inorder traversal (produces sorted order in BST)
    
    // TODO: Count nodes visited
    
    // TODO: When count == k, return node.val
    
    // TODO: Can use iterative inorder with stack for early termination
  // TODO: implement
function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Solution

**Python:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def kthSmallest(root, k):
    """
    Find kth smallest using iterative inorder.
    
    Time: O(h + k) - reach leftmost, then k iterations
    Space: O(h) - stack depth
    """
    stack = []
    current = root
    count = 0
    
    while current or stack:
        # Go left as far as possible
        while current:
            stack.append(current)
            current = current.left
        
        # Pop and count
        current = stack.pop()
        count += 1
        
        # Check if this is the kth element
        if count == k:
            return current.val
        
        # Go right
        current = current.right
    
    return -1  # Should never reach if k is valid

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function kthSmallest(root, k) {
    """
    Find kth smallest using iterative inorder.
    
    Time: O(h + k) - reach leftmost, then k iterations
    Space: O(h) - stack depth
    """
    stack = []
    current = root
    count = 0
    
    while current or stack:
        # Go left as far as possible
        while current:
            stack.append(current)
            current = current.left
        
        # Pop and count
        current = stack.pop()
        count += 1
        
        # Check if this is the kth element
        if count == k:
            return current.val
        
        # Go right
        current = current.right
    
    return -1  # Should never reach if k is valid

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Complexity Analysis

- **Time Complexity:** O(h + k) - Reach leftmost node O(h), then k iterations to find kth
- **Space Complexity:** O(h) - Stack depth equals tree height

### Test Cases

**Test 1:** 1st smallest
- Input: "([3,1,4,None,2], 1)"
- Expected: "1"

**Test 2:** 3rd smallest
- Input: "([5,3,6,2,4,None,None,1], 3)"
- Expected: "3"

**Test 3:** Single node
- Input: "([1], 1)"
- Expected: "1"

**Test 4:** 2nd smallest (root)
- Input: "([2,1,3], 2)"
- Expected: "2"

**Test 5:** 4th smallest in complete BST
- Input: "([5,3,7,2,4,6,8], 4)"
- Expected: "5"

**Test 6:** 1st smallest (leftmost)
- Input: "([5,3,7,2,4,6,8], 1)"
- Expected: "2"

**Test 7:** PERFORMANCE: Large skewed BST (10K nodes) - Must use O(h+k) inorder with early termination
- Input: "(list(range(10000)), 5000)"
- Expected: "4999"

---

## 20. Binary Tree Right Side View

**Difficulty:** medium
**Concept:** trees
**Family:** trees:bfs-level-order

### Description

Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.

### Key Insight

Use BFS level-order traversal. For each level, add the rightmost node's value to result. Alternatively, use DFS tracking depth: for each depth, if it's the first time visiting that depth from the right side (by going right first), add the node.

### Examples

**Example 1:**
- Input: root = [1,2,3,null,5,null,4]
- Output: [1,3,4]
- Explanation: From right side: see 1 (top), 3 (level 1 right), 4 (level 2 right).

**Example 2:**
- Input: root = [1,null,3]
- Output: [1,3]
- Explanation: See root 1 and right child 3.

**Example 3:**
- Input: root = []
- Output: []
- Explanation: Empty tree.

### Hints

1. BFS approach: Use level-order traversal, take the last node at each level
2. In BFS: after processing all nodes at a level, the last one processed is rightmost
3. DFS approach: Traverse right subtree first, track depth
4. In DFS: if len(result) == depth, this is first node seen at this depth from right
5. DFS recursive: def dfs(node, depth): if not node: return; if len(result) == depth: result.append(node.val)
6. Both approaches work in O(n) time

### Starter Code

**Python:**
```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def rightSideView(root):
    """
    Return right side view of binary tree.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        List[int] - values visible from right side
    """
    # TODO: Method 1 - BFS level order:
    # For each level, add last node's value to result
    
    # TODO: Method 2 - DFS with depth tracking:
    # Go right first, track depth
    # First node at each depth is visible from right
    
    pass

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
from collections import deque

class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function rightSideView(root) {
    """
    Return right side view of binary tree.
    
    Args:
        root: TreeNode - root of tree
    
    Returns:
        Array - values visible from right side
    """
    // TODO: Method 1 - BFS level order:
    # For each level, add last node's value to result
    
    // TODO: Method 2 - DFS with depth tracking:
    # Go right first, track depth
    # First node at each depth is visible from right
  // TODO: implement
function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Solution

**Python:**
```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def rightSideView(root):
    """
    Right side view using BFS level order.
    
    Time: O(n) - visit each node once
    Space: O(w) - queue width
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        
        for i in range(level_size):
            node = queue.popleft()
            
            # Last node at this level is visible from right
            if i == level_size - 1:
                result.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return result

def build_tree(arr):
    if not arr: return None
    nodes = [TreeNode(val) if val is not None else None for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

**JavaScript:**
```javascript
from collections import deque

class TreeNode:
    function __init__(self, val=0, left=null, right=null) {
        self.val = val
        self.left = left
        self.right = right

function rightSideView(root) {
    """
    Right side view using BFS level order.
    
    Time: O(n) - visit each node once
    Space: O(w) - queue width
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        
        for i in range(level_size):
            node = queue.popleft()
            
            # Last node at this level is visible from right
            if i == level_size - 1:
                result.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return result

function build_tree(arr) {
    if not arr: return null
    nodes = [TreeNode(val) if val is not null else null for val in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root
```

### Complexity Analysis

- **Time Complexity:** O(n) - Visit each node exactly once
- **Space Complexity:** O(w) - Queue size equals maximum width of tree

### Test Cases

**Test 1:** Right side view
- Input: "([1,2,3,None,5,None,4])"
- Expected: "[1,3,4]"

**Test 2:** Only right children
- Input: "([1,None,3])"
- Expected: "[1,3]"

**Test 3:** Empty tree
- Input: "([])"
- Expected: "[]"

**Test 4:** Left node visible at bottom
- Input: "([1,2,3,4])"
- Expected: "[1,3,4]"

**Test 5:** Only left child visible
- Input: "([1,2])"
- Expected: "[1,2]"

**Test 6:** Complete tree
- Input: "([1,2,3,4,5,6,7])"
- Expected: "[1,3,7]"

---
