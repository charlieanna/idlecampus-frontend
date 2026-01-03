import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module5LinkedListLessonSmartPracticeExercises: ExerciseSection[] = [
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-reverse-list',
      title: 'Code: Reverse Linked List',
      description: 'Reverse a singly linked list using iterative pointer manipulation.',
      instruction: `# Reverse Linked List - Coding Exercise

Reverse a singly linked list and return the new head.

## Examples

**Example 1:**
- Input: \`1 -> 2 -> 3 -> 4 -> 5\`
- Output: \`5 -> 4 -> 3 -> 2 -> 1\`

**Example 2:**
- Input: \`1 -> 2\`
- Output: \`2 -> 1\`

**Example 3:**
- Input: \`[]\` (empty list)
- Output: \`[]\`

## Constraints
- The number of nodes is in range \`[0, 5000]\`
- \`-5000 <= Node.val <= 5000\`

## Challenge
Can you solve it iteratively in O(n) time and O(1) space?`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    pass`,
      expectedOutput: `def reverse_list(head):
    prev = None
    current = head

    while current:
        next_temp = current.next  # Save next
        current.next = prev        # Reverse pointer
        prev = current             # Move prev forward
        current = next_temp        # Move current forward

    return prev`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Use three pointers: prev, current, and next. Reverse the next pointer of each node while traversing.'
        },
        {
          afterAttempt: 2,
          text: 'Start with prev=None, current=head. While current exists: save next, reverse pointer, move both pointers forward.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Iterative Solution - O(n) time, O(1) space

def reverse_list(head):
    prev = None
    current = head

    while current:
        # Save next node
        next_temp = current.next

        # Reverse the pointer
        current.next = prev

        # Move pointers forward
        prev = current
        current = next_temp

    return prev  # New head

# Visualization:
# Before: 1 -> 2 -> 3 -> None
# After:  None <- 1 <- 2 <- 3
#
# Key: Reverse pointers one by one while traversing
# Space: O(1) - only three pointers used`
      },
      targetComplexity: {
        time: 'O(n)',
        space: 'O(1)'
      },
      testCases: [
        {
          'input': '[1, 2, 3, 4, 5]',
          'expectedOutput': '[5, 4, 3, 2, 1]'
        },
        {
          'input': '[1, 2]',
          'expectedOutput': '[2, 1]'
        },
        {
          'input': '[1]',
          'expectedOutput': '[1]'
        },
        {
          'input': '[]',
          'expectedOutput': '[]'
        },
        {
          'input': '[1, 1, 1]',
          'expectedOutput': '[1, 1, 1]'
        },
        {
          'input': '[-1, 0, 1]',
          'expectedOutput': '[1, 0, -1]'
        },
        {
          'input': '[10, 20, 30]',
          'expectedOutput': '[30, 20, 10]'
        },
        {
          'input': '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]',
          'expectedOutput': '[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]'
        }
      ],
      solutionExplanation: `## Approach: Three-Pointer Technique

### Strategy
To reverse a linked list in-place, we need to reverse each node's \`next\` pointer while traversing the list.

### Why Three Pointers?
We need to track:
1. **prev** - The node we just processed (becomes the new next)
2. **current** - The node we're currently reversing
3. **next_temp** - Save the next node before we lose it

### Step-by-Step Approach

**Initial state:**
\`\`\`
prev = None
current = head
1 → 2 → 3 → None
\`\`\`

**Step 1: Process node 1**
\`\`\`python
next_temp = current.next  # Save 2
current.next = prev       # 1 → None
prev = current            # prev is now 1
current = next_temp       # Move to 2
\`\`\`
Result: None ← 1    2 → 3 → None

**Step 2: Process node 2**
\`\`\`python
next_temp = current.next  # Save 3
current.next = prev       # 2 → 1
prev = current            # prev is now 2
current = next_temp       # Move to 3
\`\`\`
Result: None ← 1 ← 2    3 → None

**Step 3: Process node 3**
\`\`\`python
next_temp = current.next  # Save None
current.next = prev       # 3 → 2
prev = current            # prev is now 3
current = next_temp       # current is now None (loop ends)
\`\`\`
Result: None ← 1 ← 2 ← 3

**Return prev** (new head = 3)

### Complete Pattern
\`\`\`python
prev = None
current = head

while current:
    next_temp = current.next  # 1. Save next
    current.next = prev       # 2. Reverse pointer
    prev = current            # 3. Move prev forward
    current = next_temp       # 4. Move current forward

return prev
\`\`\`

### Time Complexity: O(n)
- Visit each node exactly once
- Single pass through the list

### Space Complexity: O(1)
- Only use three pointers
- Reverse in-place, no extra data structures

### Key Insight
This problem **doesn't need** a dummy node because we're not building a new list - we're reversing pointers in the existing list. The three-pointer technique is perfect for this.`,
      complexityQuizPlacement: 'after',
      requiredForProgress: true
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-merge-sorted-lists',
      title: 'Code: Merge Two Sorted Lists',
      description: 'Merge two sorted linked lists using the dummy node pattern.',
      instruction: `# Merge Two Sorted Lists

You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.

## Examples

**Example 1:**
- Input: \`list1 = 1->2->4, list2 = 1->3->4\`
- Output: \`1->1->2->3->4->4\`

**Example 2:**
- Input: \`list1 = [], list2 = []\`
- Output: \`[]\`

**Example 3:**
- Input: \`list1 = [], list2 = 0\`
- Output: \`0\`

## Constraints
- The number of nodes in both lists is in range \`[0, 50]\`
- \`-100 <= Node.val <= 100\`
- Both \`list1\` and \`list2\` are sorted in non-decreasing order

## Hint
Try using a dummy node to avoid edge cases!`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def mergeTwoLists(list1, list2):
    pass`,
      expectedOutput: `def mergeTwoLists(list1, list2):
    dummy = ListNode(0)
    current = dummy

    while list1 and list2:
        if list1.val < list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next
        current = current.next

    current.next = list1 if list1 else list2
    return dummy.next`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Create a dummy node to start with. Use one pointer to build the merged list.'
        },
        {
          afterAttempt: 2,
          text: 'Compare values from both lists, attach the smaller node, and move that pointer forward.'
        },
        {
          afterAttempt: 3,
          text: 'After one list is exhausted, attach the remaining nodes from the other list.'
        }
      ],
      solution: {
        afterAttempt: 4,
        text: `# Solution - Merge Two Sorted Lists

def mergeTwoLists(list1, list2):
    # Create dummy node to simplify logic
    dummy = ListNode(0)
    current = dummy

    # Merge while both lists have nodes
    while list1 and list2:
        if list1.val < list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next
        current = current.next

    # Attach remaining nodes
    current.next = list1 if list1 else list2

    # Return real head (skip dummy)
    return dummy.next

# Time: O(n + m) - visit each node once
# Space: O(1) - no extra space (reuse existing nodes)

