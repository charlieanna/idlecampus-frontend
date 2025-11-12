# HASH-MAP Problems

Total Problems: 13

---

## 1. Two Sum

**Difficulty:** easy
**Concept:** hash-map
**Family:** hash-map:two-sum

### Description

Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.

### Key Insight

Use a hash map to store each number and its index as you iterate. For each number, check if (target - current number) exists in the map. This reduces time complexity from O(n²) brute force to O(n).

### Examples

**Example 1:**
- Input: nums = [2,7,11,15], target = 9
- Output: [0,1]
- Explanation: nums[0] + nums[1] = 2 + 7 = 9, so we return [0, 1]

**Example 2:**
- Input: nums = [3,2,4], target = 6
- Output: [1,2]
- Explanation: nums[1] + nums[2] = 2 + 4 = 6

**Example 3:**
- Input: nums = [3,3], target = 6
- Output: [0,1]
- Explanation: The two 3s add up to 6

### Hints

1. Think about what information you need to store as you iterate through the array.
2. Consider using a data structure that allows O(1) lookup time.
3. For each number, what other number would you need to find to reach the target?

### Starter Code

**Python:**
```python
def twoSum(nums, target):
    # Your code here
    pass
```

**JavaScript:**
```javascript
function twoSum(nums, target) {
    # Your code here
  // TODO: implement
```

### Solution

**Python:**
```python
def twoSum(nums, target):
    # Create a hash map to store number -> index
    num_to_index = {}
    
    for i, num in enumerate(nums):
        # Calculate what number we need to find
        complement = target - num
        
        # Check if we have seen this complement before
        if complement in num_to_index:
            return [num_to_index[complement], i]
        
        # Store current number and its index
        num_to_index[num] = i
    
    # This should never be reached given the problem constraints
    return []
```

**JavaScript:**
```javascript
function twoSum(nums, target) {
    # Create a hash map to store number -> index
    num_to_index = {}
    
    for i, num in enumerate(nums):
        # Calculate what number we need to find
        complement = target - num
        
        # Check if we have seen this complement before
        if complement in num_to_index:
            return [num_to_index[complement], i]
        
        # Store current number and its index
        num_to_index[num] = i
    
    # This should never be reached given the problem constraints
    return []
```

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** Basic case with two numbers that sum to target
- Input: "nums = [2,7,11,15], target = 9"
- Expected: "[0,1]"

**Test 2:** Case where indices are not 0 and 1
- Input: "nums = [3,2,4], target = 6"
- Expected: "[1,2]"

**Test 3:** Case with duplicate numbers
- Input: "nums = [3,3], target = 6"
- Expected: "[0,1]"

**Test 4:** PERFORMANCE: Large array (100K elements) - Must use O(n) hash map, not O(n²) nested loops
- Input: "nums = list(range(100000)) + [50001], target = 150000"
- Expected: "[99999,100000]"

---

## 2. Contains Duplicate

**Difficulty:** easy
**Concept:** hash-map
**Family:** hash-map:contains-duplicate

### Description

Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.

### Key Insight

Use a set to track seen numbers. If we encounter a number we have seen before, return true.

### Examples

**Example 1:**
- Input: nums = [1,2,3,1]
- Output: true
- Explanation: 1 appears twice

**Example 2:**
- Input: nums = [1,2,3,4]
- Output: false
- Explanation: All elements are distinct

**Example 3:**
- Input: nums = [1,1,1,3,3,4,3,2,4,2]
- Output: true
- Explanation: Multiple duplicates exist

### Hints

1. What data structure allows O(1) lookup to check if an element exists?
2. As you iterate through the array, what should you do with each number?
3. What should you return if you find a number you have seen before?

### Starter Code

**Python:**
```python
def containsDuplicate(nums):
    # Your code here
    pass
```

**JavaScript:**
```javascript
function containsDuplicate(nums) {
    # Your code here
  // TODO: implement
```

### Solution

**Python:**
```python
def containsDuplicate(nums):
    seen = set()
    
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    
    return False
```

**JavaScript:**
```javascript
function containsDuplicate(nums) {
    seen = set()
    
    for num in nums:
        if num in seen:
            return true
        seen.add(num)
    
    return false
```

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** Basic case with duplicate
- Input: "nums = [1,2,3,1]"
- Expected: "true"

