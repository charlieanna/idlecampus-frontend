# REVERSE-TRAVERSAL Problems

Total Problems: 19

---

## 1. Plus One

**Difficulty:** easy
**Concept:** reverse-traversal

### Description

🎯 PATTERN APPLICATION #1: Array with Carries

You just learned reverse traversal by merging two sorted arrays. Now let's apply the same pattern to a different problem: adding one to a large integer stored as an array.

❓ WHY REVERSE TRAVERSAL?
When adding 1 to [1,2,3], we start from the rightmost digit (just like merging from the end). If we started from the left, we'd need to shift everything when there's a carry!

🧠 CONNECTION TO MERGE:
• Merge: Fill from the end to avoid shifting
• Plus One: Add from the end to handle carries naturally
• Same pattern, different context!

PROBLEM: Add one to the integer represented by a list of digits stored in big-endian order and return the resulting digit list.

### Examples

**Example 1:**
- Input: digits = [1,2,3]
- Output: [1,2,4]
- Explanation: No carry needed, just increment last digit

**Example 2:**
- Input: digits = [9,9,9]
- Output: [1,0,0,0]
- Explanation: Carry propagates through entire array, need extra digit at front

### Hints

1. 🔍 Pattern Recognition: This is EXACTLY like Merge Sorted Array! In merge, we filled from the end to avoid shifting. Here, we add from the end to handle carries without shifting. Do you see the similarity?
2. 🧠 Why Reverse? If we added from the LEFT: [1,2,3] + 1 → if digit 1 becomes 2, we're done. But if [9,9,9] + 1 → first digit overflows, we need to shift EVERYTHING right to make room for the new leading 1. From the RIGHT, carries just propagate naturally!
3. 📐 The Setup: Start from the last index (len(digits) - 1). Add 1 to it. If it becomes 10, set it to 0 and 'carry' 1 to the next position. Walk backwards through the array.
4. 🎯 The Edge Case: What if ALL digits are 9? [9,9,9] + 1 = [1,0,0,0]. After your loop, if there's still a carry, you need to INSERT 1 at the front. This is the only time you modify the array length.
5. 💡 The Code Pattern:
for i in range(len(digits)-1, -1, -1):  # Walk backwards
    digits[i] += 1
    if digits[i] < 10: return digits  # No carry, done!
    digits[i] = 0  # Carry continues
return [1] + digits  # All 9s case

### Starter Code

### Test Cases

**Test 1:** No carry - simplest case
- Input: "[1,2,3]"
- Expected: "[1,2,4]"

**Test 2:** Full carry - hardest case
- Input: "[9,9,9]"
- Expected: "[1,0,0,0]"

**Test 3:** Carry stops mid-array
- Input: "[4,3,2,9]"
- Expected: "[4,3,3,0]"

**Test 4:** Single digit overflow
- Input: "[9]"
- Expected: "[1,0]"

---

## 2. Remove Element In-Place

**Difficulty:** medium
**Concept:** reverse-traversal

### Description

🎯 PATTERN APPLICATION #2: In-Place Removal Without Shifting

You've seen reverse traversal in merging (fill from end) and carries (propagate from end). Now let's use it for REMOVAL - avoiding expensive shifts by working backwards!

❓ THE PROBLEM WITH FORWARD TRAVERSAL:
Remove all 3s from [3, 2, 3, 1]:
• Forward: See 3 at index 0 → shift [2,3,1] left → see 3 at index 1 → shift [1] left
• O(n²) time due to all the shifting!

🧠 THE REVERSE SOLUTION:
Instead of shifting, treat the array like it has a "shrinking tail". When you see a 3, swap it with the element at the tail and shrink the tail. You're processing the tail in REVERSE order!

💡 CONNECTION TO PREVIOUS:
• Merge: Two pointers moving backwards
• Plus One: Single pointer moving backwards
• Remove Element: Two pointers, one forward AND one backwards!

PROBLEM: Given an array nums and a value val, remove all instances of val in-place and return the new length. Order of the remaining elements does not matter.

### Examples

**Example 1:**
- Input: nums = [3,2,2,3], val = 3
- Output: 2
- Explanation: First two elements are valid, rest don't matter. nums becomes [2,2,_,_]

