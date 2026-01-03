import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module00b_PythonAlgorithmicLessonSmartPracticeExercises: ExerciseSection[] = [
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-valid-anagram',
      title: 'Applied: Valid Anagram',
      description: 'Check if two strings are anagrams',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n)', space: 'O(k)', notes: 'k = unique chars; count frequencies and compare' },
      instruction: `# Valid Anagram

Check if two strings are anagrams (same letters, different order).

## Examples

\`\`\`python
is_anagram("listen", "silent")
# Returns: True

is_anagram("hello", "world")
# Returns: False
\`\`\`

## Hint

Count character frequencies in both strings and compare the dictionaries.`,
      starterCode: `def is_anagram(s, t):
    # Your code here
    pass`,
      solution: {
        afterAttempt: 3,
        text: `def is_anagram(s, t):
    if len(s) != len(t):
        return False

    freq_s = {}
    freq_t = {}

    for char in s:
        freq_s[char] = freq_s.get(char, 0) + 1

    for char in t:
        freq_t[char] = freq_t.get(char, 0) + 1

    return freq_s == freq_t`
      },
      testCases: [
        { input: '"listen", "silent"', expectedOutput: 'True' },
        { input: '"hello", "world"', expectedOutput: 'False' }
      ],
      hints: [
        { afterAttempt: 1, text: 'Count character frequencies in both strings' },
        { afterAttempt: 2, text: 'Compare the two frequency dictionaries' }
      ],
      solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### Approach 1: Sorting
\`\`\`python
def is_anagram(s, t):
    return sorted(s) == sorted(t)
\`\`\`
**Time: O(n log n)** | **Space: O(n)** for sorted arrays

Sort both strings and compare. Anagrams have identical sorted characters.

### Bottleneck Analysis
**Inefficiency:** Sorting takes O(n log n). Can we do better?

**Key Insight:** Anagrams have same character frequencies. Instead of sorting, just count frequencies and compare in O(n).

### Optimization - Frequency Counting
\`\`\`python
def is_anagram(s, t):
    if len(s) != len(t):
        return False

    freq_s = {}
    freq_t = {}

    for char in s:
        freq_s[char] = freq_s.get(char, 0) + 1
    for char in t:
        freq_t[char] = freq_t.get(char, 0) + 1

    return freq_s == freq_t
\`\`\`

Count character frequencies in each string, compare dictionaries. Python's dict comparison checks all key-value pairs.

### Final Complexity
- **Time: O(n)** - two passes to count, one to compare
- **Space: O(k)** - k unique characters (at most 26 for lowercase)

### Pattern Learned
**"Frequency Counting for Anagrams"** → Anagrams have identical character frequencies. Use hash map to count in O(n) instead of sorting in O(n log n). Classic pattern for anagram detection, grouping, and character analysis problems.`,
      complexityQuizPlacement: 'after',
      difficulty: 'easy',
      timeLimit: 600,
      passingScore: 100
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-set-operations',
      title: 'Exercise: Find Common Elements',
      description: 'Use sets to find common elements between two lists',
      targetComplexity: { time: 'O(n + m)', space: 'O(min(n, m))', notes: 'Convert to sets and intersect; membership O(1) amortized' },
      requiredForProgress: false,
      instruction: `# Find Common Elements

Implement \`common_elements\` that takes two lists and returns a list of elements that appear in BOTH lists.

## Examples

\`\`\`python
common_elements([1, 2, 3, 4], [3, 4, 5, 6])
# Returns: [3, 4]

common_elements([1, 2, 2, 3], [2, 2, 3, 4])
# Returns: [2, 3]

common_elements([1, 2], [3, 4])
# Returns: []
\`\`\`

## Your Task

Use set intersection!`,
      starterCode: `def common_elements(list1, list2):
    # Your code here
    pass`,
      solution: {
        afterAttempt: 3,
        text: `def common_elements(list1, list2):
    # Convert to sets and find intersection
    set1 = set(list1)
    set2 = set(list2)
    return list(set1 & set2)

    # Or one line:
    # return list(set(list1) & set(list2))`
      },
      testCases: [
        { input: '[1, 2, 3, 4], [3, 4, 5, 6]', expectedOutput: '[3, 4]' },
        { input: '[1, 2, 2, 3], [2, 2, 3, 4]', expectedOutput: '[2, 3]' },
        { input: '[1, 2], [3, 4]', expectedOutput: '[]' }
      ],
      hints: [
        { afterAttempt: 1, text: 'Convert both lists to sets: set(list1), set(list2)' },
        { afterAttempt: 2, text: 'Use set1 & set2 to find intersection, then convert back to list' }
      ],
      solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### Approach 1: Brute Force - Nested Loops
