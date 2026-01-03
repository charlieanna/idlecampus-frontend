import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module10HeapsLessonSmartPracticeExercises: ExerciseSection[] = [
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-sort-every-time',
      title: 'Approach 1: Sort Every Time',
      description: 'Sort the array on every query',
      targetComplexity: { time: 'O(n)', space: 'O(1)' },
      instruction: `# Approach 1: Sort Every Time

The simplest approach: **sort the entire array** every time you need the top K!

\`\`\`python
scores = [64, 25, 12, 22, 11, 90, 85, 73]
sorted_scores = sorted(scores, reverse=True)
top_k = sorted_scores[:k]  # [90, 85, 73]
\`\`\`

## Your Task

Implement a \`TopKFinder\` class that:
1. **add(score)** - Add a new score
2. **getTopK(k)** - Return top K largest scores

Use the "sort every time" approach.

## Example

\`\`\`python
finder = TopKFinder()
finder.add(64)
finder.add(25)
finder.add(12)
finder.getTopK(2)  # [64, 25]
finder.add(90)
finder.getTopK(2)  # [90, 64]
\`\`\`

**Question:** What's the time complexity for \`getTopK\`? 🤔`,
                              starterCode: `def findKthLargest(nums, k):
    # Your code here
    pass`,
expectedOutput: ``,
      hints: [
        { afterAttempt: 1, text: 'Store all scores in a list. For getTopK, sort the list and return first k elements.' },
        { afterAttempt: 2, text: 'Use sorted(scores, reverse=True)[:k] to get top k elements.' }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution: Sort Every Time Approach

\`\`\`python
class TopKFinder:
    def __init__(self):
        self.scores = []

    def add(self, score):
        """Add score to list - O(1)"""
        self.scores.append(score)

    def getTopK(self, k):
        """Get top K scores - O(n log n) time"""
        sorted_scores = sorted(self.scores, reverse=True)
        return sorted_scores[:k]
\`\`\`

## Time Complexity Analysis

- **add(score):** O(1) - just append
- **getTopK(k):** O(n log n) - sort entire array!

**where n = total number of scores**

## Space Complexity Analysis

- **O(n)** - storing all scores in a list
- As more scores are added, list grows linearly

## The Bottleneck 😟

For **millions of scores**, every query takes forever!
- Must sort ALL scores even to find top 3
- 99.9% of sorting work is wasted
- Sorting is expensive: O(n log n)

## The Insight 💡

**We don't need a fully sorted array!**

We only need the **top K** values!

**Can we avoid sorting everything?** Let's optimize! 🚀`
      },
      solutionExplanation: `## Time Complexity Analysis

**add(score)**: O(1)
- Just appending to a list
- Fast operation

**getTopK(k)**: O(n log n)
- Sorting entire array every time
- n = total number of scores

---

### Why This Is Slow

With 1,000,000 scores:
- Each getTopK: ~20 million operations (n log n)
- Just to find top 3 scores!
- **99.9% of work is wasted**

---

### The Problem

We're sorting EVERYTHING just to find a few top elements!

\`\`\`python
complexityQuizPlacement: 'after',
scores = [... millions of scores ...]
sorted(scores)  # Sort ALL of them?! 😱
top_3 = sorted_scores[:3]  # Just need these 3
\`\`\`

**Key Insight:** We don't need a fully sorted array!

With a **heap**, we can:
- Keep only top K elements → O(log k) per insert
- Get top K without sorting all → O(1) or O(k log k)

**Next:** Learn how heaps make this O(n log k) instead of O(n log n)!`,
      testCases: [
        // TopKFinder class operation sequences
        {
          'input': '["TopKFinder","add","add","add","getTopK","add","getTopK"], [[],[64],[25],[12],[2],[90],[2]]',
          'expectedOutput': '[null,null,null,null,[64,25],null,[90,64]]'
        },
        // B - Boundaries
        {
          'input': '["TopKFinder","add","getTopK"], [[],[1],[1]]',
          'expectedOutput': '[null,null,[1]]'
        },
        {
          'input': '["TopKFinder","add","add","getTopK"], [[],[5],[3],[1]]',
          'expectedOutput': '[null,null,null,[5]]'
        },
        // E - Edge cases
        {
          'input': '["TopKFinder","add","add","add","getTopK"], [[],[1],[1],[1],[3]]',
          'expectedOutput': '[null,null,null,null,[1,1,1]]'
        },
        // D - Different patterns
        {
          'input': '["TopKFinder","add","add","add","add","getTopK"], [[],[10],[20],[30],[40],[2]]',
          'expectedOutput': '[null,null,null,null,null,[40,30]]'
        },
        // T - Type variations
        {
          'input': '["TopKFinder","add","add","getTopK","add","getTopK"], [[],[-5],[10],[2],[100],[3]]',
          'expectedOutput': '[null,null,null,[10,-5],null,[100,10,-5]]'
        },
        // I - Interesting patterns
        {
          'input': '["TopKFinder","add","add","add","getTopK","getTopK"], [[],[100],[50],[75],[1],[2]]',
          'expectedOutput': '[null,null,null,null,[100],[100,75]]'
        },
        // M - Many operations
        {
          'input': '["TopKFinder","add","add","add","add","add","getTopK"], [[],[5],[2],[8],[1],[9],[3]]',
          'expectedOutput': '[null,null,null,null,null,null,[9,8,5]]'
        }
      ],
      requiredForProgress: true
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-build-simple-heap',
      title: 'Build a Simple Max-Heap',
      description: 'Implement basic heap with insert and peek operations',
      targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
      instruction: `# Build a Simple Max-Heap

Now let's build a heap from scratch to understand how it works!

## Your Task

Implement a \`SimpleMaxHeap\` class with:
1. **insert(val)** - Add a value and maintain heap property
2. **peek()** - Return maximum value (root) without removing it
3. **size()** - Return number of elements

Use a list to store the heap and maintain the max-heap property.

---

## Heap Property Reminder

**Max-Heap Rule:** Every parent ≥ both children

\`\`\`
        90  ← Root (maximum)
       /  \\
     85    73
    / \\
  64  25
\`\`\`

Stored as: \`[90, 85, 73, 64, 25]\`

---

## Index Relationships

For element at index **i**:
- Parent: \`(i - 1) // 2\`
- Left child: \`2 * i + 1\`
- Right child: \`2 * i + 2\`

---

## Insert Algorithm (Bubble Up)

1. Add new element to **end** of array
2. Compare with **parent**
3. If child > parent, **swap**
4. Repeat until heap property restored

\`\`\`python
# Example: Insert 80 into [90, 85, 73, 64, 25]

Step 1: Add to end
[90, 85, 73, 64, 25, 80]  # Index 5
                      ↑

Step 2: Compare with parent (index 2, value 73)
80 > 73 → Swap!

[90, 85, 80, 64, 25, 73]

Step 3: Compare with new parent (index 0, value 90)
80 < 90 → Stop! Heap property satisfied
\`\`\`

---

## Example Usage

\`\`\`python
heap = SimpleMaxHeap()
heap.insert(50)
heap.insert(30)
heap.insert(70)
heap.insert(20)

print(heap.peek())  # 70 (maximum)
print(heap.size())  # 4
\`\`\`

---

**Hint:** For insert, add to end then "bubble up" by swapping with parent while child > parent`,
                              starterCode: `class MaxHeap:
    def __init__(self):
        self.heap = []

    def push(self, val):
        pass

    def pop(self):
        pass`,
expectedOutput: ``,
      hints: [
        { afterAttempt: 1, text: 'Store elements in self.heap = []. For insert: append value, then bubble up by comparing with parent at (i-1)//2.' },
        { afterAttempt: 2, text: 'Bubble up loop: while i > 0 and heap[i] > heap[parent_idx], swap and move i to parent_idx. Stop when at root or heap property satisfied.' }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution: Simple Max-Heap Implementation

\`\`\`python
class SimpleMaxHeap:
    def __init__(self):
        self.heap = []  # Store elements as array

    def insert(self, val):
        """Add value and bubble up to maintain heap property"""
        # Step 1: Add to end
        self.heap.append(val)

        # Step 2: Bubble up
        i = len(self.heap) - 1  # Current position

        while i > 0:
            parent_idx = (i - 1) // 2

            # If child > parent, swap (max-heap property)
            if self.heap[i] > self.heap[parent_idx]:
                self.heap[i], self.heap[parent_idx] = self.heap[parent_idx], self.heap[i]
                i = parent_idx  # Move up
            else:
                break  # Heap property satisfied!

    def peek(self):
        """Return max value (root) without removing"""
        if len(self.heap) == 0:
            return -1
        return self.heap[0]  # Root is always maximum

    def size(self):
        """Return number of elements"""
        return len(self.heap)
\`\`\`

---

## How It Works

### Insert 50:
\`\`\`
heap = [50]  # Just one element, heap property satisfied
\`\`\`

### Insert 30:
\`\`\`
heap = [50, 30]  # 30 < 50, heap property satisfied
        50
       /
     30
\`\`\`

### Insert 70:
\`\`\`
Step 1: Add to end
heap = [50, 30, 70]
        50
       /  \\
     30    70

Step 2: Bubble up - 70 > 50, swap!
heap = [70, 30, 50]
        70  ← New maximum at root!
       /  \\
     30    50
\`\`\`

### Insert 20:
\`\`\`
heap = [70, 30, 50, 20]  # 20 < 30, no swap needed
        70
       /  \\
     30    50
    /
  20
\`\`\`

---

## Time Complexity

- **insert()**: O(log n) - bubble up tree height
- **peek()**: O(1) - just return root
- **size()**: O(1) - return array length

**Tree height = log n** for complete binary tree!

## Space Complexity

- **O(n)** - storing n elements in heap array
- No extra space beyond the heap itself`
      },
      testCases: [
        {
          'input': '["SimpleMaxHeap","insert","peek","size"], [[],[50],[],[]]',
          'expectedOutput': '[null,null,50,1]'
        },
        {
          'input': '["SimpleMaxHeap","insert","insert","insert","peek","size"], [[],[50],[30],[70],[],[]]',
          'expectedOutput': '[null,null,null,null,70,3]'
        },
        {
          'input': '["SimpleMaxHeap","insert","insert","insert","insert","peek"], [[],[10],[20],[15],[30],[]]',
          'expectedOutput': '[null,null,null,null,null,30]'
        },
        {
          'input': '["SimpleMaxHeap","peek"], [[],[]]',
          'expectedOutput': '[null,-1]'
        },
        {
          'input': '["SimpleMaxHeap","insert","insert","insert","insert","insert","peek"], [[],[5],[3],[8],[1],[9],[]]',
          'expectedOutput': '[null,null,null,null,null,null,9]'
        }
      ],
      requiredForProgress: true
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-heap-extract-max',
      title: 'Implement extract_max() - Heapify Down',
      description: 'Remove and return maximum value while maintaining heap property',
      targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
      instruction: `# Implement extract_max() - Heapify Down

Now let's implement the **extract_max()** operation to remove the root!

## The Challenge

Removing the root leaves a **hole** at the top. How do we fix it?

\`\`\`
        90  ← Remove this!
       /  \\
     85    73
    / \\
  64  25

After removal:
        ??  ← What goes here?
       /  \\
     85    73
    / \\
  64  25
\`\`\`

---

## The Algorithm (Heapify Down / Bubble Down)

1. **Save** the root value (to return)
2. **Move last element** to root
3. **Bubble down** to restore heap property:
   - Compare with both children
   - Swap with **larger** child (max-heap)
   - Repeat until heap property satisfied

\`\`\`python
# Example: Extract max from [90, 85, 73, 64, 25]

Step 1: Save root
max_val = 90

Step 2: Move last element (25) to root
heap = [25, 85, 73, 64]
        25  ← Out of place!
       /  \\
     85    73
    /
  64

Step 3: Bubble down
Compare 25 with children (85, 73)
Swap with larger child (85)

heap = [85, 25, 73, 64]
        85
       /  \\
     25    73
    /
  64

Compare 25 with child (64)
Swap with 64

heap = [85, 64, 73, 25]
        85  ← Heap property restored!
       /  \\
     64    73
    /
  25

Return 90
\`\`\`

---

## Your Task

Extend the \`SimpleMaxHeap\` class with:

\`\`\`python
def extract_max(self):
    """Remove and return maximum value (root)"""
    # Return -1 if heap is empty
    # Otherwise:
    # 1. Save root value
    # 2. Move last element to root
    # 3. Bubble down to restore heap property
    # 4. Return saved value
\`\`\`

---

## Index Relationships Reminder

For element at index **i**:
- Left child: \`2*i + 1\`
- Right child: \`2*i + 2\`
- Parent: \`(i-1) // 2\`

---

## Bubble Down Logic

\`\`\`python
# At index i, find larger child
left = 2*i + 1
right = 2*i + 2
largest = i

if left < len(heap) and heap[left] > heap[largest]:
    largest = left
if right < len(heap) and heap[right] > heap[largest]:
    largest = right

if largest != i:
    swap(heap[i], heap[largest])
    # Continue bubbling down from largest
\`\`\`

---

## Example Usage

\`\`\`python
heap = SimpleMaxHeap()
heap.insert(50)
heap.insert(30)
heap.insert(70)
heap.insert(20)

print(heap.extract_max())  # 70
print(heap.extract_max())  # 50
print(heap.peek())          # 30
\`\`\`

---

**Hint:** Move last element to root, then bubble down by swapping with larger child until heap property is restored`,
                              starterCode: `def heapify_down(heap, index):
    pass`,
expectedOutput: ``,
      hints: [
        { afterAttempt: 1, text: 'Save heap[0], move heap[-1] to heap[0], remove last element with pop(). Then bubble down from index 0.' },
        { afterAttempt: 2, text: 'Bubble down: find larger child (compare left and right). If parent < larger child, swap and continue from that child index. Stop when no children or heap property satisfied.' }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution: Complete Max-Heap with extract_max()

\`\`\`python
class SimpleMaxHeap:
    def __init__(self):
        self.heap = []

    def insert(self, val):
        """Add value and bubble up"""
        self.heap.append(val)
        i = len(self.heap) - 1

        while i > 0:
            parent_idx = (i - 1) // 2
            if self.heap[i] > self.heap[parent_idx]:
                self.heap[i], self.heap[parent_idx] = self.heap[parent_idx], self.heap[i]
                i = parent_idx
            else:
                break

    def extract_max(self):
        """Remove and return maximum value"""
        if len(self.heap) == 0:
            return -1

        if len(self.heap) == 1:
            return self.heap.pop()

        # Step 1: Save root
        max_val = self.heap[0]

        # Step 2: Move last to root and remove last
        self.heap[0] = self.heap.pop()

        # Step 3: Bubble down
        i = 0
        while True:
            left = 2 * i + 1
            right = 2 * i + 2
            largest = i

            # Find larger child
            if left < len(self.heap) and self.heap[left] > self.heap[largest]:
                largest = left
            if right < len(self.heap) and self.heap[right] > self.heap[largest]:
                largest = right

            # If parent is largest, stop
            if largest == i:
                break

            # Swap with larger child
            self.heap[i], self.heap[largest] = self.heap[largest], self.heap[i]
            i = largest  # Continue from child

        return max_val

    def peek(self):
        if len(self.heap) == 0:
            return -1
        return self.heap[0]

    def size(self):
        return len(self.heap)
\`\`\`

---

## How extract_max() Works

### Initial heap: [90, 85, 73, 64, 25]
\`\`\`
        90
       /  \\
     85    73
    / \\
  64  25
\`\`\`

### extract_max():

**Step 1:** Save 90

**Step 2:** Move 25 to root, remove last
\`\`\`
heap = [25, 85, 73, 64]
        25  ← Violates heap property!
       /  \\
     85    73
    /
  64
\`\`\`

**Step 3:** Bubble down
- Compare 25 with children (85, 73)
- Larger child is 85
- Swap!

\`\`\`
heap = [85, 25, 73, 64]
        85
       /  \\
     25    73
    /
  64
\`\`\`

- Compare 25 with child (64)
- 64 > 25, swap!

\`\`\`
heap = [85, 64, 73, 25]
        85  ← Heap property restored!
       /  \\
     64    73
    /
  25
\`\`\`

**Return:** 90

---

## Time Complexity

- **extract_max()**: O(log n) - bubble down tree height
- **insert()**: O(log n) - bubble up tree height
- **peek()**: O(1) - just return root

Both insert and extract are **O(log n)**! 🎉

## Space Complexity

- **O(n)** - storing n elements in heap array
- Extract operation uses O(1) extra space (just swapping)`
      },
      testCases: [
        {
          'input': '["SimpleMaxHeap","insert","insert","insert","extract_max","peek"], [[],[50],[30],[70],[],[]]',
          'expectedOutput': '[null,null,null,null,70,50]'
        },
        {
          'input': '["SimpleMaxHeap","insert","insert","insert","extract_max","extract_max","peek"], [[],[50],[30],[70],[],[],[]]',
          'expectedOutput': '[null,null,null,null,70,50,30]'
        },
        {
          'input': '["SimpleMaxHeap","extract_max"], [[],[]]',
          'expectedOutput': '[null,-1]'
        },
        {
          'input': '["SimpleMaxHeap","insert","extract_max"], [[],[100],[]]',
          'expectedOutput': '[null,null,100]'
        },
        {
          'input': '["SimpleMaxHeap","insert","insert","insert","insert","insert","extract_max","extract_max"], [[],[10],[20],[15],[30],[5],[],[]]',
          'expectedOutput': '[null,null,null,null,null,null,30,20]'
        }
      ],
      requiredForProgress: true
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-complete-minheap',
      title: 'Implement Complete MinHeap Class',
      description: 'Build a full-featured min-heap with all operations',
      targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
      instruction: `# Implement Complete MinHeap Class

Now let's build a **complete MinHeap** with all operations!

## Min-Heap vs Max-Heap

**Min-Heap Property:** Every parent ≤ both children

\`\`\`
        1  ← Minimum at root
       / \\
      3    5
     / \\
    7   9
\`\`\`

**Just flip the comparisons from max-heap!**

---

## Your Task

Implement a \`MinHeap\` class with:

1. **insert(val)** - Add value (bubble up)
2. **extract_min()** - Remove and return minimum
3. **peek()** - Return minimum without removing
4. **heapify(arr)** - Build heap from array in O(n)
5. **size()** - Return number of elements

---

## Key Differences from MaxHeap

### Bubble Up (for insert):
\`\`\`python
# Max-heap: if child > parent, swap
# Min-heap: if child < parent, swap
if self.heap[i] < self.heap[parent_idx]:
    swap(i, parent_idx)
\`\`\`

### Bubble Down (for extract_min):
\`\`\`python
# Max-heap: swap with larger child
# Min-heap: swap with smaller child
smallest = i
if left < size and heap[left] < heap[smallest]:
    smallest = left
if right < size and heap[right] < heap[smallest]:
    smallest = right
\`\`\`

### Heapify (build from array):
\`\`\`python
# Start from last parent, bubble down each
last_parent = (len(arr) - 1) // 2
for i in range(last_parent, -1, -1):
    bubble_down(i)
\`\`\`

---

## Example Usage

\`\`\`python
heap = MinHeap()
heap.insert(50)
heap.insert(30)
heap.insert(70)
heap.insert(20)

print(heap.peek())        # 20 (minimum)
print(heap.extract_min()) # 20
print(heap.peek())        # 30

# Build from array
heap2 = MinHeap()
heap2.heapify([4, 10, 3, 5, 1])
print(heap2.peek())       # 1
\`\`\`

---

**Hints:**
- For insert: bubble up while child < parent
- For extract_min: bubble down, swap with **smaller** child
- For heapify: start from last parent, bubble down each`,
                              starterCode: `class MinHeap:
    def __init__(self):
        self.heap = []

    def push(self, val):
        pass

    def pop(self):
        pass`,
expectedOutput: ``,
      hints: [
        { afterAttempt: 1, text: 'MinHeap is like MaxHeap but with < instead of > comparisons. Bubble up: swap if child < parent. Bubble down: swap with smaller child.' },
        { afterAttempt: 2, text: 'For heapify: set self.heap = arr[:], then call bubble_down on each parent from (len-1)//2 down to 0.' }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution: Complete MinHeap Implementation

\`\`\`python
class MinHeap:
    def __init__(self):
        self.heap = []

    def insert(self, val):
        """Add value and bubble up"""
        self.heap.append(val)
        i = len(self.heap) - 1

        # Bubble up: swap if child < parent
        while i > 0:
            parent_idx = (i - 1) // 2
            if self.heap[i] < self.heap[parent_idx]:
                self.heap[i], self.heap[parent_idx] = self.heap[parent_idx], self.heap[i]
                i = parent_idx
            else:
                break

    def extract_min(self):
        """Remove and return minimum value"""
        if len(self.heap) == 0:
            return -1

        if len(self.heap) == 1:
            return self.heap.pop()

        # Save min, move last to root
        min_val = self.heap[0]
        self.heap[0] = self.heap.pop()

        # Bubble down: swap with smaller child
        i = 0
        while True:
            left = 2 * i + 1
            right = 2 * i + 2
            smallest = i

            if left < len(self.heap) and self.heap[left] < self.heap[smallest]:
                smallest = left
            if right < len(self.heap) and self.heap[right] < self.heap[smallest]:
                smallest = right

            if smallest == i:
                break

            self.heap[i], self.heap[smallest] = self.heap[smallest], self.heap[i]
            i = smallest

        return min_val

    def peek(self):
        """Return minimum without removing"""
        if len(self.heap) == 0:
            return -1
        return self.heap[0]

    def heapify(self, arr):
        """Build min-heap from array in O(n)"""
        self.heap = arr[:]  # Copy array

        # Start from last parent, bubble down each
        last_parent = (len(self.heap) - 1) // 2
        for i in range(last_parent, -1, -1):
            self._bubble_down(i)

    def _bubble_down(self, i):
        """Helper to bubble down from index i"""
        while True:
            left = 2 * i + 1
            right = 2 * i + 2
            smallest = i

            if left < len(self.heap) and self.heap[left] < self.heap[smallest]:
                smallest = left
            if right < len(self.heap) and self.heap[right] < self.heap[smallest]:
                smallest = right

            if smallest == i:
                break

            self.heap[i], self.heap[smallest] = self.heap[smallest], self.heap[i]
            i = smallest

    def size(self):
        """Return number of elements"""
        return len(self.heap)
\`\`\`

---

## Time Complexity Summary

| Operation | Time | Space |
|-----------|------|-------|
| insert() | O(log n) | O(1) |
| extract_min() | O(log n) | O(1) |
| peek() | O(1) | O(1) |
| heapify() | O(n) | O(n) for copy |
| size() | O(1) | O(1) |

---

## Example Walkthrough

### Insert Operations:
\`\`\`python
heap = MinHeap()
heap.insert(50)  # [50]
heap.insert(30)  # [30, 50] - bubble up
heap.insert(70)  # [30, 50, 70]
heap.insert(20)  # [20, 30, 70, 50] - bubble up
\`\`\`

### Heapify Operation:
\`\`\`python
heap2 = MinHeap()
heap2.heapify([4, 10, 3, 5, 1])
# Result: [1, 4, 3, 5, 10]
#         1
#        / \\
#       4   3
#      / \\
#     5  10
\`\`\`

---

## You've Mastered Heaps! 🎉

You now understand:
- ✅ Heap property (min and max)
- ✅ Complete binary tree structure
- ✅ Array representation
- ✅ Bubble up (insert)
- ✅ Bubble down (extract)
- ✅ Heapify operation (O(n) build)

**Ready for real problems!** 🚀`
      },
      testCases: [
        {
          'input': '["MinHeap","insert","insert","insert","peek","extract_min","peek"], [[],[50],[30],[70],[],[],[]]',
          'expectedOutput': '[null,null,null,null,30,30,50]'
        },
        {
          'input': '["MinHeap","heapify","peek","extract_min","peek"], [[],[[4,10,3,5,1]],[],[],[]]',
          'expectedOutput': '[null,null,1,1,3]'
        },
        {
          'input': '["MinHeap","insert","insert","extract_min","extract_min"], [[],[100],[50],[],[]]',
          'expectedOutput': '[null,null,null,50,100]'
        },
        {
          'input': '["MinHeap","heapify","size"], [[],[[20,15,30,10,25]],[]]',
          'expectedOutput': '[null,null,5]'
        },
        {
          'input': '["MinHeap","insert","insert","insert","extract_min","insert","peek"], [[],[5],[3],[8],[],[1],[]]',
          'expectedOutput': '[null,null,null,null,3,null,1]'
        }
      ],
      requiredForProgress: true
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-merge-k-sorted-lists',
      title: 'Code: Merge K Sorted Lists',
      description: 'Merge K sorted linked lists into one sorted list using a min-heap',
      targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
      difficulty: 'hard',
      instruction: `# Merge K Sorted Lists

You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

## Example 1

\`\`\`
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]

Explanation: The linked-lists are:
[
  1->4->5,
  1->3->4,
  2->6
]
merging them into one sorted list:
1->1->2->3->4->4->5->6
\`\`\`

## Example 2

\`\`\`
Input: lists = []
Output: []
\`\`\`

## Example 3

\`\`\`
Input: lists = [[]]
Output: []
\`\`\`

## Constraints

- \`k == lists.length\`
- \`0 <= k <= 10^4\`
- \`0 <= lists[i].length <= 500\`
- \`-10^4 <= lists[i][j] <= 10^4\`
- \`lists[i]\` is sorted in **ascending** order
- The sum of \`lists[i].length\` will not exceed \`10^4\`

## Why Heap?

**Naive approach:** Compare first elements of all K lists each time → **O(N × K)** where N = total nodes

**Heap approach:** Use min-heap to always get the smallest element across K lists → **O(N log K)**

With K=1000 lists and N=10,000 nodes:
- Naive: 10,000 × 1,000 = 10 million ops
- Heap: 10,000 × log(1000) ≈ 100,000 ops
- **100x faster!**

**Hint:** Use a min-heap to track the smallest element from each list. When you pop the min, add the next node from that list to the heap!`,
      starterCode: `from typing import List, Optional
import heapq

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def mergeKLists(lists):
    pass`,
      hints: [],
      solution: {
        afterAttempt: 1,
        text: `from typing import List, Optional
import heapq

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def mergeKLists(lists):
    """
    Merge K sorted linked lists using min-heap.
    
    Time: O(N log K) where N = total nodes, K = number of lists
    Space: O(K) for heap
    """
    # Min-heap: (value, list_index, node)
    # list_index prevents comparing ListNode objects
    min_heap = []
    
    # Initialize heap with first node from each list
    for i, head in enumerate(lists):
        if head:
            heapq.heappush(min_heap, (head.val, i, head))
    
    # Dummy head for result
    dummy = ListNode(0)
    current = dummy
    
    # Process nodes in sorted order
    while min_heap:
        val, i, node = heapq.heappop(min_heap)
        
        # Add to result
        current.next = node
        current = current.next
        
        # Add next node from same list
        if node.next:
            heapq.heappush(min_heap, (node.next.val, i, node.next))
    
    return dummy.next

# Alternative: Divide and Conquer approach
def mergeKLists_divide_conquer(lists):
    """
    Merge using divide and conquer - also O(N log K)
    """
    if not lists:
        return None
    
    def merge2Lists(l1, l2):
        dummy = ListNode(0)
        current = dummy
        
        while l1 and l2:
            if l1.val < l2.val:
                current.next = l1
                l1 = l1.next
            else:
                current.next = l2
                l2 = l2.next
            current = current.next
        
        current.next = l1 or l2
        return dummy.next
    
    # Merge pairs recursively
    while len(lists) > 1:
        merged = []
        for i in range(0, len(lists), 2):
            l1 = lists[i]
            l2 = lists[i + 1] if i + 1 < len(lists) else None
            merged.append(merge2Lists(l1, l2))
        lists = merged
    
    return lists[0]`
      },
      solutionExplanation: `## Solution Analysis

### Approach 1: Min-Heap (Priority Queue)

**Key Insight:** At each step, we need the **smallest element** across K lists. A min-heap gives us this in O(log K)!

### Algorithm Steps

1. **Initialize heap** with first node from each list - O(K log K)
2. **While heap not empty:**
   - Pop smallest node (min across K lists) - O(log K)
   - Append to result
   - Push next node from same list to heap - O(log K)
3. Repeat N times (total nodes)

### Time Complexity

**O(N log K)** where:
- N = total number of nodes across all lists
- K = number of lists
- Each of N nodes: push/pop from heap of size K → O(log K)

**Why better than naive?**
- Naive: For each of N nodes, compare with K list heads → O(N × K)
- Heap: For each of N nodes, heap operation → O(N log K)
- **With K=1000: 1000 vs 10 → 100x faster!**

### Space Complexity

**O(K)** for the min-heap (stores at most K nodes at once)

### Heap Tuple Structure

\`\`\`python
(node.val, list_index, node)
 ↑         ↑            ↑
 priority  tiebreaker   actual data
\`\`\`

**Why list_index?**
- Python can't compare ListNode objects
- If two nodes have same value, list_index breaks the tie
- Ensures consistent heap ordering

### Alternative: Divide and Conquer

**Also O(N log K):**
- Merge lists in pairs: K → K/2 → K/4 → ... → 1
- log K levels, each level processes N nodes
- Same complexity, different approach!

### L6 Interview Tip

**Interviewers love this for Staff because:**
- Tests heap mastery (priority queue use case)
- Complexity analysis (N log K vs N×K)
- Real-world: merging sorted log files from K servers
- Shows distributed systems thinking`,
      testCases: [
        {
          input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
          expectedOutput: '[1,1,2,3,4,4,5,6]'
        },
        {
          input: 'lists = []',
          expectedOutput: '[]'
        },
        {
          input: 'lists = [[]]',
          expectedOutput: '[]'
        },
        {
          input: 'lists = [[1,2,3]]',
          expectedOutput: '[1,2,3]'
        },
        {
          input: 'lists = [[1],[2],[3]]',
          expectedOutput: '[1,2,3]'
        },
        {
          input: 'lists = [[-2,-1,-1,-1],[]]',
          expectedOutput: '[-2,-1,-1,-1]'
        }
      ],
      complexityQuizPlacement: 'after',
      requiredForProgress: true
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-top-k-frequent',
      title: 'Code: Top K Frequent Elements',
      description: 'Return k most frequent elements',
      targetComplexity: { time: 'O(n log k)', space: 'O(k)' },
      instruction: `# Top K Frequent Elements

Given an integer array \`nums\` and an integer \`k\`, return the k most frequent elements.

## Problem Statement

You may return the answer in any order.

## Examples

**Example 1:**
\`\`\`
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1], k = 1
Output: [1]
\`\`\`

## Constraints

- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4
- k is in the range [1, the number of unique elements]
- The answer is guaranteed to be unique

Time: O(n + u log u) where u = unique elements

**Heap Approach:**
- Only maintain k elements in heap
- Each push/pop is O(log k), not O(log n)
- Time: O(n + u log k)

For n = 100,000, k = 3:
- Sorting: O(u log u) ≈ O(u × 17)
- Heap: O(u log k) ≈ O(u × 1.6)
- **10x faster** for small k!

---

### Key Insight

**Don't sort ALL frequencies when you only need top K!**

Min-heap of size k:
- Automatically keeps smallest of the "top k"
- New frequency bigger? Push and pop smallest
- Final heap = top k most frequent!`,
      starterCode: `def topKFrequent(nums, k):
    pass`,
      hints: [],
      solution: {
        afterAttempt: 1,
        text: `# Solution: Top K Frequent Elements

Use a hash map to count frequencies, then use a min-heap of size k to track the k most frequent elements.

Time: O(n + u log k) where u = unique elements
Space: O(n) for the frequency map`
      },
      testCases: [
        // Basic examples (order may vary, so test sets)
        {
          'input': '[1, 1, 1, 2, 2, 3], 2',
          'expectedOutput': '[1, 2]'
        },
        {
          'input': '[1], 1',
          'expectedOutput': '[1]'
        },
        // B - Boundaries
        {
          'input': '[1, 2], 2',
          'expectedOutput': '[1, 2]'
        },
        {
          'input': '[1, 1], 1',
          'expectedOutput': '[1]'
        },
        // E - Edge cases
        {
          'input': '[1, 2, 3, 4], 1',
          'expectedOutput': '[1]'
        },
        {
          'input': '[-1, -1], 1',
          'expectedOutput': '[-1]'
        },
        // D - Different patterns
        {
          'input': '[1, 1, 2, 2, 3, 3], 2',
          'expectedOutput': '[1, 2]'
        },
        {
          'input': '[4, 1, -1, 2, -1, 2, 3], 2',
          'expectedOutput': '[-1, 2]'
        },
        // T - Type variations
        {
          'input': '[0, 0, 0, 0], 1',
          'expectedOutput': '[0]'
        },
        // I - Interesting patterns
        {
          'input': '[1, 2, 2, 3, 3, 3], 3',
          'expectedOutput': '[3, 2, 1]'
        },
        // M - Many elements
        {
          'input': '[1, 1, 1, 2, 2, 3, 3, 3, 3], 2',
          'expectedOutput': '[3, 1]'
        },
        // E - Extremes
        {
          'input': '[-1000, 1000, -1000], 1',
          'expectedOutput': '[-1000]'
        }
      ],
      requiredForProgress: true
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-find-median-stream',
      title: 'Code: Find Median from Data Stream',
      description: 'Maintain median with two heaps',
      targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
      instruction: `# Find Median from Data Stream

The median is the middle value in an ordered integer list.

Implement the MedianFinder class:
- \`MedianFinder()\` initializes the object
- \`void addNum(int num)\` adds num from the data stream
- \`double findMedian()\` returns the median of all elements

## Example

\`\`\`
MedianFinder medianFinder = new MedianFinder();
medianFinder.addNum(1);    // arr = [1]
medianFinder.addNum(2);    // arr = [1, 2]
medianFinder.findMedian(); // return 1.5 (average of 1 and 2)
medianFinder.addNum(3);    // arr = [1, 2, 3]
medianFinder.findMedian(); // return 2.0
\`\`\`

## Constraints

- -10^5 <= num <= 10^5
- There will be at least one element before calling findMedian
- At most 5 * 10^4 calls will be made to addNum and findMedian

small (max): [... 25] ← max is 25
large (min): [30 ...] ← min is 30
median = (25 + 30) / 2 = 27.5
\`\`\`

---

## Pattern Recognition

**"Kth largest/smallest"?** → Heap of size k

**"Top K" anything?** → Heap with appropriate comparator

**"Median" or "running median"?** → Two heaps

**"Merge K sorted"?** → Min-heap tracking

**"Priority" or "scheduling"?** → Priority queue (heap)

---

## The Discovery Process

You learned to:
1. **Start with brute force** (sort every time)
2. **Identify bottlenecks** (O(n log n) too slow)
3. **Try optimizations** (sorted list, binary search)
4. **Hit the real bottleneck** (shifting is O(n))
5. **Change perspective** (partial ordering!)
6. **Discover structure** (heap emerges naturally!)

This problem-solving approach works for harder problems too! 🚀

---

## Python's heapq

\`\`\`python
import heapq

heap = []
heapq.heappush(heap, 5)  # O(log n) insert
heapq.heappop(heap)      # O(log n) extract min
heap[0]                  # O(1) peek

# For max-heap: negate values!
heapq.heappush(heap, -5)
max_val = -heapq.heappop(heap)
\`\`\`

---

## Next Steps

**Module 11: Backtracking & Recursion Trees** - Master decision trees!

Ready? Let's go! 🎉`,
      starterCode: `class MedianFinder:
    def __init__(self):
        pass

    def addNum(self, num):
        pass

    def findMedian(self):
        pass`,

      hints: [],
      solution: {
        afterAttempt: 1,
        text: `# Solution: Find Median from Data Stream

Use two heaps: max-heap for smaller half, min-heap for larger half.
Keep heaps balanced so median is at root(s).

Time: O(log n) per add, O(1) per findMedian
Space: O(n)`
      },
      testCases: [],
      requiredForProgress: false
    },

  // ============================================================================
  // PHASE 1: Core Mechanics - Bounded Heaps & Custom Ordering
  // ============================================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-kth-largest-stream',
    title: 'K-th Largest Element in a Stream',
    description: 'Maintain k-th largest element as stream arrives',
    targetComplexity: { time: 'O(log k) per add', space: 'O(k)' },
    instruction: `# K-th Largest Element in a Stream

Design a class to find the k-th largest element in a stream.

Note that it is the k-th largest element in sorted order, not the k-th distinct element.

## Operations

\`\`\`python
KthLargest(k, nums)  # Initialize with k and starting array
add(val)             # Add value, return k-th largest
\`\`\`

## Example

\`\`\`
k = 3, nums = [4, 5, 8, 2]

add(3)  → returns 4   # Stream: [2,3,4,5,8], 3rd largest = 4
add(5)  → returns 5   # Stream: [2,3,4,5,5,8], 3rd largest = 5
add(10) → returns 5   # Stream: [2,3,4,5,5,8,10], 3rd largest = 5
add(9)  → returns 8   # Stream: [2,3,4,5,5,8,9,10], 3rd largest = 8
add(4)  → returns 8   # Stream: [2,3,4,4,5,5,8,9,10], 3rd largest = 8
\`\`\`

## Constraints

- 1 <= k <= 10^4
- 0 <= nums.length <= 10^4
- -10^4 <= val <= 10^4
- At most 10^4 calls to add

## Hidden Insight

Think about what you need to track. Do you need ALL elements?`,
    starterCode: `import heapq

class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        pass

    def add(self, val: int) -> int:
        pass`,
    hints: [
      { afterAttempt: 1, text: 'You only need to track the k largest elements seen so far.' },
      { afterAttempt: 2, text: 'Use a MIN-heap of size k. The root is the k-th largest!' },
      { afterAttempt: 3, text: 'When heap size > k, pop the smallest (which is NOT in top k).' }
    ],
    solution: {
      afterAttempt: 3,
      text: `import heapq

class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.heap = []  # Min-heap of size k

        for num in nums:
            self.add(num)

    def add(self, val: int) -> int:
        heapq.heappush(self.heap, val)

        # Keep only k largest
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)  # Remove smallest

        return self.heap[0]  # Root = k-th largest

# Key insight: Min-heap of size k
# - Contains k largest elements
# - Root = smallest of those k = k-th largest overall!`
    },
    solutionExplanation: `## Why Min-Heap of Size K?

**Intuition:** To find k-th largest, keep only the k largest elements.

**Min-heap property:** Root is smallest in heap.

**Combined:** Root of min-heap with k elements = k-th largest!

## Process

1. Push new element
2. If size > k, pop smallest (not in top k anyway)
3. Root is always k-th largest

## Complexity

- **Time:** O(log k) per add (heap ops on size k)
- **Space:** O(k) - only store k elements!

## Pattern: Bounded Heap

When asked for "k-th largest/smallest":
- K-th largest → min-heap of size k
- K-th smallest → max-heap of size k`,
    testCases: [
      { input: 'k=3, nums=[4,5,8,2], add(3)', expectedOutput: '4' },
      { input: 'k=1, nums=[], add(1)', expectedOutput: '1' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-k-smallest-stream',
    title: 'K Smallest Numbers Seen So Far',
    description: 'Track k smallest elements in a stream',
    targetComplexity: { time: 'O(log k) per add', space: 'O(k)' },
    instruction: `# K Smallest Numbers Seen So Far

Process a stream of integers. At any time, return the k smallest numbers seen so far.

## Operations

\`\`\`python
add(x)      # Add a number to the stream
smallest()  # Return list of k smallest (order doesn't matter)
\`\`\`

## Example

\`\`\`
k = 3

add(5)  → smallest() = [5]
add(2)  → smallest() = [2, 5]
add(8)  → smallest() = [2, 5, 8]
add(1)  → smallest() = [1, 2, 5]    # 8 pushed out!
add(9)  → smallest() = [1, 2, 5]    # 9 too large
add(3)  → smallest() = [1, 2, 3]    # 5 pushed out!
\`\`\`

## Constraints

- 1 <= k <= 10^5
- At most 10^5 calls

## Hidden Insight

This is the OPPOSITE of k-th largest. What heap type do you need?`,
    starterCode: `import heapq

class KSmallestTracker:
    def __init__(self, k: int):
        pass

    def add(self, x: int) -> None:
        pass

    def smallest(self) -> list[int]:
        pass`,
    hints: [
      { afterAttempt: 1, text: 'K largest uses min-heap. K smallest needs... ?' },
      { afterAttempt: 2, text: 'Use MAX-heap of size k. Root is largest of k smallest.' },
      { afterAttempt: 3, text: 'Python has no max-heap. Negate values! Push -x, return -heap[0].' }
    ],
    solution: {
      afterAttempt: 3,
      text: `import heapq

class KSmallestTracker:
    def __init__(self, k: int):
        self.k = k
        self.heap = []  # Max-heap (negated values)

    def add(self, x: int) -> None:
        if len(self.heap) < self.k:
            heapq.heappush(self.heap, -x)  # Negate for max-heap
        elif x < -self.heap[0]:  # Smaller than current max
            heapq.heapreplace(self.heap, -x)

    def smallest(self) -> list[int]:
        return [-val for val in self.heap]

# Key insight: Max-heap of size k
# - Contains k smallest elements
# - Root = largest of those = threshold for entry
# - If new element < root, it belongs in k smallest`
    },
    solutionExplanation: `## Why Max-Heap of Size K?

**K-th largest → min-heap** (root = k-th largest)
**K smallest → max-heap** (root = largest of k smallest = threshold)

## Max-Heap in Python

Python's heapq is min-heap only. Trick: negate values!
- Push -x (smaller becomes larger)
- Pop gives -smallest (which is largest original)

## Process

1. If heap not full, push
2. If x < root (x smaller than largest of k smallest), replace
3. Otherwise, ignore (x too large for k smallest)

## Complexity

- **Time:** O(log k) per add
- **Space:** O(k)`,
    testCases: [
      { input: 'k=3, add(5,2,8,1)', expectedOutput: '[1, 2, 5]' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-task-scheduler-priority',
    title: 'Task Scheduler by Priority',
    description: 'Execute tasks by priority with custom tie-breaking',
    targetComplexity: { time: 'O(log n) per op', space: 'O(n)' },
    instruction: `# Task Scheduler by Priority

Build a task scheduler where each task has a priority and an ID.

## Operations

\`\`\`python
addTask(priority, id)  # Add task with given priority and id
execute()              # Remove and return highest priority task's id
\`\`\`

## Priority Rules

1. **Higher priority number = more urgent**
2. **If priorities tie, smaller ID wins** (breaks ties)

## Example

\`\`\`
addTask(5, "email")
addTask(10, "deploy")
addTask(5, "backup")

execute()  → "deploy"   # Priority 10 (highest)
execute()  → "backup"   # Priority 5, ID "backup" < "email" alphabetically
execute()  → "email"    # Priority 5, remaining task
\`\`\`

## Constraints

- 1 <= priority <= 10^6
- IDs are unique strings
- At most 10^5 operations

## Hidden Insight

How do you make a heap respect TWO ordering criteria?`,
    starterCode: `import heapq

class TaskScheduler:
    def __init__(self):
        pass

    def addTask(self, priority: int, task_id: str) -> None:
        pass

    def execute(self) -> str:
        pass`,
    hints: [
      { afterAttempt: 1, text: 'Heap compares tuples element by element: (a, b) < (c, d) checks a first, then b.' },
      { afterAttempt: 2, text: 'For max-priority, negate: (-priority, id). Higher priority → smaller negative.' },
      { afterAttempt: 3, text: 'Tuple ordering: (-priority, id) gives max-priority first, then min-id for ties.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `import heapq

class TaskScheduler:
    def __init__(self):
        self.heap = []  # Min-heap of (-priority, id)

    def addTask(self, priority: int, task_id: str) -> None:
        # Negate priority for max-heap behavior
        # Tuple comparison: first by -priority, then by id
        heapq.heappush(self.heap, (-priority, task_id))

    def execute(self) -> str:
        if not self.heap:
            return None
        _, task_id = heapq.heappop(self.heap)
        return task_id

# Key insight: Tuple comparison for custom ordering
# (-10, "deploy") < (-5, "email") because -10 < -5
# (-5, "backup") < (-5, "email") because "backup" < "email"`
    },
    solutionExplanation: `## Custom Comparator via Tuples

Python's heapq compares tuples lexicographically:
\`(a1, a2) < (b1, b2)\` if \`a1 < b1\`, or \`a1 == b1\` and \`a2 < b2\`

## The Trick

Want: max-priority, then min-id for ties

Use tuple: \`(-priority, id)\`
- Negating priority: higher priority → smaller number → comes first
- ID unchanged: smaller ID wins when priorities equal

## Examples

\`(-10, "deploy")\` < \`(-5, "email")\` → deploy first (higher priority)
\`(-5, "backup")\` < \`(-5, "email")\` → backup first (same priority, smaller id)

## Complexity

- **Time:** O(log n) per operation
- **Space:** O(n) for storing all tasks`,
    testCases: [
      { input: 'addTask(5,"a"), addTask(10,"b"), execute()', expectedOutput: '"b"' }
    ],
    requiredForProgress: true
  },

  // ============================================================================
  // PHASE 2: Custom Ordering - Multi-key Priority & Lazy Deletion
  // ============================================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-k-closest-points',
    title: 'K Closest Points to Origin',
    description: 'Find k points closest to origin',
    targetComplexity: { time: 'O(n log k)', space: 'O(k)' },
    instruction: `# K Closest Points to Origin

Given an array of points where \`points[i] = [xi, yi]\`, return the \`k\` closest points to the origin \`(0, 0)\`.

Distance = sqrt(x² + y²), but you can compare x² + y² directly (no sqrt needed).

## Example

\`\`\`
Input: points = [[1,3], [-2,2], [5,8], [0,1]], k = 2
Output: [[0,1], [-2,2]]

Distances²: 1+9=10, 4+4=8, 25+64=89, 0+1=1
Sorted: [0,1]=1, [-2,2]=8, [1,3]=10, [5,8]=89
Closest 2: [[0,1], [-2,2]]
\`\`\`

## Constraints

- 1 <= k <= points.length <= 10^4
- -10^4 <= xi, yi <= 10^4

## Hidden Insight

Do you need to sort all points? What if k << n?`,
    starterCode: `import heapq

def kClosest(points: list[list[int]], k: int) -> list[list[int]]:
    pass`,
    hints: [
      { afterAttempt: 1, text: 'K closest = k smallest distances. What heap type for k smallest?' },
      { afterAttempt: 2, text: 'Max-heap of size k. If new point closer than farthest in heap, replace.' },
      { afterAttempt: 3, text: 'Push (-distance², point). Max-heap keeps k closest.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `import heapq

def kClosest(points: list[list[int]], k: int) -> list[list[int]]:
    # Max-heap of size k (negate distance for max-heap)
    heap = []

    for x, y in points:
        dist_sq = x*x + y*y

        if len(heap) < k:
            heapq.heappush(heap, (-dist_sq, [x, y]))
        elif dist_sq < -heap[0][0]:  # Closer than farthest in heap
            heapq.heapreplace(heap, (-dist_sq, [x, y]))

    return [point for _, point in heap]

# Alternative: Use nlargest (cleaner but same complexity)
def kClosest_alt(points, k):
    return heapq.nsmallest(k, points, key=lambda p: p[0]**2 + p[1]**2)`
    },
    solutionExplanation: `## Pattern: K Smallest via Max-Heap

Same as "K Smallest Numbers" but with custom key (distance²).

## Why Max-Heap?

- Track k closest (smallest distances)
- Max-heap root = farthest of the k closest
- If new point closer than root, replace

## No Sqrt Needed

Comparing distances: sqrt(a) < sqrt(b) iff a < b
So compare x² + y² directly!

## Complexity

- **Time:** O(n log k) - each point: O(log k) heap op
- **Space:** O(k)

Better than sorting O(n log n) when k << n!`,
    testCases: [
      { input: '[[1,3],[-2,2],[5,8],[0,1]], k=2', expectedOutput: '[[0,1],[-2,2]]' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-sliding-window-max',
    title: 'Sliding Window Maximum',
    description: 'Find max of each sliding window using heap',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Sliding Window Maximum

Given array \`nums\` and window size \`k\`, return the max of each sliding window.

## Example

\`\`\`
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3

Window [1,3,-1]    → max = 3
Window [3,-1,-3]   → max = 3
Window [-1,-3,5]   → max = 5
Window [-3,5,3]    → max = 5
Window [5,3,6]     → max = 6
Window [3,6,7]     → max = 7

Output: [3,3,5,5,6,7]
\`\`\`

## Constraints

- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4
- 1 <= k <= nums.length

## Hidden Insight

The heap max might be OUTSIDE the current window. How do you handle that?`,
    starterCode: `import heapq

def maxSlidingWindow(nums: list[int], k: int) -> list[int]:
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Use max-heap with (value, index) pairs.' },
      { afterAttempt: 2, text: 'Before using heap max, check if its index is in current window.' },
      { afterAttempt: 3, text: 'Lazy deletion: keep popping until max is in valid window range.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `import heapq

def maxSlidingWindow(nums: list[int], k: int) -> list[int]:
    result = []
    heap = []  # Max-heap: (-value, index)

    for i, num in enumerate(nums):
        heapq.heappush(heap, (-num, i))

        # Window starts at index k-1
        if i >= k - 1:
            # Lazy deletion: remove elements outside window
            while heap[0][1] <= i - k:
                heapq.heappop(heap)

            result.append(-heap[0][0])

    return result

# Key insight: Lazy deletion
# Don't remove elements when they leave window
# Just check index when accessing max`
    },
    solutionExplanation: `## Lazy Deletion Pattern

**Problem:** When window slides, old max might still be in heap.

**Solution:** Don't eagerly remove. Check index when accessing.

## Process

1. Push all elements with indices
2. Before using max, check if index in valid range [i-k+1, i]
3. Pop invalid elements (lazy deletion)

## Why Lazy?

- Removing arbitrary element from heap is O(n)
- Checking and lazy-popping is O(log n) amortized
- Each element pushed/popped at most once

## Complexity

- **Time:** O(n log n) - each element pushed/popped once
- **Space:** O(n) - heap might hold all elements

Note: Monotonic deque gives O(n), but heap approach is simpler to understand.`,
    testCases: [
      { input: '[1,3,-1,-3,5,3,6,7], k=3', expectedOutput: '[3,3,5,5,6,7]' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-smallest-range-k-lists',
    title: 'Smallest Range Covering K Lists',
    description: 'Find smallest range that includes one element from each list',
    targetComplexity: { time: 'O(n log k)', space: 'O(k)' },
    instruction: `# Smallest Range Covering K Lists

Given \`k\` sorted lists, find the smallest range \`[a, b]\` that includes at least one number from each list.

## Example

\`\`\`
Input: lists = [[4,10,15,24,26], [0,9,12,20], [5,18,22,30]]

Range [20,24] includes:
- 24 from list 0
- 20 from list 1
- 22 from list 2

Output: [20, 24]
\`\`\`

## Constraints

- 3 <= k <= 3500
- 1 <= lists[i].length <= 50
- All lists are sorted ascending

## Hidden Insight

At any moment, you need one element from each list. What determines the range size?`,
    starterCode: `import heapq

def smallestRange(lists: list[list[int]]) -> list[int]:
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Range = [min_element, max_element] across current picks from each list.' },
      { afterAttempt: 2, text: 'Use min-heap to track current minimum. Track maximum separately.' },
      { afterAttempt: 3, text: 'Advance the list that has current minimum. Update max if needed.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `import heapq

def smallestRange(lists: list[list[int]]) -> list[int]:
    # Heap: (value, list_idx, element_idx)
    heap = []
    current_max = float('-inf')

    # Initialize with first element from each list
    for i, lst in enumerate(lists):
        heapq.heappush(heap, (lst[0], i, 0))
        current_max = max(current_max, lst[0])

    result = [heap[0][0], current_max]

    while True:
        min_val, list_idx, elem_idx = heapq.heappop(heap)

        # Move to next element in that list
        if elem_idx + 1 == len(lists[list_idx]):
            break  # One list exhausted

        next_val = lists[list_idx][elem_idx + 1]
        heapq.heappush(heap, (next_val, list_idx, elem_idx + 1))
        current_max = max(current_max, next_val)

        # Update result if range is smaller
        if current_max - heap[0][0] < result[1] - result[0]:
            result = [heap[0][0], current_max]

    return result`
    },
    solutionExplanation: `## Key Insight

Range = max - min of current picks.

To minimize range:
1. Can't decrease max (already at minimum possible max)
2. Increase min → advance the list with minimum element

## Algorithm

1. Start with first element from each list
2. Track min (heap root) and max (separate variable)
3. Pop min, advance that list, update max
4. Update best range if improved
5. Stop when any list exhausted

## Why Heap?

Need to efficiently find minimum across k current elements.

## Complexity

- **Time:** O(n log k) where n = total elements
- **Space:** O(k) for heap`,
    testCases: [
      { input: '[[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]', expectedOutput: '[20, 24]' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-seat-reservation',
    title: 'Seat Reservation System',
    description: 'Manage seat reservations with efficient allocation',
    targetComplexity: { time: 'O(log n) per op', space: 'O(n)' },
    instruction: `# Seat Reservation System

Design a system for seat reservations. Seats are numbered \`1\` to \`n\`.

## Operations

\`\`\`python
SeatManager(n)   # Initialize with n seats
reserve()        # Reserve and return smallest available seat
unreserve(seat)  # Unreserve the given seat
\`\`\`

## Example

\`\`\`
manager = SeatManager(5)  # Seats: 1,2,3,4,5 available

manager.reserve()    → 1   # Returns 1, smallest available
manager.reserve()    → 2   # Returns 2
manager.unreserve(1)       # Seat 1 available again
manager.reserve()    → 1   # Returns 1 (smallest again!)
manager.reserve()    → 3   # Returns 3
\`\`\`

## Constraints

- 1 <= n <= 10^5
- At most 10^5 calls to reserve and unreserve
- unreserve is only called on reserved seats

## Hidden Insight

You need to track available seats and always get the smallest. What data structure?`,
    starterCode: `import heapq

class SeatManager:
    def __init__(self, n: int):
        pass

    def reserve(self) -> int:
        pass

    def unreserve(self, seatNumber: int) -> None:
        pass`,
    hints: [
      { afterAttempt: 1, text: 'Min-heap of available seats gives smallest in O(log n).' },
      { afterAttempt: 2, text: 'Initialize heap with all seats 1 to n.' },
      { afterAttempt: 3, text: 'reserve() = heappop(), unreserve(x) = heappush(x)' }
    ],
    solution: {
      afterAttempt: 3,
      text: `import heapq

class SeatManager:
    def __init__(self, n: int):
        # Min-heap of available seats
        self.available = list(range(1, n + 1))
        # Already a valid heap since sorted ascending

    def reserve(self) -> int:
        return heapq.heappop(self.available)

    def unreserve(self, seatNumber: int) -> None:
        heapq.heappush(self.available, seatNumber)

# Optimization: Lazy initialization
class SeatManagerOptimized:
    def __init__(self, n: int):
        self.available = []  # Start empty
        self.next_seat = 1   # Next sequential seat
        self.n = n

    def reserve(self) -> int:
        if self.available:
            return heapq.heappop(self.available)
        seat = self.next_seat
        self.next_seat += 1
        return seat

    def unreserve(self, seatNumber: int) -> None:
        heapq.heappush(self.available, seatNumber)`
    },
    solutionExplanation: `## Simple Approach

Initialize heap with all seats [1, 2, ..., n].
- reserve(): pop minimum
- unreserve(x): push x back

## Optimization: Lazy Initialization

Don't create all seats upfront!
- Track next_seat counter
- Only add to heap when unreserving
- reserve() checks heap first, then uses counter

## When Optimization Matters

If n = 10^5 but only 100 reservations, lazy is much better.

## Complexity

- **Time:** O(log n) per operation
- **Space:** O(n) worst case, but lazy uses O(reserved) typically`,
    testCases: [
      { input: 'SeatManager(5), reserve(), reserve(), unreserve(1), reserve()', expectedOutput: '1, 2, 1' }
    ],
    requiredForProgress: true
  },

  // ============================================================================
  // PHASE 3: Greedy + Heap Interaction
  // ============================================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-reorganize-string',
    title: 'Reorganize String',
    description: 'Rearrange characters so no two adjacent are equal',
    targetComplexity: { time: 'O(n log k)', space: 'O(k)' },
    instruction: `# Reorganize String

Rearrange the characters of string \`s\` so that no two adjacent characters are the same.

Return any valid arrangement, or "" if impossible.

## Example 1

\`\`\`
Input: s = "aab"
Output: "aba"
\`\`\`

## Example 2

\`\`\`
Input: s = "aaab"
Output: "" (impossible - too many 'a's)
\`\`\`

## Constraints

- 1 <= s.length <= 500
- s consists of lowercase English letters

## Hidden Insight

Which character should you place next? What happens after you place it?`,
    starterCode: `import heapq
from collections import Counter

def reorganizeString(s: str) -> str:
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Greedy: always place the most frequent character (if allowed).' },
      { afterAttempt: 2, text: 'After placing a character, it needs "cooldown" - can\'t use immediately.' },
      { afterAttempt: 3, text: 'Use max-heap. After popping, don\'t push back immediately - wait one turn.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `import heapq
from collections import Counter

def reorganizeString(s: str) -> str:
    counts = Counter(s)

    # Check if possible: max count <= (n+1)/2
    max_count = max(counts.values())
    if max_count > (len(s) + 1) // 2:
        return ""

    # Max-heap of (-count, char)
    heap = [(-count, char) for char, count in counts.items()]
    heapq.heapify(heap)

    result = []
    prev = None  # Previously used (on cooldown)

    while heap or prev:
        if prev and not heap:
            return ""  # Stuck with only cooldown char

        count, char = heapq.heappop(heap)
        result.append(char)

        # Put previous back (cooldown over)
        if prev:
            heapq.heappush(heap, prev)
            prev = None

        # If char has more uses, put on cooldown
        if count + 1 < 0:  # count is negative
            prev = (count + 1, char)

    return ''.join(result)`
    },
    solutionExplanation: `## Greedy Strategy

Always use the most frequent character that's not on cooldown.

## Cooldown Mechanism

After using a character:
1. Remove from heap
2. Don't push back immediately
3. Wait one turn (place another char)
4. Then push back with count-1

## Impossibility Check

If any character appears more than ⌈n/2⌉ times, impossible.
Example: "aaab" (4 chars, 'a' appears 3 times > 2)

## Why Max-Heap?

Need to efficiently find most frequent available character.

## Complexity

- **Time:** O(n log k) where k = unique chars (≤26)
- **Space:** O(k)`,
    testCases: [
      { input: '"aab"', expectedOutput: '"aba"' },
      { input: '"aaab"', expectedOutput: '""' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-cpu-task-scheduler',
    title: 'CPU Task Scheduler',
    description: 'Schedule tasks with cooldown constraint',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# CPU Task Scheduler

Given tasks (represented as letters) and cooldown \`n\`, find minimum time to complete all tasks.

Same task must have at least \`n\` intervals between executions.
CPU can be idle if needed.

## Example

\`\`\`
Input: tasks = ["A","A","A","B","B","B"], n = 2

One possible schedule:
A → B → idle → A → B → idle → A → B

Output: 8 intervals
\`\`\`

## Constraints

- 1 <= tasks.length <= 10^4
- tasks[i] is uppercase English letter
- 0 <= n <= 100

## Hidden Insight

What determines the minimum time? Think about the most frequent task.`,
    starterCode: `from collections import Counter

def leastInterval(tasks: list[str], n: int) -> int:
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Most frequent task creates "slots": task → n idle → task → n idle → ...' },
      { afterAttempt: 2, text: 'Other tasks fill the idle slots. Extra tasks extend beyond.' },
      { afterAttempt: 3, text: 'Formula: (max_count - 1) * (n + 1) + count_of_max_freq_tasks' }
    ],
    solution: {
      afterAttempt: 3,
      text: `from collections import Counter

def leastInterval(tasks: list[str], n: int) -> int:
    counts = Counter(tasks)
    max_count = max(counts.values())
    num_max = sum(1 for c in counts.values() if c == max_count)

    # Formula approach
    # Create (max_count - 1) groups of size (n + 1)
    # Plus final group with just the max-frequency tasks
    slots = (max_count - 1) * (n + 1) + num_max

    # If tasks don't fit in slots, we need len(tasks) time
    return max(slots, len(tasks))

# Visualization for ["A","A","A","B","B","B"], n=2:
# max_count = 3, num_max = 2 (both A and B appear 3 times)
# slots = (3-1) * (2+1) + 2 = 6 + 2 = 8
# A B _ | A B _ | A B
# ^^^^^   ^^^^^   ^^^
# group1  group2  final`
    },
    solutionExplanation: `## Key Insight

The most frequent task(s) determine the structure:
\`A _ _ A _ _ A\` for n=2

## Formula

1. Create (max_count - 1) groups of size (n + 1)
2. Final partial group has tasks with max frequency

slots = (max_count - 1) × (n + 1) + num_max_freq_tasks

## Edge Case

If total tasks > slots, no idle needed:
return max(slots, len(tasks))

## Why This Works

- Gaps ensure cooldown between same tasks
- Other tasks fill gaps
- If more tasks than gaps, they just extend the schedule

## Complexity

- **Time:** O(n) to count
- **Space:** O(1) (at most 26 different tasks)`,
    testCases: [
      { input: '["A","A","A","B","B","B"], n=2', expectedOutput: '8' },
      { input: '["A","A","A","B","B","B"], n=0', expectedOutput: '6' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-maximum-capital',
    title: 'IPO - Maximum Capital',
    description: 'Maximize capital by selecting projects strategically',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# IPO - Maximum Capital

You have initial capital \`w\`. Each project has \`(profit, capital_required)\`.

Select at most \`k\` projects to maximize final capital.

You can only start a project if you have enough capital. After completing, you gain the profit.

## Example

\`\`\`
k = 2, w = 0
profits = [1, 2, 3]
capital = [0, 1, 1]

Start with w=0:
- Can do project 0 (needs 0). Now w=1.
- Can do project 1 or 2 (both need 1). Pick 2 (profit 3). Now w=4.

Output: 4
\`\`\`

## Constraints

- 1 <= k <= 10^5
- 0 <= w <= 10^9
- profits.length == capital.length <= 10^5

## Hidden Insight

At each step, which projects can you do? Of those, which should you pick?`,
    starterCode: `import heapq

def findMaximizedCapital(k: int, w: int, profits: list[int], capital: list[int]) -> int:
    pass`,
    hints: [
      { afterAttempt: 1, text: 'At each step, you can do projects where capital_required <= current_w.' },
      { afterAttempt: 2, text: 'Of available projects, greedily pick highest profit.' },
      { afterAttempt: 3, text: 'Sort by capital. Use max-heap for available projects\' profits.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `import heapq

def findMaximizedCapital(k: int, w: int, profits: list[int], capital: list[int]) -> int:
    # Sort projects by capital requirement
    projects = sorted(zip(capital, profits))
    available = []  # Max-heap of profits (negated)
    i = 0

    for _ in range(k):
        # Add all projects we can now afford
        while i < len(projects) and projects[i][0] <= w:
            heapq.heappush(available, -projects[i][1])
            i += 1

        if not available:
            break  # No project affordable

        # Pick highest profit project
        w += -heapq.heappop(available)

    return w

# Key insight: Two-heap/sort pattern
# 1. Sort by requirement (what unlocks projects)
# 2. Max-heap by profit (greedy selection)`
    },
    solutionExplanation: `## Greedy Insight

At each step:
1. Find all affordable projects
2. Pick the one with highest profit
3. Gain capital, unlock more projects

## Implementation

1. Sort projects by capital requirement
2. As capital grows, add newly affordable projects to max-heap
3. Pop max profit, add to capital
4. Repeat k times

## Why Greedy Works

More capital → more options. Maximizing capital at each step maximizes future options.

## Complexity

- **Time:** O(n log n) for sorting + O(k log n) for heap ops
- **Space:** O(n) for heap`,
    testCases: [
      { input: 'k=2, w=0, profits=[1,2,3], capital=[0,1,1]', expectedOutput: '4' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-task-load-balancer',
    title: 'Task Load Balancer',
    description: 'Maximize tasks completed before deadlines',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Task Load Balancer

Each task has \`(duration, deadline)\`. You can only work on one task at a time.

Return maximum number of tasks that can be completed before their deadlines.

## Example

\`\`\`
tasks = [(2, 3), (1, 2), (3, 5)]
       # (duration, deadline)

Schedule: Do task 1 (dur=1, by time 1) ✓
          Do task 0 (dur=2, by time 3) ✓
          Do task 2 (dur=3, by time 6) ✗ deadline was 5

Output: 2
\`\`\`

## Constraints

- 1 <= tasks.length <= 10^5
- 1 <= duration, deadline <= 10^9

## Hidden Insight

If you've committed to some tasks but a new shorter task could replace a longer one, should you?`,
    starterCode: `import heapq

def maxTasks(tasks: list[tuple[int, int]]) -> int:
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Sort tasks by deadline. Try to include each task.' },
      { afterAttempt: 2, text: 'Track total time used. If exceeds deadline, need to drop a task.' },
      { afterAttempt: 3, text: 'Drop the longest task (max-heap of durations). This frees most time.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `import heapq

def maxTasks(tasks: list[tuple[int, int]]) -> int:
    # Sort by deadline
    tasks.sort(key=lambda x: x[1])

    heap = []  # Max-heap of durations (negated)
    total_time = 0

    for duration, deadline in tasks:
        heapq.heappush(heap, -duration)
        total_time += duration

        # If over deadline, drop longest task
        if total_time > deadline:
            longest = -heapq.heappop(heap)
            total_time -= longest

    return len(heap)

# Key insight: Greedy with regret
# Accept task, but "undo" if it causes problems`
    },
    solutionExplanation: `## Greedy with Regret

1. Sort by deadline (process in order)
2. Try to include each task
3. If total time > deadline, drop the longest task

## Why Drop Longest?

Dropping longest frees the most time, maximizing chance to fit more tasks.

## Why This Works

- Processing by deadline ensures we consider constraints in order
- Dropping longest is always optimal for fitting more tasks
- The dropped task might be the current one or an earlier one

## Complexity

- **Time:** O(n log n)
- **Space:** O(n) for heap`,
    testCases: [
      { input: '[(2,3),(1,2),(3,5)]', expectedOutput: '2' }
    ],
    requiredForProgress: true
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-merge-intervals-priority',
    title: 'Merge Intervals with Priority',
    description: 'Merge overlapping intervals keeping highest priority',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Merge Intervals with Priority

Given intervals with priorities, merge overlapping intervals keeping the highest priority.

## Example

\`\`\`
Input: intervals = [(1,5,1), (2,4,3), (6,8,2)]
       # (start, end, priority)

Overlapping: (1,5) and (2,4)
Priority 3 > Priority 1, so keep priority 3

Output: [(1,5,3), (6,8,2)]
\`\`\`

## Constraints

- 1 <= intervals.length <= 10^4
- 0 <= start < end <= 10^6
- 1 <= priority <= 10^6

## Hidden Insight

When intervals overlap, you need efficient access to the highest priority. What data structure gives O(1) access to the max?`,
    starterCode: `import heapq

def mergeWithPriority(intervals: list[tuple[int, int, int]]) -> list[tuple[int, int, int]]:
    # intervals = [(start, end, priority), ...]
    pass`,
    hints: [
      { afterAttempt: 1, text: 'Sort by start time. Track "active" intervals with a heap.' },
      { afterAttempt: 2, text: 'Max-heap by priority. When intervals end, remove from heap.' },
      { afterAttempt: 3, text: 'When a new interval starts, check if it overlaps active ones.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `import heapq

def mergeWithPriority(intervals: list[tuple[int, int, int]]) -> list[tuple[int, int, int]]:
    if not intervals:
        return []

    # Sort by start time
    intervals.sort(key=lambda x: x[0])

    result = []
    # Max-heap: (-priority, end, start, priority)
    active = []

    for start, end, priority in intervals:
        # Remove intervals that ended before this one starts
        while active and -active[0][1] < start:
            # Pop interval, record it
            neg_pri, neg_end, s, p = heapq.heappop(active)
            result.append((s, -neg_end, p))

        # Check for overlap with active intervals
        if active:
            # Merge: extend time range, keep max priority
            _, neg_end, s, p = active[0]
            new_end = max(-neg_end, end)
            new_pri = max(p, priority)
            new_start = min(s, start)
            heapq.heapreplace(active, (-new_pri, -new_end, new_start, new_pri))
        else:
            heapq.heappush(active, (-priority, -end, start, priority))

    # Drain remaining
    while active:
        neg_pri, neg_end, s, p = heapq.heappop(active)
        result.append((s, -neg_end, p))

    return result`
    },
    solutionExplanation: `## Strategy

1. **Sort by start time**
2. **Active heap**: Track overlapping intervals by priority
3. **Merge on overlap**: Combine time range, keep max priority

## Why Max-Heap?

When merging overlapping intervals, we need the highest priority quickly.

## Complexity

- **Time:** O(n log n) - sorting + heap operations
- **Space:** O(n) for heap and result`,
    testCases: [
      { input: '[(1,5,1), (2,4,3), (6,8,2)]', expectedOutput: '[(1,5,3), (6,8,2)]' }
    ],
    requiredForProgress: true
  },

  // ============================================================================
  // PHASE 4: Advanced - Complex Invariants
  // ============================================================================

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-median-absolute-deviation',
    title: 'Running Median Absolute Deviation',
    description: 'Track median and absolute deviation from median in a stream',
    targetComplexity: { time: 'O(log n) per op', space: 'O(n)' },
    instruction: `# Running Median Absolute Deviation

Implement a data structure that tracks:
1. The running median
2. The sum of absolute deviations from the median

## Operations

\`\`\`python
add(num)         # Add a number
getMedian()      # Return current median
getDeviation()   # Return sum of |xi - median| for all xi
\`\`\`

## Example

\`\`\`
add(1), add(3), add(5)
getMedian()      → 3
getDeviation()   → |1-3| + |3-3| + |5-3| = 2 + 0 + 2 = 4
\`\`\`

## Constraints

- At most 10^5 operations
- -10^5 <= num <= 10^5

## Hidden Insight

You already know two-heap for median. How can you track deviation sums efficiently?`,
    starterCode: `import heapq

class MedianDeviation:
    def __init__(self):
        pass

    def add(self, num: int) -> None:
        pass

    def getMedian(self) -> float:
        pass

    def getDeviation(self) -> float:
        pass`,
    hints: [
      { afterAttempt: 1, text: 'Use two heaps for median (small/large split).' },
      { afterAttempt: 2, text: 'Track sum of each heap. Deviation = sum_large - sum_small (adjusted for median).' },
      { afterAttempt: 3, text: 'When rebalancing, update sums accordingly.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `import heapq

class MedianDeviation:
    def __init__(self):
        self.small = []  # max-heap (negative values)
        self.large = []  # min-heap
        self.sum_small = 0
        self.sum_large = 0

    def add(self, num: int) -> None:
        # Add to appropriate heap
        if not self.small or num <= -self.small[0]:
            heapq.heappush(self.small, -num)
            self.sum_small += num
        else:
            heapq.heappush(self.large, num)
            self.sum_large += num

        # Rebalance
        if len(self.small) > len(self.large) + 1:
            val = -heapq.heappop(self.small)
            self.sum_small -= val
            heapq.heappush(self.large, val)
            self.sum_large += val
        elif len(self.large) > len(self.small):
            val = heapq.heappop(self.large)
            self.sum_large -= val
            heapq.heappush(self.small, -val)
            self.sum_small += val

    def getMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2

    def getDeviation(self) -> float:
        if not self.small:
            return 0

        median = self.getMedian()
        n_small = len(self.small)
        n_large = len(self.large)

        # Sum of |xi - median| for small heap: n_small * median - sum_small
        # Sum of |xi - median| for large heap: sum_large - n_large * median
        dev_small = n_small * median - self.sum_small
        dev_large = self.sum_large - n_large * median

        return dev_small + dev_large`
    },
    solutionExplanation: `## Two Heaps + Running Sums

### Median Tracking
- small (max-heap): numbers ≤ median
- large (min-heap): numbers > median
- Keep sizes balanced

### Deviation Tracking

Key insight: if we know the median and heap sums:
- For small heap: all values ≤ median, so |xi - median| = median - xi
- Sum = n_small × median - sum_small
- For large heap: all values > median, so |xi - median| = xi - median
- Sum = sum_large - n_large × median

### Maintaining Sums

When adding/rebalancing, update sum_small and sum_large accordingly.

## Complexity

- **add:** O(log n)
- **getMedian:** O(1)
- **getDeviation:** O(1)
- **Space:** O(n)`,
    testCases: [
      { input: 'add(1), add(3), add(5), getMedian(), getDeviation()', expectedOutput: '3.0, 4.0' }
    ],
    requiredForProgress: false
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-minimum-cost-hire-workers',
    title: 'Minimum Cost to Hire K Workers',
    description: 'Hire k workers with minimum total cost respecting wage ratios',
    targetComplexity: { time: 'O(n log n)', space: 'O(n)' },
    instruction: `# Minimum Cost to Hire K Workers

Each worker has \`quality[i]\` and \`minWage[i]\`.

Hire exactly k workers. Rules:
1. Every worker gets paid proportional to quality
2. Every worker gets at least their minimum wage

Minimize total cost.

## Example

\`\`\`
quality = [10, 20, 5], minWage = [70, 50, 30], k = 2

Worker ratios: 70/10=7, 50/20=2.5, 30/5=6

Pick workers 1,2 with ratio 6 (max of their ratios):
- Worker 1: 20 * 6 = 120 ✓ (>= 50)
- Worker 2: 5 * 6 = 30 ✓ (>= 30)
Total: 150

Output: 105.0 (there's a better combination)
\`\`\`

## Constraints

- 1 <= k <= n <= 10^4

## Hidden Insight

If you fix the "ratio" (wage per quality), how do you minimize cost?`,
    starterCode: `import heapq

def mincostToHireWorkers(quality: list[int], wage: list[int], k: int) -> float:
    pass`,
    hints: [
      { afterAttempt: 1, text: 'For a group, the ratio is determined by the worker with highest wage/quality.' },
      { afterAttempt: 2, text: 'Cost = ratio × total_quality. To minimize, want low ratio AND low total quality.' },
      { afterAttempt: 3, text: 'Sort by ratio. For each ratio, pick k workers with smallest qualities.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `import heapq

def mincostToHireWorkers(quality: list[int], wage: list[int], k: int) -> float:
    # Create (ratio, quality) pairs and sort by ratio
    workers = sorted(zip([w/q for w, q in zip(wage, quality)], quality))

    heap = []  # Max-heap of qualities (to remove largest)
    quality_sum = 0
    result = float('inf')

    for ratio, q in workers:
        heapq.heappush(heap, -q)
        quality_sum += q

        if len(heap) > k:
            quality_sum += heapq.heappop(heap)  # Remove largest (negative, so add)

        if len(heap) == k:
            result = min(result, ratio * quality_sum)

    return result

# Key insight:
# Cost = ratio × sum(qualities)
# For each ratio, want k smallest qualities`
    },
    solutionExplanation: `## Key Insight

In any valid group:
- Ratio = max(wage[i]/quality[i]) for workers in group
- Cost = ratio × sum(quality[i]) for workers in group

## Strategy

1. Sort workers by ratio
2. As we include each worker, that becomes the group's ratio
3. For fixed ratio, minimize cost by picking k workers with smallest quality
4. Use max-heap to track k smallest qualities

## Why Sort by Ratio?

When we process worker with ratio r:
- All previously seen workers have ratio ≤ r
- They're all valid at ratio r
- Pick k with smallest quality

## Complexity

- **Time:** O(n log n) for sorting + O(n log k) for heap
- **Space:** O(n)`,
    testCases: [
      { input: 'quality=[10,20,5], wage=[70,50,30], k=2', expectedOutput: '105.0' }
    ],
    requiredForProgress: false
  },

  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-dynamic-top-k-scoreboard',
    title: 'Dynamic Top-K Scoreboard',
    description: 'Track top k scores with updates',
    targetComplexity: { time: 'O(log n) per op', space: 'O(n)' },
    instruction: `# Dynamic Top-K Scoreboard

Build a scoreboard that tracks top k scores.

## Operations

\`\`\`python
add(player, score)  # Add or update player's score
top(k)              # Return top k scores (descending)
\`\`\`

## Example

\`\`\`
board = Scoreboard()
board.add("alice", 100)
board.add("bob", 80)
board.add("charlie", 90)
board.top(2)        → [100, 90]
board.add("alice", 85)  # Update alice's score
board.top(2)        → [90, 85]
\`\`\`

## Constraints

- Player names are unique
- Scores are positive integers
- At most 10^5 operations

## Hidden Insight

Updates are tricky with heaps. How do you handle score changes?`,
    starterCode: `import heapq

class Scoreboard:
    def __init__(self):
        pass

    def add(self, player: str, score: int) -> None:
        pass

    def top(self, k: int) -> list[int]:
        pass`,
    hints: [
      { afterAttempt: 1, text: 'Store current scores in a dict. Heap entries might be stale.' },
      { afterAttempt: 2, text: 'Lazy deletion: when popping, check if score matches current dict value.' },
      { afterAttempt: 3, text: 'For top(k), pop valid entries, collect k, then push back.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `import heapq

class Scoreboard:
    def __init__(self):
        self.scores = {}  # player -> current score
        self.heap = []    # max-heap: (-score, player)

    def add(self, player: str, score: int) -> None:
        self.scores[player] = score
        heapq.heappush(self.heap, (-score, player))
        # Note: old entry for player still in heap (lazy)

    def top(self, k: int) -> list[int]:
        result = []
        temp = []

        while self.heap and len(result) < k:
            neg_score, player = heapq.heappop(self.heap)
            score = -neg_score

            # Check if this entry is current (not stale)
            if player in self.scores and self.scores[player] == score:
                result.append(score)
                temp.append((neg_score, player))

        # Push valid entries back
        for item in temp:
            heapq.heappush(self.heap, item)

        return result

# Alternative: Use SortedList for O(log n) updates
# from sortedcontainers import SortedList`
    },
    solutionExplanation: `## Lazy Deletion Pattern

**Problem:** Updating a score means old entry is invalid, but removing from heap is O(n).

**Solution:** Don't remove! Just mark as stale.

## Staleness Check

Store current scores in dict.
When popping from heap, verify: \`scores[player] == heap_score\`
If not, entry is stale - skip it.

## top(k) Implementation

Pop entries, skip stale ones, collect k valid ones.
Push valid ones back (or track separately).

## Trade-offs

- add(): O(log n) but heap grows with stale entries
- top(): O(log n) amortized, might pop many stale entries
- Space: Could grow large with many updates

## Alternative

Use SortedList/TreeMap for true O(log n) updates without stale entries.

## Complexity

- **add:** O(log n)
- **top:** O(k log n) amortized
- **Space:** O(total operations) worst case`,
    testCases: [
      { input: 'add("a",100), add("b",80), top(2)', expectedOutput: '[100, 80]' }
    ],
    requiredForProgress: false
  }
];
