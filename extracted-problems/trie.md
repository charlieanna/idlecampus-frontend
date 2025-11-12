# TRIE Problems

Total Problems: 15

---

## 1. Implement Trie (Prefix Tree)

**Difficulty:** medium
**Concept:** trie
**Family:** trie:basic

### Description

Implement a trie (prefix tree) with insert, search, and startsWith methods.

💡 FUNDAMENTAL STRUCTURE:
- Each node has a dictionary of children (26 letters max)
- Each node has is_end flag to mark complete words
- Root is an empty node (no value)

🎯 WHY TRIE OVER HASH MAP?
- Hash map: O(m) for search, but can't do prefix queries
- Trie: O(m) for search AND prefix queries!
- Space: O(n × m) where n = words, m = avg length

### Examples

**Example 1:**
- Input: Trie(), insert("apple"), search("apple"), search("app"), startsWith("app")
- Output: true, false, true
- Explanation: "apple" inserted. Search "apple" found. "app" not inserted. Prefix "app" exists.

### Hints

1. TrieNode has: children (dict) and is_end (bool)
2. Insert: Traverse/create path, mark end
3. Search: Traverse path, check is_end
4. StartsWith: Just traverse path, no need to check is_end
5. Root node is empty - it represents the start of all words

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(m) where m = word/prefix length
- **Space Complexity:** O(n × m) where n = words, m = avg length

### Test Cases

**Test 1:** Insert and search
- Input: "[\"Trie\",\"insert\",\"search\"], [[],[\"apple\"],[\"apple\"]]"
- Expected: "[null,null,true]"

**Test 2:** Prefix vs full word
- Input: "[\"Trie\",\"insert\",\"search\",\"startsWith\"], [[],[\"apple\"],[\"app\"],[\"app\"]]"
- Expected: "[null,null,false,true]"

---

## 2. Longest Common Prefix

**Difficulty:** medium
**Concept:** trie
**Family:** trie:lcp

### Description

Find the longest common prefix among an array of strings using a trie.

🎯 TRIE APPROACH: Build trie, then traverse until:
- Node has multiple children (branching = prefix ends)
- Node is end of word (shorter word ends prefix)
- Reached end of path

💡 ALTERNATIVE: Can solve without trie using vertical scanning, but trie makes the concept clearer!

### Examples

**Example 1:**
- Input: strs = ["flower","flow","flight"]
- Output: "fl"
- Explanation: Common prefix is "fl"

**Example 2:**
- Input: strs = ["dog","racecar","car"]
- Output: ""
- Explanation: No common prefix

### Hints

1. Build trie from all words
2. Add count field to track how many words pass through each node
3. Traverse from root while: single child AND not is_end AND count == len(strs)
4. Stop when branching (len(children) > 1) or word ends early (is_end)
5. Edge case: Empty array or array with empty string

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(S) where S = sum of all characters
- **Space Complexity:** O(S) for trie

### Test Cases

**Test 1:** Normal case
- Input: "[\"flower\",\"flow\",\"flight\"]"
- Expected: "\"fl\""

**Test 2:** No common prefix
- Input: "[\"dog\",\"racecar\",\"car\"]"
- Expected: "\"\""

**Test 3:** Shorter word
- Input: "[\"ab\",\"a\"]"
- Expected: "\"a\""

---

## 3. Word Search II (Board + Trie)

**Difficulty:** hard
**Concept:** trie
**Family:** trie:board-search

### Description

Find all words from dictionary that exist in a 2D board. Letters must be adjacent (not diagonal).

💡 WHY TRIE IS ESSENTIAL:
- Brute force: For each word, DFS the board = O(words × 4^L × m × n)
- With trie: Single DFS explores all words simultaneously = O(m × n × 4^L)

🎯 ALGORITHM:
1. Build trie from all words
2. DFS from each cell, guided by trie
3. When reaching is_end, found a word!
4. Backtrack to explore other paths

### Examples

**Example 1:**
- Input: board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]
- Output: ["oath","eat"]
- Explanation: "oath" and "eat" can be found in the board

### Hints

