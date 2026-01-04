import { ProgressiveLesson, LessonSection } from '../types/progressive-lesson-enhanced';
import { Module1Intro } from '../components/core/lessons/Module1Intro';
import { module1ArrayIterationLessonSmartPracticeExercises } from './exercises/moduleArrayIterationLessonSmartPracticeExercises';

export const module1ArrayIterationLesson: ProgressiveLesson = {
  id: 'array-iteration-techniques',
        title: 'Module: Array Iteration Techniques',
        description: 'Learn to optimize array problems by identifying and removing bottlenecks',
        unlockMode: 'sequential',
        sections: [
                // SECTION 1: Introduction (placeholder removed)

                // SECTION 2: Test-Case-First Methodology
                {
                        type: 'reading',
                        id: 'think-before-code',
                        title: 'Think Before You Code: The Test-Case-First Mindset',
                        estimatedReadTime: 360,
                        content: `<h1>Think Before You Code: The Test-Case-First Mindset 🎯</h1>

<p>Before we write our first line of code, let's learn a crucial skill that separates junior developers from seniors: <strong>Finding edge cases BEFORE coding.</strong></p>

<hr />

<h2>The Google/Uber Interview Reality</h2>

<p>At top tech companies, interviewers care MORE about whether you can systematically find edge cases than whether you can code quickly.</p>

<p><strong>Real interview scenario:</strong></p>
<ul>
  <li>Interviewer: "Find the maximum element in an array"</li>
  <li>You: <em>starts coding immediately</em></li>
  <li>Interviewer: "Hold on! Before you code, what test cases would you check?"</li>
  <li>You: "Uh..."</li>
  <li>Result: ❌ Negative signal</li>
</ul>

<p><strong>What they want to see:</strong></p>
<ul>
  <li>You: "Let me think about test cases first..."</li>
  <li>You: "Empty array, single element, all negatives, duplicates..."</li>
  <li>Interviewer: <em>nods approvingly</em> "Good thinking! What else?"</li>
  <li>Result: ✅ Positive signal</li>
</ul>

<hr />

<h2>Common Test Cases to Consider</h2>

<p>Systematically think through these categories when generating test cases:</p>

<h3>Boundaries</h3>
<ul>
  <li>Minimum/maximum values allowed</li>
  <li>First and last positions</li>
  <li>Off-by-one scenarios</li>
</ul>

<h3>Empty Cases</h3>
<ul>
  <li>Empty array: <code>[]</code></li>
  <li>Empty string: <code>""</code></li>
  <li>Zero/null values</li>
</ul>

<h3>Duplicates</h3>
<ul>
  <li>All elements the same: <code>[5, 5, 5, 5]</code></li>
  <li>Some duplicates: <code>[1, 2, 2, 3]</code></li>
  <li>Consecutive duplicates vs. scattered</li>
</ul>

<h3>Type Variations</h3>
<ul>
  <li>Negative numbers: <code>[-5, -2, -10]</code></li>
  <li>Zero values: <code>[0, 1, 0, 2]</code></li>
  <li>Mixed positive/negative</li>
</ul>

<h3>Invalid Inputs</h3>
<ul>
  <li>Out of bounds indices</li>
  <li>Null/None inputs</li>
  <li>Wrong data types</li>
</ul>

<h3>Maximum Size</h3>
<ul>
  <li>Largest allowed input size (10^5, 10^6)</li>
  <li>Performance edge cases</li>
  <li>Stack overflow risks</li>
</ul>

<h3>Extreme Patterns</h3>
<ul>
  <li>Already sorted: <code>[1, 2, 3, 4]</code></li>
  <li>Reverse sorted: <code>[4, 3, 2, 1]</code></li>
  <li>Alternating pattern: <code>[1, 10, 1, 10]</code></li>
</ul>

<hr />

<h2>Example: Finding Maximum in Array</h2>

<p><strong>Problem:</strong> Find the maximum element in an array.</p>

<p><strong>Before coding, generate test cases:</strong></p>

<pre><code># Common test cases to consider:

# Boundaries
[1]                    # Single element (minimum size)
[1, 2, ..., 10^6]     # Maximum size array

# Empty
[]                     # Empty array - what to return?

# Duplicates
[5, 5, 5, 5]          # All same - any element is max
[1, 3, 3, 2]          # Some duplicates

# Type variations
[-10, -5, -1]         # All negatives
[0, 0, 0]             # All zeros
[-5, 0, 5]            # Mixed

# Invalid
None                   # Null input
"not an array"         # Wrong type

# Maximum size
[1] * 10^6            # Performance test

# Extreme patterns
[1, 2, 3, 4, 5]       # Ascending
[5, 4, 3, 2, 1]       # Descending</code></pre>

<p><strong>Why this matters:</strong></p>
<ul>
  <li>You catch the empty array case BEFORE coding</li>
  <li>You think about negative numbers BEFORE assuming positive</li>
  <li>You consider performance BEFORE creating an O(n²) solution</li>
</ul>

<hr />

<h2>The New Habit We're Building</h2>

<p>From now on, for EVERY exercise:</p>

<ol>
  <li><strong>Read the problem</strong> (30 seconds)</li>
  <li><strong>Generate test cases</strong> systematically (2-3 minutes)</li>
  <li><strong>Design your approach</strong> with edge cases in mind (1-2 minutes)</li>
  <li><strong>Code the solution</strong> (5-10 minutes)</li>
  <li><strong>Verify</strong> against YOUR test cases (1-2 minutes)</li>
</ol>

<p><strong>We'll track your progress:</strong></p>
<ul>
  <li>How many edge cases did you identify?</li>
  <li>Which ones did you miss?</li>
  <li>Are you improving over time?</li>
</ul>

<hr />

<h2>Why Companies Value This</h2>

<p>Test-case-first thinking demonstrates:</p>
<ol>
  <li><strong>Systematic approach</strong> - You have a methodology</li>
  <li><strong>Attention to detail</strong> - You catch bugs before they happen</li>
  <li><strong>Production mindset</strong> - You think about real-world inputs</li>
  <li><strong>Communication</strong> - You explain your thinking process</li>
  <li><strong>Experience</strong> - You've learned from past bugs</li>
</ol>

<hr />

<h2>Building the Habit</h2>

<p>From now on, for EVERY problem you encounter:</p>

<ol>
  <li><strong>Read the problem</strong> (30 seconds)</li>
  <li><strong>Systematically identify edge cases</strong> (2-3 minutes)</li>
  <li><strong>Design your approach</strong> with those cases in mind (1-2 minutes)</li>
  <li><strong>Code the solution</strong> (5-10 minutes)</li>
</ol>

<p>When you submit your code, we'll test it against comprehensive edge cases. If your code fails a test, you'll know exactly which edge case you missed!</p>

<hr />

<h2>Why This Matters</h2>

<p>Test-case-first thinking demonstrates:</p>
<ol>
  <li><strong>Systematic approach</strong> - You have a methodology</li>
  <li><strong>Attention to detail</strong> - You catch bugs before they happen</li>
  <li><strong>Production mindset</strong> - You think about real-world inputs</li>
  <li><strong>Experience</strong> - You've learned from past bugs</li>
</ol>

<p><strong>Companies hire engineers who think about edge cases, not just engineers who can code.</strong></p>

<p>Now let's practice this mindset on your first problem! 🚀</p>`,
                },// OPTIMIZATION STORY: Space Optimization
                {
                        type: 'reading',
                        id: 'optimization-space-palindrome',
                        title: 'How We Optimized: From O(n) Space to O(1) Space',
                        estimatedReadTime: 240,
                        content: `<h1>How We Optimized: From O(n) Space to O(1) Space</h1>

<p>Let's analyze what we just did and why it works.</p>

<hr />

<h2>The Brute Force Approach</h2>

<p><strong>First attempt:</strong> Create a cleaned string, reverse it, compare.</p>

<pre><code>def is_palindrome(s):
    # Clean the string
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    
    # Reverse and compare
    reversed_cleaned = cleaned[::-1]
    return cleaned == reversed_cleaned</code></pre>

<p><strong>Complexity:</strong></p>
<ul>
  <li>Time: O(n) - single pass to clean, single pass to reverse</li>
  <li>Space: O(n) - storing cleaned string and reversed string</li>
</ul>

<hr />

<h2>The Bottleneck</h2>

<p><strong>What's slow?</strong> Creating extra strings takes O(n) space.</p>

<p><strong>Why does it matter?</strong> For large inputs, we're using unnecessary memory.</p>

<hr />

<h2>The Optimization</h2>

<p><strong>Key insight:</strong> We don't need to store the entire cleaned string. We can compare characters directly!</p>

<p><strong>The fix:</strong> Use two indices starting from both ends, moving toward the center.</p>

<pre><code>def is_palindrome(s):
    left, right = 0, len(s) - 1
    
    while left &lt; right:
        # Skip non-alphanumeric from left
        while left &lt; right and not s[left].isalnum():
            left += 1
        
        # Skip non-alphanumeric from right
        while left &lt; right and not s[right].isalnum():
            right -= 1
        
        # Compare
        if s[left].lower() != s[right].lower():
            return False
        
        left += 1
        right -= 1
    
    return True</code></pre>

<p><strong>Complexity:</strong></p>
<ul>
  <li>Time: O(n) - still single pass</li>
  <li>Space: O(1) - only using two index variables!</li>
</ul>

<hr />

<h2>What Changed</h2>

<p><strong>Before:</strong> Created new strings → O(n) space</p>
<p><strong>After:</strong> Compare in-place → O(1) space</p>

<p><strong>The bottleneck:</strong> Extra string storage</p>
<p><strong>The fix:</strong> Compare directly without storing</p>

<hr />

<h2>The General Principle</h2>

<p>When you need to compare elements from both ends:</p>
<ul>
  <li><strong>Bottleneck:</strong> Creating copies or new data structures</li>
  <li><strong>Solution:</strong> Use two indices to traverse from both ends simultaneously</li>
  <li><strong>Result:</strong> Same time, less space</li>
</ul>

<p>This optimization works whenever you can avoid creating intermediate data structures! 🎯</p>`,

                },

                // SECTION 3: Read/Write Pointer Technique
                {
                        type: 'reading',
                        id: 'read-write-pointer-technique',
                        title: 'The Read/Write Pointer Technique',
                        estimatedReadTime: 300,
                        content: `<h1>The Read/Write Pointer Technique</h1>

<p>A different two-pointer pattern. This one solves a whole family of "rearrange in-place" problems.</p>

<hr />

<h2>The Problem Type</h2>

<p>You have an array and need to:</p>
<ul>
  <li>Move certain elements to the front</li>
  <li>Remove or push other elements to the back</li>
  <li>Do it <strong>in-place</strong> (no extra array)</li>
</ul>

<p>Example: Move all zeros to the end of <code>[0, 1, 0, 3, 12]</code> → <code>[1, 3, 12, 0, 0]</code></p>

<hr />

<h2>The Obvious Solution (And Why It's Wasteful)</h2>

<p>Most people's first instinct:</p>

<pre><code>non_zeros = [x for x in nums if x != 0]
zeros = [x for x in nums if x == 0]
return non_zeros + zeros</code></pre>

<p>Works, but uses O(n) extra space. In an interview, they'll ask: <em>"Can you do it in-place?"</em></p>

<hr />

<h2>The Key Insight</h2>

<p>You don't need a new array. You need <strong>two pointers moving in the same direction</strong>:</p>

<table>
  <thead>
    <tr><th>Pointer</th><th>Question it answers</th><th>When it moves</th></tr>
  </thead>
  <tbody>
    <tr><td><code>read</code></td><td>"Which element am I checking?"</td><td>Every iteration</td></tr>
    <tr><td><code>write</code></td><td>"Where does the next keeper go?"</td><td>Only when we find a keeper</td></tr>
  </tbody>
</table>

<p>Because <code>read</code> always moves but <code>write</code> only sometimes moves, a <strong>gap forms between them</strong>. That gap is exactly where the unwanted elements get left behind.</p>

<p><strong>Key invariant:</strong> <code>write ≤ read</code> always. You never write to a position you haven't read yet.</p>

<hr />

<h2>How It Works: Step-by-Step</h2>

<p>Let's trace through <code>[0, 1, 0, 3, 12]</code> with pointer diagrams:</p>

<hr />

<p><strong>Initial State</strong></p>
<pre><code>Index:   0    1    2    3    4
       ┌────┬────┬────┬────┬────┐
Array: │  0 │  1 │  0 │  3 │ 12 │
       └────┴────┴────┴────┴────┘
         ▲
         W,R    (both pointers start at 0)</code></pre>

<hr />

<p><strong>Step 1:</strong> <code>nums[R] = 0</code> → Not a keeper. Skip it. R moves forward.</p>
<pre><code>       ┌────┬────┬────┬────┬────┐
       │  0 │  1 │  0 │  3 │ 12 │
       └────┴────┴────┴────┴────┘
         ▲    ▲
         W    R</code></pre>

<hr />

<p><strong>Step 2:</strong> <code>nums[R] = 1</code> → Keeper! Copy to W position. Both move forward.</p>
<pre><code>       ┌────┬────┬────┬────┬────┐
       │  1 │  1 │  0 │  3 │ 12 │  ← copied 1 to index 0
       └────┴────┴────┴────┴────┘
              ▲    ▲
              W    R</code></pre>

<hr />

<p><strong>Step 3:</strong> <code>nums[R] = 0</code> → Not a keeper. Skip it. R moves forward.</p>
<pre><code>       ┌────┬────┬────┬────┬────┐
       │  1 │  1 │  0 │  3 │ 12 │
       └────┴────┴────┴────┴────┘
              ▲         ▲
              W         R</code></pre>

<hr />

<p><strong>Step 4:</strong> <code>nums[R] = 3</code> → Keeper! Copy to W position. Both move forward.</p>
<pre><code>       ┌────┬────┬────┬────┬────┐
       │  1 │  3 │  0 │  3 │ 12 │  ← copied 3 to index 1
       └────┴────┴────┴────┴────┘
                   ▲         ▲
                   W         R</code></pre>

<hr />

<p><strong>Step 5:</strong> <code>nums[R] = 12</code> → Keeper! Copy to W position. Both move forward.</p>
<pre><code>       ┌────┬────┬────┬────┬────┐
       │  1 │  3 │ 12 │  3 │ 12 │  ← copied 12 to index 2
       └────┴────┴────┴────┴────┘
                        ▲         ▲
                        W         R (done)</code></pre>

<hr />

<p><strong>Final:</strong> W = 3, meaning 3 keepers. Fill rest with zeros.</p>
<pre><code>       ┌────┬────┬────┬────┬────┐
       │  1 │  3 │ 12 │  0 │  0 │  ✓ Done!
       └────┴────┴────┴────┴────┘
        ─────────────── ─────────
           keepers       filled</code></pre>

<p><strong>Key observation:</strong> W is always ≤ R, so we never overwrite unread data.</p>

<hr />

<h2>The Code</h2>

<pre><code>def moveZeroes(nums):
    write = 0

    # Pass 1: Move all keepers to the front
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write] = nums[read]
            write += 1

    # Pass 2: Fill the rest with zeros
    while write &lt; len(nums):
        nums[write] = 0
        write += 1</code></pre>

<p><strong>Time: O(n)</strong> — single pass through the array</p>
<p><strong>Space: O(1)</strong> — just two integer variables</p>

<hr />

<h2>Why It's Safe</h2>

<p>You might wonder: <em>"What if write overwrites something read hasn't seen yet?"</em></p>

<p>It can't happen. Think about it:</p>
<ul>
  <li><code>read</code> moves forward every iteration</li>
  <li><code>write</code> only moves when we find a keeper</li>
  <li>So <code>write ≤ read</code> <strong>always</strong></li>
</ul>

<p>You're only ever writing to positions you've already read past.</p>

<hr />

<h2>The General Pattern</h2>

<pre><code>write = 0
for read in range(len(arr)):
    if should_keep(arr[read]):
        arr[write] = arr[read]
        write += 1
# write now = count of keepers</code></pre>

<p>This pattern applies to many problems:</p>

<table>
  <thead>
    <tr><th>Problem</th><th>Keep if...</th><th>After loop</th></tr>
  </thead>
  <tbody>
    <tr><td>Move Zeroes</td><td><code>!= 0</code></td><td>Fill with zeros</td></tr>
    <tr><td>Remove Element</td><td><code>!= val</code></td><td>Return <code>write</code></td></tr>
    <tr><td>Remove Duplicates</td><td><code>!= previous</code></td><td>Return <code>write</code></td></tr>
  </tbody>
</table>

<p>Same structure, different condition. Master one, you've got them all.</p>`,

                },

                // Exercise: Move Zeroes (first application of Read/Write Pointer)
                ,// SECTION 4: Fixed-Size Sliding Window
                {
                        type: 'reading',
                        id: 'sliding-window-intro',
                        title: 'Pattern 3: Fixed-Size Sliding Window',
                        estimatedReadTime: 60,
                        content: `<h1>Pattern 3: Fixed-Size Sliding Window</h1>

<p>You've mastered the Read/Write Pointer technique. Now let's tackle a different type of problem.</p>

<hr />

<h2>The Setup</h2>

<p>The next problem involves finding something in a <strong>contiguous chunk</strong> of an array (a "subarray" or "window") where the <strong>window size is fixed</strong>.</p>

<p><strong>Key characteristic:</strong> The window always has exactly <code>k</code> elements. We just slide it along the array.</p>

<hr />

<h2>Why This Matters</h2>

<p>This problem type appears <strong>constantly</strong> in interviews:</p>
<ul>
  <li>Amazon, Google, Meta — all love this pattern</li>
  <li>It's one of the most common "optimization" questions</li>
  <li>Fixed-size sliding window is simpler than variable-size (which we'll cover in Module 4)</li>
</ul>

<hr />

<h2>Fixed-Size vs Variable-Size</h2>

<p><strong>Fixed-Size (this module):</strong></p>
<ul>
  <li>Window size is always <code>k</code> elements</li>
  <li>Example: "Find maximum sum of 3 consecutive elements"</li>
  <li>Solution: Slide window and update incrementally</li>
</ul>

<p><strong>Variable-Size (Module 4):</strong></p>
<ul>
  <li>Window size changes based on conditions</li>
  <li>Example: "Find longest substring without repeating characters"</li>
  <li>Solution: Expand/shrink window + requires hashmap</li>
</ul>

<hr />

<h2>Your Goal</h2>

<ol>
  <li><strong>Code the brute force first</strong> — get it working</li>
  <li><strong>Identify the bottleneck</strong> — what work are you repeating?</li>
  <li><strong>Try to optimize</strong> — can you eliminate the repeated work?</li>
</ol>

<p>If you can't figure out the optimal solution, <strong>that's completely fine</strong>. We'll learn this technique in detail right after. The goal here is just to experience the problem first.</p>`,

                },

                // Exercise 4: Maximum Sum Subarray of Size K (Fixed-Size Sliding Window)
                ,// SECTION 5: Three-Pointer Partitioning (Dutch National Flag)
                {
                        type: 'reading',
                        id: 'three-pointer-intro',
                        title: 'The 3-Pointer Partitioning Technique',
                        estimatedReadTime: 300,
                        content: `<h1>The 3-Pointer Partitioning Technique</h1>

<p>So far we've used <strong>2 pointers</strong>. Now we need <strong>3</strong>.</p>

<hr />

<h2>When 2 Pointers Aren't Enough</h2>

<p>With Read/Write pointers, we partitioned into <strong>2 regions</strong>: keepers vs non-keepers.</p>

<p>But what if you need <strong>3 regions</strong>?</p>

<p>Example: Sort an array containing only 0s, 1s, and 2s into <code>[0,0,0,1,1,1,2,2,2]</code></p>

<p>You can't do this with 2 pointers in one pass. You need 3.</p>

<hr />

<h2>The 3-Pointer Setup</h2>

<pre><code>┌─────────────────────────────────────────────┐
│  ?  │  ?  │  ?  │  ?  │  ?  │  ?  │  ?  │
└─────────────────────────────────────────────┘
  ▲                                        ▲
 low                                      high
  mid

Three pointers, three regions:
• Everything BEFORE low    → 0s (processed)
• Everything AFTER high    → 2s (processed)
• Between low and mid      → 1s (processed)
• Between mid and high     → ? (unprocessed)</code></pre>

<hr />

<h2>The Algorithm</h2>

<p><strong><code>mid</code> is our scanner.</strong> It examines each unprocessed element:</p>

<table>
  <thead>
    <tr><th><code>nums[mid]</code></th><th>Action</th></tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>Swap with <code>low</code>, advance both <code>low</code> and <code>mid</code></td></tr>
    <tr><td>1</td><td>Just advance <code>mid</code> (it's already in the right place)</td></tr>
    <tr><td>2</td><td>Swap with <code>high</code>, decrease <code>high</code> (don't advance <code>mid</code>!)</td></tr>
  </tbody>
</table>

<p><strong>Why not advance <code>mid</code> after swapping with <code>high</code>?</strong> Because we don't know what we just swapped in — it needs to be checked!</p>

<hr />

<h2>Visual Walkthrough</h2>

<p>Array: <code>[2, 0, 1, 2, 0]</code></p>

<pre><code>Initial:
┌─────┬─────┬─────┬─────┬─────┐
│  2  │  0  │  1  │  2  │  0  │
└─────┴─────┴─────┴─────┴─────┘
  ▲                        ▲
 L,M                       H

Step 1: nums[M]=2 → swap with H, H--
┌─────┬─────┬─────┬─────┬─────┐
│  0  │  0  │  1  │  2  │  2  │
└─────┴─────┴─────┴─────┴─────┘
  ▲                  ▲
 L,M                 H    (don't advance M!)

Step 2: nums[M]=0 → swap with L, L++, M++
┌─────┬─────┬─────┬─────┬─────┐
│  0  │  0  │  1  │  2  │  2  │
└─────┴─────┴─────┴─────┴─────┘
        ▲         ▲
        L,M       H

Step 3: nums[M]=0 → swap with L, L++, M++
┌─────┬─────┬─────┬─────┬─────┐
│  0  │  0  │  1  │  2  │  2  │
└─────┴─────┴─────┴─────┴─────┘
              ▲    ▲
              L,M  H

Step 4: nums[M]=1 → just M++
┌─────┬─────┬─────┬─────┬─────┐
│  0  │  0  │  1  │  2  │  2  │
└─────┴─────┴─────┴─────┴─────┘
              ▲    ▲
              L    M,H

Step 5: nums[M]=2 → swap with H, H--
┌─────┬─────┬─────┬─────┬─────┐
│  0  │  0  │  1  │  2  │  2  │
└─────┴─────┴─────┴─────┴─────┘
              ▲  ▲
              L  H  M   (M > H, done!)</code></pre>

<p><strong>Result:</strong> <code>[0, 0, 1, 2, 2]</code> ✓</p>

<hr />

<h2>Why This Matters</h2>

<p>This technique is called the <strong>Dutch National Flag</strong> algorithm (named by Dijkstra).</p>

<p>It's the foundation for:</p>
<ul>
  <li><strong>QuickSort's partition step</strong> (3-way partition handles duplicates efficiently)</li>
  <li>Any problem requiring <strong>3-way classification</strong> in O(n) time</li>
</ul>

<hr />

<h2>The Pattern</h2>

<pre><code>low, mid, high = 0, 0, len(arr) - 1

while mid &lt;= high:
    if arr[mid] == SMALL:
        swap(arr, low, mid)
        low += 1
        mid += 1
    elif arr[mid] == MEDIUM:
        mid += 1
    else:  # LARGE
        swap(arr, mid, high)
        high -= 1</code></pre>

<p>Now try it yourself!</p>`,

                },

                // Exercise 6: Sort Colors
                ,// SECTION: Interval Problems
                {
                        type: 'reading',
                        id: 'intervals-intro',
                        title: 'Interval Problems: A New Pattern',
                        content: `<h1>Interval Problems: Sorting Changes Everything</h1>

<h2>A Different Kind of Array Problem</h2>

<p>So far, we've dealt with arrays of single values. Now let's tackle <strong>intervals</strong> – pairs of numbers representing ranges like [start, end].</p>

<pre><code>meetings = [[1, 3], [2, 6], [8, 10], [15, 18]]

Timeline:
1---3
  2------6
           8--10
                    15--18</code></pre>

<p>Common questions:</p>
<ul>
  <li>Can we <strong>merge</strong> overlapping intervals?</li>
  <li>Can we <strong>insert</strong> a new interval into a sorted list?</li>
  <li>Do any intervals <strong>conflict</strong> (overlap)?</li>
</ul>

<hr />

<h2>The Key Insight: Sort First</h2>

<p>Most interval problems become straightforward once you <strong>sort by start time</strong>.</p>

<p>Before sorting:</p>
<pre><code>[[1,3], [8,10], [2,6], [15,18]]
Messy – intervals are scattered!</code></pre>

<p>After sorting by start:</p>
<pre><code>[[1,3], [2,6], [8,10], [15,18]]
Now adjacent intervals might overlap!</code></pre>

<p>Once sorted, you only need to check if the <strong>current interval overlaps with the previous one</strong>. No nested loops required!</p>

<hr />

<h2>Detecting Overlap</h2>

<p>Two intervals [a, b] and [c, d] overlap if and only if:</p>
<pre><code>a &lt;= d AND c &lt;= b</code></pre>

<p>Visually:</p>
<pre><code>   [a-------b]
       [c-------d]    ← Overlap! (a &lt;= d and c &lt;= b)

   [a-------b]
               [c---d]  ← No overlap (b &lt; c)</code></pre>

<p>For sorted intervals (where we know c >= a), this simplifies to:</p>
<pre><code>Overlap if: previous_end >= current_start</code></pre>

<hr />

<h2>The Pattern</h2>

<p>For most interval problems:</p>
<ol>
  <li><strong>Sort</strong> by start time (or end time, depending on the problem)</li>
  <li><strong>Iterate</strong> through, comparing each interval to the previous</li>
  <li><strong>Merge or track</strong> based on overlap condition</li>
</ol>

<p>Let's see this in action with Merge Intervals!</p>`,
                },// SECTION 5: Module Summary
                {
                        type: 'reading',
                        id: 'module1-summary',
                        title: 'Module Complete!',
                        content: `<h1>🎉 Module 1 Complete!</h1>

<h2>The Optimization Process You Mastered</h2>

<p>You've learned the core skill: <strong>identify bottlenecks and remove them</strong>.</p>

<hr />

<h2>Optimization Stories</h2>

<h3>1. Space Optimization</h3>
<p><strong>Problem:</strong> Creating extra data structures</p>
<p><strong>Bottleneck:</strong> O(n) space for storing cleaned/reversed strings</p>
<p><strong>Solution:</strong> Compare directly using two indices from both ends</p>
<p><strong>Result:</strong> O(n) space → O(1) space</p>

<p><strong>Applied to:</strong></p>
<ul>
  <li>Valid palindrome</li>
  <li>Container with most water</li>
  <li>Two sum in sorted array</li>
</ul>

<h3>2. In-Place Modification</h3>
<p><strong>Problem:</strong> Creating new arrays</p>
<p><strong>Bottleneck:</strong> O(n) space for new array storage</p>
<p><strong>Solution:</strong> Use separate read and write indices to modify in-place</p>
<p><strong>Result:</strong> O(n) space → O(1) space</p>

<p><strong>Applied to:</strong></p>
<ul>
  <li>Move zeroes</li>
  <li>Remove duplicates</li>
  <li>Partition arrays</li>
</ul>

<h3>3. Removing Redundant Calculations</h3>
<p><strong>Problem:</strong> Recalculating overlapping work</p>
<p><strong>Bottleneck:</strong> O(n × k) time from recalculating sums</p>
<p><strong>Solution:</strong> Maintain running state and update incrementally</p>
<p><strong>Result:</strong> O(n × k) → O(n) time</p>

<p><strong>Applied to:</strong></p>
<ul>
  <li>Maximum sum of k elements (fixed-size window)</li>
  <li>Finding subarrays with specific properties (fixed-size window)</li>
</ul>

<p><strong>Note:</strong> Variable-size sliding window problems (like longest substring without repeating characters) require hashmap/set for optimal solutions and are covered in Module 4: Array + Hash Map.</p>

<hr />

<h2>The Process</h2>

<p>For every problem:</p>
<ol>
  <li><strong>Start with brute force</strong> - Get it working first</li>
  <li><strong>Identify the bottleneck</strong> - What's slow? What uses extra space?</li>
  <li><strong>Remove the bottleneck</strong> - How can we avoid the expensive operation?</li>
  <li><strong>Verify the optimization</strong> - Check time and space complexity improved</li>
</ol>

<hr />

<h2>Performance Improvements</h2>

<table>
  <thead>
    <tr><th>Problem Type</th><th>Brute Force</th><th>Optimized</th><th>Bottleneck Removed</th></tr>
  </thead>
  <tbody>
    <tr><td>Palindrome check</td><td>O(n) space</td><td>O(1) space</td><td>Extra string storage</td></tr>
    <tr><td>Move zeroes</td><td>O(n) space</td><td>O(1) space</td><td>New array creation</td></tr>
    <tr><td>Max sum k elements</td><td>O(n×k) time</td><td>O(n) time</td><td>Redundant sum calculations</td></tr>
    <tr><td>Find pair in sorted</td><td>O(n²) time</td><td>O(n) time</td><td>Nested loops</td></tr>
  </tbody>
</table>

<hr />

<h2>Next Steps</h2>

<p><strong>Module 2: Hash Maps</strong> - Learn to remove nested loops using hash maps!</p>

<p>You'll discover:</p>
<ul>
  <li>How to eliminate inner loops with O(1) lookups</li>
  <li>How to avoid repeated counting with frequency maps</li>
  <li>How to optimize from O(n²) to O(n) by removing bottlenecks</li>
</ul>

<p><strong>Ready to continue?</strong> Let's go! 🚀</p>`,
                },
        
        ...module1ArrayIterationLessonSmartPracticeExercises,
        ].filter(Boolean) as LessonSection[],
};
