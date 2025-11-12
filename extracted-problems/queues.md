# QUEUES Problems

Total Problems: 20

---

## 1. Implement Queue using Stacks

**Difficulty:** easy
**Concept:** queues
**Family:** queues:two-stacks-queue

### Description

Implement a queue using only two stacks. Your queue should support push (enqueue), pop (dequeue), peek (get front), and empty operations.

### Examples

**Example 1:**
- Input: push(1), push(2), peek(), pop(), empty()
- Output: 1, 1, false
- Explanation: After push(1) and push(2), peek() returns 1. After pop(), queue has one element so empty() returns false.

### Hints

1. Use stack_in for push operations and stack_out for pop/peek. Initialize both as empty lists.
2. For push, just append to stack_in. The magic happens during pop/peek.
3. For pop/peek, if stack_out is empty, transfer all elements from stack_in by popping and pushing. Then operate on stack_out.

### Starter Code

### Solution

### Test Cases

**Test 1:** Peek returns first element
- Input: "push(1), push(2), peek()"
- Expected: "1"

**Test 2:** Pop returns and removes first
- Input: "push(1), push(2), pop()"
- Expected: "1"

**Test 3:** Empty after removing all
- Input: "push(1), pop(), empty()"
- Expected: "true"

---

## 2. Design Circular Queue

**Difficulty:** medium
**Concept:** queues
**Family:** queues:circular-array

### Description

Design a circular queue with fixed size k. Support enQueue, deQueue, Front, Rear, isEmpty, and isFull operations. Use array with head/tail pointers.

### Examples

**Example 1:**
- Input: MyCircularQueue(3), enQueue(1), enQueue(2), enQueue(3), enQueue(4)
- Output: true, true, true, false
- Explanation: First three succeed, fourth fails because queue is full.

### Hints

1. Use array of size k, head pointer for front, tail for rear, and count for size. Initialize count=0, head=0, tail=-1.
2. Use modulo (%) for wrap-around: tail = (tail + 1) % k for enQueue, head = (head + 1) % k for deQueue.
3. Queue is full when count == k, empty when count == 0. Track count explicitly to distinguish these cases.

### Starter Code

### Solution

### Test Cases

**Test 1:** Fill queue
- Input: "k=3, enQueue(1,2,3)"
- Expected: "true,true,true"

**Test 2:** Overflow check
- Input: "k=3, enQueue(1,2,3,4)"
- Expected: "true,true,true,false"

**Test 3:** Circular reuse
- Input: "k=2, enQueue(1), deQueue(), enQueue(2,3)"
- Expected: "true,true,true,true"

---

## 3. Number of Recent Calls

**Difficulty:** easy
**Concept:** queues

### Description

Count requests in the past 3000 milliseconds. Implement RecentCounter class with ping(t) that returns count of requests in range [t-3000, t].

### Examples

**Example 1:**
- Input: ping(1), ping(100), ping(3001), ping(3002)
- Output: 1, 2, 3, 3
- Explanation: At time 3002, requests at 1 and 100 are too old (> 3000ms ago).

### Hints

1. Use a queue (deque) to store timestamps. Newer timestamps are added to the rear.
2. When new time t arrives, remove all times < t-3000 from front of queue. They're outside the window.
3. After removing expired times, queue size is the count of valid requests. Return len(queue).

### Starter Code

### Solution

### Test Cases

**Test 1:** Example case
- Input: "[1,100,3001,3002]"
- Expected: "[1,2,3,3]"

**Test 2:** All in range
- Input: "[1,2,3,4,5]"
- Expected: "[1,2,3,4,5]"

**Test 3:** Some expire
- Input: "[1,1000,2000,3001]"
- Expected: "[1,2,3,2]"

---

## 4. Sliding Window Maximum

**Difficulty:** hard
**Concept:** queues

### Description

Find max in each sliding window of size k. Use monotonic deque for O(n) solution - keep deque decreasing, front is max.

