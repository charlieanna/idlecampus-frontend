# HEAPS Problems

Total Problems: 15

---

## 1. Heap Basics - Template Practice

**Difficulty:** easy
**Concept:** heaps
**Family:** heaps:kth-largest

### Description

🎯 GOAL: Master Python's heapq module - your interview secret weapon!

Python's heapq provides a MIN HEAP by default. Learn these core operations:
- heappush(heap, item) - Add element (O(log n))
- heappop(heap) - Remove & return smallest (O(log n))
- heapify(list) - Convert list to heap in-place (O(n))
- heap[0] - Peek at minimum (O(1))

⚠️ CRITICAL: For MAX HEAP, negate values!

📝 Implement find_kth_largest using a min heap of size k.

### Key Insight

Keep a min heap of k largest elements. The top is the kth largest!

### Examples

**Example 1:**
- Input: nums = [3,2,1,5,6,4], k = 2
- Output: 5
- Explanation: 2nd largest is 5. Heap maintains [5,6], top is kth largest

**Example 2:**
- Input: nums = [3,2,3,1,2,4,5,5,6], k = 4
- Output: 4
- Explanation: 4th largest is 4

### Hints

1. Create empty list: heap = []
2. Use heapq.heappush(heap, num) to add each number
3. If len(heap) > k, use heapq.heappop(heap) to remove smallest
4. After processing all numbers, heap[0] is the kth largest
5. Why? Heap contains k largest elements, smallest of these is kth largest!

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n log k) - n elements, heap size k
- **Space Complexity:** O(k) - heap stores k elements

### Test Cases

**Test 1:** Kth largest in unsorted array
- Input: "([3,2,1,5,6,4], 2)"
- Expected: "5"

**Test 2:** Handle duplicates
- Input: "([3,2,3,1,2,4,5,5,6], 4)"
- Expected: "4"

**Test 3:** Single element
- Input: "([1], 1)"
- Expected: "1"

**Test 4:** PERFORMANCE: 100K elements - Must use O(n log k) heap approach, not O(n log n) full sort
- Input: "(list(range(100000)), 5000)"
- Expected: "95000"

---

## 2. Last Stone Weight

**Difficulty:** easy
**Concept:** heaps
**Family:** heaps:max-heap-simulation

### Description

You have stones with different weights. Each turn:
- Pick the two heaviest stones (x and y, x ≤ y)
- If x == y, both stones destroyed
- If x != y, stone x destroyed, stone y becomes y-x

Return the weight of the last remaining stone (or 0 if none).

🎯 KEY INSIGHT: Need to repeatedly get MAX element → Use MAX HEAP!

⚠️ Python heapq is MIN heap. For MAX heap: negate values!

### Key Insight

Simulate the process with a max heap. Negate values for heapq!

### Examples

**Example 1:**
- Input: stones = [2,7,4,1,8,1]
- Output: 1
- Explanation: Smash 8 & 7 → 1. Then 4 & 2 → 2. Then 2 & 1 → 1. Then 1 & 1 → 0. Last: 1

### Hints

1. Create max heap: heap = [-stone for stone in stones], then heapify
2. Pop two stones: first = -heapq.heappop(heap) (negate to get positive)
3. If first != second, push difference: heapq.heappush(heap, -(first - second))
4. Continue while len(heap) > 1
5. Return -heap[0] if heap exists, else 0

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n log n) - n operations on heap
- **Space Complexity:** O(n) - heap stores all stones

### Test Cases

**Test 1:** Multiple rounds of smashing
- Input: "([2,7,4,1,8,1])"
- Expected: "1"

**Test 2:** Single stone
- Input: "([1])"
- Expected: "1"

**Test 3:** Two equal stones destroy each other
- Input: "([2,2])"
- Expected: "0"

---

## 3. Kth Smallest Element in Array

**Difficulty:** easy
**Concept:** heaps
**Family:** heaps:kth-smallest

### Description

Find the kth smallest element in an unsorted array.

🎯 PATTERN RECOGNITION:
- Kth LARGEST → Min heap of size k
- Kth SMALLEST → Max heap of size k

