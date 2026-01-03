import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const moduleGreedyLessonSmartPracticeExercises: ExerciseSection[] = [
  // ==================== GROUP 1: Interval Greedy (sorting by end/start) ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-activity-selection',
    title: 'Activity Selection',
    description: 'Select maximum non-overlapping intervals using greedy approach',
    targetComplexity: { time: 'O(n log n)', space: 'O(1)' },
    instruction: `# Activity Selection

Given a list of intervals represented as \`[start, end]\`, select the **maximum number of non-overlapping intervals**.

Two intervals overlap if one starts before the other ends.

## Examples

**Example 1:**
\`\`\`
Input: intervals = [[1,3], [2,4], [3,5], [0,6], [5,7], [8,9], [5,9]]
Output: 4
Explanation: Select [1,3], [3,5], [5,7], [8,9] - maximum non-overlapping set
\`\`\`

**Example 2:**
\`\`\`
Input: intervals = [[1,2], [2,3], [3,4]]
Output: 3
Explanation: All intervals are non-overlapping
\`\`\`

## Constraints
- 1 <= intervals.length <= 10^4
- intervals[i].length == 2
- 0 <= start < end <= 10^4

## Your Task
Return the maximum number of non-overlapping intervals you can select.`,
    starterCode: `def maxActivities(intervals):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Think about which interval to pick first. Should you pick the one that starts earliest or ends earliest?' },
      { afterAttempt: 2, text: 'Sort intervals by end time. Always pick the interval that ends earliest and doesn\'t overlap with previously selected.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Greedy by End Time

\`\`\`python
def maxActivities(intervals):
    if not intervals:
        return 0

    # Sort by end time
    intervals.sort(key=lambda x: x[1])

    count = 1
    last_end = intervals[0][1]

    for i in range(1, len(intervals)):
        # If current starts after or when last ends
        if intervals[i][0] >= last_end:
            count += 1
            last_end = intervals[i][1]

    return count
\`\`\`

## Why Greedy Works
- Picking the interval that ends earliest leaves maximum room for future intervals
- This is optimal because ending earlier never blocks more options than ending later
- Proof: If we don't pick earliest-ending, we can swap it in without losing count

## Complexity
- Time: O(n log n) for sorting
- Space: O(1) if we sort in place`
    },
    testCases: [
      { input: '[[1,3], [2,4], [3,5], [0,6], [5,7], [8,9], [5,9]]', expected: '4' },
      { input: '[[1,2], [2,3], [3,4]]', expected: '3' },
      { input: '[[1,10]]', expected: '1' },
      { input: '[[1,2], [1,2], [1,2]]', expected: '1' }
    ],
    solutionExplanation: 'Sort by end time, greedily select non-overlapping intervals.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-erase-overlapping-intervals',
    title: 'Erase Overlapping Intervals',
    description: 'Remove minimum intervals to eliminate all overlaps',
    targetComplexity: { time: 'O(n log n)', space: 'O(1)' },
    instruction: `# Erase Overlapping Intervals

Given an array of intervals \`intervals\` where \`intervals[i] = [start, end]\`, return the **minimum number of intervals you need to remove** to make the rest of the intervals non-overlapping.

## Examples

**Example 1:**
\`\`\`
Input: intervals = [[1,2],[2,3],[3,4],[1,3]]
Output: 1
Explanation: Remove [1,3] to make the rest non-overlapping
\`\`\`

**Example 2:**
\`\`\`
Input: intervals = [[1,2],[1,2],[1,2]]
Output: 2
Explanation: Keep one [1,2], remove the other two
\`\`\`

**Example 3:**
\`\`\`
Input: intervals = [[1,2],[2,3]]
Output: 0
Explanation: Already non-overlapping (touching at 2 is OK)
\`\`\`

## Constraints
- 1 <= intervals.length <= 10^5
- intervals[i].length == 2
- -5 * 10^4 <= start < end <= 5 * 10^4`,
    starterCode: `def eraseOverlapIntervals(intervals):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'This is the complement of activity selection. Max non-overlapping = total - min removals.' },
      { afterAttempt: 2, text: 'Sort by end time. When overlap occurs, remove the interval that ends later (keeps more room).' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Greedy - Keep Max Non-overlapping

\`\`\`python
def eraseOverlapIntervals(intervals):
    if not intervals:
        return 0

    # Sort by end time
    intervals.sort(key=lambda x: x[1])

    count = 0  # intervals to remove
    prev_end = intervals[0][1]

    for i in range(1, len(intervals)):
        if intervals[i][0] < prev_end:
            # Overlap! Remove current (it ends later)
            count += 1
        else:
            # No overlap, update prev_end
            prev_end = intervals[i][1]

    return count
\`\`\`

## Key Insight
- Same as activity selection but we count removals
- removals = total - max_non_overlapping
- When overlap occurs, we "remove" the one ending later (by not updating prev_end)

## Complexity
- Time: O(n log n) for sorting
- Space: O(1)`
    },
    testCases: [
      { input: '[[1,2],[2,3],[3,4],[1,3]]', expected: '1' },
      { input: '[[1,2],[1,2],[1,2]]', expected: '2' },
      { input: '[[1,2],[2,3]]', expected: '0' },
      { input: '[[1,100],[11,22],[1,11],[2,12]]', expected: '2' }
    ],
    solutionExplanation: 'Sort by end time, count overlapping intervals to remove.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-minimum-arrows-burst-balloons',
    title: 'Minimum Number of Arrows to Burst Balloons',
    description: 'Find minimum arrows to burst all overlapping balloon intervals',
    targetComplexity: { time: 'O(n log n)', space: 'O(1)' },
    instruction: `# Minimum Number of Arrows to Burst Balloons

There are spherical balloons spread in 2D space. Each balloon is represented as an interval \`[xstart, xend]\` on the x-axis.

An arrow shot at position \`x\` bursts all balloons where \`xstart <= x <= xend\`.

Return the **minimum number of arrows** needed to burst all balloons.

## Examples

**Example 1:**
\`\`\`
Input: points = [[10,16],[2,8],[1,6],[7,12]]
Output: 2
Explanation:
- Arrow at x=6 bursts [2,8] and [1,6]
- Arrow at x=11 bursts [10,16] and [7,12]
\`\`\`

**Example 2:**
\`\`\`
Input: points = [[1,2],[3,4],[5,6],[7,8]]
Output: 4
Explanation: No overlaps, need 4 arrows
\`\`\`

**Example 3:**
\`\`\`
Input: points = [[1,2],[2,3],[3,4],[4,5]]
Output: 2
Explanation: Arrow at x=2 bursts [1,2],[2,3]; arrow at x=4 bursts [3,4],[4,5]
\`\`\`

## Constraints
- 1 <= points.length <= 10^5
- points[i].length == 2
- -2^31 <= xstart < xend <= 2^31 - 1`,
    starterCode: `def findMinArrowShots(points):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'One arrow can burst multiple overlapping balloons. Group overlapping balloons together.' },
      { afterAttempt: 2, text: 'Sort by end point. Each arrow should be shot at the end of the earliest-ending balloon in a group.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Greedy by End Point

\`\`\`python
def findMinArrowShots(points):
    if not points:
        return 0

    # Sort by end point
    points.sort(key=lambda x: x[1])

    arrows = 1
    arrow_pos = points[0][1]  # Shoot at end of first balloon

    for i in range(1, len(points)):
        # If balloon starts after current arrow position
        if points[i][0] > arrow_pos:
            arrows += 1
            arrow_pos = points[i][1]

    return arrows
\`\`\`

## Why This Works
- Sort by end point to process balloons in order
- Shoot arrow at end of first balloon in each group
- All balloons starting before this point are burst
- When a balloon starts after arrow, need new arrow

## Note
- Unlike activity selection, overlapping at boundary DOES count (arrow at x=2 bursts both [1,2] and [2,3])

## Complexity
- Time: O(n log n) for sorting
- Space: O(1)`
    },
    testCases: [
      { input: '[[10,16],[2,8],[1,6],[7,12]]', expected: '2' },
      { input: '[[1,2],[3,4],[5,6],[7,8]]', expected: '4' },
      { input: '[[1,2],[2,3],[3,4],[4,5]]', expected: '2' },
      { input: '[[1,2]]', expected: '1' }
    ],
    solutionExplanation: 'Sort by end, greedily shoot arrows to burst maximum overlapping balloons.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-non-overlapping-meetings',
    title: 'Non-overlapping Meetings',
    description: 'Find maximum meetings one person can attend',
    targetComplexity: { time: 'O(n log n)', space: 'O(1)' },
    instruction: `# Non-overlapping Meetings

You are given a list of meetings where \`meetings[i] = [start, end]\` represents a meeting from time \`start\` to \`end\`.

Return the **maximum number of meetings** one person can attend.

A person can only attend one meeting at a time. If a meeting ends at time \`t\`, the person can attend another meeting that starts at time \`t\`.

## Examples

**Example 1:**
\`\`\`
Input: meetings = [[0,30],[5,10],[15,20]]
Output: 2
Explanation: Attend [5,10] and [15,20]
\`\`\`

**Example 2:**
\`\`\`
Input: meetings = [[1,5],[2,3],[3,4]]
Output: 2
Explanation: Attend [2,3] and [3,4]
\`\`\`

**Example 3:**
\`\`\`
Input: meetings = [[1,2],[2,3],[3,4],[4,5]]
Output: 4
Explanation: All meetings can be attended back-to-back
\`\`\`

## Constraints
- 1 <= meetings.length <= 10^4
- meetings[i].length == 2
- 0 <= start < end <= 10^6`,
    starterCode: `def maxMeetings(meetings):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'This is the classic activity selection problem. Which meeting should you prioritize?' },
      { afterAttempt: 2, text: 'Sort by end time. Always pick the meeting that ends earliest if it doesn\'t conflict.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Activity Selection

\`\`\`python
def maxMeetings(meetings):
    if not meetings:
        return 0

    # Sort by end time
    meetings.sort(key=lambda x: x[1])

    count = 1
    last_end = meetings[0][1]

    for i in range(1, len(meetings)):
        if meetings[i][0] >= last_end:
            count += 1
            last_end = meetings[i][1]

    return count
\`\`\`

## Why Sort by End Time?
- Meeting that ends earlier leaves more time for future meetings
- Greedy choice: always pick the meeting that ends soonest
- This maximizes remaining available time

## Complexity
- Time: O(n log n) for sorting
- Space: O(1)`
    },
    testCases: [
      { input: '[[0,30],[5,10],[15,20]]', expected: '2' },
      { input: '[[1,5],[2,3],[3,4]]', expected: '2' },
      { input: '[[1,2],[2,3],[3,4],[4,5]]', expected: '4' },
      { input: '[[7,10],[2,4]]', expected: '2' }
    ],
    solutionExplanation: 'Classic activity selection - sort by end time, greedily select non-overlapping.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-interval-covering',
    title: 'Interval Covering',
    description: 'Cover target interval with minimum number of intervals',
    targetComplexity: { time: 'O(n log n)', space: 'O(1)' },
    instruction: `# Interval Covering

Given a target interval \`[L, R]\` and a list of intervals, choose the **minimum number of intervals** that fully cover \`[L, R]\`.

Return -1 if it's impossible to cover the target.

## Examples

**Example 1:**
\`\`\`
Input: target = [0, 10], intervals = [[0,3],[2,5],[4,7],[6,9],[8,10]]
Output: 3
Explanation: Use [0,3], [2,5] or [4,7], [8,10] - need 3 intervals minimum
Actually: [0,3] covers 0-3, [2,5] or [4,7] extends, [8,10] covers end
\`\`\`

**Example 2:**
\`\`\`
Input: target = [0, 5], intervals = [[0,2],[2,4],[5,6]]
Output: -1
Explanation: Gap between 4 and 5, cannot cover
\`\`\`

**Example 3:**
\`\`\`
Input: target = [1, 10], intervals = [[1,5],[2,8],[7,10]]
Output: 2
Explanation: Use [2,8] and [7,10]
\`\`\`

## Constraints
- 0 <= L < R <= 10^6
- 1 <= intervals.length <= 10^4
- 0 <= start < end <= 10^6`,
    starterCode: `def minIntervalsToCover(target, intervals):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Sort intervals by start time. Greedily extend coverage as far as possible.' },
      { afterAttempt: 2, text: 'At each step, among intervals that start before current position, pick the one that extends furthest.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Greedy Extension

\`\`\`python
def minIntervalsToCover(target, intervals):
    L, R = target

    # Sort by start time
    intervals.sort()

    count = 0
    current_end = L
    i = 0
    n = len(intervals)

    while current_end < R:
        # Find interval that starts <= current_end and extends furthest
        max_end = current_end

        while i < n and intervals[i][0] <= current_end:
            max_end = max(max_end, intervals[i][1])
            i += 1

        # No progress possible
        if max_end == current_end:
            return -1

        current_end = max_end
        count += 1

    return count
\`\`\`

## Greedy Strategy
1. Sort intervals by start time
2. Track current coverage end
3. Among all intervals starting at or before current end, pick the one extending furthest
4. Repeat until we cover R

## Why This Works
- We need continuous coverage from L to R
- At each step, extending as far as possible minimizes total intervals needed

## Complexity
- Time: O(n log n) for sorting
- Space: O(1)`
    },
    testCases: [
      { input: '[[0, 10], [[0,3],[2,5],[4,7],[6,9],[8,10]]]', expected: '3' },
      { input: '[[0, 5], [[0,2],[2,4],[5,6]]]', expected: '-1' },
      { input: '[[1, 10], [[1,5],[2,8],[7,10]]]', expected: '2' },
      { input: '[[0, 3], [[0,4]]]', expected: '1' }
    ],
    solutionExplanation: 'Sort by start, greedily pick interval that extends coverage the most.'
  },

  // ==================== GROUP 2: Scheduling With Priority ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-task-scheduling-deadlines',
    title: 'Task Scheduling With Deadlines',
    description: 'Schedule tasks to maximize profit within deadlines',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Task Scheduling With Deadlines

You are given n tasks where each task has a deadline and profit. Each task takes 1 unit of time and only one task can be scheduled at a time.

You earn the profit if and only if the task is completed by its deadline.

Return the **maximum profit** you can earn.

## Examples

**Example 1:**
\`\`\`
Input: tasks = [[1,50],[2,10],[3,20],[2,30]]
        (deadline, profit)
Output: 100
Explanation:
- Schedule task with profit 50 at time 1 (deadline 1)
- Schedule task with profit 30 at time 2 (deadline 2)
- Schedule task with profit 20 at time 3 (deadline 3)
Total = 50 + 30 + 20 = 100
\`\`\`

**Example 2:**
\`\`\`
Input: tasks = [[1,100],[2,19],[2,27],[1,25],[3,15]]
Output: 142
Explanation: 100 + 27 + 15 = 142
\`\`\`

## Constraints
- 1 <= n <= 10^4
- 1 <= deadline <= n
- 1 <= profit <= 500`,
    starterCode: `def maxProfit(tasks):
    # tasks[i] = [deadline, profit]
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Sort tasks by profit in descending order. Try to schedule high-profit tasks first.' },
      { afterAttempt: 2, text: 'For each task, find the latest available slot before its deadline. Use a slot tracking array.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Greedy + Slot Assignment

\`\`\`python
def maxProfit(tasks):
    if not tasks:
        return 0

    # Sort by profit descending
    tasks.sort(key=lambda x: -x[1])

    max_deadline = max(t[0] for t in tasks)
    slots = [False] * (max_deadline + 1)  # slots[1..max_deadline]

    total_profit = 0

    for deadline, profit in tasks:
        # Find latest available slot <= deadline
        for slot in range(deadline, 0, -1):
            if not slots[slot]:
                slots[slot] = True
                total_profit += profit
                break

    return total_profit
\`\`\`

## Optimized with Union-Find (O(n log n))

\`\`\`python
def maxProfit(tasks):
    # Sort by profit descending
    tasks.sort(key=lambda x: -x[1])

    max_deadline = max(t[0] for t in tasks)
    parent = list(range(max_deadline + 2))  # Union-Find

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    total = 0
    for deadline, profit in tasks:
        slot = find(deadline)
        if slot > 0:
            total += profit
            parent[slot] = slot - 1  # Point to previous slot

    return total
\`\`\`

## Complexity
- Naive: O(n * max_deadline)
- Union-Find: O(n log n)`
    },
    testCases: [
      { input: '[[1,50],[2,10],[3,20],[2,30]]', expected: '100' },
      { input: '[[1,100],[2,19],[2,27],[1,25],[3,15]]', expected: '142' },
      { input: '[[2,100],[1,50],[2,10]]', expected: '150' },
      { input: '[[1,20],[1,15],[1,10]]', expected: '20' }
    ],
    solutionExplanation: 'Sort by profit descending, greedily assign to latest available slot before deadline.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-course-schedule-iii',
    title: 'Course Schedule III',
    description: 'Maximize number of courses with duration and deadline constraints',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Course Schedule III

