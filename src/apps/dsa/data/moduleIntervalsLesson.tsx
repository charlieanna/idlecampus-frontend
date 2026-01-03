import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { moduleIntervalsLessonSmartPracticeExercises } from './exercises/moduleIntervalsLessonSmartPracticeExercises';

export const moduleIntervalsLesson: ProgressiveLesson = {
  id: 'intervals-mastery',
  title: 'Module: Intervals',
  description: 'Master interval problems with patterns for merging, inserting, sweep line, and greedy selection',
  unlockMode: 'sequential',
  sections: [
    {
      type: 'reading',
      id: 'intervals-intro',
      title: 'Introduction: When to Think "Intervals"',
      content: `<h1>Intervals: A Family of Problems</h1>
<p>An <strong>interval</strong> is simply a range with a start and end point: <code>[start, end]</code>.</p>
<p>You'll encounter interval problems whenever you see:</p>
<ul>
<li>Meeting schedules and room booking</li>
<li>Calendar conflicts and availability</li>
<li>Time ranges that may overlap</li>
<li>Resource allocation over time</li>
<li>Merging or splitting ranges</li>
</ul>
<h2>The Core Question</h2>
<p>Most interval problems boil down to:</p>
<blockquote>
<p><strong>How do these ranges relate to each other?</strong></p>
</blockquote>
<p>Do they overlap? Are they adjacent? Can they be merged? How many are active at any point?</p>
<hr>
<h2>The Universal First Step: Sort!</h2>
<p>Almost every interval problem becomes easier after sorting. Without sorting, you'd need to compare every interval with every other interval (O(n²)).</p>
<p>After sorting by start time:</p>
<ul>
<li>Adjacent intervals in the sorted list might overlap</li>
<li>Non-adjacent intervals definitely don't overlap (if A ends before B starts, and B comes before C, then A definitely ends before C starts)</li>
</ul>
<pre><code>Before: [[1,3], [8,10], [2,6], [15,18]]
After:  [[1,3], [2,6], [8,10], [15,18]]
         ↑       ↑
         These might overlap (check them)
                  ↑      ↑
                  These definitely don't (3 < 8)
</code></pre>
<p><strong>Sorting reduces the problem from "check all pairs" to "check adjacent pairs".</strong></p>
<hr>
<h2>The Four Interval Patterns</h2>
<p>In this module, you'll learn four fundamental patterns:</p>
<ol>
<li><strong>Merge Overlapping</strong> – Combine intervals that overlap into one</li>
<li><strong>Insert Interval</strong> – Add a new interval, merging as needed</li>
<li><strong>Sweep Line</strong> – Track active intervals over time (e.g., meeting rooms)</li>
<li><strong>Interval Selection</strong> – Greedy selection for maximum non-overlapping set</li>
</ol>
<p>Each pattern builds on the same foundation: <strong>understanding when intervals overlap</strong>.</p>
`,
    },
    {
      type: 'reading',
      id: 'overlap-detection',
      title: 'Core Concept: Detecting Overlap',
      content: `<h1>When Do Two Intervals Overlap?</h1>
<p>This is the foundation of all interval problems. Let's derive it from first principles.</p>
<h2>Two Intervals: A and B</h2>
<pre><code>A: [a_start, a_end]
B: [b_start, b_end]
</code></pre>
<h3>When Do They NOT Overlap?</h3>
<p>It's easier to think about when they <strong>don't</strong> overlap:</p>
<pre><code>Case 1: A ends before B starts
[----A----]
              [----B----]
a_end < b_start

Case 2: B ends before A starts
              [----A----]
[----B----]
b_end < a_start
</code></pre>
<p>No overlap when: <code>a_end < b_start</code> OR <code>b_end < a_start</code></p>
<h3>When DO They Overlap?</h3>
<p>They overlap when the "no overlap" condition is false:</p>
<pre><code>NOT (a_end < b_start OR b_end < a_start)
= (a_end >= b_start) AND (b_end >= a_start)
</code></pre>
<p>Or more simply, if the intervals are sorted by start:</p>
<pre><code>If a_start <= b_start:
    Overlap if b_start <= a_end
</code></pre>
<p>In words: <strong>B's start is at or before A's end</strong>.</p>
<hr>
<h2>The Three Overlap Cases</h2>
<p>When intervals DO overlap, there are three configurations:</p>
<pre><code>Case 1: Partial overlap
[----A----]
      [----B----]

Case 2: B inside A (containment)
[--------A--------]
    [--B--]

Case 3: A inside B (containment)
    [--A--]
[--------B--------]
</code></pre>
<p>When merging, the result is always:</p>
<pre><code>merged_start = min(a_start, b_start)
merged_end = max(a_end, b_end)
</code></pre>
<p>This formula works for all three cases!</p>
<hr>
<h2>Edge Case: Touching Intervals</h2>
<p>What about intervals that touch exactly?</p>
<pre><code>[1, 4] and [4, 5]
</code></pre>
<p>Are they overlapping? <strong>It depends on the problem!</strong></p>
<ul>
<li>Merge Intervals: Usually yes, merge to [1, 5]</li>
<li>Meeting Rooms: Usually no, same room can be reused</li>
</ul>
<p>Pay attention to the problem statement for <code><=</code> vs <code><</code>.</p>
<hr>
<h2>Quick Reference</h2>
<table>
<thead>
<tr><th>Condition</th><th>Meaning</th></tr>
</thead>
<tbody>
<tr><td><code>b_start > a_end</code></td><td>No overlap (B is after A)</td></tr>
<tr><td><code>b_start <= a_end</code></td><td>Overlap exists</td></tr>
<tr><td><code>b_end <= a_end</code></td><td>B is contained in A</td></tr>
</tbody>
</table>
<p>With this foundation, you're ready to tackle the patterns!</p>
`,

    },
    {
      type: 'reading',
      id: 'pattern-merge-intervals',
      title: 'Pattern 1: Merge Overlapping Intervals',
      content: `<h1>Pattern: Merge Overlapping Intervals</h1>
<p>Given a list of intervals, combine all overlapping ones into a minimal set of non-overlapping intervals.</p>
<h2>The Algorithm</h2>
<pre><code class="language-python">def merge(intervals):
    if not intervals:
        return []
    
    # Step 1: Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    # Step 2: Initialize result with first interval
    merged = [intervals[0]]
    
    # Step 3: Process each interval
    for current in intervals[1:]:
        previous = merged[-1]
        
        if current[0] <= previous[1]:  # Overlap?
            # Merge: extend the end
            previous[1] = max(previous[1], current[1])
        else:
            # No overlap: add as new interval
            merged.append(current)
    
    return merged
</code></pre>
<hr>
<h2>Why This Works</h2>
<p>After sorting by start time:</p>
<ul>
<li>Each new interval either overlaps with the last merged interval OR starts after it</li>
<li>If it overlaps, we extend the end (using max to handle containment)</li>
<li>If it doesn't, we add it as a new separate interval</li>
</ul>
<h3>Walkthrough: [[1,3],[2,6],[8,10],[15,18]]</h3>
<pre><code>Already sorted by start.

merged = [[1,3]]

[2,6]: 2 <= 3? Yes, overlap!
       merged[-1][1] = max(3, 6) = 6
       merged = [[1,6]]

[8,10]: 8 <= 6? No, no overlap
        merged.append([8,10])
        merged = [[1,6],[8,10]]

[15,18]: 15 <= 10? No, no overlap
         merged.append([15,18])
         merged = [[1,6],[8,10],[15,18]]
</code></pre>
<hr>
<h2>Complexity</h2>
<ul>
<li><strong>Time:</strong> O(n log n) for sorting + O(n) for merge pass = O(n log n)</li>
<li><strong>Space:</strong> O(n) for the output (O(1) extra if we don't count output)</li>
</ul>
<h2>When to Use</h2>
<ul>
<li>Consolidating overlapping time ranges</li>
<li>Simplifying a list of intervals</li>
<li>Any problem asking for "non-overlapping" result</li>
</ul>
`,

    },
    ...moduleIntervalsLessonSmartPracticeExercises.slice(0, 1),
    {
      type: 'reading',
      id: 'pattern-insert-interval',
      title: 'Pattern 2: Insert Interval',
      content: `<h1>Pattern: Insert Interval</h1>
<p>Given a <strong>sorted</strong> list of non-overlapping intervals, insert a new interval, merging if necessary.</p>
<h2>The Key Insight</h2>
<p>Since intervals are already sorted, we don't need to re-sort. We can process in three phases:</p>
<ol>
<li><strong>Before:</strong> All intervals that end before new interval starts → add directly</li>
<li><strong>Overlap:</strong> All intervals that overlap with new interval → merge into one</li>
<li><strong>After:</strong> All intervals that start after new interval ends → add directly</li>
</ol>
<pre><code>intervals: [[1,2], [3,5], [6,7], [8,10], [12,16]]
newInterval: [4,8]

Phase 1 (before 4): [[1,2]]
Phase 2 (overlaps): [3,5],[6,7],[8,10] merge with [4,8] → [3,10]
Phase 3 (after 8): [[12,16]]

Result: [[1,2], [3,10], [12,16]]
</code></pre>
<hr>
<h2>The Algorithm</h2>
<pre><code class="language-python">def insert(intervals, newInterval):
    result = []
    i = 0
    n = len(intervals)
    
    # Phase 1: Add all intervals before newInterval
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    
    # Phase 2: Merge all overlapping intervals
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    result.append(newInterval)
    
    # Phase 3: Add all intervals after
    while i < n:
        result.append(intervals[i])
        i += 1
    
    return result
</code></pre>
<hr>
<h2>Why Three While Loops?</h2>
<p>Each phase has a different condition:</p>
<ul>
<li><strong>Phase 1:</strong> <code>interval_end < newInterval_start</code> (completely before)</li>
<li><strong>Phase 2:</strong> <code>interval_start <= newInterval_end</code> (overlapping)</li>
<li><strong>Phase 3:</strong> Everything remaining (completely after)</li>
</ul>
<h2>Complexity</h2>
<ul>
<li><strong>Time:</strong> O(n) – single pass (no sorting needed!)</li>
<li><strong>Space:</strong> O(n) for the output</li>
</ul>
<p>This is better than the naive "add + sort + merge" approach which is O(n log n).</p>
`,

    },
    ...moduleIntervalsLessonSmartPracticeExercises.slice(1, 2),
    {
      type: 'reading',
      id: 'pattern-sweep-line',
      title: 'Pattern 3: Sweep Line (Meeting Rooms)',
      content: `<h1>Pattern: Sweep Line</h1>
<p>The sweep line pattern answers questions like:</p>
<ul>
<li>How many intervals are active at any point in time?</li>
<li>What's the maximum number of overlapping intervals?</li>
<li>How many resources are needed to handle all intervals?</li>
</ul>
<h2>The Core Idea</h2>
<p>Instead of thinking about intervals, think about <strong>events</strong>:</p>
<ul>
<li>Each interval start is a <code>+1</code> event (one more active)</li>
<li>Each interval end is a <code>-1</code> event (one less active)</li>
</ul>
<p>Sort all events by time, then "sweep" through them tracking the count.</p>
<pre><code>Intervals: [[0,30], [5,10], [15,20]]

Events:
  time=0:  +1 (meeting starts)
  time=5:  +1 (meeting starts)
  time=10: -1 (meeting ends)
  time=15: +1 (meeting starts)
  time=20: -1 (meeting ends)
  time=30: -1 (meeting ends)

Sweep:
  0:  active=1
  5:  active=2  ← peak!
  10: active=1
  15: active=2  ← peak!
  20: active=1
  30: active=0

Maximum active = 2 → need 2 meeting rooms
</code></pre>
<hr>
<h2>The Algorithm</h2>
<pre><code class="language-python">def minMeetingRooms(intervals):
    events = []
    
    for start, end in intervals:
        events.append((start, 1))   # +1 room needed
        events.append((end, -1))    # -1 room freed
    
    # Sort by time. If same time, process ends before starts
    events.sort(key=lambda x: (x[0], x[1]))
    
    active = 0
    max_rooms = 0
    
    for time, delta in events:
        active += delta
        max_rooms = max(max_rooms, active)
    
    return max_rooms
</code></pre>
<hr>
<h2>Why End Before Start at Same Time?</h2>
<p>If meeting A ends at 10 and meeting B starts at 10:</p>
<ul>
<li>Processing <code>(10, -1)</code> before <code>(10, +1)</code> means the room is freed before the new meeting starts</li>
<li>This correctly handles "back-to-back" meetings sharing a room</li>
</ul>
<p>In the sort key <code>(time, delta)</code>: since -1 < +1, ends come before starts at the same time.</p>
<hr>
<h2>Complexity</h2>
<ul>
<li><strong>Time:</strong> O(n log n) for sorting + O(n) for sweep = O(n log n)</li>
<li><strong>Space:</strong> O(n) for the events list</li>
</ul>
<h2>When to Use Sweep Line</h2>
<ul>
<li>Finding maximum concurrent/overlapping intervals</li>
<li>Resource scheduling problems</li>
<li>Any "how many active at once" question</li>
</ul>
`,

    },
    ...moduleIntervalsLessonSmartPracticeExercises.slice(2, 3),
    {
      type: 'reading',
      id: 'pattern-interval-selection',
      title: 'Pattern 4: Interval Selection (Greedy)',
      content: `<h1>Pattern: Interval Selection (Activity Selection)</h1>
<p>Given intervals, select the <strong>maximum number</strong> of non-overlapping intervals.</p>
<p>Equivalently: find the <strong>minimum number</strong> of intervals to remove to make the rest non-overlapping.</p>
<h2>The Greedy Insight</h2>
<p><strong>Sort by END time, not start time.</strong></p>
<p>Why? If you always pick the interval that ends earliest, you leave the maximum room for future intervals.</p>
<pre><code>Intervals: [1,10], [2,3], [3,5]

Sorted by end: [2,3], [3,5], [1,10]

Greedy picks:
  [2,3]: end=3, keep it
  [3,5]: start=3 >= end=3, keep it, end=5
  [1,10]: start=1 < end=5, skip it

Result: 2 intervals kept, 1 removed
</code></pre>
<hr>
<h2>The Algorithm</h2>
<pre><code class="language-python">def eraseOverlapIntervals(intervals):
    if not intervals:
        return 0
    
    # Sort by END time (the greedy choice!)
    intervals.sort(key=lambda x: x[1])
    
    count = 0        # Intervals to remove
    end = float('-inf')
    
    for start, curr_end in intervals:
        if start >= end:
            # No overlap: keep this interval
            end = curr_end
        else:
            # Overlap: remove this one
            count += 1
    
    return count
</code></pre>
<hr>
<h2>Why Sort by End, Not Start?</h2>
<p>Consider: [[1,10], [2,3], [3,5]]</p>
<p><strong>If sorted by start:</strong></p>
<ul>
<li>Pick [1,10] first (ends late)</li>
<li>Both [2,3] and [3,5] overlap with it</li>
<li>Can only keep 1 interval</li>
</ul>
<p><strong>If sorted by end:</strong></p>
<ul>
<li>Pick [2,3] first (ends earliest)</li>
<li>[3,5] doesn't overlap (3 >= 3)</li>
<li>[1,10] does overlap (1 < 5)</li>
<li>Keep 2 intervals!</li>
</ul>
<p>Ending early = more room for future intervals.</p>
<hr>
<h2>Complexity</h2>
<ul>
<li><strong>Time:</strong> O(n log n) for sorting + O(n) for selection</li>
<li><strong>Space:</strong> O(1) if sorting in place</li>
</ul>
<h2>When to Use</h2>
<ul>
<li>Activity/task scheduling problems</li>
<li>"Maximum non-overlapping" questions</li>
<li>"Minimum to remove" questions</li>
</ul>
`,

    },
    ...moduleIntervalsLessonSmartPracticeExercises.slice(3, 4),
    {
      type: 'reading',
      id: 'intervals-summary',
      title: 'Summary: The Intervals Toolkit',
      content: `<h1>Intervals: Summary</h1>
<h2>The Four Patterns</h2>
<table>
<thead>
<tr><th>Pattern</th><th>Sort By</th><th>Time</th><th>Use Case</th></tr>
</thead>
<tbody>
<tr><td>Merge Overlapping</td><td>Start</td><td>O(n log n)</td><td>Consolidate ranges</td></tr>
<tr><td>Insert Interval</td><td>Already sorted</td><td>O(n)</td><td>Add to sorted list</td></tr>
<tr><td>Sweep Line</td><td>Event time</td><td>O(n log n)</td><td>Max concurrent</td></tr>
<tr><td>Interval Selection</td><td>End</td><td>O(n log n)</td><td>Max non-overlapping</td></tr>
</tbody>
</table>
<hr>
<h2>Pattern Recognition</h2>
<p><strong>Think "intervals" when you see:</strong></p>
<ul>
<li>Ranges with start and end points</li>
<li>Scheduling or time-based problems</li>
<li>"Overlapping" or "merging" in problem statement</li>
<li>Need to track active/concurrent items</li>
<li>"How many at once" questions</li>
</ul>
<hr>
<h2>The Universal First Step</h2>
<blockquote>
<p><strong>Almost always: SORT FIRST!</strong></p>
</blockquote>
<p>But sort by what?</p>
<ul>
<li><strong>Merge/Insert:</strong> Sort by start time</li>
<li><strong>Selection (greedy):</strong> Sort by end time</li>
<li><strong>Sweep line:</strong> Sort by event time</li>
</ul>
<hr>
<h2>Quick Overlap Formula</h2>
<p>For sorted intervals (by start):</p>
<pre><code>Two intervals overlap if: current_start <= previous_end
</code></pre>
<p>When merging:</p>
<pre><code>merged_end = max(previous_end, current_end)
</code></pre>
<hr>
<h2>Practice Recommendations</h2>
<p>Master these problems in order:</p>
<ol>
<li>Merge Intervals (LeetCode 56) – foundation</li>
<li>Insert Interval (LeetCode 57) – builds on merge</li>
<li>Meeting Rooms II (LeetCode 253) – sweep line</li>
<li>Non-overlapping Intervals (LeetCode 435) – greedy</li>
</ol>
<p>Then try:</p>
<ul>
<li>Interval List Intersections (LeetCode 986)</li>
<li>Employee Free Time (LeetCode 759)</li>
<li>My Calendar I/II/III (LeetCode 729/731/732)</li>
</ul>
`,

    }
  ],
};
