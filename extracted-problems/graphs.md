# GRAPHS Problems

Total Problems: 30

---

## 1. Number of Islands (BFS)

**Difficulty:** medium
**Concept:** graphs
**Family:** graphs:bfs-islands

### Description

Given a 2D grid map of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.

🎯 KEY INSIGHT: Each BFS from an unvisited land cell finds one complete island. Mark visited cells to avoid recounting.

💡 APPROACH: Iterate through grid. When you find a '1', increment island count and BFS to mark all connected land as visited.

### Key Insight

BFS from each unvisited '1' marks entire island. Number of BFS calls = number of islands.

### Examples

**Example 1:**
- Input: grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
- Output: 3
- Explanation: 3 distinct islands in the grid

### Hints

1. Initialize island count to 0
2. Scan grid for unvisited land ('1')
3. When finding '1', increment count and BFS from there
4. BFS marks all connected land as visited (change to '0')
5. Each BFS represents one complete island

### Starter Code

### Solution

### Test Cases

**Test 1:** 3 separate islands
- Input: "[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]"
- Expected: "3"

**Test 2:** All land connected as one island
- Input: "[[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]"
- Expected: "1"

**Test 3:** PERFORMANCE: 100x100 grid (10K cells) - Must use O(rows*cols) BFS/DFS with proper visited tracking
- Input: "[[str((i+j) % 2) for j in range(100)] for i in range(100)]"
- Expected: "5000"

---

## 2. Clone Graph

**Difficulty:** medium
**Concept:** graphs
**Family:** graphs:clone-bfs

### Description

Given a reference to a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node contains a value and a list of neighbors.

🎯 KEY INSIGHT: Use a map to track old_node → new_node. BFS through graph, creating clones and connecting them.

💡 APPROACH: BFS with visited map (old → new). For each node, create clone if not exists, then clone all neighbors.

### Key Insight

Map old nodes to new clones. BFS ensures all nodes and edges are copied exactly once.

### Examples

**Example 1:**
- Input: adjList = [[2,4],[1,3],[2,4],[1,3]]
- Output: [[2,4],[1,3],[2,4],[1,3]]
- Explanation: Graph with 4 nodes, each connected to 2 neighbors

### Hints

1. Use a dictionary to map original nodes to clones
2. BFS through original graph
3. For each node, create clone if doesn't exist
4. Add cloned neighbors to clone's neighbor list
5. Return clone of starting node from map

### Starter Code

### Solution

### Test Cases

**Test 1:** 4-node graph
- Input: "[[2,4],[1,3],[2,4],[1,3]]"
- Expected: "[[2,4],[1,3],[2,4],[1,3]]"

**Test 2:** Single node
- Input: "[[]]"
- Expected: "[[]]"

**Test 3:** Empty graph
- Input: "[]"
- Expected: "[]"

---

## 3. Pacific Atlantic Water Flow

**Difficulty:** medium
**Concept:** graphs
**Family:** graphs:dfs-multi-source

### Description

Given m x n matrix of heights, find all cells where water can flow to both Pacific (top/left) and Atlantic (bottom/right) oceans. Water flows from higher or equal height cells.

🎯 KEY INSIGHT: Reverse thinking! Start from oceans, flow upward. Find cells reachable from both oceans.

💡 APPROACH: DFS from Pacific edges, mark reachable. DFS from Atlantic edges, mark reachable. Return intersection.

### Key Insight

Flow from oceans upward (reverse flow). Cells reachable by both = answer.

### Examples

**Example 1:**
- Input: heights = [
  [1,2,2,3,5],
  [3,2,3,4,4],
  [2,4,5,3,1],
  [6,7,1,4,5],
  [5,1,1,2,4]
]
- Output: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
- Explanation: These cells can flow to both oceans

### Hints

1. Don't try to flow from each cell to oceans!
2. Reverse the problem: flow FROM oceans
3. DFS from top/left edges (Pacific)
4. DFS from bottom/right edges (Atlantic)
5. Return intersection of both sets
6. Flow upward: neighbor height >= current height

### Starter Code

### Solution

### Test Cases

**Test 1:** Multiple cells reach both oceans
- Input: "[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]"
- Expected: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]"

**Test 2:** Single cell reaches both
- Input: "[[1]]"
- Expected: "[[0,0]]"

---

## 4. Course Schedule (Cycle Detection)

**Difficulty:** medium
**Concept:** graphs
**Family:** graphs:topo-sort

### Description

Given numCourses and prerequisites array [a,b] meaning "take b before a", determine if you can finish all courses. Return false if there's a circular dependency.

🎯 KEY INSIGHT: This is cycle detection in directed graph! Use DFS with 3 states: unvisited, visiting, visited.

💡 APPROACH: DFS each course. If you revisit a course in current path (visiting state), cycle found!

### Key Insight

Cycle detection: track 'visiting' state. Revisiting a 'visiting' node = cycle.

### Examples

**Example 1:**
- Input: numCourses = 2, prerequisites = [[1,0]]
- Output: True
- Explanation: Take course 0, then course 1

**Example 2:**
- Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
- Output: False
- Explanation: Circular dependency: 1→0→1

### Hints

1. Build adjacency list: course → prerequisites
2. Track 3 states: unvisited (0), visiting (1), visited (2)
3. DFS from each course
4. If you reach a 'visiting' node, cycle found!
5. Mark as 'visited' after processing all prerequisites
6. If no cycles found, return True

### Starter Code

### Solution

### Test Cases

**Test 1:** Linear dependency
- Input: "numCourses=2, prerequisites=[[1,0]]"
- Expected: "True"

**Test 2:** Circular dependency
- Input: "numCourses=2, prerequisites=[[1,0],[0,1]]"
- Expected: "False"

**Test 3:** Chain: 0→1→2
- Input: "numCourses=3, prerequisites=[[1,0],[2,1]]"
- Expected: "True"

