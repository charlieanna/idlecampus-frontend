# PREFIX-SUMS Problems

Total Problems: 16

---

## 1. Running Sum of 1D Array

**Difficulty:** easy
**Concept:** prefix-sums
**Additional Concepts:** prefix-sums
**Family:** prefix-sums:running-sum

### Description

Given an array nums, the running sum is defined as runningSum[i] = sum(nums[0]...nums[i]). Return the running sum of nums. This is the most basic prefix sum application.

### Examples

**Example 1:**
- Input: nums = [1,2,3,4]
- Output: [1,3,6,10]
- Explanation: Running sum is [1, 1+2, 1+2+3, 1+2+3+4] = [1,3,6,10]

### Hints

1. Build incrementally. Create a result array. The first element is nums[0]. Each subsequent element is the previous result plus the current nums value.
2. Use previous sum. result[i] = result[i-1] + nums[i]. This is the essence of prefix sums!
3. Implementation. result = [nums[0]]; for i in range(1, len(nums)): result.append(result[-1] + nums[i]); return result

### Starter Code

### Test Cases

**Test 1:** Basic case
- Input: "[1,2,3,4]"
- Expected: "[1,3,6,10]"

**Test 2:** All ones
- Input: "[1,1,1,1,1]"
- Expected: "[1,2,3,4,5]"

**Test 3:** Mixed values
- Input: "[3,1,2,10,1]"
- Expected: "[3,4,6,16,17]"

---

## 2. Find Pivot Index

**Difficulty:** easy
**Concept:** prefix-sums
**Family:** prefix-sums:pivot-index

### Description

Given an array nums, return the pivot index where the sum of numbers to the left equals the sum to the right. If no such index exists, return -1. Use prefix sums to solve this efficiently.

### Examples

**Example 1:**
- Input: nums = [1,7,3,6,5,6]
- Output: 3
- Explanation: Left sum = 1+7+3 = 11, Right sum = 5+6 = 11

### Hints

1. Total sum first. Calculate total_sum = sum(nums). For any index i, left_sum + nums[i] + right_sum = total_sum.
2. Running left sum. Iterate through array maintaining left_sum. At each index, right_sum = total_sum - left_sum - nums[i].
3. Check equality. If left_sum == right_sum, return i. After checking, add nums[i] to left_sum before next iteration.

### Starter Code

### Test Cases

**Test 1:** Pivot at index 3
- Input: "[1,7,3,6,5,6]"
- Expected: "3"

**Test 2:** No pivot
- Input: "[1,2,3]"
- Expected: "-1"

**Test 3:** Pivot at start
- Input: "[2,1,-1]"
- Expected: "0"

---

## 3. Find the Highest Altitude

**Difficulty:** easy
**Concept:** prefix-sums
**Family:** prefix-sums:cumulative-max

### Description

A biker starts at altitude 0. Given an array gain where gain[i] is the net altitude gain from point i to i+1, return the highest altitude reached. Track the maximum of prefix sums.

### Examples

**Example 1:**
- Input: gain = [-5,1,5,0,-7]
- Output: 1
- Explanation: Altitudes are [0,-5,-4,1,1,-6]. Highest is 1.

### Hints

1. Track current altitude. Start with current = 0, max_alt = 0. For each gain, add it to current altitude.
2. Update maximum. After each gain, update max_alt = max(max_alt, current). The answer is max_alt.
3. One pass solution. current = 0; max_alt = 0; for g in gain: current += g; max_alt = max(max_alt, current); return max_alt

### Starter Code

### Test Cases

**Test 1:** Example case
- Input: "[-5,1,5,0,-7]"
- Expected: "1"

**Test 2:** Returns to 0
- Input: "[-4,-3,-2,-1,4,3,2]"
- Expected: "0"

**Test 3:** Always increasing
- Input: "[1,2,3]"
- Expected: "6"

---

## 4. Number of Ways to Split Array

**Difficulty:** easy
**Concept:** prefix-sums
**Family:** prefix-sums:split-compare

### Description

Given array nums, count valid splits where sum of left part >= sum of right part. A split at index i means left = nums[0..i], right = nums[i+1..n-1]. Use prefix sums.

