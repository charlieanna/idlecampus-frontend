import { ProgressiveLesson, LessonSection } from '../types/progressive-lesson-enhanced';
import { module0_5PythonBasicsLessonSmartPracticeExercises } from './exercises/modulePythonBasicsLessonSmartPracticeExercises';

export const module0_5PythonBasicsLesson: ProgressiveLesson = {
  id: 'python-basics-fundamentals',
  title: 'Module: Python Basics',
  description: 'Master Python fundamentals needed for DSA: lists, dicts, sets, loops, and the collections module',
  unlockMode: 'sequential',
  sections: [
    // ========================================
    // SECTION 1: Lists
    // ========================================
    {
      type: 'reading',
      id: 'lists-basics',
      title: 'Lists - Python\'s Dynamic Arrays',
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

<h2>Fast Operations: Access &amp; Stacks (O(1))</h2>

<p>The most efficient way to use a list is as a <strong>Stack</strong> (add/remove from end) or for direct access.</p>

<h3>1. Direct Access - O(1)</h3>
<p>Get any element instantly if you know the index.</p>

<pre><code>arr = [10, 20, 30, 40]

first = arr[0]   # 10
last  = arr[-1]  # 40 (Python wrapper for last index)</code></pre>

<h3>2. The Stack Pattern - O(1)</h3>
<p>Adding and removing from the <strong>end</strong> is very fast.</p>

<pre><code>stack = []

# PUSH: Add to end
stack.append(1)  # [1]
stack.append(2)  # [1, 2]

# POP: Remove from end
last = stack.pop()  # Returns 2, stack is [1]</code></pre>

<blockquote>
  <p><strong>Key Rule:</strong> As long as you only touch the <strong>end</strong> of the list, operations are <strong>O(1)</strong>.</p>
</blockquote>

<hr />

<h2>Slicing (Ranges)</h2>

<p>Creates a <strong>new</strong> list from a range.</p>

<pre><code>arr = [0, 1, 2, 3, 4]
sub = arr[1:4]  # [1, 2, 3] (start inclusive, end exclusive)</code></pre>

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
  <p><code>insert</code>, <code>remove</code>, <code>del</code>, and <code>pop(0)</code> exist, but they are <strong>O(n)</strong> operations. You will learn <em>why</em> in the <strong>Time Complexity</strong> module. Until then, <strong>do not use them in solutions</strong>.</p>
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

<h2>The Problem: Lists Are Objects</h2>

<p>In Python, a variable holding a list doesn't contain the list itself - it contains a <strong>reference</strong> (pointer) to the list.</p>

<pre><code>a = [1, 2, 3]   # 'a' points to a list object
b = a           # 'b' points to the SAME list object!

b.append(4)
print(a)  # [1, 2, 3, 4]  ← Wait, we modified 'b'!
print(b)  # [1, 2, 3, 4]</code></pre>

<p><strong>Both <code>a</code> and <code>b</code> point to the same list!</strong></p>

<hr />

<h2>Memory Diagram</h2>

<pre><code>a ──┐
    ├──► [1, 2, 3, 4]  ← ONE list object in memory
b ──┘</code></pre>

<p>Modifying through <code>b</code> also modifies what <code>a</code> sees!</p>

<hr />

<h2>The Fix: Create a Copy</h2>

<p>Use any of these to create an <strong>independent copy</strong>:</p>

<pre><code>a = [1, 2, 3]

# Method 1: Slice (most common)
b = a[:]

# Method 2: list() constructor
b = list(a)

# Method 3: .copy() method
b = a.copy()</code></pre>

<p>Now modifying <code>b</code> doesn't affect <code>a</code>:</p>

<pre><code>a = [1, 2, 3]
b = a[:]       # Copy!

b.append(4)
print(a)  # [1, 2, 3]    ← Unchanged!
print(b)  # [1, 2, 3, 4]</code></pre>

<hr />

<h2>Memory Diagram (After Copy)</h2>

<pre><code>a ──► [1, 2, 3]      ← Original list

b ──► [1, 2, 3, 4]   ← Separate copy</code></pre>

<p>Two independent objects!</p>

<hr />

<h2>Common Bug: Storing References in Results</h2>

<pre><code>result = []
path = []

path.append(1)
result.append(path)   # Stores reference!

path.append(2)
result.append(path)   # Same reference again!

print(result)  # [[1, 2], [1, 2]] ← Both are the same list!</code></pre>

<p><strong>Fix:</strong></p>

<pre><code>result = []
path = []

path.append(1)
result.append(path[:])  # Store a copy!

path.append(2)
result.append(path[:])  # Store a copy!

print(result)  # [[1], [1, 2]] ← Correct!</code></pre>

<hr />

<h2>Why This Matters</h2>

<p>This is <strong>critical</strong> for:</p>
<ul>
  <li><strong>Recursion</strong> - building and saving paths</li>
  <li><strong>Backtracking</strong> - storing multiple solutions</li>
  <li><strong>Dynamic Programming</strong> - caching state</li>
</ul>

<blockquote>
  <p><strong>Rule</strong>: When storing a list for later, ask: "Do I need a copy?"</p>
  <p>If you'll keep modifying the original → <strong>make a copy!</strong></p>
</blockquote>`,
      estimatedReadTime: 180
    },



    // Exercise 7: Find Maximum
    ,// ========================================
    // SECTION 2: Strings
    // ========================================
    {
      type: 'reading',
      id: 'strings-basics',
      title: 'Strings - Text Manipulation',
      content: `<h1>Python Strings 📝</h1>

<p>Strings are immutable sequences of characters. Critical for many DSA problems!</p>

<hr />

<h2>Creating Strings</h2>

<pre><code># Single or double quotes
s1 = 'hello'
s2 = "world"

# Multi-line
s3 = """Multiple
lines"""</code></pre>

<hr />

<h2>Accessing Characters</h2>

<pre><code>s = "hello"

# Indexing - O(1)
first = s[0]    # 'h'
last = s[-1]    # 'o'

# Slicing - O(k) for slice of size k
sub = s[1:4]    # 'ell'
reverse = s[::-1]  # 'olleh'</code></pre>

<hr />

<h2>Common String Methods</h2>

<pre><code>s = "  Hello World  "

# Split and join - O(n)
words = s.split()  # ['Hello', 'World']
joined = " ".join(words)  # "Hello World"

# Strip whitespace - O(n)
clean = s.strip()  # "Hello World"

# Replace - O(n)
s.replace("World", "Python")  # "Hello Python"

# Case conversion - O(n)
s.upper()    # "  HELLO WORLD  "
s.lower()    # "  hello world  "</code></pre>

<hr />

<h2>Character Checks</h2>

<pre><code>char = 'A'

char.isalpha()   # True (is letter)
char.isdigit()   # False (is digit)
char.isalnum()   # True (letter or digit)
char.islower()   # False
char.isupper()   # True</code></pre>

<hr />

<h2>Building Strings</h2>

<pre><code># SLOW - O(n²) due to immutability
result = ""
for char in "hello":
    result += char  # Creates new string each time!

# FAST - O(n) with list + join
chars = []
for char in "hello":
    chars.append(char)
result = "".join(chars)</code></pre>

<hr />

<h2>Key Points</h2>

<ul>
  <li>Strings are <strong>immutable</strong> (cannot change in-place)</li>
  <li>Use <code>split()</code> and <code>join()</code> for word manipulation</li>
  <li>Use <code>isalpha()</code>, <code>isdigit()</code>, <code>isalnum()</code> for character checks</li>
  <li>Build strings with list + join for O(n) instead of += for O(n²)</li>
</ul>`,
      estimatedReadTime: 180
    },

    // MICRO-DRILL: Count Vowels (string iteration with condition)
    ,// APPLIED PROBLEM: Valid Palindrome
    ,// ========================================
    // SECTION 3: Dictionaries
    // ========================================
    {
      type: 'reading',
      id: 'dict-basics',
      title: 'Dictionaries - Hash Maps',
      content: `<h1>Python Dictionaries 🗂️</h1>

<p>Dictionaries store key-value pairs. They're Python's built-in hash map!</p>

<hr />

<h2>Creating Dictionaries</h2>

<pre><code># Empty dict
d = {}

# With values
ages = {"Alice": 25, "Bob": 30}

# Using dict()
scores = dict(math=95, english=88)</code></pre>

<hr />

<h2>Common Operations</h2>

<pre><code>d = {"a": 1, "b": 2}

# Access value - O(1)
val = d["a"]  # 1

# Safe access with get()
val = d.get("c", 0)  # Returns 0 if "c" doesn't exist

# Add/update - O(1)
d["c"] = 3  # {"a": 1, "b": 2, "c": 3}

# Check if key exists
if "a" in d:
    print("Found!")

# Delete key
del d["a"]  # {"b": 2, "c": 3}

# Iterate
for key in d:
    print(key, d[key])

for key, value in d.items():
    print(key, value)</code></pre>

<hr />

<h2>Common Pattern: Frequency Counting</h2>

<pre><code>text = "hello"
freq = {}

for char in text:
    if char not in freq:
        freq[char] = 0
    freq[char] += 1

# Result: {"h": 1, "e": 1, "l": 2, "o": 1}</code></pre>

<hr />

<h2>Key Points</h2>

<ul>
  <li>Use <code>get(key, default)</code> to avoid KeyError</li>
  <li>Use <code>in</code> to check if key exists</li>
  <li>Dictionaries are <strong>unordered</strong> (before Python 3.7) or insertion-ordered (3.7+)</li>
  <li>O(1) average time for get/set</li>
</ul>`,
      estimatedReadTime: 180
    },

    // APPLIED PROBLEM: Valid Anagram
    ,// ========================================
    // SECTION 4: Sets
    // ========================================
    {
      type: 'reading',
      id: 'sets-basics',
      title: 'Sets - Unique Elements',
      content: `<h1>Python Sets</h1>

<p>Sets store <strong>unique</strong> elements. Perfect for removing duplicates and fast lookups!</p>

<hr />

<h2>Creating Sets</h2>

<pre><code># Empty set (NOTE: {} creates a dict!)
s = set()

# With values
numbers = {1, 2, 3, 4, 5}
unique = set([1, 2, 2, 3, 3, 3])  # {1, 2, 3}</code></pre>

<hr />

<h2>Common Operations</h2>

<pre><code>s = {1, 2, 3}

# Add element - O(1)
s.add(4)  # {1, 2, 3, 4}

# Remove element - O(1)
s.remove(2)  # {1, 3, 4}

# Check membership - O(1)
if 3 in s:
    print("Found!")

# Union (combine)
a = {1, 2, 3}
b = {3, 4, 5}
a | b  # {1, 2, 3, 4, 5}

# Intersection (common)
a &amp; b  # {3}

# Difference
a - b  # {1, 2}</code></pre>

<hr />

<h2>Common Use Cases</h2>

<h3>1. Remove Duplicates</h3>
<pre><code>arr = [1, 2, 2, 3, 3, 3]
unique = list(set(arr))  # [1, 2, 3]</code></pre>

<h3>2. Fast Lookup</h3>
<pre><code># Check if element was seen - O(1)
seen = set()
for num in arr:
    if num in seen:
        print("Duplicate!")
    seen.add(num)</code></pre>

<hr />

<h2>Key Points</h2>

<ul>
  <li>Sets store <strong>unique</strong> elements only</li>
  <li>O(1) for add, remove, and membership check</li>
  <li>Sets are <strong>unordered</strong></li>
  <li>Use <code>set()</code> not <code>{}</code> for empty set</li>
</ul>`,
      estimatedReadTime: 150
    },// ========================================
    // SECTION 5: Loops
    // ========================================
    {
      type: 'reading',
      id: 'loops-basics',
      title: 'Loops - Iteration Fundamentals',
      content: `<h1>Python Loops 🔄</h1>

<p>Loops let you repeat operations. Essential for traversing arrays and strings!</p>

<hr />

<h2>For Loops</h2>

<h3>Loop over range</h3>
<pre><code>for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

for i in range(1, 6):
    print(i)  # 1, 2, 3, 4, 5

for i in range(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8 (step by 2)</code></pre>

<h3>Loop over list</h3>
<pre><code>arr = ["a", "b", "c"]

# Get values
for item in arr:
    print(item)  # a, b, c

# Get index and value
for i, item in enumerate(arr):
    print(i, item)  # 0 a, 1 b, 2 c</code></pre>

<h3>Loop over dictionary</h3>
<pre><code>d = {"a": 1, "b": 2}

# Keys only
for key in d:
    print(key)

# Keys and values
for key, value in d.items():
    print(key, value)</code></pre>

<hr />

<h2>While Loops</h2>

<pre><code>i = 0
while i &lt; 5:
    print(i)
    i += 1</code></pre>

<hr />

<h2>Nested Loops</h2>

<pre><code># 2D array traversal
matrix = [
    [1, 2, 3],
    [4, 5, 6]
]

for row in range(len(matrix)):
    for col in range(len(matrix[row])):
        print(matrix[row][col])</code></pre>

<hr />

<h2>Key Points</h2>

<ul>
  <li><code>for</code> loops for known iterations</li>
  <li><code>while</code> loops for conditions</li>
  <li><code>enumerate()</code> for index + value</li>
  <li>Nested loops for 2D structures</li>
</ul>`,
      estimatedReadTime: 180
    },// EXERCISE: While Loop Patterns
    ,// EXERCISE: List Comprehensions
    ,// ========================================
    // SECTION 6: Tuples & Unpacking
    // ========================================
    {
      type: 'reading',
      id: 'tuples-basics',
      title: 'Tuples - Immutable Sequences',
      content: `<h1>Python Tuples 📦</h1>

<p>Tuples are <strong>immutable</strong> ordered collections. Once created, they cannot be modified.</p>

<hr />

<h2>Creating Tuples</h2>

<pre><code># With parentheses
point = (3, 4)

# Without parentheses (tuple packing)
coords = 10, 20, 30

# Single element tuple (note the comma!)
single = (42,)

# Empty tuple
empty = ()</code></pre>

<hr />

<h2>Tuple vs List: When to Use Which?</h2>

<table>
  <thead>
    <tr><th>Feature</th><th>List</th><th>Tuple</th></tr>
  </thead>
  <tbody>
    <tr><td>Mutable</td><td>Yes</td><td>No</td></tr>
    <tr><td>As dict key</td><td>No</td><td>Yes</td></tr>
    <tr><td>Performance</td><td>Slower</td><td>Faster</td></tr>
    <tr><td>Use case</td><td>Collections that change</td><td>Fixed data</td></tr>
  </tbody>
</table>

<pre><code># Tuples can be dict keys (lists cannot!)
locations = {
    (0, 0): "origin",
    (1, 2): "point A"
}</code></pre>

<hr />

<h2>Unpacking - Super Useful!</h2>

<pre><code># Basic unpacking
point = (3, 4)
x, y = point
# x = 3, y = 4

# Swapping values (no temp variable!)
a, b = 1, 2
a, b = b, a
# Now a = 2, b = 1

# Multiple return values
def get_stats(numbers):
    return min(numbers), max(numbers)

low, high = get_stats([5, 2, 8, 1])
# low = 1, high = 8</code></pre>

<hr />

<h2>Key Points</h2>

<ul>
  <li>Use tuples for fixed data (coordinates, RGB colors)</li>
  <li>Unpacking: <code>a, b = b, a</code> for swapping</li>
  <li>Tuples can be dictionary keys</li>
  <li>Remember the comma for single-element tuples: <code>(42,)</code></li>
</ul>`,
      estimatedReadTime: 120
    },

    // EXERCISE: Tuple Unpacking
    ,// ========================================
    // SECTION 7: Functions
    // ========================================
    {
      type: 'reading',
      id: 'functions-basics',
      title: 'Functions Basics',
      content: `<h1>Functions in Python 🔧</h1>

<p>Functions are reusable blocks of code. Essential for clean, organized solutions.</p>

<hr />

<h2>Defining Functions</h2>

<pre><code># Basic function
def greet(name):
    return f"Hello, {name}!"

# With default parameter
def greet(name="World"):
    return f"Hello, {name}!"

# Multiple parameters
def add(a, b):
    return a + b</code></pre>

<hr />

<h2>Key Points</h2>

<ul>
  <li>Functions help organize code into reusable blocks</li>
  <li>Use <code>def</code> keyword to define them</li>
  <li><code>return</code> sends a value back (ends function)</li>
  <li>Default parameters are useful for optional arguments</li>
</ul>`,
      estimatedReadTime: 120
    },

    // ========================================
    // SECTION 8: Collections Module
    // ========================================
    {
      type: 'reading',
      id: 'collections-module',
      title: 'Collections - Powerful Tools',
      content: `<h1>Collections Module 📚</h1>

<p>Python's <code>collections</code> module provides specialized data structures that make coding DSA problems much easier!</p>

<hr />

<h2>1. defaultdict - Auto-Initializing Dict</h2>

<p><strong>Problem with regular dict:</strong></p>
<pre><code>freq = {}
freq["a"] += 1  # KeyError!</code></pre>

<p><strong>Solution with defaultdict:</strong></p>
<pre><code>from collections import defaultdict

freq = defaultdict(int)  # Default value is 0
freq["a"] += 1  # Works! No error
print(freq["a"])  # 1</code></pre>

<p><strong>Common uses:</strong></p>
<pre><code># Frequency counting
freq = defaultdict(int)
for char in "hello":
    freq[char] += 1

# Graph adjacency list
graph = defaultdict(list)
graph[1].append(2)  # No need to initialize!
graph[1].append(3)</code></pre>

<hr />

<h2>2. Counter - Easy Frequency Counting</h2>

<pre><code>from collections import Counter

# Count frequencies
freq = Counter("hello")
print(freq)  # Counter({'l': 2, 'h': 1, 'e': 1, 'o': 1})

# Most common
freq.most_common(2)  # [('l', 2), ('h', 1)]

# Works with any iterable
nums = [1, 2, 2, 3, 3, 3]
Counter(nums)  # Counter({3: 3, 2: 2, 1: 1})</code></pre>

<hr />

<h2>3. deque - Double-Ended Queue</h2>

<pre><code>from collections import deque

# Create queue
q = deque([1, 2, 3])

# Add to right (end) - O(1)
q.append(4)  # deque([1, 2, 3, 4])

# Add to left (front) - O(1)
q.appendleft(0)  # deque([0, 1, 2, 3, 4])

# Remove from right - O(1)
q.pop()  # Returns 4

# Remove from left - O(1)
q.popleft()  # Returns 0</code></pre>

<p><strong>Why deque?</strong> Lists are slow for <code>pop(0)</code> - O(n). deque's <code>popleft()</code> is O(1)!</p>

<hr />

<h2>Key Points</h2>

<ul>
  <li><strong>defaultdict</strong> - No more KeyError when initializing</li>
  <li><strong>Counter</strong> - Fastest way to count frequencies</li>
  <li><strong>deque</strong> - Efficient queue operations at both ends</li>
  <li>These save you 5-10 lines of code per problem!</li>
</ul>`,
      estimatedReadTime: 240
    },// ========================================
    // SECTION 9: Mastery Check
    // ========================================
    {
      type: 'reading',
      id: 'why-snapshot-lists',
      title: 'Context: Why This Matters',
      content: `<h3>Why This Problem Exists</h3>

<p>When building results step by step (like paths, prefixes, or combinations), Python lists can silently betray you if you store references instead of copies.</p>

<p>Many bugs in backtracking and DP come from this exact mistake.</p>

<p>This problem checks whether you understand:</p>
<ul>
  <li>lists are mutable</li>
  <li>variables store references</li>
  <li>you must copy when saving intermediate states</li>
</ul>`,
      estimatedReadTime: 60
    },{
      type: 'reading',
      id: 'why-first-unique',
      title: 'Context: Why This Matters',
      content: `<h3>Why This Problem Exists</h3>

<p>Counting alone is not enough.</p>

<p>In many problems, <strong>order matters</strong>, but counting destroys order. To recover order, you must loop over the original input again.</p>

<p>This problem checks whether you understand:</p>
<ul>
  <li>frequency counting</li>
  <li>why order matters</li>
  <li>why two passes are sometimes necessary</li>
</ul>`,
      estimatedReadTime: 60
    },{
      type: 'reading',
      id: 'why-first-drop',
      title: 'Context: Why This Matters',
      content: `<h3>Why This Problem Exists</h3>

<p>Many bugs come from incorrect loop boundaries. This problem tests whether you can reason about index relationships safely.</p>`,
      estimatedReadTime: 60
    },// ========================================
    // FINAL SECTION: Summary
    // ========================================
    {
      type: 'reading',
      id: 'python-basics-summary',
      title: 'Summary - You\'re Ready!',
      content: `<h1>Python Basics - Complete!</h1>

<p>You now have the Python fundamentals required for subsequent DSA modules.</p>

<hr />

<h2>What You Learned</h2>

<h3>Core Data Structures</h3>
<ul>
  <li><strong>Lists</strong>: append, pop, slicing, comprehensions</li>
  <li><strong>Dicts</strong>: get, set, items, frequency counting</li>
  <li><strong>Sets</strong>: uniqueness, fast lookups, intersections</li>
</ul>

<h3>Control Flow</h3>
<ul>
  <li><strong>For loops</strong>: range, enumerate, iterating</li>
  <li><strong>While loops</strong>: condition-based iteration</li>
  <li><strong>Nested loops</strong>: 2D array traversal</li>
</ul>

<h3>Collections Module</h3>
<ul>
  <li><strong>defaultdict</strong>: Auto-initializing dicts</li>
  <li><strong>Counter</strong>: Easy frequency counting</li>
  <li><strong>deque</strong>: Efficient double-ended queue</li>
</ul>

<h3>Common Patterns</h3>
<ul>
  <li><strong>Hash Maps</strong>: O(1) lookups for pairs/frequencies</li>
</ul>

<hr />

<h2>You're Now Ready For:</h2>

<ul>
  <li><strong>Module 1</strong>: Array Iteration</li>
  <li><strong>Module 2</strong>: Hash Maps &amp; Sets</li>
  <li><strong>Module 3</strong>: Bit Manipulation</li>
</ul>

<hr />

<h2>Next Steps</h2>

<p>Click <strong>"Next Module"</strong> to start <strong>Module 1: Time Complexity Foundations</strong>!</p>`,
      estimatedReadTime: 120
    },
    ...module0_5PythonBasicsLessonSmartPracticeExercises,
  ].filter(Boolean) as LessonSection[],
};