### Examples

**Example 1:**
- Input: nums=[1,3,-1,-3,5,3,6,7], k=3
- Output: [3,3,5,5,6,7]
- Explanation: Max of [1,3,-1] is 3, max of [3,-1,-3] is 3, etc.

### Hints

1. Deque stores indices. This lets you check if index is out of window: if deque[0] <= i-k.
2. Before adding i, remove indices from rear while nums[rear] < nums[i]. This keeps deque decreasing.
3. Front of deque is always index of max in current window. Append nums[deque[0]] to result for each window.

### Starter Code

### Solution

### Test Cases

**Test 1:** Example
- Input: "([1,3,-1,-3,5,3,6,7], 3)"
- Expected: "[3,3,5,5,6,7]"

**Test 2:** Single element
- Input: "([1], 1)"
- Expected: "[1]"

**Test 3:** Window size 1
- Input: "([1,-1], 1)"
- Expected: "[1,-1]"

---

## 5. Moving Average from Data Stream

**Difficulty:** easy
**Concept:** queues

### Description

Calculate moving average of last size values from data stream. Use queue to maintain window, track sum for efficiency.

### Examples

**Example 1:**
- Input: size=3, next(1), next(10), next(3), next(5)
- Output: 1.0, 5.5, 4.67, 6.0

### Hints

1. Use deque for window values, track total sum. Initialize size, queue=deque(), total=0.
2. Append new val, add to total. If queue size > size, remove oldest: total -= queue.popleft().
3. Return total / len(queue). Queue size might be < size initially.

### Starter Code

### Solution

### Test Cases

**Test 1:** Example
- Input: "(3, [1,10,3,5])"
- Expected: "[1.0,5.5,4.67,6.0]"

**Test 2:** Size 1
- Input: "(1, [1,2,3])"
- Expected: "[1.0,2.0,3.0]"

---

## 6. Design Hit Counter

**Difficulty:** medium
**Concept:** queues

### Description

Count hits in past 5 minutes (300 seconds). Support hit(timestamp) and getHits(timestamp). Remove expired hits from queue.

### Examples

**Example 1:**
- Input: hit(1), hit(2), hit(3), getHits(4), hit(300), getHits(300), getHits(301)
- Output: -, -, -, 3, -, 4, 3

### Hints

1. Use deque to store hit timestamps. Newer hits are appended to rear.
2. In getHits(t), remove all timestamps < t-300 from front. Use while queue and queue[0] < t-300.
3. After removing expired hits, return len(queue). This is the count of valid hits.

### Starter Code

### Solution

### Test Cases

**Test 1:** All in range
- Input: "([1,2,3], 4)"
- Expected: "3"

**Test 2:** Some expired
- Input: "([1,2,300], 301)"
- Expected: "2"

---

## 7. Task Scheduler

**Difficulty:** medium
**Concept:** queues

### Description

Schedule tasks with cooldown n. Same task must wait n intervals. Use priority queue for available tasks, queue for cooling.

### Examples

**Example 1:**
- Input: tasks=['A','A','A','B','B','B'], n=2
- Output: 8
- Explanation: A->B->idle->A->B->idle->A->B

### Hints

1. Count task frequencies with Counter. Use max heap (negative counts) for available tasks.
2. After executing task, put (count-1, time+n+1) in cooldown queue. When time reaches available_time, move back to heap.
3. At each time, execute most frequent available task or idle. Process cooldown queue to reactivate tasks.

### Starter Code

### Solution

### Test Cases

**Test 1:** Example
- Input: "(['A','A','A','B','B','B'], 2)"
- Expected: "8"

**Test 2:** No cooldown
- Input: "(['A','A','A','B','B','B'], 0)"
- Expected: "6"

---

## 8. Rotting Oranges

**Difficulty:** medium
**Concept:** queues

### Description

