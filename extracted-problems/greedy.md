# GREEDY Problems

Total Problems: 12

---

## 1. Activity Selection Problem

**Difficulty:** medium
**Concept:** greedy
**Family:** greedy:activity-selection

### Description

Select maximum number of non-overlapping activities

### Examples

**Example 1:**
- Input: Activities with start and end times
- Output: Maximum number of activities
- Explanation: Select activities that don't overlap

### Constraints

- Activities cannot overlap
- Maximize number of activities
- Activities are sorted by end time

### Hints

1. Sort activities by end time
2. Always select the activity with earliest end time
3. Skip activities that overlap with selected ones

### Complexity Analysis

- **Time Complexity:** O(n log n) for sorting
- **Space Complexity:** O(1) excluding input

---

## 2. Jump Game

**Difficulty:** medium
**Concept:** greedy
**Family:** greedy:jump-game

### Description

Given an array nums where nums[i] represents the maximum jump length from position i, determine if you can reach the last index.

### Key Insight

Track the farthest position you can reach as you iterate. If at any point current index > farthest reachable, return false. Greedy choice: always track maximum reach.

### Examples

**Example 1:**
- Input: nums = [2,3,1,1,4]
- Output: true
- Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index

**Example 2:**
- Input: nums = [3,2,1,0,4]
- Output: false
- Explanation: You will always arrive at index 3. Its maximum jump length is 0, which makes it impossible to reach the last index.

### Hints

1. Track the farthest position you can reach
2. If current position > farthest reach, impossible to continue
3. You don't need to track the actual path, just the maximum reach

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

### Test Cases

**Test 1:** Can reach the end
- Input: [2,3,1,1,4]
- Expected: true

**Test 2:** Stuck at index 3
- Input: [3,2,1,0,4]
- Expected: false

**Test 3:** Already at last index
- Input: [0]
- Expected: true

**Test 4:** Cannot pass index 1
- Input: [1,0,1,0]
- Expected: false

---

## 3. Jump Game II

**Difficulty:** medium
**Concept:** greedy
**Family:** greedy:jump-game

### Description

Given an array nums where nums[i] is the maximum jump length from position i, return the minimum number of jumps to reach the last index. You can assume you can always reach the last index.

### Key Insight

Use BFS-like approach with greedy levels. Track current jump's max reach and next jump's max reach. Increment jumps when you need to go beyond current reach.

### Examples

**Example 1:**
- Input: nums = [2,3,1,1,4]
- Output: 2
- Explanation: Jump from index 0 to 1 (1 jump), then to last index (1 jump) = 2 jumps total

**Example 2:**
- Input: nums = [2,3,0,1,4]
- Output: 2
- Explanation: Jump to index 1, then to the last index

### Hints

1. Think of it as BFS levels - each jump is a level
2. Track the farthest you can reach in current jump
3. When you reach the end of current jump range, increment jump count

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

### Test Cases

**Test 1:** Minimum 2 jumps needed
- Input: [2,3,1,1,4]
- Expected: 2

**Test 2:** Still 2 jumps despite zero
- Input: [2,3,0,1,4]
- Expected: 2

**Test 3:** Must jump 3 times
- Input: [1,1,1,1]
- Expected: 3

---

## 4. Gas Station

**Difficulty:** medium
**Concept:** greedy
**Family:** greedy:circular-array

### Description

There are n gas stations in a circular route. Given two arrays gas[i] (gas available at station i) and cost[i] (cost to travel from station i to i+1), find the starting station index where you can complete the circuit. Return -1 if impossible.

### Key Insight

