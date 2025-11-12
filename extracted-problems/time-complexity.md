# TIME-COMPLEXITY Problems

Total Problems: 14

---

## 1. Identify Time Complexity

**Difficulty:** easy
**Concept:** time-complexity

### Description

Analyze the following code and determine its time complexity. This nested loop performs an operation for every pair of elements.

### Examples

**Example 1:**
- Input: arr = [1, 2, 3]
- Output: Operations: 9 (3 × 3)
- Explanation: Doubling input size quadruples the operations!

**Example 2:**
- Input: arr = [1, 2, 3, 4]
- Output: Operations: 16 (4 × 4)
- Explanation: Notice how the operations grow quadratically

### Hints

1. The outer loop runs len(arr) times. Let's call this N.
2. For EACH outer iteration, the inner loop also runs N times. Total: N × N operations.
3. N × N = N². This is the classic O(N²) quadratic complexity pattern from nested loops.
4. The answer is C) O(N²). Nested loops where both depend on input size N result in quadratic complexity.

### Starter Code

### Solution

### Test Cases

**Test 1:** Small array
- Input: "mystery_function([1, 2, 3])"
- Expected: "36"

**Test 2:** Larger array
- Input: "mystery_function([1, 2, 3, 4])"
- Expected: "100"

**Test 3:** Identical elements
- Input: "mystery_function([2, 2, 2])"
- Expected: "36"

---

## 2. Optimize from O(N²) to O(N)

**Difficulty:** medium
**Concept:** time-complexity

### Description

The current two_sum_slow function uses nested loops and runs in O(N²) time. Optimize it to O(N) using a hash map to track seen numbers and their indices.

### Examples

**Example 1:**
- Input: arr = [2,7,11,15], target = 9
- Output: [0, 1]
- Explanation: Current O(N²): checks every pair (6 comparisons). Optimized O(N): uses hash map (4 lookups)

### Hints

1. Use a dictionary to store numbers you've seen: seen = {number: index}
2. For each number, calculate complement = target - number. Check if complement is in seen.
3. If complement exists, return [seen[complement], current_index]. Otherwise, store current number.
4. Hash map lookup is O(1), and we visit each element once, so total time is O(N).

### Starter Code

### Solution

### Test Cases

**Test 1:** Sum at start
- Input: "two_sum_fast([2, 7, 11, 15], 9)"
- Expected: "[0, 1]"

**Test 2:** Sum in middle
- Input: "two_sum_fast([3, 2, 4], 6)"
- Expected: "[1, 2]"

**Test 3:** Duplicate numbers
- Input: "two_sum_fast([3, 3], 6)"
- Expected: "[0, 1]"

---

## 3. Analyze Space Complexity

**Difficulty:** medium
**Concept:** time-complexity

### Description

Determine both TIME and SPACE complexity for each function. Remember: space includes variables, data structures, AND recursion stack depth!

### Examples

**Example 1:**
- Input: function1(5)
- Output: [0, 2, 4, 6, 8]
- Explanation: Creates array of N elements → O(N) space

**Example 2:**
- Input: function2(6)
- Output: 8
- Explanation: Recursion depth of N calls → O(N) space (even though time is O(2^N)!)

### Hints

1. Loop runs N times (O(N) time). Creates array with N elements (O(N) space).
2. Time: Each call makes 2 recursive calls → O(2^N) exponential. Space: Max recursion depth is N → O(N) stack space!
3. Time: Single loop with O(1) set operations → O(N). Space: Worst case stores N elements in set → O(N).
4. Space complexity for recursion = maximum call stack depth, NOT total number of calls!

### Starter Code

### Solution

### Test Cases

**Test 1:** Array creation
- Input: "function1(5)"
- Expected: "[0, 2, 4, 6, 8]"

**Test 2:** Fibonacci
- Input: "function2(6)"
- Expected: "8"

**Test 3:** Has duplicate
- Input: "function3([1,2,3,1])"
- Expected: "True"

---

## 4. Count Operations Exactly

**Difficulty:** easy
**Concept:** time-complexity

### Description

Count the EXACT number of primitive operations (assignments, comparisons, arithmetic) for different input sizes. Be precise - don't use Big O yet!

### Examples

**Example 1:**
- Input: n=3
- Output: 28 operations
- Explanation: i=0,1,2 (3 assignments), j=0,1,2 for each i (9 assignments), 9 comparisons (j < n), 9 additions (sum += i + j)

**Example 2:**
- Input: n=4
- Output: 49 operations
- Explanation: Operations grow quadratically

### Hints

