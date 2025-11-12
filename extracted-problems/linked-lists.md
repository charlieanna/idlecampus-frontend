# LINKED-LISTS Problems

Total Problems: 23

---

## 1. Reverse Linked List

**Difficulty:** easy
**Concept:** linked-lists
**Family:** linked-lists:reverse

### Description

🎯 FUNDAMENTAL PATTERN: Three-pointer reversal!

Reverse a singly linked list iteratively using prev, curr, and next pointers.

This is THE most important linked list pattern. Master it!

### Examples

**Example 1:**
- Input: head = [1,2,3,4,5]
- Output: [5,4,3,2,1]
- Explanation: Reverse entire list

**Example 2:**
- Input: head = [1,2]
- Output: [2,1]
- Explanation: Two nodes

**Example 3:**
- Input: head = []
- Output: []
- Explanation: Empty list

### Hints

1. Initialize: prev = None, curr = head
2. CRITICAL: Save next BEFORE reversing: next_temp = curr.next
3. Reverse the pointer: curr.next = prev
4. Move both pointers forward: prev = curr, curr = next_temp
5. After loop, prev is the new head
6. Draw it out! Visualize: None ← 1 ← 2 ← 3 ← 4 ← 5

### Starter Code

### Solution

### Test Cases

**Test 1:** Normal list
- Input: "([1,2,3,4,5])"
- Expected: "[5, 4, 3, 2, 1]"

**Test 2:** Two nodes
- Input: "([1,2])"
- Expected: "[2, 1]"

**Test 3:** Empty list
- Input: "([])"
- Expected: "[]"

---

## 2. Middle of Linked List

**Difficulty:** easy
**Concept:** linked-lists
**Family:** linked-lists:fast-slow-middle

### Description

🎯 PATTERN: Fast/Slow Pointers!

Find the middle node. If two middle nodes, return the second.

When fast reaches end, slow will be at middle!

### Examples

**Example 1:**
- Input: head = [1,2,3,4,5]
- Output: [3,4,5]
- Explanation: Middle is 3 (odd length)

**Example 2:**
- Input: head = [1,2,3,4,5,6]
- Output: [4,5,6]
- Explanation: Right-middle is 4 (even length)

### Hints

1. Initialize both at head: slow = fast = head
2. Loop condition: while fast AND fast.next (both!)
3. Fast moves twice: fast = fast.next.next
4. Slow moves once: slow = slow.next
5. When fast reaches end, slow is at middle
6. For even length, slow will be at right-middle

### Starter Code

### Solution

### Test Cases

**Test 1:** Odd length
- Input: "([1,2,3,4,5])"
- Expected: "[3, 4, 5]"

**Test 2:** Even length
- Input: "([1,2,3,4,5,6])"
- Expected: "[4, 5, 6]"

**Test 3:** Single node
- Input: "([1])"
- Expected: "[1]"

---

## 3. Linked List Cycle

**Difficulty:** easy
**Concept:** linked-lists
**Family:** linked-lists:cycle-detection

### Description

🎯 FLOYD'S ALGORITHM: Cycle detection!

Detect if linked list has a cycle.

If there's a cycle, fast will eventually catch slow. No cycle → fast reaches null.

### Examples

**Example 1:**
- Input: head = [3,2,0,-4], pos = 1
- Output: True
- Explanation: Tail connects to node index 1 (cycle exists)

**Example 2:**
- Input: head = [1,2], pos = -1
- Output: False
- Explanation: No cycle

### Hints

1. Same pattern as finding middle: fast/slow pointers
2. If they meet (slow == fast), cycle exists!
3. If fast reaches null, no cycle
4. Why? In a cycle, fast will lap slow eventually
5. Loop condition: while fast and fast.next

### Starter Code

### Solution

### Test Cases

**Test 1:** Cycle at pos 1
- Input: "([3,2,0,-4], 1)"
- Expected: "True"

**Test 2:** No cycle
- Input: "([1,2], -1)"
- Expected: "False"

**Test 3:** Single node, no cycle
- Input: "([1], -1)"
- Expected: "False"

---

## 4. Merge Two Sorted Lists

**Difficulty:** easy
**Concept:** linked-lists
**Family:** linked-lists:merge-sorted

### Description

