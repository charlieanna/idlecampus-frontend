# SLIDING-WINDOW Problems

Total Problems: 20

---

## 1. Maximum Sum Subarray (Fixed Window)

**Difficulty:** easy
**Concept:** sliding-window
**Family:** sliding-window:fixed-size

### Description

Find the maximum sum obtainable from any contiguous subarray of length k. Use the running-sum sliding window you just practiced.

### Examples

**Example 1:**
- Input: nums = [1, 4, 2, 9, 5, 1], k = 3
- Output: 16
- Explanation: Window [4, 2, 9] has the maximum sum

### Hints

1. How do you get the sum of the very first window?
2. As you slide the window one step to the right, how does the sum change? What leaves, and what enters?
3. How can you update the sum from the previous step without re-calculating the whole window?
4. You'll need a variable to hold the best sum found so far. When should you update it?

### Starter Code

### Test Cases

**Test 1:** Finds maximum window sum
- Input: "[1, 4, 2, 9, 5, 1], k=3"
- Expected: "16"

**Test 2:** Handles identical values
- Input: "[5, 5, 5], k=2"
- Expected: "10"

---

## 2. Smallest Subarray with Sum ≥ Target

**Difficulty:** medium
**Concept:** sliding-window
**Family:** sliding-window:variable-size

### Description

Given an array of positive integers and a target, find the minimal length of a contiguous subarray whose sum is greater than or equal to target. Return 0 if no such subarray exists.

### Examples

**Example 1:**
- Input: target = 7, nums = [2,3,1,2,4,3]
- Output: 2
- Explanation: Window [4,3] has sum 7 and minimal length 2

### Hints

1. This window's size changes. What two pointers will you need to keep track of its start and end?
2. You need to make the window larger to meet the sum requirement. Which pointer should you move to expand the window?
3. Once your window's sum is large enough, how can you find the *smallest* possible window that still meets the requirement? Which pointer should you move to shrink the window?
4. When do you know it's time to stop shrinking and start expanding again?

### Starter Code

### Test Cases

**Test 1:** Window [4,3]
- Input: "(7, [2,3,1,2,4,3])"
- Expected: "2"

**Test 2:** Window [3,4,5]
- Input: "(11, [1,2,3,4,5])"
- Expected: "3"

---

## 3. Longest Substring Without Repeating Characters

**Difficulty:** medium
**Concept:** sliding-window
**Family:** sliding-window:frequency-map

### Description

Given a string s, return the length of the longest substring without repeating characters.

### Examples

**Example 1:**
- Input: s = "abcabcbb"
- Output: 3
- Explanation: Substring "abc" has length 3

### Hints

1. To check for repeating characters, what data structure could you use to keep track of the characters currently in your window?
2. As you expand your window to the right, what do you do when you encounter a character that's already in your window?
3. If you find a repeat of character 'c' at index `j`, and its last seen position was `i`, where does the new, valid window start?

### Starter Code

### Test Cases

**Test 1:** Substring 'abc'
- Input: "'abcabcbb'"
- Expected: "3"

**Test 2:** Repeated single character
- Input: "'bbbbb'"
- Expected: "1"

---

## 4. Longest Substring with At Most K Distinct Characters (LC 340)

**Difficulty:** medium
**Concept:** sliding-window
**Family:** sliding-window:frequency-map

### Description

Given a string s and an integer k, return the length of the longest substring that contains at most k distinct characters. Use a variable sliding window to track distinct characters efficiently.

### Examples

**Example 1:**
- Input: s = 'eceba', k = 2
- Output: 3
- Explanation: Substring 'ece' has 2 distinct characters

**Example 2:**
- Input: s = 'aa', k = 1
- Output: 2
- Explanation: Entire string has 1 distinct character

### Hints

1. How can you keep track of not just the characters in the window, but how *many* of each there are?
2. As you expand the window, what condition tells you that you've violated the 'at most k distinct characters' rule?
3. When the window is invalid (too many distinct characters), how do you shrink it to make it valid again? Which pointer moves?
4. When you shrink the window, how do you update your character count? What's special about a character's count reaching zero?