# Key insights:
# - Dummy node eliminates edge case for first node
# - No special handling needed for empty lists
# - At end, one list is empty, attach the rest of other`
      },
      targetComplexity: {
        time: "O(n + m)",
        space: "O(1)"
      },
      testCases: [
        // Basic examples
        {
          'input': '[1, 2, 4], [1, 3, 4]',
          'expectedOutput': '[1, 1, 2, 3, 4, 4]'
        },
        {
          'input': '[], []',
          'expectedOutput': '[]'
        },
        {
          'input': '[], [0]',
          'expectedOutput': '[0]'
        },
        // B - Boundaries
        {
          'input': '[1], [1]',
          'expectedOutput': '[1, 1]'
        },
        {
          'input': '[1], []',
          'expectedOutput': '[1]'
        },
        // E - Edge cases (one list longer)
        {
          'input': '[1, 2], [3, 4, 5]',
          'expectedOutput': '[1, 2, 3, 4, 5]'
        },
        {
          'input': '[5], [1, 2, 3]',
          'expectedOutput': '[1, 2, 3, 5]'
        },
        // D - Duplicates
        {
          'input': '[1, 1, 1], [1, 1, 1]',
          'expectedOutput': '[1, 1, 1, 1, 1, 1]'
        },
        // T - Type variations (negatives)
        {
          'input': '[-10, -5, 0], [-3, 3, 10]',
          'expectedOutput': '[-10, -5, -3, 0, 3, 10]'
        },
        // I - Interesting patterns
        {
          'input': '[1, 3, 5], [2, 4, 6]',
          'expectedOutput': '[1, 2, 3, 4, 5, 6]'
        },
        {
          'input': '[2, 4, 6], [1, 3, 5]',
          'expectedOutput': '[1, 2, 3, 4, 5, 6]'
        },
        // M - Many elements
        {
          'input': '[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]',
          'expectedOutput': '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]'
        },
        // E - Extremes
        {
          'input': '[-100], [100]',
          'expectedOutput': '[-100, 100]'
        }
      ],
      solutionExplanation: `## Approach: Dummy Node Pattern

### Strategy
The dummy node technique is **perfect** for this problem because we're building a new list from two existing lists.

### How the Dummy Node Helps
**Without dummy node:**
- Need special case: "Is this the first node I'm adding?"
- Must track and return the actual head separately

**With dummy node:**
- Start with a placeholder (dummy = ListNode(0))
- Build list naturally: dummy → 1 → 1 → 2 → 3 → 4 → 4
- Return dummy.next to skip the placeholder

### Step-by-Step Approach
1. **Initialize**: Create dummy node and current pointer
   \`\`\`python
   dummy = ListNode(0)
   current = dummy
   \`\`\`

2. **Merge**: Compare values and attach smaller node
   \`\`\`python
   while list1 and list2:
       if list1.val < list2.val:
           current.next = list1
           list1 = list1.next
       else:
           current.next = list2
           list2 = list2.next
       current = current.next
   \`\`\`

3. **Attach remaining**: One list empties first
   \`\`\`python
   current.next = list1 if list1 else list2
   \`\`\`

4. **Return**: Skip dummy to get real head
   \`\`\`python
   return dummy.next
   \`\`\`

### Time Complexity: O(n + m)
- Visit each node in both lists exactly once
- n = length of list1, m = length of list2

### Space Complexity: O(1)
- Only use a few pointers (dummy, current)
- Reuse existing nodes, don't create new ones

### Key Insight
The dummy node eliminates edge cases and makes the code cleaner. No special handling needed for:
- Empty lists
- First node
- Different lengths`,
      complexityQuizPlacement: 'after',
      requiredForProgress: true
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-detect-cycle',
      title: 'Code: Detect Cycle (Floyd\'s Algorithm)',
      description: 'Use fast and slow pointers to detect cycles in O(1) space.',
      instruction: `# Linked List Cycle Detection

Given \`head\`, the head of a linked list, determine if the linked list has a **cycle** in it.

There is a cycle in a linked list if there is some node that can be reached again by continuously following the \`next\` pointer.

Return \`true\` if there is a cycle, \`false\` otherwise.

## Examples

**Example 1:**
- Input: \`head = 3->2->0->-4 (cycle: -4 points back to 2)\`
- Output: \`true\`

**Example 2:**
- Input: \`head = 1->2 (cycle: 2 points back to 1)\`
- Output: \`true\`

**Example 3:**
- Input: \`head = 1\`
- Output: \`false\`

## Constraints
- The number of nodes is in range \`[0, 10^4]\`
- \`-10^5 <= Node.val <= 10^5\`

## Follow-up
Can you solve it using O(1) memory?

## Hint
Use two pointers moving at different speeds (fast and slow). If they meet, there's a cycle!`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def hasCycle(head):
    pass`,
      testCases: [
        {
          input: 'n1 = ListNode(3); n2 = ListNode(2); n3 = ListNode(0); n4 = ListNode(-4); n1.next = n2; n2.next = n3; n3.next = n4; n4.next = n2; hasCycle(n1)',
          expectedOutput: 'True'
        },
        {
          input: 'n1 = ListNode(1); n2 = ListNode(2); n1.next = n2; n2.next = n1; hasCycle(n1)',
          expectedOutput: 'True'
        },
        {
          input: 'n1 = ListNode(1); hasCycle(n1)',
          expectedOutput: 'False'
        },
        {
          input: 'hasCycle(None)',
          expectedOutput: 'False'
        },
        {
          input: 'n1 = ListNode(1); n2 = ListNode(2); n3 = ListNode(3); n1.next = n2; n2.next = n3; hasCycle(n1)',
          expectedOutput: 'False'
        }
      ],
      hints: [
        {
          afterAttempt: 1,
          text: 'Use two pointers: slow moves 1 step, fast moves 2 steps. If they meet, there\'s a cycle.'
        },
        {
          afterAttempt: 2,
          text: 'Initialize both pointers at head. Keep moving them until fast reaches end or they meet.'
        },
        {
          afterAttempt: 3,
          text: 'Check: while fast and fast.next (to avoid null pointer errors).'
        }
      ],
      solution: {
        afterAttempt: 4,
        text: `# Solution - Detect Cycle (Floyd's Cycle Detection Algorithm)

def hasCycle(head):
    # Edge case: empty or single node
    if not head or not head.next:
        return False

    # Initialize pointers
    slow = head      # Moves 1 step
    fast = head      # Moves 2 steps

    # Traverse the list
    while fast and fast.next:
        slow = slow.next        # Move 1 step
        fast = fast.next.next   # Move 2 steps

        # If they meet, cycle exists
        if slow == fast:
            return True

    # Fast reached end, no cycle
    return False

# Time: O(n) - in worst case visit all nodes
# Space: O(1) - only two pointers

# Why it works:
# - If no cycle, fast reaches None first
# - If cycle exists, fast eventually laps slow
# - Like runners on a circular track - fast must catch slow!
# - In a cycle, distance reduces by 1 each iteration
# - Eventually they meet at the same node`
      },
      targetComplexity: {
        time: "O(n)",
        space: "O(1)"
      },
      solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: HashSet to Track Visited
