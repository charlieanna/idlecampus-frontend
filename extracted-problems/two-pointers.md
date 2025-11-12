# TWO-POINTERS Problems

Total Problems: 13

---

## 1. Remove Duplicates from Sorted Array

**Difficulty:** easy
**Concept:** two-pointers
**Family:** two-pointers:in-place-modify

### Description

Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Return k after placing the final result in the first k slots of nums.

### Key Insight

Use slow-fast pointer pattern. Slow pointer tracks position to write next unique element. Fast pointer scans array. When nums[fast] != nums[slow], found new unique element - write it at slow+1 and increment slow. Since array is sorted, duplicates are adjacent, making detection simple.

### Examples

**Example 1:**
- Input: nums = [1,1,2]
- Output: 2, nums = [1,2,_]
- Explanation: Function returns 2, with first two elements being 1 and 2

**Example 2:**
- Input: nums = [0,0,1,1,1,2,2,3,3,4]
- Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]
- Explanation: Function returns 5, with first five elements being unique values

**Example 3:**
- Input: nums = [1,2,3]
- Output: 3, nums = [1,2,3]
- Explanation: No duplicates, return original length

### Hints

1. Since array is sorted, all duplicates are adjacent
2. Use slow pointer to track position of last unique element
3. Use fast pointer to scan through array looking for new unique values
4. When nums[fast] != nums[slow], you found a new unique element
5. Place new unique element at position slow+1, then increment slow
6. After loop completes, slow+1 gives count of unique elements
7. This works in-place with O(1) extra space and O(n) time

### Starter Code

**Python:**
```python
def removeDuplicates(nums):
    """
    Remove duplicates from sorted array in-place.
    
    Args:
        nums: List[int] - sorted array
    
    Returns:
        int - number of unique elements
    """
    # TODO: Handle empty array edge case
    
    # TODO: Initialize slow pointer at 0 (tracks last unique element)
    
    # TODO: Use fast pointer to scan array (start at 1)
    
    # TODO: When nums[fast] != nums[slow]:
    # - Increment slow
    # - Copy nums[fast] to nums[slow]
    
    # TODO: Return slow + 1 (count of unique elements)
    
    pass
```

**JavaScript:**
```javascript
function removeDuplicates(nums) {
    """
    Remove duplicates from sorted array in-place.
    
    Args:
        nums: Array - sorted array
    
    Returns:
        int - number of unique elements
    """
    // TODO: Handle empty array edge case
    
    // TODO: Initialize slow pointer at 0 (tracks last unique element)
    
    // TODO: Use fast pointer to scan array (start at 1)
    
    // TODO: When nums[fast] != nums[slow]:
    # - Increment slow
    # - Copy nums[fast] to nums[slow]
    
    // TODO: Return slow + 1 (count of unique elements)
  // TODO: implement
```

### Solution

**Python:**
```python
def removeDuplicates(nums):
    if not nums:
        return 0
    
    # Slow pointer tracks last unique element position
    slow = 0
    
    # Fast pointer scans for new unique elements
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            # Found new unique element
            slow += 1
            nums[slow] = nums[fast]
    
    # Return count of unique elements
    return slow + 1

# Explanation:
# 1. slow pointer at position 0 (first element always unique)
# 2. fast pointer scans from index 1 to end
# 3. Since sorted, duplicates are adjacent
# 4. When nums[fast] != nums[slow]: new unique element found
# 5. Increment slow, copy nums[fast] to nums[slow]
# 6. This compacts unique elements to front of array
# 7. Return slow + 1 as count of unique elements
# 8. Time: O(n) single pass, Space: O(1) in-place
```

**JavaScript:**
```javascript
function removeDuplicates(nums) {
    if not nums:
        return 0
    
    # Slow pointer tracks last unique element position
    slow = 0
    
    # Fast pointer scans for new unique elements
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            # Found new unique element
            slow += 1
            nums[slow] = nums[fast]
    
    # Return count of unique elements
    return slow + 1

# Explanation:
# 1. slow pointer at position 0 (first element always unique)
# 2. fast pointer scans from index 1 to end
# 3. Since sorted, duplicates are adjacent
# 4. When nums[fast] != nums[slow]: new unique element found
# 5. Increment slow, copy nums[fast] to nums[slow]
# 6. This compacts unique elements to front of array
# 7. Return slow + 1 as count of unique elements
# 8. Time: O(n) single pass, Space: O(1) in-place
```

### Complexity Analysis

- **Time Complexity:** O(n) - single pass through array
- **Space Complexity:** O(1) - only two pointers used, in-place modification

### Test Cases

**Test 1:** Basic case with one duplicate
- Input: "removeDuplicates([1,1,2])"
- Expected: "2"

**Test 2:** Multiple duplicates of each element
- Input: "removeDuplicates([0,0,1,1,1,2,2,3,3,4])"
- Expected: "5"

**Test 3:** No duplicates
- Input: "removeDuplicates([1,2,3])"
- Expected: "3"

**Test 4:** Single element
- Input: "removeDuplicates([1])"
- Expected: "1"

**Test 5:** All elements are duplicates
- Input: "removeDuplicates([1,1,1,1,1])"
- Expected: "1"

**Test 6:** Negative numbers with duplicates
- Input: "removeDuplicates([-1,0,0,0,3,3])"
- Expected: "3"

**Test 7:** PERFORMANCE: Large array (100K elements) - Must use O(n) two-pointer approach
- Input: "removeDuplicates(sorted([i // 5 for i in range(100000)]))"
- Expected: "20000"

---

## 2. 3Sum

**Difficulty:** medium
**Concept:** two-pointers
**Family:** two-pointers:n-sum

### Description

Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.

### Key Insight

Sort the array first. Fix one element at a time, then use two pointers (left and right) to find pairs that sum to the negative of the fixed element. Skip duplicates at all three positions to avoid duplicate triplets. This reduces 3Sum to multiple 2Sum problems on a sorted array.

### Examples

**Example 1:**
- Input: nums = [-1,0,1,2,-1,-4]
- Output: [[-1,-1,2],[-1,0,1]]
- Explanation: The triplets that sum to 0 are: nums[0]+nums[2]+nums[4]=(-1)+1+(-1)=(-1) and nums[1]+nums[2]+nums[3]=0+1+(-1)=0. Note that the order of the output and the order of the triplets does not matter.

**Example 2:**
- Input: nums = [0,1,1]
- Output: []
- Explanation: The only possible triplet does not sum up to 0.

**Example 3:**
- Input: nums = [0,0,0]
- Output: [[0,0,0]]
- Explanation: The only possible triplet sums up to 0.

### Hints

1. Start by sorting the array - this enables the two-pointer technique and makes duplicate skipping easier
2. Fix the first element with a loop, then solve 2Sum for the remaining array with target = -nums[i]
3. For the two-pointer part: if sum < 0, move left pointer right (need larger sum). If sum > 0, move right pointer left (need smaller sum)
4. After finding a valid triplet, skip all duplicate values for both left and right pointers: while left < right and nums[left] == nums[left+1]: left += 1
5. Also skip duplicates for the fixed element: if i > 0 and nums[i] == nums[i-1]: continue
6. The combination of sorting + skipping duplicates ensures no duplicate triplets in the result

### Starter Code

**Python:**
```python
def threeSum(nums):
    """
    Find all unique triplets that sum to zero.
    
    Args:
        nums: List[int] - array of integers
    
    Returns:
        List[List[int]] - list of triplets that sum to 0
    """
    # TODO: Sort the array first
    
    # TODO: Fix first element with loop (i from 0 to n-3)
    # Skip duplicates for first element
    
    # TODO: Use two pointers (left = i+1, right = n-1)
    # Find pairs where nums[left] + nums[right] = -nums[i]
    
    # TODO: Skip duplicates for second and third elements
    
    pass
```

**JavaScript:**
```javascript
function threeSum(nums) {
    """
    Find all unique triplets that sum to zero.
    
    Args:
        nums: Array - array of integers
    
    Returns:
        Array] - list of triplets that sum to 0
    """
    // TODO: Sort the array first
    
    // TODO: Fix first element with loop (i from 0 to n-3)
    # Skip duplicates for first element
    
    // TODO: Use two pointers (left = i+1, right = n-1)
    # Find pairs where nums[left] + nums[right] = -nums[i]
    
    // TODO: Skip duplicates for second and third elements
  // TODO: implement
```

### Solution

