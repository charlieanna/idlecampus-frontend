# INTERVALS Problems

Total Problems: 12

---

## 1. Merge Intervals

**Difficulty:** medium
**Concept:** intervals
**Family:** intervals:merge-overlapping

### Description

Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.

### Key Insight

First, sort intervals by start time. Then iterate through sorted intervals: if current interval overlaps with the last merged interval (current.start <= last.end), merge them by extending the end. Otherwise, add current interval to result. This greedy approach works because sorting ensures we process intervals in order.

### Examples

**Example 1:**
- Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
- Output: [[1,6],[8,10],[15,18]]
- Explanation: Intervals [1,3] and [2,6] overlap, so merge them into [1,6]

**Example 2:**
- Input: intervals = [[1,4],[4,5]]
- Output: [[1,5]]
- Explanation: Intervals [1,4] and [4,5] are touching (4 == 4), so merge them

**Example 3:**
- Input: intervals = [[1,4],[0,4]]
- Output: [[0,4]]
- Explanation: After sorting: [0,4] completely contains [1,4]

### Hints

1. Start by sorting the intervals by their start time - this is crucial
2. Two intervals [a,b] and [c,d] overlap if c <= b (assuming a <= c after sorting)
3. Keep track of the last merged interval in your result array
4. When merging, the new end is max(last_end, current_end)
5. If intervals don't overlap, simply append the current interval to result
6. Consider edge cases: empty array, single interval, all overlapping, none overlapping

### Starter Code

**Python:**
```python
def merge(intervals):
    """
    Merge all overlapping intervals.
    
    Args:
        intervals: List[List[int]] - array of intervals [start, end]
    
    Returns:
        List[List[int]] - merged intervals
    """
    # TODO: Handle empty input
    
    # TODO: Sort intervals by start time
    
    # TODO: Initialize result with first interval
    
    # TODO: For each interval, check if it overlaps with last merged interval
    # - If overlaps: extend the end of last merged interval
    # - If not: add current interval to result
    
    pass
```

**JavaScript:**
```javascript
function merge(intervals) {
    """
    Merge all overlapping intervals.
    
    Args:
        intervals: Array] - array of intervals [start, end]
    
    Returns:
        Array] - merged intervals
    """
    // TODO: Handle empty input
    
    // TODO: Sort intervals by start time
    
    // TODO: Initialize result with first interval
    
    // TODO: For each interval, check if it overlaps with last merged interval
    # - If overlaps: extend the end of last merged interval
    # - If not: add current interval to result
  // TODO: implement
```

### Solution

**Python:**
```python
def merge(intervals):
    if not intervals:
        return []
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    # Initialize result with first interval
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        last = merged[-1]
        
        # Check if current overlaps with last merged interval
        if current[0] <= last[1]:
            # Merge by extending the end
            last[1] = max(last[1], current[1])
        else:
            # No overlap, add current interval
            merged.append(current)
    
    return merged

# Explanation:
# 1. Sort intervals by start time: O(n log n)
# 2. Process each interval once: O(n)
# 3. For each interval, check if it overlaps with last merged
# 4. Overlap condition: current_start <= last_end (after sorting)
# 5. Merge by taking max end: handles nested intervals
# 6. No overlap: start new merged interval
```

**JavaScript:**
```javascript
function merge(intervals) {
    if not intervals:
        return []
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    # Initialize result with first interval
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        last = merged[-1]
        
        # Check if current overlaps with last merged interval
        if current[0] <= last[1]:
            # Merge by extending the end
            last[1] = max(last[1], current[1])
        else:
            # No overlap, add current interval
            merged.append(current)
    
    return merged

# Explanation:
# 1. Sort intervals by start time: O(n log n)
# 2. Process each interval once: O(n)
# 3. For each interval, check if it overlaps with last merged
# 4. Overlap condition: current_start <= last_end (after sorting)
# 5. Merge by taking max end: handles nested intervals
# 6. No overlap: start new merged interval
```

### Complexity Analysis

- **Time Complexity:** O(n log n) - dominated by sorting
- **Space Complexity:** O(n) - result array stores all merged intervals

### Test Cases

**Test 1:** Standard overlapping intervals
- Input: "merge([[1,3],[2,6],[8,10],[15,18]])"
- Expected: "[[1,6],[8,10],[15,18]]"

**Test 2:** Touching intervals (boundary case)
- Input: "merge([[1,4],[4,5]])"
- Expected: "[[1,5]]"

**Test 3:** Unsorted intervals
- Input: "merge([[1,4],[0,4]])"
- Expected: "[[0,4]]"

**Test 4:** One interval contains another
- Input: "merge([[1,4],[2,3]])"
- Expected: "[[1,4]]"

**Test 5:** No overlapping intervals
- Input: "merge([[1,2],[3,4],[5,6]])"
- Expected: "[[1,2],[3,4],[5,6]]"

**Test 6:** Single interval
- Input: "merge([[1,10]])"
- Expected: "[[1,10]]"

**Test 7:** PERFORMANCE: Large non-overlapping intervals (16K intervals) - Must use O(n log n) sort + O(n) merge
- Input: "merge([[i, i+2] for i in range(0, 50000, 3)])"
- Expected: "str([[i, i+2] for i in range(0, 50000, 3)])"

---

## 2. Insert Interval

**Difficulty:** medium
**Concept:** intervals
**Family:** intervals:merge-overlapping

### Description

You are given an array of non-overlapping intervals sorted by start time, and a new interval. Insert the new interval and merge if necessary, returning the intervals in sorted order.

### Key Insight

Three-phase approach: (1) Add all intervals that end before new interval starts, (2) Merge all overlapping intervals with new interval by tracking min start and max end, (3) Add all intervals that start after new interval ends. This works in one pass without sorting since input is already sorted.

### Examples

**Example 1:**
- Input: intervals = [[1,3],[6,9]], newInterval = [2,5]
- Output: [[1,5],[6,9]]
- Explanation: New interval [2,5] overlaps with [1,3], merge to [1,5]

**Example 2:**
- Input: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
- Output: [[1,2],[3,10],[12,16]]
- Explanation: New interval merges with [3,5],[6,7],[8,10] into [3,10]

**Example 3:**
- Input: intervals = [], newInterval = [5,7]
- Output: [[5,7]]
- Explanation: Empty input, just return new interval

### Hints

1. Think of this as three distinct phases based on interval positions
2. Phase 1: intervals ending before newInterval starts (no overlap)
3. Phase 2: intervals overlapping with newInterval (merge them)
4. Phase 3: intervals starting after newInterval ends (no overlap)
5. For overlapping intervals, track min(all starts) and max(all ends)
6. You can do this in one pass since intervals are pre-sorted

### Starter Code

**Python:**
```python
def insert(intervals, newInterval):
    """
    Insert and merge interval into sorted intervals list.
    
    Args:
        intervals: List[List[int]] - sorted non-overlapping intervals
        newInterval: List[int] - interval to insert
    
    Returns:
        List[List[int]] - merged intervals
    """
    # TODO: Phase 1 - Add intervals that end before new interval starts
    
    # TODO: Phase 2 - Merge all overlapping intervals
    # Track minimum start and maximum end
    
    # TODO: Phase 3 - Add intervals that start after new interval ends
    
    pass
```

**JavaScript:**
```javascript
function insert(intervals, newInterval) {
    """
    Insert and merge interval into sorted intervals list.
    
    Args:
        intervals: Array] - sorted non-overlapping intervals
        newInterval: Array - interval to insert
    
    Returns:
        Array] - merged intervals
    """
    // TODO: Phase 1 - Add intervals that end before new interval starts
    
    // TODO: Phase 2 - Merge all overlapping intervals
    # Track minimum start and maximum end
    
    // TODO: Phase 3 - Add intervals that start after new interval ends
  // TODO: implement
```

### Solution