🎯 DUMMY NODE PATTERN: Simplifies merging!

Merge two sorted lists into one sorted list.

Dummy node eliminates edge cases - no need to check if head is null separately.

### Examples

**Example 1:**
- Input: list1 = [1,2,4], list2 = [1,3,4]
- Output: [1,1,2,3,4,4]
- Explanation: Merge sorted

**Example 2:**
- Input: list1 = [], list2 = [0]
- Output: [0]
- Explanation: One empty list

### Hints

1. Dummy node: dummy = ListNode(0), curr = dummy
2. While both lists exist: compare values
3. Attach smaller node to curr.next
4. Move the pointer of the list you took from
5. Always move curr forward: curr = curr.next
6. After loop: attach remaining list (one will be exhausted)
7. Return dummy.next (skip dummy node)

### Starter Code

### Solution

### Test Cases

**Test 1:** Merge sorted
- Input: "([1,2,4], [1,3,4])"
- Expected: "[1, 1, 2, 3, 4, 4]"

**Test 2:** One empty
- Input: "([], [0])"
- Expected: "[0]"

**Test 3:** Different lengths
- Input: "([5], [1,2,4])"
- Expected: "[1, 2, 4, 5]"

---

## 5. Remove Nth Node From End

**Difficulty:** medium
**Concept:** linked-lists
**Family:** linked-lists:nth-from-end

### Description

🎯 RUNNER PATTERN: Two pointers n+1 apart!

Remove the nth node from the end of list.

Use dummy node + two pointers with gap of n+1 to stop before target.

### Examples

**Example 1:**
- Input: head = [1,2,3,4,5], n = 2
- Output: [1,2,3,5]
- Explanation: Remove 4 (2nd from end)

**Example 2:**
- Input: head = [1], n = 1
- Output: []
- Explanation: Remove only node

### Hints

1. MUST use dummy node (head might be removed!)
2. Initialize: slow = fast = dummy
3. Move fast EXACTLY n+1 steps (not n!)
4. Then move both together until fast reaches null
5. slow will be right BEFORE the target node
6. Remove: slow.next = slow.next.next
7. Why n+1? So slow stops one node before target

### Starter Code

### Solution

### Test Cases

**Test 1:** Remove 2nd from end
- Input: "([1,2,3,4,5], 2)"
- Expected: "[1, 2, 3, 5]"

**Test 2:** Remove only node
- Input: "([1], 1)"
- Expected: "[]"

**Test 3:** Remove head
- Input: "([1,2], 2)"
- Expected: "[2]"

---

## 6. Palindrome Linked List

**Difficulty:** easy
**Concept:** linked-lists
**Family:** linked-lists:palindrome-check

### Description

🎯 COMBINE PATTERNS: Fast/slow + reversal!

Check if linked list is palindrome in O(n) time, O(1) space.

Strategy: Find middle, reverse second half, compare both halves.

### Examples

**Example 1:**
- Input: head = [1,2,2,1]
- Output: True
- Explanation: Palindrome

**Example 2:**
- Input: head = [1,2]
- Output: False
- Explanation: Not palindrome

### Hints

1. Step 1: Find middle using fast/slow (middle or right-middle)
2. Step 2: Reverse from middle to end (prev/curr/next)
3. Step 3: Compare from head and reversed half
4. Compare while right exists (shorter or equal)
5. If values differ at any point → False
6. All match → True

### Starter Code

### Solution

### Test Cases

**Test 1:** Even palindrome
- Input: "([1,2,2,1])"
- Expected: "True"

**Test 2:** Odd palindrome
- Input: "([1,2,3,2,1])"
- Expected: "True"

**Test 3:** Not palindrome
- Input: "([1,2])"
- Expected: "False"

---

## 7. Linked List Cycle II

**Difficulty:** medium
**Concept:** linked-lists
**Family:** linked-lists:cycle-entry

### Description

🎯 FLOYD'S PHASE 2: Find cycle start!

Return the node where cycle begins, or null if no cycle.

💡 TWO PHASE ALGORITHM:
Phase 1: Detect cycle (fast/slow meet)
Phase 2: Find start (reset slow to head, move both 1 step)

⚠️ Math proof: They meet at cycle start!

### Examples