**Test 4:** PERFORMANCE: 5K courses in linear chain - Must use O(V+E) DFS with state tracking, not exponential
- Input: "numCourses=5000, prerequisites=[[i+1, i] for i in range(4999)]"
- Expected: "True"

---

## 5. Course Schedule II (Topological Sort)

**Difficulty:** medium
**Concept:** graphs
**Family:** graphs:topo-sort

### Description

Return an ordering of courses to take, respecting prerequisites. Return empty array if impossible (cycle exists).

🎯 KEY INSIGHT: Topological sort! Use DFS postorder (Kahn's algorithm alternative): add course to result AFTER visiting all prerequisites.

💡 APPROACH: DFS with cycle detection. Add course to result stack after processing prerequisites. Reverse at end.

### Key Insight

DFS postorder: visit prerequisites first, add current course after. Reverse = topological order.

### Examples

**Example 1:**
- Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
- Output: [0,1,2,3]
- Explanation: Take 0 first, then 1 and 2, finally 3

### Hints

1. Similar to cycle detection, but collect ordering
2. DFS with 3 states
3. Add course to result AFTER visiting prerequisites
4. This gives reverse topological order
5. No need to reverse - our approach gives correct order
6. Return empty array if cycle detected

### Starter Code

### Solution

### Test Cases

**Test 1:** Valid ordering
- Input: "numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]"
- Expected: "[0,1,2,3]"

**Test 2:** Cycle - impossible
- Input: "numCourses=2, prerequisites=[[1,0],[0,1]]"
- Expected: "[]"

**Test 3:** Single course
- Input: "numCourses=1, prerequisites=[]"
- Expected: "[0]"

---

## 6. Number of Connected Components

**Difficulty:** medium
**Concept:** graphs

### Description

Given n nodes (0 to n-1) and edges, count number of connected components in undirected graph.

🎯 KEY INSIGHT: Perfect for Union-Find! Start with n components. Each union decreases count by 1.

💡 APPROACH: Initialize n separate components. For each edge, union the nodes. Count remaining roots.

### Key Insight

Union-Find: merge connected nodes. Count unique roots = number of components.

### Examples

**Example 1:**
- Input: n = 5, edges = [[0,1],[1,2],[3,4]]
- Output: 2
- Explanation: Components: {0,1,2} and {3,4}

### Hints

1. Initialize parent array: parent[i] = i
2. Each node starts as its own component
3. For each edge, try to union the nodes
4. If union succeeds (different components), decrement count
5. Return final component count

### Starter Code

### Solution

### Test Cases

**Test 1:** Two components
- Input: "n=5, edges=[[0,1],[1,2],[3,4]]"
- Expected: "2"

**Test 2:** All connected
- Input: "n=5, edges=[[0,1],[1,2],[2,3],[3,4]]"
- Expected: "1"

**Test 3:** All disconnected
- Input: "n=4, edges=[]"
- Expected: "4"

---

## 7. Accounts Merge (Union-Find)

**Difficulty:** medium
**Concept:** graphs

### Description

Given list of accounts where each account has a name and email list, merge accounts belonging to same person. Accounts belong to same person if they share at least one email.

🎯 KEY INSIGHT: Emails are nodes, shared emails create edges. Union-Find groups emails by person.

💡 APPROACH: Union all emails within each account. Then group emails by root (same person). Build final result.

### Key Insight

Union emails within accounts. Shared emails connect accounts. Group by root parent.

### Examples

**Example 1:**
- Input: accounts = [
  ["John","john@mail.com","john_work@mail.com"],
  ["John","john@mail.com","john_home@mail.com"],
  ["Mary","mary@mail.com"]
]
- Output: [
  ["John","john@mail.com","john_home@mail.com","john_work@mail.com"],
  ["Mary","mary@mail.com"]
]
- Explanation: First two accounts belong to same John (shared john@mail.com)

### Hints

1. Map each email to its root parent (Union-Find)
2. Union all emails within each account
3. Track email → name mapping
4. Group emails by their root parent
5. For each group, format as [name, sorted_emails]

### Starter Code

### Solution

### Test Cases

**Test 1:** Merge John's accounts
- Input: "[[\"John\",\"john@mail.com\",\"john_work@mail.com\"],[\"John\",\"john@mail.com\",\"john_home@mail.com\"],[\"Mary\",\"mary@mail.com\"]]"
- Expected: "[[\"John\",\"john@mail.com\",\"john_home@mail.com\",\"john_work@mail.com\"],[\"Mary\",\"mary@mail.com\"]]"

**Test 2:** Accounts 2-3 merge via david4
- Input: "[[\"David\",\"david0@mail.com\",\"david1@mail.com\"],[\"David\",\"david3@mail.com\",\"david4@mail.com\"],[\"David\",\"david4@mail.com\",\"david5@mail.com\"]]"
- Expected: "[[\"David\",\"david0@mail.com\",\"david1@mail.com\"],[\"David\",\"david3@mail.com\",\"david4@mail.com\",\"david5@mail.com\"]]"

---

## 8. Word Ladder

**Difficulty:** hard
**Concept:** graphs
**Family:** graphs:word-ladder

### Description

Given beginWord, endWord, and wordList, find length of shortest transformation sequence from beginWord to endWord. Each step changes one letter, and intermediate words must be in wordList.

🎯 KEY INSIGHT: BFS for shortest path! Each word is a node. Edge exists if words differ by one letter.

💡 APPROACH: BFS with queue (word, steps). Try all single-letter changes. If in wordList and unvisited, add to queue.

### Key Insight

BFS finds shortest path. For each word, try all 26 letters × word length neighbors.

### Examples

**Example 1:**
- Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
- Output: 5
- Explanation: "hit" → "hot" → "dot" → "dog" → "cog"

### Hints

1. BFS for shortest path
2. Queue: (current_word, steps_taken)
3. For each position in word, try all 26 letters
4. If new word in wordList and unvisited, add to queue
5. Remove from wordList to mark as visited
6. Return steps when reaching endWord

### Starter Code

### Solution

### Test Cases

**Test 1:** Path: hit→hot→dot→dog→cog
- Input: "beginWord=\"hit\", endWord=\"cog\", wordList=[\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]"
- Expected: "5"

**Test 2:** No path (cog not in list)
- Input: "beginWord=\"hit\", endWord=\"cog\", wordList=[\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]"
- Expected: "0"

---

## 9. Network Delay Time (Dijkstra)

**Difficulty:** medium
**Concept:** graphs
**Family:** graphs:dijkstra

### Description

Given network of n nodes (1 to n) and times array [u, v, w] (signal from u to v takes w time), find minimum time for all nodes to receive signal from node k. Return -1 if impossible.

🎯 KEY INSIGHT: Dijkstra's algorithm for shortest path! Find minimum time to reach each node from source k.

💡 APPROACH: Dijkstra with min-heap. Track shortest time to each node. Return max of all times.

### Key Insight

Dijkstra finds shortest path from source. Return max distance (last node to receive signal).

### Examples

**Example 1:**
- Input: n = 4, times = [[2,1,1],[2,3,1],[3,4,1]], k = 2
- Output: 2
- Explanation: Node 2→1 (1), 2→3 (1), 3→4 (2). Max = 2

### Hints

1. Build adjacency list: node → [(neighbor, time)]
2. Use min-heap: (time, node)
3. Dijkstra: process nodes in order of minimum time
4. Track shortest time to each node
5. If not all nodes reached, return -1
6. Return maximum time (last node to receive signal)

### Starter Code

### Solution

### Test Cases

**Test 1:** All reachable, max time is 2
- Input: "times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2"
- Expected: "2"

**Test 2:** Simple two-node path
- Input: "times=[[1,2,1]], n=2, k=1"
- Expected: "1"

**Test 3:** Node 1 unreachable from node 2
- Input: "times=[[1,2,1]], n=2, k=2"
- Expected: "-1"

---

## 10. Cheapest Flights Within K Stops (Bellman-Ford)

**Difficulty:** medium
**Concept:** graphs
**Family:** graphs:dijkstra

### Description

Find cheapest price from src to dst with at most k stops. Given flights array [from, to, price].

🎯 KEY INSIGHT: Modified Dijkstra or Bellman-Ford! Track (cost, node, stops_remaining). Can't use pure Dijkstra - must track stops.

💡 APPROACH: BFS-like Dijkstra. Process by stops level. Update costs if cheaper path found with stops remaining.

### Key Insight

Bellman-Ford variant: relax edges k+1 times. Track minimum cost with stop constraint.

### Examples

**Example 1:**
- Input: n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3, k=1
- Output: 700
- Explanation: Path 0→1→3 costs 700 with 1 stop

### Hints

1. Use Bellman-Ford approach: relax edges k+1 times
2. Maintain prices array: minimum cost to reach each city
3. For each iteration (up to k+1 stops)
4. Try relaxing all edges: update cost if cheaper
5. Use temporary array to avoid interference
6. Return final cost to destination or -1

### Starter Code

### Solution

### Test Cases

**Test 1:** Path 0→1→3
- Input: "n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3, k=1"
- Expected: "700"

**Test 2:** Path 0→1→2 cheaper than direct
- Input: "n=3, flights=[[0,1,100],[1,2,100],[0,2,500]], src=0, dst=2, k=1"
- Expected: "200"

**Test 3:** No stops: must use direct
- Input: "n=3, flights=[[0,1,100],[1,2,100],[0,2,500]], src=0, dst=2, k=0"
- Expected: "500"

---

## 11. Number of Provinces (Union-Find)

**Difficulty:** medium
**Concept:** graphs

### Description

Given n x n adjacency matrix where isConnected[i][j] = 1 means cities i and j are directly connected, find number of provinces. A province is a group of directly or indirectly connected cities.

🎯 KEY INSIGHT: Count connected components in undirected graph. Union-Find perfect for this!

💡 APPROACH: Union cities that are connected. Count number of unique root parents.

### Key Insight

Union-Find: merge connected cities. Count distinct roots = provinces.

### Examples

**Example 1:**
- Input: isConnected = [[1,1,0],[1,1,0],[0,0,1]]
- Output: 2
- Explanation: Province 1: {0,1}, Province 2: {2}

### Hints

1. Initialize parent array for Union-Find
2. Iterate through adjacency matrix
3. If isConnected[i][j] == 1, union i and j
4. Count unique roots using set
5. Number of unique roots = number of provinces

### Starter Code

### Solution

### Test Cases

**Test 1:** Two provinces
- Input: "[[1,1,0],[1,1,0],[0,0,1]]"
- Expected: "2"

**Test 2:** All separate
- Input: "[[1,0,0],[0,1,0],[0,0,1]]"
- Expected: "3"

**Test 3:** All connected
- Input: "[[1,1,1],[1,1,1],[1,1,1]]"
- Expected: "1"

---

## 12. Redundant Connection (Cycle Detection)

**Difficulty:** medium
**Concept:** graphs

### Description

Given edges forming a tree + one extra edge creating a cycle, return the edge that can be removed.

🎯 KEY INSIGHT: Union-Find detects cycles! If union fails (already connected), that edge creates cycle.

💡 APPROACH: Process edges in order. First edge where union fails = redundant edge.

### Key Insight

Union-Find: if find(u) == find(v), they're already connected - cycle!

### Examples

**Example 1:**
- Input: edges = [[1,2],[1,3],[2,3]]
- Output: [2,3]
- Explanation: Edge [2,3] creates cycle in tree rooted at 1

### Hints

1. Initialize parent dictionary for Union-Find
2. For each edge [u, v], find their roots
3. If roots are same, edge creates cycle - return it!
4. If roots different, union them and continue
5. First failing union is the redundant edge

### Starter Code

### Solution

### Test Cases

**Test 1:** Edge [2,3] is redundant
- Input: "[[1,2],[1,3],[2,3]]"
- Expected: "[2,3]"

**Test 2:** Edge [1,4] creates cycle
- Input: "[[1,2],[2,3],[3,4],[1,4],[1,5]]"
- Expected: "[1,4]"

---

## 13. Surrounded Regions

**Difficulty:** medium
**Concept:** graphs

### Description

Given m x n board with 'X' and 'O', capture all regions surrounded by 'X'. A region is captured by flipping all 'O's to 'X's.

🎯 KEY INSIGHT: Reverse thinking! Mark border-connected 'O's as safe. Flip remaining 'O's.

💡 APPROACH: DFS from border 'O's, mark as safe. Then flip unmarked 'O's to 'X'.

### Key Insight

Border-connected O's are safe. DFS from borders, then flip the rest.

### Examples

**Example 1:**
- Input: board = [
  ["X","X","X","X"],
  ["X","O","O","X"],
  ["X","X","O","X"],
  ["X","O","X","X"]
]
- Output: [
  ["X","X","X","X"],
  ["X","X","X","X"],
  ["X","X","X","X"],
  ["X","O","X","X"]
]
- Explanation: Only bottom-left O touches border (not surrounded)

### Hints

1. Don't try to identify surrounded regions directly!
2. DFS from all border O's, mark them as 'S' (safe)
3. Safe O's are connected to border, can't be captured
4. After marking, flip remaining O's to X (they're surrounded)
5. Restore S's back to O's (border-connected)

