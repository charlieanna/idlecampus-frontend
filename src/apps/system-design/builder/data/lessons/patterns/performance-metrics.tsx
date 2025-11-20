import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider 
} from '../../../ui/components/LessonContent';

export const performanceMetricsLesson: SystemDesignLesson = {
  id: 'performance-metrics',
  slug: 'performance-metrics',
  title: 'Performance Metrics - Latency Percentiles',
  description: 'Master WHICH percentile to optimize (p50 vs p95 vs p99 vs p999) with ROI analysis, WHEN to set strict vs loose SLAs, and WHY optimizing p99 yielded 730x ROI vs optimizing p50 (imperceptible to users)',
  category: 'patterns',
  difficulty: 'beginner',
  estimatedMinutes: 40,
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
      id: 'metrics-tradeoffs',
      type: 'concept',
      title: 'Performance Metrics Trade-Offs',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: WHICH Percentile to Optimize and Monitor</H1>

          <ComparisonTable
            headers={['Metric', 'Users Covered', 'Optimization Cost', 'Business Value', 'Alert Noise', 'Best For', 'Worst For']}
            rows={[
              [
                'Average\n(mean)',
                'N/A\n(misleading)',
                'Very Low\n(easy)',
                'Very Low\n(hides issues)',
                'Low\n(rarely alerts)',
                '• Internal dashboards\n• Rough estimates\n• Historical trends',
                '• SLAs\n• User-facing metrics\n• Alerting'
              ],
              [
                'p50\n(median)',
                '50%\n(typical user)',
                'Low',
                'Medium\n(baseline only)',
                'Low',
                '• Understanding baseline\n• Capacity planning\n• Dev environments',
                '• SLAs\n• Critical services\n• Revenue-critical paths'
              ],
              [
                'p95',
                '95%\n(most users)',
                'Medium\n($5-10k/mo)',
                'High\n(covers most)',
                'Medium\n(actionable)',
                '• Internal services\n• Non-critical APIs\n• B2B platforms',
                '• User-facing apps\n• High-value users\n• Competitive markets'
              ],
              [
                'p99',
                '99%\n(almost all)',
                'High\n($20-50k/mo)',
                'Very High\n(user retention)',
                'Medium-High',
                '• User-facing services\n• E-commerce\n• SaaS platforms',
                '• Cost-sensitive\n• Internal tools\n• Background jobs'
              ],
              [
                'p999\n(p99.9)',
                '99.9%\n(edge cases)',
                'Very High\n($100k+/mo)',
                'Medium\n(diminishing returns)',
                'Very High\n(often noise)',
                '• Financial services\n• Healthcare\n• Mission-critical',
                '• Most web apps\n• Startups\n• Cost-sensitive'
              ]
            ]}
          />

          <Example title="Real Decision: SaaS Platform Choosing SLA Metric">
            <P><Strong>Context:</Strong> B2B SaaS platform, 50k daily active users, $2M ARR, p50=30ms, p95=100ms, p99=500ms, p999=3s</P>

            <P><Strong>Option 1: Optimize for p50 {'<'} 20ms (wrong priority)</Strong></P>
            <CodeBlock>
{`Target: p50 < 20ms (from current 30ms)

Cost to improve p50 from 30ms → 20ms:
- Add Redis cache layer: $500/mo
- Optimize database queries: $20k (one-time)
- Add CDN for static assets: $200/mo
- Total: $20k + $700/mo

Impact:
- Before: 50% of users see 30ms latency
- After: 50% of users see 20ms latency
- Difference: 10ms faster for 50% of users

User perception:
- 30ms vs 20ms: Imperceptible to humans (<100ms threshold)
- No change in conversion rate
- No change in user satisfaction

ROI analysis:
- Cost: $20k + $700/mo = $28.4k/year
- Revenue impact: $0 (users can't perceive 10ms difference)
- ROI: Negative

Result: ❌ Spent $28k to improve metric users can't perceive`}
            </CodeBlock>

            <P><Strong>Option 2: Optimize for p99 {'<'} 200ms (correct choice)</Strong></P>
            <CodeBlock>
{`Target: p99 < 200ms (from current 500ms)

Investigation of p99 slowness:
- 1% of requests taking 500ms+
- Root cause: N+1 query problem in dashboard API
- Fix: Add database query batching

Cost to improve p99 from 500ms → 200ms:
- Engineering: 2 weeks = $10k
- No infrastructure changes needed
- Total: $10k (one-time)

Impact:
- Before: 1% of users (500 users/day) see 500ms latency
- After: 1% of users see 200ms latency
- Difference: 300ms faster for 1% of users

User perception:
- 500ms: Noticeable lag, feels "slow"
- 200ms: Feels instant
- Conversion rate improvement: +2% (every 100ms = 1% conversion)

Revenue impact:
- 500 users/day affected × 365 days = 182.5k user-sessions/year
- Conversion rate: 10% → 12% (+2%)
- Additional conversions: 182.5k × 2% = 3,650/year
- Average contract value: $2k
- Additional revenue: 3,650 × $2k = $7.3M

ROI analysis:
- Cost: $10k
- Revenue impact: $7.3M
- ROI: 730x

Result: ✅ Spent $10k to unlock $7.3M revenue by fixing p99`}
            </CodeBlock>

            <P><Strong>Option 3: Optimize for p999 {'<'} 1s (wrong for this scale)</Strong></P>
            <CodeBlock>
{`Target: p999 < 1s (from current 3s)

Investigation of p999 slowness:
- 0.1% of requests (50 users/day) taking 3s+
- Root causes:
  1. Database connection pool exhaustion (rare)
  2. External API timeouts (occasional)
  3. Garbage collection pauses (sporadic)
  4. Network timeouts from specific ISPs (geographic)

Cost to improve p999 from 3s → 1s:
- Increase DB connection pool: $2k/mo (larger RDS instance)
- Add circuit breakers for external APIs: $30k engineering
- Tune GC settings: $10k engineering
- Add multi-region deployment for geographic issues: $50k/mo infra + $100k setup
- Total: $140k setup + $52k/mo = $764k/year

Impact:
- Before: 0.1% of users (50/day) see 3s latency
- After: 0.1% of users see 1s latency
- Difference: 2s faster for 0.1% of users

Revenue impact:
- 50 users/day × 365 = 18,250 user-sessions/year affected
- Conversion rate improvement: 1% (generous estimate)
- Additional conversions: 18,250 × 1% = 183/year
- Average contract value: $2k
- Additional revenue: 183 × $2k = $366k/year

ROI analysis:
- Cost: $764k/year
- Revenue impact: $366k/year
- ROI: -$398k/year (negative!)

Result: ❌ Spent $764k to gain $366k revenue (52% ROI, losing money)

Better approach: Keep p999 monitoring for alerting on systemic issues,
but don't spend $764k optimizing for 50 users/day`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Decision:</Strong> Optimize p99 (high ROI: 730x) but monitor p999 for alerting only.
              Don't optimize p50 (imperceptible) or p999 (negative ROI).
            </KeyPoint>
          </Example>

          <Divider />

          <H1>🎯 Critical Trade-Off: SLA Tightness vs Cost vs Reliability</H1>

          <ComparisonTable
            headers={['SLA Strictness', 'Infrastructure Cost', 'Engineering Cost', 'Incident Frequency', 'User Satisfaction', 'Best For']}
            rows={[
              [
                'Loose\np95 < 1s',
                'Low\n$5k/mo',
                'Low\n(minimal)',
                'High\n(5% SLA violations)',
                'Medium\n(acceptable)',
                '• Internal tools\n• Non-critical\n• Cost-sensitive'
              ],
              [
                'Moderate\np99 < 500ms',
                'Medium\n$15-30k/mo',
                'Medium\n(quarterly)',
                'Medium\n(1% violations)',
                'High\n(competitive)',
                '• SaaS platforms\n• E-commerce\n• Standard web apps'
              ],
              [
                'Strict\np99 < 200ms',
                'High\n$50-100k/mo',
                'High\n(monthly)',
                'Low\n(0.1% violations)',
                'Very High\n(premium)',
                '• Gaming\n• Real-time collaboration\n• High-frequency trading'
              ],
              [
                'Extreme\np999 < 100ms',
                'Very High\n$200k+/mo',
                'Very High\n(weekly)',
                'Very Low\n(0.01% violations)',
                'Excellent\n(overkill for most)',
                '• Financial trading\n• Healthcare critical\n• Autonomous vehicles'
              ]
            ]}
          />

          <Example title="Real Decision: Setting SLA for E-commerce Checkout">
            <P><Strong>Business Context:</Strong> E-commerce site, $10M/year GMV, 100k transactions/month</P>

            <P><Strong>Scenario: Choosing SLA Target</Strong></P>

            <P><Strong>Option A: Loose SLA - p95 {'<'} 1s</Strong></P>
            <CodeBlock>
{`Infrastructure needed:
- Basic web servers (3 instances): $500/mo
- Standard PostgreSQL: $200/mo
- Basic CDN: $100/mo
- Total: $800/mo

Performance:
- p50: 100ms
- p95: 800ms (meets SLA)
- p99: 3s (5% of users experience >1s)

Business impact:
- 5% of users see slow checkout (>1s)
- Conversion drop: 2.5% (every 100ms = 0.5% loss)
- Lost GMV: $10M × 5% × 2.5% = $12.5k/month
- Annual lost revenue: $150k

Trade-off: Save $800/mo infrastructure, lose $150k/year revenue

Result: ❌ Saved $9.6k/year infrastructure, lost $150k/year revenue (15.6x worse)`}
            </CodeBlock>

            <P><Strong>Option B: Moderate SLA - p99 {'<'} 500ms (correct choice)</Strong></P>
            <CodeBlock>
{`Infrastructure needed:
- Web servers with autoscaling (5-10 instances): $1,500/mo
- PostgreSQL with read replicas: $800/mo
- Redis cache: $300/mo
- Premium CDN: $200/mo
- Total: $2,800/mo

Performance:
- p50: 50ms
- p95: 150ms
- p99: 400ms (meets SLA)

Business impact:
- Only 1% of users see >500ms
- Conversion drop: 0.5% for 1% of users
- Lost GMV: $10M × 1% × 0.5% = $500/month
- Annual lost revenue: $6k

Trade-off: Spend extra $2k/mo infrastructure, save $144k/year revenue vs loose SLA

Result: ✅ Spend $24k/year to save $144k/year = 6x ROI`}
            </CodeBlock>

            <P><Strong>Option C: Strict SLA - p99 {'<'} 200ms (diminishing returns)</Strong></P>
            <CodeBlock>
{`Infrastructure needed:
- Web servers with aggressive autoscaling (10-20 instances): $4,000/mo
- PostgreSQL with sharding: $3,000/mo
- Multi-layer caching (Redis + Memcached): $800/mo
- Premium CDN with edge computing: $500/mo
- APM monitoring (Datadog): $1,200/mo
- Total: $9,500/mo

Performance:
- p50: 20ms
- p95: 80ms
- p99: 180ms (meets SLA)

Business impact:
- 99% of users see <200ms (vs 99% see <400ms in moderate)
- Conversion improvement: 400ms → 180ms = 220ms faster
- Conversion gain: 220ms × 0.5%/100ms = 1.1% for 99% of users
- Additional GMV: $10M × 99% × 1.1% = $109k/year

Cost comparison:
- Extra cost vs moderate: ($9,500 - $2,800) × 12 = $80k/year
- Revenue gain: $109k/year
- Net gain: $29k/year

Trade-off: Spend extra $80k/year to gain $109k/year = 1.36x ROI

Result: ⚠️ Positive ROI but marginal (1.36x vs 6x for moderate SLA)
Better to invest $80k in marketing (10x ROI) than infrastructure (1.36x ROI)`}
            </CodeBlock>
          </Example>

          <H3>Decision Framework: Choosing SLA Metric and Target</H3>
          <CodeBlock>
{`What type of service is this?

├─ User-facing service? (web app, mobile app, API)
│   └─ How much revenue per user?
│       ├─ High ($50+/user/year) → Optimize p99 < 200-500ms
│       │   └─ Examples: SaaS, e-commerce, gaming
│       │   └─ ROI: Every 100ms = 0.5-1% conversion
│       │   └─ Invest: $20-50k/mo infrastructure
│       │
│       ├─ Medium ($10-50/user/year) → Optimize p95 < 500ms
│       │   └─ Examples: Content sites, freemium apps
│       │   └─ ROI: Moderate conversion impact
│       │   └─ Invest: $5-20k/mo infrastructure
│       │
│       └─ Low (<$10/user/year) → Monitor p95, optimize p50
│           └─ Examples: Ad-supported content
│           └─ ROI: Limited budget for optimization
│           └─ Invest: <$5k/mo infrastructure
│
└─ Internal service? (microservices, APIs, batch jobs)
    └─ Critical path? (blocks user requests)
        ├─ YES → Optimize p95 < 500ms
        │   └─ User-facing services depend on this
        │   └─ Invest: Medium ($10-30k/mo)
        │
        └─ NO → Monitor p95, optimize when needed
            └─ Background jobs, analytics
            └─ Invest: Low (<$5k/mo)`}
          </CodeBlock>

          <H2>Common Mistakes</H2>

          <P>❌ <Strong>Mistake 1: Optimizing p50 Instead of p99</Strong></P>
          <CodeBlock>
{`Problem:
- Team optimizes p50 from 50ms → 30ms
- Spends $50k on infrastructure
- p99 still 2 seconds (unchanged)
- Users still complain about "slow" experience

Fix: Optimize p99 first (where users actually feel pain)`}
          </CodeBlock>

          <P>❌ <Strong>Mistake 2: Setting p999 SLA Without Budget</Strong></P>
          <CodeBlock>
{`Problem:
- Startup sets p999 < 100ms SLA
- Requires $200k/mo infrastructure
- Startup has $50k/mo total budget
- SLA constantly violated, alerts ignored

Fix: Set realistic p99 < 500ms SLA aligned with budget`}
          </CodeBlock>

          <P>❌ <Strong>Mistake 3: Monitoring Average Only</Strong></P>
          <CodeBlock>
{`Problem:
- Dashboard shows "Average latency: 80ms" ✅
- Looks great! Team celebrates
- Reality: p99 is 5 seconds
- 1% of users abandon checkout due to timeouts
- Lost revenue: $500k/year

Fix: Always track p95 and p99, never rely on average alone`}
          </CodeBlock>

          <P>❌ <Strong>Mistake 4: Over-Optimizing Low-Traffic Endpoints</Strong></P>
          <CodeBlock>
{`Problem:
- Admin dashboard (100 requests/day) has p99 = 2s
- Team spends $100k optimizing to p99 < 200ms
- User checkout (100k requests/day) has p99 = 1s (ignored)
- Optimized wrong endpoint (1000x less traffic)

Fix: Optimize high-traffic, high-value endpoints first (checkout > admin)`}
          </CodeBlock>
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