**Example 1:**
- Input: head = [3,2,0,-4], pos = 1
- Output: 2
- Explanation: Cycle starts at node with value 2

**Example 2:**
- Input: head = [1,2], pos = -1
- Output: None
- Explanation: No cycle

### Hints

1. Phase 1: Same as cycle detection (fast/slow)
2. If they meet, cycle exists
3. Phase 2: Reset slow to head (keep fast at meeting point)
4. Move BOTH one step at a time
5. When they meet again → cycle start!
6. Mathematical proof: distances are equal

### Starter Code

### Solution

### Test Cases

**Test 1:** Cycle at index 1
- Input: "([3,2,0,-4], 1)"
- Expected: "2"

**Test 2:** No cycle
- Input: "([1,2], -1)"
- Expected: "None"

**Test 3:** Self loop
- Input: "([1], 0)"
- Expected: "1"

---

## 8. Intersection of Two Linked Lists

**Difficulty:** easy
**Concept:** linked-lists

### Description

🎯 BEAUTIFUL TRICK: Equal path lengths!

Find the node where two lists intersect, or null.

💡 INSIGHT: Switch heads when reaching end
Both pointers travel same total distance!
They'll meet at intersection (or null).

⚠️ Works even if no intersection!

### Examples

**Example 1:**
- Input: listA = [4,1,8,4,5], listB = [5,6,1,8,4,5]
- Output: 8
- Explanation: Intersect at node 8

**Example 2:**
- Input: listA = [1,2], listB = [3,4]
- Output: None
- Explanation: No intersection

### Hints

1. Initialize: pA = headA, pB = headB
2. Loop while pA != pB
3. Move pA: if null, switch to headB; else pA.next
4. Move pB: if null, switch to headA; else pB.next
5. Why? Both travel lenA + lenB distance
6. They sync up at intersection (or both become null)
7. Return pA (will be intersection or None)

### Starter Code

### Solution

### Test Cases

**Test 1:** Intersect at 8
- Input: "([4,1,8,4,5], [5,6,1,8,4,5])"
- Expected: "8"

**Test 2:** No intersection
- Input: "([1,2], [3,4])"
- Expected: "None"

**Test 3:** Same node
- Input: "([1], [1])"
- Expected: "1"

---

## 9. Remove Duplicates from Sorted List

**Difficulty:** easy
**Concept:** linked-lists
**Family:** linked-lists:remove-duplicates-sorted

### Description

🎯 SIMPLE PATTERN: Skip duplicates!

Remove duplicates from sorted list.

💡 STRATEGY: If curr.val == curr.next.val → skip next
Else → move forward

⚠️ Sorted = duplicates are adjacent!

### Examples

**Example 1:**
- Input: head = [1,1,2]
- Output: [1,2]
- Explanation: Remove duplicate 1

**Example 2:**
- Input: head = [1,1,2,3,3]
- Output: [1,2,3]
- Explanation: Remove all duplicates

### Hints

1. Start at head: curr = head
2. While curr and curr.next exist
3. If curr.val == curr.next.val: skip next
4. Skip by: curr.next = curr.next.next
5. Else: move forward: curr = curr.next
6. Return head (head never changes)

### Starter Code

### Solution

### Test Cases

**Test 1:** Simple duplicate
- Input: "([1,1,2])"
- Expected: "[1, 2]"

**Test 2:** Multiple duplicates
- Input: "([1,1,2,3,3])"
- Expected: "[1, 2, 3]"

**Test 3:** No duplicates
- Input: "([1,2,3])"
- Expected: "[1, 2, 3]"

---

## 10. Delete Node in a Linked List

**Difficulty:** easy
**Concept:** linked-lists
**Family:** linked-lists:delete-node-no-head

### Description

🎯 CLEVER TRICK: Copy next, delete next!

Delete a node when you only have access to that node (not head).

💡 INSIGHT: Copy next node's value, then delete next!
Can't access previous, so make current look like next, delete next.

### Examples

**Example 1:**
- Input: head = [4,5,1,9], node = 5
- Output: [4,1,9]
- Explanation: Copy 1 to node 5, delete node 1

### Hints

1. Can't access previous node
2. Copy next node's value: node.val = node.next.val
3. Delete next node: node.next = node.next.next
4. Node is not the tail (guaranteed)
5. This makes current node 'become' the next node

