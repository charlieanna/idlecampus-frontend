import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider 
} from '../../../ui/components/LessonContent';

export const loadParametersLesson: SystemDesignLesson = {
  id: 'load-parameters',
  slug: 'load-parameters',
  title: 'Understanding Load Parameters',
  description: 'Master WHEN to optimize for fan-out ratio vs bandwidth vs request count, HOW Twitter\'s hybrid approach saved $200k/mo vs pure fan-out-on-write, and WHY optimizing wrong load parameter (RPS for video) wastes $50k while actual bottleneck (bandwidth) costs $500k/mo',
  category: 'patterns',
  difficulty: 'beginner',
  estimatedMinutes: 45,

  // Progressive flow metadata
  moduleId: 'sd-module-3-patterns',
  sequenceOrder: 10,

  stages: [
    {
      id: 'what-are-load-parameters',
      type: 'concept',
      title: 'What are Load Parameters?',
      content: (
        <Section>
          <H1>What are Load Parameters?</H1>
          
          <P>
            <Strong>Load parameters</Strong> are the numbers that describe how much work your system needs to do. 
            Different systems have different load characteristics, and identifying the <Strong>right</Strong> load 
            parameters is crucial for designing scalable systems.
          </P>

          <KeyPoint>
            <Strong>Key Insight:</Strong> The obvious metric (like requests per second) might not be your actual bottleneck!
          </KeyPoint>

          <H2>Common Load Parameters</H2>

          <UL>
            <LI><Strong>Requests per second (RPS):</Strong> How many API requests your system handles</LI>
            <LI><Strong>Concurrent users:</Strong> How many users are actively using the system</LI>
            <LI><Strong>Database queries per second:</Strong> How many database operations occur</LI>
            <LI><Strong>Cache hit rate:</Strong> Percentage of requests served from cache</LI>
            <LI><Strong>Fan-out ratio:</Strong> How many downstream operations one write creates</LI>
            <LI><Strong>Data volume:</Strong> Amount of data stored or transferred</LI>
            <LI><Strong>Bandwidth:</Strong> Network throughput required</LI>
          </UL>
        </Section>
      ),
    },
    {
      id: 'different-systems-different-parameters',
      type: 'concept',
      title: 'Different Systems, Different Parameters',
      content: (
        <Section>
          <H1>Different Systems Have Different Key Load Parameters</H1>
          
          <P>
            The most important load parameter varies by system type. Understanding which parameter matters most 
            helps you design the right architecture.
          </P>

          <H2>Example 1: Twitter - Fan-Out Ratio</H2>

          <Example title="The Twitter Problem">
            <P>
              At first glance, you might think Twitter's bottleneck is <Strong>tweets per second</Strong>. 
              But that's not the real problem!
            </P>

            <P>
              <Strong>The Real Bottleneck:</Strong> When a celebrity with 1 million followers posts a tweet, 
              that single tweet creates <Strong>1 million timeline writes</Strong> (one for each follower).
            </P>

            <CodeBlock>
{`Celebrity posts 1 tweet
  → System must write to 1,000,000 follower timelines
  → 1 write operation becomes 1,000,000 write operations!

Fan-out ratio = 1,000,000:1`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Key Load Parameter:</Strong> Fan-out ratio (average followers per user), NOT tweets per second
            </KeyPoint>
          </Example>

          <H2>Example 2: Web Search - Query Complexity</H2>

          <Example title="Google Search">
            <P>
              Google doesn't just handle high RPS - the real challenge is the <Strong>query complexity</Strong>.
            </P>

            <UL>
              <LI>Each search query must search billions of web pages</LI>
              <LI>Must rank results in milliseconds</LI>
              <LI>Must handle complex queries (multi-word, typos, synonyms)</LI>
            </UL>

            <KeyPoint>
              <Strong>Key Load Parameter:</Strong> Query complexity and index size, not just queries per second
            </KeyPoint>
          </Example>

          <H2>Example 3: Chat Application - Concurrent Connections</H2>

          <Example title="Slack or WhatsApp">
            <P>
              Chat applications have a different bottleneck: <Strong>concurrent connections</Strong>.
            </P>

            <UL>
              <LI>Each user maintains a persistent WebSocket connection</LI>
              <LI>1 million users = 1 million open connections</LI>
              <LI>Messages per second is less important than connection management</LI>
            </UL>

            <KeyPoint>
              <Strong>Key Load Parameter:</Strong> Concurrent connections, not messages per second
            </KeyPoint>
          </Example>

          <H2>Example 4: Video Streaming - Bandwidth</H2>

          <Example title="Netflix or YouTube">
            <P>
              Video streaming's bottleneck is <Strong>bandwidth</Strong>, not requests per second.
            </P>

            <UL>
              <LI>One video stream requires 5-25 Mbps</LI>
              <LI>1 million concurrent viewers = 5-25 Tbps total bandwidth</LI>
              <LI>API requests are minimal compared to video data transfer</LI>
            </UL>

            <KeyPoint>
              <Strong>Key Load Parameter:</Strong> Bandwidth (Mbps/Tbps), not API requests per second
            </KeyPoint>
          </Example>
        </Section>
      ),
    },
    {
      id: 'identifying-load-parameters',
      type: 'concept',
      title: 'How to Identify Load Parameters',
      content: (
        <Section>
          <H1>How to Identify Load Parameters</H1>

          <H2>Step 1: Understand Your System's Behavior</H2>

          <UL>
            <LI>What operations does your system perform?</LI>
            <LI>What happens when a user performs an action?</LI>
            <LI>How does one operation affect other parts of the system?</LI>
          </UL>

          <H2>Step 2: Ask "What Amplifies?"</H2>

          <P>
            Look for operations that create <Strong>amplification</Strong> - where one action causes many downstream operations.
          </P>

          <Example title="Amplification Examples">
            <UL>
              <LI><Strong>Twitter:</Strong> 1 tweet → 1M timeline writes (high amplification)</LI>
              <LI><Strong>Email blast:</Strong> 1 send → 1M emails (high amplification)</LI>
              <LI><Strong>File upload:</Strong> 1 upload → 1 file stored (low amplification)</LI>
            </UL>
          </Example>

          <H2>Step 3: Measure What Matters</H2>

          <P>
            Don't just measure the obvious metrics. Measure what actually impacts your system's performance.
          </P>

          <ComparisonTable
            headers={['System Type', 'Obvious Metric', 'Actual Key Metric']}
            rows={[
              ['Social Media', 'Posts per second', 'Fan-out ratio (followers per user)'],
              ['Web Search', 'Queries per second', 'Query complexity + index size'],
              ['Chat App', 'Messages per second', 'Concurrent connections'],
              ['Video Streaming', 'Video requests', 'Bandwidth (Mbps)'],
              ['E-commerce', 'Page views', 'Database query rate'],
              ['Analytics', 'Events per second', 'Query complexity'],
            ]}
          />

          <KeyPoint>
            <Strong>Remember:</Strong> The metric that matters is often the one that creates the most work downstream, 
            not the one that seems most obvious.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'practical-examples',
      type: 'concept',
      title: 'Practical Examples',
      content: (
        <Section>
          <H1>Practical Examples</H1>

          <H2>Example: Instagram Photo Upload</H2>

          <P>
            When a user uploads a photo to Instagram:
          </P>

          <UL>
            <LI>1 photo upload (obvious metric)</LI>
            <LI>→ Creates thumbnail (3 sizes: small, medium, large)</LI>
            <LI>→ Updates user's feed</LI>
            <LI>→ Updates all followers' feeds (fan-out)</LI>
            <LI>→ Updates search index</LI>
            <LI>→ Triggers notifications to followers</LI>
          </UL>

          <KeyPoint>
            <Strong>Key Load Parameter:</Strong> Fan-out ratio (followers per user) × photo processing time
          </KeyPoint>

          <Divider />

          <H2>Example: E-commerce Product Page</H2>

          <P>
            When a user views a product page:
          </P>

          <UL>
            <LI>1 page view (obvious metric)</LI>
            <LI>→ Queries product details</LI>
            <LI>→ Queries inventory</LI>
            <LI>→ Queries reviews</LI>
            <LI>→ Queries recommendations</LI>
            <LI>→ Queries related products</LI>
          </UL>

          <KeyPoint>
            <Strong>Key Load Parameter:</Strong> Database queries per page view (not page views per second)
          </KeyPoint>

          <Divider />

          <H2>Example: Real-Time Analytics Dashboard</H2>

          <P>
            When a user views an analytics dashboard:
          </P>

          <UL>
            <LI>1 dashboard view (obvious metric)</LI>
            <LI>→ Aggregates millions of events</LI>
            <LI>→ Performs complex time-series queries</LI>
            <LI>→ Calculates multiple metrics</LI>
            <LI>→ Renders charts and graphs</LI>
          </UL>

          <KeyPoint>
            <Strong>Key Load Parameter:</Strong> Query complexity (data scanned per query), not dashboard views per second
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'load-parameter-tradeoffs',
      type: 'concept',
      title: 'Load Parameter Trade-Offs',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Fan-Out-on-Write vs Fan-Out-on-Read</H1>

          <P>
            When a user posts content that appears in many feeds (Twitter, Instagram, LinkedIn), you have two approaches:
          </P>

          <ComparisonTable
            headers={['Approach', 'Write Cost', 'Read Cost', 'Infrastructure Cost', 'Latency', 'Best For', 'Worst For']}
            rows={[
              [
                'Fan-Out-on-Write\n(pre-compute timelines)',
                'Very High\n(write to all followers)',
                'Very Low\n(read pre-built feed)',
                'High\n(lots of storage)',
                'Read: Fast\nWrite: Slow',
                '• Read-heavy\n• <10k followers/user\n• Fast timeline loads critical',
                '• Celebrities (1M+ followers)\n• Write-heavy\n• Limited storage budget'
              ],
              [
                'Fan-Out-on-Read\n(query on demand)',
                'Very Low\n(single DB write)',
                'Very High\n(query followees)',
                'Low\n(minimal storage)',
                'Read: Slow\nWrite: Fast',
                '• Write-heavy\n• Celebrities (1M+ followers)\n• Storage-constrained',
                '• Read-heavy apps\n• Fast timeline loads critical\n• High concurrent users'
              ],
              [
                'Hybrid\n(fan-out for normal, query for celebrities)',
                'Medium\n(conditional)',
                'Medium\n(conditional)',
                'Medium',
                'Read: Fast\nWrite: Medium',
                '• Mixed workload\n• Both normal users and celebrities\n• Twitter\'s solution',
                '• Simple systems\n• Uniform user distribution\n• Small scale'
              ]
            ]}
          />

          <Example title="Real Decision: Twitter Timeline (2012-2017 Evolution)">
            <P><Strong>Context:</Strong> 300M users, average 200 followers, but some celebrities have 50M+ followers</P>

            <P><Strong>Approach 1: Fan-Out-on-Write for Everyone (2012 design - failed)</Strong></P>
            <CodeBlock>
{`Implementation:
When user posts tweet:
  1. Write tweet to database
  2. For each follower → write tweet ID to their timeline cache (Redis)
  3. Done

When user reads timeline:
  1. Read from their pre-built timeline cache (instant!)

Example: Celebrity posts 1 tweet (50M followers):
  - Write to database: 1 operation
  - Write to 50M follower caches: 50M operations
  - Total: 50M+ operations per tweet!

Cost breakdown:
  - Redis cluster for 300M timelines: $500k/mo
  - Write amplification: 1 tweet → 50M cache writes
  - Write latency: 5-10 seconds for celebrity tweets
  - Lost posts: Some followers never get tweet (timeouts)

Problem encountered:
  - Justin Bieber tweets (50M followers)
  - System attempts 50M cache writes
  - Redis cluster overloaded
  - Write takes 30 seconds, many timeouts
  - 10% of followers never see tweet

Result: ❌ $500k/mo infrastructure, celebrity tweets still fail
Fan-out-on-write breaks at high follower counts`}
            </CodeBlock>

            <P><Strong>Approach 2: Fan-Out-on-Read for Everyone (considered but rejected)</Strong></P>
            <CodeBlock>
{`Implementation:
When user posts tweet:
  1. Write tweet to database
  2. Done (no fan-out)

When user reads timeline:
  1. Query: Get all users I follow (200 users)
  2. Query: Get latest tweets from those 200 users
  3. Merge and sort by timestamp
  4. Return timeline

Performance for 300M users reading timelines:
  - Each timeline load: 1 query to get followees + 200 queries for tweets
  - 300M users × 201 queries = 60 billion queries/hour
  - Database load: 16.7M queries/second
  - Cost: $2M/mo database cluster (100x current)

Latency:
  - 201 sequential queries: 2-5 seconds per timeline load
  - Users see "loading..." for 2-5 seconds
  - Unacceptable UX (target: <200ms)

Result: ❌ Saved $500k/mo on cache, spent $2M/mo on database
Timeline loads 10x-25x slower (2-5s vs 200ms)`}
            </CodeBlock>

            <P><Strong>Approach 3: Hybrid (2017 design - correct choice)</Strong></P>
            <CodeBlock>
{`Implementation:
When user posts tweet:
  - If user has <10k followers → Fan-Out-on-Write
    → Write to all follower caches (manageable)
  - If user has >10k followers → Fan-Out-on-Read
    → Only write to database, no cache writes

When user reads timeline:
  - Get pre-built timeline from cache (99% of users)
  - MERGE with recent tweets from celebrities they follow
    → Query database for tweets from followees with >10k followers
    → Merge with cached timeline
  - Return combined timeline

Cost breakdown:
  - Redis cluster: $200k/mo (smaller, only 99% of users)
  - Database cluster: $100k/mo (only celebrity queries)
  - Total: $300k/mo (40% cheaper than pure fan-out-on-write)

Performance:
  - Regular users: <200ms (cached)
  - Celebrity tweets: Instant write, appear in 1-2 seconds for followers
  - No timeouts, 100% delivery rate

Fan-out ratio impact:
  - 99% of users (normal): 200 cache writes per tweet (manageable)
  - 1% of users (celebrities): 0 cache writes per tweet
  - Average: 99% × 200 + 1% × 0 = 198 writes/tweet (vs 10k+ before)

Result: ✅ $300k/mo saves $200k/mo vs pure fan-out-on-write
100% delivery rate, <200ms timeline loads for 99% of users
Celebrities handled efficiently without overloading system`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Lesson:</Strong> Optimizing for the wrong load parameter (assuming uniform fan-out ratio)
              cost $200k/mo extra. Hybrid approach based on actual fan-out distribution saved $200k/mo.
            </KeyPoint>
          </Example>

          <Divider />

          <H1>🎯 Critical Trade-Off: Write-Heavy vs Read-Heavy System Design</H1>

          <ComparisonTable
            headers={['Optimization', 'Read Performance', 'Write Performance', 'Consistency', 'Cost', 'Best For']}
            rows={[
              [
                'Write-Optimized\n(append-only logs)',
                'Slower\n(scan needed)',
                'Very Fast\n(append only)',
                'Eventual',
                'Low\n(simple)',
                '• Event logging\n• Analytics\n• Audit trails\n• IoT sensors'
              ],
              [
                'Read-Optimized\n(indexes, caches)',
                'Very Fast\n(pre-built)',
                'Slower\n(update indexes)',
                'Strong',
                'High\n(indexes + cache)',
                '• E-commerce\n• Social feeds\n• Search\n• Dashboards'
              ],
              [
                'Balanced\n(CQRS pattern)',
                'Fast\n(read model)',
                'Fast\n(write model)',
                'Eventual\n(lag between)',
                'Very High\n(2 systems)',
                '• Complex domains\n• High read + write\n• Different models needed'
              ]
            ]}
          />

          <Example title="Real Decision: Analytics Platform Load Parameter Choice">
            <P><Strong>Context:</Strong> Analytics platform ingesting 1M events/second, serving 10k dashboard queries/second</P>

            <P><Strong>Scenario: Identify Key Load Parameter</Strong></P>

            <P><Strong>Option 1: Optimize for Read Speed (wrong for this write:read ratio)</Strong></P>
            <CodeBlock>
{`Design:
  - Pre-aggregate all possible metrics (write-time computation)
  - Store in OLAP database for fast queries
  - Every event write → update 100+ pre-aggregated tables

Cost per event:
  - 1 event → 100 index updates (write amplification)
  - 1M events/sec × 100 updates = 100M updates/second
  - Database: Columnar store (ClickHouse) with 100 tables
  - Infrastructure: $50k/mo (large cluster needed)

Write latency:
  - Updating 100 tables per event: 50-100ms
  - Queue backs up during traffic spikes
  - Some events dropped (>10s latency)

Read latency:
  - Pre-aggregated queries: 10-50ms (very fast!)
  - But only 10k queries/second (small compared to 1M writes/sec)

ROI analysis:
  - Cost: $50k/mo for fast reads
  - Benefit: 10k queries/sec are 10ms faster (vs 50ms)
  - Trade-off: 1M writes/sec are slow (50-100ms), some dropped

Result: ❌ Optimized for 10k queries/sec, degraded 1M writes/sec
Wrong load parameter prioritized (read vs write)`}
            </CodeBlock>

            <P><Strong>Option 2: Optimize for Write Speed (correct choice)</Strong></P>
            <CodeBlock>
{`Design:
  - Append-only log (Kafka) for event ingestion
  - Batch aggregation every 1 minute
  - Queries scan recent data + cached aggregates

Cost per event:
  - 1 event → 1 append operation (no write amplification)
  - 1M events/sec = 1M appends/second (manageable)
  - Kafka cluster: $10k/mo
  - ClickHouse for aggregates: $15k/mo
  - Total: $25k/mo (50% cheaper)

Write latency:
  - Append-only: 1-5ms (very fast!)
  - No queue backups
  - 0% events dropped

Read latency:
  - Cached aggregates (>1 min old): 10-50ms (fast)
  - Real-time queries (last 1 min): 100-500ms (slower but acceptable)
  - 90% of queries hit cache (fast)
  - 10% of queries scan recent data (slower)

Trade-off analysis:
  - Saved: $25k/mo infrastructure cost
  - Write performance: 1-5ms (10x faster than option 1)
  - Read performance: 90% fast (cache), 10% slow (real-time)
  - Acceptable: 1-minute delay for most analytics use cases

Result: ✅ Optimized for write-heavy workload (1M writes/sec >> 10k reads/sec)
Saved $25k/mo, 0% data loss, 90% of queries still fast`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Decision Framework:</Strong> Write:Read ratio = 100:1 (1M writes : 10k reads)
              → Optimize for writes (key load parameter)
              → Accept slightly slower reads (10% of queries 100-500ms vs 10ms)
              → Save $25k/mo + improve write reliability
            </KeyPoint>
          </Example>

          <Divider />

          <H1>🎯 Critical Trade-Off: Bandwidth vs Request Count Optimization</H1>

          <ComparisonTable
            headers={['System Type', 'Key Load Parameter', 'Wrong Optimization', 'Correct Optimization', 'Cost Impact']}
            rows={[
              [
                'Video Streaming\n(Netflix)',
                'Bandwidth\n(5-25 Mbps/stream)',
                'Optimize RPS\n(caching API responses)',
                'CDN for video delivery\n(reduce bandwidth cost)',
                'CDN saves $100k/mo\nvs optimizing API ($5k value)'
              ],
              [
                'API Service\n(Stripe)',
                'Request Count\n(100k RPS)',
                'Optimize bandwidth\n(compress responses)',
                'Horizontal scaling\n(handle more RPS)',
                'Scaling servers $20k/mo\nvs compression $2k value'
              ],
              [
                'Chat App\n(Slack)',
                'Concurrent Connections\n(1M WebSockets)',
                'Optimize messages/sec\n(caching)',
                'Connection pooling\n(handle more connections)',
                'Connection mgmt $30k/mo\nvs caching $5k value'
              ]
            ]}
          />

          <Example title="Real Decision: Video Streaming Platform Optimization">
            <P><Strong>Context:</Strong> Video platform with 1M concurrent viewers, 100k API requests/sec</P>

            <P><Strong>Wrong Priority: Optimize API Response Time</Strong></P>
            <CodeBlock>
{`Problem:
  - API p99 is 100ms (already excellent)
  - Team decides to optimize to p99 < 50ms
  - Adds Redis cache for API responses: $5k/mo
  - Result: API 50ms faster

Impact:
  - 100k API requests/sec now 50ms faster
  - User perception: No change (100ms → 50ms imperceptible)
  - Cost: $5k/mo
  - ROI: $0 (no user-visible improvement)

Meanwhile, actual bottleneck ignored:
  - Video bandwidth: 1M viewers × 10 Mbps = 10 Tbps
  - Direct from origin servers: $500k/mo bandwidth cost
  - Users buffering in peak hours (bandwidth constrained)

Result: ❌ Optimized wrong load parameter
Spent $5k/mo on imperceptible API improvement
Ignored $500k/mo bandwidth problem`}
            </CodeBlock>

            <P><Strong>Correct Priority: Optimize Bandwidth (CDN)</Strong></P>
            <CodeBlock>
{`Solution:
  - Deploy CDN (Cloudflare, Fastly) for video delivery
  - Cache video at edge locations near users
  - Origin servers only serve 10% of traffic (cache misses)

Cost:
  - CDN: $200k/mo (for 10 Tbps)
  - Origin bandwidth: $50k/mo (only 10% of traffic)
  - Total: $250k/mo

Savings:
  - Before: $500k/mo (direct from origin)
  - After: $250k/mo (CDN + reduced origin)
  - Saved: $250k/mo (50% reduction)

Performance improvement:
  - Latency: 200ms → 50ms (serve from nearby edge)
  - Buffering: 20% users → 2% users (10x reduction)
  - Quality: More users can stream 4K (more bandwidth available)

Result: ✅ Optimized correct load parameter (bandwidth)
Saved $250k/mo + improved user experience (less buffering)`}
            </CodeBlock>
          </Example>

          <H3>Decision Framework: Identifying Your Key Load Parameter</H3>
          <CodeBlock>
{`What creates the most work downstream?

├─ 1 user action → many writes (fan-out)?
│   └─ Examples: Social media post → 1M follower timelines
│   └─ Key metric: Fan-out ratio (followers/user)
│   └─ Optimization: Hybrid fan-out (write for <10k, read for >10k)
│
├─ High write volume vs read volume?
│   └─ Compare: Writes/sec vs Reads/sec
│   ├─ Write:Read > 10:1 → Optimize for writes
│   │   └─ Examples: Analytics, logging, IoT
│   │   └─ Design: Append-only logs, batch aggregation
│   │
│   └─ Write:Read < 1:10 → Optimize for reads
│       └─ Examples: E-commerce, social feeds, search
│       └─ Design: Indexes, caches, pre-computation
│
├─ Data transfer (bandwidth) > API calls?
│   └─ Examples: Video streaming, file storage, images
│   └─ Key metric: Bandwidth (Mbps/Tbps)
│   └─ Optimization: CDN, compression, edge caching
│
├─ Concurrent connections > request rate?
│   └─ Examples: Chat apps, gaming, real-time collaboration
│   └─ Key metric: Concurrent connections (WebSockets)
│   └─ Optimization: Connection pooling, multiplexing
│
└─ Query complexity > query count?
    └─ Examples: Search engines, analytics dashboards
    └─ Key metric: Data scanned per query
    └─ Optimization: Indexes, partitioning, pre-aggregation`}
          </CodeBlock>

          <H2>Common Mistakes</H2>

          <P>❌ <Strong>Mistake 1: Optimizing RPS for Video Streaming</Strong></P>
          <CodeBlock>
{`Problem:
  - Video platform optimizes API requests/sec
  - Spends $50k on autoscaling API servers
  - Bandwidth still bottlenecked at origin
  - Users still experience buffering

Fix: Optimize bandwidth with CDN ($200k/mo saves $250k/mo)`}
          </CodeBlock>

          <P>❌ <Strong>Mistake 2: Using Fan-Out-on-Write for Celebrities</Strong></P>
          <CodeBlock>
{`Problem:
  - Twitter's 2012 design: fan-out for everyone
  - Justin Bieber tweet → 50M cache writes
  - System overloaded, 10% of followers miss tweet
  - $500k/mo Redis cluster still insufficient

Fix: Hybrid approach (fan-out for <10k followers only)`}
          </CodeBlock>

          <P>❌ <Strong>Mistake 3: Write Optimization for Read-Heavy E-commerce</Strong></P>
          <CodeBlock>
{`Problem:
  - E-commerce site: 1M reads/sec, 10k writes/sec
  - Team optimizes write speed (append-only)
  - Read queries slow (no indexes)
  - Page load time: 2 seconds (vs target 200ms)
  - Conversion rate drops 5%

Fix: Optimize for reads (key load parameter)
Index product catalog, cache search results`}
          </CodeBlock>

          <P>❌ <Strong>Mistake 4: Ignoring Query Complexity for Analytics</Strong></P>
          <CodeBlock>
{`Problem:
  - Analytics platform: 1k queries/sec
  - Team says "only 1k queries, easy to handle"
  - Each query scans 1TB of data (high complexity)
  - Database overloaded: 1k queries × 1TB = 1 PB scanned/sec
  - Queries timeout, users frustrated

Fix: Recognize query complexity as key load parameter
Pre-aggregate data, use columnar storage (ClickHouse)`}
          </CodeBlock>
        </Section>
      ),
    },
    {
      id: 'takeaways',
      type: 'concept',
      title: 'Key Takeaways',
      content: (
        <Section>
          <H1>Key Takeaways</H1>

          <UL>
            <LI>
              <Strong>Different systems have different key load parameters.</Strong> Don't assume RPS is always the bottleneck.
            </LI>
            <LI>
              <Strong>Look for amplification.</Strong> Operations that create many downstream operations are often the real bottleneck.
            </LI>
            <LI>
              <Strong>Measure what matters.</Strong> The obvious metric might not be the one that impacts performance.
            </LI>
            <LI>
              <Strong>Design for your key load parameter.</Strong> Once you identify it, optimize your architecture for that specific parameter.
            </LI>
          </UL>

          <H2>Common Mistakes</H2>

          <UL>
            <LI>❌ Assuming RPS is always the most important metric</LI>
            <LI>❌ Not considering fan-out or amplification effects</LI>
            <LI>❌ Measuring the wrong thing (e.g., API calls instead of database queries)</LI>
            <LI>❌ Ignoring query complexity in favor of simple request counts</LI>
          </UL>

          <H2>Best Practices</H2>

          <UL>
            <LI>✅ Understand your system's behavior end-to-end</LI>
            <LI>✅ Identify operations that create amplification</LI>
            <LI>✅ Measure the metrics that actually impact performance</LI>
            <LI>✅ Design your architecture around your key load parameter</LI>
          </UL>
        </Section>
      ),
    },
  ],
};