**Test 2:** Case with no duplicates
- Input: "nums = [1,2,3,4]"
- Expected: "false"

**Test 3:** Case with multiple duplicates
- Input: "nums = [1,1,1,3,3,4,3,2,4,2]"
- Expected: "true"

**Test 4:** PERFORMANCE: Large array (100K unique elements) - Must use O(n) hash set, not O(n²) nested loops
- Input: "nums = list(range(100000))"
- Expected: "false"

---

## 3. Valid Anagram

**Difficulty:** easy
**Concept:** hash-map
**Family:** hash-map:valid-anagram

### Description

Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

### Key Insight

Count the frequency of each character in both strings using a hash map. If the frequencies match, the strings are anagrams.

### Examples

**Example 1:**
- Input: s = "anagram", t = "nagaram"
- Output: true
- Explanation: Both strings have the same characters with the same frequencies

**Example 2:**
- Input: s = "rat", t = "car"
- Output: false
- Explanation: The character frequencies do not match

### Hints

1. What if you count how many times each letter appears in both strings?
2. Can you use a dictionary to store character frequencies?
3. How can you compare two dictionaries in Python?

### Starter Code

**Python:**
```python
def isAnagram(s, t):
    # Your code here
    pass
```

**JavaScript:**
```javascript
function isAnagram(s, t) {
    # Your code here
  // TODO: implement
```

### Solution

**Python:**
```python
def isAnagram(s, t):
    # Quick check: if lengths differ, cannot be anagram
    if len(s) != len(t):
        return False
    
    # Count character frequencies in both strings
    char_count = {}
    
    # Count characters in s
    for char in s:
        char_count[char] = char_count.get(char, 0) + 1
    
    # Subtract characters from t
    for char in t:
        if char not in char_count:
            return False
        char_count[char] -= 1
        if char_count[char] < 0:
            return False
    
    # All counts should be zero
    return all(count == 0 for count in char_count.values())

# Alternative solution using Counter
from collections import Counter

def isAnagram_counter(s, t):
    return Counter(s) == Counter(t)
```

**JavaScript:**
```javascript
function isAnagram(s, t) {
    # Quick check: if lengths differ, cannot be anagram
    if len(s) != len(t):
        return false
    
    # Count character frequencies in both strings
    char_count = {}
    
    # Count characters in s
    for char in s:
        char_count[char] = char_count.get(char, 0) + 1
    
    # Subtract characters from t
    for char in t:
        if char not in char_count:
            return false
        char_count[char] -= 1
        if char_count[char] < 0:
            return false
    
    # All counts should be zero
    return all(count == 0 for count in char_count.values())

# Alternative solution using Counter
from collections import Counter

function isAnagram_counter(s, t) {
    return Counter(s) == Counter(t)
```

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1) - at most 26 letters in English alphabet

### Test Cases

**Test 1:** Valid anagram
- Input: "s = \"anagram\", t = \"nagaram\""
- Expected: "true"

**Test 2:** Not an anagram
- Input: "s = \"rat\", t = \"car\""
- Expected: "false"

**Test 3:** Different lengths
- Input: "s = \"a\", t = \"ab\""
- Expected: "false"

**Test 4:** PERFORMANCE: Very long strings (100K characters each) - Must use O(n) frequency counter, not O(n log n) sorting
- Input: "s = \"\".join(chr(97 + i % 26) for i in range(50000)) * 2, t = \"\".join(chr(97 + i % 26) for i in range(50000)) * 2"
- Expected: "true"

---

## 4. First Unique Character in a String

**Difficulty:** easy
**Concept:** hash-map

### Description

Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.

### Key Insight

Use a hash map to count the frequency of each character. Then iterate through the string again to find the first character with a frequency of 1.

### Examples

**Example 1:**
- Input: s = "leetcode"
- Output: 0
- Explanation: The first non-repeating character is "l" at index 0

**Example 2:**
- Input: s = "loveleetcode"
- Output: 2
- Explanation: The first non-repeating character is "v" at index 2

**Example 3:**
- Input: s = "aabb"
- Output: -1
- Explanation: There is no non-repeating character

### Hints

1. First, count how many times each character appears in the string.
2. Then, go through the string again to find the first character that appears only once.
3. Use a dictionary to store character frequencies.

