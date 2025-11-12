# UNION-FIND Problems

Total Problems: 15

---

## 1. Number of Connected Components in Undirected Graph

**Difficulty:** easy
**Concept:** union-find
**Family:** union-find:components

### Description

You have a graph of n nodes labeled from 0 to n-1. You are given an integer n and an array edges where edges[i] = [a, b] indicates an undirected edge between nodes a and b. Return the number of connected components in the graph.

### Key Insight

Union-Find classic! Start with n components. Each union reduces count by 1 (if nodes not already connected). Track component count throughout.

### Examples

**Example 1:**
- Input: n=5, edges=[[0,1],[1,2],[3,4]]
- Output: 2
- Explanation: Two components: {0,1,2} and {3,4}. Node 4 is isolated but connected to 3.

**Example 2:**
- Input: n=5, edges=[[0,1],[1,2],[2,3],[3,4]]
- Output: 1
- Explanation: All nodes connected in one component: {0,1,2,3,4}

### Hints

1. Initialize: parent = [0,1,2,...,n-1], components = n
2. find(x): if parent[x] != x, set parent[x] = find(parent[x]) (path compression)
3. union(x, y): find roots of x and y. If different, merge and return True
4. For each edge, if union succeeds, decrement component count
5. Return final component count
6. Time: O(n + m*α(n)) where α is inverse Ackermann (nearly constant)

### Starter Code

**Python:**
```python
def count_components(n, edges):
    """
    Count connected components using Union-Find.

    Args:
        n: int - number of nodes (0 to n-1)
        edges: List[List[int]] - undirected edges

    Returns:
        int - number of connected components
    """
    parent = list(range(n))

    def find(x):
        # TODO: Implement find with path compression
        pass

    def union(x, y):
        # TODO: Implement union, return True if merged
        pass

    # TODO: Start with n components, decrease on each successful union
    pass
```

**JavaScript:**
```javascript
function count_components(n, edges) {
    """
    Count connected components using Union-Find.

    Args:
        n: int - number of nodes (0 to n-1)
        edges: Array] - undirected edges

    Returns:
        int - number of connected components
    """
    parent = list(range(n))

    function find(x) {
        // TODO: Implement find with path compression
  // TODO: implement
    function union(x, y) {
        // TODO: Implement union, return true if merged
  // TODO: implement
    // TODO: Start with n components, decrease on each successful union
  // TODO: implement
```

### Solution

**Python:**
```python
def count_components(n, edges):
    parent = list(range(n))

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        root_x = find(x)
        root_y = find(y)
        if root_x == root_y:
            return False
        parent[root_x] = root_y
        return True

    components = n
    for a, b in edges:
        if union(a, b):
            components -= 1

    return components
```

**JavaScript:**
```javascript
function count_components(n, edges) {
    parent = list(range(n))

    function find(x) {
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    function union(x, y) {
        root_x = find(x)
        root_y = find(y)
        if root_x == root_y:
            return false
        parent[root_x] = root_y
        return true

    components = n
    for a, b in edges:
        if union(a, b):
            components -= 1

    return components
```

### Complexity Analysis

- **Time Complexity:** O(n + m*α(n)) where m = number of edges, α ≈ constant
- **Space Complexity:** O(n) for parent array

### Test Cases

**Test 1:** Two components
- Input: "count_components(5, [[0,1],[1,2],[3,4]])"
- Expected: "2"

**Test 2:** All connected
- Input: "count_components(5, [[0,1],[1,2],[2,3],[3,4]])"
- Expected: "1"

**Test 3:** No edges, all isolated
- Input: "count_components(4, [])"
- Expected: "4"

---

## 2. Redundant Connection

**Difficulty:** medium
**Concept:** union-find
**Family:** union-find:redundant-connection

### Description

In this problem, a tree is an undirected graph that is connected and has no cycles. You are given a graph that started as a tree with n nodes labeled from 1 to n, with one additional edge added. The added edge has two different vertices chosen from 1 to n, and was not an edge that already existed. Return an edge that can be removed so that the resulting graph is a tree of n nodes. If there are multiple answers, return the edge that occurs last in the input.

### Key Insight

Cycle detection with Union-Find! Process edges in order. First edge where both nodes already connected = the redundant edge that creates the cycle.

### Examples

**Example 1:**
- Input: edges=[[1,2],[1,3],[2,3]]
- Output: [2,3]
- Explanation: After adding [1,2] and [1,3], nodes 2 and 3 are already connected through 1. [2,3] creates cycle.

**Example 2:**
- Input: edges=[[1,2],[2,3],[3,4],[1,4],[1,5]]
- Output: [1,4]
- Explanation: Path 1→2→3→4 already exists. [1,4] creates cycle.

### Hints

1. Use dictionary for parent: parent.setdefault(x, x)
2. find(x): if parent[x] != x, parent[x] = find(parent[x])
3. union(x, y): get roots. If same root, they're already connected (cycle!)
4. Process edges in order. First edge where union fails is the answer
5. Return that edge
6. Edge labels start from 1, not 0

### Starter Code

**Python:**
```python
def find_redundant_connection(edges):
    """
    Find the redundant edge that creates a cycle.

    Args:
        edges: List[List[int]] - edges in order

    Returns:
        List[int] - the redundant edge
    """
    parent = {}

    def find(x):
        # TODO: Initialize parent[x] = x if not exists
        # TODO: Path compression
        pass

    def union(x, y):
        # TODO: If already connected, return False (cycle!)
        # TODO: Otherwise merge and return True
        pass

    # TODO: Process edges in order, return first that fails union
    pass
```

**JavaScript:**
```javascript
function find_redundant_connection(edges) {
    """
    Find the redundant edge that creates a cycle.

    Args:
        edges: Array] - edges in order

    Returns:
        Array - the redundant edge
    """
    parent = {}

    function find(x) {
        // TODO: Initialize parent[x] = x if not exists
        // TODO: Path compression
  // TODO: implement
    function union(x, y) {
        // TODO: If already connected, return false (cycle!)
        // TODO: Otherwise merge and return true
  // TODO: implement
    // TODO: Process edges in order, return first that fails union
  // TODO: implement
```

### Solution

**Python:**
```python
def find_redundant_connection(edges):
    parent = {}

    def find(x):
        parent.setdefault(x, x)
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        root_x = find(x)
        root_y = find(y)
        if root_x == root_y:
            return False
        parent[root_x] = root_y
        return True

    for edge in edges:
        if not union(edge[0], edge[1]):
            return edge

    return []
```

**JavaScript:**
```javascript
function find_redundant_connection(edges) {
    parent = {}

    function find(x) {
        parent.setdefault(x, x)
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    function union(x, y) {
        root_x = find(x)
        root_y = find(y)
        if root_x == root_y:
            return false
        parent[root_x] = root_y
        return true

    for edge in edges:
        if not union(edge[0], edge[1]):
            return edge

    return []
```

### Complexity Analysis

- **Time Complexity:** O(n*α(n)) where n = number of edges
- **Space Complexity:** O(n) for parent dictionary

### Test Cases

**Test 1:** Last edge creates cycle
- Input: "find_redundant_connection([[1,2],[1,3],[2,3]])"
- Expected: "[2,3]"

**Test 2:** Middle edge creates cycle
- Input: "find_redundant_connection([[1,2],[2,3],[3,4],[1,4],[1,5]])"
- Expected: "[1,4]"

---

## 3. Friend Circles

**Difficulty:** easy
**Concept:** union-find
**Family:** union-find:friend-circles

### Description

Given a friendship matrix M where M[i][j] = 1 means person i and person j are direct friends. Friendship is transitive (if A is friends with B, and B is friends with C, then A and C are in the same friend circle). Return the total number of friend circles.

### Key Insight

Classic component counting! For each M[i][j] = 1, union(i, j). Count unique roots to find number of friend circles.

### Examples

