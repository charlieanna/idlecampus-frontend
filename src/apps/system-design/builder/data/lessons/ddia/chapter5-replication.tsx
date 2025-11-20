import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter5ReplicationLesson: SystemDesignLesson = {
  id: 'ddia-ch5-replication',
  slug: 'ddia-ch5-replication',
  title: 'Replication (DDIA Ch. 5)',
  description: 'Master replication trade-offs: WHEN to use async vs sync vs semi-sync replication, HOW single-leader vs multi-leader affects availability (99.9% vs 99.99%), WHICH replication strategy fits your consistency and latency needs.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 90,
  stages: [
    {
      id: 'intro-replication',
      type: 'concept',
      title: 'Why Replication?',
      content: (
        <Section>
          <H1>Why Replication?</H1>
          <P>
            <Strong>Replication</Strong> means keeping copies of the same data on multiple nodes.
            Benefits:
          </P>
          <UL>
            <LI><Strong>High Availability:</Strong> System continues operating if nodes fail</LI>
            <LI><Strong>Scalability:</Strong> Distribute read load across replicas</LI>
            <LI><Strong>Low Latency:</Strong> Keep data close to users (geographic distribution)</LI>
          </UL>
        </Section>
      ),
    },
    {
      id: 'single-leader',
      type: 'concept',
      title: 'Single-Leader Replication (Primary-Secondary)',
      content: (
        <Section>
          <H1>Single-Leader Replication (Primary-Secondary)</H1>
          <P>
            One node is the <Strong>leader</Strong> (primary) - handles all writes. Other nodes are
            <Strong>followers</Strong> (secondaries) - replicate data from leader.
          </P>

          <H2>How It Works</H2>
          <OL>
            <LI>Client writes to leader</LI>
            <LI>Leader writes to local storage</LI>
            <LI>Leader sends change to followers (replication log)</LI>
            <LI>Followers apply changes in same order</LI>
          </OL>

          <H2>Sync vs. Async Replication</H2>
          <UL>
            <LI><Strong>Synchronous:</Strong> Leader waits for follower acknowledgment (strong consistency, slower)</LI>
            <LI><Strong>Asynchronous:</Strong> Leader doesn't wait (faster, but risk of data loss if leader fails)</LI>
          </UL>

          <Example title="Single-Leader Replication">
            <CodeBlock>
{`// Write flow
Client -> Leader: INSERT INTO users (name) VALUES ('Alice')
Leader: Write to local DB
Leader -> Follower1: Replicate change
Leader -> Follower2: Replicate change
Leader -> Client: Success

// Read flow
Client -> Follower1: SELECT * FROM users
Follower1 -> Client: Return data (read from replica)`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Use When:</Strong> Need strong consistency, simple to understand, most common pattern.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'replication-lag',
      type: 'concept',
      title: 'Replication Lag & Consistency',
      content: (
        <Section>
          <H1>Replication Lag & Consistency</H1>
          <P>
            With <Strong>asynchronous replication</Strong>, followers may lag behind the leader.
            This creates <Strong>eventual consistency</Strong> - reads may see stale data.
          </P>

          <H2>Problems from Replication Lag</H2>
          <UL>
            <LI><Strong>Read-After-Write:</Strong> User writes, then reads from follower - may not see their write</LI>
            <LI><Strong>Monotonic Reads:</Strong> User sees newer data, then older data (time going backward)</LI>
            <LI><Strong>Consistent Prefix Reads:</Strong> User sees updates in wrong order</LI>
          </UL>

          <H2>Solutions</H2>
          <UL>
            <LI><Strong>Read from Leader:</Strong> For critical reads, read from leader (read-after-write consistency)</LI>
            <LI><Strong>Track Replication Lag:</Strong> Only read from followers that are caught up</LI>
            <LI><Strong>Accept Staleness:</Strong> For non-critical reads, accept slightly stale data</LI>
          </UL>

          <Example title="Read-After-Write Consistency">
            <CodeBlock>
{`// Problem: User writes, then reads from follower
User -> Leader: UPDATE profile SET name='Alice'
Leader: Committed, replicating...
User -> Follower: SELECT name FROM profile
Follower: Returns old name (not replicated yet!)

// Solution: Read from leader for user's own data
if (isUserOwnData(userId, data)) {
  readFromLeader();
} else {
  readFromFollower();  // OK for other users' data
}`}
            </CodeBlock>
          </Example>
        </Section>
      ),
    },
    {
      id: 'multi-leader',
      type: 'concept',
      title: 'Multi-Leader Replication',
      content: (
        <Section>
          <H1>Multi-Leader Replication</H1>
          <P>
            Multiple nodes can accept writes. Each node is a leader in its region, replicating to other regions.
          </P>

          <H2>Use Cases</H2>
          <UL>
            <LI><Strong>Multi-Datacenter:</Strong> Each datacenter has its own leader (lower latency)</LI>
            <LI><Strong>Offline-First:</Strong> Mobile apps can write locally, sync when online</LI>
            <LI><Strong>Collaborative Editing:</Strong> Multiple users editing same document</LI>
          </UL>

          <H2>Challenges</H2>
          <UL>
            <LI><Strong>Write Conflicts:</Strong> Same data written to different leaders simultaneously</LI>
            <LI><Strong>Conflict Resolution:</Strong> Need strategy to resolve conflicts (last-write-wins, merge, custom logic)</LI>
            <LI><Strong>Complexity:</Strong> More complex than single-leader</LI>
          </UL>

          <KeyPoint>
            <Strong>Use When:</Strong> Need writes in multiple regions, can tolerate eventual consistency and conflict resolution.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'leaderless',
      type: 'concept',
      title: 'Leaderless Replication (Dynamo-Style)',
      content: (
        <Section>
          <H1>Leaderless Replication (Dynamo-Style)</H1>
          <P>
            No leader. Any node can accept writes. Uses <Strong>quorum</Strong> for consistency.
          </P>

          <H2>Quorum Reads & Writes</H2>
          <UL>
            <LI><Strong>Replication Factor:</Strong> Data replicated to N nodes</LI>
            <LI><Strong>Write Quorum:</Strong> Write to W nodes (W &lt; N)</LI>
            <LI><Strong>Read Quorum:</Strong> Read from R nodes (R &lt; N)</LI>
            <LI><Strong>Consistency:</Strong> If W + R &gt; N, reads see latest writes</LI>
          </UL>

          <Example title="Quorum Example (N=3, W=2, R=2)">
            <CodeBlock>
{`// Write: Write to 2 of 3 nodes
Client -> Node1: Write x=1
Client -> Node2: Write x=1
// Node3 not updated yet

// Read: Read from 2 of 3 nodes
Client -> Node1: Read x (returns 1)
Client -> Node2: Read x (returns 1)
// Majority says x=1, return 1

// If Node1 fails, still have Node2 and Node3
// W + R = 2 + 2 = 4 > 3 (N), so consistent`}
            </CodeBlock>
          </Example>

          <H2>Handling Failures</H2>
          <UL>
            <LI><Strong>Hinted Handoff:</Strong> If node down, write to another node temporarily</LI>
            <LI><Strong>Read Repair:</Strong> When reading, if nodes disagree, write correct value to outdated node</LI>
            <LI><Strong>Anti-Entropy:</Strong> Background process to sync data between nodes</LI>
          </UL>

          <KeyPoint>
            <Strong>Used By:</Strong> DynamoDB, Cassandra, Riak. Good for high availability, eventual consistency.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'async-vs-sync-replication-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Async vs Sync vs Semi-Sync Replication',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Async vs Sync vs Semi-Sync Replication</H1>
          <P>
            Replication mode determines the <Strong>consistency, latency, and availability</Strong> of your system.
            This decision affects write performance (2× slower with sync) and data loss risk (minutes of data with async).
          </P>

          <Divider />

          <H2>📊 Replication Mode Comparison</H2>
          <ComparisonTable
            headers={['Metric', 'Asynchronous', 'Semi-Synchronous', 'Synchronous']}
            rows={[
              ['Write Latency', '5ms (baseline)', '10ms (2× slower)', '20ms (4× slower)'],
              ['Throughput (QPS)', '50k writes/sec', '30k writes/sec (40% lower)', '15k writes/sec (70% lower)'],
              ['Data Loss Risk', '⚠️ Up to minutes', '⚠️ Seconds (1 replica)', '✅ Zero (all replicas ack)'],
              ['Consistency', '❌ Eventual (lag)', '⚠️ Strong for 1 replica', '✅ Strong (all replicas)'],
              ['Availability', '✅ High (leader only)', '✅ High (1 replica fails OK)', '❌ Lower (all replicas must be up)'],
              ['Failover Data Loss', '⚠️ Possible (uncommitted)', '✅ None (1 replica has data)', '✅ None'],
              ['Network Partition', '✅ Writes continue', '⚠️ Writes continue (degraded)', '❌ Writes block if partitioned'],
              ['Use Case', 'Analytics, logs, caching', 'Transactional apps (MySQL default)', 'Financial systems, critical data'],
              ['CAP Theorem', 'AP (available + partition)', 'CP/AP hybrid', 'CP (consistent + partition)'],
            ]}
          />

          <Divider />

          <H2>💡 Real-World Example: E-Commerce Order System</H2>
          <P>
            <Strong>Scenario:</Strong> E-commerce platform processing 10k orders/min. Need to decide replication strategy
            for order database (PostgreSQL with 3 replicas across 3 availability zones).
          </P>

          <H3>Async Replication (Fastest, Risk of Data Loss)</H3>
          <CodeBlock>
{`// PostgreSQL Async Replication Configuration
# postgresql.conf (Primary)
synchronous_commit = off  # Don't wait for replicas
max_wal_senders = 3
wal_keep_size = 1GB

// Application Code
async function createOrder(order) {
  const result = await db.query(\`
    INSERT INTO orders (user_id, items, total)
    VALUES ($1, $2, $3)
    RETURNING order_id
  \`, [order.userId, order.items, order.total]);

  // Returns immediately after primary commit (5ms)
  // Replicas receive changes asynchronously
  return result.rows[0].order_id;
}

// Performance:
// - Write latency: 5ms (p99)
// - Throughput: 50k writes/sec
// - Replication lag: 100-500ms (typical)

// Risk Scenario:
// 1. Primary commits order #12345 (5ms)
// 2. Client receives success
// 3. Primary crashes BEFORE replicating to followers
// 4. Failover to replica → Order #12345 LOST
// 5. Customer charged but no order record!

// Data Loss Window: 100-500ms of orders (8-40 orders lost at 10k/min)
// Business Impact: Customer complaints, manual reconciliation
// Estimated Cost: $500/incident × 10 incidents/year = $5,000/year`}
          </CodeBlock>

          <H3>Semi-Sync Replication (Balanced, Zero Data Loss)</H3>
          <CodeBlock>
{`// PostgreSQL Semi-Sync Replication Configuration
# postgresql.conf (Primary)
synchronous_commit = on  # Wait for at least 1 replica
synchronous_standby_names = 'FIRST 1 (replica1, replica2)'
# Waits for 1 of 2 replicas to acknowledge

// Application Code
async function createOrder(order) {
  const result = await db.query(\`
    INSERT INTO orders (user_id, items, total)
    VALUES ($1, $2, $3)
    RETURNING order_id
  \`, [order.userId, order.items, order.total]);

  // Returns after primary + 1 replica commit (10ms)
  // Guarantees data on 2 nodes before success
  return result.rows[0].order_id;
}

// Performance:
// - Write latency: 10ms (p99) - 2× slower than async
// - Throughput: 30k writes/sec - 40% lower than async
// - Replication lag: 0ms for 1 replica, 100ms for others

// Failover Scenario:
// 1. Primary commits order #12345 (5ms)
// 2. Waits for replica1 to commit (5ms network + commit)
// 3. Both primary and replica1 have order
// 4. Client receives success (10ms total)
// 5. Primary crashes → Failover to replica1 → Order preserved!

// Data Loss: ZERO (at least 1 replica always has committed data)
// Business Impact: No lost orders, clean failover
// Trade-off: 2× slower writes (acceptable for transactional workloads)`}
          </CodeBlock>

          <H3>Fully Sync Replication (Safest, Slowest)</H3>
          <CodeBlock>
{`// PostgreSQL Fully Synchronous Replication
# postgresql.conf (Primary)
synchronous_commit = on
synchronous_standby_names = 'ALL (replica1, replica2)'  # Wait for ALL replicas

// Application Code (same as semi-sync)
async function createOrder(order) {
  const result = await db.query(\`
    INSERT INTO orders (user_id, items, total)
    VALUES ($1, $2, $3)
    RETURNING order_id
  \`, [order.userId, order.items, order.total]);

  // Returns after ALL replicas commit (20ms)
  return result.rows[0].order_id;
}

// Performance:
// - Write latency: 20ms (p99) - 4× slower than async
// - Throughput: 15k writes/sec - 70% lower than async
// - Replication lag: 0ms for all replicas

// Extreme Consistency:
// - All 3 replicas have order before client sees success
// - Can failover to ANY replica without data loss
// - If ANY replica unavailable → writes BLOCK

// Availability Risk:
// 1. Replica2 in AZ-C has network partition
// 2. Primary cannot reach replica2
// 3. Writes BLOCK waiting for replica2 acknowledgment
// 4. System UNAVAILABLE until replica2 returns or config changed

// Use Case: Financial transactions, regulatory compliance
// Not recommended for most systems (availability risk too high)`}
          </CodeBlock>

          <Divider />

          <H2>🎯 Decision Framework</H2>
          <CodeBlock>
{`function chooseReplicationMode(requirements) {
  // 1. Financial/Critical Data → Semi-Sync or Sync
  if (requirements.zeroDataloss && requirements.regulatory) {
    if (requirements.highAvailability) {
      return 'Semi-Sync';  // Balance: zero data loss + high availability
    } else {
      return 'Sync';  // Maximum safety, accept availability risk
    }
  }

  // 2. High Throughput + Acceptable Data Loss → Async
  if (requirements.highThroughput && !requirements.zeroDataloss) {
    // Examples: analytics, logs, caching, social media feeds
    return 'Async';  // 3-5× faster writes
  }

  // 3. E-Commerce, SaaS, Transactional Apps → Semi-Sync
  if (requirements.transactional && requirements.userFacing) {
    return 'Semi-Sync';  // Industry standard (MySQL default)
  }

  // 4. Multi-Region (cross-continent) → Async
  if (requirements.multiRegion && requirements.crossContinent) {
    // 100ms+ cross-region latency makes sync impractical
    return 'Async';  // Use multi-leader or conflict-free replicated data types (CRDTs)
  }

  // 5. Read-Heavy Workloads → Async
  if (requirements.readHeavy && requirements.writes < 1000/sec) {
    return 'Async';  // Low write volume, prioritize read scalability
  }

  // Default: Semi-Sync (best balance for most systems)
  return 'Semi-Sync';
}

// Example Usage:
const mode = chooseReplicationMode({
  transactional: true,
  userFacing: true,
  highAvailability: true,
  zeroDataloss: true
});
// → Returns 'Semi-Sync'`}
          </CodeBlock>

          <Divider />

          <H2>⚠️ Common Mistakes & Fixes</H2>

          <H3>❌ Mistake 1: Using Async for Financial Transactions</H3>
          <CodeBlock>
{`// BAD: Async replication for payment processing
// Problem: Payment committed, but lost during failover
async function processPayment(payment) {
  await db.query('INSERT INTO payments VALUES (...)', { sync: false });
  await stripe.charge(payment.amount);  // Money taken from customer
  // Primary crashes → payment record lost!
  // Customer charged but no record in database
}

// GOOD: Semi-sync for payment processing
async function processPayment(payment) {
  // Use transaction with synchronous commit
  await db.query('BEGIN');
  await db.query('SET LOCAL synchronous_commit = on');  // Force sync for this transaction
  await db.query('INSERT INTO payments VALUES (...)');

  try {
    await stripe.charge(payment.amount);
    await db.query('COMMIT');  // Waits for replica acknowledgment
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
}

// Result: Payment record on 2+ nodes before Stripe charge
// No lost payments during failover`}
          </CodeBlock>

          <H3>❌ Mistake 2: Using Fully Sync in Multi-AZ Setup (Availability Risk)</H3>
          <CodeBlock>
{`// BAD: Fully synchronous with replicas in 3 AZs
synchronous_standby_names = 'ALL (az-a-replica, az-b-replica, az-c-replica)'

// Problem: AZ-C network partition → writes BLOCKED
// 1. Network partition in AZ-C (1% of time, ~3.6 days/year)
// 2. Primary cannot reach az-c-replica
// 3. Writes wait indefinitely for az-c-replica
// 4. System UNAVAILABLE for writes
// Availability: 99% (downtime: 3.6 days/year) ❌

// GOOD: Semi-sync with FIRST 1 or ANY 1
synchronous_standby_names = 'FIRST 1 (az-a-replica, az-b-replica, az-c-replica)'
# Waits for FIRST 1 replica to acknowledge (not all)

// Behavior: AZ-C network partition → writes continue
// 1. Primary tries az-a-replica first
// 2. If az-a-replica responds → write succeeds (no delay)
// 3. az-c-replica catches up when network recovers
// Availability: 99.95% (downtime: ~4 hours/year) ✅

// Result: Zero data loss + high availability`}
          </CodeBlock>

          <H3>❌ Mistake 3: Not Monitoring Replication Lag</H3>
          <CodeBlock>
{`// BAD: Async replication without lag monitoring
// Problem: Lag grows to hours without detection
const replica = await getReadReplica();  // Random replica
const data = await replica.query('SELECT * FROM orders WHERE user_id = ?');
// Replica may be hours behind!

// GOOD: Monitor lag and route reads appropriately
async function getReadReplica(maxLagSeconds = 5) {
  const replicas = await getAllReplicas();

  // Check replication lag for each replica
  const healthyReplicas = replicas.filter(replica => {
    const lag = replica.replicationLag;  // From pg_stat_replication
    return lag < maxLagSeconds;
  });

  if (healthyReplicas.length === 0) {
    // All replicas lagging → read from primary
    console.warn('All replicas lagging, reading from primary');
    return getPrimary();
  }

  // Round-robin among healthy replicas
  return healthyReplicas[Math.floor(Math.random() * healthyReplicas.length)];
}

// Monitoring Alert
if (replicationLag > 10) {
  alert('Replication lag exceeds 10 seconds!');
  // Investigate: network issues, replica overloaded, large transaction
}`}
          </CodeBlock>

          <H3>❌ Mistake 4: Mixing Critical and Non-Critical Data on Same Replication Mode</H3>
          <CodeBlock>
{`// BAD: Same async replication for orders and analytics
// Problem: Orders require zero data loss, but using async for everything
await db.query('INSERT INTO orders VALUES (...)');  // Critical!
await db.query('INSERT INTO page_views VALUES (...)');  // Not critical

// GOOD: Per-transaction synchronous commit control
// Critical transaction: Semi-sync
await db.query('BEGIN');
await db.query('SET LOCAL synchronous_commit = on');
await db.query('INSERT INTO orders VALUES (...)');
await db.query('COMMIT');  // Waits for replica (10ms)

// Non-critical transaction: Async
await db.query('BEGIN');
await db.query('SET LOCAL synchronous_commit = off');
await db.query('INSERT INTO page_views VALUES (...)');
await db.query('COMMIT');  // Returns immediately (2ms)

// Alternative: Separate databases
const ordersDB = new PostgreSQL({ synchronous_commit: 'on' });  // Semi-sync
const analyticsDB = new PostgreSQL({ synchronous_commit: 'off' });  // Async

// Result: Fast analytics writes + safe order writes`}
          </CodeBlock>

          <Divider />

          <H2>💰 ROI Analysis: Async vs Semi-Sync for E-Commerce</H2>
          <InfoBox>
            <H3>E-Commerce Platform (10k Orders/Minute)</H3>
            <UL>
              <LI><Strong>Order Volume:</Strong> 10k orders/min = 14.4M orders/day</LI>
              <LI><Strong>Average Order Value:</Strong> $50</LI>
              <LI><Strong>Daily GMV:</Strong> $720M/day</LI>
            </UL>

            <H3>Async Replication (Faster, Data Loss Risk)</H3>
            <UL>
              <LI><Strong>Write Latency:</Strong> 5ms (p99)</LI>
              <LI><Strong>Throughput:</Strong> 50k writes/sec</LI>
              <LI><Strong>Infrastructure Cost:</Strong> 3 replicas × $500/mo = $1,500/mo</LI>
              <LI><Strong>Replication Lag:</Strong> 200ms average</LI>
              <LI><Strong>Failover Data Loss:</Strong> ~33 orders (200ms × 10k/min ÷ 60)</LI>
              <LI><Strong>Failover Frequency:</Strong> 2 times/year (hardware failure, AZ outage)</LI>
              <LI><Strong>Lost Orders per Year:</Strong> 66 orders × $50 = <Strong>$3,300 revenue loss</Strong></LI>
              <LI><Strong>Customer Support:</Strong> 66 incidents × $50/hour × 2 hours = <Strong>$6,600/year</Strong></LI>
              <LI><Strong>Total Annual Cost:</Strong> $18,000 (infra) + $3,300 (revenue) + $6,600 (support) = <Strong>$27,900/year</Strong></LI>
            </UL>

            <H3>Semi-Sync Replication (Balanced, Zero Data Loss)</H3>
            <UL>
              <LI><Strong>Write Latency:</Strong> 10ms (p99) - 2× slower</LI>
              <LI><Strong>Throughput:</Strong> 30k writes/sec (still exceeds 10k orders/min)</LI>
              <LI><Strong>Infrastructure Cost:</Strong> 3 replicas × $600/mo = $1,800/mo (20% more CPU due to sync)</LI>
              <LI><Strong>Replication Lag:</Strong> 0ms for 1 replica, 200ms for others</LI>
              <LI><Strong>Failover Data Loss:</Strong> 0 orders (guaranteed on ≥2 nodes)</LI>
              <LI><Strong>Lost Orders per Year:</Strong> 0</LI>
              <LI><Strong>Customer Support:</Strong> $0 (no data loss incidents)</LI>
              <LI><Strong>Total Annual Cost:</Strong> $21,600 (infra only)</LI>
            </UL>

            <H3>Cost Comparison</H3>
            <UL>
              <LI><Strong>Async Annual Cost:</Strong> $27,900</LI>
              <LI><Strong>Semi-Sync Annual Cost:</Strong> $21,600</LI>
              <LI><Strong>Savings with Semi-Sync:</Strong> <Strong>$6,300/year</Strong> (23% cheaper!)</LI>
              <LI><Strong>Latency Trade-off:</Strong> 5ms → 10ms (imperceptible to users)</LI>
            </UL>

            <P>
              <Strong>Conclusion:</Strong> Semi-sync is BOTH faster (zero data loss = lower support costs)
              AND cheaper (avoid revenue loss). For transactional systems, semi-sync is the clear winner.
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>Replication Mode Guidelines:</Strong><br />
            • <Strong>Async:</Strong> Analytics, logs, caching, social feeds (high throughput &gt; consistency)<br />
            • <Strong>Semi-Sync:</Strong> E-commerce, SaaS, transactional apps (99% of systems should use this)<br />
            • <Strong>Fully Sync:</Strong> Financial systems, regulated data (accept availability trade-off for maximum safety)<br /><br />
            <Strong>Golden Rule:</Strong> Default to semi-sync unless you have a specific reason for async.
            The 2× latency penalty (5ms → 10ms) is worth zero data loss.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'single-vs-multi-leader-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Single-Leader vs Multi-Leader vs Leaderless',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Single-Leader vs Multi-Leader vs Leaderless</H1>
          <P>
            Replication topology determines <Strong>write availability, consistency, and operational complexity</Strong>.
            Choosing the wrong topology can cause write unavailability (99.9% vs 99.99%) or unresolvable conflicts.
          </P>

          <Divider />

          <H2>📊 Replication Topology Comparison</H2>
          <ComparisonTable
            headers={['Metric', 'Single-Leader', 'Multi-Leader', 'Leaderless (Dynamo)']}
            rows={[
              ['Write Availability', '99.9% (leader must be up)', '99.99% (any leader works)', '99.99% (quorum-based)'],
              ['Read Availability', '99.99% (any replica)', '99.99% (any replica)', '99.99% (quorum-based)'],
              ['Consistency', '✅ Strong (with sync replication)', '⚠️ Eventual + conflicts', '⚠️ Eventual (tunable quorum)'],
              ['Write Latency (local)', '10ms (leader in same region)', '5ms (write to local leader)', '15ms (write to W nodes)'],
              ['Write Latency (global)', '100ms+ (cross-region to leader)', '5ms (write to nearest leader)', '15ms (write to nearest nodes)'],
              ['Conflict Resolution', '✅ None (single source of truth)', '❌ Complex (app-level logic)', '⚠️ Last-write-wins or app logic'],
              ['Operational Complexity', '🟢 Simple (1 leader)', '🔴 Complex (conflict handling)', '🟡 Medium (quorum tuning)'],
              ['Failover', 'Manual or auto (30-60s)', 'Automatic (writes continue)', 'Automatic (write to other nodes)'],
              ['Use Case', 'Most systems (99% of apps)', 'Multi-region writes, offline apps', 'High availability (DynamoDB, Cassandra)'],
              ['CAP Theorem', 'CP (consistent + partition)', 'AP (available + partition)', 'AP (tunable quorum)'],
            ]}
          />

          <Divider />

          <H2>💡 Real-World Example: Social Media Platform</H2>
          <P>
            <Strong>Scenario:</Strong> Social media platform with 100M users across US, EU, and Asia.
            Need to decide replication topology for user profiles, posts, and likes.
          </P>

          <H3>Single-Leader (Simple, Strong Consistency)</H3>
          <CodeBlock>
{`// Architecture: 1 primary in US-East, 2 replicas (EU, Asia)
// Write flow: All writes go to US-East leader

// User in Asia posts update
async function createPost(userId, content) {
  // Write to US-East leader (150ms cross-region latency)
  const result = await primaryDB.query(\`
    INSERT INTO posts (user_id, content, created_at)
    VALUES ($1, $2, NOW())
    RETURNING post_id
  \`, [userId, content]);

  return result.rows[0].post_id;
}

// Performance:
// - Write latency (Asia → US-East): 150ms (cross-region)
// - Write latency (US): 10ms (local)
// - Read latency (Asia): 5ms (local replica)

// Availability:
// - If US-East leader fails → writes BLOCKED globally
// - Failover to EU replica: 30-60 seconds of downtime
// - Write availability: 99.9% (8.76 hours/year downtime)

// Consistency:
// - Strong consistency (all writes go through single leader)
// - No conflicts (single source of truth)
// - Read-after-write consistency (read from leader)

// Pros:
// ✅ Simple architecture
// ✅ No conflicts
// ✅ Strong consistency

// Cons:
// ❌ High write latency for Asia/EU users (150ms)
// ❌ Single point of failure (leader down = no writes globally)
// ❌ Scalability limit (leader is bottleneck)

// Best For: Systems where consistency > latency (e.g., banking)`}
          </CodeBlock>

          <H3>Multi-Leader (Low Latency, Conflict Resolution Required)</H3>
          <CodeBlock>
{`// Architecture: 3 leaders (US, EU, Asia), each with local replicas
// Write flow: User writes to nearest leader, async replication to other leaders

// User in Asia posts update
async function createPost(userId, content) {
  // Write to Asia leader (5ms local latency)
  const postId = generateUUID();  // Globally unique ID (avoid conflicts)

  await asiaLeader.query(\`
    INSERT INTO posts (post_id, user_id, content, created_at, region)
    VALUES ($1, $2, $3, NOW(), 'asia')
  \`, [postId, userId, content]);

  // Async replication to US and EU leaders (200ms)
  return postId;
}

// Performance:
// - Write latency (Asia): 5ms (local leader)
// - Write latency (US): 5ms (local leader)
// - Read latency: 5ms (local replica)

// Conflict Scenario: Concurrent Edits
// 1. User edits bio in Asia leader: "Software Engineer"
// 2. User edits bio in US leader: "Product Manager" (same time!)
// 3. Both leaders replicate to each other
// 4. CONFLICT: Which bio wins?

// Conflict Resolution Strategy 1: Last-Write-Wins (LWW)
async function resolveConflict(record1, record2) {
  // Use timestamp to determine winner
  if (record1.updated_at > record2.updated_at) {
    return record1;  // Keep newer record
  } else if (record2.updated_at > record1.updated_at) {
    return record2;
  } else {
    // Same timestamp → use region priority (US > EU > Asia)
    return record1.region === 'us' ? record1 : record2;
  }
}

// Conflict Resolution Strategy 2: Application-Level Merge
async function mergeUserUpdates(update1, update2) {
  // Merge field-by-field (CRDTs - Conflict-free Replicated Data Types)
  return {
    bio: update2.bio || update1.bio,  // Prefer newer bio
    followers: Math.max(update1.followers, update2.followers),  // Max followers
    tags: [...new Set([...update1.tags, ...update2.tags])],  // Union of tags
  };
}

// Availability:
// - If Asia leader fails → Asia users write to EU leader (40ms)
// - Writes continue globally (no downtime)
// - Write availability: 99.99% (52 minutes/year downtime)

// Pros:
// ✅ Low write latency (5ms local)
// ✅ High availability (writes continue if 1 leader fails)
// ✅ Scalable (each region handles local writes)

// Cons:
// ❌ Complex conflict resolution
// ❌ Eventual consistency (200ms replication lag between regions)
// ❌ Data integrity risk (conflicts may lose data)

// Best For: Global apps with local writes (e.g., Google Docs, CRMs)`}
          </CodeBlock>

          <H3>Leaderless (High Availability, Tunable Consistency)</H3>
          <CodeBlock>
{`// Architecture: 6 nodes (2 in each region), quorum-based writes
// Write flow: Client writes to W nodes, reads from R nodes (W + R > N)

// DynamoDB Example (N=3, W=2, R=2)
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1',
  consistentRead: false  // Eventual consistency (default)
});

async function createPost(userId, content) {
  const params = {
    TableName: 'Posts',
    Item: {
      post_id: generateUUID(),
      user_id: userId,
      content: content,
      created_at: Date.now(),
      version: 1  // For conflict resolution
    }
  };

  // Write to 2 of 3 replicas (W=2)
  await dynamodb.put(params).promise();
  // Returns after 2 nodes acknowledge (15ms)
}

// Read with Strong Consistency
async function getPost(postId) {
  const params = {
    TableName: 'Posts',
    Key: { post_id: postId },
    ConsistentRead: true  // Read from quorum (R=2)
  };

  const result = await dynamodb.get(params).promise();
  return result.Item;
}

// Quorum Configuration Trade-offs:
// N=3, W=1, R=3: Fast writes, slow reads (eventual consistency)
// N=3, W=2, R=2: Balanced (W + R > N → consistent)
// N=3, W=3, R=1: Slow writes, fast reads (strong consistency)

// Conflict Resolution: Vector Clocks
/*
  Scenario: Concurrent writes to same post
  1. Client A writes version 1: "Hello" (timestamp: T1)
  2. Client B writes version 1: "World" (timestamp: T2, concurrent with A)
  3. Node 1 has: "Hello" [A:1]
  4. Node 2 has: "World" [B:1]
  5. Read from both nodes → detect conflict (divergent versions)
  6. Application merges: "Hello World" [A:1, B:1]
*/

// Availability:
// - If 1 node fails → writes continue (write to 2 remaining nodes)
// - If 2 nodes fail → writes BLOCKED (cannot achieve W=2)
// - Write availability: 99.99% (highly available)

// Consistency:
// - Eventual consistency (default)
// - Strong consistency if W + R > N (at cost of latency)
// - Tunable per-query (ConsistentRead parameter)

// Pros:
// ✅ High availability (no single point of failure)
// ✅ Tunable consistency (balance latency vs consistency)
// ✅ Linear scalability (add more nodes)

// Cons:
// ❌ Eventual consistency (by default)
// ❌ Complex conflict resolution (vector clocks, CRDTs)
// ❌ Higher read/write latency (multiple nodes)

// Best For: High availability systems (IoT, shopping carts, session stores)`}
          </CodeBlock>

          <Divider />

          <H2>🎯 Decision Framework</H2>
          <CodeBlock>
{`function chooseReplicationTopology(requirements) {
  // 1. Global Writes + Low Latency → Multi-Leader
  if (requirements.multiRegionWrites && requirements.lowLatency) {
    if (requirements.canHandleConflicts) {
      return 'Multi-Leader';  // Google Docs, CRMs, collaborative editing
    } else {
      console.warn('Multi-leader requires conflict resolution!');
      return 'Single-Leader';  // Fallback if conflicts not acceptable
    }
  }

  // 2. Strong Consistency Required → Single-Leader
  if (requirements.strongConsistency && !requirements.multiRegionWrites) {
    return 'Single-Leader';  // Banking, e-commerce, most transactional apps
  }

  // 3. Extreme High Availability (99.99%+) → Leaderless
  if (requirements.highAvailability && requirements.eventualConsistency) {
    return 'Leaderless';  // DynamoDB, Cassandra, shopping carts
  }

  // 4. Offline-First Apps → Multi-Leader
  if (requirements.offlineWrites) {
    return 'Multi-Leader';  // Mobile apps, IoT devices
  }

  // 5. Simple System (small team) → Single-Leader
  if (requirements.teamSize < 5 || requirements.simplicity) {
    return 'Single-Leader';  // 99% of startups should start here
  }

  // Default: Single-Leader (safest, simplest)
  return 'Single-Leader';
}

// Example Usage:
const topology = chooseReplicationTopology({
  multiRegionWrites: false,
  strongConsistency: true,
  teamSize: 3
});
// → Returns 'Single-Leader'`}
          </CodeBlock>

          <Divider />

          <H2>⚠️ Common Mistakes & Fixes</H2>

          <H3>❌ Mistake 1: Using Multi-Leader Without Conflict Resolution</H3>
          <CodeBlock>
{`// BAD: Multi-leader without conflict handling
// Problem: Concurrent edits to user profile → data loss
// User edits email in US leader: "alice@newcompany.com"
// User edits email in EU leader: "alice@startup.com" (same time)
// Both replicate → CONFLICT (which email is correct?)

// Without conflict resolution:
// - Last-write-wins based on timestamp (random winner!)
// - User's intended email update may be lost
// - Silent data corruption

// GOOD: Implement application-level conflict resolution
class ConflictResolver {
  static resolveUserProfile(local, remote) {
    // Strategy: Field-level merge with user intent tracking

    const merged = { ...local };

    // Email: Prefer most recent change (with user confirmation)
    if (remote.email_updated_at > local.email_updated_at) {
      merged.email = remote.email;
      merged.email_conflict = true;  // Flag for user review
    }

    // Followers: Use max (monotonic increase)
    merged.followers = Math.max(local.followers, remote.followers);

    // Bio: Merge (keep both, let user resolve)
    if (remote.bio !== local.bio) {
      merged.bio = local.bio;
      merged.bio_conflict = {
        local: local.bio,
        remote: remote.bio,
        requires_user_merge: true  // Show UI for user to choose
      };
    }

    return merged;
  }
}

// Result: No silent data loss, user in control of conflicts`}
          </CodeBlock>

          <H3>❌ Mistake 2: Single-Leader for Global Application</H3>
          <CodeBlock>
{`// BAD: Single leader in US for global app
// Problem: Asia users experience 200ms write latency

// User in Tokyo posts comment (200ms cross-region to US leader)
const startTime = Date.now();
await usLeader.query('INSERT INTO comments VALUES (...)');
console.log(\`Write latency: \${Date.now() - startTime}ms\`);
// Output: Write latency: 210ms (unacceptable UX!)

// GOOD: Multi-leader with regional leaders
// Each region has local leader for low-latency writes

const regionalLeader = getRegionalLeader(user.region);
await regionalLeader.query('INSERT INTO comments VALUES (...)');
// Write latency: 8ms (local)

// Async replication to other regions (200ms, background)
// Users see their own writes immediately (read from local leader)

// Alternative: Single-leader with read replicas
// - Writes: 200ms (to US leader, acceptable for occasional writes)
// - Reads: 5ms (from local replica, 99% of traffic)
// - Good for read-heavy workloads (social media feeds, content sites)`}
          </CodeBlock>

          <H3>❌ Mistake 3: Leaderless with Inappropriate Quorum</H3>
          <CodeBlock>
{`// BAD: N=3, W=1, R=1 (no consistency guarantee!)
// Problem: W + R = 2 < 3 (N) → can read stale data

// Write to 1 node
await dynamodb.put({ Item: { id: 1, value: 'new' } });
// Only Node A has new value
// Node B and C still have old value

// Read from 1 node
const result = await dynamodb.get({ Key: { id: 1 } });
// May read from Node B (returns old value!) → INCONSISTENT

// GOOD: Ensure W + R > N for consistency
// N=3, W=2, R=2 (W + R = 4 > 3)

const dynamodb = new DynamoDB.DocumentClient({
  region: 'us-east-1',
  consistentRead: true  // Forces R=quorum
});

// Write to 2 of 3 nodes
await dynamodb.put({ Item: { id: 1, value: 'new' } });

// Read from 2 of 3 nodes
const result = await dynamodb.get({ Key: { id: 1 }, ConsistentRead: true });
// At least 1 of the 2 read nodes overlaps with 2 write nodes
// Guaranteed to see latest value

// Result: Strong consistency at cost of higher latency`}
          </CodeBlock>

          <H3>❌ Mistake 4: Not Planning for Leader Failover</H3>
          <CodeBlock>
{`// BAD: Manual failover (30-60 minutes downtime)
// Problem: Leader crashes, no automatic promotion

// 1. Leader node crashes
// 2. On-call engineer paged
// 3. Engineer investigates (15 min)
// 4. Engineer promotes replica to leader (10 min)
// 5. Update DNS to point to new leader (15 min)
// 6. Total downtime: 40 minutes

// GOOD: Automatic failover with consensus (Raft, Paxos)
// Use managed services or tools like Patroni (PostgreSQL)

// Patroni Configuration (PostgreSQL HA)
patroni:
  scope: postgres-cluster
  name: node1

  bootstrap:
    dcs:
      ttl: 30  # Leader lease time
      loop_wait: 10
      retry_timeout: 10
      maximum_lag_on_failover: 1048576  # 1MB max lag

  postgresql:
    use_pg_rewind: true  # Fast replica promotion

// Automatic Failover Flow:
// 1. Leader crashes (detected in 10 seconds)
// 2. Patroni initiates election among replicas
// 3. Replica with least lag elected as new leader (5 seconds)
// 4. DNS updated automatically (5 seconds)
// 5. Total downtime: 20 seconds (vs 40 minutes manual)

// Availability improvement:
// - Manual: 99.9% (40 min/month downtime)
// - Automatic: 99.99% (4 min/month downtime)

// Result: 10× better availability with automation`}
          </CodeBlock>

          <Divider />

          <H2>💰 ROI Analysis: Single-Leader vs Multi-Leader for Global SaaS</H2>
          <InfoBox>
            <H3>Global SaaS Platform (Users in US, EU, Asia)</H3>
            <UL>
              <LI><Strong>Users:</Strong> 10M (40% US, 30% EU, 30% Asia)</LI>
              <LI><Strong>Write Operations:</Strong> 5k writes/sec (user profile updates, posts, comments)</LI>
              <LI><Strong>Read Operations:</Strong> 50k reads/sec (10× read-heavy)</LI>
            </UL>

            <H3>Single-Leader (US-East)</H3>
            <UL>
              <LI><Strong>Write Latency (US):</Strong> 10ms (local)</LI>
              <LI><Strong>Write Latency (EU):</Strong> 80ms (cross-Atlantic)</LI>
              <LI><Strong>Write Latency (Asia):</Strong> 200ms (cross-Pacific)</LI>
              <LI><Strong>Avg Write Latency:</Strong> 0.4×10ms + 0.3×80ms + 0.3×200ms = 88ms</LI>
              <LI><Strong>Infrastructure Cost:</Strong> $2,000/mo (leader + 2 read replicas)</LI>
              <LI><Strong>Write Availability:</Strong> 99.9% (8.76 hours/year downtime)</LI>
              <LI><Strong>User Frustration:</Strong> 30% Asia users report "slow app" (200ms writes)</LI>
              <LI><Strong>Churn from Latency:</Strong> 1% Asia users churn = 30k users × $10/mo = <Strong>$3.6M/year lost revenue</Strong></LI>
            </UL>

            <H3>Multi-Leader (US, EU, Asia)</H3>
            <UL>
              <LI><Strong>Write Latency (all regions):</Strong> 10ms (local leader)</LI>
              <LI><Strong>Avg Write Latency:</Strong> 10ms (88% reduction!)</LI>
              <LI><Strong>Infrastructure Cost:</Strong> $6,000/mo (3 leaders + 6 read replicas)</LI>
              <LI><Strong>Write Availability:</Strong> 99.99% (52 min/year downtime)</LI>
              <LI><Strong>Conflict Resolution Cost:</Strong> 2 engineers × 3 months = $150k (one-time)</LI>
              <LI><Strong>Operational Cost:</Strong> $50k/year (conflict monitoring, resolution)</LI>
              <LI><Strong>User Satisfaction:</Strong> No latency complaints (10ms writes globally)</LI>
              <LI><Strong>Churn Reduction:</Strong> 0.5% churn reduction = $1.8M/year retained revenue</LI>
            </UL>

            <H3>Cost-Benefit Analysis</H3>
            <UL>
              <LI><Strong>Additional Infra Cost:</Strong> ($6k - $2k) × 12 = $48k/year</LI>
              <LI><Strong>Development Cost:</Strong> $150k (one-time)</LI>
              <LI><Strong>Operational Cost:</Strong> $50k/year</LI>
              <LI><Strong>Total Year 1 Cost:</Strong> $248k</LI>
              <LI><Strong>Revenue Benefit:</Strong> $1.8M/year (reduced churn)</LI>
              <LI><Strong>Net Benefit Year 1:</Strong> $1.8M - $248k = <Strong>$1.55M</Strong></LI>
              <LI><Strong>ROI:</Strong> 625% (every $1 spent returns $6.25)</LI>
              <LI><Strong>Payback Period:</Strong> 1.6 months</LI>
            </UL>

            <P>
              <Strong>Conclusion:</Strong> For global applications, multi-leader pays for itself in under 2 months
              through reduced churn alone. The 88% latency reduction dramatically improves user experience.
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>Replication Topology Guidelines:</Strong><br />
            • <Strong>Single-Leader:</Strong> Most systems, strong consistency, single-region (99% of startups)<br />
            • <Strong>Multi-Leader:</Strong> Global apps with multi-region writes, can handle conflicts (Google Docs, CRMs)<br />
            • <Strong>Leaderless:</Strong> Extreme high availability, eventual consistency OK (DynamoDB, Cassandra, shopping carts)<br /><br />
            <Strong>Golden Rule:</Strong> Start with single-leader. Only move to multi-leader/leaderless when you have a proven
            need (global users complaining about latency, or need 99.99%+ availability).
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

