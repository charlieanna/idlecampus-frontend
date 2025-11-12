# ARRAY-PARTITIONING Problems

Total Problems: 6

---

## 1. Sort Colors

**Difficulty:** medium
**Concept:** array-partitioning

### Description

Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with colors in order red, white, and blue. Use integers 0, 1, and 2 to represent red, white, and blue respectively. You must solve this without using the library's sort function.

### Key Insight

Dutch National Flag algorithm: Use three pointers (low, mid, high). Keep all 0s before low, all 2s after high, and process 1s in the middle. Swap elements to their correct regions in a single pass.

### Examples

**Example 1:**
- Input: nums = [2,0,2,1,1,0]
- Output: [0,0,1,1,2,2]
- Explanation: All 0s first, then 1s, then 2s

**Example 2:**
- Input: nums = [2,0,1]
- Output: [0,1,2]
- Explanation: One of each color sorted

**Example 3:**
- Input: nums = [0]
- Output: [0]
- Explanation: Single element

### Hints

1. This is the Dutch National Flag problem - think about three regions
2. Region 1: [0...low-1] contains all 0s
3. Region 2: [low...mid-1] contains all 1s (already sorted)
4. Region 3: [high+1...n-1] contains all 2s
5. When you see a 0, swap it to the low region and expand that region
6. When you see a 2, swap it to the high region and shrink the unknown region
7. When you see a 1, it's in the right place - just move mid forward

### Starter Code

**Python:**
```python
def sortColors(nums):
    """
    Sort array of 0s, 1s, and 2s in-place.
    
    Args:
        nums: List[int] - array containing only 0, 1, 2
    
    Returns:
        None - modifies nums in-place
    """
    # TODO: Initialize three pointers: low, mid, high
    
    # TODO: Process elements with mid pointer
    # - If 0: swap with low, increment both
    # - If 1: just increment mid
    # - If 2: swap with high, decrement high only
    
    pass
```

**JavaScript:**
```javascript
function sortColors(nums) {
    """
    Sort array of 0s, 1s, and 2s in-place.
    
    Args:
        nums: Array - array containing only 0, 1, 2
    
    Returns:
        null - modifies nums in-place
    """
    // TODO: Initialize three pointers: low, mid, high
    
    // TODO: Process elements with mid pointer
    # - If 0: swap with low, increment both
    # - If 1: just increment mid
    # - If 2: swap with high, decrement high only
  // TODO: implement
```

### Solution

**Python:**
```python
def sortColors(nums):
    low = 0
    mid = 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            # Swap 0 to low region
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            # 1 is in correct region
            mid += 1
        else:  # nums[mid] == 2
            # Swap 2 to high region
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
            # Don't increment mid - need to check swapped element

# Explanation:
# - low: boundary of 0s region (everything before is 0)
# - high: boundary of 2s region (everything after is 2)
# - mid: current element being examined
# - [0...low-1] = 0s, [low...mid-1] = 1s, [high+1...n-1] = 2s
# - Single pass achieves O(n) time with O(1) space
```

**JavaScript:**
```javascript
function sortColors(nums) {
    low = 0
    mid = 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            # Swap 0 to low region
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            # 1 is in correct region
            mid += 1
        else:  # nums[mid] == 2
            # Swap 2 to high region
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
            # Don't increment mid - need to check swapped element

# Explanation:
# - low: boundary of 0s region (everything before is 0)
# - high: boundary of 2s region (everything after is 2)
# - mid: current element being examined
# - [0...low-1] = 0s, [low...mid-1] = 1s, [high+1...n-1] = 2s
# - Single pass achieves O(n) time with O(1) space
```

### Complexity Analysis

- **Time Complexity:** O(n) - single pass through array
- **Space Complexity:** O(1) - only three pointers used

### Test Cases

**Test 1:** Mixed colors
- Input: "sortColors([2,0,2,1,1,0])"
- Expected: "[0,0,1,1,2,2]"

**Test 2:** One of each
- Input: "sortColors([2,0,1])"
- Expected: "[0,1,2]"

**Test 3:** Single element
- Input: "sortColors([0])"
- Expected: "[0]"

