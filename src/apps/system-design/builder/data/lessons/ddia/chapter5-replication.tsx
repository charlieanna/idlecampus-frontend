import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter5ReplicationLesson: SystemDesignLesson = {
  id: 'ddia-ch5-replication',
  slug: 'ddia-ch5-replication',
  title: 'Replication (DDIA Ch. 5)',
  description: 'Learn replication strategies: single-leader, multi-leader, leaderless, and how to handle replication lag.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 75,
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
  ],
};