**Example 1:**
- Input: M=[[1,1,0],[1,1,0],[0,0,1]]
- Output: 2
- Explanation: Persons 0 and 1 are friends (circle 1). Person 2 is alone (circle 2). Total: 2 circles.

**Example 2:**
- Input: M=[[1,1,0],[1,1,1],[0,1,1]]
- Output: 1
- Explanation: All three persons connected: 0-1, 1-2. One big friend circle.

### Hints

1. Initialize parent = [0, 1, 2, ..., n-1] for n people
2. Iterate through upper triangle: for i in range(n), for j in range(i+1, n)
3. If M[i][j] == 1, union(i, j) to merge friend circles
4. Count circles: len(set(find(i) for i in range(n)))
5. Alternative: start with n circles, decrement on each successful union
6. Don't check M[i][i] (everyone is friends with themselves)

### Starter Code

**Python:**
```python
def find_circle_num(M):
    """
    Count friend circles using Union-Find.

    Args:
        M: List[List[int]] - friendship matrix

    Returns:
        int - number of friend circles
    """
    n = len(M)
    parent = list(range(n))

    def find(x):
        # TODO: Implement find with path compression
        pass

    def union(x, y):
        # TODO: Union two people
        pass

    # TODO: Union all friendships
    # TODO: Count unique roots
    pass
```

**JavaScript:**
```javascript
function find_circle_num(M) {
    """
    Count friend circles using Union-Find.

    Args:
        M: Array] - friendship matrix

    Returns:
        int - number of friend circles
    """
    n = len(M)
    parent = list(range(n))

    function find(x) {
        // TODO: Implement find with path compression
  // TODO: implement
    function union(x, y) {
        // TODO: Union two people
  // TODO: implement
    // TODO: Union all friendships
    // TODO: Count unique roots
  // TODO: implement
```

### Solution

**Python:**
```python
def find_circle_num(M):
    n = len(M)
    parent = list(range(n))

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        parent[find(x)] = find(y)

    # Union all friendships
    for i in range(n):
        for j in range(i + 1, n):
            if M[i][j] == 1:
                union(i, j)

    # Count unique roots
    return len(set(find(i) for i in range(n)))
```

**JavaScript:**
```javascript
function find_circle_num(M) {
    n = len(M)
    parent = list(range(n))

    function find(x) {
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    function union(x, y) {
        parent[find(x)] = find(y)

    # Union all friendships
    for i in range(n):
        for j in range(i + 1, n):
            if M[i][j] == 1:
                union(i, j)

    # Count unique roots
    return len(set(find(i) for i in range(n)))
```

### Complexity Analysis

- **Time Complexity:** O(n² * α(n)) for checking all pairs
- **Space Complexity:** O(n) for parent array

### Test Cases

**Test 1:** Two friend circles
- Input: "find_circle_num([[1,1,0],[1,1,0],[0,0,1]])"
- Expected: "2"

**Test 2:** One connected circle
- Input: "find_circle_num([[1,1,0],[1,1,1],[0,1,1]])"
- Expected: "1"

**Test 3:** All isolated
- Input: "find_circle_num([[1,0,0],[0,1,0],[0,0,1]])"
- Expected: "3"

---

## 4. Number of Provinces

**Difficulty:** medium
**Concept:** union-find

### Description

There are n cities. Some of them are connected, while some are not. If city a is connected directly with city b, and city b is connected directly with city c, then city a is connected indirectly with city c. A province is a group of directly or indirectly connected cities. You are given an n x n matrix isConnected where isConnected[i][j] = 1 if the ith city and jth city are directly connected. Return the total number of provinces.

### Key Insight

Identical to Friend Circles! Union all directly connected cities. Count components = number of provinces.

### Examples

**Example 1:**
- Input: isConnected=[[1,1,0],[1,1,0],[0,0,1]]
- Output: 2
- Explanation: Cities 0,1 form one province. City 2 forms another. Total: 2 provinces.

**Example 2:**
- Input: isConnected=[[1,0,0],[0,1,0],[0,0,1]]
- Output: 3
- Explanation: Each city is its own province. Total: 3 provinces.

### Hints

1. Same pattern as Friend Circles - union connected cities
2. Iterate: for i in range(n), for j in range(i+1, n)
3. If isConnected[i][j] == 1, union(i, j)
4. Count unique components: len(set(find(i) for i in range(n)))
5. Can also track: components = n, decrease on each successful union
6. Matrix is symmetric, so only check upper triangle

### Starter Code

**Python:**
```python
def find_circle_num(isConnected):
    """
    Count provinces using Union-Find.

    Args:
        isConnected: List[List[int]] - connectivity matrix

    Returns:
        int - number of provinces
    """
    n = len(isConnected)
    parent = list(range(n))

    def find(x):
        # TODO: Path compression
        pass

    def union(x, y):
        # TODO: Merge cities
        pass

    # TODO: Process all connections
    # TODO: Count provinces
    pass
```

**JavaScript:**
```javascript
function find_circle_num(isConnected) {
    """
    Count provinces using Union-Find.

    Args:
        isConnected: Array] - connectivity matrix

    Returns:
        int - number of provinces
    """
    n = len(isConnected)
    parent = list(range(n))

    function find(x) {
        // TODO: Path compression
  // TODO: implement
    function union(x, y) {
        // TODO: Merge cities
  // TODO: implement
    // TODO: Process all connections
    // TODO: Count provinces
  // TODO: implement
```

### Solution

**Python:**
```python
def find_circle_num(isConnected):
    n = len(isConnected)
    parent = list(range(n))

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        root_x = find(x)
        root_y = find(y)
        if root_x != root_y:
            parent[root_x] = root_y
            return True
        return False

    components = n
    for i in range(n):
        for j in range(i + 1, n):
            if isConnected[i][j] == 1:
                if union(i, j):
                    components -= 1

    return components
```

**JavaScript:**
```javascript
function find_circle_num(isConnected) {
    n = len(isConnected)
    parent = list(range(n))

    function find(x) {
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    function union(x, y) {
        root_x = find(x)
        root_y = find(y)
        if root_x != root_y:
            parent[root_x] = root_y
            return true
        return false

    components = n
    for i in range(n):
        for j in range(i + 1, n):
            if isConnected[i][j] == 1:
                if union(i, j):
                    components -= 1

    return components
```

### Complexity Analysis

- **Time Complexity:** O(n² * α(n)) for processing matrix
- **Space Complexity:** O(n) for parent array

### Test Cases

**Test 1:** Two provinces
- Input: "find_circle_num([[1,1,0],[1,1,0],[0,0,1]])"
- Expected: "2"

**Test 2:** Three separate provinces
- Input: "find_circle_num([[1,0,0],[0,1,0],[0,0,1]])"
- Expected: "3"

**Test 3:** All connected
- Input: "find_circle_num([[1,1,1],[1,1,1],[1,1,1]])"
- Expected: "1"

---

## 5. Graph Valid Tree

**Difficulty:** medium
**Concept:** union-find
**Family:** union-find:valid-tree

### Description

Given n nodes labeled from 0 to n-1 and a list of undirected edges, check whether these edges make up a valid tree. A valid tree must be connected and have no cycles.

### Key Insight

Tree properties: exactly n-1 edges, fully connected (1 component), no cycles. Use Union-Find to detect cycles while building. Valid tree iff all unions succeed.

### Examples

**Example 1:**
- Input: n=5, edges=[[0,1],[0,2],[0,3],[1,4]]
- Output: true
- Explanation: Forms a valid tree: 4 edges for 5 nodes, no cycles, all connected.

**Example 2:**
- Input: n=5, edges=[[0,1],[1,2],[2,3],[1,3],[1,4]]
- Output: false
- Explanation: 5 edges for 5 nodes. Cycle exists: 1-2-3-1. Not a tree.

### Hints

1. Tree with n nodes must have exactly n-1 edges. Check len(edges) == n-1 first
2. Initialize components = n. Must end with components = 1 (fully connected)
3. For each edge, union(a, b). If fails (already connected), cycle detected!
4. Alternative: count successful unions. Must be exactly n-1 for valid tree
5. Return True only if: correct edge count AND no cycles AND fully connected
6. Can combine checks: if all unions succeed and edge count is n-1, it's a valid tree

