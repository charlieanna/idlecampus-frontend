import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';
import { TestCase } from '../../types/testCase';

/**
 * Social Graph Database Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches graph database concepts
 * while building a social network system like LinkedIn or Facebook.
 *
 * Key Concepts:
 * - Graph data model (nodes, edges, properties)
 * - Relationship queries and traversals
 * - Friend-of-friend (2-hop) patterns
 * - Neo4j/graph database patterns
 * - Bidirectional relationships
 * - Graph algorithms (shortest path, mutual friends)
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic graph operations - FRs satisfied!
 * Steps 4-6: Optimize for graph-specific queries (friend suggestions, shortest path)
 * Step 7-8: Scale and optimize for production
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const socialGraphRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a social graph database for a professional networking platform like LinkedIn",

  interviewer: {
    name: 'Marcus Thompson',
    role: 'Senior Engineering Manager',
    avatar: '👨‍💼',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-operations',
      category: 'functional',
      question: "What are the main things users do with connections in a social network?",
      answer: "Users have several core experiences:\n1. **Connect with others**: Send and accept connection requests\n2. **View their network**: See who they're connected to\n3. **Explore connections**: See mutual connections, view someone's network\n4. **Find connection paths**: How are you connected to someone (degrees of separation)\n5. **Get suggestions**: Find people you might know",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-5',
      learningPoint: "Social graphs are fundamentally about relationships, not just entities. The connections ARE the product.",
    },
    {
      id: 'relationship-type',
      category: 'functional',
      question: "Are connections one-way (like Twitter follows) or two-way (like Facebook friends)?",
      answer: "Two-way symmetric connections like LinkedIn or Facebook. Both users must agree to connect. This is different from asymmetric follows (Twitter, Instagram).",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Bidirectional relationships are harder to model than unidirectional follows - affects data structure and queries",
    },
    {
      id: 'friend-of-friend',
      category: 'functional',
      question: "Should users see friend suggestions based on mutual connections?",
      answer: "Yes! This is a killer feature. 'People You May Know' shows second-degree connections (friends of friends). If you have 5+ mutual friends with someone, we suggest them.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Friend-of-friend (2-hop queries) are THE classic graph database use case. This is why we need a graph DB!",
    },

    // IMPORTANT - Clarifications
    {
      id: 'connection-strength',
      category: 'clarification',
      question: "Do we track connection strength or just binary connected/not-connected?",
      answer: "For MVP, just binary. In v2 we could add interaction signals (messages, profile views, etc.) but that's out of scope for now.",
      importance: 'important',
      insight: "Weighted edges add complexity - good to defer for MVP",
    },
    {
      id: 'degree-of-separation',
      category: 'clarification',
      question: "Should users see how they're connected to someone? Like 'Connected via John and Sarah'?",
      answer: "Yes! Show the shortest path between two users, up to 3 degrees of separation. Beyond 3 degrees, just say 'Outside your network'.",
      importance: 'important',
      revealsRequirement: 'FR-3',
      learningPoint: "Shortest path queries are a classic graph algorithm - expensive in relational DBs, fast in graph DBs",
    },
    {
      id: 'network-size',
      category: 'clarification',
      question: "Is there a limit on how many connections someone can have?",
      answer: "Good question! LinkedIn has a 30,000 connection limit. Let's use that. Most users have 50-500 connections, but power users can have thousands.",
      importance: 'nice-to-have',
      insight: "Connection limits help with performance and prevent spam",
    },

    // SCOPE
    {
      id: 'scope-features',
      category: 'scope',
      question: "What about groups, events, or company pages?",
      answer: "Let's focus on person-to-person connections for the MVP. Groups and company pages are separate features we can add later.",
      importance: 'nice-to-have',
      insight: "Person-to-person is the core graph. Other features can build on top.",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // 1. THROUGHPUT
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "100 million registered users, 20 million daily active users (DAU)",
      importance: 'critical',
      learningPoint: "LinkedIn has 900M+ users. We're building for a medium-scale social network.",
    },
    {
      id: 'throughput-connections',
      category: 'throughput',
      question: "How many new connections are created per day?",
      answer: "About 10 million new connections per day",
      importance: 'critical',
      calculation: {
        formula: "10M ÷ 86,400 sec = 115 connections/sec",
        result: "~115 writes/sec (350 at peak)",
      },
      learningPoint: "Connection creation is relatively rare compared to reads",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many graph queries per day? (view network, friend suggestions, etc.)",
      answer: "About 500 million graph queries per day",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 queries/sec",
        result: "~5,800 reads/sec (17,500 at peak)",
      },
      learningPoint: "50:1 read-to-write ratio - caching will help but graph queries are complex",
    },

    // 2. PAYLOAD
    {
      id: 'payload-graph-size',
      category: 'payload',
      question: "What's the average number of connections per user?",
      answer: "Average 250 connections per user, median 100. Power users can have up to 30,000.",
      importance: 'important',
      calculation: {
        formula: "100M users × 250 connections ÷ 2 = 12.5B edges",
        result: "~12.5 billion total connections (edges)",
      },
      learningPoint: "Divide by 2 because connections are bidirectional - each connection is shared by 2 users",
    },

    // 3. LATENCY
    {
      id: 'latency-network-view',
      category: 'latency',
      question: "How fast should viewing someone's network be?",
      answer: "p99 under 200ms for simple queries (1st-degree connections). Friend-of-friend queries can be slower, p99 under 500ms.",
      importance: 'critical',
      learningPoint: "1-hop queries should be instant. Multi-hop queries are more expensive.",
    },
    {
      id: 'latency-suggestions',
      category: 'latency',
      question: "What about computing friend suggestions?",
      answer: "These can be computed asynchronously in the background. Real-time calculation isn't required - we can cache results and refresh daily.",
      importance: 'important',
      insight: "Expensive graph algorithms can run offline, then cache results",
    },

    // 4. BURSTS
    {
      id: 'burst-viral',
      category: 'burst',
      question: "Are there traffic spikes we should plan for?",
      answer: "Yes! When influencers or celebrities join, they can get 10,000+ connection requests in a day. Also, conferences cause regional spikes.",
      importance: 'important',
      insight: "Popular users create hotspots - need to handle celebrity-scale graphs",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-operations', 'relationship-type', 'friend-of-friend'],
  criticalFRQuestionIds: ['core-operations', 'relationship-type', 'friend-of-friend'],
  criticalScaleQuestionIds: ['throughput-reads', 'latency-network-view', 'payload-graph-size'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can create bidirectional connections',
      description: 'Send and accept connection requests to build your professional network',
      emoji: '🤝',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can view their network',
      description: 'See all your 1st-degree connections and their basic info',
      emoji: '👥',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can find connection paths',
      description: 'See how you\'re connected to someone (shortest path up to 3 degrees)',
      emoji: '🔗',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users get friend suggestions',
      description: 'Discover people you may know based on mutual connections',
      emoji: '💡',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can view mutual connections',
      description: 'See friends you have in common with someone',
      emoji: '🔄',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '20 million',
    writesPerDay: '10 million connections',
    readsPerDay: '500 million graph queries',
    peakMultiplier: 3,
    readWriteRatio: '50:1',
    calculatedWriteRPS: { average: 115, peak: 350 },
    calculatedReadRPS: { average: 5787, peak: 17500 },
    maxPayloadSize: '~1KB per connection',
    storagePerRecord: 'User: ~2KB, Connection: ~100 bytes',
    storageGrowthPerYear: '~365GB connections/year',
    redirectLatencySLA: 'p99 < 200ms (1-hop), p99 < 500ms (2-hop)',
    createLatencySLA: 'p99 < 100ms (create connection)',
  },

  architecturalImplications: [
    '✅ Graph structure → Use graph database (Neo4j) not relational DB',
    '✅ Multi-hop queries → Graph DBs are 100-1000x faster than SQL JOINs',
    '✅ 12.5B edges → Need efficient graph storage and traversal',
    '✅ Read-heavy (50:1) → Cache friend suggestions and popular queries',
    '✅ Bidirectional edges → Model as single edge with both directions',
  ],

  outOfScope: [
    'Connection strength/weights',
    'Groups and company pages',
    'Blocking/unfriending',
    'Privacy controls (public vs private connections)',
    'Activity feed or messaging',
  ],

  keyInsight: "First, let's make it WORK. We'll build a system that can store connections and answer basic graph queries. The power of graph databases comes from traversal performance - we'll see this when we implement friend-of-friend queries!",
};

// =============================================================================
// STEP 1: The Beginning - Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to ConnectPro! You're building the next LinkedIn.",
  hook: "Your first user just signed up. They want to start building their professional network.",
  challenge: "Set up the basic infrastructure so users can connect to your system.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your social network is online!",
  achievement: "Users can now connect to your platform",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Ready for connections', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle social connections yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building a Social Graph System',
  conceptExplanation: `Every social network starts with users connecting to your servers.

When someone wants to add a connection:
1. Their app (Client) sends a request to your App Server
2. The server processes the connection logic
3. The server returns success/failure

But the REAL magic is in how we store relationships. That comes next!`,
  whyItMatters: 'Graph systems are fundamentally different from traditional CRUD apps. Relationships are first-class citizens.',
  keyPoints: [
    'Client sends connection requests to App Server',
    'App Server handles business logic for social graph',
    'Graph structure will be stored differently than traditional apps',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────┐
│   Client    │ ──────▶ │   App Server    │
│  (Browser)  │ ◀────── │  (Graph Logic)  │
└─────────────┘         └─────────────────┘
`,
  keyConcepts: [
    {
      title: 'Graph System',
      explanation: 'Optimized for storing and querying relationships, not just entities',
      icon: '🕸️',
    },
  ],
  quickCheck: {
    question: 'What makes a social graph different from a typical user database?',
    options: [
      'It stores more users',
      'The relationships between users are as important as the users themselves',
      'It uses special hardware',
      'It encrypts all data',
    ],
    correctIndex: 1,
    explanation: 'In a graph system, the EDGES (connections) are first-class data. Queries focus on traversing relationships.',
  },
};

const step1: GuidedStep = {
  id: 'social-graph-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Users can connect to the social network platform',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing the social network', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles graph queries and connection logic', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send connection requests' },
    ],
    successCriteria: ['Add Client', 'Add App Server', 'Connect Client → App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'Add Client and App Server from the component palette',
    level2: 'Drag Client and App Server, then connect Client to App Server',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Graph APIs and Python Handlers
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your App Server is connected, but it's empty!",
  hook: "Users are trying to add connections, but the server returns errors. We need to implement the graph APIs!",
  challenge: "Configure the APIs for graph operations and write Python handlers for creating connections and querying the graph.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Graph APIs are working!",
  achievement: "Users can create connections and query their network",
  metrics: [
    { label: 'APIs configured', after: '3 endpoints' },
    { label: 'Code written', after: '✓ Working' },
  ],
  nextTeaser: "But when the server restarts, all connections disappear!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Graph API Design & Python Implementation',
  conceptExplanation: `Your App Server needs to handle graph-specific operations. You'll implement these in Python!

**1. Create Connection (POST /api/v1/connections)** — You'll implement this
- Receives: {user_a_id, user_b_id}
- Creates: Bidirectional connection between two users
- Your code: Add edge in both directions, store in memory

**2. Get Connections (GET /api/v1/users/:id/connections)** — You'll implement this
- Receives: User ID
- Returns: List of 1st-degree connections
- Your code: Traverse graph to find direct neighbors

**3. Find Path (GET /api/v1/path/:from/:to)** — You'll implement this
- Receives: Two user IDs
- Returns: Shortest path between them (up to 3 degrees)
- Your code: Breadth-first search (BFS) algorithm

**By the end of this step you should have:**
1. ✅ APIs assigned to the App Server
2. ✅ Python handlers implemented for graph operations`,
  whyItMatters: 'Graph operations are different from CRUD. We traverse relationships, not just fetch records.',
  keyPoints: [
    'Bidirectional connections: store edge in both directions',
    'BFS (Breadth-First Search) for shortest path queries',
    'Graph traversal is the core operation, not table lookups',
    'In-memory graph for now - proper graph DB comes next',
  ],
  diagram: `
Graph Structure in Memory:
┌─────────────────────────────────────┐
│  User A ──────▶ User B              │
│     ↑             │                 │
│     │             ▼                 │
│  User D ◀────── User C              │
└─────────────────────────────────────┘

BFS Traversal (A to C):
Level 0: [A]
Level 1: [B, D]  (A's neighbors)
Level 2: [C]     (Found! Path: A → B → C)
`,
  keyConcepts: [
    { title: 'Bidirectional Edge', explanation: 'Connection stored in both directions for fast lookup', icon: '↔️' },
    { title: 'BFS', explanation: 'Breadth-First Search finds shortest path in unweighted graphs', icon: '🔍' },
    { title: 'Graph Traversal', explanation: 'Walking the edges to find related nodes', icon: '🚶' },
  ],
  quickCheck: {
    question: 'Why use BFS instead of DFS for finding the shortest path?',
    options: [
      'BFS is always faster',
      'BFS explores level-by-level, guaranteeing the shortest path in unweighted graphs',
      'DFS uses too much memory',
      'BFS is easier to code',
    ],
    correctIndex: 1,
    explanation: 'BFS explores all nodes at distance k before exploring distance k+1, so the first path found is the shortest.',
  },
};

const step2: GuidedStep = {
  id: 'social-graph-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'App Server must handle graph operations with Python code',
    taskDescription: 'Configure APIs and implement Python handlers for connections, network queries, and path finding',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'Client' },
      { type: 'app_server', reason: 'Configure APIs and write Python graph code', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Already connected' },
    ],
    successCriteria: [
      'Click App Server to open inspector',
      'Assign POST /api/v1/connections, GET /api/v1/users/*/connections, GET /api/v1/path/*/*',
      'Open Python tab and implement graph handlers',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Click App Server → APIs tab → Assign graph endpoints, then Python tab',
    level2: 'Implement create_connection(), get_connections(), and find_path() using BFS',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: The Crisis - Add Graph Database (Neo4j)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "3 AM alert! Your server crashed during a deployment.",
  hook: "When it restarted... ALL the connections were GONE! Your users' entire professional networks - vanished!",
  challenge: "In-memory storage is volatile. We need a REAL graph database that persists connections and makes traversals blazing fast!",
  illustration: 'server-crash',
};

const step3Celebration: CelebrationContent = {
  emoji: '🗄️',
  message: "Your graph is now persistent and optimized!",
  achievement: "Neo4j stores connections durably and accelerates graph queries",
  metrics: [
    { label: 'Data durability', before: '❌ Lost on restart', after: '✓ Persisted forever' },
    { label: 'Friend-of-friend query', before: '500ms (in-memory)', after: '10ms (Neo4j)' },
    { label: 'Storage', after: 'Neo4j Graph Database' },
  ],
  nextTeaser: "Great! But complex queries like friend suggestions are still slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Why Graph Databases for Social Networks',
  conceptExplanation: `**The problem with relational databases for graphs:**

In PostgreSQL, finding friends-of-friends requires expensive JOINs:
\`\`\`sql
SELECT DISTINCT u.*
FROM users u
JOIN connections c1 ON u.id = c1.user_b_id
JOIN connections c2 ON c1.user_a_id = c2.user_b_id
WHERE c2.user_a_id = 'your_id'
  AND u.id != 'your_id'
  AND u.id NOT IN (SELECT user_b_id FROM connections WHERE user_a_id = 'your_id')
\`\`\`

**Performance:**
- 1-hop (friends): Fast in SQL
- 2-hop (friends-of-friends): Slow, requires JOIN
- 3-hop: VERY slow, multiple JOINs
- 4+ hop: Practically impossible at scale

**Graph databases like Neo4j:**
- Store relationships as first-class pointers (not foreign keys!)
- Traversals are pointer-following (constant time per hop)
- Cypher query language designed for graph patterns

**Neo4j Cypher for friends-of-friends:**
\`\`\`cypher
MATCH (me:User {id: 'your_id'})-[:CONNECTED_TO*2]-(friend_of_friend)
WHERE friend_of_friend.id <> 'your_id'
  AND NOT (me)-[:CONNECTED_TO]-(friend_of_friend)
RETURN DISTINCT friend_of_friend
\`\`\`

**Result:** 100-1000x faster for multi-hop queries!`,
  whyItMatters: 'LinkedIn\'s entire value prop depends on graph queries. "People You May Know" would be impossible with SQL at scale.',
  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Finding 2nd and 3rd degree connections',
    howTheyDoIt: 'Built custom graph database (before Neo4j existed). Now uses distributed graph processing for 900M+ users.',
  },
  famousIncident: {
    title: 'LinkedIn\'s "Nth Degree" Problem',
    company: 'LinkedIn',
    year: '2009',
    whatHappened: 'Early LinkedIn tried using Oracle for graph queries. Computing "People You May Know" took hours in batch jobs. Friend suggestions were often days out of date. Users complained connections weren\'t showing up.',
    lessonLearned: 'Use the right tool for the job. Graph databases exist because relational DBs fundamentally can\'t do graph traversal efficiently.',
    icon: '🔗',
  },
  keyPoints: [
    'Graph DBs store edges as pointers, not foreign keys',
    'Traversals are O(1) per hop in graph DB vs O(N) JOIN in SQL',
    'Cypher (Neo4j) is like SQL but for graph patterns',
    'Multi-hop queries (2+ degrees) are where graph DBs shine',
  ],
  diagram: `
RELATIONAL (PostgreSQL):
┌─────────────────────────────────────┐
│ users: id, name                     │
│ connections: user_a_id, user_b_id   │
└─────────────────────────────────────┘
Problem: Finding friends-of-friends
requires expensive JOINs!

GRAPH (Neo4j):
┌─────────────────────────────────────┐
│    (User A)──▶(User B)──▶(User C)   │
│       ↓         ↓         ↓         │
│    (User D)   (User E)  (User F)    │
└─────────────────────────────────────┘
Solution: Follow pointers!
A → B → C is 2 pointer hops!
`,
  keyConcepts: [
    { title: 'Index-Free Adjacency', explanation: 'Neo4j stores edges as direct pointers, no index lookup needed', icon: '➡️' },
    { title: 'Cypher', explanation: 'Neo4j query language for pattern matching in graphs', icon: '🔍' },
    { title: 'Labeled Property Graph', explanation: 'Nodes and edges can have labels and properties', icon: '🏷️' },
  ],
  quickCheck: {
    question: 'Why is Neo4j faster than PostgreSQL for finding friends-of-friends?',
    options: [
      'Neo4j uses faster hardware',
      'Neo4j uses in-memory caching',
      'Neo4j follows direct pointers, PostgreSQL must perform expensive JOINs',
      'Neo4j is written in a faster programming language',
    ],
    correctIndex: 2,
    explanation: 'Graph DBs store relationships as pointers. Traversing is O(1) per hop. SQL JOINs scan entire tables for matches.',
  },
};

const step3: GuidedStep = {
  id: 'social-graph-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Connections must persist and graph queries must be fast',
    taskDescription: 'Add Neo4j Graph Database and connect App Server to it',
    componentsNeeded: [
      { type: 'client', reason: 'Users accessing the network', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles graph API requests', displayName: 'App Server' },
      { type: 'graph_database', reason: 'Stores graph structure with fast traversals', displayName: 'Neo4j' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send requests' },
      { from: 'App Server', to: 'Neo4j', reason: 'Server queries graph database' },
    ],
    successCriteria: ['Add Client, App Server, Neo4j', 'Connect Client → App Server → Neo4j'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'graph_database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'graph_database' },
    ],
  },
  hints: {
    level1: 'Add a Graph Database (Neo4j) and connect App Server to it',
    level2: 'Build: Client → App Server → Graph Database (Neo4j)',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'graph_database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'graph_database' },
    ],
  },
};

// =============================================================================
// STEP 4: Friend-of-Friend Queries - The Power of Graphs
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🔍',
  scenario: "Your 'People You May Know' feature just launched!",
  hook: "Users LOVE it... but each request takes 2 seconds! The graph database is being hammered with complex 2-hop queries.",
  challenge: "Optimize friend-of-friend queries by adding a cache for frequently accessed graph patterns.",
  illustration: 'slow-query',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Friend suggestions are now instant!",
  achievement: "Cache accelerates repeated graph traversals",
  metrics: [
    { label: 'Friend-of-friend query', before: '2000ms', after: '50ms' },
    { label: 'Cache hit rate', after: '90%' },
    { label: 'Neo4j load', before: '100%', after: '10%' },
  ],
  nextTeaser: "Awesome! But what happens when a celebrity joins?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching Graph Queries',
  conceptExplanation: `**The challenge with graph queries:**

Even though Neo4j is fast, computing friend suggestions for ALL users in real-time is expensive:
- User with 500 friends → scan 500 connections
- Each friend has ~250 connections → ~125,000 candidates
- Filter out existing friends → compute mutual friend counts
- Sort by mutual friend count → return top 10

This is too slow for every page load!

**Solution: Cache friend suggestions**

**Pattern 1: Cache computed results**
- Run expensive graph query once
- Store results in Redis for 24 hours
- Serve from cache until it expires
- Background job refreshes cache daily

**Pattern 2: Cache intermediate results**
- Cache each user's 1st-degree network
- Compute 2nd-degree from cached data
- Much faster than hitting Neo4j repeatedly

**For friend suggestions, we use Pattern 1:**
\`\`\`python
def get_friend_suggestions(user_id):
    # Check cache first
    cached = redis.get(f"suggestions:{user_id}")
    if cached:
        return cached

    # Cache miss - query Neo4j
    suggestions = neo4j.run_friend_of_friend_query(user_id)

    # Cache for 24 hours
    redis.setex(f"suggestions:{user_id}", 86400, suggestions)
    return suggestions
\`\`\``,
  whyItMatters: 'Friend suggestions don\'t need to be real-time. Caching expensive graph computations is critical for performance.',
  realWorldExample: {
    company: 'Facebook',
    scenario: 'Computing "People You May Know" for 3 billion users',
    howTheyDoIt: 'Background jobs compute suggestions using distributed graph processing (Apache Giraph). Results cached per user. Refreshed weekly.',
  },
  famousIncident: {
    title: 'Twitter\'s "Who to Follow" Debacle',
    company: 'Twitter',
    year: '2012',
    whatHappened: 'Twitter\'s recommendation engine was computing suggestions in real-time for every page load. Under peak traffic, the system couldn\'t keep up. The "Who to Follow" section would often show "Loading..." or stale data.',
    lessonLearned: 'Expensive graph computations should run offline in batch jobs. Cache the results. Real-time is rarely necessary for suggestions.',
    icon: '🐦',
  },
  keyPoints: [
    'Friend suggestions can be computed offline (batch jobs)',
    'Cache results in Redis for fast retrieval',
    'TTL of 24 hours balances freshness vs performance',
    'Cache hit rate of 90%+ is achievable',
  ],
  diagram: `
WITHOUT CACHE:
┌────────┐    Every request    ┌────────┐
│  User  │ ──────────────────▶ │ Neo4j  │
└────────┘    2000ms query     └────────┘

WITH CACHE:
┌────────┐    1. Check cache   ┌────────┐
│  User  │ ──────────────────▶ │ Redis  │ (50ms)
└────────┘                     └────────┘
                                    │
                            Cache miss? │
                                    ▼
                              ┌────────┐
                              │ Neo4j  │ (2000ms)
                              └────────┘
                                    │
                          Store in cache │
                                    ▼
                              ┌────────┐
                              │ Redis  │
                              └────────┘
`,
  keyConcepts: [
    { title: 'Cache-Aside', explanation: 'Check cache first, compute on miss, store result', icon: '📦' },
    { title: 'TTL', explanation: 'Time-To-Live: suggestions expire after 24 hours', icon: '⏰' },
    { title: 'Batch Processing', explanation: 'Precompute expensive results offline', icon: '⚙️' },
  ],
  quickCheck: {
    question: 'Why cache friend suggestions for 24 hours instead of computing them in real-time?',
    options: [
      'To save money on server costs',
      'Graph queries are expensive, and suggestions don\'t need to be instant',
      'Redis is faster than Neo4j',
      'Neo4j doesn\'t support real-time queries',
    ],
    correctIndex: 1,
    explanation: 'Friend suggestions don\'t change minute-to-minute. Caching for 24 hours gives 90%+ hit rate while keeping results reasonably fresh.',
  },
};

const step4: GuidedStep = {
  id: 'social-graph-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Friend suggestions must be fast and scalable',
    taskDescription: 'Add Redis cache for graph query results',
    componentsNeeded: [
      { type: 'client', reason: 'Users accessing the network', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles requests and caching logic', displayName: 'App Server' },
      { type: 'graph_database', reason: 'Stores graph structure', displayName: 'Neo4j' },
      { type: 'cache', reason: 'Caches friend suggestions', displayName: 'Redis Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'User requests' },
      { from: 'App Server', to: 'Neo4j', reason: 'Graph queries' },
      { from: 'App Server', to: 'Cache', reason: 'Cache suggestions' },
    ],
    successCriteria: ['Add Redis Cache', 'Connect App Server to both Neo4j and Cache'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'graph_database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'graph_database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Add a Cache (Redis) and connect App Server to it',
    level2: 'App Server should connect to both Neo4j (for graph queries) and Cache (for results)',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'graph_database' },
      { type: 'cache' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'graph_database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 5: Scale Out - Load Balancing for Traffic Spikes
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📈',
  scenario: "BREAKING: A celebrity just joined your platform!",
  hook: "Within minutes, 50,000 people are viewing their profile and sending connection requests. Your single App Server is at 100% CPU!",
  challenge: "Add a load balancer to distribute traffic across multiple servers.",
  illustration: 'celebrity-spike',
};

const step5Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "Traffic is distributed smoothly!",
  achievement: "Load balancer handles celebrity-scale spikes",
  metrics: [
    { label: 'Capacity', before: '1,000 req/s', after: '50,000 req/s' },
    { label: 'Availability', before: 'Single point of failure', after: '99.99% uptime' },
    { label: 'Servers', before: '1', after: 'Auto-scaling' },
  ],
  nextTeaser: "Perfect! But what if Neo4j goes down?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing for Social Graph Systems',
  conceptExplanation: `**The celebrity problem:**

When a celebrity joins:
- Their profile gets 100K+ views/hour
- They receive 10K+ connection requests
- Single server melts under load

**Solution: Load Balancer + Multiple App Servers**

The load balancer:
1. Receives ALL incoming traffic
2. Distributes requests across servers (round-robin or least-connections)
3. Detects unhealthy servers via health checks
4. Removes failed servers automatically

**For social graphs:**
- App servers are STATELESS (all state in Neo4j + Redis)
- Any server can handle any request
- Scale out by adding more servers
- No session affinity needed

**Algorithms:**
- **Round Robin**: Requests rotate through servers (1→2→3→1)
- **Least Connections**: Send to least-busy server
- **IP Hash**: Same user → same server (useful for caching)`,
  whyItMatters: 'Viral growth is unpredictable. Load balancing lets you handle 10x spikes without downtime.',
  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Handling "LinkedIn Influencers" traffic',
    howTheyDoIt: 'Auto-scales from 100s to 1000s of servers. Load balancers direct traffic to least-loaded servers.',
  },
  famousIncident: {
    title: 'Parler\'s AWS Removal',
    company: 'Parler',
    year: '2021',
    whatHappened: 'When Parler was removed from AWS, they had to migrate their entire infrastructure to new providers within days. Their lack of proper load balancing and multi-region setup made the migration catastrophic. The site was down for weeks.',
    lessonLearned: 'Load balancers and horizontal scaling aren\'t just for performance - they enable agility and resilience.',
    icon: '🔌',
  },
  keyPoints: [
    'Stateless app servers can scale horizontally',
    'Load balancer distributes traffic evenly',
    'Health checks remove failed servers automatically',
    'No single point of failure for compute layer',
  ],
  diagram: `
                              ┌─────────────┐
                        ┌────▶│ App Server 1│──┐
                        │     └─────────────┘  │
┌────────┐   ┌─────────┐│     ┌─────────────┐  │    ┌────────┐
│ Client │──▶│   LB    │┼────▶│ App Server 2│──┼───▶│ Neo4j  │
└────────┘   └─────────┘│     └─────────────┘  │    └────────┘
                        │     ┌─────────────┐  │
                        └────▶│ App Server 3│──┘
                              └─────────────┘
`,
  keyConcepts: [
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle more load', icon: '📈' },
    { title: 'Health Checks', explanation: 'LB pings servers, removes unhealthy ones', icon: '💓' },
    { title: 'Stateless', explanation: 'Servers store no local state, all data in DB/cache', icon: '🔄' },
  ],
  quickCheck: {
    question: 'Why must app servers be stateless for effective load balancing?',
    options: [
      'Stateless servers are faster',
      'Any server can handle any request without needing local data',
      'Stateless servers use less memory',
      'Load balancers require it',
    ],
    correctIndex: 1,
    explanation: 'If servers store local state (like user sessions), requests must go to the same server. Stateless servers let the LB distribute freely.',
  },
};

const step5: GuidedStep = {
  id: 'social-graph-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'System must handle celebrity-scale traffic spikes',
    taskDescription: 'Add Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'client', reason: 'Users accessing the network', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic across servers', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Handles graph requests', displayName: 'App Server' },
      { type: 'graph_database', reason: 'Stores graph structure', displayName: 'Neo4j' },
      { type: 'cache', reason: 'Caches suggestions', displayName: 'Redis' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'All traffic enters via LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB distributes to servers' },
      { from: 'App Server', to: 'Neo4j', reason: 'Graph queries' },
      { from: 'App Server', to: 'Redis', reason: 'Cache access' },
    ],
    successCriteria: [
      'Add Load Balancer',
      'Reconnect: Client → LB → App Server → Neo4j + Redis',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'graph_database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'graph_database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Add Load Balancer between Client and App Server',
    level2: 'Reconnect: Client → Load Balancer → App Server, keep Neo4j and Redis connections',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'graph_database' },
      { type: 'cache' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'graph_database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 6: Graph Database Replication
// =============================================================================

const step6Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster strikes at 2 AM. Neo4j crashed due to hardware failure!",
  hook: "All connection data is gone. Users can't see their networks. Connection requests fail. Your social graph is DEAD!",
  challenge: "Add Neo4j replication so the graph survives database failures.",
  illustration: 'database-crash',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "Your graph is now highly available!",
  achievement: "Neo4j replicas provide fault tolerance",
  metrics: [
    { label: 'Availability', before: '99%', after: '99.99%' },
    { label: 'Data loss risk', before: 'High', after: 'Near zero' },
    { label: 'Failover time', before: 'Hours', after: 'Seconds' },
  ],
  nextTeaser: "Excellent! Now let's scale out the app servers...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Graph Database Replication',
  conceptExplanation: `**Neo4j Replication: Causal Clustering**

Neo4j uses a **Leader-Follower** replication model:

**Core Servers (Write Cluster):**
- Leader: Handles ALL write operations
- Followers: Replicate writes from leader
- If leader fails, followers elect new leader
- Minimum 3 core servers for safety (quorum)

**Read Replicas (Optional):**
- Asynchronously replicate from core servers
- Handle read-only queries (e.g., view network, friend suggestions)
- Can add many replicas to scale read throughput
- Don't participate in leader election

**For social graphs:**
- Writes: New connections (relatively rare)
- Reads: View network, suggestions (very frequent)
- Read replicas scale the read-heavy workload

**Consistency:**
- **Causal Consistency**: Reads see writes in causal order
- If A creates connection, then B queries, B sees the connection
- Good enough for social networks (eventual consistency)`,
  whyItMatters: 'Your entire business depends on the graph. Neo4j going down = complete outage. Replication is mandatory.',
  realWorldExample: {
    company: 'eBay',
    scenario: 'Product catalog graph with billions of relationships',
    howTheyDoIt: 'Uses Neo4j with 3 core servers + 10 read replicas. Reads scale horizontally, writes go to leader.',
  },
  famousIncident: {
    title: 'GitLab Database Deletion',
    company: 'GitLab',
    year: '2017',
    whatHappened: 'An engineer accidentally deleted the production database during maintenance. They had replication, but discovered it was silently failing. They lost 6 hours of user data.',
    lessonLearned: 'Test your replication and failover regularly! Monitor replication lag. Simulate failures in staging.',
    icon: '🗑️',
  },
  keyPoints: [
    'Neo4j uses causal clustering for replication',
    'Core servers handle writes, read replicas scale reads',
    'Minimum 3 core servers for fault tolerance',
    'Automatic leader election on failure',
  ],
  diagram: `
┌─────────────────────────────────────────────────┐
│         NEO4J CAUSAL CLUSTERING                 │
├─────────────────────────────────────────────────┤
│                                                 │
│   CORE SERVERS (Write Cluster):                │
│   ┌────────┐  writes  ┌────────┐  ┌────────┐  │
│   │ Leader │ ────────▶│Follower│  │Follower│  │
│   └────────┘          └────────┘  └────────┘  │
│       │                                         │
│       │ replicate to read replicas              │
│       ▼                                         │
│   ┌────────────┐  ┌────────────┐               │
│   │Read Replica│  │Read Replica│  (scale reads)│
│   └────────────┘  └────────────┘               │
│                                                 │
│   App Servers:                                  │
│   - Writes → Leader only                        │
│   - Reads → Any read replica                    │
└─────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Causal Clustering', explanation: 'Leader-follower with automatic failover', icon: '🔄' },
    { title: 'Quorum', explanation: 'Majority agreement needed for leader election', icon: '🗳️' },
    { title: 'Read Replicas', explanation: 'Scale read throughput without affecting writes', icon: '📖' },
  ],
  quickCheck: {
    question: 'Why does Neo4j need 3 core servers instead of 2?',
    options: [
      'To have more storage capacity',
      'To achieve quorum (majority) for leader election during failures',
      'Because Neo4j requires it',
      'To balance the load evenly',
    ],
    correctIndex: 1,
    explanation: 'With 3 servers, if 1 fails, the remaining 2 can form a majority (quorum) to elect a new leader. With 2 servers, a single failure prevents quorum.',
  },
};

const step6: GuidedStep = {
  id: 'social-graph-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'Graph database must be highly available',
    taskDescription: 'Configure Neo4j replication with 3+ replicas',
    componentsNeeded: [
      { type: 'client', reason: 'Users', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Handles requests', displayName: 'App Server' },
      { type: 'graph_database', reason: 'Configure replication', displayName: 'Neo4j' },
      { type: 'cache', reason: 'Caches results', displayName: 'Redis' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Traffic entry' },
      { from: 'Load Balancer', to: 'App Server', reason: 'Distribute requests' },
      { from: 'App Server', to: 'Neo4j', reason: 'Graph operations' },
      { from: 'App Server', to: 'Redis', reason: 'Caching' },
    ],
    successCriteria: [
      'Click Neo4j',
      'Enable replication',
      'Set replica count to 3',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'graph_database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'graph_database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'Click Neo4j → Configuration → Enable replication',
    level2: 'Set replica count to 3 for fault tolerance',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'graph_database' },
      { type: 'cache' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'graph_database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 7: Horizontal Scaling - Multiple App Instances
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🚀',
  scenario: "You've grown to 20 million daily active users!",
  hook: "The Load Balancer is ready, but you still only have ONE app server! It's maxed out handling all those graph queries.",
  challenge: "Scale horizontally by running multiple app server instances.",
  illustration: 'scale-out',
};

const step7Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "You're ready for massive scale!",
  achievement: "Multiple app servers share the load",
  metrics: [
    { label: 'App instances', before: '1', after: '5+' },
    { label: 'Request capacity', before: '1K/s', after: '20K+/s' },
    { label: 'Availability', before: '99%', after: '99.99%' },
  ],
  nextTeaser: "Time for the final step - cost optimization!",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Scaling App Servers for Graph Workloads',
  conceptExplanation: `**Why horizontal scaling works for graph systems:**

App servers in our architecture are **stateless**:
- All graph data lives in Neo4j
- All cached results live in Redis
- No local state on app servers

This means:
- Any server can handle any request
- Load balancer can distribute freely
- Add/remove servers without coordination

**How many servers do you need?**

\`\`\`
Calculation:
- Peak traffic: 17,500 requests/sec
- Per-server capacity: ~1,000 req/sec
- Needed: 17,500 / 1,000 = 17.5
- With safety margin (70% utilization): 25 servers
\`\`\`

**Auto-scaling:**
- Scale out when CPU > 70%
- Scale in when CPU < 30%
- Minimum 3 servers (high availability)
- Maximum based on budget`,
  whyItMatters: 'Social networks have unpredictable viral growth. Auto-scaling handles spikes without manual intervention.',
  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Handling daily traffic variations',
    howTheyDoIt: 'Auto-scales from 200 servers at 3 AM to 1000+ during business hours. Saves millions in infrastructure costs.',
  },
  keyPoints: [
    'Stateless servers are easy to scale horizontally',
    'Load balancer distributes across all instances',
    'Auto-scaling responds to traffic patterns',
    'Always run minimum 3 instances for availability',
  ],
  diagram: `
Before (Single Server):
┌──────┐   ┌────┐   ┌──────┐
│Client│──▶│ LB │──▶│Server│ ← 100% CPU!
└──────┘   └────┘   └──────┘

After (Horizontal Scaling):
                    ┌──────┐
              ┌────▶│Srv 1 │
              │     └──────┘
              │     ┌──────┐
┌──────┐   ┌────┐  │Srv 2 │
│Client│──▶│ LB │─┼▶└──────┘
└──────┘   └────┘  │ ┌──────┐
              │    │Srv 3 │
              └───▶└──────┘
`,
  keyConcepts: [
    { title: 'Stateless', explanation: 'Servers have no local state, all data external', icon: '🔄' },
    { title: 'Auto-scaling', explanation: 'Automatically add/remove servers based on load', icon: '📈' },
  ],
  quickCheck: {
    question: 'If peak traffic is 20,000 req/s and each server handles 1,000 req/s, how many servers do you need?',
    options: [
      '20 servers (exact match)',
      '28-30 servers (with 70% utilization target)',
      '40 servers (100% safety margin)',
      '10 servers (Neo4j handles the rest)',
    ],
    correctIndex: 1,
    explanation: '20,000 / 1,000 = 20, but you should target 70% utilization for safety: 20 / 0.7 ≈ 29 servers.',
  },
};

const step7: GuidedStep = {
  id: 'social-graph-step-7',
  stepNumber: 7,
  frIndex: 5,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'System must handle 20M DAU with low latency',
    taskDescription: 'Configure App Server to run 3+ instances',
    componentsNeeded: [
      { type: 'client', reason: 'Users', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Scale to 3+ instances', displayName: 'App Server' },
      { type: 'graph_database', reason: 'Graph storage', displayName: 'Neo4j' },
      { type: 'cache', reason: 'Caches results', displayName: 'Redis' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Entry point' },
      { from: 'Load Balancer', to: 'App Server', reason: 'Distribute load' },
      { from: 'App Server', to: 'Neo4j', reason: 'Graph queries' },
      { from: 'App Server', to: 'Redis', reason: 'Caching' },
    ],
    successCriteria: [
      'Click App Server',
      'Set instances to 3 or more',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'graph_database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'graph_database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },
  hints: {
    level1: 'Click App Server → Configuration → Set instances',
    level2: 'Set instances to 3 for horizontal scaling',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'graph_database' },
      { type: 'cache' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'graph_database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 8: Final Exam - Production Readiness
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🎯',
  scenario: "Final Exam! Your social graph system will be tested in production.",
  hook: "Your architecture will face real-world scenarios: traffic spikes, database failures, and cost constraints.",
  challenge: "Build a complete, production-ready social graph database system that passes all tests while staying under budget.",
  illustration: 'final-exam',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "Congratulations! You've built a production-grade social graph system!",
  achievement: "Complete graph database architecture with all optimizations",
  metrics: [
    { label: 'Test cases passed', after: '7/7 ✓' },
    { label: '2-hop query latency', after: '<100ms' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Monthly cost', after: 'Under budget' },
  ],
  nextTeaser: "You've mastered graph database design! Try advanced patterns or tackle a new challenge.",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Production-Ready Graph Database Systems',
  conceptExplanation: `**What makes a graph system production-ready?**

1. **Performance:**
   - 1-hop queries: < 50ms p99
   - 2-hop queries: < 200ms p99
   - 3-hop queries: < 500ms p99

2. **Scalability:**
   - Load balancer for traffic distribution
   - Multiple app server instances
   - Graph database read replicas

3. **Reliability:**
   - Database replication (3+ copies)
   - Automatic failover
   - No single points of failure

4. **Cost efficiency:**
   - Cache expensive graph computations
   - Right-size infrastructure
   - Auto-scale based on demand

**The complete architecture:**
- Client → Load Balancer → App Servers (stateless)
- App Servers → Neo4j (replicated) for graph storage
- App Servers → Redis for caching graph results
- All components redundant (no SPOF)`,
  whyItMatters: 'Graph systems are complex. Getting all the pieces right separates a prototype from a production system.',
  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Serving 900M+ users with <200ms graph queries',
    howTheyDoIt: 'Heavily sharded graph database, aggressive caching, offline batch jobs for expensive computations.',
  },
  keyPoints: [
    'Multi-hop queries are the hardest challenge',
    'Caching graph results is critical for performance',
    'Replication protects against data loss',
    'Auto-scaling handles traffic spikes',
  ],
};

const step8: GuidedStep = {
  id: 'social-graph-step-8',
  stepNumber: 8,
  frIndex: 6,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'Final Exam: Pass all production test cases',
    taskDescription: 'Build complete architecture that passes all functional and performance requirements',
    componentsNeeded: [
      { type: 'client', reason: 'Users', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Traffic distribution', displayName: 'Load Balancer' },
      { type: 'app_server', reason: '3+ instances', displayName: 'App Server' },
      { type: 'graph_database', reason: 'Replicated Neo4j', displayName: 'Neo4j' },
      { type: 'cache', reason: 'Graph result caching', displayName: 'Redis' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Entry point' },
      { from: 'Load Balancer', to: 'App Server', reason: 'Distribute load' },
      { from: 'App Server', to: 'Neo4j', reason: 'Graph operations' },
      { from: 'App Server', to: 'Redis', reason: 'Caching' },
    ],
    successCriteria: [
      'Pass FR-1: Create connections',
      'Pass FR-2: View network (1-hop)',
      'Pass FR-3: Find shortest path (2-3 hop)',
      'Pass FR-4: Friend suggestions',
      'Pass NFR-P1: 2-hop query latency < 200ms',
      'Pass NFR-S1: Handle traffic spike (10K RPS)',
      'Pass NFR-R1: Database failover',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'graph_database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'graph_database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
  },
  hints: {
    level1: 'Build complete system with all components configured properly',
    level2: 'Ensure: Load Balancer, 3+ App instances, Neo4j with replication, Redis cache',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'graph_database' },
      { type: 'cache' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'graph_database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const socialGraphDbGuidedTutorial: GuidedTutorial = {
  problemId: 'social-graph-db-guided',
  problemTitle: 'Build a Social Graph Database - A Graph DB Journey',

  requirementsPhase: socialGraphRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  finalExamTestCases: [
    {
      name: 'Create Connections',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Users can create bidirectional connections',
      traffic: { type: 'mixed', rps: 50, readRps: 25, writeRps: 25 },
      duration: 30,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'View Network (1-hop)',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Users can view their 1st-degree connections quickly',
      traffic: { type: 'read', rps: 500, readRps: 500 },
      duration: 30,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'Find Shortest Path (2-3 hop)',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Find connection paths between users up to 3 degrees',
      traffic: { type: 'read', rps: 200, readRps: 200 },
      duration: 30,
      passCriteria: { maxP99Latency: 500, maxErrorRate: 0.01 },
    },
    {
      name: 'Friend Suggestions',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Generate friend suggestions based on mutual connections',
      traffic: { type: 'read', rps: 300, readRps: 300 },
      duration: 30,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-P1: 2-hop Query Performance',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 1,000 friend-of-friend queries/sec with p99 < 200ms',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 60,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: Traffic Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle celebrity-scale traffic spike (10K RPS)',
      traffic: { type: 'mixed', rps: 10000, readRps: 9000, writeRps: 1000 },
      duration: 60,
      passCriteria: { maxP99Latency: 500, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-R1: Database Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Neo4j primary fails, system maintains availability via replicas',
      traffic: { type: 'mixed', rps: 1000, readRps: 900, writeRps: 100 },
      duration: 90,
      failureInjection: { type: 'db_crash', atSecond: 45, recoverySecond: 65 },
      passCriteria: { minAvailability: 0.99, maxDowntime: 10, maxErrorRate: 0.1 },
    },
  ] as TestCase[],
};

export function getSocialGraphDbGuidedTutorial(): GuidedTutorial {
  return socialGraphDbGuidedTutorial;
}

export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = socialGraphRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= socialGraphRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