💡 WHY? For kth smallest, we maintain k smallest elements in a MAX heap.
The largest of these k smallest elements IS the kth smallest overall!

### Key Insight

Use max heap of size k. Keep k smallest elements, top is kth smallest.

### Examples

**Example 1:**
- Input: nums = [3,2,1,5,6,4], k = 2
- Output: 2
- Explanation: 2nd smallest is 2

### Hints

1. For kth SMALLEST, use MAX heap (negate values)
2. heapq.heappush(heap, -num) to add negated value
3. If len(heap) > k, pop to keep only k elements
4. heap[0] contains negated kth smallest, so return -heap[0]
5. Mirror image of kth largest problem!

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n log k)
- **Space Complexity:** O(k)

### Test Cases

**Test 1:** 2nd smallest
- Input: "([3,2,1,5,6,4], 2)"
- Expected: "2"

**Test 2:** 3rd smallest
- Input: "([7,10,4,3,20,15], 3)"
- Expected: "7"

**Test 3:** Single element
- Input: "([1], 1)"
- Expected: "1"

---

## 4. Top K Frequent Elements

**Difficulty:** medium
**Concept:** heaps
**Family:** heaps:top-k-frequency

### Description

Given an integer array and an integer k, return the k most frequent elements.

🎯 PATTERN: Top K problems → Heap!

💡 APPROACH:
1. Count frequencies (use dict/Counter)
2. Use MIN heap of size k to track k most frequent
3. Heap stores (frequency, element) tuples

⚠️ CRITICAL: We want TOP K (largest frequencies), so use MIN heap of size k!

### Key Insight

Count frequencies, then use min heap of size k with (freq, num) tuples.

### Examples

**Example 1:**
- Input: nums = [1,1,1,2,2,3], k = 2
- Output: [1,2]
- Explanation: 1 appears 3 times, 2 appears 2 times (most frequent)

**Example 2:**
- Input: nums = [1], k = 1
- Output: [1]
- Explanation: Only one element

### Hints

1. Use Counter from collections: count = Counter(nums)
2. Heap stores tuples: (frequency, number)
3. heappush((freq, num)) for each unique number
4. If len(heap) > k, heappop() removes smallest frequency
5. Extract: [num for freq, num in heap]

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n log k) - n unique elements, heap size k
- **Space Complexity:** O(n + k) - counter + heap

### Test Cases

**Test 1:** Top 2 frequent elements
- Input: "([1,1,1,2,2,3], 2)"
- Expected: "[1, 2]"

**Test 2:** Single element
- Input: "([1], 1)"
- Expected: "[1]"

**Test 3:** Top 2 with different frequencies
- Input: "([4,4,4,1,1,2], 2)"
- Expected: "[4, 1]"

**Test 4:** PERFORMANCE: 50K elements, 1K unique - Must use O(n log k) heap, not O(n log n) full sort
- Input: "([i % 1000 for i in range(50000)], 10)"
- Expected: "str(10) + \" elements\""

---

## 5. K Closest Points to Origin

**Difficulty:** medium
**Concept:** heaps
**Family:** heaps:k-closest

### Description

Given an array of points and integer k, return k closest points to origin (0,0).

Distance: sqrt(x² + y²), but we can compare x² + y² directly (no sqrt needed).

🎯 PATTERN: K closest (smallest distances) → MAX heap of size k!

💡 WHY MAX HEAP? We want k SMALLEST distances, so maintain max heap of size k.
The farthest of these k closest is at top - remove it if we find a closer point!

### Key Insight

Use max heap of size k with (-distance, point). Track k closest points.

### Examples

**Example 1:**
- Input: points = [[1,3],[-2,2]], k = 1
- Output: [[-2,2]]
- Explanation: Distance from origin: [1,3] = 10, [-2,2] = 8. Closest is [-2,2]

### Hints

1. Distance from origin: dist = x * x + y * y (no sqrt needed)
2. Use MAX heap: push (-dist, [x, y])
3. If len(heap) > k, pop to keep only k closest
4. Extract: [point for dist, point in heap]
5. Negating distance makes it a max heap!

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n log k)
- **Space Complexity:** O(k)