**Python:**
```python
def insert(intervals, newInterval):
    result = []
    i = 0
    n = len(intervals)
    
    # Phase 1: Add all intervals ending before newInterval starts
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    
    # Phase 2: Merge all overlapping intervals
    while i < n and intervals[i][0] <= newInterval[1]:
        # Merge by taking min start and max end
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    result.append(newInterval)
    
    # Phase 3: Add all intervals starting after newInterval ends
    while i < n:
        result.append(intervals[i])
        i += 1
    
    return result

# Explanation:
# - Phase 1: intervals[i][1] < newInterval[0] means no overlap
# - Phase 2: intervals[i][0] <= newInterval[1] means overlap
# - Merge by extending newInterval to cover all overlapping intervals
# - Phase 3: remaining intervals don't overlap (sorted order)
# - One pass solution: O(n) time
```

**JavaScript:**
```javascript
function insert(intervals, newInterval) {
    result = []
    i = 0
    n = len(intervals)
    
    # Phase 1: Add all intervals ending before newInterval starts
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    
    # Phase 2: Merge all overlapping intervals
    while i < n and intervals[i][0] <= newInterval[1]:
        # Merge by taking min start and max end
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    result.append(newInterval)
    
    # Phase 3: Add all intervals starting after newInterval ends
    while i < n:
        result.append(intervals[i])
        i += 1
    
    return result

# Explanation:
# - Phase 1: intervals[i][1] < newInterval[0] means no overlap
# - Phase 2: intervals[i][0] <= newInterval[1] means overlap
# - Merge by extending newInterval to cover all overlapping intervals
# - Phase 3: remaining intervals don't overlap (sorted order)
# - One pass solution: O(n) time
```

### Complexity Analysis

- **Time Complexity:** O(n) - single pass through intervals
- **Space Complexity:** O(n) - result array

### Test Cases

**Test 1:** Partial overlap with first interval
- Input: "insert([[1,3],[6,9]], [2,5])"
- Expected: "[[1,5],[6,9]]"

**Test 2:** Merges multiple intervals
- Input: "insert([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8])"
- Expected: "[[1,2],[3,10],[12,16]]"

**Test 3:** Empty intervals list
- Input: "insert([], [5,7])"
- Expected: "[[5,7]]"

**Test 4:** New interval contained in existing
- Input: "insert([[1,5]], [2,3])"
- Expected: "[[1,5]]"

**Test 5:** No overlap, insert at end
- Input: "insert([[1,5]], [6,8])"
- Expected: "[[1,5],[6,8]]"

**Test 6:** Insert in the middle, no overlap
- Input: "insert([[3,5],[12,15]], [6,6])"
- Expected: "[[3,5],[6,6],[12,15]]"

**Test 7:** PERFORMANCE: Large sorted intervals (10K intervals) - Must use O(n) single pass, not O(n²)
- Input: "insert([[i*10, i*10+5] for i in range(10000)], [50000, 50005])"
- Expected: "str([[i*10, i*10+5] for i in range(10000)] + [[50000, 50005]])"

---

## 3. Meeting Rooms

**Difficulty:** easy
**Concept:** intervals
**Family:** intervals:meeting-rooms

### Description

Given an array of meeting time intervals where intervals[i] = [start_i, end_i], determine if a person could attend all meetings.

### Key Insight

Sort intervals by start time. Then check each adjacent pair: if any meeting starts before the previous one ends (intervals[i][0] < intervals[i-1][1]), there's a conflict. This works because sorting ensures we check meetings in chronological order.

### Examples

**Example 1:**
- Input: intervals = [[0,30],[5,10],[15,20]]
- Output: false
- Explanation: Meeting [5,10] conflicts with [0,30] (5 < 30)

**Example 2:**
- Input: intervals = [[7,10],[2,4]]
- Output: true
- Explanation: After sorting: [2,4] ends before [7,10] starts

**Example 3:**
- Input: intervals = [[1,5],[5,8],[8,10]]
- Output: true
- Explanation: Meetings are back-to-back (touching is OK)

### Hints

1. First sort the intervals by start time
2. After sorting, you only need to check adjacent meetings
3. Two consecutive meetings conflict if second starts before first ends
4. Conflict condition: intervals[i][0] < intervals[i-1][1]
5. If start equals previous end (touching), that's OK - no conflict
6. Empty list or single meeting always returns true

### Starter Code

**Python:**
```python
def canAttendMeetings(intervals):
    """
    Check if a person can attend all meetings.
    
    Args:
        intervals: List[List[int]] - meeting time intervals
    
    Returns:
        bool - True if can attend all meetings
    """
    # TODO: Handle empty input
    
    # TODO: Sort intervals by start time
    
    # TODO: Check each adjacent pair for conflicts
    # Conflict: current start < previous end
    
    pass
```

**JavaScript:**
```javascript
function canAttendMeetings(intervals) {
    """
    Check if a person can attend all meetings.
    
    Args:
        intervals: Array] - meeting time intervals
    
    Returns:
        bool - true if can attend all meetings
    """
    // TODO: Handle empty input
    
    // TODO: Sort intervals by start time
    
    // TODO: Check each adjacent pair for conflicts
    # Conflict: current start < previous end
  // TODO: implement
```

### Solution

**Python:**
```python
def canAttendMeetings(intervals):
    if not intervals:
        return True
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    # Check each adjacent pair
    for i in range(1, len(intervals)):
        # If current starts before previous ends, conflict!
        if intervals[i][0] < intervals[i-1][1]:
            return False
    
    return True

# Explanation:
# 1. Sort by start time to check meetings chronologically
# 2. For each pair of consecutive meetings
# 3. Check if second starts before first ends
# 4. intervals[i][0] < intervals[i-1][1] means overlap
# 5. If start == previous end, meetings are touching (OK)
# 6. Return False on first conflict, True if none found
```

**JavaScript:**
```javascript
function canAttendMeetings(intervals) {
    if not intervals:
        return true
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    # Check each adjacent pair
    for i in range(1, len(intervals)):
        # If current starts before previous ends, conflict!
        if intervals[i][0] < intervals[i-1][1]:
            return false
    
    return true

# Explanation:
# 1. Sort by start time to check meetings chronologically
# 2. For each pair of consecutive meetings
# 3. Check if second starts before first ends
# 4. intervals[i][0] < intervals[i-1][1] means overlap
# 5. If start == previous end, meetings are touching (OK)
# 6. Return false on first conflict, true if none found
```

### Complexity Analysis

- **Time Complexity:** O(n log n) - dominated by sorting
- **Space Complexity:** O(1) - only sorting space, or O(n) if counting sort space

### Test Cases

**Test 1:** Overlapping meetings
- Input: "canAttendMeetings([[0,30],[5,10],[15,20]])"
- Expected: "False"

**Test 2:** Non-overlapping unsorted meetings
- Input: "canAttendMeetings([[7,10],[2,4]])"
- Expected: "True"

**Test 3:** Back-to-back meetings (touching is OK)
- Input: "canAttendMeetings([[1,5],[5,8],[8,10]])"
- Expected: "True"

**Test 4:** Empty schedule
- Input: "canAttendMeetings([])"
- Expected: "True"

**Test 5:** Single meeting
- Input: "canAttendMeetings([[1,5]])"
- Expected: "True"

**Test 6:** Second meeting during first
- Input: "canAttendMeetings([[1,4],[2,3]])"
- Expected: "False"

---

## 4. Meeting Rooms II

**Difficulty:** medium
**Concept:** intervals
**Family:** intervals:meeting-rooms

### Description

Given an array of meeting time intervals where intervals[i] = [start_i, end_i], return the minimum number of conference rooms required.

### Key Insight

Use a min heap to track end times of ongoing meetings. Sort intervals by start time. For each meeting: remove all meetings that ended (heap.top < current.start), then add current meeting's end time to heap. The maximum heap size is the answer, representing the maximum number of simultaneous meetings.

### Examples

