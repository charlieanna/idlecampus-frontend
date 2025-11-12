# SORTING Problems

Total Problems: 13

---

## 1. Sort Array with Custom Comparator

**Difficulty:** easy
**Concept:** sorting
**Family:** sorting:custom-comparator

### Description

Sort an array of strings by length (ascending). If two strings have the same length, sort them alphabetically.

🎯 KEY INSIGHT: Python's sort is stable and allows custom key functions!

💡 PATTERN: Use key parameter or custom comparison.

### Key Insight

Use sorted() with custom key: (len(s), s) creates tuple for comparison.

### Examples

**Example 1:**
- Input: words = ["apple", "pie", "banana", "cat"]
- Output: ["cat", "pie", "apple", "banana"]
- Explanation: Length 3: cat, pie (alphabetical). Length 5: apple. Length 6: banana

### Hints

1. sorted() with key parameter lets you define comparison
2. Key can be a tuple: (len(s), s)
3. Python compares tuples element-wise: first by length, then by string
4. This is stable - preserves order for equal keys

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n log n)
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** Sort by length then alphabetically
- Input: "([\"apple\", \"pie\", \"banana\", \"cat\"])"
- Expected: "[\"cat\", \"pie\", \"apple\", \"banana\"]"

**Test 2:** Same lengths sorted alphabetically
- Input: "([\"z\", \"a\", \"zz\", \"aa\"])"
- Expected: "[\"a\", \"z\", \"aa\", \"zz\"]"

---

## 2. Kth Largest Element (Quickselect)

**Difficulty:** medium
**Concept:** sorting
**Family:** sorting:quickselect-kth

### Description

Find the kth largest element in an unsorted array using Quickselect algorithm.

🎯 PATTERN: Like quicksort but only recurse on one side!

💡 KEY INSIGHT: Partitioning puts pivot in final position. If it's position k, done! Otherwise search left or right.

Time: Average O(n), Worst O(n²)

### Key Insight

Partition array. If pivot is at k, done. Otherwise recurse on correct half.

### Examples

**Example 1:**
- Input: nums = [3,2,1,5,6,4], k = 2
- Output: 5
- Explanation: 2nd largest is 5

### Hints

1. Kth largest = index k-1 when sorted in descending order
2. Partition in descending order (nums[j] >= pivot)
3. If pivot_idx == k-1, found it!
4. If pivot_idx < k-1, search right. Else search left
5. Average O(n): n + n/2 + n/4 + ... = 2n

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n) average, O(n²) worst
- **Space Complexity:** O(1)

### Test Cases

**Test 1:** 2nd largest
- Input: "([3,2,1,5,6,4], 2)"
- Expected: "5"

**Test 2:** 4th largest with duplicates
- Input: "([3,2,3,1,2,4,5,5,6], 4)"
- Expected: "4"

---

## 3. Sort Colors (Dutch National Flag)

**Difficulty:** medium
**Concept:** sorting
**Family:** sorting:dutch-flag

### Description

Given array with values 0, 1, 2 (red, white, blue), sort in-place so all 0s come first, then 1s, then 2s.

🎯 PATTERN: Counting sort variant for 3 values!

💡 ONE-PASS SOLUTION: Use three pointers - low, mid, high.

Constraint: Must do in one pass, O(1) space.

### Key Insight

Three pointers: low (next 0 position), mid (current), high (next 2 position).

### Examples

**Example 1:**
- Input: nums = [2,0,2,1,1,0]
- Output: [0,0,1,1,2,2]
- Explanation: All 0s first, then 1s, then 2s

### Hints

1. Initialize: low=0, mid=0, high=len(nums)-1
2. Invariant: [0..low) are 0s, [low..mid) are 1s, (high..end] are 2s
3. When see 0: swap to low position, advance low and mid
4. When see 1: just advance mid
5. When see 2: swap to high position, decrease high only
6. Why not advance mid when swapping with high? Unknown value coming from right!

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n) - one pass
- **Space Complexity:** O(1) - in place

### Test Cases

**Test 1:** Mixed colors
- Input: "([2,0,2,1,1,0])"
- Expected: "[0,0,1,1,2,2]"

**Test 2:** One of each
- Input: "([2,0,1])"
- Expected: "[0,1,2]"

---