**Python:**
```python
def threeSum(nums):
    nums.sort()
    result = []
    n = len(nums)
    
    for i in range(n - 2):
        # Skip duplicates for first element
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        # Two pointers for remaining elements
        left = i + 1
        right = n - 1
        target = -nums[i]
        
        while left < right:
            current_sum = nums[left] + nums[right]
            
            if current_sum == target:
                result.append([nums[i], nums[left], nums[right]])
                
                # Skip duplicates for left pointer
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                # Skip duplicates for right pointer
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                
                left += 1
                right -= 1
            elif current_sum < target:
                left += 1
            else:
                right -= 1
    
    return result

# Explanation:
# 1. Sort array to enable two-pointer technique: O(n log n)
# 2. Fix first element with loop (i from 0 to n-3)
# 3. For each fixed element, use two pointers to find pairs
# 4. Target for two pointers: -nums[i] (so total sums to 0)
# 5. Skip duplicates at all three positions to avoid duplicate triplets
# 6. Time: O(n²) for two-pointer loops, dominated by sorting
```

**JavaScript:**
```javascript
function threeSum(nums) {
    nums.sort()
    result = []
    n = len(nums)
    
    for i in range(n - 2):
        # Skip duplicates for first element
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        # Two pointers for remaining elements
        left = i + 1
        right = n - 1
        target = -nums[i]
        
        while left < right:
            current_sum = nums[left] + nums[right]
            
            if current_sum == target:
                result.append([nums[i], nums[left], nums[right]])
                
                # Skip duplicates for left pointer
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                # Skip duplicates for right pointer
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                
                left += 1
                right -= 1
            elif current_sum < target:
                left += 1
            else:
                right -= 1
    
    return result

# Explanation:
# 1. Sort array to enable two-pointer technique: O(n log n)
# 2. Fix first element with loop (i from 0 to n-3)
# 3. For each fixed element, use two pointers to find pairs
# 4. Target for two pointers: -nums[i] (so total sums to 0)
# 5. Skip duplicates at all three positions to avoid duplicate triplets
# 6. Time: O(n²) for two-pointer loops, dominated by sorting
```

### Complexity Analysis

- **Time Complexity:** O(n²) - O(n log n) sorting + O(n) outer loop × O(n) two-pointer
- **Space Complexity:** O(1) or O(n) - depends on sorting implementation, excluding output array

### Test Cases

**Test 1:** Standard case with duplicates
- Input: "threeSum([-1,0,1,2,-1,-4])"
- Expected: "[[-1,-1,2],[-1,0,1]]"

**Test 2:** No valid triplet
- Input: "threeSum([0,1,1])"
- Expected: "[]"

**Test 3:** All zeros
- Input: "threeSum([0,0,0])"
- Expected: "[[0,0,0]]"

**Test 4:** Multiple solutions with duplicates
- Input: "threeSum([-2,0,1,1,2])"
- Expected: "[[-2,0,2],[-2,1,1]]"

**Test 5:** Empty array
- Input: "threeSum([])"
- Expected: "[]"

**Test 6:** All positive numbers
- Input: "threeSum([1,2,3])"
- Expected: "[]"

**Test 7:** PERFORMANCE: Large array (10K elements) - Must use O(n²) two-pointer approach
- Input: "threeSum(list(range(-5000, 5000)))"
- Expected: "[[-5000,0,5000]]"

---

## 3. 3Sum Closest

**Difficulty:** medium
**Concept:** two-pointers
**Family:** two-pointers:n-sum

### Description

Given an integer array nums of length n and an integer target, find three integers in nums such that the sum is closest to target. Return the sum of the three integers. You may assume that each input would have exactly one solution.

### Key Insight

Similar to 3Sum, sort the array and fix one element. Use two pointers to find the pair that makes the sum closest to target. Track the closest sum seen so far by comparing absolute differences. Update pointers based on whether current sum is less than or greater than target.

### Examples

**Example 1:**
- Input: nums = [-1,2,1,-4], target = 1
- Output: 2
- Explanation: The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).

**Example 2:**
- Input: nums = [0,0,0], target = 1
- Output: 0
- Explanation: The sum that is closest to the target is 0.

**Example 3:**
- Input: nums = [1,1,1,0], target = -100
- Output: 2
- Explanation: The closest sum is 0 + 1 + 1 = 2

### Hints

1. Sort the array first to enable the two-pointer technique
2. Initialize closest_sum with the sum of first three elements (or infinity)
3. For each fixed element i, use two pointers (left = i+1, right = n-1) to find the best pair
4. Calculate current_sum = nums[i] + nums[left] + nums[right]
5. Update closest_sum if abs(current_sum - target) < abs(closest_sum - target)
6. Move pointers: if current_sum < target, move left right (need larger sum). Otherwise move right left
7. Early exit: if current_sum == target, you found the exact match - return immediately

### Starter Code

**Python:**
```python
def threeSumClosest(nums, target):
    """
    Find three integers whose sum is closest to target.
    
    Args:
        nums: List[int] - array of integers
        target: int - target sum
    
    Returns:
        int - sum of three integers closest to target
    """
    # TODO: Sort the array
    
    # TODO: Initialize closest_sum (can use first three elements)
    
    # TODO: Fix first element with loop
    
    # TODO: Use two pointers to find closest pair
    # Track minimum difference between current sum and target
    
    pass
```

**JavaScript:**
```javascript
function threeSumClosest(nums, target) {
    """
    Find three integers whose sum is closest to target.
    
    Args:
        nums: Array - array of integers
        target: int - target sum
    
    Returns:
        int - sum of three integers closest to target
    """
    // TODO: Sort the array
    
    // TODO: Initialize closest_sum (can use first three elements)
    
    // TODO: Fix first element with loop
    
    // TODO: Use two pointers to find closest pair
    # Track minimum difference between current sum and target
  // TODO: implement
```

### Solution

**Python:**
```python
def threeSumClosest(nums, target):
    nums.sort()
    n = len(nums)
    closest_sum = float('inf')
    
    for i in range(n - 2):
        left = i + 1
        right = n - 1
        
        while left < right:
            current_sum = nums[i] + nums[left] + nums[right]
            
            # Update closest if this sum is closer to target
            if abs(current_sum - target) < abs(closest_sum - target):
                closest_sum = current_sum
            
            # Early exit if exact match
            if current_sum == target:
                return target
            
            # Move pointers based on sum comparison
            if current_sum < target:
                left += 1
            else:
                right -= 1
    
    return closest_sum

# Explanation:
# 1. Sort array: O(n log n)
# 2. Fix first element, use two pointers for others
# 3. Track closest_sum by comparing absolute differences
# 4. If current_sum < target: need larger sum, move left++
# 5. If current_sum > target: need smaller sum, move right--
# 6. Early exit on exact match (current_sum == target)
# 7. Time: O(n²) for nested loops
```

**JavaScript:**
```javascript
function threeSumClosest(nums, target) {
    nums.sort()
    n = len(nums)
    closest_sum = float('inf')
    
    for i in range(n - 2):
        left = i + 1
        right = n - 1
        
        while left < right:
            current_sum = nums[i] + nums[left] + nums[right]
            
            # Update closest if this sum is closer to target
            if abs(current_sum - target) < abs(closest_sum - target):
                closest_sum = current_sum
            
            # Early exit if exact match
            if current_sum == target:
                return target
            
            # Move pointers based on sum comparison
            if current_sum < target:
                left += 1
            else:
                right -= 1
    
    return closest_sum

# Explanation:
# 1. Sort array: O(n log n)
# 2. Fix first element, use two pointers for others
# 3. Track closest_sum by comparing absolute differences
# 4. If current_sum < target: need larger sum, move left++
# 5. If current_sum > target: need smaller sum, move right--
# 6. Early exit on exact match (current_sum == target)
# 7. Time: O(n²) for nested loops
```

### Complexity Analysis

- **Time Complexity:** O(n²) - O(n log n) sorting + O(n) outer loop × O(n) two-pointer
- **Space Complexity:** O(1) or O(n) - depends on sorting implementation

### Test Cases

**Test 1:** Standard case
- Input: "threeSumClosest([-1,2,1,-4], 1)"
- Expected: "2"

**Test 2:** All zeros
- Input: "threeSumClosest([0,0,0], 1)"
- Expected: "0"

**Test 3:** Target far from possible sums
- Input: "threeSumClosest([1,1,1,0], -100)"
- Expected: "2"

**Test 4:** Exact sum not possible
- Input: "threeSumClosest([1,2,3,4,5], 10)"
- Expected: "9"

**Test 5:** Exact match exists
- Input: "threeSumClosest([0,1,2], 3)"
- Expected: "3"

