import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { moduleSlidingWindowLessonSmartPracticeExercises } from './exercises/moduleSlidingWindowLessonSmartPracticeExercises';

const getSlidingWindowExercise = (id: string) => {
  const exercise = moduleSlidingWindowLessonSmartPracticeExercises.find(e => e.id === id);
  if (!exercise) {
    throw new Error(`Sliding Window exercise not found: ${id}`);
  }
  return exercise;
};

// Keep the lesson DEEP, but ensure the sidebar order is pedagogically clean.
// We author sections grouped in-file, and then apply this canonical order for learners.
const SLIDING_WINDOW_SECTION_ORDER = [
  'sliding-window-lab',
  'exercise-max-sum-subarray',

  // Fixed window (reinforcement track)
  'fixed-window-intro',
  'fixed-window-brute-force-solution',
  'fixed-window-bottlenecks',
  'fixed-window-thinking-to-optimization',
  'fixed-window-optimized-solution',
  'exercise-fixed-window-sums',

  // Variable window
  'contiguous-subarray-sum-interview',
  'variable-window-approach-analysis',
  'exercise-contiguous-subarray-sum',

  // Maximum window
  'maximum-window-intro',
  'maximum-window-brute-force',
  'maximum-window-bottlenecks',
  'maximum-window-optimization',
  'exercise-max-consecutive-ones-iii',

  // Minimum window
  'minimum-window-intro',
  'minimum-window-brute-analysis',
  'minimum-window-bottlenecks',
  'minimum-window-optimization',
  'exercise-shortest-subarray-k-ones',

  // Frequency window
  'frequency-window-intro',
  'frequency-window-brute-force',
  'frequency-window-bottlenecks',
  'frequency-window-optimization',
  'exercise-frequency-k-distinct',

  'sliding-window-summary',
] as const;

const orderSlidingWindowSections = (sections: ProgressiveLesson['sections']): ProgressiveLesson['sections'] => {
  const byId = new Map(sections.map(section => [section.id, section] as const));
  const orderedIds = new Set<string>([...SLIDING_WINDOW_SECTION_ORDER]);

  const ordered = SLIDING_WINDOW_SECTION_ORDER
    .map(id => byId.get(id))
    .filter((section): section is NonNullable<typeof section> => Boolean(section));

  const remaining = sections.filter(section => !orderedIds.has(section.id));
  return [...ordered, ...remaining];
};