There are n courses. Each course has a duration and a last day by which it must be completed.

Course i is represented as \`[duration, lastDay]\`. You must complete a course within \`lastDay\` days (inclusive).

Return the **maximum number of courses** you can take.

## Examples

**Example 1:**
\`\`\`
Input: courses = [[100,200],[200,1300],[1000,1250],[2000,3200]]
Output: 3
Explanation:
- Take course 0: day 1-100, ends at day 100 (deadline 200) ✓
- Take course 2: day 101-1100, ends at day 1100 (deadline 1250) ✓
- Take course 1: day 1101-1300, ends at day 1300 (deadline 1300) ✓
Can't take course 3 (would end at 3300 > 3200)
\`\`\`

**Example 2:**
\`\`\`
Input: courses = [[1,2]]
Output: 1
\`\`\`

**Example 3:**
\`\`\`
Input: courses = [[3,2],[4,3]]
Output: 0
Explanation: Both courses take longer than their deadlines allow
\`\`\`

## Constraints
- 1 <= n <= 10^4
- 1 <= duration <= lastDay <= 10^4`,
    starterCode: `def scheduleCourse(courses):
    # courses[i] = [duration, lastDay]
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Sort courses by deadline. Process earlier deadlines first.' },
      { afterAttempt: 2, text: 'Use a max heap to track durations. If adding a course exceeds deadline, swap with longest course if that helps.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Greedy + Max Heap

\`\`\`python
import heapq

def scheduleCourse(courses):
    # Sort by deadline (lastDay)
    courses.sort(key=lambda x: x[1])

    max_heap = []  # Store negative durations for max heap
    current_time = 0

    for duration, lastDay in courses:
        if current_time + duration <= lastDay:
            # Can take this course
            current_time += duration
            heapq.heappush(max_heap, -duration)
        elif max_heap and -max_heap[0] > duration:
            # Swap with longest course if beneficial
            longest = -heapq.heappop(max_heap)
            current_time -= longest
            current_time += duration
            heapq.heappush(max_heap, -duration)

    return len(max_heap)
\`\`\`

## Key Insight
- Sort by deadline to process urgent courses first
- If can't fit current course, check if swapping with longest taken course helps
- Swap is beneficial if current course is shorter (saves time for future)

## Why This Works
- Processing by deadline ensures we never miss a deadline due to ordering
- The heap swap ensures we're always keeping shortest duration courses
- Shorter courses leave more room for additional courses

## Complexity
- Time: O(n log n)
- Space: O(n) for heap`
    },
    testCases: [
      { input: '[[100,200],[200,1300],[1000,1250],[2000,3200]]', expected: '3' },
      { input: '[[1,2]]', expected: '1' },
      { input: '[[3,2],[4,3]]', expected: '0' },
      { input: '[[5,5],[4,6],[2,6]]', expected: '2' }
    ],
    solutionExplanation: 'Sort by deadline, use max heap to swap out longer courses when needed.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-cpu-task-scheduling',
    title: 'CPU Task Scheduling',
    description: 'Schedule tasks with cooldown to minimize total time',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# CPU Task Scheduling

Given a list of tasks represented by characters and a cooldown period n, find the **minimum time** needed to complete all tasks.

Same tasks must have at least n intervals between them. You can insert idle times.

## Examples

**Example 1:**
\`\`\`
Input: tasks = ["A","A","A","B","B","B"], n = 2
Output: 8
Explanation: A -> B -> idle -> A -> B -> idle -> A -> B
\`\`\`

**Example 2:**
\`\`\`
Input: tasks = ["A","A","A","B","B","B"], n = 0
Output: 6
Explanation: No cooldown needed, just do all tasks
\`\`\`

**Example 3:**
\`\`\`
Input: tasks = ["A","A","A","A","A","A","B","C","D","E","F","G"], n = 2
Output: 16
Explanation: A -> B -> C -> A -> D -> E -> A -> F -> G -> A -> idle -> idle -> A -> idle -> idle -> A
\`\`\`

## Constraints
- 1 <= tasks.length <= 10^4
- tasks[i] is uppercase English letter
- 0 <= n <= 100`,
    starterCode: `def leastInterval(tasks, n):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'The task with maximum frequency determines the structure. Think of frames of size n+1.' },
      { afterAttempt: 2, text: 'Formula: (max_freq - 1) * (n + 1) + count_of_max_freq_tasks. Compare with total tasks.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Math Formula

\`\`\`python
def leastInterval(tasks, n):
    from collections import Counter

    freq = Counter(tasks)
    max_freq = max(freq.values())

    # Count tasks with max frequency
    max_count = sum(1 for f in freq.values() if f == max_freq)

    # Calculate minimum time
    # (max_freq - 1) frames of (n + 1) slots + max_count tasks in last frame
    min_time = (max_freq - 1) * (n + 1) + max_count

    # At minimum, we need len(tasks) time
    return max(min_time, len(tasks))
\`\`\`

## Visualization
For tasks = [A,A,A,B,B,B], n = 2:
\`\`\`
Frame 1: A B _
Frame 2: A B _
Frame 3: A B

(max_freq - 1) = 2 frames of (n+1) = 3 slots = 6
+ max_count = 2 (both A and B have max freq)
= 8
\`\`\`

## Why This Works
- Most frequent task creates the frame structure
- Other tasks fill in the gaps
- If gaps are filled, result is just len(tasks)

## Complexity
- Time: O(n) to count frequencies
- Space: O(1) - at most 26 letters`
    },
    testCases: [
      { input: '[["A","A","A","B","B","B"], 2]', expected: '8' },
      { input: '[["A","A","A","B","B","B"], 0]', expected: '6' },
      { input: '[["A","A","A","A","A","A","B","C","D","E","F","G"], 2]', expected: '16' },
      { input: '[["A","B","C","D","E","F"], 2]', expected: '6' }
    ],
    solutionExplanation: 'Use frame-based formula: (max_freq-1)*(n+1) + count_of_max, take max with total tasks.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-job-sequencing',
    title: 'Job Sequencing Problem',
    description: 'Schedule jobs with deadlines to maximize profit',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Job Sequencing Problem

Given n jobs where each job has a deadline and profit. Each job takes 1 unit of time. Only one job can be scheduled at a time.

Return the **maximum profit** and the **number of jobs** that can be done.

## Examples

**Example 1:**
\`\`\`
Input: jobs = [[4,20],[1,10],[1,40],[1,30]]
        (deadline, profit)
Output: [2, 60]
Explanation:
- Job with profit 40 at time 1 (deadline 1)
- Job with profit 20 at time 4 (deadline 4)
Jobs done = 2, Profit = 60
\`\`\`

**Example 2:**
\`\`\`
Input: jobs = [[2,100],[1,19],[2,27],[1,25],[3,15]]
Output: [3, 142]
Explanation: 100 + 27 + 15 = 142 with 3 jobs
\`\`\`

## Constraints
- 1 <= n <= 10^5
- 1 <= deadline <= n
- 1 <= profit <= 500`,
    starterCode: `def jobSequencing(jobs):
    # jobs[i] = [deadline, profit]
    # Return [count, profit]
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Sort jobs by profit in descending order. Greedy: do high-profit jobs first.' },
      { afterAttempt: 2, text: 'For each job, find the latest empty slot before its deadline. Track used slots.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Greedy with Slot Array

\`\`\`python
def jobSequencing(jobs):
    if not jobs:
        return [0, 0]

    # Sort by profit descending
    jobs.sort(key=lambda x: -x[1])

    max_deadline = max(job[0] for job in jobs)
    slots = [False] * (max_deadline + 1)

    count = 0
    profit = 0

    for deadline, job_profit in jobs:
        # Find latest available slot
        for slot in range(deadline, 0, -1):
            if not slots[slot]:
                slots[slot] = True
                count += 1
                profit += job_profit
                break

    return [count, profit]
\`\`\`

## Key Insight
- Sort by profit to prioritize valuable jobs
- Assign each job to latest possible slot (maximizes flexibility)
- If no slot available, skip the job

## Complexity
- Time: O(n * max_deadline) naive, O(n log n) with Union-Find
- Space: O(max_deadline)`
    },
    testCases: [
      { input: '[[4,20],[1,10],[1,40],[1,30]]', expected: '[2, 60]' },
      { input: '[[2,100],[1,19],[2,27],[1,25],[3,15]]', expected: '[3, 142]' },
      { input: '[[1,50],[2,60],[3,70]]', expected: '[3, 180]' },
      { input: '[[1,100]]', expected: '[1, 100]' }
    ],
    solutionExplanation: 'Sort by profit descending, greedily assign to latest available slot.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-minimum-platforms',
    title: 'Minimum Number of Platforms',
    description: 'Find minimum platforms needed for all trains',
    targetComplexity: { time: 'O(n log n)', space: 'O(1)' },
    instruction: `# Minimum Number of Platforms

Given arrival and departure times of all trains at a railway station, find the **minimum number of platforms** needed so no train has to wait.

## Examples

**Example 1:**
\`\`\`
Input: arrivals = [900, 940, 950, 1100, 1500, 1800]
       departures = [910, 1200, 1120, 1130, 1900, 2000]
Output: 3
Explanation: At time 950-1100, trains 1,2,3 are all at station
\`\`\`

**Example 2:**
\`\`\`
Input: arrivals = [900, 1100, 1235]
       departures = [1000, 1200, 1240]
Output: 1
Explanation: No overlapping trains
\`\`\`

## Constraints
- 1 <= n <= 10^5
- Times are in 24-hour format (0000 to 2359)
- arrivals[i] < departures[i]`,
    starterCode: `def findPlatforms(arrivals, departures):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Think of this as counting maximum overlapping intervals at any point.' },
      { afterAttempt: 2, text: 'Sort arrivals and departures separately. Use two pointers to track concurrent trains.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Event-based Counting

\`\`\`python
def findPlatforms(arrivals, departures):
    arrivals.sort()
    departures.sort()

    n = len(arrivals)
    platforms = 0
    max_platforms = 0
    i = j = 0

    while i < n and j < n:
        if arrivals[i] <= departures[j]:
            # Train arrives
            platforms += 1
            max_platforms = max(max_platforms, platforms)
            i += 1
        else:
            # Train departs
            platforms -= 1
            j += 1

    return max_platforms
\`\`\`

## Alternative: Event Array

\`\`\`python
def findPlatforms(arrivals, departures):
    events = []
    for a in arrivals:
        events.append((a, 1))   # arrival: +1
    for d in departures:
        events.append((d + 1, -1))  # departure: -1 (after time d)

    events.sort()

    current = max_platforms = 0
    for time, delta in events:
        current += delta
        max_platforms = max(max_platforms, current)

    return max_platforms
\`\`\`

## Key Insight
- We only care about relative ordering of events
- Sort events and track running count of trains
- Maximum count = minimum platforms needed

## Complexity
- Time: O(n log n) for sorting
- Space: O(1) for two-pointer, O(n) for events array`
    },
    testCases: [
      { input: '[[900, 940, 950, 1100, 1500, 1800], [910, 1200, 1120, 1130, 1900, 2000]]', expected: '3' },
      { input: '[[900, 1100, 1235], [1000, 1200, 1240]]', expected: '1' },
      { input: '[[100, 100, 100], [200, 200, 200]]', expected: '3' },
      { input: '[[900], [1000]]', expected: '1' }
    ],
    solutionExplanation: 'Sort arrivals and departures, use two pointers to find max concurrent trains.'
  },

  // ==================== GROUP 3: Greedy With Sorting + Two Pointers ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-assign-cookies',
    title: 'Assign Cookies',
    description: 'Maximize satisfied children with greedy cookie assignment',
    targetComplexity: { time: 'O(n log n)', space: 'O(1)' },
    instruction: `# Assign Cookies

You have children with different greed factors and cookies with different sizes.

Each child i has a greed factor \`g[i]\` - the minimum cookie size that will satisfy them.
Each cookie j has a size \`s[j]\`.

A child is satisfied if they get a cookie of size >= their greed factor.

Return the **maximum number of children** you can satisfy.

## Examples

**Example 1:**
\`\`\`
Input: g = [1,2,3], s = [1,1]
Output: 1
Explanation: One cookie of size 1 satisfies child with greed 1
\`\`\`

**Example 2:**
\`\`\`
Input: g = [1,2], s = [1,2,3]
Output: 2
Explanation: Cookie 1 for child 1, cookie 2 for child 2
\`\`\`

## Constraints
- 1 <= g.length, s.length <= 3 * 10^4
- 1 <= g[i], s[j] <= 2^31 - 1`,
    starterCode: `def findContentChildren(g, s):
    # g = greed factors, s = cookie sizes
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Sort both arrays. Try to satisfy the least greedy child first.' },
      { afterAttempt: 2, text: 'Use two pointers. For each child, find the smallest cookie that satisfies them.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Sort + Two Pointers

\`\`\`python
def findContentChildren(g, s):
    g.sort()  # Sort children by greed
    s.sort()  # Sort cookies by size

    child = cookie = 0

    while child < len(g) and cookie < len(s):
        if s[cookie] >= g[child]:
            # This cookie satisfies this child
            child += 1
        cookie += 1

    return child
\`\`\`

## Why This Works
- Sort to process in increasing order
- Give smallest sufficient cookie to least greedy child
- This leaves larger cookies for greedier children
- Never waste a large cookie on an easily satisfied child

## Proof of Optimality
If we give a child a larger cookie than necessary, we might not have a cookie for a greedier child who needed that larger one.

## Complexity
- Time: O(n log n + m log m) for sorting
- Space: O(1) if sorting in place`
    },
    testCases: [
      { input: '[[1,2,3], [1,1]]', expected: '1' },
      { input: '[[1,2], [1,2,3]]', expected: '2' },
      { input: '[[10,9,8,7], [5,6,7,8]]', expected: '2' },
      { input: '[[1,2,3], [3]]', expected: '1' }
    ],
    solutionExplanation: 'Sort both arrays, greedily match smallest sufficient cookie to each child.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-boats-save-people',
    title: 'Boats to Save People',
    description: 'Find minimum boats with weight limit constraint',
    targetComplexity: { time: 'O(n log n)', space: 'O(1)' },
    instruction: `# Boats to Save People

You are given an array \`people\` where \`people[i]\` is the weight of person i, and a \`limit\` which is the maximum weight a boat can carry.

Each boat can carry at most **2 people** at a time, provided the sum of their weights is at most \`limit\`.

Return the **minimum number of boats** to carry every person.

## Examples

**Example 1:**
\`\`\`
Input: people = [1,2], limit = 3
Output: 1
Explanation: 1 boat with both people (1+2=3)
\`\`\`

**Example 2:**
\`\`\`
Input: people = [3,2,2,1], limit = 3
Output: 3
Explanation: (1,2), (2), (3)
\`\`\`

**Example 3:**
\`\`\`
Input: people = [3,5,3,4], limit = 5
Output: 4
Explanation: Each person needs their own boat
\`\`\`

## Constraints
- 1 <= people.length <= 5 * 10^4
- 1 <= people[i] <= limit <= 3 * 10^4`,
    starterCode: `def numRescueBoats(people, limit):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Sort people by weight. Try to pair heaviest with lightest.' },
      { afterAttempt: 2, text: 'Use two pointers: one at start (lightest), one at end (heaviest). If they fit, move both. Otherwise, just the heavy one.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Two Pointers

\`\`\`python
def numRescueBoats(people, limit):
    people.sort()

    boats = 0
    left = 0
    right = len(people) - 1

    while left <= right:
        if people[left] + people[right] <= limit:
            left += 1  # Lightest can pair with heaviest
        right -= 1  # Heaviest always gets a boat
        boats += 1

    return boats
\`\`\`

## Key Insight
- Heavy person definitely needs a boat
- Question: can we fit someone else?
- Best chance: pair with lightest remaining person
- If lightest doesn't fit, no one will

## Why This Works
- Sort and use two pointers
- Heaviest always takes a boat (right pointer)
- If lightest fits with them, they share (left pointer moves)
- Otherwise, heaviest goes alone

## Complexity
- Time: O(n log n) for sorting
- Space: O(1)`
    },
    testCases: [
      { input: '[[1,2], 3]', expected: '1' },
      { input: '[[3,2,2,1], 3]', expected: '3' },
      { input: '[[3,5,3,4], 5]', expected: '4' },
      { input: '[[5,1,4,2], 6]', expected: '2' }
    ],
    solutionExplanation: 'Sort by weight, use two pointers to pair heaviest with lightest when possible.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-two-city-scheduling',
    title: 'Two City Scheduling',
    description: 'Minimize cost to send half to each city',
    targetComplexity: { time: 'O(n log n)', space: 'O(1)' },
    instruction: `# Two City Scheduling

A company needs to send exactly n people to city A and n people to city B.

The cost of sending person i to city A is \`costs[i][0]\`, and to city B is \`costs[i][1]\`.

Return the **minimum total cost** to send half the people to each city.

## Examples

**Example 1:**
\`\`\`
Input: costs = [[10,20],[30,200],[400,50],[30,20]]
Output: 110
Explanation:
- Send persons 0,1 to A: 10 + 30 = 40
- Send persons 2,3 to B: 50 + 20 = 70
Total = 110
\`\`\`

**Example 2:**
\`\`\`
Input: costs = [[259,770],[448,54],[926,667],[184,139],[840,118],[577,469]]
Output: 1859
\`\`\`

## Constraints
- 2 * n == costs.length
- 2 <= costs.length <= 100
- costs.length is even
- 1 <= costs[i][0], costs[i][1] <= 1000`,
    starterCode: `def twoCitySchedCost(costs):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Initially send everyone to city A. Then "refund" by switching some to B.' },
      { afterAttempt: 2, text: 'Sort by (cost_B - cost_A). People with negative difference save money going to B.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Sort by Cost Difference

\`\`\`python
def twoCitySchedCost(costs):
    # Sort by "savings" of going to A instead of B
    # i.e., sort by (cost_A - cost_B)
    costs.sort(key=lambda x: x[0] - x[1])

    n = len(costs) // 2
    total = 0

    # First n go to A (cheapest relative to B)
    # Last n go to B
    for i in range(n):
        total += costs[i][0]      # City A
        total += costs[i + n][1]  # City B

    return total
\`\`\`

## Key Insight
- cost_A - cost_B tells us how much cheaper A is than B for each person
- Sort by this difference
- Send people who "prefer" A (lower difference) to A
- Send people who "prefer" B (higher difference) to B

## Alternative View
- Start by sending everyone to A: sum of all costs[i][0]
- We need to switch n people to B
- Switching person i costs: costs[i][1] - costs[i][0]
- Pick n people with lowest switching cost

## Complexity
- Time: O(n log n)
- Space: O(1)`
    },
    testCases: [
      { input: '[[10,20],[30,200],[400,50],[30,20]]', expected: '110' },
      { input: '[[259,770],[448,54],[926,667],[184,139],[840,118],[577,469]]', expected: '1859' },
      { input: '[[1,100],[100,1]]', expected: '2' },
      { input: '[[50,50],[50,50]]', expected: '100' }
    ],
    solutionExplanation: 'Sort by cost difference (A-B), send first half to A, second half to B.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-advantage-shuffle',
    title: 'Advantage Shuffle',
    description: 'Rearrange array A to maximize wins against B',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Advantage Shuffle

