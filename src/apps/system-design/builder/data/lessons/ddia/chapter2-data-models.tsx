import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter2DataModelsLesson: SystemDesignLesson = {
  id: 'ddia-ch2-data-models',
  slug: 'ddia-ch2-data-models',
  title: 'Data Models & Query Languages (DDIA Ch. 2)',
  description: 'Master data model fundamentals and critical trade-offs: WHEN to use SQL vs NoSQL vs Graph, HOW normalization affects performance, WHICH data model fits your query patterns and consistency needs.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 90,
  stages: [
    {
      id: 'intro-data-models',
      type: 'concept',
      title: 'Introduction to Data Models',
      content: (
        <Section>
          <H1>Introduction to Data Models</H1>
          <P>
            Data models define how data is structured and how relationships between data are represented.
            Different data models are optimized for different use cases. The three main categories are:
          </P>
          <UL>
            <LI><Strong>Relational Model:</Strong> Tables with rows and columns, normalized for consistency</LI>
            <LI><Strong>Document Model:</Strong> Tree-like structures (JSON), denormalized for flexibility</LI>
            <LI><Strong>Graph Model:</Strong> Nodes and edges, optimized for relationships</LI>
          </UL>
        </Section>
      ),
    },
    {
      id: 'relational-model',
      type: 'concept',
      title: 'Relational Model - Normalization & SQL',
      content: (
        <Section>
          <H1>Relational Model - Normalization & SQL</H1>
          <P>
            The relational model organizes data into <Strong>tables</Strong> (relations) with rows (tuples) and columns (attributes).
            Data is <Strong>normalized</Strong> to eliminate redundancy and ensure consistency.
          </P>

          <H2>Normalization (1NF, 2NF, 3NF)</H2>
          <UL>
            <LI><Strong>1NF (First Normal Form):</Strong> Each column contains atomic values, no repeating groups</LI>
            <LI><Strong>2NF (Second Normal Form):</Strong> 1NF + no partial dependencies (all non-key attributes depend on full primary key)</LI>
            <LI><Strong>3NF (Third Normal Form):</Strong> 2NF + no transitive dependencies (no attributes depend on non-key attributes)</LI>
          </UL>

          <Example title="Blog Platform Schema">
            <CodeBlock>
{`-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE
);

-- Posts table
CREATE TABLE posts (
  id INT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  content TEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Comments table
CREATE TABLE comments (
  id INT PRIMARY KEY,
  post_id INT,
  user_id INT,
  content TEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);`}
            </CodeBlock>
          </Example>

          <H2>SQL Optimization</H2>
          <UL>
            <LI><Strong>Indexes:</Strong> B-tree indexes on foreign keys and frequently queried columns</LI>
            <LI><Strong>Query Planning:</Strong> EXPLAIN ANALYZE to understand query execution</LI>
            <LI><Strong>Join Strategies:</Strong> Nested loop, hash join, merge join</LI>
          </UL>

          <KeyPoint>
            <Strong>Use When:</Strong> Data has clear structure, relationships are important, ACID transactions needed,
            complex queries with joins required.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'document-model',
      type: 'concept',
      title: 'Document Model - JSON & Schema-on-Read',
      content: (
        <Section>
          <H1>Document Model - JSON & Schema-on-Read</H1>
          <P>
            Document databases (MongoDB, CouchDB) store data as <Strong>documents</Strong> (typically JSON),
            which are self-contained and can have nested structures.
          </P>

          <H2>Embedded vs. Referenced</H2>
          <UL>
            <LI><Strong>Embedded:</Strong> Store related data within the same document (fast reads, but duplication)</LI>
            <LI><Strong>Referenced:</Strong> Store IDs and join in application (normalized, but requires multiple queries)</LI>
          </UL>

          <Example title="Blog Post as Document">
            <CodeBlock>
{`{
  "_id": "post123",
  "user_id": "user456",
  "title": "My Blog Post",
  "content": "...",
  "comments": [
    { "user_id": "user789", "content": "Great post!", "created_at": "2024-01-01" }
  ],
  "tags": ["tech", "programming"]
}`}
            </CodeBlock>
          </Example>

          <H2>Schema-on-Read vs. Schema-on-Write</H2>
          <UL>
            <LI><Strong>Schema-on-Write (SQL):</Strong> Schema enforced at write time, must migrate to change</LI>
            <LI><Strong>Schema-on-Read (NoSQL):</Strong> Schema enforced at read time, flexible structure</LI>
          </UL>

          <KeyPoint>
            <Strong>Use When:</Strong> Data has variable structure, hierarchical relationships, 
            read-heavy workloads, rapid iteration needed.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'graph-model',
      type: 'concept',
      title: 'Graph Model - Nodes & Edges',
      content: (
        <Section>
          <H1>Graph Model - Nodes & Edges</H1>
          <P>
            Graph databases (Neo4j, Amazon Neptune) represent data as <Strong>nodes</Strong> (entities) and
            <Strong>edges</Strong> (relationships). Optimized for traversing relationships.
          </P>

          <H2>Property Graphs</H2>
          <UL>
            <LI><Strong>Nodes:</Strong> Entities with properties (e.g., User, Post, Comment)</LI>
            <LI><Strong>Edges:</Strong> Relationships with properties (e.g., FOLLOWS, LIKES, CREATED)</LI>
          </UL>

          <Example title="Social Network Graph">
            <CodeBlock>
{`// Nodes
(:User {id: "alice", name: "Alice"})
(:User {id: "bob", name: "Bob"})
(:Post {id: "post1", title: "Hello"})

// Edges
(alice)-[:FOLLOWS {since: "2024-01-01"}]->(bob)
(alice)-[:LIKES {timestamp: "2024-01-02"}]->(post1)

// Cypher Query: Find users Alice follows
MATCH (alice:User {id: "alice"})-[:FOLLOWS]->(followed:User)
RETURN followed.name`}
            </CodeBlock>
          </Example>

          <H2>Graph Traversal</H2>
          <UL>
            <LI><Strong>Depth-First:</Strong> Follow one path as deep as possible</LI>
            <LI><Strong>Breadth-First:</Strong> Explore all neighbors before going deeper</LI>
            <LI><Strong>Shortest Path:</Strong> Find minimum hops between nodes</LI>
          </UL>

          <KeyPoint>
            <Strong>Use When:</Strong> Many relationships, need to traverse connections (social networks, 
            recommendation engines, fraud detection), complex relationship queries.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'choosing-model',
      type: 'concept',
      title: 'Choosing the Right Data Model',
      content: (
        <Section>
          <H1>Choosing the Right Data Model</H1>
          <ComparisonTable
            headers={['Model', 'Best For', 'Trade-offs']}
            rows={[
              ['Relational (SQL)', 'Structured data, complex queries, ACID transactions', 'Less flexible, requires schema migrations'],
              ['Document (NoSQL)', 'Variable structure, hierarchical data, rapid iteration', 'No joins, eventual consistency'],
              ['Graph', 'Many relationships, relationship traversal', 'Not optimized for simple queries, higher complexity'],
            ]}
          />
          <Divider />
          <H2>Hybrid Approaches</H2>
          <P>
            Many systems use multiple data models:
          </P>
          <UL>
            <LI><Strong>Primary Store:</Strong> Relational DB for core data</LI>
            <LI><Strong>Cache:</Strong> Document store (Redis) for fast lookups</LI>
            <LI><Strong>Search:</Strong> Full-text search index (Elasticsearch)</LI>
            <LI><Strong>Analytics:</Strong> Columnar store (data warehouse) for OLAP</LI>
          </UL>
        </Section>
      ),
    },
    {
      id: 'relational-vs-document-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Relational vs Document Model',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Relational vs Document Model</H1>
          <P>
            <Strong>The Decision:</Strong> Choosing between relational (SQL) and document (NoSQL) databases determines
            query flexibility, data consistency, and schema evolution complexity. SQL provides powerful joins and ACID
            guarantees but requires schema migrations. Document stores offer flexibility and horizontal scaling but lack
            joins and strong consistency. Wrong choice: either expensive N+1 queries or rigid schema blocking development.
          </P>

          <ComparisonTable
            headers={['Factor', 'Relational (PostgreSQL)', 'Document (MongoDB)', 'Wide-Column (Cassandra)', 'Key-Value (Redis)']}
            rows={[
              ['Query Flexibility', 'Excellent (JOINs, aggregations)', 'Good (no JOINs, $lookup slow)', 'Poor (key-based only)', 'None (key lookup only)'],
              ['Schema Evolution', 'Hard (ALTER TABLE downtime)', 'Easy (schema-on-read)', 'Medium (add columns)', 'N/A (no schema)'],
              ['Consistency', 'ACID (strong)', 'Eventual (tunable)', 'Eventual (tunable)', 'Strong (single-key)'],
              ['Write Throughput', '10k writes/sec (single node)', '50k writes/sec (sharded)', '1M writes/sec (distributed)', '100k writes/sec (in-memory)'],
              ['Horizontal Scaling', 'Hard (sharding complex)', 'Easy (auto-sharding)', 'Excellent (designed for scale)', 'Medium (cluster mode)'],
              ['Data Integrity', 'Excellent (foreign keys, constraints)', 'None (app enforces)', 'None (app enforces)', 'None'],
              ['Learning Curve', 'Low (familiar SQL)', 'Medium (aggregation pipeline)', 'High (CQL, consistency levels)', 'Low (simple commands)'],
              ['Cost (startup)', '$300/mo (r5.large)', '$400/mo (M30 Atlas)', '$600/mo (3-node cluster)', '$100/mo (r5.large)'],
            ]}
          />

          <Divider />

          <H2>Real Decision: E-commerce Product Catalog</H2>
          <Example title="SQL vs MongoDB - Joins vs Denormalization">
            <CodeBlock>
{`Scenario: E-commerce with products, categories, reviews, inventory
10M products, 100M reviews, 1k categories, 50M page views/day

---

Approach 1: Relational Model (PostgreSQL)

Schema (Normalized 3NF):
CREATE TABLE categories (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  parent_id INT REFERENCES categories(id)
);

CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10,2),
  category_id INT REFERENCES categories(id),
  created_at TIMESTAMP
);

CREATE TABLE reviews (
  id INT PRIMARY KEY,
  product_id INT REFERENCES products(id),
  user_id INT REFERENCES users(id),
  rating INT,
  comment TEXT,
  created_at TIMESTAMP
);

CREATE TABLE inventory (
  id INT PRIMARY KEY,
  product_id INT REFERENCES products(id),
  warehouse_id INT,
  quantity INT
);

Product Page Query (with JOINs):
SELECT
  p.id, p.name, p.description, p.price,
  c.name as category_name,
  AVG(r.rating) as avg_rating,
  COUNT(r.id) as review_count,
  SUM(i.quantity) as total_stock
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN reviews r ON p.product_id = r.product_id
LEFT JOIN inventory i ON p.id = i.product_id
WHERE p.id = 12345
GROUP BY p.id, c.name;

Performance:
- Query time: 50ms (with proper indexes)
- Indexes needed: 4 (category_id, product_id on reviews, product_id on inventory)
- Storage: 100GB products + 500GB reviews + 10GB inventory = 610GB
- Cost: $600/mo (r5.2xlarge for 10M products)

Pros:
✅ Strong consistency (ACID transactions)
✅ Data integrity (foreign keys prevent orphaned records)
✅ Flexible queries (can join any tables as needed)
✅ No data duplication (normalized)

Cons:
❌ Complex queries (4-way JOIN for product page)
❌ Slow with large datasets (50ms per product, indexes required)
❌ Schema changes require migrations (ALTER TABLE downtime)
❌ Hard to scale horizontally (sharding complex)

Schema change example:
-- Add "brand" field - requires migration
ALTER TABLE products ADD COLUMN brand VARCHAR(255);
-- Locks table for 30 minutes on 10M rows ❌

Cost: $600/mo DB + $200/mo read replicas = $800/mo

Decision: ✅ BEST for transactional systems (orders, payments)
         ⚠️ Slower for read-heavy product pages

---

Approach 2: Document Model (MongoDB)

Schema (Denormalized):
{
  "_id": "product_12345",
  "name": "Wireless Mouse",
  "description": "...",
  "price": 29.99,
  "category": {
    "id": "electronics",
    "name": "Electronics",
    "path": ["Home", "Electronics", "Accessories"]
  },
  "reviews": {
    "avg_rating": 4.5,
    "count": 1250,
    "recent": [
      {"user": "Alice", "rating": 5, "comment": "Great!", "date": "2024-01-01"},
      {"user": "Bob", "rating": 4, "comment": "Good", "date": "2024-01-02"}
    ]
  },
  "inventory": {
    "total_stock": 500,
    "warehouses": [
      {"location": "NYC", "quantity": 200},
      {"location": "LA", "quantity": 300}
    ]
  },
  "created_at": "2024-01-01"
}

Product Page Query (Single Document):
db.products.findOne({_id: "product_12345"})

Performance:
- Query time: 5ms (single document lookup) - 10× faster! ✅
- No JOINs needed (all data embedded)
- Storage: 800GB (duplication: category in each product) - 30% larger

Pros:
✅ Fast reads (single document, no JOINs)
✅ Easy schema evolution (add fields anytime)
✅ Horizontal scaling (auto-sharding built-in)
✅ Natural data model (matches UI structure)

Cons:
❌ Data duplication (category repeated in each product)
❌ Update anomalies (change category name → update all products)
❌ No referential integrity (app must enforce)
❌ Limited query flexibility (no complex JOINs)

Schema change example:
// Add "brand" field - no migration needed
db.products.updateMany(
  {},
  {$set: {brand: "Unknown"}}
)
// Updates in background, no downtime ✅

Update anomaly example:
// Category renamed: "Electronics" → "Tech"
// Must update ALL products in that category ❌
db.products.updateMany(
  {"category.id": "electronics"},
  {$set: {"category.name": "Tech"}}
)
// Updates 2M products - takes 10 minutes, risk of inconsistency

Data integrity issue:
// Delete category - orphaned products ❌
db.categories.deleteOne({_id: "electronics"})
// 2M products still reference deleted category
// No automatic cleanup (app must handle)

Cost: $400/mo (MongoDB Atlas M30) + $200/mo (replicas) = $600/mo

Decision: ✅ BEST for read-heavy catalogs (10× faster reads)
         ❌ BAD for frequent category updates (update anomalies)

---

Approach 3: Hybrid (PostgreSQL + MongoDB)

Strategy: Use both databases for different purposes

PostgreSQL (source of truth):
- Core data: products, categories, users (normalized)
- Transactional operations: orders, payments, inventory updates
- ACID guarantees for critical data

MongoDB (read cache):
- Denormalized product documents for fast reads
- Sync from PostgreSQL via change data capture (Debezium)
- Read-only queries (product pages, search)

Sync flow:
1. Write to PostgreSQL (orders, inventory updates)
2. Debezium captures changes (CDC)
3. Publish to Kafka topic
4. Consumer updates MongoDB (denormalized view)

Product Page Query:
// Read from MongoDB (5ms, fast)
db.products.findOne({_id: "product_12345"})

Inventory Update:
// Write to PostgreSQL (ACID transaction)
BEGIN;
UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 12345;
INSERT INTO orders (product_id, user_id) VALUES (12345, 789);
COMMIT;
// Debezium syncs to MongoDB within 100ms ✅

Performance:
- Reads: 5ms (MongoDB, denormalized)
- Writes: 50ms (PostgreSQL, transactional)
- Consistency: Eventual (100ms sync lag)

Pros:
✅ Fast reads (MongoDB, no JOINs)
✅ Strong consistency for writes (PostgreSQL ACID)
✅ No update anomalies (PostgreSQL is source of truth)
✅ Best of both worlds

Cons:
❌ Complexity (two databases, sync pipeline)
❌ Eventual consistency (100ms lag)
❌ Higher cost (both databases + Kafka)

Cost:
- PostgreSQL: $600/mo
- MongoDB: $400/mo
- Kafka + Debezium: $300/mo
- Total: $1,300/mo (vs $600-800 single DB)

ROI Analysis:
- Cost increase: +$500/mo
- Benefit: 10× faster product pages (50ms → 5ms)
- User experience: Page load 2s → 0.5s
- Conversion increase: 15% (faster pages = more sales)
- Revenue impact: $500k/mo × 15% = $75k/month
- ROI: $75k benefit / $500 cost = 150× return ✅

Decision: ✅ BEST for high-traffic e-commerce (cost justified)
         ⚠️ Overkill for < 1M page views/day

---

Cost-Benefit by Scale:

Startup (10k products, 100k page views/day):
- Use: PostgreSQL only ($300/mo)
- Reads: 1 QPS (easily handled)
- Decision: Keep it simple

Growth (1M products, 5M page views/day):
- Use: PostgreSQL with read replicas ($800/mo)
- Reads: 60 QPS (replicas handle it)
- Decision: Scale vertically

Scale (10M products, 50M page views/day):
- Use: Hybrid PostgreSQL + MongoDB ($1,300/mo)
- Reads: 580 QPS (MongoDB handles easily)
- Decision: Invest in hybrid architecture`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Decision Framework</H2>
          <CodeBlock>
{`# Data Model Decision Tree

query_pattern = analyze_read_write_ratio()
data_structure = assess_schema_stability()
consistency_requirement = check_consistency_needs()
scale = measure_qps()

if (consistency_requirement == "strong" && transactional):
    # Orders, payments, inventory
    return "Relational (PostgreSQL)"
    # ACID transactions non-negotiable

elif (read_heavy && schema_flexible):
    # Product catalogs, content management
    if (scale < 100_QPS):
        return "Relational (PostgreSQL)"  # Simple, powerful
    elif (scale < 1000_QPS):
        return "Relational + Read Replicas"
    else:
        return "Document (MongoDB)"  # Scale + speed
        # Or: Hybrid (Postgres + Mongo)

elif (highly_relational && complex_queries):
    # Analytics, reporting, business intelligence
    return "Relational (PostgreSQL)"
    # JOIN capabilities essential

elif (simple_key_value && extreme_scale):
    # Session storage, caching
    return "Key-Value (Redis, DynamoDB)"

elif (time_series || high_write_throughput):
    # Metrics, logs, sensor data
    return "Wide-Column (Cassandra, Bigtable)"

else:
    return "Relational (PostgreSQL)"  # Safe default

# Red flags:
if (using_mongodb && need_joins):
    warning("$lookup is slow - consider PostgreSQL or denormalize")
if (using_postgres && horizontal_scaling_needed):
    warning("Sharding is complex - consider MongoDB or Cassandra")`}
          </CodeBlock>

          <Divider />

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Using MongoDB for highly relational data</Strong>
            <P>
              Example: Social network with users, posts, comments, likes using MongoDB → queries require multiple
              \$lookup operations (MongoDB's JOIN) → 500ms queries vs 50ms in PostgreSQL → 10× slower. \$lookup
              performs poorly because it's not optimized like SQL JOINs. Result: Slow feed, poor UX.
            </P>
            <P>
              <Strong>Fix:</Strong> Use PostgreSQL for highly relational data (users, posts, relationships). MongoDB
              \$lookup works but is much slower than SQL JOINs. If data has many relationships, SQL is better choice.
              Or: Denormalize aggressively in MongoDB (embed everything, accept duplication). For social networks:
              PostgreSQL is proven choice (Twitter, Instagram use Postgres/MySQL).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Normalizing data in MongoDB (killing performance)</Strong>
            <P>
              Example: E-commerce stores products, categories, reviews in separate collections → product page requires
              3 queries → N+1 problem (1 product + N reviews) → 100ms latency. Defeats MongoDB's strength (fast single-document reads).
            </P>
            <P>
              <Strong>Fix:</Strong> Denormalize in MongoDB: Embed related data in single document. Product page = 1 query
              (5ms). Accept duplication. Update categories → update all products (batch update). Or: If can't accept
              duplication, use PostgreSQL instead. MongoDB shines with denormalized data, fails with normalized data.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Not planning for schema evolution</Strong>
            <P>
              Example: E-commerce with 10M products in PostgreSQL → add "brand" column → ALTER TABLE locks table for
              30 minutes → site down → $500k revenue loss. Schema migrations in production are dangerous with large tables.
            </P>
            <P>
              <Strong>Fix:</Strong> For PostgreSQL: Use online schema change tools (pt-online-schema-change for MySQL,
              pg_repack for Postgres). Or: Add columns as nullable (no default value = instant). Or: Use MongoDB if
              schema changes frequently (add fields anytime, no downtime). Plan schema changes: test on replica first,
              run during low-traffic hours.
            </P>
          </InfoBox>

          <Divider />

          <KeyPoint>
            <Strong>ROI Example:</Strong> E-commerce with 50M page views/day. PostgreSQL only: 50ms product page queries,
            requires expensive hardware ($1,200/mo r5.4xlarge). MongoDB: 5ms queries (10× faster), cheaper hardware
            ($400/mo). User experience: 2s page load → 0.5s (4× faster). Conversion increase: 15% = $75k/month additional
            revenue. MongoDB cost: +$100/mo vs scaled-up Postgres. ROI: 750× ($75k / $100). Fast reads = better UX = more sales.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'normalization-vs-denormalization-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Normalization vs Denormalization',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Normalization vs Denormalization</H1>
          <P>
            <Strong>The Decision:</Strong> Normalization (3NF) eliminates data duplication and ensures consistency but
            requires expensive JOINs. Denormalization duplicates data for fast reads but risks update anomalies and
            wasted storage. Wrong choice: either slow queries killing UX or data inconsistencies causing bugs.
          </P>

          <ComparisonTable
            headers={['Factor', 'Fully Normalized (3NF)', 'Partially Denormalized', 'Fully Denormalized', 'Materialized Views']}
            rows={[
              ['Read Performance', 'Slow (multiple JOINs)', 'Medium (fewer JOINs)', 'Fast (single query)', 'Fast (pre-computed)'],
              ['Write Performance', 'Fast (single table)', 'Medium (update duplicates)', 'Slow (update all copies)', 'Slow (rebuild view)'],
              ['Storage Efficiency', 'Excellent (no duplication)', 'Good (minimal duplication)', 'Poor (high duplication)', 'Poor (stores results)'],
              ['Data Consistency', 'Guaranteed (foreign keys)', 'Risky (app must sync)', 'Very Risky (update anomalies)', 'Eventual (refresh lag)'],
              ['Query Complexity', 'High (complex JOINs)', 'Medium (some JOINs)', 'Low (simple SELECT)', 'Low (direct query)'],
              ['Schema Evolution', 'Easy (single location)', 'Hard (update multiple)', 'Very Hard (update everywhere)', 'Medium (rebuild view)'],
              ['Best For', 'Write-heavy, consistency critical', 'Balanced read/write', 'Read-heavy, eventual OK', 'Analytics, reports'],
            ]}
          />

          <Divider />

          <H2>Real Decision: Social Media Feed</H2>
          <Example title="Normalization vs Denormalization - Consistency vs Performance">
            <CodeBlock>
{`Scenario: Twitter-like feed showing posts with user info
100M users, 1B posts, 10B feed views/day = 115k QPS

---

Approach 1: Fully Normalized (3NF)

Schema:
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  username VARCHAR(50),
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT
);

CREATE TABLE posts (
  id BIGINT PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  content TEXT,
  created_at TIMESTAMP
);

CREATE TABLE likes (
  user_id BIGINT REFERENCES users(id),
  post_id BIGINT REFERENCES posts(id),
  created_at TIMESTAMP,
  PRIMARY KEY (user_id, post_id)
);

Feed Query (normalized):
SELECT
  p.id, p.content, p.created_at,
  u.username, u.display_name, u.avatar_url,
  COUNT(l.user_id) as like_count
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN likes l ON p.id = l.post_id
WHERE p.user_id IN (
  SELECT following_id FROM follows WHERE follower_id = 12345
)
GROUP BY p.id, u.username, u.display_name, u.avatar_url
ORDER BY p.created_at DESC
LIMIT 20;

Performance:
- Query time: 500ms (3-way JOIN + subquery + aggregation) ❌
- Indexes needed: 5 (user_id, post_id, following_id)
- QPS capacity: 200 QPS per server
- Servers needed: 115k QPS / 200 = 575 servers
- Cost: $172,500/mo (r5.large × 575) ❌ INSANE COST

Pros:
✅ No data duplication (single source of truth)
✅ User updates instant (change once)
✅ Storage efficient (100GB users + 2TB posts)
✅ Data consistency guaranteed

Cons:
❌ Very slow reads (500ms per feed)
❌ Complex query (3 JOINs + aggregation)
❌ Extreme cost ($172k/mo)
❌ Can't scale to 115k QPS

Decision: ❌ IMPOSSIBLE - Can't scale to Twitter-level traffic

---

Approach 2: Partially Denormalized (Cache User Info)

Schema:
CREATE TABLE posts (
  id BIGINT PRIMARY KEY,
  user_id BIGINT,
  content TEXT,
  created_at TIMESTAMP,
  -- Denormalized user info
  username VARCHAR(50),      -- ✅ Cached from users table
  display_name VARCHAR(100), -- ✅ Cached
  avatar_url TEXT,           -- ✅ Cached
  like_count INT DEFAULT 0   -- ✅ Cached
);

Feed Query (partially denormalized):
SELECT
  id, content, created_at,
  username, display_name, avatar_url,
  like_count
FROM posts
WHERE user_id IN (
  SELECT following_id FROM follows WHERE follower_id = 12345
)
ORDER BY created_at DESC
LIMIT 20;

Performance:
- Query time: 50ms (1 JOIN, no aggregation) - 10× faster! ✅
- QPS capacity: 2k QPS per server (10× improvement)
- Servers needed: 115k / 2k = 58 servers
- Cost: $17,400/mo (r5.large × 58) ✅ 10× cheaper!

Trade-offs:
✅ 10× faster reads (500ms → 50ms)
✅ 10× cheaper infrastructure
✅ Simple queries (single table mostly)

❌ Update complexity (user changes username):
    -- Must update ALL posts by that user ❌
    UPDATE posts SET username = 'new_name'
    WHERE user_id = 12345;
    -- If user has 10k posts, updates 10k rows

❌ Storage duplication:
    -- Username stored in users + 1B posts
    -- Storage: 100GB users + 2.5TB posts (+25%)

Update anomaly risk:
User changes username:
1. Update users table (instant)
2. Update posts table (10k rows, 5 seconds)
3. Gap: Some posts show old name, some new ❌
4. Eventually consistent after 5 seconds

Mitigation:
-- Use queue to update posts asynchronously
UPDATE users SET username = 'new_name' WHERE id = 12345;
queue.publish({
  task: 'update_posts_username',
  user_id: 12345,
  new_username: 'new_name'
});
-- Background worker updates posts over 5 minutes

Decision: ✅ GOOD - Balanced approach for most apps

---

Approach 3: Fully Denormalized (Feed Pre-Computed)

Strategy: Pre-compute feed for each user, store as document

MongoDB Schema:
{
  "_id": "user_12345_feed",
  "user_id": 12345,
  "posts": [
    {
      "post_id": "post_789",
      "content": "Hello world",
      "created_at": "2024-01-01T12:00:00Z",
      "author": {
        "user_id": 456,
        "username": "alice",
        "display_name": "Alice Smith",
        "avatar_url": "https://..."
      },
      "like_count": 42,
      "comment_count": 5
    },
    // ... 1000 recent posts
  ],
  "last_updated": "2024-01-01T12:05:00Z"
}

Feed Query (fully denormalized):
db.feeds.findOne({_id: "user_12345_feed"})

Performance:
- Query time: 2ms (single document lookup) - 250× faster! ✅
- QPS capacity: 50k QPS per server
- Servers needed: 115k / 50k = 3 servers
- Cost: $900/mo (r5.large × 3) ✅ 192× cheaper than normalized!

Feed Update (fanout on write):
When user posts:
1. Insert post to posts collection
2. Fan out to all followers' feeds
   - User has 1000 followers
   - Update 1000 feed documents (add post to array)
   - Time: 100ms (batch update)

Trade-offs:
✅ Extremely fast reads (2ms)
✅ Minimal infrastructure cost ($900/mo)
✅ Scales to millions of QPS

❌ Slow writes (fanout to all followers)
   Celebrity with 10M followers:
   - Post takes 10 seconds to fanout ❌
   - 10M feed updates

❌ Storage explosion:
   - 100M users × 1000 posts × 2KB = 200TB
   - vs 2TB normalized (100× storage)
   - Cost: $10k/mo storage vs $100/mo

❌ Update anomalies everywhere:
   User changes username:
   - Must update ALL feeds containing their posts
   - 10M feeds × 100 posts = 1B updates ❌
   - Takes hours, data inconsistent

Celebrity problem:
User with 10M followers posts:
- Fanout: Update 10M feeds
- Time: 100 seconds (async workers)
- Some followers see post instantly, others wait 100s
- Solution: Hybrid - fanout for regular users, pull for celebrities

Decision: ✅ BEST for read-heavy apps (Twitter, Facebook)
         ⚠️ Requires complex fanout logic

---

Approach 4: Materialized Views (Best of Both)

Strategy: Keep normalized tables, pre-compute views

PostgreSQL:
CREATE MATERIALIZED VIEW user_feed_12345 AS
SELECT
  p.id, p.content, p.created_at,
  u.username, u.display_name, u.avatar_url,
  COUNT(l.user_id) as like_count
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN likes l ON p.id = l.post_id
WHERE p.user_id IN (
  SELECT following_id FROM follows WHERE follower_id = 12345
)
GROUP BY p.id, u.username, u.display_name, u.avatar_url
ORDER BY p.created_at DESC;

-- Refresh every 5 minutes
REFRESH MATERIALIZED VIEW CONCURRENTLY user_feed_12345;

Feed Query:
SELECT * FROM user_feed_12345 LIMIT 20;

Performance:
- Query time: 5ms (pre-computed) ✅
- Refresh time: 1 second (per user)
- Staleness: Up to 5 minutes
- Cost: $5k/mo (storage for views)

Pros:
✅ Fast reads (5ms, pre-computed)
✅ Source data still normalized (easy updates)
✅ No update anomalies (refresh rebuilds)

Cons:
❌ Eventual consistency (5 min lag)
❌ Refresh overhead (compute intensive)
❌ Not suitable for real-time feeds

Decision: ✅ BEST for analytics dashboards (5-15 min stale OK)
         ❌ BAD for real-time social feeds (need instant updates)

---

Decision Matrix by Use Case:

Analytics Dashboard (stale data OK):
- Use: Materialized views
- Benefit: Fast queries, easy maintenance

Admin Panel (low traffic):
- Use: Fully normalized
- Benefit: Simple, consistent, low cost

E-commerce Product Pages (read-heavy):
- Use: Partially denormalized
- Benefit: Balanced (fast reads, manageable writes)

Social Media Feed (extreme scale):
- Use: Fully denormalized (fanout)
- Benefit: 2ms reads, scales to 1M QPS

Order History (write-heavy):
- Use: Fully normalized
- Benefit: ACID transactions, no duplication`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Decision Framework</H2>
          <CodeBlock>
{`# Normalization vs Denormalization Decision

read_write_ratio = measure_reads_per_write()
update_frequency = measure_data_update_rate()
consistency_requirement = assess_staleness_tolerance()
scale_target = estimate_peak_qps()

if (consistency_critical && transactional):
    # Banking, payments, inventory
    return "Fully Normalized (3NF)"
    # ACID transactions, no duplication

elif (read_write_ratio > 100 && scale_target > 10k_QPS):
    # Social media, news feeds, product catalogs
    if (staleness_ok > 5_minutes):
        return "Materialized Views"
        # Fast reads, maintain normalized source
    else:
        return "Fully Denormalized (Fanout)"
        # Real-time reads, complex writes

elif (read_write_ratio > 10 && scale_target > 1k_QPS):
    # E-commerce, content sites
    return "Partially Denormalized"
    # Cache frequently accessed fields
    # Balance read speed + write complexity

elif (complex_queries && joins_required):
    # Analytics, reporting, business intelligence
    if (staleness_ok > 15_minutes):
        return "Materialized Views"
    else:
        return "Fully Normalized + Caching"

else:
    return "Fully Normalized (3NF)"
    # Default: maintain data integrity

# Red flags:
if (denormalized && update_frequency > 10_per_second):
    warning("High update frequency causes update storms - consider normalized")

if (normalized && read_qps > 10k):
    warning("Normalized schema can't scale to 10k QPS - consider denormalization")

if (materialized_view && staleness_ok < 1_minute):
    warning("Materialized views have refresh lag - use denormalized cache instead")`}
          </CodeBlock>

          <Divider />

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Denormalizing without update strategy</Strong>
            <P>
              Example: E-commerce stores category name in products → category renamed → forget to update products →
              50% products show old name, 50% new name → customer confusion → 200 support tickets. Update anomaly
              causes data inconsistency.
            </P>
            <P>
              <Strong>Fix:</Strong> Always implement update propagation: Use triggers (PostgreSQL), change streams
              (MongoDB), or application code. Example: <Code>CREATE TRIGGER update_products AFTER UPDATE ON categories
              FOR EACH ROW UPDATE products SET category_name = NEW.name WHERE category_id = OLD.id</Code>. Or: Use
              event-driven updates (category changed → publish event → update products asynchronously).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Over-normalizing read-heavy data</Strong>
            <P>
              Example: Product catalog with 5-way JOIN (products → categories → brands → manufacturers → countries) →
              500ms queries → poor UX → users abandon slow site → $100k/month lost revenue. Normalized schema kills
              performance for read-heavy workloads.
            </P>
            <P>
              <Strong>Fix:</Strong> Denormalize frequently accessed data: Cache category name, brand name in products
              table. Accept duplication for performance. Query becomes: <Code>SELECT * FROM products WHERE id = 123</Code>
              (5ms vs 500ms). Or: Use materialized views to pre-compute JOINs. For product catalogs, denormalization
              typically improves performance 10-100×.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Full fanout for celebrity users</Strong>
            <P>
              Example: Twitter-like app with full fanout → celebrity with 10M followers posts → update 10M feeds →
              takes 100 seconds → followers see post with massive delay → poor real-time experience. Fanout doesn't
              scale for power users.
            </P>
            <P>
              <Strong>Fix:</Strong> Hybrid fanout strategy: Regular users (< 10k followers): Fanout on write (instant
              delivery). Celebrities (> 10k followers): Pull on read (fetch from posts table). Example: Twitter uses
              fanout for normal users, pull for celebrities (followers > 100k). Result: Instant delivery for 99% of
              users, slightly slower for celebrity followers but scalable.
            </P>
          </InfoBox>

          <Divider />

          <KeyPoint>
            <Strong>ROI Example:</Strong> Social media with 115k QPS. Normalized: $172k/mo (575 servers for 500ms queries).
            Denormalized: $900/mo (3 servers for 2ms queries). Savings: $171k/mo = $2M/year. User experience: 500ms → 2ms
            (250× faster feeds). Engagement increase: 30% (instant feeds). Trade-off: Storage cost +$10k/mo (duplication),
            update complexity (fanout logic). Net savings: $161k/mo. Denormalization enables social media scale.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