### Examples

**Example 1:**
- Input: nums = [10,4,-8,7]
- Output: 2
- Explanation: Valid splits at indices 0 and 1.

### Hints

1. Total sum helps. Get total = sum(nums). At index i, right_sum = total - left_sum.
2. Iterate and count. For i in range(n-1): Check if left_sum >= right_sum, increment count. Then left_sum += nums[i].
3. Careful with bounds. Only check indices 0 to n-2 (left part must have at least 1 element, right part too).

### Starter Code

### Test Cases

**Test 1:** Two valid splits
- Input: "[10,4,-8,7]"
- Expected: "2"

**Test 2:** Multiple splits
- Input: "[2,3,1,0]"
- Expected: "2"

**Test 3:** Equal parts
- Input: "[1,1,1]"
- Expected: "2"

---

## 5. Range Sum Query 2D - Immutable

**Difficulty:** easy
**Concept:** prefix-sums
**Family:** prefix-sums:2d

### Description

Given a 2D matrix, design a data structure to calculate the sum of elements inside any rectangle. Use 2D prefix sums where prefix[i][j] = sum of all elements from (0,0) to (i-1,j-1).

### Examples

**Example 1:**
- Input: matrix = [[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5]]
sumRegion(1,1,2,2) → 8
- Output: 11
- Explanation: Sum of [[6,3],[2,0]] = 11

### Hints

1. 2D prefix formula. prefix[i][j] = matrix[i-1][j-1] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1]. Add padding row/col of zeros.
2. Query formula. sum = prefix[row2+1][col2+1] - prefix[row1][col2+1] - prefix[row2+1][col1] + prefix[row1][col1]. This is inclusion-exclusion!
3. Build carefully. Create (m+1)x(n+1) prefix array initialized to 0. Fill using nested loops starting from (1,1).

### Starter Code

### Test Cases

**Test 1:** 2x2 region
- Input: "([[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5]], (1,1,2,2))"
- Expected: "11"

**Test 2:** Full matrix
- Input: "([[1,2],[3,4]], (0,0,1,1))"
- Expected: "10"

---

## 6. Subarray Sum Equals K

**Difficulty:** medium
**Concept:** prefix-sums
**Additional Concepts:** prefix-sums, hash-map
**Family:** prefix-sums:prefix-hash

### Description

Given array nums and integer k, return the count of contiguous subarrays with sum equal to k. Use hashmap to store prefix sums for O(n) solution.

### Examples

**Example 1:**
- Input: nums = [1,1,1], k = 2
- Output: 2
- Explanation: Subarrays [1,1] and [1,1] both sum to 2.

### Hints

1. Prefix sum insight. If prefix_sum[j] - prefix_sum[i] = k, then subarray from i+1 to j sums to k. So look for (current_prefix - k) in hashmap.
2. Hashmap tracks counts. Use dict to count occurrences of each prefix sum. Start with {0: 1} to handle subarrays from index 0.
3. Update as you go. For each num: prefix += num; count += prefix_map.get(prefix - k, 0); prefix_map[prefix] = prefix_map.get(prefix, 0) + 1

### Starter Code

### Test Cases

**Test 1:** Two subarrays
- Input: "([1,1,1], 2)"
- Expected: "2"

**Test 2:** [1,2] and [3]
- Input: "([1,2,3], 3)"
- Expected: "2"

**Test 3:** With negatives
- Input: "([1,-1,0], 0)"
- Expected: "3"

---

## 7. Continuous Subarray Sum

**Difficulty:** medium
**Concept:** prefix-sums
**Additional Concepts:** prefix-sums, hash-map
**Family:** prefix-sums:prefix-mod

### Description

Given array nums and integer k, return true if there exists a subarray of length >= 2 whose sum is a multiple of k. Use modulo arithmetic with prefix sums and hashmap.

### Examples

**Example 1:**
- Input: nums = [23,2,4,6,7], k = 6
- Output: true
- Explanation: [2,4] sums to 6 which is multiple of 6.

### Hints