Given two integer arrays \`nums1\` and \`nums2\` of the same length, return a permutation of \`nums1\` that maximizes the number of indices i where \`nums1[i] > nums2[i]\`.

## Examples

**Example 1:**
\`\`\`
Input: nums1 = [2,7,11,15], nums2 = [1,10,4,11]
Output: [2,11,7,15]
Explanation:
- nums1[0]=2 > nums2[0]=1 ✓
- nums1[1]=11 > nums2[1]=10 ✓
- nums1[2]=7 > nums2[2]=4 ✓
- nums1[3]=15 > nums2[3]=11 ✓
All 4 positions win!
\`\`\`

**Example 2:**
\`\`\`
Input: nums1 = [12,24,8,32], nums2 = [13,25,32,11]
Output: [24,32,8,12]
Explanation:
- 24 > 13 ✓
- 32 > 25 ✓
- 8 < 32 ✗
- 12 > 11 ✓
3 wins
\`\`\`

## Constraints
- 1 <= nums1.length <= 10^5
- nums1.length == nums2.length
- 0 <= nums1[i], nums2[i] <= 10^9`,
    starterCode: `def advantageCount(nums1, nums2):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'This is like the "racing horses" strategy. Use smallest winning card against each opponent.' },
      { afterAttempt: 2, text: 'Sort nums1. For each nums2[i] in order of magnitude, assign smallest nums1 element that beats it.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Greedy Assignment

\`\`\`python
from collections import deque

def advantageCount(nums1, nums2):
    sorted_nums1 = sorted(nums1)
    # Sort nums2 indices by value
    sorted_indices = sorted(range(len(nums2)), key=lambda i: nums2[i])

    result = [0] * len(nums1)
    remaining = deque()  # Elements that can't beat anyone

    j = 0  # Pointer for sorted_nums1

    # Assign to positions in increasing order of nums2
    for i in sorted_indices:
        target = nums2[i]

        # Find smallest element in nums1 that beats target
        while j < len(sorted_nums1) and sorted_nums1[j] <= target:
            remaining.append(sorted_nums1[j])
            j += 1

        if j < len(sorted_nums1):
            result[i] = sorted_nums1[j]
            j += 1
        else:
            result[i] = remaining.popleft()

    return result
\`\`\`

## Key Insight
- For each opponent value, use smallest card that beats it
- If no card beats it, use the weakest card (save strong cards)
- Process opponents in increasing order

## Why This Works
- Using smallest winning card maximizes remaining options
- Weak cards that can't win should be "thrown away" against strongest opponents

## Complexity
- Time: O(n log n) for sorting
- Space: O(n) for result array`
    },
    testCases: [
      { input: '[[2,7,11,15], [1,10,4,11]]', expected: '[2,11,7,15]' },
      { input: '[[12,24,8,32], [13,25,32,11]]', expected: '[24,32,8,12]' },
      { input: '[[1,1,1], [1,1,1]]', expected: '[1,1,1]' },
      { input: '[[2,0,4,1,2], [1,3,0,0,2]]', expected: '[2,4,1,0,2]' }
    ],
    solutionExplanation: 'Sort both, greedily assign smallest winning element for each position.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-rescue-boats-variations',
    title: 'Rescue Boats with Capacity',
    description: 'Boats with capacity for up to k people',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Rescue Boats with Capacity

You need to rescue people with boats. Each boat has:
- A weight limit \`limit\`
- A capacity for at most \`k\` people

Given an array \`people\` where \`people[i]\` is the weight of person i, return the **minimum number of boats** needed.

## Examples

**Example 1:**
\`\`\`
Input: people = [1,2,2,3], limit = 5, k = 2
Output: 2
Explanation: (1+3=4), (2+2=4)
\`\`\`

**Example 2:**
\`\`\`
Input: people = [1,1,1,1,1], limit = 3, k = 3
Output: 2
Explanation: (1+1+1=3), (1+1=2)
\`\`\`

**Example 3:**
\`\`\`
Input: people = [3,3,3,3], limit = 5, k = 2
Output: 4
Explanation: Each person needs own boat (can't pair 3+3=6 > 5)
\`\`\`

## Constraints
- 1 <= people.length <= 5 * 10^4
- 1 <= people[i] <= limit <= 3 * 10^4
- 1 <= k <= 10`,
    starterCode: `def numRescueBoatsK(people, limit, k):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'When k=2, use two pointers like standard boats problem.' },
      { afterAttempt: 2, text: 'For general k, greedily fill each boat with lightest people that fit, starting with heaviest.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Greedy Two Pointers (for k=2) / General

\`\`\`python
def numRescueBoatsK(people, limit, k):
    people.sort()

    if k == 2:
        # Standard two-pointer approach
        boats = 0
        left, right = 0, len(people) - 1
        while left <= right:
            if people[left] + people[right] <= limit:
                left += 1
            right -= 1
            boats += 1
        return boats

    # General case: greedy bin packing
    boats = 0
    right = len(people) - 1

    while right >= 0:
        # Start new boat with heaviest remaining person
        remaining = limit - people[right]
        right -= 1
        count = 1

        # Add lightest people that fit
        left = 0
        added = []
        while count < k and left <= right and people[left] <= remaining:
            remaining -= people[left]
            added.append(left)
            left += 1
            count += 1

        # Mark added people (shift array or use visited set)
        # For simplicity, rebuild array
        people = [people[i] for i in range(right + 1) if i not in added]
        right = len(people) - 1
        boats += 1

    return boats
\`\`\`

## Optimized for k=2

\`\`\`python
def numRescueBoatsK(people, limit, k):
    if k >= 2:
        people.sort()
        boats = 0
        left, right = 0, len(people) - 1
        while left <= right:
            if people[left] + people[right] <= limit:
                left += 1
            right -= 1
            boats += 1
        return boats
\`\`\`

## Complexity
- Time: O(n log n) for k=2, O(n^2) worst case for general k
- Space: O(1) for k=2`
    },
    testCases: [
      { input: '[[1,2,2,3], 5, 2]', expected: '2' },
      { input: '[[1,1,1,1,1], 3, 3]', expected: '2' },
      { input: '[[3,3,3,3], 5, 2]', expected: '4' },
      { input: '[[1,2,3,4,5], 6, 2]', expected: '3' }
    ],
    solutionExplanation: 'For k=2, use two pointers. For general k, greedy bin packing.'
  },

  // ==================== GROUP 4: Greedy With Counting / Frequency ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-reduce-array-size-half',
    title: 'Reduce Array Size to Half',
    description: 'Remove minimum distinct numbers to halve array size',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Reduce Array Size to Half

You are given an integer array \`arr\`. You can choose a set of integers and remove all occurrences of these integers from the array.

Return the **minimum size of the set** so that at least half of the integers of the array are removed.

## Examples

**Example 1:**
\`\`\`
Input: arr = [3,3,3,3,5,5,5,2,2,7]
Output: 2
Explanation: Remove {3,7} → removes 3,3,3,3,7 = 5 elements (half of 10)
Or remove {3,5} → removes 3,3,3,3,5,5,5 = 7 elements
\`\`\`

**Example 2:**
\`\`\`
Input: arr = [7,7,7,7,7,7]
Output: 1
Explanation: Remove 7, all elements gone
\`\`\`

**Example 3:**
\`\`\`
Input: arr = [1,9]
Output: 1
Explanation: Remove either 1 or 9
\`\`\`

## Constraints
- 2 <= arr.length <= 10^5
- arr.length is even
- 1 <= arr[i] <= 10^5`,
    starterCode: `def minSetSize(arr):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Count frequencies. Removing high-frequency numbers removes more elements.' },
      { afterAttempt: 2, text: 'Sort frequencies in descending order. Greedily remove highest frequency numbers until half removed.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Greedy by Frequency

\`\`\`python
from collections import Counter

def minSetSize(arr):
    freq = Counter(arr)

    # Sort frequencies descending
    sorted_freq = sorted(freq.values(), reverse=True)

    target = len(arr) // 2
    removed = 0
    count = 0

    for f in sorted_freq:
        removed += f
        count += 1
        if removed >= target:
            return count

    return count
\`\`\`

## Key Insight
- To minimize numbers removed, maximize elements removed per number
- Remove numbers with highest frequency first

## Why This Works
- Each number we choose removes all its occurrences
- High-frequency numbers give best "bang for buck"
- Greedy: always pick the number that removes the most remaining elements

## Complexity
- Time: O(n log n) for sorting
- Space: O(n) for frequency map`
    },
    testCases: [
      { input: '[[3,3,3,3,5,5,5,2,2,7]]', expected: '2' },
      { input: '[[7,7,7,7,7,7]]', expected: '1' },
      { input: '[[1,9]]', expected: '1' },
      { input: '[[1,2,3,4,5,6,7,8,9,10]]', expected: '5' }
    ],
    solutionExplanation: 'Count frequencies, sort descending, greedily remove until half elements gone.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-reorganize-string',
    title: 'Reorganize String',
    description: 'Rearrange string so no two adjacent characters are same',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Reorganize String

Given a string s, rearrange the characters so that no two adjacent characters are the same.

Return any valid rearrangement, or "" if not possible.

## Examples

**Example 1:**
\`\`\`
Input: s = "aab"
Output: "aba"
\`\`\`

**Example 2:**
\`\`\`
Input: s = "aaab"
Output: ""
Explanation: No valid arrangement exists
\`\`\`

**Example 3:**
\`\`\`
Input: s = "aabb"
Output: "abab" or "baba"
\`\`\`

## Constraints
- 1 <= s.length <= 500
- s consists of lowercase English letters`,
    starterCode: `def reorganizeString(s):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'If any character appears more than (n+1)/2 times, it\'s impossible.' },
      { afterAttempt: 2, text: 'Use a max heap. Always place the most frequent character, then swap with second most frequent.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Max Heap Interleaving

\`\`\`python
import heapq
from collections import Counter

def reorganizeString(s):
    freq = Counter(s)

    # Check if possible
    max_freq = max(freq.values())
    if max_freq > (len(s) + 1) // 2:
        return ""

    # Max heap of (-count, char)
    heap = [(-count, char) for char, count in freq.items()]
    heapq.heapify(heap)

    result = []
    prev_count, prev_char = 0, ''

    while heap:
        count, char = heapq.heappop(heap)
        result.append(char)

        # Put previous char back (if it still has count)
        if prev_count < 0:
            heapq.heappush(heap, (prev_count, prev_char))

        prev_count = count + 1  # Used one
        prev_char = char

    return ''.join(result)
\`\`\`

## Alternative: Fill Even/Odd Positions

\`\`\`python
def reorganizeString(s):
    freq = Counter(s)
    max_freq = max(freq.values())
    if max_freq > (len(s) + 1) // 2:
        return ""

    # Sort by frequency descending
    chars = sorted(freq.keys(), key=lambda x: -freq[x])

    result = [''] * len(s)
    idx = 0

    for char in chars:
        for _ in range(freq[char]):
            result[idx] = char
            idx += 2
            if idx >= len(s):
                idx = 1  # Switch to odd positions

    return ''.join(result)
\`\`\`

## Complexity
- Time: O(n log k) where k is unique chars
- Space: O(n)`
    },
    testCases: [
      { input: '"aab"', expected: '"aba"' },
      { input: '"aaab"', expected: '""' },
      { input: '"aabb"', expected: '"abab"' },
      { input: '"vvvlo"', expected: '"vlvov"' }
    ],
    solutionExplanation: 'Use max heap to always place most frequent char, interleaving to avoid adjacency.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-least-unique-after-removals',
    title: 'Least Number of Unique Integers After K Removals',
    description: 'Remove k elements to minimize distinct integers',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Least Number of Unique Integers After K Removals

