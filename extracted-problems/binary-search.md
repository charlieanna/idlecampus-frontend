# BINARY-SEARCH Problems

Total Problems: 16

---

## 1. First Bad Version

**Difficulty:** easy
**Concept:** binary-search
**Family:** binary-search:first-last-position

### Description

You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Since each version is developed based on the previous version, all the versions after a bad version are also bad. Suppose you have n versions [1, 2, ..., n] and you want to find out the first bad one, which causes all the following ones to be bad. You are given an API bool isBadVersion(version) which returns whether version is bad. Implement a function to find the first bad version. You should minimize the number of calls to the API.

### Key Insight

This is a "find first occurrence" pattern. Use binary search to find the leftmost position where isBadVersion returns True. When mid is bad, search left (right = mid) because the first bad could be earlier. When mid is good, search right (left = mid + 1).

### Examples

**Example 1:**
- Input: n = 5, bad = 4
- Output: 4
- Explanation: call isBadVersion(3) -> false; call isBadVersion(5) -> true; call isBadVersion(4) -> true; Then 4 is the first bad version.

**Example 2:**
- Input: n = 1, bad = 1
- Output: 1
- Explanation: Only one version, and it is bad.

**Example 3:**
- Input: n = 10, bad = 7
- Output: 7
- Explanation: Versions 7, 8, 9, 10 are bad. Version 7 is the first bad version.

### Hints

1. Think of this as searching for the first True in [False, False, ..., False, True, True, ..., True]
2. Use the standard "find first occurrence" template: when condition is met, move right pointer to mid (not mid-1)
3. If isBadVersion(mid) is True, the first bad version is at mid or earlier, so set right = mid
4. If isBadVersion(mid) is False, the first bad version must be later, so set left = mid + 1
5. The loop terminates when left == right, which points to the first bad version
6. Be careful with mid calculation to avoid integer overflow: mid = left + (right - left) // 2

### Starter Code

**Python:**
```python
def firstBadVersion(n):
    """
    Find the first bad version using binary search.
    
    Args:
        n: int - total number of versions (1 to n)
    
    Returns:
        int - the first bad version number
    """
    # The isBadVersion API is already defined for you.
    # def isBadVersion(version: int) -> bool:
    
    # TODO: Initialize left and right pointers
    # left = 1, right = n
    
    # TODO: Binary search for first bad version
    # while left < right:
    #     mid = left + (right - left) // 2
    #     if isBadVersion(mid):
    #         # mid is bad, first bad could be at mid or left
    #         right = mid
    #     else:
    #         # mid is good, first bad must be to the right
    #         left = mid + 1
    
    # TODO: Return the first bad version
    pass
```

**JavaScript:**
```javascript
function firstBadVersion(n) {
    """
    Find the first bad version using binary search.
    
    Args:
        n: int - total number of versions (1 to n)
    
    Returns:
        int - the first bad version number
    """
    # The isBadVersion API is already defined for you.
    # def isBadVersion(version: int) -> bool:
    
    // TODO: Initialize left and right pointers
    # left = 1, right = n
    
    // TODO: Binary search for first bad version
    # while left < right:
    #     mid = left + (right - left) // 2
    #     if isBadVersion(mid):
    #         # mid is bad, first bad could be at mid or left
    #         right = mid
    #     else:
    #         # mid is good, first bad must be to the right
    #         left = mid + 1
    
    // TODO: Return the first bad version
  // TODO: implement
```

### Solution

**Python:**
```python
def firstBadVersion(n):
    """
    Find the first bad version using binary search.
    
    Time: O(log n) - binary search through n versions
    Space: O(1) - only use constant extra space
    """
    left, right = 1, n
    
    # Binary search for the first bad version
    while left < right:
        # Prevent integer overflow
        mid = left + (right - left) // 2
        
        if isBadVersion(mid):
            # mid is bad, so first bad is at mid or left of mid
            # Search in left half (including mid)
            right = mid
        else:
            # mid is good, so first bad must be right of mid
            # Search in right half (excluding mid)
            left = mid + 1
    
    # When left == right, we found the first bad version
    return left
```

**JavaScript:**
```javascript
function firstBadVersion(n) {
    """
    Find the first bad version using binary search.
    
    Time: O(log n) - binary search through n versions
    Space: O(1) - only use constant extra space
    """
    left, right = 1, n
    
    # Binary search for the first bad version
    while left < right:
        # Prevent integer overflow
        mid = left + (right - left) // 2
        
        if isBadVersion(mid):
            # mid is bad, so first bad is at mid or left of mid
            # Search in left half (including mid)
            right = mid
        else:
            # mid is good, so first bad must be right of mid
            # Search in right half (excluding mid)
            left = mid + 1
    
    # When left == right, we found the first bad version
    return left
```

### Complexity Analysis

- **Time Complexity:** O(log n) - Binary search reduces search space by half each iteration
- **Space Complexity:** O(1) - Only uses constant extra space for pointers

### Test Cases

**Test 1:** First bad at position 4
- Input: "(5, 4)"
- Expected: "4"

**Test 2:** Single version is bad
- Input: "(1, 1)"
- Expected: "1"

**Test 3:** All versions are bad
- Input: "(10, 1)"
- Expected: "1"

**Test 4:** Only last version is bad
- Input: "(10, 10)"
- Expected: "10"

**Test 5:** First bad in middle
- Input: "(100, 50)"
- Expected: "50"

**Test 6:** Large n value
- Input: "(2147483647, 1000000000)"
- Expected: "1000000000"

**Test 7:** PERFORMANCE: Very large n (2.1B) - Must use O(log n) binary search
- Input: "(2147483647, 2147483646)"
- Expected: "2147483646"

---

## 2. Find First and Last Position of Element in Sorted Array

**Difficulty:** medium
**Concept:** binary-search
**Family:** binary-search:first-last-position

### Description

Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value. If target is not found in the array, return [-1, -1]. You must write an algorithm with O(log n) runtime complexity.

### Key Insight

Perform TWO binary searches: one to find the leftmost (first) occurrence and another to find the rightmost (last) occurrence. For the first occurrence, use arr[mid] >= target (move left when possible). For the last occurrence, use arr[mid] <= target with mid = left + (right - left + 1) // 2 to avoid infinite loops.

### Examples

**Example 1:**
- Input: nums = [5,7,7,8,8,10], target = 8
- Output: [3,4]
- Explanation: Target 8 first appears at index 3 and last appears at index 4.

**Example 2:**
- Input: nums = [5,7,7,8,8,10], target = 6
- Output: [-1,-1]
- Explanation: Target 6 does not exist in the array.

**Example 3:**
- Input: nums = [], target = 0
- Output: [-1,-1]
- Explanation: Empty array, return [-1, -1].

### Hints

1. Split this into two separate binary search problems: finding the first occurrence and finding the last occurrence
2. For first occurrence: when nums[mid] >= target, move right pointer to mid (search left half)
3. For last occurrence: use mid = left + (right - left + 1) // 2 to prevent infinite loops
4. For last occurrence: when nums[mid] <= target, move left pointer to mid (search right half)
5. After finding positions, verify that nums[first] == target before returning
6. If target not found, return [-1, -1]

### Starter Code

**Python:**
```python
def searchRange(nums, target):
    """
    Find first and last position of target in sorted array.
    
    Args:
        nums: List[int] - sorted array of integers
        target: int - value to search for
    
    Returns:
        List[int] - [first_position, last_position] or [-1, -1] if not found
    """
    # TODO: Implement find_first to find leftmost occurrence
    # Use: if nums[mid] >= target: right = mid
    
    # TODO: Implement find_last to find rightmost occurrence  
    # Use: mid = left + (right - left + 1) // 2 (note the +1!)
    # Use: if nums[mid] <= target: left = mid
    
    # TODO: Return [first, last] or [-1, -1] if not found
    pass
```

**JavaScript:**
```javascript
function searchRange(nums, target) {
    """
    Find first and last position of target in sorted array.
    
    Args:
        nums: Array - sorted array of integers
        target: int - value to search for
    
    Returns:
        Array - [first_position, last_position] or [-1, -1] if not found
    """
    // TODO: Implement find_first to find leftmost occurrence
    # Use: if nums[mid] >= target: right = mid
    
    // TODO: Implement find_last to find rightmost occurrence  
    # Use: mid = left + (right - left + 1) // 2 (note the +1!)
    # Use: if nums[mid] <= target: left = mid
    
    // TODO: Return [first, last] or [-1, -1] if not found
  // TODO: implement
```

### Solution

**Python:**
```python
def searchRange(nums, target):
    """
    Find first and last position using two binary searches.
    
    Time: O(log n) - two binary searches
    Space: O(1) - constant extra space
    """
    if not nums:
        return [-1, -1]
    
    def find_first(nums, target):
        """Find leftmost occurrence of target."""
        left, right = 0, len(nums) - 1
        
        while left < right:
            mid = left + (right - left) // 2
            
            if nums[mid] >= target:
                # Target might be at mid or left, search left half
                right = mid
            else:
                # Target must be to the right
                left = mid + 1
        
        # Verify that we found the target
        return left if nums[left] == target else -1
    
    def find_last(nums, target):
        """Find rightmost occurrence of target."""
        left, right = 0, len(nums) - 1
        
        while left < right:
            # +1 prevents infinite loop when left = mid
            mid = left + (right - left + 1) // 2
            
            if nums[mid] <= target:
                # Target might be at mid or right, search right half
                left = mid
            else:
                # Target must be to the left
                right = mid - 1
        
        # Verify that we found the target
        return left if nums[left] == target else -1
    
    first = find_first(nums, target)
    if first == -1:
        return [-1, -1]
    
    last = find_last(nums, target)
    return [first, last]
```

**JavaScript:**
```javascript
function searchRange(nums, target) {
    """
    Find first and last position using two binary searches.
    
    Time: O(log n) - two binary searches
    Space: O(1) - constant extra space
    """
    if not nums:
        return [-1, -1]
    
    function find_first(nums, target) {
        """Find leftmost occurrence of target."""
        left, right = 0, len(nums) - 1
        
        while left < right:
            mid = left + (right - left) // 2
            
            if nums[mid] >= target:
                # Target might be at mid or left, search left half
                right = mid
            else:
                # Target must be to the right
                left = mid + 1
        
        # Verify that we found the target
        return left if nums[left] == target else -1
    
    function find_last(nums, target) {
        """Find rightmost occurrence of target."""
        left, right = 0, len(nums) - 1
        
        while left < right:
            # +1 prevents infinite loop when left = mid
            mid = left + (right - left + 1) // 2
            
            if nums[mid] <= target:
                # Target might be at mid or right, search right half
                left = mid
            else:
                # Target must be to the left
                right = mid - 1
        
        # Verify that we found the target
        return left if nums[left] == target else -1
    
    first = find_first(nums, target)
    if first == -1:
        return [-1, -1]
    
    last = find_last(nums, target)
    return [first, last]
```

