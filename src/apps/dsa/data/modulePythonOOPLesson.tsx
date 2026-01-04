import { ProgressiveLesson, LessonSection } from '../types/progressive-lesson-enhanced';
import { module4_5PythonOOPLessonSmartPracticeExercises } from './exercises/modulePythonOOPLessonSmartPracticeExercises';

export const module4_5PythonOOPLesson: ProgressiveLesson = {
    id: 'python-oop-libraries',
    title: 'Module: Python OOP & Essential Libraries',
    description: 'Learn classes, objects, and the Python libraries you\'ll need for advanced data structures',
    unlockMode: 'sequential',
    sections: [
        // SECTION 1: Classes and OOP
        {
            type: 'reading',
            id: 'oop-classes-basics',
            title: 'Classes and Objects',
            content: `<h1>What is Object-Oriented Programming (OOP)? 🎯</h1>
<h2>The Big Picture</h2>
<p><strong>Object-Oriented Programming (OOP)</strong> is a way of organizing code by grouping related data and functions together into &quot;objects.&quot;</p>
<p>Think of it like this:</p>
<ul>
<li><strong>Class</strong> = A blueprint or template (like a cookie cutter)</li>
<li><strong>Object</strong> = An instance created from that blueprint (like an actual cookie)</li>
</ul>
<hr>
<h2>Why Use OOP?</h2>
<p>Python has built-in types:</p>
<ul>
<li><code>int</code>, <code>str</code>, <code>list</code>, <code>dict</code></li>
</ul>
<p>But what if you need something custom? For example:</p>
<ul>
<li>A <code>ListNode</code> for linked lists</li>
<li>A <code>TreeNode</code> for binary trees</li>
<li>A <code>Point</code> with x and y coordinates</li>
</ul>
<p>That&#39;s where classes come in!</p>
<hr>
<h2>Enter: Classes</h2>
<p>A <strong>class</strong> is a blueprint for creating objects. It defines:</p>
<ul>
<li>What data the object stores (attributes)</li>
<li>What actions the object can perform (methods)</li>
</ul>
<h3>Simple Example: A Point</h3>
<p><strong>Without classes:</strong></p>
<pre><code class="language-python"># Point at (3, 4)
point = [3, 4]

# Confusing:
x = point[0]  # Is this x or y?
y = point[1]  # Hard to remember!
</code></pre>
<p><strong>With classes:</strong></p>
<pre><code class="language-python">class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

# Create a point
point = Point(3, 4)

# Clear and readable!
print(point.x)  # 3
print(point.y)  # 4
</code></pre>
<hr>
<h2>The <code>__init__</code> Method</h2>
<p>Think of <code>__init__</code> as a &quot;setup function&quot; that runs when you create an object.</p>
<pre><code class="language-python">class Student:
    def __init__(self, name, age):
        self.name = name  # Store name
        self.age = age    # Store age

# When you create a student:
alice = Student(&quot;Alice&quot;, 20)
# __init__ runs automatically!
# alice.name = &quot;Alice&quot;
# alice.age = 20
</code></pre>
<hr>
<h2>The <code>self</code> Keyword</h2>
<p><code>self</code> refers to <strong>this specific object</strong>.</p>
<pre><code class="language-python">class Dog:
    def __init__(self, name):
        self.name = name  # THIS dog&#39;s name

    def bark(self):
        print(f&quot;{self.name} says woof!&quot;)

dog1 = Dog(&quot;Rex&quot;)
dog2 = Dog(&quot;Buddy&quot;)

dog1.bark()  # Rex says woof!
dog2.bark()  # Buddy says woof!
</code></pre>
<p>Each dog has its own <code>self.name</code>!</p>
<hr>
<h2>Real DSA Example: ListNode</h2>
<pre><code class="language-python">class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val      # Node&#39;s value
        self.next = next    # Link to next node

# Create a chain: 1 -&gt; 2 -&gt; 3
node1 = ListNode(1)
node2 = ListNode(2)
node3 = ListNode(3)

node1.next = node2
node2.next = node3

# Traverse the list
current = node1
while current:
    print(current.val)  # 1, 2, 3
    current = current.next
</code></pre>
<hr>
<h2>Key Takeaways</h2>
<p>✅ Classes let you create custom data types
✅ <code>__init__</code> sets up the object
✅ <code>self</code> refers to the current instance
✅ Use classes for clarity and organization</p>
<p>Now let&#39;s practice! 🎯</p>
`
        },

        // MICRO-DRILL 1: Simple Class Creation
        ,// MICRO-DRILL 3: Understanding self
        ,// APPLIED PROBLEM 1: ListNode
        ,// APPLIED PROBLEM 2: TreeNode
        ,// SECTION 2: Stacks & Queues - Conceptual Foundation
        {
            type: 'reading',
            id: 'stacks-queues-concepts',
            title: 'Stacks & Queues: When and Why',
            content: `<h1>Stacks &amp; Queues: Essential Data Structures 📚</h1>
<h2>Why Do We Need Stacks and Queues?</h2>
<p>You&#39;ve learned arrays and lists - why do we need more? Because <strong>order of processing matters</strong>!</p>
<p>Consider these scenarios:</p>
<ul>
<li><strong>Undo in a text editor</strong>: Last action should be undone first</li>
<li><strong>Print queue</strong>: First document submitted prints first</li>
<li><strong>Browser back button</strong>: Most recent page visited goes back first</li>
</ul>
<p>Different problems need different ordering. That&#39;s where stacks and queues come in!</p>
<hr>
<h2>Stack: Last In, First Out (LIFO)</h2>
<p>Think of a stack of plates 🍽️:</p>
<ul>
<li>You add plates on <strong>top</strong></li>
<li>You remove plates from <strong>top</strong></li>
<li>The <strong>last</strong> plate you added is the <strong>first</strong> one you take</li>
</ul>
<pre><code>    ┌───┐
    │ 3 │ ← Top (last in, first out)
    ├───┤
    │ 2 │
    ├───┤
    │ 1 │
    └───┘

    Push 3 → [1, 2, 3]
    Pop    → returns 3, stack is [1, 2]
</code></pre>
<h3>Where Stacks Are Used (You&#39;ll See These Soon!)</h3>
<table>
<thead>
<tr>
<th>Use Case</th>
<th>Why Stack?</th>
</tr>
</thead>
<tbody><tr>
<td><strong>DFS (Depth-First Search)</strong></td>
<td>Explore deepest path first, backtrack</td>
</tr>
<tr>
<td><strong>Recursion call stack</strong></td>
<td>Function calls stack up, return in reverse</td>
</tr>
<tr>
<td><strong>Undo operations</strong></td>
<td>Most recent action undone first</td>
</tr>
<tr>
<td><strong>Bracket matching</strong></td>
<td>Match most recent open bracket</td>
</tr>
<tr>
<td><strong>Expression evaluation</strong></td>
<td>Process operators in correct order</td>
</tr>
</tbody></table>
<h3>The Call Stack Connection</h3>
<p>When you call functions, Python uses a stack internally:</p>
<pre><code class="language-python">def a():
    b()  # Push b onto stack

def b():
    c()  # Push c onto stack

def c():
    print(&quot;Hello&quot;)  # c returns first, then b, then a

a()  # Start here
</code></pre>
<p>The call stack: <code>[a, b, c]</code> → c finishes first (LIFO!)</p>
<p>This is why <strong>recursive DFS</strong> works - it naturally uses the call stack!</p>
<hr>
<h2>Queue: First In, First Out (FIFO)</h2>
<p>Think of a line at a store 🛒:</p>
<ul>
<li>People join at the <strong>back</strong></li>
<li>People leave from the <strong>front</strong></li>
<li>The <strong>first</strong> person in line is the <strong>first</strong> to be served</li>
</ul>
<pre><code>    Front → [1, 2, 3] ← Back

    Enqueue 4 → [1, 2, 3, 4]
    Dequeue   → returns 1, queue is [2, 3, 4]
</code></pre>
<h3>Where Queues Are Used (You&#39;ll See These Soon!)</h3>
<table>
<thead>
<tr>
<th>Use Case</th>
<th>Why Queue?</th>
</tr>
</thead>
<tbody><tr>
<td><strong>BFS (Breadth-First Search)</strong></td>
<td>Explore level by level</td>
</tr>
<tr>
<td><strong>Level-order tree traversal</strong></td>
<td>Process all nodes at depth d before d+1</td>
</tr>
<tr>
<td><strong>Shortest path in unweighted graph</strong></td>
<td>First path found is shortest</td>
</tr>
<tr>
<td><strong>Task scheduling</strong></td>
<td>Process tasks in order received</td>
</tr>
<tr>
<td><strong>Print queue</strong></td>
<td>First job submitted prints first</td>
</tr>
</tbody></table>
<h3>BFS Preview</h3>
<p>When you need the <strong>shortest path</strong>, BFS + queue is the answer:</p>
<pre><code class="language-python"># BFS explores level-by-level
Level 0: [Start]
Level 1: [A, B, C]       # 1 step away
Level 2: [D, E, F]       # 2 steps away
Level 3: [Goal]          # 3 steps away - found shortest!
</code></pre>
<p>Queue ensures we check ALL level-1 nodes before ANY level-2 nodes!</p>
<hr>
<h2>Stack vs Queue: Quick Decision Guide</h2>
<pre><code>┌─────────────────────────────────────────────────────────┐
│            What order do I need?                        │
├────────────────────────┬────────────────────────────────┤
│  &quot;Most recent first&quot;   │  &quot;In order received&quot;           │
│  &quot;Last added, first    │  &quot;First come, first served&quot;    │
│   processed&quot;           │  &quot;Level by level&quot;              │
│                        │  &quot;Shortest path&quot;               │
│         ↓              │           ↓                    │
│       STACK            │         QUEUE                  │
│    (LIFO)              │        (FIFO)                  │
│                        │                                │
│  • DFS                 │  • BFS                         │
│  • Recursion           │  • Level-order                 │
│  • Undo/Redo           │  • Shortest path               │
│  • Bracket matching    │  • Task scheduling             │
└────────────────────────┴────────────────────────────────┘
</code></pre>
<hr>
<h2>Coming Up Next</h2>
<p>You&#39;ll implement both:</p>
<ol>
<li><strong>Stack class</strong> - using Python lists</li>
<li><strong>Queue class</strong> - using Python lists (and learn why <code>deque</code> is better!)</li>
<li><strong>Min Stack</strong> - a stack that tracks minimums in O(1)</li>
</ol>
<p>These implementations will prepare you for:</p>
<ul>
<li><strong>Module 7</strong>: Recursion (uses the call stack!)</li>
<li><strong>Module 8</strong>: Trees (DFS uses stack, BFS uses queue)</li>
<li><strong>Module 10</strong>: Graphs (DFS and BFS everywhere!)</li>
</ul>
<p>Let&#39;s build them! 🚀</p>
`,
        },

        // APPLIED PROBLEM 4: Stack Class
        ,// APPLIED PROBLEM 5: Queue Class
        ,// APPLIED PROBLEM 6: Min Stack
        ,// SECTION 3: Collections - defaultdict
        {
            type: 'reading',
            id: 'collections-defaultdict',
            title: 'collections.defaultdict',
            content: `<h1>defaultdict: Auto-Initialize Dictionaries 📊</h1>
<h2>The Problem</h2>
<p>Regular dictionaries error on missing keys:</p>
<pre><code class="language-python">graph = {}
graph[&#39;A&#39;].append(&#39;B&#39;)  # ❌ KeyError: &#39;A&#39;

# You have to check first:
if &#39;A&#39; not in graph:
    graph[&#39;A&#39;] = []
graph[&#39;A&#39;].append(&#39;B&#39;)  # Verbose!
</code></pre>
<hr>
<h2>The Solution: defaultdict</h2>
<pre><code class="language-python">from collections import defaultdict

# Auto-creates empty lists!
graph = defaultdict(list)
graph[&#39;A&#39;].append(&#39;B&#39;)  # ✅ Works! Auto-creates []
graph[&#39;A&#39;].append(&#39;C&#39;)
print(graph[&#39;A&#39;])  # [&#39;B&#39;, &#39;C&#39;]
</code></pre>
<hr>
<h2>How It Works</h2>
<p><code>defaultdict</code> takes a <strong>factory function</strong>:</p>
<pre><code class="language-python">from collections import defaultdict

# Auto-create empty lists
graph = defaultdict(list)

# Auto-create zeros
counts = defaultdict(int)
counts[&#39;a&#39;] += 1  # Works! Starts at 0

# Auto-create empty sets
groups = defaultdict(set)
groups[&#39;team1&#39;].add(&#39;Alice&#39;)
</code></pre>
<hr>
<h2>Common Use Cases</h2>
<h3>1. Graph Adjacency Lists</h3>
<pre><code class="language-python">from collections import defaultdict

graph = defaultdict(list)
graph[1].append(2)
graph[1].append(3)
graph[2].append(4)

# Result: {1: [2, 3], 2: [4]}
</code></pre>
<h3>2. Grouping Items</h3>
<pre><code class="language-python">from collections import defaultdict

# Group words by first letter
words = [&#39;apple&#39;, &#39;banana&#39;, &#39;apricot&#39;, &#39;berry&#39;]
groups = defaultdict(list)

for word in words:
    groups[word[0]].append(word)

# Result: {&#39;a&#39;: [&#39;apple&#39;, &#39;apricot&#39;], &#39;b&#39;: [&#39;banana&#39;, &#39;berry&#39;]}
</code></pre>
<h3>3. Counting with Flexibility</h3>
<pre><code class="language-python">from collections import defaultdict

freq = defaultdict(int)
for char in &quot;hello&quot;:
    freq[char] += 1

# Result: {&#39;h&#39;: 1, &#39;e&#39;: 1, &#39;l&#39;: 2, &#39;o&#39;: 1}
</code></pre>
<hr>
<h2>Key Takeaways</h2>
<p>✅ <code>defaultdict(list)</code> - Auto-creates empty lists
✅ <code>defaultdict(int)</code> - Auto-creates 0
✅ <code>defaultdict(set)</code> - Auto-creates empty sets
✅ Perfect for graphs, grouping, and counting</p>
<p>You&#39;ll use this ALL THE TIME in graph problems! 🎯</p>
`,
        },

        // SECTION 4: Collections - Counter
        {
            type: 'reading',
            id: 'collections-counter',
            title: 'collections.Counter',
            content: `<h1>Counter: Frequency Counting Made Easy 📈</h1>
<h2>The Problem</h2>
<p>Counting frequencies is common but verbose:</p>
<pre><code class="language-python"># Count character frequencies
freq = {}
for char in &quot;hello&quot;:
    if char not in freq:
        freq[char] = 0
    freq[char] += 1

# Lots of boilerplate!
</code></pre>
<hr>
<h2>The Solution: Counter</h2>
<pre><code class="language-python">from collections import Counter

freq = Counter(&quot;hello&quot;)
print(freq)  # Counter({&#39;l&#39;: 2, &#39;h&#39;: 1, &#39;e&#39;: 1, &#39;o&#39;: 1})
print(freq[&#39;l&#39;])  # 2
</code></pre>
<p>That&#39;s it! One line! ✨</p>
<hr>
<h2>Counter Features</h2>
<h3>1. Count Anything Iterable</h3>
<pre><code class="language-python">from collections import Counter

# Count characters
Counter(&quot;hello&quot;)  # {&#39;l&#39;: 2, &#39;h&#39;: 1, &#39;e&#39;: 1, &#39;o&#39;: 1}

# Count words
words = [&#39;apple&#39;, &#39;banana&#39;, &#39;apple&#39;]
Counter(words)  # {&#39;apple&#39;: 2, &#39;banana&#39;: 1}

# Count numbers
nums = [1, 2, 2, 3, 3, 3]
Counter(nums)  # {3: 3, 2: 2, 1: 1}
</code></pre>
<h3>2. Most Common Elements</h3>
<pre><code class="language-python">from collections import Counter

freq = Counter([1, 1, 2, 2, 2, 3, 3, 3, 3])
top2 = freq.most_common(2)
print(top2)  # [(3, 4), (2, 3)]
# Element 3 appears 4 times (most common)
# Element 2 appears 3 times (second)
</code></pre>
<h3>3. Compare Counters</h3>
<pre><code class="language-python">from collections import Counter

# Check if two words are anagrams
Counter(&#39;listen&#39;) == Counter(&#39;silent&#39;)  # True!
Counter(&#39;hello&#39;) == Counter(&#39;world&#39;)    # False
</code></pre>
<h3>4. Arithmetic Operations</h3>
<pre><code class="language-python">from collections import Counter

c1 = Counter([&#39;a&#39;, &#39;b&#39;, &#39;c&#39;])
c2 = Counter([&#39;a&#39;, &#39;b&#39;, &#39;d&#39;])

# Addition
c1 + c2  # Counter({&#39;a&#39;: 2, &#39;b&#39;: 2, &#39;c&#39;: 1, &#39;d&#39;: 1})

# Subtraction
c1 - c2  # Counter({&#39;c&#39;: 1})
</code></pre>
<hr>
<h2>Common DSA Use Cases</h2>
<h3>1. Valid Anagram</h3>
<pre><code class="language-python">from collections import Counter

def isAnagram(s, t):
    return Counter(s) == Counter(t)

isAnagram(&#39;anagram&#39;, &#39;nagaram&#39;)  # True
</code></pre>
<h3>2. Top K Frequent Elements</h3>
<pre><code class="language-python">from collections import Counter

def topKFrequent(nums, k):
    freq = Counter(nums)
    return [num for num, count in freq.most_common(k)]

topKFrequent([1,1,1,2,2,3], 2)  # [1, 2]
</code></pre>
<h3>3. Character Frequency Comparison</h3>
<pre><code class="language-python">from collections import Counter

def canConstruct(ransomNote, magazine):
    # Can we build ransomNote from magazine letters?
    return not (Counter(ransomNote) - Counter(magazine))

canConstruct(&quot;aa&quot;, &quot;aab&quot;)  # True
</code></pre>
<hr>
<h2>Key Takeaways</h2>
<p>✅ <code>Counter(iterable)</code> - Count frequencies instantly
✅ <code>most_common(k)</code> - Get top k elements
✅ Compare Counters - Perfect for anagrams
✅ Supports +, -, &amp; operations</p>
<p>Counter saves SO MUCH boilerplate code! 🎯</p>
`,
        },

        // SECTION 5: Collections - deque
        {
            type: 'reading',
            id: 'collections-deque',
            title: 'collections.deque',
            content: `<h1>deque: Fast Queues and Stacks 🎯</h1>
<h2>The Problem with Lists</h2>
<p>Lists are slow for queue operations:</p>
<pre><code class="language-python">queue = [1, 2, 3]
queue.pop(0)  # ❌ O(n) - Shifts all elements!

# [2, 3] ← All elements shifted left
</code></pre>
<hr>
<h2>The Solution: deque</h2>
<p><code>deque</code> (double-ended queue) is optimized for both ends!</p>
<pre><code class="language-python">from collections import deque

queue = deque([1, 2, 3])
queue.popleft()  # ✅ O(1) - Fast!
# deque([2, 3])
</code></pre>
<hr>
<h2>deque Operations</h2>
<h3>Add to Ends (O(1))</h3>
<pre><code class="language-python">from collections import deque

dq = deque([2, 3])

dq.append(4)      # Add to right: [2, 3, 4]
dq.appendleft(1)  # Add to left: [1, 2, 3, 4]
</code></pre>
<h3>Remove from Ends (O(1))</h3>
<pre><code class="language-python">from collections import deque

dq = deque([1, 2, 3, 4])

dq.pop()       # Remove from right: [1, 2, 3]
dq.popleft()   # Remove from left: [2, 3]
</code></pre>
<h3>All Operations</h3>
<pre><code class="language-python">from collections import deque

dq = deque()

# Add
dq.append(1)        # Add right
dq.appendleft(0)    # Add left

# Remove
dq.pop()            # Remove right
dq.popleft()        # Remove left

# Peek
dq[0]               # Left element
dq[-1]              # Right element

# Check
len(dq)             # Size
if dq:              # Not empty
</code></pre>
<hr>
<h2>Use Cases in DSA</h2>
<h3>1. BFS (Breadth-First Search)</h3>
<pre><code class="language-python">from collections import deque

def bfs(graph, start):
    queue = deque([start])
    visited = set([start])

    while queue:
        node = queue.popleft()  # O(1) - Fast!
        print(node)

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
</code></pre>
<h3>2. Sliding Window Maximum</h3>
<pre><code class="language-python">from collections import deque

def maxSlidingWindow(nums, k):
    dq = deque()  # Store indices
    result = []

    for i, num in enumerate(nums):
        # Remove old elements outside window
        while dq and dq[0] &lt; i - k + 1:
            dq.popleft()  # O(1)

        # Remove smaller elements
        while dq and nums[dq[-1]] &lt; num:
            dq.pop()  # O(1)

        dq.append(i)
        if i &gt;= k - 1:
            result.append(nums[dq[0]])

    return result
</code></pre>
<h3>3. Level-Order Traversal</h3>
<pre><code class="language-python">from collections import deque

def levelOrder(root):
    if not root:
        return []

    queue = deque([root])
    result = []

    while queue:
        level_size = len(queue)
        level = []

        for _ in range(level_size):
            node = queue.popleft()  # O(1)
            level.append(node.val)

            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        result.append(level)

    return result
</code></pre>
<hr>
<h2>list vs deque Comparison</h2>
<table>
<thead>
<tr>
<th>Operation</th>
<th>list</th>
<th>deque</th>
</tr>
</thead>
<tbody><tr>
<td><code>append()</code></td>
<td>O(1)</td>
<td>O(1)</td>
</tr>
<tr>
<td><code>pop()</code></td>
<td>O(1)</td>
<td>O(1)</td>
</tr>
<tr>
<td><code>insert(0, x)</code></td>
<td>O(n)</td>
<td>O(1) as <code>appendleft()</code></td>
</tr>
<tr>
<td><code>pop(0)</code></td>
<td>O(n)</td>
<td>O(1) as <code>popleft()</code></td>
</tr>
<tr>
<td>Access by index</td>
<td>O(1)</td>
<td>O(n)</td>
</tr>
</tbody></table>
<hr>
<h2>Key Takeaways</h2>
<p>✅ Use <code>deque</code> for queues (not <code>list</code>)
✅ <code>popleft()</code> is O(1) (vs O(n) for <code>list.pop(0)</code>)
✅ Perfect for BFS, sliding window, level-order
✅ Can add/remove from both ends efficiently</p>
<p>deque is essential for graph algorithms! 🎯</p>
`,
        },

        // SECTION 6: Data Structure Classes
        {
            type: 'reading',
            id: 'data-structure-classes',
            title: 'DSA Classes: ListNode, TreeNode, TrieNode',
            content: `<h1>Data Structure Classes 🌳</h1>
<p>Now that you understand classes, let&#39;s look at the three most important ones for DSA!</p>
<hr>
<h2>1. ListNode (Linked Lists)</h2>
<pre><code class="language-python">class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val      # Node&#39;s value
        self.next = next    # Link to next node
</code></pre>
<h3>Why Use It?</h3>
<p>Linked lists are better than arrays for:</p>
<ul>
<li>✅ O(1) insertion/deletion (vs O(n) for arrays)</li>
<li>✅ Dynamic size (no reallocation needed)</li>
<li>✅ Interview favorite!</li>
</ul>
<h3>Example Usage</h3>
<pre><code class="language-python"># Create a list: 1 -&gt; 2 -&gt; 3
head = ListNode(1)
head.next = ListNode(2)
head.next.next = ListNode(3)

# Traverse
current = head
while current:
    print(current.val)  # 1, 2, 3
    current = current.next

# Reverse
def reverse(head):
    prev = None
    current = head

    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node

    return prev
</code></pre>
<hr>
<h2>2. TreeNode (Binary Trees)</h2>
<pre><code class="language-python">class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val      # Node&#39;s value
        self.left = left    # Left child
        self.right = right  # Right child
</code></pre>
<h3>Why Use It?</h3>
<p>Trees enable:</p>
<ul>
<li>✅ O(log n) search (in balanced BST)</li>
<li>✅ Hierarchical data representation</li>
<li>✅ Efficient sorting/searching</li>
</ul>
<h3>Example Usage</h3>
<pre><code class="language-python"># Create a tree:
#     1
#    / \
#   2   3
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)

# Inorder traversal (DFS)
def inorder(root):
    if not root:
        return
    inorder(root.left)
    print(root.val)
    inorder(root.right)

# Level-order traversal (BFS)
from collections import deque

def levelOrder(root):
    if not root:
        return []

    queue = deque([root])
    result = []

    while queue:
        node = queue.popleft()
        result.append(node.val)

        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)

    return result
</code></pre>
<hr>
<h2>3. TrieNode (Prefix Trees)</h2>
<pre><code class="language-python">class TrieNode:
    def __init__(self):
        self.children = {}      # Map char -&gt; TrieNode
        self.is_end = False     # End of word marker
</code></pre>
<h3>Why Use It?</h3>
<p>Tries are perfect for:</p>
<ul>
<li>✅ Fast prefix searching (autocomplete)</li>
<li>✅ Dictionary operations</li>
<li>✅ Spell checking</li>
</ul>
<h3>Example Usage</h3>
<pre><code class="language-python">class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True

    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end

    def startsWith(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True

# Usage
trie = Trie()
trie.insert(&quot;apple&quot;)
trie.search(&quot;apple&quot;)      # True
trie.search(&quot;app&quot;)        # False
trie.startsWith(&quot;app&quot;)    # True
</code></pre>
<hr>
<h2>Comparison Table</h2>
<table>
<thead>
<tr>
<th>Class</th>
<th>Purpose</th>
<th>When to Use</th>
</tr>
</thead>
<tbody><tr>
<td><strong>ListNode</strong></td>
<td>Linked lists</td>
<td>Need O(1) insert/delete</td>
</tr>
<tr>
<td><strong>TreeNode</strong></td>
<td>Binary trees</td>
<td>Hierarchical data, fast search</td>
</tr>
<tr>
<td><strong>TrieNode</strong></td>
<td>Prefix trees</td>
<td>String prefix operations</td>
</tr>
</tbody></table>
<hr>
<h2>Key Patterns</h2>
<h3>ListNode Pattern</h3>
<pre><code class="language-python">def process_list(head):
    current = head
    while current:
        # Process current node
        print(current.val)
        current = current.next
</code></pre>
<h3>TreeNode Pattern (Recursive)</h3>
<pre><code class="language-python">def process_tree(root):
    if not root:
        return

    # Process current node
    print(root.val)

    # Recurse on children
    process_tree(root.left)
    process_tree(root.right)
</code></pre>
<h3>TrieNode Pattern</h3>
<pre><code class="language-python">def process_trie(word):
    node = root
    for char in word:
        if char not in node.children:
            node.children[char] = TrieNode()
        node = node.children[char]
</code></pre>
<hr>
<h2>Key Takeaways</h2>
<p>✅ <strong>ListNode</strong> - Single link, linear traversal
✅ <strong>TreeNode</strong> - Two links, hierarchical structure
✅ <strong>TrieNode</strong> - Map of links, prefix operations
✅ All use classes for clarity and organization</p>
<p>You&#39;ll build these from scratch in upcoming modules! 🎯</p>
`,
        },

        // SECTION 6.5: Priority Queues (heapq)
        {
            type: 'reading',
            id: 'heapq-basics',
            title: 'Priority Queues with heapq',
            content: `<h1>Priority Queues with heapq ⚡️</h1>
<h2>What is a Priority Queue?</h2>
<p>A <strong>Priority Queue</strong> is like a regular queue, but elements are served based on <strong>priority</strong> (usually smallest or largest first), not arrival time.</p>
<p>Think of an ER waiting room: patients with critical injuries come first, regardless of when they arrived!</p>
<hr>
<h2>Python&#39;s <code>heapq</code> Module</h2>
<p>Python provides the <code>heapq</code> module, which implements a <strong>Min-Heap</strong>.</p>
<h3>1. Basic Operations</h3>
<pre><code class="language-python">import heapq
import { module4_5PythonOOPLessonSmartPracticeExercises } from "./modulePythonOOPLessonSmartPracticeExercises&#39;;

# Create a heap
min_heap = []

# Push - O(log n)
heapq.heappush(min_heap, 5)
heapq.heappush(min_heap, 1)
heapq.heappush(min_heap, 3)

# Heap property: Smallest is always at index 0!
print(min_heap[0])  # 1

# Pop - O(log n)
smallest = heapq.heappop(min_heap)  # Returns 1
print(smallest)
print(min_heap[0])  # now 3 or 5 (heap reorganizes)
</code></pre>
<hr>
<h2>2. Heapify - O(n)</h2>
<p>Convert an existing list into a heap efficiently:</p>
<pre><code class="language-python">nums = [5, 1, 3, 2, 4]
heapq.heapify(nums)  # O(n) linear time!
print(nums[0])       # 1
</code></pre>
<hr>
<h2>3. Max-Heap Trick 💡</h2>
<p>Python&#39;s <code>heapq</code> is a <strong>Min-Heap</strong> only. To get a <strong>Max-Heap</strong>, multiply numbers by <strong>-1</strong>!</p>
<pre><code class="language-python"># Simulate Max-Heap
nums = [1, 2, 3]
max_heap = []

for n in nums:
    heapq.heappush(max_heap, -n)  # Store [-1, -2, -3]

largest = -heapq.heappop(max_heap)  # Pop -3, convert back to 3
print(largest)  # 3
</code></pre>
<hr>
<h2>Common Use Cases</h2>
<ol>
<li><strong>Top K Elements</strong>: Find top K largest/smallest items.</li>
<li><strong>Merge K Sorted Lists</strong>: Efficiently merge multiple streams.</li>
<li><strong>Dijkstra&#39;s Algorithm</strong>: Shortest path in graphs.</li>
<li><strong>Task Scheduling</strong>: Execute highest priority tasks first.</li>
</ol>
<p>Let&#39;s practice! 🚀</p>
`,
    },

    // EXERCISE: Kth Largest Element
    ,// EXERCISE: Heap Sort
    ,// SECTION 7: Checkpoint
        {
            type: 'checkpoint',
            id: 'module4-5-checkpoint',
            title: '🎉 You\'re Ready for Advanced DSA!',
            description: 'You now have all the Python tools you need!',
            requirements: [
                {
                    sectionId: 'exercise-rectangle-class',
                    description: 'Understand classes and objects'
                },
                {
                    sectionId: 'exercise-build-graph',
                    description: 'Use defaultdict for graphs'
                },
                {
                    sectionId: 'exercise-first-unique-char',
                    description: 'Use Counter for frequency counting'
                },
                {
                    sectionId: 'exercise-recent-counter',
                    description: 'Use deque for queues'
                },
                {
                    sectionId: 'exercise-kth-largest',
                    description: 'Use heapq for priority queues'
                }
            ],
            celebrationMessage: 'Python OOP & Libraries Mastered! 🎉'
        },
        ...module4_5PythonOOPLessonSmartPracticeExercises,
    ].filter(Boolean) as LessonSection[],
};