1. Modulo property. If (prefix[j] - prefix[i]) % k == 0, then prefix[j] % k == prefix[i] % k. Use this!
2. Store remainder and index. Use dict {remainder: earliest_index}. If same remainder seen before at least 2 positions apart, return true.
3. Edge cases. Initialize with {0: -1} to handle subarrays from start. Check if current_index - prev_index >= 2.

### Starter Code

### Test Cases

**Test 1:** [2,4] sums to 6
- Input: "([23,2,4,6,7], 6)"
- Expected: "true"

**Test 2:** [23,2,6,4,7] sum = 42
- Input: "([23,2,6,4,7], 6)"
- Expected: "true"

**Test 3:** [0,0] length 2
- Input: "([5,0,0,0], 3)"
- Expected: "true"

---

## 8. Product of Array Except Self

**Difficulty:** medium
**Concept:** prefix-sums

### Description

Given array nums, return array answer where answer[i] equals the product of all elements except nums[i]. Solve without division in O(n) using prefix and suffix products.

### Examples

**Example 1:**
- Input: nums = [1,2,3,4]
- Output: [24,12,8,6]
- Explanation: [2*3*4, 1*3*4, 1*2*4, 1*2*3]

### Hints

1. Two passes. First pass: result[i] = product of all elements before i. Second pass: multiply by product of all elements after i.
2. Prefix pass. Use variable prefix = 1. For i: result[i] = prefix; prefix *= nums[i]. This builds left products.
3. Suffix pass. Use variable suffix = 1. For i from n-1 to 0: result[i] *= suffix; suffix *= nums[i]. This multiplies by right products.

### Starter Code

### Test Cases

**Test 1:** Basic case
- Input: "[1,2,3,4]"
- Expected: "[24,12,8,6]"

**Test 2:** With zero
- Input: "[-1,1,0,-3,3]"
- Expected: "[0,0,9,0,0]"

**Test 3:** No ones
- Input: "[2,3,4,5]"
- Expected: "[60,40,30,24]"

---

## 9. Subarray Sums Divisible by K

**Difficulty:** medium
**Concept:** prefix-sums
**Additional Concepts:** prefix-sums, hash-map

### Description

Given array nums and integer k, return count of non-empty subarrays with sum divisible by k. Use prefix sum modulo with hashmap, handle negative remainders.

### Examples

**Example 1:**
- Input: nums = [4,5,0,-2,-3,1], k = 5
- Output: 7
- Explanation: 7 subarrays have sum divisible by 5.

### Hints

1. Remainder matching. If prefix[i] % k == prefix[j] % k, then subarray (i,j] is divisible by k. Count occurrences of each remainder.
2. Handle negatives. In Python, -3 % 5 = 2 (correct). In other languages, use ((prefix % k) + k) % k to ensure positive remainder.
3. Count combinations. Use {0: 1} initially. For each prefix: count += freq[remainder]; freq[remainder] += 1. This counts all pairs.

### Starter Code

### Test Cases

**Test 1:** Example case
- Input: "([4,5,0,-2,-3,1], 5)"
- Expected: "7"

**Test 2:** Single element
- Input: "([5], 9)"
- Expected: "0"

**Test 3:** [3] only
- Input: "[1,2,3], 3)"
- Expected: "1"

---

## 10. Maximum Size Subarray Sum Equals k

**Difficulty:** medium
**Concept:** prefix-sums
**Additional Concepts:** prefix-sums, hash-map

### Description

Given array nums and integer k, return the maximum length of a subarray that sums to k. Use hashmap to store first occurrence of each prefix sum.

### Examples

**Example 1:**
- Input: nums = [1,-1,5,-2,3], k = 3
- Output: 4
- Explanation: Subarray [-1,5,-2,3] has sum 3 and length 4.

### Hints

1. Store first occurrence. Use dict {prefix_sum: earliest_index}. Only store first occurrence to maximize length.
2. Find matching prefix. If (prefix - k) in map, then subarray from that index+1 to current has sum k. Length = current_index - map[prefix-k].
3. Initialize map. Start with {0: -1} to handle subarrays from index 0. Update max_len when match found. Add prefix to map only if not present.

### Starter Code

### Test Cases

