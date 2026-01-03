import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module15ParenthesesLessonSmartPracticeExercises: ExerciseSection[] = [
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-valid-parentheses',
            title: 'Valid Parentheses',
            description: 'Check if brackets are balanced using a stack',
      targetComplexity: { time: 'O(n)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Valid Parentheses (LeetCode 20)

**Interview Context:** THE classic stack problem. Asked at every company.

| Difficulty | Expected Time | Concepts Tested |
|------------|---------------|-----------------|
| Easy | 10-15 minutes | Stack, Hash Map |

## Problem

Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

A string is valid if:
1. Open brackets must be closed by the same type of brackets
2. Open brackets must be closed in the correct order
3. Every close bracket has a corresponding open bracket of the same type

## Examples

**Example 1:**
\`\`\`
s = "()"
Output: True
\`\`\`

**Example 2:**
\`\`\`
s = "()[]{}"
Output: True
\`\`\`

**Example 3:**
\`\`\`
s = "(]"
Output: False
\`\`\`

**Example 4:**
\`\`\`
s = "([)]"
Output: False
\`\`\`

**Example 5:**
\`\`\`
s = "{[]}"
Output: True
\`\`\`

## Constraints
- 1 <= s.length <= 10^4
- s consists of parentheses only \`'()[]{}'\``,
            starterCode: `def isValid(s: str) -> bool:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def isValid(s: str) -> bool:
    stack = []
    matching = {')': '(', '}': '{', ']': '['}

    for char in s:
        if char in '({[':
            stack.append(char)
        else:
            # It's a closing bracket
            if not stack or stack[-1] != matching[char]:
                return False
            stack.pop()

    return len(stack) == 0`
            },
            hints: [
                { afterAttempt: 1, text: 'Use a stack to track opening brackets' },
                { afterAttempt: 2, text: 'When you see a closing bracket, check if it matches the most recent opening bracket' },
                { afterAttempt: 2, text: 'Use a hash map to store the matching pairs: ) → (, ] → [, } → {' },
                { afterAttempt: 3, text: 'Don\'t forget: stack must be empty at the end for a valid string!' },
            ],
            testCases: [
                { input: 's="()"', expectedOutput: 'True' },
                { input: 's="()[]{}"', expectedOutput: 'True' },
                { input: 's="(]"', expectedOutput: 'False' },
                { input: 's="([)]"', expectedOutput: 'False' },
                { input: 's="{[]}"', expectedOutput: 'True' },
                { input: 's=""', expectedOutput: 'True' },
                { input: 's="["', expectedOutput: 'False' },
                { input: 's="]"', expectedOutput: 'False' },
            ],
            solutionExplanation: `## The Stack Approach

**Why Stack?** We need to match the most recent unmatched opening bracket with each closing bracket - that's LIFO (Last In, First Out) behavior!

## Algorithm

1. Push opening brackets onto stack
2. For closing brackets:
   - Check if stack is empty (no opening to match) → False
   - Check if top of stack matches → pop if yes, False if no
3. At end: stack should be empty

## Walkthrough

\`\`\`
s = "{[]}"

Step 1: '{' → push → stack = ['{']
Step 2: '[' → push → stack = ['{', '[']
Step 3: ']' → matches '[' → pop → stack = ['{']
Step 4: '}' → matches '{' → pop → stack = []

Result: stack is empty → True
\`\`\`

## Common Mistakes

### 1. Not handling empty stack
\`\`\`python
# Wrong - crashes on s = ")"
if stack[-1] != matching[char]:

# Correct
if not stack or stack[-1] != matching[char]:
\`\`\`

### 2. Forgetting to check stack at end
\`\`\`python
# Wrong - returns True for s = "((("
return True

# Correct
return len(stack) == 0
\`\`\`

---

**Time:** O(n) - single pass
**Space:** O(n) - worst case all opening brackets`,
            complexityQuizPlacement: 'after',
            difficulty: 'easy',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-remove-outermost',
            title: 'Remove Outermost Parentheses',
            description: 'Track depth to remove outermost layer',
      targetComplexity: { time: 'O(n)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Remove Outermost Parentheses (LeetCode 1021)

**Interview Context:** Introduces the "height/depth" mental model for parentheses.

| Difficulty | Expected Time | Concepts Tested |
|------------|---------------|-----------------|
| Easy | 10-15 minutes | Counter, Depth Tracking |

## Problem

A valid parentheses string is either:
- Empty \`""\`
- \`"(" + A + ")"\` where A is valid
- \`A + B\` where A and B are valid

A "primitive" is a valid string that cannot be split into two non-empty valid strings.

Given a valid parentheses string \`s\`, return \`s\` after removing the outermost parentheses of every primitive in the string.

## Examples

**Example 1:**
\`\`\`
s = "(()())(())"
Output: "()()()"
Explanation:
- "(()())" is primitive, remove outer → "()()"
- "(())" is primitive, remove outer → "()"
- Result: "()()" + "()" = "()()()"
\`\`\`

**Example 2:**
\`\`\`
s = "(()())(())(()(()))"
Output: "()()()()(())"
\`\`\`

**Example 3:**
\`\`\`
s = "()()"
Output: ""
Explanation: Both "()" are primitive, removing outermost gives "" + "" = ""
\`\`\`

## Constraints
- 1 <= s.length <= 10^5
- s is a valid parentheses string`,
            starterCode: `def removeOuterParentheses(s: str) -> str:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def removeOuterParentheses(s: str) -> str:
    result = []
    depth = 0

    for char in s:
        if char == '(':
            if depth > 0:  # Not outermost
                result.append(char)
            depth += 1
        else:  # char == ')'
            depth -= 1
            if depth > 0:  # Not outermost
                result.append(char)

    return ''.join(result)`
            },
            hints: [
                { afterAttempt: 1, text: 'Track the "depth" or "height" as you scan through' },
                { afterAttempt: 2, text: 'Outermost ( is when depth goes from 0 to 1; outermost ) is when depth goes from 1 to 0' },
                { afterAttempt: 2, text: 'Only add characters when depth > 0 (after updating for ( or before updating for ))' },
                { afterAttempt: 3, text: 'For (, add BEFORE incrementing depth. For ), decrement BEFORE adding.' },
            ],
            testCases: [
                { input: 's="(()())(())"', expectedOutput: '"()()()"' },
                { input: 's="(()())(())(()(()))"', expectedOutput: '"()()()()(())"' },
                { input: 's="()()"', expectedOutput: '""' },
                { input: 's="(())"', expectedOutput: '"()"' },
                { input: 's="((()))"', expectedOutput: '"(())"' },
            ],
            solutionExplanation: `## The Depth Tracking Approach

**Key Insight:** Track the "height" as you traverse. Outermost characters are at height 0→1 and 1→0.

## Visualization

\`\`\`
s = "(()())"
     012210    ← depth after each char
     ↑    ↑    ← these are the outermost (depth 0→1 and 1→0)

Keep: "()()" (the inner ones at depth > 0)
\`\`\`

## The Trick

For \`(\`:
- Increment depth AFTER checking
- Add only if depth > 0 (before increment)

For \`)\`:
- Decrement depth BEFORE checking
- Add only if depth > 0 (after decrement)

\`\`\`python
if char == '(':
    if depth > 0:      # Check BEFORE increment
        result.append(char)
    depth += 1
else:
    depth -= 1
    if depth > 0:      # Check AFTER decrement
        result.append(char)
\`\`\`

---

**Time:** O(n) - single pass
**Space:** O(n) - result string`,
            complexityQuizPlacement: 'after',
            difficulty: 'easy',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-min-add-valid',
            title: 'Minimum Add to Make Parentheses Valid',
            description: 'Count unmatched parentheses using balance tracking',
      targetComplexity: { time: 'O(n)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Minimum Add to Make Parentheses Valid (LeetCode 921)

**Interview Context:** Tests balance tracking without needing a stack.

| Difficulty | Expected Time | Concepts Tested |
|------------|---------------|-----------------|
| Medium | 10-15 minutes | Counter, Balance Tracking |

## Problem

Given a parentheses string \`s\`, return the minimum number of parentheses you must add to make the string valid.

## Examples

**Example 1:**
\`\`\`
s = "())"
Output: 1
Explanation: Add one '(' at the beginning: "(())"
\`\`\`

**Example 2:**
\`\`\`
s = "((("
Output: 3
Explanation: Add three ')' at the end: "((()))"
\`\`\`

**Example 3:**
\`\`\`
s = "()"
Output: 0
\`\`\`

**Example 4:**
\`\`\`
s = "()))(("
Output: 4
Explanation: Need 2 '(' for "))" and 2 ')' for "(("
\`\`\`

## Mental Model: The Mountain

Think of it as a mountain hike:
- \`(\` = go UP
- \`)\` = go DOWN
- **Rule:** You can never go below ground level!

When you try to go underground, you need to add a \`(\` first.
At the end, however many steps up you are = how many \`)\` you need.

## Constraints
- 1 <= s.length <= 1000
- s consists of '(' and ')' only`,
            starterCode: `def minAddToMakeValid(s: str) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def minAddToMakeValid(s: str) -> int:
    open_needed = 0   # Unmatched '(' that need closing
    close_needed = 0  # ')' that need opening

    for char in s:
        if char == '(':
            open_needed += 1
        else:  # char == ')'
            if open_needed > 0:
                open_needed -= 1  # Matched with an open
            else:
                close_needed += 1  # No open to match, need to add one

    return open_needed + close_needed`
            },
            hints: [
                { afterAttempt: 1, text: 'Track two things: unmatched "(" and unmatched ")"' },
                { afterAttempt: 2, text: 'When you see ")", try to match it with an existing "(". If none available, you need to add a "("' },
                { afterAttempt: 2, text: 'At the end, any unmatched "(" needs a ")" added' },
                { afterAttempt: 3, text: 'Answer = unmatched_open + unmatched_close' },
            ],
            testCases: [
                { input: 's="())"', expectedOutput: '1' },
                { input: 's="((("', expectedOutput: '3' },
                { input: 's="()"', expectedOutput: '0' },
                { input: 's="()))(("', expectedOutput: '4' },
                { input: 's=""', expectedOutput: '0' },
                { input: 's=")("', expectedOutput: '2' },
            ],
            solutionExplanation: `## The Balance Tracking Approach

**Key Insight:** We don't need a stack! Just track:
- How many \`(\` are waiting for a match
- How many \`)\` couldn't find a match

## Visualization

\`\`\`
s = "()))(("

Step 1: '(' → open_needed = 1, close_needed = 0
Step 2: ')' → matches '(' → open_needed = 0, close_needed = 0
Step 3: ')' → no '(' to match! → open_needed = 0, close_needed = 1
Step 4: ')' → no '(' to match! → open_needed = 0, close_needed = 2
Step 5: '(' → open_needed = 1, close_needed = 2
Step 6: '(' → open_needed = 2, close_needed = 2

Answer = 2 + 2 = 4
\`\`\`

## Why Not Just Use Balance?

\`\`\`python
# WRONG approach
balance = 0
for char in s:
    balance += 1 if char == '(' else -1

# This gives 0 for s = ")(" but answer should be 2!
\`\`\`

We need to track when balance goes **negative** - those are unmatched \`)\`.

---

**Time:** O(n) - single pass
**Space:** O(1) - just two counters`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-generate-parentheses',
            title: 'Generate Parentheses',
            description: 'Generate all valid combinations using backtracking',
      targetComplexity: { time: 'O(2^n)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Generate Parentheses (LeetCode 22)

**Interview Context:** Classic backtracking problem. Tests decision tree thinking.

| Difficulty | Expected Time | Concepts Tested |
|------------|---------------|-----------------|
| Medium | 20-25 minutes | Backtracking, Recursion |

## Problem

Given \`n\` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.

## Examples

**Example 1:**
\`\`\`
n = 3
Output: ["((()))","(()())","(())()","()(())","()()()"]
\`\`\`

**Example 2:**
\`\`\`
n = 1
Output: ["()"]
\`\`\`

## Decision Tree Thinking

At each position, we decide: add \`(\` or add \`)\`?

**Rules:**
- Can add \`(\` if: open_count < n
- Can add \`)\` if: close_count < open_count

\`\`\`
For n = 2:
                    ""
                   /
                  "("
                 /   \\
              "(("    "()"
              /         \\
          "(()"        "()(
            |            |
          "(())"      "()()"
\`\`\`

## Constraints
- 1 <= n <= 8`,
            starterCode: `def generateParenthesis(n: int) -> list[str]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def generateParenthesis(n: int) -> list[str]:
    result = []

    def backtrack(current, open_count, close_count):
        # Base case: we've used all parentheses
        if len(current) == 2 * n:
            result.append(current)
            return

        # Choice 1: Add '(' if we haven't used all
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)

        # Choice 2: Add ')' if it won't invalidate
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)

    backtrack('', 0, 0)
    return result`
            },
            hints: [
                { afterAttempt: 1, text: 'Use backtracking: at each step, decide whether to add "(" or ")"' },
                { afterAttempt: 2, text: 'Track open_count and close_count separately' },
                { afterAttempt: 2, text: 'Can add "(" if open_count < n; can add ")" if close_count < open_count' },
                { afterAttempt: 3, text: 'Base case: when len(current) == 2*n, add to result' },
            ],
            testCases: [
                { input: 'n=3', expectedOutput: '["((()))","(()())","(())()","()(())","()()()"]' },
                { input: 'n=1', expectedOutput: '["()"]' },
                { input: 'n=2', expectedOutput: '["(())","()()"]' },
                { input: 'n=0', expectedOutput: '[""]' },
            ],
            solutionExplanation: `## The Backtracking Approach

**Key Insight:** At each position, we have a choice - but not always both options!

## The Two Rules

1. **Can add \`(\`:** if open_count < n (haven't used all n opens)
2. **Can add \`)\`:** if close_count < open_count (have unclosed opens)

## Why close_count < open_count?

If close_count >= open_count, adding \`)\` would create:
- More closes than opens so far → invalid!

\`\`\`
open=1, close=1: "()"
Adding ')' → "())" - INVALID (more closes than opens)
\`\`\`

## Decision Tree for n=2

\`\`\`
                         ""
                        /
                      "("
                     /   \\
                  "(("    "()"
                  /         \\
              "(()"       "()("
                |           |
             "(())"      "()()"
\`\`\`

## Time Complexity

The n-th Catalan number: **O(4^n / √n)**

This counts the number of valid combinations.

---

**Time:** O(4^n / √n) - Catalan number
**Space:** O(n) - recursion depth`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-score-parentheses',
            title: 'Score of Parentheses',
            description: 'Evaluate nested parentheses using stack or recursion',
      targetComplexity: { time: 'O(n)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Score of Parentheses (LeetCode 856)

**Interview Context:** Tests recursive evaluation. Think of it as a tree!

| Difficulty | Expected Time | Concepts Tested |
|------------|---------------|-----------------|
| Medium | 20-25 minutes | Stack, Recursion |

## Problem

Given a balanced parentheses string \`s\`, return the score of the string.

The score is based on these rules:
- \`"()"\` has score **1**
- \`AB\` has score **A + B**, where A and B are balanced strings
- \`(A)\` has score **2 * A**, where A is a balanced string

## Examples

**Example 1:**
\`\`\`
s = "()"
Output: 1
\`\`\`

**Example 2:**
\`\`\`
s = "(())"
Output: 2
Explanation: 2 * score of "()" = 2 * 1 = 2
\`\`\`

**Example 3:**
\`\`\`
s = "()()"
Output: 2
Explanation: score of "()" + score of "()" = 1 + 1 = 2
\`\`\`

**Example 4:**
\`\`\`
s = "(()(()))"
Output: 6
Explanation: 2 * (1 + 2*1) = 2 * 3 = 6
\`\`\`

## Tree Visualization

\`\`\`
"(()(()))" as a tree:

        ( )
       /
      +
     / \\
   ( )  ( )
         |
        ( )

Score = 2 * (1 + 2*1) = 6
\`\`\`

## Constraints
- 2 <= s.length <= 50
- s consists of only '(' and ')'
- s is a balanced parentheses string`,
            starterCode: `def scoreOfParentheses(s: str) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `# Approach 1: Stack
def scoreOfParentheses(s: str) -> int:
    stack = [0]  # Stack of scores at each depth

    for char in s:
        if char == '(':
            stack.append(0)  # Start new depth with score 0
        else:
            # Pop the inner score
            inner = stack.pop()
            # Add to outer: max(2*inner, 1) for "()" vs "(A)"
            if inner == 0:
                stack[-1] += 1  # "()" = 1
            else:
                stack[-1] += 2 * inner  # "(A)" = 2*A

    return stack[0]

# Approach 2: Depth-based (clever)
def scoreOfParentheses_depth(s: str) -> int:
    result = 0
    depth = 0

    for i, char in enumerate(s):
        if char == '(':
            depth += 1
        else:
            depth -= 1
            if s[i-1] == '(':  # Found "()"
                result += 2 ** depth

    return result`
            },
            hints: [
                { afterAttempt: 1, text: 'Think of it as a tree: "(A)" means A is a child with score doubled' },
                { afterAttempt: 2, text: 'Stack approach: push 0 for each "(", pop and calculate for each ")"' },
                { afterAttempt: 2, text: 'When you see ")", if the inner score is 0, it\'s "()" = 1. Otherwise it\'s "(A)" = 2*A' },
                { afterAttempt: 3, text: 'Clever approach: "()" at depth d contributes 2^d to the total!' },
            ],
            testCases: [
                { input: 's="()"', expectedOutput: '1' },
                { input: 's="(())"', expectedOutput: '2' },
                { input: 's="()()"', expectedOutput: '2' },
                { input: 's="(()(()))"', expectedOutput: '6' },
                { input: 's="(()())"', expectedOutput: '4' },
            ],
            solutionExplanation: `## Approach 1: Stack

**Idea:** Track the score at each nesting level.

\`\`\`
s = "(())"
stack = [0]

'(' → stack = [0, 0]
'(' → stack = [0, 0, 0]
')' → inner=0, "()"=1 → stack = [0, 1]
')' → inner=1, "(A)"=2*1 → stack = [2]

Answer: 2
\`\`\`

## Approach 2: Depth-based (Elegant!)

**Key Insight:** Each "()" at depth d contributes 2^d to the total.

Why? "()" at depth 0 = 1 = 2^0
"(())" = 2 * "()" = 2^1
"((..))" = 2 * 2 * "()" = 2^2

So we just find all "()" and add 2^depth for each!

\`\`\`
"(()(()))"
  ↑  ↑
  d=1 d=2

Score = 2^1 + 2^2 = 2 + 4 = 6
\`\`\`

---

**Time:** O(n) for both approaches
**Space:** O(n) for stack, O(1) for depth-based`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-max-depth-split',
            title: 'Maximum Nesting Depth of Two Valid Strings',
            description: 'Split parentheses to minimize maximum depth',
      targetComplexity: { time: 'O(n)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Maximum Nesting Depth of Two Valid Parentheses Strings (LeetCode 1111)

**Interview Context:** Tests understanding of depth and optimal splitting.

| Difficulty | Expected Time | Concepts Tested |
|------------|---------------|-----------------|
| Medium | 20-25 minutes | Depth Tracking, Greedy |

## Problem

Given a valid parentheses string \`seq\`, split it into two disjoint subsequences \`A\` and \`B\`, such that both are valid and their concatenation equals \`seq\`.

Return an array \`answer\` where \`answer[i] = 0\` if \`seq[i]\` belongs to A, and \`answer[i] = 1\` if it belongs to B.

**Goal:** Minimize \`max(depth(A), depth(B))\`

## Examples

**Example 1:**
\`\`\`
seq = "(()())"
Output: [0,1,1,1,1,0]
Explanation:
- A = "()" (indices 0, 5) - depth 1
- B = "()()" (indices 1,2,3,4) - depth 1
- max(1, 1) = 1 ✓
\`\`\`

**Example 2:**
\`\`\`
seq = "()(())()"
Output: [0,0,0,1,1,0,1,1]
\`\`\`

## Key Insight

If the original string has max depth D, the best we can do is split it so each half has depth ⌈D/2⌉.

**Trick:** Assign parentheses at odd depths to A, even depths to B (or vice versa)!

## Constraints
- 1 <= seq.length <= 10^4
- seq is a valid parentheses string`,
            starterCode: `def maxDepthAfterSplit(seq: str) -> list[int]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def maxDepthAfterSplit(seq: str) -> list[int]:
    result = []
    depth = 0

    for char in seq:
        if char == '(':
            depth += 1
            # Assign odd depths to group 1, even to group 0
            result.append(depth % 2)
        else:
            result.append(depth % 2)
            depth -= 1

    return result

# Alternative: assign by index parity of depth
def maxDepthAfterSplit_v2(seq: str) -> list[int]:
    result = []
    depth = 0

    for char in seq:
        if char == '(':
            result.append(depth % 2)
            depth += 1
        else:
            depth -= 1
            result.append(depth % 2)

    return result`
            },
            hints: [
                { afterAttempt: 1, text: 'Think about depth: if max depth is D, we want to split so each part has depth ~D/2' },
                { afterAttempt: 2, text: 'Assign parentheses at alternating depths to different groups' },
                { afterAttempt: 2, text: 'Odd depths → group 1, Even depths → group 0 (or vice versa)' },
                { afterAttempt: 3, text: 'For "(", assign then increment depth. For ")", use current depth then decrement.' },
            ],
            testCases: [
                { input: 'seq="(()())"', expectedOutput: '[1, 0, 0, 0, 0, 1]' },
                { input: 'seq="()"', expectedOutput: '[1, 1]' },
                { input: 'seq="(())"', expectedOutput: '[1, 0, 0, 1]' },
            ],
            solutionExplanation: `## The Depth-Parity Trick

**Key Insight:** Assign characters at odd depths to one group, even depths to another.

This automatically balances the depth between the two groups!

## Why It Works

If original max depth = 4:
- Depths 1, 3 go to group A → A has depth 2
- Depths 2, 4 go to group B → B has depth 2

Perfect split!

## Visualization

\`\`\`
seq = "(()())"
depth:  1 2 1 2 1 0
assign: 1 0 0 0 0 1  (odd=1, even=0)

Group 0 (even depths): positions 1,2,3,4 → "()()"
Group 1 (odd depths): positions 0,5 → "()"
\`\`\`

## Be Careful with Timing

For \`(\`: assign based on NEW depth (after increment)
For \`)\`: assign based on CURRENT depth (before decrement)

Or equivalently:
For \`(\`: assign, then increment
For \`)\`: decrement, then assign

---

**Time:** O(n) - single pass
**Space:** O(n) - result array`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-valid-parenthesis-wildcard',
            title: 'Valid Parenthesis String',
            description: 'Handle wildcards with range tracking',
      targetComplexity: { time: 'O(n)', space: 'O(n)' },
            requiredForProgress: true,
            instruction: `# Valid Parenthesis String (LeetCode 678)

**Interview Context:** Tests handling uncertainty with range/interval thinking.

| Difficulty | Expected Time | Concepts Tested |
|------------|---------------|-----------------|
| Medium | 25-30 minutes | Greedy, Range Tracking |

## Problem

Given a string \`s\` containing only three types of characters: \`'('\`, \`')'\`, and \`'*'\`, return \`true\` if the string is valid.

The \`*\` character can be treated as:
- A single \`'('\`
- A single \`')'\`
- An empty string \`""\`

## Examples

**Example 1:**
\`\`\`
s = "()"
Output: true
\`\`\`

**Example 2:**
\`\`\`
s = "(*)"
Output: true
Explanation: * can be empty
\`\`\`

**Example 3:**
\`\`\`
s = "(*))"
Output: true
Explanation: * can be '('
\`\`\`

**Example 4:**
\`\`\`
s = "(((*)"
Output: false
\`\`\`

## Key Insight: Range Tracking

Instead of tracking exact balance, track the **range of possible balances** [lo, hi].

- \`(\` increases both lo and hi
- \`)\` decreases both lo and hi
- \`*\` could do any, so: lo-1, hi+1

**Rules:**
- If hi < 0: impossible, return False
- If lo < 0: reset lo to 0 (we can choose * = empty)
- At end: valid if lo == 0 (can reach balance 0)

## Constraints
- 1 <= s.length <= 100
- s only contains '(', ')' and '*'`,
            starterCode: `def checkValidString(s: str) -> bool:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def checkValidString(s: str) -> bool:
    # Track range of possible open bracket counts
    lo = 0  # Minimum possible open count
    hi = 0  # Maximum possible open count

    for char in s:
        if char == '(':
            lo += 1
            hi += 1
        elif char == ')':
            lo -= 1
            hi -= 1
        else:  # char == '*'
            lo -= 1  # * could be )
            hi += 1  # * could be (

        # If hi < 0, we have too many ) even with all * as (
        if hi < 0:
            return False

        # lo can't go below 0 (we can always choose * as empty)
        lo = max(lo, 0)

    # Valid if we can reach 0 open brackets
    return lo == 0`
            },
            hints: [
                { afterAttempt: 1, text: 'Since * can be anything, track a RANGE of possible balances instead of a single value' },
                { afterAttempt: 2, text: 'lo = minimum possible open count, hi = maximum possible open count' },
                { afterAttempt: 2, text: 'For *: lo decreases (could be ")"), hi increases (could be "(")' },
                { afterAttempt: 3, text: 'If hi < 0, impossible. If lo < 0, clamp to 0. Valid if lo == 0 at end.' },
            ],
            testCases: [
                { input: 's="()"', expectedOutput: 'True' },
                { input: 's="(*)"', expectedOutput: 'True' },
                { input: 's="(*))"', expectedOutput: 'True' },
                { input: 's="(((*)"', expectedOutput: 'False' },
                { input: 's="*"', expectedOutput: 'True' },
                { input: 's="**"', expectedOutput: 'True' },
                { input: 's="(((******))"', expectedOutput: 'True' },
            ],
            solutionExplanation: `## The Range Tracking Approach

**Key Insight:** We can't track exact balance because \`*\` creates uncertainty. Track the **range** [lo, hi] of possible balances!

## How It Works

\`\`\`
s = "(*))"

char  lo  hi  Action
----  --  --  ------
(     1   1   Both increase
*     0   2   lo--, hi++ (could be ), empty, or ()
)     -1  1   Both decrease → clamp lo to 0 → lo=0
)     -1  0   Both decrease → clamp lo to 0 → lo=0

Final: lo = 0 → Valid!
\`\`\`

## Why Clamp lo to 0?

If lo becomes negative, it means "we'd need to use some * as empty strings instead of )".

We can always make that choice, so the minimum possible balance is 0.

## Why Check hi < 0?

If even the maximum possible balance is negative, we have too many \`)\` and not enough \`(\` even if ALL \`*\` become \`(\`.

---

**Time:** O(n) - single pass
**Space:** O(1) - just two variables`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-longest-valid',
            title: 'Longest Valid Parentheses',
            description: 'Find longest valid substring using DP or stack',
      targetComplexity: { time: 'O(n)', space: 'O(h)' },
            requiredForProgress: true,
            instruction: `# Longest Valid Parentheses (LeetCode 32)

**Interview Context:** Hard DP/Stack problem. Multiple elegant solutions exist.

| Difficulty | Expected Time | Concepts Tested |
|------------|---------------|-----------------|
| Hard | 30-35 minutes | DP, Stack |

## Problem

Given a string containing just \`'('\` and \`')'\`, return the length of the longest valid (well-formed) parentheses substring.

## Examples

**Example 1:**
\`\`\`
s = "(()"
Output: 2
Explanation: Longest valid is "()"
\`\`\`

**Example 2:**
\`\`\`
s = ")()())"
Output: 4
Explanation: Longest valid is "()()"
\`\`\`

**Example 3:**
\`\`\`
s = ""
Output: 0
\`\`\`

**Example 4:**
\`\`\`
s = "()(())"
Output: 6
Explanation: Entire string is valid
\`\`\`

## Constraints
- 0 <= s.length <= 3 * 10^4
- s[i] is '(' or ')'`,
            starterCode: `def longestValidParentheses(s: str) -> int:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `# Approach 1: Stack with indices
def longestValidParentheses(s: str) -> int:
    stack = [-1]  # Store index of last unmatched position
    max_len = 0

    for i, char in enumerate(s):
        if char == '(':
            stack.append(i)
        else:
            stack.pop()
            if not stack:
                # No matching '(', push current as new base
                stack.append(i)
            else:
                # Valid substring from stack[-1]+1 to i
                max_len = max(max_len, i - stack[-1])

    return max_len

# Approach 2: DP
def longestValidParentheses_dp(s: str) -> int:
    if not s:
        return 0

    n = len(s)
    dp = [0] * n  # dp[i] = length of longest valid ending at i
    max_len = 0

    for i in range(1, n):
        if s[i] == ')':
            if s[i-1] == '(':
                # Case: "()"
                dp[i] = (dp[i-2] if i >= 2 else 0) + 2
            elif dp[i-1] > 0:
                # Case: "))" - check if there's matching '('
                j = i - dp[i-1] - 1
                if j >= 0 and s[j] == '(':
                    dp[i] = dp[i-1] + 2 + (dp[j-1] if j >= 1 else 0)

            max_len = max(max_len, dp[i])

    return max_len`
            },
            hints: [
                { afterAttempt: 1, text: 'Stack approach: store INDICES instead of characters' },
                { afterAttempt: 2, text: 'Initialize stack with -1 as a base marker for calculating lengths' },
                { afterAttempt: 2, text: 'When matching ")", calculate length as i - stack[-1]' },
                { afterAttempt: 3, text: 'DP approach: dp[i] = longest valid ending at i. Two cases: "..()" and "..))' },
            ],
            testCases: [
                { input: 's="(()"', expectedOutput: '2' },
                { input: 's=")()())"', expectedOutput: '4' },
                { input: 's=""', expectedOutput: '0' },
                { input: 's="()(())"', expectedOutput: '6' },
                { input: 's="(()()"', expectedOutput: '4' },
                { input: 's="(()(((()"', expectedOutput: '2' },
            ],
            solutionExplanation: `## Approach 1: Stack with Indices

**Key Insight:** Store indices on the stack, not characters. This lets us calculate lengths!

### Algorithm:
1. Initialize stack with [-1] as base
2. For '(': push index
3. For ')': pop, then:
   - If stack empty: push current index as new base
   - If stack not empty: length = i - stack[-1]

### Walkthrough

\`\`\`
s = ")()())"
index: 0 1 2 3 4 5

i=0 ')': pop -1, stack empty → push 0 → stack=[0]
i=1 '(': push 1 → stack=[0,1]
i=2 ')': pop 1 → length=2-0=2 → stack=[0], max=2
i=3 '(': push 3 → stack=[0,3]
i=4 ')': pop 3 → length=4-0=4 → stack=[0], max=4
i=5 ')': pop 0, stack empty → push 5 → stack=[5]

Answer: 4
\`\`\`

## Approach 2: DP

**State:** dp[i] = longest valid parentheses ending at index i

**Two cases for s[i] == ')':**

1. **s[i-1] == '(':** Pattern is "...()"
   \`dp[i] = dp[i-2] + 2\`

2. **s[i-1] == ')':** Pattern is "...))"
   Check if there's a matching '(' at position i - dp[i-1] - 1
   \`dp[i] = dp[i-1] + 2 + dp[j-1]\`

---

**Time:** O(n) for both
**Space:** O(n) for both`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-remove-invalid',
            title: 'Remove Invalid Parentheses',
            description: 'Remove minimum characters using BFS',
      targetComplexity: { time: 'O(V+E)', space: 'O(V)' },
            requiredForProgress: true,
            instruction: `# Remove Invalid Parentheses (LeetCode 301)

**Interview Context:** Hard BFS/backtracking problem. Return ALL valid results.

| Difficulty | Expected Time | Concepts Tested |
|------------|---------------|-----------------|
| Hard | 30-40 minutes | BFS, Backtracking |

## Problem

Given a string \`s\` that contains parentheses and letters, remove the minimum number of invalid parentheses to make the string valid.

Return all possible valid strings. The answer can be returned in any order.

## Examples

**Example 1:**
\`\`\`
s = "()())()"
Output: ["(())()","()()()"]
\`\`\`

**Example 2:**
\`\`\`
s = "(a)())()"
Output: ["(a())()","(a)()()"]
\`\`\`

**Example 3:**
\`\`\`
s = ")("
Output: [""]
\`\`\`

## Key Insight: BFS

Use BFS to explore removals level by level:
- Level 0: original string
- Level 1: all strings with 1 char removed
- Level 2: all strings with 2 chars removed
- ...

Stop at first level where valid strings are found!

## Constraints
- 1 <= s.length <= 25
- s consists of lowercase letters and parentheses '(' and ')'`,
            starterCode: `def removeInvalidParentheses(s: str) -> list[str]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `from collections import deque

def removeInvalidParentheses(s: str) -> list[str]:
    def isValid(string):
        count = 0
        for char in string:
            if char == '(':
                count += 1
            elif char == ')':
                count -= 1
                if count < 0:
                    return False
        return count == 0

    # BFS
    result = []
    visited = {s}
    queue = deque([s])
    found = False

    while queue:
        # Process entire level
        level_size = len(queue)

        for _ in range(level_size):
            current = queue.popleft()

            if isValid(current):
                result.append(current)
                found = True

            # If we found valid strings at this level, don't go deeper
            if found:
                continue

            # Generate all possible removals
            for i in range(len(current)):
                if current[i] not in '()':
                    continue  # Skip letters

                candidate = current[:i] + current[i+1:]
                if candidate not in visited:
                    visited.add(candidate)
                    queue.append(candidate)

        # Stop if we found valid strings at this level
        if found:
            break

    return result if result else [""]`
            },
            hints: [
                { afterAttempt: 1, text: 'Use BFS: explore all 1-removal strings, then all 2-removal strings, etc.' },
                { afterAttempt: 2, text: 'Stop as soon as you find valid strings - that\'s the minimum removal level' },
                { afterAttempt: 2, text: 'Use a set to avoid processing duplicate strings' },
                { afterAttempt: 3, text: 'isValid() helper: track balance, return False if balance goes negative' },
            ],
            testCases: [
                { input: 's="()())()"', expectedOutput: '["(())()","()()()"]' },
                { input: 's="(a)())()"', expectedOutput: '["(a())()","(a)()()"]' },
                { input: 's=")("', expectedOutput: '[""]' },
                { input: 's="()"', expectedOutput: '["()"]' },
                { input: 's="(()"', expectedOutput: '["()"]' },
            ],
            solutionExplanation: `## BFS Approach

**Why BFS?** We want MINIMUM removals. BFS explores by levels:
- Level 0: 0 removals
- Level 1: 1 removal
- Level 2: 2 removals
- ...

First level with valid strings = minimum removals!

## Algorithm

1. Start BFS from original string
2. For each string, try removing each parenthesis
3. Use visited set to avoid duplicates
4. When valid strings found, collect them all from current level, then stop

## Walkthrough

\`\`\`
s = "())"

Level 0: "()" - invalid
Level 1:
  - Remove idx 0: "))" - invalid
  - Remove idx 1: "()" - VALID!
  - Remove idx 2: "()" - duplicate, skip

Result: ["()"]
\`\`\`

## Time Complexity

Worst case: O(2^n) - each position can be removed or not.
But BFS ensures we stop at minimum removal level.

---

**Time:** O(2^n × n) worst case
**Space:** O(2^n) for visited set`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-serialize-tree',
            title: 'Serialize and Deserialize Binary Tree',
            description: 'Convert tree to string and back using parentheses-like encoding',
      targetComplexity: { time: 'O(n)', space: 'O(h)' },
            requiredForProgress: true,
            instruction: `# Serialize and Deserialize Binary Tree (LeetCode 297)

**Interview Context:** Design problem connecting trees and string encoding. Very common!

| Difficulty | Expected Time | Concepts Tested |
|------------|---------------|-----------------|
| Hard | 30-40 minutes | Tree Traversal, String Parsing |

## Problem

Design an algorithm to serialize a binary tree to a string and deserialize that string back to the original tree structure.

**Serialize:** Convert tree to string
**Deserialize:** Convert string back to tree

## Examples

**Example 1:**
\`\`\`
    1
   / \\
  2   3
     / \\
    4   5

Serialize: "1,2,null,null,3,4,null,null,5,null,null"
Deserialize: Back to original tree
\`\`\`

**Example 2:**
\`\`\`
Empty tree
Serialize: ""
Deserialize: None
\`\`\`

## The Parentheses Connection

Think of the serialized format as nested parentheses:
- Each node is like "("
- Each null is like ")"
- The structure mirrors the tree!

\`\`\`
Tree:    1
        / \\
       2   3

Preorder: 1 ( 2 ( null null ) 3 ( null null ) )
\`\`\`

## Constraints
- Number of nodes <= 10^4
- -1000 <= Node.val <= 1000`,
            starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Codec:
    def serialize(self, root: TreeNode) -> str:
        pass

    def deserialize(self, data: str) -> TreeNode:
        pass`,
            solution: {
                afterAttempt: 3,
                text: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Codec:
    def serialize(self, root: TreeNode) -> str:
        """Preorder traversal with null markers"""
        result = []

        def preorder(node):
            if not node:
                result.append('null')
                return
            result.append(str(node.val))
            preorder(node.left)
            preorder(node.right)

        preorder(root)
        return ','.join(result)

    def deserialize(self, data: str) -> TreeNode:
        """Rebuild from preorder with null markers"""
        if not data:
            return None

        values = iter(data.split(','))

        def build():
            val = next(values)
            if val == 'null':
                return None

            node = TreeNode(int(val))
            node.left = build()
            node.right = build()
            return node

        return build()`
            },
            hints: [
                { afterAttempt: 1, text: 'Use preorder traversal for serialization - it naturally captures the tree structure' },
                { afterAttempt: 2, text: 'Include "null" markers for empty children - this makes deserialization unambiguous' },
                { afterAttempt: 2, text: 'For deserialization, use an iterator and recursively build left then right subtree' },
                { afterAttempt: 3, text: 'The key insight: with null markers, preorder traversal uniquely identifies a tree!' },
            ],
            testCases: [
                { input: 'tree=[1,2,3,null,null,4,5]', expectedOutput: '"1,2,null,null,3,4,null,null,5,null,null"' },
                { input: 'tree=[]', expectedOutput: '"null"' },
                { input: 'tree=[1]', expectedOutput: '"1,null,null"' },
            ],
            solutionExplanation: `## Why Preorder + Null Markers?

Preorder visits: **Root → Left → Right**

With null markers, this uniquely identifies any tree!

\`\`\`
    1
   / \\
  2   3

Preorder with nulls: [1, 2, null, null, 3, null, null]
                      ↑  ↑   ↑     ↑    ↑   ↑     ↑
                      root
                         left of 1
                            nulls for 2
                                       right of 1
                                          nulls for 3
\`\`\`

## The Parentheses Connection

Think of it like balanced parentheses:
- Node value = opening bracket
- "null" = closing bracket

\`\`\`
1 ( 2 ( ) ( ) ) ( 3 ( ) ( ) )
↑   ↑   ↑   ↑     ↑   ↑   ↑
1   2  null null  3  null null
\`\`\`

---

## Solution 1: List-based (Shown Above)

Uses a list to collect values, then joins at the end.

### Serialize
\`\`\`python
def preorder(node):
    if not node:
        result.append('null')
        return
    result.append(str(node.val))
    preorder(node.left)
    preorder(node.right)
\`\`\`

### Deserialize (Iterator)
\`\`\`python
def build():
    val = next(values)
    if val == 'null':
        return None
    node = TreeNode(int(val))
    node.left = build()
    node.right = build()
    return node
\`\`\`

---

## Solution 2: String Concatenation (Alternative)

Builds string directly through recursion.

### Serialize
\`\`\`python
def serialize(self, root):
    def rserialize(root, string):
        if root is None:
            string += 'None,'
        else:
            string += str(root.val) + ','
            string = rserialize(root.left, string)
            string = rserialize(root.right, string)
        return string

    return rserialize(root, '')
\`\`\`

### Deserialize (List Pop)
\`\`\`python
def deserialize(self, data):
    def rdeserialize(l):
        if l[0] == 'None':
            l.pop(0)
            return None

        root = TreeNode(l[0])
        l.pop(0)
        root.left = rdeserialize(l)
        root.right = rdeserialize(l)
        return root

    data_list = data.split(',')
    root = rdeserialize(data_list)
    return root
\`\`\`

**Note:** Using \`l.pop(0)\` mutates the list, which acts as shared state across recursive calls!

---

## Comparison

| Approach | Serialize | Deserialize | Notes |
|----------|-----------|-------------|-------|
| List + Join | O(n) | O(n) with iterator | Cleaner, uses \`iter()\` |
| String Concat | O(n²) worst | O(n²) with pop(0) | Simpler to understand |

**For interviews:** List approach is better for performance, but string approach is easier to explain!

---

**Time:** O(n) for both operations
**Space:** O(n) for the string and recursion`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-text-justification',
            title: 'Text Justification',
            description: 'Format text with full justification - a classic Hard string problem',
      targetComplexity: { time: 'O(n)', space: 'O(n)' },
            requiredForProgress: false,
            instruction: `# Text Justification (LeetCode 68)

**Interview Context:** Classic Hard problem asked at Google, LinkedIn. Tests string manipulation and edge case handling.

| Difficulty | Expected Time | Concepts Tested |
|------------|---------------|-----------------|
| Hard | 35-45 minutes | String Manipulation, Greedy, Edge Cases |

## Problem

Given an array of words and a width \`maxWidth\`, format the text such that each line has exactly \`maxWidth\` characters and is **fully (left and right) justified**.

**Rules:**
1. Pack as many words as you can in each line (greedy approach)
2. Pad extra spaces \`' '\` so each line has exactly \`maxWidth\` characters
3. Extra spaces between words should be distributed **as evenly as possible**
4. If spaces don't divide evenly, **left slots get more spaces** than right slots
5. **Last line:** left-justified (no extra space between words, pad right with spaces)
6. **Single word line:** left-justified

## Examples

**Example 1:**
\`\`\`
words = ["This", "is", "an", "example", "of", "text", "justification."]
maxWidth = 16

Output:
[
   "This    is    an",
   "example  of text",
   "justification.  "
]
\`\`\`

**Example 2:**
\`\`\`
words = ["What","must","be","acknowledgment","shall","be"]
maxWidth = 16

Output:
[
  "What   must   be",
  "acknowledgment  ",  ← Single word: left-justified
  "shall be        "   ← Last line: left-justified
]
\`\`\`

**Example 3:**
\`\`\`
words = ["Science","is","what","we","understand","well","enough","to","explain",
         "to","a","computer.","Art","is","everything","else","we","do"]
maxWidth = 20

Output:
[
  "Science  is  what we",
  "understand      well",  ← Note: only 2 words, 6 spaces in gap
  "enough to explain to",
  "a  computer.  Art is",
  "everything  else  we",
  "do                  "   ← Last line
]
\`\`\`

## Constraints
- 1 <= words.length <= 300
- 1 <= words[i].length <= 20
- words[i] consists of English letters and symbols
- 1 <= maxWidth <= 100
- words[i].length <= maxWidth`,
            starterCode: `def fullJustify(words: list[str], maxWidth: int) -> list[str]:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def fullJustify(words: list[str], maxWidth: int) -> list[str]:
    """
    Two-phase approach:
    1. Group words into lines (greedy)
    2. Justify each line
    """
    # Phase 1: Group words into lines
    lines = []           # List of word lists
    line_word_len = []   # Total word length (without spaces) for each line
    line = []            # Current line's words
    cur_len = 0          # Current line length

    for word in words:
        w_len = len(word)
        if not cur_len:  # New line
            line = [word]
            cur_len = w_len
        else:
            # Can we fit this word? (+1 for space between words)
            if cur_len + w_len + 1 <= maxWidth:
                line.append(word)
                cur_len += w_len + 1
            else:
                # Start new line
                lines.append(line)
                line_word_len.append(cur_len - (len(line) - 1))  # Subtract spaces
                line = [word]
                cur_len = w_len

    # Don't forget the last line!
    lines.append(line)
    line_word_len.append(cur_len - (len(line) - 1))

    # Phase 2: Justify each line
    result = []
    last_idx = len(lines) - 1

    for idx, line in enumerate(lines):
        total_spaces = maxWidth - line_word_len[idx]
        gaps = len(line) - 1

        # Special cases: single word OR last line → left-justify
        if gaps == 0 or idx == last_idx:
            result.append(' '.join(line) + ' ' * (total_spaces - gaps))
        else:
            # Distribute spaces evenly, extra to left gaps
            base_spaces = total_spaces // gaps
            extra_spaces = total_spaces % gaps

            justified_line = ''
            for i in range(gaps):
                spaces = base_spaces + (1 if i < extra_spaces else 0)
                justified_line += line[i] + ' ' * spaces
            justified_line += line[-1]  # Last word (no trailing space)

            result.append(justified_line)

    return result`
            },
            hints: [
                { afterAttempt: 1, text: 'Break into two phases: (1) group words into lines, (2) justify each line' },
                { afterAttempt: 2, text: 'Greedy grouping: keep adding words while total + spaces <= maxWidth' },
                { afterAttempt: 2, text: 'For justification: total_spaces // gaps = base, total_spaces % gaps = extra for left slots' },
                { afterAttempt: 3, text: 'Edge cases: single word per line AND last line → left-justify with padding on right' },
            ],
            testCases: [
                { input: 'words=["This","is","an","example","of","text","justification."], maxWidth=16', expectedOutput: '["This    is    an","example  of text","justification.  "]' },
                { input: 'words=["What","must","be","acknowledgment","shall","be"], maxWidth=16', expectedOutput: '["What   must   be","acknowledgment  ","shall be        "]' },
                { input: 'words=["a"], maxWidth=5', expectedOutput: '["a    "]' },
                { input: 'words=["Hello","World"], maxWidth=15', expectedOutput: '["Hello World    "]' },
            ],
            solutionExplanation: `## Two-Phase Approach

### Phase 1: Greedy Line Grouping

Pack words into lines greedily:
\`\`\`python
for word in words:
    if current_length + len(word) + 1 <= maxWidth:
        # Fits! Add to current line
        line.append(word)
        current_length += len(word) + 1
    else:
        # Doesn't fit! Start new line
        lines.append(line)
        line = [word]
\`\`\`

### Phase 2: Justify Each Line

For each line, calculate:
- \`total_spaces\` = maxWidth - sum of word lengths
- \`gaps\` = number of words - 1

**Space Distribution:**
\`\`\`python
base_spaces = total_spaces // gaps   # Every gap gets this many
extra_spaces = total_spaces % gaps   # First 'extra' gaps get +1
\`\`\`

**Example:** 10 spaces, 3 gaps
- base = 10 // 3 = 3
- extra = 10 % 3 = 1
- Gap distribution: [4, 3, 3] (first gap gets extra)

## Handling Edge Cases

### Single Word Line
\`\`\`python
if gaps == 0:
    result.append(word + ' ' * (maxWidth - len(word)))
\`\`\`

### Last Line (Left-Justified)
\`\`\`python
if idx == last_idx:
    result.append(' '.join(line) + ' ' * remaining_spaces)
\`\`\`

## Walkthrough: Example 1

\`\`\`
words = ["This", "is", "an", "example", "of", "text", "justification."]
maxWidth = 16

Phase 1 - Grouping:
Line 1: ["This", "is", "an"] → len = 4+2+2 = 8
Line 2: ["example", "of", "text"] → len = 7+2+4 = 13
Line 3: ["justification."] → len = 14

Phase 2 - Justifying:
Line 1: 16 - 8 = 8 spaces, 2 gaps → 4 each
        "This    is    an"
Line 2: 16 - 13 = 3 spaces, 2 gaps → 2, 1
        "example  of text"
Line 3: Last line, left-justify
        "justification.  "
\`\`\`

---

**Time:** O(n) where n = total characters in all words
**Space:** O(n) for the result

## Common Mistakes

1. **Forgetting last line rule** - must be left-justified
2. **Off-by-one in space calculation** - remember to count gaps, not words
3. **Not handling single-word lines** - causes division by zero
4. **Forgetting to pad last line** - still needs to be maxWidth chars`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-decrypt-string',
            title: 'Decrypt String from Alphabet to Integer Mapping',
            description: 'Decode a string where # marks two-digit numbers',
      targetComplexity: { time: 'O(n)', space: 'O(n)' },
            requiredForProgress: false,
            instruction: `# Decrypt String from Alphabet to Integer Mapping (LeetCode 1309)

**Interview Context:** String parsing with delimiters. Similar to parentheses - scan and handle special markers!

| Difficulty | Expected Time | Concepts Tested |
|------------|---------------|-----------------|
| Easy | 10-15 minutes | String Parsing, Reverse Iteration |

## Problem

Given a string \`s\` formed by digits ('0' - '9') and '#', map it to English lowercase characters as follows:

- Characters 'a' to 'i' are represented by '1' to '9' respectively
- Characters 'j' to 'z' are represented by '10#' to '26#' respectively

Return the string formed after mapping.

**Note:** It's guaranteed that a unique mapping will always exist (no invalid input like "35#").

## Examples

**Example 1:**
\`\`\`
s = "10#11#12"
Output: "jkab"
Explanation: "10#" → 'j', "11#" → 'k', "1" → 'a', "2" → 'b'
\`\`\`

**Example 2:**
\`\`\`
s = "1326#"
Output: "acz"
Explanation: "1" → 'a', "3" → 'c', "26#" → 'z'
\`\`\`

**Example 3:**
\`\`\`
s = "25#"
Output: "y"
\`\`\`

**Example 4:**
\`\`\`
s = "12345678910#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#"
Output: "abcdefghijklmnopqrstuvwxyz"
\`\`\`

## Key Insight

The '#' tells us the PREVIOUS two digits form a number 10-26. This is easier to handle by **scanning backwards**!

## Constraints
- 1 <= s.length <= 1000
- s consists of digits and '#' only
- s is a valid encoding`,
            starterCode: `def freqAlphabets(s: str) -> str:
    pass`,
            solution: {
                afterAttempt: 3,
                text: `# Solution 1: Reverse iteration with index
def freqAlphabets(s: str) -> str:
    i = len(s) - 1
    output = []

    while i >= 0:
        if s[i] == '#':
            # Two-digit number: take s[i-2] and s[i-1]
            nums = s[i-2] + s[i-1]
            i -= 3
        else:
            # Single digit
            nums = s[i]
            i -= 1

        # Convert number to character: 1 → 'a', 2 → 'b', ...
        output.append(chr(int(nums) + ord('a') - 1))

    return ''.join(output)[::-1]

# Solution 2: Using list as stack (pop from end)
def freqAlphabets_v2(s: str) -> str:
    num_list = list(s)
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    result = ""

    while num_list:
        current = num_list.pop()
        if current == '#':
            digit2 = num_list.pop()
            digit1 = num_list.pop()
            number = digit1 + digit2
            result += alphabet[int(number) - 1]
        else:
            result += alphabet[int(current) - 1]

    return result[::-1]`
            },
            hints: [
                { afterAttempt: 1, text: 'The # character tells you the previous two digits form a number 10-26' },
                { afterAttempt: 2, text: 'Try scanning from RIGHT to LEFT - when you see #, you know to grab 2 digits before it' },
                { afterAttempt: 2, text: 'Convert number to char: chr(num + ord("a") - 1) or use alphabet string indexing' },
                { afterAttempt: 3, text: 'Build result in reverse order, then reverse at the end' },
            ],
            testCases: [
                { input: 's="10#11#12"', expectedOutput: '"jkab"' },
                { input: 's="1326#"', expectedOutput: '"acz"' },
                { input: 's="25#"', expectedOutput: '"y"' },
                { input: 's="123"', expectedOutput: '"abc"' },
                { input: 's="10#"', expectedOutput: '"j"' },
            ],
            solutionExplanation: `## Why Scan Backwards?

When scanning forward, it's ambiguous:
- Is "12" → "ab" or is it part of "12#" → "l"?

When scanning **backwards**, the '#' tells us immediately!
- See '#' → grab previous 2 digits
- See digit (no '#') → it's a single-digit number

## Solution 1: Index-based Reverse Scan

\`\`\`python
def freqAlphabets(s):
    i = len(s) - 1
    output = []

    while i >= 0:
        if s[i] == '#':
            nums = s[i-2] + s[i-1]  # Two digits before #
            i -= 3
        else:
            nums = s[i]
            i -= 1

        output.append(chr(int(nums) + ord('a') - 1))

    return ''.join(output)[::-1]  # Reverse the result
\`\`\`

## Solution 2: Stack-based (Pop from End)

\`\`\`python
def freqAlphabets(s):
    num_list = list(s)
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    result = ""

    while num_list:
        current = num_list.pop()  # Pop from end
        if current == '#':
            digit2 = num_list.pop()
            digit1 = num_list.pop()
            result += alphabet[int(digit1 + digit2) - 1]
        else:
            result += alphabet[int(current) - 1]

    return result[::-1]
\`\`\`

## Converting Number to Character

Two equivalent ways:
\`\`\`python
# Method 1: chr() and ord()
char = chr(int(nums) + ord('a') - 1)
# 1 + 97 - 1 = 97 → 'a'
# 10 + 97 - 1 = 106 → 'j'

# Method 2: String indexing
alphabet = "abcdefghijklmnopqrstuvwxyz"
char = alphabet[int(nums) - 1]
# alphabet[0] = 'a', alphabet[9] = 'j'
\`\`\`

## Walkthrough

\`\`\`
s = "10#11#12"

Scan backwards:
i=7: '2' → single digit → output=['b']
i=6: '1' → single digit → output=['b','a']
i=5: '#' → grab "11" → output=['b','a','k']
i=2: '#' → grab "10" → output=['b','a','k','j']

Reverse: "jkab"
\`\`\`

---

**Time:** O(n) - single pass
**Space:** O(n) - output string

## Connection to Parentheses

This problem uses similar techniques:
- **Delimiter-based parsing** (like matching brackets)
- **Reverse scanning** (like some stack problems)
- **Building result and reversing** (common pattern)`,
            complexityQuizPlacement: 'after',
            difficulty: 'easy',
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-find-missing-numbers',
            title: 'Find the Missing Numbers',
            description: 'Print missing numbers in a range with hyphenated notation - a real Google interview question!',
      targetComplexity: { time: 'O(n)', space: 'O(1)' },
            requiredForProgress: false,
            instruction: `# Find the Missing Numbers (Google Interview Question)

**Interview Context:** This was asked at Google! A Pathrise advisor's favorite interview question. Tests progression from brute force to optimal with multiple approaches.

| Difficulty | Expected Time | Concepts Tested |
|------------|---------------|-----------------|
| Medium | 30-40 minutes | Arrays, Sets, Binary Search, Two Pointers |

## Problem

Given a range between \`start\` and \`end\` and a **sorted array** \`arr\` of integer values, print the missing items from the list for the given range.

**Output Format:** Use shorthand hyphenated notation when possible:
- \`4-5\` instead of \`4, 5\`
- \`4-10\` instead of \`4, 5, 6, 7, 8, 9, 10\`

## Examples

Given \`arr = [1, 3, 5, 7, 8, 9, 13]\`:

\`\`\`
find_missing_nums(arr, 5, 12)  → "6, 10-12"
find_missing_nums(arr, 1, 5)   → "2, 4"
find_missing_nums(arr, 10, 13) → "10-12"
\`\`\`

## Clarifying Questions

- **Can the list be empty?** Yes
- **Are start and/or end always in the list?** No
- **Can there be duplicates and negative numbers?** Yes
- **Are start and end inclusive?** Yes

## Challenge Mode (Optional)

1. Handle negative numbers with parentheses: \`(-5)-(-3)\` instead of \`-5--3\`
2. Try to implement as many different approaches as possible!

## Constraints
- -10^6 <= start <= end <= 10^6
- 0 <= arr.length <= 10^5
- arr is sorted in ascending order`,
            starterCode: `def find_missing_nums(arr: list[int], start: int, end: int) -> str:
    """
    Return missing numbers as a string with hyphenated ranges.
    Example: "2, 4, 6-8, 10"
    """
    pass`,
            solution: {
                afterAttempt: 3,
                text: `def find_missing_nums(arr: list[int], start: int, end: int) -> str:
    """
    Optimal Two-Pointer Approach - O(log M + min(N, M))
    """
    def format_range(lo, hi):
        if lo == hi:
            return str(lo)
        else:
            return f"{lo}-{hi}"

    if not arr:
        return format_range(start, end) if start <= end else ""

    # Convert to set for O(1) lookup (Approach 2)
    # Or use two pointers (Approach 4 - shown here)
    arr_set = set(arr)

    result = []
    range_start = None

    for num in range(start, end + 1):
        if num not in arr_set:
            # Start a new range or extend current
            if range_start is None:
                range_start = num
            range_end = num
        else:
            # End current range if exists
            if range_start is not None:
                result.append(format_range(range_start, range_end))
                range_start = None

    # Don't forget the last range!
    if range_start is not None:
        result.append(format_range(range_start, range_end))

    return ", ".join(result)`
            },
            hints: [
                { afterAttempt: 1, text: 'Start with brute force: loop through the range and check if each number exists in array' },
                { afterAttempt: 2, text: 'The "in" operator on a list is O(n)! Can you make lookups faster?' },
                { afterAttempt: 2, text: 'Convert the array to a set for O(1) lookups, or use binary search since array is sorted' },
                { afterAttempt: 3, text: 'Track consecutive missing numbers to build ranges. Use a helper function for formatting.' },
            ],
            testCases: [
                { input: 'arr=[1,3,5,7,8,9,13], start=5, end=12', expectedOutput: '"6, 10-12"' },
                { input: 'arr=[1,3,5,7,8,9,13], start=1, end=5', expectedOutput: '"2, 4"' },
                { input: 'arr=[1,3,5,7,8,9,13], start=10, end=13', expectedOutput: '"10-12"' },
                { input: 'arr=[], start=1, end=5', expectedOutput: '"1-5"' },
                { input: 'arr=[1,2,3,4,5], start=1, end=5', expectedOutput: '""' },
            ],
            solutionExplanation: `## This Problem Has 4 Different Approaches!

In the actual Google interview, the candidate was challenged to come up with as many approaches as possible in 45 minutes.

---

## Approach 1: Brute Force - O(N × M)

Loop through the range and do a linear scan through the array.

\`\`\`python
def find_missing_nums_v1(arr, start, end):
    result = []
    for num in range(start, end + 1):
        if num not in arr:  # O(M) linear scan!
            result.append(num)
    return result
\`\`\`

**Time:** O(N × M) where N = range size, M = array length
**Space:** O(1)

### What Went Wrong?

The \`in\` keyword on a list does a **linear scan**! Similar pitfalls:
- JavaScript: \`includes()\`, \`indexOf()\`
- Java: \`contains()\`, \`indexOf()\`

---

## Approach 2: Trade Space for Time - O(N + M)

Convert the array to a **set** for O(1) lookups!

\`\`\`python
def find_missing_nums_v2(arr, start, end):
    arr_set = set(arr)  # O(M) to create
    result = []
    for num in range(start, end + 1):
        if num not in arr_set:  # O(1) lookup!
            result.append(num)
    return result
\`\`\`

**Time:** O(N + M)
**Space:** O(M) for the set

---

## Approach 3: Binary Search - O(N × log M)

Use the fact that the array is **sorted**!

\`\`\`python
def binary_search(arr, target):
    l, r = 0, len(arr) - 1
    while l <= r:
        mid = (l + r) // 2
        if arr[mid] == target:
            return True
        elif arr[mid] < target:
            l = mid + 1
        else:
            r = mid - 1
    return False

def find_missing_nums_v3(arr, start, end):
    result = []
    for num in range(start, end + 1):
        if not binary_search(arr, num):
            result.append(num)
    return result
\`\`\`

**Time:** O(N × log M)
**Space:** O(1)

---

## Approach 4: Two Pointers (Optimal) - O(log M + min(N, M))

Walk through the sorted array and the range simultaneously!

\`\`\`python
def find_missing_nums_v4(arr, start, end):
    if not arr:
        return format_range(start, end)

    result = []
    next_expected = start

    for num in arr:
        if num < start:
            continue
        if num > end:
            break
        if num > next_expected:
            # Missing range: [next_expected, num-1]
            result.append(format_range(next_expected, num - 1))
        next_expected = num + 1

    # Handle remaining range after array ends
    if next_expected <= end:
        result.append(format_range(next_expected, end))

    return ", ".join(result)
\`\`\`

**Time:** O(log M + min(N, M)) - binary search to find start, then linear scan
**Space:** O(1)

---

## Formatting with Hyphens

\`\`\`python
def format_range(lo, hi):
    if lo == hi:
        return str(lo)
    elif lo < 0 and hi < 0:
        return f"({lo})-({hi})"  # Negative numbers
    elif lo < 0:
        return f"({lo})-{hi}"
    else:
        return f"{lo}-{hi}"
\`\`\`

---

## Key Takeaways

1. **Start with brute force** - optimize after having something working
2. **Know your built-in functions** - \`in\` on list is O(n), on set is O(1)
3. **Look for keywords** - "sorted array" screams binary search or two pointers
4. **Don't assume easy** - this isn't graph/DP but still has multiple optimization levels
5. **Chunk the problem** - use helper methods like \`format_range()\`

---

**Interview Tip:** When given extra time, try to come up with multiple approaches. It shows depth of knowledge!`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
        }
];