### Starter Code

### Solution

### Test Cases

**Test 1:** Capture surrounded O's
- Input: "[[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"O\",\"X\"],[\"X\",\"X\",\"O\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]"
- Expected: "[[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]"

**Test 2:** Single cell
- Input: "[[\"X\"]]"
- Expected: "[[\"X\"]]"

---

## 14. Minimum Knight Moves

**Difficulty:** medium
**Concept:** graphs

### Description

On infinite chessboard, find minimum moves for knight to reach (x, y) from (0, 0).

🎯 KEY INSIGHT: BFS for shortest path! Knight has 8 possible moves. Use visited set to avoid cycles.

💡 APPROACH: BFS with (x, y, steps). Try all 8 knight moves. Optimization: only search positive quadrant + buffer.

### Key Insight

BFS finds shortest path. Symmetry optimization: focus on positive quadrant.

### Examples

**Example 1:**
- Input: x = 2, y = 1
- Output: 1
- Explanation: One knight move: (0,0) -> (2,1)

**Example 2:**
- Input: x = 5, y = 5
- Output: 4
- Explanation: Four moves needed

### Hints

1. Use BFS for shortest path
2. Knight has 8 moves: (±2,±1) and (±1,±2)
3. Optimization: use abs(x), abs(y) for symmetry
4. Limit search space: -2 to target+2 (no need to go far)
5. Track visited positions to avoid cycles