**Example 1:**
- Input: intervals = [[0,30],[5,10],[15,20]]
- Output: 2
- Explanation: At time 5, both [0,30] and [5,10] are active, need 2 rooms

**Example 2:**
- Input: intervals = [[7,10],[2,4]]
- Output: 1
- Explanation: Meetings don't overlap, only need 1 room

**Example 3:**
- Input: intervals = [[1,5],[2,6],[3,7],[4,8]]
- Output: 4
- Explanation: At time 4, all four meetings overlap

### Hints

1. Think about what happens at each meeting start time
2. You need to know: how many meetings are still ongoing?
3. A min heap (priority queue) can track when ongoing meetings end
4. Sort meetings by start time first
5. When a meeting starts, remove all meetings from heap that already ended
6. Add current meeting's end time to heap
7. The maximum heap size is the maximum number of simultaneous meetings

### Starter Code

**Python:**
```python
def minMeetingRooms(intervals):
    """
    Find minimum number of conference rooms needed.
    
    Args:
        intervals: List[List[int]] - meeting time intervals
    
    Returns:
        int - minimum rooms required
    """
    # TODO: Handle empty input
    
    # TODO: Sort intervals by start time
    
    # TODO: Use min heap to track end times of ongoing meetings
    
    # TODO: For each meeting:
    # - Remove meetings that already ended (heap top < current start)
    # - Add current meeting's end time to heap
    # - Track maximum heap size
    
    pass
```

**JavaScript:**
```javascript
function minMeetingRooms(intervals) {
    """
    Find minimum number of conference rooms needed.
    
    Args:
        intervals: Array] - meeting time intervals
    
    Returns:
        int - minimum rooms required
    """
    // TODO: Handle empty input
    
    // TODO: Sort intervals by start time
    
    // TODO: Use min heap to track end times of ongoing meetings
    
    // TODO: For each meeting:
    # - Remove meetings that already ended (heap top < current start)
    # - Add current meeting's end time to heap
    # - Track maximum heap size
  // TODO: implement
```

### Solution

**Python:**
```python
import heapq

def minMeetingRooms(intervals):
    if not intervals:
        return 0
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    # Min heap to track end times of ongoing meetings
    heap = []
    
    for start, end in intervals:
        # Remove meetings that have ended
        while heap and heap[0] <= start:
            heapq.heappop(heap)
        
        # Add current meeting's end time
        heapq.heappush(heap, end)
    
    # Maximum heap size = max simultaneous meetings
    return len(heap)

# Explanation:
# 1. Sort meetings by start time
# 2. Heap stores end times of currently active meetings
# 3. When meeting starts, remove all that ended (end <= start)
# 4. Add current meeting's end time to heap
# 5. Heap size = number of active meetings at any point
# 6. Maximum heap size = minimum rooms needed
# 
# Why it works: Heap top is earliest ending meeting
# If it ended before current starts, room is free to reuse
```

**JavaScript:**
```javascript
import heapq

function minMeetingRooms(intervals) {
    if not intervals:
        return 0
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    # Min heap to track end times of ongoing meetings
    heap = []
    
    for start, end in intervals:
        # Remove meetings that have ended
        while heap and heap[0] <= start:
            heapq.heappop(heap)
        
        # Add current meeting's end time
        heapq.heappush(heap, end)
    
    # Maximum heap size = max simultaneous meetings
    return len(heap)

# Explanation:
# 1. Sort meetings by start time
# 2. Heap stores end times of currently active meetings
# 3. When meeting starts, remove all that ended (end <= start)
# 4. Add current meeting's end time to heap
# 5. Heap size = number of active meetings at any point
# 6. Maximum heap size = minimum rooms needed
# 
# Why it works: Heap top is earliest ending meeting
# If it ended before current starts, room is free to reuse
```

### Complexity Analysis

- **Time Complexity:** O(n log n) - sorting + n heap operations
- **Space Complexity:** O(n) - heap can store all meetings in worst case

### Test Cases

**Test 1:** Two meetings overlap at most
- Input: "minMeetingRooms([[0,30],[5,10],[15,20]])"
- Expected: "2"

**Test 2:** No overlap, one room sufficient
- Input: "minMeetingRooms([[7,10],[2,4]])"
- Expected: "1"

**Test 3:** All four meetings overlap
- Input: "minMeetingRooms([[1,5],[2,6],[3,7],[4,8]])"
- Expected: "4"

**Test 4:** Back-to-back meetings, one room
- Input: "minMeetingRooms([[1,5],[5,10],[10,15]])"
- Expected: "1"

**Test 5:** Empty schedule
- Input: "minMeetingRooms([])"
- Expected: "0"

**Test 6:** Two nested in one long meeting
- Input: "minMeetingRooms([[1,10],[2,3],[4,5]])"
- Expected: "2"

**Test 7:** PERFORMANCE: Large overlapping intervals (20K intervals) - Must use O(n log n) sort + heap operations
- Input: "minMeetingRooms([[i, i+10] for i in range(0, 20000)])"
- Expected: "10"

---

## 5. Find Right Interval

**Difficulty:** medium
**Concept:** intervals
**Family:** intervals:intersection

### Description

You are given an array of intervals, where intervals[i] = [start_i, end_i]. For each interval i, find the interval j such that start_j >= end_i and start_j is minimized. Return an array of indices (or -1 if no such interval exists).

### Key Insight

Create a sorted array of (start_time, original_index) pairs. For each interval, use binary search to find the smallest start time >= current end time. This finds the "right interval" efficiently in O(log n) per query after O(n log n) preprocessing.

### Examples

**Example 1:**
- Input: intervals = [[1,2]]
- Output: [-1]
- Explanation: No interval starts at or after 2

**Example 2:**
- Input: intervals = [[3,4],[2,3],[1,2]]
- Output: [-1,0,1]
- Explanation: [3,4]→none, [2,3]→[3,4], [1,2]→[2,3]

**Example 3:**
- Input: intervals = [[1,4],[2,3],[3,4]]
- Output: [-1,2,-1]
- Explanation: [1,4]→none, [2,3]→[3,4] at index 2, [3,4]→none

### Hints

1. You need to efficiently find: smallest start_j >= end_i for each i
2. This is a perfect use case for binary search
3. First, create pairs of (start_time, original_index)
4. Sort these pairs by start_time
5. For each interval, binary search for the first start >= its end
6. Remember to return the original index, not the sorted position
7. Python's bisect_left can find the insertion point (first >= target)

### Starter Code

**Python:**
```python
def findRightInterval(intervals):
    """
    Find right interval for each interval.
    
    Args:
        intervals: List[List[int]] - array of intervals
    
    Returns:
        List[int] - index of right interval for each interval
    """
    # TODO: Create array of (start, original_index) pairs
    
    # TODO: Sort by start time
    
    # TODO: For each interval, binary search for smallest start >= end
    
    # TODO: Return original index or -1 if not found
    
    pass
```

**JavaScript:**
```javascript
function findRightInterval(intervals) {
    """
    Find right interval for each interval.
    
    Args:
        intervals: Array] - array of intervals
    
    Returns:
        Array - index of right interval for each interval
    """
    // TODO: Create array of (start, original_index) pairs
    
    // TODO: Sort by start time
    
    // TODO: For each interval, binary search for smallest start >= end
    
    // TODO: Return original index or -1 if not found
  // TODO: implement
```

### Solution

**Python:**
```python
def findRightInterval(intervals):
    import bisect
    
    # Create (start, index) pairs and sort by start
    starts = sorted((interval[0], i) for i, interval in enumerate(intervals))
    result = []
    
    for start, end in intervals:
        # Binary search for smallest start >= end
        # bisect_left finds insertion position
        pos = bisect.bisect_left(starts, (end, 0))
        
        if pos < len(starts):
            # Found a valid right interval
            result.append(starts[pos][1])
        else:
            # No interval starts >= end
            result.append(-1)
    
    return result

# Explanation:
# 1. Create (start, original_index) pairs
# 2. Sort by start time for binary search
# 3. For each interval, find smallest start >= its end
# 4. bisect_left finds first position where (end, 0) could be inserted
# 5. This gives us the smallest start >= end
# 6. Return the original index from the sorted list
# 
# Why binary search: Finding in sorted array is O(log n)
# Total: O(n log n) for sorting + O(n log n) for queries
```