Grid where 2=rotten, 1=fresh, 0=empty. Rotten spreads to adjacent fresh every minute. Return minutes until all fresh are rotten, or -1. BFS with queue.

### Examples

**Example 1:**
- Input: [[2,1,1],[1,1,0],[0,1,1]]
- Output: 4
- Explanation: Minute 1: top-right and middle-left rot. Continue spreading.

### Hints

1. Add all initially rotten (r,c) to queue. Count fresh oranges. BFS processes all rotten at same time (level by level).
2. Track minutes as BFS levels. When rotting fresh orange, decrement fresh_count and add to queue.
3. After BFS, if fresh_count > 0, return -1 (unreachable). Otherwise return minutes.

### Starter Code

### Solution

### Test Cases

**Test 1:** Example
- Input: "[[2,1,1],[1,1,0],[0,1,1]]"
- Expected: "4"

**Test 2:** Cannot reach all
- Input: "[[2,1,1],[0,1,1],[1,0,1]]"
- Expected: "-1"

**Test 3:** No fresh oranges
- Input: "[[0,2]]"
- Expected: "0"

---

## 9. Perfect Squares

**Difficulty:** medium
**Concept:** queues

### Description

Find minimum number of perfect squares that sum to n. Use BFS to find shortest path. Each level tries subtracting all possible squares.

### Examples

**Example 1:**
- Input: n = 12
- Output: 3
- Explanation: 12 = 4 + 4 + 4

### Hints

1. BFS finds minimum steps. Start with queue=[(n, 0)], visited={n}. Each state is (remaining, steps).
2. For each number num, try subtracting all perfect squares i*i <= num. Add (num - i*i, steps+1) to queue.
3. Use visited set to avoid processing same number twice. When reaching 0, return steps.

### Starter Code

### Solution

### Test Cases

**Test 1:** 4+4+4
- Input: "12"
- Expected: "3"

**Test 2:** 4+9
- Input: "13"
- Expected: "2"

**Test 3:** Single square
- Input: "1"
- Expected: "1"

---

## 10. Open the Lock

**Difficulty:** medium
**Concept:** queues

### Description

4-digit lock starts at '0000', each digit can rotate 0-9. Avoid deadends. Find minimum turns to reach target. BFS puzzle.

### Examples

**Example 1:**
- Input: deadends = ['0201','0101','0102','1212','2002'], target = '0202'
- Output: 6
- Explanation: 0000 -> 1000 -> 1100 -> 1200 -> 1201 -> 1202 -> 0202

### Hints

1. BFS from '0000'. For each position, try rotating each of 4 digits up or down. Generate 8 neighbors.
2. Track visited to avoid cycles. Mark deadends as visited from start to avoid them.
3. When reaching target, return number of turns. If queue exhausted, return -1.

### Starter Code

### Solution

### Test Cases

**Test 1:** Example
- Input: "(['0201','0101','0102','1212','2002'], '0202')"
- Expected: "6"

**Test 2:** Surrounded by deadends
- Input: "(['8887','8889','8878','8898','8788','8988','7888','9888'], '8888')"
- Expected: "-1"

---

## 11. Walls and Gates

**Difficulty:** medium
**Concept:** queues

### Description

Grid where -1=wall, 0=gate, INF=empty room. Fill each empty room with distance to nearest gate. Multi-source BFS.

### Examples

