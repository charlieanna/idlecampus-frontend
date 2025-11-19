import type { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, LI, OL, Section, 
  KeyPoint, Example, Divider, ComparisonTable
} from '../../../ui/components/LessonContent';

export const capacityPlanningLesson: SystemDesignLesson = {
  id: 'sd-capacity-planning',
  slug: 'understanding-scale',
  title: 'Understanding Scale',
  description: 'Learn how to estimate capacity requirements, understand RPS, latency, and throughput',
  difficulty: 'beginner',
  estimatedMinutes: 25,
  category: 'fundamentals',
  tags: ['capacity', 'scaling', 'metrics', 'rps'],
  prerequisites: ['basic-components'],
  learningObjectives: [
    'Understand RPS, latency, and throughput',
    'Learn to estimate capacity requirements',
    'Calculate infrastructure needs',
    'Understand trade-offs in capacity planning',
  ],
  conceptsCovered: [
    {
      id: 'rps',
      name: 'Requests Per Second',
      type: 'metric',
      difficulty: 1,
      description: 'Number of requests a system handles per second',
    },
    {
      id: 'latency',
      name: 'Latency',
      type: 'metric',
      difficulty: 2,
      description: 'Time for a request to complete',
    },
    {
      id: 'throughput',
      name: 'Throughput',
      type: 'metric',
      difficulty: 2,
      description: 'Total data processed per unit time',
    },
  ],
  relatedChallenges: ['tiny-url', 'food-blog'],
  stages: [
    {
      id: 'scale-rps',
      type: 'concept',
      title: 'Requests Per Second (RPS)',
      description: 'Understanding RPS',
      estimatedMinutes: 8,
      content: (
        <Section>
          <H1>Requests Per Second (RPS)</H1>
          
          <P><Strong>RPS</Strong> measures how many requests your system handles per second.</P>

          <H2>Why RPS Matters</H2>

          <UL>
            <LI><Strong>Capacity planning:</Strong> How many servers do you need?</LI>
            <LI><Strong>Load testing:</Strong> Can your system handle peak traffic?</LI>
            <LI><Strong>Cost estimation:</Strong> More RPS = more infrastructure = more cost</LI>
          </UL>

          <H2>Calculating RPS</H2>

          <Example title="Example: URL Shortener">
            <P><Strong>Assumptions:</Strong></P>
            <UL>
              <LI>100 million URLs created per day</LI>
              <LI>10 billion redirects per day (100:1 read-to-write ratio)</LI>
              <LI>Peak traffic is 2x average</LI>
            </UL>

            <P><Strong>Calculations:</Strong></P>
            <CodeBlock>
{`Writes: 100M / 86400 seconds = ~1,200 writes/second
Reads: 10B / 86400 seconds = ~115,000 reads/second
Peak writes: 1,200 × 2 = 2,400 writes/second
Peak reads: 115,000 × 2 = 230,000 reads/second`}
            </CodeBlock>
          </Example>

          <H2>Read vs Write RPS</H2>

          <UL>
            <LI><Strong>Read RPS:</Strong> How many read requests per second</LI>
            <LI><Strong>Write RPS:</Strong> How many write requests per second</LI>
            <LI><Strong>Total RPS:</Strong> Read RPS + Write RPS</LI>
          </UL>

          <P>Different components handle different types:</P>

          <UL>
            <LI><Strong>Database:</Strong> Handles both reads and writes</LI>
            <LI><Strong>Cache:</Strong> Primarily reads (cache hits)</LI>
            <LI><Strong>CDN:</Strong> Primarily reads (static content)</LI>
          </UL>

          <H2>Real-World Examples</H2>

          <ComparisonTable
            headers={['App Size', 'RPS Range']}
            rows={[
              ['Small app', '10-100 RPS'],
              ['Medium app', '1,000-10,000 RPS'],
              ['Large app', '100,000+ RPS'],
              ['Google', 'Millions of RPS'],
            ]}
          />

          <H2>Planning for RPS</H2>

          <OL>
            <LI><Strong>Estimate average RPS</Strong> from user base</LI>
            <LI><Strong>Calculate peak RPS</Strong> (usually 2-5x average)</LI>
            <LI><Strong>Add headroom</Strong> (20-50% buffer)</LI>
            <LI><Strong>Design for peak</Strong> to avoid failures</LI>
          </OL>
        </Section>
      ),
      keyPoints: [
        'RPS measures request volume',
        'Separate read and write RPS for capacity planning',
        'Design for peak traffic, not average',
      ],
    },
    {
      id: 'scale-latency',
      type: 'concept',
      title: 'Latency',
      description: 'Understanding latency',
      estimatedMinutes: 7,
      content: (
        <Section>
          <H1>Latency</H1>
          
          <P><Strong>Latency</Strong> is the time it takes for a request to complete.</P>

          <H2>Why Latency Matters</H2>

          <UL>
            <LI><Strong>User experience:</Strong> Slow = frustrated users</LI>
            <LI><Strong>Business impact:</Strong> 100ms delay = 1% sales drop (Amazon study)</LI>
            <LI><Strong>System health:</Strong> High latency = overloaded system</LI>
          </UL>

          <H2>Measuring Latency</H2>

          <UL>
            <LI><Strong>p50 (median):</Strong> Half of requests faster, half slower</LI>
            <LI><Strong>p95:</Strong> 95% of requests are faster</LI>
            <LI><Strong>p99:</Strong> 99% of requests are faster (worst-case)</LI>
          </UL>

          <Example title="Example Latency Distribution">
            <CodeBlock>
{`p50: 50ms   (typical user experience)
p95: 200ms  (most users)
p99: 500ms  (worst-case, but still acceptable)`}
            </CodeBlock>
          </Example>

          <H2>Latency Sources</H2>

          <OL>
            <LI><Strong>Network:</Strong> 10-100ms (depends on distance)</LI>
            <LI><Strong>Application processing:</Strong> 10-50ms</LI>
            <LI><Strong>Database query:</Strong> 5-100ms (depends on query complexity)</LI>
            <LI><Strong>Cache lookup:</Strong> 1-5ms (very fast!)</LI>
          </OL>

          <P><Strong>Total latency</Strong> = sum of all sources</P>

          <H2>Latency Requirements</H2>

          <ComparisonTable
            headers={['Use Case', 'Target Latency']}
            rows={[
              ['Real-time chat', '< 100ms'],
              ['Web page load', '< 1 second'],
              ['API response', '< 200ms (p95)'],
              ['Search results', '< 500ms'],
              ['Background jobs', 'Can be slower'],
            ]}
          />

          <H2>Reducing Latency</H2>

          <UL>
            <LI><Strong>Caching:</Strong> Store frequently accessed data</LI>
            <LI><Strong>CDN:</Strong> Serve static content from edge locations</LI>
            <LI><Strong>Database optimization:</Strong> Indexes, query optimization</LI>
            <LI><Strong>Connection pooling:</Strong> Reuse database connections</LI>
            <LI><Strong>Async processing:</Strong> Don't block on non-critical operations</LI>
          </UL>
        </Section>
      ),
      keyPoints: [
        'Latency directly impacts user experience',
        'Measure p50, p95, p99 for different perspectives',
        'Caching and CDNs significantly reduce latency',
      ],
    },
    {
      id: 'scale-throughput',
      type: 'concept',
      title: 'Throughput',
      description: 'Understanding throughput',
      estimatedMinutes: 5,
      content: (
        <Section>
          <H1>Throughput</H1>
          
          <P><Strong>Throughput</Strong> measures total data processed per unit time.</P>

          <H2>Throughput vs RPS</H2>

          <UL>
            <LI><Strong>RPS:</Strong> Number of requests (count)</LI>
            <LI><Strong>Throughput:</Strong> Amount of data (bytes/second)</LI>
          </UL>

          <Example title="Same Throughput, Different RPS">
            <CodeBlock>
{`1000 RPS × 1KB per request = 1MB/second throughput
100 RPS × 10KB per request = 1MB/second throughput

Same throughput, different RPS!`}
            </CodeBlock>
          </Example>

          <H2>When Throughput Matters</H2>

          <UL>
            <LI><Strong>Video streaming:</Strong> High throughput (MB/s per user)</LI>
            <LI><Strong>File uploads:</Strong> Throughput limited by bandwidth</LI>
            <LI><Strong>Data processing:</Strong> Batch jobs process large datasets</LI>
            <LI><Strong>CDN/S3:</Strong> Bandwidth costs based on throughput</LI>
          </UL>

          <H2>Calculating Throughput</H2>

          <P><Strong>Formula:</Strong></P>
          <CodeBlock>
{`Throughput = RPS × Average Response Size`}
          </CodeBlock>

          <Example title="Example Calculation">
            <CodeBlock>
{`10,000 RPS
Average response: 50KB
Throughput: 10,000 × 50KB = 500MB/second = 4Gbps`}
            </CodeBlock>
          </Example>

          <H2>Bandwidth Considerations</H2>

          <UL>
            <LI><Strong>Client bandwidth:</Strong> Users have limited upload/download</LI>
            <LI><Strong>Server bandwidth:</Strong> Must handle aggregate throughput</LI>
            <LI><Strong>CDN bandwidth:</Strong> Distributes load across edge locations</LI>
            <LI><Strong>Database bandwidth:</Strong> Usually not a bottleneck (local network)</LI>
          </UL>

          <H2>Cost Impact</H2>

          <UL>
            <LI><Strong>CDN costs:</Strong> Based on data transfer (throughput)</LI>
            <LI><Strong>S3 costs:</Strong> Based on data transfer out</LI>
            <LI><Strong>Bandwidth costs:</Strong> Can be significant at scale</LI>
          </UL>
        </Section>
      ),
      keyPoints: [
        'Throughput measures data volume, not request count',
        'Important for media-heavy applications',
        'Bandwidth costs scale with throughput',
      ],
    },
    {
      id: 'scale-capacity',
      type: 'concept',
      title: 'Capacity Planning',
      description: 'How to plan capacity',
      estimatedMinutes: 5,
      content: (
        <Section>
          <H1>Capacity Planning</H1>
          
          <P><Strong>Capacity planning</Strong> is estimating infrastructure needs to handle expected load.</P>

          <H2>Steps for Capacity Planning</H2>

          <H3>1. Estimate Traffic</H3>

          <UL>
            <LI><Strong>Daily active users:</Strong> How many users?</LI>
            <LI><Strong>Requests per user:</Strong> How many requests per user per day?</LI>
            <LI><Strong>Peak factor:</Strong> 2-5x average (traffic spikes)</LI>
          </UL>

          <Example title="Example Calculation">
            <CodeBlock>
{`1M daily active users
10 requests per user per day
Peak factor: 3x

Average: 1M × 10 / 86400 = ~116 RPS
Peak: 116 × 3 = 348 RPS`}
            </CodeBlock>
          </Example>

          <H3>2. Calculate Component Capacity</H3>

          <P><Strong>App Servers:</Strong></P>
          <CodeBlock>
{`Each instance: 1000 RPS (commodity hardware)
Required: 348 / 1000 = 1 instance (round up)
With 50% headroom: 2 instances`}
          </CodeBlock>

          <P><Strong>Database:</Strong></P>
          <CodeBlock>
{`Read capacity: 348 RPS × 0.9 (90% reads) = 313 read RPS
Write capacity: 348 RPS × 0.1 (10% writes) = 35 write RPS
Single-leader: 3000 read, 300 write RPS capacity
Sufficient with 1 database`}
          </CodeBlock>

          <H3>3. Add Redundancy</H3>

          <UL>
            <LI><Strong>Minimum 2 instances</Strong> for high availability</LI>
            <LI>If one fails, other handles traffic</LI>
            <LI><Strong>2 app servers, 1 database</Strong> (with replication for HA)</LI>
          </UL>

          <H3>4. Plan for Growth</H3>

          <UL>
            <LI><Strong>2-3x headroom</Strong> for traffic growth</LI>
            <LI><Strong>Horizontal scaling</Strong> ready (add more instances)</LI>
            <LI><Strong>Monitor</Strong> actual usage and adjust</LI>
          </UL>

          <H2>Common Mistakes</H2>

          <ComparisonTable
            headers={['Mistake', 'Problem', 'Solution']}
            rows={[
              ['Under-provisioning', 'Too few resources = failures', 'Right-size for actual needs'],
              ['Over-provisioning', 'Too many resources = wasted cost', 'Start small, scale up'],
              ['Ignoring peak', 'Designing for average, not peak', 'Design for worst-case'],
              ['No headroom', 'No buffer for traffic spikes', 'Add 20-50% buffer'],
            ]}
          />
        </Section>
      ),
      keyPoints: [
        'Estimate traffic, calculate capacity, add redundancy',
        'Design for peak traffic, not average',
        'Start small and scale up based on actual usage',
      ],
    },
    {
      id: 'scale-practice',
      type: 'practice',
      title: 'Practice: Calculate Capacity',
      description: 'Calculate capacity for a scenario',
      estimatedMinutes: 5,
      problem: `## Scenario: Social Media Feed

A social media platform has:
- 10 million daily active users
- Each user views 50 posts per day (reads)
- Each user creates 2 posts per day (writes)
- Peak traffic is 4x average

**Questions:**
1. What is the average read RPS?
2. What is the average write RPS?
3. What is the peak read RPS?
4. How many app server instances are needed? (Assume 1000 RPS per instance)
5. How many database replicas are needed? (Assume 3000 read RPS per replica, 300 write RPS per leader)

**Hints:**
- Calculate daily requests first
- Divide by seconds per day (86400)
- Multiply by peak factor
- Divide by capacity per instance/replica`,
      validation: {
        type: 'free_form',
        checker: 'capacity_calculator',
      },
      hints: [
        'Start by calculating total daily reads and writes',
        'Convert to RPS by dividing by 86400 seconds',
        'Multiply by peak factor (4x)',
        'Divide by capacity per component',
      ],
    },
  ],
  nextLessons: ['caching-strategies'],
};

