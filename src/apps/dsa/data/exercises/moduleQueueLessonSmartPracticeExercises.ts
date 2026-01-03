import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const moduleQueueLessonSmartPracticeExercises: ExerciseSection[] = [
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-number-of-recent-calls',
    title: 'Code: Number of Recent Calls',
    description: 'Queue as a time-window: keep only recent events.',
    difficulty: 'easy',
    instruction: `# Number of Recent Calls (LeetCode 933)

Implement the \`RecentCounter\` class.

It counts the number of recent requests within a time frame.

- \`RecentCounter()\` Initializes the counter with zero recent requests.
- \`ping(t)\` adds a new request at time \`t\` (in milliseconds) and returns the number of requests that have happened in the past 3000 ms (inclusive): \`[t - 3000, t]\`.

It is guaranteed that every call to \`ping\` uses a strictly larger value of \`t\` than the previous call.

## Example

Input:

\`\`\`
["RecentCounter","ping","ping","ping","ping"]
[[],[1],[100],[3001],[3002]]
\`\`\`

Output:

\`\`\`
[null,1,2,3,3]
\`\`\``,
    starterCode: `from collections import deque

class RecentCounter:
    def __init__(self):
        pass

    def ping(self, t):
        pass`,
    expectedOutput: `from collections import deque

class RecentCounter:
    def __init__(self):
        self.q = deque()

    def ping(self, t):
        self.q.append(t)
        while self.q and self.q[0] < t - 3000:
            self.q.popleft()
        return len(self.q)`,
    hints: [
      { afterAttempt: 1, question: 'Since times are increasing, which side of the queue will become “too old” first?' },
      { afterAttempt: 2, text: 'Enqueue each t. While front < t - 3000, dequeue. The queue length is the answer.' },
    ],
    solution: {
      afterAttempt: 3,
      text: `## Solution (Queue / Deque) — Amortized O(1)

\`\`\`python
from collections import deque

class RecentCounter:
    def __init__(self):
        self.q = deque()

    def ping(self, t):
        self.q.append(t)
        while self.q and self.q[0] < t - 3000:
            self.q.popleft()
        return len(self.q)
\`\`\``,
    },
    testCases: [
      {
        input: 'rc = RecentCounter(); [rc.ping(1), rc.ping(100), rc.ping(3001), rc.ping(3002)]',
        expectedOutput: '[1, 2, 3, 3]',
      },
      {
        input: 'rc = RecentCounter(); [rc.ping(10), rc.ping(3010), rc.ping(6010)]',
        expectedOutput: '[1, 2, 2]',
      },
    ],
    targetComplexity: { time: 'O(1) amortized', space: 'O(n)' },
    complexityQuizPlacement: 'after',
    requiredForProgress: false,
    solutionExplanation: `## Thinking First: what changes between calls?

Each call asks: **how many request times fall inside the last 3000ms window**.

At time \`t\`, the valid interval is:

\`\`\`
[t - 3000, t]   (inclusive)
\`\`\`

The key constraint is:

> \`t\` is strictly increasing.

So once a request becomes “too old”, it will **never** become valid again.

---

## The Brute-Force Instinct

Store every timestamp, and on each \`ping(t)\` scan the whole list to count how many are \`>= t - 3000\`.

That becomes O(n) per ping.

---

## The Key Observation (Queue Window)

Because times are increasing:

- the oldest request will be the first to leave the window
- once it leaves, it’s gone forever

So we keep a **queue** of only the timestamps still inside the current window.

---

## Queue Invariant

After finishing \`ping(t)\`:

- the queue is in increasing order
- every value in the queue lies in \`[t - 3000, t]\`

---

## Walkthrough (Diagram)

Calls: \`1, 100, 3001, 3002\`

\`\`\`
ping(1):    push 1
            window [-2999..1]
            q = [1]                 -> 1

ping(100):  push 100
            window [-2900..100]
            q = [1, 100]            -> 2

ping(3001): push 3001
            window [1..3001]
            q = [1, 100, 3001]      -> 3   (1 is included)

ping(3002): push 3002
            window [2..3002]
            pop 1 (too old)
            q = [100, 3001, 3002]   -> 3
\`\`\`

---

## Why this is amortized O(1)

Each timestamp is:

- enqueued once
- dequeued once

So total queue operations across N pings is O(N).

---

## Complexity

- **Time:** O(1) amortized per ping
- **Space:** O(window size)`,
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-rotting-oranges',
    title: 'Code: Rotting Oranges',
    description: 'Multi-source BFS with a queue (levels = minutes).',
    difficulty: 'medium',
    instruction: `# Rotting Oranges (LeetCode 994)

You are given an \`m x n\` grid where:

- \`0\` = empty cell
- \`1\` = fresh orange
- \`2\` = rotten orange

Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.

Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return \`-1\`.

## Examples

- Input: \`[[2,1,1],[1,1,0],[0,1,1]]\` → Output: \`4\`
- Input: \`[[2,1,1],[0,1,1],[1,0,1]]\` → Output: \`-1\`
- Input: \`[[0,2]]\` → Output: \`0\``,
    starterCode: `from collections import deque

def orangesRotting(grid):
    pass`,
    expectedOutput: `from collections import deque

def orangesRotting(grid):
    rows, cols = len(grid), len(grid[0])
    q = deque()
    fresh = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                q.append((r, c))
            elif grid[r][c] == 1:
                fresh += 1

    minutes = 0
    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    while q and fresh > 0:
        for _ in range(len(q)):
            r, c = q.popleft()
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    q.append((nr, nc))
        minutes += 1

    return minutes if fresh == 0 else -1`,
    hints: [
      { afterAttempt: 1, question: 'If each “minute” is a BFS level, what should the queue contain initially?' },
      { afterAttempt: 2, text: 'Start by enqueueing all rotten oranges (multi-source BFS). Process level-by-level to count minutes.' },
    ],
    solution: {
      afterAttempt: 3,
      text: `## Solution (BFS Queue) — O(m·n)

\`\`\`python
from collections import deque

def orangesRotting(grid):
    rows, cols = len(grid), len(grid[0])
    q = deque()
    fresh = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                q.append((r, c))
            elif grid[r][c] == 1:
                fresh += 1

    minutes = 0
    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    while q and fresh > 0:
        for _ in range(len(q)):
            r, c = q.popleft()
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    q.append((nr, nc))
        minutes += 1

    return minutes if fresh == 0 else -1
\`\`\``,
    },
    testCases: [
      { input: '[[2,1,1],[1,1,0],[0,1,1]]', expectedOutput: '4' },
      { input: '[[2,1,1],[0,1,1],[1,0,1]]', expectedOutput: '-1' },
      { input: '[[0,2]]', expectedOutput: '0' },
    ],
    targetComplexity: { time: 'O(m·n)', space: 'O(m·n)' },
    complexityQuizPlacement: 'after',
    requiredForProgress: true,
    solutionExplanation: `## Thinking First: “minutes” means BFS levels

This process spreads in **waves**:

- oranges rotten at minute 0
- rot neighbors → oranges rotten at minute 1
- rot neighbors → minute 2
- ...

Whenever a problem says “minimum minutes / steps / layers”, it’s usually BFS.

---

## The Brute-Force Instinct

Simulate minute-by-minute by scanning the whole grid each minute and rotting any fresh orange adjacent to a rotten one.

That does repeated work, because most of the grid doesn’t change each minute.

---

## The Key Observation (Frontier)

Only oranges that are rotten **right now** can rot new oranges next.

So we track a frontier of rotten oranges in a **queue**.

---

## Why Multi-Source BFS?

All initially rotten oranges act simultaneously at minute 0.

So the correct BFS queue initialization is:

- enqueue **all** cells with value 2
- count all fresh oranges

---

## Level-by-Level Template

One BFS “level” = one minute:

\`\`\`
while queue and fresh > 0:
    process exactly len(queue) items   # this is 1 minute
    push newly rotten neighbors
    minutes += 1
\`\`\`

---

## Quick Diagram

Example:

\`\`\`
[2,1,1]
[1,1,0]
[0,1,1]
\`\`\`

Minute 0: queue starts with the \`2\`.  
Minute 1: all adjacent \`1\` become \`2\` and get enqueued.  
Minute 2+: repeat.

If the queue empties but fresh oranges remain, they are unreachable → return \`-1\`.

---

## Complexity

Each cell changes state at most once (fresh → rotten), so:

- **Time:** O(m·n)
- **Space:** O(m·n) worst-case (queue)`,
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-sliding-window-maximum',
    title: 'Code: Sliding Window Maximum',
    description: 'Monotonic deque (queue) for max-in-window in O(n).',
    difficulty: 'hard',
    instruction: `# Sliding Window Maximum (LeetCode 239)

You are given an integer array \`nums\` and an integer \`k\`.

Return an array of the maximum value in each sliding window of size \`k\`.

## Examples

- Input: nums = \`[1,3,-1,-3,5,3,6,7]\`, k = \`3\`  
  Output: \`[3,3,5,5,6,7]\`

- Input: nums = \`[1]\`, k = \`1\`  
  Output: \`[1]\``,
    starterCode: `from collections import deque

def maxSlidingWindow(nums, k):
    pass`,
    expectedOutput: `from collections import deque

def maxSlidingWindow(nums, k):
    dq = deque()  # stores indices, values decreasing
    result = []

    for i, x in enumerate(nums):
        # Remove indices that are out of the window
        while dq and dq[0] <= i - k:
            dq.popleft()

        # Maintain decreasing order: remove smaller values from the back
        while dq and nums[dq[-1]] <= x:
            dq.pop()

        dq.append(i)

        # Window is valid once i >= k - 1
        if i >= k - 1:
            result.append(nums[dq[0]])

    return result`,
    hints: [
      { afterAttempt: 1, question: 'If the front of a deque always holds the max, what invariant must the deque maintain?' },
      { afterAttempt: 2, text: 'Store indices in a deque. Keep values decreasing, pop from back while smaller, pop from front when out of window.' },
    ],
    solution: {
      afterAttempt: 4,
      text: `## Solution (Monotonic Deque) — O(n) time

\`\`\`python
from collections import deque

def maxSlidingWindow(nums, k):
    dq = deque()  # indices, nums[...] decreasing
    result = []

    for i, x in enumerate(nums):
        while dq and dq[0] <= i - k:
            dq.popleft()

        while dq and nums[dq[-1]] <= x:
            dq.pop()

        dq.append(i)

        if i >= k - 1:
            result.append(nums[dq[0]])

    return result
\`\`\``,
    },
    testCases: [
      { input: '[1,3,-1,-3,5,3,6,7], 3', expectedOutput: '[3, 3, 5, 5, 6, 7]' },
      { input: '[1], 1', expectedOutput: '[1]' },
      { input: '[9,11], 2', expectedOutput: '[11]' },
    ],
    targetComplexity: { time: 'O(n)', space: 'O(k)' },
    complexityQuizPlacement: 'after',
    requiredForProgress: true,
    solutionExplanation: `## Thinking First: why isn’t brute force good enough?

Brute force:

- for every window, scan all \`k\` elements to find the max

That is O(n·k).

But windows overlap heavily — we should reuse information.

---

## What you actually need

When the window slides:

- elements fall out from the left
- new elements enter from the right

We need a structure that can:

1. remove “out of window” elements fast
2. tell us the current maximum fast

A deque can do (1). To do (2), we store only **max candidates**.

---

## Monotonic Deque Invariant

Store indices in a deque such that:

1. The deque’s indices are always within the current window.
2. The values are **decreasing** from front → back.

Then the max is always at the front:

\`\`\`
max = nums[dq[0]]
\`\`\`

Why pop from the back?

If a new value \`x\` arrives and it’s >= a value at the back, that smaller value can never become the maximum again (it’s older and already beaten).

---

## Walkthrough (Diagram)

nums = \`[1,3,-1,-3,5,3,6,7]\`, k = 3  
Write deque as indices(values).

\`\`\`
i=0 (1):   dq=[0(1)]
i=1 (3):   pop 0(1)   dq=[1(3)]
i=2 (-1):  dq=[1(3),2(-1)]   -> max=3

i=3 (-3):  dq=[1(3),2(-1),3(-3)] -> max=3

i=4 (5):   remove out-of-window: pop left 1(3)
           pop smaller from back: pop 3(-3), pop 2(-1)
           dq=[4(5)]             -> max=5
\`\`\`

---

## Why this is O(n)

Each index is appended once and removed once (from either end), so total deque operations are linear.

---

## Complexity

- **Time:** O(n)
- **Space:** O(k)`,
  },
];


