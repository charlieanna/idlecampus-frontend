import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const nfrDataConsistencyLesson: SystemDesignLesson = {
  id: 'nfr-data-consistency',
  slug: 'nfr-data-consistency',
  title: 'NFR Fundamentals: Durability, Sharding & Consistency',
  description: 'Learn data durability requirements, sharding strategies, and consistency models.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 50,
  stages: [
    {
      id: 'intro-data-consistency',
      type: 'concept',
      title: 'Data Durability, Sharding & Consistency',
      content: (
        <Section>
          <H1>Data Durability, Sharding & Consistency</H1>
          <P>
            Three critical NFRs for data systems: how long data lasts, how data is distributed,
            and when users see updates.
          </P>
        </Section>
      ),
    },
    {
      id: 'durability',
      type: 'concept',
      title: 'Data Durability Requirements',
      content: (
        <Section>
          <H1>Data Durability Requirements</H1>
          <P>
            <Strong>Durability</Strong> measures how long data is preserved and how resistant it is to loss.
            Different systems have different durability requirements.
          </P>

          <H2>Durability Levels</H2>
          <UL>
            <LI><Strong>Ephemeral:</Strong> Data lost on restart (in-memory cache, session data)</LI>
            <LI><Strong>Standard:</Strong> Data survives restarts, but not disk failures (single disk)</LI>
            <LI><Strong>High:</Strong> Data replicated to multiple disks (RAID, 99.9% durability)</LI>
            <LI><Strong>Very High:</Strong> Data replicated across multiple datacenters (99.999999999% - 11 nines)</LI>
          </UL>

          <Example title="Durability by Use Case">
            <ComparisonTable
              headers={['Use Case', 'Durability Level', 'Example']}
              rows={[
                ['Session data', 'Ephemeral', 'Redis (can lose on restart)'],
                ['User preferences', 'Standard', 'Single database'],
                ['Financial transactions', 'Very High', 'Replicated across 3+ regions'],
                ['User photos', 'Very High', 'S3 with 11 nines durability'],
              ]}
            />
          </Example>

          <H2>How to Achieve Durability</H2>
          <UL>
            <LI><Strong>Replication:</Strong> Copy data to multiple locations</LI>
            <LI><Strong>Backups:</Strong> Periodic snapshots to separate storage</LI>
            <LI><Strong>Write-Ahead Log (WAL):</Strong> Log all writes before applying</LI>
            <LI><Strong>Multi-Region:</Strong> Replicate across geographic regions</LI>
          </UL>

          <KeyPoint>
            <Strong>Choose durability level:</Strong> Based on data value and cost. Financial data needs
            very high durability, session data can be ephemeral.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'sharding',
      type: 'concept',
      title: 'Sharding Requirements & Strategies',
      content: (
        <Section>
          <H1>Sharding Requirements & Strategies</H1>
          <P>
            <Strong>Sharding</Strong> (partitioning) splits data across multiple databases when
            data is too large for a single database.
          </P>

          <H2>When to Shard</H2>
          <UL>
            <LI>Database size exceeds single server capacity (e.g., &gt; 1TB)</LI>
            <LI>Write throughput exceeds single server (e.g., &gt; 10k writes/sec)</LI>
            <LI>Query performance degrades due to large dataset</LI>
          </UL>

          <H2>Sharding Strategies</H2>
          <UL>
            <LI><Strong>Hash Sharding:</Strong> Hash key (e.g., user_id) to determine partition</LI>
            <LI><Strong>Range Sharding:</Strong> Partition by ranges (e.g., user_id 1-1000 → partition 1)</LI>
            <LI><Strong>Directory-Based:</Strong> Lookup table maps keys to partitions</LI>
            <LI><Strong>Consistent Hashing:</Strong> Minimizes data movement when adding/removing nodes</LI>
          </UL>

          <Example title="User Data Sharding">
            <CodeBlock>
{`// Hash sharding by user_id
partition = hash(user_id) % num_partitions

user_id=123 → hash=789 → partition = 789 % 4 = 1
user_id=456 → hash=234 → partition = 234 % 4 = 2

// Even distribution across partitions`}
            </CodeBlock>
          </Example>

          <H2>Sharding Challenges</H2>
          <UL>
            <LI><Strong>Cross-partition queries:</Strong> Can't easily query across partitions</LI>
            <LI><Strong>Hot spots:</Strong> Some partitions may be more popular</LI>
            <LI><Strong>Rebalancing:</Strong> Moving data when adding/removing partitions</LI>
          </UL>

          <KeyPoint>
            <Strong>Shard when necessary:</Strong> Only shard when single database can't handle load.
            Sharding adds complexity.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'consistency-models',
      type: 'concept',
      title: 'Consistency Models & Guarantees',
      content: (
        <Section>
          <H1>Consistency Models & Guarantees</H1>
          <P>
            <Strong>Consistency</Strong> defines when users see updates. Different consistency models
            trade off between performance and correctness.
          </P>

          <H2>Read-After-Write Consistency</H2>
          <P>
            User always sees their own writes immediately:
          </P>
          <UL>
            <LI>User posts comment → Immediately sees it in their view</LI>
            <LI>User updates profile → Immediately sees changes</LI>
            <LI>Solution: Read from leader for user's own data, read from replica for others</LI>
          </UL>

          <H2>Consistency Levels</H2>
          <UL>
            <LI><Strong>Strong Consistency:</Strong> All users see same data immediately (slower, requires coordination)</LI>
            <LI><Strong>Eventual Consistency:</Strong> All users see same data eventually (faster, may see stale data)</LI>
            <LI><Strong>Causal Consistency:</Strong> Preserves cause-and-effect relationships</LI>
            <LI><Strong>Read-Your-Writes:</Strong> You always see your own writes</LI>
          </UL>

          <Example title="Social Media Post">
            <P>
              <Strong>Without Read-After-Write:</Strong>
            </P>
            <UL>
              <LI>User posts "Hello" → Written to leader</LI>
              <LI>User refreshes → Reads from replica (not updated yet)</LI>
              <LI>User confused: "Where's my post?"</LI>
            </UL>
            <P>
              <Strong>With Read-After-Write:</Strong>
            </P>
            <UL>
              <LI>User posts "Hello" → Written to leader</LI>
              <LI>User refreshes → Reads from leader (sees own post immediately)</LI>
              <LI>Other users → Read from replica (may see post 1-2 seconds later)</LI>
            </UL>
          </Example>

          <ComparisonTable
            headers={['Consistency Level', 'Performance', 'Use Case']}
            rows={[
              ['Strong', 'Slowest', 'Financial transactions, inventory'],
              ['Causal', 'Medium', 'Social feeds, comments'],
              ['Eventual', 'Fastest', 'CDN, DNS, analytics'],
            ]}
          />

          <KeyPoint>
            <Strong>Choose consistency level:</Strong> Based on use case. Financial data needs strong
            consistency, social feeds can use eventual consistency.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

