import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter6PartitioningLesson: SystemDesignLesson = {
  id: 'ddia-ch6-partitioning',
  slug: 'ddia-ch6-partitioning',
  title: 'Partitioning (Sharding) (DDIA Ch. 6)',
  description: 'Learn how to partition data across multiple nodes: hash partitioning, range partitioning, and consistent hashing.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 70,
  stages: [
    {
      id: 'intro-partitioning',
      type: 'concept',
      title: 'Why Partitioning?',
      content: (
        <Section>
          <H1>Why Partitioning?</H1>
          <P>
            <Strong>Partitioning</Strong> (also called <Strong>sharding</Strong>) splits data across multiple nodes.
            Each partition is independent, allowing horizontal scaling.
          </P>
          <UL>
            <LI><Strong>Scalability:</Strong> Data too large for single node - split across many nodes</LI>
            <LI><Strong>Performance:</Strong> Queries only hit relevant partitions (smaller dataset)</LI>
            <LI><Strong>Parallelism:</Strong> Multiple partitions can be queried in parallel</LI>
          </UL>
        </Section>
      ),
    },
    {
      id: 'partitioning-strategies',
      type: 'concept',
      title: 'Partitioning Strategies',
      content: (
        <Section>
          <H1>Partitioning Strategies</H1>
          <P>
            How to decide which partition a record belongs to:
          </P>

          <H2>Hash Partitioning</H2>
          <UL>
            <LI>Hash the partition key (e.g., user_id)</LI>
            <LI>Modulo by number of partitions</LI>
            <LI>Even distribution, but can't do range queries</LI>
          </UL>

          <Example title="Hash Partitioning">
            <CodeBlock>
{`// Partition key: user_id
hash(user_id=123) = 789
partition = 789 % 4 = 1

// User 123 goes to partition 1
// Even distribution, but can't query "users 100-200"`}
            </CodeBlock>
          </Example>

          <H2>Range Partitioning</H2>
          <UL>
            <LI>Partition by ranges of partition key</LI>
            <LI>Example: Partition 1: user_id 1-1000, Partition 2: 1001-2000</LI>
            <LI>Supports range queries, but can have hot spots</LI>
          </UL>

          <Example title="Range Partitioning">
            <CodeBlock>
{`// Partition by user_id ranges
Partition 1: user_id 1-1000
Partition 2: user_id 1001-2000
Partition 3: user_id 2001-3000

// Can query: SELECT * WHERE user_id BETWEEN 500 AND 1500
// Hits Partition 1 and 2

// Problem: If all new users get high IDs, Partition 3 becomes hot spot`}
            </CodeBlock>
          </Example>

          <H2>Composite Partitioning</H2>
          <UL>
            <LI>Combine multiple strategies</LI>
            <LI>Example: Partition by (country, user_id) - first by country, then by user_id within country</LI>
          </UL>

          <ComparisonTable
            headers={['Strategy', 'Distribution', 'Range Queries', 'Hot Spots']}
            rows={[
              ['Hash', 'Even', 'No', 'Rare'],
              ['Range', 'May be uneven', 'Yes', 'Common'],
              ['Composite', 'Configurable', 'Partial', 'Configurable'],
            ]}
          />
        </Section>
      ),
    },
    {
      id: 'consistent-hashing',
      type: 'concept',
      title: 'Consistent Hashing',
      content: (
        <Section>
          <H1>Consistent Hashing</H1>
          <P>
            <Strong>Consistent hashing</Strong> minimizes data movement when nodes are added or removed.
            Used by DynamoDB, Cassandra, Riak.
          </P>

          <H2>How It Works</H2>
          <OL>
            <LI>Hash nodes and keys to a ring (0 to 2^64-1)</LI>
            <LI>Each key belongs to first node clockwise from its hash</LI>
            <LI>When node added/removed, only adjacent keys move</LI>
          </OL>

          <Example title="Consistent Hashing">
            <CodeBlock>
{`// Hash ring (simplified)
Node A: hash=100
Node B: hash=200
Node C: hash=300

// Key "user123" hashes to 150
// Belongs to Node B (first node >= 150)

// Add Node D at hash=250
// Only keys between 200-250 move from B to D
// Keys 150-200 stay on B (minimal movement!)`}
            </CodeBlock>
          </Example>

          <H2>Virtual Nodes</H2>
          <P>
            To ensure even distribution, each physical node has multiple <Strong>virtual nodes</Strong>
            on the ring. This prevents hot spots.
          </P>

          <KeyPoint>
            <Strong>Use When:</Strong> Need to add/remove nodes frequently, want minimal data movement.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'secondary-indexes',
      type: 'concept',
      title: 'Secondary Indexes & Partitioning',
      content: (
        <Section>
          <H1>Secondary Indexes & Partitioning</H1>
          <P>
            <Strong>Secondary indexes</Strong> allow querying by non-partition key. Two approaches:
          </P>

          <H2>Local Secondary Index</H2>
          <UL>
            <LI>Index stored in same partition as data</LI>
            <LI>Query must specify partition key</LI>
            <LI>Example: Partition by user_id, index on (user_id, created_at)</LI>
          </UL>

          <H2>Global Secondary Index</H2>
          <UL>
            <LI>Index partitioned separately from data</LI>
            <LI>Can query without partition key</LI>
            <LI>Requires scatter-gather (query all partitions)</LI>
            <LI>Example: Partition by user_id, global index on email</LI>
          </UL>

          <Example title="Querying with Secondary Index">
            <CodeBlock>
{`// Data partitioned by user_id
// Global index on email

// Query: Find user by email
SELECT * WHERE email='alice@example.com'

// With global index:
// 1. Query index (partitioned by email hash)
// 2. Get user_id
// 3. Query data partition (partitioned by user_id)
// Two lookups, but works!

// With local index (if existed):
// Would need to know user_id first (can't query by email)`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Trade-off:</Strong> Global indexes enable flexible queries but add complexity and write overhead.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'rebalancing',
      type: 'concept',
      title: 'Rebalancing Partitions',
      content: (
        <Section>
          <H1>Rebalancing Partitions</H1>
          <P>
            When nodes are added or removed, partitions must be <Strong>rebalanced</Strong> to maintain
            even distribution.
          </P>

          <H2>Rebalancing Strategies</H2>
          <UL>
            <LI><Strong>Fixed Partitions:</Strong> Pre-allocate many partitions, assign to nodes (Kafka)</LI>
            <LI><Strong>Dynamic Partitioning:</Strong> Split partitions when they grow too large (HBase)</LI>
            <LI><Strong>Proportional Partitioning:</Strong> Each node has same number of partitions (Cassandra)</LI>
          </UL>

          <H2>Rebalancing Process</H2>
          <OL>
            <LI>Identify partitions to move</LI>
            <LI>Copy data to new node</LI>
            <LI>Update routing table</LI>
            <LI>Stop accepting writes to old partition</LI>
            <LI>Drain remaining reads, then delete old partition</LI>
          </OL>

          <KeyPoint>
            <Strong>Best Practice:</Strong> Use consistent hashing or fixed partitions to minimize rebalancing overhead.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

