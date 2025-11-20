import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider 
} from '../../../ui/components/LessonContent';

export const reliabilityMaintainabilityLesson: SystemDesignLesson = {
  id: 'reliability-maintainability',
  slug: 'reliability-maintainability',
  title: 'Reliability & Maintainability Principles',
  description: 'Master WHEN to use circuit breakers vs retries, WHICH deployment strategy (blue-green vs canary vs rolling), and HOW to choose observability stack (metrics vs logging vs tracing) with real cost-benefit analysis',
  category: 'patterns',
  difficulty: 'intermediate',
  estimatedMinutes: 60,
  stages: [
    {
      id: 'software-errors',
      type: 'concept',
      title: 'Handling Software Errors',
      content: (
        <Section>
          <H1>Handling Software Errors</H1>
          
          <P>
            Software bugs are inevitable. The key is to design systems that handle errors gracefully 
            without <Strong>cascading failures</Strong> - where one failing component brings down the entire system.
          </P>

          <H2>Circuit Breaker Pattern</H2>

          <P>
            A <Strong>circuit breaker</Strong> prevents cascading failures by stopping requests to a failing service.
          </P>

          <Example title="How Circuit Breakers Work">
            <UL>
              <LI><Strong>Closed (Normal):</Strong> Requests flow through normally</LI>
              <LI><Strong>Open (Failing):</Strong> After N consecutive failures, circuit opens - requests fail fast</LI>
              <LI><Strong>Half-Open (Testing):</Strong> After timeout, allow one request to test if service recovered</LI>
            </UL>
          </Example>

          <CodeBlock>
{`Example: Recommendation Service Circuit Breaker

Normal flow:
  User request → App Server → Recommendation Service → Return results

Service starts failing:
  User request → App Server → Recommendation Service ❌ (timeout)
  After 5 failures → Circuit opens

Circuit open:
  User request → App Server → Circuit breaker → Return cached/default recommendations
  (No call to failing service)`}
          </CodeBlock>

          <KeyPoint>
            <Strong>Benefit:</Strong> If recommendation service is slow, don't let it slow down the entire page. 
            Return cached recommendations instead.
          </KeyPoint>

          <H2>Request Timeouts</H2>

          <P>
            Always set timeouts on service calls. A hanging request can exhaust connection pools and 
            cause cascading failures.
          </P>

          <UL>
            <LI><Strong>Database queries:</Strong> 1-5 seconds</LI>
            <LI><Strong>API calls:</Strong> 3-10 seconds</LI>
            <LI><Strong>Cache lookups:</Strong> 100-500ms</LI>
          </UL>

          <H2>Resource Limits</H2>

          <P>
            Prevent resource exhaustion by setting limits:
          </P>

          <UL>
            <LI><Strong>Max connections:</Strong> Limit connections per service (e.g., 100)</LI>
            <LI><Strong>Memory limits:</Strong> Set container memory limits</LI>
            <LI><Strong>Rate limiting:</Strong> Prevent one user from overwhelming the system</LI>
          </UL>

          <H2>Graceful Degradation</H2>

          <P>
            When a dependency fails, return partial or cached data instead of failing completely.
          </P>

          <Example title="E-commerce Product Page">
            <UL>
              <LI>Product details: Required (fail if unavailable)</LI>
              <LI>Recommendations: Optional (show cached or skip if service fails)</LI>
              <LI>Reviews: Optional (show "Loading..." if service fails)</LI>
              <LI>Inventory: Required (fail if unavailable)</LI>
            </UL>
          </Example>
        </Section>
      ),
    },
    {
      id: 'reliability-tradeoffs',
      type: 'concept',
      title: 'Reliability Trade-Offs',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Circuit Breaker vs Retry vs Fail Fast</H1>

          <ComparisonTable
            headers={['Strategy', 'Latency Impact', 'Complexity', 'Cost/mo', 'Prevents Cascading Failures', 'Best For', 'Worst For']}
            rows={[
              [
                'Fail Fast\n(no retry)',
                'Low\n50-100ms',
                'Very Low',
                '$0\n(built-in)',
                'No',
                '• Non-critical features\n• Known to be down\n• User-facing errors OK',
                '• Critical operations\n• Transient failures\n• Payment processing'
              ],
              [
                'Retry with Backoff',
                'High\n200ms-5s\n(3 retries)',
                'Low',
                '$0\n(built-in)',
                'Partially\n(with limits)',
                '• Transient network errors\n• Database deadlocks\n• Idempotent operations',
                '• Non-idempotent ops\n• Downstream already overloaded\n• Tight latency SLA'
              ],
              [
                'Circuit Breaker\n(Hystrix, Resilience4j)',
                'Low\n50-100ms\n(fails fast when open)',
                'Medium',
                '$100-300/mo\n(monitoring)',
                'Yes',
                '• Microservices\n• External APIs\n• Non-critical dependencies',
                '• Single monolith\n• Critical path\n• Need all data'
              ],
              [
                'Circuit Breaker + Fallback\n(with cache)',
                'Low\n50-100ms\n(serves cached)',
                'High',
                '$300-800/mo\n(circuit + cache)',
                'Yes',
                '• Recommendations\n• User preferences\n• Analytics data',
                '• Real-time inventory\n• Payment processing\n• Stale data unacceptable'
              ]
            ]}
          />

          <Example title="Real Decision: E-commerce Product Recommendations">
            <P><Strong>Scenario:</Strong> Recommendation service sometimes slow (500ms-2s), sometimes down</P>

            <P><Strong>Option 1: Fail Fast (wrong for user experience)</Strong></P>
            <CodeBlock>
{`Implementation:
try {
  recommendations = await recommendationService.get(userId, {timeout: 100ms});
} catch (error) {
  recommendations = []; // Empty array
}

Result:
- Latency: 100ms (good)
- User sees empty recommendations section (bad UX)
- No cache, no fallback

Impact:
- Conversion rate drops 2% when recommendations fail
- Lost revenue: $10k/month for $500k/mo GMV site
Result: ❌ Fast but poor user experience`}
            </CodeBlock>

            <P><Strong>Option 2: Retry with Backoff (wrong for already slow service)</Strong></P>
            <CodeBlock>
{`Implementation:
try {
  recommendations = await retry(
    () => recommendationService.get(userId),
    {maxAttempts: 3, backoff: [100ms, 500ms, 1s]}
  );
} catch (error) {
  recommendations = [];
}

Result when service is slow (500ms):
- First attempt: 500ms
- Second attempt: 500ms + 100ms wait = 600ms
- Third attempt: 500ms + 500ms wait = 1000ms
- Total latency: 2.6 seconds (terrible!)

Result when service is down:
- 3 failed attempts → 3x load on already failing service
- Makes outage worse (thundering herd)

Result: ❌ Retries make slow/failing service worse`}
            </CodeBlock>

            <P><Strong>Option 3: Circuit Breaker + Cached Fallback (correct choice)</Strong></P>
            <CodeBlock>
{`Implementation:
circuitBreaker = new CircuitBreaker({
  failureThreshold: 5,  // Open after 5 failures
  timeout: 200ms,
  resetTimeout: 30s
});

try {
  recommendations = await circuitBreaker.execute(
    () => recommendationService.get(userId)
  );
} catch (error) {
  // Serve cached popular items for user's category
  recommendations = await cache.get(\`rec_fallback_\${userCategory}\`);
}

Cost:
- Circuit breaker library: Free (Resilience4j)
- Redis cache for fallbacks: $50/mo (1GB)
- Monitoring (Prometheus + Grafana): $100/mo

Total: $150/mo

Results when service is slow/down:
1. First 5 requests timeout at 200ms → Circuit opens
2. Next requests fail fast (2ms) → Serve cached recommendations
3. After 30s, try one request to test recovery
4. User sees relevant cached recommendations (90% as good as real-time)

Impact:
- Page load time: 200ms → 50ms when circuit open
- Conversion rate: Stays steady (cached recs still relevant)
- Revenue protected: $10k/month saved

Trade-off: $150/mo + complexity vs $10k/mo lost revenue + poor UX

Result: ✅ Spend $150/mo to protect $10k/mo revenue (67x ROI)`}
            </CodeBlock>
          </Example>

          <Divider />

          <H1>🎯 Critical Trade-Off: Blue-Green vs Canary vs Rolling Deployment</H1>

          <ComparisonTable
            headers={['Strategy', 'Downtime', 'Rollback Speed', 'Cost', 'Risk Exposure', 'Infrastructure Needed', 'Best For']}
            rows={[
              [
                'Blue-Green\nDeployment',
                'Zero\n(instant switch)',
                'Instant\n(switch back)',
                '2x infra\n+100% cost',
                'High\n(all users at once)',
                '2x full production',
                '• Instant rollback critical\n• Can afford 2x infra\n• Need zero downtime'
              ],
              [
                'Canary\nDeployment',
                'Zero\n(gradual rollout)',
                'Fast\n(stop rollout)',
                '+10% infra\n(for canary)',
                'Low\n(5-25% users)',
                'Small canary cluster',
                '• Risk mitigation priority\n• OK with gradual rollout\n• Need metrics validation'
              ],
              [
                'Rolling\nDeployment',
                'Zero\n(rolling update)',
                'Slow\n(reverse roll)',
                'Same infra\n$0 extra',
                'Medium\n(gradual exposure)',
                'Same as production',
                '• Cost-sensitive\n• Can tolerate slow rollback\n• Stateless services'
              ],
              [
                'Recreate\n(stop then start)',
                'High\n(5-30 min)',
                'Medium\n(redeploy old)',
                'Same infra\n$0 extra',
                'High\n(all users)',
                'Same as production',
                '• Dev/staging only\n• Scheduled maintenance OK\n• Cost priority > uptime'
              ]
            ]}
          />

          <Example title="Real Decision: SaaS Platform with 50k Active Users">
            <P><Strong>Infrastructure Cost Context:</Strong></P>
            <CodeBlock>
{`Current production environment:
- 10 EC2 instances (r6g.2xlarge): $3,000/mo
- Load balancer: $100/mo
- Total: $3,100/mo`}
            </CodeBlock>

            <P><Strong>Option 1: Blue-Green Deployment (too expensive for this case)</Strong></P>
            <CodeBlock>
{`Infrastructure:
- Blue environment: 10 instances = $3,000/mo
- Green environment: 10 instances = $3,000/mo
- Load balancer: $100/mo
- Total: $6,100/mo (+97% cost increase)

Deployment process:
1. Deploy to green (new version)
2. Test green environment
3. Switch load balancer: blue → green (instant)
4. Keep blue running for 24h for rollback
5. Terminate blue

Benefits:
- Instant rollback (switch load balancer back)
- Zero downtime
- Full testing before switch

Cost analysis:
- Extra cost: $3,000/mo permanent (keep both running)
- OR: $100 per deployment (run green for 1 day, then terminate)
- Deploys: 3x/week = 12x/month
- Deployment cost: $1,200/mo (39% increase)

Trade-off: For 50k users, instant rollback not worth 39-97% cost increase

Result: ❌ Too expensive for this scale`}
            </CodeBlock>

            <P><Strong>Option 2: Canary Deployment (correct choice for this case)</Strong></P>
            <CodeBlock>
{`Infrastructure:
- Production: 10 instances = $3,000/mo
- Canary: 1 instance = $300/mo
- Load balancer (weighted routing): $100/mo
- Total: $3,400/mo (+10% cost increase)

Deployment process:
Day 1: Deploy to canary (1 instance)
  - Route 5% traffic (2,500 users)
  - Monitor: error rate, latency, success rate
  - If OK after 4 hours → proceed

Day 1 (evening): Expand to 3 instances
  - Route 25% traffic (12,500 users)
  - Monitor overnight
  - If OK → proceed

Day 2: Full rollout
  - Deploy to remaining 7 instances
  - Route 100% traffic

Rollback capability:
- If canary fails: Stop rollout, route 100% to old version (5 min)
- If discovered after full rollout: Redeploy old version (15 min)

Metrics validation:
- Error rate: <0.1% (baseline: 0.05%)
- p95 latency: <200ms (baseline: 150ms)
- Conversion rate: within 2% of baseline

Cost analysis:
- Extra cost: $300/mo (10% increase)
- Risk mitigation: Only 2,500 users exposed initially (5%)
- If bad deploy caught early: Save $50k/month in lost revenue

Real incident example:
- Deploy introduced bug affecting checkout
- Caught at 5% rollout (2,500 users affected)
- Rollback in 5 minutes
- Lost revenue: ~$2k (vs $50k if full rollout)

Trade-off: $300/mo + 2-day rollout vs $50k incident mitigation

Result: ✅ Spend $300/mo to catch bugs before full rollout (167x ROI)`}
            </CodeBlock>

            <P><Strong>Option 3: Rolling Deployment (wrong for this risk profile)</Strong></P>
            <CodeBlock>
{`Infrastructure:
- Same 10 instances: $3,000/mo
- Total: $3,000/mo ($0 increase)

Deployment process:
1. Deploy to 2 instances (20% traffic)
2. Wait 5 minutes, check metrics
3. Deploy to next 2 instances (40% traffic)
4. Continue until all 10 instances updated
5. Total time: ~30 minutes

Problem with rolling:
- No explicit validation gates
- By the time you notice issues, 6-8 instances already updated (60-80% users)
- Rollback requires reverse rolling update (another 30 min)

Real incident:
- Deploy introduced memory leak
- By time leak noticed (20 min), 8 instances updated
- 80% of users affected = 40k users
- Rollback took 30 min (reverse roll)
- Total impact: 50 minutes affecting 40k users
- Lost revenue: $25k

Trade-off: $0 extra cost vs $25k lost revenue from insufficient validation

Result: ❌ Saved $300/mo, lost $25k in one incident`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Decision Framework:</Strong> For 50k users with high revenue per user, canary wins.
              The $300/mo cost provides explicit validation gates that catch bugs before widespread impact.
            </KeyPoint>
          </Example>

          <H3>Decision Framework: Choosing Deployment Strategy</H3>
          <CodeBlock>
{`What's your rollback priority and budget?

Instant rollback required? (payment systems, critical infra)
├─ YES → Blue-Green Deployment
│   └─ Can afford 2x infrastructure?
│       ├─ YES → Full blue-green (keep both running)
│       │   └─ Cost: +100% infrastructure
│       │   └─ Benefit: Instant switch back
│       └─ NO → Ephemeral blue-green (terminate old after 24h)
│           └─ Cost: +~30-40% (old runs 1 day per deploy)
│           └─ Benefit: 24h instant rollback window
│
└─ NO → Need gradual risk mitigation?
    ├─ YES → Canary Deployment
    │   └─ Revenue per user high? (SaaS, e-commerce)
    │       ├─ YES → Canary with metrics validation
    │       │   └─ Cost: +10% infrastructure
    │       │   └─ Benefit: Catch bugs at 5-25% exposure
    │       └─ NO → Rolling with health checks
    │           └─ Cost: $0 extra
    │           └─ Benefit: Gradual rollout, automatic pause on failure
    │
    └─ NO → Cost is priority #1?
        └─ Rolling Deployment (Kubernetes default)
            └─ Cost: $0 extra
            └─ Risk: 50-80% users may see bug before detection`}
          </CodeBlock>

          <Divider />

          <H1>🎯 Critical Trade-Off: Monitoring vs Logging vs Distributed Tracing</H1>

          <ComparisonTable
            headers={['Approach', 'Use Case', 'Data Volume', 'Cost/mo (1M req/day)', 'Retention', 'Query Speed', 'Best For']}
            rows={[
              [
                'Metrics\n(Prometheus)',
                'Aggregate stats\n(error rate, latency)',
                'Very Low\n~1GB',
                '$50-100\n(storage)',
                '15-90 days',
                'Very Fast\n<1s',
                '• Alerting\n• Dashboards\n• Trends over time\n• SLA monitoring'
              ],
              [
                'Logging\n(Elasticsearch)',
                'Event details\n(errors, user actions)',
                'High\n~100GB',
                '$500-1,500\n(storage + compute)',
                '7-30 days',
                'Medium\n1-10s',
                '• Debugging errors\n• Audit trails\n• User behavior\n• Security'
              ],
              [
                'Distributed Tracing\n(Jaeger, Zipkin)',
                'Request flow\nacross services',
                'Very High\n~500GB',
                '$1,000-3,000\n(storage + compute)',
                '1-7 days',
                'Fast\n1-3s',
                '• Microservices\n• Latency debugging\n• Dependency analysis\n• Performance'
              ],
              [
                'Full Observability\n(Datadog, New Relic)',
                'All of above\nintegrated',
                'Very High\n~600GB',
                '$2,000-5,000\n(all-in-one)',
                '30-90 days',
                'Fast\n<3s',
                '• Large teams\n• Complex systems\n• Budget available\n• Need correlation'
              ]
            ]}
          />

          <Example title="Real Decision: 10 Microservices, 1M Requests/Day">
            <P><Strong>Option 1: Metrics Only (insufficient for microservices)</Strong></P>
            <CodeBlock>
{`Stack:
- Prometheus: Free (self-hosted)
- Grafana: Free
- Infrastructure: $50/mo (1 small EC2 for Prometheus)

What you can see:
- Error rate per service: 0.5%
- p95 latency: 250ms
- Request volume: 1M/day

What you CAN'T see:
- Which specific requests failed?
- Why did they fail?
- Which service in the chain caused the error?
- What was the user's request payload?

Real incident:
- Error rate spiked to 2% (4x baseline)
- Which service? Unknown (need to check logs)
- Why? Unknown (need to trace request flow)
- User impact? Unknown (need user IDs from logs)
- Time to diagnose: 2 hours (manual log grep across 10 services)

Result: ❌ Too limited for microservices debugging`}
            </CodeBlock>

            <P><Strong>Option 2: Metrics + Logging (correct for most teams)</Strong></P>
            <CodeBlock>
{`Stack:
- Prometheus + Grafana: $50/mo
- Elasticsearch (3 nodes): $400/mo (100GB/month logs)
- Kibana: Free
- Total: $450/mo

What you can see:
- Metrics: Error rate, latency, volume (for alerting)
- Logs: Specific error messages, stack traces, user IDs

Workflow:
1. Alert fires: "Error rate >1% on checkout-service"
2. Check Grafana: Spike started at 10:05 AM
3. Query Kibana: "checkout-service AND timestamp:[10:05 TO 10:10]"
4. Find errors: "Payment gateway timeout after 5s"
5. Root cause: Payment gateway deployed new version at 10:05
6. Time to diagnose: 10 minutes

Cost breakdown:
- Elasticsearch: $400/mo
- Prometheus: $50/mo
- Total: $450/mo

Incident cost saved:
- Without logs: 2 hours to diagnose = $400 engineering time + revenue loss
- With logs: 10 min to diagnose = $30 engineering time
- Saves: ~$370 per incident
- At 2 incidents/month: $740/mo saved vs $450/mo spent

Trade-off: $450/mo for faster debugging vs 2 hours manual log grep per incident

Result: ✅ ROI: 1.6x even at just 2 incidents/month`}
            </CodeBlock>

            <P><Strong>Option 3: Full Observability with Tracing (only for complex cases)</Strong></P>
            <CodeBlock>
{`Stack:
- Datadog (all-in-one): $2,500/mo (10 hosts, 1M req/day)
  OR
- Self-hosted: Prometheus + Elasticsearch + Jaeger: $1,200/mo

What tracing adds:
- See exact request flow: API Gateway → Auth → Product → Inventory → Payment
- Latency breakdown: Which service added how much latency
- Dependency map: Automatically visualize service dependencies

When you need tracing:
- >5 microservices (complex request flows)
- Latency SLA <200ms (need to optimize each hop)
- Frequent cross-service debugging

Example value:
- p95 latency is 800ms (target: 200ms)
- Tracing shows: Inventory service takes 600ms (75% of total)
- Root cause: N+1 query problem (50 DB calls per request)
- Fix: Batch queries → reduce to 2 DB calls
- Result: p95 latency now 180ms

Cost analysis:
- Tracing cost: +$750/mo vs metrics + logging ($1,200 vs $450)
- Performance improvement: 800ms → 180ms (4.4x faster)
- Conversion rate increase: 1% (every 100ms latency = 0.5% conversion)
- Revenue increase: $15k/mo (for $1.5M/mo GMV site)

Trade-off: $750/mo extra vs $15k/mo revenue increase

Result: ✅ ROI: 20x for high-value optimization use cases

But for typical debugging: ❌ Tracing is overkill, logs are sufficient`}
            </CodeBlock>
          </Example>

          <H3>Decision Framework: Choosing Observability Stack</H3>
          <CodeBlock>
{`How many services do you have?

├─ 1-2 services (monolith or simple)
│   └─ Metrics only (Prometheus + Grafana)
│       └─ Cost: $50/mo
│       └─ Sufficient for: Alerting, dashboards, trends
│
├─ 3-10 services (standard microservices)
│   └─ Metrics + Logging (Prometheus + Elasticsearch)
│       └─ Cost: $400-600/mo
│       └─ Adds: Error debugging, user context, audit trails
│       └─ Sufficient for: 80% of debugging needs
│
└─ >10 services OR latency SLA <200ms
    └─ Need to optimize cross-service latency?
        ├─ YES → Full observability (add Distributed Tracing)
        │   └─ Cost: $1,200-2,500/mo
        │   └─ Adds: Request flow visualization, latency breakdown
        │   └─ ROI: Only if latency optimization drives revenue
        │
        └─ NO → Stick with Metrics + Logging
            └─ Add tracing only when debugging complex latency issues`}
          </CodeBlock>

          <H2>Common Mistakes</H2>

          <P>❌ <Strong>Mistake 1: No Circuit Breakers for External APIs</Strong></P>
          <CodeBlock>
{`Problem:
- External recommendation API goes down
- Every request retries 3 times with 5s timeout = 15s
- Connection pool exhausted
- Entire site slows to crawl

Fix: Add circuit breaker with 200ms timeout and cached fallback`}
          </CodeBlock>

          <P>❌ <Strong>Mistake 2: Blue-Green Deployment for Cost-Sensitive Startup</Strong></P>
          <CodeBlock>
{`Problem:
- Startup with $5k/mo infrastructure budget
- Implements blue-green → $10k/mo (2x cost)
- Only deploys 1x/week → instant rollback rarely needed
- Cash burn doubles for minimal benefit

Fix: Use canary deployment ($5.5k/mo, only 10% increase)`}
          </CodeBlock>

          <P>❌ <Strong>Mistake 3: Only Metrics, No Logs</Strong></P>
          <CodeBlock>
{`Problem:
- See error rate spike in Grafana
- No logs → can't see which users affected
- Can't see error messages or stack traces
- 2 hours spent SSH-ing into servers to grep logs

Fix: Add centralized logging (Elasticsearch or CloudWatch Logs)`}
          </CodeBlock>

          <P>❌ <Strong>Mistake 4: Full Tracing for 3 Microservices</Strong></P>
          <CodeBlock>
{`Problem:
- Only 3 services, simple request flow
- Implemented Jaeger + Zipkin: $800/mo infrastructure
- Tracing used once every 2 months for latency debugging
- Logs would have been sufficient

Fix: Start with logs, add tracing only when needed (>5 services)`}
          </CodeBlock>
        </Section>
      ),
    },
    {
      id: 'human-errors',
      type: 'concept',
      title: 'Designing for Human Errors',
      content: (
        <Section>
          <H1>Designing for Human Errors</H1>

          <P>
            Most outages are caused by human errors, not hardware failures. Design systems that 
            make mistakes hard to make and easy to recover from.
          </P>

          <H2>Deployment Strategies</H2>

          <H3>1. Blue-Green Deployment</H3>

          <P>
            Run two identical production environments (blue = current, green = new). Switch traffic 
            instantly between them.
          </P>

          <Example title="Blue-Green Deployment">
            <CodeBlock>
{`Step 1: Deploy new version to green environment
Step 2: Test green environment
Step 3: Switch load balancer from blue → green
Step 4: Monitor green environment
Step 5: If issues → Switch back to blue (instant rollback!)
Step 6: If OK → Keep green, blue becomes next green`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Benefit:</Strong> Zero-downtime deployments and instant rollback if something goes wrong.
          </KeyPoint>

          <H3>2. Canary Deployment</H3>

          <P>
            Deploy new version to a small percentage of users first (e.g., 5%), then gradually increase.
          </P>

          <Example title="Canary Deployment">
            <CodeBlock>
{`Day 1: Deploy to 5% of users
  → Monitor metrics (error rate, latency)
  → If OK, continue to Day 2

Day 2: Deploy to 25% of users
  → Monitor metrics
  → If OK, continue to Day 3

Day 3: Deploy to 100% of users
  → Full rollout`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Benefit:</Strong> Catch bugs early with minimal impact. If 5% of users see errors, 
            you can rollback before affecting everyone.
          </KeyPoint>

          <H2>Environment Separation</H2>

          <UL>
            <LI><Strong>Development:</Strong> For developers to test locally</LI>
            <LI><Strong>Staging:</Strong> Production-like environment for testing before production</LI>
            <LI><Strong>Production:</Strong> Live environment serving real users</LI>
          </UL>

          <KeyPoint>
            <Strong>Rule:</Strong> Always deploy to staging first, test thoroughly, then deploy to production.
          </KeyPoint>

          <H2>Safeguards Against Mistakes</H2>

          <UL>
            <LI><Strong>Confirmation prompts:</Strong> Require typing "DELETE" or "DROP DATABASE" to confirm destructive actions</LI>
            <LI><Strong>Read-only mode:</Strong> Make production databases read-only by default</LI>
            <LI><Strong>Feature flags:</Strong> Enable new features gradually, disable instantly if issues</LI>
            <LI><Strong>Audit logs:</Strong> Track who did what and when</LI>
          </UL>
        </Section>
      ),
    },
    {
      id: 'chaos-engineering',
      type: 'concept',
      title: 'Chaos Engineering',
      content: (
        <Section>
          <H1>Chaos Engineering</H1>

          <P>
            <Strong>Chaos engineering</Strong> is the practice of intentionally injecting failures into 
            production systems to verify they handle failures gracefully. Made famous by Netflix's Chaos Monkey.
          </P>

          <H2>Why Chaos Engineering?</H2>

          <P>
            You can't test for every possible failure scenario. Chaos engineering helps you discover 
            weaknesses before they cause real outages.
          </P>

          <KeyPoint>
            <Strong>Principle:</Strong> If you don't test failure scenarios, you'll discover them during 
            real outages when it's too late.
          </KeyPoint>

          <H2>Common Chaos Experiments</H2>

          <H3>1. Chaos Monkey - Random Server Termination</H3>

          <P>
            Randomly terminate a small percentage of servers (e.g., 1%) during business hours.
          </P>

          <Example title="Netflix Chaos Monkey">
            <P>
              Netflix runs Chaos Monkey during business hours. It randomly terminates EC2 instances 
              to ensure their system can handle server failures gracefully.
            </P>
          </Example>

          <H3>2. Latency Monkey - Network Delays</H3>

          <P>
            Inject random network latency (100-500ms) to simulate slow networks or network congestion.
          </P>

          <H3>3. Packet Loss Monkey</H3>

          <P>
            Drop a small percentage of network packets (e.g., 1%) to test how the system handles 
            network issues.
          </P>

          <H3>4. Disk Fill Monkey</H3>

          <P>
            Fill disks to 95% capacity to test how the system handles disk space issues.
          </P>

          <H2>Chaos Engineering Best Practices</H2>

          <UL>
            <LI><Strong>Start small:</Strong> Begin with 1% of servers, gradually increase</LI>
            <LI><Strong>Monitor closely:</Strong> Watch error rates, latency, availability during experiments</LI>
            <LI><Strong>Have a kill switch:</Strong> Ability to stop experiments instantly if things go wrong</LI>
            <LI><Strong>Document findings:</Strong> Record what broke and how you fixed it</LI>
            <LI><Strong>Automate:</Strong> Run experiments regularly, not just once</LI>
          </UL>

          <KeyPoint>
            <Strong>Goal:</Strong> Not to break things, but to discover weaknesses and fix them before 
            real failures occur.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'simplicity',
      type: 'concept',
      title: 'Simplicity - Avoiding Complexity',
      content: (
        <Section>
          <H1>Simplicity - Avoiding Complexity</H1>

          <P>
            <Strong>Complexity is the enemy of maintainability.</Strong> Simple systems are easier to 
            understand, debug, and modify.
          </P>

          <H2>Accidental vs Essential Complexity</H2>

          <UL>
            <LI><Strong>Essential complexity:</Strong> Inherent to the problem (e.g., distributed consensus)</LI>
            <LI><Strong>Accidental complexity:</Strong> Added by poor design choices (e.g., custom distributed consensus when ZooKeeper exists)</LI>
          </UL>

          <KeyPoint>
            <Strong>Rule:</Strong> Don't add accidental complexity. Use proven solutions instead of building custom ones.
          </KeyPoint>

          <H2>Use Proven Solutions</H2>

          <Example title="Don't Reinvent the Wheel">
            <UL>
              <LI>❌ <Strong>Don't:</Strong> Build custom distributed consensus algorithm</LI>
              <LI>✅ <Strong>Do:</Strong> Use ZooKeeper, etcd, or Consul</LI>
              <LI>❌ <Strong>Don't:</Strong> Build custom message queue</LI>
              <LI>✅ <Strong>Do:</Strong> Use RabbitMQ, Kafka, or AWS SQS</LI>
              <LI>❌ <Strong>Don't:</Strong> Build custom database</LI>
              <LI>✅ <Strong>Do:</Strong> Use PostgreSQL, Redis, MongoDB</LI>
            </UL>
          </Example>

          <H2>Clear Abstractions</H2>

          <P>
            Use clear abstraction layers to hide complexity:
          </P>

          <CodeBlock>
{`API Layer (REST endpoints)
  ↓
Service Layer (business logic)
  ↓
Repository Layer (data access)
  ↓
Database Layer (PostgreSQL, Redis)`}
          </CodeBlock>

          <H2>Standard Patterns</H2>

          <UL>
            <LI><Strong>MVC (Model-View-Controller):</Strong> Separate concerns</LI>
            <LI><Strong>Repository Pattern:</Strong> Abstract data access</LI>
            <LI><Strong>Factory Pattern:</Strong> Create objects without exposing creation logic</LI>
            <LI><Strong>Dependency Injection:</Strong> Make code testable and flexible</LI>
          </UL>

          <H2>Keep Interfaces Simple</H2>

          <P>
            Simple interfaces are easier to understand and use:
          </P>

          <Example title="Simple vs Complex API">
            <P>
              <Strong>Simple:</Strong> <Code>GET /users/:id</Code> - Returns user data
            </P>
            <P>
              <Strong>Complex:</Strong> <Code>POST /api/v2/data/users/retrieve?format=json&include=profile,settings&exclude=password&version=2.1</Code>
            </P>
          </Example>
        </Section>
      ),
    },
    {
      id: 'evolvability',
      type: 'concept',
      title: 'Evolvability - Design for Change',
      content: (
        <Section>
          <H1>Evolvability - Design for Change</H1>

          <P>
            Systems must evolve over time. Design for change by using loose coupling, versioned APIs, 
            and backward compatibility.
          </P>

          <H2>API Versioning</H2>

          <P>
            Version your APIs to allow changes without breaking existing clients.
          </P>

          <Example title="API Versioning">
            <CodeBlock>
{`/api/v1/users  → Old version (still supported)
/api/v2/users  → New version (adds new fields)

Clients can migrate gradually:
  - Old clients continue using v1
  - New clients use v2
  - Eventually deprecate v1`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Best Practice:</Strong> Maintain n-1 versions (current + previous) to give clients 
            time to migrate.
          </KeyPoint>

          <H2>Feature Flags</H2>

          <P>
            Use feature flags to enable/disable features without deploying new code.
          </P>

          <Example title="Feature Flags">
            <CodeBlock>
{`if (featureFlag.isEnabled('new-checkout-flow', userId)) {
  // Use new checkout flow
} else {
  // Use old checkout flow
}

Benefits:
  - Enable for 5% of users first
  - Monitor metrics
  - Disable instantly if issues
  - No code deployment needed`}
            </CodeBlock>
          </Example>

          <H2>Schema Evolution</H2>

          <P>
            Design database schemas that can evolve without breaking existing code.
          </P>

          <UL>
            <LI><Strong>Add nullable columns:</Strong> New fields can be null for old records</LI>
            <LI><Strong>Never remove columns:</Strong> Mark as deprecated, stop using, remove later</LI>
            <LI><Strong>Use migrations:</Strong> Version control schema changes</LI>
            <LI><Strong>Backward compatible:</Strong> Old code should work with new schema</LI>
          </UL>

          <H2>Loose Coupling</H2>

          <P>
            Services should depend on interfaces, not implementations. This allows you to change 
            implementations without affecting dependents.
          </P>

          <Example title="Loose Coupling">
            <CodeBlock>
{`Tight Coupling (Bad):
  Service A directly calls Service B's internal methods
  → Changing Service B breaks Service A

Loose Coupling (Good):
  Service A calls Service B's public API
  → Service B can change internals without affecting Service A`}
            </CodeBlock>
          </Example>
        </Section>
      ),
    },
    {
      id: 'technical-debt',
      type: 'concept',
      title: 'Managing Technical Debt',
      content: (
        <Section>
          <H1>Managing Technical Debt</H1>

          <P>
            <Strong>Technical debt</Strong> is the cost of shortcuts and quick fixes. Like financial debt, 
            it accumulates interest over time. Manage it systematically.
          </P>

          <H2>What is Technical Debt?</H2>

          <UL>
            <LI><Strong>Code smells:</Strong> Duplicated code, long methods, complex logic</LI>
            <LI><Strong>Outdated dependencies:</Strong> Old libraries with security vulnerabilities</LI>
            <LI><Strong>Poor architecture:</Strong> Tight coupling, unclear abstractions</LI>
            <LI><Strong>Missing tests:</Strong> Low test coverage, untested critical paths</LI>
            <LI><Strong>Documentation:</Strong> Missing or outdated documentation</LI>
          </UL>

          <H2>Tracking Technical Debt</H2>

          <P>
            Use tools to measure and track technical debt:
          </P>

          <UL>
            <LI><Strong>Code coverage:</Strong> Target &gt;80% test coverage</LI>
            <LI><Strong>Code duplication:</Strong> Keep &lt;5% duplicate code</LI>
            <LI><Strong>Cyclomatic complexity:</Strong> Keep &lt;10 per function</LI>
            <LI><Strong>Dependency freshness:</Strong> Regular security audits</LI>
          </UL>

          <H2>The 20% Rule</H2>

          <P>
            Allocate 20% of each sprint to technical debt reduction. This prevents debt from accumulating.
          </P>

          <Example title="Sprint Planning">
            <CodeBlock>
{`2-week sprint (10 days):
  - 8 days: New features
  - 2 days: Technical debt reduction

Examples:
  - Refactor complex function
  - Update dependencies
  - Add missing tests
  - Improve documentation`}
            </CodeBlock>
          </Example>

          <H2>Incremental Refactoring</H2>

          <P>
            Don't try to fix everything at once. Refactor incrementally in small PRs:
          </P>

          <UL>
            <LI>One function at a time</LI>
            <LI>One module at a time</LI>
            <LI>One service at a time</LI>
          </UL>

          <KeyPoint>
            <Strong>Principle:</Strong> Small, frequent refactoring is better than big rewrites.
          </KeyPoint>

          <H2>When to Pay Down Debt</H2>

          <UL>
            <LI><Strong>Before adding features:</Strong> Clean up code in the area you're modifying</LI>
            <LI><Strong>When it blocks progress:</Strong> If debt is slowing down development</LI>
            <LI><Strong>Security vulnerabilities:</Strong> Update dependencies immediately</LI>
            <LI><Strong>Regular maintenance:</Strong> Use the 20% rule</LI>
          </UL>
        </Section>
      ),
    },
  ],
};