**Test 6:** PERFORMANCE: Large array (10K elements) - Must use O(n²) two-pointer approach
- Input: "threeSumClosest(list(range(-5000, 5000)), 10000)"
- Expected: "14997"

---

## 4. 3Sum Smaller

**Difficulty:** medium
**Concept:** two-pointers
**Family:** two-pointers:n-sum

### Description

Given an array of n integers nums and an integer target, find the number of index triplets i, j, k with 0 <= i < j < k < n that satisfy the condition nums[i] + nums[j] + nums[k] < target.

### Key Insight

Sort the array and fix the first element. Use two pointers for the remaining elements. When nums[i] + nums[left] + nums[right] < target, ALL elements between left and right-1 form valid triplets with i and left (because array is sorted). Add (right - left) to count and move left pointer right.

### Examples

**Example 1:**
- Input: nums = [-2,0,1,3], target = 2
- Output: 2
- Explanation: Two triplets sum to less than 2: [-2,0,1] and [-2,0,3]

**Example 2:**
- Input: nums = [], target = 0
- Output: 0
- Explanation: No triplets in empty array

**Example 3:**
- Input: nums = [0], target = 0
- Output: 0
- Explanation: Not enough elements for a triplet

### Hints

1. Sort the array to enable two-pointer technique and make counting easier
2. Fix the first element with index i, use two pointers (left = i+1, right = n-1)
3. Calculate sum = nums[i] + nums[left] + nums[right]
4. Key insight: if sum < target, then ALL elements from left+1 to right also work with nums[i] and nums[left]
5. When sum < target: add (right - left) to count, then move left pointer right
6. When sum >= target: move right pointer left to get smaller sum
7. This counting technique works because the array is sorted

### Starter Code

**Python:**
```python
def threeSumSmaller(nums, target):
    """
    Count triplets with sum less than target.
    
    Args:
        nums: List[int] - array of integers
        target: int - target sum
    
    Returns:
        int - count of valid triplets
    """
    # TODO: Sort the array
    
    # TODO: Initialize count = 0
    
    # TODO: Fix first element with loop
    
    # TODO: Use two pointers for remaining elements
    # When sum < target, ALL pairs (left, left+1...right) work
    # Add (right - left) to count
    
    pass
```

**JavaScript:**
```javascript
function threeSumSmaller(nums, target) {
    """
    Count triplets with sum less than target.
    
    Args:
        nums: Array - array of integers
        target: int - target sum
    
    Returns:
        int - count of valid triplets
    """
    // TODO: Sort the array
    
    // TODO: Initialize count = 0
    
    // TODO: Fix first element with loop
    
    // TODO: Use two pointers for remaining elements
    # When sum < target, ALL pairs (left, left+1...right) work
    # Add (right - left) to count
  // TODO: implement
```

### Solution

**Python:**
```python
def threeSumSmaller(nums, target):
    if len(nums) < 3:
        return 0
    
    nums.sort()
    count = 0
    n = len(nums)
    
    for i in range(n - 2):
        left = i + 1
        right = n - 1
        
        while left < right:
            current_sum = nums[i] + nums[left] + nums[right]
            
            if current_sum < target:
                # All elements from left+1 to right work with i and left
                count += (right - left)
                left += 1
            else:
                # Sum too large, move right pointer left
                right -= 1
    
    return count

# Explanation:
# 1. Sort array: O(n log n)
# 2. Fix first element i, use two pointers for rest
# 3. When nums[i] + nums[left] + nums[right] < target:
#    - Since sorted, nums[left] + nums[left+1] < target
#    - And nums[left] + nums[left+2] < target ... up to nums[right]
#    - So add (right - left) valid triplets to count
# 4. Move left++ to explore more combinations
# 5. When sum >= target: move right-- to reduce sum
# 6. Time: O(n²) for nested loops
```

**JavaScript:**
```javascript
function threeSumSmaller(nums, target) {
    if len(nums) < 3:
        return 0
    
    nums.sort()
    count = 0
    n = len(nums)
    
    for i in range(n - 2):
        left = i + 1
        right = n - 1
        
        while left < right:
            current_sum = nums[i] + nums[left] + nums[right]
            
            if current_sum < target:
                # All elements from left+1 to right work with i and left
                count += (right - left)
                left += 1
            else:
                # Sum too large, move right pointer left
                right -= 1
    
    return count

# Explanation:
# 1. Sort array: O(n log n)
# 2. Fix first element i, use two pointers for rest
# 3. When nums[i] + nums[left] + nums[right] < target:
#    - Since sorted, nums[left] + nums[left+1] < target
#    - And nums[left] + nums[left+2] < target ... up to nums[right]
#    - So add (right - left) valid triplets to count
# 4. Move left++ to explore more combinations
# 5. When sum >= target: move right-- to reduce sum
# 6. Time: O(n²) for nested loops
```

### Complexity Analysis

- **Time Complexity:** O(n²) - O(n log n) sorting + O(n) outer loop × O(n) two-pointer
- **Space Complexity:** O(1) or O(n) - depends on sorting implementation

### Test Cases

**Test 1:** Standard case
- Input: "threeSumSmaller([-2,0,1,3], 2)"
- Expected: "2"

**Test 2:** Empty array
- Input: "threeSumSmaller([], 0)"
- Expected: "0"

**Test 3:** Single element
- Input: "threeSumSmaller([0], 0)"
- Expected: "0"

**Test 4:** Unsorted input
- Input: "threeSumSmaller([3,1,0,-2], 4)"
- Expected: "3"

**Test 5:** All same elements
- Input: "threeSumSmaller([1,1,1,1], 4)"
- Expected: "4"

**Test 6:** Negative target
- Input: "threeSumSmaller([-1,1,-1,-1], -1)"
- Expected: "1"

**Test 7:** PERFORMANCE: Large array (6K elements) - Must use O(n²) two-pointer approach
- Input: "threeSumSmaller(list(range(-3000, 3000)), 5000)"
- Expected: "3587999000"

---

## 5. 4Sum

**Difficulty:** medium
**Concept:** two-pointers
**Family:** two-pointers:n-sum

### Description

Given an array nums of n integers, return an array of all the unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that: 0 <= a, b, c, d < n, a, b, c, and d are distinct, and nums[a] + nums[b] + nums[c] + nums[d] == target. You may return the answer in any order.

### Key Insight

Extend 3Sum approach: sort array, then use two nested loops to fix first two elements. Use two pointers for the remaining two elements. Skip duplicates at all four positions to avoid duplicate quadruplets. This reduces 4Sum to multiple 2Sum problems on sorted subarrays.

### Examples

**Example 1:**
- Input: nums = [1,0,-1,0,-2,2], target = 0
- Output: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
- Explanation: The quadruplets that sum to 0 are listed above

**Example 2:**
- Input: nums = [2,2,2,2,2], target = 8
- Output: [[2,2,2,2]]
- Explanation: The only quadruplet is [2,2,2,2]

**Example 3:**
- Input: nums = [1,2,3,4], target = 10
- Output: [[1,2,3,4]]
- Explanation: Only one valid quadruplet

### Hints

1. Sort the array first to enable two-pointer technique and duplicate skipping
2. Use two nested loops to fix first two elements: i from 0 to n-4, j from i+1 to n-3
3. For fixed i and j, use two pointers (left = j+1, right = n-1) to find the remaining pair
4. Target for two pointers: target - nums[i] - nums[j]
5. Skip duplicates at all four levels: after finding a quadruplet, skip while nums[left] == nums[left+1] and nums[right] == nums[right-1]
6. Also skip duplicates for i and j: if i > 0 and nums[i] == nums[i-1]: continue
7. Optimization: if nums[i] + nums[i+1] + nums[i+2] + nums[i+3] > target, break (remaining elements too large)

### Starter Code

**Python:**
```python
def fourSum(nums, target):
    """
    Find all unique quadruplets that sum to target.
    
    Args:
        nums: List[int] - array of integers
        target: int - target sum
    
    Returns:
        List[List[int]] - list of unique quadruplets
    """
    # TODO: Sort the array
    
    # TODO: Use outer loop to fix first element (i from 0 to n-4)
    # Skip duplicates for first element
    
    # TODO: Use inner loop to fix second element (j from i+1 to n-3)
    # Skip duplicates for second element
    
    # TODO: Use two pointers for last two elements
    # left = j+1, right = n-1
    # Skip duplicates for third and fourth elements
    
    pass
```