Given an array of integers \`arr\` and an integer \`k\`, return the **least number of unique integers** after removing exactly k elements.

## Examples

**Example 1:**
\`\`\`
Input: arr = [5,5,4], k = 1
Output: 1
Explanation: Remove one 4, only 5 remains (unique count = 1)
\`\`\`

**Example 2:**
\`\`\`
Input: arr = [4,3,1,1,3,3,2], k = 3
Output: 2
Explanation: Remove 4, 2, and one 1. Remaining: [1,3,3,3]. Unique = 2
\`\`\`

## Constraints
- 1 <= arr.length <= 10^5
- 1 <= arr[i] <= 10^9
- 0 <= k <= arr.length`,
    starterCode: `def findLeastNumOfUniqueInts(arr, k):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'To minimize unique count, we want to completely remove some numbers.' },
      { afterAttempt: 2, text: 'Remove numbers with lowest frequency first - they\'re cheapest to eliminate completely.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Remove Lowest Frequency First

\`\`\`python
from collections import Counter

def findLeastNumOfUniqueInts(arr, k):
    freq = Counter(arr)

    # Sort frequencies ascending
    sorted_freq = sorted(freq.values())

    unique_count = len(sorted_freq)

    for f in sorted_freq:
        if k >= f:
            k -= f
            unique_count -= 1
        else:
            break

    return unique_count
\`\`\`

## Key Insight
- Each number has a "cost" to remove = its frequency
- We want to remove as many numbers as possible
- Low frequency numbers are cheapest to remove entirely

## Why This Works
- Removing some but not all occurrences doesn't reduce unique count
- Must remove all occurrences of a number to reduce unique count
- Greedy: remove cheapest (lowest frequency) numbers first

## Complexity
- Time: O(n log n) for sorting
- Space: O(n) for frequency map`
    },
    testCases: [
      { input: '[[5,5,4], 1]', expected: '1' },
      { input: '[[4,3,1,1,3,3,2], 3]', expected: '2' },
      { input: '[[1,1,1,1], 2]', expected: '1' },
      { input: '[[1,2,3,4], 4]', expected: '0' }
    ],
    solutionExplanation: 'Sort frequencies ascending, remove lowest frequency numbers first.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-hand-of-straights',
    title: 'Hand of Straights',
    description: 'Check if cards can form groups of consecutive numbers',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Hand of Straights

You are given an integer array \`hand\` where \`hand[i]\` is the value of the i-th card. You want to rearrange cards into groups where each group has \`groupSize\` consecutive cards.

Return \`true\` if possible, \`false\` otherwise.

## Examples

**Example 1:**
\`\`\`
Input: hand = [1,2,3,6,2,3,4,7,8], groupSize = 3
Output: true
Explanation: Groups: [1,2,3], [2,3,4], [6,7,8]
\`\`\`

**Example 2:**
\`\`\`
Input: hand = [1,2,3,4,5], groupSize = 4
Output: false
Explanation: 5 cards can't form groups of 4
\`\`\`

## Constraints
- 1 <= hand.length <= 10^4
- 0 <= hand[i] <= 10^9
- 1 <= groupSize <= hand.length`,
    starterCode: `def isNStraightHand(hand, groupSize):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'If len(hand) % groupSize != 0, impossible.' },
      { afterAttempt: 2, text: 'Process cards in sorted order. For each smallest card, try to form a group starting with it.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Greedy Group Formation

\`\`\`python
from collections import Counter

def isNStraightHand(hand, groupSize):
    if len(hand) % groupSize != 0:
        return False

    freq = Counter(hand)

    for card in sorted(freq.keys()):
        count = freq[card]
        if count > 0:
            # Start groups with this card
            for i in range(groupSize):
                if freq[card + i] < count:
                    return False
                freq[card + i] -= count

    return True
\`\`\`

## Key Insight
- Process cards in ascending order
- Each smallest unused card must start a group
- Use all copies of smallest card to start groups

## Why This Works
- Smallest card can only be at start of a group
- If smallest card has count C, we need C groups starting here
- Each group needs the next (groupSize-1) consecutive cards

## Complexity
- Time: O(n log n) for sorting
- Space: O(n) for frequency map`
    },
    testCases: [
      { input: '[[1,2,3,6,2,3,4,7,8], 3]', expected: 'true' },
      { input: '[[1,2,3,4,5], 4]', expected: 'false' },
      { input: '[[1,2,3], 1]', expected: 'true' },
      { input: '[[1,1,2,2,3,3], 3]', expected: 'true' }
    ],
    solutionExplanation: 'Sort and process from smallest. Each smallest card starts a group, need consecutive cards.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-divide-array-consecutive',
    title: 'Divide Array Into Consecutive Subsequences',
    description: 'Split array into subsequences of 3+ consecutive integers',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Divide Array Into Consecutive Subsequences

Given an integer array \`nums\` sorted in non-decreasing order, return \`true\` if it can be split into one or more subsequences such that:

1. Each subsequence consists of consecutive integers
2. Each subsequence has length at least 3

## Examples

**Example 1:**
\`\`\`
Input: nums = [1,2,3,3,4,5]
Output: true
Explanation: [1,2,3] and [3,4,5]
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1,2,3,3,4,4,5,5]
Output: true
Explanation: [1,2,3,4,5] and [3,4,5]
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [1,2,3,4,4,5]
Output: false
Explanation: Cannot form valid subsequences
\`\`\`

## Constraints
- 1 <= nums.length <= 10^4
- -1000 <= nums[i] <= 1000
- nums is sorted in non-decreasing order`,
    starterCode: `def isPossible(nums):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'For each number, decide: extend an existing subsequence or start a new one?' },
      { afterAttempt: 2, text: 'Track both remaining counts and number of subsequences ending at each value. Prefer extending over starting new.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Greedy with Subsequence Tracking

\`\`\`python
from collections import Counter

def isPossible(nums):
    freq = Counter(nums)       # Available count of each number
    need = Counter()           # Count of subsequences needing each number

    for num in nums:
        if freq[num] == 0:
            continue

        if need[num] > 0:
            # Extend existing subsequence
            need[num] -= 1
            need[num + 1] += 1
        elif freq[num + 1] > 0 and freq[num + 2] > 0:
            # Start new subsequence of length 3
            freq[num + 1] -= 1
            freq[num + 2] -= 1
            need[num + 3] += 1
        else:
            # Cannot use this number
            return False

        freq[num] -= 1

    return True
\`\`\`

## Key Insight
- Priority 1: Extend existing subsequence (they already have length >= 3)
- Priority 2: Start new subsequence of length 3
- If neither possible, fail

## Why Extend First?
- Extending doesn't consume future numbers
- Starting new needs 2 more consecutive numbers
- Extending is "cheaper" in terms of remaining flexibility

## Complexity
- Time: O(n)
- Space: O(n)`
    },
    testCases: [
      { input: '[[1,2,3,3,4,5]]', expected: 'true' },
      { input: '[[1,2,3,3,4,4,5,5]]', expected: 'true' },
      { input: '[[1,2,3,4,4,5]]', expected: 'false' },
      { input: '[[1,2,3]]', expected: 'true' }
    ],
    solutionExplanation: 'Greedily extend existing subsequences or start new length-3 subsequences.'
  },

  // ==================== GROUP 5: Greedy on Values / Math ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-gas-station',
    title: 'Gas Station',
    description: 'Find starting station to complete circular route',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Gas Station

There are n gas stations along a circular route. At station i:
- You get \`gas[i]\` units of gas
- It costs \`cost[i]\` units to travel to next station

Starting with an empty tank, return the starting station index if you can complete the circuit, or -1 if impossible.

If a solution exists, it is guaranteed to be unique.

## Examples

**Example 1:**
\`\`\`
Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
Output: 3
Explanation: Start at station 3:
- Station 3: tank = 0 + 4 - 1 = 3
- Station 4: tank = 3 + 5 - 2 = 6
- Station 0: tank = 6 + 1 - 3 = 4
- Station 1: tank = 4 + 2 - 4 = 2
- Station 2: tank = 2 + 3 - 5 = 0
\`\`\`

**Example 2:**
\`\`\`
Input: gas = [2,3,4], cost = [3,4,3]
Output: -1
Explanation: Total gas < total cost, impossible
\`\`\`

## Constraints
- n == gas.length == cost.length
- 1 <= n <= 10^5
- 0 <= gas[i], cost[i] <= 10^4`,
    starterCode: `def canCompleteCircuit(gas, cost):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'If total gas >= total cost, a solution exists. But which starting point?' },
      { afterAttempt: 2, text: 'If you can\'t reach station j from i, you also can\'t reach j from any station between i and j. Start fresh from j+1.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Single Pass Greedy

\`\`\`python
def canCompleteCircuit(gas, cost):
    total_tank = 0
    current_tank = 0
    start = 0

    for i in range(len(gas)):
        diff = gas[i] - cost[i]
        total_tank += diff
        current_tank += diff

        if current_tank < 0:
            # Can't reach i+1 from start, reset
            start = i + 1
            current_tank = 0

    return start if total_tank >= 0 else -1
\`\`\`

## Key Insight
- If total_gas >= total_cost, solution exists
- If we fail at station j starting from i, all stations between i and j also fail
- Why? They would have even less gas when reaching j

## Why This Works
- We try starting from 0
- If we run out at station j, we restart from j+1
- At the end, if total_gas >= total_cost, our final start position works

## Complexity
- Time: O(n)
- Space: O(1)`
    },
    testCases: [
      { input: '[[1,2,3,4,5], [3,4,5,1,2]]', expected: '3' },
      { input: '[[2,3,4], [3,4,3]]', expected: '-1' },
      { input: '[[5,1,2,3,4], [4,4,1,5,1]]', expected: '4' },
      { input: '[[1], [1]]', expected: '0' }
    ],
    solutionExplanation: 'Single pass: if tank goes negative, restart from next station. Check total feasibility.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-jump-game',
    title: 'Jump Game',
    description: 'Determine if you can reach the last index',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Jump Game

You are given an integer array \`nums\`. You start at the first index, and each element represents your maximum jump length at that position.

Return \`true\` if you can reach the last index, \`false\` otherwise.

## Examples

**Example 1:**
\`\`\`
Input: nums = [2,3,1,1,4]
Output: true
Explanation: Jump 1 step from 0 to 1, then 3 steps to last index
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [3,2,1,0,4]
Output: false
Explanation: Always reach index 3 with 0 jump length, stuck
\`\`\`

## Constraints
- 1 <= nums.length <= 10^4
- 0 <= nums[i] <= 10^5`,
    starterCode: `def canJump(nums):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Track the furthest index you can reach. If you can\'t reach current index, return false.' },
      { afterAttempt: 2, text: 'At each position, update max_reach = max(max_reach, i + nums[i]). If max_reach >= last index, return true.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Greedy Max Reach

\`\`\`python
def canJump(nums):
    max_reach = 0

    for i in range(len(nums)):
        if i > max_reach:
            return False  # Can't reach this index
        max_reach = max(max_reach, i + nums[i])
        if max_reach >= len(nums) - 1:
            return True

    return True
\`\`\`

## Key Insight
- Track furthest reachable index at each step
- If current index > max_reach, we're stuck
- If max_reach >= last index, we can reach it

## Why This Works
- We don't care about the path, just reachability
- At each reachable position, we extend our reach
- Greedy: always jump as far as possible (conceptually)

## Complexity
- Time: O(n)
- Space: O(1)`
    },
    testCases: [
      { input: '[[2,3,1,1,4]]', expected: 'true' },
      { input: '[[3,2,1,0,4]]', expected: 'false' },
      { input: '[[0]]', expected: 'true' },
      { input: '[[2,0,0]]', expected: 'true' }
    ],
    solutionExplanation: 'Track max reachable index. If current index exceeds max reach, return false.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-jump-game-ii',
    title: 'Jump Game II',
    description: 'Find minimum jumps to reach the last index',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Jump Game II

You are given a 0-indexed array of integers \`nums\` of length n. You start at index 0 and want to reach index n-1.

In one jump, you can move at most \`nums[i]\` positions forward from index i.

Return the **minimum number of jumps** to reach the last index. Assume you can always reach it.

## Examples

**Example 1:**
\`\`\`
Input: nums = [2,3,1,1,4]
Output: 2
Explanation: Jump 1 step to index 1, then 3 steps to last index
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [2,3,0,1,4]
Output: 2
\`\`\`

## Constraints
- 1 <= nums.length <= 10^4
- 0 <= nums[i] <= 1000
- It's guaranteed you can reach nums[n-1]`,
    starterCode: `def jump(nums):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Think of it as BFS levels. Each "level" is positions reachable with same number of jumps.' },
      { afterAttempt: 2, text: 'Track current jump\'s boundary and next jump\'s max reach. When you pass boundary, increment jumps.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Greedy BFS-like

\`\`\`python
def jump(nums):
    n = len(nums)
    if n <= 1:
        return 0

    jumps = 0
    current_end = 0    # End of current jump range
    farthest = 0       # Farthest we can reach

    for i in range(n - 1):  # Don't need to jump from last index
        farthest = max(farthest, i + nums[i])

        if i == current_end:
            # Must jump now
            jumps += 1
            current_end = farthest

            if current_end >= n - 1:
                break

    return jumps
\`\`\`

## Key Insight
- current_end marks how far we can go with current number of jumps
- When we reach current_end, we MUST take another jump
- farthest tracks best destination for next jump

## Why This Works
- At each "level" (same jump count), we explore all positions
- We find the farthest reachable position for next level
- This is greedy BFS - always extend as far as possible

## Complexity
- Time: O(n)
- Space: O(1)`
    },
    testCases: [
      { input: '[[2,3,1,1,4]]', expected: '2' },
      { input: '[[2,3,0,1,4]]', expected: '2' },
      { input: '[[1,1,1,1]]', expected: '3' },
      { input: '[[1]]', expected: '0' }
    ],
    solutionExplanation: 'BFS-like greedy: track current range end, count jumps when boundary reached.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-wiggle-subsequence',
    title: 'Wiggle Subsequence',
    description: 'Find longest alternating difference subsequence',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Wiggle Subsequence

A wiggle sequence is a sequence where differences between successive numbers strictly alternate between positive and negative.

- [1,7,4,9,2,5] is wiggle: differences are +6,-3,+5,-7,+3
- [1,4,7,2,5] is not: differences +3,+3,-5,+3 (two positives in a row)

Given an integer array \`nums\`, return the length of the longest wiggle subsequence.

## Examples

**Example 1:**
\`\`\`
Input: nums = [1,7,4,9,2,5]
Output: 6
Explanation: Entire array is a wiggle sequence
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1,17,5,10,13,15,10,5,16,8]
Output: 7
Explanation: [1,17,5,15,5,16,8] with differences +16,-12,+10,-10,+11,-8
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [1,2,3,4,5,6,7,8,9]
Output: 2
Explanation: Any two different elements form a wiggle
\`\`\`

## Constraints
- 1 <= nums.length <= 1000
- 0 <= nums[i] <= 1000`,
    starterCode: `def wiggleMaxLength(nums):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Count the "peaks" and "valleys" in the array.' },
      { afterAttempt: 2, text: 'Track whether last difference was up or down. Count direction changes.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Count Direction Changes

\`\`\`python
def wiggleMaxLength(nums):
    n = len(nums)
    if n < 2:
        return n

    up = 1    # Length ending with up movement
    down = 1  # Length ending with down movement

    for i in range(1, n):
        if nums[i] > nums[i-1]:
            up = down + 1
        elif nums[i] < nums[i-1]:
            down = up + 1
        # If equal, no change

    return max(up, down)
\`\`\`

## Key Insight
- At each position, we can either go up or down from previous
- up = max length ending in upward movement
- down = max length ending in downward movement

## Why This Works
- When we go up, we extend the best "down" sequence
- When we go down, we extend the best "up" sequence
- Equal elements don't change anything

## Alternative: Peak/Valley Counting

\`\`\`python
def wiggleMaxLength(nums):
    if len(nums) < 2:
        return len(nums)

    count = 1
    prev_diff = 0

    for i in range(1, len(nums)):
        diff = nums[i] - nums[i-1]
        if (diff > 0 and prev_diff <= 0) or (diff < 0 and prev_diff >= 0):
            count += 1
            prev_diff = diff

    return count
\`\`\`

## Complexity
- Time: O(n)
- Space: O(1)`
    },
    testCases: [
      { input: '[[1,7,4,9,2,5]]', expected: '6' },
      { input: '[[1,17,5,10,13,15,10,5,16,8]]', expected: '7' },
      { input: '[[1,2,3,4,5,6,7,8,9]]', expected: '2' },
      { input: '[[1]]', expected: '1' }
    ],
    solutionExplanation: 'Track up/down sequence lengths. When direction changes, extend the opposite.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-partition-labels',
    title: 'Partition Labels',
    description: 'Partition string so each letter appears in only one part',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Partition Labels

You are given a string s. Partition s into as many parts as possible so that each letter appears in at most one part.

Return a list of integers representing the size of each part.

## Examples