### Starter Code

### Solution

### Test Cases

**Test 1:** One move
- Input: "x=2, y=1"
- Expected: "1"

**Test 2:** Four moves needed
- Input: "x=5, y=5"
- Expected: "4"

---

## 15. Rotting Oranges

**Difficulty:** medium
**Concept:** graphs
**Family:** graphs:bfs-rotting-oranges

### Description

Given grid where 0=empty, 1=fresh orange, 2=rotten orange. Every minute, rotten oranges rot adjacent fresh oranges (4-directionally). Find minimum minutes to rot all oranges, or -1 if impossible.

🎯 KEY INSIGHT: Multi-source BFS! Start BFS from ALL rotten oranges simultaneously.

💡 APPROACH: Add all rotten oranges to queue initially. BFS level-by-level (each level = 1 minute).

### Key Insight

Multi-source BFS: start from all rotten oranges at once, spread simultaneously

### Examples

**Example 1:**
- Input: grid = [
  [2,1,1],
  [1,1,0],
  [0,1,1]
]
- Output: 4
- Explanation: After 4 minutes, all oranges are rotten

### Hints

1. Count fresh oranges initially
2. Add ALL rotten oranges to queue at start (multi-source BFS)
3. BFS: for each rotten orange, rot adjacent fresh oranges
4. Track minutes with each queue entry: (r, c, minutes)
5. If fresh count reaches 0, return minutes. Else -1

### Starter Code

### Solution

### Test Cases

**Test 1:** All rot in 4 minutes
- Input: "[[2,1,1],[1,1,0],[0,1,1]]"
- Expected: "4"

**Test 2:** Island of fresh oranges unreachable
- Input: "[[2,1,1],[0,1,1],[1,0,1]]"
- Expected: "-1"

---

## 16. Shortest Bridge

**Difficulty:** medium
**Concept:** graphs

### Description

Given binary matrix with exactly 2 islands (1=land, 0=water), find minimum flips to connect them.

🎯 KEY INSIGHT: Hybrid approach! (1) DFS to find first island, (2) BFS to find shortest path to second island.

💡 APPROACH: DFS marks first island, then multi-source BFS expands until hitting second island.

### Key Insight

DFS to find island, then BFS to expand and find shortest bridge

### Examples

**Example 1:**
- Input: [[0,1],[1,0]]
- Output: 1
- Explanation: Flip one 0 to connect islands

### Hints

1. First, find any cell of first island with nested loops
2. DFS to mark entire first island as 2, add border to queue
3. Then BFS from first island boundary (all cells in queue)
4. Expand BFS until hitting second island (grid[nr][nc] == 1)
5. Distance when hitting second island = minimum bridge

### Starter Code

### Solution

### Test Cases

**Test 1:** 1 flip connects diagonal islands
- Input: "[[0,1],[1,0]]"
- Expected: "1"

**Test 2:** Islands are already 1 cell apart
- Input: "[[1,1,1,1,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,0,0,1],[1,1,1,1,1]]"
- Expected: "1"

---

## 17. Is Graph Bipartite

**Difficulty:** medium
**Concept:** graphs

### Description

Graph is bipartite if nodes can be divided into two sets where no two adjacent nodes are in same set. Determine if graph is bipartite.

🎯 KEY INSIGHT: 2-coloring problem! Use DFS/BFS to color nodes. If neighbor has same color, not bipartite.

