import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpPerformanceScalabilityLesson: SystemDesignLesson = {
  id: 'sdp-performance-scalability',
  slug: 'sdp-performance-scalability',
  title: 'Performance vs Scalability',
  description: 'Master WHEN to optimize performance vs scale capacity, vertical vs horizontal scaling trade-offs ($2.5k hard limit vs $2.1k unlimited scaling), and WHY optimizing first saved $4,450/mo vs scaling a slow system (40x speedup for $50/mo)',
  category: 'fundamentals',
  difficulty: 'beginner',
  estimatedMinutes: 45,

  // Progressive flow metadata
  moduleId: 'sd-module-5-primer',
  sequenceOrder: 1,
  stages: [
    {
      id: 'intro-performance-scalability',
      type: 'concept',
      title: 'Performance vs Scalability',
      content: (
        <Section>
          <H1>Performance vs Scalability</H1>
          <P>
            <Strong>Performance</Strong> and <Strong>Scalability</Strong> are related but distinct concepts.
            Understanding the difference is crucial for making the right optimization decisions.
          </P>

          <H2>Performance</H2>
          <P>
            <Strong>Performance</Strong> measures how fast a system responds to a single request or user.
            It's about making a slow system fast for one user.
          </P>
          <UL>
            <LI>Single-user latency (e.g., p99 latency &lt; 200ms)</LI>
            <LI>Response time for one request</LI>
            <LI>Optimization: Faster algorithms, better queries, caching</LI>
          </UL>

          <H2>Scalability</H2>
          <P>
            <Strong>Scalability</Strong> measures how well a system handles increased load (more users, more data).
            A scalable system maintains performance as load increases.
          </P>
          <UL>
            <LI>Throughput under load (e.g., 10k requests/sec)</LI>
            <LI>Ability to handle growth</LI>
            <LI>Optimization: Horizontal scaling, load balancing, partitioning</LI>
          </UL>

          <ComparisonTable
            headers={['Aspect', 'Performance', 'Scalability']}
            rows={[
              ['Focus', 'Single user experience', 'System capacity'],
              ['Metric', 'Latency (ms)', 'Throughput (req/sec)'],
              ['Problem', 'Query takes 5 seconds', 'System slow with 1000 users'],
              ['Solution', 'Optimize query, add index', 'Add servers, scale horizontally'],
            ]}
          />

          <Example title="E-commerce Platform">
            <P>
              <Strong>Performance Problem:</Strong> Product page loads in 5 seconds for one user.
              <UL>
                <LI>Solution: Optimize database query, add indexes, cache product data</LI>
                <LI>Result: Page loads in 200ms for one user</LI>
              </UL>
            </P>
            <P>
              <Strong>Scalability Problem:</Strong> System handles 100 users fine, but crashes with 10,000 users.
              <UL>
                <LI>Solution: Add load balancer, scale to 10 app servers, add read replicas</LI>
                <LI>Result: System handles 10,000 users with same 200ms latency</LI>
              </UL>
            </P>
          </Example>

          <H2>Key Laws & Principles</H2>
          <UL>
            <LI><Strong>Amdahl's Law:</Strong> Maximum speedup limited by sequential portion of code</LI>
            <LI><Strong>Little's Law:</Strong> Average number of items in system = arrival rate × average time in system</LI>
            <LI><Strong>CAP Theorem:</Strong> Can only guarantee 2 of 3: Consistency, Availability, Partition tolerance</LI>
          </UL>

          <KeyPoint>
            <Strong>Best Practice:</Strong> Optimize performance first (make it fast for one user), then scale
            (make it handle many users). Don't scale a slow system!
          </KeyPoint>

          <Divider />

          <H1>🎯 Critical Trade-Off: Vertical Scaling vs Horizontal Scaling</H1>

          <ComparisonTable
            headers={['Approach', 'Cost', 'Scalability Limit', 'Complexity', 'Downtime', 'Best For', 'Worst For']}
            rows={[
              [
                'Vertical Scaling\n(bigger server)',
                'High\n(exponential)',
                'Hard Limit\n(largest server)',
                'Very Low\n(no code changes)',
                'Medium\n(requires restart)',
                '• Databases\n• Monoliths\n• Startups\n• Short-term fix',
                '• Highly variable load\n• Need high availability\n• Cost-sensitive'
              ],
              [
                'Horizontal Scaling\n(more servers)',
                'Low\n(linear)',
                'Nearly Unlimited',
                'High\n(distributed systems)',
                'Zero\n(rolling updates)',
                '• Stateless services\n• Read-heavy workloads\n• Long-term growth',
                '• Stateful systems\n• Databases (complex)\n• Small scale'
              ]
            ]}
          />

          <Example title="Real Decision: API Service Scaling from 1k → 10k RPS">
            <P><Strong>Context:</Strong> API service currently handles 1k RPS on 1 server, need to scale to 10k RPS</P>

            <P><Strong>Option 1: Vertical Scaling</Strong></P>
            <CodeBlock>
{`Current: 1 server (4 vCPU, 16GB RAM) = $200/mo → handles 1k RPS

Scale to 10x capacity:
  - Upgrade to: 40 vCPU, 160GB RAM = $2,500/mo (largest AWS instance)
  - Result: Handles 10k RPS

Limitations:
  - Hard limit: Can't scale beyond 10k RPS (largest server maxed out)
  - Single point of failure
  - Requires downtime for upgrade (5-10 min)
  - Cost efficiency: 12.5x cost for 10x capacity ($200 → $2,500)

Result: ⚠️ Works short-term but hits hard limit at 10k RPS`}
            </CodeBlock>

            <P><Strong>Option 2: Horizontal Scaling (correct choice)</Strong></P>
            <CodeBlock>
{`Current: 1 server (4 vCPU, 16GB RAM) = $200/mo → handles 1k RPS

Scale to 10x capacity:
  - Add 9 more servers (same size) = 10 × $200/mo = $2,000/mo
  - Add load balancer = $100/mo
  - Total: $2,100/mo → handles 10k RPS

Benefits:
  - Can scale further: Need 100k RPS? Add 90 more servers (linear cost)
  - High availability: If 1 server dies, still have 9 (90% capacity)
  - Zero downtime: Rolling updates (update servers one at a time)
  - Cost efficiency: 10.5x cost for 10x capacity ($200 → $2,100)

Trade-off vs vertical:
  - Slightly cheaper: $2,100 vs $2,500 (-16%)
  - Unlimited scalability vs hard limit at 10k RPS
  - High availability vs single point of failure
  - Added complexity: Need load balancer + distributed system logic

Result: ✅ Better long-term choice despite added complexity`}
            </CodeBlock>
          </Example>

          <Divider />

          <H1>🎯 Critical Trade-Off: Optimize Performance First vs Scale First</H1>

          <Example title="Real Decision: Slow Database Query Under Load">
            <P><Strong>Scenario:</Strong> Dashboard query takes 2s with 10 concurrent users, times out with 100 concurrent users</P>

            <P><Strong>Wrong Approach: Scale First (10x more expensive)</Strong></P>
            <CodeBlock>
{`Problem:
  - Query scans 10M rows (slow N+1 query)
  - Current: 1 database server ($500/mo)
  - With 100 users: Query queue backs up, timeouts

Solution attempt:
  - Add 9 read replicas to distribute load
  - Total cost: 10 × $500/mo = $5,000/mo
  - Result: Still slow (2s per query × 100 concurrent = 200s total wait)
  - Throughput: 100 queries / 2s = 50 queries/sec (poor)

Outcome: ❌ Spent $4,500/mo extra, queries still slow (2s each)
Scaled a slow system = expensive failure`}
            </CodeBlock>

            <P><Strong>Correct Approach: Optimize Performance First</Strong></P>
            <CodeBlock>
{`Solution:
  1. Add database index on query filter column
  2. Fix N+1 query → batch queries
  3. Add 1-minute cache for dashboard data

Performance improvement:
  - Query time: 2s → 50ms (40x faster!)
  - With 100 concurrent users: 100 × 50ms = 5s total
  - Throughput: 100 queries / 5s = 20 queries/sec from cache

Cost:
  - Database: $500/mo (same)
  - Redis cache: $50/mo
  - Total: $550/mo

Comparison:
  - Scale-first approach: $5,000/mo, 2s latency, 50 queries/sec
  - Optimize-first approach: $550/mo, 50ms latency, 20 queries/sec from cache
  - Savings: $4,450/mo + 40x faster

Result: ✅ Optimize first, then scale if needed (saved $4,450/mo)`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Lesson:</Strong> Don't scale a slow system. Optimize performance first (40x speedup for $50/mo),
              then scale horizontally if needed. Scaling a slow system is 10x more expensive.
            </KeyPoint>
          </Example>

          <H2>Common Mistakes</H2>

          <P>❌ <Strong>Mistake 1: Scaling Without Optimizing Performance</Strong></P>
          <CodeBlock>
{`Problem:
  - Slow query (2s)
  - Add 10 servers to handle load: $5k/mo
  - Still slow (2s per query)

Fix: Optimize query first (add index, fix N+1), then scale if needed`}
          </CodeBlock>

          <P>❌ <Strong>Mistake 2: Vertical Scaling for Long-Term Growth</Strong></P>
          <CodeBlock>
{`Problem:
  - Keep vertically scaling: $200 → $500 → $1k → $2.5k/mo
  - Hit hard limit (largest server)
  - Can't scale further, forced to refactor for horizontal scaling

Fix: Start with horizontal scaling from day 1 (if expecting growth)`}
          </CodeBlock>
        </Section>
      ),
    },
  ],
};