### Starter Code

### Test Cases

**Test 1:** Substring 'ece' has 2 distinct chars
- Input: "('eceba', 2)"
- Expected: "3"

**Test 2:** All same character
- Input: "('aa', 1)"
- Expected: "2"

**Test 3:** Substring 'araa' has 2 distinct chars
- Input: "('araaci', 2)"
- Expected: "4"

**Test 4:** Substring 'aa' has 1 distinct char
- Input: "('araaci', 1)"
- Expected: "2"

**Test 5:** Substring 'cbbeb' has 3 distinct chars
- Input: "('cbbebi', 3)"
- Expected: "5"

**Test 6:** Any 3 consecutive chars
- Input: "('abcdef', 3)"
- Expected: "3"

---

## 5. Fruits Into Baskets (At Most 2 Types)

**Difficulty:** medium
**Concept:** sliding-window
**Family:** sliding-window:frequency-map

### Description

You are given an array fruits where fruits[i] is a type ID. Return the length of the longest subarray that contains at most two distinct types.

### Examples

**Example 1:**
- Input: fruits = [1,2,1]
- Output: 3
- Explanation: Whole array has at most 2 types

### Hints

1. This problem sounds familiar. How does it relate to the 'at most K distinct characters' problem? What is the value of K here?
2. What data structure will you use to track the 'types' of fruit in your window?
3. When your window contains more than two types of fruit, what action should you take?

### Starter Code

### Test Cases

**Test 1:** Whole array valid
- Input: "([1,2,1],)"
- Expected: "3"

**Test 2:** [1,2,2]
- Input: "([0,1,2,2],)"
- Expected: "3"

---

## 6. Smallest Subarray with Sum ≥ Target (Optimized)

**Difficulty:** medium
**Concept:** sliding-window
**Family:** sliding-window:variable-size

### Description

Re-implement the smallest subarray with sum ≥ target in O(n) by expanding and shrinking the window.

### Examples

**Example 1:**
- Input: target = 7, nums = [2,3,1,2,4,3]
- Output: 2
- Explanation: Window [4,3] has sum 7

### Hints

1. This is a 'variable window' problem. What are the two main actions you'll perform with your window?
2. What condition tells you it's time to stop expanding the window and start shrinking it?
3. Every time you have a valid window (sum >= target), what should you do? How do you then try to find an even *better* solution from there?

### Starter Code

### Test Cases

**Test 1:** [4,3]
- Input: "(7, [2,3,1,2,4,3])"
- Expected: "2"

**Test 2:** Whole array
- Input: "(15, [1,2,3,4,5])"
- Expected: "5"

---

## 7. Permutation in String (LC 567)

**Difficulty:** medium
**Concept:** sliding-window

### Description

Given two strings s1 and s2, return true if s2 contains a permutation of s1; otherwise false. A permutation is a rearrangement of all characters with the same frequency.

### Examples

**Example 1:**
- Input: s1 = 'ab', s2 = 'eidbaooo'
- Output: true
- Explanation: Contains 'ba' which is a permutation of 'ab'

**Example 2:**
- Input: s1 = 'ab', s2 = 'eidboaoo'
- Output: false
- Explanation: No permutation of 'ab' exists in s2

### Hints

1. What defines a permutation? How does this relate to character counts?
2. Since any anagram of s1 will have the same length as s1, what does this tell you about the type of sliding window you should use?
3. How can you efficiently compare the character counts of your current window in s2 with the character counts of s1?
4. Instead of re-calculating the window's character counts each time, how can you update it in O(1) as you slide?

### Starter Code

### Test Cases

**Test 1:** Contains permutation 'ba'
- Input: "('ab', 'eidbaooo')"
- Expected: "true"

**Test 2:** No permutation present
- Input: "('ab', 'eidboaoo')"
- Expected: "false"

