import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpPerformanceScalabilityLesson: SystemDesignLesson = {
  id: 'sdp-performance-scalability',
  slug: 'sdp-performance-scalability',
  title: 'Performance vs Scalability',
  description: 'Understand the difference between performance and scalability, and when to optimize for each.',
  category: 'fundamentals',
  difficulty: 'beginner',
  estimatedMinutes: 30,
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
        </Section>
      ),
    },
  ],
};

