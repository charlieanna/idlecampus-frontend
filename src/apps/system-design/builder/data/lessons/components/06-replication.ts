import type { SystemDesignLesson } from '../../../types/lesson';
import { SystemGraph } from '../../../types/graph';

export const replicationLesson: SystemDesignLesson = {
  id: 'sd-replication',
  slug: 'database-replication',
  title: 'Database Replication',
  description: 'Learn about database replication modes: single-leader, multi-leader, and leaderless',
  difficulty: 'intermediate',
  estimatedMinutes: 35,
  category: 'components',
  tags: ['replication', 'database', 'scaling', 'consistency'],
  prerequisites: ['basic-components', 'understanding-scale'],
  learningObjectives: [
    'Understand different replication modes',
    'Learn when to use each mode',
    'Understand consistency vs availability trade-offs',
    'Practice configuring replication',
  ],
  conceptsCovered: [
    {
      id: 'single-leader',
      name: 'Single-Leader Replication',
      type: 'pattern',
      difficulty: 3,
      description: 'One primary database accepts writes, replicas handle reads',
    },
    {
      id: 'multi-leader',
      name: 'Multi-Leader Replication',
      type: 'pattern',
      difficulty: 4,
      description: 'Multiple databases can accept writes, requires conflict resolution',
    },
    {
      id: 'leaderless',
      name: 'Leaderless Replication',
      type: 'pattern',
      difficulty: 4,
      description: 'No single leader, uses quorum for reads and writes',
    },
  ],
  relatedChallenges: ['tiny-url', 'food-blog'],
  practiceComponents: [
    { type: 'app_server', required: true },
    { type: 'database', required: true },
  ],
  stages: [
    {
      id: 'replication-intro',
      type: 'concept',
      title: 'What is Replication?',
      description: 'Introduction to replication',
      estimatedMinutes: 5,
      content: {
        markdown: `# What is Replication?

**Replication** is copying data from one database to multiple databases.

## Why Replicate?

1. **Read Scaling**: Distribute read traffic across multiple databases
2. **High Availability**: If one database fails, others continue serving
3. **Geographic Distribution**: Place databases closer to users
4. **Backup**: Replicas serve as backups

## Replication Modes

There are three main approaches:

1. **Single-Leader**: One primary, multiple read replicas
2. **Multi-Leader**: Multiple databases can accept writes
3. **Leaderless**: No single leader, uses quorum

Each has different trade-offs between **consistency**, **availability**, and **performance**.

## CAP Theorem

When designing distributed systems, you must choose:

- **Consistency**: All nodes see same data
- **Availability**: System responds even if nodes fail
- **Partition Tolerance**: System works despite network failures

**You can only guarantee 2 of 3.**

- **CP**: Consistent and Partition-tolerant (single-leader)
- **AP**: Available and Partition-tolerant (multi-leader, leaderless)
- **CA**: Not possible in distributed systems

Most systems choose **AP** (availability over consistency) for better user experience.`,
      },
      keyPoints: [
        'Replication enables read scaling and high availability',
        'Three modes: single-leader, multi-leader, leaderless',
        'CAP theorem: choose 2 of 3 (consistency, availability, partition tolerance)',
      ],
    },
    {
      id: 'replication-single-leader',
      type: 'concept',
      title: 'Single-Leader Replication',
      description: 'Most common replication mode',
      estimatedMinutes: 10,
      content: {
        markdown: `# Single-Leader Replication

**Single-leader** is the most common replication mode.

## How It Works

- **One primary database**: Accepts all writes
- **Multiple read replicas**: Copy data from primary, handle reads only
- **Replication**: Primary sends changes to replicas (async or sync)

## Architecture

\`\`\`
App Server → Primary (writes)
App Server → Replica 1 (reads)
App Server → Replica 2 (reads)
App Server → Replica 3 (reads)
\`\`\`

## Replication Modes

### Async Replication
- Primary writes → returns success → replicates to replicas
- **Faster writes** (doesn't wait for replicas)
- **Risk**: Primary fails before replication (data loss)

### Sync Replication
- Primary writes → waits for replicas → returns success
- **Safer** (no data loss if primary fails)
- **Slower writes** (waits for replicas)

## Capacity

**Read Capacity:**
- Primary: 3000 read RPS
- Each replica: 3000 read RPS
- **Total**: 3000 + (replicas × 3000) read RPS

**Write Capacity:**
- Primary only: 300 write RPS
- Replicas don't handle writes

## Use Cases

✅ **Read-heavy workloads**: News sites, social media feeds
✅ **High availability**: If primary fails, promote replica
✅ **Geographic distribution**: Replicas in different regions

## Limitations

❌ **Write bottleneck**: Only primary handles writes
❌ **Replication lag**: Replicas may be slightly behind (eventual consistency)
❌ **Failover complexity**: Need to promote replica if primary fails

## When to Use

- **Read-to-write ratio > 10:1**: Many more reads than writes
- **Need high availability**: Can't afford downtime
- **Geographic distribution**: Users in multiple regions`,
      },
      keyPoints: [
        'Single-leader: one primary for writes, multiple replicas for reads',
        'Read capacity scales with number of replicas',
        'Write capacity limited to primary (300 RPS)',
      ],
    },
    {
      id: 'replication-multi-leader',
      type: 'concept',
      title: 'Multi-Leader Replication',
      description: 'Multiple databases accept writes',
      estimatedMinutes: 10,
      content: {
        markdown: `# Multi-Leader Replication

**Multi-leader** allows multiple databases to accept writes.

## How It Works

- **Multiple leaders**: Each can accept writes
- **Bidirectional replication**: Changes propagate between leaders
- **Conflict resolution**: Handles conflicting writes

## Architecture

\`\`\`
App Server → Leader 1 (writes)
App Server → Leader 2 (writes)
Leader 1 ↔ Leader 2 (replication)
\`\`\`

## Capacity

**Read Capacity:**
- Each leader: 3000 read RPS
- **Total**: leaders × 3000 read RPS

**Write Capacity:**
- Each leader: 300 write RPS
- **Total**: leaders × 300 write RPS

**Example**: 2 leaders = 6000 read RPS, 600 write RPS

## Conflict Resolution

When two leaders write to same data:

1. **Last-write-wins**: Use timestamp, may lose data
2. **Application-level**: App decides how to merge
3. **Automatic merge**: For certain data types (counters, sets)

## Use Cases

✅ **Write-heavy workloads**: Need more write capacity
✅ **Geographic distribution**: Writes in each region
✅ **Offline support**: Can write locally, sync later

## Limitations

❌ **Conflict resolution**: Complex to handle conflicts
❌ **Eventual consistency**: Data may be inconsistent temporarily
❌ **Higher latency**: Replication between leaders adds delay

## When to Use

- **Write-to-read ratio > 1:1**: Many writes
- **Geographic writes**: Users write in different regions
- **Can handle conflicts**: Data can be merged or last-write-wins is acceptable`,
      },
      keyPoints: [
        'Multi-leader: multiple databases accept writes',
        'Write capacity scales with number of leaders',
        'Requires conflict resolution strategy',
      ],
    },
    {
      id: 'replication-leaderless',
      type: 'concept',
      title: 'Leaderless Replication',
      description: 'No single leader, uses quorum',
      estimatedMinutes: 5,
      content: {
        markdown: `# Leaderless Replication

**Leaderless** has no single leader - any node can accept reads and writes.

## How It Works

- **No leader**: All nodes are equal
- **Quorum**: Read/write from majority of nodes
- **Vector clocks**: Track causality of writes

## Architecture

\`\`\`
App Server → Node 1 (read/write)
App Server → Node 2 (read/write)
App Server → Node 3 (read/write)
\`\`\`

## Quorum

**Read quorum**: Read from (N/2 + 1) nodes
**Write quorum**: Write to (N/2 + 1) nodes

**Example (3 nodes):**
- Read from 2 nodes
- Write to 2 nodes
- Ensures at least one node has latest data

## Capacity

**Read Capacity:**
- Each node: 3000 read RPS
- **Total**: nodes × 3000 read RPS

**Write Capacity:**
- Each node: 300 write RPS
- **Total**: nodes × 300 write RPS

## Use Cases

✅ **High availability**: No single point of failure
✅ **Geographic distribution**: Nodes in different regions
✅ **Simple architecture**: No leader election needed

## Limitations

❌ **Complex consistency**: Eventual consistency, may read stale data
❌ **Conflict resolution**: Concurrent writes may conflict
❌ **Lower performance**: Quorum reads/writes slower

## When to Use

- **Need maximum availability**: Can't have single point of failure
- **Can tolerate eventual consistency**: Stale reads acceptable
- **Simple data model**: Easier conflict resolution`,
      },
      keyPoints: [
        'Leaderless: no single leader, uses quorum',
        'Read/write from majority of nodes',
        'Maximum availability, eventual consistency',
      ],
    },
    {
      id: 'replication-tradeoffs',
      type: 'concept',
      title: 'Replication Trade-offs',
      description: 'Comparing replication modes',
      estimatedMinutes: 5,
      content: {
        markdown: `# Replication Trade-offs

Each replication mode has different trade-offs.

## Comparison Table

| Mode | Read Capacity | Write Capacity | Consistency | Complexity |
|------|---------------|----------------|-------------|------------|
| **Single-Leader** | High (scales with replicas) | Low (300 RPS) | Strong (after sync) | Low |
| **Multi-Leader** | High (scales with leaders) | High (scales with leaders) | Eventual | Medium |
| **Leaderless** | High (scales with nodes) | High (scales with nodes) | Eventual | High |

## Choosing a Mode

### Choose Single-Leader If:
- ✅ Read-heavy workload (10:1 read-to-write ratio)
- ✅ Need strong consistency
- ✅ Simple to implement and maintain

### Choose Multi-Leader If:
- ✅ Write-heavy workload
- ✅ Need write capacity > 300 RPS
- ✅ Can handle conflict resolution

### Choose Leaderless If:
- ✅ Maximum availability required
- ✅ No single point of failure acceptable
- ✅ Can tolerate eventual consistency

## Real-World Examples

- **Single-Leader**: Most web applications (news sites, blogs)
- **Multi-Leader**: Analytics platforms, IoT data collection
- **Leaderless**: Distributed databases (DynamoDB, Cassandra)

## Cost Considerations

- **Single-Leader**: 1 primary + N replicas (replicas cheaper)
- **Multi-Leader**: N leaders (all full databases)
- **Leaderless**: N nodes (all equal)

**Single-leader is usually most cost-effective** for read-heavy workloads.`,
      },
      keyPoints: [
        'Single-leader: best for read-heavy, strong consistency',
        'Multi-leader: best for write-heavy, need write capacity',
        'Leaderless: best for maximum availability',
      ],
    },
    {
      id: 'replication-practice',
      type: 'canvas-practice',
      title: 'Practice: Configure Replication',
      description: 'Add read replicas to scale reads',
      estimatedMinutes: 10,
      scenario: {
        description: 'You have a read-heavy system (5000 read RPS, 50 write RPS). Configure single-leader replication with read replicas to handle the read load. Each replica can handle 3000 read RPS.',
        requirements: [
          'Keep existing app server and database',
          'Configure database with single-leader replication',
          'Set appropriate number of replicas (each handles 3000 read RPS)',
          'Ensure total read capacity >= 5000 RPS',
        ],
      },
      initialCanvas: {
        components: [
          {
            id: 'app_server_1',
            type: 'app_server',
            position: { x: 400, y: 200 },
            config: {
              instances: 1,
              instanceType: 'commodity-app',
            },
          },
          {
            id: 'postgresql_1',
            type: 'postgresql',
            position: { x: 700, y: 200 },
            config: {
              instanceType: 'commodity-db',
              replicationMode: 'single-leader',
              replication: { enabled: false, replicas: 0, mode: 'async' },
              sharding: { enabled: false, shards: 1, shardKey: 'id' },
            },
          },
        ],
        connections: [
          {
            from: 'app_server_1',
            to: 'postgresql_1',
            type: 'read',
          },
        ],
      },
      hints: [
        'Enable replication on the database component',
        'Set replication mode to "single-leader"',
        'Calculate: 5000 read RPS / 3000 RPS per replica = 2 replicas needed',
        'Primary handles 3000 read RPS, each replica handles 3000 read RPS',
        'Total: 3000 + (2 × 3000) = 9000 read RPS (sufficient)',
      ],
      solution: {
        components: [
          {
            id: 'app_server_1',
            type: 'app_server',
            position: { x: 400, y: 200 },
            config: {
              instances: 1,
              instanceType: 'commodity-app',
            },
          },
          {
            id: 'postgresql_1',
            type: 'postgresql',
            position: { x: 700, y: 200 },
            config: {
              instanceType: 'commodity-db',
              replicationMode: 'single-leader',
              replication: { enabled: true, replicas: 2, mode: 'async' },
              sharding: { enabled: false, shards: 1, shardKey: 'id' },
            },
          },
        ],
        connections: [
          {
            from: 'app_server_1',
            to: 'postgresql_1',
            type: 'read',
          },
        ],
      },
      solutionExplanation: `## Solution Explanation

**Single-leader replication with 2 replicas:**

- **Primary**: Handles writes (50 RPS) and reads (3000 RPS)
- **Replica 1**: Handles reads (3000 RPS)
- **Replica 2**: Handles reads (3000 RPS)

**Total read capacity**: 3000 + (2 × 3000) = **9000 read RPS**

This is sufficient for 5000 read RPS with headroom.

**Benefits:**
- Read traffic distributed across 3 databases
- High availability (if primary fails, promote replica)
- Can handle traffic growth

**Note**: The app server connects to the database, and the database internally routes reads to replicas. You don't need separate connections for each replica.`,
    },
  ],
  nextLessons: ['load-balancing'],
};

