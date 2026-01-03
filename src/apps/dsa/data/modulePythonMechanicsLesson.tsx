import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { module00a_PythonMechanicsLessonSmartPracticeExercises } from './exercises/modulePythonMechanicsLessonSmartPracticeExercises';

export const module00a_PythonMechanicsLesson: ProgressiveLesson = {
  id: 'python-mechanics',
  title: 'Module: Python Mechanics',
  description: 'Master the fundamentals: Lists, Loops, Strings, and Reference Semantics.',
  unlockMode: 'sequential',
  sections: [
    // ========================================
    // SECTION 1: Lists & Mutability
    // ========================================
    {
      type: 'reading',
      id: 'list-basics',
      title: 'Lists - The Workhorse',
      content: `<h1>Python Lists 📝</h1>

<p>Lists are ordered, mutable collections. They are Python's version of Arrays, but simpler.</p>

<hr />

<h2>Creating Lists</h2>

<pre><code># Empty list
arr = []

# With values
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", True]</code></pre>

<hr />

<h2>Common Operations</h2>

<pre><code>arr = [10, 20, 30]

# Access - O(1)
print(arr[0])  # 10
print(arr[-1]) # 30 (Last element)

# Append - O(1)
arr.append(40) # [10, 20, 30, 40]

# Pop - O(1) from end
last = arr.pop() # Returns 40, arr is [10, 20, 30]

# Length - O(1)
n = len(arr)   # 3</code></pre>

<hr />

<h2>Key Points</h2>

<ul>
  <li>Use <code>append()</code> to push to end</li>
  <li>Use <code>pop()</code> to remove from end</li>
  <li>Lists are <strong>0-indexed</strong></li>
  <li><strong>Slicing</strong> creates a copy</li>
</ul>

<blockquote>
  <p>⚠️ <strong>Do Not Use (Yet)</strong></p>
  <p><code>insert</code>, <code>remove</code>, <code>del</code>, and <code>pop(0)</code> exist, but they are <strong>O(n)</strong> operations.</p>
  <p>You will learn <em>why</em> in the <strong>Time Complexity</strong> module.</p>
  <p>Until then, <strong>do not use them in solutions</strong>.</p>
</blockquote>`,
      estimatedReadTime: 120
    },

    // CRITICAL: List References vs Copies
    {
      type: 'reading',
      id: 'list-references-vs-copies',
      title: 'List References vs Copies (Critical)',
      content: `<h1>List References vs Copies (Critical)</h1>

<p>This is one of the <strong>most common sources of bugs</strong> in Python! Let's understand it.</p>

<hr />

<h2>Variables are References/Pointers</h2>

<pre><code>a = [1, 2, 3]
b = a  # b points to the SAME list as a

b.append(4)

print(a) # [1, 2, 3, 4] -> CHANGED!
print(b) # [1, 2, 3, 4]</code></pre>

<p>Because lists are <strong>mutable</strong>, changing <code>b</code> changes the underlying object that <code>a</code> also points to.</p>

<hr />

<h2>How to Copy?</h2>

<p>To create a new, independent list, you must make a <strong>copy</strong>.</p>

<pre><code>a = [1, 2, 3]
b = a[:]  # Slicing creates a NEW list copy

b.append(4)

print(a) # [1, 2, 3] -> Safe!
print(b) # [1, 2, 3, 4]</code></pre>

<hr />

<h2>Visual Metaphor</h2>

<ul>
  <li><strong>Reference (<code>b = a</code>):</strong> You give someone your house key. If they paint the walls, your walls change too.</li>
  <li><strong>Copy (<code>b = a[:]</code>):</strong> You build a replica house next door. Painting the replica doesn't affect the original.</li>
</ul>

<blockquote>
  <p><strong>Rule:</strong> If you need to modify a list but keep the original version for later (e.g., backtracking), <strong>make a copy!</strong></p>
</blockquote>`,
      estimatedReadTime: 180
    },// ========================================
    // SECTION 2: Iteration & Control Flow
    // ========================================
    {
      type: 'reading',
      id: 'loops-iterators',
      title: 'Loops & Iterators',
      content: `<h1>Python Loops 🔄</h1>

<p>Python's <code>for</code> loop is a "for-each" loop. It iterates over elements directly.</p>

<hr />

<h2>1. Loop over Elements (Standard)</h2>
<pre><code>nums = [10, 20, 30]
for x in nums:
    print(x)
# Prints 10, 20, 30</code></pre>

<hr />

<h2>2. Loop over Indices (With Range)</h2>
<p>Use <code>range(n)</code> to generate numbers 0 to n-1.</p>

<pre><code># len(nums) is 3 -> range(3) -> 0, 1, 2
for i in range(len(nums)):
    print(i, nums[i])</code></pre>

<hr />

<h2>3. Loop over Both (Enumerate)</h2>
<p>Best of both worlds!</p>

<pre><code>for i, x in enumerate(nums):
    print(f"Index {i} has value {x}")</code></pre>

<hr />

<h2>While Loops</h2>
<p>Use when you don't know how many iterations strictly, or adjusting index manually.</p>

<pre><code>i = 0
while i &lt; len(nums):
    print(nums[i])
    i += 1</code></pre>

<blockquote>
  <p><strong>Pro Tip:</strong> Prefer <code>for x in nums</code> whenever possible. It's cleaner. Use <code>while</code> only when you need to manipulate the index loop yourself!</p>
</blockquote>`,
      estimatedReadTime: 120
    },
    // ========================================
    // SECTION 2.5: Loop Math & Boundaries (New Drill)
    // ========================================
    {
      type: 'reading',
      id: 'loop-boundaries-drill',
      title: 'Drill: Loop Math & Boundaries',
      content: `<h1>Loop Math & Boundaries 📐</h1>

<p>Off-by-one errors are the most common bug in interviews. Let's fix that forever with <strong>immediate practice</strong>.</p>

<hr />

<h2>The Range Function</h2>
<p><code>range(start, stop, step)</code></p>
<ul>
  <li><strong>Start</strong>: Inclusive (default 0)</li>
  <li><strong>Stop</strong>: Exclusive (Up to, but not including)</li>
  <li><strong>Step</strong>: Increment (default 1)</li>
</ul>

<pre><code>range(5)        # 0, 1, 2, 3, 4
range(2, 6)     # 2, 3, 4, 5
range(5, 0, -1) # 5, 4, 3, 2, 1 (Reverse!)</code></pre>

<hr />

<h2>The Sliding Window Formula</h2>
<p>In many array problems, you need to iterate up to a certain point <code>k</code> from the end.</p>
<p><strong>Formula:</strong> <code>n - k + 1</code></p>
<ul>
  <li>If you have <code>n</code> items and a window of size <code>k</code>.</li>
  <li>The last window starts at index <code>n - k</code>.</li>
  <li>So you loop <code>range(n - k + 1)</code>.</li>
</ul>

<hr />

<h3>Drill Time!</h3>
<p>Complete the inline exercises below to build muscle memory.</p>`,
      estimatedReadTime: 120,
      inlineExercises: [
        {
          id: 'drill-range-basic',
          starterCode: `def solve():
    # Print numbers 5 to 9 (inclusive)
    # expected output:
    # 5
    # 6
    # 7
    # 8
    # 9
    for i in range(0): # FIX THIS LINE
        print(i)

solve()`,
          solution: `def solve():
    for i in range(5, 10):
        print(i)

solve()`,
          testCases: [
            {
              input: '',
              expectedOutput: '5\n6\n7\n8\n9'
            }
          ],
          targetFunction: 'solve', // Optional, but good for test harness to know entry point
          successMessage: 'Perfect! range(5, 10) gives 5..9'
        },
        {
          id: 'drill-range-reverse',
          starterCode: `def solve():
    # Print numbers 5 down to 1 (inclusive)
    # expected output:
    # 5
    # 4
    # 3
    # 2
    # 1
    for i in range(0): # FIX THIS LINE
        print(i)

solve()`,
          solution: `def solve():
    for i in range(5, 0, -1):
        print(i)

solve()`,
          testCases: [
            {
              input: '',
              expectedOutput: '5\n4\n3\n2\n1'
            }
          ],
          targetFunction: 'solve',
          successMessage: 'Great! Negative step -1 goes backwards.'
        },
        {
          id: 'drill-sliding-window-boundary',
          starterCode: `def solve():
    nums = [10, 20, 30, 40, 50, 60]
    k = 3
    n = len(nums)
    
    # We want to print starting indices of all windows of size k
    # Windows: [10,20,30], [20,30,40], [30,40,50], [40,50,60]
    # Indices: 0, 1, 2, 3
    
    # Use the formula: range(n - k + 1)
    
    for i in range(0): # FIX THIS LINE
        print(i)

solve()`,
          solution: `def solve():
    nums = [10, 20, 30, 40, 50, 60]
    k = 3
    n = len(nums)
    for i in range(n - k + 1):
        print(i)

solve()`,
          testCases: [
            {
              input: '',
              expectedOutput: '0\n1\n2\n3'
            }
          ],
          targetFunction: 'solve',
          successMessage: 'Exactly! range(n - k + 1) hits the last valid window start.'
        }
      ]
    },// ========================================
    // SECTION 3: Strings are Immutable
    // ========================================
    {
      type: 'reading',
      id: 'strings-immutability',
      title: 'Strings - Immutable Sequences',
      content: `<h1>Strings 🧵</h1>

<p>Strings look like lists of characters, but they are <strong>IMMUTABLE</strong>. You cannot change them in place.</p>

<hr />

<h2>Creating & Accessing</h2>
<pre><code>s = "hello"
print(s[0])  # 'h'
print(s[-1]) # 'o'</code></pre>

<hr />

<h2>Immutability TRAP!</h2>
<pre><code>s = "hello"
s[0] = "H"  # TypeError: 'str' object does not support item assignment</code></pre>

<p><strong>Correct way:</strong> Create a NEW string.</p>
<pre><code>s = "H" + s[1:] # "Hello"</code></pre>

<hr />

<h2>Building Strings (Efficiency)</h2>
<p>Repeatedly adding strings with <code>+</code> is slow (O(n²) total).</p>
<p>Use a <strong>list</strong> and join it!</p>

<pre><code># Bad
s = ""
for x in ["a", "b", "c"]:
    s += x

# Good (O(n))
parts = []
for x in ["a", "b", "c"]:
    parts.append(x)
final_s = "".join(parts)</code></pre>

<p>This is how StringBuilder works in other languages. In Python, use list + join.</p>`,
      estimatedReadTime: 120
    },// ========================================
    // SECTION 4: Mastery Check
    // ========================================
    {
      type: 'reading',
      id: 'why-matrix-sum',
      title: 'Context: Why This Matters',
      content: `<h3>Why This Problem Exists</h3>

<p>Nested loops are fundamental for grid/matrix problems (Dynamic Programming, Graph Grids). This checks if you can navigate 2D coordinates correctly.</p>

<p>This problem checks whether you can:</p>
<ul>
  <li>Write a nested loop</li>
  <li>Access 2D array elements <code>grid[r][c]</code></li>
</ul>`,
      estimatedReadTime: 60
    }, {
      type: 'reading',
      id: 'why-palindrome',
      title: 'Context: Why This Matters',
      content: `<h3>Why This Problem Exists</h3>

<p>Two-pointer patterns are essential for array manipulation. This checks if you can coordinate two moving indices.</p>

<p>This problem checks whether you can:</p>
<ul>
  <li>Use while loops with two pointers</li>
  <li>Check conditions at each step</li>
</ul>`,
      estimatedReadTime: 60
    }, {
      type: 'reading',
      id: 'why-find-max',
      title: 'Context: Why This Matters',
      content: `<h3>Why This Problem Exists</h3>

<p>Basic finding patterns. Can you iterate and keep track of state?</p>

<p>This problem checks whether you can:</p>
<ul>
  <li>Initialize variables correctly (handle empty/negative cases)</li>
  <li>Update state based on logic</li>
</ul>`,
      estimatedReadTime: 60
    },// ========================================
    // FINAL SECTION: Summary
    // ========================================
    {
      type: 'reading',
      id: 'python-mechanics-summary',
      title: 'Summary - Mechanics Mastered',
      content: `<h1>Python Mechanics - Check! ✅</h1>

<p>You understand the core machinery of Python.</p>

<hr />

<h2>What You Learned</h2>

<h3>1. Lists are Mutable References</h3>
<ul>
  <li><code>b = a</code> shares memory.</li>
  <li><code>b = a[:]</code> makes a copy.</li>
  <li>Bugs happen when you forget this!</li>
</ul>

<h3>2. Strings are Immutable</h3>
<ul>
  <li>You cannot change <code>s[0]</code>.</li>
  <li>Build new strings using lists + <code>.join()</code>.</li>
</ul>

<h3>3. Iteration</h3>
<ul>
  <li><code>for x in nums</code>: Standard</li>
  <li><code>for i, x in enumerate(nums)</code>: Index + Value</li>
  <li><code>while</code>: Manual control</li>
</ul>

<hr />

<h2>Next Steps</h2>

<p>Now that you know the <strong>mechanics</strong>, let's learn the <strong>algorithms</strong>.</p>
<p>Module 0B will cover Dictionaries, Sets, and how to use Python's superpowers (collections module).</p>

<p>Click <strong>"Next Module"</strong> to start <strong>Module 0B: Python Algorithmics</strong>!</p>`,
      estimatedReadTime: 120
    },
    ...module00a_PythonMechanicsLessonSmartPracticeExercises,
  ]
};