### Starter Code

### Solution

### Test Cases

**Test 1:** Delete middle node
- Input: "([4,5,1,9], 5)"
- Expected: "[4, 1, 9]"

**Test 2:** Delete another node
- Input: "([4,5,1,9], 1)"
- Expected: "[4, 5, 9]"

---

## 11. Odd Even Linked List

**Difficulty:** medium
**Concept:** linked-lists

### Description

🎯 TWO LISTS: Odd indices + even indices!

Group odd index nodes together, then even index nodes.

💡 STRATEGY:
- Maintain odd and even pointers
- Build two separate lists
- Connect odd tail to even head

### Examples

**Example 1:**
- Input: head = [1,2,3,4,5]
- Output: [1,3,5,2,4]
- Explanation: Odd indices [1,3,5], even [2,4]

**Example 2:**
- Input: head = [2,1,3,5,6,4,7]
- Output: [2,3,6,7,1,5,4]
- Explanation: Group by index parity

### Hints

1. Save even head: evenHead = head.next
2. Use two pointers: odd = head, even = head.next
3. Move both: odd.next = odd.next.next, even.next = even.next.next
4. Advance: odd = odd.next, even = even.next
5. Connect: odd.next = evenHead
6. Return head (unchanged)

### Starter Code

### Solution

### Test Cases

**Test 1:** Odd length
- Input: "([1,2,3,4,5])"
- Expected: "[1, 3, 5, 2, 4]"

**Test 2:** Complex case
- Input: "([2,1,3,5,6,4,7])"
- Expected: "[2, 3, 6, 7, 1, 5, 4]"

**Test 3:** Single node
- Input: "([1])"
- Expected: "[1]"

---

## 12. Swap Nodes in Pairs

**Difficulty:** medium
**Concept:** linked-lists

### Description

🎯 PAIR SWAPPING: Swap adjacent nodes!

Swap every two adjacent nodes.

💡 DUMMY NODE + CAREFUL POINTER MANIPULATION
Must track: prev, first, second nodes in each pair

### Examples

**Example 1:**
- Input: head = [1,2,3,4]
- Output: [2,1,4,3]
- Explanation: Swap pairs: (1,2), (3,4)

**Example 2:**
- Input: head = [1]
- Output: [1]
- Explanation: Single node

**Example 3:**
- Input: head = [1,2,3]
- Output: [2,1,3]
- Explanation: Odd length, last unpaired

### Hints

1. Use dummy node: dummy.next = head
2. Track prev, first, second for each swap
3. Swap: prev.next = second, first.next = second.next, second.next = first
4. Move prev to first (now swapped position)
5. Continue if first.next and first.next.next exist
6. Return dummy.next

### Starter Code

### Solution

### Test Cases

**Test 1:** Even pairs
- Input: "([1,2,3,4])"
- Expected: "[2, 1, 4, 3]"

**Test 2:** Single node
- Input: "([1])"
- Expected: "[1]"

**Test 3:** Odd length
- Input: "([1,2,3])"
- Expected: "[2, 1, 3]"

---

## 13. Add Two Numbers

**Difficulty:** medium
**Concept:** linked-lists

### Description

🎯 DIGIT-BY-DIGIT ADDITION: Handle carry!

Add two numbers represented as linked lists (digits in reverse order).

💡 STRATEGY:
- Dummy node for result
- Track carry
- Process both lists + carry together

### Examples

**Example 1:**
- Input: l1 = [2,4,3], l2 = [5,6,4]
- Output: [7,0,8]
- Explanation: 342 + 465 = 807

**Example 2:**
- Input: l1 = [9,9], l2 = [1]
- Output: [0,0,1]
- Explanation: 99 + 1 = 100

### Hints

1. Dummy node pattern: dummy = ListNode(0), curr = dummy
2. Track carry: carry = 0 initially
3. Loop: while l1 OR l2 OR carry (continue if any exists)
4. Get values: val1 = l1.val if l1 else 0
5. Calculate: total = val1 + val2 + carry
6. New carry: carry = total // 10
7. New digit: total % 10
8. Don't forget to move all pointers!

### Starter Code

### Solution

### Test Cases

