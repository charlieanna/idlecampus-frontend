# BIT-MANIPULATION Problems

Total Problems: 15

---

## 1. Single Number - Master XOR

**Difficulty:** easy
**Concept:** bit-manipulation
**Family:** bit:xor-single

### Description

Given an array where every element appears twice except one, find the single number.

🎯 KEY INSIGHT: XOR Properties
- x ^ x = 0 (number cancels with itself)
- x ^ 0 = x (XOR with 0 is identity)
- All pairs will cancel out, leaving only the single number!

### Examples

**Example 1:**
- Input: nums = [2,2,1]
- Output: 1
- Explanation: 2^2^1 = 0^1 = 1

**Example 2:**
- Input: nums = [4,1,2,1,2]
- Output: 4
- Explanation: 4^1^2^1^2 = 4^(1^1)^(2^2) = 4^0^0 = 4

### Hints

1. What is x ^ x?
2. What is x ^ 0?
3. Try XOR-ing all numbers together
4. Pairs will cancel due to x ^ x = 0
5. XOR is commutative: order doesn't matter

### Starter Code

### Test Cases

**Test 1:** Basic XOR cancellation
- Input: "[2,2,1]"
- Expected: "1"

**Test 2:** Multiple pairs
- Input: "[4,1,2,1,2]"
- Expected: "4"

**Test 3:** Single element
- Input: "[1]"
- Expected: "1"

---

## 2. Number of 1 Bits - Brian Kernighan

**Difficulty:** easy
**Concept:** bit-manipulation
**Family:** bit:count-ones

### Description

Count the number of 1 bits in the binary representation.

🎯 KEY INSIGHT: n & (n-1) removes the rightmost 1 bit!

Example: 11 = 1011
- 11 & 10 = 1011 & 1010 = 1010 (removed rightmost 1)
- 10 & 9  = 1010 & 1001 = 1000 (removed another 1)
- 8 & 7   = 1000 & 0111 = 0000 (removed last 1)
Three operations → 3 bits!

### Examples

**Example 1:**
- Input: n = 11
- Output: 3
- Explanation: 11 = 1011 has three 1 bits

**Example 2:**
- Input: n = 128
- Output: 1
- Explanation: 128 = 10000000 has one 1 bit

### Hints

1. What does n & (n-1) do?
2. Try it: 12 & 11 = 1100 & 1011 = 1000
3. It removes the rightmost 1 bit!
4. Count how many times you can do this
5. Loop while n is not zero

### Starter Code

### Test Cases

**Test 1:** Multiple 1 bits
- Input: "11"
- Expected: "3"

**Test 2:** Single 1 bit
- Input: "128"
- Expected: "1"

**Test 3:** All bits set (8-bit)
- Input: "255"
- Expected: "8"

---

## 3. Power of Two - One-Line Trick

**Difficulty:** easy
**Concept:** bit-manipulation
**Family:** bit:power-of-two

### Description

Check if a number is a power of 2.

🎯 KEY INSIGHT: Power of 2 has exactly ONE bit set!

Powers of 2:
- 1 = 0001
- 2 = 0010
- 4 = 0100
- 8 = 1000

If we do n & (n-1), it removes that single bit → result is 0!

### Examples

**Example 1:**
- Input: n = 1
- Output: True
- Explanation: 1 = 2^0

**Example 2:**
- Input: n = 16
- Output: True
- Explanation: 16 = 2^4 = 10000

**Example 3:**
- Input: n = 3
- Output: False
- Explanation: 3 = 11 (two bits set)

### Hints

1. Power of 2 has only ONE bit set
2. What happens if you do n & (n-1)?
3. It removes the only bit!
4. Result should be 0
5. Don't forget to check n > 0

### Starter Code

### Test Cases

**Test 1:** 2^0
- Input: "1"
- Expected: "True"

**Test 2:** 2^4
- Input: "16"
- Expected: "True"

**Test 3:** Not power of 2
- Input: "3"
- Expected: "False"

---

## 4. Reverse Bits

**Difficulty:** easy
**Concept:** bit-manipulation
**Family:** bit:reverse-bits

### Description

Reverse the bits of a 32-bit unsigned integer.

🎯 APPROACH: Build result bit by bit from right to left.

For each bit in input:
1. Extract rightmost bit: num & 1
2. Add to result: result = (result << 1) | bit
3. Shift input right: num >>= 1

### Examples

**Example 1:**
- Input: n = 43261596 (00000010100101000001111010011100)
- Output: 964176192 (00111001011110000010100101000000)
- Explanation: Bits are reversed

### Hints

1. Build result bit by bit from right to left
2. Use result = (result << 1) | (num & 1)
3. Shift num right after each bit
4. Loop 32 times for 32-bit integer
5. Extract rightmost bit with num & 1

### Starter Code

### Test Cases

**Test 1:** Reverse 32-bit integer
- Input: "43261596"
- Expected: "964176192"

---

## 5. Missing Number

