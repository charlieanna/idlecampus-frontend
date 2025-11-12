# BACKTRACKING-TREES Problems

Total Problems: 49

---

## 1. Subsets

**Difficulty:** easy
**Concept:** backtracking-trees
**Family:** backtracking:subsets

### Description

Given an integer array nums, return all possible subsets (the power set). The solution set must not contain duplicate subsets.

### Key Insight

At each level, we have a binary choice: include the current element or exclude it. This creates a perfect binary tree where every path from root to leaf represents a valid subset.

### Examples

**Example 1:**
- Input: [1,2]
- Output: [[],[1],[2],[1,2]]
- Explanation: All possible subsets of [1,2]: empty set, {1}, {2}, and {1,2}

### Hints

1. Think of a binary tree where left branch = exclude element, right branch = include element
2. Base case: when you've made a decision for all elements (index == len(nums))
3. At each step, you have 2 choices: include nums[index] or skip it
4. Don't forget to make a copy when adding current to result: current[:]
5. For n elements, you'll have 2^n subsets total

### Starter Code

**Python:**
```python
def subsets(nums):
    """
    Generate all subsets using backtracking.
    
    Args:
        nums: List[int] - array of unique integers
    
    Returns:
        List[List[int]] - all possible subsets
    """
    result = []
    current = []
    
    def backtrack(index):
        # TODO: Base case - processed all elements
        # result.append(current[:])
        
        # TODO: Try including/excluding each remaining element
        pass
    
    backtrack(0)
    return result
```

**JavaScript:**
```javascript
function subsets(nums) {
    """
    Generate all subsets using backtracking.
    
    Args:
        nums: Array - array of unique integers
    
    Returns:
        Array] - all possible subsets
    """
    result = []
    current = []
    
    function backtrack(index) {
        // TODO: Base case - processed all elements
        # result.append(current[:])
        
        // TODO: Try including/excluding each remaining element
  // TODO: implement
    backtrack(0)
    return result
```

### Solution

**Python:**
```python
def subsets(nums):
    result = []
    current = []
    
    def backtrack(index):
        # Every node in tree is a valid subset
        result.append(current[:])
        
        # Try including each remaining element
        for i in range(index, len(nums)):
            current.append(nums[i])
            backtrack(i + 1)
            current.pop()
    
    backtrack(0)
    return result
```

**JavaScript:**
```javascript
function subsets(nums) {
    result = []
    current = []
    
    function backtrack(index) {
        # Every node in tree is a valid subset
        result.append(current[:])
        
        # Try including each remaining element
        for i in range(index, len(nums)):
            current.append(nums[i])
            backtrack(i + 1)
            current.pop()
    
    backtrack(0)
    return result
```

### Test Cases

**Test 1:** Basic case with 2 elements
- Input: "subsets([1,2])"
- Expected: "[[],[1],[2],[1,2]]"

**Test 2:** Three elements produce 8 subsets
- Input: "subsets([1,2,3])"
- Expected: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]"

**Test 3:** Single element
- Input: "subsets([0])"
- Expected: "[[],[0]]"

**Test 4:** PERFORMANCE: 15 elements (2^15 = 32K subsets) - Must use efficient backtracking with proper copying
- Input: "subsets(list(range(15)))"
- Expected: "str(len([[]])) + \" is wrong, should be 32768\""

---

## 2. Permutations

**Difficulty:** medium
**Concept:** backtracking-trees
**Family:** backtracking:permutations

### Description

Given an array nums of distinct integers, return all possible permutations in any order.

### Key Insight

This creates an n-ary tree where each level represents choosing one position to fill. At level 1, we have n choices; at level 2, we have n-1 choices (excluding what we already used), and so on.

### Examples

**Example 1:**
- Input: ["A","B"]
- Output: [["A","B"],["B","A"]]
- Explanation: Two ways to arrange A and B: A first or B first

### Hints

1. Think of an n-ary tree: at each level, branch out to all unused elements
2. Track which elements you've already used in the current path
3. Base case: when current permutation has same length as input (all elements used)
4. At each step, try every element that hasn't been used yet
5. For n elements, you'll have n! permutations total

### Starter Code

**Python:**
```python
def permute(nums):
    """
    Generate all permutations using backtracking.
    
    Args:
        nums: List[int] - array of distinct integers
    
    Returns:
        List[List[int]] - all possible permutations
    """
    result = []
    current = []
    
    def backtrack(remaining):
        # TODO: Base case - used all elements
        # if not remaining:
        #     result.append(current[:])
        #     return
        
        # TODO: Try each remaining element as next choice
        pass
    
    backtrack(nums)
    return result
```

**JavaScript:**
```javascript
function permute(nums) {
    """
    Generate all permutations using backtracking.
    
    Args:
        nums: Array - array of distinct integers
    
    Returns:
        Array] - all possible permutations
    """
    result = []
    current = []
    
    function backtrack(remaining) {
        // TODO: Base case - used all elements
        # if not remaining:
        #     result.append(current[:])
        #     return
        
        // TODO: Try each remaining element as next choice
  // TODO: implement
    backtrack(nums)
    return result
```

### Solution

**Python:**
```python
def permute(nums):
    result = []
    current = []
    
    def backtrack(remaining):
        if not remaining:
            result.append(current[:])
            return
        
        for i in range(len(remaining)):
            current.append(remaining[i])
            backtrack(remaining[:i] + remaining[i+1:])
            current.pop()
    
    backtrack(nums)
    return result
```

**JavaScript:**
```javascript
function permute(nums) {
    result = []
    current = []
    
    function backtrack(remaining) {
        if not remaining:
            result.append(current[:])
            return
        
        for i in range(len(remaining)):
            current.append(remaining[i])
            backtrack(remaining[:i] + remaining[i+1:])
            current.pop()
    
    backtrack(nums)
    return result
```

### Test Cases

**Test 1:** Two elements have 2! = 2 permutations
- Input: "permute([1,2])"
- Expected: "[[1,2],[2,1]]"

**Test 2:** Three elements have 3! = 6 permutations
- Input: "permute([1,2,3])"
- Expected: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]"

**Test 3:** Single element
- Input: "permute([1])"
- Expected: "[[1]]"

**Test 4:** PERFORMANCE: 10 elements (10! = 3.6M permutations) - Must use efficient backtracking with swap/unswap or slicing
- Input: "permute(list(range(10)))"
- Expected: "str(len([[]])) + \" is wrong, should be 3628800\""

---

## 3. Combinations

**Difficulty:** medium
**Concept:** backtracking-trees
**Family:** backtracking:combinations

### Description

Given two integers n and k, return all possible combinations of k numbers chosen from the range [1, n].

### Key Insight

This is a pruned tree where we only explore combinations, not permutations. We avoid duplicates by only considering elements after the current index, creating a strictly increasing sequence.

### Examples

**Example 1:**
- Input: n=4, k=2
- Output: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
- Explanation: All 2-element combinations from [1,2,3,4]

### Hints

1. Unlike permutations, [1,2] and [2,1] are the same combination
2. Use a start index to only consider numbers greater than current
3. Base case: when current combination has k elements
4. Prune: if remaining numbers can't fill k slots, stop early
5. Total combinations = C(n,k) = n!/(k!(n-k)!)

### Starter Code

**Python:**
```python
def combine(n, k):
    """
    Generate all k-sized combinations from 1 to n.
    
    Args:
        n: int - range of numbers [1, n]
        k: int - size of each combination
    
    Returns:
        List[List[int]] - all combinations
    """
    result = []
    current = []
    
    def backtrack(start):
        # TODO: Base case - combination is complete
        # if len(current) == k:
        #     result.append(current[:])
        #     return
        
        # TODO: Try each number from start to n
        pass
    
    backtrack(1)
    return result
```

**JavaScript:**
```javascript
function combine(n, k) {
    """
    Generate all k-sized combinations from 1 to n.
    
    Args:
        n: int - range of numbers [1, n]
        k: int - size of each combination
    
    Returns:
        Array] - all combinations
    """
    result = []
    current = []
    
    function backtrack(start) {
        // TODO: Base case - combination is complete
        # if len(current) == k:
        #     result.append(current[:])
        #     return
        
        // TODO: Try each number from start to n
  // TODO: implement
    backtrack(1)
    return result
```

### Solution

**Python:**
```python
def combine(n, k):
    result = []
    current = []
    
    def backtrack(start):
        if len(current) == k:
            result.append(current[:])
            return
        
        # Pruning: need (k - len(current)) more elements
        # Can only get them from [start, n]
        for i in range(start, n + 1):
            current.append(i)
            backtrack(i + 1)
            current.pop()
    
    backtrack(1)
    return result
```

**JavaScript:**
```javascript
function combine(n, k) {
    result = []
    current = []
    
    function backtrack(start) {
        if len(current) == k:
            result.append(current[:])
            return
        
        # Pruning: need (k - len(current)) more elements
        # Can only get them from [start, n]
        for i in range(start, n + 1):
            current.append(i)
            backtrack(i + 1)
            current.pop()
    
    backtrack(1)
    return result
```

### Test Cases

**Test 1:** Choose 2 from 4 numbers
- Input: "combine(4, 2)"
- Expected: "[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]"

**Test 2:** Only one way to choose all elements
- Input: "combine(3, 3)"
- Expected: "[[1,2,3]]"

**Test 3:** Edge case: single element
- Input: "combine(1, 1)"
- Expected: "[[1]]"

---

## 4. Letter Combinations of a Phone Number

**Difficulty:** medium
**Concept:** backtracking-trees
**Family:** backtracking:combinations

### Description

Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent (like old phone keypads).

### Key Insight

Multi-way branching tree where each digit creates 3-4 branches (depending on the digit). Each level processes one digit, branching to all its possible letters.

### Examples

**Example 1:**
- Input: "23"
- Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
- Explanation: Digit 2 maps to "abc", digit 3 maps to "def". All combinations of one letter from each.

### Hints

1. Create a mapping dictionary: digit -> letters
2. Each digit creates 3 or 4 branches (7 and 9 have 4 letters)
3. Base case: when you've processed all digits (index == len(digits))
4. At each level, loop through all letters for digits[index]
5. Join the letters into a string when adding to result

### Starter Code

**Python:**
```python
def letter_combinations(digits):
    """
    Generate all letter combinations for phone digits.
    
    Args:
        digits: str - string of digits 2-9
    
    Returns:
        List[str] - all letter combinations
    """
    if not digits:
        return []
    
    phone = {
        '2': 'abc', '3': 'def', '4': 'ghi',
        '5': 'jkl', '6': 'mno', '7': 'pqrs',
        '8': 'tuv', '9': 'wxyz'
    }
    
    result = []
    current = []
    
    def backtrack(index):
        # TODO: Base case - processed all digits
        # if index == len(digits):
        #     result.append(''.join(current))
        #     return
        
        # TODO: Try each letter for current digit
        pass
    
    backtrack(0)
    return result
```

**JavaScript:**
```javascript
function letter_combinations(digits) {
    """
    Generate all letter combinations for phone digits.
    
    Args:
        digits: str - string of digits 2-9
    
    Returns:
        Array - all letter combinations
    """
    if not digits:
        return []
    
    phone = {
        '2': 'abc', '3': 'def', '4': 'ghi',
        '5': 'jkl', '6': 'mno', '7': 'pqrs',
        '8': 'tuv', '9': 'wxyz'
    }
    
    result = []
    current = []
    
    function backtrack(index) {
        // TODO: Base case - processed all digits
        # if index == len(digits):
        #     result.append(''.join(current))
        #     return
        
        // TODO: Try each letter for current digit
  // TODO: implement
    backtrack(0)
    return result
```

### Solution

**Python:**
```python
def letter_combinations(digits):
    if not digits:
        return []
    
    phone = {
        '2': 'abc', '3': 'def', '4': 'ghi',
        '5': 'jkl', '6': 'mno', '7': 'pqrs',
        '8': 'tuv', '9': 'wxyz'
    }
    
    result = []
    current = []
    
    def backtrack(index):
        if index == len(digits):
            result.append(''.join(current))
            return
        
        for letter in phone[digits[index]]:
            current.append(letter)
            backtrack(index + 1)
            current.pop()
    
    backtrack(0)
    return result
```

**JavaScript:**
```javascript
function letter_combinations(digits) {
    if not digits:
        return []
    
    phone = {
        '2': 'abc', '3': 'def', '4': 'ghi',
        '5': 'jkl', '6': 'mno', '7': 'pqrs',
        '8': 'tuv', '9': 'wxyz'
    }
    
    result = []
    current = []
    
    function backtrack(index) {
        if index == len(digits):
            result.append(''.join(current))
            return
        
        for letter in phone[digits[index]]:
            current.append(letter)
            backtrack(index + 1)
            current.pop()
    
    backtrack(0)
    return result
```

### Test Cases

**Test 1:** Two digits with 3 letters each
- Input: "letter_combinations(\"23\")"
- Expected: "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]"

**Test 2:** Single digit
- Input: "letter_combinations(\"2\")"
- Expected: "[\"a\",\"b\",\"c\"]"

**Test 3:** Empty input
- Input: "letter_combinations(\"\")"
- Expected: "[]"

---

## 5. Generate Parentheses

**Difficulty:** medium
**Concept:** backtracking-trees
**Family:** backtracking:generate-parentheses

### Description

Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.

### Key Insight

Constrained binary tree: at each step, we can add "(" or ")" BUT with constraints: can only add "(" if we have remaining, and can only add ")" if it would not exceed number of "(" already placed.

### Examples

**Example 1:**
- Input: n=2
- Output: ["(())","()()"]
- Explanation: Two valid ways to arrange 2 pairs of parentheses

### Hints

1. Track count of opening and closing parentheses used so far
2. Can add "(" if open_count < n
3. Can add ")" if close_count < open_count (ensures validity)
4. Base case: when we've added 2*n characters total
5. This constraint creates a pruned binary tree

### Starter Code

**Python:**
```python
def generate_parenthesis(n):
    """
    Generate all valid parentheses combinations.
    
    Args:
        n: int - number of pairs of parentheses
    
    Returns:
        List[str] - all valid combinations
    """
    result = []
    current = []
    
    def backtrack(open_count, close_count):
        # TODO: Base case - used all n pairs
        # if len(current) == 2 * n:
        #     result.append(''.join(current))
        #     return
        
        # TODO: Add '(' if we haven't used all n opening parens
        # TODO: Add ')' if it won't exceed number of '(' 
        pass
    
    backtrack(0, 0)
    return result
```

**JavaScript:**
```javascript
function generate_parenthesis(n) {
    """
    Generate all valid parentheses combinations.
    
    Args:
        n: int - number of pairs of parentheses
    
    Returns:
        Array - all valid combinations
    """
    result = []
    current = []
    
    function backtrack(open_count, close_count) {
        // TODO: Base case - used all n pairs
        # if len(current) == 2 * n:
        #     result.append(''.join(current))
        #     return
        
        // TODO: Add '(' if we haven't used all n opening parens
        // TODO: Add ')' if it won't exceed number of '(' 
  // TODO: implement
    backtrack(0, 0)
    return result
```

### Solution

**Python:**
```python
def generate_parenthesis(n):
    result = []
    current = []
    
    def backtrack(open_count, close_count):
        if len(current) == 2 * n:
            result.append(''.join(current))
            return
        
        if open_count < n:
            current.append('(')
            backtrack(open_count + 1, close_count)
            current.pop()
        
        if close_count < open_count:
            current.append(')')
            backtrack(open_count, close_count + 1)
            current.pop()
    
    backtrack(0, 0)
    return result
```

**JavaScript:**
```javascript
function generate_parenthesis(n) {
    result = []
    current = []
    
    function backtrack(open_count, close_count) {
        if len(current) == 2 * n:
            result.append(''.join(current))
            return
        
        if open_count < n:
            current.append('(')
            backtrack(open_count + 1, close_count)
            current.pop()
        
        if close_count < open_count:
            current.append(')')
            backtrack(open_count, close_count + 1)
            current.pop()
    
    backtrack(0, 0)
    return result
```

### Test Cases

**Test 1:** Two pairs of parentheses
- Input: "generate_parenthesis(2)"
- Expected: "[\"(())\",\"()()\"]"

**Test 2:** Three pairs of parentheses
- Input: "generate_parenthesis(3)"
- Expected: "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]"

**Test 3:** Single pair
- Input: "generate_parenthesis(1)"
- Expected: "[\"()\"]"

---

## 6. Letter Case Permutation

**Difficulty:** medium
**Concept:** backtracking-trees
**Family:** backtracking:permutations

### Description

Given a string s, you can transform every letter individually to be lowercase or uppercase to create another string. Return a list of all possible strings we could create.

### Key Insight

Binary choice tree for letters only: For each letter, we have 2 choices (lowercase or uppercase). Digits remain unchanged. This creates a binary tree where only letter positions branch.

### Examples

**Example 1:**
- Input: "a1b2"
- Output: ["a1b2","a1B2","A1b2","A1B2"]
- Explanation: Letters a and b can each be lower or upper case, digit stays as is

### Hints

1. For each character, check if it's a letter or digit
2. Digits: only one choice, just add and continue
3. Letters: two choices - try both .lower() and .upper()
4. Base case: processed all characters (index == len(s))
5. For n letters, you'll have 2^n permutations

### Starter Code

**Python:**
```python
def letter_case_permutation(s):
    """
    Generate all letter case permutations.
    
    Args:
        s: str - string with letters and digits
    
    Returns:
        List[str] - all case permutations
    """
    result = []
    current = []
    
    def backtrack(index):
        # TODO: Base case - processed all characters
        # if index == len(s):
        #     result.append(''.join(current))
        #     return
        
        # TODO: If digit, just add it; if letter, try both cases
        pass
    
    backtrack(0)
    return result
```

**JavaScript:**
```javascript
function letter_case_permutation(s) {
    """
    Generate all letter case permutations.
    
    Args:
        s: str - string with letters and digits
    
    Returns:
        Array - all case permutations
    """
    result = []
    current = []
    
    function backtrack(index) {
        // TODO: Base case - processed all characters
        # if index == len(s):
        #     result.append(''.join(current))
        #     return
        
        // TODO: If digit, just add it; if letter, try both cases
  // TODO: implement
    backtrack(0)
    return result
```

### Solution

**Python:**
```python
def letter_case_permutation(s):
    result = []
    current = []
    
    def backtrack(index):
        if index == len(s):
            result.append(''.join(current))
            return
        
        char = s[index]
        if char.isdigit():
            current.append(char)
            backtrack(index + 1)
            current.pop()
        else:
            # Try lowercase
            current.append(char.lower())
            backtrack(index + 1)
            current.pop()
            
            # Try uppercase
            current.append(char.upper())
            backtrack(index + 1)
            current.pop()
    
    backtrack(0)
    return result
```

**JavaScript:**
```javascript
function letter_case_permutation(s) {
    result = []
    current = []
    
    function backtrack(index) {
        if index == len(s):
            result.append(''.join(current))
            return
        
        char = s[index]
        if char.isdigit():
            current.append(char)
            backtrack(index + 1)
            current.pop()
        else:
            # Try lowercase
            current.append(char.lower())
            backtrack(index + 1)
            current.pop()
            
            # Try uppercase
            current.append(char.upper())
            backtrack(index + 1)
            current.pop()
    
    backtrack(0)
    return result
```

### Test Cases

**Test 1:** Two letters with digits
- Input: "letter_case_permutation(\"a1b2\")"
- Expected: "[\"a1b2\",\"a1B2\",\"A1b2\",\"A1B2\"]"

**Test 2:** One letter, two digits
- Input: "letter_case_permutation(\"3z4\")"
- Expected: "[\"3z4\",\"3Z4\"]"

**Test 3:** Only digits, no permutations
- Input: "letter_case_permutation(\"12345\")"
- Expected: "[\"12345\"]"

---

## 7. Subsets II (With Duplicates)

**Difficulty:** medium
**Concept:** backtracking-trees
**Family:** backtracking:subsets

### Description

Given an integer array nums that may contain duplicates, return all possible subsets (the power set). The solution set must not contain duplicate subsets.

### Key Insight

Pruning duplicates: When we have duplicates in sorted input, we skip a number if it's the same as the previous one AND we didn't use the previous one. This prevents generating duplicate subsets.

### Examples

**Example 1:**
- Input: [1,2,2]
- Output: [[],[1],[1,2],[1,2,2],[2],[2,2]]
- Explanation: Handle duplicate 2s by skipping if previous 2 was not used

### Hints

1. FIRST: Sort the array to group duplicate values together
2. Add current subset at every node (not just leaves)
3. Skip a number if: (1) it equals previous number AND (2) we're not at start index
4. Condition: if i > index and nums[i] == nums[i-1]: continue
5. This pruning prevents duplicate subsets in the result

### Starter Code