**Test 1:** 342 + 465
- Input: "([2,4,3], [5,6,4])"
- Expected: "[7, 0, 8]"

**Test 2:** 99 + 1 with carry
- Input: "([9,9], [1])"
- Expected: "[0, 0, 1]"

**Test 3:** 0 + 0
- Input: "([0], [0])"
- Expected: "[0]"

---

## 14. Reorder List

**Difficulty:** medium
**Concept:** linked-lists

### Description

🎯 ULTIMATE COMBO: Find middle + reverse + merge!

Reorder: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 ...

💡 THREE STEPS:
1. Find middle (fast/slow)
2. Reverse second half
3. Merge alternating

⚠️ Master pattern combination!

### Examples

**Example 1:**
- Input: head = [1,2,3,4]
- Output: [1,4,2,3]
- Explanation: Alternate from ends

**Example 2:**
- Input: head = [1,2,3,4,5]
- Output: [1,5,2,4,3]
- Explanation: Odd length

### Hints

1. Step 1: Find middle (stop at node BEFORE middle)
2. Use: while fast.next and fast.next.next
3. Step 2: Split list (slow.next = None)
4. Reverse second half using prev/curr/next
5. Step 3: Merge alternating from both halves
6. Save next pointers: tmp1 = first.next, tmp2 = second.next
7. Connect: first.next = second, second.next = tmp1
8. Move: first = tmp1, second = tmp2

### Starter Code

### Solution

### Test Cases

**Test 1:** Even length
- Input: "([1,2,3,4])"
- Expected: "[1, 4, 2, 3]"

**Test 2:** Odd length
- Input: "([1,2,3,4,5])"
- Expected: "[1, 5, 2, 4, 3]"

**Test 3:** Two nodes
- Input: "([1,2])"
- Expected: "[1, 2]"

---

## 15. Reverse Nodes in k-Group

**Difficulty:** hard
**Concept:** linked-lists

### Description

🎯 ADVANCED: Reverse in groups!

Reverse nodes in groups of k. If remaining < k, leave as-is.

💡 STRATEGY:
1. Count if k nodes available
2. Reverse k nodes
3. Connect to previous group
4. Repeat

⚠️ Most complex linked list problem!

### Examples

**Example 1:**
- Input: head = [1,2,3,4,5], k = 2
- Output: [2,1,4,3,5]
- Explanation: Reverse pairs, 5 left alone

**Example 2:**
- Input: head = [1,2,3,4,5], k = 3
- Output: [3,2,1,4,5]
- Explanation: Reverse first 3, last 2 unchanged

### Hints

1. Dummy node essential for head changes
2. prev_group tracks end of previous group
3. Count k nodes: if can't find k, return
4. Reverse k nodes: prev starts at kth.next (for connection)
5. Standard reversal but only k iterations
6. Connect: prev_group.next = new_head (prev after reversal)
7. Update: prev_group = old_head (now tail of reversed)
8. This is the hardest linked list problem!

### Starter Code

### Solution

### Test Cases

**Test 1:** k=2
- Input: "([1,2,3,4,5], 2)"
- Expected: "[2, 1, 4, 3, 5]"

**Test 2:** k=3
- Input: "([1,2,3,4,5], 3)"
- Expected: "[3, 2, 1, 4, 5]"

**Test 3:** Exact k
- Input: "([1,2], 2)"
- Expected: "[2, 1]"

---

## 16. Convert Array to Linked List and Find Pattern

**Difficulty:** medium
**Concept:** linked-lists

### Description

🎯 INTEGRATION: Arrays → Linked Lists → Two Pointers!

Given an array, convert it to a linked list, then use two pointers to find if any two nodes sum to a target.

💡 COMBINES THREE CONCEPTS:
1. Array to linked list conversion
2. Linked list traversal  
3. Two pointer technique (modified for linked lists)

This tests if you can apply array techniques to linked structures!

### Examples

**Example 1:**
- Input: arr = [1,2,3,4,5], target = 9
- Output: True
- Explanation: 4+5=9 exists in the list

**Example 2:**
- Input: arr = [1,2,3], target = 10
- Output: False
- Explanation: No two values sum to 10

**Example 3:**
- Input: arr = [5,5,5], target = 10
- Output: True
- Explanation: 5+5=10

