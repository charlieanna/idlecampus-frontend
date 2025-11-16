import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../../validation/validators/featureValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';

/**
 * DDIA Teaching Problems - Chapter 2: Data Models and Query Languages
 * Total: 12 problems
 *
 * Focus: Relational, document, and graph data models
 */

// ============================================================================
// 2.1 Relational Model
// ============================================================================

/**
 * Problem 16: Relational Schema Design
 * Teaches: Design normalized relational schemas (3NF)
 */
export const relationalSchemaProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch2-relational-schema',
  title: 'Relational Schema Design - Normalization',
  description: `Design a normalized relational schema for a blog platform. Apply normal forms (1NF, 2NF, 3NF) to eliminate redundancy and update anomalies.

Learning objectives:
- Understand relational data modeling
- Apply normalization (1NF, 2NF, 3NF)
- Identify entities and relationships
- Avoid update/insert/delete anomalies

Example: Users, Posts, Comments, Tags
- Users (id, name, email)
- Posts (id, user_id, title, content, created_at)
- Comments (id, post_id, user_id, content)
- Tags (id, name)
- Post_Tags (post_id, tag_id)

Key requirements:
- Entities in 3rd Normal Form
- Foreign key constraints
- No redundant data
- Efficient for OLTP workloads`,

  userFacingFRs: [
    'Design schema: Users, Posts, Comments, Tags, Post_Tags',
    'Apply 1NF: Atomic values, no repeating groups',
    'Apply 2NF: No partial dependencies',
    'Apply 3NF: No transitive dependencies',
    'Foreign keys for referential integrity',
  ],
  userFacingNFRs: [
    'Query performance: Joins should be efficient (<50ms)',
    'Storage efficiency: Minimal redundancy',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Relational database (PostgreSQL, MySQL)',
      },
      {
        type: 'compute',
        reason: 'Application layer',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'API requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'SQL queries',
      },
    ],
    dataModel: {
      entities: ['user', 'post', 'comment', 'tag', 'post_tag'],
      fields: {
        user: ['id', 'name', 'email', 'created_at'],
        post: ['id', 'user_id', 'title', 'content', 'created_at'],
        comment: ['id', 'post_id', 'user_id', 'content', 'created_at'],
        tag: ['id', 'name'],
        post_tag: ['post_id', 'tag_id'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'join', frequency: 'high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('ddia-ch2-relational-schema', problemConfigs['ddia-ch2-relational-schema'] || {
    baseRps: 2000,
    readRatio: 0.8,
    maxLatency: 50,
    availability: 0.99,
  }, [
    'Design normalized schema',
    'Apply 3NF',
    'Foreign key constraints',
    'Efficient joins',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 17: Foreign Keys & Joins
 * Teaches: Implement relationships with foreign keys and perform joins
 */
export const foreignKeysJoinsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch2-foreign-keys-joins',
  title: 'Foreign Keys & Joins',
  description: `Implement relationships using foreign keys and perform efficient joins. Understand different join types (INNER, LEFT, RIGHT, OUTER) and when to use each.

Learning objectives:
- Implement foreign key constraints
- Perform INNER JOIN, LEFT JOIN, RIGHT JOIN
- Understand join performance implications
- Use indexes to optimize joins

Example: Get all posts with author names and comment counts
SELECT p.title, u.name, COUNT(c.id) as comment_count
FROM posts p
INNER JOIN users u ON p.user_id = u.id
LEFT JOIN comments c ON p.id = c.post_id
GROUP BY p.id, u.name;

Key requirements:
- Foreign keys with ON DELETE CASCADE/SET NULL
- Efficient multi-table joins
- Indexes on foreign key columns
- Avoid N+1 query problems`,

  userFacingFRs: [
    'Create foreign key constraints',
    'Perform INNER JOIN to get posts with authors',
    'Use LEFT JOIN to include posts without comments',
    'Index foreign key columns (user_id, post_id)',
    'Avoid N+1 queries with eager loading',
  ],
  userFacingNFRs: [
    'Join performance: <100ms for multi-table joins',
    'Referential integrity: 100% (no orphaned records)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Relational database with JOIN support',
      },
      {
        type: 'compute',
        reason: 'Application with ORM or query builder',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Execute JOIN queries',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch2-foreign-keys-joins', problemConfigs['ddia-ch2-foreign-keys-joins'] || {
    baseRps: 1500,
    readRatio: 0.9,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Foreign key constraints',
    'INNER/LEFT/RIGHT joins',
    'Index foreign keys',
    'Avoid N+1 queries',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 18: SQL Query Optimization
 * Teaches: Optimize SELECT queries with EXPLAIN
 */
export const sqlOptimizationProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch2-sql-optimization',
  title: 'SQL Query Optimization',
  description: `Optimize slow SQL queries using EXPLAIN plans, indexes, and query rewriting. Learn to identify and fix common performance bottlenecks.

Learning objectives:
- Use EXPLAIN to analyze query plans
- Identify sequential scans vs index scans
- Optimize WHERE clauses and JOINs
- Avoid SELECT * and unnecessary columns

Common issues:
- Missing indexes → Sequential scan
- Wrong index → Index not used
- SELECT * → Fetching unnecessary data
- OR clauses → Multiple index scans

Key requirements:
- Run EXPLAIN on all slow queries
- Add indexes where needed
- Rewrite queries for better performance
- Monitor query execution time`,

  userFacingFRs: [
    'Run EXPLAIN on slow queries',
    'Identify sequential scans (bad) vs index scans (good)',
    'Add indexes on WHERE and JOIN columns',
    'Rewrite queries: Avoid OR, use IN; avoid functions on indexed columns',
    'Select only needed columns (not SELECT *)',
  ],
  userFacingNFRs: [
    'Query performance: <50ms for simple queries, <200ms for complex',
    'Index usage: >90% of queries use indexes',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with query optimizer',
      },
      {
        type: 'compute',
        reason: 'Monitoring and profiling tools',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Run and analyze queries',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch2-sql-optimization', problemConfigs['ddia-ch2-sql-optimization'] || {
    baseRps: 2000,
    readRatio: 0.95,
    maxLatency: 50,
    availability: 0.99,
  }, [
    'Run EXPLAIN plans',
    'Add missing indexes',
    'Rewrite inefficient queries',
    'Monitor query time',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 19: Indexing Strategies
 * Teaches: Choose appropriate B-tree indexes
 */
export const indexingStrategiesProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch2-indexing',
  title: 'Indexing Strategies - B-Tree Indexes',
  description: `Design an indexing strategy for a database. Understand trade-offs: indexes speed up reads but slow down writes. Learn when to use single-column, composite, and covering indexes.

Learning objectives:
- Single-column indexes for equality filters
- Composite indexes for multi-column WHERE clauses
- Covering indexes to avoid table lookups
- Index selectivity and cardinality
- Write overhead of indexes

Example indexes:
- Single: CREATE INDEX idx_email ON users(email);
- Composite: CREATE INDEX idx_user_date ON posts(user_id, created_at);
- Covering: CREATE INDEX idx_cover ON posts(user_id) INCLUDE (title);

Key requirements:
- Index high-selectivity columns (unique or near-unique)
- Use composite indexes for common multi-column queries
- Avoid over-indexing (each index has write overhead)
- Monitor index usage and drop unused indexes`,

  userFacingFRs: [
    'Create single-column indexes on WHERE/JOIN columns',
    'Create composite indexes for multi-column filters',
    'Use covering indexes to avoid table lookups',
    'Monitor index usage (pg_stat_user_indexes)',
    'Drop unused indexes',
  ],
  userFacingNFRs: [
    'Read performance: <50ms with proper indexes',
    'Write overhead: <10% slower with indexes',
    'Index size: <30% of table size',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with B-tree index support',
      },
      {
        type: 'compute',
        reason: 'Index monitoring',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Query and maintain indexes',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch2-indexing', problemConfigs['ddia-ch2-indexing'] || {
    baseRps: 3000,
    readRatio: 0.85,
    maxLatency: 50,
    availability: 0.99,
  }, [
    'Single-column indexes',
    'Composite indexes',
    'Covering indexes',
    'Monitor and drop unused',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 2.2 Document Model
// ============================================================================

/**
 * Problem 20: Document Schema Design
 * Teaches: Design MongoDB document schemas
 */
export const documentSchemaProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch2-document-schema',
  title: 'Document Schema - MongoDB',
  description: `Design a document-oriented schema for MongoDB. Unlike relational databases, documents can have nested structures and don't require strict schemas upfront.

Learning objectives:
- Design flexible document schemas
- Use nested documents vs references
- Handle schema evolution
- Understand document locality

Example: Blog post document
{
  _id: ObjectId("..."),
  title: "My Post",
  author: {name: "Alice", email: "alice@example.com"},  // embedded
  content: "...",
  tags: ["tech", "databases"],  // array
  comments: [  // embedded array
    {user: "Bob", text: "Great post!", created_at: ISODate("...")}
  ],
  created_at: ISODate("...")
}

Key requirements:
- Embed frequently accessed related data
- Reference rarely accessed or large data
- Flexible schema for rapid evolution
- Optimize for read patterns`,

  userFacingFRs: [
    'Design document structure matching access patterns',
    'Embed author info (frequently accessed together)',
    'Embed comments array (usually < 100)',
    'Reference tags if large number of posts per tag',
    'Allow schema flexibility (optional fields)',
  ],
  userFacingNFRs: [
    'Read latency: <20ms (single document read)',
    'Write latency: <30ms',
    'Document size: <16MB (MongoDB limit)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'MongoDB or similar document database',
      },
      {
        type: 'compute',
        reason: 'Application layer',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'API requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Document CRUD operations',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch2-document-schema', problemConfigs['ddia-ch2-document-schema'] || {
    baseRps: 2500,
    readRatio: 0.85,
    maxLatency: 30,
    availability: 0.99,
  }, [
    'Design document structure',
    'Embed related data',
    'Handle schema flexibility',
    'Optimize for reads',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 21: Embedded vs Referenced Documents
 * Teaches: Choose between embedding and referencing
 */
export const embeddedVsReferencedProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch2-embedded-vs-referenced',
  title: 'Embedded vs Referenced Documents',
  description: `Decide when to embed documents vs use references. Embedding provides data locality but can cause duplication. References avoid duplication but require multiple queries.

Learning objectives:
- Embed when data is accessed together (1:1, 1:few)
- Reference when data is large or many-to-many
- Handle update anomalies with embedding
- Trade-off: read performance vs write complexity

Embed when:
- One-to-one relationships (user profile)
- One-to-few (post with comments)
- Data accessed together always
- Bounded array size

Reference when:
- One-to-many (unbounded, e.g., user's millions of posts)
- Many-to-many (posts ↔ tags)
- Data rarely accessed together
- Data duplicated in many documents

Key requirements:
- Embed small, frequently accessed related data
- Reference large or infrequently accessed data
- Handle updates efficiently`,

  userFacingFRs: [
    'Embed: Author info in post (1:1, always accessed together)',
    'Embed: Comments array in post (1:few, usually <100)',
    'Reference: User → Posts (1:many, unbounded)',
    'Reference: Posts ↔ Tags (many:many)',
    'Update embedded data: Denormalized, may need multi-doc updates',
  ],
  userFacingNFRs: [
    'Embedded read: 1 query (<20ms)',
    'Referenced read: 2+ queries or $lookup (<100ms)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Document database',
      },
      {
        type: 'compute',
        reason: 'Application with data access layer',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Document queries with/without references',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch2-embedded-vs-referenced', problemConfigs['ddia-ch2-embedded-vs-referenced'] || {
    baseRps: 2000,
    readRatio: 0.8,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Embed small, related data',
    'Reference large or unbounded data',
    'Handle update trade-offs',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 22: Schema-on-Read
 * Teaches: Handle flexible schemas without upfront schema definition
 */
export const schemaOnReadProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch2-schema-on-read',
  title: 'Schema-on-Read - Flexible Schemas',
  description: `Implement schema-on-read where the schema is interpreted at read time, not enforced at write time. This allows rapid iteration and handles heterogeneous data.

Learning objectives:
- Schema-on-write (relational) vs schema-on-read (document)
- Handle documents with different fields
- Migrate schemas gradually
- Validate at application layer

Example: User documents evolving over time
// Old users:
{_id: 1, name: "Alice"}

// New users (added email):
{_id: 2, name: "Bob", email: "bob@example.com"}

// Newest users (added preferences):
{_id: 3, name: "Charlie", email: "charlie@example.com", preferences: {theme: "dark"}}

Application handles missing fields gracefully.

Key requirements:
- Allow documents with different fields in same collection
- Application validates and handles missing fields
- Migrate schema gradually (add new fields, deprecate old)
- Monitor schema drift`,

  userFacingFRs: [
    'Allow documents with varying fields',
    'Application checks for field existence before accessing',
    'Provide defaults for missing fields',
    'Gradual schema migration (add field to new docs, backfill old docs)',
    'Schema validation at application layer (not database)',
  ],
  userFacingNFRs: [
    'Flexibility: Support rapid schema changes',
    'Backward compatibility: Old code handles new fields',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Schema-less database (MongoDB, CouchDB)',
      },
      {
        type: 'compute',
        reason: 'Application with schema validation logic',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Read/write documents with varying schemas',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch2-schema-on-read', problemConfigs['ddia-ch2-schema-on-read'] || {
    baseRps: 1500,
    readRatio: 0.75,
    maxLatency: 50,
    availability: 0.99,
  }, [
    'Allow varying fields',
    'Handle missing fields',
    'Gradual migration',
    'Application-layer validation',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 23: JSON/BSON Storage
 * Teaches: Store and query JSON/BSON data
 */
export const jsonBsonStorageProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch2-json-bson',
  title: 'JSON/BSON Storage',
  description: `Store and query JSON/BSON documents efficiently. Understand the trade-offs of JSON (human-readable, larger) vs BSON (binary, compact, faster parsing).

Learning objectives:
- Store JSON documents in database
- Query nested JSON fields
- Index JSON properties
- Understand JSON vs BSON encoding

JSON: {"name": "Alice", "age": 30}
BSON: Binary representation, more compact, includes type information

Key requirements:
- Store JSON documents
- Query nested fields (e.g., user.address.city)
- Index JSON properties for fast queries
- Handle schema-less data`,

  userFacingFRs: [
    'Store JSON documents in PostgreSQL JSONB or MongoDB',
    'Query nested fields: WHERE data->\'address\'->>\'city\' = \'NYC\'',
    'Create indexes on JSON properties: CREATE INDEX ON table ((data->>\'email\'))',
    'Handle varying document structures',
  ],
  userFacingNFRs: [
    'Read latency: <30ms',
    'Storage: BSON ~10-20% smaller than JSON',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with JSON/BSON support (PostgreSQL JSONB, MongoDB)',
      },
      {
        type: 'compute',
        reason: 'Application layer',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Store and query JSON documents',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch2-json-bson', problemConfigs['ddia-ch2-json-bson'] || {
    baseRps: 1500,
    readRatio: 0.8,
    maxLatency: 30,
    availability: 0.99,
  }, [
    'Store JSON documents',
    'Query nested fields',
    'Index JSON properties',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 2.3 Graph Model
// ============================================================================

/**
 * Problem 24: Graph Database Basics
 * Teaches: Model data as nodes and edges in Neo4j
 */
export const graphDatabaseBasicsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch2-graph-basics',
  title: 'Graph Database Basics - Neo4j',
  description: `Model a social network as a graph with users (nodes) and relationships (edges). Learn when graphs are better than relational or document models.

Learning objectives:
- Model entities as nodes with properties
- Model relationships as edges with types and properties
- Understand graph use cases (social networks, recommendations, fraud detection)

Example: Social Network
Nodes: User {id, name, email}
Edges: FOLLOWS, LIKES, FRIENDS_WITH

Key requirements:
- Create nodes with properties
- Create directed/undirected relationships
- Store properties on edges
- Query graph structure`,

  userFacingFRs: [
    'Create user nodes: CREATE (u:User {name: \'Alice\', email: \'alice@example.com\'})',
    'Create relationships: (alice)-[:FOLLOWS]->(bob)',
    'Store edge properties: [:FOLLOWS {since: \'2024-01-01\'}]',
    'Query graph: Find all users Alice follows',
  ],
  userFacingNFRs: [
    'Node creation: <10ms',
    'Relationship creation: <20ms',
    'Graph traversal: <100ms for simple queries',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Graph database (Neo4j, Amazon Neptune)',
      },
      {
        type: 'compute',
        reason: 'Application layer',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Graph queries (Cypher, Gremlin)',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch2-graph-basics', problemConfigs['ddia-ch2-graph-basics'] || {
    baseRps: 1000,
    readRatio: 0.85,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Create nodes',
    'Create relationships',
    'Store edge properties',
    'Query graph',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 25: Graph Traversal
 * Teaches: Shortest path, recommendations, multi-hop queries
 */
export const graphTraversalProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch2-graph-traversal',
  title: 'Graph Traversal - Shortest Path & Recommendations',
  description: `Implement graph traversal algorithms: shortest path, friend recommendations, multi-hop queries. Learn when graphs excel over relational joins.

Learning objectives:
- Find shortest path between nodes
- Generate friend recommendations (friends of friends)
- Multi-hop traversals
- Understand graph query performance

Example queries:
- Shortest path: Alice → Bob (through mutual friends)
- Friend recommendations: Friends of Alice's friends who Alice doesn't follow
- Influencers: Users with most followers

Key requirements:
- Shortest path algorithm
- Multi-hop traversals (2-3 hops)
- Limit result size to avoid expensive queries
- Use indexes on node properties`,

  userFacingFRs: [
    'Find shortest path between two users',
    'Recommend friends: MATCH (alice)-[:FOLLOWS]->(friend)-[:FOLLOWS]->(fof) WHERE NOT (alice)-[:FOLLOWS]->(fof)',
    'Find influencers: Users with >10K followers',
    'Limit traversal depth to avoid expensive queries',
  ],
  userFacingNFRs: [
    'Shortest path: <200ms for 2-3 hops',
    'Recommendations: <500ms',
    'Max traversal depth: 4 hops',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Graph database with traversal algorithms',
      },
      {
        type: 'compute',
        reason: 'Query optimizer',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Execute graph traversals',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch2-graph-traversal', problemConfigs['ddia-ch2-graph-traversal'] || {
    baseRps: 800,
    readRatio: 0.95,
    maxLatency: 500,
    availability: 0.99,
  }, [
    'Shortest path',
    'Friend recommendations',
    'Find influencers',
    'Limit depth',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 26: Property Graphs
 * Teaches: Design node and edge properties
 */
export const propertyGraphsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch2-property-graphs',
  title: 'Property Graphs - Nodes & Edges with Properties',
  description: `Design a property graph where both nodes and edges have rich properties. This enables flexible modeling of real-world relationships.

Learning objectives:
- Add properties to nodes (labels, attributes)
- Add properties to edges (weights, timestamps, metadata)
- Query based on properties
- Index properties for performance

Example: E-commerce graph
Nodes: User {name, email}, Product {title, price}, Review {rating, text}
Edges: PURCHASED {date, quantity}, REVIEWED {rating, helpful_count}

Key requirements:
- Nodes with multiple labels and properties
- Edges with properties (timestamps, weights)
- Query filtering by properties
- Index frequently queried properties`,

  userFacingFRs: [
    'Create nodes with properties: (p:Product {title: \'Laptop\', price: 1000})',
    'Create edges with properties: [:PURCHASED {date: \'2024-01-01\', quantity: 2}]',
    'Query by property: MATCH (u)-[p:PURCHASED]->(prod) WHERE p.date > \'2024-01-01\'',
    'Index properties: CREATE INDEX ON :User(email)',
  ],
  userFacingNFRs: [
    'Property query latency: <100ms',
    'Index usage: >80% of property queries use indexes',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Property graph database',
      },
      {
        type: 'compute',
        reason: 'Application layer',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Property-based queries',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch2-property-graphs', problemConfigs['ddia-ch2-property-graphs'] || {
    baseRps: 1200,
    readRatio: 0.8,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Nodes with properties',
    'Edges with properties',
    'Query by properties',
    'Index properties',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 27: Cypher Query Language
 * Teaches: Write Cypher queries for graph databases
 */
export const cypherQueryProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch2-cypher',
  title: 'Cypher Query Language',
  description: `Learn Cypher, the query language for Neo4j. Cypher uses ASCII art patterns to express graph queries: (node)-[:RELATIONSHIP]->(node).

Learning objectives:
- MATCH patterns to find nodes and relationships
- CREATE nodes and relationships
- WHERE clauses to filter
- RETURN results with aggregations

Example Cypher queries:
// Find Alice's friends
MATCH (alice:User {name: 'Alice'})-[:FOLLOWS]->(friend)
RETURN friend.name

// Friend recommendations
MATCH (alice)-[:FOLLOWS]->(friend)-[:FOLLOWS]->(fof)
WHERE NOT (alice)-[:FOLLOWS]->(fof)
RETURN fof.name, COUNT(*) AS mutual_friends
ORDER BY mutual_friends DESC
LIMIT 10

Key requirements:
- Use MATCH to find patterns
- Use CREATE to add data
- Use WHERE for filtering
- Use RETURN with aggregations (COUNT, AVG)`,

  userFacingFRs: [
    'MATCH patterns: (user:User)-[:FOLLOWS]->(friend)',
    'CREATE nodes and edges: CREATE (u:User {name: \'Alice\'})',
    'WHERE filtering: WHERE user.age > 18',
    'RETURN with aggregation: RETURN COUNT(friend)',
    'ORDER BY and LIMIT: ORDER BY mutual_friends DESC LIMIT 10',
  ],
  userFacingNFRs: [
    'Simple queries: <50ms',
    'Complex queries (2-3 hops): <500ms',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Neo4j or Cypher-compatible database',
      },
      {
        type: 'compute',
        reason: 'Query interface',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Execute Cypher queries',
      },
    ],
  },

  scenarios: generateScenarios('ddia-ch2-cypher', problemConfigs['ddia-ch2-cypher'] || {
    baseRps: 1000,
    readRatio: 0.9,
    maxLatency: 500,
    availability: 0.99,
  }, [
    'MATCH patterns',
    'CREATE nodes/edges',
    'WHERE filtering',
    'RETURN with aggregation',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// Export all Chapter 2 problems
export const ddiaChapter2Problems = [
  relationalSchemaProblemDefinition,
  foreignKeysJoinsProblemDefinition,
  sqlOptimizationProblemDefinition,
  indexingStrategiesProblemDefinition,
  documentSchemaProblemDefinition,
  embeddedVsReferencedProblemDefinition,
  schemaOnReadProblemDefinition,
  jsonBsonStorageProblemDefinition,
  graphDatabaseBasicsProblemDefinition,
  graphTraversalProblemDefinition,
  propertyGraphsProblemDefinition,
  cypherQueryProblemDefinition,
];