**Python:**
```python
def subsets_with_dup(nums):
    """
    Generate all unique subsets from array with duplicates.
    
    Args:
        nums: List[int] - array that may contain duplicates
    
    Returns:
        List[List[int]] - all unique subsets
    """
    nums.sort()  # Sort to group duplicates
    result = []
    current = []
    
    def backtrack(index):
        # TODO: Add current subset
        # result.append(current[:])
        
        # TODO: Try adding each remaining element
        # Skip duplicates: if nums[i] == nums[i-1] and i > index
        pass
    
    backtrack(0)
    return result
```

**JavaScript:**
```javascript
function subsets_with_dup(nums) {
    """
    Generate all unique subsets from array with duplicates.
    
    Args:
        nums: Array - array that may contain duplicates
    
    Returns:
        Array] - all unique subsets
    """
    nums.sort()  # Sort to group duplicates
    result = []
    current = []
    
    function backtrack(index) {
        // TODO: Add current subset
        # result.append(current[:])
        
        // TODO: Try adding each remaining element
        # Skip duplicates: if nums[i] == nums[i-1] and i > index
  // TODO: implement
    backtrack(0)
    return result
```

### Solution

**Python:**
```python
def subsets_with_dup(nums):
    nums.sort()
    result = []
    current = []
    
    def backtrack(index):
        result.append(current[:])
        
        for i in range(index, len(nums)):
            # Skip duplicates: if same as previous and not first iteration
            if i > index and nums[i] == nums[i-1]:
                continue
            
            current.append(nums[i])
            backtrack(i + 1)
            current.pop()
    
    backtrack(0)
    return result
```

**JavaScript:**
```javascript
function subsets_with_dup(nums) {
    nums.sort()
    result = []
    current = []
    
    function backtrack(index) {
        result.append(current[:])
        
        for i in range(index, len(nums)):
            # Skip duplicates: if same as previous and not first iteration
            if i > index and nums[i] == nums[i-1]:
                continue
            
            current.append(nums[i])
            backtrack(i + 1)
            current.pop()
    
    backtrack(0)
    return result
```

### Test Cases

**Test 1:** Handle duplicate 2s
- Input: "subsets_with_dup([1,2,2])"
- Expected: "[[],[1],[1,2],[1,2,2],[2],[2,2]]"

**Test 2:** Single element
- Input: "subsets_with_dup([0])"
- Expected: "[[],[0]]"

**Test 3:** Multiple duplicates
- Input: "subsets_with_dup([4,4,4,1,4])"
- Expected: "[[],[1],[1,4],[1,4,4],[1,4,4,4],[1,4,4,4,4],[4],[4,4],[4,4,4],[4,4,4,4]]"

---

## 8. Permutations II (With Duplicates)

**Difficulty:** medium
**Concept:** backtracking-trees
**Family:** backtracking:permutations

### Description

Given a collection of numbers that might contain duplicates, return all possible unique permutations in any order.

### Key Insight

Use a counter/frequency map to track available elements. Skip duplicate branches by using each unique element once per level, but allow using it multiple times across different levels if count allows.

### Examples

**Example 1:**
- Input: [1,1,2]
- Output: [[1,1,2],[1,2,1],[2,1,1]]
- Explanation: Three unique permutations despite having duplicate 1s

### Hints

1. Use Counter to track how many of each number remain available
2. At each step, iterate over unique numbers in counter (not original array)
3. Only use a number if counter[num] > 0
4. Decrement counter[num] before recursion, increment after (backtrack)
5. This automatically prevents duplicate permutations

### Starter Code

**Python:**
```python
def permute_unique(nums):
    """
    Generate all unique permutations from array with duplicates.
    
    Args:
        nums: List[int] - array that may contain duplicates
    
    Returns:
        List[List[int]] - all unique permutations
    """
    from collections import Counter
    counter = Counter(nums)
    result = []
    current = []
    
    def backtrack():
        # TODO: Base case - permutation complete
        # if len(current) == len(nums):
        #     result.append(current[:])
        #     return
        
        # TODO: Try each unique number that still has count > 0
        pass
    
    backtrack()
    return result
```

**JavaScript:**
```javascript
function permute_unique(nums) {
    """
    Generate all unique permutations from array with duplicates.
    
    Args:
        nums: Array - array that may contain duplicates
    
    Returns:
        Array] - all unique permutations
    """
    from collections import Counter
    counter = Counter(nums)
    result = []
    current = []
    
    function backtrack() {
        // TODO: Base case - permutation complete
        # if len(current) == len(nums):
        #     result.append(current[:])
        #     return
        
        // TODO: Try each unique number that still has count > 0
  // TODO: implement
    backtrack()
    return result
```

### Solution

**Python:**
```python
def permute_unique(nums):
    from collections import Counter
    counter = Counter(nums)
    result = []
    current = []
    
    def backtrack():
        if len(current) == len(nums):
            result.append(current[:])
            return
        
        for num in counter:
            if counter[num] > 0:
                current.append(num)
                counter[num] -= 1
                backtrack()
                current.pop()
                counter[num] += 1
    
    backtrack()
    return result
```

**JavaScript:**
```javascript
function permute_unique(nums) {
    from collections import Counter
    counter = Counter(nums)
    result = []
    current = []
    
    function backtrack() {
        if len(current) == len(nums):
            result.append(current[:])
            return
        
        for num in counter:
            if counter[num] > 0:
                current.append(num)
                counter[num] -= 1
                backtrack()
                current.pop()
                counter[num] += 1
    
    backtrack()
    return result
```

### Test Cases

**Test 1:** Handle duplicate 1s
- Input: "permute_unique([1,1,2])"
- Expected: "[[1,1,2],[1,2,1],[2,1,1]]"

**Test 2:** All unique, same as regular permutations
- Input: "permute_unique([1,2,3])"
- Expected: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]"

**Test 3:** Two pairs of duplicates
- Input: "permute_unique([2,2,1,1])"
- Expected: "[[1,1,2,2],[1,2,1,2],[1,2,2,1],[2,1,1,2],[2,1,2,1],[2,2,1,1]]"

---

## 9. Word Search

**Difficulty:** medium
**Concept:** backtracking-trees
**Family:** backtracking:word-search

### Description

Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring.

### Key Insight

2D grid DFS: For each cell, explore all 4 directions (up, down, left, right). Mark visited cells to avoid reuse in same path. Backtrack by unmarking when returning.

### Examples

