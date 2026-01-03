import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module4ArrayHashMapLessonSmartPracticeExercises: ExerciseSection[] = [
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-intersection-of-two-arrays',
      title: 'Code: Intersection of Two Arrays',
      description: 'Find common elements between two arrays using a hash set for O(n+m) time.',
      instruction: `# Intersection of Two Arrays - Coding Exercise

Given two integer arrays \`nums1\` and \`nums2\`, return an array of their intersection. Each element in the result must be **unique** and you may return the result in **any order**.

## Examples

**Example 1:**
- Input: \`nums1 = [1,2,2,1]\`, \`nums2 = [2,2]\`
- Output: \`[2]\`

**Example 2:**
- Input: \`nums1 = [4,9,5]\`, \`nums2 = [9,4,9,8,4]\`
- Output: \`[9,4]\` (or \`[4,9]\`)

## Constraints
- \`1 <= nums1.length, nums2.length <= 1000\`
- \`0 <= nums1[i], nums2[i] <= 1000\`

## Challenge
Can you solve it in **O(n + m)** time?`,
      starterCode: `def intersection(nums1, nums2):
    pass`,
      expectedOutput: `def intersection(nums1, nums2):
    set1 = set(nums1)
    set2 = set(nums2)
    return list(set1 & set2)`,
      hints: [
        {
          afterAttempt: 1,
          question: 'How can you quickly check if a number exists in an array?',
          thinkAbout: [
            'Searching in a list is O(n).',
            'Searching in a set is O(1).',
            'Which data structure should you convert the arrays to?'
          ]
        },
        {
          afterAttempt: 2,
          question: 'Do we need to store duplicates?',
          thinkAbout: [
            'The problem asks for unique elements.',
            'Sets automatically handle uniqueness for us.'
          ]
        }
      ],
      requiredForProgress: true,
      solution: {
        afterAttempt: 3,
        text: `## Optimal Solution - O(n + m) time

**Key Insight:** Use Sets for O(1) lookups and automatic uniqueness.

\`\`\`python
def intersection(nums1, nums2):
    # Convert both to sets to remove duplicates
    set1 = set(nums1)
    set2 = set(nums2)
    
    # Python's built-in intersection operator
    # This iterates over the smaller set and checks existence in the larger set
    return list(set1 & set2)
\`\`\`

**Alternative Manual approach:**

\`\`\`python
def intersection(nums1, nums2):
    set1 = set(nums1)
    result = []
    
    for num in nums2:
        if num in set1:
            result.append(num)
            set1.remove(num)  # Establish uniqueness
            
    return result
\`\`\`

**Time:** O(n + m) to convert arrays to sets.
**Space:** O(n + m) to store the sets.`
      },
      targetComplexity: {
        time: "O(n + m)",
        space: "O(n + m)"
      },
      testCases: [
        {
          'input': '[1,2,2,1]\n[2,2]',
          'expectedOutput': '[2]'
        },
        {
          'input': '[4,9,5]\n[9,4,9,8,4]',
          'expectedOutput': '[9, 4]'
        },
        // Edge cases
        {
          'input': '[]\n[1,2]',
          'expectedOutput': '[]'
        },
        {
          'input': '[1,2]\n[]',
          'expectedOutput': '[]'
        }
      ],
      solutionExplanation: `## 🟢 Optimal Approach: Hash Sets

**Problem:** Find common unique elements.

**Naive Approach:**
For every element in \`nums1\`, search through \`nums2\`.
- Time: O(n * m) - Very slow for large arrays.

**Better Approach (Sorting):**
Sort both arrays and use two pointers.
- Time: O(n log n + m log m).

**Best Approach (Hash Sets):**
1. Convert \`nums1\` to a set → O(n)
2. Iterate through \`nums2\` and check if element is in set → O(m)
   - Lookup in set is O(1).

**Total Time:** O(n + m)
**Total Space:** O(n + m)

This is the classic "Trade Space for Time" strategy. We use extra memory (the set) to make lookups instant.`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-longest-consecutive',
      title: 'Code: Longest Consecutive Sequence',
      description: 'Find longest consecutive sequence using hash set for O(n) time.',
      instruction: `# Longest Consecutive Sequence - Coding Exercise

Given an unsorted array, find the length of the longest consecutive elements sequence.

## Examples

**Example 1:**
- Input: \`[100, 4, 200, 1, 3, 2]\`
- Output: \`4\`
- Explanation: The longest consecutive sequence is \`[1, 2, 3, 4]\`

**Example 2:**
- Input: \`[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]\`
- Output: \`9\`
- Explanation: Sequence is \`[0, 1, 2, 3, 4, 5, 6, 7, 8]\`

## Constraints
- \`0 <= nums.length <= 10^5\`
- \`-10^9 <= nums[i] <= 10^9\`

## Challenge
Can you solve it in O(n) time without sorting?`,
      starterCode: `def longestConsecutive(nums):
    pass`,
      expectedOutput: `def longestConsecutive(nums):
    if not nums:
        return 0

    num_set = set(nums)
    longest = 0

    for num in num_set:
        # Only start counting from sequence start
        if num - 1 not in num_set:
            current_num = num
            current_length = 1

            while current_num + 1 in num_set:
                current_num += 1
                current_length += 1

            longest = max(longest, current_length)

    return longest`,
      hints: [
        {
          afterAttempt: 1,
          question: 'Think About Brute Force',
          thinkAbout: [
            'Have you tried the brute force approach first?',
            'What makes consecutive numbers easy to find?'
          ]
        },
        {
          afterAttempt: 2,
          question: 'What if We Sorted First?',
          thinkAbout: [
            'Sorting can make patterns easier to see',
            'How would consecutive numbers appear in a sorted array?'
          ]
        },
        {
          afterAttempt: 3,
          question: 'Can you see the pattern in a sorted array?',
          thinkAbout: [
            'Original: [100, 4, 200, 1, 3, 2]',
            'Sorted: [1, 2, 3, 4, 100, 200]',
            'Consecutive sequences become clear'
          ]
        },
        {
          afterAttempt: 4,
          question: 'Can We Do Better?',
          thinkAbout: [
            'Can we do better than O(n log n)?',
            'What if we could check if a number exists in O(1) time?'
          ]
        },
        {
          afterAttempt: 5,
          question: 'Use a Set for O(1) Lookups',
          thinkAbout: [
            'Convert the array to a set for O(1) lookup time',
            'Only start counting from the beginning of a sequence',
            'Check if num - 1 exists to find sequence starts'
          ]
        }
      ],
      requiredForProgress: true,
      solution: {
        afterAttempt: 10,
        text: `## Final Solution - O(n) time, O(n) space

**Key Insight:** Only count from sequence starts to avoid redundant work.

**Algorithm:**
1. Convert to set for O(1) lookups
2. For each number, check if it's a sequence start (num-1 not in set)
3. If start, count consecutive numbers
4. Track maximum length

**Why O(n)?** Each number is visited at most twice.

\`\`\`python
def longestConsecutive(nums):
    if not nums:
        return 0

    num_set = set(nums)  # O(n) space
    longest = 0

    for num in num_set:
        # Only start counting from sequence beginning
        if num - 1 not in num_set:  # O(1) check
            current_num = num
            current_length = 1

            # Count consecutive numbers
            while current_num + 1 in num_set:  # O(1) check
                current_num += 1
                current_length += 1

            longest = max(longest, current_length)

    return longest
\`\`\`

**Time:** O(n) | **Space:** O(n)`
      },
      targetComplexity: {
        time: "O(n)",
        space: "O(n)"
      },
      testCases: [
        // Basic examples
        {
          'input': '[100, 4, 200, 1, 3, 2]',
          'expectedOutput': '4'
        },
        {
          'input': '[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]',
          'expectedOutput': '9'
        },
        // B - Boundaries
        {
          'input': '[]',
          'expectedOutput': '0'
        },
        {
          'input': '[1]',
          'expectedOutput': '1'
        },
        {
          'input': '[1, 2]',
          'expectedOutput': '2'
        },
        // E - Edge cases
        {
          'input': '[0]',
          'expectedOutput': '1'
        },
        {
          'input': '[-1, 0, 1]',
          'expectedOutput': '3'
        },
        // D - Duplicates
        {
          'input': '[1, 2, 2, 3]',
          'expectedOutput': '3'
        },
        {
          'input': '[5, 5, 5, 5]',
          'expectedOutput': '1'
        },
        // T - Type variations (negatives)
        {
          'input': '[-5, -4, -3, -2, -1]',
          'expectedOutput': '5'
        },
        {
          'input': '[-2, -1, 0, 1, 2]',
          'expectedOutput': '5'
        },
        // I - Interesting patterns
        {
          'input': '[1, 3, 5, 7, 9]',
          'expectedOutput': '1'
        },
        {
          'input': '[1, 9, 3, 10, 4, 20, 2]',
          'expectedOutput': '4'
        },
        // M - Multiple sequences
        {
          'input': '[1, 2, 3, 10, 11, 12, 13]',
          'expectedOutput': '4'
        },
        // E - Extremes
        {
          'input': '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]',
          'expectedOutput': '10'
        }
      ],
      solutionExplanation: `## 🔴 Brute Force Approach

**Naive Solution: Sort the array first**

\`\`\`python
def longestConsecutive(nums):
    if not nums:
        return 0

    nums.sort()  # O(n log n)
    longest = 1
    current = 1

    for i in range(1, len(nums)):
        if nums[i] == nums[i-1]:
            continue  # Skip duplicates
        elif nums[i] == nums[i-1] + 1:
            current += 1
        else:
            longest = max(longest, current)
            current = 1

    return max(longest, current)
\`\`\`

**Time Complexity:** O(n log n) - dominated by sorting
**Space Complexity:** O(1) or O(n) depending on sort implementation

---

## 🟡 Bottleneck Analysis

**What's inefficient?**

1. **Sorting overhead**: We don't need the entire array sorted, just consecutive sequences
2. **We're doing more work than needed**: Sorting arranges ALL elements, but we only care about consecutive relationships
3. **Can't do better than O(n log n) with sorting**

**Key Insight:** We need O(1) lookup to check if a number exists, without the O(n log n) sorting cost.

---

## 🟢 Optimal Approach: Hash Set

**Strategy:** Use a set for O(1) lookups, only start counting from sequence beginnings

\`\`\`python
def longestConsecutive(nums):
    if not nums:
        return 0

    num_set = set(nums)  # O(n) time, O(n) space
    longest = 0

    for num in num_set:
        # Only start counting from sequence start
        if num - 1 not in num_set:  # O(1) check
            current_num = num
            current_length = 1

            # Count consecutive numbers
            while current_num + 1 in num_set:  # O(1) check
                current_num += 1
                current_length += 1

            longest = max(longest, current_length)

    return longest
\`\`\`

**Why this works:**
- For [100, 4, 200, 1, 3, 2]:
  - At 1: (0 not in set) → Start! Count 1,2,3,4 → length 4
  - At 2: (1 in set) → Skip, not a start
  - At 3: (2 in set) → Skip, not a start
  - At 4: (3 in set) → Skip, not a start
  - At 100: (99 not in set) → Start! Only 100 → length 1
  - At 200: (199 not in set) → Start! Only 200 → length 1

---

## ✅ Final Complexity

**Time Complexity:** O(n)
- Each number is visited at most twice (once in outer loop, once in while loop)
- Set operations (lookup, insert) are O(1)

**Space Complexity:** O(n)
- Hash set stores all unique numbers

---

## 🎯 Pattern Learned

**Hash Set for Sequence Detection**
- Use set when you need to check existence quickly
- Identify "starting points" to avoid redundant work
- Smart iteration: only process what's necessary (skip non-starts)
- Pattern: Convert to set → Find starts → Count from starts`,
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-longest-substring-no-repeat',
      title: 'Code: Longest Substring Without Repeating Characters',
      description: 'Find longest substring without repeating characters by maintaining a window that grows/shrinks based on character uniqueness.',
      instruction: `# Longest Substring Without Repeating Characters

Given a string \`s\`, find the length of the **longest substring** without repeating characters.

## Examples

**Example 1:**
- Input: \`s = "abcabcbb"\`
- Output: \`3\`
- Explanation: The answer is "abc", with length 3

**Example 2:**
- Input: \`s = "bbbbb"\`
- Output: \`1\`
- Explanation: The answer is "b", with length 1

**Example 3:**
- Input: \`s = "pwwkew"\`
- Output: \`3\`
- Explanation: The answer is "wke", with length 3

**Example 4:**
- Input: \`s = ""\`
- Output: \`0\`

## Constraints

- \`0 <= s.length <= 50,000\`
- \`s\` consists of English letters, digits, symbols and spaces

## Challenge

Can you solve it in O(n) time by maintaining a window that grows when unique, shrinks when duplicate found?`,
      starterCode: `def lengthOfLongestSubstring(s):
    pass
`,
      expectedOutput: `def lengthOfLongestSubstring(s):
    seen = set()
    left = 0
    max_len = 0

    for right in range(len(s)):
        # Shrink window while duplicate exists
        while s[right] in seen:
            seen.remove(s[left])
            left += 1

        # Window is valid now, expand
        seen.add(s[right])
        max_len = max(max_len, right - left + 1)

    return max_len`,
      hints: [
        {
          afterAttempt: 1,
          text: 'Use two pointers (left, right) for window boundaries and a hash set to track characters in current window.'
        },
        {
          afterAttempt: 2,
          text: 'When you encounter a duplicate (s[right] in seen), shrink window from left until duplicate is removed.'
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Optimized Solution - O(n) time, O(k) space

def lengthOfLongestSubstring(s):
    seen = set()
    left = 0
    max_len = 0

    for right in range(len(s)):
        # Shrink window while duplicate exists
        while s[right] in seen:
            seen.remove(s[left])  # O(1) removal
            left += 1

        # Window is valid now, expand
        seen.add(s[right])  # O(1) insertion
        max_len = max(max_len, right - left + 1)

    return max_len

# Key insight: Each character added once, removed at most once
# Total: O(n) with single pass, hash set enables O(1) lookups`
      },
      targetComplexity: {
        time: "O(n)",
        space: "O(k)"
      },
      testCases: [
        // Basic examples
        {
          'input': '\'abcabcbb\'',
          'expectedOutput': '3'
        },
        {
          'input': '\'bbbbb\'',
          'expectedOutput': '1'
        },
        {
          'input': '\'pwwkew\'',
          'expectedOutput': '3'
        },
        // B - Boundaries
        {
          'input': '\'\'',
          'expectedOutput': '0'
        },
        {
          'input': '\'a\'',
          'expectedOutput': '1'
        },
        {
          'input': '\'ab\'',
          'expectedOutput': '2'
        },
        // E - Edge cases
        {
          'input': '\'aa\'',
          'expectedOutput': '1'
        },
        {
          'input': '\'aab\'',
          'expectedOutput': '2'
        },
        // D - Duplicates
        {
          'input': '\'abba\'',
          'expectedOutput': '2'
        },
        {
          'input': '\'tmmzuxt\'',
          'expectedOutput': '5'
        },
        // T - Type variations
        {
          'input': '\'abcdefg\'',
          'expectedOutput': '7'
        },
        {
          'input': '\'dvdf\'',
          'expectedOutput': '3'
        },
        // I - Interesting patterns
        {
          'input': '\'anviaj\'',
          'expectedOutput': '5'
        },
        {
          'input': '\'ohvhjdml\'',
          'expectedOutput': '6'
        },
        // M - Many characters
        {
          'input': '\'abcabcabc\'',
          'expectedOutput': '3'
        },
        // E - Extremes
        {
          'input': '\' \'',
          'expectedOutput': '1'
        },
        {
          'input': '\'au\'',
          'expectedOutput': '2'
        }
      ],
      solutionExplanation: `## 🔴 Brute Force Approach

**Check every possible substring**

\`\`\`python
def lengthOfLongestSubstring(s):
    max_length = 0

    for i in range(len(s)):
        for j in range(i + 1, len(s) + 1):
            substring = s[i:j]

            # Check if all characters are unique
            if len(substring) == len(set(substring)):
                max_length = max(max_length, len(substring))

    return max_length
\`\`\`

**Time Complexity:** O(n³) - O(n²) substrings × O(n) to check uniqueness
**Space Complexity:** O(n) - storing substrings and sets

---

## 🟡 Bottleneck Analysis

**What's inefficient?**

1. **Massive redundancy**: Checking "abc" then "abca" rebuilds the entire set from scratch
2. **Rechecking known characters**: We already knew "a", "b", "c" were unique
3. **Starting over**: When we find "abca" has duplicate, we restart from position 1 instead of just removing the first 'a'

**Example waste:**
- s = "abcabcbb"
- Check "a" ✓, "ab" ✓, "abc" ✓, "abca" ✗ (duplicate found!)
- Then check "b" ✓, "bc" ✓, "bca" ✓ (but we already knew "b" and "c" were unique!)

**Key Insight:** Use a sliding window that expands when characters are unique, shrinks when duplicates found.

---

## 🟢 Optimal Approach: Sliding Window + Hash Set

**Strategy:** Maintain a window with unique characters, shrink from left when duplicate found

\`\`\`python
def lengthOfLongestSubstring(s):
    seen = set()
    left = 0
    max_len = 0

    for right in range(len(s)):
        # Shrink window while duplicate exists
        while s[right] in seen:
            seen.remove(s[left])
            left += 1

        # Window is valid now, expand
        seen.add(s[right])
        max_len = max(max_len, right - left + 1)

    return max_len
\`\`\`

**Visual trace for "abcabcbb":**
\`\`\`
right=0: [a]       → seen={a}, len=1
right=1: [a,b]     → seen={a,b}, len=2
right=2: [a,b,c]   → seen={a,b,c}, len=3
right=3: a found! → remove a → [b,c,a] → seen={b,c,a}, len=3
right=4: b found! → remove b,c → [a,b] → seen={a,b}, len=3
right=5: [a,b,c]   → seen={a,b,c}, len=3
right=6: b found! → remove a,b → [c,b] → seen={c,b}, len=3
right=7: b found! → remove c,b → [b] → seen={b}, len=3
\`\`\`

---

## ✅ Final Complexity

**Time Complexity:** O(n)
- Each character added once (right pointer), removed at most once (left pointer)
- Total operations: 2n = O(n)

**Space Complexity:** O(min(n, k))
- k = size of character set (26 lowercase, 128 ASCII, etc.)
- In worst case, all characters are unique: O(n)

---

## 🎯 Pattern Learned

**Sliding Window with Set**
- Expand window: add new element
- Shrink window: remove elements until constraint satisfied
- Track max/min during valid states
- Pattern: Two pointers + set for uniqueness checking
- Each element processed at most twice (add once, remove once) → O(n)`,
      complexityQuizPlacement: 'after',
      requiredForProgress: true
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-find-all-anagrams',
      title: 'Code: Find All Anagrams in a String',
      description: 'Find all start indices of p\'s anagrams in s using a fixed sliding window and frequency map.',
      instruction: `# Find All Anagrams in a String

Given two strings \`s\` and \`p\`, return an array of all the start indices of \`p\`'s anagrams in \`s\`. You may return the answer in any order.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

## Examples

**Example 1:**
- Input: \`s = "cbaebabacd"\`, \`p = "abc"\`
- Output: \`[0, 6]\`
- Explanation:
  - The substring with start index = 0 is "cba", which is an anagram of "abc".
  - The substring with start index = 6 is "bac", which is an anagram of "abc".

**Example 2:**
- Input: \`s = "abab"\`, \`p = "ab"\`
- Output: \`[0, 1, 2]\`
- Explanation:
  - At index 0: "ab" (anagram of "ab")
  - At index 1: "ba" (anagram of "ab")
  - At index 2: "ab" (anagram of "ab")

## Constraints
- \`1 <= s.length, p.length <= 3 * 10^4\`
- \`s\` and \`p\` consist of lowercase English letters.

## Challenge
Can you solve it in **O(n)** time?`,
      starterCode: `def findAnagrams(s, p):
    pass`,
      expectedOutput: `def findAnagrams(s, p):
    if len(p) > len(s): return []
    
    p_count = {}
    s_count = {}
    
    for char in p:
        p_count[char] = p_count.get(char, 0) + 1
        
    res = []
    left = 0
    k = len(p)
    
    # Initialize first window
    for i in range(k):
        s_count[s[i]] = s_count.get(s[i], 0) + 1
        
    if s_count == p_count:
        res.append(0)
        
    # Slide the window
    for right in range(k, len(s)):
        # Add new char
        s_count[s[right]] = s_count.get(s[right], 0) + 1
        
        # Remove old char
        char_left = s[left]
        s_count[char_left] -= 1
        if s_count[char_left] == 0:
            del s_count[char_left]
        left += 1
            
        if s_count == p_count:
            res.append(left)
            
    return res`,
      hints: [
        {
          afterAttempt: 1,
          question: 'How do you check if two substrings are anagrams?',
          thinkAbout: [
            'Anagrams have the same character counts.',
            'You need a frequency map (hash map) to count characters.'
          ]
        },
        {
          afterAttempt: 2,
          question: 'How to avoid re-counting every substring?',
          thinkAbout: [
            'Use a fixed sliding window of size len(p).',
            'When moving from index i to i+1:',
            '- Add s[i+len(p)] to your count',
            '- Remove s[i] from your count',
            '- Compare the updated map with p\'s map'
          ]
        }
      ],
      requiredForProgress: true,
      solution: {
        afterAttempt: 3,
        text: `## Optimal Solution - O(n) Fixed Window

**Key Insight:** Use a fixed-size window of length \`len(p)\`. Compare frequency maps.

\`\`\`python
def findAnagrams(s, p):
    if len(p) > len(s): return []
    
    # 1. Build reference frequency map for p
    # For small alphabet (26 chars), array is faster, but map is fine
    p_count = [0] * 26
    s_count = [0] * 26
    
    for char in p:
        p_count[ord(char) - ord('a')] += 1
        
    result = []
    k = len(p)
    
    # 2. Slide window
    for i in range(len(s)):
        # Add right char
        s_count[ord(s[i]) - ord('a')] += 1
        
        # If window is too large, remove left char
        if i >= k:
            s_count[ord(s[i-k]) - ord('a')] -= 1
            
        # Compare counts
        if s_count == p_count:
            result.append(i - k + 1)
            
    return result
\`\`\`

**Time:** O(n) (since comparing 26-element arrays is O(1))
**Space:** O(1) (fixed 26 characters)`
      },
      targetComplexity: {
        time: "O(n)",
        space: "O(1)"
      },
      testCases: [
        {
          'input': '\'cbaebabacd\'\n\'abc\'',
          'expectedOutput': '[0, 6]'
        },
        {
          'input': '\'abab\'\n\'ab\'',
          'expectedOutput': '[0, 1, 2]'
        },
        // Edge cases
        {
          'input': '\'a\'\n\'a\'',
          'expectedOutput': '[0]'
        },
        {
          'input': '\'a\'\n\'b\'',
          'expectedOutput': '[]'
        }
      ],
      solutionExplanation: `## 🟢 Optimal Approach: Fixed Sliding Window

**The Pattern:**
1. **Window Size:** Fixed at \`len(p)\`.
2. **State:** Two frequency arrays (or hash maps) of size 26.
   - \`p_count\`: Target frequencies.
   - \`s_count\`: Current window frequencies.
3. **Slide:**
   - **Add** char at \`right\`.
   - If window size > \`len(p)\`, **remove** char at \`left\`.
   - **Compare** \`s_count\` == \`p_count\`.

**Complexity:**
- **Time:** O(N) where N is length of s. (Comparing arrays of size 26 is O(1)).
- **Space:** O(1) since alphabet size is constant (26).

**Why Fixed Window?**
We are looking for substrings of a *specific length*. This is the hallmark of fixed window problems.`
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-permutation-in-string',
      title: 'Code: Permutation in String',
      description: 'Check if one string contains a permutation of another (Fixed Window).',
      instruction: `# Permutation in String (LeetCode 567)

Given two strings \`s1\` and \`s2\`, return true if \`s2\` contains a permutation of \`s1\`, or false otherwise.

In other words, return true if one of \`s1\`'s permutations is the substring of \`s2\`.

## Examples

**Example 1:**
- Input: \`s1 = "ab"\`, \`s2 = "eidbaooo"\`
- Output: \`true\`
- Explanation: \`s2\` contains one permutation of \`s1\` ("ba").

**Example 2:**
- Input: \`s1 = "ab"\`, \`s2 = "eidboaoo"\`
- Output: \`false\`

## Constraints
- \`1 <= s1.length, s2.length <= 10^4\`
- \`s1\` and \`s2\` consist of lowercase English letters.

## Challenge
Solve in **O(n)** time using the fixed sliding window pattern.`,
      starterCode: `def checkInclusion(s1, s2):
    pass`,
      expectedOutput: `def checkInclusion(s1, s2):
    if len(s1) > len(s2): return False
    
    s1_count = [0] * 26
    s2_count = [0] * 26
    
    # Initialize window
    for i in range(len(s1)):
        s1_count[ord(s1[i]) - ord('a')] += 1
        s2_count[ord(s2[i]) - ord('a')] += 1
        
    matches = 0
    for i in range(26):
        if s1_count[i] == s2_count[i]:
            matches += 1
            
    # Slide window
    for i in range(len(s2) - len(s1)):
        if matches == 26: return True
        
        # Add right char
        r = ord(s2[i + len(s1)]) - ord('a')
        s2_count[r] += 1
        if s2_count[r] == s1_count[r]:
            matches += 1
        elif s2_count[r] == s1_count[r] + 1:
            matches -= 1
            
        # Remove left char
        l = ord(s2[i]) - ord('a')
        s2_count[l] -= 1
        if s2_count[l] == s1_count[l]:
            matches += 1
        elif s2_count[l] == s1_count[l] - 1:
            matches -= 1
            
    return matches == 26`,
      hints: [
        {
          afterAttempt: 1,
          question: 'How is this similar to finding anagrams?',
          thinkAbout: [
            'A permutation is just an anagram.',
            'We need to find if any substring of s2 is an anagram of s1.',
            'Use a fixed window of size len(s1).'
          ]
        },
        {
          afterAttempt: 2,
          question: 'How to optimize the comparison?',
          thinkAbout: [
            'Instead of comparing whole arrays each time, track "matches".',
            'Count how many characters have matching frequencies.',
            'Update matches count as you slide.'
          ]
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `## Optimized Solution - O(n) Fixed Window

\`\`\`python
def checkInclusion(s1, s2):
    if len(s1) > len(s2): return False
    
    s1_map = [0] * 26
    s2_map = [0] * 26
    
    # Init first window
    for i in range(len(s1)):
        s1_map[ord(s1[i]) - ord('a')] += 1
        s2_map[ord(s2[i]) - ord('a')] += 1
        
    if s1_map == s2_map: return True
    
    # Slide window
    for i in range(len(s2) - len(s1)):
        # Remove left, Add right
        left = ord(s2[i]) - ord('a')
        right = ord(s2[i + len(s1)]) - ord('a')
        
        s2_map[right] += 1
        s2_map[left] -= 1
        
        if s1_map == s2_map: return True
        
    return False
\`\`\`

**Time:** O(l1 + 26*(l2-l1)) ≈ O(l2)
**Space:** O(1) (array of 26)`
      },
      targetComplexity: { time: "O(n)", space: "O(1)" },
      testCases: [
        { input: '\'ab\'\n\'eidbaooo\'', expectedOutput: 'True' },
        { input: '\'ab\'\n\'eidboaoo\'', expectedOutput: 'False' },
        { input: '\'adc\'\n\'dcda\'', expectedOutput: 'True' }
      ],
      solutionExplanation: `## 🟢 Pattern: Fixed Sliding Window

This is identical to "Find All Anagrams", but we return True immediately upon finding a match.

**Key Optimization:**
We maintain two frequency maps (arrays of size 26).
- **Init:** Fill both maps for the first \`len(s1)\` characters.
- **Slide:** 
  1. Add new character at \`right\`.
  2. Remove old character at \`left\`.
  3. Check if maps match.

Since the map size is constant (26), the comparison is O(1). Total time is linear O(n).`,
      requiredForProgress: true
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-longest-repeating-char-replacement',
      title: 'Code: Longest Repeating Character Replacement',
      description: 'Find longest substring containing same letters after k replacements (Variable Window).',
      instruction: `# Longest Repeating Character Replacement (LeetCode 424)

You are given a string \`s\` and an integer \`k\`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most \`k\` times.

Return the length of the longest substring containing the same letter you can get after performing the above operations.

## Examples

**Example 1:**
- Input: \`s = "ABAB"\`, \`k = 2\`
- Output: \`4\`
- Explanation: Replace both 'A's with 'B's or vice versa -> "AAAA" or "BBBB".

**Example 2:**
- Input: \`s = "AABABBA"\`, \`k = 1\`
- Output: \`4\`
- Explanation: Replace one 'B' in the middle -> "AABBBBA" is invalid (k=1). Best is "AABA..." -> "AAAA..." (len 4).

## Constraints
- \`1 <= s.length <= 10^5\`
- \`s\` consists of only uppercase English letters.
- \`0 <= k <= s.length\`

## Challenge
Solve in **O(n)** time.`,
      starterCode: `def characterReplacement(s, k):
    pass`,
      expectedOutput: `def characterReplacement(s, k):
    count = {}
    max_freq = 0
    left = 0
    max_len = 0
    
    for right in range(len(s)):
        # Add right char
        count[s[right]] = count.get(s[right], 0) + 1
        max_freq = max(max_freq, count[s[right]])
        
        # Check validity: length - max_freq <= k
        # If invalid, shrink window from left
        if (right - left + 1) - max_freq > k:
            count[s[left]] -= 1
            left += 1
            # Note: We don't need to decrement max_freq!
            
        max_len = max(max_len, right - left + 1)
            
    return max_len`,
      hints: [
        {
          afterAttempt: 1,
          question: 'What is the condition for a valid window?',
          thinkAbout: [
            'A window is valid if: (window_length - count_of_most_frequent_char) <= k',
            'This means we only need to replace the non-dominant characters.'
          ]
        },
        {
          afterAttempt: 2,
          question: 'Do we need to update max_freq when shrinking?',
          thinkAbout: [
            'Actually, no! The window only grows larger if we find a NEW max_freq that allows it.',
            'If we shrink, the max_freq might drop, but we purely care about the *longest* valid window found so far.',
            'This optimization keeps it O(n).'
          ]
        }
      ],
      solution: {
        afterAttempt: 3,
        text: `## Optimal Solution - O(n) Variable Window

\`\`\`python
def characterReplacement(s, k):
    count = {}
    max_freq = 0
    left = 0
    result = 0
    
    for right in range(len(s)):
        # 1. Expand window
        count[s[right]] = count.get(s[right], 0) + 1
        max_freq = max(max_freq, count[s[right]])
        
        # 2. Check validity
        # Window Len - Max Freq = Chars to Replace
        # If replacements needed > k, shrink window
        while (right - left + 1) - max_freq > k:
            count[s[left]] -= 1
            left += 1
            
        # 3. Update max length
        result = max(result, right - left + 1)
            
    return result
\`\`\`

**Time:** O(n) - left and right pointers move at most n steps.
**Space:** O(1) - hash map size is bounded by 26 chars.`
      },
      targetComplexity: { time: "O(n)", space: "O(1)" },
      testCases: [
        { input: '\'ABAB\'\n2', expectedOutput: '4' },
        { input: '\'AABABBA\'\n1', expectedOutput: '4' },
        { input: '\'AAAB\'\n0', expectedOutput: '3' }
      ],
      solutionExplanation: `## 🟢 Pattern: Variable Sliding Window with Max Freq

**The Condition:**
We want to replace all "other" characters to match the most frequent character in the current window.
Formula: \`(Window Length) - (Frequency of Most Frequent Char) <= k\`

**The Algorithm:**
1. **Expand** \`right\` pointer.
2. Update frequency count and \`max_freq\`.
3. **While** invalid:
   - Shrink from \`left\`.
   - Update frequency count.
4. Update max length.

**Optimization:**
We technically don't need to decrement \`max_freq\` when shrinking. The result only increases when we find a window valid with a *larger* \`max_freq\`. This is a subtle O(n) optimization.`,
      requiredForProgress: true
    }
];
