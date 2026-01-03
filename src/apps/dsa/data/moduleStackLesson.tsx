import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { moduleStackLessonSmartPracticeExercises } from './exercises/moduleStackLessonSmartPracticeExercises';

export const moduleStackLesson: ProgressiveLesson = {
  id: 'stack-discovery-lifo',
  title: 'Module: Stack Discovery (LIFO In Action)',
  description: 'Learn the stack mindset, interactive push/pop intuition, the three core templates, and how monotonic stacks unlock next greater/smaller style problems.',
  unlockMode: 'flexible',
  sections: [
    {
      type: 'reading',
      id: 'stack-lifo-principle',
      title: 'Section 1 · The LIFO Principle',
      estimatedReadTime: 420,
      content: `<h1>The LIFO Mental Model</h1>
<p>A <strong>stack</strong> follows the <strong>Last-In-First-Out (LIFO)</strong> rule: the last element you add is the first one you remove. Visualise a pancake stack:</p>
<ul>
<li>Pancake 1 sits at the bottom, then 2, then 3, etc.</li>
<li>When you add Pancake 4, it <em>must</em> go on top.</li>
<li>When you remove a pancake, you only reach the top-most one.</li>
</ul>
<p>That simple rule gives us predictable, O(1) operations:</p>
<table>
<thead>
<tr>
<th>Operation</th>
<th>Description</th>
<th>Complexity</th>
</tr>
</thead>
<tbody><tr>
<td><code>push(x)</code></td>
<td>Place <code>x</code> on top of the stack</td>
<td>O(1)</td>
</tr>
<tr>
<td><code>pop()</code></td>
<td>Remove and return the element at the top</td>
<td>O(1)</td>
</tr>
<tr>
<td><code>peek()</code> / <code>top()</code></td>
<td>Inspect the top without removing it</td>
<td>O(1)</td>
</tr>
<tr>
<td><code>is_empty()</code></td>
<td>Check whether the stack contains anything</td>
<td>O(1)</td>
</tr>
</tbody></table>
<p>Why constant time? Because every operation touches <strong>one end only</strong>. Array-backed stacks move a pointer. Linked-list stacks move the head. No traversal is needed.</p>
<h2>Interview Cues That Screams “Use a Stack”</h2>
<ul>
<li>“Track the most recent item”, “undo the previous action”, “browser back button”</li>
<li>“Match parentheses/brackets/tags”</li>
<li>“Nested structure”</li>
<li>“Process items in reverse order”</li>
</ul>
<p>Whenever you hear “the last thing I touched is the first thing I need now”, reach for a stack.</p>
`,
    },
    {
      type: 'reading',
      id: 'stack-manual-simulator',
      title: 'Section 2 · Build A Stack (Manual Simulation)',
      estimatedReadTime: 360,
      content: `<h1>Practice Push/Pop Without Code</h1>
<p>Try this pen-and-paper simulation to internalise how the stack evolves:</p>
<ol>
<li>Start with stack <code>[1, 2, 3]</code> (1 at the bottom, 3 at the top).</li>
<li>Push 4 → stack becomes <code>[1, 2, 3, 4]</code>. Note that only the top changes.</li>
<li>Push 9 → stack becomes <code>[1, 2, 3, 4, 9]</code>.</li>
<li>Pop → remove the last pushed value. Stack goes back to <code>[1, 2, 3, 4]</code>.</li>
<li>Peek → return 4, but do <strong>not</strong> remove it.</li>
</ol>
<p>Track three values as you simulate:</p>
<ul>
<li><strong>Size</strong>: length of the stack</li>
<li><strong>Top Element</strong>: <code>stack[-1]</code> when non-empty (otherwise “Empty”)</li>
<li><strong>Is Empty?</strong>: <code>len(stack) == 0</code></li>
</ul>
<h3>Observation</h3>
<p>The stack only ever grows or shrinks at the top. Every other element maintains its relative order. That invariant is why stacks are perfect for DFS, backtracking, undo/redo, and expression parsing.</p>
`,
    },
    {
      type: 'reading',
      id: 'stack-patterns',
      title: 'Section 3 · The Three Core Stack Templates',
      estimatedReadTime: 540,
      content: `<h1>Stack Patterns &amp; Templates</h1>
<h2>1. Matching Pairs (Parentheses)</h2>
<p>Use a stack to track the most recent unmatched opening symbol.</p>
<pre><code class="language-python">stack = []
for char in s:
    if char in &#39;([{&#39;:
        stack.append(char)
    elif stack and matches(stack[-1], char):
        stack.pop()
    else:
        return False
return len(stack) == 0
</code></pre>
<p>Use it for valid-parentheses, HTML tag validation, or any “balanced string” problem.</p>
<h2>2. Expression Evaluation</h2>
<p>Stacks act as mini interpreters. Push operands, pop two when you see an operator, evaluate, and push the result back.</p>
<pre><code class="language-python">stack = []
for token in tokens:
    if token.isdigit():
        stack.append(int(token))
    else:
        b = stack.pop()
        a = stack.pop()
        stack.append(apply(a, token, b))
return stack[-1]
</code></pre>
<h2>3. Monotonic Stack (Template Preview)</h2>
<p>Maintain a stack in either increasing or decreasing order. When the current value breaks the order, pop until the invariant holds—those pops identify next greater/smaller answers.</p>
<pre><code class="language-python">stack = []
for i, num in enumerate(nums):
    while stack and nums[stack[-1]] &lt; num:
        idx = stack.pop()
        result[idx] = num  # next greater located!
    stack.append(i)
</code></pre>
<p>You will meet this in stock span, largest rectangle in histogram, rain water trapping, temperature spikes, etc.</p>
`,
    },
    {
      type: 'reading',
      id: 'monotonic-stack',
      title: 'Section 4 · Deep Dive: Monotonic Stack',
      estimatedReadTime: 420,
      content: `<h1>Monotonic Stack Deep Dive</h1>
<p>Problem: “For each element in <code>[2, 1, 2, 4, 3]</code>, find the next greater element to the right.”</p>
<p>Results: <code>[4, 2, 4, -, -]</code> where “-” means none exists.</p>
<h2>Algorithm</h2>
<ol>
<li>Maintain a <strong>decreasing</strong> stack of indices (values strictly decrease from bottom → top).</li>
<li>When you see a new value that is larger than the top, that new value is the “next greater” for all smaller values in the stack.</li>
<li>Pop until the stack holds the invariant again, recording answers as you go.</li>
<li>Push the current index.</li>
</ol>
<p>Swap the comparison to build an <strong>increasing</strong> stack for “next smaller” style questions.</p>
<h3>Why O(n)?</h3>
<p>Each index enters the stack once and leaves once. Push + pop happens at most twice per element → O(2n) = O(n) time, O(n) space for the stack and answers.</p>
<p>Monotonic stacks feel magical because they collapse nested for-loops into a single pass. Mastering them unlocks hard problems like “Daily Temperatures”, “Stock Span”, and “Largest Rectangle in Histogram”.</p>
`,
    },
    {
      type: 'reading',
      id: 'stack-real-world',
      title: 'Section 5 · Real-World Applications & Mindset',
      estimatedReadTime: 300,
      content: `<h1>Where Stacks Show Up In The Real World</h1>
<ul>
<li><strong>Undo / Redo</strong>: store prior states in an undo stack, move popped states to a redo stack.</li>
<li><strong>Browser History</strong>: back stack for visited pages, forward stack for undone navigation.</li>
<li><strong>Function Call Stack</strong>: languages push stack frames as functions call other functions.</li>
<li><strong>Expression Parsing</strong>: compilers and calculators rely on stack-based evaluation.</li>
<li><strong>Syntax Checking</strong>: IDEs ensure parentheses/tags open and close correctly.</li>
<li><strong>Game State Rewinds</strong>: games push snapshots so they can rewind actions.</li>
</ul>
<h3>The Stack Mindset</h3>
<p>Ask yourself:</p>
<ul>
<li>“Do I need to reverse the latest actions?”</li>
<li>“Are there nested structures whose scopes must be tracked?”</li>
<li>“Do I only care about the most recent candidate?”</li>
</ul>
<p>If the answer is "yes", your brain should automatically highlight the stack pattern.</p>
`,
    },
    {
      type: 'reading',
      id: 'transactional-stack',
      title: 'Section 6 · Transactional Stack (Rollback Pattern)',
      estimatedReadTime: 420,
      content: `<h1>Transactional Stack: Implementing Rollback</h1>

<p>A common OOD interview question: <strong>"How do you implement rollback/undo for a key-value store?"</strong></p>

<p>The naive approach of overwriting data immediately makes rollback impossible. The solution: <strong>use a stack of HashMaps</strong>.</p>

<h2>The Pattern</h2>
<p>Think of each "transaction" as a layer. When you begin a transaction, you push a new empty layer. All writes go to the top layer. To rollback, just pop the layer.</p>

<pre><code class="language-python">class TransactionalKV:
    def __init__(self):
        self.stack = [{}]  # Start with one base layer

    def begin(self):
        """Start a new transaction."""
        self.stack.append({})  # Push empty layer

    def put(self, key, value):
        """Write to current transaction."""
        self.stack[-1][key] = value  # Write to top layer

    def get(self, key):
        """Read by checking layers top-down."""
        for layer in reversed(self.stack):
            if key in layer:
                return layer[key]
        return None  # Key not found

    def rollback(self):
        """Discard current transaction."""
        if len(self.stack) &gt; 1:
            self.stack.pop()  # Remove top layer

    def commit(self):
        """Merge current transaction into parent."""
        if len(self.stack) &gt; 1:
            top = self.stack.pop()
            self.stack[-1].update(top)  # Merge into parent
</code></pre>

<h2>Example Walkthrough</h2>
<pre><code class="language-python">kv = TransactionalKV()
kv.put("a", 1)           # stack = [{"a": 1}]
kv.begin()               # stack = [{"a": 1}, {}]
kv.put("a", 2)           # stack = [{"a": 1}, {"a": 2}]
print(kv.get("a"))       # 2 (from top layer)
kv.rollback()            # stack = [{"a": 1}]
print(kv.get("a"))       # 1 (original value restored!)
</code></pre>

<h2>Key Insight</h2>
<p>The stack of maps provides <strong>copy-on-write semantics</strong> without actually copying. Each layer only stores the <em>changes</em> made in that transaction, not the entire state.</p>

<h2>Variations</h2>
<ul>
<li><strong>Nested transactions</strong>: Multiple begin() calls create deeper nesting</li>
<li><strong>Delete markers</strong>: Use a sentinel value like <code>DELETED</code> to mark deletions</li>
<li><strong>Database savepoints</strong>: SQL savepoints work similarly</li>
</ul>

<h2>Interview Tip</h2>
<p>When you hear "rollback", "undo", "savepoint", or "transaction" - immediately think <strong>stack of states</strong>. Each transaction is a layer that can be popped to restore the previous state.</p>
`,
    },
    {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-transactional-stack',
      title: 'Transactional Key-Value Store',
      description: 'Implement a key-value store with transaction support',
      targetComplexity: { time: 'O(n)', space: 'O(n)' },
      instruction: `# Transactional Key-Value Store

Implement a key-value store that supports transactions with rollback.

## Requirements
Create \`TransactionalKV\` class:
- \`put(key, value)\`: Set key to value in current transaction
- \`get(key)\`: Return value for key, or None if not found
- \`begin()\`: Start a new transaction
- \`rollback()\`: Discard current transaction, restore previous state
- \`commit()\`: Merge current transaction into parent

## Example
\`\`\`python
kv = TransactionalKV()
kv.put("x", 10)
kv.begin()
kv.put("x", 20)
print(kv.get("x"))  # 20
kv.rollback()
print(kv.get("x"))  # 10 (rolled back!)
\`\`\``,
      starterCode: `class TransactionalKV:
    def __init__(self):
        pass

    def put(self, key: str, value: int) -> None:
        pass

    def get(self, key: str):
        pass

    def begin(self) -> None:
        pass

    def rollback(self) -> None:
        pass

    def commit(self) -> None:
        pass`,
      expectedOutput: ``,
      hints: [
        { afterAttempt: 1, text: 'Use a list of dicts (stack). Start with [{}]. begin() appends {}, rollback() pops.' },
        { afterAttempt: 2, text: 'For get(), iterate reversed(stack) and return the first match found.' }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution

\`\`\`python
class TransactionalKV:
    def __init__(self):
        self.stack = [{}]

    def put(self, key: str, value: int) -> None:
        self.stack[-1][key] = value

    def get(self, key: str):
        for layer in reversed(self.stack):
            if key in layer:
                return layer[key]
        return None

    def begin(self) -> None:
        self.stack.append({})

    def rollback(self) -> None:
        if len(self.stack) > 1:
            self.stack.pop()

    def commit(self) -> None:
        if len(self.stack) > 1:
            top = self.stack.pop()
            self.stack[-1].update(top)
\`\`\`

## Key Points
- Each transaction is a layer in the stack
- Writes go to the top layer only
- Reads search from top to bottom
- Rollback just pops the top layer
- Commit merges top layer into parent`
      },
      testCases: [
        { input: 'kv = TransactionalKV(); kv.put("a", 1); kv.get("a")', expected: '1' },
        { input: 'kv = TransactionalKV(); kv.put("a", 1); kv.begin(); kv.put("a", 2); kv.rollback(); kv.get("a")', expected: '1' }
      ],
    },
    ...moduleStackLessonSmartPracticeExercises,
  ],
};