**JavaScript:**
```javascript
function fourSum(nums, target) {
    """
    Find all unique quadruplets that sum to target.
    
    Args:
        nums: Array - array of integers
        target: int - target sum
    
    Returns:
        Array] - list of unique quadruplets
    """
    // TODO: Sort the array
    
    // TODO: Use outer loop to fix first element (i from 0 to n-4)
    # Skip duplicates for first element
    
    // TODO: Use inner loop to fix second element (j from i+1 to n-3)
    # Skip duplicates for second element
    
    // TODO: Use two pointers for last two elements
    # left = j+1, right = n-1
    # Skip duplicates for third and fourth elements
  // TODO: implement
```

### Solution

**Python:**
```python
def fourSum(nums, target):
    nums.sort()
    result = []
    n = len(nums)
    
    for i in range(n - 3):
        # Skip duplicates for first element
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        for j in range(i + 1, n - 2):
            # Skip duplicates for second element
            if j > i + 1 and nums[j] == nums[j - 1]:
                continue
            
            # Two pointers for last two elements
            left = j + 1
            right = n - 1
            
            while left < right:
                current_sum = nums[i] + nums[j] + nums[left] + nums[right]
                
                if current_sum == target:
                    result.append([nums[i], nums[j], nums[left], nums[right]])
                    
                    # Skip duplicates for third element
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    # Skip duplicates for fourth element
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    
                    left += 1
                    right -= 1
                elif current_sum < target:
                    left += 1
                else:
                    right -= 1
    
    return result

# Explanation:
# 1. Sort array: O(n log n)
# 2. Fix first element with outer loop (i)
# 3. Fix second element with inner loop (j)
# 4. Use two pointers (left, right) for remaining two
# 5. Skip duplicates at all four positions
# 6. Time: O(n³) - two nested loops × O(n) two-pointer
# 7. This is the best possible time for general 4Sum
```

**JavaScript:**
```javascript
function fourSum(nums, target) {
    nums.sort()
    result = []
    n = len(nums)
    
    for i in range(n - 3):
        # Skip duplicates for first element
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        for j in range(i + 1, n - 2):
            # Skip duplicates for second element
            if j > i + 1 and nums[j] == nums[j - 1]:
                continue
            
            # Two pointers for last two elements
            left = j + 1
            right = n - 1
            
            while left < right:
                current_sum = nums[i] + nums[j] + nums[left] + nums[right]
                
                if current_sum == target:
                    result.append([nums[i], nums[j], nums[left], nums[right]])
                    
                    # Skip duplicates for third element
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    # Skip duplicates for fourth element
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    
                    left += 1
                    right -= 1
                elif current_sum < target:
                    left += 1
                else:
                    right -= 1
    
    return result

# Explanation:
# 1. Sort array: O(n log n)
# 2. Fix first element with outer loop (i)
# 3. Fix second element with inner loop (j)
# 4. Use two pointers (left, right) for remaining two
# 5. Skip duplicates at all four positions
# 6. Time: O(n³) - two nested loops × O(n) two-pointer
# 7. This is the best possible time for general 4Sum
```

### Complexity Analysis

- **Time Complexity:** O(n³) - O(n log n) sorting + O(n²) nested loops × O(n) two-pointer
- **Space Complexity:** O(1) or O(n) - depends on sorting implementation, excluding output

### Test Cases

**Test 1:** Standard case with multiple solutions
- Input: "fourSum([1,0,-1,0,-2,2], 0)"
- Expected: "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]"

**Test 2:** All same elements
- Input: "fourSum([2,2,2,2,2], 8)"
- Expected: "[[2,2,2,2]]"

**Test 3:** Single quadruplet
- Input: "fourSum([1,2,3,4], 10)"
- Expected: "[[1,2,3,4]]"

**Test 4:** Empty array
- Input: "fourSum([], 0)"
- Expected: "[]"

**Test 5:** All zeros
- Input: "fourSum([0,0,0,0], 0)"
- Expected: "[[0,0,0,0]]"

**Test 6:** Mixed positive and negative
- Input: "fourSum([-3,-1,0,2,4,5], 2)"
- Expected: "[[-3,-1,2,4],[-3,0,2,3]]"

**Test 7:** PERFORMANCE: Large array (101 elements, many solutions) - Must use O(n³) two-pointer approach
- Input: "fourSum(list(range(-50, 51)), 0)"
- Expected: "2550"

---

## 6. Container With Most Water

**Difficulty:** medium
**Concept:** two-pointers
**Family:** two-pointers:container-water

### Description

You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container that holds the most water. Return the maximum amount of water a container can store.

### Key Insight

Start with two pointers at both ends (maximum width). The area is limited by the shorter line. To potentially find a larger area, move the pointer at the shorter line inward - moving the taller one can only decrease area since width decreases. This greedy approach explores all potential maximum areas.

### Examples

**Example 1:**
- Input: height = [1,8,6,2,5,4,8,3,7]
- Output: 49
- Explanation: Lines at index 1 (height 8) and 8 (height 7) form container with area = min(8,7) * (8-1) = 7 * 7 = 49

**Example 2:**
- Input: height = [1,1]
- Output: 1
- Explanation: Container has area = min(1,1) * (1-0) = 1 * 1 = 1

**Example 3:**
- Input: height = [4,3,2,1,4]
- Output: 16
- Explanation: Lines at index 0 and 4 (both height 4) form area = min(4,4) * (4-0) = 4 * 4 = 16

### Hints