### Starter Code

**Python:**
```python
def firstUniqChar(s):
    # Your code here
    pass
```

**JavaScript:**
```javascript
function firstUniqChar(s) {
    # Your code here
  // TODO: implement
```

### Solution

**Python:**
```python
def firstUniqChar(s):
    # Count frequency of each character
    char_count = {}
    for char in s:
        char_count[char] = char_count.get(char, 0) + 1
    
    # Find first character with frequency 1
    for i, char in enumerate(s):
        if char_count[char] == 1:
            return i
    
    return -1

# Alternative solution using Counter
from collections import Counter

def firstUniqChar_counter(s):
    char_count = Counter(s)
    
    for i, char in enumerate(s):
        if char_count[char] == 1:
            return i
    
    return -1
```

**JavaScript:**
```javascript
function firstUniqChar(s) {
    # Count frequency of each character
    char_count = {}
    for char in s:
        char_count[char] = char_count.get(char, 0) + 1
    
    # Find first character with frequency 1
    for i, char in enumerate(s):
        if char_count[char] == 1:
            return i
    
    return -1

# Alternative solution using Counter
from collections import Counter

function firstUniqChar_counter(s) {
    char_count = Counter(s)
    
    for i, char in enumerate(s):
        if char_count[char] == 1:
            return i
    
    return -1
```

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1) - at most 26 letters in English alphabet

### Test Cases

**Test 1:** First unique character at beginning
- Input: "s = \"leetcode\""
- Expected: "0"

**Test 2:** First unique character in middle
- Input: "s = \"loveleetcode\""
- Expected: "2"

**Test 3:** No unique character
- Input: "s = \"aabb\""
- Expected: "-1"

**Test 4:** PERFORMANCE: Very long string (100K characters) - Must use O(n) two-pass hash map, not O(n²) nested loops
- Input: "s = \"a\" * 99999 + \"b\""
- Expected: "99999"

---

## 5. Group Anagrams

**Difficulty:** medium
**Concept:** hash-map
**Family:** hash-map:group-anagrams

### Description

Given an array of strings strs, group the anagrams together. You can return the answer in any order. An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

### Key Insight

Use a hash map where the key is the sorted version of each string (or a tuple of character counts). All anagrams will have the same key and can be grouped together.

### Examples

**Example 1:**
- Input: strs = ["eat","tea","tan","ate","nat","bat"]
- Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
- Explanation: Strings that are anagrams of each other are grouped together

**Example 2:**
- Input: strs = [""]
- Output: [[""]]
- Explanation: Single empty string

**Example 3:**
- Input: strs = ["a"]
- Output: [["a"]]
- Explanation: Single character string

### Hints

1. What property do all anagrams share? Think about their characters.
2. If you sort the characters of anagram strings, what do you get?
3. Use a dictionary where the key represents the sorted string.
4. All strings with the same sorted version are anagrams of each other.

### Starter Code

**Python:**
```python
def groupAnagrams(strs):
    # Your code here
    pass
```

**JavaScript:**
```javascript
function groupAnagrams(strs) {
    # Your code here
  // TODO: implement
```

### Solution

**Python:**
```python
def groupAnagrams(strs):
    # Dictionary to store groups: sorted_string -> list of anagrams
    anagram_groups = {}
    
    for string in strs:
        # Sort the string to get the key
        sorted_str = ''.join(sorted(string))
        
        # Add to the corresponding group
        if sorted_str not in anagram_groups:
            anagram_groups[sorted_str] = []
        anagram_groups[sorted_str].append(string)
    
    # Return all groups as a list
    return list(anagram_groups.values())

# Alternative solution using defaultdict
from collections import defaultdict

def groupAnagrams_defaultdict(strs):
    anagram_groups = defaultdict(list)
    
    for string in strs:
        # Sort the string to get the key
        sorted_str = ''.join(sorted(string))
        anagram_groups[sorted_str].append(string)
    
    return list(anagram_groups.values())
```