\`\`\`python
def hasCycle(head):
    visited = set()
    current = head
    while current:
        if current in visited:
            return True
        visited.add(current)
        current = current.next
    return False
\`\`\`
**Time: O(n)** | **Space: O(n)** - stores all visited nodes

---

### 🟡 Bottleneck Analysis
**What's inefficient?** Using O(n) extra space for visited set!

**Key insight:** Use two pointers at different speeds. If cycle exists, fast will eventually catch slow!

---

### 🟢 Optimization: Floyd's Cycle Detection (Tortoise & Hare)
\`\`\`python
def hasCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next        # 1 step
        fast = fast.next.next   # 2 steps
        if slow == fast:
            return True
    return False
\`\`\`

---

### 🧠 Why Two Pointers Work
- **No cycle:** Fast reaches end (None)
- **Has cycle:** Like runners on circular track - fast laps slow!
- Distance between them decreases by 1 each iteration
- Eventually they meet at same node

---

### ✅ Final Complexity
- **Time: O(n)** - visit each node at most twice
- **Space: O(1)** - only two pointers!

### 🎯 Pattern Learned
**"Detect cycle"** → Floyd's Tortoise and Hare (slow/fast pointers)`,
      complexityQuizPlacement: 'after',
      requiredForProgress: false
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-lru-cache',
      title: 'Code: Design LRU Cache',
      description: 'Design an LRU Cache using doubly linked list and hash map for O(1) operations.',
      instruction: `# Design LRU Cache

Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:

- \`LRUCache(int capacity)\`: Initialize the LRU cache with positive size \`capacity\`.
- \`int get(int key)\`: Return the value of the \`key\` if it exists, otherwise return \`-1\`.
- \`void put(int key, int value)\`: Update the value of the \`key\` if it exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\`, **evict the least recently used** key.

**The functions \`get\` and \`put\` must each run in O(1) average time complexity.**

## Examples

**Example 1:**
\`\`\`
Input:
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]

Output:
[null, null, null, 1, null, -1, null, -1, 3, 4]

Explanation:
LRUCache lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // cache is {1=1}
lRUCache.put(2, 2); // cache is {1=1, 2=2}
lRUCache.get(1);    // return 1
lRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}
lRUCache.get(2);    // returns -1 (not found)
lRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}
lRUCache.get(1);    // return -1 (not found)
lRUCache.get(3);    // return 3
lRUCache.get(4);    // return 4
\`\`\`

## Constraints
- \`1 <= capacity <= 3000\`
- \`0 <= key <= 10^4\`
- \`0 <= value <= 10^5\`
- At most \`2 * 10^5\` calls will be made to \`get\` and \`put\`

## Hints
1. Use hash map for O(1) access
2. Use doubly linked list for O(1) reordering
3. Use dummy head and tail nodes to simplify edge cases
4. Keep most recent at head, least recent at tail`,
      starterCode: `class LRUCache:
    def __init__(self, capacity: int):
        pass

    def get(self, key: int) -> int:
        pass

    def put(self, key: int, value: int) -> None:
        pass`,
      expectedOutput: `class DLLNode:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        self.head = DLLNode()
        self.tail = DLLNode()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        prev_node = node.prev
        next_node = node.next
        prev_node.next = next_node
        next_node.prev = prev_node

    def _add_to_head(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._remove(node)
        self._add_to_head(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            node = self.cache[key]
            node.val = value
            self._remove(node)
            self._add_to_head(node)
        else:
            if len(self.cache) >= self.capacity:
                lru = self.tail.prev
                self._remove(lru)
                del self.cache[lru.key]
            new_node = DLLNode(key, value)
            self.cache[key] = new_node
            self._add_to_head(new_node)`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Create two helper functions: _remove() to remove a node, and _add_to_head() to add a node after head.'
        },
        {
          afterAttempt: 2,
          text: 'Use hash map to map keys to nodes. Use doubly linked list to maintain order (most recent at head).'
        },
        {
          afterAttempt: 3,
          text: 'For get(): look up node, remove it, add to head (mark as recently used). For put(): check if key exists, update or evict LRU.'
        }
      ],
      solution: {
        afterAttempt: 4,
        text: `# Solution - LRU Cache (Doubly Linked List + Hash Map)

class DLLNode:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}  # key -> DLLNode

        # Dummy head and tail nodes simplify edge cases
        self.head = DLLNode()
        self.tail = DLLNode()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        """Remove node from doubly linked list (O(1))"""
        prev_node = node.prev
        next_node = node.next
        prev_node.next = next_node
        next_node.prev = prev_node

    def _add_to_head(self, node):
        """Add node right after head (most recently used)"""
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1

        # Mark as recently used (move to head)
        node = self.cache[key]
        self._remove(node)
        self._add_to_head(node)

        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            # Update existing key
            node = self.cache[key]
            node.val = value
            self._remove(node)
            self._add_to_head(node)
        else:
            # Add new key
            if len(self.cache) >= self.capacity:
                # Evict least recently used (node before tail)
                lru = self.tail.prev
                self._remove(lru)
                del self.cache[lru.key]

            # Add new node
            new_node = DLLNode(key, value)
            self.cache[key] = new_node
            self._add_to_head(new_node)

# Time: O(1) for both get() and put()
# Space: O(capacity)

# Why doubly linked list?
# - Can remove node in O(1) if we know its predecessor
# - Node stores prev pointer, so we can access predecessor directly
# - Singly linked list would need O(n) to find predecessor

# Why store key in node?
# - When evicting LRU (tail.prev), need to know which key to delete from hash map
# - Without key in node, can't delete from cache!

# Why dummy nodes?
# - Simplify edge cases (no special handling for head/tail)
# - All operations follow same pattern`
      },
      targetComplexity: {
        time: "O(1)",
        space: "O(1)"
      },
      testCases: [
        // LRU Cache - class operation test sequences
        // Format: operations, args -> expected outputs
        {
          'input': '["LRUCache","put","put","get","put","get"], [[2],[1,1],[2,2],[1],[3,3],[2]]',
          'expectedOutput': '[null,null,null,1,null,-1]'
        },
        {
          'input': '["LRUCache","put","get"], [[1],[1,1],[1]]',
          'expectedOutput': '[null,null,1]'
        },
        // B - Boundaries (capacity 1)
        {
          'input': '["LRUCache","put","put","get"], [[1],[1,1],[2,2],[1]]',
          'expectedOutput': '[null,null,null,-1]'
        },
        {
          'input': '["LRUCache","get"], [[1],[1]]',
          'expectedOutput': '[null,-1]'
        },
        // E - Edge cases (update existing)
        {
          'input': '["LRUCache","put","put","get"], [[2],[1,1],[1,2],[1]]',
          'expectedOutput': '[null,null,null,2]'
        },
        // D - Different patterns
        {
          'input': '["LRUCache","put","put","put","get","get"], [[2],[1,1],[2,2],[3,3],[1],[2]]',
          'expectedOutput': '[null,null,null,null,-1,2]'
        },
        // T - Type variations (capacity 2, only 2 keys so no eviction)
        {
          'input': '["LRUCache","put","get","put","get"], [[2],[2,1],[2],[3,2],[2]]',
          'expectedOutput': '[null,null,1,null,1]'
        },
        // I - Interesting patterns (access order)
        {
          'input': '["LRUCache","put","put","get","put","put","get"], [[2],[2,1],[1,1],[2],[4,1],[1,1],[2]]',
          'expectedOutput': '[null,null,null,1,null,null,-1]'
        },
        // M - Many operations
        {
          'input': '["LRUCache","put","put","put","put","get","get"], [[3],[1,1],[2,2],[3,3],[4,4],[2],[1]]',
          'expectedOutput': '[null,null,null,null,null,2,-1]'
        },
        // E - Extremes
        {
          'input': '["LRUCache","put","put","get","put","get","put","get","get","get"], [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]',
          'expectedOutput': '[null,null,null,1,null,-1,null,-1,3,4]'
        }
      ],
      solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Array + Linear Search