**Example 2:**
- Input: nums = [0,1,2,2,3,0,4,2], val = 2
- Output: 5
- Explanation: Swap unwanted elements to the end, return count of valid elements

### Hints

1. 🔍 Pattern Recognition: Remember Merge Sorted Array used two pointers moving backwards? Here we use TWO pointers but one moves FORWARD (i) and one moves BACKWARD (tail). This is a hybrid approach!
2. 🧠 Why Not Just Forward? Removing [3,2,2,3] val=3 forward means: delete index 0 → shift everything → delete new index → shift again. That's O(n²)! Instead, keep a 'tail' pointer at the end. When you see val, swap with tail and shrink tail. No shifting needed!
3. 📐 The Two-Pointer Setup: i starts at 0 (checking from front). tail starts at len(nums)-1 (last valid position). Loop while i <= tail. This ensures you check every element exactly once.
4. 🎯 The Swap Logic:
if nums[i] == val:
    nums[i] = nums[tail]  # Bring in element from tail
    tail -= 1  # Shrink the valid region
    # DON'T increment i! The new value needs checking
else:
    i += 1  # This element is good, move on
5. 💡 The Complete Pattern:
tail = len(nums) - 1
i = 0
while i <= tail:
    if nums[i] == val:
        nums[i] = nums[tail]
        tail -= 1
    else:
        i += 1
return tail + 1  # Number of valid elements

### Starter Code

### Test Cases

**Test 1:** Remove from both ends
- Input: "([3,2,2,3], 3)"
- Expected: "2"

**Test 2:** Multiple removals scattered
- Input: "([0,1,2,2,3,0,4,2], 2)"
- Expected: "5"

**Test 3:** Remove everything
- Input: "([2,2,2], 2)"
- Expected: "0"

**Test 4:** Remove nothing
- Input: "([1,2,3], 4)"
- Expected: "3"

---

## 3. Squares of a Sorted Array

**Difficulty:** easy
**Concept:** reverse-traversal

### Description

🎯 PATTERN APPLICATION #3: Merging with Comparison (Advanced)

This is the ULTIMATE test of reverse traversal mastery. It combines everything you've learned:
• Two pointers (like Merge Sorted Array)
• Reverse traversal (like Plus One)
• Comparison logic (like original merge)

❓ THE CHALLENGE:
Given a sorted array [-4,-1,0,3,10], return squares in sorted order: [0,1,9,16,100]

Why is this tricky? Negative numbers become large when squared: (-4)² = 16!

🧠 THE REVERSE INSIGHT:
The LARGEST square is always at one of the ENDS (most negative or most positive).
• Forward merge would require sorting after squaring: O(n log n)
• Reverse merge: Pick the largest from ends, fill from back: O(n)!

💡 CONNECTION TO ALL PREVIOUS:
• Merge Sorted Array: Two sorted arrays, merge from end
• Plus One: Single array, work from end with carries
• Remove Element: Two pointers (one forward, one back)
• Squares: Two pointers at BOTH ENDS, fill from end!

PROBLEM: Return squares of sorted array, also sorted, in O(n) time without sorting.

### Examples

**Example 1:**
- Input: nums = [-4,-1,0,3,10]
- Output: [0,1,9,16,100]
- Explanation: Largest squares come from the extremes: 10² or (-4)²

**Example 2:**
- Input: nums = [-7,-3,2,3,11]
- Output: [4,9,9,49,121]
- Explanation: Compare both ends: left=-7 (49), right=11 (121)

### Hints

1. 🔍 Ultimate Pattern Recognition: This is LITERALLY Merge Sorted Array! You have:
• Two 'sorted' regions (negative squares decrease, positive squares increase)
• Need to merge into one sorted array
• Fill from the END to avoid shifts

The only difference: you're comparing |nums[left]|² vs |nums[right]|²
2. 🧠 Why From the End? The LARGEST square is always at one of the extremes:
• Most negative: (-7)² = 49
• Most positive: (11)² = 121

So start with an empty result array, and fill it from the END with the larger of left² or right². Exactly like merge!
3. 📐 The Three-Pointer Setup:
left = 0, right = len(nums) - 1, write = len(nums) - 1
result = [0] * len(nums)