## 4. Merge K Sorted Lists

**Difficulty:** hard
**Concept:** sorting
**Family:** sorting:merge-k-lists

### Description

Merge k sorted linked lists and return as one sorted list.

🎯 PATTERN: Use min heap to track smallest element from each list!

💡 APPROACH:
1. Initialize heap with head of each list
2. Pop smallest, add to result
3. Push next node from that list

Time: O(N log k) where N = total nodes, k = number of lists

### Key Insight

Min heap always contains smallest element from each active list.

### Examples

**Example 1:**
- Input: lists = [[1,4,5],[1,3,4],[2,6]]
- Output: [1,1,2,3,4,4,5,6]
- Explanation: Merge all three sorted lists

### Hints

1. Heap stores tuples: (value, list_index, element_index)
2. Initialize: push first element of each non-empty list
3. Pop smallest value
4. If that list has more elements, push next one
5. Heap size stays at most k

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(N log k) - N total elements, k lists
- **Space Complexity:** O(k) - heap size

### Test Cases

**Test 1:** Merge 3 sorted lists
- Input: "([[1,4,5],[1,3,4],[2,6]])"
- Expected: "[1,1,2,3,4,4,5,6]"

**Test 2:** Single empty list
- Input: "([[]])"
- Expected: "[]"

---

## 5. Sort Array by Frequency

**Difficulty:** medium
**Concept:** sorting

### Description

Sort array by frequency of elements (descending). If two elements have same frequency, sort them by value (ascending).

🎯 PATTERN: Count frequencies, then custom sort!

Example: [1,1,2,2,2,3] → [2,2,2,1,1,3]
- 2 appears 3 times
- 1 appears 2 times  
- 3 appears 1 time

### Key Insight

Count with Counter, sort by (-frequency, value) tuple.

### Examples

**Example 1:**
- Input: nums = [1,1,2,2,2,3]
- Output: [2,2,2,1,1,3]
- Explanation: 2 appears most (3x), then 1 (2x), then 3 (1x)

### Hints

1. Use Counter to count frequencies
2. Key function: lambda x: (-count[x], x)
3. Negative frequency sorts descending
4. Value sorts ascending for ties

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n log n)
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** Sort by frequency
- Input: "([1,1,2,2,2,3])"
- Expected: "[2,2,2,1,1,3]"

**Test 2:** Ties broken by value
- Input: "([2,3,1,3,2])"
- Expected: "[2,2,3,3,1]"

---

## 6. Largest Number from Array

**Difficulty:** medium
**Concept:** sorting

### Description

Given list of non-negative integers, arrange them to form the largest number.

🎯 PATTERN: Custom comparator - which concatenation is larger?

Example: [3, 30, 34, 5, 9]
Compare: "3" + "30" vs "30" + "3" → "330" vs "303" → use "3" first
Result: "9534330"

⚠️ Edge case: If all zeros, return "0" not "000"

### Key Insight

Sort by comparing concatenations: if a+b > b+a, then a comes first.

### Examples

**Example 1:**
- Input: nums = [3,30,34,5,9]
- Output: "9534330"
- Explanation: Largest possible number formed

**Example 2:**
- Input: nums = [0,0]
- Output: "0"
- Explanation: All zeros edge case

### Hints

1. Convert numbers to strings
2. Compare concatenations: a+b vs b+a
3. Use cmp_to_key from functools
4. Join sorted strings
5. Edge case: if result starts with 0, return "0"

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n log n)
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** Form largest number
- Input: "([3,30,34,5,9])"
- Expected: "\"9534330\""

**Test 2:** All zeros
- Input: "([0,0])"
- Expected: "\"0\""

---

## 7. Sort Nearly Sorted Array

**Difficulty:** easy
**Concept:** sorting

### Description

Given an array where each element is at most k positions away from its sorted position, sort it efficiently.

🎯 PATTERN: Insertion sort excels for nearly-sorted data!

💡 ALTERNATIVE: Min heap of size k+1.

Example: k=3, arr=[6,5,3,2,8,10,9]
- 6 can only be in positions 0-3 of sorted array
- Use insertion sort or heap

For this problem, use insertion sort - it's O(nk) which is O(n) when k is small.

### Key Insight

Insertion sort is optimal for nearly-sorted arrays - O(n) when k is constant.