**Test 1:** [-1,5,-2,3]
- Input: "([1,-1,5,-2,3], 3)"
- Expected: "4"

**Test 2:** [-1,2] or [2,1]
- Input: "([-2,-1,2,1], 1)"
- Expected: "2"

**Test 3:** [1,1]
- Input: "([1,1,0], 2)"
- Expected: "2"

---

## 11. Contiguous Array

**Difficulty:** medium
**Concept:** prefix-sums
**Additional Concepts:** prefix-sums, hash-map

### Description

Given binary array nums, find maximum length of contiguous subarray with equal number of 0s and 1s. Convert 0→-1, then find longest subarray with sum 0 using prefix sum.

### Examples

**Example 1:**
- Input: nums = [0,1,0]
- Output: 2
- Explanation: [0,1] or [1,0] has equal 0s and 1s.

### Hints

1. Transform problem. Treat 0 as -1. Now we want longest subarray with sum 0. This means equal +1s and -1s, i.e., equal 0s and 1s!
2. Prefix sum = 0. If prefix_sum[i] == prefix_sum[j], subarray (i,j] has sum 0. Track first occurrence of each prefix sum.
3. Implementation. sum = 0; map = {0: -1}; for i, num in enumerate(nums): sum += 1 if num == 1 else -1; if sum in map: max_len = max(max_len, i - map[sum]); else: map[sum] = i

### Starter Code

### Test Cases

**Test 1:** Whole array
- Input: "[0,1]"
- Expected: "2"

**Test 2:** First or last 2
- Input: "[0,1,0]"
- Expected: "2"

**Test 3:** [1,0,0,0,1,1]
- Input: "[0,0,1,0,0,0,1,1]"
- Expected: "6"

---

## 12. Minimum Operations to Reduce X to Zero

**Difficulty:** medium
**Concept:** prefix-sums

### Description

Given array nums and integer x, in one operation you can remove leftmost or rightmost element and subtract its value from x. Return minimum operations to reduce x to 0, or -1. Convert to: find longest subarray with sum = total - x.

### Examples

**Example 1:**
- Input: nums = [1,1,4,2,3], x = 5
- Output: 2
- Explanation: Remove 2 and 3 from right.

### Hints

1. Reverse thinking. Instead of removing from ends, find the longest middle subarray to keep. If we keep subarray with sum (total-x), the removed ends sum to x!
2. Sliding window. Find longest subarray with sum = total - x using sliding window or hashmap. If no such subarray, return -1.
3. Final answer. If target = total - x < 0, return -1. Find max_len of subarray summing to target. Answer = n - max_len if found, else -1.

### Starter Code

### Test Cases

**Test 1:** Remove from right
- Input: "([1,1,4,2,3], 5)"
- Expected: "2"

**Test 2:** Impossible
- Input: "([5,6,7,8,9], 4)"
- Expected: "-1"

**Test 3:** Remove most
- Input: "([3,2,20,1,1,3], 10)"
- Expected: "5"

---

## 13. Count Number of Nice Subarrays

**Difficulty:** medium
**Concept:** prefix-sums
**Additional Concepts:** prefix-sums, hash-map

### Description

Given array nums and integer k, return number of nice subarrays. A nice subarray contains exactly k odd numbers. Use prefix sum with hashmap, treating odd as 1, even as 0.

### Examples

**Example 1:**
- Input: nums = [1,1,2,1,1], k = 3
- Output: 2
- Explanation: Subarrays [1,1,2,1] and [1,2,1,1].

### Hints

1. Transform to prefix. Create prefix array counting odd numbers. If prefix[j] - prefix[i] = k, subarray (i,j] has k odds.
2. Hashmap approach. Track frequency of each odd_count. For current count, add freq[count - k] to result.
3. Implementation. odd_count = 0; freq = {0: 1}; for num in nums: odd_count += num % 2; count += freq.get(odd_count - k, 0); freq[odd_count] = freq.get(odd_count, 0) + 1

### Starter Code

### Test Cases

**Test 1:** Example case
- Input: "([1,1,2,1,1], 3)"
- Expected: "2"

