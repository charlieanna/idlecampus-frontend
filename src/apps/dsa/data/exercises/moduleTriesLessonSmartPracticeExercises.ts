import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const module12TriesLessonSmartPracticeExercises: ExerciseSection[] = [
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-trie-insert',
            title: 'Code: Trie Insert',
            description: 'Implement the insert operation for a Trie',
            instruction: `<h2>What insert does</h2>
<p>Implement the <code>insert(word)</code> method for a Trie data structure.</p>
<p>Given a word, add it to the Trie so it can be found later.</p>

<h2>The Pattern</h2>
<pre><code>For each letter in the word:
    1. Is there already a path for this letter?
       - NO  → create a new TrieNode
       - YES → use the existing one
    2. Move to that node
After all letters: mark "a complete word ends here"</code></pre>

<h2>Example</h2>
<pre><code>trie = Trie()
trie.insert("cat")    # Creates path: root → 'c' → 'a' → 't' (marked as word)
trie.insert("car")    # Reuses 'c' → 'a', creates new 't' → 'r' (marked as word)</code></pre>

<h2>Visual</h2>
<pre><code>After inserting "cat" and "car":

      root
       │
       c
       │
       a
      / \\
     t   r
    (✓) (✓)   ← both are marked as complete words</code></pre>

<h2>Your Task</h2>
<p>Complete the <code>insert</code> method.</p>`,
            starterCode: `class TrieNode:
    def __init__(self):
        self.children = {}        # char → TrieNode
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        """
        Insert word into the trie.
        - Walk through each character
        - Create new nodes when needed
        - Mark the final node as end of word
        """
        pass`,
            testCases: [
                {
                    input: 'trie = Trie(); trie.insert("cat"); trie.root.children.get("c") is not None',
                    expectedOutput: 'True',
                    description: 'Insert "cat" - should create path c->a->t'
                },
                {
                    input: 'trie = Trie(); trie.insert("cat"); node = trie.root.children["c"].children["a"].children["t"]; node.is_end_of_word',
                    expectedOutput: 'True',
                    description: 'Insert "cat" - last node should be marked as end of word'
                },
                {
                    input: 'trie = Trie(); trie.insert("cat"); trie.insert("car"); len(trie.root.children["c"].children["a"].children)',
                    expectedOutput: '2',
                    description: 'Insert "cat" and "car" - should share prefix c->a, then branch to t and r'
                }
            ],
            solution: {
                afterAttempt: 2,
                text: `# Trie Insert Solution

\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}        # char → TrieNode
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True
\`\`\`

## Step-by-step for "cat"

\`\`\`
Start: node = root

char 'c':
  - 'c' not in root.children → create new TrieNode
  - root.children = {'c': TrieNode()}
  - node = that new TrieNode

char 'a':
  - 'a' not in node.children → create new TrieNode
  - node.children = {'a': TrieNode()}
  - node = that new TrieNode

char 't':
  - 't' not in node.children → create new TrieNode
  - node.children = {'t': TrieNode()}
  - node = that new TrieNode

End of word:
  - node.is_end_of_word = True
\`\`\`

## Time: O(m) where m = word length
Each character requires one dictionary lookup (O(1)) and possibly one node creation (O(1)).`
            },
            solutionExplanation: `## The Two Key Actions

**1. Create or reuse nodes:**
\`\`\`python
if char not in node.children:
    node.children[char] = TrieNode()  # Create new path
node = node.children[char]            # Move forward
\`\`\`

**2. Mark end of word:**
\`\`\`python
node.is_end_of_word = True
\`\`\`

This is what distinguishes "cat" (a word) from "ca" (just a prefix).`,
            hints: [
                { afterAttempt: 1, text: 'Start at self.root, then walk character by character' },
                { afterAttempt: 2, text: 'For each char: check if char exists in node.children. If not, create node.children[char] = TrieNode()' },
                { afterAttempt: 3, text: 'After loop, set node.is_end_of_word = True' }
            ],
            targetComplexity: {
                time: "O(m)",
                space: "O(m)"
            },
            requiredForProgress: true,
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-trie-search',
            title: 'Code: Trie Search',
            description: 'Implement the search operation for a Trie',
            instruction: `<h2>What search does</h2>
<p>Implement the <code>search(word)</code> method for a Trie.</p>
<p>Return <code>True</code> if the <strong>exact word</strong> was previously inserted. Return <code>False</code> otherwise.</p>

<h2>Important Distinction</h2>
<pre><code>trie.insert("apple")
trie.search("apple")  # True  ← exact word exists
trie.search("app")    # False ← "app" is just a PREFIX, not a word!</code></pre>

<h2>The Pattern</h2>
<pre><code>For each letter in the word:
    1. Is there a path for this letter?
       - NO  → return False (word doesn't exist)
       - YES → move to that node
After all letters: check if is_end_of_word is True</code></pre>

<h2>Visual</h2>
<pre><code>After inserting "apple":

      root
       │
       a
       │
       p
       │
       p
       │
       l
       │
       e (✓)   ← only HERE is marked as a complete word

search("apple") → True  (reached 'e' which has ✓)
search("app")   → False (reached second 'p' which has NO ✓)</code></pre>

<h2>Your Task</h2>
<p>Complete the <code>search</code> method. The <code>insert</code> method is already provided.</p>`,
            starterCode: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def search(self, word):
        """
        Return True if word is in the trie (was inserted).
        Return False if word was never inserted.

        Note: "app" is NOT found if only "apple" was inserted!
        """
        pass

    # -------- Helper methods (already implemented) --------

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True`,
            testCases: [
                {
                    input: 'trie = Trie(); trie.insert("apple"); trie.search("apple")',
                    expectedOutput: 'True',
                    description: 'Exact word exists'
                },
                {
                    input: 'trie = Trie(); trie.insert("apple"); trie.search("app")',
                    expectedOutput: 'False',
                    description: 'Prefix exists but not as a complete word'
                },
                {
                    input: 'trie = Trie(); trie.insert("apple"); trie.search("banana")',
                    expectedOutput: 'False',
                    description: 'Word never inserted'
                },
                {
                    input: 'trie = Trie(); trie.search("anything")',
                    expectedOutput: 'False',
                    description: 'Empty trie returns False'
                }
            ],
            solution: {
                afterAttempt: 2,
                text: `# Trie Search Solution

\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end_of_word

    # -------- Helper methods (already implemented) --------

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True
\`\`\`

## Why \`return node.is_end_of_word\` (not just \`return True\`)?

\`\`\`
Trie with "apple" inserted:

root → a → p → p → l → e(✓)

search("app"):
  - Walk: root → a → p → p
  - Reached end of "app"
  - But is_end_of_word = False here!
  - Return False

search("apple"):
  - Walk: root → a → p → p → l → e
  - Reached end of "apple"  
  - is_end_of_word = True here!
  - Return True
\`\`\`

## Time: O(m)
Walk m characters, each step is O(1) dictionary lookup.`
            },
            solutionExplanation: `## The Two Failure Cases

**1. Path doesn't exist:**
\`\`\`python
if char not in node.children:
    return False  # Can't continue walking
\`\`\`

**2. Path exists but it's only a prefix:**
\`\`\`python
return node.is_end_of_word  # False if never marked as a word
\`\`\`

## Compare: insert vs search

| Operation | Missing path? | End of word? |
|-----------|---------------|--------------|
| insert    | Create it     | Mark True    |
| search    | Return False  | Return its value |`,
            hints: [
                { afterAttempt: 1, text: 'Similar to insert: walk character by character from root' },
                { afterAttempt: 2, text: 'If char not in children, return False immediately (word not in trie)' },
                { afterAttempt: 3, text: 'After walking all chars, return node.is_end_of_word (not just True!)' }
            ],
            targetComplexity: {
                time: "O(m)",
                space: "O(1)"
            },
            requiredForProgress: true,
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-trie-startswith',
            title: 'Code: Trie startsWith (Prefix Check)',
            description: 'Implement the startsWith operation for a Trie',
            instruction: `<h2>What startsWith does</h2>
<p>Implement the <code>startsWith(prefix)</code> method for a Trie.</p>
<p>Return <code>True</code> if <strong>any</strong> previously inserted word starts with the given prefix. Return <code>False</code> otherwise.</p>

<h2>Difference from search</h2>
<pre><code>trie.insert("apple")

trie.search("app")      # False ← "app" wasn't inserted as a word
trie.startsWith("app")  # True  ← "apple" STARTS WITH "app"!</code></pre>

<h2>The Pattern</h2>
<pre><code>For each letter in the prefix:
    1. Is there a path for this letter?
       - NO  → return False
       - YES → move to that node
After all letters: return True (we don't care about is_end_of_word!)</code></pre>

<h2>Visual</h2>
<pre><code>After inserting "apple":

      root
       │
       a
       │
       p
       │
       p    ← startsWith("app") reaches here → True!
       │
       l
       │
       e (✓)

startsWith("app") → True (path exists, don't care about ✓)
startsWith("apt") → False (no 't' after "ap")</code></pre>

<h2>Your Task</h2>
<p>Complete the <code>startsWith</code> method. Both <code>insert</code> and <code>search</code> are provided.</p>`,
            starterCode: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def startsWith(self, prefix):
        """
        Return True if any word in the trie starts with the given prefix.
        Return False otherwise.

        Note: "app" returns True if "apple" exists (even though "app" itself wasn't inserted)
        """
        pass

    # -------- Helper methods (already implemented) --------

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True

    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end_of_word`,
            testCases: [
                {
                    input: 'trie = Trie(); trie.insert("apple"); trie.startsWith("app")',
                    expectedOutput: 'True',
                    description: '"apple" starts with "app"'
                },
                {
                    input: 'trie = Trie(); trie.insert("apple"); trie.startsWith("apple")',
                    expectedOutput: 'True',
                    description: 'Full word is also a valid prefix'
                },
                {
                    input: 'trie = Trie(); trie.insert("apple"); trie.startsWith("apt")',
                    expectedOutput: 'False',
                    description: 'No word starts with "apt"'
                },
                {
                    input: 'trie = Trie(); trie.insert("apple"); trie.startsWith("b")',
                    expectedOutput: 'False',
                    description: 'No word starts with "b"'
                },
                {
                    input: 'trie = Trie(); trie.insert("apple"); trie.startsWith("")',
                    expectedOutput: 'True',
                    description: 'Empty prefix - all words match'
                }
            ],
            solution: {
                afterAttempt: 2,
                text: `# Trie startsWith Solution

