import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { module9UnionFindLessonSmartPracticeExercises } from './exercises/moduleUnionFindLessonSmartPracticeExercises';

// ============================================================================
// MODULE DEFINITION
// ============================================================================

export const module9UnionFindLesson: ProgressiveLesson = {
  id: 'union-find-disjoint-set',
  title: 'Module: Union-Find (Disjoint Set Union)',
  description: 'Build Union-Find from first principles - discover optimizations through hands-on coding',
  unlockMode: 'sequential',
  sections: [
    // ============================================================================
    // READING WITH INLINE MINI-EDITORS
    // ============================================================================
    {
      type: 'reading',
      id: 'union-find-complete',
      title: 'Union-Find: From Problem to Optimized Solution',
      estimatedReadTime: 1200,
      inlineExercises: [
        // Exercise 1: Brute force find_group
        {
          id: 'find-brute',
          starterCode: `def find_group(groups, x):
    """
    Find which group x belongs to.
    groups: list of sets, e.g., [{0,1}, {2,3}, {4,5}]
    Returns: index of the group containing x, or -1 if not found
    """
    pass`,
          testCases: [
            { input: '[{0, 1}, {2, 3}, {4, 5}], 1', expectedOutput: '0' },
            { input: '[{0, 1}, {2, 3}, {4, 5}], 3', expectedOutput: '1' },
            { input: '[{0, 1}, {2, 3}, {4, 5}], 5', expectedOutput: '2' },
            { input: '[{0, 1, 2, 3}], 2', expectedOutput: '0' },
          ],
          targetFunction: 'find_group',
          hints: [
            'Loop through each group with enumerate(groups)',
            'Check if x is in each group using "if x in group"',
            'Return the index i when you find x',
          ],
          solution: `def find_group(groups, x):
    for i, group in enumerate(groups):
        if x in group:
            return i
    return -1`,
          successMessage: 'find() is O(n) - we scan through all groups.',
        },
        // Exercise 2: Brute force union
        {
          id: 'union-brute',
          starterCode: `def union(groups, x, y):
    """
    Merge the groups containing x and y.
    groups: list of sets, e.g., [{0,1}, {2,3}]
    Modifies groups in place.
    Returns True if merged, False if already in same group.
    """
    pass`,
          testCases: [
            { input: '[{0, 1}, {2, 3}], 1, 2', expectedOutput: 'True' },
            { input: '[{0, 1}, {2, 3}], 0, 1', expectedOutput: 'False' },
            { input: '[{0}, {1}, {2}], 0, 2', expectedOutput: 'True' },
          ],
          targetFunction: 'union',
          hints: [
            'First find which groups x and y belong to',
            'If same group, return False',
            'Merge: add all elements from one group to the other',
            'Remove the now-empty group from the list',
          ],
          solution: `def union(groups, x, y):
    # Find groups containing x and y
    group_x = group_y = -1
    for i, group in enumerate(groups):
        if x in group:
            group_x = i
        if y in group:
            group_y = i

    if group_x == group_y:
        return False

    # Merge smaller into larger
    groups[group_x] = groups[group_x] | groups[group_y]
    groups.pop(group_y)
    return True`,
          successMessage: 'union() is also O(n) - we scan to find both groups, then merge.',
        },
        // Exercise 3: Hash map find_group
        {
          id: 'find-hash',
          starterCode: `def find_group(group_id, x):
    """
    Find the group ID for element x.
    group_id: dict mapping element -> group_id
    Returns: the group ID for x
    """
    pass`,
          testCases: [
            { input: '{0: 0, 1: 0, 2: 2, 3: 2}, 1', expectedOutput: '0' },
            { input: '{0: 0, 1: 0, 2: 2, 3: 2}, 3', expectedOutput: '2' },
            { input: '{0: 5, 1: 5, 2: 5}, 2', expectedOutput: '5' },
          ],
          targetFunction: 'find_group',
          hints: [
            'This is just a dictionary lookup!',
            'Return group_id[x]',
          ],
          solution: `def find_group(group_id, x):
    return group_id[x]`,
          successMessage: 'find() is now O(1)! Just a direct lookup.',
        },
        // Exercise 4: Hash map union - still slow!
        {
          id: 'union-hash',
          starterCode: `def union(group_id, x, y):
    """
    Merge groups containing x and y.
    group_id: dict mapping element -> group_id
    Returns True if merged, False if already same group.
    """
    pass`,
          testCases: [
            { input: '{0: 0, 1: 0, 2: 2, 3: 2}, 1, 2', expectedOutput: 'True' },
            { input: '{0: 0, 1: 0, 2: 2, 3: 2}, 0, 1', expectedOutput: 'False' },
            { input: '{0: 0, 1: 1, 2: 2}, 0, 2', expectedOutput: 'True' },
          ],
          targetFunction: 'union',
          hints: [
            'Get the group IDs: id_x = group_id[x], id_y = group_id[y]',
            'If same ID, return False',
            'Update ALL elements with id_y to have id_x instead',
            'Loop through all keys in group_id',
          ],
          solution: `def union(group_id, x, y):
    id_x = group_id[x]
    id_y = group_id[y]

    if id_x == id_y:
        return False

    # Must update ALL elements with id_y
    for elem in group_id:
        if group_id[elem] == id_y:
            group_id[elem] = id_x
    return True`,
          successMessage: 'union() is still O(n)! We have to update every element in the merged group.',
        },
        // Exercise 5: Parent pointer find
        {
          id: 'find-parent',
          starterCode: `def find(parent, x):
    """
    Find the root of x by following parent pointers.
    parent: list where parent[i] is the parent of i
    A root has parent[x] == x
    """
    pass`,
          testCases: [
            { input: '[0, 0, 2, 2, 4, 4], 1', expectedOutput: '0' },
            { input: '[0, 0, 2, 2, 4, 4], 3', expectedOutput: '2' },
            { input: '[0, 0, 2, 2, 4, 4], 4', expectedOutput: '4' },
            { input: '[1, 2, 3, 3], 0', expectedOutput: '3' },
          ],
          targetFunction: 'find',
          hints: [
            'Use a while loop: while parent[x] != x',
            'Inside the loop: x = parent[x]',
            'Return x when the loop ends',
          ],
          solution: `def find(parent, x):
    while parent[x] != x:
        x = parent[x]
    return x`,
          successMessage: 'Now find follows the tree to the root. Union becomes easy!',
        },
        // Exercise 4: Union with parent pointers
        {
          id: 'union-parent',
          starterCode: `def find(parent, x):
    while parent[x] != x:
        x = parent[x]
    return x

def union(parent, x, y):
    """
    Connect the groups containing x and y.
    Returns True if they were merged, False if already connected.
    """
    pass`,
          testCases: [
            { input: '[0, 1, 2, 3], 0, 1', expectedOutput: 'True' },
            { input: '[0, 0, 2, 2], 0, 1', expectedOutput: 'False' },
            { input: '[0, 0, 2, 2], 1, 3', expectedOutput: 'True' },
          ],
          targetFunction: 'union',
          hints: [
            'First find the roots: root_x = find(parent, x), root_y = find(parent, y)',
            'If roots are equal, return False (already connected)',
            'Otherwise, connect them: parent[root_x] = root_y',
            'Return True after connecting',
          ],
          solution: `def find(parent, x):
    while parent[x] != x:
        x = parent[x]
    return x

def union(parent, x, y):
    root_x = find(parent, x)
    root_y = find(parent, y)
    if root_x == root_y:
        return False
    parent[root_x] = root_y
    return True`,
          successMessage: 'Union now changes just ONE pointer instead of updating all members!',
        },
        // Exercise 5: Union by rank - the key optimization!
        {
          id: 'union-rank',
          starterCode: `def find(parent, x):
    while parent[x] != x:
        x = parent[x]
    return x

def union(parent, rank, x, y):
    """
    Union by rank: attach smaller tree under larger tree.
    - rank[i] = height of tree rooted at i
    - If same rank, pick one and increment its rank
    Returns True if merged, False if already connected.
    """
    pass`,
          testCases: [
            { input: '[0, 1, 2, 3], [0, 0, 0, 0], 0, 1', expectedOutput: 'True' },
            { input: '[0, 0, 2, 2], [1, 0, 1, 0], 0, 1', expectedOutput: 'False' },
            { input: '[0, 0, 2, 2], [1, 0, 1, 0], 1, 3', expectedOutput: 'True' },
          ],
          targetFunction: 'union',
          hints: [
            'Find roots: root_x = find(parent, x), root_y = find(parent, y)',
            'If roots equal, return False',
            'Compare rank[root_x] vs rank[root_y]',
            'Attach smaller rank under larger rank',
            'If equal ranks, pick one and increment its rank by 1',
          ],
          solution: `def find(parent, x):
    while parent[x] != x:
        x = parent[x]
    return x

def union(parent, rank, x, y):
    root_x = find(parent, x)
    root_y = find(parent, y)

    if root_x == root_y:
        return False

    # Attach smaller tree under larger tree
    if rank[root_x] < rank[root_y]:
        parent[root_x] = root_y
    elif rank[root_x] > rank[root_y]:
        parent[root_y] = root_x
    else:
        # Same rank: pick one, increment its rank
        parent[root_y] = root_x
        rank[root_x] += 1

    return True`,
          successMessage: 'Union by rank keeps trees balanced! Height is now O(log n) instead of O(n).',
        },
        // Exercise 6: Path compression (Advanced)
        {
          id: 'find-compression',
          starterCode: `def find(parent, x):
    """
    Find root with path compression.
    After finding root, make x point directly to it!
    Use recursion for elegance.
    """
    pass`,
          testCases: [
            { input: '[0, 0, 2, 2, 4, 4], 1', expectedOutput: '0' },
            { input: '[1, 2, 3, 3], 0', expectedOutput: '3' },
            { input: '[0, 0, 0, 0], 3', expectedOutput: '0' },
          ],
          targetFunction: 'find',
          hints: [
            'Base case: if parent[x] == x, return x',
            'Recursive case: parent[x] = find(parent, parent[x])',
            'The magic: parent[x] = ... makes x point directly to root',
            'Return parent[x] at the end',
          ],
          solution: `def find(parent, x):
    if parent[x] != x:
        parent[x] = find(parent, parent[x])
    return parent[x]`,
          successMessage: 'Path compression makes all nodes point directly to root. Near O(1) per operation!',
        },
      ],
      content: `
<h1>Union-Find: From Problem to Optimized Solution</h1>

<h2>The Connectivity Problem</h2>

<p>Imagine you're building a social network and need to quickly answer: <strong>"Are these two people connected through friends?"</strong></p>

<pre>
Alice ←→ Bob ←→ Charlie

David ←→ Emma

Frank (alone)
</pre>

<p>We need two operations:</p>
<ul>
<li><strong>find(x)</strong> - Which group does x belong to?</li>
<li><strong>union(x, y)</strong> - Connect x and y's groups</li>
</ul>

<h2>When to Use Union-Find vs DFS/BFS?</h2>

<p>Both can solve connectivity problems, but they excel at different things:</p>

<table>
<thead><tr><th>Scenario</th><th>Union-Find</th><th>DFS/BFS</th></tr></thead>
<tbody>
<tr><td><strong>Many</strong> "are A and B connected?" queries</td><td>✅ O(1) per query</td><td>❌ O(V+E) per query</td></tr>
<tr><td><strong>Dynamically adding</strong> edges over time</td><td>✅ Handles updates</td><td>❌ Must rebuild</td></tr>
<tr><td>Need the <strong>actual path</strong> from A to B</td><td>❌</td><td>✅</td></tr>
<tr><td>Need <strong>shortest path</strong></td><td>❌</td><td>✅ (BFS)</td></tr>
<tr><td>One-time "find all components"</td><td>Either works</td><td>✅ Simpler</td></tr>
</tbody>
</table>

<h3>Quick Decision Rule</h3>

<pre>
Q: "Are A and B connected?" (yes/no, asked MANY times)
   → Union-Find

Q: "Find the PATH from A to B" or "Visit all nodes"
   → DFS/BFS

Q: "Edges are being ADDED over time"
   → Union-Find

Q: "Static graph, traverse once"
   → DFS/BFS (simpler)
</pre>

<p><strong>Key insight:</strong> Union-Find is optimized for <em>repeated connectivity queries</em> and <em>dynamic updates</em>. DFS/BFS is optimized for <em>traversal</em> and <em>finding paths</em>.</p>

<h3>Representing Elements</h3>

<p>For simplicity, we'll represent each element as an <strong>integer from 0 to n-1</strong>:</p>

<pre>
n = 6 elements:  0, 1, 2, 3, 4, 5

Think of them as:
  0 = Alice
  1 = Bob
  2 = Charlie
  3 = David
  4 = Emma
  5 = Frank
</pre>

<p>Let's build this step by step, optimizing as we go!</p>

<h2>Approach 1: Brute Force (List of Groups)</h2>

<p>The simplest idea: store groups as a list of sets. Each set contains integers representing elements in that group.</p>

<pre><code>groups = [
    {0, 1},    # Group 0: elements 0 and 1 are connected
    {2, 3},    # Group 1: elements 2 and 3 are connected
    {4, 5}     # Group 2: elements 4 and 5 are connected
]</code></pre>

<p><strong>Implement find_group(groups, x):</strong></p>
<ul>
<li><code>groups</code>: a list of sets, e.g., <code>[{0,1}, {2,3}, {4,5}]</code></li>
<li><code>x</code>: an integer (the element we're looking for)</li>
<li><strong>Returns:</strong> the index of the group containing x (or -1 if not found)</li>
</ul>

<code-editor data-id="find-brute"></code-editor>

<p><strong>Implement union(groups, x, y):</strong></p>
<ul>
<li><code>groups</code>: a list of sets</li>
<li><code>x</code>, <code>y</code>: integers (elements to connect)</li>
<li><strong>Returns:</strong> True if merged, False if already in same group</li>
<li><strong>Modifies:</strong> groups list in place</li>
</ul>

<code-editor data-id="union-brute"></code-editor>

<p><strong>Complexity for Approach 1:</strong></p>
<table>
<thead><tr><th>Operation</th><th>Time</th><th>Why?</th></tr></thead>
<tbody>
<tr><td>find(x)</td><td>O(n)</td><td>Scan all groups to find x</td></tr>
<tr><td>union(x,y)</td><td>O(n)</td><td>Find both groups + merge sets</td></tr>
</tbody>
</table>

<p>With n elements and n operations: <strong>O(n²) total</strong>. Too slow!</p>

<h2>Approach 2: Hash Map - Each Element Remembers Its Group</h2>

<p>The problem: we're searching through every group just to find which one contains our element. What if each element just remembers its group ID?</p>

<pre>
We use a dictionary: group_id[element] = that element's group

group_id = {0: 0, 1: 0, 2: 2, 3: 2, 4: 4, 5: 4}

   element:  0   1   2   3   4   5
             │   │   │   │   │   │
             ▼   ▼   ▼   ▼   ▼   ▼
  group_id:  0   0   2   2   4   4

   Group 0 = {0, 1}    (elements with group_id = 0)
   Group 2 = {2, 3}    (elements with group_id = 2)
   Group 4 = {4, 5}    (elements with group_id = 4)
</pre>

<p><strong>Implement find_group(group_id, x):</strong></p>
<ul>
<li><code>group_id</code>: a dict mapping element (int) → group ID (int)</li>
<li><code>x</code>: an integer (the element we're looking for)</li>
<li><strong>Returns:</strong> the group ID for element x</li>
</ul>

<code-editor data-id="find-hash"></code-editor>

<p>find() is now <strong>O(1)</strong>! But what about union?</p>

<h3>The Pain of Union</h3>

<p>Since each element remembers its own group ID, when we merge two groups, we must visit EVERY element in one group and update their remembered ID:</p>

<pre>
BEFORE union(1, 3):
group_id = {0: 0, 1: 0, 2: 2, 3: 2, 4: 4, 5: 4}

   0 → 0    2 → 2    4 → 4
   1 → 0    3 → 2    5 → 4

We want to merge Group 0 and Group 2...

AFTER union(1, 3):
group_id = {0: 0, 1: 0, 2: 0, 3: 0, 4: 4, 5: 4}

   0 → 0    2 → 0  ✗ changed!    4 → 4
   1 → 0    3 → 0  ✗ changed!    5 → 4

Had to update EVERY element in Group 2!
</pre>

<p><strong>Implement union(group_id, x, y):</strong></p>
<ul>
<li><code>group_id</code>: a dict mapping element → group ID</li>
<li><code>x</code>, <code>y</code>: integers (elements to connect)</li>
<li><strong>Returns:</strong> True if merged, False if already in same group</li>
<li><strong>Modifies:</strong> group_id dict in place</li>
</ul>

<code-editor data-id="union-hash"></code-editor>

<p><strong>Complexity for Approach 2:</strong></p>
<table>
<thead><tr><th>Operation</th><th>Time</th><th>Why?</th></tr></thead>
<tbody>
<tr><td>find(x)</td><td><strong>O(1)</strong></td><td>Direct dictionary lookup!</td></tr>
<tr><td>union(x,y)</td><td>O(n)</td><td>Must update ALL elements in merged group</td></tr>
</tbody>
</table>

<p>We fixed find, but union is still slow. Can we make both fast?</p>

<h2>The Key Insight: One Change Instead of Many</h2>

<p>The problem with hash maps: when merging, we update <strong>every</strong> element's group ID.</p>

<p><strong>What if we only made ONE change?</strong></p>

<p>Instead of each element storing group ID directly, what if elements point to a "representative"? The representative (root) IS the group identity. To find your group, follow the chain to the root!</p>

<pre>
Instead of:              We use:
   1 → GroupA               1 → 0 (root)

"1 is in group A"       "1's representative is 0"
                        "To find 1's group, ask 0"
</pre>

<p>To merge groups → just make one root point to another. <strong>ONE pointer change!</strong></p>

<h2>Approach 3: Parent Pointers - Trees Form Groups</h2>

<p>Elements form trees. Each element points to its parent. Roots point to themselves.</p>

<pre>
We use a list: parent[i] = parent of element i

parent = [0, 0, 2, 2, 4, 4]
          │  │  │  │  │  │
          ▼  ▼  ▼  ▼  ▼  ▼
          0  0  2  2  4  4

parent[0] = 0  → 0 points to itself (root!)
parent[1] = 0  → 1 points to 0
parent[2] = 2  → 2 points to itself (root!)
parent[3] = 2  → 3 points to 2
...

   0 (root)     2 (root)     4 (root)
   ▲            ▲            ▲
   │            │            │
   1            3            5

Group 0 = {0,1}   Group 2 = {2,3}   Group 4 = {4,5}

find(1): follow 1→0, return 0 (the root)
find(3): follow 3→2, return 2 (the root)
</pre>

<p><strong>Implement find(parent, x):</strong></p>
<ul>
<li><code>parent</code>: a list where parent[i] = parent of element i</li>
<li><code>x</code>: an integer (the element to find the root of)</li>
<li><strong>Returns:</strong> the root of x's tree (the group representative)</li>
<li>A root has <code>parent[x] == x</code></li>
</ul>

<code-editor data-id="find-parent"></code-editor>

<h3>Tree Union - Just ONE Pointer Change!</h3>

<pre>
BEFORE union(1, 3):

   0 (root)         2 (root)
   ▲                ▲
   │                │
   1                3


AFTER union(1, 3):
Step 1: find(1) = 0, find(3) = 2
Step 2: Make root 0 point to root 2 (or vice versa)

         2 (root)
        ╱ ╲
       0   3
       ▲
       │
       1

Just ONE change: parent[0] = 2
No need to update elements 0 and 1!
</pre>

<p><strong>Implement union(parent, x, y):</strong></p>
<ul>
<li><code>parent</code>: a list where parent[i] = parent of element i</li>
<li><code>x</code>, <code>y</code>: integers (elements to connect)</li>
<li><strong>Returns:</strong> True if merged, False if already connected</li>
<li><strong>Modifies:</strong> parent list in place</li>
</ul>

<code-editor data-id="union-parent"></code-editor>

<p><strong>Complexity for Approach 3:</strong></p>
<table>
<thead><tr><th>Operation</th><th>Time</th><th>Why?</th></tr></thead>
<tbody>
<tr><td>find(x)</td><td>O(h)</td><td>Walk up tree of height h</td></tr>
<tr><td>union(x,y)</td><td>O(h)</td><td>Two finds + one pointer change</td></tr>
</tbody>
</table>

<p>Union is now just ONE pointer change! But there's a problem...</p>

<h2>The Imbalance Problem</h2>

<p>Our naive union always attaches the first root under the second. Watch what happens step by step:</p>

<pre>
STEP 0: Everyone starts as their own root

   0     1     2     3     4
   ●     ●     ●     ●     ●

parent = [0, 1, 2, 3, 4]
</pre>

<pre>
STEP 1: union(0, 1)
─────────────────────
find(0)=0, find(1)=1 → make parent[0] = 1

BEFORE:              AFTER:
   0     1              1 (root)
   ●     ●              ▲
                        │
                        0

parent = [1, 1, 2, 3, 4]
Tree height: 1
</pre>

<pre>
STEP 2: union(1, 2)
─────────────────────
find(1)=1, find(2)=2 → make parent[1] = 2

BEFORE:              AFTER:
   1 (root)              2 (root)
   ▲           2         ▲
   │           ●         │
   0                     1
                         ▲
                         │
                         0

parent = [1, 2, 2, 3, 4]
Tree height: 2
</pre>

<pre>
STEP 3: union(2, 3)
─────────────────────
find(2)=2, find(3)=3 → make parent[2] = 3

BEFORE:              AFTER:
   2 (root)              3 (root)
   ▲           3         ▲
   │           ●         │
   1                     2
   ▲                     ▲
   │                     │
   0                     1
                         ▲
                         │
                         0

parent = [1, 2, 3, 3, 4]
Tree height: 3
</pre>

<pre>
STEP 4: union(3, 4)
─────────────────────
find(3)=3, find(4)=4 → make parent[3] = 4

BEFORE:                  AFTER:
   3 (root)                  4 (root)
   ▲           4             ▲
   │           ●             │
   2                         3
   ▲                         ▲
   │                         │
   1                         2
   ▲                         ▲
   │                         │
   0                         1
                             ▲
                             │
                             0

parent = [1, 2, 3, 4, 4]
Tree height: 4
</pre>

<p><strong>The Problem:</strong> We kept attaching a BIG tree under a SMALL tree (single node)!</p>

<pre>
find(0) now takes 4 steps: 0 → 1 → 2 → 3 → 4

This is O(n) - no better than the hash map approach!
</pre>

<h2>Solution: Union by Rank - Keep Trees Balanced</h2>

<p><strong>The Fix:</strong> Always attach the <strong>smaller</strong> tree under the <strong>larger</strong> tree!</p>

<p>But how do we know which tree is bigger? We need to <strong>track the height</strong>!</p>

<h3>Tracking Tree Height with a Rank Array</h3>

<pre>
We add a second array: rank[i] = height of tree rooted at i

Initially everyone is their own root with height 0:

parent = [0, 1, 2, 3, 4]    (each points to self)
rank   = [0, 0, 0, 0, 0]    (all trees have height 0)

   0     1     2     3     4
   ●     ●     ●     ●     ●
  r=0   r=0   r=0   r=0   r=0
</pre>

<h3>How Rank Updates During Union</h3>

<pre>
RULE 1: Different ranks → attach smaller under larger
────────────────────────────────────────────────────
rank[root_x] = 1,  rank[root_y] = 0

     x (rank 1)          y (rank 0)
     ▲                   ●
     │
     ...

Result: attach y under x (smaller under larger)
        rank stays the same!

         x (rank 1)
        ╱ ╲
      ...  y
</pre>

<pre>
RULE 2: Same rank → pick one, INCREMENT its rank BY 1
─────────────────────────────────────────────────────
rank[root_x] = 1,  rank[root_y] = 1

     x (rank 1)          y (rank 1)
     ▲                   ▲
     │                   │
     a                   b

Result: attach y under x, x's rank becomes 2

         x (rank 2)    ← increased by 1!
        ╱ ╲
       a   y
           ▲
           │
           b
</pre>

<p><strong>Why increment by 1, not by the other tree's rank?</strong></p>

<pre>
Attaching one root under another adds exactly ONE edge:

         x
        ╱ ╲
       .   .    +    y      →      x
      ╱             ╱ ╲           ╱│╲
     .             .   .         . . y    ← just 1 new edge!
                  ╱                 ╱ ╲
                 .                 .   .
                                  ╱
                                 .

The path from any node in y's subtree to x
is: (old path to y) + 1 edge to x

So height increases by exactly 1, not by rank of y.
</pre>

<pre>
Example with larger trees (both rank 2):

     A (rank 2)          B (rank 2)
    ╱ ╲                  ╱ ╲
   .   .                .   .
  ╱   ╱                ╱
 .   .                .

After attaching B under A:

           A (rank 3)    ← +1, NOT +2!
          ╱│╲
         . . B
            ╱ ╲
           .   .
          ╱
         .

Deepest path: 3 levels (was 2, added 1 edge to B)
</pre>

<h3>Step-by-Step Example with Rank Tracking</h3>

<pre>
WITH UNION BY RANK:
───────────────────

Start:
parent = [0, 1, 2, 3, 4]
rank   = [0, 0, 0, 0, 0]

   0     1     2     3     4
   ●     ●     ●     ●     ●
</pre>

<pre>
union(0, 1): rank[0]=0, rank[1]=0 → SAME! Pick 1, increment rank[1]
─────────────────────────────────────────────────────────────────
parent = [1, 1, 2, 3, 4]
rank   = [0, 1, 0, 0, 0]
              ↑ incremented!
     1 (rank 1)
     ▲
     │
     0
</pre>

<pre>
union(1, 2): rank[1]=1 > rank[2]=0 → attach 2 under 1
───────────────────────────────────────────────────
parent = [1, 1, 1, 3, 4]
rank   = [0, 1, 0, 0, 0]   (no change - different ranks)

       1 (rank 1)
      ╱ ╲
     0   2
</pre>

<pre>
union(2, 3): find(2)=1, rank[1]=1 > rank[3]=0 → attach 3 under 1
─────────────────────────────────────────────────────────────────
parent = [1, 1, 1, 1, 4]
rank   = [0, 1, 0, 0, 0]

         1 (rank 1)
       ╱ │ ╲
      0  2  3
</pre>

<pre>
union(3, 4): find(3)=1, rank[1]=1 > rank[4]=0 → attach 4 under 1
─────────────────────────────────────────────────────────────────
parent = [1, 1, 1, 1, 1]
rank   = [0, 1, 0, 0, 0]

          1 (rank 1)
       ╱╱ │ ╲╲
      0  2  3  4

Final height: 1  (vs height 4 with naive union!)
find(0) = 1 step  (vs 4 steps before!)
</pre>

<p><strong>Implement union(parent, rank, x, y):</strong></p>
<ul>
<li><code>parent</code>: a list where parent[i] = parent of element i</li>
<li><code>rank</code>: a list where rank[i] = height of tree rooted at i</li>
<li><code>x</code>, <code>y</code>: integers (elements to connect)</li>
<li><strong>Returns:</strong> True if merged, False if already connected</li>
<li><strong>Modifies:</strong> parent and rank lists in place</li>
</ul>

<code-editor data-id="union-rank"></code-editor>

<p><strong>Complexity with Union by Rank:</strong></p>
<table>
<thead><tr><th>Operation</th><th>Time</th><th>Why?</th></tr></thead>
<tbody>
<tr><td>find(x)</td><td><strong>O(log n)</strong></td><td>Tree height ≤ log(n)</td></tr>
<tr><td>union(x,y)</td><td><strong>O(log n)</strong></td><td>Two finds + O(1) pointer change</td></tr>
</tbody>
</table>

<p>This is the <strong>key optimization</strong>! We went from O(n) to O(log n) per operation.</p>

<h2>Advanced: Path Compression (Optional)</h2>

<p><em>Note: Union by rank alone gives O(log n). Path compression is an additional optimization that's trickier to understand.</em></p>

<p>Even better: when we do find(), make ALL nodes along the path point directly to the root!</p>

<pre>
BEFORE find(5):
       0 (root)
       ▲
       │
       1
       ▲
       │
       2
       ▲
       │
       3
       ▲
       │
       4
       ▲
       │
       5

AFTER find(5) with path compression:
              0 (root)
        ╱ ╱ ╱ │ ╲ ╲
       1 2 3  4  5

Every node now points directly to root!
Next find(5) = just 1 step!
</pre>

<p><strong>Implement find(parent, x) with path compression:</strong></p>
<ul>
<li><code>parent</code>: a list where parent[i] = parent of element i</li>
<li><code>x</code>: an integer (the element to find the root of)</li>
<li><strong>Returns:</strong> the root of x's tree</li>
<li><strong>Side effect:</strong> updates parent[x] to point directly to the root</li>
<li><em>Hint: Use recursion - it's more elegant!</em></li>
</ul>

<code-editor data-id="find-compression"></code-editor>

<h2>Final Complexity Comparison</h2>

<p>With path compression + union by rank, operations run in <strong>O(α(n))</strong> amortized time, where α is the inverse Ackermann function. For all practical purposes, α(n) ≤ 5.</p>

<table>
<thead><tr><th>Approach</th><th>find()</th><th>union()</th><th>Space</th></tr></thead>
<tbody>
<tr><td>List of Sets</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>Hash Map</td><td><strong>O(1)</strong></td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>Parent Pointers</td><td>O(h)</td><td>O(h)</td><td>O(n)</td></tr>
<tr><td>+ Union by Rank</td><td>O(log n)</td><td>O(log n)</td><td>O(n)</td></tr>
<tr><td>+ Path Compression</td><td><strong>O(α(n)) ≈ O(1)</strong></td><td><strong>O(α(n)) ≈ O(1)</strong></td><td>O(n)</td></tr>
</tbody>
</table>

<p>We went from <strong>O(n²)</strong> for n operations to effectively <strong>O(n)</strong>. That's the power of Union-Find!</p>

<h2>Complete UnionFind Class</h2>

<pre><code>class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]

    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x == root_y:
            return False

        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1

        return True

    def connected(self, x, y):
        return self.find(x) == self.find(y)</code></pre>

<p>Now let's practice with some real problems!</p>
`,
    },

    // ============================================================================
    // PRACTICE EXERCISES
    // ============================================================================

  ...module9UnionFindLessonSmartPracticeExercises,
  ]
};