If total gas >= total cost, solution exists. Track running tank balance. When tank goes negative, start position must be after current position (greedy: can't start at position where we ran out).

### Examples

**Example 1:**
- Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
- Output: 3
- Explanation: Starting at station 3, you can complete the circuit

**Example 2:**
- Input: gas = [2,3,4], cost = [3,4,3]
- Output: -1
- Explanation: Cannot complete the circuit

### Hints

1. If total gas < total cost, no solution exists
2. If we run out of gas at position i, we cannot start from any position between start and i
3. Keep track of current tank and total surplus/deficit

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

### Test Cases

**Test 1:** Start at station 3
- Input: {"gas":[1,2,3,4,5],"cost":[3,4,5,1,2]}
- Expected: 3

**Test 2:** Impossible to complete
- Input: {"gas":[2,3,4],"cost":[3,4,3]}
- Expected: -1

**Test 3:** Start at station 4
- Input: {"gas":[5,1,2,3,4],"cost":[4,4,1,5,1]}
- Expected: 4

---

## 5. Non-overlapping Intervals

**Difficulty:** medium
**Concept:** greedy
**Family:** greedy:interval-scheduling

### Description

Given an array of intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest non-overlapping.

### Key Insight

Sort by end time. Always keep the interval with earliest end time (greedy choice: leaves most room for future intervals). Count how many you need to remove.

### Examples

**Example 1:**
- Input: intervals = [[1,2],[2,3],[3,4],[1,3]]
- Output: 1
- Explanation: Remove [1,3] to make others non-overlapping

**Example 2:**
- Input: intervals = [[1,2],[1,2],[1,2]]
- Output: 2
- Explanation: Remove 2 intervals to keep only one

### Hints

1. Sort intervals by end time
2. Greedily select intervals with earliest end time
3. Count conflicts (overlaps) and remove those

### Complexity Analysis

- **Time Complexity:** O(n log n)
- **Space Complexity:** O(1)

### Test Cases

**Test 1:** Remove one interval
- Input: [[1,2],[2,3],[3,4],[1,3]]
- Expected: 1

**Test 2:** Keep only one duplicate
- Input: [[1,2],[1,2],[1,2]]
- Expected: 2

**Test 3:** No overlaps
- Input: [[1,2],[2,3]]
- Expected: 0

---

## 6. Minimum Number of Arrows to Burst Balloons

**Difficulty:** medium
**Concept:** greedy
**Family:** greedy:interval-scheduling

### Description

Balloons are represented as intervals [xstart, xend]. An arrow shot at x bursts all balloons where xstart ≤ x ≤ xend. Find minimum arrows needed to burst all balloons.

### Key Insight

Sort by end position. Shoot arrow at end of first balloon. All overlapping balloons are burst. Move to next non-overlapping balloon. Greedy: shoot as late as possible to cover maximum balloons.

### Examples

**Example 1:**
- Input: points = [[10,16],[2,8],[1,6],[7,12]]
- Output: 2
- Explanation: Shoot at x=6 and x=12

**Example 2:**
- Input: points = [[1,2],[3,4],[5,6],[7,8]]
- Output: 4
- Explanation: Each balloon needs its own arrow

### Hints

1. Sort balloons by end position
2. Shoot arrow at the end of current balloon
3. Skip all balloons that overlap with current arrow position

### Complexity Analysis

- **Time Complexity:** O(n log n)
- **Space Complexity:** O(1)

### Test Cases

**Test 1:** Two arrows needed
- Input: [[10,16],[2,8],[1,6],[7,12]]
- Expected: 2

**Test 2:** Four separate arrows
- Input: [[1,2],[3,4],[5,6],[7,8]]
- Expected: 4

**Test 3:** Overlapping pairs
- Input: [[1,2],[2,3],[3,4],[4,5]]
- Expected: 2

---

## 7. Partition Labels

**Difficulty:** medium
**Concept:** greedy
**Family:** greedy:partitioning

### Description

Given string s, partition it into as many parts as possible so that each letter appears in at most one part. Return a list of partition sizes.

### Key Insight

Track last occurrence of each character. Extend current partition until you reach the last occurrence of all characters seen so far. Greedy: make partitions as small as possible.

### Examples

**Example 1:**
- Input: s = "ababcbacadefegdehijhklij"
- Output: [9,7,8]
- Explanation: Partitions: "ababcbaca", "defegde", "hijhklij"

**Example 2:**
- Input: s = "eccbbbbdec"
- Output: [10]
- Explanation: Entire string is one partition

### Hints

1. Find the last occurrence of each character
2. Extend partition boundary to include all occurrences of seen characters
3. When you reach the partition boundary, start a new partition

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

### Test Cases

**Test 1:** Three partitions
- Input: "ababcbacadefegdehijhklij"
- Expected: [9,7,8]

**Test 2:** Single partition
- Input: "eccbbbbdec"
- Expected: [10]

**Test 3:** Each character separate
- Input: "abc"
- Expected: [1,1,1]

---

## 8. Meeting Rooms II

**Difficulty:** medium
**Concept:** greedy
**Family:** greedy:event-scheduling

### Description

Given an array of meeting time intervals [start, end], find the minimum number of conference rooms required.

### Key Insight

Sort start times and end times separately. Use two pointers. When a meeting starts, increment rooms. When a meeting ends, decrement rooms. Track maximum. Greedy: allocate rooms only when needed.

### Examples

**Example 1:**
- Input: intervals = [[0,30],[5,10],[15,20]]
- Output: 2
- Explanation: Two meetings overlap from 5-10 and 15-20

**Example 2:**
- Input: intervals = [[7,10],[2,4]]
- Output: 1
- Explanation: No overlap, only one room needed

### Hints

1. Separate and sort start times and end times
2. Use two pointers to track meetings starting and ending
3. Track the maximum number of concurrent meetings

### Complexity Analysis

- **Time Complexity:** O(n log n)
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** Two rooms needed
- Input: [[0,30],[5,10],[15,20]]
- Expected: 2

**Test 2:** One room sufficient
- Input: [[7,10],[2,4]]
- Expected: 1

**Test 3:** Three simultaneous meetings
- Input: [[0,30],[5,10],[15,20],[5,15]]
- Expected: 3

---

## 9. Task Scheduler

**Difficulty:** medium
**Concept:** greedy
**Family:** greedy:scheduling

### Description

Given tasks represented by characters and a cooldown period n (same task must wait n intervals), return minimum intervals needed to complete all tasks.

### Key Insight

Find most frequent task. Arrange it with gaps of n. Fill gaps with other tasks. If gaps are filled, answer is total tasks. If not, answer is determined by most frequent task spacing.

### Examples

**Example 1:**
- Input: tasks = ["A","A","A","B","B","B"], n = 2
- Output: 8
- Explanation: A → B → idle → A → B → idle → A → B

**Example 2:**
- Input: tasks = ["A","A","A","B","B","B"], n = 0
- Output: 6
- Explanation: No cooldown needed

### Hints

1. Count frequency of each task
2. The most frequent task determines the minimum time
3. Calculate idle slots needed and fill with other tasks

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

### Test Cases

**Test 1:** Cooldown of 2
- Input: {"tasks":["A","A","A","B","B","B"],"n":2}
- Expected: 8

**Test 2:** No cooldown
- Input: {"tasks":["A","A","A","B","B","B"],"n":0}
- Expected: 6

**Test 3:** Many tasks with cooldown
- Input: {"tasks":["A","A","A","A","A","A","B","C","D","E","F","G"],"n":2}
- Expected: 16

---

## 10. Queue Reconstruction by Height

**Difficulty:** medium
**Concept:** greedy
**Family:** greedy:reconstruction

### Description

Given array people where people[i] = [hi, ki] (hi = height, ki = number of people with height >= hi in front), reconstruct the queue.

### Key Insight

Sort by height descending, then by k ascending. Insert each person at position k. Greedy: tallest people first because their k won't be affected by shorter people.

### Examples

**Example 1:**
- Input: people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]
- Output: [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]
- Explanation: Reconstruct queue by sorting and inserting