1. Count: assignments (=), comparisons (<, >, ==), arithmetic (+, -, *, /).
2. Outer loop: n iterations. Inner loop: n iterations × n (for each outer) = n² total.
3. Each inner loop iteration: 1 loop var assignment + 2 operations (add + assign to sum).
4. Initial assignment: 1. Outer loop: n iterations. Inner: n² iterations × 3 ops each. Total ≈ 3n² + n + 1.

### Starter Code

### Solution

### Test Cases

**Test 1:** Small input
- Input: "count_operations(3)"
- Expected: "28"

**Test 2:** Medium input
- Input: "count_operations(4)"
- Expected: "49"

**Test 3:** Larger input
- Input: "count_operations(5)"
- Expected: "76"

---

## 5. Loop Complexity Patterns

**Difficulty:** easy
**Concept:** time-complexity

### Description

Identify the time complexity of various loop patterns. Pay attention to loop bounds and how they change!

### Examples

**Example 1:**
- Input: Pattern 1: for i in range(n)
- Output: O(n)
- Explanation: Single loop runs n times

**Example 2:**
- Input: Pattern 2: for i in range(n): for j in range(n)
- Output: O(n²)
- Explanation: Nested loops, both run n times

**Example 3:**
- Input: Pattern 3: while n > 0: n = n // 2
- Output: O(log n)
- Explanation: Divides by 2 each time

### Hints

1. Single loop from 0 to n → runs n times → O(n) linear.
2. Nested loops both n → n × n iterations → O(n²) quadratic.
3. Divides by 2 each time → log₂(n) iterations → O(log n) logarithmic.
4. Inner loop smaller but averages n/2 → still n × (n/2) → O(n²) quadratic!

### Starter Code

### Solution

### Test Cases

**Test 1:** Linear loop
- Input: "pattern1(5)"
- Expected: "0\n1\n2\n3\n4"

**Test 2:** Halving loop
- Input: "pattern3(8)"
- Expected: "8\n4\n2\n1"

**Test 3:** Triangle loop
- Input: "pattern4(3)"
- Expected: "1 0\n2 0\n2 1"

---

## 6. Best vs Worst Case Analysis

**Difficulty:** easy
**Concept:** time-complexity

### Description

Identify the best case, worst case, and average case time complexity for common algorithms. Understanding different cases is crucial!

### Examples

**Example 1:**
- Input: Linear Search - target is first element
- Output: Best: O(1)
- Explanation: Found immediately

**Example 2:**
- Input: Linear Search - target is last or not found
- Output: Worst: O(n)
- Explanation: Must check all elements

### Hints

1. Best case: target is first element → found in 1 comparison → O(1).
2. Worst case: target is last or not in array → check all n elements → O(n).
3. Best case: target is middle element → found immediately → O(1).
4. Worst case: must keep halving until 1 element left → log₂(n) divisions → O(log n).

### Starter Code

### Solution

### Test Cases

**Test 1:** Best case - first element
- Input: "linear_search([1,2,3,4,5], 1)"
- Expected: "0"

**Test 2:** Worst case - last element
- Input: "linear_search([1,2,3,4,5], 5)"
- Expected: "4"

**Test 3:** Best case - middle element
- Input: "binary_search([1,2,3,4,5], 3)"
- Expected: "2"

---

## 7. Nested Loop Triangle Pattern

**Difficulty:** medium
**Concept:** time-complexity

### Description

Analyze nested loops where the inner loop bound depends on the outer loop variable. Even though the inner loop runs fewer times, it's still quadratic!

### Examples

**Example 1:**
- Input: n=5
- Output: Triangle: 10, Reverse: 15
- Explanation: Triangle: 0+1+2+3+4 = 10. Reverse: 5+4+3+2+1 = 15. Both O(n²)

### Hints

1. triangle_loop: 0+1+2+...+(n-1) iterations. This is arithmetic series!
2. Sum of 0+1+2+...+(n-1) = n(n-1)/2 = (n² - n)/2.
3. (n² - n)/2 ≈ n²/2. Drop constants and lower terms → O(n²) quadratic!
4. reverse_triangle is also n+(n-1)+...+1 = n(n+1)/2 ≈ n²/2 → O(n²). Same complexity!

### Starter Code

### Solution

### Test Cases

**Test 1:** Sum: 0+1+2+3+4
- Input: "triangle_loop(5)"
- Expected: "10"

**Test 2:** Sum: 5+4+3+2+1
- Input: "reverse_triangle(5)"
- Expected: "15"

**Test 3:** Larger input
- Input: "triangle_loop(10)"
- Expected: "45"

---

## 8. Recursion Tree Analysis

