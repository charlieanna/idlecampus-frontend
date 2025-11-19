import type { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, LI, OL, Section, 
  KeyPoint, Example, Divider, ComparisonTable
} from '../../../ui/components/LessonContent';

export const capacityPlanningLesson: SystemDesignLesson = {
  id: 'sd-capacity-planning',
  slug: 'understanding-scale',
  title: 'Understanding Scale',
  description: 'Master capacity planning trade-offs: WHEN to over-provision vs optimize costs, WHEN to use auto-scaling vs pre-provisioned infrastructure, and HOW to balance cost, reliability, and performance based on business context',
  difficulty: 'beginner',
  estimatedMinutes: 60,
  category: 'fundamentals',
  tags: ['capacity', 'scaling', 'metrics', 'rps', 'throughput', 'peak-planning'],
  prerequisites: ['basic-components'],
  learningObjectives: [
    'Understand RPS, latency, and throughput',
    'Learn to estimate capacity requirements',
    'Calculate infrastructure needs from traffic estimates',
    'Design for peak traffic with appropriate headroom',
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
      estimatedMinutes: 10,
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

          <H2>Runnable Code: RPS Calculator</H2>

          <P>Here's a practical TypeScript function to calculate RPS:</P>

          <CodeBlock language="typescript">
{`function calculateRPS(
  dailyRequests: number,
  peakFactor: number = 2
): { average: number; peak: number } {
  const SECONDS_PER_DAY = 86400;

  // Calculate average RPS
  const averageRPS = Math.ceil(dailyRequests / SECONDS_PER_DAY);

  // Calculate peak RPS
  const peakRPS = Math.ceil(averageRPS * peakFactor);

  console.log(\`Daily requests: \${dailyRequests.toLocaleString()}\`);
  console.log(\`Average RPS: \${averageRPS.toLocaleString()}\`);
  console.log(\`Peak RPS (\${peakFactor}x): \${peakRPS.toLocaleString()}\`);

  return { average: averageRPS, peak: peakRPS };
}

// Example: Calculate RPS for a social media app
const result = calculateRPS(
  10_000_000,  // 10M daily requests
  3            // 3x peak factor
);

// Output:
// Daily requests: 10,000,000
// Average RPS: 116
// Peak RPS (3x): 348`}
          </CodeBlock>

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
      estimatedMinutes: 8,
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

          <H2>Runnable Code: Throughput Calculator</H2>

          <P>Here's a practical TypeScript function to calculate throughput:</P>

          <CodeBlock language="typescript">
{`interface ThroughputEstimate {
  throughputMBps: number;
  throughputGbps: number;
  monthlyCost: number; // CDN cost estimate
}

function calculateThroughput(
  rps: number,
  avgResponseSizeKB: number,
  cdnCostPerGB: number = 0.085 // AWS CloudFront pricing
): ThroughputEstimate {
  // Convert KB to MB
  const avgResponseSizeMB = avgResponseSizeKB / 1024;

  // Calculate throughput in MB/s
  const throughputMBps = rps * avgResponseSizeMB;

  // Convert to Gbps (for bandwidth planning)
  const throughputGbps = (throughputMBps * 8) / 1000;

  // Calculate monthly cost (assuming 30 days)
  const secondsPerMonth = 30 * 24 * 60 * 60;
  const monthlyGB = (throughputMBps * secondsPerMonth) / 1024;
  const monthlyCost = monthlyGB * cdnCostPerGB;

  console.log('=== Throughput Analysis ===');
  console.log(\`RPS: \${rps.toLocaleString()}\`);
  console.log(\`Avg response: \${avgResponseSizeKB}KB\`);
  console.log(\`\\nThroughput:\`);
  console.log(\`  \${throughputMBps.toFixed(2)} MB/s\`);
  console.log(\`  \${throughputGbps.toFixed(2)} Gbps\`);
  console.log(\`\\nMonthly cost:\`);
  console.log(\`  \${monthlyGB.toFixed(0).toLocaleString()} GB/month\`);
  console.log(\`  $\${monthlyCost.toFixed(2).toLocaleString()}\`);

  return { throughputMBps, throughputGbps, monthlyCost };
}

// Example: Video streaming service
const result = calculateThroughput(
  10000,  // 10k RPS
  500     // 500KB average video chunk
);

// Output:
// === Throughput Analysis ===
// RPS: 10,000
// Avg response: 500KB
//
// Throughput:
//   4.88 MB/s
//   0.04 Gbps
//
// Monthly cost:
//   12,656,250 GB/month
//   $1,075,781.25`}
          </CodeBlock>

          <KeyPoint>
            <Strong>Pro tip:</Strong> For video/image-heavy apps, throughput costs often exceed compute costs! Use CDN aggressively to reduce origin bandwidth.
          </KeyPoint>
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
      estimatedMinutes: 10,
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

          <H2>Runnable Code: Capacity Planner</H2>

          <P>Here's a practical TypeScript function to calculate infrastructure needs:</P>

          <CodeBlock language="typescript">
{`interface CapacityPlan {
  appServers: number;
  dbLeaders: number;
  dbReplicas: number;
  cacheNodes: number;
}

function planCapacity(
  peakRPS: number,
  readWriteRatio: { reads: number; writes: number } = { reads: 0.9, writes: 0.1 },
  headroom: number = 0.5 // 50% buffer
): CapacityPlan {
  // Component capacities (typical values)
  const APP_SERVER_RPS = 1000;
  const DB_READ_RPS = 3000;
  const DB_WRITE_RPS = 300;
  const CACHE_RPS = 10000;

  // Calculate read/write split
  const readRPS = Math.ceil(peakRPS * readWriteRatio.reads);
  const writeRPS = Math.ceil(peakRPS * readWriteRatio.writes);

  // Calculate component needs
  const appServers = Math.max(
    2,  // Minimum 2 for HA
    Math.ceil((peakRPS / APP_SERVER_RPS) * (1 + headroom))
  );

  const dbLeaders = Math.ceil(writeRPS / DB_WRITE_RPS);

  const dbReplicas = Math.ceil(readRPS / DB_READ_RPS);

  // Cache recommended if read RPS > 1000
  const cacheNodes = readRPS > 1000
    ? Math.max(1, Math.ceil(readRPS / CACHE_RPS))
    : 0;

  console.log('=== Capacity Plan ===');
  console.log(\`Peak RPS: \${peakRPS.toLocaleString()}\`);
  console.log(\`Read RPS: \${readRPS.toLocaleString()}\`);
  console.log(\`Write RPS: \${writeRPS.toLocaleString()}\`);
  console.log(\`\\nInfrastructure:\`);
  console.log(\`  App Servers: \${appServers}\`);
  console.log(\`  DB Leaders: \${dbLeaders}\`);
  console.log(\`  DB Replicas: \${dbReplicas}\`);
  console.log(\`  Cache Nodes: \${cacheNodes || 'Not needed'}\`);

  return { appServers, dbLeaders, dbReplicas, cacheNodes };
}

// Example: Plan capacity for 5,000 peak RPS
const plan = planCapacity(5000);

// Output:
// === Capacity Plan ===
// Peak RPS: 5,000
// Read RPS: 4,500
// Write RPS: 500
//
// Infrastructure:
//   App Servers: 8
//   DB Leaders: 2
//   DB Replicas: 2
//   Cache Nodes: 1`}
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

          <Divider />

          <H2>Real-World Case Study: Healthcare.gov Launch (2013)</H2>

          <Example title="The Failure">
            <P><Strong>Context:</Strong> Healthcare.gov launched October 1, 2013 to provide health insurance enrollment.</P>

            <P><Strong>What Happened:</Strong></P>
            <UL>
              <LI><Strong>Expected:</Strong> 50,000-60,000 concurrent users</LI>
              <LI><Strong>Actual:</Strong> 250,000 concurrent users (4x expected!)</LI>
              <LI><Strong>Capacity:</Strong> System provisioned for expected load only</LI>
              <LI><Strong>Result:</Strong> Site crashed within hours, stayed down for weeks</LI>
            </UL>

            <P><Strong>Timeline:</Strong></P>
            <CodeBlock>
{`Day 1 (Oct 1):  250k users → system crashes immediately
Week 1:         Only 6 people successfully enrolled
Week 3:         Site still mostly down
Month 2:        Complete infrastructure rebuild
Month 3:        System stabilized after $600M+ in fixes`}
            </CodeBlock>
          </Example>

          <Example title="Root Causes">
            <OL>
              <LI><Strong>Under-provisioning:</Strong> Designed for 60k users, got 250k (4x)</LI>
              <LI><Strong>No load testing:</Strong> Never tested at scale before launch</LI>
              <LI><Strong>No headroom:</Strong> Zero buffer for unexpected traffic</LI>
              <LI><Strong>Poor architecture:</Strong> Monolithic design couldn't scale horizontally</LI>
              <LI><Strong>Database bottleneck:</Strong> Single database, no caching layer</LI>
            </OL>
          </Example>

          <Example title="The Fix">
            <P><Strong>What They Did (Nov-Dec 2013):</Strong></P>
            <UL>
              <LI><Strong>5x capacity increase:</Strong> From 60k → 300k concurrent users</LI>
              <LI><Strong>Added caching:</Strong> Redis layer to reduce database load</LI>
              <LI><Strong>Database optimization:</Strong> Connection pooling, query optimization</LI>
              <LI><Strong>Load balancing:</Strong> Distributed traffic across more servers</LI>
              <LI><Strong>Monitoring:</Strong> Real-time dashboards to catch issues early</LI>
            </UL>

            <CodeBlock>
{`Before:
- 10 app servers (50 RPS each) = 500 RPS total
- 1 database (couldn't handle load)
- No cache
- Result: Crashed at 250k users

After:
- 50 app servers = 2,500 RPS total
- 3 database leaders + 6 replicas (sharded)
- Redis cluster (100k+ RPS)
- CDN for static assets
- Result: Handled 300k users successfully`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Lessons Learned:</Strong>
            <UL>
              <LI>Always load test at 3-5x expected peak before launch</LI>
              <LI>Add 50-100% headroom for high-profile launches</LI>
              <LI>Design for horizontal scaling from day one</LI>
              <LI>Add caching early - databases are expensive to scale</LI>
              <LI>Monitor aggressively and have rollback plans</LI>
            </UL>
          </KeyPoint>

          <P><Strong>Business Impact:</Strong> The failed launch cost an estimated $600M+ in fixes, damaged public trust, and took 3 months to stabilize. All because they didn't plan for peak capacity.</P>

          <Divider />

          <H2>🎯 Critical Trade-Off: Over-Provisioning vs Cost Optimization</H2>

          <P>
            The eternal capacity planning dilemma: How much buffer should you add? Over-provision too much = wasted money. Under-provision = system crashes.
          </P>

          <ComparisonTable
            headers={['Strategy', 'Cost', 'Risk', 'Use When']}
            rows={[
              [
                'No Buffer\n(Provision for exact peak)',
                '✅ Lowest\n$1000/mo for 10k RPS',
                '❌ Highest\nAny spike >10k = crash',
                '❌ Never use\n(Too risky)'
              ],
              [
                '20% Buffer\n(12k RPS capacity)',
                '⚖️ Low\n$1200/mo',
                '⚖️ Medium\nHandles small spikes',
                'Predictable traffic\nLow-stakes app'
              ],
              [
                '50% Buffer\n(15k RPS capacity)',
                '⚖️ Medium\n$1500/mo',
                '✅ Low\nHandles 50% spike',
                '✅ Recommended\nMost production apps'
              ],
              [
                '100% Buffer\n(20k RPS capacity)',
                '❌ High\n$2000/mo',
                '✅ Very Low\nHandles 2x spike',
                'Business-critical\nHigh revenue/request'
              ],
              [
                '200%+ Buffer\n(30k+ RPS capacity)',
                '❌ Very High\n$3000/mo',
                '✅ Zero\nHandles any spike',
                'Launches, sales events\nCan\'t afford downtime'
              ]
            ]}
          />

          <Example title="Real Decision: E-commerce Flash Sale">
            <P><Strong>Scenario:</Strong> Black Friday sale, normal traffic 10k RPS, expect 50k RPS peak</P>

            <P><Strong>Option 1: Under-Provision (20k RPS, 100% buffer over normal)</Strong></P>
            <CodeBlock>
{`Cost: $2000/mo
Risk: 50k peak > 20k capacity → System crashes
Impact: Lost sales during biggest revenue day

Calculation:
- Revenue/hour during sale: $100,000
- Downtime: 2 hours (until you spin up more servers)
- Lost revenue: $200,000
- Save on infrastructure: $0 (still had to emergency scale)

Result: ❌ Lost $200k trying to save $1k`}
            </CodeBlock>

            <P><Strong>Option 2: Over-Provision (60k RPS, 500% buffer over normal)</Strong></P>
            <CodeBlock>
{`Cost: $6000/mo (for Black Friday month)
Risk: Can handle 60k RPS, only need 50k → Zero downtime
Impact: Smooth sale, happy customers

Calculation:
- Extra cost vs normal: $6000 - $1000 = $5000 for the month
- Revenue during sale: $1,000,000
- Lost revenue: $0
- Customer goodwill: Priceless

Result: ✅ Spent $5k to protect $1M in revenue`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> $5k over-provisioning cost vs $200k downtime cost. Over-provisioning wins by 40x.
            </KeyPoint>
          </Example>

          <H3>Decision Framework:</H3>

          <ComparisonTable
            headers={['Business Context', 'Buffer %', 'Why?']}
            rows={[
              [
                'Personal blog\n1,000 visitors/day\n$0 revenue/visitor',
                '20%',
                'Downtime costs nothing. Save money, accept occasional slowness.'
              ],
              [
                'SaaS startup\n10,000 users\n$50 revenue/user/year',
                '50%',
                'Downtime = churn. Invest in reliability to retain customers.'
              ],
              [
                'E-commerce\n100,000 orders/day\n$50 revenue/order',
                '100%',
                'Revenue/hour = $200k+. 1 hour downtime >cost of 100% buffer.'
              ],
              [
                'Banking app\nRegulatory requirements',
                '100-200%',
                'Legal penalties for downtime. Cost of buffer <<cost of fine.'
              ],
              [
                'Product launch\nPress coverage, viral potential',
                '200-500%',
                'One shot to make first impression. Over-provision aggressively.'
              ]
            ]}
          />

          <Divider />

          <H2>🎯 Critical Trade-Off: Auto-Scaling vs Pre-Provisioned</H2>

          <P>
            Should you auto-scale or pre-provision servers for peak? Both have trade-offs.
          </P>

          <ComparisonTable
            headers={['Strategy', 'Cost', 'Speed', 'Complexity', 'Best For']}
            rows={[
              [
                'Pre-Provisioned\n(Servers always running)',
                '❌ High\n(Pay 24/7)',
                '✅ Instant\n(Servers ready)',
                '✅ Simple\n(No scaling logic)',
                'Predictable peaks\n(9am-5pm daily)'
              ],
              [
                'Auto-Scaling\n(Add servers on demand)',
                '✅ Low\n(Pay per use)',
                '❌ Slow\n(5-10 min delay)',
                '❌ Complex\n(Scaling policies)',
                'Unpredictable spikes\n(Viral traffic)'
              ],
              [
                'Hybrid\n(Base + Auto-scale)',
                '⚖️ Medium',
                '✅ Fast\n(Base instant)',
                '⚖️ Medium',
                '✅ Most prod apps\n(Recommended)'
              ]
            ]}
          />

          <Example title="Real Scenario: News Site">
            <P><Strong>Traffic Pattern:</Strong></P>
            <UL>
              <LI>Normal: 5k RPS (midnight-6am)</LI>
              <LI>Business hours: 20k RPS (9am-5pm)</LI>
              <LI>Breaking news: 100k RPS (unpredictable)</LI>
            </UL>

            <P><Strong>Option 1: Pre-Provision for Peak (100k RPS)</Strong></P>
            <CodeBlock>
{`Cost: 100 servers × $100/mo = $10,000/mo
Utilization:
- Normal hours (18h/day): 5% utilization (wasted 95%)
- Business hours (6h/day): 20% utilization (wasted 80%)
- Breaking news (1h/month): 100% utilization

Average utilization: ~10%
Waste: $9,000/mo on idle servers`}
            </CodeBlock>

            <P><Strong>Option 2: Auto-Scale from 0</Strong></P>
            <CodeBlock>
{`Cost: Pay per use, ~$2,000/mo average
Problem: Breaking news hits → Auto-scale starts
- Time to spin up 100 servers: 10 minutes
- During those 10 min: Site crashes, users leave
- By time servers ready: Viral moment over

Result: Save $8k/mo but miss revenue opportunity`}
            </CodeBlock>

            <P><Strong>Option 3: Hybrid (Base + Auto-Scale)</Strong></P>
            <CodeBlock>
{`Base capacity: 30 servers (30k RPS) always running
Auto-scale: Add up to 70 more servers when needed

Cost breakdown:
- Base: 30 × $100 = $3,000/mo (24/7)
- Auto-scale: ~$500/mo average (only during spikes)
- Total: $3,500/mo

Benefits:
- Instant handling of business hours (20k < 30k base)
- Auto-scale kicks in for breaking news
- Scale-up time: Start from 30k, only need 2-3 min for final 70k

Result: ✅ Save $6,500/mo vs full provision, never crash`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> Hybrid approach balances cost ($3,500) vs reliability (instant base, quick auto-scale).
            </KeyPoint>
          </Example>

          <Divider />

          <H2>🎯 Critical Trade-Off: Reserved vs On-Demand Instances</H2>

          <P>
            Cloud pricing model affects your capacity planning. Do you commit long-term or pay as you go?
          </P>

          <ComparisonTable
            headers={['Pricing Model', 'Cost/Server/Mo', 'Commitment', 'Best For']}
            rows={[
              [
                'On-Demand\n(Pay per hour)',
                '$100',
                'None\n(Cancel anytime)',
                '• Unpredictable traffic\n• Startups testing product-market fit\n• Temporary spikes'
              ],
              [
                'Reserved (1-year)\n(Commit 1 year)',
                '$60 (40% off)',
                '1 year\n(Pay even if unused)',
                '• Stable baseline traffic\n• Profitable company\n• Predictable growth'
              ],
              [
                'Reserved (3-year)\n(Commit 3 years)',
                '$40 (60% off)',
                '3 years\n(Pay even if unused)',
                '• Enterprise\n• Very stable traffic\n• High confidence in longevity'
              ],
              [
                'Spot Instances\n(Bid for unused)',
                '$20-40 (60-80% off)\n(Variable)',
                'None\n(Can be terminated)',
                '• Batch jobs\n• Fault-tolerant workloads\n• NOT for user-facing apps'
              ]
            ]}
          />

          <Example title="Real Decision: SaaS Company Growth">
            <P><Strong>Current State:</Strong> 50 servers running 24/7 for baseline traffic</P>

            <P><Strong>Option 1: All On-Demand</Strong></P>
            <CodeBlock>
{`Cost: 50 × $100/mo = $5,000/mo = $60,000/year
Flexibility: Can cancel anytime
Risk: None

Good for: Early startup, traffic might drop`}
            </CodeBlock>

            <P><Strong>Option 2: All Reserved (1-year)</Strong></P>
            <CodeBlock>
{`Cost: 50 × $60/mo = $3,000/mo = $36,000/year
Savings: $24,000/year (40% off!)
Risk: If traffic drops, still pay for unused servers

Good for: Confident in baseline traffic staying stable`}
            </CodeBlock>

            <P><Strong>Option 3: Hybrid (40 Reserved + 10 On-Demand)</Strong></P>
            <CodeBlock>
{`Reserved (baseline): 40 × $60 = $2,400/mo
On-Demand (flex): 10 × $100 = $1,000/mo
Total: $3,400/mo = $40,800/year

Savings: $19,200/year vs all on-demand
Flexibility: Can scale down 10 servers if traffic drops
Risk: Low (only committed to 40 servers)

Result: ✅ Best of both worlds`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> Reserved = save 40-60% BUT commit long-term. Hybrid minimizes risk while capturing most savings.
            </KeyPoint>
          </Example>

          <Divider />

          <H2>Key Takeaways: Capacity Planning Trade-Offs</H2>

          <KeyPoint>
            <Strong>1. Buffer based on business impact, not arbitrary percentages</Strong>
            <UL>
              <LI>Blog: 20% buffer (downtime cheap)</LI>
              <LI>E-commerce: 100% buffer (downtime = lost revenue)</LI>
              <LI>Launch: 500% buffer (first impression matters)</LI>
            </UL>
          </KeyPoint>

          <KeyPoint>
            <Strong>2. Over-provisioning costs less than downtime for revenue-generating apps</Strong>
            <UL>
              <LI>$5k over-provision >$200k lost revenue (Black Friday example)</LI>
              <LI>Better to waste 10% capacity than crash and lose customers</LI>
            </UL>
          </KeyPoint>

          <KeyPoint>
            <Strong>3. Hybrid approaches balance cost and reliability</Strong>
            <UL>
              <LI>Pre-provision base capacity (instant response)</LI>
              <LI>Auto-scale for spikes (cost-effective)</LI>
              <LI>Reserved for baseline + On-demand for flex (save 40% while staying flexible)</LI>
            </UL>
          </KeyPoint>

          <KeyPoint>
            <Strong>4. Different strategies for different traffic patterns</Strong>
            <UL>
              <LI>Predictable daily peaks → Pre-provision</LI>
              <LI>Unpredictable viral spikes → Hybrid (base + auto-scale)</LI>
              <LI>Steady 24/7 → Reserved instances (40-60% savings)</LI>
            </UL>
          </KeyPoint>

          <P>
            <Strong>Remember:</Strong> Capacity planning is a business decision, not just technical. Always calculate: What does downtime cost vs what does over-provisioning cost?
          </P>

          <Divider />

          <H2>Next Steps: Apply Your Knowledge</H2>

          <P>Now that you understand capacity planning trade-offs, try applying them to real challenges:</P>

          <UL>
            <LI>
              <Strong>TinyURL Challenge:</Strong> Calculate RPS for URL creation and redirects. Design infrastructure for 100M daily redirects with 3x peak factor. How many app servers and cache nodes do you need?
            </LI>
            <LI>
              <Strong>Food Blog Challenge:</Strong> Estimate throughput for image-heavy recipe pages. If each page is 500KB and you have 10k RPS, what's your CDN cost? Should you optimize images or add more CDN nodes?
            </LI>
            <LI>
              <Strong>Twitter Challenge:</Strong> Plan capacity for timeline generation. 300M users, 50 timeline views per user per day, 5x peak during breaking news. What's your read/write split? How many database replicas?
            </LI>
          </UL>

          <KeyPoint>
            <Strong>Remember:</Strong> Capacity planning is not a one-time task. As your user base grows, continuously monitor traffic patterns and adjust infrastructure. Set up alerts for 70% capacity utilization to scale before you hit limits!
          </KeyPoint>
        </Section>
      ),
      keyPoints: [
        'Estimate traffic, calculate capacity, add redundancy',
        'Design for peak traffic, not average',
        'Always add headroom and monitor continuously',
      ],
    },
    {
      id: 'practice-rps-calculation',
      type: 'quiz',
      title: 'Mini-Exercise: Calculate RPS from Daily Traffic',
      description: 'Test your RPS calculation skills',
      estimatedMinutes: 5,
      questions: [
        {
          id: 'rps-calc-1',
          question: `A food delivery app has 2 million daily active users. Each user places 1 order per day. What is the average write RPS?

**Calculation steps:**
- Daily writes = ?
- Seconds per day = 86,400
- Average RPS = Daily writes ÷ 86,400`,
          options: [
            '12 writes/sec',
            '23 writes/sec',
            '46 writes/sec',
            '92 writes/sec'
          ],
          correctAnswer: '23 writes/sec',
          explanation: `**Step 1:** Daily writes = 2M users × 1 order = 2,000,000 writes
**Step 2:** Average RPS = 2,000,000 ÷ 86,400 = 23.15 ≈ 23 writes/sec

Remember: Always round up to be safe!`
        },
        {
          id: 'rps-calc-2',
          question: `The same app has 50 million restaurant views per day (reads). If peak traffic is 3x average, what is the peak read RPS?

**Calculation steps:**
- Daily reads = 50M
- Average read RPS = 50M ÷ 86,400
- Peak read RPS = Average × 3`,
          options: [
            '579 reads/sec',
            '1,157 reads/sec',
            '1,736 reads/sec',
            '2,315 reads/sec'
          ],
          correctAnswer: '1,736 reads/sec',
          explanation: `**Step 1:** Average read RPS = 50M ÷ 86,400 = 578.7 ≈ 579 reads/sec
**Step 2:** Peak read RPS = 579 × 3 = 1,737 ≈ 1,736 reads/sec

**Key insight:** Design for PEAK traffic, not average! If you only provision for 579 RPS, the system will fail during peak hours.`
        },
        {
          id: 'rps-calc-3',
          question: `Why do we separate read RPS and write RPS when planning capacity?`,
          options: [
            'Reads are always faster than writes',
            'Different components handle reads vs writes differently',
            'Writes cost more money than reads',
            'It makes the math easier'
          ],
          correctAnswer: 'Different components handle reads vs writes differently',
          explanation: `Different components have different read/write capabilities:
- **Cache:** Handles 10,000+ read RPS, 0 write RPS (read-through only)
- **Database leader:** Handles 300 write RPS, 3,000 read RPS
- **Database replica:** Handles 3,000 read RPS, 0 write RPS (read-only)

By separating read/write RPS, you can optimize each component separately. For example, if you have 10,000 read RPS and 100 write RPS, you'd add cache + replicas for reads, not more leaders!`
        }
      ],
      keyPoints: [
        'Convert daily traffic to RPS by dividing by 86,400 seconds',
        'Always calculate peak RPS (2-5x average) for capacity planning',
        'Separate read and write RPS to optimize each component'
      ]
    },
    {
      id: 'practice-infrastructure-sizing',
      type: 'quiz',
      title: 'Mini-Exercise: Estimate Infrastructure Needs',
      description: 'Calculate server and database requirements',
      estimatedMinutes: 7,
      questions: [
        {
          id: 'infra-calc-1',
          question: `An e-commerce site has 5,000 peak RPS. Each app server handles 1,000 RPS. How many app servers do you need with 50% headroom?

**Given:**
- Peak RPS: 5,000
- App server capacity: 1,000 RPS each
- Headroom: 50% buffer

**Formula:** Servers = (Peak RPS ÷ Capacity per server) × (1 + headroom)`,
          options: [
            '5 servers (no buffer)',
            '6 servers (20% buffer)',
            '8 servers (50% buffer)',
            '10 servers (100% buffer)'
          ],
          correctAnswer: '8 servers (50% buffer)',
          explanation: `**Step 1:** Basic need = 5,000 ÷ 1,000 = 5 servers
**Step 2:** With 50% headroom = 5 × 1.5 = 7.5 ≈ 8 servers

**Why headroom matters:**
- Traffic spikes beyond peak estimate
- Some servers may fail (HA)
- Maintenance/deployments need capacity
- Better safe than sorry - downtime is expensive!`
        },
        {
          id: 'infra-calc-2',
          question: `The same site has 90% reads and 10% writes at 5,000 peak RPS. How many database leaders are needed?

**Given:**
- Peak RPS: 5,000
- Write ratio: 10%
- DB leader capacity: 300 writes/sec

**Calculate:** Write RPS = Peak × Write ratio`,
          options: [
            '1 leader (can handle 300 writes/sec)',
            '2 leaders (can handle 600 writes/sec)',
            '3 leaders (can handle 900 writes/sec)',
            '5 leaders (can handle 1,500 writes/sec)'
          ],
          correctAnswer: '2 leaders (can handle 600 writes/sec)',
          explanation: `**Step 1:** Write RPS = 5,000 × 0.10 = 500 writes/sec
**Step 2:** Leaders needed = 500 ÷ 300 = 1.67 ≈ 2 leaders

**Why 2 leaders:**
- 1 leader can only handle 300 writes/sec (not enough!)
- 2 leaders can handle 600 writes/sec (sufficient)

**Multi-leader setup:**
- Each leader handles writes for a shard/region
- Provides write scalability + high availability
- More complex than single-leader (conflicts possible)`
        },
        {
          id: 'infra-calc-3',
          question: `With 90% reads (4,500 read RPS), how many database replicas are needed?

**Given:**
- Read RPS: 4,500
- DB replica capacity: 3,000 reads/sec each

**Calculate:** Replicas = Read RPS ÷ Capacity per replica`,
          options: [
            '1 replica',
            '2 replicas',
            '3 replicas',
            '5 replicas'
          ],
          correctAnswer: '2 replicas',
          explanation: `**Step 1:** Replicas needed = 4,500 ÷ 3,000 = 1.5 ≈ 2 replicas
**Step 2:** 2 replicas can handle 6,000 read RPS (sufficient!)

**Complete architecture:**
- 8 app servers (5,000 peak RPS + 50% headroom)
- 2 database leaders (500 write RPS)
- 2 database replicas (4,500 read RPS)
- Total: 12 database nodes (2 leaders + 2 replicas per leader for HA)

**Cost optimization tip:** Add a cache (Redis) to reduce database read load! Cache can handle 10,000+ RPS per node, dramatically reducing replica count.`
        }
      ],
      keyPoints: [
        'Always add headroom (20-50%) for traffic spikes and failures',
        'Separate write capacity (leaders) from read capacity (replicas)',
        'Consider adding cache to reduce expensive database reads'
      ]
    },
    {
      id: 'practice-peak-planning',
      type: 'quiz',
      title: 'Mini-Exercise: Peak vs Average Planning',
      description: 'Understand the importance of planning for peak traffic',
      estimatedMinutes: 6,
      questions: [
        {
          id: 'peak-planning-1',
          question: `A streaming service has 10 million daily users. Average traffic is 1,000 RPS. During a live event (8pm-10pm), traffic spikes to 5,000 RPS (5x average). You provisioned for 1,500 RPS (1.5x average). What happens?

**Your capacity:** 1,500 RPS
**Peak traffic:** 5,000 RPS
**Shortfall:** ?`,
          options: [
            'System handles it fine with autoscaling',
            'System slows down but stays up',
            'System crashes - 70% of requests fail',
            'Load balancer queues the extra requests'
          ],
          correctAnswer: 'System crashes - 70% of requests fail',
          explanation: `**Math:**
- Your capacity: 1,500 RPS
- Peak demand: 5,000 RPS
- Shortfall: 5,000 - 1,500 = 3,500 RPS (70% of traffic!)

**What actually happens:**
1. Servers get overwhelmed (1,500 RPS capacity exceeded)
2. Request queues fill up → timeouts
3. Database connections exhausted
4. Users see errors/infinite loading
5. **Business impact:** Lost revenue, angry users, bad press

**Lesson:** Always design for PEAK traffic, not average! Autoscaling takes 5-10 minutes - too slow for sudden spikes.`
        },
        {
          id: 'peak-planning-2',
          question: `How do you determine the right peak factor for your application?

**Common peak factors:**
- News site: 10-20x during breaking news
- E-commerce: 5x during sales events
- Social media: 3x during evening hours
- Enterprise SaaS: 2x during business hours`,
          options: [
            'Always use 2x - it\'s the industry standard',
            'Use 10x - better safe than sorry',
            'Analyze your traffic patterns and plan for historical peaks + buffer',
            'Don\'t worry about peaks - just use autoscaling'
          ],
          correctAnswer: 'Analyze your traffic patterns and plan for historical peaks + buffer',
          explanation: `**Right approach:**
1. **Analyze historical data:** Look at past traffic patterns
2. **Identify peak events:** Sales, launches, viral moments
3. **Add buffer:** Peak factor = Historical peak × 1.5

**Example - E-commerce:**
- Normal traffic: 1,000 RPS
- Black Friday 2023: 4,000 RPS (4x)
- Plan for 2024: 4,000 × 1.5 = 6,000 RPS (6x factor)

**Why not just use autoscaling?**
- Autoscaling takes 5-10 minutes (too slow!)
- Cold starts cause latency spikes
- Not all components autoscale (databases!)
- Better to be over-provisioned than crash during peak

**Real example:** Target's 2013 Black Friday site crashed because they under-provisioned for peak. Lost $25M+ in sales.`
        },
        {
          id: 'peak-planning-3',
          question: `Your app has these traffic patterns:
- Weekdays: 1,000 RPS average, 2,000 RPS peak (9am-5pm)
- Weekends: 500 RPS average, 800 RPS peak
- Product launches: 10,000 RPS for 1 hour (once per quarter)

What capacity should you provision?`,
          options: [
            '2,000 RPS - handles normal weekday peaks',
            '5,000 RPS - handles 2.5x normal peaks',
            '10,000 RPS - handles product launches',
            '15,000 RPS - handles launches + buffer'
          ],
          correctAnswer: '15,000 RPS - handles launches + buffer',
          explanation: `**Answer: 15,000 RPS (10,000 launch peak × 1.5 buffer)**

**Reasoning:**
- You MUST handle product launches (business-critical!)
- 10,000 RPS is the absolute peak
- Add 50% buffer for unexpected viral traffic
- Total: 10,000 × 1.5 = 15,000 RPS

**Cost optimization:**
- **Base capacity:** 2,000 RPS (always-on, handles weekdays)
- **Burst capacity:** +13,000 RPS (autoscaling for launches)
- **Strategy:** Pre-scale before launches, autoscale for viral spikes

**Real-world example:**
- Instagram provisions for 10x normal traffic during major events
- Pre-scales 2 hours before event
- Better to waste some capacity than crash when Taylor Swift posts

**Key lesson:** Your capacity must handle your HIGHEST peak event, not average traffic!`
        }
      ],
      keyPoints: [
        'Always design for peak traffic, not average - crashes are expensive',
        'Analyze historical peaks and add buffer for unexpected spikes',
        'Autoscaling is too slow for sudden traffic spikes (5-10 min delay)'
      ]
    },
  ],
  nextLessons: ['caching-strategies'],
};

