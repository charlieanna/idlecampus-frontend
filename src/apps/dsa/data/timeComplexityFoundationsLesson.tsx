import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';

export const timeComplexityFoundationsLesson: ProgressiveLesson = {
  id: 'time-complexity-foundations',
  title: 'Module: Time Complexity Foundations',
  description: 'Master interview-speed complexity analysis through code patterns and common pitfalls',
  unlockMode: 'sequential',
  sections: [
    // SECTION 1: Quick Complexity Analysis
    {
      type: 'reading' as const,
      id: 'lesson-quick-complexity',
      title: 'Rapid Complexity Analysis',
      estimatedReadTime: 600,
      autoMarkComplete: false,
      content: `<h1>Rapid Complexity Analysis</h1>
<p>In a coding interview, you need to recognize complexity patterns quickly.</p>

<hr />

<h2>The Analysis Requirement</h2>
<p>When asked <strong>"What's the time complexity?"</strong>, you should be able to answer confidently.</p>
<p>This module teaches you to analyze any code - loops, recursion, string operations, nested structures - efficiently.</p>

<hr />

<h2>Pattern Recognition Guide</h2>

<h3>O(1) - Constant Time</h3>
<pre><code># Direct access, no loops
return arr[0]
return hash_map[key]
left, right = right, left</code></pre>
<p><strong>Recognition:</strong> Single operations, no iteration</p>

<hr />

<h3>O(log n) - Logarithmic</h3>
<pre><code># Binary search - halves the problem each time
while left <= right:
    mid = (left + right) // 2
    if arr[mid] == target: return mid
    elif arr[mid] < target: left = mid + 1
    else: right = mid - 1

# Tree height in balanced tree
# Dijkstra's heap operations</code></pre>
<p><strong>Recognition:</strong> Problem size HALVES each iteration</p>
<p><strong>Common in:</strong> Binary search, balanced trees, heaps</p>

<hr />

<h3>O(n) - Linear</h3>
<pre><code># Single pass through data
for item in array:
    process(item)

# DFS/BFS visiting each node once
def dfs(node):
    visited.add(node)
    for neighbor in node.neighbors:
        if neighbor not in visited:
            dfs(neighbor)</code></pre>
<p><strong>Recognition:</strong> Visit each element/node ONCE</p>
<p><strong>Common in:</strong> Array scans, graph traversals (when visiting each node once)</p>

<hr />

<h3>O(n log n) - Linearithmic</h3>
<pre><code># Merge sort, heap sort
def merge_sort(arr):
    # Divide: O(log n) levels
    # Conquer: O(n) work per level

# Building heaps
# Some graph algorithms</code></pre>
<p><strong>Recognition:</strong> Divide and conquer with linear work per level</p>
<p><strong>Common in:</strong> Efficient sorting, heap operations</p>

<hr />

<h3>O(n²) - Quadratic</h3>
<pre><code># Check all pairs
for i in range(n):
    for j in range(n):
        if arr[i] + arr[j] == target:
            return (i, j)

# Hidden nested loop
for i in range(n):
    if arr[i] in some_list:  # ← O(n) search!
        process(arr[i])</code></pre>
<p><strong>Recognition:</strong> Nested loops, checking all pairs</p>
<p><strong>Common pitfall:</strong> Hidden nested iterations (in, indexOf)</p>

<hr />

<h3>O(2^n) - Exponential</h3>
<pre><code># Naive recursive Fibonacci
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)  # ← Each call makes 2 calls!

# Backtracking all subsets
def subsets(arr, i):
    if i == len(arr): return [[]]
    # Two choices per element: include or exclude</code></pre>
<p><strong>Recognition:</strong> Each step branches into multiple recursive calls</p>
<p><strong>Common in:</strong> Brute force recursion, generating all combinations</p>

<hr />

<h2>Space Complexity Shortcuts</h2>

<h3>Quick Rules:</h3>
<ol>
  <li><strong>Recursion depth = Space for call stack</strong>
    <ul>
      <li>Linear recursion (n calls deep) = O(n) space</li>
      <li>Binary tree recursion = O(h) space (h = height)</li>
    </ul>
  </li>
  <li><strong>Extra data structures count</strong>
    <ul>
      <li>Hash map storing n items = O(n) space</li>
      <li>Visited set for n nodes = O(n) space</li>
    </ul>
  </li>
  <li><strong>In-place operations = O(1) extra space</strong>
    <ul>
      <li>Modifying existing array without new structures</li>
    </ul>
  </li>
</ol>

<hr />

<h2>Common Interview Pitfalls</h2>

<h3>❌ Pitfall 1: Forgetting Hidden Loops</h3>
<pre><code># Looks like O(n), but...
for i in range(n):
    result = arr[:i]  # ← Slicing is O(i)!
# Total: O(n²)</code></pre>
<p><strong>Watch for:</strong> Slicing, indexOf, in, string concatenation in loops</p>

<h3>❌ Pitfall 2: Miscounting Recursion</h3>
<pre><code>def binary_search_tree_height(node):
    if not node: return 0
    return 1 + max(height(node.left), height(node.right))</code></pre>
<p><strong>Wrong:</strong> "Two recursive calls, so O(2^n)"</p>
<p><strong>Right:</strong> Visits each node once = O(n)</p>
<p><strong>Key:</strong> Count TOTAL nodes visited, not calls per node</p>

<h3>❌ Pitfall 3: Confusing Best/Average/Worst</h3>
<pre><code># Binary search in sorted array</code></pre>
<p><strong>Wrong:</strong> "First element, O(1)!"</p>
<p><strong>Right:</strong> Worst case O(log n) - always give worst case unless asked</p>

<h3>❌ Pitfall 4: Ignoring Space Complexity</h3>
<p><strong>Interviewer asks:</strong> "What's the complexity?"</p>
<p><strong>Wrong answer:</strong> "O(n)" (only mentioning time)</p>
<p><strong>Right answer:</strong> "Time O(n), Space O(n) for the hash map"</p>

<hr />

<h2>The 30-Second Analysis Method</h2>

<p><strong>Step 1:</strong> Identify the loops</p>
<ul>
  <li>One loop → likely O(n)</li>
  <li>Nested loops → likely O(n²)</li>
  <li>No loops, just recursion → count depth/calls</li>
</ul>

<p><strong>Step 2:</strong> Check for hidden operations</p>
<ul>
  <li>String ops, slicing, searching in loops</li>
  <li>Add complexity for each operation</li>
</ul>

<p><strong>Step 3:</strong> State both time AND space</p>
<ul>
  <li>"Time: O(n log n), Space: O(1)"</li>
</ul>

<hr />

<h2>Practice Recognition</h2>

<p>Look at code and INSTANTLY identify:</p>
<ol>
  <li>Loop structure (nested? sequential?)</li>
  <li>Recursion pattern (how many calls? how deep?)</li>
  <li>Hidden operations (slicing, searching)</li>
  <li>Extra space used (data structures, recursion stack)</li>
</ol>

<p><strong>Next:</strong> We'll practice this skill across trees, graphs, DP, and more!</p>`
    },

    // SECTION 2: Quiz - Quick Complexity Recognition
    {
      type: 'quiz' as const,
      id: 'mcq-quick-complexity',
      title: 'Quick Complexity Recognition',
      questions: [
        {
          id: 'q1',
          question: 'What\'s the time complexity?\n```python\ndef find_max(arr):\n    max_val = arr[0]\n    for num in arr:\n        if num > max_val:\n            max_val = num\n    return max_val\n```',
          options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'],
          correctAnswer: 1,
          explanation: 'Single loop through n elements, each iteration does O(1) work (one comparison). Total: O(n).'
        },
        {
          id: 'q2',
          question: 'What\'s the time complexity?\n```python\ndef check_all_pairs(arr):\n    for i in range(len(arr)):\n        for j in range(len(arr)):\n            if arr[i] == arr[j]:\n                print("match")\n```',
          options: ['O(n)', 'O(n²)', 'O(n log n)', 'O(2n)'],
          correctAnswer: 1,
          explanation: 'Nested loops: outer loop runs n times, inner loop runs n times for each outer iteration. Total: n × n = O(n²).'
        },
        {
          id: 'q3',
          question: 'What\'s the time complexity?\n```python\ndef process(arr):\n    # First loop\n    for num in arr:\n        print(num)\n    \n    # Second loop  \n    for num in arr:\n        print(num * 2)\n```',
          options: ['O(n²)', 'O(n)', 'O(2n)', 'O(n + n)'],
          correctAnswer: 1,
          explanation: 'Two sequential loops, each O(n). Total: O(n) + O(n) = O(2n) = O(n). Sequential loops ADD, nested loops MULTIPLY.'
        },
        {
          id: 'q4',
          question: 'What\'s the time complexity?\n```python\ndef has_duplicate(arr):\n    seen = []\n    for num in arr:\n        if num in seen:    # What\'s the cost of this?\n            return True\n        seen.append(num)\n    return False\n```',
          options: ['O(n)', 'O(n²)', 'O(n log n)', 'O(1)'],
          correctAnswer: 1,
          explanation: 'TRAP! The `in` operator on a LIST scans every element - O(n) per check. Inside a loop of n iterations: O(n) × O(n) = O(n²). This is a common pitfall!'
        },
        {
          id: 'q5',
          question: 'Same code, but using a SET instead of list. What\'s the time complexity now?\n```python\ndef has_duplicate(arr):\n    seen = set()       # Changed to set!\n    for num in arr:\n        if num in seen:    # Now what\'s the cost?\n            return True\n        seen.add(num)\n    return False\n```',
          options: ['O(n²)', 'O(n)', 'O(n log n)', 'O(1)'],
          correctAnswer: 1,
          explanation: 'Set lookup (`in`) is O(1) on average. Loop runs n times, each iteration O(1). Total: O(n). This is why choosing the right data structure matters!'
        },
        {
          id: 'q6',
          question: 'What\'s the SPACE complexity?\n```python\ndef double_values(arr):\n    result = []\n    for num in arr:\n        result.append(num * 2)\n    return result\n```',
          options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'],
          correctAnswer: 1,
          explanation: 'We create a new list `result` that stores n elements. Space = O(n). The input array doesn\'t count - we only count EXTRA space used.'
        },
        {
          id: 'q7',
          question: 'What\'s the time complexity?\n```python\ndef sum_up_to(n):\n    total = 0\n    while n > 0:\n        total += n\n        n = n // 2    # Halve n each time\n    return total\n```',
          options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
          correctAnswer: 2,
          explanation: 'n is halved each iteration: n → n/2 → n/4 → ... → 1. Number of iterations = log₂(n). This is the signature of O(log n) - halving the problem size each step.'
        },
        {
          id: 'q8',
          question: 'What\'s the time complexity?\n```python\ndef build_string(n):\n    result = ""\n    for i in range(n):\n        result += "a"   # Add one character\n    return result\n```',
          options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
          correctAnswer: 1,
          explanation: 'TRAP! Strings are immutable. Each `+=` creates a NEW string, copying all previous characters. Iteration 1: copy 0 chars. Iteration 2: copy 1 char. ... Iteration n: copy n-1 chars. Total: 0+1+2+...+(n-1) = O(n²).'
        }
      ],
      passingScore: 60,
      requiredForProgress: false
    },

    // SECTION 3: Finding Bottlenecks Fast
    {
      type: 'reading' as const,
      id: 'lesson-bottlenecks',
      title: 'Spotting Bottlenecks',
      estimatedReadTime: 720,
      autoMarkComplete: false,
      content: `<h1>Spotting Bottlenecks in Python Code</h1>
<p>To optimize code, you must identify the slowest part that dominates the runtime.</p>

<hr />

<h2>What is a Bottleneck?</h2>
<p><strong>The segment with the highest time complexity.</strong></p>

<pre><code># Three operations:
result = binary_search(arr)    # O(log n)
for i in range(n):              # O(n)
    for j in range(n):          # O(n²) ← BOTTLENECK!
        process(i, j)</code></pre>

<p>Total: O(log n + n + n²) = <strong>O(n²)</strong></p>
<p>The nested loop dominates the execution time.</p>

<hr />

<h2>Bottleneck Spotting Guide</h2>

<h3>Rule 1: Highest Complexity Wins</h3>
<pre><code>O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(2^n)</code></pre>
<p><strong>Find the highest → that's your bottleneck</strong></p>

<h3>Rule 2: Nested Operations Multiply</h3>
<pre><code>for i in range(n):           # O(n)
    arr.index(target)        # O(n) ← Hidden loop!
# Total: O(n²)</code></pre>

<h3>Rule 3: Sequential Operations Add</h3>
<pre><code>for i in range(n): pass      # O(n)
for j in range(n): pass      # O(n)
# Total: O(n + n) = O(n)</code></pre>

<hr />

<h2>Common Bottleneck Categories</h2>

<h3>Hidden Costs in Lists</h3>

<p><strong>Example: Queue Processing with Lists</strong></p>
<pre><code>def process_queue(items):
    queue = items[:]
    results = []
    
    while queue:
        item = queue.pop(0)  # ← BOTTLENECK! O(n) per pop
        results.append(process(item))
    
    return results</code></pre>

<p><strong>Bottleneck:</strong> <code>queue.pop(0)</code> shifts all remaining elements</p>
<ul>
  <li>Each pop: O(n) to shift elements</li>
  <li>n pops total: O(n²)!</li>
</ul>
<p><strong>Fix:</strong> Use <code>collections.deque</code> for O(1) pops from front</p>

<p><strong>Example: Building Result Lists</strong></p>
<pre><code>def remove_duplicates(arr):
    result = []
    for num in arr:
        if num not in result:  # ← BOTTLENECK! O(n) per check
            result.append(num)
    return result</code></pre>

<p><strong>Bottleneck:</strong> <code>num not in result</code> scans entire list</p>
<ul>
  <li>Each check: O(n)</li>
  <li>n checks: O(n²)!</li>
</ul>
<p><strong>Fix:</strong> Use a set to track seen elements for O(1) lookup</p>

<hr />

<h3>Hidden Costs in String Operations</h3>

<p><strong>Example: String Concatenation in Loops</strong></p>
<pre><code>def build_string(words):
    result = ""
    for word in words:
        result += word  # ← BOTTLENECK! Creates new string each time
    return result</code></pre>

<p><strong>Bottleneck:</strong> Strings are immutable - each <code>+=</code> creates a new string</p>
<ul>
  <li>First concat: copy 0 + len(word1) chars</li>
  <li>Second concat: copy len(word1) + len(word2) chars</li>
  <li>Total: O(n²) where n is total characters!</li>
</ul>
<p><strong>Fix:</strong> Use <code>"".join(words)</code> for O(n)</p>

<p><strong>Example: Repeated Slicing</strong></p>
<pre><code>def count_substrings(s):
    count = 0
    for i in range(len(s)):
        for j in range(i+1, len(s)+1):
            substring = s[i:j]  # ← BOTTLENECK! O(j-i) copy
            if is_valid(substring):  # ← Another O(j-i)!
                count += 1</code></pre>

<p><strong>Bottlenecks:</strong></p>
<ol>
  <li>Nested loops: O(n²) substrings</li>
  <li>Slicing each: O(n) per substring</li>
  <li>Checking each: O(n) per substring</li>
  <li>Total: O(n³) or O(n⁴)!</li>
</ol>
<p><strong>Common Pitfall:</strong> Forgetting that slicing creates copies</p>

<hr />

<h3>Hidden Costs in Recursion</h3>

<p><strong>Example: Recursive List Building</strong></p>
<pre><code>def collect_elements(arr, path=[]):
    if not arr:
        return [path]
    
    # Include first element
    new_path = path + [arr[0]]  # ← BOTTLENECK! O(len(path)) copy
    
    return collect_elements(arr[1:], new_path)</code></pre>

<p><strong>Bottleneck:</strong> Copying list at each recursive call</p>
<ul>
  <li>Each call copies path (average length n/2)</li>
  <li>n recursive calls</li>
  <li>Total: O(n²)!</li>
</ul>
<p><strong>Common Pitfall:</strong> "It's just recursion, so O(n)"</p>
<p><strong>Reality:</strong> Work PER recursive call matters!</p>
<p><strong>Fix:</strong> Use indices instead of slicing, or modify in-place and backtrack</p>

<hr />

<h3>The Cost of Redundancy</h3>

<p><strong>Example: Recursive Fibonacci</strong></p>
<pre><code>def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)  # ← BOTTLENECK: Exponential!</code></pre>

<p><strong>Bottleneck:</strong> Recomputing same values</p>
<ul>
  <li>fib(5) calls fib(4) and fib(3)</li>
  <li>fib(4) calls fib(3) and fib(2)</li>
  <li>fib(3) computed TWICE!</li>
  <li>Total calls: O(2^n)</li>
</ul>
<p><strong>Common Pitfall:</strong> "Two recursive calls, looks simple"</p>
<p><strong>Reality:</strong> Exponential explosion from redundant work</p>

<p><strong>Fix: Add Caching</strong></p>
<pre><code>cache = {}
def fib(n):
    if n in cache: return cache[n]
    if n <= 1: return n
    cache[n] = fib(n-1) + fib(n-2)
    return cache[n]</code></pre>
<p><strong>Optimized:</strong> O(n) - each value computed once!</p>

<hr />

<h2>Common Bottleneck Patterns</h2>

<h3>Pattern 1: Hidden Nested Loops</h3>
<pre><code>for item in list1:
    if item in list2:  # ← O(n) search = nested!</code></pre>
<p><strong>Fix:</strong> Convert list2 to set for O(1) lookup</p>

<h3>Pattern 2: Repeated Copying</h3>
<pre><code>for i in range(n):
    new_arr = arr + [i]  # ← O(n) copy each time</code></pre>
<p><strong>Fix:</strong> Build list once, or use indices</p>

<h3>Pattern 3: Recomputing Same Values</h3>
<pre><code>for i in range(n):
    total = sum(arr[:i])  # ← Recalculating sum</code></pre>
<p><strong>Fix:</strong> Use running sum (prefix sum)</p>

<h3>Pattern 4: Inefficient Data Structure Operations</h3>
<pre><code>queue.pop(0)      # O(n) on list
arr.insert(0, x)  # O(n) on list</code></pre>
<p><strong>Fix:</strong> Use deque for O(1) operations at both ends</p>

<hr />

<h2>The Fast Bottleneck Analysis</h2>

<p><strong>Interview Scenario:</strong> Given code, find bottleneck in 30 seconds</p>

<p><strong>Step 1:</strong> Look for highest complexity operation</p>
<ul>
  <li>Nested loops? → O(n²) candidate</li>
  <li>Exponential recursion? → O(2^n) candidate</li>
</ul>

<p><strong>Step 2:</strong> Check hidden costs</p>
<ul>
  <li>Slicing, copying, <code>in</code> operator, <code>.index()</code></li>
  <li>String concatenation in loops</li>
  <li>List operations (<code>pop(0)</code>, <code>insert(0)</code>)</li>
</ul>

<p><strong>Step 3:</strong> Multiply nested, add sequential</p>
<ul>
  <li>Nested: outer × inner</li>
  <li>Sequential: op1 + op2</li>
</ul>

<p><strong>Step 4:</strong> Identify the dominating term</p>
<ul>
  <li>O(n² + n) = O(n²)</li>
  <li>O(n³ + n² + n) = O(n³)</li>
</ul>

<hr />

<h2>Key Insight</h2>

<blockquote>
  <p><strong>Same principles across all code:</strong></p>
  <ul>
    <li>Identify nested operations (loops, recursion, hidden searches)</li>
    <li>Account for hidden costs (copying, slicing, immutability)</li>
    <li>Find the highest complexity term</li>
  </ul>
  <p><strong>That's your bottleneck!</strong></p>
</blockquote>`
    },

    // SECTION 4: Quiz - Bottleneck Identification
    {
      type: 'quiz' as const,
      id: 'mcq-bottlenecks',
      title: 'Quiz: Spotting Bottlenecks',
      questions: [
        {
          id: 'q1',
          question: 'Where\'s the bottleneck?\n```python\ndef find_common(arr1, arr2):\n    result = []\n    for x in arr1:\n        for y in arr2:\n            if x == y:\n                result.append(x)\n    return result\n```',
          options: [
            'The append operation',
            'The comparison x == y',
            'The nested loops checking all pairs',
            'Creating the result list'
          ],
          correctAnswer: 2,
          explanation: 'Nested loops = O(n × m) comparisons. If both arrays have n elements, that\'s O(n²). The bottleneck is checking every possible pair.'
        },
        {
          id: 'q2',
          question: 'This code has a hidden O(n) operation. Which line?\n```python\ndef remove_first_occurrence(arr, target):\n    for i in range(len(arr)):\n        if arr[i] == target:\n            arr.pop(i)      # Line A\n            return\n```',
          options: [
            'The for loop',
            'The comparison arr[i] == target',
            'arr.pop(i) - removes and shifts all elements after i',
            'The return statement'
          ],
          correctAnswer: 2,
          explanation: '`pop(i)` removes element at index i, then shifts all elements after it left. This shift operation is O(n). Combined with the loop, worst case is O(n) + O(n) = O(n).'
        },
        {
          id: 'q3',
          question: 'What makes this code O(n²) instead of O(n)?\n```python\ndef remove_duplicates(arr):\n    result = []\n    for num in arr:\n        if num not in result:\n            result.append(num)\n    return result\n```',
          options: [
            'The for loop',
            'The append operation',
            '`num not in result` scans the entire list each time',
            'Creating a new list'
          ],
          correctAnswer: 2,
          explanation: '`in` on a list is O(n) - it checks every element. Inside an O(n) loop, this becomes O(n) × O(n) = O(n²). Using a set for lookups would make it O(n).'
        },
        {
          id: 'q4',
          question: 'Which code is faster for large n?\n```python\n# Option A\nfor i in range(n):\n    for j in range(n):\n        process(i, j)\n\n# Option B  \nfor i in range(n):\n    process(i)\nfor j in range(n):\n    process(j)\n```',
          options: [
            'Option A - fewer loop statements',
            'Option B - sequential is faster than nested',
            'Same complexity',
            'Depends on what process() does'
          ],
          correctAnswer: 1,
          explanation: 'Option A: O(n²) - nested loops multiply. Option B: O(n) + O(n) = O(n) - sequential loops add. For n=1000: A does 1,000,000 operations, B does 2,000.'
        },
        {
          id: 'q5',
          question: 'What\'s the time complexity?\n```python\ndef find_pair_sum(arr, target):\n    arr.sort()                    # Line 1\n    for i in range(len(arr)):     # Line 2\n        for j in range(len(arr)): # Line 3\n            if arr[i] + arr[j] == target:\n                return (i, j)\n```',
          options: [
            'O(n) - the sort dominates',
            'O(n log n) - the sort dominates',
            'O(n²) - the nested loops dominate',
            'O(n² log n) - multiply everything'
          ],
          correctAnswer: 2,
          explanation: 'Sort is O(n log n), nested loops are O(n²). We ADD sequential operations: O(n log n) + O(n²) = O(n²). The highest term dominates!'
        },
        {
          id: 'q6',
          question: 'What\'s the time complexity of this recursive function?\n```python\ndef countdown(n):\n    if n <= 0:\n        return\n    print(n)\n    countdown(n - 1)\n```',
          options: [
            'O(1)',
            'O(n)',
            'O(n²)',
            'O(2^n)'
          ],
          correctAnswer: 1,
          explanation: 'Each call does O(1) work (print) and makes exactly ONE recursive call. Total calls: n, n-1, n-2, ..., 0 = n+1 calls. Total: O(n).'
        },
        {
          id: 'q7',
          question: 'What\'s the time complexity?\n```python\ndef fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n```',
          options: [
            'O(n)',
            'O(n²)',
            'O(2^n)',
            'O(log n)'
          ],
          correctAnswer: 2,
          explanation: 'Each call makes TWO recursive calls. This creates a binary tree of calls. At depth d, there are 2^d calls. Total calls ≈ 2^n. This is exponential - very slow!'
        },
        {
          id: 'q8',
          question: 'Code has: O(n) setup + O(n²) processing + O(n) cleanup. What\'s the total complexity?',
          options: [
            'O(n)',
            'O(n²)',
            'O(n³)',
            'O(3n²)'
          ],
          correctAnswer: 1,
          explanation: 'Sequential operations ADD: O(n) + O(n²) + O(n) = O(n² + 2n) = O(n²). The highest order term dominates. Constants and lower terms are dropped.'
        }
      ],
      passingScore: 60,
      requiredForProgress: false
    },

    // SECTION 4.3: List Operations Complexity (Interview Critical!)
    {
      type: 'reading' as const,
      id: 'lesson-list-operations',
      title: 'List Operations: The Cost of Shifts',
      estimatedReadTime: 600,
      autoMarkComplete: false,
      content: `<h1>List Operations: The Cost of Shifts</h1>

<p>Understanding list mechanics is <strong>critical for interviews</strong>. Unlike Linked Lists, Python Lists are Dynamic Arrays.</p>

<hr />

<h2>The Cost of Shifting ⚠️</h2>

<p>What happens if we insert at the <strong>beginning</strong>?</p>

<pre><code>arr = [1, 2, 3, 4]
arr.insert(0, 9)</code></pre>

<p>To make room for <code>9</code> at index 0, Python must <strong>shift</strong> every other element one spot to the right.</p>

<pre><code>[ 1, 2, 3, 4, _ ]
  ↘  ↘  ↘  ↘
[ _, 1, 2, 3, 4 ]
  ↓
[ 9, 1, 2, 3, 4 ]</code></pre>

<p>This is <strong>O(n)</strong> because we touched n elements.</p>

<hr />

<h2>Slow Operations (O(n))</h2>

<p>Avoid these inside loops if possible!</p>

<pre><code>arr = [1, 2, 3]

# Insert at index
arr.insert(0, 5)   # O(n) - Shift everything right

# Remove specific index
arr.pop(0)         # O(n) - Shift everything left to fill gap

# Delete index
del arr[0]         # O(n) - Shift everything left

# Remove by value
arr.remove(2)      # O(n) - Find value + Shift left</code></pre>

<hr />

<h2>Fast Operations (O(1))</h2>

<p>These only affect the <strong>end</strong> of the list (Stack Pattern).</p>

<pre><code># Append to end
arr.append(4)      # O(1) amortized

# Remove from end
arr.pop()          # O(1)</code></pre>

<hr />

<h2>Summary Cheat Sheet</h2>

<table>
  <thead>
    <tr>
      <th>Operation</th>
      <th>Syntax</th>
      <th>Complexity</th>
      <th>Why?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Access</strong></td>
      <td><code>arr[i]</code></td>
      <td><strong>O(1)</strong></td>
      <td>Direct memory lookup</td>
    </tr>
    <tr>
      <td><strong>Append</strong></td>
      <td><code>arr.append(x)</code></td>
      <td><strong>O(1)</strong></td>
      <td>Add to end (no shifts)</td>
    </tr>
    <tr>
      <td><strong>Pop End</strong></td>
      <td><code>arr.pop()</code></td>
      <td><strong>O(1)</strong></td>
      <td>Remove end (no shifts)</td>
    </tr>
    <tr>
      <td><strong>Insert</strong></td>
      <td><code>arr.insert(i, x)</code></td>
      <td><strong>O(n)</strong></td>
      <td>Shifting elements</td>
    </tr>
    <tr>
      <td><strong>Delete</strong></td>
      <td><code>arr.pop(0)</code></td>
      <td><strong>O(n)</strong></td>
      <td>Shifting elements</td>
    </tr>
  </tbody>
</table>`
    },

    // SECTION 4.4: String Operations Complexity (Interview Critical!)
    {
      type: 'reading' as const,
      id: 'lesson-string-operations',
      title: 'String Operations: How They Work & Why It Matters',
      estimatedReadTime: 600,
      autoMarkComplete: false,
      content: `<h1>String Operations: How They Work &amp; Why It Matters</h1>

<p>Understanding string operations is <strong>critical for interviews</strong>. Many problems involve strings, and knowing the hidden costs can make or break your solution.</p>

<hr />

<h2>How Strings Are Stored: Immutability</h2>

<h3>The Key Concept</h3>

<p><strong>Strings in Python (and most languages) are IMMUTABLE.</strong></p>

<p>This means:</p>
<ul>
  <li>Once created, a string <strong>cannot be changed</strong></li>
  <li>Any "modification" creates a <strong>new string object</strong></li>
  <li>The old string remains in memory until garbage collected</li>
</ul>

<h3>Visual Example</h3>

<pre><code>s = "hello"
s = s + " world"  # This doesn't modify "hello"!</code></pre>

<p><strong>What actually happens:</strong></p>
<ol>
  <li>Python creates a new string "hello world"</li>
  <li>The variable <code>s</code> now points to the new string</li>
  <li>The old "hello" string still exists in memory (temporarily)</li>
</ol>

<p><strong>Memory layout:</strong></p>
<pre><code>Before: s → ["hello"] (memory address 0x1000)
After:  s → ["hello world"] (memory address 0x2000)
        ["hello"] still exists at 0x1000 (will be garbage collected)</code></pre>

<hr />

<h2>String Comparison: O(m) Cost</h2>

<h3>How String Comparison Works</h3>

<p>When you compare two strings, Python must check <strong>every character</strong>:</p>

<pre><code>def strings_equal(s1: str, s2: str) -> bool:
    # Step 1: Check lengths (O(1))
    if len(s1) != len(s2):
        return False
    
    # Step 2: Compare character by character (O(m))
    for i in range(len(s1)):
        if s1[i] != s2[i]:
            return False
    
    return True</code></pre>

<p><strong>Time Complexity: O(m)</strong> where m = string length</p>

<h3>Why It's O(m)</h3>

<p>Even if strings differ at the first character, Python still:</p>
<ol>
  <li>Checks the length first (O(1))</li>
  <li>Compares characters until finding a difference (worst case: O(m))</li>
</ol>

<p><strong>Example:</strong></p>
<pre><code>"apple" == "apply"
# Compares: 'a'=='a' ✓, 'p'=='p' ✓, 'p'=='p' ✓, 'l'=='l' ✓, 'e'=='y' ✗
# Total: 5 character comparisons = O(m)</code></pre>

<h3>Interview Insight</h3>

<blockquote>
  <p><strong>Every string comparison costs O(m). If you compare n strings, that's O(n × m) total!</strong></p>
</blockquote>

<p>This is why:</p>
<ul>
  <li><code>if word in words:</code> with a list is O(n × m) - checks n words, each comparison is O(m)</li>
  <li><code>if word in word_set:</code> with a set is O(m) - hash lookup is O(1), but hashing the string is O(m)</li>
</ul>

<hr />

<h2>String Concatenation: The O(n²) Trap</h2>

<h3>What Happens When You Append</h3>

<pre><code># SLOW: O(n²)
result = ""
for i in range(n):
    result += str(i)  # Each += creates a NEW string!</code></pre>

<p><strong>Step-by-step breakdown:</strong></p>

<pre><code>Iteration 1: result = "" + "0"
  - Create new string "0"
  - Copy 0 characters from old result
  - Copy 1 character from "0"
  - Total: 1 character copied

Iteration 2: result = "0" + "1"
  - Create new string "01"
  - Copy 1 character from old result ("0")
  - Copy 1 character from "1"
  - Total: 2 characters copied

Iteration 3: result = "01" + "2"
  - Create new string "012"
  - Copy 2 characters from old result ("01")
  - Copy 1 character from "2"
  - Total: 3 characters copied

...

Iteration n: result = "012...n-1" + "n"
  - Copy n-1 characters from old result
  - Copy 1 character from "n"
  - Total: n characters copied</code></pre>

<p><strong>Total characters copied:</strong> 1 + 2 + 3 + ... + n = n(n+1)/2 = <strong>O(n²)</strong></p>

<h3>Why This Happens</h3>

<p>Because strings are immutable:</p>
<ol>
  <li><code>result += "x"</code> cannot modify <code>result</code></li>
  <li>Python must create a <strong>new string</strong> containing both parts</li>
  <li>This requires <strong>copying all existing characters</strong> plus the new ones</li>
</ol>

<hr />

<h2>Efficient String Operations</h2>

<h3>Method 1: Use <code>join()</code> (Recommended)</h3>

<pre><code># FAST: O(n)
result = "".join(str(i) for i in range(n))</code></pre>

<p><strong>Why <code>join()</code> is O(n):</strong></p>
<ol>
  <li><strong>Calculate total size:</strong> Count all characters needed (O(n))</li>
  <li><strong>Allocate memory once:</strong> Create one string of correct size (O(1))</li>
  <li><strong>Copy each piece once:</strong> No redundant copying (O(n))</li>
  <li><strong>Total: O(n)</strong></li>
</ol>

<p><strong>Memory efficiency:</strong></p>
<ul>
  <li>Only one string object created</li>
  <li>No intermediate strings</li>
  <li>Minimal memory overhead</li>
</ul>

<h3>Method 2: Use List + Join</h3>

<pre><code># FAST: O(n)
parts = []
for i in range(n):
    parts.append(str(i))  # O(1) - list append is amortized O(1)
result = "".join(parts)   # O(n) - join all parts</code></pre>

<p><strong>Why this works:</strong></p>
<ul>
  <li>List append is <strong>amortized O(1)</strong> (occasional resize, but average is O(1))</li>
  <li>Join happens <strong>once</strong> at the end: O(n)</li>
  <li><strong>Total: O(n)</strong></li>
</ul>

<h3>Method 3: String Builder Pattern (For Complex Cases)</h3>

<pre><code># For very complex string building
from io import StringIO

builder = StringIO()
for i in range(n):
    builder.write(str(i))  # O(1) per write
result = builder.getvalue()  # O(n) to get final string</code></pre>

<hr />

<h2>Common String Operations &amp; Their Complexity</h2>

<h3>Comparison Operations</h3>

<table>
  <thead>
    <tr><th>Operation</th><th>Time Complexity</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td><code>s1 == s2</code></td><td>O(m)</td><td>Must compare all m characters</td></tr>
    <tr><td><code>s1 &lt; s2</code></td><td>O(m)</td><td>Lexicographic comparison</td></tr>
    <tr><td><code>len(s)</code></td><td>O(1)</td><td>Length is stored, not calculated</td></tr>
    <tr><td><code>s[i]</code></td><td>O(1)</td><td>Direct character access</td></tr>
  </tbody>
</table>

<h3>Search Operations</h3>

<table>
  <thead>
    <tr><th>Operation</th><th>Time Complexity</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td><code>char in s</code></td><td>O(m)</td><td>Linear search through string</td></tr>
    <tr><td><code>s.find(sub)</code></td><td>O(m × k)</td><td>Where k = substring length</td></tr>
    <tr><td><code>s.startswith(prefix)</code></td><td>O(k)</td><td>Where k = prefix length</td></tr>
    <tr><td><code>s.endswith(suffix)</code></td><td>O(k)</td><td>Where k = suffix length</td></tr>
  </tbody>
</table>

<h3>Modification Operations (Create New Strings)</h3>

<table>
  <thead>
    <tr><th>Operation</th><th>Time Complexity</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td><code>s1 + s2</code></td><td>O(m + n)</td><td>Creates new string, copies both</td></tr>
    <tr><td><code>s += "x"</code></td><td>O(m + 1)</td><td>Creates new string, copies all</td></tr>
    <tr><td><code>s * n</code></td><td>O(m × n)</td><td>Creates new string with n copies</td></tr>
    <tr><td><code>s.replace(old, new)</code></td><td>O(m)</td><td>Scans string once</td></tr>
  </tbody>
</table>

<h3>Slicing Operations</h3>

<table>
  <thead>
    <tr><th>Operation</th><th>Time Complexity</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td><code>s[i:j]</code></td><td>O(j - i)</td><td>Creates new string, copies characters</td></tr>
    <tr><td><code>s[:]</code></td><td>O(m)</td><td>Creates copy of entire string</td></tr>
  </tbody>
</table>

<hr />

<h2>Interview Patterns &amp; Tips</h2>

<h3>Pattern 1: Building Strings in Loops</h3>

<p><strong>❌ WRONG:</strong></p>
<pre><code>result = ""
for word in words:
    result += word  # O(n²) total!</code></pre>

<p><strong>✅ CORRECT:</strong></p>
<pre><code>result = "".join(words)  # O(n) total!</code></pre>

<h3>Pattern 2: String Comparison in Loops</h3>

<p><strong>❌ WRONG:</strong></p>
<pre><code>for word in words:  # O(n)
    if word == target:  # O(m) per comparison
        return True
# Total: O(n × m)</code></pre>

<p><strong>✅ CORRECT (if exact match):</strong></p>
<pre><code>word_set = set(words)  # O(n × m) to build
if target in word_set:  # O(m) to hash + O(1) lookup
    return True
# Total: O(n × m) to build, O(m) per lookup</code></pre>

<h3>Pattern 3: Checking Prefixes</h3>

<p><strong>❌ WRONG:</strong></p>
<pre><code>for word in words:  # O(n)
    if word.startswith(prefix):  # O(k) where k = prefix length
        return True
# Total: O(n × k)</code></pre>

<p><strong>✅ CORRECT (use Trie):</strong></p>
<pre><code># Build trie once: O(n × m)
# Check prefix: O(k) where k = prefix length
# Total: O(n × m) to build, O(k) per query</code></pre>

<hr />

<h2>Key Takeaways for Interviews</h2>

<ol>
  <li><strong>String comparison is O(m)</strong> - Always account for string length in complexity</li>
  <li><strong>String concatenation with <code>+=</code> is O(n²)</strong> - Use <code>join()</code> instead</li>
  <li><strong>Strings are immutable</strong> - "Modifications" create new objects</li>
  <li><strong>Slicing creates new strings</strong> - <code>s[i:j]</code> costs O(j-i) time</li>
  <li><strong>Hash-based structures still need O(m)</strong> - Hashing a string takes O(m) time</li>
</ol>

<hr />

<h2>Practice Question</h2>

<p><strong>What's the time complexity of this code?</strong></p>

<pre><code>def find_common_prefix(words):
    if not words:
        return ""
    
    prefix = words[0]  # O(1)
    
    for word in words[1:]:  # O(n) iterations
        while not word.startswith(prefix):  # O(k) where k = prefix length
            prefix = prefix[:-1]  # O(k) - creates new string
            if not prefix:
                return ""
    
    return prefix</code></pre>

<details>
<summary>💭 Think first, then click to reveal</summary>

<p><strong>Answer: O(n × m²)</strong> where n = number of words, m = average word length</p>

<p><strong>Breakdown:</strong></p>
<ul>
  <li>Outer loop: O(n) iterations</li>
  <li><code>startswith()</code>: O(k) where k = current prefix length</li>
  <li><code>prefix[:-1]</code>: O(k) - creates new string by copying k-1 characters</li>
  <li>In worst case, prefix shrinks from m to 0: O(m) iterations</li>
  <li>Each iteration: O(m) for startswith + O(m) for slicing = O(m)</li>
  <li><strong>Total: O(n × m × m) = O(n × m²)</strong></li>
</ul>

<p><strong>Optimization:</strong> Use character-by-character comparison instead of slicing!</p>

</details>

<hr />

<p><strong>Next:</strong> Now that you understand string operations, let's see common pitfalls that catch even experienced developers! 🚀</p>`,
    },

    // SECTION 4.5: Deep Dive - Hidden Complexity Pitfalls
    {
      type: 'reading' as const,
      id: 'lesson-hidden-pitfalls',
      title: 'Deep Dive: Hidden Complexity Pitfalls',
      estimatedReadTime: 840,
      autoMarkComplete: false,
      content: `<h1>Deep Dive: Hidden Complexity Pitfalls</h1>

<p>These are the moments that transform how you write code. Each pitfall is a common mistake that silently destroys performance.</p>

<hr />

<h2>Pitfall 1: The String Concatenation Trap</h2>

<blockquote>
  <p><strong>Prerequisite:</strong> Make sure you've read "String Operations" to understand string immutability!</p>
</blockquote>

<h3>The Problem</h3>
<pre><code># SLOW: O(n²)
def build_result(items):
    result = ""
    for item in items:
        result += str(item) + ","  # Creates new string each time!
    return result</code></pre>

<p><strong>Why is this O(n²)?</strong></p>

<p>As we learned, strings in Python are <strong>immutable</strong>. Each <code>+=</code> operation:</p>
<ol>
  <li>Creates a new string object</li>
  <li>Copies ALL previous characters</li>
  <li>Appends the new characters</li>
</ol>

<p><strong>The hidden cost:</strong></p>
<ul>
  <li>Iteration 1: Copy 0 chars, add new → 5 chars total</li>
  <li>Iteration 2: Copy 5 chars, add new → 10 chars total</li>
  <li>Iteration 3: Copy 10 chars, add new → 15 chars total</li>
  <li>...</li>
  <li>Total copies: 0 + 5 + 10 + 15 + ... = O(n²)</li>
</ul>

<h3>The Fix</h3>
<pre><code># FAST: O(n)
def build_result(items):
    return ",".join(str(item) for item in items)</code></pre>

<p><strong>Why is join() O(n)?</strong></p>
<ul>
  <li>Calculates total size needed: O(n)</li>
  <li>Allocates memory once</li>
  <li>Copies each item once: O(n)</li>
  <li>Total: O(n)</li>
</ul>

<hr />

<h2>Pitfall 2: The List Lookup Trap</h2>

<h3>The Problem</h3>
<pre><code># SLOW: O(n²)
def find_unique(arr):
    unique = []
    for num in arr:
        if num not in unique:  # O(n) scan each time!
            unique.append(num)
    return unique</code></pre>

<p><strong>Why is this O(n²)?</strong></p>

<p>The <code>in</code> operator on lists:</p>
<ul>
  <li>Scans from start to end</li>
  <li>Compares each element with <code>==</code></li>
  <li>Worst case: checks all n elements</li>
</ul>

<h3>The Fix</h3>
<pre><code># FAST: O(n)
def find_unique(arr):
    return list(dict.fromkeys(arr))  # Preserves order, O(1) lookup

# Or if order doesn't matter:
def find_unique(arr):
    return list(set(arr))</code></pre>

<p><strong>Why is set O(n)?</strong></p>
<ul>
  <li>Hash table provides O(1) average lookup</li>
  <li>n insertions × O(1) each = O(n) total</li>
</ul>

<hr />

<h2>Pitfall 3: The Slice Copy Trap</h2>

<h3>The Problem</h3>
<pre><code># SLOW: O(n²)
def sum_recursive(arr):
    if not arr:
        return 0
    return arr[0] + sum_recursive(arr[1:])  # Creates new array!</code></pre>

<p><strong>Why is this O(n²)?</strong></p>

<p>Array slicing <code>arr[1:]</code>:</p>
<ul>
  <li>Creates a NEW array</li>
  <li>Copies all elements from index 1 onwards</li>
  <li>Each recursive call creates a new array</li>
</ul>

<h3>The Fix</h3>
<pre><code># FAST: O(n)
def sum_recursive(arr, i=0):
    if i >= len(arr):
        return 0
    return arr[i] + sum_recursive(arr, i+1)  # Just pass index!

# Or better yet, use built-in:
def sum_recursive(arr):
    return sum(arr)  # O(n), no recursion overhead</code></pre>

<hr />

<h2>Pitfall 4: The Nested List Check Trap</h2>

<h3>The Problem</h3>
<pre><code># SLOW: O(n³)
def find_pairs(arr):
    result = []
    for i in range(len(arr)):
        for j in range(len(arr)):
            if arr[i] not in result:  # O(n) check inside O(n²) loops!
                result.append((arr[i], arr[j]))
    return result</code></pre>

<p><strong>Why is this O(n³)?</strong></p>

<p>Complexity compounds:</p>
<ul>
  <li>Outer loop: n iterations</li>
  <li>Inner loop: n iterations</li>
  <li><code>not in result</code>: O(n) scan</li>
  <li>Total: n × n × n = O(n³)</li>
</ul>

<h3>The Fix</h3>
<pre><code># FAST: O(n²)
def find_pairs(arr):
    result = []
    seen = set()  # O(1) lookup!
    for i in range(len(arr)):
        for j in range(len(arr)):
            if arr[i] not in seen:  # O(1) check!
                result.append((arr[i], arr[j]))
                seen.add(arr[i])
    return result</code></pre>

<hr />

<h2>Pitfall 5: The Repeated Calculation Trap</h2>

<h3>The Problem</h3>
<pre><code># SLOW: O(n²)
def find_averages(arr):
    result = []
    for i in range(len(arr)):
        avg = sum(arr[:i+1]) / (i+1)  # Recalculating sum each time!
        result.append(avg)
    return result</code></pre>

<p><strong>Why is this O(n²)?</strong></p>

<p>Each <code>sum(arr[:i+1])</code>:</p>
<ul>
  <li>Creates a slice: O(i)</li>
  <li>Sums i elements: O(i)</li>
  <li>Total per iteration: O(i)</li>
</ul>

<h3>The Fix</h3>
<pre><code># FAST: O(n)
def find_averages(arr):
    result = []
    running_sum = 0
    for i, num in enumerate(arr):
        running_sum += num  # Just add new element!
        avg = running_sum / (i+1)
        result.append(avg)
    return result</code></pre>

<hr />

<h2>Summary: The 5 Insights</h2>

<ol>
  <li><strong>String Concatenation</strong>: Immutability means copying → Use <code>join()</code></li>
  <li><strong>List Lookup</strong>: <code>in</code> is O(n) → Use sets for O(1)</li>
  <li><strong>Slicing</strong>: Creates copies → Use indices</li>
  <li><strong>Nested Checks</strong>: Compounds complexity → Use O(1) structures in loops</li>
  <li><strong>Repeated Calculations</strong>: Redundant work → Use running totals or caching</li>
</ol>

<hr />

<h2>The Pattern</h2>

<p>All these pitfalls share a common theme:</p>

<blockquote>
  <p><strong>Hidden operations that look innocent but multiply complexity</strong></p>
</blockquote>

<p><strong>How to avoid them:</strong></p>
<ol>
  <li>Question every operation inside a loop</li>
  <li>Know the cost of built-in operations (<code>in</code>, slicing, <code>+=</code>)</li>
  <li>Use the right data structure (set vs list, deque vs list)</li>
  <li>Avoid redundant work (caching, running totals)</li>
</ol>`
    },

    // SECTION 5: Brute Force → Optimization Framework
    {
      type: 'reading' as const,
      id: 'lesson-optimization-framework',
      title: 'Strategy: From Brute Force to Optimal',
      estimatedReadTime: 900,
      autoMarkComplete: false,
      content: `<h1>Strategy: From Brute Force to Optimal</h1>

<p>The core strategy: Start simple, analyze, optimize.</p>

<p>This framework works for any problem - arrays, strings, recursion, or nested structures.</p>

<hr />

<h2>The Framework</h2>

<h3>Step 1: Brute Force</h3>
<p><strong>Write the obvious solution first</strong></p>
<p>Don't try to be clever immediately.</p>

<h3>Step 2: Analyze</h3>
<p><strong>Identify the bottleneck</strong></p>
<p>What makes it slow?</p>

<h3>Step 3: Optimize</h3>
<p><strong>Target the bottleneck</strong></p>
<p>Use the right data structure/algorithm.</p>

<hr />

<h2>Example 1: Two Sum (Arrays)</h2>

<h3>Step 1: Brute Force</h3>
<pre><code>def two_sum(nums, target):
    """Find two numbers that add to target"""
    # Check all pairs
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]</code></pre>

<p><strong>Complexity:</strong> O(n²) time, O(1) space</p>

<h3>Step 2: Analyze</h3>
<p><strong>Bottleneck:</strong> Nested loop checks all pairs (n²/2 comparisons)</p>
<p><strong>Why slow?</strong> For each number, we search the entire rest of array for the complement.</p>
<p><strong>Key insight:</strong> We're repeatedly searching for values.</p>

<h3>Step 3: Optimize</h3>
<p><strong>Idea:</strong> Remember what we've seen → O(1) lookup!</p>

<pre><code>def two_sum(nums, target):
    seen = {}  # value → index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:  # O(1) lookup!
            return [seen[complement], i]
        seen[num] = i</code></pre>

<p><strong>Optimized:</strong> O(n) time, O(n) space</p>
<p><strong>Trade:</strong> Space for speed.</p>

<hr />

<h2>Example 2: Find All Subsets (Recursion)</h2>

<h3>Step 1: Brute Force (Naive Recursion)</h3>
<pre><code>def count_subsets(arr, target, i=0):
    """Count subsets that sum to target"""
    if target == 0:
        return 1  # Found valid subset
    if target &lt; 0 or i >= len(arr):
        return 0  # Invalid
    
    # Option 1: Include arr[i]
    include = count_subsets(arr, target - arr[i], i+1)
    
    # Option 2: Exclude arr[i]
    exclude = count_subsets(arr, target, i+1)
    
    return include + exclude</code></pre>

<p><strong>Complexity:</strong> O(2^n) - exponential.</p>
<p><strong>Why?</strong> Each element has 2 choices (include/exclude), creating 2^n paths.</p>

<h3>Step 2: Analyze</h3>
<p><strong>Bottleneck:</strong> Recomputing same subproblems.</p>
<p>Example: count_subsets(arr, target=10, i=5) might be computed many times through different paths.</p>
<p><strong>Why slow?</strong> No memory of previous calculations.</p>
<p><strong>Key insight:</strong> Many recursive calls have same (target, i) parameters.</p>

<h3>Step 3: Optimize (Add Caching)</h3>
<pre><code>def count_subsets(arr, target):
    cache = {}  # (target, i) → count
    
    def helper(target, i):
        if target == 0:
            return 1
        if target &lt; 0 or i >= len(arr):
            return 0
        
        # Check cache first!
        if (target, i) in cache:
            return cache[(target, i)]
        
        # Same logic, but cache result
        include = helper(target - arr[i], i+1)
        exclude = helper(target, i+1)
        
        cache[(target, i)] = include + exclude
        return cache[(target, i)]
    
    return helper(target, 0)</code></pre>

<p><strong>Optimized:</strong> O(n × target) time, O(n × target) space</p>
<p><strong>Transformation:</strong> Exponential → Polynomial through caching.</p>

<hr />

<h2>Common Optimization Patterns</h2>

<h3>Pattern 1: Hash Map for O(1) Lookup</h3>
<p><strong>Problem:</strong> Repeatedly searching for values</p>
<p><strong>Solution:</strong> Store in hash map/set for O(1) lookup</p>
<p><strong>Example:</strong> Instead of <code>if x in list</code> (O(n)), use <code>if x in set</code> (O(1))</p>

<h3>Pattern 2: Caching for Redundant Work</h3>
<p><strong>Problem:</strong> Recomputing same values</p>
<p><strong>Solution:</strong> Cache results in dictionary</p>
<p><strong>Example:</strong> Fibonacci with memoization transforms O(2^n) → O(n)</p>

<h3>Pattern 3: Smart Data Structures</h3>
<p><strong>Problem:</strong> Inefficient operations (pop(0), insert(0))</p>
<p><strong>Solution:</strong> Use right structure for the job</p>
<p><strong>Example:</strong> Use <code>deque</code> instead of list for queue operations</p>

<h3>Pattern 4: Running Totals</h3>
<p><strong>Problem:</strong> Recalculating sums/products repeatedly</p>
<p><strong>Solution:</strong> Maintain running total</p>
<p><strong>Example:</strong> Prefix sums transform O(n²) → O(n)</p>

<h3>Pattern 5: Avoid Copying</h3>
<p><strong>Problem:</strong> Creating copies in loops/recursion</p>
<p><strong>Solution:</strong> Use indices or modify in-place</p>
<p><strong>Example:</strong> Pass index instead of slicing arrays</p>

<hr />

<h2>Common Pitfalls in Optimization</h2>

<h3>Pitfall 1: Optimizing the Wrong Thing</h3>
<pre><code>Code: O(n) scan + O(n²) nested loop
Wrong: "Let me make the scan faster!"
Right: Fix the O(n²) loop first!</code></pre>

<h3>Pitfall 2: Over-Optimizing</h3>
<pre><code>Brute force works for small inputs
Don't spend 30 minutes optimizing O(n²) to O(n)
if n is always ≤ 100</code></pre>

<h3>Pitfall 3: Forgetting Space-Time Tradeoffs</h3>
<pre><code>Going from O(n²) time to O(n) time
might require O(n) space
Be ready to discuss the tradeoff.</code></pre>

<h3>Pitfall 4: Not Starting with Brute Force</h3>
<pre><code>Interviewer wants to see your thought process!
Brute force → analyze → optimize
Don't jump to optimal if you're unsure</code></pre>

<hr />

<h2>Communication Template</h2>

<h3>When presenting brute force:</h3>
<p>"I'll start with the straightforward approach. Checking all pairs gives O(n²) time and O(1) space."</p>

<h3>When analyzing:</h3>
<p>"The bottleneck is the nested loop - we're searching for the complement repeatedly, which takes O(n) per element."</p>

<h3>When optimizing:</h3>
<p>"If we use a hash map to store values we've seen, we can reduce the search from O(n) to O(1), giving us O(n) time total with O(n) extra space."</p>

<hr />

<h2>Key Framework Principles</h2>

<ol>
  <li><strong>Always start simple</strong> - brute force is acceptable first</li>
  <li><strong>Find the bottleneck</strong> - what dominates runtime?</li>
  <li><strong>Target the bottleneck</strong> - optimize the slowest part</li>
  <li><strong>Consider tradeoffs</strong> - time vs space</li>
  <li><strong>Verify complexity</strong> - does optimization actually help?</li>
</ol>

<blockquote>
  <p><strong>This framework works for any problem domain.</strong></p>
</blockquote>`
    },

    // SECTION 6: Mastery Check
    {
      type: 'quiz' as const,
      id: 'mastery-complexity-analysis',
      title: 'Mastery: Complexity Analysis',
      metadata: { failureCategory: 'complexity-analysis' },
      questions: [
        {
          id: 'q1',
          question: 'What is the time complexity of this function?\n```python\ndef process_data(items):\n    seen = []\n    for item in items:\n        if item not in seen:\n            seen.append(item)\n    return seen\n```',
          options: [
            'O(n) - Single loop',
            'O(n²) - List lookup inside loop',
            'O(n log n) - Sorting implied',
            'O(1) - Constant operations'
          ],
          correctAnswer: 1,
          explanation: 'The `in` operator on a list scans all elements (O(n)). Inside a loop of size n, this becomes O(n) * O(n) = O(n²). Using a set would make this O(n).'
        },
        {
          id: 'q2',
          question: 'Which operation creates a new O(n) copy of string data?',
          options: [
            's[i] (Access)',
            'len(s) (Length)',
            's += "a" (Concatenation)',
            's.upper() (Case conversion)'
          ],
          correctAnswer: 2,
          explanation: 'String concatenation (`+=`) creates a completely new string object, copying all characters. Modifications like `.upper()` also create copies, but `+=` in a loop is the most common O(n²) trap.'
        },
        {
          id: 'q3',
          question: 'What is the bottleneck in this recursive function?\n```python\ndef collect(node):\n    if not node: return []\n    left = collect(node.left)\n    right = collect(node.right)\n    return [node.val] + left + right\n```',
          options: [
            'Traversal depth',
            'Node access',
            'List concatenation (+)',
            'Stack overflow'
          ],
          correctAnswer: 2,
          explanation: '`[node.val] + left + right` creates a NEW list at every node, copying all elements from children. This turns a linear traversal into O(n²) or worse depending on tree structure.'
        },
        {
          id: 'q4',
          question: 'You search for a target value in a sorted list using `target in arr`. complexity?',
          options: [
            'O(log n) - It uses binary search automatically',
            'O(n) - It scans element by element',
            'O(1) - Python lists are optimized',
            'O(n log n) - It sorts then searches'
          ],
          correctAnswer: 1,
          explanation: 'The `in` operator on a list ALWAYS performs a linear scan O(n), even if the list is sorted. You must explicitly write a binary search or use `bisect` module to get O(log n).'
        },
        {
          id: 'q5',
          question: 'What is the space complexity of this recursive function?\n```python\ndef factorial(n):\n    if n <= 1: return 1\n    return n * factorial(n - 1)\n```',
          options: [
            'O(1) - No extra data structures',
            'O(n) - Call stack depth',
            'O(n²) - Redundant calculations',
            'O(log n) - Number of bits'
          ],
          correctAnswer: 1,
          explanation: 'Recursion uses the call stack. `factorial(n)` goes n calls deep before returning. Therefore, the space complexity is O(n).'
        }
      ],
      passingScore: 80,
      requiredForProgress: true,
      timeLimit: 300
    },

    // SECTION 8: Module Completion
    {
      type: 'reading' as const,
      id: 'module-completion',
      title: 'Module Complete',
      estimatedReadTime: 300,
      autoMarkComplete: false,
      content: `<h1>Module 1 Complete</h1>

<p>You have established the foundation for complexity analysis.</p>

<hr />

<h2>Skills Acquired</h2>

<h3>Complexity Recognition</h3>
<ul>
  <li>Identification of O(1), O(n), O(n²), and O(log n) patterns.</li>
  <li>Analysis of loops, recursion, and nested structures.</li>
</ul>

<h3>Bottleneck Identification</h3>
<ul>
  <li>Locating high-complexity operations.</li>
  <li>Understanding hidden costs (string concatenation, slicing).</li>
</ul>

<h3>Optimization Strategy</h3>
<ul>
  <li>Brute Force → Analyze → Optimize framework.</li>
  <li>Applied tradeoff analysis (Time vs Space).</li>
</ul>

<hr />

<h2>Next Steps</h2>

<p>You are now ready to apply these analysis skills to specific data structures.</p>

<p><strong>Next Module:</strong> Array Iteration Patterns</p>`
    }
  ]
};