**JavaScript:**
```javascript
function groupAnagrams(strs) {
    # Dictionary to store groups: sorted_string -> list of anagrams
    anagram_groups = {}
    
    for string in strs:
        # Sort the string to get the key
        sorted_str = ''.join(sorted(string))
        
        # Add to the corresponding group
        if sorted_str not in anagram_groups:
            anagram_groups[sorted_str] = []
        anagram_groups[sorted_str].append(string)
    
    # Return all groups as a list
    return list(anagram_groups.values())

# Alternative solution using defaultdict
from collections import defaultdict

function groupAnagrams_defaultdict(strs) {
    anagram_groups = defaultdict(list)
    
    for string in strs:
        # Sort the string to get the key
        sorted_str = ''.join(sorted(string))
        anagram_groups[sorted_str].append(string)
    
    return list(anagram_groups.values())
```

### Complexity Analysis

- **Time Complexity:** O(n * k log k) where n is the number of strings and k is the max length of a string
- **Space Complexity:** O(n * k) for storing all strings in the hash map

### Test Cases

**Test 1:** Multiple anagram groups
- Input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]"
- Expected: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]"

**Test 2:** Empty string
- Input: "strs = [\"\"]"
- Expected: "[[\"\"]]"

**Test 3:** Single string
- Input: "strs = [\"a\"]"
- Expected: "[[\"a\"]]"

**Test 4:** PERFORMANCE: Large array (10K strings) - Must use O(n*k*log k) hash map with sorted keys, not O(n²*k) pairwise comparison
- Input: "strs = [\"\".join(sorted(str(i) * 10)) for i in range(10000)]"
- Expected: "len(set(tuple(sorted(s)) for s in strs))"

---

## 6. Subarray Sum Equals K

**Difficulty:** medium
**Concept:** hash-map
**Additional Concepts:** hash-map, prefix-sums
**Family:** hash-map:prefix-sum

### Description

Given array nums and integer k, return total number of continuous subarrays whose sum equals k.

### Key Insight

Use prefix sum with hash map. Track cumulative sum. If (cumsum - k) exists in map, found subarray. Store frequency of each prefix sum. Classic: sum[i:j] = cumsum[j] - cumsum[i].

### Examples

**Example 1:**
- Input: nums = [1,1,1], k = 2
- Output: 2
- Explanation: Subarrays [1,1] at positions (0,1) and (1,2)

**Example 2:**
- Input: nums = [1,2,3], k = 3
- Output: 2
- Explanation: Subarrays [1,2] and [3]

### Hints

1. Use prefix sum to track cumulative sum
2. Store frequency of each prefix sum in hash map
3. If (current_sum - k) exists in map, we found subarray(s)
4. Remember to handle the case when prefix sum itself equals k

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** Two overlapping subarrays
- Input: {"nums":[1,1,1],"k":2}
- Expected: 2

**Test 2:** Multiple solutions
- Input: {"nums":[1,2,3],"k":3}
- Expected: 2

**Test 3:** With negative numbers
- Input: {"nums":[1,-1,0],"k":0}
- Expected: 3

---

## 7. Longest Consecutive Sequence

**Difficulty:** medium
**Concept:** hash-map
**Family:** hash-map:set-lookup

### Description

Given unsorted array nums, return length of longest consecutive elements sequence. Must run in O(n) time.

### Key Insight

Put all numbers in set. For each number, only start counting if it's the start of sequence (num-1 not in set). Count up from there. This ensures O(n) total time.

### Examples

**Example 1:**
- Input: nums = [100,4,200,1,3,2]
- Output: 4
- Explanation: Longest sequence is [1,2,3,4]

**Example 2:**
- Input: nums = [0,3,7,2,5,8,4,6,0,1]
- Output: 9
- Explanation: Sequence [0,1,2,3,4,5,6,7,8]

### Hints

1. Use a hash set for O(1) lookups
2. Only start counting from numbers that are sequence starts
3. A number is a sequence start if (num - 1) is not in the set
4. Each number is visited at most twice, ensuring O(n) time

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** Sequence [1,2,3,4]
- Input: [100,4,200,1,3,2]
- Expected: 4

**Test 2:** Long sequence
- Input: [0,3,7,2,5,8,4,6,0,1]
- Expected: 9

**Test 3:** With negatives
- Input: [9,1,4,7,3,-1,0,5,8,-2]
- Expected: 7

---

## 8. Top K Frequent Elements

**Difficulty:** medium
**Concept:** hash-map
**Additional Concepts:** hash-map, sorting
**Family:** hash-map:frequency