**Test 3:** Permutation at end
- Input: "('adc', 'dcda')"
- Expected: "true"

**Test 4:** Similar but not exact
- Input: "('hello', 'ooolleoooleh')"
- Expected: "false"

---

## 8. Minimum Window Substring (LC 76)

**Difficulty:** hard
**Concept:** sliding-window

### Description

Given strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If no such substring exists, return empty string.

### Examples

**Example 1:**
- Input: s = 'ADOBECODEBANC', t = 'ABC'
- Output: 'BANC'
- Explanation: Minimum window containing all characters of t

**Example 2:**
- Input: s = 'a', t = 'aa'
- Output: ''
- Explanation: Need two 'a's but only have one

### Hints

1. What information do you need to track about the characters in `t`?
2. You'll need to know when your current window in `s` contains all the required characters from `t`. How can you track this progress?
3. Once your window is 'valid' (contains all required characters), what is your goal? How do you move the pointers to achieve that goal?
4. When shrinking the window from the left, how do you know if the window is still valid?

### Starter Code

### Test Cases

**Test 1:** Minimum window at end
- Input: "('ADOBECODEBANC', 'ABC')"
- Expected: "'BANC'"

**Test 2:** Single character match
- Input: "('a', 'a')"
- Expected: "'a'"

**Test 3:** Insufficient characters
- Input: "('a', 'aa')"
- Expected: "''"

**Test 4:** Single char window
- Input: "('ab', 'b')"
- Expected: "'b'"

**Test 5:** Entire string needed
- Input: "('abc', 'cba')"
- Expected: "'abc'"

---

## 9. Longest Substring with At Most Two Distinct Characters (LC 159)

**Difficulty:** medium
**Concept:** sliding-window

### Description

Given a string s, return the length of the longest substring that contains at most two distinct characters.

### Examples

**Example 1:**
- Input: s = 'eceba'
- Output: 3
- Explanation: Substring 'ece' has length 3

**Example 2:**
- Input: s = 'ccaabbb'
- Output: 5
- Explanation: Substring 'aabbb' has length 5

### Hints

1. This is a variation of a problem you've already seen. Which one is it similar to, and what is the key parameter?
2. What data structure is essential for tracking the number of distinct characters in your window?
3. What condition tells you the window has become invalid and needs to shrink?
4. When you shrink the window, how do you update your character tracking data structure?

### Starter Code

### Test Cases

**Test 1:** Substring 'ece'
- Input: "('eceba',)"
- Expected: "3"

**Test 2:** Substring 'aabbb'
- Input: "('ccaabbb',)"
- Expected: "5"

**Test 3:** Single character
- Input: "('a',)"
- Expected: "1"

**Test 4:** Any two adjacent distinct chars
- Input: "('abcabcabc',)"
- Expected: "2"

---

## 10. Sliding Window Maximum (LC 239)

**Difficulty:** hard
**Concept:** sliding-window

### Description

Given an array nums and a sliding window of size k, return an array of the maximum values in each window as it slides from left to right.

### Examples

**Example 1:**
- Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
- Output: [3,3,5,5,6,7]
- Explanation: Window [1,3,-1] max is 3, window [3,-1,-3] max is 3, etc.

### Hints

1. A simple sliding window can't find the max in O(1). What data structure can maintain an ordered set of elements while allowing efficient additions and removals from both ends?
2. How can you use a deque to always know the maximum element in the current window?
3. As you add a new element `nums[i]` to the window, what should you do with elements in the deque that are smaller than `nums[i]`?
4. Before adding a new window's max to your results, how do you ensure the max currently at the front of the deque is actually within the current window?

### Starter Code

### Test Cases

**Test 1:** Standard sliding window
- Input: "([1,3,-1,-3,5,3,6,7], 3)"
- Expected: "[3,3,5,5,6,7]"

**Test 2:** Single element
- Input: "([1], 1)"
- Expected: "[1]"