**Test 4:** All same color
- Input: "sortColors([1,1,1,1])"
- Expected: "[1,1,1,1]"

**Test 5:** Pre-grouped but wrong order
- Input: "sortColors([2,2,0,0,1,1])"
- Expected: "[0,0,1,1,2,2]"

---

## 2. Find All Duplicates in an Array

**Difficulty:** medium
**Concept:** array-partitioning

### Description

Given an integer array nums of length n where all integers are in range [1, n] and each integer appears once or twice, return an array of all integers that appear twice. Solve it without extra space and in O(n) time.

### Key Insight

Use the array indices as a hash map. Since values are in [1,n], we can use value-1 as an index. Mark visited by negating the element at that index. If already negative, it's a duplicate.

### Examples

**Example 1:**
- Input: nums = [4,3,2,7,8,2,3,1]
- Output: [2,3]
- Explanation: 2 and 3 appear twice

**Example 2:**
- Input: nums = [1,1,2]
- Output: [1]
- Explanation: Only 1 appears twice

**Example 3:**
- Input: nums = [1]
- Output: []
- Explanation: No duplicates

### Hints

1. The constraint "values in [1, n]" is the key - it matches array indices!
2. For number x, you can access index (x-1) to mark you've seen it
3. Mark "seen" by making nums[x-1] negative
4. When you see a number x, check if nums[abs(x)-1] is already negative
5. If negative, x is a duplicate; if positive, negate it to mark as seen
6. Use abs() when getting the value since some may already be negative

### Starter Code

**Python:**
```python
def findDuplicates(nums):
    """
    Find all duplicates in array where values are in [1, n].
    
    Args:
        nums: List[int] - array with values in range [1, n]
    
    Returns:
        List[int] - elements that appear twice
    """
    # TODO: For each number, use its value-1 as index
    
    # TODO: Mark visited by negating element at that index
    
    # TODO: If already negative, it's a duplicate
    
    pass
```

**JavaScript:**
```javascript
function findDuplicates(nums) {
    """
    Find all duplicates in array where values are in [1, n].
    
    Args:
        nums: Array - array with values in range [1, n]
    
    Returns:
        Array - elements that appear twice
    """
    // TODO: For each number, use its value-1 as index
    
    // TODO: Mark visited by negating element at that index
    
    // TODO: If already negative, it's a duplicate
  // TODO: implement
```

### Solution

**Python:**
```python
def findDuplicates(nums):
    result = []
    
    for num in nums:
        index = abs(num) - 1  # Map value to index
        
        if nums[index] < 0:
            # Already negative = we've seen this number before
            result.append(abs(num))
        else:
            # Mark as seen by negating
            nums[index] = -nums[index]
    
    return result

# Explanation:
# - For value x, use index (x-1) as its "marker slot"
# - First time seeing x: negate nums[x-1]
# - Second time seeing x: nums[x-1] is negative - it's a duplicate!
# - This works because values match index range [1,n]
# - O(n) time, O(1) space (modifies input array)
```

**JavaScript:**
```javascript
function findDuplicates(nums) {
    result = []
    
    for num in nums:
        index = abs(num) - 1  # Map value to index
        
        if nums[index] < 0:
            # Already negative = we've seen this number before
            result.append(abs(num))
        else:
            # Mark as seen by negating
            nums[index] = -nums[index]
    
    return result

# Explanation:
# - For value x, use index (x-1) as its "marker slot"
# - First time seeing x: negate nums[x-1]
# - Second time seeing x: nums[x-1] is negative - it's a duplicate!
# - This works because values match index range [1,n]
# - O(n) time, O(1) space (modifies input array)
```

### Complexity Analysis

- **Time Complexity:** O(n) - single pass
- **Space Complexity:** O(1) - no extra space, modifies input

### Test Cases

**Test 1:** Multiple duplicates
- Input: "findDuplicates([4,3,2,7,8,2,3,1])"
- Expected: "[2,3]"

**Test 2:** Single duplicate
- Input: "findDuplicates([1,1,2])"
- Expected: "[1]"

**Test 3:** No duplicates
- Input: "findDuplicates([1])"
- Expected: "[]"