### Complexity Analysis

- **Time Complexity:** O(log n) - Performs two binary searches, each taking O(log n) time
- **Space Complexity:** O(1) - Only uses constant extra space for pointers

### Test Cases

**Test 1:** Target appears twice
- Input: "([5,7,7,8,8,10], 8)"
- Expected: "[3, 4]"

**Test 2:** Target not found
- Input: "([5,7,7,8,8,10], 6)"
- Expected: "[-1, -1]"

**Test 3:** Single element array
- Input: "([1], 1)"
- Expected: "[0, 0]"

**Test 4:** Empty array
- Input: "([], 0)"
- Expected: "[-1, -1]"

**Test 5:** All elements are target
- Input: "([1,1,1,1,1], 1)"
- Expected: "[0, 4]"

**Test 6:** Two elements, both target
- Input: "([2,2], 2)"
- Expected: "[0, 1]"

**Test 7:** PERFORMANCE: Large array (100K elements) - Must use O(log n)
- Input: "([1]*50000 + [2]*50000, 2)"
- Expected: "[50000, 99999]"

---

## 3. Search in Rotated Sorted Array

**Difficulty:** medium
**Concept:** binary-search
**Family:** binary-search:rotated-array

### Description

There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed). For example, [0,1,2,4,5,6,7] might be rotated at pivot index 3 and become [4,5,6,7,0,1,2]. Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums. You must write an algorithm with O(log n) runtime complexity.

### Key Insight

One half of the array is always sorted. First determine which half is sorted by comparing nums[left] with nums[mid]. Then check if the target lies within the sorted half's range. If yes, search that half; otherwise, search the other half. This maintains O(log n) complexity.

### Examples

**Example 1:**
- Input: nums = [4,5,6,7,0,1,2], target = 0
- Output: 4
- Explanation: Target 0 is found at index 4.

**Example 2:**
- Input: nums = [4,5,6,7,0,1,2], target = 3
- Output: -1
- Explanation: Target 3 does not exist in the array.

**Example 3:**
- Input: nums = [1], target = 0
- Output: -1
- Explanation: Single element array does not contain target.

### Hints

1. At each step, at least one half of the array is properly sorted
2. Check if left half is sorted: nums[left] <= nums[mid]
3. If left half is sorted and target is in range [nums[left], nums[mid]], search left
4. Otherwise, search the right half
5. Similarly handle the case when right half is sorted
6. Use standard binary search comparisons once you know which half to search

### Starter Code

**Python:**
```python
def search(nums, target):
    """
    Search for target in rotated sorted array.
    
    Args:
        nums: List[int] - rotated sorted array (distinct values)
        target: int - value to search for
    
    Returns:
        int - index of target, or -1 if not found
    """
    # TODO: Binary search with rotation handling
    # left, right = 0, len(nums) - 1
    
    # TODO: In each iteration:
    # 1. Check if nums[mid] == target (found!)
    # 2. Determine which half is sorted (compare nums[left] with nums[mid])
    # 3. Check if target is in the sorted half
    # 4. Move to appropriate half
    
    pass
```

**JavaScript:**
```javascript
function search(nums, target) {
    """
    Search for target in rotated sorted array.
    
    Args:
        nums: Array - rotated sorted array (distinct values)
        target: int - value to search for
    
    Returns:
        int - index of target, or -1 if not found
    """
    // TODO: Binary search with rotation handling
    # left, right = 0, len(nums) - 1
    
    // TODO: In each iteration:
    # 1. Check if nums[mid] == target (found!)
    # 2. Determine which half is sorted (compare nums[left] with nums[mid])
    # 3. Check if target is in the sorted half
    # 4. Move to appropriate half
  // TODO: implement
```

### Solution

**Python:**
```python
def search(nums, target):
    """
    Search in rotated sorted array using modified binary search.
    
    Time: O(log n) - binary search with rotation handling
    Space: O(1) - constant extra space
    """
    if not nums:
        return -1
    
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        # Found the target
        if nums[mid] == target:
            return mid
        
        # Determine which half is sorted
        if nums[left] <= nums[mid]:
            # Left half is sorted
            if nums[left] <= target < nums[mid]:
                # Target is in the sorted left half
                right = mid - 1
            else:
                # Target is in the right half
                left = mid + 1
        else:
            # Right half is sorted
            if nums[mid] < target <= nums[right]:
                # Target is in the sorted right half
                left = mid + 1
            else:
                # Target is in the left half
                right = mid - 1
    
    return -1
```

**JavaScript:**
```javascript
function search(nums, target) {
    """
    Search in rotated sorted array using modified binary search.
    
    Time: O(log n) - binary search with rotation handling
    Space: O(1) - constant extra space
    """
    if not nums:
        return -1
    
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        # Found the target
        if nums[mid] == target:
            return mid
        
        # Determine which half is sorted
        if nums[left] <= nums[mid]:
            # Left half is sorted
            if nums[left] <= target < nums[mid]:
                # Target is in the sorted left half
                right = mid - 1
            else:
                # Target is in the right half
                left = mid + 1
        else:
            # Right half is sorted
            if nums[mid] < target <= nums[right]:
                # Target is in the sorted right half
                left = mid + 1
            else:
                # Target is in the left half
                right = mid - 1
    
    return -1
```

### Complexity Analysis

- **Time Complexity:** O(log n) - Binary search maintains logarithmic time despite rotation
- **Space Complexity:** O(1) - Only uses constant extra space for pointers

### Test Cases

**Test 1:** Target in rotated portion
- Input: "([4,5,6,7,0,1,2], 0)"
- Expected: "4"

**Test 2:** Target not found
- Input: "([4,5,6,7,0,1,2], 3)"
- Expected: "-1"

**Test 3:** Single element, not found
- Input: "([1], 0)"
- Expected: "-1"

**Test 4:** Single element, found
- Input: "([1], 1)"
- Expected: "0"

**Test 5:** Two elements, rotated
- Input: "([3,1], 1)"
- Expected: "1"

**Test 6:** Target at start
- Input: "([5,1,3], 5)"
- Expected: "0"

**Test 7:** PERFORMANCE: Large rotated array (100K elements) - Must use O(log n)
- Input: "(list(range(50000, 100000)) + list(range(0, 50000)), 25000)"
- Expected: "75000"

**Test 8:** PERFORMANCE: Large rotated array (100K elements) with target at end - Must use O(log n)
- Input: "(list(range(60000, 100000)) + list(range(0, 60000)), 59999)"
- Expected: "99999"

---

## 4. Search in Rotated Sorted Array II

**Difficulty:** medium
**Concept:** binary-search
**Family:** binary-search:rotated-array

### Description

Suppose an array sorted in ascending order is rotated at some pivot unknown to you beforehand. (i.e., [0,0,1,2,2,5,6] might become [2,5,6,0,0,1,2]). You are given a target value to search. If found in the array return true, otherwise return false. The array may contain duplicates.

### Key Insight

Similar to rotated array search but with duplicates. The key challenge: when nums[left] == nums[mid] == nums[right], we cannot determine which half is sorted. Solution: skip duplicates by incrementing left or decrementing right. This maintains correctness but worst case becomes O(n) when all elements are the same.

### Examples

**Example 1:**
- Input: nums = [2,5,6,0,0,1,2], target = 0
- Output: true
- Explanation: Target 0 exists in the array.

**Example 2:**
- Input: nums = [2,5,6,0,0,1,2], target = 3
- Output: false
- Explanation: Target 3 does not exist in the array.

**Example 3:**
- Input: nums = [1,0,1,1,1], target = 0
- Output: true
- Explanation: Target 0 exists despite many duplicates.

### Hints

1. Start with the same approach as rotated array without duplicates
2. When nums[left] == nums[mid] == nums[right], we cannot determine which side is sorted
3. In the duplicate case, simply skip one element: left += 1 (or right -= 1)
4. After handling duplicates, proceed with normal rotated array logic
5. Check which half is sorted and whether target is in that half's range
6. Worst case O(n) when array is [1,1,1,1,1] searching for 2

### Starter Code

**Python:**
```python
def search(nums, target):
    """
    Search for target in rotated sorted array with duplicates.
    
    Args:
        nums: List[int] - rotated sorted array (may have duplicates)
        target: int - value to search for
    
    Returns:
        bool - True if target found, False otherwise
    """
    # TODO: Similar to regular rotated search, but handle duplicates
    # When nums[left] == nums[mid] == nums[right]:
    #     Skip duplicates: left += 1 (or right -= 1)
    
    # TODO: Otherwise, determine which half is sorted
    # and search accordingly
    
    pass
```

**JavaScript:**
```javascript
function search(nums, target) {
    """
    Search for target in rotated sorted array with duplicates.
    
    Args:
        nums: Array - rotated sorted array (may have duplicates)
        target: int - value to search for
    
    Returns:
        bool - true if target found, false otherwise
    """
    // TODO: Similar to regular rotated search, but handle duplicates
    # When nums[left] == nums[mid] == nums[right]:
    #     Skip duplicates: left += 1 (or right -= 1)
    
    // TODO: Otherwise, determine which half is sorted
    # and search accordingly
  // TODO: implement
```

### Solution

**Python:**
```python
def search(nums, target):
    """
    Search in rotated sorted array with duplicates.
    
    Time: O(log n) average, O(n) worst case (all duplicates)
    Space: O(1) - constant extra space
    """
    if not nums:
        return False
    
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        # Found target
        if nums[mid] == target:
            return True
        
        # Handle duplicates - cannot determine which half is sorted
        if nums[left] == nums[mid] == nums[right]:
            # Skip duplicates
            left += 1
            right -= 1
        # Left half is sorted
        elif nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                # Target in sorted left half
                right = mid - 1
            else:
                # Target in right half
                left = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                # Target in sorted right half
                left = mid + 1
            else:
                # Target in left half
                right = mid - 1
    
    return False
```

**JavaScript:**
```javascript
function search(nums, target) {
    """
    Search in rotated sorted array with duplicates.
    
    Time: O(log n) average, O(n) worst case (all duplicates)
    Space: O(1) - constant extra space
    """
    if not nums:
        return false
    
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        # Found target
        if nums[mid] == target:
            return true
        
        # Handle duplicates - cannot determine which half is sorted
        if nums[left] == nums[mid] == nums[right]:
            # Skip duplicates
            left += 1
            right -= 1
        # Left half is sorted
        elif nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                # Target in sorted left half
                right = mid - 1
            else:
                # Target in right half
                left = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                # Target in sorted right half
                left = mid + 1
            else:
                # Target in left half
                right = mid - 1
    
    return false
```

### Complexity Analysis

