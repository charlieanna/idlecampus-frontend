import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { module10HeapsLessonSmartPracticeExercises } from './exercises/moduleHeapsLessonSmartPracticeExercises';

export const module10HeapsLesson: ProgressiveLesson = {
  id: 'heaps-priority-queues',
  title: 'Module: Heaps & Priority Queues',
  description: 'Build Heaps from first principles - discover the data structure through progressive optimization',
  unlockMode: 'sequential',
  sections: [

    // PART 0: THE PROBLEM - INTRODUCTION
    {
      type: 'reading',
      id: 'reading-k-largest-problem',
      title: 'The K Largest Numbers Problem',
      content: `<h1>The K Largest Numbers Problem</h1>
<h2>What You&#39;ll Learn</h2>
<p>In this module, you&#39;ll discover <strong>Heaps</strong> - one of the most elegant data structures in computer science. But instead of memorizing definitions, you&#39;ll <strong>invent the heap yourself</strong> by solving a real problem!</p>
<p>By the end, you&#39;ll understand:</p>
<ul>
<li>Why sorting isn&#39;t always the answer</li>
<li>How to maintain &quot;top K&quot; elements efficiently</li>
<li>The heap data structure and its properties</li>
<li>When and how to use heaps in interviews</li>
</ul>
<hr>
<h2>The Real-World Problem</h2>
<p>Imagine you&#39;re a software engineer at <strong>Spotify</strong> building the &quot;Top Charts&quot; feature:</p>
<pre><code>┌─────────────────────────────────────────────┐
│           🎵 TOP 10 SONGS TODAY             │
├─────────────────────────────────────────────┤
│  1. &quot;Blinding Lights&quot;     ▶ 2.4M plays     │
│  2. &quot;Shape of You&quot;        ▶ 2.1M plays     │
│  3. &quot;Dance Monkey&quot;        ▶ 1.9M plays     │
│  ...                                        │
│  10. &quot;Bad Guy&quot;            ▶ 1.2M plays     │
└─────────────────────────────────────────────┘
</code></pre>
<p><strong>The Challenge:</strong></p>
<ul>
<li><strong>50 million songs</strong> in the catalog</li>
<li><strong>Millions of plays</strong> happening every minute</li>
<li>Users expect the <strong>top 10</strong> to be accurate and instant</li>
<li>The leaderboard must update in <strong>real-time</strong></li>
</ul>
<p><strong>How do you efficiently track the top K items from a massive, constantly-changing dataset?</strong></p>
<hr>
<h2>Let&#39;s Simplify: The Core Problem</h2>
<p>Strip away the music - here&#39;s the pure algorithmic challenge:</p>
<pre><code>Given: A stream of numbers arriving one at a time
Goal:  At any moment, report the K largest numbers seen so far

Example with K = 3:
─────────────────────────────────────────────
Stream:  64 → 25 → 12 → 90 → 85 → 73 → 42
         ↓    ↓    ↓    ↓    ↓    ↓    ↓
Top 3:  [64] [64,25] [64,25,12] [90,64,25] [90,85,64] [90,85,73] [90,85,73]
</code></pre>
<p>Notice how the top 3 changes as new numbers arrive. When 90 comes in, it kicks out 12. When 73 arrives, it kicks out 64.</p>
<hr>
<h2>The Naive Solution: Just Sort It!</h2>
<p>Your first instinct might be:</p>
<pre><code class="language-python">def get_top_k(numbers, k):
    # Sort everything, take top k
    sorted_nums = sorted(numbers, reverse=True)
    return sorted_nums[:k]
</code></pre>
<p><strong>Let&#39;s trace through this:</strong></p>
<pre><code>numbers = [64, 25, 12, 90, 85, 73]

Step 1: Sort all 6 numbers → [90, 85, 73, 64, 25, 12]
Step 2: Take first 3        → [90, 85, 73] ✓
</code></pre>
<p><strong>It works!</strong> But what&#39;s the cost?</p>
<hr>
<h2>The Problem with Sorting</h2>
<p>Let&#39;s do the math for a real system:</p>
<pre><code>Scenario: Spotify with 50 million songs
─────────────────────────────────────────
Query: &quot;Show me top 10 songs&quot;
K = 10

Using sorting approach:
• Sort 50,000,000 items: O(n log n)
• ≈ 50M × 26 comparisons = 1.3 BILLION operations
• Just to find 10 numbers!

That&#39;s like reading every book in a library
just to find the 10 most popular ones.
</code></pre>
<p><strong>The waste is staggering:</strong></p>
<ul>
<li>We sorted 50 million items</li>
<li>We only needed 10 of them</li>
<li>99.99998% of our work was unnecessary!</li>
</ul>
<hr>
<h2>Thinking About Efficiency</h2>
<p>Let&#39;s think about what we actually need:</p>
<pre><code>What sorting gives us:        What we actually need:
─────────────────────         ────────────────────
[90, 85, 73, 64, 25, 12]     [90, 85, 73]
  ↑   ↑   ↑                    ↑   ↑   ↑
  These matter                 Just these!

[All items in perfect order]  [Only top K, order optional]
</code></pre>
<p><strong>Key Insight:</strong> We&#39;re doing WAY more work than necessary!</p>
<p>We don&#39;t need ALL items sorted. We just need to know:</p>
<ol>
<li>Which K items are the largest?</li>
<li>What&#39;s the smallest among the top K? (the &quot;gatekeeper&quot;)</li>
</ol>
<hr>
<h2>The Gatekeeper Concept</h2>
<p>Imagine you&#39;re a bouncer at an exclusive club that only fits K=3 people:</p>
<pre><code>Club capacity: 3 people
Current guests: [90, 85, 73]
Smallest guest (gatekeeper): 73

New arrival: 42
─────────────────
42 &lt; 73 (gatekeeper)
&quot;Sorry, you&#39;re not in the top 3!&quot;
Club stays: [90, 85, 73]

New arrival: 80
─────────────────
80 &gt; 73 (gatekeeper)
&quot;Welcome! 73 has to leave.&quot;
Club becomes: [90, 85, 80]
New gatekeeper: 80
</code></pre>
<p><strong>This is the key insight:</strong></p>
<ul>
<li>We only need to track K items</li>
<li>We only need quick access to the <strong>smallest of the top K</strong></li>
<li>New items either beat the gatekeeper or get rejected</li>
</ul>
<hr>
<h2>What Data Structure Do We Need?</h2>
<p>Let&#39;s define our requirements:</p>
<pre><code>Operations needed:
─────────────────────────────────────────────
1. INSERT: Add a new number         → Should be fast
2. GET-MIN: Find smallest in top K  → Should be O(1) or very fast
3. REMOVE-MIN: Kick out smallest    → Should be fast
4. SIZE: Know how many we&#39;re tracking → O(1)
</code></pre>
<p><strong>The question becomes:</strong> Is there a data structure optimized for these exact operations?</p>
<p><strong>Spoiler:</strong> Yes! It&#39;s called a <strong>Heap</strong> (or <strong>Priority Queue</strong>).</p>
<p>But before we learn about heaps, let&#39;s first try to solve this problem ourselves and see why simpler approaches fall short.</p>
<hr>
<h2>Your Learning Path</h2>
<p>In the next sections, you&#39;ll:</p>
<ol>
<li><strong>Try sorting approaches</strong> - See exactly why they&#39;re slow</li>
<li><strong>Discover the bottleneck</strong> - What operation is killing performance?</li>
<li><strong>Invent the solution</strong> - What properties would an ideal data structure have?</li>
<li><strong>Learn the Heap</strong> - A data structure that gives us exactly what we need</li>
<li><strong>Master heap problems</strong> - Apply heaps to classic interview questions</li>
</ol>
<p><strong>By discovering the heap through the problem, you&#39;ll truly understand it - not just memorize it.</strong></p>
<hr>
<h2>Ready to Begin?</h2>
<p>In the next section, you&#39;ll implement the naive sorting solution and measure its performance. Then we&#39;ll systematically optimize until we arrive at the heap.</p>
<p><strong>Let&#39;s start coding!</strong></p>
`,
      estimatedReadTime: 300,
      autoMarkComplete: true,
    },

    // PHASE 1: SORT EVERY TIME (NAIVE)
    ,// PHASE 2: OPTIMIZATION ATTEMPT - MAINTAIN SORTED LIST
    {
      type: 'reading',
      id: 'reading-sorted-list-approach',
      title: 'Approach 2: Maintain Sorted List',
      content: `<h1>Approach 2: Maintain Sorted List</h1>
<p>After seeing that sorting on every query is too slow (O(n log n)), let&#39;s try a smarter approach:</p>
<p><strong>What if we keep the list ALWAYS sorted?</strong></p>
<hr>
<h2>The Idea</h2>
<p>Instead of sorting on every <code>getTopK</code> call, maintain a sorted list at all times!</p>
<pre><code class="language-python">class TopKFinder:
    def __init__(self):
        self.scores = []  # Keep this ALWAYS sorted

    def add(self, score):
        # Find correct position and insert
        # List stays sorted!
        pass

    def getTopK(self, k):
        # Just return first k! Already sorted!
        return self.scores[:k]  # O(k) - fast!
</code></pre>
<hr>
<h2>Time Complexity Analysis</h2>
<h3>getTopK: O(k) ✅</h3>
<ul>
<li>List is pre-sorted</li>
<li>Just slice first k elements</li>
<li><strong>MUCH better than O(n log n)!</strong></li>
</ul>
<h3>add: O(n) ❌</h3>
<ul>
<li>Must find insertion position</li>
<li>Must <strong>shift all elements</strong> to the right</li>
<li>Insert in middle of array</li>
</ul>
<h2>Space Complexity Analysis</h2>
<ul>
<li><strong>O(n)</strong> - storing all scores in sorted list</li>
<li>Same space as Approach 1, just maintained in sorted order</li>
</ul>
<hr>
<h2>The Problem: Shifting Elements</h2>
<p>When inserting into a sorted list:</p>
<pre><code class="language-python">scores = [90, 85, 73, 64, 25, 12]  # Sorted, descending

# Add 80
# Where? Between 85 and 73
# Must shift: [73, 64, 25, 12] → all move right!

scores = [90, 85, 80, 73, 64, 25, 12]
         #         ↑
         #    Inserted here
         #    But had to shift 4 elements!
</code></pre>
<p><strong>Shifting is O(n) on average!</strong></p>
<hr>
<h2>Real-World Example</h2>
<p>With 1 million scores:</p>
<ul>
<li>Average insert: shift ~500,000 elements</li>
<li>Each shift: copy one value</li>
<li>Total: <strong>500,000 operations per insert!</strong></li>
</ul>
<p>If adding 10,000 new scores:</p>
<ul>
<li>10,000 × 500,000 = <strong>5 billion operations</strong> 😱</li>
</ul>
<hr>
<h2>The Bottleneck</h2>
<p>We traded one problem for another:</p>
<ul>
<li>✅ Fast queries: O(k) instead of O(n log n)</li>
<li>❌ Slow inserts: O(n) for shifting</li>
</ul>
<p><strong>Can we do better?</strong> 🤔</p>
<hr>
<h2>Next Attempt</h2>
<p>What if we use <strong>binary search</strong> to find the insertion position faster?</p>
<p>Would that help? Let&#39;s see...</p>
`,
      estimatedReadTime: 180,
      autoMarkComplete: true,
    },

    // PHASE 3: BINARY SEARCH ATTEMPT
    {
      type: 'reading',
      id: 'reading-partial-ordering-insight',
      title: 'Approach 3: The Key Insight',
      content: `<h1>Approach 3: Binary Search Insert</h1>
<p>Let&#39;s try to optimize the insertion using binary search!</p>
<hr>
<h2>The Idea</h2>
<p>Use <strong>binary search</strong> to find insertion position in O(log n):</p>
<pre><code class="language-python">import bisect

class TopKFinder:
    def __init__(self):
        self.scores = []  # Sorted ascending

    def add(self, score):
        bisect.insort(self.scores, score)  # Binary search + insert

    def getTopK(self, k):
        return self.scores[-k:]  # Last k (largest)
</code></pre>
<hr>
<h2>Time Complexity Analysis</h2>
<h3>Finding position: O(log n) ✅</h3>
<ul>
<li>Binary search is fast!</li>
<li>Quickly locate where to insert</li>
</ul>
<h3>Inserting: Still O(n)! ❌</h3>
<ul>
<li><strong>Still need to shift elements</strong></li>
<li>Binary search finds position fast</li>
<li>But insertion itself still slow</li>
</ul>
<pre><code class="language-python"># Finding position: O(log n) ✓
position = binary_search(scores, 80)  # Fast!

# Inserting: O(n) ✗
scores.insert(position, 80)  # Must shift all elements after position!
</code></pre>
<h2>Space Complexity Analysis</h2>
<ul>
<li><strong>O(n)</strong> - storing all scores in sorted list</li>
<li>Same as Approach 2, no change in space usage</li>
</ul>
<hr>
<h2>The Real Bottleneck</h2>
<p><strong>Array insertion requires shifting!</strong></p>
<p>No matter how fast we find the position:</p>
<ul>
<li>Must move elements to make space</li>
<li>Array elements must be contiguous</li>
<li>No way around O(n) shift</li>
</ul>
<pre><code>[90, 85, _, 73, 64, 25, 12]  # Need to shift to make space
              ↑
         Want to insert 80 here
</code></pre>
<hr>
<h2>💡 The Breakthrough Insight</h2>
<p>Let&#39;s step back and ask:</p>
<p><strong>Do we REALLY need a fully sorted array?</strong></p>
<p>For finding <strong>top K</strong>, we only need:</p>
<ul>
<li>Know which K elements are largest</li>
<li>Access the minimum of those K (to compare new elements)</li>
</ul>
<p><strong>We don&#39;t need to know the EXACT order of all elements!</strong></p>
<hr>
<h2>Partial Ordering</h2>
<p>What if we had a structure where:</p>
<ul>
<li>✅ Root/top element is the min (or max)</li>
<li>✅ Can add new elements in O(log n)</li>
<li>✅ Can remove min/max in O(log n)</li>
<li>❌ NOT fully sorted (don&#39;t need it!)</li>
</ul>
<p><strong>This is called PARTIAL ORDERING!</strong></p>
<hr>
<h2>The Data Structure We Need</h2>
<p>We need something that:</p>
<ol>
<li>Maintains min/max at the &quot;top&quot;</li>
<li>Adds new elements efficiently (no shifting!)</li>
<li>Removes min/max efficiently</li>
<li>Uses tree structure (not array) to avoid shifting</li>
</ol>
<p><strong>This structure exists!</strong></p>
<p>It&#39;s called a <strong>HEAP</strong> (or <strong>Priority Queue</strong>) ⛰️</p>
<hr>
<h2>What&#39;s Next</h2>
<p>Let&#39;s discover how heaps work by building one from scratch!</p>
`,
      estimatedReadTime: 240,
      autoMarkComplete: true,
    },

    // PHASE 4: DISCOVER THE HEAP PROPERTY
    {
      type: 'reading',
      id: 'reading-heap-property',
      title: 'Approach 4: The Heap Property - Discovery!',
      inlineExercises: [
        // Exercise 1: Index calculations
        {
          id: 'heap-parent-child',
          starterCode: `def get_heap_indices(i):
    """
    Given index i in a 0-indexed heap array, return:
    (parent_index, left_child_index, right_child_index)

    Example: get_heap_indices(1) returns (0, 3, 4)
      - Parent of index 1 is at index 0
      - Left child of index 1 is at index 3
      - Right child of index 1 is at index 4
    """
    parent = 0      # TODO: calculate parent index
    left = 0        # TODO: calculate left child index
    right = 0       # TODO: calculate right child index
    return (parent, left, right)`,
          testCases: [
            { input: '1', expectedOutput: '(0, 3, 4)' },
            { input: '2', expectedOutput: '(0, 5, 6)' },
            { input: '3', expectedOutput: '(1, 7, 8)' },
            { input: '5', expectedOutput: '(2, 11, 12)' },
          ],
          targetFunction: 'get_heap_indices',
          hints: [
            'For 0-indexed arrays: parent = (i - 1) // 2',
            'Left child = 2*i + 1',
            'Right child = 2*i + 2',
          ],
          solution: `def get_heap_indices(i):
    parent = (i - 1) // 2
    left = 2 * i + 1
    right = 2 * i + 2
    return (parent, left, right)`,
          successMessage: 'These index formulas are the foundation of heap operations!',
        },
        // Exercise 2: Check valid heap
        {
          id: 'heap-is-valid',
          starterCode: `def is_valid_max_heap(arr):
    """
    Check if array represents a valid max-heap.
    Max-heap property: every parent >= both children.
    Returns True if valid, False otherwise.
    """
    pass`,
          testCases: [
            { input: '[90, 85, 73, 64, 25]', expectedOutput: 'True' },
            { input: '[90, 100, 73]', expectedOutput: 'False' },
            { input: '[50, 40, 30, 20, 10]', expectedOutput: 'True' },
            { input: '[10, 20, 30]', expectedOutput: 'False' },
          ],
          targetFunction: 'is_valid_max_heap',
          hints: [
            'Loop through each index from 0 to len(arr)-1',
            'For each index i, check if arr[i] >= left child and arr[i] >= right child',
            'Make sure to check if children exist before comparing',
          ],
          solution: `def is_valid_max_heap(arr):
    n = len(arr)
    for i in range(n):
        left = 2 * i + 1
        right = 2 * i + 2
        if left < n and arr[i] < arr[left]:
            return False
        if right < n and arr[i] < arr[right]:
            return False
    return True`,
          successMessage: 'This check verifies the heap invariant: parent >= children!',
        },
        // Exercise 3: Heapify up (bubble up)
        {
          id: 'heapify-up',
          starterCode: `def heapify_up(heap, index):
    """
    Restore max-heap property by bubbling up from index.
    Compare with parent, swap if current > parent.
    Continue until heap property is restored.

    Returns the modified heap.
    """
    # TODO: Implement bubble-up logic
    # While index > 0:
    #   Calculate parent index
    #   If current > parent, swap them
    #   Update index to parent
    return heap`,
          testCases: [
            { input: '[90, 85, 73, 100], 3', expectedOutput: '[100, 90, 73, 85]' },
            { input: '[50, 40, 30, 60], 3', expectedOutput: '[60, 50, 30, 40]' },
            { input: '[90, 85, 73, 50], 3', expectedOutput: '[90, 85, 73, 50]' },
          ],
          targetFunction: 'heapify_up',
          hints: [
            'While index > 0, compare with parent',
            'Parent index = (index - 1) // 2',
            'If current > parent, swap them',
            'Update index to parent index and continue',
          ],
          solution: `def heapify_up(heap, index):
    while index > 0:
        parent = (index - 1) // 2
        if heap[index] > heap[parent]:
            heap[index], heap[parent] = heap[parent], heap[index]
            index = parent
        else:
            break
    return heap`,
          successMessage: 'heapify_up is used after inserting a new element at the end!',
        },
        // Exercise 4: Heapify down (bubble down)
        {
          id: 'heapify-down',
          starterCode: `def heapify_down(heap, index):
    """
    Restore max-heap property by bubbling down from index.
    Compare with children, swap with larger child if needed.
    Continue until heap property is restored.

    Returns the modified heap.
    """
    n = len(heap)
    # TODO: Implement bubble-down logic
    # Find the largest among current, left child, right child
    # If largest is not current, swap and continue
    return heap`,
          testCases: [
            { input: '[50, 90, 73, 64, 25], 0', expectedOutput: '[90, 64, 73, 50, 25]' },
            { input: '[10, 85, 73, 64, 25], 0', expectedOutput: '[85, 64, 73, 10, 25]' },
            { input: '[90, 85, 73], 0', expectedOutput: '[90, 85, 73]' },
          ],
          targetFunction: 'heapify_down',
          hints: [
            'Find left and right child indices: left = 2*i + 1, right = 2*i + 2',
            'Find the largest among current, left child, right child',
            'If largest is not current, swap and continue from new position',
            'Stop when current is larger than both children',
          ],
          solution: `def heapify_down(heap, index):
    n = len(heap)
    while True:
        largest = index
        left = 2 * index + 1
        right = 2 * index + 2

        if left < n and heap[left] > heap[largest]:
            largest = left
        if right < n and heap[right] > heap[largest]:
            largest = right

        if largest != index:
            heap[index], heap[largest] = heap[largest], heap[index]
            index = largest
        else:
            break
    return heap`,
          successMessage: 'heapify_down is used after extracting the root (replacing with last element)!',
        },
      ],
      content: `<h1>Approach 4: The Heap Property</h1>
<p>Let&#39;s discover a structure that gives us O(log n) operations without shifting!</p>
<hr>
<h2>The Key Idea: Binary Tree</h2>
<p>Instead of an array, use a <strong>binary tree</strong>!</p>
<pre><code>        90
       /  \
     85    73
    / \   / \
  64  25 12 55
</code></pre>
<p><strong>No shifting needed!</strong> Just add as a new leaf! 🎉</p>
<hr>
<h2>The Heap Property (Max-Heap)</h2>
<p><strong>Rule:</strong> Every parent ≥ both children</p>
<pre><code>        90  ← largest at root
       /  \
     85    73  ← children ≤ parent
    / \   / \
  64  25 12 55  ← all children ≤ parents
</code></pre>
<p><strong>Notice:</strong></p>
<ul>
<li>✅ Root is always the maximum</li>
<li>✅ No full sorting needed!</li>
<li>✅ Left and right subtrees can be in any order</li>
<li>✅ Only parent-child relationship matters</li>
</ul>
<h3>🎯 Try It: Check Valid Max-Heap</h3>
<p>Can you write a function to verify the heap property?</p>
<p><code-editor data-id="heap-is-valid"></code-editor></p>
<hr>
<h2>Min-Heap vs Max-Heap</h2>
<p><strong>Max-Heap:</strong> Parent ≥ children (largest at root)</p>
<pre><code>        90
       /  \
     85    73
</code></pre>
<p><strong>Min-Heap:</strong> Parent ≤ children (smallest at root)</p>
<pre><code>        12
       /  \
     25    55
</code></pre>
<hr>
<h2>Complete Binary Tree</h2>
<p>Heaps are <strong>complete binary trees</strong>:</p>
<ul>
<li>Fill levels left to right</li>
<li>No gaps until last level</li>
<li>Last level fills from left</li>
</ul>
<pre><code>Valid heap shape:
        90
       /  \
     85    73
    / \   /
  64  25 12    ← fills left to right

Invalid (has gap):
        90
       /  \
     85    73
    /     / \
  64     12 55  ← gap on left!
</code></pre>
<hr>
<h2>🎯 Array Representation - The Magic!</h2>
<p>We can store a tree in an <strong>array</strong> (no pointers needed!)</p>
<pre><code class="language-python"># Tree visualization:
        90
       /  \
     85    73
    / \   / \
  64  25 12 55

# Stored as array:
[90, 85, 73, 64, 25, 12, 55]
  0   1   2   3   4   5   6   ← indices
</code></pre>
<hr>
<h2>Index Relationships (0-indexed)</h2>
<p>For element at index <strong>i</strong>:</p>
<ul>
<li><strong>Left child:</strong> <code>2*i + 1</code></li>
<li><strong>Right child:</strong> <code>2*i + 2</code></li>
<li><strong>Parent:</strong> <code>(i - 1) // 2</code></li>
</ul>
<pre><code class="language-python">arr = [90, 85, 73, 64, 25, 12, 55]

# Element at index 1 (value 85):
left_child = 2*1 + 1 = 3  → arr[3] = 64 ✓
right_child = 2*1 + 2 = 4  → arr[4] = 25 ✓
parent = (1-1)//2 = 0  → arr[0] = 90 ✓
</code></pre>
<h3>🎯 Try It: Index Calculations</h3>
<p>Implement the three index functions yourself:</p>
<p><code-editor data-id="heap-parent-child"></code-editor></p>
<hr>
<h2>Why This Works</h2>
<p><strong>Complete binary tree</strong> property ensures:</p>
<ul>
<li>No gaps in array</li>
<li>Level-by-level storage</li>
<li>Simple index arithmetic</li>
<li><strong>No pointers or nodes needed!</strong></li>
</ul>
<hr>
<h2>Operations Preview</h2>
<h3>Insert (O(log n)):</h3>
<ol>
<li>Add to end of array</li>
<li>&quot;Bubble up&quot; to restore heap property</li>
<li>Compare with parent, swap if needed</li>
</ol>
<h3>Extract Max (O(log n)):</h3>
<ol>
<li>Save root value (max)</li>
<li>Move last element to root</li>
<li>&quot;Bubble down&quot; to restore heap property</li>
<li>Compare with children, swap with larger</li>
</ol>
<p><strong>No shifting!</strong> Just swap values in place! 🎉</p>
<h3>🎯 Try It: Heapify Up (Bubble Up)</h3>
<p>Implement the bubble-up operation used when inserting:</p>
<p><code-editor data-id="heapify-up"></code-editor></p>
<h3>🎯 Try It: Heapify Down (Bubble Down)</h3>
<p>Implement the bubble-down operation used when extracting:</p>
<p><code-editor data-id="heapify-down"></code-editor></p>
<hr>
<h2>Time &amp; Space Complexity</h2>
<table>
<thead>
<tr>
<th>Operation</th>
<th>Time</th>
<th>Space</th>
<th>Why</th>
</tr>
</thead>
<tbody><tr>
<td>Insert</td>
<td>O(log n)</td>
<td>O(1)</td>
<td>Bubble up tree height</td>
</tr>
<tr>
<td>Extract min/max</td>
<td>O(log n)</td>
<td>O(1)</td>
<td>Bubble down tree height</td>
</tr>
<tr>
<td>Peek min/max</td>
<td>O(1)</td>
<td>O(1)</td>
<td>Just check root</td>
</tr>
<tr>
<td>Build from array</td>
<td>O(n)</td>
<td>O(n)</td>
<td>Heapify bottom-up</td>
</tr>
</tbody></table>
<p><strong>Tree height = log n</strong> (complete binary tree)</p>
<p><strong>Overall space:</strong> O(n) for storing n elements in array</p>
<hr>
<h2>Comparison: All 4 Approaches</h2>
<p>Let&#39;s compare all approaches we&#39;ve tried:</p>
<table>
<thead>
<tr>
<th>Approach</th>
<th>Add</th>
<th>Query</th>
<th>Space</th>
<th>Bottleneck</th>
<th>Status</th>
</tr>
</thead>
<tbody><tr>
<td><strong>1. Sort Every Time</strong></td>
<td>O(1)</td>
<td>O(n log n)</td>
<td>O(n)</td>
<td>Sort all on every query</td>
<td>❌ Too slow</td>
</tr>
<tr>
<td><strong>2. Sorted List</strong></td>
<td>O(n)</td>
<td>O(k)</td>
<td>O(n)</td>
<td>Shifting elements</td>
<td>❌ Too slow</td>
</tr>
<tr>
<td><strong>3. Binary Search</strong></td>
<td>O(n)</td>
<td>O(k)</td>
<td>O(n)</td>
<td>Still shifting!</td>
<td>❌ Too slow</td>
</tr>
<tr>
<td><strong>4. Heap</strong></td>
<td><strong>O(log n)</strong></td>
<td><strong>O(1) peek</strong></td>
<td><strong>O(n)</strong></td>
<td><strong>None!</strong></td>
<td>✅ <strong>Optimal!</strong></td>
</tr>
</tbody></table>
<p><strong>The Winner:</strong> Heap achieves O(log n) for both add and extract with no shifting! 🎉</p>
<hr>
<h2>The Breakthrough! 💡</h2>
<p>We found a structure that:</p>
<ul>
<li>✅ Maintains min/max at root: O(1) access</li>
<li>✅ Insert: O(log n) - no shifting!</li>
<li>✅ Remove: O(log n) - just swaps!</li>
<li>✅ Stored in array - no pointers!</li>
<li>✅ Partial ordering - don&#39;t need full sort!</li>
</ul>
<p><strong>This is called a HEAP!</strong> ⛰️</p>
<hr>
<h2>What&#39;s Next</h2>
<p>Let&#39;s <strong>build a heap from scratch</strong> to see how it really works!</p>
`,
      estimatedReadTime: 300,
      autoMarkComplete: true,
    },

    // PHASE 5: BUILD SIMPLE HEAP
    ,// PHASE 6: EXTRACT MAX (HEAPIFY DOWN)
    ,// PHASE 7: BUILD HEAP FROM ARRAY
    {
      type: 'reading',
      id: 'reading-heapify-operation',
      title: 'Building a Heap from an Array - The heapify Operation',
      content: `<h1>Building a Heap from an Array</h1>
<p>What if you have an <strong>unsorted array</strong> and want to turn it into a heap?</p>
<p>There are two approaches - one is much faster!</p>
<hr>
<h2>Approach 1: Insert One-by-One (Top-Down)</h2>
<p>Insert each element using our <code>insert()</code> method:</p>
<pre><code class="language-python">arr = [4, 10, 3, 5, 1]
heap = SimpleMaxHeap()

for val in arr:
    heap.insert(val)  # Each insert: O(log n)
</code></pre>
<p><strong>Time Complexity:</strong> O(n log n)</p>
<ul>
<li>n elements</li>
<li>Each insert: O(log n)</li>
<li>Total: n × log n</li>
</ul>
<hr>
<h2>Approach 2: Heapify Bottom-Up (Optimal!)</h2>
<p>Start from the <strong>last parent</strong> and bubble down each parent:</p>
<pre><code class="language-python"># Start with unsorted array
arr = [4, 10, 3, 5, 1]

# Last parent index: (len - 1) // 2
last_parent = (5 - 1) // 2 = 2

# Heapify each parent from bottom to top
for i in range(last_parent, -1, -1):
    heapify_down(arr, i)
</code></pre>
<p><strong>Time Complexity:</strong> O(n) - Faster!</p>
<hr>
<h2>Why Bottom-Up is O(n)?</h2>
<h3>Intuition:</h3>
<ul>
<li>Most nodes are at <strong>bottom</strong> (leaves)</li>
<li>Leaves don&#39;t need heapify (they have no children!)</li>
<li>Only ~n/2 nodes need heapify</li>
<li>Upper levels have fewer nodes but more work</li>
<li><strong>Total work averages to O(n)</strong>!</li>
</ul>
<h3>Mathematical Proof:</h3>
<pre><code>Height 0 (leaves): n/2 nodes × 0 swaps = 0
Height 1: n/4 nodes × 1 swap = n/4
Height 2: n/8 nodes × 2 swaps = n/4
Height 3: n/16 nodes × 3 swaps = 3n/16
...
Total: n/4 + n/4 + 3n/16 + ... &lt; n

Sum of this series converges to O(n)!
</code></pre>
<hr>
<h2>Example: Heapify [4, 10, 3, 5, 1]</h2>
<pre><code>Initial array (as tree):
        4
       / \
      10   3
     / \
    5   1
</code></pre>
<p><strong>Step 1:</strong> Last parent = index 1 (value 10)</p>
<pre><code>Compare 10 with children (5, 1)
10 &gt; both, no swap needed
</code></pre>
<p><strong>Step 2:</strong> Parent at index 0 (value 4)</p>
<pre><code>Compare 4 with children (10, 3)
Swap with larger child (10)

        10
       / \
      4    3
     / \
    5   1

Continue bubbling down 4:
Compare 4 with children (5, 1)
Swap with larger child (5)

        10
       / \
      5    3
     / \
    4   1
</code></pre>
<p><strong>Result:</strong> Max-heap in O(n) time!</p>
<hr>
<h2>Top-Down vs Bottom-Up</h2>
<table>
<thead>
<tr>
<th>Approach</th>
<th>Time</th>
<th>Space</th>
<th>Why</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Top-Down</strong> (insert one-by-one)</td>
<td>O(n log n)</td>
<td>O(n)</td>
<td>n inserts, each O(log n)</td>
</tr>
<tr>
<td><strong>Bottom-Up</strong> (heapify)</td>
<td>O(n)</td>
<td>O(n)</td>
<td>Most nodes are leaves, work decreases with height</td>
</tr>
</tbody></table>
<p><strong>For building initial heap: Bottom-up is faster!</strong> ✅</p>
<p><strong>Space:</strong> Both use O(n) to store the heap, bottom-up may modify in-place</p>
<hr>
<h2>When to Use Each?</h2>
<h3>Use Top-Down (insert):</h3>
<ul>
<li>Adding elements <strong>one at a time</strong></li>
<li>Building heap incrementally</li>
<li>Stream of data</li>
</ul>
<h3>Use Bottom-Up (heapify):</h3>
<ul>
<li>Converting <strong>existing array</strong> to heap</li>
<li>One-time heap construction</li>
<li>Have all data upfront</li>
</ul>
<hr>
<h2>Python&#39;s heapq.heapify()</h2>
<p>Python provides O(n) heapify:</p>
<pre><code class="language-python">import heapq

arr = [4, 10, 3, 5, 1]
heapq.heapify(arr)  # O(n) - in-place!
# arr is now: [1, 4, 3, 5, 10] (min-heap)
</code></pre>
<p><strong>Note:</strong> Python&#39;s heapq is always a <strong>min-heap</strong>!</p>
<p>For max-heap, negate values:</p>
<pre><code class="language-python">arr = [-4, -10, -3, -5, -1]
heapq.heapify(arr)
max_val = -heapq.heappop(arr)  # Get maximum
</code></pre>
<hr>
<h2>Key Takeaway</h2>
<p>Building a heap from an array:</p>
<ul>
<li><strong>Top-down:</strong> O(n log n) - insert one by one</li>
<li><strong>Bottom-up:</strong> O(n) - heapify from last parent</li>
</ul>
<p><strong>Bottom-up is optimal!</strong> 🚀</p>
`,
      estimatedReadTime: 300,
      autoMarkComplete: true,
    },

    // PHASE 8: COMPLETE MINHEAP CLASS
    ...module10HeapsLessonSmartPracticeExercises,
  ],
};