**Test 4:** All duplicates
- Input: "findDuplicates([2,2])"
- Expected: "[2]"

**Test 5:** No duplicates in sequence
- Input: "findDuplicates([1,2,3,4,5])"
- Expected: "[]"

---

## 3. Find All Numbers Disappeared in an Array

**Difficulty:** easy
**Concept:** array-partitioning

### Description

Given an array nums of n integers where nums[i] is in range [1, n], return an array of all integers in range [1, n] that do not appear in nums. Solve without extra space and in O(n) time.

### Key Insight

Similar to previous problem: use array indices as hash. For each number x, mark index (x-1) as visited by negating it. After marking all, positive indices+1 are the missing numbers.

### Examples

**Example 1:**
- Input: nums = [4,3,2,7,8,2,3,1]
- Output: [5,6]
- Explanation: 5 and 6 are missing from [1,8]

**Example 2:**
- Input: nums = [1,1]
- Output: [2]
- Explanation: 2 is missing from [1,2]

### Hints

1. Use the same "index as hash" trick as Find Duplicates
2. For each number x, negate nums[abs(x)-1]
3. After processing all numbers, some indices will still be positive
4. Positive indices indicate those numbers never appeared
5. For positive nums[i], the missing number is i+1
6. Remember to use abs() since some values are already negative

### Starter Code

**Python:**
```python
def findDisappearedNumbers(nums):
    """
    Find all missing numbers in [1, n] range.
    
    Args:
        nums: List[int] - array with values in [1, n]
    
    Returns:
        List[int] - missing numbers
    """
    # TODO: Mark each number's index as negative
    
    # TODO: Collect indices that are still positive
    
    pass
```

**JavaScript:**
```javascript
function findDisappearedNumbers(nums) {
    """
    Find all missing numbers in [1, n] range.
    
    Args:
        nums: Array - array with values in [1, n]
    
    Returns:
        Array - missing numbers
    """
    // TODO: Mark each number's index as negative
    
    // TODO: Collect indices that are still positive
  // TODO: implement
```

### Solution

**Python:**
```python
def findDisappearedNumbers(nums):
    # Mark present numbers by negating at index
    for num in nums:
        index = abs(num) - 1
        nums[index] = -abs(nums[index])
    
    # Collect missing numbers
    result = []
    for i in range(len(nums)):
        if nums[i] > 0:
            result.append(i + 1)
    
    return result

# Explanation:
# - For each number x in array, negate nums[x-1]
# - After all negations, positive nums[i] means (i+1) never appeared
# - Example: [4,3,2,7,8,2,3,1]
#   After negations: [-4,-3,-2,-7,8,2,-3,-1]
#   Index 4,5 are positive → numbers 5,6 are missing
```

**JavaScript:**
```javascript
function findDisappearedNumbers(nums) {
    # Mark present numbers by negating at index
    for num in nums:
        index = abs(num) - 1
        nums[index] = -abs(nums[index])
    
    # Collect missing numbers
    result = []
    for i in range(len(nums)):
        if nums[i] > 0:
            result.append(i + 1)
    
    return result

# Explanation:
# - For each number x in array, negate nums[x-1]
# - After all negations, positive nums[i] means (i+1) never appeared
# - Example: [4,3,2,7,8,2,3,1]
#   After negations: [-4,-3,-2,-7,8,2,-3,-1]
#   Index 4,5 are positive → numbers 5,6 are missing
```

### Complexity Analysis

- **Time Complexity:** O(n) - two passes through array
- **Space Complexity:** O(1) - no extra space except output

### Test Cases

**Test 1:** Two missing numbers
- Input: "findDisappearedNumbers([4,3,2,7,8,2,3,1])"
- Expected: "[5,6]"

**Test 2:** Duplicate causes missing number
- Input: "findDisappearedNumbers([1,1])"
- Expected: "[2]"

**Test 3:** No missing numbers
- Input: "findDisappearedNumbers([1,2,3,4,5])"
- Expected: "[]"

**Test 4:** Multiple missing
- Input: "findDisappearedNumbers([2,2,2,2])"
- Expected: "[1,3,4]"

**Test 5:** Single element, no missing
- Input: "findDisappearedNumbers([1])"
- Expected: "[]"