Just like merge had three pointers (p1, p2, write), this has left, right, write!
4. 🎯 The Comparison Logic:
while left <= right:
    left_square = nums[left] * nums[left]
    right_square = nums[right] * nums[right]
    
    if left_square > right_square:
        result[write] = left_square
        left += 1
    else:
        result[write] = right_square
        right -= 1
    write -= 1
5. 💡 The Full Solution: This is Merge Sorted Array with:
1. Comparison on MAGNITUDES (squares)
2. Pointers at BOTH ENDS instead of both at end
3. Still filling from the END

The reverse traversal pattern: whenever you need to avoid shifts or handle things from largest/smallest, work backwards!

### Starter Code

### Test Cases

**Test 1:** Mixed negatives and positives
- Input: "[-4,-1,0,3,10]"
- Expected: "[0,1,9,16,100]"

**Test 2:** Both ends contribute
- Input: "[-7,-3,2,3,11]"
- Expected: "[4,9,9,49,121]"

**Test 3:** All positive
- Input: "[1,2,3,4]"
- Expected: "[1,4,9,16]"

**Test 4:** All negative
- Input: "[-5,-4,-3,-2]"
- Expected: "[4,9,16,25]"

---

## 4. Add Binary

**Difficulty:** easy
**Concept:** reverse-traversal

### Description

Given two binary strings, return their sum as a binary string. The inputs may have different lengths.

### Examples

**Example 1:**
- Input: a = '11', b = '1'
- Output: '100'
- Explanation: 11 + 1 = 100 in binary.

### Starter Code

### Test Cases

**Test 1:** Different lengths with carry
- Input: "('11', '1')"
- Expected: "'100'"

**Test 2:** Same length
- Input: "('1010', '1011')"
- Expected: "'10101'"

**Test 3:** Both zero
- Input: "('0', '0')"
- Expected: "'0'"

**Test 4:** Carry runs through entire sum
- Input: "('1111', '1111')"
- Expected: "'11110'"

**Test 5:** Short inputs
- Input: "('101', '10')"
- Expected: "'111'"

---

## 5. Add to Array-Form of Integer

**Difficulty:** easy
**Concept:** reverse-traversal

### Description

Given a non-negative integer represented as an array of digits and an integer k, return the array-form of their sum.

### Examples

**Example 1:**
- Input: num = [1,2,0,0], k = 34
- Output: [1,2,3,4]
- Explanation: 1200 + 34 = 1234

### Starter Code

### Test Cases

**Test 1:** Basic addition
- Input: "([1,2,0,0], 34)"
- Expected: "[1,2,3,4]"

**Test 2:** With carry
- Input: "([2,7,4], 181)"
- Expected: "[4,5,5]"

**Test 3:** All carries
- Input: "([9,9,9], 1)"
- Expected: "[1,0,0,0]"

**Test 4:** k longer than array-form
- Input: "([0], 1000)"
- Expected: "[1,0,0,0]"

**Test 5:** k adds new leading digit
- Input: "([2,1,5], 806)"
- Expected: "[1,0,2,1]"

---

## 6. Reverse Integer

**Difficulty:** easy
**Concept:** reverse-traversal

### Description

Reverse the digits of a 32-bit signed integer. Return 0 if the reversed value falls outside the 32-bit signed range.

### Examples

**Example 1:**
- Input: x = 123
- Output: 321

**Example 2:**
- Input: x = -123
- Output: -321

### Starter Code

### Test Cases

**Test 1:** Positive number
- Input: "123"
- Expected: "321"

**Test 2:** Negative number
- Input: "-123"
- Expected: "-321"

**Test 3:** Trailing zeros
- Input: "120"
- Expected: "21"

**Test 4:** Negative with trailing zero
- Input: "-120"
- Expected: "-21"

**Test 5:** Overflow case
- Input: "1534236469"
- Expected: "0"

---

## 7. Reverse Bits

**Difficulty:** easy
**Concept:** reverse-traversal
**Additional Concepts:** reverse-traversal, bit-manipulation

### Description

Reverse the bits of a 32-bit unsigned integer and return the resulting value.

### Examples

**Example 1:**
- Input: n = 00000010100101000001111010011100
- Output: 964176192 (00111001011110000010100101000000)

### Starter Code

### Test Cases