**Difficulty:** easy
**Concept:** bit-manipulation
**Family:** bit:xor-missing

### Description

Find the missing number in array containing n distinct numbers from [0, n].

🎯 XOR SOLUTION: XOR all array elements with all numbers from 0 to n.
Pairs cancel out, leaving the missing number!

### Examples

**Example 1:**
- Input: nums = [3,0,1]
- Output: 2
- Explanation: 0^1^3 ^ 0^1^2^3 = 2

**Example 2:**
- Input: nums = [0,1]
- Output: 2
- Explanation: Missing 2 from range [0,2]

### Hints

1. XOR all array elements
2. XOR with all numbers from 0 to n
3. Pairs cancel out, leaving missing number
4. result = 0; for i in range(n+1): result ^= i
5. Then XOR with all array elements

### Starter Code

### Test Cases

**Test 1:** Missing middle number
- Input: "[3,0,1]"
- Expected: "2"

**Test 2:** Missing last number
- Input: "[0,1]"
- Expected: "2"

**Test 3:** Missing first number
- Input: "[1]"
- Expected: "0"

---

## 6. Hamming Distance

**Difficulty:** easy
**Concept:** bit-manipulation

### Description

Count positions where bits differ between two integers.

🎯 APPROACH: XOR gives 1 where bits differ, then count the 1s!

### Examples

**Example 1:**
- Input: x = 1, y = 4
- Output: 2
- Explanation: 1 = 001, 4 = 100, XOR = 101 (two 1s)

### Hints

1. XOR the two numbers to find differing bits
2. Count number of 1s in XOR result
3. Use Brian Kernighan to count 1s
4. x ^ y gives 1 where bits differ
5. Hamming distance = popcount(x ^ y)

### Starter Code

### Test Cases

**Test 1:** Two bit differences
- Input: "1, 4"
- Expected: "2"

**Test 2:** One bit difference
- Input: "3, 1"
- Expected: "1"

---

## 7. Counting Bits

**Difficulty:** medium
**Concept:** bit-manipulation

### Description

Count number of 1s for every number from 0 to n.

🎯 DP OPTIMIZATION: count[i] = count[i >> 1] + (i & 1)
- i >> 1 removes last bit
- i & 1 checks if last bit is 1
- Build from previous results for O(n) instead of O(n log n)

### Examples

**Example 1:**
- Input: n = 5
- Output: [0,1,1,2,1,2]
- Explanation: 0=0, 1=1, 2=1, 3=2, 4=1, 5=2 (count of 1s)

### Hints

1. Use DP: count[i] = count[i >> 1] + (i & 1)
2. Right shift removes last bit
3. i & 1 checks if last bit is 1
4. Build from previous results
5. O(n) time instead of O(n log n)

### Starter Code

### Test Cases

**Test 1:** Count bits 0 to 5
- Input: "5"
- Expected: "[0, 1, 1, 2, 1, 2]"

**Test 2:** Count bits 0 to 2
- Input: "2"
- Expected: "[0, 1, 1]"

---

## 8. Single Number II

**Difficulty:** medium
**Concept:** bit-manipulation

### Description

Find element appearing once when all others appear 3 times.

🎯 ADVANCED: Count bits at each position modulo 3.
Bits appearing 3 times cancel out!

### Examples

**Example 1:**
- Input: nums = [2,2,3,2]
- Output: 3
- Explanation: 2 appears 3 times, 3 appears once

### Hints

1. Count bits at each position modulo 3
2. Bits appearing 3 times cancel out
3. Track ones and twos variables
4. Use ones = (ones ^ num) & ~twos
5. Use twos = (twos ^ num) & ~ones

### Starter Code

### Test Cases

**Test 1:** Single number with 3x duplicates
- Input: "[2,2,3,2]"
- Expected: "3"

**Test 2:** Larger single number
- Input: "[0,1,0,1,0,1,99]"
- Expected: "99"

---

## 9. Bitwise AND of Numbers Range

**Difficulty:** medium
**Concept:** bit-manipulation

### Description

Find bitwise AND of all numbers in range [left, right].

🎯 KEY INSIGHT: Find common prefix of left and right.
All bits after the prefix differ → AND is 0 for those bits.

### Examples

**Example 1:**
- Input: left = 5, right = 7
- Output: 4
- Explanation: 5 & 6 & 7 = 101 & 110 & 111 = 100 = 4

### Hints

1. Find common prefix of left and right
2. All bits after differ → AND is 0
3. Right shift both until equal
4. Count shifts, then left shift result
5. Or use: while left != right: left &= left-1

### Starter Code

### Test Cases

**Test 1:** Common prefix approach
- Input: "5, 7"
- Expected: "4"

**Test 2:** Same number
- Input: "0, 0"
- Expected: "0"

**Test 3:** Large range
- Input: "1, 2147483647"
- Expected: "0"

---

## 10. Sum of Two Integers

**Difficulty:** medium
**Concept:** bit-manipulation

### Description