---

## 4. First Missing Positive

**Difficulty:** hard
**Concept:** array-partitioning

### Description

Given an unsorted integer array nums, return the smallest missing positive integer. You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.

### Key Insight

Place each number in its "correct" position: number k should be at index k-1. Ignore numbers outside [1,n]. After rearranging, the first index i where nums[i] != i+1 gives the answer i+1. If all correct, answer is n+1.

### Examples

**Example 1:**
- Input: nums = [1,2,0]
- Output: 3
- Explanation: Range is [1,2], smallest missing is 3

**Example 2:**
- Input: nums = [3,4,-1,1]
- Output: 2
- Explanation: Has 1,3,4 but missing 2

**Example 3:**
- Input: nums = [7,8,9,11,12]
- Output: 1
- Explanation: No positive integers from [1,5], so answer is 1

### Hints

1. The answer must be in range [1, n+1] where n is array length
2. Idea: put each number k at index k-1 (its correct position)
3. Only care about numbers in [1, n] - others are irrelevant
4. While nums[i] is in [1,n] and not at its correct spot, swap it there
5. After placement, scan to find first i where nums[i] != i+1
6. Be careful with swap condition to avoid infinite loops

### Starter Code

**Python:**
```python
def firstMissingPositive(nums):
    """
    Find smallest missing positive integer.
    
    Args:
        nums: List[int] - unsorted array
    
    Returns:
        int - smallest missing positive
    """
    # TODO: Place each number at its correct index
    # Number k should be at index k-1
    
    # TODO: Swap until nums[i] is in range and at right spot
    
    # TODO: Find first index where nums[i] != i+1
    
    pass
```

**JavaScript:**
```javascript
function firstMissingPositive(nums) {
    """
    Find smallest missing positive integer.
    
    Args:
        nums: Array - unsorted array
    
    Returns:
        int - smallest missing positive
    """
    // TODO: Place each number at its correct index
    # Number k should be at index k-1
    
    // TODO: Swap until nums[i] is in range and at right spot
    
    // TODO: Find first index where nums[i] != i+1
  // TODO: implement
```

### Solution

**Python:**
```python
def firstMissingPositive(nums):
    n = len(nums)
    
    # Step 1: Place each number at correct index
    for i in range(n):
        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
            # Swap nums[i] to its correct position
            correct_pos = nums[i] - 1
            nums[i], nums[correct_pos] = nums[correct_pos], nums[i]
    
    # Step 2: Find first missing positive
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    
    return n + 1

# Explanation:
# - Put number k at index k-1 (e.g., 3 goes to index 2)
# - Only process numbers in [1,n] - others ignored
# - After placement, first i where nums[i] != i+1 is answer
# - If all positions filled correctly, answer is n+1
```

**JavaScript:**
```javascript
function firstMissingPositive(nums) {
    n = len(nums)
    
    # Step 1: Place each number at correct index
    for i in range(n):
        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
            # Swap nums[i] to its correct position
            correct_pos = nums[i] - 1
            nums[i], nums[correct_pos] = nums[correct_pos], nums[i]
    
    # Step 2: Find first missing positive
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    
    return n + 1

# Explanation:
# - Put number k at index k-1 (e.g., 3 goes to index 2)
# - Only process numbers in [1,n] - others ignored
# - After placement, first i where nums[i] != i+1 is answer
# - If all positions filled correctly, answer is n+1
```

### Complexity Analysis

- **Time Complexity:** O(n) - each element swapped at most once
- **Space Complexity:** O(1) - in-place rearrangement

### Test Cases

**Test 1:** Has 1,2, missing 3
- Input: "firstMissingPositive([1,2,0])"
- Expected: "3"

**Test 2:** Missing 2
- Input: "firstMissingPositive([3,4,-1,1])"
- Expected: "2"

**Test 3:** Missing 1
- Input: "firstMissingPositive([7,8,9,11,12])"
- Expected: "1"

**Test 4:** Single element
- Input: "firstMissingPositive([1])"
- Expected: "2"

**Test 5:** Has 1,2
- Input: "firstMissingPositive([2,1])"
- Expected: "3"

