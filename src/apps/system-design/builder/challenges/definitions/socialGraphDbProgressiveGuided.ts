import { GuidedTutorial } from '../../types/guidedTutorial';

export const socialGraphDbProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'social-graph-db-progressive',
  title: 'Design Social Graph Database',
  description: 'Build a graph database optimized for social networks from friend connections to news feed generation',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design efficient graph storage for social relationships',
    'Implement friend-of-friend queries at scale',
    'Build mutual friends and recommendations',
    'Handle billions of edges with low latency',
    'Optimize for social network access patterns'
  ],
  prerequisites: ['Graph databases', 'Social networks', 'Distributed systems'],
  tags: ['graph-database', 'social-network', 'relationships', 'recommendations', 'scale'],

  progressiveStory: {
    title: 'Social Graph Database Evolution',
    premise: "You're building the graph database powering a social network. Starting with basic friend connections, you'll evolve to support complex queries like mutual friends, friend suggestions, and news feed ranking at massive scale.",
    phases: [
      { phase: 1, title: 'Connections', description: 'Friend relationships' },
      { phase: 2, title: 'Queries', description: 'Social graph traversals' },
      { phase: 3, title: 'Features', description: 'Recommendations and feed' },
      { phase: 4, title: 'Scale', description: 'Billions of edges' }
    ]
  },

  steps: [
    // PHASE 1: Connections (Steps 1-3)
    {
      id: 'step-1',
      title: 'User Node Storage',
      phase: 1,
      phaseTitle: 'Connections',
      learningObjective: 'Store user profiles as graph nodes',
      thinkingFramework: {
        framework: 'Vertex Storage',
        approach: 'Each user is a node with properties. Separate storage for node data and adjacency lists. Optimize for property lookup and edge traversal independently.',
        keyInsight: 'User node has two access patterns: property lookup (show profile) and edge traversal (list friends). Different indexes serve different patterns.'
      },
      requirements: {
        functional: [
          'Create user nodes with properties',
          'Update node properties',
          'Delete nodes (handle edges)',
          'Query nodes by properties'
        ],
        nonFunctional: [
          'Node lookup < 5ms',
          'Support 1B nodes'
        ]
      },
      hints: [
        'Node: {id, properties: {name, email, bio, created_at}}',
        'Index: B-tree on id, secondary indexes on properties',
        'Storage: node properties separate from edge lists'
      ],
      expectedComponents: ['Node Store', 'Property Index', 'Node Manager'],
      successCriteria: ['Nodes created', 'Properties queried'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Friend Edge Storage',
      phase: 1,
      phaseTitle: 'Connections',
      learningObjective: 'Store friend relationships as edges',
      thinkingFramework: {
        framework: 'Adjacency List',
        approach: 'Friend relationship = bidirectional edge. Store adjacency list per user for fast "get all friends". Edge properties: when connected, how met.',
        keyInsight: 'Adjacency list makes "get friends" O(degree) not O(all edges). For user with 500 friends among 1B total edges, this is critical difference.'
      },
      requirements: {
        functional: [
          'Create friend connection (bidirectional)',
          'Remove friend connection',
          'Get all friends of user',
          'Check if two users are friends'
        ],
        nonFunctional: [
          'Add friend < 50ms',
          'Get friends < 10ms'
        ]
      },
      hints: [
        'Edge: {from_id, to_id, type: "friend", properties: {since, source}}',
        'Bidirectional: store edge in both directions for fast lookup',
        'Adjacency: edges[user_id] = [friend_ids]'
      ],
      expectedComponents: ['Edge Store', 'Adjacency Index', 'Edge Manager'],
      successCriteria: ['Edges created', 'Adjacency queries fast'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Relationship Types',
      phase: 1,
      phaseTitle: 'Connections',
      learningObjective: 'Support different relationship types',
      thinkingFramework: {
        framework: 'Edge Labels',
        approach: 'Not just friends: followers, blocked, family, coworkers. Different relationship types have different semantics. Filter traversals by edge type.',
        keyInsight: 'Social graphs have multiple edge types. "Show my coworker posts" vs "show friend posts". Edge type is first-class filter in queries.'
      },
      requirements: {
        functional: [
          'Multiple relationship types (friend, follow, block)',
          'Query by relationship type',
          'Directional vs bidirectional edges',
          'Edge type statistics'
        ],
        nonFunctional: [
          'Type-filtered query < 15ms',
          'Support 10+ edge types'
        ]
      },
      hints: [
        'Edge types: friend (bi), follow (uni), block (uni), family (bi)',
        'Index: adjacency list per (user_id, edge_type)',
        'Query: getEdges(user_id, type="friend")'
      ],
      expectedComponents: ['Edge Type Manager', 'Type-Filtered Index', 'Relationship API'],
      successCriteria: ['Multiple types work', 'Filtered queries fast'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Queries (Steps 4-6)
    {
      id: 'step-4',
      title: 'Friend-of-Friend Query',
      phase: 2,
      phaseTitle: 'Queries',
      learningObjective: 'Find 2-hop connections efficiently',
      thinkingFramework: {
        framework: 'Breadth-First Traversal',
        approach: 'FoF = friends of my friends who are not my friends. BFS 2 levels deep. Deduplicate results. Exclude existing friends and self.',
        keyInsight: 'FoF is most common social query. User with 500 friends, each with 500 = 250K potential FoF. Need efficient traversal and deduplication.'
      },
      requirements: {
        functional: [
          'Find friend-of-friend connections',
          'Exclude existing friends',
          'Count mutual friends',
          'Limit and paginate results'
        ],
        nonFunctional: [
          'FoF query < 100ms',
          'Handle users with 5K friends'
        ]
      },
      hints: [
        'Algorithm: get friends → for each, get their friends → dedupe → filter',
        'Optimization: early termination with limit',
        'Mutual count: intersection of friend sets'
      ],
      expectedComponents: ['FoF Query Engine', 'Set Operations', 'Result Deduplicator'],
      successCriteria: ['FoF works', 'Fast for large networks'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-5',
      title: 'Mutual Friends',
      phase: 2,
      phaseTitle: 'Queries',
      learningObjective: 'Find common connections between users',
      thinkingFramework: {
        framework: 'Set Intersection',
        approach: 'Mutual friends = intersection of friend lists. Display on profile: "12 mutual friends". Fast set intersection critical for UI.',
        keyInsight: 'Mutual friends is key trust signal. "You and John have 50 mutual friends" creates connection. Fast intersection of potentially large sets.'
      },
      requirements: {
        functional: [
          'Count mutual friends between two users',
          'List mutual friends',
          'Paginate mutual friends list',
          'Cache frequent lookups'
        ],
        nonFunctional: [
          'Mutual count < 20ms',
          'List first page < 50ms'
        ]
      },
      hints: [
        'Intersection: friends(A) ∩ friends(B)',
        'Sorted lists: merge intersection O(n+m)',
        'Bloom filter: fast approximate count for UI'
      ],
      expectedComponents: ['Intersection Engine', 'Mutual Cache', 'Bloom Filter'],
      successCriteria: ['Mutual friends fast', 'Count accurate'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Path Finding',
      phase: 2,
      phaseTitle: 'Queries',
      learningObjective: 'Find connection paths between users',
      thinkingFramework: {
        framework: 'Shortest Path',
        approach: 'How are two people connected? BFS from both ends (bidirectional). "You → Alice → Bob → Target". Six degrees of separation.',
        keyInsight: 'Bidirectional BFS is much faster than single-direction. Meet in middle. Typical social graph: most people connected within 6 hops.'
      },
      requirements: {
        functional: [
          'Find shortest path between users',
          'Maximum hop limit',
          'Multiple paths option',
          'Path through specific relationship types'
        ],
        nonFunctional: [
          'Path finding < 200ms',
          'Max depth: 6 hops'
        ]
      },
      hints: [
        'Bidirectional BFS: expand from both ends, meet in middle',
        'Early termination: stop when paths meet',
        'Depth limit: prevent infinite search'
      ],
      expectedComponents: ['Path Finder', 'Bidirectional BFS', 'Path Reconstructor'],
      successCriteria: ['Paths found', 'Bidirectional works'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Features (Steps 7-9)
    {
      id: 'step-7',
      title: 'Friend Suggestions',
      phase: 3,
      phaseTitle: 'Features',
      learningObjective: 'Recommend new connections',
      thinkingFramework: {
        framework: 'Social Recommendation',
        approach: 'Suggest FoF sorted by mutual friends count. Also consider: same school, same employer, profile similarity. Combine signals.',
        keyInsight: 'Friend suggestions drive network growth. FoF with many mutuals = likely real connection. Add other signals: location, interests, affiliation.'
      },
      requirements: {
        functional: [
          'Generate friend suggestions',
          'Rank by mutual friend count',
          'Include affiliation matches',
          'Filter already-suggested and blocked'
        ],
        nonFunctional: [
          'Generate top 50 suggestions < 500ms',
          'Daily refresh'
        ]
      },
      hints: [
        'Score: 0.5 * mutual_count + 0.3 * same_school + 0.2 * same_location',
        'Pre-compute: batch job generates suggestions nightly',
        'Filter: exclude existing friends, blocked, previously dismissed'
      ],
      expectedComponents: ['Suggestion Engine', 'Scoring Model', 'Suggestion Cache'],
      successCriteria: ['Suggestions generated', 'Ranking works'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'News Feed Graph Queries',
      phase: 3,
      phaseTitle: 'Features',
      learningObjective: 'Power news feed with graph queries',
      thinkingFramework: {
        framework: 'Feed from Graph',
        approach: 'Feed = posts from friends + pages I follow + groups I am in. Graph query: traverse friend edges, collect post IDs, rank by time and engagement.',
        keyInsight: 'News feed is graph-powered. Not just friends - also follows, groups, pages. Graph traversal collects candidates, ranking selects final feed.'
      },
      requirements: {
        functional: [
          'Get post candidates from connections',
          'Include followed pages and groups',
          'Aggregate engagement signals',
          'Feed personalization'
        ],
        nonFunctional: [
          'Candidate generation < 100ms',
          'Support feed refresh'
        ]
      },
      hints: [
        'Candidates: union(friend_posts, page_posts, group_posts)',
        'Ranking: recent + engagement + affinity with author',
        'Affinity: edge weight based on interaction history'
      ],
      expectedComponents: ['Feed Query Engine', 'Candidate Aggregator', 'Affinity Model'],
      successCriteria: ['Candidates from graph', 'Multi-source works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Privacy-Aware Queries',
      phase: 3,
      phaseTitle: 'Features',
      learningObjective: 'Enforce privacy in graph queries',
      thinkingFramework: {
        framework: 'Graph Privacy',
        approach: 'Users control who sees their connections. "Friends only" vs "public". Query must respect privacy settings. Dont leak private connections.',
        keyInsight: 'Graph queries can leak info. "Mutual friends with hidden user" reveals connection exists. Privacy-aware traversal respects visibility settings.'
      },
      requirements: {
        functional: [
          'Visibility settings on edges',
          'Filter results by viewer permissions',
          'Hide connection existence when private',
          'Admin override for debugging'
        ],
        nonFunctional: [
          'Privacy check < 5ms per edge',
          'Zero privacy leaks'
        ]
      },
      hints: [
        'Edge visibility: public, friends_only, private',
        'Query: filter edges where viewer has permission',
        'Mutual friends: only count visible connections'
      ],
      expectedComponents: ['Privacy Filter', 'Visibility Checker', 'Secure Traversal'],
      successCriteria: ['Privacy enforced', 'No leaks'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Graph Partitioning',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Distribute graph across machines',
      thinkingFramework: {
        framework: 'Social Graph Sharding',
        approach: 'Partition by user. Edges stored on source user shard. Cross-shard edges for friends on different shards. Minimize edge cuts.',
        keyInsight: 'Social graphs have locality. Friends tend to cluster (same school, city). Partition to keep communities together. Reduces cross-shard queries.'
      },
      requirements: {
        functional: [
          'Partition users across shards',
          'Route queries to correct shard',
          'Handle cross-shard edges',
          'Rebalance partitions'
        ],
        nonFunctional: [
          'Cross-shard edges < 20%',
          'Linear scalability'
        ]
      },
      hints: [
        'Hash partition: user_id mod num_shards (simple)',
        'Community detection: keep friends together (optimal)',
        'Edge storage: edge on source user shard'
      ],
      expectedComponents: ['Partition Manager', 'Query Router', 'Cross-Shard Handler'],
      successCriteria: ['Partitioning works', 'Queries route correctly'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-11',
      title: 'Caching Layer',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Cache hot graph data',
      thinkingFramework: {
        framework: 'Graph Cache',
        approach: 'Cache adjacency lists for active users. Cache query results (mutual friends). Invalidate on edge changes. LRU for memory management.',
        keyInsight: 'Power law: 1% of users generate 50% of queries. Cache these hot users adjacency lists. Massive reduction in disk reads.'
      },
      requirements: {
        functional: [
          'Cache adjacency lists',
          'Cache query results',
          'Invalidate on edge changes',
          'Warm cache on user activity'
        ],
        nonFunctional: [
          'Cache hit rate > 90%',
          'Invalidation < 100ms'
        ]
      },
      hints: [
        'Adjacency cache: user_id → [friend_ids]',
        'Result cache: (user_a, user_b) → mutual_count',
        'Invalidation: edge change → invalidate both users caches'
      ],
      expectedComponents: ['Adjacency Cache', 'Result Cache', 'Invalidation Manager'],
      successCriteria: ['High hit rate', 'Invalidation works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Real-Time Updates',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Handle edge changes at scale',
      thinkingFramework: {
        framework: 'Streaming Graph Updates',
        approach: 'Millions of friend adds/removes per day. Stream updates to all replicas. Eventually consistent reads OK. Strong consistency for same-user operations.',
        keyInsight: 'Social graph is write-heavy relative to typical databases. Friend add must update multiple indexes and caches. Async pipeline handles volume.'
      },
      requirements: {
        functional: [
          'Stream edge updates',
          'Async index updates',
          'Eventual consistency for reads',
          'Strong consistency option'
        ],
        nonFunctional: [
          'Handle 10K edge updates/sec',
          'Replication lag < 1 second'
        ]
      },
      hints: [
        'Write path: log → primary → async to replicas',
        'Index update: background job processes log',
        'Strong: read-your-writes for same user'
      ],
      expectedComponents: ['Update Stream', 'Async Indexer', 'Consistency Controller'],
      successCriteria: ['High update throughput', 'Consistency maintained'],
      estimatedTime: '8 minutes'
    }
  ]
};