\`\`\`python
class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = []  # [(key, value), ...]

    def get(self, key):
        for i, (k, v) in enumerate(self.cache):
            if k == key:
                # Move to front (most recently used)
                self.cache.pop(i)
                self.cache.insert(0, (k, v))
                return v
        return -1

    def put(self, key, value):
        # Check if exists (update)
        for i, (k, v) in enumerate(self.cache):
            if k == key:
                self.cache.pop(i)
                self.cache.insert(0, (key, value))
                return
        # Add new
        if len(self.cache) >= self.capacity:
            self.cache.pop()  # Remove LRU
        self.cache.insert(0, (key, value))
\`\`\`
**Time: O(n)** per operation | **Space: O(capacity)**

---

### 🟡 Bottleneck Analysis
- **get:** O(n) search, O(n) insert/remove
- **put:** O(n) search + O(n) insert/remove

**Key insight:** Need O(1) lookup AND O(1) insertion/removal!

---

### 🟢 Optimal: HashMap + Doubly Linked List
\`\`\`
HashMap: key → Node  (O(1) lookup)
DLL: head ↔ node1 ↔ node2 ↔ ... ↔ tail  (O(1) add/remove)

get(key): lookup in map, move node to head
put(key,val): add to head, if over capacity remove tail
\`\`\`

**Why doubly linked?** Can remove node in O(1) with prev pointer!
**Why dummy head/tail?** No edge case handling!

---

### ✅ Final Complexity
- **Time: O(1)** for both get and put
- **Space: O(capacity)** for HashMap + DLL

### 🎯 Pattern Learned
**"O(1) lookup + O(1) order tracking"** → HashMap + Doubly Linked List`,
      complexityQuizPlacement: 'after',
      requiredForProgress: false
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-reverse-list-ii',
      title: 'Code: Reverse Linked List II',
      description: 'Reverse a portion of a linked list between positions left and right.',
      requiredForProgress: true,
      instruction: `# Reverse Linked List II (LeetCode 92)

Given the head of a singly linked list and two integers \`left\` and \`right\` where \`left <= right\`, reverse the nodes of the list from position \`left\` to position \`right\`, and return the reversed list.

## Examples

**Example 1:**
\`\`\`
Input: head = [1,2,3,4,5], left = 2, right = 4
Output: [1,4,3,2,5]

Before: 1 → 2 → 3 → 4 → 5
After:  1 → 4 → 3 → 2 → 5
             ↑_____↑ reversed
\`\`\`

**Example 2:**
\`\`\`
Input: head = [5], left = 1, right = 1
Output: [5]
\`\`\`

## Constraints
- The number of nodes in the list is n
- 1 <= n <= 500
- -500 <= Node.val <= 500
- 1 <= left <= right <= n

## Key Challenge
When left = 1, you're reversing from the head – this is where the dummy node shines!`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseBetween(head, left, right):
    # Use dummy node to handle left=1 case
    pass`,
      expectedOutput: `def reverseBetween(head, left, right):
    if left == right:
        return head
    
    # Dummy node handles the case where left = 1
    dummy = ListNode(0, head)
    prev = dummy
    
    # Move prev to the node just before position left
    for _ in range(left - 1):
        prev = prev.next
    
    # current is the first node to be reversed
    current = prev.next
    
    # Reverse nodes from left to right
    for _ in range(right - left):
        # Take the next node
        next_node = current.next
        # Skip over it
        current.next = next_node.next
        # Insert it at the front of the reversed section
        next_node.next = prev.next
        prev.next = next_node
    
    return dummy.next`,
      hints: [
        { afterAttempt: 1, text: 'Use a dummy node! If left=1, you\'re modifying the head. Dummy handles this cleanly.' },
        { afterAttempt: 2, text: 'First, move a pointer to the node just before position left. This is your anchor.' },
        { afterAttempt: 3, text: 'To reverse: repeatedly take current.next and move it to the front of the sublist (after prev).' }
      ],
      solution: {
        afterAttempt: 4,
        text: `## Solution - O(n) time, O(1) space

\`\`\`python
def reverseBetween(head, left, right):
    if left == right:
        return head
    
    dummy = ListNode(0, head)
    prev = dummy
    
    for _ in range(left - 1):
        prev = prev.next
    
    current = prev.next
    
    for _ in range(right - left):
        next_node = current.next
        current.next = next_node.next
        next_node.next = prev.next
        prev.next = next_node
    
    return dummy.next
\`\`\`

**Key insight:** Keep moving nodes to the front of the sublist.`
      },
      targetComplexity: { time: 'O(n)', space: 'O(1)' },
      testCases: [
        { input: '[1,2,3,4,5], 2, 4', expectedOutput: '[1,4,3,2,5]' },
        { input: '[5], 1, 1', expectedOutput: '[5]' },
        { input: '[1,2,3], 1, 3', expectedOutput: '[3,2,1]' },
        { input: '[1,2], 1, 2', expectedOutput: '[2,1]' }
      ],
      solutionExplanation: `## Why This Problem is Tricky

Unlike full list reversal, you need to:
1. Keep the part before \`left\` unchanged
2. Reverse only the middle section
3. Keep the part after \`right\` unchanged
4. Handle the case where \`left = 1\` (reversing from head)

---

## The Dummy Node Saves the Day

When \`left = 1\`, you're reversing from the head. Without a dummy node, you'd need special logic. With a dummy node:

\`\`\`python
dummy = ListNode(0, head)
prev = dummy  # prev will always be the node BEFORE the reversed section
\`\`\`

Now the same code works whether \`left = 1\` or \`left = 3\`!

---

## The Reversal Technique

Instead of the traditional three-pointer reversal, we use a different approach: **repeatedly move nodes to the front**.

\`\`\`
Initial: prev → [1] → 2 → 3 → 4 → 5
                current

Step 1: Take 2, put after prev
         prev → [2] → [1] → 3 → 4 → 5
                       current

Step 2: Take 3, put after prev
         prev → [3] → [2] → [1] → 4 → 5
                             current

Done! (right - left = 2 moves)
\`\`\`

---

## The Code Pattern

\`\`\`python
for _ in range(right - left):
    next_node = current.next      # Grab the next node
    current.next = next_node.next # Skip over it
    next_node.next = prev.next    # Point it to front of sublist
    prev.next = next_node         # Make prev point to it
\`\`\`

Notice: \`current\` never moves! It just keeps pointing to what becomes the last node of the reversed section.

---

## Visual Walkthrough

\`\`\`
[1] → [2] → [3] → [4] → [5], left=2, right=4

dummy → [1] → [2] → [3] → [4] → [5]
        prev  curr

Move [3] to front:
dummy → [1] → [3] → [2] → [4] → [5]
        prev        curr

Move [4] to front:
dummy → [1] → [4] → [3] → [2] → [5]
        prev              curr

Result: [1] → [4] → [3] → [2] → [5] ✓
\`\`\``
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-reorder-list',
      title: 'Code: Reorder List',
      description: 'Reorder list by interleaving first half with reversed second half.',
      requiredForProgress: true,
      instruction: `# Reorder List (LeetCode 143)

You are given the head of a singly linked list. The list can be represented as:
\`L0 → L1 → … → Ln-1 → Ln\`

Reorder the list to be:
\`L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …\`

You may not modify the values in the list's nodes. Only nodes themselves may be changed.

## Examples

**Example 1:**
\`\`\`
Input: [1,2,3,4]
Output: [1,4,2,3]

1 → 2 → 3 → 4
1 → 4 → 2 → 3
\`\`\`

**Example 2:**
\`\`\`
Input: [1,2,3,4,5]
Output: [1,5,2,4,3]

1 → 2 → 3 → 4 → 5
1 → 5 → 2 → 4 → 3
\`\`\`

## Constraints
- 1 <= list length <= 5 * 10^4
- 1 <= Node.val <= 1000

## Hint
This problem combines three techniques:
1. Find the middle (fast/slow pointers)
2. Reverse second half
3. Merge two lists alternately`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reorderList(head):
    # Combine: find middle + reverse + merge
    pass`,
      expectedOutput: `def reorderList(head):
    if not head or not head.next:
        return
    
    # Step 1: Find middle using fast/slow pointers
    slow, fast = head, head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # Step 2: Reverse second half
    prev, current = None, slow.next
    slow.next = None  # Cut the list in half
    
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    
    second = prev  # Head of reversed second half
    
    # Step 3: Merge two halves alternately
    first = head
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first, second = tmp1, tmp2`,
      hints: [
        { afterAttempt: 1, text: 'Break it into 3 steps: (1) Find middle, (2) Reverse second half, (3) Merge alternately.' },
        { afterAttempt: 2, text: 'Find middle: use slow/fast pointers. When fast reaches end, slow is at middle.' },
        { afterAttempt: 3, text: 'After reversing second half, interleave: first → second → first.next → second.next → ...' }
      ],
      solution: {
        afterAttempt: 4,
        text: `## Solution - O(n) time, O(1) space