### Test Cases

**Test 1:** 1 closest point
- Input: "([[1,3],[-2,2]], 1)"
- Expected: "[[-2, 2]]"

**Test 2:** 2 closest points
- Input: "([[3,3],[5,-1],[-2,4]], 2)"
- Expected: "[[3, 3], [-2, 4]]"

---

## 6. Kth Smallest Element in Sorted Matrix

**Difficulty:** medium
**Concept:** heaps

### Description

Given an n x n matrix where rows and columns are sorted, find the kth smallest element.

🎯 PATTERN: Merge K sorted lists! Each row is a sorted list.

💡 APPROACH:
1. Min heap with (value, row, col)
2. Start with first element of each row
3. Pop smallest k times
4. When popping (val, r, c), push next element in that row (val, r, c+1)

### Key Insight

Treat each row as a sorted list. Use min heap to merge them.

### Examples

**Example 1:**
- Input: matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8
- Output: 13
- Explanation: Sorted elements: [1,5,9,10,11,12,13,13,15], 8th is 13

### Hints

1. Initialize heap with (matrix[r][0], r, 0) for each row
2. Pop k times in a loop
3. When you pop (val, r, c), check if c+1 < len(matrix[r])
4. If yes, push (matrix[r][c+1], r, c+1)
5. The kth popped value is the answer

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(k log n) - k pops, n rows in heap
- **Space Complexity:** O(n) - heap size

### Test Cases

**Test 1:** 8th smallest in 3x3 matrix
- Input: "([[1,5,9],[10,11,13],[12,13,15]], 8)"
- Expected: "13"

**Test 2:** 1x1 matrix
- Input: "([[-5]], 1)"
- Expected: "-5"

---

## 7. Find Median from Data Stream

**Difficulty:** hard
**Concept:** heaps
**Family:** heaps:two-heaps-median

### Description

Design a data structure that supports:
- addNum(num) - Add integer to stream
- findMedian() - Return median of all elements

🎯 KEY INSIGHT: Use TWO HEAPS!

💡 STRATEGY:
- MAX heap (left): stores smaller half
- MIN heap (right): stores larger half
- Balance: len(left) == len(right) OR len(left) == len(right) + 1

Median:
- If equal size: average of both tops
- If left larger: left.top

⚠️ Python heapq is MIN heap, negate for MAX heap (left side)!

### Key Insight

Two heaps: max heap for smaller half, min heap for larger half. Keep balanced!

### Examples

**Example 1:**
- Input: addNum(1), addNum(2), findMedian(), addNum(3), findMedian()
- Output: 1.5, 2.0
- Explanation: [1,2] → median 1.5. [1,2,3] → median 2.0

### Hints

1. left = [] (max heap, negate), right = [] (min heap)
2. Always add to left first: heappush(left, -num)
3. If left top > right top, move left top to right
4. Balance: left size should be equal to right or +1
5. Median: if left bigger, -left[0]. Else average of tops

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(log n) per addNum, O(1) for findMedian
- **Space Complexity:** O(n) - stores all numbers

### Test Cases

**Test 1:** Stream: 1,2 → median 1.5, then 1,2,3 → median 2.0
- Input: "[\"MedianFinder\",\"addNum\",\"addNum\",\"findMedian\",\"addNum\",\"findMedian\"],[[],[1],[2],[],[3],[]]"
- Expected: "[None, None, None, 1.5, None, 2.0]"

---

## 8. Merge K Sorted Lists

**Difficulty:** hard
**Concept:** heaps

### Description

Given k sorted linked lists, merge them into one sorted list.

🎯 PATTERN: Merge K sorted structures → Use MIN HEAP!

💡 APPROACH:
1. Min heap with (value, list_index, node)
2. Initialize with head of each list
3. Pop smallest, add to result
4. Push next node from same list

⚠️ For simplicity, we'll use lists instead of linked lists.

### Key Insight

Min heap with (value, list_idx, elem_idx). Always process smallest across all lists.

### Examples

**Example 1:**
- Input: lists = [[1,4,5],[1,3,4],[2,6]]
- Output: [1,1,2,3,4,4,5,6]
- Explanation: Merge all three sorted lists