**Test 3:** Window size 1
- Input: "([1,-1], 1)"
- Expected: "[1,-1]"

**Test 4:** Window equals array
- Input: "([9,11], 2)"
- Expected: "[11]"

**Test 5:** Decreasing values
- Input: "([4,3,2,1], 2)"
- Expected: "[4,3,2]"

---

## 11. Find K Closest Elements (LC 658)

**Difficulty:** medium
**Concept:** sliding-window

### Description

Given a sorted array arr, two integers k and x, return the k closest integers to x in the array. The result should be sorted in ascending order. If there is a tie, prefer the smaller element.

### Examples

**Example 1:**
- Input: arr = [1,2,3,4,5], k = 4, x = 3
- Output: [1,2,3,4]
- Explanation: These 4 elements are closest to 3

**Example 2:**
- Input: arr = [1,2,3,4,5], k = 4, x = -1
- Output: [1,2,3,4]
- Explanation: First 4 elements when target before array

### Hints

1. The result is a contiguous subarray of size `k`. What does that tell you about the window type?
2. Instead of finding the window, can you find the starting element of the window?
3. Consider a window of size `k+1`. To shrink it to size `k`, you must remove one element. Which one should you remove: the one on the left or the one on the right?
4. Can you use two pointers starting at the ends of the array, moving inwards, to discard the elements furthest from `x` until only `k` remain?

### Starter Code

### Test Cases

**Test 1:** Closest to middle element
- Input: "([1,2,3,4,5], 4, 3)"
- Expected: "[1,2,3,4]"

**Test 2:** Target before array
- Input: "([1,2,3,4,5], 4, -1)"
- Expected: "[1,2,3,4]"

**Test 3:** Target after array
- Input: "([1,2,3,4,5], 4, 6)"
- Expected: "[2,3,4,5]"

**Test 4:** Target between elements
- Input: "([1,3,5,7,9], 3, 6)"
- Expected: "[5,7,9]"

**Test 5:** Duplicates in array
- Input: "([0,1,2,2,2,3,6,8,8,9], 5, 9)"
- Expected: "[3,6,8,8,9]"

---

## 12. Longest Repeating Character Replacement (LC 424)

**Difficulty:** medium
**Concept:** sliding-window

### Description

Given a string s and an integer k, you can choose any character and change it to any other uppercase English character at most k times. Return the length of the longest substring containing the same letter you can get after performing the above operations.

### Examples

**Example 1:**
- Input: s = 'ABAB', k = 2
- Output: 4
- Explanation: Change both A's to B's or vice versa to get 'BBBB' or 'AAAA'

**Example 2:**
- Input: s = 'AABABBA', k = 1
- Output: 4
- Explanation: Change one B to A to get 'AAAA'

### Hints

1. What defines a valid window? It's a relationship between the window's length, the count of its most frequent character, and `k`. What is that relationship?
2. How can you keep track of the counts of all characters within the current window?
3. How do you efficiently track the count of the *most frequent* character as the window slides?
4. What condition tells you that your window is invalid and needs to be shrunk from the left?

### Starter Code

### Test Cases

**Test 1:** Replace both to same char
- Input: "('ABAB', 2)"
- Expected: "4"

**Test 2:** One replacement needed
- Input: "('AABABBA', 1)"
- Expected: "4"

**Test 3:** No replacements needed
- Input: "('AAAA', 0)"
- Expected: "4"

**Test 4:** Limited by k
- Input: "('ABCDE', 1)"
- Expected: "2"

**Test 5:** Extend with replacements
- Input: "('AAABBB', 2)"
- Expected: "5"

---

## 13. Find All Anagrams in a String (LC 438)

**Difficulty:** medium
**Concept:** sliding-window

### Description

Given two strings s and p, return an array of all the start indices of p's anagrams in s. An anagram is a permutation with the same character frequencies.

### Examples

**Example 1:**
- Input: s = 'cbaebabacd', p = 'abc'
- Output: [0, 6]
- Explanation: Anagrams at indices 0 ('cba') and 6 ('bac')