**Test 1:** Example case
- Input: "43261596"
- Expected: "964176192"

**Test 2:** High bits set
- Input: "4294967293"
- Expected: "3221225471"

**Test 3:** Single bit
- Input: "1"
- Expected: "2147483648"

**Test 4:** All zero bits
- Input: "0"
- Expected: "0"

**Test 5:** All bits set
- Input: "4294967295"
- Expected: "4294967295"

---

## 8. Reverse Words in a String III

**Difficulty:** easy
**Concept:** reverse-traversal

### Description

Given a string, reverse the characters of each word while preserving the word order and spacing between words.

### Examples

**Example 1:**
- Input: s = "Let's take LeetCode contest"
- Output: "s'teL ekat edoCteeL tsetnoc"

### Starter Code

### Test Cases

**Test 1:** Multiple words
- Input: "\"Let's take LeetCode contest\""
- Expected: "\"s'teL ekat edoCteeL tsetnoc\""

**Test 2:** Two words
- Input: "\"God Ding\""
- Expected: "\"doG gniD\""

**Test 3:** Single character
- Input: "\"a\""
- Expected: "\"a\""

**Test 4:** Three words
- Input: "\"abc def ghi\""
- Expected: "\"cba fed ihg\""

**Test 5:** Mixed casing
- Input: "\"Hello world\""
- Expected: "\"olleH dlrow\""

---

## 9. Backspace String Compare

**Difficulty:** easy
**Concept:** reverse-traversal

### Description

Compare two strings that contain lowercase letters and '#' characters representing backspaces, and decide whether they produce the same final string.

### Examples

**Example 1:**
- Input: s = 'ab#c', t = 'ad#c'
- Output: true
- Explanation: Both become 'ac'

### Starter Code

### Test Cases

**Test 1:** Both equal after backspace
- Input: "('ab#c', 'ad#c')"
- Expected: "true"

**Test 2:** Multiple backspaces
- Input: "('ab##', 'c#d#')"
- Expected: "true"

**Test 3:** Different results
- Input: "('a#c', 'b')"
- Expected: "false"

**Test 4:** Backspace removes recent letter
- Input: "('xywrrmp', 'xywrrmu#p')"
- Expected: "true"

**Test 5:** Backspaces collapse to same string
- Input: "('y#fo##f', 'y#f#o##f')"
- Expected: "true"

---

## 10. Next Permutation

**Difficulty:** medium
**Concept:** reverse-traversal

### Description

Rearrange an array of numbers into the next lexicographically greater permutation, or the lowest permutation if no greater ordering exists.

### Examples

**Example 1:**
- Input: nums = [1,2,3]
- Output: [1,3,2]

**Example 2:**
- Input: nums = [3,2,1]
- Output: [1,2,3]

### Starter Code

### Test Cases

**Test 1:** Simple next
- Input: "[1,2,3]"
- Expected: "[1,3,2]"

**Test 2:** Descending to ascending
- Input: "[3,2,1]"
- Expected: "[1,2,3]"

**Test 3:** Middle permutation
- Input: "[1,3,2]"
- Expected: "[2,1,3]"

**Test 4:** Handles duplicates
- Input: "[1,1,5]"
- Expected: "[1,5,1]"

**Test 5:** Wraps to next ordering
- Input: "[1,5,1]"
- Expected: "[5,1,1]"

---

## 11. Simplify Path

**Difficulty:** medium
**Concept:** reverse-traversal
**Additional Concepts:** reverse-traversal, stacks

### Description

Simplify an absolute Unix-style file path so that it represents the canonical path to the same location.

### Examples

**Example 1:**
- Input: path = '/home//foo/'
- Output: '/home/foo'

**Example 2:**
- Input: path = '/a/./b/../../c/'
- Output: '/c'

### Starter Code

### Test Cases

**Test 1:** Multiple slashes
- Input: "'/home//foo/'"
- Expected: "'/home/foo'"

**Test 2:** Parent directory navigation
- Input: "'/a/./b/../../c/'"
- Expected: "'/c'"

**Test 3:** Root parent is root
- Input: "'/../'"
- Expected: "'/'"

**Test 4:** Complex mixed tokens
- Input: "'/a//b////c/d//././/..'"
- Expected: "'/a/b/c'"