### Description

Given integer array nums and integer k, return k most frequent elements. You may return answer in any order.

### Key Insight

Count frequencies with hash map. Use bucket sort where bucket[i] contains elements with frequency i. Iterate buckets from high to low frequency. Alternative: use heap but bucket sort is O(n).

### Examples

**Example 1:**
- Input: nums = [1,1,1,2,2,3], k = 2
- Output: [1,2]
- Explanation: 1 appears 3 times, 2 appears 2 times

**Example 2:**
- Input: nums = [1], k = 1
- Output: [1]
- Explanation: Single element

### Hints

1. First, count frequency of each element using hash map
2. Use bucket sort: create buckets where index = frequency
3. Iterate buckets from highest frequency to get top k elements
4. This achieves O(n) time complexity

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** Top 2 frequent
- Input: {"nums":[1,1,1,2,2,3],"k":2}
- Expected: [1,2]

**Test 2:** Single element
- Input: {"nums":[1],"k":1}
- Expected: [1]

**Test 3:** All elements
- Input: {"nums":[1,2],"k":2}
- Expected: [1,2]

---

## 9. Minimum Window Substring

**Difficulty:** hard
**Concept:** hash-map
**Additional Concepts:** hash-map, sliding-window
**Family:** hash-map:sliding-window

### Description

Given strings s and t, return minimum window substring of s that contains all characters of t. If no such substring exists, return "".

### Key Insight

Two pointers + two hash maps (target frequency and window frequency). Expand right until valid. Contract left while valid. Track minimum window.

### Examples

**Example 1:**
- Input: s = "ADOBECODEBANC", t = "ABC"
- Output: "BANC"
- Explanation: Minimum window containing A, B, C

**Example 2:**
- Input: s = "a", t = "a"
- Output: "a"
- Explanation: Entire string is minimum window

### Hints

1. Use sliding window with two pointers (left and right)
2. Use hash map to track character frequencies in target and window
3. Expand right to include characters until window is valid
4. Contract left to minimize window while maintaining validity
5. Track the minimum valid window found

### Complexity Analysis

- **Time Complexity:** O(m + n)
- **Space Complexity:** O(m + n)

### Test Cases

**Test 1:** Standard case
- Input: {"s":"ADOBECODEBANC","t":"ABC"}
- Expected: "BANC"

**Test 2:** Single character
- Input: {"s":"a","t":"a"}
- Expected: "a"

**Test 3:** Impossible case
- Input: {"s":"a","t":"aa"}
- Expected: ""

---

## 10. Longest Substring Without Repeating Characters

**Difficulty:** medium
**Concept:** hash-map
**Additional Concepts:** hash-map, sliding-window
**Family:** hash-map:sliding-window

### Description

Given string s, find length of longest substring without repeating characters.

### Key Insight

Use sliding window with hash map tracking last seen index. When duplicate found, move left pointer to max(left, last_seen[char] + 1). Track max length.

### Examples

**Example 1:**
- Input: s = "abcabcbb"
- Output: 3
- Explanation: "abc" has length 3

**Example 2:**
- Input: s = "bbbbb"
- Output: 1
- Explanation: "b" has length 1

**Example 3:**
- Input: s = "pwwkew"
- Output: 3
- Explanation: "wke" has length 3

### Hints

1. Use sliding window with left and right pointers
2. Track last seen index of each character in hash map
3. When you see a duplicate, move left pointer past the previous occurrence
4. Update max length at each step

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(min(n, m)) where m is charset size

### Test Cases

**Test 1:** Substring "abc"
- Input: "abcabcbb"
- Expected: 3

**Test 2:** All same character
- Input: "bbbbb"
- Expected: 1

**Test 3:** Substring "wke"
- Input: "pwwkew"
- Expected: 3

**Test 4:** Empty string
- Input: ""
- Expected: 0

---

## 11. 4Sum II

**Difficulty:** medium
**Concept:** hash-map
**Family:** hash-map:two-sum

### Description

Given four integer arrays nums1, nums2, nums3, nums4, return number of tuples (i,j,k,l) such that nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0.

### Key Insight

Store all sums of nums1[i] + nums2[j] in hash map with frequencies. For each nums3[k] + nums4[l], check if -(nums3[k] + nums4[l]) exists in map. O(n²) instead of O(n⁴).