**Example 2:**
- Input: s = 'abab', p = 'ab'
- Output: [0, 1, 2]
- Explanation: Anagrams at indices 0, 1, and 2

### Hints

1. What makes a string an anagram of another? What does this imply about their character counts?
2. Since an anagram of `p` must have the same length as `p`, what kind of sliding window should you use?
3. How can you efficiently check if the character counts in your current window match the character counts of `p`?
4. Consider using two frequency maps: one for `p` and one for the current window in `s`. How do you update the window's map as you slide?

### Starter Code

### Test Cases

**Test 1:** Multiple anagrams found
- Input: "('cbaebabacd', 'abc')"
- Expected: "[0, 6]"

**Test 2:** Overlapping anagrams
- Input: "('abab', 'ab')"
- Expected: "[0, 1, 2]"

**Test 3:** Single anagram at end
- Input: "('baa', 'aa')"
- Expected: "[1]"

**Test 4:** All same character
- Input: "('aaaaaaa', 'aaa')"
- Expected: "[0, 1, 2, 3, 4]"

---

## 14. Substring with Concatenation of All Words (LC 30)

**Difficulty:** hard
**Concept:** sliding-window

### Description

Given a string s and an array of words (all same length), find all starting indices where s contains a concatenation of each word exactly once without any intervening characters.

### Examples

**Example 1:**
- Input: s = 'barfoothefoobarman', words = ['foo','bar']
- Output: [0, 9]
- Explanation: Index 0: 'barfoo', Index 9: 'foobar'

**Example 2:**
- Input: s = 'wordgoodgoodgoodbestword', words = ['word','good','best','word']
- Output: []
- Explanation: No valid concatenation

### Hints

1. All words are the same length. What is the total length of a valid concatenated substring?
2. How can you keep track of the words you need to find, and how many of each?
3. You can slide a window of the total required length. Inside that window, how do you check if it's composed of the correct words?
4. Instead of sliding one character at a time, what if you slide one *word* at a time? How many different starting points would you need to check?

### Starter Code

### Test Cases

**Test 1:** Two valid concatenations
- Input: "('barfoothefoobarman', ['foo','bar'])"
- Expected: "[0, 9]"

**Test 2:** No valid concatenation
- Input: "('wordgoodgoodgoodbestword', ['word','good','best','word'])"
- Expected: "[]"

**Test 3:** Multiple overlapping matches
- Input: "('barfoofoobarthefoobarman', ['bar','foo','the'])"
- Expected: "[6, 9, 12]"

**Test 4:** Complex pattern
- Input: "('lingmindraboofooowingdingbarrwingmonkeypoundcake', ['fooo','barr','wing','ding','wing'])"
- Expected: "[13]"

---

## 15. Max Consecutive Ones III (LC 1004)

**Difficulty:** medium
**Concept:** sliding-window

### Description

Given a binary array nums and an integer k, return the maximum number of consecutive 1's in the array if you can flip at most k 0's to 1's.

### Examples

**Example 1:**
- Input: nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2
- Output: 6
- Explanation: Flip 0's at indices 4 and 5 to get [1,1,1,0,0,1,1,1,1,1,1]

**Example 2:**
- Input: nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3
- Output: 10
- Explanation: Flip 3 zeros optimally

### Hints

1. What is the condition that makes a window 'valid' in this problem?
2. How can you keep track of how many 'flips' you've used in your current window?
3. If you use too many flips (i.e., you have more than `k` zeros), how do you make the window valid again?
4. When should you update your 'longest subarray' answer?

### Starter Code

### Test Cases

**Test 1:** Flip 2 zeros
- Input: "([1,1,1,0,0,0,1,1,1,1,0], 2)"
- Expected: "6"

**Test 2:** Flip 3 zeros optimally
- Input: "([0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], 3)"
- Expected: "10"

**Test 3:** No flips needed
- Input: "([1,1,1,1], 0)"
- Expected: "4"