### Hints

1. Initialize heap: for i, lst in enumerate(lists)
2. Push (lst[0], i, 0) if lst is not empty
3. Pop (val, list_idx, elem_idx)
4. Append val to result
5. If elem_idx + 1 < len(lists[list_idx]), push next element
6. Heap always contains smallest from each active list

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(N log k) - N total elements, k lists
- **Space Complexity:** O(k) - heap size

### Test Cases

**Test 1:** Merge 3 sorted lists
- Input: "([[1,4,5],[1,3,4],[2,6]])"
- Expected: "[1, 1, 2, 3, 4, 4, 5, 6]"

**Test 2:** Empty input
- Input: "([])"
- Expected: "[]"

**Test 3:** Single empty list
- Input: "([[]])"
- Expected: "[]"

---

## 9. Task Scheduler

**Difficulty:** medium
**Concept:** heaps

### Description

Given tasks and a cooldown period n, find minimum intervals needed to complete all tasks.

Rules:
- Same task must wait n intervals between executions
- Can execute different tasks or idle

🎯 PATTERN: Greedy scheduling → MAX HEAP for frequencies!

💡 APPROACH:
1. Count task frequencies
2. Max heap to always pick most frequent available task
3. Queue to track when tasks become available again
4. Process time slot by slot

### Key Insight

Use max heap for frequencies and queue for cooldown tracking. Process most frequent available task each interval.

### Examples

**Example 1:**
- Input: tasks = ["A","A","A","B","B","B"], n = 2
- Output: 8
- Explanation: A -> B -> idle -> A -> B -> idle -> A -> B

### Hints

1. Count frequencies: count = Counter(tasks)
2. Max heap: max_heap = [-freq for freq in count.values()]
3. Queue for cooldown: queue = deque() storing (freq, available_time)
4. Each time slot: pop from heap, decrement, add to queue if freq > 0
5. Check queue: if queue[0][1] == time, add back to heap
6. Continue while max_heap or queue has elements

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n) - process each time slot
- **Space Complexity:** O(26) - at most 26 unique tasks

### Test Cases

**Test 1:** Two tasks with cooldown 2
- Input: "([\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], 2)"
- Expected: "8"

**Test 2:** No cooldown needed
- Input: "([\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], 0)"
- Expected: "6"

**Test 3:** Multiple different tasks
- Input: "([\"A\",\"A\",\"A\",\"A\",\"A\",\"A\",\"B\",\"C\",\"D\",\"E\",\"F\",\"G\"], 2)"
- Expected: "16"

---

## 10. Find K Pairs with Smallest Sums

**Difficulty:** medium
**Concept:** heaps

### Description

Given two sorted arrays and integer k, find k pairs with smallest sums.

Pair (u, v) has sum = u + v.

🎯 PATTERN: Finding k smallest from combinations → MIN HEAP!

💡 APPROACH:
1. Min heap with (sum, i, j) where i is index in nums1, j in nums2
2. Start with (nums1[0] + nums2[0], 0, 0)
3. When popping (sum, i, j), add (nums1[i+1] + nums2[j]) and (nums1[i] + nums2[j+1])
4. Use set to avoid duplicates

### Key Insight

Min heap with (sum, i, j). Start with (0,0), expand by incrementing indices.

### Examples

**Example 1:**
- Input: nums1 = [1,7,11], nums2 = [2,4,6], k = 3
- Output: [[1,2],[1,4],[1,6]]
- Explanation: First 3 pairs with smallest sums

### Hints

1. Initialize: heap = [(nums1[0] + nums2[0], 0, 0)]
2. Use visited set: visited = {(0, 0)}
3. Pop (sum, i, j), add [nums1[i], nums2[j]] to result
4. Try pushing (i+1, j) if not visited and in bounds
5. Try pushing (i, j+1) if not visited and in bounds
6. Stop when k pairs found

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(k log k) - k pops and pushes
- **Space Complexity:** O(k) - heap and visited set

### Test Cases

**Test 1:** First 3 smallest pairs
- Input: "([1,7,11], [2,4,6], 3)"
- Expected: "[[1, 2], [1, 4], [1, 6]]"

