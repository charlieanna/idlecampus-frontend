import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider 
} from '../../../ui/components/LessonContent';

export const storageFundamentalsLesson: SystemDesignLesson = {
  id: 'storage-fundamentals',
  slug: 'storage-fundamentals',
  title: 'Storage Fundamentals',
  description: 'Learn the core concepts of data storage systems',
  category: 'patterns',
  difficulty: 'intermediate',
  estimatedMinutes: 25,
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
        </Section>
      ),
    },
  ],
};