1. Area formula: min(height[left], height[right]) * (right - left)
2. Start with widest possible container: left = 0, right = n - 1
3. The area is limited by the shorter of the two lines
4. To find potentially larger area, move the pointer at the shorter line inward
5. Why? Moving the taller line inward can only decrease area (width decreases, height can't increase)
6. Moving the shorter line inward might find a taller line, which could increase area despite reduced width
7. Continue until pointers meet, tracking maximum area seen

### Starter Code

**Python:**
```python
def maxArea(height):
    """
    Find maximum water container area.
    
    Args:
        height: List[int] - heights of vertical lines
    
    Returns:
        int - maximum area
    """
    # TODO: Initialize two pointers at both ends
    
    # TODO: Track max_area = 0
    
    # TODO: While left < right:
    # - Calculate area = min(height[left], height[right]) * (right - left)
    # - Update max_area
    # - Move pointer with shorter height inward
    
    pass
```

**JavaScript:**
```javascript
function maxArea(height) {
    """
    Find maximum water container area.
    
    Args:
        height: Array - heights of vertical lines
    
    Returns:
        int - maximum area
    """
    // TODO: Initialize two pointers at both ends
    
    // TODO: Track max_area = 0
    
    // TODO: While left < right:
    # - Calculate area = min(height[left], height[right]) * (right - left)
    # - Update max_area
    # - Move pointer with shorter height inward
  // TODO: implement
```

### Solution

**Python:**
```python
def maxArea(height):
    left = 0
    right = len(height) - 1
    max_area = 0
    
    while left < right:
        # Calculate current area
        width = right - left
        current_height = min(height[left], height[right])
        current_area = width * current_height
        
        # Update maximum
        max_area = max(max_area, current_area)
        
        # Move pointer with shorter height
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_area

# Explanation:
# 1. Start with maximum width (left=0, right=n-1)
# 2. Area = min(height[left], height[right]) * width
# 3. The shorter line limits the water level
# 4. Move the shorter line's pointer inward:
#    - Moving taller one can only decrease area (width↓, height can't↑)
#    - Moving shorter one might find taller line (could↑ area)
# 5. This greedy approach explores all potential maxima
# 6. Time: O(n) single pass, Space: O(1)
```

**JavaScript:**
```javascript
function maxArea(height) {
    left = 0
    right = len(height) - 1
    max_area = 0
    
    while left < right:
        # Calculate current area
        width = right - left
        current_height = min(height[left], height[right])
        current_area = width * current_height
        
        # Update maximum
        max_area = max(max_area, current_area)
        
        # Move pointer with shorter height
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_area

# Explanation:
# 1. Start with maximum width (left=0, right=n-1)
# 2. Area = min(height[left], height[right]) * width
# 3. The shorter line limits the water level
# 4. Move the shorter line's pointer inward:
#    - Moving taller one can only decrease area (width↓, height can't↑)
#    - Moving shorter one might find taller line (could↑ area)
# 5. This greedy approach explores all potential maxima
# 6. Time: O(n) single pass, Space: O(1)
```

### Complexity Analysis

- **Time Complexity:** O(n) - single pass with two pointers
- **Space Complexity:** O(1) - only a few variables used

### Test Cases

**Test 1:** Standard case from example
- Input: "maxArea([1,8,6,2,5,4,8,3,7])"
- Expected: "49"

**Test 2:** Minimum length array
- Input: "maxArea([1,1])"
- Expected: "1"

**Test 3:** Equal heights at ends
- Input: "maxArea([4,3,2,1,4])"
- Expected: "16"

**Test 4:** Peak in middle
- Input: "maxArea([1,2,1])"
- Expected: "2"

**Test 5:** Tall line near end
- Input: "maxArea([2,3,4,5,18,17,6])"
- Expected: "17"

**Test 6:** Increasing heights
- Input: "maxArea([1,2,3,4,5,6,7,8,9])"
- Expected: "20"

**Test 7:** PERFORMANCE: Large array (100K elements) - Must use O(n) two-pointer approach
- Input: "maxArea([i % 1000 + 1 for i in range(100000)])"
- Expected: "25000000"

---

## 7. Trapping Rain Water

**Difficulty:** hard
**Concept:** two-pointers
**Family:** two-pointers:container-water

### Description

Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

### Key Insight

Use two pointers from both ends, tracking left_max and right_max heights. At each step, if left_max < right_max, water at left position = left_max - height[left] (guaranteed safe by right_max). Move left++. Otherwise, calculate water at right position using right_max. This works because water level is determined by min(left_max, right_max).

### Examples

**Example 1:**
- Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
- Output: 6
- Explanation: Water trapped: at indices [2]=1, [4]=1, [5]=2, [6]=1, [9]=1, total = 6 units

**Example 2:**
- Input: height = [4,2,0,3,2,5]
- Output: 9
- Explanation: Water trapped: at index [1]=2, [2]=4, [3]=1, [4]=3, total = 9 units

**Example 3:**
- Input: height = [4,2,3]
- Output: 1
- Explanation: Water trapped: at index [1]=1, total = 1 unit

### Hints

1. Water at position i = min(left_max, right_max) - height[i] (if positive)
2. Use two pointers from both ends, tracking maximum heights seen so far
3. Key insight: if left_max < right_max, water at left is determined by left_max (right_max is guaranteed higher)
4. When left_max < right_max: water[left] = left_max - height[left], then left++
5. When right_max <= left_max: water[right] = right_max - height[right], then right--
6. Update left_max when height[left] > left_max, similarly for right_max
7. This approach avoids needing to precompute max arrays, solving in O(n) time and O(1) space

### Starter Code

**Python:**
```python
def trap(height):
    """
    Calculate trapped rainwater.
    
    Args:
        height: List[int] - elevation map
    
    Returns:
        int - total water trapped
    """
    # TODO: Initialize left=0, right=len-1
    
    # TODO: Track left_max=0, right_max=0
    
    # TODO: Initialize water=0
    
    # TODO: While left < right:
    # - If left_max < right_max:
    #   - Update left_max, calculate water at left, move left++
    # - Else:
    #   - Update right_max, calculate water at right, move right--
    
    pass
```

**JavaScript:**
```javascript
function trap(height) {
    """
    Calculate trapped rainwater.
    
    Args:
        height: Array - elevation map
    
    Returns:
        int - total water trapped
    """
    // TODO: Initialize left=0, right=len-1
    
    // TODO: Track left_max=0, right_max=0
    
    // TODO: Initialize water=0
    
    // TODO: While left < right:
    # - If left_max < right_max:
    #   - Update left_max, calculate water at left, move left++
    # - Else:
    #   - Update right_max, calculate water at right, move right--
  // TODO: implement
```

### Solution

**Python:**
```python
def trap(height):
    if not height:
        return 0
    
    left = 0
    right = len(height) - 1
    left_max = 0
    right_max = 0
    water = 0
    
    while left < right:
        if height[left] < height[right]:
            # Process left side
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            # Process right side
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    
    return water

# Explanation:
# 1. Use two pointers from both ends
# 2. Track left_max and right_max (max heights seen)
# 3. Water at position = min(left_max, right_max) - height
# 4. If left_max < right_max:
#    - Water at left determined by left_max (right_max is higher)
#    - Add (left_max - height[left]) if positive
#    - Move left++
# 5. Else: same logic for right side
# 6. This avoids precomputing max arrays
# 7. Time: O(n) single pass, Space: O(1)
```

**JavaScript:**
```javascript
function trap(height) {
    if not height:
        return 0
    
    left = 0
    right = len(height) - 1
    left_max = 0
    right_max = 0
    water = 0
    
    while left < right:
        if height[left] < height[right]:
            # Process left side
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            # Process right side
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    
    return water

# Explanation:
# 1. Use two pointers from both ends
# 2. Track left_max and right_max (max heights seen)
# 3. Water at position = min(left_max, right_max) - height
# 4. If left_max < right_max:
#    - Water at left determined by left_max (right_max is higher)
#    - Add (left_max - height[left]) if positive
#    - Move left++
# 5. Else: same logic for right side
# 6. This avoids precomputing max arrays
# 7. Time: O(n) single pass, Space: O(1)
```

### Complexity Analysis

- **Time Complexity:** O(n) - single pass through array with two pointers
- **Space Complexity:** O(1) - only a few variables used

### Test Cases

**Test 1:** Standard example with multiple valleys
- Input: "trap([0,1,0,2,1,0,1,3,2,1,2,1])"
- Expected: "6"

**Test 2:** Deep valley
- Input: "trap([4,2,0,3,2,5])"
- Expected: "9"

**Test 3:** Small valley
- Input: "trap([4,2,3])"
- Expected: "1"

**Test 4:** Multiple gaps
- Input: "trap([3,0,2,0,4])"
- Expected: "7"

**Test 5:** Decreasing heights - no water
- Input: "trap([5,4,3,2,1])"
- Expected: "0"

**Test 6:** Increasing heights - no water
- Input: "trap([1,2,3,4,5])"
- Expected: "0"

**Test 7:** PERFORMANCE: Large array (50K elements) - Must use O(n) two-pointer approach
- Input: "trap([i % 100 for i in range(50000)])"
- Expected: "61237500"

---

## 8. K-diff Pairs in an Array

**Difficulty:** medium
**Concept:** two-pointers
**Family:** two-pointers:pairs

### Description

Given an array of integers nums and an integer k, return the number of unique k-diff pairs in the array. A k-diff pair is an integer pair (nums[i], nums[j]), where the following are true: 0 <= i, j < n, i != j, and |nums[i] - nums[j]| == k. Notice that |val| denotes the absolute value of val.

### Key Insight

Two approaches: (1) HashMap: count frequencies, for each unique number x, check if x+k exists (or x appears twice if k=0). (2) Two Pointers: sort array, use two pointers, if diff < k move right++, if diff > k move left++, if diff == k count pair and skip duplicates. Both are O(n log n) or O(n) depending on approach.

### Examples

**Example 1:**
- Input: nums = [3,1,4,1,5], k = 2
- Output: 2
- Explanation: The k-diff pairs are [1,3] and [3,5]

**Example 2:**
- Input: nums = [1,2,3,4,5], k = 1
- Output: 4
- Explanation: The k-diff pairs are [1,2], [2,3], [3,4], [4,5]

**Example 3:**
- Input: nums = [1,3,1,5,4], k = 0
- Output: 1
- Explanation: Only pair with difference 0 is [1,1]

### Hints

1. Handle k=0 as special case: need numbers appearing at least twice
2. Two Pointers approach: sort array, use left and right pointers
3. Calculate diff = nums[right] - nums[left]
4. If diff == k: found a pair, skip duplicates for both pointers
5. If diff < k: move right pointer (need larger difference)
6. If diff > k: move left pointer (need smaller difference)
7. HashMap approach: for each unique x, check if x+k exists (or x appears twice when k=0)
8. Skip duplicate pairs by moving pointers past duplicate values

### Starter Code

**Python:**
```python
def findPairs(nums, k):
    """
    Find number of unique k-diff pairs.
    
    Args:
        nums: List[int] - array of integers
        k: int - target difference
    
    Returns:
        int - count of unique k-diff pairs
    """
    # Approach 1: Two Pointers (after sorting)
    # TODO: Sort the array
    
    # TODO: Use two pointers: left=0, right=1
    
    # TODO: While right < len(nums):
    # - If nums[right] - nums[left] == k: count++, skip duplicates
    # - If diff < k: right++
    # - If diff > k: left++ (but ensure left != right)
    
    # Approach 2: HashMap
    # TODO: Count frequencies of all numbers
    
    # TODO: For each unique number x:
    # - If k > 0: check if x+k exists
    # - If k == 0: check if frequency > 1
    
    pass
```

**JavaScript:**
```javascript
function findPairs(nums, k) {
    """
    Find number of unique k-diff pairs.
    
    Args:
        nums: Array - array of integers
        k: int - target difference
    
    Returns:
        int - count of unique k-diff pairs
    """
    # Approach 1: Two Pointers (after sorting)
    // TODO: Sort the array
    
    // TODO: Use two pointers: left=0, right=1
    
    // TODO: While right < len(nums):
    # - If nums[right] - nums[left] == k: count++, skip duplicates
    # - If diff < k: right++
    # - If diff > k: left++ (but ensure left != right)
    
    # Approach 2: HashMap
    // TODO: Count frequencies of all numbers
    
    // TODO: For each unique number x:
    # - If k > 0: check if x+k exists
    # - If k == 0: check if frequency > 1
  // TODO: implement
```

### Solution

**Python:**
```python
def findPairs(nums, k):
    # Edge cases
    if k < 0:
        return 0
    
    # Two pointers approach
    nums.sort()
    left = 0
    right = 1
    count = 0
    
    while right < len(nums):
        diff = nums[right] - nums[left]
        
        if diff == k:
            count += 1
            left += 1
            right += 1
            
            # Skip duplicates for left
            while left < len(nums) and nums[left] == nums[left - 1]:
                left += 1
            # Skip duplicates for right
            while right < len(nums) and nums[right] == nums[right - 1]:
                right += 1
            
            # Ensure left < right
            if left == right:
                right += 1
        elif diff < k:
            right += 1
        else:
            left += 1
            if left == right:
                right += 1
    
    return count

# Alternative HashMap approach:
def findPairs_hashmap(nums, k):
    if k < 0:
        return 0
    
    from collections import Counter
    count_map = Counter(nums)
    pairs = 0
    
    for num in count_map:
        if k == 0:
            # Need at least 2 occurrences
            if count_map[num] > 1:
                pairs += 1
        else:
            # Check if num + k exists
            if num + k in count_map:
                pairs += 1
    
    return pairs

# Explanation:
# Two Pointers: O(n log n) sorting + O(n) scan
# HashMap: O(n) for counting + O(n) for checking = O(n) total
# Both handle duplicates correctly by skipping or using unique keys
```

**JavaScript:**
```javascript
function findPairs(nums, k) {
    # Edge cases
    if k < 0:
        return 0
    
    # Two pointers approach
    nums.sort()
    left = 0
    right = 1
    count = 0
    
    while right < len(nums):
        diff = nums[right] - nums[left]
        
        if diff == k:
            count += 1
            left += 1
            right += 1
            
            # Skip duplicates for left
            while left < len(nums) and nums[left] == nums[left - 1]:
                left += 1
            # Skip duplicates for right
            while right < len(nums) and nums[right] == nums[right - 1]:
                right += 1
            
            # Ensure left < right
            if left == right:
                right += 1
        elif diff < k:
            right += 1
        else:
            left += 1
            if left == right:
                right += 1
    
    return count

# Alternative HashMap approach:
function findPairs_hashmap(nums, k) {
    if k < 0:
        return 0
    
    from collections import Counter
    count_map = Counter(nums)
    pairs = 0
    
    for num in count_map:
        if k == 0:
            # Need at least 2 occurrences
            if count_map[num] > 1:
                pairs += 1
        else:
            # Check if num + k exists
            if num + k in count_map:
                pairs += 1
    
    return pairs

# Explanation:
# Two Pointers: O(n log n) sorting + O(n) scan
# HashMap: O(n) for counting + O(n) for checking = O(n) total
# Both handle duplicates correctly by skipping or using unique keys
```

### Complexity Analysis

- **Time Complexity:** O(n log n) for two-pointer (sorting), O(n) for HashMap approach
- **Space Complexity:** O(1) for two-pointer (excluding sort), O(n) for HashMap

### Test Cases

**Test 1:** Standard case with duplicates
- Input: "findPairs([3,1,4,1,5], 2)"
- Expected: "2"

**Test 2:** Consecutive differences
- Input: "findPairs([1,2,3,4,5], 1)"
- Expected: "4"

**Test 3:** k=0, find duplicates
- Input: "findPairs([1,3,1,5,4], 0)"
- Expected: "1"

**Test 4:** Multiple duplicates
- Input: "findPairs([1,2,4,4,3,3,0,9,2,3], 3)"
- Expected: "2"

**Test 5:** All same, k=0
- Input: "findPairs([1,1,1,1,1], 0)"
- Expected: "1"

**Test 6:** Empty array
- Input: "findPairs([], 1)"
- Expected: "0"

**Test 7:** PERFORMANCE: Large array (20K elements) - Must use O(n log n) or O(n) approach
- Input: "findPairs(list(range(20000)), 5)"
- Expected: "19995"

---

## 9. Merge Sorted Array

**Difficulty:** easy
**Concept:** two-pointers
**Family:** two-pointers:merge-sorted

### Description

You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums2 into nums1 as one sorted array. The final sorted array should be stored inside nums1.

### Key Insight

Start merging from the END of both arrays, working backwards. This avoids overwriting elements in nums1 that haven't been processed yet. Place larger elements at the end of nums1 first.

### Examples

**Example 1:**
- Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
- Output: [1,2,2,3,5,6]
- Explanation: Merge [1,2,3] and [2,5,6] into nums1

**Example 2:**
- Input: nums1 = [1], m = 1, nums2 = [], n = 0
- Output: [1]
- Explanation: nums2 is empty, nums1 stays the same

**Example 3:**
- Input: nums1 = [0], m = 0, nums2 = [1], n = 1
- Output: [1]
- Explanation: nums1 is empty, just copy nums2

### Hints

1. Why merge from the end? Because nums1 has empty space at the end
2. Keep three pointers: end of nums1 (m-1), end of nums2 (n-1), and write position (m+n-1)
3. Compare nums1[p1] with nums2[p2], put the larger one at write position
4. Move the pointer of the array you took from, and move write pointer left
5. After main loop, if nums2 still has elements, copy them over
6. You don't need to copy remaining nums1 elements - they're already in place!

### Starter Code

**Python:**
```python
def merge(nums1, m, nums2, n):
    """
    Merge nums2 into nums1 in-place.
    
    Args:
        nums1: List[int] - first sorted array with extra space
        m: int - number of elements in nums1
        nums2: List[int] - second sorted array
        n: int - number of elements in nums2
    
    Returns:
        None - modifies nums1 in-place
    """
    # TODO: Start from the end of both arrays
    
    # TODO: Compare elements and place larger one at end of nums1
    
    # TODO: Handle remaining elements from nums2
    
    pass
```

**JavaScript:**
```javascript
function merge(nums1, m, nums2, n) {
    """
    Merge nums2 into nums1 in-place.
    
    Args:
        nums1: Array - first sorted array with extra space
        m: int - number of elements in nums1
        nums2: Array - second sorted array
        n: int - number of elements in nums2
    
    Returns:
        null - modifies nums1 in-place
    """
    // TODO: Start from the end of both arrays
    
    // TODO: Compare elements and place larger one at end of nums1
    
    // TODO: Handle remaining elements from nums2
  // TODO: implement
```

### Solution

**Python:**
```python
def merge(nums1, m, nums2, n):
    # Three pointers
    p1 = m - 1  # Last element in nums1
    p2 = n - 1  # Last element in nums2
    write = m + n - 1  # Last position in nums1
    
    # Merge from the end
    while p1 >= 0 and p2 >= 0:
        if nums1[p1] > nums2[p2]:
            nums1[write] = nums1[p1]
            p1 -= 1
        else:
            nums1[write] = nums2[p2]
            p2 -= 1
        write -= 1
    
    # Copy remaining elements from nums2 if any
    while p2 >= 0:
        nums1[write] = nums2[p2]
        p2 -= 1
        write -= 1
    
    # No need to copy nums1 - already in place!

# Explanation:
# - Working backwards prevents overwriting unprocessed elements
# - Always take the larger of two elements and place at end
# - If nums1 exhausted first, copy rest of nums2
# - If nums2 exhausted first, nums1 elements already in right place
```

**JavaScript:**
```javascript
function merge(nums1, m, nums2, n) {
    # Three pointers
    p1 = m - 1  # Last element in nums1
    p2 = n - 1  # Last element in nums2
    write = m + n - 1  # Last position in nums1
    
    # Merge from the end
    while p1 >= 0 and p2 >= 0:
        if nums1[p1] > nums2[p2]:
            nums1[write] = nums1[p1]
            p1 -= 1
        else:
            nums1[write] = nums2[p2]
            p2 -= 1
        write -= 1
    
    # Copy remaining elements from nums2 if any
    while p2 >= 0:
        nums1[write] = nums2[p2]
        p2 -= 1
        write -= 1
    
    # No need to copy nums1 - already in place!

# Explanation:
# - Working backwards prevents overwriting unprocessed elements
# - Always take the larger of two elements and place at end
# - If nums1 exhausted first, copy rest of nums2
# - If nums2 exhausted first, nums1 elements already in right place
```

### Complexity Analysis

- **Time Complexity:** O(m + n) - single pass through both arrays
- **Space Complexity:** O(1) - in-place merge with no extra space

### Test Cases

**Test 1:** Standard merge case
- Input: "merge([1,2,3,0,0,0], 3, [2,5,6], 3)"
- Expected: "[1,2,2,3,5,6]"

**Test 2:** Empty nums2
- Input: "merge([1], 1, [], 0)"
- Expected: "[1]"

**Test 3:** Empty nums1
- Input: "merge([0], 0, [1], 1)"
- Expected: "[1]"

**Test 4:** nums2 all smaller
- Input: "merge([4,5,6,0,0,0], 3, [1,2,3], 3)"
- Expected: "[1,2,3,4,5,6]"

**Test 5:** nums1 all smaller
- Input: "merge([1,2,3,0,0,0], 3, [4,5,6], 3)"
- Expected: "[1,2,3,4,5,6]"

**Test 6:** PERFORMANCE: Large arrays (50K + 25K elements) - Must use O(m+n) backward merge
- Input: "merge(list(range(0, 50000, 2)) + [0]*50000, 50000, list(range(1, 50000, 2)), 25000)"
- Expected: "list(range(0, 50000, 2)) + list(range(1, 50000, 2))"

---

## 10. Move Zeros

**Difficulty:** easy
**Concept:** two-pointers
**Family:** two-pointers:in-place-modify

### Description

Given an integer array nums, move all 0s to the end while maintaining the relative order of the non-zero elements. Note that you must do this in-place without making a copy of the array.

### Key Insight

Use two pointers: one tracks where to place next non-zero element (write position), other scans the array. When you find a non-zero, write it to the write position and increment. Fill remaining positions with zeros.

### Examples

**Example 1:**
- Input: nums = [0,1,0,3,12]
- Output: [1,3,12,0,0]
- Explanation: Move zeros to end while keeping order of 1,3,12

**Example 2:**
- Input: nums = [0]
- Output: [0]
- Explanation: Single zero stays

**Example 3:**
- Input: nums = [1,2,3]
- Output: [1,2,3]
- Explanation: No zeros to move

### Hints

1. Think of this as "compacting" all non-zero elements to the front
2. Keep a write pointer starting at 0
3. Scan through array - when you see non-zero, write it at write position
4. After writing a non-zero, increment write pointer
5. After the loop, write pointer tells you where zeros should start
6. Fill from write pointer to end with zeros

### Starter Code

**Python:**
```python
def moveZeroes(nums):
    """
    Move all zeros to the end in-place.
    
    Args:
        nums: List[int] - array of integers
    
    Returns:
        None - modifies nums in-place
    """
    # TODO: Use write pointer to track where to place next non-zero
    
    # TODO: Scan array, write non-zeros to write position
    
    # TODO: Fill remaining positions with zeros
    
    pass
```

**JavaScript:**
```javascript
function moveZeroes(nums) {
    """
    Move all zeros to the end in-place.
    
    Args:
        nums: Array - array of integers
    
    Returns:
        null - modifies nums in-place
    """
    // TODO: Use write pointer to track where to place next non-zero
    
    // TODO: Scan array, write non-zeros to write position
    
    // TODO: Fill remaining positions with zeros
  // TODO: implement
```

### Solution

**Python:**
```python
def moveZeroes(nums):
    write = 0  # Position to write next non-zero
    
    # Move all non-zeros to front
    for num in nums:
        if num != 0:
            nums[write] = num
            write += 1
    
    # Fill rest with zeros
    for i in range(write, len(nums)):
        nums[i] = 0

# Explanation:
# - First loop: copy all non-zeros to front, preserving order
# - write pointer marks boundary between non-zeros and zeros
# - Second loop: fill remaining positions with zeros
# - This maintains relative order of non-zero elements
```

**JavaScript:**
```javascript
function moveZeroes(nums) {
    write = 0  # Position to write next non-zero
    
    # Move all non-zeros to front
    for num in nums:
        if num != 0:
            nums[write] = num
            write += 1
    
    # Fill rest with zeros
    for i in range(write, len(nums)):
        nums[i] = 0

# Explanation:
# - First loop: copy all non-zeros to front, preserving order
# - write pointer marks boundary between non-zeros and zeros
# - Second loop: fill remaining positions with zeros
# - This maintains relative order of non-zero elements
```

### Complexity Analysis

- **Time Complexity:** O(n) - two passes through array
- **Space Complexity:** O(1) - only one pointer used

### Test Cases

**Test 1:** Mixed zeros and non-zeros
- Input: "moveZeroes([0,1,0,3,12])"
- Expected: "[1,3,12,0,0]"

**Test 2:** Single zero
- Input: "moveZeroes([0])"
- Expected: "[0]"

**Test 3:** No zeros
- Input: "moveZeroes([1,2,3])"
- Expected: "[1,2,3]"

**Test 4:** Multiple zeros at start
- Input: "moveZeroes([0,0,1])"
- Expected: "[1,0,0]"

**Test 5:** Multiple zeros scattered
- Input: "moveZeroes([4,2,4,0,0,3,0,5,1,0])"
- Expected: "[4,2,4,3,5,1,0,0,0,0]"

**Test 6:** PERFORMANCE: Large array (90K elements) - Must use O(n) two-pointer approach
- Input: "moveZeroes([0 if i % 3 == 0 else i for i in range(90000)])"
- Expected: "[i for i in range(90000) if i % 3 != 0] + [0] * 30000"

---

## 11. Remove Duplicates from Sorted Array

**Difficulty:** easy
**Concept:** two-pointers
**Family:** two-pointers:in-place-modify

### Description

Given an integer array nums sorted in non-decreasing order, remove duplicates in-place such that each unique element appears only once. The relative order must be kept the same. Return k after placing final result in first k slots of nums.

### Key Insight

Use two pointers: slow pointer marks position to write next unique element, fast pointer scans array. When nums[fast] differs from nums[slow], it's a new unique element - write it at slow+1 and increment slow.

### Examples

**Example 1:**
- Input: nums = [1,1,2]
- Output: 2, nums = [1,2,_]
- Explanation: Two unique elements: 1 and 2

**Example 2:**
- Input: nums = [0,0,1,1,1,2,2,3,3,4]
- Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]
- Explanation: Five unique elements