💡 APPROACH: Try to color graph with 2 colors. If conflict found, return false.

### Key Insight

Try 2-coloring with DFS. Color conflict = not bipartite.

### Examples

**Example 1:**
- Input: graph = [[1,3],[0,2],[1,3],[0,2]]
- Output: True
- Explanation: Can color: {0,2} red, {1,3} blue

### Hints

1. Use color array: -1=uncolored, 0=color1, 1=color2
2. DFS: color current node, then color neighbors with opposite color
3. If neighbor already has same color, conflict - return False
4. Check all components (graph might be disconnected)
5. If no conflicts found, graph is bipartite

### Starter Code

### Solution

### Test Cases

**Test 1:** Bipartite: alternating colors work
- Input: "[[1,3],[0,2],[1,3],[0,2]]"
- Expected: "True"

**Test 2:** Triangle: 3 nodes all connected (odd cycle)
- Input: "[[1,2,3],[0,2],[0,1,3],[0,2]]"
- Expected: "False"

---

## 18. Critical Connections

**Difficulty:** hard
**Concept:** graphs

### Description

Given network of n servers (0 to n-1) and connections, find all critical connections. A critical connection is one whose removal disconnects the network.

🎯 KEY INSIGHT: This is finding BRIDGES in graph using Tarjan's algorithm with low-link values.

💡 APPROACH: DFS with discovery time and low-link value. Edge is bridge if low[neighbor] > disc[node].

### Key Insight

Tarjan's algorithm: edge (u,v) is bridge if low[v] > disc[u]

### Examples

**Example 1:**
- Input: n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]
- Output: [[1,3]]
- Explanation: Edge [1,3] is critical - removing it disconnects node 3

### Hints

1. Use Tarjan's algorithm with discovery time and low-link
2. disc[node] = when node was discovered in DFS
3. low[node] = earliest node reachable from subtree
4. Edge (u,v) is bridge if low[v] > disc[u]
5. Must track parent to avoid back-edge to parent as cycle

### Starter Code

### Solution

### Test Cases

**Test 1:** One critical edge
- Input: "n=4, connections=[[0,1],[1,2],[2,0],[1,3]]"
- Expected: "[[1,3]]"

**Test 2:** Single edge is critical
- Input: "n=2, connections=[[0,1]]"
- Expected: "[[0,1]]"

---

## 19. Minimum Height Trees

**Difficulty:** hard
**Concept:** graphs

### Description

Given tree of n nodes (0 to n-1) and edges, find all root labels that minimize tree height. A tree's height is number of edges on longest downward path.

🎯 KEY INSIGHT: Trim leaves iteratively (like topological sort). Final 1-2 nodes remaining = roots with min height.

💡 APPROACH: Similar to topological sort. Remove leaf nodes level by level until ≤2 nodes remain.

### Key Insight

Trim leaves layer by layer. Center nodes (1-2 remaining) give minimum height.

### Examples

**Example 1:**
- Input: n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]]
- Output: [3,4]
- Explanation: Rooting at 3 or 4 gives minimum height

### Hints

1. Build adjacency list with sets for easy removal
2. Find initial leaves (nodes with degree 1)
3. Remove leaves layer by layer (like topological sort)
4. After removing a leaf, check if neighbor becomes new leaf
5. Stop when ≤2 nodes remain - these are MHT roots

### Starter Code

### Solution

### Test Cases

**Test 1:** Two possible MHT roots
- Input: "n=6, edges=[[3,0],[3,1],[3,2],[3,4],[5,4]]"
- Expected: "[3,4]"

**Test 2:** Single node
- Input: "n=1, edges=[]"
- Expected: "[0]"

---

## 20. Alien Dictionary

**Difficulty:** hard
**Concept:** graphs

### Description

Given sorted dictionary of alien language words, derive the order of characters. If no valid order exists, return "".

🎯 KEY INSIGHT: Compare adjacent words to find character ordering. Build directed graph, topological sort gives character order.

💡 APPROACH: Compare words pairwise to find edges (char1 -> char2). Topological sort on character graph.

### Key Insight

Adjacent words reveal character ordering. Topological sort on char graph.

### Examples

**Example 1:**
- Input: words = ["wrt","wrf","er","ett","rftt"]
- Output: "wertf"
- Explanation: w->e, t->f, r->t, e->r from word comparisons

### Hints

1. Initialize in_degree for all characters in all words
2. Compare adjacent words to find first differing character
3. That difference gives edge: w1[j] -> w2[j]
4. Invalid: if w1 is prefix of w2 but w1 is longer
5. Topological sort: if cycle (result length < chars), return ''

### Starter Code

### Solution

### Test Cases

**Test 1:** Valid ordering derived
- Input: "[\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]"
- Expected: "\"wertf\""

**Test 2:** Simple: z before x
- Input: "[\"z\",\"x\"]"
- Expected: "\"zx\""

**Test 3:** Invalid: abc before ab impossible
- Input: "[\"abc\",\"ab\"]"
- Expected: "\"\""

---

## 21. Swim in Rising Water

**Difficulty:** hard
**Concept:** graphs

### Description

Given n x n grid of elevations, find minimum time to swim from top-left to bottom-right. At time t, you can swim to cells with elevation ≤ t.

🎯 KEY INSIGHT: Modified Dijkstra! Instead of distance, track maximum elevation on path (minimize max elevation).

💡 APPROACH: Dijkstra with priority queue on elevation. Track minimum "max elevation on path" to reach each cell.

### Key Insight

Modified Dijkstra: minimize the maximum elevation encountered on path

### Examples

**Example 1:**
- Input: grid = [[0,2],[1,3]]
- Output: 3
- Explanation: Path 0→1→3 has max elevation 3

### Hints

1. Use Dijkstra with min-heap
2. Priority: maximum elevation on path so far
3. Heap: (max_elevation_so_far, row, col)
4. For each neighbor, new time = max(current_time, neighbor_elevation)
5. Return time when reaching bottom-right
6. Track visited to avoid reprocessing