1. Build trie with word stored at end nodes (not just is_end flag)
2. DFS explores board guided by trie - if char not in children, prune
3. When reaching node.word, found a match! Add to result.
4. Mark visited with '#', backtrack after exploring
5. Start DFS from every cell in the board
6. Set node.word = None after finding to avoid duplicates

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(m × n × 4^L) where L = max word length
- **Space Complexity:** O(n × m) for trie where n = words, m = avg length

### Test Cases

**Test 1:** Find words in board
- Input: "([[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]], [\"oath\",\"pea\",\"eat\",\"rain\"])"
- Expected: "[\"oath\",\"eat\"]"

**Test 2:** Cannot reuse cells
- Input: "([[\"a\",\"b\"],[\"c\",\"d\"]], [\"abcb\"])"
- Expected: "[]"

---

## 4. Add and Search Word (Wildcard '.')

**Difficulty:** medium
**Concept:** trie

### Description

Design a data structure that supports adding words and searching with '.' wildcard that matches any letter.

💡 KEY CHALLENGE: '.' requires backtracking/DFS
- Regular char: Follow single path
- '.': Try ALL 26 possible paths

🎯 RECURSIVE SEARCH:
- Base case: Reached end of word
- If '.': Recursively try all children
- If char: Follow that specific child

### Examples

**Example 1:**
- Input: WordDictionary(), addWord("bad"), addWord("dad"), search("pad"), search(".ad"), search("b..")
- Output: false, true, true
- Explanation: ".ad" matches both "bad" and "dad", "b.." matches "bad"

### Hints

1. addWord is standard trie insert
2. search needs recursive DFS approach
3. For '.': try ALL children recursively, return True if ANY match
4. For regular char: check if it exists, recurse on that child only
5. Base case: i == len(word), return node.is_end
6. DFS(node, index) explores from node starting at word[index]

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(m) for add, O(26^m) worst case for search with all '.'
- **Space Complexity:** O(n × m) for trie

### Test Cases

**Test 1:** Wildcard match
- Input: "[\"WordDictionary\",\"addWord\",\"search\"], [[],[\"bad\"],[\".ad\"]]"
- Expected: "[null,null,true]"

**Test 2:** Multiple wildcards
- Input: "[\"WordDictionary\",\"addWord\",\"addWord\",\"search\"], [[],[\"bad\"],[\"dad\"],[\"b..\"]]"
- Expected: "[null,null,null,true]"

---

## 5. Replace Words (Dictionary Compression)

**Difficulty:** medium
**Concept:** trie

### Description

Replace words with their shortest root from dictionary.

💡 TRIE USAGE:
- Build trie from dictionary roots
- For each word, search trie for shortest matching prefix
- If prefix found (is_end), replace word with it

🎯 WHY TRIE?
- Could use list, but trie gives O(m) lookup vs O(d × m) where d = dictionary size

### Examples

**Example 1:**
- Input: dictionary = ["cat","bat","rat"], sentence = "the cattle was rattled by the battery"
- Output: "the cat was rat by the bat"
- Explanation: "cattle"→"cat", "rattled"→"rat", "battery"→"bat"

### Hints

1. Build trie from dictionary roots first
2. For each word in sentence, search trie for shortest prefix
3. Stop search when finding first is_end node - that's the root!
4. If no prefix found, keep original word
5. Use list to build prefix character by character
6. Return ''.join(prefix) when is_end is True

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n × m) where n = words, m = avg length
- **Space Complexity:** O(d × m) where d = dictionary size

### Test Cases

**Test 1:** Replace with roots
- Input: "([\"cat\",\"bat\",\"rat\"], \"the cattle was rattled by the battery\")"
- Expected: "\"the cat was rat by the bat\""

**Test 2:** Single char roots
- Input: "([\"a\",\"b\",\"c\"], \"aadsfasf absbs bbab cadsfafs\")"
- Expected: "\"a a b c\""

---

## 6. Map Sum Pairs

**Difficulty:** medium
**Concept:** trie

### Description

Implement MapSum with insert(key, val) and sum(prefix) that returns sum of all values with given prefix.