**Example 1:**
\`\`\`
Input: s = "ababcbacadefegdehijhklij"
Output: [9,7,8]
Explanation:
- "ababcbaca" - a,b,c appear only here
- "defegde" - d,e,f,g appear only here
- "hijhklij" - h,i,j,k,l appear only here
\`\`\`

**Example 2:**
\`\`\`
Input: s = "eccbbbbdec"
Output: [10]
Explanation: All letters are interleaved
\`\`\`

## Constraints
- 1 <= s.length <= 500
- s consists of lowercase English letters`,
    starterCode: `def partitionLabels(s):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'First, find the last occurrence of each character.' },
      { afterAttempt: 2, text: 'Scan left to right. Current partition must extend to last occurrence of all chars seen so far.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Greedy Partition

\`\`\`python
def partitionLabels(s):
    # Find last occurrence of each character
    last = {c: i for i, c in enumerate(s)}

    result = []
    start = 0
    end = 0

    for i, c in enumerate(s):
        end = max(end, last[c])  # Extend partition to include last occurrence

        if i == end:
            # End of current partition
            result.append(end - start + 1)
            start = i + 1

    return result
\`\`\`

## Key Insight
- For each character, partition must include its last occurrence
- As we scan, we extend partition end to cover all characters seen
- When current position equals end, we've found a valid partition

## Why This Works
- A partition is valid when all chars inside have no occurrence outside
- We greedily end partition as soon as possible
- end tracks the minimum required partition boundary

## Complexity
- Time: O(n)
- Space: O(1) - at most 26 characters`
    },
    testCases: [
      { input: '"ababcbacadefegdehijhklij"', expected: '[9,7,8]' },
      { input: '"eccbbbbdec"', expected: '[10]' },
      { input: '"abc"', expected: '[1,1,1]' },
      { input: '"abcabc"', expected: '[6]' }
    ],
    solutionExplanation: 'Find last occurrence of each char, greedily partition when all chars are contained.'
  },

  // ==================== GROUP 6: Greedy + Sorting + Logic ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-queue-reconstruction-height',
    title: 'Queue Reconstruction by Height',
    description: 'Reconstruct queue from height and position hints',
    targetComplexity: { time: 'O(n^2)', space: 'O(n)' },
    instruction: `# Queue Reconstruction by Height

You are given an array \`people\` where \`people[i] = [h, k]\`:
- h = height of person
- k = number of people in front who have height >= h

Reconstruct the queue and return it.

## Examples

**Example 1:**
\`\`\`
Input: people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]
Output: [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]
\`\`\`

**Example 2:**
\`\`\`
Input: people = [[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]
Output: [[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]
\`\`\`

## Constraints
- 1 <= people.length <= 2000
- 0 <= h <= 10^6
- 0 <= k < people.length`,
    starterCode: `def reconstructQueue(people):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Process people in a specific order. Which people should be placed first?' },
      { afterAttempt: 2, text: 'Sort by height descending, then by k ascending. Insert each person at index k.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Sort + Insert

\`\`\`python
def reconstructQueue(people):
    # Sort by height desc, then by k asc
    people.sort(key=lambda x: (-x[0], x[1]))

    result = []
    for person in people:
        # Insert at index k
        result.insert(person[1], person)

    return result
\`\`\`

## Why This Works
- Process tallest people first
- When inserting a tall person at index k, shorter people don't affect their k value
- Shorter people inserted later slide around tall people correctly

## Example Walkthrough
people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]

Sorted: [[7,0],[7,1],[6,1],[5,0],[5,2],[4,4]]

1. Insert [7,0] at 0: [[7,0]]
2. Insert [7,1] at 1: [[7,0],[7,1]]
3. Insert [6,1] at 1: [[7,0],[6,1],[7,1]]
4. Insert [5,0] at 0: [[5,0],[7,0],[6,1],[7,1]]
5. Insert [5,2] at 2: [[5,0],[7,0],[5,2],[6,1],[7,1]]
6. Insert [4,4] at 4: [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]

## Complexity
- Time: O(n^2) due to list insertions
- Space: O(n)`
    },
    testCases: [
      { input: '[[[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]]', expected: '[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]' },
      { input: '[[[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]]', expected: '[[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]' },
      { input: '[[[1,0]]]', expected: '[[1,0]]' },
      { input: '[[[2,0],[1,0]]]', expected: '[[1,0],[2,0]]' }
    ],
    solutionExplanation: 'Sort by height desc, k asc. Insert each person at their k index.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-car-fleet',
    title: 'Car Fleet',
    description: 'Count number of car fleets arriving at destination',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Car Fleet

There are n cars going to the same destination on a one-lane road.

You are given:
- \`target\`: the destination position
- \`position\`: position[i] is position of car i
- \`speed\`: speed[i] is speed of car i

A car can never pass another car but can catch up and join a "fleet" that travels at the slower speed.

Return the **number of car fleets** that arrive at the destination.

## Examples

**Example 1:**
\`\`\`
Input: target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]
Output: 3
Explanation:
- Car at 10 reaches at time (12-10)/2 = 1
- Car at 8 reaches at time (12-8)/4 = 1, same fleet
- Car at 0 reaches at time 12/1 = 12
- Car at 5 reaches at time 7/1 = 7
- Car at 3 reaches at time 9/3 = 3
Fleet 1: [10,8], Fleet 2: [0], Fleet 3: [5,3]
\`\`\`

**Example 2:**
\`\`\`
Input: target = 10, position = [3], speed = [3]
Output: 1
\`\`\`

## Constraints
- n == position.length == speed.length
- 1 <= n <= 10^5
- 0 < target <= 10^6
- 0 <= position[i] < target
- 0 < speed[i] <= 10^6`,
    starterCode: `def carFleet(target, position, speed):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Calculate time to reach target for each car. Process cars from closest to target.' },
      { afterAttempt: 2, text: 'Sort by position descending. A car forms a new fleet if its time > previous fleet\'s time.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Stack/Monotonic Time

\`\`\`python
def carFleet(target, position, speed):
    # Pair and sort by position descending
    cars = sorted(zip(position, speed), reverse=True)

    fleets = 0
    prev_time = 0

    for pos, spd in cars:
        time = (target - pos) / spd

        if time > prev_time:
            # This car is slower, forms new fleet
            fleets += 1
            prev_time = time

    return fleets
\`\`\`

## Key Insight
- Car closer to target cannot be passed
- If car behind has shorter arrival time, it joins the fleet ahead
- If car behind has longer time, it forms its own fleet

## Why Process from Front?
- Front car's time is fixed (nothing ahead to slow it)
- Each subsequent car either:
  - Catches up (time <= prev_time) → joins fleet
  - Stays behind (time > prev_time) → new fleet

## Complexity
- Time: O(n log n) for sorting
- Space: O(n) for sorted array`
    },
    testCases: [
      { input: '[12, [10,8,0,5,3], [2,4,1,1,3]]', expected: '3' },
      { input: '[10, [3], [3]]', expected: '1' },
      { input: '[100, [0,2,4], [4,2,1]]', expected: '1' },
      { input: '[10, [6,8], [3,2]]', expected: '2' }
    ],
    solutionExplanation: 'Sort by position desc, count cars with time > previous (form new fleets).'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-minimum-cost-connect-sticks',
    title: 'Minimum Cost to Connect Sticks',
    description: 'Combine sticks with minimum cost',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Minimum Cost to Connect Sticks

You have n sticks of various lengths. You can connect any two sticks of lengths x and y with cost x + y. After connecting, you get one stick of length x + y.

Return the **minimum cost** to connect all sticks into one.

## Examples

**Example 1:**
\`\`\`
Input: sticks = [2,4,3]
Output: 14
Explanation:
- Connect 2 and 3 for cost 5. sticks = [5,4]
- Connect 5 and 4 for cost 9. sticks = [9]
Total = 5 + 9 = 14
\`\`\`

**Example 2:**
\`\`\`
Input: sticks = [1,8,3,5]
Output: 30
Explanation:
- Connect 1 and 3 for 4. sticks = [4,8,5]
- Connect 4 and 5 for 9. sticks = [9,8]
- Connect 9 and 8 for 17. sticks = [17]
Total = 4 + 9 + 17 = 30
\`\`\`

## Constraints
- 1 <= sticks.length <= 10^4
- 1 <= sticks[i] <= 10^4`,
    starterCode: `def connectSticks(sticks):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Like Huffman encoding. What should you combine first to minimize total cost?' },
      { afterAttempt: 2, text: 'Always combine two smallest sticks. Use a min heap.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Min Heap (Huffman)

\`\`\`python
import heapq

def connectSticks(sticks):
    if len(sticks) <= 1:
        return 0

    heapq.heapify(sticks)
    total_cost = 0

    while len(sticks) > 1:
        # Get two smallest
        first = heapq.heappop(sticks)
        second = heapq.heappop(sticks)

        cost = first + second
        total_cost += cost

        # Put combined stick back
        heapq.heappush(sticks, cost)

    return total_cost
\`\`\`

## Why Combine Smallest First?
- Smaller sticks get combined early
- They become part of larger sticks that get combined again
- Total cost = sum of (stick_length × number_of_times_involved)
- Smaller sticks should be involved more times → combine early

## This is Huffman Coding!
- Same algorithm as building Huffman tree
- Minimizes weighted path length

## Complexity
- Time: O(n log n)
- Space: O(n) for heap`
    },
    testCases: [
      { input: '[[2,4,3]]', expected: '14' },
      { input: '[[1,8,3,5]]', expected: '30' },
      { input: '[[5]]', expected: '0' },
      { input: '[[1,1,1,1]]', expected: '8' }
    ],
    solutionExplanation: 'Use min heap, always combine two smallest sticks (Huffman algorithm).'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-maximum-units-truck',
    title: 'Maximum Units on a Truck',
    description: 'Load boxes to maximize total units',
    targetComplexity: { time: 'O(n log n)', space: 'O(1)' },
    instruction: `# Maximum Units on a Truck

You are given a 2D array \`boxTypes\` where \`boxTypes[i] = [numberOfBoxes, unitsPerBox]\`:
- numberOfBoxes: count of boxes of this type
- unitsPerBox: units in each box

You have a truck with \`truckSize\` maximum box capacity.

Return the **maximum total units** you can put on the truck.

## Examples

**Example 1:**
\`\`\`
Input: boxTypes = [[1,3],[2,2],[3,1]], truckSize = 4
Output: 8
Explanation:
- 1 box of 3 units
- 2 boxes of 2 units
- 1 box of 1 unit
Total = 3 + 4 + 1 = 8 units (4 boxes)
\`\`\`

**Example 2:**
\`\`\`
Input: boxTypes = [[5,10],[2,5],[4,7],[3,9]], truckSize = 10
Output: 91
\`\`\`

## Constraints
- 1 <= boxTypes.length <= 1000
- 1 <= numberOfBoxes, unitsPerBox <= 1000
- 1 <= truckSize <= 10^6`,
    starterCode: `def maximumUnits(boxTypes, truckSize):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Each box takes 1 unit of truck space. Which boxes should we prioritize?' },
      { afterAttempt: 2, text: 'Sort by unitsPerBox descending. Load boxes with most units first.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Greedy by Units Per Box

\`\`\`python
def maximumUnits(boxTypes, truckSize):
    # Sort by units per box descending
    boxTypes.sort(key=lambda x: -x[1])

    total_units = 0
    remaining = truckSize

    for count, units in boxTypes:
        take = min(count, remaining)
        total_units += take * units
        remaining -= take

        if remaining == 0:
            break

    return total_units
\`\`\`

## Key Insight
- All boxes take same truck space (1 slot)
- We want maximum units per slot
- Greedy: load highest unit boxes first

## Why This Works
- No tradeoff between box types (all same size)
- Simply prioritize by value (units)
- Classic fractional knapsack scenario

## Complexity
- Time: O(n log n) for sorting
- Space: O(1)`
    },
    testCases: [
      { input: '[[[1,3],[2,2],[3,1]], 4]', expected: '8' },
      { input: '[[[5,10],[2,5],[4,7],[3,9]], 10]', expected: '91' },
      { input: '[[[1,1]], 1]', expected: '1' },
      { input: '[[[2,1],[3,2]], 3]', expected: '5' }
    ],
    solutionExplanation: 'Sort by units descending, greedily load highest-unit boxes first.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-bag-of-tokens',
    title: 'Bag of Tokens',
    description: 'Maximize score by playing tokens strategically',
    targetComplexity: { time: 'O(n log n)', space: 'O(1)' },
    instruction: `# Bag of Tokens

You have tokens with values and initial power. Each token can be played in two ways:

- **Face up**: If power >= token value, gain 1 score, lose token value in power
- **Face down**: If score >= 1, lose 1 score, gain token value in power

Return the **maximum score** achievable.

## Examples

**Example 1:**
\`\`\`
Input: tokens = [100], power = 50
Output: 0
Explanation: Can't play face up (50 < 100), can't play face down (score = 0)
\`\`\`

**Example 2:**
\`\`\`
Input: tokens = [100,200], power = 150
Output: 1
Explanation: Play token 0 face up: power=50, score=1
\`\`\`

**Example 3:**
\`\`\`
Input: tokens = [100,200,300,400], power = 200
Output: 2
Explanation:
- Play 100 face up: power=100, score=1
- Play 400 face down: power=500, score=0
- Play 200 face up: power=300, score=1
- Play 300 face up: power=0, score=2
\`\`\`

## Constraints
- 0 <= tokens.length <= 1000
- 0 <= tokens[i], power < 10^4`,
    starterCode: `def bagOfTokensScore(tokens, power):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'To maximize score, gain score with cheap tokens, gain power with expensive tokens.' },
      { afterAttempt: 2, text: 'Sort tokens. Two pointers: play smallest face up for score, largest face down for power.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Two Pointers

\`\`\`python
def bagOfTokensScore(tokens, power):
    tokens.sort()

    score = 0
    max_score = 0
    left = 0
    right = len(tokens) - 1

    while left <= right:
        if power >= tokens[left]:
            # Play smallest face up for score
            power -= tokens[left]
            score += 1
            left += 1
            max_score = max(max_score, score)
        elif score > 0:
            # Play largest face down for power
            power += tokens[right]
            score -= 1
            right -= 1
        else:
            break

    return max_score
\`\`\`

## Strategy
1. Sort tokens by value
2. Use small tokens for score (cheap to buy)
3. Use large tokens for power (good exchange rate)
4. Stop when can't make progress

## Why This Works
- Small tokens are efficient for gaining score (low power cost)
- Large tokens are efficient for gaining power (high power gain)
- We maximize score, so prioritize face up when possible

## Complexity
- Time: O(n log n) for sorting
- Space: O(1)`
    },
    testCases: [
      { input: '[[100], 50]', expected: '0' },
      { input: '[[100,200], 150]', expected: '1' },
      { input: '[[100,200,300,400], 200]', expected: '2' },
      { input: '[[], 100]', expected: '0' }
    ],
    solutionExplanation: 'Sort tokens, two pointers: buy score with small tokens, buy power with large tokens.'
  },

  // ==================== GROUP 7: Advanced Greedy / Hybrid ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-candy',
    title: 'Candy',
    description: 'Distribute minimum candies based on ratings',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Candy

There are n children standing in a line with ratings. You want to distribute candies following these rules:

1. Each child must have at least one candy
2. Children with higher rating get more candies than their neighbors

Return the **minimum total candies** needed.

## Examples

**Example 1:**
\`\`\`
Input: ratings = [1,0,2]
Output: 5
Explanation: Candies = [2,1,2]
\`\`\`

**Example 2:**
\`\`\`
Input: ratings = [1,2,2]
Output: 4
Explanation: Candies = [1,2,1]
(Third child doesn't need more than second - same rating)
\`\`\`

## Constraints
- n == ratings.length
- 1 <= n <= 2 * 10^4
- 0 <= ratings[i] <= 2 * 10^4`,
    starterCode: `def candy(ratings):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Two passes: left-to-right for left neighbors, right-to-left for right neighbors.' },
      { afterAttempt: 2, text: 'First pass: if rating[i] > rating[i-1], candy[i] = candy[i-1] + 1. Second pass: similar for right.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Two Pass

\`\`\`python
def candy(ratings):
    n = len(ratings)
    candies = [1] * n

    # Left to right: satisfy left neighbor
    for i in range(1, n):
        if ratings[i] > ratings[i-1]:
            candies[i] = candies[i-1] + 1

    # Right to left: satisfy right neighbor
    for i in range(n-2, -1, -1):
        if ratings[i] > ratings[i+1]:
            candies[i] = max(candies[i], candies[i+1] + 1)

    return sum(candies)
\`\`\`

## Key Insight
- Each child has constraints from both neighbors
- Left pass ensures left constraints
- Right pass ensures right constraints
- Take maximum to satisfy both

## Why This Works
- After left pass: each child has more than left neighbor if needed
- After right pass: additionally has more than right neighbor if needed
- Both constraints satisfied with minimum candies

## Complexity
- Time: O(n)
- Space: O(n) for candies array`
    },
    testCases: [
      { input: '[[1,0,2]]', expected: '5' },
      { input: '[[1,2,2]]', expected: '4' },
      { input: '[[1,3,2,2,1]]', expected: '7' },
      { input: '[[1]]', expected: '1' }
    ],
    solutionExplanation: 'Two passes: left-to-right then right-to-left, take max to satisfy both neighbors.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-minimum-cost-move-chips',
    title: 'Minimum Cost to Move Chips',
    description: 'Move all chips to same position with minimum cost',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Minimum Cost to Move Chips