**Test 5:** Moves above root
- Input: "'/home/../../..'"
- Expected: "'/'"

---

## 12. Decode String

**Difficulty:** medium
**Concept:** reverse-traversal
**Additional Concepts:** reverse-traversal, stacks

### Description

Decode a string where patterns like k[encoded_string] repeat the enclosed substring k times, supporting nested expressions.

### Examples

**Example 1:**
- Input: s = '3[a]2[bc]'
- Output: 'aaabcbc'

**Example 2:**
- Input: s = '3[a2[c]]'
- Output: 'accaccacc'

### Starter Code

### Test Cases

**Test 1:** Sequential patterns
- Input: "'3[a]2[bc]'"
- Expected: "'aaabcbc'"

**Test 2:** Nested patterns
- Input: "'3[a2[c]]'"
- Expected: "'accaccacc'"

**Test 3:** Mixed patterns
- Input: "'2[abc]3[cd]ef'"
- Expected: "'abcabccdcdcdef'"

**Test 4:** Double-digit repeat count
- Input: "'10[a]'"
- Expected: "'aaaaaaaaaa'"

**Test 5:** Prefix and suffix text
- Input: "'abc3[cd]xyz'"
- Expected: "'abccdcdcdxyz'"

---

## 13. Remove All Adjacent Duplicates in String II

**Difficulty:** medium
**Concept:** reverse-traversal
**Additional Concepts:** reverse-traversal, stacks

### Description

Given a string s and integer k, repeatedly remove groups of k identical adjacent characters until no such group remains, then return the resulting string.

### Examples

**Example 1:**
- Input: s = 'deeedbbcccbdaa', k = 3
- Output: 'aa'
- Explanation: Remove 'eee', 'ccc', 'dbb', leaving 'aa'

### Starter Code

### Test Cases

**Test 1:** Multiple removals
- Input: "('deeedbbcccbdaa', 3)"
- Expected: "'aa'"

**Test 2:** All pairs removed
- Input: "('pbbcggttciiippooaais', 2)"
- Expected: "'ps'"

**Test 3:** No duplicates
- Input: "('abcd', 2)"
- Expected: "'abcd'"

**Test 4:** Removals create new matches
- Input: "('aaabcccd', 3)"
- Expected: "'bd'"

**Test 5:** Entire string removed
- Input: "('aaabbb', 3)"
- Expected: "''"

---

## 14. Daily Temperatures

**Difficulty:** medium
**Concept:** reverse-traversal
**Additional Concepts:** reverse-traversal, stacks

### Description

For each temperature in the input array, determine how many days must pass until a warmer temperature occurs; if none, record 0.

### Examples

**Example 1:**
- Input: temperatures = [73,74,75,71,69,72,76,73]
- Output: [1,1,4,2,1,1,0,0]

### Starter Code

### Test Cases

**Test 1:** Example case
- Input: "[73,74,75,71,69,72,76,73]"
- Expected: "[1,1,4,2,1,1,0,0]"

**Test 2:** Increasing temps
- Input: "[30,40,50,60]"
- Expected: "[1,1,1,0]"

**Test 3:** Always increasing
- Input: "[30,60,90]"
- Expected: "[1,1,0]"

**Test 4:** Never warms up
- Input: "[90,80,70]"
- Expected: "[0,0,0]"

**Test 5:** Single day
- Input: "[30]"
- Expected: "[0]"

---

## 15. Next Greater Element II

**Difficulty:** medium
**Concept:** reverse-traversal
**Additional Concepts:** reverse-traversal, stacks

### Description

Given a circular array, for each element find the next greater element moving forward around the circle; return -1 if none exists.

### Examples

**Example 1:**
- Input: nums = [1,2,1]
- Output: [2,-1,2]
- Explanation: First 1's next greater is 2. 2 has no greater. Last 1's next greater is 2 (circular).

### Starter Code

### Test Cases

**Test 1:** Circular lookup needed
- Input: "[1,2,1]"
- Expected: "[2,-1,2]"

**Test 2:** Mixed greater elements
- Input: "[1,2,3,4,3]"
- Expected: "[2,3,4,-1,4]"

**Test 3:** Decreasing array
- Input: "[5,4,3,2,1]"
- Expected: "[-1,5,5,5,5]"