\`\`\`python
def common_elements(list1, list2):
    result = []
    for x in list1:
        if x in list2 and x not in result:
            result.append(x)
    return result
\`\`\`
**Time: O(n × m)** | **Space: O(k)** where k = common elements

For each element in list1, scan list2 to check membership (O(m) per element).

### Bottleneck Analysis
**Inefficiency:** Nested structure causes O(n×m) time. Membership check in list is O(m).

**Key Insight:** Sets provide O(1) membership testing. Convert to sets and use set intersection operator for O(n+m) time.

### Optimization - Set Intersection
\`\`\`python
def common_elements(list1, list2):
    return list(set(list1) & set(list2))
\`\`\`

Convert both to sets (auto-removes duplicates), use & operator for intersection, convert back to list.

### Final Complexity
- **Time: O(n + m)** - O(n+m) to create sets, O(min(n,m)) for intersection
- **Space: O(min(n, m))** - intersection contains at most min(n,m) elements

### Pattern Learned
**"Set Intersection for Common Elements"** → When finding elements present in multiple collections, sets provide O(1) membership with built-in intersection. Vastly superior to O(n×m) nested loops. Essential for overlap detection and deduplication.`,
      difficulty: 'easy',
      timeLimit: 300,
      passingScore: 100
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-defaultdict',
      title: 'Grouping with defaultdict',
      description: 'Use defaultdict(list) to group items',
      requiredForProgress: false,
      targetComplexity: { time: 'O(n·k log k)', space: 'O(n·k)', notes: 'Focus on the grouping mechanics' },
      instruction: `# Grouping with defaultdict

Use \`defaultdict(list)\` to group words that are anagrams of each other.

> **Note:** This teaches the **grouping pattern**. Don't worry about the sorting cost for now.

**Hint:** Anagrams have the same characters when sorted!

## Examples

\`\`\`python
group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"])
# Returns: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]

group_anagrams(["a"])
# Returns: [["a"]]
\`\`\`

## Your Task

Use \`defaultdict(list)\` to group words by their sorted characters!`,
      starterCode: `from collections import defaultdict

def group_anagrams(words):
    # Your code here
    pass`,
      solution: {
        afterAttempt: 3,
        text: `from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)

    for word in words:
        # Sort characters to get key
        key = ''.join(sorted(word))
        groups[key].append(word)

    return list(groups.values())`
      },
      testCases: [
        {
          input: '["eat", "tea", "tan", "ate", "nat", "bat"]',
          expectedOutput: '[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]'
        },
        {
          input: '["a"]',
          expectedOutput: '[["a"]]'
        }
      ],
      hints: [
        { afterAttempt: 1, text: 'Use defaultdict(list) to store groups' },
        { afterAttempt: 2, text: 'Sort each word to get a key: key = "".join(sorted(word))' },
        { afterAttempt: 3, text: 'Add word to its group: groups[key].append(word)' }
      ],
      solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Approach 1: Brute Force - Compare All Pairs