**Example 1:**
- Input: [[INF,-1,0,INF],[INF,INF,INF,-1],[INF,-1,INF,-1],[0,-1,INF,INF]]
- Output: [[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]

### Hints

1. Multi-source BFS: Add all gates (cells with 0) to queue initially.
2. Process level by level. For each cell, update neighbors if they're INF and within bounds.
3. Update neighbor to current_distance + 1. This gives shortest distance from any gate.

### Starter Code

### Solution

### Test Cases

**Test 1:** Simple case
- Input: "[[2147483647,-1,0,2147483647]]"
- Expected: "[[3,-1,0,1]]"

---

## 12. Shortest Bridge

**Difficulty:** medium
**Concept:** queues

### Description

Binary grid with exactly 2 islands. Find shortest bridge (0s to flip to 1s) to connect them. DFS to find one island, BFS to reach other.

### Examples

**Example 1:**
- Input: [[0,1],[1,0]]
- Output: 1
- Explanation: Flip one 0 to connect islands

### Hints

1. Step 1: DFS to find and mark first island (change 1s to 2s), add boundary to queue.
2. Step 2: BFS from first island boundary to find second island. Track distance.
3. When BFS finds a cell with value 1, that's the second island. Return distance.

### Starter Code

### Solution

### Test Cases

**Test 1:** Simple case
- Input: "[[0,1],[1,0]]"
- Expected: "1"

**Test 2:** Surrounded island
- Input: "[[1,1,1,1,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,0,0,1],[1,1,1,1,1]]"
- Expected: "1"

---

## 13. Word Ladder

**Difficulty:** hard
**Concept:** queues

### Description

Transform beginWord to endWord, changing one letter at a time. Each intermediate word must be in wordList. Find shortest transformation sequence length. BFS.

### Examples

**Example 1:**
- Input: beginWord='hit', endWord='cog', wordList=['hot','dot','dog','lot','log','cog']
- Output: 5
- Explanation: hit->hot->dot->dog->cog

### Hints

1. Use BFS with queue=[(beginWord, 1)]. Convert wordList to set for O(1) lookup.
2. For each word, try replacing each letter with 'a'-'z'. If result in wordList and not visited, add to queue.
3. Remove word from wordList when visited to avoid cycles. When reaching endWord, return length.

### Starter Code

### Solution

### Test Cases

**Test 1:** Example
- Input: "('hit', 'cog', ['hot','dot','dog','lot','log','cog'])"
- Expected: "5"

**Test 2:** No path
- Input: "('hit', 'cog', ['hot','dot','dog','lot','log'])"
- Expected: "0"

---

## 14. 01 Matrix

**Difficulty:** medium
**Concept:** queues

### Description

Binary matrix, return distance of each cell to nearest 0. Multi-source BFS from all 0s.

### Examples

**Example 1:**
- Input: [[0,0,0],[0,1,0],[1,1,1]]
- Output: [[0,0,0],[0,1,0],[1,2,1]]

### Hints

1. Add all cells with 0 to queue. Set all 1s to infinity initially.
2. Process queue level by level. For each neighbor that's infinity, update to current_dist+1.
3. Can modify mat in-place or create result matrix. Each cell processed once.

### Starter Code

### Solution

### Test Cases

**Test 1:** Example
- Input: "[[0,0,0],[0,1,0],[1,1,1]]"
- Expected: "[[0,0,0],[0,1,0],[1,2,1]]"

---

## 15. Snakes and Ladders

**Difficulty:** medium
**Concept:** queues

### Description

Board game with snakes and ladders. Find minimum moves to reach end. BFS treating board as graph.

### Examples

**Example 1:**
- Input: board = [[-1,-1,-1],[-1,9,8],[-1,8,9]]
- Output: 1
- Explanation: Jump directly to square 9

### Hints

1. BFS with state (position, moves). For each position, try dice rolls 1-6.
2. Handle board zigzag pattern: convert square number to (row, col) coordinates.
3. If landing on ladder/snake, jump to destination. Track visited squares.

### Starter Code

### Solution

### Test Cases

**Test 1:** Direct ladder
- Input: "[[-1,-1,-1],[-1,9,8],[-1,8,9]]"
- Expected: "1"

---

## 16. Jump Game IV

**Difficulty:** hard
**Concept:** queues

### Description

Array where you can jump to i+1, i-1, or any j where arr[j]==arr[i]. Find minimum jumps to reach end. BFS with value mapping.

### Examples

**Example 1:**
- Input: arr = [100,-23,-23,404,100,23,23,23,3,404]
- Output: 3
- Explanation: 0 -> 4 -> 3 -> 9

### Hints

1. Build value_map: value -> list of indices. BFS from index 0.
2. For each index, explore: index-1, index+1, and all indices with same value.
3. After using value_map[value], clear it to avoid revisiting same values.

### Starter Code

### Solution

### Test Cases

**Test 1:** Example
- Input: "[100,-23,-23,404,100,23,23,23,3,404]"
- Expected: "3"

---

## 17. Cut Off Trees for Golf Event

**Difficulty:** hard
**Concept:** queues

### Description

Grid with tree heights. Cut all trees in ascending height order. Start at (0,0). Find minimum steps, or -1 if impossible. BFS for each tree.

### Examples

**Example 1:**
- Input: forest = [[1,2,3],[0,0,4],[7,6,5]]
- Output: 6
- Explanation: Cut trees in order: 2,3,4,5,6,7

### Hints

1. Sort all tree positions by height. For each tree, BFS from current position to tree.
2. BFS returns steps to reach tree, or -1 if unreachable. Sum all steps.
3. If any tree unreachable, return -1. Otherwise return total steps.

### Starter Code

### Solution

### Test Cases

**Test 1:** Example
- Input: "[[1,2,3],[0,0,4],[7,6,5]]"
- Expected: "6"

---

## 18. Bus Routes

**Difficulty:** hard
**Concept:** queues

### Description

Array routes where routes[i] is bus route. Find minimum buses to reach target from source. BFS on bus graph.

### Examples

**Example 1:**
- Input: routes = [[1,2,7],[3,6,7]], source = 1, target = 6
- Output: 2
- Explanation: Take bus 0 to stop 7, then bus 1 to stop 6

### Hints

1. Build stop_to_buses map. BFS with (stop, buses_taken) starting from source.
2. For each stop, try all buses that go through it. Mark buses as visited.
3. For each bus, add all its stops to queue. When reaching target, return buses_taken.

### Starter Code

### Solution

### Test Cases

**Test 1:** Example
- Input: "([[1,2,7],[3,6,7]], 1, 6)"
- Expected: "2"

---

## 19. Trapping Rain Water II

**Difficulty:** hard
**Concept:** queues

### Description

2D elevation map. Calculate trapped rain water volume. Priority queue (min heap) with BFS from boundaries.

### Examples

**Example 1:**
- Input: heightMap = [[1,4,3,1,3,2],[3,2,1,3,2,4],[2,3,3,2,3,1]]
- Output: 4

### Hints

1. Start from boundaries. Use min heap to process cells from lowest to highest.
2. For each cell, water level is max(current_height, neighbor_max_height).
3. Add trapped water = max(0, water_level - cell_height). Mark cell as visited.

### Starter Code

### Solution

### Test Cases

**Test 1:** Example
- Input: "[[1,4,3,1,3,2],[3,2,1,3,2,4],[2,3,3,2,3,1]]"
- Expected: "4"

---

## 20. Shortest Path Visiting All Nodes

**Difficulty:** hard
**Concept:** queues

### Description

Graph with n nodes. Find shortest path visiting all nodes. Can revisit nodes/edges. BFS with state (node, visited_mask).

### Examples

**Example 1:**
- Input: graph = [[1,2,3],[0],[0],[0]]
- Output: 4
- Explanation: Path: 0->1->0->2->0->3

### Hints

1. State: (node, visited_bitmask). Start BFS from all nodes simultaneously.
2. visited_mask uses bits: bit i = 1 if node i visited. Target: all_visited = (1 << n) - 1.
3. For each state, explore neighbors. New mask = mask | (1 << neighbor).

### Starter Code

### Solution

### Test Cases

**Test 1:** Star graph
- Input: "[[1,2,3],[0],[0],[0]]"
- Expected: "4"

---
