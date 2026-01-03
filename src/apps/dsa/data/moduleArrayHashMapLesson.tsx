import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { module4ArrayHashMapLessonSmartPracticeExercises } from './exercises/moduleArrayHashMapLessonSmartPracticeExercises';

export const moduleArrayHashMapLesson: ProgressiveLesson = {
  id: 'array-hashmap-patterns',
  title: 'Module: Array & HashMap Patterns',
  description: 'Master fundamental array and hash map patterns: frequency counting, two-pass algorithms, and set operations',
  unlockMode: 'sequential',
  sections: [
    {
      type: 'reading',
      id: 'hashmap-intro',
      title: 'Introduction: The Power of Hash Maps',
      content: `<h1>Hash Maps: O(1) Lookup Magic</h1>
<p>A <strong>hash map</strong> (dictionary in Python) gives you O(1) average-case lookup, insert, and delete. This transforms many O(n²) brute-force solutions into O(n) elegance.</p>
<h2>The Core Trade-off</h2>
<pre><code>Without HashMap:
  "Is x in this list?" → O(n) scan

With HashMap:
  "Is x in this set?" → O(1) lookup
</code></pre>
<p>You trade <strong>space</strong> (storing the hash map) for <strong>time</strong> (faster lookups).</p>
<hr>
<h2>When to Use Hash Maps</h2>
<p>Reach for a hash map when you need to:</p>
<ul>
<li><strong>Count frequencies:</strong> How many times does each element appear?</li>
<li><strong>Check existence:</strong> Have I seen this element before?</li>
<li><strong>Store mappings:</strong> What value is associated with this key?</li>
<li><strong>Find pairs:</strong> Is there another element that complements this one?</li>
<li><strong>Group elements:</strong> Which elements share a property?</li>
</ul>
<h2>Common Patterns</h2>
<table>
<thead>
<tr><th>Pattern</th><th>Use Case</th><th>Example</th></tr>
</thead>
<tbody>
<tr><td><strong>Frequency Count</strong></td><td>Count occurrences</td><td>Find duplicates, mode</td></tr>
<tr><td><strong>Two Sum Pattern</strong></td><td>Find complement</td><td>a + b = target</td></tr>
<tr><td><strong>Seen Set</strong></td><td>Track visited</td><td>First duplicate</td></tr>
<tr><td><strong>Index Map</strong></td><td>Remember positions</td><td>Two Sum with indices</td></tr>
<tr><td><strong>Grouping</strong></td><td>Bucket by key</td><td>Group anagrams</td></tr>
</tbody>
</table>
`,
      estimatedReadTime: 240,
    },
    {
      type: 'reading',
      id: 'frequency-counting',
      title: 'Pattern: Frequency Counting',
      content: `<h1>Frequency Counting</h1>
<p>The most common hash map pattern: count how many times each element appears.</p>
<h2>Basic Template</h2>
<pre><code class="language-python">from collections import Counter

# Method 1: Counter (recommended)
freq = Counter(arr)

# Method 2: Manual counting
freq = {}
for x in arr:
    freq[x] = freq.get(x, 0) + 1
</code></pre>
<h2>Common Applications</h2>
<h3>Find Duplicates</h3>
<pre><code class="language-python">def has_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False
</code></pre>
<h3>Find Majority Element</h3>
<pre><code class="language-python">def majority_element(nums):
    freq = Counter(nums)
    for num, count in freq.items():
        if count > len(nums) // 2:
            return num
</code></pre>
<h3>Check Anagram</h3>
<pre><code class="language-python">def is_anagram(s, t):
    return Counter(s) == Counter(t)
</code></pre>
<hr>
<h2>Key Insight</h2>
<p>Frequency counting converts questions like "how many?" or "which elements?" into O(n) operations instead of repeated O(n) scans.</p>
`,
      estimatedReadTime: 300,
    },
    {
      type: 'reading',
      id: 'two-sum-pattern',
      title: 'Pattern: Two Sum and Complements',
      content: `<h1>The Two Sum Pattern</h1>
<p>One of the most important patterns in coding interviews.</p>
<h2>The Problem</h2>
<p>Given an array and a target, find two elements that sum to target.</p>
<h2>Brute Force: O(n²)</h2>
<pre><code class="language-python">def two_sum_brute(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
</code></pre>
<h2>Hash Map: O(n)</h2>
<pre><code class="language-python">def two_sum(nums, target):
    seen = {}  # value → index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
</code></pre>
<h2>Why It Works</h2>
<p>Instead of asking "is there any j where nums[j] = target - nums[i]?" (O(n) scan), we ask "is target - nums[i] in our hash map?" (O(1) lookup).</p>
<hr>
<h2>Variations</h2>
<ul>
<li><strong>Two Sum II (sorted):</strong> Use two pointers instead</li>
<li><strong>Three Sum:</strong> Fix one element, do two sum on the rest</li>
<li><strong>Four Sum:</strong> Fix two elements, do two sum on the rest</li>
<li><strong>Two Sum - All pairs:</strong> Store indices in a list</li>
</ul>
<p>The complement-checking pattern appears everywhere!</p>
`,
      estimatedReadTime: 300,
    },
    {
      type: 'reading',
      id: 'set-operations',
      title: 'Pattern: Set Operations',
      content: `<h1>Set Operations for Arrays</h1>
<p>Sets provide O(1) membership testing and clean operations for comparing collections.</p>
<h2>Basic Set Operations</h2>
<pre><code class="language-python">a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

# Intersection: elements in both
a & b  # {3, 4}

# Union: elements in either
a | b  # {1, 2, 3, 4, 5, 6}

# Difference: elements in a but not b
a - b  # {1, 2}

# Symmetric Difference: elements in exactly one
a ^ b  # {1, 2, 5, 6}
</code></pre>
<h2>Common Problems</h2>
<h3>Intersection of Two Arrays</h3>
<pre><code class="language-python">def intersection(nums1, nums2):
    return list(set(nums1) & set(nums2))
</code></pre>
<h3>Find Missing Number</h3>
<pre><code class="language-python">def missing_number(nums):
    full = set(range(len(nums) + 1))
    return (full - set(nums)).pop()
</code></pre>
<h3>Contains Duplicate</h3>
<pre><code class="language-python">def contains_duplicate(nums):
    return len(nums) != len(set(nums))
</code></pre>
<hr>
<h2>When to Use Sets vs Hash Maps</h2>
<ul>
<li><strong>Set:</strong> Just need to check existence</li>
<li><strong>Hash Map:</strong> Need to store associated values (counts, indices, etc.)</li>
</ul>
`,
      estimatedReadTime: 240,
    },
    {
      type: 'reading',
      id: 'hashmap-summary',
      title: 'Summary: Hash Map Patterns',
      content: `<h1>Hash Map Pattern Summary</h1>
<h2>Quick Reference</h2>
<table>
<thead>
<tr><th>Pattern</th><th>Data Structure</th><th>Time</th><th>Space</th></tr>
</thead>
<tbody>
<tr><td>Frequency Count</td><td>dict/Counter</td><td>O(n)</td><td>O(k) unique</td></tr>
<tr><td>Two Sum</td><td>dict: val→idx</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>Seen Set</td><td>set</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>Grouping</td><td>defaultdict(list)</td><td>O(n)</td><td>O(n)</td></tr>
</tbody>
</table>
<h2>Interview Tips</h2>
<ol>
<li><strong>Start with brute force:</strong> Explain the O(n²) approach first</li>
<li><strong>Identify the bottleneck:</strong> Usually it's "searching for something"</li>
<li><strong>Apply hash map:</strong> Convert search from O(n) to O(1)</li>
<li><strong>Handle edge cases:</strong> Empty arrays, duplicates, negative numbers</li>
</ol>
<h2>Python Tips</h2>
<pre><code class="language-python">from collections import Counter, defaultdict

# Counter for frequency
Counter([1, 1, 2, 3])  # {1: 2, 2: 1, 3: 1}

# defaultdict for grouping
groups = defaultdict(list)
for item in items:
    groups[key(item)].append(item)

# .get() with default
freq[x] = freq.get(x, 0) + 1
</code></pre>
<p><strong>Now practice with the exercises below!</strong></p>
`,
      estimatedReadTime: 180,
    },

    // SMART PRACTICE EXERCISES - All practice problems for this module
    ...module4ArrayHashMapLessonSmartPracticeExercises,
  ],
};