**Test 2:** Handle duplicates
- Input: "([1,1,2], [1,2,3], 2)"
- Expected: "[[1, 1], [1, 1]]"

---

## 11. Meeting Rooms II

**Difficulty:** medium
**Concept:** heaps

### Description

Given meeting time intervals, find minimum number of conference rooms required.

🎯 PATTERN: Interval overlap counting → MIN HEAP for end times!

💡 APPROACH:
1. Sort intervals by start time
2. Min heap tracks end times of ongoing meetings
3. For each meeting:
   - Remove meetings that ended (heap[0] <= current start)
   - Add current meeting end time
   - Max heap size = max concurrent meetings = rooms needed

### Key Insight

Sort by start time. Use min heap for end times. Heap size = concurrent meetings.

### Examples

**Example 1:**
- Input: intervals = [[0,30],[5,10],[15,20]]
- Output: 2
- Explanation: At time 5-10, meetings [0,30] and [5,10] overlap. Need 2 rooms.

**Example 2:**
- Input: intervals = [[7,10],[2,4]]
- Output: 1
- Explanation: No overlap, 1 room sufficient

### Hints

1. Sort: intervals.sort(key=lambda x: x[0])
2. Initialize empty heap for end times
3. For each (start, end): if heap[0] <= start, pop (room freed)
4. Push current end time to heap
5. Final heap size = rooms needed
6. Why? Heap size = concurrent meetings at any moment

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n log n) - sorting + heap operations
- **Space Complexity:** O(n) - heap size

### Test Cases

**Test 1:** Two concurrent meetings max
- Input: "([[0,30],[5,10],[15,20]])"
- Expected: "2"

**Test 2:** No overlap
- Input: "([[7,10],[2,4]])"
- Expected: "1"

**Test 3:** Three meetings, two rooms needed
- Input: "([[1,5],[2,3],[4,6]])"
- Expected: "2"

---

## 12. Ugly Number II

**Difficulty:** medium
**Concept:** heaps

### Description

Ugly numbers are positive integers whose prime factors are only 2, 3, or 5.
Find the nth ugly number.

🎯 PATTERN: Generate sequence in order → MIN HEAP!

💡 APPROACH:
1. Min heap starts with 1
2. Pop smallest, multiply by 2, 3, 5 → push to heap
3. Use set to avoid duplicates
4. Pop n times, return nth number

### Key Insight

Generate ugly numbers in order using min heap. Each number generates 3 more (×2, ×3, ×5).

### Examples

**Example 1:**
- Input: n = 10
- Output: 12
- Explanation: First 10: [1, 2, 3, 4, 5, 6, 8, 9, 10, 12]

### Hints

1. Initialize: heap = [1], seen = {1}
2. Loop n times: ugly = heappop(heap)
3. For each factor in [2, 3, 5]:
4.   next_ugly = ugly * factor
5.   If next_ugly not in seen, add to both heap and seen
6. After n pops, ugly is the answer

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n log n) - n pops, each generates 3 pushes
- **Space Complexity:** O(n) - heap and set

### Test Cases

**Test 1:** 10th ugly number
- Input: "(10)"
- Expected: "12"

**Test 2:** First ugly number
- Input: "(1)"
- Expected: "1"

**Test 3:** 15th ugly number
- Input: "(15)"
- Expected: "24"

---

## 13. Relative Ranks

**Difficulty:** easy
**Concept:** heaps

### Description

Given scores, return ranks as strings. Top 3 get medals:
- 1st: "Gold Medal"
- 2nd: "Silver Medal"
- 3rd: "Bronze Medal"
- Others: rank as string (e.g., "4")

🎯 PATTERN: Need to process in sorted order → HEAP or sorting!

💡 APPROACH: Use max heap to process scores from highest to lowest.
Track original indices with (score, index) tuples.

### Key Insight

Max heap with (score, index). Pop to get ranks 1, 2, 3, etc.

### Examples