💡 TRIE ENHANCEMENT:
- Standard trie + value at each node
- sum(prefix): Traverse to prefix, then DFS to collect all values

🎯 OPTIMIZATION:
- Store sum at each node (incremental)
- Update: Track old value, adjust sums along path

### Examples

**Example 1:**
- Input: MapSum(), insert("apple",3), sum("ap"), insert("app",2), sum("ap")
- Output: 3, 5
- Explanation: "ap" prefix has "apple"(3) then "apple"(3)+"app"(2)=5

### Hints

1. Use dict for map to track key -> value
2. Calculate delta = new_val - old_val for updates
3. Store '$sum' at each trie node (sum of all values below)
4. On insert: Update all nodes along path with delta
5. On sum: Navigate to prefix, return node['$sum']
6. Handle case where key is updated (not just inserted)

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(m) for both insert and sum
- **Space Complexity:** O(n × m) for trie

### Test Cases

**Test 1:** Basic sum
- Input: "[\"MapSum\",\"insert\",\"sum\"], [[],[\"apple\",3],[\"ap\"]]"
- Expected: "[null,null,3]"

**Test 2:** Multiple keys
- Input: "[\"MapSum\",\"insert\",\"insert\",\"sum\"], [[],[\"apple\",3],[\"app\",2],[\"ap\"]]"
- Expected: "[null,null,null,5]"

---

## 7. Index Pairs of a String

**Difficulty:** easy
**Concept:** trie

### Description

Find all starting and ending indices of words from a list that appear as substrings in text.

💡 TRIE APPLICATION:
- Build trie from words list
- For each index in text, try to match as many words as possible
- Record [start, end] pairs

🎯 WHY NOT BRUTE FORCE?
- Brute: Check each word at each position = O(n × m × k) 
- Trie: Check all words at each position = O(n × k) where k = max word length

### Examples

**Example 1:**
- Input: text = "thestoryofleetcodeandme", words = ["story","fleet","leetcode"]
- Output: [[3,7],[9,13],[10,17]]
- Explanation: "story" at [3,7], "fleet" at [9,13], "leetcode" at [10,17]

### Hints

1. Build trie from words list
2. For each index i in text, start matching from root
3. Continue matching while chars exist in trie
4. When node.is_end is True, found a word at [i, j]
5. Nested loop: outer for start index, inner for matching
6. Result is automatically sorted due to iteration order

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n × k) where n = text length, k = max word length
- **Space Complexity:** O(m × k) where m = number of words

### Test Cases

**Test 1:** Find all occurrences
- Input: "(\"thestoryofleetcodeandme\", [\"story\",\"fleet\",\"leetcode\"])"
- Expected: "[[3,7],[9,13],[10,17]]"

**Test 2:** Overlapping matches
- Input: "(\"ababa\", [\"aba\",\"ab\"])"
- Expected: "[[0,1],[0,2],[2,3],[2,4]]"

---

## 8. Design Search Autocomplete System

**Difficulty:** hard
**Concept:** trie

### Description

Design autocomplete system that returns top 3 historical hot sentences with given prefix.

💡 COMPLEX TRIE:
- Store sentences with frequency
- At each node, keep top 3 sentences passing through
- Update on input('#' means end of sentence)

🎯 OPTIMIZATION:
- Maintain sorted top-3 at each node during insert
- Search just returns pre-computed list = O(1) per char

### Examples

**Example 1:**
- Input: AutocompleteSystem(["i love you","island","iroman","i love leetcode"], [5,3,2,2]), input("i"), input(" ")
- Output: ["i love you","island","i love leetcode"], ["i love you","i love leetcode"]
- Explanation: Top 3 with prefix "i", then "i "

### Hints

1. Store frequency dict at each node: {sentence: count}
2. When '#' received: add current sentence to trie with count+1
3. Track current_node to avoid re-traversing on each char
4. Sort by: 1) frequency (descending), 2) lexicographically (ascending)
5. Return top 3 from sorted list
6. Reset search_term and current_node after '#'

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(p + m log m) where p = prefix length, m = matching sentences
- **Space Complexity:** O(n × k) where n = sentences, k = avg length

### Test Cases