\`\`\`python
def reorderList(head):
    if not head or not head.next:
        return
    
    # Find middle
    slow, fast = head, head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # Reverse second half
    prev, current = None, slow.next
    slow.next = None
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    
    # Merge alternately
    first, second = head, prev
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first, second = tmp1, tmp2
\`\`\`

**Key insight:** Decompose into 3 known subproblems!`
      },
      targetComplexity: { time: 'O(n)', space: 'O(1)' },
      testCases: [
        { input: '[1,2,3,4]', expectedOutput: '[1,4,2,3]' },
        { input: '[1,2,3,4,5]', expectedOutput: '[1,5,2,4,3]' },
        { input: '[1]', expectedOutput: '[1]' },
        { input: '[1,2]', expectedOutput: '[1,2]' }
      ],
      solutionExplanation: `## Why This Problem is Great

It combines **three fundamental linked list techniques** into one problem:
1. Fast/slow pointers to find middle
2. In-place list reversal
3. Merging two lists

---

## Step 1: Find the Middle

Use the classic fast/slow pointer technique:

\`\`\`python
slow, fast = head, head
while fast.next and fast.next.next:
    slow = slow.next
    fast = fast.next.next
# slow is now at the middle
\`\`\`

For [1,2,3,4,5]: slow ends at 3
For [1,2,3,4]: slow ends at 2

---

## Step 2: Reverse Second Half

First, cut the list:
\`\`\`python
second_half_start = slow.next
slow.next = None  # Cut!
\`\`\`

Then reverse using the standard technique:
\`\`\`python
prev, current = None, second_half_start
while current:
    next_node = current.next
    current.next = prev
    prev = current
    current = next_node
# prev is now head of reversed second half
\`\`\`

---

## Step 3: Merge Alternately

We have two lists:
- First half: 1 → 2 (→ None)
- Reversed second half: 4 → 3 (→ None)

Interleave them:
\`\`\`python
while second:
    tmp1, tmp2 = first.next, second.next  # Save next nodes
    first.next = second                     # Link first → second
    second.next = tmp1                      # Link second → first.next
    first, second = tmp1, tmp2              # Move to next pair
\`\`\`

Result: 1 → 4 → 2 → 3

---

## The Beauty of Decomposition

This problem looks complex, but breaks down into three simple subproblems that you already know:
1. Find middle → fast/slow pointers
2. Reverse list → three-pointer technique
3. Merge lists → alternating pointer manipulation

**Master the basics, and complex problems become combinations of simple patterns!**`
    },

  // ============================================================================
  // NEW EXERCISES: Core Linked List Patterns
  // ============================================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-find-cycle-start',
    title: 'Find Cycle Start (Linked List Cycle II)',
    description: 'Find the node where cycle begins using Floyd\'s algorithm',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Find Cycle Start (LeetCode 142)

Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null.

## Example