### Hints

1. Sort by height in descending order
2. For people with same height, sort by k in ascending order
3. Insert each person at their k position in the result

### Complexity Analysis

- **Time Complexity:** O(n²)
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** Standard reconstruction
- Input: [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]
- Expected: [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]

---

## 11. Remove K Digits

**Difficulty:** medium
**Concept:** greedy
**Family:** greedy:digit-removal

### Description

Given string num representing a non-negative integer and integer k, remove k digits from the number so that the new number is the smallest possible.

### Key Insight

Use monotonic increasing stack. Remove digits when current digit is smaller than stack top. Greedy: remove larger digits from left side to minimize result.

### Examples

**Example 1:**
- Input: num = "1432219", k = 3
- Output: "1219"
- Explanation: Remove 4, 3, 2 to get smallest

**Example 2:**
- Input: num = "10200", k = 1
- Output: "200"
- Explanation: Remove leading 1

### Hints

1. Use a stack to maintain monotonically increasing digits
2. Remove larger digits from the left when possible
3. Handle edge cases: leading zeros, removing all digits

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** Remove middle digits
- Input: {"num":"1432219","k":3}
- Expected: "1219"

**Test 2:** Remove leading digit
- Input: {"num":"10200","k":1}
- Expected: "200"

**Test 3:** Remove all digits
- Input: {"num":"10","k":2}
- Expected: "0"

---

## 12. Candy

**Difficulty:** hard
**Concept:** greedy
**Family:** greedy:two-pass

### Description

n children standing in line with ratings. Give candies following rules: (1) each child must have at least one candy, (2) children with higher rating than neighbors get more candy. Return minimum total candies needed.

### Key Insight

Two passes: left-to-right ensures right neighbor rule, right-to-left ensures left neighbor rule. Take maximum at each position. Greedy: satisfy each constraint independently.

### Examples

**Example 1:**
- Input: ratings = [1,0,2]
- Output: 5
- Explanation: Give [2,1,2] candies

**Example 2:**
- Input: ratings = [1,2,2]
- Output: 4
- Explanation: Give [1,2,1] candies

### Hints

1. Make two passes through the array
2. First pass: ensure children with higher rating than left neighbor get more
3. Second pass: ensure children with higher rating than right neighbor get more
4. Take the maximum from both passes at each position

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** Valley pattern
- Input: [1,0,2]
- Expected: 5

**Test 2:** Plateau pattern
- Input: [1,2,2]
- Expected: 4

**Test 3:** Complex pattern
- Input: [1,3,2,2,1]
- Expected: 7

---