**Example 1:**
- Input: board=[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word="ABCCED"
- Output: true
- Explanation: Path exists: A->B->C->C->E->D

### Hints

1. Try starting the search from every cell in the grid
2. Base case: if index == len(word), we found the word
3. Check: row/col in bounds, cell matches word[index], cell not visited
4. Mark visited: temporarily change board[row][col] to "#"
5. Try all 4 directions: (row±1, col) and (row, col±1)
6. Backtrack: restore original character after recursive calls

### Starter Code

**Python:**
```python
def exist(board, word):
    """
    Search for word in 2D grid using backtracking.
    
    Args:
        board: List[List[str]] - 2D grid of characters
        word: str - word to search for
    
    Returns:
        bool - True if word exists in grid
    """
    rows, cols = len(board), len(board[0])
    
    def backtrack(row, col, index):
        # TODO: Base case - found complete word
        # if index == len(word):
        #     return True
        
        # TODO: Check boundaries and character match
        # TODO: Mark visited, try 4 directions, unmark
        pass
    
    # Try starting from each cell
    for r in range(rows):
        for c in range(cols):
            if backtrack(r, c, 0):
                return True
    return False
```

**JavaScript:**
```javascript
function exist(board, word) {
    """
    Search for word in 2D grid using backtracking.
    
    Args:
        board: Array] - 2D grid of characters
        word: str - word to search for
    
    Returns:
        bool - true if word exists in grid
    """
    rows, cols = len(board), len(board[0])
    
    function backtrack(row, col, index) {
        // TODO: Base case - found complete word
        # if index == len(word):
        #     return true
        
        // TODO: Check boundaries and character match
        // TODO: Mark visited, try 4 directions, unmark
  // TODO: implement
    # Try starting from each cell
    for r in range(rows):
        for c in range(cols):
            if backtrack(r, c, 0):
                return true
    return false
```

### Solution

**Python:**
```python
def exist(board, word):
    rows, cols = len(board), len(board[0])
    
    def backtrack(row, col, index):
        if index == len(word):
            return True
        
        if (row < 0 or row >= rows or col < 0 or col >= cols or
            board[row][col] != word[index]):
            return False
        
        temp = board[row][col]
        board[row][col] = '#'  # Mark visited
        
        # Try all 4 directions
        found = (backtrack(row + 1, col, index + 1) or
                backtrack(row - 1, col, index + 1) or
                backtrack(row, col + 1, index + 1) or
                backtrack(row, col - 1, index + 1))
        
        board[row][col] = temp  # Backtrack
        return found
    
    for r in range(rows):
        for c in range(cols):
            if backtrack(r, c, 0):
                return True
    return False
```

**JavaScript:**
```javascript
function exist(board, word) {
    rows, cols = len(board), len(board[0])
    
    function backtrack(row, col, index) {
        if index == len(word):
            return true
        
        if (row < 0 or row >= rows or col < 0 or col >= cols or
            board[row][col] != word[index]):
            return false
        
        temp = board[row][col]
        board[row][col] = '#'  # Mark visited
        
        # Try all 4 directions
        found = (backtrack(row + 1, col, index + 1) or
                backtrack(row - 1, col, index + 1) or
                backtrack(row, col + 1, index + 1) or
                backtrack(row, col - 1, index + 1))
        
        board[row][col] = temp  # Backtrack
        return found
    
    for r in range(rows):
        for c in range(cols):
            if backtrack(r, c, 0):
                return true
    return false
```

### Test Cases

**Test 1:** Word exists in grid
- Input: "exist([[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], \"ABCCED\")"
- Expected: "True"

**Test 2:** Word exists
- Input: "exist([[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], \"SEE\")"
- Expected: "True"

**Test 3:** Cannot reuse cells in same path
- Input: "exist([[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], \"ABCB\")"
- Expected: "False"

---

## 10. N-Queens

**Difficulty:** hard
**Concept:** backtracking-trees
**Family:** backtracking:n-queens

### Description

The n-queens puzzle is the problem of placing n queens on an n×n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle.

### Key Insight

Constraint-based pruning: Each level = one row, each branch = valid column for that row. Prune branches where queens would attack (same column or diagonal). Use is_safe() to check conflicts.

### Examples

**Example 1:**
- Input: n=4
- Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
- Explanation: Two distinct solutions for 4-Queens

### Hints

1. Each level of tree = placing queen in one row
2. Store board as array where board[row] = column of queen
3. is_safe(row, col): check previous rows for conflicts
4. Column conflict: board[prev_row] == col
5. Diagonal conflict: abs(prev_row - row) == abs(board[prev_row] - col)
6. Convert board array to string format for result

### Starter Code

**Python:**
```python
def solve_n_queens(n):
    """
    Find all solutions to N-Queens problem.
    
    Args:
        n: int - size of chess board (n x n)
    
    Returns:
        List[List[str]] - all valid queen placements
    """
    result = []
    board = []  # Store column positions for each row
    
    def is_safe(row, col):
        # TODO: Check if placing queen at (row, col) is safe
        # Check column and diagonal conflicts with previous rows
        pass
    
    def backtrack(row):
        # TODO: Base case - placed all n queens
        # TODO: Try each column for current row
        pass
    
    backtrack(0)
    return result
```

**JavaScript:**
```javascript
function solve_n_queens(n) {
    """
    Find all solutions to N-Queens problem.
    
    Args:
        n: int - size of chess board (n x n)
    
    Returns:
        Array] - all valid queen placements
    """
    result = []
    board = []  # Store column positions for each row
    
    function is_safe(row, col) {
        // TODO: Check if placing queen at (row, col) is safe
        # Check column and diagonal conflicts with previous rows
  // TODO: implement
    function backtrack(row) {
        // TODO: Base case - placed all n queens
        // TODO: Try each column for current row
  // TODO: implement
    backtrack(0)
    return result
```

### Solution

**Python:**
```python
def solve_n_queens(n):
    result = []
    board = []
    
    def is_safe(row, col):
        for prev_row in range(row):
            prev_col = board[prev_row]
            if prev_col == col:
                return False
            if abs(prev_row - row) == abs(prev_col - col):
                return False
        return True
    
    def backtrack(row):
        if row == n:
            solution = []
            for r in range(n):
                row_str = '.' * board[r] + 'Q' + '.' * (n - board[r] - 1)
                solution.append(row_str)
            result.append(solution)
            return
        
        for col in range(n):
            if is_safe(row, col):
                board.append(col)
                backtrack(row + 1)
                board.pop()
    
    backtrack(0)
    return result
```

**JavaScript:**
```javascript
function solve_n_queens(n) {
    result = []
    board = []
    
    function is_safe(row, col) {
        for prev_row in range(row):
            prev_col = board[prev_row]
            if prev_col == col:
                return false
            if abs(prev_row - row) == abs(prev_col - col):
                return false
        return true
    
    function backtrack(row) {
        if row == n:
            solution = []
            for r in range(n):
                row_str = '.' * board[r] + 'Q' + '.' * (n - board[r] - 1)
                solution.append(row_str)
            result.append(solution)
            return
        
        for col in range(n):
            if is_safe(row, col):
                board.append(col)
                backtrack(row + 1)
                board.pop()
    
    backtrack(0)
    return result
```

### Test Cases

**Test 1:** 4-Queens has 2 solutions
- Input: "solve_n_queens(4)"
- Expected: "[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]"

**Test 2:** Trivial case
- Input: "solve_n_queens(1)"
- Expected: "[[\"Q\"]]"

**Test 3:** No solution exists for 3-Queens
- Input: "solve_n_queens(3)"
- Expected: "[]"

**Test 4:** PERFORMANCE: 12-Queens (14,200 solutions) - Must use efficient backtracking with is_safe() pruning
- Input: "solve_n_queens(12)"
- Expected: "str(len([[]])) + \" is wrong, should be 14200\""

---

## 11. Sudoku Solver

**Difficulty:** hard
**Concept:** backtracking-trees
**Family:** backtracking:sudoku

### Description

Write a program to solve a Sudoku puzzle by filling the empty cells. A sudoku solution must satisfy all of the following rules: Each of the digits 1-9 must occur exactly once in each row, column, and 3x3 sub-box.

### Key Insight

Heavy constraint checking: For each empty cell, try digits 1-9. Only proceed if digit is valid (not in same row, column, or 3x3 box). Backtrack if no valid digit found.

### Examples

**Example 1:**
- Input: Partially filled 9x9 board with "." for empty cells
- Output: Completed valid Sudoku board
- Explanation: Fill empty cells while maintaining Sudoku rules

### Hints

1. Find empty cells: scan for "." in the board
2. For each empty cell, try digits "1" through "9"
3. is_valid(): check row, column, and 3x3 box for conflicts
4. 3x3 box index: box_row = (row//3)*3, box_col = (col//3)*3
5. If no valid digit works, backtrack (undo and return False)
6. Return True when all cells are filled

### Starter Code

**Python:**
```python
def solve_sudoku(board):
    """
    Solve Sudoku puzzle using backtracking.
    
    Args:
        board: List[List[str]] - 9x9 grid with '.' for empty cells
    
    Returns:
        bool - True if solved (board is modified in place)
    """
    def is_valid(row, col, num):
        # TODO: Check if num is valid at (row, col)
        # Check row, column, and 3x3 box
        pass
    
    def backtrack():
        # TODO: Find next empty cell
        # TODO: Try digits 1-9 if valid
        # TODO: Backtrack if no solution
        pass
    
    return backtrack()
```

**JavaScript:**
```javascript
function solve_sudoku(board) {
    """
    Solve Sudoku puzzle using backtracking.
    
    Args:
        board: Array] - 9x9 grid with '.' for empty cells
    
    Returns:
        bool - true if solved (board is modified in place)
    """
    function is_valid(row, col, num) {
        // TODO: Check if num is valid at (row, col)
        # Check row, column, and 3x3 box
  // TODO: implement
    function backtrack() {
        // TODO: Find next empty cell
        // TODO: Try digits 1-9 if valid
        // TODO: Backtrack if no solution
  // TODO: implement
    return backtrack()
```

### Solution

**Python:**
```python
def solve_sudoku(board):
    def is_valid(row, col, num):
        # Check row
        if num in board[row]:
            return False
        
        # Check column
        if num in [board[r][col] for r in range(9)]:
            return False
        
        # Check 3x3 box
        box_row, box_col = (row // 3) * 3, (col // 3) * 3
        for r in range(box_row, box_row + 3):
            for c in range(box_col, box_col + 3):
                if board[r][c] == num:
                    return False
        return True
    
    def backtrack():
        for row in range(9):
            for col in range(9):
                if board[row][col] == '.':
                    for num in '123456789':
                        if is_valid(row, col, num):
                            board[row][col] = num
                            if backtrack():
                                return True
                            board[row][col] = '.'
                    return False
        return True
    
    return backtrack()
```

**JavaScript:**
```javascript
function solve_sudoku(board) {
    function is_valid(row, col, num) {
        # Check row
        if num in board[row]:
            return false
        
        # Check column
        if num in [board[r][col] for r in range(9)]:
            return false
        
        # Check 3x3 box
        box_row, box_col = (row // 3) * 3, (col // 3) * 3
        for r in range(box_row, box_row + 3):
            for c in range(box_col, box_col + 3):
                if board[r][c] == num:
                    return false
        return true
    
    function backtrack() {
        for row in range(9):
            for col in range(9):
                if board[row][col] == '.':
                    for num in '123456789':
                        if is_valid(row, col, num):
                            board[row][col] = num
                            if backtrack():
                                return true
                            board[row][col] = '.'
                    return false
        return true
    
    return backtrack()
```

### Test Cases

**Test 1:** Solvable Sudoku puzzle
- Input: "solve_sudoku(board)"
- Expected: "True"

---

## 12. Palindrome Partitioning

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of s.

### Key Insight

String partitioning tree: At each position, try all possible substring lengths. Only branch if substring is palindrome. Each path from root to leaf is one valid partitioning.

### Examples

**Example 1:**
- Input: "aab"
- Output: [["a","a","b"],["aa","b"]]
- Explanation: Two ways to partition into palindromes

### Hints

1. At each position, try all possible substring lengths
2. Only continue if substring is a palindrome
3. is_palindrome(): check if substring == substring reversed
4. Base case: start == len(s), we've partitioned the whole string
5. Each level decides where to make the next cut

### Starter Code

**Python:**
```python
def partition(s):
    """
    Find all palindrome partitions of string.
    
    Args:
        s: str - input string
    
    Returns:
        List[List[str]] - all palindrome partitionings
    """
    result = []
    current = []
    
    def is_palindrome(substring):
        return substring == substring[::-1]
    
    def backtrack(start):
        # TODO: Base case - partitioned entire string
        # if start == len(s):
        #     result.append(current[:])
        #     return
        
        # TODO: Try all substring lengths from start
        pass
    
    backtrack(0)
    return result
```

**JavaScript:**
```javascript
function partition(s) {
    """
    Find all palindrome partitions of string.
    
    Args:
        s: str - input string
    
    Returns:
        Array] - all palindrome partitionings
    """
    result = []
    current = []
    
    function is_palindrome(substring) {
        return substring == substring[::-1]
    
    function backtrack(start) {
        // TODO: Base case - partitioned entire string
        # if start == len(s):
        #     result.append(current[:])
        #     return
        
        // TODO: Try all substring lengths from start
  // TODO: implement
    backtrack(0)
    return result
```

### Solution

**Python:**
```python
def partition(s):
    result = []
    current = []
    
    def is_palindrome(substring):
        return substring == substring[::-1]
    
    def backtrack(start):
        if start == len(s):
            result.append(current[:])
            return
        
        for end in range(start + 1, len(s) + 1):
            substring = s[start:end]
            if is_palindrome(substring):
                current.append(substring)
                backtrack(end)
                current.pop()
    
    backtrack(0)
    return result
```

**JavaScript:**
```javascript
function partition(s) {
    result = []
    current = []
    
    function is_palindrome(substring) {
        return substring == substring[::-1]
    
    function backtrack(start) {
        if start == len(s):
            result.append(current[:])
            return
        
        for end in range(start + 1, len(s) + 1):
            substring = s[start:end]
            if is_palindrome(substring):
                current.append(substring)
                backtrack(end)
                current.pop()
    
    backtrack(0)
    return result
```

### Test Cases

**Test 1:** Two palindrome partitions
- Input: "partition(\"aab\")"
- Expected: "[[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]"

**Test 2:** Single character
- Input: "partition(\"a\")"
- Expected: "[[\"a\"]]"

**Test 3:** Multiple valid partitions
- Input: "partition(\"aaa\")"
- Expected: "[[\"a\",\"a\",\"a\"],[\"a\",\"aa\"],[\"aa\",\"a\"],[\"aaa\"]]"

---

## 13. Restore IP Addresses

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

A valid IP address consists of exactly four integers separated by single dots. Each integer is between 0 and 255 and cannot have leading zeros. Given a string s containing only digits, return all possible valid IP addresses that can be formed by inserting dots into s.

### Key Insight

Formatted partitioning: Similar to palindrome partition but with IP address constraints. Need exactly 4 segments, each 0-255, no leading zeros (except "0" itself).

### Examples

**Example 1:**
- Input: "25525511135"
- Output: ["255.255.11.135","255.255.111.35"]
- Explanation: Two valid IP addresses can be formed

### Hints

1. Need exactly 4 segments (IP address format)
2. Each segment: 1-3 digits, value 0-255
3. No leading zeros: "01" invalid, but "0" is valid
4. Base case: current has 4 segments AND start == len(s)
5. Prune early: if already have 4 segments or can't form 4 segments with remaining digits

### Starter Code

**Python:**
```python
def restore_ip_addresses(s):
    """
    Generate all valid IP addresses from digit string.
    
    Args:
        s: str - string of digits
    
    Returns:
        List[str] - all valid IP addresses
    """
    result = []
    current = []
    
    def is_valid_segment(segment):
        # TODO: Check if segment is valid IP component
        # 0-255, no leading zeros
        pass
    
    def backtrack(start):
        # TODO: Base case - 4 segments and used all digits
        # TODO: Try 1, 2, or 3 digit segments
        pass
    
    backtrack(0)
    return result
```

**JavaScript:**
```javascript
function restore_ip_addresses(s) {
    """
    Generate all valid IP addresses from digit string.
    
    Args:
        s: str - string of digits
    
    Returns:
        Array - all valid IP addresses
    """
    result = []
    current = []
    
    function is_valid_segment(segment) {
        // TODO: Check if segment is valid IP component
        # 0-255, no leading zeros
  // TODO: implement
    function backtrack(start) {
        // TODO: Base case - 4 segments and used all digits
        // TODO: Try 1, 2, or 3 digit segments
  // TODO: implement
    backtrack(0)
    return result
```

### Solution

**Python:**
```python
def restore_ip_addresses(s):
    result = []
    current = []
    
    def is_valid_segment(segment):
        if not segment or len(segment) > 3:
            return False
        if segment[0] == '0' and len(segment) > 1:
            return False
        return 0 <= int(segment) <= 255
    
    def backtrack(start):
        if len(current) == 4:
            if start == len(s):
                result.append('.'.join(current))
            return
        
        if len(current) >= 4 or start >= len(s):
            return
        
        for length in range(1, 4):
            if start + length <= len(s):
                segment = s[start:start+length]
                if is_valid_segment(segment):
                    current.append(segment)
                    backtrack(start + length)
                    current.pop()
    
    backtrack(0)
    return result
```

**JavaScript:**
```javascript
function restore_ip_addresses(s) {
    result = []
    current = []
    
    function is_valid_segment(segment) {
        if not segment or len(segment) > 3:
            return false
        if segment[0] == '0' and len(segment) > 1:
            return false
        return 0 <= int(segment) <= 255
    
    function backtrack(start) {
        if len(current) == 4:
            if start == len(s):
                result.append('.'.join(current))
            return
        
        if len(current) >= 4 or start >= len(s):
            return
        
        for length in range(1, 4):
            if start + length <= len(s):
                segment = s[start:start+length]
                if is_valid_segment(segment):
                    current.append(segment)
                    backtrack(start + length)
                    current.pop()
    
    backtrack(0)
    return result
```

### Test Cases

**Test 1:** Two valid IP addresses
- Input: "restore_ip_addresses(\"25525511135\")"
- Expected: "[\"255.255.11.135\",\"255.255.111.35\"]"

**Test 2:** All zeros
- Input: "restore_ip_addresses(\"0000\")"
- Expected: "[\"0.0.0.0\"]"

**Test 3:** Multiple valid addresses
- Input: "restore_ip_addresses(\"101023\")"
- Expected: "[\"1.0.10.23\",\"1.0.102.3\",\"10.1.0.23\",\"10.10.2.3\",\"101.0.2.3\"]"

---

## 14. Combination Sum

**Difficulty:** medium
**Concept:** backtracking-trees
**Family:** backtracking:combinations

### Description

Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. The same number may be chosen from candidates an unlimited number of times.

### Key Insight

Unbounded choices: Unlike regular combinations, we can reuse the same element. At each step, we can either include the current element again or move to the next element.

### Examples

**Example 1:**
- Input: candidates=[2,3,6,7], target=7
- Output: [[2,2,3],[7]]
- Explanation: Two ways to sum to 7: 2+2+3 or just 7

### Hints

1. Track remaining sum needed (target - current sum)
2. Base case: remaining == 0 (found valid combination)
3. Prune: if remaining < 0, stop exploring
4. Key difference: after including candidates[i], stay at index i (can reuse)
5. To avoid duplicates, only consider candidates from index i onwards

### Starter Code

**Python:**
```python
def combination_sum(candidates, target):
    """
    Find all combinations that sum to target (unbounded).
    
    Args:
        candidates: List[int] - array of distinct integers
        target: int - target sum
    
    Returns:
        List[List[int]] - all combinations summing to target
    """
    result = []
    current = []
    
    def backtrack(start, remaining):
        # TODO: Base case - reached target
        # if remaining == 0:
        #     result.append(current[:])
        #     return
        
        # TODO: Try each candidate >= start
        # Can reuse same element (stay at same index)
        pass
    
    backtrack(0, target)
    return result
```

**JavaScript:**
```javascript
function combination_sum(candidates, target) {
    """
    Find all combinations that sum to target (unbounded).
    
    Args:
        candidates: Array - array of distinct integers
        target: int - target sum
    
    Returns:
        Array] - all combinations summing to target
    """
    result = []
    current = []
    
    function backtrack(start, remaining) {
        // TODO: Base case - reached target
        # if remaining == 0:
        #     result.append(current[:])
        #     return
        
        // TODO: Try each candidate >= start
        # Can reuse same element (stay at same index)
  // TODO: implement
    backtrack(0, target)
    return result
```

### Solution

**Python:**
```python
def combination_sum(candidates, target):
    result = []
    current = []
    
    def backtrack(start, remaining):
        if remaining == 0:
            result.append(current[:])
            return
        
        if remaining < 0:
            return
        
        for i in range(start, len(candidates)):
            current.append(candidates[i])
            # Stay at index i (can reuse same element)
            backtrack(i, remaining - candidates[i])
            current.pop()
    
    backtrack(0, target)
    return result
```

**JavaScript:**
```javascript
function combination_sum(candidates, target) {
    result = []
    current = []
    
    function backtrack(start, remaining) {
        if remaining == 0:
            result.append(current[:])
            return
        
        if remaining < 0:
            return
        
        for i in range(start, len(candidates)):
            current.append(candidates[i])
            # Stay at index i (can reuse same element)
            backtrack(i, remaining - candidates[i])
            current.pop()
    
    backtrack(0, target)
    return result
```

### Test Cases

**Test 1:** Can reuse elements
- Input: "combination_sum([2,3,6,7], 7)"
- Expected: "[[2,2,3],[7]]"

**Test 2:** Multiple combinations with reuse
- Input: "combination_sum([2,3,5], 8)"
- Expected: "[[2,2,2,2],[2,3,3],[3,5]]"

**Test 3:** No valid combination
- Input: "combination_sum([2], 1)"
- Expected: "[]"

---

## 15. Combination Sum II

**Difficulty:** medium
**Concept:** backtracking-trees
**Family:** backtracking:combinations

### Description

Given a collection of candidate numbers (candidates) and a target number (target), find all unique combinations in candidates where the candidate numbers sum to target. Each number in candidates may only be used once in the combination.

### Key Insight

Bounded with duplicates: Sort array first. Skip duplicates at same level (if candidates[i] == candidates[i-1] and i > start). Each element used at most once.

### Examples

**Example 1:**
- Input: candidates=[10,1,2,7,6,1,5], target=8
- Output: [[1,1,6],[1,2,5],[1,7],[2,6]]
- Explanation: Four unique combinations (two 1s are different instances)

### Hints

1. FIRST: Sort candidates to group duplicates
2. Base case: remaining == 0 (found valid combination)
3. Skip duplicates: if i > start and candidates[i] == candidates[i-1], continue
4. Each element used once: next recursion starts at i+1 (not i)
5. Prune: if remaining < 0, stop

### Starter Code

**Python:**
```python
def combination_sum2(candidates, target):
    """
    Find all unique combinations that sum to target (each element used once).
    
    Args:
        candidates: List[int] - array that may contain duplicates
        target: int - target sum
    
    Returns:
        List[List[int]] - all unique combinations summing to target
    """
    candidates.sort()  # Sort to handle duplicates
    result = []
    current = []
    
    def backtrack(start, remaining):
        # TODO: Base case - reached target
        # TODO: Try each candidate, skip duplicates at same level
        pass
    
    backtrack(0, target)
    return result
```

**JavaScript:**
```javascript
function combination_sum2(candidates, target) {
    """
    Find all unique combinations that sum to target (each element used once).
    
    Args:
        candidates: Array - array that may contain duplicates
        target: int - target sum
    
    Returns:
        Array] - all unique combinations summing to target
    """
    candidates.sort()  # Sort to handle duplicates
    result = []
    current = []
    
    function backtrack(start, remaining) {
        // TODO: Base case - reached target
        // TODO: Try each candidate, skip duplicates at same level
  // TODO: implement
    backtrack(0, target)
    return result
```

### Solution

**Python:**
```python
def combination_sum2(candidates, target):
    candidates.sort()
    result = []
    current = []
    
    def backtrack(start, remaining):
        if remaining == 0:
            result.append(current[:])
            return
        
        if remaining < 0:
            return
        
        for i in range(start, len(candidates)):
            # Skip duplicates at same level
            if i > start and candidates[i] == candidates[i-1]:
                continue
            
            current.append(candidates[i])
            backtrack(i + 1, remaining - candidates[i])
            current.pop()
    
    backtrack(0, target)
    return result
```

**JavaScript:**
```javascript
function combination_sum2(candidates, target) {
    candidates.sort()
    result = []
    current = []
    
    function backtrack(start, remaining) {
        if remaining == 0:
            result.append(current[:])
            return
        
        if remaining < 0:
            return
        
        for i in range(start, len(candidates)):
            # Skip duplicates at same level
            if i > start and candidates[i] == candidates[i-1]:
                continue
            
            current.append(candidates[i])
            backtrack(i + 1, remaining - candidates[i])
            current.pop()
    
    backtrack(0, target)
    return result
```

### Test Cases

**Test 1:** Handle duplicates, each used once
- Input: "combination_sum2([10,1,2,7,6,1,5], 8)"
- Expected: "[[1,1,6],[1,2,5],[1,7],[2,6]]"

**Test 2:** Multiple duplicate 2s
- Input: "combination_sum2([2,5,2,1,2], 5)"
- Expected: "[[1,2,2],[5]]"

---

## 16. Combination Sum III

**Difficulty:** medium
**Concept:** backtracking-trees
**Family:** backtracking:combinations

### Description

Find all valid combinations of k numbers that sum up to n such that the following conditions are true: Only numbers 1 through 9 are used, and each number is used at most once.

### Key Insight

Double constraint: Need exactly k numbers AND they must sum to n. Only use digits 1-9, each at most once. Prune when k or n constraints violated.

### Examples

**Example 1:**
- Input: k=3, n=7
- Output: [[1,2,4]]
- Explanation: Only one way to choose 3 numbers from 1-9 that sum to 7

### Hints

1. Search space: numbers 1 through 9
2. Base case: len(current) == k AND remaining == 0
3. Prune: if len(current) > k or remaining < 0
4. Start from 1, try each number from start to 9
5. Each number used once: next call starts at i+1

### Starter Code

**Python:**
```python
def combination_sum3(k, n):
    """
    Find k numbers from 1-9 that sum to n.
    
    Args:
        k: int - number of integers to use
        n: int - target sum
    
    Returns:
        List[List[int]] - all valid combinations
    """
    result = []
    current = []
    
    def backtrack(start, remaining):
        # TODO: Base case - have k numbers and sum equals n
        # TODO: Try digits 1-9, each used once
        pass
    
    backtrack(1, n)
    return result
```

**JavaScript:**
```javascript
function combination_sum3(k, n) {
    """
    Find k numbers from 1-9 that sum to n.
    
    Args:
        k: int - number of integers to use
        n: int - target sum
    
    Returns:
        Array] - all valid combinations
    """
    result = []
    current = []
    
    function backtrack(start, remaining) {
        // TODO: Base case - have k numbers and sum equals n
        // TODO: Try digits 1-9, each used once
  // TODO: implement
    backtrack(1, n)
    return result
```

### Solution

**Python:**
```python
def combination_sum3(k, n):
    result = []
    current = []
    
    def backtrack(start, remaining):
        if len(current) == k and remaining == 0:
            result.append(current[:])
            return
        
        if len(current) >= k or remaining <= 0:
            return
        
        for i in range(start, 10):
            if i > remaining:
                break
            current.append(i)
            backtrack(i + 1, remaining - i)
            current.pop()
    
    backtrack(1, n)
    return result
```

**JavaScript:**
```javascript
function combination_sum3(k, n) {
    result = []
    current = []
    
    function backtrack(start, remaining) {
        if len(current) == k and remaining == 0:
            result.append(current[:])
            return
        
        if len(current) >= k or remaining <= 0:
            return
        
        for i in range(start, 10):
            if i > remaining:
                break
            current.append(i)
            backtrack(i + 1, remaining - i)
            current.pop()
    
    backtrack(1, n)
    return result
```

### Test Cases

**Test 1:** k=3 numbers sum to 7
- Input: "combination_sum3(3, 7)"
- Expected: "[[1,2,4]]"

**Test 2:** Three ways to choose 3 numbers summing to 9
- Input: "combination_sum3(3, 9)"
- Expected: "[[1,2,6],[1,3,5],[2,3,4]]"

**Test 3:** Impossible combination
- Input: "combination_sum3(4, 1)"
- Expected: "[]"

---

## 17. Subsets II (With Duplicates)

**Difficulty:** medium
**Concept:** backtracking-trees
**Family:** backtracking:subsets

### Description

Given an integer array nums that may contain duplicates, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.

### Key Insight

Same as problem #7 - demonstrating the pattern again: Sort first, then skip duplicates at same tree level to prevent duplicate subsets.

### Examples

**Example 1:**
- Input: [1,2,2]
- Output: [[],[1],[1,2],[1,2,2],[2],[2,2]]
- Explanation: Six unique subsets despite duplicate 2s

### Hints

1. Sort array first to group duplicates together
2. Add current subset at every recursive call (not just leaves)
3. Skip nums[i] if: i > index AND nums[i] == nums[i-1]
4. This prevents creating duplicate subsets
5. Each element can be included or skipped

### Starter Code

**Python:**
```python
def subsets_with_dup(nums):
    """
    Generate all unique subsets from array with duplicates.
    
    Args:
        nums: List[int] - array that may contain duplicates
    
    Returns:
        List[List[int]] - all unique subsets
    """
    nums.sort()
    result = []
    current = []
    
    def backtrack(index):
        result.append(current[:])
        
        for i in range(index, len(nums)):
            # TODO: Skip duplicates at same level
            pass
    
    backtrack(0)
    return result
```

**JavaScript:**
```javascript
function subsets_with_dup(nums) {
    """
    Generate all unique subsets from array with duplicates.
    
    Args:
        nums: Array - array that may contain duplicates
    
    Returns:
        Array] - all unique subsets
    """
    nums.sort()
    result = []
    current = []
    
    function backtrack(index) {
        result.append(current[:])
        
        for i in range(index, len(nums)):
            // TODO: Skip duplicates at same level
  // TODO: implement
    backtrack(0)
    return result
```

### Solution

**Python:**
```python
def subsets_with_dup(nums):
    nums.sort()
    result = []
    current = []
    
    def backtrack(index):
        result.append(current[:])
        
        for i in range(index, len(nums)):
            if i > index and nums[i] == nums[i-1]:
                continue
            
            current.append(nums[i])
            backtrack(i + 1)
            current.pop()
    
    backtrack(0)
    return result
```

**JavaScript:**
```javascript
function subsets_with_dup(nums) {
    nums.sort()
    result = []
    current = []
    
    function backtrack(index) {
        result.append(current[:])
        
        for i in range(index, len(nums)):
            if i > index and nums[i] == nums[i-1]:
                continue
            
            current.append(nums[i])
            backtrack(i + 1)
            current.pop()
    
    backtrack(0)
    return result
```

### Test Cases

**Test 1:** Handle duplicate 2s
- Input: "subsets_with_dup([1,2,2])"
- Expected: "[[],[1],[1,2],[1,2,2],[2],[2,2]]"

**Test 2:** Many duplicates
- Input: "subsets_with_dup([4,4,4,1,4])"
- Expected: "[[],[1],[1,4],[1,4,4],[1,4,4,4],[1,4,4,4,4],[4],[4,4],[4,4,4],[4,4,4,4]]"

---

## 18. Permutations II (With Duplicates)

**Difficulty:** medium
**Concept:** backtracking-trees
**Family:** backtracking:permutations

### Description

Given a collection of numbers, nums, that might contain duplicates, return all possible unique permutations in any order.

### Key Insight

Same as problem #8 - frequency-based approach: Use Counter to track available elements. Prevents duplicates automatically by branching on unique values.

### Examples

**Example 1:**
- Input: [1,1,2]
- Output: [[1,1,2],[1,2,1],[2,1,1]]
- Explanation: Three unique permutations

### Hints

1. Use Counter to track frequency of each unique number
2. Iterate over unique numbers in counter (not indices)
3. Only use a number if counter[num] > 0
4. Decrement before recursion, increment after (backtrack)
5. Automatically avoids duplicate permutations

### Starter Code

**Python:**
```python
def permute_unique(nums):
    """
    Generate all unique permutations from array with duplicates.
    
    Args:
        nums: List[int] - array that may contain duplicates
    
    Returns:
        List[List[int]] - all unique permutations
    """
    from collections import Counter
    counter = Counter(nums)
    result = []
    current = []
    
    def backtrack():
        # TODO: Base case and iteration over unique elements
        pass
    
    backtrack()
    return result
```

**JavaScript:**
```javascript
function permute_unique(nums) {
    """
    Generate all unique permutations from array with duplicates.
    
    Args:
        nums: Array - array that may contain duplicates
    
    Returns:
        Array] - all unique permutations
    """
    from collections import Counter
    counter = Counter(nums)
    result = []
    current = []
    
    function backtrack() {
        // TODO: Base case and iteration over unique elements
  // TODO: implement
    backtrack()
    return result
```

### Solution

**Python:**
```python
def permute_unique(nums):
    from collections import Counter
    counter = Counter(nums)
    result = []
    current = []
    
    def backtrack():
        if len(current) == len(nums):
            result.append(current[:])
            return
        
        for num in counter:
            if counter[num] > 0:
                current.append(num)
                counter[num] -= 1
                backtrack()
                current.pop()
                counter[num] += 1
    
    backtrack()
    return result
```

**JavaScript:**
```javascript
function permute_unique(nums) {
    from collections import Counter
    counter = Counter(nums)
    result = []
    current = []
    
    function backtrack() {
        if len(current) == len(nums):
            result.append(current[:])
            return
        
        for num in counter:
            if counter[num] > 0:
                current.append(num)
                counter[num] -= 1
                backtrack()
                current.pop()
                counter[num] += 1
    
    backtrack()
    return result
```

### Test Cases

**Test 1:** Three unique permutations
- Input: "permute_unique([1,1,2])"
- Expected: "[[1,1,2],[1,2,1],[2,1,1]]"

**Test 2:** All unique - standard permutations
- Input: "permute_unique([1,2,3])"
- Expected: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]"

---

## 19. Generate Abbreviations

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

Write a function to generate all possible abbreviations of a given word. An abbreviation replaces any number of consecutive characters with the count of characters replaced.

### Key Insight

Include/exclude pattern with counting: At each position, either include the character OR start counting consecutive omissions. Binary-like tree with number accumulation.

### Examples

**Example 1:**
- Input: "word"
- Output: ["word","1ord","w1rd","wo1d","wor1","2rd","w2d","wo2","1o1d","1or1","w1r1","1o2","2r1","3d","w3","4"]
- Explanation: All possible abbreviations of "word"

### Hints

1. Two choices at each position: include char OR abbreviate (count++)
2. Track current abbreviation building and count of omitted chars
3. When including a char: first add count (if > 0), then add char, reset count
4. When abbreviating: increment count, continue
5. Base case: add count (if > 0), then join and add to result

### Starter Code

**Python:**
```python
def generate_abbreviations(word):
    """
    Generate all abbreviations of a word.
    
    Args:
        word: str - input word
    
    Returns:
        List[str] - all possible abbreviations
    """
    result = []
    
    def backtrack(index, current, count):
        # TODO: Base case - processed all characters
        # TODO: Either include char or increment count
        pass
    
    backtrack(0, [], 0)
    return result
```

**JavaScript:**
```javascript
function generate_abbreviations(word) {
    """
    Generate all abbreviations of a word.
    
    Args:
        word: str - input word
    
    Returns:
        Array - all possible abbreviations
    """
    result = []
    
    function backtrack(index, current, count) {
        // TODO: Base case - processed all characters
        // TODO: Either include char or increment count
  // TODO: implement
    backtrack(0, [], 0)
    return result
```

### Solution

**Python:**
```python
def generate_abbreviations(word):
    result = []
    
    def backtrack(index, current, count):
        if index == len(word):
            if count > 0:
                current.append(str(count))
            result.append(''.join(current))
            if count > 0:
                current.pop()
            return
        
        # Choice 1: Abbreviate current character
        backtrack(index + 1, current, count + 1)
        
        # Choice 2: Include current character
        if count > 0:
            current.append(str(count))
        current.append(word[index])
        backtrack(index + 1, current, 0)
        current.pop()
        if count > 0:
            current.pop()
    
    backtrack(0, [], 0)
    return result
```

**JavaScript:**
```javascript
function generate_abbreviations(word) {
    result = []
    
    function backtrack(index, current, count) {
        if index == len(word):
            if count > 0:
                current.append(str(count))
            result.append(''.join(current))
            if count > 0:
                current.pop()
            return
        
        # Choice 1: Abbreviate current character
        backtrack(index + 1, current, count + 1)
        
        # Choice 2: Include current character
        if count > 0:
            current.append(str(count))
        current.append(word[index])
        backtrack(index + 1, current, 0)
        current.pop()
        if count > 0:
            current.pop()
    
    backtrack(0, [], 0)
    return result
```

### Test Cases

**Test 1:** All abbreviations of "word"
- Input: "generate_abbreviations(\"word\")"
- Expected: "[\"word\",\"1ord\",\"w1rd\",\"wo1d\",\"wor1\",\"2rd\",\"w2d\",\"wo2\",\"1o1d\",\"1or1\",\"w1r1\",\"1o2\",\"2r1\",\"3d\",\"w3\",\"4\"]"

**Test 2:** Single character
- Input: "generate_abbreviations(\"a\")"
- Expected: "[\"a\",\"1\"]"

---

## 20. Beautiful Arrangement

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

Suppose you have n integers labeled 1 through n. A permutation of those n integers perm (1-indexed) is considered a beautiful arrangement if for every i (1 <= i <= n), either: perm[i] is divisible by i, or i is divisible by perm[i]. Given an integer n, return the number of beautiful arrangements you can construct.

### Key Insight

Permutation with position constraints: Like regular permutations, but add constraint checking at each position. Only place number if it satisfies divisibility rule with current position.

### Examples

**Example 1:**
- Input: n=2
- Output: 2
- Explanation: [1,2] and [2,1] are both beautiful arrangements

### Hints

1. Position-based permutation: try each number at each position
2. Track visited numbers with boolean array
3. Beautiful check: num % pos == 0 OR pos % num == 0
4. Base case: pos > n (placed all numbers)
5. Count solutions, not collect them (return integer)

### Starter Code

**Python:**
```python
def count_arrangement(n):
    """
    Count beautiful arrangements.
    
    Args:
        n: int - numbers from 1 to n
    
    Returns:
        int - count of beautiful arrangements
    """
    visited = [False] * (n + 1)
    
    def is_beautiful(num, pos):
        # TODO: Check if num at pos is beautiful
        # return num % pos == 0 or pos % num == 0
        pass
    
    def backtrack(pos):
        # TODO: Try each unvisited number at current position
        # Only place if beautiful
        pass
    
    return backtrack(1)
```

**JavaScript:**
```javascript
function count_arrangement(n) {
    """
    Count beautiful arrangements.
    
    Args:
        n: int - numbers from 1 to n
    
    Returns:
        int - count of beautiful arrangements
    """
    visited = [false] * (n + 1)
    
    function is_beautiful(num, pos) {
        // TODO: Check if num at pos is beautiful
        # return num % pos == 0 or pos % num == 0
  // TODO: implement
    function backtrack(pos) {
        // TODO: Try each unvisited number at current position
        # Only place if beautiful
  // TODO: implement
    return backtrack(1)
```

### Solution

**Python:**
```python
def count_arrangement(n):
    visited = [False] * (n + 1)
    
    def is_beautiful(num, pos):
        return num % pos == 0 or pos % num == 0
    
    def backtrack(pos):
        if pos > n:
            return 1
        
        count = 0
        for num in range(1, n + 1):
            if not visited[num] and is_beautiful(num, pos):
                visited[num] = True
                count += backtrack(pos + 1)
                visited[num] = False
        
        return count
    
    return backtrack(1)
```

**JavaScript:**
```javascript
function count_arrangement(n) {
    visited = [false] * (n + 1)
    
    function is_beautiful(num, pos) {
        return num % pos == 0 or pos % num == 0
    
    function backtrack(pos) {
        if pos > n:
            return 1
        
        count = 0
        for num in range(1, n + 1):
            if not visited[num] and is_beautiful(num, pos):
                visited[num] = true
                count += backtrack(pos + 1)
                visited[num] = false
        
        return count
    
    return backtrack(1)
```

### Test Cases

**Test 1:** Two beautiful arrangements
- Input: "count_arrangement(2)"
- Expected: "2"

**Test 2:** Single element
- Input: "count_arrangement(1)"
- Expected: "1"

**Test 3:** Three beautiful arrangements: [1,2,3], [2,1,3], [3,2,1]
- Input: "count_arrangement(3)"
- Expected: "3"

---

## 21. Fibonacci Number

**Difficulty:** easy
**Concept:** backtracking-trees

### Description

The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.

### Key Insight

Classic memoization intro: Recursive tree has massive overlap - F(5) calls F(4) and F(3), F(4) also calls F(3). Cache results to avoid recalculation.

### Examples

**Example 1:**
- Input: n=5
- Output: 5
- Explanation: F(5) = F(4) + F(3) = 3 + 2 = 5

### Hints

1. Base cases: F(0) = 0, F(1) = 1
2. Recursive relation: F(n) = F(n-1) + F(n-2)
3. Before computing, check if n in cache
4. After computing result, store it: cache[n] = result
5. Without memo: O(2^n). With memo: O(n)

### Starter Code

**Python:**
```python
def fib(n):
    """
    Calculate nth Fibonacci number with memoization.
    
    Args:
        n: int - position in Fibonacci sequence
    
    Returns:
        int - nth Fibonacci number
    """
    cache = {}
    
    def dp(n):
        # TODO: Check cache first
        # TODO: Base cases: n=0 returns 0, n=1 returns 1
        # TODO: Recursive: dp(n-1) + dp(n-2), store in cache
        pass
    
    return dp(n)
```

**JavaScript:**
```javascript
function fib(n) {
    """
    Calculate nth Fibonacci number with memoization.
    
    Args:
        n: int - position in Fibonacci sequence
    
    Returns:
        int - nth Fibonacci number
    """
    cache = {}
    
    function dp(n) {
        // TODO: Check cache first
        // TODO: Base cases: n=0 returns 0, n=1 returns 1
        // TODO: Recursive: dp(n-1) + dp(n-2), store in cache
  // TODO: implement
    return dp(n)
```

### Solution

**Python:**
```python
def fib(n):
    cache = {}
    
    def dp(n):
        if n in cache:
            return cache[n]
        
        if n <= 1:
            return n
        
        result = dp(n - 1) + dp(n - 2)
        cache[n] = result
        return result
    
    return dp(n)
```

**JavaScript:**
```javascript
function fib(n) {
    cache = {}
    
    function dp(n) {
        if n in cache:
            return cache[n]
        
        if n <= 1:
            return n
        
        result = dp(n - 1) + dp(n - 2)
        cache[n] = result
        return result
    
    return dp(n)
```

### Test Cases

**Test 1:** Base case
- Input: "fib(0)"
- Expected: "0"

**Test 2:** Base case
- Input: "fib(1)"
- Expected: "1"

**Test 3:** F(10) = 55
- Input: "fib(10)"
- Expected: "55"

---

## 22. Climbing Stairs

**Difficulty:** easy
**Concept:** backtracking-trees

### Description

You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

### Key Insight

Fibonacci in disguise: To reach step n, come from n-1 or n-2. This creates F(n) = F(n-1) + F(n-2) pattern. Memoize to avoid recalculating same steps.

### Examples

**Example 1:**
- Input: n=3
- Output: 3
- Explanation: Three ways: 1+1+1, 1+2, 2+1

### Hints

1. To reach step n: either from step n-1 or step n-2
2. Base cases: n=1 → 1 way, n=2 → 2 ways
3. Recurrence: ways(n) = ways(n-1) + ways(n-2)
4. This is exactly the Fibonacci sequence!
5. Use cache to store ways for each step

### Starter Code

**Python:**
```python
def climb_stairs(n):
    """
    Count ways to climb n stairs.
    
    Args:
        n: int - number of steps
    
    Returns:
        int - number of distinct ways
    """
    cache = {}
    
    def dp(n):
        # TODO: Add memoization
        # TODO: Base cases: n=1 or n=2
        # TODO: Recursive: ways(n-1) + ways(n-2)
        pass
    
    return dp(n)
```

**JavaScript:**
```javascript
function climb_stairs(n) {
    """
    Count ways to climb n stairs.
    
    Args:
        n: int - number of steps
    
    Returns:
        int - number of distinct ways
    """
    cache = {}
    
    function dp(n) {
        // TODO: Add memoization
        // TODO: Base cases: n=1 or n=2
        // TODO: Recursive: ways(n-1) + ways(n-2)
  // TODO: implement
    return dp(n)
```

### Solution

**Python:**
```python
def climb_stairs(n):
    cache = {}
    
    def dp(n):
        if n in cache:
            return cache[n]
        
        if n <= 2:
            return n
        
        result = dp(n - 1) + dp(n - 2)
        cache[n] = result
        return result
    
    return dp(n)
```

**JavaScript:**
```javascript
function climb_stairs(n) {
    cache = {}
    
    function dp(n) {
        if n in cache:
            return cache[n]
        
        if n <= 2:
            return n
        
        result = dp(n - 1) + dp(n - 2)
        cache[n] = result
        return result
    
    return dp(n)
```

### Test Cases

**Test 1:** Two ways: 1+1 or 2
- Input: "climb_stairs(2)"
- Expected: "2"

**Test 2:** Three ways
- Input: "climb_stairs(3)"
- Expected: "3"

**Test 3:** Eight distinct ways
- Input: "climb_stairs(5)"
- Expected: "8"

---

## 23. House Robber

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses are arranged in a line, and adjacent houses have security systems connected. You cannot rob two adjacent houses. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.

### Key Insight

Non-adjacent max pattern: At each house, choose to rob (add value + skip next) or skip (move to next). Recurrence: rob(i) = max(nums[i] + rob(i+2), rob(i+1)).

### Examples

**Example 1:**
- Input: [1,2,3,1]
- Output: 4
- Explanation: Rob house 1 (1) and house 3 (3) for total 4

### Hints

1. At each house: rob it (add value, skip to i+2) OR skip it (go to i+1)
2. Base cases: index >= len(nums) returns 0
3. Recurrence: dp(i) = max(nums[i] + dp(i+2), dp(i+1))
4. State: current index determines subproblem
5. Cache by index to avoid recalculating

### Starter Code

**Python:**
```python
def rob(nums):
    """
    Find maximum money you can rob without adjacent houses.
    
    Args:
        nums: List[int] - money in each house
    
    Returns:
        int - maximum money
    """
    cache = {}
    
    def dp(index):
        # TODO: Base cases
        # TODO: Choice: rob current + skip next, OR skip current
        # TODO: Memoize result
        pass
    
    return dp(0)
```

**JavaScript:**
```javascript
function rob(nums) {
    """
    Find maximum money you can rob without adjacent houses.
    
    Args:
        nums: Array - money in each house
    
    Returns:
        int - maximum money
    """
    cache = {}
    
    function dp(index) {
        // TODO: Base cases
        // TODO: Choice: rob current + skip next, OR skip current
        // TODO: Memoize result
  // TODO: implement
    return dp(0)
```

### Solution

**Python:**
```python
def rob(nums):
    cache = {}
    
    def dp(index):
        if index >= len(nums):
            return 0
        
        if index in cache:
            return cache[index]
        
        # Rob current + skip next, OR skip current
        result = max(nums[index] + dp(index + 2), dp(index + 1))
        cache[index] = result
        return result
    
    return dp(0)
```

**JavaScript:**
```javascript
function rob(nums) {
    cache = {}
    
    function dp(index) {
        if index >= len(nums):
            return 0
        
        if index in cache:
            return cache[index]
        
        # Rob current + skip next, OR skip current
        result = max(nums[index] + dp(index + 2), dp(index + 1))
        cache[index] = result
        return result
    
    return dp(0)
```

### Test Cases

**Test 1:** Rob houses 0 and 2
- Input: "rob([1,2,3,1])"
- Expected: "4"

**Test 2:** Rob houses 0, 2, and 4 for 2+9+1=12
- Input: "rob([2,7,9,3,1])"
- Expected: "12"

**Test 3:** Rob houses 0 and 3
- Input: "rob([2,1,1,2])"
- Expected: "4"

---

## 24. Coin Change

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.

### Key Insight

Minimum coins pattern: For each coin, try using it (1 + solve for remaining). Take minimum across all coins. Memoize by remaining amount.

### Examples

**Example 1:**
- Input: coins=[1,2,5], amount=11
- Output: 3
- Explanation: 11 = 5 + 5 + 1 (three coins)

### Hints

1. Base cases: remaining=0 returns 0, remaining<0 returns infinity
2. For each coin, if we use it: 1 + dp(remaining - coin)
3. Take minimum across all coin choices
4. Memoize by remaining amount
5. Return -1 if result is infinity (impossible)

### Starter Code

**Python:**
```python
def coin_change(coins, amount):
    """
    Find minimum coins needed for amount.
    
    Args:
        coins: List[int] - coin denominations
        amount: int - target amount
    
    Returns:
        int - minimum number of coins (-1 if impossible)
    """
    cache = {}
    
    def dp(remaining):
        # TODO: Base cases: remaining=0, remaining<0
        # TODO: Try each coin, take minimum
        # TODO: Memoize by remaining amount
        pass
    
    return dp(amount)
```

**JavaScript:**
```javascript
function coin_change(coins, amount) {
    """
    Find minimum coins needed for amount.
    
    Args:
        coins: Array - coin denominations
        amount: int - target amount
    
    Returns:
        int - minimum number of coins (-1 if impossible)
    """
    cache = {}
    
    function dp(remaining) {
        // TODO: Base cases: remaining=0, remaining<0
        // TODO: Try each coin, take minimum
        // TODO: Memoize by remaining amount
  // TODO: implement
    return dp(amount)
```

### Solution

**Python:**
```python
def coin_change(coins, amount):
    cache = {}
    
    def dp(remaining):
        if remaining == 0:
            return 0
        if remaining < 0:
            return float('inf')
        
        if remaining in cache:
            return cache[remaining]
        
        min_coins = float('inf')
        for coin in coins:
            result = dp(remaining - coin)
            min_coins = min(min_coins, 1 + result)
        
        cache[remaining] = min_coins
        return min_coins
    
    result = dp(amount)
    return result if result != float('inf') else -1
```

**JavaScript:**
```javascript
function coin_change(coins, amount) {
    cache = {}
    
    function dp(remaining) {
        if remaining == 0:
            return 0
        if remaining < 0:
            return float('inf')
        
        if remaining in cache:
            return cache[remaining]
        
        min_coins = float('inf')
        for coin in coins:
            result = dp(remaining - coin)
            min_coins = min(min_coins, 1 + result)
        
        cache[remaining] = min_coins
        return min_coins
    
    result = dp(amount)
    return result if result != float('inf') else -1
```

### Test Cases

**Test 1:** Minimum 3 coins: 5+5+1
- Input: "coin_change([1,2,5], 11)"
- Expected: "3"

**Test 2:** Impossible to make 3 with only 2-cent coins
- Input: "coin_change([2], 3)"
- Expected: "-1"

**Test 3:** Zero coins needed for amount 0
- Input: "coin_change([1], 0)"
- Expected: "0"

---

## 25. Coin Change II

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the number of combinations that make up that amount. If that amount of money cannot be made up by any combination of the coins, return 0.

### Key Insight

Count ways pattern: Track (remaining, index) to avoid duplicate combinations. Include current coin (stay at index) or skip (move to next). Memoize 2D state.

### Examples

**Example 1:**
- Input: amount=5, coins=[1,2,5]
- Output: 4
- Explanation: Four ways: [5], [2,2,1], [2,1,1,1], [1,1,1,1,1]

### Hints

1. State: (remaining amount, current coin index)
2. Base: remaining=0 returns 1, remaining<0 or index>=len returns 0
3. Include coin: dp(remaining - coins[index], index) - stay at same index
4. Skip coin: dp(remaining, index + 1) - move to next coin
5. Memoize using (remaining, index) tuple as key

### Starter Code

**Python:**
```python
def change(amount, coins):
    """
    Count ways to make amount with coins.
    
    Args:
        amount: int - target amount
        coins: List[int] - coin denominations
    
    Returns:
        int - number of combinations
    """
    cache = {}
    
    def dp(remaining, index):
        # TODO: Base cases
        # TODO: Include coin or skip coin
        # TODO: Memoize (remaining, index)
        pass
    
    return dp(amount, 0)
```

**JavaScript:**
```javascript
function change(amount, coins) {
    """
    Count ways to make amount with coins.
    
    Args:
        amount: int - target amount
        coins: Array - coin denominations
    
    Returns:
        int - number of combinations
    """
    cache = {}
    
    function dp(remaining, index) {
        // TODO: Base cases
        // TODO: Include coin or skip coin
        // TODO: Memoize (remaining, index)
  // TODO: implement
    return dp(amount, 0)
```

### Solution

**Python:**
```python
def change(amount, coins):
    cache = {}
    
    def dp(remaining, index):
        if remaining == 0:
            return 1
        if remaining < 0 or index >= len(coins):
            return 0
        
        if (remaining, index) in cache:
            return cache[(remaining, index)]
        
        include = dp(remaining - coins[index], index)
        skip = dp(remaining, index + 1)
        
        cache[(remaining, index)] = include + skip
        return cache[(remaining, index)]
    
    return dp(amount, 0)
```

**JavaScript:**
```javascript
function change(amount, coins) {
    cache = {}
    
    function dp(remaining, index) {
        if remaining == 0:
            return 1
        if remaining < 0 or index >= len(coins):
            return 0
        
        if (remaining, index) in cache:
            return cache[(remaining, index)]
        
        include = dp(remaining - coins[index], index)
        skip = dp(remaining, index + 1)
        
        cache[(remaining, index)] = include + skip
        return cache[(remaining, index)]
    
    return dp(amount, 0)
```

### Test Cases

**Test 1:** Four ways to make 5
- Input: "change(5, [1,2,5])"
- Expected: "4"

**Test 2:** Impossible to make 3 with 2-coins
- Input: "change(3, [2])"
- Expected: "0"

**Test 3:** One way: exactly one 10-coin
- Input: "change(10, [10])"
- Expected: "1"

---

## 26. Word Break

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.

### Key Insight

String segmentation: At each index, try all possible word lengths. If s[index:index+len] is in dict, recurse on remaining. Memoize by index.

### Examples

**Example 1:**
- Input: s="leetcode", wordDict=["leet","code"]
- Output: true
- Explanation: Can segment as "leet code"

### Hints

1. Convert wordDict to set for O(1) lookup
2. Base case: index == len(s) returns True (segmented entire string)
3. Try all substring lengths: s[index:index+length]
4. If substring in word_set and dp(index+length) is True, return True
5. Memoize by starting index

### Starter Code

**Python:**
```python
def word_break(s, wordDict):
    """
    Check if string can be segmented into dictionary words.
    
    Args:
        s: str - input string
        wordDict: List[str] - dictionary of valid words
    
    Returns:
        bool - True if can be segmented
    """
    word_set = set(wordDict)
    cache = {}
    
    def dp(index):
        # TODO: Base case: reached end of string
        # TODO: Try all word lengths from current index
        # TODO: Memoize by index
        pass
    
    return dp(0)
```

**JavaScript:**
```javascript
function word_break(s, wordDict) {
    """
    Check if string can be segmented into dictionary words.
    
    Args:
        s: str - input string
        wordDict: Array - dictionary of valid words
    
    Returns:
        bool - true if can be segmented
    """
    word_set = set(wordDict)
    cache = {}
    
    function dp(index) {
        // TODO: Base case: reached end of string
        // TODO: Try all word lengths from current index
        // TODO: Memoize by index
  // TODO: implement
    return dp(0)
```

### Solution

**Python:**
```python
def word_break(s, wordDict):
    word_set = set(wordDict)
    cache = {}
    
    def dp(index):
        if index == len(s):
            return True
        
        if index in cache:
            return cache[index]
        
        for end in range(index + 1, len(s) + 1):
            word = s[index:end]
            if word in word_set and dp(end):
                cache[index] = True
                return True
        
        cache[index] = False
        return False
    
    return dp(0)
```

**JavaScript:**
```javascript
function word_break(s, wordDict) {
    word_set = set(wordDict)
    cache = {}
    
    function dp(index) {
        if index == len(s):
            return true
        
        if index in cache:
            return cache[index]
        
        for end in range(index + 1, len(s) + 1):
            word = s[index:end]
            if word in word_set and dp(end):
                cache[index] = true
                return true
        
        cache[index] = false
        return false
    
    return dp(0)
```

### Test Cases

**Test 1:** Can segment into "leet" + "code"
- Input: "word_break(\"leetcode\", [\"leet\",\"code\"])"
- Expected: "True"

**Test 2:** Can segment into "apple" + "pen" + "apple"
- Input: "word_break(\"applepenapple\", [\"apple\",\"pen\"])"
- Expected: "True"

**Test 3:** Cannot segment fully
- Input: "word_break(\"catsandog\", [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"])"
- Expected: "False"