---

## 5. Missing Number

**Difficulty:** easy
**Concept:** array-partitioning

### Description

Given an array nums containing n distinct numbers in range [0, n], return the only number in the range that is missing from the array.

### Key Insight

Two approaches: (1) XOR: XOR all numbers and all indices - duplicates cancel, leaving missing number. (2) Math: expected sum is n*(n+1)/2, subtract actual sum to get missing number.

### Examples

**Example 1:**
- Input: nums = [3,0,1]
- Output: 2
- Explanation: Range is [0,3], missing 2

**Example 2:**
- Input: nums = [0,1]
- Output: 2
- Explanation: Range is [0,2], missing 2

**Example 3:**
- Input: nums = [9,6,4,2,3,5,7,0,1]
- Output: 8
- Explanation: Range is [0,9], missing 8

### Hints

1. Math approach: sum of [0,n] is n*(n+1)/2
2. Subtract actual array sum from expected sum
3. XOR approach: a ^ a = 0, and a ^ 0 = a
4. XOR all array values with all indices [0,n]
5. Duplicates cancel out, only missing number remains
6. Both approaches are O(n) time, O(1) space

### Starter Code

**Python:**
```python
def missingNumber(nums):
    """
    Find missing number in range [0, n].
    
    Args:
        nums: List[int] - array with n numbers from [0,n] with one missing
    
    Returns:
        int - the missing number
    """
    # TODO: XOR approach - XOR all numbers with all indices
    # OR
    # TODO: Math approach - expected_sum - actual_sum
    
    pass
```

**JavaScript:**
```javascript
function missingNumber(nums) {
    """
    Find missing number in range [0, n].
    
    Args:
        nums: Array - array with n numbers from [0,n] with one missing
    
    Returns:
        int - the missing number
    """
    // TODO: XOR approach - XOR all numbers with all indices
    # OR
    // TODO: Math approach - expected_sum - actual_sum
  // TODO: implement
```

### Solution

**Python:**
```python
def missingNumber(nums):
    # Approach 1: XOR
    result = len(nums)
    for i in range(len(nums)):
        result ^= i ^ nums[i]
    return result

# Approach 2: Math
def missingNumber_math(nums):
    n = len(nums)
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(nums)
    return expected_sum - actual_sum

# Explanation (XOR approach):
# - XOR result starts with n (the length)
# - XOR it with all indices [0, n-1] and all array values
# - Example: [3,0,1], n=3
#   result = 3 ^ (0^3) ^ (1^0) ^ (2^1) = 3 ^ 0 ^ 1 ^ 2 ^ 3 ^ 0 ^ 1
#   Duplicates cancel: 3^3=0, 0^0=0, 1^1=0, leaving 2
```

**JavaScript:**
```javascript
function missingNumber(nums) {
    # Approach 1: XOR
    result = len(nums)
    for i in range(len(nums)):
        result ^= i ^ nums[i]
    return result

# Approach 2: Math
function missingNumber_math(nums) {
    n = len(nums)
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(nums)
    return expected_sum - actual_sum

# Explanation (XOR approach):
# - XOR result starts with n (the length)
# - XOR it with all indices [0, n-1] and all array values
# - Example: [3,0,1], n=3
#   result = 3 ^ (0^3) ^ (1^0) ^ (2^1) = 3 ^ 0 ^ 1 ^ 2 ^ 3 ^ 0 ^ 1
#   Duplicates cancel: 3^3=0, 0^0=0, 1^1=0, leaving 2
```

### Complexity Analysis

- **Time Complexity:** O(n) - single pass
- **Space Complexity:** O(1) - constant space

### Test Cases

**Test 1:** Small array
- Input: "missingNumber([3,0,1])"
- Expected: "2"

**Test 2:** Missing last number
- Input: "missingNumber([0,1])"
- Expected: "2"

**Test 3:** Larger array
- Input: "missingNumber([9,6,4,2,3,5,7,0,1])"
- Expected: "8"

**Test 4:** Single element
- Input: "missingNumber([0])"
- Expected: "1"

**Test 5:** Missing 0
- Input: "missingNumber([1])"
- Expected: "0"

---