export const moduleSlidingWindowLesson: ProgressiveLesson = {
  id: 'sliding-window-mastery',
  title: 'Module: Sliding Window Mastery',
  description: 'Master the 5 sliding window patterns: fixed, variable, frequency, maximum, and minimum windows',
  unlockMode: 'flexible',  // All sections accessible
  sections: orderSlidingWindowSections([
    // ==========================================
    // HANDS-ON LAB (migrated from SlidingWindowIntegratedLesson component)
    // ==========================================
    {
      type: 'reading',
      id: 'sliding-window-lab',
      title: 'Introduction: Your First Window Problem',
      estimatedReadTime: 420,
      inlineExercises: [
        {
          id: 'max-sum-brute',
          starterCode: `def maxSumSubarray(arr, k):
    # Your brute force code here
    pass`,
          testCases: [
            { input: '[2, 1, 5, 1, 3, 2], 3', expectedOutput: '9' },
            { input: '[1, 4, 2, 10, 23, 3, 1, 0, 20], 4', expectedOutput: '39' },
            { input: '[1, 2, 3, 4, 5], 2', expectedOutput: '9' }
          ],
          targetFunction: 'maxSumSubarray',
          hints: [
            'Use nested loops',
            'Outer loop: check each starting position from 0 to len(arr)-k',
            'Inner loop: sum k elements starting from current position'
          ],
          solution: `def maxSumSubarray(arr, k):
    if len(arr) < k: return 0
    max_sum = float('-inf')
    for i in range(len(arr) - k + 1):
        curr_sum = 0
        for j in range(i, i + k):
            curr_sum += arr[j]
        max_sum = max(max_sum, curr_sum)
    return max_sum`,
          successMessage: "Great job! That's the correct brute force approach. Now let's see how we can optimize it.",
          validation: (input: string) => {
            const isOptimized = (input.includes('nums[i-k]') || input.includes('arr[i-k]') || input.includes('[i - k]')) &&
              (input.includes('+') || input.includes('-')) &&
              !input.includes('for j in range');
            if (isOptimized) {
              return { success: true, message: "Wow! You've already used the optimized Sliding Window approach! You've solved it in the most efficient manner." };
            }
            return { success: true, message: "Great job! That's the correct brute force approach. Now let's see how we can optimize it." };
          },
        }
      ],
      content: `<h1>Your First Window Problem</h1>
<p>Let&#39;s solve a problem step by step, starting with brute force and then optimizing it.</p>
<blockquote>
<p><strong>Challenge:</strong> Try to optimize it to your best! If not, don&#39;t worry — we will learn how to solve such problems and practice enough that in real interviews, you will be able to solve these within 10 minutes.</p>
</blockquote>
<h2>Problem Setup</h2>
<p>Given an array and a window size <code>k</code>, find the maximum sum of any <code>k</code> consecutive elements.</p>
<p><strong>Example:</strong> <code>arr = [2, 1, 5, 1, 3, 2]</code>, <code>k = 3</code></p>
<p><strong>Expected Output:</strong> <code>9</code> (the sum of <code>[5, 1, 3]</code>)</p>

<code-editor data-id="max-sum-brute" data-height="400px"></code-editor>


<hr>
<h2>Step 1: Visual Approach - How Would You Calculate It?</h2>
<p>Let&#39;s visualize how to find the maximum sum by looking at the array itself.</p>
<h3>The Array</h3>
<pre><code>Array: [2, 1, 5, 1, 3, 2]
Index:  0  1  2  3  4  5
</code></pre>
<h3>Subarray 1: Starting at Index 0</h3>
<pre><code>Array: [2, 1, 5, 1, 3, 2]
        ████  ← 3 consecutive elements (indices 0-2)
        
Sum = 2 + 1 + 5 = 8
</code></pre>
<h3>Subarray 2: Starting at Index 1</h3>
<pre><code>Array: [2, 1, 5, 1, 3, 2]
           ████  ← 3 consecutive elements (indices 1-3)
        
Sum = 1 + 5 + 1 = 7
</code></pre>
<h3>Subarray 3: Starting at Index 2</h3>
<pre><code>Array: [2, 1, 5, 1, 3, 2]
              ████  ← 3 consecutive elements (indices 2-4)
        
Sum = 5 + 1 + 3 = 9  ← Maximum so far!
</code></pre>
<h3>Subarray 4: Starting at Index 3</h3>
<pre><code>Array: [2, 1, 5, 1, 3, 2]
                 ████  ← 3 consecutive elements (indices 3-5)
        
Sum = 1 + 3 + 2 = 6
</code></pre>
<h3>Summary</h3>
<pre><code>Subarray 1: [2, 1, 5] → Sum = 8
Subarray 2: [1, 5, 1] → Sum = 7
Subarray 3: [5, 1, 3] → Sum = 9  ← MAXIMUM!
Subarray 4: [1, 3, 2] → Sum = 6

Answer: 9
</code></pre>
<h3>Visual Comparison of All Subarrays</h3>
<pre><code>Array: [2, 1, 5, 1, 3, 2]

Subarray 1: ████                    → Sum = 8
Subarray 2:    ████                  → Sum = 7
Subarray 3:       ████               → Sum = 9  ⭐ MAXIMUM
Subarray 4:          ████            → Sum = 6
</code></pre>
<p><strong>What we&#39;re doing:</strong> Checking every possible group of 3 consecutive elements, calculating the sum of each, and keeping track of the maximum.</p>
<hr>
<h2>Step 2: Brute Force Solution</h2>
<p>Let&#39;s code the most straightforward approach: check every possible subarray of size <code>k</code>.</p>
<h3>The Brute Force Algorithm</h3>
<pre><code class="language-python">def maxSumSubarray(arr, k):
    if len(arr) &lt; k:
        return 0
    
    max_sum = float(&#39;-inf&#39;)
    
    # Check every possible subarray of size k
    for i in range(len(arr) - k + 1):
        # Calculate sum of current subarray
        subarray_sum = 0
        for j in range(i, i + k):
            subarray_sum += arr[j]
        
        # Update maximum
        max_sum = max(max_sum, subarray_sum)
    
    return max_sum
</code></pre>
<h3>Walkthrough</h3>
<p>For <code>arr = [2, 1, 5, 1, 3, 2]</code>, <code>k = 3</code>:</p>
<pre><code>i=0: Check subarray [2, 1, 5]
     subarray_sum = 2 + 1 + 5 = 8
     max_sum = max(-inf, 8) = 8

i=1: Check subarray [1, 5, 1]
     subarray_sum = 1 + 5 + 1 = 7
     max_sum = max(8, 7) = 8

i=2: Check subarray [5, 1, 3]
     subarray_sum = 5 + 1 + 3 = 9
     max_sum = max(8, 9) = 9  ← Maximum!

i=3: Check subarray [1, 3, 2]
     subarray_sum = 1 + 3 + 2 = 6
     max_sum = max(9, 6) = 9

Answer: 9
</code></pre>
<h3>Complexity Analysis</h3>
<p><strong>Time Complexity:</strong> O(n × k)</p>
<ul>
<li>Outer loop: O(n - k + 1) ≈ O(n) iterations (checking each starting position)</li>
<li>Inner loop: O(k) iterations per starting position (calculating sum of k elements)</li>
<li><strong>Total: O(n × k)</strong></li>
</ul>
<p><strong>Space Complexity:</strong> O(1)</p>
<ul>
<li>Only using a few variables: <code>max_sum</code>, <code>subarray_sum</code>, <code>i</code>, <code>j</code></li>
<li>No extra data structures needed</li>
</ul>
<p><strong>Baseline:</strong> This is our starting point. It works correctly, but can we do better?</p>
<hr>
<h2>Step 3: Can We Improve?</h2>
<p>Let&#39;s think about optimization strategies:</p>
<p><strong>Question 1: Can we improve time complexity?</strong></p>
<ul>
<li>Current: O(n × k)</li>
<li>Best possible: O(n) - we need to check each element at least once</li>
<li><strong>Goal:</strong> Reduce from O(n × k) to O(n)</li>
</ul>
<p><strong>Question 2: Can we improve space complexity?</strong></p>
<ul>
<li>Current: O(1) - already optimal!</li>
<li><strong>No improvement needed here</strong></li>
</ul>
<p><strong>Question 3: Are there tradeoffs we can make?</strong></p>
<ul>
<li>Sometimes we can use <strong>more space</strong> to improve <strong>time complexity</strong></li>
<li>This is called a <strong>space-time tradeoff</strong></li>
<li>Example: Using a hash map (O(n) space) to achieve O(1) lookups instead of O(n) linear search</li>
</ul>
<p><strong>For this problem:</strong></p>
<ul>
<li>We can improve time from O(n × k) to O(n) <strong>without</strong> using extra space</li>
<li>But in other problems, you might need to trade space for time</li>
<li>Always consider: &quot;Can I use extra space to make this faster?&quot;</li>
</ul>
<p><strong>Focus:</strong> Let&#39;s try to improve time complexity from O(n × k) to O(n) while keeping space at O(1).</p>
<hr>
<h2>Step 4: Finding Bottlenecks - What&#39;s Redundant?</h2>
<p>Let&#39;s analyze what&#39;s happening in our brute force solution:</p>
<pre><code>Array: [2, 1, 5, 1, 3, 2]

Subarray 1: ████                    → Sum: 2 + 1 + 5 = 8
Subarray 2:    ████                  → Sum: 1 + 5 + 1 = 7
Subarray 3:       ████               → Sum: 5 + 1 + 3 = 9
Subarray 4:          ████            → Sum: 1 + 3 + 2 = 6
</code></pre>
<h3>Identifying Redundant Work</h3>
<p>Look at Subarray 1 and Subarray 2:</p>
<pre><code>Array: [2, 1, 5, 1, 3, 2]

Subarray 1: ████                    → Calculates: 2 + 1 + 5
Subarray 2:    ████                  → Calculates: 1 + 5 + 1
                ░░
              Overlap!
</code></pre>
<p><strong>Bottleneck #1: Recalculating Overlapping Elements</strong></p>
<ul>
<li>Subarray 1 calculates: <code>2 + 1 + 5</code></li>
<li>Subarray 2 calculates: <code>1 + 5 + 1</code></li>
<li><strong>Problem:</strong> We&#39;re recalculating <code>1 + 5</code> twice!</li>
</ul>
<h3>Visualizing the Repetition</h3>
<pre><code>Array: [2, 1, 5, 1, 3, 2]

Subarray 1: ████                    → Sum: 2 + 1 + 5 = 8
            ░░░░                    → Already calculated: 1 + 5 = 6
            
Subarray 2:    ████                  → Sum: 1 + 5 + 1 = 7
                  ░░░░              → Recalculating: 1 + 5 = 6 again! ❌
</code></pre>
<p><strong>The Pattern:</strong></p>
<ul>
<li>Each subarray overlaps with the previous one by (k-1) elements</li>
<li>We&#39;re recalculating the sum of these overlapping elements every time</li>
<li>This is redundant work!</li>
</ul>
<h3>What Changes Between Subarrays?</h3>
<p>When moving from Subarray 1 to Subarray 2:</p>
<pre><code>Array: [2, 1, 5, 1, 3, 2]

Subarray 1: ████                    → Elements: [2, 1, 5]
Subarray 2:    ████                  → Elements: [1, 5, 1]
                
What changed?
- ❌ Removed: 2 (leftmost element, index 0)
- ✅ Added: 1 (rightmost element, index 3)
- ➡️ Unchanged: 1, 5 (middle elements, indices 1-2)
</code></pre>
<p><strong>Key Insight:</strong> Only 2 elements change (one removed, one added), but we&#39;re recalculating all 3!</p>
<hr>
<h2>Step 5: Optimizing Based on Bottlenecks</h2>
<p>Now that we&#39;ve identified the bottleneck, let&#39;s fix it:</p>
<h3>The Optimization Strategy</h3>
<p>Instead of recalculating the entire sum, we can <strong>update it incrementally</strong>:</p>
<pre><code>Subarray 1: Sum = 2 + 1 + 5 = 8

Move to Subarray 2:
  Start with Subarray 1&#39;s sum: 8
  Subtract element leaving:    8 - 2 = 6
  Add element entering:        6 + 1 = 7
  
Result: Same answer (7), but only 2 operations instead of 3!
</code></pre>
<h3>The Pattern</h3>
<pre><code>Array: [2, 1, 5, 1, 3, 2]

Subarray 1: ████                    → Sum = 8
            █  ░░                    → 2 + (1 + 5)
            
Subarray 2:    ████                  → Sum = 7
                  ░░  █              → (1 + 5) + 1
                
Pattern: new_sum = old_sum - removed + added
         7      = 8      - 2     + 1
</code></pre>
<p><strong>General Formula:</strong></p>
<pre><code>new_sum = old_sum - element_leaving + element_entering
</code></pre>
<p>This eliminates redundant calculations!</p>
<p>Let&#39;s analyze what&#39;s happening:</p>
<pre><code>Array: [2, 1, 5, 1, 3, 2]

Subarray 1: ████                    → Sum: 2 + 1 + 5 = 8
Subarray 2:    ████                  → Sum: 1 + 5 + 1 = 7
Subarray 3:       ████               → Sum: 5 + 1 + 3 = 9
Subarray 4:          ████            → Sum: 1 + 3 + 2 = 6
</code></pre>
<h3>The Problem: Overlapping Subarrays</h3>
<p>Look at Subarray 1 and Subarray 2:</p>
<pre><code>Array: [2, 1, 5, 1, 3, 2]

Subarray 1: ████                    → Calculates: 2 + 1 + 5
Subarray 2:    ████                  → Calculates: 1 + 5 + 1
                ░░
              Overlap!
</code></pre>
<p><strong>The Issue:</strong> We&#39;re recalculating the sum of elements <code>[1, 5]</code> twice!</p>
<ul>
<li>Subarray 1 calculates: <code>2 + 1 + 5</code></li>
<li>Subarray 2 calculates: <code>1 + 5 + 1</code></li>
</ul>
<p>Notice that <code>1 + 5</code> appears in both calculations. We&#39;re doing redundant work!</p>
<h3>Visualizing the Redundancy</h3>
<pre><code>Array: [2, 1, 5, 1, 3, 2]

Subarray 1: ████                    → Sum: 2 + 1 + 5 = 8
            ░░░░                    → Already calculated: 1 + 5 = 6
            
Subarray 2:    ████                  → Sum: 1 + 5 + 1 = 7
                  ░░░░              → Recalculating: 1 + 5 = 6 again!
</code></pre>
<p><strong>Key Insight:</strong> When we move from Subarray 1 to Subarray 2, we only need to:</p>
<ul>
<li>Remove <code>2</code> (leftmost element)</li>
<li>Add <code>1</code> (new rightmost element)</li>
<li>We don&#39;t need to recalculate <code>1 + 5</code>!</li>
</ul>
<hr>

<sliding-window-visualizer></sliding-window-visualizer>

<h2>Step 4: The Thought Process - How Can We Optimize?</h2>
<h3>Visual Observation</h3>
<p>Interact with the visualization above. When we slide the window from Step 1 to Step 2:</p>
<ul>
  <li>❌ <strong>Removed:</strong> The leftmost element (2)</li>
  <li>✅ <strong>Added:</strong> The new rightmost element (1)</li>
  <li>➡️ <strong>Kept:</strong> The overlapping middle elements (1, 5) stayed exactly the same!</li>
</ul>
<div style="display:none">
<pre><code>Array: [2, 1, 5, 1, 3, 2]

Subarray 1: ████                    → Sum = 8
            █  ░░                    → Elements: 2, 1, 5
            
Subarray 2:    ████                  → Sum = 7
                  ░░  █              → Elements: 1, 5, 1
                
What changed?
- ❌ Removed: 2 (leftmost, index 0)
- ✅ Added: 1 (rightmost, index 3)
- ➡️ Kept: 1, 5 (middle elements, indices 1-2)
</code></pre>
</div>
<h3>The Key Insight</h3>
<p>Instead of recalculating the entire sum, we can update it incrementally:</p>
<pre><code>Subarray 1: Sum = 2 + 1 + 5 = 8

Move to Subarray 2:
  Start with Subarray 1&#39;s sum: 8
  Subtract element leaving:    8 - 2 = 6
  Add element entering:        6 + 1 = 7
  
Result: Same answer (7), but only 2 operations instead of 3!
</code></pre>
<div style="display:none"><h3>Visual Pattern</h3>
<pre><code>Array: [2, 1, 5, 1, 3, 2]

Subarray 1: ████                    → Sum = 8
            █  ░░                    → 2 + (1 + 5)
            
Subarray 2:    ████                  → Sum = 7
                  ░░  █              → (1 + 5) + 1
                
Pattern: new_sum = old_sum - removed + added
         7      = 8      - 2     + 1
</code></pre>
</div><h3>General Pattern</h3>
<p>For any window slide:</p>
<pre><code>new_sum = old_sum - element_leaving + element_entering
</code></pre>
<hr>
<h2>Step 6: The Optimized Solution</h2>
<p>Now let&#39;s convert our brute force solution to use this optimization:</p>
<h3>Version 1: Using For Loop</h3>
<pre><code class="language-python">def maxSumSubarray(arr, k):
    if len(arr) &lt; k:
        return 0
    
    # Calculate sum of first subarray
    current_sum = sum(arr[:k])
    max_sum = current_sum
    
    # Move to next subarray
    for i in range(k, len(arr)):
        # Remove leftmost element, add rightmost element
        current_sum = current_sum - arr[i - k] + arr[i]
        max_sum = max(max_sum, current_sum)
    
    return max_sum
</code></pre>
<h3>Version 2: Using While Loop</h3>
<pre><code class="language-python">def maxSumSubarray(arr, k):
    if len(arr) &lt; k:
        return 0
    
    # Calculate sum of first subarray
    current_sum = sum(arr[:k])
    max_sum = current_sum
    
    # Move to next subarray using while loop
    i = k  # Start from index k
    while i &lt; len(arr):
        # Remove leftmost element, add rightmost element
        current_sum = current_sum - arr[i - k] + arr[i]
        max_sum = max(max_sum, current_sum)
        i += 1  # Move to next position
    
    return max_sum
</code></pre>
<p><strong>Both versions are equivalent!</strong> Choose whichever you&#39;re more comfortable with.</p>
<h3>Visual Walkthrough</h3>
<p>For <code>arr = [2, 1, 5, 1, 3, 2]</code>, <code>k = 3</code>:</p>
<pre><code>Step 0: Initialize
Array: [2, 1, 5, 1, 3, 2]
        ████                    → current_sum = 2 + 1 + 5 = 8
        max_sum = 8

Step 1: Move to next subarray (i=3)
Array: [2, 1, 5, 1, 3, 2]
        ❌  ░░  ✅              → Remove 2, Add 1
           ████                  → current_sum = 8 - 2 + 1 = 7
        max_sum = max(8, 7) = 8

Step 2: Move to next subarray (i=4)
Array: [2, 1, 5, 1, 3, 2]
           ❌  ░░  ✅            → Remove 1, Add 3
              ████               → current_sum = 7 - 1 + 3 = 9
        max_sum = max(8, 9) = 9  ← Maximum!

Step 3: Move to next subarray (i=5)
Array: [2, 1, 5, 1, 3, 2]
              ❌  ░░  ✅         → Remove 5, Add 2
                 ████            → current_sum = 9 - 5 + 2 = 6
        max_sum = max(9, 6) = 9

Answer: 9
</code></pre>
<p><strong>Legend:</strong> ❌ = Element leaving, ✅ = Element entering, ░░ = Elements staying in subarray</p>
<p><strong>Time Complexity:</strong> O(n) - We iterate once through the array, doing O(1) work per iteration.</p>
<p><strong>Space Complexity:</strong> O(1) - Only using a few variables.</p>
<hr>
<h3>Complexity Analysis</h3>
<p><strong>Time Complexity:</strong> O(n)</p>
<ul>
<li>Initialize first subarray: O(k)</li>
<li>Loop through remaining elements: O(n - k) iterations</li>
<li>Each iteration: O(1) - just subtract and add</li>
<li><strong>Total: O(k + n - k) = O(n)</strong> ✅</li>
</ul>
<p><strong>Space Complexity:</strong> O(1)</p>
<ul>
<li>Still only using a few variables</li>
<li>No change from brute force</li>
</ul>
<p><strong>Improvement:</strong> Time complexity improved from O(n × k) to O(n)! 🎉</p>
<hr>
<h2>Step 7: Comparison - Before and After</h2>
<h3>Visual Comparison</h3>
<p><strong>Brute Force Approach:</strong></p>
<pre><code>Array: [2, 1, 5, 1, 3, 2]

Subarray 1: ████                    → Calculate: 2+1+5 = 8  (3 operations)
Subarray 2:    ████                  → Calculate: 1+5+1 = 7  (3 operations) ← Recalculated!
Subarray 3:       ████               → Calculate: 5+1+3 = 9  (3 operations) ← Recalculated!
Subarray 4:          ████            → Calculate: 1+3+2 = 6  (3 operations) ← Recalculated!

Total: 4 subarrays × 3 operations = 12 operations
</code></pre>
<p><strong>Optimized Approach:</strong></p>
<pre><code>Array: [2, 1, 5, 1, 3, 2]

Subarray 1: ████                    → Calculate: 2+1+5 = 8  (3 operations)
Subarray 2:    ████                  → Update: 8-2+1 = 7  (2 operations) ← O(1) update!
Subarray 3:       ████               → Update: 7-1+3 = 9  (2 operations) ← O(1) update!
Subarray 4:          ████            → Update: 9-5+2 = 6  (2 operations) ← O(1) update!

Total: 3 + 2 + 2 + 2 = 9 operations (vs 12 in brute force)
</code></pre>
<h3>Complexity Comparison</h3>
<table>
<thead>
<tr>
<th>Approach</th>
<th>Time Complexity</th>
<th>Space Complexity</th>
<th>Operations per Subarray</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Brute Force</strong></td>
<td>O(n × k)</td>
<td>O(1)</td>
<td>O(k) - recalculates all elements</td>
</tr>
<tr>
<td><strong>Optimized</strong></td>
<td><strong>O(n)</strong> ✅</td>
<td>O(1)</td>
<td><strong>O(1)</strong> - only updates what changed</td>
</tr>
</tbody></table>
<p><strong>Key Improvement:</strong></p>
<ul>
<li><strong>Time:</strong> Reduced from O(n × k) to O(n)</li>
<li><strong>Per subarray:</strong> Reduced from O(k) operations to O(1) operations</li>
<li><strong>Eliminated:</strong> Redundant calculations of overlapping elements</li>
</ul>
<hr>
<h2>Key Takeaways</h2>
<ol>
<li><strong>Start with brute force</strong> - Get it working first, establish baseline complexity</li>
<li><strong>Ask &quot;Can we improve?&quot;</strong> - Analyze time and space complexity, identify improvement goals<ul>
<li>Consider <strong>tradeoffs</strong>: Can we use more space to improve time? (space-time tradeoff)</li>
</ul>
</li>
<li><strong>Find bottlenecks</strong> - Look for redundant work, duplicates, repetitions</li>
<li><strong>Optimize based on bottlenecks</strong> - Eliminate redundant calculations</li>
<li><strong>Compare results</strong> - Verify improvement in complexity</li>
</ol>
<p><strong>The Process:</strong></p>
<ul>
<li>Baseline (Brute Force) → Can we improve? → Find bottlenecks → Optimize → Compare</li>
</ul>
<p><strong>Important Note on Tradeoffs:</strong></p>
<ul>
<li>Sometimes you can improve time by using more space (e.g., hash maps for O(1) lookups)</li>
<li>Sometimes you can improve space by using more time (e.g., recalculating instead of storing)</li>
<li>Always consider both dimensions when optimizing!</li>
</ul>
<p>This systematic approach helps you optimize any algorithm!</p>
`
    },

    // ==========================================
    // EXERCISE: Code the Max Sum Subarray
    // ==========================================
    {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-max-sum-subarray',
      title: 'Maximum Sum Subarray of Size K',
      description: 'Implement the optimized solution for finding the maximum sum of k consecutive elements.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Use incremental updates instead of recalculating' },
      difficulty: 'easy',
      instruction: `# Maximum Sum Subarray of Size K

Given an integer array \`nums\` and an integer \`k\`, find the maximum sum of any \`k\` consecutive elements.

## Example

Input: nums = [2, 1, 5, 1, 3, 2], k = 3  
Output: 9

Explanation: The subarray [5, 1, 3] has the maximum sum of 9.

## Constraints

- \`1 <= len(nums) <= 10^5\`
- \`1 <= k <= len(nums)\`
- \`-10^4 <= nums[i] <= 10^4\`

## Your Task

Implement the optimized solution using incremental updates:
1. Calculate the sum of the first k elements
2. Slide through the array, updating the sum by subtracting the leftmost element and adding the rightmost element
3. Keep track of the maximum sum encountered

You can use either a for loop or while loop - both work!`,
      starterCode: `def maxSumSubarray(nums, k):
    # Your code here
    pass`,
      solution: {
        afterAttempt: 3,
        text: `def maxSumSubarray(nums, k):
    if len(nums) < k:
        return 0
    
    # Calculate sum of first subarray
    current_sum = sum(nums[:k])
    max_sum = current_sum
    
    # Slide through remaining elements
    for i in range(k, len(nums)):
        # Remove leftmost element, add rightmost element
        current_sum = current_sum - nums[i - k] + nums[i]
        max_sum = max(max_sum, current_sum)
    
    return max_sum`
      },
      hints: [
        { afterAttempt: 1, text: 'Start by calculating the sum of the first k elements. This is your initial window sum.' },
        { afterAttempt: 2, text: 'For each subsequent position, update the sum by subtracting the element leaving (nums[i-k]) and adding the element entering (nums[i]).' }
      ],
      testCases: [
        { input: '[2, 1, 5, 1, 3, 2], 3', expectedOutput: '9' },
        { input: '[1, 4, 2, 10, 23, 3, 1, 0, 20], 4', expectedOutput: '39' },
        { input: '[5], 1', expectedOutput: '5' },
        { input: '[1, 2, 3, 4, 5], 2', expectedOutput: '9' }
      ],
      solutionExplanation: `This solution achieves O(n) time complexity by updating the sum incrementally instead of recalculating it for each subarray. Each element is processed exactly once, making it optimal.`
    },

    // ==========================================
    // SECTION 1: Variable-Size Windows (Moved after Fixed Windows)
    // NOTE: This section teaches variable-size windows, which is more advanced.
    // It should ideally come after learning fixed-size windows.
    // ==========================================
    {
      type: 'reading',
      id: 'contiguous-subarray-sum-interview',
      title: 'Variable Window: Contiguous Subarray Sum (Discovery)',
      estimatedReadTime: 900,
      content: `<h1>Understanding Variable-Size Windows Through a Problem 🔄</h1>
<h2>The Problem</h2>
<p>Given an array of unsorted integers and an integer target, return <code>True</code> if a contiguous subarray sums up to the integer target. Otherwise, return <code>False</code>.</p>
<h3>Problem Constraints</h3>
<ul>
<li><strong>Are the integers all positive?</strong> Yes</li>
<li><strong>Is zero included?</strong> Yes</li>
<li><strong>Is the list sorted?</strong> No</li>
<li><strong>Should I enumerate all the subarrays that match?</strong> No, just return a boolean if one exists</li>
</ul>
<hr>
<h2>Examples</h2>
<pre><code class="language-python">[1, 4, 6, 21], 10  # True because [4, 6] is a subarray that sums to 10
[1, 4, 6, 21], 9   # False because there is no subarray that sums to 9
</code></pre>
<hr>
<h2>Thinking Through the Problem</h2>
<p>Let's start by trying to find the subarray using the most straightforward method.</p>

<h3>Thinking Through the Problem</h3>
<p>Let's start by trying to find the subarray using the most straightforward method.</p>
<h3>Code Challenge: Brute Force</h3>
<p>Implement the <code>hasContiguousSubarraySum</code> function below. Check every possible subarray!</p>
<code-editor data-id="exercise-contiguous-sum-brute"></code-editor>`,
      inlineExercises: [
        {
          id: 'exercise-contiguous-sum-brute',
          starterCode: `def hasContiguousSubarraySum(nums, target):
    # Your code here
    pass`,
          targetFunction: 'hasContiguousSubarraySum',
          testCases: [
            { input: '[1, 4, 6, 21], 10', expectedOutput: 'True' },
            { input: '[1, 4, 6, 21], 9', expectedOutput: 'False' },
            { input: '[5, 1, 2, 7], 8', expectedOutput: 'True' },
            { input: '[1, 2, 3], 10', expectedOutput: 'False' }
          ],
          solution: `def hasContiguousSubarraySum(nums, target):
    # Check every starting point i
    for i in range(len(nums)):
        current_sum = 0
        # Check every ending point j starting from i
        for j in range(i, len(nums)):
            current_sum += nums[j]
            if current_sum == target:
                return True
    return False`,
          successMessage: "Correct! That's the brute force solution (checking all O(n²) subarrays)."
        }
      ]
    },
    {
      type: 'reading',
      id: 'variable-window-approach-analysis',
      title: 'Variable Window: Analyze the Brute Force',
      estimatedReadTime: 300,
      content: `<h3>Analyzing the Brute Force Strategy</h3>
<p>To solve this problem, we need to:</p>
<ol>

<li><strong>Check every possible subarray</strong> (every valid <code>i</code> and <code>j</code> pair)</li>
<li><strong>Calculate the sum</strong> of each subarray</li>
<li><strong>Compare</strong> the sum to the target</li>
<li><strong>Return True</strong> if we find a match, <strong>False</strong> otherwise</li>
</ol>
<h3>Step 5: Translating to Code</h3>
<p>Let&#39;s think about how to generate all subarrays:</p>
<pre><code class="language-python"># Step 1: Try each possible start position
for i in range(len(arr)):
    # Step 2: Try each possible end position (must be &gt;= start)
    for j in range(i, len(arr)):
        # We now have a subarray from index i to j
        # Next: calculate its sum
</code></pre>
<p>How do we calculate the sum? We sum all elements from <code>i</code> to <code>j</code>:</p>
<pre><code class="language-python">subtotal = 0
for k in range(i, j + 1):  # Note: j+1 because range is exclusive
    subtotal += arr[k]
</code></pre>
<p>Putting it all together into a complete solution:</p>
<pre><code class="language-python">def containsTotal(arr, target):
    # Try every possible start position
    for i in range(len(arr)):
        # Try every possible end position (must be &gt;= start)
        for j in range(i, len(arr)):
            # Calculate sum of subarray from i to j
            subtotal = 0
            for k in range(i, j + 1):
                subtotal += arr[k]
            
            # Check if this subarray sums to target
            if subtotal == target:
                return True
    
    # No matching subarray found
    return False
</code></pre>
<h3>Step 6: Analyzing the Brute Force Solution</h3>
<p><strong>Time Complexity:</strong></p>
<ul>
<li>Outer loop: <code>n</code> iterations (start positions)</li>
<li>Middle loop: up to <code>n</code> iterations per start position</li>
<li>Inner loop: up to <code>n</code> iterations to calculate sum</li>
<li><strong>Total: O(n³)</strong></li>
</ul>
<p><strong>Space Complexity:</strong></p>
<ul>
<li>We only use a few variables (<code>i</code>, <code>j</code>, <code>k</code>, <code>subtotal</code>)</li>
<li><strong>Total: O(1)</strong></li>
</ul>
<p>This works! But can we do better? Let&#39;s see...</p>
<hr>

<h3>🟡 Approach 2: Optimized Brute Force O(n²) - Avoid Recalculating Sums</h3>
<p><strong>Key Insight:</strong> When we fix a start position <code>i</code>, we&#39;re checking subarrays:</p>
<ul>
<li><code>arr[i]</code> </li>
<li><code>arr[i] + arr[i+1]</code></li>
<li><code>arr[i] + arr[i+1] + arr[i+2]</code></li>
<li>etc.</li>
</ul>
<p>Notice that each subarray builds on the previous one! Instead of recalculating from scratch each time, we can maintain a running sum.</p>
<p><strong>Optimization:</strong> For a fixed start <code>i</code>, as we extend <code>j</code>, we just add <code>arr[j]</code> to our running sum.</p>
<pre><code class="language-python">def containsTotal(seq, target):
    for i in range(len(seq)):
        subtotal = 0  # Reset sum for each new start position
        for j in range(i, len(seq)):
            subtotal += seq[j]  # Add next element (O(1) instead of O(n))
            if subtotal == target:
                return True
    return False
</code></pre>
<p><strong>Runtime:</strong> O(n²) - We still check O(n²) subarrays, but now calculating each sum is O(1) instead of O(n).</p>
<p><strong>Space:</strong> O(1) - Still only using a few variables.</p>
<p><strong>Visualization:</strong> Array <code>[1, 4, 6, 21]</code> with target <code>10</code> - showing how running sum builds incrementally:</p>
<pre><code>Array: [1, 4, 6, 21]    Target: 10

i=0: subtotal = 0 (reset)
  ┌─────────────────────────────────────┐
  │ j=0: subtotal += 1                  │
  │ ┌───┐                               │
  │ │ 1 │  subtotal = 0 + 1 = 1         │
  │ └───┘                               │
  │ ↑i,j                                │
  └─────────────────────────────────────┘

  ┌─────────────────────────────────────┐
  │ j=1: subtotal += 4                  │
  │ ┌───┬───┐                           │
  │ │ 1 │ 4 │  subtotal = 1 + 4 = 5     │
  │ └───┴───┘                           │
  │ ↑i  ↑j                              │
  └─────────────────────────────────────┘

  ┌─────────────────────────────────────┐
  │ j=2: subtotal += 6                  │
  │ ┌───┬───┬───┐                       │
  │ │ 1 │ 4 │ 6 │  subtotal = 5 + 6 = 11│
  │ └───┴───┴───┘                       │
  │ ↑i     ↑j                           │
  └─────────────────────────────────────┘

i=1: subtotal = 0 (reset)
  ┌─────────────────────────────────────┐
  │ j=1: subtotal += 4                  │
  │        ┌───┐                        │
  │        │ 4 │  subtotal = 0 + 4 = 4   │
  │        └───┘                        │
  │        ↑i,j                         │
  └─────────────────────────────────────┘

  ┌─────────────────────────────────────┐
  │ j=2: subtotal += 6                  │
  │        ┌───┬───┐                    │
  │        │ 4 │ 6 │  subtotal = 4 + 6 = 10 ✓│
  │        └───┴───┘                    │
  │        ↑i  ↑j                       │
  └─────────────────────────────────────┘
         FOUND! Window [4, 6] sums to 10

Key: Instead of recalculating 4+6, we build on previous sum (4) + new element (6)
</code></pre>
<p>Much better! But we&#39;re still checking O(n²) subarrays. Can we do even better?</p>
<p><strong>The Problem:</strong> In Approach 2, we&#39;re still checking every possible start position <code>i</code> and every possible end position <code>j</code>. That&#39;s O(n²) combinations.</p>
<p><strong>The Question:</strong> What if we could check if ANY subarray sums to target without explicitly checking every combination?</p>
<p><strong>The Answer:</strong> Use prefix sums! Instead of checking subarrays directly, we can use a mathematical trick: if we know all prefix sums, we can check if any subarray sums to target in O(1) time!</p>
<hr>
<h3>🟢 Approach 3: O(n) Time, O(n) Space - Use Prefix Sums with a Set</h3>
<p><strong>The Problem with Approach 2:</strong> We&#39;re still checking O(n²) subarrays. What if we could check if ANY subarray sums to target in O(1) time?</p>
<p><strong>The Key Insight: Prefix Sums</strong></p>
<p>Instead of checking every subarray, let&#39;s use <strong>prefix sums</strong>. A prefix sum at index <code>i</code> is the sum of all elements from the start of the array up to (and including) index <code>i</code>.</p>
<p><strong>Example:</strong> For array <code>[1, 4, 6, 21]</code>:</p>
<ul>
<li>prefix_sum[0] = 1 (sum of [1])</li>
<li>prefix_sum[1] = 5 (sum of [1, 4])</li>
<li>prefix_sum[2] = 11 (sum of [1, 4, 6])</li>
<li>prefix_sum[3] = 32 (sum of [1, 4, 6, 21])</li>
</ul>
<p><strong>The Magic Formula:</strong> 
If we want the sum of subarray from index <code>i+1</code> to <code>j</code>, we can calculate:</p>
<pre><code>sum(subarray[i+1...j]) = prefix_sum[j] - prefix_sum[i]
</code></pre>
<p><strong>Why this works:</strong></p>
<ul>
<li><code>prefix_sum[j]</code> = sum of elements from 0 to j</li>
<li><code>prefix_sum[i]</code> = sum of elements from 0 to i</li>
<li>Subtracting them gives us the sum from i+1 to j!</li>
</ul>
<p><strong>Example:</strong> </p>
<ul>
<li>prefix_sum[2] - prefix_sum[0] = 11 - 1 = 10</li>
<li>This is the sum of subarray from index 1 to 2: [4, 6] = 10 ✓</li>
</ul>
<p><strong>The Algorithm:</strong></p>
<p>As we iterate through the array, we:</p>
<ol>
<li>Calculate the current prefix sum</li>
<li>Check if <code>current_prefix_sum - target</code> exists in our set of previous prefix sums</li>
<li>If yes, we found a subarray that sums to target!</li>
<li>Add the current prefix sum to the set for future checks</li>
</ol>
<pre><code class="language-python">def containsTotalSet(seq, target):
    sums = set([0])  # Start with prefix sum 0 (empty subarray)
    prefix_sum = 0
    
    for x in seq:
        prefix_sum += x  # Current prefix sum
        
        # Check: if prefix_sum - target is in set, we found a match!
        # This means: prefix_sum - some_previous_prefix_sum = target
        # Which means: subarray between those indices sums to target
        if (prefix_sum - target) in sums:
            return True
        
        # Store this prefix sum for future checks
        sums.add(prefix_sum)
    
    return False
</code></pre>
<p><strong>Why we check <code>(prefix_sum - target) in sums</code>:</strong></p>
<ul>
<li>If <code>prefix_sum - target = some_previous_prefix_sum</code></li>
<li>Then <code>prefix_sum - some_previous_prefix_sum = target</code></li>
<li>Which means the subarray between those two prefix sums equals target!</li>
</ul>
<p><strong>Runtime:</strong> O(n) - We iterate once through the array, and set operations are O(1).</p>
<p><strong>Space:</strong> O(n) - We store at most n prefix sums in the set.</p>
<p><strong>Visualization:</strong> Array <code>[1, 4, 6, 21]</code> with target <code>10</code> - step by step:</p>
<pre><code>Array: [1, 4, 6, 21]    Target: 10

Step 0: Initialize
  ┌─────────────────────────────────────┐
  │ prefix_sum = 0                      │
  │ Set: {0}  (prefix sum of empty array)│
  │ Check: (0 - 10) = -10 not in set    │
  └─────────────────────────────────────┘

Step 1: Process element 1 (index 0)
  ┌─────────────────────────────────────┐
  │ Array: [1, 4, 6, 21]               │
  │        ┌───┐                        │
  │        │ 1 │                        │
  │        └───┘                        │
  │        ↑                            │
  │ prefix_sum = 0 + 1 = 1              │
  │ Set: {0, 1}                         │
  │                                      │
  │ Check: (1 - 10) = -9 in set? No     │
  │ Meaning: No subarray ending here sums to 10│
  └─────────────────────────────────────┘

Step 2: Process element 4 (index 1)
  ┌─────────────────────────────────────┐
  │ Array: [1, 4, 6, 21]               │
  │        ┌───┬───┐                    │
  │        │ 1 │ 4 │                    │
  │        └───┴───┘                    │
  │        ↑   ↑                        │
  │ prefix_sum = 1 + 4 = 5              │
  │ Set: {0, 1, 5}                      │
  │                                      │
  │ Check: (5 - 10) = -5 in set? No     │
  │ Meaning: No subarray ending here sums to 10│
  └─────────────────────────────────────┘

Step 3: Process element 6 (index 2) - FOUND!
  ┌─────────────────────────────────────┐
  │ Array: [1, 4, 6, 21]               │
  │        ┌───┬───┬───┐                │
  │        │ 1 │ 4 │ 6 │                │
  │        └───┴───┴───┘                │
  │        ↑      ↑                      │
  │ prefix_sum = 5 + 6 = 11             │
  │ Set: {0, 1, 5, 11}                  │
  │                                      │
  │ Check: (11 - 10) = 1 in set? YES! ✓ │
  │                                      │
  │ This means:                          │
  │   prefix_sum[2] - prefix_sum[0] = 11 - 1 = 10│
  │   Subarray from index 1 to 2: [4, 6] = 10│
  │                                      │
  │ Found! Return True                  │
  └─────────────────────────────────────┘

Why it works:
- When prefix_sum = 11, we check if (11 - 10) = 1 is in our set
- 1 IS in our set (from prefix_sum[0])
- So: prefix_sum[2] (11) - prefix_sum[0] (1) = 10
- This gives us subarray [4, 6] which sums to 10!
</code></pre>
<hr>
<p><strong>From Approach 3 to Approach 4: The Key Insight</strong></p>
<p>Approach 3 is great - O(n) time! But it uses O(n) space to store all prefix sums. Can we do better?</p>
<p><strong>The Critical Observation:</strong> Our problem states that all integers are <strong>positive</strong> (or non-negative). This gives us a powerful property:</p>
<p><strong>Monotonic Property of Positive Numbers:</strong></p>
<ul>
<li>If we add elements to a subarray, the sum <strong>increases</strong></li>
<li>If we remove elements from a subarray, the sum <strong>decreases</strong></li>
<li>There&#39;s no way to decrease the sum by adding elements!</li>
</ul>
<p><strong>Why This Matters:</strong></p>
<p>In Approach 3, we check if <code>prefix_sum - target</code> exists in our set. But for positive integers, we can be smarter:</p>
<ol>
<li><strong>If current sum &lt; target:</strong> We need to add more elements (move right pointer forward)</li>
<li><strong>If current sum &gt; target:</strong> We need to remove elements (move left pointer forward)  </li>
<li><strong>If current sum == target:</strong> We found it!</li>
</ol>
<p><strong>The Insight:</strong> Instead of storing all prefix sums and checking backwards, we can maintain a <strong>contiguous subarray</strong> using two pointers:</p>
<ul>
<li>Start with an empty subarray (both pointers at 0)</li>
<li>Move the right pointer forward when sum is too small</li>
<li>Move the left pointer forward when sum is too large</li>
<li>Check if current sum equals target at each step</li>
</ul>
<p>This eliminates the need for the set! We only need to track the current subarray&#39;s sum.</p>
<p><strong>Visualizing the Two-Pointer Approach:</strong></p>
<p>Let&#39;s see how this works with array <code>[1, 4, 6, 21]</code> and target <code>10</code>:</p>
<pre><code>Array: [1, 4, 6, 21]    Target: 10

Initial: Both pointers at start, empty subarray
  ┌─────────────────────────────────────┐
  │ Array: [1, 4, 6, 21]               │
  │ ↑left                               │
  │ ↑right                              │
  │ Current subarray: []                │
  │ subtotal = 0                        │
  │ 0 &lt; 10, so move right pointer →     │
  └─────────────────────────────────────┘

Step 1: Move right pointer → (add element)
  ┌─────────────────────────────────────┐
  │ Array: [1, 4, 6, 21]               │
  │ ┌───┐                              │
  │ │ 1 │  subtotal = 1                │
  │ └───┘                              │
  │ ↑left                               │
  │    ↑right                           │
  │ Current subarray: [1]               │
  │ 1 &lt; 10, so move right pointer →     │
  └─────────────────────────────────────┘

Step 2: Move right pointer → (add element)
  ┌─────────────────────────────────────┐
  │ Array: [1, 4, 6, 21]               │
  │ ┌───┬───┐                           │
  │ │ 1 │ 4 │  subtotal = 5             │
  │ └───┴───┘                           │
  │ ↑left  ↑right                      │
  │ Current subarray: [1, 4]            │
  │ 5 &lt; 10, so move right pointer →     │
  └─────────────────────────────────────┘

Step 3: Move right pointer → (add element)
  ┌─────────────────────────────────────┐
  │ Array: [1, 4, 6, 21]               │
  │ ┌───┬───┬───┐                       │
  │ │ 1 │ 4 │ 6 │  subtotal = 11        │
  │ └───┴───┴───┘                       │
  │ ↑left     ↑right                    │
  │ Current subarray: [1, 4, 6]         │
  │ 11 &gt; 10, so move left pointer →     │
  └─────────────────────────────────────┘

Step 4: Move left pointer → (remove element)
  ┌─────────────────────────────────────┐
  │ Array: [1, 4, 6, 21]               │
  │     ┌───┬───┐                       │
  │     │ 4 │ 6 │  subtotal = 10        │
  │     └───┴───┘                       │
  │     ↑left  ↑right                   │
  │ Current subarray: [4, 6]            │
  │ 10 == 10 ✓ FOUND!                   │
  └─────────────────────────────────────┘

Key observations:
- When subtotal &lt; target: Move right → subarray grows → sum increases
- When subtotal &gt; target: Move left → subarray shrinks → sum decreases
- Since all numbers are positive, these moves always work as expected!
</code></pre>
<p><strong>Why This Works for Positive Integers:</strong></p>
<ul>
<li>Since numbers are positive, moving right pointer always increases sum</li>
<li>Moving left pointer always decreases sum</li>
<li>We can safely move left pointer when sum &gt; target (moving right won&#39;t help)</li>
<li>Each element is added once and removed at most once → O(n) time</li>
</ul>
<p><strong>Why It Doesn&#39;t Work with Negative Numbers:</strong></p>
<ul>
<li>With negatives, moving right pointer might decrease sum</li>
<li>Moving left pointer might increase sum</li>
<li>We can&#39;t safely move left when sum &gt; target (might miss solutions)</li>
<li>Approach 3 (prefix sum + set) still works with negatives!</li>
</ul>
<hr>
<h3>✅ Approach 4: O(n) Time, O(1) Space - Two Pointers with Expanding/Shrinking Subarray</h3>
<p><strong>This is the optimal solution for positive integers!</strong></p>
<p><strong>Pattern Recognition:</strong> This is a <strong>variable-size window</strong> problem (also called dynamic window). The window size changes as we expand (add elements) or shrink (remove elements) based on conditions.</p>
<p><strong>Note:</strong> Variable-size windows adjust <strong>gradually</strong> - they expand and shrink incrementally. This is different from &quot;reset on invalid&quot; streak problems, where the left pointer effectively jumps to start a new segment.</p>
<p><strong>The Idea:</strong> Instead of checking all subarrays or storing all prefix sums, we maintain a single contiguous subarray using two pointers (<code>start</code> and <code>end</code>). We adjust the subarray by moving these pointers based on whether the current sum is too small, too large, or just right.</p>
<pre><code class="language-python">def containsTotal(seq, target):
    start = end = 0
    subtotal = 0

    while end &lt; len(seq):
        # Move right pointer forward: add element to subarray
        subtotal += seq[end]
        end += 1

        # Move left pointer forward: remove elements if sum too large
        while subtotal &gt; target and start &lt; end - 1:
            subtotal -= seq[start]
            start += 1

        # Check if current subarray sums to target
        if subtotal == target:
            return True

    return False
</code></pre>
<p><strong>How it works with diagrams:</strong></p>
<p>Let&#39;s trace through array <code>[1, 4, 6, 21]</code> with target <code>10</code>:</p>
<pre><code>Initial state: start=0, end=0, subtotal=0
  ┌─────────────────────────────────────┐
  │ Array: [1, 4, 6, 21]               │
  │ ↑start,end                          │
  │ Current subarray: []                │
  │ subtotal = 0                        │
  └─────────────────────────────────────┘

Step 1: Move end forward (add arr[0] = 1)
  ┌─────────────────────────────────────┐
  │ Array: [1, 4, 6, 21]               │
  │ ┌───┐                              │
  │ │ 1 │  subtotal = 0 + 1 = 1        │
  │ └───┘                              │
  │ ↑start                             │
  │    ↑end                             │
  │ Current subarray: [1]              │
  │ 1 &lt; 10, continue moving end forward │
  └─────────────────────────────────────┘

Step 2: Move end forward (add arr[1] = 4)
  ┌─────────────────────────────────────┐
  │ Array: [1, 4, 6, 21]               │
  │ ┌───┬───┐                           │
  │ │ 1 │ 4 │  subtotal = 1 + 4 = 5     │
  │ └───┴───┘                           │
  │ ↑start  ↑end                        │
  │ Current subarray: [1, 4]            │
  │ 5 &lt; 10, continue moving end forward │
  └─────────────────────────────────────┘

Step 3: Move end forward (add arr[2] = 6)
  ┌─────────────────────────────────────┐
  │ Array: [1, 4, 6, 21]               │
  │ ┌───┬───┬───┐                       │
  │ │ 1 │ 4 │ 6 │  subtotal = 5 + 6 = 11│
  │ └───┴───┴───┘                       │
  │ ↑start     ↑end                     │
  │ Current subarray: [1, 4, 6]         │
  │ 11 &gt; 10, need to move start forward!│
  └─────────────────────────────────────┘

Step 4: Move start forward (remove arr[0] = 1)
  ┌─────────────────────────────────────┐
  │ Array: [1, 4, 6, 21]               │
  │     ┌───┬───┐                       │
  │     │ 4 │ 6 │  subtotal = 11 - 1 = 10│
  │     └───┴───┘                       │
  │     ↑start  ↑end                    │
  │ Current subarray: [4, 6]            │
  │ 10 == 10 ✓ FOUND!                   │
  └─────────────────────────────────────┘

Why moving start forward works:
- When subtotal = 11 &gt; 10, we know adding more elements (moving end) 
  will only make it larger (since all numbers are positive)
- So we safely remove elements from the left (move start forward)
- This decreases the sum, potentially bringing us to the target
</code></pre>
<p><strong>Key Differences from Approach 3:</strong></p>
<ul>
<li><strong>Approach 3:</strong> Stores all prefix sums in a set, checks if <code>prefix_sum - target</code> exists</li>
<li><strong>Approach 4:</strong> Maintains a single contiguous subarray, adjusts it by moving pointers</li>
<li><strong>Space:</strong> O(1) instead of O(n) - we don&#39;t need to store all prefix sums!</li>
</ul>
<p><strong>Why We Can Safely Move Start Forward:</strong>
Since all numbers are positive:</p>
<ul>
<li>If subtotal &gt; target, moving end forward will only increase the sum</li>
<li>So we can safely move start forward (remove elements) until subtotal ≤ target</li>
<li>This is the key insight that lets us avoid storing all prefix sums!</li>
</ul>
<h3>⚠️ Why Asking Clarifying Questions Matters</h3>
<p><strong>Critical insight:</strong> The constraint &quot;Are the integers all positive?&quot; completely changes which approach you should use!</p>
<p><strong>What happens if you DON&#39;T ask this question:</strong></p>
<p>If you assume numbers can be negative (or don&#39;t ask), you&#39;ll likely solve this using <strong>Approach 3</strong> (prefix sum + hash set):</p>
<ul>
<li>O(n) time, O(n) space</li>
<li>Works with any numbers (positive, negative, zero)</li>
<li>This is the &quot;safe&quot; general solution</li>
</ul>
<p><strong>But if you DO ask and learn numbers are always positive:</strong></p>
<p>You can use <strong>Approach 4</strong> (two pointers):</p>
<ul>
<li>O(n) time, <strong>O(1) space</strong> ← Much better!</li>
<li>Only works because numbers are positive</li>
<li>This is the optimal solution for this constraint</li>
</ul>
<p><strong>The Real-World Impact:</strong></p>
<pre><code>Scenario 1: You don&#39;t ask about positive numbers
─────────────────────────────────────────────
You solve with Approach 3 (prefix sum + set)
✅ Correct solution
✅ Works for all cases
❌ Uses O(n) extra space
❌ More complex code

Scenario 2: You ask and learn numbers are positive
─────────────────────────────────────────────
You solve with Approach 4 (two pointers)
✅ Correct solution  
✅ Uses O(1) space (optimal!)
✅ Simpler, cleaner code
✅ Better performance
</code></pre>
<p><strong>Interview Reality:</strong></p>
<p>In real interviews, constraints are often <strong>not explicitly stated</strong>. You must ask:</p>
<ul>
<li>&quot;Can the numbers be negative?&quot; → Determines if two pointers work</li>
<li>&quot;Are all numbers positive?&quot; → Allows O(1) space optimization</li>
<li>&quot;What&#39;s the range of numbers?&quot; → Affects which data structures to use</li>
</ul>
<p><strong>The Lesson:</strong> Always ask about constraints! They determine:</p>
<ol>
<li>Which algorithm approach to use</li>
<li>What optimizations are possible</li>
<li>Whether your solution is optimal</li>
</ol>
<p><strong>In this problem:</strong> Asking &quot;Are numbers positive?&quot; lets you use the optimal O(1) space solution instead of the O(n) space solution! 🎯</p>
<hr>
<h2>Why Explore Multiple Approaches?</h2>
<p>You might wonder: &quot;If we know numbers are positive and Approach 4 is optimal, why learn Approach 3?&quot;</p>
<p><strong>Excellent question!</strong> Here&#39;s the honest answer:</p>
<h3>The Real-World Reality</h3>
<p><strong>In actual problems and interviews:</strong></p>
<ul>
<li>You often <strong>don&#39;t know the constraints upfront</strong></li>
<li>The problem might allow negative numbers</li>
<li>You need to solve it <strong>first</strong>, then optimize based on constraints</li>
<li>Approach 3 is the <strong>general solution</strong> that works for all cases</li>
</ul>
<h3>Why Approach 3 Still Matters</h3>
<p><strong>1. It&#39;s the General Solution</strong></p>
<ul>
<li>Approach 3 works with <strong>any</strong> numbers (positive, negative, zero)</li>
<li>Approach 4 only works with positive integers</li>
<li>If constraints change, Approach 3 still works!</li>
</ul>
<p><strong>2. Teaches Critical Concepts</strong></p>
<ul>
<li><strong>Prefix sums</strong> - used in many problems (subarray problems, range queries)</li>
<li><strong>Hash sets for lookups</strong> - fundamental technique</li>
<li><strong>Mathematical insight</strong>: <code>prefix_sum[j] - prefix_sum[i] = subarray sum</code></li>
<li>These concepts appear in dozens of other problems!</li>
</ul>
<p><strong>3. Problem-Solving Progression</strong></p>
<ul>
<li>Shows how to think: &quot;Can I use a data structure to optimize?&quot;</li>
<li>Demonstrates the power of hash sets for O(1) lookups</li>
<li>Teaches you to recognize when prefix sums are useful</li>
</ul>
<p><strong>4. Interview Strategy</strong></p>
<ul>
<li>Many interviewers will ask: &quot;What if numbers can be negative?&quot;</li>
<li>If you only know Approach 4, you&#39;re stuck!</li>
<li>Knowing Approach 3 shows you understand the general case</li>
</ul>
<h3>The Learning Path</h3>
<p><strong>Approach 1 → Approach 2:</strong> Learn to avoid redundant calculations
<strong>Approach 2 → Approach 3:</strong> Learn to use data structures (hash sets) and mathematical insights (prefix sums)
<strong>Approach 3 → Approach 4:</strong> Learn to exploit constraints (positive integers) for better space complexity</p>
<h3>When to Use Which?</h3>
<ul>
<li><strong>Approach 1:</strong> Understanding the problem (always start here mentally)</li>
<li><strong>Approach 2:</strong> Quick O(n²) solution when you need something simple</li>
<li><strong>Approach 3:</strong> <strong>General case</strong> - works with any numbers, O(n) time</li>
<li><strong>Approach 4:</strong> <strong>Optimized case</strong> - only when numbers are guaranteed positive, O(n) time + O(1) space</li>
</ul>
<p><strong>Bottom line:</strong> Approach 3 teaches you techniques that work everywhere. Approach 4 is a special optimization for positive integers. You need both in your toolkit! 🎯</p>
<hr>
<h2>Interview Strategy: Solving in 10 Minutes ⏱️</h2>
<p><strong>Reality check:</strong> You won&#39;t go through all 4 approaches in an interview! Here&#39;s the efficient path:</p>
<h3>The Quick Path (5-7 minutes)</h3>
<p><strong>1. Understand the Problem (30 seconds)</strong></p>
<ul>
<li>Read the problem carefully</li>
<li>Ask clarifying questions: &quot;Are numbers positive? Can they be negative?&quot;</li>
<li>Confirm: &quot;So I need to find if any contiguous subarray sums to target?&quot;</li>
</ul>
<p><strong>2. Think About Brute Force (1 minute)</strong></p>
<ul>
<li>Mentally: &quot;I could check all subarrays - that&#39;s O(n²) subarrays&quot;</li>
<li>&quot;For each, calculate sum - that&#39;s O(n³) total&quot;</li>
<li><strong>Don&#39;t code this!</strong> Just mention: &quot;Brute force would be O(n³)&quot;</li>
</ul>
<p><strong>3. First Optimization (1 minute)</strong></p>
<ul>
<li>&quot;I can optimize by building sums incrementally - O(n²)&quot;</li>
<li><strong>Still don&#39;t code!</strong> Just recognize the pattern</li>
</ul>
<p><strong>4. Key Insight: Recognize the Pattern (2-3 minutes)</strong></p>
<ul>
<li><p><strong>If numbers are positive:</strong> &quot;This is a two-pointer problem!&quot;</p>
<ul>
<li>&quot;I can maintain a window, expand when sum &lt; target, shrink when sum &gt; target&quot;</li>
<li>&quot;Since numbers are positive, I can safely shrink when sum exceeds target&quot;</li>
<li><strong>Code Approach 4 directly</strong> (the optimal solution)</li>
</ul>
</li>
<li><p><strong>If numbers can be negative:</strong> &quot;I&#39;ll use prefix sums with a hash set&quot;</p>
<ul>
<li>&quot;Store prefix sums, check if (current_prefix - target) exists&quot;</li>
<li><strong>Code Approach 3</strong> (the general solution)</li>
</ul>
</li>
</ul>
<p><strong>5. Code the Solution (2-3 minutes)</strong></p>
<ul>
<li>Write clean, working code</li>
<li>Use Approach 4 if positive integers, Approach 3 otherwise</li>
<li>Add comments for clarity</li>
</ul>
<p><strong>6. Test &amp; Explain (1-2 minutes)</strong></p>
<ul>
<li>Walk through an example</li>
<li>Explain time/space complexity</li>
<li>Handle edge cases</li>
</ul>
<h3>The Key Recognition</h3>
<p><strong>Pattern Recognition (the most important skill!):</strong></p>
<ul>
<li><strong>&quot;Contiguous subarray sum&quot;</strong> + <strong>&quot;positive integers&quot;</strong> → Two pointers!</li>
<li><strong>&quot;Contiguous subarray sum&quot;</strong> + <strong>&quot;can be negative&quot;</strong> → Prefix sums + hash set!</li>
</ul>
<p><strong>You don&#39;t need to derive it from scratch</strong> - recognize the pattern and go straight to the optimal solution!</p>
<h3>What Interviewers Want to See</h3>
<p>✅ <strong>Pattern recognition</strong> - &quot;This looks like a two-pointer problem&quot;
✅ <strong>Constraint awareness</strong> - &quot;Since numbers are positive, I can use...&quot;
✅ <strong>Clean code</strong> - Working solution with good variable names
✅ <strong>Complexity analysis</strong> - &quot;O(n) time, O(1) space&quot;
✅ <strong>Edge case handling</strong> - &quot;What if target is 0? What if array is empty?&quot;</p>
<p>❌ <strong>NOT:</strong> Going through all 4 approaches step by step
❌ <strong>NOT:</strong> Coding brute force first (unless interviewer asks)</p>
<h3>If Interviewer Asks &quot;What About Negative Numbers?&quot;</h3>
<p><strong>Perfect follow-up!</strong> This is where Approach 3 shines:</p>
<ul>
<li>&quot;If numbers can be negative, the two-pointer approach won&#39;t work&quot;</li>
<li>&quot;I&#39;d use prefix sums with a hash set - that&#39;s Approach 3&quot;</li>
<li>&quot;It&#39;s still O(n) time but O(n) space instead of O(1)&quot;</li>
</ul>
<h3>The 10-Minute Breakdown</h3>
<pre><code>0:00-0:30  Understand problem, ask questions
0:30-1:30  Recognize pattern, choose approach
1:30-4:30  Code the solution (Approach 4 or 3)
4:30-6:00  Test with examples, explain complexity
6:00-10:00 Handle edge cases, discuss follow-ups
</code></pre>
<p><strong>Bottom line:</strong> In an interview, you&#39;d jump straight to Approach 4 (if positive) or Approach 3 (if negative). The other approaches are for <strong>learning</strong> the concepts, not for interview execution! 🎯</p>
<hr>
<h2>Complexity Comparison</h2>
<table>
<thead>
<tr>
<th>Approach</th>
<th>Time</th>
<th>Space</th>
<th>Notes</th>
</tr>
</thead>
<tbody><tr>
<td>Approach 1 (Triple Loop)</td>
<td>O(n³)</td>
<td>O(1)</td>
<td>Recalculates each subarray sum</td>
</tr>
<tr>
<td>Approach 2 (Double Loop)</td>
<td>O(n²)</td>
<td>O(1)</td>
<td>Builds on previous sum</td>
</tr>
<tr>
<td>Approach 3 (Prefix Sum Set)</td>
<td>O(n)</td>
<td>O(n)</td>
<td>Works with negative numbers too</td>
</tr>
<tr>
<td>Approach 4 (Two Pointers)</td>
<td>O(n)</td>
<td>O(1)</td>
<td><strong>Optimal for positive integers</strong></td>
</tr>
</tbody></table>
<hr>
<h2>Common Mistakes</h2>
<h3>1. Incorrectly Handling Zero</h3>
<p><strong>Problem:</strong> If you allow <code>start == end</code> when computing the window, you need a special case when <code>target == 0</code>.</p>
<p><strong>Wrong:</strong></p>
<pre><code class="language-python"># This might incorrectly return True for target=0 with empty window
while subtotal &gt; target:  # Should be &gt;= for some cases
    ...
</code></pre>
<p><strong>Correct:</strong></p>
<pre><code class="language-python"># Ensure we&#39;re checking non-empty subarrays
while subtotal &gt; target and start &lt; end - 1:
    subtotal -= seq[start]
    start += 1
</code></pre>
<h3>2. Order of Conditions</h3>
<p>The order of conditions matters when handling edge cases with 0.</p>
<hr>
<h2>Follow-Up Questions</h2>
<h3>1. What if we added a constraint of a max or min length required for the subarray?</h3>
<p><strong>For Two Pointers (Approach 4):</strong> Add a small check to see if <code>end - start</code> satisfies the max or min length.</p>
<p><strong>For Set Approach (Approach 3):</strong> Keep a map (key: subarray sum, value: length) to store information about the length instead of just a set.</p>
<h3>2. Would this work with negative integers?</h3>
<ul>
<li><strong>Approach 1 and 2:</strong> ✅ Works because you&#39;re generating all subarrays</li>
<li><strong>Approach 3 (Set):</strong> ✅ Works because a set of all previous prefix sums allows you to split any larger subarray</li>
<li><strong>Approach 4 (Two Pointers):</strong> ❌ <strong>Does NOT work</strong> because you can&#39;t assume:<ul>
<li>Increasing <code>start</code> will decrease the sum</li>
<li>Increasing <code>end</code> will increase the sum</li>
</ul>
</li>
</ul>
<hr>
<h2>🎯 Pattern: Variable-Size Windows</h2>
<p>When you need to find a subarray with a <strong>specific sum</strong> and all values are <strong>positive</strong>:</p>
<ol>
<li>Expand window by adding elements from the right</li>
<li>Shrink from left when sum exceeds target</li>
<li>Check if current sum matches target</li>
<li>Each element enters and leaves window at most once → O(n)</li>
</ol>
<p><strong>Key recognition:</strong> &quot;Find subarray with sum = X&quot; with positive integers → Two Pointers!</p>
`
    },

    // ==========================================
    // PRACTICE: Variable Window Exercise
    // ==========================================
    getSlidingWindowExercise('exercise-contiguous-subarray-sum'),

    // ==========================================
    // SECTION 2: Fixed Windows
    // ==========================================
    {
      type: 'reading',
      id: 'fixed-window-intro',
      title: 'Fixed Window: Subarray of Length K with Most 1\'s',
      estimatedReadTime: 180,
      content: `<h1>Problem: Subarray of Length K with Most 1&#39;s 🔢</h1>
<p>Given an array of 0&#39;s and 1&#39;s and a number <code>k</code>, find the subarray of length <code>k</code> with the most 1&#39;s.</p>
<h2>Example</h2>
<p><strong>Input:</strong> <code>nums = [1,0,0,1,1,0,1,0,1,1,1,0,0,1]</code>, <code>k = 5</code></p>
<p><strong>Visualization:</strong></p>
<pre><code>Array: 1 0 0 1 1 0 1 0 1 1 1 0 0 1
       [_____]  ← Window 1: [1,0,0,1,1] → 3 ones
        [_____]  ← Window 2: [0,0,1,1,0] → 2 ones
         [_____]  ← Window 3: [0,1,1,0,1] → 3 ones
          [_____]  ← Window 4: [1,1,0,1,0] → 3 ones
           [_____]  ← Window 5: [1,0,1,0,1] → 3 ones
            [_____]  ← Window 6: [0,1,0,1,1] → 3 ones
             [_____]  ← Window 7: [1,0,1,1,1] → 4 ones ← MAX!
              [_____]  ← Window 8: [0,1,1,1,0] → 3 ones
               [_____]  ← Window 9: [1,1,1,0,0] → 3 ones
                [_____]  ← Window 10: [1,1,0,0,1] → 3 ones
</code></pre>
<p><strong>Output:</strong> <code>4</code> (maximum number of 1&#39;s in any window of length 5)</p>
<h2>Constraints</h2>
<ul>
<li><code>1 &lt;= nums.length &lt;= 10^5</code></li>
<li><code>nums[i]</code> is either <code>0</code> or <code>1</code></li>
<li><code>1 &lt;= k &lt;= nums.length</code></li>
</ul>
<p>Let&#39;s solve this step by step, starting with the most straightforward approach.</p>
<h3>Code Challenge</h3>
<p>Implement the <code>maxOnesSubarray</code> function below using a <strong>Brute Force</strong> approach (check every window).</p>
<code-editor data-id="exercise-max-ones-fixed-k"></code-editor>`,
      inlineExercises: [
        {
          id: 'exercise-max-ones-fixed-k',
          starterCode: `def maxOnesSubarray(nums, k):
    # Your code here
    pass`,
          targetFunction: 'maxOnesSubarray',
          testCases: [
            { input: '[1,0,0,1,1,0,1,0,1,1,1,0,0,1], 5', expectedOutput: '4' },
            { input: '[1,1,1,0,0,0,1,1,1,1,0], 3', expectedOutput: '3' },
            { input: '[0,0,0], 2', expectedOutput: '0' },
            { input: '[1,1,1,1], 4', expectedOutput: '4' }
          ],
          solution: `def maxOnesSubarray(nums, k):
    if len(nums) < k:
        return 0
    
    max_ones = 0
    
    # Check every window of length k
    for i in range(len(nums) - k + 1):
        # Count 1's in current window
        count = 0
        for j in range(i, i + k):
            if nums[j] == 1:
                count += 1
        max_ones = max(max_ones, count)
    
    return max_ones`,
          successMessage: "Great job! That's the correct brute force approach."
        }
      ]
    },

    {
      type: 'reading',
      id: 'fixed-window-brute-force-solution',
      title: 'Fixed Window: Brute Force',
      estimatedReadTime: 300,
      content: `<h1>Brute Force Solution: How Would You Solve It? 💭</h1>
<p>The most straightforward approach is to check every possible window of length <code>k</code> and count the 1&#39;s in each.</p>
<h2>The Brute Force Algorithm</h2>
<pre><code class="language-python">def maxOnesSubarray(nums, k):
    if len(nums) &lt; k:
        return 0
    
    max_ones = 0
    
    # Check every window of length k
    for i in range(len(nums) - k + 1):
        # Count 1&#39;s in current window
        count = 0
        for j in range(i, i + k):
            if nums[j] == 1:
                count += 1
        max_ones = max(max_ones, count)
    
    return max_ones
</code></pre>
<h2>Step-by-Step Walkthrough</h2>
<p><strong>Input:</strong> <code>nums = [1,0,0,1,1,0,1,0,1,1,1,0,0,1]</code>, <code>k = 5</code></p>
<pre><code>i=0: Check window [1,0,0,1,1]
     j=0: nums[0]=1 → count=1
     j=1: nums[1]=0 → count=1
     j=2: nums[2]=0 → count=1
     j=3: nums[3]=1 → count=2
     j=4: nums[4]=1 → count=3
     max_ones = max(0, 3) = 3

i=1: Check window [0,0,1,1,0]
     j=1: nums[1]=0 → count=0
     j=2: nums[2]=0 → count=0
     j=3: nums[3]=1 → count=1
     j=4: nums[4]=1 → count=2
     j=5: nums[5]=0 → count=2
     max_ones = max(3, 2) = 3

i=2: Check window [0,1,1,0,1]
     ... (count all 1&#39;s)
     count = 3, max_ones = 3

i=6: Check window [1,0,1,1,1]
     j=6: nums[6]=1 → count=1
     j=7: nums[7]=0 → count=1
     j=8: nums[8]=1 → count=2
     j=9: nums[9]=1 → count=3
     j=10: nums[10]=1 → count=4
     max_ones = max(3, 4) = 4 ← MAX!
</code></pre>
<h2>Visual Diagram</h2>
<pre><code>Array: 1 0 0 1 1 0 1 0 1 1 1 0 0 1
       [_____]  ← Window 1: Count 1&#39;s → 3
        [_____]  ← Window 2: Count 1&#39;s → 2
         [_____]  ← Window 3: Count 1&#39;s → 3
          [_____]  ← Window 4: Count 1&#39;s → 3
           [_____]  ← Window 5: Count 1&#39;s → 3
            [_____]  ← Window 6: Count 1&#39;s → 3
             [_____]  ← Window 7: Count 1&#39;s → 4 ← MAX!
              [_____]  ← Window 8: Count 1&#39;s → 3
</code></pre>
<h2>Time Complexity Analysis</h2>
<ul>
<li><strong>Outer loop:</strong> <code>O(n - k + 1) ≈ O(n)</code> starting positions</li>
<li><strong>Inner loop:</strong> <code>O(k)</code> to count 1&#39;s in each window</li>
<li><strong>Total:</strong> <code>O(n × k)</code></li>
</ul>
<h2>Space Complexity</h2>
<ul>
<li><strong>O(1)</strong> - only using a few variables (<code>max_ones</code>, <code>count</code>, <code>i</code>, <code>j</code>)</li>
</ul>
<h2>Does It Work?</h2>
<p>✅ <strong>Yes!</strong> This solution correctly finds the maximum number of 1&#39;s in any window of length <code>k</code>.</p>
<p><strong>But is it efficient?</strong> Let&#39;s analyze what&#39;s happening...</p>
`
    },

    {
      type: 'reading',
      id: 'fixed-window-bottlenecks',
      title: 'Fixed Window: Bottleneck Analysis',
      estimatedReadTime: 240,
      content: `<h1>Bottleneck Analysis: What&#39;s Inefficient? 🔍</h1>
<p>Let&#39;s analyze your brute force solution to find the bottlenecks.</p>
<h2>The Brute Force Approach</h2>
<pre><code class="language-python">def maxOnesSubarray(nums, k):
    max_ones = 0
    for i in range(len(nums) - k + 1):  # O(n) starting positions
        count = 0
        for j in range(i, i + k):       # O(k) to count each window
            if nums[j] == 1:
                count += 1
        max_ones = max(max_ones, count)
    return max_ones
</code></pre>
<h2>Bottleneck: Redundant Counting</h2>
<p><strong>Example:</strong> <code>nums = [1,0,0,1,1,0,1,0,1,1,1,0,0,1]</code>, <code>k = 5</code></p>
<p>Look at what we count:</p>
<pre><code>Window 1: [1,0,0,1,1] → Count: 1+0+0+1+1 = 3 ones
Window 2: [0,0,1,1,0] → Count: 0+0+1+1+0 = 2 ones
Window 3: [0,1,1,0,1] → Count: 0+1+1+0+1 = 3 ones
</code></pre>
<p><strong>The Problem:</strong> Windows overlap! Look at Window 1 and Window 2:</p>
<pre><code>Window 1: [1,0,0,1,1]
Window 2:   [0,0,1,1,0]
            ↑↑↑↑↑
          These 4 elements are the same!
</code></pre>
<p>We&#39;re recounting the same elements over and over!</p>
<h2>The Key Insight</h2>
<p><strong>Instead of recalculating:</strong></p>
<pre><code>Window 1: [1,0,0,1,1] → Count from scratch: 3 ones
Window 2: [0,0,1,1,0] → Count from scratch: 2 ones  ← Recalculated!
Window 3: [0,1,1,0,1] → Count from scratch: 3 ones  ← Recalculated!
</code></pre>
<p><strong>You update incrementally:</strong></p>
<pre><code>Window 1: [1,0,0,1,1] → Count: 3 ones
Window 2: [0,0,1,1,0] → Count: 3 - 1 + 0 = 2 ones  ← O(1) update!
Window 3: [0,1,1,0,1] → Count: 2 - 0 + 1 = 3 ones  ← O(1) update!
</code></pre>
<p><strong>How?</strong></p>
<ul>
<li>Window 2 removes <code>nums[0] = 1</code> (subtract 1)</li>
<li>Window 2 adds <code>nums[5] = 0</code> (add 0)</li>
<li>Net change: -1 + 0 = -1, so 3 - 1 = 2</li>
</ul>
<p><strong>The Pattern:</strong> When sliding the window:</p>
<ol>
<li><strong>Remove</strong> the element leaving (leftmost)</li>
<li><strong>Add</strong> the element entering (rightmost)</li>
<li><strong>Update</strong> the count incrementally</li>
</ol>
<p>This eliminates redundant counting! 🎯</p>
`
    },

    {
      type: 'reading',
      id: 'fixed-window-thinking-to-optimization',
      title: 'Fixed Window: Optimize with Sliding Update',
      estimatedReadTime: 300,
      content: `<h1>Thinking Through the Optimization 🧠</h1>
<p>Now that we&#39;ve identified the bottlenecks, let&#39;s think through how to optimize this step by step.</p>
<h2>The Key Question</h2>
<p><strong>How can we avoid recounting elements that are already in the window?</strong></p>
<h2>Step 1: Observe the Overlap</h2>
<p>When we slide from Window 1 to Window 2:</p>
<pre><code>Window 1: [1,0,0,1,1] → Count: 3
Window 2:   [0,0,1,1,0] → Count: 2

What changed?
- Removed: nums[0] = 1 (leftmost element)
- Added: nums[5] = 0 (rightmost element)
- Everything else stayed the same!
</code></pre>
<h2>Step 2: The Insight</h2>
<p>Instead of counting all 5 elements again, we can:</p>
<ol>
<li><strong>Start with Window 1&#39;s count:</strong> 3</li>
<li><strong>Subtract</strong> the element leaving: 3 - 1 = 2</li>
<li><strong>Add</strong> the element entering: 2 + 0 = 2</li>
</ol>
<p><strong>Result:</strong> Same answer, but O(1) instead of O(k)!</p>
<h2>Step 3: Generalizing the Pattern</h2>
<p>For any window slide:</p>
<pre><code>New count = Old count - Element leaving + Element entering
</code></pre>
<h2>Step 4: Implementing the Optimization</h2>
<p><strong>Initialization:</strong></p>
<ul>
<li>Calculate the count for the first window: <code>[nums[0], nums[1], ..., nums[k-1]]</code></li>
<li>This is our starting point</li>
</ul>
<p><strong>Sliding:</strong></p>
<ul>
<li>For each new position <code>r</code> (starting from <code>k</code>):<ul>
<li>Element leaving: <code>nums[r - k]</code> (the leftmost element of previous window)</li>
<li>Element entering: <code>nums[r]</code> (the new rightmost element)</li>
<li>Update: <code>count = count - nums[r-k] + nums[r]</code></li>
</ul>
</li>
</ul>
<h2>Visual Walkthrough</h2>
<p><strong>Input:</strong> <code>nums = [1,0,0,1,1,0,1,0,1,1,1,0,0,1]</code>, <code>k = 5</code></p>
<pre><code>Initialize: count = sum([1,0,0,1,1]) = 3, max_ones = 3

Slide to position 5:
  Element leaving: nums[0] = 1
  Element entering: nums[5] = 0
  count = 3 - 1 + 0 = 2
  max_ones = max(3, 2) = 3

Slide to position 6:
  Element leaving: nums[1] = 0
  Element entering: nums[6] = 1
  count = 2 - 0 + 1 = 3
  max_ones = max(3, 3) = 3

Slide to position 10:
  Element leaving: nums[5] = 0
  Element entering: nums[10] = 1
  count = 3 - 0 + 1 = 4
  max_ones = max(3, 4) = 4 ← MAX!
</code></pre>
<h2>The Optimized Algorithm</h2>
<pre><code class="language-python">def maxOnesSubarray(nums, k):
    if len(nums) &lt; k:
        return 0
    
    # Initialize: count 1&#39;s in first k elements
    windowOnes = sum(nums[:k])  # Since nums[i] is 0 or 1, sum = count
    maxOnes = windowOnes
    
    # Slide window: update incrementally
    for r in range(k, len(nums)):
        windowOnes = windowOnes - nums[r - k] + nums[r]
        maxOnes = max(maxOnes, windowOnes)
    
    return maxOnes
</code></pre>
<h2>Why This Works</h2>
<ul>
<li><strong>Each element is added once</strong> when it enters the window</li>
<li><strong>Each element is removed once</strong> when it leaves the window</li>
<li><strong>No redundant counting</strong> - we only look at what changes</li>
<li><strong>O(1) per slide</strong> instead of O(k)</li>
</ul>
<h2>Complexity Improvement</h2>
<p><strong>Before:</strong> O(n × k) - recalculate for each window
<strong>After:</strong> O(n) - single pass with O(1) updates</p>
<p><strong>Improvement:</strong> From O(n × k) to O(n) - a huge speedup! 🚀</p>
`
    },

    {
      type: 'reading',
      id: 'fixed-window-optimized-solution',
      title: 'Fixed Window: The Optimized Solution',
      estimatedReadTime: 300,
      content: `<h1>The Optimized Solution ⚡</h1>
<p>Based on our thinking through the optimization, here&#39;s the final solution:</p>
<h2>The Optimized Code</h2>
<pre><code class="language-python">def maxOnesSubarray(nums, k):
    if len(nums) &lt; k:
        return 0
    
    # Initialize: count 1&#39;s in first k elements
    windowOnes = sum(nums[:k])  # Since nums[i] is 0 or 1, sum = count of 1&#39;s
    maxOnes = windowOnes
    
    # Slide window: add new element, remove old element
    for r in range(k, len(nums)):
        windowOnes += nums[r]      # Add new element (0 or 1)
        windowOnes -= nums[r - k]  # Remove old element (0 or 1)
        maxOnes = max(maxOnes, windowOnes)
    
    return maxOnes
</code></pre>
<h2>Step-by-Step Walkthrough</h2>
<p><strong>Input:</strong> <code>nums = [1,0,0,1,1,0,1,0,1,1,1,0,0,1]</code>, <code>k = 5</code></p>
<pre><code>Initialize: windowOnes = sum([1,0,0,1,1]) = 3, maxOnes = 3

r=5: windowOnes = 3 + nums[5] - nums[0] = 3 + 0 - 1 = 2
     maxOnes = max(3, 2) = 3

r=6: windowOnes = 2 + nums[6] - nums[1] = 2 + 1 - 0 = 3
     maxOnes = max(3, 3) = 3

r=7: windowOnes = 3 + nums[7] - nums[2] = 3 + 0 - 0 = 3
     maxOnes = max(3, 3) = 3

r=8: windowOnes = 3 + nums[8] - nums[3] = 3 + 1 - 1 = 3
     maxOnes = max(3, 3) = 3

r=9: windowOnes = 3 + nums[9] - nums[4] = 3 + 1 - 1 = 3
     maxOnes = max(3, 3) = 3

r=10: windowOnes = 3 + nums[10] - nums[5] = 3 + 1 - 0 = 4
      maxOnes = max(3, 4) = 4 ← MAX!

r=11: windowOnes = 4 + nums[11] - nums[6] = 4 + 0 - 1 = 3
      maxOnes = max(4, 3) = 4
</code></pre>
<h2>Visual Comparison</h2>
<p><strong>Brute Force Approach:</strong></p>
<pre><code>Window 1: [1,0,0,1,1] → Count from scratch: 1+0+0+1+1 = 3
Window 2: [0,0,1,1,0] → Count from scratch: 0+0+1+1+0 = 2  ← Recalculated!
Window 3: [0,1,1,0,1] → Count from scratch: 0+1+1+0+1 = 3  ← Recalculated!
</code></pre>
<p><strong>Optimized Approach:</strong></p>
<pre><code>Window 1: [1,0,0,1,1] → Count: 3
Window 2: [0,0,1,1,0] → Update: 3 - 1 + 0 = 2  ← O(1) update!
Window 3: [0,1,1,0,1] → Update: 2 - 0 + 1 = 3  ← O(1) update!
</code></pre>
<h2>Complexity Analysis</h2>
<p><strong>Time Complexity:</strong> O(n)</p>
<ul>
<li>Initialize first window: O(k)</li>
<li>Slide window: O(n - k) iterations, O(1) each</li>
<li>Total: O(k + n - k) = <strong>O(n)</strong></li>
</ul>
<p><strong>Space Complexity:</strong> O(1)</p>
<ul>
<li>Only using a few variables: <code>windowOnes</code>, <code>maxOnes</code>, <code>r</code></li>
</ul>
<h2>Key Insight</h2>
<p>Instead of recalculating the count for each window (O(k) each), we update it incrementally (O(1) each) by:</p>
<ol>
<li><strong>Adding</strong> the new element entering the window</li>
<li><strong>Subtracting</strong> the old element leaving the window</li>
</ol>
<p>This eliminates redundant counting and reduces time complexity from O(n × k) to O(n)! 🎯</p>
<p>Now you understand the pattern! Next, solve one more fixed-window exercise to lock it in.</p>
`
    },









    // ==========================================
    // PRACTICE: Fixed Window Exercises
    // ==========================================
    {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-fixed-window-sums',
      title: 'Window Sums',
      description: 'Return the sum of every contiguous window of size k.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Fixed-size sliding window with running sum' },
      difficulty: 'easy',
      instruction: `# Window Sums

Given an integer array \`nums\` and an integer \`k\`, return an array where each element is the sum of a window of size \`k\`.

In other words, return:

- \`[sum(nums[0:k]), sum(nums[1:k+1]), ..., sum(nums[n-k:n])]\`

## Example

Input: nums = [1, 2, 3, 4], k = 2  
Output: [3, 5, 7]

## Constraints

- \`1 <= len(nums) <= 10^5\`
- \`1 <= k <= len(nums)\`
- \`-10^4 <= nums[i] <= 10^4\``,
      starterCode: `def windowSums(nums, k):
    pass`,
      solution: {
        afterAttempt: 3,
        text: `def windowSums(nums, k):
    n = len(nums)
    window = sum(nums[:k])
    result = [window]

    for i in range(k, n):
        window += nums[i] - nums[i - k]
        result.append(window)

    return result`
      },
      hints: [
        { afterAttempt: 1, text: 'Compute the sum of the first window, then slide by adding nums[i] and subtracting nums[i-k].' },
        { afterAttempt: 2, text: 'The result has length n-k+1.' }
      ],
      testCases: [
        { input: '[1, 2, 3, 4], 2', expectedOutput: '[3, 5, 7]' },
        { input: '[2, 1, 5, 1, 3, 2], 3', expectedOutput: '[8, 7, 9, 6]' },
        { input: '[5], 1', expectedOutput: '[5]' }
      ],
      solutionExplanation: `**Brute Force:** Calculate sum of each subarray from scratch → O(n × k)

**Optimized:** Calculate first sum, then update incrementally by adding new element and subtracting old element → O(n)

**Key:** Instead of recalculating overlapping elements, update the sum incrementally.`
    },
    // NOTE: "Maximum Sum Subarray of Size K" exercise removed - duplicate of exercise-max-sum-subarray earlier in module

    // ==========================================
    // SECTION 3: Maximum Windows
    // ==========================================
    {
      type: 'reading',
      id: 'maximum-window-intro',
      title: 'Maximum Window: Max Consecutive Ones III',
      estimatedReadTime: 180,
      content: `<h1>Problem: Max Consecutive Ones III 🔢</h1>
<p>Given an array of 0&#39;s and 1&#39;s and a number <code>k</code>, find the <strong>longest subarray</strong> that contains <strong>at most k 0&#39;s</strong>.</p>
<h2>Example</h2>
<p><strong>Input:</strong> <code>nums = [1,0,0,1,1,0,1,0,1,1,1,0,0,1]</code>, <code>k = 3</code></p>
<p><strong>Visualization:</strong></p>
<pre><code>Array: 1 0 0 1 1 0 1 0 1 1 1 0 0 1
       [________]  ← Window 1: [1,0,0,1,1,0,1,0,1] → 3 zeros, length 9 ← MAX!
        [________]  ← Window 2: [0,0,1,1,0,1,0,1,1] → 3 zeros, length 9
         [________]  ← Window 3: [0,1,1,0,1,0,1,1,1] → 3 zeros, length 9
          [________]  ← Window 4: [1,1,0,1,0,1,1,1,0] → 3 zeros, length 9
           [________]  ← Window 5: [1,0,1,0,1,1,1,0,0] → 4 zeros ✗ (too many!)
</code></pre>
<p><strong>Output:</strong> <code>9</code> (longest subarray with at most 3 zeros)</p>
<h2>Constraints</h2>
<ul>
<li><code>1 &lt;= nums.length &lt;= 10^5</code></li>
<li><code>nums[i]</code> is either <code>0</code> or <code>1</code></li>
<li><code>0 &lt;= k &lt;= nums.length</code></li>
</ul>
<h2>Your First Challenge</h2>
<p><strong>Just make it work!</strong> Use whatever approach comes to mind first. Don&#39;t worry about optimization yet - we&#39;ll identify bottlenecks and improve it step by step.</p>
<code-editor data-id="exercise-max-consecutive-ones-brute"></code-editor>`,
      inlineExercises: [
        {
          id: 'exercise-max-consecutive-ones-brute',
          starterCode: `def longestOnes(nums, k):
    # Your code here
    pass`,
          targetFunction: 'longestOnes',
          testCases: [
            { input: '[1,0,0,1,1,0,1,0,1,1,1,0,0,1], 3', expectedOutput: '9' },
            { input: '[1,1,1,0,0,0,1,1,1,1,0], 2', expectedOutput: '6' },
            { input: '[0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], 3', expectedOutput: '10' }
          ],
          solution: `def longestOnes(nums, k):
    max_len = 0
    # Check every possible start position
    for i in range(len(nums)):
        zeros_count = 0
        # Check every possible end position
        for j in range(i, len(nums)):
            if nums[j] == 0:
                zeros_count += 1
            
            # If we have too many zeros, this window is invalid
            # We can stop extending from this start position
            if zeros_count > k:
                break
                
            # Valid window, update max length
            current_len = j - i + 1
            max_len = max(max_len, current_len)
            
    return max_len`,
          successMessage: "Great job! That's the brute force solution. Notice how we revisit the same elements many times?"
        }
      ]
    },



    {
      type: 'reading',
      id: 'maximum-window-brute-force',
      title: 'Maximum Window: Brute Force',
      estimatedReadTime: 300,
      content: `<h1>Brute Force Solution: How Would You Solve It? 💭</h1>
<h2>The Problem</h2>
<p>Given an array of 0&#39;s and 1&#39;s and a number <code>k</code>, find the <strong>longest subarray</strong> that contains <strong>at most k 0&#39;s</strong>.</p>
<p><strong>Example:</strong></p>
<ul>
<li>Input: <code>nums = [1,0,0,1,1,0,1,0,1,1,1,0,0,1]</code>, <code>k = 3</code></li>
<li>Output: <code>9</code> (longest subarray with at most 3 zeros)</li>
</ul>
<p><strong>Constraints:</strong></p>
<ul>
<li><code>1 &lt;= nums.length &lt;= 10^5</code></li>
<li><code>nums[i]</code> is either <code>0</code> or <code>1</code></li>
<li><code>0 &lt;= k &lt;= nums.length</code></li>
</ul>
<hr>
<h2>The Brute Force Strategy</h2>
<p>Let&#39;s start with the most straightforward approach: check every possible subarray.</p>
<p><strong>How would you solve this?</strong></p>
<ol>
<li><strong>Try every possible starting position</strong> <code>i</code> (from 0 to n-1)</li>
<li><strong>For each starting position</strong>, try every possible ending position <code>j</code> (from i to n-1)</li>
<li><strong>Count zeros</strong> in the subarray from <code>i</code> to <code>j</code></li>
<li><strong>If zeros ≤ k</strong>, update the maximum length</li>
<li><strong>If zeros &gt; k</strong>, stop expanding from this starting position (no point continuing)</li>
</ol>
<h2>Step-by-Step Thinking</h2>
<p><strong>Example:</strong> <code>nums = [1,0,0,1,1,0,1,0,1,1,1,0,0,1]</code>, <code>k = 3</code></p>
<pre><code>Starting at i=0:
  Check [1] → 0 zeros ✓, length 1
  Check [1,0] → 1 zero ✓, length 2
  Check [1,0,0] → 2 zeros ✓, length 3
  Check [1,0,0,1] → 2 zeros ✓, length 4
  ...
  Check [1,0,0,1,1,0,1,0,1] → 3 zeros ✓, length 9
  Check [1,0,0,1,1,0,1,0,1,1] → 3 zeros ✓, length 10
  Check [1,0,0,1,1,0,1,0,1,1,1] → 3 zeros ✓, length 11
  Check [1,0,0,1,1,0,1,0,1,1,1,0] → 4 zeros ✗ (stop here!)

Starting at i=1:
  Check [0] → 1 zero ✓, length 1
  Check [0,0] → 2 zeros ✓, length 2
  ...
</code></pre>
<p><strong>Key insight:</strong> Once we exceed k zeros, we can stop expanding from that starting position because adding more elements won&#39;t help.</p>
<h2>The Brute Force Code</h2>
<p>Now let&#39;s translate this strategy into code:</p>
<pre><code class="language-python">def longestOnes(nums, k):
    max_len = 0
    for i in range(len(nums)):        # Try every starting position
        zeros_count = 0
        for j in range(i, len(nums)): # Try every ending position
            if nums[j] == 0:
                zeros_count += 1
            if zeros_count &lt;= k:
                max_len = max(max_len, j - i + 1)
            else:
                break  # Stop expanding - too many zeros
    return max_len
</code></pre>
<p><strong>How it works:</strong></p>
<ul>
<li>Outer loop: Try each starting position <code>i</code></li>
<li>Inner loop: Expand the subarray by moving <code>j</code> forward</li>
<li>Count zeros as we expand</li>
<li>If zeros ≤ k: valid subarray, update maximum length</li>
<li>If zeros &gt; k: invalid, break and try next starting position</li>
</ul>
<p><strong>Time Complexity:</strong> O(n²) - We check O(n) starting positions, and for each we check up to O(n) ending positions.</p>
<p><strong>Space Complexity:</strong> O(1) - Only using a few variables.</p>
<p>This works! But can we do better? Let&#39;s analyze the bottlenecks...</p>
`
    },

    {
      type: 'reading',
      id: 'maximum-window-bottlenecks',
      title: 'Maximum Window: Bottleneck Analysis',
      estimatedReadTime: 240,
      content: `<h1>Bottleneck Analysis: What&#39;s Inefficient? 🔍</h1>
<p>Let&#39;s analyze your brute force solution to find the bottlenecks.</p>
<h2>The Brute Force Approach</h2>
<pre><code class="language-python">def longestOnes(nums, k):
    max_len = 0
    for i in range(len(nums)):        # O(n) starting positions
        zeros_count = 0
        for j in range(i, len(nums)): # O(n) ending positions
            if nums[j] == 0:
                zeros_count += 1
            if zeros_count &lt;= k:
                max_len = max(max_len, j - i + 1)
            else:
                break
    return max_len
</code></pre>
<h2>Bottleneck: Redundant Window Checking</h2>
<p><strong>Example:</strong> <code>nums = [1,0,0,1,1,0,1,0,1,1,1,0,0,1]</code>, <code>k = 3</code></p>
<p>Look at what we check:</p>
<pre><code>Starting at i=0:
  [1] → 0 zeros ✓, length 1
  [1,0] → 1 zero ✓, length 2
  [1,0,0] → 2 zeros ✓, length 3
  [1,0,0,1] → 2 zeros ✓, length 4
  ...
  [1,0,0,1,1,0,1,0,1] → 3 zeros ✓, length 9

Starting at i=1:
  [0] → 1 zero ✓, length 1
  [0,0] → 2 zeros ✓, length 2
  [0,0,1] → 2 zeros ✓, length 3
  ...
</code></pre>
<p><strong>The Problem:</strong> Windows overlap! When we start at i=1, we&#39;re checking <code>[0,0,1]</code> which overlaps with <code>[1,0,0,1]</code> from i=0. We&#39;re recounting zeros!</p>
<h2>The Key Insight</h2>
<h3>Understanding the Overlap</h3>
<p>When we move from one starting position to the next, consecutive windows overlap significantly:</p>
<pre><code>Window 1: [1,0,0,1,1,0,1,0,1] → 3 zeros, length 9
Window 2: [0,0,1,1,0,1,0,1,1] → Start over, recount zeros ← Wasteful!
            ░░░░░░░░░
          These 8 elements overlap!
</code></pre>
<p><strong>The Problem:</strong> In brute force, we&#39;re recounting zeros for overlapping elements every time!</p>
<h3>The Optimization Strategy</h3>
<p><strong>Instead of starting over:</strong></p>
<pre><code>Window 1: [1,0,0,1,1,0,1,0,1] → Count zeros: 3, length 9
Window 2: [0,0,1,1,0,1,0,1,1] → Count zeros from scratch: 3 ← Recalculated!
</code></pre>
<p><strong>You maintain and update incrementally:</strong></p>
<pre><code>Window 1: [1,0,0,1,1,0,1,0,1] → zeros_count = 3, length 9
Window 2: [0,0,1,1,0,1,0,1,1] → Remove nums[0]=1 (not a zero, so zeros_count stays 3)
                                 → Add nums[9]=1 (not a zero, so zeros_count stays 3)
                                 → Still 3 zeros, length 9 ← O(1) update!
</code></pre>
<h3>Why This Works</h3>
<p><strong>Key observation:</strong> When sliding from Window 1 to Window 2:</p>
<ul>
<li><strong>Removed:</strong> <code>nums[0] = 1</code> (not a zero, so zeros_count unchanged)</li>
<li><strong>Added:</strong> <code>nums[9] = 1</code> (not a zero, so zeros_count unchanged)</li>
<li><strong>Unchanged:</strong> All 8 middle elements stay the same!</li>
</ul>
<p>Since we only removed and added 1&#39;s (not zeros), the zero count doesn&#39;t change. We don&#39;t need to recount!</p>
<p><strong>More generally:</strong></p>
<ul>
<li>If we remove a <strong>0</strong>: decrement zeros_count</li>
<li>If we remove a <strong>1</strong>: zeros_count stays the same</li>
<li>If we add a <strong>0</strong>: increment zeros_count  </li>
<li>If we add a <strong>1</strong>: zeros_count stays the same</li>
</ul>
<h3>The Maximum Window Pattern</h3>
<p><strong>The Strategy:</strong> </p>
<ul>
<li><strong>Grow</strong> the window as much as possible (expand right pointer) - we want the longest valid subarray</li>
<li><strong>Shrink</strong> only when necessary (when constraint violated - zeros &gt; k) - we need to make room for more elements</li>
<li><strong>Track maximum</strong> during valid states - update max_len whenever the window is valid</li>
</ul>
<p><strong>Why &quot;Maximum Window&quot;?</strong></p>
<ul>
<li>Goal: Find the <strong>maximum</strong> (longest) valid window</li>
<li>We expand as much as possible to maximize length</li>
<li>We only shrink when forced to (constraint violation)</li>
</ul>
<p>This is the <strong>Maximum Window</strong> pattern! 🎯</p>
`
    },

    {
      type: 'reading',
      id: 'maximum-window-optimization',
      title: 'Maximum Window: Thinking Through the Optimization',
      estimatedReadTime: 300,
      content: `<h1>Thinking Through the Optimization 🧠</h1>
<p>We identified the bottleneck: checking overlapping windows restarts the zero count each time. Let&#39;s derive a better approach.</p>

<h2>The Key Insight</h2>
<p>When we move from checking subarray <code>[0,8]</code> to <code>[1,9]</code>:</p>
<ul>
<li>We&#39;re throwing away all our work on elements <code>[1..8]</code></li>
<li>We already know how many zeros are in <code>[1..8]</code>!</li>
</ul>
<p><strong>What if we kept the window and ADJUSTED it instead of starting over?</strong></p>

<h2>Step 1: Keep the Window, Update the Count</h2>
<p>Instead of resetting <code>zeros_count</code> for each starting position, we can add/remove single elements at the boundaries:</p>
<p><strong>When expanding</strong> (add element to right):</p>
<ul>
<li>If it&#39;s a 0, increment <code>zeros_count</code></li>
<li>If it&#39;s a 1, <code>zeros_count</code> unchanged</li>
</ul>
<p><strong>When shrinking</strong> (remove element from left):</p>
<ul>
<li>If it&#39;s a 0, decrement <code>zeros_count</code></li>
<li>If it&#39;s a 1, <code>zeros_count</code> unchanged</li>
</ul>
<p>Each update is O(1) instead of recounting the entire window!</p>

<h2>Step 2: When to Expand vs Shrink?</h2>
<p>We want the <strong>LONGEST</strong> valid window. Think about it:</p>
<ul>
<li><strong>Expand</strong> as much as possible (to maximize length)</li>
<li><strong>Shrink</strong> only when forced (when we have too many zeros)</li>
</ul>
<p>This is the opposite of &quot;restart from each position.&quot; We maintain ONE window and adjust it.</p>

<h2>Step 3: Deriving the Code</h2>
<p>Let&#39;s build the solution from our reasoning:</p>
<pre><code class="language-python">def longestOnes(nums, k):
    # Start with empty window
    left = 0
    zeros_count = 0
    max_len = 0

    # Expand by moving right pointer through array
    for right in range(len(nums)):
        # Add right element to window
        if nums[right] == 0:
            zeros_count += 1

        # Shrink while we have too many zeros
        while zeros_count &gt; k:
            if nums[left] == 0:
                zeros_count -= 1
            left += 1

        # Window is now valid, update max
        max_len = max(max_len, right - left + 1)

    return max_len
</code></pre>

<h2>Visual Walkthrough</h2>
<p><strong>Input:</strong> <code>nums = [1,0,0,1,1,0,1,0,1,1,1,0,0,1]</code>, <code>k = 3</code></p>
<pre><code>right=0: Add 1, zeros=0, window=[1], max_len=1
right=1: Add 0, zeros=1, window=[1,0], max_len=2
right=2: Add 0, zeros=2, window=[1,0,0], max_len=3
right=3: Add 1, zeros=2, window=[1,0,0,1], max_len=4
...
right=7: Add 0, zeros=3, window has 8 elements, max_len=8
right=8: Add 1, zeros=3, window has 9 elements, max_len=9
right=9: Add 1, zeros=3, window still valid, max_len=10
right=10: Add 1, zeros=3, window still valid, max_len=11
right=11: Add 0, zeros=4 &gt; k!
         → Shrink: remove nums[0]=1, zeros=4, left=1
         → Shrink: remove nums[1]=0, zeros=3, left=2
         → Window valid again
</code></pre>

<h2>Why This Works</h2>
<p>The key insight is that we never &quot;go backwards&quot;:</p>
<ul>
<li>Each element is added to the window exactly once (right pointer moves forward)</li>
<li>Each element is removed from the window at most once (left pointer moves forward)</li>
<li>Total operations: O(n) + O(n) = <strong>O(n)</strong> instead of O(n²)!</li>
</ul>

<h2>The Derivation in Action</h2>
<p>Notice how we didn&#39;t memorize a &quot;template.&quot; We asked:</p>
<ol>
<li>What&#39;s redundant? → Recounting zeros in overlapping windows</li>
<li>How do we avoid it? → Update incrementally instead of recounting</li>
<li>When do we expand/shrink? → Expand greedily, shrink only when invalid</li>
</ol>
<p>This thinking process works for any &quot;find longest subarray with constraint&quot; problem.</p>
<h2>Practice Time 🎯</h2>
<p>Now apply what you derived to a new problem. For more practice problems, click the <strong>Practice</strong> button in the header.</p>`
    },

    // ==========================================
    // PRACTICE: Maximum Window Exercise
    // ==========================================
    getSlidingWindowExercise('exercise-max-consecutive-ones-iii'),










    // ==========================================
    // SECTION 4: Minimum Windows
    // ==========================================
    {
      type: 'reading',
      id: 'minimum-window-intro',
      title: 'Minimum Window: Shortest Subarray with k Ones',
      estimatedReadTime: 180,
      content: `<h1>Problem: Shortest Subarray with k Ones ⚖️</h1>
<h2>The Problem</h2>
<p>Given an array of 0&#39;s and 1&#39;s and a number <code>k</code>, find the <strong>shortest subarray</strong> that contains <strong>k ones</strong>.</p>
<p><strong>Example:</strong></p>
<ul>
<li>Input: <code>nums = [1,0,0,1,1,0,1,0,1,1,1,0,0,1]</code>, <code>k = 4</code></li>
<li>Output: <code>5</code> (shortest subarray with 4 ones)</li>
</ul>
<p><strong>Constraints:</strong></p>
<ul>
<li><code>1 &lt;= nums.length &lt;= 10^5</code></li>
<li><code>nums[i]</code> is either <code>0</code> or <code>1</code></li>
<li><code>1 &lt;= k &lt;= number of 1&#39;s in nums</code></li>
</ul>
<h2>Your Challenge</h2>
<p><strong>Can you code the brute force solution?</strong> Check every possible subarray!</p>
<code-editor data-id="exercise-shortest-subarray-k-ones-brute"></code-editor>`,
      inlineExercises: [
        {
          id: 'exercise-shortest-subarray-k-ones-brute',
          starterCode: `def shortestSubarrayWithKOnes(nums, k):
    # Your code here
    pass`,
          targetFunction: 'shortestSubarrayWithKOnes',
          testCases: [
            { input: '[1,0,0,1,1,0,1,0,1,1,1,0,0,1], 4', expectedOutput: '5' },
            { input: '[1,1,1,0,0,0,1,1,1,1,0], 3', expectedOutput: '3' },
            { input: '[0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], 5', expectedOutput: '6' }
          ],
          solution: `def shortestSubarrayWithKOnes(nums, k):
    min_len = float('inf')
    found = False
    
    # Check every possible start position
    for i in range(len(nums)):
        ones_count = 0
        # Check every possible end position
        for j in range(i, len(nums)):
            if nums[j] == 1:
                ones_count += 1
            
            # If we found k ones
            if ones_count == k:
                min_len = min(min_len, j - i + 1)
                found = True
                break # Found smallest for this start
                
    return min_len if found else -1`,
          successMessage: "Correct! That's the brute force approach (checking all O(n²) subarrays)."
        }
      ]
    },
    {
      type: 'reading',
      id: 'minimum-window-brute-analysis',
      title: 'Shortest Subarray: Brute Force Analysis',
      estimatedReadTime: 300,
      content: `
<h2>Brute Force Solution: How Would You Solve It?</h2>
<p>Let&#39;s start with the most straightforward approach: check every possible subarray.</p>
<h3>The Brute Force Strategy</h3>
<p><strong>How would you solve this?</strong></p>
<ol>
<li><strong>Try every possible starting position</strong> <code>i</code> (from 0 to n-1)</li>
<li><strong>For each starting position</strong>, try every possible ending position <code>j</code> (from i to n-1)</li>
<li><strong>Count ones</strong> in the subarray from <code>i</code> to <code>j</code></li>
<li><strong>If ones == k</strong>, update the minimum length</li>
<li><strong>Return</strong> the minimum length found</li>
</ol>
<h3>The Brute Force Code</h3>
<pre><code class="language-python">def shortestSubarrayWithKOnes(nums, k):
    min_len = float(&#39;inf&#39;)
    
    # Try every possible starting position
    for i in range(len(nums)):
        ones_count = 0
        # Try every possible ending position
        for j in range(i, len(nums)):
            # Count ones in current subarray
            if nums[j] == 1:
                ones_count += 1
            
            # If we found k ones, update minimum length
            if ones_count == k:
                min_len = min(min_len, j - i + 1)
                break  # Found shortest for this start, move to next
    
    return min_len if min_len != float(&#39;inf&#39;) else -1
</code></pre>
<h3>Walkthrough</h3>
<p><strong>Input:</strong> <code>nums = [1,0,0,1,1,0,1,0,1,1,1,0,0,1]</code>, <code>k = 4</code></p>
<pre><code>i=0: Check subarrays starting at 0
     j=0: [1] → 1 one
     j=1: [1,0] → 1 one
     j=2: [1,0,0] → 1 one
     j=3: [1,0,0,1] → 2 ones
     j=4: [1,0,0,1,1] → 3 ones
     j=5: [1,0,0,1,1,0] → 3 ones
     j=6: [1,0,0,1,1,0,1] → 4 ones ✅ length 7
     min_len = 7

i=1: Check subarrays starting at 1
     j=1: [0] → 0 ones
     j=2: [0,0] → 0 ones
     ...
     j=8: [0,0,1,1,0,1,0,1] → 4 ones ✅ length 8
     min_len = min(7, 8) = 7

i=6: Check subarrays starting at 6
     j=6: [1] → 1 one
     ...
     j=10: [1,0,1,1,1] → 4 ones ✅ length 5
     min_len = min(6, 5) = 5 ← New Minimum!

Answer: 5
</code></pre>
<h3>Complexity Analysis</h3>
<p><strong>Time Complexity:</strong> O(n²)</p>
<ul>
<li>Outer loop: O(n) starting positions</li>
<li>Inner loop: O(n) ending positions per starting position</li>
<li><strong>Total: O(n²)</strong></li>
</ul>
<p><strong>Space Complexity:</strong> O(1)</p>
<ul>
<li>Only using a few variables: <code>min_len</code>, <code>ones_count</code>, <code>i</code>, <code>j</code></li>
</ul>
<p><strong>Baseline:</strong> This is our starting point. It works correctly, but can we do better?</p>
<hr>
<h2>Can We Improve?</h2>
<p>Let&#39;s think about optimization:</p>
<p><strong>Question 1: Can we improve time complexity?</strong></p>
<ul>
<li>Current: O(n²)</li>
<li>Best possible: O(n) - we need to check each element at least once</li>
<li><strong>Goal:</strong> Reduce from O(n²) to O(n)</li>
</ul>
<p><strong>Question 2: Can we improve space complexity?</strong></p>
<ul>
<li>Current: O(1) - already optimal!</li>
<li><strong>No improvement needed here</strong></li>
</ul>
<p><strong>Focus:</strong> Let&#39;s try to improve time complexity from O(n²) to O(n).</p>
<hr>
<h2>Finding Bottlenecks - What&#39;s Redundant?</h2>
<p>Let&#39;s analyze what&#39;s happening in our brute force solution:</p>
<h3>Identifying Redundant Work</h3>
<p><strong>Example:</strong> <code>nums = [1,0,0,1,1,0,1,0,1,1,1,0,0,1]</code>, <code>k = 4</code></p>
<p>Look at consecutive subarrays:</p>
<pre><code>Starting at i=0:
  [1,0,0,1,1,0,1] → Count ones: 4 ✅ length 7
  
Starting at i=1:
  [0,0,1,1,0,1,0,1] → Count ones: 4 ✅ length 8
</code></pre>
<p><strong>Bottleneck #1: Recalculating Overlapping Elements</strong></p>
<p>When we move from starting at i=0 to i=1:</p>
<pre><code>Subarray 1: [1,0,0,1,1,0,1] → Count: 1+0+0+1+1+0+1 = 4
Subarray 2: [0,0,1,1,0,1,0,1] → Count: 0+0+1+1+0+1+0+1 = 4
            ░░░░░░░
          These 7 elements overlap!
</code></pre>
<p><strong>The Problem:</strong> We&#39;re recounting ones for overlapping elements!</p>
<ul>
<li>Subarray 1 counts: <code>1+0+0+1+1+0+1</code></li>
<li>Subarray 2 counts: <code>0+0+1+1+0+1+0+1</code></li>
<li>Notice that <code>0+0+1+1+0+1</code> appears in both calculations!</li>
</ul>
<p><strong>Bottleneck #2: Missing the Opportunity to Shrink</strong></p>
<p>Once we find a valid window with k ones, we immediately break and move to the next starting position. But we could <strong>shrink</strong> the window from the left while it&#39;s still valid to see if we can make it shorter!</p>
<p><strong>Example:</strong></p>
<pre><code>Window: [1,0,0,1,1,0,1] → 4 ones, length 7 ✅
        [0,0,1,1,0,1] → 3 ones ✗ (too few)
        
But what if we try:
Window: [1,0,0,1,1,0,1] → 4 ones, length 7 ✅
        [0,0,1,1,0,1] → 3 ones ✗
        [0,1,1,0,1] → 3 ones ✗
        [1,1,0,1] → 3 ones ✗
        [1,0,1] → 2 ones ✗
        
Actually, we need to shrink more carefully...
</code></pre>
<p><strong>The Key Insight:</strong> </p>
<ul>
<li>When we find a valid window, we should try to <strong>shrink it from the left</strong> while keeping it valid</li>
<li>This helps us find the shortest valid window</li>
<li>We can update the count incrementally instead of recalculating</li>
</ul>
<hr>
<h2>Optimizing Based on Bottlenecks</h2>
<p>Now that we&#39;ve identified the bottlenecks, let&#39;s fix them:</p>
<h3>The Optimization Strategy</h3>
<p><strong>Instead of checking every subarray independently:</strong></p>
<ol>
<li><strong>Maintain a window</strong> using two pointers (left and right)</li>
<li><strong>Expand</strong> the window (move right pointer) until we have k ones</li>
<li><strong>Shrink</strong> the window (move left pointer) while it&#39;s still valid to minimize length</li>
<li><strong>Update count incrementally</strong> - don&#39;t recalculate overlapping elements</li>
</ol>
<h3>The Pattern</h3>
<pre><code>Window 1: [1,0,0,1,1,0,1] → Count: 4 ones, length 7
         Remove left (1), add right (0)
Window 2: [0,0,1,1,0,1,0,1] → Count: 4 - 1 + 0 = 3 ones ✗
         Need to expand more...
         
But better approach:
Window: [1,0,0,1,1,0,1] → 4 ones ✅
        Try shrinking: Remove 1 → [0,0,1,1,0,1] → 3 ones ✗
        Can&#39;t shrink, so expand: [1,0,0,1,1,0,1,0] → 4 ones ✅
        Try shrinking: Remove 0 → [0,0,1,1,0,1,0] → 4 ones ✅ (still valid!)
        Try shrinking: Remove 0 → [0,1,1,0,1,0] → 4 ones ✅ (still valid!)
        ...
</code></pre>
<p><strong>General Formula:</strong></p>
<ul>
<li>When expanding: <code>ones_count += nums[right]</code> (add 1 if nums[right] == 1, else 0)</li>
<li>When shrinking: <code>ones_count -= nums[left]</code> (subtract 1 if nums[left] == 1, else 0)</li>
</ul>
<p>This eliminates redundant counting!</p>
`
    },

    {
      type: 'reading',
      id: 'minimum-window-bottlenecks',
      title: 'Minimum Window: Bottleneck Analysis',
      estimatedReadTime: 240,
      content: `<h1>Bottleneck Analysis: What&#39;s Inefficient? 🔍</h1>
<p>Let&#39;s analyze the brute force solution to find the bottlenecks.</p>
<h2>The Brute Force Approach</h2>
<pre><code class="language-python">def shortestSubarrayWithKOnes(nums, k):
    min_len = float(&#39;inf&#39;)
    
    for i in range(len(nums)):
        ones_count = 0
        for j in range(i, len(nums)):
            if nums[j] == 1:
                ones_count += 1
            if ones_count == k:
                min_len = min(min_len, j - i + 1)
                break
    
    return min_len if min_len != float(&#39;inf&#39;) else -1
</code></pre>
<h2>Bottleneck: Redundant Counting</h2>
<p><strong>Example:</strong> <code>nums = [1,0,0,1,1,0,1,0,1,1,1,0,0,1]</code>, <code>k = 4</code></p>
<p>When we move from starting at i=0 to i=1:</p>
<pre><code>Subarray 1: [1,0,0,1,1,0,1] → Count: 1+0+0+1+1+0+1 = 4
Subarray 2: [0,0,1,1,0,1,0,1] → Count: 0+0+1+1+0+1+0+1 = 4
            ░░░░░░░
          Overlapping elements!
</code></pre>
<p><strong>The Problem:</strong> We&#39;re recounting ones for overlapping elements!</p>
<ul>
<li>Subarray 1 counts: <code>1+0+0+1+1+0+1</code></li>
<li>Subarray 2 counts: <code>0+0+1+1+0+1+0+1</code></li>
<li>Notice that <code>0+0+1+1+0+1</code> appears in both calculations!</li>
</ul>
<h2>Missing the Opportunity to Shrink</h2>
<p>Once we find a valid window, we immediately break. But we should <strong>shrink</strong> it while it&#39;s still valid to find the shortest window!</p>
<p><strong>The Key Insight:</strong></p>
<ul>
<li>When we find a valid window, try to <strong>shrink from the left</strong> while keeping it valid</li>
<li>Update the count incrementally instead of recalculating</li>
<li>This helps us find the shortest valid window efficiently</li>
</ul>
`
    },

    {
      type: 'reading',
      id: 'minimum-window-optimization',
      title: 'Minimum Window: Thinking Through the Optimization',
      estimatedReadTime: 300,
      content: `<h1>Thinking Through the Optimization 🧠</h1>
<p>We identified the bottleneck: restarting at each position wastes work on overlapping elements. Let&#39;s derive a better approach.</p>

<h2>The Key Insight: Opposite of Maximum</h2>
<p>Remember from the Maximum Window problem? We wanted the <strong>LONGEST</strong> valid window, so we:</p>
<ul>
<li>Expanded greedily (to maximize length)</li>
<li>Shrunk reluctantly (only when invalid)</li>
</ul>
<p>Here we want the <strong>SHORTEST</strong> window with exactly k ones. The strategy flips:</p>
<ul>
<li>Expand until valid (we need k ones first)</li>
<li>Then shrink aggressively (to minimize length while staying valid)</li>
</ul>

<h2>Step 1: When Is the Window Valid?</h2>
<p>A window is valid when <code>ones_count == k</code>.</p>
<p>But here&#39;s the counter-intuitive part: <strong>once valid, don&#39;t stop expanding!</strong></p>

<h2>Step 2: The Counter-Intuitive Part</h2>
<p>Once we find k ones, we should keep shrinking to find an even shorter window.</p>
<p><strong>Example:</strong> <code>[1,0,0,1,1,0,1]</code> with <code>k=3</code></p>
<pre><code>Window [1,0,0,1,1,0,1] has 4 ones - too many, can shrink
Window [0,0,1,1,0,1] has 3 ones - valid and shorter!
Window [0,1,1,0,1] has 3 ones - still valid and shorter!
Window [1,1,0,1] has 3 ones - even shorter!
Window [1,0,1] has 2 ones - too few, stop shrinking
</code></pre>
<p>The shortest valid window was <code>[1,1,0,1]</code> with length 4.</p>

<h2>Step 3: The Key Difference</h2>
<p><strong>Maximum Window:</strong> <code>while invalid: shrink</code> (shrink to become valid)</p>
<p><strong>Minimum Window:</strong> <code>while valid: shrink</code> (shrink to minimize while staying valid)</p>
<p>This is the crucial insight!</p>

<h2>Step 4: Deriving the Code</h2>
<p>Let&#39;s build the solution from our reasoning:</p>
<pre><code class="language-python">def shortestSubarrayWithKOnes(nums, k):
    left = 0
    ones_count = 0
    min_len = float(&#39;inf&#39;)

    for right in range(len(nums)):
        # Add right element
        if nums[right] == 1:
            ones_count += 1

        # Shrink while VALID to minimize length
        while ones_count == k:
            min_len = min(min_len, right - left + 1)
            # Try shrinking from left
            if nums[left] == 1:
                ones_count -= 1
            left += 1

    return min_len if min_len != float(&#39;inf&#39;) else -1
</code></pre>

<h2>Visual Walkthrough</h2>
<p><strong>Input:</strong> <code>nums = [1,0,0,1,1,0,1,0,1,1,1,0,0,1]</code>, <code>k = 4</code></p>
<pre><code>Expand until 4 ones:
right=0: Add 1, ones=1
right=1: Add 0, ones=1
...
right=6: Add 1, ones=4 ✓ Valid!
         → min_len = 7
         → Shrink: remove nums[0]=1, ones=3, invalid, stop

Continue expanding:
right=8: Add 1, ones=4 ✓ Valid!
         → min_len = min(7, 8) = 7
         → Shrink: remove 0s... ones=4, still valid!
         → min_len = min(7, 7) = 7
         → Shrink: remove 0... ones=4!
         → min_len = min(7, 6) = 6 ← Better!
         → Shrink: remove 1, ones=3, invalid, stop

Answer: 6
</code></pre>

<h2>Why This Works</h2>
<p>The key insight is the same as Maximum Window:</p>
<ul>
<li>Each element added once (right pointer)</li>
<li>Each element removed at most once (left pointer)</li>
<li>Total: <strong>O(n)</strong> instead of O(n²)!</li>
</ul>

<h2>The Derivation in Action</h2>
<p>Notice how we derived this from the Maximum Window insight:</p>
<ol>
<li>Same incremental update idea (add/remove one element at a time)</li>
<li>Same two-pointer structure</li>
<li>But opposite shrinking logic: shrink while valid vs shrink while invalid</li>
</ol>
<p>This thinking process works for any &quot;find shortest subarray with constraint&quot; problem.</p>
<h2>Practice Time 🎯</h2>
<p>Now apply what you derived to a new problem. For more practice problems, click the <strong>Practice</strong> button in the header.</p>`
    },

    // ==========================================
    // PRACTICE: Minimum Window Exercise
    // ==========================================
    getSlidingWindowExercise('exercise-shortest-subarray-k-ones'),






    // ==========================================



    // ==========================================
    // SECTION 5: Frequency-Based Windows
    // ==========================================
    {
      type: 'reading',
      id: 'frequency-window-intro',
      title: 'Frequency Window: Longest Substring with K Distinct Characters',
      estimatedReadTime: 180,
      content: `<h1>Problem: Longest Substring with K Distinct Characters 🔤</h1>
<p>Given a string <code>s</code> and an integer <code>k</code>, find the <strong>longest substring</strong> that contains <strong>at most k distinct characters</strong>.</p>
<h2>Example</h2>
<p><strong>Input:</strong> <code>s = &quot;eceba&quot;</code>, <code>k = 2</code></p>
<p><strong>Visualization:</strong></p>
<pre><code>String: e c e b a
        [___]  ← &quot;ece&quot; → 2 distinct (e, c) → length 3 ✅
         [___]  ← &quot;ceb&quot; → 3 distinct (c, e, b) → too many!
          [___]  ← &quot;eba&quot; → 3 distinct (e, b, a) → too many!
</code></pre>
<p><strong>Output:</strong> <code>3</code> (longest substring with at most 2 distinct characters)</p>
<h2>Constraints</h2>
<ul>
<li><code>1 &lt;= s.length &lt;= 5 * 10^4</code></li>
<li><code>0 &lt;= k &lt;= 50</code></li>
<li><code>s</code> consists of English letters</li>
</ul>
<h2>Your First Challenge</h2>
<p><strong>Just make it work!</strong> Use whatever approach comes to mind first. Don&#39;t worry about optimization yet - we&#39;ll identify bottlenecks and improve it step by step.</p>
<code-editor data-id="exercise-longest-substring-k-distinct-brute"></code-editor>`,
      inlineExercises: [
        {
          id: 'exercise-longest-substring-k-distinct-brute',
          starterCode: `def longestSubstringKDistinct(s, k):
    # Your code here
    pass`,
          targetFunction: 'longestSubstringKDistinct',
          testCases: [
            { input: '"eceba", 2', expectedOutput: '3' },
            { input: '"aa", 1', expectedOutput: '2' },
            { input: '"abcde", 1', expectedOutput: '1' }
          ],
          solution: `def longestSubstringKDistinct(s, k):
    max_len = 0
    n = len(s)
    
    # Check every possible start position
    for i in range(n):
        # Check every possible end position
        for j in range(i, n):
            # Get the substring
            sub = s[i : j+1]
            
            # Count distinct characters
            distinct_count = len(set(sub))
            
            if distinct_count <= k:
                max_len = max(max_len, len(sub))
            else:
                # If we exceed k distinct chars, adding more 
                # won't help for this start position
                break
                
    return max_len`,
          successMessage: "Correct! That's the brute force approach. Notice we are repeatedly checking overlapping substrings and recreating Sets?"
        }
      ]
    },

    {
      type: 'reading',
      id: 'frequency-window-brute-force',
      title: 'Frequency Window: Brute Force',
      estimatedReadTime: 300,
      content: `<h1>Brute Force Solution: How Would You Solve It? 💭</h1>
<h2>The Problem</h2>
<p>Given a string <code>s</code> and an integer <code>k</code>, find the <strong>longest substring</strong> that contains <strong>at most k distinct characters</strong>.</p>
<p><strong>Example:</strong></p>
<ul>
<li>Input: <code>s = &quot;eceba&quot;</code>, <code>k = 2</code></li>
<li>Output: <code>3</code> (longest substring with at most 2 distinct characters)</li>
</ul>
<p><strong>Constraints:</strong></p>
<ul>
<li><code>1 &lt;= s.length &lt;= 5 * 10^4</code></li>
<li><code>0 &lt;= k &lt;= 50</code></li>
<li><code>s</code> consists of English letters</li>
</ul>
<hr>
<h2>The Brute Force Strategy</h2>
<p>Let&#39;s start with the most straightforward approach: check every possible substring.</p>
<h3>How Would You Solve This?</h3>
<ol>
<li><strong>Try every possible starting position</strong> <code>i</code> (from 0 to n-1)</li>
<li><strong>For each starting position</strong>, try every possible ending position <code>j</code> (from i to n-1)</li>
<li><strong>Count distinct characters</strong> in the substring from <code>i</code> to <code>j</code></li>
<li><strong>If distinct ≤ k</strong>, update the maximum length</li>
<li><strong>Return</strong> the maximum length found</li>
</ol>
<h3>Step-by-Step Example</h3>
<p><strong>Input:</strong> <code>s = &quot;eceba&quot;</code>, <code>k = 2</code></p>
<pre><code>String: e c e b a
Index:  0 1 2 3 4

Starting at i=0:
  j=0: Check &quot;e&quot; → distinct = {&#39;e&#39;} → 1 distinct ✓, length 1
  j=1: Check &quot;ec&quot; → distinct = {&#39;e&#39;,&#39;c&#39;} → 2 distinct ✓, length 2
  j=2: Check &quot;ece&quot; → distinct = {&#39;e&#39;,&#39;c&#39;} → 2 distinct ✓, length 3 ← Maximum so far!
  j=3: Check &quot;eceb&quot; → distinct = {&#39;e&#39;,&#39;c&#39;,&#39;b&#39;} → 3 distinct ✗ (too many!)
  j=4: Check &quot;eceba&quot; → distinct = {&#39;e&#39;,&#39;c&#39;,&#39;b&#39;,&#39;a&#39;} → 4 distinct ✗ (too many!)

Starting at i=1:
  j=1: Check &quot;c&quot; → distinct = {&#39;c&#39;} → 1 distinct ✓, length 1
  j=2: Check &quot;ce&quot; → distinct = {&#39;c&#39;,&#39;e&#39;} → 2 distinct ✓, length 2
  j=3: Check &quot;ceb&quot; → distinct = {&#39;c&#39;,&#39;e&#39;,&#39;b&#39;} → 3 distinct ✗ (too many!)

Starting at i=2:
  j=2: Check &quot;e&quot; → distinct = {&#39;e&#39;} → 1 distinct ✓, length 1
  j=3: Check &quot;eb&quot; → distinct = {&#39;e&#39;,&#39;b&#39;} → 2 distinct ✓, length 2
  j=4: Check &quot;eba&quot; → distinct = {&#39;e&#39;,&#39;b&#39;,&#39;a&#39;} → 3 distinct ✗ (too many!)

Starting at i=3:
  j=3: Check &quot;b&quot; → distinct = {&#39;b&#39;} → 1 distinct ✓, length 1
  j=4: Check &quot;ba&quot; → distinct = {&#39;b&#39;,&#39;a&#39;} → 2 distinct ✓, length 2

Starting at i=4:
  j=4: Check &quot;a&quot; → distinct = {&#39;a&#39;} → 1 distinct ✓, length 1

Answer: 3 (substring &quot;ece&quot; has 2 distinct characters, length 3)
</code></pre>
<h3>Visual Walkthrough</h3>
<pre><code>String: e c e b a

i=0: Try all substrings starting at &#39;e&#39;
     &quot;e&quot;     → {&#39;e&#39;} → 1 distinct ✓
     &quot;ec&quot;    → {&#39;e&#39;,&#39;c&#39;} → 2 distinct ✓
     &quot;ece&quot;   → {&#39;e&#39;,&#39;c&#39;} → 2 distinct ✓ length 3 ← MAX!
     &quot;eceb&quot;  → {&#39;e&#39;,&#39;c&#39;,&#39;b&#39;} → 3 distinct ✗
     &quot;eceba&quot; → {&#39;e&#39;,&#39;c&#39;,&#39;b&#39;,&#39;a&#39;} → 4 distinct ✗

i=1: Try all substrings starting at &#39;c&#39;
     &quot;c&quot;   → {&#39;c&#39;} → 1 distinct ✓
     &quot;ce&quot;  → {&#39;c&#39;,&#39;e&#39;} → 2 distinct ✓
     &quot;ceb&quot; → {&#39;c&#39;,&#39;e&#39;,&#39;b&#39;} → 3 distinct ✗

i=2: Try all substrings starting at &#39;e&#39;
     &quot;e&quot;  → {&#39;e&#39;} → 1 distinct ✓
     &quot;eb&quot; → {&#39;e&#39;,&#39;b&#39;} → 2 distinct ✓
     &quot;eba&quot; → {&#39;e&#39;,&#39;b&#39;,&#39;a&#39;} → 3 distinct ✗

i=3: Try all substrings starting at &#39;b&#39;
     &quot;b&quot;  → {&#39;b&#39;} → 1 distinct ✓
     &quot;ba&quot; → {&#39;b&#39;,&#39;a&#39;} → 2 distinct ✓

i=4: Try all substrings starting at &#39;a&#39;
     &quot;a&quot; → {&#39;a&#39;} → 1 distinct ✓
</code></pre>
<h2>The Brute Force Code</h2>
<p>Now let&#39;s translate this strategy into code:</p>
<pre><code class="language-python">def lengthOfLongestSubstringKDistinct(s, k):
    max_len = 0
    
    # Try every possible starting position
    for i in range(len(s)):
        # Try every possible ending position
        for j in range(i, len(s)):
            # Count distinct characters in substring s[i:j+1]
            distinct = len(set(s[i:j+1]))
            
            # If at most k distinct, update maximum length
            if distinct &lt;= k:
                max_len = max(max_len, j - i + 1)
    
    return max_len
</code></pre>
<p><strong>How it works:</strong></p>
<ul>
<li>Outer loop: Try each starting position <code>i</code></li>
<li>Inner loop: Try each ending position <code>j</code> (must be &gt;= i)</li>
<li>Count distinct: Use a set to count unique characters in substring <code>s[i:j+1]</code></li>
<li>Update maximum: If distinct ≤ k, update max_len</li>
</ul>
<h3>Complexity Analysis</h3>
<p><strong>Time Complexity:</strong> O(n³)</p>
<ul>
<li>Outer loop: O(n) starting positions</li>
<li>Inner loop: O(n) ending positions per starting position</li>
<li>Creating set from substring: O(n) - need to iterate through substring</li>
<li><strong>Total: O(n × n × n) = O(n³)</strong></li>
</ul>
<p><strong>Space Complexity:</strong> O(n)</p>
<ul>
<li>Set can contain at most n distinct characters</li>
</ul>
<p><strong>Baseline:</strong> This is our starting point. It works correctly, but can we do better?</p>
<hr>
<h2>Can We Improve?</h2>
<p>Let&#39;s think about optimization:</p>
<p><strong>Question 1: Can we improve time complexity?</strong></p>
<ul>
<li>Current: O(n³)</li>
<li>Best possible: O(n) - we need to check each element at least once</li>
<li><strong>Goal:</strong> Reduce from O(n³) to O(n)</li>
</ul>
<p><strong>Question 2: Can we improve space complexity?</strong></p>
<ul>
<li>Current: O(n) - set can have up to n characters</li>
<li>Could potentially be O(k) if we only track distinct characters</li>
<li><strong>Goal:</strong> Optimize if possible</li>
</ul>
<p><strong>Focus:</strong> Let&#39;s try to improve time complexity from O(n³) to O(n).</p>
<hr>
<h2>Finding Bottlenecks - What&#39;s Redundant?</h2>
<p>Let&#39;s analyze what&#39;s happening in our brute force solution:</p>
<h3>Identifying Redundant Work</h3>
<p><strong>Example:</strong> <code>s = &quot;eceba&quot;</code>, <code>k = 2</code></p>
<p>Look at consecutive substrings:</p>
<pre><code>Starting at i=0:
  &quot;ece&quot; → distinct = {&#39;e&#39;,&#39;c&#39;} → 2 distinct ✓, length 3
  
Starting at i=1:
  &quot;ce&quot; → distinct = {&#39;c&#39;,&#39;e&#39;} → 2 distinct ✓, length 2
</code></pre>
<p><strong>Bottleneck #1: Rebuilding Sets for Overlapping Substrings</strong></p>
<p>When we check &quot;ece&quot; and then &quot;ce&quot;:</p>
<pre><code>Substring 1: &quot;ece&quot; → Create set: {&#39;e&#39;,&#39;c&#39;} → 2 distinct
Substring 2: &quot;ce&quot;  → Create set: {&#39;c&#39;,&#39;e&#39;} → 2 distinct
              ░░
            Overlap!
</code></pre>
<p><strong>The Problem:</strong> We&#39;re rebuilding the set from scratch! But &quot;ce&quot; is just &quot;ece&quot; with the first &#39;e&#39; removed. We&#39;re recounting!</p>
<p><strong>Bottleneck #2: No Incremental Updates</strong></p>
<p><strong>Instead of recalculating:</strong></p>
<pre><code>Substring 1: &quot;ece&quot; → Create set from scratch → {&#39;e&#39;,&#39;c&#39;} → 2 distinct
Substring 2: &quot;ce&quot;  → Create set from scratch → {&#39;c&#39;,&#39;e&#39;} → 2 distinct  ← Recalculated!
</code></pre>
<p><strong>You update incrementally:</strong></p>
<pre><code>Substring 1: &quot;ece&quot; → freq={&#39;e&#39;:2, &#39;c&#39;:1} → 2 distinct
Substring 2: &quot;ce&quot;  → Remove &#39;e&#39;, freq={&#39;e&#39;:1, &#39;c&#39;:1} → 2 distinct  ← O(1) update!
</code></pre>
<p><strong>The Key Insight:</strong> Use a <strong>frequency map</strong> to track character counts. Update it incrementally as the window slides!</p>
`
    },

    {
      type: 'reading',
      id: 'frequency-window-bottlenecks',
      title: 'Frequency Window: Bottleneck Analysis',
      estimatedReadTime: 240,
      content: `<h1>Bottleneck Analysis: What&#39;s Inefficient? 🔍</h1>
<p>Let&#39;s analyze what&#39;s happening in our brute force solution:</p>
<h2>Visualizing the Redundancy</h2>
<p><strong>Example:</strong> <code>s = &quot;eceba&quot;</code>, <code>k = 2</code></p>
<p>When we check consecutive substrings:</p>
<pre><code>Starting at i=0:
  &quot;ece&quot; → Create set: {&#39;e&#39;,&#39;c&#39;} → 2 distinct ✓, length 3
  
Starting at i=1:
  &quot;ce&quot; → Create set: {&#39;c&#39;,&#39;e&#39;} → 2 distinct ✓, length 2
</code></pre>
<p><strong>The Problem:</strong> We&#39;re rebuilding sets for overlapping substrings!</p>
<pre><code>Substring 1: &quot;ece&quot; → Create set from scratch → {&#39;e&#39;,&#39;c&#39;} → 2 distinct
Substring 2: &quot;ce&quot;  → Create set from scratch → {&#39;c&#39;,&#39;e&#39;} → 2 distinct
              ░░
            Overlap! But we recalculate!
</code></pre>
<p><strong>Key Observation:</strong> &quot;ce&quot; is just &quot;ece&quot; with the first &#39;e&#39; removed. We don&#39;t need to rebuild the entire set!</p>
<h2>The Pattern</h2>
<p><strong>Instead of recalculating:</strong></p>
<pre><code>Substring 1: &quot;ece&quot; → Create set → {&#39;e&#39;,&#39;c&#39;} → 2 distinct
Substring 2: &quot;ce&quot;  → Create set → {&#39;c&#39;,&#39;e&#39;} → 2 distinct  ← Recalculated!
Substring 3: &quot;ceb&quot; → Create set → {&#39;c&#39;,&#39;e&#39;,&#39;b&#39;} → 3 distinct ← Recalculated!
</code></pre>
<p><strong>You update incrementally:</strong></p>
<pre><code>Substring 1: &quot;ece&quot; → freq={&#39;e&#39;:2, &#39;c&#39;:1} → 2 distinct
Substring 2: &quot;ce&quot;  → Remove &#39;e&#39;, freq={&#39;e&#39;:1, &#39;c&#39;:1} → 2 distinct  ← O(1) update!
Substring 3: &quot;ceb&quot; → Add &#39;b&#39;, freq={&#39;e&#39;:1, &#39;c&#39;:1, &#39;b&#39;:1} → 3 distinct ← O(1) update!
</code></pre>
<p><strong>The Key Insight:</strong> Use a <strong>frequency map</strong> (dictionary) to track character counts. Update it incrementally as the window slides!</p>
<h2>The Optimization Strategy</h2>
<p>Instead of rebuilding sets for each substring:</p>
<ol>
<li><strong>Track frequencies</strong> in a hash map (dictionary)</li>
<li><strong>Add</strong> characters when expanding window (increment count)</li>
<li><strong>Remove</strong> characters when shrinking window (decrement count, delete if count reaches 0)</li>
<li><strong>Check constraint</strong> using len(freq) (number of distinct characters)</li>
</ol>
<p>This eliminates redundant counting! 🎯</p>
`
    },

    {
      type: 'reading',
      id: 'frequency-window-optimization',
      title: 'Frequency Window: Thinking Through the Optimization',
      estimatedReadTime: 300,
      content: `<h1>Thinking Through the Optimization 🧠</h1>
<p>We identified the bottleneck: creating new sets for each substring to count distinct characters. Let&#39;s derive a better approach.</p>

<h2>The Key Insight</h2>
<p>Instead of creating <code>set(substring)</code> each time:</p>
<ul>
<li>Track a <strong>frequency map</strong> that we update incrementally</li>
<li>The number of keys in the map = distinct character count!</li>
</ul>

<h2>Step 1: What Data Structure?</h2>
<p>We need to track: how many of each character is in the current window.</p>
<p>A dictionary/hashmap: <code>{char: count}</code></p>
<p>The insight: <code>len(freq)</code> = number of distinct characters!</p>

<h2>Step 2: Updating Incrementally</h2>
<p><strong>When adding a character c:</strong></p>
<pre><code class="language-python">freq[c] = freq.get(c, 0) + 1
# If c was new, len(freq) increases by 1
# If c existed, len(freq) stays the same
</code></pre>
<p><strong>When removing a character c:</strong></p>
<pre><code class="language-python">freq[c] -= 1
if freq[c] == 0:
    del freq[c]  # Critical: delete when count hits 0!
# Now len(freq) accurately reflects distinct count
</code></pre>
<p><strong>Why delete when count is 0?</strong></p>
<p>If we don&#39;t delete, <code>len(freq)</code> would include characters with count 0, breaking our invariant.</p>

<h2>Step 3: Maximum or Minimum Logic?</h2>
<p>We want the <strong>LONGEST</strong> substring with at most k distinct characters.</p>
<p>This is a Maximum Window scenario:</p>
<ul>
<li>Expand greedily (to maximize length)</li>
<li>Shrink when distinct count exceeds k</li>
</ul>

<h2>Step 4: Deriving the Code</h2>
<p>Let&#39;s build the solution from our reasoning:</p>
<pre><code class="language-python">def lengthOfLongestSubstringKDistinct(s, k):
    freq = {}  # Character frequencies in current window
    left = 0
    max_len = 0

    for right in range(len(s)):
        # Add right character
        char = s[right]
        freq[char] = freq.get(char, 0) + 1

        # Shrink while too many distinct characters
        while len(freq) &gt; k:
            left_char = s[left]
            freq[left_char] -= 1
            if freq[left_char] == 0:
                del freq[left_char]  # Critical cleanup!
            left += 1

        # Window valid, update max
        max_len = max(max_len, right - left + 1)

    return max_len
</code></pre>

<h2>Visual Walkthrough</h2>
<p><strong>Input:</strong> <code>s = &quot;eceba&quot;</code>, <code>k = 2</code></p>
<pre><code>right=0: Add &#39;e&#39; → freq={e:1}, 1 distinct, max_len=1
right=1: Add &#39;c&#39; → freq={e:1, c:1}, 2 distinct, max_len=2
right=2: Add &#39;e&#39; → freq={e:2, c:1}, 2 distinct, max_len=3 ← MAX!
right=3: Add &#39;b&#39; → freq={e:2, c:1, b:1}, 3 distinct &gt; k!
         → Shrink: remove &#39;e&#39;, freq={e:1, c:1, b:1}, still 3
         → Shrink: remove &#39;c&#39;, del c, freq={e:1, b:1}, 2 distinct ✓
right=4: Add &#39;a&#39; → freq={e:1, b:1, a:1}, 3 distinct &gt; k!
         → Shrink: remove &#39;e&#39;, del e, freq={b:1, a:1}, 2 distinct ✓

Answer: 3
</code></pre>

<h2>Why This Works</h2>
<p>The key insight is the same as before:</p>
<ul>
<li>Each character added once (right pointer)</li>
<li>Each character removed at most once (left pointer)</li>
<li>Hash map operations are O(1) average</li>
<li>Total: <strong>O(n)</strong> instead of O(n³)!</li>
</ul>

<h2>The Derivation in Action</h2>
<p>Notice how we didn&#39;t memorize a template. We asked:</p>
<ol>
<li>What&#39;s redundant? → Rebuilding the set for each substring</li>
<li>How do we track distinct count? → Use a frequency map, len(map) = distinct</li>
<li>When do we expand/shrink? → Same as Maximum Window (expand greedily, shrink when invalid)</li>
</ol>
<p>This thinking process works for any window problem tracking character frequencies.</p>
<h2>Practice Time 🎯</h2>
<p>Now apply what you derived to a new problem. For more practice problems, click the <strong>Practice</strong> button in the header.</p>`
    },
    {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-frequency-k-distinct',
      title: 'Longest Substring with At Most K Distinct Characters',
      description: 'Find longest substring with at most k distinct characters.',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(k)', notes: 'Single pass, frequency map for distinct count' },
      difficulty: 'medium',
      instruction: `# Longest Substring with At Most K Distinct Characters

Given a string \`s\` and an integer \`k\`, return the length of the longest substring that contains **at most** \`k\` distinct characters.

## Examples

**Example 1:**
- Input: \`s = "eceba"\`, \`k = 2\`
- Output: \`3\`
- Explanation: The substring "ece" has 2 distinct characters.

**Example 2:**
- Input: \`s = "aa"\`, \`k = 1\`
- Output: \`2\`

## Constraints
- \`1 <= s.length <= 5 * 10^4\`
- \`0 <= k <= 50\`

## Approach
Use frequency window: track character frequencies in a hash map, expand when distinct <= k, shrink when distinct > k.`,
      starterCode: `def lengthOfLongestSubstringKDistinct(s, k):
    pass`,
      solution: {
        afterAttempt: 3,
        text: `def lengthOfLongestSubstringKDistinct(s, k):
    if k == 0:
        return 0
    
    freq = {}
    left = 0
    max_len = 0
    
    for right in range(len(s)):
        # Add current character
        freq[s[right]] = freq.get(s[right], 0) + 1
        
        # Shrink if more than k distinct characters
        while len(freq) > k:
            freq[s[left]] -= 1
            if freq[s[left]] == 0:
                del freq[s[left]]
            left += 1
        
        # Window is valid, update max
        max_len = max(max_len, right - left + 1)
    
    return max_len`
      },
      hints: [
        { afterAttempt: 1, text: 'Track character frequencies in a dictionary. Expand when distinct characters <= k.' },
        { afterAttempt: 2, text: 'When len(freq) > k, shrink window from left. Remember to delete entries when count reaches 0.' }
      ],
      testCases: [
        { input: '"eceba", 2', expectedOutput: '3' },
        { input: '"aa", 1', expectedOutput: '2' },
        { input: '"aabbcc", 3', expectedOutput: '6' }
      ],
      solutionExplanation: `Use a frequency map to track character counts. Expand the window when distinct characters <= k, and shrink when distinct characters > k. Remember to clean up frequency map entries when count reaches 0.`
    },

    // ==========================================
    // SECTION 6: Summary
    // ==========================================
    {
      type: 'reading',
      id: 'sliding-window-summary',
      title: 'Summary: The Derivation Process',
      estimatedReadTime: 180,
      content: `<h1>Summary: Deriving Sliding Window Solutions 🧠</h1>
<p>Congratulations! You haven't memorized "five types of sliding windows." You've learned something far more powerful: <strong>how to derive optimized solutions from first principles.</strong></p>

<h2>The Mental Process</h2>
<p>Before you write a single line of code, close your eyes and trace through the brute force. Watch the redundant work happen. The optimization will become obvious.</p>

<h3>What You Did in This Module</h3>
<p>For every problem, you followed the same derivation:</p>
<ol>
<li><strong>Visualized the Brute Force:</strong> You ran the O(n²) solution in your mind—checking every subarray, counting zeros, summing elements, tracking frequencies.</li>
<li><strong>Spotted the Repetition:</strong> You noticed that subarrays <code>[i, j]</code> and <code>[i, j+1]</code> share almost all elements. Re-calculating from scratch wastes work.</li>
<li><strong>Removed the Bottleneck:</strong> Instead of recalculating, you updated incrementally: add the new element, remove the old one. O(n²) became O(n).</li>
<li><strong>Tested Edge Cases:</strong> Empty arrays, k=0, all zeros, all ones—you verified correctness before coding.</li>
</ol>

<h2>The "Types" Are Just Outcomes</h2>
<p>Fixed, Variable, Maximum, Minimum, Frequency—these aren't patterns to memorize. They're different <em>outcomes</em> of the same derivation process applied to different constraints:</p>
<ul>
<li><strong>Fixed window:</strong> The brute force checked every k-length subarray. The optimization: slide by adding/removing one element.</li>
<li><strong>Variable window (target sum):</strong> The brute force expanded from every start. The optimization: shrink from the left when invalid instead of restarting.</li>
<li><strong>Maximum window (at most k zeros):</strong> The brute force checked all subarrays for zeros. The optimization: expand while valid, shrink when invalid.</li>
<li><strong>Minimum window (exactly k ones):</strong> Same process, but update the answer while shrinking instead of expanding.</li>
<li><strong>Frequency window:</strong> The brute force rebuilt character counts. The optimization: update the frequency map incrementally.</li>
</ul>

<h2>The Universal Framework</h2>
<p>This process—<strong>Brute Force → Identify Repetition → Remove Bottleneck → Test</strong>—works for almost any algorithmic challenge, not just sliding windows.</p>
<p>You're now equipped to derive solutions to problems you've never seen before. That's the real skill. 🚀</p>`
    },

    // SMART PRACTICE EXERCISES - All practice problems for this module
    ...moduleSlidingWindowLessonSmartPracticeExercises,
  ])
};

