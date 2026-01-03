import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { module7BinarySearchLessonSmartPracticeExercises } from './exercises/moduleBinarySearchLessonSmartPracticeExercises';

export const module7BinarySearchLesson: ProgressiveLesson = {
  id: 'binary-search-sorting',
        title: 'Module: Binary Search & Sorting',
        description: 'Master binary search patterns, search variations, and fundamental sorting algorithms',
        unlockMode: 'sequential',
        sections: [
                // SECTION 0: Introduction
                {
                        type: 'reading' as const,
                        id: 'module9-intro',
                        title: 'Welcome to Binary Search & Sorting',
                        estimatedReadTime: 300,
                        content: `<h1>Welcome to Binary Search &amp; Sorting 🔍</h1>
<h2>What You&#39;ll Learn</h2>
<p>This module covers one of the most powerful algorithmic techniques: <strong>binary search</strong> - the ability to find things in logarithmic time!</p>
<h3>Key Topics:</h3>
<ol>
<li><strong>Binary Search Fundamentals</strong> - O(log n) search on sorted data</li>
<li><strong>Search Variations</strong> - First/last occurrence, rotated arrays, peak finding</li>
<li><strong>Binary Search on Answer Space</strong> - The &quot;minimize maximum&quot; pattern</li>
<li><strong>Sorting Algorithms</strong> - Merge Sort &amp; Quick Sort fundamentals</li>
</ol>
<hr>
<h2>📖 The Intuition: How Binary Search Works</h2>
<p>Imagine you&#39;re looking up a word in a <strong>physical dictionary</strong>:</p>
<ol>
<li>You don&#39;t start at page 1 and flip through every page</li>
<li>You open to the <strong>middle</strong> and check if your word comes before or after</li>
<li>You eliminate <strong>half</strong> the dictionary and repeat</li>
</ol>
<p>That&#39;s binary search! <strong>Each step eliminates half the remaining possibilities.</strong></p>
<hr>
<h2>🎯 Step-by-Step Visualization</h2>
<p>Let&#39;s search for <strong>target = 9</strong> in this sorted array:</p>
<pre><code>Array: [-1, 0, 3, 5, 9, 12]
Index:  0   1  2  3  4   5
</code></pre>
<p><strong>Step 1:</strong> Start with entire array</p>
<pre><code>[-1, 0, 3, 5, 9, 12]
  L        M       R     left=0, right=5, mid=2

nums[mid] = 3
Is 3 == 9? No
Is 3 &lt; 9?  Yes! → Target must be in RIGHT half
           → Move left = mid + 1 = 3
</code></pre>
<p><strong>Step 2:</strong> Search right half only</p>
<pre><code>[-1, 0, 3, 5, 9, 12]
           L  M   R     left=3, right=5, mid=4

nums[mid] = 9
Is 9 == 9? YES! → Found at index 4 ✓
</code></pre>
<p><strong>Only 2 steps to search 6 elements!</strong> With linear search, we&#39;d need up to 6 steps.</p>
<hr>
<h2>🔑 The Key Insight: Eliminating Half Each Time</h2>
<pre><code>Step 1: [████████████████] n elements
Step 2: [████████]         n/2 elements  
Step 3: [████]             n/4 elements
Step 4: [██]               n/8 elements
...
Final:  [█]                1 element
</code></pre>
<p><strong>How many steps?</strong> We keep halving until we reach 1 element:</p>
<ul>
<li>n → n/2 → n/4 → ... → 1</li>
<li>Number of halvings = <strong>log₂(n)</strong></li>
</ul>
<table>
<thead>
<tr>
<th>Array Size</th>
<th>Linear Search</th>
<th>Binary Search</th>
</tr>
</thead>
<tbody><tr>
<td>1,000</td>
<td>1,000 steps</td>
<td>10 steps</td>
</tr>
<tr>
<td>1,000,000</td>
<td>1,000,000 steps</td>
<td>20 steps</td>
</tr>
<tr>
<td>1 billion</td>
<td>1 billion steps</td>
<td>30 steps</td>
</tr>
</tbody></table>
<hr>
<h2>🧩 Understanding the Loop Condition: <code>while left &lt;= right</code></h2>
<p>This is the most important part to understand!</p>
<h3>What does <code>left &lt;= right</code> mean?</h3>
<ul>
<li><code>left</code> and <code>right</code> define our <strong>search space</strong> (the remaining candidates)</li>
<li><code>left &lt;= right</code> means <strong>&quot;there&#39;s at least 1 element left to check&quot;</strong></li>
<li>When <code>left &gt; right</code>, the search space is <strong>empty</strong> - we&#39;ve checked everything</li>
</ul>
<h3>Visual: Why we need <code>&lt;=</code> not just <code>&lt;</code></h3>
<pre><code>Searching for 5 in [1, 3, 5]:

Step 1: [1, 3, 5]
         L  M  R    left=0, right=2, mid=1
         nums[1]=3 &lt; 5, so left = mid+1 = 2

Step 2: [1, 3, 5]
               L    left=2, right=2, mid=2
               R    (left == right, ONE element left!)
               
         nums[2]=5 == 5 → FOUND!
</code></pre>
<p>If we used <code>while left &lt; right</code>, we&#39;d exit the loop before checking index 2, and <strong>miss the answer!</strong></p>
<h3>The Rule:</h3>
<ul>
<li><code>while left &lt;= right</code> → Check <strong>every</strong> element, loop exits when space is empty</li>
<li>Search space = <code>[left, right]</code> (inclusive on both ends)</li>
</ul>
<hr>
<h2>🛠️ The Template: Understanding Each Part</h2>
<pre><code class="language-python">def binary_search(nums, target):
    left, right = 0, len(nums) - 1    # 1. Define search space
    
    while left &lt;= right:               # 2. While space is non-empty
        mid = left + (right - left) // 2   # 3. Find middle
        
        if nums[mid] == target:        # 4. Check middle element
            return mid                 #    Found it!
        elif nums[mid] &lt; target:       # 5. Target is larger
            left = mid + 1             #    Eliminate left half
        else:                          # 6. Target is smaller
            right = mid - 1            #    Eliminate right half
    
    return -1  # 7. Not found (space exhausted)
</code></pre>
<h3>Why <code>mid + 1</code> and <code>mid - 1</code>?</h3>
<p>We already checked <code>nums[mid]</code> and it&#39;s NOT the target. So:</p>
<ul>
<li>If target is larger: search <code>[mid+1, right]</code> — exclude mid</li>
<li>If target is smaller: search <code>[left, mid-1]</code> — exclude mid</li>
</ul>
<p><strong>This guarantees the search space shrinks every iteration</strong> (no infinite loops!)</p>
<hr>
<h2>🔄 How to Modify for Different Problems</h2>
<p>The template above finds <strong>any occurrence</strong> of target. But what if you need:</p>
<h3>Find FIRST occurrence (leftmost):</h3>
<pre><code class="language-python">if nums[mid] == target:
    result = mid          # Save this, but keep looking LEFT
    right = mid - 1       # Maybe there&#39;s an earlier one
</code></pre>
<h3>Find LAST occurrence (rightmost):</h3>
<pre><code class="language-python">if nums[mid] == target:
    result = mid          # Save this, but keep looking RIGHT  
    left = mid + 1        # Maybe there&#39;s a later one
</code></pre>
<h3>Find insertion position:</h3>
<pre><code class="language-python"># After loop ends, &#39;left&#39; is where target WOULD go
return left
</code></pre>
<p><strong>Key insight:</strong> The modification is always in <strong>what you do when you find a match</strong>.</p>
<hr>
<h2>⚠️ Critical: Avoiding Integer Overflow</h2>
<p><strong>Never write:</strong> <code>mid = (left + right) // 2</code></p>
<p><strong>Always write:</strong> <code>mid = left + (right - left) // 2</code></p>
<p><strong>Why?</strong> In languages like Java/C++, <code>left + right</code> can overflow if both are large integers (close to INT_MAX). While Python handles big integers natively, using the safe formula is a best practice that works everywhere and is what interviewers expect.</p>
<p><strong>Example of overflow:</strong></p>
<pre><code>left = 2,000,000,000
right = 2,000,000,000
left + right = 4,000,000,000  // Overflows INT_MAX (2.1 billion)!

# Safe version:
left + (right - left) // 2 = 2,000,000,000  // No overflow!
</code></pre>
<hr>
<h2>✅ Binary Search Checklist</h2>
<p>Before coding, ask yourself:</p>
<ol>
<li><strong>Is the array sorted?</strong> (or has some monotonic property)</li>
<li><strong>What am I searching for?</strong> (exact value, first/last occurrence, boundary)</li>
<li><strong>What should I return if not found?</strong> (-1, insertion point, boundary)</li>
</ol>
<p>While coding, verify:</p>
<ul>
<li><input disabled="" type="checkbox"> <code>left &lt;= right</code> for inclusive bounds</li>
<li><input disabled="" type="checkbox"> <code>mid = left + (right - left) // 2</code> to avoid overflow</li>
<li><input disabled="" type="checkbox"> <code>left = mid + 1</code> or <code>right = mid - 1</code> (search space shrinks)</li>
</ul>
<hr>
<h2>Ready to Start!</h2>
<p>Let&#39;s begin with the classic binary search implementation. Each exercise builds on the previous one, teaching you new variations of this powerful technique.</p>
<p>Let&#39;s go! 🚀</p>
`,
                },// SECTION 2: Binary Search Variations
                {
                        type: 'reading',
                        id: 'bs-variations',
                        title: 'Binary Search Variations',
                        content: `<h1>Binary Search Variations 🔄</h1>
<h2>Find Insert Position</h2>
<p><strong>Problem:</strong> Find index where target should be inserted to maintain sorted order.</p>
<pre><code class="language-python">def search_insert(nums, target):
    left, right = 0, len(nums) - 1

    while left &lt;= right:
        mid = left + (right - left) // 2

        if nums[mid] == target:
            return mid
        elif nums[mid] &lt; target:
            left = mid + 1
        else:
            right = mid - 1

    # When not found, left is the insert position!
    return left
</code></pre>
<p><strong>Example:</strong> <code>[1, 3, 5, 6]</code>, target = 2 → return 1</p>
<hr>
<h2>Find First/Last Occurrence</h2>
<p><strong>Problem:</strong> Array has duplicates, find first or last occurrence.</p>
<h3>Find First Occurrence:</h3>
<pre><code class="language-python">def find_first(nums, target):
    left, right = 0, len(nums) - 1
    result = -1

    while left &lt;= right:
        mid = left + (right - left) // 2

        if nums[mid] == target:
            result = mid
            right = mid - 1  # Keep searching left
        elif nums[mid] &lt; target:
            left = mid + 1
        else:
            right = mid - 1

    return result
</code></pre>
<h3>Find Last Occurrence:</h3>
<pre><code class="language-python">def find_last(nums, target):
    left, right = 0, len(nums) - 1
    result = -1

    while left &lt;= right:
        mid = left + (right - left) // 2

        if nums[mid] == target:
            result = mid
            left = mid + 1  # Keep searching right
        elif nums[mid] &lt; target:
            left = mid + 1
        else:
            right = mid - 1

    return result
</code></pre>
<p><strong>Example:</strong> <code>[1, 2, 2, 2, 3]</code>, target = 2</p>
<ul>
<li>First occurrence: index 1</li>
<li>Last occurrence: index 3</li>
</ul>
<hr>
<h2>Search in Rotated Sorted Array</h2>
<p><strong>Problem:</strong> Sorted array rotated at pivot. E.g., <code>[4, 5, 6, 7, 0, 1, 2]</code></p>
<p><strong>Key insight:</strong> One half is always sorted!</p>
<pre><code class="language-python">def search_rotated(nums, target):
    left, right = 0, len(nums) - 1

    while left &lt;= right:
        mid = left + (right - left) // 2

        if nums[mid] == target:
            return mid

        # Left half is sorted
        if nums[left] &lt;= nums[mid]:
            # Target in sorted left half?
            if nums[left] &lt;= target &lt; nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            # Target in sorted right half?
            if nums[mid] &lt; target &lt;= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1
</code></pre>
<p><strong>Visualization:</strong></p>
<pre><code>[4, 5, 6, 7, 0, 1, 2]
 ↑        ↑        ↑
left     mid     right

Left half [4,5,6,7] is sorted (4 ≤ 7)
Check if target in this sorted range
</code></pre>
<hr>
<h2>Find Peak Element</h2>
<p><strong>Problem:</strong> Find any peak where <code>nums[i] &gt; nums[i-1]</code> and <code>nums[i] &gt; nums[i+1]</code></p>
<pre><code class="language-python">def find_peak(nums):
    left, right = 0, len(nums) - 1

    while left &lt;= right:
        mid = left + (right - left) // 2
        
        # Handle edge case where mid is at the end of array
        if mid == len(nums) - 1:
            return mid
            
        # If going up, peak is on right
        if nums[mid] &lt; nums[mid + 1]:
            left = mid + 1
        # If going down, peak is on left (or mid itself)
        else:
            right = mid - 1

    return left
</code></pre>
<p><strong>Why it works:</strong> Always move toward the increasing side!</p>
<hr>
<h2>Find Square Root (Integer)</h2>
<p><strong>Problem:</strong> Find floor(sqrt(x))</p>
<pre><code class="language-python">def my_sqrt(x):
    if x &lt; 2:
        return x

    left, right = 1, x // 2
    result = 0

    while left &lt;= right:
        mid = left + (right - left) // 2
        square = mid * mid

        if square == x:
            return mid
        elif square &lt; x:
            result = mid  # Potential answer
            left = mid + 1
        else:
            right = mid - 1

    return result
</code></pre>
<hr>
<h2>Pattern Recognition</h2>
<p><strong>&quot;Find insert position&quot;?</strong> → Return left pointer after search</p>
<p><strong>&quot;Find first/last occurrence&quot;?</strong> → Continue searching after finding</p>
<p><strong>&quot;Rotated sorted array&quot;?</strong> → Check which half is sorted</p>
<p><strong>&quot;Find peak/valley&quot;?</strong> → Move toward increasing direction</p>
<p><strong>&quot;Find sqrt, boundary, threshold&quot;?</strong> → Binary search on answer space</p>
`,
                        estimatedReadTime: 360,
                        autoMarkComplete: false,
                },


                // SECTION 3: Binary Search on Answer Space
                {
                        type: 'reading',
                        id: 'bs-answer-space',
                        title: 'Binary Search on Answer Space',
                        content: `<h1>Binary Search on Answer Space 💡</h1>
<h2>The Breakthrough</h2>
<p><strong>Instead of searching the array, search the range of possible answers!</strong></p>
<p>Works when:</p>
<ol>
<li>You need to minimize/maximize something</li>
<li>You can check if a value is feasible in O(n) or better</li>
<li>Answer space is monotonic</li>
</ol>
<hr>
<h2>Classic: Capacity to Ship Packages</h2>
<p><strong>Problem:</strong> Given array of package weights and D days, find minimum ship capacity to ship all packages in D days.</p>
<p><strong>Constraints:</strong></p>
<ul>
<li>Ship in order (can&#39;t skip)</li>
<li>Each day ship until capacity reached</li>
</ul>
<pre><code class="language-python">def ship_within_days(weights, days):
    def can_ship(capacity):
        &quot;&quot;&quot;Check if we can ship with this capacity in &#39;days&#39; days&quot;&quot;&quot;
        current_day = 1
        current_weight = 0

        for weight in weights:
            if weight &gt; capacity:
                return False

            if current_weight + weight &gt; capacity:
                # Start new day
                current_day += 1
                current_weight = weight

                if current_day &gt; days:
                    return False
            else:
                current_weight += weight

        return True

    # Binary search on capacity
    left = max(weights)  # At least the heaviest package
    right = sum(weights)  # At most all packages in one day

    while left &lt;= right:
        mid = left + (right - left) // 2

        if can_ship(mid):
            # Can ship with this capacity, try smaller
            right = mid - 1
        else:
            # Can&#39;t ship, need more capacity
            left = mid + 1

    return left
</code></pre>
<p><strong>Example:</strong></p>
<pre><code>weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
days = 5

Capacity range: [10, 55]
Try 32: Can ship? If yes, try 21... eventually find 15
</code></pre>
<hr>
<h2>Koko Eating Bananas</h2>
<p><strong>Problem:</strong> Koko loves bananas. Given piles and H hours, find minimum eating speed K to finish all piles in H hours.</p>
<pre><code class="language-python">def min_eating_speed(piles, h):
    def can_eat_all(speed):
        &quot;&quot;&quot;Check if Koko can eat all bananas at this speed in h hours&quot;&quot;&quot;
        hours = 0
        for pile in piles:
            hours += (pile + speed - 1) // speed  # Ceiling division
        return hours &lt;= h

    # Binary search on eating speed
    left, right = 1, max(piles)

    while left &lt;= right:
        mid = left + (right - left) // 2

        if can_eat_all(mid):
            right = mid - 1  # Can eat all, try slower
        else:
            left = mid + 1  # Too slow, need faster

    return left
</code></pre>
<hr>
<h2>Split Array Largest Sum</h2>
<p><strong>Problem:</strong> Split array into m subarrays to minimize the largest subarray sum.</p>
<pre><code class="language-python">def split_array(nums, m):
    def can_split(max_sum):
        &quot;&quot;&quot;Check if we can split into m subarrays with max sum = max_sum&quot;&quot;&quot;
        current_sum = 0
        splits = 1

        for num in nums:
            if num &gt; max_sum:
                return False

            if current_sum + num &gt; max_sum:
                splits += 1
                current_sum = num

                if splits &gt; m:
                    return False
            else:
                current_sum += num

        return True

    # Binary search on the maximum sum
    left = max(nums)  # At least the largest element
    right = sum(nums)  # At most all elements in one subarray

    while left &lt;= right:
        mid = left + (right - left) // 2

        if can_split(mid):
            right = mid - 1  # Can split, try smaller max
        else:
            left = mid + 1  # Can&#39;t split, need larger max

    return left
</code></pre>
<hr>
<h2>The Pattern</h2>
<ol>
<li><strong>Identify answer range:</strong> [minimum possible, maximum possible]</li>
<li><strong>Write feasibility function:</strong> Can we achieve X?</li>
<li><strong>Binary search on answer:</strong><ul>
<li>If feasible, try better (smaller for minimize, larger for maximize)</li>
<li>If not feasible, try worse</li>
</ul>
</li>
</ol>
<p><strong>Time Complexity:</strong> O(n × log(max - min)) where n is array size</p>
<hr>
<h2>Pattern Recognition</h2>
<p><strong>&quot;Minimize the maximum&quot; or &quot;maximize the minimum&quot;?</strong> → Binary search on answer</p>
<p><strong>Can check feasibility in O(n)?</strong> → Binary search on answer</p>
<p><strong>&quot;Split/allocate with constraint&quot;?</strong> → Binary search on answer</p>
<p><strong>&quot;Ship/eat/work with rate/capacity limit&quot;?</strong> → Binary search on answer</p>
`,
                        estimatedReadTime: 300,
                        autoMarkComplete: false,
                },// SECTION 4: Sorting Algorithms
                {
                        type: 'reading',
                        id: 'sorting-algorithms',
                        title: 'Sorting: Merge Sort & Quick Sort',
                        content: `<h1>Sorting Algorithms 📊</h1>
<h2>Why Learn Sorting?</h2>
<ol>
<li><strong>Enables binary search</strong> (need sorted data)</li>
<li><strong>Interview staple</strong> (understanding is crucial)</li>
<li><strong>Teaches divide-and-conquer</strong> and partitioning</li>
</ol>
<hr>
<h2>Merge Sort: Divide and Conquer</h2>
<p><strong>Strategy:</strong></p>
<ol>
<li>Divide array into halves</li>
<li>Recursively sort each half</li>
<li>Merge the sorted halves</li>
</ol>
<pre><code class="language-python">def merge_sort(arr):
    if len(arr) &lt;= 1:
        return arr

    # Divide
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    # Conquer (merge)
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0

    # Merge while both have elements
    while i &lt; len(left) and j &lt; len(right):
        if left[i] &lt;= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    # Add remaining elements
    result.extend(left[i:])
    result.extend(right[j:])

    return result
</code></pre>
<p><strong>Visualization:</strong></p>
<pre><code>[38, 27, 43, 3, 9, 82, 10]

Divide:
[38, 27, 43, 3] [9, 82, 10]
[38, 27] [43, 3] [9, 82] [10]
[38] [27] [43] [3] [9] [82] [10]

Merge:
[27, 38] [3, 43] [9, 82] [10]
[3, 27, 38, 43] [9, 10, 82]
[3, 9, 10, 27, 38, 43, 82]
</code></pre>
<p><strong>Complexity:</strong></p>
<ul>
<li><strong>Time:</strong> O(n log n) - always! (log n levels, n work per level)</li>
<li><strong>Space:</strong> O(n) - needs temporary arrays for merging</li>
</ul>
<p><strong>Pros:</strong> Stable, predictable O(n log n)
<strong>Cons:</strong> Needs extra space</p>
<hr>
<h2>Quick Sort: Partition and Conquer</h2>
<p><strong>Strategy:</strong></p>
<ol>
<li>Pick pivot element</li>
<li>Partition: elements &lt; pivot on left, &gt; pivot on right</li>
<li>Recursively sort left and right partitions</li>
</ol>
<pre><code class="language-python">def quick_sort(arr, low, high):
    if low &lt; high:
        # Partition and get pivot position
        pivot_idx = partition(arr, low, high)

        # Sort left and right of pivot
        quick_sort(arr, low, pivot_idx - 1)
        quick_sort(arr, pivot_idx + 1, high)

def partition(arr, low, high):
    pivot = arr[high]  # Choose last element as pivot
    i = low - 1  # Boundary of smaller elements

    for j in range(low, high):
        if arr[j] &lt;= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    # Place pivot in correct position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

# Usage: quick_sort(arr, 0, len(arr) - 1)
</code></pre>
<p><strong>Visualization:</strong></p>
<pre><code>[10, 7, 8, 9, 1, 5]
Pivot = 5

Partition:
[1] 5 [10, 7, 8, 9]

Recursively sort:
[1] 5 [7, 8, 9, 10]

Final: [1, 5, 7, 8, 9, 10]
</code></pre>
<p><strong>Complexity:</strong></p>
<ul>
<li><strong>Time:</strong><ul>
<li>Average: O(n log n)</li>
<li>Worst: O(n²) - already sorted with bad pivot choice</li>
</ul>
</li>
<li><strong>Space:</strong> O(log n) - recursion stack</li>
</ul>
<p><strong>Pros:</strong> In-place (O(1) extra space), fast average case
<strong>Cons:</strong> Unstable, O(n²) worst case</p>
<hr>
<h2>Quick Sort Optimization: Random Pivot</h2>
<p><strong>Problem:</strong> Worst case occurs when pivot is always smallest/largest</p>
<p><strong>Solution:</strong> Choose random pivot or use median-of-three</p>
<pre><code class="language-python">import random

def partition_random(arr, low, high):
    # Choose random pivot
    pivot_idx = random.randint(low, high)
    arr[pivot_idx], arr[high] = arr[high], arr[pivot_idx]

    # Continue with normal partition
    return partition(arr, low, high)
</code></pre>
<p><strong>This makes O(n²) extremely unlikely!</strong></p>
<hr>
<h2>Comparison</h2>
<table>
<thead>
<tr>
<th>Algorithm</th>
<th>Time (Avg)</th>
<th>Time (Worst)</th>
<th>Space</th>
<th>Stable</th>
</tr>
</thead>
<tbody><tr>
<td>Merge Sort</td>
<td>O(n log n)</td>
<td>O(n log n)</td>
<td>O(n)</td>
<td>Yes</td>
</tr>
<tr>
<td>Quick Sort</td>
<td>O(n log n)</td>
<td>O(n²)</td>
<td>O(log n)</td>
<td>No</td>
</tr>
<tr>
<td>Heap Sort</td>
<td>O(n log n)</td>
<td>O(n log n)</td>
<td>O(1)</td>
<td>No</td>
</tr>
<tr>
<td>Insertion Sort</td>
<td>O(n²)</td>
<td>O(n²)</td>
<td>O(1)</td>
<td>Yes</td>
</tr>
</tbody></table>
<hr>
<h2>When to Use What?</h2>
<p><strong>Need stable sort?</strong> → Merge Sort
<strong>Need in-place sort?</strong> → Quick Sort (or Heap Sort)
<strong>Need guaranteed O(n log n)?</strong> → Merge Sort or Heap Sort
<strong>Small array?</strong> → Insertion Sort (low overhead)</p>
<hr>
<h2>Pattern Recognition</h2>
<p><strong>&quot;Sort&quot; in problem?</strong> → Consider if sorted order helps
<strong>Need O(n log n) worst case?</strong> → Merge Sort
<strong>Need O(1) space?</strong> → Quick Sort or Heap Sort
<strong>Already mostly sorted?</strong> → Insertion Sort</p>
`,
                        estimatedReadTime: 360,
                        autoMarkComplete: false,
                },


                // SECTION 5: Sorting Algorithm Exercises
                {
                        type: 'reading',
                        id: 'selection-sort-explanation',
                        title: 'How Selection Sort Works',
                        estimatedReadTime: 180,
                        content: `<h1>Selection Sort: Find the Minimum 🔍</h1>
<h2>The Idea</h2>
<p><strong>Selection Sort</strong> is one of the simplest sorting algorithms:</p>
<ol>
<li>Find the <strong>minimum</strong> element in the unsorted portion</li>
<li><strong>Swap</strong> it with the first unsorted element</li>
<li><strong>Repeat</strong> for remaining unsorted portion</li>
</ol>
<hr>
<h2>Step-by-Step Visualization</h2>
<pre><code>Initial: [64, 25, 12, 22, 11]

Pass 1: Find minimum (11), swap with position 0
        [11, 25, 12, 22, 64]
         ✓

Pass 2: Find minimum in [25, 12, 22, 64] → 12, swap with position 1
        [11, 12, 25, 22, 64]
         ✓   ✓

Pass 3: Find minimum in [25, 22, 64] → 22, swap with position 2
        [11, 12, 22, 25, 64]
         ✓   ✓   ✓

Pass 4: Find minimum in [25, 64] → 25, already in place
        [11, 12, 22, 25, 64]
         ✓   ✓   ✓   ✓   ✓

Done!
</code></pre>
<hr>
<h2>Algorithm</h2>
<pre><code class="language-python">def selection_sort(arr):
    n = len(arr)
    
    for i in range(n):
        # Find minimum in arr[i:n]
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] &lt; arr[min_idx]:
                min_idx = j
        
        # Swap minimum with position i
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    
    return arr
</code></pre>
<hr>
<h2>Time &amp; Space Complexity</h2>
<table>
<thead>
<tr>
<th>Case</th>
<th>Time</th>
<th>Space</th>
</tr>
</thead>
<tbody><tr>
<td>Best</td>
<td>O(n²)</td>
<td>O(1)</td>
</tr>
<tr>
<td>Average</td>
<td>O(n²)</td>
<td>O(1)</td>
</tr>
<tr>
<td>Worst</td>
<td>O(n²)</td>
<td>O(1)</td>
</tr>
</tbody></table>
<p><strong>Always O(n²)</strong> - even if array is already sorted!</p>
<p><strong>Why?</strong> Always scans entire unsorted portion to find minimum.</p>
<hr>
<h2>When to Use Selection Sort?</h2>
<p>✅ <strong>Small arrays</strong> (n &lt; 50)
✅ <strong>Memory constrained</strong> (O(1) space)
✅ <strong>Number of swaps matters</strong> (only n swaps total)</p>
<p>❌ <strong>Large arrays</strong> (O(n²) is too slow)
❌ <strong>Need stability</strong> (selection sort is NOT stable)</p>
<hr>
<h2>Key Insight 💡</h2>
<p>Selection sort minimizes the number of <strong>swaps</strong> (exactly n-1 swaps).</p>
<p>Useful when writes are expensive (e.g., flash memory).</p>
`,
                },
                {
                        type: 'reading',
                        id: 'insertion-sort-explanation',
                        title: 'How Insertion Sort Works',
                        estimatedReadTime: 180,
                        content: `<h1>Insertion Sort: Build Sorted Portion 🃏</h1>
<h2>The Idea</h2>
<p>Think of <strong>sorting playing cards</strong> in your hand:</p>
<ol>
<li>Start with first card (trivially sorted)</li>
<li>Pick next card, <strong>insert</strong> it in correct position among sorted cards</li>
<li>Repeat for all cards</li>
</ol>
<hr>
<h2>Step-by-Step Visualization</h2>
<pre><code>Initial: [5, 2, 4, 6, 1, 3]
         sorted | unsorted

Pass 1: Insert 2 into [5]
        [2, 5, 4, 6, 1, 3]
         ✓  ✓

Pass 2: Insert 4 into [2, 5]
        [2, 4, 5, 6, 1, 3]
         ✓  ✓  ✓

Pass 3: Insert 6 into [2, 4, 5] - already in place!
        [2, 4, 5, 6, 1, 3]
         ✓  ✓  ✓  ✓

Pass 4: Insert 1 into [2, 4, 5, 6]
        [1, 2, 4, 5, 6, 3]
         ✓  ✓  ✓  ✓  ✓

Pass 5: Insert 3 into [1, 2, 4, 5, 6]
        [1, 2, 3, 4, 5, 6]
         ✓  ✓  ✓  ✓  ✓  ✓

Done!
</code></pre>
<hr>
<h2>Algorithm</h2>
<pre><code class="language-python">def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]  # Element to insert
        j = i - 1
        
        # Shift elements greater than key to the right
        while j &gt;= 0 and arr[j] &gt; key:
            arr[j + 1] = arr[j]
            j -= 1
        
        # Insert key at correct position
        arr[j + 1] = key
    
    return arr
</code></pre>
<hr>
<h2>Time &amp; Space Complexity</h2>
<table>
<thead>
<tr>
<th>Case</th>
<th>Time</th>
<th>Space</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Best</strong></td>
<td><strong>O(n)</strong></td>
<td>O(1)</td>
</tr>
<tr>
<td>Average</td>
<td>O(n²)</td>
<td>O(1)</td>
</tr>
<tr>
<td>Worst</td>
<td>O(n²)</td>
<td>O(1)</td>
</tr>
</tbody></table>
<p><strong>Best case O(n)</strong> when array is already sorted!</p>
<p><strong>Why?</strong> Inner loop doesn&#39;t run if element is already in place.</p>
<hr>
<h2>When to Use Insertion Sort?</h2>
<p>✅ <strong>Small arrays</strong> (n &lt; 50)
✅ <strong>Nearly sorted data</strong> (O(n) best case!)
✅ <strong>Online sorting</strong> (sort as data arrives)
✅ <strong>Stable sort needed</strong></p>
<p>❌ <strong>Large random arrays</strong> (O(n²) average)</p>
<hr>
<h2>Key Insight 💡</h2>
<p><strong>Insertion sort is ADAPTIVE</strong> - runs faster on partially sorted data!</p>
<p>This makes it great for:</p>
<ul>
<li>Sorting after few insertions/modifications</li>
<li>Hybrid sorts (switch to insertion for small subarrays)</li>
</ul>
<p><strong>Python&#39;s Timsort</strong> uses insertion sort for small runs!</p>
`,
                },{
                        type: 'reading',
                        id: 'sorting-comparison',
                        title: 'Comparing Sorting Algorithms',
                        estimatedReadTime: 180,
                        content: `<h1>Comparing Sorting Algorithms 📊</h1>
<h2>The Big Picture</h2>
<table>
<thead>
<tr>
<th>Algorithm</th>
<th>Best</th>
<th>Average</th>
<th>Worst</th>
<th>Space</th>
<th>Stable</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Selection Sort</strong></td>
<td>O(n²)</td>
<td>O(n²)</td>
<td>O(n²)</td>
<td>O(1)</td>
<td>❌</td>
</tr>
<tr>
<td><strong>Insertion Sort</strong></td>
<td>O(n)</td>
<td>O(n²)</td>
<td>O(n²)</td>
<td>O(1)</td>
<td>✅</td>
</tr>
<tr>
<td><strong>Merge Sort</strong></td>
<td>O(n log n)</td>
<td>O(n log n)</td>
<td>O(n log n)</td>
<td>O(n)</td>
<td>✅</td>
</tr>
<tr>
<td><strong>Quick Sort</strong></td>
<td>O(n log n)</td>
<td>O(n log n)</td>
<td>O(n²)</td>
<td>O(log n)</td>
<td>❌</td>
</tr>
</tbody></table>
<hr>
<h2>When to Use Each?</h2>
<h3>Selection Sort</h3>
<p>✅ When minimizing <strong>swaps</strong> matters
✅ Very small arrays
❌ Almost never in practice</p>
<h3>Insertion Sort</h3>
<p>✅ <strong>Nearly sorted</strong> data (O(n)!)
✅ <strong>Small arrays</strong> (n &lt; 50)
✅ <strong>Online sorting</strong> (streaming data)
✅ Part of hybrid sorts (Timsort)</p>
<h3>Merge Sort</h3>
<p>✅ Need <strong>guaranteed O(n log n)</strong>
✅ Need <strong>stable</strong> sort
✅ Sorting <strong>linked lists</strong> (no random access needed)
✅ <strong>External sorting</strong> (data doesn&#39;t fit in memory)</p>
<h3>Quick Sort</h3>
<p>✅ <strong>General purpose</strong> (fastest average case)
✅ <strong>In-place</strong> sorting preferred
❌ Avoid if worst case must be prevented</p>
<hr>
<h2>Why Insertion Sort for Small Arrays?</h2>
<p>Even though O(n²) &gt; O(n log n), for small n:</p>
<ul>
<li>Lower constant factors</li>
<li>No recursion overhead</li>
<li>Better cache performance</li>
</ul>
<p><strong>That&#39;s why Timsort (Python) switches to insertion sort for small subarrays!</strong></p>
<hr>
<h2>Stability Matters When...</h2>
<p><strong>Stable sort:</strong> Equal elements keep their relative order.</p>
<p>Important for:</p>
<ul>
<li>Sorting by multiple keys (sort by name, then by age)</li>
<li>Preserving previous sort order</li>
<li>Consistent results</li>
</ul>
<hr>
<h2>Key Takeaways 💡</h2>
<ol>
<li><strong>No single best algorithm</strong> - depends on context</li>
<li><strong>Insertion sort</strong> shines for nearly-sorted data</li>
<li><strong>Merge sort</strong> = reliable, stable, predictable</li>
<li><strong>Quick sort</strong> = fast on average, but risky worst case</li>
<li><strong>Hybrid sorts</strong> combine the best of multiple algorithms</li>
</ol>
`,
                },

                // SECTION 6: Module Summary
                {
                        type: 'reading',
                        id: 'module7-summary',
                        title: 'Module Complete!',
                        content: `<h1>🎉 Module 7 Complete!</h1>
<h2>What You Mastered</h2>
<h3>Binary Search Fundamentals 🎯</h3>
<p>✅ Core algorithm: O(log n) search on sorted data
✅ Template with proper boundaries (left, right, mid)
✅ Avoiding overflow and infinite loops</p>
<h3>Search Variations 🔄</h3>
<p>✅ <strong>Find insert position</strong> - return left pointer
✅ <strong>First/last occurrence</strong> - continue searching after finding
✅ <strong>Rotated sorted array</strong> - check which half is sorted
✅ <strong>Peak element</strong> - move toward increasing direction
✅ <strong>Square root</strong> - binary search on answer</p>
<h3>Binary Search on Answer Space 💡</h3>
<p>✅ Searching answer range instead of array
✅ Minimize maximum / maximize minimum patterns
✅ <strong>Capacity problems</strong> (ship packages, split array)
✅ <strong>Rate problems</strong> (eating bananas)
✅ Feasibility function + binary search</p>
<h3>Sorting Algorithms 📊</h3>
<p>✅ <strong>Merge Sort:</strong> Divide-and-conquer, O(n log n) always, O(n) space, stable
✅ <strong>Quick Sort:</strong> Partition, O(n log n) average, O(1) space, unstable
✅ Pivot selection and optimization
✅ Understanding tradeoffs</p>
<hr>
<h2>Pattern Recognition Guide</h2>
<p><strong>&quot;Find in sorted array&quot;?</strong> → Binary search O(log n)</p>
<p><strong>&quot;Find insert position&quot;?</strong> → Binary search, return left</p>
<p><strong>&quot;Find first/last occurrence&quot;?</strong> → Modified binary search</p>
<p><strong>&quot;Rotated sorted&quot;?</strong> → Check which half is sorted</p>
<p><strong>&quot;Minimize maximum&quot; or &quot;maximize minimum&quot;?</strong> → Binary search on answer space</p>
<p><strong>&quot;Can you check feasibility in O(n)?&quot;</strong> → Binary search on answer</p>
<p><strong>&quot;Need sorting with predictable time?&quot;</strong> → Merge sort</p>
<p><strong>&quot;Need in-place sorting?&quot;</strong> → Quick sort</p>
<hr>
<h2>Complexity Cheat Sheet</h2>
<table>
<thead>
<tr>
<th>Operation</th>
<th>Time</th>
<th>Space</th>
</tr>
</thead>
<tbody><tr>
<td>Binary search</td>
<td>O(log n)</td>
<td>O(1)</td>
</tr>
<tr>
<td>Binary search on answer</td>
<td>O(n log W)</td>
<td>O(1)</td>
</tr>
<tr>
<td>Merge sort</td>
<td>O(n log n)</td>
<td>O(n)</td>
</tr>
<tr>
<td>Quick sort (avg)</td>
<td>O(n log n)</td>
<td>O(log n)</td>
</tr>
<tr>
<td>Quick sort (worst)</td>
<td>O(n²)</td>
<td>O(log n)</td>
</tr>
</tbody></table>
<p>W = width of answer range</p>
<hr>
<h2>Classic Problems</h2>
<h3>Binary Search:</h3>
<ul>
<li>Binary search (standard)</li>
<li>Search insert position</li>
<li>First/last position in sorted array</li>
<li>Search in rotated sorted array</li>
<li>Find peak element</li>
<li>Sqrt(x)</li>
</ul>
<h3>Answer Space:</h3>
<ul>
<li>Koko eating bananas</li>
<li>Capacity to ship packages</li>
<li>Split array largest sum</li>
<li>Minimize max distance to gas station</li>
<li>Aggressive cows</li>
</ul>
<h3>Sorting:</h3>
<ul>
<li>Merge sort implementation</li>
<li>Quick sort implementation</li>
<li>Kth largest element (use quick select)</li>
<li>Sort colors (Dutch national flag)</li>
</ul>
<hr>
<h2>Key Insights</h2>
<ol>
<li><p><strong>Binary search works when you can eliminate half the search space</strong></p>
</li>
<li><p><strong>&quot;Minimize maximum&quot; ≈ &quot;What&#39;s the smallest value of X such that it&#39;s feasible?&quot;</strong></p>
</li>
<li><p><strong>Always check one half is sorted in rotated array problems</strong></p>
</li>
<li><p><strong>Merge sort = reliable, quick sort = fast but risky</strong></p>
</li>
<li><p><strong>Binary search on answer: define feasibility, then search answer range</strong></p>
</li>
</ol>
<hr>
<h2>Next Steps</h2>
<p><strong>Module 8: Graphs &amp; BFS/DFS</strong> - Master graph representations and traversal algorithms!</p>
<p>You&#39;ll learn:</p>
<ul>
<li>Graph representations (adjacency list, matrix)</li>
<li>BFS and DFS on graphs</li>
<li>Topological sort</li>
<li>Shortest path algorithms</li>
</ul>
<p><strong>Ready to continue?</strong> Let&#39;s go! 🚀</p>
`,
                        estimatedReadTime: 240,
                        autoMarkComplete: false,
                },

        
        ...module7BinarySearchLessonSmartPracticeExercises,
        ],
};