---

## 27. Decode Ways

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

A message containing letters from A-Z can be encoded into numbers using the following mapping: "A"->1, "B"->2, ..., "Z"->26. Given a string s containing only digits, return the number of ways to decode it.

### Key Insight

Digit decoding: At each index, try decoding 1 digit (if valid 1-9) or 2 digits (if valid 10-26). Sum both ways. Memoize by index.

### Examples

**Example 1:**
- Input: s="12"
- Output: 2
- Explanation: Can decode as "AB" (1,2) or "L" (12)

### Hints

1. Base case: index == len(s) returns 1 (valid decoding)
2. Invalid: if s[index] == "0", return 0 (cannot decode)
3. Try 1-digit: if s[index] in "1-9", add dp(index+1)
4. Try 2-digit: if s[index:index+2] in "10-26", add dp(index+2)
5. Memoize by index to avoid recalculation

### Starter Code

**Python:**
```python
def num_decodings(s):
    """
    Count ways to decode a digit string.
    
    Args:
        s: str - digit string
    
    Returns:
        int - number of decoding ways
    """
    cache = {}
    
    def dp(index):
        # TODO: Base cases
        # TODO: Try 1-digit decode (if 1-9)
        # TODO: Try 2-digit decode (if 10-26)
        # TODO: Sum both ways, memoize
        pass
    
    return dp(0)
```