\`\`\`python
def group_anagrams(words):
    used = [False] * len(words)
    result = []

    for i in range(len(words)):
        if used[i]:
            continue
        group = [words[i]]
        for j in range(i + 1, len(words)):
            if not used[j] and sorted(words[i]) == sorted(words[j]):
                group.append(words[j])
                used[j] = True
        result.append(group)
    return result
\`\`\`
**Time: O(n² × k log k)** | **Space: O(n×k)**

Compare each word with all others, sorting each time to check anagram status.

### 🟡 Bottleneck Analysis
**Inefficiency:** Comparing all pairs is O(n²), and each comparison involves sorting O(k log k).

**Key Insight:** Instead of comparing all pairs, use sorted characters as a hash key. All anagrams share the same key - group in single pass!

### 🟢 Optimization - Hash Map with Sorted Key
\`\`\`python
from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)
    for word in words:
        key = ''.join(sorted(word))  # Canonical form
        groups[key].append(word)
    return list(groups.values())
\`\`\`

Sort each word once to create key, use defaultdict to group automatically, single pass.

### Final Complexity
- **Time: O(n × k log k)** - n words, sort each once (k log k)
- **Space: O(n × k)** - store all words in groups

### Pattern Learned
**"Hash Map Grouping with Canonical Key"** → When grouping by equivalence (anagrams, similar items), create a canonical representation as hash key. Sorted characters work for anagrams. defaultdict(list) auto-initializes groups. Reduces O(n²) comparisons to O(n) grouping.`,
      complexityQuizPlacement: 'after',
      difficulty: 'medium',
      timeLimit: 600,
      passingScore: 100
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-counter',
      title: 'Counter Iteration Order',
      description: 'Understand why we iterate the string, not the Counter',
      targetComplexity: { time: 'O(n)', space: 'O(k)', notes: 'Focus on preserving order' },
      requiredForProgress: false,
      instruction: `# Counter Iteration Order

Find the **first** character that appears only once.

> **Critical Mechanic:** A \`Counter\` is a dictionary (unordered or insertion-ordered). To find the **first** unique character in the original string, you must iterate through the **string**, not the Counter.
>
> *This problem prepares you for a mastery check later.*

## Examples

\`\`\`python
first_unique_char("leetcode")
# Returns: "l"

first_unique_char("loveleetcode")
# Returns: "v"

first_unique_char("aabb")
# Returns: ""
\`\`\`

## Your Task

Use \`Counter\` to count frequencies, then find first char with count 1!`,
      starterCode: `from collections import Counter

def first_unique_char(s):
    # Your code here
    pass`,
      solution: {
        afterAttempt: 3,
        text: `from collections import Counter

def first_unique_char(s):
    freq = Counter(s)

    for char in s:
        if freq[char] == 1:
            return char

    return ""`
      },
      testCases: [
        { input: '"leetcode"', expectedOutput: '"l"' },
        { input: '"loveleetcode"', expectedOutput: '"v"' },
        { input: '"aabb"', expectedOutput: '""' }
      ],
      hints: [
        { afterAttempt: 1, text: 'Use Counter(s) to get character frequencies' },
        { afterAttempt: 2, text: 'Loop through s and check if freq[char] == 1' }
      ],
      solutionExplanation: `## Solution Analysis

### 🟢 Approach

\`\`\`python
from collections import Counter

def first_unique_char(s):
    freq = Counter(s)

    for char in s:
        if freq[char] == 1:
            return char

    return ""
\`\`\`

- First pass: Use Counter to count all character frequencies O(n)
- Second pass: Iterate through string in original order
- Return first character with frequency == 1
- If none found, return empty string
- Preserves original character order

### Complexity
- **Time: O(n)** - two passes through string, both O(n)
- **Space: O(k)** - k unique characters (at most 26 for lowercase)

### Key Concept
**"Counter from Collections"** → Counter(iterable) builds frequency map. Cleaner than dict.get(key, 0) + 1 pattern. Use two-pass: first count frequencies, then find answer. Essential for frequency analysis and finding unique/duplicate elements`,
      complexityQuizPlacement: 'after',
      difficulty: 'easy',
      timeLimit: 300,
      passingScore: 100
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'mastery-snapshot-lists',
      title: 'Reference Semantics (Snapshot Lists)',
      description: 'Build a list of prefixes (snapshots) correctly using copies',
      targetComplexity: { time: 'O(n²)', space: 'O(n²)', notes: 'Copying list at each step takes O(n), done n times' },
      requiredForProgress: true,
      metadata: { failureCategory: 'mutable-references' },
      instruction: `# Problem 1: Reference Semantics (Snapshot Lists)

You are given a list of integers.
Build a list of prefixes, where each prefix is a snapshot of the list up to index i.

Input:  [1, 2, 3]
Output: [[1], [1, 2], [1, 2, 3]]

Each prefix must be an independent list.

---

## Constraints

- You must use a loop
- You may not use copy.deepcopy
- Modifying current later must not affect previous entries

## Explanation Required

After solving, explain: Why is current[:] necessary here? What would happen if we used result.append(current)?

---

## Starter Code

\`\`\`python
def build_prefixes(nums):
    result = []
    current = []

    for num in nums:
        current.append(num)
        # TODO: add current snapshot to result

    return result
\`\`\``,
      starterCode: `def build_prefixes(nums):
    result = []
    current = []

    for num in nums:
        current.append(num)
        # TODO: add current snapshot to result

    return result`,
      solution: {
        afterAttempt: 1,
        text: `def build_prefixes(nums):
    result = []
    current = []

    for num in nums:
        current.append(num)
        result.append(current[:])  # snapshot

    return result`
      },
      testCases: [
        { input: '[1, 2, 3]', expectedOutput: '[[1], [1, 2], [1, 2, 3]]' },
        { input: '[10]', expectedOutput: '[[10]]' },
        { input: '[]', expectedOutput: '[]' }
      ],
      hints: [
        { afterAttempt: 1, text: 'Use slice notation \`current[:]\` to create a copy.' }
      ],
      solutionExplanation: `## Solution Explanation

\`\`\`python
def build_prefixes(nums):
    result = []
    current = []

    for num in nums:
        current.append(num)
        result.append(current[:])  # snapshot

    return result
\`\`\`

### Explanation (Required)
**Why is \`current[:]\` necessary?**
We need to append a **copy** of the list, not a reference. If we append \`current\` directly, \`result\` will contain multiple references to the SAME list object. As \`current\` changes in future iterations, ALL entries in \`result\` would update to match the final state!

**What would happen if we used \`result.append(current)\`?**
For input \`[1, 2, 3]\`, the output would be \`[[1, 2, 3], [1, 2, 3], [1, 2, 3]]\` because all 3 elements point to the same list object which ends up as \`[1, 2, 3]\`.

### Complexity
* **Time:** O(n²) — total elements copied (1 + 2 + ... + n)
* **Space:** O(n²) — storing all prefixes`,
      difficulty: 'medium',
      timeLimit: 600,
      passingScore: 100
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'mastery-first-unique-char',
      title: 'Order + Frequency',
      description: 'Return the first character in a string that appears exactly once',
      targetComplexity: { time: 'O(n)', space: 'O(k)', notes: 'k = unique characters' },
      requiredForProgress: true,
      metadata: { failureCategory: 'frequency-counting' },
      instruction: `# Problem 2: Order + Frequency

Return the first character in a string that appears exactly once.
If none exists, return an empty string.

Input:  "swiss"
Output: "w"

Order matters.

---

## Constraints

- Case-sensitive
- Must preserve original order
- No sorting allowed

## Explanation Required

After solving, explain: Why do we need two passes? Why does iterating the string again matter?

---

## Starter Code

\`\`\`python
def first_unique_char(s):
    # TODO
    pass
\`\`\``,
      starterCode: `def first_unique_char(s):
    # TODO
    pass`,
      solution: {
        afterAttempt: 1,
        text: `from collections import Counter

def first_unique_char(s):
    freq = Counter(s)

    for ch in s:
        if freq[ch] == 1:
            return ch

    return ""`
      },
      testCases: [
        { input: '"swiss"', expectedOutput: '"w"' },
        { input: '"leetcode"', expectedOutput: '"l"' },
        { input: '"aabb"', expectedOutput: '""' }
      ],
      hints: [
        { afterAttempt: 1, text: 'Use Counter to count frequencies first, then iterate original string.' }
      ],
      solutionExplanation: `## Solution Explanation

\`\`\`python
from collections import Counter

def first_unique_char(s):
    freq = Counter(s)

    for ch in s:
        if freq[char] == 1:
            return ch

    return ""
\`\`\`

### Explanation (Required)
**Why do we need two passes?**
Pass 1 counts all frequencies so we know which characters are unique. Pass 2 checks each character in the original order to find the *first* one that has a count of 1.

**Why does iterating the string again matter?**
If we just iterated through the \`freq\` dictionary (e.g., \`for ch in freq\`), we would lose the original order of appearance! We must iterate through \`s\` to ensure we return the *first* unique character as it appears in the input.

### Complexity
* **Time:** O(n) - two passes
* **Space:** O(k) - where k = unique characters`,
      difficulty: 'medium',
      timeLimit: 600,
      passingScore: 100
    },
  {
      type: 'exercise',
      placement: 'module',
      id: 'mastery-first-drop',
      title: 'Boundary Reasoning (First Drop)',
      description: 'Return the first element strictly smaller than the element before it',
      targetComplexity: { time: 'O(n)', space: 'O(1)', notes: 'Single pass' },
      requiredForProgress: true,
      metadata: { failureCategory: 'while-loop-control' },
      instruction: `# Problem 3: Boundary Reasoning (First Drop)

Given a list of integers, return the first element that is strictly smaller than the element before it.

Input:  [1, 3, 5, 4, 6]
Output: 4

If no such element exists, return None.

---

## Constraints

- Must use a while loop
- Must not raise IndexError
- Must exit early when found

## Explanation Required

After solving, explain: Why does the loop start at index 1? What error would occur if it started at 0?

---

## Starter Code

\`\`\`python
def first_drop(nums):
    # Use a while loop
    pass
\`\`\``,
      starterCode: `def first_drop(nums):
    # Use a while loop
    pass`,
      solution: {
        afterAttempt: 1,
        text: `def first_drop(nums):
    i = 1
    while i < len(nums):
        if nums[i] < nums[i - 1]:
            return nums[i]
        i += 1
    return None`
      },
      testCases: [
        { input: '[1, 3, 5, 4, 6]', expectedOutput: '4' },
        { input: '[1, 2, 3]', expectedOutput: 'None' },
        { input: '[5, 4, 3]', expectedOutput: '4' }
      ],
      hints: [
        { afterAttempt: 1, text: 'Start index at 1 and compare nums[i] with nums[i-1].' }
      ],
      solutionExplanation: `## Solution Explanation

\`\`\`python
def first_drop(nums):
    i = 1
    while i < len(nums):
        if nums[i] < nums[i - 1]:
            return nums[i]
        i += 1
    return None
\`\`\`

### Explanation (Required)
**Why does the loop start at index 1?**
We need to compare \`nums[i]\` with \`nums[i - 1]\`. If we started at index 0, \`i - 1\` would be -1 (the last element in Python, or invalid in other languages), which is logically incorrect for checking the "element before it". The first element has no element before it.

**What error would occur if it started at 0?**
In logic, it would compare the first element with the last element (due to Python's negative indexing \`nums[-1]\`), which is a bug! We only want to compare adjacent elements from left to right.

### Complexity
* **Time:** O(n)
* **Space:** O(1)`,
      difficulty: 'medium',
      timeLimit: 300,
      passingScore: 100
    }
];
