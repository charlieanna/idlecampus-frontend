import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module9RecursionTreesLessonSmartPracticeExercises: ExerciseSection[] = [
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-factorial',
      title: 'Factorial - Your First Recursive Function',
      description: 'Implement factorial(n) recursively',
      targetComplexity: { time: 'O(n)', space: 'O(n)' },
      requiredForProgress: true,
      instruction: `# Factorial - Your First Recursive Function

## The Problem

**Factorial** of n (written as n!) is the product of all positive integers up to n.

\`\`\`
5! = 5 × 4 × 3 × 2 × 1 = 120
4! = 4 × 3 × 2 × 1 = 24
3! = 3 × 2 × 1 = 6
2! = 2 × 1 = 2
1! = 1
0! = 1  (by definition)
\`\`\`

## The Recursive Insight

Notice the pattern:
\`\`\`
5! = 5 × 4!
4! = 4 × 3!
3! = 3 × 2!
...
\`\`\`

**factorial(n) = n × factorial(n-1)**

This is a **recursive definition**!

## Your Task

Implement \`factorial(n)\` recursively.

### Step 1: Identify the BASE CASE
- What's the simplest factorial you can compute directly?
- **Hint:** factorial(0) = ?

### Step 2: Identify the RECURSIVE CASE
- How do you express factorial(n) using factorial(n-1)?

## Example

\`\`\`python
factorial(4)
→ 4 × factorial(3)
→ 4 × (3 × factorial(2))
→ 4 × (3 × (2 × factorial(1)))
→ 4 × (3 × (2 × (1 × factorial(0))))
→ 4 × (3 × (2 × (1 × 1)))
→ 4 × (3 × (2 × 1))
→ 4 × (3 × 2)
→ 4 × 6
→ 24
\`\`\`

Think about:
- What happens without the base case?
- How does the answer "build up" as calls return?`,
      starterCode: `def factorial(n: int) -> int:
    pass

# Test
print(factorial(5))  # Should print 120
print(factorial(0))  # Should print 1
print(factorial(3))  # Should print 6`,
      solution: {
        afterAttempt: 3,
        text: `def factorial(n: int) -> int:
    # Base case: 0! = 1
    if n == 0:
        return 1

    # Recursive case: n! = n × (n-1)!
    return n * factorial(n - 1)

# Test
print(factorial(5))  # 120
print(factorial(0))  # 1
print(factorial(3))  # 6`
      },
      hints: [
        { afterAttempt: 1, text: 'Base case: What\'s factorial(0)? It\'s 1 by definition!' },
        { afterAttempt: 2, text: 'Recursive case: factorial(n) = n × factorial(n-1)' },
        { afterAttempt: 3, text: 'Make sure to return the values, not just compute them!' }
      ],
      testCases: [
        {
          input: '5',
          expectedOutput: '120',
          description: 'factorial(5) = 5×4×3×2×1'
        },
        {
          input: '0',
          expectedOutput: '1',
          description: 'Base case: factorial(0) = 1'
        },
        {
          input: '3',
          expectedOutput: '6',
          description: 'factorial(3) = 3×2×1'
        }
      ],
      solutionExplanation: `## 🔴 Brute Force Approach: Iterative Loop

The first approach most people think of is using a loop to multiply all numbers:

\`\`\`python
def factorial_iterative(n: int) -> int:
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result
\`\`\`

**Time Complexity:** O(n) - loop runs n times
**Space Complexity:** O(1) - only one variable

## 🟡 Bottleneck Analysis

While the iterative approach works, it:
- ❌ Doesn't leverage the recursive structure of factorial
- ❌ Less elegant for naturally recursive problems
- ❌ Requires explicit loop management and state tracking

The **key insight**: factorial(n) = n × factorial(n-1) is a recursive definition!

## 🟢 Optimal Approach: Recursion

Leverage the recursive structure directly:

\`\`\`python
def factorial(n: int) -> int:
    # Base case: stop the recursion
    if n == 0:
        return 1

    # Recursive case: n! = n × (n-1)!
    return n * factorial(n - 1)
\`\`\`

**Why this is better:**
✅ Matches the mathematical definition perfectly
✅ Extremely concise and readable
✅ No manual state management needed
✅ Foundation for understanding recursive patterns

## ✅ Final Complexity

**Time:** O(n) - makes n recursive calls
**Space:** O(n) - call stack depth of n

**Note:** Space is O(n) due to the call stack, but the code is much cleaner!

## 🎯 Pattern Learned

**Recursion Tree Structure:**
\`\`\`
factorial(4)
    ↓ (4 × ?)
factorial(3)
    ↓ (3 × ?)
factorial(2)
    ↓ (2 × ?)
factorial(1)
    ↓ (1 × ?)
factorial(0) → 1 [BASE CASE]
\`\`\`

**Key Pattern:** Linear recursion creates a chain-like tree with one child per node. This pattern appears in:
- Sum of array elements
- String reversal
- Linked list traversal

**Critical Skills Gained:**
1. Identifying base cases (factorial(0) = 1)
2. Expressing recursive relationships (n × factorial(n-1))
3. Understanding call stack depth = tree height`,
      complexityQuizPlacement: 'after',
      difficulty: 'easy',
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-sum-array',
      title: 'Sum Array - Recursion with Return Values',
      description: 'Calculate the sum of an array recursively',
      targetComplexity: { time: 'O(n)', space: 'O(n)' },
      requiredForProgress: true,
      hints: [
        { afterAttempt: 1, text: 'Base case: What is the sum of an empty list?' },
        { afterAttempt: 2, text: 'Recursive step: first element + sum of the rest' }
      ],
      instruction: `# Sum Array - Recursion with Return Values

## The Problem

Calculate the sum of all elements in a list recursively.

\`\`\`python
sum_list([1, 2, 3, 4, 5])  # → 15
sum_list([10, 20, 30])     # → 60
sum_list([])               # → 0
\`\`\`

## The Recursive Insight

Think of the array as:
- **First element** + **sum of the rest**

\`\`\`
sum([1, 2, 3, 4, 5])
= 1 + sum([2, 3, 4, 5])
= 1 + (2 + sum([3, 4, 5]))
= 1 + (2 + (3 + sum([4, 5])))
= 1 + (2 + (3 + (4 + sum([5]))))
= 1 + (2 + (3 + (4 + (5 + sum([])))))
= 1 + (2 + (3 + (4 + (5 + 0))))
\`\`\`

## Your Task

Implement \`sum_list(nums, index)\` that sums elements starting from \`index\`.

### Step 1: Identify the BASE CASE
- When have you processed all elements?
- **Hint:** When index >= len(nums)
- What should you return? (Nothing left to sum!)

### Step 2: Identify the RECURSIVE CASE
- Current element: \`nums[index]\`
- Sum of rest: \`sum_list(nums, index + 1)\`
- How do you combine them?

## How Returns Build Up

\`\`\`
sum_list([1,2,3], 0)
= 1 + sum_list([1,2,3], 1)
= 1 + (2 + sum_list([1,2,3], 2))
= 1 + (2 + (3 + sum_list([1,2,3], 3)))
= 1 + (2 + (3 + 0))  ← base case returns 0
= 1 + (2 + 3)
= 1 + 5
= 6
\`\`\`

Each recursive call **returns a value** that gets used by the caller!

**All three "different" lists are the same!** 😱

## What Went Wrong?

When you do \`result.append(path)\`, you're storing a **reference** to the list object, NOT a copy.

### Memory Diagram

\`\`\`
path = [1, 2, 3]  ← The actual list object in memory
         ↑   ↑   ↑
         |   |   |
result = [•   •   •]  ← All three pointers point to SAME object!
\`\`\`

Since we keep modifying \`path\`, all saved "solutions" see the final state!

By the end, \`path = [1, 2, 3]\`, so result has 3 references to \`[1, 2, 3]\`.

## The Fix: COPY!

Use \`path[:]\` to create a **snapshot** (copy) of the current state:

\`\`\`python
def collect_paths():
    result = []
    path = []

    path.append(1)
    result.append(path[:])  # ✅ Copy!

    path.append(2)
    result.append(path[:])  # ✅ Copy!

    path.append(3)
    result.append(path[:])  # ✅ Copy!

    return result

print(collect_paths())
# [[1], [1, 2], [1, 2, 3]]  ✅ Correct!
\`\`\`

### Memory Diagram (Corrected)

\`\`\`
[1]         ← Copy 1
[1, 2]      ← Copy 2
[1, 2, 3]   ← Copy 3
  ↑   ↑   ↑
  |   |   |
result = [•   •   •]  ← Three DIFFERENT objects!
\`\`\`

Each saved item is **independent**, so changes to \`path\` don't affect saved copies.

## Three Ways to Copy

All equivalent:

\`\`\`python
result.append(path[:])         # Slice notation
result.append(list(path))      # list() constructor
result.append(path.copy())     # .copy() method
\`\`\`

## Why This Matters for Backtracking

In backtracking, we'll:
1. Build a path incrementally
2. Save complete solutions
3. Undo choices to try other options

**If you don't copy, all saved solutions will be identical!**

This is **critical** - let's practice it now! 🎯`,
      starterCode: `def sum_array(arr):
    pass`,
      testCases: [
        { input: '[1, 2, 3]', expectedOutput: '6' },
        { input: '[10, 20, 30]', expectedOutput: '60' },
        { input: '[]', expectedOutput: '0' },
        { input: '[5]', expectedOutput: '5' },
        { input: '[1, 2, 3, 4, 5]', expectedOutput: '15' },
      ],
      solution: {
        afterAttempt: 3,
        text: `# Sum Array - Recursive Solution

\`\`\`python
def sum_array(arr):
    # Base case: empty array sums to 0
    if not arr:
        return 0
    # Recursive case: first element + sum of rest
    return arr[0] + sum_array(arr[1:])
\`\`\`

# Key insight: Break array into head + tail, sum recursively`
      },
      solutionExplanation: `## Time Complexity Analysis

**sum_array(arr)**: O(n)
- Makes n recursive calls (one per element)
- Each call does O(1) work

### Space Complexity: O(n)
- Recursion stack depth is n
- Each slice creates a new list (could be optimized with index)`,

    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-grow-list',
      title: 'Grow List - Practice Copying',
      description: 'Build a path incrementally and save snapshots',
      targetComplexity: { time: 'O(n)', space: 'O(1)' },
      requiredForProgress: true,
      instruction: `# Grow List - Practice Copying

## The Problem

Implement \`grow_list(nums)\` that builds a path incrementally and saves a **snapshot** at each step.

\`\`\`python
grow_list([1, 2, 3])
# → [[1], [1, 2], [1, 2, 3]]
\`\`\`

The function should:
1. Add each element to a path one by one
2. **Save a copy** of the path after each addition
3. Return all the saved snapshots

## Your Task

Implement this **from scratch** using recursion!

### Hints

1. Use a **helper function** with a mutable \`path\` parameter
2. At each step:
   - Append the current element to path
   - **Copy and save** the path to result
   - Recurse to process the next element
   - **Pop** to undo (we'll see why this matters later!)
3. Don't forget the copy! Use \`path[:]\`

## Example Execution

\`\`\`
grow_list([1, 2, 3])

Start: path = []
Step 1: path.append(1) → path = [1]
        Save path[:] → [[1]]
Step 2: path.append(2) → path = [1, 2]
        Save path[:] → [[1], [1, 2]]
Step 3: path.append(3) → path = [1, 2, 3]
        Save path[:] → [[1], [1, 2], [1, 2, 3]]
\`\`\`

## What You're Learning

This is the **core pattern** for backtracking:
1. Make a choice (append)
2. Save state if needed (copy!)
3. Recurse
4. Undo choice (pop)

## Function Template

\`\`\`python
def grow_list(nums: list[int]) -> list[list[int]]:
    result = []
    path = []

    def helper(index: int):
        if index == len(nums):
            return

        # TODO: Add nums[index] to path
        # TODO: Save a COPY of path to result
        # TODO: Recurse: helper(index + 1)
        # TODO: Undo: path.pop()

    helper(0)
    return result

# Test
print(grow_list([1, 2, 3]))  # [[1], [1, 2], [1, 2, 3]]
\`\`\``,
      starterCode: `def grow_list(nums: list[int]) -> list[list[int]]:
    result = []
    path = []

    def helper(index: int):
        if index == len(nums):
            return

    helper(0)
    return result

# Test
print(grow_list([1, 2, 3]))  # [[1], [1, 2], [1, 2, 3]]`,
      solution: {
        afterAttempt: 3,
        text: `def grow_list(nums: list[int]) -> list[list[int]]:
    result = []
    path = []

    def helper(index: int):
        if index == len(nums):
            return

        # Make choice: add element
        path.append(nums[index])

        # Save COPY of current state
        result.append(path[:])  # Critical: path[:] not path!

        # Recurse
        helper(index + 1)

        # Undo choice (backtrack)
        path.pop()

    helper(0)
    return result

# Test
print(grow_list([1, 2, 3]))  # [[1], [1, 2], [1, 2, 3]]`
      },
      hints: [
        { afterAttempt: 1, text: 'Use path.append(nums[index]) to add the element' },
        { afterAttempt: 2, text: 'Use result.append(path[:]) to save a COPY (not path!)' },
        { afterAttempt: 3, text: 'Don\'t forget to pop() at the end to undo the choice' }
      ],
      testCases: [
        {
          input: '[1, 2, 3]',
          expectedOutput: '[[1], [1, 2], [1, 2, 3]]',
          description: 'Incrementally build [1], then [1,2], then [1,2,3]'
        },
        {
          input: '[5, 10]',
          expectedOutput: '[[5], [5, 10]]',
          description: 'Two elements: [5] then [5, 10]'
        }
      ],
      solutionExplanation: `## 🔴 Brute Force Approach: Manual Loop Construction

Build each snapshot manually with nested loops:

\`\`\`python
def grow_list_iterative(nums: list[int]) -> list[list[int]]:
    result = []
    for i in range(len(nums)):
        snapshot = []
        for j in range(i + 1):
            snapshot.append(nums[j])
        result.append(snapshot)
    return result

# grow_list_iterative([1,2,3]) → [[1], [1,2], [1,2,3]]
\`\`\`

**Time Complexity:** O(n²) - nested loops
**Space Complexity:** O(n²) - storing all snapshots

## 🟡 Bottleneck Analysis

Issues with this approach:
- ❌ Nested loops create O(n²) operations
- ❌ Doesn't teach the backtracking pattern
- ❌ No practice with state management (append/pop)
- ❌ Misses the tree visualization entirely

**The key insight:** This is really about exploring a tree where each level adds one element!

## 🟢 Optimal Approach: Recursive Backtracking Pattern

Use the make → recurse → undo pattern:

\`\`\`python
def grow_list(nums: list[int]) -> list[list[int]]:
    result = []
    path = []

    def helper(index: int):
        if index == len(nums):
            return

        # MAKE: Add element
        path.append(nums[index])

        # SAVE: Copy current state (CRITICAL!)
        result.append(path[:])

        # RECURSE: Process next element
        helper(index + 1)

        # UNDO: Remove element (backtrack)
        path.pop()

    helper(0)
    return result
\`\`\`

**Why this is better:**
✅ O(n) time - single path through tree
✅ Demonstrates the backtracking pattern
✅ Practices critical copy operation (path[:])
✅ Shows make → recurse → undo structure

## ✅ Final Complexity

**Time:** O(n) - visits each element once
**Space:** O(n) - call stack depth + path storage

## 🎯 Pattern Learned

**Recursion Tree Structure:**
\`\`\`
        [] (start)
         ↓
    [1] (append 1, save)
         ↓
  [1,2] (append 2, save)
         ↓
[1,2,3] (append 3, save)
         ↓
  [1,2] (pop 3)
         ↓
    [1] (pop 2)
         ↓
     [] (pop 1)
\`\`\`

**Critical Pattern: The Copy Operation**
- \`result.append(path)\` → Saves REFERENCE (all become [1,2,3])
- \`result.append(path[:])\` → Saves COPY (preserves snapshots)

**This is THE MOST COMMON backtracking bug!**

**Key Skills Gained:**
1. **Make-Recurse-Undo** pattern (foundation of backtracking)
2. **Copying vs referencing** mutable objects
3. **State restoration** through pop operations
4. Understanding how path builds and unwinds through recursion`,
      complexityQuizPlacement: 'after',
      difficulty: 'medium',
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-enter-exit-trace',
      title: 'Enter/Exit Trace - Understanding Call Stack',
      description: 'Visualize how the call stack builds up and unwinds',
      targetComplexity: { time: 'O(n)', space: 'O(1)' },
      requiredForProgress: true,
      instruction: `# Enter/Exit Trace - Understanding Call Stack

## The Problem

Implement \`trace(n)\` that prints when **entering** and **exiting** each recursive call.

This helps you visualize how the **call stack** builds up and unwinds!

## Expected Output

\`\`\`python
trace(2)

# Output:
enter 2
enter 1
enter 0
exit 0
exit 1
exit 2
\`\`\`

Notice the pattern:
1. **Going down:** enter 2 → enter 1 → enter 0 (building the stack)
2. **Coming back:** exit 0 → exit 1 → exit 2 (unwinding the stack)

## The Call Stack Visualization

\`\`\`
trace(2)                  ← Call 1
  print "enter 2"
  trace(1)                ← Call 2 (nested inside Call 1)
    print "enter 1"
    trace(0)              ← Call 3 (nested inside Call 2)
      print "enter 0"
      [BASE CASE]
      print "exit 0"
    [returns to Call 2]
    print "exit 1"
  [returns to Call 1]
  print "exit 2"
[returns to caller]
\`\`\`

## Your Task

Implement \`trace(n)\` that:
1. Prints \`"enter {n}"\` when the function starts
2. Base case: when n == 0, just print enter/exit (don't recurse further)
3. Recursive case: calls trace(n-1)
4. Prints \`"exit {n}"\` after the recursive call returns

## Why This Matters

This is **exactly how backtracking works**:
- **Enter** = explore a branch
- **Recursive call** = go deeper
- **Exit** = backtrack up

Understanding this now will make backtracking click! 🎯

## Function Template

\`\`\`python
def trace(n: int):
    # TODO: Print f"enter {n}"

    # TODO: Base case - if n == 0, print exit and return

    # TODO: Recursive case - trace(n - 1)

    # TODO: Print f"exit {n}"

# Test
trace(2)
\`\`\``,
      starterCode: `def trace(n: int):
    pass

# Test
trace(2)`,
      solution: {
        afterAttempt: 3,
        text: `def trace(n: int):
    print(f"enter {n}")

    if n == 0:
        print(f"exit {n}")
        return

    trace(n - 1)

    print(f"exit {n}")

# Test
trace(2)
# Output:
# enter 2
# enter 1
# enter 0
# exit 0
# exit 1
# exit 2`
      },
      hints: [
        { afterAttempt: 1, text: 'Print "enter" before doing anything else' },
        { afterAttempt: 2, text: 'If n == 0, print "exit" and return (don\'t recurse)' },
        { afterAttempt: 3, text: 'Print "exit" AFTER the recursive call returns' }
      ],
      testCases: [
        {
          input: '2',
          expectedOutput: 'enter 2\nenter 1\nenter 0\nexit 0\nexit 1\nexit 2',
          description: 'Trace showing call stack building and unwinding'
        }
      ],
      solutionExplanation: `## 🔴 Brute Force Approach: Manual Tracing

Print enter/exit messages manually for each level:

\`\`\`python
def trace_manual(n: int):
    if n == 0:
        print("enter 0")
        print("exit 0")
    elif n == 1:
        print("enter 1")
        print("enter 0")
        print("exit 0")
        print("exit 1")
    elif n == 2:
        print("enter 2")
        print("enter 1")
        print("enter 0")
        print("exit 0")
        print("exit 1")
        print("exit 2")
    # ... needs a case for every n!
\`\`\`

**Time Complexity:** O(n) - prints 2n messages
**Space Complexity:** O(1) - no stack needed
**Problem:** Doesn't scale! Need code for every possible n value!

## 🟡 Bottleneck Analysis

Major issues:
- ❌ Can't handle arbitrary n values
- ❌ Code duplication nightmare
- ❌ Doesn't demonstrate call stack behavior
- ❌ Misses the recursive structure entirely

**The key insight:** The call stack itself manages the enter/exit pattern!

## 🟢 Optimal Approach: Leverage Call Stack

Let recursion handle the stack automatically:

\`\`\`python
def trace(n: int):
    # Enter: happens on the way DOWN the stack
    print(f"enter {n}")

    # Base case: stop recursion
    if n == 0:
        print(f"exit {n}")
        return

    # Recursive call: goes deeper
    trace(n - 1)

    # Exit: happens on the way UP the stack
    print(f"exit {n}")
\`\`\`

**Why this is better:**
✅ Works for any n value
✅ Only 7 lines of code
✅ Demonstrates call stack build-up and unwinding
✅ Shows pre-order (enter) and post-order (exit) positions

## ✅ Final Complexity

**Time:** O(n) - makes n+1 recursive calls
**Space:** O(n) - call stack depth of n+1

## 🎯 Pattern Learned

**Call Stack Visualization:**
\`\`\`
trace(2)            ← "enter 2" printed
    ↓
  trace(1)          ← "enter 1" printed
      ↓
    trace(0)        ← "enter 0" printed, then "exit 0"
      ↑
  trace(1)          ← "exit 1" printed (unwinding)
    ↑
trace(2)            ← "exit 2" printed (unwinding)
\`\`\`

**Output Flow:**
\`\`\`
Going DOWN (building stack):  enter 2, enter 1, enter 0
Hitting base case:            exit 0
Coming UP (unwinding):        exit 1, exit 2
\`\`\`

**Critical Concept: Pre-order vs Post-order**
- **Pre-order (before recursion):** Print "enter" → work happens going DOWN
- **Post-order (after recursion):** Print "exit" → work happens coming UP

**This pattern maps to:**
- Pre-order tree traversal
- Backtracking "explore" phase (going down)
- Backtracking "undo" phase (coming up)

**Key Skills Gained:**
1. Understanding call stack as a tree structure
2. Pre-order vs post-order execution
3. How recursive calls build and unwind
4. Foundation for tree traversal algorithms`,
      complexityQuizPlacement: 'after',
      difficulty: 'medium',
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-push-pop-trace',
      title: 'Make → Undo Pattern',
      description: 'Practice the core backtracking pattern: make choice, recurse, undo',
      targetComplexity: { time: 'O(2^n)', space: 'O(n)' },
      requiredForProgress: true,
      instruction: `# Make → Undo Pattern

## The Problem

Implement \`push_pop_trace(n, path)\` that:
1. **Appends** n to path (make choice)
2. **Recurses** with n-1
3. **Pops** from path (undo choice)
4. **Prints** path at each step to see state restoration

This is the **CORE PATTERN** for backtracking!

## Expected Output

\`\`\`python
push_pop_trace(2, [])

# Output:
enter 2 [2]
enter 1 [2, 1]
leaf [2, 1]
exit 1 [2]
exit 2 []
\`\`\`

Notice how path is **restored** after each call returns!

## The Pattern

\`\`\`
Start: path = []

Call push_pop_trace(2, []):
  path.append(2) → path = [2]
  print "enter 2 [2]"

  Call push_pop_trace(1, [2]):
    path.append(1) → path = [2, 1]
    print "enter 1 [2, 1]"
    print "leaf [2, 1]"  (base case)
    path.pop() → path = [2]  ← UNDO!
    print "exit 1 [2]"

  path.pop() → path = []  ← UNDO!
  print "exit 2 []"

End: path = []  ← Fully restored!
\`\`\`

## Why This Matters

This is **backtracking**:
- **Make** a choice (append)
- **Explore** with that choice (recurse)
- **Undo** the choice (pop) to try other options

The path returns to its original state after exploring!

## Your Task

Implement the function following this pattern:
1. Append n to path
2. Print \`f"enter {n} {path}"\`
3. Base case: if n == 1, print \`f"leaf {path}"\` and exit
4. Recursive case: call push_pop_trace(n-1, path)
5. Pop from path (undo)
6. Print \`f"exit {n} {path}"\`

## Function Template

\`\`\`python
def push_pop_trace(n: int, path: list[int]):
    # TODO: Make choice - path.append(n)
    # TODO: Print f"enter {n} {path}"

    # TODO: Base case - if n == 1, print leaf and return

    # TODO: Recursive case - push_pop_trace(n - 1, path)

    # TODO: Undo choice - path.pop()
    # TODO: Print f"exit {n} {path}"

# Test
push_pop_trace(2, [])
\`\`\`

Watch how the path builds up and then unwinds! 🎯`,
      starterCode: `def push_pop_trace(n: int, path: list[int]):
    pass`,
      solution: {
        afterAttempt: 3,
        text: `def push_pop_trace(n: int, path: list[int]):
    # Make choice
    path.append(n)
    print(f"enter {n} {path}")

    # Base case or Recursive step
    if n == 1:
        print(f"leaf {path}")
    else:
        # Recursive case
        push_pop_trace(n - 1, path)

    # Undo choice (backtrack)
    path.pop()
    print(f"exit {n} {path}")`
      },
      hints: [
        { afterAttempt: 1, text: 'Append BEFORE printing (so print shows the updated path)' },
        { afterAttempt: 2, text: 'For base case (n==1), print "leaf"; for others, recurse' },
        { afterAttempt: 3, text: 'Pop and print "exit" at the very end (for both base and recursive cases)' }
      ],
      testCases: [
        {
          input: '2, []',
          expectedOutput: 'enter 2 [2]\nenter 1 [2, 1]\nleaf [2, 1]\nexit 1 [2]\nexit 2 []',
          description: 'Shows make→recurse→undo pattern'
        },
        {
          input: '3, []',
          expectedOutput: 'enter 3 [3]\nenter 2 [3, 2]\nenter 1 [3, 2, 1]\nleaf [3, 2, 1]\nexit 1 [3, 2]\nexit 2 [3]\nexit 3 []',
          description: 'Verify depth 3 trace'
        }
      ],
      solutionExplanation: `## 🔴 Brute Force Approach: Manual State Management

Track state changes manually without recursion:

\`\`\`python
def push_pop_manual(n: int):
    path = []

    # Manually handle each level
    for i in range(n, 0, -1):
        path.append(i)
        print(f"enter {i} {path}")

    print(f"leaf {path}")

    # Manually undo
    for i in range(1, n + 1):
        path.pop()
        print(f"exit {i} {path}")

# Works but hardcoded for specific pattern
\`\`\`

**Time Complexity:** O(n) - two loops
**Space Complexity:** O(n) - path storage
**Problem:** Not generalizable to branching recursion!

## 🟡 Bottleneck Analysis

Critical limitations:
- ❌ Only works for linear paths, not trees
- ❌ Can't handle multiple choices/branches
- ❌ Doesn't demonstrate backtracking restoration
- ❌ Manual undo logic is error-prone

**The key insight:** Recursion + append/pop automatically restores state!

## 🟢 Optimal Approach: Recursive Backtracking

Use recursion to handle state automatically:

\`\`\`python
def push_pop_trace(n: int, path: list[int]):
    # MAKE choice
    path.append(n)
    print(f"enter {n} {path}")

    # Base case: reached leaf
    if n == 1:
        print(f"leaf {path}")
    else:
        # RECURSE: explore deeper
        push_pop_trace(n - 1, path)

    # UNDO choice (backtrack) - happens for ALL nodes!
    path.pop()
    print(f"exit {n} {path}")
\`\`\`

**Why this is better:**
✅ State restoration is automatic through pop
✅ Generalizes to branching recursion (multiple choices)
✅ Each recursive call manages its own undo
✅ Shows the core backtracking pattern clearly

## ✅ Final Complexity

**Time:** O(n) - single path of n recursive calls
**Space:** O(n) - call stack depth + path size

## 🎯 Pattern Learned

**The Make-Recurse-Undo Pattern:**
\`\`\`
          [] (start)
           ↓
    MAKE: append 2
         [2] "enter 2 [2]"
           ↓
    RECURSE: push_pop_trace(1, [2])
         [2,1] "enter 1 [2,1]"
           ↓
    BASE: "leaf [2,1]"
           ↓
    UNDO: pop → [2]
           ↓
         [2] "exit 1 [2]"
           ↓
    UNDO: pop → []
           ↓
         [] "exit 2 []"
\`\`\`

**State Restoration Through Recursion:**
Each level manages its own cleanup:
\`\`\`
push_pop_trace(2, []):
    path.append(2) → [2]
    push_pop_trace(1, [2]):
        path.append(1) → [2,1]
        [base case]
        path.pop() → [2]  ← Restores to parent's state
    path.pop() → []  ← Restores to original state
\`\`\`

**This is THE CORE pattern for:**
- Backtracking problems (subsets, permutations)
- Tree exploration (DFS)
- State space search (N-Queens, Sudoku)

**Key Skills Gained:**
1. **Make-Recurse-Undo** is backtracking's DNA
2. How pop() undoes append() to restore state
3. Each recursion level has its own "undo" point
4. Path automatically returns to parent's state on return
5. Foundation for ALL backtracking algorithms`,
      complexityQuizPlacement: 'after',
      difficulty: 'medium',
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-fibonacci',
      title: 'Fibonacci - See the Branching Tree',
      description: 'Implement Fibonacci and observe the branching recursion tree',
      targetComplexity: { time: 'O(n)', space: 'O(n)' },
      requiredForProgress: true,
      instruction: `# Fibonacci - See the Branching Tree

## The Problem

The **Fibonacci sequence** is:
\`\`\`
fib(0) = 0
fib(1) = 1
fib(n) = fib(n-1) + fib(n-2)

Sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, ...
\`\`\`

## The Recursive Definition

Each Fibonacci number is the **sum of the previous two**:
\`\`\`
fib(5) = fib(4) + fib(3)
fib(4) = fib(3) + fib(2)
fib(3) = fib(2) + fib(1)
...
\`\`\`

## The Tree for fib(5)

\`\`\`
                      fib(5)
                    /        \\
              fib(4)          fib(3)
             /      \\         /      \\
        fib(3)    fib(2)  fib(2)    fib(1)
       /    \\     /   \\    /   \\
   fib(2) fib(1) f(1) f(0) f(1) f(0)
   /   \\
fib(1) fib(0)
\`\`\`

**Notice:** This tree has **BRANCHING** (each node has 2 children)!

## Key Observation: Repeated Work! 🔍

Look closely at the tree:
- **fib(3)** computed **2 times**
- **fib(2)** computed **3 times**
- **fib(1)** computed **5 times**

We're doing the **same work** multiple times! This is wasteful.

**Foreshadowing:** In Module 11 (Dynamic Programming), we'll fix this with **memoization**!

## Your Task

Implement \`fib(n)\` recursively (the naive way).

### Steps:
1. **Two base cases:**
   - fib(0) = 0
   - fib(1) = 1
2. **Recursive case:** fib(n-1) + fib(n-2)

## Time Complexity

This solution is **O(2ⁿ)** - exponential! 💥

Why? Each call spawns 2 more calls, which spawn 2 more each, etc.

The tree has approximately 2ⁿ nodes.

Try running fib(30) - it'll take a while! (Don't try fib(50), you'll wait forever)

## Function Template

\`\`\`python
def fib(n: int) -> int:
    # TODO: Base case 1 - if n == 0, return 0
    # TODO: Base case 2 - if n == 1, return 1

    # TODO: Recursive case - return fib(n-1) + fib(n-2)
    pass

# Test
print(fib(5))   # Should print 5
print(fib(10))  # Should print 55
\`\`\`

After implementing it, draw the tree for fib(4) on paper! 🎨`,
      starterCode: `def fib(n: int) -> int:
    pass

# Test
print(fib(5))   # Should print 5
print(fib(10))  # Should print 55`,
      solution: {
        afterAttempt: 3,
        text: `def fib(n: int) -> int:
    # Base cases
    if n == 0:
        return 0
    if n == 1:
        return 1

    # Recursive case: sum of previous two
    return fib(n - 1) + fib(n - 2)

# Test
print(fib(5))   # 5
print(fib(10))  # 55

# Try drawing the tree for fib(4)!`
      },
      hints: [
        { afterAttempt: 1, text: 'Two base cases: fib(0)=0 and fib(1)=1' },
        { afterAttempt: 2, text: 'Recursive case makes TWO calls: fib(n-1) and fib(n-2)' },
        { afterAttempt: 3, text: 'Add the results together and return' }
      ],
      testCases: [
        {
          input: '5',
          expectedOutput: '5',
          description: 'fib(5) = 5'
        },
        {
          input: '10',
          expectedOutput: '55',
          description: 'fib(10) = 55'
        },
        {
          input: '0',
          expectedOutput: '0',
          description: 'Base case: fib(0) = 0'
        },
        {
          input: '1',
          expectedOutput: '1',
          description: 'Base case: fib(1) = 1'
        }
      ],
      solutionExplanation: `## 🔴 Brute Force Approach: Naive Recursion

The most natural recursive implementation:

\`\`\`python
def fib(n: int) -> int:
    # Base cases
    if n == 0:
        return 0
    if n == 1:
        return 1

    # Recursive case: sum of previous two
    return fib(n - 1) + fib(n - 2)
\`\`\`

**Time Complexity:** O(2ⁿ) - exponential explosion!
**Space Complexity:** O(n) - maximum call stack depth

## 🟡 Bottleneck Analysis

This approach has **massive repeated computation**:

**Recursion tree for fib(5):**
\`\`\`
                    fib(5)
                   /      \\
              fib(4)      fib(3)
             /      \\     /      \\
        fib(3)   fib(2) fib(2)  fib(1)
        /    \\   /   \\  /   \\
    fib(2) fib(1) ...
\`\`\`

**Repeated computations:**
- fib(3): computed **2 times**
- fib(2): computed **3 times**
- fib(1): computed **5 times**
- fib(0): computed **3 times**

❌ **Total function calls for fib(10): ~177 calls**
❌ **Total function calls for fib(20): ~21,891 calls**
❌ **Total function calls for fib(30): ~2,692,537 calls** 💥

The tree has ~2ⁿ nodes because each call branches into 2 more!

## 🟢 Optimal Approach: Memoization (DP Preview)

Cache results to avoid recomputation:

\`\`\`python
def fib_memo(n: int, memo=None) -> int:
    if memo is None:
        memo = {}

    # Check cache first
    if n in memo:
        return memo[n]

    # Base cases
    if n <= 1:
        return n

    # Compute and cache
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]
\`\`\`

**Why this is better:**
✅ Each fib(k) computed only ONCE
✅ O(n) time instead of O(2ⁿ)
✅ Transforms exponential → linear!

**Alternative: Bottom-up DP:**
\`\`\`python
def fib_dp(n: int) -> int:
    if n <= 1:
        return n

    dp = [0] * (n + 1)
    dp[1] = 1

    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]

    return dp[n]
\`\`\`

## ✅ Final Complexity

**Naive Recursion:**
- Time: O(2ⁿ) - exponential
- Space: O(n) - call stack depth

**Memoization:**
- Time: O(n) - each value computed once
- Space: O(n) - memo cache + call stack

**Bottom-up DP:**
- Time: O(n) - single loop
- Space: O(n) - dp array (can optimize to O(1))

## 🎯 Pattern Learned

**Branching Recursion Creates Exponential Trees:**
\`\`\`
Branching factor = 2 → O(2ⁿ) nodes
Branching factor = 3 → O(3ⁿ) nodes
Branching factor = k → O(kⁿ) nodes
\`\`\`

**Identifying DP Opportunities:**
1. Draw the recursion tree
2. Look for repeated nodes (same parameters)
3. If you see duplicates → memoization will help!

**Comparison:**
\`\`\`
fib(10) naive:        177 calls
fib(10) memoized:      19 calls (10 unique values + overhead)

fib(30) naive:   2,692,537 calls
fib(30) memoized:      59 calls
\`\`\`

**Key Pattern Recognition:**
- **Linear recursion** (factorial): O(n) tree → no memoization needed
- **Branching recursion** (fibonacci): O(2ⁿ) tree → memoization is critical!

**This is your introduction to Dynamic Programming!**
- Module 11 will formalize this pattern
- You'll learn when and how to apply memoization
- Transform exponential algorithms into polynomial ones

**Key Skills Gained:**
1. Recognizing exponential time complexity from branching
2. Visualizing repeated subproblems in recursion trees
3. Understanding the power of caching results
4. Foundation for Dynamic Programming optimization`,
      complexityQuizPlacement: 'after',
      difficulty: 'medium',
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-collect-pre',
      title: 'Collect Results Practice',
      description: 'Practice collecting results at each step (pre-order)',
      targetComplexity: { time: 'O(n)', space: 'O(1)' },
      requiredForProgress: true,
      instruction: `# Collect Results Practice - Pre-Order

## The Problem

Implement \`collect_pre(n)\` that generates all binary strings of length **up to n** over the alphabet \`{'A', 'B'}\`.

**Key:** Collect at **each step** (pre-order), not just at leaves!

## Example

\`\`\`python
collect_pre(2)
# → ['', 'A', 'AA', 'AB', 'B', 'BA', 'BB']
\`\`\`

Notice it includes:
- Empty string: \`''\`
- Length 1: \`'A'\`, \`'B'\`
- Length 2: \`'AA'\`, \`'AB'\`, \`'BA'\`, \`'BB'\`

## The Tree

\`\`\`
                ''        ← Save!
              /    \\
           'A'      'B'    ← Save both!
          /   \\    /   \\
       'AA'  'AB' 'BA' 'BB' ← Save all!
\`\`\`

We save at **every node**, not just leaves!

## Your Task

Implement the function using:
1. A helper function \`dfs(prefix)\`
2. **Save the prefix at the start** (pre-order)
3. Base case: if len(prefix) == n, stop
4. Recursive case: try appending 'A' and 'B'

## Pattern

\`\`\`python
def dfs(prefix):
    result.append(prefix)  # ← SAVE AT EACH STEP (pre-order)

    if len(prefix) == n:   # Base case
        return

    dfs(prefix + 'A')      # Try 'A'
    dfs(prefix + 'B')      # Try 'B'
\`\`\`

## Function Template

\`\`\`python
def collect_pre(n: int) -> list[str]:
    result = []

    def dfs(prefix: str):
        # TODO: Append prefix to result (save at each step!)

        # TODO: Base case - if len(prefix) == n, return

        # TODO: Recurse with prefix + 'A'
        # TODO: Recurse with prefix + 'B'

    dfs('')  # Start with empty string
    return result

# Test
print(collect_pre(2))
# Expected: ['', 'A', 'AA', 'AB', 'B', 'BA', 'BB']
\`\`\`

## Key Insight

Because we save **at every step** (pre-order), we get:
- Partial strings ('A', 'B')
- Complete strings ('AA', 'AB', etc.)
- Empty string ('')

This is different from saving **only at leaves** (post-order), which would give only complete strings!

Try it! 🚀`,
      starterCode: `def collect_pre(n: int) -> list[str]:
    result = []

    def dfs(prefix: str):
        pass

    dfs('')
    return result

# Test
print(collect_pre(2))
# Expected: ['', 'A', 'AA', 'AB', 'B', 'BA', 'BB']`,
      solution: {
        afterAttempt: 3,
        text: `def collect_pre(n: int) -> list[str]:
    result = []

    def dfs(prefix: str):
        # PRE-ORDER: Save at each step (before recursing)
        result.append(prefix)

        # Base case: reached max length
        if len(prefix) == n:
            return

        # Recurse: try both choices
        dfs(prefix + 'A')
        dfs(prefix + 'B')

    dfs('')
    return result

# Test
print(collect_pre(2))
# Output: ['', 'A', 'AA', 'AB', 'B', 'BA', 'BB']

# Note: This is DFS pre-order traversal!`
      },
      hints: [
        { afterAttempt: 1, text: 'Save the prefix BEFORE checking the base case (pre-order!)' },
        { afterAttempt: 2, text: 'Base case: if len(prefix) == n, just return (don\'t recurse further)' },
        { afterAttempt: 3, text: 'Make two recursive calls: dfs(prefix + \'A\') and dfs(prefix + \'B\')' }
      ],
      testCases: [
        {
          input: '2',
          expectedOutput: "['', 'A', 'AA', 'AB', 'B', 'BA', 'BB']",
          description: 'All binary strings up to length 2'
        },
        {
          input: '1',
          expectedOutput: "['', 'A', 'B']",
          description: 'All binary strings up to length 1'
        }
      ],
      solutionExplanation: `## 🔴 Brute Force Approach: Generate All Then Filter

Generate all possible strings, then filter by length:

\`\`\`python
def collect_all_then_filter(n: int) -> list[str]:
    result = []

    # Generate ALL possible strings (up to max possible)
    def generate_all(current, max_len):
        if len(current) > max_len:
            return

        result.append(current)

        # Try all possibilities
        for char in ['A', 'B']:
            generate_all(current + char, max_len)

    generate_all('', n)
    return result
\`\`\`

**Time Complexity:** O(2^(n+1)) - generates full tree
**Space Complexity:** O(2^(n+1)) - stores all results

**Problem:** Same complexity but conceptually messier!

## 🟡 Bottleneck Analysis

While this works, it's less clear:
- ❌ Doesn't clearly show pre-order collection pattern
- ❌ Mixing iteration with recursion is confusing
- ❌ Harder to adapt to post-order collection
- ❌ Less obvious tree structure

**The key insight:** Pre-order traversal = collect BEFORE recursing!

## 🟢 Optimal Approach: Clean DFS Pre-order

Save at each node before exploring children:

\`\`\`python
def collect_pre(n: int) -> list[str]:
    result = []

    def dfs(prefix: str):
        # PRE-ORDER: Save BEFORE recursing
        result.append(prefix)

        # Base case: don't go deeper
        if len(prefix) == n:
            return

        # Recursive case: explore both branches
        dfs(prefix + 'A')
        dfs(prefix + 'B')

    dfs('')  # Start with empty string
    return result
\`\`\`

**Why this is better:**
✅ Crystal clear pre-order pattern
✅ Clean separation: save → check → recurse
✅ Easy to modify for post-order (move append after recursion)
✅ Mirrors tree traversal exactly

## ✅ Final Complexity

**Time Complexity:** O(2^(n+1))
- Tree has 2^0 + 2^1 + 2^2 + ... + 2^n = 2^(n+1) - 1 nodes
- We visit each node once

**Space Complexity:** O(n)
- Call stack depth is n (height of tree)
- Result storage is O(2^(n+1)) but that's output, not auxiliary space

## 🎯 Pattern Learned

**DFS Pre-Order Tree Visualization:**
\`\`\`
                ''  ← Save '' (pre-order)
              /    \\
           'A'      'B'  ← Save both (pre-order)
          /   \\    /   \\
       'AA'  'AB' 'BA' 'BB'  ← Save all (pre-order)
\`\`\`

**Execution Order (DFS Pre-order):**
\`\`\`
1. Save ''
2. Save 'A' (go left from '')
3. Save 'AA' (go left from 'A')
4. Return to 'A'
5. Save 'AB' (go right from 'A')
6. Return to ''
7. Save 'B' (go right from '')
8. Save 'BA' (go left from 'B')
9. Return to 'B'
10. Save 'BB' (go right from 'B')
\`\`\`

**Pre-order vs Post-order Collection:**

**Pre-order (current solution):**
\`\`\`python
def dfs(prefix):
    result.append(prefix)  # ← SAVE FIRST
    if len(prefix) == n:
        return
    dfs(prefix + 'A')
    dfs(prefix + 'B')

# Result: ['', 'A', 'AA', 'AB', 'B', 'BA', 'BB']
# Includes partial strings!
\`\`\`

**Post-order (saves only complete solutions):**
\`\`\`python
def dfs(prefix):
    if len(prefix) == n:
        result.append(prefix)  # ← SAVE AT LEAVES
        return
    dfs(prefix + 'A')
    dfs(prefix + 'B')

# Result: ['AA', 'AB', 'BA', 'BB']
# Only complete strings of length n!
\`\`\`

**When to Use Each:**
- **Pre-order:** All subsets, all prefixes, all partial solutions
- **Post-order:** Only complete solutions, permutations, combinations

**Branching Factor Impact:**
\`\`\`
Alphabet size = 2 → Binary tree → O(2^n) nodes
Alphabet size = 3 → Ternary tree → O(3^n) nodes
Alphabet size = k → k-ary tree → O(k^n) nodes
\`\`\`

**This pattern appears in:**
- Generating all subsets (include/exclude = 2 branches)
- Phone number letter combinations
- Password generation
- Backtracking exploration (Module 10)

**Key Skills Gained:**
1. **Pre-order traversal** = process before children
2. **DFS pattern** for tree exploration
3. How collection point (pre vs post) affects results
4. Exponential growth with branching factor
5. Foundation for backtracking algorithms (Module 10)`,
      complexityQuizPlacement: 'after',
      difficulty: 'medium',
    }
];