**Test 2:** No odds
- Input: "([2,4,6], 1)"
- Expected: "0"

**Test 3:** Two odd numbers
- Input: "([2,2,2,1,2,2,1,2,2,2], 2)"
- Expected: "16"

---

## 14. Range Sum Query 2D - Mutable

**Difficulty:** medium
**Concept:** prefix-sums

### Description

Design a 2D matrix with update(row, col, val) and sumRegion(row1, col1, row2, col2) operations. For interview practice, implement using nested 1D Fenwick Trees (Binary Indexed Trees) for O(log²n) operations.

### Examples

**Example 1:**
- Input: [[3,0,1,4,2],[5,6,3,2,1]], update(0,0,5), sumRegion(0,0,1,1)
- Output: sum = 16
- Explanation: After update

### Hints

1. Why not prefix? With updates, rebuilding prefix array is O(mn). Fenwick tree allows O(log n) updates and O(log n) queries.
2. 2D Fenwick concept. Extend 1D Fenwick to 2D. Store partial sums in tree structure. Update and query require navigating tree indices.
3. Simpler approach. For interview, you can also use row-wise prefix sums rebuilt on update, or mention Segment Tree / Fenwick Tree as optimization.
4. Alternative: Segment tree. Another option is 2D Segment Tree. Both Fenwick and Segment trees give O(log²n) complexity for 2D operations.

### Starter Code

### Test Cases

**Test 1:** After update
- Input: "([[3,0,1],[5,6,3]], update(0,0,5), sumRegion(0,0,1,1))"
- Expected: "16"

**Test 2:** Full matrix
- Input: "([[1,2],[3,4]], sumRegion(0,0,1,1))"
- Expected: "10"

---

## 15. Range Module

**Difficulty:** hard
**Concept:** prefix-sums

### Description

Design a data structure to track ranges of numbers. addRange(left, right) adds [left, right), queryRange(left, right) checks if [left, right) is fully tracked, removeRange(left, right) removes [left, right). Use interval merging with prefix concepts.

### Examples

**Example 1:**
- Input: addRange(10,20), removeRange(14,16), queryRange(10,14) → true, queryRange(10,15) → false
- Output: true, false
- Explanation: Range operations

### Hints

1. Interval merging. When adding [left, right), merge with overlapping existing intervals. Binary search to find affected intervals.
2. Query check. For queryRange, find intervals that overlap [left, right). Check if they fully cover it.
3. Remove operation. Find overlapping intervals, split them if needed, and remove the [left, right) portion.
4. Data structure. Use sorted list of non-overlapping intervals. Each operation: find affected intervals using binary search.

### Starter Code

### Test Cases

**Test 1:** Range added
- Input: "addRange(10,20), queryRange(10,14)"
- Expected: "true"

**Test 2:** After removal
- Input: "addRange(10,20), removeRange(14,16), queryRange(10,15)"
- Expected: "false"

---

## 16. Maximum XOR Queries

**Difficulty:** hard
**Concept:** prefix-sums

### Description

Given array nums and queries [xi, mi], find max(nums[j] XOR xi) where nums[j] <= mi. Use Trie with prefix XOR bits and binary search on values.

### Examples

**Example 1:**
- Input: nums = [0,1,2,3,4], queries = [[3,1],[1,3],[5,6]]
- Output: [3,3,7]
- Explanation: For each query, find max XOR with constraint

### Hints

1. Trie for XOR. Build Trie of binary representations. For each bit position, try to go opposite direction for max XOR.
2. Constraint handling. Sort nums and queries by constraint mi. Process queries in order, adding elements to Trie as we go.
3. Offline queries. Sort queries while tracking original indices. Build answer array and place results at correct indices.
4. Bit manipulation. For max XOR, at each bit, choose path that differs from query's bit if possible.

### Starter Code

### Test Cases

**Test 1:** Example case
- Input: "([0,1,2,3,4], [[3,1],[1,3],[5,6]])"
- Expected: "[3,3,7]"

**Test 2:** Complex queries
- Input: "([5,2,4,6,6,3], [[12,4],[8,1],[6,3]])"
- Expected: "[15,5,7]"

---