**JavaScript:**
```javascript
function findRightInterval(intervals) {
    import bisect
    
    # Create (start, index) pairs and sort by start
    starts = sorted((interval[0], i) for i, interval in enumerate(intervals))
    result = []
    
    for start, end in intervals:
        # Binary search for smallest start >= end
        # bisect_left finds insertion position
        pos = bisect.bisect_left(starts, (end, 0))
        
        if pos < len(starts):
            # Found a valid right interval
            result.append(starts[pos][1])
        else:
            # No interval starts >= end
            result.append(-1)
    
    return result

# Explanation:
# 1. Create (start, original_index) pairs
# 2. Sort by start time for binary search
# 3. For each interval, find smallest start >= its end
# 4. bisect_left finds first position where (end, 0) could be inserted
# 5. This gives us the smallest start >= end
# 6. Return the original index from the sorted list
# 
# Why binary search: Finding in sorted array is O(log n)
# Total: O(n log n) for sorting + O(n log n) for queries
```

### Complexity Analysis

- **Time Complexity:** O(n log n) - sorting + n binary searches
- **Space Complexity:** O(n) - sorted array of starts

### Test Cases

**Test 1:** Single interval, no right interval
- Input: "findRightInterval([[1,2]])"
- Expected: "[-1]"

**Test 2:** Chain of intervals
- Input: "findRightInterval([[3,4],[2,3],[1,2]])"
- Expected: "[-1,0,1]"

**Test 3:** Mixed overlapping intervals
- Input: "findRightInterval([[1,4],[2,3],[3,4]])"
- Expected: "[-1,2,-1]"

**Test 4:** Adjacent intervals
- Input: "findRightInterval([[1,2],[2,3]])"
- Expected: "[1,-1]"

**Test 5:** Point interval can be its own right interval
- Input: "findRightInterval([[1,1],[3,4]])"
- Expected: "[0,-1]"

**Test 6:** Reverse sorted intervals
- Input: "findRightInterval([[4,5],[2,3],[1,2]])"
- Expected: "[-1,0,1]"

---

## 6. Data Stream as Disjoint Intervals

**Difficulty:** hard
**Concept:** intervals
**Family:** intervals:data-stream

### Description

Implement a data structure that receives integers from a stream and retrieves the current list of disjoint intervals that cover all received numbers. Implement the SummaryRanges class with addNum(value) and getIntervals() methods.

### Key Insight