- **Time Complexity:** O(log n) average case, O(n) worst case when all elements are duplicates
- **Space Complexity:** O(1) - Only uses constant extra space for pointers

### Test Cases

**Test 1:** Target exists with duplicates
- Input: "([2,5,6,0,0,1,2], 0)"
- Expected: "True"

**Test 2:** Target not found
- Input: "([2,5,6,0,0,1,2], 3)"
- Expected: "False"

**Test 3:** Many duplicates, found
- Input: "([1,0,1,1,1], 0)"
- Expected: "True"

**Test 4:** All same, not found
- Input: "([1,1,1,1,1], 2)"
- Expected: "False"

**Test 5:** Target at start with duplicates
- Input: "([3,1,1], 3)"
- Expected: "True"

**Test 6:** Target in middle with duplicates
- Input: "([1,1,3,1], 3)"
- Expected: "True"

---

## 5. Find Minimum in Rotated Sorted Array

**Difficulty:** medium
**Concept:** binary-search
**Family:** binary-search:rotated-array

### Description

Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, the array nums = [0,1,2,4,5,6,7] might become [4,5,6,7,0,1,2] if it was rotated 4 times, or [0,1,2,4,5,6,7] if it was rotated 7 times. Notice that rotating an array [a[0], a[1], a[2], ..., a[n-1]] 1 time results in the array [a[n-1], a[0], a[1], a[2], ..., a[n-2]]. Given the sorted rotated array nums of unique elements, return the minimum element of this array. You must write an algorithm that runs in O(log n) time.

### Key Insight

Compare nums[mid] with nums[right] (not target!). If nums[mid] > nums[right], the minimum is in the right half (rotation point is to the right). If nums[mid] <= nums[right], the minimum is in the left half (including mid). This finds the rotation point, which is the minimum element.

### Examples

**Example 1:**
- Input: nums = [3,4,5,1,2]
- Output: 1
- Explanation: The original array was [1,2,3,4,5] rotated 3 times.

**Example 2:**
- Input: nums = [4,5,6,7,0,1,2]
- Output: 0
- Explanation: The original array was [0,1,2,4,5,6,7] and it was rotated 4 times.

**Example 3:**
- Input: nums = [11,13,15,17]
- Output: 11
- Explanation: The original array was [11,13,15,17] and it was rotated 4 times (no rotation effectively).

### Hints

1. The minimum element is at the rotation point (where sorted order breaks)
2. Compare nums[mid] with nums[right], not with a target
3. If nums[mid] > nums[right], the array is rotated and minimum is to the right
4. If nums[mid] <= nums[right], the minimum could be at mid or to the left
5. When nums[mid] <= nums[right], set right = mid (not mid - 1) because mid could be the minimum
6. The loop terminates when left == right, pointing to the minimum

### Starter Code

**Python:**
```python
def findMin(nums):
    """
    Find minimum element in rotated sorted array.
    
    Args:
        nums: List[int] - rotated sorted array (unique elements)
    
    Returns:
        int - the minimum element
    """
    # TODO: Binary search comparing mid with right
    # If nums[mid] > nums[right]:
    #     Minimum is in right half (left = mid + 1)
    # Else:
    #     Minimum could be at mid (right = mid)
    
    # TODO: Return nums[left] when left == right
    pass
```

**JavaScript:**
```javascript
function findMin(nums) {
    """
    Find minimum element in rotated sorted array.
    
    Args:
        nums: Array - rotated sorted array (unique elements)
    
    Returns:
        int - the minimum element
    """
    // TODO: Binary search comparing mid with right
    # If nums[mid] > nums[right]:
    #     Minimum is in right half (left = mid + 1)
    # Else:
    #     Minimum could be at mid (right = mid)
    
    // TODO: Return nums[left] when left == right
  // TODO: implement
```

### Solution

**Python:**
```python
def findMin(nums):
    """
    Find minimum in rotated sorted array using binary search.
    
    Time: O(log n) - binary search
    Space: O(1) - constant extra space
    """
    left, right = 0, len(nums) - 1
    
    # Binary search for minimum (rotation point)
    while left < right:
        mid = left + (right - left) // 2
        
        if nums[mid] > nums[right]:
            # Minimum is in the right half
            # mid cannot be minimum (it's greater than right)
            left = mid + 1
        else:
            # nums[mid] <= nums[right]
            # Minimum is in left half (could be at mid)
            right = mid
    
    # When left == right, we've found the minimum
    return nums[left]
```

**JavaScript:**
```javascript
function findMin(nums) {
    """
    Find minimum in rotated sorted array using binary search.
    
    Time: O(log n) - binary search
    Space: O(1) - constant extra space
    """
    left, right = 0, len(nums) - 1
    
    # Binary search for minimum (rotation point)
    while left < right:
        mid = left + (right - left) // 2
        
        if nums[mid] > nums[right]:
            # Minimum is in the right half
            # mid cannot be minimum (it's greater than right)
            left = mid + 1
        else:
            # nums[mid] <= nums[right]
            # Minimum is in left half (could be at mid)
            right = mid
    
    # When left == right, we've found the minimum
    return nums[left]
```

### Complexity Analysis

- **Time Complexity:** O(log n) - Binary search reduces search space by half each iteration
- **Space Complexity:** O(1) - Only uses constant extra space for pointers

### Test Cases

**Test 1:** Rotated array, min in middle
- Input: "([3,4,5,1,2],)"
- Expected: "1"

**Test 2:** Rotated array, min near end
- Input: "([4,5,6,7,0,1,2],)"
- Expected: "0"

**Test 3:** No rotation
- Input: "([11,13,15,17],)"
- Expected: "11"

**Test 4:** Two elements rotated
- Input: "([2,1],)"
- Expected: "1"

**Test 5:** Single element
- Input: "([1],)"
- Expected: "1"

**Test 6:** Min at end
- Input: "([2,3,4,5,1],)"
- Expected: "1"

**Test 7:** PERFORMANCE: Large rotated array (100K elements) - Must use O(log n)
- Input: "(list(range(50000, 100000)) + list(range(0, 50000)),)"
- Expected: "0"

---

## 6. Find Minimum in Rotated Sorted Array II

**Difficulty:** hard
**Concept:** binary-search
**Family:** binary-search:rotated-array

### Description

Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, the array nums = [0,1,4,4,5,6,7] might become [4,5,6,7,0,1,4] if it was rotated 4 times. Given the sorted rotated array nums that may contain duplicates, return the minimum element of this array. You must decrease the overall operation steps as much as possible.

### Key Insight

Similar to finding minimum without duplicates, but when nums[mid] == nums[right], we cannot determine which side has the minimum. Solution: decrement right by 1 to skip the duplicate. This maintains correctness because if nums[right] is the minimum, we'll find another copy of it at an earlier position.

### Examples

**Example 1:**
- Input: nums = [1,3,5]
- Output: 1
- Explanation: No rotation, minimum is at the start.

**Example 2:**
- Input: nums = [2,2,2,0,1]
- Output: 0
- Explanation: Despite duplicates, minimum is 0.

**Example 3:**
- Input: nums = [10,1,10,10,10]
- Output: 1
- Explanation: Many duplicates, minimum is 1.

### Hints

1. Start with the approach for finding minimum without duplicates
2. When nums[mid] > nums[right], minimum is definitely in the right half
3. When nums[mid] < nums[right], minimum is in the left half (could be at mid)
4. When nums[mid] == nums[right], we cannot determine which side has minimum
5. In the duplicate case, safely skip one element: right -= 1
6. This works because if nums[right] is the minimum, we'll find another copy earlier

### Starter Code

**Python:**
```python
def findMin(nums):
    """
    Find minimum element in rotated sorted array with duplicates.
    
    Args:
        nums: List[int] - rotated sorted array (may have duplicates)
    
    Returns:
        int - the minimum element
    """
    # TODO: Binary search comparing mid with right
    # If nums[mid] > nums[right]:
    #     left = mid + 1
    # Elif nums[mid] < nums[right]:
    #     right = mid
    # Else: (nums[mid] == nums[right])
    #     right -= 1  # Skip duplicate
    
    pass
```

**JavaScript:**
```javascript
function findMin(nums) {
    """
    Find minimum element in rotated sorted array with duplicates.
    
    Args:
        nums: Array - rotated sorted array (may have duplicates)
    
    Returns:
        int - the minimum element
    """
    // TODO: Binary search comparing mid with right
    # If nums[mid] > nums[right]:
    #     left = mid + 1
    # Elif nums[mid] < nums[right]:
    #     right = mid
    # Else: (nums[mid] == nums[right])
    #     right -= 1  # Skip duplicate
  // TODO: implement
```

### Solution

**Python:**
```python
def findMin(nums):
    """
    Find minimum in rotated sorted array with duplicates.
    
    Time: O(log n) average, O(n) worst case (all duplicates)
    Space: O(1) - constant extra space
    """
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        if nums[mid] > nums[right]:
            # Minimum is in right half
            left = mid + 1
        elif nums[mid] < nums[right]:
            # Minimum is in left half (could be at mid)
            right = mid
        else:
            # nums[mid] == nums[right]
            # Cannot determine which side has minimum
            # Skip duplicate on the right
            right -= 1
    
    return nums[left]
```

**JavaScript:**
```javascript
function findMin(nums) {
    """
    Find minimum in rotated sorted array with duplicates.
    
    Time: O(log n) average, O(n) worst case (all duplicates)
    Space: O(1) - constant extra space
    """
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        if nums[mid] > nums[right]:
            # Minimum is in right half
            left = mid + 1
        elif nums[mid] < nums[right]:
            # Minimum is in left half (could be at mid)
            right = mid
        else:
            # nums[mid] == nums[right]
            # Cannot determine which side has minimum
            # Skip duplicate on the right
            right -= 1
    
    return nums[left]
```

### Complexity Analysis

- **Time Complexity:** O(log n) average case, O(n) worst case when all elements are duplicates
- **Space Complexity:** O(1) - Only uses constant extra space for pointers

### Test Cases

**Test 1:** No rotation
- Input: "([1,3,5],)"
- Expected: "1"

**Test 2:** Duplicates at start
- Input: "([2,2,2,0,1],)"
- Expected: "0"

**Test 3:** Many duplicates
- Input: "([10,1,10,10,10],)"
- Expected: "1"

**Test 4:** Min surrounded by duplicates
- Input: "([3,3,1,3],)"
- Expected: "1"

**Test 5:** All elements same
- Input: "([2,2,2,2,2],)"
- Expected: "2"

**Test 6:** Single element
- Input: "([1],)"
- Expected: "1"

---

## 7. Search a 2D Matrix

**Difficulty:** medium
**Concept:** binary-search
**Family:** binary-search:2d-matrix

### Description