You have chips at positions. Moving a chip:
- 2 positions left or right costs 0
- 1 position left or right costs 1

Return the **minimum cost** to move all chips to the same position.

## Examples

**Example 1:**
\`\`\`
Input: position = [1,2,3]
Output: 1
Explanation:
- Move chip at 1 to 3 (cost 0, distance 2)
- Move chip at 2 to 3 (cost 1, distance 1)
Total cost = 1
\`\`\`

**Example 2:**
\`\`\`
Input: position = [2,2,2,3,3]
Output: 2
Explanation: Move 2 chips from position 3 to position 2 (cost 1 each)
\`\`\`

## Constraints
- 1 <= position.length <= 100
- 1 <= position[i] <= 10^9`,
    starterCode: `def minCostToMoveChips(position):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Moving by 2 is free. What matters is parity (odd/even position).' },
      { afterAttempt: 2, text: 'All odd positions can merge for free, all even positions can merge for free. Then move smaller group.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Count Parity

\`\`\`python
def minCostToMoveChips(position):
    odd_count = sum(1 for p in position if p % 2 == 1)
    even_count = len(position) - odd_count

    return min(odd_count, even_count)
\`\`\`

## Key Insight
- Moving by 2 costs 0, so all chips at odd positions can merge for free
- Same for even positions
- Then we have two groups: all odds at one position, all evens at another
- Move smaller group to larger (each costs 1)

## Why This Works
- Position value doesn't matter, only parity
- Free moves maintain parity
- Cost 1 move changes parity
- Minimum moves = smaller of two parity counts

## Complexity
- Time: O(n)
- Space: O(1)`
    },
    testCases: [
      { input: '[[1,2,3]]', expected: '1' },
      { input: '[[2,2,2,3,3]]', expected: '2' },
      { input: '[[1,1000000000]]', expected: '1' },
      { input: '[[2,2,2]]', expected: '0' }
    ],
    solutionExplanation: 'Count odd and even positions. Move smaller group to larger (min of two counts).'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-split-balanced-strings',
    title: 'Split a String in Balanced Strings',
    description: 'Maximum number of balanced LR substrings',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Split a String in Balanced Strings

Balanced strings have equal number of 'L' and 'R' characters.

Given a balanced string s, split it into the **maximum number of balanced substrings**.

Return the maximum number of balanced strings.

## Examples

**Example 1:**
\`\`\`
Input: s = "RLRRLLRLRL"
Output: 4
Explanation: "RL", "RRLL", "RL", "RL"
\`\`\`

**Example 2:**
\`\`\`
Input: s = "RLLLLRRRLR"
Output: 3
Explanation: "RL", "LLLRRR", "LR"
\`\`\`

**Example 3:**
\`\`\`
Input: s = "LLLLRRRR"
Output: 1
Explanation: "LLLLRRRR"
\`\`\`

## Constraints
- 1 <= s.length <= 1000
- s[i] is either 'L' or 'R'
- s is a balanced string`,
    starterCode: `def balancedStringSplit(s):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Greedily split as soon as you have a balanced prefix.' },
      { afterAttempt: 2, text: 'Track balance: +1 for R, -1 for L. Split when balance = 0.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Greedy Balance Counting

\`\`\`python
def balancedStringSplit(s):
    balance = 0
    count = 0

    for c in s:
        if c == 'R':
            balance += 1
        else:
            balance -= 1

        if balance == 0:
            count += 1

    return count
\`\`\`

## Key Insight
- Balance = 0 means equal L's and R's seen so far
- Greedy: split immediately when balanced
- This maximizes number of splits

## Why This Works
- Making split earlier never prevents future splits
- Waiting to split might combine balanced parts unnecessarily
- Each balance = 0 point is a valid split point

## Complexity
- Time: O(n)
- Space: O(1)`
    },
    testCases: [
      { input: '"RLRRLLRLRL"', expected: '4' },
      { input: '"RLLLLRRRLR"', expected: '3' },
      { input: '"LLLLRRRR"', expected: '1' },
      { input: '"RL"', expected: '1' }
    ],
    solutionExplanation: 'Track balance (+1 R, -1 L). Count splits when balance = 0.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-remove-duplicate-letters',
    title: 'Remove Duplicate Letters',
    description: 'Return smallest lexicographic string with unique letters',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Remove Duplicate Letters

Given a string s, remove duplicate letters so that every letter appears once and only once. Return the **lexicographically smallest** result.

## Examples

**Example 1:**
\`\`\`
Input: s = "bcabc"
Output: "abc"
\`\`\`

**Example 2:**
\`\`\`
Input: s = "cbacdcbc"
Output: "acdb"
\`\`\`

## Constraints
- 1 <= s.length <= 10^4
- s consists of lowercase English letters`,
    starterCode: `def removeDuplicateLetters(s):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use a monotonic stack to build result. Pop larger chars if they appear later.' },
      { afterAttempt: 2, text: 'Track last occurrence of each char. Pop from stack if current is smaller AND top char appears later.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Monotonic Stack

\`\`\`python
def removeDuplicateLetters(s):
    last_occurrence = {c: i for i, c in enumerate(s)}
    stack = []
    in_stack = set()

    for i, c in enumerate(s):
        if c in in_stack:
            continue

        # Pop larger chars that appear later
        while stack and c < stack[-1] and last_occurrence[stack[-1]] > i:
            in_stack.remove(stack.pop())

        stack.append(c)
        in_stack.add(c)

    return ''.join(stack)
\`\`\`

## Key Insight
- Build result greedily from left to right
- If current char is smaller than stack top, pop top IF it appears later
- This ensures we can include the popped char later

## Why This Works
- We want lexicographically smallest, so prefer smaller chars earlier
- Only pop if we can add the char back later (last_occurrence > current)
- Stack maintains increasing order when possible

## Complexity
- Time: O(n)
- Space: O(1) - at most 26 chars in stack`
    },
    testCases: [
      { input: '"bcabc"', expected: '"abc"' },
      { input: '"cbacdcbc"', expected: '"acdb"' },
      { input: '"abcd"', expected: '"abcd"' },
      { input: '"ecbacba"', expected: '"eacb"' }
    ],
    solutionExplanation: 'Monotonic stack: pop larger chars if they appear later, keep lexicographic order.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-patching-array',
    title: 'Patching Array',
    description: 'Minimum numbers to add to cover range [1,n]',
    targetComplexity: { time: 'O(m + log n)', space: 'O(1)' },
    instruction: `# Patching Array

Given a sorted integer array \`nums\` and an integer \`n\`, add/patch elements so that any number in the range [1, n] inclusive can be formed by the sum of some elements in the array.

Return the **minimum number of patches** required.

## Examples

**Example 1:**
\`\`\`
Input: nums = [1,3], n = 6
Output: 1
Explanation:
- With [1,3], we can make: 1, 3, 4 (1+3)
- Add 2: now we can make 1,2,3,4,5,6
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1,5,10], n = 20
Output: 2
Explanation: Add 2 and 4
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [1,2,2], n = 5
Output: 0
Explanation: Can make 1,2,3,4,5 already
\`\`\`

## Constraints
- 1 <= nums.length <= 1000
- 1 <= nums[i] <= 10^4
- nums is sorted in ascending order
- 1 <= n <= 2^31 - 1`,
    starterCode: `def minPatches(nums, n):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Track the range [1, miss) that you can form. If nums[i] <= miss, extend range.' },
      { afterAttempt: 2, text: 'If nums[i] > miss, you must patch with miss. This doubles your range.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Greedy Range Extension

\`\`\`python
def minPatches(nums, n):
    patches = 0
    miss = 1  # Smallest number we cannot form
    i = 0

    while miss <= n:
        if i < len(nums) and nums[i] <= miss:
            # Use nums[i] to extend range
            miss += nums[i]
            i += 1
        else:
            # Patch with miss itself
            miss += miss  # Double the range
            patches += 1

    return patches
\`\`\`

## Key Insight
- If we can form [1, miss), adding x where x <= miss lets us form [1, miss + x)
- If nums[i] > miss, we have a gap. Best patch is miss itself (doubles range)
- Adding miss means we can now form [1, 2*miss)

## Why Patch with miss?
- Any smaller patch would also work, but miss gives maximum range extension
- Greedy choice: extend as far as possible with each patch

## Complexity
- Time: O(m + log n) where m = len(nums)
- Space: O(1)`
    },
    testCases: [
      { input: '[[1,3], 6]', expected: '1' },
      { input: '[[1,5,10], 20]', expected: '2' },
      { input: '[[1,2,2], 5]', expected: '0' },
      { input: '[[], 7]', expected: '3' }
    ],
    solutionExplanation: 'Track reachable range. Patch with miss value when gap encountered (doubles range).'
  },

  // ==================== GROUP 8: Greedy + Binary Search ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-capacity-ship-packages',
    title: 'Capacity to Ship Packages Within D Days',
    description: 'Find minimum ship capacity for deadline',
    targetComplexity: { time: 'O(n log(sum))', space: 'O(1)' },
    instruction: `# Capacity to Ship Packages Within D Days

A conveyor belt has packages with weights. You need to ship all packages within \`days\` days.

Packages must be shipped in order. Each day, you load packages until you hit the weight limit.

Return the **minimum ship capacity** to ship all packages in \`days\` days.

## Examples

**Example 1:**
\`\`\`
Input: weights = [1,2,3,4,5,6,7,8,9,10], days = 5
Output: 15
Explanation:
Day 1: 1,2,3,4,5 (15)
Day 2: 6,7 (13)
Day 3: 8 (8)
Day 4: 9 (9)
Day 5: 10 (10)
\`\`\`

**Example 2:**
\`\`\`
Input: weights = [3,2,2,4,1,4], days = 3
Output: 6
\`\`\`

## Constraints
- 1 <= days <= weights.length <= 5 * 10^4
- 1 <= weights[i] <= 500`,
    starterCode: `def shipWithinDays(weights, days):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Binary search on the answer (capacity). Check if capacity C works in <= days.' },
      { afterAttempt: 2, text: 'Lower bound = max(weights), upper bound = sum(weights). Greedily count days needed.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Binary Search + Greedy Check

\`\`\`python
def shipWithinDays(weights, days):
    def canShip(capacity):
        day_count = 1
        current_load = 0
        for w in weights:
            if current_load + w > capacity:
                day_count += 1
                current_load = 0
            current_load += w
        return day_count <= days

    left = max(weights)  # Must fit largest package
    right = sum(weights)  # Ship all in one day

    while left < right:
        mid = (left + right) // 2
        if canShip(mid):
            right = mid
        else:
            left = mid + 1

    return left
\`\`\`

## Key Insight
- If capacity C works, C+1 also works (monotonic)
- Binary search on capacity
- Greedy check: load packages until capacity, count days

## Why Binary Search?
- Answer is in range [max(weights), sum(weights)]
- Property is monotonic: higher capacity → fewer days
- Find minimum capacity where days <= target

## Complexity
- Time: O(n log(sum(weights)))
- Space: O(1)`
    },
    testCases: [
      { input: '[[1,2,3,4,5,6,7,8,9,10], 5]', expected: '15' },
      { input: '[[3,2,2,4,1,4], 3]', expected: '6' },
      { input: '[[1,2,3,1,1], 4]', expected: '3' },
      { input: '[[10], 1]', expected: '10' }
    ],
    solutionExplanation: 'Binary search on capacity, greedily check if each capacity allows shipping in time.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-minimize-max-distance-gas-station',
    title: 'Minimize Max Distance to Gas Station',
    description: 'Add stations to minimize maximum gap',
    targetComplexity: { time: 'O(n log(max_gap/precision))', space: 'O(1)' },
    instruction: `# Minimize Max Distance to Gas Station

You are given n gas stations along a highway at positions \`stations\`. You need to add k more gas stations.

Return the **minimum possible maximum distance** between adjacent gas stations after adding k stations.

## Examples

**Example 1:**
\`\`\`
Input: stations = [1,2,3,4,5,6,7,8,9,10], k = 9
Output: 0.5
Explanation: Add stations at 1.5,2.5,3.5,...,9.5
\`\`\`

**Example 2:**
\`\`\`
Input: stations = [23,24,36,39,46,56,57,65,84,98], k = 1
Output: 14.0
Explanation: Add station between 84 and 98
\`\`\`

## Constraints
- 10 <= stations.length <= 2000
- 0 <= stations[i] <= 10^8
- stations is sorted
- 1 <= k <= 10^6

Return answer within 10^-6 of actual answer.`,
    starterCode: `def minmaxGasDist(stations, k):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Binary search on the answer (max distance). Check if you can achieve distance D with k stations.' },
      { afterAttempt: 2, text: 'For each gap, compute how many stations needed to make all segments <= D.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Binary Search on Answer

\`\`\`python
def minmaxGasDist(stations, k):
    def stationsNeeded(maxDist):
        count = 0
        for i in range(len(stations) - 1):
            gap = stations[i+1] - stations[i]
            count += int(gap / maxDist)  # Number of stations to add
        return count

    left = 0
    right = stations[-1] - stations[0]

    while right - left > 1e-6:
        mid = (left + right) / 2
        if stationsNeeded(mid) <= k:
            right = mid
        else:
            left = mid

    return right
\`\`\`

## Key Insight
- Binary search on maximum distance D
- For each gap of size G, need ceil(G/D) - 1 = floor(G/D) new stations
- If total needed <= k, D is achievable

## Why Binary Search?
- Larger D → fewer stations needed (monotonic)
- Find smallest D where we need <= k stations

## Complexity
- Time: O(n * log((max_gap) / precision))
- Space: O(1)`
    },
    testCases: [
      { input: '[[1,2,3,4,5,6,7,8,9,10], 9]', expected: '0.5' },
      { input: '[[23,24,36,39,46,56,57,65,84,98], 1]', expected: '14.0' },
      { input: '[[0,100], 1]', expected: '50.0' },
      { input: '[[0,10], 4]', expected: '2.0' }
    ],
    solutionExplanation: 'Binary search on max distance, check stations needed for each gap.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-koko-eating-bananas',
    title: 'Koko Eating Bananas',
    description: 'Find minimum eating speed to finish in time',
    targetComplexity: { time: 'O(n log m)', space: 'O(1)' },
    instruction: `# Koko Eating Bananas

Koko loves bananas. There are n piles with \`piles[i]\` bananas. Guards will return in h hours.

Koko can eat k bananas per hour from one pile. If pile has < k bananas, she finishes it and waits.

Return the **minimum k** such that she can eat all bananas within h hours.

## Examples

**Example 1:**
\`\`\`
Input: piles = [3,6,7,11], h = 8
Output: 4
\`\`\`

**Example 2:**
\`\`\`
Input: piles = [30,11,23,4,20], h = 5
Output: 30
Explanation: Each pile takes 1 hour at speed 30
\`\`\`

**Example 3:**
\`\`\`
Input: piles = [30,11,23,4,20], h = 6
Output: 23
\`\`\`

## Constraints
- 1 <= piles.length <= 10^4
- piles.length <= h <= 10^9
- 1 <= piles[i] <= 10^9`,
    starterCode: `def minEatingSpeed(piles, h):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Binary search on k. For each k, compute total hours needed.' },
      { afterAttempt: 2, text: 'Hours for pile p at speed k = ceil(p/k). Sum all and check <= h.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Binary Search

\`\`\`python
import math

def minEatingSpeed(piles, h):
    def hoursNeeded(speed):
        return sum(math.ceil(p / speed) for p in piles)

    left = 1
    right = max(piles)

    while left < right:
        mid = (left + right) // 2
        if hoursNeeded(mid) <= h:
            right = mid
        else:
            left = mid + 1

    return left
\`\`\`

## Key Insight
- Higher speed → fewer hours (monotonic)
- Binary search for minimum speed where hours <= h
- For each pile, hours = ceil(pile/speed)

## Why Binary Search?
- Answer is in range [1, max(piles)]
- Speed k works → any k' > k also works
- Find minimum valid speed

## Complexity
- Time: O(n log(max(piles)))
- Space: O(1)`
    },
    testCases: [
      { input: '[[3,6,7,11], 8]', expected: '4' },
      { input: '[[30,11,23,4,20], 5]', expected: '30' },
      { input: '[[30,11,23,4,20], 6]', expected: '23' },
      { input: '[[1000000000], 2]', expected: '500000000' }
    ],
    solutionExplanation: 'Binary search on eating speed, check if total hours <= h.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-magnetic-force-balls',
    title: 'Magnetic Force Between Two Balls',
    description: 'Maximize minimum distance between m balls',
    targetComplexity: { time: 'O(n log(max_dist))', space: 'O(1)' },
    instruction: `# Magnetic Force Between Two Balls

You have n baskets at positions. You need to place m balls in the baskets.

The magnetic force between two balls is the distance between their baskets.

Return the **maximum** possible **minimum magnetic force** between any two balls.

## Examples

**Example 1:**
\`\`\`
Input: position = [1,2,3,4,7], m = 3
Output: 3
Explanation: Place balls at 1, 4, 7. Min distance = 3
\`\`\`

**Example 2:**
\`\`\`
Input: position = [5,4,3,2,1,1000000000], m = 2
Output: 999999999
Explanation: Place at 1 and 1000000000
\`\`\`

## Constraints
- n == position.length
- 2 <= n <= 10^5
- 1 <= position[i] <= 10^9
- All positions are distinct
- 2 <= m <= position.length`,
    starterCode: `def maxDistance(position, m):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Binary search on the minimum distance. Check if you can place m balls with distance >= D.' },
      { afterAttempt: 2, text: 'Sort positions. Greedily place balls at positions that are >= D apart.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Binary Search + Greedy Placement

\`\`\`python
def maxDistance(position, m):
    position.sort()

    def canPlace(minDist):
        count = 1
        last_pos = position[0]
        for i in range(1, len(position)):
            if position[i] - last_pos >= minDist:
                count += 1
                last_pos = position[i]
        return count >= m

    left = 1
    right = position[-1] - position[0]

    while left < right:
        mid = (left + right + 1) // 2  # Upper binary search
        if canPlace(mid):
            left = mid
        else:
            right = mid - 1

    return left
\`\`\`

## Key Insight
- Binary search on minimum distance D
- Greedy check: place first ball at start, next ball when distance >= D
- If we can place m balls, D is achievable

## Note: Upper Binary Search
- We want MAXIMUM D, so use upper binary search
- mid = (left + right + 1) // 2
- If canPlace, left = mid

## Complexity
- Time: O(n log(max_distance))
- Space: O(1) if sorting in place`
    },
    testCases: [
      { input: '[[1,2,3,4,7], 3]', expected: '3' },
      { input: '[[5,4,3,2,1,1000000000], 2]', expected: '999999999' },
      { input: '[[1,2,3], 2]', expected: '2' },
      { input: '[[79,74,57,22], 4]', expected: '5' }
    ],
    solutionExplanation: 'Binary search on min distance, greedily place balls with required spacing.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-split-array-largest-sum',
    title: 'Split Array Largest Sum',
    description: 'Minimize the largest sum among m subarrays',
    targetComplexity: { time: 'O(n log(sum))', space: 'O(1)' },
    instruction: `# Split Array Largest Sum

Given an integer array \`nums\` and an integer \`m\`, split the array into m non-empty continuous subarrays.

Minimize the largest sum among these m subarrays.

## Examples

**Example 1:**
\`\`\`
Input: nums = [7,2,5,10,8], m = 2
Output: 18
Explanation: Split into [7,2,5] and [10,8]. Sums are 14 and 18. Max = 18.
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1,2,3,4,5], m = 2
Output: 9
Explanation: [1,2,3,4] and [5]. Or [1,2,3] and [4,5]. Both have max = 9.
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [1,4,4], m = 3
Output: 4
\`\`\`

## Constraints
- 1 <= nums.length <= 1000
- 0 <= nums[i] <= 10^6
- 1 <= m <= min(50, nums.length)`,
    starterCode: `def splitArray(nums, m):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Binary search on the answer (max subarray sum). Check if you can split with max sum <= target.' },
      { afterAttempt: 2, text: 'Greedy check: accumulate until exceeding target, then start new subarray. Count subarrays needed.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Binary Search + Greedy Split

\`\`\`python
def splitArray(nums, m):
    def canSplit(maxSum):
        count = 1
        current_sum = 0
        for num in nums:
            if current_sum + num > maxSum:
                count += 1
                current_sum = num
            else:
                current_sum += num
        return count <= m

    left = max(nums)  # At least max element
    right = sum(nums)  # All in one subarray

    while left < right:
        mid = (left + right) // 2
        if canSplit(mid):
            right = mid
        else:
            left = mid + 1

    return left
\`\`\`

## Key Insight
- Binary search on maximum allowed subarray sum
- Greedy check: greedily extend subarray until limit, then start new one
- If we need <= m subarrays, the limit is achievable

## Why This Works
- If limit L works, L+1 also works (need fewer splits)
- Find minimum L where we need <= m subarrays
- Greedy split is optimal for checking feasibility

## Complexity
- Time: O(n log(sum(nums)))
- Space: O(1)`
    },
    testCases: [
      { input: '[[7,2,5,10,8], 2]', expected: '18' },
      { input: '[[1,2,3,4,5], 2]', expected: '9' },
      { input: '[[1,4,4], 3]', expected: '4' },
      { input: '[[10,5,13,4,8,4,5,11,14,9,16,10,20,8], 8]', expected: '25' }
    ],
    solutionExplanation: 'Binary search on max sum, greedily check if split is possible with limit.'
  },

  // ==================== GROUP 9: Greedy With Proof Intuition ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-minimum-refueling-stops',
    title: 'Minimum Number of Refueling Stops',
    description: 'Reach target with minimum fuel stops',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Minimum Number of Refueling Stops