### Starter Code

**Python:**
```python
def valid_tree(n, edges):
    """
    Check if edges form a valid tree.

    Args:
        n: int - number of nodes
        edges: List[List[int]] - undirected edges

    Returns:
        bool - True if forms valid tree
    """
    # TODO: Quick check - tree must have exactly n-1 edges
    
    parent = list(range(n))

    def find(x):
        # TODO: Path compression
        pass

    def union(x, y):
        # TODO: Return False if cycle detected
        pass

    # TODO: Try to union all edges
    # TODO: Check if all unions succeeded (no cycles)
    pass
```

**JavaScript:**
```javascript
function valid_tree(n, edges) {
    """
    Check if edges form a valid tree.

    Args:
        n: int - number of nodes
        edges: Array] - undirected edges

    Returns:
        bool - true if forms valid tree
    """
    // TODO: Quick check - tree must have exactly n-1 edges
    
    parent = list(range(n))

    function find(x) {
        // TODO: Path compression
  // TODO: implement
    function union(x, y) {
        // TODO: Return false if cycle detected
  // TODO: implement
    // TODO: Try to union all edges
    // TODO: Check if all unions succeeded (no cycles)
  // TODO: implement
```

### Solution

**Python:**
```python
def valid_tree(n, edges):
    # Tree must have exactly n-1 edges
    if len(edges) != n - 1:
        return False

    parent = list(range(n))

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        root_x = find(x)
        root_y = find(y)
        if root_x == root_y:
            return False  # Cycle detected
        parent[root_x] = root_y
        return True

    # Check all unions succeed (no cycles)
    for a, b in edges:
        if not union(a, b):
            return False

    return True
```

**JavaScript:**
```javascript
function valid_tree(n, edges) {
    # Tree must have exactly n-1 edges
    if len(edges) != n - 1:
        return false

    parent = list(range(n))

    function find(x) {
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    function union(x, y) {
        root_x = find(x)
        root_y = find(y)
        if root_x == root_y:
            return false  # Cycle detected
        parent[root_x] = root_y
        return true

    # Check all unions succeed (no cycles)
    for a, b in edges:
        if not union(a, b):
            return false

    return true
```

### Complexity Analysis

- **Time Complexity:** O(n * α(n)) where n = number of edges
- **Space Complexity:** O(n) for parent array

### Test Cases

**Test 1:** Valid tree structure
- Input: "valid_tree(5, [[0,1],[0,2],[0,3],[1,4]])"
- Expected: "True"

**Test 2:** Contains cycle
- Input: "valid_tree(5, [[0,1],[1,2],[2,3],[1,3],[1,4]])"
- Expected: "False"

**Test 3:** Disconnected components
- Input: "valid_tree(4, [[0,1],[2,3]])"
- Expected: "False"

---

## 6. Accounts Merge

**Difficulty:** hard
**Concept:** union-find

### Description

Given a list of accounts where each element accounts[i] is a list of strings, where the first element accounts[i][0] is a name, and the rest of the elements are emails representing emails of the account. Merge accounts that belong to the same person. Two accounts belong to the same person if there is some common email. Return the accounts in sorted order.

### Key Insight

Union emails, not accounts! Create email→account mapping. If two emails in same account, union them. Group by root email, combine with name.

### Examples

**Example 1:**
- Input: accounts=[["John","john@mail.com","john_work@mail.com"],["John","john@mail.com","john_home@mail.com"],["John","different@mail.com"]]
- Output: [["John","different@mail.com"],["John","john@mail.com","john_home@mail.com","john_work@mail.com"]]
- Explanation: First two accounts share john@mail.com, so merge. Third is separate.

### Hints

1. Map each email to its owner name: email_to_name[email] = name
2. For each account, union all emails: union(emails[0], emails[1]), union(emails[0], emails[2]), etc.
3. Group emails by root: defaultdict(list), add email to groups[find(email)]
4. Build result: for each group, prepend name and sort emails
5. Initialize parent lazily: parent.setdefault(email, email)
6. Return sorted result (sort outer list by account name)

### Starter Code

**Python:**
```python
def accounts_merge(accounts):
    """
    Merge accounts with common emails using Union-Find.

    Args:
        accounts: List[List[str]] - [name, email1, email2, ...]

    Returns:
        List[List[str]] - merged accounts
    """
    from collections import defaultdict

    parent = {}
    email_to_name = {}

    def find(x):
        # TODO: Path compression
        pass

    def union(x, y):
        # TODO: Union two emails
        pass

    # TODO: For each account, union all emails together
    # TODO: Group emails by root, add name, sort emails
    pass
```

**JavaScript:**
```javascript
function accounts_merge(accounts) {
    """
    Merge accounts with common emails using Union-Find.

    Args:
        accounts: Array] - [name, email1, email2, ...]

    Returns:
        Array] - merged accounts
    """
    from collections import defaultdict

    parent = {}
    email_to_name = {}

    function find(x) {
        // TODO: Path compression
  // TODO: implement
    function union(x, y) {
        // TODO: Union two emails
  // TODO: implement
    // TODO: For each account, union all emails together
    // TODO: Group emails by root, add name, sort emails
  // TODO: implement
```

### Solution

**Python:**
```python
def accounts_merge(accounts):
    from collections import defaultdict

    parent = {}
    email_to_name = {}

    def find(x):
        parent.setdefault(x, x)
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        parent[find(x)] = find(y)

    # Union all emails in each account
    for account in accounts:
        name = account[0]
        emails = account[1:]
        for email in emails:
            email_to_name[email] = name
            if len(emails) > 0:
                union(emails[0], email)

    # Group emails by root
    groups = defaultdict(list)
    for email in email_to_name:
        groups[find(email)].append(email)

    # Build result: [name, sorted_emails]
    result = []
    for emails in groups.values():
        name = email_to_name[emails[0]]
        result.append([name] + sorted(emails))

    return result
```

**JavaScript:**
```javascript
function accounts_merge(accounts) {
    from collections import defaultdict

    parent = {}
    email_to_name = {}

    function find(x) {
        parent.setdefault(x, x)
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    function union(x, y) {
        parent[find(x)] = find(y)

    # Union all emails in each account
    for account in accounts:
        name = account[0]
        emails = account[1:]
        for email in emails:
            email_to_name[email] = name
            if len(emails) > 0:
                union(emails[0], email)

    # Group emails by root
    groups = defaultdict(list)
    for email in email_to_name:
        groups[find(email)].append(email)

    # Build result: [name, sorted_emails]
    result = []
    for emails in groups.values():
        name = email_to_name[emails[0]]
        result.append([name] + sorted(emails))

    return result
```

### Complexity Analysis

- **Time Complexity:** O(n*k*α(n) + n*k*log(k)) where n=accounts, k=emails per account
- **Space Complexity:** O(n*k) for parent and groups

### Test Cases

**Test 1:** Merge two accounts
- Input: "accounts_merge([[\"John\",\"john@mail.com\",\"john_work@mail.com\"],[\"John\",\"john@mail.com\",\"john_home@mail.com\"]])"
- Expected: "[[\"John\",\"john@mail.com\",\"john_home@mail.com\",\"john_work@mail.com\"]]"

**Test 2:** No common emails
- Input: "accounts_merge([[\"John\",\"john@mail.com\"],[\"Mary\",\"mary@mail.com\"]])"
- Expected: "[[\"John\",\"john@mail.com\"],[\"Mary\",\"mary@mail.com\"]]"

---

## 7. Smallest String With Swaps

**Difficulty:** medium
**Concept:** union-find

### Description

You are given a string s, and an array of pairs where pairs[i] = [a, b] indicates you can swap characters at indices a and b. You can swap the indices any number of times. Return the lexicographically smallest string that s can be changed to after using the swaps.