### Hints

1. Create dummy node, build list from array values
2. After building list, use hash set while traversing
3. Check if target - curr.val exists in set
4. Add curr.val to set for future checks
5. This combines array→list conversion with two-sum pattern

### Starter Code

### Solution

### Test Cases

**Test 1:** Sum exists (4+5)
- Input: "([1,2,3,4,5], 9)"
- Expected: "True"

**Test 2:** No sum
- Input: "([1,2,3], 10)"
- Expected: "False"

**Test 3:** Duplicate values
- Input: "([5,5,5], 10)"
- Expected: "True"

---

## 17. Maximum Sum of K Consecutive Nodes

**Difficulty:** medium
**Concept:** linked-lists

### Description

🎯 SLIDING WINDOW ON LINKED LIST!

Find maximum sum of k consecutive nodes in a linked list.

💡 ARRAYS vs LINKED LISTS:
- Arrays: Easy sliding window with indices
- Linked Lists: Must maintain window with pointers!

⚠️ KEY CHALLENGE: Can't use arr[i] - need pointer movement!

### Examples

**Example 1:**
- Input: head = [1,2,3,4,5], k = 2
- Output: 9
- Explanation: Max sum of 2 consecutive: 4+5=9

**Example 2:**
- Input: head = [10,1,1,1,10], k = 3
- Output: 12
- Explanation: 10+1+1=12

**Example 3:**
- Input: head = [1,2,3], k = 1
- Output: 3
- Explanation: Single node max is 3

### Hints

1. Calculate sum of first k nodes
2. Use two pointers: left and right, k nodes apart
3. Slide window: subtract left.val, add new right.val
4. Track max_sum while sliding
5. Similar to array sliding window but with pointers!

### Starter Code

### Solution

### Test Cases

**Test 1:** k=2, max is 4+5
- Input: "([1,2,3,4,5], 2)"
- Expected: "9"

**Test 2:** k=3, max is 10+1+1
- Input: "([10,1,1,1,10], 3)"
- Expected: "12"

**Test 3:** k=1, max is 3
- Input: "([1,2,3], 1)"
- Expected: "3"

---

## 18. Reverse Print Without Reversing

**Difficulty:** easy
**Concept:** linked-lists

### Description

🎯 REVERSE TRAVERSAL THINKING!

Print linked list values in reverse order WITHOUT reversing the list structure.

💡 ARRAYS: Just iterate backwards from end
💡 LINKED LISTS: No random access! Use recursion or stack!

This tests reverse traversal concepts on linked structures.

### Examples

**Example 1:**
- Input: head = [1,2,3,4,5]
- Output: [5,4,3,2,1]
- Explanation: Values in reverse order

**Example 2:**
- Input: head = [1]
- Output: [1]
- Explanation: Single node

**Example 3:**
- Input: head = []
- Output: []
- Explanation: Empty list

### Hints

1. Recursion: Process head.next first, then current
2. Or use explicit stack to store values
3. Stack: push all values, then pop
4. Recursive base case: if not head, return []
5. This mimics reverse traversal in arrays!

### Starter Code

### Solution

### Test Cases

**Test 1:** Normal list
- Input: "([1,2,3,4,5])"
- Expected: "[5, 4, 3, 2, 1]"

**Test 2:** Single node
- Input: "([1])"
- Expected: "[1]"

**Test 3:** Empty list
- Input: "([])"
- Expected: "[]"

---

## 19. Merge K Sorted Lists

**Difficulty:** hard
**Concept:** linked-lists

### Description

🎯 HEAPS + DUMMY NODE COMBO!

Merge k sorted linked lists into one sorted list.

💡 STRATEGY:
1. Use min-heap to track smallest current node from each list
2. Use dummy node for clean merging
3. Combines heap chapter + dummy node pattern!

⚠️ COMMON MISTAKE: Trying to merge one-by-one (too slow!)

### Examples

**Example 1:**
- Input: lists = [[1,4,5],[1,3,4],[2,6]]
- Output: [1,1,2,3,4,4,5,6]
- Explanation: Merge all k sorted lists

**Example 2:**
- Input: lists = [[]]
- Output: []
- Explanation: Empty list