Write an efficient algorithm that searches for a value target in an m x n integer matrix. This matrix has the following properties: Integers in each row are sorted from left to right. The first integer of each row is greater than the last integer of the previous row.

### Key Insight

The matrix can be treated as a single sorted 1D array! Use binary search on indices [0, m*n-1]. Convert 1D index to 2D coordinates: row = mid // n, col = mid % n. This gives O(log(m*n)) time complexity.

### Examples

**Example 1:**
- Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
- Output: true
- Explanation: Target 3 is found at matrix[0][1].

**Example 2:**
- Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
- Output: false
- Explanation: Target 13 does not exist in the matrix.

**Example 3:**
- Input: matrix = [[1]], target = 1
- Output: true
- Explanation: Single element matrix contains target.

### Hints

1. Treat the 2D matrix as a flattened 1D sorted array
2. Total elements = m * n, so search range is [0, m*n - 1]
3. Convert 1D index to 2D: row = index // n, col = index % n
4. Use standard binary search on the 1D index
5. Access element using matrix[row][col]
6. Handle edge cases: empty matrix, single row, single column

### Starter Code

**Python:**
```python
def searchMatrix(matrix, target):
    """
    Search for target in 2D matrix treated as 1D sorted array.
    
    Args:
        matrix: List[List[int]] - m x n matrix
        target: int - value to search for
    
    Returns:
        bool - True if target found, False otherwise
    """
    # TODO: Get dimensions m (rows) and n (cols)
    
    # TODO: Binary search on total elements (m * n)
    # left = 0, right = m * n - 1
    
    # TODO: Convert mid to 2D coordinates:
    # row = mid // n
    # col = mid % n
    
    # TODO: Compare matrix[row][col] with target
    pass
```

**JavaScript:**
```javascript
function searchMatrix(matrix, target) {
    """
    Search for target in 2D matrix treated as 1D sorted array.
    
    Args:
        matrix: Array] - m x n matrix
        target: int - value to search for
    
    Returns:
        bool - true if target found, false otherwise
    """
    // TODO: Get dimensions m (rows) and n (cols)
    
    // TODO: Binary search on total elements (m * n)
    # left = 0, right = m * n - 1
    
    // TODO: Convert mid to 2D coordinates:
    # row = mid // n
    # col = mid % n
    
    // TODO: Compare matrix[row][col] with target
  // TODO: implement
```

### Solution

**Python:**
```python
def searchMatrix(matrix, target):
    """
    Search 2D matrix using binary search on 1D representation.
    
    Time: O(log(m*n)) - binary search on m*n elements
    Space: O(1) - constant extra space
    """
    if not matrix or not matrix[0]:
        return False
    
    m, n = len(matrix), len(matrix[0])
    left, right = 0, m * n - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        # Convert 1D index to 2D coordinates
        row = mid // n
        col = mid % n
        mid_value = matrix[row][col]
        
        if mid_value == target:
            return True
        elif mid_value < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return False
```

**JavaScript:**
```javascript
function searchMatrix(matrix, target) {
    """
    Search 2D matrix using binary search on 1D representation.
    
    Time: O(log(m*n)) - binary search on m*n elements
    Space: O(1) - constant extra space
    """
    if not matrix or not matrix[0]:
        return false
    
    m, n = len(matrix), len(matrix[0])
    left, right = 0, m * n - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        # Convert 1D index to 2D coordinates
        row = mid // n
        col = mid % n
        mid_value = matrix[row][col]
        
        if mid_value == target:
            return true
        elif mid_value < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return false
```

### Complexity Analysis

- **Time Complexity:** O(log(m*n)) - Binary search on total m*n elements
- **Space Complexity:** O(1) - Only uses constant extra space for pointers

### Test Cases

**Test 1:** Target found
- Input: "([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3)"
- Expected: "True"

**Test 2:** Target not found
- Input: "([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 13)"
- Expected: "False"

**Test 3:** Single element
- Input: "([[1]], 1)"
- Expected: "True"

**Test 4:** Single row
- Input: "([[1,3,5]], 3)"
- Expected: "True"

**Test 5:** Single column
- Input: "([[1],[3],[5]], 5)"
- Expected: "True"

**Test 6:** Small matrix, not found
- Input: "([[1,3]], 4)"
- Expected: "False"

---

## 8. Search a 2D Matrix II

**Difficulty:** medium
**Concept:** binary-search
**Family:** binary-search:2d-matrix

### Description

Write an efficient algorithm that searches for a value target in an m x n integer matrix. This matrix has the following properties: Integers in each row are sorted in ascending from left to right. Integers in each column are sorted in ascending from top to bottom. Note: This is different from the previous problem as rows are not globally sorted.

### Key Insight

Start from the top-right corner (or bottom-left). At position (row, col), if matrix[row][col] > target, move left (col--). If matrix[row][col] < target, move down (row++). This eliminates one row or column per step, giving O(m+n) time. Cannot achieve O(log(m*n)) because the matrix is not fully sorted.

### Examples

**Example 1:**
- Input: matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5
- Output: true
- Explanation: Target 5 is found at matrix[1][1].

**Example 2:**
- Input: matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 20
- Output: false
- Explanation: Target 20 does not exist in the matrix.

**Example 3:**
- Input: matrix = [[5]], target = 5
- Output: true
- Explanation: Single element matrix contains target.

### Hints

1. This problem cannot be solved with pure binary search due to partial sorting
2. Start from a corner that has a clear comparison direction: top-right or bottom-left
3. From top-right: current value is largest in its column and smallest in its row
4. If current > target, target must be to the left (eliminate column)
5. If current < target, target must be below (eliminate row)
6. Each comparison eliminates one row or column, giving O(m+n) time

### Starter Code

**Python:**
```python
def searchMatrix(matrix, target):
    """
    Search for target in 2D matrix with row and column sorting.
    
    Args:
        matrix: List[List[int]] - m x n matrix
        target: int - value to search for
    
    Returns:
        bool - True if target found, False otherwise
    """
    # TODO: Start from top-right corner
    # row = 0, col = n - 1
    
    # TODO: While in bounds:
    # If matrix[row][col] == target: found!
    # If matrix[row][col] > target: move left (col -= 1)
    # If matrix[row][col] < target: move down (row += 1)
    
    pass
```

**JavaScript:**
```javascript
function searchMatrix(matrix, target) {
    """
    Search for target in 2D matrix with row and column sorting.
    
    Args:
        matrix: Array] - m x n matrix
        target: int - value to search for
    
    Returns:
        bool - true if target found, false otherwise
    """
    // TODO: Start from top-right corner
    # row = 0, col = n - 1
    
    // TODO: While in bounds:
    # If matrix[row][col] == target: found!
    # If matrix[row][col] > target: move left (col -= 1)
    # If matrix[row][col] < target: move down (row += 1)
  // TODO: implement
```

### Solution

**Python:**
```python
def searchMatrix(matrix, target):
    """
    Search 2D matrix starting from top-right corner.
    
    Time: O(m + n) - at most m+n steps (eliminate row or column each step)
    Space: O(1) - constant extra space
    """
    if not matrix or not matrix[0]:
        return False
    
    m, n = len(matrix), len(matrix[0])
    
    # Start from top-right corner
    row, col = 0, n - 1
    
    while row < m and col >= 0:
        if matrix[row][col] == target:
            return True
        elif matrix[row][col] > target:
            # Target is smaller, move left (eliminate column)
            col -= 1
        else:
            # Target is larger, move down (eliminate row)
            row += 1
    
    return False
```

**JavaScript:**
```javascript
function searchMatrix(matrix, target) {
    """
    Search 2D matrix starting from top-right corner.
    
    Time: O(m + n) - at most m+n steps (eliminate row or column each step)
    Space: O(1) - constant extra space
    """
    if not matrix or not matrix[0]:
        return false
    
    m, n = len(matrix), len(matrix[0])
    
    # Start from top-right corner
    row, col = 0, n - 1
    
    while row < m and col >= 0:
        if matrix[row][col] == target:
            return true
        elif matrix[row][col] > target:
            # Target is smaller, move left (eliminate column)
            col -= 1
        else:
            # Target is larger, move down (eliminate row)
            row += 1
    
    return false
```

### Complexity Analysis

- **Time Complexity:** O(m + n) - Each step eliminates one row or column, maximum m+n steps
- **Space Complexity:** O(1) - Only uses constant extra space for row/col pointers

### Test Cases

**Test 1:** Target found
- Input: "([[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], 5)"
- Expected: "True"

**Test 2:** Target not found
- Input: "([[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], 20)"
- Expected: "False"

**Test 3:** Single element
- Input: "([[5]], 5)"
- Expected: "True"

**Test 4:** Negative single element
- Input: "([[-5]], -5)"
- Expected: "True"

**Test 5:** Small matrix
- Input: "([[1,4],[2,5]], 2)"
- Expected: "True"

**Test 6:** Duplicates, not found
- Input: "([[1,1]], 2)"
- Expected: "False"

**Test 7:** PERFORMANCE: Large matrix (100x100=10K elements) - Must use O(log(m*n))
- Input: "([[i*100+j for j in range(100)] for i in range(100)], 5050)"
- Expected: "True"

---

## 9. Median of Two Sorted Arrays

**Difficulty:** hard
**Concept:** binary-search
**Family:** binary-search:kth-element

### Description

Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).

### Key Insight

Binary search on the partition of the smaller array. The key insight: if we partition both arrays correctly, all elements in the left halves are <= all elements in the right halves. For correct partition: left_max1 <= right_min2 AND left_max2 <= right_min1. Median is then calculated from max(left) and min(right) elements.

### Examples

**Example 1:**
- Input: nums1 = [1,3], nums2 = [2]
- Output: 2.00000
- Explanation: Merged array = [1,2,3], median is 2.

**Example 2:**
- Input: nums1 = [1,2], nums2 = [3,4]
- Output: 2.50000
- Explanation: Merged array = [1,2,3,4], median is (2 + 3) / 2 = 2.5.

**Example 3:**
- Input: nums1 = [], nums2 = [1]
- Output: 1.00000
- Explanation: Only one array with single element.

### Hints

1. Always binary search on the smaller array to minimize complexity
2. For partition i in nums1, calculate partition j in nums2: j = (m+n+1)//2 - i
3. Get the 4 boundary elements: left_max1, right_min1, left_max2, right_min2
4. Check if partition is correct: left_max1 <= right_min2 AND left_max2 <= right_min1
5. If left_max1 > right_min2, move partition left in nums1
6. For odd total length, median = max(left_max1, left_max2); for even, average of max(left) and min(right)

### Starter Code