**Example 1:**
- Input: score = [5,4,3,2,1]
- Output: ["Gold Medal","Silver Medal","Bronze Medal","4","5"]
- Explanation: 5 is 1st, 4 is 2nd, 3 is 3rd, etc.

### Hints

1. Create heap: [(-s, i) for i, s in enumerate(score)]
2. heapify to create max heap
3. result = [''] * len(score)
4. medals = ['Gold Medal', 'Silver Medal', 'Bronze Medal']
5. Pop and assign: if rank <= 3, use medals[rank-1], else str(rank)
6. Store at original index: result[idx] = ...

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n log n) - heapify + n pops
- **Space Complexity:** O(n) - heap and result

### Test Cases

**Test 1:** Descending scores
- Input: "([5,4,3,2,1])"
- Expected: "[\"Gold Medal\", \"Silver Medal\", \"Bronze Medal\", \"4\", \"5\"]"

**Test 2:** Mixed order
- Input: "([10,3,8,9,4])"
- Expected: "[\"Gold Medal\", \"5\", \"Bronze Medal\", \"Silver Medal\", \"4\"]"

---

## 14. Smallest Range Covering K Lists

**Difficulty:** hard
**Concept:** heaps

### Description

Given k sorted lists, find the smallest range [a, b] that includes at least one number from each list.

🎯 PATTERN: Merge K sorted + range tracking → MIN HEAP + max tracking!

💡 APPROACH:
1. Min heap with (value, list_idx, elem_idx)
2. Track current maximum value across all lists
3. Range = [heap[0], current_max]
4. Pop smallest, add next from that list, update max
5. Track minimum range seen

⚠️ Range becomes invalid when a list is exhausted!

### Key Insight

Min heap + max tracking. Range = [min, max]. Update by moving smallest pointer.

### Examples

**Example 1:**
- Input: nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]
- Output: [20,24]
- Explanation: List1: 24, List2: 20, List3: 22. Range [20,24]

### Hints

1. Initialize heap with (nums[i][0], i, 0) for each list
2. Track current_max = max of all first elements
3. Range = [heap[0], current_max]
4. Pop min, check if next element exists in that list
5. If yes, push and update current_max
6. If no, break (can't maintain coverage)
7. Track smallest range seen

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n log k) - n total elements, k lists
- **Space Complexity:** O(k) - heap size

### Test Cases

**Test 1:** Smallest range covering all lists
- Input: "([[4,10,15,24,26],[0,9,12,20],[5,18,22,30]])"
- Expected: "[20, 24]"

**Test 2:** Identical lists
- Input: "([[1,2,3],[1,2,3],[1,2,3]])"
- Expected: "[1, 1]"

---

## 15. Kth Largest in Stream

**Difficulty:** easy
**Concept:** heaps

### Description

Design a class to find kth largest element in a stream.

KthLargest(k, nums) - Initialize with k and initial array
add(val) - Add val to stream, return kth largest

🎯 PATTERN: Maintain k largest elements → MIN HEAP of size k!

💡 WHY? We only care about k largest. Min heap of size k means:
- Top element = kth largest
- Add: if new > top, replace
- No need to track all elements!

### Key Insight

Min heap of size k. Top element is always kth largest!

### Examples

**Example 1:**
- Input: KthLargest(3, [4,5,8,2]), add(3), add(5), add(10)
- Output: [4, 5, 5]
- Explanation: After adding 3: [5,4,3] → 3rd=4. Adding 5: [5,5,4] → 3rd=5. Adding 10: [10,5,5] → 3rd=5

### Hints

1. Store k: self.k = k
2. Initialize heap: self.heap = []
3. In __init__, add all nums using heappush
4. Keep heap size <= k by popping when size > k
5. In add(), same logic: push, pop if needed, return heap[0]
6. heap[0] is always kth largest when heap size = k

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(log k) per add operation
- **Space Complexity:** O(k) - heap stores k elements

### Test Cases

**Test 1:** Kth largest updates as elements added
- Input: "[\"KthLargest\",\"add\",\"add\",\"add\",\"add\",\"add\"],[[3,[4,5,8,2]],[3],[5],[10],[9],[4]]"
- Expected: "[None, 4, 5, 5, 8, 8]"

---
