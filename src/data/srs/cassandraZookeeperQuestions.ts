/**
 * Scenario Questions for Cassandra and Zookeeper
 *
 * Focus on when to use these technologies and their core patterns
 */

import { ScenarioQuestion } from '../../types/spacedRepetition';

export const cassandraZookeeperQuestions: ScenarioQuestion[] = [
  // ============================================================================
  // Cassandra Scenarios
  // ============================================================================
  {
    id: 'cassandra-q1-time-series',
    conceptId: 'cassandra-fundamentals',
    scenario: {
      context: 'You are building a metrics storage system for IoT devices',
      requirements: [
        '100,000 IoT devices sending metrics every 10 seconds',
        'Need to store metrics for 1 year',
        'Queries: Get metrics for device X in time range Y-Z',
        'Write-heavy: 10K writes/sec, 100 reads/sec',
        'No complex joins or transactions needed',
        'Must handle node failures gracefully',
      ],
      constraints: [
        'Need horizontal scalability',
        'Eventual consistency acceptable',
        'Cannot afford single point of failure',
      ],
      metrics: {
        'Write Rate': '10,000/sec',
        'Read Rate': '100/sec',
        'Data Volume': '~1 PB/year',
        'Query Pattern': 'Time-range by device',
      },
    },
    question: 'Would you use Cassandra for this time-series IoT data? If yes, how would you model the data?',
    questionType: 'architecture_decision',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Cassandra excels at write-heavy workloads',
          keywords: ['cassandra', 'write-heavy', 'high writes', 'writes per second'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Cassandra has no single point of failure',
          keywords: ['no spof', 'distributed', 'fault-tolerant', 'node failures'],
          weight: 0.9,
          mustMention: true,
        },
        {
          concept: 'Time-series data model with partition key',
          keywords: ['partition key', 'clustering column', 'time-series', 'device id'],
          weight: 0.9,
          mustMention: true,
        },
        {
          concept: 'Horizontal scaling by adding nodes',
          keywords: ['horizontal', 'scale out', 'add nodes', 'linear scaling'],
          weight: 0.7,
          mustMention: false,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Database Choice',
          options: [
            {
              name: 'Cassandra',
              pros: ['Write-optimized', 'Linear scaling', 'No SPOF', 'TTL support for auto-expiry'],
              cons: ['Eventual consistency', 'No joins', 'Query limitations'],
            },
            {
              name: 'Relational DB',
              pros: ['ACID transactions', 'SQL queries'],
              cons: ['Poor write scaling', 'Vertical scaling limits', 'Single point of failure'],
            },
          ],
        },
      ],
      antipatterns: [
        'relational for time-series',
        'joins in cassandra',
        'transactions across partitions',
      ],
      optionalPoints: [
        'ttl for auto-expiry',
        'compaction strategy',
        'bucketing by hour/day',
      ],
    },
    explanation: `
**Recommended: YES, Cassandra is Perfect**

**Data Model**:
\`\`\`cql
CREATE TABLE device_metrics (
    device_id text,
    timestamp timestamp,
    metric_name text,
    value double,
    PRIMARY KEY ((device_id), timestamp)
) WITH CLUSTERING ORDER BY (timestamp DESC);
\`\`\`

**Why Cassandra**:

1. **Write-Heavy**: Cassandra's log-structured storage excels at 10K writes/sec
   - Writes go to commit log + memtable (memory)
   - No read-before-write
   - Linear scaling by adding nodes

2. **Time-Series Pattern**:
   - Partition key: device_id (data for same device stored together)
   - Clustering column: timestamp (sorted within partition)
   - Query: SELECT * FROM device_metrics WHERE device_id = ? AND timestamp > ? AND timestamp < ?

3. **No Single Point of Failure**:
   - Peer-to-peer architecture
   - Replication factor = 3 (survives 2 node failures)
   - Continues operating with degraded nodes

4. **Auto-Expiry with TTL**:
   - INSERT ... USING TTL 31536000 (1 year in seconds)
   - Automatically deletes old data

**Scaling**: Add nodes linearly to handle more devices/writes.

**When NOT Cassandra**:
- Need complex joins
- Need ACID transactions
- Read-heavy with complex ad-hoc queries
    `,
    difficulty: 'medium',
    estimatedTimeSeconds: 240,
    tags: ['cassandra', 'time-series', 'iot', 'write-heavy'],
    variationGroup: 'cassandra-use-cases',
  },

  {
    id: 'cassandra-q2-consistency',
    conceptId: 'cassandra-consistency',
    scenario: {
      context: 'Building a user session store for a globally distributed web application',
      requirements: [
        'Users distributed across US, EU, Asia regions',
        'Session writes: User logs in, updates stored',
        'Session reads: Each request validates session',
        'Read/write ratio: 100:1',
        'Latency: <50ms for reads in user\'s region',
        'Can tolerate brief inconsistency (few seconds) after login',
      ],
      constraints: [
        'Must survive data center failures',
        'Cannot have single region bottleneck',
      ],
      metrics: {
        'Read Latency': '<50ms in region',
        'Consistency': 'Eventual OK',
        'Availability': 'Critical',
      },
    },
    question: 'What Cassandra consistency level would you choose for reads and writes? Explain the trade-offs.',
    questionType: 'architecture_decision',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'LOCAL_QUORUM for reads',
          keywords: ['local quorum', 'quorum', 'read consistency', 'local'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'LOCAL_QUORUM for writes',
          keywords: ['local quorum', 'write consistency', 'quorum writes'],
          weight: 0.9,
          mustMention: true,
        },
        {
          concept: 'CAP theorem trade-off',
          keywords: ['cap', 'availability', 'partition tolerance', 'eventual consistency'],
          weight: 0.8,
          mustMention: true,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Consistency vs Latency',
          options: [
            {
              name: 'LOCAL_QUORUM',
              pros: ['Low latency', 'Regional availability', 'Majority consistency in DC'],
              cons: ['Cross-region eventual consistency'],
            },
            {
              name: 'QUORUM (global)',
              pros: ['Stronger consistency'],
              cons: ['Cross-region latency (200-300ms)', 'Lower availability'],
            },
            {
              name: 'ONE',
              pros: ['Lowest latency'],
              cons: ['Risk of reading stale data'],
            },
          ],
        },
      ],
      antipatterns: [
        'ALL for high availability',
        'ONE for critical data',
      ],
      optionalPoints: [
        'replication factor',
        'network topology strategy',
        'read repair',
      ],
    },
    explanation: `
**Recommended: LOCAL_QUORUM for both reads and writes**

**Configuration**:
\`\`\`cql
-- Create keyspace with multi-DC replication
CREATE KEYSPACE sessions
WITH replication = {
  'class': 'NetworkTopologyStrategy',
  'US': 3,
  'EU': 3,
  'ASIA': 3
};

-- Queries
SELECT * FROM sessions WHERE user_id = ?
  USING CONSISTENCY LOCAL_QUORUM;

INSERT INTO sessions (...) VALUES (...)
  USING CONSISTENCY LOCAL_QUORUM;
\`\`\`

**Why LOCAL_QUORUM**:

1. **Latency**: Reads/writes stay within region
   - US users → US data center
   - EU users → EU data center
   - No cross-ocean latency

2. **Consistency**: Majority (2 of 3) nodes in region agree
   - Protects against reading very stale data
   - Strong enough for sessions

3. **Availability**: Tolerates 1 node failure per region
   - RF=3, need 2 nodes → Can lose 1 node

**CAP Trade-off**:
- Partition Tolerance: ✅ (multi-DC)
- Availability: ✅ (LOCAL_QUORUM allows each DC to operate independently)
- Consistency: ~✅ (eventual across regions, but consistent within region)

**Cross-Region Scenario**:
- User logs in US (writes to US DC with LOCAL_QUORUM)
- Session async replicated to EU, ASIA
- If user immediately makes request from EU before replication completes:
  - Small window of inconsistency (1-2 seconds)
  - Acceptable for sessions (stated in requirements)

**Alternative - EACH_QUORUM**: If cross-region consistency critical, but adds latency.
    `,
    difficulty: 'hard',
    estimatedTimeSeconds: 280,
    tags: ['cassandra', 'consistency', 'quorum', 'cap-theorem'],
    variationGroup: 'cassandra-consistency',
  },

  {
    id: 'cassandra-q3-data-modeling',
    conceptId: 'cassandra-data-modeling',
    scenario: {
      context: 'Building a social media feed like Twitter',
      requirements: [
        'Users can post tweets',
        'Users can follow other users',
        'Timeline query: "Get last 100 tweets from users I follow"',
        'User profiles: "Get user info by username"',
        '100M users, 500M tweets per day',
        'Timeline must load in <200ms',
      ],
      constraints: [
        'Cassandra query limitations: no joins, no complex WHERE clauses',
        'Must denormalize for query patterns',
      ],
      metrics: {
        'Scale': '100M users',
        'Timeline Latency': '<200ms',
        'Query Pattern': 'User timeline',
      },
    },
    question: 'How would you model the data in Cassandra to support efficient timeline queries?',
    questionType: 'architecture_decision',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Query-driven data modeling',
          keywords: ['query-driven', 'denormalize', 'model for queries'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'User timeline table with partition key',
          keywords: ['timeline table', 'partition key user', 'clustering by time'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Write-time fan-out',
          keywords: ['fan-out', 'write amplification', 'materialized timeline'],
          weight: 0.8,
          mustMention: true,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Fan-out Strategy',
          options: [
            {
              name: 'Write-time fan-out',
              pros: ['Fast reads', 'Single partition query', 'No joins'],
              cons: ['Write amplification', 'Storage overhead'],
            },
            {
              name: 'Read-time fan-out',
              pros: ['Less storage', 'Fewer writes'],
              cons: ['Slow reads', 'Need to query multiple partitions'],
            },
          ],
        },
      ],
      antipatterns: [
        'joins in cassandra',
        'secondary index on high cardinality',
      ],
      optionalPoints: [
        'hybrid approach for celebrities',
        'read-time for users with >1000 followers',
      ],
    },
    explanation: `
**Recommended: Write-Time Fan-Out with Denormalization**

**Schema**:

\`\`\`cql
-- User timeline (fan-out on write)
CREATE TABLE user_timeline (
    user_id uuid,
    tweet_id timeuuid,
    author_id uuid,
    author_name text,
    tweet_text text,
    created_at timestamp,
    PRIMARY KEY (user_id, tweet_id)
) WITH CLUSTERING ORDER BY (tweet_id DESC);

-- User profile
CREATE TABLE users (
    user_id uuid PRIMARY KEY,
    username text,
    display_name text,
    bio text,
    followers_count int
);

-- Tweets (source of truth)
CREATE TABLE tweets (
    tweet_id timeuuid PRIMARY KEY,
    author_id uuid,
    text text,
    created_at timestamp
);
\`\`\`

**How It Works**:

1. **User tweets**:
   - Write to tweets table
   - Fan out to followers' timelines:
   \`\`\`
   foreach follower in user.followers:
       INSERT INTO user_timeline (user_id=follower, tweet_id, ...) VALUES (...)
   \`\`\`

2. **User views timeline**:
   - Single query: SELECT * FROM user_timeline WHERE user_id = ? LIMIT 100
   - <200ms because all data in one partition

**Why Denormalization**:
- Cassandra has no joins → Store author_name with each tweet
- Partitioned by user_id → All timeline data together
- Clustering by tweet_id DESC → Newest tweets first

**Trade-offs**:
- ✅ Fast reads (single partition)
- ❌ Write amplification (1 tweet → N writes for N followers)
- ❌ Stale data if author changes username (acceptable)

**Optimization for Celebrities**:
- If user has >10K followers → Use read-time fan-out (store in tweets table, query on read)
- Hybrid approach: Write-time for regular users, read-time for celebrities

**Key Lesson**: In Cassandra, you design tables for your queries, not for normalization.
    `,
    difficulty: 'hard',
    estimatedTimeSeconds: 300,
    tags: ['cassandra', 'data-modeling', 'denormalization', 'social-media'],
    variationGroup: 'cassandra-modeling',
  },

  // ============================================================================
  // Zookeeper Scenarios
  // ============================================================================
  {
    id: 'zookeeper-q1-leader-election',
    conceptId: 'leader-election-pattern',
    scenario: {
      context: 'You have a cluster of worker nodes processing tasks from a queue',
      requirements: [
        '10 worker nodes processing tasks',
        'Need exactly one "coordinator" node to assign tasks',
        'If coordinator fails, another node must become coordinator',
        'Workers must detect coordinator change within seconds',
        'Cannot have split-brain (two coordinators)',
      ],
      constraints: [
        'Distributed system - nodes can fail independently',
        'Network partitions can occur',
      ],
      metrics: {
        'Failover Time': '<5 seconds',
        'Split-Brain': 'Must prevent',
        'Coordinator': 'Exactly one at all times',
      },
    },
    question: 'How would you use Zookeeper to implement leader election for the coordinator role?',
    questionType: 'architecture_decision',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Zookeeper for distributed coordination',
          keywords: ['zookeeper', 'coordination', 'distributed', 'consensus'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Ephemeral sequential nodes for election',
          keywords: ['ephemeral', 'sequential', 'znodes', 'election'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Watch mechanism for failover',
          keywords: ['watch', 'watcher', 'notification', 'failover'],
          weight: 0.9,
          mustMention: true,
        },
        {
          concept: 'Consensus prevents split-brain',
          keywords: ['consensus', 'split-brain', 'majority', 'quorum'],
          weight: 0.8,
          mustMention: false,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Coordination Approach',
          options: [
            {
              name: 'Zookeeper',
              pros: ['Consensus-based', 'No split-brain', 'Fast failover', 'Battle-tested'],
              cons: ['External dependency', 'Operational overhead'],
            },
            {
              name: 'Database-based locking',
              pros: ['Simpler'],
              cons: ['Risk of split-brain', 'Slow failover', 'DB becomes SPOF'],
            },
          ],
        },
      ],
      antipatterns: [
        'database locks for leader election',
        'manual failover',
      ],
      optionalPoints: [
        'zab protocol',
        'session timeout',
        'ensembles (3 or 5 nodes)',
      ],
    },
    explanation: `
**Recommended: Zookeeper Leader Election**

**Algorithm**:

1. **Each worker creates ephemeral sequential znode**:
   \`\`\`
   /election/worker-0000000001
   /election/worker-0000000002
   /election/worker-0000000003
   ...
   \`\`\`

2. **Determine leader**: Lowest sequence number is leader
   \`\`\`
   - Worker checks: am I the lowest number?
   - If yes → Become coordinator
   - If no → Watch the node just before me
   \`\`\`

3. **Watch for failover**:
   \`\`\`
   - Worker watching /election/worker-0000000001
   - If worker-0000000001 crashes:
     * Zookeeper deletes ephemeral node (session ended)
     * Watching worker gets notification
     * Checks: am I now the lowest? → Become coordinator
   \`\`\`

**Pseudocode**:

\`\`\`python
def elect_leader():
    # Create ephemeral sequential node
    my_node = zk.create("/election/worker-", ephemeral=True, sequence=True)

    # Get all children, find my position
    children = sorted(zk.get_children("/election"))
    my_position = children.index(my_node)

    if my_position == 0:
        # I'm the leader!
        become_coordinator()
    else:
        # Watch the node before me
        previous_node = children[my_position - 1]
        zk.exists(f"/election/{previous_node}", watch=on_leader_change)

def on_leader_change(event):
    # Previous leader died, re-run election
    elect_leader()
\`\`\`

**Why Zookeeper**:

1. **No Split-Brain**: Zookeeper uses ZAB (Zookeeper Atomic Broadcast) consensus
   - Requires majority (quorum) to make decisions
   - If network partition occurs, only one partition has majority
   - Prevents two coordinators

2. **Automatic Failover**: Ephemeral nodes + watches
   - Coordinator crashes → Session ends → Node deleted → Next worker notified

3. **Fast**: Failover within seconds (session timeout configurable)

**Configuration**:
- Zookeeper ensemble: 3 or 5 nodes (quorum-based)
- Session timeout: 3-5 seconds
- If coordinator doesn't heartbeat within timeout → Declared dead

**Real-World Usage**: Kafka, HBase, and many distributed systems use Zookeeper for leader election.
    `,
    difficulty: 'hard',
    estimatedTimeSeconds: 280,
    tags: ['zookeeper', 'leader-election', 'coordination', 'distributed'],
    variationGroup: 'zookeeper-coordination',
  },

  {
    id: 'zookeeper-q2-distributed-lock',
    conceptId: 'distributed-locks',
    scenario: {
      context: 'Multiple application servers need to coordinate access to a shared resource',
      requirements: [
        'Only one server can access critical section at a time',
        '20 application servers competing for lock',
        'Lock must be released if server crashes',
        'Fairness: Servers should get lock in order they requested',
        'No deadlocks',
      ],
      constraints: [
        'Servers can crash at any time',
        'Network delays can occur',
      ],
      metrics: {
        'Exclusivity': 'Exactly one lock holder',
        'Fairness': 'FIFO order',
        'Safety': 'No deadlocks',
      },
    },
    question: 'How would you implement a distributed lock using Zookeeper?',
    questionType: 'architecture_decision',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Ephemeral sequential nodes for lock queue',
          keywords: ['ephemeral', 'sequential', 'queue', 'lock'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Lowest sequence gets lock',
          keywords: ['lowest', 'sequence', 'first in line'],
          weight: 0.9,
          mustMention: true,
        },
        {
          concept: 'Automatic release on crash',
          keywords: ['ephemeral', 'crash', 'session end', 'automatic release'],
          weight: 0.9,
          mustMention: true,
        },
      ],
      tradeoffs: [],
      antipatterns: [
        'database row locks',
        'redis lock without timeout',
      ],
      optionalPoints: [
        'herd effect prevention',
        'read/write locks',
      ],
    },
    explanation: `
**Implementation: Zookeeper Distributed Lock**

**Algorithm**:

1. **Request lock**:
   \`\`\`
   node = zk.create("/locks/resource-", ephemeral=True, sequence=True)
   # Creates: /locks/resource-0000000012
   \`\`\`

2. **Check if acquired**:
   \`\`\`
   children = sorted(zk.get_children("/locks"))
   my_position = children.index(my_node)

   if my_position == 0:
       # I have the lock!
       do_critical_work()
       zk.delete(my_node)  # Release lock
   else:
       # Wait for my turn
       previous = children[my_position - 1]
       zk.exists(f"/locks/{previous}", watch=lock_released)
   \`\`\`

3. **Lock released**:
   \`\`\`
   def lock_released(event):
       # Previous node deleted, check again
       check_if_acquired()
   \`\`\`

**Example Timeline**:

\`\`\`
Server A: Creates /locks/resource-0000000001 → Gets lock immediately
Server B: Creates /locks/resource-0000000002 → Waits, watches A
Server C: Creates /locks/resource-0000000003 → Waits, watches B

Server A finishes → Deletes node
Server B notified → Becomes lock holder
Server B finishes → Deletes node
Server C notified → Becomes lock holder
\`\`\`

**Safety Guarantees**:

1. **Exactly One Lock Holder**: Lowest sequence number = deterministic
2. **Automatic Release**: Ephemeral nodes deleted when session ends
3. **Fairness**: FIFO order (sequence numbers)
4. **No Deadlocks**: No circular waits possible

**Crash Scenario**:
\`\`\`
Server A has lock, crashes → Session timeout
→ Zookeeper deletes /locks/resource-0000000001
→ Server B watching gets notification
→ Server B acquires lock
\`\`\`

**Herd Effect Prevention**:
- Each server watches only the node before it
- When lock releases, only one server is notified
- Avoids "thundering herd" of all servers waking up

**Real Use Case**: Coordinating schema migrations, cron job execution, resource allocation.
    `,
    difficulty: 'hard',
    estimatedTimeSeconds: 260,
    tags: ['zookeeper', 'distributed-lock', 'coordination', 'mutual-exclusion'],
    variationGroup: 'zookeeper-locks',
  },

  {
    id: 'zookeeper-q3-config-management',
    conceptId: 'zookeeper-fundamentals',
    scenario: {
      context: 'You have 100 application servers that need dynamic configuration updates',
      requirements: [
        'Configuration changes should propagate to all servers within seconds',
        'Servers should not restart to pick up config changes',
        'Changes must be atomic (all servers see same config version)',
        'Need to roll back config changes if needed',
        'Servers joining cluster should get latest config',
      ],
      constraints: [
        'Cannot manually update 100 servers',
        'Config changes are infrequent (few times per day)',
      ],
      metrics: {
        'Propagation Time': '<5 seconds to all servers',
        'Atomic Updates': 'All servers see same version',
      },
    },
    question: 'How would you use Zookeeper for centralized configuration management?',
    questionType: 'architecture_decision',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Zookeeper as configuration store',
          keywords: ['zookeeper', 'configuration', 'centralized', 'store'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Watch mechanism for updates',
          keywords: ['watch', 'notification', 'dynamic', 'real-time'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Version numbers for atomicity',
          keywords: ['version', 'zxid', 'atomic', 'ordering'],
          weight: 0.7,
          mustMention: false,
        },
      ],
      tradeoffs: [],
      antipatterns: [
        'polling for config changes',
        'config files on each server',
      ],
      optionalPoints: [
        'config hierarchy',
        'versioning',
      ],
    },
    explanation: `
**Implementation: Zookeeper Configuration Management**

**Schema**:
\`\`\`
/config
  /app
    /database
      - connection_string = "..."
      - pool_size = 20
    /cache
      - ttl_seconds = 300
      - max_entries = 10000
    /feature_flags
      - new_ui_enabled = true
\`\`\`

**Server Startup**:
\`\`\`python
def initialize_config():
    # Read initial config
    db_config = zk.get("/config/app/database")
    cache_config = zk.get("/config/app/cache")

    # Set watch for changes
    zk.get("/config/app/database", watch=on_config_change)
    zk.get("/config/app/cache", watch=on_config_change)

    # Apply config
    apply_config(db_config, cache_config)

def on_config_change(event):
    # Config changed, reload
    new_config = zk.get(event.path, watch=on_config_change)  # Re-register watch!
    apply_config_hot_reload(new_config)
\`\`\`

**Update Config** (Ops team):
\`\`\`python
# Update pool size
zk.set("/config/app/database/pool_size", b"50")

# All 100 servers get watch notification within seconds
# → Reload config without restart
\`\`\`

**Atomic Multi-Node Update**:
\`\`\`python
# Use transactions for atomic multi-config update
transaction = zk.transaction()
transaction.set_data("/config/app/database/pool_size", b"50")
transaction.set_data("/config/app/cache/ttl_seconds", b"600")
transaction.commit()

# Both changes applied atomically
# Servers see either old values or both new values, never mixed
\`\`\`

**Versioning for Rollback**:
\`\`\`
/config
  /app
    /active -> /config/versions/v123
  /versions
    /v122 (previous)
    /v123 (current)
    /v124 (canary - testing)

# Rollback: zk.set("/config/app/active", "/config/versions/v122")
\`\`\`

**Benefits**:

1. **Dynamic Updates**: No server restarts
2. **Fast Propagation**: Watch notifications <5 seconds
3. **Centralized**: Single source of truth
4. **Versioned**: Easy rollback
5. **Discovery**: New servers get latest config on join

**Real-World**: Kafka brokers use Zookeeper for config, Hadoop for cluster configuration, many service meshes.
    `,
    difficulty: 'medium',
    estimatedTimeSeconds: 220,
    tags: ['zookeeper', 'configuration', 'dynamic-config', 'distributed'],
    variationGroup: 'zookeeper-config',
  },
];

export default cassandraZookeeperQuestions;