Add two integers without using + or - operators.

🎯 BIT ADDITION:
- XOR gives sum without carry: a ^ b
- AND + left shift gives carry: (a & b) << 1
- Repeat until carry is 0

### Examples

**Example 1:**
- Input: a = 1, b = 2
- Output: 3
- Explanation: 1 + 2 = 3 using bit operations

### Hints

1. XOR gives sum without carry
2. AND followed by left shift gives carry
3. Repeat until carry is 0
4. a ^ b = sum without carry
5. (a & b) << 1 = carry

### Starter Code

### Test Cases

**Test 1:** Simple addition
- Input: "1, 2"
- Expected: "3"

**Test 2:** Addition with carry
- Input: "2, 3"
- Expected: "5"

---

## 11. Subsets - Bit Mask

**Difficulty:** medium
**Concept:** bit-manipulation

### Description

Generate all subsets of a set using bit masking.

🎯 BIT MASK PATTERN: Each number 0 to 2^n-1 represents a subset.
Bit i set? Include element i in subset.

### Examples

**Example 1:**
- Input: nums = [1,2,3]
- Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
- Explanation: 8 subsets from 000 to 111 in binary

### Hints

1. Use numbers 0 to 2^n-1 as bit masks
2. For each number, check which bits are set
3. Bit i set? Include nums[i] in subset
4. Check bit with: (mask & (1 << i)) != 0
5. Total subsets = 2^n

### Starter Code

### Test Cases

**Test 1:** Count all subsets
- Input: "[1,2,3]"
- Expected: "8 subsets"

**Test 2:** Single element
- Input: "[0]"
- Expected: "2 subsets"

---

## 12. Single Number III

**Difficulty:** medium
**Concept:** bit-manipulation

### Description

Find two elements appearing once when all others appear twice.

🎯 APPROACH: 
1. XOR all to get xor = a ^ b (the two singles)
2. Find any set bit in xor (rightmost: xor & -xor)
3. Partition array by this bit, XOR each partition

### Examples

**Example 1:**
- Input: nums = [1,2,1,3,2,5]
- Output: [3,5]
- Explanation: 3 and 5 appear once

### Hints

1. XOR all numbers to get a ^ b
2. Find a set bit in result (rightmost: xor & -xor)
3. This bit differs between a and b
4. Partition array by this bit
5. XOR each partition separately

### Starter Code

### Test Cases

**Test 1:** Two single numbers
- Input: "[1,2,1,3,2,5]"
- Expected: "[3, 5] or [5, 3]"

---

## 13. Reverse Integer Bits

**Difficulty:** medium
**Concept:** bit-manipulation

### Description

Reverse an integer's binary representation.

🎯 APPROACH: Extract bits from right, build result from left.

### Examples

**Example 1:**
- Input: x = 123
- Output: Reversed bits of 123
- Explanation: Reverse the binary representation

### Hints

1. Similar to 32-bit reverse
2. Extract each bit from right
3. Build result from left
4. Use result = (result << 1) | (x & 1)
5. Handle 32 iterations

### Starter Code

### Test Cases

**Test 1:** Reverse 123's bits
- Input: "123"
- Expected: "Reversed result"

---

## 14. Maximum XOR of Two Numbers

**Difficulty:** hard
**Concept:** bit-manipulation

### Description

Find maximum XOR of any two numbers in array using Trie.

🎯 TRIE APPROACH:
1. Build binary trie from all numbers
2. For each number, traverse trie greedily
3. Choose opposite bit at each level to maximize XOR

### Examples

**Example 1:**
- Input: nums = [3,10,5,25,2,8]
- Output: 28
- Explanation: 5 XOR 25 = 28 (maximum)

### Hints

1. Build binary trie from all numbers
2. For each number, traverse trie greedily
3. Choose opposite bit at each level
4. Trie node has two children: 0 and 1
5. Greedy choice maximizes XOR

### Starter Code

### Test Cases

**Test 1:** Maximum XOR in array
- Input: "[3,10,5,25,2,8]"
- Expected: "28"

---

## 15. Minimum Flips to Make OR Equal

**Difficulty:** hard
**Concept:** bit-manipulation

### Description

Find minimum bit flips to make a OR b equal to c.

🎯 APPROACH: Check each bit position:
- If c bit is 0: both a and b bits must be 0
- If c bit is 1: at least one of a or b bits must be 1

### Examples

**Example 1:**
- Input: a = 2, b = 6, c = 5
- Output: 3
- Explanation: Need to flip 3 bits

### Hints

1. Check each bit position (32 bits)
2. Extract bits: (n >> i) & 1
3. If c bit is 0: both a,b must be 0
4. If c bit is 1: at least one a,b must be 1
5. Count flips needed at each position

### Starter Code

### Test Cases

**Test 1:** Minimum flips needed
- Input: "2, 6, 5"
- Expected: "3"

**Test 2:** Single flip
- Input: "4, 2, 7"
- Expected: "1"

---