### Examples

**Example 1:**
- Input: nums = [6,5,3,2,8,10,9], k = 3
- Output: [2,3,5,6,8,9,10]
- Explanation: Each element at most 3 positions away from final position

### Hints

1. Insertion sort is perfect for nearly-sorted arrays
2. Each element only needs to move at most k positions
3. Time: O(nk) which is O(n) when k is constant
4. Can also use min heap of size k+1 for same complexity

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(nk) - O(n) when k is small constant
- **Space Complexity:** O(1)

### Test Cases

**Test 1:** Nearly sorted with k=3
- Input: "([6,5,3,2,8,10,9], 3)"
- Expected: "[2,3,5,6,8,9,10]"

**Test 2:** Nearly sorted with k=2
- Input: "([1,4,5,2,3,7,8,6,10,9], 2)"
- Expected: "[1,2,3,4,5,6,7,8,9,10]"

---

## 8. Find Median in Data Stream

**Difficulty:** hard
**Concept:** sorting

### Description

Implement data structure to find median from data stream:
- addNum(num): Add integer to stream
- findMedian(): Return median of all elements

🎯 PATTERN: Two heaps - max heap (lower half), min heap (upper half)!

This uses heap concepts from Chapter 12.

Balance: len(left) == len(right) OR len(left) == len(right) + 1

### Key Insight

Two heaps keep lower/upper halves balanced. Median is always accessible at tops.

### Examples

**Example 1:**
- Input: addNum(1), addNum(2), findMedian(), addNum(3), findMedian()
- Output: 1.5, 2.0
- Explanation: [1,2] → median 1.5. [1,2,3] → median 2.0

### Hints

1. left = max heap (negate), right = min heap
2. Always add to left first
3. Balance: if left top > right top, move to right
4. Maintain: len(left) in {len(right), len(right)+1}
5. Median: if left bigger, -left[0]. Else average of tops

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(log n) per add, O(1) for median
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** Stream: 1,2 → 1.5, then 3 → 2.0
- Input: "[\"MedianFinder\",\"addNum\",\"addNum\",\"findMedian\",\"addNum\",\"findMedian\"],[[],[1],[2],[],[3],[]]"
- Expected: "[null,null,null,1.5,null,2.0]"

---

## 9. Wiggle Sort

**Difficulty:** medium
**Concept:** sorting

### Description

Reorder array such that nums[0] <= nums[1] >= nums[2] <= nums[3]...

🎯 PATTERN: Simple swap-based approach!

💡 ONE-PASS: For each odd index, ensure it's a peak.

Example: [3,5,2,1,6,4] → [3,5,1,6,2,4]

### Key Insight

For odd indices, ensure nums[i] >= nums[i-1] and nums[i] >= nums[i+1] by swapping.

### Examples

**Example 1:**
- Input: nums = [3,5,2,1,6,4]
- Output: [3,5,1,6,2,4]
- Explanation: 3<=5>=1<=6>=2<=4 satisfies wiggle pattern

### Hints

1. Iterate through odd indices (1, 3, 5, ...)
2. These should be peaks (>= neighbors)
3. If nums[i] < nums[i-1], swap them
4. If nums[i] < nums[i+1], swap them
5. One pass, O(n) time, O(1) space

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

### Test Cases

**Test 1:** Create wiggle pattern
- Input: "([3,5,2,1,6,4])"
- Expected: "[3,5,1,6,2,4]"

**Test 2:** Ascending to wiggle
- Input: "([1,2,3,4,5])"
- Expected: "[1,3,2,5,4]"

---

## 10. Sort Characters by Frequency

**Difficulty:** medium
**Concept:** sorting

### Description

Sort characters in string by frequency (descending). If same frequency, order doesn't matter.

🎯 PATTERN: Count frequencies, sort by frequency!

Example: "tree" → "eetr" or "eert"
- e appears 2 times
- t, r each appear 1 time

### Key Insight

Count with Counter, sort by frequency descending, reconstruct string.

### Examples

**Example 1:**
- Input: s = "tree"
- Output: "eert"
- Explanation: e appears twice, others once

**Example 2:**
- Input: s = "cccaaa"
- Output: "cccaaa" or "aaaccc"
- Explanation: Both c and a appear 3 times

### Hints