**Test 4:** Wraparound needed mid-array
- Input: "[2,1,2,4,3]"
- Expected: "[4,2,4,-1,4]"

**Test 5:** All elements equal
- Input: "[5,5,5]"
- Expected: "[-1,-1,-1]"

**Test 6:** Single element
- Input: "[1]"
- Expected: "[-1]"

---

## 16. Asteroid Collision

**Difficulty:** medium
**Concept:** reverse-traversal
**Additional Concepts:** reverse-traversal, stacks

### Description

Simulate collisions between asteroids moving along a line, where positive values move right and negative values move left, and return the state after all collisions resolve.

### Examples

**Example 1:**
- Input: asteroids = [5,10,-5]
- Output: [5,10]
- Explanation: 10 and -5 collide, 10 remains. 5 and 10 never collide.

### Starter Code

### Test Cases

**Test 1:** Smaller explodes
- Input: "[5,10,-5]"
- Expected: "[5,10]"

**Test 2:** Both explode
- Input: "[8,-8]"
- Expected: "[]"

**Test 3:** Chain collision
- Input: "[10,2,-5]"
- Expected: "[10]"

**Test 4:** No collisions
- Input: "[-2,-1,1,2]"
- Expected: "[-2,-1,1,2]"

**Test 5:** Right mover eliminated
- Input: "[1,-1,-2,-2]"
- Expected: "[-2,-2]"

---

## 17. Shortest Unsorted Continuous Subarray

**Difficulty:** medium
**Concept:** reverse-traversal

### Description

Find the length of the shortest continuous subarray that, if sorted, would result in the entire array being sorted in ascending order.

### Examples

**Example 1:**
- Input: nums = [2,6,4,8,10,9,15]
- Output: 5
- Explanation: Sort [6,4,8,10,9] to make whole array sorted.

### Starter Code

### Test Cases

**Test 1:** Middle section unsorted
- Input: "[2,6,4,8,10,9,15]"
- Expected: "5"

**Test 2:** Already sorted
- Input: "[1,2,3,4]"
- Expected: "0"

**Test 3:** Duplicates in unsorted region
- Input: "[1,3,2,2,2]"
- Expected: "4"

**Test 4:** Unsorted suffix
- Input: "[1,2,4,5,3]"
- Expected: "3"

**Test 5:** Two elements swapped
- Input: "[2,1]"
- Expected: "2"

---

## 18. Trapping Rain Water

**Difficulty:** hard
**Concept:** reverse-traversal
**Additional Concepts:** reverse-traversal, two-pointers

### Description

Given a list of non-negative integers representing an elevation map, compute how many units of water are trapped after raining.

### Examples

**Example 1:**
- Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
- Output: 6
- Explanation: Can trap 6 units of water.

### Starter Code

### Test Cases

**Test 1:** Complex elevation
- Input: "[0,1,0,2,1,0,1,3,2,1,2,1]"
- Expected: "6"

**Test 2:** Valley pattern
- Input: "[4,2,0,3,2,5]"
- Expected: "9"

**Test 3:** Single trapped unit
- Input: "[4,2,3]"
- Expected: "1"

**Test 4:** Single basin
- Input: "[2,0,2]"
- Expected: "2"

**Test 5:** Flat ground
- Input: "[0,0,0]"
- Expected: "0"

---

## 19. Candy

**Difficulty:** hard
**Concept:** reverse-traversal

### Description

Distribute candies to children standing in a line so that each has at least one candy and children with higher ratings than their immediate neighbors receive more candies; return the minimum candies required.

### Examples

**Example 1:**
- Input: ratings = [1,0,2]
- Output: 5
- Explanation: Give candies [2,1,2]

### Starter Code

### Test Cases

**Test 1:** Valley pattern
- Input: "[1,0,2]"
- Expected: "5"

**Test 2:** Plateau
- Input: "[1,2,2]"
- Expected: "4"

**Test 3:** Mixed pattern
- Input: "[1,3,2,2,1]"
- Expected: "7"

**Test 4:** Strictly increasing ratings
- Input: "[1,2,3,4,5]"
- Expected: "15"

**Test 5:** Strictly decreasing ratings
- Input: "[5,4,3,2,1]"
- Expected: "15"

---