\`\`\`
Input: 3 → 2 → 0 → -4
            ↑_________|

Output: Node with value 2 (cycle starts here)
\`\`\`

## Constraints

- 0 <= list length <= 10^4
- -10^5 <= Node.val <= 10^5

## Hidden Insight

Floyd's algorithm can do more than detect a cycle. After finding the meeting point, what happens if you start two pointers from head and meeting point, both moving at speed 1?`,
    starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def detectCycle(head):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'First, use fast/slow to detect if cycle exists and find meeting point.' },
      { afterAttempt: 2, text: 'Math insight: distance from head to cycle start = distance from meeting point to cycle start.' },
      { afterAttempt: 3, text: 'After meeting, start one pointer at head, one at meeting point. Move both at speed 1. They meet at cycle start!' }
    ],
    solution: {
      afterAttempt: 3,
      text: `def detectCycle(head):
    if not head or not head.next:
        return None

    # Phase 1: Detect cycle using fast/slow
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None  # No cycle

    # Phase 2: Find cycle start
    # Start one pointer at head, one at meeting point
    ptr1 = head
    ptr2 = slow
    while ptr1 != ptr2:
        ptr1 = ptr1.next
        ptr2 = ptr2.next

    return ptr1  # Cycle start

# Why this works:
# Let x = distance from head to cycle start
# Let y = distance from cycle start to meeting point
# Let c = cycle length
#
# Slow traveled: x + y
# Fast traveled: x + y + n*c (some number of full cycles)
# Since fast = 2*slow: x + y + n*c = 2(x + y)
# Therefore: n*c = x + y, so x = n*c - y
#
# Starting from meeting point and moving x steps
# lands at cycle start (since x = n*c - y)!`
    },
    solutionExplanation: `## Floyd's Cycle Detection - Extended

### Phase 1: Find Meeting Point
Same as cycle detection - fast/slow pointers meet inside the cycle.

### Phase 2: Find Cycle Start
The mathematical insight:
- Let x = distance from head to cycle start
- Let y = distance from cycle start to meeting point
- Fast travels 2× slow's distance
- This means: x = (some cycles) - y

So starting from head and meeting point, moving at same speed, they meet at cycle start!

### Complexity
- **Time:** O(n)
- **Space:** O(1)`,
    testCases: [
      { input: '3→2→0→-4→(back to 2)', expectedOutput: 'Node(2)' },
      { input: '1→2→(back to 1)', expectedOutput: 'Node(1)' },
      { input: '1→null', expectedOutput: 'null' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-find-middle',
    title: 'Find Middle of Linked List',
    description: 'Find middle node using fast/slow pointers',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Middle of the Linked List (LeetCode 876)

Given the head of a singly linked list, return the middle node.

If there are two middle nodes, return the **second** middle node.

## Examples

\`\`\`
Input: [1,2,3,4,5]
Output: Node with value 3

Input: [1,2,3,4,5,6]
Output: Node with value 4 (second middle)
\`\`\`

## Constraints

- 1 <= list length <= 100

## Hidden Insight

If one pointer moves twice as fast, when it reaches the end, where is the slow pointer?`,
    starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def middleNode(head):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Use two pointers: slow moves 1 step, fast moves 2 steps.' },
      { afterAttempt: 2, text: 'When fast reaches end (or null), slow is at middle.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def middleNode(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow

# For odd length: fast stops at last node, slow at exact middle
# For even length: fast stops at null, slow at second middle`
    },
    solutionExplanation: `## Fast/Slow Pointer Technique

When fast pointer reaches the end, slow pointer is at the middle.

**Odd length [1,2,3,4,5]:**
- fast: 1→3→5 (stops, no next.next)
- slow: 1→2→3 (middle!)

**Even length [1,2,3,4,5,6]:**
- fast: 1→3→5→null
- slow: 1→2→3→4 (second middle!)

### Complexity
- **Time:** O(n) - single pass
- **Space:** O(1) - two pointers`,
    testCases: [
      { input: '[1,2,3,4,5]', expectedOutput: 'Node(3)' },
      { input: '[1,2,3,4,5,6]', expectedOutput: 'Node(4)' },
      { input: '[1]', expectedOutput: 'Node(1)' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-remove-nth-from-end',
    title: 'Remove Nth Node From End',
    description: 'Remove nth node from end using two-pointer gap technique',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Remove Nth Node From End (LeetCode 19)

Given the head of a linked list, remove the nth node from the **end** of the list and return its head.

## Examples

\`\`\`
Input: head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]
(Removed node 4, which is 2nd from end)

Input: head = [1], n = 1
Output: []

Input: head = [1,2], n = 1
Output: [1]
\`\`\`

## Constraints

- 1 <= list length <= 30
- 1 <= n <= list length

## Hidden Insight

If you maintain a gap of n nodes between two pointers, when the first reaches the end, where is the second?`,
    starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def removeNthFromEnd(head, n):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Use dummy node to handle removing the head.' },
      { afterAttempt: 2, text: 'Move fast pointer n+1 steps ahead, then move both until fast reaches null.' },
      { afterAttempt: 3, text: 'Slow will be at the node BEFORE the one to remove.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `def removeNthFromEnd(head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy

    # Move fast n+1 steps ahead
    for _ in range(n + 1):
        fast = fast.next

    # Move both until fast reaches end
    while fast:
        fast = fast.next
        slow = slow.next

    # slow.next is the node to remove
    slow.next = slow.next.next

    return dummy.next`
    },
    solutionExplanation: `## Two-Pointer Gap Technique

### The Insight
If fast is n+1 nodes ahead of slow, when fast reaches null, slow is at the node BEFORE the one we need to remove.

### Why n+1?
We need to be at the **previous** node to remove the target. Gap of n would put us AT the target.

### Why Dummy Node?
If removing the head (n = length), we need a node before head.

### Visual
\`\`\`
[1,2,3,4,5], n=2

dummy→1→2→3→4→5→null
  s         f        (after moving fast n+1=3 steps)

dummy→1→2→3→4→5→null
        s       f    (move both until fast is null)

slow.next (4) is removed
\`\`\`

### Complexity
- **Time:** O(n) - single pass
- **Space:** O(1)`,
    testCases: [
      { input: '[1,2,3,4,5], 2', expectedOutput: '[1,2,3,5]' },
      { input: '[1], 1', expectedOutput: '[]' },
      { input: '[1,2], 1', expectedOutput: '[1]' },
      { input: '[1,2], 2', expectedOutput: '[2]' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-palindrome-list',
    title: 'Palindrome Linked List',
    description: 'Check if list is palindrome using O(1) space',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Palindrome Linked List (LeetCode 234)

Given the head of a singly linked list, return true if it is a palindrome.

## Examples

\`\`\`
Input: [1,2,2,1]
Output: true

Input: [1,2]
Output: false
\`\`\`

## Constraints

- 1 <= list length <= 10^5
- 0 <= Node.val <= 9

## Follow-up

Can you do it in O(n) time and O(1) space?

## Hidden Insight

You've learned to find the middle and reverse a list. How can you combine these?`,
    starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def isPalindrome(head):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Strategy: find middle, reverse second half, compare both halves.' },
      { afterAttempt: 2, text: 'Use fast/slow to find middle. Reverse from slow.next onward.' },
      { afterAttempt: 3, text: 'Compare first half with reversed second half node by node.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `def isPalindrome(head):
    if not head or not head.next:
        return True

    # Find middle
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next

    # Reverse second half
    prev = None
    current = slow.next
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node

    # Compare halves
    first, second = head, prev
    while second:
        if first.val != second.val:
            return False
        first = first.next
        second = second.next

    return True`
    },
    solutionExplanation: `## Combining Three Techniques

### Step 1: Find Middle (fast/slow)
\`\`\`
[1,2,2,1] → slow at first 2
\`\`\`

### Step 2: Reverse Second Half
\`\`\`
First half: 1→2
Second half (reversed): 1→2
\`\`\`

### Step 3: Compare
\`\`\`
1==1 ✓, 2==2 ✓ → palindrome!
\`\`\`

### Why O(1) Space?
We reverse in-place, no extra data structures.

### Complexity
- **Time:** O(n)
- **Space:** O(1)`,
    testCases: [
      { input: '[1,2,2,1]', expectedOutput: 'true' },
      { input: '[1,2]', expectedOutput: 'false' },
      { input: '[1]', expectedOutput: 'true' },
      { input: '[1,2,3,2,1]', expectedOutput: 'true' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-add-two-numbers',
    title: 'Add Two Numbers',
    description: 'Add two numbers represented as linked lists with carry propagation',
    targetComplexity: { time: 'O(max(m,n))', space: 'O(max(m,n))' },
    instruction: `# Add Two Numbers (LeetCode 2)

You are given two non-empty linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each node contains a single digit.

Add the two numbers and return the sum as a linked list.

## Examples

\`\`\`
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807

Input: l1 = [9,9,9], l2 = [1]
Output: [0,0,0,1]
Explanation: 999 + 1 = 1000
\`\`\`

## Constraints

- 1 <= list length <= 100
- 0 <= Node.val <= 9
- No leading zeros (except 0 itself)

## Hidden Insight

This is like elementary school addition - digit by digit with carry!`,
    starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def addTwoNumbers(l1, l2):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Use a dummy node to build the result list.' },
      { afterAttempt: 2, text: 'Track carry. For each position: sum = l1.val + l2.val + carry.' },
      { afterAttempt: 3, text: 'New digit = sum % 10, new carry = sum // 10. Don\'t forget final carry!' }
    ],
    solution: {
      afterAttempt: 3,
      text: `def addTwoNumbers(l1, l2):
    dummy = ListNode(0)
    current = dummy
    carry = 0

    while l1 or l2 or carry:
        # Get values (0 if list exhausted)
        v1 = l1.val if l1 else 0
        v2 = l2.val if l2 else 0

        # Calculate sum and carry
        total = v1 + v2 + carry
        carry = total // 10
        digit = total % 10

        # Create new node
        current.next = ListNode(digit)
        current = current.next

        # Move pointers
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None

    return dummy.next`
    },
    solutionExplanation: `## Elementary School Addition

### Algorithm
1. Add digits at each position + carry
2. New digit = sum % 10
3. New carry = sum // 10
4. Handle lists of different lengths
5. Don't forget final carry!

### Example: 342 + 465
\`\`\`
  2→4→3
+ 5→6→4
-------
  7→0→8

Step 1: 2+5=7, carry=0 → 7
Step 2: 4+6=10, carry=1 → 0
Step 3: 3+4+1=8, carry=0 → 8
\`\`\`

### Why Dummy Node?
Simplifies creating the first node - no special case needed.

### Complexity
- **Time:** O(max(m,n))
- **Space:** O(max(m,n)) for result`,
    testCases: [
      { input: '[2,4,3], [5,6,4]', expectedOutput: '[7,0,8]' },
      { input: '[9,9,9], [1]', expectedOutput: '[0,0,0,1]' },
      { input: '[0], [0]', expectedOutput: '[0]' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-copy-random-list',
    title: 'Copy List with Random Pointer',
    description: 'Deep copy a list with random pointers using interweaving technique',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Copy List with Random Pointer (LeetCode 138)

A linked list where each node has:
- \`next\`: pointer to next node
- \`random\`: pointer to any node or null

Construct a **deep copy** of the list.

## Example

\`\`\`
Input: [[7,null],[13,0],[11,4],[10,2],[1,0]]
       (val, random_index)

Output: Deep copy with same structure
\`\`\`

## Constraints

- 0 <= n <= 1000
- -10^4 <= Node.val <= 10^4
- random points to a node in the list or null

## Hidden Insight

O(n) space solution uses a hash map. But there's a clever O(1) space solution: interweave copies with originals!`,
    starterCode: `class Node:
    def __init__(self, val=0, next=None, random=None):
        self.val = val
        self.next = next
        self.random = random

def copyRandomList(head):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'HashMap approach: map original nodes to copies, then set next/random pointers.' },
      { afterAttempt: 2, text: 'O(1) space: interweave copies (A→A\'→B→B\'). Then copy.random = original.random.next.' },
      { afterAttempt: 3, text: 'Finally, separate the two lists by restoring next pointers.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# O(1) Space Solution - Interweaving

def copyRandomList(head):
    if not head:
        return None

    # Step 1: Create interweaved list A→A'→B→B'→C→C'
    current = head
    while current:
        copy = Node(current.val, current.next)
        current.next = copy
        current = copy.next

    # Step 2: Set random pointers for copies
    current = head
    while current:
        if current.random:
            current.next.random = current.random.next
        current = current.next.next

    # Step 3: Separate the lists
    dummy = Node(0)
    copy_current = dummy
    current = head

    while current:
        copy_current.next = current.next
        copy_current = copy_current.next
        current.next = current.next.next
        current = current.next

    return dummy.next`
    },
    solutionExplanation: `## Interweaving Technique (O(1) Space)

### Step 1: Create Interweaved List
\`\`\`
Original: A → B → C
After:    A → A' → B → B' → C → C'
\`\`\`

### Step 2: Set Random Pointers
For each copy: \`copy.random = original.random.next\`
(original.random.next is the COPY of original.random!)

### Step 3: Separate Lists
Restore original list and extract copies.

### Why This Works
By interweaving, we create a mapping without extra space:
- original.next = its copy
- copy.random = original.random.next

### Complexity
- **Time:** O(n) - three passes
- **Space:** O(1) - no hash map!`,
    testCases: [
      { input: '[[7,null],[13,0],[11,4],[10,2],[1,0]]', expectedOutput: 'deep copy' },
      { input: '[[1,1],[2,1]]', expectedOutput: 'deep copy' },
      { input: '[]', expectedOutput: '[]' }
    ],
    requiredForProgress: false
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-intersection-lists',
    title: 'Intersection of Two Linked Lists',
    description: 'Find intersection node of two lists in O(1) space',
    targetComplexity: { time: 'O(m+n)', space: 'O(1)' },
    instruction: `# Intersection of Two Linked Lists (LeetCode 160)

Given the heads of two singly linked lists, return the node at which they intersect. If no intersection, return null.

The lists have no cycles and must retain their original structure.

## Example

\`\`\`
List A:     a1 → a2 ↘
                      c1 → c2 → c3
List B: b1 → b2 → b3 ↗

Output: c1 (intersection node)
\`\`\`

## Constraints

- 0 <= list length <= 3 * 10^4

## Hidden Insight

If you concatenate A+B and B+A, both have the same total length. What does this mean for finding intersection?`,
    starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def getIntersectionNode(headA, headB):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Two-pointer technique: when one reaches end, redirect to the other list\'s head.' },
      { afterAttempt: 2, text: 'Both pointers travel same total distance (lenA + lenB), meeting at intersection.' },
      { afterAttempt: 3, text: 'If no intersection, both reach null at the same time.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `def getIntersectionNode(headA, headB):
    if not headA or not headB:
        return None

    pA, pB = headA, headB

    while pA != pB:
        # When reaching end, switch to other list's head
        pA = pA.next if pA else headB
        pB = pB.next if pB else headA

    return pA  # Either intersection or null

# Why it works:
# If lists intersect:
#   pA travels: a1→a2→c1→c2→c3→b1→b2→b3→c1
#   pB travels: b1→b2→b3→c1→c2→c3→a1→a2→c1
#   Both travel lenA + lenB, meeting at c1!
#
# If no intersection:
#   Both travel lenA + lenB, meeting at null`
    },
    solutionExplanation: `## Two-Pointer Technique

### The Insight
If A has length m and B has length n:
- pA travels: A then B = m + n
- pB travels: B then A = n + m

Same distance! They meet at intersection (or both at null).

### Visual
\`\`\`
A: [a1,a2] + [c1,c2,c3] (length 5)
B: [b1,b2,b3] + [c1,c2,c3] (length 6)

pA: a1→a2→c1→c2→c3→(switch)→b1→b2→b3→c1
pB: b1→b2→b3→c1→c2→c3→(switch)→a1→a2→c1
                                     ↑ meet!
\`\`\`

### Complexity
- **Time:** O(m + n)
- **Space:** O(1)`,
    testCases: [
      { input: 'A=[4,1,8,4,5], B=[5,6,1,8,4,5], intersect at 8', expectedOutput: 'Node(8)' },
      { input: 'A=[1,2], B=[3,4], no intersect', expectedOutput: 'null' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-sort-list',
    title: 'Sort Linked List',
    description: 'Sort list in O(n log n) time using merge sort',
    targetComplexity: { time: 'O(n log n)', space: 'O(log n)' },
    instruction: `# Sort List (LeetCode 148)

Given the head of a linked list, return the list after sorting it in ascending order.

## Examples

\`\`\`
Input: [4,2,1,3]
Output: [1,2,3,4]

Input: [-1,5,3,4,0]
Output: [-1,0,3,4,5]
\`\`\`

## Constraints

- 0 <= list length <= 5 * 10^4
- -10^5 <= Node.val <= 10^5

## Follow-up

Can you sort in O(n log n) time and O(1) space (ignoring recursion stack)?

## Hidden Insight

Merge sort is natural for linked lists - finding middle is O(n), but merging is O(1) space!`,
    starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def sortList(head):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Use merge sort: split list in half, sort each half, merge.' },
      { afterAttempt: 2, text: 'Split: use fast/slow to find middle, cut the list.' },
      { afterAttempt: 3, text: 'Merge: same as "merge two sorted lists" problem.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `def sortList(head):
    # Base case
    if not head or not head.next:
        return head

    # Find middle and split
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    mid = slow.next
    slow.next = None  # Cut the list

    # Recursively sort both halves
    left = sortList(head)
    right = sortList(mid)

    # Merge sorted halves
    dummy = ListNode(0)
    current = dummy
    while left and right:
        if left.val < right.val:
            current.next = left
            left = left.next
        else:
            current.next = right
            right = right.next
        current = current.next

    current.next = left or right
    return dummy.next`
    },
    solutionExplanation: `## Merge Sort for Linked Lists

### Why Merge Sort?
- Quick sort needs random access (bad for linked lists)
- Merge sort only needs sequential access + merge
- Linked list merge is O(1) space (reuse nodes)

### Algorithm
1. **Base case:** 0 or 1 node is sorted
2. **Split:** Find middle, cut list in two
3. **Recurse:** Sort both halves
4. **Merge:** Combine sorted halves

### Complexity
- **Time:** O(n log n) - divide by 2, merge in O(n)
- **Space:** O(log n) for recursion stack

### Note
Bottom-up merge sort achieves O(1) space but more complex.`,
    testCases: [
      { input: '[4,2,1,3]', expectedOutput: '[1,2,3,4]' },
      { input: '[-1,5,3,4,0]', expectedOutput: '[-1,0,3,4,5]' },
      { input: '[]', expectedOutput: '[]' },
      { input: '[1]', expectedOutput: '[1]' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-swap-pairs',
    title: 'Swap Nodes in Pairs',
    description: 'Swap every two adjacent nodes',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Swap Nodes in Pairs (LeetCode 24)

Given a linked list, swap every two adjacent nodes and return its head.

You must solve the problem without modifying the values in the nodes (only nodes themselves may be changed).

## Examples

\`\`\`
Input: [1,2,3,4]
Output: [2,1,4,3]

Input: [1]
Output: [1]

Input: []
Output: []
\`\`\`

## Constraints

- 0 <= list length <= 100
- 0 <= Node.val <= 100`,
    starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def swapPairs(head):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Use dummy node before head. Process pairs: prev→A→B→C becomes prev→B→A→C.' },
      { afterAttempt: 2, text: 'For each pair: save references, rewire 3 pointers, move prev forward by 2.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def swapPairs(head):
    dummy = ListNode(0, head)
    prev = dummy

    while prev.next and prev.next.next:
        # Identify the pair
        first = prev.next
        second = prev.next.next

        # Swap
        first.next = second.next
        second.next = first
        prev.next = second

        # Move to next pair
        prev = first

    return dummy.next

# Visual:
# prev → [A] → [B] → C
#        first  second
#
# After swap:
# prev → [B] → [A] → C
#        second first=new prev`
    },
    solutionExplanation: `## Pointer Manipulation

### Pattern
For each pair A→B:
1. \`first.next = second.next\` (A points past B)
2. \`second.next = first\` (B points to A)
3. \`prev.next = second\` (prev points to B)

### Visual Transformation
\`\`\`
prev → A → B → C
       ↓   ↓
prev → B → A → C
\`\`\`

### Why Dummy Node?
First swap modifies head. Dummy makes it uniform.

### Complexity
- **Time:** O(n)
- **Space:** O(1)`,
    testCases: [
      { input: '[1,2,3,4]', expectedOutput: '[2,1,4,3]' },
      { input: '[1]', expectedOutput: '[1]' },
      { input: '[]', expectedOutput: '[]' },
      { input: '[1,2,3]', expectedOutput: '[2,1,3]' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-reverse-k-group',
    title: 'Reverse Nodes in k-Group',
    description: 'Reverse list in groups of k nodes',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Reverse Nodes in k-Group (LeetCode 25)

Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list.

- k is a positive integer ≤ list length
- If nodes remaining < k, leave them as is

## Examples

\`\`\`
Input: [1,2,3,4,5], k = 2
Output: [2,1,4,3,5]

Input: [1,2,3,4,5], k = 3
Output: [3,2,1,4,5]
\`\`\`

## Constraints

- 1 <= list length <= 5000
- 1 <= k <= list length

## Hidden Insight

This is "Reverse Linked List II" generalized to multiple groups!`,
    starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseKGroup(head, k):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'First, check if k nodes remain. If not, return head unchanged.' },
      { afterAttempt: 2, text: 'Reverse k nodes, then recursively process the rest.' },
      { afterAttempt: 3, text: 'Connect: reversed group\'s tail → result of recursive call.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `def reverseKGroup(head, k):
    # Check if k nodes exist
    count = 0
    node = head
    while node and count < k:
        node = node.next
        count += 1

    if count < k:
        return head  # Not enough nodes

    # Reverse k nodes
    prev, current = None, head
    for _ in range(k):
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node

    # head is now tail of reversed group
    # Connect to rest (recursively processed)
    head.next = reverseKGroup(current, k)

    return prev  # New head of this group`
    },
    solutionExplanation: `## Recursive Approach

### Algorithm
1. **Check:** Do k nodes remain?
2. **Reverse:** Standard reversal for k nodes
3. **Recurse:** Process remaining list
4. **Connect:** Link reversed group to recursive result

### Visual
\`\`\`
[1,2,3,4,5], k=2

Reverse first 2: [2,1] + process([3,4,5])
Reverse next 2:  [2,1] + [4,3] + process([5])
Not enough:      [2,1] + [4,3] + [5]

Result: [2,1,4,3,5]
\`\`\`

### Complexity
- **Time:** O(n) - each node processed once
- **Space:** O(n/k) for recursion stack (O(1) iterative possible)`,
    testCases: [
      { input: '[1,2,3,4,5], 2', expectedOutput: '[2,1,4,3,5]' },
      { input: '[1,2,3,4,5], 3', expectedOutput: '[3,2,1,4,5]' },
      { input: '[1,2,3,4,5], 1', expectedOutput: '[1,2,3,4,5]' }
    ],
    requiredForProgress: false
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-remove-duplicates-sorted',
    title: 'Remove Duplicates from Sorted List',
    description: 'Remove duplicate values from sorted list',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Remove Duplicates from Sorted List (LeetCode 83)

Given the head of a sorted linked list, delete all duplicates such that each element appears only once. Return the sorted list.

## Examples

\`\`\`
Input: [1,1,2]
Output: [1,2]

Input: [1,1,2,3,3]
Output: [1,2,3]
\`\`\`

## Constraints

- 0 <= list length <= 300
- -100 <= Node.val <= 100
- List is sorted in ascending order`,
    starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def deleteDuplicates(head):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Since list is sorted, duplicates are adjacent.' },
      { afterAttempt: 2, text: 'Compare current.val with current.next.val. If equal, skip the next node.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def deleteDuplicates(head):
    current = head

    while current and current.next:
        if current.val == current.next.val:
            # Skip duplicate
            current.next = current.next.next
        else:
            # Move forward
            current = current.next

    return head`
    },
    solutionExplanation: `## Simple Skip Pattern

### Key Insight
Sorted list = duplicates are adjacent.

### Algorithm
If current.val == next.val:
- Skip next node (current.next = current.next.next)
- DON'T move current (might be more duplicates)

If different:
- Move to next node

### Visual
\`\`\`
[1,1,1,2,3,3]
 ↑
current.val == next.val → skip
[1,1,2,3,3]
 ↑
current.val == next.val → skip
[1,2,3,3]
 ↑
different → move forward
[1,2,3,3]
   ↑
different → move forward
[1,2,3,3]
     ↑
current.val == next.val → skip
[1,2,3]
     ↑
no next → done
\`\`\`

### Complexity
- **Time:** O(n)
- **Space:** O(1)`,
    testCases: [
      { input: '[1,1,2]', expectedOutput: '[1,2]' },
      { input: '[1,1,2,3,3]', expectedOutput: '[1,2,3]' },
      { input: '[]', expectedOutput: '[]' },
      { input: '[1,1,1,1]', expectedOutput: '[1]' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-partition-list',
    title: 'Partition List',
    description: 'Partition list around value x preserving relative order',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Partition List (LeetCode 86)

Given the head of a linked list and a value x, partition it such that all nodes **less than** x come before nodes **greater than or equal** to x.

Preserve the original relative order of the nodes in each partition.

## Examples

\`\`\`
Input: [1,4,3,2,5,2], x = 3
Output: [1,2,2,4,3,5]
        <3    >=3

Input: [2,1], x = 2
Output: [1,2]
\`\`\`

## Constraints

- 0 <= list length <= 200
- -100 <= Node.val <= 100
- -200 <= x <= 200`,
    starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def partition(head, x):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Create two separate lists: one for < x, one for >= x.' },
      { afterAttempt: 2, text: 'Use dummy nodes for both lists. Iterate and append to appropriate list.' },
      { afterAttempt: 3, text: 'Connect: small list\'s tail → large list\'s head. Set large tail\'s next to null!' }
    ],
    solution: {
      afterAttempt: 3,
      text: `def partition(head, x):
    # Two dummy nodes for two lists
    small_dummy = ListNode(0)
    large_dummy = ListNode(0)
    small = small_dummy
    large = large_dummy

    # Partition nodes into two lists
    while head:
        if head.val < x:
            small.next = head
            small = small.next
        else:
            large.next = head
            large = large.next
        head = head.next

    # Connect the two lists
    large.next = None  # Important! Avoid cycle
    small.next = large_dummy.next

    return small_dummy.next`
    },
    solutionExplanation: `## Two-List Partition

### Strategy
Build two lists:
- "small" list: nodes < x
- "large" list: nodes >= x

Then connect small → large.

### Critical Step
\`large.next = None\`

Without this, the last node might still point to something in the small list, creating a cycle!

### Visual
\`\`\`
[1,4,3,2,5,2], x=3

small: 1 → 2 → 2
large: 4 → 3 → 5

Connect: 1 → 2 → 2 → 4 → 3 → 5 → null
\`\`\`

### Complexity
- **Time:** O(n) - single pass
- **Space:** O(1) - reuse existing nodes`,
    testCases: [
      { input: '[1,4,3,2,5,2], 3', expectedOutput: '[1,2,2,4,3,5]' },
      { input: '[2,1], 2', expectedOutput: '[1,2]' },
      { input: '[], 1', expectedOutput: '[]' },
      { input: '[1,1], 2', expectedOutput: '[1,1]' }
    ],
    requiredForProgress: true
  }
];
