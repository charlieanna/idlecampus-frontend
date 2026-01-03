import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module4_5PythonOOPLessonSmartPracticeExercises: ExerciseSection[] = [
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-create-simple-class',
            title: 'Micro-Drill: Create a Simple Class',
            description: 'Practice creating a basic class with __init__',
            requiredForProgress: false,
            targetComplexity: { time: 'O(1)', space: 'O(1)', notes: 'Creating an object is constant time' },
            instruction: `# Create a Simple Class

Create a \\\`Person\\\` class that stores a name and age, and has a string representation.

## Requirements

1. \\\`__init__(self, name, age)\\\` - store name and age
2. \\\`__repr__(self)\\\` - return string in format: \\\`Person with name="Alice", age=25\\\`

## Examples

\\\`\\\`\\\`python
p = Person("Alice", 25)
print(p.name)  # "Alice"
print(p.age)   # 25
print(repr(p)) # Person with name="Alice", age=25
\\\`\\\`\\\``,
            starterCode: `class Person:
    def __init__(self, name, age):
        pass

    def __repr__(self):
        # Return string like: Person with name="Alice", age=25
        pass`,
            solution: {
                afterAttempt: 2,
                text: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __repr__(self):
        return f'Person with name="{self.name}", age={self.age}'`
            },
            testCases: [
                {
                    input: 'p = Person("Alice", 25); repr(p)',
                    expectedOutput: '"Person with name=\\"Alice\\", age=25"'
                }
            ],
            hints: [
                { afterAttempt: 1, text: 'Use self.name = name and self.age = age in __init__, then implement __repr__ to return the formatted string' }
            ],
            solutionExplanation: `## Solution Analysis

### 🟢 OOP Approach
\`\`\`python
class Person:
    def __init__(self, name, age):
        self.name = name  # Store as instance attribute
        self.age = age
\`\`\`

**Pure data container** - the simplest class structure:
- \`__init__\` is Python's constructor (called automatically when creating objects)
- \`self\` refers to the instance being created
- Instance attributes persist beyond constructor call

### ✅ Complexity
- **Time: O(1)** - assignment operations are constant time
- **Space: O(1)** - stores two values per object

### 🎯 OOP Concept
**"Data Container Pattern"** → Classes group related data with named attributes. Better than tuples/lists because: named access (\`p.name\`) vs indices (\`p[0]\`), type safety, extensibility, and IDE support.`,
            complexityQuizPlacement: 'after',
            difficulty: 'easy',
            timeLimit: 180,
            passingScore: 100
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-understanding-self',
            title: 'Micro-Drill: Understanding self',
            description: 'Practice using self to access instance attributes',
            requiredForProgress: false,
            targetComplexity: { time: 'O(1)', space: 'O(1)', notes: 'Attribute access is constant time' },
            instruction: `# Understanding self

Create a \`BankAccount\` class with:
- \`__init__(balance)\` to set initial balance
- \`deposit(amount)\` to add to balance
- \`get_balance()\` to return current balance

## Examples

\`\`\`python
account = BankAccount(100)
account.deposit(50)
print(account.get_balance())  # 150
\`\`\``,
            starterCode: `class BankAccount:
    def __init__(self, balance):
        pass

    def deposit(self, amount):
        pass

    def get_balance(self):
        pass`,
            solution: {
                afterAttempt: 2,
                text: `class BankAccount:
    def __init__(self, balance):
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def get_balance(self):
        return self.balance`
            },
            testCases: [
                {
                    input: 'acc = BankAccount(100); acc.deposit(50); acc.get_balance()',
                    expectedOutput: '150'
                }
            ],
            hints: [
                { afterAttempt: 1, text: 'Use self.balance to store and access the balance across methods' }
            ],
            solutionExplanation: `## Solution Analysis

### 🟢 OOP Approach
\`\`\`python
class BankAccount:
    def __init__(self, balance):
        self.balance = balance  # Shared state

    def deposit(self, amount):
        self.balance += amount  # Modify

    def get_balance(self):
        return self.balance  # Read
\`\`\`

**Multiple methods sharing state** via \`self\`:
- Constructor sets initial state
- Mutator methods modify state
- Accessor methods read state
- All access the same \`self.balance\`

### ✅ Complexity
- **Time: O(1)** - all operations are constant time
- **Space: O(1)** - stores one number

### 🎯 OOP Concept
**"Shared Instance State"** → Instance attributes (\`self.balance\`) are accessible to all methods. This bundles related state with operations, providing safer encapsulation than global variables - each object has its own state with clear ownership.`,
            complexityQuizPlacement: 'after',
            difficulty: 'easy',
            timeLimit: 240,
            passingScore: 100
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-create-listnode',
            title: 'Applied: Create ListNode Class',
            description: 'Build the foundation for linked lists',
            requiredForProgress: true,
            targetComplexity: { time: 'O(1)', space: 'O(1)', notes: 'Creating a node is constant time' },
            instruction: `# Create ListNode Class

Create a \`ListNode\` class for linked lists with:
- \`__init__(val, next=None)\` to store value and next pointer
- Default next should be None

## Examples

\`\`\`python
node1 = ListNode(1)
node2 = ListNode(2)
node1.next = node2

print(node1.val)       # 1
print(node1.next.val)  # 2
\`\`\`

## Why This Matters

This is THE class you'll use for every linked list problem in interviews!`,
            starterCode: `class ListNode:
    def __init__(self, val, next=None):
        pass

    def __repr__(self):
        # Return: ListNode with val=X, next=None
        pass`,
            solution: {
                afterAttempt: 3,
                text: `class ListNode:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next

    def __repr__(self):
        return f'ListNode with val={self.val}, next={self.next}'`
            },
            testCases: [
                {
                    input: 'n = ListNode(1); repr(n)',
                    expectedOutput: '"ListNode with val=1, next=None"'
                },
                {
                    input: 'n = ListNode(1); (n.val, n.next)',
                    expectedOutput: '(1, None)'
                }
            ],
            hints: [
                { afterAttempt: 1, text: 'Store val and next as instance attributes: self.val and self.next' },
                { afterAttempt: 2, text: 'Remember to set default value: next=None in the parameter' }
            ],
            solutionExplanation: `## Solution Analysis

### 🟢 OOP Approach
\`\`\`python
class ListNode:
    def __init__(self, val, next=None):
        self.val = val    # Node data
        self.next = next  # Reference to next node
\`\`\`

**Self-referential data structure** - nodes point to other nodes:
- \`self.val\`: Stores the node's data
- \`self.next\`: Reference to next ListNode (or None)
- Default parameter \`next=None\` makes it optional

### ✅ Complexity
- **Time: O(1)** - creating a single node is constant time
- **Space: O(1)** - stores value + one reference per node

### 🎯 OOP Concept
**"Self-Referential Class"** → A class that references instances of itself. ListNode objects point to other ListNode objects, creating chains. This pattern is fundamental for linked lists, enabling O(1) insertion/deletion. Critical for 20+ interview problems (reverse, cycle detection, merge lists).`,
            complexityQuizPlacement: 'after',
            difficulty: 'easy',
            timeLimit: 300,
            passingScore: 100
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-create-treenode',
            title: 'Applied: Create TreeNode Class',
            description: 'Build the foundation for binary trees',
            requiredForProgress: true,
            targetComplexity: { time: 'O(1)', space: 'O(1)', notes: 'Creating a node is constant time' },
            instruction: `# Create TreeNode Class

Create a \`TreeNode\` class for binary trees with:
- \`__init__(val, left=None, right=None)\` to store value and child pointers
- Defaults for left and right should be None

## Examples

\`\`\`python
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)

print(root.val)        # 1
print(root.left.val)   # 2
print(root.right.val)  # 3
\`\`\`

## Why This Matters

Every binary tree problem uses this class structure!`,
            starterCode: `class TreeNode:
    def __init__(self, val, left=None, right=None):
        pass`,
            solution: {
                afterAttempt: 3,
                text: `class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right`
            },
            testCases: [
                {
                    input: 't = TreeNode(1); (t.val, t.left, t.right)',
                    expectedOutput: '(1, None, None)'
                }
            ],
            hints: [
                { afterAttempt: 1, text: 'Store val, left, and right as instance attributes' },
                { afterAttempt: 2, text: 'Use self.val, self.left, self.right' }
            ],
            solutionExplanation: `## Solution Analysis

### 🟢 OOP Approach
\`\`\`python
class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val      # Node data
        self.left = left    # Left child reference
        self.right = right  # Right child reference
\`\`\`

**Binary structure** - two pointers for hierarchical data:
- Unlike ListNode (one pointer), TreeNode has two
- Each child is the root of its own subtree (recursive nature)
- Default parameters make children optional

### ✅ Complexity
- **Time: O(1)** - creating a single node is constant time
- **Space: O(1)** - stores value + two references per node

### 🎯 OOP Concept
**"Hierarchical Self-Reference"** → TreeNode references two other TreeNodes, creating tree structures. The recursive nature (each child is also a tree) enables elegant recursive algorithms. Essential for BST, traversals (inorder, preorder, postorder), BFS/DFS, and all tree problems.`,
            complexityQuizPlacement: 'after',
            difficulty: 'easy',
            timeLimit: 300,
            passingScore: 100
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-stack-class',
            title: 'Applied: Implement Stack Class',
            description: 'Build a Stack using OOP',
            requiredForProgress: true,
            targetComplexity: { time: 'O(1)', space: 'O(n)', notes: 'Push/pop are O(1), space for n items' },
            instruction: `# Implement Stack

Create a \`Stack\` class with:
- \`__init__()\` to initialize empty stack
- \`push(val)\` to add item to top
- \`pop()\` to remove and return top item (return None if empty)
- \`peek()\` to return top item without removing (return None if empty)
- \`is_empty()\` to check if stack is empty

## Examples

\`\`\`python
stack = Stack()
stack.push(1)
stack.push(2)
print(stack.peek())     # 2
print(stack.pop())      # 2
print(stack.is_empty()) # False
\`\`\`

## Why This Matters

Stacks are used in DFS, recursion, bracket matching, and many more problems!`,
            starterCode: `class Stack:
    def __init__(self):
        pass

    def push(self, val):
        pass

    def pop(self):
        pass

    def peek(self):
        pass

    def is_empty(self):
        pass`,
            solution: {
                afterAttempt: 3,
                text: `class Stack:
    def __init__(self):
        self.items = []

    def push(self, val):
        self.items.append(val)

    def pop(self):
        if self.is_empty():
            return None
        return self.items.pop()

    def peek(self):
        if self.is_empty():
            return None
        return self.items[-1]

    def is_empty(self):
        return len(self.items) == 0`
            },
            testCases: [
                {
                    input: 's = Stack(); s.push(1); s.push(2); s.pop()',
                    expectedOutput: '2'
                }
            ],
            hints: [
                { afterAttempt: 1, text: 'Use a list self.items = [] in __init__' },
                { afterAttempt: 2, text: 'push uses append(), pop uses pop(), peek uses [-1]' }
            ],
            solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Manual Array with Fixed Size
\`\`\`python
class Stack:
    def __init__(self):
        self.items = [None] * 100  # Fixed size
        self.top = -1

    def push(self, val):
        if self.top >= 99: return  # Full!
        self.top += 1
        self.items[self.top] = val
\`\`\`
**Time: O(1)** | **Space: O(n)** but wastes space, limited capacity

### 🟡 Bottleneck Analysis
- Fixed size requires knowing max capacity upfront
- Wastes memory if stack never fills
- Manual index tracking is error-prone
- Python lists already handle dynamic resizing efficiently

### 🟢 Optimal Implementation
\`\`\`python
class Stack:
    def __init__(self):
        self.items = []  # Dynamic list

    def push(self, val):
        self.items.append(val)  # O(1) amortized

    def pop(self):
        if self.is_empty(): return None
        return self.items.pop()  # O(1)

    def peek(self):
        return self.items[-1] if self.items else None

    def is_empty(self):
        return len(self.items) == 0
\`\`\`

**Why optimal:** Python list's \`append()\` and \`pop()\` from end are O(1) amortized. List's end = stack top (LIFO).

### ✅ Final Complexity
- **Time: O(1)** for all operations (push, pop, peek, is_empty)
- **Space: O(n)** where n is number of elements

### 🎯 Pattern Learned
**"ADT with Dynamic Storage"** → Abstract Data Type (Stack interface) can be implemented multiple ways. Python list is optimal for stack: O(1) operations at end, dynamic sizing, no wasted space. Used in DFS, expression evaluation, bracket matching, undo/redo.`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
            timeLimit: 600,
            passingScore: 100
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-queue-class',
            title: 'Applied: Implement Queue Class',
            description: 'Build a Queue using OOP',
            requiredForProgress: true,
            targetComplexity: { time: 'O(1)', space: 'O(n)', notes: 'Enqueue/dequeue are O(1) amortized with deque' },
            instruction: `# Implement Queue

Create a \`Queue\` class with:
- \`__init__()\` to initialize empty queue
- \`enqueue(val)\` to add item to back
- \`dequeue()\` to remove and return front item (return None if empty)
- \`is_empty()\` to check if queue is empty

## Examples

\`\`\`python
q = Queue()
q.enqueue(1)
q.enqueue(2)
print(q.dequeue())   # 1 (FIFO - first in, first out)
print(q.dequeue())   # 2
print(q.is_empty())  # True
\`\`\`

## Why This Matters

Queues are used in BFS, scheduling, and level-order traversal!`,
            starterCode: `class Queue:
    def __init__(self):
        pass

    def enqueue(self, val):
        pass

    def dequeue(self):
        pass

    def is_empty(self):
        pass`,
            solution: {
                afterAttempt: 3,
                text: `class Queue:
    def __init__(self):
        self.items = []

    def enqueue(self, val):
        self.items.append(val)

    def dequeue(self):
        if self.is_empty():
            return None
        return self.items.pop(0)

    def is_empty(self):
        return len(self.items) == 0`
            },
            testCases: [
                {
                    input: 'q = Queue(); q.enqueue(1); q.enqueue(2); q.dequeue()',
                    expectedOutput: '1'
                }
            ],
            hints: [
                { afterAttempt: 1, text: 'Use self.items = [] in __init__' },
                { afterAttempt: 2, text: 'enqueue uses append(), dequeue uses pop(0)' }
            ],
            solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: List with pop(0)
\`\`\`python
class Queue:
    def __init__(self):
        self.items = []

    def enqueue(self, val):
        self.items.append(val)  # O(1) - add to back

    def dequeue(self):
        if self.is_empty(): return None
        return self.items.pop(0)  # O(n) - remove from front, shifts all!
\`\`\`
**Time: enqueue O(1), dequeue O(n)** | **Space: O(n)**

### 🟡 Bottleneck Analysis
- \`pop(0)\` removes first element, shifting all remaining elements left
- For n elements, dequeue requires n-1 shifts
- This makes queue operations slow for large queues
- Need O(1) removal from front like we have O(1) append to back

### 🟢 Optimal Implementation
\`\`\`python
from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()  # Double-ended queue

    def enqueue(self, val):
        self.items.append(val)  # O(1) - add to right

    def dequeue(self):
        if self.is_empty(): return None
        return self.items.popleft()  # O(1) - remove from left!

    def is_empty(self):
        return len(self.items) == 0
\`\`\`

**Why optimal:** \`deque\` is optimized for O(1) operations at both ends. No shifting required.

### ✅ Final Complexity
- **Time: O(1)** amortized for enqueue and dequeue
- **Space: O(n)** where n is number of elements

### 🎯 Pattern Learned
**"Use deque for Queues"** → Never use list.pop(0) for queues! Always use \`collections.deque\` with \`popleft()\` for true O(1) operations. Essential for BFS, level-order traversal, and any FIFO processing.`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
            timeLimit: 600,
            passingScore: 100
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-min-stack',
            title: 'Applied: Min Stack',
            description: 'Stack that tracks minimum value',
            requiredForProgress: true,
            targetComplexity: { time: 'O(1)', space: 'O(n)', notes: 'All operations O(1), extra space for min tracking' },
            instruction: `# Min Stack

Create a \`MinStack\` class that supports:
- \`push(val)\` to add value
- \`pop()\` to remove top value
- \`top()\` to get top value
- \`get_min()\` to get minimum value in O(1) time

## Examples

\`\`\`python
stack = MinStack()
stack.push(3)
stack.push(1)
stack.push(2)
print(stack.get_min())  # 1
stack.pop()
print(stack.get_min())  # 1
stack.pop()
print(stack.get_min())  # 3
\`\`\`

## Hint

Keep track of minimums using a second stack!`,
            starterCode: `class MinStack:
    def __init__(self):
        pass

    def push(self, val):
        pass

    def pop(self):
        pass

    def top(self):
        pass

    def get_min(self):
        pass`,
            solution: {
                afterAttempt: 3,
                text: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val):
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)

    def pop(self):
        if self.stack:
            val = self.stack.pop()
            if val == self.min_stack[-1]:
                self.min_stack.pop()

    def top(self):
        return self.stack[-1] if self.stack else None

    def get_min(self):
        return self.min_stack[-1] if self.min_stack else None`
            },
            testCases: [
                {
                    input: 's = MinStack(); s.push(3); s.push(1); s.push(2); s.get_min()',
                    expectedOutput: '1'
                }
            ],
            hints: [
                { afterAttempt: 1, text: 'Use two stacks: self.stack and self.min_stack' },
                { afterAttempt: 2, text: 'Push to min_stack when val <= current min' }
            ],
            solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Scan for Minimum
\`\`\`python
class MinStack:
    def __init__(self):
        self.stack = []

    def push(self, val):
        self.stack.append(val)

    def get_min(self):
        return min(self.stack)  # O(n) scan!
\`\`\`
**Time: push O(1), get_min O(n)** | **Space: O(n)**

### 🟡 Bottleneck Analysis
- Every \`get_min()\` scans entire stack - O(n)
- For m get_min calls, total cost is O(m*n)
- Need to track minimum without scanning
- Key insight: minimum only changes on push/pop

### 🟢 Optimal Implementation
\`\`\`python
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []  # Parallel stack for minimums

    def push(self, val):
        self.stack.append(val)
        # Push to min_stack if new minimum or equal
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)

    def pop(self):
        if self.stack:
            val = self.stack.pop()
            # Pop from min_stack if it was the minimum
            if val == self.min_stack[-1]:
                self.min_stack.pop()

    def get_min(self):
        return self.min_stack[-1] if self.min_stack else None  # O(1)!
\`\`\`

**Why optimal:** \`min_stack[-1]\` always holds current minimum. Trade O(n) space for O(1) get_min.

### ✅ Final Complexity
- **Time: O(1)** for all operations (push, pop, top, get_min)
- **Space: O(n)** - main stack + min_stack (worst case: 2n elements)

### 🎯 Pattern Learned
**"Auxiliary Stack for Metadata"** → Use parallel stack to track min/max/frequency. Space-time tradeoff: O(n) extra space enables O(1) queries. Pattern variations: MaxStack, FrequencyStack, Stock Span, Next Greater Element.`,
            complexityQuizPlacement: 'after',
            difficulty: 'hard',
            timeLimit: 900,
            passingScore: 100
        },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-kth-largest',
      title: 'Practice: Kth Largest Element',
      description: 'Find the kth largest element using a heap',
      requiredForProgress: true,
      targetComplexity: { time: 'O(n log k)', space: 'O(k)', notes: 'Maintain a heap of size k' },
      instruction: `# Kth Largest Element

Find the **kth largest** element in an unsorted array.

## Example
~~~python
find_kth_largest([3, 2, 1, 5, 6, 4], 2)
# Returns: 5 (Sorted: [1, 2, 3, 4, 5, 6], 2nd largest is 5)

find_kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)
# Returns: 4
~~~

## Hint
Use a **Min-Heap** of size **k**.
1. Push elements into the heap.
2. If heap size > k, pop the smallest.
3. At the end, the heap contains the k largest elements, and the root (smallest of them) is the kth largest!`,
      starterCode: `import heapq

def find_kth_largest(nums, k):
    # Your code here
    pass`,
      solution: {
        afterAttempt: 2,
        text: `import heapq

def find_kth_largest(nums, k):
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    
    return min_heap[0]`
      },
      testCases: [
        { input: '[3, 2, 1, 5, 6, 4], 2', expectedOutput: '5' },
        { input: '[3, 2, 3, 1, 2, 4, 5, 5, 6], 4', expectedOutput: '4' }
      ],
      hints: [
        { afterAttempt: 1, text: 'Maintain a min-heap of size k. Push every element.' },
        { afterAttempt: 2, text: 'If heap grows larger than k, pop the smallest element.' }
      ],
      solutionExplanation: `## Solution Analysis

### 🟢 Approach (Min-Heap)
We want the k **largest** elements. A Min-Heap of size k keeps the k largest elements seen so far. The smallest of these k elements (the root) is the kth largest overall.

~~~python
def find_kth_largest(nums, k):
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]
~~~

### ✅ Complexity
- **Time: O(n log k)** - We process n elements, each push/pop takes O(log k).
- **Space: O(k)** - Heap stores at most k+1 elements.

### 🎯 Key Concept
**"Heap for Top/Bottom K"** → To find **k largest**, use **Min-Heap** (keep largest, discard smallest). To find **k smallest**, use **Max-Heap**. Size of heap is always k.`,
      difficulty: 'medium',
      timeLimit: 300,
      passingScore: 100
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-heap-sort',
      title: 'Practice: Heap Sort',
      description: 'Sort an array using heapq',
      requiredForProgress: true,
      targetComplexity: { time: 'O(n log n)', space: 'O(n)', notes: 'Build heap + pop n times' },
      instruction: `# Heap Sort

Implement a function that sorts a list of numbers in **ascending order** using a heap.

## Requirements
1. Convert the list to a min-heap.
2. Pop elements one by one to build the sorted list.

## Example
~~~python
heap_sort([5, 1, 3, 2, 4])
# Returns: [1, 2, 3, 4, 5]
~~~`,
      starterCode: `import heapq

def heap_sort(nums):
    # 1. Heapify (or push all)
    # 2. Pop all
    pass`,
      solution: {
        afterAttempt: 2,
        text: `import heapq

def heap_sort(nums):
    heapq.heapify(nums)
    sorted_list = []
    while nums:
        sorted_list.append(heapq.heappop(nums))
    return sorted_list`
      },
      testCases: [
        { input: '[5, 1, 3, 2, 4]', expectedOutput: '[1, 2, 3, 4, 5]' },
        { input: '[3, 3, 1]', expectedOutput: '[1, 3, 3]' },
        { input: '[]', expectedOutput: '[]' }
      ],
      hints: [
        { afterAttempt: 1, text: 'Use heapq.heapify(nums) to convert to heap in O(n).' },
        { afterAttempt: 2, text: 'Loop while nums is not empty, heappop() and append to result.' }
      ],
      solutionExplanation: `## Solution Analysis

### 🟢 Approach
Standard Heap Sort pattern:
1. Build heap from data.
2. Extract minimums repeatedly.

~~~python
def heap_sort(nums):
    heapq.heapify(nums)  # O(n)
    result = []
    while nums:
        result.append(heapq.heappop(nums))  # O(log n)
    return result
~~~

### ✅ Complexity
- **Time: O(n log n)** - Heapify is O(n), then n pops each taking O(log n).
- **Space: O(n)** - New list created for result. (In-place heap sort is possible but harder to implement with \`heapq\`).

### 🎯 Key Concept
**"Heapify"** → \`heapq.heapify()\` converts an array to a heap in **linear time O(n)**, which is faster than pushing elements one by one (O(n log n)).`,
      difficulty: 'medium',
      timeLimit: 300,
      passingScore: 100
    }
];
