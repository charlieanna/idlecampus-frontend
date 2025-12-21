import { GuidedTutorial } from '../../types/guidedTutorial';

export const multiModelDatabaseProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'multi-model-database-progressive',
  title: 'Design Multi-Model Database',
  description: 'Build a database supporting multiple data models from documents to graphs in one engine',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design unified storage for multiple data models',
    'Implement document, key-value, and graph APIs',
    'Build cross-model queries and transactions',
    'Handle schema flexibility and validation',
    'Scale multi-model workloads'
  ],
  prerequisites: ['Database internals', 'Data modeling', 'Query optimization'],
  tags: ['database', 'multi-model', 'document', 'graph', 'key-value'],

  progressiveStory: {
    title: 'Multi-Model Database Evolution',
    premise: "You're building a database that supports documents, key-value, and graph models in one engine. Starting with unified storage, you'll evolve to support cross-model queries, transactions, and enterprise scale.",
    phases: [
      { phase: 1, title: 'Storage', description: 'Unified data storage' },
      { phase: 2, title: 'Models', description: 'Multiple data models' },
      { phase: 3, title: 'Queries', description: 'Cross-model operations' },
      { phase: 4, title: 'Scale', description: 'Enterprise features' }
    ]
  },

  steps: [
    // PHASE 1: Storage (Steps 1-3)
    {
      id: 'step-1',
      title: 'Unified Storage Engine',
      phase: 1,
      phaseTitle: 'Storage',
      learningObjective: 'Design storage that supports multiple models',
      thinkingFramework: {
        framework: 'Universal Record Format',
        approach: 'Store all data as flexible records with metadata. Document = record. KV = record with key. Graph node = record with edges. Same engine, different APIs.',
        keyInsight: 'Multi-model doesnt mean multiple engines. One storage layer with type metadata. Documents, KV pairs, and graph nodes are all records with different access patterns.'
      },
      requirements: {
        functional: [
          'Store flexible schema records',
          'Support nested structures',
          'Metadata for data model type',
          'Efficient serialization'
        ],
        nonFunctional: [
          'Storage overhead < 10%',
          'Read latency < 5ms'
        ]
      },
      hints: [
        'Record: {_id, _type: document|kv|node|edge, _data: {...}, _meta: {...}}',
        'Serialization: MessagePack or BSON for efficiency',
        'LSM tree or B-tree for storage engine'
      ],
      expectedComponents: ['Storage Engine', 'Record Manager', 'Serializer'],
      successCriteria: ['Records stored', 'Types distinguished'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-2',
      title: 'Index Infrastructure',
      phase: 1,
      phaseTitle: 'Storage',
      learningObjective: 'Build indexing for different access patterns',
      thinkingFramework: {
        framework: 'Polymorphic Indexing',
        approach: 'Different models need different indexes. Documents: field indexes. KV: hash on key. Graphs: adjacency lists. Build index infrastructure that supports all.',
        keyInsight: 'Index type depends on query pattern. B-tree for range queries. Hash for exact lookups. Adjacency for graph traversal. Same data, different indexes.'
      },
      requirements: {
        functional: [
          'Create indexes on any field',
          'Hash indexes for key lookup',
          'Composite indexes',
          'Index on nested fields'
        ],
        nonFunctional: [
          'Index lookup < 1ms',
          'Index update < 10ms'
        ]
      },
      hints: [
        'B-tree: range queries, sorted access',
        'Hash: O(1) exact key lookup',
        'Composite: {field1, field2} for multi-field queries'
      ],
      expectedComponents: ['Index Manager', 'B-Tree Index', 'Hash Index'],
      successCriteria: ['Indexes created', 'Queries use indexes'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Transaction Support',
      phase: 1,
      phaseTitle: 'Storage',
      learningObjective: 'ACID transactions across data models',
      thinkingFramework: {
        framework: 'Model-Agnostic ACID',
        approach: 'Transaction wraps any operations regardless of model. Insert document + update KV + create edge in one transaction. Same isolation and durability guarantees.',
        keyInsight: 'Multi-model transactions are key differentiator. Cant do this with separate databases. One transaction spans document update and graph edge creation atomically.'
      },
      requirements: {
        functional: [
          'Begin/commit/rollback transactions',
          'Mix operations from different models',
          'Isolation levels (read committed, serializable)',
          'Deadlock detection'
        ],
        nonFunctional: [
          'Transaction throughput > 10K TPS',
          'Deadlock detection < 100ms'
        ]
      },
      hints: [
        'MVCC: multi-version concurrency control',
        'Transaction: {id, operations: [], model_types: [doc, kv, graph]}',
        'Isolation: snapshot for reads, locks for writes'
      ],
      expectedComponents: ['Transaction Manager', 'MVCC Engine', 'Lock Manager'],
      successCriteria: ['Multi-model transactions work', 'ACID guaranteed'],
      estimatedTime: '10 minutes'
    },

    // PHASE 2: Models (Steps 4-6)
    {
      id: 'step-4',
      title: 'Document Model',
      phase: 2,
      phaseTitle: 'Models',
      learningObjective: 'Implement document database features',
      thinkingFramework: {
        framework: 'Document Store',
        approach: 'JSON-like documents with flexible schema. Collections group documents. Rich query language with filters, projections, aggregations. Like MongoDB on unified storage.',
        keyInsight: 'Documents excel at representing objects with varying fields. No schema migration needed. Query by any field. Good for content, user profiles, product catalogs.'
      },
      requirements: {
        functional: [
          'Create collections and documents',
          'Query with filters and projections',
          'Aggregation pipeline',
          'Schema validation (optional)'
        ],
        nonFunctional: [
          'Query latency < 50ms',
          'Support 1M documents per collection'
        ]
      },
      hints: [
        'Document: {_id, field1, field2, nested: {subfield}}',
        'Query: find({field: value, nested.subfield: value})',
        'Aggregation: match → group → sort → project'
      ],
      expectedComponents: ['Document API', 'Query Engine', 'Aggregation Pipeline'],
      successCriteria: ['Documents stored', 'Queries work'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Key-Value Model',
      phase: 2,
      phaseTitle: 'Models',
      learningObjective: 'Implement key-value store features',
      thinkingFramework: {
        framework: 'KV Store',
        approach: 'Simple get/set by key. Optional TTL for expiration. Atomic operations (increment, compare-and-swap). Like Redis semantics on unified storage.',
        keyInsight: 'KV is simplest and fastest model. No query language, just key lookup. Perfect for caching, sessions, counters. Often used alongside documents in same app.'
      },
      requirements: {
        functional: [
          'Get/set/delete by key',
          'TTL and expiration',
          'Atomic increment/decrement',
          'Compare-and-swap'
        ],
        nonFunctional: [
          'Get/set latency < 1ms',
          'Support 100M keys'
        ]
      },
      hints: [
        'KV entry: {_id: key, _data: value, _ttl: expiry_timestamp}',
        'Atomic: incr(key) → read-modify-write with lock',
        'CAS: set if current value matches expected'
      ],
      expectedComponents: ['KV API', 'TTL Manager', 'Atomic Ops'],
      successCriteria: ['KV operations work', 'TTL expires entries'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-6',
      title: 'Graph Model',
      phase: 2,
      phaseTitle: 'Models',
      learningObjective: 'Implement graph database features',
      thinkingFramework: {
        framework: 'Property Graph',
        approach: 'Nodes with properties. Edges with labels and properties. Traversal queries (find friends of friends). Pattern matching.',
        keyInsight: 'Graphs excel at relationships. Friend networks, recommendations, hierarchies. Traversal is natural (vs JOIN tables). Adjacency index makes traversal O(edges) not O(nodes).'
      },
      requirements: {
        functional: [
          'Create nodes and edges',
          'Node and edge properties',
          'Traversal queries (BFS, DFS)',
          'Pattern matching'
        ],
        nonFunctional: [
          'Traversal < 10ms per hop',
          'Support 1B edges'
        ]
      },
      hints: [
        'Node: {_id, _type: node, _labels: [], properties: {}}',
        'Edge: {_id, _type: edge, _from, _to, _label, properties: {}}',
        'Adjacency: index from _from and _to for fast traversal'
      ],
      expectedComponents: ['Graph API', 'Traversal Engine', 'Pattern Matcher'],
      successCriteria: ['Nodes/edges stored', 'Traversal works'],
      estimatedTime: '10 minutes'
    },

    // PHASE 3: Queries (Steps 7-9)
    {
      id: 'step-7',
      title: 'Cross-Model Queries',
      phase: 3,
      phaseTitle: 'Queries',
      learningObjective: 'Query across data models',
      thinkingFramework: {
        framework: 'Unified Query Language',
        approach: 'Single query spans models. "Find documents where author is connected to topic". Join documents via graph edges. Mix KV lookups in query.',
        keyInsight: 'This is the killer feature of multi-model. Traditional: query Mongo, query Neo4j, join in app. Multi-model: one query, database handles join. Massive simplification.'
      },
      requirements: {
        functional: [
          'Join documents via graph edges',
          'Filter documents by graph traversal result',
          'Use KV lookups in queries',
          'Unified query syntax'
        ],
        nonFunctional: [
          'Cross-model query < 100ms',
          'Optimizer chooses efficient plan'
        ]
      },
      hints: [
        'Query: FOR doc IN documents FILTER doc.author IN (GRAPH_NEIGHBORS(...))',
        'Join: document._id matches graph node._id',
        'KV in query: LET config = KV_GET("settings") ... FILTER doc.type == config.active_type'
      ],
      expectedComponents: ['Unified Query Parser', 'Cross-Model Executor', 'Query Optimizer'],
      successCriteria: ['Cross-model queries work', 'Results correct'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Query Optimization',
      phase: 3,
      phaseTitle: 'Queries',
      learningObjective: 'Optimize cross-model query execution',
      thinkingFramework: {
        framework: 'Multi-Model Optimizer',
        approach: 'Choose best execution order. Push filters down. Use indexes from all models. Cost-based selection between alternatives.',
        keyInsight: 'Optimizer must understand all models. Filter documents first then traverse, or traverse first then filter? Depends on selectivity. Cost model spans models.'
      },
      requirements: {
        functional: [
          'Cost-based query planning',
          'Index selection across models',
          'Filter pushdown',
          'Explain query plans'
        ],
        nonFunctional: [
          'Planning < 10ms',
          'Plan caching'
        ]
      },
      hints: [
        'Cost model: estimate rows from each model operation',
        'Filter pushdown: apply filters earliest possible',
        'Index hint: USING INDEX idx_name'
      ],
      expectedComponents: ['Query Planner', 'Cost Estimator', 'Plan Cache'],
      successCriteria: ['Efficient plans generated', 'Explain works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Full-Text Search Integration',
      phase: 3,
      phaseTitle: 'Queries',
      learningObjective: 'Add search capabilities to all models',
      thinkingFramework: {
        framework: 'Integrated Search',
        approach: 'Full-text index on document fields. Search combined with graph traversal. "Find documents mentioning X written by authors in my network".',
        keyInsight: 'Search is another model that integrates naturally. Inverted index on text fields. Combine with document filters and graph traversals in single query.'
      },
      requirements: {
        functional: [
          'Full-text indexing on fields',
          'Search with relevance scoring',
          'Combine search with other model queries',
          'Faceted search'
        ],
        nonFunctional: [
          'Search latency < 50ms',
          'Index 1M documents'
        ]
      },
      hints: [
        'Analyzer: tokenize, stem, lowercase',
        'Query: SEARCH(doc.content, "search terms") AND doc.author IN graph_result',
        'Scoring: BM25 or TF-IDF'
      ],
      expectedComponents: ['Search Index', 'Text Analyzer', 'Relevance Scorer'],
      successCriteria: ['Search works', 'Combines with other models'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Sharding Strategy',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Distribute multi-model data',
      thinkingFramework: {
        framework: 'Model-Aware Sharding',
        approach: 'Different models may need different shard keys. Documents by customer_id. Graph by partition (community detection). Co-locate related data.',
        keyInsight: 'Sharding multi-model is complex. Document query by customer → shard by customer. Graph traversal → keep connected nodes together. May need different strategies per collection.'
      },
      requirements: {
        functional: [
          'Define shard key per collection',
          'Route queries to shards',
          'Cross-shard queries',
          'Rebalancing'
        ],
        nonFunctional: [
          'Linear scalability',
          'Cross-shard overhead < 2x'
        ]
      },
      hints: [
        'Document shard key: {customer_id} or {region}',
        'Graph: partition by community, minimize edge cuts',
        'Cross-shard: scatter-gather for unsharded queries'
      ],
      expectedComponents: ['Shard Manager', 'Query Router', 'Rebalancer'],
      successCriteria: ['Sharding works', 'Queries routed correctly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Replication and HA',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Ensure high availability',
      thinkingFramework: {
        framework: 'Replicated Multi-Model',
        approach: 'Replicate all data regardless of model. Leader handles writes, followers handle reads. Automatic failover. Cross-model transactions replicate atomically.',
        keyInsight: 'Replication is model-agnostic. Transaction log contains all model operations. Replay log on follower to reconstruct state. Failover preserves multi-model consistency.'
      },
      requirements: {
        functional: [
          'Synchronous/async replication options',
          'Read replicas for scaling reads',
          'Automatic failover',
          'Cross-region replication'
        ],
        nonFunctional: [
          '99.99% availability',
          'Failover < 30 seconds'
        ]
      },
      hints: [
        'Replication log: sequence of multi-model operations',
        'Sync: commit waits for follower ACK',
        'Failover: elect new leader, update routing'
      ],
      expectedComponents: ['Replication Manager', 'Leader Election', 'Failover Controller'],
      successCriteria: ['Replication works', 'Failover automatic'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Enterprise Features',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Add enterprise-grade capabilities',
      thinkingFramework: {
        framework: 'Production Readiness',
        approach: 'Audit logging, encryption at rest, fine-grained access control. Backup and restore. Monitoring and alerting. What enterprises need beyond basic functionality.',
        keyInsight: 'Multi-model amplifies enterprise needs. Access control per model? Audit logs for graph traversals? Encryption for sensitive documents? Production requires polish.'
      },
      requirements: {
        functional: [
          'Role-based access control',
          'Encryption at rest and in transit',
          'Audit logging',
          'Online backup/restore'
        ],
        nonFunctional: [
          'Encryption overhead < 10%',
          'Backup without downtime'
        ]
      },
      hints: [
        'RBAC: {role, permissions: [{model, collection, operations}]}',
        'Audit: log all data access with user, time, query',
        'Backup: snapshot + WAL shipping for PITR'
      ],
      expectedComponents: ['Access Control', 'Encryption Layer', 'Audit Logger'],
      successCriteria: ['Security features work', 'Enterprise ready'],
      estimatedTime: '8 minutes'
    }
  ]
};