\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def startsWith(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True

    # -------- Helper methods (already implemented) --------

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True

    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end_of_word
\`\`\`

## Compare: search vs startsWith

\`\`\`python
# search - must be an inserted word
return node.is_end_of_word

# startsWith - just need the path to exist
return True
\`\`\`

That's the ONLY difference!

## Time: O(m)
Walk m characters of prefix, each O(1) dictionary lookup.`
            },
            solutionExplanation: `## search vs startsWith - Side by Side

\`\`\`python
def search(self, word):
    node = self.root
    for char in word:
        if char not in node.children:
            return False
        node = node.children[char]
    return node.is_end_of_word  # ← Must be marked as word

def startsWith(self, prefix):
    node = self.root
    for char in prefix:
        if char not in node.children:
            return False
        node = node.children[char]
    return True                  # ← Just need path to exist
\`\`\`

## Why This Matters

This is why Tries are powerful for **autocomplete**:
- User types "app"
- \`startsWith("app")\` confirms words exist with that prefix
- Then you can collect all words under that subtree`,
            hints: [
                { afterAttempt: 1, text: 'Almost identical to search! Walk the prefix character by character.' },
                { afterAttempt: 2, text: 'The only difference: at the end, return True (not is_end_of_word)' }
            ],
            targetComplexity: {
                time: "O(m)",
                space: "O(1)"
            },
            requiredForProgress: true,
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-trie-delete',
            title: 'Code: Delete Word from Trie',
            description: 'Implement deletion operation for a Trie',
            instruction: `<h2>Delete Word from Trie</h2>
<p>Extend your Trie implementation to support deletion of words.</p>
<p>Implement <code>delete(word)</code> that removes a word from the trie.</p>

<h2>Edge Cases to Handle</h2>
<ol>
<li><strong>Word doesn't exist</strong> - Do nothing</li>
<li><strong>Word is prefix of other words</strong> - Just unmark <code>is_end_of_word</code>, don't delete nodes</li>
<li><strong>Word has unique suffix</strong> - Delete nodes that aren't shared with other words</li>
<li><strong>Word shares prefix with others</strong> - Only delete the unique suffix part</li>
</ol>

<h2>Example</h2>
<pre><code>trie = Trie()
trie.insert("apple")
trie.insert("app")
trie.insert("application")

trie.search("apple")      # True
trie.delete("apple")
trie.search("apple")      # False
trie.search("app")        # True (still exists!)
trie.startsWith("app")    # True (path still exists for "application")

trie.delete("app")
trie.search("app")        # False
trie.startsWith("app")    # True (still prefix of "application")</code></pre>

<h2>Constraints</h2>
<ul>
<li>Word consists of lowercase English letters</li>
<li>Word length: 1 to 2000 characters</li>
</ul>

<h2>Approach Hint</h2>
<p>Think recursively! The key question at each node: "Should I delete this node?"</p>
<p>A node can be deleted if:</p>
<ol>
<li>It's not marked as end of another word</li>
<li>It has no children (no other words pass through it)</li>
</ol>`,
            starterCode: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def delete(self, word):
        """
        Delete word from trie.
        Return True if word was deleted, False if word didn't exist.
        """
        pass

    # -------- Helper methods (already implemented) --------

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True

    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end_of_word

    def startsWith(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True`,
            hints: [
                { afterAttempt: 1, text: 'First check if the word exists. If not, return False.' },
                { afterAttempt: 2, text: 'Use recursion: delete_helper(node, word, index) returns True if the current node should be deleted.' },
                { afterAttempt: 3, text: 'A node should be deleted if: (1) we\'ve processed all characters, (2) it\'s not end of another word, and (3) it has no children.' },
                { afterAttempt: 4, text: 'At each level, after recursive call, check if child should be deleted: if delete_helper returns True, remove that child from children dict.' }
            ],
            testCases: [
                {
                    input: 'trie = Trie(); trie.insert("apple"); trie.insert("app"); trie.delete("apple"); trie.search("apple")',
                    expectedOutput: 'False'
                },
                {
                    input: 'trie = Trie(); trie.insert("apple"); trie.insert("app"); trie.delete("apple"); trie.search("app")',
                    expectedOutput: 'True'
                },
                {
                    input: 'trie = Trie(); trie.insert("apple"); trie.insert("app"); trie.delete("apple"); trie.startsWith("app")',
                    expectedOutput: 'True'
                },
                {
                    input: 'trie = Trie(); trie.insert("apple"); trie.delete("app"); trie.search("apple")',
                    expectedOutput: 'True'
                },
                {
                    input: 'trie = Trie(); trie.insert("apple"); trie.delete("apple"); trie.search("apple")',
                    expectedOutput: 'False'
                },
                {
                    input: 'trie = Trie(); trie.insert("apple"); trie.delete("apple"); trie.startsWith("app")',
                    expectedOutput: 'False'
                },
                {
                    input: 'trie = Trie(); trie.delete("nonexistent")',
                    expectedOutput: 'False'
                }
            ],
            solution: {
                afterAttempt: 3,
                text: `# Trie Delete Operation

\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def delete(self, word):
        """Delete word from trie. Returns True if deleted, False if not found."""
        # Check if word exists first
        if not self.search(word):
            return False

        def delete_helper(node, word, index):
            """
            Returns True if the current node should be deleted.
            """
            # Base case: reached end of word
            if index == len(word):
                # Unmark as end of word (we know it exists from check above)
                node.is_end_of_word = False

                # Delete node if it has no children
                return len(node.children) == 0

            char = word[index]

            # Recurse to next character
            child_node = node.children[char]
            should_delete_child = delete_helper(child_node, word, index + 1)

            # Delete child if needed
            if should_delete_child:
                del node.children[char]

                # Current node can be deleted if:
                # - It's not end of another word
                # - It has no other children
                return not node.is_end_of_word and len(node.children) == 0

            return False

        delete_helper(self.root, word, 0)
        return True

    # -------- Helper methods (already implemented) --------

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True

    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end_of_word

    def startsWith(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True
\`\`\`

## Complexity

- **Time:** O(m) where m = word length
- **Space:** O(m) for recursion stack

## Key Insight

The tricky part is knowing **when to delete nodes**:

1. **Never delete** if node is end of another word
2. **Never delete** if node has other children (other words pass through)
3. **Delete** only orphaned nodes with no purpose`
            },
            solutionExplanation: `## Delete Operation Analysis

### Three Scenarios

**Scenario 1: Word is prefix of others**
\`\`\`
Trie: "app", "apple"
Delete "app"
Result: Just unmark is_end_of_word at 'p'
        Path to "apple" preserved!
\`\`\`

**Scenario 2: Word has unique suffix**
\`\`\`
Trie: "app", "apple"
Delete "apple"
Result: Remove 'l' and 'e' nodes
        "app" still intact!
\`\`\`

**Scenario 3: Word shares no prefix**
\`\`\`
Trie: "cat", "dog"
Delete "dog"
Result: Remove entire "dog" branch
\`\`\`

### Recursive Logic

\`\`\`
delete_helper returns True if current node should be deleted

At each node:
1. If end of word: unmark, return (no children?)
2. Else: recurse, maybe delete child, return (should I be deleted?)

Node deleted when:
- Not end of any word AND
- Has no children
\`\`\``,
            targetComplexity: {
                time: "O(m)",
                space: "O(m)"
            },
            complexityQuizPlacement: 'after',
            requiredForProgress: true,
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-prefix-enumeration',
            title: 'Code: Autocomplete from Prefix (Enumerate + Count)',
            description: 'Practice subtree traversal: list and count words that share a prefix',
            instruction: `<h2>Autocomplete from Prefix</h2>
<p>You already built the prefix structure. Now we'll do the missing micro-step before wildcard/grid DFS:</p>
<p>Given a prefix, <strong>go to the point</strong> that represents that prefix, then <strong>walk all continuations</strong> to:</p>
<ul>
<li>return every full word that starts with the prefix</li>
<li>count how many such words exist</li>
</ul>

<pre><code>Words stored: "cat", "car", "card", "dog"

         (start)
          |
          c
          |
          a
         / \\
        t   r
        ⭐   ⭐
            |
            d
            ⭐

⭐ = end of a complete word</code></pre>

<p>For prefix "ca":</p>
<p>→ you first walk c → a (that's the prefix)<br/>
→ then you explore everything below it to produce: ["car", "card", "cat"] and count = 3</p>

<h2>Requirements</h2>
<p>Add these methods to <code>Trie</code>:</p>
<pre><code>getAllWordsWithPrefix(prefix) -> List[str]
countWordsWithPrefix(prefix)  -> int</code></pre>

<h2>Notes</h2>
<ul>
<li>Return the list in <strong>sorted order</strong> so tests are deterministic.</li>
<li>If the prefix path doesn't exist, return <code>[]</code> and <code>0</code>.</li>
</ul>`,
            starterCode: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True

    def getAllWordsWithPrefix(self, prefix):
        pass

    def countWordsWithPrefix(self, prefix):
        pass`,
            expectedOutput: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True

    def getAllWordsWithPrefix(self, prefix):
        # Step 1: walk the prefix
        node = self.root
        for char in prefix:
            if char not in node.children:
                return []
            node = node.children[char]

        # Step 2: explore everything below (subtree traversal)
        result = []

        def dfs(curr, suffix):
            if curr.is_end_of_word:
                result.append(prefix + suffix)
            for ch, nxt in curr.children.items():
                dfs(nxt, suffix + ch)

        dfs(node, "")
        return sorted(result)

    def countWordsWithPrefix(self, prefix):
        # Same first step: walk the prefix
        node = self.root
        for char in prefix:
            if char not in node.children:
                return 0
            node = node.children[char]

        # Then count word-ending markers below
        def dfs_count(curr):
            total = 1 if curr.is_end_of_word else 0
            for nxt in curr.children.values():
                total += dfs_count(nxt)
            return total

        return dfs_count(node)`,
            testCases: [
                {
                    input: 'trie = Trie(); trie.insert("cat"); trie.insert("car"); trie.insert("card"); trie.insert("dog"); trie.getAllWordsWithPrefix("ca")',
                    expectedOutput: '["car", "card", "cat"]'
                },
                {
                    input: 'trie = Trie(); trie.insert("cat"); trie.insert("car"); trie.insert("card"); trie.insert("dog"); trie.countWordsWithPrefix("ca")',
                    expectedOutput: '3'
                },
                {
                    input: 'trie = Trie(); trie.insert("cat"); trie.insert("car"); trie.insert("card"); trie.insert("dog"); trie.getAllWordsWithPrefix("car")',
                    expectedOutput: '["car", "card"]'
                },
                {
                    input: 'trie = Trie(); trie.insert("cat"); trie.insert("car"); trie.insert("card"); trie.insert("dog"); trie.countWordsWithPrefix("car")',
                    expectedOutput: '2'
                },
                {
                    input: 'trie = Trie(); trie.insert("cat"); trie.insert("car"); trie.insert("card"); trie.insert("dog"); trie.getAllWordsWithPrefix("z")',
                    expectedOutput: '[]'
                },
                {
                    input: 'trie = Trie(); trie.insert("cat"); trie.insert("car"); trie.insert("card"); trie.insert("dog"); trie.countWordsWithPrefix("z")',
                    expectedOutput: '0'
                }
            ],
            solution: {
                afterAttempt: 3,
                text: `# Prefix Enumeration + Counting (Bridge)

\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True

    def getAllWordsWithPrefix(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return []
            node = node.children[char]

        result = []

        def dfs(curr, suffix):
            if curr.is_end_of_word:
                result.append(prefix + suffix)
            for ch, nxt in curr.children.items():
                dfs(nxt, suffix + ch)

        dfs(node, "")
        return sorted(result)

    def countWordsWithPrefix(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return 0
            node = node.children[char]

        def dfs_count(curr):
            total = 1 if curr.is_end_of_word else 0
            for nxt in curr.children.values():
                total += dfs_count(nxt)
            return total

        return dfs_count(node)
\`\`\``
            },
            solutionExplanation: `## Why this bridge matters

This is the “earned DFS” step:

\`\`\`
Step A: Walk the prefix (single path, no branching)
prefix = "ca"

start → c → a
\`\`\`

\`\`\`
Step B: Explore everything below that point (subtree traversal)

         a
        / \\
       t   r
       ⭐   ⭐
           |
           d
           ⭐
\`\`\`

When you do wildcard search later, the only new thing is *where* the branching starts:
instead of branching after a fixed prefix, you branch whenever you see '.'.`,
            hints: [
                { afterAttempt: 1, text: 'First walk the prefix like startsWith(). If you can’t, return [] / 0.' },
                { afterAttempt: 2, text: 'Once you reach the prefix point, do a DFS below it to gather suffixes.' },
                { afterAttempt: 3, text: 'For counting, do the same DFS but add 1 each time you see a word-ending marker.' }
            ],
            targetComplexity: {
                time: "O(p + output)",
                space: "O(total characters inserted) + O(depth)"
            },
            requiredForProgress: true,
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-add-search-word',
            title: 'Code: Add and Search Word (Wildcard)',
            description: 'Design a data structure that supports adding words and searching with wildcards',
            instruction: `<h2>Design Add and Search Words Data Structure</h2>
<p>Design a data structure that supports adding new words and finding if a string matches any previously added string.</p>

<p>Implement the <code>WordDictionary</code> class:</p>
<ul>
<li><code>addWord(word)</code>: Adds word to the data structure</li>
<li><code>search(word)</code>: Returns true if there is any string in the data structure that matches word. The character '.' can match <strong>any</strong> letter.</li>
</ul>

<h2>Example</h2>
<pre><code>wordDictionary = WordDictionary()
wordDictionary.addWord("bad")
wordDictionary.addWord("dad")
wordDictionary.addWord("mad")
wordDictionary.search("pad")  # returns False
wordDictionary.search("bad")  # returns True
wordDictionary.search(".ad")  # returns True (matches "bad", "dad", "mad")
wordDictionary.search("b..")  # returns True (matches "bad")
wordDictionary.search("...")  # returns True (matches any 3-letter word)
wordDictionary.search(".a.")  # returns True (matches "bad", "dad", "mad")</code></pre>

<h2>Constraints</h2>
<ul>
<li>1 <= word.length <= 25</li>
<li>word in addWord consists of lowercase English letters</li>
<li>word in search consists of '.' or lowercase English letters</li>
<li>There will be at most 2 dots in word for search queries</li>
<li>At most 10^4 calls to addWord and search</li>
</ul>

<h2>Key Challenge</h2>
<p>The '.' wildcard requires exploring <strong>multiple branches</strong> of the trie!</p>
<p>Think: When you encounter '.', what do you need to do differently than a regular character?</p>

<h2>Hints</h2>
<ol>
<li><code>addWord</code> is just standard trie insertion</li>
<li><code>search</code> needs special handling for '.'</li>
<li>When you see '.', you must check <strong>all children</strong> of the current node</li>
<li>This naturally leads to a <strong>recursive/DFS</strong> approach</li>
</ol>`,
            starterCode: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class WordDictionary:
    def __init__(self):
        self.root = TrieNode()

    def addWord(self, word):
        """Add a word to the dictionary - standard trie insert"""
        pass

    def search(self, word):
        """
        Search for word with '.' as wildcard.
        '.' can match any single character.
        """
        pass`,
            hints: [
                { afterAttempt: 1, text: '**First, identify this is a search problem.** Ask yourself: "How can I narrow down the search space?" Consider: (1) sorting + binary search, (2) hashmaps to segment data, (3) tree structures like tries. For wildcards, sorting doesn\'t help much—but tries do!' },
                { afterAttempt: 2, text: '**Quick wins first:** For queries WITHOUT wildcards, a simple HashSet gives O(1) lookup. For ALL-wildcard queries like "...", just check if any word has that length. These edge cases are easy optimizations interviewers love to see!' },
                { afterAttempt: 3, text: '**Why Trie beats naive approaches:** (1) Exploding all wildcard combinations = O(26^k) strings to check. (2) Linear scan through all words = O(n × m) per query. Trie enables prefix-based pruning—if "ba" doesn\'t exist, skip ALL "ba*" paths!' },
                { afterAttempt: 4, text: 'For search, use a helper function that takes (node, word, index) to track position. When char is ".", iterate through ALL children and recursively search each branch.' },
                { afterAttempt: 5, text: 'Base case: when index == len(word), return node.is_end_of_word. The wildcard transforms O(m) single-path traversal into O(26^k × m) tree exploration.' },
                { afterAttempt: 6, text: '**Interview tip:** Proactively mention runtime varies: O(m) best case (no wildcards) vs O(26^k × m) worst case (k wildcards). Strong candidates identify WHEN their solution performs well vs poorly.' }
            ],
            solution: {
                afterAttempt: 3,
                text: `# Add and Search Word - Trie + DFS Solution

\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class WordDictionary:
    def __init__(self):
        self.root = TrieNode()

    def addWord(self, word):
        """Standard trie insertion - O(m)"""
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True

    def search(self, word):
        """Search with wildcard support - O(m) to O(26^m) worst case"""

        def dfs(node, index):
            # Base case: reached end of word
            if index == len(word):
                return node.is_end_of_word

            char = word[index]

            if char == '.':
                # Wildcard: try ALL children
                for child in node.children.values():
                    if dfs(child, index + 1):
                        return True
                return False
            else:
                # Regular character: follow specific path
                if char not in node.children:
                    return False
                return dfs(node.children[char], index + 1)

        return dfs(self.root, 0)
\`\`\`

## Time Complexity

- **addWord:** O(m) where m = word length
- **search (no wildcards):** O(m)
- **search (with wildcards):** O(26^k × m) worst case, where k = number of '.' wildcards

## Space Complexity

- **Trie structure:** O(total characters across all words)
- **Recursion stack:** O(m) for search

## Key Insight

The '.' wildcard transforms trie search from a single path traversal into a **tree exploration** (DFS). Each '.' branches into up to 26 possibilities!`
            },
            solutionExplanation: `## 🎯 This is a Classic Interview Problem

This problem is commonly asked at top tech companies because it tests multiple skills: search problem intuition, data structure selection, and runtime analysis.

---

## 📊 Approach Comparison: Why Trie Wins

| Approach | Setup Time | Search Time | When It Works Well |
|----------|-----------|-------------|-------------------|
| **Naive: Linear Scan** | O(1) | O(n × m) | Tiny dictionaries, rare queries |
| **Naive: Explode Wildcards** | O(n) | O(26^k) | Very few wildcards |
| **HashSet (no wildcards)** | O(n) | O(1) | Zero wildcards only |
| **Length Filtering** | O(n) | O(n/L) avg | Reduces search space |
| **Char-Index HashMap** | O(n × m) | O(intersections) | Few non-wildcard chars |
| **Trie + DFS** ✅ | O(n × m) | O(m) to O(26^k × m) | General case, prefix pruning |

---

## ❌ Approaches to Avoid (and Why)

### Approach 1: Explode All Wildcard Combinations
\`\`\`python
# DON'T DO THIS - Exponential!
def search_naive(word):
    if '.' not in word:
        return word in word_set
    # Generate "b.d" → ["bad", "bbd", "bcd", ..., "bzd"] - 26 possibilities!
    # For ".." → 26 × 26 = 676 possibilities
    # For "..." → 17,576 possibilities!
\`\`\`
**Problem:** O(26^k) where k = number of wildcards. Just 3 wildcards = 17,576 lookups!

### Approach 2: Explode All Words in Setup
\`\`\`python
# DON'T DO THIS - Exponential space!
def setup_naive(words):
    # For "foo", store: foo, .oo, f.o, fo., ..o, .o., f.., ...
    # That's 2^n combinations per word!
\`\`\`
**Problem:** O(2^m) space per word. "hello" → 32 variations stored!

---

## ✅ Optimizations to Mention in Interviews

### 1. Quick Wins (Edge Cases)
\`\`\`python
def search_optimized(word):
    # No wildcards? O(1) HashSet lookup
    if '.' not in word:
        return word in self.word_set
    
    # All wildcards? Just check length exists
    if word == '.' * len(word):
        return len(word) in self.length_set
    
    # Otherwise, use trie + DFS
    return self._dfs_search(word)
\`\`\`

### 2. Length Filtering + Trie
\`\`\`python
# Group words by length, each group has its own trie
self.tries_by_length = {}  # {3: Trie of 3-letter words, 4: Trie of 4-letter words}

def search(word):
    if len(word) not in self.tries_by_length:
        return False  # No words of this length!
    return self.tries_by_length[len(word)].search(word)
\`\`\`

### 3. Character-Index HashMap (Alternative Approach)
\`\`\`python
# Key: (char, index), Value: set of words
# For ["foo", "bar", "baz"]:
# ('f', 0) → {"foo"}
# ('b', 0) → {"bar", "baz"}
# ('o', 1) → {"foo"}
# ('a', 1) → {"bar", "baz"}

def search_hashmap(word):
    # Intersect sets for non-wildcard positions
    candidates = None
    for i, char in enumerate(word):
        if char != '.':
            words_with_char = self.index_map.get((char, i), set())
            if candidates is None:
                candidates = words_with_char
            else:
                candidates = candidates & words_with_char
    return len(candidates) > 0
\`\`\`

### 4. For Leading Wildcards (e.g., ".ar")
Tries are prefix-based, so leading wildcards are expensive. Consider:
- **Suffix Trie:** Store words in reverse order
- **Bidirectional Search:** Use prefix trie for ending chars, suffix trie for starting chars

---

## 🔴 Common Mistakes

1. **Prefix-of-another-word bug:** For words ["app", "apple"], searching "app" must return True even though it's not a leaf node. Always check \`is_end_of_word\`, not just "is leaf."

2. **Not handling empty string:** What should \`search("")\` return? Clarify with interviewer!

3. **Forgetting early termination:** When any DFS branch returns True, stop immediately—don't explore remaining branches.

---

## 📈 Interview Decision Criteria

| Level | Expected Performance |
|-------|---------------------|
| **No Hire** | Only linear scan, can't identify trie approach |
| **Maybe Hire** | Gets trie idea with hints, messy implementation |
| **Hire** | Clean trie + DFS, identifies edge case optimizations |
| **Strong Hire** | Discusses multiple approaches, proactively mentions where trie struggles (leading wildcards), considers hashmap alternative, clean bug-free code in <25 min |

---

## 🧠 Key Takeaways

1. **Search Problem Pattern:** Always ask "how can I narrow the search space?"
2. **Trie Strength:** Prefix-based pruning—if prefix doesn't exist, skip entire subtree
3. **Trie Weakness:** Leading wildcards force exploration from root (defeats prefix advantage)
4. **Combine Approaches:** Length filtering + trie, HashSet for no-wildcard queries
5. **Know Your Tradeoffs:** Best case O(m) vs worst case O(26^k × m)—interviewers love when you articulate this!`,
            targetComplexity: {
                time: "O(m) to O(26^k × m)",
                space: "O(total chars)"
            },
            testCases: [
                { input: 'addWord("bad"), addWord("dad"), addWord("mad"), search("pad")', expectedOutput: 'False' },
                { input: 'addWord("bad"), addWord("dad"), addWord("mad"), search("bad")', expectedOutput: 'True' },
                { input: 'addWord("bad"), addWord("dad"), addWord("mad"), search(".ad")', expectedOutput: 'True' },
                { input: 'addWord("bad"), addWord("dad"), addWord("mad"), search("b..")', expectedOutput: 'True' },
                { input: 'addWord("a"), addWord("ab"), search(".")', expectedOutput: 'True' },
                { input: 'addWord("a"), addWord("ab"), search("..")', expectedOutput: 'True' },
                { input: 'addWord("a"), addWord("ab"), search("a.")', expectedOutput: 'True' },
                { input: 'addWord("a"), addWord("ab"), search(".b")', expectedOutput: 'True' }
            ],
            complexityQuizPlacement: 'after',
            requiredForProgress: true
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-word-search-ii',
            title: 'Code: Word Search II (Grid + Trie)',
            description: 'Find all words from a dictionary that can be formed in a grid',
            instruction: `<h2>Word Search II</h2>
<p>Given an m x n board of characters and a list of words, return all words that can be constructed from letters of sequentially adjacent cells.</p>
<p>Adjacent cells are horizontally or vertically neighboring. The same cell may not be used more than once in a word.</p>

<h2>Example</h2>
<pre><code>board = [
  ["o","a","a","n"],
  ["e","t","a","e"],
  ["i","h","k","r"],
  ["i","f","l","v"]
]
words = ["oath","pea","eat","rain"]

Output: ["eat","oath"]</code></pre>

<p><strong>Explanation:</strong></p>
<ul>
<li>"oath" can be formed: o(0,0) → a(0,1) → t(1,1) → h(2,1)</li>
<li>"eat" can be formed: e(1,0) → a(1,2) → t(1,1) OR e(1,3) → a(0,2) → t(1,1)</li>
<li>"pea" cannot be formed (no valid path)</li>
<li>"rain" cannot be formed (no valid path)</li>
</ul>

<h2>Constraints</h2>
<ul>
<li>m == board.length</li>
<li>n == board[i].length</li>
<li>1 <= m, n <= 12</li>
<li>board[i][j] is a lowercase English letter</li>
<li>1 <= words.length <= 3 × 10^4</li>
<li>1 <= words[i].length <= 10</li>
<li>words[i] consists of lowercase English letters</li>
<li>All words are unique</li>
</ul>

<h2>Why Trie?</h2>
<p><strong>Naive approach:</strong> For each word, do DFS from every cell → O(words × cells × 4^L)</p>
<p><strong>Trie approach:</strong> Build trie of all words, do ONE DFS from each cell, checking against trie → Much faster!</p>

<h2>Key Insight</h2>
<p>The trie lets us <strong>prune early</strong>: if current path isn't a prefix of any word, stop immediately!</p>`,
            starterCode: `from typing import List

class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None  # Store complete word at end node

class Solution:
    def findWords(self, board, words):
        """
        Find all words from the list that exist in the board.
        Use Trie + Backtracking.
        """
        pass`,
            hints: [
                { afterAttempt: 1, text: 'First, build a trie from ALL words. Store the complete word at the end node (not just is_end_of_word).' },
                { afterAttempt: 2, text: 'DFS from each cell. At each step, check if current character exists in trie children.' },
                { afterAttempt: 3, text: 'Mark visited cells (e.g., change to "#") to avoid reuse. Restore after backtracking.' },
                { afterAttempt: 4, text: 'When node.word is not None, you found a complete word! Add to results and set node.word = None to avoid duplicates.' }
            ],
            solution: {
                afterAttempt: 3,
                text: `# Word Search II - Trie + Backtracking

\`\`\`python
from typing import List

class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None  # Store the complete word here

class Solution:
    def findWords(self, board, words):
        # Step 1: Build Trie from all words
        root = TrieNode()
        for word in words:
            node = root
            for char in word:
                if char not in node.children:
                    node.children[char] = TrieNode()
                node = node.children[char]
            node.word = word  # Store complete word at end

        rows, cols = len(board), len(board[0])
        result = []

        def dfs(row, col, node):
            # Get current character
            char = board[row][col]

            # Check if this character continues any word
            if char not in node.children:
                return

            next_node = node.children[char]

            # Found a complete word!
            if next_node.word:
                result.append(next_node.word)
                next_node.word = None  # Avoid duplicates

            # Mark as visited
            board[row][col] = '#'

            # Explore 4 directions
            for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                new_row, new_col = row + dr, col + dc
                if (0 <= new_row < rows and
                    0 <= new_col < cols and
                    board[new_row][new_col] != '#'):
                    dfs(new_row, new_col, next_node)

            # Restore cell (backtrack)
            board[row][col] = char

            # Optimization: prune empty branches
            if not next_node.children:
                del node.children[char]

        # Step 2: DFS from every cell
        for i in range(rows):
            for j in range(cols):
                if board[i][j] in root.children:
                    dfs(i, j, root)

        return result
\`\`\`

## Time Complexity

- **Building Trie:** O(W × L) where W = number of words, L = average word length
- **DFS:** O(M × N × 4^L) worst case, but trie pruning makes it much faster in practice

## Space Complexity

- **Trie:** O(W × L)
- **Recursion stack:** O(L)

## Key Optimizations

1. **Store word at end node** - No need to track path during DFS
2. **Set word = None after finding** - Prevents duplicates
3. **Prune empty branches** - Delete trie nodes with no children after search`
            },
            solutionExplanation: `## Solution Evolution: Naive → Trie-Optimized

### 🔴 Naive Approach (TLE)

\`\`\`python
def findWords_naive(board, words):
    result = []
    for word in words:  # For each word
        for i in range(rows):
            for j in range(cols):  # Try each starting cell
                if dfs_check_word(i, j, word, 0):
                    result.append(word)
                    break
    return result
\`\`\`

**Time:** O(W × M × N × 4^L) - For each word, search entire board!

---

### 🟢 Trie Optimization

**Key insight:** Instead of searching for each word separately, build a trie and search for ALL words simultaneously!

1. Build trie from all words
2. DFS from each cell ONCE
3. At each step, check if path exists in trie
4. If no prefix matches, prune immediately!

**Time:** O(M × N × 4^L) - Board traversal once, trie guides the search

---

### 🎯 Pattern Learned

**"Multi-Word Grid Search Pattern"** → When searching for multiple words in a grid:
1. Build a trie from all target words
2. DFS from each cell, using trie to validate paths
3. Prune branches that don't match any word prefix
4. Store complete words at trie end nodes for easy collection`,
            targetComplexity: {
                time: "O(M × N × 4^L)",
                space: "O(W × L)"
            },
            testCases: [
                {
                    input: 'Solution().findWords([["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], ["oath","pea","eat","rain"])',
                    expectedOutput: '["eat","oath"]'
                },
                {
                    input: 'Solution().findWords([["a","b"],["c","d"]], ["abcb"])',
                    expectedOutput: '[]'
                },
                {
                    input: 'Solution().findWords([["a"]], ["a"])',
                    expectedOutput: '["a"]'
                },
                {
                    input: 'Solution().findWords([["a","a"]], ["aaa"])',
                    expectedOutput: '[]'
                },
                {
                    input: 'Solution().findWords([["a","b"],["c","d"]], ["ab","cb","ad","bd","ac","ca","da","bc","db","adcb","dabc","abb","acb"])',
                    expectedOutput: '["ab","ac","bd","ca","db"]'
                }
            ],
            complexityQuizPlacement: 'after',
            requiredForProgress: true
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-search-suggestions',
            title: 'Code: Search Suggestions System',
            description: 'Build an autocomplete system using Trie',
            instruction: `<h2>Search Suggestions System</h2>
<p>You are given an array of strings <strong>products</strong> and a string <strong>searchWord</strong>.</p>
<p>Design a system that suggests at most three product names from products after each character of searchWord is typed. Suggested products should have common prefix with searchWord. If there are more than three products with a common prefix return the three <strong>lexicographically smallest</strong>.</p>
<p>Return a list of lists of the suggested products after each character of searchWord is typed.</p>

<h2>Example 1</h2>
<pre><code>products = ["mobile","mouse","moneypot","monitor","mousepad"]
searchWord = "mouse"

Output: [
  ["mobile","moneypot","monitor"],  # After typing "m"
  ["mobile","moneypot","monitor"],  # After typing "mo"
  ["mouse","mousepad"],             # After typing "mou"
  ["mouse","mousepad"],             # After typing "mous"
  ["mouse","mousepad"]              # After typing "mouse"
]</code></pre>

<h2>Example 2</h2>
<pre><code>products = ["havana"]
searchWord = "havana"

Output: [["havana"],["havana"],["havana"],["havana"],["havana"],["havana"]]</code></pre>

<h2>Example 3</h2>
<pre><code>products = ["bags","baggage","banner","box","cloths"]
searchWord = "bags"

Output: [
  ["baggage","bags","banner"],  # After "b"
  ["baggage","bags","banner"],  # After "ba"
  ["baggage","bags"],           # After "bag"
  ["bags"]                      # After "bags"
]</code></pre>

<h2>Constraints</h2>
<ul>
<li>1 <= products.length <= 1000</li>
<li>1 <= products[i].length <= 3000</li>
<li>1 <= searchWord.length <= 1000</li>
<li>All strings consist of lowercase English letters</li>
</ul>

<h2>Key Insight</h2>
<p><strong>Sort first, then build trie!</strong> This ensures suggestions are already in lexicographical order.</p>
<p>Store up to 3 suggestions at each trie node during insertion.</p>`,
            starterCode: `from typing import List

class TrieNode:
    def __init__(self):
        self.children = {}
        self.suggestions = []  # Store top 3 products at each node

class Solution:
    def suggestedProducts(self, products, searchWord):
        """
        Return top 3 lexicographically smallest products for each prefix of searchWord.
        """
        pass`,
            hints: [
                { afterAttempt: 1, text: 'Sort products first! This ensures lexicographical order when inserting.' },
                { afterAttempt: 2, text: 'At each trie node, store a list of suggestions (max 3). When inserting a word, add it to suggestions along the path if list has < 3 items.' },
                { afterAttempt: 3, text: 'For each character in searchWord, navigate the trie and collect suggestions at that node. If path doesn\'t exist, return empty list for remaining characters.' }
            ],
            solution: {
                afterAttempt: 3,
                text: `# Search Suggestions System - Trie with Pre-stored Suggestions

\`\`\`python
from typing import List

class TrieNode:
    def __init__(self):
        self.children = {}
        self.suggestions = []  # Top 3 products lexicographically

class Solution:
    def suggestedProducts(self, products, searchWord):
        # Step 1: Sort products for lexicographical order
        products.sort()

        # Step 2: Build Trie with suggestions at each node
        root = TrieNode()

        for product in products:
            node = root
            for char in product:
                if char not in node.children:
                    node.children[char] = TrieNode()
                node = node.children[char]
                # Store up to 3 suggestions (already sorted!)
                if len(node.suggestions) < 3:
                    node.suggestions.append(product)

        # Step 3: Get suggestions for each prefix
        result = []
        node = root

        for i, char in enumerate(searchWord):
            if node and char in node.children:
                node = node.children[char]
                result.append(node.suggestions)
            else:
                # No more matches - fill rest with empty lists
                node = None
                result.append([])

        return result
\`\`\`

## Alternative: Binary Search Approach

\`\`\`python
import bisect

def suggestedProducts_binary(products, searchWord):
    products.sort()
    result = []
    prefix = ""

    for char in searchWord:
        prefix += char
        # Find insertion point for prefix
        i = bisect.bisect_left(products, prefix)
        # Collect up to 3 matching products
        suggestions = []
        for j in range(i, min(i + 3, len(products))):
            if products[j].startswith(prefix):
                suggestions.append(products[j])
            else:
                break
        result.append(suggestions)

    return result
\`\`\`

## Complexity Analysis

**Trie Approach:**
- Time: O(n log n + n×m + k×m)
- Space: O(n×m)

**Binary Search Approach:**
- Time: O(n log n + k × (log n + m))
- Space: O(1) extra`
            },
            solutionExplanation: `## Solution Evolution: Brute Force → Optimal

### 🔴 Brute Force

\`\`\`python
def suggestedProducts(products, searchWord):
    products.sort()
    result = []
    prefix = ""

    for char in searchWord:
        prefix += char
        # Scan ALL products for each prefix
        suggestions = [p for p in products if p.startswith(prefix)][:3]
        result.append(suggestions)

    return result
\`\`\`

**Time:** O(n log n + k × n × m) - Scanning all products for each character!

---

### 🟢 Trie Optimization

**Key insight:** Pre-compute suggestions during trie construction!

1. Sort products first (ensures lexicographical order)
2. Build trie, storing first 3 products at each node
3. For each prefix, just navigate trie and return stored suggestions

**Time:** O(n log n + n×m + k) - No repeated scanning!

---

### 🎯 Pattern Learned

**"Autocomplete Pattern"** → For autocomplete with top-k suggestions:
1. Sort inputs for lexicographical order
2. Build trie with top-k stored at each node during insertion
3. Query is just O(prefix length) traversal`,
            targetComplexity: {
                time: "O(n log n + n×m + k)",
                space: "O(n×m)"
            },
            testCases: [
                {
                    input: 'Solution().suggestedProducts(["mobile","mouse","moneypot","monitor","mousepad"], "mouse")',
                    expectedOutput: '[["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],["mouse","mousepad"],["mouse","mousepad"],["mouse","mousepad"]]'
                },
                {
                    input: 'Solution().suggestedProducts(["havana"], "havana")',
                    expectedOutput: '[["havana"],["havana"],["havana"],["havana"],["havana"],["havana"]]'
                },
                {
                    input: 'Solution().suggestedProducts(["bags","baggage","banner","box","cloths"], "bags")',
                    expectedOutput: '[["baggage","bags","banner"],["baggage","bags","banner"],["baggage","bags"],["bags"]]'
                },
                {
                    input: 'Solution().suggestedProducts(["havana"], "tatiana")',
                    expectedOutput: '[[],[],[],[],[],[],[]]'
                },
                {
                    input: 'Solution().suggestedProducts(["apple","apricot","application"], "app")',
                    expectedOutput: '[["apple","application","apricot"],["apple","application","apricot"],["apple","application"]]'
                }
            ],
            complexityQuizPlacement: 'after',
            requiredForProgress: true
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-magic-dictionary',
            title: 'Code: Magic Dictionary',
            description: 'Design a data structure that can determine if a word matches by changing exactly one character',
            instruction: `<h2>Implement Magic Dictionary (LC 676)</h2>
<p>Design a data structure that is initialized with a list of different words. It should be able to determine if a given word can be found by changing <strong>exactly one character</strong> to match a word in the dictionary.</p>

<h2>Example</h2>
<pre><code>MagicDictionary magicDict = new MagicDictionary();
magicDict.buildDict(["hello", "leetcode"]);

magicDict.search("hello")   → false  // Can't change 0 chars
magicDict.search("hhllo")   → true   // Change 'h' to 'e' → "hello"
magicDict.search("hell")    → false  // Different length
magicDict.search("leetcoded") → false  // Different length</code></pre>

<h2>Key Insight</h2>
<p>Use a Trie! For search, try replacing each character with all 26 letters and check if the resulting word exists.</p>
<p>Alternative: Store patterns like "h*llo", "*ello", "he*lo", "hel*o", "hell*" for "hello".</p>`,
            starterCode: `class MagicDictionary:
    def __init__(self):
        # Initialize your Trie or other data structure
        pass

    def buildDict(self, dictionary):
        """
        Build the dictionary from list of words
        """
        pass

    def search(self, searchWord):
        """
        Return True if searchWord can match by changing exactly one character
        """
        pass`,
            hints: [
                { afterAttempt: 1, text: 'Build a Trie from all dictionary words.' },
                { afterAttempt: 2, text: 'For search: at each position, try all 26 letters (one must differ).' },
                { afterAttempt: 3, text: 'Track whether you\'ve made exactly one change. Use DFS with a "changed" flag.' }
            ],
            solution: {
                afterAttempt: 3,
                text: `# Magic Dictionary - Trie with Wildcard Search

\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

class MagicDictionary:
    def __init__(self):
        self.root = TrieNode()

    def buildDict(self, dictionary):
        for word in dictionary:
            node = self.root
            for char in word:
                if char not in node.children:
                    node.children[char] = TrieNode()
                node = node.children[char]
            node.is_word = True

    def search(self, searchWord):
        def dfs(node, index, changed):
            # Base case: reached end of word
            if index == len(searchWord):
                return node.is_word and changed
            
            char = searchWord[index]
            
            for c in node.children:
                if c == char:
                    # Same character - continue without change
                    if dfs(node.children[c], index + 1, changed):
                        return True
                elif not changed:
                    # Different character - use our one allowed change
                    if dfs(node.children[c], index + 1, True):
                        return True
            
            return False
        
        return dfs(self.root, 0, False)
\`\`\`

## Key Insight
- DFS through Trie with a "changed" flag
- Must change exactly one character (not zero, not more than one)
- Try all 26 letters at each position, tracking if we've used our change`
            },
            targetComplexity: {
                time: "O(n × m) build, O(26 × m) search",
                space: "O(n × m)"
            },
            testCases: [
                {
                    input: 'md = MagicDictionary(); md.buildDict(["hello","leetcode"]); md.search("hello")',
                    expectedOutput: 'False'
                },
                {
                    input: 'md.search("hhllo")',
                    expectedOutput: 'True'
                },
                {
                    input: 'md.search("hell")',
                    expectedOutput: 'False'
                },
                {
                    input: 'md.search("leetcoded")',
                    expectedOutput: 'False'
                }
            ],
            complexityQuizPlacement: 'after',
            requiredForProgress: false
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-longest-word-dictionary',
            title: 'Code: Longest Word in Dictionary',
            description: 'Find the longest word that can be built one character at a time',
            instruction: `<h2>Longest Word in Dictionary (LC 720)</h2>
<p>Given an array of strings <strong>words</strong>, return the longest word that can be built one character at a time by other words in the array.</p>
<p>If there are multiple answers, return the one that is <strong>lexicographically smallest</strong>.</p>

<h2>Example 1</h2>
<pre><code>Input: words = ["w","wo","wor","worl","world"]
Output: "world"
Explanation: "world" can be built: w → wo → wor → worl → world</code></pre>

<h2>Example 2</h2>
<pre><code>Input: words = ["a","banana","app","appl","ap","apply","apple"]
Output: "apple"
Explanation: Both "apply" and "apple" can be built.
"apple" is lexicographically smaller.</code></pre>

<h2>Key Insight</h2>
<p>Build a Trie, then DFS to find the longest path where <strong>every prefix is a complete word</strong>.</p>`,
            starterCode: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