### Key Insight

Union connected indices! If you can swap (a,b) and (b,c), you can rearrange any subset {a,b,c}. Group indices by component, sort chars in each group, rebuild string.

### Examples

**Example 1:**
- Input: s="dcab", pairs=[[0,3],[1,2]]
- Output: "bacd"
- Explanation: Swap(0,3): "bcad", swap(1,2): "bacd". Or: indices {0,3} can swap, {1,2} can swap independently.

**Example 2:**
- Input: s="dcab", pairs=[[0,3],[1,2],[0,2]]
- Output: "abcd"
- Explanation: All indices connected: {0,1,2,3}. Can rearrange to alphabetical order.

### Hints

1. Union all pairs: for [a,b] in pairs, union(a, b)
2. Group indices by root: groups[find(i)].append(i)
3. For each group, collect characters and sort them
4. Build result: assign sorted chars back to sorted indices
5. Example: group {0,3}, chars "dc" → sorted "cd", assign result[0]="c", result[3]="d"
6. Convert list back to string: "".join(result)

### Starter Code

**Python:**
```python
def smallest_string_with_swaps(s, pairs):
    """
    Find lexicographically smallest string after swaps.

    Args:
        s: str - input string
        pairs: List[List[int]] - swappable index pairs

    Returns:
        str - smallest possible string
    """
    from collections import defaultdict

    n = len(s)
    parent = list(range(n))

    def find(x):
        # TODO: Path compression
        pass

    def union(x, y):
        # TODO: Union indices
        pass

    # TODO: Union all pairs
    # TODO: Group indices by root
    # TODO: Sort characters in each group
    # TODO: Rebuild string
    pass
```

**JavaScript:**
```javascript
function smallest_string_with_swaps(s, pairs) {
    """
    Find lexicographically smallest string after swaps.

    Args:
        s: str - input string
        pairs: Array] - swappable index pairs

    Returns:
        str - smallest possible string
    """
    from collections import defaultdict

    n = len(s)
    parent = list(range(n))

    function find(x) {
        // TODO: Path compression
  // TODO: implement
    function union(x, y) {
        // TODO: Union indices
  // TODO: implement
    // TODO: Union all pairs
    // TODO: Group indices by root
    // TODO: Sort characters in each group
    // TODO: Rebuild string
  // TODO: implement
```

### Solution

**Python:**
```python
def smallest_string_with_swaps(s, pairs):
    from collections import defaultdict

    n = len(s)
    parent = list(range(n))

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        parent[find(x)] = find(y)

    # Union all pairs
    for a, b in pairs:
        union(a, b)

    # Group indices by component
    groups = defaultdict(list)
    for i in range(n):
        groups[find(i)].append(i)

    # Build result
    result = list(s)
    for indices in groups.values():
        chars = sorted([s[i] for i in indices])
        indices.sort()
        for i, char in zip(indices, chars):
            result[i] = char

    return "".join(result)
```

**JavaScript:**
```javascript
function smallest_string_with_swaps(s, pairs) {
    from collections import defaultdict

    n = len(s)
    parent = list(range(n))

    function find(x) {
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    function union(x, y) {
        parent[find(x)] = find(y)

    # Union all pairs
    for a, b in pairs:
        union(a, b)

    # Group indices by component
    groups = defaultdict(list)
    for i in range(n):
        groups[find(i)].append(i)

    # Build result
    result = list(s)
    for indices in groups.values():
        chars = sorted([s[i] for i in indices])
        indices.sort()
        for i, char in zip(indices, chars):
            result[i] = char

    return "".join(result)
```

### Complexity Analysis

- **Time Complexity:** O(n*α(n) + m + n*log(n)) where m=pairs, n=string length
- **Space Complexity:** O(n) for parent and groups

### Test Cases

**Test 1:** Two separate swap groups
- Input: "smallest_string_with_swaps(\"dcab\", [[0,3],[1,2]])"
- Expected: "\"bacd\""

**Test 2:** All indices connected
- Input: "smallest_string_with_swaps(\"dcab\", [[0,3],[1,2],[0,2]])"
- Expected: "\"abcd\""

**Test 3:** No swaps allowed
- Input: "smallest_string_with_swaps(\"abc\", [])"
- Expected: "\"abc\""

---

## 8. Satisfiability of Equality Equations

**Difficulty:** medium
**Concept:** union-find

### Description

You are given an array of strings equations that represent relationships between variables. Each string equations[i] is of length 4 and takes one of two forms: "xi==yi" or "xi!=yi". Return true if it is possible to assign integers to variable names so as to satisfy all the given equations.

### Key Insight

Union all "==" equations first. Then check all "!=" equations - if both sides already in same component, contradiction! Otherwise satisfiable.

### Examples

**Example 1:**
- Input: equations=["a==b","b!=a"]
- Output: false
- Explanation: a==b means they must be equal. b!=a contradicts this.

**Example 2:**
- Input: equations=["a==b","b==c","a==c"]
- Output: true
- Explanation: All consistent: a=b=c

**Example 3:**
- Input: equations=["a==b","b!=c","c==a"]
- Output: false
- Explanation: a==b and c==a means b==c, contradicts b!=c

### Hints

1. Parse equation: var1 = eq[0], var2 = eq[3], op = eq[1:3]
2. Phase 1: for all "==" equations, union(var1, var2)
3. Phase 2: for all "!=" equations, if find(var1) == find(var2), return False
4. If all "!=" checks pass, return True
5. Use dictionary for parent: parent.setdefault(x, x)
6. Only 26 possible variables (lowercase letters)

### Starter Code

**Python:**
```python
def equations_possible(equations):
    """
    Check if equations are satisfiable using Union-Find.

    Args:
        equations: List[str] - equality/inequality constraints

    Returns:
        bool - True if satisfiable
    """
    parent = {}

    def find(x):
        # TODO: Path compression
        pass

    def union(x, y):
        # TODO: Merge variables
        pass

    # TODO: Phase 1: union all "==" equations
    # TODO: Phase 2: check all "!=" equations for conflicts
    pass
```

**JavaScript:**
```javascript
function equations_possible(equations) {
    """
    Check if equations are satisfiable using Union-Find.

    Args:
        equations: Array - equality/inequality constraints

    Returns:
        bool - true if satisfiable
    """
    parent = {}

    function find(x) {
        // TODO: Path compression
  // TODO: implement
    function union(x, y) {
        // TODO: Merge variables
  // TODO: implement
    // TODO: Phase 1: union all "==" equations
    // TODO: Phase 2: check all "!=" equations for conflicts
  // TODO: implement
```

### Solution

**Python:**
```python
def equations_possible(equations):
    parent = {}

    def find(x):
        parent.setdefault(x, x)
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        parent[find(x)] = find(y)

    # Phase 1: Process all "==" equations
    for eq in equations:
        if eq[1:3] == "==":
            union(eq[0], eq[3])

    # Phase 2: Check all "!=" equations
    for eq in equations:
        if eq[1:3] == "!=":
            if find(eq[0]) == find(eq[3]):
                return False

    return True
```

**JavaScript:**
```javascript
function equations_possible(equations) {
    parent = {}

    function find(x) {
        parent.setdefault(x, x)
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    function union(x, y) {
        parent[find(x)] = find(y)

    # Phase 1: Process all "==" equations
    for eq in equations:
        if eq[1:3] == "==":
            union(eq[0], eq[3])

    # Phase 2: Check all "!=" equations
    for eq in equations:
        if eq[1:3] == "!=":
            if find(eq[0]) == find(eq[3]):
                return false

    return true
```

### Complexity Analysis

- **Time Complexity:** O(n*α(26)) ≈ O(n) where n = number of equations
- **Space Complexity:** O(1) - at most 26 variables

### Test Cases

**Test 1:** Direct contradiction
- Input: "equations_possible([\"a==b\",\"b!=a\"])"
- Expected: "False"

**Test 2:** All consistent
- Input: "equations_possible([\"a==b\",\"b==c\",\"a==c\"])"
- Expected: "True"