**JavaScript:**
```javascript
function num_decodings(s) {
    """
    Count ways to decode a digit string.
    
    Args:
        s: str - digit string
    
    Returns:
        int - number of decoding ways
    """
    cache = {}
    
    function dp(index) {
        // TODO: Base cases
        // TODO: Try 1-digit decode (if 1-9)
        // TODO: Try 2-digit decode (if 10-26)
        // TODO: Sum both ways, memoize
  // TODO: implement
    return dp(0)
```

### Solution

**Python:**
```python
def num_decodings(s):
    cache = {}
    
    def dp(index):
        if index == len(s):
            return 1
        
        if s[index] == '0':
            return 0
        
        if index in cache:
            return cache[index]
        
        ways = dp(index + 1)
        
        if index + 1 < len(s):
            two_digit = int(s[index:index+2])
            if 10 <= two_digit <= 26:
                ways += dp(index + 2)
        
        cache[index] = ways
        return ways
    
    return dp(0)
```

**JavaScript:**
```javascript
function num_decodings(s) {
    cache = {}
    
    function dp(index) {
        if index == len(s):
            return 1
        
        if s[index] == '0':
            return 0
        
        if index in cache:
            return cache[index]
        
        ways = dp(index + 1)
        
        if index + 1 < len(s):
            two_digit = int(s[index:index+2])
            if 10 <= two_digit <= 26:
                ways += dp(index + 2)
        
        cache[index] = ways
        return ways
    
    return dp(0)
```

### Test Cases

**Test 1:** Two ways: "AB" or "L"
- Input: "num_decodings(\"12\")"
- Expected: "2"

**Test 2:** Three ways: "BZ", "VF", "BBF"
- Input: "num_decodings(\"226\")"
- Expected: "3"

**Test 3:** Invalid: starts with 0
- Input: "num_decodings(\"06\")"
- Expected: "0"

---

## 28. Target Sum

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

You are given an integer array nums and an integer target. You want to build an expression out of nums by adding one of the symbols "+" and "-" before each integer in nums and then concatenate all the integers. Return the number of different expressions that you can build, which evaluates to target.

### Key Insight

Assign +/- pattern: At each index, try adding or subtracting current number. State is (index, current_sum). Memoize 2D state to avoid recalculation.

### Examples

**Example 1:**
- Input: nums=[1,1,1,1,1], target=3
- Output: 5
- Explanation: Five ways: +1+1+1+1-1, +1+1+1-1+1, etc.

### Hints

1. State: (index, current_sum)
2. Base: if index == len(nums), return 1 if current_sum == target else 0
3. Try adding: dp(index+1, current_sum + nums[index])
4. Try subtracting: dp(index+1, current_sum - nums[index])
5. Sum both ways, memoize by (index, current_sum)

### Starter Code

**Python:**
```python
def find_target_sum_ways(nums, target):
    """
    Count ways to assign +/- to reach target sum.
    
    Args:
        nums: List[int] - array of numbers
        target: int - target sum
    
    Returns:
        int - number of ways
    """
    cache = {}
    
    def dp(index, current_sum):
        # TODO: Base case: reached end, check if sum == target
        # TODO: Try adding or subtracting nums[index]
        # TODO: Memoize (index, current_sum)
        pass
    
    return dp(0, 0)
```

**JavaScript:**
```javascript
function find_target_sum_ways(nums, target) {
    """
    Count ways to assign +/- to reach target sum.
    
    Args:
        nums: Array - array of numbers
        target: int - target sum
    
    Returns:
        int - number of ways
    """
    cache = {}
    
    function dp(index, current_sum) {
        // TODO: Base case: reached end, check if sum == target
        // TODO: Try adding or subtracting nums[index]
        // TODO: Memoize (index, current_sum)
  // TODO: implement
    return dp(0, 0)
```

### Solution

**Python:**
```python
def find_target_sum_ways(nums, target):
    cache = {}
    
    def dp(index, current_sum):
        if index == len(nums):
            return 1 if current_sum == target else 0
        
        if (index, current_sum) in cache:
            return cache[(index, current_sum)]
        
        add = dp(index + 1, current_sum + nums[index])
        subtract = dp(index + 1, current_sum - nums[index])
        
        cache[(index, current_sum)] = add + subtract
        return cache[(index, current_sum)]
    
    return dp(0, 0)
```

**JavaScript:**
```javascript
function find_target_sum_ways(nums, target) {
    cache = {}
    
    function dp(index, current_sum) {
        if index == len(nums):
            return 1 if current_sum == target else 0
        
        if (index, current_sum) in cache:
            return cache[(index, current_sum)]
        
        add = dp(index + 1, current_sum + nums[index])
        subtract = dp(index + 1, current_sum - nums[index])
        
        cache[(index, current_sum)] = add + subtract
        return cache[(index, current_sum)]
    
    return dp(0, 0)
```

### Test Cases

**Test 1:** Five ways to reach sum 3
- Input: "find_target_sum_ways([1,1,1,1,1], 3)"
- Expected: "5"

**Test 2:** One way: +1
- Input: "find_target_sum_ways([1], 1)"
- Expected: "1"

**Test 3:** Two ways: +1+0 or +1-0
- Input: "find_target_sum_ways([1,0], 1)"
- Expected: "2"

---

## 29. Partition Equal Subset Sum

**Difficulty:** medium
**Concept:** backtracking-trees
**Family:** backtracking:subsets

### Description

Given an integer array nums, return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal.

### Key Insight

0/1 knapsack pattern: If total sum is odd, impossible. Otherwise, find if subset exists that sums to total/2. State: (index, remaining_sum).

### Examples

**Example 1:**
- Input: [1,5,11,5]
- Output: true
- Explanation: Can partition into [1,5,5] and [11]

### Hints

1. First check: if sum(nums) is odd, return False immediately
2. Goal: find subset that sums to total/2
3. State: (index, remaining_sum)
4. Base: remaining == 0 returns True, index >= len or remaining < 0 returns False
5. Include: dp(index+1, remaining - nums[index])
6. Exclude: dp(index+1, remaining)
7. Return True if either path succeeds

### Starter Code

**Python:**
```python
def can_partition(nums):
    """
    Check if can partition into two equal-sum subsets.
    
    Args:
        nums: List[int] - array of integers
    
    Returns:
        bool - True if can partition equally
    """
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    cache = {}
    
    def dp(index, remaining):
        # TODO: Base cases
        # TODO: Include or exclude nums[index]
        # TODO: Memoize (index, remaining)
        pass
    
    return dp(0, target)
```

**JavaScript:**
```javascript
function can_partition(nums) {
    """
    Check if can partition into two equal-sum subsets.
    
    Args:
        nums: Array - array of integers
    
    Returns:
        bool - true if can partition equally
    """
    total = sum(nums)
    if total % 2 != 0:
        return false
    
    target = total // 2
    cache = {}
    
    function dp(index, remaining) {
        // TODO: Base cases
        // TODO: Include or exclude nums[index]
        // TODO: Memoize (index, remaining)
  // TODO: implement
    return dp(0, target)
```

### Solution

**Python:**
```python
def can_partition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    cache = {}
    
    def dp(index, remaining):
        if remaining == 0:
            return True
        if index >= len(nums) or remaining < 0:
            return False
        
        if (index, remaining) in cache:
            return cache[(index, remaining)]
        
        include = dp(index + 1, remaining - nums[index])
        exclude = dp(index + 1, remaining)
        
        cache[(index, remaining)] = include or exclude
        return cache[(index, remaining)]
    
    return dp(0, target)
```

**JavaScript:**
```javascript
function can_partition(nums) {
    total = sum(nums)
    if total % 2 != 0:
        return false
    
    target = total // 2
    cache = {}
    
    function dp(index, remaining) {
        if remaining == 0:
            return true
        if index >= len(nums) or remaining < 0:
            return false
        
        if (index, remaining) in cache:
            return cache[(index, remaining)]
        
        include = dp(index + 1, remaining - nums[index])
        exclude = dp(index + 1, remaining)
        
        cache[(index, remaining)] = include or exclude
        return cache[(index, remaining)]
    
    return dp(0, target)
```

### Test Cases

**Test 1:** Can partition: [1,5,5] and [11]
- Input: "can_partition([1,5,11,5])"
- Expected: "True"

**Test 2:** Cannot partition equally
- Input: "can_partition([1,2,3,5])"
- Expected: "False"

**Test 3:** Simple equal partition
- Input: "can_partition([1,1])"
- Expected: "True"

---

## 30. Perfect Squares

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

Given an integer n, return the least number of perfect square numbers that sum to n.

### Key Insight

Unbounded knapsack: For each remaining value, try all perfect squares ≤ remaining. Take minimum count. Memoize by remaining value.

### Examples

**Example 1:**
- Input: n=12
- Output: 3
- Explanation: 12 = 4 + 4 + 4 (three perfect squares)

### Hints

1. Base cases: remaining == 0 returns 0, remaining < 0 returns infinity
2. For remaining value, try all i where i*i <= remaining
3. Using square i*i: 1 + dp(remaining - i*i)
4. Take minimum across all valid perfect squares
5. Memoize by remaining value

### Starter Code

**Python:**
```python
def num_squares(n):
    """
    Find minimum perfect squares that sum to n.
    
    Args:
        n: int - target sum
    
    Returns:
        int - minimum number of perfect squares
    """
    cache = {}
    
    def dp(remaining):
        # TODO: Base cases
        # TODO: Try all perfect squares i^2 <= remaining
        # TODO: Take minimum, memoize
        pass
    
    return dp(n)
```

**JavaScript:**
```javascript
function num_squares(n) {
    """
    Find minimum perfect squares that sum to n.
    
    Args:
        n: int - target sum
    
    Returns:
        int - minimum number of perfect squares
    """
    cache = {}
    
    function dp(remaining) {
        // TODO: Base cases
        // TODO: Try all perfect squares i^2 <= remaining
        // TODO: Take minimum, memoize
  // TODO: implement
    return dp(n)
```

### Solution

**Python:**
```python
def num_squares(n):
    cache = {}
    
    def dp(remaining):
        if remaining == 0:
            return 0
        if remaining < 0:
            return float('inf')
        
        if remaining in cache:
            return cache[remaining]
        
        min_count = float('inf')
        i = 1
        while i * i <= remaining:
            result = dp(remaining - i * i)
            min_count = min(min_count, 1 + result)
            i += 1
        
        cache[remaining] = min_count
        return min_count
    
    return dp(n)
```

**JavaScript:**
```javascript
function num_squares(n) {
    cache = {}
    
    function dp(remaining) {
        if remaining == 0:
            return 0
        if remaining < 0:
            return float('inf')
        
        if remaining in cache:
            return cache[remaining]
        
        min_count = float('inf')
        i = 1
        while i * i <= remaining:
            result = dp(remaining - i * i)
            min_count = min(min_count, 1 + result)
            i += 1
        
        cache[remaining] = min_count
        return min_count
    
    return dp(n)
```

### Test Cases

**Test 1:** 12 = 4+4+4
- Input: "num_squares(12)"
- Expected: "3"

**Test 2:** 13 = 4+9
- Input: "num_squares(13)"
- Expected: "2"

**Test 3:** Single perfect square
- Input: "num_squares(1)"
- Expected: "1"

---

## 31. Longest Common Subsequence (LCS)

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

Given two strings text1 and text2, return the length of their longest common subsequence. A subsequence is a sequence that appears in the same relative order, but not necessarily contiguous.

### Key Insight

2D DP pattern: dp[i][j] = LCS of text1[0...i-1] and text2[0...j-1]. If chars match: 1 + dp[i-1][j-1]. Else: max(dp[i-1][j], dp[i][j-1]). Classic interview problem!

### Examples

**Example 1:**
- Input: text1="abcde", text2="ace"
- Output: 3
- Explanation: LCS is "ace" with length 3

**Example 2:**
- Input: text1="abc", text2="def"
- Output: 0
- Explanation: No common subsequence

### Hints

1. Base case: if i >= len(text1) or j >= len(text2), return 0
2. Check cache: if (i, j) in cache, return cached value
3. If text1[i] == text2[j]: characters match! Add 1 + dp(i+1, j+1)
4. Else: take max of skipping char in text1 OR text2: max(dp(i+1, j), dp(i, j+1))
5. Cache result: cache[(i, j)] = result before returning
6. Time: O(m*n), Space: O(m*n) for memoization

### Starter Code

**Python:**
```python
def longest_common_subsequence(text1, text2):
    """
    Find length of longest common subsequence using 2D DP.

    Args:
        text1: str - first string
        text2: str - second string

    Returns:
        int - length of LCS
    """
    cache = {}

    def dp(i, j):
        # Base case: if either string exhausted, LCS is 0
        # If text1[i] == text2[j]: 1 + dp(i+1, j+1)
        # Else: max(dp(i+1, j), dp(i, j+1))
        pass

    return dp(0, 0)
```

**JavaScript:**
```javascript
function longest_common_subsequence(text1, text2) {
    """
    Find length of longest common subsequence using 2D DP.

    Args:
        text1: str - first string
        text2: str - second string

    Returns:
        int - length of LCS
    """
    cache = {}

    function dp(i, j) {
        # Base case: if either string exhausted, LCS is 0
        # If text1[i] == text2[j]: 1 + dp(i+1, j+1)
        # Else: max(dp(i+1, j), dp(i, j+1))
  // TODO: implement
    return dp(0, 0)
```

### Solution

**Python:**
```python
def longest_common_subsequence(text1, text2):
    cache = {}

    def dp(i, j):
        if i >= len(text1) or j >= len(text2):
            return 0

        if (i, j) in cache:
            return cache[(i, j)]

        if text1[i] == text2[j]:
            result = 1 + dp(i + 1, j + 1)
        else:
            result = max(dp(i + 1, j), dp(i, j + 1))

        cache[(i, j)] = result
        return result

    return dp(0, 0)
```

**JavaScript:**
```javascript
function longest_common_subsequence(text1, text2) {
    cache = {}

    function dp(i, j) {
        if i >= len(text1) or j >= len(text2):
            return 0

        if (i, j) in cache:
            return cache[(i, j)]

        if text1[i] == text2[j]:
            result = 1 + dp(i + 1, j + 1)
        else:
            result = max(dp(i + 1, j), dp(i, j + 1))

        cache[(i, j)] = result
        return result

    return dp(0, 0)
```

### Test Cases

**Test 1:** LCS is "ace"
- Input: "longest_common_subsequence(\"abcde\", \"ace\")"
- Expected: "3"

**Test 2:** Identical strings
- Input: "longest_common_subsequence(\"abc\", \"abc\")"
- Expected: "3"

**Test 3:** No common subsequence
- Input: "longest_common_subsequence(\"abc\", \"def\")"
- Expected: "0"

---

## 32. Edit Distance

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You can insert, delete, or replace any character.

### Key Insight

2D DP: dp[i][j] = min operations to convert word1[0...i] to word2[0...j]. If chars match: dp[i-1][j-1]. Else: 1 + min(insert, delete, replace). Levenshtein distance - critical for Google interviews!

### Examples

**Example 1:**
- Input: word1="horse", word2="ros"
- Output: 3
- Explanation: horse → rorse (replace h→r) → rose (remove r) → ros (remove e)

**Example 2:**
- Input: word1="intention", word2="execution"
- Output: 5
- Explanation: intention → execution requires 5 operations

### Hints

1. Base: if i == len(word1), need to insert len(word2) - j characters
2. Base: if j == len(word2), need to delete len(word1) - i characters
3. If word1[i] == word2[j]: chars match, no operation needed → dp(i+1, j+1)
4. Else three choices: insert = dp(i, j+1), delete = dp(i+1, j), replace = dp(i+1, j+1)
5. Take minimum: 1 + min(insert, delete, replace)
6. Memoize on (i, j) to avoid recomputation

### Starter Code

**Python:**
```python
def min_distance(word1, word2):
    """
    Find minimum edit distance using 2D DP.

    Args:
        word1: str - source word
        word2: str - target word

    Returns:
        int - minimum number of operations
    """
    cache = {}

    def dp(i, j):
        # Base: if i exhausted, insert remaining j chars
        # Base: if j exhausted, delete remaining i chars
        # Match: dp(i+1, j+1)
        # No match: 1 + min(insert, delete, replace)
        pass

    return dp(0, 0)
```

**JavaScript:**
```javascript
function min_distance(word1, word2) {
    """
    Find minimum edit distance using 2D DP.

    Args:
        word1: str - source word
        word2: str - target word

    Returns:
        int - minimum number of operations
    """
    cache = {}

    function dp(i, j) {
        # Base: if i exhausted, insert remaining j chars
        # Base: if j exhausted, delete remaining i chars
        # Match: dp(i+1, j+1)
        # No match: 1 + min(insert, delete, replace)
  // TODO: implement
    return dp(0, 0)
```

### Solution

**Python:**
```python
def min_distance(word1, word2):
    cache = {}

    def dp(i, j):
        if i == len(word1):
            return len(word2) - j
        if j == len(word2):
            return len(word1) - i

        if (i, j) in cache:
            return cache[(i, j)]

        if word1[i] == word2[j]:
            result = dp(i + 1, j + 1)
        else:
            insert = dp(i, j + 1)
            delete = dp(i + 1, j)
            replace = dp(i + 1, j + 1)
            result = 1 + min(insert, delete, replace)

        cache[(i, j)] = result
        return result

    return dp(0, 0)
```

**JavaScript:**
```javascript
function min_distance(word1, word2) {
    cache = {}

    function dp(i, j) {
        if i == len(word1):
            return len(word2) - j
        if j == len(word2):
            return len(word1) - i

        if (i, j) in cache:
            return cache[(i, j)]

        if word1[i] == word2[j]:
            result = dp(i + 1, j + 1)
        else:
            insert = dp(i, j + 1)
            delete = dp(i + 1, j)
            replace = dp(i + 1, j + 1)
            result = 1 + min(insert, delete, replace)

        cache[(i, j)] = result
        return result

    return dp(0, 0)
```

### Test Cases