def longestWord(words):
    """
    Return the longest word buildable one character at a time.
    If tie, return lexicographically smallest.
    """
    pass`,
            hints: [
                { afterAttempt: 1, text: 'Build a Trie from all words, marking is_word for complete words.' },
                { afterAttempt: 2, text: 'DFS through Trie, but only follow paths where EVERY node along the way is a complete word.' },
                { afterAttempt: 3, text: 'Track the longest word found. For ties, compare lexicographically.' }
            ],
            solution: {
                afterAttempt: 3,
                text: `# Longest Word in Dictionary - Trie + DFS

\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

def longestWord(words):
    # Build Trie
    root = TrieNode()
    for word in words:
        node = root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_word = True
    
    # DFS - only follow paths where every node is a complete word
    result = ""
    
    def dfs(node, path):
        nonlocal result
        
        # Update result if current path is longer (or lex smaller for ties)
        if len(path) > len(result) or (len(path) == len(result) and path < result):
            result = path
        
        # Try all children in alphabetical order
        for char in sorted(node.children.keys()):
            child = node.children[char]
            # Only continue if child is a complete word
            if child.is_word:
                dfs(child, path + char)
    
    dfs(root, "")
    return result
\`\`\`

## Key Insight
- Every prefix must be a complete word (is_word = True)
- DFS only follows valid paths
- Process children alphabetically for lexicographic ordering`
            },
            targetComplexity: {
                time: "O(n × m)",
                space: "O(n × m)"
            },
            testCases: [
                {
                    input: 'longestWord(["w","wo","wor","worl","world"])',
                    expectedOutput: '"world"'
                },
                {
                    input: 'longestWord(["a","banana","app","appl","ap","apply","apple"])',
                    expectedOutput: '"apple"'
                },
                {
                    input: 'longestWord(["a","b","c"])',
                    expectedOutput: '"a"'
                }
            ],
            complexityQuizPlacement: 'after',
            requiredForProgress: false
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-longest-word-sequence',
            title: 'Code: Longest Word Sequence',
            description: 'Find the longest sequence where each word adds one letter to the end',
            instruction: `<h2>Longest Word Sequence</h2>
<p>Given a list of unique words, find the length of the longest sequence of words where:</p>
<ul>
<li>The first word can be any word in the list</li>
<li>Each subsequent word is formed by <strong>adding one letter at the end</strong> of the previous word</li>
</ul>

<h2>Example 1</h2>
<pre><code>Input: ["a","peck","peppers","pet","pete","picked","of","pickled","pepper","peter"]
Output: 3
Explanation: pet → pete → peter</code></pre>

<h2>Example 2</h2>
<pre><code>Input: ["a","aaa","aa","aaaaa","aaab"]
Output: 4
Explanation: a → aa → aaa → aaab</code></pre>

<h2>Key Insight</h2>
<p>Build a Trie, then DFS to find the longest path where each node represents a complete word.</p>`,
            starterCode: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

