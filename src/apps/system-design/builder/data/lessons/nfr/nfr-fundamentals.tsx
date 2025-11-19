import { SystemDesignLesson } from '../../../types/lesson';
import {
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section,
  ComparisonTable, KeyPoint, Example, Divider, InfoBox
} from '../../../ui/components/LessonContent';

export const nfrFundamentalsLesson: SystemDesignLesson = {
  id: 'nfr-fundamentals',
  slug: 'nfr-fundamentals',
  title: 'NFR Fundamentals: Throughput, Latency & Capacity',
  description: 'Master capacity planning, peak load handling, and autoscaling through calculations and hands-on practice',
  category: 'fundamentals',
  difficulty: 'beginner',
  estimatedMinutes: 75, // Increased due to practice exercises

  // NEW: Connect to challenges
  relatedChallenges: ['tiny_url', 'ticketmaster', 'airbnb'],

  // NEW: Learning path
  nextLessons: ['caching-fundamentals', 'load-balancing'],

  // NEW: Concepts covered
  conceptsCovered: [
    {
      id: 'capacity-planning',
      name: 'Capacity Planning',
      type: 'technique',
      difficulty: 2,
      description: 'Calculate servers needed based on RPS and capacity'
    },
    {
      id: 'peak-vs-average',
      name: 'Peak vs Average Load',
      type: 'technique',
      difficulty: 2,
      description: 'Design for worst-case traffic, not average'
    },
    {
      id: 'burst-traffic',
      name: 'Burst Traffic Handling',
      type: 'pattern',
      difficulty: 3,
      description: 'Use queues to buffer traffic spikes'
    }
  ],

  stages: [
    {
      id: 'intro-nfr',
      type: 'concept',
      title: 'What are NFRs?',
      content: (
        <Section>
          <H1>What are NFRs?</H1>
          <P>
            <Strong>NFRs (Non-Functional Requirements)</Strong> define how well a system performs,
            not what it does. Key NFRs include throughput, latency, availability, durability, and consistency.
          </P>

          <UL>
            <LI><Strong>Throughput:</Strong> How many requests per second can the system handle?</LI>
            <LI><Strong>Latency:</Strong> How fast does the system respond?</LI>
            <LI><Strong>Availability:</Strong> What percentage of time is the system up?</LI>
            <LI><Strong>Durability:</Strong> How long is data preserved?</LI>
            <LI><Strong>Consistency:</Strong> When do all users see the same data?</LI>
          </UL>

          <H2>Why NFRs Matter</H2>

          <Example title="Real-World Impact">
            <P>
              <Strong>Amazon:</Strong> Every 100ms of latency costs 1% in sales
            </P>
            <P>
              <Strong>Google:</Strong> 500ms delay in search results = 20% drop in traffic
            </P>
            <P>
              <Strong>Shopify:</Strong> Black Friday 2021 handled 80M+ shoppers with 99.99% uptime
            </P>
          </Example>

          <InfoBox type="tip">
            <P>
              <Strong>Pro tip:</Strong> NFRs are often MORE important than features.
              A feature-rich system that's down or slow is worse than a simple system that works.
            </P>
          </InfoBox>
        </Section>
      ),
    },
    {
      id: 'throughput-calculation',
      type: 'concept',
      title: 'Throughput Calculation & Capacity Planning',
      content: (
        <Section>
          <H1>Throughput Calculation & Capacity Planning</H1>
          <P>
            Calculating how many servers you need requires understanding actual server capacity,
            not just theoretical maximums.
          </P>

          <H2>The Problem: Theoretical vs Real Capacity</H2>

          <Example title="Common Mistake">
            <CodeBlock>
{`❌ WRONG CALCULATION:
Server can handle 2,000 RPS in benchmarks
Need to handle 10,000 RPS
Servers needed = 10,000 / 2,000 = 5 servers

Result: System crashes at 7,000 RPS! 🔥

Why? Didn't account for OS overhead!`}
            </CodeBlock>
          </Example>

          <H2>Server Capacity Formula</H2>
          <P>
            Account for OS overhead when calculating capacity:
          </P>
          <CodeBlock>
{`Effective Capacity = Theoretical Capacity × (1 - Overhead%)

Example:
- Theoretical capacity: 2,000 RPS (from benchmarks)
- OS overhead: 30% (OS processes, monitoring, GC, network I/O)
- Effective capacity: 2,000 × 0.7 = 1,400 RPS per server

Servers Needed = Peak RPS / Effective Capacity
Servers Needed = 10,000 / 1,400 = 7.14 → 8 servers (always round up!)`}
          </CodeBlock>

          <H2>Why 30% Overhead?</H2>
          <UL>
            <LI>Operating system processes: ~15%</LI>
            <LI>Health checks & monitoring: ~5%</LI>
            <LI>Connection handling & network I/O: ~5%</LI>
            <LI>GC pauses & context switching: ~5%</LI>
          </UL>

          <Example title="Real TypeScript Implementation">
            <CodeBlock>
{`// Capacity calculator function
function calculateServersNeeded(
  peakRPS: number,
  theoreticalCapacityPerServer: number,
  overheadPercent: number = 0.30  // Default 30%
): number {
  // Calculate effective capacity after overhead
  const effectiveCapacity =
    theoreticalCapacityPerServer * (1 - overheadPercent);

  // Calculate servers needed (always round up!)
  const serversNeeded = Math.ceil(peakRPS / effectiveCapacity);

  console.log(\`Peak RPS: \${peakRPS}\`);
  console.log(\`Theoretical capacity: \${theoreticalCapacityPerServer} RPS\`);
  console.log(\`Effective capacity: \${effectiveCapacity} RPS\`);
  console.log(\`Servers needed: \${serversNeeded}\`);

  return serversNeeded;
}

// Example usage
const servers = calculateServersNeeded(
  10_000,  // Peak traffic
  2_000    // Theoretical RPS per server
);
// Output: 8 servers needed

// Black Friday traffic
const blackFridayServers = calculateServersNeeded(
  100_000,  // 100k RPS during sale
  2_000
);
// Output: 72 servers needed`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Always account for overhead:</Strong> Real-world capacity is 60-70% of theoretical maximum.
            Always round up when calculating servers!
          </KeyPoint>
        </Section>
      ),
    },

    // NEW: Practice Exercise 1
    {
      id: 'practice-capacity-calculation',
      type: 'canvas-practice',
      title: 'Practice: Calculate Server Capacity',
      description: 'Design a system with the right number of servers for given traffic',
      estimatedMinutes: 10,
      scenario: {
        description: 'You\'re launching a ticket sales platform. Each server can handle 1,500 RPS in benchmarks. You expect 12,000 RPS during ticket sales.',
        requirements: [
          'Handle 12,000 RPS during ticket sales',
          'Account for 30% OS overhead',
          'Keep costs reasonable',
          'Maintain p99 latency < 100ms'
        ],
        constraints: [
          'Server theoretical capacity: 1,500 RPS',
          'Each server costs $100/month',
          'Budget: $1,500/month'
        ]
      },
      hints: [
        'Calculate effective capacity = 1,500 × 0.7 = 1,050 RPS per server',
        'Servers needed = 12,000 / 1,050 = 11.43, round up to 12',
        'Cost = 12 servers × $100 = $1,200/month (within budget!)',
        'Add load balancer to distribute traffic evenly'
      ],
      solution: {
        nodes: [
          {
            id: 'client',
            type: 'client',
            position: { x: 100, y: 200 },
            config: {}
          },
          {
            id: 'load_balancer',
            type: 'load_balancer',
            position: { x: 300, y: 200 },
            config: {}
          },
          {
            id: 'app_server',
            type: 'app_server',
            position: { x: 500, y: 200 },
            config: { instances: 12 }
          },
          {
            id: 'database',
            type: 'database',
            position: { x: 700, y: 200 },
            config: {
              instanceType: 'commodity-db',
              replicationMode: 'single-leader',
              replication: { enabled: true, replicas: 2, mode: 'async' }
            }
          }
        ],
        edges: [
          {
            id: 'e1',
            source: 'client',
            target: 'load_balancer',
            type: 'http'
          },
          {
            id: 'e2',
            source: 'load_balancer',
            target: 'app_server',
            type: 'http'
          },
          {
            id: 'e3',
            source: 'app_server',
            target: 'database',
            type: 'tcp'
          }
        ]
      },
      solutionExplanation: `
**Capacity Calculation:**

1. **Effective capacity per server:**
   - Theoretical: 1,500 RPS
   - Overhead: 30%
   - Effective: 1,500 × 0.7 = 1,050 RPS per server

2. **Servers needed:**
   - Peak RPS: 12,000
   - Per server: 1,050 RPS
   - Servers: 12,000 / 1,050 = 11.43 → **12 servers** (always round up!)

3. **Load balancer:**
   - Distributes 12,000 RPS across 12 servers
   - Each server handles ~1,000 RPS (within effective capacity)

4. **Database read replicas:**
   - Offload read traffic from primary
   - Can handle concurrent queries from 12 app servers

5. **Cost:**
   - 12 servers × $100 = $1,200/month ✓
   - Within $1,500 budget with room for database

**Key lesson:** Always account for overhead and round up!
      `
    },

    {
      id: 'peak-vs-average',
      type: 'concept',
      title: 'Peak vs Average Load',
      content: (
        <Section>
          <H1>Peak vs Average Load</H1>
          <P>
            <Strong>Always design for PEAK load, not average load.</Strong> This is critical for
            systems that experience traffic spikes.
          </P>

          <H2>The Mistake: Provisioning for Average</H2>

          <Example title="E-commerce Platform">
            <UL>
              <LI>Average RPS: 1,000 (most of the day)</LI>
              <LI>Daily peak: 8,000 RPS (lunch hour)</LI>
              <LI>Weekend peak: 15,000 RPS (flash sales)</LI>
            </UL>
            <P>
              <Strong>If you provision for average (1 server @ 1,400 RPS):</Strong>
            </P>
            <UL>
              <LI>At peak: 8,000 requests arrive, server handles 1,400</LI>
              <LI>Result: 6,600 requests/sec dropped (503 errors)</LI>
              <LI>Users see timeouts and errors</LI>
              <LI>Lost sales, angry customers!</LI>
            </UL>
            <P>
              <Strong>Solution: Provision for peak (15,000 RPS)</Strong>
            </P>
            <UL>
              <LI>Servers needed: 15,000 / 1,400 = 11 servers</LI>
              <LI>Result: All requests handled, no drops ✓</LI>
            </UL>
          </Example>

          <H2>Visualizing Peak vs Average</H2>

          <CodeBlock>
{`Traffic Pattern (24 hours):
==========================

RPS
15k ┤                                ╭─╮
    │                                │ │
12k ┤                              ╭─╯ ╰─╮
    │                              │     │
9k  ┤                     ╭────╮  │     │
    │                     │    │  │     │
6k  ┤           ╭─────╮  │    │  │     │
    │         ╭─╯     ╰──╯    ╰──╯     ╰─╮
3k  ┤    ╭────╯                           ╰────╮
    │────╯                                     ╰────
0   └─────────────────────────────────────────────►
    0am  6am  12pm  6pm  12am Time

Average load: ~3,000 RPS
Peak load: 15,000 RPS (5x average!)

❌ Design for average (3k) → Crashes at peak
✓ Design for peak (15k) → Always works`}
          </CodeBlock>

          <H2>Cost vs Performance Trade-off</H2>

          <ComparisonTable
            headers={['Strategy', 'Servers', 'Cost/Month', 'Handles Peak?', 'Best For']}
            rows={[
              [
                'Provision for average',
                '3 servers',
                '$300',
                '❌ No (crashes)',
                'Never use!'
              ],
              [
                'Provision for peak (fixed)',
                '11 servers',
                '$1,100',
                '✓ Yes',
                'Predictable traffic'
              ],
              [
                'Autoscaling (3-11 servers)',
                '3-11 servers',
                '$400 avg',
                '✓ Yes',
                'Variable traffic'
              ]
            ]}
          />

          <KeyPoint>
            <Strong>Rule:</Strong> Design for worst-case (peak), not typical case (average).
            Use autoscaling to optimize costs.
          </KeyPoint>

          <Divider />

          <H2>Real-World Example: Target Black Friday 2013</H2>

          <InfoBox type="warning">
            <P>
              <Strong>What happened:</Strong> Target's website crashed on Black Friday 2013
              because they provisioned for average traffic, not peak.
            </P>
          </InfoBox>

          <Example title="Target's Mistake">
            <UL>
              <LI><Strong>Normal day:</Strong> 50,000 concurrent users</LI>
              <LI><Strong>Black Friday:</Strong> 500,000 concurrent users (10x spike!)</LI>
              <LI><Strong>Provisioned for:</Strong> ~100,000 users (2x average)</LI>
              <LI><Strong>Result:</Strong> Site down for 6+ hours, $25M+ in lost sales</LI>
            </UL>
          </Example>

          <P><Strong>Lesson learned:</Strong></P>
          <UL>
            <LI>Look at historical peak traffic (previous Black Fridays)</LI>
            <LI>Add 50% buffer for unexpected growth</LI>
            <LI>Use load testing to verify capacity before big sales</LI>
            <LI>Have autoscaling ready to handle spikes beyond projections</LI>
          </UL>
        </Section>
      ),
    },

    // NEW: Practice Exercise 2
    {
      id: 'practice-peak-vs-average',
      type: 'canvas-practice',
      title: 'Practice: Design for Peak Load',
      description: 'Build a system that handles peak traffic with autoscaling',
      estimatedMinutes: 12,
      scenario: {
        description: 'Design an e-commerce platform that handles variable traffic throughout the day. Average traffic is 2,000 RPS but peaks at 18,000 RPS during flash sales.',
        requirements: [
          'Handle peak traffic of 18,000 RPS during flash sales',
          'Optimize costs during average traffic (2,000 RPS)',
          'Use autoscaling to scale between min and max',
          'Budget: $2,000/month'
        ],
        constraints: [
          'Server capacity: 1,400 RPS effective',
          'Server cost: $100/month per instance',
          'Must handle peak without errors'
        ]
      },
      hints: [
        'Min servers for average: 2,000 / 1,400 = 2 servers',
        'Max servers for peak: 18,000 / 1,400 = 13 servers',
        'Use autoscaling to scale between 2-13 servers',
        'Average cost: ~$400/month (mostly run at min), peak cost: $1,300 (during sales)'
      ],
      solution: {
        nodes: [
          {
            id: 'client',
            type: 'client',
            position: { x: 100, y: 200 },
            config: {}
          },
          {
            id: 'load_balancer',
            type: 'load_balancer',
            position: { x: 300, y: 200 },
            config: {}
          },
          {
            id: 'app_server',
            type: 'app_server',
            position: { x: 500, y: 200 },
            config: {
              instances: 2,
              autoscaling: {
                enabled: true,
                min: 2,
                max: 13,
                targetCPU: 70
              }
            }
          },
          {
            id: 'cache',
            type: 'cache',
            position: { x: 700, y: 150 },
            config: {
              instanceType: 'redis-medium'
            }
          },
          {
            id: 'database',
            type: 'database',
            position: { x: 700, y: 250 },
            config: {
              instanceType: 'commodity-db',
              replicationMode: 'single-leader',
              replication: { enabled: true, replicas: 3, mode: 'async' }
            }
          }
        ],
        edges: [
          {
            id: 'e1',
            source: 'client',
            target: 'load_balancer',
            type: 'http'
          },
          {
            id: 'e2',
            source: 'load_balancer',
            target: 'app_server',
            type: 'http'
          },
          {
            id: 'e3',
            source: 'app_server',
            target: 'cache',
            type: 'tcp'
          },
          {
            id: 'e4',
            source: 'app_server',
            target: 'database',
            type: 'tcp'
          }
        ]
      },
      solutionExplanation: `
**Peak vs Average Strategy:**

1. **Capacity calculation:**
   - Average: 2,000 RPS → 2 servers minimum
   - Peak: 18,000 RPS → 13 servers maximum
   - Autoscaling: Scale between 2-13 based on CPU/RPS

2. **Autoscaling configuration:**
   - Min instances: 2 (handles average 2,000 RPS)
   - Max instances: 13 (handles peak 18,000 RPS)
   - Scale up when: CPU > 70% or RPS > 1,200 per server
   - Scale down when: CPU < 30% and RPS < 800 per server
   - Cooldown: 5 minutes before scaling down

3. **Cost optimization:**
   - Normal day (20 hrs @ 2 servers): $100/day
   - Peak hours (4 hrs @ 13 servers): $200/day
   - Average monthly: ~$400/month (vs $1,300 if always at peak!)
   - Saves 70% compared to fixed peak provisioning

4. **Cache layer:**
   - Reduces database load during peaks
   - 80%+ cache hit rate = only 3,600 DB queries at peak
   - Database can handle this with read replicas

5. **Database read replicas:**
   - 3 read replicas spread read load
   - Primary handles writes only
   - Can handle traffic from 13 app servers at peak

**Result:** Handles peak traffic, optimizes costs, stays within budget!
      `
    },

    {
      id: 'read-write-ratio',
      type: 'concept',
      title: 'Read-Write Ratio',
      content: (
        <Section>
          <H1>Read-Write Ratio</H1>
          <P>
            Understanding the ratio of reads to writes affects architecture decisions:
          </P>

          <UL>
            <LI><Strong>Read-heavy (90% reads, 10% writes):</Strong> Use caching, read replicas</LI>
            <LI><Strong>Write-heavy (10% reads, 90% writes):</Strong> Optimize writes, use write queues</LI>
            <LI><Strong>Balanced (50/50):</Strong> Need both read and write optimization</LI>
          </UL>

          <H2>Calculating Read-Write Ratio</H2>

          <Example title="Social Media Feed">
            <P>
              <Strong>Traffic analysis:</Strong>
            </P>
            <UL>
              <LI>100M users per day</LI>
              <LI>Each user views feed 20 times/day (reads)</LI>
              <LI>Each user posts 2 times/day (writes)</LI>
            </UL>
            <CodeBlock>
{`Total reads = 100M users × 20 views = 2 billion reads/day
Total writes = 100M users × 2 posts = 200 million writes/day

Read-write ratio = 2B / 200M = 10:1

Or: 91% reads, 9% writes

Architecture implications:
- ✓ Heavy caching (cache-aside pattern)
- ✓ Read replicas (10+ replicas to spread reads)
- ✓ Write fan-out (async after write completes)
- ✗ Don't optimize for writes (only 9% of traffic)`}
            </CodeBlock>
          </Example>

          <Example title="Analytics Platform">
            <P>
              <Strong>Traffic analysis:</Strong>
            </P>
            <UL>
              <LI>10,000 IoT devices sending data</LI>
              <LI>Each device sends data every second (writes)</LI>
              <LI>Dashboard queries 100 times/day (reads)</LI>
            </UL>
            <CodeBlock>
{`Total writes = 10K devices × 86,400 sec/day = 864M writes/day
Total reads = 100 queries/day

Read-write ratio = 100 / 864M = 1:8,640,000

Or: >99.9% writes!

Architecture implications:
- ✓ Write queues (Kafka/SQS to buffer writes)
- ✓ Write batching (batch 1000 writes into 1 DB transaction)
- ✓ Time-series database (optimized for write-heavy workloads)
- ✗ Don't cache reads (rarely accessed)`}
            </CodeBlock>
          </Example>

          <Divider />

          <ComparisonTable
            headers={['Ratio', 'Example', 'Optimize For', 'Patterns']}
            rows={[
              [
                'Read-heavy\n(90%+ reads)',
                'Social feeds,\nE-commerce catalogs,\nURL shorteners',
                'Fast reads',
                'Caching, read replicas,\nCDN'
              ],
              [
                'Write-heavy\n(90%+ writes)',
                'IoT data,\nLog aggregation,\nMetrics',
                'Write throughput',
                'Write queues, batching,\nTime-series DB'
              ],
              [
                'Balanced\n(50/50)',
                'Banking,\nInventory systems',
                'Both',
                'Sharding, replication,\noptimistic locking'
              ]
            ]}
          />

          <KeyPoint>
            <Strong>Design based on ratio:</Strong> Measure your actual read-write ratio and
            optimize accordingly. Don't guess!
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'autoscaling',
      type: 'concept',
      title: 'Autoscaling',
      content: (
        <Section>
          <H1>Autoscaling</H1>
          <P>
            Automatically add/remove servers based on load. Reduces cost while handling traffic spikes.
          </P>

          <H2>How Autoscaling Works</H2>
          <OL>
            <LI>Monitor metrics (CPU, memory, request rate)</LI>
            <LI>When metric exceeds threshold (e.g., CPU &gt; 70%), trigger scale-up</LI>
            <LI>Start new servers (takes 2-3 minutes)</LI>
            <LI>When metric drops below threshold, trigger scale-down (after cooldown)</LI>
          </OL>

          <H2>Autoscaling Configuration Example</H2>

          <Example title="AWS Auto Scaling Group (TypeScript)">
            <CodeBlock>
{`interface AutoScalingConfig {
  minInstances: number;
  maxInstances: number;
  targetCPU: number;
  scaleUpCooldown: number;   // seconds
  scaleDownCooldown: number;  // seconds
}

const config: AutoScalingConfig = {
  minInstances: 2,     // Always have 2 running
  maxInstances: 20,    // Never exceed 20
  targetCPU: 70,       // Scale up if CPU > 70%
  scaleUpCooldown: 60,   // Wait 1 min after scaling up
  scaleDownCooldown: 300  // Wait 5 min after scaling down
};

// Example: Current state
const currentInstances = 5;
const currentCPU = 85%;  // High CPU!

if (currentCPU > config.targetCPU &&
    currentInstances < config.maxInstances) {
  // Scale up by 50% or add 1, whichever is greater
  const scaleTo = Math.min(
    Math.ceil(currentInstances * 1.5),
    config.maxInstances
  );
  console.log(\`Scaling up from \${currentInstances} to \${scaleTo}\`);
  // Scaling up from 5 to 8 instances
}`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Scale-Up Lag Problem</H2>
          <P>
            <Strong>Problem:</Strong> Autoscaling takes 2-3 minutes. During flash sales, traffic spikes
            in 10 seconds, but servers take 3 minutes to start.
          </P>

          <CodeBlock>
{`Timeline of a Flash Sale (without queue):
=========================================

Time 0s: 2,000 RPS → 2 servers running (1,000 RPS each)
         ✓ System healthy

Time 10s: 20,000 RPS spike! (Flash sale starts)
          Current capacity: 2 servers × 1,400 = 2,800 RPS
          ❌ 17,200 requests/sec dropped!
          Autoscaling triggered...

Time 30s: Still 20,000 RPS
          Servers starting: 0 (AWS launching instances)
          ❌ Still dropping 17,200 req/sec

Time 120s: Still 20,000 RPS
           New servers starting up...
           ❌ Still dropping requests

Time 180s: 14 servers now running!
           Capacity: 14 × 1,400 = 19,600 RPS
           ✓ Can handle traffic now

Total dropped: 17,200 req/sec × 180 sec = 3.1 MILLION requests dropped! 😱

Users experienced:
- 503 errors
- Timeouts
- Blank pages
- Lost sales`}
          </CodeBlock>

          <H2>Solutions</H2>
          <UL>
            <LI><Strong>Request Queues:</Strong> Buffer requests while scaling (see next section)</LI>
            <LI><Strong>Proactive Scaling:</Strong> Scale up before known peaks (e.g., scheduled scaling)</LI>
            <LI><Strong>Pre-warmed Instances:</Strong> Keep spare instances ready</LI>
            <LI><Strong>Faster Startup:</Strong> Use container warmup, smaller images</LI>
          </UL>

          <KeyPoint>
            <Strong>Autoscaling is not instant:</Strong> Use queues or proactive scaling for burst traffic.
            Always test with realistic traffic spikes!
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'burst-handling',
      type: 'concept',
      title: 'Burst Traffic & Request Queues',
      content: (
        <Section>
          <H1>Burst Traffic & Request Queues</H1>
          <P>
            When traffic spikes faster than autoscaling can respond, use <Strong>request queues</Strong>
            to buffer requests.
          </P>

          <H2>The Problem</H2>
          <P>
            Flash sale: 0 → 20,000 RPS in 10 seconds, but autoscaling takes 3 minutes.
            Without queues, 2.34 million requests are dropped.
          </P>

          <H2>The Solution: Request Queue</H2>
          <CodeBlock>
{`Architecture:
===========

Client → Load Balancer → API Gateway → Request Queue → Worker Pool → Database
                                           (Kafka/SQS)      (Autoscales)

How it works:
1. LB accepts ALL requests immediately (returns 202 Accepted)
2. Requests queued (can buffer millions)
3. Workers process queue at their capacity
4. Autoscaling adds more workers
5. Queue drains as workers scale up

With queue (same flash sale scenario):
======================================

Time 0-10s: 20,000 RPS spike
            Queue accepts all requests instantly ✓
            Returns 202 Accepted to users
            Queue depth: 200,000 messages

Time 10-180s: Workers processing at capacity
              Current: 2 workers × 700 RPS = 1,400 processed/sec
              Queue growing: +18,600/sec
              Autoscaling adding workers...

Time 180s: 14 workers running
           Processing: 14 × 700 = 9,800/sec
           Queue draining: -9,800/sec (catching up)

Time 300s: Queue empty, all requests processed!
           ✓ ZERO dropped requests!
           Users got responses (slightly delayed, but successful)`}
          </CodeBlock>

          <H2>Queue Implementation Example</H2>

          <Example title="Request Queue with Kafka (TypeScript)">
            <CodeBlock>
{`import { Kafka, Producer, Consumer } from 'kafkajs';

// Producer (API Gateway)
class RequestQueueProducer {
  private producer: Producer;

  async publishRequest(request: any) {
    // Add to queue immediately
    await this.producer.send({
      topic: 'order-requests',
      messages: [{
        key: request.userId,
        value: JSON.stringify(request),
        timestamp: Date.now().toString()
      }]
    });

    // Return 202 Accepted immediately
    return {
      status: 202,
      message: 'Request queued for processing',
      queuePosition: await this.getQueueDepth()
    };
  }
}

// Consumer (Worker)
class RequestQueueWorker {
  private consumer: Consumer;

  async processRequests() {
    await this.consumer.subscribe({ topic: 'order-requests' });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const request = JSON.parse(message.value.toString());

        try {
          // Process the request
          const result = await this.processOrder(request);

          // Store result for client to poll
          await this.saveResult(request.id, result);
        } catch (error) {
          // Handle errors, maybe retry
          await this.handleError(request, error);
        }
      }
    });
  }

  private async processOrder(request: any) {
    // Actual business logic
    const order = await database.createOrder(request);
    return order;
  }
}`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Write Queue Batching</H2>
          <P>
            For write-heavy workloads, batch writes to improve throughput:
          </P>

          <Example title="Write Batching">
            <CodeBlock>
{`// Without batching: 1,000 writes/sec = 1,000 DB transactions
// Slow! Each transaction has overhead

// With batching: 1,000 writes/sec batched into 10 transactions
// Fast! 100 writes per transaction

async function batchWriter(queue: Queue) {
  const batchSize = 100;
  const batchTimeout = 1000; // 1 second max wait

  while (true) {
    // Collect batch
    const batch = [];
    const startTime = Date.now();

    while (batch.length < batchSize &&
           Date.now() - startTime < batchTimeout) {
      const item = await queue.poll();
      if (item) batch.push(item);
    }

    if (batch.length > 0) {
      // Write entire batch in single transaction
      await database.transaction(async (tx) => {
        for (const item of batch) {
          await tx.insert('orders', item);
        }
      });

      console.log(\`Wrote \${batch.length} items in 1 transaction\`);
    }
  }
}

// Result:
// - 10x fewer database transactions
// - Higher throughput
// - Lower database load`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Use queues:</Strong> For burst traffic, write batching, and decoupling producers from consumers.
            Queues are your safety net!
          </KeyPoint>
        </Section>
      ),
    },

    // NEW: Practice Exercise 3
    {
      id: 'practice-burst-traffic',
      type: 'canvas-practice',
      title: 'Challenge: Handle Burst Traffic',
      description: 'Design a system that gracefully handles sudden traffic spikes',
      estimatedMinutes: 15,
      scenario: {
        description: 'Design a concert ticket sales system. Normal traffic is 500 RPS, but when tickets go on sale, traffic spikes to 50,000 RPS in 10 seconds. Autoscaling takes 3 minutes.',
        requirements: [
          'Handle 50,000 RPS burst traffic',
          'Zero dropped requests (100% success rate)',
          'Gracefully queue requests during spike',
          'Process all queued requests within 10 minutes'
        ],
        constraints: [
          'Autoscaling lag: 3 minutes to add servers',
          'Worker capacity: 500 RPS per instance',
          'Cannot over-provision (budget constraint)'
        ]
      },
      hints: [
        'Use request queue (Kafka/SQS) to buffer the 50k RPS spike',
        'Start with minimal workers (2-3), autoscale to handle queue',
        'Queue can buffer millions of requests',
        'Workers process queue at their capacity, autoscaling adds more'
      ],
      solution: {
        nodes: [
          {
            id: 'client',
            type: 'client',
            position: { x: 100, y: 200 },
            config: {}
          },
          {
            id: 'load_balancer',
            type: 'load_balancer',
            position: { x: 250, y: 200 },
            config: {}
          },
          {
            id: 'api_gateway',
            type: 'app_server',
            position: { x: 400, y: 150 },
            config: {
              instances: 10,
              role: 'api-gateway'
            }
          },
          {
            id: 'message_queue',
            type: 'message_queue',
            position: { x: 600, y: 150 },
            config: {
              instanceType: 'kafka-large',
              throughput: 100_000  // Can handle 100k messages/sec
            }
          },
          {
            id: 'workers',
            type: 'app_server',
            position: { x: 800, y: 150 },
            config: {
              instances: 3,
              autoscaling: {
                enabled: true,
                min: 3,
                max: 100,
                targetQueueDepth: 1000  // Scale when queue > 1000 messages
              }
            }
          },
          {
            id: 'database',
            type: 'database',
            position: { x: 1000, y: 200 },
            config: {
              instanceType: 'high-performance-db',
              replicationMode: 'single-leader'
            }
          }
        ],
        edges: [
          {
            id: 'e1',
            source: 'client',
            target: 'load_balancer',
            type: 'http'
          },
          {
            id: 'e2',
            source: 'load_balancer',
            target: 'api_gateway',
            type: 'http'
          },
          {
            id: 'e3',
            source: 'api_gateway',
            target: 'message_queue',
            type: 'tcp'
          },
          {
            id: 'e4',
            source: 'workers',
            target: 'message_queue',
            type: 'tcp'
          },
          {
            id: 'e5',
            source: 'workers',
            target: 'database',
            type: 'tcp'
          }
        ]
      },
      solutionExplanation: `
**Burst Traffic Handling Strategy:**

1. **API Gateway (10 instances):**
   - Accepts 50,000 RPS burst
   - Each handles ~5,000 RPS
   - Immediately queues requests to Kafka
   - Returns 202 Accepted to clients (instant response!)

2. **Message Queue (Kafka Large):**
   - Buffers 50,000 requests/sec
   - Can hold millions of messages in memory
   - Durable (persists to disk)
   - No dropped requests!

3. **Worker Pool (Autoscaling 3-100):**
   - Starts with 3 workers (500 RPS each = 1,500 RPS)
   - Queue depth grows: 50,000 - 1,500 = 48,500/sec
   - Autoscaling triggered by queue depth > 1,000

4. **Timeline:**
   ```
   Time 0s: Burst starts (50k RPS)
            API gateway queues all requests ✓
            Queue depth: 500,000 messages
            Workers: 3 (processing 1,500/sec)

   Time 180s: Autoscaling complete
              Workers: 100 (processing 50,000/sec)
              Queue depth: 500,000 + (48,500 × 180) = 9.2M messages

   Time 180s-360s: Workers processing faster than queue grows
                   Processing: 50,000/sec
                   Queue draining at 50,000/sec
                   Queue depth decreasing

   Time 600s: Queue empty!
              All 9.2M requests processed ✓
              Zero dropped requests!
   ```

5. **Cost optimization:**
   - Normal: 3 workers ($30/hr)
   - Peak: 100 workers ($1,000/hr) for ~6 hours during sale
   - Total cost: $6,000 for one sale event
   - Way cheaper than running 100 workers 24/7!

**Key Learnings:**
- Queues decouple producers from consumers
- Autoscaling can catch up if given time
- 202 Accepted provides better UX than 503 errors
- This is how Ticketmaster, StubHub handle ticket sales!
      `
    },

    {
      id: 'latency',
      type: 'concept',
      title: 'Latency: Request-Response & Data Processing',
      content: (
        <Section>
          <H1>Latency: Request-Response & Data Processing</H1>
          <P>
            <Strong>Latency</Strong> is the time from request to response. Different types of latency
            require different optimizations.
          </P>

          <H2>Request-Response Latency</H2>
          <P>
            Time for API to return response:
          </P>
          <UL>
            <LI>Network latency: ~10-50ms (geographic distance)</LI>
            <LI>Application processing: ~10-100ms (business logic)</LI>
            <LI>Database query: ~5-50ms (with indexes)</LI>
            <LI>Total: ~25-200ms for simple requests</LI>
          </UL>

          <H2>Latency Breakdown Example</H2>

          <Example title="E-commerce Product Page">
            <CodeBlock>
{`Request timeline (without optimization):
======================================

0ms:    User clicks product link
10ms:   Request reaches server (network latency)
20ms:   Server queries database for product (10ms query)
40ms:   Server queries database for reviews (20ms query)
70ms:   Server queries database for recommendations (30ms query)
85ms:   Server renders HTML (15ms)
95ms:   Response sent to user (10ms network)

Total: 95ms latency

Request timeline (with caching):
==============================

0ms:    User clicks product link
10ms:   Request reaches server
13ms:   Server checks Redis cache (3ms) → HIT!
15ms:   Response sent to user (2ms network)

Total: 15ms latency (6x faster!)`}
            </CodeBlock>
          </Example>

          <H2>Data Processing Latency</H2>
          <P>
            Time for background jobs to complete:
          </P>
          <UL>
            <LI>Image processing: Seconds to minutes</LI>
            <LI>Video encoding: Minutes to hours</LI>
            <LI>Analytics jobs: Minutes to hours</LI>
            <LI>Use async processing (queues) for long-running tasks</LI>
          </UL>

          <H2>Reducing Latency</H2>
          <ComparisonTable
            headers={['Technique', 'Reduces', 'How Much?', 'Cost']}
            rows={[
              ['Caching', 'DB latency', '10-50ms → 1-5ms', 'Low'],
              ['CDN', 'Network latency', '100ms → 20ms', 'Medium'],
              ['Read Replicas', 'DB load', '50ms → 10ms', 'Medium'],
              ['Database Indexes', 'Query time', '500ms → 5ms', 'Low'],
              ['Geographic regions', 'Network latency', '200ms → 30ms', 'High']
            ]}
          />

          <KeyPoint>
            <Strong>Measure and optimize:</Strong> Use APM tools to identify bottlenecks
            (network, database, application) and optimize accordingly.
          </KeyPoint>
        </Section>
      ),
    },

    // NEW: Next Steps
    {
      id: 'next-steps-nfr',
      type: 'concept',
      title: 'Next Steps & Practice',
      content: (
        <Section>
          <H1>Ready to Apply Your Knowledge?</H1>

          <P>
            You've mastered NFR fundamentals! Now apply these concepts to real challenges.
          </P>

          <H2>Recommended Challenges</H2>

          <InfoBox type="tip">
            <P><Strong>Challenge 1: TinyURL (Beginner)</Strong></P>
            <P>Perfect for practicing capacity planning:</P>
            <UL>
              <LI>Calculate servers needed for 1,000 RPS redirects</LI>
              <LI>Design for peak load (10x traffic spikes)</LI>
              <LI>Optimize with caching (read-heavy workload)</LI>
            </UL>
          </InfoBox>

          <InfoBox type="tip">
            <P><Strong>Challenge 2: Ticketmaster (Intermediate)</Strong></P>
            <P>Practice burst traffic handling:</P>
            <UL>
              <LI>Handle 100k RPS when tickets go on sale</LI>
              <LI>Use request queues to prevent dropped requests</LI>
              <LI>Autoscale workers to process queue</LI>
            </UL>
          </InfoBox>

          <InfoBox type="tip">
            <P><Strong>Challenge 3: Airbnb (Advanced)</Strong></P>
            <P>Complex peak vs average scenario:</P>
            <UL>
              <LI>Variable traffic: 5k average, 50k peak</LI>
              <LI>Read-write ratio optimization</LI>
              <LI>Multi-region latency optimization</LI>
            </UL>
          </InfoBox>

          <Divider />

          <H2>Learning Path</H2>

          <P><Strong>You've completed:</Strong></P>
          <UL>
            <LI>✓ NFR fundamentals (throughput, latency, capacity)</LI>
            <LI>✓ Capacity planning calculations</LI>
            <LI>✓ Peak vs average load handling</LI>
            <LI>✓ Burst traffic with queues</LI>
            <LI>✓ Read-write ratio analysis</LI>
            <LI>✓ Hands-on practice with 3 exercises</LI>
          </UL>

          <P><Strong>Continue learning:</Strong></P>
          <UL>
            <LI>→ <Strong>Caching Fundamentals</Strong> - Reduce latency, increase throughput</LI>
            <LI>→ <Strong>Load Balancing</Strong> - Distribute traffic effectively</LI>
            <LI>→ <Strong>Database Scaling</Strong> - Sharding, replication, read replicas</LI>
          </UL>

          <Divider />

          <H2>Quick Reference: NFR Formulas</H2>

          <CodeBlock>
{`// Capacity Planning
Effective Capacity = Theoretical Capacity × (1 - Overhead)
Servers Needed = Peak RPS / Effective Capacity (round up!)

// Read-Write Ratio
Total Reads = Users × Reads per User
Total Writes = Users × Writes per User
Ratio = Reads / Writes

// Queue Processing Time
Queue Depth = Requests Queued
Processing Rate = Workers × RPS per Worker
Time to Clear = Queue Depth / Processing Rate

// Latency Budget
Total Latency = Network + Application + Database
Target: p99 < 100ms for good UX`}
          </CodeBlock>

          <KeyPoint>
            <Strong>Remember:</Strong> Always design for peak load, account for overhead,
            and use queues for burst traffic. Measure, don't guess!
          </KeyPoint>
        </Section>
      ),
    },
  ],
};