**Python:**
```python
def findMedianSortedArrays(nums1, nums2):
    """
    Find median of two sorted arrays in O(log(min(m,n))) time.
    
    Args:
        nums1: List[int] - first sorted array
        nums2: List[int] - second sorted array
    
    Returns:
        float - the median value
    """
    # TODO: Ensure nums1 is the smaller array
    # if len(nums1) > len(nums2): swap them
    
    # TODO: Binary search on partition of nums1
    # Total left elements needed = (m + n + 1) // 2
    
    # TODO: For partition i in nums1:
    # partition j in nums2 = total_left - i
    
    # TODO: Check if partition is correct:
    # left_max1 <= right_min2 AND left_max2 <= right_min1
    
    # TODO: Calculate median from correct partition
    pass
```

**JavaScript:**
```javascript
function findMedianSortedArrays(nums1, nums2) {
    """
    Find median of two sorted arrays in O(log(min(m,n))) time.
    
    Args:
        nums1: Array - first sorted array
        nums2: Array - second sorted array
    
    Returns:
        float - the median value
    """
    // TODO: Ensure nums1 is the smaller array
    # if len(nums1) > len(nums2): swap them
    
    // TODO: Binary search on partition of nums1
    # Total left elements needed = (m + n + 1) // 2
    
    // TODO: For partition i in nums1:
    # partition j in nums2 = total_left - i
    
    // TODO: Check if partition is correct:
    # left_max1 <= right_min2 AND left_max2 <= right_min1
    
    // TODO: Calculate median from correct partition
  // TODO: implement
```

### Solution

**Python:**
```python
def findMedianSortedArrays(nums1, nums2):
    """
    Find median using binary search on partition.
    
    Time: O(log(min(m,n))) - binary search on smaller array
    Space: O(1) - constant extra space
    """
    # Ensure nums1 is the smaller array
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    
    m, n = len(nums1), len(nums2)
    
    # Binary search on nums1's partition
    left, right = 0, m
    
    while left <= right:
        # Partition nums1 at i (i elements on left)
        i = (left + right) // 2
        
        # Partition nums2 accordingly
        # Total left elements should be (m+n+1)//2
        j = (m + n + 1) // 2 - i
        
        # Get boundary elements (handle edge cases with infinity)
        left_max1 = float('-inf') if i == 0 else nums1[i-1]
        right_min1 = float('inf') if i == m else nums1[i]
        
        left_max2 = float('-inf') if j == 0 else nums2[j-1]
        right_min2 = float('inf') if j == n else nums2[j]
        
        # Check if partition is correct
        if left_max1 <= right_min2 and left_max2 <= right_min1:
            # Found correct partition!
            # Calculate median
            if (m + n) % 2 == 1:
                # Odd total length
                return max(left_max1, left_max2)
            else:
                # Even total length
                return (max(left_max1, left_max2) + min(right_min1, right_min2)) / 2.0
        
        elif left_max1 > right_min2:
            # Partition of nums1 is too far right, move left
            right = i - 1
        else:
            # Partition of nums1 is too far left, move right
            left = i + 1
    
    # Should never reach here for valid input
    return 0.0
```

**JavaScript:**
```javascript
function findMedianSortedArrays(nums1, nums2) {
    """
    Find median using binary search on partition.
    
    Time: O(log(min(m,n))) - binary search on smaller array
    Space: O(1) - constant extra space
    """
    # Ensure nums1 is the smaller array
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    
    m, n = len(nums1), len(nums2)
    
    # Binary search on nums1's partition
    left, right = 0, m
    
    while left <= right:
        # Partition nums1 at i (i elements on left)
        i = (left + right) // 2
        
        # Partition nums2 accordingly
        # Total left elements should be (m+n+1)//2
        j = (m + n + 1) // 2 - i
        
        # Get boundary elements (handle edge cases with infinity)
        left_max1 = float('-inf') if i == 0 else nums1[i-1]
        right_min1 = float('inf') if i == m else nums1[i]
        
        left_max2 = float('-inf') if j == 0 else nums2[j-1]
        right_min2 = float('inf') if j == n else nums2[j]
        
        # Check if partition is correct
        if left_max1 <= right_min2 and left_max2 <= right_min1:
            # Found correct partition!
            # Calculate median
            if (m + n) % 2 == 1:
                # Odd total length
                return max(left_max1, left_max2)
            else:
                # Even total length
                return (max(left_max1, left_max2) + min(right_min1, right_min2)) / 2.0
        
        elif left_max1 > right_min2:
            # Partition of nums1 is too far right, move left
            right = i - 1
        else:
            # Partition of nums1 is too far left, move right
            left = i + 1
    
    # Should never reach here for valid input
    return 0.0
```

### Complexity Analysis

- **Time Complexity:** O(log(min(m,n))) - Binary search on smaller array, each step takes O(1)
- **Space Complexity:** O(1) - Only uses constant extra space for pointers and boundary values

### Test Cases

**Test 1:** Odd total length
- Input: "([1,3], [2])"
- Expected: "2.0"

**Test 2:** Even total length
- Input: "([1,2], [3,4])"
- Expected: "2.5"

**Test 3:** One empty array
- Input: "([], [1])"
- Expected: "1.0"

**Test 4:** Other empty array
- Input: "([2], [])"
- Expected: "2.0"

**Test 5:** Arrays with overlaps
- Input: "([1,2], [1,2])"
- Expected: "1.5"

**Test 6:** Large values
- Input: "([100000], [100001])"
- Expected: "100000.5"

---

## 10. Kth Smallest Element in a Sorted Matrix

**Difficulty:** medium
**Concept:** binary-search
**Family:** binary-search:kth-element

### Description

Given an n x n matrix where each of the rows and columns is sorted in ascending order, return the kth smallest element in the matrix. Note that it is the kth smallest element in the sorted order, not the kth distinct element. You must find a solution with a memory complexity better than O(n²).

### Key Insight

Binary search on the VALUE RANGE (not indices!). Search space is [matrix[0][0], matrix[n-1][n-1]]. For each mid value, count how many elements are <= mid using the matrix's sorted property. If count >= k, the answer is in [left, mid]; otherwise search [mid+1, right]. This is "binary search on answer" pattern.

### Examples

**Example 1:**
- Input: matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8
- Output: 13
- Explanation: The elements in ascending order are [1,5,9,10,11,12,13,13,15], the 8th smallest is 13.

**Example 2:**
- Input: matrix = [[-5]], k = 1
- Output: -5
- Explanation: Single element matrix, 1st smallest is -5.

**Example 3:**
- Input: matrix = [[1,2],[1,3]], k = 2
- Output: 1
- Explanation: Elements are [1,1,2,3], 2nd smallest is 1.

### Hints

1. This is "binary search on answer" - search the value range, not array indices
2. Value range is [matrix[0][0], matrix[n-1][n-1]]
3. For counting elements <= mid: start from bottom-left, move right if element <= mid, move up otherwise
4. The counting step takes O(n) time using the sorted property
5. If count >= k, the kth element is <= mid, so search left half (including mid)
6. Total complexity is O(n * log(max - min)) which is better than O(n² log n) heap approach

### Starter Code

**Python:**
```python
def kthSmallest(matrix, k):
    """
    Find kth smallest element in row/column sorted matrix.
    
    Args:
        matrix: List[List[int]] - n x n matrix
        k: int - find kth smallest (1-indexed)
    
    Returns:
        int - the kth smallest element
    """
    # TODO: Binary search on value range
    # left = matrix[0][0], right = matrix[n-1][n-1]
    
    # TODO: For each mid value, count elements <= mid
    # Use sorted property: start from bottom-left corner
    
    # TODO: If count >= k: answer is in [left, mid]
    # Else: answer is in [mid+1, right]
    
    pass
```

**JavaScript:**
```javascript
function kthSmallest(matrix, k) {
    """
    Find kth smallest element in row/column sorted matrix.
    
    Args:
        matrix: Array] - n x n matrix
        k: int - find kth smallest (1-indexed)
    
    Returns:
        int - the kth smallest element
    """
    // TODO: Binary search on value range
    # left = matrix[0][0], right = matrix[n-1][n-1]
    
    // TODO: For each mid value, count elements <= mid
    # Use sorted property: start from bottom-left corner
    
    // TODO: If count >= k: answer is in [left, mid]
    # Else: answer is in [mid+1, right]
  // TODO: implement
```

### Solution

**Python:**
```python
def kthSmallest(matrix, k):
    """
    Find kth smallest using binary search on value range.
    
    Time: O(n * log(max - min)) - binary search on range, count takes O(n)
    Space: O(1) - constant extra space
    """
    n = len(matrix)
    
    def count_less_equal(mid):
        """Count elements <= mid using sorted property."""
        count = 0
        # Start from bottom-left corner
        row, col = n - 1, 0
        
        while row >= 0 and col < n:
            if matrix[row][col] <= mid:
                # All elements in this column up to row are <= mid
                count += row + 1
                col += 1  # Move right
            else:
                # Current element is too large
                row -= 1  # Move up
        
        return count
    
    # Binary search on value range
    left, right = matrix[0][0], matrix[n-1][n-1]
    
    while left < right:
        mid = left + (right - left) // 2
        
        # Count how many elements are <= mid
        count = count_less_equal(mid)
        
        if count < k:
            # Need larger values, search right half
            left = mid + 1
        else:
            # kth smallest is <= mid, search left half
            right = mid
    
    return left
```

**JavaScript:**
```javascript
function kthSmallest(matrix, k) {
    """
    Find kth smallest using binary search on value range.
    
    Time: O(n * log(max - min)) - binary search on range, count takes O(n)
    Space: O(1) - constant extra space
    """
    n = len(matrix)
    
    function count_less_equal(mid) {
        """Count elements <= mid using sorted property."""
        count = 0
        # Start from bottom-left corner
        row, col = n - 1, 0
        
        while row >= 0 and col < n:
            if matrix[row][col] <= mid:
                # All elements in this column up to row are <= mid
                count += row + 1
                col += 1  # Move right
            else:
                # Current element is too large
                row -= 1  # Move up
        
        return count
    
    # Binary search on value range
    left, right = matrix[0][0], matrix[n-1][n-1]
    
    while left < right:
        mid = left + (right - left) // 2
        
        # Count how many elements are <= mid
        count = count_less_equal(mid)
        
        if count < k:
            # Need larger values, search right half
            left = mid + 1
        else:
            # kth smallest is <= mid, search left half
            right = mid
    
    return left
```

### Complexity Analysis

- **Time Complexity:** O(n * log(max - min)) - Binary search on range [min, max] with O(n) counting per step
- **Space Complexity:** O(1) - Only uses constant extra space for pointers

### Test Cases

**Test 1:** 8th smallest
- Input: "([[1,5,9],[10,11,13],[12,13,15]], 8)"
- Expected: "13"

**Test 2:** Single element
- Input: "([[-5]], 1)"
- Expected: "-5"

**Test 3:** Duplicates, 2nd smallest
- Input: "([[1,2],[1,3]], 2)"
- Expected: "1"