**Difficulty:** medium
**Concept:** time-complexity

### Description

Analyze recursive algorithms by drawing their recursion tree. Count levels (depth) and nodes per level to determine time complexity.

### Examples

**Example 1:**
- Input: fibonacci_recursive(5)
- Output: 5
- Explanation: Binary recursion: f(n) = f(n-1) + f(n-2). Tree has depth n and ~2^n nodes total

### Hints

1. Each call makes 2 recursive calls → branching factor of 2. Tree grows exponentially!
2. Fibonacci depth is n. At level k, there are up to 2^k nodes. Total nodes ≈ 2^n.
3. Binary search makes only 1 call per level, halving each time. Depth = log₂(n).
4. Fibonacci: O(2^n) exponential - very slow! Binary search: O(log n) logarithmic - very fast!

### Starter Code

### Solution

### Test Cases

**Test 1:** Small fibonacci
- Input: "fibonacci_recursive(5)"
- Expected: "5"

**Test 2:** Larger fibonacci
- Input: "fibonacci_recursive(7)"
- Expected: "13"

**Test 3:** Binary search
- Input: "binary_search_recursive([1,2,3,4,5], 3, 0, 4)"
- Expected: "2"

---

## 9. Amortized Analysis - Dynamic Arrays

**Difficulty:** medium
**Concept:** time-complexity

### Description

Understand amortized complexity for dynamic array operations. Most appends are O(1), but occasionally we resize. What's the average cost?

### Examples

**Example 1:**
- Input: 16 appends to dynamic array
- Output: 47 total operations, ~3 per append
- Explanation: Capacity: 1→2→4→8→16. Resize costs: 1+2+4+8+16=31. Regular appends: 16. Total: 47. Average: 47/16 ≈ 3 = O(1) amortized!

### Hints

1. When array is full, create new array of double size and copy all elements.
2. Resize happens at sizes 1,2,4,8,16,... Cost to resize at size k is k (copy k elements).
3. For n appends: n (appends) + (1+2+4+8+...+n/2) (resizes) ≈ n + n = 2n operations.
4. Total 2n operations / n appends = 2 operations per append on average → O(1) amortized!

### Starter Code

### Solution

### Test Cases

**Test 1:** Total operations for 16 appends
- Input: "dynamic_array_append()"
- Expected: "47"

---

## 10. Data Structure Operations Comparison

**Difficulty:** medium
**Concept:** time-complexity

### Description

Compare time complexity of common operations across different data structures. Choose the right structure for your use case!

### Examples

**Example 1:**
- Input: Array access by index
- Output: O(1)
- Explanation: Direct memory address calculation

**Example 2:**
- Input: Hash Table operations
- Output: O(1) average
- Explanation: All operations average O(1): access, search, insert, delete

### Hints

1. Access by index: O(1) - direct memory address. Search: O(n) - may need to check all.
2. Append at end: O(1) amortized. Insert at beginning/middle: O(n) - must shift elements!
3. All operations O(1) average: access, search, insert, delete. Worst case O(n) due to collisions.
4. Array: fast access by index. Hash table: fast lookup by key. BST: ordered data. Heap: priority queue.

### Starter Code

### Solution

### Test Cases

**Test 1:** Array ops
- Input: "DataStructureComparison().array_operations()"
- Expected: "None"

**Test 2:** Hash ops
- Input: "DataStructureComparison().hash_table_operations()"
- Expected: "None"

---

## 11. Master Theorem for Divide-and-Conquer

**Difficulty:** hard
**Concept:** time-complexity

### Description

Apply the Master Theorem to determine complexity of divide-and-conquer algorithms. Formula: T(n) = aT(n/b) + f(n), where a = subproblems, b = division factor.

### Examples

**Example 1:**
- Input: Merge Sort: T(n) = 2T(n/2) + O(n)
- Output: O(n log n)
- Explanation: a=2 (2 subproblems), b=2 (divide by 2), f(n)=O(n) (merge cost)

**Example 2:**
- Input: Binary Search: T(n) = T(n/2) + O(1)
- Output: O(log n)
- Explanation: a=1, b=2, f(n)=O(1)

### Hints

1. T(n) = aT(n/b) + f(n), where a=subproblems, b=division, f(n)=outside work.
2. a=2 (two recursive calls), b=2 (divide in half), f(n)=O(n) (merge). Result: O(n log n).
3. a=1 (one recursive call), b=2 (divide in half), f(n)=O(1) (comparison). Result: O(log n).
4. Case 1: f(n) < n^log_b(a) → O(n^log_b(a)). Case 2: f(n) = n^log_b(a) → O(n^log_b(a) log n). Case 3: f(n) > n^log_b(a) → O(f(n)).