**Test 3:** Transitive contradiction
- Input: "equations_possible([\"a==b\",\"b!=c\",\"c==a\"])"
- Expected: "False"

---

## 9. Longest Consecutive Sequence

**Difficulty:** hard
**Concept:** union-find

### Description

Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.

### Key Insight

Union-Find approach! For each number, union with number-1 and number+1 if they exist. Track component sizes. Max size = longest sequence.

### Examples

**Example 1:**
- Input: nums=[100,4,200,1,3,2]
- Output: 4
- Explanation: Longest consecutive sequence is [1,2,3,4]. Length is 4.

**Example 2:**
- Input: nums=[0,3,7,2,5,8,4,6,0,1]
- Output: 9
- Explanation: Longest sequence: [0,1,2,3,4,5,6,7,8]. Length is 9.

### Hints

1. Use set for O(1) lookup: num_set = set(nums)
2. Initialize each number: parent[num] = num, size[num] = 1
3. For each num, if num-1 exists, union(num, num-1)
4. For each num, if num+1 exists, union(num, num+1)
5. When unioning, add sizes: size[root] += size[other_root]
6. Return max(size.values()) for longest sequence

### Starter Code

**Python:**
```python
def longest_consecutive(nums):
    """
    Find longest consecutive sequence using Union-Find.

    Args:
        nums: List[int] - unsorted array

    Returns:
        int - length of longest consecutive sequence
    """
    if not nums:
        return 0

    parent = {}
    size = {}

    def find(x):
        # TODO: Path compression
        pass

    def union(x, y):
        # TODO: Merge and update size
        pass

    # TODO: For each number, union with num-1 and num+1 if exist
    # TODO: Return max size
    pass
```

**JavaScript:**
```javascript
function longest_consecutive(nums) {
    """
    Find longest consecutive sequence using Union-Find.

    Args:
        nums: Array - unsorted array

    Returns:
        int - length of longest consecutive sequence
    """
    if not nums:
        return 0

    parent = {}
    size = {}

    function find(x) {
        // TODO: Path compression
  // TODO: implement
    function union(x, y) {
        // TODO: Merge and update size
  // TODO: implement
    // TODO: For each number, union with num-1 and num+1 if exist
    // TODO: Return max size
  // TODO: implement
```

### Solution

**Python:**
```python
def longest_consecutive(nums):
    if not nums:
        return 0

    parent = {}
    size = {}

    def find(x):
        if x not in parent:
            parent[x] = x
            size[x] = 1
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        root_x = find(x)
        root_y = find(y)
        if root_x != root_y:
            parent[root_x] = root_y
            size[root_y] += size[root_x]

    num_set = set(nums)
    for num in num_set:
        if num - 1 in num_set:
            union(num, num - 1)
        if num + 1 in num_set:
            union(num, num + 1)

    return max(size.values()) if size else 0
```

**JavaScript:**
```javascript
function longest_consecutive(nums) {
    if not nums:
        return 0

    parent = {}
    size = {}

    function find(x) {
        if x not in parent:
            parent[x] = x
            size[x] = 1
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    function union(x, y) {
        root_x = find(x)
        root_y = find(y)
        if root_x != root_y:
            parent[root_x] = root_y
            size[root_y] += size[root_x]

    num_set = set(nums)
    for num in num_set:
        if num - 1 in num_set:
            union(num, num - 1)
        if num + 1 in num_set:
            union(num, num + 1)

    return max(size.values()) if size else 0
```

### Complexity Analysis

- **Time Complexity:** O(n * α(n)) ≈ O(n)
- **Space Complexity:** O(n) for parent and size

### Test Cases

**Test 1:** Sequence: 1,2,3,4
- Input: "longest_consecutive([100,4,200,1,3,2])"
- Expected: "4"

**Test 2:** Sequence: 0-8
- Input: "longest_consecutive([0,3,7,2,5,8,4,6,0,1])"
- Expected: "9"

**Test 3:** Duplicates handled
- Input: "longest_consecutive([1,2,0,1])"
- Expected: "3"

---

## 10. Number of Islands II

**Difficulty:** hard
**Concept:** union-find
**Family:** union-find:islands

### Description

You are given an empty 2D grid of size m x n. Initially, all cells are water. You perform addLand operations where addLand(row, col) turns the water at position (row, col) into land. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically. Return the number of islands after each addLand operation.

### Key Insight

Dynamic Union-Find! Convert 2D to 1D index. When adding land, check 4 neighbors. Union with existing land neighbors. Track component count carefully.

### Examples

**Example 1:**
- Input: m=3, n=3, positions=[[0,0],[0,1],[1,2],[2,1]]
- Output: [1,1,2,3]
- Explanation: After [0,0]: 1 island. After [0,1]: still 1 (merged). After [1,2]: 2 islands. After [2,1]: 3 islands.

### Hints

1. Convert 2D to 1D: index = row * n + col
2. Track land cells: land_set = set()
3. When adding land at (r,c): islands += 1 initially
4. Check 4 neighbors: (r-1,c), (r+1,c), (r,c-1), (r,c+1)
5. For each land neighbor, if union succeeds, islands -= 1
6. Use parent dict: only store existing land cells

### Starter Code

**Python:**
```python
def num_islands2(m, n, positions):
    """
    Track island count after each land addition.

    Args:
        m: int - number of rows
        n: int - number of columns
        positions: List[List[int]] - land additions

    Returns:
        List[int] - island count after each operation
    """
    parent = {}
    islands = 0
    result = []

    def find(x):
        # TODO: Path compression
        pass

    def union(x, y):
        # TODO: Union and return True if merged
        pass

    # TODO: For each position, add land and union with neighbors
    # TODO: Track island count
    pass
```

**JavaScript:**
```javascript
function num_islands2(m, n, positions) {
    """
    Track island count after each land addition.

    Args:
        m: int - number of rows
        n: int - number of columns
        positions: Array] - land additions

    Returns:
        Array - island count after each operation
    """
    parent = {}
    islands = 0
    result = []

    function find(x) {
        // TODO: Path compression
  // TODO: implement
    function union(x, y) {
        // TODO: Union and return true if merged
  // TODO: implement
    // TODO: For each position, add land and union with neighbors
    // TODO: Track island count
  // TODO: implement
```

### Solution

**Python:**
```python
def num_islands2(m, n, positions):
    parent = {}
    islands = 0
    result = []
    land = set()

    def find(x):
        if x not in parent:
            parent[x] = x
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        root_x = find(x)
        root_y = find(y)
        if root_x != root_y:
            parent[root_x] = root_y
            return True
        return False

    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    for r, c in positions:
        idx = r * n + c
        if idx in land:
            result.append(islands)
            continue

        land.add(idx)
        islands += 1

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n:
                neighbor = nr * n + nc
                if neighbor in land:
                    if union(idx, neighbor):
                        islands -= 1

        result.append(islands)

    return result
```

**JavaScript:**
```javascript
function num_islands2(m, n, positions) {
    parent = {}
    islands = 0
    result = []
    land = set()

    function find(x) {
        if x not in parent:
            parent[x] = x
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    function union(x, y) {
        root_x = find(x)
        root_y = find(y)
        if root_x != root_y:
            parent[root_x] = root_y
            return true
        return false

    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    for r, c in positions:
        idx = r * n + c
        if idx in land:
            result.append(islands)
            continue

        land.add(idx)
        islands += 1

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n:
                neighbor = nr * n + nc
                if neighbor in land:
                    if union(idx, neighbor):
                        islands -= 1

        result.append(islands)

    return result
```

### Complexity Analysis

- **Time Complexity:** O(k * α(k)) where k = number of operations
- **Space Complexity:** O(k) for parent and land tracking

### Test Cases

**Test 1:** Islands merge and separate
- Input: "num_islands2(3, 3, [[0,0],[0,1],[1,2],[2,1]])"
- Expected: "[1,1,2,3]"