**Test 4:** Duplicates, 3rd smallest
- Input: "([[1,2],[1,3]], 3)"
- Expected: "2"

**Test 5:** 5th smallest
- Input: "([[1,3,5],[6,7,12],[11,14,14]], 5)"
- Expected: "7"

**Test 6:** 1st smallest
- Input: "([[1,2],[3,3]], 1)"
- Expected: "1"

---

## 11. Square Root

**Difficulty:** easy
**Concept:** binary-search
**Family:** binary-search:sqrt-perfect-square

### Description

Given a non-negative integer x, return the square root of x rounded down to the nearest integer. The returned integer should be non-negative as well. You must not use any built-in exponent function or operator (like pow(x, 0.5) or x ** 0.5).

### Key Insight

Binary search on answer space! The answer is somewhere in range [0, x]. For each mid, check if mid*mid <= x. If yes, the answer could be mid or larger (left = mid+1). If mid*mid > x, answer must be smaller (right = mid-1). This is a classic "binary search on answer" pattern.

### Examples

**Example 1:**
- Input: x = 4
- Output: 2
- Explanation: The square root of 4 is 2.

**Example 2:**
- Input: x = 8
- Output: 2
- Explanation: The square root of 8 is 2.82842..., rounded down to 2.

**Example 3:**
- Input: x = 1
- Output: 1
- Explanation: The square root of 1 is 1.

### Hints

1. Think of this as searching for the largest number whose square is <= x
2. Binary search on the range [0, x]
3. For mid*mid calculation, be careful of overflow. Consider using mid <= x // mid instead
4. If mid*mid <= x, the answer is at least mid, so search right half
5. If mid*mid > x, the answer is less than mid, so search left half
6. Keep track of the last valid answer before updating pointers

### Starter Code

**Python:**
```python
def mySqrt(x):
    """
    Find square root of x rounded down.
    
    Args:
        x: int - non-negative integer
    
    Returns:
        int - square root rounded down
    """
    # TODO: Binary search on answer range [0, x]
    # left, right = 0, x
    
    # TODO: For each mid:
    # If mid*mid <= x: answer could be mid or larger
    # If mid*mid > x: answer must be smaller
    
    # TODO: Return the largest mid where mid*mid <= x
    pass
```

**JavaScript:**
```javascript
function mySqrt(x) {
    """
    Find square root of x rounded down.
    
    Args:
        x: int - non-negative integer
    
    Returns:
        int - square root rounded down
    """
    // TODO: Binary search on answer range [0, x]
    # left, right = 0, x
    
    // TODO: For each mid:
    # If mid*mid <= x: answer could be mid or larger
    # If mid*mid > x: answer must be smaller
    
    // TODO: Return the largest mid where mid*mid <= x
  // TODO: implement
```

### Solution

**Python:**
```python
def mySqrt(x):
    """
    Find square root using binary search on answer.
    
    Time: O(log x) - binary search on range [0, x]
    Space: O(1) - constant extra space
    """
    if x < 2:
        return x
    
    left, right = 1, x
    result = 0
    
    while left <= right:
        mid = left + (right - left) // 2
        
        # Check if mid is the answer (avoid overflow with mid <= x // mid)
        if mid <= x // mid:
            # mid*mid <= x, so answer is at least mid
            result = mid
            left = mid + 1  # Try larger values
        else:
            # mid*mid > x, so answer is smaller
            right = mid - 1
    
    return result
```

**JavaScript:**
```javascript
function mySqrt(x) {
    """
    Find square root using binary search on answer.
    
    Time: O(log x) - binary search on range [0, x]
    Space: O(1) - constant extra space
    """
    if x < 2:
        return x
    
    left, right = 1, x
    result = 0
    
    while left <= right:
        mid = left + (right - left) // 2
        
        # Check if mid is the answer (avoid overflow with mid <= x // mid)
        if mid <= x // mid:
            # mid*mid <= x, so answer is at least mid
            result = mid
            left = mid + 1  # Try larger values
        else:
            # mid*mid > x, so answer is smaller
            right = mid - 1
    
    return result
```

### Complexity Analysis

- **Time Complexity:** O(log x) - Binary search reduces search space by half each iteration
- **Space Complexity:** O(1) - Only uses constant extra space for pointers

### Test Cases

**Test 1:** Perfect square
- Input: "(4,)"
- Expected: "2"

**Test 2:** Non-perfect square
- Input: "(8,)"
- Expected: "2"

**Test 3:** Zero
- Input: "(0,)"
- Expected: "0"

**Test 4:** One
- Input: "(1,)"
- Expected: "1"

**Test 5:** Small number
- Input: "(2,)"
- Expected: "1"

**Test 6:** Large number
- Input: "(2147395599,)"
- Expected: "46339"

**Test 7:** PERFORMANCE: Maximum 32-bit integer - Must use O(log x) binary search
- Input: "(2147483647,)"
- Expected: "46340"

---

## 12. Valid Perfect Square

**Difficulty:** easy
**Concept:** binary-search
**Family:** binary-search:sqrt-perfect-square

### Description

Given a positive integer num, return true if num is a perfect square or false otherwise. A perfect square is an integer that is the square of an integer. In other words, it is the product of some integer with itself. You must not use any built-in library function, such as sqrt.

### Key Insight

Similar to square root, but now we need an exact match. Binary search on range [1, num]. For each mid, check if mid*mid == num (found it!), mid*mid < num (search right), or mid*mid > num (search left). Unlike square root problem, we return false if no exact match is found.

### Examples

**Example 1:**
- Input: num = 16
- Output: true
- Explanation: 16 = 4 * 4, so it is a perfect square.

**Example 2:**
- Input: num = 14
- Output: false
- Explanation: 14 is not a perfect square.

**Example 3:**
- Input: num = 1
- Output: true
- Explanation: 1 = 1 * 1, so it is a perfect square.

### Hints

1. Use binary search to find if there exists an integer whose square equals num
2. Search range is [1, num]
3. Three cases: mid*mid == num (found!), mid*mid < num (search right), mid*mid > num (search left)
4. To avoid overflow, use mid <= num // mid for comparison
5. If loop ends without finding exact match, return False
6. Edge case: num = 1 is a perfect square

### Starter Code

**Python:**
```python
def isPerfectSquare(num):
    """
    Check if num is a perfect square.
    
    Args:
        num: int - positive integer
    
    Returns:
        bool - True if perfect square, False otherwise
    """
    # TODO: Binary search on range [1, num]
    # left, right = 1, num
    
    # TODO: For each mid:
    # If mid*mid == num: found perfect square!
    # If mid*mid < num: search right half
    # If mid*mid > num: search left half
    
    # TODO: Return False if no exact match found
    pass
```

**JavaScript:**
```javascript
function isPerfectSquare(num) {
    """
    Check if num is a perfect square.
    
    Args:
        num: int - positive integer
    
    Returns:
        bool - true if perfect square, false otherwise
    """
    // TODO: Binary search on range [1, num]
    # left, right = 1, num
    
    // TODO: For each mid:
    # If mid*mid == num: found perfect square!
    # If mid*mid < num: search right half
    # If mid*mid > num: search left half
    
    // TODO: Return false if no exact match found
  // TODO: implement
```

### Solution

**Python:**
```python
def isPerfectSquare(num):
    """
    Check if num is a perfect square using binary search.
    
    Time: O(log num) - binary search on range [1, num]
    Space: O(1) - constant extra space
    """
    if num == 1:
        return True
    
    left, right = 1, num
    
    while left <= right:
        mid = left + (right - left) // 2
        square = mid * mid
        
        if square == num:
            # Found exact match!
            return True
        elif square < num:
            # Need larger number
            left = mid + 1
        else:
            # Need smaller number
            right = mid - 1
    
    # No exact match found
    return False
```

**JavaScript:**
```javascript
function isPerfectSquare(num) {
    """
    Check if num is a perfect square using binary search.
    
    Time: O(log num) - binary search on range [1, num]
    Space: O(1) - constant extra space
    """
    if num == 1:
        return true
    
    left, right = 1, num
    
    while left <= right:
        mid = left + (right - left) // 2
        square = mid * mid
        
        if square == num:
            # Found exact match!
            return true
        elif square < num:
            # Need larger number
            left = mid + 1
        else:
            # Need smaller number
            right = mid - 1
    
    # No exact match found
    return false
```

### Complexity Analysis

- **Time Complexity:** O(log num) - Binary search reduces search space by half each iteration
- **Space Complexity:** O(1) - Only uses constant extra space for pointers

### Test Cases

**Test 1:** Perfect square 4*4
- Input: "(16,)"
- Expected: "True"

**Test 2:** Not a perfect square
- Input: "(14,)"
- Expected: "False"

**Test 3:** One is perfect square
- Input: "(1,)"
- Expected: "True"

**Test 4:** Two is not perfect square
- Input: "(2,)"
- Expected: "False"

**Test 5:** Perfect square 3*3
- Input: "(9,)"
- Expected: "True"

**Test 6:** Large number not perfect square
- Input: "(2147483647,)"
- Expected: "False"

---

## 13. Find Peak Element

**Difficulty:** medium
**Concept:** binary-search
**Family:** binary-search:peak-element

### Description

A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array nums, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks. You may imagine that nums[-1] = nums[n] = -∞. In other words, an element is always considered to be strictly greater than a neighbor that is outside the array. You must write an algorithm that runs in O(log n) time.

### Key Insight

Key insight: Compare nums[mid] with nums[mid+1]. If nums[mid] > nums[mid+1], we are on a descending slope, so a peak exists in the left half (including mid). If nums[mid] < nums[mid+1], we are on an ascending slope, so a peak exists in the right half. This works because we are guaranteed that nums[-1] and nums[n] are negative infinity.

### Examples

**Example 1:**
- Input: nums = [1,2,3,1]
- Output: 2
- Explanation: 3 is a peak element and your function should return index 2.

**Example 2:**
- Input: nums = [1,2,1,3,5,6,4]
- Output: 5
- Explanation: Your function can return either index 1 where the peak element is 2, or index 5 where the peak element is 6.

**Example 3:**
- Input: nums = [1]
- Output: 0
- Explanation: Single element is a peak.

### Hints

1. You don't need to find the global maximum, just any local peak
2. Compare nums[mid] with nums[mid+1] to determine which direction has a peak
3. If nums[mid] > nums[mid+1], you are going downhill, so peak is to the left (including mid)
4. If nums[mid] < nums[mid+1], you are going uphill, so peak is to the right
5. The algorithm works because nums[-1] and nums[n] are considered -infinity
6. Use while left < right to avoid index out of bounds

### Starter Code