### Examples

**Example 1:**
- Input: nums1=[1,2], nums2=[-2,-1], nums3=[-1,2], nums4=[0,2]
- Output: 2
- Explanation: Two tuples sum to 0: (0,0,0,1) and (1,0,0,0)

**Example 2:**
- Input: nums1=[0], nums2=[0], nums3=[0], nums4=[0]
- Output: 1
- Explanation: Single tuple (0,0,0,0)

### Hints

1. Split into two pairs: (nums1, nums2) and (nums3, nums4)
2. Store all possible sums of first two arrays in hash map
3. For each sum from last two arrays, check if negative exists in map
4. This reduces O(n⁴) to O(n²)

### Complexity Analysis

- **Time Complexity:** O(n²)
- **Space Complexity:** O(n²)

### Test Cases

**Test 1:** Two valid tuples
- Input: {"nums1":[1,2],"nums2":[-2,-1],"nums3":[-1,2],"nums4":[0,2]}
- Expected: 2

**Test 2:** All zeros
- Input: {"nums1":[0],"nums2":[0],"nums3":[0],"nums4":[0]}
- Expected: 1

---

## 12. Isomorphic Strings

**Difficulty:** easy
**Concept:** hash-map
**Family:** hash-map:bidirectional-mapping

### Description

Given two strings s and t, determine if they are isomorphic. Two strings are isomorphic if characters in s can be replaced to get t, with preserved character order and one-to-one mapping.

### Key Insight

Use two hash maps: s->t mapping and t->s mapping. Ensure bijection (one-to-one and onto). Both directions must be consistent.

### Examples

**Example 1:**
- Input: s = "egg", t = "add"
- Output: true
- Explanation: e->a, g->d

**Example 2:**
- Input: s = "foo", t = "bar"
- Output: false
- Explanation: o cannot map to both a and r

**Example 3:**
- Input: s = "paper", t = "title"
- Output: true
- Explanation: p->t, a->i, e->l, r->e

### Hints

1. Need to check mapping in both directions
2. Use two hash maps: one for s->t, one for t->s
3. Ensure each character in s maps to exactly one in t and vice versa
4. Check for consistency at each step

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1) - at most 256 characters

### Test Cases

**Test 1:** Valid isomorphic
- Input: {"s":"egg","t":"add"}
- Expected: true

**Test 2:** Not one-to-one
- Input: {"s":"foo","t":"bar"}
- Expected: false

**Test 3:** Valid mapping
- Input: {"s":"paper","t":"title"}
- Expected: true

**Test 4:** Not bijective
- Input: {"s":"badc","t":"baba"}
- Expected: false

---

## 13. Word Pattern

**Difficulty:** easy
**Concept:** hash-map
**Family:** hash-map:bidirectional-mapping

### Description

Given pattern and string s, find if s follows the same pattern. Here follow means full match, such that there is bijection between letter in pattern and non-empty word in s.

### Key Insight

Split s into words. Same as isomorphic strings but with words instead of characters. Use two hash maps to ensure bijection.

### Examples

**Example 1:**
- Input: pattern = "abba", s = "dog cat cat dog"
- Output: true
- Explanation: a->dog, b->cat

**Example 2:**
- Input: pattern = "abba", s = "dog cat cat fish"
- Output: false
- Explanation: a cannot map to both dog and fish

**Example 3:**
- Input: pattern = "aaaa", s = "dog cat cat dog"
- Output: false
- Explanation: a cannot map to both dog and cat

### Hints

1. Split the string s into words
2. Check if pattern length matches number of words
3. Use two hash maps: pattern->word and word->pattern
4. Ensure bidirectional mapping is consistent

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n)

### Test Cases

**Test 1:** Valid pattern
- Input: {"pattern":"abba","s":"dog cat cat dog"}
- Expected: true

**Test 2:** Inconsistent mapping
- Input: {"pattern":"abba","s":"dog cat cat fish"}
- Expected: false

**Test 3:** Pattern mismatch
- Input: {"pattern":"aaaa","s":"dog cat cat dog"}
- Expected: false

**Test 4:** Not bijective
- Input: {"pattern":"abba","s":"dog dog dog dog"}
- Expected: false

---
