import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const moduleStackLessonSmartPracticeExercises: ExerciseSection[] = [
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-valid-parentheses',
    title: 'Code: Valid Parentheses',
    description: 'Match brackets using a stack (classic LIFO).',
    difficulty: 'easy',
    instruction: `# Valid Parentheses (LeetCode 20)

Given a string \`s\` containing just the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\`, and \`]\`, determine if the input string is valid.

A string is valid if:

- Open brackets must be closed by the same type of brackets.
- Open brackets must be closed in the correct order.
- Every close bracket has a corresponding open bracket.

## Examples

- Input: \`s = "()"\` → Output: \`True\`
- Input: \`s = "()[]{}"\` → Output: \`True\`
- Input: \`s = "(]"\` → Output: \`False\`
- Input: \`s = "([)]"\` → Output: \`False\`
- Input: \`s = "{[]}"\` → Output: \`True\``,
    starterCode: `def isValid(s):
    pass`,
    expectedOutput: `def isValid(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []

    for ch in s:
        if ch in '([{':
            stack.append(ch)
        else:
            if not stack or stack[-1] != pairs.get(ch):
                return False
            stack.pop()

    return len(stack) == 0`,
    hints: [
      { afterAttempt: 1, question: 'What structure is best for checking the most recent unmatched opening bracket?' },
      { afterAttempt: 2, text: 'Push opening brackets. On a closing bracket, the top of the stack must match.' },
    ],
    solution: {
      afterAttempt: 3,
      text: `## Solution (Stack) — O(n) time

\`\`\`python
def isValid(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []

    for ch in s:
        if ch in '([{':
            stack.append(ch)
        else:
            if not stack or stack[-1] != pairs.get(ch):
                return False
            stack.pop()

    return len(stack) == 0
\`\`\``,
    },
    testCases: [
      { input: '"()"', expectedOutput: 'True' },
      { input: '"()[]{}"', expectedOutput: 'True' },
      { input: '"(]"', expectedOutput: 'False' },
      { input: '"([)]"', expectedOutput: 'False' },
      { input: '"{[]}"', expectedOutput: 'True' },
    ],
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    complexityQuizPlacement: 'after',
    requiredForProgress: true,
    solutionExplanation: `## Thinking First: what does “valid” really mean?

The key constraint is **order**:

- The **last** opening bracket you saw must be the **first** one you close.
- Nested pairs close **inside-out**.

That’s exactly the **LIFO** rule.

---

## The Brute-Force Instinct (and why it’s not the point)

A common first thought is: keep deleting \`()\`, \`[]\`, and \`{}\` until nothing changes.

That approach:

- is awkward to implement cleanly
- can degrade toward O(n²)
- hides the real invariant you need for interviews

---

## The Key Observation

When you read left → right, and you see a closing bracket like \`)\`, the only opening bracket that matters is:

> the most recent **unmatched** opening bracket

So we need a data structure that can always give us “most recent unmatched” in O(1) → a **stack**.

---

## The Stack Invariant

After processing the prefix of the string up to index \`i\`:

- the stack contains **exactly** the opening brackets that are still waiting to be closed
- the **top** of the stack is the one that must be closed next

---

## Walkthrough (Diagram)

Example: \`s = "{[]}"\`

\`\`\`
Read '{'  -> push '{'                 stack: {
Read '['  -> push '['                 stack: { [
Read ']'  -> matches '['  -> pop      stack: {
Read '}'  -> matches '{'  -> pop      stack: empty
\`\`\`

Mismatch example: \`s = "([)]"\`

\`\`\`
Read '('  -> push '('                 stack: (
Read '['  -> push '['                 stack: ( [
Read ')'  -> needs '(' but top is '[' -> invalid
\`\`\`

---

## Complexity

- **Time:** O(n) — one pass
- **Space:** O(n) worst-case — all openings`,
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-evaluate-reverse-polish-notation',
    title: 'Code: Evaluate Reverse Polish Notation',
    description: 'Use a stack to evaluate an expression from left to right.',
    difficulty: 'medium',
    instruction: `# Evaluate Reverse Polish Notation (LeetCode 150)

You are given an array of strings \`tokens\` that represents an arithmetic expression in **Reverse Polish Notation**.

Evaluate the expression and return an integer result.

Valid operators are \`+\`, \`-\`, \`*\`, and \`/\`.

Division between two integers should truncate toward zero.

## Examples

- Input: \`tokens = ["2","1","+","3","*"]\` → Output: \`9\`
- Input: \`tokens = ["4","13","5","/","+"]\` → Output: \`6\`
- Input: \`tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]\` → Output: \`22\``,
    starterCode: `def evalRPN(tokens):
    pass`,
    expectedOutput: `def evalRPN(tokens):
    stack = []
    for t in tokens:
        if t in {"+", "-", "*", "/"}:
            b = stack.pop()
            a = stack.pop()
            if t == "+":
                stack.append(a + b)
            elif t == "-":
                stack.append(a - b)
            elif t == "*":
                stack.append(a * b)
            else:
                # truncate toward zero
                stack.append(int(a / b))
        else:
            stack.append(int(t))
    return stack[-1]`,
    hints: [
      { afterAttempt: 1, question: 'When you see an operator, which two numbers should it apply to?' },
      { afterAttempt: 2, text: 'Push numbers. On an operator, pop b then a, compute a op b, then push the result.' },
    ],
    solution: {
      afterAttempt: 3,
      text: `## Solution (Stack) — O(n) time

\`\`\`python
def evalRPN(tokens):
    stack = []
    for t in tokens:
        if t in {"+", "-", "*", "/"}:
            b = stack.pop()
            a = stack.pop()
            if t == "+":
                stack.append(a + b)
            elif t == "-":
                stack.append(a - b)
            elif t == "*":
                stack.append(a * b)
            else:
                stack.append(int(a / b))  # truncate toward 0
        else:
            stack.append(int(t))
    return stack[-1]
\`\`\``,
    },
    testCases: [
      { input: '["2","1","+","3","*"]', expectedOutput: '9' },
      { input: '["4","13","5","/","+"]', expectedOutput: '6' },
      { input: '["10","6","9","3","+","-11","*","/","*","17","+","5","+"]', expectedOutput: '22' },
    ],
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    complexityQuizPlacement: 'after',
    requiredForProgress: true,
    solutionExplanation: `## Thinking First: what does RPN force you to do?

In Reverse Polish Notation, the operator comes **after** its operands.

So when you see an operator, you must apply it to the **two values you most recently produced**.

That is a LIFO rule → **stack**.

---

## The Brute-Force Instinct

If this were infix notation (like \`(2 + 1) * 3\`), you might think you need parentheses handling, precedence rules, or parsing.

RPN removes all of that. The token order already encodes the evaluation order.

---

## The Stack Invariant

After reading tokens up to index \`i\`, the stack holds:

- the values of all fully-evaluated sub-expressions so far

When you see an operator:

1. pop \`b\`
2. pop \`a\`
3. compute \`a op b\`
4. push the result

---

## Walkthrough (Diagram)

Example: \`tokens = ["2","1","+","3","*"]\`

\`\`\`
token "2"  -> push 2              stack: [2]
token "1"  -> push 1              stack: [2, 1]
token "+"  -> pop 1, pop 2 -> 3   stack: [3]
token "3"  -> push 3              stack: [3, 3]
token "*"  -> pop 3, pop 3 -> 9   stack: [9]
\`\`\`

Answer is the final stack top: \`9\`.

---

## About Division

The problem wants integer division that truncates toward 0. In Python, \`int(a / b)\` does that truncation for both positive and negative results.

---

## Complexity

- **Time:** O(n) — each token processed once
- **Space:** O(n) — stack size in the worst case`,
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-daily-temperatures',
    title: 'Code: Daily Temperatures',
    description: 'Monotonic stack: next greater element to the right.',
    difficulty: 'medium',
    instruction: `# Daily Temperatures (LeetCode 739)

Given an array \`temperatures\`, return an array \`answer\` such that \`answer[i]\` is the number of days you have to wait after the \`i\`th day to get a warmer temperature.

If there is no future day for which this is possible, keep \`answer[i] == 0\`.

## Examples

- Input: \`[73,74,75,71,69,72,76,73]\` → Output: \`[1,1,4,2,1,1,0,0]\`
- Input: \`[30,40,50,60]\` → Output: \`[1,1,1,0]\`
- Input: \`[30,60,90]\` → Output: \`[1,1,0]\``,
    starterCode: `def dailyTemperatures(temperatures):
    pass`,
    expectedOutput: `def dailyTemperatures(temperatures):
    n = len(temperatures)
    ans = [0] * n
    stack = []  # indices of a decreasing stack

    for i, t in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < t:
            j = stack.pop()
            ans[j] = i - j
        stack.append(i)

    return ans`,
    hints: [
      { afterAttempt: 1, question: 'What information do you need to remember for “who is still waiting for a warmer day”?' },
      { afterAttempt: 2, text: 'Maintain a decreasing stack of indices. When you see a warmer temp, pop and resolve waits.' },
    ],
    solution: {
      afterAttempt: 3,
      text: `## Solution (Monotonic Stack) — O(n) time

\`\`\`python
def dailyTemperatures(temperatures):
    n = len(temperatures)
    ans = [0] * n
    stack = []  # indices, temps decreasing

    for i, t in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < t:
            j = stack.pop()
            ans[j] = i - j
        stack.append(i)

    return ans
\`\`\`

Each index is pushed once and popped once → O(n).`,
    },
    testCases: [
      { input: '[73,74,75,71,69,72,76,73]', expectedOutput: '[1,1,4,2,1,1,0,0]' },
      { input: '[30,40,50,60]', expectedOutput: '[1,1,1,0]' },
      { input: '[30,60,90]', expectedOutput: '[1,1,0]' },
    ],
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    complexityQuizPlacement: 'after',
    requiredForProgress: true,
    solutionExplanation: `## Thinking First: what is the question really asking?

For each day \`i\`, you need the **first** day \`j > i\` such that:

\`\`\`
temperatures[j] > temperatures[i]
\`\`\`

That is the classic pattern: **Next Greater Element to the Right**.

---

## The Brute-Force Instinct (and the duplicated work)

Brute force is:

1. For each \`i\`
2. Scan \`i+1, i+2, ...\` until you find a warmer day

That can be O(n²) because you re-scan overlapping suffixes.

More importantly, it misses the key “aha”:

> One warm day can answer **many** previous days at once.

---

## The Core Insight: “Waiting room” indices

As you scan left → right:

- Some days are still waiting to find a warmer day in the future.
- When you finally see a warmer temperature, it resolves those waiting days.

So we keep a stack of indices that are **still waiting**.

---

## The Monotonic Stack Invariant

Store indices in a stack such that:

- temperatures are **strictly decreasing** from bottom → top.

Why decreasing?

- If day A is hotter than day B and A is earlier, then B can never be the answer for anyone “before A” once A exists.
- Smaller temperatures on top get resolved first when a warmer day appears.

---

## Walkthrough (Diagram)

Example: \`[73,74,75,71,69,72,76,73]\`

We’ll write stack entries as \`index(temp)\`.

\`\`\`
i=0, t=73: stack=[]            -> push 0(73)
            stack=[0(73)]

i=1, t=74: 74 > 73             -> pop 0, answer[0]=1
            stack=[]            -> push 1(74)
            stack=[1(74)]

i=2, t=75: 75 > 74             -> pop 1, answer[1]=1
            stack=[]            -> push 2(75)
            stack=[2(75)]

i=3, t=71: 71 not > 75         -> push 3(71)
            stack=[2(75), 3(71)]

i=4, t=69: 69 not > 71         -> push 4(69)
            stack=[2(75), 3(71), 4(69)]

i=5, t=72: 72 > 69             -> pop 4, answer[4]=1
            72 > 71             -> pop 3, answer[3]=2
            72 not > 75         -> push 5(72)
            stack=[2(75), 5(72)]

i=6, t=76: 76 > 72             -> pop 5, answer[5]=1
            76 > 75             -> pop 2, answer[2]=4
            push 6(76)
            stack=[6(76)]
\`\`\`

Any indices left in the stack at the end never found a warmer day → their answer stays 0.

---

## Why this is O(n)

Each index:

- is pushed once
- is popped once

So total stack operations are O(2n) → O(n).

---

## Complexity

- **Time:** O(n)
- **Space:** O(n)`,
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-largest-rectangle-histogram',
    title: 'Code: Largest Rectangle in Histogram',
    description: 'Advanced monotonic stack: compute max area in O(n).',
    difficulty: 'hard',
    instruction: `# Largest Rectangle in Histogram (LeetCode 84)

Given an array of integers \`heights\` representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.

## Examples

- Input: \`heights = [2,1,5,6,2,3]\` → Output: \`10\`
- Input: \`heights = [2,4]\` → Output: \`4\``,
    starterCode: `def largestRectangleArea(heights):
    pass`,
    expectedOutput: `def largestRectangleArea(heights):
    stack = []  # (start_index, height)
    best = 0

    for i, h in enumerate(heights + [0]):  # sentinel flush
        start = i
        while stack and stack[-1][1] > h:
            idx, height = stack.pop()
            best = max(best, height * (i - idx))
            start = idx
        stack.append((start, h))

    return best`,
    hints: [
      { afterAttempt: 1, question: 'When a bar is “too short”, which previous bars can no longer extend past this index?' },
      { afterAttempt: 2, text: 'Use a monotonic increasing stack of (startIndex, height). Add a 0 at the end to flush.' },
    ],
    solution: {
      afterAttempt: 4,
      text: `## Solution (Monotonic Stack + Sentinel) — O(n) time

\`\`\`python
def largestRectangleArea(heights):
    stack = []  # (start_index, height)
    best = 0

    for i, h in enumerate(heights + [0]):
        start = i
        while stack and stack[-1][1] > h:
            idx, height = stack.pop()
            best = max(best, height * (i - idx))
            start = idx
        stack.append((start, h))

    return best
\`\`\``,
    },
    testCases: [
      { input: '[2,1,5,6,2,3]', expectedOutput: '10' },
      { input: '[2,4]', expectedOutput: '4' },
      { input: '[1,1,1,1]', expectedOutput: '4' },
    ],
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    complexityQuizPlacement: 'after',
    requiredForProgress: false,
    solutionExplanation: `## Thinking First: what makes a rectangle “stop”?

If you choose a bar of height \`h\` as the limiting height, that rectangle can expand left/right **until you hit a bar shorter than \`h\`**.

So for each bar, you want to know:

- the first shorter bar on the left
- the first shorter bar on the right

That’s a monotonic stack problem (nearest smaller elements).

---

## The Brute-Force Instinct

For every bar \`i\`:

- expand left while bars ≥ height[i]
- expand right while bars ≥ height[i]

This can be O(n²).

---

## The Key Observation

When you scan left → right, the moment you see a bar that is **lower** than previous bars,
those previous taller bars can no longer extend past the current index.

That means:

> “A drop in height finalises rectangles.”

So we process rectangles exactly when they become impossible to extend.

---

## Monotonic Stack Invariant (Increasing Heights)

Maintain a stack of pairs \`(startIndex, height)\` with strictly increasing heights.

Interpretation:

- Each pair says: “a rectangle of this height could start at startIndex and extend to the current position.”

---

## Walkthrough (Diagram)

Example: \`heights = [2, 1, 5, 6, 2, 3]\`

We append a sentinel \`0\` at the end to flush everything.

\`\`\`
stack holds (start, height)

i=0, h=2: push (0,2)
  stack=[(0,2)]

i=1, h=1: drop! pop (0,2) -> area = 2 * (1-0) = 2
          start becomes 0
          push (0,1)
  stack=[(0,1)]

i=2, h=5: push (2,5)
  stack=[(0,1),(2,5)]

i=3, h=6: push (3,6)
  stack=[(0,1),(2,5),(3,6)]

i=4, h=2: drop! pop (3,6) -> area = 6 * (4-3) = 6, start=3
          pop (2,5) -> area = 5 * (4-2) = 10, start=2
          push (2,2)
  stack=[(0,1),(2,2)]

i=5, h=3: push (5,3)
  stack=[(0,1),(2,2),(5,3)]

i=6, h=0: sentinel drop flushes:
          pop (5,3) -> area = 3 * (6-5) = 3
          pop (2,2) -> area = 2 * (6-2) = 8
          pop (0,1) -> area = 1 * (6-0) = 6
\`\`\`

Maximum area we saw is 10.

---

## Why this is O(n)

Each bar is pushed once and popped once, so total work is linear.

---

## Complexity

- **Time:** O(n)
- **Space:** O(n)`,
  },

  // ============================================================================
  // GROUP 1: Core Next/Previous Variants
  // ============================================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-next-greater-element',
    title: 'Next Greater Element (Right)',
    description: 'Find the first greater element to the right for each index',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Next Greater Element