**Test 2:** Single cell
- Input: "num_islands2(1, 1, [[0,0]])"
- Expected: "[1]"

---

## 11. Minimize Malware Spread

**Difficulty:** hard
**Concept:** union-find

### Description

You are given a network of n nodes represented as an n x n adjacency matrix graph where graph[i][j] = 1 means there is a direct connection between nodes i and j. Some nodes initial are initially infected by malware. Remove exactly one node from the initial list. Return the node that minimizes M(initial) - the total number of nodes eventually infected. If multiple nodes minimize M, return the node with smallest index.

### Key Insight

Complex Union-Find! Group clean nodes. For each infected node, if it's the ONLY infected in its component, removing it saves entire component. Find infected node that saves most nodes.

### Examples

**Example 1:**
- Input: graph=[[1,1,0],[1,1,0],[0,0,1]], initial=[0,1]
- Output: 0
- Explanation: Nodes 0,1 connected. Removing either stops spread. Return smaller index 0.

**Example 2:**
- Input: graph=[[1,1,0],[1,1,1],[0,1,1]], initial=[0,1]
- Output: 1
- Explanation: Removing 1 saves node 2. Removing 0 doesn't help (1 still infects 2).

### Hints

1. Step 1: Build union-find from graph. For i,j where graph[i][j]==1, union(i,j)
2. Step 2: Count size of each component: size[find(i)] += 1
3. Step 3: For each component, count infected nodes in it
4. Step 4: A component is "saveable" if it has exactly 1 infected node
5. Step 5: For each infected node, if it's alone in component, saved = size[component]
6. Step 6: Return infected node with max saved, tiebreak by smaller index
7. If no node saves anything, return min(initial)

### Starter Code

**Python:**
```python
def min_malware_spread(graph, initial):
    """
    Find which infected node to remove to minimize spread.

    Args:
        graph: List[List[int]] - adjacency matrix
        initial: List[int] - initially infected nodes

    Returns:
        int - node to remove
    """
    from collections import Counter

    n = len(graph)
    parent = list(range(n))

    def find(x):
        # TODO: Path compression
        pass

    def union(x, y):
        # TODO: Merge nodes
        pass

    # TODO: Union all connected nodes
    # TODO: Count component sizes
    # TODO: For each component, count infected nodes
    # TODO: Find infected node whose removal saves most nodes
    pass
```

**JavaScript:**
```javascript
function min_malware_spread(graph, initial) {
    """
    Find which infected node to remove to minimize spread.

    Args:
        graph: Array] - adjacency matrix
        initial: Array - initially infected nodes

    Returns:
        int - node to remove
    """
    from collections import Counter

    n = len(graph)
    parent = list(range(n))

    function find(x) {
        // TODO: Path compression
  // TODO: implement
    function union(x, y) {
        // TODO: Merge nodes
  // TODO: implement
    // TODO: Union all connected nodes
    // TODO: Count component sizes
    // TODO: For each component, count infected nodes
    // TODO: Find infected node whose removal saves most nodes
  // TODO: implement
```

### Solution

**Python:**
```python
def min_malware_spread(graph, initial):
    from collections import Counter

    n = len(graph)
    parent = list(range(n))

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        parent[find(x)] = find(y)

    # Build components
    for i in range(n):
        for j in range(i+1, n):
            if graph[i][j] == 1:
                union(i, j)

    # Count component sizes
    size = Counter()
    for i in range(n):
        size[find(i)] += 1

    # Count infected nodes per component
    infected_count = Counter()
    for node in initial:
        infected_count[find(node)] += 1

    # Find best node to remove
    infected_set = set(initial)
    best_node = min(initial)
    max_saved = 0

    for node in initial:
        root = find(node)
        if infected_count[root] == 1:
            saved = size[root]
            if saved > max_saved or (saved == max_saved and node < best_node):
                max_saved = saved
                best_node = node

    return best_node
```

**JavaScript:**
```javascript
function min_malware_spread(graph, initial) {
    from collections import Counter

    n = len(graph)
    parent = list(range(n))

    function find(x) {
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    function union(x, y) {
        parent[find(x)] = find(y)

    # Build components
    for i in range(n):
        for j in range(i+1, n):
            if graph[i][j] == 1:
                union(i, j)

    # Count component sizes
    size = Counter()
    for i in range(n):
        size[find(i)] += 1

    # Count infected nodes per component
    infected_count = Counter()
    for node in initial:
        infected_count[find(node)] += 1

    # Find best node to remove
    infected_set = set(initial)
    best_node = min(initial)
    max_saved = 0

    for node in initial:
        root = find(node)
        if infected_count[root] == 1:
            saved = size[root]
            if saved > max_saved or (saved == max_saved and node < best_node):
                max_saved = saved
                best_node = node

    return best_node
```

### Complexity Analysis

- **Time Complexity:** O(n² * α(n)) for building components
- **Space Complexity:** O(n) for parent, size, counts

### Test Cases

**Test 1:** Tie, return smaller
- Input: "min_malware_spread([[1,1,0],[1,1,0],[0,0,1]], [0,1])"
- Expected: "0"

**Test 2:** Removing 1 saves node 2
- Input: "min_malware_spread([[1,1,0],[1,1,1],[0,1,1]], [0,1])"
- Expected: "1"

---

## 12. Regions Cut By Slashes

**Difficulty:** medium
**Concept:** union-find

### Description

An n x n grid is composed of 1 x 1 squares where each 1 x 1 square consists of a "/", "\" or blank space. Return the number of regions. A region is formed by connecting spaces that are not separated by slashes.

### Key Insight

Advanced Union-Find! Divide each cell into 4 triangles (top, right, bottom, left). Union triangles based on slash direction. Count final components.

### Examples

**Example 1:**
- Input: grid=[" /","/ "]
- Output: 2
- Explanation: Grid creates 2 separate regions divided by the slashes.

**Example 2:**
- Input: grid=[" /","  "]
- Output: 1
- Explanation: All spaces connected, forms 1 region.

**Example 3:**
- Input: grid=["\/","/\\"]
- Output: 4
- Explanation: Slashes create 4 separate triangular regions.

### Hints