### Starter Code

### Solution

### Test Cases

**Test 1:** Merge sort
- Input: "merge_sort([3,1,4,1,5,9,2,6])"
- Expected: "[1, 1, 2, 3, 4, 5, 6, 9]"

**Test 2:** Binary search
- Input: "binary_search_recursive([1,2,3,4,5], 3, 0, 4)"
- Expected: "2"

---

## 12. Optimization Challenge: Multiple Approaches

**Difficulty:** hard
**Concept:** time-complexity

### Description

Solve the same problem using multiple techniques with different time/space tradeoffs: brute force O(n²), sorting O(n log n), and hash set O(n). Compare the tradeoffs!

### Examples

**Example 1:**
- Input: Problem: Check if array has duplicates
- Output: Brute Force: O(n²) time, O(1) space
Sorting: O(n log n) time, O(1) space
Hash Set: O(n) time, O(n) space
- Explanation: Each approach has different tradeoffs

### Hints

1. Nested loops check every pair: O(n²) time, O(1) space. Simple but slow for large arrays.
2. Sort array O(n log n), then check adjacent elements O(n). Total: O(n log n) time, O(1) or O(n) space depending on sort.
3. Single pass with set: O(n) time, O(n) space. Fastest but uses extra memory.
4. Brute: slowest but no extra space. Sort: balanced. Hash: fastest but uses memory. Choose based on constraints!

### Starter Code

### Solution

### Test Cases

**Test 1:** Has duplicate
- Input: "has_duplicate_brute([1,2,3,1])"
- Expected: "True"

**Test 2:** No duplicate
- Input: "has_duplicate_sort([1,2,3,4])"
- Expected: "False"

**Test 3:** Hash approach
- Input: "has_duplicate_hash([1,2,3,1])"
- Expected: "True"

---

## 13. Real Algorithm: Quick Sort Analysis

**Difficulty:** hard
**Concept:** time-complexity

### Description

Analyze Quick Sort's time complexity in best, average, and worst cases. Understand why pivot selection matters!

### Examples

**Example 1:**
- Input: Best/Average: balanced partitions
- Output: O(n log n)
- Explanation: Each partition roughly splits in half

**Example 2:**
- Input: Worst: already sorted with bad pivot
- Output: O(n²)
- Explanation: Pivot is always smallest/largest, partitions are 0 and n-1

### Hints

1. Pivot divides array evenly every time. Tree depth: log n. Work per level: n. Total: O(n log n).
2. Pivot is always smallest/largest. Partitions are 0 and n-1. Tree depth: n. Work per level: n. Total: O(n²)!
3. Even with random pivots, expected depth is O(log n). Average: O(n log n).
4. Random pivot: O(n log n) expected. Median-of-three: better worst case. First element: bad for sorted data.

### Starter Code

### Solution

### Test Cases

**Test 1:** Random order
- Input: "quick_sort([5,3,7,2,8,1,9])"
- Expected: "[1, 2, 3, 5, 7, 8, 9]"

**Test 2:** Already sorted
- Input: "quick_sort([1,2,3,4,5])"
- Expected: "[1, 2, 3, 4, 5]"

**Test 3:** Reverse sorted
- Input: "quick_sort([5,4,3,2,1])"
- Expected: "[1, 2, 3, 4, 5]"

---

## 14. Real Algorithm: Dijkstra's Shortest Path

**Difficulty:** hard
**Concept:** time-complexity

### Description

Analyze Dijkstra's algorithm complexity with different data structures. Heap vs array makes a huge difference!

### Examples

**Example 1:**
- Input: Graph with V vertices, E edges
- Output: With array: O(V²)
With min-heap: O(E log V)
- Explanation: For sparse graphs (E ≈ V): heap is much better! For dense graphs (E ≈ V²): both are similar

### Hints

1. Visit each vertex once: O(V). For each edge, update heap: O(E) updates × O(log V) per update.
2. Heap push/pop: O(log V). Total heap operations: O(E) times. Total: O(E log V).
3. Initialize: O(V). Process edges with heap: O(E log V). Total: O(V + E log V) = O(E log V) for connected graph.
4. Sparse (E ≈ V): O(V log V). Dense (E ≈ V²): O(V² log V). Array implementation: always O(V²).

### Starter Code

### Solution

### Test Cases

**Test 1:** Shortest paths from A
- Input: "dijkstra_with_heap(graph, 'A')"
- Expected: "{'A': 0, 'B': 1, 'C': 3, 'D': 4}"

---