Use a sorted container (like Python's sorted list or tree map) to maintain disjoint intervals. When adding a number: (1) Find adjacent intervals, (2) Merge with left if touching/overlapping, (3) Merge with right if touching/overlapping, (4) Potentially merge left and right through the new number. This maintains disjoint intervals efficiently.

### Examples

**Example 1:**
- Input: ["SummaryRanges","addNum","getIntervals","addNum","getIntervals","addNum","getIntervals"]\n[[],[1],[],[3],[],[7],[]]
- Output: [null,null,[[1,1]],null,[[1,1],[3,3]],null,[[1,1],[3,3],[7,7]]]
- Explanation: Add 1→[1,1], add 3→[1,1],[3,3], add 7→[1,1],[3,3],[7,7]

**Example 2:**
- Input: addNum(1), addNum(3), addNum(2)
- Output: [[1,3]]
- Explanation: Adding 2 merges [1,1] and [3,3] into [1,3]

**Example 3:**
- Input: addNum(1), addNum(2), addNum(3)
- Output: [[1,3]]
- Explanation: Sequential numbers merge into one interval

### Hints

1. Maintain intervals in sorted order by start time
2. When adding a number, find where it would fit (binary search)
3. Check left interval: does it touch or overlap the new number?
4. Check right interval: does the new number touch or overlap it?
5. Four cases: (1) no merge, (2) merge left, (3) merge right, (4) merge both
6. Merge condition: interval.end + 1 >= value >= interval.start - 1
7. Use bisect module for efficient insertion position finding
8. Avoid duplicates: if value already covered, don't add

### Starter Code

**Python:**
```python
class SummaryRanges:
    """
    Data structure to track disjoint intervals from stream.
    """
    
    def __init__(self):
        # TODO: Initialize data structure to store intervals
        # Consider using sorted list or tree structure
        pass
    
    def addNum(self, value: int) -> None:
        """
        Add a number to the data structure.
        
        TODO: Find position to insert
        TODO: Check if merges with left interval
        TODO: Check if merges with right interval
        TODO: Handle merging both sides through new number
        """
        pass
    
    def getIntervals(self):
        """
        Return current list of disjoint intervals.
        
        Returns:
            List[List[int]] - sorted disjoint intervals
        """
        # TODO: Return the intervals
        pass
```

**JavaScript:**
```javascript
class SummaryRanges:
    """
    Data structure to track disjoint intervals from stream.
    """
    
    function __init__(self) {
        // TODO: Initialize data structure to store intervals
        # Consider using sorted list or tree structure
  // TODO: implement
    def addNum(self, value: int) -> null:
        """
        Add a number to the data structure.
        
        TODO: Find position to insert
        TODO: Check if merges with left interval
        TODO: Check if merges with right interval
        TODO: Handle merging both sides through new number
        """
  // TODO: implement
    function getIntervals(self) {
        """
        Return current list of disjoint intervals.
        
        Returns:
            Array] - sorted disjoint intervals
        """
        // TODO: Return the intervals
  // TODO: implement
```

### Solution

**Python:**
```python
class SummaryRanges:
    def __init__(self):
        self.intervals = []
    
    def addNum(self, value: int) -> None:
        import bisect
        
        # Find insertion position
        pos = bisect.bisect_left(self.intervals, [value, value])
        
        # Check if value already covered
        if pos > 0 and self.intervals[pos-1][1] >= value:
            return
        if pos < len(self.intervals) and self.intervals[pos][0] <= value <= self.intervals[pos][1]:
            return
        
        # Check merge with left interval
        merge_left = pos > 0 and self.intervals[pos-1][1] + 1 >= value
        # Check merge with right interval
        merge_right = pos < len(self.intervals) and self.intervals[pos][0] - 1 <= value
        
        if merge_left and merge_right:
            # Merge both: extend left to cover right, remove right
            self.intervals[pos-1][1] = self.intervals[pos][1]
            self.intervals.pop(pos)
        elif merge_left:
            # Extend left interval
            self.intervals[pos-1][1] = max(self.intervals[pos-1][1], value)
        elif merge_right:
            # Extend right interval
            self.intervals[pos][0] = min(self.intervals[pos][0], value)
        else:
            # No merge, insert new interval
            self.intervals.insert(pos, [value, value])
    
    def getIntervals(self):
        return self.intervals

# Explanation:
# 1. Use sorted list to maintain intervals
# 2. Binary search finds where to insert/merge
# 3. Check if already covered to avoid duplicates
# 4. Four cases based on touching left/right:
#    - Both: merge left and right through new number
#    - Left only: extend left interval's end
#    - Right only: extend right interval's start
#    - Neither: insert new [value, value] interval
# 5. Touching condition: end+1 >= value or start-1 <= value
```

**JavaScript:**
```javascript
class SummaryRanges:
    function __init__(self) {
        self.intervals = []
    
    def addNum(self, value: int) -> null:
        import bisect
        
        # Find insertion position
        pos = bisect.bisect_left(self.intervals, [value, value])
        
        # Check if value already covered
        if pos > 0 and self.intervals[pos-1][1] >= value:
            return
        if pos < len(self.intervals) and self.intervals[pos][0] <= value <= self.intervals[pos][1]:
            return
        
        # Check merge with left interval
        merge_left = pos > 0 and self.intervals[pos-1][1] + 1 >= value
        # Check merge with right interval
        merge_right = pos < len(self.intervals) and self.intervals[pos][0] - 1 <= value
        
        if merge_left and merge_right:
            # Merge both: extend left to cover right, remove right
            self.intervals[pos-1][1] = self.intervals[pos][1]
            self.intervals.pop(pos)
        elif merge_left:
            # Extend left interval
            self.intervals[pos-1][1] = max(self.intervals[pos-1][1], value)
        elif merge_right:
            # Extend right interval
            self.intervals[pos][0] = min(self.intervals[pos][0], value)
        else:
            # No merge, insert new interval
            self.intervals.insert(pos, [value, value])
    
    function getIntervals(self) {
        return self.intervals

# Explanation:
# 1. Use sorted list to maintain intervals
# 2. Binary search finds where to insert/merge
# 3. Check if already covered to avoid duplicates
# 4. Four cases based on touching left/right:
#    - Both: merge left and right through new number
#    - Left only: extend left interval's end
#    - Right only: extend right interval's start
#    - Neither: insert new [value, value] interval
# 5. Touching condition: end+1 >= value or start-1 <= value
```

### Complexity Analysis

- **Time Complexity:** O(n) per addNum (insertion/deletion in list), O(1) for getIntervals
- **Space Complexity:** O(n) - storing all disjoint intervals

### Test Cases

**Test 1:** First number creates interval
- Input: "addNum(1), getIntervals()"
- Expected: "[[1,1]]"

**Test 2:** Non-consecutive numbers
- Input: "addNum(1), addNum(3), addNum(7), getIntervals()"
- Expected: "[[1,1],[3,3],[7,7]]"

**Test 3:** Consecutive numbers merge
- Input: "addNum(1), addNum(2), addNum(3), getIntervals()"
- Expected: "[[1,3]]"

**Test 4:** Middle number merges intervals
- Input: "addNum(1), addNum(3), addNum(2), getIntervals()"
- Expected: "[[1,3]]"

**Test 5:** Duplicate number
- Input: "addNum(1), addNum(1), getIntervals()"
- Expected: "[[1,1]]"

**Test 6:** Reverse order merging
- Input: "addNum(5), addNum(3), addNum(4), getIntervals()"
- Expected: "[[3,5]]"

---

## 7. Interval List Intersections

**Difficulty:** medium
**Concept:** intervals
**Family:** intervals:intersection

### Description

You are given two lists of closed intervals, firstList and secondList. Each list is pairwise disjoint and sorted. Return the intersection of these two interval lists.

### Key Insight

Use two pointers, one for each list. For each pair of intervals, check if they overlap: overlap exists if max(start1, start2) <= min(end1, end2). If they overlap, add intersection [max(start1, start2), min(end1, end2)] to result. Advance the pointer of whichever interval ends first.

### Examples

**Example 1:**
- Input: firstList = [[0,2],[5,10],[13,23],[24,25]], secondList = [[1,5],[8,12],[15,24],[25,26]]
- Output: [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]
- Explanation: Find all overlapping regions between the two lists

**Example 2:**
- Input: firstList = [[1,3],[5,9]], secondList = []
- Output: []
- Explanation: Empty second list means no intersections

**Example 3:**
- Input: firstList = [[1,7]], secondList = [[3,10]]
- Output: [[3,7]]
- Explanation: Intersection is [max(1,3), min(7,10)] = [3,7]

### Hints

1. Use two pointers, i for firstList and j for secondList
2. Two intervals [a,b] and [c,d] overlap if max(a,c) <= min(b,d)
3. If they overlap, intersection is [max(a,c), min(b,d)]
4. After processing a pair, which pointer to advance?
5. Advance the pointer of the interval that ends first
6. Why? The one ending first can't overlap with next interval from other list

### Starter Code

**Python:**
```python
def intervalIntersection(firstList, secondList):
    """
    Find all intersections between two interval lists.
    
    Args:
        firstList: List[List[int]] - first sorted interval list
        secondList: List[List[int]] - second sorted interval list
    
    Returns:
        List[List[int]] - all intersections
    """
    # TODO: Use two pointers for both lists
    
    # TODO: For each pair, check if intervals overlap
    # Overlap: max(start1, start2) <= min(end1, end2)
    
    # TODO: If overlap, add [max(start1, start2), min(end1, end2)]
    
    # TODO: Advance pointer of interval that ends first
    
    pass
```

**JavaScript:**
```javascript
function intervalIntersection(firstList, secondList) {
    """
    Find all intersections between two interval lists.
    
    Args:
        firstList: Array] - first sorted interval list
        secondList: Array] - second sorted interval list
    
    Returns:
        Array] - all intersections
    """
    // TODO: Use two pointers for both lists
    
    // TODO: For each pair, check if intervals overlap
    # Overlap: max(start1, start2) <= min(end1, end2)
    
    // TODO: If overlap, add [max(start1, start2), min(end1, end2)]
    
    // TODO: Advance pointer of interval that ends first
  // TODO: implement
```

### Solution

**Python:**
```python
def intervalIntersection(firstList, secondList):
    result = []
    i = j = 0
    
    while i < len(firstList) and j < len(secondList):
        start1, end1 = firstList[i]
        start2, end2 = secondList[j]
        
        # Check if intervals overlap
        # Overlap exists if max(starts) <= min(ends)
        start = max(start1, start2)
        end = min(end1, end2)
        
        if start <= end:
            # They overlap, add intersection
            result.append([start, end])
        
        # Advance pointer of interval that ends first
        if end1 < end2:
            i += 1
        else:
            j += 1
    
    return result

# Explanation:
# 1. Two pointers scan both lists simultaneously
# 2. For current pair, find potential intersection:
#    - start = max(start1, start2) - latest start
#    - end = min(end1, end2) - earliest end
# 3. If start <= end, intervals overlap (add to result)
# 4. Advance pointer of interval ending first
#    - Why? It can't intersect with next from other list
# 5. Continue until one list exhausted
# 
# Time: O(m + n) - each interval processed once
```

**JavaScript:**
```javascript
function intervalIntersection(firstList, secondList) {
    result = []
    i = j = 0
    
    while i < len(firstList) and j < len(secondList):
        start1, end1 = firstArray
        start2, end2 = secondArray
        
        # Check if intervals overlap
        # Overlap exists if max(starts) <= min(ends)
        start = max(start1, start2)
        end = min(end1, end2)
        
        if start <= end:
            # They overlap, add intersection
            result.append([start, end])
        
        # Advance pointer of interval that ends first
        if end1 < end2:
            i += 1
        else:
            j += 1
    
    return result

# Explanation:
# 1. Two pointers scan both lists simultaneously
# 2. For current pair, find potential intersection:
#    - start = max(start1, start2) - latest start
#    - end = min(end1, end2) - earliest end
# 3. If start <= end, intervals overlap (add to result)
# 4. Advance pointer of interval ending first
#    - Why? It can't intersect with next from other list
# 5. Continue until one list exhausted
# 
# Time: O(m + n) - each interval processed once
```

### Complexity Analysis

- **Time Complexity:** O(m + n) - single pass through both lists
- **Space Complexity:** O(1) - only output space, O(min(m,n)) if counting output

### Test Cases

**Test 1:** Multiple intersections
- Input: "intervalIntersection([[0,2],[5,10],[13,23],[24,25]], [[1,5],[8,12],[15,24],[25,26]])"
- Expected: "[[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]"

**Test 2:** Empty second list
- Input: "intervalIntersection([[1,3],[5,9]], [])"
- Expected: "[]"

**Test 3:** Empty first list
- Input: "intervalIntersection([], [[4,8],[10,12]])"
- Expected: "[]"

**Test 4:** Single intersection
- Input: "intervalIntersection([[1,7]], [[3,10]])"
- Expected: "[[3,7]]"

**Test 5:** Partial overlaps
- Input: "intervalIntersection([[1,3],[5,7]], [[2,4],[6,8]])"
- Expected: "[[2,3],[6,7]]"

**Test 6:** No overlap
- Input: "intervalIntersection([[1,5]], [[6,10]])"
- Expected: "[]"

---

## 8. Remove Covered Intervals

**Difficulty:** medium
**Concept:** intervals
**Family:** intervals:merge-overlapping

### Description

Given an array of intervals where intervals[i] = [li, ri], remove all intervals that are covered by another interval. Interval [a,b] is covered by [c,d] if c <= a and b <= d. Return the number of remaining intervals.

### Key Insight

Sort intervals by start time ascending, and by end time descending when starts are equal. Then scan: track the maximum end seen so far. If current interval's end <= max end, it's covered (don't count it). Otherwise, update max end and count it. The sorting ensures we check covering relationships correctly.

### Examples

**Example 1:**
- Input: intervals = [[1,4],[3,6],[2,8]]
- Output: 2
- Explanation: [1,4] is covered by [2,8]. Remaining: [3,6], [2,8]

**Example 2:**
- Input: intervals = [[1,4],[2,3]]
- Output: 1
- Explanation: [2,3] is covered by [1,4]. Remaining: [1,4]

**Example 3:**
- Input: intervals = [[1,2],[1,4],[3,4]]
- Output: 2
- Explanation: [1,2] is covered by [1,4]. Remaining: [1,4], [3,4]

### Hints

1. Key insight: sort by start time, then by end time descending
2. Why sort by end descending when starts equal? So longer intervals come first
3. After sorting, scan and track the maximum end seen so far
4. If current interval's end <= max_end, it's fully covered
5. Why? Because current start >= previous starts (sorted), and end <= max_end
6. Count only intervals that extend beyond max_end seen
7. Start with count = 0 and max_end = 0 (or negative infinity)

### Starter Code

**Python:**
```python
def removeCoveredIntervals(intervals):
    """
    Count intervals not covered by any other interval.
    
    Args:
        intervals: List[List[int]] - array of intervals
    
    Returns:
        int - number of remaining intervals
    """
    # TODO: Sort by start ascending, then by end descending
    
    # TODO: Track maximum end seen so far
    
    # TODO: For each interval:
    # - If end <= max_end, it's covered (skip it)
    # - Otherwise, update max_end and count it
    
    pass
```

**JavaScript:**
```javascript
function removeCoveredIntervals(intervals) {
    """
    Count intervals not covered by any other interval.
    
    Args:
        intervals: Array] - array of intervals
    
    Returns:
        int - number of remaining intervals
    """
    // TODO: Sort by start ascending, then by end descending
    
    // TODO: Track maximum end seen so far
    
    // TODO: For each interval:
    # - If end <= max_end, it's covered (skip it)
    # - Otherwise, update max_end and count it
  // TODO: implement
```

### Solution

**Python:**
```python
def removeCoveredIntervals(intervals):
    # Sort by start ascending, end descending
    # This ensures longer intervals with same start come first
    intervals.sort(key=lambda x: (x[0], -x[1]))
    
    count = 0
    max_end = 0
    
    for start, end in intervals:
        # If current end > max_end, it's not covered
        if end > max_end:
            count += 1
            max_end = end
        # else: current interval is covered (end <= max_end)
    
    return count

# Explanation:
# 1. Sort by (start ascending, end descending)
#    - Groups intervals by start
#    - Within same start, longer intervals come first
# 2. Track maximum end seen (represents covering interval)
# 3. For each interval:
#    - If end > max_end: not covered, count it, update max_end
#    - If end <= max_end: covered by previous interval
# 4. Why it works:
#    - After sorting, if current.end <= max_end and
#      current.start >= previous.start (guaranteed by sort)
#    - Then current is covered by the interval that created max_end
# 
# Example: [[1,4],[2,3],[2,8]]
# After sort: [[1,4],[2,8],[2,3]]
# Process [1,4]: count=1, max_end=4
# Process [2,8]: 8>4, count=2, max_end=8
# Process [2,3]: 3<=8, covered, count=2
```

**JavaScript:**
```javascript
function removeCoveredIntervals(intervals) {
    # Sort by start ascending, end descending
    # This ensures longer intervals with same start come first
    intervals.sort(key=lambda x: (x[0], -x[1]))
    
    count = 0
    max_end = 0
    
    for start, end in intervals:
        # If current end > max_end, it's not covered
        if end > max_end:
            count += 1
            max_end = end
        # else: current interval is covered (end <= max_end)
    
    return count

# Explanation:
# 1. Sort by (start ascending, end descending)
#    - Groups intervals by start
#    - Within same start, longer intervals come first
# 2. Track maximum end seen (represents covering interval)
# 3. For each interval:
#    - If end > max_end: not covered, count it, update max_end
#    - If end <= max_end: covered by previous interval
# 4. Why it works:
#    - After sorting, if current.end <= max_end and
#      current.start >= previous.start (guaranteed by sort)
#    - Then current is covered by the interval that created max_end
# 
# Example: [[1,4],[2,3],[2,8]]
# After sort: [[1,4],[2,8],[2,3]]
# Process [1,4]: count=1, max_end=4
# Process [2,8]: 8>4, count=2, max_end=8
# Process [2,3]: 3<=8, covered, count=2
```

### Complexity Analysis

- **Time Complexity:** O(n log n) - dominated by sorting
- **Space Complexity:** O(1) - only variables, or O(n) if counting sort space

### Test Cases

**Test 1:** One interval covered
- Input: "removeCoveredIntervals([[1,4],[3,6],[2,8]])"
- Expected: "2"

**Test 2:** Nested interval
- Input: "removeCoveredIntervals([[1,4],[2,3]])"
- Expected: "1"

**Test 3:** Same start, different ends
- Input: "removeCoveredIntervals([[1,2],[1,4],[3,4]])"
- Expected: "2"

**Test 4:** Duplicate intervals
- Input: "removeCoveredIntervals([[1,4],[1,4]])"
- Expected: "1"

**Test 5:** No covered intervals
- Input: "removeCoveredIntervals([[1,2],[3,4],[5,6]])"
- Expected: "3"

**Test 6:** One interval covers all others
- Input: "removeCoveredIntervals([[1,10],[2,3],[4,5],[6,7]])"
- Expected: "1"

---

## 9. Meeting Rooms II (Sweep Line)

**Difficulty:** medium
**Concept:** intervals
**Family:** intervals:meeting-rooms

### Description

Given an array of meeting time intervals where intervals[i] = [start_i, end_i], return the minimum number of conference rooms required. This is a classic sweep line problem!

### Key Insight

Sweep Line: Separate start and end events, sort all events. Track active meetings: +1 at start, -1 at end. Maximum active meetings at any point = rooms needed.

### Examples

**Example 1:**
- Input: intervals = [[0,30],[5,10],[15,20]]
- Output: 2
- Explanation: At time 5-10, meetings [0,30] and [5,10] overlap. At time 15-20, [0,30] and [15,20] overlap. Need 2 rooms.

**Example 2:**
- Input: intervals = [[7,10],[2,4]]
- Output: 1
- Explanation: No overlap, meetings can use same room sequentially

### Hints

1. Sweep Line approach: treat starts and ends as separate events
2. Create events: (time, +1) for starts, (time, -1) for ends
3. IMPORTANT: When start and end at same time, process end first (room freed before reused)
4. Sort events by: (time, event_type) where ends come before starts at same time
5. Sweep through events: active += event_type, max_rooms = max(max_rooms, active)
6. Alternative: sort starts and ends separately, use two pointers

### Starter Code

**Python:**
```python
def min_meeting_rooms(intervals):
    """
    Find minimum conference rooms using sweep line.

    Args:
        intervals: List[List[int]] - [[start, end], ...]
    Returns:
        int - minimum rooms needed
    """
    # TODO: Create events list: (time, event_type)
    # +1 for start, -1 for end
    # TODO: Sort events by time
    # TODO: Sweep through events, track active meetings
    # TODO: Return maximum active count
    pass
```

**JavaScript:**
```javascript
function min_meeting_rooms(intervals) {
    """
    Find minimum conference rooms using sweep line.

    Args:
        intervals: Array] - [[start, end], ...]
    Returns:
        int - minimum rooms needed
    """
    // TODO: Create events list: (time, event_type)
    # +1 for start, -1 for end
    // TODO: Sort events by time
    // TODO: Sweep through events, track active meetings
    // TODO: Return maximum active count
  // TODO: implement
```

### Solution

**Python:**
```python
def min_meeting_rooms(intervals):
    if not intervals:
        return 0

    # Create events: (time, type) where type=1 for start, type=-1 for end
    # Sort ends before starts at same time (room freed before reused)
    events = []
    for start, end in intervals:
        events.append((start, 1))   # Meeting starts
        events.append((end, -1))    # Meeting ends

    # Sort: first by time, then by type (ends before starts)
    events.sort()

    max_rooms = 0
    active_meetings = 0

    for time, event_type in events:
        active_meetings += event_type
        max_rooms = max(max_rooms, active_meetings)

    return max_rooms
```

**JavaScript:**
```javascript
function min_meeting_rooms(intervals) {
    if not intervals:
        return 0

    # Create events: (time, type) where type=1 for start, type=-1 for end
    # Sort ends before starts at same time (room freed before reused)
    events = []
    for start, end in intervals:
        events.append((start, 1))   # Meeting starts
        events.append((end, -1))    # Meeting ends

    # Sort: first by time, then by type (ends before starts)
    events.sort()

    max_rooms = 0
    active_meetings = 0

    for time, event_type in events:
        active_meetings += event_type
        max_rooms = max(max_rooms, active_meetings)

    return max_rooms
```

### Complexity Analysis

- **Time Complexity:** O(n log n) for sorting events
- **Space Complexity:** O(n) for events list

### Test Cases

**Test 1:** Multiple overlaps
- Input: "min_meeting_rooms([[0,30],[5,10],[15,20]])"
- Expected: "2"

**Test 2:** No overlap
- Input: "min_meeting_rooms([[7,10],[2,4]])"
- Expected: "1"

**Test 3:** Maximum 3 concurrent meetings
- Input: "min_meeting_rooms([[1,5],[2,3],[3,9],[4,6]])"
- Expected: "3"

---

## 10. The Skyline Problem (Advanced Sweep Line)

**Difficulty:** hard
**Concept:** intervals
**Family:** intervals:sweep-line-advanced

### Description

A city's skyline is the outer contour formed by all the buildings when viewed from a distance. Given locations and heights of buildings, return the skyline formed by these buildings. The output is a list of "key points" [x, h] where h is the height of the skyline at x.

### Key Insight

Advanced Sweep Line with heap! At each building edge, track active buildings using max-heap. Skyline changes when max height changes. Use events: (x, -h, start) and (x, h, end).

### Examples

**Example 1:**
- Input: buildings=[[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]
- Output: [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]
- Explanation: Heights change at these x-coordinates forming the skyline outline

### Hints

1. Events: (x, start/end, height). Sort by x, then start before end, then height
2. Use max-heap to track active building heights (use negative for max-heap)
3. Use counter to track how many buildings have each height (for removals)
4. At each x: process all events, update heap, check if max height changed
5. Add key point when skyline height changes
6. Handle buildings starting and ending at same x carefully
7. This is one of the hardest sweep line problems!

### Starter Code

**Python:**
```python
def get_skyline(buildings):
    """
    Find skyline using sweep line with max-heap.

    Args:
        buildings: List[List[int]] - [[left, right, height], ...]
    Returns:
        List[List[int]] - [[x, h], ...] key points
    """
    import heapq
    from collections import defaultdict

    # TODO: Create events: (x, event_type, height)
    # Start: (left, 0, -height) - use -height for max-heap
    # End: (right, 1, height)
    # TODO: Sort events
    # TODO: Use heap to track active heights, count occurrences
    # TODO: When max height changes, add to result
    pass
```

**JavaScript:**
```javascript
function get_skyline(buildings) {
    """
    Find skyline using sweep line with max-heap.

    Args:
        buildings: Array] - [[left, right, height], ...]
    Returns:
        Array] - [[x, h], ...] key points
    """
    import heapq
    from collections import defaultdict

    // TODO: Create events: (x, event_type, height)
    # Start: (left, 0, -height) - use -height for max-heap
    # End: (right, 1, height)
    // TODO: Sort events
    // TODO: Use heap to track active heights, count occurrences
    // TODO: When max height changes, add to result
  // TODO: implement
```

### Solution

**Python:**
```python
def get_skyline(buildings):
    import heapq
    from collections import defaultdict

    # Create events: (x, type, height)
    # type=0 for start, type=1 for end
    # For max-heap, use negative height at start
    events = []
    for left, right, height in buildings:
        events.append((left, 0, -height))  # Start (negative for max-heap)
        events.append((right, 1, height))   # End

    # Sort events: x, then starts before ends, then by height
    events.sort()

    result = []
    heap = [0]  # Max-heap of active heights (0 = ground)
    height_count = defaultdict(int)
    height_count[0] = 1

    for x, event_type, h in events:
        if event_type == 0:  # Building starts
            h = -h  # Convert back to positive
            heapq.heappush(heap, -h)  # Push negative for max-heap
            height_count[h] += 1
        else:  # Building ends
            height_count[h] -= 1
            if height_count[h] == 0:
                del height_count[h]

        # Remove invalid heights from heap top
        while heap and -heap[0] not in height_count:
            heapq.heappop(heap)

        # Current max height
        max_h = -heap[0] if heap else 0

        # If height changed, add key point
        if not result or result[-1][1] != max_h:
            result.append([x, max_h])

    return result
```

**JavaScript:**
```javascript
function get_skyline(buildings) {
    import heapq
    from collections import defaultdict

    # Create events: (x, type, height)
    # type=0 for start, type=1 for end
    # For max-heap, use negative height at start
    events = []
    for left, right, height in buildings:
        events.append((left, 0, -height))  # Start (negative for max-heap)
        events.append((right, 1, height))   # End

    # Sort events: x, then starts before ends, then by height
    events.sort()

    result = []
    heap = [0]  # Max-heap of active heights (0 = ground)
    height_count = defaultdict(int)
    height_count[0] = 1

    for x, event_type, h in events:
        if event_type == 0:  # Building starts
            h = -h  # Convert back to positive
            heapq.heappush(heap, -h)  # Push negative for max-heap
            height_count[h] += 1
        else:  # Building ends
            height_count[h] -= 1
            if height_count[h] == 0:
                del height_count[h]

        # Remove invalid heights from heap top
        while heap and -heap[0] not in height_count:
            heapq.heappop(heap)

        # Current max height
        max_h = -heap[0] if heap else 0

        # If height changed, add key point
        if not result or result[-1][1] != max_h:
            result.append([x, max_h])

    return result
```

### Complexity Analysis

- **Time Complexity:** O(n log n) for sorting and heap operations
- **Space Complexity:** O(n) for events and heap

### Test Cases

**Test 1:** Classic skyline example
- Input: "get_skyline([[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]])"
- Expected: "[[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]"

**Test 2:** Continuous buildings same height
- Input: "get_skyline([[0,2,3],[2,5,3]])"
- Expected: "[[0,3],[5,0]]"

---

## 11. Car Fleet II (Sweep Line with Monotonic Stack)

**Difficulty:** hard
**Concept:** intervals
**Family:** intervals:sweep-line-advanced

### Description

Cars are on a single lane road with different positions and speeds. Find when each car collides with the car ahead (or never). Cars can only move forward and cannot pass each other.

### Key Insight

Sweep from right to left with monotonic stack! For each car, pop slower cars it will catch. Calculate collision time. Stack maintains cars that could affect cars to the left.

### Examples

**Example 1:**
- Input: position=[1,2,3], speed=[2,1,1]
- Output: [1.5, -1, -1]
- Explanation: Car 0 catches car 1 at time 1.5. Cars 1 and 2 never collide (same speed, car 2 ahead).

### Hints

1. Process cars from right to left (last car first)
2. Stack stores indices of cars that could collide with cars to their left
3. For car i: while stack not empty and car i faster than stack top, pop
4. Calculate time to catch: (pos[j] - pos[i]) / (speed[i] - speed[j])
5. If car i collides before stack top collides, use car i's collision time
6. Maintain stack in decreasing speed order (faster cars pop slower ones)
7. Collision time formula: time = distance / speed_difference

### Starter Code

**Python:**
```python
def get_collision_times(position, speed):
    """
    Find collision times using sweep line with stack.

    Args:
        position: List[int] - starting positions
        speed: List[int] - speeds
    Returns:
        List[float] - collision times (-1 if never)
    """
    n = len(position)
    result = [-1.0] * n
    stack = []  # Monotonic stack of car indices

    # TODO: Sweep from right to left
    # For each car, pop cars it will catch
    # Calculate collision time
    # Add car to stack
    pass
```

**JavaScript:**
```javascript
function get_collision_times(position, speed) {
    """
    Find collision times using sweep line with stack.

    Args:
        position: Array - starting positions
        speed: Array - speeds
    Returns:
        Array - collision times (-1 if never)
    """
    n = len(position)
    result = [-1.0] * n
    stack = []  # Monotonic stack of car indices

    // TODO: Sweep from right to left
    # For each car, pop cars it will catch
    # Calculate collision time
    # Add car to stack
  // TODO: implement
```

### Solution

**Python:**
```python
def get_collision_times(position, speed):
    n = len(position)
    result = [-1.0] * n
    stack = []

    # Process cars from right to left
    for i in range(n - 1, -1, -1):
        # Pop cars that car i will catch before they collide
        while stack:
            j = stack[-1]

            # If car i slower or same speed, can't catch
            if speed[i] <= speed[j]:
                stack.pop()
                continue

            # Calculate time to catch car j
            catch_time = (position[j] - position[i]) / (speed[i] - speed[j])

            # If car j collides before car i catches it, pop j
            if result[j] != -1 and catch_time >= result[j]:
                stack.pop()
            else:
                result[i] = catch_time
                break

        stack.append(i)

    return result
```

**JavaScript:**
```javascript
function get_collision_times(position, speed) {
    n = len(position)
    result = [-1.0] * n
    stack = []

    # Process cars from right to left
    for i in range(n - 1, -1, -1):
        # Pop cars that car i will catch before they collide
        while stack:
            j = stack[-1]

            # If car i slower or same speed, can't catch
            if speed[i] <= speed[j]:
                stack.pop()
                continue

            # Calculate time to catch car j
            catch_time = (position[j] - position[i]) / (speed[i] - speed[j])

            # If car j collides before car i catches it, pop j
            if result[j] != -1 and catch_time >= result[j]:
                stack.pop()
            else:
                result[i] = catch_time
                break

        stack.append(i)

    return result
```

### Complexity Analysis

- **Time Complexity:** O(n) - each car pushed/popped once
- **Space Complexity:** O(n) for stack

### Test Cases

**Test 1:** One collision
- Input: "get_collision_times([1,2,3], [2,1,1])"
- Expected: "[1.5, -1.0, -1.0]"

**Test 2:** Chain collisions
- Input: "get_collision_times([3,5,7], [3,2,1])"
- Expected: "[2.0, 4.0, -1.0]"

---

## 12. Employee Free Time (Sweep Line)

**Difficulty:** hard
**Concept:** intervals
**Family:** intervals:sweep-line-advanced

### Description

Given a list of employee schedules (each employee has a list of non-overlapping intervals), return the finite list of intervals representing common free time for all employees.

### Key Insight

Sweep line to find gaps! Merge all intervals across all employees. Free time = gaps between merged busy intervals. Alternative: track coverage count at each point.

### Examples

**Example 1:**
- Input: schedule=[[[1,2],[5,6]],[[1,3]],[[4,10]]]
- Output: [[3,4]]
- Explanation: All employees busy during [1,3], [4,10]. Free time is [3,4].

**Example 2:**
- Input: schedule=[[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]
- Output: [[5,6],[7,9]]
- Explanation: Busy: [1,5], [6,7], [9,12]. Free: [5,6], [7,9].

### Hints

1. Flatten schedule: all_intervals = [interval for employee in schedule for interval in employee]
2. Sort all intervals by start time
3. Merge overlapping intervals (like merge intervals problem)
4. Gaps between merged intervals = free time
5. Alternative: use events with counters (start=+1, end=-1), find when count=0
6. Return only the gaps, not boundary times
7. Time: O(n log n) where n = total intervals

### Starter Code

**Python:**
```python
def employee_free_time(schedule):
    """
    Find common free time using sweep line.

    Args:
        schedule: List[List[List[int]]] - employee schedules
    Returns:
        List[List[int]] - free time intervals
    """
    # TODO: Flatten all intervals into single list
    # TODO: Sort by start time
    # TODO: Merge overlapping intervals
    # TODO: Find gaps between merged intervals
    pass
```

**JavaScript:**
```javascript
function employee_free_time(schedule) {
    """
    Find common free time using sweep line.

    Args:
        schedule: Array]] - employee schedules
    Returns:
        Array] - free time intervals
    """
    // TODO: Flatten all intervals into single list
    // TODO: Sort by start time
    // TODO: Merge overlapping intervals
    // TODO: Find gaps between merged intervals
  // TODO: implement
```

### Solution

**Python:**
```python
def employee_free_time(schedule):
    # Flatten all intervals
    all_intervals = []
    for employee in schedule:
        all_intervals.extend(employee)

    # Sort by start time
    all_intervals.sort(key=lambda x: x[0])

    # Merge overlapping intervals
    merged = [all_intervals[0]]
    for start, end in all_intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])

    # Find gaps between merged intervals
    free_time = []
    for i in range(1, len(merged)):
        gap_start = merged[i-1][1]
        gap_end = merged[i][0]
        if gap_start < gap_end:
            free_time.append([gap_start, gap_end])

    return free_time
```

**JavaScript:**
```javascript
function employee_free_time(schedule) {
    # Flatten all intervals
    all_intervals = []
    for employee in schedule:
        all_intervals.extend(employee)

    # Sort by start time
    all_intervals.sort(key=lambda x: x[0])

    # Merge overlapping intervals
    merged = [all_intervals[0]]
    for start, end in all_intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])

    # Find gaps between merged intervals
    free_time = []
    for i in range(1, len(merged)):
        gap_start = merged[i-1][1]
        gap_end = merged[i][0]
        if gap_start < gap_end:
            free_time.append([gap_start, gap_end])

    return free_time
```

### Complexity Analysis

- **Time Complexity:** O(n log n) where n = total number of intervals
- **Space Complexity:** O(n) for flattened and merged intervals

### Test Cases

**Test 1:** Single gap in schedule
- Input: "employee_free_time([[[1,2],[5,6]],[[1,3]],[[4,10]]])"
- Expected: "[[3,4]]"

**Test 2:** Multiple gaps
- Input: "employee_free_time([[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]])"
- Expected: "[[5,6],[7,9]]"

**Test 3:** No free time (continuous coverage)
- Input: "employee_free_time([[[1,3]],[[2,4]],[[3,5]]])"
- Expected: "[]"

---
