import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const nfrDataConsistencyLesson: SystemDesignLesson = {
  id: 'nfr-data-consistency',
  slug: 'nfr-data-consistency',
  title: 'NFR Fundamentals: Durability, Sharding & Consistency',
  description: 'Master data durability, sharding, and consistency trade-offs: WHEN to choose ephemeral vs 11-nines durability, WHEN to shard vs scale vertically, WHICH sharding strategy (hash vs range vs directory), and WHICH consistency model (strong vs eventual vs causal) based on your access patterns and business requirements.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 75,

  // Progressive flow metadata
  moduleId: 'sd-module-6-nfr',
  sequenceOrder: 2,
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

          <Divider />

          <H2>🎯 Critical Trade-Off: Durability Level vs Cost vs Complexity</H2>

          <ComparisonTable
            headers={['Durability Level', 'Cost/mo (100GB)', 'Recovery Time', 'Data Loss Risk', 'Use When', 'Avoid When']}
            rows={[
              [
                'Ephemeral\n(in-memory only)',
                '$50-100\n(Redis/Memcached)',
                'Instant\n(data gone)',
                '100% on restart\n(acceptable)',
                '• Session tokens\n• Rate limiting counters\n• Temporary cache\n• Real-time presence',
                '• User data\n• Financial records\n• Anything you can\'t recreate'
              ],
              [
                'Standard\n(single disk)',
                '$100-200\n(RDS single instance)',
                '5-30 min\n(restore backup)',
                '0.1-1% annual\n(disk failure)',
                '• Development/staging\n• Low-value user data\n• Logs (if aggregated elsewhere)\n• Analytics (if can reprocess)',
                '• Production user data\n• Financial transactions\n• Regulatory data\n• High-traffic apps'
              ],
              [
                'High\n(RAID + backups)',
                '$300-500\n(RDS Multi-AZ)',
                '1-5 min\n(auto-failover)',
                '0.01% annual\n(datacenter failure)',
                '• Production apps\n• User accounts\n• E-commerce orders\n• Social media posts',
                '• Financial ledgers\n• Healthcare records\n• When regulatory compliance requires multi-region'
              ],
              [
                'Very High\n(multi-region)',
                '$800-2000\n(Aurora Global, S3)',
                'Seconds\n(automatic)',
                '0.00001% annual\n(11 nines)',
                '• Financial transactions\n• Healthcare records\n• Legal documents\n• Compliance data',
                '• Low-value data\n• Temporary data\n• When cost matters more than durability'
              ],
            ]}
          />

          <Example title="Real Decision: Photo Sharing App">
            <P><Strong>Scenario:</Strong> 10 million users, 100 photos/user = 1 billion photos (500TB)</P>

            <P><Strong>Option 1: Standard Durability (EBS volumes, 99.9% durability)</Strong></P>
            <CodeBlock>
{`Cost: $5,000/mo for 500TB storage
Data loss: 0.1% annual = 1 million photos lost/year
Impact:
- User complaints: "Where's my wedding photo?"
- Trust damage: Users leave for competitors
- Legal risk: If deleted medical/legal photos

Calculation:
- 1M photos lost × 10 users affected each = 10M angry users
- Churn: 1% leave = 100k users lost
- Revenue impact: 100k × $5/mo = $500k/year lost
Result: ❌ Saved $30k/year, lost $500k/year`}
            </CodeBlock>

            <P><Strong>Option 2: Very High Durability (S3 Standard, 11 nines)</Strong></P>
            <CodeBlock>
{`Cost: $11,500/mo for 500TB ($0.023/GB)
Data loss: 0.00001% annual = ~5 photos lost/year (vs 1M)
Impact:
- Virtually zero user complaints
- Strong trust and reliability
- Regulatory compliance ready

Calculation:
- Extra cost: $11,500 - $5,000 = $6,500/mo = $78k/year
- Revenue protected: $500k/year
- ROI: $500k / $78k = 6.4x return

Result: ✅ Spend $78k to protect $500k revenue`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> $78k/year for 11-nines durability vs $500k/year in lost revenue from data loss.
              Very high durability wins by 6.4x.
            </KeyPoint>
          </Example>

          <Example title="Real Decision: Session Store">
            <P><Strong>Scenario:</Strong> E-commerce site needs to store user sessions (shopping cart, login state)</P>

            <P><Strong>Option 1: Very High Durability (Multi-region database)</Strong></P>
            <CodeBlock>
{`Cost: $2,000/mo for session storage
Recovery time: Instant (multi-region)
Impact if lost: User has to log in again, cart cleared

Problem: Over-engineering!
- Session TTL: 24 hours (expires anyway)
- User impact: Minor annoyance (just re-login)
- Paying 20x more than needed

Result: ❌ Wasting $1,800/mo`}
            </CodeBlock>

            <P><Strong>Option 2: Ephemeral (Redis, no persistence)</Strong></P>
            <CodeBlock>
{`Cost: $100/mo for Redis cluster
Recovery time: Data gone on restart (acceptable)
Impact if lost:
- Users re-login (happens anyway when cookie expires)
- Cart cleared (can show "recently viewed" to help)
- Downtime: ~5 min/month during deploys

Business decision:
- Session lifetime: 24 hours max (ephemeral by design)
- Restart frequency: 2x/month = 10 min total downtime
- User impact: Minimal (they'd re-login anyway)

Result: ✅ Save $1,800/mo, acceptable UX trade-off`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> For ephemeral data (sessions, cache), don't pay for durability you don't need.
              Match durability to data lifetime.
            </KeyPoint>
          </Example>

          <H3>Decision Framework: Choosing Durability Level</H3>
          <CodeBlock>
{`What happens if this data is lost?

Financial loss or legal liability?
├─ YES → Very High (11 nines, multi-region)
│   └─ Examples: Bank transactions, healthcare records, legal docs
│   └─ Cost: $800-2000/mo per 100GB
│
└─ NO → Can users recreate it easily?
    │
    ├─ NO (valuable user data) → High (Multi-AZ, RAID)
    │   └─ Examples: User profiles, social posts, e-commerce orders
    │   └─ Cost: $300-500/mo per 100GB
    │
    ├─ MAYBE (low-value data) → Standard (single instance + backups)
    │   └─ Examples: Logs, analytics, staging environments
    │   └─ Cost: $100-200/mo per 100GB
    │
    └─ YES (temporary data) → Ephemeral (in-memory)
        └─ Examples: Sessions, cache, rate limits
        └─ Cost: $50-100/mo per 100GB`}
          </CodeBlock>

          <H3>Common Mistakes</H3>
          <UL>
            <LI>
              <Strong>❌ Using single-instance RDS for production user data</Strong>
              <UL>
                <LI>Risk: Disk failure = hours of downtime, data loss</LI>
                <LI>Fix: Use Multi-AZ (costs 2x, but auto-failover in 1-5 min)</LI>
              </UL>
            </LI>
            <LI>
              <Strong>❌ Storing sessions in multi-region database</Strong>
              <UL>
                <LI>Waste: Paying for durability you don't need (sessions expire anyway)</LI>
                <LI>Fix: Use ephemeral Redis, save 95% on costs</LI>
              </UL>
            </LI>
            <LI>
              <Strong>❌ No backups because "we have replication"</Strong>
              <UL>
                <LI>Risk: Replication doesn't protect against bugs (e.g., DELETE without WHERE)</LI>
                <LI>Fix: Automated backups with point-in-time recovery</LI>
              </UL>
            </LI>
          </UL>
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

          <Divider />

          <H2>🎯 Critical Trade-Off: When to Shard vs Scale Vertically</H2>

          <ComparisonTable
            headers={['Approach', 'Cost', 'Complexity', 'Max Scale', 'When to Use', 'Avoid When']}
            rows={[
              [
                'Scale Vertically\n(bigger server)',
                'Low initially\n$200-2000/mo',
                'Very Low\n(just resize)',
                'Limited\n(~32TB, 96 cores)',
                '• Data <1TB\n• Writes <10k/sec\n• Simple queries\n• Small team',
                '• Data >5TB\n• Need unlimited scale\n• Hot spot problems\n• Cost-sensitive at scale'
              ],
              [
                'Shard Horizontally\n(split data)',
                'Higher\n$500-5000/mo',
                'Very High\n(rebalancing, ops)',
                'Unlimited\n(add more shards)',
                '• Data >5TB\n• Writes >50k/sec\n• Need unlimited growth\n• Large eng team',
                '• Data <1TB\n• Small team\n• Can fit on biggest server\n• Need cross-partition queries'
              ],
              [
                'Read Replicas\n(don\'t shard)',
                'Medium\n$400-1000/mo',
                'Low\n(auto-replicate)',
                'Moderate\n(read-heavy only)',
                '• Read-heavy (90%+ reads)\n• Data <5TB\n• Need simple architecture',
                '• Write-heavy workload\n• Data >5TB\n• Need write scaling'
              ],
            ]}
          />

          <Example title="Real Decision: Social Media Startup (Instagram's Journey)">
            <P><Strong>Stage 1: Launch → 1 Million Users (First 6 months)</Strong></P>
            <CodeBlock>
{`Database: Single PostgreSQL (db.m5.large)
Data size: 50GB
Writes: 100/sec, Reads: 1,000/sec
Cost: $200/mo

Decision: ✅ Scale vertically (don't shard yet)
Why: Data fits easily, team of 5 engineers, complexity not worth it`}
            </CodeBlock>

            <P><Strong>Stage 2: 10 Million Users (Year 1)</Strong></P>
            <CodeBlock>
{`Database: Upgraded to db.m5.4xlarge
Data size: 500GB
Writes: 5,000/sec, Reads: 50,000/sec (read-heavy!)
Cost: $1,200/mo

Decision: ✅ Add read replicas (still don't shard)
Why:
- Reads 10x writes → Read replicas solve 90% of problem
- Data still <1TB → Fits on one primary
- Cost: $1,200 primary + $800 replicas = $2,000/mo total
- Complexity: Low (just route reads to replicas)

Result: Handles 50k reads/sec, $2k/mo, no sharding complexity`}
            </CodeBlock>

            <P><Strong>Stage 3: 100 Million Users (Year 2) - MUST SHARD</Strong></P>
            <CodeBlock>
{`Database: Hit the wall!
Data size: 5TB (doesn't fit on largest instance: 32TB theoretical, 5TB practical)
Writes: 50,000/sec (exceeds single server capacity)
Queries slowing down: Table scans on 5TB take minutes

Decision: ✅ Shard by user_id (hash sharding, 8 shards)
Why:
- Data too big for one server
- Writes exceed single server capability
- No choice - must distribute load

Cost: $8,000/mo (8 shards × $1,000 each)
Complexity: High
- Cross-shard queries are hard (can't JOIN across users easily)
- Rebalancing when adding shards
- Operational overhead (8 databases to manage)

But necessary: Can't scale further without sharding`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> Instagram delayed sharding until 100M users. Why? Sharding adds massive complexity.
              Scale vertically + read replicas as long as possible, shard only when you MUST.
            </KeyPoint>
          </Example>

          <H2>🎯 Critical Trade-Off: Hash vs Range vs Directory Sharding</H2>

          <ComparisonTable
            headers={['Strategy', 'Data Distribution', 'Rebalancing', 'Range Queries', 'Best For', 'Worst For']}
            rows={[
              [
                'Hash Sharding\nhash(key) % N',
                'Even\n(random distribution)',
                'Hard\n(rehash all keys)',
                'Impossible\n(data scattered)',
                '• User data (user_id)\n• Session data\n• Even distribution critical',
                '• Time-series data\n• Need range queries\n• Analytics workloads'
              ],
              [
                'Range Sharding\nkey ranges',
                'Can be uneven\n(hot spots)',
                'Easy\n(split ranges)',
                'Easy\n(query one shard)',
                '• Time-series data\n• Analytics\n• Date-based queries',
                '• User data\n• When newest data is hottest\n• Need even distribution'
              ],
              [
                'Directory/Lookup\ntable maps keys',
                'Flexible\n(manual control)',
                'Easy\n(update lookup)',
                'Depends\n(on mapping)',
                '• Custom sharding logic\n• Tenant-based (multi-tenant SaaS)\n• Geographic sharding',
                '• High throughput\n• Lookup table becomes bottleneck\n• Simple use cases'
              ],
            ]}
          />

          <Example title="Real Decision: Time-Series Analytics Platform">
            <P><Strong>Option 1: Hash Sharding by event_id</Strong></P>
            <CodeBlock>
{`shard = hash(event_id) % 4

Query: "Get all events from last 7 days"
Problem: ❌ Must query ALL 4 shards (data scattered)
- Query hits all shards
- Merge results from 4 databases
- Slow: 4× latency (sequential) or complex (parallel)

Cost: Same infrastructure, but 4× query overhead
Result: ❌ Wrong choice for time-series data`}
            </CodeBlock>

            <P><Strong>Option 2: Range Sharding by timestamp</Strong></P>
            <CodeBlock>
{`Shard 1: 2024-01-01 to 2024-03-31 (Q1)
Shard 2: 2024-04-01 to 2024-06-30 (Q2)
Shard 3: 2024-07-01 to 2024-09-30 (Q3)
Shard 4: 2024-10-01 to 2024-12-31 (Q4)

Query: "Get all events from last 7 days" (Nov 15-22)
Solution: ✅ Query ONLY Shard 4
- Single shard query (fast)
- Results already sorted by time
- Easy to add new shards (Q1 2025, Q2 2025...)

Trade-off: Hot spot problem
- Q4 (current quarter) gets 90% of writes
- Older shards are cold (mostly reads)
- But acceptable: Writes are to one shard (it can handle it)

Result: ✅ Right choice for time-series, despite hot spot`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> Hash sharding = even distribution but no range queries.
              Range sharding = efficient range queries but hot spots. Choose based on access pattern.
            </KeyPoint>
          </Example>

          <Example title="Real Decision: Multi-Tenant SaaS (Slack, Notion)">
            <P><Strong>Directory-Based Sharding by tenant_id (company/workspace)</Strong></P>
            <CodeBlock>
{`Lookup Table:
  company_1 (10 users) → Shard 1 (small companies)
  company_2 (50,000 users) → Shard 5 (dedicated shard)
  company_3 (100 users) → Shard 1
  company_4 (25,000 users) → Shard 6 (dedicated shard)

Advantage:
✅ Large customers get dedicated shards (isolation, performance)
✅ Small customers share shards (cost-efficient)
✅ Easy to move companies between shards (update lookup table)
✅ Can shard by geography (GDPR: EU data in EU shards)

Trade-off:
❌ Lookup table is critical (must be fast, highly available)
❌ More operational complexity (manual shard assignment)
✅ But: Worth it for B2B SaaS (customer isolation is valuable)

Slack's approach:
- Free/small teams: Shared shards (1000 teams per shard)
- Enterprise customers: Dedicated shards
- Lookup table in Redis (fast) + PostgreSQL (durable)

Result: Flexibility beats even distribution for multi-tenant apps`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> Directory sharding adds lookup overhead but enables custom logic
              (dedicated shards for big customers, geographic compliance). Worth it for B2B SaaS.
            </KeyPoint>
          </Example>

          <H3>Decision Framework: Choosing Sharding Strategy</H3>
          <CodeBlock>
{`Do you need range queries (e.g., "events from last 7 days")?

├─ YES → Range Sharding
│   └─ Examples: Time-series, analytics, logs
│   └─ Accept: Hot spots (recent data gets more traffic)
│   └─ Mitigate: Use auto-scaling on hot shards
│
└─ NO → Do you need custom logic (tenant isolation, geography)?
    │
    ├─ YES → Directory/Lookup Sharding
    │   └─ Examples: Multi-tenant SaaS, B2B apps
    │   └─ Accept: Lookup table overhead, operational complexity
    │   └─ Ensure: Lookup table is fast (Redis) and highly available
    │
    └─ NO → Hash Sharding
        └─ Examples: User data, session data, general key-value
        └─ Benefit: Even distribution, simple logic
        └─ Accept: Can't do range queries, hard to rebalance`}
          </CodeBlock>

          <H3>Common Mistakes</H3>
          <UL>
            <LI>
              <Strong>❌ Sharding too early</Strong>
              <UL>
                <LI>Problem: Team of 5 shards at 100GB → Complexity kills productivity</LI>
                <LI>Fix: Scale vertically until 1TB+ or 10k+ writes/sec</LI>
                <LI>Guideline: If it fits on one server, don't shard</LI>
              </UL>
            </LI>
            <LI>
              <Strong>❌ Using hash sharding for time-series data</Strong>
              <UL>
                <LI>Problem: "Last 7 days" query hits ALL shards</LI>
                <LI>Fix: Use range sharding by timestamp</LI>
              </UL>
            </LI>
            <LI>
              <Strong>❌ Not planning for rebalancing</Strong>
              <UL>
                <LI>Problem: Grow from 4 to 8 shards → Must re-hash all keys (downtime!)</LI>
                <LI>Fix: Use consistent hashing OR pre-shard (start with 256 virtual shards, map to 4 physical)</LI>
              </UL>
            </LI>
            <LI>
              <Strong>❌ Sharding by wrong key</Strong>
              <UL>
                <LI>Problem: Shard by product_id, but queries are by user_id → cross-shard queries</LI>
                <LI>Fix: Shard by your primary access pattern (usually user_id for user-facing apps)</LI>
              </UL>
            </LI>
          </UL>
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

          <Divider />

          <H2>🎯 Critical Trade-Off: Strong vs Eventual vs Causal Consistency</H2>

          <ComparisonTable
            headers={['Model', 'Performance', 'Complexity', 'Cost/mo', 'User Experience', 'Best For', 'Worst For']}
            rows={[
              [
                'Strong\n(linearizable)',
                'Slowest\n100-500ms writes',
                'Medium\n(consensus protocol)',
                '$500-2000\n(coordination overhead)',
                'Never see stale data\nAlways correct',
                '• Banking\n• Inventory\n• Booking systems\n• Financial ledgers',
                '• Social feeds\n• Analytics\n• CDN\n• High-traffic apps'
              ],
              [
                'Causal\n(preserves order)',
                'Fast\n10-50ms writes',
                'High\n(track causality)',
                '$300-800\n(version vectors)',
                'Logical order preserved\nRare anomalies',
                '• Social media\n• Comments/replies\n• Chat apps\n• Collaborative editing',
                '• Need absolute consistency\n• Simple systems\n• Small teams'
              ],
              [
                'Eventual\n(no guarantees)',
                'Fastest\n1-10ms writes',
                'Low\n(async replication)',
                '$100-300\n(simple replication)',
                'May see stale data\n"Eventually" consistent',
                '• DNS\n• CDN\n• Analytics\n• View counts\n• "Like" counts',
                '• Banking\n• Inventory\n• Booking\n• Anything where wrong data = bad'
              ],
              [
                'Read-Your-Writes\n(hybrid)',
                'Medium\n20-100ms',
                'Low\n(sticky sessions)',
                '$200-500\n(session routing)',
                'You see your changes\nOthers may lag',
                '• User profiles\n• Settings\n• Posts (author view)\n• Comments (your own)',
                '• Multi-user editing\n• Real-time collaboration\n• Strict ordering required'
              ],
            ]}
          />

          <Example title="Real Decision: E-commerce Inventory">
            <P><Strong>Scenario:</Strong> Last iPhone in stock, 2 customers click "Buy Now" simultaneously</P>

            <P><Strong>Option 1: Eventual Consistency</Strong></P>
            <CodeBlock>
{`Flow:
1. Customer A clicks "Buy" → Writes to DC1: inventory = 0
2. Customer B clicks "Buy" → Writes to DC2: inventory = 0
   (Replication lag: 100ms, DC2 doesn't know about DC1 yet)
3. Both orders succeed! ❌ Oversold by 1 unit

Result:
- 2 customers confirmed, 1 iPhone in stock
- Must cancel one order → Angry customer
- Reputation damage

Business Impact:
- Overselling rate: 0.1% of orders during high traffic
- 10,000 orders/day × 0.1% = 10 angry customers/day
- Cost: Apologies, discounts, potential refunds

Decision: ❌ Eventual consistency is WRONG for inventory`}
            </CodeBlock>

            <P><Strong>Option 2: Strong Consistency (Correct Choice)</Strong></P>
            <CodeBlock>
{`Flow:
1. Customer A clicks "Buy" → Lock inventory row, write inventory = 0
2. Customer B clicks "Buy" → Wait for lock...
3. Customer A's transaction commits → Lock released
4. Customer B's transaction runs → inventory = 0 (already sold!)
5. Customer B sees: "Sorry, out of stock" ✅

Result:
- Only 1 order succeeds (correct!)
- Customer B sees "out of stock" immediately (honest UX)
- No overselling, no angry customers

Trade-off:
- Slower: 200ms vs 10ms (20x slower)
- More expensive: $800/mo vs $200/mo (4x more)
- But: Prevents overselling (worth it!)

Amazon's choice: ✅ Strong consistency for inventory
Cost: 4x infrastructure, but prevents massive customer service costs`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> 4x cost + 20x slower BUT prevents overselling.
              For inventory, correctness beats performance. Wrong data = lost trust.
            </KeyPoint>
          </Example>

          <Example title="Real Decision: Social Media Feed (Twitter/X)">
            <P><Strong>Scenario:</Strong> User posts tweet with 10M followers</P>

            <P><Strong>Option 1: Strong Consistency</Strong></P>
            <CodeBlock>
{`Flow:
1. User posts tweet → Wait for replication to ALL datacenters
2. Coordinate across US-East, US-West, EU, Asia (4 regions)
3. Consensus protocol (Raft/Paxos): 200-500ms
4. Tweet visible to all followers simultaneously ✅

Cost:
- Latency: 500ms to post (feels slow!)
- Infrastructure: $5,000/mo for consensus cluster
- Throughput: 1,000 tweets/sec max (coordination bottleneck)

User Experience: ❌ "Why does it take 500ms to post a tweet?"
Scale problem: ❌ Can't handle 6,000 tweets/sec during major events

Decision: ❌ Strong consistency is WRONG for social feeds`}
            </CodeBlock>

            <P><Strong>Option 2: Eventual Consistency (Correct Choice)</Strong></P>
            <CodeBlock>
{`Flow:
1. User posts tweet → Write to nearest datacenter (US-East): 10ms ✅
2. Async replicate to other regions: 100-500ms (background)
3. User sees tweet immediately (Read-Your-Writes)
4. Followers see tweet 0-500ms later (eventual)

Result:
- Author sees tweet instantly (Read-Your-Writes)
- US followers see it in 50ms
- EU followers see it in 200ms
- Asia followers see it in 500ms
- Everyone "eventually" sees it (good enough!)

Cost:
- Latency: 10ms to post (50x faster!)
- Infrastructure: $500/mo for async replication
- Throughput: 100,000+ tweets/sec (no coordination bottleneck)

Twitter's choice: ✅ Eventual consistency
Trade-off: Accept 0-500ms delay for 50x faster writes + 10x cheaper

Business decision:
- Impact of 500ms delay: Minimal (social posts aren't time-critical)
- Impact of 500ms write latency: Users leave (feels broken)
- Conclusion: Speed beats perfect consistency for social feeds`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> 50x faster + 10x cheaper BUT followers see posts with 0-500ms delay.
              For social feeds, speed beats consistency. Stale data = acceptable.
            </KeyPoint>
          </Example>

          <Example title="Real Decision: Comment Thread (Reddit, YouTube)">
            <P><Strong>Challenge:</Strong> User posts comment replying to another comment. What if reply appears BEFORE parent?</P>

            <P><Strong>Option 1: Eventual Consistency</Strong></P>
            <CodeBlock>
{`Flow:
1. User A posts comment: "What's the capital of France?"
2. User B replies: "It's Paris!"
   (Replication lag: Reply reaches US-West before parent comment)
3. User C in US-West sees:
   - "It's Paris!" (reply) ← Shows first!
   - (Parent comment not visible yet)
   - User C confused: "Paris? What question?"

Anomaly: Reply without context (breaks causality!)
Frequency: 0.1% of comments during high traffic
Impact: Confusing UX, broken conversations

Decision: ❌ Eventual consistency breaks comment threads`}
            </CodeBlock>

            <P><Strong>Option 2: Causal Consistency (Correct Choice)</Strong></P>
            <CodeBlock>
{`Flow:
1. User A posts comment: "What's the capital of France?"
   → Tagged with version: v1
2. User B replies: "It's Paris!"
   → Tagged with: parent=v1 (causal dependency)
3. Replication: Reply carries dependency metadata
4. User C's datacenter:
   - Receives reply first
   - Checks: "Do I have parent v1?" → NO
   - Waits for parent to arrive (buffer reply)
   - Parent arrives → Show parent, then reply ✅

Result:
- Comments always appear in logical order
- Never see reply before parent
- Preserves conversation flow

Cost vs Strong Consistency:
- Causal: 50ms writes (10x faster than strong)
- Strong: 500ms writes (overkill for comments)
- Causal: Perfect balance for comment threads

Reddit/YouTube's choice: ✅ Causal consistency
Trade-off: Slightly more complexity (version vectors) but preserves causality`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> Causal consistency preserves logical order (replies after parents)
              while being 10x faster than strong consistency. Right choice for threaded conversations.
            </KeyPoint>
          </Example>

          <H3>Decision Framework: Choosing Consistency Model</H3>
          <CodeBlock>
{`What happens if users see stale or incorrect data?

Financial loss or legal liability? (wrong balance, double-booking)
├─ YES → Strong Consistency
│   └─ Examples: Bank accounts, inventory, reservations, financial ledgers
│   └─ Accept: 20-50x slower writes, 4-10x cost
│   └─ Why: Wrong data = lost money/trust. Correctness beats performance.
│
└─ NO → Does logical order matter? (replies before parents = confusing)
    │
    ├─ YES (causality required) → Causal Consistency
    │   └─ Examples: Comment threads, chat, social feeds, collaborative editing
    │   └─ Accept: Moderate complexity (version vectors, dependency tracking)
    │   └─ Why: Preserves "makes sense" ordering, 10x faster than strong
    │
    └─ NO (order doesn't matter) → Is the data user-specific?
        │
        ├─ YES (user sees own changes) → Read-Your-Writes Consistency
        │   └─ Examples: User profiles, settings, posts (author's view)
        │   └─ Accept: Sticky sessions, slightly more complex routing
        │   └─ Why: Users expect to see their own changes immediately
        │
        └─ NO (data is global) → Eventual Consistency
            └─ Examples: View counts, like counts, DNS, CDN, analytics
            └─ Accept: Users may see different values temporarily
            └─ Why: Fastest (1-10ms), cheapest, scales infinitely`}
          </CodeBlock>

          <H3>Real-World Consistency Choices</H3>
          <ComparisonTable
            headers={['Company', 'Feature', 'Model', 'Why?']}
            rows={[
              [
                'Amazon',
                'Shopping cart',
                'Eventual\n(with merge)',
                'Accept duplicate items rather than lose items. Merge conflicts on checkout. Speed > correctness for cart.'
              ],
              [
                'Amazon',
                'Inventory\n(checkout)',
                'Strong',
                'Must prevent overselling. Lock inventory during checkout. Correctness critical.'
              ],
              [
                'Facebook',
                'News Feed',
                'Eventual',
                'Seeing friend\'s post 500ms late = fine. Speed matters more.'
              ],
              [
                'Facebook',
                'Messenger',
                'Causal',
                'Messages must appear in order. Can\'t see reply before original message.'
              ],
              [
                'Banks',
                'Account balance',
                'Strong',
                'Must be correct. Can\'t show wrong balance or allow overdrafts.'
              ],
              [
                'Netflix',
                'Watch history',
                'Eventual',
                'If "continue watching" is 30sec behind = fine. Sync eventually.'
              ],
              [
                'Uber',
                'Driver location',
                'Eventual',
                'Location 1-2sec old = fine. Real-time updates prioritized over perfect accuracy.'
              ],
              [
                'Stripe',
                'Payment ledger',
                'Strong',
                'Must be exactly correct. Can\'t lose or double-charge.'
              ],
            ]}
          />

          <H3>Common Mistakes</H3>
          <UL>
            <LI>
              <Strong>❌ Using eventual consistency for inventory/bookings</Strong>
              <UL>
                <LI>Problem: Overselling, double-booking → Angry customers</LI>
                <LI>Fix: Strong consistency for scarce resources</LI>
                <LI>Real example: Concert tickets (must prevent double-selling same seat)</LI>
              </UL>
            </LI>
            <LI>
              <Strong>❌ Using strong consistency for social feeds</Strong>
              <UL>
                <LI>Problem: 500ms to post a tweet → Feels broken, can't scale</LI>
                <LI>Fix: Eventual consistency (users don't care about 100ms delay)</LI>
              </UL>
            </LI>
            <LI>
              <Strong>❌ Not implementing Read-Your-Writes for user data</Strong>
              <UL>
                <LI>Problem: User updates profile → Refreshes → Sees old data → "It didn't save!"</LI>
                <LI>Fix: Route user's own reads to primary/leader (always see own writes)</LI>
              </UL>
            </LI>
            <LI>
              <Strong>❌ Assuming "eventual" means "instant"</Strong>
              <UL>
                <LI>Problem: Design assumes 10ms replication, real world = 100-500ms</LI>
                <LI>Fix: Design for worst case (500ms lag), monitor replication lag</LI>
              </UL>
            </LI>
          </UL>

          <KeyPoint>
            <Strong>Golden Rule:</Strong> Choose the WEAKEST consistency model that still meets your requirements.
            Stronger consistency = slower + more expensive. Only pay for consistency you actually need.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

