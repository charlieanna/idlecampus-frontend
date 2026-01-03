import { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const moduleIntervalsLessonSmartPracticeExercises: ExerciseSection[] = [
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-merge-intervals',
    title: 'Code: Merge Intervals',
    description: 'Merge all overlapping intervals using sort + single pass.',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)', notes: 'Sorting dominates; output array for merged intervals' },
    instruction: `# Merge Intervals (LeetCode 56)

Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

## Examples

**Example 1:**
- Input: \`intervals = [[1,3],[2,6],[8,10],[15,18]]\`
- Output: \`[[1,6],[8,10],[15,18]]\`
- Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].

**Example 2:**
- Input: \`intervals = [[1,4],[4,5]]\`
- Output: \`[[1,5]]\`
- Explanation: Intervals [1,4] and [4,5] are considered overlapping (they touch at 4).

## Constraints
- \`1 <= intervals.length <= 10^4\`
- \`intervals[i].length == 2\`
- \`0 <= start_i <= end_i <= 10^4\``,
    starterCode: `def merge(intervals):
    # Sort first, then merge overlapping intervals
    pass`,
    expectedOutput: `def merge(intervals):
    if not intervals:
        return []
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        previous = merged[-1]
        
        # Check if current overlaps with previous
        if current[0] <= previous[1]:
            # Merge: extend the end of previous
            previous[1] = max(previous[1], current[1])
        else:
            # No overlap: add current as new interval
            merged.append(current)
    
    return merged`,
    hints: [
      { afterAttempt: 1, text: 'Sort intervals by start time first. This ensures you only need to check adjacent intervals for overlap.' },
      { afterAttempt: 2, text: 'Two intervals overlap if current_start <= previous_end. When they overlap, merge by extending previous_end to max(previous_end, current_end).' },
      { afterAttempt: 3, text: 'Keep a result list. For each interval, either merge with the last result or append as new.' }
    ],
    solution: {
      afterAttempt: 4,
      text: `## Solution - O(n log n) time, O(n) space

\`\`\`python
def merge(intervals):
    if not intervals:
        return []
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        previous = merged[-1]
        
        if current[0] <= previous[1]:
            # Overlap: extend end
            previous[1] = max(previous[1], current[1])
        else:
            # No overlap: new interval
            merged.append(current)
    
    return merged
\`\`\`

**Key insight:** Sorting by start time means you only compare each interval with the previous one.`
    },
    testCases: [
      { input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
      { input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]' },
      { input: '[[1,4],[0,4]]', expectedOutput: '[[0,4]]' },
      { input: '[[1,4],[2,3]]', expectedOutput: '[[1,4]]' },
      { input: '[[1,4]]', expectedOutput: '[[1,4]]' },
      { input: '[[1,4],[5,6]]', expectedOutput: '[[1,4],[5,6]]' }
    ],
    requiredForProgress: true,
    solutionExplanation: `## The Brute-Force Instinct

Without thinking, you might try comparing every interval with every other interval:

\`\`\`python
def merge(intervals):
    # For each interval, check if it overlaps with any other
    # If overlap found, merge them and restart
    # Repeat until no more merges possible
\`\`\`

This approach has problems:
- Multiple passes needed as merges create new overlaps
- Tracking which intervals are "used" gets messy
- Worst case O(n²) or worse

---

## The Sorting Insight

**Sort by start time first.** After sorting:
- [1,3] and [2,6]: start of second (2) ≤ end of first (3) → **overlap!**
- [1,6] and [8,10]: start of second (8) > end of first (6) → **no overlap**

Once sorted, you only need to compare **adjacent** intervals!

---

## The Algorithm

\`\`\`python
def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        previous = merged[-1]
        if current[0] <= previous[1]:
            previous[1] = max(previous[1], current[1])
        else:
            merged.append(current)
    
    return merged
\`\`\`

**Time:** O(n log n) for sorting, O(n) for merge pass
**Space:** O(n) for output array`,
    complexityQuizPlacement: 'after'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-insert-interval',
    title: 'Code: Insert Interval',
    description: 'Insert a new interval into a sorted list, merging if necessary.',
    targetComplexity: { time: 'O(n)', space: 'O(n)', notes: 'Single pass; already sorted input' },
    instruction: `# Insert Interval (LeetCode 57)

You are given an array of non-overlapping intervals \`intervals\` where \`intervals[i] = [start_i, end_i]\` represent the start and the end of the \`i-th\` interval and intervals is sorted in ascending order by \`start_i\`.

You are also given an interval \`newInterval = [start, end]\` that represents the start and end of another interval.

Insert \`newInterval\` into \`intervals\` such that \`intervals\` is still sorted in ascending order by \`start_i\` and \`intervals\` still does not have any overlapping intervals (merge overlapping intervals if necessary).

Return \`intervals\` after the insertion.

## Examples

**Example 1:**
- Input: \`intervals = [[1,3],[6,9]], newInterval = [2,5]\`
- Output: \`[[1,5],[6,9]]\`

**Example 2:**
- Input: \`intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]\`
- Output: \`[[1,2],[3,10],[12,16]]\`
- Explanation: The new interval [4,8] overlaps with [3,5],[6,7],[8,10].

## Constraints
- \`0 <= intervals.length <= 10^4\`
- \`intervals[i].length == 2\`
- \`0 <= start_i <= end_i <= 10^5\`
- intervals is sorted by \`start_i\` in ascending order
- \`newInterval.length == 2\`
- \`0 <= start <= end <= 10^5\``,
    starterCode: `def insert(intervals, newInterval):
    # Intervals are already sorted
    # Find where newInterval fits and merge if needed
    pass`,
    expectedOutput: `def insert(intervals, newInterval):
    result = []
    i = 0
    n = len(intervals)
    
    # Add all intervals that come before newInterval
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    
    # Merge all overlapping intervals with newInterval
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    result.append(newInterval)
    
    # Add all intervals that come after
    while i < n:
        result.append(intervals[i])
        i += 1
    
    return result`,
    hints: [
      { afterAttempt: 1, text: 'Since intervals are sorted, think of three phases: intervals before newInterval, intervals overlapping with newInterval, intervals after newInterval.' },
      { afterAttempt: 2, text: 'Phase 1: Add intervals where interval_end < newInterval_start (completely before).' },
      { afterAttempt: 3, text: 'Phase 2: Merge intervals where interval_start <= newInterval_end (overlapping). Update newInterval bounds.' }
    ],
    solution: {
      afterAttempt: 4,
      text: `## Solution - O(n) time, O(n) space

\`\`\`python
def insert(intervals, newInterval):
    result = []
    i = 0
    n = len(intervals)
    
    # Phase 1: Add intervals before newInterval
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    
    # Phase 2: Merge overlapping intervals
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    result.append(newInterval)
    
    # Phase 3: Add intervals after
    while i < n:
        result.append(intervals[i])
        i += 1
    
    return result
\`\`\`

**Key insight:** Three phases – before, overlapping, after – each handled by a simple while loop.`
    },
    testCases: [
      { input: '[[1,3],[6,9]], [2,5]', expectedOutput: '[[1,5],[6,9]]' },
      { input: '[[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]', expectedOutput: '[[1,2],[3,10],[12,16]]' },
      { input: '[], [5,7]', expectedOutput: '[[5,7]]' },
      { input: '[[1,5]], [2,3]', expectedOutput: '[[1,5]]' },
      { input: '[[1,5]], [6,8]', expectedOutput: '[[1,5],[6,8]]' },
      { input: '[[1,5]], [0,0]', expectedOutput: '[[0,0],[1,5]]' }
    ],
    requiredForProgress: true,
    solutionExplanation: `## The Brute-Force Instinct

You might think: add the new interval to the list, sort, then merge:

\`\`\`python
def insert(intervals, newInterval):
    intervals.append(newInterval)
    intervals.sort(key=lambda x: x[0])
    return merge(intervals)  # reuse merge function
\`\`\`

This works but is O(n log n) due to sorting. Since the input is **already sorted**, we can do better!

---

## The O(n) Insight

Since intervals are sorted, we can process them in one pass with three phases:

**Phase 1:** Add all intervals that end **before** newInterval starts
\`interval_end < newInterval_start → completely before\`

**Phase 2:** Merge all intervals that **overlap** with newInterval
\`interval_start <= newInterval_end → overlap exists\`

**Phase 3:** Add all intervals that start **after** newInterval ends

---

## Complexity

- **Time:** O(n) – single pass through the sorted intervals
- **Space:** O(n) for the output array`,
    complexityQuizPlacement: 'after'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-meeting-rooms-ii',
    title: 'Code: Meeting Rooms II',
    description: 'Find minimum number of conference rooms required using sweep line.',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)', notes: 'Sort events, track max concurrent' },
    instruction: `# Meeting Rooms II (LeetCode 253)

Given an array of meeting time intervals \`intervals\` where \`intervals[i] = [start_i, end_i]\`, return the minimum number of conference rooms required.

## Examples

**Example 1:**
- Input: \`intervals = [[0,30],[5,10],[15,20]]\`
- Output: \`2\`
- Explanation: Meeting [0,30] overlaps with both [5,10] and [15,20], but [5,10] and [15,20] don't overlap. So we need 2 rooms.

**Example 2:**
- Input: \`intervals = [[7,10],[2,4]]\`
- Output: \`1\`
- Explanation: The meetings don't overlap.

**Example 3:**
- Input: \`intervals = [[0,10],[10,20]]\`
- Output: \`1\`
- Explanation: Meeting ends exactly when next starts - same room can be used.

## Constraints
- \`1 <= intervals.length <= 10^4\`
- \`0 <= start_i < end_i <= 10^6\`

## Hint
Think of each meeting as two events: a "start" event and an "end" event. Track how many meetings are active at any point.`,
    starterCode: `def minMeetingRooms(intervals):
    # Convert intervals to events, sweep through time
    pass`,
    expectedOutput: `def minMeetingRooms(intervals):
    events = []
    
    for start, end in intervals:
        events.append((start, 1))   # Meeting starts: +1 room needed
        events.append((end, -1))    # Meeting ends: -1 room needed
    
    # Sort by time. If same time, end events (-1) come before start events (+1)
    events.sort(key=lambda x: (x[0], x[1]))
    
    active = 0
    max_rooms = 0
    
    for time, delta in events:
        active += delta
        max_rooms = max(max_rooms, active)
    
    return max_rooms`,
    hints: [
      { afterAttempt: 1, text: 'The sweep line pattern: convert each interval to two events (start = +1, end = -1), sort all events, and sweep through tracking cumulative count.' },
      { afterAttempt: 2, text: 'When sorting events at the same time, process end events before start events. This handles the case where one meeting ends exactly as another starts.' },
      { afterAttempt: 3, text: 'Track the running count of active meetings. The maximum count during the sweep is your answer.' }
    ],
    solution: {
      afterAttempt: 4,
      text: `## Solution - Sweep Line O(n log n)

\`\`\`python
def minMeetingRooms(intervals):
    events = []
    
    for start, end in intervals:
        events.append((start, 1))   # +1 room needed
        events.append((end, -1))    # -1 room needed
    
    # Sort: by time, then by delta (ends before starts at same time)
    events.sort(key=lambda x: (x[0], x[1]))
    
    active = 0
    max_rooms = 0
    
    for time, delta in events:
        active += delta
        max_rooms = max(max_rooms, active)
    
    return max_rooms
\`\`\`

**Key insight:** At any moment in time, count how many meetings are active. The peak is your answer.`
    },
    testCases: [
      { input: '[[0,30],[5,10],[15,20]]', expectedOutput: '2' },
      { input: '[[7,10],[2,4]]', expectedOutput: '1' },
      { input: '[[0,10],[10,20]]', expectedOutput: '1' },
      { input: '[[1,5],[2,6],[3,7],[4,8]]', expectedOutput: '4' },
      { input: '[[1,10]]', expectedOutput: '1' },
      { input: '[[1,2],[2,3],[3,4]]', expectedOutput: '1' }
    ],
    requiredForProgress: true,
    solutionExplanation: `## The Sweep Line Pattern

Instead of thinking about intervals, think about **events in time**:
- Each meeting creates a "start" event (+1 room needed)
- Each meeting creates an "end" event (-1 room freed)

Sort all events by time and sweep through:
\`\`\`
time=0:  start +1  → active=1
time=5:  start +1  → active=2  ← peak!
time=10: end   -1  → active=1
time=15: start +1  → active=2
time=20: end   -1  → active=1
time=30: end   -1  → active=0
\`\`\`

Maximum active count during sweep = minimum rooms needed.

**Why end before start at same time?**
If meeting A ends at 10 and meeting B starts at 10, they can share a room. Processing (10, -1) before (10, +1) handles this correctly.`,
    complexityQuizPlacement: 'after'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-non-overlapping-intervals',
    title: 'Code: Non-overlapping Intervals',
    description: 'Find minimum intervals to remove for non-overlapping set using greedy selection.',
    targetComplexity: { time: 'O(n log n)', space: 'O(1)', notes: 'Sort by end time, greedy selection' },
    instruction: `# Non-overlapping Intervals (LeetCode 435)

Given an array of intervals \`intervals\` where \`intervals[i] = [start_i, end_i]\`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.

## Examples

**Example 1:**
- Input: \`intervals = [[1,2],[2,3],[3,4],[1,3]]\`
- Output: \`1\`
- Explanation: [1,3] can be removed and the rest are non-overlapping.

**Example 2:**
- Input: \`intervals = [[1,2],[1,2],[1,2]]\`
- Output: \`2\`
- Explanation: You need to remove two [1,2] to make the rest non-overlapping.

**Example 3:**
- Input: \`intervals = [[1,2],[2,3]]\`
- Output: \`0\`
- Explanation: Already non-overlapping.

## Constraints
- \`1 <= intervals.length <= 10^5\`
- \`intervals[i].length == 2\`
- \`-5 * 10^4 <= start_i < end_i <= 5 * 10^4\`

## Hint
This is the classic Activity Selection problem. Think about which intervals to KEEP, not which to remove.`,
    starterCode: `def eraseOverlapIntervals(intervals):
    # Greedy: sort by end time, maximize non-overlapping
    pass`,
    expectedOutput: `def eraseOverlapIntervals(intervals):
    if not intervals:
        return 0
    
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    count = 0
    end = float('-inf')
    
    for start, curr_end in intervals:
        if start >= end:
            # Non-overlapping: keep this interval
            end = curr_end
        else:
            # Overlapping: remove this interval
            count += 1
    
    return count`,
    hints: [
      { afterAttempt: 1, text: 'This is the Activity Selection problem. The greedy approach: sort by END time, not start time.' },
      { afterAttempt: 2, text: 'Why sort by end? Choosing the interval that ends earliest leaves maximum room for future intervals.' },
      { afterAttempt: 3, text: 'Track the end time of the last kept interval. If new interval starts >= end, keep it. Otherwise, skip (count as removed).' }
    ],
    solution: {
      afterAttempt: 4,
      text: `## Solution - Greedy O(n log n)

\`\`\`python
def eraseOverlapIntervals(intervals):
    if not intervals:
        return 0
    
    # Sort by END time (greedy choice!)
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
\`\`\`

**Key insight:** Sorting by END time is the greedy choice – it leaves maximum room for future intervals.`
    },
    testCases: [
      { input: '[[1,2],[2,3],[3,4],[1,3]]', expectedOutput: '1' },
      { input: '[[1,2],[1,2],[1,2]]', expectedOutput: '2' },
      { input: '[[1,2],[2,3]]', expectedOutput: '0' },
      { input: '[[1,100],[11,22],[1,11],[2,12]]', expectedOutput: '2' },
      { input: '[[0,2],[1,3],[2,4],[3,5],[4,6]]', expectedOutput: '2' }
    ],
    requiredForProgress: true,
    solutionExplanation: `## The Activity Selection Problem

This is a classic greedy problem. The key insight:

**Sort by END time, not start time.**

Why? If you pick the interval that ends earliest, you leave the most room for future intervals.

\`\`\`
Intervals: [1,3], [2,3], [3,4]
Sorted by end: [2,3], [1,3], [3,4]  (or [1,3], [2,3], [3,4])

Pick [1,3] or [2,3] (end=3)
[3,4] starts at 3 >= 3, so we can keep it too.
\`\`\`

**Algorithm:**
1. Sort by end time
2. Track end of last kept interval
3. If new start >= end: keep it, update end
4. Else: skip (remove) it

**Time:** O(n log n) for sorting
**Space:** O(1) if we sort in place`,
    complexityQuizPlacement: 'after'
  }
];