Given an array \`nums\`, return an array where each index contains the first element to the **right** that is strictly greater than \`nums[i]\`, or \`-1\` if none exists.

## Examples

\`\`\`
Input: nums = [4, 5, 2, 10, 8]
Output: [5, 10, 10, -1, -1]

Input: nums = [3, 2, 1]
Output: [-1, -1, -1]
\`\`\`

## Constraints

- 1 <= nums.length <= 10^5
- -10^9 <= nums[i] <= 10^9

## Hidden Insight

When you see a larger element, which previous elements get their answer?`,
    starterCode: `def nextGreaterElement(nums):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Use a stack to track elements waiting for a greater element.' },
      { afterAttempt: 2, text: 'Decreasing monotonic stack: when you see a larger element, pop and resolve.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def nextGreaterElement(nums):
    n = len(nums)
    result = [-1] * n
    stack = []  # indices

    for i in range(n):
        while stack and nums[stack[-1]] < nums[i]:
            j = stack.pop()
            result[j] = nums[i]
        stack.append(i)

    return result`
    },
    solutionExplanation: `## Decreasing Monotonic Stack

Stack holds indices of elements waiting for their next greater.

When nums[i] > stack top, it's the answer for that waiting element.`,
    testCases: [
      { input: '[4, 5, 2, 10, 8]', expectedOutput: '[5, 10, 10, -1, -1]' },
      { input: '[3, 2, 1]', expectedOutput: '[-1, -1, -1]' },
      { input: '[1, 2, 3]', expectedOutput: '[2, 3, -1]' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-next-smaller-element',
    title: 'Next Smaller Element (Right)',
    description: 'Find the first smaller element to the right',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Next Smaller Element

Return an array where each index contains the nearest element to the right that is **strictly smaller** than \`nums[i]\`, or \`-1\`.

## Examples

\`\`\`
Input: nums = [4, 8, 5, 2, 25]
Output: [2, 5, 2, -1, -1]

Input: nums = [1, 2, 3]
Output: [-1, -1, -1]
\`\`\`

## Hidden Insight

How does the stack invariant change from "next greater"?`,
    starterCode: `def nextSmallerElement(nums):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Use an increasing monotonic stack instead of decreasing.' },
      { afterAttempt: 2, text: 'Pop when you see a smaller element.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def nextSmallerElement(nums):
    n = len(nums)
    result = [-1] * n
    stack = []  # indices

    for i in range(n):
        while stack and nums[stack[-1]] > nums[i]:
            j = stack.pop()
            result[j] = nums[i]
        stack.append(i)

    return result`
    },
    solutionExplanation: `## Increasing Monotonic Stack

The only change: stack holds increasing values, pop when you see smaller.

Mirror of next greater element.`,
    testCases: [
      { input: '[4, 8, 5, 2, 25]', expectedOutput: '[2, 5, 2, -1, -1]' },
      { input: '[1, 2, 3]', expectedOutput: '[-1, -1, -1]' },
      { input: '[3, 2, 1]', expectedOutput: '[2, 1, -1]' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-previous-greater-element',
    title: 'Previous Greater Element',
    description: 'Find the closest greater element on the left',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Previous Greater Element

For each index, return the closest greater element on the **left**, or \`-1\`.

## Examples

\`\`\`
Input: nums = [10, 4, 2, 20, 40, 12, 30]
Output: [-1, 10, 4, -1, -1, 40, 40]
\`\`\`

## Hidden Insight

Process left to right. The stack now gives you the answer directly (no waiting).`,
    starterCode: `def previousGreaterElement(nums):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Maintain decreasing stack. Answer is stack top after popping smaller elements.' },
      { afterAttempt: 2, text: 'Pop elements smaller than current, then peek for the answer.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def previousGreaterElement(nums):
    n = len(nums)
    result = [-1] * n
    stack = []  # values (or indices)

    for i in range(n):
        while stack and stack[-1] <= nums[i]:
            stack.pop()
        if stack:
            result[i] = stack[-1]
        stack.append(nums[i])

    return result`
    },
    solutionExplanation: `## Previous vs Next

For "previous" problems, the stack gives the answer immediately (peek after popping).

For "next" problems, you resolve answers when popping.`,
    testCases: [
      { input: '[10, 4, 2, 20, 40, 12, 30]', expectedOutput: '[-1, 10, 4, -1, -1, 40, 40]' },
      { input: '[1, 2, 3]', expectedOutput: '[-1, -1, -1]' },
      { input: '[3, 2, 1]', expectedOutput: '[-1, 3, 2]' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-previous-smaller-element',
    title: 'Previous Smaller Element',
    description: 'Find the closest smaller element on the left',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Previous Smaller Element

For each index, return the closest smaller element on the **left**, or \`-1\`.

## Examples

\`\`\`
Input: nums = [1, 6, 4, 10, 2, 5]
Output: [-1, 1, 1, 4, 1, 2]
\`\`\`

## Hidden Insight

This is fundamental for "Sum of Subarray Minimums".`,
    starterCode: `def previousSmallerElement(nums):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Increasing stack. Pop elements >= current, peek for answer.' }
    ],
    solution: {
      afterAttempt: 1,
      text: `def previousSmallerElement(nums):
    n = len(nums)
    result = [-1] * n
    stack = []

    for i in range(n):
        while stack and stack[-1] >= nums[i]:
            stack.pop()
        if stack:
            result[i] = stack[-1]
        stack.append(nums[i])

    return result`
    },
    solutionExplanation: `## Increasing Stack for Previous Smaller

Pop all >= current, then stack top (if exists) is the previous smaller.`,
    testCases: [
      { input: '[1, 6, 4, 10, 2, 5]', expectedOutput: '[-1, 1, 1, 4, 1, 2]' },
      { input: '[3, 2, 1]', expectedOutput: '[-1, -1, -1]' },
      { input: '[1, 2, 3]', expectedOutput: '[-1, 1, 2]' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-circular-next-greater',
    title: 'Next Greater Element II (Circular)',
    description: 'Find next greater treating array as circular',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Next Greater Element II (LeetCode 503)

Treat the array as circular. Return the next greater element for each index.

## Examples

\`\`\`
Input: nums = [1, 2, 1]
Output: [2, -1, 2]

Explanation: For index 2, wrap around to find 2 at index 1.
\`\`\`

## Constraints

- 1 <= nums.length <= 10^4

## Hidden Insight

Process the array twice (or use modulo indexing).`,
    starterCode: `def nextGreaterElements(nums):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Process indices 0 to 2n-1, using i % n for the actual index.' },
      { afterAttempt: 2, text: 'Only push indices from first pass. Second pass just resolves.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def nextGreaterElements(nums):
    n = len(nums)
    result = [-1] * n
    stack = []

    # Process twice to handle circular
    for i in range(2 * n):
        idx = i % n
        while stack and nums[stack[-1]] < nums[idx]:
            j = stack.pop()
            result[j] = nums[idx]
        if i < n:
            stack.append(i)

    return result`
    },
    solutionExplanation: `## Circular Trick

Process array twice. First pass pushes indices, second pass only resolves.

Use modulo to wrap around.`,
    testCases: [
      { input: '[1, 2, 1]', expectedOutput: '[2, -1, 2]' },
      { input: '[1, 2, 3, 4, 3]', expectedOutput: '[2, 3, 4, -1, 4]' },
      { input: '[5, 4, 3, 2, 1]', expectedOutput: '[-1, 5, 5, 5, 5]' }
    ],
    requiredForProgress: true
  },

  // ============================================================================
  // GROUP 2: Index-based Variants
  // ============================================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-distance-next-greater',
    title: 'Distance to Next Greater',
    description: 'Return distance to the next strictly greater element',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Distance to Next Greater

Return an array where each index contains the **distance** to the next strictly greater element on the right, or \`0\` if none.

## Examples

\`\`\`
Input: nums = [4, 10, 5, 2, 25]
Output: [1, 4, 2, 1, 0]

Explanation:
- 4: next greater is 10, distance = 1
- 10: next greater is 25, distance = 4
- 5: next greater is 25, distance = 2
\`\`\`

## Hidden Insight

This is Daily Temperatures generalized!`,
    starterCode: `def distanceToNextGreater(nums):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Same as Daily Temperatures but for any values, not just temperatures.' }
    ],
    solution: {
      afterAttempt: 1,
      text: `def distanceToNextGreater(nums):
    n = len(nums)
    result = [0] * n
    stack = []

    for i in range(n):
        while stack and nums[stack[-1]] < nums[i]:
            j = stack.pop()
            result[j] = i - j
        stack.append(i)

    return result`
    },
    solutionExplanation: `## Index Difference

Store indices in stack. When resolving, distance = current_index - popped_index.`,
    testCases: [
      { input: '[4, 10, 5, 2, 25]', expectedOutput: '[1, 4, 2, 1, 0]' },
      { input: '[3, 2, 1]', expectedOutput: '[0, 0, 0]' },
      { input: '[1, 2, 3]', expectedOutput: '[1, 1, 0]' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-distance-previous-smaller',
    title: 'Distance to Previous Smaller',
    description: 'How many indices left to find a smaller value',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Distance to Previous Smaller

Return an array where each index contains how many steps left you must move to find a strictly smaller value, or \`0\` if none.

## Examples

\`\`\`
Input: nums = [3, 5, 2, 4, 5]
Output: [0, 1, 0, 1, 1]

Explanation:
- Index 1 (val 5): 1 step left to find 3
- Index 3 (val 4): 1 step left to find 2
\`\`\``,
    starterCode: `def distanceToPrevSmaller(nums):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Store indices, answer is i - stack_top after popping >= elements.' }
    ],
    solution: {
      afterAttempt: 1,
      text: `def distanceToPrevSmaller(nums):
    n = len(nums)
    result = [0] * n
    stack = []  # indices

    for i in range(n):
        while stack and nums[stack[-1]] >= nums[i]:
            stack.pop()
        if stack:
            result[i] = i - stack[-1]
        stack.append(i)

    return result`
    },
    solutionExplanation: `## Index-Based Previous Smaller

Answer for index i is: i - index_of_previous_smaller (or 0 if none).`,
    testCases: [
      { input: '[3, 5, 2, 4, 5]', expectedOutput: '[0, 1, 0, 1, 1]' },
      { input: '[1, 2, 3]', expectedOutput: '[0, 1, 2]' },
      { input: '[3, 2, 1]', expectedOutput: '[0, 0, 0]' }
    ],
    requiredForProgress: true
  },

  // ============================================================================
  // GROUP 3: Range Influence / Contribution Problems
  // ============================================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-stock-span',
    title: 'Stock Span',
    description: 'Count consecutive days with price <= today',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Stock Span Problem

For each day, return the number of consecutive days before it (including today) where the price was less than or equal to today's price.

## Examples

\`\`\`
Input: prices = [100, 80, 60, 70, 60, 75, 85]
Output: [1, 1, 1, 2, 1, 4, 6]

Day 5 (75): prices 60, 70, 60 all <= 75, span = 4
Day 6 (85): prices 75, 60, 70, 60, 80 all <= 85, span = 6
\`\`\`

## Hidden Insight

This is "distance to previous greater" + 1.`,
    starterCode: `def stockSpan(prices):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Stack holds indices with strictly greater prices.' },
      { afterAttempt: 2, text: 'Span = i - index_of_previous_greater (or i + 1 if none).' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def stockSpan(prices):
    n = len(prices)
    result = [0] * n
    stack = []  # indices of decreasing prices

    for i in range(n):
        while stack and prices[stack[-1]] <= prices[i]:
            stack.pop()
        if stack:
            result[i] = i - stack[-1]
        else:
            result[i] = i + 1
        stack.append(i)

    return result`
    },
    solutionExplanation: `## Span = Distance to Previous Greater

Pop all prices <= current. The remaining stack top (if any) is the first day with higher price.

Span = i - that_index (or i + 1 if none).`,
    testCases: [
      { input: '[100, 80, 60, 70, 60, 75, 85]', expectedOutput: '[1, 1, 1, 2, 1, 4, 6]' },
      { input: '[10, 20, 30]', expectedOutput: '[1, 2, 3]' },
      { input: '[30, 20, 10]', expectedOutput: '[1, 1, 1]' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-sum-subarray-minimums',
    title: 'Sum of Subarray Minimums',
    description: 'Sum of minimum values across all subarrays',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Sum of Subarray Minimums (LeetCode 907)

Return the sum of \`min(subarray)\` for every contiguous subarray.

Return result modulo \`10^9 + 7\`.

## Examples

\`\`\`
Input: arr = [3, 1, 2, 4]
Output: 17

Subarrays and minimums:
[3]=3, [1]=1, [2]=2, [4]=4
[3,1]=1, [1,2]=1, [2,4]=2
[3,1,2]=1, [1,2,4]=1
[3,1,2,4]=1
Sum = 3+1+2+4+1+1+2+1+1+1 = 17
\`\`\`

## Hidden Insight

For each element, count how many subarrays it's the minimum of.

Use previous smaller (left bound) and next smaller (right bound).`,
    starterCode: `def sumSubarrayMins(arr):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'For each arr[i], find left bound (prev smaller) and right bound (next smaller).' },
      { afterAttempt: 2, text: 'Contribution = arr[i] * (i - left) * (right - i).' },
      { afterAttempt: 3, text: 'Handle duplicates: use < on one side and <= on the other.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `def sumSubarrayMins(arr):
    MOD = 10**9 + 7
    n = len(arr)

    # Previous smaller (strict)
    prev_smaller = [-1] * n
    stack = []
    for i in range(n):
        while stack and arr[stack[-1]] >= arr[i]:
            stack.pop()
        prev_smaller[i] = stack[-1] if stack else -1
        stack.append(i)

    # Next smaller or equal
    next_smaller = [n] * n
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and arr[stack[-1]] > arr[i]:
            stack.pop()
        next_smaller[i] = stack[-1] if stack else n
        stack.append(i)

    # Sum contributions
    result = 0
    for i in range(n):
        left = i - prev_smaller[i]
        right = next_smaller[i] - i
        result = (result + arr[i] * left * right) % MOD

    return result`
    },
    solutionExplanation: `## Contribution Counting

For element at index i:
- left = number of ways to start subarray (i - prev_smaller[i])
- right = number of ways to end subarray (next_smaller[i] - i)
- contribution = arr[i] * left * right

Handle duplicates: one bound is strict (<), one is non-strict (<=).`,
    testCases: [
      { input: '[3, 1, 2, 4]', expectedOutput: '17' },
      { input: '[11, 81, 94, 43, 3]', expectedOutput: '444' },
      { input: '[1, 1, 1]', expectedOutput: '6' }
    ],
    requiredForProgress: false
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-sum-subarray-maximums',
    title: 'Sum of Subarray Maximums',
    description: 'Sum of maximum values across all subarrays',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Sum of Subarray Maximums

Return the sum of \`max(subarray)\` for every contiguous subarray.

Return result modulo \`10^9 + 7\`.

## Examples

\`\`\`
Input: arr = [3, 1, 2, 4]
Output: 30

Explanation: Similar to sum of minimums, but using maximums.
\`\`\`

## Hidden Insight

Mirror of Sum of Subarray Minimums using previous/next greater.`,
    starterCode: `def sumSubarrayMaxs(arr):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Use previous greater and next greater instead of smaller.' }
    ],
    solution: {
      afterAttempt: 1,
      text: `def sumSubarrayMaxs(arr):
    MOD = 10**9 + 7
    n = len(arr)

    # Previous greater (strict)
    prev_greater = [-1] * n
    stack = []
    for i in range(n):
        while stack and arr[stack[-1]] <= arr[i]:
            stack.pop()
        prev_greater[i] = stack[-1] if stack else -1
        stack.append(i)

    # Next greater or equal
    next_greater = [n] * n
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and arr[stack[-1]] < arr[i]:
            stack.pop()
        next_greater[i] = stack[-1] if stack else n
        stack.append(i)

    result = 0
    for i in range(n):
        left = i - prev_greater[i]
        right = next_greater[i] - i
        result = (result + arr[i] * left * right) % MOD

    return result`
    },
    solutionExplanation: `## Mirror of Minimums

Same contribution logic, but use greater instead of smaller.`,
    testCases: [
      { input: '[3, 1, 2, 4]', expectedOutput: '30' },
      { input: '[1, 2, 3]', expectedOutput: '14' }
    ],
    requiredForProgress: false
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-count-subarrays-min',
    title: 'Count Subarrays Where Element Is Minimum',
    description: 'For each index, count subarrays where it is the minimum',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Count Subarrays Where Element Is Minimum

For each index \`i\`, count how many subarrays have \`nums[i]\` as their minimum.

## Examples

\`\`\`
Input: nums = [3, 1, 2, 4]
Output: [1, 6, 2, 1]

Index 1 (val 1): it's the min in 6 subarrays
  [1], [3,1], [1,2], [3,1,2], [1,2,4], [3,1,2,4]
\`\`\`

## Hidden Insight

This is the contribution counting from Sum of Subarray Mins!`,
    starterCode: `def countSubarraysMin(nums):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Count = (i - prev_smaller) * (next_smaller - i).' }
    ],
    solution: {
      afterAttempt: 1,
      text: `def countSubarraysMin(nums):
    n = len(nums)

    prev_smaller = [-1] * n
    stack = []
    for i in range(n):
        while stack and nums[stack[-1]] >= nums[i]:
            stack.pop()
        prev_smaller[i] = stack[-1] if stack else -1
        stack.append(i)

    next_smaller = [n] * n
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and nums[stack[-1]] > nums[i]:
            stack.pop()
        next_smaller[i] = stack[-1] if stack else n
        stack.append(i)

    result = []
    for i in range(n):
        left = i - prev_smaller[i]
        right = next_smaller[i] - i
        result.append(left * right)

    return result`
    },
    solutionExplanation: `## Contribution = left * right

left = ways to choose left boundary
right = ways to choose right boundary

Total subarrays where nums[i] is min = left * right.`,
    testCases: [
      { input: '[3, 1, 2, 4]', expectedOutput: '[1, 6, 2, 1]' },
      { input: '[1, 2, 3]', expectedOutput: '[3, 2, 1]' }
    ],
    requiredForProgress: false
  },

  // ============================================================================
  // GROUP 4: Histogram / Rectangle Problems
  // ============================================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-maximal-rectangle-matrix',
    title: 'Maximal Rectangle in Binary Matrix',
    description: 'Find largest rectangle of 1s in a binary matrix',
    targetComplexity: { time: 'O(m*n)', space: 'O(n)' },
    instruction: `# Maximal Rectangle (LeetCode 85)

Given a binary matrix filled with 0's and 1's, find the largest rectangle containing only 1's.

## Examples

\`\`\`
Input: matrix = [
  ["1","0","1","0","0"],
  ["1","0","1","1","1"],
  ["1","1","1","1","1"],
  ["1","0","0","1","0"]
]
Output: 6

The maximal rectangle is formed by the 1s in rows 1-2, columns 2-4.
\`\`\`

## Hidden Insight

Build histogram row by row, apply Largest Rectangle in Histogram!`,
    starterCode: `def maximalRectangle(matrix):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'For each row, compute histogram heights (0 resets, 1 increments).' },
      { afterAttempt: 2, text: 'Apply largest rectangle in histogram to each row\'s histogram.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def maximalRectangle(matrix):
    if not matrix or not matrix[0]:
        return 0

    def largestRectangleArea(heights):
        stack = []
        max_area = 0
        heights = heights + [0]
        for i, h in enumerate(heights):
            start = i
            while stack and stack[-1][1] > h:
                idx, height = stack.pop()
                max_area = max(max_area, height * (i - idx))
                start = idx
            stack.append((start, h))
        return max_area

    n = len(matrix[0])
    heights = [0] * n
    max_rect = 0

    for row in matrix:
        for i in range(n):
            heights[i] = heights[i] + 1 if row[i] == '1' else 0
        max_rect = max(max_rect, largestRectangleArea(heights))

    return max_rect`
    },
    solutionExplanation: `## Row-by-Row Histogram

For each row:
1. Update heights: if cell is 1, increment; if 0, reset to 0
2. Apply largest rectangle in histogram

Total: O(m * n).`,
    testCases: [
      { input: '[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]', expectedOutput: '6' },
      { input: '[["0"]]', expectedOutput: '0' },
      { input: '[["1"]]', expectedOutput: '1' }
    ],
    requiredForProgress: false
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-maximum-width-ramp',
    title: 'Maximum Width Ramp',
    description: 'Find max j-i where i<j and nums[i] <= nums[j]',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Maximum Width Ramp (LeetCode 962)

Find the maximum width of a ramp: max(j - i) such that i < j and nums[i] <= nums[j].

Return 0 if no ramp exists.

## Examples

\`\`\`
Input: nums = [6, 0, 8, 2, 1, 5]
Output: 4 (i=1, j=5: 0 <= 5)

Input: nums = [9, 8, 1, 0, 1, 9, 4, 0, 4, 1]
Output: 7
\`\`\`

## Hidden Insight

Build a decreasing stack of candidates for i, then scan right-to-left for j.`,
    starterCode: `def maxWidthRamp(nums):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Only indices with decreasing values can be candidates for i.' },
      { afterAttempt: 2, text: 'Build decreasing stack, then scan from right popping when nums[j] >= stack top.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def maxWidthRamp(nums):
    n = len(nums)
    stack = []

    # Build decreasing stack of potential i's
    for i in range(n):
        if not stack or nums[i] < nums[stack[-1]]:
            stack.append(i)

    # Scan from right to find max ramp
    max_width = 0
    for j in range(n - 1, -1, -1):
        while stack and nums[j] >= nums[stack[-1]]:
            i = stack.pop()
            max_width = max(max_width, j - i)

    return max_width`
    },
    solutionExplanation: `## Two-Phase Stack

Phase 1: Build decreasing stack (candidates for i)
Phase 2: Scan right-to-left, pop and compute ramp width when valid

Why decreasing? If nums[a] >= nums[b] and a < b, then a is always better than b as starting point.`,
    testCases: [
      { input: '[6, 0, 8, 2, 1, 5]', expectedOutput: '4' },
      { input: '[9, 8, 1, 0, 1, 9, 4, 0, 4, 1]', expectedOutput: '7' },
      { input: '[1, 2, 3]', expectedOutput: '2' }
    ],
    requiredForProgress: false
  },

  // ============================================================================
  // GROUP 5: Stack With Conditions & Cleanup
  // ============================================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-remove-k-digits',
    title: 'Remove K Digits',
    description: 'Remove k digits to form smallest possible number',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Remove K Digits (LeetCode 402)

