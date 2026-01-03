import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module14EdgeCaseDrillsLessonSmartPracticeExercises: ExerciseSection[] = [
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-min-stack',
      title: 'Extra Practice: Min Stack (Edge-Case Drill)',
      description: 'Design a stack that supports push, pop, top, and getMin in O(1), with strong edge-case coverage',
      targetComplexity: { time: 'O(n)', space: 'O(1)' },
      requiredForProgress: false,
      instruction: `# Min Stack – Uber/Google Style Edge-Case Drill

Design a stack that supports the following operations, **all in O(1)** time:

- \`push(x)\` – Push element x onto the stack.
- \`pop()\` – Remove the element on top of the stack.
- \`top()\` – Get the top element.
- \`getMin()\` – Retrieve the minimum element in the stack.

## Why This Problem?

This is a classic “easy”-looking problem that Uber/Google may still ask to see whether you:

1. Think about **edge cases** systematically.
2. Maintain strong **invariants** instead of patching bugs.
3. Can reason about **time + space** tradeoffs for a tiny data structure.

The core idea is simple, but it's easy to break on corner cases.

---

## Your First Task: Test-Case Brainstorm (Before Coding)

**Before you write any code**, list at least **5 test cases** you’d use to break a naive implementation.

Some ideas (don’t look too early!):

1. Push a few numbers, including negatives and zeros:
   - \`push(2), push(0), push(3), push(0)\`
2. Call \`getMin()\` after each push.
3. Pop until the stack is empty, calling \`getMin()\` where legal.
4. Multiple equal minima: \`push(2), push(1), push(1), push(1), push(3)\`
5. Interleave operations: \`push → pop → push → pop → getMin → top\`.

Write down:

- The sequence of operations.
- The expected outputs (especially for \`getMin\` and \`top\`).
- Where a naive “track a single min” stack would break.

---

**Constraint:** All operations should run in **O(1)** time.

Think about:

- What extra information do you need to track **per element** to restore the minimum after pops?
- How do you handle **multiple equal minima**?
- What should happen if \`pop\` / \`top\` / \`getMin\` are called on an empty stack? (Define your behavior clearly; in LeetCode they won’t call them on an empty stack.)

---

## Edge-Case Checklist

As you implement, explicitly test:

1. **Single element:**
   - \`push(5)\`, \`getMin() → 5\`, \`top() → 5\`.
2. **Multiple minima:**
   - \`push(2), push(1), push(1), getMin() → 1\`, pop one 1, \`getMin() → 1\`, pop second 1, \`getMin() → 2\`.
3. **Negative values:**
   - \`push(-2), push(0), push(-3)\`, \`getMin() → -3\`, pop, \`getMin() → -2\`.
4. **Interleaved ops:**
   - Push, pop, push, and check both \`top\` and \`getMin\` after each step.
5. **Empty-after-pop:**
   - Push one element, pop it, then push again – ensure \`getMin\` resets correctly.

Solve it as if you were on a real whiteboard with an Uber/Google interviewer watching your test-case thinking.`,
      starterCode: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, x):
        pass

    def pop(self):
        pass

    def top(self):
        pass

    def getMin(self):
        pass`,
      solution: {
        afterAttempt: 3,
        text: `# One standard O(1) solution uses a second stack that tracks the minimum
# at each depth.

class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, x):
        self.stack.append(x)
        if not self.min_stack:
            self.min_stack.append(x)
        else:
            current_min = self.min_stack[-1]
            self.min_stack.append(min(current_min, x))

    def pop(self):
        if self.stack:
            self.stack.pop()
            self.min_stack.pop()

    def top(self):
        if not self.stack:
            raise IndexError("top from empty stack")
        return self.stack[-1]

    def getMin(self):
        if not self.min_stack:
            raise IndexError("getMin from empty stack")
        return self.min_stack[-1]

