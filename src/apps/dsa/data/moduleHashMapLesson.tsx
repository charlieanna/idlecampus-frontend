import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { module2HashMapLessonSmartPracticeExercises } from './exercises/moduleHashMapLessonSmartPracticeExercises';

export const module2HashMapLesson: ProgressiveLesson = {
    id: 'hash-map-fundamentals',
    title: 'Module: Hash Map Fundamentals',
    description: 'Learn to use hash maps to remove nested loops and optimize from O(n²) to O(n)',
    unlockMode: 'sequential',
    sections: [
        {
            type: 'reading',
            id: 'hash-map-intro',
            title: 'Why Hash Maps?',
            estimatedReadTime: 240,
            practiceExercise: {
                title: 'Try It: Count Elements',
                instruction: `# Count Elements in Array

Given an array of integers, count how many times each number appears.

**Examples:**
- \`[1, 2, 2, 3, 1]\` → \`{1: 2, 2: 2, 3: 1}\`
- \`[5, 5, 5]\` → \`{5: 3}\`
- \`[1]\` → \`{1: 1}\`

**Your Task:**
Write a function \`count_elements(arr)\` that returns a dictionary mapping each element to its count.`,
                starterCode: `def count_elements(arr):
    # Your code here
    pass

# Test your solution
print(count_elements([1, 2, 2, 3, 1]))  # Should print {1: 2, 2: 2, 3: 1}
print(count_elements([5, 5, 5]))        # Should print {5: 3}
print(count_elements([1]))               # Should print {1: 1}`,
                testCases: [
                    { input: '[1, 2, 2, 3, 1]', expectedOutput: '{1: 2, 2: 2, 3: 1}' },
                    { input: '[5, 5, 5]', expectedOutput: '{5: 3}' },
                    { input: '[1]', expectedOutput: '{1: 1}' },
                ],
                difficulty: 'easy',
                solution: `def count_elements(arr):
    # Solution: Use dictionary to count occurrences
    counts = {}
    for num in arr:
        # Increment count (default to 0 if not seen)
        counts[num] = counts.get(num, 0) + 1
    return counts

# Test your solution
print(count_elements([1, 2, 2, 3, 1]))  # Should print {1: 2, 2: 2, 3: 1}
print(count_elements([5, 5, 5]))        # Should print {5: 3}
print(count_elements([1]))               # Should print {1: 1}`,
                targetComplexity: {
                    time: 'O(n)',
                    space: 'O(k)',
                    notes: 'Single pass through array; k is number of unique elements (at most n)'
                },
                solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Brute Force (Nested Loops)
For each unique element, scan the entire array to count occurrences:
\`\`\`python
def count_elements(arr):
    result = {}
    seen = set()
    for num in arr:
        if num not in seen:
            count = 0
            for x in arr:  # Scan entire array for each unique element
                if x == num:
                    count += 1
            result[num] = count
            seen.add(num)
    return result
\`\`\`
**Time: O(n × k)** where k is unique elements | **Space: O(k)**

### 🟡 Bottleneck Analysis
**What's inefficient?** For each unique element, we scan the entire array again to count it. If we have many unique elements, this becomes O(n²) in the worst case.

**Key insight:** Instead of counting each element separately, we can count all elements in a single pass by remembering counts as we go.

### 🟢 Optimization: Hash Map
\`\`\`python
def count_elements(arr):
    counts = {}
    for num in arr:
        counts[num] = counts.get(num, 0) + 1
    return counts
\`\`\`

### ✅ Final Complexity
- **Time: O(n)** - Single pass through array, each dict operation is O(1)
- **Space: O(k)** - Dictionary stores k unique elements (k ≤ n)

### 🎯 Pattern Learned
**"Frequency Counting"** → Use a hash map to count occurrences in one pass instead of multiple scans per element.`,
            },
            content: `<h1>Hash Maps: Your O(n²) → O(n) Weapon</h1>

<p>You're stuck on a problem. Nested loops. O(n²). The interviewer's watching.</p>

<p><strong>The fix?</strong> A hash map. Almost every time.</p>

<hr />

<h2>The Pattern You'll See Everywhere</h2>

<pre><code>"For each element, I need to find/check something..."
     ↓
"What if I already stored that something?"
     ↓
Hash map. Done.</code></pre>

<hr />

<h2>Three Signals to Reach for a Hash Map</h2>

<table>
  <thead>
    <tr><th>Signal</th><th>Example Problem</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>"Have I seen X before?"</strong></td><td>Two Sum, Contains Duplicate</td></tr>
    <tr><td><strong>"How many times did X appear?"</strong></td><td>Valid Anagram, Top K Frequent</td></tr>
    <tr><td><strong>"Where was X first seen?"</strong></td><td>First Unique Character</td></tr>
  </tbody>
</table>

<hr />

<h2>Why It Works</h2>

<pre><code>Without hash map:  for each element → scan array → O(n) per lookup → O(n²) total
With hash map:     for each element → dict lookup → O(1) per lookup → O(n) total</code></pre>

<p>That's it. Store what you need, look it up in O(1).</p>

<p>Let's see this in action with Two Sum—the most asked interview question.</p>`
        },

        // TWO SUM - Multi-Approach Deep Dive
        {
            type: 'reading',
            id: 'two-sum-approaches',
            title: 'Two Sum: The Classic Multi-Approach Problem',
            estimatedReadTime: 240,
            autoMarkComplete: false,
            content: `<h1>Two Sum: Learning to Think, Not Memorize</h1>

<h2>The Problem</h2>

<p>Find two numbers in an array that add up to a target. Return their indices.</p>

<p><strong>Stop.</strong> Don't think about code yet. Let's think like an interviewer expects.</p>

<hr />

<h2>Step 1: Clarify the Problem</h2>

<p>Before anything else, ask questions:</p>

<ul>
  <li>Can I use the same element twice? → <strong>No</strong></li>
  <li>Is there always exactly one solution? → <strong>Yes</strong> (for this version)</li>
  <li>Can there be negative numbers? → <strong>Yes</strong></li>
  <li>Can there be duplicates? → <strong>Yes</strong></li>
  <li>What should I return if no solution exists? → <strong>Empty array</strong></li>
</ul>

<hr />

<h2>Step 2: Build Test Cases First</h2>

<p><strong>Start with the happy path:</strong></p>
<pre><code>nums = [2, 7, 11, 15], target = 9
       ↑  ↑
       2 + 7 = 9 ✓
Output: [0, 1]</code></pre>

<p><strong>Now think of edge cases:</strong></p>

<table>
  <thead>
    <tr><th>Test Case</th><th>Why It Matters</th></tr>
  </thead>
  <tbody>
    <tr><td><code>[3, 3], target = 6</code></td><td>Duplicates! Both values are the same</td></tr>
    <tr><td><code>[3, 2, 4], target = 6</code></td><td>Answer isn't at the start</td></tr>
    <tr><td><code>[-1, -2, -3], target = -5</code></td><td>Negative numbers</td></tr>
    <tr><td><code>[0, 4, 0], target = 0</code></td><td>Zeros as valid elements</td></tr>
    <tr><td><code>[1, 2], target = 3</code></td><td>Minimum array size</td></tr>
  </tbody>
</table>

<p><strong>🎯 The [3, 3] case is crucial</strong> — it exposes bugs in naive solutions.</p>

<hr />

<h2>Step 3: Think Through It Manually</h2>

<p>Forget complements for a second. Just brute-force it the way your brain naturally would:</p>

<pre><code>nums = [2, 7, 11, 15], target = 9

Fix i = 0 (value 2):
  try j = 1 → 2 + 7 = 9 ✓ stop
  try j = 2 → 2 + 11 = 13 ✗
  try j = 3 → 2 + 15 = 17 ✗
Move i to 1 (value 7):
  try j = 2 → 7 + 11 = 18 ✗
  try j = 3 → 7 + 15 = 22 ✗
Move i to 2 …</code></pre>

<p>We're literally checking <strong>every pair (i, j)</strong>. That's two loops.</p>

<hr />

<h2>Step 4: First Instinct → Brute Force</h2>

<p>The obvious approach: for each number, scan the rest of the array.</p>

<pre><code>nums = [2, 7, 11, 15], target = 9

At index 0 (value 2):
   [2, 7, 11, 15]
    ↑  ↓   ↓   ↓     Check 7: 2+7=9 ✓ Found!
       scan rest</code></pre>

<pre><code>for i in range(len(nums)):
    for j in range(i + 1, len(nums)):  # ← This inner loop is the problem
        if nums[i] + nums[j] == target:
            return [i, j]</code></pre>

<p><strong>Why is this slow?</strong> Every element scans every other element → O(n²)</p>

<p>Could we do better without hash maps? Maybe sort and use two pointers (O(n log n)), but sorting destroys the original indices we must return, so we'd have to stash extra bookkeeping anyway. There's a better linear-time path.</p>

<hr />

<h2>Step 5: Ask the Right Question</h2>

<p>Now the optimization mindset kicks in:</p>

<blockquote>
  <p><strong>"For each i I'm repeatedly scanning to find a partner. Can I avoid the re-scan by remembering what I've already seen?"</strong></p>
</blockquote>

<p>Equivalently: instead of scanning forward, look backward at what you've stored. That's where the "complement" language shows up — but only <strong>after</strong> we've identified the brute-force bottleneck.</p>

<pre><code>need = target - nums[i]   # the complement
if need is already in my hash map of seen numbers:
    return [seen[need], i]
else:
    store nums[i]</code></pre>

<p>Same problem, new question: "How do I check 'have I seen need before?' in O(1) time?"</p>

<hr />

<h2>Step 6: The Aha Moment</h2>

<pre><code>nums = [2, 7, 11, 15], target = 9

Step 1: At 2, need 7. Seen anything? No.     Store: {2: 0}
Step 2: At 7, need 2. Seen 2? YES at idx 0!  Return [0, 1]
        ↑
        Instead of scanning forward, I checked what I stored!</code></pre>

<p><strong>Visual walkthrough:</strong></p>

<pre><code>Index:  0    1    2    3
Value: [2]  [7]  [11] [15]    target = 9
        │
        ▼
     Need 7 (9-2=7)
     seen = {} → Not found
     Store 2 → seen = {2: 0}

Index:  0    1    2    3
Value: [2]  [7]  [11] [15]    target = 9
             │
             ▼
          Need 2 (9-7=2)
          seen = {2: 0} → Found at index 0!
          Return [0, 1] ✓</code></pre>

<hr />

<h2>Step 7: Handle the Edge Case</h2>

<p>Remember <code>[3, 3], target = 6</code>? Let's trace it:</p>

<pre><code>Step 1: At index 0, value 3. Need 3.
        seen = {} → Not found
        Store: {3: 0}

Step 2: At index 1, value 3. Need 3.
        seen = {3: 0} → Found at index 0!
        Return [0, 1] ✓</code></pre>

<p><strong>It works because we check BEFORE we store.</strong> If we stored first, we'd find ourselves!</p>

<hr />

<h2>The Final Solution</h2>

<pre><code>def twoSum(nums, target):
    seen = {}  # value → index

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:      # Check first
            return [seen[complement], i]

        seen[num] = i               # Store after

    return []</code></pre>

<p><strong>Complexity:</strong></p>
<ul>
  <li>Time: O(n) — one pass, O(1) lookup per element</li>
  <li>Space: O(n) — storing up to n elements</li>
</ul>

<hr />

<h2>What You Actually Learned</h2>

<p>Not "use a hash map for Two Sum." Instead:

1. **Clarify first** — don't assume constraints
2. **Test cases expose edge cases** — duplicates, negatives, zeros
3. **Manual tracing reveals patterns** — "I keep looking for complements"
4. **Question the bottleneck** — "Why am I scanning repeatedly?"
5. **Store to avoid re-scanning** — the hash map insight

This thinking applies to hundreds of problems, not just Two Sum.`
        },{
            type: 'reading',
            id: 'complement-lookup-summary',
            title: '📝 How Hash Maps Removed the Inner Loop',
            estimatedReadTime: 120,
            practiceExercise: {
                title: 'Try It: Find Complement',
                instruction: `# Find Complement in Array

Given an array and a target value, check if any two numbers in the array sum to the target.

**Examples:**
- \`[2, 7, 11, 15], 9\` → \`True\` (2 + 7 = 9)
- \`[1, 2, 3], 5\` → \`True\` (2 + 3 = 5)
- \`[1, 2, 3], 10\` → \`False\`

**Your Task:**
Write a function \`has_complement(arr, target)\` that returns True if two numbers sum to target, False otherwise.`,
                starterCode: `def has_complement(arr, target):
    # Your code here
    pass

# Test your solution
print(has_complement([2, 7, 11, 15], 9))  # Should print True
print(has_complement([1, 2, 3], 5))       # Should print True
print(has_complement([1, 2, 3], 10))      # Should print False`,
                testCases: [
                    { input: '[2, 7, 11, 15], 9', expectedOutput: 'True' },
                    { input: '[1, 2, 3], 5', expectedOutput: 'True' },
                    { input: '[1, 2, 3], 10', expectedOutput: 'False' },
                ],
                difficulty: 'easy',
                solution: `def has_complement(arr, target):
    # Solution: Use set to track seen numbers
    seen = set()
    for num in arr:
        # Check if complement exists in set
        complement = target - num
        if complement in seen:
            return True
        # Add current number to set
        seen.add(num)
    return False

# Test your solution
print(has_complement([2, 7, 11, 15], 9))  # Should print True
print(has_complement([1, 2, 3], 5))       # Should print True
print(has_complement([1, 2, 3], 10))      # Should print False`,
                targetComplexity: {
                    time: 'O(n)',
                    space: 'O(n)',
                    notes: 'Single pass with O(1) set lookups; stores up to n elements'
                },
                solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Brute Force (Nested Loops)
For each element, scan the rest to find complement:
\`\`\`python
def has_complement(arr, target):
    for i in range(len(arr)):
        for j in range(i+1, len(arr)):
            if arr[i] + arr[j] == target:
                return True
    return False
\`\`\`
**Time: O(n²)** | **Space: O(1)**

### 🟡 Bottleneck Analysis
**What's inefficient?** For each element, we scan remaining elements to find its complement (target - num). This requires n iterations for each of n elements.

**Key insight:** If we remember which numbers we've seen, we can check for the complement in O(1) time instead of O(n).

### 🟢 Optimization: Hash Set
\`\`\`python
def has_complement(arr, target):
    seen = set()
    for num in arr:
        complement = target - num
        if complement in seen:
            return True
        seen.add(num)
    return False
\`\`\`

### ✅ Final Complexity
- **Time: O(n)** - Single pass, O(1) set lookups per element
- **Space: O(n)** - Set stores up to n elements

### 🎯 Pattern Learned
**"Complement Detection"** → Use a hash set to track seen values, enabling O(1) complement lookups. Same pattern as Two Sum but only needs True/False, not indices.`,
            },
            content: `<h1>How Hash Maps Removed the Inner Loop 📝</h1>

<h2>The Brute Force Approach</h2>

<p><strong>First attempt:</strong> For each element, scan the rest of the array to find its complement.</p>

<pre><code>def two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []</code></pre>

<p><strong>Complexity:</strong></p>
<ul>
  <li>Time: O(n²) - nested loops</li>
  <li>Space: O(1) - only using variables</li>
</ul>

<hr />

<h2>The Bottleneck</h2>

<p><strong>What's slow?</strong> The inner loop that scans for the complement!</p>

<p><strong>Why does it matter?</strong> For each of n elements, we scan up to n-1 other elements = O(n²) total work.</p>

<hr />

<h2>The Optimization</h2>

<p><strong>Key insight:</strong> Instead of scanning, store what we've seen and look it up instantly!</p>

<p><strong>The fix:</strong> Use a hash map to store elements as we iterate, then check if the complement exists.</p>

<pre><code>def two_sum(nums, target):
    seen = {}  # Store value -> index
    
    for i, num in enumerate(nums):
        complement = target - num  # What we need
        
        # Check if complement exists (O(1) lookup!)
        if complement in seen:
            return [seen[complement], i]  # Found pair!
        
        # Store current number for future lookups
        if num not in seen:
            seen[num] = i
    
    return []</code></pre>

<p><strong>Complexity:</strong></p>
<ul>
  <li>Time: O(n) - single pass, O(1) lookup per element</li>
  <li>Space: O(n) - storing up to n elements in hash map</li>
</ul>

<hr />

<h2>What Changed</h2>

<p><strong>Before:</strong> Inner loop scanning for complement → O(n²) time</p>
<p><strong>After:</strong> Hash map lookup for complement → O(n) time</p>

<p><strong>The bottleneck:</strong> Nested loop scanning</p>
<p><strong>The fix:</strong> Hash map with O(1) lookup</p>

<hr />

<h2>The General Principle</h2>

<p>When you need to find pairs or complements:</p>
<ul>
  <li><strong>Bottleneck:</strong> Inner loop that scans for matching elements</li>
  <li><strong>Solution:</strong> Store elements in hash map as you iterate, look up complements instantly</li>
  <li><strong>Result:</strong> O(n²) → O(n) improvement</li>
</ul>

<p>This optimization works whenever you can replace a scan with an O(1) lookup! 🎯</p>`,
        },

        // 3SUM - Extension of Two Sum Pattern
        {
            type: 'reading',
            id: 'three-sum-intro',
            title: '3Sum: Extending Two Sum',
            estimatedReadTime: 480,
            content: `<h1>3Sum: What Happens When You Add Another Element?</h1>

<h2>The Problem</h2>

<blockquote>
  <p>Given an integer array nums, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.</p>
  <p>The solution set must not contain duplicate triplets.</p>
</blockquote>

<p><strong>Example:</strong></p>
<pre><code>Input: nums = [-1, 0, 1, 2, -1, -4]
Output: [[-1, -1, 2], [-1, 0, 1]]</code></pre>

<hr />

<h2>Your First Instinct: Brute Force</h2>

<p>You just solved Two Sum. For 3Sum, the obvious move is three nested loops:</p>

<pre><code>def threeSum(nums):
    n = len(nums)
    result = []
    
    for i in range(n):
        for j in range(i+1, n):
            for k in range(j+1, n):
                if nums[i] + nums[j] + nums[k] == 0:
                    triplet = sorted([nums[i], nums[j], nums[k]])
                    if triplet not in result:
                        result.append(triplet)
    
    return result</code></pre>

<p>Three nested loops = O(n³). On an array of 3,000 elements, that's 27 billion operations. Way too slow.</p>

<hr />

<h2>Spotting the Bottleneck</h2>

<p>Think about what the inner loop is doing. For a fixed <code>nums[i]</code> and <code>nums[j]</code>, you're searching for a <code>nums[k]</code> such that:</p>

<p><code>nums[k] = 0 - nums[i] - nums[j] = -(nums[i] + nums[j])</code></p>

<p><strong>That's a Two Sum problem!</strong> For each pair (i, j), you're looking for a specific complement. For example, if a pair is (4, 8), then the third element needed for a zero sum is -12 because 4 + 8 = 12, and we need -12 to sum to zero.</p>

<p>The key insight: <strong>there's no need to do a linear scan to find the complement</strong>. We can optimize the inner loop using either binary search or a hashtable.</p>

<hr />

<h2>Approach 2: Binary Search (O(n² log n))</h2>

<p>If we sort the array first, we can binary search for the complement:</p>

<pre><code>def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left &lt;= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] &lt; target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

def threeSum_binary(nums):
    nums.sort()
    result = set()

    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            # Search for the complement
            complement = -(nums[i] + nums[j])
            idx = binary_search(nums, complement)

            # Make sure we found it and it's not reusing i or j
            if idx != -1 and idx != i and idx != j:
                triplet = tuple(sorted([nums[i], nums[j], nums[idx]]))
                result.add(triplet)

    return [list(t) for t in result]</code></pre>

<p><strong>Complexity:</strong> O(n² log n) time – O(n²) pairs × O(log n) binary search. Space: O(1) extra (excluding output).</p>

<hr />

<h2>Approach 3: Hashtable (O(n²) time, O(n) space)</h2>

<p>Instead of binary search, use a hashtable for O(1) lookups:</p>

<pre><code>def threeSum_hashtable(nums):
    # Build hashtable: value -> last index seen
    val_to_idx = {}
    for i in range(len(nums)):
        val_to_idx[nums[i]] = i

    result = set()

    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            complement = -(nums[i] + nums[j])

            # Check if complement exists and isn't reusing i or j
            if complement in val_to_idx:
                k = val_to_idx[complement]
                if k != i and k != j:
                    triplet = tuple(sorted([nums[i], nums[j], complement]))
                    result.add(triplet)

    return [list(t) for t in result]</code></pre>

<p><strong>Why store the last index?</strong> This works even with duplicates – for valid solutions, i and j will always be less than the stored index, avoiding element reuse.</p>

<p><strong>Complexity:</strong> O(n²) time – O(n²) pairs × O(1) lookup. Space: O(n) for the hashtable.</p>

<hr />

<h2>The Challenge: O(n²) Time WITHOUT Extra Space</h2>

<p>The hashtable solution is O(n²) but requires O(n) extra space. Can we achieve O(n²) time with O(1) space?</p>

<p><strong>Hint:</strong> It requires sorting the array. If you're trying to find a pair in a sorted array that sums to a target, can you eliminate either the min or max element from consideration?</p>

<hr />

<h2>Approach 4: Sort + Two Pointers (Optimal)</h2>

<p>Here's the insight that changes everything: <strong>sort the array first</strong>.</p>

<pre><code>nums = [-1, 0, 1, 2, -1, -4]
sorted: [-4, -1, -1, 0, 1, 2]</code></pre>

<p>Now for each fixed <code>nums[i]</code>, we need two numbers from the remaining array that sum to <code>-nums[i]</code>. With a sorted array, we can use <strong>two pointers</strong> instead of nested loops:</p>

<pre><code>For nums[i] = -4, we need two numbers that sum to 4
Use left pointer at -1 (index 1) and right pointer at 2 (index 5)

-1 + 2 = 1 &lt; 4  → move left pointer right
-1 + 2 = 1 &lt; 4  → move left pointer right  
0 + 2 = 2 &lt; 4   → move left pointer right
1 + 2 = 3 &lt; 4   → move left pointer right
(left >= right, done with this i)</code></pre>

<hr />

<h2>The Two-Pointer Trick</h2>

<p>With a sorted array:</p>
<ul>
  <li>If <code>nums[left] + nums[right] &lt; target</code>: sum too small → move left pointer right (increase sum)</li>
  <li>If <code>nums[left] + nums[right] &gt; target</code>: sum too big → move right pointer left (decrease sum)</li>
  <li>If equal: found a triplet!</li>
</ul>

<p>Each "Two Sum" scan now takes O(n) instead of O(n²)!</p>

<hr />

<h2>Handling Duplicates</h2>

<p>The tricky part is avoiding duplicate triplets. Since the array is sorted:</p>
<ul>
  <li>Skip duplicate values for <code>i</code> (if <code>nums[i] == nums[i-1]</code>, skip)</li>
  <li>Skip duplicate values for <code>left</code> after finding a triplet</li>
  <li>Skip duplicate values for <code>right</code> after finding a triplet</li>
</ul>

<hr />

<h2>The Final Algorithm</h2>

<pre><code>def threeSum(nums):
    nums.sort()  # O(n log n)
    result = []
    
    for i in range(len(nums) - 2):
        # Skip duplicates for i
        if i > 0 and nums[i] == nums[i-1]:
            continue
        
        # Two pointers for the remaining array
        left, right = i + 1, len(nums) - 1
        target = -nums[i]
        
        while left &lt; right:
            current_sum = nums[left] + nums[right]
            
            if current_sum &lt; target:
                left += 1
            elif current_sum > target:
                right -= 1
            else:
                # Found a triplet!
                result.append([nums[i], nums[left], nums[right]])
                
                # Skip duplicates for left and right
                while left &lt; right and nums[left] == nums[left + 1]:
                    left += 1
                while left &lt; right and nums[right] == nums[right - 1]:
                    right -= 1
                
                left += 1
                right -= 1
    
    return result</code></pre>

<p><strong>Complexity:</strong></p>
<ul>
  <li>Time: O(n²) – sorting is O(n log n), then O(n) outer loop × O(n) two-pointer scan</li>
  <li>Space: O(1) – ignoring the output array (or O(n) for sorting, depending on implementation)</li>
</ul>

<hr />

<h2>Summary: All Four Approaches</h2>

<table>
  <thead>
    <tr><th>Approach</th><th>Time</th><th>Space</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td>Brute Force (3 nested loops)</td><td>O(n³)</td><td>O(1)</td><td>Too slow for large inputs</td></tr>
    <tr><td>Sort + Binary Search</td><td>O(n² log n)</td><td>O(1)*</td><td>Good stepping stone</td></tr>
    <tr><td>Hashtable</td><td>O(n²)</td><td>O(n)</td><td>Fast but uses extra space</td></tr>
    <tr><td>Sort + Two Pointers</td><td>O(n²)</td><td>O(1)*</td><td><strong>Optimal</strong> - clean duplicate handling</td></tr>
  </tbody>
</table>

<p><em>*Technically, sorting uses O(n) space (even in-place sorting uses stack space). Bonus points if you recognize this!</em></p>

<p>The key insight: <strong>sorting enables the two-pointer technique</strong>, which replaces the inner O(n) scan with an O(n) two-pointer sweep that handles duplicates naturally.</p>

<hr />

<h2>Interview Progression</h2>

<p>In an interview, expect this progression:</p>
<ol>
  <li><strong>Start with brute force</strong> – shows you understand the problem</li>
  <li><strong>Optimize the inner loop</strong> – recognize it's a Two Sum subproblem</li>
  <li><strong>Propose binary search or hashtable</strong> – shows algorithmic thinking</li>
  <li><strong>Reach two pointers</strong> – demonstrates mastery of the pattern</li>
</ol>

<p>The interviewer may ask: <em>"Can you achieve O(n²) without extra space?"</em> This is the cue to use sorting + two pointers.</p>

<hr />

<h2>The Pattern</h2>

<p>This is the <strong>"k-Sum" pattern</strong>:</p>
<ul>
  <li>For 2Sum with sorted array: two pointers → O(n)</li>
  <li>For 3Sum: fix one element + two pointers → O(n²)</li>
  <li>For 4Sum: fix two elements + two pointers → O(n³)</li>
  <li>General kSum: O(n^(k-1))</li>
</ul>

<p>The sorting step pays off by enabling the two-pointer optimization.</p>`,
        },{
            type: 'reading',
            id: 'frequency-counting',
            title: 'Valid Anagram: Learning to Think, Not Memorize',
            estimatedReadTime: 360,
            content: `<h1>Valid Anagram: When Order Doesn't Matter</h1>

<h2>The Problem</h2>

<blockquote>
  <p>Given two strings s and t, return true if t is an anagram of s, and false otherwise.</p>
  <p>An anagram is a word formed by rearranging the letters of another word, using all original letters exactly once.</p>
</blockquote>

<p><strong>Stop.</strong> Before coding, let's think.</p>

<hr />

<h2>Step 1: Clarify the Problem</h2>

<p>Questions to ask:</p>
<ul>
  <li>Are the strings case-sensitive? → <strong>Yes</strong> (for this version)</li>
  <li>Can they contain spaces or special chars? → <strong>Lowercase letters only</strong></li>
  <li>What if both strings are empty? → <strong>True</strong> (both have same chars: none)</li>
  <li>What if lengths differ? → <strong>False</strong> (can't rearrange into different length)</li>
</ul>

<hr />

<h2>Step 2: Build Test Cases First</h2>

<p><strong>Happy path:</strong></p>
<pre><code>s = "anagram", t = "nagaram"
Both have: a(3), n(1), g(1), r(1), m(1)
→ True</code></pre>

<p><strong>Edge cases to consider:</strong></p>

<table>
  <thead>
    <tr><th>Test Case</th><th>Expected</th><th>Why It Matters</th></tr>
  </thead>
  <tbody>
    <tr><td><code>"anagram", "nagaram"</code></td><td>True</td><td>Classic anagram</td></tr>
    <tr><td><code>"rat", "car"</code></td><td>False</td><td>Different characters</td></tr>
    <tr><td><code>"listen", "silent"</code></td><td>True</td><td>Different arrangement</td></tr>
    <tr><td><code>"a", "a"</code></td><td>True</td><td>Single character</td></tr>
    <tr><td><code>"ab", "a"</code></td><td>False</td><td>Different lengths</td></tr>
    <tr><td><code>"", ""</code></td><td>True</td><td>Both empty</td></tr>
    <tr><td><code>"aab", "aba"</code></td><td>True</td><td>Duplicates matter</td></tr>
    <tr><td><code>"aab", "aaa"</code></td><td>False</td><td>Same chars, different counts</td></tr>
  </tbody>
</table>

<p><strong>🎯 The "aab" vs "aaa" case matters</strong> — same characters but different frequencies.</p>

<hr />

<h2>Step 3: Think Through It Manually</h2>

<p>What makes two strings anagrams?</p>

<pre><code>s = "listen"    t = "silent"

Characters in s: l, i, s, t, e, n
Characters in t: s, i, l, e, n, t

Same characters, same counts? Let me check...

s: l(1), i(1), s(1), t(1), e(1), n(1)
t: s(1), i(1), l(1), e(1), n(1), t(1)

Same! → Anagram ✓</code></pre>

<p><strong>What's the pattern?</strong> I'm counting how many times each character appears in both strings.</p>

<hr />

<h2>Step 4: First Instinct → Sorting</h2>

<p>If I sort both strings, anagrams become identical:</p>

<pre><code>"listen" → sorted → "eilnst"
"silent" → sorted → "eilnst"

Same! → Anagram</code></pre>

<pre><code>def isAnagram(s, t):
    return sorted(s) == sorted(t)</code></pre>

<p><strong>Why is this suboptimal?</strong> Sorting takes O(n log n) time.</p>

<p>But wait — do we need the sorted order? Or just to know if they have the same characters?</p>

<hr />

<h2>Step 5: Ask the Right Question</h2>

<blockquote>
  <p><strong>"I don't care about order at all. I only care if both strings have the same character counts. Can I count without sorting?"</strong></p>
</blockquote>

<p>This is the key insight. Sorting gives us more information than we need.</p>

<hr />

<h2>Step 6: The Frequency Map Pattern</h2>

<p><strong>Count characters in both strings, compare the counts:</strong></p>

<pre><code>s = "anagram"

Count s:
a → 1 → 2 → 3  (appears 3 times)
n → 1
g → 1
r → 1
m → 1

Final: {a:3, n:1, g:1, r:1, m:1}</code></pre>

<pre><code>t = "nagaram"

Count t:
n → 1
a → 1 → 2 → 3
g → 1
r → 1
m → 1

Final: {n:1, a:3, g:1, r:1, m:1}</code></pre>

<p><strong>Same frequency maps? → Anagram!</strong></p>

<hr />

<h2>Step 7: Visual Walkthrough</h2>

<pre><code>s = "listen"    t = "silent"

BUILD FREQUENCY MAP FOR s:
──────────────────────────
l  i  s  t  e  n
↓  ↓  ↓  ↓  ↓  ↓
count_s = {}
  'l' → {l:1}
  'i' → {l:1, i:1}
  's' → {l:1, i:1, s:1}
  't' → {l:1, i:1, s:1, t:1}
  'e' → {l:1, i:1, s:1, t:1, e:1}
  'n' → {l:1, i:1, s:1, t:1, e:1, n:1}

BUILD FREQUENCY MAP FOR t:
──────────────────────────
s  i  l  e  n  t
↓  ↓  ↓  ↓  ↓  ↓
count_t = {}
  's' → {s:1}
  'i' → {s:1, i:1}
  'l' → {s:1, i:1, l:1}
  'e' → {s:1, i:1, l:1, e:1}
  'n' → {s:1, i:1, l:1, e:1, n:1}
  't' → {s:1, i:1, l:1, e:1, n:1, t:1}

COMPARE:
count_s = {l:1, i:1, s:1, t:1, e:1, n:1}
count_t = {s:1, i:1, l:1, e:1, n:1, t:1}

Same keys, same values? → True ✓</code></pre>

<hr />

<h2>Step 8: Handle Edge Cases</h2>

<p><strong>Different lengths (fast fail):</strong></p>
<pre><code>s = "ab", t = "a"
len(s) = 2, len(t) = 1
Different lengths → can't be anagram → False ✓</code></pre>

<p><strong>Different frequencies:</strong></p>
<pre><code>s = "aab", t = "aaa"
count_s = {a:2, b:1}
count_t = {a:3}

Different! → False ✓</code></pre>

<p><strong>Empty strings:</strong></p>
<pre><code>s = "", t = ""
count_s = {}
count_t = {}

Same (both empty)! → True ✓</code></pre>

<hr />

<h2>The Final Solution</h2>

<pre><code>def isAnagram(s, t):
    # Quick check: different lengths can't be anagrams
    if len(s) != len(t):
        return False

    # Count character frequencies in both strings
    count_s = {}
    count_t = {}

    for char in s:
        count_s[char] = count_s.get(char, 0) + 1

    for char in t:
        count_t[char] = count_t.get(char, 0) + 1

    # Compare frequency maps
    return count_s == count_t</code></pre>

<p><strong>Complexity:</strong></p>
<ul>
  <li>Time: O(n) — two passes to count, O(k) to compare</li>
  <li>Space: O(k) — where k is unique characters (at most 26 for lowercase)</li>
</ul>

<hr />

<h2>Optimization: Single Counter</h2>

<p>Instead of two maps, use one and decrement:</p>

<pre><code>def isAnagram(s, t):
    if len(s) != len(t):
        return False

    count = {}

    # Increment for s, decrement for t
    for i in range(len(s)):
        count[s[i]] = count.get(s[i], 0) + 1
        count[t[i]] = count.get(t[i], 0) - 1

    # All counts should be zero
    return all(v == 0 for v in count.values())</code></pre>

<p>Same O(n) time, but single pass through both strings!</p>

<hr />

<h2>The Pattern You Learned</h2>

<p><strong>"Frequency Counting for Comparison"</strong></p>

<p>When you need to compare two things where <strong>order doesn't matter</strong>, count frequencies:</p>
<ul>
  <li>Anagrams → same character frequencies</li>
  <li>Permutations → same element frequencies</li>
  <li>"Can X be rearranged to form Y?" → frequency comparison</li>
</ul>

<p><strong>The insight:</strong> Sorting gives O(n log n). Counting gives O(n). When order doesn't matter, counting wins.</p>`,
        },{
            type: 'reading',
            id: 'frequency-counting-takeaways',
            title: 'Key Takeaways: Frequency Counting',
            estimatedReadTime: 120,
            practiceExercise: {
                title: 'Try It: Find First Unique',
                instruction: `# Find First Unique Character

Given a string, find the index of the first character that appears only once.

**Examples:**
- \`"leetcode"\` → \`0\` (first 'l' is unique)
- \`"loveleetcode"\` → \`2\` (first 'v' is unique)
- \`"aabb"\` → \`-1\` (no unique character)

**Your Task:**
Write a function \`first_unique(s)\` that returns the index of the first unique character, or -1 if none exists.`,
                starterCode: `def first_unique(s):
    # Your code here
    pass

# Test your solution
print(first_unique("leetcode"))      # Should print 0
print(first_unique("loveleetcode"))  # Should print 2
print(first_unique("aabb"))          # Should print -1`,
                testCases: [
                    { input: '"leetcode"', expectedOutput: '0' },
                    { input: '"loveleetcode"', expectedOutput: '2' },
                    { input: '"aabb"', expectedOutput: '-1' },
                ],
                difficulty: 'easy',
                solution: `def first_unique(s):
    # Solution: Two-pass approach
    # Pass 1: Count character frequencies
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1

    # Pass 2: Find first character with frequency 1
    for i, char in enumerate(s):
        if freq[char] == 1:
            return i

    # No unique character found
    return -1

# Test your solution
print(first_unique("leetcode"))      # Should print 0
print(first_unique("loveleetcode"))  # Should print 2
print(first_unique("aabb"))          # Should print -1`,
                targetComplexity: {
                    time: 'O(n)',
                    space: 'O(k)',
                    notes: 'Two passes through string; k is alphabet size (at most n unique chars)'
                },
                solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Check Uniqueness Per Position
For each position, scan the string to count occurrences:
\`\`\`python
def first_unique(s):
    for i in range(len(s)):
        count = 0
        for j in range(len(s)):
            if s[j] == s[i]:
                count += 1
        if count == 1:
            return i
    return -1
\`\`\`
**Time: O(n²)** | **Space: O(1)**

### 🟡 Bottleneck Analysis
**What's inefficient?** For each character position, we scan the entire string to count how many times that character appears. This repeats counting work.

**Key insight:** Instead of recounting for each position, count all characters once, then check which position has a unique character.

### 🟢 Optimization: Two-Pass Hash Map
\`\`\`python
def first_unique(s):
    # Pass 1: Count frequencies
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1

    # Pass 2: Find first with frequency 1
    for i, char in enumerate(s):
        if freq[char] == 1:
            return i
    return -1
\`\`\`

### ✅ Final Complexity
- **Time: O(n)** - Two passes through string: count + find first unique
- **Space: O(k)** - Dictionary stores k unique characters (k ≤ n)

### 🎯 Pattern Learned
**"Two-Pass Frequency Map"** → Count all frequencies in first pass, use them in second pass. Avoids O(n²) recounting for each position.`,
            },
            content: `<h1>First Unique Character: The Two-Pass Pattern</h1>

<h2>The Problem</h2>

<blockquote>
  <p>Given a string, find the index of the first character that appears only once.</p>
</blockquote>

<p><strong>Stop.</strong> Before coding, let's think.</p>

<hr />

<h2>Step 1: Clarify the Problem</h2>

<p>Questions to ask:</p>
<ul>
  <li>What if there's no unique character? → <strong>Return -1</strong></li>
  <li>Is the string lowercase only? → <strong>Yes</strong> (for this version)</li>
  <li>What about empty string? → <strong>Return -1</strong></li>
  <li>Can the string have spaces? → <strong>Depends on variant</strong></li>
</ul>

<hr />

<h2>Step 2: Build Test Cases First</h2>

<p><strong>Happy path:</strong></p>
<pre><code>s = "leetcode"
     ↑
     'l' appears once → index 0</code></pre>

<p><strong>Edge cases to consider:</strong></p>

<table>
  <thead>
    <tr><th>Test Case</th><th>Expected</th><th>Why It Matters</th></tr>
  </thead>
  <tbody>
    <tr><td><code>"leetcode"</code></td><td>0</td><td>First char is unique</td></tr>
    <tr><td><code>"loveleetcode"</code></td><td>2</td><td>Unique char in middle ('v')</td></tr>
    <tr><td><code>"aabb"</code></td><td>-1</td><td>No unique characters</td></tr>
    <tr><td><code>"z"</code></td><td>0</td><td>Single character</td></tr>
    <tr><td><code>""</code></td><td>-1</td><td>Empty string</td></tr>
    <tr><td><code>"aadadaad"</code></td><td>-1</td><td>All chars repeat</td></tr>
  </tbody>
</table>

<p><strong>🎯 The "loveleetcode" case matters</strong> — the unique char isn't at the start.</p>

<hr />

<h2>Step 3: Think Through It Manually</h2>

<p>Let's trace <code>s = "loveleetcode"</code>:</p>

<pre><code>l o v e l e e t c o d e
↑
Is 'l' unique? Need to scan whole string to know...
  Found another 'l' at index 4. Not unique.

l o v e l e e t c o d e
  ↑
Is 'o' unique? Need to scan whole string...
  Found another 'o' at index 9. Not unique.

l o v e l e e t c o d e
    ↑
Is 'v' unique? Scan whole string...
  No other 'v' found. Unique! Return index 2.</code></pre>

<p><strong>What's the pattern?</strong> For each character, I'm scanning the entire string to count occurrences.</p>

<hr />

<h2>Step 4: First Instinct → Brute Force</h2>

<pre><code>def first_unique(s):
    for i, char in enumerate(s):
        count = 0
        for c in s:                    # ← Scan entire string
            if c == char:
                count += 1
        if count == 1:
            return i
    return -1</code></pre>

<p><strong>Why is this slow?</strong> For each of n characters, scan all n characters → O(n²)</p>

<p>For a string of 100,000 chars: 10 billion operations!</p>

<hr />

<h2>Step 5: Ask the Right Question</h2>

<blockquote>
  <p><strong>"I keep counting the same characters over and over. What if I counted everything once upfront?"</strong></p>
</blockquote>

<p>This is the key insight. Instead of recounting for each position, count all characters first.</p>

<hr />

<h2>Step 6: The Two-Pass Pattern</h2>

<p><strong>Pass 1:</strong> Count everything</p>
<pre><code>s = "loveleetcode"

Scan once, build frequency map:
l → 2
o → 2
v → 1  ← only one!
e → 4
t → 1  ← only one!
c → 1  ← only one!
d → 1  ← only one!</code></pre>

<p><strong>Pass 2:</strong> Find first with count = 1</p>
<pre><code>s = "loveleetcode"
     ↑
Index 0: 'l' → freq['l'] = 2 → not unique
Index 1: 'o' → freq['o'] = 2 → not unique
Index 2: 'v' → freq['v'] = 1 → UNIQUE! Return 2</code></pre>

<hr />

<h2>Step 7: Visual Walkthrough</h2>

<pre><code>s = "loveleetcode"

PASS 1: Build frequency map
─────────────────────────────
l  o  v  e  l  e  e  t  c  o  d  e
↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓

freq = {}
  'l' → freq = {l:1}
  'o' → freq = {l:1, o:1}
  'v' → freq = {l:1, o:1, v:1}
  'e' → freq = {l:1, o:1, v:1, e:1}
  'l' → freq = {l:2, o:1, v:1, e:1}
  'e' → freq = {l:2, o:1, v:1, e:2}
  'e' → freq = {l:2, o:1, v:1, e:3}
  't' → freq = {l:2, o:1, v:1, e:3, t:1}
  'c' → freq = {l:2, o:1, v:1, e:3, t:1, c:1}
  'o' → freq = {l:2, o:2, v:1, e:3, t:1, c:1}
  'd' → freq = {l:2, o:2, v:1, e:3, t:1, c:1, d:1}
  'e' → freq = {l:2, o:2, v:1, e:4, t:1, c:1, d:1}

PASS 2: Find first unique
─────────────────────────────
Index 0: 'l' → freq['l']=2 → skip
Index 1: 'o' → freq['o']=2 → skip
Index 2: 'v' → freq['v']=1 → ✓ FOUND! Return 2</code></pre>

<hr />

<h2>Step 8: Handle Edge Cases</h2>

<p><strong>Empty string:</strong></p>
<pre><code>s = ""
Pass 1: freq = {} (nothing to count)
Pass 2: no characters to check → return -1 ✓</code></pre>

<p><strong>All duplicates:</strong></p>
<pre><code>s = "aabb"
Pass 1: freq = {a:2, b:2}
Pass 2:
  Index 0: 'a' → 2 → skip
  Index 1: 'a' → 2 → skip
  Index 2: 'b' → 2 → skip
  Index 3: 'b' → 2 → skip
  No unique found → return -1 ✓</code></pre>

<hr />

<h2>The Final Solution</h2>

<pre><code>def first_unique(s):
    # Pass 1: Count all character frequencies
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1

    # Pass 2: Find first character with frequency 1
    for i, char in enumerate(s):
        if freq[char] == 1:
            return i

    return -1</code></pre>

<p><strong>Complexity:</strong></p>
<ul>
  <li>Time: O(n) + O(n) = O(n) — two passes</li>
  <li>Space: O(k) — where k is unique characters (at most 26 for lowercase)</li>
</ul>

<hr />

<h2>Why Two Passes?</h2>

<p>You might ask: "Can we do it in one pass?"</p>

<p><strong>The problem:</strong> We need to return the FIRST unique character by position. We can't know if a character is unique until we've seen the whole string.</p>

<pre><code>s = "aab"
     ↑
At index 0, 'a' looks unique... but index 1 proves it's not.</code></pre>

<p><strong>One pass would require:</strong> Storing indices AND updating as we find duplicates. More complex, same O(n) time.</p>

<p>The two-pass approach is cleaner and equally efficient.</p>

<hr />

<h2>The Pattern You Learned</h2>

<p><strong>"Two-Pass Frequency Map"</strong></p>

<ol>
  <li><strong>Pass 1:</strong> Build complete frequency counts</li>
  <li><strong>Pass 2:</strong> Use counts to answer the question</li>
</ol>

<p>This pattern applies to:</p>
<ul>
  <li>First/Last unique element</li>
  <li>Most/Least frequent element</li>
  <li>Elements appearing exactly K times</li>
  <li>Majority element (>n/2 occurrences)</li>
</ul>

<p><strong>The insight:</strong> Don't recount. Count once, query many times.</p>`
        },
        {
            type: 'reading',
            id: 'frequency-counting-summary',
            title: '📝 How Hash Maps Avoid Repeated Counting',
            estimatedReadTime: 120,
            practiceExercise: {
                title: 'Try It: Find Majority Element',
                instruction: `# Find Majority Element

Given an array where one element appears more than n/2 times, find that element.

**Examples:**
- \`[3, 2, 3]\` → \`3\` (appears 2 times, n/2 = 1.5)
- \`[2, 2, 1, 1, 1, 2, 2]\` → \`2\` (appears 4 times, n/2 = 3.5)
- \`[1]\` → \`1\`

**Your Task:**
Write a function \`majority_element(arr)\` that returns the majority element.`,
                starterCode: `def majority_element(arr):
    # Your code here
    pass

# Test your solution
print(majority_element([3, 2, 3]))              # Should print 3
print(majority_element([2, 2, 1, 1, 1, 2, 2]))  # Should print 2
print(majority_element([1]))                    # Should print 1`,
                testCases: [
                    { input: '[3, 2, 3]', expectedOutput: '3' },
                    { input: '[2, 2, 1, 1, 1, 2, 2]', expectedOutput: '2' },
                    { input: '[1]', expectedOutput: '1' },
                ],
                difficulty: 'easy',
                solution: `def majority_element(arr):
    # Solution: Count frequencies and find majority
    freq = {}
    threshold = len(arr) / 2

    # Count frequencies
    for num in arr:
        freq[num] = freq.get(num, 0) + 1

    # Find element with count > n/2
    for num, count in freq.items():
        if count > threshold:
            return num

    # No majority element (shouldn't happen based on problem)
    return None

# Test your solution
print(majority_element([3, 2, 3]))              # Should print 3
print(majority_element([2, 2, 1, 1, 1, 2, 2]))  # Should print 2
print(majority_element([1]))                    # Should print 1`,
                targetComplexity: {
                    time: 'O(n)',
                    space: 'O(n)',
                    notes: 'Single pass to count, then iterate frequencies; stores up to n unique elements'
                },
                solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Sort and Find Middle
Sort the array and return the middle element (which must be the majority):
\`\`\`python
def majority_element(arr):
    arr.sort()
    return arr[len(arr) // 2]
\`\`\`
**Time: O(n log n)** | **Space: O(1)** or O(n) depending on sort

### 🟡 Bottleneck Analysis
**What's inefficient?** Sorting takes O(n log n), but we don't need the elements in order. We only need to find which element appears more than n/2 times.

**Key insight:** We can count frequencies in O(n) time with a hash map, then check which count exceeds n/2.

### 🟢 Optimization: Hash Map Frequency Count
\`\`\`python
def majority_element(arr):
    freq = {}
    threshold = len(arr) / 2

    for num in arr:
        freq[num] = freq.get(num, 0) + 1

    for num, count in freq.items():
        if count > threshold:
            return num
    return None
\`\`\`

### ✅ Final Complexity
- **Time: O(n)** - One pass to count, O(k) to find majority (k ≤ n)
- **Space: O(n)** - Dictionary stores up to n unique elements

### 🎯 Pattern Learned
**"Find by Frequency Threshold"** → Count with hash map then filter by condition. O(n) beats O(n log n) sorting when we only need counts, not order.`,
            },
            content: `<h1>How Hash Maps Avoid Repeated Counting 📝</h1>

<h2>The Brute Force Approach</h2>

<p><strong>First attempt:</strong> For each character in one string, count how many times it appears in both strings and compare.</p>

<pre><code>def is_anagram(s, t):
    if len(s) != len(t):
        return False
    
    for char in s:
        if s.count(char) != t.count(char):
            return False
    
    return True</code></pre>

<p><strong>Complexity:</strong></p>
<ul>
  <li>Time: O(n²) - for each of n characters, count() scans the entire string (O(n))</li>
  <li>Space: O(1) - only using variables</li>
</ul>

<hr />

<h2>The Bottleneck</h2>

<p><strong>What's slow?</strong> Repeatedly counting the same characters!</p>

<p><strong>Why does it matter?</strong> The <code>count()</code> method scans the entire string each time, and we call it for each character = O(n²) total work.</p>

<hr />

<h2>The Optimization</h2>

<p><strong>Key insight:</strong> Count each character once and store the counts, then compare!</p>

<p><strong>The fix:</strong> Use a hash map to count characters in one pass, then compare counts.</p>

<pre><code>def is_anagram(s, t):
    if len(s) != len(t):
        return False
    
    # Count characters in s
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1
    
    # Subtract counts for characters in t
    for char in t:
        if char not in freq:
            return False
        freq[char] -= 1
        if freq[char] == 0:
            del freq[char]
    
    return len(freq) == 0</code></pre>

<p><strong>Complexity:</strong></p>
<ul>
  <li>Time: O(n) - single pass through each string</li>
  <li>Space: O(k) - where k = number of unique characters (at most 26 for lowercase)</li>
</ul>

<hr />

<h2>What Changed</h2>

<p><strong>Before:</strong> Repeated counting with <code>count()</code> → O(n²) time</p>
<p><strong>After:</strong> Single pass counting with hash map → O(n) time</p>

<p><strong>The bottleneck:</strong> Repeated scans to count characters</p>
<p><strong>The fix:</strong> Hash map to count once and store</p>

<hr />

<h2>The General Principle</h2>

<p>When you need to count or compare frequencies:</p>
<ul>
  <li><strong>Bottleneck:</strong> Repeated counting or scanning</li>
  <li><strong>Solution:</strong> Count once with a hash map, then use stored counts</li>
  <li><strong>Result:</strong> O(n²) or O(n log n) → O(n) improvement</li>
</ul>

<p>This optimization works whenever you can avoid repeated work by storing counts! 🎯</p>`,
        },

        // SLIDING WINDOW + FREQUENCY COUNTING SECTION
        {
            type: 'reading',
            id: 'sliding-window-frequency-intro',
            title: 'Sliding Window + Frequency Counting',
            estimatedReadTime: 180,
            content: `<h1>Sliding Window + Frequency Counting 🔄</h1>

<p>Now that you've mastered frequency counting, let's combine it with <strong>sliding windows</strong>!</p>

<h2>The Pattern</h2>

<p>When you need to check <strong>substrings</strong> or <strong>subarrays</strong> with frequency constraints:</p>

<ol>
  <li><strong>Use a sliding window</strong> to avoid recalculating frequencies</li>
  <li><strong>Update frequency map incrementally</strong> as the window moves</li>
  <li><strong>Check frequency conditions</strong> at each position</li>
</ol>

<h2>The Key Code Pattern</h2>

<pre><code>freq = {}  # Track frequencies in current window
left = 0   # Left boundary of window

for i, char in enumerate(s):
    # Add current character to frequency map
    freq[char] = freq.get(char, 0) + 1
    
    # Check if window violates constraint
    while constraint_violated(freq):
        # Remove leftmost character
        freq[s[left]] -= 1
        if freq[s[left]] == 0:
            del freq[s[left]]
        left += 1
    
    # Window is now valid - check answer
    update_answer()</code></pre>

<h2>Why This Works</h2>

<ul>
  <li><strong>Without sliding window:</strong> Rebuild frequency map for each substring → O(n²)</li>
  <li><strong>With sliding window:</strong> Update incrementally → O(n)</li>
</ul>

<p>Let's practice this pattern! 🎯</p>`
        },

        // Practice Problem: Longest Substring with At Most K Distinct Characters
        ,// Practice Problem: Find All Anagrams
        ,{
            type: 'reading',
            id: 'prefix-sum-hashmap',
            title: 'Prefix Sum + Hash Map',
            estimatedReadTime: 420,
            content: `<h1>Prefix Sum + Hash Map 📈</h1>

<h2>The Powerful Combo</h2>

<p><strong>Prefix sums</strong> track cumulative totals</p>
<p><strong>Hash maps</strong> remember which sums we've seen</p>

<p>Together = <strong>O(n) subarray problems!</strong></p>

<hr />

<h2>Classic: Subarray Sum Equals K</h2>

<p><strong>Problem:</strong> Count subarrays with sum = k</p>

<p><strong>Example:</strong> nums = [1, 2, 3], k = 3</p>
<p><strong>Output:</strong> 2 (subarrays [1,2] and [3])</p>

<h3>❌ Brute Force - O(n²)</h3>
<pre><code>def subarraySum(nums, k):
    count = 0

    for start in range(len(nums)):
        current_sum = 0
        for end in range(start, len(nums)):
            current_sum += nums[end]
            if current_sum == k:
                count += 1

    return count</code></pre>

<h3>✅ Prefix Sum + Hash Map - O(n)</h3>
<pre><code>def subarraySum(nums, k):
    count = 0
    prefix_sum = 0
    sum_freq = {0: 1}  # Base case: empty prefix

    for num in nums:
        prefix_sum += num

        # Check if (prefix_sum - k) exists
        # If yes, we found subarray(s) summing to k
        if (prefix_sum - k) in sum_freq:
            count += sum_freq[prefix_sum - k]

        # Record this prefix sum
        sum_freq[prefix_sum] = sum_freq.get(prefix_sum, 0) + 1

    return count</code></pre>

<p><strong>The Insight:</strong></p>

<p>If <code>prefix_sum[j] - prefix_sum[i] = k</code></p>
<p>Then <code>subarray[i+1...j]</code> has sum k!</p>

<p>So we look for: <code>prefix_sum - k</code> in our map!</p>

<hr />

<h2>Visualization</h2>

<pre><code>nums = [1, 2, 3], k = 3

Step 0: prefix=0, sum_freq={0:1}

Step 1: num=1, prefix=0+1=1
        Looking for 1-3=-2 (not found)
        sum_freq={0:1, 1:1}

Step 2: num=2, prefix=1+2=3
        Looking for 3-3=0 (found! count=1) ← subarray [1,2]
        sum_freq={0:1, 1:1, 3:1}

Step 3: num=3, prefix=3+3=6
        Looking for 6-3=3 (found! count=2) ← subarray [3]
        sum_freq={0:1, 1:1, 3:1, 6:1}

Answer: 2 subarrays</code></pre>

<hr />

<h2>Other Applications</h2>

<p><strong>Contiguous Array (0s and 1s balanced):</strong></p>
<pre><code># Convert 0s to -1, find subarray with sum 0</code></pre>

<p><strong>Maximum Size Subarray Sum Equals K:</strong></p>
<pre><code># Store first occurrence of each prefix sum</code></pre>

<p><strong>Subarray Sums Divisible by K:</strong></p>
<pre><code># Use prefix_sum % k as key</code></pre>`,
        },// Practice Set Introduction
        {
            type: 'reading',
            id: 'hash-map-practice-intro',
            title: 'Practice Set: Hash Map Mastery',
            estimatedReadTime: 120,
            practiceExercise: {
                title: 'Try It: Group by Frequency',
                instruction: `# Group Numbers by Frequency

Given an array, group numbers that appear the same number of times.

**Examples:**
- \`[1, 2, 2, 3, 3, 3]\` → \`{1: [1], 2: [2], 3: [3]}\` (1 appears once, 2 appears twice, 3 appears thrice)
- \`[1, 1, 2, 2]\` → \`{2: [1, 2]}\` (both appear twice)

**Your Task:**
Write a function \`group_by_frequency(arr)\` that returns a dict mapping frequency to list of numbers.`,
                starterCode: `def group_by_frequency(arr):
    # Your code here
    pass

# Test your solution
print(group_by_frequency([1, 2, 2, 3, 3, 3]))  # Should print {1: [1], 2: [2], 3: [3]}
print(group_by_frequency([1, 1, 2, 2]))        # Should print {2: [1, 2]}`,
                testCases: [
                    { input: '[1, 2, 2, 3, 3, 3]', expectedOutput: '{1: [1], 2: [2], 3: [3]}' },
                    { input: '[1, 1, 2, 2]', expectedOutput: '{2: [1, 2]}' },
                ],
                difficulty: 'medium',
                solution: `def group_by_frequency(arr):
    # Solution: Two-pass approach
    # Pass 1: Count how many times each number appears
    freq = {}
    for num in arr:
        freq[num] = freq.get(num, 0) + 1

    # Pass 2: Group numbers by their frequency
    result = {}
    for num, count in freq.items():
        # If this frequency hasn't been seen, create empty list
        if count not in result:
            result[count] = []
        # Add this number to the list for this frequency
        result[count].append(num)

    return result

# Test your solution
print(group_by_frequency([1, 2, 2, 3, 3, 3]))  # Should print {1: [1], 2: [2], 3: [3]}
print(group_by_frequency([1, 1, 2, 2]))        # Should print {2: [1, 2]}`,
                targetComplexity: {
                    time: 'O(n)',
                    space: 'O(n)',
                    notes: 'Two passes: count frequencies then group; stores all elements across dictionaries'
                },
                solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Count Each Element Separately
For each unique element, count its occurrences then group:
\`\`\`python
def group_by_frequency(arr):
    result = {}
    seen = set()
    for num in arr:
        if num not in seen:
            count = 0
            for x in arr:  # Count occurrences
                if x == num:
                    count += 1
            if count not in result:
                result[count] = []
            result[count].append(num)
            seen.add(num)
    return result
\`\`\`
**Time: O(n × k)** where k is unique elements | **Space: O(n)**

### 🟡 Bottleneck Analysis
**What's inefficient?** We scan the entire array to count each unique element separately. This repeats counting work.

**Key insight:** Count all elements once, then use those counts to build the groups. Two-pass approach avoids redundant counting.

### 🟢 Optimization: Two-Pass Hash Map
\`\`\`python
def group_by_frequency(arr):
    # Pass 1: Count frequencies
    freq = {}
    for num in arr:
        freq[num] = freq.get(num, 0) + 1

    # Pass 2: Group by frequency
    result = {}
    for num, count in freq.items():
        if count not in result:
            result[count] = []
        result[count].append(num)
    return result
\`\`\`

### ✅ Final Complexity
- **Time: O(n)** - Two passes: O(n) count + O(k) group (k ≤ n)
- **Space: O(n)** - Two dictionaries store all unique elements

### 🎯 Pattern Learned
**"Two-Pass Grouping"** → Count frequencies first, then group by those frequencies. Avoids O(n²) repeated counting by caching results in hash map.`,
            },
            content: `<h1>💪 Practice Set: Hash Map Mastery</h1>

<p>Time to apply what you've learned!</p>

<hr />

<h2>What You've Learned</h2>

<p>✅ <strong>Two Sum</strong> - Finding complements with O(1) lookup</p>
<p>✅ <strong>Frequency Counting</strong> - Tracking occurrences efficiently</p>
<p>✅ <strong>Prefix Sum + Hash Map</strong> - Subarray sum problems</p>

<hr />

<h2>The Challenge</h2>

<p>You'll solve <strong>6 mixed problems</strong>.</p>

<p><strong>Important:</strong> We won't tell you which optimization to use!</p>

<p>Identify the bottleneck yourself, just like in real interviews.</p>

<hr />

<h2>Problem Types</h2>

<p>You'll see:</p>
<ul>
  <li>🔵 Easy problems (2)</li>
  <li>🟡 Medium problems (4)</li>
</ul>

<p>All solvable with optimizations you learned!</p>

<hr />

<h2>Tips</h2>

<ol>
  <li><strong>Read carefully</strong> - Look for keywords:
    <ul>
      <li>"Find pair that..." → Two Sum?</li>
      <li>"Anagram/frequency" → Frequency Counting?</li>
      <li>"Subarray with sum" → Prefix Sum?</li>
    </ul>
  </li>
  <li><strong>Remember trade-offs:</strong>
    <ul>
      <li>Hash maps use O(n) space</li>
      <li>But give O(1) lookups!</li>
    </ul>
  </li>
  <li><strong>Hints available</strong> - Stuck? Use hints!</li>
</ol>

<hr />

<h2>Progress Tracking</h2>

<p>Complete all 6 problems to finish Module 2.</p>

<p>Let's go! 🚀</p>`,
        },

        // Practice Problem 3: Group Anagrams
        ,{
            type: 'reading',
            id: 'module2-summary',
            title: 'Module Complete!',
            estimatedReadTime: 240,
            practiceExercise: {
                title: 'Try It: Word Pattern',
                instruction: `# Check Word Pattern

Given a pattern and a string, determine if the string follows the pattern.

**Examples:**
- \`"abba", "dog cat cat dog"\` → \`True\`
- \`"abba", "dog cat cat fish"\` → \`False\`
- \`"aaaa", "dog cat cat dog"\` → \`False\`

**Your Task:**
Write a function \`word_pattern(pattern, s)\` that returns True if s follows the pattern.`,
                starterCode: `def word_pattern(pattern, s):
    # Your code here
    words = s.split()
    pass

# Test your solution
print(word_pattern("abba", "dog cat cat dog"))   # Should print True
print(word_pattern("abba", "dog cat cat fish"))  # Should print False
print(word_pattern("aaaa", "dog cat cat dog"))   # Should print False`,
                testCases: [
                    { input: '"abba", "dog cat cat dog"', expectedOutput: 'True' },
                    { input: '"abba", "dog cat cat fish"', expectedOutput: 'False' },
                    { input: '"aaaa", "dog cat cat dog"', expectedOutput: 'False' },
                ],
                difficulty: 'medium',
                solution: `def word_pattern(pattern, s):
    # Solution: Use two hash maps for bidirectional mapping
    words = s.split()

    # Pattern and words must have same length
    if len(pattern) != len(words):
        return False

    # Map pattern char to word
    char_to_word = {}
    # Map word to pattern char (to ensure one-to-one mapping)
    word_to_char = {}

    for char, word in zip(pattern, words):
        # Check if char already mapped to a different word
        if char in char_to_word:
            if char_to_word[char] != word:
                return False
        else:
            char_to_word[char] = word

        # Check if word already mapped to a different char
        if word in word_to_char:
            if word_to_char[word] != char:
                return False
        else:
            word_to_char[word] = char

    return True

# Test your solution
print(word_pattern("abba", "dog cat cat dog"))   # Should print True
print(word_pattern("abba", "dog cat cat fish"))  # Should print False
print(word_pattern("aaaa", "dog cat cat dog"))   # Should print False`,
                targetComplexity: {
                    time: 'O(n + m)',
                    space: 'O(n)',
                    notes: 'n is pattern length, m is total characters in words; stores unique pattern chars and words'
                },
                solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Check All Pairs Manually
For each position, verify no conflicts with previous mappings:
\`\`\`python
def word_pattern(pattern, s):
    words = s.split()
    if len(pattern) != len(words):
        return False

    # Check all previous positions for conflicts
    for i in range(len(pattern)):
        for j in range(i):
            # If same char maps to different word: invalid
            if pattern[i] == pattern[j] and words[i] != words[j]:
                return False
            # If different chars map to same word: invalid
            if pattern[i] != pattern[j] and words[i] == words[j]:
                return False
    return True
\`\`\`
**Time: O(n²)** | **Space: O(n)** for words array

### 🟡 Bottleneck Analysis
**What's inefficient?** For each position, we scan all previous positions to check for conflicts. This nested checking is O(n²).

**Key insight:** Store mappings as we go. Use two hash maps for bidirectional validation: pattern→word and word→pattern. Check consistency in O(1) per element.

### 🟢 Optimization: Bidirectional Hash Maps
\`\`\`python
def word_pattern(pattern, s):
    words = s.split()
    if len(pattern) != len(words):
        return False

    char_to_word = {}
    word_to_char = {}

    for char, word in zip(pattern, words):
        if char in char_to_word:
            if char_to_word[char] != word:
                return False
        else:
            char_to_word[char] = word

        if word in word_to_char:
            if word_to_char[word] != char:
                return False
        else:
            word_to_char[word] = char
    return True
\`\`\`

### ✅ Final Complexity
- **Time: O(n + m)** - O(m) to split string, O(n) to iterate pattern
- **Space: O(n)** - Two hash maps store at most n unique mappings

### 🎯 Pattern Learned
**"Bidirectional Mapping"** → Use two hash maps for one-to-one relationships. Prevents conflicting mappings by checking both directions in O(1).`,
            },
            content: `<h1>🎉 Module 2 Complete!</h1>

<h2>Optimizations Mastered</h2>

<h3>1. Removing Inner Loops 🎯</h3>
<ul>
  <li><strong>Bottleneck:</strong> Nested loops scanning for complements</li>
  <li><strong>Solution:</strong> Hash map for O(1) complement lookup</li>
  <li><strong>Result:</strong> O(n²) → O(n) time, O(n) space</li>
</ul>

<p><strong>Key insight:</strong> <code>if (target - num) in seen</code> replaces inner loop</p>

<h3>2. Avoiding Repeated Counting 📊</h3>
<ul>
  <li><strong>Bottleneck:</strong> Repeatedly counting same elements</li>
  <li><strong>Solution:</strong> Count once with hash map, store counts</li>
  <li><strong>Result:</strong> O(n²) or O(n log n) → O(n) time</li>
</ul>

<p><strong>Key insight:</strong> <code>freq[key] = freq.get(key, 0) + 1</code> counts in one pass</p>

<h3>3. Eliminating Redundant Sum Calculations 📈</h3>
<ul>
  <li><strong>Bottleneck:</strong> Recalculating subarray sums</li>
  <li><strong>Solution:</strong> Store prefix sums, lookup differences</li>
  <li><strong>Result:</strong> O(n²) → O(n) time</li>
</ul>

<p><strong>Key insight:</strong> <code>if (prefix_sum - k) in sum_freq</code> finds subarrays instantly</p>

<h3>4. Bidirectional Mapping ↔️</h3>
<ul>
  <li><strong>Bottleneck:</strong> Checking one-to-one relationships with nested loops</li>
  <li><strong>Solution:</strong> Two hash maps for forward and reverse mapping</li>
  <li><strong>Result:</strong> O(n²) → O(n) time</li>
</ul>

<hr />

<h2>The Central Trade-off</h2>

<table>
  <thead>
    <tr><th>Approach</th><th>Time</th><th>Space</th><th>When to Use</th></tr>
  </thead>
  <tbody>
    <tr><td>Nested Loops</td><td>O(n²)</td><td>O(1)</td><td>Small inputs only</td></tr>
    <tr><td>Hash Map</td><td>O(n)</td><td>O(n)</td><td>Large inputs, need speed</td></tr>
    <tr><td>Sorting</td><td>O(n log n)</td><td>O(1) or O(n)</td><td>Need ordering</td></tr>
  </tbody>
</table>

<p><strong>Hash maps: Trade space for time!</strong></p>

<hr />

<h2>Bottleneck Identification Guide</h2>

<p><strong>"Find pair summing to X"</strong> → Inner loop scanning for complement</p>
<p><strong>"Count/find duplicates"</strong> → Repeated counting</p>
<p><strong>"Anagrams or same characters"</strong> → Repeated character counting</p>
<p><strong>"Subarray sum equals K"</strong> → Recalculating sums for each subarray</p>
<p><strong>"Isomorphic or pattern match"</strong> → Nested loops checking relationships</p>

<hr />

<h2>Next: Module 3</h2>

<p><strong>Linked Lists</strong> - Master pointer manipulation and list operations!</p>

<p>Ready to continue? 🚀</p>`,
        },
    
    ...module2HashMapLessonSmartPracticeExercises,
    ],
};
