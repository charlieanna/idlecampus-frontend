import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module2HashMapLessonSmartPracticeExercises: ExerciseSection[] = [
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-two-sum',
            title: 'Code: Two Sum Problem',
            description: 'Implement the Two Sum problem using a hash map for O(n) time complexity.',
            targetComplexity: { time: 'O(n)', space: 'O(n)', notes: 'Single pass with O(1) average lookup per element using a dict' },
            instruction: `# Two Sum - Coding Exercise

Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers that add up to \`target\`.

You may assume that each input has exactly one solution, and you may not use the same element twice.

## Examples

**Example 1:**
- Input: \`nums = [2, 7, 11, 15]\`, \`target = 9\`
- Output: \`[0, 1]\`
- Explanation: \`nums[0] + nums[1] = 2 + 7 = 9\`

**Example 2:**
- Input: \`nums = [3, 2, 4]\`, \`target = 6\`
- Output: \`[1, 2]\`

**Example 3:**
- Input: \`nums = [3, 3]\`, \`target = 6\`
- Output: \`[0, 1]\`

## Constraints
- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\`
- Only one valid answer exists

`,
            starterCode: `def twoSum(nums, target):
    # Your code here
    pass`,
            expectedOutput: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
            hints: [
                {
                    afterAttempt: 1,
                    question: 'What data structure provides O(1) lookups for complements?',
                    thinkAbout: [
                        'For each number, you need to find if (target - number) has been seen before',
                        'A hash map gives you O(1) lookup for previous values',
                        'Store each number with its index as you iterate'
                    ]
                },
                {
                    afterAttempt: 2,
                    question: 'How do you avoid using the same element twice?',
                    thinkAbout: [
                        'Create a dictionary called `seen` to store numbers and their indices',
                        'Check if `target - nums[i]` exists in `seen` before adding current number',
                        'If found, return [seen[complement], i]',
                        'If not found, add nums[i] to seen with its index'
                    ]
                }
            ],
            solution: {
                afterAttempt: 3,
                text: `## Optimal Solution - O(n) time, O(n) space

def twoSum(nums, target):
    seen = {}  # Maps value -> index

    for i, num in enumerate(nums):
        complement = target - num

        # Check if complement exists in O(1)
        if complement in seen:
            return [seen[complement], i]

        # Remember this number (only if not already seen to preserve first occurrence)
        if num not in seen:
            seen[num] = i

    return []  # No solution found

# Why this works:
# - We check for complement BEFORE adding current number
# - This avoids using same element twice
# - We only store the FIRST occurrence of each number
# - Hash map gives O(1) lookup vs O(n) scan
# - Single pass through array = O(n) total time`
            },
            solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Brute Force (Nested Loops)
Check every possible pair to find two numbers that sum to target:
\`\`\`python
def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []
\`\`\`
**Time: O(n²)** | **Space: O(1)**

### 🟡 Bottleneck Analysis
**What's inefficient?** For each element, we scan the rest of the array to find its complement. This inner loop does O(n) work for each of n elements.

**Key insight:** Instead of searching for the complement linearly (O(n)), we can look it up instantly if we remember which numbers we've seen.

### 🟢 Optimization: Hash Map
\`\`\`python
def twoSum(nums, target):
    seen = {}  # Maps value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
\`\`\`

### ✅ Final Complexity
- **Time: O(n)** - Single pass, O(1) hash map lookups per element
- **Space: O(n)** - Hash map stores up to n elements

### 🎯 Pattern Learned
**"Complement Lookup"** → Replace O(n) search with O(1) hash map lookup to eliminate nested loops. Trade space for speed.`,
            testCases: [
                // Basic examples
                {
                    'input': '[2, 7, 11, 15], 9',
                    'expectedOutput': '[0, 1]'
                },
                {
                    'input': '[3, 2, 4], 6',
                    'expectedOutput': '[1, 2]'
                },
                // B - Boundaries (minimum size, first/last elements)
                {
                    'input': '[1, 2], 3',
                    'expectedOutput': '[0, 1]'
                },
                {
                    'input': '[5, 5], 10',
                    'expectedOutput': '[0, 1]'
                },
                {
                    'input': '[1, 2, 3, 4, 5], 9',
                    'expectedOutput': '[3, 4]'
                },
                // E - Empty/Zeros
                {
                    'input': '[0, 4, 3, 0], 0',
                    'expectedOutput': '[0, 3]'
                },
                {
                    'input': '[0, 0], 0',
                    'expectedOutput': '[0, 1]'
                },
                {
                    'input': '[1, 0], 1',
                    'expectedOutput': '[0, 1]'
                },
                // D - Duplicates
                {
                    'input': '[3, 3], 6',
                    'expectedOutput': '[0, 1]'
                },
                {
                    'input': '[2, 2, 2], 4',
                    'expectedOutput': '[0, 1]'
                },
                {
                    'input': '[1, 1, 1, 1, 2], 3',
                    'expectedOutput': '[0, 4]'
                },
                // T - Type variations (negatives)
                {
                    'input': '[-1, -2, -3, -4, -5], -8',
                    'expectedOutput': '[2, 4]'
                },
                {
                    'input': '[-3, 4, 3, 90], 0',
                    'expectedOutput': '[0, 2]'
                },
                {
                    'input': '[-1, -1], -2',
                    'expectedOutput': '[0, 1]'
                },
                // I - Interesting edge cases
                {
                    'input': '[100, 50, 25, 75], 125',
                    'expectedOutput': '[0, 2]'
                },
                {
                    'input': '[1, 5, 3, 7, 2], 9',
                    'expectedOutput': '[3, 4]'
                },
                // M - Mixed positive and negative
                {
                    'input': '[-10, 20], 10',
                    'expectedOutput': '[0, 1]'
                },
                {
                    'input': '[5, -5], 0',
                    'expectedOutput': '[0, 1]'
                },
                // E - Extremes (large values)
                {
                    'input': '[1000000, 500000, 500000], 1000000',
                    'expectedOutput': '[1, 2]'
                }
            ],
            requiredForProgress: true
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-three-sum',
            title: 'Code: 3Sum',
            description: 'Find all unique triplets that sum to zero using sorting and two pointers.',
            targetComplexity: { time: 'O(n²)', space: 'O(1)', notes: 'Sorting + two pointers; output space not counted' },
            instruction: `# 3Sum (LeetCode 15)

Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

The solution set **must not contain duplicate triplets**.

## Examples

**Example 1:**
- Input: \`nums = [-1, 0, 1, 2, -1, -4]\`
- Output: \`[[-1, -1, 2], [-1, 0, 1]]\`
- Explanation: 
  - nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0
  - nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0
  - nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0
  - The distinct triplets are [-1,0,1] and [-1,-1,2]

**Example 2:**
- Input: \`nums = [0, 1, 1]\`
- Output: \`[]\`
- Explanation: The only possible triplet does not sum up to 0.

**Example 3:**
- Input: \`nums = [0, 0, 0]\`
- Output: \`[[0, 0, 0]]\`

## Constraints
- \`3 <= nums.length <= 3000\`
- \`-10^5 <= nums[i] <= 10^5\``,
            starterCode: `def threeSum(nums):
    # Sort first, then use two pointers
    pass`,
            expectedOutput: `def threeSum(nums):
    nums.sort()
    result = []
    
    for i in range(len(nums) - 2):
        # Skip duplicates for i
        if i > 0 and nums[i] == nums[i-1]:
            continue
        
        left, right = i + 1, len(nums) - 1
        target = -nums[i]
        
        while left < right:
            current_sum = nums[left] + nums[right]
            
            if current_sum < target:
                left += 1
            elif current_sum > target:
                right -= 1
            else:
                result.append([nums[i], nums[left], nums[right]])
                
                # Skip duplicates
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                
                left += 1
                right -= 1
    
    return result`,
            hints: [
                { afterAttempt: 1, text: 'Sort the array first. This lets you use two pointers and skip duplicates easily.' },
                { afterAttempt: 2, text: 'For each nums[i], use two pointers (left, right) to find pairs that sum to -nums[i].' },
                { afterAttempt: 3, text: 'Skip duplicates: if nums[i] == nums[i-1], skip. After finding a triplet, skip duplicate left/right values.' }
            ],
            solution: {
                afterAttempt: 4,
                text: `## Solution - O(n²) time, O(1) space

\`\`\`python
def threeSum(nums):
    nums.sort()
    result = []
    
    for i in range(len(nums) - 2):
        # Skip duplicates for i
        if i > 0 and nums[i] == nums[i-1]:
            continue
        
        left, right = i + 1, len(nums) - 1
        target = -nums[i]
        
        while left < right:
            current_sum = nums[left] + nums[right]
            
            if current_sum < target:
                left += 1
            elif current_sum > target:
                right -= 1
            else:
                result.append([nums[i], nums[left], nums[right]])
                
                # Skip duplicates
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                
                left += 1
                right -= 1
    
    return result
\`\`\`

**Key insight:** Sort + Two Pointers turns O(n³) brute force into O(n²).`
            },
            testCases: [
                { input: '[-1, 0, 1, 2, -1, -4]', expectedOutput: '[[-1, -1, 2], [-1, 0, 1]]' },
                { input: '[0, 1, 1]', expectedOutput: '[]' },
                { input: '[0, 0, 0]', expectedOutput: '[[0, 0, 0]]' },
                { input: '[-2, 0, 1, 1, 2]', expectedOutput: '[[-2, 0, 2], [-2, 1, 1]]' }
            ],
            requiredForProgress: true,
            solutionExplanation: `## The Brute-Force Instinct

Your first thought after Two Sum: just add another loop. Three nested loops checking every triplet:

\`\`\`python
def threeSum(nums):
    n = len(nums)
    result = set()
    
    for i in range(n):
        for j in range(i+1, n):
            for k in range(j+1, n):
                if nums[i] + nums[j] + nums[k] == 0:
                    result.add(tuple(sorted([nums[i], nums[j], nums[k]])))
    
    return [list(t) for t in result]
\`\`\`

O(n³) time. On 3,000 elements, that's 27 billion operations. Too slow.

---

## Spotting the Redundancy

The innermost loop searches for a number \`k\` such that \`nums[k] = -(nums[i] + nums[j])\`. That's a complement search – the same pattern as Two Sum!

But using a hash set for each (i, j) pair still leaves us with O(n²) pairs, and handling duplicates gets messy.

---

## The Sorting Insight

Here's what changes everything: **sort the array first**.

With a sorted array, for a fixed \`nums[i]\`, we can use two pointers (left, right) to find pairs that sum to \`-nums[i]\`:
- Sum too small? Move left pointer right.
- Sum too big? Move right pointer left.
- Equal? Found a triplet!

This replaces the O(n²) inner search with an O(n) two-pointer scan.

---

## The Clean Solution

\`\`\`python
def threeSum(nums):
    nums.sort()
    result = []
    
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]:
            continue  # Skip duplicate i values
        
        left, right = i + 1, len(nums) - 1
        
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            
            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                result.append([nums[i], nums[left], nums[right]])
                
                while left < right and nums[left] == nums[left+1]:
                    left += 1
                while left < right and nums[right] == nums[right-1]:
                    right -= 1
                
                left += 1
                right -= 1
    
    return result
\`\`\`

O(n²) time: sorting is O(n log n), then O(n) outer loop × O(n) two-pointer sweep.

---

## The Pattern

**k-Sum problems** follow this pattern:
- Sort the array (enables two-pointer technique)
- Fix (k-2) elements with nested loops
- Use two pointers for the final pair
- Skip duplicates at each level

This is why 3Sum is O(n²), 4Sum is O(n³), and kSum is O(n^(k-1)).`
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-valid-anagram',
            title: 'Code: Valid Anagram',
            description: 'Implement the Valid Anagram problem using frequency counting for O(n) time.',
            targetComplexity: { time: 'O(n)', space: 'O(k)', notes: 'Count frequencies in both strings; k is alphabet size (at most 26)' },
            instruction: `# Valid Anagram - Coding Exercise

Given two strings \`s\` and \`t\`, return \`True\` if \`t\` is an anagram of \`s\`, and \`False\` otherwise.

An anagram is a word formed by rearranging the letters of another word, using all original letters exactly once.

## Examples

**Example 1:**
- Input: \`s = "anagram"\`, \`t = "nagaram"\`
- Output: \`True\`

**Example 2:**
- Input: \`s = "rat"\`, \`t = "car"\`
- Output: \`False\`

**Example 3:**
- Input: \`s = "listen"\`, \`t = "silent"\`
- Output: \`True\`

## Constraints
- \`1 <= s.length, t.length <= 5 * 10^4\`
- \`s\` and \`t\` consist of lowercase English letters
`,
            starterCode: `def isAnagram(s, t):
    # Your code here
    pass`,
            expectedOutput: `def isAnagram(s, t):
    if len(s) != len(t):
        return False
    count_s, count_t = {}, {}
    for char in s:
        count_s[char] = count_s.get(char, 0) + 1
    for char in t:
        count_t[char] = count_t.get(char, 0) + 1
    return count_s == count_t`,
            hints: [
                {
                    afterAttempt: 1,
                    question: 'What defines an anagram? What needs to match between two strings?',
                    thinkAbout: [
                        'Anagrams have the same characters with the same frequencies',
                        'Order does not matter — only counts matter',
                        'If lengths differ, they cannot be anagrams'
                    ]
                },
                {
                    afterAttempt: 2,
                    question: 'How can you count character frequencies efficiently?',
                    thinkAbout: [
                        'Use a dictionary to count characters in each string',
                        'freq[char] = freq.get(char, 0) + 1 increments cleanly',
                        'Compare the two frequency dictionaries at the end'
                    ]
                }
            ],
            solution: {
                afterAttempt: 3,
                text: `## Optimal Solution - O(n) time, O(k) space

def isAnagram(s, t):
    # Quick length check
    if len(s) != len(t):
        return False

    # Count frequencies in both strings
    count_s = {}
    count_t = {}

    for char in s:
        count_s[char] = count_s.get(char, 0) + 1

    for char in t:
        count_t[char] = count_t.get(char, 0) + 1

    # Compare frequency maps
    return count_s == count_t

# Why this works:
# - Length check eliminates obvious non-anagrams in O(1)
# - Counting is O(n) vs O(n log n) for sorting
# - Dictionary comparison is O(k) where k ≤ 26 for lowercase
# - Space is O(k) for storing at most 26 character counts`
            },
            requiredForProgress: true,
            testCases: [
                { input: '"anagram", "nagaram"', expectedOutput: 'True' },
                { input: '"rat", "car"', expectedOutput: 'False' },
                { input: '"listen", "silent"', expectedOutput: 'True' },
                { input: '"a", "a"', expectedOutput: 'True' },
                { input: '"ab", "a"', expectedOutput: 'False' },
            ],
            difficulty: 'easy'
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-longest-substring-k-distinct',
            title: 'Code: Longest Substring with K Distinct Characters',
            description: 'Find the longest substring with at most K distinct characters using sliding window + frequency counting.',
            requiredForProgress: true,
            targetComplexity: { time: 'O(n)', space: 'O(k)', notes: 'Single pass with sliding window; hash map stores at most k distinct characters' },
            instruction: `# Longest Substring with At Most K Distinct Characters

Given a string \`s\` and an integer \`k\`, return the length of the longest substring that contains **at most** \`k\` distinct characters.

## Examples

**Example 1:**
- Input: \`s = "eceba"\`, \`k = 2\`
- Output: \`3\`
- Explanation: The substring \`"ece"\` has 2 distinct characters and is the longest.

**Example 2:**
- Input: \`s = "aa"\`, \`k = 1\`
- Output: \`2\`
- Explanation: The substring \`"aa"\` has 1 distinct character and is the longest.

**Example 3:**
- Input: \`s = "aabbcc"\`, \`k = 3\`
- Output: \`6\`
- Explanation: The entire string has 3 distinct characters.

## Constraints
- \`1 <= s.length <= 5 * 10^4\`
- \`0 <= k <= 50\`
- \`s\` consists of English letters

## Hint
Use a sliding window with a frequency map. Expand the window by adding characters, and shrink it when you have more than k distinct characters.`,
            starterCode: `def length_of_longest_substring_k_distinct(s, k):
    # Your code here
    pass

# Test your solution
print(length_of_longest_substring_k_distinct("eceba", 2))  # Should print 3
print(length_of_longest_substring_k_distinct("aa", 1))      # Should print 2
print(length_of_longest_substring_k_distinct("aabbcc", 3))  # Should print 6`,
            testCases: [
                {
                    input: '"eceba", 2',
                    expectedOutput: '3'
                },
                {
                    input: '"aa", 1',
                    expectedOutput: '2'
                },
                {
                    input: '"aabbcc", 3',
                    expectedOutput: '6'
                },
                {
                    input: '"abc", 1',
                    expectedOutput: '1'
                }
            ],
            hints: [
                {
                    afterAttempt: 1,
                    text: 'Use a dictionary to track character frequencies in the current window',
                    thinkAbout: [
                        'How do you know when you have more than k distinct characters?',
                        'What should you do when the window has too many distinct characters?'
                    ]
                },
                {
                    afterAttempt: 2,
                    text: 'Use two pointers: left (start of window) and right (end of window). Expand right, shrink left when needed.',
                    thinkAbout: [
                        'When should you move the left pointer?',
                        'How do you update the frequency map when shrinking the window?'
                    ]
                }
            ],
            solution: {
                afterAttempt: 3,
                text: `def length_of_longest_substring_k_distinct(s, k):
    if k == 0 or not s:
        return 0
    
    freq = {}  # Track frequencies in current window
    left = 0   # Left boundary of window
    max_len = 0
    
    # Expand window by moving right pointer
    for i, char in enumerate(s):
        # Add current character to frequency map
        freq[char] = freq.get(char, 0) + 1
        
        # Shrink window if we have more than k distinct characters
        while len(freq) > k:
            # Remove leftmost character
            freq[s[left]] -= 1
            if freq[s[left]] == 0:
                del freq[s[left]]
            left += 1
        
        # Window is now valid - update answer
        max_len = max(max_len, i - left + 1)
    
    return max_len

# Test your solution
print(length_of_longest_substring_k_distinct("eceba", 2))  # Should print 3
print(length_of_longest_substring_k_distinct("aa", 1))      # Should print 2
print(length_of_longest_substring_k_distinct("aabbcc", 3))  # Should print 6`
            },
            solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Check All Substrings
\`\`\`python
def length_of_longest_substring_k_distinct(s, k):
    max_len = 0
    for i in range(len(s)):
        for j in range(i, len(s)):
            substring = s[i:j+1]
            distinct = len(set(substring))
            if distinct <= k:
                max_len = max(max_len, len(substring))
    return max_len
\`\`\`
**Time: O(n³)** | **Space: O(n)** - Check every substring, count distinct characters each time

### 🟡 Bottleneck Analysis
**What's inefficient?** 
- We check every substring: O(n²) substrings
- For each substring, we count distinct characters: O(n) per substring
- Total: O(n³)

**Key insight:** Overlapping substrings share characters! "eceba" and "ceba" both contain "e", "c", "e". We're recounting the same characters.

### 🟢 Optimization: Sliding Window + Frequency Map
\`\`\`python
def length_of_longest_substring_k_distinct(s, k):
    freq = {}
    left = 0
    max_len = 0
    
    for i, char in enumerate(s):
        # Add current character
        freq[char] = freq.get(char, 0) + 1
        
        # Shrink window if too many distinct characters
        while len(freq) > k:
            freq[s[left]] -= 1
            if freq[s[left]] == 0:
                del freq[s[left]]
            left += 1
        
        # Update answer
        max_len = max(max_len, i - left + 1)
    
    return max_len
\`\`\`

**How it works:**
1. **Expand:** Add characters to the window (right pointer moves)
2. **Shrink:** Remove characters when window violates constraint (left pointer moves)
3. **Track:** Use frequency map to know how many distinct characters we have

**Time:** O(n) - Each character added once, removed at most once
**Space:** O(k) - Frequency map stores at most k+1 distinct characters

### ✅ Final Complexity
- **Time: O(n)** - Single pass with sliding window
- **Space: O(k)** - Hash map stores at most k distinct characters

### 🎯 Pattern Learned
**"Sliding Window + Frequency Counting"** → Maintain a window with frequency map, update incrementally as window slides. O(n) instead of O(n³) brute force.`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
            timeLimit: 900,
            passingScore: 100
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-find-all-anagrams',
            title: 'Code: Find All Anagrams',
            description: 'Find all starting indices of anagrams using sliding window + frequency comparison.',
            requiredForProgress: true,
            targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Fixed-size sliding window; frequency arrays of size 26 (constant)' },
            instruction: `# Find All Anagrams in a String

Given two strings \`s\` and \`p\`, return an array of all the start indices of \`p\`'s anagrams in \`s\`. You may return the answer in **any order**.

An **anagram** is a word formed by rearranging the letters of another word, using all original letters exactly once.

## Examples

**Example 1:**
- Input: \`s = "cbaebabacd"\`, \`p = "abc"\`
- Output: \`[0, 6]\`
- Explanation: The substring with start index \`0\` is \`"cba"\`, which is an anagram of \`"abc"\`. The substring with start index \`6\` is \`"bac"\`, which is an anagram of \`"abc"\`.

**Example 2:**
- Input: \`s = "abab"\`, \`p = "ab"\`
- Output: \`[0, 1, 2]\`
- Explanation: Substrings starting at indices 0, 1, and 2 are \`"ab"\`, \`"ba"\`, and \`"ab"\` respectively.

## Constraints
- \`1 <= s.length, p.length <= 3 * 10^4\`
- \`s\` and \`p\` consist of lowercase English letters

## Hint
Use a fixed-size sliding window (size = len(p)) and compare frequency maps.`,
            starterCode: `def find_anagrams(s, p):
    # Your code here
    pass

# Test your solution
print(find_anagrams("cbaebabacd", "abc"))  # Should print [0, 6]
print(find_anagrams("abab", "ab"))        # Should print [0, 1, 2]`,
            testCases: [
                {
                    input: '"cbaebabacd", "abc"',
                    expectedOutput: '[0, 6]'
                },
                {
                    input: '"abab", "ab"',
                    expectedOutput: '[0, 1, 2]'
                },
                {
                    input: '"a", "a"',
                    expectedOutput: '[0]'
                }
            ],
            hints: [
                {
                    afterAttempt: 1,
                    text: 'Build a frequency map for p first. Then use a sliding window of size len(p) in s.',
                    thinkAbout: [
                        'How do you know if a substring is an anagram of p?',
                        'What size should your sliding window be?'
                    ]
                },
                {
                    afterAttempt: 2,
                    text: 'As you slide the window, update the frequency map incrementally: remove left character, add right character.',
                    thinkAbout: [
                        'When you move the window one position right, what changes?',
                        'How do you compare frequency maps efficiently?'
                    ]
                }
            ],
            solution: {
                afterAttempt: 3,
                text: `def find_anagrams(s, p):
    if len(p) > len(s):
        return []
    
    # Build frequency map for p
    p_freq = [0] * 26
    for char in p:
        p_freq[ord(char) - ord('a')] += 1
    
    # Build initial window frequency map
    window_freq = [0] * 26
    for i in range(len(p)):
        window_freq[ord(s[i]) - ord('a')] += 1
    
    result = []
    
    # Check if initial window matches
    if window_freq == p_freq:
        result.append(0)
    
    # Slide the window
    for i in range(len(p), len(s)):
        # Remove leftmost character
        window_freq[ord(s[i - len(p)]) - ord('a')] -= 1
        # Add new character
        window_freq[ord(s[i]) - ord('a')] += 1
        
        # Check if window matches p
        if window_freq == p_freq:
            result.append(i - len(p) + 1)
    
    return result

# Test your solution
print(find_anagrams("cbaebabacd", "abc"))  # Should print [0, 6]
print(find_anagrams("abab", "ab"))        # Should print [0, 1, 2]`
            },
            solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Check Every Substring
\`\`\`python
def find_anagrams(s, p):
    result = []
    p_sorted = sorted(p)
    
    for i in range(len(s) - len(p) + 1):
        substring = s[i:i+len(p)]
        if sorted(substring) == p_sorted:
            result.append(i)
    
    return result
\`\`\`
**Time: O(n × m log m)** where n=len(s), m=len(p) | **Space: O(m)** - Sort each substring

### 🟡 Bottleneck Analysis
**What's inefficient?** Sorting each substring takes O(m log m), and we check n-m+1 substrings.

**Key insight:** Overlapping windows share most characters! "cba" and "bae" share "ba". We can update frequencies incrementally instead of rebuilding.

### 🟢 Optimization: Fixed Sliding Window + Frequency Arrays
\`\`\`python
def find_anagrams(s, p):
    if len(p) > len(s):
        return []
    
    # Frequency arrays (26 for lowercase letters)
    p_freq = [0] * 26
    for char in p:
        p_freq[ord(char) - ord('a')] += 1
    
    window_freq = [0] * 26
    # Initialize window
    for i in range(len(p)):
        window_freq[ord(s[i]) - ord('a')] += 1
    
    result = []
    if window_freq == p_freq:
        result.append(0)
    
    # Slide window: remove left, add right
    for i in range(len(p), len(s)):
        window_freq[ord(s[i - len(p)]) - ord('a')] -= 1  # Remove left
        window_freq[ord(s[i]) - ord('a')] += 1            # Add right
        
        if window_freq == p_freq:
            result.append(i - len(p) + 1)
    
    return result
\`\`\`

**How it works:**
1. **Build p's frequency:** Count characters in pattern once
2. **Initialize window:** Count first len(p) characters of s
3. **Slide:** Remove leftmost character, add new right character
4. **Compare:** Check if frequencies match (O(1) for arrays of size 26)

**Time:** O(n) - Single pass through s
**Space:** O(1) - Fixed-size arrays (26 elements)

### ✅ Final Complexity
- **Time: O(n)** - Single pass with sliding window
- **Space: O(1)** - Fixed-size frequency arrays (26 characters)

### 🎯 Pattern Learned
**"Fixed Sliding Window + Frequency Comparison"** → Use fixed-size window, update frequencies incrementally. Compare frequency arrays/objects in O(1) for small alphabets.`,
            complexityQuizPlacement: 'after',
            difficulty: 'medium',
            timeLimit: 900,
            passingScore: 100
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-subarray-sum',
            title: 'Code: Subarray Sum Equals K',
            description: 'Use prefix sum with hash map to count subarrays with sum K in O(n) time.',
            targetComplexity: { time: 'O(n)', space: 'O(n)', notes: 'Prefix sums with a dict of frequencies; each element processed once' },
            instruction: `# Subarray Sum Equals K - Coding Exercise

Given an array of integers \`nums\` and an integer \`k\`, return the total number of subarrays whose sum equals \`k\`.

A subarray is a contiguous non-empty sequence of elements within an array.

## Examples

**Example 1:**
- Input: \`nums = [1, 1, 1]\`, \`k = 2\`
- Output: \`2\`
- Explanation: Subarrays [1,1] starting at index 0 and index 1

**Example 2:**
- Input: \`nums = [1, 2, 3]\`, \`k = 3\`
- Output: \`2\`
- Explanation: Subarrays [1,2] and [3]

**Example 3:**
- Input: \`nums = [1, -1, 1, 1]\`, \`k = 2\`
- Output: \`3\`

## Constraints
- \`1 <= nums.length <= 2 * 10^4\`
- \`-1000 <= nums[i] <= 1000\`
- \`-10^7 <= k <= 10^7\`

## Challenge
Can you solve it in O(n) time?`,
            starterCode: `def subarraySum(nums, k):
    # Your code here
    pass`,
            expectedOutput: `def subarraySum(nums, k):
    count = 0
    prefix_sum = 0
    sum_freq = {0: 1}

    for num in nums:
        prefix_sum += num

        if (prefix_sum - k) in sum_freq:
            count += sum_freq[prefix_sum - k]

        sum_freq[prefix_sum] = sum_freq.get(prefix_sum, 0) + 1

    return count`,
            hints: [
                {
                    afterAttempt: 1,
                    text: 'Think about prefix sums: if sum[0..j] - sum[0..i] = k, then sum[i+1..j] = k. Use a hash map to store prefix sums you\'ve seen.'
                },
                {
                    afterAttempt: 2,
                    text: 'Initialize sum_freq = {0: 1} as a base case. As you iterate, check if (prefix_sum - k) exists in sum_freq. This tells you how many subarrays ending at current index sum to k.'
                }
            ],
            solution: {
                afterAttempt: 3,
                text: `# Optimal Solution - O(n) time, O(n) space

def subarraySum(nums, k):
    count = 0
    prefix_sum = 0
    sum_freq = {0: 1}  # Base case: empty prefix

    for num in nums:
        # Update running sum
        prefix_sum += num

        # Check if (prefix_sum - k) exists
        # If yes, we found subarray(s) summing to k
        if (prefix_sum - k) in sum_freq:
            count += sum_freq[prefix_sum - k]

        # Record this prefix sum
        sum_freq[prefix_sum] = sum_freq.get(prefix_sum, 0) + 1

    return count

# Why this works:
# - If prefix_sum[j] - prefix_sum[i] = k
#   Then subarray[i+1...j] has sum k
# - We look for: prefix_sum - k in our map
# - Base case {0: 1} handles subarrays from index 0
#
# Example: nums = [1, 2, 3], k = 3
# Step 1: prefix=1, look for 1-3=-2 (not found), add 1
# Step 2: prefix=3, look for 3-3=0 (found! count=1), add 3
# Step 3: prefix=6, look for 6-3=3 (found! count=2), add 6
	# Result: 2 subarrays ([1,2] and [3])
	#
	# This is 100x faster than O(n²) brute force!`
            },
            solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Brute Force (Nested Loops)
Check sum for every possible subarray:
\`\`\`python
def subarray_sum(nums, k):
    count = 0
    for i in range(len(nums)):
        current_sum = 0
        for j in range(i, len(nums)):
            current_sum += nums[j]
            if current_sum == k:
                count += 1
    return count
\`\`\`
**Time: O(n²)** | **Space: O(1)**

### 🟡 Bottleneck Analysis
**What's inefficient?** We compute sums for all O(n²) possible subarrays. For each start position, we iterate through all possible end positions.

**Key insight:** Instead of recalculating sums for each subarray, use prefix sums. If we've seen (prefix_sum - k) before, then there's a subarray ending at current position that sums to k. Store prefix sum frequencies for counting.

### 🟢 Optimization: Prefix Sum + Hash Map
\`\`\`python
def subarray_sum(nums, k):
    count = 0
    prefix_sum = 0
    sum_freq = {0: 1}  # Base case

    for num in nums:
        prefix_sum += num
        if (prefix_sum - k) in sum_freq:
            count += sum_freq[prefix_sum - k]
        sum_freq[prefix_sum] = sum_freq.get(prefix_sum, 0) + 1
    return count
\`\`\`

### ✅ Final Complexity
- **Time: O(n)** - Single pass, O(1) hash map operations per element
- **Space: O(n)** - Hash map stores up to n+1 prefix sums

### 🎯 Pattern Learned
**"Count Subarrays with Prefix Sum"** → Store prefix sum frequencies, lookup (current - target) to count matching subarrays. O(n²) → O(n).`,
            testCases: [
                // Basic examples
                {
                    'input': '[1, 1, 1], 2',
                    'expectedOutput': '2'
                },
                {
                    'input': '[1, 2, 3], 3',
                    'expectedOutput': '2'
                },
                // B - Boundaries
                {
                    'input': '[1], 1',
                    'expectedOutput': '1'
                },
                {
                    'input': '[1], 0',
                    'expectedOutput': '0'
                },
                {
                    'input': '[1, 2], 3',
                    'expectedOutput': '1'
                },
                // E - Zeros
                {
                    'input': '[0, 0, 0], 0',
                    'expectedOutput': '6'
                },
                {
                    'input': '[0], 0',
                    'expectedOutput': '1'
                },
                {
                    'input': '[1, 0, 1], 1',
                    'expectedOutput': '4'
                },
                // D - Duplicates
                {
                    'input': '[1, 1, 1, 1], 2',
                    'expectedOutput': '3'
                },
                {
                    'input': '[3, 3, 3], 6',
                    'expectedOutput': '2'
                },
                // T - Negatives
                {
                    'input': '[1, -1, 1, -1, 1], 0',
                    'expectedOutput': '6'
                },
                {
                    'input': '[-1, -1, 1], 0',
                    'expectedOutput': '1'
                },
                {
                    'input': '[-2, -1, 0, 1, 2], 0',
                    'expectedOutput': '3'
                },
                {
                    'input': '[1, -1, 1, 1], 2',
                    'expectedOutput': '2'
                },
                // E - Extremes
                {
                    'input': '[1, 2, 3, 4, 5], 15',
                    'expectedOutput': '1'
                },
                {
                    'input': '[1, 2, 3, 4, 5], 100',
                    'expectedOutput': '0'
                },
                {
                    'input': '[1, 2, 1, 2, 1], 3',
                    'expectedOutput': '4'
                }
            ],
            requiredForProgress: true
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-group-anagrams',
            title: 'Code: Group Anagrams',
            description: 'Group anagrams together using frequency counting as the hash map key.',
            instruction: `# Group Anagrams - Coding Exercise

Given an array of strings \`strs\`, group the anagrams together. You can return the answer in **any order**.

An **anagram** is a word formed by rearranging the letters of another word, using all original letters exactly once.

## Examples

**Example 1:**
- Input: \`strs = ["eat", "tea", "tan", "ate", "nat", "bat"]\`
- Output: \`[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]\`
- Explanation: Groups can be in any order

**Example 2:**
- Input: \`strs = [""]\`
- Output: \`[[""]]\`

**Example 3:**
- Input: \`strs = ["a"]\`
- Output: \`[["a"]]\`

## Constraints
- \`1 <= strs.length <= 10^4\`
- \`0 <= strs[i].length <= 100\`
- \`strs[i]\` consists of lowercase English letters

`,
            starterCode: `def groupAnagrams(strs):
    # Your code here
    pass`,
            expectedOutput: `def group_anagrams(strs):
    groups = {}
    for s in strs:
        key = ''.join(sorted(s))
        if key not in groups:
            groups[key] = []
        groups[key].append(s)
    return list(groups.values())`,
            hints: [
                {
                    afterAttempt: 1,
                    text: 'Anagrams have the same letters, just in different order. If you sort the letters, all anagrams will have the same sorted string! Use sorted string as a hash map key.'
                },
                {
                    afterAttempt: 2,
                    text: 'Create a hash map where the key is the sorted version of the string. For each word, sort it, and add the original word to that key\'s list. Finally, return all the values.'
                }
            ],
            solution: {
                afterAttempt: 3,
                text: `# Solution 1: Using sorted string as key - O(n * k log k) time

def group_anagrams(strs):
    groups = {}

    for s in strs:
        # Sort the string to use as key
        key = ''.join(sorted(s))

        # Add to corresponding group
        if key not in groups:
            groups[key] = []
        groups[key].append(s)

    return list(groups.values())

# Solution 2: Using character count as key - O(n * k) time
def group_anagrams(strs):
    from collections import defaultdict

    groups = defaultdict(list)

    for s in strs:
        # Count characters (26 letters)
        count = [0] * 26
        for char in s:
            count[ord(char) - ord('a')] += 1

        # Use tuple of counts as key (lists aren't hashable)
        key = tuple(count)
        groups[key].append(s)

    return list(groups.values())

# Solution 3: Using Counter (cleanest)
def group_anagrams(strs):
    from collections import defaultdict

    groups = defaultdict(list)

    for s in strs:
        # Sorted string as key
        key = ''.join(sorted(s))
        groups[key].append(s)

    return list(groups.values())

# Why this works:
# - Anagrams have identical character frequencies
# - Sorting gives them the same key
# - Hash map groups all strings with same key
#
# Example: ["eat", "tea", "tan", "ate"]
# - "eat" → key="aet" → groups["aet"] = ["eat"]
# - "tea" → key="aet" → groups["aet"] = ["eat", "tea"]
	# - "tan" → key="ant" → groups["ant"] = ["tan"]
	# - "ate" → key="aet" → groups["aet"] = ["eat", "tea", "ate"]
	# Result: [["eat", "tea", "ate"], ["tan"]]`
            },
            targetComplexity: { time: 'O(n·k log k) or O(n·k)', space: 'O(n·k)', notes: 'n = words, k = word length; sort or count characters per word' },
            testCases: [
                // Basic examples
                {
                    'input': '["eat", "tea", "tan", "ate", "nat", "bat"]',
                    'expectedOutput': "[['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]"
                },
                // B - Boundaries (single element, empty string)
                {
                    'input': '[""]',
                    'expectedOutput': "[['']]"
                },
                {
                    'input': '["a"]',
                    'expectedOutput': "[['a']]"
                },
                {
                    'input': '["ab", "ba"]',
                    'expectedOutput': "[['ab', 'ba']]"
                },
                // E - Empty arrays and single groups
                {
                    'input': '["abc"]',
                    'expectedOutput': "[['abc']]"
                },
                {
                    'input': '["", ""]',
                    'expectedOutput': "[['', '']]"
                },
                // D - Duplicates (same word multiple times)
                {
                    'input': '["a", "a", "a"]',
                    'expectedOutput': "[['a', 'a', 'a']]"
                },
                {
                    'input': '["abc", "abc", "bca"]',
                    'expectedOutput': "[['abc', 'abc', 'bca']]"
                },
                // T - Types (all different, all same)
                {
                    'input': '["abc", "def", "ghi"]',
                    'expectedOutput': "[['abc'], ['def'], ['ghi']]"
                },
                {
                    'input': '["abc", "bca", "cab"]',
                    'expectedOutput': "[['abc', 'bca', 'cab']]"
                },
                // I - Interesting patterns
                {
                    'input': '["listen", "silent", "enlist"]',
                    'expectedOutput': "[['listen', 'silent', 'enlist']]"
                },
                {
                    'input': '["rat", "tar", "art", "car"]',
                    'expectedOutput': "[['rat', 'tar', 'art'], ['car']]"
                },
                // M - Multiple anagram groups
                {
                    'input': '["ab", "ba", "cd", "dc", "ef"]',
                    'expectedOutput': "[['ab', 'ba'], ['cd', 'dc'], ['ef']]"
                },
                {
                    'input': '["aab", "aba", "baa", "abc", "bca"]',
                    'expectedOutput': "[['aab', 'aba', 'baa'], ['abc', 'bca']]"
                },
                // E - Extremes (long strings, many duplicates)
                {
                    'input': '["aaaa", "aaaa", "aaab"]',
                    'expectedOutput': "[['aaaa', 'aaaa'], ['aaab']]"
                },
                {
                    'input': '["z", "y", "x", "w", "v"]',
                    'expectedOutput': "[['z'], ['y'], ['x'], ['w'], ['v']]"
                }
            ],
            solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Sort Each Word as Key
\`\`\`python
def groupAnagrams(strs):
    groups = {}
    for word in strs:
        key = ''.join(sorted(word))  # Sort chars
        if key not in groups:
            groups[key] = []
        groups[key].append(word)
    return list(groups.values())
\`\`\`
**Time: O(n · k log k)** | **Space: O(n · k)**
where n = number of words, k = max word length

---

### 🟡 Bottleneck Analysis
**What's inefficient?** Sorting each word is O(k log k)!

**Key insight:** Instead of sorting, count character frequencies. Same counts = anagrams!

---

### 🟢 Optimization: Character Count as Key
\`\`\`python
def groupAnagrams(strs):
    groups = {}
    for word in strs:
        # Count characters (tuple is hashable)
        count = [0] * 26
        for char in word:
            count[ord(char) - ord('a')] += 1
        key = tuple(count)

        if key not in groups:
            groups[key] = []
        groups[key].append(word)

    return list(groups.values())
\`\`\`

---

### 🧠 Why Count Key is Better
| Approach | Per-word Time | Total |
|----------|---------------|-------|
| Sort key | O(k log k) | O(n · k log k) |
| Count key | O(k) | O(n · k) |

For k=100: sorting does ~700 ops, counting does ~100 ops

---

### ✅ Final Complexity
- **Time: O(n · k)** - count each character
- **Space: O(n · k)** - store all words

### 🎯 Pattern Learned
**"Group by anagram"** → Use character count tuple as hash key`,
            requiredForProgress: false
        }
];