**Test 1:** Autocomplete with update
- Input: "([\"i love you\",\"island\"], [5,3], [\"i\",\" \",\"#\"])"
- Expected: "[[\"i love you\",\"island\"],[\"i love you\"],[]]"

---

## 9. Stream of Characters

**Difficulty:** hard
**Concept:** trie

### Description

Design a stream that checks if any suffix of the queried string matches any word in the dictionary.

💡 REVERSE TRIE TRICK:
- Build trie with REVERSED words
- Store recent chars in queue (reversed)
- Check if queue suffix matches any word in reverse trie

🎯 WHY REVERSE?
- Need to check suffixes: "...xyz" matches word "xyz"
- Reverse approach: Match from end of stream

### Examples

**Example 1:**
- Input: StreamChecker(["cd","f","kl"]), query("a"), query("b"), query("c"), query("d")
- Output: false, false, false, true
- Explanation: "abcd" has suffix "cd" which is in dictionary

### Hints

1. KEY TRICK: Build trie with REVERSED words!
2. Maintain stream of recent chars (max length = longest word)
3. On query: Add char to stream, check reversed stream in trie
4. Traverse trie from end of stream backwards
5. If hit '$' marker, found a matching suffix
6. Optimization: Keep only max_len chars in stream

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(m) per query where m = max word length
- **Space Complexity:** O(n × k) where n = words, k = avg length

### Test Cases

**Test 1:** Stream checking
- Input: "([\"cd\",\"f\",\"kl\"], [\"a\",\"b\",\"c\",\"d\",\"e\",\"f\"])"
- Expected: "[false,false,false,true,false,true]"

---

## 10. Word Squares

**Difficulty:** hard
**Concept:** trie

### Description

Find all word squares. A word square is a sequence of words where k-th row and column form the same word.

💡 TRIE + BACKTRACKING:
- Build trie with all words
- Backtrack to build square row by row
- Use trie to find words with required prefix (from columns built so far)

🎯 CONSTRAINT:
- For position (r,c): word[r][c] must equal word[c][r]
- Use trie to filter valid next words efficiently

### Examples

**Example 1:**
- Input: words = ["area","lead","wall","lady","ball"]
- Output: [["ball","area","lead","lady"], ["wall","area","lead","lady"]]
- Explanation: Two valid word squares

### Hints

1. Build trie storing list of words at each node (words with that prefix)
2. Backtrack to build square row by row
3. For row i, prefix = square[0][i] + square[1][i] + ... + square[i-1][i]
4. Use trie to get all words starting with that prefix
5. Try each candidate word, backtrack if it works
6. Base case: len(square) == word length, found complete square

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n × 26^L) where L = word length (worst case)
- **Space Complexity:** O(n × L) for trie

### Test Cases

**Test 1:** Find all word squares
- Input: "[\"area\",\"lead\",\"wall\",\"lady\",\"ball\"]"
- Expected: "[[\"ball\",\"area\",\"lead\",\"lady\"],[\"wall\",\"area\",\"lead\",\"lady\"]]"

---

## 11. Concatenated Words

**Difficulty:** hard
**Concept:** trie

### Description

Find all concatenated words: words formed by concatenating 2+ shorter words from the array.

💡 TRIE + WORD BREAK:
- Build trie from all words
- For each word: check if it can be formed by concatenating others
- Use word break algorithm with trie guidance

🎯 KEY INSIGHT:
- Sort words by length (process shorter words first)
- For word w: Can it be formed from previously added words?

### Examples

**Example 1:**
- Input: words = ["cat","cats","catsdogcats","dog","dogcatsdog"]
- Output: ["catsdogcats","dogcatsdog"]
- Explanation: "catsdogcats" = "cats"+"dog"+"cats", "dogcatsdog" = "dog"+"cats"+"dog"

### Hints

1. Build trie from all words (they're potential building blocks)
2. For each word, check if it can be formed by concatenating others
3. Use word break logic with trie guidance
4. count >= 2 ensures we use at least 2 words
5. Add memoization for better performance on long words
6. Edge case: Empty string is not concatenated

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n × m²) where n = words, m = max length
- **Space Complexity:** O(n × m) for trie