**Test 1:** horse → ros in 3 operations
- Input: "min_distance(\"horse\", \"ros\")"
- Expected: "3"

**Test 2:** 5 operations needed
- Input: "min_distance(\"intention\", \"execution\")"
- Expected: "5"

**Test 3:** Insert 3 characters
- Input: "min_distance(\"\", \"abc\")"
- Expected: "3"

---

## 33. Longest Increasing Subsequence

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

Given an integer array nums, return the length of the longest strictly increasing subsequence. A subsequence is derived by deleting some elements without changing the order.

### Key Insight

LIS pattern: For each element, decide to include it (if it extends current sequence) or skip it. Track length of LIS ending at each position. O(n²) DP or O(n log n) with binary search.

### Examples

**Example 1:**
- Input: nums=[10,9,2,5,3,7,101,18]
- Output: 4
- Explanation: LIS is [2,3,7,101] with length 4

**Example 2:**
- Input: nums=[0,1,0,3,2,3]
- Output: 4
- Explanation: LIS is [0,1,2,3]

### Hints

1. State: (index, previous_value) - what position and what was last included
2. Base case: if index >= len(nums), return 0
3. Always have option to skip: skip = dp(i+1, prev)
4. Can take if nums[i] > prev: take = 1 + dp(i+1, nums[i])
5. Return max(skip, take) if can take, else just skip
6. Alternative: use index-based DP with O(n²) approach

### Starter Code

**Python:**
```python
def length_of_lis(nums):
    """
    Find length of longest increasing subsequence using DP.

    Args:
        nums: List[int] - input array

    Returns:
        int - length of LIS
    """
    cache = {}

    def dp(i, prev):
        # i = current index, prev = previous value in sequence
        # Base: if i == len(nums), return 0
        # Choice 1: skip current element → dp(i+1, prev)
        # Choice 2: take if nums[i] > prev → 1 + dp(i+1, nums[i])
        pass

    return dp(0, float('-inf'))
```

**JavaScript:**
```javascript
function length_of_lis(nums) {
    """
    Find length of longest increasing subsequence using DP.

    Args:
        nums: Array - input array

    Returns:
        int - length of LIS
    """
    cache = {}

    function dp(i, prev) {
        # i = current index, prev = previous value in sequence
        # Base: if i == len(nums), return 0
        # Choice 1: skip current element → dp(i+1, prev)
        # Choice 2: take if nums[i] > prev → 1 + dp(i+1, nums[i])
  // TODO: implement
    return dp(0, float('-inf'))
```

### Solution

**Python:**
```python
def length_of_lis(nums):
    cache = {}

    def dp(i, prev):
        if i >= len(nums):
            return 0

        if (i, prev) in cache:
            return cache[(i, prev)]

        # Option 1: skip current
        skip = dp(i + 1, prev)

        # Option 2: take current (if valid)
        take = 0
        if nums[i] > prev:
            take = 1 + dp(i + 1, nums[i])

        result = max(skip, take)
        cache[(i, prev)] = result
        return result

    return dp(0, float('-inf'))
```

**JavaScript:**
```javascript
function length_of_lis(nums) {
    cache = {}

    function dp(i, prev) {
        if i >= len(nums):
            return 0

        if (i, prev) in cache:
            return cache[(i, prev)]

        # Option 1: skip current
        skip = dp(i + 1, prev)

        # Option 2: take current (if valid)
        take = 0
        if nums[i] > prev:
            take = 1 + dp(i + 1, nums[i])

        result = max(skip, take)
        cache[(i, prev)] = result
        return result

    return dp(0, float('-inf'))
```

### Test Cases

**Test 1:** LIS: [2,3,7,101]
- Input: "length_of_lis([10,9,2,5,3,7,101,18])"
- Expected: "4"

**Test 2:** LIS: [0,1,2,3]
- Input: "length_of_lis([0,1,0,3,2,3])"
- Expected: "4"

**Test 3:** All same values
- Input: "length_of_lis([7,7,7,7,7])"
- Expected: "1"

---

## 34. Best Time to Buy and Sell Stock

**Difficulty:** easy
**Concept:** backtracking-trees

### Description

You are given an array prices where prices[i] is the price of a given stock on the ith day. Maximize profit by choosing a single day to buy and a single day to sell. Return the maximum profit (or 0 if no profit possible).

### Key Insight

Simple state tracking: Track minimum price seen so far. At each day, calculate profit if selling today. Update global max profit. Foundation for state machine DP.

### Examples

**Example 1:**
- Input: prices=[7,1,5,3,6,4]
- Output: 5
- Explanation: Buy on day 2 (price=1), sell on day 5 (price=6), profit=5

**Example 2:**
- Input: prices=[7,6,4,3,1]
- Output: 0
- Explanation: No profitable transaction

### Hints

1. Initialize min_price = infinity, max_profit = 0
2. For each price: update min_price = min(min_price, price)
3. Calculate potential profit: price - min_price
4. Update max_profit = max(max_profit, potential_profit)
5. Simple O(n) single pass, no memoization needed
6. But sets foundation for multi-transaction state machine DP

### Starter Code

**Python:**
```python
def max_profit(prices):
    """
    Find maximum profit from single buy-sell transaction.

    Args:
        prices: List[int] - daily stock prices

    Returns:
        int - maximum profit
    """
    # Track minimum price and maximum profit
    min_price = float('inf')
    max_profit = 0

    # For each day, update min and check profit
    pass
```

**JavaScript:**
```javascript
function max_profit(prices) {
    """
    Find maximum profit from single buy-sell transaction.

    Args:
        prices: Array - daily stock prices

    Returns:
        int - maximum profit
    """
    # Track minimum price and maximum profit
    min_price = float('inf')
    max_profit = 0

    # For each day, update min and check profit
  // TODO: implement
```

### Solution

**Python:**
```python
def max_profit(prices):
    min_price = float('inf')
    max_profit = 0

    for price in prices:
        min_price = min(min_price, price)
        profit = price - min_price
        max_profit = max(max_profit, profit)

    return max_profit
```

**JavaScript:**
```javascript
function max_profit(prices) {
    min_price = float('inf')
    max_profit = 0

    for price in prices:
        min_price = min(min_price, price)
        profit = price - min_price
        max_profit = max(max_profit, profit)

    return max_profit
```

### Test Cases

**Test 1:** Buy at 1, sell at 6
- Input: "max_profit([7,1,5,3,6,4])"
- Expected: "5"

**Test 2:** Decreasing prices
- Input: "max_profit([7,6,4,3,1])"
- Expected: "0"

**Test 3:** Simple profit
- Input: "max_profit([1,2])"
- Expected: "1"

---

## 35. Best Time to Buy and Sell Stock II

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

You can complete as many transactions as you like (buy one and sell one share multiple times). You must sell before buying again. Find max profit.

### Key Insight

State machine DP: Two states: HOLDING stock or NOT holding. At each day, transition between states. holding[i] = max(holding[i-1], notHolding[i-1] - price). Classic interview pattern!

### Examples

**Example 1:**
- Input: prices=[7,1,5,3,6,4]
- Output: 7
- Explanation: Buy at 1, sell at 5 (profit=4). Buy at 3, sell at 6 (profit=3). Total=7

**Example 2:**
- Input: prices=[1,2,3,4,5]
- Output: 4
- Explanation: Buy at 1, sell at 5, profit=4

### Hints

1. State: (day_index, holding_status) where holding is 0 or 1
2. Base: if i >= len(prices), return 0 (no more days)
3. If holding stock: max(sell now, keep holding)
4.   sell = prices[i] + dp(i+1, 0)
5.   hold = dp(i+1, 1)
6. If not holding: max(buy now, stay out)
7.   buy = -prices[i] + dp(i+1, 1)
8.   skip = dp(i+1, 0)
9. Memoize on (i, holding)

### Starter Code

**Python:**
```python
def max_profit(prices):
    """
    Find max profit with unlimited transactions using state machine DP.

    Args:
        prices: List[int] - daily prices

    Returns:
        int - maximum profit
    """
    cache = {}

    def dp(i, holding):
        # i = day, holding = 0 (not holding) or 1 (holding stock)
        # Base: if i >= len(prices), return 0
        # If holding: can sell (get price) or hold
        # If not holding: can buy (pay price) or skip
        pass

    return dp(0, 0)
```

**JavaScript:**
```javascript
function max_profit(prices) {
    """
    Find max profit with unlimited transactions using state machine DP.

    Args:
        prices: Array - daily prices

    Returns:
        int - maximum profit
    """
    cache = {}

    function dp(i, holding) {
        # i = day, holding = 0 (not holding) or 1 (holding stock)
        # Base: if i >= len(prices), return 0
        # If holding: can sell (get price) or hold
        # If not holding: can buy (pay price) or skip
  // TODO: implement
    return dp(0, 0)
```

### Solution

**Python:**
```python
def max_profit(prices):
    cache = {}

    def dp(i, holding):
        if i >= len(prices):
            return 0

        if (i, holding) in cache:
            return cache[(i, holding)]

        if holding:
            # Can sell or hold
            sell = prices[i] + dp(i + 1, 0)
            hold = dp(i + 1, 1)
            result = max(sell, hold)
        else:
            # Can buy or skip
            buy = -prices[i] + dp(i + 1, 1)
            skip = dp(i + 1, 0)
            result = max(buy, skip)

        cache[(i, holding)] = result
        return result

    return dp(0, 0)
```

**JavaScript:**
```javascript
function max_profit(prices) {
    cache = {}

    function dp(i, holding) {
        if i >= len(prices):
            return 0

        if (i, holding) in cache:
            return cache[(i, holding)]

        if holding:
            # Can sell or hold
            sell = prices[i] + dp(i + 1, 0)
            hold = dp(i + 1, 1)
            result = max(sell, hold)
        else:
            # Can buy or skip
            buy = -prices[i] + dp(i + 1, 1)
            skip = dp(i + 1, 0)
            result = max(buy, skip)

        cache[(i, holding)] = result
        return result

    return dp(0, 0)
```

### Test Cases

**Test 1:** Multiple transactions
- Input: "max_profit([7,1,5,3,6,4])"
- Expected: "7"

**Test 2:** Increasing prices
- Input: "max_profit([1,2,3,4,5])"
- Expected: "4"

**Test 3:** No profit possible
- Input: "max_profit([7,6,4,3,1])"
- Expected: "0"

---

## 36. Best Time to Buy and Sell Stock with Cooldown

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

After you sell, you cannot buy stock on the next day (cooldown 1 day). Find maximum profit with unlimited transactions but with cooldown constraint.

### Key Insight

Enhanced state machine: Three states: holding, not holding (can buy), cooldown. After sell, must enter cooldown for 1 day. Transitions: holding→cooldown, cooldown→notHolding, notHolding→holding.

### Examples

**Example 1:**
- Input: prices=[1,2,3,0,2]
- Output: 3
- Explanation: Buy at 1, sell at 2 (profit=1), cooldown, buy at 0, sell at 2 (profit=2). Total=3

### Hints

1. Three states: 0=can buy, 1=holding stock, 2=cooldown
2. State 0: max(buy stock → state 1, skip → state 0)
3. State 1: max(sell → state 2, hold → state 1)
4. State 2: must transition to state 0 (no choice)
5. When selling: get prices[i] and go to cooldown
6. When buying: pay prices[i] and go to holding
7. Memoize on (day, state)

### Starter Code

**Python:**
```python
def max_profit(prices):
    """
    Max profit with cooldown using state machine DP.

    Args:
        prices: List[int] - daily prices

    Returns:
        int - maximum profit
    """
    cache = {}

    def dp(i, state):
        # state: 0=can buy, 1=holding, 2=cooldown
        # Base: if i >= len(prices), return 0
        # State transitions:
        #   0 (can buy): buy→1 or skip→0
        #   1 (holding): sell→2 or hold→1
        #   2 (cooldown): must go to→0
        pass

    return dp(0, 0)
```

**JavaScript:**
```javascript
function max_profit(prices) {
    """
    Max profit with cooldown using state machine DP.

    Args:
        prices: Array - daily prices

    Returns:
        int - maximum profit
    """
    cache = {}

    function dp(i, state) {
        # state: 0=can buy, 1=holding, 2=cooldown
        # Base: if i >= len(prices), return 0
        # State transitions:
        #   0 (can buy): buy→1 or skip→0
        #   1 (holding): sell→2 or hold→1
        #   2 (cooldown): must go to→0
  // TODO: implement
    return dp(0, 0)
```

### Solution

**Python:**
```python
def max_profit(prices):
    cache = {}

    def dp(i, state):
        # state: 0=can buy, 1=holding, 2=cooldown
        if i >= len(prices):
            return 0

        if (i, state) in cache:
            return cache[(i, state)]

        if state == 0:  # Can buy
            buy = -prices[i] + dp(i + 1, 1)
            skip = dp(i + 1, 0)
            result = max(buy, skip)
        elif state == 1:  # Holding
            sell = prices[i] + dp(i + 1, 2)
            hold = dp(i + 1, 1)
            result = max(sell, hold)
        else:  # Cooldown (state == 2)
            result = dp(i + 1, 0)

        cache[(i, state)] = result
        return result

    return dp(0, 0)
```

**JavaScript:**
```javascript
function max_profit(prices) {
    cache = {}

    function dp(i, state) {
        # state: 0=can buy, 1=holding, 2=cooldown
        if i >= len(prices):
            return 0

        if (i, state) in cache:
            return cache[(i, state)]

        if state == 0:  # Can buy
            buy = -prices[i] + dp(i + 1, 1)
            skip = dp(i + 1, 0)
            result = max(buy, skip)
        elif state == 1:  # Holding
            sell = prices[i] + dp(i + 1, 2)
            hold = dp(i + 1, 1)
            result = max(sell, hold)
        else:  # Cooldown (state == 2)
            result = dp(i + 1, 0)

        cache[(i, state)] = result
        return result

    return dp(0, 0)
```

### Test Cases

**Test 1:** With cooldown optimization
- Input: "max_profit([1,2,3,0,2])"
- Expected: "3"

**Test 2:** Simple increasing
- Input: "max_profit([1,2,4])"
- Expected: "3"

---

## 37. Unique Paths

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

A robot is located at top-left corner of m x n grid. Robot can only move down or right. How many unique paths to reach bottom-right corner?

### Key Insight

Grid DP: paths[i][j] = paths[i-1][j] + paths[i][j-1]. Each cell sum of paths from above and left. Base case: first row/col all have 1 path. Classic matrix DP intro.

### Examples

**Example 1:**
- Input: m=3, n=7
- Output: 28
- Explanation: 28 unique paths in 3x7 grid

**Example 2:**
- Input: m=3, n=2
- Output: 3
- Explanation: Right-Down-Down, Down-Right-Down, Down-Down-Right

### Hints

1. Base: if (row, col) == (m-1, n-1), reached end, return 1
2. Base: if row >= m or col >= n, out of bounds, return 0
3. From (row, col), can go right (row, col+1) or down (row+1, col)
4. Total paths = dp(row+1, col) + dp(row, col+1)
5. Memoize on (row, col) to avoid recomputation
6. Alternative: can build DP table bottom-up

### Starter Code

**Python:**
```python
def unique_paths(m, n):
    """
    Count unique paths in grid using 2D DP.

    Args:
        m: int - number of rows
        n: int - number of columns

    Returns:
        int - number of unique paths
    """
    cache = {}

    def dp(row, col):
        # Base: if row == m-1 and col == n-1, reached destination (1 path)
        # Base: if out of bounds, return 0
        # Choices: move right or move down, sum both paths
        pass

    return dp(0, 0)
```

**JavaScript:**
```javascript
function unique_paths(m, n) {
    """
    Count unique paths in grid using 2D DP.

    Args:
        m: int - number of rows
        n: int - number of columns

    Returns:
        int - number of unique paths
    """
    cache = {}

    function dp(row, col) {
        # Base: if row == m-1 and col == n-1, reached destination (1 path)
        # Base: if out of bounds, return 0
        # Choices: move right or move down, sum both paths
  // TODO: implement
    return dp(0, 0)
```

### Solution

**Python:**
```python
def unique_paths(m, n):
    cache = {}

    def dp(row, col):
        if row == m - 1 and col == n - 1:
            return 1
        if row >= m or col >= n:
            return 0

        if (row, col) in cache:
            return cache[(row, col)]

        right = dp(row, col + 1)
        down = dp(row + 1, col)
        result = right + down

        cache[(row, col)] = result
        return result

    return dp(0, 0)
```

**JavaScript:**
```javascript
function unique_paths(m, n) {
    cache = {}

    function dp(row, col) {
        if row == m - 1 and col == n - 1:
            return 1
        if row >= m or col >= n:
            return 0

        if (row, col) in cache:
            return cache[(row, col)]

        right = dp(row, col + 1)
        down = dp(row + 1, col)
        result = right + down

        cache[(row, col)] = result
        return result

    return dp(0, 0)
```

### Test Cases

**Test 1:** 3x7 grid
- Input: "unique_paths(3, 7)"
- Expected: "28"

**Test 2:** 3x2 grid
- Input: "unique_paths(3, 2)"
- Expected: "3"

**Test 3:** Single cell
- Input: "unique_paths(1, 1)"
- Expected: "1"

---

## 38. Minimum Path Sum

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

Given m x n grid filled with non-negative numbers, find a path from top-left to bottom-right which minimizes the sum of all numbers along its path. Can only move down or right.

### Key Insight

Grid DP with values: dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]). Each cell picks minimum cost path from above or left, adds current cost.

### Examples

**Example 1:**
- Input: grid=[[1,3,1],[1,5,1],[4,2,1]]
- Output: 7
- Explanation: Path 1→3→1→1→1 has minimum sum 7

### Hints

1. Base: if row == m-1 and col == n-1, return grid[row][col]
2. Base: if row >= m or col >= n, return infinity (invalid path)
3. Current cell cost = grid[row][col]
4. Best from here = grid[row][col] + min(dp(row+1, col), dp(row, col+1))
5. Memoize on (row, col)
6. Alternative: build table bottom-up from destination

### Starter Code

**Python:**
```python
def min_path_sum(grid):
    """
    Find minimum path sum in grid using 2D DP.

    Args:
        grid: List[List[int]] - m x n grid with values

    Returns:
        int - minimum path sum
    """
    m, n = len(grid), len(grid[0])
    cache = {}

    def dp(row, col):
        # Base: if at destination, return grid[m-1][n-1]
        # Base: if out of bounds, return infinity
        # Current cost + min(down, right)
        pass

    return dp(0, 0)
```

**JavaScript:**
```javascript
function min_path_sum(grid) {
    """
    Find minimum path sum in grid using 2D DP.

    Args:
        grid: Array] - m x n grid with values

    Returns:
        int - minimum path sum
    """
    m, n = len(grid), len(grid[0])
    cache = {}

    function dp(row, col) {
        # Base: if at destination, return grid[m-1][n-1]
        # Base: if out of bounds, return infinity
        # Current cost + min(down, right)
  // TODO: implement
    return dp(0, 0)
```

### Solution

**Python:**
```python
def min_path_sum(grid):
    m, n = len(grid), len(grid[0])
    cache = {}

    def dp(row, col):
        if row == m - 1 and col == n - 1:
            return grid[row][col]
        if row >= m or col >= n:
            return float('inf')

        if (row, col) in cache:
            return cache[(row, col)]

        down = dp(row + 1, col)
        right = dp(row, col + 1)
        result = grid[row][col] + min(down, right)

        cache[(row, col)] = result
        return result

    return dp(0, 0)
```

**JavaScript:**
```javascript
function min_path_sum(grid) {
    m, n = len(grid), len(grid[0])
    cache = {}

    function dp(row, col) {
        if row == m - 1 and col == n - 1:
            return grid[row][col]
        if row >= m or col >= n:
            return float('inf')

        if (row, col) in cache:
            return cache[(row, col)]

        down = dp(row + 1, col)
        right = dp(row, col + 1)
        result = grid[row][col] + min(down, right)

        cache[(row, col)] = result
        return result

    return dp(0, 0)
```

### Test Cases

**Test 1:** 3x3 grid, path sum 7
- Input: "min_path_sum([[1,3,1],[1,5,1],[4,2,1]])"
- Expected: "7"

**Test 2:** 2x3 grid
- Input: "min_path_sum([[1,2,3],[4,5,6]])"
- Expected: "12"

---

## 39. Dungeon Game

**Difficulty:** hard
**Concept:** backtracking-trees

### Description

Knight must rescue princess in bottom-right room. Grid has health values (negative = damage). Find minimum initial health needed to reach princess. Health must stay > 0 always.

### Key Insight

Reverse DP! Work backwards from destination. dp[i][j] = minimum health needed at (i,j) to survive. Min health before entering cell = max(1, dp[i][j] - dungeon[i][j]). Tricky direction!

### Examples

