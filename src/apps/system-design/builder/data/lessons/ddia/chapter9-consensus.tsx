import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter9ConsensusLesson: SystemDesignLesson = {
  id: 'ddia-ch9-consensus',
  slug: 'ddia-ch9-consensus',
  title: 'Consensus Algorithms (DDIA Ch. 9)',
  description: 'Learn about linearizability, eventual consistency, Paxos, and Raft.',
  category: 'fundamentals',
  difficulty: 'advanced',
  estimatedMinutes: 80,
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
  ],
};

