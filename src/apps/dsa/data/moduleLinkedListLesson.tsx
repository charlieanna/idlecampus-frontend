import { ProgressiveLesson, LessonSection } from '../types/progressive-lesson-enhanced';
import { DummyNodeDiagram } from '../components/core/DummyNodeDiagram';
import { LinkedListStructureDiagram } from '../components/core/LinkedListDiagram';
import { module5LinkedListLessonSmartPracticeExercises } from './exercises/moduleLinkedListLessonSmartPracticeExercises';

export const module5LinkedListLesson: ProgressiveLesson = {
  id: 'linked-list-mastery',
  title: 'Module: Linked List Mastery',
  description: 'Learn to handle linked lists and master the dummy node technique',
  unlockMode: 'sequential',
  sections: [
    // SECTION 1: Introduction to Linked Lists
    {
      type: 'reading',
      id: 'linked-list-intro',
      title: 'What is a Linked List?',
      practiceExercise: {
        title: 'Try It: Create and Traverse Linked List',
        instruction: `# Create and Traverse a Linked List

Create a simple linked list with nodes [1, 2, 3] and traverse it to print all values.

**Your Task:**
1. Create a ListNode class
2. Create a linked list: 1 -> 2 -> 3
3. Write a function to traverse and print all values

**Hint:** Use a while loop to traverse until current is None.`,
        starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def traverse_list(head):
    pass`,
        solution: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def traverse_list(head):
    current = head
    while current:
        print(current.val, end=' ')
        current = current.next
    print()  # Newline at end`,
        testCases: [
          { input: '[1, 2, 3]', expectedOutput: '1 2 3' },
        ],
        difficulty: 'easy'
      },
      content: (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-slate-900">What is a Linked List?</h1>

          <p className="text-slate-700 text-lg">A linked list is a sequence of nodes where each node contains data and a pointer to the next node.</p>

          {/* Visual Diagrams */}
          <LinkedListStructureDiagram />

          <h2 className="text-2xl font-semibold text-slate-900 mt-6">The ListNode Class</h2>

          <p className="text-slate-700">Every linked list node has two parts:</p>

          <div className="bg-slate-100 rounded-lg p-4 border border-slate-300">
            <pre className="text-sm overflow-x-auto"><code>{`class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val    # The data stored in this node
        self.next = next  # Pointer to the next node (or None)`}</code></pre>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 mt-6">How to Build a Linked List</h2>

          <p className="text-slate-700">To create the list <code className="bg-slate-200 px-2 py-1 rounded">1 → 2 → 3</code>:</p>

          <div className="bg-slate-100 rounded-lg p-4 border border-slate-300">
            <pre className="text-sm overflow-x-auto"><code>{`# Method 1: Build backwards (cleaner)
node3 = ListNode(3)           # 3 → None
node2 = ListNode(2, node3)    # 2 → 3 → None
node1 = ListNode(1, node2)    # 1 → 2 → 3 → None
head = node1                  # head points to first node

# Method 2: Build forwards (link as you go)
head = ListNode(1)            # 1 → None
head.next = ListNode(2)       # 1 → 2 → None
head.next.next = ListNode(3)  # 1 → 2 → 3 → None`}</code></pre>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 mt-6">How to Traverse a Linked List</h2>

          <p className="text-slate-700">Use a <code className="bg-slate-200 px-2 py-1 rounded">current</code> pointer and follow <code className="bg-slate-200 px-2 py-1 rounded">.next</code> until you reach <code className="bg-slate-200 px-2 py-1 rounded">None</code>:</p>

          <div className="bg-slate-100 rounded-lg p-4 border border-slate-300">
            <pre className="text-sm overflow-x-auto"><code>{`def traverse(head):
    current = head              # Start at the head
    while current:              # While not at the end
        print(current.val)      # Process current node
        current = current.next  # Move to next node

# Example: For list 1 → 2 → 3
# Iteration 1: current = node(1), print 1, move to node(2)
# Iteration 2: current = node(2), print 2, move to node(3)
# Iteration 3: current = node(3), print 3, move to None
# Loop ends: current = None`}</code></pre>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 mt-6">Arrays vs Linked Lists: Memory Layout</h2>

          <p className="text-slate-700">The key difference is how they store data in memory:</p>

          <div className="bg-slate-100 rounded-lg p-4 border border-slate-300 mt-4">
            <pre className="text-sm overflow-x-auto"><code>{`# ARRAY: Contiguous memory (elements stored next to each other)
# Memory: [10][20][30][40][50]
#          ↑   ↑   ↑   ↑   ↑
#         100 104 108 112 116  (memory addresses)
#
# To access arr[3]: just go to address 100 + (3 × 4) = 112
# Super fast! CPU can predict and pre-fetch next elements.

# LINKED LIST: Scattered memory (nodes anywhere in memory)
# Memory: [10|ptr] ... [20|ptr] ... [30|ptr] ... [40|None]
#          ↑            ↑            ↑            ↑
#         100          500          250          800  (random addresses)
#
# To access 4th element: must follow 100 → 500 → 250 → 800
# Slower! CPU can't predict where next node is.`}</code></pre>
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mt-6">Why Arrays Are Fast for Access</h3>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-slate-700"><strong>Cache Locality:</strong> When CPU reads arr[0], it automatically loads nearby memory (arr[1], arr[2], etc.) into cache. Accessing consecutive elements is extremely fast because they're already in CPU cache!</p>
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mt-6">Why Arrays Are Slow for Insert/Delete</h3>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-slate-700"><strong>Shifting Problem:</strong> To insert at beginning of [10, 20, 30], you must shift ALL elements right to make room. For 1 million elements, that's 1 million moves!</p>
          </div>

          <div className="bg-slate-100 rounded-lg p-4 border border-slate-300 mt-4">
            <pre className="text-sm overflow-x-auto"><code>{`# Insert 5 at beginning of [10, 20, 30]
# Step 1: [10, 20, 30, __]  # Make room
# Step 2: [10, 20, __, 30]  # Shift 30
# Step 3: [10, __, 20, 30]  # Shift 20
# Step 4: [__, 10, 20, 30]  # Shift 10
# Step 5: [5, 10, 20, 30]   # Insert 5
# That's O(n) work!

# Linked List: Just update 2 pointers!
# Before: head → [10] → [20] → [30]
# After:  head → [5] → [10] → [20] → [30]
# That's O(1) work!`}</code></pre>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 mt-6">Time Complexity Comparison</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-300">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border border-slate-300 px-4 py-2 text-left">Operation</th>
                  <th className="border border-slate-300 px-4 py-2 text-left">Array</th>
                  <th className="border border-slate-300 px-4 py-2 text-left">Linked List</th>
                  <th className="border border-slate-300 px-4 py-2 text-left">Why?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Access by index</td>
                  <td className="border border-slate-300 px-4 py-2 text-green-600 font-bold">O(1)</td>
                  <td className="border border-slate-300 px-4 py-2 text-red-600">O(n)</td>
                  <td className="border border-slate-300 px-4 py-2 text-sm">Array: direct address calc. List: must traverse</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Insert at beginning</td>
                  <td className="border border-slate-300 px-4 py-2 text-red-600">O(n)</td>
                  <td className="border border-slate-300 px-4 py-2 text-green-600 font-bold">O(1)</td>
                  <td className="border border-slate-300 px-4 py-2 text-sm">Array: shift all. List: update head pointer</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Insert at middle</td>
                  <td className="border border-slate-300 px-4 py-2 text-red-600">O(n)</td>
                  <td className="border border-slate-300 px-4 py-2 text-yellow-600">O(n)*</td>
                  <td className="border border-slate-300 px-4 py-2 text-sm">Array: shift half. List: traverse to position</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Insert at end</td>
                  <td className="border border-slate-300 px-4 py-2 text-green-600 font-bold">O(1)**</td>
                  <td className="border border-slate-300 px-4 py-2 text-red-600">O(n)</td>
                  <td className="border border-slate-300 px-4 py-2 text-sm">Array: append. List: traverse to end</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Delete at beginning</td>
                  <td className="border border-slate-300 px-4 py-2 text-red-600">O(n)</td>
                  <td className="border border-slate-300 px-4 py-2 text-green-600 font-bold">O(1)</td>
                  <td className="border border-slate-300 px-4 py-2 text-sm">Array: shift all. List: update head</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Search by value</td>
                  <td className="border border-slate-300 px-4 py-2 text-yellow-600">O(n)</td>
                  <td className="border border-slate-300 px-4 py-2 text-yellow-600">O(n)</td>
                  <td className="border border-slate-300 px-4 py-2 text-sm">Both must scan (array faster due to cache)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-slate-500 text-sm mt-2">* O(1) if you already have a reference to the position. ** Amortized; occasional resize is O(n).</p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-6">Linked List Disadvantages</h2>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li><strong>No random access:</strong> Can't jump to arr[500] directly - must traverse 500 nodes</li>
              <li><strong>Extra memory:</strong> Each node stores a pointer (8 bytes on 64-bit systems) in addition to data</li>
              <li><strong>Poor cache performance:</strong> Nodes scattered in memory → more cache misses → slower traversal</li>
              <li><strong>No backward traversal:</strong> Singly linked lists can only go forward (doubly linked lists fix this but use more memory)</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 mt-6">When to Use Each</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-800 mb-2">Use Arrays When:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-sm">
                <li>Need frequent random access (arr[i])</li>
                <li>Iterating through all elements</li>
                <li>Memory efficiency matters</li>
                <li>Size is known or mostly fixed</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-bold text-purple-800 mb-2">Use Linked Lists When:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-sm">
                <li>Frequent insert/delete at beginning</li>
                <li>Don't know size in advance</li>
                <li>Implementing stacks, queues</li>
                <li>Need to insert/delete in middle (with reference)</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },

    // SECTION 1B: Edge Case Lab (content migrated from LinkedListIntegratedLesson)
    {
      type: 'reading',
      id: 'linked-list-edge-case-lab',
      title: 'Edge Case Lab: Why Dummy Nodes Matter',
      estimatedReadTime: 420,
      content: `<h1>Edge Case Lab · Removing Nodes Without Tears</h1>
<h2>The Problem</h2>
<p>“Delete every node whose value equals <code>x</code>.”</p>
<p>Naïve approach (no dummy node):</p>
<pre><code class="language-python">def delete_value(head, x):
    # 1. Special case: delete from head
    while head and head.val == x:
        head = head.next

    if not head:
        return None  # All nodes removed

    # 2. Handle the rest
    current = head
    while current.next:
        if current.next.val == x:
            current.next = current.next.next
        else:
            current = current.next
    return head
</code></pre>
<h3>Why it hurts</h3>
<ul>
<li>Separate loops for “delete head” vs “delete middle”</li>
<li>Must remember to guard against an empty list</li>
<li>Easy to forget cases like “all nodes removed” or “only one node”</li>
</ul>
<h2>Edge Cases Checklist</h2>
<ul>
<li>Empty list (<code>head = None</code>)</li>
<li>Removing the first node</li>
<li>Removing the last node</li>
<li>Removing every node</li>
</ul>
<p>Keeping those straight while mutating pointers is fragile.</p>
<h2>Dummy Node Fix</h2>
<pre><code class="language-python">def delete_value(head, x):
    dummy = ListNode(0)
    dummy.next = head      # dummy → head

    current = dummy
    while current.next:
        if current.next.val == x:
            current.next = current.next.next
        else:
            current = current.next

    return dummy.next
</code></pre>
<h3>Benefits</h3>
<ul>
<li>Every node now has a predecessor (dummy acts as guardian for the head)</li>
<li>One loop, one code path</li>
<li>Automatically handles empty lists or “remove head” scenarios</li>
<li><code>dummy.next</code> always points at the real head after mutations</li>
</ul>
<h2>Mental Model</h2>
<ul>
<li><strong>Without dummy:</strong> head is a snowflake that needs special treatment.</li>
<li><strong>With dummy:</strong> the list starts at the dummy, so the first “real” node behaves just like any other.</li>
</ul>
<p>Whenever an interview problem says “modify the list in-place” and the head <em>might</em> change, pause and ask: “Should I add a dummy node and spare myself the headache?” The answer is usually yes.</p>
`,
    },

    // SECTION 2: The Dummy Node Technique
    {
      type: 'reading',
      id: 'dummy-node-technique',
      title: 'The Dummy Node Technique',
      content: (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-slate-900">The Dummy Node Technique</h1>

          <p className="text-slate-700 text-lg">The <strong>dummy node</strong> is the most important technique for handling linked lists cleanly. Master this and you'll solve linked list problems with confidence!</p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-6">The Problem: Edge Cases</h2>

          <p className="text-slate-700">When modifying a linked list, the <strong>head</strong> requires special handling:</p>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-slate-700"><strong>Example:</strong> Remove all nodes with value 1 from <code className="bg-slate-200 px-2 py-1 rounded">1 → 1 → 2 → 3</code></p>
            <p className="text-slate-700 mt-2">The head itself needs to be removed! This creates messy special-case code.</p>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 mt-6">Without Dummy Node (Messy)</h2>

          <div className="bg-slate-100 rounded-lg p-4 border border-slate-300">
            <pre className="text-sm overflow-x-auto"><code>{`def remove_value(head, val):
    # SPECIAL CASE: Handle head removal separately
    while head and head.val == val:
        head = head.next  # Keep moving head until it's not val

    # Now handle the rest of the list
    current = head
    while current and current.next:
        if current.next.val == val:
            current.next = current.next.next  # Skip the node
        else:
            current = current.next

    return head`}</code></pre>
          </div>

          <p className="text-slate-700 mt-4">Problems with this approach:</p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
            <li>Two separate while loops</li>
            <li>Different logic for head vs other nodes</li>
            <li>Easy to introduce bugs</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mt-6">With Dummy Node (Clean)</h2>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-4">
            <p className="text-slate-700"><strong>Key Idea:</strong> Create a fake node that points to the head. Now the head is "just another node" with no special treatment!</p>
          </div>

          <div className="bg-slate-100 rounded-lg p-4 border border-slate-300">
            <pre className="text-sm overflow-x-auto"><code>{`def remove_value(head, val):
    # Create dummy node pointing to head
    dummy = ListNode(0)    # Value doesn't matter
    dummy.next = head      # dummy → head → ...

    # Now process ALL nodes the same way
    current = dummy
    while current.next:                      # While there's a next node
        if current.next.val == val:
            current.next = current.next.next # Skip it
        else:
            current = current.next           # Move forward

    return dummy.next  # Return the real head (might have changed!)`}</code></pre>
          </div>

          <p className="text-slate-700 mt-4">Benefits:</p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
            <li>One simple loop handles everything</li>
            <li>All nodes treated uniformly</li>
            <li>No edge cases to forget</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mt-6">The 3-Step Pattern</h2>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <ol className="list-decimal list-inside space-y-3 text-slate-700">
              <li><strong>Create dummy:</strong> <code className="bg-slate-200 px-2 py-1 rounded">dummy = ListNode(0)</code> and <code className="bg-slate-200 px-2 py-1 rounded">dummy.next = head</code></li>
              <li><strong>Work from dummy:</strong> <code className="bg-slate-200 px-2 py-1 rounded">current = dummy</code> (not head!)</li>
              <li><strong>Return dummy.next:</strong> This is the real head (which may have changed)</li>
            </ol>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8">Visual Comparison</h2>

          <p className="text-slate-700">See the difference between with and without dummy nodes:</p>

          <DummyNodeDiagram />

          <h2 className="text-2xl font-semibold text-slate-900 mt-6">When to Use Dummy Node</h2>

          <p className="text-slate-700">Use a dummy node when:</p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
            <li>The head might be removed or changed</li>
            <li>You're building a new list from scratch</li>
            <li>You're merging or partitioning lists</li>
            <li>Basically... <strong>most linked list problems!</strong></li>
          </ul>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mt-4">
            <p className="text-slate-700"><strong>Pro tip:</strong> When in doubt, use a dummy node. The small overhead is worth the bug-free code!</p>
          </div>
        </div>
      ),
    },{
      type: 'reading',
      id: 'two-pointer-lists',
      title: 'Two-Pointer Techniques with Dummy Nodes',
      practiceExercise: {
        title: 'Try It: Find Middle Node',
        instruction: `# Find Middle Node of Linked List

Given a linked list, find and return the middle node.

**Examples:**
- \`[1, 2, 3, 4, 5]\` → return node with value 3
- \`[1, 2, 3, 4]\` → return node with value 2 (first middle if even)
- \`[1]\` → return node with value 1

**Your Task:**
Write a function \`find_middle(head)\` that returns the middle node.

**Hint:** Use fast and slow pointers. Fast moves 2 steps, slow moves 1 step.`,
        starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def find_middle(head):
    pass`,
        solution: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def find_middle(head):
    # Fast and slow pointer technique
    slow = fast = head

    # Fast moves 2 steps, slow moves 1 step
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    # When fast reaches end, slow is at middle
    return slow`,
        testCases: [
          { input: '[1, 2, 3, 4, 5]', expectedOutput: '3' },
          { input: '[1, 2, 3, 4]', expectedOutput: '2' },
          { input: '[1]', expectedOutput: '1' },
        ],
        difficulty: 'easy'
      },
      content: `<h1>Two-Pointer Techniques with Dummy Nodes 🎯</h1>
<h2>Fast and Slow Pointers (Tortoise &amp; Hare)</h2>
<p><strong>Slow moves 1 step, fast moves 2 steps</strong></p>
<hr>
<h2>Application 1: Find Middle</h2>
<pre><code class="language-python">def find_middle(head):
    slow = fast = head

    while fast and fast.next:
        slow = slow.next       # Move 1 step
        fast = fast.next.next  # Move 2 steps

    return slow  # Slow is at middle!
</code></pre>
<p><strong>Why it works:</strong></p>
<ul>
<li>When fast reaches end, slow is at middle</li>
<li>Fast moves 2x speed → covers 2x distance</li>
</ul>
<hr>
<h2>Application 2: Detect Cycle (Floyd&#39;s Algorithm)</h2>
<pre><code class="language-python">def has_cycle(head):
    slow = fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

        if slow == fast:  # They met!
            return True

    return False  # Fast reached end (no cycle)
</code></pre>
<p><strong>Why it works:</strong></p>
<ul>
<li>If there&#39;s a cycle, fast will eventually lap slow</li>
<li>Like runners on a circular track!</li>
</ul>
<hr>
<h2>Application 3: Remove Nth from End (Dummy Node Example)</h2>
<pre><code class="language-python">def removeNthFromEnd(head, n):
    # Dummy node handles edge case: removing the head
    dummy = ListNode(0, head)
    fast = slow = dummy

    # Move fast n steps ahead
    for _ in range(n):
        fast = fast.next

    # Move both until fast reaches end
    while fast.next:
        slow = slow.next
        fast = fast.next

    # Slow is now n+1 from end, remove next node
    slow.next = slow.next.next

    return dummy.next  # Return real head
</code></pre>
<p><strong>Why dummy node here?</strong></p>
<ul>
<li>If we need to remove the head (n = length), dummy ensures we have a node before it</li>
<li>Without dummy, we&#39;d need special case handling for head removal</li>
<li>With dummy, the same logic works for all cases!</li>
</ul>
<p><strong>The gap technique:</strong> Maintain n-step gap between pointers!</p>
<hr>
<h2>Pattern Recognition</h2>
<p><strong>Need middle element?</strong> → Fast/slow pointers
<strong>Detect cycle?</strong> → Fast/slow pointers
<strong>Nth from end?</strong> → Fast/slow with gap</p>
`,
    },

    {
      type: 'reading',
      id: 'list-reversal',
      title: 'List Reversal with Dummy Nodes',
      practiceExercise: {
        title: 'Try It: Reverse Sublist',
        instruction: `# Reverse a Sublist

Given a linked list and positions left and right, reverse the nodes from position left to right.

**Examples:**
- \`[1, 2, 3, 4, 5], left=2, right=4\` → \`[1, 4, 3, 2, 5]\`
- \`[5], left=1, right=1\` → \`[5]\`

**Your Task:**
Write a function \`reverse_between(head, left, right)\` that reverses the sublist.

**Hint:** Use a dummy node to handle the case where left=1 (reversing from head).`,
        starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_between(head, left, right):
    pass`,
        solution: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_between(head, left, right):
    # Use dummy node for edge case handling
    dummy = ListNode(0, head)
    prev = dummy

    # Move prev to node before left position
    for _ in range(left - 1):
        prev = prev.next

    # Reverse the sublist from left to right
    current = prev.next
    for _ in range(right - left):
        next_node = current.next
        current.next = next_node.next
        next_node.next = prev.next
        prev.next = next_node

    return dummy.next`,
        testCases: [
          { input: '[1, 2, 3, 4, 5], 2, 4', expectedOutput: '[1, 4, 3, 2, 5]' },
          { input: '[5], 1, 1', expectedOutput: '[5]' },
        ],
        difficulty: 'medium'
      },
      content: `<h1>List Reversal with Dummy Nodes 🔄</h1>
<h2>The Classic: Reverse Entire List</h2>
<h3>Iterative Approach</h3>
<pre><code class="language-python">def reverseList(head):
    prev = None
    current = head

    while current:
        next_node = current.next  # Save next
        current.next = prev       # Reverse link
        prev = current            # Move prev forward
        current = next_node       # Move current forward

    return prev  # New head
</code></pre>
<p><strong>Visualization:</strong></p>
<pre><code>1 → 2 → 3 → None

Step 1: prev=None, curr=1
None ← 1   2 → 3 → None

Step 2: prev=1, curr=2
None ← 1 ← 2   3 → None

Step 3: prev=2, curr=3
None ← 1 ← 2 ← 3

Return prev (3 is new head)
</code></pre>
<hr>
<h3>Recursive Approach</h3>
<pre><code class="language-python">def reverseList(head):
    # Base case
    if not head or not head.next:
        return head

    # Reverse rest of list
    new_head = reverseList(head.next)

    # Fix links
    head.next.next = head
    head.next = None

    return new_head
</code></pre>
<p><strong>How it works:</strong></p>
<ol>
<li>Recurse to end</li>
<li>On way back, reverse each link</li>
<li>Last node becomes new head</li>
</ol>
<hr>
<h2>Advanced: Reverse Sublist (Dummy Node Essential!)</h2>
<p><strong>Reverse nodes from position left to right</strong></p>
<pre><code class="language-python">def reverseBetween(head, left, right):
    if left == right:
        return head

    # Dummy node is crucial here!
    # If left=1, we&#39;re reversing from head - dummy handles this cleanly
    dummy = ListNode(0, head)
    prev = dummy

    # Move to position before left
    for _ in range(left - 1):
        prev = prev.next

    # Reverse from left to right
    current = prev.next
    for _ in range(right - left):
        next_node = current.next
        current.next = next_node.next
        next_node.next = prev.next
        prev.next = next_node

    return dummy.next  # Return real head
</code></pre>
<p><strong>Why dummy node is essential:</strong></p>
<ul>
<li>If <code>left=1</code>, we&#39;re modifying the head</li>
<li>Without dummy, we&#39;d need special handling</li>
<li>With dummy, <code>prev</code> always points to the node before the sublist</li>
<li>Same logic works whether reversing from head or middle!</li>
</ul>
<p><strong>Key idea:</strong> Keep moving nodes to the front of the sublist!</p>
`,
    },{
      type: 'reading',
      id: 'dummy-node-splitting',
      title: 'Dummy Nodes for Splitting Lists',
      practiceExercise: {
        title: 'Try It: Split List by Value',
        instruction: `# Split List by Value

Given a linked list and a value x, split the list so that all nodes less than x come before nodes greater than or equal to x.

**Examples:**
- \`[1, 4, 3, 2, 5, 2], x=3\` → \`[1, 2, 2, 4, 3, 5]\`
- \`[2, 1], x=2\` → \`[1, 2]\`

**Your Task:**
Write a function \`split_by_value(head, x)\` that partitions the list.

**Hint:** Use TWO dummy nodes - one for nodes < x, one for nodes >= x. Build both lists, then connect them.`,
        starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def split_by_value(head, x):
    pass`,
        solution: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def split_by_value(head, x):
    # Two dummy nodes for two sublists
    less_dummy = ListNode(0)
    greater_dummy = ListNode(0)

    less = less_dummy
    greater = greater_dummy

    # Traverse and build two lists
    current = head
    while current:
        if current.val < x:
            less.next = current
            less = less.next
        else:
            greater.next = current
            greater = greater.next
        current = current.next

    # Connect the two lists
    greater.next = None  # Important: terminate the list
    less.next = greater_dummy.next

    return less_dummy.next`,
        testCases: [
          { input: '[1, 4, 3, 2, 5, 2], 3', expectedOutput: '[1, 2, 2, 4, 3, 5]' },
          { input: '[2, 1], 2', expectedOutput: '[1, 2]' },
        ],
        difficulty: 'medium'
      },
      content: `<h1>Dummy Nodes for Splitting Lists 🔀</h1>
<p>When you need to <strong>split</strong> a linked list into multiple parts, dummy nodes are essential!</p>
<h2>The Challenge: Partition List</h2>
<p><strong>Problem:</strong> Given a list and a value x, split the list so all nodes &lt; x come before nodes &gt;= x.</p>
<p><strong>Without dummy nodes - messy!</strong></p>
<pre><code class="language-python">def partition(head, x):
    # Need to track heads of two lists
    less_head = None
    less_tail = None
    greater_head = None
    greater_tail = None
    
    current = head
    while current:
        if current.val &lt; x:
            if not less_head:  # First node &lt; x
                less_head = current
                less_tail = current
            else:
                less_tail.next = current
                less_tail = current
        else:
            if not greater_head:  # First node &gt;= x
                greater_head = current
                greater_tail = current
            else:
                greater_tail.next = current
                greater_tail = current
        current = current.next
    
    # Connect the two lists
    if less_tail:
        less_tail.next = greater_head
    if greater_tail:
        greater_tail.next = None
    
    return less_head if less_head else greater_head
</code></pre>
<p><strong>Problems:</strong></p>
<ul>
<li>Need to check if heads exist (special cases)</li>
<li>Different logic for first node vs rest</li>
<li>Easy to forget null checks</li>
<li>Complex edge case handling</li>
</ul>
<hr>
<h2>With Dummy Nodes - Clean! ✨</h2>
<pre><code class="language-python">def partition(head, x):
    # Two dummy nodes - one for each list
    less_dummy = ListNode(0)
    greater_dummy = ListNode(0)
    
    less_current = less_dummy
    greater_current = greater_dummy
    
    current = head
    while current:
        if current.val &lt; x:
            less_current.next = current
            less_current = less_current.next
        else:
            greater_current.next = current
            greater_current = greater_current.next
        current = current.next
    
    # Connect the two lists
    less_current.next = greater_dummy.next
    greater_current.next = None  # Terminate second list
    
    return less_dummy.next  # Return real head
</code></pre>
<p><strong>Why this works:</strong></p>
<ul>
<li><strong>Two dummy nodes</strong> = two lists being built</li>
<li><strong>No special cases</strong> - dummy.next is always the head</li>
<li><strong>Uniform logic</strong> - same code for all nodes</li>
<li><strong>Clean connection</strong> - just link the tails</li>
</ul>
<hr>
<h2>Key Insight</h2>
<p><strong>When splitting/partitioning:</strong></p>
<ul>
<li>Use <strong>one dummy node per list</strong> you&#39;re building</li>
<li>Build each list independently</li>
<li>Connect them at the end</li>
<li>Return the first dummy&#39;s next</li>
</ul>
<p>This pattern works for:</p>
<ul>
<li>Partition by value</li>
<li>Split into odd/even positions</li>
<li>Separate by condition</li>
<li>Any multi-list problem!</li>
</ul>
`
    },// Reverse Linked List II - Partial reversal with dummy node
    ,// Reorder List - Combines multiple techniques
    ,{
      type: 'reading',
      id: 'module5-summary',
      title: 'Module Complete!',
      practiceExercise: {
        title: 'Try It: Merge Two Lists with Dummy Node',
        instruction: `# Merge Two Sorted Lists

Given two sorted linked lists, merge them into one sorted list.

**Examples:**
- \`[1, 2, 4], [1, 3, 4]\` → \`[1, 1, 2, 3, 4, 4]\`
- \`[], [0]\` → \`[0]\`
- \`[1, 2], []\` → \`[1, 2]\`

**Your Task:**
Write a function \`merge_two_lists(list1, list2)\` that merges them.

**Hint:** Use a dummy node to build the result list. Compare values and attach the smaller one.`,
        starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_two_lists(list1, list2):
    pass`,
        solution: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_two_lists(list1, list2):
    # Create dummy node
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
    return dummy.next`,
        testCases: [
          { input: '[1, 2, 4], [1, 3, 4]', expectedOutput: '[1, 1, 2, 3, 4, 4]' },
          { input: '[], [0]', expectedOutput: '[0]' },
          { input: '[1, 2], []', expectedOutput: '[1, 2]' },
        ],
        difficulty: 'medium'
      },
      content: `<h1>🎉 Module 5 Complete!</h1>
<h2>Dummy Node Technique Mastered 📝</h2>
<h3>The Core Pattern</h3>
<p><strong>When to use dummy node:</strong></p>
<ul>
<li>Operations that might modify the head</li>
<li>Building a new list from scratch</li>
<li>Removing elements (especially from head)</li>
<li>Merging or combining lists</li>
<li>Any operation where head handling is complex</li>
</ul>
<p><strong>The Standard Pattern:</strong></p>
<pre><code class="language-python"># 1. Create dummy node
dummy = ListNode(0, head)  # or ListNode(0) for new lists

# 2. Work with current pointer
current = dummy

# 3. Perform operations
while current.next:
    # ... your logic ...
    current = current.next

# 4. Return real head
return dummy.next
</code></pre>
<h3>Techniques You&#39;ve Learned</h3>
<p>✅ <strong>Dummy node for head operations</strong> - Remove/modify head cleanly
✅ <strong>Dummy node for building lists</strong> - Merge, add, combine operations
✅ <strong>Dummy node with two pointers</strong> - Remove nth from end, find patterns
✅ <strong>Dummy node for sublist operations</strong> - Reverse between positions</p>
<h3>Linked List Handling Skills</h3>
<p>✅ <strong>Pointer manipulation</strong> - Careful sequencing of pointer updates
✅ <strong>Traversal patterns</strong> - Fast/slow, gap maintenance
✅ <strong>Edge case handling</strong> - Empty lists, single nodes, head operations
✅ <strong>List operations</strong> - Merge, reverse, remove, partition</p>
<hr>
<h2>When to Use Dummy Node</h2>
<p><strong>Always use dummy node when:</strong></p>
<ul>
<li>You might need to remove/modify the head</li>
<li>You&#39;re building a new list</li>
<li>Head operations require special cases</li>
<li>You want cleaner, more maintainable code</li>
</ul>
<p><strong>Remember:</strong> <code>dummy.next</code> is your real head - always return it!</p>
<hr>
<h2>Ready to Practice?</h2>
<p>You&#39;ve learned the dummy node technique! Now it&#39;s time to apply it to more problems.</p>
<p><strong>Click the &quot;Practice&quot; button below</strong> to access a curated set of linked list problems that will help you master this technique through hands-on practice.</p>
<hr>
<h2>Common Mistakes to Avoid</h2>
<p>❌ Losing head reference
❌ Forgetting null checks
❌ Not handling single-node lists
❌ Creating cycles accidentally
❌ Not updating all necessary pointers
❌ Forgetting to return <code>dummy.next</code> instead of <code>dummy</code></p>
<hr>
<h2>Next: Module 6</h2>
<p><strong>Trees &amp; Traversals</strong> - Enter the world of hierarchical data!</p>
<p>Ready? 🌳</p>
`,
    },
  
  ...module5LinkedListLessonSmartPracticeExercises,
  ].filter(Boolean) as LessonSection[],
};
