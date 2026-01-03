import {
  DSACourse,
  DSAModule,
  DSALesson,
  DSAProblem,
  DSALessonContent,
} from "../types/dsa-course";

// Practice Problems - LeetCode Style
export const dsaProblems: DSAProblem[] = [
  {
    id: "subsets",
    title: "Subsets",
    description: `Given an integer array nums of unique elements, return all possible subsets (the power set).

The solution set must not contain duplicate subsets. Return the solution in any order.`,
    difficulty: "medium",
    topic: "backtracking",
    examples: [
      {
        input: "nums = [1,2,3]",
        output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
        explanation:
          "The power set contains all possible subsets including the empty set.",
      },
      {
        input: "nums = [0]",
        output: "[[],[0]]",
      },
    ],
    constraints: [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10",
      "All the numbers of nums are unique.",
    ],
    hints: [
      "Think about the decision tree: for each element, you can either include it or exclude it.",
      "The base case is when you have processed all elements in the array.",
      "Remember to make a copy of the current path before adding it to the result.",
    ],
    starterCode: `def subsets(nums: list[int]) -> list[list[int]]:
    """Return all possible subsets (the power set)."""
    pass`,
    solution: `def subsets(nums):
    """
    :type nums: List[int]
    :rtype: List[List[int]]
    """
    result = []
    
    def backtrack(path, index):
        # Base case: processed all elements
        if index == len(nums):
            result.append(path[:])  # Make a copy
            return
        
        # Choice 1: Include current element
        path.append(nums[index])
        backtrack(path, index + 1)
        path.pop()  # Undo
        
        # Choice 2: Exclude current element
        backtrack(path, index + 1)
    
    backtrack([], 0)
    return result`,
    testCases: [
      {
        id: "test-1",
        input: "[1, 2, 3]",
        expectedOutput:
          "[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]",
      },
      {
        id: "test-2",
        input: "[0]",
        expectedOutput: "[[], [0]]",
      },
      {
        id: "test-3",
        input: "[1, 2]",
        expectedOutput: "[[], [1], [2], [1, 2]]",
      },
    ],
    timeComplexity: "O(2^n)",
    spaceComplexity: "O(n)",
    tags: ["backtracking", "recursion", "bit-manipulation"],
    evolutionSteps: [
      {
        type: "brute-force",
        title: "Step 1: Iterative Approach",
        explanation: `The brute force approach uses bit manipulation to generate all 2^n combinations.

For each number from 0 to 2^n - 1, we treat its binary representation as a "mask":
- If bit i is 1, include nums[i] in the subset
- If bit i is 0, exclude nums[i]

For example, with [1,2,3]:
- 0 (000) → []
- 1 (001) → [1]
- 2 (010) → [2]  
- 3 (011) → [1,2]
- 4 (100) → [3]
...and so on

This works, but it's not intuitive and hard to extend to similar problems.`,
        code: `def subsets(nums):
    result = []
    n = len(nums)
    
    # Generate all 2^n combinations
    for mask in range(2 ** n):
        subset = []
        # Check each bit
        for i in range(n):
            # If bit i is set, include nums[i]
            if mask & (1 << i):
                subset.append(nums[i])
        result.append(subset)
    
    return result`,
        complexity: {
          time: "O(n × 2^n)",
          space: "O(2^n)"
        }
      },
      {
        type: "bottleneck",
        title: "Step 2: Identify the Problem",
        explanation: `The iterative bit manipulation approach has several issues:

🔴 Hard to understand: Requires understanding bitwise operations
🔴 Not intuitive: Doesn't match how we think about choices
🔴 Hard to modify: What if we need to add constraints?
🔴 Interview red flag: Doesn't demonstrate problem-solving thinking

The real insight: This is a **decision problem**. For each element, we make a choice: include it or exclude it. This naturally suggests recursion!`,
        highlight: "Bit manipulation obscures the underlying decision tree structure"
      },
      {
        type: "optimized",
        title: "Step 3: Backtracking Solution",
        explanation: `The backtracking approach models the problem as a decision tree:

At each index, we have two choices:
1. Include the current element → recurse with it added to path
2. Exclude the current element → recurse without it

This creates a binary decision tree of height n, with 2^n leaf nodes (all possible subsets).

Why this is better:
✅ Intuitive: Matches how we think about the problem
✅ Clear structure: Base case + recursive choices
✅ Easy to modify: Can add pruning, constraints, etc.
✅ Interview-friendly: Shows systematic thinking

The time complexity is still O(2^n), but the code is much clearer and extensible!`,
        code: `def subsets(nums):
    result = []
    
    def backtrack(path, index):
        # Base case: processed all elements
        if index == len(nums):
            result.append(path[:])  # Make a copy
            return
        
        # Choice 1: Include current element
        path.append(nums[index])
        backtrack(path, index + 1)
        path.pop()  # Undo
        
        # Choice 2: Exclude current element
        backtrack(path, index + 1)
    
    backtrack([], 0)
    return result`,
        complexity: {
          time: "O(2^n)",
          space: "O(n)"
        }
      }
    ]
  },
  {
    id: "permutations",
    title: "Permutations",
    description: `Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.`,
    difficulty: "medium",
    topic: "backtracking",
    examples: [
      {
        input: "nums = [1,2,3]",
        output:
          "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
      },
      {
        input: "nums = [0,1]",
        output: "[[0,1],[1,0]]",
      },
      {
        input: "nums = [1]",
        output: "[[1]]",
      },
    ],
    constraints: [
      "1 <= nums.length <= 6",
      "-10 <= nums[i] <= 10",
      "All the integers of nums are unique.",
    ],
    hints: [
      "For permutations, you need to track which elements have been used.",
      "Each position in the permutation can be filled with any unused element.",
      "The base case is when your current permutation length equals the input array length.",
    ],
    starterCode: `def permute(nums: list[int]) -> list[list[int]]:
    """Return all possible permutations."""
    pass`,
    solution: `def permute(nums):
    """
    :type nums: List[int]
    :rtype: List[List[int]]
    """
    result = []
    
    def backtrack(path):
        # Base case: permutation is complete
        if len(path) == len(nums):
            result.append(path[:])
            return
        
        # Try each number that hasn't been used
        for num in nums:
            if num not in path:
                path.append(num)
                backtrack(path)
                path.pop()  # Undo
    
    backtrack([])
    return result`,
    testCases: [
      {
        id: "test-1",
        input: "[1, 2, 3]",
        expectedOutput:
          "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
      },
      {
        id: "test-2",
        input: "[0, 1]",
        expectedOutput: "[[0,1],[1,0]]",
      },
      {
        id: "test-3",
        input: "[1]",
        expectedOutput: "[[1]]",
      },
    ],
    timeComplexity: "O(n!)",
    spaceComplexity: "O(n)",
    tags: ["backtracking", "recursion"],
  },
  {
    id: "combination-sum",
    title: "Combination Sum",
    description: `Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.

The same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.`,
    difficulty: "medium",
    topic: "backtracking",
    examples: [
      {
        input: "candidates = [2,3,6,7], target = 7",
        output: "[[2,2,3],[7]]",
        explanation:
          "2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times. 7 is a candidate, and 7 = 7. These are the only two combinations.",
      },
      {
        input: "candidates = [2,3,5], target = 8",
        output: "[[2,2,2,2],[2,3,3],[3,5]]",
      },
      {
        input: "candidates = [2], target = 1",
        output: "[]",
      },
    ],
    constraints: [
      "1 <= candidates.length <= 30",
      "2 <= candidates[i] <= 40",
      "All elements of candidates are distinct.",
      "1 <= target <= 40",
    ],
    hints: [
      "Use a start index to avoid duplicate combinations.",
      "You can use the same element multiple times, so don't increment the start index when recursing with the same element.",
      "Stop early if the remaining target becomes negative.",
    ],
    starterCode: `def combinationSum(candidates: list[int], target: int) -> list[list[int]]:
    """Return all unique combinations where chosen numbers sum to target."""
    pass`,
    solution: `def combinationSum(candidates, target):
    """
    :type candidates: List[int]
    :type target: int
    :rtype: List[List[int]]
    """
    result = []
    
    def backtrack(path, start, remaining):
        # Base case: found a valid combination
        if remaining == 0:
            result.append(path[:])
            return
        
        # Prune: stop if remaining becomes negative
        if remaining < 0:
            return
        
        # Try each candidate starting from 'start'
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            # Same element can be reused, so pass i (not i+1)
            backtrack(path, i, remaining - candidates[i])
            path.pop()  # Undo
    
    backtrack([], 0, target)
    return result`,
    testCases: [
      {
        id: "test-1",
        input: "[2,3,6,7], 7",
        expectedOutput: "[[2,2,3],[7]]",
      },
      {
        id: "test-2",
        input: "[2,3,5], 8",
        expectedOutput: "[[2,2,2,2],[2,3,3],[3,5]]",
      },
      {
        id: "test-3",
        input: "[2], 1",
        expectedOutput: "[]",
      },
    ],
    timeComplexity: "O(2^t)",
    spaceComplexity: "O(t)",
    tags: ["backtracking", "recursion", "array"],
    evolutionSteps: [
      {
        type: "brute-force",
        title: "Step 1: Generate All, Filter Later",
        explanation: `The brute force approach would generate ALL possible combinations of candidates (with repetition allowed), then filter for those that sum to target.

This is incredibly wasteful because:
- We explore many paths that exceed the target
- We only filter at the end, wasting time on invalid combinations
- For target=40 with candidates [2,3,5], we'd explore millions of combinations

Example: If target=7 and we're building [2,2,2,2,...], we keep going even though we've already exceeded 7!`,
        code: `def combinationSum(candidates, target):
    result = []
    
    def backtrack(path, start):
        # Check AFTER building the entire combination
        total = sum(path)
        
        if total == target:
            result.append(path[:])
            return
        
        # Keep exploring even if total > target (wasteful!)
        if len(path) > target:  # Arbitrary cutoff
            return
            
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            backtrack(path, i)  # Can reuse same element
            path.pop()
    
    backtrack([], 0)
    return result`,
        complexity: {
          time: "O(2^(t/min)) - exponential in target",
          space: "O(t)"
        }
      },
      {
        type: "bottleneck",
        title: "Step 2: The Waste in Exploration",
        explanation: `The bottleneck is exploring paths we KNOW will fail:

Problem: We only check if we've exceeded target AFTER adding elements
- Path [2,2,2,2] with target=7? Already failed at [2,2,2,2]
- But we kept recursing!

Key insight: We can **prune early**!
- Track the remaining target as we go
- Stop recursing when remaining < 0
- This prevents exploring millions of invalid paths

Think of it like searching a maze: Instead of exploring every dead end to its conclusion, we turn back as soon as we hit a wall!`,
        highlight: "We explore invalid paths deep into the recursion tree before checking"
      },
      {
        type: "optimized",
        title: "Step 3: Prune Early with Remaining Target",
        explanation: `The optimized solution tracks the remaining target and prunes immediately:

Key improvements:
1. **Track remaining**: Instead of summing at the end, track target - sum
2. **Prune early**: Stop when remaining < 0 (impossible to succeed)
3. **Success check**: remaining == 0 means we found a valid combination

Why this is faster:
- Before: Explore [2,2,2,2,2] fully before realizing it fails
- After: Stop at [2,2,2,2] when remaining = -1

For target=7, candidates=[2,3,5]:
- Path [2,2,2]: remaining = 1, keep going
- Path [2,2,2,2]: remaining = -1, STOP immediately!

This dramatically reduces the search space!`,
        code: `def combinationSum(candidates, target):
    result = []
    
    def backtrack(path, start, remaining):
        # Base case: found a valid combination
        if remaining == 0:
            result.append(path[:])
            return
        
        # Prune: stop if remaining becomes negative
        if remaining < 0:
            return
        
        # Try each candidate starting from 'start'
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            # Same element can be reused, so pass i (not i+1)
            backtrack(path, i, remaining - candidates[i])
            path.pop()  # Undo
    
    backtrack([], 0, target)
    return result`,
        complexity: {
          time: "O(2^t) - still exponential but pruned heavily",
          space: "O(t)"
        }
      }
    ]
  },
  // ==========================================
  // Arrays & Hashing Challenges (from challenges.json)
  // ==========================================
  {
    id: "q_238",
    title: "Product of Array Except Self",
    description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\\n\\nThe product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.\\n\\nYou must write an algorithm that runs in O(n) time and without using the division operation.",
    difficulty: "medium",
    topic: "arrays",
    constraints: ["O(N) Time", "O(1) Space", "NO Division"],
    starterCode: "def productExceptSelf(nums: list[int]) -> list[int]:\\n    pass",
    solution: "def productExceptSelf(nums):\\n    n = len(nums)\\n    res = [1] * n\\n    \\n    prefix = 1\\n    for i in range(n):\\n        res[i] = prefix\\n        prefix *= nums[i]\\n        \\n    postfix = 1\\n    for i in range(n - 1, -1, -1):\\n        res[i] *= postfix\\n        postfix *= nums[i]\\n        \\n    return res",
    testCases: [
      { id: "tc_238_1", input: "[1,2,3,4]", expectedOutput: "[24,12,8,6]" },
      { id: "tc_238_2", input: "[-1,1,0,-3,3]", expectedOutput: "[0,0,9,0,0]" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["arrays", "prefix-sum"],
    examples: [],
    hints: []
  },
  {
    id: "q_128",
    title: "Longest Consecutive Sequence",
    description: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.\\n\\nYou must write an algorithm that runs in O(n) time.",
    difficulty: "medium",
    topic: "arrays",
    constraints: ["O(N) Time", "NO Sorting"],
    starterCode: "def longestConsecutive(nums: list[int]) -> int:\\n    pass",
    solution: "def longestConsecutive(nums):\\n    numSet = set(nums)\\n    longest = 0\\n    \\n    for n in numSet:\\n        if (n - 1) not in numSet:\\n            length = 0\\n            while (n + length) in numSet:\\n                length += 1\\n            longest = max(length, longest)\\n    return longest",
    testCases: [
      { id: "tc_128_1", input: "[100,4,200,1,3,2]", expectedOutput: "4" },
      { id: "tc_128_2", input: "[0,3,7,2,5,8,4,6,0,1]", expectedOutput: "9" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    tags: ["arrays", "hash-table", "union-find"],
    examples: [],
    hints: []
  },
  {
    id: "q_560",
    title: "Subarray Sum Equals K",
    description: "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.\\n\\nA subarray is a contiguous non-empty sequence of elements within an array.",
    difficulty: "medium",
    topic: "arrays",
    constraints: ["O(N) Time", "O(N) Space"],
    starterCode: "def subarraySum(nums: list[int], k: int) -> int:\\n    pass",
    solution: "def subarraySum(nums, k):\\n    count = 0\\n    sum_val = 0\\n    map_sum = {0: 1}\\n    \\n    for n in nums:\\n        sum_val += n\\n        if (sum_val - k) in map_sum:\\n            count += map_sum[sum_val - k]\\n        map_sum[sum_val] = map_sum.get(sum_val, 0) + 1\\n            \\n    return count",
    testCases: [
      { id: "tc_560_1", input: "[1,1,1], 2", expectedOutput: "2" },
      { id: "tc_560_2", input: "[1,2,3], 3", expectedOutput: "2" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    tags: ["arrays", "hash-table", "prefix-sum"],
    examples: [],
    hints: []
  },
  {
    id: "q_41",
    title: "First Missing Positive",
    description: "Given an unsorted integer array nums, return the smallest missing positive integer.\\n\\nYou must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.",
    difficulty: "hard",
    topic: "arrays",
    constraints: ["O(N) Time", "O(1) Space", "In-Place Modification"],
    starterCode: "def firstMissingPositive(nums: list[int]) -> int:\\n    pass",
    solution: "def firstMissingPositive(nums):\\n    n = len(nums)\\n    for i in range(n):\\n        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:\\n            nums[nums[i] - 1], nums[i] = nums[i], nums[nums[i] - 1]\\n            \\n    for i in range(n):\\n        if nums[i] != i + 1:\\n            return i + 1\\n    return n + 1",
    testCases: [
      { id: "tc_41_1", input: "[1,2,0]", expectedOutput: "3" },
      { id: "tc_41_2", input: "[3,4,-1,1]", expectedOutput: "2" },
      { id: "tc_41_3", input: "[7,8,9,11,12]", expectedOutput: "1" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["arrays", "hash-table"],
    examples: [],
    hints: []
  },
  {
    id: "q_271",
    title: "Encode and Decode Strings",
    description: "Design an algorithm to encode a list of strings to a string. The encoded string is then sent over the network and is decoded back to the original list of strings.",
    difficulty: "medium",
    topic: "arrays",
    constraints: ["Handle any delimiter", "O(N) Time"],
    starterCode: "def encode(strs: list[str]) -> str:\\n    pass\\n\\ndef decode(s: str) -> list[str]:\\n    pass",
    solution: "def encode(strs):\\n    res = \"\"\\n    for s in strs:\\n        res += str(len(s)) + \"#\" + s\\n    return res\\n\\ndef decode(s):\\n    res, i = [], 0\\n    while i < len(s):\\n        j = i\\n        while s[j] != \"#\":\\n            j += 1\\n        length = int(s[i:j])\\n        res.append(s[j + 1 : j + 1 + length])\\n        i = j + 1 + length\\n    return res",
    testCases: [
      { id: "tc_271_1", input: "['lint','code','love','you']", expectedOutput: "['lint','code','love','you']" },
      { id: "tc_271_2", input: "['we', 'say', ':', 'yes']", expectedOutput: "['we', 'say', ':', 'yes']" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["strings", "design"],
    examples: [],
    hints: []
  },
  {
    id: "q_49",
    title: "Group Anagrams",
    description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    difficulty: "medium",
    topic: "arrays",
    constraints: ["O(N*K) Time", "Avoid Sorting Strings"],
    starterCode: "def groupAnagrams(strs: list[str]) -> list[list[str]]:\\n    pass",
    solution: "def groupAnagrams(strs):\\n    from collections import defaultdict\\n    ans = defaultdict(list)\\n    for s in strs:\\n        count = [0] * 26\\n        for c in s:\\n            count[ord(c) - ord('a')] += 1\\n        ans[tuple(count)].append(s)\\n    return list(ans.values())",
    testCases: [
      { id: "tc_49_1", input: "['eat','tea','tan','ate','nat','bat']", expectedOutput: "[['bat'],['nat','tan'],['ate','eat','tea']]" },
      { id: "tc_49_2", input: "['']", expectedOutput: "[['']]" },
      { id: "tc_49_3", input: "['a']", expectedOutput: "[['a']]" }
    ],
    timeComplexity: "O(n * k)",
    spaceComplexity: "O(n * k)",
    tags: ["hash-table", "strings"],
    examples: [],
    hints: []
  },
  {
    id: "q_36",
    title: "Valid Sudoku",
    description: "Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules:\\n1. Each row must contain the digits 1-9 without repetition.\\n2. Each column must contain the digits 1-9 without repetition.\\n3. Each of the nine 3 x 3 sub-boxes of the grid must contain the digits 1-9 without repetition.",
    difficulty: "medium",
    topic: "arrays",
    constraints: ["O(1) Time", "Single Pass"],
    starterCode: "def isValidSudoku(board: list[list[str]]) -> bool:\\n    pass",
    solution: "def isValidSudoku(board):\\n    import collections\\n    cols = collections.defaultdict(set)\\n    rows = collections.defaultdict(set)\\n    squares = collections.defaultdict(set)\\n    \\n    for r in range(9):\\n        for c in range(9):\\n            if board[r][c] == \".\":\\n                continue\\n            if (board[r][c] in rows[r] or\\n                board[r][c] in cols[c] or\\n                board[r][c] in squares[(r // 3, c // 3)]):\\n                return False\\n            cols[c].add(board[r][c])\\n            rows[r].add(board[r][c])\\n            squares[(r // 3, c // 3)].add(board[r][c])\\n    return True",
    testCases: [
      { id: "tc_36_1", input: "[['5','3','.','.','7','.','.','.','.'],['6','.','.','1','9','5','.','.','.'],['.','9','8','.','.','.','.','6','.'],['8','.','.','.','6','.','.','.','3'],['4','.','.','8','.','3','.','.','1'],['7','.','.','.','2','.','.','.','6'],['.','6','.','.','.','.','2','8','.'],['.','.','.','4','1','9','.','.','5'],['.','.','.','.','8','.','.','7','9']]", expectedOutput: "True" }
    ],
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    tags: ["arrays", "hash-table"],
    examples: [],
    hints: []
  },
  {
    id: "q_31",
    title: "Next Permutation",
    description: "A permutation of an array of integers is an arrangement of its members into a sequence or linear order.\\nFind the next lexicographically greater permutation of numbers. If the arrangement is already the highest possible, rearrange it as the lowest possible order (ascending).",
    difficulty: "medium",
    topic: "arrays",
    constraints: ["O(N) Time", "O(1) Space", "In-Place"],
    starterCode: "def nextPermutation(nums: list[int]) -> list[int]:\\n    pass",
    solution: "def nextPermutation(nums):\\n    # Convert to list if needed (though already list)\\n    # Find first decreasing element from right\\n    i = len(nums) - 2\\n    while i >= 0 and nums[i] >= nums[i + 1]:\\n        i -= 1\\n        \\n    if i >= 0:\\n        j = len(nums) - 1\\n        while nums[j] <= nums[i]:\\n            j -= 1\\n        nums[i], nums[j] = nums[j], nums[i]\\n        \\n    # Reverse the subarray after i\\n    left, right = i + 1, len(nums) - 1\\n    while left < right:\\n        nums[left], nums[right] = nums[right], nums[left]\\n        left += 1\\n        right -= 1\\n    return nums",
    testCases: [
      { id: "tc_31_1", input: "[1,2,3]", expectedOutput: "[1,3,2]" },
      { id: "tc_31_2", input: "[3,2,1]", expectedOutput: "[1,2,3]" },
      { id: "tc_31_3", input: "[1,1,5]", expectedOutput: "[1,5,1]" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["arrays", "two-pointers"],
    examples: [],
    hints: []
  },
  {
    id: "q_54",
    title: "Spiral Matrix",
    description: "Given an m x n matrix, return all elements of the matrix in spiral order.",
    difficulty: "medium",
    topic: "arrays",
    constraints: ["O(M*N) Time", "Clean Code"],
    starterCode: "def spiralOrder(matrix: list[list[int]]) -> list[int]:\\n    pass",
    solution: "def spiralOrder(matrix):\\n    res = []\\n    left, right = 0, len(matrix[0])\\n    top, bottom = 0, len(matrix)\\n    \\n    while left < right and top < bottom:\\n        for i in range(left, right):\\n            res.append(matrix[top][i])\\n        top += 1\\n        for i in range(top, bottom):\\n            res.append(matrix[i][right - 1])\\n        right -= 1\\n        if not (left < right and top < bottom):\\n            break\\n        for i in range(right - 1, left - 1, -1):\\n            res.append(matrix[bottom - 1][i])\\n        bottom -= 1\\n        for i in range(bottom - 1, top - 1, -1):\\n            res.append(matrix[i][left])\\n        left += 1\\n    return res",
    testCases: [
      { id: "tc_54_1", input: "[[1,2,3],[4,5,6],[7,8,9]]", expectedOutput: "[1,2,3,6,9,8,7,4,5]" },
      { id: "tc_54_2", input: "[[1,2,3,4],[5,6,7,8],[9,10,11,12]]", expectedOutput: "[1,2,3,4,8,12,11,10,9,5,6,7]" }
    ],
    timeComplexity: "O(m * n)",
    spaceComplexity: "O(1)",
    tags: ["arrays", "matrix"],
    examples: [],
    hints: []
  },
  {
    id: "q_48",
    title: "Rotate Image",
    description: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).\\n\\nYou have to rotate the image in-place, which means you have to modify the input 2D matrix directly.",
    difficulty: "medium",
    topic: "arrays",
    constraints: ["In-Place", "No Extra Matrix"],
    starterCode: "def rotate(matrix: list[list[int]]) -> list[list[int]]:\\n    pass",
    solution: "def rotate(matrix):\\n    left, right = 0, len(matrix) - 1\\n    while left < right:\\n        for i in range(right - left):\\n            top, bottom = left, right\\n            topLeft = matrix[top][left + i]\\n            matrix[top][left + i] = matrix[bottom - i][left]\\n            matrix[bottom - i][left] = matrix[bottom][right - i]\\n            matrix[bottom][right - i] = matrix[top + i][right]\\n            matrix[top + i][right] = topLeft\\n        right -= 1\\n        left += 1\\n    return matrix",
    testCases: [
      { id: "tc_48_1", input: "[[1,2,3],[4,5,6],[7,8,9]]", expectedOutput: "[[7,4,1],[8,5,2],[9,6,3]]" },
      { id: "tc_48_2", input: "[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]", expectedOutput: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]" }
    ],
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(1)",
    tags: ["arrays", "matrix"],
    examples: [],
    hints: []
  },
  // ==========================================
  // Module 2: Two Pointers & Sliding Window Challenges
  // ==========================================
  {
    id: "q_42",
    title: "Trapping Rain Water",
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    difficulty: "hard",
    topic: "arrays",
    constraints: ["O(N) Time", "O(1) Space"],
    starterCode: "def trap(height: list[int]) -> int:\\n    pass",
    solution: "def trap(height):\\n    if not height: return 0\\n    l, r = 0, len(height) - 1\\n    leftMax, rightMax = height[l], height[r]\\n    res = 0\\n    while l < r:\\n        if leftMax < rightMax:\\n            l += 1\\n            leftMax = max(leftMax, height[l])\\n            res += leftMax - height[l]\\n        else:\\n            r -= 1\\n            rightMax = max(rightMax, height[r])\\n            res += rightMax - height[r]\\n    return res",
    testCases: [
      { id: "tc_42_1", input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expectedOutput: "6" },
      { id: "tc_42_2", input: "[4,2,0,3,2,5]", expectedOutput: "9" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["two-pointers", "stack"],
    examples: [],
    hints: []
  },
  {
    id: "q_76",
    title: "Minimum Window Substring",
    description: "Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.",
    difficulty: "hard",
    topic: "strings",
    constraints: ["O(N) Time", "O(1) Space (Char Map)"],
    starterCode: "def minWindow(s: str, t: str) -> str:\\n    pass",
    solution: "def minWindow(s, t):\\n    if not t or not s: return \"\"\\n    countT, window = {}, {}\\n    for c in t: countT[c] = countT.get(c, 0) + 1\\n    have, need = 0, len(countT)\\n    res, resLen = [-1, -1], float(\"inf\")\\n    l = 0\\n    for r in range(len(s)):\\n        c = s[r]\\n        window[c] = window.get(c, 0) + 1\\n        if c in countT and window[c] == countT[c]:\\n            have += 1\\n        while have == need:\\n            if (r - l + 1) < resLen:\\n                res = [l, r]\\n                resLen = (r - l + 1)\\n            window[s[l]] -= 1\\n            if s[l] in countT and window[s[l]] < countT[s[l]]:\\n                have -= 1\\n            l += 1\\n    l, r = res\\n    return s[l : r + 1] if resLen != float(\"inf\") else \"\"",
    testCases: [
      { id: "tc_76_1", input: "'ADOBECODEBANC', 'ABC'", expectedOutput: "'BANC'" },
      { id: "tc_76_2", input: "'a', 'a'", expectedOutput: "'a'" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["sliding-window", "hash-table"],
    examples: [],
    hints: []
  },
  {
    id: "q_15",
    title: "3Sum",
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    difficulty: "medium",
    topic: "arrays",
    constraints: ["O(N^2) Time", "No Duplicates"],
    starterCode: "def threeSum(nums: list[int]) -> list[list[int]]:\\n    pass",
    solution: "def threeSum(nums):\\n    res = []\\n    nums.sort()\\n    for i, a in enumerate(nums):\\n        if i > 0 and a == nums[i - 1]:\\n            continue\\n        l, r = i + 1, len(nums) - 1\\n        while l < r:\\n            threeSum = a + nums[l] + nums[r]\\n            if threeSum > 0:\\n                r -= 1\\n            elif threeSum < 0:\\n                l += 1\\n            else:\\n                res.append([a, nums[l], nums[r]])\\n                l += 1\\n                while nums[l] == nums[l - 1] and l < r:\\n                    l += 1\\n    return res",
    testCases: [
      { id: "tc_15_1", input: "[-1,0,1,2,-1,-4]", expectedOutput: "[[-1,-1,2],[-1,0,1]]" },
      { id: "tc_15_2", input: "[0,1,1]", expectedOutput: "[]" }
    ],
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(1)",
    tags: ["two-pointers", "sorting"],
    examples: [],
    hints: []
  },
  {
    id: "q_11",
    title: "Container With Most Water",
    description: "Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    difficulty: "medium",
    topic: "arrays",
    constraints: ["O(N) Time", "Greedy Approach"],
    starterCode: "def maxArea(height: list[int]) -> int:\\n    pass",
    solution: "def maxArea(height):\\n    l, r = 0, len(height) - 1\\n    res = 0\\n    while l < r:\\n        res = max(res, (r - l) * min(height[l], height[r]))\\n        if height[l] < height[r]:\\n            l += 1\\n        else:\\n            r -= 1\\n    return res",
    testCases: [
      { id: "tc_11_1", input: "[1,8,6,2,5,4,8,3,7]", expectedOutput: "49" },
      { id: "tc_11_2", input: "[1,1]", expectedOutput: "1" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["two-pointers", "greedy"],
    examples: [],
    hints: []
  },
  {
    id: "q_239",
    title: "Sliding Window Maximum",
    description: "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. Return the max sliding window.",
    difficulty: "hard",
    topic: "arrays",
    constraints: ["O(N) Time", "Monotonic Deque"],
    starterCode: "def maxSlidingWindow(nums: list[int], k: int) -> list[int]:\\n    pass",
    solution: "def maxSlidingWindow(nums, k):\\n    import collections\\n    output = []\\n    q = collections.deque()\\n    l = r = 0\\n    while r < len(nums):\\n        while q and nums[q[-1]] < nums[r]:\\n            q.pop()\\n        q.append(r)\\n        if l > q[0]:\\n            q.popleft()\\n        if (r + 1) >= k:\\n            output.append(nums[q[0]])\\n            l += 1\\n        r += 1\\n    return output",
    testCases: [
      { id: "tc_239_1", input: "[1,3,-1,-3,5,3,6,7], 3", expectedOutput: "[3,3,5,5,6,7]" },
      { id: "tc_239_2", input: "[1], 1", expectedOutput: "[1]" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
    tags: ["sliding-window", "monotonic-queue"],
    examples: [],
    hints: []
  },
  {
    id: "q_424",
    title: "Longest Repeating Character Replacement",
    description: "You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most k times. Return the length of the longest substring containing the same letter.",
    difficulty: "medium",
    topic: "strings",
    constraints: ["O(N) Time", "Valid Window logic"],
    starterCode: "def characterReplacement(s: str, k: int) -> int:\\n    pass",
    solution: "def characterReplacement(s, k):\\n    count = {}\\n    res = 0\\n    l = 0\\n    for r in range(len(s)):\\n        count[s[r]] = count.get(s[r], 0) + 1\\n        while (r - l + 1) - max(count.values()) > k:\\n            count[s[l]] -= 1\\n            l += 1\\n        res = max(res, r - l + 1)\\n    return res",
    testCases: [
      { id: "tc_424_1", input: "'ABAB', 2", expectedOutput: "4" },
      { id: "tc_424_2", input: "'AABABBA', 1", expectedOutput: "4" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["sliding-window", "hash-table"],
    examples: [],
    hints: []
  },
  {
    id: "q_340",
    title: "Longest Substring with At Most K Distinct Characters",
    description: "Given a string s and an integer k, return the length of the longest substring of s that contains at most k distinct characters.",
    difficulty: "medium",
    topic: "strings",
    constraints: ["O(N) Time", "HashMap Tracking"],
    starterCode: "def lengthOfLongestSubstringKDistinct(s: str, k: int) -> int:\\n    pass",
    solution: "def lengthOfLongestSubstringKDistinct(s, k):\\n    if k == 0: return 0\\n    char_map = {}\\n    l = 0\\n    res = 0\\n    for r in range(len(s)):\\n        char_map[s[r]] = char_map.get(s[r], 0) + 1\\n        while len(char_map) > k:\\n            char_map[s[l]] -= 1\\n            if char_map[s[l]] == 0:\\n                del char_map[s[l]]\\n            l += 1\\n        res = max(res, r - l + 1)\\n    return res",
    testCases: [
      { id: "tc_340_1", input: "'eceba', 2", expectedOutput: "3" },
      { id: "tc_340_2", input: "'aa', 1", expectedOutput: "2" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
    tags: ["sliding-window", "hash-table"],
    examples: [],
    hints: []
  },
  {
    id: "q_18",
    title: "4Sum",
    description: "Given an array nums of n integers, return an array of all the unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that the sum is target.",
    difficulty: "medium",
    topic: "arrays",
    constraints: ["O(N^3) Time", "Generalized kSum"],
    starterCode: "def fourSum(nums: list[int], target: int) -> list[list[int]]:\\n    pass",
    solution: "def fourSum(nums, target):\\n    nums.sort()\\n    res, quad = [], []\\n    def kSum(k, start, target):\\n        if k != 2:\\n            for i in range(start, len(nums) - k + 1):\\n                if i > start and nums[i] == nums[i - 1]:\\n                    continue\\n                quad.append(nums[i])\\n                kSum(k - 1, i + 1, target - nums[i])\\n                quad.pop()\\n            return\\n        l, r = start, len(nums) - 1\\n        while l < r:\\n            if nums[l] + nums[r] < target:\\n                l += 1\\n            elif nums[l] + nums[r] > target:\\n                r -= 1\\n            else:\\n                res.append(quad + [nums[l], nums[r]])\\n                l += 1\\n                while l < r and nums[l] == nums[l - 1]:\\n                    l += 1\\n    kSum(4, 0, target)\\n    return res",
    testCases: [
      { id: "tc_18_1", input: "[1,0,-1,0,-2,2], 0", expectedOutput: "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]" },
      { id: "tc_18_2", input: "[2,2,2,2,2], 8", expectedOutput: "[[2,2,2,2]]" }
    ],
    timeComplexity: "O(n^3)",
    spaceComplexity: "O(1)",
    tags: ["two-pointers", "sorting"],
    examples: [],
    hints: []
  },
  {
    id: "q_75",
    title: "Sort Colors",
    description: "Given an array nums with n objects colored red, white, or blue (0, 1, 2), sort them in-place so that objects of the same color are adjacent.",
    difficulty: "medium",
    topic: "arrays",
    constraints: ["O(N) Time", "O(1) Space", "One Pass"],
    starterCode: "def sortColors(nums: list[int]) -> list[int]:\\n    pass",
    solution: "def sortColors(nums):\\n    l, r = 0, len(nums) - 1\\n    i = 0\\n    while i <= r:\\n        if nums[i] == 0:\\n            nums[l], nums[i] = nums[i], nums[l]\\n            l += 1\\n        elif nums[i] == 2:\\n            nums[i], nums[r] = nums[r], nums[i]\\n            r -= 1\\n            i -= 1\\n        i += 1\\n    return nums",
    testCases: [
      { id: "tc_75_1", input: "[2,0,2,1,1,0]", expectedOutput: "[0,0,1,1,2,2]" },
      { id: "tc_75_2", input: "[2,0,1]", expectedOutput: "[0,1,2]" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["two-pointers", "sorting"],
    examples: [],
    hints: []
  },
  {
    id: "q_84",
    title: "Largest Rectangle in Histogram",
    description: "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
    difficulty: "hard",
    topic: "arrays",
    constraints: ["O(N) Time", "Stack refined"],
    starterCode: "def largestRectangleArea(heights: list[int]) -> int:\\n    pass",
    solution: "def largestRectangleArea(heights):\\n    stack = []\\n    maxArea = 0\\n    for i, h in enumerate(heights):\\n        start = i\\n        while stack and stack[-1][1] > h:\\n            index, height = stack.pop()\\n            maxArea = max(maxArea, height * (i - index))\\n            start = index\\n        stack.append((start, h))\\n    for i, h in stack:\\n        maxArea = max(maxArea, h * (len(heights) - i))\\n    return maxArea",
    testCases: [
      { id: "tc_84_1", input: "[2,1,5,6,2,3]", expectedOutput: "10" },
      { id: "tc_84_2", input: "[2,4]", expectedOutput: "4" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    tags: ["monotonic-stack", "arrays"],
    examples: [],
    hints: []
  },

  // ==========================================
  // Module 3: Stack & LinkedList Challenges
  // ==========================================
  {
    id: "q_25",
    title: "Reverse Nodes in k-Group",
    description: "Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list.",
    difficulty: "hard",
    topic: "linked-lists",
    constraints: ["O(N) Time", "O(1) Space"],
    starterCode: "def reverseKGroup(head: Optional[ListNode], k: int) -> Optional[ListNode]:\\n    pass",
    solution: "def reverseKGroup(head, k):\\n    dummy = ListNode(0, head)\\n    groupPrev = dummy\\n    while True:\\n        kth = groupPrev\\n        for _ in range(k):\\n            kth = kth.next\\n            if not kth: return dummy.next\\n        groupNext = kth.next\\n        prev, curr = kth.next, groupPrev.next\\n        while curr != groupNext:\\n            temp = curr.next\\n            curr.next = prev\\n            prev = curr\\n            curr = temp\\n        temp = groupPrev.next\\n        groupPrev.next = kth\\n        groupPrev = temp\\n    return dummy.next",
    testCases: [
      { id: "tc_25_1", input: "[1,2,3,4,5], 2", expectedOutput: "[2,1,4,3,5]" },
      { id: "tc_25_2", input: "[1,2,3,4,5], 3", expectedOutput: "[3,2,1,4,5]" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["linked-lists", "recursion"],
    examples: [],
    hints: []
  },
  {
    id: "q_23",
    title: "Merge k Sorted Lists",
    description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    difficulty: "hard",
    topic: "linked-lists",
    constraints: ["O(N log k) Time", "O(1) Space (Iterative)"],
    starterCode: "def mergeKLists(lists: list[Optional[ListNode]]) -> Optional[ListNode]:\\n    pass",
    solution: "def mergeKLists(lists):\\n    if not lists or len(lists) == 0: return None\\n    while len(lists) > 1:\\n        mergedLists = []\\n        for i in range(0, len(lists), 2):\\n            l1 = lists[i]\\n            l2 = lists[i + 1] if (i + 1) < len(lists) else None\\n            mergedLists.append(mergeTwoLists(l1, l2))\\n        lists = mergedLists\\n    return lists[0]\\n\\ndef mergeTwoLists(l1, l2):\\n    dummy = ListNode()\\n    tail = dummy\\n    while l1 and l2:\\n        if l1.val < l2.val:\\n            tail.next = l1\\n            l1 = l1.next\\n        else:\\n            tail.next = l2\\n            l2 = l2.next\\n        tail = tail.next\\n    if l1: tail.next = l1\\n    if l2: tail.next = l2\\n    return dummy.next",
    testCases: [
      { id: "tc_23_1", input: "[[1,4,5],[1,3,4],[2,6]]", expectedOutput: "[1,1,2,3,4,4,5,6]" },
      { id: "tc_23_2", input: "[]", expectedOutput: "[]" }
    ],
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(1)",
    tags: ["linked-lists", "heap"],
    examples: [],
    hints: []
  },
  {
    id: "q_138",
    title: "Copy List with Random Pointer",
    description: "A linked list of length n is given such that each node contains an additional random pointer. Construct a deep copy of the list.",
    difficulty: "medium",
    topic: "linked-lists",
    constraints: ["O(N) Time", "O(1) Space (Interweaving)"],
    starterCode: "def copyRandomList(head: 'Optional[Node]') -> 'Optional[Node]':\\n    pass",
    solution: "def copyRandomList(head):\\n    if not head: return None\\n    curr = head\\n    while curr:\\n        new_node = Node(curr.val, curr.next)\\n        curr.next = new_node\\n        curr = new_node.next\\n    curr = head\\n    while curr:\\n        if curr.random:\\n            curr.next.random = curr.random.next\\n        curr = curr.next.next\\n    old_head = head\\n    new_head = head.next\\n    curr_old = old_head\\n    curr_new = new_head\\n    while curr_old:\\n        curr_old.next = curr_old.next.next\\n        if curr_new.next:\\n            curr_new.next = curr_new.next.next\\n        curr_old = curr_old.next\\n        curr_new = curr_new.next\\n    return new_head",
    testCases: [
      { id: "tc_138_1", input: "[[7,null],[13,0],[11,4],[10,2],[1,0]]", expectedOutput: "[[7,null],[13,0],[11,4],[10,2],[1,0]]" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["linked-lists", "hash-table"],
    examples: [],
    hints: []
  },
  {
    id: "q_224",
    title: "Basic Calculator",
    description: "Given a string s representing a valid expression, implement a basic calculator to evaluate it.",
    difficulty: "hard",
    topic: "linked-lists",
    constraints: ["O(N) Time", "Stack Usage"],
    starterCode: "def calculate(s: str) -> int:\\n    pass",
    solution: "def calculate(s):\\n    res, num, sign, stack = 0, 0, 1, []\\n    for c in s:\\n        if c.isdigit():\\n            num = 10 * num + int(c)\\n        elif c in ['-', '+']:\\n            res += sign * num\\n            num = 0\\n            sign = -1 if c == '-' else 1\\n        elif c == '(':\\n            stack.append(res)\\n            stack.append(sign)\\n            sign, res = 1, 0\\n        elif c == ')':\\n            res += sign * num\\n            res *= stack.pop()\\n            res += stack.pop()\\n            num = 0\\n    return res + sign * num",
    testCases: [
      { id: "tc_224_1", input: "'1 + 1'", expectedOutput: "2" },
      { id: "tc_224_2", input: "'(1+(4+5+2)-3)+(6+8)'", expectedOutput: "23" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    tags: ["stack", "math"],
    examples: [],
    hints: []
  },
  {
    id: "q_853",
    title: "Car Fleet",
    description: "There are n cars going to the same destination along a one-lane road. The destination is target miles away. Calculate how many car fleets will arrive at the destination.",
    difficulty: "medium",
    topic: "arrays",
    constraints: ["O(N log N) Time (Sorting)", "Monotonic Stack approach"],
    starterCode: "def carFleet(target: int, position: list[int], speed: list[int]) -> int:\\n    pass",
    solution: "def carFleet(target, position, speed):\\n    pair = [[p, s] for p, s in zip(position, speed)]\\n    stack = []\\n    for p, s in sorted(pair)[::-1]:\\n        stack.append((target - p) / s)\\n        if len(stack) >= 2 and stack[-1] <= stack[-2]:\\n            stack.pop()\\n    return len(stack)",
    testCases: [
      { id: "tc_853_1", input: "12, [10,8,0,5,3], [2,4,1,1,3]", expectedOutput: "3" },
      { id: "tc_853_2", input: "100, [0,2,4], [4,2,1]", expectedOutput: "1" }
    ],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    tags: ["monotonic-stack", "sorting"],
    examples: [],
    hints: []
  },
  {
    id: "q_316",
    title: "Remove Duplicate Letters",
    description: "Given a string s, remove duplicate letters so that every letter appears once and only once. You must make sure your result is the smallest in lexicographical order.",
    difficulty: "medium",
    topic: "strings",
    constraints: ["O(N) Time", "Monotonic Stack + Greedy"],
    starterCode: "def removeDuplicateLetters(s: str) -> str:\\n    pass",
    solution: "def removeDuplicateLetters(s):\\n    stack = []\\n    seen = set()\\n    last_occ = {c: i for i, c in enumerate(s)}\\n    for i, c in enumerate(s):\\n        if c not in seen:\\n            while stack and c < stack[-1] and i < last_occ[stack[-1]]:\\n                seen.discard(stack.pop())\\n            seen.add(c)\\n            stack.append(c)\\n    return ''.join(stack)",
    testCases: [
      { id: "tc_316_1", input: "'bcabc'", expectedOutput: "'abc'" },
      { id: "tc_316_2", input: "'cbacdcbc'", expectedOutput: "'acdb'" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["monotonic-stack", "greedy"],
    examples: [],
    hints: []
  },
  {
    id: "q_143",
    title: "Reorder List",
    description: "You are given the head of a singly linked-list. Reorder the list to be on the following form: L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 ...",
    difficulty: "medium",
    topic: "linked-lists",
    constraints: ["O(N) Time", "O(1) Space"],
    starterCode: "def reorderList(head: Optional[ListNode]) -> None:\\n    pass",
    solution: "def reorderList(head):\\n    slow, fast = head, head.next\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n    second = slow.next\\n    prev = slow.next = None\\n    while second:\\n        tmp = second.next\\n        second.next = prev\\n        prev = second\\n        second = tmp\\n    first, second = head, prev\\n    while second:\\n        tmp1, tmp2 = first.next, second.next\\n        first.next = second\\n        second.next = tmp1\\n        first, second = tmp1, tmp2",
    testCases: [
      { id: "tc_143_1", input: "[1,2,3,4]", expectedOutput: "[1,4,2,3]" },
      { id: "tc_143_2", input: "[1,2,3,4,5]", expectedOutput: "[1,5,2,4,3]" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["linked-lists", "two-pointers"],
    examples: [],
    hints: []
  },
  {
    id: "q_2",
    title: "Add Two Numbers",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order. Add the two numbers and return the sum as a linked list.",
    difficulty: "medium",
    topic: "linked-lists",
    constraints: ["O(N) Time", "Math/Carry Logic"],
    starterCode: "def addTwoNumbers(l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:\\n    pass",
    solution: "def addTwoNumbers(l1, l2):\\n    dummy = ListNode()\\n    curr = dummy\\n    carry = 0\\n    while l1 or l2 or carry:\\n        v1 = l1.val if l1 else 0\\n        v2 = l2.val if l2 else 0\\n        val = v1 + v2 + carry\\n        carry = val // 10\\n        val = val % 10\\n        curr.next = ListNode(val)\\n        curr = curr.next\\n        l1 = l1.next if l1 else None\\n        l2 = l2.next if l2 else None\\n    return dummy.next",
    testCases: [
      { id: "tc_2_1", input: "[2,4,3], [5,6,4]", expectedOutput: "[7,0,8]" },
      { id: "tc_2_2", input: "[0], [0]", expectedOutput: "[0]" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["linked-lists", "math"],
    examples: [],
    hints: []
  },
  {
    id: "q_19",
    title: "Remove Nth Node From End of List",
    description: "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
    difficulty: "medium",
    topic: "linked-lists",
    constraints: ["O(N) Time", "One Pass"],
    starterCode: "def removeNthFromEnd(head: Optional[ListNode], n: int) -> Optional[ListNode]:\\n    pass",
    solution: "def removeNthFromEnd(head, n):\\n    dummy = ListNode(0, head)\\n    left = dummy\\n    right = head\\n    while n > 0 and right:\\n        right = right.next\\n        n -= 1\\n    while right:\\n        left = left.next\\n        right = right.next\\n    left.next = left.next.next\\n    return dummy.next",
    testCases: [
      { id: "tc_19_1", input: "[1,2,3,4,5], 2", expectedOutput: "[1,2,3,5]" },
      { id: "tc_19_2", input: "[1], 1", expectedOutput: "[]" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["linked-lists", "two-pointers"],
    examples: [],
    hints: []
  },
  {
    id: "q_146",
    title: "LRU Cache",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
    difficulty: "medium",
    topic: "linked-lists",
    constraints: ["O(1) Time Operations", "Doubly Linked List + HashMap"],
    starterCode: "class LRUCache:\\n    def __init__(self, capacity: int):\\n        pass\\n\\n    def get(self, key: int) -> int:\\n        pass\\n\\n    def put(self, key: int, value: int) -> None:\\n        pass",
    solution: "class Node:\\n    def __init__(self, key, val):\\n        self.key, self.val = key, val\\n        self.prev = self.next = None\\n\\nclass LRUCache:\\n    def __init__(self, capacity):\\n        self.cap = capacity\\n        self.cache = {}\\n        self.left, self.right = Node(0, 0), Node(0, 0)\\n        self.left.next, self.right.prev = self.right, self.left\\n\\n    def remove(self, node):\\n        prev, nxt = node.prev, node.next\\n        prev.next, nxt.prev = nxt, prev\\n\\n    def insert(self, node):\\n        prev, nxt = self.right.prev, self.right\\n        prev.next = nxt.prev = node\\n        node.next, node.prev = nxt, prev\\n\\n    def get(self, key):\\n        if key in self.cache:\\n            self.remove(self.cache[key])\\n            self.insert(self.cache[key])\\n            return self.cache[key].val\\n        return -1\\n\\n    def put(self, key, value):\\n        if key in self.cache:\\n            self.remove(self.cache[key])\\n        self.cache[key] = Node(key, value)\\n        self.insert(self.cache[key])\\n        if len(self.cache) > self.cap:\\n            lru = self.left.next\\n            self.remove(lru)\\n            del self.cache[lru.key]",
    testCases: [],
    timeComplexity: "O(1)",
    spaceComplexity: "O(n)",
    tags: ["linked-lists", "design"],
    examples: [],
    hints: []
  },
  // ==========================================
  // Module 4: Trees & Graphs Challenges
  // ==========================================
  {
    id: "q_269",
    title: "Alien Dictionary",
    description: "There is a new alien language that uses the English alphabet. Return a string of the unique letters in the new alien language sorted in lexicographically increasing order by the new language's rules.",
    difficulty: "hard",
    topic: "graphs",
    constraints: ["O(C) Time", "Topological Sort"],
    starterCode: "def alienOrder(words: list[str]) -> str:\\n    pass",
    solution: "def alienOrder(words):\\n    adj = {c: set() for w in words for c in w}\\n    for i in range(len(words) - 1):\\n        w1, w2 = words[i], words[i + 1]\\n        minLen = min(len(w1), len(w2))\\n        if len(w1) > len(w2) and w1[:minLen] == w2[:minLen]:\\n            return \"\"\\n        for j in range(minLen):\\n            if w1[j] != w2[j]:\\n                adj[w1[j]].add(w2[j])\\n                break\\n    visit = {}\\n    res = []\\n    def dfs(c):\\n        if c in visit:\\n            return visit[c]\\n        visit[c] = True\\n        for nei in adj[c]:\\n            if dfs(nei):\\n                return True\\n        visit[c] = False\\n        res.append(c)\\n    for c in adj:\\n        if dfs(c):\\n            return \"\"\\n    res.reverse()\\n    return \"\".join(res)",
    testCases: [
      { id: "tc_269_1", input: "['wrt','wrf','er','ett','rftt']", expectedOutput: "'wertf'" },
      { id: "tc_269_2", input: "['z','x']", expectedOutput: "'zx'" }
    ],
    timeComplexity: "O(c)",
    spaceComplexity: "O(1)",
    tags: ["topological-sort", "graphs"],
    examples: [],
    hints: []
  },
  {
    id: "q_126",
    title: "Word Ladder II",
    description: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words. Return all the shortest transformation sequences from beginWord to endWord.",
    difficulty: "hard",
    topic: "graphs",
    constraints: ["O(N*L^2) Time", "BFS + Backtracking"],
    starterCode: "def findLadders(beginWord: str, endWord: str, wordList: list[str]) -> list[list[str]]:\\n    pass",
    solution: "def findLadders(beginWord, endWord, wordList):\\n    wordSet = set(wordList)\\n    if endWord not in wordSet: return []\\n    layer = {beginWord: [[beginWord]]}\\n    while layer:\\n        newLayer = collections.defaultdict(list)\\n        for w in layer:\\n            if w == endWord: return layer[w]\\n            for i in range(len(w)):\\n                for c in 'abcdefghijklmnopqrstuvwxyz':\\n                    nw = w[:i] + c + w[i+1:]\\n                    if nw in wordSet:\\n                        for path in layer[w]:\\n                            newLayer[nw].append(path + [nw])\\n        wordSet -= set(newLayer.keys())\\n        layer = newLayer\\n    return []",
    testCases: [
      { id: "tc_126_1", input: "'hit', 'cog', ['hot','dot','dog','lot','log','cog']", expectedOutput: "[['hit','hot','dot','dog','cog'],['hit','hot','lot','log','cog']]" }
    ],
    timeComplexity: "O(n*l^2)",
    spaceComplexity: "O(n)",
    tags: ["bfs", "backtracking"],
    examples: [],
    hints: []
  },
  {
    id: "q_124",
    title: "Binary Tree Maximum Path Sum",
    description: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. Return the maximum path sum of any non-empty path.",
    difficulty: "hard",
    topic: "trees",
    constraints: ["O(N) Time", "DFS + Global Max"],
    starterCode: "def maxPathSum(root: Optional[TreeNode]) -> int:\\n    pass",
    solution: "def maxPathSum(root):\\n    res = [root.val]\\n    def dfs(root):\\n        if not root: return 0\\n        leftMax = max(dfs(root.left), 0)\\n        rightMax = max(dfs(root.right), 0)\\n        res[0] = max(res[0], root.val + leftMax + rightMax)\\n        return root.val + max(leftMax, rightMax)\\n    dfs(root)\\n    return res[0]",
    testCases: [
      { id: "tc_124_1", input: "[1,2,3]", expectedOutput: "6" },
      { id: "tc_124_2", input: "[-10,9,20,null,null,15,7]", expectedOutput: "42" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    tags: ["trees", "recursion"],
    examples: [],
    hints: []
  },
  {
    id: "q_297",
    title: "Serialize and Deserialize Binary Tree",
    description: "Design an algorithm to serialize and deserialize a binary tree.",
    difficulty: "hard",
    topic: "trees",
    constraints: ["O(N) Time", "Preorder/Level-order"],
    starterCode: "class Codec:\\n    def serialize(self, root):\\n        pass\\n\\n    def deserialize(self, data):\\n        pass",
    solution: "class Codec:\\n    def serialize(self, root):\\n        res = []\\n        def dfs(node):\\n            if not node:\\n                res.append('N')\\n                return\\n            res.append(str(node.val))\\n            dfs(node.left)\\n            dfs(node.right)\\n        dfs(root)\\n        return ','.join(res)\\n\\n    def deserialize(self, data):\\n        vals = data.split(',')\\n        self.i = 0\\n        def dfs():\\n            if vals[self.i] == 'N':\\n                self.i += 1\\n                return None\\n            node = TreeNode(int(vals[self.i]))\\n            self.i += 1\\n            node.left = dfs()\\n            node.right = dfs()\\n            return node\\n        return dfs()",
    testCases: [
      { id: "tc_297_1", input: "[1,2,3,null,null,4,5]", expectedOutput: "[1,2,3,null,null,4,5]" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    tags: ["trees", "design"],
    examples: [],
    hints: []
  },
  {
    id: "q_210",
    title: "Course Schedule II",
    description: "You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return the ordering of courses you should take to finish all courses.",
    difficulty: "medium",
    topic: "graphs",
    constraints: ["O(V+E) Time", "Topological Sort"],
    starterCode: "def findOrder(numCourses: int, prerequisites: list[list[int]]) -> list[int]:\\n    pass",
    solution: "def findOrder(numCourses, prerequisites):\\n    prereq = {c: [] for c in range(numCourses)}\\n    for crs, pre in prerequisites:\\n        prereq[crs].append(pre)\\n    output = []\\n    visit, cycle = set(), set()\\n    def dfs(crs):\\n        if crs in cycle: return False\\n        if crs in visit: return True\\n        cycle.add(crs)\\n        for pre in prereq[crs]:\\n            if not dfs(pre): return False\\n        cycle.remove(crs)\\n        visit.add(crs)\\n        output.append(crs)\\n        return True\\n    for c in range(numCourses):\\n        if not dfs(c): return []\\n    return output",
    testCases: [
      { id: "tc_210_1", input: "2, [[1,0]]", expectedOutput: "[0,1]" },
      { id: "tc_210_2", input: "4, [[1,0],[2,0],[3,1],[3,2]]", expectedOutput: "[0,1,2,3]" }
    ],
    timeComplexity: "O(v+e)",
    spaceComplexity: "O(v+e)",
    tags: ["topological-sort", "graphs"],
    examples: [],
    hints: []
  },
  {
    id: "q_261",
    title: "Graph Valid Tree",
    description: "You are given an integer n and a list of edges. Return true if the edges of the given graph make up a valid tree, and false otherwise.",
    difficulty: "medium",
    topic: "graphs",
    constraints: ["O(V+E) Time", "Union Find / DFS"],
    starterCode: "def validTree(n: int, edges: list[list[int]]) -> bool:\\n    pass",
    solution: "def validTree(n, edges):\\n    if not n: return True\\n    adj = {i: [] for i in range(n)}\\n    for n1, n2 in edges:\\n        adj[n1].append(n2)\\n        adj[n2].append(n1)\\n    visit = set()\\n    def dfs(i, prev):\\n        if i in visit: return False\\n        visit.add(i)\\n        for j in adj[i]:\\n            if j == prev: continue\\n            if not dfs(j, i): return False\\n        return True\\n    return dfs(0, -1) and n == len(visit)",
    testCases: [
      { id: "tc_261_1", input: "5, [[0,1],[0,2],[0,3],[1,4]]", expectedOutput: "True" },
      { id: "tc_261_2", input: "5, [[0,1],[1,2],[2,3],[1,3],[1,4]]", expectedOutput: "False" }
    ],
    timeComplexity: "O(v+e)",
    spaceComplexity: "O(v+e)",
    tags: ["union-find", "graphs"],
    examples: [],
    hints: []
  },
  {
    id: "q_787",
    title: "Cheapest Flights Within K Stops",
    description: "Return the cheapest price from src to dst with at most k stops. If there is no such route, return -1.",
    difficulty: "medium",
    topic: "graphs",
    constraints: ["O((V+E)K) Time", "Bellman-Ford / BFS"],
    starterCode: "def findCheapestPrice(n: int, flights: list[list[int]], src: int, dst: int, k: int) -> int:\\n    pass",
    solution: "def findCheapestPrice(n, flights, src, dst, k):\\n    prices = [float('inf')] * n\\n    prices[src] = 0\\n    for i in range(k + 1):\\n        tmpPrices = list(prices)\\n        for s, d, p in flights:\\n            if prices[s] == float('inf'):\\n                continue\\n            if prices[s] + p < tmpPrices[d]:\\n                tmpPrices[d] = prices[s] + p\\n        prices = tmpPrices\\n    return -1 if prices[dst] == float('inf') else prices[dst]",
    testCases: [
      { id: "tc_787_1", input: "3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 1", expectedOutput: "200" }
    ],
    timeComplexity: "O(k*e)",
    spaceComplexity: "O(n)",
    tags: ["graphs", "bellman-ford"],
    examples: [],
    hints: []
  },
  {
    id: "q_105",
    title: "Construct Binary Tree from Preorder and Inorder Traversal",
    description: "Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.",
    difficulty: "medium",
    topic: "trees",
    constraints: ["O(N) Time", "Recursive Partitioning"],
    starterCode: "def buildTree(preorder: list[int], inorder: list[int]) -> Optional[TreeNode]:\\n    pass",
    solution: "def buildTree(preorder, inorder):\\n    if not preorder or not inorder: return None\\n    root = TreeNode(preorder[0])\\n    mid = inorder.index(preorder[0])\\n    root.left = buildTree(preorder[1:mid+1], inorder[:mid])\\n    root.right = buildTree(preorder[mid+1:], inorder[mid+1:])\\n    return root",
    testCases: [
      { id: "tc_105_1", input: "[3,9,20,15,7], [9,3,15,20,7]", expectedOutput: "[3,9,20,null,null,15,7]" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    tags: ["trees", "recursion"],
    examples: [],
    hints: []
  },
  {
    id: "q_332",
    title: "Reconstruct Itinerary",
    description: "Reconstruct the itinerary in order and return it. The itinerary must begin with 'JFK'.",
    difficulty: "hard",
    topic: "graphs",
    constraints: ["O(E log E) Time", "Eulerian Path"],
    starterCode: "def findItinerary(tickets: list[list[str]]) -> list[str]:\\n    pass",
    solution: "def findItinerary(tickets):\\n    adj = {src: [] for src, dst in tickets}\\n    tickets.sort()\\n    for src, dst in tickets:\\n        adj[src] = adj.get(src, []) + [dst]\\n    res = []\\n    def dfs(src):\\n        while src in adj and len(adj[src]) > 0:\\n            v = adj[src].pop(0)\\n            dfs(v)\\n        res.append(src)\\n    dfs('JFK')\\n    return res[::-1]",
    testCases: [
      { id: "tc_332_1", input: "[['MUC','LHR'],['JFK','MUC'],['SFO','SJC'],['LHR','SFO']]", expectedOutput: "['JFK','MUC','LHR','SFO','SJC']" }
    ],
    timeComplexity: "O(e log e)",
    spaceComplexity: "O(v+e)",
    tags: ["graphs", "dfs"],
    examples: [],
    hints: []
  },
  {
    id: "q_236",
    title: "Lowest Common Ancestor of a Binary Tree",
    description: "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.",
    difficulty: "medium",
    topic: "trees",
    constraints: ["O(N) Time", "Recursive DFS"],
    starterCode: "def lowestCommonAncestor(root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':\\n    pass",
    solution: "def lowestCommonAncestor(root, p, q):\\n    if not root or root == p or root == q: return root\\n    l = lowestCommonAncestor(root.left, p, q)\\n    r = lowestCommonAncestor(root.right, p, q)\\n    if l and r: return root\\n    return l or r",
    testCases: [
      { id: "tc_236_1", input: "[3,5,1,6,2,0,8,null,null,7,4], 5, 1", expectedOutput: "3" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    tags: ["trees", "recursion"],
    examples: [],
    hints: []
  },

  // ==========================================
  // Module 5: DP & Recursion Challenges
  // ==========================================
  {
    id: "q_72",
    title: "Edit Distance",
    description: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.",
    difficulty: "hard",
    topic: "dynamic-programming",
    constraints: ["O(M*N) Time", "2D DP"],
    starterCode: "def minDistance(word1: str, word2: str) -> int:\\n    pass",
    solution: "def minDistance(word1, word2):\\n    cache = [[float('inf')] * (len(word2) + 1) for i in range(len(word1) + 1)]\\n    for j in range(len(word2) + 1):\\n        cache[len(word1)][j] = len(word2) - j\\n    for i in range(len(word1) + 1):\\n        cache[i][len(word2)] = len(word1) - i\\n    for i in range(len(word1) - 1, -1, -1):\\n        for j in range(len(word2) - 1, -1, -1):\\n            if word1[i] == word2[j]:\\n                cache[i][j] = cache[i + 1][j + 1]\\n            else:\\n                cache[i][j] = 1 + min(cache[i + 1][j], cache[i][j + 1], cache[i + 1][j + 1])\\n    return cache[0][0]",
    testCases: [
      { id: "tc_72_1", input: "'horse', 'ros'", expectedOutput: "3" }
    ],
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
    tags: ["dynamic-programming", "strings"],
    examples: [],
    hints: []
  },
  {
    id: "q_312",
    title: "Burst Balloons",
    description: "Return the maximum coins you can collect by bursting the balloons wisely.",
    difficulty: "hard",
    topic: "dynamic-programming",
    constraints: ["O(N^3) Time", "Interval DP"],
    starterCode: "def maxCoins(nums: list[int]) -> int:\\n    pass",
    solution: "def maxCoins(nums):\\n    nums = [1] + nums + [1]\\n    dp = {}\\n    def dfs(l, r):\\n        if l > r: return 0\\n        if (l, r) in dp: return dp[(l, r)]\\n        dp[(l, r)] = 0\\n        for i in range(l, r + 1):\\n            coins = nums[l - 1] * nums[i] * nums[r + 1]\\n            coins += dfs(l, i - 1) + dfs(i + 1, r)\\n            dp[(l, r)] = max(dp[(l, r)], coins)\\n        return dp[(l, r)]\\n    return dfs(1, len(nums) - 2)",
    testCases: [
      { id: "tc_312_1", input: "[3,1,5,8]", expectedOutput: "167" }
    ],
    timeComplexity: "O(n^3)",
    spaceComplexity: "O(n^2)",
    tags: ["dynamic-programming", "divide-and-conquer"],
    examples: [],
    hints: []
  },
  {
    id: "q_322",
    title: "Coin Change",
    description: "Return the fewest number of coins that you need to make up that amount.",
    difficulty: "medium",
    topic: "dynamic-programming",
    constraints: ["O(A*N) Time", "Unbounded Knapsack"],
    starterCode: "def coinChange(coins: list[int], amount: int) -> int:\\n    pass",
    solution: "def coinChange(coins, amount):\\n    dp = [amount + 1] * (amount + 1)\\n    dp[0] = 0\\n    for a in range(1, amount + 1):\\n        for c in coins:\\n            if a - c >= 0:\\n                dp[a] = min(dp[a], 1 + dp[a - c])\\n    return dp[amount] if dp[amount] != amount + 1 else -1",
    testCases: [
      { id: "tc_322_1", input: "[1,2,5], 11", expectedOutput: "3" },
      { id: "tc_322_2", input: "[2], 3", expectedOutput: "-1" }
    ],
    timeComplexity: "O(a*n)",
    spaceComplexity: "O(a)",
    tags: ["dynamic-programming", "arrays"],
    examples: [],
    hints: []
  },
  {
    id: "q_300",
    title: "Longest Increasing Subsequence",
    description: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    difficulty: "medium",
    topic: "dynamic-programming",
    constraints: ["O(N log N) Time", "Patience Sorting / DP"],
    starterCode: "def lengthOfLIS(nums: list[int]) -> int:\\n    pass",
    solution: "def lengthOfLIS(nums):\\n    LIS = [1] * len(nums)\\n    for i in range(len(nums) - 1, -1, -1):\\n        for j in range(i + 1, len(nums)):\\n            if nums[i] < nums[j]:\\n                LIS[i] = max(LIS[i], 1 + LIS[j])\\n    return max(LIS) if nums else 0",
    testCases: [
      { id: "tc_300_1", input: "[10,9,2,5,3,7,101,18]", expectedOutput: "4" }
    ],
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(n)",
    tags: ["dynamic-programming", "arrays"],
    examples: [],
    hints: []
  },
  {
    id: "q_139",
    title: "Word Break",
    description: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
    difficulty: "medium",
    topic: "dynamic-programming",
    constraints: ["O(N^2) Time", "1D DP + Set"],
    starterCode: "def wordBreak(s: str, wordDict: list[str]) -> bool:\\n    pass",
    solution: "def wordBreak(s, wordDict):\\n    dp = [False] * (len(s) + 1)\\n    dp[len(s)] = True\\n    for i in range(len(s) - 1, -1, -1):\\n        for w in wordDict:\\n            if (i + len(w)) <= len(s) and s[i : i + len(w)] == w:\\n                dp[i] = dp[i + len(w)]\\n            if dp[i]:\\n                break\\n    return dp[0]",
    testCases: [
      { id: "tc_139_1", input: "'leetcode', ['leet','code']", expectedOutput: "True" }
    ],
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(n)",
    tags: ["dynamic-programming", "trie"],
    examples: [],
    hints: []
  },
  {
    id: "q_152",
    title: "Maximum Product Subarray",
    description: "Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product, and return the product.",
    difficulty: "medium",
    topic: "dynamic-programming",
    constraints: ["O(N) Time", "Tracking Min & Max"],
    starterCode: "def maxProduct(nums: list[int]) -> int:\\n    pass",
    solution: "def maxProduct(nums):\\n    res = max(nums)\\n    curMin, curMax = 1, 1\\n    for n in nums:\\n        tmp = curMax * n\\n        curMax = max(n * curMax, n * curMin, n)\\n        curMin = min(tmp, n * curMin, n)\\n        res = max(res, curMax)\\n    return res",
    testCases: [
      { id: "tc_152_1", input: "[2,3,-2,4]", expectedOutput: "6" },
      { id: "tc_152_2", input: "[-2,0,-1]", expectedOutput: "0" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["dynamic-programming", "arrays"],
    examples: [],
    hints: []
  },
  {
    id: "q_1143",
    title: "Longest Common Subsequence",
    description: "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.",
    difficulty: "medium",
    topic: "dynamic-programming",
    constraints: ["O(M*N) Time", "2D DP"],
    starterCode: "def longestCommonSubsequence(text1: str, text2: str) -> int:\\n    pass",
    solution: "def longestCommonSubsequence(text1, text2):\\n    dp = [[0 for j in range(len(text2) + 1)] for i in range(len(text1) + 1)]\\n    for i in range(len(text1) - 1, -1, -1):\\n        for j in range(len(text2) - 1, -1, -1):\\n            if text1[i] == text2[j]:\\n                dp[i][j] = 1 + dp[i + 1][j + 1]\\n            else:\\n                dp[i][j] = max(dp[i][j + 1], dp[i + 1][j])\\n    return dp[0][0]",
    testCases: [
      { id: "tc_1143_1", input: "'abcde', 'ace'", expectedOutput: "3" }
    ],
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
    tags: ["dynamic-programming", "strings"],
    examples: [],
    hints: []
  },
  {
    id: "q_647",
    title: "Palindromic Substrings",
    description: "Given a string s, return the number of palindromic substrings in it.",
    difficulty: "medium",
    topic: "dynamic-programming",
    constraints: ["O(N^2) Time", "Expand from Center"],
    starterCode: "def countSubstrings(s: str) -> int:\\n    pass",
    solution: "def countSubstrings(s):\\n    res = 0\\n    for i in range(len(s)):\\n        res += countPali(s, i, i)\\n        res += countPali(s, i, i + 1)\\n    return res\\n\\ndef countPali(s, l, r):\\n    res = 0\\n    while l >= 0 and r < len(s) and s[l] == s[r]:\\n        res += 1\\n        l -= 1\\n        r += 1\\n    return res",
    testCases: [
      { id: "tc_647_1", input: "'abc'", expectedOutput: "3" },
      { id: "tc_647_2", input: "'aaa'", expectedOutput: "6" }
    ],
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(1)",
    tags: ["dynamic-programming", "strings"],
    examples: [],
    hints: []
  },
  {
    id: "q_97",
    title: "Interleaving String",
    description: "Given strings s1, s2, and s3, find whether s3 is formed by an interleaving of s1 and s2.",
    difficulty: "medium",
    topic: "dynamic-programming",
    constraints: ["O(M*N) Time", "2D DP"],
    starterCode: "def isInterleave(s1: str, s2: str, s3: str) -> bool:\\n    pass",
    solution: "def isInterleave(s1, s2, s3):\\n    if len(s1) + len(s2) != len(s3): return False\\n    dp = [[False] * (len(s2) + 1) for i in range(len(s1) + 1)]\\n    dp[len(s1)][len(s2)] = True\\n    for i in range(len(s1), -1, -1):\\n        for j in range(len(s2), -1, -1):\\n            if i < len(s1) and s1[i] == s3[i + j] and dp[i + 1][j]:\\n                dp[i][j] = True\\n            if j < len(s2) and s2[j] == s3[i + j] and dp[i][j + 1]:\\n                dp[i][j] = True\\n    return dp[0][0]",
    testCases: [
      { id: "tc_97_1", input: "'aabcc', 'dbbca', 'aadbbcbcac'", expectedOutput: "True" },
      { id: "tc_97_2", input: "'aabcc', 'dbbca', 'aadbbbaccc'", expectedOutput: "False" }
    ],
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
    tags: ["dynamic-programming", "strings"],
    examples: [],
    hints: []
  },
  {
    id: "q_494",
    title: "Target Sum",
    description: "Return the number of different expressions that you can build, which evaluates to target.",
    difficulty: "medium",
    topic: "dynamic-programming",
    constraints: ["O(T*N) Time", "0/1 Knapsack Variant"],
    starterCode: "def findTargetSumWays(nums: list[int], target: int) -> int:\\n    pass",
    solution: "def findTargetSumWays(nums, target):\\n    dp = {}\\n    def backtrack(i, total):\\n        if i == len(nums):\\n            return 1 if total == target else 0\\n        if (i, total) in dp:\\n            return dp[(i, total)]\\n        dp[(i, total)] = backtrack(i + 1, total + nums[i]) + backtrack(i + 1, total - nums[i])\\n        return dp[(i, total)]\\n    return backtrack(0, 0)",
    testCases: [
      { id: "tc_494_1", input: "[1,1,1,1,1], 3", expectedOutput: "5" }
    ],
    timeComplexity: "O(t*n)",
    spaceComplexity: "O(t*n)",
    tags: ["dynamic-programming", "backtracking"],
    examples: [],
    hints: []
  },
  // ==========================================
  // Module 6: Heaps & Intervals Challenges
  // ==========================================
  {
    id: "q_295",
    title: "Find Median from Data Stream",
    description: "The median is the middle value in an ordered integer list. Implement the MedianFinder class.",
    difficulty: "hard",
    topic: "heaps",
    constraints: ["O(log N) Time", "Two Heaps"],
    starterCode: "class MedianFinder:\\n    def __init__(self):\\n        pass\\n\\n    def addNum(self, num: int) -> None:\\n        pass\\n\\n    def findMedian(self) -> float:\\n        pass",
    solution: "class MedianFinder:\\n    def __init__(self):\\n        self.small = []  # max heap\\n        self.large = []  # min heap\\n\\n    def addNum(self, num):\\n        if self.large and num > self.large[0]:\\n            heapq.heappush(self.large, num)\\n        else:\\n            heapq.heappush(self.small, -1 * num)\\n        if len(self.small) > len(self.large) + 1:\\n            val = -1 * heapq.heappop(self.small)\\n            heapq.heappush(self.large, val)\\n        if len(self.large) > len(self.small) + 1:\\n            val = heapq.heappop(self.large)\\n            heapq.heappush(self.small, -1 * val)\\n\\n    def findMedian(self):\\n        if len(self.small) > len(self.large):\\n            return -1 * self.small[0]\\n        elif len(self.large) > len(self.small):\\n            return self.large[0]\\n        return (-1 * self.small[0] + self.large[0]) / 2.0",
    testCases: [],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(n)",
    tags: ["heaps", "design"],
    examples: [],
    hints: []
  },
  {
    id: "q_253",
    title: "Meeting Rooms II",
    description: "Given an array of meeting time intervals intervals where intervals[i] = [starti, endi], return the minimum number of conference rooms required.",
    difficulty: "medium",
    topic: "arrays",
    constraints: ["O(N log N) Time", "Min-Heap / Sweep Line"],
    starterCode: "def minMeetingRooms(intervals: list[list[int]]) -> int:\\n    pass",
    solution: "def minMeetingRooms(intervals):\\n    start = sorted([i[0] for i in intervals])\\n    end = sorted([i[1] for i in intervals])\\n    res, count = 0, 0\\n    s, e = 0, 0\\n    while s < len(intervals):\\n        if start[s] < end[e]:\\n            s += 1\\n            count += 1\\n        else:\\n            e += 1\\n            count -= 1\\n        res = max(res, count)\\n    return res",
    testCases: [
      { id: "tc_253_1", input: "[[0,30],[5,10],[15,20]]", expectedOutput: "2" },
      { id: "tc_253_2", input: "[[7,10],[2,4]]", expectedOutput: "1" }
    ],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    tags: ["intervals", "heaps"],
    examples: [],
    hints: []
  },
  {
    id: "q_218",
    title: "The Skyline Problem",
    description: "A city's skyline is the outer contour of the silhouette formed by all the buildings in that city when viewed from a distance. Return the skyline format.",
    difficulty: "hard",
    topic: "heaps",
    constraints: ["O(N log N) Time", "Heap + Sweep Line"],
    starterCode: "def getSkyline(buildings: list[list[int]]) -> list[list[int]]:\\n    pass",
    solution: "def getSkyline(buildings):\\n    events = [(L, -H, R) for L, R, H in buildings]\\n    events += list({(R, 0, 0) for _, R, _ in buildings})\\n    events.sort()\\n    res = [[0, 0]]\\n    live = [(0, float('inf'))]\\n    for pos, negH, R in events:\\n        while live[0][1] <= pos: heapq.heappop(live)\\n        if negH: heapq.heappush(live, (negH, R))\\n        if res[-1][1] != -live[0][0]:\\n            res.append([pos, -live[0][0]])\\n    return res[1:]",
    testCases: [
      { id: "tc_218_1", input: "[[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]", expectedOutput: "[[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]" }
    ],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    tags: ["heaps", "divide-and-conquer"],
    examples: [],
    hints: []
  },
  {
    id: "q_480",
    title: "Sliding Window Median",
    description: "The median is the middle value in an ordered integer list. Given an array nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position. Return the median array for each window in the original array.",
    difficulty: "hard",
    topic: "heaps",
    constraints: ["O(N log K) Time", "Two Heaps / BST"],
    starterCode: "def medianSlidingWindow(nums: list[int], k: int) -> list[float]:\\n    pass",
    solution: "def medianSlidingWindow(nums, k):\\n    small, large = [], []\\n    for i, x in enumerate(nums[:k]): \\n        heapq.heappush(small, (-x, i))\\n    for _ in range(k - k // 2): \\n        x, i = heapq.heappop(small)\\n        heapq.heappush(large, (-x, i))\\n    ans = [large[0][0] if k % 2 else (large[0][0] - small[0][0]) / 2]\\n    for i, x in enumerate(nums[k:]):\\n        if x >= large[0][0]:\\n            heapq.heappush(large, (x, i + k))\\n            if nums[i] <= large[0][0]:\\n                 x, idx = heapq.heappop(large)\\n                 heapq.heappush(small, (-x, idx))\\n        else:\\n            heapq.heappush(small, (-x, i + k))\\n            if nums[i] >= large[0][0]:\\n                 x, idx = heapq.heappop(small)\\n                 heapq.heappush(large, (-x, idx))\\n        while small and small[0][1] <= i: heapq.heappop(small)\\n        while large and large[0][1] <= i: heapq.heappop(large)\\n        ans.append(large[0][0] if k % 2 else (large[0][0] - small[0][0]) / 2)\\n    return ans",
    testCases: [
      { id: "tc_480_1", input: "[1,3,-1,-3,5,3,6,7], 3", expectedOutput: "[1.00000,-1.00000,-1.00000,3.00000,5.00000,6.00000]" }
    ],
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)",
    tags: ["heaps", "sliding-window"],
    examples: [],
    hints: []
  },
  {
    id: "q_621",
    title: "Task Scheduler",
    description: "Given a characters array tasks, representing the tasks a CPU needs to do, where each letter represents a different task. Tasks could be done in any order. Each task is done in one unit of time. For each unit of time, the CPU could complete either one task or just be idle. However, there is a non-negative integer n that represents the cooldown period between two same tasks (the same letter in the array), that is that there must be at least n units of time between any two same tasks. Return the least number of units of times that the CPU will take to finish all the given tasks.",
    difficulty: "medium",
    topic: "heaps",
    constraints: ["O(N) Time", "Priority Queue / Math"],
    starterCode: "def leastInterval(tasks: list[str], n: int) -> int:\\n    pass",
    solution: "def leastInterval(tasks, n):\\n    count = collections.Counter(tasks)\\n    maxHeap = [-cnt for cnt in count.values()]\\n    heapq.heapify(maxHeap)\\n    time = 0\\n    q = collections.deque()\\n    while maxHeap or q:\\n        time += 1\\n        if maxHeap:\\n            cnt = 1 + heapq.heappop(maxHeap)\\n            if cnt:\\n                q.append([cnt, time + n])\\n        if q and q[0][1] == time:\\n            heapq.heappush(maxHeap, q.popleft()[0])\\n    return time",
    testCases: [
      { id: "tc_621_1", input: "['A','A','A','B','B','B'], 2", expectedOutput: "8" },
      { id: "tc_621_2", input: "['A','A','A','B','B','B'], 0", expectedOutput: "6" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["heaps", "greedy"],
    examples: [],
    hints: []
  },
  {
    id: "q_56",
    title: "Merge Intervals",
    description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    difficulty: "medium",
    topic: "arrays",
    constraints: ["O(N log N) Time", "Sorting"],
    starterCode: "def merge(intervals: list[list[int]]) -> list[list[int]]:\\n    pass",
    solution: "def merge(intervals):\\n    intervals.sort(key=lambda i: i[0])\\n    output = [intervals[0]]\\n    for start, end in intervals[1:]:\\n        lastEnd = output[-1][1]\\n        if start <= lastEnd:\\n            output[-1][1] = max(lastEnd, end)\\n        else:\\n            output.append([start, end])\\n    return output",
    testCases: [
      { id: "tc_56_1", input: "[[1,3],[2,6],[8,10],[15,18]]", expectedOutput: "[[1,6],[8,10],[15,18]]" }
    ],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    tags: ["intervals", "sorting"],
    examples: [],
    hints: []
  },
  {
    id: "q_435",
    title: "Non-overlapping Intervals",
    description: "Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.",
    difficulty: "medium",
    topic: "arrays",
    constraints: ["O(N log N) Time", "Greedy Interval Scheduling"],
    starterCode: "def eraseOverlapIntervals(intervals: list[list[int]]) -> int:\\n    pass",
    solution: "def eraseOverlapIntervals(intervals):\\n    intervals.sort(key=lambda x: x[1])\\n    end = intervals[0][1]\\n    count = 0\\n    for i in range(1, len(intervals)):\\n        if intervals[i][0] < end:\\n            count += 1\\n        else:\\n            end = intervals[i][1]\\n    return count",
    testCases: [
      { id: "tc_435_1", input: "[[1,2],[2,3],[3,4],[1,3]]", expectedOutput: "1" }
    ],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    tags: ["intervals", "greedy"],
    examples: [],
    hints: []
  },
  {
    id: "q_502",
    title: "IPO",
    description: "Suppose LeetCode will start its IPO soon. In order to sell a good price of its shares to Venture Capital, LeetCode would like to work on some projects to increase its capital before the IPO. Since it has limited resources, it can only finish at most k distinct projects before the IPO. Help LeetCode design the best way to maximize its total capital after finishing at most k distinct projects.",
    difficulty: "hard",
    topic: "heaps",
    constraints: ["O(N log N) Time", "Two Heaps / Greedy"],
    starterCode: "def findMaximizedCapital(k: int, w: int, profits: list[int], capital: list[int]) -> int:\\n    pass",
    solution: "def findMaximizedCapital(k, w, profits, capital):\\n    maxProfit = []\\n    minCapital = [(c, p) for c, p in zip(capital, profits)]\\n    heapq.heapify(minCapital)\\n    for i in range(k):\\n        while minCapital and minCapital[0][0] <= w:\\n            c, p = heapq.heappop(minCapital)\\n            heapq.heappush(maxProfit, -1 * p)\\n        if not maxProfit:\\n            break\\n        w += -1 * heapq.heappop(maxProfit)\\n    return w",
    testCases: [
      { id: "tc_502_1", input: "2, 0, [1,2,3], [0,1,1]", expectedOutput: "4" }
    ],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    tags: ["heaps", "greedy"],
    examples: [],
    hints: []
  },
  {
    id: "q_347",
    title: "Top K Frequent Elements",
    description: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
    difficulty: "medium",
    topic: "heaps",
    constraints: ["O(N log K) or O(N) Time", "Heap / Bucket Sort"],
    starterCode: "def topKFrequent(nums: list[int], k: int) -> list[int]:\\n    pass",
    solution: "def topKFrequent(nums, k):\\n    count = collections.Counter(nums)\\n    heap = []\\n    for num, freq in count.items():\\n        heapq.heappush(heap, (freq, num))\\n        if len(heap) > k:\\n            heapq.heappop(heap)\\n    return [num for freq, num in heap]",
    testCases: [
      { id: "tc_347_1", input: "[1,1,1,2,2,3], 2", expectedOutput: "[1,2]" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    tags: ["heaps", "hash-maps"],
    examples: [],
    hints: []
  },
  {
    id: "q_57",
    title: "Insert Interval",
    description: "You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] represent the start and the end of the ith interval and intervals is sorted in ascending order by starti. You are also given an interval newInterval = [start, end] that represents the start and end of another interval. Insert newInterval into intervals such that intervals is still sorted in ascending order by starti and intervals still does not have any overlapping intervals (merge overlapping intervals if necessary).",
    difficulty: "medium",
    topic: "arrays",
    constraints: ["O(N) Time", "Linear Scan"],
    starterCode: "def insert(intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:\\n    pass",
    solution: "def insert(intervals, newInterval):\\n    res = []\\n    for i in range(len(intervals)):\\n        if newInterval[1] < intervals[i][0]:\\n            res.append(newInterval)\\n            return res + intervals[i:]\\n        elif newInterval[0] > intervals[i][1]:\\n            res.append(intervals[i])\\n        else:\\n            newInterval = [min(newInterval[0], intervals[i][0]), max(newInterval[1], intervals[i][1])]\\n    res.append(newInterval)\\n    return res",
    testCases: [
      { id: "tc_57_1", input: "[[1,3],[6,9]], [2,5]", expectedOutput: "[[1,5],[6,9]]" }
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    tags: ["intervals", "arrays"],
    examples: [],
    hints: []
  },

  // ==========================================
  // Module 7: Design & Tries Challenges
  // ==========================================
  {
    id: "q_212",
    title: "Word Search II",
    description: "Given an m x n board of characters and a list of strings words, return all words on the board.",
    difficulty: "hard",
    topic: "strings",
    constraints: ["O(M*N*4^L) Time", "Trie + Backtracking"],
    starterCode: "def findWords(board: list[list[str]], words: list[str]) -> list[str]:\\n    pass",
    solution: "def findWords(board, words):\\n    class TrieNode:\\n        def __init__(self):\\n            self.children, self.isWord = {}, False\\n        def addWord(self, word):\\n            cur = self\\n            for c in word:\\n                if c not in cur.children: cur.children[c] = TrieNode()\\n                cur = cur.children[c]\\n            cur.isWord = True\\n    root = TrieNode()\\n    for w in words: root.addWord(w)\\n    ROWS, COLS = len(board), len(board[0])\\n    res, visit = set(), set()\\n    def dfs(r, c, node, word):\\n        if r < 0 or c < 0 or r == ROWS or c == COLS or (r, c) in visit or board[r][c] not in node.children:\\n            return\\n        visit.add((r, c))\\n        node = node.children[board[r][c]]\\n        word += board[r][c]\\n        if node.isWord:\\n            res.add(word)\\n        dfs(r + 1, c, node, word)\\n        dfs(r - 1, c, node, word)\\n        dfs(r, c + 1, node, word)\\n        dfs(r, c - 1, node, word)\\n        visit.remove((r, c))\\n    for r in range(ROWS):\\n        for c in range(COLS):\\n            dfs(r, c, root, '')\\n    return list(res)",
    testCases: [
      { id: "tc_212_1", input: "[['o','a','a','n'],['e','t','a','e'],['i','h','k','r'],['i','f','l','v']], ['oath','pea','eat','rain']", expectedOutput: "['oath','eat']" }
    ],
    timeComplexity: "O(m*n*4^l)",
    spaceComplexity: "O(n)",
    tags: ["trie", "backtracking"],
    examples: [],
    hints: []
  },
  {
    id: "q_208",
    title: "Implement Trie (Prefix Tree)",
    description: "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement the Trie class.",
    difficulty: "medium",
    topic: "strings",
    constraints: ["O(L) Time", "Design"],
    starterCode: "class Trie:\\n    def __init__(self):\\n        pass\\n\\n    def insert(self, word: str) -> None:\\n        pass\\n\\n    def search(self, word: str) -> bool:\\n        pass\\n\\n    def startsWith(self, prefix: str) -> bool:\\n        pass",
    solution: "class TrieNode:\\n    def __init__(self):\\n        self.children = {}\\n        self.endOfWord = False\\n\\nclass Trie:\\n    def __init__(self):\\n        self.root = TrieNode()\\n\\n    def insert(self, word):\\n        cur = self.root\\n        for c in word:\\n            if c not in cur.children:\\n                cur.children[c] = TrieNode()\\n            cur = cur.children[c]\\n        cur.endOfWord = True\\n\\n    def search(self, word):\\n        cur = self.root\\n        for c in word:\\n            if c not in cur.children:\\n                return False\\n            cur = cur.children[c]\\n        return cur.endOfWord\\n\\n    def startsWith(self, prefix):\\n        cur = self.root\\n        for c in prefix:\\n            if c not in cur.children:\\n                return False\\n            cur = cur.children[c]\\n        return True",
    testCases: [],
    timeComplexity: "O(l)",
    spaceComplexity: "O(n*l)",
    tags: ["trie", "design"],
    examples: [],
    hints: []
  },
  {
    id: "q_642",
    title: "Design Search Autocomplete System",
    description: "Design a search autocomplete system for a search engine.",
    difficulty: "hard",
    topic: "trie",
    constraints: ["O(L) Time", "Trie + Heap"],
    starterCode: "class AutocompleteSystem:\\n    def __init__(self, sentences: list[str], times: list[int]):\\n        pass\\n\\n    def input(self, c: str) -> list[str]:\\n        pass",
    solution: "class AutocompleteSystem:\\n    def __init__(self, sentences, times):\\n        self.lookup = {}\\n        for s, t in zip(sentences, times):\\n            self.lookup[s] = t\\n        self.keyword = ''\\n\\n    def input(self, c):\\n        if c == '#':\\n            self.lookup[self.keyword] = self.lookup.get(self.keyword, 0) + 1\\n            self.keyword = ''\\n            return []\\n        self.keyword += c\\n        res = []\\n        for s, t in self.lookup.items():\\n            if s.startswith(self.keyword):\\n                heapq.heappush(res, (-t, s))\\n        return [s for t, s in heapq.nsmallest(3, res)]",
    testCases: [],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    tags: ["design", "trie"],
    examples: [],
    hints: []
  },
  {
    id: "q_460",
    title: "LFU Cache",
    description: "Design and implement a data structure for a Least Frequently Used (LFU) cache.",
    difficulty: "hard",
    topic: "linked-lists",
    constraints: ["O(1) Time", "2 HashMaps + DL lists"],
    starterCode: "class LFUCache:\\n    def __init__(self, capacity: int):\\n        pass\\n\\n    def get(self, key: int) -> int:\\n        pass\\n\\n    def put(self, key: int, value: int) -> None:\\n        pass",
    solution: "class LFUCache:\\n    def __init__(self, capacity):\\n        self.capacity = capacity\\n        self.key2val = {}\\n        self.key2freq = {}\\n        self.freq2keys = collections.defaultdict(list)\\n        self.minFreq = 0\\n\\n    def get(self, key):\\n        if key not in self.key2val: return -1\\n        val = self.key2val[key]\\n        freq = self.key2freq[key]\\n        self.freq2keys[freq].remove(key)\\n        if not self.freq2keys[freq]:\\n             del self.freq2keys[freq]\\n             if self.minFreq == freq: self.minFreq += 1\\n        self.key2freq[key] += 1\\n        self.freq2keys[freq + 1].append(key)\\n        return val\\n\\n    def put(self, key, value):\\n        if not self.capacity: return\\n        if key in self.key2val:\\n            self.key2val[key] = value\\n            self.get(key)\\n            return\\n        if len(self.key2val) == self.capacity:\\n            k = self.freq2keys[self.minFreq].pop(0)\\n            del self.key2val[k]\\n            del self.key2freq[k]\\n        self.key2val[key] = value\\n        self.key2freq[key] = 1\\n        self.freq2keys[1].append(key)\\n        self.minFreq = 1",
    testCases: [],
    timeComplexity: "O(1)",
    spaceComplexity: "O(n)",
    tags: ["design", "linked-lists"],
    examples: [],
    hints: []
  },
  {
    id: "q_380",
    title: "Insert Delete GetRandom O(1)",
    description: "Implement the RandomizedSet class.",
    difficulty: "medium",
    topic: "arrays",
    constraints: ["O(1) Time", "Map + Array"],
    starterCode: "class RandomizedSet:\\n    def __init__(self):\\n        pass\\n\\n    def insert(self, val: int) -> bool:\\n        pass\\n\\n    def remove(self, val: int) -> bool:\\n        pass\\n\\n    def getRandom(self) -> int:\\n        pass",
    solution: "class RandomizedSet:\\n    def __init__(self):\\n        self.numMap = {}\\n        self.numList = []\\n\\n    def insert(self, val):\\n        if val in self.numMap: return False\\n        self.numMap[val] = len(self.numList)\\n        self.numList.append(val)\\n        return True\\n\\n    def remove(self, val):\\n        if val not in self.numMap: return False\\n        idx = self.numMap[val]\\n        lastVal = self.numList[-1]\\n        self.numList[idx] = lastVal\\n        self.numMap[lastVal] = idx\\n        self.numList.pop()\\n        del self.numMap[val]\\n        return True\\n\\n    def getRandom(self):\\n        return random.choice(self.numList)",
    testCases: [],
    timeComplexity: "O(1)",
    spaceComplexity: "O(n)",
    tags: ["design", "math"],
    examples: [],
    hints: []
  },
  {
    id: "q_211",
    title: "Design Add and Search Words Data Structure",
    description: "Design a data structure that supports adding new words and finding if a string matches any previously added string.",
    difficulty: "medium",
    topic: "strings",
    constraints: ["O(L) / O(26^L) Time", "Trie / DFS"],
    starterCode: "class WordDictionary:\\n    def __init__(self):\\n        pass\\n\\n    def addWord(self, word: str) -> None:\\n        pass\\n\\n    def search(self, word: str) -> bool:\\n        pass",
    solution: "class TrieNode:\\n    def __init__(self):\\n        self.children = {}\\n        self.word = False\\n\\nclass WordDictionary:\\n    def __init__(self):\\n        self.root = TrieNode()\\n\\n    def addWord(self, word):\\n        cur = self.root\\n        for c in word:\\n            if c not in cur.children: cur.children[c] = TrieNode()\\n            cur = cur.children[c]\\n        cur.word = True\\n\\n    def search(self, word):\\n        def dfs(j, root):\\n             cur = root\\n             for i in range(j, len(word)):\\n                 c = word[i]\\n                 if c == '.':\\n                     for child in cur.children.values():\\n                         if dfs(i + 1, child): return True\\n                     return False\\n                 else:\\n                     if c not in cur.children: return False\\n                     cur = cur.children[c]\\n             return cur.word\\n        return dfs(0, self.root)",
    testCases: [],
    timeComplexity: "O(m)",
    spaceComplexity: "O(m)",
    tags: ["trie", "backtracking"],
    examples: [],
    hints: []
  },
  {
    id: "q_588",
    title: "Design In-Memory File System",
    description: "Design a data structure that simulates an in-memory file system.",
    difficulty: "hard",
    topic: "trie",
    constraints: ["O(L) Time", "Trie / Dict"],
    starterCode: "class FileSystem:\\n    def __init__(self):\\n        pass\\n\\n    def ls(self, path: str) -> list[str]:\\n        pass\\n\\n    def mkdir(self, path: str) -> None:\\n        pass\\n\\n    def addContentToFile(self, filePath: str, content: str) -> None:\\n        pass\\n\\n    def readContentFromFile(self, filePath: str) -> str:\\n        pass",
    solution: "class FileSystem:\\n    def __init__(self):\\n        self.root = {}\\n        self.files = {}\\n\\n    def ls(self, path):\\n        parts = [p for p in path.split('/') if p]\\n        cur = self.root\\n        for p in parts:\\n            if p not in cur: return [p]\\n            cur = cur[p]\\n        if type(cur) == str: return [parts[-1]]\\n        return sorted(cur.keys())\\n\\n    def mkdir(self, path):\\n        parts = [p for p in path.split('/') if p]\\n        cur = self.root\\n        for p in parts:\\n            if p not in cur: cur[p] = {}\\n            cur = cur[p]\\n\\n    def addContentToFile(self, filePath, content):\\n        parts = [p for p in filePath.split('/') if p]\\n        cur = self.root\\n        for p in parts[:-1]:\\n            cur = cur[p]\\n        if parts[-1] not in cur: cur[parts[-1]] = ''\\n        cur[parts[-1]] += content\\n\\n    def readContentFromFile(self, filePath):\\n        parts = [p for p in filePath.split('/') if p]\\n        cur = self.root\\n        for p in parts[:-1]:\\n            cur = cur[p]\\n        return cur[parts[-1]]",
    testCases: [],
    timeComplexity: "O(l)",
    spaceComplexity: "O(n)",
    tags: ["design", "trie"],
    examples: [],
    hints: []
  },
  {
    id: "q_432",
    title: "All O`one Data Structure",
    description: "Design a data structure to store the strings' count with the ability to return the strings with minimum and maximum counts.",
    difficulty: "hard",
    topic: "hash-tables",
    constraints: ["O(1) Time", "HashMap + Doubly Linked List"],
    starterCode: "class AllOne:\\n    def __init__(self):\\n        pass\\n\\n    def inc(self, key: str) -> None:\\n        pass\\n\\n    def dec(self, key: str) -> None:\\n        pass\\n\\n    def getMaxKey(self) -> str:\\n        pass\\n\\n    def getMinKey(self) -> str:\\n        pass",
    solution: "class AllOne:\\n    def __init__(self):\\n        self.myDict = {}\\n\\n    def inc(self, key):\\n        self.myDict[key] = self.myDict.get(key, 0) + 1\\n\\n    def dec(self, key):\\n        if key in self.myDict:\\n            self.myDict[key] -= 1\\n            if self.myDict[key] == 0: del self.myDict[key]\\n\\n    def getMaxKey(self):\\n        return max(self.myDict, key=self.myDict.get) if self.myDict else ''\\n\\n    def getMinKey(self):\\n        return min(self.myDict, key=self.myDict.get) if self.myDict else ''",
    testCases: [],
    timeComplexity: "O(1)",
    spaceComplexity: "O(n)",
    tags: ["design", "hash-maps"],
    examples: [],
    hints: []
  },
  {
    id: "q_622",
    title: "Design Circular Queue",
    description: "Design your implementation of the circular queue.",
    difficulty: "medium",
    topic: "queues",
    constraints: ["O(1) Time", "Array / Linked List"],
    starterCode: "class MyCircularQueue:\\n    def __init__(self, k: int):\\n        pass\\n\\n    def enQueue(self, value: int) -> bool:\\n        pass\\n\\n    def deQueue(self) -> bool:\\n        pass\\n\\n    def Front(self) -> int:\\n        pass\\n\\n    def Rear(self) -> int:\\n        pass\\n\\n    def isEmpty(self) -> bool:\\n        pass\\n\\n    def isFull(self) -> bool:\\n        pass",
    solution: "class MyCircularQueue:\\n    def __init__(self, k):\\n        self.space = k\\n        self.q = [0] * k\\n        self.head = 0\\n        self.tail = 0\\n        self.count = 0\\n\\n    def enQueue(self, value):\\n        if self.isFull(): return False\\n        self.q[self.tail] = value\\n        self.tail = (self.tail + 1) % self.space\\n        self.count += 1\\n        return True\\n\\n    def deQueue(self):\\n        if self.isEmpty(): return False\\n        self.head = (self.head + 1) % self.space\\n        self.count -= 1\\n        return True\\n\\n    def Front(self):\\n        return -1 if self.isEmpty() else self.q[self.head]\\n\\n    def Rear(self):\\n        return -1 if self.isEmpty() else self.q[(self.tail - 1) % self.space]\\n\\n    def isEmpty(self):\\n        return self.count == 0\\n\\n    def isFull(self):\\n        return self.count == self.space",
    testCases: [],
    timeComplexity: "O(1)",
    spaceComplexity: "O(n)",
    tags: ["queues", "design"],
    examples: [],
    hints: []
  },
  // ==========================================
  // Module 8: Concurrency & Threading Challenges
  // ==========================================
  {
    id: "q_1115",
    title: "Print FooBar Alternately",
    description: "Suppose you are given the following code: class FooBar { public void foo() { for (int i = 0; i < n; i++) { print('foo'); } } public void bar() { for (int i = 0; i < n; i++) { print('bar'); } } } The same instance of FooBar will be passed to two different threads. Thread A will call foo() while thread B will call bar(). Modify the given program to output 'foobar' n times.",
    difficulty: "medium",
    topic: "general",
    constraints: ["O(N) Time", "Threading / Locks"],
    starterCode: "class FooBar:\\n    def __init__(self, n):\\n        self.n = n\\n\\n    def foo(self, printFoo: 'Callable[[], None]') -> None:\\n        for i in range(self.n):\\n            # printFoo() outputs \"foo\". Do not change or remove this line.\\n            printFoo()\\n\\n    def bar(self, printBar: 'Callable[[], None]') -> None:\\n        for i in range(self.n):\\n            # printBar() outputs \"bar\". Do not change or remove this line.\\n            printBar()",
    solution: "from threading import Lock\\n\\nclass FooBar:\\n    def __init__(self, n):\\n        self.n = n\\n        self.foo_lock = Lock()\\n        self.bar_lock = Lock()\\n        self.bar_lock.acquire()\\n\\n    def foo(self, printFoo):\\n        for i in range(self.n):\\n            self.foo_lock.acquire()\\n            printFoo()\\n            self.bar_lock.release()\\n\\n    def bar(self, printBar):\\n        for i in range(self.n):\\n            self.bar_lock.acquire()\\n            printBar()\\n            self.foo_lock.release()",
    testCases: [],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["concurrency"],
    examples: [],
    hints: []
  },
  {
    id: "q_1242",
    title: "Web Crawler Multithreaded",
    description: "Given a url startUrl and an interface HtmlParser, implement a Multi-threaded web crawler to crawl all links that are under the same hostname as startUrl.",
    difficulty: "medium",
    topic: "graphs",
    constraints: ["O(N) Time", "BFS / Thread Pool"],
    starterCode: "class Solution:\\n    def crawl(self, startUrl: str, htmlParser: 'HtmlParser') -> list[str]:\\n        pass",
    solution: "from concurrent.futures import ThreadPoolExecutor\\nimport threading\\n\\nclass Solution:\\n    def crawl(self, startUrl, htmlParser):\\n        hostname = lambda url: url.split('/')[2]\\n        host = hostname(startUrl)\\n        visited = {startUrl}\\n        lock = threading.Lock()\\n\\n        def download(url):\\n            return htmlParser.getUrls(url)\\n\\n        with ThreadPoolExecutor(max_workers=8) as executor:\\n            queue = collections.deque([startUrl])\\n            while queue:\\n                futures = []\\n                for url in queue:\\n                    futures.append(executor.submit(download, url))\\n                queue = collections.deque()\\n                for future in futures:\\n                    urls = future.result()\\n                    for url in urls:\\n                        if host in url and url not in visited:\\n                            with lock:\\n                                if url not in visited:\\n                                    visited.add(url)\\n                                    queue.append(url)\\n        return list(visited)",
    testCases: [],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    tags: ["concurrency", "graphs"],
    examples: [],
    hints: []
  },
  {
    id: "q_conc_06",
    title: "Thread-Safe Counter",
    description: "Design a thread-safe counter class that supports increment, decrement, and get value operations.",
    difficulty: "easy",
    topic: "general",
    constraints: ["O(1) Time", "Locking"],
    starterCode: "class ThreadSafeCounter:\\n    def __init__(self):\\n        pass\\n\\n    def increment(self) -> None:\\n        pass\\n\\n    def decrement(self) -> None:\\n        pass\\n\\n    def get_value(self) -> int:\\n        pass",
    solution: "import threading\\n\\nclass ThreadSafeCounter:\\n    def __init__(self):\\n        self.value = 0\\n        self.lock = threading.Lock()\\n\\n    def increment(self):\\n        with self.lock:\\n            self.value += 1\\n\\n    def decrement(self):\\n        with self.lock:\\n            self.value -= 1\\n\\n    def get_value(self):\\n        with self.lock:\\n            return self.value",
    testCases: [],
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    tags: ["concurrency"],
    examples: [],
    hints: []
  },

  // ==========================================
  // Module 9: System Design Challenges
  // ==========================================
  {
    id: "q_sys_04",
    title: "API Rate Limiter with Multiple Limits",
    description: "Design an API Rate Limiter that can handle multiple limits (e.g. 10 req/sec AND 50 req/min).",
    difficulty: "hard",
    topic: "hash-tables",
    constraints: ["O(1) Time", "Token Bucket / Sliding Window"],
    starterCode: "class RateLimiter:\\n    def __init__(self, limits: list[tuple]):\\n        # limits is list of (count, window_seconds)\\n        pass\\n\\n    def allow(self, userId: str) -> bool:\\n        pass",
    solution: "import time\\n\\nclass RateLimiter:\\n    def __init__(self, limits):\\n        self.limits = limits\\n        self.user_history = {} # userId -> [(count, window_start)_limit1, ...]\\n\\n    def allow(self, userId):\\n        now = time.time()\\n        if userId not in self.user_history:\\n             self.user_history[userId] = [[0, now] for _ in self.limits]\\n        \\n        for i, (limit_count, limit_window) in enumerate(self.limits):\\n            history = self.user_history[userId][i]\\n            # Reset window if expired\\n            if now - history[1] > limit_window:\\n                history[0] = 0\\n                history[1] = now\\n            \\n            if history[0] >= limit_count:\\n                return False\\n            \\n            history[0] += 1\\n        return True",
    testCases: [],
    timeComplexity: "O(k)",
    spaceComplexity: "O(n)",
    tags: ["system-design"],
    examples: [],
    hints: []
  },

  // ==========================================
  // Module 10: OOD Patterns Challenges
  // ==========================================
  {
    id: "q_ood_03",
    title: "Design Version Control for Key-Value Store",
    description: "Design a Key-Value store that supports transactions: begin, commit, and rollback.",
    difficulty: "hard",
    topic: "hash-tables",
    constraints: ["O(1) Time", "Stack of Maps"],
    starterCode: "class TransactionKV:\\n    def __init__(self):\\n        pass\\n\\n    def begin(self) -> None:\\n        pass\\n\\n    def commit(self) -> None:\\n        pass\\n\\n    def rollback(self) -> None:\\n        pass\\n\\n    def put(self, key: str, value: str) -> None:\\n        pass\\n\\n    def get(self, key: str) -> str:\\n        pass",
    solution: "class TransactionKV:\\n    def __init__(self):\\n        self.store = {}\\n        self.transactions = []\\n\\n    def begin(self):\\n        self.transactions.append({})\\n\\n    def commit(self):\\n        if not self.transactions: return\\n        updates = self.transactions.pop()\\n        if self.transactions:\\n            self.transactions[-1].update(updates)\\n        else:\\n            self.store.update(updates)\\n\\n    def rollback(self):\\n        if self.transactions:\\n            self.transactions.pop()\\n\\n    def put(self, key, value):\\n        if self.transactions:\\n            self.transactions[-1][key] = value\\n        else:\\n            self.store[key] = value\\n\\n    def get(self, key):\\n        for tx in reversed(self.transactions):\\n            if key in tx: return tx[key]\\n        return self.store.get(key, None)",
    testCases: [],
    timeComplexity: "O(1)",
    spaceComplexity: "O(n)",
    tags: ["ood", "design"],
    examples: [],
    hints: []
  },
  {
    id: "q_1146",
    title: "Snapshot Array",
    description: "Implement a SnapshotArray that supports the following interface: SnapshotArray(int length) initializes an array-like data structure with the given length. Initially, each element equals 0. void set(index, val) sets the element at the given index to be equal to val. int snap() takes a snapshot of the array and returns the snap_id: the total number of times we called snap() minus 1. int get(index, snap_id) returns the value at the given index, at the time we took the snapshot with the given snap_id.",
    difficulty: "medium",
    topic: "searching",
    constraints: ["O(log S) Time", "Binary Search / List of Lists"],
    starterCode: "class SnapshotArray:\\n    def __init__(self, length: int):\\n        pass\\n\\n    def set(self, index: int, val: int) -> None:\\n        pass\\n\\n    def snap(self) -> int:\\n        pass\\n\\n    def get(self, index: int, snap_id: int) -> int:\\n        pass",
    solution: "import bisect\\n\\nclass SnapshotArray:\\n    def __init__(self, length):\\n        self.snaps = [[(0, 0)] for _ in range(length)]\\n        self.snapId = 0\\n\\n    def set(self, index, val):\\n        self.snaps[index].append((self.snapId, val))\\n\\n    def snap(self):\\n        self.snapId += 1\\n        return self.snapId - 1\\n\\n    def get(self, index, snap_id):\\n        history = self.snaps[index]\\n        i = bisect.bisect_right(history, (snap_id, float('inf'))) - 1\\n        return history[i][1]",
    testCases: [],
    timeComplexity: "O(log s)",
    spaceComplexity: "O(n*s)",
    tags: ["arrays", "design"],
    examples: [],
    hints: []
  },

  // ==========================================
  // Module 11: Async Patterns Challenges
  // ==========================================
  {
    id: "q_1834",
    title: "Single-Threaded CPU",
    description: "You are given n tasks labeled from 0 to n - 1 represented by a 2D integer array tasks, where tasks[i] = [enqueueTimei, processingTimei]. You use a single-threaded CPU to process these tasks. tasks[i] is available to process at enqueueTimei. The CPU will finish processing a task in processingTimei time. Return the order in which the CPU will process the tasks.",
    difficulty: "medium",
    topic: "heaps",
    constraints: ["O(N log N) Time", "Min-Heap + Sorting"],
    starterCode: "def getOrder(tasks: list[list[int]]) -> list[int]:\\n    pass",
    solution: "def getOrder(tasks):\\n    for i, t in enumerate(tasks):\\n        t.append(i)\\n    tasks.sort()\\n    res, minHeap = [], []\\n    i, time = 0, tasks[0][0]\\n    while minHeap or i < len(tasks):\\n        while i < len(tasks) and time >= tasks[i][0]:\\n            heapq.heappush(minHeap, (tasks[i][1], tasks[i][2]))\\n            i += 1\\n        if not minHeap:\\n            time = tasks[i][0]\\n        else:\\n            procTime, idx = heapq.heappop(minHeap)\\n            time += procTime\\n            res.append(idx)\\n    return res",
    testCases: [
      { id: "tc_1834_1", input: "[[1,2],[2,4],[3,2],[4,1]]", expectedOutput: "[0,2,3,1]" }
    ],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    tags: ["heaps", "sorting"],
    examples: [],
    hints: []
  }
];

// Shared lesson content (used by both backtracking and time complexity for now)
const sharedBacktrackingContent: DSALessonContent[] = [
  // BLOCK 1: Recursion Prerequisites
  {
    type: "text",
    content: `<h1>Prerequisites: Master Recursion First</h1>
<p><strong>Backtracking</strong> uses recursion at its core. Before we dive into backtracking, let&#39;s make sure you&#39;re comfortable with recursion!</p>
<h2>What is Recursion?</h2>
<p>Recursion is when a function calls itself to solve smaller versions of the same problem.</p>
<p><strong>The pattern:</strong></p>
<ol>
<li><strong>Base case</strong>: When to stop (the simplest problem)</li>
<li><strong>Recursive case</strong>: Break problem into smaller pieces + call yourself</li>
</ol>
<p>Think of it like Russian nesting dolls - each doll contains a smaller version of itself until you reach the tiniest one!</p>
<p>Let&#39;s warm up with some recursion practice! ⬇️</p>
`,
  },

  // BLOCK 2: Recursion Problem 1 - Countdown
  {
    type: "task",
    task: {
      id: "recursion-1-countdown",
      title: "Recursion Practice 1: Countdown",
      description: `Write a recursive function that counts down from n to 0.

**Expected output for countdown(3)**:
\`\`\`
3
2
1
0
\`\`\``,
      starterCode: `def countdown(n):
    # TODO: Base case - when n < 0, return (stop recursing)


    # Print current number
    print(n)

    # TODO: Recursive case - call countdown(n - 1)


# Test
countdown(3)`,
      expectedOutput: "3\n2\n1\n0",
      hint: "Base case: if n < 0: return. Recursive case: countdown(n - 1)",
      solution: `def countdown(n):
    # Base case - stop when negative
    if n < 0:
        return

    # Print current number
    print(n)

    # Recursive case - count down
    countdown(n - 1)

# Test
countdown(3)`,
      validation: (code: string) => {
        return (
          code.includes("if") &&
          code.includes("return") &&
          code.includes("countdown(n - 1)")
        );
      },
    },
  },

  // BLOCK 3: Teach about base case
  {
    type: "text",
    content: `<h1>✅ Great! You Just Wrote Recursion</h1>
<p>Let&#39;s break down what happened:</p>
<ol>
<li><strong>Base case</strong> (<code>if n &lt; 0: return</code>): Stops the recursion</li>
<li><strong>Do work</strong> (<code>print(n)</code>): Process current level</li>
<li><strong>Recursive call</strong> (<code>countdown(n - 1)</code>): Solve smaller problem</li>
</ol>
<h2>The Call Stack</h2>
<p>When <code>countdown(3)</code> runs:</p>
<pre><code>countdown(3) → print 3 → calls countdown(2)
  countdown(2) → print 2 → calls countdown(1)
    countdown(1) → print 1 → calls countdown(0)
      countdown(0) → print 0 → calls countdown(-1)
        countdown(-1) → return (base case!)
</code></pre>
<p>Each call waits for the next to finish before returning. This creates a <strong>call stack</strong>!</p>
`,
  },

  // BLOCK 4: Recursion Problem 2 - Sum with return value
  {
    type: "task",
    task: {
      id: "recursion-2-sum",
      title: "Recursion Practice 2: Sum of List",
      description: `Calculate the sum of a list recursively.

**Expected**: sum_list([1, 2, 3, 4, 5]) → 15`,
      starterCode: `def sum_list(nums, index=0):
    # TODO: Base case - if index >= len(nums), return 0


    # TODO: Recursive case - return nums[index] + sum_list(nums, index + 1)


# Test
print(sum_list([1, 2, 3, 4, 5]))`,
      expectedOutput: "15",
      hint: "Base: if index >= len(nums): return 0. Recursive: return nums[index] + sum_list(nums, index + 1)",
      solution: `def sum_list(nums, index=0):
    # Base case - reached end of list
    if index >= len(nums):
        return 0

    # Recursive case - current element + sum of rest
    return nums[index] + sum_list(nums, index + 1)

# Test
print(sum_list([1, 2, 3, 4, 5]))`,
      validation: (code: string) => {
        return (
          code.includes("return 0") &&
          code.includes("return nums[index]") &&
          code.includes("sum_list(nums, index + 1)")
        );
      },
    },
  },

  // BLOCK 5: Explain return values
  {
    type: "text",
    content: `<h1>🎯 Recursion with Return Values</h1>
<p>Notice the difference:</p>
<ul>
<li><strong>Countdown</strong>: Just prints, no return value needed</li>
<li><strong>Sum</strong>: Returns values that get combined</li>
</ul>
<h2>How the returns work:</h2>
<pre><code>sum_list([1, 2, 3], 0)
  = 1 + sum_list([1, 2, 3], 1)
  = 1 + (2 + sum_list([1, 2, 3], 2))
  = 1 + (2 + (3 + sum_list([1, 2, 3], 3)))
  = 1 + (2 + (3 + 0))  ← base case returns 0
  = 1 + (2 + 3)
  = 1 + 5
  = 6
</code></pre>
<p>Each recursive call returns a value that gets used by the caller!</p>
<p><strong>This is how backtracking will build solutions!</strong></p>
`,
  },

  // BLOCK 6: From-Scratch Copy Snapshots (Replace Copy Bug)
  {
    type: "task",
    task: {
      id: "recursion-3-grow-list",
      title: "Recursion Practice 3: Copy Snapshots",
      description: `Implement \`grow_list(nums)\` from scratch. Build a path incrementally and append a COPY of the path at each step. Return all snapshots.

Example: grow_list([1,2,3]) → [[1], [1, 2], [1, 2, 3]]`,
      starterCode: `# Define grow_list(nums) above
print(grow_list([1, 2, 3]))`,
      expectedOutput: "[[1], [1, 2], [1, 2, 3]]",
      hint: "Use a helper with a mutable path list. Append, copy with path[:], recurse, then pop to restore.",
      solution: `def grow_list(nums):
    result = []
    path = []

    def helper(i):
        if i == len(nums):
            return
        path.append(nums[i])
        result.append(path[:])
        helper(i + 1)
        path.pop()

    helper(0)
    return result

print(grow_list([1, 2, 3]))`,
      validation: (code: string) => {
        return (
          code.includes("grow_list") &&
          (code.includes("path[:]") ||
            code.includes("list(path)") ||
            code.includes("path.copy()"))
        );
      },
    },
  },

  // BLOCK 7: Explain the copy problem
  {
    type: "text",
    content: `<h1>🐛 Why Copying Matters</h1>
<h2>The Bug:</h2>
<p><code>result.append(path)</code> stores a <strong>reference</strong> to the same list object.</p>
<p>Since we keep modifying <code>path</code>, all saved &quot;solutions&quot; point to the same list!</p>
<p>By the end, <code>path = [1, 2, 3]</code>, so result has 3 references to <code>[1, 2, 3]</code>.</p>
<h2>The Fix:</h2>
<p><code>result.append(path[:])</code> creates a <strong>copy</strong> of the current state.</p>
<p>Each saved item is independent, so changes to <code>path</code> don&#39;t affect saved copies.</p>
<p><strong>This will be CRITICAL for backtracking!</strong> We&#39;ll save many different states.</p>
`,
  },

  // BLOCK 8: Print Recursion Tree
  {
    type: "task",
    task: {
      id: "recursion-4-visualize",
      title: "Recursion Practice 4: Visualize the Tree",
      description: `Add code to visualize the recursion tree structure with indentation.`,
      starterCode: `def explore(path, depth):
    indent = "  " * depth
    # TODO: Add this line to visualize:
    # print(f"{indent}At depth {depth}, path = {path}")

    if depth == 3:
        return

    # Explore two branches
    explore(path + ['L'], depth + 1)  # Go left
    explore(path + ['R'], depth + 1)  # Go right

explore([], 0)`,
      expectedOutput:
        "At depth 0, path = []\n  At depth 1, path = ['L']\n    At depth 2, path = ['L', 'L']",
      hint: 'Add: print(f"{indent}At depth {depth}, path = {path}") right after the indent line',
      solution: `def explore(path, depth):
    indent = "  " * depth
    print(f"{indent}At depth {depth}, path = {path}")

    if depth == 3:
        return

    # Explore two branches
    explore(path + ['L'], depth + 1)  # Go left
    explore(path + ['R'], depth + 1)  # Go right

explore([], 0)`,
      validation: (code: string) => {
        return code.includes('print(f"{indent}');
      },
    },
  },

  // PREP TASK A: Enter/Exit Trace
  {
    type: "task",
    task: {
      id: "prep-1-trace-enter-exit",
      title: "Prep 1: Enter/Exit Trace",
      description: `Implement \`trace(n)\` that prints when entering and exiting each call. This builds call stack intuition.

Call order for trace(2): enter 2 → enter 1 → enter 0 → exit 0 → exit 1 → exit 2`,
      starterCode: `# Define trace(n) above
trace(2)`,
      expectedOutput:
        "enter 2\nenter 1\nenter 0\nexit 0\nexit 1\nexit 2",
      hint: "Print before and after the recursive call. Base case at n == 0 (still print enter/exit for 0).",
      solution: `def trace(n):
    print(f"enter {n}")
    if n == 0:
        print(f"exit {n}")
        return
    trace(n - 1)
    print(f"exit {n}")

trace(2)`,
      validation: (code: string) =>
        code.includes("enter") && code.includes("exit"),
    },
  },

  // PREP TASK B: Make→Undo Trace
  {
    type: "task",
    task: {
      id: "prep-2-push-pop-trace",
      title: "Prep 2: Make → Undo Trace",
      description: `Implement \`push_pop_trace(n, path)\`. Push a value, recurse, then pop. Print path at each step to see state restoration.`,
      starterCode: `# Define push_pop_trace(n, path) above
push_pop_trace(2, [])`,
      expectedOutput:
        "enter 2 [2]\nenter 1 [2, 1]\nleaf [2, 1]\nexit 1 [2]\nexit 2 []",
      hint: "Append n before recursing, print states, and pop after to restore.",
      solution: `def push_pop_trace(n, path):
    path.append(n)
    print(f"enter {n} {path}")
    if n == 1:
        print(f"leaf {path}")
    else:
        push_pop_trace(n - 1, path)
    path.pop()
    print(f"exit {n} {path}")

push_pop_trace(2, [])`,
      validation: (code: string) =>
        code.includes("push_pop_trace"),
    },
  },

  // PREP TASK C: Two-Branch Without Mutation (Strings)
  {
    type: "task",
    task: {
      id: "prep-3-build-strings",
      title: "Prep 3: Two-Branch (No Mutation)",
      description: `Implement \`build_strings(n)\` that returns all strings of length n over {A, B} using pure recursion (no in-place mutation).`,
      starterCode: `# Define build_strings(n) above
print(sorted(build_strings(2)))`,
      expectedOutput: "['AA', 'AB', 'BA', 'BB']",
      hint: "Concatenate 'A' and 'B' to smaller results or pass the partial string as an argument.",
      solution: `def build_strings(n):
    if n == 0:
        return ['']
    smaller = build_strings(n - 1)
    return [s + 'A' for s in smaller] + [s + 'B' for s in smaller]

print(sorted(build_strings(2)))`,
      validation: (code: string) =>
        code.includes("build_strings"),
    },
  },

  // PREP TASK D: Pre vs Post Collection
  {
    type: "task",
    task: {
      id: "prep-4-collect-pre",
      title: "Prep 4: Collect Pre-Order",
      description: `Implement \`collect_pre(n)\` that appends the current string BEFORE recursing on {A,B}. This sets up \"add at step\" vs \"add at base\" later.`,
      starterCode: `# Define collect_pre(n) above
print(sorted(collect_pre(2)))`,
      expectedOutput:
        "['', 'A', 'AA', 'AB', 'B', 'BA', 'BB']",
      hint: "Add current prefix to results, then recurse with prefix+'A' and prefix+'B' until length n.",
      solution: `def collect_pre(n):
    result = []

    def dfs(prefix):
        result.append(prefix)
        if len(prefix) == n:
            return
        dfs(prefix + 'A')
        dfs(prefix + 'B')

    dfs('')
    return result

print(sorted(collect_pre(2)))`,
      validation: (code: string) =>
        code.includes("collect_pre"),
    },
  },

  // BLOCK 9: Connect recursion to backtracking
  {
    type: "text",
    content: `<h1>🎉 You&#39;re Ready for Backtracking!</h1>
<p>You just learned:
✅ <strong>Recursion basics</strong> - base case + recursive case
✅ <strong>Return values</strong> - how to build up solutions
✅ <strong>Copying</strong> - why <code>path[:]</code> is critical
✅ <strong>Tree structure</strong> - recursion creates a tree!</p>
<h2>Now Let&#39;s Apply This to Backtracking</h2>
<p>Backtracking is just recursion where:</p>
<ol>
<li>You explore multiple choices at each level</li>
<li>You save complete solutions (like we saved copied paths)</li>
<li>You &quot;undo&quot; choices to try other options</li>
</ol>
<p>Let&#39;s see how it works visually! ⬇️</p>
`,
  },

  // BLOCK 10: Visual Introduction
  {
    type: "component",
    componentName: "BacktrackingTreeLesson",
  },

  // BLOCK 11: Intro to Backtracking
  {
    type: "text",
    content: `<h1>What is Backtracking?</h1>
<p>Now that you understand recursion, let&#39;s apply it to <strong>backtracking</strong>!</p>
<p><strong>Backtracking</strong> is a recursive technique where you explore all possible options by:</p>
<ul>
<li><strong>Making choices</strong> → Move forward</li>
<li><strong>Hitting dead ends?</strong> → Go back (undo) and try another choice</li>
<li><strong>Finding solutions?</strong> → Save them!</li>
</ul>
<p>Think of it like exploring a maze using the recursion skills you just learned!</p>
<h2>🎯 The Problem: All Subsets</h2>
<p>Let&#39;s solve: <strong>generate all subsets of [1, 2]</strong>.</p>
<p>A <strong>subset</strong> is any combination of elements. For <code>[1, 2]</code>, there are <strong>4 possible subsets</strong>:</p>
<ol>
<li><code>[]</code> - Take nothing</li>
<li><code>[1]</code> - Take only 1</li>
<li><code>[2]</code> - Take only 2</li>
<li><code>[1, 2]</code> - Take both</li>
</ol>
<p>For each element, you have <strong>exactly 2 choices</strong>: 📥 <strong>Include it</strong> or 📤 <strong>Exclude it</strong>.</p>
<p>Sound familiar? That&#39;s the same tree structure you just visualized!</p>
`,
  },

  // BLOCK 12: Teach Decision Tree
  {
    type: "text",
    content: `<h1>🌲 The Decision Tree</h1>
<p>Here&#39;s how the choices form a tree for <code>[1, 2]</code>:</p>
<pre><code>                    []
                   /  \
                  /    \
          Include 1    Skip 1
               /          \
              /            \
            [1]            []
           /  \           /  \
          /    \         /    \
   Include 2  Skip 2  Include 2  Skip 2
       /        \       /          \
    [1,2]      [1]    [2]          []
     ✓          ✓      ✓            ✓
</code></pre>
<p><strong>Reading the tree:</strong></p>
<ul>
<li><strong>Root</strong>: Start with empty subset <code>[]</code></li>
<li><strong>Each level</strong>: Decision for one element (include or skip)</li>
<li><strong>Leaves</strong> (✓): Complete subsets - our solutions!</li>
</ul>
<p><strong>This is like the recursion tree you just visualized</strong>, but now we save solutions at the leaves!</p>
<h2>🛑 The Base Case: When to Save Solutions</h2>
<p>The <strong>base case</strong> is when we&#39;ve made decisions for ALL elements. In code:</p>
<pre><code class="language-python">if index == len(nums):  # Processed all elements?
    result.append(path[:])  # Save this subset!
    return
</code></pre>
<p><strong>Remember from recursion practice</strong>: We use <code>path[:]</code> to make a <strong>copy</strong>!</p>
<p>You already fixed this bug - now let&#39;s use it in backtracking! ⬇️</p>
`,
  },

  // BLOCK 14: Teach Make-Explore-Undo Pattern + Include Choice
  {
    type: "text",
    content: `<h1>✅ Base Case Complete! Now Let&#39;s Add Choices</h1>
<h2>🎯 The 3-Step &quot;Make-Explore-Undo&quot; Pattern</h2>
<p>This is the CORE of backtracking:</p>
<pre><code class="language-python"># 1. MAKE the choice
path.append(choice)

# 2. EXPLORE with this choice (recurse!)
backtrack(path, next_state)

# 3. UNDO the choice (backtrack!)
path.pop()
</code></pre>
<p><strong>Why undo?</strong> After exploring with a choice, we <strong>must remove it</strong> to try other options.</p>
<p>This is like your recursion tree visualization - we explore one branch, then come back and explore another!</p>
<h2>📥 Choice 1: Include the Element</h2>
<p>Let&#39;s implement the <strong>left branch</strong> - including the current element:</p>
<pre><code class="language-python"># Include nums[index]
path.append(nums[index])        # 1. MAKE
backtrack(path, index + 1)      # 2. EXPLORE
path.pop()                       # 3. UNDO
</code></pre>
<p>This explores all subsets that <strong>include</strong> the current element.</p>
<p>Let&#39;s code it! ⬇️</p>
`,
  },
  // BLOCK 13 (Moved): Task - Base Case (after template intro)
  {
    type: "task",
    task: {
      id: "backtracking-1-base-case",
      title: "Backtracking 1: Implement the Base Case",
      description: `Implement the base case for the backtracking algorithm.

**Expected**: [[]]`,
      starterCode: `def subsets(nums):
    result = []

    def backtrack(path, index):
        # Base case: processed all elements
        if index == len(nums):
            # Add a COPY of path to result
            result.append(path[:])
            return

    backtrack([], 0)
    return result

# Test
print(subsets([1, 2]))`,
      expectedOutput: "[[]]",
      hint: "Use path[:] to copy before saving.",
      solution: `def subsets(nums):
    result = []

    def backtrack(path, index):
        # Base case: processed all elements
        if index == len(nums):
            result.append(path[:])  # Make a copy!
            return

    backtrack([], 0)
    return result

# Test
print(subsets([1, 2]))`,
      validation: (code: string) => {
        return (
          code.includes("result.append(path[:])") ||
          code.includes("result.append(path.copy())") ||
          code.includes("result.append(list(path))")
        );
      },
    },
  },
  // BLOCK 15: Task - Include Choice
  {
    type: "task",
    task: {
      id: "backtracking-2-include-choice",
      title: 'Backtracking 2: Add the "Include" Choice',
      description: `Add the logic for including the current element.

**Expected**: [[1, 2]]`,
      starterCode: `def subsets(nums):
    result = []

    def backtrack(path, index):
        if index == len(nums):
            result.append(path[:])
            return

        # Choice 1: Include current element
        # TODO Line 1: path.append(nums[index])
        # TODO Line 2: backtrack(path, index + 1)
        # TODO Line 3: path.pop()

    backtrack([], 0)
    return result

# Test
print(subsets([1, 2]))`,
      expectedOutput: "[[1, 2]]",
      hint: "Replace the 3 TODO lines with: path.append(nums[index]), backtrack(path, index + 1), path.pop()",
      solution: `def subsets(nums):
    result = []

    def backtrack(path, index):
        if index == len(nums):
            result.append(path[:])
            return

        # Choice 1: Include current element
        path.append(nums[index])
        backtrack(path, index + 1)
        path.pop()  # Undo

    backtrack([], 0)
    return result

# Test
print(subsets([1, 2]))`,
      validation: (code: string) => {
        return (
          code.includes("path.append(nums[index])") &&
          code.includes("path.pop()") &&
          code.includes("backtrack(path, index + 1)")
        );
      },
    },
  },

  // BLOCK 16: Teach Exclude Choice + Complete Tree
  {
    type: "text",
    content: `<h1>🎯 What You Just Built - The Left Branch!</h1>
<p>Great job! You just implemented the &quot;include&quot; choice. Your code now explores one path:</p>
<pre><code>        []
       /
Include 1
     /
   [1]
   /
Include 2
 /
[1,2] ✓
</code></pre>
<p>You&#39;re getting <strong>only [1,2]</strong> because we only explore the &quot;include everything&quot; branch!</p>
<h2>📤 Choice 2: Exclude the Element</h2>
<p>Now let&#39;s add the <strong>right branch</strong> - skipping the current element:</p>
<pre><code class="language-python"># Exclude nums[index]
backtrack(path, index + 1)  # Just move to next, no modify!
</code></pre>
<p><strong>Key difference</strong>: No <code>append</code>, no <code>pop</code> - we&#39;re NOT changing the path!</p>
<p>This single line completes the algorithm! When you add it, you&#39;ll explore <strong>both branches</strong> at each level:</p>
<pre><code>                []
               /  \
        Include   Skip
           /         \
        [1]          []
       /  \         /  \
[1,2]   [1]      [2]   []
</code></pre>
<p>Let&#39;s complete the algorithm! ⬇️</p>
`,
  },
  // BLOCK 17: Task - Exclude Choice (Complete Algorithm!)
  {
    type: "task",
    task: {
      id: "backtracking-3-exclude-choice",
      title: 'Backtracking 3: Add the "Exclude" Choice',
      description: `Add the logic for excluding the current element.

**Expected**: [[], [1], [2], [1, 2]]`,
      starterCode: `def subsets(nums):
    result = []

    def backtrack(path, index):
        if index == len(nums):
            result.append(path[:])
            return

        # Choice 1: Include current element
        path.append(nums[index])
        backtrack(path, index + 1)
        path.pop()

        # Choice 2: Exclude current element
        # TODO: Add one line: backtrack(path, index + 1)

    backtrack([], 0)
    return result

# Test
print(subsets([1, 2]))`,
      expectedOutput: "[[], [1], [2], [1, 2]]",
      hint: "Add: backtrack(path, index + 1)",
      solution: `def subsets(nums):
    result = []

    def backtrack(path, index):
        if index == len(nums):
            result.append(path[:])
            return

        # Choice 1: Include current element
        path.append(nums[index])
        backtrack(path, index + 1)
        path.pop()

        # Choice 2: Exclude current element
        backtrack(path, index + 1)

    backtrack([], 0)
    return result

# Test
print(subsets([1, 2]))`,
      validation: (code: string) => {
        // Check for both include and exclude logic
        const hasInclude =
          code.includes("path.append(nums[index])") &&
          code.includes("path.pop()");
        const hasExclude =
          code.split("backtrack(path, index + 1)").length >=
          3; // At least 2 occurrences
        return hasInclude && hasExclude;
      },
    },
  },

  // BLOCK 18: Celebrate + Teach Alternative Approaches
  {
    type: "text",
    content: `<h1>🎉 You Built a Complete Backtracking Solution!</h1>
<p><strong>Congratulations!</strong> You just implemented the full backtracking algorithm! Let&#39;s understand what you built:</p>
<pre><code class="language-python">def backtrack(path, index):
    if index == len(nums):        # BASE CASE
        result.append(path[:])
        return

    # CHOICE 1: Include
    path.append(nums[index])      # MAKE
    backtrack(path, index + 1)    # EXPLORE
    path.pop()                     # UNDO

    # CHOICE 2: Exclude
    backtrack(path, index + 1)    # EXPLORE (no make/undo needed!)
</code></pre>
<h2>📈 The Pattern Scales Automatically</h2>
<p>Here&#39;s something amazing: <strong>The EXACT SAME CODE works for any input size!</strong></p>
<ul>
<li><code>[1, 2]</code> → 2² = <strong>4 subsets</strong></li>
<li><code>[1, 2, 3]</code> → 2³ = <strong>8 subsets</strong></li>
<li><code>[1, 2, 3, 4]</code> → 2⁴ = <strong>16 subsets</strong></li>
</ul>
<p>Each element doubles the number of subsets. The recursion handles this automatically - you don&#39;t need to change anything!</p>
<h2>🌳 The Recursion Mirrors the Tree</h2>
<pre><code class="language-python"># Each function call = One node in the tree
# The call stack = Path from root to current node
# Base case = Leaf node (save solution!)
# Two recursive calls = Two branches (include/exclude)
</code></pre>
<h2>🔄 There&#39;s Another Way to Do This!</h2>
<p>You&#39;ve mastered <strong>Approach 1</strong>: Add at the base case</p>
<pre><code class="language-python">def backtrack(path, index):
    if index == len(nums):
        result.append(path[:])  # Add when done
        return

    # Make two choices...
</code></pre>
<p>But there&#39;s <strong>Approach 2</strong>: Add at each step</p>
<pre><code class="language-python">def backtrack(path, start):
    result.append(path[:])  # Add immediately!

    for i in range(start, len(nums)):
        path.append(nums[i])
        backtrack(path, i + 1)
        path.pop()
</code></pre>
<h2>When to Use Each Approach</h2>
<p><strong>Approach 1</strong> (What you just built):</p>
<ul>
<li>✅ Clearer separation: base case vs recursive case</li>
<li>✅ Easier to understand for beginners</li>
<li>✅ Common in subset/combination problems</li>
</ul>
<p><strong>Approach 2</strong> (Let&#39;s try it now):</p>
<ul>
<li>✅ More flexible for some problems</li>
<li>✅ Useful when you want partial results at every step</li>
<li>✅ Common in permutation problems</li>
</ul>
<p><strong>Both are correct!</strong> Use whichever feels more natural for the problem.</p>
<p>Let&#39;s try Approach 2! ⬇️</p>
`,
  },

  // BLOCK 19: Task - Alternative Approach
  {
    type: "task",
    task: {
      id: "backtracking-4-alternative",
      title: "Backtracking 4: Try the Alternative Approach",
      description: `Try a different approach - instead of adding at the base case, add at every step.

**Expected**: [[], [1], [1, 2], [2]]`,
      starterCode: `def subsets(nums):
    result = []

    def backtrack(path, start):
        # Add current subset immediately
        result.append(path[:])

        # Try adding each remaining element
        for i in range(start, len(nums)):
            # TODO Line 1: path.append(nums[i])
            # TODO Line 2: backtrack(path, i + 1)
            # TODO Line 3: path.pop()
            pass

    backtrack([], 0)
    return result

# Test
print(subsets([1, 2]))`,
      expectedOutput: "[[], [1], [1, 2], [2]]",
      hint: "Replace the 3 TODO lines and remove pass. Same pattern: append, recurse, pop",
      solution: `def subsets(nums):
    result = []

    def backtrack(path, start):
        result.append(path[:])

        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(path, i + 1)
            path.pop()

    backtrack([], 0)
    return result

# Test
print(subsets([1, 2]))`,
      validation: (code: string) => {
        return (
          code.includes(
            "for i in range(start, len(nums))",
          ) &&
          code.includes("path.append(nums[i])") &&
          code.includes("path.pop()")
        );
      },
    },
  },

  // BLOCK 20: Comprehensive Summary
  {
    type: "text",
    content: `<h1>🎉 Congratulations! You&#39;ve Mastered Backtracking!</h1>
<h2>What You&#39;ve Learned</h2>
<h3>1. The Decision Tree Mental Model 🌳</h3>
<ul>
<li>Every backtracking problem = exploring a tree of choices</li>
<li>Nodes = states, Edges = choices, Leaves = solutions</li>
<li><strong>Always draw the tree first</strong> before coding!</li>
</ul>
<h3>2. The Universal &quot;Make-Explore-Undo&quot; Pattern ��</h3>
<pre><code class="language-python">def backtrack(state, choices):
    # BASE CASE: Solution found
    if complete:
        result.append(state[:])  # Copy!
        return

    # TRY EACH CHOICE
    for choice in choices:
        state.append(choice)      # 1. MAKE
        backtrack(state, ...)     # 2. EXPLORE
        state.pop()               # 3. UNDO
</code></pre>
<h3>3. Key Insights 💡</h3>
<p>✅ <strong>Always copy state</strong> when saving: <code>result.append(path[:])</code>
✅ <strong>Always undo choices</strong> after exploring: <code>path.pop()</code>
✅ <strong>Recursion mirrors the tree</strong> - call stack = path from root
✅ <strong>Two approaches work</strong>: Add at base case OR add at every step</p>
<h2>How to Apply This to ANY Backtracking Problem</h2>
<p><strong>Step 1:</strong> Identify the choices (include/exclude? pick next element?)
<strong>Step 2:</strong> Draw the decision tree for a small example
<strong>Step 3:</strong> Write the base case (when have you made all choices?)
<strong>Step 4:</strong> Write the recursive case (make, explore, undo)
<strong>Step 5:</strong> Test with small inputs first!</p>
<h2>The Pattern Works For Everything</h2>
<ul>
<li><strong>Subsets</strong>: Include/exclude each element → 2 choices per level</li>
<li><strong>Permutations</strong>: Choose from remaining elements → n choices at level 1, n-1 at level 2...</li>
<li><strong>Combinations</strong>: Choose elements after current → avoid duplicates</li>
<li><strong>N-Queens</strong>: Place queen in valid column → constraint checking</li>
<li><strong>Sudoku</strong>: Try digits 1-9 → heavy pruning</li>
</ul>
<p><strong>The template never changes - only the choices and constraints differ!</strong></p>
`,
  },

  // BLOCK 15: Quick Reference
  {
    type: "text",
    content: `<h1>📚 Quick Reference Card</h1>
<p>Keep this handy when solving backtracking problems!</p>
<h2>The Template (Python)</h2>
<pre><code class="language-python">def solve(input):
    result = []

    def backtrack(path, remaining):
        # BASE CASE
        if &lt;no more choices&gt;:
            result.append(path[:])  # COPY!
            return

        # TRY EACH CHOICE
        for choice in remaining:
            path.append(choice)        # MAKE
            backtrack(path, next)      # EXPLORE
            path.pop()                  # UNDO

    backtrack([], input)
    return result
</code></pre>
<h2>Common Mistakes ⚠️</h2>
<table>
<thead>
<tr>
<th>Mistake</th>
<th>Problem</th>
<th>Fix</th>
</tr>
</thead>
<tbody><tr>
<td><code>result.append(path)</code></td>
<td>All solutions same</td>
<td><code>result.append(path[:])</code></td>
</tr>
<tr>
<td>Forgot <code>path.pop()</code></td>
<td>Choices accumulate</td>
<td>Always undo after explore</td>
</tr>
<tr>
<td>Wrong base case</td>
<td>Missing solutions</td>
<td>Check when choices exhausted</td>
</tr>
<tr>
<td>No pruning</td>
<td>Timeout on large inputs</td>
<td>Add early return conditions</td>
</tr>
</tbody></table>
<h2>Problem Type Patterns</h2>
<table>
<thead>
<tr>
<th>Problem Type</th>
<th>Choice Strategy</th>
<th>Key Parameter</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Subsets</strong></td>
<td>Include/Exclude element</td>
<td>Current index</td>
</tr>
<tr>
<td><strong>Permutations</strong></td>
<td>Pick unused elements</td>
<td>Used set/boolean array</td>
</tr>
<tr>
<td><strong>Combinations</strong></td>
<td>Pick from remaining</td>
<td>Start index (avoid duplicates)</td>
</tr>
<tr>
<td><strong>N-Queens</strong></td>
<td>Valid column for queen</td>
<td>Current row</td>
</tr>
<tr>
<td><strong>Sudoku</strong></td>
<td>Valid digit 1-9</td>
<td>Current cell</td>
</tr>
</tbody></table>
<h2>Debugging Tips 🐛</h2>
<ol>
<li><strong>Print the tree</strong> - Add <code>print(f&quot;path={path}, index={index}&quot;)</code> to visualize</li>
<li><strong>Test small inputs</strong> - Use <code>[1,2]</code> not <code>[1,2,3,4,5]</code></li>
<li><strong>Check base case</strong> - Does it catch ALL valid solutions?</li>
<li><strong>Verify undo</strong> - Is state identical after <code>pop()</code>?</li>
<li><strong>Count calls</strong> - Add counter to see recursion depth</li>
</ol>
<hr>
<p><strong>Keep this template in your toolkit - it solves hundreds of problems!</strong> 🎯</p>
`,
  },

  // BLOCK 16: Practice Problems Intro
  {
    type: "text",
    content: `<h1>🚀 Ready to Practice?</h1>
<p>You&#39;ve learned the backtracking pattern! Now apply it to real LeetCode-style problems.</p>
<p>Each problem uses the same template you just learned - only the <strong>choices</strong> and <strong>constraints</strong> are different!</p>
<h2>Practice Problems (Click to Start)</h2>
<ol>
<li><p><strong>Subsets</strong> - Generate all subsets (Medium)</p>
<ul>
<li>What you learned in this lesson!</li>
<li>2 choices per element: include or exclude</li>
</ul>
</li>
<li><p><strong>Permutations</strong> - All arrangements of elements (Medium)</p>
<ul>
<li>Choose from remaining unused elements</li>
<li>Track which elements have been used</li>
</ul>
</li>
<li><p><strong>Combination Sum</strong> - Find combinations summing to target (Medium)</p>
<ul>
<li>Choose elements that don&#39;t exceed target</li>
<li>Can reuse elements unlimited times</li>
</ul>
</li>
</ol>
<p><strong>Tip:</strong> For each problem, draw the decision tree first, then code!</p>
`,
  },

  // BLOCK 17: Practice Problems Component
  {
    type: "component",
    componentName: "PracticeProblemsSection",
  },
];

// Lessons - Backtracking with Progressive Tasks
export const dsaLessons: DSALesson[] = [
  {
    id: "backtracking-tree-discovery",
    title: "Backtracking Tree Discovery",
    description:
      "Learn backtracking through step-by-step interactive coding",
    topic: "backtracking",
    content: sharedBacktrackingContent,
    problems: ["subsets", "permutations", "combination-sum"],
    quizzes: [
      {
        id: 'tc-quiz-1',
        question: `**Level 1: O(1) - Constant Time**

Analyze this code:

\`\`\`python
def get_first_element(arr):
    return arr[0]
\`\`\`

What is its time complexity?`,
        options: [
          'O(1) - constant time, doesn\'t depend on array size',
          'O(n) - has to access the array',
          'O(log n) - accessing memory is logarithmic',
          'Depends on the size of the array'
        ],
        correctAnswer: 0,
        explanation: 'This is O(1) - constant time! Array indexing is a direct memory access operation. Whether the array has 10 elements or 10 million, accessing arr[0] takes the same time. No loops, no recursion = O(1).'
      },
      {
        id: 'tc-quiz-2',
        question: `**Level 2: O(n) - Linear Time**

Analyze this code:

\`\`\`python
def find_max(arr):
    max_val = arr[0]
    for num in arr:
        if num > max_val:
            max_val = num
    return max_val
\`\`\`

What is its time complexity?`,
        options: [
          'O(1) - just returns a number',
          'O(n) - loops through array once',
          'O(n²) - compares all elements',
          'O(log n) - searches efficiently'
        ],
        correctAnswer: 1,
        explanation: 'This is O(n) - linear time! The loop iterates through all n elements exactly once. If the array doubles in size, the time doubles. This is the characteristic of O(n): time grows proportionally with input size.'
      },
      {
        id: 'tc-quiz-3',
        question: `**Level 3: O(log n) - Logarithmic Time**

Analyze this binary search:

\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
\`\`\`

What is its time complexity?`,
        options: [
          'O(n) - might check all elements',
          'O(log n) - halves search space each iteration',
          'O(n/2) - checks half the elements',
          'O(1) - simple comparisons'
        ],
        correctAnswer: 1,
        explanation: 'This is O(log n) - logarithmic time! Each iteration cuts the search space in HALF. For an array of 1000 elements, you need at most ~10 comparisons (log₂1000 ≈ 10). For 1 million elements? Only ~20 comparisons. This is incredibly efficient!'
      },
      {
        id: 'tc-quiz-4',
        question: `**Level 4: O(n²) - Quadratic Time**

Analyze this nested loop:

\`\`\`python
def find_duplicates(arr):
    for i in range(len(arr)):
        for j in range(len(arr)):
            if i != j and arr[i] == arr[j]:
                return True
    return False
\`\`\`

What is its time complexity?`,
        options: [
          'O(n) - two separate loops',
          'O(2n) - checking twice',
          'O(n²) - nested loops',
          'O(log n) - efficient search'
        ],
        correctAnswer: 2,
        explanation: 'This is O(n²) - quadratic time! Nested loops where both iterate n times means n × n = n² operations. For n=10, that\'s 100 operations. For n=1000, that\'s 1,000,000 operations! Each outer loop iteration runs the entire inner loop.'
      },
      {
        id: 'tc-quiz-5',
        question: `**Level 5: Advanced - Nested Loop Trick**

Analyze this tricky code:

\`\`\`python
def mysterious_function(arr):
    for i in range(len(arr)):
        for j in range(i, len(arr)):
            print(arr[i], arr[j])
\`\`\`

What is its time complexity?`,
        options: [
          'O(n) - inner loop depends on outer',
          'O(n²) - nested loops',
          'O(n/2) - only half iterations',
          'O(log n) - dividing problem'
        ],
        correctAnswer: 1,
        explanation: 'Tricky! This is still O(n²). The inner loop starts at i, not 0, so it runs: n + (n-1) + (n-2) + ... + 1 times. This sum equals n(n+1)/2 = O(n²). Even though we do fewer iterations than a standard nested loop, it\'s still quadratic growth!'
      },
      {
        id: 'tc-quiz-6',
        question: `**Level 6: Advanced - Sliding Window Pattern**

Analyze this sliding window code:

\`\`\`python
def longest_substring_k_distinct(s, k):
    char_count = {}
    left = 0
    max_len = 0
    
    for right in range(len(s)):
        char_count[s[right]] = char_count.get(s[right], 0) + 1
        
        while len(char_count) > k:
            char_count[s[left]] -= 1
            if char_count[s[left]] == 0:
                del char_count[s[left]]
            left += 1
        
        max_len = max(max_len, right - left + 1)
    
    return max_len
\`\`\`

What is its time complexity?`,
        options: [
          'O(n) - each element visited at most twice',
          'O(n²) - nested loops',
          'O(n log n) - efficient traversal',
          'O(k × n) - depends on k distinct chars'
        ],
        correctAnswer: 0,
        explanation: 'This is O(n) - linear time! Even though there\'s a while loop inside a for loop, each element is visited at most TWICE: once by the right pointer (expanding) and once by the left pointer (shrinking). The total visits are 2n = O(n). This is a common interview trick question!'
      }
    ],
  },
  {
    id: "time-complexity-basics",
    title: "Big O Fundamentals",
    description: "Master time complexity analysis with interactive stages and quizzes",
    topic: "time-complexity",
    estimatedTime: 30,
    content: [
      {
        type: "component",
        componentName: "TimeComplexityStageManager",
      },
    ],
    problems: [],
    quizzes: [
      {
        id: 'tc-quiz-1',
        question: `**Level 1: O(1) - Constant Time**

Analyze this code:

\`\`\`python
def get_first_element(arr):
    return arr[0]
\`\`\`

What is its time complexity?`,
        options: [
          'O(1) - constant time, doesn\'t depend on array size',
          'O(n) - has to access the array',
          'O(log n) - accessing memory is logarithmic',
          'Depends on the size of the array'
        ],
        correctAnswer: 0,
        explanation: 'This is O(1) - constant time! Array indexing is a direct memory access operation. Whether the array has 10 elements or 10 million, accessing arr[0] takes the same time. No loops, no recursion = O(1).'
      },
      {
        id: 'tc-quiz-2',
        question: `**Level 2: O(n) - Linear Time**

Analyze this code:

\`\`\`python
def find_max(arr):
    max_val = arr[0]
    for num in arr:
        if num > max_val:
            max_val = num
    return max_val
\`\`\`

What is its time complexity?`,
        options: [
          'O(1) - just returns a number',
          'O(n) - loops through array once',
          'O(n²) - compares all elements',
          'O(log n) - searches efficiently'
        ],
        correctAnswer: 1,
        explanation: 'This is O(n) - linear time! The loop iterates through all n elements exactly once. If the array doubles in size, the time doubles. This is the characteristic of O(n): time grows proportionally with input size.'
      },
      {
        id: 'tc-quiz-3',
        question: `**Level 3: O(log n) - Logarithmic Time**

Analyze this binary search:

\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
\`\`\`

What is its time complexity?`,
        options: [
          'O(n) - might check all elements',
          'O(log n) - halves search space each iteration',
          'O(n/2) - checks half the elements',
          'O(1) - simple comparisons'
        ],
        correctAnswer: 1,
        explanation: 'This is O(log n) - logarithmic time! Each iteration cuts the search space in HALF. For an array of 1000 elements, you need at most ~10 comparisons (log₂1000 ≈ 10). For 1 million elements? Only ~20 comparisons. This is incredibly efficient!'
      },
      {
        id: 'tc-quiz-4',
        question: `**Level 4: O(n²) - Quadratic Time**

Analyze this nested loop:

\`\`\`python
def find_duplicates(arr):
    for i in range(len(arr)):
        for j in range(len(arr)):
            if i != j and arr[i] == arr[j]:
                return True
    return False
\`\`\`

What is its time complexity?`,
        options: [
          'O(n) - two separate loops',
          'O(2n) - checking twice',
          'O(n²) - nested loops',
          'O(log n) - efficient search'
        ],
        correctAnswer: 2,
        explanation: 'This is O(n²) - quadratic time! Nested loops where both iterate n times means n × n = n² operations. For n=10, that\'s 100 operations. For n=1000, that\'s 1,000,000 operations! Each outer loop iteration runs the entire inner loop.'
      },
      {
        id: 'tc-quiz-5',
        question: `**Level 5: Advanced - Nested Loop Trick**

Analyze this tricky code:

\`\`\`python
def mysterious_function(arr):
    for i in range(len(arr)):
        for j in range(i, len(arr)):
            print(arr[i], arr[j])
\`\`\`

What is its time complexity?`,
        options: [
          'O(n) - inner loop depends on outer',
          'O(n²) - nested loops',
          'O(n/2) - only half iterations',
          'O(log n) - dividing problem'
        ],
        correctAnswer: 1,
        explanation: 'Tricky! This is still O(n²). The inner loop starts at i, not 0, so it runs: n + (n-1) + (n-2) + ... + 1 times. This sum equals n(n+1)/2 = O(n²). Even though we do fewer iterations than a standard nested loop, it\'s still quadratic growth!'
      },
      {
        id: 'tc-quiz-6',
        question: `**Level 6: Advanced - Sliding Window Pattern**

Analyze this sliding window code:

\`\`\`python
def longest_substring_k_distinct(s, k):
    char_count = {}
    left = 0
    max_len = 0

    for right in range(len(s)):
        char_count[s[right]] = char_count.get(s[right], 0) + 1

        while len(char_count) > k:
            char_count[s[left]] -= 1
            if char_count[s[left]] == 0:
                del char_count[s[left]]
            left += 1

        max_len = max(max_len, right - left + 1)

    return max_len
\`\`\`

What is its time complexity?`,
        options: [
          'O(n) - each element visited at most twice',
          'O(n²) - nested loops',
          'O(n log n) - efficient traversal',
          'O(k × n) - depends on k distinct chars'
        ],
        correctAnswer: 0,
        explanation: 'This is O(n) - linear time! Even though there\'s a while loop inside a for loop, each element is visited at most TWICE: once by the right pointer (expanding) and once by the left pointer (shrinking). The total visits are 2n = O(n). This is a common interview trick question!'
      }
    ],
  },
];

// Modules
export const dsaModules: DSAModule[] = [
  {
    id: "python-mechanics",
    title: "Module 0A: Python Mechanics",
    description: "Master the core syntax and behavior of Python needed for DSA: Lists, references, copies, strings, loops, and functions.",
    icon: "🐍",
    difficulty: "beginner",
    estimatedTime: 120,
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "python-algorithmic-thinking",
    title: "Module 0B: Python Algorithmics",
    description: "Bridge the gap between syntax and algorithms. Master Dictionaries, Sets, and the Collections module.",
    icon: "🧩",
    difficulty: "beginner",
    estimatedTime: 180,
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "time-complexity-foundations",
    title: "Module 1: Time Complexity Foundations",
    description:
      "Learn to analyze code performance before optimizing. Understand Big O notation, identify bottlenecks, and recognize when code is slow.",
    icon: "⏱️",
    difficulty: "beginner",
    estimatedTime: 150,
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "array-iteration-techniques",
    title: "Module 2: Array Iteration Techniques",
    description:
      "Master three fundamental array iteration patterns: Two Pointers, Array Partitioning, and Sliding Window",
    icon: "🔢",
    difficulty: "beginner",
    estimatedTime: 480,
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "hash-map-fundamentals",
    title: "Module 3: Hash Map Fundamentals",
    description:
      "Master hash map patterns to optimize O(n²) solutions to O(n)",
    icon: "🗺️",
    difficulty: "beginner",
    estimatedTime: 480,
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "sliding-window-mastery",
    title: "Module: Sliding Window Mastery",
    description:
      "Master all sliding window patterns: fixed, maximum, minimum, restarting, and frequency-based windows",
    icon: "🪟",
    difficulty: "intermediate",
    estimatedTime: 360,
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "prefix-suffix-arrays",
    title: "Module: Prefix & Suffix Arrays",
    description:
      "Master prefix and suffix array patterns to solve problems requiring information from both directions",
    icon: "↔️",
    difficulty: "intermediate",
    estimatedTime: 300,
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "stack-discovery-lifo",
    title: "Module: Stack Discovery (LIFO In Action)",
    description:
      "Learn the stack mindset, interactive push/pop intuition, the three core templates, and how monotonic stacks unlock next greater/smaller style problems",
    icon: "📚",
    difficulty: "intermediate",
    estimatedTime: 240,
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "queue-discovery-fifo",
    title: "Module: Queue Discovery (FIFO Thinking)",
    description:
      "Understand queues, simulate them by hand, master circular queues, and learn the three queue templates used in BFS, sliding windows, and scheduling",
    icon: "🚶",
    difficulty: "intermediate",
    estimatedTime: 240,
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "intervals-mastery",
    title: "Module: Intervals",
    description:
      "Master interval problems with patterns for merging, inserting, sweep line, and greedy selection",
    icon: "📅",
    difficulty: "intermediate",
    estimatedTime: 300,
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "python-oop-libraries",
    title: "Module 5: Python OOP & Essential Libraries",
    description:
      "Learn classes, objects, and Python libraries (collections, heapq) needed for advanced data structures",
    icon: "🏗️",
    difficulty: "intermediate",
    estimatedTime: 90,
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "linked-list-mastery",
    title: "Module 6: Linked List Mastery",
    description:
      "Master pointer manipulation, list reversal, and cycle detection",
    icon: "🔗",
    difficulty: "intermediate",
    estimatedTime: 420,
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "recursion-trees-foundation",
    title: "Module 7: Recursion & Trees Foundation",
    description:
      "Master recursion fundamentals and learn to visualize recursive calls as trees - foundation for backtracking and DP",
    icon: "🔄",
    difficulty: "advanced",
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "trees-traversals",
    title: "Module 8: Trees & Tree Traversals",
    description:
      "Master tree data structures, DFS/BFS traversals, and binary search trees",
    icon: "🌳",
    difficulty: "intermediate",
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "binary-search-sorting",
    title: "Module 9: Binary Search & Sorting",
    description:
      "Master binary search patterns and fundamental sorting algorithms",
    icon: "🔍",
    difficulty: "intermediate",
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "graphs-bfs-dfs",
    title: "Module 10: Graphs & BFS/DFS",
    description:
      "Master graph representations, traversals, and shortest path algorithms",
    icon: "🕸️",
    difficulty: "advanced",
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "union-find-disjoint-set",
    title: "Module 11: Union-Find (Disjoint Set)",
    description:
      "Master Union-Find data structure for efficiently tracking connected components",
    icon: "🔗",
    difficulty: "advanced",
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "backtracking-decision-trees",
    title: "Module 12: Backtracking & Decision Trees",
    description:
      "Apply recursion to decision problems - explore all possibilities using the make→recurse→undo pattern",
    icon: "🔙",
    difficulty: "advanced",
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "dynamic-programming",
    title: "Module 13: Dynamic Programming",
    description:
      "Transform slow recursion into fast DP by spotting and caching repeated subproblems in recursion trees",
    icon: "📈",
    difficulty: "advanced",
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "heaps-priority-queues",
    title: "Module 14: Heaps & Priority Queues",
    description:
      "Master heap operations and solve top K problems efficiently",
    icon: "⛰️",
    difficulty: "advanced",
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "tries-string-patterns",
    title: "Module 15: Tries & Advanced String Patterns",
    description:
      "Master trie data structure and advanced string manipulation techniques",
    icon: "🔤",
    difficulty: "advanced",
    lessons: [],
    progressiveLesson: true,
  },
  // advanced-topics-mastery removed - exercises moved to topic modules
  {
    id: "bit-manipulation-math",
    title: "Module 16: Bit Manipulation & Math",
    description:
      "Master bitwise operations and mathematical problem-solving techniques",
    icon: "🔢",
    difficulty: "intermediate",
    estimatedTime: 360,
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "concurrency-threading",
    title: "Module 17: Concurrency & Threading",
    description:
      "Master Python threading, synchronization primitives (Lock, Semaphore, Event, Condition), thread pools, and concurrent patterns",
    icon: "🔄",
    difficulty: "advanced",
    estimatedTime: 360,
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "system-design-patterns",
    title: "Module 18: System Design Patterns",
    description:
      "Learn scalable system components: Load Balancers, Caching, Sharding, CAP Theorem, and Consistent Hashing",
    icon: "🏗️",
    difficulty: "advanced",
    estimatedTime: 360,
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "ood-patterns",
    title: "Module 19: OOD Patterns",
    description:
      "Apply SOLID principles and Design Patterns (Factory, Observer, Strategy, Singleton) to solve architectural problems",
    icon: "📐",
    difficulty: "advanced",
    estimatedTime: 360,
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "async-patterns",
    title: "Module 20: Async Patterns",
    description:
      "Master Asynchronous Programming: Event Loops, Coroutines, Async/Await logic, and Non-blocking I/O",
    icon: "⚡",
    difficulty: "advanced",
    estimatedTime: 360,
    lessons: [],
    progressiveLesson: true,
  },
  {
    id: "smart-practice",
    title: "Smart Practice",
    description:
      "Adaptive practice system that selects problems based on your skill level and learning progress",
    icon: "🎯",
    difficulty: "intermediate",
    estimatedTime: 0,
    lessons: [],
    progressiveLesson: false,
  },
];

// Complete Course
export const dsaCourse: DSACourse = {
  id: "dsa-python",
  title: "Data Structures & Algorithms in Python",
  description:
    "Master DSA fundamentals with Python - from basics to advanced topics",
  modules: dsaModules,
  problems: dsaProblems,
};