A car starts at position 0 with \`startFuel\` fuel. It travels 1 mile per unit of fuel.

Along the way are gas stations: \`stations[i] = [position, fuel]\`.

Return the **minimum number of stops** to reach \`target\`, or -1 if impossible.

## Examples

**Example 1:**
\`\`\`
Input: target = 1, startFuel = 1, stations = []
Output: 0
Explanation: Already have enough fuel
\`\`\`

**Example 2:**
\`\`\`
Input: target = 100, startFuel = 1, stations = [[10,100]]
Output: -1
Explanation: Can't reach first station
\`\`\`

**Example 3:**
\`\`\`
Input: target = 100, startFuel = 10, stations = [[10,60],[20,30],[30,30],[60,40]]
Output: 2
Explanation: Stop at stations 0 and 3
\`\`\`

## Constraints
- 1 <= target, startFuel <= 10^9
- 0 <= stations.length <= 500
- 0 <= position < target
- 1 <= fuel <= 10^9`,
    starterCode: `def minRefuelStops(target, startFuel, stations):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use a max heap. When you pass a station, add its fuel to heap. When stuck, use largest available fuel.' },
      { afterAttempt: 2, text: 'Greedily "save" passed stations. Only actually stop (pop from heap) when fuel runs out.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Max Heap (Lazy Refueling)

\`\`\`python
import heapq

def minRefuelStops(target, startFuel, stations):
    max_heap = []  # Available fuel amounts (negated for max heap)
    fuel = startFuel
    prev_pos = 0
    stops = 0

    stations.append([target, 0])  # Treat target as final station

    for pos, gas in stations:
        fuel -= (pos - prev_pos)  # Drive to this station

        # Refuel from passed stations if needed
        while fuel < 0 and max_heap:
            fuel -= heapq.heappop(max_heap)  # Add fuel (negated)
            stops += 1

        if fuel < 0:
            return -1

        heapq.heappush(max_heap, -gas)  # Save this station's fuel
        prev_pos = pos

    return stops
\`\`\`

## Key Insight
- Don't decide at each station whether to stop
- "Pass" all stations, remembering their fuel
- When we run out, retroactively stop at best station

## Why This Works
- If we need to stop, we should stop at station with most fuel
- Delaying decision lets us pick optimal station
- Max heap gives us best available fuel

## Complexity
- Time: O(n log n)
- Space: O(n) for heap`
    },
    testCases: [
      { input: '[1, 1, []]', expected: '0' },
      { input: '[100, 1, [[10,100]]]', expected: '-1' },
      { input: '[100, 10, [[10,60],[20,30],[30,30],[60,40]]]', expected: '2' },
      { input: '[100, 50, [[25,50],[50,25]]]', expected: '1' }
    ],
    solutionExplanation: 'Max heap for lazy refueling: collect passed stations, use best when stuck.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-maximum-performance-team',
    title: 'Maximum Performance of a Team',
    description: 'Select k engineers to maximize performance',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Maximum Performance of a Team

You have n engineers with \`speed[i]\` and \`efficiency[i]\`.

Performance of a team is: sum(speed) * min(efficiency).

Return the **maximum performance** of a team with at most k engineers.

Return answer modulo 10^9 + 7.

## Examples

**Example 1:**
\`\`\`
Input: n = 6, speed = [2,10,3,1,5,8], efficiency = [5,4,3,9,7,2], k = 2
Output: 60
Explanation: Team [1,4] (indices). Speed sum = 10+5 = 15, min efficiency = 4.
Performance = 15 * 4 = 60
\`\`\`

**Example 2:**
\`\`\`
Input: n = 6, speed = [2,10,3,1,5,8], efficiency = [5,4,3,9,7,2], k = 3
Output: 68
\`\`\`

## Constraints
- 1 <= k <= n <= 10^5
- 1 <= speed[i], efficiency[i] <= 10^5`,
    starterCode: `def maxPerformance(n, speed, efficiency, k):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Fix minimum efficiency by sorting by efficiency descending. Then greedily add high-speed engineers.' },
      { afterAttempt: 2, text: 'For each efficiency as minimum, keep top k-1 speeds from higher-efficiency engineers using min heap.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Sort by Efficiency + Min Heap

\`\`\`python
import heapq

def maxPerformance(n, speed, efficiency, k):
    MOD = 10**9 + 7

    # Sort by efficiency descending
    engineers = sorted(zip(efficiency, speed), reverse=True)

    min_heap = []  # Track speeds in current team
    speed_sum = 0
    max_perf = 0

    for eff, spd in engineers:
        # Current engineer has minimum efficiency
        heapq.heappush(min_heap, spd)
        speed_sum += spd

        if len(min_heap) > k:
            speed_sum -= heapq.heappop(min_heap)

        max_perf = max(max_perf, speed_sum * eff)

    return max_perf % MOD
\`\`\`

## Key Insight
- Performance = sum(speeds) × min(efficiency)
- Fix minimum efficiency by iterating in decreasing order
- For each min efficiency, maximize sum of speeds from engineers with higher efficiency

## Why This Works
- Each engineer might be the min efficiency one
- For that case, we want max speed sum from "better" engineers
- Min heap keeps top k speeds seen so far

## Complexity
- Time: O(n log n) for sorting + O(n log k) for heap operations
- Space: O(n)`
    },
    testCases: [
      { input: '[6, [2,10,3,1,5,8], [5,4,3,9,7,2], 2]', expected: '60' },
      { input: '[6, [2,10,3,1,5,8], [5,4,3,9,7,2], 3]', expected: '68' },
      { input: '[3, [2,8,2], [2,7,1], 2]', expected: '56' },
      { input: '[1, [5], [4], 1]', expected: '20' }
    ],
    solutionExplanation: 'Sort by efficiency desc. For each as min, track top k speeds with min heap.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-ipo',
    title: 'IPO',
    description: 'Maximize capital after k projects',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# IPO

You have initial capital \`w\` and can complete at most \`k\` projects.

Each project i has \`profits[i]\` (net profit) and \`capital[i]\` (minimum capital needed).

After completing a project, profit is added to capital.

Return the **maximum capital** after completing at most k projects.

## Examples

**Example 1:**
\`\`\`
Input: k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]
Output: 4
Explanation:
- Start with w = 0
- Do project 0: w = 0 + 1 = 1
- Do project 2: w = 1 + 3 = 4
\`\`\`

**Example 2:**
\`\`\`
Input: k = 3, w = 0, profits = [1,2,3], capital = [0,1,2]
Output: 6
\`\`\`

## Constraints
- 1 <= k <= 10^5
- 0 <= w <= 10^9
- n == profits.length == capital.length
- 1 <= n <= 10^5
- 0 <= profits[i] <= 10^4
- 0 <= capital[i] <= 10^9`,
    starterCode: `def findMaximizedCapital(k, w, profits, capital):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Among affordable projects, pick the one with highest profit. This is greedy.' },
      { afterAttempt: 2, text: 'Use min heap for capital requirement, max heap for available profits. Move projects from min to max heap as capital grows.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Two Heaps

\`\`\`python
import heapq

def findMaximizedCapital(k, w, profits, capital):
    # Min heap: (capital_required, profit)
    min_cap_heap = list(zip(capital, profits))
    heapq.heapify(min_cap_heap)

    # Max heap: available profits (negated)
    max_profit_heap = []

    for _ in range(k):
        # Move affordable projects to available pool
        while min_cap_heap and min_cap_heap[0][0] <= w:
            cap, profit = heapq.heappop(min_cap_heap)
            heapq.heappush(max_profit_heap, -profit)

        if not max_profit_heap:
            break

        # Do the most profitable available project
        w -= heapq.heappop(max_profit_heap)

    return w
\`\`\`

## Key Insight
- At each step, pick highest profit among affordable projects
- As capital grows, more projects become affordable
- Two heaps: one for "locked" projects, one for "available"

## Why This Works
- Greedy: highest profit project is always best (no downside)
- We can only access projects we can afford
- Min heap efficiently tracks which become affordable

## Complexity
- Time: O(n log n) for heap operations
- Space: O(n) for heaps`
    },
    testCases: [
      { input: '[2, 0, [1,2,3], [0,1,1]]', expected: '4' },
      { input: '[3, 0, [1,2,3], [0,1,2]]', expected: '6' },
      { input: '[1, 0, [1,2,3], [1,1,2]]', expected: '0' },
      { input: '[2, 1, [1,2,3], [0,1,2]]', expected: '5' }
    ],
    solutionExplanation: 'Two heaps: min heap for locked projects, max heap for available. Greedily pick highest profit.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-assign-tasks-servers',
    title: 'Process Tasks Using Servers',
    description: 'Assign tasks to servers based on availability',
    targetComplexity: { time: 'O((n+m) log n)', space: 'O(n)' },
    instruction: `# Process Tasks Using Servers

You have n servers with weights and m tasks with processing times.

Server j is free at time \`free[j]\`. Tasks arrive at times 0, 1, 2, ...

Assign each task to:
1. Available server with smallest weight
2. Tie-breaker: smallest index

Each task uses server for \`tasks[i]\` seconds.

Return the server index assigned to each task.

## Examples

**Example 1:**
\`\`\`
Input: servers = [3,3,2], tasks = [1,2,3,2,1,2]
Output: [2,2,0,2,1,2]
Explanation:
- t=0: Task 0 → server 2 (weight 2, smallest)
- t=1: Task 1 → server 2 busy, pick 0 or 1 (both weight 3), pick 0
...
\`\`\`

**Example 2:**
\`\`\`
Input: servers = [5,1,4,3,2], tasks = [2,1,2,4,5,2,1]
Output: [1,4,1,4,1,3,2]
\`\`\`

## Constraints
- 1 <= servers.length, tasks.length <= 2 * 10^5
- 1 <= servers[i], tasks[j] <= 2 * 10^5`,
    starterCode: `def assignTasks(servers, tasks):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use two heaps: one for available servers (by weight, index), one for busy servers (by free time).' },
      { afterAttempt: 2, text: 'At each task time, move freed servers back to available heap, then assign.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Two Heaps

\`\`\`python
import heapq

def assignTasks(servers, tasks):
    # Available: (weight, index)
    available = [(w, i) for i, w in enumerate(servers)]
    heapq.heapify(available)

    # Busy: (free_time, weight, index)
    busy = []

    result = []
    time = 0

    for i, task_time in enumerate(tasks):
        time = max(time, i)

        # If no server available, jump to next free time
        if not available:
            time = busy[0][0]

        # Free up servers
        while busy and busy[0][0] <= time:
            free_time, weight, idx = heapq.heappop(busy)
            heapq.heappush(available, (weight, idx))

        # Assign task
        weight, idx = heapq.heappop(available)
        result.append(idx)
        heapq.heappush(busy, (time + task_time, weight, idx))

    return result
\`\`\`

## Key Insight
- Two heaps track server state: available vs busy
- At each task, free up finished servers, then assign
- If all busy, time jump to next available

## Why This Works
- Available heap gives smallest weight server (greedy choice)
- Busy heap gives soonest available server
- Time tracking handles gaps correctly

## Complexity
- Time: O((n + m) log n)
- Space: O(n) for heaps`
    },
    testCases: [
      { input: '[[3,3,2], [1,2,3,2,1,2]]', expected: '[2,2,0,2,1,2]' },
      { input: '[[5,1,4,3,2], [2,1,2,4,5,2,1]]', expected: '[1,4,1,4,1,3,2]' },
      { input: '[[1], [1,2,3]]', expected: '[0,0,0]' },
      { input: '[[1,2], [1,1,1,1]]', expected: '[0,1,0,1]' }
    ],
    solutionExplanation: 'Two heaps: available (by weight) and busy (by free time). Assign greedily.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-min-cost-hire-workers',
    title: 'Minimum Cost to Hire K Workers',
    description: 'Hire k workers minimizing total cost',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Minimum Cost to Hire K Workers