Remove \`k\` digits from number \`num\` to create the smallest possible number.

Return the result as a string (no leading zeros).

## Examples

\`\`\`
Input: num = "1432219", k = 3
Output: "1219"

Input: num = "10200", k = 1
Output: "200"

Input: num = "10", k = 2
Output: "0"
\`\`\`

## Hidden Insight

Remove a digit when it's greater than the next digit (greedy + stack).`,
    starterCode: `def removeKdigits(num, k):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Use increasing stack. Pop when current digit < stack top and k > 0.' },
      { afterAttempt: 2, text: 'After processing, remove remaining from the end. Strip leading zeros.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def removeKdigits(num, k):
    stack = []

    for digit in num:
        while k > 0 and stack and stack[-1] > digit:
            stack.pop()
            k -= 1
        stack.append(digit)

    # Remove remaining k digits from end
    stack = stack[:-k] if k else stack

    # Strip leading zeros
    result = ''.join(stack).lstrip('0')

    return result if result else '0'`
    },
    solutionExplanation: `## Greedy Stack

To minimize, we want smaller digits at front.

Pop larger digits when we see a smaller one.

After scan, if k remaining, remove from end (they're the largest).`,
    testCases: [
      { input: '"1432219", 3', expectedOutput: '"1219"' },
      { input: '"10200", 1', expectedOutput: '"200"' },
      { input: '"10", 2', expectedOutput: '"0"' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-remove-duplicate-letters',
    title: 'Remove Duplicate Letters',
    description: 'Remove duplicates for lexicographically smallest result',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Remove Duplicate Letters (LeetCode 316)

Remove duplicate letters so each letter appears once. Result must be the lexicographically smallest possible.

## Examples

\`\`\`
Input: s = "bcabc"
Output: "abc"

Input: s = "cbacdcbc"
Output: "acdb"
\`\`\`

## Hidden Insight

Greedy stack with "can we still get this letter later?" check.`,
    starterCode: `def removeDuplicateLetters(s):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Track remaining count of each letter.' },
      { afterAttempt: 2, text: 'Pop from stack if: current < stack top AND stack top appears later AND current not in stack.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def removeDuplicateLetters(s):
    last_occurrence = {c: i for i, c in enumerate(s)}
    stack = []
    in_stack = set()

    for i, c in enumerate(s):
        if c in in_stack:
            continue

        while stack and c < stack[-1] and i < last_occurrence[stack[-1]]:
            removed = stack.pop()
            in_stack.remove(removed)

        stack.append(c)
        in_stack.add(c)

    return ''.join(stack)`
    },
    solutionExplanation: `## Greedy with Lookahead

Pop stack top if:
1. Current char is smaller (lexicographically better)
2. Stack top appears again later (we can add it back)
3. Current char not already in stack

This ensures smallest lexicographic result.`,
    testCases: [
      { input: '"bcabc"', expectedOutput: '"abc"' },
      { input: '"cbacdcbc"', expectedOutput: '"acdb"' },
      { input: '"abcd"', expectedOutput: '"abcd"' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-make-non-decreasing',
    title: 'Make Array Non-Decreasing',
    description: 'Remove minimum elements for non-decreasing array',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Make Array Non-Decreasing

Remove the minimum number of elements so remaining array is non-decreasing.

Return the length of the longest non-decreasing subsequence that can be kept.

## Examples

\`\`\`
Input: nums = [5, 3, 4, 4, 7, 3, 6, 11, 8, 5, 11]
Output: 6

Keep: [3, 4, 4, 6, 11, 11] → length 6
(This is actually LIS with equal allowed)
\`\`\`

## Hidden Insight

This is Longest Non-Decreasing Subsequence (LIS variant) using binary search + stack.`,
    starterCode: `def longestNonDecreasing(nums):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Use patience sorting / binary search approach for LIS.' },
      { afterAttempt: 2, text: 'For non-decreasing (allowing equal), use bisect_right.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `import bisect

def longestNonDecreasing(nums):
    tails = []  # tails[i] = smallest tail for LIS of length i+1

    for num in nums:
        pos = bisect.bisect_right(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num

    return len(tails)`
    },
    solutionExplanation: `## Patience Sorting for LIS

Maintain tails array where tails[i] is smallest ending value for increasing sequence of length i+1.

Use bisect_right for non-decreasing (allows equal values).`,
    testCases: [
      { input: '[5, 3, 4, 4, 7, 3, 6, 11, 8, 5, 11]', expectedOutput: '6' },
      { input: '[1, 2, 3]', expectedOutput: '3' },
      { input: '[3, 2, 1]', expectedOutput: '1' }
    ],
    requiredForProgress: false
  },

  // ============================================================================
  // GROUP 6: Advanced / Pattern-Hiding Problems
  // ============================================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-online-stock-span',
    title: 'Online Stock Span',
    description: 'Process stock prices as a stream, return span for each',
    targetComplexity: { time: 'O(1) amortized', space: 'O(n)' },
    instruction: `# Online Stock Span (LeetCode 901)

Design a class that processes daily stock prices and returns the span.

Span = number of consecutive days (including today) with price <= today's price.

## Example

\`\`\`
StockSpanner()
next(100) → 1
next(80)  → 1
next(60)  → 1
next(70)  → 2
next(60)  → 1
next(75)  → 4
next(85)  → 6
\`\`\``,
    starterCode: `class StockSpanner:
    def __init__(self):
        pass

    def next(self, price):
        pass`,
    hints: [
      { afterAttempt: 1, text: 'Store (price, span) pairs in stack.' },
      { afterAttempt: 2, text: 'Pop and accumulate spans while stack top price <= current.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `class StockSpanner:
    def __init__(self):
        self.stack = []  # (price, span)

    def next(self, price):
        span = 1
        while self.stack and self.stack[-1][0] <= price:
            span += self.stack.pop()[1]
        self.stack.append((price, span))
        return span`
    },
    solutionExplanation: `## Span Compression

Instead of storing every price, store (price, span) pairs.

When popping, add the popped span to current span.

Amortized O(1) per call.`,
    testCases: [
      { input: 'next(100), next(80), next(60), next(70), next(60), next(75), next(85)', expectedOutput: '[1, 1, 1, 2, 1, 4, 6]' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-visible-people',
    title: 'Visible People in a Queue',
    description: 'Count how many people each person can see to their right',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Number of Visible People in a Queue (LeetCode 1944)

People stand in a queue. heights[i] is person i's height.

Person i can see person j (j > i) if everyone between them is shorter than both i and j.

Return array where answer[i] = number of people person i can see.

## Examples

\`\`\`
Input: heights = [10, 6, 8, 5, 11, 9]
Output: [3, 1, 2, 1, 1, 0]

Person 0 (height 10): can see 6, 8, 11 (stops at 11 which is taller)
\`\`\`

## Hidden Insight

Process right-to-left with decreasing stack.`,
    starterCode: `def canSeePersonsCount(heights):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Scan right-to-left. Stack holds people who haven\'t been blocked yet.' },
      { afterAttempt: 2, text: 'Pop while current >= stack top (current blocks them). Count pops + 1 if stack not empty.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def canSeePersonsCount(heights):
    n = len(heights)
    result = [0] * n
    stack = []  # decreasing heights (indices)

    for i in range(n - 1, -1, -1):
        count = 0
        while stack and heights[i] > heights[stack[-1]]:
            stack.pop()
            count += 1
        # Can also see the first taller person (if any)
        if stack:
            count += 1
        result[i] = count
        stack.append(i)

    return result`
    },
    solutionExplanation: `## Visibility Logic

Scan right-to-left with decreasing stack.

Person i can see:
1. All people they "block" (popped from stack)
2. The first taller person (stack top after popping)`,
    testCases: [
      { input: '[10, 6, 8, 5, 11, 9]', expectedOutput: '[3, 1, 2, 1, 1, 0]' },
      { input: '[5, 1, 2, 3, 10]', expectedOutput: '[4, 1, 1, 1, 0]' }
    ],
    requiredForProgress: false
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-subarrays-bounded-max',
    title: 'Count Subarrays With Bounded Maximum',
    description: 'Count subarrays where max is in range [L, R]',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Number of Subarrays With Bounded Maximum (LeetCode 795)

Count subarrays where the maximum element is in [left, right].

## Examples

\`\`\`
Input: nums = [2, 1, 4, 3], left = 2, right = 3
Output: 3

Valid subarrays: [2], [2,1], [3] (max in [2,3])
\`\`\`

## Hidden Insight

Use inclusion-exclusion: count(max <= R) - count(max <= L-1).`,
    starterCode: `def numSubarrayBoundedMax(nums, left, right):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'count(max <= k) = sum of lengths of valid subarrays ending at each index.' },
      { afterAttempt: 2, text: 'Track last position where nums[i] > k. Subarrays = i - lastGreater.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def numSubarrayBoundedMax(nums, left, right):
    def countAtMost(k):
        count = 0
        curr = 0
        for num in nums:
            if num <= k:
                curr += 1
            else:
                curr = 0
            count += curr
        return count

    return countAtMost(right) - countAtMost(left - 1)`
    },
    solutionExplanation: `## Inclusion-Exclusion

count(max in [L, R]) = count(max <= R) - count(max < L)
                     = countAtMost(R) - countAtMost(L-1)`,
    testCases: [
      { input: '[2, 1, 4, 3], 2, 3', expectedOutput: '3' },
      { input: '[2, 9, 2, 5, 6], 2, 8', expectedOutput: '7' }
    ],
    requiredForProgress: false
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-sum-subarray-ranges',
    title: 'Sum of Subarray Ranges',
    description: 'Sum of (max - min) across all subarrays',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Sum of Subarray Ranges (LeetCode 2104)

Return sum of \`(max - min)\` for every subarray.

## Examples

\`\`\`
Input: nums = [1, 2, 3]
Output: 4

Subarrays:
[1]: 1-1=0, [2]: 0, [3]: 0
[1,2]: 2-1=1, [2,3]: 1
[1,2,3]: 3-1=2
Sum = 0+0+0+1+1+2 = 4
\`\`\`

## Hidden Insight

Sum of (max - min) = Sum of max - Sum of min.

Use Sum of Subarray Maximums - Sum of Subarray Minimums!`,
    starterCode: `def subArrayRanges(nums):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Compute sum of subarray maximums and sum of subarray minimums separately.' },
      { afterAttempt: 2, text: 'Answer = sumMax - sumMin.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def subArrayRanges(nums):
    n = len(nums)

    def sumContributions(comparator):
        # comparator: True if a should be popped (a is "dominated" by current)
        result = 0
        stack = []

        for i in range(n + 1):
            while stack and (i == n or comparator(nums[stack[-1]], nums[i])):
                j = stack.pop()
                left = j - (stack[-1] if stack else -1)
                right = i - j
                result += nums[j] * left * right
            stack.append(i)

        return result

    sum_max = sumContributions(lambda a, b: a <= b)  # for maximums
    sum_min = sumContributions(lambda a, b: a >= b)  # for minimums

    return sum_max - sum_min`
    },
    solutionExplanation: `## Decomposition

Sum of ranges = Sum of max - Sum of min.

Each can be computed using contribution counting with monotonic stack.`,
    testCases: [
      { input: '[1, 2, 3]', expectedOutput: '4' },
      { input: '[1, 3, 3]', expectedOutput: '4' },
      { input: '[4, -2, -3, 4, 1]', expectedOutput: '59' }
    ],
    requiredForProgress: false
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-next-greater-mapping',
    title: 'Next Greater Element I (With Mapping)',
    description: 'Query next greater using index mapping between two arrays',
    targetComplexity: { time: 'O(n + m)', space: 'O(n)' },
    instruction: `# Next Greater Element I (LeetCode 496)

Given \`nums1\` (subset of \`nums2\`), for each element in \`nums1\`, find its next greater element in \`nums2\`.

## Examples

\`\`\`
Input: nums1 = [4, 1, 2], nums2 = [1, 3, 4, 2]
Output: [-1, 3, -1]

- 4 is in nums2, next greater in nums2 = none → -1
- 1 is in nums2, next greater = 3
- 2 is in nums2, next greater = none → -1
\`\`\``,
    starterCode: `def nextGreaterElement(nums1, nums2):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Build next greater map for nums2 first.' },
      { afterAttempt: 2, text: 'Use stack on nums2, store results in a dict. Query for nums1.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def nextGreaterElement(nums1, nums2):
    next_greater = {}
    stack = []

    for num in nums2:
        while stack and stack[-1] < num:
            next_greater[stack.pop()] = num
        stack.append(num)

    return [next_greater.get(num, -1) for num in nums1]`
    },
    solutionExplanation: `## Precompute + Query

1. Build next_greater map for all elements in nums2
2. Query the map for each element in nums1`,
    testCases: [
      { input: '[4, 1, 2], [1, 3, 4, 2]', expectedOutput: '[-1, 3, -1]' },
      { input: '[2, 4], [1, 2, 3, 4]', expectedOutput: '[3, -1]' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-buildings-ocean-view',
    title: 'Buildings With an Ocean View',
    description: 'Find buildings that can see the ocean (no taller building to the right)',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Buildings With an Ocean View (LeetCode 1762)

Ocean is to the right. Return indices of buildings that can see the ocean (no taller or equal building blocking).

## Examples

\`\`\`
Input: heights = [4, 2, 3, 1]
Output: [0, 2, 3]

Building 0 (height 4): no taller to right ✓
Building 1 (height 2): blocked by building 2 (height 3) ✗
Building 2 (height 3): no taller to right ✓
Building 3 (height 1): last building ✓
\`\`\``,
    starterCode: `def findBuildings(heights):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Scan right-to-left, track max seen so far.' },
      { afterAttempt: 2, text: 'Building can see ocean if height > max_so_far.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def findBuildings(heights):
    result = []
    max_height = 0

    for i in range(len(heights) - 1, -1, -1):
        if heights[i] > max_height:
            result.append(i)
            max_height = heights[i]

    return result[::-1]`
    },
    solutionExplanation: `## Right-to-Left Scan

Track maximum height seen from right.

Building sees ocean if taller than all to its right (i.e., > max_so_far).`,
    testCases: [
      { input: '[4, 2, 3, 1]', expectedOutput: '[0, 2, 3]' },
      { input: '[4, 3, 2, 1]', expectedOutput: '[0, 1, 2, 3]' },
      { input: '[1, 3, 2, 4]', expectedOutput: '[3]' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-asteroid-collision',
    title: 'Asteroid Collision',
    description: 'Simulate asteroid collisions using stack behavior',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Asteroid Collision (LeetCode 735)

Asteroids in a row. Positive = moving right, negative = moving left.

When two asteroids meet (opposite directions), smaller one explodes. Equal = both explode.

Return surviving asteroids.

## Examples

\`\`\`
Input: asteroids = [5, 10, -5]
Output: [5, 10]
(10 and -5 meet, 10 wins)

Input: asteroids = [8, -8]
Output: []
(equal, both explode)

Input: asteroids = [10, 2, -5]
Output: [10]
(2 and -5 meet, -5 wins; 10 and -5 meet, 10 wins)
\`\`\``,
    starterCode: `def asteroidCollision(asteroids):
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Stack holds surviving asteroids going right.' },
      { afterAttempt: 2, text: 'When seeing negative: collide with stack top while stack top is positive and smaller.' }
    ],
    solution: {
      afterAttempt: 2,
      text: `def asteroidCollision(asteroids):
    stack = []

    for ast in asteroids:
        alive = True
        while alive and stack and ast < 0 < stack[-1]:
            if stack[-1] < -ast:
                stack.pop()
            elif stack[-1] == -ast:
                stack.pop()
                alive = False
            else:
                alive = False

        if alive:
            stack.append(ast)

    return stack`
    },
    solutionExplanation: `## Collision Simulation

Only collisions occur when: stack top is positive (right), current is negative (left).

Compare magnitudes:
- If |current| > stack top: pop and continue
- If equal: pop, current also dies
- If |current| < stack top: current dies`,
    testCases: [
      { input: '[5, 10, -5]', expectedOutput: '[5, 10]' },
      { input: '[8, -8]', expectedOutput: '[]' },
      { input: '[10, 2, -5]', expectedOutput: '[10]' },
      { input: '[-2, -1, 1, 2]', expectedOutput: '[-2, -1, 1, 2]' }
    ],
    requiredForProgress: true
  }
];