**Test 4:** All zeros, limited by k
- Input: "([0,0,0,0], 2)"
- Expected: "2"

---

## 16. Subarray Product Less Than K (LC 713)

**Difficulty:** medium
**Concept:** sliding-window

### Description

Given an array of positive integers nums and a positive integer k, return the number of contiguous subarrays where the product of all elements is strictly less than k.

### Examples

**Example 1:**
- Input: nums = [10,5,2,6], k = 100
- Output: 8
- Explanation: [10], [5], [2], [6], [10,5], [5,2], [2,6], [5,2,6]

**Example 2:**
- Input: nums = [1,2,3], k = 0
- Output: 0
- Explanation: No valid subarrays (k is 0)

### Hints

1. What is the condition that makes your window invalid?
2. As you expand the window to the right with a new element, how many *new* valid subarrays have you just created?
3. Think about a valid window from `left` to `right`. The new element `nums[right]` creates `right - left + 1` new subarrays: `[nums[right]]`, `[nums[right-1], nums[right]]`, etc. Are all of these valid?
4. When the product becomes too large, what action must you take? How does this affect the product?

### Starter Code

### Test Cases

**Test 1:** Multiple valid subarrays
- Input: "([10,5,2,6], 100)"
- Expected: "8"

**Test 2:** k too small
- Input: "([1,2,3], 0)"
- Expected: "0"

**Test 3:** All products are 1
- Input: "([1,1,1], 2)"
- Expected: "6"

**Test 4:** Complex array
- Input: "([10,9,10,4,3,8,3,3,6,2,10,10,9,3], 19)"
- Expected: "18"

---

## 17. Minimum Size Subarray Sum (LC 209)

**Difficulty:** medium
**Concept:** sliding-window

### Description

Given an array of positive integers nums and a positive integer target, return the minimal length of a subarray whose sum is greater than or equal to target. If there is no such subarray, return 0.

### Examples

**Example 1:**
- Input: target = 7, nums = [2,3,1,2,4,3]
- Output: 2
- Explanation: [4,3] has sum 7 and minimal length

**Example 2:**
- Input: target = 11, nums = [1,1,1,1,1,1,1,1]
- Output: 0
- Explanation: No valid subarray

### Hints

1. This is a classic variable window problem. What condition triggers the window to expand, and what condition triggers it to shrink?
2. When your window's sum is `>= target`, you have a potential answer. What should you record?
3. After finding a valid window, how can you see if an even *smaller* valid window exists starting nearby?
4. What should your function return if no subarray ever meets the target sum?

### Starter Code

### Test Cases

**Test 1:** Minimum window [4,3]
- Input: "(7, [2,3,1,2,4,3])"
- Expected: "2"

**Test 2:** No valid subarray
- Input: "(11, [1,1,1,1,1,1,1,1])"
- Expected: "0"

**Test 3:** Entire array needed
- Input: "(15, [1,2,3,4,5])"
- Expected: "5"

**Test 4:** Single element sufficient
- Input: "(4, [1,4,4])"
- Expected: "1"

---

## 18. Frequency of the Most Frequent Element (LC 1838)

**Difficulty:** medium
**Concept:** sliding-window

### Description

Given an array nums and an integer k, you can increment any element by 1 at most k times. Return the maximum possible frequency of any element after at most k operations.

### Examples

**Example 1:**
- Input: nums = [1,2,4], k = 5
- Output: 3
- Explanation: Increment 1 to 4 (3 ops) and 2 to 4 (2 ops). All three are 4.

**Example 2:**
- Input: nums = [1,4,8,13], k = 5
- Output: 2
- Explanation: Make two elements equal to 8

### Hints

1. Why is sorting the array a helpful first step?
2. For any subarray (window), what is the most 'cost-effective' number to make all elements equal to? The smallest? The largest? The average?
3. For a window from `left` to `right`, how do you calculate the 'cost' to make all its elements equal to `nums[right]`?
4. What is the condition on this 'cost' that makes a window invalid and forces you to shrink it?