You want to hire exactly k workers. Each worker has:
- \`quality[i]\`: quality of work
- \`wage[i]\`: minimum wage expectation

You must:
1. Pay at least the minimum wage
2. Pay workers proportionally to their quality

Return the **minimum cost** to hire k workers.

## Examples

**Example 1:**
\`\`\`
Input: quality = [10,20,5], wage = [70,50,30], k = 2
Output: 105.0
Explanation:
- Hire workers 0 and 2
- Worker 0: quality 10, wage 70 → ratio 7
- Worker 2: quality 5, wage 30 → ratio 6
- Pay ratio 7 (max). Costs: 10*7=70, 5*7=35. Total = 105
\`\`\`

**Example 2:**
\`\`\`
Input: quality = [3,1,10,10,1], wage = [4,8,2,2,7], k = 3
Output: 30.66667
\`\`\`

## Constraints
- n == quality.length == wage.length
- 1 <= k <= n <= 10^4
- 1 <= quality[i], wage[i] <= 10^4`,
    starterCode: `def mincostToHireWorkers(quality, wage, k):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Key insight: payment is ratio × quality. If we fix the ratio, we want k lowest quality workers.' },
      { afterAttempt: 2, text: 'Sort by ratio (wage/quality). For each ratio as max, keep k lowest quality workers using max heap.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Sort by Ratio + Max Heap for Quality

\`\`\`python
import heapq

def mincostToHireWorkers(quality, wage, k):
    # ratio = wage/quality (min acceptable payment per quality unit)
    workers = sorted(zip(wage, quality), key=lambda x: x[0]/x[1])

    max_heap = []  # Track qualities (max heap using negation)
    quality_sum = 0
    min_cost = float('inf')

    for w, q in workers:
        ratio = w / q

        heapq.heappush(max_heap, -q)
        quality_sum += q

        if len(max_heap) > k:
            quality_sum += heapq.heappop(max_heap)  # Remove largest quality

        if len(max_heap) == k:
            min_cost = min(min_cost, ratio * quality_sum)

    return min_cost
\`\`\`

## Key Insight
- All workers in group paid at same ratio
- Ratio must be >= each worker's wage/quality
- So max ratio in group determines pay
- For each ratio as max, minimize quality sum → use k lowest qualities

## Why Sort by Ratio?
- Process workers in ratio order
- When worker joins, their ratio is the new maximum
- All previous workers can accept this ratio

## Complexity
- Time: O(n log n)
- Space: O(n)`
    },
    testCases: [
      { input: '[[10,20,5], [70,50,30], 2]', expected: '105.0' },
      { input: '[[3,1,10,10,1], [4,8,2,2,7], 3]', expected: '30.66667' },
      { input: '[[1,1], [1,1], 2]', expected: '2.0' },
      { input: '[[4,5], [8,14], 2]', expected: '28.0' }
    ],
    solutionExplanation: 'Sort by wage/quality ratio. For each ratio as max, keep k lowest quality workers.'
  },

  // ==================== GROUP 10: Tricky Greedy Variants ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-valid-parenthesis-string',
    title: 'Valid Parenthesis String',
    description: 'Check if string with wildcards can be valid parentheses',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Valid Parenthesis String

Given a string s containing only '(', ')' and '*', where '*' can be '(', ')' or empty string.

Return \`true\` if s is valid, \`false\` otherwise.

## Examples

**Example 1:**
\`\`\`
Input: s = "()"
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: s = "(*)"
Output: true
Explanation: * can be empty
\`\`\`

**Example 3:**
\`\`\`
Input: s = "(*))"
Output: true
Explanation: * as (
\`\`\`

## Constraints
- 1 <= s.length <= 100
- s[i] is '(', ')' or '*'`,
    starterCode: `def checkValidString(s):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Track range of possible open count [low, high]. * can add or remove from open count.' },
      { afterAttempt: 2, text: 'low = min possible opens, high = max possible opens. Both must stay valid.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Track Range of Open Parentheses

\`\`\`python
def checkValidString(s):
    low = 0   # Minimum possible open count
    high = 0  # Maximum possible open count

    for c in s:
        if c == '(':
            low += 1
            high += 1
        elif c == ')':
            low -= 1
            high -= 1
        else:  # '*'
            low -= 1   # * as )
            high += 1  # * as (

        if high < 0:
            return False  # Too many )

        low = max(low, 0)  # Can't have negative open count

    return low == 0
\`\`\`

## Key Insight
- Track range of possible open parenthesis counts
- '(' increases both low and high
- ')' decreases both
- '*' decreases low (act as ')') and increases high (act as '(')

## Why This Works
- We don't track actual assignments, just possibilities
- If high goes negative, too many ')' guaranteed
- If low > 0 at end, too many '(' guaranteed
- If low can be 0, valid assignment exists

## Complexity
- Time: O(n)
- Space: O(1)`
    },
    testCases: [
      { input: '"()"', expected: 'true' },
      { input: '"(*)"', expected: 'true' },
      { input: '"(*))"', expected: 'true' },
      { input: '"(((*)"', expected: 'false' }
    ],
    solutionExplanation: 'Track [low, high] range of possible open counts. Valid if low can be 0 at end.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-remove-covered-intervals',
    title: 'Remove Covered Intervals',
    description: 'Count intervals not covered by others',
    targetComplexity: { time: 'O(n log n)', space: 'O(1)' },
    instruction: `# Remove Covered Intervals

Given a list of intervals, remove all intervals that are covered by another interval.

Interval [a,b] is covered by [c,d] if c <= a and b <= d.

Return the **number of remaining intervals**.

## Examples

**Example 1:**
\`\`\`
Input: intervals = [[1,4],[3,6],[2,8]]
Output: 2
Explanation: [3,6] is covered by [2,8], so remove it
\`\`\`

**Example 2:**
\`\`\`
Input: intervals = [[1,4],[2,3]]
Output: 1
Explanation: [2,3] is covered by [1,4]
\`\`\`

## Constraints
- 1 <= intervals.length <= 1000
- intervals[i].length == 2
- 0 <= start < end <= 10^5`,
    starterCode: `def removeCoveredIntervals(intervals):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Sort by start ascending, then by end descending. Process and track max end seen.' },
      { afterAttempt: 2, text: 'After sorting, interval is covered if its end <= max_end so far.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Sort and Track Max End

\`\`\`python
def removeCoveredIntervals(intervals):
    # Sort by start asc, then by end desc
    intervals.sort(key=lambda x: (x[0], -x[1]))

    count = 0
    max_end = 0

    for start, end in intervals:
        if end > max_end:
            count += 1
            max_end = end
        # else: covered by previous interval with same/earlier start

    return count
\`\`\`

## Key Insight
- Sort by start, then by end descending
- For same start, longer interval comes first
- Interval is covered if end <= max_end seen so far

## Why Sort This Way?
- Intervals with same start: longer one can cover shorter ones
- Process longer first, shorter ones will be marked as covered
- For different starts, earlier start can cover later start with smaller end

## Complexity
- Time: O(n log n)
- Space: O(1) if sorting in place`
    },
    testCases: [
      { input: '[[[1,4],[3,6],[2,8]]]', expected: '2' },
      { input: '[[[1,4],[2,3]]]', expected: '1' },
      { input: '[[[1,2],[1,4],[3,4]]]', expected: '1' },
      { input: '[[[1,2],[2,3],[3,4]]]', expected: '3' }
    ],
    solutionExplanation: 'Sort by start asc, end desc. Count intervals with end > max_end seen.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-maximum-product-k-increments',
    title: 'Maximum Product After K Increments',
    description: 'Increment elements to maximize product',
    targetComplexity: { time: 'O(n + k log n)', space: 'O(n)' },
    instruction: `# Maximum Product After K Increments

You have an array \`nums\` and can perform at most k increments (add 1 to any element).

Return the **maximum product** of all elements, modulo 10^9 + 7.

## Examples

**Example 1:**
\`\`\`
Input: nums = [0,4], k = 5
Output: 20
Explanation: Increment nums[0] 5 times → [5,4]. Product = 20
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [6,3,3,2], k = 2
Output: 216
Explanation: Increment nums[3] twice → [6,3,3,4]. Product = 216
\`\`\`

## Constraints
- 1 <= nums.length, k <= 10^5
- 0 <= nums[i] <= 10^6`,
    starterCode: `def maximumProduct(nums, k):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'To maximize product, increment the smallest element. This balances the array.' },
      { afterAttempt: 2, text: 'Use a min heap. Pop smallest, increment, push back. Repeat k times.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Min Heap

\`\`\`python
import heapq

def maximumProduct(nums, k):
    MOD = 10**9 + 7

    heapq.heapify(nums)

    for _ in range(k):
        smallest = heapq.heappop(nums)
        heapq.heappush(nums, smallest + 1)

    product = 1
    for num in nums:
        product = (product * num) % MOD

    return product
\`\`\`

## Key Insight
- Product grows faster when incrementing smaller elements
- Example: [2,5] → increment 2 gives [3,5]=15, increment 5 gives [2,6]=12
- Always increment smallest element

## Why This Works
- For fixed sum, product is maximized when elements are balanced
- Incrementing smallest moves toward balance
- Greedy choice is optimal

## Complexity
- Time: O(n + k log n)
- Space: O(n) for heap`
    },
    testCases: [
      { input: '[[0,4], 5]', expected: '20' },
      { input: '[[6,3,3,2], 2]', expected: '216' },
      { input: '[[1,1], 2]', expected: '4' },
      { input: '[[24,5,64,53,26,38], 54]', expected: '180820950' }
    ],
    solutionExplanation: 'Use min heap, always increment smallest element to balance array.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-maximum-swap',
    title: 'Maximum Swap',
    description: 'Swap two digits to get maximum number',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Maximum Swap

Given a non-negative integer, you can swap two digits at most once to get the maximum valued number.

Return the maximum valued number.

## Examples

**Example 1:**
\`\`\`
Input: num = 2736
Output: 7236
Explanation: Swap 2 and 7
\`\`\`

**Example 2:**
\`\`\`
Input: num = 9973
Output: 9973
Explanation: No swap needed
\`\`\`

## Constraints
- 0 <= num <= 10^8`,
    starterCode: `def maximumSwap(num):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'For each position, we want the largest digit to its right. Find rightmost occurrence of each digit.' },
      { afterAttempt: 2, text: 'From left, find first digit that has a larger digit to its right. Swap with rightmost occurrence of that larger digit.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Track Last Occurrence

\`\`\`python
def maximumSwap(num):
    digits = list(str(num))
    n = len(digits)

    # Last occurrence of each digit 0-9
    last = {int(d): i for i, d in enumerate(digits)}

    for i, d in enumerate(digits):
        # Check for larger digits that appear later
        for larger in range(9, int(d), -1):
            if last.get(larger, -1) > i:
                # Swap
                j = last[larger]
                digits[i], digits[j] = digits[j], digits[i]
                return int(''.join(digits))

    return num
\`\`\`

## Key Insight
- We want to swap a digit with a larger digit to its right
- The swap position should be as left as possible (higher place value)
- The larger digit should be as large as possible, and rightmost (for ties)

## Why Rightmost?
- If there are multiple occurrences of the larger digit, picking rightmost one
  leaves other large digits in place

## Complexity
- Time: O(n) where n is number of digits
- Space: O(n) for digit array`
    },
    testCases: [
      { input: '2736', expected: '7236' },
      { input: '9973', expected: '9973' },
      { input: '98368', expected: '98863' },
      { input: '1993', expected: '9913' }
    ],
    solutionExplanation: 'Track last occurrence of each digit. From left, find first digit to swap with larger one to its right.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-find-permutation',
    title: 'Find Permutation',
    description: 'Find lexicographically smallest permutation matching pattern',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Find Permutation

Given a string s of length n containing only 'D' (decrease) and 'I' (increase), find any permutation of [1, 2, ..., n+1] that satisfies:

- If s[i] == 'D', then perm[i] > perm[i+1]
- If s[i] == 'I', then perm[i] < perm[i+1]

Return the **lexicographically smallest** such permutation.

## Examples

**Example 1:**
\`\`\`
Input: s = "I"
Output: [1,2]
Explanation: 1 < 2 satisfies 'I'
\`\`\`

**Example 2:**
\`\`\`
Input: s = "DI"
Output: [2,1,3]
Explanation: 2 > 1 ('D'), 1 < 3 ('I')
\`\`\`

**Example 3:**
\`\`\`
Input: s = "DDIIDI"
Output: [3,2,1,4,6,5,7]
\`\`\`

## Constraints
- 1 <= s.length <= 10^5
- s[i] is either 'D' or 'I'`,
    starterCode: `def findPermutation(s):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Start with [1,2,...,n+1]. For each D sequence, reverse that segment.' },
      { afterAttempt: 2, text: 'Find consecutive D segments and reverse them. This gives lexicographically smallest.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Reverse D Segments

\`\`\`python
def findPermutation(s):
    n = len(s)
    result = list(range(1, n + 2))  # [1, 2, ..., n+1]

    i = 0
    while i < n:
        if s[i] == 'D':
            # Find end of D sequence
            j = i
            while j < n and s[j] == 'D':
                j += 1

            # Reverse segment [i, j]
            result[i:j+1] = result[i:j+1][::-1]
            i = j
        else:
            i += 1

    return result
\`\`\`

## Key Insight
- Start with ascending sequence [1,2,...,n+1]
- For 'I', ascending is already correct
- For 'D' sequence, reverse that segment to make it descending

## Example: "DDIIDI"
- Start: [1,2,3,4,5,6,7]
- "DD" at 0-1: reverse [0:3] → [3,2,1,4,5,6,7]
- "D" at 4: reverse [4:6] → [3,2,1,4,6,5,7]

## Why This Works
- Reversing D segments creates local descents
- Using smallest available numbers first keeps it lexicographically smallest
- Each reversal only affects positions that need descending

## Complexity
- Time: O(n)
- Space: O(n) for result`
    },
    testCases: [
      { input: '"I"', expected: '[1,2]' },
      { input: '"DI"', expected: '[2,1,3]' },
      { input: '"DDIIDI"', expected: '[3,2,1,4,6,5,7]' },
      { input: '"III"', expected: '[1,2,3,4]' }
    ],
    solutionExplanation: 'Start with [1..n+1], reverse each consecutive D segment.'
  }
];
