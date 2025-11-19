import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const nfrFundamentalsLesson: SystemDesignLesson = {
  id: 'nfr-fundamentals',
  slug: 'nfr-fundamentals',
  title: 'NFR Fundamentals: Throughput, Latency & Capacity',
  description: 'Learn how to calculate throughput, handle peak vs average load, read-write ratios, autoscaling, and burst traffic.',
  category: 'fundamentals',
  difficulty: 'beginner',
  estimatedMinutes: 60,
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

          <H2>Server Capacity Formula</H2>
          <P>
            Account for OS overhead when calculating capacity:
          </P>
          <CodeBlock>
{`Effective Capacity = Theoretical Capacity × (1 - Overhead%)

Example:
- Theoretical capacity: 2,000 RPS
- OS overhead: 30% (OS processes, monitoring, GC, network I/O)
- Effective capacity: 2,000 × 0.7 = 1,400 RPS per server

Servers Needed = Peak RPS / Effective Capacity
Servers Needed = 10,000 / 1,400 = ~8 servers`}
          </CodeBlock>

          <H2>Why 30% Overhead?</H2>
          <UL>
            <LI>Operating system processes: ~15%</LI>
            <LI>Health checks & monitoring: ~5%</LI>
            <LI>Connection handling & network I/O: ~5%</LI>
            <LI>GC pauses & context switching: ~5%</LI>
          </UL>

          <KeyPoint>
            <Strong>Always account for overhead:</Strong> Real-world capacity is 60-70% of theoretical maximum.
          </KeyPoint>
        </Section>
      ),
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

          <Example title="E-commerce Platform">
            <UL>
              <LI>Average RPS: 1,000 (most of the day)</LI>
              <LI>Daily peak: 8,000 RPS (lunch hour)</LI>
              <LI>Weekend peak: 15,000 RPS (flash sales)</LI>
            </UL>
            <P>
              <Strong>If you provision for average (1 server):</Strong>
            </P>
            <UL>
              <LI>At peak: 8,000 requests arrive, server handles 1,400</LI>
              <LI>Result: 6,600 requests/sec dropped (503 errors)</LI>
              <LI>Users see timeouts and errors</LI>
            </UL>
            <P>
              <Strong>Solution: Provision for peak (15,000 RPS)</Strong>
            </P>
            <UL>
              <LI>Servers needed: 15,000 / 1,400 = 11 servers</LI>
              <LI>Result: All requests handled, no drops</LI>
            </UL>
          </Example>

          <H2>Cost vs Performance Trade-off</H2>
          <UL>
            <LI>Provisioning for average: Lower cost, but fails at peak</LI>
            <LI>Provisioning for peak: Higher cost, but handles all traffic</LI>
            <LI>Solution: Autoscaling (scale up at peak, down at average)</LI>
          </UL>

          <KeyPoint>
            <Strong>Rule:</Strong> Design for worst-case (peak), not typical case (average).
          </KeyPoint>
        </Section>
      ),
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

          <Example title="Social Media Feed">
            <P>
              <Strong>Read-write ratio: 100:1</Strong> (100 reads per write)
            </P>
            <UL>
              <LI>Users read feeds constantly (reads)</LI>
              <LI>Users post occasionally (writes)</LI>
              <LI>Solution: Heavy caching, read replicas, write fan-out</LI>
            </UL>
          </Example>

          <KeyPoint>
            <Strong>Design based on ratio:</Strong> Read-heavy systems need caching, write-heavy systems need write optimization.
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

          <H2>Scale-Up Lag Problem</H2>
          <P>
            <Strong>Problem:</Strong> Autoscaling takes 2-3 minutes. During flash sales, traffic spikes
            in 10 seconds, but servers take 3 minutes to start.
          </P>
          <UL>
            <LI>Traffic: 0 → 20,000 RPS in 10 seconds</LI>
            <LI>Current capacity: 7,000 RPS (5 servers)</LI>
            <LI>Scale-up time: 3 minutes</LI>
            <LI>Result: 13,000 requests/sec dropped for 3 minutes</LI>
          </UL>

          <H2>Solutions</H2>
          <UL>
            <LI><Strong>Request Queues:</Strong> Buffer requests while scaling (see next section)</LI>
            <LI><Strong>Proactive Scaling:</Strong> Scale up before known peaks (e.g., scheduled scaling)</LI>
            <LI><Strong>Pre-warmed Instances:</Strong> Keep spare instances ready</LI>
          </UL>

          <KeyPoint>
            <Strong>Autoscaling is not instant:</Strong> Use queues or proactive scaling for burst traffic.
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
{`Client → Load Balancer → Request Queue (Kafka/SQS) → Worker Pool

How it works:
1. LB accepts ALL requests immediately (returns 202 Accepted)
2. Requests queued (can buffer millions)
3. Workers process queue at their capacity
4. Autoscaling adds more workers
5. Queue drains as workers scale up`}
          </CodeBlock>

          <H2>Write Queue Batching</H2>
          <P>
            For write-heavy workloads, batch writes to improve throughput:
          </P>
          <UL>
            <LI>Collect writes in queue</LI>
            <LI>Batch into groups of 100-1000</LI>
            <LI>Write batch to database (single transaction)</LI>
            <LI>Much faster than individual writes</LI>
          </UL>

          <KeyPoint>
            <Strong>Use queues:</Strong> For burst traffic, write batching, and decoupling producers from consumers.
          </KeyPoint>
        </Section>
      ),
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
          <UL>
            <LI><Strong>Caching:</Strong> Cache frequently accessed data (reduces DB queries)</LI>
            <LI><Strong>CDN:</Strong> Serve static content from edge servers (reduces network latency)</LI>
            <LI><Strong>Read Replicas:</Strong> Read from nearby replica (reduces cross-region latency)</LI>
            <LI><Strong>Database Indexes:</Strong> Speed up queries</LI>
          </UL>

          <KeyPoint>
            <Strong>Measure and optimize:</Strong> Identify bottlenecks (network, database, application) and optimize accordingly.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