### Starter Code

### Solution

### Test Cases

**Test 1:** Simple 2x2 grid
- Input: "[[0,2],[1,3]]"
- Expected: "3"

**Test 2:** Spiral grid
- Input: "[[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]"
- Expected: "16"

---

## 22. Number of Islands II (Union-Find)

**Difficulty:** hard
**Concept:** graphs
**Family:** graphs:bfs-islands

### Description

Given m x n grid (all water initially), islands are added one cell at a time. Return count of islands after each addition. Island is formed by connecting adjacent (4-directionally) land cells.

🎯 KEY INSIGHT: Dynamic connectivity! Union-Find perfect for this. Start with 0 islands, increment on add, decrement on union.

💡 APPROACH: For each new land cell, check 4 neighbors. Union with neighboring land, adjusting island count.

### Key Insight

Union-Find for dynamic connectivity. Each union of different components merges islands (-1 count).

### Examples

**Example 1:**
- Input: m=3, n=3, positions=[[0,0],[0,1],[1,2],[2,1]]
- Output: [1,1,2,3]
- Explanation: Islands change as land is added

### Hints

1. Use Union-Find with dictionary (sparse grid)
2. Track island count, starting at 0
3. When adding land at (r,c), increment island count by 1
4. Check 4 neighbors: if neighbor is land and different component, union them
5. Each successful union decreases island count by 1
6. Handle duplicate positions (already land)

### Starter Code

### Solution

### Test Cases

**Test 1:** Islands merge and separate dynamically
- Input: "m=3, n=3, positions=[[0,0],[0,1],[1,2],[2,1]]"
- Expected: "[1,1,2,3]"

**Test 2:** Single cell
- Input: "m=1, n=1, positions=[[0,0]]"
- Expected: "[1]"

**Test 3:** All positions merge into one island
- Input: "m=3, n=3, positions=[[0,0],[0,1],[1,0],[1,1]]"
- Expected: "[1,1,1,1]"

**Test 4:** Duplicate position doesn't change count
- Input: "m=2, n=2, positions=[[0,0],[1,1],[0,0]]"
- Expected: "[1,2,2]"

---

## 23. Word Ladder II

**Difficulty:** hard
**Concept:** graphs
**Family:** graphs:word-ladder

### Description

Given beginWord, endWord, and wordList, find ALL shortest transformation sequences from beginWord to endWord. Each step changes one letter, intermediate words must be in wordList.

🎯 KEY INSIGHT: BFS to find shortest distance, then DFS backtracking to build all paths of that distance.

💡 APPROACH: (1) BFS to build parent graph showing all shortest paths, (2) DFS from endWord to reconstruct all paths.

### Key Insight

BFS finds distance and builds parent map. DFS reconstructs all paths.

### Examples

