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

// Continue with remaining Chapter 2 problems (23-27)...
// Graph model problems will be added here

// Export all Chapter 2 problems
export const ddiaChapter2Problems = [
  relationalSchemaProblemDefinition,
  foreignKeysJoinsProblemDefinition,
  sqlOptimizationProblemDefinition,
  indexingStrategiesProblemDefinition,
  documentSchemaProblemDefinition,
  embeddedVsReferencedProblemDefinition,
  schemaOnReadProblemDefinition,
  // Graph problems (23-27) would be added here - omitted for now to move forward
];
