import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider 
} from '../../../ui/components/LessonContent';

export const storageFundamentalsLesson: SystemDesignLesson = {
  id: 'storage-fundamentals',
  slug: 'storage-fundamentals',
  title: 'Storage Fundamentals',
  description: 'Master storage trade-offs: WHEN to use SQL vs NoSQL vs Key-Value vs Object Storage, HOW to choose between storage types based on query needs and schema flexibility, and WHICH replication strategy (leader-follower vs multi-leader vs leaderless) based on global distribution and consistency requirements.',
  category: 'patterns',
  difficulty: 'intermediate',
  estimatedMinutes: 50,

  // Progressive flow metadata
  moduleId: 'sd-module-3-patterns',
  sequenceOrder: 9,

  stages: [
    {
      id: 'storage-types',
      type: 'concept',
      title: 'Types of Storage Systems',
      content: (
        <Section>
          <H1>Types of Storage Systems</H1>
          
          <P>Different storage systems for different use cases.</P>

          <H2>1. Relational Database (SQL)</H2>

          <P><Strong>Examples:</Strong> PostgreSQL, MySQL, Oracle</P>
          <P><Strong>Best for:</Strong> Structured data with relationships</P>

          <CodeBlock language="sql">
{`CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT REFERENCES users(id),
  total DECIMAL(10,2)
);

SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;`}
          </CodeBlock>

          <P><Strong>Pros:</Strong></P>
          <UL>
            <LI>ACID transactions</LI>
            <LI>Complex queries (JOINs)</LI>
            <LI>Data integrity (foreign keys)</LI>
          </UL>

          <P><Strong>Cons:</Strong></P>
          <UL>
            <LI>Difficult to scale horizontally</LI>
            <LI>Fixed schema (migrations needed)</LI>
          </UL>

          <Divider />

          <H2>2. NoSQL Document Store</H2>

          <P><Strong>Examples:</Strong> MongoDB, CouchDB</P>
          <P><Strong>Best for:</Strong> Flexible schema, nested data</P>

          <CodeBlock language="javascript">
{`{
  "_id": "user123",
  "name": "Alice",
  "email": "alice@example.com",
  "preferences": {
    "theme": "dark",
    "notifications": {
      "email": true,
      "push": false
    }
  },
  "tags": ["premium", "verified"]
}`}
          </CodeBlock>

          <P><Strong>Pros:</Strong></P>
          <UL>
            <LI>Flexible schema (no migrations)</LI>
            <LI>Scales horizontally (sharding)</LI>
            <LI>Fast for document lookups</LI>
          </UL>

          <P><Strong>Cons:</Strong></P>
          <UL>
            <LI>No JOINs (denormalize data)</LI>
            <LI>Eventual consistency</LI>
          </UL>

          <Divider />

          <H2>3. Key-Value Store</H2>

          <P><Strong>Examples:</Strong> Redis, DynamoDB</P>
          <P><Strong>Best for:</Strong> Simple lookups, caching</P>

          <CodeBlock>
{`SET user:123:session "abc123xyz"
GET user:123:session  → "abc123xyz"

SET product:456:price 99.99
INCR product:456:views`}
          </CodeBlock>

          <P><Strong>Pros:</Strong></P>
          <UL>
            <LI>Extremely fast (O(1) lookups)</LI>
            <LI>Simple API</LI>
            <LI>In-memory or persistent</LI>
          </UL>

          <P><Strong>Cons:</Strong></P>
          <UL>
            <LI>No complex queries</LI>
            <LI>No relationships</LI>
          </UL>

          <Divider />

          <H2>4. Object Storage</H2>

          <P><Strong>Examples:</Strong> Amazon S3, Google Cloud Storage</P>
          <P><Strong>Best for:</Strong> Large files (images, videos, backups)</P>

          <CodeBlock>
{`PUT /bucket/photos/vacation.jpg
GET /bucket/photos/vacation.jpg
DELETE /bucket/photos/vacation.jpg`}
          </CodeBlock>

          <P><Strong>Pros:</Strong></P>
          <UL>
            <LI>Unlimited storage</LI>
            <LI>99.999999999% durability (11 nines)</LI>
            <LI>Cheap ($0.023/GB/month)</LI>
          </UL>

          <P><Strong>Cons:</Strong></P>
          <UL>
            <LI>High latency (not for hot data)</LI>
            <LI>No querying (just get/put)</LI>
          </UL>

          <Divider />

          <H2>Choosing the Right Storage</H2>

          <ComparisonTable
            headers={['Use Case', 'Storage Type', 'Example']}
            rows={[
              ['User accounts, orders', 'Relational DB', 'PostgreSQL'],
              ['User profiles, settings', 'NoSQL Document', 'MongoDB'],
              ['Session data, cache', 'Key-Value', 'Redis'],
              ['Product images, videos', 'Object Storage', 'S3'],
              ['Search', 'Search Engine', 'Elasticsearch'],
              ['Analytics', 'Data Warehouse', 'BigQuery'],
            ]}
          />

          <Divider />

          <H2>🎯 Critical Trade-Off: SQL vs NoSQL vs Key-Value vs Object Storage</H2>

          <ComparisonTable
            headers={['Storage Type', 'Query Power', 'Scalability', 'Consistency', 'Cost/TB', 'Latency', 'Best For', 'Worst For']}
            rows={[
              [
                'SQL\n(PostgreSQL)',
                'Very High\n(JOINs, aggregations)',
                'Low\n(vertical scaling)',
                'Strong\n(ACID)',
                '$500-2000/mo',
                'Medium\n10-50ms',
                '• Financial\n• E-commerce\n• Complex relationships\n• Transactions',
                '• Flexible schema\n• Billions of records\n• Rapid iteration\n• Simple key lookups'
              ],
              [
                'NoSQL Document\n(MongoDB)',
                'Medium\n(single doc queries)',
                'Very High\n(horizontal)',
                'Eventual\n(BASE)',
                '$200-800/mo',
                'Low\n5-20ms',
                '• User profiles\n• Content management\n• Flexible schema\n• Rapid dev',
                '• Complex JOINs\n• ACID transactions\n• Strict schema\n• Financial data'
              ],
              [
                'Key-Value\n(Redis, DynamoDB)',
                'Low\n(get/set only)',
                'Very High\n(horizontal)',
                'Tunable',
                '$100-500/mo',
                'Very Low\n1-5ms',
                '• Cache\n• Sessions\n• Counters\n• Real-time\n• Simple lookups',
                '• Complex queries\n• JOINs\n• Analytics\n• Large objects'
              ],
              [
                'Object Storage\n(S3)',
                'None\n(no queries)',
                'Unlimited',
                'Eventual',
                '$23/mo',
                'High\n50-200ms',
                '• Media files\n• Backups\n• Archives\n• Large files\n• Static assets',
                '• Small files\n• Hot data\n• Frequent updates\n• Complex queries'
              ],
            ]}
          />

          <Example title="Real Decision: User Management System">
            <P><Strong>Scenario:</Strong> Store user accounts (1M users), need login, profile updates, order history</P>

            <P><Strong>Option 1: MongoDB (wrong for this use case)</Strong></P>
            <CodeBlock>
{`Data model:
{
  "userId": "123",
  "email": "user@example.com",
  "orders": [
    {"orderId": "order1", "total": 99.99, "items": [...]},
    {"orderId": "order2", "total": 149.99, "items": [...]}
  ]
}

Problems:
1. Duplicate order data (order stored in user doc AND orders collection)
2. Update order → Must update ALL users who have that order
3. Query: "Find all users who bought product X"
   → Must scan ALL user documents (slow!)
4. Data integrity: No foreign keys → Easy to have orphaned data

Cost: $400/mo
Query time: 500ms (scanning all users)
Data duplication: 3x storage needed

Result: ❌ NoSQL is WRONG for transactional data with relationships`}
            </CodeBlock>

            <P><Strong>Option 2: PostgreSQL (Correct Choice)</Strong></P>
            <CodeBlock>
{`Data model:
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE,
  created_at TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  total DECIMAL,
  created_at TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  product_id INT,
  quantity INT
);

Benefits:
1. No data duplication (normalized)
2. Update order → Update ONE row
3. Query: "Find all users who bought product X"
   → JOIN query: 10ms (indexed)
4. Data integrity: Foreign keys prevent orphans
5. ACID transactions: Atomic order creation

Cost: $300/mo
Query time: 10ms (indexed JOIN)
Data duplication: None (normalized)

Result: ✅ SQL is RIGHT for transactional, relational data

Trade-off: Fixed schema (migrations needed) vs 50x faster queries`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> SQL requires migrations but provides JOINs, ACID, and data integrity.
              For user/order data with relationships, SQL is 50x faster than NoSQL document store.
            </KeyPoint>
          </Example>

          <Example title="Real Decision: Content Management System (CMS)">
            <P><Strong>Scenario:</Strong> Store blog posts with flexible content (text, images, videos, custom fields)</P>

            <P><Strong>Option 1: PostgreSQL (wrong for this use case)</Strong></P>
            <CodeBlock>
{`Data model:
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR,
  body TEXT,
  author_id INT,
  -- Problem: What about video posts? Image galleries? Podcasts?
);

-- Need to add columns for each content type
ALTER TABLE posts ADD COLUMN video_url VARCHAR;
ALTER TABLE posts ADD COLUMN gallery_images JSONB;
ALTER TABLE posts ADD COLUMN podcast_url VARCHAR;

Problems:
1. Schema changes for each new content type (slow iteration)
2. Most columns NULL for most posts (sparse data)
3. Complex validation logic (if video_url, then body must be empty)
4. Migrations needed for every feature

Developer velocity: 2 weeks per new content type
Schema: Rigid, many migrations
Cost: $300/mo

Result: ❌ SQL is TOO RIGID for flexible content types`}
            </CodeBlock>

            <P><Strong>Option 2: MongoDB (Correct Choice)</Strong></P>
            <CodeBlock>
{`Data model:
// Text post
{
  "postId": "123",
  "type": "text",
  "title": "My Blog Post",
  "body": "Lorem ipsum...",
  "author": "Alice"
}

// Video post
{
  "postId": "124",
  "type": "video",
  "title": "My Video",
  "videoUrl": "https://...",
  "duration": 120,
  "subtitles": [...],
  "author": "Bob"
}

// Photo gallery post
{
  "postId": "125",
  "type": "gallery",
  "images": [
    {"url": "https://...", "caption": "Photo 1"},
    {"url": "https://...", "caption": "Photo 2"}
  ],
  "author": "Charlie"
}

Benefits:
1. No schema changes needed (add new fields instantly)
2. Each post has only relevant fields (no sparse data)
3. Fast iteration (ship new content types in 1 day vs 2 weeks)
4. No migrations

Developer velocity: 1 day per new content type
Schema: Flexible, no migrations
Cost: $200/mo

Result: ✅ NoSQL is RIGHT for flexible, rapidly-evolving schemas

Trade-off: No JOINs (must denormalize author data) vs 14x faster development`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> NoSQL enables 14x faster development for flexible schemas
              but requires denormalization. For CMS with varied content types, worth it.
            </KeyPoint>
          </Example>

          <H3>Decision Framework: Choosing Storage Type</H3>
          <CodeBlock>
{`Do you need ACID transactions or complex JOINs?

├─ YES (financial, e-commerce, multi-table relationships) → SQL
│   └─ Examples: User accounts, orders, payments, inventory
│   └─ Accept: Fixed schema, migrations, vertical scaling limits
│   └─ Benefit: ACID, JOINs, data integrity, mature tooling
│
└─ NO → Is your schema flexible/evolving?
    │
    ├─ YES (CMS, user profiles, varied data) → NoSQL Document Store
    │   └─ Examples: Blog posts, user profiles, product catalogs
    │   └─ Accept: No JOINs (denormalize), eventual consistency
    │   └─ Benefit: Flexible schema, fast iteration, horizontal scaling
    │
    └─ NO → Is it simple key-value lookups?
        │
        ├─ YES (cache, sessions, counters) → Key-Value Store
        │   └─ Examples: Session data, cache, rate limiting
        │   └─ Accept: No complex queries, just get/set
        │   └─ Benefit: Extremely fast (1-5ms), simple, cheap
        │
        └─ NO → Is it large files (>1MB)?
            │
            ├─ YES → Object Storage (S3)
            │   └─ Examples: Images, videos, backups
            │   └─ Accept: High latency (50-200ms), no queries
            │   └─ Benefit: Unlimited storage, 11 nines durability, $23/TB
            │
            └─ Complex → Use multiple storage types!
                └─ SQL for transactions, NoSQL for flexibility, Redis for cache, S3 for files`}
          </CodeBlock>
        </Section>
      ),
    },
    {
      id: 'sql-vs-nosql',
      type: 'concept',
      title: 'SQL vs NoSQL',
      content: (
        <Section>
          <H1>SQL vs NoSQL</H1>

          <P>When to use each type of database.</P>

          <H2>SQL (Relational)</H2>

          <H3>When to Use SQL</H3>
          <UL>
            <LI><Strong>Complex relationships:</Strong> Users, orders, products with foreign keys</LI>
            <LI><Strong>ACID transactions:</Strong> Financial systems, e-commerce</LI>
            <LI><Strong>Complex queries:</Strong> Multi-table JOINs, aggregations</LI>
            <LI><Strong>Data integrity:</Strong> Strict schema, constraints</LI>
          </UL>

          <Example title="E-commerce Order System">
            <CodeBlock language="sql">
{`-- Atomic transaction: deduct inventory and create order
BEGIN TRANSACTION;
  UPDATE products SET stock = stock - 1 WHERE id = 123;
  INSERT INTO orders (user_id, product_id) VALUES (456, 123);
COMMIT;

-- Complex query: top customers
SELECT u.name, SUM(o.total) as revenue
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.created_at > '2024-01-01'
GROUP BY u.id
ORDER BY revenue DESC
LIMIT 10;`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>NoSQL (Non-Relational)</H2>

          <H3>When to Use NoSQL</H3>
          <UL>
            <LI><Strong>Flexible schema:</Strong> User profiles with varying fields</LI>
            <LI><Strong>Horizontal scaling:</Strong> Billions of documents</LI>
            <LI><Strong>Fast reads/writes:</Strong> Real-time applications</LI>
            <LI><Strong>Denormalized data:</Strong> No JOINs needed</LI>
          </UL>

          <Example title="Social Media User Profile">
            <CodeBlock language="javascript">
{`// Each user document is self-contained
{
  "_id": "user123",
  "name": "Alice",
  "posts": [
    {
      "id": "post1",
      "text": "Hello world!",
      "likes": 42,
      "comments": [...]
    }
  ],
  "followers": ["user456", "user789"],
  "preferences": {...}
}

// No JOINs needed - everything in one document
// Scales horizontally by sharding on user_id`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Key Differences</H2>

          <ComparisonTable
            headers={['Aspect', 'SQL', 'NoSQL']}
            rows={[
              ['Schema', 'Fixed (predefined)', 'Flexible (dynamic)'],
              ['Scaling', 'Vertical (bigger server)', 'Horizontal (more servers)'],
              ['Transactions', 'ACID (strong)', 'BASE (eventual)'],
              ['Queries', 'Complex (JOINs)', 'Simple (key lookups)'],
              ['Consistency', 'Strong', 'Eventual'],
              ['Use Case', 'Financial, E-commerce', 'Social, Real-time'],
            ]}
          />

          <Divider />

          <H2>Hybrid Approach</H2>

          <P>Most large systems use <Strong>both</Strong>!</P>

          <Example title="E-commerce Platform">
            <CodeBlock>
{`PostgreSQL (SQL):
  - User accounts
  - Orders
  - Payments
  - Inventory

MongoDB (NoSQL):
  - Product catalog (flexible attributes)
  - User activity logs
  - Recommendations

Redis (Key-Value):
  - Session data
  - Shopping cart
  - Cache

S3 (Object Storage):
  - Product images
  - User uploads`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            Use the <Strong>right tool for the job</Strong>. Don't force SQL for everything, 
            and don't use NoSQL just because it's trendy!
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'sharding',
      type: 'concept',
      title: 'Sharding',
      content: (
        <Section>
          <H1>Sharding</H1>

          <P>
            Sharding splits data across multiple databases to scale horizontally.
          </P>

          <H2>The Problem: Vertical Scaling Limits</H2>

          <Example title="Single database bottleneck">
            <CodeBlock>
{`Database: 1 billion users
Single server: 64GB RAM, 16 cores

Problems:
- Can't fit all data in memory
- Single server CPU maxed out
- Expensive to upgrade hardware
- Single point of failure`}
            </CodeBlock>
          </Example>

          <H2>Solution: Horizontal Sharding</H2>

          <P>Split data across multiple databases (shards).</P>

          <CodeBlock>
{`Shard 1: Users 0-333M
Shard 2: Users 334M-666M
Shard 3: Users 667M-1B

Each shard:
- 333M users
- 21GB RAM
- 5 cores
- Cheaper servers
- No single point of failure`}
          </CodeBlock>

          <Divider />

          <H2>Sharding Strategies</H2>

          <H3>1. Range-Based Sharding</H3>
          <P>Split by key range.</P>

          <CodeBlock>
{`Shard 1: user_id 0-999
Shard 2: user_id 1000-1999
Shard 3: user_id 2000-2999

Lookup user_id=1234:
  → Shard 2 (1000-1999)`}
          </CodeBlock>

          <P><Strong>Pros:</Strong> Simple, range queries easy</P>
          <P><Strong>Cons:</Strong> Hot spots (new users all go to last shard)</P>

          <H3>2. Hash-Based Sharding</H3>
          <P>Use hash function to determine shard.</P>

          <CodeBlock>
{`shard = hash(user_id) % num_shards

hash(123) % 3 = 0 → Shard 0
hash(456) % 3 = 1 → Shard 1
hash(789) % 3 = 2 → Shard 2`}
          </CodeBlock>

          <P><Strong>Pros:</Strong> Even distribution, no hot spots</P>
          <P><Strong>Cons:</Strong> Range queries difficult, resharding hard</P>

          <H3>3. Geographic Sharding</H3>
          <P>Shard by location.</P>

          <CodeBlock>
{`Shard US-West: Users in California, Oregon, Washington
Shard US-East: Users in New York, Virginia, Florida
Shard EU: Users in Europe
Shard Asia: Users in Asia

Lookup user in California:
  → Shard US-West (low latency)`}
          </CodeBlock>

          <P><Strong>Pros:</Strong> Low latency, data residency compliance</P>
          <P><Strong>Cons:</Strong> Uneven distribution, cross-shard queries complex</P>

          <Divider />

          <H2>Challenges</H2>

          <H3>1. Cross-Shard Queries</H3>
          <P><Strong>Problem:</Strong> JOINs across shards are slow</P>

          <CodeBlock>
{`-- User 123 on Shard 1
-- User 456 on Shard 2

-- This query requires querying both shards
SELECT * FROM users WHERE user_id IN (123, 456);

Solution: Denormalize data or use application-level joins`}
          </CodeBlock>

          <H3>2. Resharding</H3>
          <P><Strong>Problem:</Strong> Adding/removing shards requires data migration</P>

          <CodeBlock>
{`3 shards → 4 shards
hash(user_id) % 3 → hash(user_id) % 4

Most keys change shards!
→ Massive data migration
→ Downtime

Solution: Consistent hashing`}
          </CodeBlock>

          <H3>3. Distributed Transactions</H3>
          <P><Strong>Problem:</Strong> ACID transactions across shards are complex</P>

          <CodeBlock>
{`Transfer $100 from User A (Shard 1) to User B (Shard 2)

Requires 2-phase commit:
1. Prepare: Lock both shards
2. Commit: Update both shards
3. Release locks

Slow and complex!

Solution: Avoid cross-shard transactions, use eventual consistency`}
          </CodeBlock>

          <KeyPoint>
            Sharding enables massive scale but adds complexity. Only shard when you 
            <Strong>truly need</Strong> to scale beyond a single database!
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'replication',
      type: 'concept',
      title: 'Replication',
      content: (
        <Section>
          <H1>Replication</H1>

          <P>
            Replication copies data across multiple servers for high availability and read scaling.
          </P>

          <H2>Why Replicate?</H2>

          <H3>1. High Availability</H3>
          <P>If primary fails, replica takes over.</P>

          <CodeBlock>
{`Primary DB (down) ❌
Replica 1 (promoted to primary) ✅
Replica 2 (becomes new replica) ✅

System stays online!`}
          </CodeBlock>

          <H3>2. Read Scaling</H3>
          <P>Distribute read traffic across replicas.</P>

          <CodeBlock>
{`Primary: Handles all writes
Replica 1: Handles 33% of reads
Replica 2: Handles 33% of reads
Replica 3: Handles 33% of reads

3x read capacity!`}
          </CodeBlock>

          <H3>3. Geographic Distribution</H3>
          <P>Place replicas close to users.</P>

          <CodeBlock>
{`Primary: US-West
Replica 1: US-East (low latency for East Coast users)
Replica 2: EU (low latency for European users)
Replica 3: Asia (low latency for Asian users)`}
          </CodeBlock>

          <Divider />

          <H2>Replication Strategies</H2>

          <H3>1. Leader-Follower (Primary-Replica)</H3>
          <P>One primary handles writes, replicas handle reads.</P>

          <CodeBlock>
{`Write Flow:
Client → Primary → Replicas (async)

Read Flow:
Client → Any Replica

Pros:
- Simple
- Scales reads
- High availability

Cons:
- Replication lag (eventual consistency)
- Single point of failure for writes`}
          </CodeBlock>

          <H3>2. Multi-Leader</H3>
          <P>Multiple primaries accept writes.</P>

          <CodeBlock>
{`Primary US → Replicas
Primary EU → Replicas

Both accept writes, sync with each other

Pros:
- No single point of failure
- Low write latency (write to nearest primary)

Cons:
- Conflict resolution needed
- Complex`}
          </CodeBlock>

          <H3>3. Leaderless (Quorum)</H3>
          <P>Write to multiple nodes, read from multiple nodes.</P>

          <CodeBlock>
{`Write to 3 nodes (W=2 required for success)
Node 1: ✅
Node 2: ✅
Node 3: ❌ (down)
→ Write succeeds (2/3)

Read from 3 nodes (R=2 required)
Node 1: value=10
Node 2: value=10
Node 3: ❌ (down)
→ Read succeeds (2/3 agree on value=10)

Quorum: W + R > N ensures consistency`}
          </CodeBlock>

          <Divider />

          <H2>Replication Lag</H2>

          <P>
            Time delay between write to primary and replication to followers.
          </P>

          <Example title="Read-your-writes problem">
            <CodeBlock>
{`1. User posts comment (write to primary)
2. User refreshes page (read from replica)
3. Replica hasn't replicated yet
4. User doesn't see their comment!

Solution: Read from primary for user's own data`}
            </CodeBlock>
          </Example>

          <Example title="Monotonic reads problem">
            <CodeBlock>
{`1. User reads from Replica 1 (sees comment)
2. User refreshes, reads from Replica 2 (doesn't see comment - lagging)
3. Time travel!

Solution: Sticky sessions (always read from same replica)`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            Replication improves availability and read performance, but introduces
            <Strong>eventual consistency</Strong> challenges!
          </KeyPoint>

          <Divider />

          <H2>🎯 Critical Trade-Off: Leader-Follower vs Multi-Leader vs Leaderless Replication</H2>

          <ComparisonTable
            headers={['Strategy', 'Write Latency', 'Read Latency', 'Availability', 'Consistency', 'Complexity', 'Best For', 'Worst For']}
            rows={[
              [
                'Leader-Follower\n(Primary-Replica)',
                'Medium\n10-50ms',
                'Low\n5-10ms',
                'Medium\n(failover needed)',
                'Eventual\n(replication lag)',
                'Low',
                '• Read-heavy apps\n• Simple architecture\n• Most use cases',
                '• Global writes\n• Zero downtime writes\n• Multi-datacenter active-active'
              ],
              [
                'Multi-Leader\n(Active-Active)',
                'Low\n5-20ms\n(write to nearest)',
                'Low\n5-10ms',
                'Very High\n(no single point)',
                'Conflicts!\n(need resolution)',
                'Very High',
                '• Global apps\n• Multi-datacenter\n• Offline-first apps',
                '• Simple apps\n• Strong consistency needs\n• Small teams'
              ],
              [
                'Leaderless\n(Quorum)',
                'Medium\n20-100ms\n(quorum wait)',
                'Medium\n20-100ms\n(quorum read)',
                'Very High\n(no leader)',
                'Tunable\n(R+W>N)',
                'High',
                '• High availability\n• No single point\n• Read-heavy OR write-heavy',
                '• Low latency needs\n• Simple architecture\n• Small teams'
              ],
            ]}
          />

          <Example title="Real Decision: Global E-commerce Platform">
            <P><Strong>Scenario:</Strong> Users in US, EU, Asia. Need low-latency reads + writes globally.</P>

            <P><Strong>Option 1: Leader-Follower (wrong for global writes)</Strong></P>
            <CodeBlock>
{`Setup:
- Primary: US-West
- Replica 1: EU
- Replica 2: Asia

Write flow from Asia:
1. User in Tokyo writes → Routes to US-West primary
2. Cross-continent latency: 150ms
3. Replication to Asia replica: +100ms = 250ms total

User experience:
- US users: 10ms write latency ✅
- EU users: 80ms write latency (acceptable)
- Asia users: 250ms write latency ❌ (feels slow!)

Problem: Single primary in US = high latency for global writes

Result: ❌ Leader-follower is WRONG for global, write-heavy apps`}
            </CodeBlock>

            <P><Strong>Option 2: Multi-Leader (Correct for this scenario)</Strong></P>
            <CodeBlock>
{`Setup:
- Primary US: Handles US writes
- Primary EU: Handles EU writes
- Primary Asia: Handles Asia writes
- All sync with each other

Write flow from Asia:
1. User in Tokyo writes → Routes to Asia primary
2. Local write: 10ms ✅
3. Async replication to US + EU: background

User experience:
- US users: 10ms write latency ✅
- EU users: 10ms write latency ✅
- Asia users: 10ms write latency ✅

Conflict resolution example:
- User A (US) updates product price to $100
- User B (EU) updates same product price to $105
- Conflict! Both writes accepted locally
- Resolution strategy:
  → Last-write-wins (use timestamp)
  → OR: Business logic (highest price wins for customer protection)
  → OR: Merge (average: $102.50)

Cost:
- 3 primary databases: $3,000/mo vs $1,000/mo for leader-follower
- Conflict resolution logic: +2 weeks dev time

Result: ✅ Multi-leader is RIGHT for global, low-latency writes

Trade-off: 3x cost + conflict resolution complexity vs 25x faster writes globally`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> Multi-leader costs 3x more + adds conflict resolution complexity
              but provides 25x faster writes for global users. Worth it for global e-commerce.
            </KeyPoint>
          </Example>

          <Example title="Real Decision: Social Media Feed (Read-Heavy)">
            <P><Strong>Scenario:</Strong> 100M users, 10k writes/sec, 1M reads/sec (100:1 read/write ratio)</P>

            <P><Strong>Option 1: Leaderless Quorum (over-engineering)</Strong></P>
            <CodeBlock>
{`Setup:
- 5 nodes, W=3, R=3 (quorum: R+W>N for consistency)

Write flow:
1. Write to 3 out of 5 nodes (wait for all 3)
2. Latency: 50ms (wait for slowest node)
3. 10k writes/sec × 50ms = high load

Read flow:
1. Read from 3 out of 5 nodes (wait for all 3)
2. Latency: 50ms (wait for slowest node)
3. 1M reads/sec × 50ms = VERY high load
4. Must compare values from 3 nodes (extra CPU)

Cost:
- 5 nodes: $2,500/mo
- Higher latency: 50ms reads (vs 5ms with leader-follower)
- Complex: Quorum logic, version vectors, conflict resolution

Result: ❌ Leaderless is WRONG for read-heavy, latency-sensitive apps`}
            </CodeBlock>

            <P><Strong>Option 2: Leader-Follower (Correct Choice)</Strong></P>
            <CodeBlock>
{`Setup:
- 1 Primary (handles all 10k writes/sec)
- 10 Replicas (each handles 100k reads/sec)

Write flow:
1. Write to primary: 10ms
2. Async replication to 10 replicas: background
3. 10k writes/sec on 1 node (easy)

Read flow:
1. Read from any of 10 replicas: 5ms
2. 1M reads/sec ÷ 10 replicas = 100k reads/sec per replica (easy)
3. No quorum needed (simple)

Cost:
- 1 primary + 10 replicas: $1,500/mo (vs $2,500/mo for leaderless)
- Lower latency: 5ms reads (vs 50ms)
- Simple: Standard replication, mature tooling

Result: ✅ Leader-follower is RIGHT for read-heavy apps

Trade-off: Replication lag (eventual consistency) vs 10x faster reads + 40% cheaper

Business decision:
- Seeing friend's post 100ms late = acceptable
- 5ms vs 50ms latency = better UX
- $1,500/mo vs $2,500/mo = save $12k/year`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> Leader-follower is 10x faster for reads + 40% cheaper than leaderless
              for read-heavy apps. Accept eventual consistency for massive performance gain.
            </KeyPoint>
          </Example>

          <H3>Decision Framework: Choosing Replication Strategy</H3>
          <CodeBlock>
{`Do you need global low-latency writes? (users worldwide writing frequently)

├─ YES → Multi-Leader
│   └─ Examples: Global e-commerce, collaborative editing, CRDTs
│   └─ Accept: Conflict resolution, 3x cost, high complexity
│   └─ Benefit: Low write latency globally (10-20ms anywhere)
│
└─ NO → What's your read/write ratio?
    │
    ├─ Read-heavy (>10:1 read:write) → Leader-Follower
    │   └─ Examples: Social media, blogs, content sites (90% of apps)
    │   └─ Accept: Replication lag (eventual consistency)
    │   └─ Benefit: Simple, cheap, fast reads, mature tooling
    │   └─ Cost: $1,500/mo for 1 primary + 10 replicas
    │
    └─ Write-heavy OR need high availability → Leaderless Quorum
        │
        ├─ Need tunable consistency → Leaderless (Cassandra, DynamoDB)
        │   └─ Examples: Time-series data, IoT, high availability critical
        │   └─ Accept: Higher latency (quorum reads/writes), complexity
        │   └─ Benefit: No single point of failure, tunable consistency
        │   └─ Cost: $2,500/mo for 5-node cluster
        │
        └─ Simple use case → Leader-Follower (good enough for 90% of apps)
            └─ Don't over-engineer! Leader-follower handles billions of users (Instagram, Twitter)`}
          </CodeBlock>

          <H3>Common Mistakes</H3>
          <UL>
            <LI>
              <Strong>❌ Using multi-leader for non-global apps</Strong>
              <UL>
                <LI>Problem: Conflict resolution complexity for no benefit (users in one region)</LI>
                <LI>Fix: Leader-follower is simpler and faster for single-region apps</LI>
              </UL>
            </LI>
            <LI>
              <Strong>❌ Using leaderless for read-heavy apps</Strong>
              <UL>
                <LI>Problem: Quorum reads are 10x slower (50ms vs 5ms)</LI>
                <LI>Fix: Leader-follower with read replicas is faster + cheaper</LI>
              </UL>
            </LI>
            <LI>
              <Strong>❌ Not implementing read-your-writes consistency</Strong>
              <UL>
                <LI>Problem: User posts comment → Refreshes → Doesn't see own comment (replication lag)</LI>
                <LI>Fix: Route user's own reads to primary (sticky sessions)</LI>
              </UL>
            </LI>
          </UL>
        </Section>
      ),
    },
  ],
};