**Example 1:**
- Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
- Output: [["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]
- Explanation: Two shortest paths of length 5

### Hints

1. Use BFS to find shortest path length and build parent map
2. Process BFS level by level to ensure all shortest paths found
3. Don't mark visited until after processing entire level
4. Store all parents for each word (multiple shortest paths)
5. Use DFS from endWord backwards to reconstruct all paths
6. Reverse path before adding to result

### Starter Code

### Solution

### Test Cases

**Test 1:** Two shortest paths
- Input: "beginWord=\"hit\", endWord=\"cog\", wordList=[\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]"
- Expected: "[[\"hit\",\"hot\",\"dot\",\"dog\",\"cog\"],[\"hit\",\"hot\",\"lot\",\"log\",\"cog\"]]"

**Test 2:** No path (endWord not in list)
- Input: "beginWord=\"hit\", endWord=\"cog\", wordList=[\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]"
- Expected: "[]"

**Test 3:** Direct transformation
- Input: "beginWord=\"a\", endWord=\"c\", wordList=[\"a\",\"b\",\"c\"]"
- Expected: "[[\"a\",\"c\"]]"

---

## 24. Walls and Gates

**Difficulty:** medium
**Concept:** graphs

### Description

Given m x n grid where -1 is wall, 0 is gate, INF is empty room, fill each empty room with distance to nearest gate. Use INF = 2147483647.

🎯 KEY INSIGHT: Multi-source BFS from ALL gates simultaneously! Much more efficient than BFS from each room.

💡 APPROACH: Add all gates to queue initially. BFS expands outward, updating distances as we go.

### Key Insight

Multi-source BFS: start from all gates at once, spread distance simultaneously

### Examples

**Example 1:**
- Input: grid = [
  [INF,-1,0,INF],
  [INF,INF,INF,-1],
  [INF,-1,INF,-1],
  [0,-1,INF,INF]
]
- Output: [
  [3,-1,0,1],
  [2,2,1,-1],
  [1,-1,2,-1],
  [0,-1,3,4]
]
- Explanation: Each room shows distance to nearest gate

### Hints

1. Don't BFS from each room - too slow!
2. Add ALL gates (value 0) to queue initially
3. BFS expands from all gates simultaneously
4. Only update cells with value INF (2147483647)
5. Each neighbor gets distance = current + 1
6. Walls (-1) and gates (0) are never updated

### Starter Code

### Solution

### Test Cases

**Test 1:** Basic grid with one gate
- Input: "[[2147483647,-1,0,2147483647],[2147483647,2147483647,2147483647,-1]]"
- Expected: "[[3,-1,0,1],[2,2,1,-1]]"

**Test 2:** Single gate
- Input: "[[0]]"
- Expected: "[[0]]"

**Test 3:** Single wall
- Input: "[[-1]]"
- Expected: "[[-1]]"

**Test 4:** Unreachable room
- Input: "[[2147483647]]"
- Expected: "[[2147483647]]"

---

## 25. The Maze

**Difficulty:** medium
**Concept:** graphs

### Description

Given m x n maze with ball at start position, can ball reach destination? Ball rolls continuously in a direction until hitting a wall, then stops before wall.

🎯 KEY INSIGHT: This is NOT regular BFS/DFS! Ball rolls until hitting wall. Node = stopping position, not individual cell.

💡 APPROACH: DFS/BFS where each move rolls ball until wall. Mark stopping positions as visited.

### Key Insight

Ball rolls continuously. Visited tracks stopping positions, not all cells.

### Examples

**Example 1:**
- Input: maze = [
  [0,0,1,0,0],
  [0,0,0,0,0],
  [0,0,0,1,0],
  [1,1,0,1,1],
  [0,0,0,0,0]
], start = [0,4], destination = [4,4]
- Output: True
- Explanation: Ball can roll to destination

### Hints

1. Ball doesn't stop at each cell - it rolls continuously!
2. For each direction, roll until hitting wall or boundary
3. Stopping position = last valid cell before wall
4. Mark stopping positions as visited, not rolling cells
5. Use DFS or BFS from each stopping position
6. Check if any stopping position matches destination

### Starter Code

### Solution

### Test Cases

**Test 1:** Path exists
- Input: "maze=[[0,0,1,0,0],[0,0,0,0,0],[0,0,0,1,0],[1,1,0,1,1],[0,0,0,0,0]], start=[0,4], destination=[4,4]"
- Expected: "True"

**Test 2:** No path
- Input: "maze=[[0,0,1,0,0],[0,0,0,0,0],[0,0,0,1,0],[1,1,0,1,1],[0,0,0,0,0]], start=[0,4], destination=[3,2]"
- Expected: "False"

**Test 3:** Multiple rolls needed
- Input: "maze=[[0,0,0,0,0],[1,1,0,0,1],[0,0,0,0,0]], start=[0,4], destination=[2,0]"
- Expected: "True"

---

## 26. The Maze II

**Difficulty:** medium
**Concept:** graphs

### Description

Same maze as before, but return SHORTEST distance (number of moves) for ball to reach destination. Return -1 if impossible.

🎯 KEY INSIGHT: Shortest path with continuous rolling = modified Dijkstra! Distance = number of cells traveled.

💡 APPROACH: Dijkstra with (distance, row, col) in priority queue. Roll ball and track total distance.

### Key Insight

Use Dijkstra because different paths to same stopping position may have different distances

### Examples

**Example 1:**
- Input: maze = [
  [0,0,1,0,0],
  [0,0,0,0,0],
  [0,0,0,1,0],
  [1,1,0,1,1],
  [0,0,0,0,0]
], start = [0,4], destination = [4,4]
- Output: 12
- Explanation: Shortest path has 12 moves

### Hints

1. This is Dijkstra, not BFS! Different paths have different distances
2. Priority queue: (total_distance, row, col)
3. For each direction, roll and count steps
4. New distance = current distance + steps rolled
5. Track visited with distances dict (prevents reprocessing)
6. Return distance when reaching destination

### Starter Code

### Solution

### Test Cases

**Test 1:** Shortest path is 12 moves
- Input: "maze=[[0,0,1,0,0],[0,0,0,0,0],[0,0,0,1,0],[1,1,0,1,1],[0,0,0,0,0]], start=[0,4], destination=[4,4]"
- Expected: "12"

**Test 2:** Impossible to reach
- Input: "maze=[[0,0,1,0,0],[0,0,0,0,0],[0,0,0,1,0],[1,1,0,1,1],[0,0,0,0,0]], start=[0,4], destination=[3,2]"
- Expected: "-1"

**Test 3:** Straight line
- Input: "maze=[[0,0,0,0,0]], start=[0,0], destination=[0,4]"
- Expected: "4"

---

## 27. Graph Valid Tree

**Difficulty:** medium
**Concept:** graphs

### Description

Given n nodes (0 to n-1) and edges, determine if edges form a valid tree. A valid tree: (1) connected, (2) no cycles.

🎯 KEY INSIGHT: Tree properties: exactly n-1 edges, all connected, no cycles. Use Union-Find or DFS.

💡 APPROACH: Check edge count = n-1. Then use Union-Find: if union fails (cycle) or not all connected, invalid.

### Key Insight

Valid tree: n-1 edges + no cycles. Union-Find detects both conditions.

### Examples

**Example 1:**
- Input: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]
- Output: True
- Explanation: 5 nodes, 4 edges, all connected, no cycles

**Example 2:**
- Input: n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]
- Output: False
- Explanation: Cycle exists: 1-2-3-1

### Hints

1. Valid tree must have exactly n-1 edges
2. If edge count != n-1, return False immediately
3. Use Union-Find to check for cycles
4. If union fails (roots already same), cycle exists
5. If n-1 edges and no cycles, graph is automatically connected
6. Alternative: DFS to check connected + no cycles

### Starter Code

### Solution

### Test Cases

**Test 1:** Valid tree
- Input: "n=5, edges=[[0,1],[0,2],[0,3],[1,4]]"
- Expected: "True"

**Test 2:** Cycle exists
- Input: "n=5, edges=[[0,1],[1,2],[2,3],[1,3],[1,4]]"
- Expected: "False"

**Test 3:** Disconnected (2 components)
- Input: "n=4, edges=[[0,1],[2,3]]"
- Expected: "False"

**Test 4:** Single node is valid tree
- Input: "n=1, edges=[]"
- Expected: "True"

**Test 5:** Duplicate edge creates cycle
- Input: "n=2, edges=[[0,1],[0,1]]"
- Expected: "False"

---

## 28. Min Cost to Connect All Points (Prims MST)

**Difficulty:** medium
**Concept:** graphs
**Family:** graphs:mst

### Description

You are given an array points representing integer coordinates of points on a 2D plane, where points[i] = [xi, yi]. The cost of connecting two points [xi, yi] and [xj, yj] is the Manhattan distance between them: |xi - xj| + |yi - yj|. Return the minimum cost to make all points connected.

🎯 KEY INSIGHT: This is Minimum Spanning Tree! Use Prim's algorithm with min-heap. Start from any point, greedily add closest unvisited point.