### Hints

1. Since array is sorted, duplicates are adjacent
2. Keep slow pointer at last unique element found
3. Fast pointer scans ahead looking for different values
4. When nums[fast] != nums[slow], you found a new unique element
5. Write the new unique element at nums[slow+1], then increment slow
6. Return slow+1 as the count of unique elements

### Starter Code

**Python:**
```python
def removeDuplicates(nums):
    """
    Remove duplicates from sorted array in-place.
    
    Args:
        nums: List[int] - sorted array
    
    Returns:
        int - number of unique elements
    """
    # TODO: Handle empty array edge case
    
    # TODO: Use slow pointer for write position
    
    # TODO: Use fast pointer to scan array
    
    # TODO: When nums[fast] != nums[slow], write and increment slow
    
    pass
```

**JavaScript:**
```javascript
function removeDuplicates(nums) {
    """
    Remove duplicates from sorted array in-place.
    
    Args:
        nums: Array - sorted array
    
    Returns:
        int - number of unique elements
    """
    // TODO: Handle empty array edge case
    
    // TODO: Use slow pointer for write position
    
    // TODO: Use fast pointer to scan array
    
    // TODO: When nums[fast] != nums[slow], write and increment slow
  // TODO: implement
```

### Solution

**Python:**
```python
def removeDuplicates(nums):
    if not nums:
        return 0

    slow = 0  # Last unique element position

    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]

    return slow + 1

# Explanation:
# - slow tracks position of last unique element
# - fast scans array looking for new unique values
# - Since sorted, duplicates are adjacent - easy to detect
# - When nums[fast] differs, it's a new unique value
# - Write it at slow+1 and move slow forward
```