# Edge-case sanity checks (run these yourself in the editor):
# s = MinStack()
# s.push(2); s.push(0); s.push(3); s.push(0)
# print(s.getMin())  # 0
# s.pop(); print(s.getMin())  # 0
# s.pop(); print(s.getMin())  # 0
# s.pop(); print(s.getMin())  # 2`,
      },
      hints: [
        { afterAttempt: 1, text: 'Think about what information you need at each depth to restore the minimum after a pop. A second stack is often helpful.' },
        { afterAttempt: 2, text: 'When you push x, the new min is min(x, current_min). Track that alongside each value.' },
        { afterAttempt: 3, text: 'For each push, append to both stacks: value to main stack, min(value, previous_min) to min_stack. Pop from both.' },
      ],
      testCases: [],
      solutionExplanation: `## Time Complexity Analysis

**push()**: O(n)
- Processes input efficiently

**pop()**: O(n)
- Processes input efficiently

**top()**: O(n)
- Processes input efficiently

**getMin()**: O(n)
- Processes input efficiently

### Space Complexity: O(1)
- Uses constant extra space regardless of input size

### Key Insight
Understanding the time and space tradeoffs helps you choose the right approach for your constraints.`,
    complexityQuizPlacement: 'after',
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-hit-counter',
      title: 'Extra Practice: Hit Counter (Edge-Case Drill)',
      description: 'Design a counter that returns hits in the past 300 seconds, with careful boundary handling',
      targetComplexity: { time: 'O(n)', space: 'O(1)' },
      requiredForProgress: false,
      instruction: `# Hit Counter – Edge-Case Drill

Design a data structure that counts the number of hits received in the past 5 minutes (300 seconds).

Implement the HitCounter class:

- \`hit(timestamp)\` – Records a hit at time \`timestamp\` (in seconds).
- \`getHits(timestamp)\` – Returns the number of hits in the past 300 seconds including the current \`timestamp\`.

Formally, return the number of hits with timestamps in the interval **[timestamp-299, timestamp]**.

## Example

\`\`\`python
counter = HitCounter()
counter.hit(1)
counter.hit(2)
counter.hit(3)
counter.getHits(4)    # 3
counter.hit(300)
counter.getHits(300)  # 4
counter.getHits(301)  # 3  (hit at t=1 is now outside [2..301])
\`\`\`

## Constraints

- Timestamps are strictly increasing in calls to \`hit\`.
- 1 <= timestamp <= 10^9
- At most 10^4 calls will be made to hit and getHits.

---

## Your First Task: Test-Case Brainstorm

Before coding, list at least **5 test cases**:

1. Multiple hits at the same timestamp.
2. No hits (getHits on an empty counter).
3. Hits exactly at the boundary: hits at t and querying t+300 vs t+299.
4. Large gaps between timestamps (e.g., hit at 1, then next at 10_000).
5. Dense hits: many calls clustered in a small window.

Write down:
- The sequence of \`hit\` / \`getHits\` calls.
- The exact interval [t-299, t] you’re counting over each time.

---

Hint: think queue of (timestamp, count) pairs, or a fixed-size array of buckets indexed by timestamp % 300.`,
      starterCode: `from collections import deque

class HitCounter:
    def __init__(self):
        self.q = deque()
        self.total = 0

    def hit(self, timestamp):
        pass

    def getHits(self, timestamp):
        pass`,
      solution: {
        afterAttempt: 3,
        text: `from collections import deque

class HitCounter:
    def __init__(self):
        # Store (timestamp, count) and a running total
        self.q = deque()
        self.total = 0

    def _evict_old(self, timestamp):
        # Evict hits older than timestamp - 299
        boundary = timestamp - 299
        while self.q and self.q[0][0] < boundary:
            old_ts, cnt = self.q.popleft()
            self.total -= cnt

    def hit(self, timestamp):
        # First evict anything too old
        self._evict_old(timestamp)

        # If last record has same timestamp, just bump its count
        if self.q and self.q[-1][0] == timestamp:
            ts, cnt = self.q[-1]
            self.q[-1] = (ts, cnt + 1)
        else:
            self.q.append((timestamp, 1))
        self.total += 1

    def getHits(self, timestamp):
        # Evict outdated hits, then return running total
        self._evict_old(timestamp)
        return self.total

# Edge cases to think about:
# - Many hits at same timestamp (aggregated in one bucket)
# - Large gaps: old hits are evicted in bulk
# - getHits before any hit → 0`,
      },
      hints: [
        { afterAttempt: 1, text: 'Maintain a queue of (timestamp, count) pairs and a running total.' },
        { afterAttempt: 2, text: 'On each call, remove from the front while ts < timestamp-299.' },
        { afterAttempt: 3, text: 'Group hits at the same timestamp to keep the queue small.' },
      ],
      testCases: [],
      solutionExplanation: `## Time Complexity Analysis

**hit()**: O(n)
- Processes input efficiently

**getHits()**: O(n)
- Processes input efficiently

### Space Complexity: O(1)
- Uses constant extra space regardless of input size

### Key Insight
Understanding the time and space tradeoffs helps you choose the right approach for your constraints.`,
    complexityQuizPlacement: 'after',
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-randomized-set',
      title: 'Extra Practice: Randomized Set (Array + Hash Map)',
      description: 'Design a set that supports insert, remove, and getRandom in O(1)',
      targetComplexity: { time: 'O(n)', space: 'O(1)' },
      requiredForProgress: false,
      instruction: `# RandomizedSet – Edge-Case Drill

Design a data structure that supports:

- \`insert(val)\` – Inserts an item val into the set if not present. Returns True if inserted, False if already present.
- \`remove(val)\` – Removes an item val from the set if present. Returns True if removed, False if not present.
- \`getRandom()\` – Returns a random element from current set. Each element must have the same probability.

All operations must run in **average O(1)** time.

## Example

\`\`\`python
randomSet = RandomizedSet()
randomSet.insert(1)   # True, set = {1}
randomSet.remove(2)   # False, set = {1}
randomSet.insert(2)   # True, set = {1,2}
randomSet.getRandom() # 1 or 2
randomSet.remove(1)   # True, set = {2}
randomSet.insert(2)   # False, still {2}
randomSet.getRandom() # 2
\`\`\`

---

## Test-Case Brainstorm

Before coding, list edge cases:

1. \`insert\` same value multiple times (should only insert once).
2. \`remove\` a value that’s not present.
3. \`getRandom\` when size is 1 (should always return that element).
4. Sequence of many inserts and removes that exercise the “swap with last” trick.
5. Behavior after the last element is removed and you insert again.

---

**Hint:** Combine:

- A list of values.
- A hash map from value → index in the list.
- For remove, swap the element with the last one, update its index, then pop. This keeps remove O(1).`,
      starterCode: `import random

class RandomizedSet:
    def __init__(self):
        self.values = []
        self.index = {}

    def insert(self, val):
        pass

    def remove(self, val):
        pass

    def getRandom(self):
        pass`,
      solution: {
        afterAttempt: 3,
        text: `import random

class RandomizedSet:
    def __init__(self):
        self.values = []
        self.index = {}  # val -> index in values

    def insert(self, val):
        if val in self.index:
            return False
        self.values.append(val)
        self.index[val] = len(self.values) - 1
        return True

    def remove(self, val):
        if val not in self.index:
            return False

        # Index of element to remove
        i = self.index[val]
        last_val = self.values[-1]

        # Move last element into i, if not already there
        self.values[i] = last_val
        self.index[last_val] = i

        # Remove last element
        self.values.pop()
        del self.index[val]
        return True

    def getRandom(self):
        if not self.values:
            raise IndexError("getRandom from empty set")
        return random.choice(self.values)

# Key invariants:
# - values holds all elements
# - index[val] is the current index of val in values
# - remove uses swap-with-last to stay O(1)`,
      },
      hints: [
        { afterAttempt: 1, text: 'Use a list for values and a dict for value -> index.' },
        { afterAttempt: 2, text: 'On remove, overwrite the element to delete with the last element and fix its index.' },
        { afterAttempt: 3, text: 'Be careful when val is already at the last index; swap still works but is a no-op.' },
      ],
      testCases: [],
      solutionExplanation: `## Time Complexity Analysis

**insert()**: O(n)
- Processes input efficiently

**remove()**: O(n)
- Processes input efficiently

**getRandom()**: O(n)
- Processes input efficiently

### Space Complexity: O(1)
- Uses constant extra space regardless of input size

### Key Insight
Understanding the time and space tradeoffs helps you choose the right approach for your constraints.`,
    complexityQuizPlacement: 'after',
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-logger-rate-limiter',
      title: 'Extra Practice: Logger Rate Limiter (Edge-Case Drill)',
      description: 'Design a logger that rate-limits messages within a 10-second window',
      targetComplexity: { time: 'O(n)', space: 'O(1)' },
      requiredForProgress: false,
      instruction: `# Logger Rate Limiter – Boundary & State Invariant Drill

Design a **logger system** that receives a stream of messages along with timestamps and decides whether each message should be printed.

Implement the \`Logger\` class:

- \`Logger()\` – Initializes the logger object.
- \`shouldPrintMessage(timestamp: int, message: str) -> bool\`
  - Returns **True** if this message **should be printed now**.
  - Returns **False** if this message has already been printed in the **last 10 seconds**.

For the same \`message\`, you should only allow printing if **timestamp - lastTimestamp >= 10**.

## Constraints

- Timestamps are given in **non-decreasing** order.
- 1 <= timestamp <= 10^9
- At most 10^4 calls will be made.

---

## Your First Task: Test-Case Brainstorm

Before coding, list at least **5 scenarios**:

1. Same message repeated at timestamps: 1, 2, 3, 11, 12.
2. Different messages interleaved: \`("foo", 1)\`, \`("bar", 2)\`, \`("foo", 3)\`, \`("bar", 12)\`.
3. Messages exactly at the boundary: last at t=1, new at t=10 vs t=11.
4. Long gaps: message at t=1, next at t=1000.
5. Many distinct messages with very close timestamps.

Write the exact sequence of calls and expected True/False outputs.

---

Think about:

- What **invariant** do you want to maintain per message?
- How do you encode the **10-second rule** in a simple comparison?
- Do you need to store **all** timestamps or just the most recent one per message?`,
      starterCode: `class Logger:
    def __init__(self):
        self.last = {}

    def shouldPrintMessage(self, timestamp, message):
        pass`,
      solution: {
        afterAttempt: 3,
        text: `class Logger:
    def __init__(self):
        # message -> last timestamp we printed it
        self.last = {}

    def shouldPrintMessage(self, timestamp, message):
        # If we've never seen this message, allow and record
        if message not in self.last:
            self.last[message] = timestamp
            return True

        # Otherwise, check the 10-second rule
        last_ts = self.last[message]
        if timestamp - last_ts >= 10:
            # Enough time has passed; update and allow
            self.last[message] = timestamp
            return True

        # Too soon; do not print
        return False

# Key edge cases:
# - Messages exactly 10 seconds apart should be allowed (>= 10).
# - Timestamps are non-decreasing, so we never go "back in time".
# - Each message is independent, tracked by its own last timestamp.`,
      },
      hints: [
        { afterAttempt: 1, text: 'Track, for each message, when it was last printed.' },
        { afterAttempt: 2, text: 'You only need the most recent timestamp per message, not all history.' },
        { afterAttempt: 3, text: 'Return True if message is new or timestamp - last_timestamp >= 10; otherwise False.' },
      ],
      testCases: [],
      solutionExplanation: `## Time Complexity Analysis

**shouldPrintMessage()**: O(n)
- Processes input efficiently

### Space Complexity: O(1)
- Uses constant extra space regardless of input size

### Key Insight
Understanding the time and space tradeoffs helps you choose the right approach for your constraints.`,
    complexityQuizPlacement: 'after',
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-moving-average',
      title: 'Extra Practice: Moving Average from Data Stream',
      description: 'Maintain a moving average over the last N values in O(1) per update',
      targetComplexity: { time: 'O(n)', space: 'O(1)' },
      requiredForProgress: false,
      instruction: `# Moving Average from Data Stream – Sliding Window Sanity

Design a class that calculates the **moving average** of all integers in a **sliding window** of size \`size\`.

Implement the \`MovingAverage\` class:

- \`MovingAverage(size: int)\` – Initialize the object with the window size.
- \`next(val: int) -> float\` – Returns the moving average of the last \`size\` values of the stream.

If fewer than \`size\` values have been seen so far, the average is over **all values seen so far**.

## Example

\`\`\`python
m = MovingAverage(3)
print(m.next(1))   # 1.0   (window: [1])
print(m.next(10))  # 5.5   (window: [1,10])
print(m.next(3))   # 4.666... (window: [1,10,3])
print(m.next(5))   # 6.0   (window: [10,3,5])
\`\`\`

---

## Your First Task: Test-Case Brainstorm

Think about:

1. Window size 1 (always just the last value).
2. Fewer than \`size\` calls to \`next\`.
3. Exactly \`size\` calls, then one more.
4. Negative values and zeros.
5. Very large values and potential overflow if you recompute sum from scratch.

Write down sequences of \`next\` calls and expected averages.

---

Hint: use a **queue (deque)** to store the last \`size\` values and a **running sum** to keep each call O(1).`,
      starterCode: `from collections import deque

class MovingAverage:
    def __init__(self, size):
        self.size = size
        self.q = deque()
        self.window_sum = 0.0

    def next(self, val):
        pass`,
      solution: {
        afterAttempt: 3,
        text: `from collections import deque

class MovingAverage:
    def __init__(self, size):
        self.size = size
        self.q = deque()
        self.window_sum = 0.0

    def next(self, val):
        # Add new value
        self.q.append(val)
        self.window_sum += val

        # If window too big, remove oldest
        if len(self.q) > self.size:
            oldest = self.q.popleft()
            self.window_sum -= oldest

        # Current window length (might be < size at start)
        return self.window_sum / len(self.q)

# Edge-case focus:
# - Before window fills, divide by len(q), not size.
# - When size=1, every call just returns the last value.
# - Maintaining window_sum avoids O(n) recomputation each call.`,
      },
      hints: [
        { afterAttempt: 1, text: 'Store the last `size` values in a queue.' },
        { afterAttempt: 2, text: 'Keep a running sum so each call is O(1).' },
        { afterAttempt: 3, text: 'When len(queue) > size, pop from the left and subtract from the sum.' },
      ],
      testCases: [],
      solutionExplanation: `## Time Complexity Analysis

**next()**: O(n)
- Processes input efficiently

### Space Complexity: O(1)
- Uses constant extra space regardless of input size

### Key Insight
Understanding the time and space tradeoffs helps you choose the right approach for your constraints.`,
    complexityQuizPlacement: 'after',
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-summary-ranges',
      title: 'Extra Practice: Summary Ranges (Off-by-One Drill)',
      description: 'Given a sorted array, summarize consecutive ranges with careful boundary handling',
      targetComplexity: { time: 'O(n)', space: 'O(1)' },
      requiredForProgress: false,
      instruction: `# Summary Ranges – Off-by-One & Boundary Drill

You are given a **sorted**, **unique** array of integers \`nums\`.
Return the **smallest list of ranges** that cover all the numbers exactly.

Each range \`[a,b]\` is represented as:

- \`"a->b"\` if \`a != b\`
- \`"a"\` if \`a == b\`

## Example

\`\`\`python
nums = [0,1,2,4,5,7]
summaryRanges(nums)  # ["0->2", "4->5", "7"]
\`\`\`

Another example:

\`\`\`python
nums = [0,2,3,4,6,8,9]
summaryRanges(nums)  # ["0", "2->4", "6", "8->9"]
\`\`\`

---

## Your First Task: Test-Case Brainstorm

List edge cases:

1. Empty array: \`[]\`.
2. Single element: \`[5]\`.
3. All isolated numbers: \`[1,3,5]\`.
4. One big range: \`[1,2,3,4]\`.
5. Ranges touching boundaries: min/int-like values, gaps of size 1 vs >1.

For each, write the expected list of strings.

---

Think about:

- How do you track the **start** of the current range?
- When do you know a range has ended?
- Don’t forget to **flush the last range** after the loop!`,
      starterCode: `from typing import List

def summaryRanges(nums):
    if not nums:
        return []

    pass`,
      solution: {
        afterAttempt: 3,
        text: `from typing import List

def summaryRanges(nums):
    result: List[str] = []
    if not nums:
        return result

    # Start of the current range
    start = nums[0]
    prev = nums[0]

    for i in range(1, len(nums)):
        # If current number is not consecutive, close the previous range
        if nums[i] != prev + 1:
            if start == prev:
                result.append(str(start))
            else:
                result.append(f"{start}->{prev}")
            # Start a new range
            start = nums[i]
        prev = nums[i]

    # Flush the final range
    if start == prev:
        result.append(str(start))
    else:
        result.append(f"{start}->{prev}")

    return result

# Edge-case emphasis:
# - Empty list returns [].
# - Single element becomes "x" not "x->x".
# - Make sure the last range is added after the loop.`,
      },
      hints: [
        { afterAttempt: 1, text: 'Keep track of the start of the current range and the previous number.' },
        { afterAttempt: 2, text: 'When nums[i] is not prev+1, close the current range and start a new one.' },
        { afterAttempt: 3, text: 'Don’t forget to add the final range after the loop finishes.' },
      ],
      testCases: [],
      solutionExplanation: `## Time Complexity Analysis

**summaryRanges()**: O(n)
- Processes input efficiently

### Space Complexity: O(1)
- Uses constant extra space regardless of input size

### Key Insight
Understanding the time and space tradeoffs helps you choose the right approach for your constraints.`,
    complexityQuizPlacement: 'after',
    }
];