**Python:**
```python
def findPeakElement(nums):
    """
    Find a peak element in the array.
    
    Args:
        nums: List[int] - array of integers
    
    Returns:
        int - index of any peak element
    """
    # TODO: Binary search to find peak
    # left, right = 0, len(nums) - 1
    
    # TODO: Compare nums[mid] with nums[mid+1]
    # If nums[mid] > nums[mid+1]: peak is in left half (including mid)
    # If nums[mid] < nums[mid+1]: peak is in right half
    
    # TODO: Return left when left == right
    pass
```

**JavaScript:**
```javascript
function findPeakElement(nums) {
    """
    Find a peak element in the array.
    
    Args:
        nums: Array - array of integers
    
    Returns:
        int - index of any peak element
    """
    // TODO: Binary search to find peak
    # left, right = 0, len(nums) - 1
    
    // TODO: Compare nums[mid] with nums[mid+1]
    # If nums[mid] > nums[mid+1]: peak is in left half (including mid)
    # If nums[mid] < nums[mid+1]: peak is in right half
    
    // TODO: Return left when left == right
  // TODO: implement
```

### Solution

**Python:**
```python
def findPeakElement(nums):
    """
    Find peak element using binary search.
    
    Time: O(log n) - binary search
    Space: O(1) - constant extra space
    """
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        # Compare mid with its right neighbor
        if nums[mid] > nums[mid + 1]:
            # We are on descending slope
            # Peak is at mid or to the left
            right = mid
        else:
            # We are on ascending slope
            # Peak is to the right of mid
            left = mid + 1
    
    # When left == right, we found a peak
    return left
```

**JavaScript:**
```javascript
function findPeakElement(nums) {
    """
    Find peak element using binary search.
    
    Time: O(log n) - binary search
    Space: O(1) - constant extra space
    """
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        # Compare mid with its right neighbor
        if nums[mid] > nums[mid + 1]:
            # We are on descending slope
            # Peak is at mid or to the left
            right = mid
        else:
            # We are on ascending slope
            # Peak is to the right of mid
            left = mid + 1
    
    # When left == right, we found a peak
    return left
```

### Complexity Analysis

- **Time Complexity:** O(log n) - Binary search reduces search space by half each iteration
- **Space Complexity:** O(1) - Only uses constant extra space for pointers

### Test Cases

**Test 1:** Single peak at end
- Input: "([1,2,3,1],)"
- Expected: "2"

**Test 2:** Multiple peaks, return any
- Input: "([1,2,1,3,5,6,4],)"
- Expected: "1"

**Test 3:** Single element
- Input: "([1],)"
- Expected: "0"

**Test 4:** Ascending array
- Input: "([1,2],)"
- Expected: "1"

**Test 5:** Descending array
- Input: "([2,1],)"
- Expected: "0"

**Test 6:** Strictly ascending
- Input: "([1,2,3,4,5],)"
- Expected: "4"

**Test 7:** PERFORMANCE: Large array (100K elements) - Must use O(log n) binary search
- Input: "(list(range(100000)),)"
- Expected: "99999"

---

## 14. Capacity To Ship Packages Within D Days

**Difficulty:** medium
**Concept:** binary-search
**Family:** binary-search:capacity-optimization

### Description

A conveyor belt has packages that must be shipped from one port to another within days days. The ith package on the conveyor belt has a weight of weights[i]. Each day, we load the ship with packages on the conveyor belt (in the order given by weights). We may not load more weight than the maximum weight capacity of the ship. Return the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within days days.

### Key Insight

Binary search on answer! The answer (minimum capacity) is in range [max(weights), sum(weights)]. For each candidate capacity mid, check if we can ship all packages within days. If yes, try smaller capacity (right = mid). If no, need larger capacity (left = mid+1). This is "minimize the maximum" pattern.

### Examples

**Example 1:**
- Input: weights = [1,2,3,4,5,6,7,8,9,10], days = 5
- Output: 15
- Explanation: A ship capacity of 15 is the minimum to ship all the packages in 5 days: Day 1: 1,2,3,4,5 (15), Day 2: 6,7 (13), Day 3: 8 (8), Day 4: 9 (9), Day 5: 10 (10).

**Example 2:**
- Input: weights = [3,2,2,4,1,4], days = 3
- Output: 6
- Explanation: A ship capacity of 6 is the minimum: Day 1: 3,2 (5), Day 2: 2,4 (6), Day 3: 1,4 (5).

**Example 3:**
- Input: weights = [1,2,3,1,1], days = 4
- Output: 3
- Explanation: Capacity of 3: Day 1: 1,2 (3), Day 2: 3 (3), Day 3: 1,1 (2), Day 4: empty or 0.

### Hints

1. This is binary search on answer - search for the minimum capacity
2. Capacity must be at least max(weights) (to carry the heaviest package)
3. Capacity at most sum(weights) (carry everything in one day)
4. For each candidate capacity, simulate the shipping process
5. Count how many days needed: if current_load + next_package > capacity, start new day
6. If days_needed <= days, the capacity works, try smaller; otherwise try larger

### Starter Code

**Python:**
```python
def shipWithinDays(weights, days):
    """
    Find minimum ship capacity to ship all packages in given days.
    
    Args:
        weights: List[int] - weights of packages
        days: int - number of days available
    
    Returns:
        int - minimum ship capacity needed
    """
    # TODO: Define helper function to check if capacity works
    # def can_ship(capacity):
    #     days_needed = 1
    #     current_weight = 0
    #     for weight in weights:
    #         if current_weight + weight > capacity:
    #             days_needed += 1
    #             current_weight = weight
    #         else:
    #             current_weight += weight
    #     return days_needed <= days
    
    # TODO: Binary search on capacity range [max(weights), sum(weights)]
    # If can_ship(mid): try smaller capacity
    # Else: need larger capacity
    
    pass
```

**JavaScript:**
```javascript
function shipWithinDays(weights, days) {
    """
    Find minimum ship capacity to ship all packages in given days.
    
    Args:
        weights: Array - weights of packages
        days: int - number of days available
    
    Returns:
        int - minimum ship capacity needed
    """
    // TODO: Define helper function to check if capacity works
    # function can_ship(capacity) {
    #     days_needed = 1
    #     current_weight = 0
    #     for weight in weights:
    #         if current_weight + weight > capacity:
    #             days_needed += 1
    #             current_weight = weight
    #         else:
    #             current_weight += weight
    #     return days_needed <= days
    
    // TODO: Binary search on capacity range [max(weights), sum(weights)]
    # If can_ship(mid): try smaller capacity
    # Else: need larger capacity
  // TODO: implement
```

### Solution

**Python:**
```python
def shipWithinDays(weights, days):
    """
    Find minimum capacity using binary search on answer.
    
    Time: O(n * log(sum)) - binary search with O(n) validation each step
    Space: O(1) - constant extra space
    """
    def can_ship_with_capacity(capacity):
        """Check if we can ship all packages with given capacity."""
        days_needed = 1
        current_weight = 0
        
        for weight in weights:
            if current_weight + weight > capacity:
                # Start new day
                days_needed += 1
                current_weight = weight
            else:
                # Add to current day
                current_weight += weight
        
        return days_needed <= days
    
    # Binary search on capacity range
    left = max(weights)  # Must carry heaviest package
    right = sum(weights)  # Carry everything in one day
    
    while left < right:
        mid = left + (right - left) // 2
        
        if can_ship_with_capacity(mid):
            # This capacity works, try smaller
            right = mid
        else:
            # Need larger capacity
            left = mid + 1
    
    return left
```

**JavaScript:**
```javascript
function shipWithinDays(weights, days) {
    """
    Find minimum capacity using binary search on answer.
    
    Time: O(n * log(sum)) - binary search with O(n) validation each step
    Space: O(1) - constant extra space
    """
    function can_ship_with_capacity(capacity) {
        """Check if we can ship all packages with given capacity."""
        days_needed = 1
        current_weight = 0
        
        for weight in weights:
            if current_weight + weight > capacity:
                # Start new day
                days_needed += 1
                current_weight = weight
            else:
                # Add to current day
                current_weight += weight
        
        return days_needed <= days
    
    # Binary search on capacity range
    left = max(weights)  # Must carry heaviest package
    right = sum(weights)  # Carry everything in one day
    
    while left < right:
        mid = left + (right - left) // 2
        
        if can_ship_with_capacity(mid):
            # This capacity works, try smaller
            right = mid
        else:
            # Need larger capacity
            left = mid + 1
    
    return left
```

### Complexity Analysis

- **Time Complexity:** O(n * log(sum - max)) - Binary search on capacity range with O(n) simulation per step
- **Space Complexity:** O(1) - Only uses constant extra space

### Test Cases

**Test 1:** 10 packages in 5 days
- Input: "([1,2,3,4,5,6,7,8,9,10], 5)"
- Expected: "15"

**Test 2:** 6 packages in 3 days
- Input: "([3,2,2,4,1,4], 3)"
- Expected: "6"

**Test 3:** Light packages
- Input: "([1,2,3,1,1], 4)"
- Expected: "3"

**Test 4:** Each package one day
- Input: "([10,20,30,40,50], 5)"
- Expected: "50"

**Test 5:** Everything in one day
- Input: "([10,20,30,40,50], 1)"
- Expected: "150"

**Test 6:** Many small packages
- Input: "([1,1,1,1,1,1,1,1,1,1], 3)"
- Expected: "4"

**Test 7:** PERFORMANCE: Large array (50K elements) - Must use O(n*log(sum)) binary search on answer
- Input: "(list(range(1, 50001)), 100)"
- Expected: "12500"

---

## 15. Koko Eating Bananas

**Difficulty:** medium
**Concept:** binary-search
**Family:** binary-search:capacity-optimization

### Description

Koko loves to eat bananas. There are n piles of bananas, the ith pile has piles[i] bananas. The guards have gone and will come back in h hours. Koko can decide her bananas-per-hour eating speed of k. Each hour, she chooses some pile of bananas and eats k bananas from that pile. If the pile has less than k bananas, she eats all of them instead and will not eat any more bananas during this hour. Koko likes to eat slowly but still wants to finish eating all the bananas before the guards return. Return the minimum integer k such that she can eat all the bananas within h hours.

### Key Insight

Binary search on answer! The eating speed k is in range [1, max(piles)]. For each speed k, calculate hours needed: sum(ceil(pile/k) for pile in piles). If hours <= h, try smaller speed (right = mid). If hours > h, need faster speed (left = mid+1). This is another "minimize the maximum" pattern.

### Examples

**Example 1:**
- Input: piles = [3,6,7,11], h = 8
- Output: 4
- Explanation: Koko can eat at speed 4: pile 1 takes 1 hour, pile 2 takes 2 hours, pile 3 takes 2 hours, pile 4 takes 3 hours. Total 8 hours.

**Example 2:**
- Input: piles = [30,11,23,4,20], h = 5
- Output: 30
- Explanation: Must eat at speed 30 to finish in 5 hours (one pile per hour).