### Test Cases

**Test 1:** Find concatenated words
- Input: "[\"cat\",\"cats\",\"catsdogcats\",\"dog\",\"dogcatsdog\"]"
- Expected: "[\"catsdogcats\",\"dogcatsdog\"]"

**Test 2:** Simple concatenation
- Input: "[\"cat\",\"dog\",\"catdog\"]"
- Expected: "[\"catdog\"]"

---

## 12. Palindrome Pairs (Reverse Trie)

**Difficulty:** hard
**Concept:** trie

### Description

Find all pairs (i,j) where words[i] + words[j] forms a palindrome.

🎯 WHY REVERSE TRIE?
- Brute force: Check all n² pairs = O(n² × m)
- Reverse trie: For each word, find matching reversed suffixes = O(n × m²)

ALGORITHM:
1. Build trie with REVERSED words
2. For each word, check 3 cases:
   a) Prefix match + remaining suffix is palindrome
   b) Complete word match (different lengths)
   c) Remaining trie path is palindrome after matching word

### Examples

**Example 1:**
- Input: words = ["abcd","dcba","lls","s","sssll"]
- Output: [[0,1],[1,0],[3,2],[2,4]]
- Explanation: "abcddcba", "dcbaabcd", "slls", "llssssll"

### Hints

1. Build trie with REVERSED words (key insight!)
2. Case 1: word matches trie prefix, remaining suffix is palindrome
3. Case 2: word exactly matches a reversed word
4. Case 3: After matching word, remaining trie path is palindrome
5. Use DFS to explore remaining trie paths
6. Check idx != i to avoid pairing word with itself
7. Empty string is valid palindrome - handle edge case

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n × k²) where k = max word length
- **Space Complexity:** O(n × k) for trie

### Test Cases

**Test 1:** Multiple palindrome pairs
- Input: "[\"abcd\",\"dcba\",\"lls\",\"s\",\"sssll\"]"
- Expected: "[[0,1],[1,0],[3,2],[2,4]]"

**Test 2:** Simple reverse pairs
- Input: "[\"bat\",\"tab\",\"cat\"]"
- Expected: "[[0,1],[1,0]]"

---

## 13. Maximum XOR (Binary Trie)

**Difficulty:** hard
**Concept:** trie

### Description

Find maximum XOR of any two numbers in the array.

🎯 BINARY TRIE FOR XOR:
- Brute force: Check all n² pairs = O(n²)
- Binary trie: For each number, greedily find best match = O(n × 32) = O(n)

💡 KEY INSIGHT: XOR is maximized when bits are OPPOSITE!
- Store 32-bit binary in trie (0/1 edges)
- For each number, greedily choose opposite bit at each level
- If opposite exists, take it; otherwise take same bit

WHY 1000X FASTER:
- Array of 100,000 numbers:
  - Brute force: 10,000,000,000 comparisons
  - Binary trie: 3,200,000 operations!

### Examples

**Example 1:**
- Input: nums = [3,10,5,25,2,8]
- Output: 28
- Explanation: 5 XOR 25 = 28 is maximum

### Hints

1. Use binary trie: each node has at most 2 children (0 and 1)
2. Insert: Extract each bit from MSB to LSB using (num >> i) & 1
3. Search: For each bit, try OPPOSITE bit first for max XOR
4. If opposite bit path exists: XOR will have 1 at this position
5. If opposite doesn't exist: Take same bit, XOR will have 0
6. Start from bit 31 (MSB) to bit 0 (LSB) for 32-bit integers
7. Why this works: XOR maximized when bits differ (1 XOR 0 = 1)

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n × 32) = O(n) where n = array length
- **Space Complexity:** O(n × 32) = O(n) for binary trie

### Test Cases

**Test 1:** 5 XOR 25 = 00101 XOR 11001 = 11100 = 28
- Input: "[3,10,5,25,2,8]"
- Expected: "28"

**Test 2:** Larger test case
- Input: "[14,70,53,83,49,91,36,80,92,51,66,70]"
- Expected: "127"