💡 PRIM'S APPROACH: Start with one node. Repeatedly: pick minimum edge to unvisited node, add to MST. Uses priority queue for efficiency.

### Key Insight

Prim's MST: Grow tree from single node, always adding cheapest edge to unvisited node. Min-heap tracks frontier.

### Examples

**Example 1:**
- Input: points = [[0,0],[2,2],[3,10],[5,2],[7,0]]
- Output: 20
- Explanation: Connect: (0,0)→(2,2)=4, (2,2)→(5,2)=3, (5,2)→(7,0)=5, (2,2)→(3,10)=9. Total=20

**Example 2:**
- Input: points = [[3,12],[-2,5],[-4,1]]
- Output: 18
- Explanation: Connect all 3 points: Manhattan distances sum to 18

### Hints

1. Manhattan distance: |x1-x2| + |y1-y2|
2. Start from any point (point 0) with cost 0
3. Use min-heap: (cost_to_reach, point_index)
4. Pop minimum edge. If point visited, skip. Else add cost.
5. From current point, add all edges to unvisited points to heap
6. Continue until all points visited
7. Time: O(n² log n), Space: O(n²) for heap

### Starter Code

### Solution

### Test Cases

**Test 1:** 5 points MST
- Input: "min_cost_connect_points([[0,0],[2,2],[3,10],[5,2],[7,0]])"
- Expected: "20"

**Test 2:** 3 points MST
- Input: "min_cost_connect_points([[3,12],[-2,5],[-4,1]])"
- Expected: "18"

**Test 3:** 4 points in square
- Input: "min_cost_connect_points([[0,0],[1,1],[1,0],[-1,1]])"
- Expected: "4"

---

## 29. Connecting Cities With Minimum Cost (Kruskals MST)

**Difficulty:** medium
**Concept:** graphs
**Family:** graphs:mst

### Description

There are n cities labeled from 1 to n. You are given the integer n and an array connections where connections[i] = [city1, city2, cost] indicates that the cost of connecting city1 and city2 is cost. Return the minimum cost to connect all cities. If it is impossible to connect all cities, return -1.

🎯 KEY INSIGHT: This is MST with explicit edges! Use Kruskal's algorithm: sort edges by cost, greedily add edges if they don't create cycle (Union-Find).

💡 KRUSKAL'S APPROACH: Sort all edges by weight. For each edge, if connects two different components, add it. Use Union-Find to track components efficiently.

### Key Insight

Kruskal's MST: Sort edges by weight, add cheapest edges that don't create cycles. Union-Find prevents cycles.

### Examples

**Example 1:**
- Input: n=3, connections=[[1,2,5],[1,3,6],[2,3,1]]
- Output: 6
- Explanation: Pick edge [2,3,1] and [1,2,5]. Total cost = 6. Cheaper than [1,3,6].

**Example 2:**
- Input: n=4, connections=[[1,2,3],[3,4,4]]
- Output: -1
- Explanation: Cannot connect all 4 cities - cities 1,2 separate from cities 3,4

### Hints

1. Kruskal's: Sort edges by cost first!
2. Use Union-Find to track connected components
3. For each edge, check if it connects different components (union)
4. If union succeeds, add edge cost to total
5. MST needs exactly n-1 edges for n nodes
6. If fewer than n-1 edges used, graph disconnected → return -1
7. Time: O(m log m) for sorting, O(m * α(n)) for union-find

### Starter Code

### Solution

### Test Cases

**Test 1:** MST uses edges [2,3,1] and [1,2,5]
- Input: "minimum_cost(3, [[1,2,5],[1,3,6],[2,3,1]])"
- Expected: "6"

**Test 2:** Disconnected graph
- Input: "minimum_cost(4, [[1,2,3],[3,4,4]])"
- Expected: "-1"

**Test 3:** Use two cheapest edges
- Input: "minimum_cost(3, [[1,2,1],[2,3,2],[1,3,3]])"
- Expected: "3"

---

## 30. Find Critical and Pseudo-Critical Edges in MST

**Difficulty:** hard
**Concept:** graphs
**Family:** graphs:mst

### Description

Given a weighted undirected graph with n vertices and edges, find all the critical edges and pseudo-critical edges. An edge is critical if deleting it increases the MST weight. An edge is pseudo-critical if it appears in some MST but not all MSTs (removing it doesn't change MST weight, but forcing it doesn't either).

🎯 KEY INSIGHT: Run Kruskal's 3 times! (1) Normal MST for baseline. (2) For each edge: exclude it, check if MST weight increases (critical). (3) Force-include it, check if same weight (pseudo-critical).

💡 APPROACH: Critical edge: MST without it costs more. Pseudo-critical: MST with it forced still achieves min cost.

### Key Insight

Critical if excluding increases cost. Pseudo-critical if forcing doesn't increase cost (but not always included).

### Examples

**Example 1:**
- Input: n=5, edges=[[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]]
- Output: [[0,1],[2,3,4,5]]
- Explanation: Edges 0,1 are critical. Edges 2,3,4,5 are pseudo-critical (appear in some MSTs).

### Hints

1. Run Kruskal's 3 ways: normal, exclude edge i, force-include edge i
2. Add index to edges: [(u,v,w,index) for index,(u,v,w) in enumerate(edges)]
3. Baseline: run normal Kruskal's, get MST weight
4. Critical: if excluding edge i makes MST cost > baseline (or disconnected)
5. Pseudo-critical: if forcing edge i still achieves baseline cost
6. Edge can't be both critical and pseudo-critical
7. Must handle disconnected case: return infinity if can't form MST

### Starter Code

### Solution

### Test Cases

**Test 1:** 2 critical, 4 pseudo-critical edges
- Input: "find_critical_pseudo_critical(5, [[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]])"
- Expected: "[[0,1],[2,3,4,5]]"

**Test 2:** All edges pseudo-critical (multiple MSTs)
- Input: "find_critical_pseudo_critical(4, [[0,1,1],[1,2,1],[2,3,1],[0,3,1]])"
- Expected: "[[],[0,1,2,3]]"

---