**Example 3:**
- Input: piles = [30,11,23,4,20], h = 6
- Output: 23
- Explanation: Can eat at speed 23 to finish in 6 hours.

### Hints

1. Binary search on the eating speed, not the piles array
2. Speed range is [1, max(piles)] - minimum 1, maximum eating the biggest pile in 1 hour
3. For speed k, hours needed for pile p is ceil(p/k) or (p + k - 1) // k
4. Total hours = sum of hours needed for each pile
5. If total hours <= h, speed k works, try slower (smaller k)
6. If total hours > h, need faster speed (larger k)

### Starter Code

**Python:**
```python
def minEatingSpeed(piles, h):
    """
    Find minimum eating speed to finish all bananas in h hours.
    
    Args:
        piles: List[int] - number of bananas in each pile
        h: int - hours available
    
    Returns:
        int - minimum eating speed k
    """
    # TODO: Define helper to calculate hours needed for speed k
    # import math
    # def hours_needed(k):
    #     return sum(math.ceil(pile / k) for pile in piles)
    
    # TODO: Binary search on speed range [1, max(piles)]
    # If hours_needed(mid) <= h: try slower speed
    # Else: need faster speed
    
    pass
```

**JavaScript:**
```javascript
function minEatingSpeed(piles, h) {
    """
    Find minimum eating speed to finish all bananas in h hours.
    
    Args:
        piles: Array - number of bananas in each pile
        h: int - hours available
    
    Returns:
        int - minimum eating speed k
    """
    // TODO: Define helper to calculate hours needed for speed k
    # import math
    # function hours_needed(k) {
    #     return sum(math.ceil(pile / k) for pile in piles)
    
    // TODO: Binary search on speed range [1, max(piles)]
    # If hours_needed(mid) <= h: try slower speed
    # Else: need faster speed
  // TODO: implement
```

### Solution

**Python:**
```python
def minEatingSpeed(piles, h):
    """
    Find minimum eating speed using binary search on answer.
    
    Time: O(n * log(max)) - binary search with O(n) calculation per step
    Space: O(1) - constant extra space
    """
    import math
    
    def hours_to_eat_all(speed):
        """Calculate hours needed to eat all piles at given speed."""
        return sum(math.ceil(pile / speed) for pile in piles)
    
    # Binary search on eating speed
    left = 1  # Minimum speed
    right = max(piles)  # Maximum speed (eat biggest pile in 1 hour)
    
    while left < right:
        mid = left + (right - left) // 2
        
        hours_needed = hours_to_eat_all(mid)
        
        if hours_needed <= h:
            # This speed works, try slower
            right = mid
        else:
            # Too slow, need faster speed
            left = mid + 1
    
    return left
```

**JavaScript:**
```javascript
function minEatingSpeed(piles, h) {
    """
    Find minimum eating speed using binary search on answer.
    
    Time: O(n * log(max)) - binary search with O(n) calculation per step
    Space: O(1) - constant extra space
    """
    import math
    
    function hours_to_eat_all(speed) {
        """Calculate hours needed to eat all piles at given speed."""
        return sum(math.ceil(pile / speed) for pile in piles)
    
    # Binary search on eating speed
    left = 1  # Minimum speed
    right = max(piles)  # Maximum speed (eat biggest pile in 1 hour)
    
    while left < right:
        mid = left + (right - left) // 2
        
        hours_needed = hours_to_eat_all(mid)
        
        if hours_needed <= h:
            # This speed works, try slower
            right = mid
        else:
            # Too slow, need faster speed
            left = mid + 1
    
    return left
```

### Complexity Analysis

- **Time Complexity:** O(n * log(max_pile)) - Binary search on speed range [1, max] with O(n) calculation per step
- **Space Complexity:** O(1) - Only uses constant extra space

### Test Cases

**Test 1:** Standard case
- Input: "([3,6,7,11], 8)"
- Expected: "4"

**Test 2:** Minimum hours
- Input: "([30,11,23,4,20], 5)"
- Expected: "30"

**Test 3:** One extra hour
- Input: "([30,11,23,4,20], 6)"
- Expected: "23"

**Test 4:** Slowest possible speed
- Input: "([1,1,1,1], 4)"
- Expected: "1"

**Test 5:** Very large pile
- Input: "([1000000000], 2)"
- Expected: "500000000"

**Test 6:** Many hours available
- Input: "([312884470], 312884469)"
- Expected: "2"

**Test 7:** PERFORMANCE: Large array (10K piles) - Must use O(n*log(max)) binary search on answer
- Input: "(list(range(1, 10001)), 50000)"
- Expected: "3"

---

## 16. Split Array Largest Sum

**Difficulty:** hard
**Concept:** binary-search
**Family:** binary-search:capacity-optimization

### Description

Given an integer array nums and an integer k, split nums into k non-empty subarrays such that the largest sum of any subarray is minimized. Return the minimized largest sum of the split. A subarray is a contiguous part of the array.

### Key Insight

Binary search on answer! The answer (minimum largest sum) is in range [max(nums), sum(nums)]. For each candidate max_sum, check if we can split the array into k or fewer subarrays where each subarray sum <= max_sum. If yes, try smaller max_sum (right = mid). If no, need larger max_sum (left = mid+1). This is the classic "minimize the maximum" pattern.

### Examples

**Example 1:**
- Input: nums = [7,2,5,10,8], k = 2
- Output: 18
- Explanation: Split into [7,2,5] and [10,8] with sums 14 and 18. The largest sum is 18.

**Example 2:**
- Input: nums = [1,2,3,4,5], k = 2
- Output: 9
- Explanation: Split into [1,2,3,4] and [5] with sums 10 and 5. Actually, best is [1,2,3] and [4,5] with sums 6 and 9.

**Example 3:**
- Input: nums = [1,4,4], k = 3
- Output: 4
- Explanation: Split into [1], [4], [4]. Largest sum is 4.

### Hints

1. Binary search on the answer (the maximum subarray sum)
2. Answer range is [max(nums), sum(nums)]
3. For each candidate max_sum, check if we can split into <= k subarrays
4. Greedily form subarrays: add elements until adding next would exceed max_sum
5. If we need more than k subarrays, max_sum is too small
6. If we need k or fewer subarrays, max_sum works, try smaller

### Starter Code

**Python:**
```python
def splitArray(nums, k):
    """
    Split array into k subarrays minimizing the largest sum.
    
    Args:
        nums: List[int] - array of integers
        k: int - number of subarrays
    
    Returns:
        int - minimized largest sum
    """
    # TODO: Define helper to check if max_sum works
    # def can_split(max_sum):
    #     subarrays = 1
    #     current_sum = 0
    #     for num in nums:
    #         if current_sum + num > max_sum:
    #             subarrays += 1
    #             current_sum = num
    #         else:
    #             current_sum += num
    #     return subarrays <= k
    
    # TODO: Binary search on range [max(nums), sum(nums)]
    # If can_split(mid): try smaller max_sum
    # Else: need larger max_sum
    
    pass
```

**JavaScript:**
```javascript
function splitArray(nums, k) {
    """
    Split array into k subarrays minimizing the largest sum.
    
    Args:
        nums: Array - array of integers
        k: int - number of subarrays
    
    Returns:
        int - minimized largest sum
    """
    // TODO: Define helper to check if max_sum works
    # function can_split(max_sum) {
    #     subarrays = 1
    #     current_sum = 0
    #     for num in nums:
    #         if current_sum + num > max_sum:
    #             subarrays += 1
    #             current_sum = num
    #         else:
    #             current_sum += num
    #     return subarrays <= k
    
    // TODO: Binary search on range [max(nums), sum(nums)]
    # If can_split(mid): try smaller max_sum
    # Else: need larger max_sum
  // TODO: implement
```

### Solution

**Python:**
```python
def splitArray(nums, k):
    """
    Split array minimizing largest sum using binary search on answer.
    
    Time: O(n * log(sum)) - binary search with O(n) validation
    Space: O(1) - constant extra space
    """
    def can_split_with_max_sum(max_sum):
        """Check if we can split into <= k subarrays with each sum <= max_sum."""
        subarrays = 1
        current_sum = 0
        
        for num in nums:
            if current_sum + num > max_sum:
                # Start new subarray
                subarrays += 1
                current_sum = num
            else:
                # Add to current subarray
                current_sum += num
        
        return subarrays <= k
    
    # Binary search on the maximum subarray sum
    left = max(nums)  # At least one element must be in a subarray
    right = sum(nums)  # All elements in one subarray
    
    while left < right:
        mid = left + (right - left) // 2
        
        if can_split_with_max_sum(mid):
            # This max_sum works, try smaller
            right = mid
        else:
            # Need larger max_sum
            left = mid + 1
    
    return left
```

**JavaScript:**
```javascript
function splitArray(nums, k) {
    """
    Split array minimizing largest sum using binary search on answer.
    
    Time: O(n * log(sum)) - binary search with O(n) validation
    Space: O(1) - constant extra space
    """
    function can_split_with_max_sum(max_sum) {
        """Check if we can split into <= k subarrays with each sum <= max_sum."""
        subarrays = 1
        current_sum = 0
        
        for num in nums:
            if current_sum + num > max_sum:
                # Start new subarray
                subarrays += 1
                current_sum = num
            else:
                # Add to current subarray
                current_sum += num
        
        return subarrays <= k
    
    # Binary search on the maximum subarray sum
    left = max(nums)  # At least one element must be in a subarray
    right = sum(nums)  # All elements in one subarray
    
    while left < right:
        mid = left + (right - left) // 2
        
        if can_split_with_max_sum(mid):
            # This max_sum works, try smaller
            right = mid
        else:
            # Need larger max_sum
            left = mid + 1
    
    return left
```

### Complexity Analysis

- **Time Complexity:** O(n * log(sum - max)) - Binary search on sum range with O(n) validation per step
- **Space Complexity:** O(1) - Only uses constant extra space

### Test Cases

**Test 1:** Split into 2 subarrays
- Input: "([7,2,5,10,8], 2)"
- Expected: "18"

**Test 2:** Small numbers
- Input: "([1,2,3,4,5], 2)"
- Expected: "9"

**Test 3:** Split each element
- Input: "([1,4,4], 3)"
- Expected: "4"

**Test 4:** Many elements
- Input: "([10,5,13,4,8,4,5,11,14,9,16,10,20,8], 8)"
- Expected: "25"

**Test 5:** All same elements
- Input: "([1,1,1,1], 2)"
- Expected: "2"

**Test 6:** Single element
- Input: "([100], 1)"
- Expected: "100"

**Test 7:** PERFORMANCE: Large array (10K elements) - Must use O(n*log(sum)) binary search on answer
- Input: "(list(range(1, 10001)), 50)"
- Expected: "2001"

---
