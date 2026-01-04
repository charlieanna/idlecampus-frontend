import { ProgressiveLesson, LessonSection } from '../types/progressive-lesson-enhanced';
import { module00b_PythonAlgorithmicLessonSmartPracticeExercises } from './exercises/modulePythonAlgorithmicLessonSmartPracticeExercises';

export const module00b_PythonAlgorithmicLesson: ProgressiveLesson = {
  id: 'python-algorithmic-thinking',
  title: 'Module: Python for Algorithmic Thinking',
  description: 'Bridge the gap between syntax and algorithms. Master Dictionaries, Sets, and the Collections module.',
  unlockMode: 'sequential',
  sections: [
    // ========================================
    // SECTION 1: Dictionaries
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
    // SECTION 2: Sets
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

### 1. Remove Duplicates
\`\`\`python
arr = [1, 2, 2, 3, 3, 3]
unique = list(set(arr))  # [1, 2, 3]
\`\`\`

### 2. Fast Lookup
\`\`\`python
# Check if element was seen - O(1)
seen = set()
for num in arr:
    if num in seen:
        print("Duplicate!")
    seen.add(num)
\`\`\`

---

## Key Points

- Sets store **unique** elements only
- O(1) for add, remove, and membership check
- Sets are **unordered**
- Use \`set()\` not \`{}\` for empty set`,
      estimatedReadTime: 150
    },// ========================================
    // SECTION 3: Collections Module
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
    // SECTION 4: Mastery Check
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
  <li><strong>Module 1</strong>: Time Complexity Foundations</li>
  <li><strong>Module 2</strong>: Array Iteration</li>
  <li><strong>Module 3</strong>: Hash Maps & Sets</li>
</ul>

<hr />

<h2>Next Steps</h2>

<p>Click <strong>"Next Module"</strong> to start <strong>Module 1: Time Complexity Foundations</strong>!</p>`,
      estimatedReadTime: 120
    },
    ...module00b_PythonAlgorithmicLessonSmartPracticeExercises,
  ].filter(Boolean) as LessonSection[],
};