def longestWordSequence(words):
    """
    Find length of longest sequence where each word 
    is formed by adding one letter to end of previous.
    """
    pass`,
            hints: [
                { afterAttempt: 1, text: 'Build a Trie from all words.' },
                { afterAttempt: 2, text: 'DFS through Trie, counting depth. Only continue if child.is_word is True.' },
                { afterAttempt: 3, text: 'The sequence length is the maximum depth where all nodes along the path are complete words.' }
            ],
            solution: {
                afterAttempt: 3,
                text: `# Longest Word Sequence - Trie + DFS

\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

def longestWordSequence(words):
    # Build Trie
    root = TrieNode()
    for word in words:
        node = root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_word = True
    
    # DFS - only follow paths where each node is a complete word
    def dfs(node, depth):
        max_depth = depth
        
        for char, child in node.children.items():
            if child.is_word:
                max_depth = max(max_depth, dfs(child, depth + 1))
        
        return max_depth
    
    # Start from root's children that are complete words
    result = 0
    for char, child in root.children.items():
        if child.is_word:
            result = max(result, dfs(child, 1))
    
    return result
\`\`\`

## Key Insight
- Build Trie from all words
- DFS only following paths where every node is a complete word
- Track maximum depth reached`
            },
            targetComplexity: {
                time: "O(n × m)",
                space: "O(n × m)"
            },
            testCases: [
                {
                    input: 'longestWordSequence(["a","peck","peppers","pet","pete","picked","of","pickled","pepper","peter"])',
                    expectedOutput: '3'
                },
                {
                    input: 'longestWordSequence(["a","aaa","aa","aaaaa","aaab"])',
                    expectedOutput: '4'
                },
                {
                    input: 'longestWordSequence(["w","wo","wor","worl","world"])',
                    expectedOutput: '5'
                }
            ],
            complexityQuizPlacement: 'after',
            requiredForProgress: false
        },
  {
            type: 'exercise',
            placement: 'module',
            id: 'exercise-palindrome-pairs',
            title: 'Code: Palindrome Pairs',
            description: 'Find all index pairs where concatenation forms a palindrome',
            instruction: `<h2>Palindrome Pairs (LC 336)</h2>
<p>Given a list of <strong>unique</strong> words, return all pairs of distinct indices <code>(i, j)</code> such that the concatenation of <code>words[i] + words[j]</code> is a palindrome.</p>

<h2>Example 1</h2>
<pre><code>Input: words = ["abcd","dcba","lls","s","sssll"]
Output: [[0,1],[1,0],[3,2],[2,4]]
Explanations:
- "abcd" + "dcba" = "abcddcba" ✓
- "dcba" + "abcd" = "dcbaabcd" ✓
- "s" + "lls" = "slls" ✓
- "lls" + "sssll" = "llssssll" ✓</code></pre>

<h2>Example 2</h2>
<pre><code>Input: words = ["bat","tab","cat"]
Output: [[0,1],[1,0]]
- "bat" + "tab" = "battab" ✓
- "tab" + "bat" = "tabbat" ✓</code></pre>

<h2>Key Insight</h2>
<p>For word1 + word2 to be palindrome:</p>
<ul>
<li>If word1's prefix is palindrome, check if reversed(word1's suffix) exists</li>
<li>If word1's suffix is palindrome, check if reversed(word1's prefix) exists</li>
</ul>`,
            starterCode: `def palindromePairs(words):
    """
    Return all index pairs (i, j) where words[i] + words[j] is a palindrome.
    """
    pass`,
            hints: [
                { afterAttempt: 1, text: 'Map each word to its index for O(1) lookup.' },
                { afterAttempt: 2, text: 'For each word, try all prefix/suffix splits.' },
                { afterAttempt: 3, text: 'If prefix is palindrome → check if reversed(suffix) exists. If suffix is palindrome → check if reversed(prefix) exists.' }
            ],
            solution: {
                afterAttempt: 3,
                text: `# Palindrome Pairs - Hash Map with Prefix/Suffix Analysis

\`\`\`python
def palindromePairs(words):
    def is_palindrome(s):
        return s == s[::-1]
    
    # Map each word to its index
    word_to_idx = {word: i for i, word in enumerate(words)}
    result = []
    
    for i, word in enumerate(words):
        n = len(word)
        
        for j in range(n + 1):
            # Split word into prefix and suffix
            prefix = word[:j]
            suffix = word[j:]
            
            # Case 1: If prefix is palindrome
            # Check if reversed(suffix) + word is palindrome
            if is_palindrome(prefix):
                rev_suffix = suffix[::-1]
                if rev_suffix in word_to_idx and word_to_idx[rev_suffix] != i:
                    result.append([word_to_idx[rev_suffix], i])
            
            # Case 2: If suffix is palindrome
            # Check if word + reversed(prefix) is palindrome
            # Only when j < n to avoid duplicates
            if j < n and is_palindrome(suffix):
                rev_prefix = prefix[::-1]
                if rev_prefix in word_to_idx and word_to_idx[rev_prefix] != i:
                    result.append([i, word_to_idx[rev_prefix]])
    
    return result
\`\`\`

## Key Insight
- For each word, try all possible prefix/suffix splits
- If prefix is palindrome, reversed suffix could complete it
- If suffix is palindrome, reversed prefix could complete it`
            },
            targetComplexity: {
                time: "O(n × k²)",
                space: "O(n × k)"
            },
            testCases: [
                {
                    input: 'palindromePairs(["abcd","dcba","lls","s","sssll"])',
                    expectedOutput: '[[0,1],[1,0],[3,2],[2,4]]'
                },
                {
                    input: 'palindromePairs(["bat","tab","cat"])',
                    expectedOutput: '[[0,1],[1,0]]'
                },
                {
                    input: 'palindromePairs(["a",""])',
                    expectedOutput: '[[0,1],[1,0]]'
                }
            ],
            complexityQuizPlacement: 'after',
            requiredForProgress: false
        },

  // ==================== NEW EXERCISES: GROUP 1-2 Core + Search ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-prefix-dictionary',
    title: 'Prefix Dictionary',
    description: 'Answer prefix existence queries efficiently',
    targetComplexity: { time: 'O(L) per query', space: 'O(total chars)' },
    instruction: `# Prefix Dictionary

Given a list of words, build a data structure that can answer queries asking whether a given prefix exists in any word.

## Examples

**Example 1:**
\`\`\`
Input: words = ["apple", "app", "application", "banana"]
Query: "app" → true (prefix of "apple", exact match of "app")
Query: "appl" → true (prefix of "apple", "application")
Query: "ban" → true (prefix of "banana")
Query: "cat" → false
\`\`\`

**Example 2:**
\`\`\`
Input: words = ["hello", "help", "helicopter"]
Query: "hel" → true
Query: "hell" → true
Query: "helicopter" → true
Query: "helicopterx" → false
\`\`\`

## Constraints
- 1 <= words.length <= 10^4
- 1 <= words[i].length <= 100
- All words are lowercase English letters`,
    starterCode: `class PrefixDictionary:
    def __init__(self, words):
        # Build your data structure
        pass

    def hasPrefix(self, prefix):
        # Return True if prefix exists in any word
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use a Trie. Insert all words, then check if prefix path exists.' },
      { afterAttempt: 2, text: 'For hasPrefix, just verify each character has a child node. No need to check is_end.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Trie-based Prefix Dictionary

\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}

class PrefixDictionary:
    def __init__(self, words):
        self.root = TrieNode()
        for word in words:
            self._insert(word)

    def _insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]

    def hasPrefix(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True
\`\`\`

## Key Insight
- Insert all words into trie
- For prefix check, just follow the path
- If path exists, prefix exists (don't need to reach word end)`
    },
    testCases: [
      { input: 'dict = PrefixDictionary(["apple","app","banana"]); dict.hasPrefix("app")', expected: 'True' },
      { input: 'dict = PrefixDictionary(["apple","app","banana"]); dict.hasPrefix("cat")', expected: 'False' },
      { input: 'dict = PrefixDictionary(["hello"]); dict.hasPrefix("helicopter")', expected: 'False' }
    ],
    solutionExplanation: 'Build trie from words, check if prefix path exists.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-count-words-with-prefix',
    title: 'Count Words With Prefix',
    description: 'Count how many inserted words start with a given prefix',
    targetComplexity: { time: 'O(L)', space: 'O(total chars)' },
    instruction: `# Count Words With Prefix

Design a data structure that supports:
- \`insert(word)\`: Add a word to the dictionary
- \`countWordsWithPrefix(prefix)\`: Return how many words start with the given prefix

## Examples

\`\`\`
trie = CountTrie()
trie.insert("apple")
trie.insert("app")
trie.insert("application")
trie.insert("banana")

trie.countWordsWithPrefix("app")  → 3  (apple, app, application)
trie.countWordsWithPrefix("appl") → 2  (apple, application)
trie.countWordsWithPrefix("b")    → 1  (banana)
trie.countWordsWithPrefix("cat")  → 0
\`\`\`

## Constraints
- 1 <= word.length, prefix.length <= 100
- All strings are lowercase English letters`,
    starterCode: `class CountTrie:
    def __init__(self):
        pass

    def insert(self, word):
        pass

    def countWordsWithPrefix(self, prefix):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Store a count at each node representing how many words pass through it.' },
      { afterAttempt: 2, text: 'During insert, increment count at each node along the path.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Trie with Prefix Count

\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.prefix_count = 0  # Words passing through this node

class CountTrie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
            node.prefix_count += 1  # Increment for each word

    def countWordsWithPrefix(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return 0
            node = node.children[char]
        return node.prefix_count
\`\`\`

## Key Insight
- Each node tracks how many words pass through it
- Query just returns the count at the prefix endpoint`
    },
    testCases: [
      { input: 't = CountTrie(); t.insert("apple"); t.insert("app"); t.countWordsWithPrefix("app")', expected: '2' },
      { input: 't = CountTrie(); t.insert("a"); t.insert("ab"); t.insert("abc"); t.countWordsWithPrefix("a")', expected: '3' },
      { input: 't = CountTrie(); t.insert("test"); t.countWordsWithPrefix("x")', expected: '0' }
    ],
    solutionExplanation: 'Store prefix_count at each node, increment during insert.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-replace-words',
    title: 'Replace Words Using Roots',
    description: 'Replace words in sentence with shortest matching root',
    targetComplexity: { time: 'O(n × L)', space: 'O(dict size)' },
    instruction: `# Replace Words Using Roots

Given a dictionary of roots and a sentence, replace each word with its shortest matching root.

If a word has multiple matching roots, use the shortest one.
If no root matches, keep the original word.

## Examples

**Example 1:**
\`\`\`
Input: dictionary = ["cat","bat","rat"]
       sentence = "the cattle was rattled by the battery"
Output: "the cat was rat by the bat"
Explanation:
- "cattle" → "cat" (root)
- "rattled" → "rat" (root)
- "battery" → "bat" (root)
\`\`\`

**Example 2:**
\`\`\`
Input: dictionary = ["a","b","c"]
       sentence = "aadsfasf absbs bbab cadsfabd"
Output: "a]" a b c"
\`\`\`

## Constraints
- 1 <= dictionary.length <= 1000
- 1 <= dictionary[i].length <= 100
- 1 <= sentence.length <= 10^6`,
    starterCode: `def replaceWords(dictionary, sentence):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Build a Trie from dictionary roots. For each word, find shortest prefix that exists.' },
      { afterAttempt: 2, text: 'While traversing the trie for a word, return as soon as you hit is_end=True.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Trie for Root Lookup

\`\`\`python
def replaceWords(dictionary, sentence):
    class TrieNode:
        def __init__(self):
            self.children = {}
            self.is_end = False

    # Build trie from roots
    root = TrieNode()
    for word in dictionary:
        node = root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True

    def findRoot(word):
        node = root
        for i, char in enumerate(word):
            if char not in node.children:
                return word  # No root found
            node = node.children[char]
            if node.is_end:
                return word[:i+1]  # Return shortest root
        return word

    words = sentence.split()
    return ' '.join(findRoot(w) for w in words)
\`\`\`

## Key Insight
- Build trie from dictionary
- For each word, traverse trie until hitting is_end or running out
- Return shortest matching prefix (first is_end encountered)`
    },
    testCases: [
      { input: 'replaceWords(["cat","bat","rat"], "the cattle was rattled by the battery")', expected: '"the cat was rat by the bat"' },
      { input: 'replaceWords(["a","b","c"], "aadsfasf absbs bbab cadsfabd")', expected: '"a a b c"' },
      { input: 'replaceWords(["catt"], "cattle")', expected: '"cattle"' }
    ],
    solutionExplanation: 'Build trie from roots, find shortest matching prefix for each word.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-stream-checker',
    title: 'Stream Checker',
    description: 'Check if any suffix forms a word as characters stream in',
    targetComplexity: { time: 'O(L) per query', space: 'O(total chars)' },
    instruction: `# Stream Checker

Implement a StreamChecker class that:
- Initializes with a list of words
- Has a \`query(letter)\` method that returns true if any suffix of the queried letters so far forms a word

## Examples

\`\`\`
streamChecker = StreamChecker(["cd", "f", "kl"])

streamChecker.query('a')  → false
streamChecker.query('b')  → false
streamChecker.query('c')  → false
streamChecker.query('d')  → true  ("cd" is a word)
streamChecker.query('e')  → false
streamChecker.query('f')  → true  ("f" is a word)
streamChecker.query('g')  → false
streamChecker.query('h')  → false
streamChecker.query('i')  → false
streamChecker.query('j')  → false
streamChecker.query('k')  → false
streamChecker.query('l')  → true  ("kl" is a word)
\`\`\`

## Constraints
- 1 <= words.length <= 2000
- 1 <= words[i].length <= 2000
- Up to 4 × 10^4 queries`,
    starterCode: `class StreamChecker:
    def __init__(self, words):
        pass

    def query(self, letter):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Build a reverse trie (insert words backwards). Keep track of recent letters.' },
      { afterAttempt: 2, text: 'On each query, check if reversed recent letters form a word in the reverse trie.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Reverse Trie

\`\`\`python
class StreamChecker:
    def __init__(self, words):
        self.trie = {}
        self.stream = []
        self.max_len = 0

        for word in words:
            node = self.trie
            self.max_len = max(self.max_len, len(word))
            for char in reversed(word):
                if char not in node:
                    node[char] = {}
                node = node[char]
            node['$'] = True  # End marker

    def query(self, letter):
        self.stream.append(letter)

        node = self.trie
        # Check reversed stream
        for i in range(len(self.stream) - 1, max(-1, len(self.stream) - self.max_len - 1), -1):
            char = self.stream[i]
            if char not in node:
                return False
            node = node[char]
            if '$' in node:
                return True

        return False
\`\`\`

## Key Insight
- Checking suffixes = checking prefixes of reversed string
- Build trie with reversed words
- On query, traverse trie with reversed recent stream
- Stop early if we find a word (is_end)`
    },
    testCases: [
      { input: 'sc = StreamChecker(["cd","f"]); [sc.query(c) for c in "abcdef"]', expected: '[False, False, False, True, False, True]' },
      { input: 'sc = StreamChecker(["ab"]); sc.query("a"); sc.query("b")', expected: 'True' },
      { input: 'sc = StreamChecker(["xyz"]); sc.query("x")', expected: 'False' }
    ],
    solutionExplanation: 'Build reverse trie, check reversed stream for word matches on each query.'
  },

  // ==================== GROUP 3: Frequency / Counting ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-count-distinct-substrings',
    title: 'Count Distinct Substrings',
    description: 'Count number of distinct substrings using Trie',
    targetComplexity: { time: 'O(n²)', space: 'O(n²)' },
    instruction: `# Count Distinct Substrings

Given a string s, return the number of distinct substrings.

## Examples

**Example 1:**
\`\`\`
Input: s = "abc"
Output: 7
Substrings: "", "a", "b", "c", "ab", "bc", "abc"
(Including empty string, or 6 without it)
\`\`\`

**Example 2:**
\`\`\`
Input: s = "aaa"
Output: 4
Substrings: "", "a", "aa", "aaa"
(Many duplicates collapsed)
\`\`\`

## Note
Count empty string as one substring, or return n*(n+1)/2 + 1 for distinct count.

## Constraints
- 1 <= s.length <= 1000`,
    starterCode: `def countDistinctSubstrings(s):
    # Return count of distinct substrings (including empty)
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Insert all suffixes into a Trie. Each unique node represents a unique substring.' },
      { afterAttempt: 2, text: 'Count total nodes in trie + 1 (for empty string).' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Suffix Trie

\`\`\`python
def countDistinctSubstrings(s):
    class TrieNode:
        def __init__(self):
            self.children = {}

    root = TrieNode()
    count = 0

    # Insert all suffixes
    for i in range(len(s)):
        node = root
        for j in range(i, len(s)):
            char = s[j]
            if char not in node.children:
                node.children[char] = TrieNode()
                count += 1  # New unique substring
            node = node.children[char]

    return count + 1  # +1 for empty string
\`\`\`

## Key Insight
- Each path from root represents a unique substring
- Insert all suffixes: s[0:], s[1:], s[2:], ...
- Each new node created = new unique substring
- Total nodes + 1 (empty) = distinct substrings`
    },
    testCases: [
      { input: 'countDistinctSubstrings("abc")', expected: '7' },
      { input: 'countDistinctSubstrings("aaa")', expected: '4' },
      { input: 'countDistinctSubstrings("ab")', expected: '4' }
    ],
    solutionExplanation: 'Build suffix trie, count unique nodes for distinct substrings.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-maximum-xor-two-numbers',
    title: 'Maximum XOR of Two Numbers',
    description: 'Find maximum XOR of any two numbers in array',
    targetComplexity: { time: 'O(n × 32)', space: 'O(n × 32)' },
    instruction: `# Maximum XOR of Two Numbers

Given an integer array \`nums\`, return the maximum XOR of any two numbers.

## Examples

**Example 1:**
\`\`\`
Input: nums = [3,10,5,25,2,8]
Output: 28
Explanation: 5 XOR 25 = 28
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [14,70,53,83,49,91,36,80,92,51,66,70]
Output: 127
\`\`\`

## Constraints
- 1 <= nums.length <= 2 × 10^5
- 0 <= nums[i] <= 2^31 - 1`,
    starterCode: `def findMaximumXOR(nums):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use a binary trie. Insert each number bit by bit (MSB first).' },
      { afterAttempt: 2, text: 'For each number, traverse trie trying to take opposite bit at each level to maximize XOR.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Binary Trie

\`\`\`python
def findMaximumXOR(nums):
    # Build trie with binary representations
    root = {}

    # Insert all numbers
    for num in nums:
        node = root
        for i in range(31, -1, -1):  # 32 bits
            bit = (num >> i) & 1
            if bit not in node:
                node[bit] = {}
            node = node[bit]

    max_xor = 0

    # Find max XOR for each number
    for num in nums:
        node = root
        curr_xor = 0
        for i in range(31, -1, -1):
            bit = (num >> i) & 1
            # Try to take opposite bit
            if (1 - bit) in node:
                curr_xor |= (1 << i)
                node = node[1 - bit]
            else:
                node = node[bit]
        max_xor = max(max_xor, curr_xor)

    return max_xor
\`\`\`

## Key Insight
- XOR is maximized by having different bits at high positions
- For each number, greedily choose opposite bit at each level
- Binary trie stores all numbers by their bit representation`
    },
    testCases: [
      { input: 'findMaximumXOR([3,10,5,25,2,8])', expected: '28' },
      { input: 'findMaximumXOR([0])', expected: '0' },
      { input: 'findMaximumXOR([1,2])', expected: '3' }
    ],
    solutionExplanation: 'Build binary trie, for each number greedily select opposite bits to maximize XOR.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-prefix-score-strings',
    title: 'Sum of Prefix Scores of Strings',
    description: 'Calculate prefix score sum for each word',
    targetComplexity: { time: 'O(n × L)', space: 'O(n × L)' },
    instruction: `# Sum of Prefix Scores of Strings

You are given an array of words. The prefix score of a string is the number of strings in the array that have this string as a prefix.

For each word, return the sum of prefix scores of all its prefixes.

## Examples

**Example 1:**
\`\`\`
Input: words = ["abc","ab","bc","b"]
Output: [5,4,3,2]
Explanation:
- "abc": prefixes are "a","ab","abc"
  - "a" is prefix of "abc","ab" → 2
  - "ab" is prefix of "abc","ab" → 2
  - "abc" is prefix of "abc" → 1
  - Total: 5
- "ab": "a"→2, "ab"→2 = 4
- "bc": "b"→2, "bc"→1 = 3
- "b": "b"→2 = 2
\`\`\`

## Constraints
- 1 <= words.length <= 1000
- 1 <= words[i].length <= 1000`,
    starterCode: `def sumPrefixScores(words):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Build a trie with prefix counts (increment count at each node during insert).' },
      { afterAttempt: 2, text: 'For each word, traverse trie and sum up the counts at each node.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Trie with Prefix Counts

\`\`\`python
def sumPrefixScores(words):
    class TrieNode:
        def __init__(self):
            self.children = {}
            self.count = 0

    root = TrieNode()

    # Insert all words, track prefix counts
    for word in words:
        node = root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
            node.count += 1

    # Calculate score for each word
    result = []
    for word in words:
        node = root
        score = 0
        for char in word:
            node = node.children[char]
            score += node.count
        result.append(score)

    return result
\`\`\`

## Key Insight
- Each node's count = number of words with this prefix
- Insert all words, incrementing count at each node
- For each word, sum counts along its path`
    },
    testCases: [
      { input: 'sumPrefixScores(["abc","ab","bc","b"])', expected: '[5,4,3,2]' },
      { input: 'sumPrefixScores(["a","a","a"])', expected: '[3,3,3]' },
      { input: 'sumPrefixScores(["abcd"])', expected: '[4]' }
    ],
    solutionExplanation: 'Build trie with counts, sum counts along path for each word.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-autocomplete-ranking',
    title: 'Auto-Complete Ranking',
    description: 'Return top-k most frequent words for a prefix',
    targetComplexity: { time: 'O(L + k log k)', space: 'O(n × L)' },
    instruction: `# Auto-Complete Ranking

Design a system that:
- Inserts words with their frequencies
- Returns top-k most frequent words starting with a given prefix

## Examples

\`\`\`
ac = AutoComplete()
ac.insert("apple", 5)
ac.insert("app", 10)
ac.insert("application", 3)
ac.insert("banana", 8)

ac.topK("app", 2)  → ["app", "apple"]  (freq 10, 5)
ac.topK("a", 3)    → ["app", "banana", "apple"]  (10, 8, 5)... wait, banana doesn't start with 'a'
ac.topK("a", 3)    → ["app", "apple", "application"]
\`\`\`

## Constraints
- 1 <= word.length <= 100
- 1 <= frequency <= 10^6
- 1 <= k <= 10`,
    starterCode: `class AutoComplete:
    def __init__(self):
        pass

    def insert(self, word, frequency):
        pass

    def topK(self, prefix, k):
        # Return top k words by frequency with given prefix
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Store frequency at word end nodes. Use DFS from prefix node to collect all words.' },
      { afterAttempt: 2, text: 'Collect all (word, freq) pairs from prefix subtree, sort by frequency, return top k.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Trie + DFS Collection

\`\`\`python
class AutoComplete:
    def __init__(self):
        self.root = {}

    def insert(self, word, frequency):
        node = self.root
        for char in word:
            if char not in node:
                node[char] = {}
            node = node[char]
        node['$'] = (word, frequency)

    def topK(self, prefix, k):
        # Navigate to prefix node
        node = self.root
        for char in prefix:
            if char not in node:
                return []
            node = node[char]

        # DFS to collect all words in subtree
        words = []
        def dfs(n):
            if '$' in n:
                words.append(n['$'])
            for c in n:
                if c != '$':
                    dfs(n[c])

        dfs(node)

        # Sort by frequency descending, return top k
        words.sort(key=lambda x: -x[1])
        return [w[0] for w in words[:k]]
\`\`\`

## Key Insight
- Navigate to prefix endpoint
- DFS to collect all words in subtree
- Sort by frequency and return top k`
    },
    testCases: [
      { input: 'ac = AutoComplete(); ac.insert("app",10); ac.insert("apple",5); ac.topK("app",2)', expected: '["app","apple"]' },
      { input: 'ac = AutoComplete(); ac.insert("a",1); ac.topK("b",1)', expected: '[]' },
      { input: 'ac = AutoComplete(); ac.insert("test",5); ac.topK("test",1)', expected: '["test"]' }
    ],
    solutionExplanation: 'Navigate to prefix, DFS to collect words, sort by frequency.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-most-frequent-prefix',
    title: 'Most Frequent Word With Prefix',
    description: 'Return the most frequent word matching a prefix',
    targetComplexity: { time: 'O(L + subtree)', space: 'O(n × L)' },
    instruction: `# Most Frequent Word With Prefix

Design a data structure that:
- Inserts words with frequencies (can be updated)
- Returns the most frequent word with a given prefix
- If tie, return lexicographically smallest

## Examples

\`\`\`
mf = MostFrequent()
mf.insert("apple", 5)
mf.insert("app", 10)
mf.insert("application", 10)

mf.query("app")  → "app" (freq 10, but "app" < "application")
mf.insert("app", 5)  # Now app has freq 15
mf.query("app")  → "app" (freq 15)
\`\`\`

## Constraints
- 1 <= word.length <= 100
- 1 <= frequency <= 10^6`,
    starterCode: `class MostFrequent:
    def __init__(self):
        pass

    def insert(self, word, frequency):
        # Add or update word frequency
        pass

    def query(self, prefix):
        # Return most frequent word with prefix
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Store word frequencies. At each node, optionally cache the best word for that prefix.' },
      { afterAttempt: 2, text: 'For simplicity, DFS from prefix node to find all words, return max frequency (min lex for ties).' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Trie + DFS

\`\`\`python
class MostFrequent:
    def __init__(self):
        self.root = {}
        self.freq = {}  # word -> frequency

    def insert(self, word, frequency):
        # Update frequency
        self.freq[word] = self.freq.get(word, 0) + frequency

        # Insert into trie
        node = self.root
        for char in word:
            if char not in node:
                node[char] = {}
            node = node[char]
        node['$'] = word

    def query(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node:
                return ""
            node = node[char]

        # DFS to find all words
        best = ("", 0)  # (word, freq)

        def dfs(n):
            nonlocal best
            if '$' in n:
                w = n['$']
                f = self.freq[w]
                if f > best[1] or (f == best[1] and w < best[0]):
                    best = (w, f)
            for c in n:
                if c != '$':
                    dfs(n[c])

        dfs(node)
        return best[0]
\`\`\`

## Key Insight
- Store frequencies separately for easy updates
- DFS from prefix to find all matching words
- Track best: highest freq, lexicographically smallest for ties`
    },
    testCases: [
      { input: 'mf = MostFrequent(); mf.insert("app",10); mf.insert("apple",5); mf.query("app")', expected: '"app"' },
      { input: 'mf = MostFrequent(); mf.insert("a",5); mf.insert("ab",5); mf.query("a")', expected: '"a"' },
      { input: 'mf = MostFrequent(); mf.query("x")', expected: '""' }
    ],
    solutionExplanation: 'Store frequencies, DFS from prefix to find best match.'
  },

  // ==================== GROUP 4: Bitwise Trie ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-maximum-xor-query',
    title: 'Maximum XOR With Limit',
    description: 'Find max XOR with x where y <= limit',
    targetComplexity: { time: 'O(n log n + q × 32)', space: 'O(n × 32)' },
    instruction: `# Maximum XOR Query

Given an array \`nums\` and queries \`[x, limit]\`, for each query find the maximum \`x XOR y\` where \`y\` is in \`nums\` and \`y <= limit\`.

Return -1 if no valid y exists.

## Examples

\`\`\`
Input: nums = [0,1,2,3,4], queries = [[3,1],[1,3],[5,6]]
Output: [3,3,7]
Explanation:
- [3,1]: max XOR with y<=1 → 3 XOR 0 = 3
- [1,3]: max XOR with y<=3 → 1 XOR 2 = 3
- [5,6]: max XOR with y<=6 → 5 XOR 2 = 7
\`\`\`

## Constraints
- 1 <= nums.length, queries.length <= 10^5
- 0 <= nums[i], queries[i][0], queries[i][1] <= 10^9`,
    starterCode: `def maximizeXor(nums, queries):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Sort nums and queries by limit. Process queries offline, adding nums as limit increases.' },
      { afterAttempt: 2, text: 'Use binary trie. For each query, only include nums <= limit, then find max XOR.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Offline Query + Binary Trie

\`\`\`python
def maximizeXor(nums, queries):
    nums.sort()

    # Sort queries by limit, keep original index
    sorted_queries = sorted(enumerate(queries), key=lambda x: x[1][1])

    trie = {}
    result = [-1] * len(queries)
    j = 0

    for idx, (x, limit) in sorted_queries:
        # Add all nums <= limit to trie
        while j < len(nums) and nums[j] <= limit:
            node = trie
            for i in range(31, -1, -1):
                bit = (nums[j] >> i) & 1
                if bit not in node:
                    node[bit] = {}
                node = node[bit]
            j += 1

        if not trie:
            continue

        # Find max XOR
        node = trie
        xor_val = 0
        for i in range(31, -1, -1):
            bit = (x >> i) & 1
            if (1 - bit) in node:
                xor_val |= (1 << i)
                node = node[1 - bit]
            elif bit in node:
                node = node[bit]
            else:
                break
        result[idx] = xor_val

    return result
\`\`\`

## Key Insight
- Process queries offline, sorted by limit
- Incrementally add numbers to trie as limit increases
- For each query, find max XOR using opposite bit greedy`
    },
    testCases: [
      { input: 'maximizeXor([0,1,2,3,4], [[3,1],[1,3],[5,6]])', expected: '[3,3,7]' },
      { input: 'maximizeXor([5,2,4,6,6,3], [[12,4],[8,1],[6,3]])', expected: '[15,-1,5]' },
      { input: 'maximizeXor([1], [[1,1]])', expected: '[0]' }
    ],
    solutionExplanation: 'Offline processing: sort by limit, incrementally build trie, query for max XOR.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-minimum-xor-pair',
    title: 'Minimum XOR Pair',
    description: 'Find minimum XOR of any pair in array',
    targetComplexity: { time: 'O(n log n)', space: 'O(n × 32)' },
    instruction: `# Minimum XOR Pair

Given an array of integers, return the minimum XOR of any two elements.

## Examples

**Example 1:**
\`\`\`
Input: nums = [3, 10, 5, 25, 2, 8]
Output: 1
Explanation: 2 XOR 3 = 1
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1, 2, 3, 4]
Output: 1
Explanation: 2 XOR 3 = 1
\`\`\`

## Constraints
- 2 <= nums.length <= 10^5
- 0 <= nums[i] <= 10^9`,
    starterCode: `def findMinimumXOR(nums):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Sort the array first. Minimum XOR is between adjacent elements in sorted order.' },
      { afterAttempt: 2, text: 'After sorting, XOR adjacent pairs and return minimum.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Sort and Check Adjacent

\`\`\`python
def findMinimumXOR(nums):
    nums.sort()
    min_xor = float('inf')

    for i in range(len(nums) - 1):
        min_xor = min(min_xor, nums[i] ^ nums[i + 1])

    return min_xor
\`\`\`

## Why Sorting Works?
- After sorting, numbers with similar bit patterns are adjacent
- XOR of similar numbers is smaller
- Minimum XOR is always between adjacent sorted elements

## Trie Alternative (O(n × 32)):

\`\`\`python
def findMinimumXOR(nums):
    trie = {}
    min_xor = float('inf')

    for num in nums:
        # Find min XOR with existing numbers
        if trie:
            node = trie
            xor_val = 0
            for i in range(31, -1, -1):
                bit = (num >> i) & 1
                if bit in node:
                    node = node[bit]
                else:
                    xor_val |= (1 << i)
                    node = node[1 - bit]
            min_xor = min(min_xor, xor_val)

        # Insert current number
        node = trie
        for i in range(31, -1, -1):
            bit = (num >> i) & 1
            if bit not in node:
                node[bit] = {}
            node = node[bit]

    return min_xor
\`\`\`
`
    },
    testCases: [
      { input: 'findMinimumXOR([3,10,5,25,2,8])', expected: '1' },
      { input: 'findMinimumXOR([1,2,3,4])', expected: '1' },
      { input: 'findMinimumXOR([0,1])', expected: '1' }
    ],
    solutionExplanation: 'Sort array, minimum XOR is between adjacent elements.'
  },

  // ==================== GROUP 5: Trie + DP ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-word-break-trie',
    title: 'Word Break',
    description: 'Check if string can be segmented into dictionary words',
    targetComplexity: { time: 'O(n²)', space: 'O(n + dict)' },
    instruction: `# Word Break

Given a string s and a dictionary of words, return true if s can be segmented into a space-separated sequence of dictionary words.

## Examples

**Example 1:**
\`\`\`
Input: s = "leetcode", wordDict = ["leet","code"]
Output: true
Explanation: "leet" + "code"
\`\`\`

**Example 2:**
\`\`\`
Input: s = "applepenapple", wordDict = ["apple","pen"]
Output: true
Explanation: "apple" + "pen" + "apple"
\`\`\`

**Example 3:**
\`\`\`
Input: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
Output: false
\`\`\`

## Constraints
- 1 <= s.length <= 300
- 1 <= wordDict.length <= 1000
- 1 <= wordDict[i].length <= 20`,
    starterCode: `def wordBreak(s, wordDict):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use DP: dp[i] = can we segment s[0:i]?' },
      { afterAttempt: 2, text: 'Build trie from dict. For each position, traverse trie to find all matching words.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Trie + DP

\`\`\`python
def wordBreak(s, wordDict):
    # Build trie
    trie = {}
    for word in wordDict:
        node = trie
        for char in word:
            if char not in node:
                node[char] = {}
            node = node[char]
        node['$'] = True

    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True

    for i in range(n):
        if not dp[i]:
            continue

        node = trie
        for j in range(i, n):
            if s[j] not in node:
                break
            node = node[s[j]]
            if '$' in node:
                dp[j + 1] = True

    return dp[n]
\`\`\`

## Key Insight
- dp[i] = can we segment s[0:i]?
- From each valid position, traverse trie to find all words
- When word ends, mark dp[end position] = True`
    },
    testCases: [
      { input: 'wordBreak("leetcode", ["leet","code"])', expected: 'True' },
      { input: 'wordBreak("applepenapple", ["apple","pen"])', expected: 'True' },
      { input: 'wordBreak("catsandog", ["cats","dog","sand","and","cat"])', expected: 'False' }
    ],
    solutionExplanation: 'Build trie from dictionary, use DP to track segmentable positions.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-word-break-ii-trie',
    title: 'Word Break II',
    description: 'Return all possible sentences from word segmentation',
    targetComplexity: { time: 'O(n × 2^n)', space: 'O(n × 2^n)' },
    instruction: `# Word Break II

Given a string s and a dictionary of words, return all possible sentences that can be formed by segmenting s.

## Examples

**Example 1:**
\`\`\`
Input: s = "catsanddog", wordDict = ["cat","cats","and","sand","dog"]
Output: ["cats and dog","cat sand dog"]
\`\`\`

**Example 2:**
\`\`\`
Input: s = "pineapplepenapple", wordDict = ["apple","pen","applepen","pine","pineapple"]
Output: ["pine apple pen apple","pineapple pen apple","pine applepen apple"]
\`\`\`

## Constraints
- 1 <= s.length <= 20
- 1 <= wordDict.length <= 1000`,
    starterCode: `def wordBreak(s, wordDict):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use backtracking with memoization. Trie helps find matching words efficiently.' },
      { afterAttempt: 2, text: 'From each position, find all words that match, recurse for rest of string.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Trie + Backtracking with Memo

\`\`\`python
def wordBreak(s, wordDict):
    # Build trie
    trie = {}
    for word in wordDict:
        node = trie
        for char in word:
            if char not in node:
                node[char] = {}
            node = node[char]
        node['$'] = True

    memo = {}

    def backtrack(start):
        if start == len(s):
            return [[]]

        if start in memo:
            return memo[start]

        result = []
        node = trie

        for end in range(start, len(s)):
            char = s[end]
            if char not in node:
                break
            node = node[char]

            if '$' in node:
                word = s[start:end + 1]
                for rest in backtrack(end + 1):
                    result.append([word] + rest)

        memo[start] = result
        return result

    sentences = backtrack(0)
    return [' '.join(words) for words in sentences]
\`\`\`

## Key Insight
- Use trie to efficiently find matching words at each position
- Backtrack with memoization to avoid recomputation
- Build sentences from word lists`
    },
    testCases: [
      { input: 'wordBreak("catsanddog", ["cat","cats","and","sand","dog"])', expected: '["cats and dog","cat sand dog"]' },
      { input: 'wordBreak("a", ["a"])', expected: '["a"]' },
      { input: 'wordBreak("ab", ["a","b"])', expected: '["a b"]' }
    ],
    solutionExplanation: 'Trie + backtracking with memoization to find all valid segmentations.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-concatenated-words',
    title: 'Concatenated Words',
    description: 'Find words formed by concatenating other words',
    targetComplexity: { time: 'O(n × L²)', space: 'O(n × L)' },
    instruction: `# Concatenated Words

Given an array of words, return all "concatenated words" - words that can be built entirely from other shorter words in the array.

## Examples

**Example 1:**
\`\`\`
Input: words = ["cat","cats","catsdogcats","dog","dogcatsdog","hippopotamuses","rat","ratcatdogcat"]
Output: ["catsdogcats","dogcatsdog","ratcatdogcat"]
Explanation:
- "catsdogcats" = "cats" + "dog" + "cats"
- "dogcatsdog" = "dog" + "cats" + "dog"
- "ratcatdogcat" = "rat" + "cat" + "dog" + "cat"
\`\`\`

## Constraints
- 1 <= words.length <= 10^4
- 1 <= words[i].length <= 30`,
    starterCode: `def findAllConcatenatedWords(words):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Sort words by length. Use trie + DP to check if word is concatenation of shorter words.' },
      { afterAttempt: 2, text: 'For each word, check if it can be segmented using only previously seen shorter words.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Trie + Word Break DP

\`\`\`python
def findAllConcatenatedWords(words):
    words.sort(key=len)
    trie = {}
    result = []

    def canForm(word):
        if not word:
            return False

        n = len(word)
        dp = [False] * (n + 1)
        dp[0] = True

        for i in range(n):
            if not dp[i]:
                continue
            node = trie
            for j in range(i, n):
                if word[j] not in node:
                    break
                node = node[word[j]]
                if '$' in node:
                    dp[j + 1] = True

        return dp[n]

    def insert(word):
        node = trie
        for char in word:
            if char not in node:
                node[char] = {}
            node = node[char]
        node['$'] = True

    for word in words:
        if canForm(word):
            result.append(word)
        insert(word)

    return result
\`\`\`

## Key Insight
- Sort by length so shorter words come first
- For each word, check if it can be formed using existing trie words
- Then add to trie for future words to use`
    },
    testCases: [
      { input: 'findAllConcatenatedWords(["cat","cats","catsdogcats","dog","dogcatsdog","hippopotamuses","rat","ratcatdogcat"])', expected: '["catsdogcats","dogcatsdog","ratcatdogcat"]' },
      { input: 'findAllConcatenatedWords(["cat","dog","catdog"])', expected: '["catdog"]' },
      { input: 'findAllConcatenatedWords(["a","b","ab","abc"])', expected: '["ab"]' }
    ],
    solutionExplanation: 'Sort by length, use word break DP with trie, incrementally build trie.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-short-encoding-words',
    title: 'Short Encoding of Words',
    description: 'Find minimum encoding length for word list',
    targetComplexity: { time: 'O(n × L)', space: 'O(n × L)' },
    instruction: `# Short Encoding of Words

A valid encoding of a word list consists of a reference string and a list of indices, where each word equals the substring starting at that index until the next '#'.

Find the length of the shortest reference string that encodes all words.

## Examples

**Example 1:**
\`\`\`
Input: words = ["time", "me", "bell"]
Output: 10
Explanation: "time#bell#" encodes all words
- "time" at index 0
- "me" at index 2 (suffix of "time")
- "bell" at index 5
\`\`\`

**Example 2:**
\`\`\`
Input: words = ["t"]
Output: 2
Explanation: "t#"
\`\`\`

## Constraints
- 1 <= words.length <= 2000
- 1 <= words[i].length <= 7`,
    starterCode: `def minimumLengthEncoding(words):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'A word can share encoding if it\'s a suffix of another word.' },
      { afterAttempt: 2, text: 'Build reverse trie. Only count words that are leaves (not suffixes of others).' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Reverse Trie (Suffix Trie)

\`\`\`python
def minimumLengthEncoding(words):
    words = list(set(words))  # Remove duplicates

    # Build reverse trie
    trie = {}
    leaves = []

    for word in words:
        node = trie
        for char in reversed(word):
            if char not in node:
                node[char] = {}
            node = node[char]
        leaves.append((node, len(word)))

    # Count only leaf nodes (not suffixes of others)
    total = 0
    for node, length in leaves:
        if not node:  # No children = leaf = not suffix
            total += length + 1  # +1 for '#'

    return total
\`\`\`

## Key Insight
- "me" is suffix of "time", so they share encoding
- Build reverse trie (insert words backwards)
- Suffixes share prefix in reverse trie
- Only leaf nodes (words not suffix of others) contribute to length

## Simpler Set-based Solution:

\`\`\`python
def minimumLengthEncoding(words):
    words_set = set(words)
    for word in words:
        for i in range(1, len(word)):
            words_set.discard(word[i:])

    return sum(len(w) + 1 for w in words_set)
\`\`\`
`
    },
    testCases: [
      { input: 'minimumLengthEncoding(["time","me","bell"])', expected: '10' },
      { input: 'minimumLengthEncoding(["t"])', expected: '2' },
      { input: 'minimumLengthEncoding(["me","time"])', expected: '5' }
    ],
    solutionExplanation: 'Build reverse trie, count only leaf words (not suffixes of others).'
  },

  // ==================== GROUP 6: Multi-Trie / Hybrid ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-longest-common-prefix-trie',
    title: 'Longest Common Prefix',
    description: 'Find longest common prefix using Trie',
    targetComplexity: { time: 'O(n × L)', space: 'O(n × L)' },
    instruction: `# Longest Common Prefix

Given an array of strings, find the longest common prefix.

## Examples

**Example 1:**
\`\`\`
Input: strs = ["flower","flow","flight"]
Output: "fl"
\`\`\`

**Example 2:**
\`\`\`
Input: strs = ["dog","racecar","car"]
Output: ""
\`\`\`

## Constraints
- 1 <= strs.length <= 200
- 0 <= strs[i].length <= 200`,
    starterCode: `def longestCommonPrefix(strs):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Build trie with all words. LCP is the path where each node has exactly one child.' },
      { afterAttempt: 2, text: 'Stop when node has multiple children or is end of a word.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Trie Traversal

\`\`\`python
def longestCommonPrefix(strs):
    if not strs:
        return ""

    # Build trie
    trie = {}
    for s in strs:
        node = trie
        for char in s:
            if char not in node:
                node[char] = {}
            node = node[char]
        node['$'] = True  # Mark end

    # Find LCP: single-child path
    prefix = []
    node = trie

    while len(node) == 1 and '$' not in node:
        char = list(node.keys())[0]
        prefix.append(char)
        node = node[char]

    return ''.join(prefix)
\`\`\`

## Key Insight
- Common prefix = path where every node has exactly one child
- Stop when:
  - Node has multiple children (paths diverge)
  - Node is end of word (one string ends)

## Simpler Non-Trie Solution:

\`\`\`python
def longestCommonPrefix(strs):
    if not strs:
        return ""

    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    return prefix
\`\`\`
`
    },
    testCases: [
      { input: 'longestCommonPrefix(["flower","flow","flight"])', expected: '"fl"' },
      { input: 'longestCommonPrefix(["dog","racecar","car"])', expected: '""' },
      { input: 'longestCommonPrefix(["a"])', expected: '"a"' }
    ],
    solutionExplanation: 'Build trie, LCP is single-child path from root until divergence or word end.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-camelcase-matching',
    title: 'CamelCase Matching',
    description: 'Match patterns with uppercase constraints',
    targetComplexity: { time: 'O(n × L)', space: 'O(1)' },
    instruction: `# CamelCase Matching

Given a list of queries and a pattern, determine which queries match the pattern.

A query matches if:
- We can insert lowercase letters into pattern to get query
- All uppercase letters in pattern must appear in query in order

## Examples

**Example 1:**
\`\`\`
Input: queries = ["FooBar","FooBarTest","FootBall","FrameBuffer","ForceFeedBack"]
       pattern = "FB"
Output: [true, false, true, true, false]
Explanation:
- "FooBar" ← F_B (insert oo, ar)
- "FooBarTest" has extra T (uppercase)
- "FootBall" ← F_B (insert oot, all)
\`\`\`

## Constraints
- 1 <= queries.length <= 100
- 1 <= queries[i].length, pattern.length <= 100`,
    starterCode: `def camelMatch(queries, pattern):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Two-pointer approach: pattern chars must appear in order in query.' },
      { afterAttempt: 2, text: 'Extra uppercase in query = mismatch. Lowercase can be skipped.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Two Pointer Matching

\`\`\`python
def camelMatch(queries, pattern):
    def matches(query, pattern):
        j = 0
        for char in query:
            if j < len(pattern) and char == pattern[j]:
                j += 1
            elif char.isupper():
                return False  # Extra uppercase not in pattern
        return j == len(pattern)

    return [matches(q, pattern) for q in queries]
\`\`\`

## Key Insight
- Pattern characters must appear in query in order
- Lowercase letters in query can be extras (inserted)
- Uppercase letters in query must be in pattern
- Extra uppercase = automatic mismatch`
    },
    testCases: [
      { input: 'camelMatch(["FooBar","FooBarTest","FootBall","FrameBuffer","ForceFeedBack"], "FB")', expected: '[True,False,True,True,False]' },
      { input: 'camelMatch(["FooBar"], "FoBa")', expected: '[True]' },
      { input: 'camelMatch(["FooBar"], "FoBaT")', expected: '[False]' }
    ],
    solutionExplanation: 'Two pointers: match pattern chars in order, reject extra uppercase.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-design-file-system',
    title: 'Design File System',
    description: 'Support path creation and value lookup',
    targetComplexity: { time: 'O(L)', space: 'O(total path length)' },
    instruction: `# Design File System

Design a file system that supports:
- \`createPath(path, value)\`: Create path with value. Return true if successful, false if parent doesn't exist or path already exists.
- \`get(path)\`: Return value at path, or -1 if doesn't exist.

## Examples

\`\`\`
fs = FileSystem()
fs.createPath("/a", 1)    → true
fs.get("/a")              → 1
fs.createPath("/a/b", 2)  → true
fs.get("/a/b")            → 2
fs.createPath("/c/d", 3)  → false (parent "/c" doesn't exist)
fs.createPath("/a", 4)    → false (path already exists)
\`\`\`

## Constraints
- Path format: "/name" or "/name1/name2/..."
- Names contain only lowercase letters`,
    starterCode: `class FileSystem:
    def __init__(self):
        pass

    def createPath(self, path, value):
        pass

    def get(self, path):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use trie where each node represents a path component.' },
      { afterAttempt: 2, text: 'For createPath, check parent exists and path doesn\'t. For get, traverse and return value.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Trie-based File System

\`\`\`python
class FileSystem:
    def __init__(self):
        self.root = {}

    def createPath(self, path, value):
        parts = path.split('/')[1:]  # Skip empty first part

        # Check parent exists
        node = self.root
        for part in parts[:-1]:
            if part not in node:
                return False
            node = node[part]

        # Check path doesn't exist
        if parts[-1] in node:
            return False

        # Create path
        node[parts[-1]] = {'$': value}
        return True

    def get(self, path):
        parts = path.split('/')[1:]

        node = self.root
        for part in parts:
            if part not in node:
                return -1
            node = node[part]

        return node.get('$', -1)
\`\`\`

## Key Insight
- Each path component is a trie node
- Store value at leaf using special key '$'
- createPath: verify parent exists, path doesn't
- get: traverse path and return stored value`
    },
    testCases: [
      { input: 'fs = FileSystem(); fs.createPath("/a",1); fs.get("/a")', expected: '1' },
      { input: 'fs = FileSystem(); fs.createPath("/a",1); fs.createPath("/a/b",2); fs.get("/a/b")', expected: '2' },
      { input: 'fs = FileSystem(); fs.createPath("/c/d",3)', expected: 'False' }
    ],
    solutionExplanation: 'Trie where nodes are path components, values stored at leaves.'
  },

  // ==================== GROUP 7: Hard Problems ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-prefix-suffix-search',
    title: 'Prefix and Suffix Search',
    description: 'Find word index matching both prefix and suffix',
    targetComplexity: { time: 'O(L²) per insert, O(L) per query', space: 'O(n × L²)' },
    instruction: `# Prefix and Suffix Search

Design a data structure that supports finding the word index with a given prefix and suffix.

Implement:
- \`WordFilter(words)\`: Initialize with word list
- \`f(prefix, suffix)\`: Return index of word with given prefix AND suffix. If multiple, return largest index. If none, return -1.

## Examples

\`\`\`
wf = WordFilter(["apple"])
wf.f("a", "e")  → 0  ("apple" has prefix "a" and suffix "e")
\`\`\`

\`\`\`
wf = WordFilter(["apple", "apply"])
wf.f("app", "y")  → 1  ("apply" at index 1)
wf.f("app", "e")  → 0  ("apple" at index 0)
\`\`\`

## Constraints
- 1 <= words.length <= 10^4
- 1 <= words[i].length <= 7
- 1 <= prefix.length, suffix.length <= 7`,
    starterCode: `class WordFilter:
    def __init__(self, words):
        pass

    def f(self, prefix, suffix):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Store all prefix#suffix combinations in a trie/dict with word index.' },
      { afterAttempt: 2, text: 'For each word, insert all combinations: suffix + "#" + prefix for all suffix lengths.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Combined Prefix-Suffix Keys

\`\`\`python
class WordFilter:
    def __init__(self, words):
        self.lookup = {}

        for idx, word in enumerate(words):
            # Generate all suffix#prefix combinations
            for i in range(len(word) + 1):
                for j in range(len(word) + 1):
                    key = word[i:] + '#' + word[:j]
                    self.lookup[key] = idx

    def f(self, prefix, suffix):
        key = suffix + '#' + prefix
        return self.lookup.get(key, -1)
\`\`\`

## Trie-based Alternative:

\`\`\`python
class WordFilter:
    def __init__(self, words):
        self.trie = {}

        for idx, word in enumerate(words):
            # Insert all "suffix#word" variants
            for i in range(len(word) + 1):
                key = word[i:] + '#' + word
                node = self.trie
                for char in key:
                    if char not in node:
                        node[char] = {}
                    node = node[char]
                    node['$'] = idx

    def f(self, prefix, suffix):
        key = suffix + '#' + prefix
        node = self.trie
        for char in key:
            if char not in node:
                return -1
            node = node[char]
        return node.get('$', -1)
\`\`\`

## Key Insight
- Store suffix#word in trie, with index at each node
- Query becomes finding suffix#prefix path
- Later words overwrite earlier, giving largest index`
    },
    testCases: [
      { input: 'wf = WordFilter(["apple"]); wf.f("a","e")', expected: '0' },
      { input: 'wf = WordFilter(["apple","apply"]); wf.f("app","y")', expected: '1' },
      { input: 'wf = WordFilter(["test"]); wf.f("x","x")', expected: '-1' }
    ],
    solutionExplanation: 'Store all suffix#prefix combinations, query as single key lookup.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-word-squares',
    title: 'Word Squares',
    description: 'Generate all valid word squares',
    targetComplexity: { time: 'O(n! × L)', space: 'O(n × L)' },
    instruction: `# Word Squares

A word square is a sequence of words where:
- All words have the same length k
- The k-th row and k-th column read the same word

Given a list of unique words, return all word squares you can build.

## Examples

**Example 1:**
\`\`\`
Input: words = ["area","lead","wall","lady","ball"]
Output: [["wall","area","lead","lady"],["ball","area","lead","lady"]]
Explanation:
w a l l      b a l l
a r e a      a r e a
l e a d      l e a d
l a d y      l a d y
\`\`\`

## Constraints
- 1 <= words.length <= 1000
- 1 <= words[i].length <= 4
- All words have same length`,
    starterCode: `def wordSquares(words):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use backtracking. After placing k words, the prefix for word k+1 is determined.' },
      { afterAttempt: 2, text: 'Build trie with all words. Use it to quickly find words with required prefix.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Trie + Backtracking

\`\`\`python
def wordSquares(words):
    if not words:
        return []

    n = len(words[0])

    # Build trie with word lists at each prefix
    trie = {}
    for word in words:
        node = trie
        for char in word:
            if char not in node:
                node[char] = {'words': []}
            node = node[char]
            node['words'].append(word)

    def getWordsWithPrefix(prefix):
        node = trie
        for char in prefix:
            if char not in node:
                return []
            node = node[char]
        return node.get('words', [])

    result = []

    def backtrack(square):
        if len(square) == n:
            result.append(square[:])
            return

        # Determine required prefix for next word
        idx = len(square)
        prefix = ''.join(square[i][idx] for i in range(idx))

        for word in getWordsWithPrefix(prefix):
            square.append(word)
            backtrack(square)
            square.pop()

    for word in words:
        backtrack([word])

    return result
\`\`\`

## Key Insight
- If we have k words, column k forms the prefix for word k+1
- Use trie to quickly find all words with required prefix
- Backtrack to try all valid combinations`
    },
    testCases: [
      { input: 'wordSquares(["area","lead","wall","lady","ball"])', expected: '[["ball","area","lead","lady"],["wall","area","lead","lady"]]' },
      { input: 'wordSquares(["abat","baba","atan","atal"])', expected: '[["baba","abat","baba","atan"],["baba","abat","baba","atal"]]' },
      { input: 'wordSquares(["a"])', expected: '[["a"]]' }
    ],
    solutionExplanation: 'Trie for prefix lookup, backtracking to build valid squares.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-count-prefix-suffix-pairs',
    title: 'Count Prefix-Suffix Pairs',
    description: 'Count pairs where one word is both prefix and suffix of another',
    targetComplexity: { time: 'O(n × L)', space: 'O(n × L)' },
    instruction: `# Count Prefix-Suffix Pairs

Given an array of words, count pairs (i, j) where i < j and words[i] is both a prefix AND suffix of words[j].

## Examples

**Example 1:**
\`\`\`
Input: words = ["a","aba","ababa","aa"]
Output: 4
Pairs:
- ("a", "aba") - "a" is prefix and suffix of "aba"
- ("a", "ababa") - "a" is prefix and suffix of "ababa"
- ("a", "aa") - "a" is prefix and suffix of "aa"
- ("aba", "ababa") - "aba" is prefix and suffix of "ababa"
\`\`\`

## Constraints
- 1 <= words.length <= 10^5
- 1 <= words[i].length <= 10^5`,
    starterCode: `def countPrefixSuffixPairs(words):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'For each word, find its Z-array to identify positions where prefix = suffix.' },
      { afterAttempt: 2, text: 'Use trie with suffix#word encoding, or check prefix-suffix property directly.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Trie with Tuple Keys

\`\`\`python
def countPrefixSuffixPairs(words):
    # Trie where each node is keyed by (prefix_char, suffix_char) pair
    trie = {}
    count = 0

    for word in words:
        n = len(word)
        node = trie

        # Traverse using (word[i], word[n-1-i]) pairs
        for i in range(n):
            key = (word[i], word[n - 1 - i])
            if key not in node:
                node[key] = {'count': 0}
            node = node[key]
            count += node['count']

        # Increment count at word end
        node['count'] = node.get('count', 0) + 1

    return count
\`\`\`

## Alternative: Direct Check

\`\`\`python
def countPrefixSuffixPairs(words):
    def isPrefixAndSuffix(s1, s2):
        return s2.startswith(s1) and s2.endswith(s1)

    count = 0
    for i in range(len(words)):
        for j in range(i + 1, len(words)):
            if isPrefixAndSuffix(words[i], words[j]):
                count += 1
    return count
\`\`\`

## Key Insight
- A word is both prefix and suffix if characters match from both ends
- Use (prefix_char, suffix_char) pairs as trie keys
- Count matching prefixes as we insert`
    },
    testCases: [
      { input: 'countPrefixSuffixPairs(["a","aba","ababa","aa"])', expected: '4' },
      { input: 'countPrefixSuffixPairs(["pa","papa","ma","mama"])', expected: '2' },
      { input: 'countPrefixSuffixPairs(["a","b","c"])', expected: '0' }
    ],
    solutionExplanation: 'Use trie with (prefix, suffix) char pairs as keys, count matches during traversal.'
  },

  // ==================== GROUP 8: Optimization ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-longest-repeating-substring',
    title: 'Longest Repeating Substring',
    description: 'Find longest substring that appears at least twice',
    targetComplexity: { time: 'O(n² log n) or O(n²)', space: 'O(n²)' },
    instruction: `# Longest Repeating Substring

Given a string s, find the length of the longest substring that appears at least twice.

## Examples

**Example 1:**
\`\`\`
Input: s = "abcd"
Output: 0
Explanation: No repeated substring
\`\`\`

**Example 2:**
\`\`\`
Input: s = "abbaba"
Output: 2
Explanation: "ab" and "ba" appear twice, length 2
\`\`\`

**Example 3:**
\`\`\`
Input: s = "aabcaabdaab"
Output: 3
Explanation: "aab" appears 3 times
\`\`\`

## Constraints
- 1 <= s.length <= 1000`,
    starterCode: `def longestRepeatingSubstring(s):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Binary search on length + rolling hash, or use suffix trie.' },
      { afterAttempt: 2, text: 'Suffix trie: insert all suffixes, look for deepest node reached twice.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Binary Search + Set

\`\`\`python
def longestRepeatingSubstring(s):
    n = len(s)

    def hasRepeat(length):
        seen = set()
        for i in range(n - length + 1):
            sub = s[i:i + length]
            if sub in seen:
                return True
            seen.add(sub)
        return False

    left, right = 0, n - 1
    result = 0

    while left <= right:
        mid = (left + right) // 2
        if hasRepeat(mid):
            result = mid
            left = mid + 1
        else:
            right = mid - 1

    return result
\`\`\`

## Suffix Trie Solution:

\`\`\`python
def longestRepeatingSubstring(s):
    root = {}
    max_len = 0

    for i in range(len(s)):
        node = root
        depth = 0
        for j in range(i, len(s)):
            char = s[j]
            if char not in node:
                node[char] = {'count': 0}
            node = node[char]
            node['count'] += 1
            depth += 1
            if node['count'] >= 2:
                max_len = max(max_len, depth)

    return max_len
\`\`\`

## Key Insight
- Build suffix trie, track visit count at each node
- Node visited >= 2 times = repeated substring
- Maximum depth of such node = longest repeating`
    },
    testCases: [
      { input: 'longestRepeatingSubstring("abcd")', expected: '0' },
      { input: 'longestRepeatingSubstring("abbaba")', expected: '2' },
      { input: 'longestRepeatingSubstring("aabcaabdaab")', expected: '3' }
    ],
    solutionExplanation: 'Binary search on length with hash set, or suffix trie with visit counts.'
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-maximum-score-words',
    title: 'Maximum Score Words Formed',
    description: 'Pick words to maximize score under letter constraints',
    targetComplexity: { time: 'O(2^n × L)', space: 'O(n)' },
    instruction: `# Maximum Score Words Formed by Letters

Given words, letters (with quantities), and scores for each letter, find the maximum score by picking any subset of words that can be formed with available letters.

## Examples

**Example 1:**
\`\`\`
Input: words = ["dog","cat","dad","good"]
       letters = ["a","a","c","d","d","d","g","o","o"]
       score = [1,0,9,5,0,0,3,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0]
              (a=1, c=9, d=5, g=3, o=2)
Output: 23
Explanation: Pick "dad" (5+1+5=11) and "good" (3+2+2+5=12) = 23
\`\`\`

## Constraints
- 1 <= words.length <= 14
- 1 <= words[i].length <= 15
- 1 <= letters.length <= 100`,
    starterCode: `def maxScoreWords(words, letters, score):
    # Your code here
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'With only 14 words, try all 2^n subsets.' },
      { afterAttempt: 2, text: 'For each subset, check if letters suffice and compute score.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `# Solution: Bitmask Enumeration

