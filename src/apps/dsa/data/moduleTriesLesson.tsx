import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { module12TriesLessonSmartPracticeExercises } from './exercises/moduleTriesLessonSmartPracticeExercises';

export const module12TriesLesson: ProgressiveLesson = {
  id: 'tries-string-patterns',
    title: 'Module: Tries & Advanced String Patterns',
    description: 'Build Tries from first principles - discover the data structure through progressive problem-solving',
    unlockMode: 'sequential',
    sections: [
        // ============================================================================
        // CONSOLIDATED READING: PROBLEM → SOLUTION (CONTINUOUS FLOW)
        // ============================================================================

        {
            type: 'reading',
            id: 'trie-problem-to-solution',
            title: 'The Problem and Solution: Discovering the Trie',
            estimatedReadTime: 800,
            inlineExercises: [
                // Exercise 1: Naive search in a list
                {
                    id: 'search-list',
                    starterCode: `def search(words, word):
    """
    Check if word exists in the list.
    words: list of strings, e.g., ["apple", "banana", "app"]
    word: string to search for
    Returns: True if word is in the list, False otherwise
    """
    pass`,
                    testCases: [
                        { input: '["apple", "banana", "app"], "apple"', expectedOutput: 'True' },
                        { input: '["apple", "banana", "app"], "app"', expectedOutput: 'True' },
                        { input: '["apple", "banana", "app"], "ap"', expectedOutput: 'False' },
                        { input: '["cat", "car", "card"], "cat"', expectedOutput: 'True' },
                    ],
                    targetFunction: 'search',
                    hints: [
                        'Loop through each word in the list',
                        'Check if each word equals the target word',
                        'Return True immediately when you find a match',
                    ],
                    solution: `def search(words, word):
    for w in words:
        if w == word:
            return True
    return False`,
                    successMessage: 'Correct! The time complexity is O(N × M) because for each of the N words, we compare M characters. Can we do better?',
                },
                // Exercise 2: Naive startsWith
                {
                    id: 'starts-with-list',
                    starterCode: `def starts_with(words, prefix):
    """
    Check if any word in the list starts with the given prefix.
    words: list of strings
    prefix: string prefix to check
    Returns: True if any word starts with prefix, False otherwise
    """
    pass`,
                    testCases: [
                        { input: '["apple", "banana", "app"], "app"', expectedOutput: 'True' },
                        { input: '["apple", "banana", "app"], "ban"', expectedOutput: 'True' },
                        { input: '["apple", "banana", "app"], "xyz"', expectedOutput: 'False' },
                        { input: '["cat", "car", "card"], "ca"', expectedOutput: 'True' },
                    ],
                    targetFunction: 'starts_with',
                    hints: [
                        'Loop through each word in the list',
                        'Use word.startswith(prefix) to check if a word starts with the prefix',
                        'Return True immediately when you find a match',
                    ],
                    solution: `def starts_with(words, prefix):
    for word in words:
        if word.startswith(prefix):
            return True
    return False`,
                    successMessage: 'Correct! This is also O(N × M) - we still scan all words and compare characters. This is the problem we need to solve!',
                },
                // Exercise 3: Trie insert
                {
                    id: 'trie-insert',
                    starterCode: `class TrieNode:
    def __init__(self):
        self.children = {}  # char -> TrieNode
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        """
        Insert a word into the trie.
        word: string to insert
        """
        pass`,
                    testCases: [
                        { input: '"cat"', expectedOutput: 'True' },
                        { input: '"car"', expectedOutput: 'True' },
                        { input: '"card"', expectedOutput: 'True' },
                    ],
                    targetFunction: 'test_insert',
                    hints: [
                        'Start with current = self.root',
                        'For each character in the word, check if it exists in current.children',
                        'If not, create a new TrieNode: current.children[char] = TrieNode()',
                        'Move to the child: current = current.children[char]',
                        'After the loop, mark current.is_end_of_word = True',
                    ],
                    solution: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        current = self.root
        for char in word:
            if char not in current.children:
                current.children[char] = TrieNode()
            current = current.children[char]
        current.is_end_of_word = True`,
                    successMessage: 'insert() is O(m) where m = word length. Independent of dictionary size!',
                },
                // Exercise 4: Trie search
                {
                    id: 'trie-search',
                    starterCode: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        current = self.root
        for char in word:
            if char not in current.children:
                current.children[char] = TrieNode()
            current = current.children[char]
        current.is_end_of_word = True

    def search(self, word):
        """
        Check if word exists in the trie (as a complete word).
        word: string to search for
        Returns: True if word exists, False otherwise
        """
        pass`,
                    testCases: [
                        { input: '["cat", "car"], "cat"', expectedOutput: 'True' },
                        { input: '["cat", "car"], "car"', expectedOutput: 'True' },
                        { input: '["cat", "car"], "ca"', expectedOutput: 'False' },
                        { input: '["cat", "car"], "card"', expectedOutput: 'False' },
                    ],
                    targetFunction: 'test_search',
                    hints: [
                        'Start with current = self.root',
                        'For each character, check if it exists in current.children',
                        'If char not in children, return False immediately',
                        'Move to child: current = current.children[char]',
                        'After loop, return current.is_end_of_word (must be a complete word!)',
                    ],
                    solution: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        current = self.root
        for char in word:
            if char not in current.children:
                current.children[char] = TrieNode()
            current = current.children[char]
        current.is_end_of_word = True

    def search(self, word):
        current = self.root
        for char in word:
            if char not in current.children:
                return False
            current = current.children[char]
        return current.is_end_of_word`,
                    successMessage: 'search() is O(m) - we only traverse the word length, not all dictionary words!',
                },
                // Exercise 5: Trie startsWith
                {
                    id: 'trie-starts-with',
                    starterCode: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        current = self.root
        for char in word:
            if char not in current.children:
                current.children[char] = TrieNode()
            current = current.children[char]
        current.is_end_of_word = True

    def starts_with(self, prefix):
        """
        Check if any word in the trie starts with the given prefix.
        prefix: string prefix to check
        Returns: True if any word has this prefix, False otherwise
        """
        pass`,
                    testCases: [
                        { input: '["cat", "car", "card"], "ca"', expectedOutput: 'True' },
                        { input: '["cat", "car", "card"], "car"', expectedOutput: 'True' },
                        { input: '["cat", "car", "card"], "xyz"', expectedOutput: 'False' },
                        { input: '["apple", "app"], "app"', expectedOutput: 'True' },
                    ],
                    targetFunction: 'test_starts_with',
                    hints: [
                        'Very similar to search!',
                        'Start with current = self.root',
                        'For each char in prefix, check if it exists and move',
                        'Key difference: just return True at the end (don\'t check is_end_of_word)',
                    ],
                    solution: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        current = self.root
        for char in word:
            if char not in current.children:
                current.children[char] = TrieNode()
            current = current.children[char]
        current.is_end_of_word = True

    def starts_with(self, prefix):
        current = self.root
        for char in prefix:
            if char not in current.children:
                return False
            current = current.children[char]
        return True`,
                    successMessage: 'startsWith() is also O(m)! This is the key advantage of tries.',
                },
            ],
            content: `<h1>The Problem: Why We Need a Better Data Structure</h1>

<p>Imagine you're building an <strong>autocomplete feature</strong> for a search engine. As users type, you need to instantly show suggestions!</p>

<h2>Real-World Scenario</h2>

<p><strong>User types:</strong> "app"</p>

<p><strong>You need to show:</strong> ["apple", "application", "apply", "appetizer", "apparatus"]</p>

<p>But how do you quickly find all words starting with "app" from a dictionary of thousands of words?</p>

<h2>The Problem: Three Operations We Need</h2>

<p>Let's say we have a dictionary with these words:</p>
<pre><code>words = ["apple", "application", "apply", "appetizer", "banana", "band", "bandana"]</code></pre>

<h3>Operation 1: search(word) - Check if word exists</h3>

<pre><code>search("apple")        # ✅ True - "apple" is in the dictionary
search("app")          # ❌ False - "app" is NOT a complete word (it's just a prefix)
search("banana")       # ✅ True - "banana" is in the dictionary</code></pre>

<p><strong>Key insight:</strong> We need to distinguish between <strong>complete words</strong> ("apple") and <strong>prefixes</strong> ("app").</p>

<h3>Operation 2: startsWith(prefix) - Check if any word starts with prefix</h3>

<pre><code>startsWith("app")      # ✅ True - "apple", "application", "apply" all start with "app"
startsWith("xyz")      # ❌ False - No words start with "xyz"</code></pre>

<h3>Operation 3: wordsWithPrefix(prefix) - Get all words starting with prefix</h3>

<pre><code>wordsWithPrefix("app")    # Returns: ["apple", "application", "apply", "appetizer"]
wordsWithPrefix("ban")    # Returns: ["banana", "band", "bandana"]</code></pre>

<p><strong>Use case:</strong> Show autocomplete suggestions as user types!</p>

<h1>Approach 1: List of Strings (Naive)</h1>

<p>The simplest approach: <strong>just store all words in a list!</strong></p>

<pre><code>words = ["apple", "application", "apply", "banana", "band"]</code></pre>

<h2>Try It: Implement Search</h2>

<p><strong>Implement search(words, word):</strong></p>
<ul>
<li><code>words</code>: a list of strings, e.g., <code>["apple", "banana", "app"]</code></li>
<li><code>word</code>: the string to search for</li>
<li><strong>Returns:</strong> True if word is in the list, False otherwise</li>
</ul>

<p><code-editor data-id="search-list"></code-editor></p>
<h2>Try It: Implement startsWith</h2>

<p><strong>Implement starts_with(words, prefix):</strong></p>
<ul>
<li><code>words</code>: a list of strings</li>
<li><code>prefix</code>: the prefix to check</li>
<li><strong>Returns:</strong> True if ANY word starts with prefix, False otherwise</li>
</ul>

<p><code-editor data-id="starts-with-list"></code-editor></p>
<h2>Detailed Complexity Analysis</h2>

<h3>Time Complexity</h3>

<table>
<thead><tr><th>Operation</th><th>Time Complexity</th><th>Detailed Breakdown</th></tr></thead>
<tbody>
<tr><td><strong>insert(word)</strong></td><td>O(1) amortized*</td><td>Append to list</td></tr>
<tr><td><strong>search(word)</strong></td><td>O(n × m)</td><td>Must check all n words, each string comparison is O(m)</td></tr>
<tr><td><strong>startsWith(prefix)</strong></td><td>O(n × m)</td><td>Scan all n words, <code>startswith()</code> compares up to m characters</td></tr>
<tr><td><strong>wordsWithPrefix(prefix)</strong></td><td>O(n × m)</td><td>Scan all n words, compare m characters per word</td></tr>
</tbody>
</table>

<p><strong>* What does "amortized" mean?</strong><br/>
Sometimes an operation is usually fast but occasionally slow. "Amortized O(1)" means: if you do this operation many times, the <strong>average cost per operation</strong> is O(1).</p>

<p>Example: Python list append is usually O(1), but occasionally O(n) when the list needs to grow. Averaged over many appends → O(1) amortized.</p>

<p><strong>Why O(n × m)?</strong></p>
<ul>
<li><strong>n words</strong>: We must check every word in the worst case</li>
<li><strong>m characters</strong>: Each string comparison requires comparing characters one by one</li>
<li><strong>Worst case</strong>: Word not found → checked all n words, compared m characters each = <strong>n × m operations</strong></li>
</ul>

<p><strong>Example with n=1,000,000, m=10:</strong></p>
<ul>
<li><code>search("apple")</code>: Up to 1M word comparisons × 10 char comparisons = <strong>10 million operations</strong></li>
<li><code>startsWith("app")</code>: Same - must check every word!</li>
</ul>

<h3>Space Complexity</h3>

<p><strong>Space: O(n × m)</strong></p>

<p><strong>Why?</strong></p>
<ul>
<li>We store each word as a separate string</li>
<li>Each word of length m requires m characters</li>
<li>Total: n words × m characters = <strong>O(n × m)</strong></li>
</ul>

<p><strong>Example:</strong></p>
<ul>
<li>1,000,000 words × 10 characters = <strong>10 million characters stored</strong></li>
<li>No sharing: "apple", "application", "apply" each store "appl" separately</li>
</ul>

<h2>The Problem: Why This Approach is Slow</h2>

<p>Imagine a <strong>real-world dictionary</strong> with <strong>1 million words</strong>:</p>

<pre><code>n = 1,000,000 words
m = 10 characters (average word length)</code></pre>

<p><strong>For autocomplete as user types:</strong></p>
<ul>
<li>User types "a" → scan 1M words</li>
<li>User types "ap" → scan 1M words again</li>
<li>User types "app" → scan 1M words again</li>
<li>Each keystroke = <strong>10 million operations!</strong></li>
</ul>

<p><strong>This is unacceptable for real-time autocomplete!</strong></p>

<h1>Approach 2: Can Hash Sets Help?</h1>

<p><strong>Idea:</strong> Hash sets provide O(1) lookup for exact matches!</p>

<pre><code>word_set = {"apple", "application", "apply", "banana", "band"}

def search(word):
    return word in word_set  # O(1) - Great!</code></pre>

<p><strong>But what about prefix search?</strong></p>

<pre><code>def startsWith(prefix):
    for word in word_set:        # Still O(n)!
        if word.startswith(prefix):
            return True
    return False</code></pre>

<p><strong>The problem:</strong> Hash sets only work for <strong>exact</strong> key matching. For prefix matching, we'd still need to check every word!</p>

<h3>Time Complexity</h3>

<table>
<thead><tr><th>Operation</th><th>Time Complexity</th><th>Detailed Breakdown</th></tr></thead>
<tbody>
<tr><td><strong>insert(word)</strong></td><td>O(m) average</td><td>Hash computation: O(m) to hash the word, then O(1) insert</td></tr>
<tr><td><strong>search(word)</strong></td><td>O(m) amortized</td><td>Hash the word: O(m), then O(1) lookup</td></tr>
<tr><td><strong>startsWith(prefix)</strong></td><td>O(n × m)</td><td><strong>No improvement!</strong> Must iterate all n words, compare m chars</td></tr>
<tr><td><strong>wordsWithPrefix(prefix)</strong></td><td>O(n × m)</td><td>Same as List - must scan everything</td></tr>
</tbody>
</table>

<p><strong>Why hash set helps for exact search but not prefix search?</strong></p>

<p><strong>Exact search (O(m) average):</strong></p>
<ul>
<li>Hash the word: O(m) to compute hash</li>
<li>Lookup in hash table: O(1) average case</li>
<li><strong>Total: O(m)</strong> - independent of n!</li>
</ul>

<p><strong>Prefix search (O(n × m)):</strong></p>
<ul>
<li>Hash sets don't support prefix queries</li>
<li>Must iterate through all n words: O(n)</li>
<li>For each word, check if it starts with prefix: O(m) character comparison</li>
<li><strong>Total: O(n × m)</strong> - same as List!</li>
</ul>

<p><strong>Example with n=1,000,000, m=10:</strong></p>
<ul>
<li><code>search("apple")</code>: Hash "apple" (10 ops) + lookup (1 op) = <strong>11 operations</strong> ✅</li>
<li><code>startsWith("app")</code>: Iterate 1M words × 10 char comparisons = <strong>10 million operations</strong> ❌</li>
</ul>

<h3>Space Complexity</h3>

<p><strong>Space: O(n × m)</strong></p>

<p><strong>Why?</strong></p>
<ul>
<li>Hash set stores each word as a separate entry</li>
<li>Each word requires m characters</li>
<li>Hash table overhead: typically ~1.5× the data (load factor)</li>
<li><strong>Total: O(n × m)</strong> - same as List, slightly more overhead</li>
</ul>

<p><strong>Trade-off:</strong></p>
<ul>
<li>✅ <strong>Much faster exact lookup</strong> (O(m) vs O(n×m))</li>
<li>❌ <strong>No improvement for prefix operations</strong> (still O(n×m))</li>
<li>❌ <strong>No prefix sharing</strong> (each word stored independently)</li>
</ul>

<table>
<thead><tr><th>Approach</th><th>search</th><th>startsWith</th><th>insert</th></tr></thead>
<tbody>
<tr><td>List</td><td>O(n × m)</td><td>O(n × m)</td><td>O(1)</td></tr>
<tr><td>Hash Set</td><td><strong>O(m)</strong> ✅</td><td>O(n × m) ❌</td><td>O(m)</td></tr>
</tbody>
</table>

<h1>The Key Insight</h1>

<p>Let's look at our example words more carefully:</p>

<pre><code>"apple"       → a-p-p-l-e
"application" → a-p-p-l-i-c-a-t-i-o-n
"apply"       → a-p-p-l-y</code></pre>

<p><strong>What do these three words have in common?</strong></p>

<p>They all share the prefix <strong>"appl"</strong>!</p>

<p><strong>In our current approach, how many times do we store "appl"?</strong></p>

<pre><code>["apple", "application", "apply"]
#  ^^^^     ^^^^           ^^^^
# Same "appl" stored 3 times!</code></pre>

<p><strong>What if we could store the common prefix "appl" just once</strong>, and then branch out to the different endings ("e", "ication", "y")?</p>

<p>This suggests a <strong>tree-like structure</strong> where:</p>
<ul>
<li>Paths share common beginnings</li>
<li>Then branch off for different endings</li>
<li>We can traverse <strong>character by character</strong></li>
</ul>

<h1>Summary: What We Need</h1>

<table>
<thead><tr><th>Requirement</th><th>List</th><th>Hash Set</th><th>???</th></tr></thead>
<tbody>
<tr><td>Fast exact search</td><td>❌ O(n×m)</td><td>✅ O(1)</td><td>✅</td></tr>
<tr><td>Fast prefix search</td><td>❌ O(n×m)</td><td>❌ O(n×m)</td><td>✅</td></tr>
<tr><td>Share common prefixes</td><td>❌</td><td>❌</td><td>✅</td></tr>
</tbody>
</table>

<p><strong>We need a data structure that:</strong></p>
<ol>
<li>✅ <strong>Shares common prefixes</strong> (store "appl" once, not three times)</li>
<li>✅ <strong>Allows efficient prefix traversal</strong> (faster than scanning all words)</li>
<li>✅ <strong>Represents characters as paths</strong> (navigate character by character)</li>
</ol>

<h1>The Solution: Discovering the Trie</h1>

<h2>The idea</h2>

<h3>Words as Letter Paths</h3>

<p>Each word is stored as a <strong>path made of letters</strong>. Words that start the same share the beginning of their path—we store that shared part <strong>once</strong>, not multiple times.</p>

<pre><code>Example: Storing "cat", "car", and "card"

         (start)
          |
          c  ← "cat", "car", "card" all share this
          |
          a  ← "cat", "car", "card" all share this too
         / \
        t   r  ← Path splits here: 't' for "cat", 'r' for "car"/"card"
        ⭐   ⭐  ← Word-ending marker: "cat" and "car" end here
            |
            d  ← Only "card" continues here
            ⭐  ← "card" ends here</code></pre>

<h3>The Lookup Table at Each Step</h3>

<p>At every point along the path, we keep a <strong>fast lookup table</strong> that tells us: "if the next letter is X, where do I go?"</p>

<pre><code>At the point after "ca":

    Lookup table:
    ┌─────────┬──────────────┐
    │ 't'     │ → path to    │
    │         │   "cat"      │
    ├─────────┼──────────────┤
    │ 'r'     │ → path to    │
    │         │   "car"/"card"│
    └─────────┴──────────────┘

To check if any word starts with "ca":
→ Just walk 2 steps (c → a) and check the lookup table!
→ No need to scan every word in the dictionary</code></pre>

<h3>Word-Ending Markers</h3>

<p>We mark where complete words end (⭐) so we can tell the difference between a complete word and just a prefix:</p>

<pre><code>         (start)
          |
          c
          |
          a  ← No ⭐ here, so "ca" is NOT a stored word (just a prefix)
         / \
        t   r
        ⭐   ⭐  ← ⭐ here means "cat" and "car" ARE stored words
            |
            d
            ⭐  ← ⭐ here means "card" IS a stored word</code></pre>

<p><strong>The difference:</strong></p>
<ul>
<li>"cat" has ⭐ → it's a complete stored word ✅</li>
<li>"ca" has no ⭐ → it's just a prefix, not a stored word ❌</li>
</ul>

<h3>🚦 Conceptual Walkthrough: The Rules of the Road</h3>

<p>Before we look at code, let's just trace through the operations with our finger.</p>

<p><strong>The Rules:</strong></p>
<ol>
<li>Always start at the root (top).</li>
<li>Follow the path for each letter.</li>
<li>If a path doesn't exist, you're stuck (failure).</li>
<li>"End of Word" markers (⭐) matter for whole words, but not for prefixes.</li>
</ol>

<hr/>

<h3>1️⃣ INSERT "apple" (Building the Path)</h3>

<p>We want to add "apple" to an empty Trie.</p>

<p>Right now the Trie only has a single node called the <strong>root</strong> – this is the starting point for every word:</p>

<pre><code>(root)
  |
 [no letters yet]</code></pre>

<p><strong>Inserting a word</strong> means: starting at the root, walking one letter at a time, creating nodes if we need them, and finally marking the last node as an <strong>End of Word (⭐)</strong>.</p>

<ul>
<li><strong>Start at Root</strong> (the empty starting node above).</li>
<li><strong>'a'</strong>: Path doesn't exist → <strong>Create it</strong>. Move to 'a'.</li>
<li><strong>'p'</strong>: Path doesn't exist → <strong>Create it</strong>. Move to 'p'.</li>
<li><strong>'p'</strong>: Path doesn't exist → <strong>Create it</strong>. Move to 'p'.</li>
<li><strong>'l'</strong>: Path doesn't exist → <strong>Create it</strong>. Move to 'l'.</li>
<li><strong>'e'</strong>: Path doesn't exist → <strong>Create it</strong>. Move to 'e'.</li>
<li><strong>Finish</strong>: We ran out of letters. Mark the current node ('e') as <strong>End of Word (⭐)</strong>.</li>
</ul>

<p><em>Result (viewing the tree from the root):</em></p>

<pre><code>(root)
  |
 'a'
  |
 'p'
  |
 'p'
  |
 'l'
  |
 'e' ⭐</code></pre>

<hr/>

<h3>2️⃣ SEARCH "apple" (The Match)</h3>

<p>Does "apple" exist as a complete word?</p>

<ul>
<li><strong>Start at Root</strong></li>
<li><strong>'a'</strong>: Path exists → Move to 'a'.</li>
<li><strong>'p'</strong>: Path exists → Move to 'p'.</li>
<li><strong>'p'</strong>: Path exists → Move to 'p'.</li>
<li><strong>'l'</strong>: Path exists → Move to 'l'.</li>
<li><strong>'e'</strong>: Path exists → Move to 'e'.</li>
<li><strong>Finish</strong>: No more letters.</li>
<li><strong>Check</strong>: Is there a ⭐ here?
<ul>
<li><strong>YES</strong>: Return <strong>TRUE</strong>.</li>
</ul>
</li>
</ul>

<hr/>

<h3>3️⃣ SEARCH "app" (The Prefix Trap)</h3>

<p>Does "app" exist as a complete word?</p>

<ul>
<li><strong>Start at Root</strong></li>
<li><strong>'a'</strong>: Path exists → Move to 'a'.</li>
<li><strong>'p'</strong>: Path exists → Move to 'p'.</li>
<li><strong>'p'</strong>: Path exists → Move to 'p'.</li>
<li><strong>Finish</strong>: No more letters.</li>
<li><strong>Check</strong>: Is there a ⭐ here?
<ul>
<li><strong>NO</strong>: The 'p' node exists, but it wasn't marked as an end of a word (only 'e' was).</li>
<li><strong>Result</strong>: Return <strong>FALSE</strong>.</li>
</ul>
</li>
</ul>

<p><em>Key takeaway: "app" is inside the Trie, but it's not a stored word. It's just a bridge to "apple".</em></p>

<hr/>

<h3>4️⃣ STARTSWITH "app" (The Prefix Success)</h3>

<p>Do ANY words start with "app"?</p>

<ul>
<li><strong>Start at Root</strong></li>
<li><strong>'a'</strong>: Path exists → Move to 'a'.</li>
<li><strong>'p'</strong>: Path exists → Move to 'p'.</li>
<li><strong>'p'</strong>: Path exists → Move to 'p'.</li>
<li><strong>Finish</strong>: No more letters.</li>
<li><strong>Check</strong>: Did we get stuck?
<ul>
<li><strong>NO</strong>: We successfully walked the path.</li>
<li><strong>Result</strong>: Return <strong>TRUE</strong>.</li>
</ul>
</li>
</ul>

<p><em>Key takeaway: For startsWith, we don't care about the ⭐ marker. We only care that the path exists.</em></p>

<hr/>

<h3>5️⃣ DELETE "apple" (Conceptual Cleanup)</h3>

<p>We want to remove "apple".</p>

<ol>
<li><strong>Search first</strong>: Walk to the end ('e'). It exists and is a ⭐. Good.</li>
<li><strong>Unmark</strong>: Remove the ⭐ from 'e'. "apple" is no longer a word.</li>
<li><strong>Cleanup (Pruning)</strong>:
<ul>
<li>Look at 'e'. Does it have any children (paths continuing further)?
<ul>
<li><strong>No</strong>: It's a dead end. <strong>Remove the 'e' node.</strong></li>
</ul>
</li>
<li>Step back to 'l'. Does it have any <em>other</em> children? Is it a ⭐?
<ul>
<li><strong>No</strong>: It's useless now. <strong>Remove the 'l' node.</strong></li>
</ul>
</li>
<li>Step back to 'p'.
<ul>
<li>...and so on, up the tree.</li>
</ul>
</li>
</ul>
</li>
</ol>

<p><em>Note: If we had "app" stored as a word (with a ⭐ at the second 'p'), we would STOP deleting there because that node is still useful!</em></p>

<h3>How does this help vs scanning all words?</h3>

<p>With a trie, we never scan 1,000,000 words for every prefix.</p>

<p>We just walk <strong>one character at a time</strong>:</p>
<ul>
<li>prefix length = m</li>
<li>work done = m</li>
</ul>

<p>So <code>startsWith("app")</code> does ~3 steps, not "scan the whole dictionary".</p>

<h3>What does this look like in code (later)?</h3>

<p>When we formalize the idea into a class, each <strong>TrieNode</strong> will store:</p>
<ul>
<li>a dictionary of <strong>children</strong> (next letter → child TrieNode)</li>
<li>a <strong>word-ending marker</strong></li>
</ul>

<pre><code>self.children = {}         # char -> TrieNode
self.is_end_of_word = False</code></pre>

<h3>The TrieNode: Each position in the trie</h3>

<p>We represent each position in the trie as an object called <strong>TrieNode</strong>:</p>

<pre><code>class TrieNode:
    def __init__(self):
        self.children = {}        # dictionary: letter → next TrieNode
        self.is_end_of_word = False  # does a complete word end here?</code></pre>

<p><strong>What each field does:</strong></p>

<pre><code>┌────────────────────────────────────────┐
│              TrieNode                  │
├────────────────────────────────────────┤
│  children = {'a': →, 'b': →, ...}     │  ← "What letters can come next?"
│                                        │     Maps each letter to another TrieNode
├────────────────────────────────────────┤
│  is_end_of_word = True/False          │  ← "Does a complete word end here?"
└────────────────────────────────────────┘</code></pre>

<p><strong>Example:</strong> After inserting "cat" and "car":</p>

<pre><code>TrieNode (root)           TrieNode              TrieNode              TrieNode (cat)
┌──────────────┐         ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│children=     │   'c'   │children=     │ 'a'  │children=     │ 't'  │children= {}  │
│  {'c': →}    │ ──────> │  {'a': →}    │ ───> │ {'t':→,'r':→}│ ───> │is_end = TRUE │
│is_end=FALSE  │         │is_end=FALSE  │      │is_end=FALSE  │      └──────────────┘
└──────────────┘         └──────────────┘      └──────────────┘              │
                                                       │ 'r'                  │
                                                       ↓                      │
                                               TrieNode (car)                 │
                                               ┌──────────────┐               │
                                               │children= {}  │               │
                                               │is_end = TRUE │               │
                                               └──────────────┘</code></pre>

<h3>Why do we need children?</h3>

<p>When walking through the trie, we need to answer: <strong>"What letters can come next?"</strong></p>

<p>Without a fast way to check, we'd scan all words. But <code>children</code> is a <strong>dictionary</strong>, so checking "can 'a' come after 'c'?" is a single O(1) lookup - instant!</p>

<p><strong>Without children (slow):</strong> O(n × m) - scan n words, compare m characters</p>

<p><strong>With children (fast):</strong> O(m) - just m dictionary lookups, independent of n!</p>

<h3>How the trie gets built: step-by-step insert("cat")</h3>

<h4>What is "current" and how does it move?</h4>

<p><code>current</code> is a variable that points to one TrieNode at a time. When we do <code>current = current.children[char]</code>, we move from one TrieNode to the next.</p>

<h4>Inserting "cat" step-by-step with diagrams</h4>

<p><strong>Start:</strong> Empty trie. <code>current</code> points to root.</p>

<pre><code>                 current points here
                        ↓
                   ┌─────────┐
                   │  root   │
                   │─────────│
                   │children=│
                   │   {}    │
                   └─────────┘</code></pre>

<p><strong>Step 1: Process 'c'</strong></p>

<p>'c' not in current.children → create new box, add 'c' → new box</p>

<pre><code>                   ┌─────────┐         ┌─────────┐
                   │  root   │         │  box 1  │
                   │─────────│   'c'   │─────────│
                   │children=│ ──────> │children=│
                   │ {'c':→} │         │   {}    │
                   └─────────┘         └─────────┘</code></pre>

<p>Now do <code>current = current.children['c']</code> → move finger to box 1</p>

<pre><code>                   ┌─────────┐         ┌─────────┐
                   │  root   │         │  box 1  │  ← current points here now!
                   │─────────│   'c'   │─────────│
                   │children=│ ──────> │children=│
                   │ {'c':→} │         │   {}    │
                   └─────────┘         └─────────┘</code></pre>

<p><strong>Step 2: Process 'a'</strong></p>

<p>'a' not in current.children → create new box, add 'a' → new box</p>

<pre><code>       ┌─────────┐         ┌─────────┐         ┌─────────┐
       │  root   │         │  box 1  │         │  box 2  │
       │─────────│   'c'   │─────────│   'a'   │─────────│
       │children=│ ──────> │children=│ ──────> │children=│
       │ {'c':→} │         │ {'a':→} │         │   {}    │
       └─────────┘         └─────────┘         └─────────┘</code></pre>

<p>Now do <code>current = current.children['a']</code> → move finger to box 2</p>

<pre><code>       ┌─────────┐         ┌─────────┐         ┌─────────┐
       │  root   │         │  box 1  │         │  box 2  │  ← current points here now!
       │─────────│   'c'   │─────────│   'a'   │─────────│
       │children=│ ──────> │children=│ ──────> │children=│
       │ {'c':→} │         │ {'a':→} │         │   {}    │
       └─────────┘         └─────────┘         └─────────┘</code></pre>

<p><strong>Step 3: Process 't'</strong></p>

<p>'t' not in current.children → create new box, add 't' → new box</p>

<pre><code>  ┌─────────┐       ┌─────────┐       ┌─────────┐       ┌─────────┐
  │  root   │       │  box 1  │       │  box 2  │       │  box 3  │
  │─────────│  'c'  │─────────│  'a'  │─────────│  't'  │─────────│
  │children=│ ────> │children=│ ────> │children=│ ────> │children=│
  │ {'c':→} │       │ {'a':→} │       │ {'t':→} │       │   {}    │
  └─────────┘       └─────────┘       └─────────┘       └─────────┘</code></pre>

<p>Now do <code>current = current.children['t']</code> → move finger to box 3</p>

<pre><code>  ┌─────────┐       ┌─────────┐       ┌─────────┐       ┌─────────┐
  │  root   │       │  box 1  │       │  box 2  │       │  box 3  │  ← current here!
  │─────────│  'c'  │─────────│  'a'  │─────────│  't'  │─────────│
  │children=│ ────> │children=│ ────> │children=│ ────> │children=│
  │ {'c':→} │       │ {'a':→} │       │ {'t':→} │       │   {}    │
  └─────────┘       └─────────┘       └─────────┘       └─────────┘</code></pre>

<p><strong>Final step: Mark word complete</strong></p>

<p>Set <code>current.is_end_of_word = True</code> on box 3</p>

<pre><code>  ┌─────────┐       ┌─────────┐       ┌─────────┐       ┌─────────┐
  │  root   │       │  box 1  │       │  box 2  │       │  box 3  │
  │─────────│  'c'  │─────────│  'a'  │─────────│  't'  │─────────│
  │children=│ ────> │children=│ ────> │children=│ ────> │is_end = │
  │ {'c':→} │       │ {'a':→} │       │ {'t':→} │       │  TRUE ⭐ │
  └─────────┘       └─────────┘       └─────────┘       └─────────┘</code></pre>

<h4>The code</h4>

<pre><code>current = root                    # Finger starts at root

for char in "cat":                # For each letter: 'c', 'a', 't'
    if char not in current.children:
        current.children[char] = TrieNode()   # Create new box if needed

    current = current.children[char]          # Move finger to next box

current.is_end_of_word = True     # Mark final box as word-ending</code></pre>

<h4>What current = current.children[char] does</h4>

<pre><code>BEFORE:                           AFTER current = current.children['c']:

   current                             current
      ↓                                   ↓
  ┌───────┐  'c'  ┌───────┐         ┌───────┐  'c'  ┌───────┐
  │ root  │ ───→  │ box 1 │         │ root  │ ───→  │ box 1 │
  └───────┘       └───────┘         └───────┘       └───────┘

  The finger moves from root to box 1!</code></pre>

<p>This is how we "walk" through the trie one letter at a time.</p>

<h3>Prefix Sharing: adding "car" after "cat"</h3>

<h4>Why children makes sharing possible</h4>

<p>Both "cat" and "car" start with "ca".</p>

<p><strong>Without children (no sharing):</strong></p>
<ul>
<li>We'd store "cat" separately</li>
<li>We'd store "car" separately</li>
<li>The "ca" prefix gets stored <strong>twice</strong> - wasteful!</li>
</ul>

<p><strong>With children (automatic sharing):</strong></p>
<ul>
<li>Insert "car": 'c' already exists (from "cat") → reuse it</li>
<li>'a' already exists → reuse it</li>
<li>Only 'r' is new → add it to the existing 'ca' children dictionary</li>
</ul>

<p><strong>The magic:</strong> Because <code>children</code> is a dictionary, checking "does this letter exist?" is instant. If it exists, we reuse it. If not, we create it. This automatically shares common prefixes!</p>

<h4>Step-by-step: inserting "car" after "cat"</h4>

<p><strong>Start:</strong> Trie already has "cat"</p>

<pre><code>root
└── children = {'c': → children = {'a': → children = {'t': ⭐}}}</code></pre>

<p><strong>Step 1: Process 'c'</strong></p>
<p>Look in root's children for 'c' → <strong>found!</strong> (from "cat") → reuse it, move forward</p>

<p><strong>Step 2: Process 'a'</strong></p>
<p>Look in the 'c' children for 'a' → <strong>found!</strong> (from "cat") → reuse it, move forward</p>

<p><strong>Step 3: Process 'r'</strong></p>
<p>Look in the 'ca' children for 'r' → not found → create it, mark word complete</p>

<p><strong>Final result:</strong></p>

<pre><code>root
└── children = {'c': → children = {'a': → children = {'t': ⭐, 'r': ⭐}}}
                                                      ↑        ↑
                                                   (cat)   (car)</code></pre>

<p><strong>The code:</strong></p>

<pre><code>current = root
for char in "car":
    if char not in current.children:  # Check if letter exists
        current.children[char] = TrieNode()  # Only create if missing
    current = current.children[char]  # Move forward (reuse or new)
current.is_end_of_word = True</code></pre>

<p><strong>The win:</strong></p>
<ul>
<li>"cat" created: 'c', 'a', 't' (3 entries)</li>
<li>"car" created: only 'r' (1 new entry)</li>
<li><strong>Total: 4 entries instead of 6!</strong> The 'c' and 'a' children dictionaries are shared!</li>
</ul>

<h3>Visual Search Walkthrough: search("car")</h3>

<p>Search follows the children dictionaries character by character:</p>

<pre><code>cursor = root  # Start at root's children dictionary
for char in "car":
    if char not in cursor.children:  # Check if letter exists in current children dict
        return False
    cursor = cursor.children[char]  # Move to the next children dictionary
return cursor.is_end_of_word  # Check if a complete word ends here</code></pre>

<p>Step-by-step:</p>

<table>
<thead><tr><th>Step</th><th>Char</th><th>What we check</th><th>Move to</th></tr></thead>
<tbody>
<tr><td>1</td><td>'c'</td><td><code>'c' in root.children</code> ✅</td><td>cursor = root.children['c']</td></tr>
<tr><td>2</td><td>'a'</td><td><code>'a' in cursor.children</code> ✅</td><td>cursor = cursor.children['a']</td></tr>
<tr><td>3</td><td>'r'</td><td><code>'r' in cursor.children</code> ✅</td><td>cursor = cursor.children['r']</td></tr>
<tr><td>4</td><td>-</td><td><code>cursor.is_end_of_word</code> ✅</td><td>return True</td></tr>
</tbody>
</table>

<p><strong>Two important edge cases:</strong></p>
<ul>
<li>Searching <code>"ca"</code> returns <strong>False</strong> (path exists: 'c' and 'a' are in children, but <code>is_end_of_word</code> is False → it's just a prefix, not a stored word)</li>
<li>Searching <code>"cab"</code> returns <strong>False</strong> (fails at 'b': the 'ca' children dictionary has no 'b' entry)</li>
</ul>

<h1>The Nested Dictionary Approach</h1>

<p><strong>Idea:</strong> Store words <strong>character by character</strong> using nested dictionaries!</p>

<h2>The Structure</h2>

<p>For words: <code>["cat", "car", "card", "dog"]</code></p>

<pre><code>trie = {
    'c': {
        'a': {
            't': {'*': True},      # "cat" ends here
            'r': {
                '*': True,          # "car" ends here
                'd': {'*': True}    # "card" ends here
            }
        }
    },
    'd': {
        'o': {
            'g': {'*': True}        # "dog" ends here
        }
    }
}</code></pre>

<p><strong>Notice:</strong></p>
<ul>
<li>Common prefix <strong>"ca"</strong> is stored <strong>once</strong> (not 3 times!)</li>
<li><strong>"car"</strong> and <strong>"card"</strong> share the path c → a → r</li>
<li>The <strong><code>'*': True</code></strong> marks the end of a complete word</li>
</ul>

<h2>Visual Representation</h2>

<pre><code>         (root)
        /      \
       c        d
       |        |
       a        o
      / \       |
     t   r      g*
     *   |\
         * d
           *

* = end of word marker</code></pre>

<h2>Implementation with Nested Dicts</h2>

<h3>insert(word)</h3>

<pre><code>def insert(trie, word):
    """Insert word into trie - O(m) time"""
    cursor = trie
    for char in word:
        cursor = cursor.setdefault(char, {})
    cursor['*'] = True</code></pre>

<h3>search(word)</h3>

<pre><code>def search(trie, word):
    """Search for exact word - O(m) time"""
    cursor = trie
    for char in word:
        if char not in cursor:
            return False
        cursor = cursor[char]
    return '*' in cursor  # Must be marked as complete word</code></pre>

<h3>startsWith(prefix)</h3>

<pre><code>def startsWith(trie, prefix):
    """Check if prefix exists - O(m) time"""
    cursor = trie
    for char in prefix:
        if char not in cursor:
            return False
        cursor = cursor[char]
    return True  # Path exists (don't need '*' check)</code></pre>

<h2>Try It: Implement the Trie Operations</h2>

<p>Now let's implement a proper Trie class with TrieNode objects!</p>

<h3>Implement insert(word)</h3>

<p><strong>Implement insert(self, word):</strong></p>
<ul>
<li><code>word</code>: a string to insert into the trie</li>
<li>For each character, create a new TrieNode if it doesn't exist</li>
<li>After processing all characters, mark the final node as a word ending</li>
</ul>

<p><code-editor data-id="trie-insert"></code-editor></p>
<h3>Implement search(word)</h3>

<p><strong>Implement search(self, word):</strong></p>
<ul>
<li><code>word</code>: a string to search for</li>
<li><strong>Returns:</strong> True if the <strong>complete word</strong> exists, False otherwise</li>
<li>Note: "cat" exists but "ca" does NOT (it's just a prefix)</li>
</ul>

<p><code-editor data-id="trie-search"></code-editor></p>
<h3>Implement starts_with(prefix)</h3>

<p><strong>Implement starts_with(self, prefix):</strong></p>
<ul>
<li><code>prefix</code>: a prefix string to check</li>
<li><strong>Returns:</strong> True if ANY word starts with this prefix, False otherwise</li>
<li>Key difference from search: don't check is_end_of_word!</li>
</ul>

<p><code-editor data-id="trie-starts-with"></code-editor></p>
<h2>The Breakthrough: Detailed Complexity Analysis</h2>

<h3>Time Complexity</h3>

<p><strong>Key insight: Time complexity no longer depends on n (number of words)!</strong></p>

<table>
<thead><tr><th>Operation</th><th>Time Complexity</th><th>Detailed Breakdown</th></tr></thead>
<tbody>
<tr><td><strong>insert(word)</strong></td><td>O(m)</td><td>Walk/create m nodes, each step: O(1) hash map lookup</td></tr>
<tr><td><strong>search(word)</strong></td><td>O(m)</td><td>Walk m nodes, each step: O(1) hash map lookup</td></tr>
<tr><td><strong>startsWith(prefix)</strong></td><td>O(m)</td><td>Walk m nodes (prefix length), each step: O(1) hash map lookup</td></tr>
</tbody>
</table>

<p><strong>Why O(m) and not O(n × m)?</strong></p>

<p><strong>The magic:</strong></p>
<ol>
<li><strong>Character-by-character traversal</strong>: We don't scan all words, we follow a path</li>
<li><strong>Hash map lookup at each step</strong>: <code>node.children[char]</code> is O(1) average case</li>
<li><strong>Independent of n</strong>: Whether we have 10 words or 10 million words, we only walk m steps</li>
</ol>

<p><strong>Step-by-step breakdown for <code>search("apple")</code>:</strong></p>

<pre><code>root → 'a' → 'p' → 'p' → 'l' → 'e'
  O(1)  O(1)  O(1)  O(1)  O(1)  O(1)</code></pre>

<ul>
<li><strong>5 characters</strong> = 5 hash map lookups</li>
<li>Each lookup: O(1) average case</li>
<li><strong>Total: O(5) = O(m)</strong> where m=5</li>
</ul>

<p><strong>Comparison with 1 million words (n=1,000,000, m=10):</strong></p>

<table>
<thead><tr><th>Operation</th><th>List</th><th>Hash Set</th><th>Trie</th></tr></thead>
<tbody>
<tr><td><strong>search("apple")</strong></td><td>O(10M)</td><td>O(10)</td><td><strong>O(10)</strong> ✅</td></tr>
<tr><td><strong>startsWith("app")</strong></td><td>O(10M)</td><td>O(10M)</td><td><strong>O(3)</strong> ✅</td></tr>
</tbody>
</table>

<p><strong>Trie is 1,000,000× faster for prefix operations!</strong></p>

<h3>Space Complexity</h3>

<p><strong>Space: O(total characters inserted)</strong></p>

<p><strong>Detailed breakdown:</strong></p>

<p><strong>Worst case:</strong> O(n × m)</p>
<ul>
<li>If NO words share prefixes (e.g., "a", "b", "c", ..., "z", "aa", "ab", ...)</li>
<li>Each word creates m nodes independently</li>
<li><strong>Example</strong>: 1M words, each 10 chars, no sharing → 10M nodes</li>
</ul>

<p><strong>Best case:</strong> O(m)</p>
<ul>
<li>If ALL words share the same prefix (e.g., "apple", "apples", "appletree")</li>
<li>Only one path exists, just m nodes total!</li>
</ul>

<p><strong>Average case (real-world):</strong> Much better than O(n × m)</p>
<ul>
<li>Common prefixes are stored <strong>once</strong></li>
<li>"apple", "application", "apply" share "appl" → stored once, not 3 times</li>
<li><strong>Typical savings</strong>: 50-80% reduction vs storing all words separately</li>
</ul>

<p><strong>Space per node:</strong></p>
<ul>
<li>Each TrieNode: <code>children</code> dict (hash map) + <code>is_end_of_word</code> boolean</li>
<li><code>children</code> dict: O(ALPHABET_SIZE) worst case, but typically sparse</li>
<li>For lowercase English: max 26 entries per node</li>
</ul>

<p><strong>Example calculation:</strong></p>

<p><strong>Storing ["cat", "car", "card", "dog"]:</strong></p>

<pre><code>List/Hash Set: 3+3+4+3 = 13 characters stored
Trie:
  root → c → a → t (cat)
           → r → * (car)
              → d → * (card)
  root → d → o → g (dog)

Total nodes: 1 + 1 + 1 + 1 + 1 + 1 + 1 = 7 nodes
Each node: ~26 entries in children dict (sparse, mostly empty)</code></pre>

<p><strong>Space comparison:</strong></p>
<ul>
<li><strong>List</strong>: 13 characters</li>
<li><strong>Hash Set</strong>: ~13 characters + hash table overhead</li>
<li><strong>Trie</strong>: 7 nodes × (26 pointers + 1 boolean) ≈ more overhead, BUT scales better with shared prefixes</li>
</ul>

<p><strong>Key insight:</strong> Trie space complexity depends on <strong>structure</strong>, not just total characters. More prefix sharing = less space!</p>

<h2>Formalizing with Classes (Same Idea, Cleaner Code)</h2>

<p>The nested dictionary approach works, but using '*' as a magic string is fragile. Let's make it cleaner!</p>

<h3>The TrieNode Class</h3>

<pre><code>class TrieNode:
    def __init__(self):
        self.children = {}        # char → TrieNode
        self.is_end_of_word = False</code></pre>

<p><strong>Why is this better?</strong></p>

<table>
<thead><tr><th>Nested Dict</th><th>Class-Based</th></tr></thead>
<tbody>
<tr><td><code>if '*' in cursor:</code></td><td><code>if node.is_end_of_word:</code></td></tr>
<tr><td>Magic string, not obvious</td><td>Self-documenting!</td></tr>
</tbody>
</table>

<h2>The Complete Trie Class</h2>

<pre><code>class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        """Insert word into trie - O(m)"""
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True

    def search(self, word):
        """Search for exact word - O(m)"""
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end_of_word

    def startsWith(self, prefix):
        """Check if prefix exists - O(m)"""
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True</code></pre>

<h2>Visualization</h2>

<p><strong>After inserting ["cat", "car", "card", "dog"]:</strong></p>

<pre><code>         root
        /    \
       c      d
       |      |
       a      o
      / \     |
    *t   r   *g
        / \
       *   d
           |
           *

* = is_end_of_word = True</code></pre>

<h3>Tree Structure Elements</h3>

<ul>
<li><strong>Root:</strong> Empty starting point (no character)</li>
<li><strong>Edges:</strong> Labeled with characters (a, b, c, ...)</li>
<li><strong>Nodes:</strong> TrieNode objects that can branch to different next letters</li>
<li><strong>Paths:</strong> From root to a starred node = a complete word</li>
</ul>

<h2>Why "Trie"?</h2>

<p>The name comes from "re<strong>TRIE</strong>val" — it's optimized for retrieval operations!</p>

<p>Also called <strong>Prefix Tree</strong> because prefixes share paths!</p>

<h1>When NOT to use a Trie (quick anti-patterns)</h1>

<pre><code>If you only need exact lookup:
  Use a hash set / hash map (simpler, often faster in practice)

If you thought "sorted list + binary search solves prefix search":
  It helps for read-only data, but frequent insertions are costly.
  Inserting into a sorted array needs shifting elements → O(n) per insert.</code></pre>

<h1>One invariant that makes correctness easier</h1>

<pre><code>Invariant:
Every TrieNode corresponds to a prefix of at least one inserted word.

root corresponds to the empty prefix "".</code></pre>

<p>This is why operations are safe to reason about: you're always "standing on" a prefix that actually exists in the inserted set.</p>

<h1>Comprehensive Complexity Comparison (Interview Critical!)</h1>

<h2>Complete Time and Space Complexity Table</h2>

<table>
<thead><tr><th>Operation</th><th>List</th><th>Hash Set</th><th>Trie</th></tr></thead>
<tbody>
<tr><td><strong>insert(word)</strong></td><td>O(1) amortized</td><td>O(m)</td><td><strong>O(m)</strong></td></tr>
<tr><td><strong>search(word)</strong></td><td>O(n × m)</td><td>O(m) average</td><td><strong>O(m)</strong></td></tr>
<tr><td><strong>startsWith(prefix)</strong></td><td>O(n × m)</td><td>O(n × m)</td><td><strong>O(m)</strong> ✅</td></tr>
<tr><td><strong>wordsWithPrefix(prefix)</strong></td><td>O(n × m)</td><td>O(n × m)</td><td><strong>O(m + k)</strong> where k = results</td></tr>
<tr><td><strong>Space Complexity</strong></td><td>O(n × m)</td><td>O(n × m)</td><td><strong>O(total chars)</strong> (often much less)</td></tr>
</tbody>
</table>

<p><strong>Where:</strong></p>
<ul>
<li><strong>n</strong> = number of words stored</li>
<li><strong>m</strong> = average word/prefix length</li>
<li><strong>k</strong> = number of words matching prefix</li>
</ul>

<h2>Detailed Breakdown by Operation</h2>

<h3>insert(word)</h3>

<table>
<thead><tr><th>Data Structure</th><th>Time</th><th>Why?</th></tr></thead>
<tbody>
<tr><td><strong>List</strong></td><td>O(1) amortized</td><td>Append to end of list</td></tr>
<tr><td><strong>Hash Set</strong></td><td>O(m)</td><td>Hash computation takes O(m), then O(1) insert</td></tr>
<tr><td><strong>Trie</strong></td><td>O(m)</td><td>Create/walk m nodes, each step O(1) hash map lookup</td></tr>
</tbody>
</table>

<h3>search(word) - Exact Match</h3>

<table>
<thead><tr><th>Data Structure</th><th>Time</th><th>Why?</th></tr></thead>
<tbody>
<tr><td><strong>List</strong></td><td>O(n × m)</td><td>Linear scan: check n words, compare m chars each</td></tr>
<tr><td><strong>Hash Set</strong></td><td>O(m) average</td><td>Hash word (O(m)), then O(1) lookup</td></tr>
<tr><td><strong>Trie</strong></td><td>O(m)</td><td>Walk m nodes, each step O(1) lookup</td></tr>
</tbody>
</table>

<p><strong>Interview note:</strong> Hash Set and Trie are both O(m) for exact search, but Hash Set is simpler and often faster in practice.</p>

<h3>startsWith(prefix) - Prefix Check</h3>

<table>
<thead><tr><th>Data Structure</th><th>Time</th><th>Why?</th></tr></thead>
<tbody>
<tr><td><strong>List</strong></td><td>O(n × m)</td><td>Scan all n words, compare m chars per word</td></tr>
<tr><td><strong>Hash Set</strong></td><td>O(n × m)</td><td><strong>No improvement!</strong> Must iterate all words</td></tr>
<tr><td><strong>Trie</strong></td><td><strong>O(m)</strong> ✅</td><td>Walk only m nodes (prefix length), independent of n!</td></tr>
</tbody>
</table>

<p><strong>This is where Trie shines!</strong> With 1M words:</p>
<ul>
<li>List/Hash Set: <strong>10 million operations</strong></li>
<li>Trie: <strong>10 operations</strong> (just prefix length)</li>
</ul>

<h3>Space Complexity</h3>

<table>
<thead><tr><th>Data Structure</th><th>Space</th><th>Details</th></tr></thead>
<tbody>
<tr><td><strong>List</strong></td><td>O(n × m)</td><td>Store each word separately, no sharing</td></tr>
<tr><td><strong>Hash Set</strong></td><td>O(n × m)</td><td>Store each word + hash table overhead (~1.5×)</td></tr>
<tr><td><strong>Trie</strong></td><td>O(total chars)</td><td><strong>Worst:</strong> O(n × m) if no sharing; <strong>Best:</strong> O(m) if all words share prefix; <strong>Average:</strong> Much less due to prefix sharing</td></tr>
</tbody>
</table>

<p><strong>Real-world example:</strong> Storing ["apple", "application", "apply"]</p>
<ul>
<li><strong>List</strong>: 5 + 11 + 5 = 21 characters</li>
<li><strong>Hash Set</strong>: ~21 characters + overhead</li>
<li><strong>Trie</strong>: Shares "appl" → stored once! Much less space</li>
</ul>

<h2>When to Use Each (Interview Decision Framework)</h2>

<h3>Use List when:</h3>
<ul>
<li>Only need simple storage</li>
<li>Don't need fast lookups</li>
<li>Small dataset (&lt; 1000 items)</li>
</ul>

<h3>Use Hash Set when:</h3>
<ul>
<li>✅ Need fast <strong>exact</strong> word lookup (O(m) vs O(n×m))</li>
<li>Don't need prefix operations</li>
<li>✅ Simpler code, less memory overhead</li>
</ul>

<h3>Use Trie when:</h3>
<ul>
<li>✅ Need <strong>prefix operations</strong> (startsWith, autocomplete)</li>
<li>✅ Many words share common prefixes</li>
<li>✅ Need incremental lookup as user types</li>
<li>✅ Want O(m) prefix search independent of dictionary size</li>
</ul>

<h2>Key Insights</h2>

<ol>
<li><strong>Characters become paths</strong> — each character is a key/edge in the tree</li>
<li><strong>Common prefixes share paths</strong> — "car" and "card" share c→a→r</li>
<li><strong>A word-ending marker distinguishes words from prefixes</strong> — the star/<code>is_end_of_word</code> indicates a complete word</li>
<li><strong>O(m) operations</strong> — independent of dictionary size!</li>
</ol>

<h2>Reusable Mental Checklist</h2>

<pre><code>Do you need prefix operations (startsWith / autocomplete / prefix filtering)?
Do many strings share beginnings?
Do you want fast incremental lookup as the user types?

If YES → trie is a great fit.
If NO  → consider hash set/map (exact lookup) or other indexing.</code></pre>

<p><strong>Next:</strong> Time to implement this yourself!</p>`,
        },

        // PHASE 5A: TRIE INSERT
        ,// PHASE 5B: TRIE SEARCH
        ,// PHASE 5C: TRIE STARTS_WITH
        ,// PHASE 5D: TRIE DELETE
        ,// PHASE 6.5: BRIDGE - PREFIX ENUMERATION / COUNTING (SUBTREE TRAVERSAL)
        ,// PHASE 7: REAL PROBLEMS - Add and Search Word (Wildcard DFS)
        ,// EXERCISE: Word Search II (Trie + Backtracking on Grid)
        ,// EXERCISE: Search Suggestions System (Autocomplete)
        ,// EXERCISE: Magic Dictionary (LC 676)
        ,// EXERCISE: Longest Word in Dictionary (LC 720)
        ,// EXERCISE: Longest Word Sequence
        ,// EXERCISE: Palindrome Pairs (LC 336)
        ,// SECTION: Module Summary
        {
            type: 'reading',
            id: 'module12-summary',
            title: 'Tries & String Patterns Complete!',
            content: `<h1>🎉 Tries &amp; Advanced String Patterns Complete!</h1>
<h2>What You Discovered! 💡</h2>
<h3>The Journey</h3>
<ol>
<li><strong>List of Strings</strong> - O(n × m) for everything 😟</li>
<li><strong>Hash Set</strong> - O(1) exact match, but O(n × m) for prefix 😐</li>
<li><strong>Nested Dictionaries</strong> - O(m) for all operations! 🎉</li>
<li><strong>TrieNode Class</strong> - Clean, extensible implementation ✨</li>
</ol>
<h3>Key Insight</h3>
<p><strong>Common prefixes should be stored once!</strong></p>
<p>&quot;apple&quot;, &quot;application&quot;, &quot;apply&quot; → all share &quot;app&quot;</p>
<p>This led us to discover the <strong>Trie</strong> (Prefix Tree)! 🌳</p>
<hr>
<h2>Trie Fundamentals</h2>
<h3>Structure</h3>
<ul>
<li><strong>Root:</strong> Empty starting point</li>
<li><strong>Edges:</strong> Labeled with characters</li>
<li><strong>Nodes:</strong> Mark end of words</li>
<li><strong>Paths:</strong> Represent words</li>
</ul>
<h3>Time Complexity</h3>
<ul>
<li><strong>Insert:</strong> O(m) where m = word length</li>
<li><strong>Search:</strong> O(m)</li>
<li><strong>Prefix search:</strong> O(m)</li>
<li><strong>No dependence on number of words!</strong></li>
</ul>
<h3>Space Efficiency</h3>
<p>Common prefixes shared → saves memory for similar words</p>
<hr>
<h2>When to Use Tries?</h2>
<p><strong>Use Trie when:</strong></p>
<ul>
<li>✅ Need prefix-based search</li>
<li>✅ Autocomplete/suggestions</li>
<li>✅ Word validation with prefix</li>
<li>✅ Dictionary with many similar words</li>
</ul>
<p><strong>Don&#39;t use Trie when:</strong></p>
<ul>
<li>❌ Only need exact match (use hash map)</li>
<li>❌ Memory is very limited</li>
<li>❌ Strings are very long and diverse</li>
</ul>
<hr>
<h2>Pattern Recognition</h2>
<p><strong>&quot;Prefix&quot; or &quot;starts with&quot;?</strong> → Trie</p>
<p><strong>&quot;Autocomplete&quot; or &quot;suggestions&quot;?</strong> → Trie + DFS</p>
<p><strong>&quot;Dictionary&quot; with prefix search?</strong> → Trie</p>
<p><strong>&quot;Word search&quot; in grid?</strong> → Trie + backtracking</p>
<p><strong>&quot;Multiple words&quot; to check?</strong> → Build Trie first</p>
<hr>
<h2>The Discovery Process</h2>
<p>You learned to:</p>
<ol>
<li><strong>Start with brute force</strong> (list of strings)</li>
<li><strong>Identify bottlenecks</strong> (O(n × m) scan for prefix)</li>
<li><strong>Optimize step by step</strong> (hash set → nested dict)</li>
<li><strong>Discover data structure</strong> (Trie emerges naturally!)</li>
<li><strong>Formalize solution</strong> (TrieNode class)</li>
</ol>
<p>This problem-solving approach works for harder problems too! 🚀</p>
<hr>
<h2>Next Steps</h2>
<p><strong>Module 15: Advanced Topics &amp; Mastery</strong> - Complete your DSA journey!</p>
<p>Ready? Let&#39;s go! 🎉</p>
`,
            estimatedReadTime: 240,
            autoMarkComplete: false,
        },
    
    ...module12TriesLessonSmartPracticeExercises,
    ],
};
