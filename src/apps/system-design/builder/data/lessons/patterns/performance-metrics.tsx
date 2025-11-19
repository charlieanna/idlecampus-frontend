import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider 
} from '../../../ui/components/LessonContent';

export const performanceMetricsLesson: SystemDesignLesson = {
  id: 'performance-metrics',
  slug: 'performance-metrics',
  title: 'Performance Metrics - Latency Percentiles',
  description: 'Learn why percentiles matter more than averages for measuring system performance',
  category: 'patterns',
  difficulty: 'beginner',
  estimatedMinutes: 25,
  stages: [
    {
      id: 'why-percentiles',
      type: 'concept',
      title: 'Why Percentiles Matter',
      content: (
        <Section>
          <H1>Why Percentiles Matter More Than Averages</H1>
          
          <P>
            When measuring system performance, <Strong>averages hide outliers</Strong>. A system with an 
            average latency of 100ms might seem good, but if the 99th percentile is 5 seconds, 
            <Strong>1% of your users are experiencing terrible performance</Strong>.
          </P>

          <KeyPoint>
            <Strong>Key Insight:</Strong> Averages lie. Percentiles tell the truth about what users actually experience.
          </KeyPoint>

          <H2>The Problem with Averages</H2>

          <Example title="Example: Misleading Average">
            <P>
              Imagine you have 100 requests with these latencies:
            </P>

            <UL>
              <LI>99 requests: 50ms each</LI>
              <LI>1 request: 5,000ms (5 seconds)</LI>
            </UL>

            <P>
              <Strong>Average latency:</Strong> (99 × 50ms + 1 × 5000ms) / 100 = <Strong>99.5ms</Strong> ✅ Looks good!
            </P>

            <P>
              <Strong>Reality:</Strong> One user waited 5 seconds! 😱
            </P>

            <KeyPoint>
              The average hides the outlier. Percentiles reveal it.
            </KeyPoint>
          </Example>

          <H2>What Are Percentiles?</H2>

          <P>
            A <Strong>percentile</Strong> tells you what percentage of requests are faster than a given value.
          </P>

          <UL>
            <LI><Strong>p50 (median):</Strong> 50% of requests are faster, 50% are slower</LI>
            <LI><Strong>p95:</Strong> 95% of requests are faster, 5% are slower</LI>
            <LI><Strong>p99:</Strong> 99% of requests are faster, 1% are slower</LI>
            <LI><Strong>p999:</Strong> 99.9% of requests are faster, 0.1% are slower</LI>
          </UL>

          <Example title="Real-World Example">
            <P>
              If your p99 latency is 200ms, it means:
            </P>

            <UL>
              <LI>99% of users experience latency ≤ 200ms</LI>
              <LI>1% of users experience latency &gt; 200ms</LI>
            </UL>

            <P>
              This is much more useful than knowing the average is 100ms!
            </P>
          </Example>
        </Section>
      ),
    },
    {
      id: 'understanding-percentiles',
      type: 'concept',
      title: 'Understanding Different Percentiles',
      content: (
        <Section>
          <H1>Understanding Different Percentiles</H1>

          <H2>p50 (Median) - The Typical User</H2>

          <P>
            The <Strong>median</Strong> (p50) represents the typical user experience. Half of your users 
            experience better performance, half experience worse.
          </P>

          <Example title="Example: p50 = 50ms">
            <P>
              If p50 = 50ms, it means:
            </P>

            <UL>
              <LI>50% of requests complete in ≤ 50ms</LI>
              <LI>50% of requests take &gt; 50ms</LI>
            </UL>

            <P>
              This is your "typical" user experience.
            </P>
          </Example>

          <H2>p95 - The "Most Users" Experience</H2>

          <P>
            p95 tells you what <Strong>95% of users</Strong> experience. This is often used for internal 
            SLAs (Service Level Objectives).
          </P>

          <Example title="Example: p95 = 100ms">
            <P>
              If p95 = 100ms:
            </P>

            <UL>
              <LI>95% of users experience ≤ 100ms</LI>
              <LI>5% of users experience &gt; 100ms</LI>
            </UL>

            <P>
              This is acceptable for most internal services.
            </P>
          </Example>

          <H2>p99 - The "Almost Everyone" Experience</H2>

          <P>
            p99 is the most common SLA target. It tells you what <Strong>99% of users</Strong> experience. 
            The remaining 1% might have network issues, slow devices, or edge cases.
          </P>

          <Example title="Example: p99 = 200ms">
            <P>
              If p99 = 200ms:
            </P>

            <UL>
              <LI>99% of users experience ≤ 200ms</LI>
              <LI>1% of users experience &gt; 200ms</LI>
            </UL>

            <P>
              This is a good SLA target for user-facing services.
            </P>
          </Example>

          <H2>p999 - The "Edge Cases" Experience</H2>

          <P>
            p999 (also called p99.9) shows what <Strong>99.9% of users</Strong> experience. The remaining 
            0.1% might be experiencing genuine problems (network issues, database timeouts, etc.).
          </P>

          <Example title="Example: p999 = 500ms">
            <P>
              If p999 = 500ms:
            </P>

            <UL>
              <LI>99.9% of users experience ≤ 500ms</LI>
              <LI>0.1% of users experience &gt; 500ms</LI>
            </UL>

            <P>
              This helps identify edge cases and system issues.
            </P>
          </Example>
        </Section>
      ),
    },
    {
      id: 'real-world-examples',
      type: 'concept',
      title: 'Real-World Examples',
      content: (
        <Section>
          <H1>Real-World Examples</H1>

          <H2>Example 1: The Deceptive Average</H2>

          <Example title="E-commerce Checkout">
            <P>
              An e-commerce site tracks checkout latency:
            </P>

            <UL>
              <LI><Strong>Average:</Strong> 150ms ✅ Looks great!</LI>
              <LI><Strong>p50:</Strong> 100ms ✅ Typical user experience is good</LI>
              <LI><Strong>p95:</Strong> 200ms ✅ Most users are fine</LI>
              <LI><Strong>p99:</Strong> 5,000ms ❌ 1% of users wait 5 seconds!</LI>
            </UL>

            <P>
              <Strong>The Problem:</Strong> The 1% of users experiencing 5-second delays are likely 
              <Strong>abandoning their carts</Strong>. You're losing sales!
            </P>

            <KeyPoint>
              <Strong>Action:</Strong> Investigate why p99 is so high. Maybe database queries are timing out, 
              or payment processing is slow for some users.
            </KeyPoint>
          </Example>

          <H2>Example 2: The Long Tail</H2>

          <Example title="API Response Times">
            <P>
              An API has the following latency distribution:
            </P>

            <UL>
              <LI><Strong>p50:</Strong> 20ms (fast!)</LI>
              <LI><Strong>p95:</Strong> 50ms (still good)</LI>
              <LI><Strong>p99:</Strong> 200ms (acceptable)</LI>
              <LI><Strong>p999:</Strong> 2,000ms (2 seconds - problem!)</LI>
            </UL>

            <P>
              <Strong>The Issue:</Strong> While 99.9% of requests are fast, 0.1% are very slow. This could be:
            </P>

            <UL>
              <LI>Database connection pool exhaustion</LI>
              <LI>Cache misses causing database queries</LI>
              <LI>Network issues</LI>
              <LI>Garbage collection pauses</LI>
            </UL>

            <KeyPoint>
              <Strong>Action:</Strong> Investigate p999 to find and fix the root cause of slow requests.
            </KeyPoint>
          </Example>

          <H2>Example 3: Industry Standards</H2>

          <ComparisonTable
            headers={['Service Type', 'p50 Target', 'p95 Target', 'p99 Target']}
            rows={[
              ['User-facing API', '< 50ms', '< 100ms', '< 200ms'],
              ['Internal API', '< 100ms', '< 200ms', '< 500ms'],
              ['Database Query', '< 10ms', '< 50ms', '< 100ms'],
              ['Cache Lookup', '< 1ms', '< 5ms', '< 10ms'],
              ['File Upload', '< 500ms', '< 2s', '< 5s'],
            ]}
          />

          <KeyPoint>
            <Strong>Note:</Strong> Targets vary by service type. User-facing services need stricter SLAs 
            than internal services.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'setting-slas',
      type: 'concept',
      title: 'Setting SLAs Based on Percentiles',
      content: (
        <Section>
          <H1>Setting SLAs Based on Percentiles</H1>

          <P>
            <Strong>SLAs (Service Level Agreements)</Strong> define the performance guarantees you make to users. 
            They should be based on percentiles, not averages.
          </P>

          <H2>Common SLA Patterns</H2>

          <H3>1. User-Facing Services</H3>

          <P>
            For services that users directly interact with (web pages, mobile apps):
          </P>

          <UL>
            <LI><Strong>SLA:</Strong> p99 latency &lt; 200ms</LI>
            <LI><Strong>Reasoning:</Strong> 99% of users get fast responses</LI>
            <LI><Strong>Example:</Strong> "99% of API requests complete in under 200ms"</LI>
          </UL>

          <H3>2. Internal Services</H3>

          <P>
            For services used by other services (microservices, data processing):
          </P>

          <UL>
            <LI><Strong>SLA:</Strong> p95 latency &lt; 500ms</LI>
            <LI><Strong>Reasoning:</Strong> Internal services can tolerate slightly higher latency</LI>
            <LI><Strong>Example:</Strong> "95% of internal API calls complete in under 500ms"</LI>
          </UL>

          <H3>3. Background Jobs</H3>

          <P>
            For asynchronous processing (email sending, report generation):
          </P>

          <UL>
            <LI><Strong>SLA:</Strong> p99 completion time &lt; 5 minutes</LI>
            <LI><Strong>Reasoning:</Strong> Background jobs can take longer</LI>
            <LI><Strong>Example:</Strong> "99% of background jobs complete within 5 minutes"</LI>
          </UL>

          <H2>How to Set Your SLA</H2>

          <OL>
            <LI>
              <Strong>Measure current performance:</Strong> Track p50, p95, p99 for a week
            </LI>
            <LI>
              <Strong>Set realistic targets:</Strong> Aim for p99 that's achievable (maybe 2x your current p95)
            </LI>
            <LI>
              <Strong>Monitor and alert:</Strong> Set up alerts when p99 exceeds your SLA
            </LI>
            <LI>
              <Strong>Iterate:</Strong> As you optimize, tighten your SLA targets
            </LI>
          </OL>

          <KeyPoint>
            <Strong>Remember:</Strong> It's better to have a realistic SLA you can meet than an ambitious one 
            you constantly violate.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'common-mistakes',
      type: 'concept',
      title: 'Common Mistakes and Best Practices',
      content: (
        <Section>
          <H1>Common Mistakes and Best Practices</H1>

          <H2>Common Mistakes</H2>

          <H3>❌ Mistake 1: Using Averages</H3>

          <P>
            <Strong>Problem:</Strong> "Our average latency is 100ms, so we're meeting our SLA!"
          </P>

          <P>
            <Strong>Reality:</Strong> Average hides outliers. You might have p99 = 5 seconds and not know it.
          </P>

          <H3>❌ Mistake 2: Only Tracking p50</H3>

          <P>
            <Strong>Problem:</Strong> "Our p50 is 50ms, so performance is great!"
          </P>

          <P>
            <Strong>Reality:</Strong> p50 only tells you about the median. You need p95/p99 to understand 
            the tail of the distribution.
          </P>

          <H3>❌ Mistake 3: Setting Unrealistic SLAs</H3>

          <P>
            <Strong>Problem:</Strong> "We'll set p99 &lt; 50ms because that sounds fast!"
          </P>

          <P>
            <Strong>Reality:</Strong> If your current p99 is 500ms, setting 50ms is unrealistic. Start with 
            achievable targets and improve over time.
          </P>

          <H3>❌ Mistake 4: Ignoring p999</H3>

          <P>
            <Strong>Problem:</Strong> "p99 is good, so we're fine!"
          </P>

          <P>
            <Strong>Reality:</Strong> p999 can reveal edge cases and system issues that affect 0.1% of users 
            but might be critical bugs.
          </P>

          <Divider />

          <H2>Best Practices</H2>

          <H3>✅ Always Track Multiple Percentiles</H3>

          <UL>
            <LI>Track p50, p95, p99, and p999</LI>
            <LI>Each percentile tells you something different</LI>
            <LI>Use p50 for typical experience, p99 for SLA, p999 for edge cases</LI>
          </UL>

          <H3>✅ Set SLAs Based on Percentiles</H3>

          <UL>
            <LI>Never use averages for SLAs</LI>
            <LI>Use p99 for user-facing services</LI>
            <LI>Use p95 for internal services</LI>
            <LI>Set realistic targets based on current performance</LI>
          </UL>

          <H3>✅ Monitor the Tail</H3>

          <UL>
            <LI>Don't just optimize for p50</LI>
            <LI>Investigate why p99/p999 is high</LI>
            <LI>Long tail latency often indicates real problems</LI>
          </UL>

          <H3>✅ Use Percentiles for Capacity Planning</H3>

          <UL>
            <LI>Size your system for p99, not average</LI>
            <LI>If p99 is 200ms, ensure your system can handle that</LI>
            <LI>Plan for the worst 1% of requests</LI>
          </UL>

          <KeyPoint>
            <Strong>Golden Rule:</Strong> If you can only track one metric, track p99. It tells you what 
            99% of your users experience, which is what matters most.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

