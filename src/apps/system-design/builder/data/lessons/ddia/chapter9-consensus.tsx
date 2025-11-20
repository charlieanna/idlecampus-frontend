import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter9ConsensusLesson: SystemDesignLesson = {
  id: 'ddia-ch9-consensus',
  slug: 'ddia-ch9-consensus',
  title: 'Consensus Algorithms (DDIA Ch. 9)',
  description: 'Learn about linearizability, eventual consistency, Paxos, and Raft. Includes critical trade-offs: consistency models, consensus implementations, and distributed lock strategies with real-world examples and ROI analysis.',
  category: 'fundamentals',
  difficulty: 'advanced',
  estimatedMinutes: 105,
  stages: [
    {
      id: 'intro-consensus',
      type: 'concept',
      title: 'Consensus in Distributed Systems',
      content: (
        <Section>
          <H1>Consensus in Distributed Systems</H1>
          <P>
            <Strong>Consensus</Strong> is the problem of getting multiple nodes to agree on a value.
            Critical for leader election, distributed locks, and coordination.
          </P>
          <UL>
            <LI><Strong>Linearizability:</Strong> Strong consistency - all nodes see same order of operations</LI>
            <LI><Strong>Eventual Consistency:</Strong> Weak consistency - nodes eventually converge</LI>
            <LI><Strong>Consensus Algorithms:</Strong> Paxos, Raft - ensure nodes agree despite failures</LI>
          </UL>
        </Section>
      ),
    },
    {
      id: 'consistency-models',
      type: 'concept',
      title: 'Consistency Models',
      content: (
        <Section>
          <H1>Consistency Models</H1>
          <H2>Linearizability (Strong Consistency)</H2>
          <P>
            <Strong>Linearizability</Strong> guarantees that all operations appear to execute atomically
            in some sequential order, and all nodes see the same order.
          </P>
          <UL>
            <LI>Strongest consistency model</LI>
            <LI>All reads see latest write</LI>
            <LI>Expensive (requires coordination)</LI>
            <LI>Example: Leader election, distributed locks</LI>
          </UL>

          <H2>Eventual Consistency</H2>
          <P>
            <Strong>Eventual Consistency</Strong> allows temporary inconsistencies, but guarantees
            all nodes will eventually converge to the same state.
          </P>
          <UL>
            <LI>Weaker consistency model</LI>
            <LI>Reads may see stale data</LI>
            <LI>Faster, more available</LI>
            <LI>Example: DNS, CDN caches</LI>
          </UL>

          <H2>Other Consistency Models</H2>
          <UL>
            <LI><Strong>Causal Consistency:</Strong> Preserves cause-and-effect relationships</LI>
            <LI><Strong>Read-Your-Writes:</Strong> You always see your own writes</LI>
            <LI><Strong>Monotonic Reads:</Strong> You never see older data after seeing newer data</LI>
          </UL>

          <ComparisonTable
            headers={['Model', 'Strength', 'Performance', 'Use Case']}
            rows={[
              ['Linearizability', 'Strongest', 'Slowest', 'Leader election, locks'],
              ['Causal', 'Strong', 'Medium', 'Social feeds'],
              ['Eventual', 'Weakest', 'Fastest', 'CDN, DNS'],
            ]}
          />
        </Section>
      ),
    },
    {
      id: 'consistency-tradeoff',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Linearizability vs Eventual Consistency',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Linearizability vs Eventual Consistency</H1>
          <P>
            Choosing between <Strong>linearizable (strong)</Strong> and <Strong>eventual consistency</Strong>
            fundamentally impacts your system's performance, availability, and complexity.
          </P>

          <H2>📊 Consistency Model Comparison</H2>
          <ComparisonTable
            headers={['Dimension', 'Linearizable', 'Causal', 'Eventual']}
            rows={[
              ['Read Latency', '20-50ms (quorum)', '5-10ms (local + metadata)', '1-2ms (local only)'],
              ['Write Latency', '50-100ms (quorum + consensus)', '20-30ms (causal broadcast)', '5-10ms (async replication)'],
              ['Throughput', '5,000 TPS (coordination overhead)', '25,000 TPS (moderate overhead)', '100,000 TPS (minimal overhead)'],
              ['Availability During Partition', 'Unavailable (CP)', 'Partial (depends)', 'Fully available (AP)'],
              ['Staleness Guarantee', 'Zero (always fresh)', 'Causally consistent', 'Seconds to hours'],
              ['Coordination Cost', 'High (every operation)', 'Medium (causal tracking)', 'None (best effort)'],
              ['Infrastructure Cost', '$200k/year (3-5 nodes, quorum)', '$100k/year (3 nodes)', '$50k/year (2 nodes)'],
              ['Complexity', 'High (consensus protocols)', 'Medium (vector clocks)', 'Low (simple replication)'],
            ]}
          />

          <H2>💡 Real-World Example: Social Media Platform</H2>
          <InfoBox>
            <P>
              <Strong>Scenario:</Strong> Social platform with 10M users, 50,000 posts/sec,
              500,000 reads/sec, p99 latency SLA of 100ms.
            </P>

            <H3>Option 1: Linearizable Consistency (etcd/Consul)</H3>
            <UL>
              <LI><Strong>Configuration:</Strong> 5-node Raft cluster, quorum writes (3/5)</LI>
              <LI><Strong>Read Latency:</Strong> p50: 30ms, p99: 80ms (quorum read required)</LI>
              <LI><Strong>Write Latency:</Strong> p50: 60ms, p99: 150ms (Raft consensus)</LI>
              <LI><Strong>Throughput Limit:</Strong> 10,000 writes/sec (consensus bottleneck)</LI>
              <LI><Strong>Infrastructure:</Strong> 15 nodes (3 shards × 5 nodes) = $300k/year</LI>
              <LI><Strong>Partition Behavior:</Strong> Service unavailable (5% of time) = 438 hours/year</LI>
              <LI><Strong>Lost Revenue:</Strong> 438h × 10M users × 0.1% engagement × $0.50 = $219k/year</LI>
              <LI><Strong>Development Cost:</Strong> $50k/year (simpler - no conflict resolution)</LI>
              <LI><Strong>Total Annual Cost:</Strong> $300k + $219k + $50k = $569k</LI>
            </UL>

            <H3>Option 2: Causal Consistency (Cassandra with SERIAL)</H3>
            <UL>
              <LI><Strong>Configuration:</Strong> 6-node cluster, LOCAL_QUORUM writes</LI>
              <LI><Strong>Read Latency:</Strong> p50: 8ms, p99: 25ms (local quorum)</LI>
              <LI><Strong>Write Latency:</Strong> p50: 20ms, p99: 60ms (lightweight coordination)</LI>
              <LI><Strong>Throughput Limit:</Strong> 50,000 writes/sec (causal tracking overhead)</LI>
              <LI><Strong>Infrastructure:</Strong> 6 nodes = $120k/year</LI>
              <LI><Strong>Partition Behavior:</Strong> Degrades gracefully (causal order maintained per-partition)</LI>
              <LI><Strong>Anomalies:</Strong> Rare causal violations (0.01%) during cross-DC writes</LI>
              <LI><Strong>Support Cost:</Strong> $20k/year for edge case handling</LI>
              <LI><Strong>Development Cost:</Strong> $100k/year (causal dependency tracking)</LI>
              <LI><Strong>Total Annual Cost:</Strong> $120k + $20k + $100k = $240k</LI>
            </UL>

            <H3>Option 3: Eventual Consistency (DynamoDB)</H3>
            <UL>
              <LI><Strong>Configuration:</Strong> Multi-region active-active, async replication</LI>
              <LI><Strong>Read Latency:</Strong> p50: 2ms, p99: 10ms (local read)</LI>
              <LI><Strong>Write Latency:</Strong> p50: 8ms, p99: 20ms (async acknowledgment)</LI>
              <LI><Strong>Throughput:</Strong> Unlimited (100,000+ writes/sec)</LI>
              <LI><Strong>Infrastructure:</Strong> $80k/year (managed service, pay-per-use)</LI>
              <LI><Strong>Partition Behavior:</Strong> Fully available (99.99% uptime)</LI>
              <LI><Strong>Staleness:</Strong> 100ms-1s replication lag (95% of time)</LI>
              <LI><Strong>Conflict Rate:</Strong> 0.1% of writes (500 conflicts/sec during peak)</LI>
              <LI><Strong>User Impact:</Strong> Duplicate likes, lost comments (rarely visible)</LI>
              <LI><Strong>Support Cost:</Strong> $80k/year for conflict resolution team</LI>
              <LI><Strong>Development Cost:</Strong> $150k/year (conflict resolution logic, monitoring)</LI>
              <LI><Strong>Total Annual Cost:</Strong> $80k + $80k + $150k = $310k</LI>
            </UL>

            <H3>📈 ROI Analysis</H3>
            <ComparisonTable
              headers={['Consistency Model', 'Annual Cost', 'P99 Latency', 'Availability', 'Best For']}
              rows={[
                ['Linearizable', '$569k', '150ms (fails SLA)', '95%', 'Banking, inventory, critical workflows'],
                ['Causal', '$240k ✓', '60ms (meets SLA)', '99.5%', 'Social feeds, collaborative editing'],
                ['Eventual', '$310k', '20ms (exceeds SLA)', '99.99%', 'Analytics, caching, non-critical data'],
              ]}
            />

            <P><Strong>Result:</Strong> For social platform, causal consistency saves $329k vs linearizable,
            $70k vs eventual, while meeting latency SLA and preserving important ordering guarantees.</P>
          </InfoBox>

          <H2>🔧 Decision Framework</H2>
          <CodeBlock>
{`// Linearizable Implementation (etcd with Raft)
import { Etcd3 } from 'etcd3';

const etcd = new Etcd3();

// Linearizable read (quorum required)
const readLinearizable = async (key) => {
  const value = await etcd.get(key);  // Reads from quorum
  return value;  // Guaranteed most recent write
};

// Result: 30-50ms latency, but always consistent
// Use when: Banking transactions, leader election, distributed locks

// Linearizable write (Raft consensus)
const writeLinearizable = async (key, value) => {
  await etcd.put(key, value);  // Raft replicates to majority
  return;  // Guaranteed committed to quorum
};

// Result: 50-100ms latency, survives minority failures
// Throughput: ~10,000 TPS per cluster

// ===================================================================

// Causal Consistency Implementation (Cassandra)
import cassandra from 'cassandra-driver';

const client = new cassandra.Client({
  contactPoints: ['node1', 'node2', 'node3'],
  localDataCenter: 'dc1',
});

// Causal read (tracks dependencies)
const readCausal = async (userId, postId) => {
  // Read with causal consistency
  const result = await client.execute(
    'SELECT * FROM posts WHERE user_id = ? AND post_id = ?',
    [userId, postId],
    {
      consistency: cassandra.types.consistencies.localQuorum,
      serialConsistency: cassandra.types.consistencies.serial  // Causal tracking
    }
  );

  return result.rows[0];
};

// Result: 10-20ms latency, preserves happens-before relationships
// Use when: Social feeds (likes after post), collaborative editing

// Causal write with dependency tracking
const writeCausal = async (userId, postId, content, dependencies) => {
  // Write with causal dependencies
  await client.execute(
    'INSERT INTO posts (user_id, post_id, content, dependencies) VALUES (?, ?, ?, ?)',
    [userId, postId, content, dependencies],  // Track what this depends on
    { consistency: cassandra.types.consistencies.localQuorum }
  );
};

// Result: 20-40ms latency, ensures causal order
// Guarantees: If user sees post, they see all prior edits/comments

// ===================================================================

// Eventual Consistency Implementation (DynamoDB)
import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';

const dynamodb = new DynamoDBClient({ region: 'us-east-1' });

// Eventual read (fast, may be stale)
const readEventual = async (userId) => {
  const result = await dynamodb.send(new GetItemCommand({
    TableName: 'Users',
    Key: { userId: { S: userId } },
    ConsistentRead: false  // Eventually consistent (1-2ms)
  }));

  return result.Item;
};

// Result: 1-3ms latency, might be stale by 100ms-1s
// Use when: Analytics, user profiles, caching, non-critical data

// Eventual write (fire and forget)
const writeEventual = async (userId, data) => {
  await dynamodb.send(new PutItemCommand({
    TableName: 'Users',
    Item: {
      userId: { S: userId },
      ...data,
      timestamp: { N: Date.now().toString() }  // Last-write-wins
    }
  }));

  return;  // Returns immediately, replicates async
};

// Conflict resolution (Last-Write-Wins)
const resolveConflict = (value1, value2) => {
  return value1.timestamp > value2.timestamp ? value1 : value2;
};

// Result: 5-10ms write latency, unlimited throughput
// Trade-off: 0.1% conflict rate during concurrent writes`}
          </CodeBlock>

          <H2>🚫 Common Mistakes</H2>
          <ComparisonTable
            headers={['Mistake', 'Impact', 'Fix']}
            rows={[
              ['Using linearizable for all data', '10× higher latency, 5× higher costs', 'Only linearize critical data (locks, inventory), use eventual for rest'],
              ['Not implementing conflict resolution for eventual', 'Permanent data loss or corruption', 'Use LWW, version vectors, or CRDTs for conflict resolution'],
              ['Mixing consistency models in same transaction', 'Unpredictable results, race conditions', 'Separate databases: etcd for coordination + DynamoDB for data'],
              ['Reading from follower in linearizable system', 'Stale reads despite linearizable guarantee', 'Always read from leader or use quorum reads'],
              ['Assuming causal = strong consistency', 'Missing anomalies (write skew, lost updates)', 'Understand causal only prevents causality violations, not all anomalies'],
              ['Using eventual consistency for money/inventory', '$100k+ annual losses from race conditions', 'Always use linearizable or serializable for financial data'],
            ]}
          />

          <H2>📋 Consistency Model Selection</H2>
          <P><Strong>Choose Linearizable when:</Strong></P>
          <UL>
            <LI>✓ Coordinating distributed systems (leader election, locks)</LI>
            <LI>✓ Financial transactions (payments, transfers)</LI>
            <LI>✓ Inventory management (prevent overselling)</LI>
            <LI>✓ Correctness &gt; performance (legal/compliance requirements)</LI>
            <LI>✓ Read/write volume &lt; 10,000 TPS</LI>
          </UL>

          <P><Strong>Choose Causal when:</Strong></P>
          <UL>
            <LI>✓ Social interactions (preserve reply-after-post ordering)</LI>
            <LI>✓ Collaborative editing (preserve edit history)</LI>
            <LI>✓ Need some ordering guarantees without full coordination</LI>
            <LI>✓ Read/write volume 10,000-50,000 TPS</LI>
          </UL>

          <P><Strong>Choose Eventual when:</Strong></P>
          <UL>
            <LI>✓ Analytics and metrics (aggregate data, logs)</LI>
            <LI>✓ Caching layers (stale data acceptable)</LI>
            <LI>✓ User profiles (low conflict rate)</LI>
            <LI>✓ Need maximum throughput (&gt;50,000 TPS)</LI>
            <LI>✓ Global distribution (multi-region active-active)</LI>
          </UL>

          <KeyPoint>
            <Strong>Golden Rule:</Strong> Use the weakest consistency model that meets your requirements.
            Hybrid architectures work best: linearizable for coordination (etcd) + eventual for data (DynamoDB).
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'paxos',
      type: 'concept',
      title: 'Paxos - Classic Consensus Algorithm',
      content: (
        <Section>
          <H1>Paxos - Classic Consensus Algorithm</H1>
          <P>
            <Strong>Paxos</Strong> is a consensus algorithm that ensures nodes agree on a value
            even if some nodes fail. Complex but proven correct.
          </P>

          <H2>Phases</H2>
          <OL>
            <LI><Strong>Prepare Phase:</Strong> Proposer sends prepare(n) to majority</LI>
            <LI><Strong>Promise Phase:</Strong> Acceptors promise not to accept proposals &lt; n</LI>
            <LI><Strong>Accept Phase:</Strong> Proposer sends accept(n, v) to majority</LI>
            <LI><Strong>Learn Phase:</Strong> Acceptors learn the chosen value</LI>
          </OL>

          <InfoBox>
            <P>
              <Strong>Note:</Strong> Paxos is complex. In practice, most systems use Raft (simpler) or
              Multi-Paxos (optimized version of Paxos).
            </P>
          </InfoBox>
        </Section>
      ),
    },
    {
      id: 'raft',
      type: 'concept',
      title: 'Raft - Understandable Consensus',
      content: (
        <Section>
          <H1>Raft - Understandable Consensus</H1>
          <P>
            <Strong>Raft</Strong> is a consensus algorithm designed to be easier to understand than Paxos.
            Used by etcd, Consul, and many distributed systems.
          </P>

          <H2>Key Concepts</H2>
          <UL>
            <LI><Strong>Leader:</Strong> One node handles all client requests</LI>
            <LI><Strong>Followers:</Strong> Replicate leader's log</LI>
            <LI><Strong>Log Replication:</Strong> Leader appends to log, replicates to majority</LI>
            <LI><Strong>Leader Election:</Strong> If leader fails, new leader elected</LI>
          </UL>

          <H2>Leader Election</H2>
          <OL>
            <LI>Follower times out waiting for leader heartbeat</LI>
            <LI>Becomes candidate, votes for itself</LI>
            <LI>Sends vote requests to other nodes</LI>
            <LI>If majority votes, becomes leader</LI>
            <LI>Leader sends heartbeats to maintain leadership</LI>
          </OL>

          <Example title="Raft Log Replication">
            <CodeBlock>
{`// Leader receives write request
Leader: append("SET x=1") to log[term=5, index=10]

// Replicate to followers
Leader -> Follower1: appendEntries(term=5, index=10, "SET x=1")
Leader -> Follower2: appendEntries(term=5, index=10, "SET x=1")

// Wait for majority acknowledgment
if (majority_acked) {
  commit log[10]  // Apply to state machine
  return success to client
}`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Used By:</Strong> etcd, Consul, CockroachDB. Simpler than Paxos, production-proven.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'distributed-locks',
      type: 'concept',
      title: 'Distributed Locks & Fencing Tokens',
      content: (
        <Section>
          <H1>Distributed Locks & Fencing Tokens</H1>
          <P>
            <Strong>Distributed locks</Strong> coordinate access to shared resources across multiple nodes.
            Must handle network partitions and node failures.
          </P>

          <H2>Challenges</H2>
          <UL>
            <LI><Strong>Network Partitions:</Strong> Lock holder may be isolated, others think lock released</LI>
            <LI><Strong>Clock Skew:</Strong> Lock expiration times may be wrong</LI>
            <LI><Strong>Split-Brain:</Strong> Multiple nodes think they hold the lock</LI>
          </UL>

          <H2>Fencing Tokens</H2>
          <P>
            <Strong>Fencing tokens</Strong> are monotonically increasing numbers that prove you hold the lock.
            Resource (e.g., storage) rejects operations with old tokens.
          </P>

          <Example title="Distributed Lock with Fencing">
            <CodeBlock>
{`// Client acquires lock
lock = acquireLock("resource", ttl=30s)
// Returns: { lock_id: "abc123", fencing_token: 42 }

// Client performs operation with fencing token
write("resource", data, fencing_token=42)
// Storage checks: if token < last_seen_token, reject

// If old leader tries to write after new leader elected:
old_leader.write("resource", data, fencing_token=42)
// Storage: 42 < 45 (new leader's token), REJECT!`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Best Practice:</Strong> Always use fencing tokens with distributed locks to prevent split-brain.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'consensus-implementation-tradeoff',
      type: 'concept',
      title: '🎯 Critical Trade-Off: DIY Raft vs Managed Consensus',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Building Your Own Raft vs Managed Services</H1>
          <P>
            When implementing consensus, you must choose between <Strong>building your own Raft/Paxos cluster</Strong>,
            <Strong>using open-source coordination services (etcd, Consul)</Strong>, or
            <Strong>managed cloud services (ZooKeeper, DynamoDB with transactions)</Strong>.
          </P>

          <H2>📊 Consensus Implementation Comparison</H2>
          <ComparisonTable
            headers={['Dimension', 'DIY Raft (from scratch)', 'Self-Hosted etcd/Consul', 'Managed Service (ZooKeeper, AWS)']}
            rows={[
              ['Development Time', '6-12 months', '1-2 weeks (integration)', '1-3 days (API calls)'],
              ['Initial Cost', '$500k-$1M (engineering)', '$20k (setup)', '$5k (configuration)'],
              ['Annual Infrastructure', '$150k (3-5 VMs)', '$80k (3-5 VMs + monitoring)', '$120k (managed pricing)'],
              ['Operational Complexity', 'Extreme (bugs, edge cases)', 'High (cluster management)', 'Low (cloud manages)'],
              ['On-Call Burden', '24/7 pager duty', 'Weekly incidents', 'Monthly incidents'],
              ['Throughput', '10,000-50,000 TPS (custom optimized)', '10,000 TPS (standard)', '5,000-25,000 TPS (varies)'],
              ['Latency', 'Optimized (20-50ms)', 'Standard (30-80ms)', 'Variable (50-200ms, cross-AZ)'],
              ['Availability SLA', 'No SLA (DIY)', '99.9% (self-managed)', '99.99% (managed SLA)'],
              ['Time to Production', '12-18 months', '1-2 months', '1-2 weeks'],
              ['Vendor Lock-in', 'None (custom)', 'Low (open source)', 'High (cloud-specific APIs)'],
            ]}
          />

          <H2>💡 Real-World Example: Distributed Lock Service for Microservices</H2>
          <InfoBox>
            <P>
              <Strong>Scenario:</Strong> Growing startup needs distributed locks for 50 microservices,
              1,000 lock acquisitions/sec, p99 latency requirement of 100ms.
            </P>

            <H3>Option 1: Build Custom Raft Implementation</H3>
            <UL>
              <LI><Strong>Team:</Strong> 3 senior engineers × 6 months = $300k (salaries + overhead)</LI>
              <LI><Strong>Development Time:</Strong> 6-12 months to production-ready</LI>
              <LI><Strong>Infrastructure:</Strong> 5-node cluster = $100k/year (VMs, storage, network)</LI>
              <LI><Strong>Bugs & Edge Cases:</Strong> 6-month delay due to split-brain bug = $200k lost productivity</LI>
              <LI><Strong>Operational Cost:</Strong> 1 SRE full-time = $200k/year</LI>
              <LI><Strong>Incidents:</Strong> 12 outages/year × 2 hour MTTR × $10k/hour = $240k/year lost revenue</LI>
              <LI><Strong>Performance:</Strong> Optimized to 20ms p99 latency (custom protocol)</LI>
              <LI><Strong>Total Year 1 Cost:</Strong> $300k dev + $100k infra + $200k ops + $240k incidents = $840k</LI>
              <LI><Strong>Annual Ongoing Cost:</Strong> $100k + $200k + $240k = $540k</LI>
            </UL>

            <H3>Option 2: Self-Hosted etcd Cluster</H3>
            <UL>
              <LI><Strong>Setup Time:</Strong> 1 engineer × 2 weeks = $10k</LI>
              <LI><Strong>Time to Production:</Strong> 4-6 weeks (including testing)</LI>
              <LI><Strong>Infrastructure:</Strong> 5-node etcd cluster = $60k/year</LI>
              <LI><Strong>Monitoring & Tooling:</Strong> Prometheus, Grafana, alerts = $20k setup + $10k/year</LI>
              <LI><Strong>Operational Cost:</Strong> 0.5 SRE (part-time) = $100k/year</LI>
              <LI><Strong>Incidents:</Strong> 4 outages/year × 1 hour MTTR × $10k/hour = $40k/year</LI>
              <LI><Strong>Performance:</Strong> 50ms p99 latency (acceptable)</LI>
              <LI><Strong>Cluster Upgrades:</Strong> Quarterly, 4 hours each = $16k/year (engineering time)</LI>
              <LI><Strong>Total Year 1 Cost:</Strong> $10k + $20k + $60k + $10k + $100k + $40k + $16k = $256k</LI>
              <LI><Strong>Annual Ongoing Cost:</Strong> $60k + $10k + $100k + $40k + $16k = $226k</LI>
            </UL>

            <H3>Option 3: AWS Managed Service (DynamoDB Transactions + Step Functions)</H3>
            <UL>
              <LI><Strong>Setup Time:</Strong> 1 engineer × 3 days = $3k</LI>
              <LI><Strong>Time to Production:</Strong> 1-2 weeks</LI>
              <LI><Strong>Infrastructure:</Strong> DynamoDB on-demand + Step Functions = $80k/year (usage-based)</LI>
              <LI><Strong>Operational Cost:</Strong> Near zero (AWS manages cluster)</LI>
              <LI><Strong>Incidents:</Strong> 1 outage/year (AWS responsibility) × $10k = $10k/year</LI>
              <LI><Strong>Performance:</Strong> 80-120ms p99 latency (cross-AZ, slightly higher)</LI>
              <LI><Strong>Monitoring:</Strong> CloudWatch included = $2k/year</LI>
              <LI><Strong>Vendor Lock-in Risk:</Strong> Migration cost if switching = $50k (one-time)</LI>
              <LI><Strong>Total Year 1 Cost:</Strong> $3k + $80k + $10k + $2k = $95k</LI>
              <LI><Strong>Annual Ongoing Cost:</Strong> $80k + $10k + $2k = $92k</LI>
            </UL>

            <H3>📈 ROI Analysis (5-Year TCO)</H3>
            <ComparisonTable
              headers={['Approach', 'Year 1 Cost', '5-Year TCO', 'Time to Market', 'Operational Burden']}
              rows={[
                ['DIY Raft', '$840k', '$2.5M', '12 months', 'Extreme (24/7 on-call)'],
                ['Self-Hosted etcd', '$256k ✓', '$1.13M ✓', '6 weeks', 'High (weekly incidents)'],
                ['AWS Managed', '$95k', '$460k', '2 weeks ✓', 'Low (monthly check-ins)'],
              ]}
            />

            <P><Strong>Result:</Strong></P>
            <UL>
              <LI><Strong>For Startups (0-50 engineers):</Strong> Use AWS managed ($1.67M savings vs etcd over 5 years)</LI>
              <LI><Strong>For Mid-Size (50-200 engineers):</Strong> Use self-hosted etcd ($1.37M savings vs DIY, acceptable ops burden)</LI>
              <LI><Strong>For Large Scale (&gt;200 engineers):</Strong> Consider DIY only if extreme performance needed (&lt;10ms p99)</LI>
            </UL>
          </InfoBox>

          <H2>🔧 Decision Framework with Code Examples</H2>
          <CodeBlock>
{`// ===== Option 1: DIY Raft Implementation (DO NOT DO THIS) =====
// WARNING: Building Raft from scratch is EXTREMELY complex
// Requires handling: leader election, log replication, membership changes,
// snapshots, network partitions, clock skew, etc.

// Simplified example (real implementation is 10,000+ lines)
class RaftNode {
  constructor(nodeId, peers) {
    this.nodeId = nodeId;
    this.peers = peers;
    this.state = 'follower';  // follower, candidate, or leader
    this.currentTerm = 0;
    this.votedFor = null;
    this.log = [];
    this.commitIndex = 0;

    // Simplified - real Raft needs:
    // - Persistent state (survives crashes)
    // - Configuration changes
    // - Log compaction/snapshots
    // - Optimizations (batching, pipelining)
    // - Edge case handling (hundreds of scenarios)
  }

  // Just leader election alone is 500+ lines...
  async startElection() { /* ... */ }
  async appendEntries() { /* ... */ }
  async applyCommand() { /* ... */ }
}

// Result: 6-12 months development, high risk of bugs
// ONLY use if: No other option exists AND you have 3+ senior distributed systems engineers

// ===== Option 2: Self-Hosted etcd (RECOMMENDED for control) =====
import { Etcd3 } from 'etcd3';

const etcd = new Etcd3({
  hosts: ['etcd1:2379', 'etcd2:2379', 'etcd3:2379']
});

// Distributed lock with fencing token
async function acquireLock(resourceId, ttl = 30) {
  const lease = etcd.lease(ttl);
  const leaseId = await lease.grant();

  try {
    // Create lock with lease (auto-expires if holder crashes)
    const lockKey = \`/locks/\${resourceId}\`;
    const fencingToken = Date.now();  // In production: use etcd revision

    await etcd.if(lockKey, 'Create', '==', 0)  // Only if lock doesn't exist
      .then(etcd.put(lockKey).value(fencingToken.toString()).lease(leaseId))
      .else(etcd.get(lockKey))
      .commit();

    return { lockKey, fencingToken, lease };

  } catch (error) {
    await lease.revoke();  // Clean up lease on failure
    throw new Error('Lock acquisition failed');
  }
}

// Use lock with automatic cleanup
async function doWorkWithLock(resourceId) {
  const lock = await acquireLock(resourceId, 30);

  try {
    // Perform work while holding lock
    await performCriticalOperation(lock.fencingToken);

  } finally {
    // Always release lock (even on error)
    await lock.lease.revoke();
  }
}

// Result: Production-ready in 4-6 weeks
// Use when: Need control over infrastructure, <10,000 TPS, on-prem deployment

// ===== Option 3: AWS Managed (RECOMMENDED for simplicity) =====
import { DynamoDBClient, TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';

const dynamodb = new DynamoDBClient({ region: 'us-east-1' });

// Distributed lock using DynamoDB conditional writes
async function acquireLockDynamoDB(resourceId, ttl = 30) {
  const lockId = crypto.randomUUID();
  const expiresAt = Date.now() + (ttl * 1000);
  const fencingToken = Date.now();

  try {
    await dynamodb.send(new TransactWriteItemsCommand({
      TransactItems: [{
        Put: {
          TableName: 'DistributedLocks',
          Item: {
            resourceId: { S: resourceId },
            lockId: { S: lockId },
            fencingToken: { N: fencingToken.toString() },
            expiresAt: { N: expiresAt.toString() }
          },
          ConditionExpression: 'attribute_not_exists(resourceId) OR expiresAt < :now',
          ExpressionAttributeValues: {
            ':now': { N: Date.now().toString() }
          }
        }
      }]
    }));

    return { resourceId, lockId, fencingToken };

  } catch (error) {
    if (error.name === 'TransactionCanceledException') {
      throw new Error('Lock already held');
    }
    throw error;
  }
}

// Background job to clean expired locks
async function cleanupExpiredLocks() {
  // DynamoDB TTL handles this automatically (no code needed!)
  // Just enable TTL on 'expiresAt' attribute
}

// Result: Production-ready in 1-2 weeks
// Use when: Startup, rapid iteration, don't want operational burden
// Trade-off: Higher latency (80-120ms vs 50ms), vendor lock-in`}
          </CodeBlock>

          <H2>🚫 Common Mistakes</H2>
          <ComparisonTable
            headers={['Mistake', 'Impact', 'Fix']}
            rows={[
              ['Building DIY Raft "to learn"', '$500k+ wasted, 12-month delay, high bug risk', 'Use etcd/Consul, contribute to open source if you want to learn'],
              ['Not using fencing tokens', 'Split-brain: 2 nodes think they hold lock → data corruption', 'Always include monotonic fencing tokens with every lock operation'],
              ['Single-node etcd in production', '100% data loss on VM failure', 'Always run 3 or 5 nodes (odd number for quorum)'],
              ['Running etcd on same VMs as app', 'Resource contention causes etcd timeouts → cascading failures', 'Dedicate separate VMs/containers for etcd cluster'],
              ['Not monitoring etcd performance', 'Silent degradation → 10× latency increase goes unnoticed', 'Alert on p99 latency >100ms, disk fsync >10ms, leader elections'],
              ['Using managed service for <10ms latency', 'Managed services have 50-200ms cross-AZ latency', 'Self-host etcd with same-AZ deployment for low latency'],
            ]}
          />

          <H2>📋 Implementation Selection Guide</H2>
          <P><Strong>Choose DIY Raft (Build from Scratch) when:</Strong></P>
          <UL>
            <LI>❌ Almost never recommended - extreme complexity, high risk</LI>
            <LI>Only if: Need &lt;5ms latency AND custom consensus logic AND team has 3+ distributed systems PhDs</LI>
          </UL>

          <P><Strong>Choose Self-Hosted etcd/Consul when:</Strong></P>
          <UL>
            <LI>✓ Need control over infrastructure (on-prem, compliance)</LI>
            <LI>✓ Require low latency (&lt;50ms p99)</LI>
            <LI>✓ High throughput (&gt;10,000 TPS)</LI>
            <LI>✓ Avoid vendor lock-in (open source portability)</LI>
            <LI>✓ Have SRE team to manage cluster (50+ engineers)</LI>
            <LI>✓ Cost-sensitive at scale ($200k+ annual cloud spend)</LI>
          </UL>

          <P><Strong>Choose Managed Service (AWS, GCP, Azure) when:</Strong></P>
          <UL>
            <LI>✓ Startup or small team (&lt;50 engineers)</LI>
            <LI>✓ Fast time-to-market critical (weeks, not months)</LI>
            <LI>✓ Limited operational expertise (no dedicated SRE)</LI>
            <LI>✓ Acceptable latency (50-200ms p99)</LI>
            <LI>✓ Variable load (benefit from auto-scaling)</LI>
            <LI>✓ Multi-region deployment (managed cross-region replication)</LI>
          </UL>

          <KeyPoint>
            <Strong>Golden Rule:</Strong> Start with managed services (DynamoDB, ZooKeeper).
            Migrate to self-hosted etcd only when you have &gt;50 engineers AND need &lt;50ms latency.
            Never build your own Raft unless you're building a database company.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