## 6. Find the Duplicate Number

**Difficulty:** medium
**Concept:** array-partitioning

### Description

Given an array of integers nums containing n+1 integers where each integer is in range [1, n] inclusive, there is only one repeated number. Return the repeated number. You must solve this without modifying the array and using only constant extra space.

### Key Insight

Treat array as a linked list where nums[i] points to nums[nums[i]]. Since there's a duplicate, there's a cycle. Use Floyd's cycle detection: slow/fast pointers find cycle, then find cycle entrance (the duplicate).

### Examples

**Example 1:**
- Input: nums = [1,3,4,2,2]
- Output: 2
- Explanation: 2 appears twice

**Example 2:**
- Input: nums = [3,1,3,4,2]
- Output: 3
- Explanation: 3 appears twice

**Example 3:**
- Input: nums = [3,3,3,3,3]
- Output: 3
- Explanation: All same number

### Hints

1. Think of array as linked list: index i points to index nums[i]
2. Duplicate creates a cycle (multiple nodes point to same next)
3. Use Floyd's algorithm: slow moves 1 step, fast moves 2 steps
4. Phase 1: slow and fast will meet inside the cycle
5. Phase 2: start new pointer at beginning, move both 1 step at a time
6. They meet at cycle entrance = the duplicate number

### Starter Code

**Python:**
```python
def findDuplicate(nums):
    """
    Find the duplicate number using cycle detection.
    
    Args:
        nums: List[int] - n+1 integers in range [1,n]
    
    Returns:
        int - the duplicate number
    """
    # TODO: Phase 1 - Find cycle using slow/fast pointers
    
    # TODO: Phase 2 - Find entrance of cycle (duplicate)
    
    pass
```

**JavaScript:**
```javascript
function findDuplicate(nums) {
    """
    Find the duplicate number using cycle detection.
    
    Args:
        nums: Array - n+1 integers in range [1,n]
    
    Returns:
        int - the duplicate number
    """
    // TODO: Phase 1 - Find cycle using slow/fast pointers
    
    // TODO: Phase 2 - Find entrance of cycle (duplicate)
  // TODO: implement
```

### Solution

**Python:**
```python
def findDuplicate(nums):
    # Phase 1: Find intersection point in cycle
    slow = fast = nums[0]
    
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    
    # Phase 2: Find entrance to cycle (duplicate)
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return slow

# Explanation:
# - Array indices form linked list: i -> nums[i]
# - Duplicate means two indices point to same value (cycle!)
# - Floyd's algorithm: Phase 1 detects cycle
# - Phase 2 finds cycle entrance
# - Example: [1,3,4,2,2]
#   0->1->3->2->4->2 (cycle: 2->4->2)
#   Duplicate is 2 (cycle entrance)
```

**JavaScript:**
```javascript
function findDuplicate(nums) {
    # Phase 1: Find intersection point in cycle
    slow = fast = nums[0]
    
    while true:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    
    # Phase 2: Find entrance to cycle (duplicate)
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return slow

# Explanation:
# - Array indices form linked list: i -> nums[i]
# - Duplicate means two indices point to same value (cycle!)
# - Floyd's algorithm: Phase 1 detects cycle
# - Phase 2 finds cycle entrance
# - Example: [1,3,4,2,2]
#   0->1->3->2->4->2 (cycle: 2->4->2)
#   Duplicate is 2 (cycle entrance)
```

### Complexity Analysis

- **Time Complexity:** O(n) - two phases, each O(n)
- **Space Complexity:** O(1) - only two pointers

### Test Cases

**Test 1:** Duplicate in middle
- Input: "findDuplicate([1,3,4,2,2])"
- Expected: "2"

**Test 2:** Duplicate at different positions
- Input: "findDuplicate([3,1,3,4,2])"
- Expected: "3"

**Test 3:** All duplicates
- Input: "findDuplicate([3,3,3,3,3])"
- Expected: "3"

**Test 4:** Larger array
- Input: "findDuplicate([2,5,9,6,9,3,8,9,7,1,4])"
- Expected: "9"

**Test 5:** Smallest case
- Input: "findDuplicate([1,1])"
- Expected: "1"

---