**Example 3:**
- Input: lists = [[1],[0]]
- Output: [0,1]
- Explanation: Two single-node lists

### Hints

1. Initialize heap with first node from each list
2. Use dummy node for result list
3. Pop min from heap, add to result, push next node from same list
4. Python tuples compare by first element (value)
5. Time: O(N log k) where N=total nodes, k=number of lists
6. Combines heaps + dummy node patterns!

### Starter Code

### Solution

### Test Cases

**Test 1:** Merge 3 lists
- Input: "([[1,4,5],[1,3,4],[2,6]])"
- Expected: "[1, 1, 2, 3, 4, 4, 5, 6]"

**Test 2:** Empty list
- Input: "([[]])"
- Expected: "[]"

**Test 3:** Two single nodes
- Input: "([[1],[0]])"
- Expected: "[0, 1]"

---

## 20. Copy List with Random Pointer

**Difficulty:** medium
**Concept:** linked-lists

### Description

🎯 HASH MAP FOR NODE MAPPING!

Copy linked list where each node has a random pointer to any node.

💡 CHALLENGE: Random pointers create complex connections
💡 SOLUTION: Two passes with hash map!

Pass 1: Create all new nodes, map old→new
Pass 2: Connect next and random pointers

This tests hash map skills on complex structures!

### Examples

**Example 1:**
- Input: head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
- Output: [[7,null],[13,0],[11,4],[10,2],[1,0]]
- Explanation: Deep copy with same structure

**Example 2:**
- Input: head = [[1,1],[2,1]]
- Output: [[1,1],[2,1]]
- Explanation: Random pointers preserved

**Example 3:**
- Input: head = []
- Output: []
- Explanation: Empty list

### Hints

1. Use dict to map old_node → new_node
2. First pass: for each old node, create new node with same val
3. Second pass: new_node.next = map[old_node.next]
4. Second pass: new_node.random = map[old_node.random]
5. Handle None pointers carefully!
6. This is a classic hash map problem on linked lists

### Starter Code

### Solution

### Test Cases

**Test 1:** Complex random pointers
- Input: "([[7,null],[13,0],[11,4],[10,2],[1,0]])"
- Expected: "[[7, None], [13, 0], [11, 4], [10, 2], [1, 0]]"

**Test 2:** Self and back pointers
- Input: "([[1,1],[2,1]])"
- Expected: "[[1, 1], [2, 1]]"

**Test 3:** Empty list
- Input: "([])"
- Expected: "[]"

---

## 21. Reverse Linked List II

**Difficulty:** medium
**Concept:** linked-lists

### Description

🎯 PARTIAL REVERSAL: Reverse between positions!

Reverse nodes from position m to n (1-indexed).

💡 STRATEGY:
1. Navigate to position m-1 (before reversal start)
2. Reverse nodes from m to n
3. Reconnect reversed section

⚠️ EDGE CASE: m=1 means reversing from head!

### Examples

**Example 1:**
- Input: head = [1,2,3,4,5], m = 2, n = 4
- Output: [1,4,3,2,5]
- Explanation: Reverse nodes 2-4: [2,3,4] becomes [4,3,2]

**Example 2:**
- Input: head = [5], m = 1, n = 1
- Output: [5]
- Explanation: Single node, no change

**Example 3:**
- Input: head = [3,5], m = 1, n = 2
- Output: [5,3]
- Explanation: Reverse entire list

### Hints

1. Use dummy node (head might be in reversed section)
2. Navigate to m-1: prev pointer stops before reversal
3. Save tail = prev.next (will become tail after reversal)
4. Reverse exactly (n - m + 1) nodes
5. After reversal: prev.next = new_head
6. Connect tail: tail.next = curr (node after position n)
7. Think: [before] → [reversed section] → [after]

### Starter Code

### Solution

### Test Cases

**Test 1:** Reverse middle section
- Input: "([1,2,3,4,5], 2, 4)"
- Expected: "[1, 4, 3, 2, 5]"

**Test 2:** Single node
- Input: "([5], 1, 1)"
- Expected: "[5]"

**Test 3:** Reverse entire list
- Input: "([3,5], 1, 2)"
- Expected: "[5, 3]"

**Test 4:** Reverse from head
- Input: "([1,2,3], 1, 2)"
- Expected: "[2, 1, 3]"