### Starter Code

### Test Cases

**Test 1:** Make all elements 4
- Input: "([1,2,4], 5)"
- Expected: "3"

**Test 2:** Make two elements 8
- Input: "([1,4,8,13], 5)"
- Expected: "2"

**Test 3:** Limited operations
- Input: "([3,9,6], 2)"
- Expected: "1"

**Test 4:** Make all same
- Input: "([9940,9995,9935,9999,9940,9964,9943,9963,9964,9982], 3056)"
- Expected: "10"

---

## 19. Grumpy Bookstore Owner (LC 1052)

**Difficulty:** medium
**Concept:** sliding-window

### Description

A bookstore owner is grumpy for some minutes. If grumpy, customers during that minute are not satisfied. You have a technique to keep the owner not grumpy for minutes minutes straight. Return the maximum number of satisfied customers.

### Examples

**Example 1:**
- Input: customers = [1,0,1,2,1,1,7,5], grumpy = [0,1,0,1,0,1,0,1], minutes = 3
- Output: 16
- Explanation: Use technique on window [3,4,5] to save 2+1+1=4 customers

**Example 2:**
- Input: customers = [1], grumpy = [0], minutes = 1
- Output: 1
- Explanation: Single element, already satisfied

### Hints

1. How can you calculate the number of customers that are *always* satisfied, regardless of your special technique?
2. The problem then reduces to finding the best time to use your 'minutes' technique. What are you trying to maximize in that `minutes`-long window?
3. What kind of sliding window should you use to find the maximum number of *extra* satisfied customers you can get?
4. Once you find the maximum possible 'gain' from using your technique, how do you combine that with the baseline number of satisfied customers?

### Starter Code

### Test Cases

**Test 1:** Optimal window saves 4 customers
- Input: "([1,0,1,2,1,1,7,5], [0,1,0,1,0,1,0,1], 3)"
- Expected: "16"

**Test 2:** Single element, already satisfied
- Input: "([1], [0], 1)"
- Expected: "1"

**Test 3:** Use technique at start
- Input: "([4,10,10], [1,1,0], 2)"
- Expected: "24"

**Test 4:** Choose best single minute
- Input: "([2,6,6,9], [0,0,1,1], 1)"
- Expected: "17"

---

## 20. Longest Continuous Subarray With Absolute Diff ≤ Limit (LC 1438)

**Difficulty:** medium
**Concept:** sliding-window

### Description

Given an array nums and an integer limit, return the size of the longest subarray where the absolute difference between any two elements is less than or equal to limit.

### Examples

**Example 1:**
- Input: nums = [8,2,4,7], limit = 4
- Output: 2
- Explanation: [2,4] or [4,7] both have max diff 2 and 3 respectively

**Example 2:**
- Input: nums = [10,1,2,4,7,2], limit = 5
- Output: 4
- Explanation: Window [2,4,7,2] has max diff 5

### Hints

1. To check the condition `max - min <= limit`, you need to know the min and max of the current window. How can you do this efficiently as the window slides?
2. This is a 'variable window' problem. What condition makes the window invalid and forces it to shrink?
3. Consider using two deques: one to track the indices of maximums (in decreasing order) and one for minimums (in increasing order). How does this help?
4. When the window `[left...right]` is invalid, which pointer do you move? How do you update the deques?

### Starter Code

### Test Cases

**Test 1:** Window size 2
- Input: "([8,2,4,7], 4)"
- Expected: "2"

**Test 2:** Window [2,4,7,2]
- Input: "([10,1,2,4,7,2], 5)"
- Expected: "4"

**Test 3:** Only equal elements allowed
- Input: "([4,2,2,2,4,4,2,2], 0)"
- Expected: "3"

**Test 4:** Complex pattern
- Input: "([1,5,6,7,8,10,6,5,6], 4)"
- Expected: "5"

---