1. Each cell (r,c) has 4 triangles: top=0, right=1, bottom=2, left=3
2. Cell index: base = 4 * (r * n + c), triangles: base+0, base+1, base+2, base+3
3. Blank space " ": union all 4 triangles (they're all connected)
4. Forward slash "/": union top-left, union bottom-right
5. Backslash "\": union top-right, union bottom-left
6. Union with neighbors: right cell's left, bottom cell's top, etc.

### Starter Code

**Python:**
```python
def regions_by_slashes(grid):
    """
    Count regions formed by slashes using Union-Find.

    Args:
        grid: List[str] - n x n grid with "/", "\", or " "

    Returns:
        int - number of regions
    """
    n = len(grid)
    parent = list(range(4 * n * n))

    def find(x):
        # TODO: Path compression
        pass

    def union(x, y):
        # TODO: Merge triangles
        pass

    # TODO: For each cell, get 4 triangle indices
    # TODO: Union based on slash type
    # TODO: Union with neighbors
    pass
```

**JavaScript:**
```javascript
function regions_by_slashes(grid) {
    """
    Count regions formed by slashes using Union-Find.

    Args:
        grid: Array - n x n grid with "/", "\", or " "

    Returns:
        int - number of regions
    """
    n = len(grid)
    parent = list(range(4 * n * n))

    function find(x) {
        // TODO: Path compression
  // TODO: implement
    function union(x, y) {
        // TODO: Merge triangles
  // TODO: implement
    // TODO: For each cell, get 4 triangle indices
    // TODO: Union based on slash type
    // TODO: Union with neighbors
  // TODO: implement
```

### Solution

**Python:**
```python
def regions_by_slashes(grid):
    n = len(grid)
    parent = list(range(4 * n * n))

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        parent[find(x)] = find(y)

    for r in range(n):
        for c in range(n):
            base = 4 * (r * n + c)
            char = grid[r][c]

            # Union within cell based on slash
            if char == " ":
                union(base, base + 1)
                union(base + 1, base + 2)
                union(base + 2, base + 3)
            elif char == "/":
                union(base, base + 3)
                union(base + 1, base + 2)
            else:  # "\"
                union(base, base + 1)
                union(base + 2, base + 3)

            # Union with right neighbor
            if c + 1 < n:
                union(base + 1, 4 * (r * n + c + 1) + 3)

            # Union with bottom neighbor
            if r + 1 < n:
                union(base + 2, 4 * ((r + 1) * n + c))

    return sum(find(i) == i for i in range(4 * n * n))
```

**JavaScript:**
```javascript
function regions_by_slashes(grid) {
    n = len(grid)
    parent = list(range(4 * n * n))

    function find(x) {
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    function union(x, y) {
        parent[find(x)] = find(y)

    for r in range(n):
        for c in range(n):
            base = 4 * (r * n + c)
            char = grid[r][c]

            # Union within cell based on slash
            if char == " ":
                union(base, base + 1)
                union(base + 1, base + 2)
                union(base + 2, base + 3)
            elif char == "/":
                union(base, base + 3)
                union(base + 1, base + 2)
            else:  # "\"
                union(base, base + 1)
                union(base + 2, base + 3)

            # Union with right neighbor
            if c + 1 < n:
                union(base + 1, 4 * (r * n + c + 1) + 3)

            # Union with bottom neighbor
            if r + 1 < n:
                union(base + 2, 4 * ((r + 1) * n + c))

    return sum(find(i) == i for i in range(4 * n * n))
```

### Complexity Analysis

- **Time Complexity:** O(n² * α(n²))
- **Space Complexity:** O(n²) for parent array

### Test Cases

**Test 1:** Two regions
- Input: "regions_by_slashes([\" /\",\"/ \"])"
- Expected: "2"

**Test 2:** One region
- Input: "regions_by_slashes([\" /\",\"  \"])"
- Expected: "1"

**Test 3:** Complex pattern
- Input: "regions_by_slashes([\"\\\\/\",\"/\\\\\\\\\"])"
- Expected: "5"

---

## 13. Swim in Rising Water

**Difficulty:** hard
**Concept:** union-find

### Description

You are given an n x n grid where each value grid[i][j] represents the elevation at that point. Rain starts to fall. At time t, the water level is t. You can swim from a square to another if both squares are adjacent and the water level is at least the elevation of both squares. Return the minimum time until you can swim from the top left square to the bottom right square.

### Key Insight

Binary search + Union-Find OR process cells by elevation! Sort cells by height. Add cells one by one, union with neighbors. First time top-left connects to bottom-right = answer.

### Examples

**Example 1:**
- Input: grid=[[0,2],[1,3]]
- Output: 3
- Explanation: At t=3, all cells accessible. Path: (0,0) → (0,1) → (1,1).

**Example 2:**
- Input: grid=[[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]
- Output: 16
- Explanation: Need to wait until elevation 16 is submerged for path to exist.

### Hints

1. Create list: cells = [(grid[i][j], i, j) for all i,j], then sort
2. Convert 2D to 1D: index = r * n + c
3. Track accessible cells: accessible = set()
4. For each cell in sorted order, mark accessible, union with accessible neighbors
5. Check: if find(0) == find(n*n-1), return current elevation
6. Start and end: (0,0) maps to 0, (n-1,n-1) maps to n*n-1

### Starter Code

**Python:**
```python
def swim_in_water(grid):
    """
    Find minimum time to swim from top-left to bottom-right.

    Args:
        grid: List[List[int]] - elevation grid

    Returns:
        int - minimum time
    """
    n = len(grid)
    parent = list(range(n * n))

    def find(x):
        # TODO: Path compression
        pass

    def union(x, y):
        # TODO: Merge cells
        pass

    # TODO: Sort cells by elevation
    # TODO: Add cells one by one, union with accessible neighbors
    # TODO: Check when start connects to end
    pass
```

**JavaScript:**
```javascript
function swim_in_water(grid) {
    """
    Find minimum time to swim from top-left to bottom-right.

    Args:
        grid: Array] - elevation grid

    Returns:
        int - minimum time
    """
    n = len(grid)
    parent = list(range(n * n))

    function find(x) {
        // TODO: Path compression
  // TODO: implement
    function union(x, y) {
        // TODO: Merge cells
  // TODO: implement
    // TODO: Sort cells by elevation
    // TODO: Add cells one by one, union with accessible neighbors
    // TODO: Check when start connects to end
  // TODO: implement
```

### Solution

**Python:**
```python
def swim_in_water(grid):
    n = len(grid)
    parent = list(range(n * n))

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        parent[find(x)] = find(y)

    # Sort cells by elevation
    cells = []
    for i in range(n):
        for j in range(n):
            cells.append((grid[i][j], i, j))
    cells.sort()

    accessible = set()
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    for elevation, r, c in cells:
        idx = r * n + c
        accessible.add(idx)

        # Union with accessible neighbors
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n:
                neighbor = nr * n + nc
                if neighbor in accessible:
                    union(idx, neighbor)

        # Check if start and end are connected
        if find(0) == find(n * n - 1):
            return elevation

    return grid[n-1][n-1]
```

**JavaScript:**
```javascript
function swim_in_water(grid) {
    n = len(grid)
    parent = list(range(n * n))

    function find(x) {
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    function union(x, y) {
        parent[find(x)] = find(y)

    # Sort cells by elevation
    cells = []
    for i in range(n):
        for j in range(n):
            cells.append((grid[i][j], i, j))
    cells.sort()

    accessible = set()
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    for elevation, r, c in cells:
        idx = r * n + c
        accessible.add(idx)

        # Union with accessible neighbors
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n:
                neighbor = nr * n + nc
                if neighbor in accessible:
                    union(idx, neighbor)

        # Check if start and end are connected
        if find(0) == find(n * n - 1):
            return elevation

    return grid[n-1][n-1]
```

### Complexity Analysis

- **Time Complexity:** O(n² * log(n²) + n² * α(n²))
- **Space Complexity:** O(n²) for parent and cells

### Test Cases

**Test 1:** Small 2x2 grid
- Input: "swim_in_water([[0,2],[1,3]])"
- Expected: "3"

**Test 2:** Increasing grid
- Input: "swim_in_water([[0,1,2],[3,4,5],[6,7,8]])"
- Expected: "8"

---

## 14. Sentence Similarity II

**Difficulty:** medium
**Concept:** union-find

### Description

Given two sentences words1 and words2, and a list of similar word pairs, determine if the sentences are similar. Two sentences are similar if they have the same length and each pair of words at the same position are similar. Similarity is transitive.

### Key Insight

Union similar word pairs! Then check if corresponding words in sentences have same root. Transitive similarity = connected components.

### Examples

**Example 1:**
- Input: words1=["great","acting","skills"], words2=["fine","drama","talent"], pairs=[["great","fine"],["acting","drama"],["skills","talent"]]
- Output: true
- Explanation: Each corresponding word pair is similar or directly connected.

**Example 2:**
- Input: words1=["great"], words2=["great"], pairs=[]
- Output: true
- Explanation: Same word is always similar to itself.

### Hints

1. First check: len(words1) must equal len(words2)
2. Build union-find from pairs: for [w1, w2] in pairs, union(w1, w2)
3. For each position i, check if find(words1[i]) == find(words2[i])
4. If word not in parent, it's its own root (self-similar only)
5. All corresponding pairs must have same root
6. Use parent.setdefault(word, word) for initialization

### Starter Code

**Python:**
```python
def are_sentences_similar_two(words1, words2, pairs):
    """
    Check if sentences are similar using Union-Find.

    Args:
        words1: List[str] - first sentence
        words2: List[str] - second sentence
        pairs: List[List[str]] - similar word pairs

    Returns:
        bool - True if sentences similar
    """
    if len(words1) != len(words2):
        return False

    parent = {}

    def find(x):
        # TODO: Path compression
        pass

    def union(x, y):
        # TODO: Union similar words
        pass

    # TODO: Union all similar pairs
    # TODO: Check each corresponding word pair
    pass
```

**JavaScript:**
```javascript
function are_sentences_similar_two(words1, words2, pairs) {
    """
    Check if sentences are similar using Union-Find.

    Args:
        words1: Array - first sentence
        words2: Array - second sentence
        pairs: Array] - similar word pairs

    Returns:
        bool - true if sentences similar
    """
    if len(words1) != len(words2):
        return false

    parent = {}

    function find(x) {
        // TODO: Path compression
  // TODO: implement
    function union(x, y) {
        // TODO: Union similar words
  // TODO: implement
    // TODO: Union all similar pairs
    // TODO: Check each corresponding word pair
  // TODO: implement
```

### Solution

**Python:**
```python
def are_sentences_similar_two(words1, words2, pairs):
    if len(words1) != len(words2):
        return False

    parent = {}

    def find(x):
        parent.setdefault(x, x)
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        parent[find(x)] = find(y)

    # Union all similar pairs
    for w1, w2 in pairs:
        union(w1, w2)

    # Check each corresponding pair
    for w1, w2 in zip(words1, words2):
        if find(w1) != find(w2):
            return False

    return True
```

**JavaScript:**
```javascript
function are_sentences_similar_two(words1, words2, pairs) {
    if len(words1) != len(words2):
        return false

    parent = {}

    function find(x) {
        parent.setdefault(x, x)
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    function union(x, y) {
        parent[find(x)] = find(y)

    # Union all similar pairs
    for w1, w2 in pairs:
        union(w1, w2)

    # Check each corresponding pair
    for w1, w2 in zip(words1, words2):
        if find(w1) != find(w2):
            return false

    return true
```

### Complexity Analysis

- **Time Complexity:** O(n + p*α(w)) where n=sentence length, p=pairs, w=unique words
- **Space Complexity:** O(w) for parent dictionary

### Test Cases

**Test 1:** All pairs connected
- Input: "are_sentences_similar_two([\"great\",\"acting\",\"skills\"], [\"fine\",\"drama\",\"talent\"], [[\"great\",\"fine\"],[\"acting\",\"drama\"],[\"skills\",\"talent\"]])"
- Expected: "True"

**Test 2:** Different words, no pairs
- Input: "are_sentences_similar_two([\"great\"], [\"good\"], [])"
- Expected: "False"

**Test 3:** Identical words
- Input: "are_sentences_similar_two([\"great\"], [\"great\"], [])"
- Expected: "True"

---

## 15. Evaluate Division

**Difficulty:** medium
**Concept:** union-find

### Description

You are given equations in the format A / B = k, where A and B are variables represented as strings, and k is a real number. Given some queries, return the answers. If the answer does not exist, return -1.0. Example: equations = [["a","b"],["b","c"]], values = [2.0,3.0], queries = [["a","c"],["b","a"],["a","e"]].

### Key Insight

Weighted Union-Find! Store weight from node to parent. To find a/b, compute weight[a]/weight[b] if they're in same component. Path compression must update weights.

### Examples

**Example 1:**
- Input: equations=[["a","b"],["b","c"]], values=[2.0,3.0], queries=[["a","c"],["b","a"]]
- Output: [6.0, 0.5]
- Explanation: a/b=2, b/c=3, so a/c=6. b/a=1/2=0.5.

**Example 2:**
- Input: equations=[["a","b"]], values=[0.5], queries=[["a","b"],["b","a"],["a","c"]]
- Output: [0.5, 2.0, -1.0]
- Explanation: a/b=0.5, b/a=2.0, c not defined so -1.0.

### Hints

1. parent[x] = parent node, weight[x] = x/parent[x]
2. Initialize: parent[x] = x, weight[x] = 1.0
3. Union(a, b, val): if a/b = val, connect them with weighted edge
4. Find with path compression: update weight[x] *= weight[parent[x]]
5. Query a/c: if same component, return weight[a]/weight[c]
6. If different components or variable undefined, return -1.0

### Starter Code

**Python:**
```python
def calc_equation(equations, values, queries):
    """
    Evaluate division queries using weighted Union-Find.

    Args:
        equations: List[List[str]] - division equations
        values: List[float] - equation values
        queries: List[List[str]] - queries to evaluate

    Returns:
        List[float] - query results
    """
    parent = {}
    weight = {}

    def find(x):
        # TODO: Path compression with weight update
        pass

    def union(x, y, value):
        # TODO: Union with weighted edge
        pass

    # TODO: Build weighted union-find from equations
    # TODO: Answer queries
    pass
```

**JavaScript:**
```javascript
function calc_equation(equations, values, queries) {
    """
    Evaluate division queries using weighted Union-Find.

    Args:
        equations: Array] - division equations
        values: Array - equation values
        queries: Array] - queries to evaluate

    Returns:
        Array - query results
    """
    parent = {}
    weight = {}

    function find(x) {
        // TODO: Path compression with weight update
  // TODO: implement
    function union(x, y, value) {
        // TODO: Union with weighted edge
  // TODO: implement
    // TODO: Build weighted union-find from equations
    // TODO: Answer queries
  // TODO: implement
```

### Solution

**Python:**
```python
def calc_equation(equations, values, queries):
    parent = {}
    weight = {}

    def find(x):
        if x not in parent:
            return None
        if parent[x] != x:
            original_parent = parent[x]
            parent[x] = find(parent[x])
            weight[x] *= weight[original_parent]
        return parent[x]

    def union(x, y, value):
        if x not in parent:
            parent[x] = x
            weight[x] = 1.0
        if y not in parent:
            parent[y] = y
            weight[y] = 1.0

        root_x = find(x)
        root_y = find(y)

        if root_x != root_y:
            parent[root_x] = root_y
            weight[root_x] = value * weight[y] / weight[x]

    # Build graph
    for (a, b), val in zip(equations, values):
        union(a, b, val)

    # Answer queries
    result = []
    for a, b in queries:
        if a not in parent or b not in parent:
            result.append(-1.0)
        elif find(a) != find(b):
            result.append(-1.0)
        else:
            result.append(weight[a] / weight[b])

    return result
```

**JavaScript:**
```javascript
function calc_equation(equations, values, queries) {
    parent = {}
    weight = {}

    function find(x) {
        if x not in parent:
            return null
        if parent[x] != x:
            original_parent = parent[x]
            parent[x] = find(parent[x])
            weight[x] *= weight[original_parent]
        return parent[x]

    function union(x, y, value) {
        if x not in parent:
            parent[x] = x
            weight[x] = 1.0
        if y not in parent:
            parent[y] = y
            weight[y] = 1.0

        root_x = find(x)
        root_y = find(y)

        if root_x != root_y:
            parent[root_x] = root_y
            weight[root_x] = value * weight[y] / weight[x]

    # Build graph
    for (a, b), val in zip(equations, values):
        union(a, b, val)

    # Answer queries
    result = []
    for a, b in queries:
        if a not in parent or b not in parent:
            result.append(-1.0)
        elif find(a) != find(b):
            result.append(-1.0)
        else:
            result.append(weight[a] / weight[b])

    return result
```

### Complexity Analysis

- **Time Complexity:** O((n + q) * α(n)) where n=equations, q=queries
- **Space Complexity:** O(n) for parent and weight

### Test Cases

**Test 1:** Chain division
- Input: "calc_equation([[\"a\",\"b\"],[\"b\",\"c\"]], [2.0,3.0], [[\"a\",\"c\"],[\"b\",\"a\"],[\"a\",\"e\"]])"
- Expected: "[6.0, 0.5, -1.0]"

**Test 2:** Reciprocal
- Input: "calc_equation([[\"a\",\"b\"]], [0.5], [[\"a\",\"b\"],[\"b\",\"a\"]])"
- Expected: "[0.5, 2.0]"

---