**Test 3:** Simple: 2 XOR 4 = 010 XOR 100 = 110 = 6
- Input: "[2,4]"
- Expected: "6"

---

## 14. Prefix and Suffix Search (WordFilter)

**Difficulty:** hard
**Concept:** trie

### Description

Design WordFilter that supports finding words with given prefix AND suffix.

💡 TRIE HACK: Combine prefix + suffix into single search!
- Naive: Two tries (prefix + suffix) = slow intersection
- Smart: Insert "apple" as "e#apple", "le#apple", "ple#apple", etc.
- Search: Find prefix + "#" + suffix in single trie!

🎯 WHY IT WORKS:
- "apple" with suffix "le" → search for "le#apple"
- All suffixes become prefixes with "#" separator
- Single trie lookup instead of intersection!

### Examples

**Example 1:**
- Input: WordFilter(["apple"]), f("a", "e")
- Output: 0
- Explanation: "apple" has prefix "a" and suffix "e", index 0

**Example 2:**
- Input: WordFilter(["apple","ape","apply"]), f("ap", "e")
- Output: 0
- Explanation: Both "apple" and "ape" match, return largest index (0)

### Hints

1. KEY INSIGHT: Transform suffix search into prefix search using separator!
2. For word 'apple', insert: 'apple#apple', 'pple#apple', 'ple#apple', 'le#apple', 'e#apple', '#apple'
3. To search prefix 'ap' and suffix 'le': search for 'le#ap' in trie
4. Store index at EVERY node (not just leaf) - last word wins
5. Return -1 if search key not found in trie
6. Trick: '#' ensures suffix and prefix don't interfere

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n × m²) for building, O(p + s) for search where p=prefix, s=suffix length
- **Space Complexity:** O(n × m²) for storing all suffix combinations

### Test Cases

**Test 1:** Single word match
- Input: "[\"WordFilter\",\"f\"], [[[\"apple\"]],[\"a\",\"e\"]]"
- Expected: "[null,0]"

**Test 2:** Multiple words, return max index
- Input: "[\"WordFilter\",\"f\",\"f\"], [[[\"apple\",\"ape\",\"apply\"]],[\"ap\",\"e\"],[\"a\",\"y\"]]"
- Expected: "[null,0,2]"

**Test 3:** No match returns -1
- Input: "[\"WordFilter\",\"f\"], [[[\"test\"]],[\"t\",\"z\"]]"
- Expected: "[null,-1]"

---

## 15. Count Words With Given Prefix

**Difficulty:** medium
**Concept:** trie

### Description

Count how many words in the array have the given prefix.

💡 TRIE OPTIMIZATION:
- Brute force: Check each word's prefix = O(n × m)
- Trie with counters: O(m) lookup after O(n × m) preprocessing
- Store count at each node = instant prefix counting!

🎯 PATTERN: Augment trie with metadata
- Each node stores: children + word_count passing through
- Prefix count = just follow path and read counter!

### Examples

**Example 1:**
- Input: words = ["apple","app","apricot","application"], prefix = "app"
- Output: 3
- Explanation: "apple", "app", "application" have prefix "app"

**Example 2:**
- Input: words = ["cat","dog","bird"], prefix = "d"
- Output: 1
- Explanation: Only "dog" has prefix "d"

### Hints

1. Add count field to TrieNode to track words passing through
2. During insert: increment count at EVERY node along the path
3. For search: traverse to prefix end, return count at that node
4. If prefix path doesn't exist, return 0
5. This is similar to problem #2 (Longest Common Prefix) but simpler!

### Starter Code

### Solution

### Complexity Analysis

- **Time Complexity:** O(n × m) for building, O(p) for query where p = prefix length
- **Space Complexity:** O(n × m) for trie

### Test Cases

**Test 1:** Three words with prefix "app"
- Input: "[\"apple\",\"app\",\"apricot\",\"application\"], \"app\""
- Expected: "3"

**Test 2:** One word with prefix "d"
- Input: "[\"cat\",\"dog\",\"bird\"], \"d\""
- Expected: "1"

**Test 3:** No words with prefix "hi"
- Input: "[\"hello\",\"world\"], \"hi\""
- Expected: "0"

---