**JavaScript:**
```javascript
function removeDuplicates(nums) {
    if not nums:
        return 0

    slow = 0  # Last unique element position

    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]

    return slow + 1

# Explanation:
# - slow tracks position of last unique element
# - fast scans array looking for new unique values
# - Since sorted, duplicates are adjacent - easy to detect
# - When nums[fast] differs, it's a new unique value
# - Write it at slow+1 and move slow forward
```

### Complexity Analysis

- **Time Complexity:** O(n) - single pass through array
- **Space Complexity:** O(1) - only two pointers used

### Test Cases

**Test 1:** Basic duplicate removal
- Input: "removeDuplicates([1,1,2])"
- Expected: "2"

**Test 2:** Multiple duplicates
- Input: "removeDuplicates([0,0,1,1,1,2,2,3,3,4])"
- Expected: "5"

**Test 3:** Single element
- Input: "removeDuplicates([1])"
- Expected: "1"

**Test 4:** No duplicates
- Input: "removeDuplicates([1,2,3,4,5])"
- Expected: "5"

**Test 5:** All duplicates
- Input: "removeDuplicates([1,1,1,1,1])"
- Expected: "1"

**Test 6:** PERFORMANCE: Large array (120K elements) - Must use O(n) two-pointer approach
- Input: "removeDuplicates(sorted([i // 3 for i in range(120000)]))"
- Expected: "40000"