1. Count with Counter(s)
2. count.items() gives (char, frequency) pairs
3. Sort by -frequency for descending
4. Multiply char by its frequency: char * freq
5. Join all together

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n log n)
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** e most frequent
- Input: "(\"tree\")"
- Expected: "\"eert\""

**Test 2:** Same frequency - any order OK
- Input: "(\"cccaaa\")"
- Expected: "\"aaaccc\""

---

## 11. Meeting Rooms (Can Attend All)

**Difficulty:** easy
**Concept:** sorting

### Description

Given array of meeting time intervals [[start, end]], determine if person can attend all meetings (no overlaps).

🎯 PATTERN: Sort by start time, check for overlaps!

💡 KEY: After sorting, only need to check consecutive meetings.

Example: [[0,30],[5,10],[15,20]] → False (overlaps at 5-10 and 15-20 with 0-30)

### Key Insight

Sort by start time. If any meeting starts before previous ends, overlap exists.

### Examples

**Example 1:**
- Input: intervals = [[0,30],[5,10],[15,20]]
- Output: False
- Explanation: Cannot attend [5,10] and [15,20] while in [0,30]

**Example 2:**
- Input: intervals = [[7,10],[2,4]]
- Output: True
- Explanation: No overlaps after sorting: [2,4] then [7,10]

### Hints

1. Sort intervals by start time
2. Compare consecutive meetings
3. If intervals[i][0] < intervals[i-1][1], they overlap
4. Only need to check adjacent meetings after sorting

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n log n) - dominated by sorting
- **Space Complexity:** O(1) - excluding sort space

### Test Cases

**Test 1:** Overlapping meetings
- Input: "([[0,30],[5,10],[15,20]])"
- Expected: "False"

**Test 2:** No overlap
- Input: "([[7,10],[2,4]])"
- Expected: "True"

---

## 12. Sort Array by Parity

**Difficulty:** easy
**Concept:** sorting

### Description

Sort array so all even integers come before odd integers. Order within even/odd doesn't matter.

🎯 PATTERN: Two-pointer partitioning (like quicksort partition)!

💡 IN-PLACE: Use two pointers to partition in one pass.

Example: [3,1,2,4] → [2,4,3,1] or [4,2,1,3]

### Key Insight

Use two pointers: left finds odd, right finds even, swap them.

### Examples

**Example 1:**
- Input: nums = [3,1,2,4]
- Output: [2,4,3,1]
- Explanation: All evens before odds

### Hints

1. Two pointers: left=0, right=len(nums)-1
2. Left finds odd: nums[left] % 2 == 1
3. Right finds even: nums[right] % 2 == 0
4. Swap them and move both pointers
5. Similar to partition in quicksort!

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

### Test Cases

**Test 1:** Evens before odds
- Input: "([3,1,2,4])"
- Expected: "[4,2,1,3]"

**Test 2:** Single element
- Input: "([0])"
- Expected: "[0]"

---

## 13. Sort Array (All Algorithms Practice)

**Difficulty:** medium
**Concept:** sorting

### Description

Implement multiple sorting algorithms for the same problem.

Given an unsorted array, sort it using different algorithms:
1. Merge Sort
2. Quick Sort
3. Heap Sort
4. For small arrays (n<10): Insertion Sort

This is a comprehensive practice problem to master all sorting techniques.

### Key Insight

Each algorithm has tradeoffs. Choose based on: size, memory, stability needs.

### Examples

**Example 1:**
- Input: nums = [5,2,3,1]
- Output: [1,2,3,5]
- Explanation: Sorted in ascending order

### Hints

1. For n < 10, insertion sort is fastest in practice
2. For larger arrays, merge sort guarantees O(n log n)
3. Quick sort is fastest on average but not guaranteed
4. Heap sort if memory is extremely limited
5. Python's sorted() uses Timsort (merge + insertion hybrid)

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n log n) for merge sort, O(n²) for insertion sort
- **Space Complexity:** O(n) for merge sort, O(1) for insertion sort

### Test Cases

**Test 1:** Small array
- Input: "([5,2,3,1])"
- Expected: "[1,2,3,5]"

**Test 2:** With duplicates
- Input: "([5,1,1,2,0,0])"
- Expected: "[0,0,1,1,2,5]"

---
