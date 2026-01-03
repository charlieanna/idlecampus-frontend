import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { moduleArrayPartitioningLessonSmartPracticeExercises } from './exercises/moduleArrayPartitioningLessonSmartPracticeExercises';

export const moduleArrayPartitioningLesson: ProgressiveLesson = {
  id: 'array-partitioning-toolbox',
  title: 'Module: Array Partitioning Toolbox',
  description: 'Learn how to rearrange arrays in-place using pointer boundaries, QuickSort partitioning, and the Dutch National Flag algorithm.',
  unlockMode: 'flexible',
  sections: [
    {
      type: 'reading',
      id: 'partitioning-problem',
      title: 'Section 1 · Rearrange Without Extra Space',
      estimatedReadTime: 360,
      content: `<h1>The Partitioning Challenge</h1>
<p><strong>Goal:</strong> reorder an array <strong>in-place</strong> according to some rule (pivot, parity, color), using <strong>O(1) extra space</strong> and <strong>O(n)</strong> time.</p>
<h2>Classic Interview Variants</h2>
<ul>
<li><strong>Sort Colors / Dutch National Flag:</strong> reorder 0s, 1s, and 2s.</li>
<li><strong>Move Zeros:</strong> shift all zeros to the end while preserving the order of non-zeros.</li>
<li><strong>Partition Around Pivot:</strong> QuickSort&#39;s fundamental step.</li>
<li><strong>Segregate Even and Odd:</strong> keep parity groups apart.</li>
</ul>
<p>Naïve solutions often allocate extra lists:</p>
<pre><code class="language-python">zeros = [x for x in arr if x == 0]
ones = [x for x in arr if x == 1]
twos = [x for x in arr if x == 2]
return zeros + ones + twos
</code></pre>
<p>That costs <strong>O(n) space</strong>. Partitioning uses pointer manipulation to keep everything in the same array, giving us <strong>O(1) space</strong> and often simpler memory access patterns.</p>
`,
    },
    {
      type: 'reading',
      id: 'quicksort-foundation',
      title: 'Section 2 · QuickSort Partition (Lomuto)',
      estimatedReadTime: 420,
      content: `<h1>QuickSort Partition · Lomuto Scheme</h1>
<p>Given a pivot value, partition so numbers <strong>smaller than pivot go left</strong> and numbers <strong>greater or equal go right</strong>.</p>
<h3>Algorithm</h3>
<ul>
<li>Choose the rightmost element as the pivot.</li>
<li>Maintain index <code>i</code> for the boundary of the &quot;&lt; pivot&quot; region.</li>
<li>Sweep index <code>j</code> through the array:<ul>
<li>If <code>arr[j] &lt; pivot</code>, increment <code>i</code> and swap <code>arr[i]</code> with <code>arr[j]</code>.</li>
</ul>
</li>
<li>After the loop, place the pivot between the two regions.</li>
</ul>
<pre><code class="language-python">def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] &lt; pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1
</code></pre>
<p><strong>Pointers to track:</strong></p>
<ul>
<li><code>i</code>: end of the &quot;&lt; pivot&quot; region</li>
<li><code>j</code>: current scanning index</li>
<li>swap: pulls values into the correct region immediately</li>
</ul>
<p>That single partition step is responsible for QuickSort, QuickSelect, median-of-medians, and dozens of selection-style problems.</p>
`,
    },
    {
      type: 'reading',
      id: 'partitioning-mental-sim',
      title: 'Section 3 · Mental Simulation: Partition Walkthrough',
      estimatedReadTime: 360,
      content: `<h1>Simulate A Partition Step-By-Step</h1>
<p>Take <code>arr = [7, 2, 1, 6, 8, 5, 3, 4]</code> with pivot = 4 (last element):</p>
<ol>
<li><strong>Initial:</strong> i = -1, j scans from low to high-1.</li>
<li>Compare 7 (j=0) → 7 ≥ 4, do nothing.</li>
<li>Compare 2 (j=1) → 2 &lt; 4 → increment i to 0, swap indices 0 and 1 → array becomes <code>[2, 7, 1, 6, 8, 5, 3, 4]</code>.</li>
<li>Continue until the scan completes.</li>
<li>Finally, swap pivot with element at i+1 so that every value left of i+1 is &lt; pivot.</li>
</ol>
<p>During simulation, narrate the invariant aloud:</p>
<ul>
<li><code>[low, i]</code> → values &lt; pivot</li>
<li><code>[i+1, j-1]</code> → values ≥ pivot</li>
<li><code>[j, high-1]</code> → unprocessed</li>
<li>pivot sits at <code>high</code></li>
</ul>
<p>Maintaining these regions is what keeps the algorithm correct.</p>
`,
    },
    {
      type: 'reading',
      id: 'dutch-flag',
      title: 'Section 4 · Dutch National Flag (3-Way Partition)',
      estimatedReadTime: 420,
      content: `<h1>Dutch National Flag · Three Regions</h1>
<p>Partition 0s, 1s, and 2s (or &lt; x, = x, &gt; x) with <strong>three pointers</strong>:</p>
<ul>
<li><code>low</code>: boundary of the 0-region and start of the 1-region</li>
<li><code>mid</code>: current element</li>
<li><code>high</code>: boundary of the 2-region</li>
</ul>
<pre><code class="language-python">def sort_colors(nums):
    low = mid = 0
    high = len(nums) - 1
    while mid &lt;= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:  # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
</code></pre>
<p>The invariant:</p>
<ul>
<li>All indices &lt; low are 0</li>
<li>low … mid-1 are 1</li>
<li>mid … high are unknown</li>
<li><blockquote>
<p>high are 2</p>
</blockquote>
</li>
</ul>
<p>Every swap shrinks the unknown region until the entire array is partitioned in <strong>one pass</strong>.</p>
`,
    },
    {
      type: 'reading',
      id: 'partition-patterns',
      title: 'Section 5 · Recognise The Pattern',
      estimatedReadTime: 300,
      content: `<h1>Common Partitioning Patterns</h1>
<table>
<thead>
<tr>
<th>Pattern</th>
<th>When To Use</th>
<th>Pointer Strategy</th>
</tr>
</thead>
<tbody><tr>
<td><strong>2-way partition</strong></td>
<td>Separate &lt; pivot vs ≥ pivot</td>
<td>One boundary pointer + scanner</td>
</tr>
<tr>
<td><strong>3-way partition</strong></td>
<td>Three categories (0/1/2, &lt; x, = x, &gt; x)</td>
<td>Two boundaries + scanner</td>
</tr>
<tr>
<td><strong>Stable partition</strong></td>
<td>Need to keep original order</td>
<td>Read pointer + write pointer</td>
</tr>
</tbody></table>
<p><strong>Invariant mindset:</strong> clearly define what each region of the array represents. The job of your pointers is to enforce those invariants with minimal swaps.</p>
`,
    },
    {
      type: 'reading',
      id: 'partition-real-world',
      title: 'Section 6 · Real-World Applications',
      estimatedReadTime: 300,
      content: `<h1>Why Partitioning Matters</h1>
<ul>
<li><strong>QuickSort / QuickSelect:</strong> the partition step runs thousands of times per second inside sorting libraries.</li>
<li><strong>Image &amp; signal processing:</strong> bucket pixels/values into ranges without extra buffers.</li>
<li><strong>Analytics pipelines:</strong> split records into cohorts (e.g., &lt; threshold vs ≥ threshold).</li>
<li><strong>Search optimisation:</strong> “Find the k-th largest” or “median of stream” rely on partitioning.</li>
<li><strong>Games / simulations:</strong> separate active vs inactive entities, draw order layers.</li>
<li><strong>Interview favourites:</strong> “Sort Colors”, “Move Zeroes”, “Partition Array by Parity”.</li>
</ul>
<p>Partitioning problems force you to practice pointer invariants, swapping discipline, and tight reasoning about array regions—skills that carry into every in-place algorithm you will write.</p>
`,
    },

    // SMART PRACTICE EXERCISES - All practice problems for this module
    ...moduleArrayPartitioningLessonSmartPracticeExercises,
  ],
};