---

## 12. Remove Duplicates from Sorted Array II

**Difficulty:** medium
**Concept:** two-pointers
**Family:** two-pointers:in-place-modify

### Description

Given an integer array nums sorted in non-decreasing order, remove duplicates in-place such that each unique element appears at most twice. Return k after placing final result in first k slots of nums.

### Key Insight

Extend the previous approach: instead of comparing nums[fast] with nums[slow], compare with nums[slow-1]. This allows up to 2 duplicates. If nums[fast] differs from element 2 positions back, it's safe to include.

### Examples

**Example 1:**
- Input: nums = [1,1,1,2,2,3]
- Output: 5, nums = [1,1,2,2,3,_]
- Explanation: Each element appears at most twice

**Example 2:**
- Input: nums = [0,0,1,1,1,1,2,3,3]
- Output: 7, nums = [0,0,1,1,2,3,3,_,_]
- Explanation: Remove extra 1s, keep at most 2 of each

### Hints

1. The first 2 elements are always valid - they can't be the 3rd duplicate
2. Start slow at index 2
3. The key insight: compare nums[fast] with nums[slow-2]
4. If nums[fast] != nums[slow-2], it won't create a 3rd duplicate
5. This works because array is sorted - duplicates are consecutive
6. Write valid elements at slow position and increment

### Starter Code

**Python:**
```python
def removeDuplicates(nums):
    """
    Remove duplicates allowing at most 2 of each.
    
    Args:
        nums: List[int] - sorted array
    
    Returns:
        int - length of modified array
    """
    # TODO: Handle arrays with length <= 2
    
    # TODO: Start slow at index 2 (first 2 elements always valid)
    
    # TODO: Compare nums[fast] with nums[slow-2]
    
    # TODO: If different, include nums[fast] at slow position
    
    pass
```

**JavaScript:**
```javascript
function removeDuplicates(nums) {
    """
    Remove duplicates allowing at most 2 of each.
    
    Args:
        nums: Array - sorted array
    
    Returns:
        int - length of modified array
    """
    // TODO: Handle arrays with length <= 2
    
    // TODO: Start slow at index 2 (first 2 elements always valid)
    
    // TODO: Compare nums[fast] with nums[slow-2]
    
    // TODO: If different, include nums[fast] at slow position
  // TODO: implement
```

### Solution

**Python:**
```python
def removeDuplicates(nums):
    if len(nums) <= 2:
        return len(nums)
    
    slow = 2  # First 2 elements always valid
    
    for fast in range(2, len(nums)):
        # Compare with element 2 positions back
        if nums[fast] != nums[slow - 2]:
            nums[slow] = nums[fast]
            slow += 1
    
    return slow

# Explanation:
# - First 2 elements can't be 3rd duplicate, so they stay
# - For rest: nums[fast] is valid if != nums[slow-2]
# - Why? If nums[fast] == nums[slow-2], and array is sorted,
#   then nums[slow-1] also equals it (3rd duplicate!)
# - Comparing with slow-2 allows exactly 2 duplicates
```

**JavaScript:**
```javascript
function removeDuplicates(nums) {
    if len(nums) <= 2:
        return len(nums)
    
    slow = 2  # First 2 elements always valid
    
    for fast in range(2, len(nums)):
        # Compare with element 2 positions back
        if nums[fast] != nums[slow - 2]:
            nums[slow] = nums[fast]
            slow += 1
    
    return slow

# Explanation:
# - First 2 elements can't be 3rd duplicate, so they stay
# - For rest: nums[fast] is valid if != nums[slow-2]
# - Why? If nums[fast] == nums[slow-2], and array is sorted,
#   then nums[slow-1] also equals it (3rd duplicate!)
# - Comparing with slow-2 allows exactly 2 duplicates
```

### Complexity Analysis

- **Time Complexity:** O(n) - single pass
- **Space Complexity:** O(1) - only two pointers

### Test Cases

**Test 1:** Triple duplicate becomes double
- Input: "removeDuplicates([1,1,1,2,2,3])"
- Expected: "5"

**Test 2:** Multiple cases of 3+ duplicates
- Input: "removeDuplicates([0,0,1,1,1,1,2,3,3])"
- Expected: "7"

**Test 3:** All same, keep only 2
- Input: "removeDuplicates([1,1,1,1])"
- Expected: "2"

**Test 4:** No duplicates
- Input: "removeDuplicates([1,2,3])"
- Expected: "3"

**Test 5:** Exactly 2 elements
- Input: "removeDuplicates([1,1])"
- Expected: "2"

**Test 6:** PERFORMANCE: Large array (100K elements) - Must use O(n) two-pointer approach
- Input: "removeDuplicates(sorted([i // 4 for i in range(100000)]))"
- Expected: "50000"

---

## 13. Product of Array Except Self

**Difficulty:** medium
**Concept:** two-pointers

### Description

Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operator.

### Key Insight

Use two passes: first pass to calculate products of all elements to the left, second pass to calculate products of all elements to the right. Multiply left and right products for each position.

### Examples

**Example 1:**
- Input: nums = [1,2,3,4]
- Output: [24,12,8,6]
- Explanation: For index 0: product of [2,3,4] = 24. For index 1: product of [1,3,4] = 12, etc.

**Example 2:**
- Input: nums = [-1,1,0,-3,3]
- Output: [0,0,9,0,0]
- Explanation: Any product containing 0 will be 0

### Hints

1. Think about how you can calculate the product without using division.
2. What if you calculate the product of all elements to the left of each position?
3. What if you also calculate the product of all elements to the right of each position?
4. How can you combine these two pieces of information?

### Starter Code

**Python:**
```python
def productExceptSelf(nums):
    # Your code here
    pass
```

**JavaScript:**
```javascript
function productExceptSelf(nums) {
    # Your code here
  // TODO: implement
```

### Solution

**Python:**
```python
def productExceptSelf(nums):
    n = len(nums)
    result = [1] * n
    
    # First pass: calculate products of all elements to the left
    for i in range(1, n):
        result[i] = result[i-1] * nums[i-1]
    
    # Second pass: calculate products of all elements to the right
    right_product = 1
    for i in range(n-1, -1, -1):
        result[i] = result[i] * right_product
        right_product *= nums[i]
    
    return result
```

**JavaScript:**
```javascript
function productExceptSelf(nums) {
    n = len(nums)
    result = [1] * n
    
    # First pass: calculate products of all elements to the left
    for i in range(1, n):
        result[i] = result[i-1] * nums[i-1]
    
    # Second pass: calculate products of all elements to the right
    right_product = 1
    for i in range(n-1, -1, -1):
        result[i] = result[i] * right_product
        right_product *= nums[i]
    
    return result
```

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1) - excluding the output array

### Test Cases

**Test 1:** Basic case with positive numbers
- Input: "nums = [1,2,3,4]"
- Expected: "[24,12,8,6]"

**Test 2:** Case with zero and negative numbers
- Input: "nums = [-1,1,0,-3,3]"
- Expected: "[0,0,9,0,0]"

**Test 3:** Another case with positive numbers
- Input: "nums = [2,3,4,5]"
- Expected: "[60,40,30,24]"

**Test 4:** PERFORMANCE: Large array (20K elements) - Must use O(n) two-pass approach without division
- Input: "nums = list(range(1, 20001))"
- Expected: "str(len([i for i in range(1, 20001)]))"

---