---

## 22. Remove Duplicates from Sorted List II

**Difficulty:** medium
**Concept:** linked-lists

### Description

🎯 REMOVE ALL DUPLICATES!

Remove ALL nodes that have duplicate values (keep none).

💡 DIFFERENCE:
- LC 83: Keep one copy of duplicates
- LC 82 (this): Remove ALL duplicate nodes!

⚠️ DUMMY NODE ESSENTIAL: Head might be removed!

### Examples

**Example 1:**
- Input: head = [1,2,3,3,4,4,5]
- Output: [1,2,5]
- Explanation: Remove all 3's and 4's (duplicates)

**Example 2:**
- Input: head = [1,1,1,2,3]
- Output: [2,3]
- Explanation: Remove all 1's

**Example 3:**
- Input: head = [1,1,2,2]
- Output: []
- Explanation: All are duplicates, remove all

### Hints

1. MUST use dummy node (head might be duplicate)
2. prev points to last node we're keeping
3. Check: if prev.next.val == prev.next.next.val (duplicate found)
4. When duplicate found: save dup_val = prev.next.val
5. Skip ALL: while prev.next and prev.next.val == dup_val
6. Don't move prev (might be more duplicates)
7. Only move prev when no duplicate: prev = prev.next

### Starter Code

### Solution

### Test Cases

**Test 1:** Remove duplicates
- Input: "([1,2,3,3,4,4,5])"
- Expected: "[1, 2, 5]"

**Test 2:** Remove all 1's
- Input: "([1,1,1,2,3])"
- Expected: "[2, 3]"

**Test 3:** All duplicates
- Input: "([1,1,2,2])"
- Expected: "[]"

---

## 23. LRU Cache

**Difficulty:** medium
**Concept:** linked-lists
**Additional Concepts:** linked-lists, hash-map

### Description

🎯 ADVANCED: Design an LRU (Least Recently Used) Cache!

**The Challenge**: Implement a cache with O(1) get() and put() operations.

**Key Insight**: Combine TWO data structures:
• **Hash Map**: For O(1) lookup (key → node)
• **Doubly Linked List**: For O(1) add/remove (track order)

**Why Doubly Linked List?**
• Most recent at HEAD
• Least recent at TAIL
• Can remove from middle in O(1) (if we have the node reference!)

**The Pattern**:
1. get(key): Move accessed node to front (most recent)
2. put(key, value): Add to front, evict tail if at capacity

**Real-world use**: Browser caches, database query caches, CDNs!

### Examples

**Example 1:**
- Input: LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2)
- Output: 1, -1
- Explanation: get(1) returns 1. put(3,3) evicts key 2. get(2) returns -1 (not found)

**Example 2:**
- Input: LRUCache(2); put(1,1); put(2,2); put(1,10); get(1); get(2)
- Output: 10, 2
- Explanation: put(1,10) updates existing key, doesn't evict

### Hints

1. Use dummy head and tail nodes to avoid null checks
2. _remove(node): node.prev.next = node.next; node.next.prev = node.prev
3. _add_to_front(node): Insert between head and head.next
4. get(): If key exists, _remove(node) then _add_to_front(node), return value
5. put(): If key exists, update value and move to front
6. put() new key: If at capacity, remove tail.prev (LRU), then add new node to front
7. Always update cache dict when adding/removing nodes!
8. Pattern: Remove from old position, add to front = 'move to front'

### Starter Code

### Solution

### Test Cases

**Test 1:** Basic get after put
- Input: "cache = LRUCache(2); cache.put(1, 1); cache.put(2, 2); cache.get(1)"
- Expected: "1"

**Test 2:** Eviction - key 2 evicted
- Input: "cache = LRUCache(2); cache.put(1, 1); cache.put(2, 2); cache.put(3, 3); cache.get(2)"
- Expected: "-1"

**Test 3:** Update existing key
- Input: "cache = LRUCache(2); cache.put(1, 1); cache.put(2, 2); cache.put(1, 10); cache.get(1)"
- Expected: "10"

**Test 4:** Capacity 1
- Input: "cache = LRUCache(1); cache.put(1, 1); cache.put(2, 2); cache.get(1)"
- Expected: "-1"

---
