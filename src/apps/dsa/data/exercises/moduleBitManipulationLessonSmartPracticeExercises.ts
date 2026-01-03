import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module3BitManipulationLessonSmartPracticeExercises: ExerciseSection[] = [
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-single-number',
      title: 'Code: Single Number',
      description: 'Find the single number using XOR bit manipulation.',
      instruction: `# Single Number - Coding Exercise

Given an array where every element appears twice except one, find that single element.

## Examples

**Example 1:**
- Input: \`[2, 2, 1]\`
- Output: \`1\`

**Example 2:**
- Input: \`[4, 1, 2, 1, 2]\`
- Output: \`4\`

## Constraints
- \`1 <= nums.length <= 3 * 10^4\`
- Each element appears twice except one

## Challenge
Solve in O(n) time and O(1) space using XOR!`,
                              starterCode: `def singleNumber(nums):
    
`,
expectedOutput: `def singleNumber(nums):
    result = 0
    for num in nums:
        result ^= num
    return result`,
      hints: [
        {
          afterAttempt: 1,
          question: 'What property of XOR makes it useful for finding unique elements?',
          thinkAbout: [
            'XOR has special properties: a ^ a = 0 and a ^ 0 = a',
            'XORing a number with itself results in 0',
            'XORing with 0 leaves the number unchanged'
          ]
        },
        {
          afterAttempt: 2,
          question: 'How can you use XOR to cancel out duplicates?',
          thinkAbout: [
            'XOR all elements together in a single pass',
            'Pairs of same numbers cancel out (x ^ x = 0)',
            'Only the single unique number remains after all XOR operations'
          ]
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `## XOR Solution - O(n) time, O(1) space

def singleNumber(nums):
    result = 0
    for num in nums:
        result ^= num
    return result

	# XOR properties: a ^ a = 0, a ^ 0 = a
	# Pairs cancel, single number remains!`
	      },
      targetComplexity: {
        time: "O(n)",
        space: "O(1)"
      },
	      testCases: [
              // Basic examples
              {
                      'input': '[2, 2, 1]',
                      'expectedOutput': '1'
              },
              {
                      'input': '[4, 1, 2, 1, 2]',
                      'expectedOutput': '4'
              },
              // B - Boundaries (single element, two elements)
              {
                      'input': '[1]',
                      'expectedOutput': '1'
              },
              {
                      'input': '[0, 1, 0]',
                      'expectedOutput': '1'
              },
              {
                      'input': '[99]',
                      'expectedOutput': '99'
              },
              // E - Empty/Zero values
              {
                      'input': '[0, 0, 1]',
                      'expectedOutput': '1'
              },
              {
                      'input': '[0]',
                      'expectedOutput': '0'
              },
              {
                      'input': '[5, 0, 5]',
                      'expectedOutput': '0'
              },
              // D - Duplicates pattern
              {
                      'input': '[1, 3, 1, 3, 5]',
                      'expectedOutput': '5'
              },
              {
                      'input': '[7, 7, 8, 8, 9]',
                      'expectedOutput': '9'
              },
              // T - Type variations (negatives)
              {
                      'input': '[-1, -1, -2]',
                      'expectedOutput': '-2'
              },
              {
                      'input': '[-5, 3, -5]',
                      'expectedOutput': '3'
              },
              {
                      'input': '[-10, -10, -20, -20, -30]',
                      'expectedOutput': '-30'
              },
              // I - Interesting patterns
              {
                      'input': '[100, 200, 100]',
                      'expectedOutput': '200'
              },
              {
                      'input': '[9, 7, 9]',
                      'expectedOutput': '7'
              },
              // M - Many elements
              {
                      'input': '[1, 2, 3, 4, 3, 2, 1]',
                      'expectedOutput': '4'
              },
              // E - Extremes
              {
                      'input': '[1000000, 1, 1000000]',
                      'expectedOutput': '1'
              },
              {
                      'input': '[999, 998, 997, 998, 997]',
                      'expectedOutput': '999'
              }
      ],
      solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: HashMap Counting
\`\`\`python
def singleNumber(nums):
    count = {}
    for num in nums:
        count[num] = count.get(num, 0) + 1
    for num, c in count.items():
        if c == 1:
            return num
\`\`\`
**Time: O(n)** | **Space: O(n)** - stores all unique numbers

---

### 🟡 Bottleneck Analysis
**What's inefficient?** Using O(n) extra space!

**Key insight:** XOR has magic properties:
- \`a ^ a = 0\` (number XOR itself = 0)
- \`a ^ 0 = a\` (number XOR 0 = number)
- XOR is commutative and associative

---

### 🟢 Optimization: XOR All Numbers
\`\`\`python
def singleNumber(nums):
    result = 0
    for num in nums:
        result ^= num
    return result
\`\`\`

**How it works:** \`[4,1,2,1,2]\`
\`\`\`
0 ^ 4 = 4
4 ^ 1 = 5
5 ^ 2 = 7
7 ^ 1 = 6  (1 cancels out)
6 ^ 2 = 4  (2 cancels out) ✓
\`\`\`

---

### ✅ Final Complexity
- **Time: O(n)** - single pass
- **Space: O(1)** - one variable!

### 🎯 Pattern Learned
**"Find single/unique element"** → XOR all elements (pairs cancel)`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-number-of-1-bits',
      title: 'Code: Number of 1 Bits',
      description: 'Count the number of 1 bits in a number (Hamming Weight).',
      instruction: `# Number of 1 Bits (Hamming Weight) - Coding Exercise

Write a function that takes an unsigned integer and returns the number of '1' bits it has.

## Examples

**Example 1:**
- Input: \`11\` (binary: \`1011\`)
- Output: \`3\`

**Example 2:**
- Input: \`128\` (binary: \`10000000\`)
- Output: \`1\`

**Example 3:**
- Input: \`2147483645\` (binary: \`01111111111111111111111111111101\`)
- Output: \`30\`

## Constraints
- \`0 <= n <= 2^31 - 1\`

## Challenge
Solve using Brian Kernighan's algorithm for optimal performance!`,
                              starterCode: `def hammingWeight(n):
    
`,
expectedOutput: `def hammingWeight(n):
    count = 0
    while n:
        n &= (n - 1)
        count += 1
    return count`,
      hints: [
        {
          afterAttempt: 1,
          question: 'How can you check if a specific bit is set?',
          thinkAbout: [
            'You can check each bit position using (n & (1 << i))',
            'Iterate through positions 0 to 31 for a 32-bit integer',
            'This gives O(32) = O(1) time complexity'
          ]
        },
        {
          afterAttempt: 2,
          question: 'What is a more efficient way using Brian Kernighan\'s algorithm?',
          thinkAbout: [
            'The operation n &= (n - 1) removes the rightmost 1 bit',
            'Count how many times you can apply this before n becomes 0',
            'This runs in O(k) where k is the number of 1 bits'
          ]
        }
      ],
	      solution: {
	        afterAttempt: 3,
	        text: `# Brian Kernighan's Algorithm - O(k) where k is number of 1 bits

def hammingWeight(n):
    count = 0
    while n:
        n &= (n - 1)  # Remove rightmost 1 bit
        count += 1
    return count

# Why n &= (n - 1) removes rightmost 1:
# If n = 1011, n-1 = 1010
# n & (n-1) = 1010 (rightmost 1 removed!)

# Alternative - Check each bit:
# def hammingWeight(n):
#     count = 0
#     for i in range(32):
#         if n & (1 << i):
#             count += 1
#     return count`
	      },
      targetComplexity: {
        time: "O(k)",
        space: "O(1)"
      },
	      testCases: [
              // Basic examples
              {
                      'input': '11',
                      'expectedOutput': '3'
              },
              {
                      'input': '128',
                      'expectedOutput': '1'
              },
              // B - Boundaries (0, 1, max powers of 2)
              {
                      'input': '0',
                      'expectedOutput': '0'
              },
              {
                      'input': '1',
                      'expectedOutput': '1'
              },
              {
                      'input': '2',
                      'expectedOutput': '1'
              },
              {
                      'input': '3',
                      'expectedOutput': '2'
              },
              // E - Edge cases
              {
                      'input': '7',
                      'expectedOutput': '3'
              },
              {
                      'input': '8',
                      'expectedOutput': '1'
              },
              {
                      'input': '15',
                      'expectedOutput': '4'
              },
              {
                      'input': '16',
                      'expectedOutput': '1'
              },
              // D - Dense bit patterns
              {
                      'input': '31',
                      'expectedOutput': '5'
              },
              {
                      'input': '255',
                      'expectedOutput': '8'
              },
              // T - Type variations
              {
                      'input': '1023',
                      'expectedOutput': '10'
              },
              {
                      'input': '1024',
                      'expectedOutput': '1'
              },
              // I - Interesting patterns
              {
                      'input': '170',
                      'expectedOutput': '4'
              },
              {
                      'input': '85',
                      'expectedOutput': '4'
              },
              // M - Medium-large values
              {
                      'input': '65535',
                      'expectedOutput': '16'
              },
              // E - Extremes (large numbers)
              {
                      'input': '2147483647',
                      'expectedOutput': '31'
              },
              {
                      'input': '4294967295',
                      'expectedOutput': '32'
              }
      ],
      solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Check Each Bit
\`\`\`python
def hammingWeight(n):
    count = 0
    while n:
        count += n & 1  # Check last bit
        n >>= 1         # Shift right
    return count
\`\`\`
**Time: O(32)** = O(1) | **Space: O(1)**

Always checks all 32 bits even if most are 0.

---

### 🟡 Optimization Insight
**What if number has few 1-bits?**

**Key insight:** \`n & (n-1)\` removes the rightmost 1-bit!
\`\`\`
n   = 1100  (12)
n-1 = 1011  (11)
n & (n-1) = 1000  (8)  ← Removed rightmost 1!
\`\`\`

---

### 🟢 Optimal: Brian Kernighan's Algorithm
\`\`\`python
def hammingWeight(n):
    count = 0
    while n:
        n &= (n - 1)  # Remove rightmost 1-bit
        count += 1
    return count
\`\`\`
**Time: O(k)** where k = number of 1-bits | **Space: O(1)**

For n=128 (one 1-bit): Only 1 iteration vs 32!

---

### ✅ Final Complexity
- **Time: O(k)** - k = number of set bits (max 32)
- **Space: O(1)** - constant

### 🎯 Pattern Learned
**"Count set bits"** → \`n & (n-1)\` removes rightmost 1-bit`,
	      complexityQuizPlacement: 'after',
	      requiredForProgress: true
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-counting-bits',
      title: 'Code: Counting Bits',
      description: 'Count set bits for all numbers from 0 to n.',
      instruction: `# Counting Bits - Coding Exercise

Given an integer n, return an array \`ans\` of length \`n + 1\` such that for each i in \`[0, n]\`, \`ans[i]\` is the number of 1's in the binary representation of \`i\`.

## Examples

**Example 1:**
- Input: \`n = 5\`
- Output: \`[0, 1, 1, 2, 1, 2]\`
- Explanation:
  - 0 → 0     → 0 ones
  - 1 → 1     → 1 one
  - 2 → 10    → 1 one
  - 3 → 11    → 2 ones
  - 4 → 100   → 1 one
  - 5 → 101   → 2 ones

**Example 2:**
- Input: \`n = 2\`
- Output: \`[0, 1, 1]\`

## Constraints
- \`0 <= n <= 10^5\`

## Challenge
Solve using dynamic programming with bit manipulation tricks!`,
                              starterCode: `def countBits(n):
    
`,
expectedOutput: `def countBits(n):
    ans = [0] * (n + 1)
    for i in range(1, n + 1):
        ans[i] = ans[i >> 1] + (i & 1)
    return ans`,
      hints: [
        {
          afterAttempt: 1,
          question: 'How can you use previously computed results?',
          thinkAbout: [
            'Use dynamic programming to avoid recomputing',
            'Look for a pattern: ans[i] = ans[i >> 1] + (i & 1)',
            'The number of 1s in i relates to the number in i//2'
          ]
        },
        {
          afterAttempt: 2,
          question: 'What does the pattern ans[i] = ans[i >> 1] + (i & 1) mean?',
          thinkAbout: [
            'i >> 1 shifts right, effectively dividing by 2 (removes last bit)',
            'i & 1 checks if the last bit is 1',
            'So: bits in i = bits in (i//2) + (last bit of i)'
          ]
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# DP + Bit Manipulation - O(n) time, O(1) extra space

def countBits(n):
    ans = [0] * (n + 1)
    for i in range(1, n + 1):
        ans[i] = ans[i >> 1] + (i & 1)
    return ans

# Pattern explanation:
# ans[i] = count of 1s in i
# i >> 1 = i // 2 (remove last bit)
# (i & 1) = i % 2 (check last bit)
# So: bits in i = bits in (i//2) + (last bit of i)

# Alternative: ans[i] = ans[i & (i-1)] + 1
def countBits(n):
    ans = [0] * (n + 1)
    for i in range(1, n + 1):
        ans[i] = ans[i & (i - 1)] + 1
    return ans`
      },
      targetComplexity: {
        time: "O(n)",
        space: "O(n)"
      },
      testCases: [
              // Basic examples
              {
                      'input': '5',
                      'expectedOutput': '[0, 1, 1, 2, 1, 2]'
              },
              {
                      'input': '2',
                      'expectedOutput': '[0, 1, 1]'
              },
              // B - Boundaries (0, 1)
              {
                      'input': '0',
                      'expectedOutput': '[0]'
              },
              {
                      'input': '1',
                      'expectedOutput': '[0, 1]'
              },
              // E - Edge cases
              {
                      'input': '3',
                      'expectedOutput': '[0, 1, 1, 2]'
              },
              {
                      'input': '4',
                      'expectedOutput': '[0, 1, 1, 2, 1]'
              },
              // D - Power of 2 boundaries
              {
                      'input': '7',
                      'expectedOutput': '[0, 1, 1, 2, 1, 2, 2, 3]'
              },
              {
                      'input': '8',
                      'expectedOutput': '[0, 1, 1, 2, 1, 2, 2, 3, 1]'
              },
              // T - Transition patterns
              {
                      'input': '10',
                      'expectedOutput': '[0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2]'
              },
              // I - Interesting numbers
              {
                      'input': '15',
                      'expectedOutput': '[0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4]'
              },
              {
                      'input': '16',
                      'expectedOutput': '[0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1]'
              },
              // M - Medium size
              {
                      'input': '20',
                      'expectedOutput': '[0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1, 2, 2, 3, 2]'
              },
              // E - Extremes (larger numbers)
              {
                      'input': '31',
                      'expectedOutput': '[0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5]'
              }
      ],
      solutionExplanation: `## Solution Evolution: Brute Force → DP

### 🔴 Approach 1: Count Each Number Separately
\`\`\`python
def countBits(n):
    result = []
    for i in range(n + 1):
        count = 0
        num = i
        while num:
            num &= (num - 1)
            count += 1
        result.append(count)
    return result
\`\`\`
**Time: O(n × log n)** | **Space: O(1)** extra

---

### 🟡 Bottleneck Analysis
**What's inefficient?** Recounting bits we've already computed!

**Key insight:** \`countBits(i) = countBits(i >> 1) + (i & 1)\`
- Right-shift gives a smaller number we've already computed
- Add 1 if the last bit is set

---

### 🟢 Optimal: DP with Bit Pattern
\`\`\`python
def countBits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp
\`\`\`

**Example:** \`countBits(5)\`
\`\`\`
dp[0] = 0
dp[1] = dp[0] + 1 = 1
dp[2] = dp[1] + 0 = 1
dp[3] = dp[1] + 1 = 2
dp[4] = dp[2] + 0 = 1
dp[5] = dp[2] + 1 = 2
\`\`\`

---

### ✅ Final Complexity
- **Time: O(n)** - single pass
- **Space: O(1)** extra (output doesn't count)

### 🎯 Pattern Learned
**"Compute for all numbers 0..n"** → DP using bit relationships`,
      complexityQuizPlacement: 'after',
      requiredForProgress: true
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-reverse-bits',
      title: 'Code: Reverse Bits',
      description: 'Reverse bits of a 32-bit unsigned integer.',
      instruction: `# Reverse Bits - Coding Exercise

Reverse bits of a given 32-bit unsigned integer.

## Examples

**Example 1:**
- Input: \`n = 00000010100101000001111010011100\` (43261596 in decimal)
- Output: \`964176192\` (00111001011110000010100101000000 in binary)

**Example 2:**
- Input: \`n = 11111111111111111111111111111101\` (4294967293 in decimal)
- Output: \`3221225471\` (10111111111111111111111111111111 in binary)

## Constraints
- The input must be a binary string of length 32

## Challenge
Build the result bit by bit using shifts and OR operations!`,
                              starterCode: `def reverseBits(n):
    
`,
expectedOutput: `def reverseBits(n):
    result = 0
    for i in range(32):
        bit = n & 1
        result = (result << 1) | bit
        n >>= 1
    return result`,
      hints: [
        {
          afterAttempt: 1,
          question: 'How do you extract and reverse bits?',
          thinkAbout: [
            'Extract bits from n from right to left',
            'Build result from left to right',
            'Process all 32 bits'
          ]
        },
        {
          afterAttempt: 2,
          question: 'What bit operations do you need?',
          thinkAbout: [
            'Use bit = n & 1 to get the rightmost bit',
            'Use result << 1 to shift result left',
            'Use n >>= 1 to shift n right for next bit',
            'Combine with: result = (result << 1) | bit'
          ]
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Bit-by-bit Reversal - O(32) = O(1) time, O(1) space

def reverseBits(n):
    result = 0
    for i in range(32):
        # Get rightmost bit of n
        bit = n & 1

        # Shift result left and add bit to the left
        result = (result << 1) | bit

        # Shift n right to process next bit
        n >>= 1

    return result

# Example: n = 5 (101 in 3 bits)
# Iteration 1: bit=1, result=1, n=2
# Iteration 2: bit=0, result=2, n=1
# Iteration 3: bit=1, result=5, n=0
# Final: 101 → 101 (palindrome!)`
      },
      targetComplexity: {
        time: "O(1)",
        space: "O(1)"
      },
      testCases: [
              // Basic examples
              {
                      'input': '43261596',
                      'expectedOutput': '964176192'
              },
              {
                      'input': '4294967293',
                      'expectedOutput': '3221225471'
              },
              // B - Boundaries (0, 1, max)
              {
                      'input': '0',
                      'expectedOutput': '0'
              },
              {
                      'input': '1',
                      'expectedOutput': '2147483648'
              },
              {
                      'input': '2',
                      'expectedOutput': '1073741824'
              },
              // E - Edge cases (powers of 2)
              {
                      'input': '4',
                      'expectedOutput': '536870912'
              },
              {
                      'input': '8',
                      'expectedOutput': '268435456'
              },
              {
                      'input': '16',
                      'expectedOutput': '134217728'
              },
              // D - Dense bit patterns
              {
                      'input': '3',
                      'expectedOutput': '3221225472'
              },
              {
                      'input': '7',
                      'expectedOutput': '3758096384'
              },
              {
                      'input': '15',
                      'expectedOutput': '4026531840'
              },
              // T - Type patterns
              {
                      'input': '128',
                      'expectedOutput': '16777216'
              },
              {
                      'input': '255',
                      'expectedOutput': '4278190080'
              },
              // I - Interesting patterns
              {
                      'input': '170',
                      'expectedOutput': '1426063360'
              },
              {
                      'input': '85',
                      'expectedOutput': '2852126720'
              },
              // M - Medium values
              {
                      'input': '65535',
                      'expectedOutput': '4294901760'
              },
              // E - Extremes
              {
                      'input': '2147483648',
                      'expectedOutput': '1'
              },
              {
                      'input': '4294967295',
                      'expectedOutput': '4294967295'
              }
      ],
      solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: String Conversion
\`\`\`python
def reverseBits(n):
    # Convert to binary string, reverse it, convert back
    binary = bin(n)[2:]  # Remove '0b' prefix
    binary = binary.zfill(32)  # Pad to 32 bits
    reversed_binary = binary[::-1]
    return int(reversed_binary, 2)
\`\`\`
**Time: O(32) = O(1)** | **Space: O(32) = O(1)**

String operations add overhead!

---

### 🟡 Bottleneck Analysis
**What's inefficient?** String conversion and reversal is unnecessarily complex.

**Key insight:** We can reverse bits directly using bit operations:
- Extract each bit from right to left
- Build result from left to right
- Use shifts and OR operations

---

### 🟢 Optimal: Bit-by-Bit Reversal
\`\`\`python
def reverseBits(n):
    result = 0
    for i in range(32):
        bit = n & 1        # Extract rightmost bit
        result = (result << 1) | bit  # Add to result
        n >>= 1            # Move to next bit
    return result
\`\`\`

**Example:** Reversing \`1011\` (11 in decimal)
\`\`\`
i=0: bit=1, result=1, n=101
i=1: bit=1, result=11, n=10
i=2: bit=0, result=110, n=1
i=3: bit=1, result=1101, n=0
Result: 1101 (reversed!)
\`\`\`

---

### ✅ Final Complexity
- **Time: O(32) = O(1)** - fixed 32 iterations
- **Space: O(1)** - constant variables

### 🎯 Pattern Learned
**"Reverse bits"** → Extract from right, build from left using shifts`,
      complexityQuizPlacement: 'after',
      requiredForProgress: true
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-missing-number',
      title: 'Code: Missing Number',
      description: 'Find the missing number in array of 0 to n.',
      instruction: `# Missing Number - Coding Exercise

Given an array \`nums\` containing n distinct numbers taken from the range [0, n], return the only number in the range that is missing from the array.

## Examples

**Example 1:**
- Input: \`nums = [3, 0, 1]\`
- Output: \`2\`
- Explanation: n = 3 since there are 3 nums, so all numbers are in the range [0, 3]. 2 is the missing number.

**Example 2:**
- Input: \`nums = [0, 1]\`
- Output: \`2\`

**Example 3:**
- Input: \`nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]\`
- Output: \`8\`

## Constraints
- \`n == nums.length\`
- \`1 <= n <= 10^4\`
- \`0 <= nums[i] <= n\`

## Challenge
Try solving with XOR - it's elegant and uses O(1) space!`,
                              starterCode: `def missingNumber(nums):
    
`,
expectedOutput: `def missingNumber(nums):
    xor = len(nums)
    for i in range(len(nums)):
        xor ^= i ^ nums[i]
    return xor`,
      hints: [
        {
          afterAttempt: 1,
          question: 'What mathematical property can help find the missing number?',
          thinkAbout: [
            'You can use the sum formula: expected = n*(n+1)/2',
            'Calculate the actual sum of array elements',
            'The difference is the missing number'
          ]
        },
        {
          afterAttempt: 2,
          question: 'Can you use XOR to solve this in O(1) space?',
          thinkAbout: [
            'Start with XOR of n (the length)',
            'XOR all indices from 0 to n-1',
            'XOR all array values',
            'Duplicates cancel out, only missing number remains'
          ]
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# XOR Approach - O(n) time, O(1) space

def missingNumber(nums):
    xor = len(nums)
    for i in range(len(nums)):
        xor ^= i ^ nums[i]
    return xor

# Why it works: XOR all 0..n, then XOR with array
# Present numbers cancel out (a ^ a = 0)
# Only missing number remains!

# Alternative - Sum approach:
def missingNumber(nums):
    n = len(nums)
    expected = n * (n + 1) // 2
    actual = sum(nums)
    return expected - actual`
      },
      targetComplexity: {
        time: "O(n)",
        space: "O(1)"
      },
      testCases: [
              // Basic examples
              {
                      'input': '[3, 0, 1]',
                      'expectedOutput': '2'
              },
              {
                      'input': '[0, 1]',
                      'expectedOutput': '2'
              },
              {
                      'input': '[9, 6, 4, 2, 3, 5, 7, 0, 1]',
                      'expectedOutput': '8'
              },
              // B - Boundaries (first, last missing)
              {
                      'input': '[1]',
                      'expectedOutput': '0'
              },
              {
                      'input': '[0]',
                      'expectedOutput': '1'
              },
              {
                      'input': '[1, 2]',
                      'expectedOutput': '0'
              },
              {
                      'input': '[0, 2]',
                      'expectedOutput': '1'
              },
              {
                      'input': '[0, 1]',
                      'expectedOutput': '2'
              },
              // E - Edge cases
              {
                      'input': '[2, 0]',
                      'expectedOutput': '1'
              },
              {
                      'input': '[1, 0, 3]',
                      'expectedOutput': '2'
              },
              // D - Different missing positions
              {
                      'input': '[0, 1, 2, 3, 5]',
                      'expectedOutput': '4'
              },
              {
                      'input': '[1, 2, 3, 4, 5]',
                      'expectedOutput': '0'
              },
              {
                      'input': '[0, 1, 2, 3, 4]',
                      'expectedOutput': '5'
              },
              // T - Type variations
              {
                      'input': '[0, 2, 3, 4, 5, 6, 7, 8, 9]',
                      'expectedOutput': '1'
              },
              // I - Interesting patterns
              {
                      'input': '[3, 0, 1, 4]',
                      'expectedOutput': '2'
              },
              {
                      'input': '[4, 0, 3, 1]',
                      'expectedOutput': '2'
              },
              // M - Medium size
              {
                      'input': '[0, 1, 2, 3, 4, 5, 6, 8, 9, 10]',
                      'expectedOutput': '7'
              },
              // E - Extremes
              {
                      'input': '[5, 0, 2, 1, 3]',
                      'expectedOutput': '4'
              }
      ],
      solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: HashSet for Lookup
\`\`\`python
def missingNumber(nums):
    num_set = set(nums)
    for i in range(len(nums) + 1):
        if i not in num_set:
            return i
\`\`\`
**Time: O(n)** | **Space: O(n)** - stores all numbers

---

### 🟡 Approach 2: Math Formula (Better!)
\`\`\`python
def missingNumber(nums):
    n = len(nums)
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(nums)
    return expected_sum - actual_sum
\`\`\`
**Time: O(n)** | **Space: O(1)**

Uses Gauss formula: 0+1+2+...+n = n(n+1)/2

**Potential issue:** Integer overflow for very large n (not in Python, but in other languages)

---

### 🟢 Optimal: XOR Magic
\`\`\`python
def missingNumber(nums):
    xor = len(nums)
    for i in range(len(nums)):
        xor ^= i ^ nums[i]
    return xor
\`\`\`

**How it works:** XOR all indices 0..n-1 with all array values
\`\`\`
nums = [3,0,1], n=3
xor = 3
xor ^= 0 ^ 3 = 3
xor ^= 1 ^ 0 = 2
xor ^= 2 ^ 1 = 1
Present numbers cancel, missing=2 remains!
\`\`\`

**Why XOR?**
- \`a ^ a = 0\` (duplicate cancels)
- \`a ^ 0 = a\` (identity)
- No overflow issues
- Same time, same space as sum approach

---

### ✅ Final Complexity
- **Time: O(n)** - single pass
- **Space: O(1)** - one variable

### 🎯 Pattern Learned
**"Find missing in range"** → XOR indices with values (pairs cancel)`,
      complexityQuizPlacement: 'after',
      requiredForProgress: true
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-sum-of-two-integers',
      title: 'Code: Sum of Two Integers',
      description: 'Add two integers without using + or - operator.',
      instruction: `# Sum of Two Integers - Coding Exercise

Given two integers \`a\` and \`b\`, return their sum WITHOUT using the + or - operators.

## Examples

**Example 1:**
- Input: \`a = 1, b = 2\`
- Output: \`3\`

**Example 2:**
- Input: \`a = 4, b = 5\`
- Output: \`9\`

**Example 3:**
- Input: \`a = -1, b = 1\`
- Output: \`0\`

## Constraints
- \`-2^31 <= a, b <= 2^31 - 1\`

## Challenge
Use bit manipulation: XOR for sum, AND for carry!`,
                              starterCode: `def getSum(a, b):
    
`,
expectedOutput: `def getSum(a, b):
    mask = 0xFFFFFFFF
    while b != 0:
        carry = ((a & b) << 1) & mask
        a = (a ^ b) & mask
        b = carry
    return a if a <= 0x7FFFFFFF else ~(a ^ mask)`,
      hints: [
        {
          afterAttempt: 1,
          question: 'How do XOR and AND operations help with addition?',
          thinkAbout: [
            'XOR gives sum without carry (a ^ b)',
            'AND gives positions where carry occurs (a & b)',
            'Shift carry left by 1: (a & b) << 1'
          ]
        },
        {
          afterAttempt: 2,
          question: 'How do you handle the carry iteratively?',
          thinkAbout: [
            'While carry is not 0, keep adding',
            'Update: a = a ^ b (sum without carry)',
            'Update: b = (a & b) << 1 (new carry)',
            'Repeat until no carry remains'
          ]
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Bit Manipulation - XOR + Carry - O(log(max(a,b))) time

def getSum(a, b):
    # Mask for 32-bit integer
    mask = 0xFFFFFFFF

    while b != 0:
        # Calculate carry
        carry = ((a & b) << 1) & mask

        # XOR gives sum without carry
        a = (a ^ b) & mask

        # Set b to carry for next iteration
        b = carry

    # Handle negative numbers in Python
    return a if a <= 0x7FFFFFFF else ~(a ^ mask)

# Example: 5 + 3
# 5 = 0101, 3 = 0011
# sum = 0101 ^ 0011 = 0110 (6, but should be 8!)
# carry = (0101 & 0011) << 1 = 0001 << 1 = 0010
# Next iteration:
# sum = 0110 ^ 0010 = 0100
# carry = (0110 & 0010) << 1 = 0010 << 1 = 0100
# Continue until carry = 0...`
      },
      targetComplexity: {
        time: "O(n)",
        space: "O(1)"
      },
      testCases: [
              // Basic examples
              {
                      'input': '1, 2',
                      'expectedOutput': '3'
              },
              {
                      'input': '4, 5',
                      'expectedOutput': '9'
              },
              // B - Boundaries (0, 1)
              {
                      'input': '0, 0',
                      'expectedOutput': '0'
              },
              {
                      'input': '0, 1',
                      'expectedOutput': '1'
              },
              {
                      'input': '1, 0',
                      'expectedOutput': '1'
              },
              {
                      'input': '1, 1',
                      'expectedOutput': '2'
              },
              // E - Edge cases with zero
              {
                      'input': '5, 0',
                      'expectedOutput': '5'
              },
              {
                      'input': '0, 10',
                      'expectedOutput': '10'
              },
              // D - Doubling (same numbers)
              {
                      'input': '7, 7',
                      'expectedOutput': '14'
              },
              {
                      'input': '10, 10',
                      'expectedOutput': '20'
              },
              // T - Type variations (negatives)
              {
                      'input': '-1, 1',
                      'expectedOutput': '0'
              },
              {
                      'input': '-2, 3',
                      'expectedOutput': '1'
              },
              {
                      'input': '-5, -3',
                      'expectedOutput': '-8'
              },
              // I - Interesting patterns
              {
                      'input': '2, 3',
                      'expectedOutput': '5'
              },
              {
                      'input': '10, 20',
                      'expectedOutput': '30'
              },
              // M - Medium values
              {
                      'input': '100, 200',
                      'expectedOutput': '300'
              },
              // E - Extremes
              {
                      'input': '1000, -1000',
                      'expectedOutput': '0'
              },
              {
                      'input': '-10, -20',
                      'expectedOutput': '-30'
              }
      ],
      solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Recursive Addition
\`\`\`python
def getSum(a, b):
    if b == 0:
        return a
    # Sum without carry + carry
    return getSum(a ^ b, (a & b) << 1)
\`\`\`
**Time: O(log max(a,b))** | **Space: O(log max(a,b))** - recursion stack

Works but uses stack space!

---

### 🟡 Bottleneck Analysis
**What's inefficient?** Recursion adds unnecessary overhead.

**Key insights:**
1. **XOR (^)** gives sum WITHOUT carry: \`5 ^ 3 = 0101 ^ 0011 = 0110\`
2. **AND (&)** finds where carry occurs: \`5 & 3 = 0101 & 0011 = 0001\`
3. **Shift left** to carry: \`(5 & 3) << 1 = 0010\`
4. Repeat until no carry remains!

---

### 🟢 Optimal: Iterative Bit Manipulation
\`\`\`python
def getSum(a, b):
    mask = 0xFFFFFFFF  # 32-bit mask for Python
    while b != 0:
        carry = ((a & b) << 1) & mask
        a = (a ^ b) & mask
        b = carry
    # Handle negative numbers in Python
    return a if a <= 0x7FFFFFFF else ~(a ^ mask)
\`\`\`

**Example:** 5 + 3
\`\`\`
Iteration 1:
  a = 0101, b = 0011
  carry = (0101 & 0011) << 1 = 0001 << 1 = 0010
  a = 0101 ^ 0011 = 0110
  b = 0010

Iteration 2:
  a = 0110, b = 0010
  carry = (0110 & 0010) << 1 = 0010 << 1 = 0100
  a = 0110 ^ 0010 = 0100
  b = 0100

Iteration 3:
  a = 0100, b = 0100
  carry = (0100 & 0100) << 1 = 0100 << 1 = 1000
  a = 0100 ^ 0100 = 0000
  b = 1000

Iteration 4:
  a = 0000, b = 1000
  carry = (0000 & 1000) << 1 = 0
  a = 0000 ^ 1000 = 1000
  b = 0 → DONE!

Result: 1000 = 8 ✓
\`\`\`

---

### ✅ Final Complexity
- **Time: O(1)** - max 32 iterations for 32-bit integers
- **Space: O(1)** - constant variables

### 🎯 Pattern Learned
**"Add without +"** → XOR for sum, AND+shift for carry, iterate until carry=0`,
      complexityQuizPlacement: 'after',
      requiredForProgress: true
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-happy-number',
      title: 'Code: Happy Number',
      description: 'Determine if a number is happy using cycle detection.',
      instruction: `# Happy Number - Coding Exercise

Write an algorithm to determine if a number \`n\` is happy.

A **happy number** is a number defined by the following process:
1. Start with any positive integer
2. Replace the number by the sum of the squares of its digits
3. Repeat the process until the number equals 1 (happy) or it loops endlessly in a cycle which does not include 1 (unhappy)

## Examples

**Example 1:**
- Input: \`n = 19\`
- Output: \`True\`
- Explanation:
  - 1² + 9² = 82
  - 8² + 2² = 68
  - 6² + 8² = 100
  - 1² + 0² + 0² = 1

**Example 2:**
- Input: \`n = 2\`
- Output: \`False\`

## Constraints
- \`1 <= n <= 2^31 - 1\`

## Challenge
Use a set to detect cycles!`,
                              starterCode: `def isHappy(n):
    
`,
expectedOutput: `def isHappy(n):
    def getSumOfSquares(num):
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total

    seen = set()
    while n != 1 and n not in seen:
        seen.add(n)
        n = getSumOfSquares(n)

    return n == 1`,
      hints: [
        {
          afterAttempt: 1,
          question: 'What helper function do you need?',
          thinkAbout: [
            'Create a function to get sum of squares of digits',
            'Extract each digit with num % 10',
            'Square it and add to total',
            'Divide num by 10 to process next digit'
          ]
        },
        {
          afterAttempt: 2,
          question: 'How do you detect if the process loops forever?',
          thinkAbout: [
            'Keep track of seen numbers in a set',
            'If you see a number twice, there\'s a cycle (unhappy)',
            'If you reach 1, it\'s happy',
            'Alternative: use Floyd\'s cycle detection with slow/fast pointers'
          ]
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Cycle Detection with Set - O(log n) per iteration

def isHappy(n):
    def getSumOfSquares(num):
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total

    seen = set()
    while n != 1 and n not in seen:
        seen.add(n)
        n = getSumOfSquares(n)

    return n == 1

# Alternative - Two pointer (Floyd's cycle detection):
def isHappy(n):
    def getSumOfSquares(num):
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total

    slow = n
    fast = getSumOfSquares(n)

    while fast != 1 and slow != fast:
        slow = getSumOfSquares(slow)
        fast = getSumOfSquares(getSumOfSquares(fast))

    return fast == 1`
      },
      targetComplexity: {
        time: "O(n)",
        space: "O(1)"
      },
      testCases: [
              // Basic examples
              {
                      'input': '19',
                      'expectedOutput': 'True'
              },
              {
                      'input': '2',
                      'expectedOutput': 'False'
              },
              // B - Boundaries (1, small numbers)
              {
                      'input': '1',
                      'expectedOutput': 'True'
              },
              {
                      'input': '7',
                      'expectedOutput': 'True'
              },
              {
                      'input': '10',
                      'expectedOutput': 'True'
              },
              // E - Edge cases
              {
                      'input': '3',
                      'expectedOutput': 'False'
              },
              {
                      'input': '4',
                      'expectedOutput': 'False'
              },
              {
                      'input': '5',
                      'expectedOutput': 'False'
              },
              // D - Different happy numbers
              {
                      'input': '13',
                      'expectedOutput': 'True'
              },
              {
                      'input': '23',
                      'expectedOutput': 'True'
              },
              {
                      'input': '28',
                      'expectedOutput': 'True'
              },
              // T - Types (unhappy cycles)
              {
                      'input': '20',
                      'expectedOutput': 'False'
              },
              {
                      'input': '21',
                      'expectedOutput': 'False'
              },
              // I - Interesting patterns
              {
                      'input': '100',
                      'expectedOutput': 'True'
              },
              {
                      'input': '68',
                      'expectedOutput': 'True'
              },
              {
                      'input': '82',
                      'expectedOutput': 'True'
              },
              // M - Medium values
              {
                      'input': '44',
                      'expectedOutput': 'True'
              },
              // E - Extremes
              {
                      'input': '111',
                      'expectedOutput': 'False'
              },
              {
                      'input': '1000',
                      'expectedOutput': 'True'
              }
      ],
      solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: HashSet for Cycle Detection
\`\`\`python
def isHappy(n):
    def getSumOfSquares(num):
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total

    seen = set()
    while n != 1 and n not in seen:
        seen.add(n)
        n = getSumOfSquares(n)

    return n == 1
\`\`\`
**Time: O(log n)** per iteration | **Space: O(k)** - k numbers in cycle

Uses extra space for set!

---

### 🟡 Bottleneck Analysis
**What's inefficient?** HashSet uses O(k) space where k can be large.

**Key insight:** Cycle detection = linked list cycle problem!
- Use Floyd's Tortoise and Hare algorithm
- Slow pointer moves 1 step, fast moves 2 steps
- If they meet (and not at 1), there's a cycle
- No extra space needed!

---

### 🟢 Optimal: Floyd's Cycle Detection
\`\`\`python
def isHappy(n):
    def getSumOfSquares(num):
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total

    slow = n
    fast = getSumOfSquares(n)

    while fast != 1 and slow != fast:
        slow = getSumOfSquares(slow)
        fast = getSumOfSquares(getSumOfSquares(fast))

    return fast == 1
\`\`\`

**Example:** n = 19 (happy)
\`\`\`
slow = 19, fast = 82
slow = 82, fast = 100
slow = 68, fast = 1 → Happy!
\`\`\`

**Example:** n = 2 (unhappy)
\`\`\`
slow = 2, fast = 16
slow = 4, fast = 37
slow = 16, fast = 58
...eventually slow == fast (cycle detected)
\`\`\`

---

### ✅ Final Complexity
- **Time: O(log n)** - bounded by cycle length
- **Space: O(1)** - two pointers only!

### 🎯 Pattern Learned
**"Detect cycles"** → Floyd's algorithm (slow/fast pointers) for O(1) space`,
      complexityQuizPlacement: 'after',
      requiredForProgress: true
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-powx-n',
      title: 'Code: Pow(x, n)',
      description: 'Implement power function using fast exponentiation.',
      instruction: `# Pow(x, n) - Coding Exercise

Implement pow(x, n), which calculates x raised to the power n (i.e., x^n).

## Examples

**Example 1:**
- Input: \`x = 2.00, n = 10\`
- Output: \`1024.00\`

**Example 2:**
- Input: \`x = 2.10, n = 3\`
- Output: \`9.261\`

**Example 3:**
- Input: \`x = 2.00, n = -2\`
- Output: \`0.25\`
- Explanation: 2^(-2) = 1/(2^2) = 1/4 = 0.25

## Constraints
- \`-100.0 < x < 100.0\`
- \`-2^31 <= n <= 2^31 - 1\`
- \`-10^4 <= x^n <= 10^4\`

## Challenge
Use fast exponentiation to achieve O(log n) time!`,
                              starterCode: `def myPow(x, n):
    
`,
expectedOutput: `def myPow(x, n):
    if n < 0:
        x = 1 / x
        n = -n

    result = 1
    while n > 0:
        if n % 2 == 1:
            result *= x
        x *= x
        n //= 2

    return result`,
      hints: [
        {
          afterAttempt: 1,
          question: 'What\'s wrong with multiplying x by itself n times?',
          thinkAbout: [
            'Naive approach would be O(n) time',
            'For large n, this is too slow',
            'There must be a logarithmic solution'
          ]
        },
        {
          afterAttempt: 2,
          question: 'How does fast exponentiation work?',
          thinkAbout: [
            'Key insight: x^n = (x^2)^(n/2)',
            'If n is odd, multiply result by x once more',
            'Keep squaring x and halving n',
            'This runs in O(log n) time'
          ]
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Fast Exponentiation - O(log n) time, O(1) space

def myPow(x, n):
    if n < 0:
        x = 1 / x
        n = -n

    result = 1
    while n > 0:
        if n % 2 == 1:  # If n is odd
            result *= x
        x *= x      # Square x
        n //= 2     # Halve n

    return result

# Example: 2^10
# n=10 (even): result=1, x=4, n=5
# n=5 (odd): result=4, x=16, n=2
# n=2 (even): result=4, x=256, n=1
# n=1 (odd): result=1024, x=65536, n=0
# return 1024

# Binary representation of n guides the calculation!
# 10 in binary is 1010
# 2^10 = 2^8 * 2^2`
      },
      targetComplexity: {
        time: "O(n)",
        space: "O(1)"
      },
      testCases: [
              // Basic examples
              {
                      'input': '2.0, 10',
                      'expectedOutput': '1024.0'
              },
              {
                      'input': '2.1, 3',
                      'expectedOutput': '9.261'
              },
              {
                      'input': '2.0, -2',
                      'expectedOutput': '0.25'
              },
              // B - Boundaries (0, 1)
              {
                      'input': '2.0, 0',
                      'expectedOutput': '1.0'
              },
              {
                      'input': '2.0, 1',
                      'expectedOutput': '2.0'
              },
              {
                      'input': '1.0, 100',
                      'expectedOutput': '1.0'
              },
              {
                      'input': '0.0, 5',
                      'expectedOutput': '0.0'
              },
              // E - Edge cases
              {
                      'input': '5.0, 2',
                      'expectedOutput': '25.0'
              },
              {
                      'input': '3.0, 3',
                      'expectedOutput': '27.0'
              },
              // D - Different bases
              {
                      'input': '10.0, 3',
                      'expectedOutput': '1000.0'
              },
              {
                      'input': '0.5, 2',
                      'expectedOutput': '0.25'
              },
              // T - Type variations (negatives)
              {
                      'input': '-2.0, 3',
                      'expectedOutput': '-8.0'
              },
              {
                      'input': '-2.0, 2',
                      'expectedOutput': '4.0'
              },
              {
                      'input': '2.0, -1',
                      'expectedOutput': '0.5'
              },
              // I - Interesting patterns
              {
                      'input': '1.5, 4',
                      'expectedOutput': '5.0625'
              },
              {
                      'input': '4.0, -1',
                      'expectedOutput': '0.25'
              },
              // M - Medium powers
              {
                      'input': '2.0, 20',
                      'expectedOutput': '1048576.0'
              },
              // E - Extremes
              {
                      'input': '0.00001, 2',
                      'expectedOutput': '1e-10'
              }
      ],
      solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Naive Multiplication
\`\`\`python
def myPow(x, n):
    if n < 0:
        x = 1 / x
        n = -n

    result = 1
    for _ in range(n):
        result *= x
    return result
\`\`\`
**Time: O(n)** | **Space: O(1)**

Way too slow for large n! (e.g., n = 2^31)

---

### 🟡 Bottleneck Analysis
**What's inefficient?** Multiplying n times is unnecessarily slow!

**Key insight:** Use binary representation of exponent!
- \`x^10 = x^(1010₂) = x^8 × x^2\`
- Square x repeatedly: x → x² → x⁴ → x⁸ → ...
- Multiply result by current power when bit is set
- This is **fast exponentiation** (or exponentiation by squaring)

---

### 🟢 Optimal: Fast Exponentiation
\`\`\`python
def myPow(x, n):
    if n < 0:
        x = 1 / x
        n = -n

    result = 1
    while n > 0:
        if n & 1:       # If n is odd (last bit = 1)
            result *= x
        x *= x          # Square x
        n >>= 1         # Divide n by 2

    return result
\`\`\`

**Example:** 2^10
\`\`\`
n=10 (1010₂):
  n&1=0: result=1, x=4, n=5
  n&1=1: result=4, x=16, n=2
  n&1=0: result=4, x=256, n=1
  n&1=1: result=1024, x=65536, n=0
Result: 1024 ✓
\`\`\`

**Binary breakdown:**
\`\`\`
10 in binary = 1010
2^10 = 2^(8+2) = 2^8 × 2^2
     = 256 × 4 = 1024
\`\`\`

---

### ✅ Final Complexity
- **Time: O(log n)** - divide n by 2 each iteration
- **Space: O(1)** - constant variables

### 🎯 Pattern Learned
**"Exponentiation"** → Fast exponentiation using binary representation (O(log n))`,
      complexityQuizPlacement: 'after',
      requiredForProgress: true
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-factorial-trailing-zeroes',
      title: 'Code: Factorial Trailing Zeroes',
      description: 'Count trailing zeros in n factorial.',
      instruction: `# Factorial Trailing Zeroes - Coding Exercise

Given an integer n, return the number of trailing zeroes in n!.

A **trailing zero** is produced by factors of 10 = 2 × 5. Since there are always more factors of 2 than 5 in n!, we only need to count factors of 5.

## Examples

**Example 1:**
- Input: \`n = 5\`
- Output: \`1\`
- Explanation: 5! = 120, one trailing zero

**Example 2:**
- Input: \`n = 0\`
- Output: \`0\`

**Example 3:**
- Input: \`n = 25\`
- Output: \`6\`
- Explanation: 25! has 6 trailing zeros

## Constraints
- \`0 <= n <= 10^4\`

## Challenge
Count multiples of 5, 25, 125, etc. in n!`,
                              starterCode: `def trailingZeroes(n):
    
`,
expectedOutput: `def trailingZeroes(n):
    count = 0
    while n >= 5:
        n //= 5
        count += n
    return count`,
      hints: [
        {
          afterAttempt: 1,
          question: 'What creates trailing zeros in factorials?',
          thinkAbout: [
            'Trailing zeros come from factors of 10 = 2 × 5',
            'Count how many pairs of 2 and 5 exist',
            'There are always more 2s than 5s, so count 5s only'
          ]
        },
        {
          afterAttempt: 2,
          question: 'How do you count all factors of 5 in n!?',
          thinkAbout: [
            'n/5 counts multiples of 5 (contribute one 5 each)',
            'n/25 counts multiples of 25 (contribute extra 5)',
            'n/125 counts multiples of 125 (contribute another 5)',
            'Sum: n//5 + n//25 + n//125 + ...'
          ]
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Count Factors of 5 - O(log n) time

def trailingZeroes(n):
    count = 0
    while n >= 5:
        n //= 5
        count += n
    return count

# Example: n = 25
# 25 // 5 = 5, count = 5 (multiples: 5, 10, 15, 20, 25)
# 5 // 5 = 1, count += 1 = 6 (25 has two factors of 5!)
# 1 // 5 = 0, done

# Breakdown for 25!:
# Multiples of 5: 5, 10, 15, 20, 25 → 5 factors
# But 25 = 5*5, so it contributes 2 factors → +1
# Total = 6 factors of 5`
      },
      targetComplexity: {
        time: "O(log n)",
        space: "O(1)"
      },
      testCases: [
              // Basic examples
              {
                      'input': '5',
                      'expectedOutput': '1'
              },
              {
                      'input': '0',
                      'expectedOutput': '0'
              },
              {
                      'input': '25',
                      'expectedOutput': '6'
              },
              // B - Boundaries (small numbers)
              {
                      'input': '1',
                      'expectedOutput': '0'
              },
              {
                      'input': '2',
                      'expectedOutput': '0'
              },
              {
                      'input': '3',
                      'expectedOutput': '0'
              },
              {
                      'input': '4',
                      'expectedOutput': '0'
              },
              // E - Edge cases (around multiples of 5)
              {
                      'input': '10',
                      'expectedOutput': '2'
              },
              {
                      'input': '15',
                      'expectedOutput': '3'
              },
              {
                      'input': '20',
                      'expectedOutput': '4'
              },
              // D - Different patterns
              {
                      'input': '30',
                      'expectedOutput': '7'
              },
              {
                      'input': '50',
                      'expectedOutput': '12'
              },
              // T - Type variations
              {
                      'input': '100',
                      'expectedOutput': '24'
              },
              {
                      'input': '125',
                      'expectedOutput': '31'
              },
              // I - Interesting patterns
              {
                      'input': '24',
                      'expectedOutput': '4'
              },
              {
                      'input': '26',
                      'expectedOutput': '6'
              },
              // M - Medium values
              {
                      'input': '200',
                      'expectedOutput': '49'
              },
              // E - Extremes
              {
                      'input': '1000',
                      'expectedOutput': '249'
              },
              {
                      'input': '625',
                      'expectedOutput': '156'
              }
      ],
      solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Calculate Factorial Then Count
\`\`\`python
def trailingZeroes(n):
    # Calculate n! then count trailing zeros
    factorial = 1
    for i in range(1, n + 1):
        factorial *= i

    count = 0
    while factorial % 10 == 0:
        count += 1
        factorial //= 10
    return count
\`\`\`
**Time: O(n)** | **Space: O(1)**

**Problem:** Factorial grows HUGE! 25! has 26 digits, overflows instantly!

---

### 🟡 Bottleneck Analysis
**What's inefficient?** Computing factorial is impossible for large n!

**Key insight:** Trailing zeros come from factors of 10 = 2 × 5
- Count pairs of (2, 5) in n!
- Always more 2s than 5s (every even number has a 2)
- **Just count factors of 5!**

---

### 🟢 Optimal: Count Factors of 5
\`\`\`python
def trailingZeroes(n):
    count = 0
    while n >= 5:
        n //= 5
        count += n
    return count
\`\`\`

**Why it works:**
\`\`\`
n = 25
25 ÷ 5 = 5  → 5 multiples of 5: (5,10,15,20,25)
5 ÷ 5 = 1   → 1 multiple of 25: (25 = 5×5)
1 ÷ 5 = 0   → done
Total = 5 + 1 = 6 factors of 5 ✓
\`\`\`

**Breakdown for 25!:**
- Multiples of 5¹: 5, 10, 15, 20, 25 → **5 factors**
- Multiples of 5²: 25 → **+1 factor** (25 has two 5s!)
- Total: **6 trailing zeros**

**For n=100:**
- 100÷5 = 20 (multiples of 5)
- 20÷5 = 4 (multiples of 25)
- 4÷5 = 0
- Total = 20+4 = 24 zeros

---

### ✅ Final Complexity
- **Time: O(log₅ n)** - divide by 5 each iteration
- **Space: O(1)** - constant variables

### 🎯 Pattern Learned
**"Count trailing zeros in factorial"** → Count factors of 5 (divide by 5, 25, 125, ...)`,
      complexityQuizPlacement: 'after',
      requiredForProgress: true
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-excel-sheet-column-number',
      title: 'Code: Excel Sheet Column Number',
      description: 'Convert Excel column title to column number.',
      instruction: `# Excel Sheet Column Number - Coding Exercise

Given a string \`columnTitle\` that represents the column title as appears in an Excel sheet, return its corresponding column number.

The correspondence is:
- A → 1
- B → 2
- ...
- Z → 26
- AA → 27
- AB → 28
- ...

## Examples

**Example 1:**
- Input: \`columnTitle = "A"\`
- Output: \`1\`

**Example 2:**
- Input: \`columnTitle = "AB"\`
- Output: \`28\`

**Example 3:**
- Input: \`columnTitle = "ZY"\`
- Output: \`701\`

## Constraints
- \`1 <= columnTitle.length <= 7\`
- \`columnTitle\` consists only of uppercase English letters

## Challenge
Think of it as a base-26 number system!`,
                              starterCode: `def titleToNumber(columnTitle):
    
`,
expectedOutput: `def titleToNumber(columnTitle):
    result = 0
    for char in columnTitle:
        digit = ord(char) - ord('A') + 1
        result = result * 26 + digit
    return result`,
      hints: [
        {
          afterAttempt: 1,
          question: 'What number system is Excel using?',
          thinkAbout: [
            'This is like converting from base-26 to decimal',
            'A=1, B=2, ..., Z=26',
            'AA = 1*26 + 1 = 27'
          ]
        },
        {
          afterAttempt: 2,
          question: 'How do you convert from base-26 to decimal?',
          thinkAbout: [
            'For each character, compute its digit value (A=1, B=2, ..., Z=26)',
            'Multiply previous result by 26',
            'Add the current digit value',
            'Similar to binary to decimal conversion'
          ]
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Base-26 Conversion - O(n) time

def titleToNumber(columnTitle):
    result = 0
    for char in columnTitle:
        digit = ord(char) - ord('A') + 1
        result = result * 26 + digit
    return result

# Example: "AB"
# char='A': digit=1, result=0*26+1=1
# char='B': digit=2, result=1*26+2=28

# Example: "Z"
# char='Z': digit=26, result=0*26+26=26

# It's exactly like binary to decimal, but base-26!
# "AB" in base-26 = 1*26 + 2 = 28
# Similar to "101" in binary = 1*4 + 0*2 + 1 = 5`
      },
      targetComplexity: {
        time: "O(n)",
        space: "O(1)"
      },
      testCases: [
              // Basic examples
              {
                      'input': '\'A\'',
                      'expectedOutput': '1'
              },
              {
                      'input': '\'AB\'',
                      'expectedOutput': '28'
              },
              {
                      'input': '\'ZY\'',
                      'expectedOutput': '701'
              },
              // B - Boundaries (single letters)
              {
                      'input': '\'B\'',
                      'expectedOutput': '2'
              },
              {
                      'input': '\'C\'',
                      'expectedOutput': '3'
              },
              {
                      'input': '\'Z\'',
                      'expectedOutput': '26'
              },
              // E - Edge cases (boundaries)
              {
                      'input': '\'AA\'',
                      'expectedOutput': '27'
              },
              {
                      'input': '\'AZ\'',
                      'expectedOutput': '52'
              },
              {
                      'input': '\'BA\'',
                      'expectedOutput': '53'
              },
              // D - Different patterns
              {
                      'input': '\'ZZ\'',
                      'expectedOutput': '702'
              },
              {
                      'input': '\'AAA\'',
                      'expectedOutput': '703'
              },
              // T - Type variations (three letters)
              {
                      'input': '\'ABC\'',
                      'expectedOutput': '731'
              },
              {
                      'input': '\'XYZ\'',
                      'expectedOutput': '16900'
              },
              // I - Interesting patterns
              {
                      'input': '\'M\'',
                      'expectedOutput': '13'
              },
              {
                      'input': '\'AY\'',
                      'expectedOutput': '51'
              },
              {
                      'input': '\'CA\'',
                      'expectedOutput': '79'
              },
              // M - Medium values
              {
                      'input': '\'BAA\'',
                      'expectedOutput': '1379'
              },
              // E - Extremes
              {
                      'input': '\'ZZZ\'',
                      'expectedOutput': '18278'
              },
              {
                      'input': '\'AAAA\'',
                      'expectedOutput': '18279'
              }
      ],
      solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Character-by-Character Lookup
\`\`\`python
def titleToNumber(columnTitle):
    # Build mapping dictionary
    mapping = {}
    for i in range(26):
        mapping[chr(ord('A') + i)] = i + 1

    result = 0
    for char in columnTitle:
        result = result * 26 + mapping[char]
    return result
\`\`\`
**Time: O(n)** | **Space: O(26) = O(1)**

Unnecessary dictionary!

---

### 🟡 Bottleneck Analysis
**What's inefficient?** Building and using a dictionary is wasteful.

**Key insight:** This is base-26 conversion!
- A=1, B=2, ..., Z=26 (like digits 1-26)
- AB = 1×26 + 2 = 28
- Just like binary (base-2) or decimal (base-10)
- Use ASCII math: \`ord(char) - ord('A') + 1\`

---

### 🟢 Optimal: Base-26 Conversion
\`\`\`python
def titleToNumber(columnTitle):
    result = 0
    for char in columnTitle:
        digit = ord(char) - ord('A') + 1
        result = result * 26 + digit
    return result
\`\`\`

**Example:** "AB"
\`\`\`
char='A': digit = ord('A')-ord('A')+1 = 1
          result = 0×26 + 1 = 1

char='B': digit = ord('B')-ord('A')+1 = 2
          result = 1×26 + 2 = 28 ✓
\`\`\`

**Example:** "ZY"
\`\`\`
char='Z': digit = 26
          result = 0×26 + 26 = 26

char='Y': digit = 25
          result = 26×26 + 25 = 676 + 25 = 701 ✓
\`\`\`

**Similar to binary:**
\`\`\`
Binary "101" → 1×4 + 0×2 + 1 = 5
Excel "AB"   → 1×26 + 2 = 28
\`\`\`

---

### ✅ Final Complexity
- **Time: O(n)** - process each character once
- **Space: O(1)** - constant variables

### 🎯 Pattern Learned
**"Base-N conversion"** → Multiply by base, add digit (like binary/decimal conversion)`,
      complexityQuizPlacement: 'after',
      requiredForProgress: true
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-bitwise-ors-subarrays',
      title: 'Code: Bitwise ORs of Subarrays',
      description: 'Count distinct bitwise ORs of all subarrays.',
      instruction: `# Bitwise ORs of Subarrays (LeetCode 898)

Given an integer array arr, return the number of **distinct** bitwise ORs of all the non-empty subarrays.

## Examples

**Example 1:** arr = [0] → 1
**Example 2:** arr = [1,1,2] → 3 (distinct values: {1, 2, 3})
**Example 3:** arr = [1,2,4] → 6 (distinct: {1, 2, 3, 4, 6, 7})

## Key Insight
OR only adds bits (never removes). At most 30 distinct values per ending position.`,
      starterCode: `def subarrayBitwiseORs(arr):
    # Your code here
    pass`,
      expectedOutput: `def subarrayBitwiseORs(arr):
    result = set()
    prev = set()
    for num in arr:
        curr = {num}
        for prev_or in prev:
            curr.add(prev_or | num)
        result |= curr
        prev = curr
    return len(result)`,
      hints: [
        { afterAttempt: 1, text: 'Track OR values of subarrays ending at each index.' },
        { afterAttempt: 2, text: 'OR only adds bits, so at most 30 distinct values per position.' }
      ],
      testCases: [
        { input: '[0]', expectedOutput: '1' },
        { input: '[1, 1, 2]', expectedOutput: '3' },
        { input: '[1, 2, 4]', expectedOutput: '6' }
      ],
      targetComplexity: { time: "O(n × 30)", space: "O(n × 30)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: false
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-count-triplets-xor',
      title: 'Code: Count Triplets with Equal XOR',
      description: 'Count triplets where XOR of two subarrays are equal.',
      instruction: `# Count Triplets That Can Form Two Arrays of Equal XOR (LeetCode 1442)

Given array arr, count triplets (i, j, k) where:
- a = arr[i] ^ arr[i+1] ^ ... ^ arr[j-1]
- b = arr[j] ^ arr[j+1] ^ ... ^ arr[k]
- a == b

## Examples

**Example 1:** arr = [2,3,1,6,7] → 4 triplets
**Example 2:** arr = [1,1,1,1,1] → 10 triplets

## Key Insight
If a == b, then a ^ b == 0. So XOR(arr[i..k]) == 0.
When this happens, any j in (i, k] creates a valid triplet!`,
      starterCode: `def countTriplets(arr):
    # Your code here
    pass`,
      expectedOutput: `def countTriplets(arr):
    n = len(arr)
    count = 0
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] ^ arr[i]
    for i in range(n):
        for k in range(i + 1, n):
            if prefix[k + 1] == prefix[i]:
                count += (k - i)
    return count`,
      hints: [
        { afterAttempt: 1, text: 'If a == b, then a ^ b == 0.' },
        { afterAttempt: 2, text: 'Use prefix XOR array.' }
      ],
      testCases: [
        { input: '[2, 3, 1, 6, 7]', expectedOutput: '4' },
        { input: '[1, 1, 1, 1, 1]', expectedOutput: '10' }
      ],
      targetComplexity: { time: "O(n²)", space: "O(n)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: false
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-min-one-bit-operations',
      title: 'Code: Minimum One Bit Operations',
      description: 'Find minimum bit operations to reduce n to 0.',
      instruction: `# Minimum One Bit Operations to Make Integers Zero (LeetCode 1611)

Transform n into 0 using:
1. Flip bit 0
2. Flip bit i if bit (i-1) is 1 and bits (i-2)..0 are 0

## Examples

**Example 1:** n = 3 → 2 (3 → 1 → 0)
**Example 2:** n = 6 → 4

## Key Insight
This is Gray code to binary conversion!`,
      starterCode: `def minimumOneBitOperations(n):
    # Your code here
    pass`,
      expectedOutput: `def minimumOneBitOperations(n):
    result = 0
    while n:
        result ^= n
        n >>= 1
    return result`,
      hints: [
        { afterAttempt: 1, text: 'Related to Gray code conversion.' },
        { afterAttempt: 2, text: 'result = n ^ (n>>1) ^ (n>>2) ^ ...' }
      ],
      testCases: [
        { input: '3', expectedOutput: '2' },
        { input: '6', expectedOutput: '4' },
        { input: '0', expectedOutput: '0' }
      ],
      targetComplexity: { time: "O(log n)", space: "O(1)" },
      complexityQuizPlacement: 'after',
      requiredForProgress: false
    }
];
