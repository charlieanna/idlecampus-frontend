import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { module8GraphsLessonSmartPracticeExercises } from './exercises/moduleGraphsLessonSmartPracticeExercises';

// Helper function to find exercise by ID
const getExercise = (id: string) => {
    const exercise = module8GraphsLessonSmartPracticeExercises.find(ex => ex.id === id);
    if (!exercise) {
        throw new Error(`Exercise not found: ${id}`);
    }
    return exercise;
};

export const module8GraphsLesson: ProgressiveLesson = {
  id: 'graphs-traversals',
    title: 'Module: Graphs & BFS/DFS',
    description: 'Master graph representations, traversal algorithms, topological sort, and shortest paths',
    unlockMode: 'sequential',
    sections: [
        // SECTION 1: Introduction - Graphs, DFS vs BFS, and Representation
        {
            type: 'reading',
            id: 'intro-to-graphs',
            title: 'Introduction to Graphs: When, Why, and How',
            estimatedReadTime: 750,
            autoMarkComplete: false,
            content: `<h1>Introduction to Graphs: When, Why, and How</h1>
<h2>Let&#39;s Start With a Problem</h2>
<p><strong>Problem: Count Friend Groups</strong></p>
<p>You&#39;re given a list of friendships. Find how many separate friend groups exist.</p>
<pre><code>Friendships: [(Alice, Bob), (Bob, Charlie), (David, Eve), (Eve, Frank)]

Who&#39;s friends with whom?
- Alice -- Bob -- Charlie  (Group 1)
- David -- Eve -- Frank    (Group 2)

Answer: 2 friend groups
</code></pre>
<hr>
<h2>Try Brute Force First</h2>
<p>How would you solve this manually?</p>
<pre><code class="language-python">friendships = [(&quot;Alice&quot;, &quot;Bob&quot;), (&quot;Bob&quot;, &quot;Charlie&quot;), (&quot;David&quot;, &quot;Eve&quot;), (&quot;Eve&quot;, &quot;Frank&quot;)]

# Attempt 1: Just count unique people and divide by...?
# Doesn&#39;t work - we need to track CONNECTIONS

# Attempt 2: For each person, check who they&#39;re connected to...
# But how do we track &quot;already visited&quot;?
# And how do we know when a group is complete?
</code></pre>
<p><strong>The bottleneck</strong>: We need to:</p>
<ol>
<li>Track connections between things</li>
<li>Follow those connections to find everything that&#39;s connected</li>
<li>Mark what we&#39;ve already seen</li>
</ol>
<hr>
<h2>The Pattern Emerges</h2>
<p>Draw it out:</p>
<pre><code>    Alice --- Bob --- Charlie

    David --- Eve --- Frank
</code></pre>
<p><strong>Wait... this is just dots connected by lines!</strong></p>
<ul>
<li>Each person = a <strong>dot</strong> (node)</li>
<li>Each friendship = a <strong>line</strong> (edge)</li>
<li>Each friend group = a <strong>connected component</strong></li>
</ul>
<p><strong>This is a GRAPH.</strong> And once you see it as a graph, the solution becomes clear:</p>
<ol>
<li>Start at any unvisited person</li>
<li>Follow all connections to find everyone in that group</li>
<li>That&#39;s one group - repeat for remaining unvisited people</li>
</ol>
<hr>
<h2>Why This Matters for L5/L6 Interviews</h2>
<p>At Google&#39;s L5/L6 level, interviewers expect you to:</p>
<ul>
<li><strong>Quickly recognize</strong> graph patterns in problems (islands, course schedules, clone graph, word ladders)</li>
<li><strong>Choose the right algorithm</strong> (DFS vs BFS vs topological sort) with clear reasoning</li>
<li><strong>Articulate tradeoffs</strong> (adjacency list vs matrix, recursion vs iteration, time/space complexity)</li>
<li><strong>Handle edge cases</strong> proactively (cycles, disconnected components, empty graphs)</li>
</ul>
<p>The friend groups problem maps directly to common Google interview problems:</p>
<ul>
<li><strong>Number of Islands</strong> - same connected components pattern</li>
<li><strong>Course Schedule</strong> - dependencies form a directed graph</li>
<li><strong>Clone Graph</strong> - graph traversal with cycle handling</li>
<li><strong>Word Ladder</strong> - words as nodes, one-letter changes as edges</li>
</ul>
<p>Mastering graph recognition and traversal patterns is essential for senior-level interviews.</p>
<hr>
<h2>When to Think &quot;Graph&quot;</h2>
<p>You just discovered the key insight. Look for problems with:</p>
<table>
<thead>
<tr>
<th>Problem Has...</th>
<th>Graph Translation</th>
</tr>
</thead>
<tbody><tr>
<td>Things that are <strong>connected</strong></td>
<td>Nodes + Edges</td>
</tr>
<tr>
<td>Need to find <strong>groups</strong></td>
<td>Connected components</td>
</tr>
<tr>
<td>Need to find <strong>paths</strong> between things</td>
<td>Graph traversal</td>
</tr>
<tr>
<td>Grid of cells</td>
<td>Each cell = node, neighbors = edges</td>
</tr>
<tr>
<td>Dependencies (A requires B)</td>
<td>Directed edges</td>
</tr>
</tbody></table>
<hr>
<h2>What IS a Graph?</h2>
<p>Now that you&#39;ve discovered it naturally:</p>
<p><strong>Graph = Nodes + Edges</strong></p>
<pre><code>  UNDIRECTED (two-way):        DIRECTED (one-way):

      1 --- 2                      1 ---&gt; 2
      |     |                      |      |
      |     |                      v      v
      3 --- 4                      3 ---&gt; 4

  Friendships are              Prerequisites are
  usually undirected           usually directed
</code></pre>
<hr>
<h2>How to Represent a Graph in Code</h2>
<p><strong>Adjacency List</strong> - a dictionary where each node maps to its neighbors:</p>
<pre><code class="language-python"># Build graph from friendships
friendships = [(&quot;Alice&quot;, &quot;Bob&quot;), (&quot;Bob&quot;, &quot;Charlie&quot;)]

graph = {}
for a, b in friendships:
    if a not in graph: graph[a] = []
    if b not in graph: graph[b] = []
    graph[a].append(b)
    graph[b].append(a)  # undirected = add both ways

# Result:
# {
#     &quot;Alice&quot;: [&quot;Bob&quot;],
#     &quot;Bob&quot;: [&quot;Alice&quot;, &quot;Charlie&quot;],
#     &quot;Charlie&quot;: [&quot;Bob&quot;]
# }
</code></pre>
<hr>
<h2>Graph Representation Tradeoffs (L5/L6 Perspective)</h2>
<p><strong>Senior engineers proactively discuss representation choices.</strong> Here&#39;s what you should know:</p>
<table>
<thead>
<tr>
<th>Aspect</th>
<th>Adjacency List</th>
<th>Adjacency Matrix</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Space</strong></td>
<td>O(V + E)</td>
<td>O(V²)</td>
</tr>
<tr>
<td><strong>Check edge exists</strong></td>
<td>O(degree)</td>
<td>O(1)</td>
</tr>
<tr>
<td><strong>List neighbors</strong></td>
<td>O(degree)</td>
<td>O(V)</td>
</tr>
<tr>
<td><strong>Best for</strong></td>
<td>Sparse graphs (E &lt;&lt; V²)</td>
<td>Dense graphs (E ≈ V²)</td>
</tr>
<tr>
<td><strong>When to use</strong></td>
<td>Most interview problems</td>
<td>Need fast edge lookups</td>
</tr>
</tbody></table>
<p><strong>For interviews:</strong> Adjacency list is almost always the right choice. It&#39;s space-efficient and matches how most problems are presented.</p>
<p><strong>DFS/BFS Complexity:</strong> Both algorithms run in <strong>O(V + E)</strong> time with adjacency list representation, where V = vertices and E = edges. Space is O(V) for visited tracking.</p>
<p><strong>Recursion vs Iteration:</strong> </p>
<ul>
<li><strong>Recursive DFS</strong> is cleaner but risks stack overflow for deep graphs (O(V) stack depth)</li>
<li><strong>Iterative DFS</strong> (using explicit stack) avoids stack overflow but is more verbose</li>
<li><strong>For interviews:</strong> Recursive is fine unless explicitly asked about stack depth. Mention the tradeoff proactively to show senior-level awareness.</li>
</ul>
<hr>
<h2>The Two Ways to Explore a Graph</h2>
<p>Now we need to &quot;follow all connections&quot; - there are two approaches:</p>
<ol>
<li><p><strong>DFS (Depth-First Search)</strong> - Go as deep as possible, then backtrack</p>
<ul>
<li>Like exploring a maze by always turning left</li>
<li>Good for: finding ANY path, counting components, exploring all possibilities</li>
</ul>
</li>
<li><p><strong>BFS (Breadth-First Search)</strong> - Explore level by level</p>
<ul>
<li>Like ripples spreading from a stone in water</li>
<li>Good for: finding SHORTEST path</li>
</ul>
</li>
</ol>
<hr>
<h2>DFS vs BFS: Which One Do I Use?</h2>
<p>Once you&#39;ve identified a graph problem, you have ONE key decision:</p>
<pre><code>       Does the problem ask for SHORTEST/MINIMUM?
                    |
          +---------+---------+
          |                   |
         YES                  NO
          |                   |
        Use BFS           Use DFS
          |                   |
    &quot;minimum steps&quot;      &quot;count groups&quot;
    &quot;shortest path&quot;      &quot;find any path&quot;
    &quot;fewest moves&quot;       &quot;explore all&quot;
</code></pre>
<h3>Why BFS for Shortest Path?</h3>
<p>BFS explores <strong>level by level</strong> - like ripples in water:</p>
<pre><code>        Start
          |
    Level 1: [A, B, C]    ← 1 step away
          |
    Level 2: [D, E, F]    ← 2 steps away
          |
    Level 3: [G, H]       ← 3 steps away
</code></pre>
<p>The <strong>first time</strong> you reach a node, you&#39;ve found the <strong>shortest path</strong> to it!</p>
<h3>Why DFS for Everything Else?</h3>
<p>DFS is <strong>simpler</strong> - just recursion:</p>
<pre><code class="language-python">def dfs(node, visited):
    if node in visited:
        return
    visited.add(node)
    for neighbor in graph[node]:
        dfs(neighbor, visited)
</code></pre>
<p>Good for:</p>
<ul>
<li>Counting connected components (friend groups, islands)</li>
<li>Finding ANY path (not necessarily shortest)</li>
<li>Exploring all possibilities</li>
<li>Detecting cycles</li>
</ul>
<h3>Quick Reference</h3>
<table>
<thead>
<tr>
<th>Problem Type</th>
<th>Use</th>
<th>Why</th>
</tr>
</thead>
<tbody><tr>
<td>&quot;Count islands&quot;</td>
<td>DFS</td>
<td>Just need to explore all, order doesn&#39;t matter</td>
</tr>
<tr>
<td>&quot;Shortest path in maze&quot;</td>
<td>BFS</td>
<td>Need MINIMUM steps</td>
</tr>
<tr>
<td>&quot;Can I reach from A to B?&quot;</td>
<td>DFS</td>
<td>Just need yes/no, not shortest</td>
</tr>
<tr>
<td>&quot;Minimum moves in game&quot;</td>
<td>BFS</td>
<td>Need FEWEST moves</td>
</tr>
<tr>
<td>&quot;Find all connected nodes&quot;</td>
<td>DFS</td>
<td>Just exploring, order doesn&#39;t matter</td>
</tr>
<tr>
<td>&quot;Level order traversal&quot;</td>
<td>BFS</td>
<td>Need level-by-level order</td>
</tr>
</tbody></table>
<hr>
<h2>The Templates You&#39;ll Learn</h2>
<p>We&#39;ll use 4 templates that solve most problems:</p>
<ol>
<li><strong>DFS on Graph</strong> - For adjacency list problems</li>
<li><strong>DFS on Grid</strong> - For 2D grid problems (islands, etc.)</li>
<li><strong>BFS</strong> - For shortest path problems</li>
<li><strong>Multi-Source BFS</strong> - When you have multiple starting points</li>
</ol>
<p>The key insight: <strong>90% of the code stays the same</strong>. You only change:</p>
<ul>
<li>What counts as &quot;valid&quot; to visit</li>
<li>What to do when you visit a node</li>
<li>What to return</li>
</ul>
<p>Now let&#39;s see the templates and start coding!</p>
<hr>
<h2>The 4 Graph Templates</h2>
<p><strong>Copy these. Memorize these. They solve 80% of graph problems!</strong></p>
<hr>
<h2>Template 1: DFS on Graph (Recursive)</h2>
<p>Use when: Exploring a graph defined by adjacency list</p>
<pre><code class="language-python"># ═══════════════════════════════════════════════════════════
# TEMPLATE 1: DFS on Graph (Recursive)
# ═══════════════════════════════════════════════════════════
def dfs(graph, node, visited):
    if node in visited:
        return
    visited.add(node)

    # ✏️ PROCESS NODE HERE
    # Example: print(node), count += 1, etc.

    for neighbor in graph[node]:
        dfs(graph, neighbor, visited)

# Usage:
visited = set()
dfs(graph, start_node, visited)
</code></pre>
<p><strong>What to customize:</strong></p>
<ul>
<li>Line with ✏️ - Add your processing logic</li>
</ul>
<blockquote>
<p><strong>Senior Lens:</strong> Proactively mention invariants: &quot;visited set ensures we process each node exactly once&quot; and failure modes: &quot;handles disconnected components by checking all nodes, not just starting from one.&quot;</p>
</blockquote>
<hr>
<h2>Template 2: DFS on Grid</h2>
<p>Use when: 2D grid problems (islands, flood fill, etc.)</p>
<pre><code class="language-python"># ═══════════════════════════════════════════════════════════
# TEMPLATE 2: DFS on Grid
# ═══════════════════════════════════════════════════════════
def dfs_grid(grid, row, col):
    # Boundary check
    if row &lt; 0 or row &gt;= len(grid) or col &lt; 0 or col &gt;= len(grid[0]):
        return
    # ✏️ INVALID CELL CHECK (customize this!)
    if grid[row][col] == 0:  # Example: 0 = water
        return

    # ✏️ MARK AS VISITED (customize this!)
    grid[row][col] = 0  # Example: change to 0

    # ✏️ PROCESS CELL HERE (optional)

    # Explore 4 directions
    dfs_grid(grid, row + 1, col)  # Down
    dfs_grid(grid, row - 1, col)  # Up
    dfs_grid(grid, row, col + 1)  # Right
    dfs_grid(grid, row, col - 1)  # Left

# Usage:
for r in range(len(grid)):
    for c in range(len(grid[0])):
        if grid[r][c] == 1:  # Found unvisited land
            dfs_grid(grid, r, c)
            count += 1  # One island found
</code></pre>
<p><strong>What to customize:</strong></p>
<ul>
<li>Invalid cell check (what makes a cell &quot;water&quot;?)</li>
<li>Mark as visited (change value or use visited set)</li>
<li>Process cell (return area, collect values, etc.)</li>
</ul>
<blockquote>
<p><strong>Senior Lens:</strong> When modifying the grid in-place (sinking islands), mention the tradeoff: &quot;In-place modification saves O(mn) space but mutates input. For production, consider using a visited set if input immutability matters.&quot;</p>
</blockquote>
<hr>
<h2>Template 3: BFS (Shortest Path)</h2>
<p>Use when: Finding shortest/minimum distance</p>
<pre><code class="language-python"># ═══════════════════════════════════════════════════════════
# TEMPLATE 3: BFS (Shortest Path)
# ═══════════════════════════════════════════════════════════
from collections import deque

def bfs(graph, start, target):
    queue = deque([(start, 0)])  # (node, distance)
    visited = {start}

    while queue:
        node, dist = queue.popleft()

        # ✏️ CHECK IF GOAL REACHED
        if node == target:
            return dist

        # ✏️ GET NEIGHBORS (customize for your problem)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))

    return -1  # Goal not found
</code></pre>
<p><strong>What to customize:</strong></p>
<ul>
<li>Goal condition (when to return?)</li>
<li>Getting neighbors (adjacency list, grid directions, word transformations)</li>
</ul>
<blockquote>
<p><strong>Senior Lens:</strong> BFS guarantees shortest path only for <strong>unweighted</strong> graphs. For weighted graphs, mention Dijkstra&#39;s algorithm. The key insight: BFS explores by distance levels, so first visit = shortest path in unweighted case.</p>
</blockquote>
<hr>
<h2>Template 4: Multi-Source BFS</h2>
<p>Use when: BFS starting from multiple points (rotting oranges, walls &amp; gates, etc.)</p>
<pre><code class="language-python"># ═══════════════════════════════════════════════════════════
# TEMPLATE 4: Multi-Source BFS
# ═══════════════════════════════════════════════════════════
from collections import deque

def multi_source_bfs(grid, sources):
    queue = deque()
    visited = set()

    # ✏️ ADD ALL SOURCES TO QUEUE AT ONCE
    for r, c in sources:
        queue.append((r, c, 0))  # (row, col, distance)
        visited.add((r, c))

    while queue:
        row, col, dist = queue.popleft()

        # ✏️ PROCESS CELL HERE
        # Example: grid[row][col] = dist

        # Explore 4 directions
        for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
            nr, nc = row + dr, col + dc
            if 0 &lt;= nr &lt; len(grid) and 0 &lt;= nc &lt; len(grid[0]):
                if (nr, nc) not in visited:
                    # ✏️ ADD CONDITION IF NEEDED
                    visited.add((nr, nc))
                    queue.append((nr, nc, dist + 1))

    return grid  # or whatever result you need
</code></pre>
<p><strong>What to customize:</strong></p>
<ul>
<li>Finding sources (all 0s? all rotten oranges? all gates?)</li>
<li>Processing cell (update distance, count, etc.)</li>
<li>Neighbor condition (walls? valid cells?)</li>
</ul>
<blockquote>
<p><strong>Senior Lens:</strong> Multi-source BFS maintains the same O(V + E) complexity as single-source BFS. The key insight: all sources start at distance 0, so the algorithm naturally finds minimum distance from any source. This pattern scales well - mention how it would handle 10^6 sources efficiently.</p>
</blockquote>
<hr>
<h2>Cheat Sheet Summary</h2>
<table>
<thead>
<tr>
<th>Template</th>
<th>When to Use</th>
<th>Key Feature</th>
</tr>
</thead>
<tbody><tr>
<td>DFS Graph</td>
<td>Adjacency list traversal</td>
<td><code>visited.add(node)</code></td>
</tr>
<tr>
<td>DFS Grid</td>
<td>2D grid exploration</td>
<td>Boundary check + 4 directions</td>
</tr>
<tr>
<td>BFS</td>
<td>Shortest path needed</td>
<td>Queue + distance tracking</td>
</tr>
<tr>
<td>Multi-Source BFS</td>
<td>Multiple start points</td>
<td>All sources in queue initially</td>
</tr>
</tbody></table>
<hr>
<h2>The 10% You Change</h2>
<pre><code>┌─────────────────────────────────────────────┐
│  TEMPLATE (90% same across all problems)    │
│  ┌───────────────────────────────────────┐  │
│  │  ✏️ CUSTOMIZE HERE (10%)              │  │
│  │  - What&#39;s a valid cell/node?          │  │
│  │  - How to mark visited?               │  │
│  │  - What to return/collect?            │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
</code></pre>
<p>Now let&#39;s apply these templates to real problems!</p>
<hr>
<h2>Beyond Unweighted BFS: When Weights Matter</h2>
<p><strong>Senior engineers know when BFS isn&#39;t enough.</strong> BFS finds shortest path in <strong>unweighted</strong> graphs (all edges have weight 1). But what about weighted graphs?</p>
<pre><code>Unweighted: A --1-- B --1-- C  → BFS: shortest path = 2 edges
Weighted:   A --5-- B --1-- C  → BFS might find A→B→C (cost 6)
                                          but A→C direct (cost 3) is shorter!
</code></pre>
<p><strong>For weighted graphs:</strong> Use <strong>Dijkstra&#39;s algorithm</strong> (priority queue instead of regular queue). The key insight: BFS processes nodes in order of <strong>hop count</strong>, but Dijkstra processes in order of <strong>cumulative cost</strong>.</p>
<p><strong>When to mention this:</strong> If an interviewer asks about shortest path and edges have weights, proactively say: &quot;BFS works for unweighted graphs. For weighted graphs, I&#39;d use Dijkstra&#39;s algorithm with a min-heap.&quot;</p>
<p>This shows you understand the limitations of your chosen algorithm - a key L5/L6 signal.</p>
<hr>
<h2>Senior Reflection Prompts</h2>
<p><strong>L5/L6 engineers think beyond the immediate problem.</strong> Consider these questions:</p>
<p><strong>🔍 Scale &amp; Performance:</strong></p>
<ul>
<li>How would your solution change if the graph had 10^7 nodes? (Consider iterative DFS, external memory, distributed processing)</li>
<li>What if edges arrive as a stream? (Incremental graph construction, online algorithms)</li>
</ul>
<p><strong>🏗️ Design &amp; Architecture:</strong></p>
<ul>
<li>How would you design a reusable graph traversal library API? (What abstractions? How to handle different graph types?)</li>
<li>If this graph represents a social network, how would you handle privacy constraints? (Partial graph access, query limitations)</li>
</ul>
<p><strong>🎯 Tradeoffs &amp; Alternatives:</strong></p>
<ul>
<li>When would Union-Find be better than DFS for connected components? (Dynamic connectivity, multiple queries)</li>
<li>How does your space complexity change if you can&#39;t modify the input? (Visited set overhead)</li>
</ul>
<p>Thinking through these scenarios demonstrates the systems thinking expected at L5/L6 level.</p>
`
        },

        // SECTION 3: DFS on Graphs Explained
        {
            type: 'reading',
            id: 'dfs-on-graphs',
            title: 'DFS on Graphs Explained',
            estimatedReadTime: 240,
            autoMarkComplete: false,
            content: `<h1>Depth-First Search (DFS) on Graphs</h1>
<h2>DFS on Trees vs Graphs</h2>
<h3>Trees (No cycle handling needed)</h3>
<pre><code class="language-python">def dfs(node):
    if not node:
        return
    process(node)
    dfs(node.left)
    dfs(node.right)
</code></pre>
<h3>Graphs (Need visited tracking!)</h3>
<pre><code class="language-python">def dfs(node, visited):
    if node in visited:
        return  # Prevent cycles!
    visited.add(node)

    process(node)

    for neighbor in node.neighbors:
        dfs(neighbor, visited)
</code></pre>
<p><strong>Key Difference:</strong> Graphs can have cycles, so we need a <code>visited</code> set to avoid infinite loops!</p>
<hr>
<h2>DFS Pattern for Graphs</h2>
<pre><code class="language-python">def dfs_graph(graph, start):
    visited = set()

    def dfs(node):
        if node in visited:
            return
        visited.add(node)

        # Process node
        print(node)

        # Visit neighbors
        for neighbor in graph[node]:
            dfs(neighbor)

    dfs(start)
    return visited
</code></pre>
<p><strong>Time:</strong> O(V + E) - visit each vertex and edge once
<strong>Space:</strong> O(V) - for visited set + recursion stack</p>
<hr>
<h2>Iterative DFS (Using Stack)</h2>
<pre><code class="language-python">def dfs_iterative(graph, start):
    visited = set()
    stack = [start]

    while stack:
        node = stack.pop()

        if node in visited:
            continue
        visited.add(node)

        # Process node
        print(node)

        # Add neighbors to stack
        for neighbor in graph[node]:
            if neighbor not in visited:
                stack.append(neighbor)

    return visited
</code></pre>
<hr>
<h2>When to Use DFS</h2>
<p>✅ Finding any path between two nodes
✅ Detecting cycles
✅ Topological sorting
✅ Connected components
✅ Maze solving</p>
<p>❌ Finding shortest path (use BFS instead)</p>
`
        },

        // DFS Exercises: Grid DFS, Clone Graph, Cycle Detection, Topological Sort
        getExercise('exercise-number-of-islands'),
        getExercise('exercise-clone-graph'),
        getExercise('exercise-course-schedule'),
        getExercise('exercise-course-schedule-ii'),

        // SECTION: BFS Introduction
        {
            type: 'reading',
            id: 'bfs-on-graphs',
            title: 'BFS: The Shortest Path Algorithm',
            estimatedReadTime: 240,
            autoMarkComplete: false,
            content: `<h1>BFS: Breadth-First Search</h1>
<h2>When to Use BFS</h2>
<p>✅ <strong>Finding shortest path</strong> (unweighted graph)
✅ Level-order traversal
✅ Minimum steps problems
✅ Multi-source problems</p>
<hr>
<h2>BFS Pattern</h2>
<pre><code class="language-python">from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])

    while queue:
        node = queue.popleft()

        # Process node
        print(node)

        # Add unvisited neighbors
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return visited
</code></pre>
<p><strong>Time:</strong> O(V + E)
<strong>Space:</strong> O(V)</p>
<hr>
<h2>BFS with Distance Tracking</h2>
<pre><code class="language-python">def bfs_distance(graph, start, end):
    visited = set([start])
    queue = deque([(start, 0)])  # (node, distance)

    while queue:
        node, dist = queue.popleft()

        if node == end:
            return dist

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))

    return -1  # No path
</code></pre>
<hr>
<h2>Key Insight</h2>
<p><strong>BFS visits nodes in order of distance from start.</strong></p>
<p>Level 0: Start node
Level 1: Neighbors of start
Level 2: Neighbors of level 1
...</p>
<p>This guarantees <strong>shortest path</strong> in unweighted graphs!</p>
<hr>
<h2>BFS vs DFS</h2>
<table>
<thead>
<tr>
<th>Aspect</th>
<th>DFS</th>
<th>BFS</th>
</tr>
</thead>
<tbody><tr>
<td>Data Structure</td>
<td>Stack</td>
<td>Queue</td>
</tr>
<tr>
<td>Space</td>
<td>O(h) depth</td>
<td>O(w) width</td>
</tr>
<tr>
<td>Shortest path</td>
<td>No</td>
<td>Yes (unweighted)</td>
</tr>
<tr>
<td>When to use</td>
<td>Paths, cycles</td>
<td>Shortest path, levels</td>
</tr>
</tbody></table>
`
        },

        // BFS Exercises: Multi-Source BFS, Word Ladder
        getExercise('exercise-rotting-oranges'),
        getExercise('exercise-word-ladder'),

        // SECTION: Topological Sort (Code Reuse from Cycle Detection)
        {
            type: 'reading',
            id: 'topological-sort-code-reuse',
            title: 'Topological Sort: Extending Cycle Detection',
            estimatedReadTime: 300,
            autoMarkComplete: false,
            content: `<h1>Topological Sort: You Already Know It!</h1>
<h2>The Insight</h2>
<p>You just learned 3-color DFS for cycle detection. <strong>Topological sort is the same code with ONE line added.</strong></p>
<hr>
<h2>Side-by-Side Comparison</h2>
<pre><code class="language-python"># Course Schedule I (Cycle Detection)         # Course Schedule II (Topological Sort)
def hasCycle(course):                          def dfs(course):
    if state[course] == VISITING:                  if state[course] == VISITING:
        return True  # Cycle!                          return True  # Cycle!
    if state[course] == VISITED:                   if state[course] == VISITED:
        return False                                   return False

    state[course] = VISITING                       state[course] = VISITING

    for next_course in graph[course]:              for next_course in graph[course]:
        if hasCycle(next_course):                      if dfs(next_course):
            return True                                    return True

    state[course] = VISITED                        state[course] = VISITED
    return False                                   result.append(course)  # ← ONLY ADDITION!
                                                   return False
</code></pre>
<p><strong>The difference?</strong> Just <code>result.append(course)</code> after marking VISITED!</p>
<hr>
<h2>Why Post-Order Works</h2>
<p>When we mark a node as VISITED, <strong>all its dependencies have already been processed</strong>:</p>
<pre><code>Course 0 depends on: [1, 2]

DFS exploration:
1. Visit 0, mark VISITING
2. Go to 1, process it fully, mark VISITED, add to result
3. Go to 2, process it fully, mark VISITED, add to result
4. Back to 0, mark VISITED, add to result

Result: [1, 2, 0] → Reversed: [0, 2, 1] ✓
Prerequisites come BEFORE dependent courses!
</code></pre>
<hr>
<h2>The Coloring Pattern Family</h2>
<table>
<thead>
<tr>
<th>Algorithm</th>
<th>Colors Used</th>
<th>What We Detect</th>
</tr>
</thead>
<tbody><tr>
<td>Cycle Detection</td>
<td>3 (unvisited/visiting/visited)</td>
<td>Is there a back edge?</td>
</tr>
<tr>
<td>Topological Sort</td>
<td>3 (same as above)</td>
<td>Same + record post-order</td>
</tr>
<tr>
<td>Bipartite Check</td>
<td>2 (color 0/color 1)</td>
<td>Adjacent nodes same color?</td>
</tr>
</tbody></table>
<p><strong>The unifying idea:</strong> Assign states/colors to nodes during traversal, check for conflicts.</p>
<hr>
<h2>Key Takeaway</h2>
<blockquote>
<p>&quot;You already know cycle detection. Topological sort is the same code with one line added. Bipartite checking uses the same coloring idea with 2 colors instead of 3.&quot;</p>
</blockquote>
<p>You&#39;re not learning new algorithms - you&#39;re extending what you already know!</p>
`
        },

        // Topological Sort & Bipartite Exercises
        getExercise('exercise-alien-dictionary'),
        getExercise('exercise-is-graph-bipartite'),

        // SECTION: Dijkstra's Algorithm
        {
            type: 'reading',
            id: 'dijkstra-algorithm',
            title: 'Dijkstra\'s Algorithm (Weighted Paths)',
            estimatedReadTime: 600,
            autoMarkComplete: false,
            content: `<h1>Dijkstra&#39;s Algorithm: Shortest Weighted Path</h1>
<h2>BFS vs Dijkstra</h2>
<table>
<thead>
<tr>
<th>Algorithm</th>
<th>Graph Type</th>
<th>Logic</th>
<th>Time Complexity</th>
</tr>
</thead>
<tbody><tr>
<td><strong>BFS</strong></td>
<td>Unweighted</td>
<td>Examines neighbors layer by layer</td>
<td>O(V + E)</td>
</tr>
<tr>
<td><strong>Dijkstra</strong></td>
<td>Weighted (non-negative)</td>
<td>Explores &quot;cheapest&quot; node next</td>
<td>O(E log V)</td>
</tr>
</tbody></table>
<p><strong>Key Insight:</strong> BFS assumes every edge costs 1. Dijkstra handles varying costs by using a <strong>Min-Heap (Priority Queue)</strong> to always process the closest node next.</p>
<hr>
<h2>Dijkstra&#39;s Template</h2>
<pre><code class="language-python">import heapq

def dijkstra(graph, start):
    # Min-heap stores (current_dist, node)
    # Always process node with smallest distance first
    pq = [(0, start)]
    
    # Track minimum distance to each node
    # Initialize with infinity
    min_dist = {node: float(&#39;inf&#39;) for node in graph}
    min_dist[start] = 0
    
    while pq:
        d, node = heapq.heappop(pq)
        
        # Optimization: If we found a shorter path strictly before, skip
        if d &gt; min_dist[node]:
            continue
            
        # Explore neighbors
        for neighbor, weight in graph[node]:
            distance = d + weight
            
            # Found a better path?
            if distance &lt; min_dist[neighbor]:
                min_dist[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
                
    return min_dist
</code></pre>
<p><strong>Why it works:</strong>
By always expanding the &quot;cheapest&quot; node, we guarantee that when we pop a node from the heap, we&#39;ve found the shortest path to it!</p>
<hr>
<h2>Complexity Analysis</h2>
<ul>
<li><strong>Time:</strong> O(E log V)<ul>
<li>Each edge is added to heap at most once.</li>
<li>Heap operations take O(log V).</li>
</ul>
</li>
<li><strong>Space:</strong> O(V + E) for storing graph and heap.</li>
</ul>
<hr>
<h2>When to Use</h2>
<p>✅ Find shortest path in <strong>weighted</strong> graph
✅ &quot;Cheapest&quot; flight/network delay/min cost
❌ Graph has <strong>negative</strong> weights (Use Bellman-Ford)
❌ Longest path (NP-Hard for general graphs)</p>
`,
        },

        // Dijkstra Exercises: Network Delay, Cheapest Flights
        getExercise('exercise-network-delay-time'),
        getExercise('exercise-cheapest-flights-k-stops'),

        // SECTION: Module Complete
        {
            type: 'reading',
            id: 'module8-complete',
            title: 'Module Complete!',
            estimatedReadTime: 180,
            autoMarkComplete: false,
            content: `<h1>Congratulations! You&#39;ve Conquered Graphs!</h1>
<h2>The Secret You Now Know</h2>
<p>Remember when graphs seemed scary? Now you know the truth:</p>
<p><strong>Most graph problems are variations of 4 templates you already mastered!</strong></p>
<p>When you see a new problem, just ask:</p>
<ol>
<li>Is this a graph? (nodes + connections)</li>
<li>DFS or BFS? (explore all vs shortest path)</li>
<li>Which template fits?</li>
<li>What&#39;s the small twist?</li>
</ol>
<hr>
<h2>What You&#39;ve Mastered</h2>
<p>✅ <strong>Recognized</strong> graph problems in disguise (grids, words, dependencies)
✅ <strong>Applied DFS</strong> for exploration, counting, and cycle detection
✅ <strong>Applied BFS</strong> for shortest paths and minimum steps
✅ <strong>Used Multi-Source BFS</strong> for simultaneous expansion
✅ <strong>Implemented Topological Sort</strong> for ordering dependencies
✅ <strong>Built graphs</strong> from problem descriptions</p>
<hr>
<h2>The 4 Templates You Now Own</h2>
<table>
<thead>
<tr>
<th>Template</th>
<th>When to Use</th>
<th>Problems You Solved</th>
</tr>
</thead>
<tbody><tr>
<td>DFS Graph</td>
<td>Adjacency list traversal</td>
<td>Clone Graph, Course Schedule</td>
</tr>
<tr>
<td>DFS Grid</td>
<td>2D grid exploration</td>
<td>Islands, Max Area, Pacific Atlantic</td>
</tr>
<tr>
<td>BFS</td>
<td>Shortest path</td>
<td>Binary Matrix, Word Ladder</td>
</tr>
<tr>
<td>Multi-Source BFS</td>
<td>Multiple start points</td>
<td>Rotting Oranges, 01 Matrix, Walls &amp; Gates</td>
</tr>
</tbody></table>
<hr>
<h2>12 Problems Conquered!</h2>
<pre><code>Easy wins:           Building confidence:        Boss fights:
- Clone Graph        - Number of Islands         - Word Ladder
- Max Area           - Rotting Oranges          - Alien Dictionary
                     - 01 Matrix
                     - Course Schedule I &amp; II
                     - Pacific Atlantic
                     - Shortest Path Binary
                     - Walls and Gates
</code></pre>
<hr>
<h2>Your New Superpower</h2>
<pre><code>┌─────────────────────────────────────────────┐
│  BEFORE: &quot;Graph problems are so hard!&quot;      │
│                                             │
│  AFTER:  &quot;Oh, this is just Template 2       │
│          with a small tweak!&quot;               │
└─────────────────────────────────────────────┘
</code></pre>
<hr>
<h2>You&#39;re Ready for Interviews!</h2>
<p>Graph problems are now your <strong>strength</strong>, not your weakness.</p>
<p>The patterns you learned here cover 80% of graph questions you&#39;ll see in interviews.</p>
<p>When a graph problem comes up, you&#39;ll think:</p>
<blockquote>
<p>&quot;I&#39;ve seen this pattern before. I know exactly what to do.&quot;</p>
</blockquote>
<p><strong>That&#39;s the confidence of someone who truly understands graphs!</strong></p>
<hr>
<h2>Next Module</h2>
<p><strong>Module 8.5: Union-Find (Disjoint Set Union)</strong> - Learn efficient connected component tracking!</p>
`
        },

        // SMART PRACTICE EXERCISES - All practice problems for this module
        ...module8GraphsLessonSmartPracticeExercises,
    ],
};