**Example 1:**
- Input: dungeon=[[-2,-3,3],[-5,-10,1],[10,30,-5]]
- Output: 7
- Explanation: Start with 7 health, path: right→right→down→down stays alive

### Hints

1. Think BACKWARDS! Start from destination (m-1, n-1)
2. At destination: need max(1, 1 - dungeon[m-1][n-1]) health
3. Base: if out of bounds, return infinity (invalid)
4. From (row, col): needed_after = min(dp(row+1, col), dp(row, col+1))
5. Before entering cell: max(1, needed_after - dungeon[row][col])
6. Must maintain health ≥ 1 at all times
7. Memoize on (row, col)

### Starter Code

**Python:**
```python
def calculate_minimum_hp(dungeon):
    """
    Calculate minimum initial health using backward DP.

    Args:
        dungeon: List[List[int]] - m x n grid (negative = damage)

    Returns:
        int - minimum starting health
    """
    m, n = len(dungeon), len(dungeon[0])
    cache = {}

    def dp(row, col):
        # Work BACKWARDS from (m-1, n-1)
        # Base: at destination, need max(1, 1 - dungeon[row][col])
        # Recursive: need enough for min(down_path, right_path)
        # Before entering cell: max(1, needed_after - dungeon[row][col])
        pass

    return dp(0, 0)
```

**JavaScript:**
```javascript
function calculate_minimum_hp(dungeon) {
    """
    Calculate minimum initial health using backward DP.

    Args:
        dungeon: Array] - m x n grid (negative = damage)

    Returns:
        int - minimum starting health
    """
    m, n = len(dungeon), len(dungeon[0])
    cache = {}

    function dp(row, col) {
        # Work BACKWARDS from (m-1, n-1)
        # Base: at destination, need max(1, 1 - dungeon[row][col])
        # Recursive: need enough for min(down_path, right_path)
        # Before entering cell: max(1, needed_after - dungeon[row][col])
  // TODO: implement
    return dp(0, 0)
```

### Solution

**Python:**
```python
def calculate_minimum_hp(dungeon):
    m, n = len(dungeon), len(dungeon[0])
    cache = {}

    def dp(row, col):
        if row == m - 1 and col == n - 1:
            return max(1, 1 - dungeon[row][col])
        if row >= m or col >= n:
            return float('inf')

        if (row, col) in cache:
            return cache[(row, col)]

        down = dp(row + 1, col)
        right = dp(row, col + 1)
        needed_after = min(down, right)
        result = max(1, needed_after - dungeon[row][col])

        cache[(row, col)] = result
        return result

    return dp(0, 0)
```

**JavaScript:**
```javascript
function calculate_minimum_hp(dungeon) {
    m, n = len(dungeon), len(dungeon[0])
    cache = {}

    function dp(row, col) {
        if row == m - 1 and col == n - 1:
            return max(1, 1 - dungeon[row][col])
        if row >= m or col >= n:
            return float('inf')

        if (row, col) in cache:
            return cache[(row, col)]

        down = dp(row + 1, col)
        right = dp(row, col + 1)
        needed_after = min(down, right)
        result = max(1, needed_after - dungeon[row][col])

        cache[(row, col)] = result
        return result

    return dp(0, 0)
```

### Test Cases

**Test 1:** Need 7 initial health
- Input: "calculate_minimum_hp([[-2,-3,3],[-5,-10,1],[10,30,-5]])"
- Expected: "7"

**Test 2:** Single cell, no damage
- Input: "calculate_minimum_hp([[0]])"
- Expected: "1"

---

## 40. Palindromic Substrings

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

Given a string s, return the number of palindromic substrings in it. A substring is palindromic if it reads the same backward as forward.

### Key Insight

Expand around center: For each position, expand outward while chars match. Two cases: odd-length (single center) and even-length (two centers). Count all palindromes found.

### Examples

**Example 1:**
- Input: s="abc"
- Output: 3
- Explanation: Three palindromes: "a", "b", "c"

**Example 2:**
- Input: s="aaa"
- Output: 6
- Explanation: Six palindromes: "a", "a", "a", "aa", "aa", "aaa"

### Hints

1. Helper function: expand while left >= 0, right < len, s[left] == s[right]
2. Each expansion finds one palindrome, increment count
3. For each index i, check two cases:
4.   1. Odd-length: center at i, expand(i, i)
5.   2. Even-length: center between i and i+1, expand(i, i+1)
6. Time: O(n²) - n positions, each expands up to n times
7. Alternative: use 2D DP table, but expand is simpler

### Starter Code

**Python:**
```python
def count_substrings(s):
    """
    Count palindromic substrings using expand-around-center.

    Args:
        s: str - input string

    Returns:
        int - count of palindromic substrings
    """
    count = 0

    def expand_around_center(left, right):
        # Expand while chars match and in bounds
        # Return count of palindromes found
        pass

    for i in range(len(s)):
        # Odd-length palindromes (center at i)
        # Even-length palindromes (center between i and i+1)
        pass

    return count
```

**JavaScript:**
```javascript
function count_substrings(s) {
    """
    Count palindromic substrings using expand-around-center.

    Args:
        s: str - input string

    Returns:
        int - count of palindromic substrings
    """
    count = 0

    function expand_around_center(left, right) {
        # Expand while chars match and in bounds
        # Return count of palindromes found
  // TODO: implement
    for i in range(len(s)):
        # Odd-length palindromes (center at i)
        # Even-length palindromes (center between i and i+1)
  // TODO: implement
    return count
```

### Solution

**Python:**
```python
def count_substrings(s):
    count = 0

    def expand_around_center(left, right):
        nonlocal count
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1

    for i in range(len(s)):
        expand_around_center(i, i)      # Odd-length
        expand_around_center(i, i + 1)  # Even-length

    return count
```

**JavaScript:**
```javascript
function count_substrings(s) {
    count = 0

    function expand_around_center(left, right) {
        nonlocal count
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1

    for i in range(len(s)):
        expand_around_center(i, i)      # Odd-length
        expand_around_center(i, i + 1)  # Even-length

    return count
```

### Test Cases

**Test 1:** No multi-char palindromes
- Input: "count_substrings(\"abc\")"
- Expected: "3"

**Test 2:** Multiple overlapping palindromes
- Input: "count_substrings(\"aaa\")"
- Expected: "6"

**Test 3:** "a", "b", "a", "aba"
- Input: "count_substrings(\"aba\")"
- Expected: "4"

---

## 41. Longest Palindromic Substring

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

Given a string s, return the longest palindromic substring in s. A substring is palindromic if it reads the same backward as forward.

### Key Insight

Same expand-around-center approach but track longest palindrome found. For each center, expand and track max length and position. Return substring using stored positions.

### Examples

**Example 1:**
- Input: s="babad"
- Output: "bab"
- Explanation: "aba" is also valid answer

**Example 2:**
- Input: s="cbbd"
- Output: "bb"
- Explanation: Longest is "bb"

### Hints

1. Helper: expand while valid, return final length (right - left - 1)
2. For each index, check odd-length expand(i, i) and even expand(i, i+1)
3. Get lengths: len1 (odd), len2 (even), take max
4. If max(len1, len2) > max_len, update max_len and start position
5. Start = i - (max_len - 1) // 2
6. Return s[start:start + max_len]
7. Time: O(n²), Space: O(1)

### Starter Code

**Python:**
```python
def longest_palindrome(s):
    """
    Find longest palindromic substring using expand-around-center.

    Args:
        s: str - input string

    Returns:
        str - longest palindromic substring
    """
    if not s:
        return ""

    start = 0
    max_len = 0

    def expand_around_center(left, right):
        # Expand and return length of palindrome found
        pass

    for i in range(len(s)):
        # Check both odd and even length palindromes
        # Update start and max_len if longer palindrome found
        pass

    return s[start:start + max_len]
```

**JavaScript:**
```javascript
function longest_palindrome(s) {
    """
    Find longest palindromic substring using expand-around-center.

    Args:
        s: str - input string

    Returns:
        str - longest palindromic substring
    """
    if not s:
        return ""

    start = 0
    max_len = 0

    function expand_around_center(left, right) {
        # Expand and return length of palindrome found
  // TODO: implement
    for i in range(len(s)):
        # Check both odd and even length palindromes
        # Update start and max_len if longer palindrome found
  // TODO: implement
    return s[start:start + max_len]
```

### Solution

**Python:**
```python
def longest_palindrome(s):
    if not s:
        return ""

    start = 0
    max_len = 0

    def expand_around_center(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return right - left - 1

    for i in range(len(s)):
        len1 = expand_around_center(i, i)      # Odd
        len2 = expand_around_center(i, i + 1)  # Even
        cur_len = max(len1, len2)

        if cur_len > max_len:
            max_len = cur_len
            start = i - (cur_len - 1) // 2

    return s[start:start + max_len]
```

**JavaScript:**
```javascript
function longest_palindrome(s) {
    if not s:
        return ""

    start = 0
    max_len = 0

    function expand_around_center(left, right) {
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return right - left - 1

    for i in range(len(s)):
        len1 = expand_around_center(i, i)      # Odd
        len2 = expand_around_center(i, i + 1)  # Even
        cur_len = max(len1, len2)

        if cur_len > max_len:
            max_len = cur_len
            start = i - (cur_len - 1) // 2

    return s[start:start + max_len]
```

### Test Cases

**Test 1:** Multiple valid answers
- Input: "longest_palindrome(\"babad\")"
- Expected: "\"bab\""

**Test 2:** Even-length palindrome
- Input: "longest_palindrome(\"cbbd\")"
- Expected: "\"bb\""

**Test 3:** Single character
- Input: "longest_palindrome(\"a\")"
- Expected: "\"a\""

---

## 42. Burst Balloons

**Difficulty:** hard
**Concept:** backtracking-trees

### Description

You have n balloons indexed 0 to n-1. Each balloon has a number on it represented by array nums. Burst all balloons. If you burst balloon i, you get nums[i-1] * nums[i] * nums[i+1] coins. Find maximum coins you can collect.

### Key Insight

Interval DP trick: Think about which balloon to burst LAST in range [left, right]. If burst k last, ranges [left, k-1] and [k+1, right] are independent. Coins = nums[left-1] * nums[k] * nums[right+1] + dp[left][k-1] + dp[k+1][right].

### Examples

**Example 1:**
- Input: nums=[3,1,5,8]
- Output: 167
- Explanation: Burst 1 (3*1*5), then 5 (3*5*8), then 3 (1*3*8), then 8 (1*8*1) = 167 coins

### Hints

1. Add virtual balloons: nums = [1] + nums + [1]
2. Base case: if left > right, return 0
3. Key insight: which balloon to burst LAST in range?
4. For each k in [left, right], assume k is last:
5.   Coins from k = nums[left-1] * nums[k] * nums[right+1]
6.   Plus optimal from left and right subranges
7.   result = coins_k + dp(left, k-1) + dp(k+1, right)
8. Take maximum over all k choices
9. Memoize on (left, right)

### Starter Code

**Python:**
```python
def max_coins(nums):
    """
    Find maximum coins from bursting balloons using interval DP.

    Args:
        nums: List[int] - balloon values

    Returns:
        int - maximum coins
    """
    # Add 1s to both ends for easier calculation
    nums = [1] + nums + [1]
    cache = {}

    def dp(left, right):
        # Base: if left > right, no balloons, return 0
        # Try bursting each balloon k in [left, right] LAST
        # Coins = nums[left-1] * nums[k] * nums[right+1]
        #       + dp(left, k-1) + dp(k+1, right)
        pass

    return dp(1, len(nums) - 2)
```

**JavaScript:**
```javascript
function max_coins(nums) {
    """
    Find maximum coins from bursting balloons using interval DP.

    Args:
        nums: Array - balloon values

    Returns:
        int - maximum coins
    """
    # Add 1s to both ends for easier calculation
    nums = [1] + nums + [1]
    cache = {}

    function dp(left, right) {
        # Base: if left > right, no balloons, return 0
        # Try bursting each balloon k in [left, right] LAST
        # Coins = nums[left-1] * nums[k] * nums[right+1]
        #       + dp(left, k-1) + dp(k+1, right)
  // TODO: implement
    return dp(1, len(nums) - 2)
```

### Solution

**Python:**
```python
def max_coins(nums):
    nums = [1] + nums + [1]
    cache = {}

    def dp(left, right):
        if left > right:
            return 0

        if (left, right) in cache:
            return cache[(left, right)]

        max_coins_val = 0
        for k in range(left, right + 1):
            coins = nums[left - 1] * nums[k] * nums[right + 1]
            coins += dp(left, k - 1) + dp(k + 1, right)
            max_coins_val = max(max_coins_val, coins)

        cache[(left, right)] = max_coins_val
        return max_coins_val

    return dp(1, len(nums) - 2)
```

**JavaScript:**
```javascript
function max_coins(nums) {
    nums = [1] + nums + [1]
    cache = {}

    function dp(left, right) {
        if left > right:
            return 0

        if (left, right) in cache:
            return cache[(left, right)]

        max_coins_val = 0
        for k in range(left, right + 1):
            coins = nums[left - 1] * nums[k] * nums[right + 1]
            coins += dp(left, k - 1) + dp(k + 1, right)
            max_coins_val = max(max_coins_val, coins)

        cache[(left, right)] = max_coins_val
        return max_coins_val

    return dp(1, len(nums) - 2)
```

### Test Cases

**Test 1:** Optimal bursting sequence
- Input: "max_coins([3,1,5,8])"
- Expected: "167"

**Test 2:** Two balloons
- Input: "max_coins([1,5])"
- Expected: "10"

---

## 43. Minimum Cost Tree From Leaf Values

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

Given array arr of positive integers, construct binary tree where each node's value is product of largest leaf in left and right subtree. Return smallest possible sum of values of non-leaf nodes.

### Key Insight

Interval DP: For range [left, right], try each split point k. Root value = max(left...k) * max(k+1...right). Cost = root_value + dp[left][k] + dp[k+1][right]. Similar pattern to Burst Balloons.

### Examples

**Example 1:**
- Input: arr=[6,2,4]
- Output: 32
- Explanation: Tree structure: split creates nodes with values 24 and 8, sum=32

### Hints

1. Base: if left == right, single leaf, no internal nodes, return 0
2. Precompute max values for efficiency (or compute on-the-fly)
3. For each split point k in [left, right-1]:
4.   left_max = max(arr[left:k+1])
5.   right_max = max(arr[k+1:right+1])
6.   root_value = left_max * right_max
7.   total = root_value + dp(left, k) + dp(k+1, right)
8. Take minimum over all k
9. Memoize on (left, right)

### Starter Code

**Python:**
```python
def mct_from_leaf_values(arr):
    """
    Find minimum cost tree using interval DP.

    Args:
        arr: List[int] - leaf values

    Returns:
        int - minimum sum of non-leaf node values
    """
    cache = {}

    def dp(left, right):
        # Base: single element, no internal node needed, return 0
        # Try each split point k
        # Root = max(arr[left:k+1]) * max(arr[k+1:right+1])
        # Cost = root + dp(left, k) + dp(k+1, right)
        pass

    return dp(0, len(arr) - 1)
```

**JavaScript:**
```javascript
function mct_from_leaf_values(arr) {
    """
    Find minimum cost tree using interval DP.

    Args:
        arr: Array - leaf values

    Returns:
        int - minimum sum of non-leaf node values
    """
    cache = {}

    function dp(left, right) {
        # Base: single element, no internal node needed, return 0
        # Try each split point k
        # Root = max(arr[left:k+1]) * max(arr[k+1:right+1])
        # Cost = root + dp(left, k) + dp(k+1, right)
  // TODO: implement
    return dp(0, len(arr) - 1)
```

### Solution

**Python:**
```python
def mct_from_leaf_values(arr):
    cache = {}

    def dp(left, right):
        if left == right:
            return 0

        if (left, right) in cache:
            return cache[(left, right)]

        min_cost = float('inf')
        for k in range(left, right):
            left_max = max(arr[left:k+1])
            right_max = max(arr[k+1:right+1])
            root_value = left_max * right_max
            cost = root_value + dp(left, k) + dp(k+1, right)
            min_cost = min(min_cost, cost)

        cache[(left, right)] = min_cost
        return min_cost

    return dp(0, len(arr) - 1)
```

**JavaScript:**
```javascript
function mct_from_leaf_values(arr) {
    cache = {}

    function dp(left, right) {
        if left == right:
            return 0

        if (left, right) in cache:
            return cache[(left, right)]

        min_cost = float('inf')
        for k in range(left, right):
            left_max = max(arr[left:k+1])
            right_max = max(arr[k+1:right+1])
            root_value = left_max * right_max
            cost = root_value + dp(left, k) + dp(k+1, right)
            min_cost = min(min_cost, cost)

        cache[(left, right)] = min_cost
        return min_cost

    return dp(0, len(arr) - 1)
```

### Test Cases

**Test 1:** Minimum cost tree
- Input: "mct_from_leaf_values([6,2,4])"
- Expected: "32"

**Test 2:** Two leaves
- Input: "mct_from_leaf_values([4,11])"
- Expected: "44"

---

## 44. Shortest Path Visiting All Nodes

**Difficulty:** hard
**Concept:** backtracking-trees

### Description

You have undirected graph with n nodes (0 to n-1). Return length of shortest path that visits every node. You may start and stop at any node, revisit nodes, and reuse edges.

### Key Insight

Bitmask DP: State = (current_node, visited_set_as_bitmask). visited_set uses bits: bit i set if node i visited. Goal: reach state where all nodes visited. BFS with (node, mask) states.

### Examples

**Example 1:**
- Input: graph=[[1,2,3],[0],[0],[0]]
- Output: 4
- Explanation: One path: 0→1→0→2→0→3 (length 4)

**Example 2:**
- Input: graph=[[1],[0,2,4],[1,3],[2],[1]]
- Output: 4
- Explanation: Visit all 5 nodes in 4 steps

### Hints

1. Bitmask: visited[i] = 1 if node i visited, else 0
2. Target: all_visited = (1 << n) - 1 (all bits set)
3. State: (current_node, visited_mask)
4. Initialize queue with all starting positions: (i, 1<<i, 0)
5. BFS: for each (node, mask, dist):
6.   If mask == target_mask, return dist
7.   For each neighbor: new_mask = mask | (1 << neighbor)
8.   If (neighbor, new_mask) not visited, add to queue
9. Use visited set to track (node, mask) pairs

### Starter Code

**Python:**
```python
def shortest_path_length(graph):
    """
    Find shortest path visiting all nodes using bitmask BFS.

    Args:
        graph: List[List[int]] - adjacency list

    Returns:
        int - shortest path length
    """
    from collections import deque

    n = len(graph)
    target_mask = (1 << n) - 1  # All nodes visited

    # BFS with state (node, visited_mask, distance)
    # Start from all nodes: (i, 1 << i, 0) for each i
    queue = deque()
    visited = set()

    # Initialize: can start from any node
    for i in range(n):
        mask = 1 << i
        queue.append((i, mask, 0))
        visited.add((i, mask))

    # BFS to find first state with mask == target_mask
    pass
```

**JavaScript:**
```javascript
function shortest_path_length(graph) {
    """
    Find shortest path visiting all nodes using bitmask BFS.

    Args:
        graph: Array] - adjacency list

    Returns:
        int - shortest path length
    """
    from collections import deque

    n = len(graph)
    target_mask = (1 << n) - 1  # All nodes visited

    # BFS with state (node, visited_mask, distance)
    # Start from all nodes: (i, 1 << i, 0) for each i
    queue = deque()
    visited = set()

    # Initialize: can start from any node
    for i in range(n):
        mask = 1 << i
        queue.append((i, mask, 0))
        visited.add((i, mask))

    # BFS to find first state with mask == target_mask
  // TODO: implement
```

### Solution

**Python:**
```python
def shortest_path_length(graph):
    from collections import deque

    n = len(graph)
    target_mask = (1 << n) - 1
    queue = deque()
    visited = set()

    for i in range(n):
        mask = 1 << i
        queue.append((i, mask, 0))
        visited.add((i, mask))

    while queue:
        node, mask, dist = queue.popleft()

        if mask == target_mask:
            return dist

        for neighbor in graph[node]:
            new_mask = mask | (1 << neighbor)
            if (neighbor, new_mask) not in visited:
                visited.add((neighbor, new_mask))
                queue.append((neighbor, new_mask, dist + 1))

    return 0
```

**JavaScript:**
```javascript
function shortest_path_length(graph) {
    from collections import deque

    n = len(graph)
    target_mask = (1 << n) - 1
    queue = deque()
    visited = set()

    for i in range(n):
        mask = 1 << i
        queue.append((i, mask, 0))
        visited.add((i, mask))

    while queue:
        node, mask, dist = queue.popleft()

        if mask == target_mask:
            return dist

        for neighbor in graph[node]:
            new_mask = mask | (1 << neighbor)
            if (neighbor, new_mask) not in visited:
                visited.add((neighbor, new_mask))
                queue.append((neighbor, new_mask, dist + 1))

    return 0
```