\`\`\`python
from collections import Counter

def maxScoreWords(words, letters, score):
    letter_count = Counter(letters)
    n = len(words)
    max_score = 0

    # Precompute word scores and letter needs
    word_scores = []
    word_needs = []
    for word in words:
        needs = Counter(word)
        s = sum(score[ord(c) - ord('a')] for c in word)
        word_needs.append(needs)
        word_scores.append(s)

    # Try all subsets
    for mask in range(1 << n):
        total_needs = Counter()
        total_score = 0

        for i in range(n):
            if mask & (1 << i):
                total_needs += word_needs[i]
                total_score += word_scores[i]

        # Check if we have enough letters
        valid = all(total_needs[c] <= letter_count[c] for c in total_needs)

        if valid:
            max_score = max(max_score, total_score)

    return max_score
\`\`\`

## Key Insight
- With <= 14 words, 2^14 = 16384 subsets is feasible
- For each subset, sum letter requirements and check against available
- Track maximum valid score`
    },
    testCases: [
      { input: 'maxScoreWords(["dog","cat","dad","good"], ["a","a","c","d","d","d","g","o","o"], [1,0,9,5,0,0,3,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0])', expected: '23' },
      { input: 'maxScoreWords(["a"], ["a"], [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])', expected: '1' },
      { input: 'maxScoreWords(["ab"], ["a"], [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])', expected: '0' }
    ],
    solutionExplanation: 'Enumerate all 2^n subsets, check letter validity, track max score.'
  }
];