### Test Cases

**Test 1:** Star graph
- Input: "shortest_path_length([[1,2,3],[0],[0],[0]])"
- Expected: "4"

**Test 2:** Complex graph
- Input: "shortest_path_length([[1],[0,2,4],[1,3],[2],[1]])"
- Expected: "4"

---

## 45. House Robber III

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

All houses form a binary tree. Robber cannot rob two directly-linked houses. Given tree root, return maximum money robber can rob without alerting police.

### Key Insight

Tree DP: For each node, compute two values: max_if_rob_this_node, max_if_skip_this_node. If rob: value + skip_left + skip_right. If skip: max(rob_left, skip_left) + max(rob_right, skip_right). Post-order DFS.

### Examples

**Example 1:**
- Input: root=[3,2,3,null,3,null,1]
- Output: 7
- Explanation: Rob nodes 3, 3, 1 (don't rob adjacent parent-child)

**Example 2:**
- Input: root=[3,4,5,1,3,null,1]
- Output: 9
- Explanation: Rob 4, 5 at level 2

### Hints

1. Base case: if node is None, return (0, 0)
2. Post-order DFS: process children first
3. left_rob, left_skip = dp(node.left)
4. right_rob, right_skip = dp(node.right)
5. If rob current: node.val + left_skip + right_skip
6. If skip current: max(left_rob, left_skip) + max(right_rob, right_skip)
7. Return both options: (rob_current, skip_current)
8. Final: max of both options at root

### Starter Code

**Python:**
```python
def rob(root):
    """
    Find maximum money from tree using tree DP.

    Args:
        root: TreeNode - binary tree root

    Returns:
        int - maximum money
    """
    def dp(node):
        # Base: if not node, return (0, 0)
        # Returns: (rob_this_node, skip_this_node)

        # left = dp(node.left)
        # right = dp(node.right)

        # If rob this node: can't rob children
        # rob = node.val + left[1] + right[1]

        # If skip this node: can rob or skip children
        # skip = max(left) + max(right)

        # return (rob, skip)
        pass

    rob_root, skip_root = dp(root)
    return max(rob_root, skip_root)
```

**JavaScript:**
```javascript
function rob(root) {
    """
    Find maximum money from tree using tree DP.

    Args:
        root: TreeNode - binary tree root

    Returns:
        int - maximum money
    """
    function dp(node) {
        # Base: if not node, return (0, 0)
        # Returns: (rob_this_node, skip_this_node)

        # left = dp(node.left)
        # right = dp(node.right)

        # If rob this node: can't rob children
        # rob = node.val + left[1] + right[1]

        # If skip this node: can rob or skip children
        # skip = max(left) + max(right)

        # return (rob, skip)
  // TODO: implement
    rob_root, skip_root = dp(root)
    return max(rob_root, skip_root)
```

### Solution

**Python:**
```python
def rob(root):
    def dp(node):
        if not node:
            return (0, 0)

        left_rob, left_skip = dp(node.left)
        right_rob, right_skip = dp(node.right)

        rob_current = node.val + left_skip + right_skip
        skip_current = max(left_rob, left_skip) + max(right_rob, right_skip)

        return (rob_current, skip_current)

    rob_root, skip_root = dp(root)
    return max(rob_root, skip_root)
```

**JavaScript:**
```javascript
function rob(root) {
    function dp(node) {
        if not node:
            return (0, 0)

        left_rob, left_skip = dp(node.left)
        right_rob, right_skip = dp(node.right)

        rob_current = node.val + left_skip + right_skip
        skip_current = max(left_rob, left_skip) + max(right_rob, right_skip)

        return (rob_current, skip_current)

    rob_root, skip_root = dp(root)
    return max(rob_root, skip_root)
```

### Test Cases

**Test 1:** Rob 3+3+1
- Input: "rob([3,2,3,None,3,None,1])"
- Expected: "7"

**Test 2:** Rob 4+5
- Input: "rob([3,4,5,1,3,None,1])"
- Expected: "9"

---

## 46. Binary Tree Maximum Path Sum

**Difficulty:** hard
**Concept:** backtracking-trees

### Description

A path in binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. Path does not need to pass through root. Find maximum path sum. Node values can be negative.

### Key Insight

Tree DP with global max: Each node returns max single-path sum through it. But also checks if path through current node (left + node + right) is global max. Key: return single path, but track double path.

### Examples

**Example 1:**
- Input: root=[1,2,3]
- Output: 6
- Explanation: Path 2→1→3 has sum 6

**Example 2:**
- Input: root=[-10,9,20,null,null,15,7]
- Output: 42
- Explanation: Path 15→20→7 has sum 42

### Hints

1. Use global variable max_sum to track best path
2. Base: if not node, return 0
3. Recursively get max path from left and right children
4. Use max(0, child_path) to ignore negative paths
5. Path through current node: left_max + node.val + right_max
6. Update global: max_sum = max(max_sum, path_through_node)
7. Return to parent: can only extend ONE child path
8.   return node.val + max(left_max, right_max)
9. Key insight: check both paths, return single path

### Starter Code

**Python:**
```python
def max_path_sum(root):
    """
    Find maximum path sum in binary tree using tree DP.

    Args:
        root: TreeNode - binary tree root

    Returns:
        int - maximum path sum
    """
    max_sum = float('-inf')

    def dp(node):
        nonlocal max_sum

        # Base: if not node, return 0

        # Get max single path from left and right
        # Use max(0, path) to handle negative paths

        # Current path through this node (can include both children)
        # path_through_node = left + node.val + right
        # Update global max

        # Return max single path (can only include one child)
        # return node.val + max(left, right)
        pass

    dp(root)
    return max_sum
```

**JavaScript:**
```javascript
function max_path_sum(root) {
    """
    Find maximum path sum in binary tree using tree DP.

    Args:
        root: TreeNode - binary tree root

    Returns:
        int - maximum path sum
    """
    max_sum = float('-inf')

    function dp(node) {
        nonlocal max_sum

        # Base: if not node, return 0

        # Get max single path from left and right
        # Use max(0, path) to handle negative paths

        # Current path through this node (can include both children)
        # path_through_node = left + node.val + right
        # Update global max

        # Return max single path (can only include one child)
        # return node.val + max(left, right)
  // TODO: implement
    dp(root)
    return max_sum
```

### Solution

**Python:**
```python
def max_path_sum(root):
    max_sum = float('-inf')

    def dp(node):
        nonlocal max_sum

        if not node:
            return 0

        left_max = max(0, dp(node.left))
        right_max = max(0, dp(node.right))

        # Path through this node
        path_through_node = left_max + node.val + right_max
        max_sum = max(max_sum, path_through_node)

        # Return single path for parent
        return node.val + max(left_max, right_max)

    dp(root)
    return max_sum
```

**JavaScript:**
```javascript
function max_path_sum(root) {
    max_sum = float('-inf')

    function dp(node) {
        nonlocal max_sum

        if not node:
            return 0

        left_max = max(0, dp(node.left))
        right_max = max(0, dp(node.right))

        # Path through this node
        path_through_node = left_max + node.val + right_max
        max_sum = max(max_sum, path_through_node)

        # Return single path for parent
        return node.val + max(left_max, right_max)

    dp(root)
    return max_sum
```

### Test Cases

**Test 1:** Path 2-1-3
- Input: "max_path_sum([1,2,3])"
- Expected: "6"

**Test 2:** Path 15-20-7
- Input: "max_path_sum([-10,9,20,None,None,15,7])"
- Expected: "42"

**Test 3:** Single negative node
- Input: "max_path_sum([-3])"
- Expected: "-3"

---

## 47. Partition to K Equal Sum Subsets (Meet in Middle)

**Difficulty:** hard
**Concept:** backtracking-trees
**Family:** backtracking:subsets

### Description

Given an integer array nums and an integer k, return true if it is possible to divide this array into k non-empty subsets whose sums are all equal.

### Key Insight

Optimization technique: For large n, brute force 2^n is too slow. Meet in the middle splits search space in half: generate all subsets of first half and second half separately (2^(n/2) each), then match them efficiently.

### Examples

**Example 1:**
- Input: nums=[4,3,2,3,5,2,1], k=4
- Output: true
- Explanation: Divide into [5], [1,4], [2,3], [2,3]. Each sums to 5.

**Example 2:**
- Input: nums=[1,2,3,4], k=3
- Output: false
- Explanation: Total sum=10, 10/3 not integer. Impossible.

### Hints

1. First check: total sum divisible by k? If not, impossible
2. Calculate target = sum / k
3. If any element > target, impossible
4. Sort descending to fail fast (try large elements first)
5. Backtracking: try adding each number to each subset
6. Optimization: use bitmask DP to track used elements
7. Meet in middle: split array in half, generate all subsets, match complements
8. For k=2, this becomes standard subset sum problem

### Starter Code

**Python:**
```python
def can_partition_k_subsets(nums, k):
    """
    Check if can partition into k equal sum subsets.

    Args:
        nums: List[int] - array of integers
        k: int - number of subsets

    Returns:
        bool - True if possible to partition
    """
    total = sum(nums)
    if total % k != 0:
        return False

    target = total // k
    nums.sort(reverse=True)

    # If largest element > target, impossible
    if nums[0] > target:
        return False

    # TODO: Use backtracking with pruning
    # Track which elements used and current subset sums
    # Or use meet-in-middle for optimization
    pass
```

**JavaScript:**
```javascript
function can_partition_k_subsets(nums, k) {
    """
    Check if can partition into k equal sum subsets.

    Args:
        nums: Array - array of integers
        k: int - number of subsets

    Returns:
        bool - true if possible to partition
    """
    total = sum(nums)
    if total % k != 0:
        return false

    target = total // k
    nums.sort(reverse=true)

    # If largest element > target, impossible
    if nums[0] > target:
        return false

    // TODO: Use backtracking with pruning
    # Track which elements used and current subset sums
    # Or use meet-in-middle for optimization
  // TODO: implement
```

### Solution

**Python:**
```python
def can_partition_k_subsets(nums, k):
    total = sum(nums)
    if total % k != 0:
        return False

    target = total // k
    nums.sort(reverse=True)

    if nums[0] > target:
        return False

    used = [False] * len(nums)

    def backtrack(subset_idx, current_sum, start):
        if subset_idx == k:
            return True

        if current_sum == target:
            # Complete this subset, start next one
            return backtrack(subset_idx + 1, 0, 0)

        for i in range(start, len(nums)):
            if used[i] or current_sum + nums[i] > target:
                continue

            used[i] = True
            if backtrack(subset_idx, current_sum + nums[i], i + 1):
                return True
            used[i] = False

            # Pruning: if first number in subset fails, skip similar attempts
            if current_sum == 0:
                break

        return False

    return backtrack(0, 0, 0)
```

**JavaScript:**
```javascript
function can_partition_k_subsets(nums, k) {
    total = sum(nums)
    if total % k != 0:
        return false

    target = total // k
    nums.sort(reverse=true)

    if nums[0] > target:
        return false

    used = [false] * len(nums)

    function backtrack(subset_idx, current_sum, start) {
        if subset_idx == k:
            return true

        if current_sum == target:
            # Complete this subset, start next one
            return backtrack(subset_idx + 1, 0, 0)

        for i in range(start, len(nums)):
            if used[i] or current_sum + nums[i] > target:
                continue

            used[i] = true
            if backtrack(subset_idx, current_sum + nums[i], i + 1):
                return true
            used[i] = false

            # Pruning: if first number in subset fails, skip similar attempts
            if current_sum == 0:
                break

        return false

    return backtrack(0, 0, 0)
```

### Test Cases

**Test 1:** Can partition into 4 equal subsets
- Input: "can_partition_k_subsets([4,3,2,3,5,2,1], 4)"
- Expected: "True"

**Test 2:** Sum not divisible by k
- Input: "can_partition_k_subsets([1,2,3,4], 3)"
- Expected: "False"

**Test 3:** Multiple ways to partition
- Input: "can_partition_k_subsets([1,1,1,1,2,2,2,2], 4)"
- Expected: "True"

---

## 48. Closest Subsequence Sum (Meet in Middle)

**Difficulty:** hard
**Concept:** backtracking-trees

### Description

You are given an integer array nums and an integer goal. You want to choose a subsequence of nums such that the sum of its elements is the closest possible to goal. Return the minimum absolute difference between the sum of the chosen subsequence and goal.

### Key Insight

Classic Meet in Middle! Brute force: check all 2^n subsequences. Too slow for n=40. Optimization: Split into two halves of n/2. Generate all sums for each half (2^20 each). For each sum in first half, binary search for best match in second half.

### Examples

**Example 1:**
- Input: nums=[5,-7,3,5], goal=6
- Output: 0
- Explanation: Subsequence [5,3,-7,5] sums to 6, difference is 0

**Example 2:**
- Input: nums=[7,-9,15,-2], goal=-5
- Output: 1
- Explanation: Subsequence [-9,15,-2] sums to 4. Or [-9,-2] sums to -11. Best is -9+15-2-7=-3 or wait... Check!

### Hints

1. Split array into two halves: left = nums[:mid], right = nums[mid:]
2. Generate all subset sums for each half (2^(n/2) subsets each)
3. Use bit manipulation: for i in range(1 << len(arr))
4. Sort second half sums for binary search
5. For each sum_left, find best sum_right where sum_left + sum_right ≈ goal
6. Use bisect to find closest value in sorted array
7. Try sum_right values just below and above for best match
8. Time: O(2^(n/2) * n/2) much better than O(2^n)

### Starter Code

**Python:**
```python
def min_abs_difference(nums, goal):
    """
    Find closest subsequence sum to goal using meet-in-middle.

    Args:
        nums: List[int] - array of integers
        goal: int - target sum

    Returns:
        int - minimum absolute difference
    """
    n = len(nums)
    mid = n // 2

    def generate_sums(arr):
        # Generate all possible subset sums of arr
        sums = []
        # TODO: Use bit manipulation or recursion
        #       to generate all 2^len(arr) subset sums
        return sums

    # TODO: Generate sums for first and second half
    # TODO: Sort second half sums
    # TODO: For each sum in first half, binary search in second half
    # TODO: Find closest to goal
    pass
```

**JavaScript:**
```javascript
function min_abs_difference(nums, goal) {
    """
    Find closest subsequence sum to goal using meet-in-middle.

    Args:
        nums: Array - array of integers
        goal: int - target sum

    Returns:
        int - minimum absolute difference
    """
    n = len(nums)
    mid = n // 2

    function generate_sums(arr) {
        # Generate all possible subset sums of arr
        sums = []
        // TODO: Use bit manipulation or recursion
        #       to generate all 2^len(arr) subset sums
        return sums

    // TODO: Generate sums for first and second half
    // TODO: Sort second half sums
    // TODO: For each sum in first half, binary search in second half
    // TODO: Find closest to goal
  // TODO: implement
```

### Solution

**Python:**
```python
def min_abs_difference(nums, goal):
    import bisect

    n = len(nums)
    mid = n // 2

    def generate_sums(arr):
        sums = []
        for i in range(1 << len(arr)):
            subset_sum = 0
            for j in range(len(arr)):
                if i & (1 << j):
                    subset_sum += arr[j]
            sums.append(subset_sum)
        return sums

    # Generate sums for both halves
    left_sums = generate_sums(nums[:mid])
    right_sums = generate_sums(nums[mid:])

    # Sort right sums for binary search
    right_sums.sort()

    min_diff = abs(goal)

    for left_sum in left_sums:
        target = goal - left_sum

        # Binary search for closest value to target in right_sums
        idx = bisect.bisect_left(right_sums, target)

        # Check values at idx and idx-1
        if idx < len(right_sums):
            min_diff = min(min_diff, abs(left_sum + right_sums[idx] - goal))
        if idx > 0:
            min_diff = min(min_diff, abs(left_sum + right_sums[idx-1] - goal))

    return min_diff
```

**JavaScript:**
```javascript
function min_abs_difference(nums, goal) {
    import bisect

    n = len(nums)
    mid = n // 2

    function generate_sums(arr) {
        sums = []
        for i in range(1 << len(arr)):
            subset_sum = 0
            for j in range(len(arr)):
                if i & (1 << j):
                    subset_sum += arr[j]
            sums.append(subset_sum)
        return sums

    # Generate sums for both halves
    left_sums = generate_sums(nums[:mid])
    right_sums = generate_sums(nums[mid:])

    # Sort right sums for binary search
    right_sums.sort()

    min_diff = abs(goal)

    for left_sum in left_sums:
        target = goal - left_sum

        # Binary search for closest value to target in right_sums
        idx = bisect.bisect_left(right_sums, target)

        # Check values at idx and idx-1
        if idx < len(right_sums):
            min_diff = min(min_diff, abs(left_sum + right_sums[idx] - goal))
        if idx > 0:
            min_diff = min(min_diff, abs(left_sum + right_sums[idx-1] - goal))

    return min_diff
```

### Test Cases

**Test 1:** Exact match possible
- Input: "min_abs_difference([5,-7,3,5], 6)"
- Expected: "0"

**Test 2:** Closest is -4 or -6
- Input: "min_abs_difference([7,-9,15,-2], -5)"
- Expected: "1"

**Test 3:** Max sum is 6, diff=4
- Input: "min_abs_difference([1,2,3], 10)"
- Expected: "4"

---

## 49. 4Sum II (Meet in Middle Variant)

**Difficulty:** medium
**Concept:** backtracking-trees

### Description

Given four integer arrays nums1, nums2, nums3, and nums4 all of length n, return the number of tuples (i, j, k, l) such that nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0.

### Key Insight

Meet in Middle for 4 arrays! Instead of trying all n^4 combinations, split into two groups: (nums1, nums2) and (nums3, nums4). Compute all pairwise sums for each group (n^2). For each sum from group 1, count how many from group 2 equal its negative.

### Examples

**Example 1:**
- Input: nums1=[1,2], nums2=[-2,-1], nums3=[-1,2], nums4=[0,2]
- Output: 2
- Explanation: Two tuples: (0,0,0,1) → 1+(-2)+(-1)+0=-2 wait... Let me recompute...

### Hints

1. Group 1: compute all nums1[i] + nums2[j], store in hashmap with counts
2. Group 2: compute all nums3[k] + nums4[l]
3. For each sum_group2, check if -sum_group2 exists in group1 hashmap
4. Add hashmap[- sum_group2] to result count
5. Use Counter or defaultdict for frequency tracking
6. Time: O(n²) instead of O(n^4)
7. This is like 2Sum applied twice

### Starter Code

**Python:**
```python
def four_sum_count(nums1, nums2, nums3, nums4):
    """
    Count 4-sum combinations that equal zero using meet-in-middle.

    Args:
        nums1, nums2, nums3, nums4: List[int] - four arrays

    Returns:
        int - count of valid tuples
    """
    from collections import Counter

    # TODO: Generate all pairwise sums from nums1 and nums2
    # TODO: For each pairwise sum from nums3 and nums4,
    #       check if its negative exists in first group
    # TODO: Count matches
    pass
```

**JavaScript:**
```javascript
function four_sum_count(nums1, nums2, nums3, nums4) {
    """
    Count 4-sum combinations that equal zero using meet-in-middle.

    Args:
        nums1, nums2, nums3, nums4: Array - four arrays

    Returns:
        int - count of valid tuples
    """
    from collections import Counter

    // TODO: Generate all pairwise sums from nums1 and nums2
    // TODO: For each pairwise sum from nums3 and nums4,
    #       check if its negative exists in first group
    // TODO: Count matches
  // TODO: implement
```

### Solution

**Python:**
```python
def four_sum_count(nums1, nums2, nums3, nums4):
    from collections import Counter

    # Count all pairwise sums from nums1 and nums2
    sum_count = Counter()
    for a in nums1:
        for b in nums2:
            sum_count[a + b] += 1

    # For each pairwise sum from nums3 and nums4,
    # check if its complement exists
    result = 0
    for c in nums3:
        for d in nums4:
            target = -(c + d)
            result += sum_count[target]

    return result
```

**JavaScript:**
```javascript
function four_sum_count(nums1, nums2, nums3, nums4) {
    from collections import Counter

    # Count all pairwise sums from nums1 and nums2
    sum_count = Counter()
    for a in nums1:
        for b in nums2:
            sum_count[a + b] += 1

    # For each pairwise sum from nums3 and nums4,
    # check if its complement exists
    result = 0
    for c in nums3:
        for d in nums4:
            target = -(c + d)
            result += sum_count[target]

    return result
```

### Test Cases

**Test 1:** Two valid combinations
- Input: "four_sum_count([1,2], [-2,-1], [-1,2], [0,2])"
- Expected: "2"

**Test 2:** All zeros
- Input: "four_sum_count([0], [0], [0], [0])"
- Expected: "1"

---
