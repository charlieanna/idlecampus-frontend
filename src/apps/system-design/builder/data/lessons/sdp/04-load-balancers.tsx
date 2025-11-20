import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpLoadBalancersLesson: SystemDesignLesson = {
  id: 'sdp-load-balancers',
  slug: 'sdp-load-balancers',
  title: 'Load Balancers',
  description: 'Master load balancing fundamentals and critical trade-offs: WHEN to use Layer 4 vs Layer 7 (throughput vs features), WHICH algorithm fits your traffic pattern, HOW to choose managed vs self-hosted for optimal cost/performance.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 65,
  stages: [
    {
      id: 'intro-load-balancers',
      type: 'concept',
      title: 'What is a Load Balancer?',
      content: (
        <Section>
          <H1>What is a Load Balancer?</H1>
          <P>
            A <Strong>Load Balancer</Strong> distributes incoming requests across multiple servers to improve
            performance, availability, and scalability.
          </P>

          <H2>Layer 4 (Transport Layer) Load Balancing</H2>
          <P>
            Operates at TCP/UDP level. Routes based on IP address and port. Fast but limited visibility.
          </P>
          <UL>
            <LI>Routes based on source IP, destination IP, ports</LI>
            <LI>No knowledge of HTTP/application layer</LI>
            <LI>Faster (less processing)</LI>
            <LI>Example: AWS Network Load Balancer</LI>
          </UL>

          <H2>Layer 7 (Application Layer) Load Balancing</H2>
          <P>
            Operates at HTTP/HTTPS level. Routes based on URL path, headers, cookies. More intelligent routing.
          </P>
          <UL>
            <LI>Routes based on URL path, HTTP headers, cookies</LI>
            <LI>Can do SSL termination, content-based routing</LI>
            <LI>Slower (more processing) but more flexible</LI>
            <LI>Example: AWS Application Load Balancer, NGINX</LI>
          </UL>

          <ComparisonTable
            headers={['Aspect', 'Layer 4', 'Layer 7']}
            rows={[
              ['OSI Layer', 'Transport (TCP/UDP)', 'Application (HTTP)'],
              ['Routing', 'IP + Port', 'URL, Headers, Cookies'],
              ['Performance', 'Faster', 'Slower'],
              ['Flexibility', 'Limited', 'High'],
              ['SSL Termination', 'No', 'Yes'],
              ['Use Case', 'High throughput', 'Content-based routing'],
            ]}
          />

          <H2>Load Balancing Algorithms</H2>
          <UL>
            <LI><Strong>Round Robin:</Strong> Distribute requests sequentially (1→2→3→1→2→3)</LI>
            <LI><Strong>Least Connections:</Strong> Route to server with fewest active connections</LI>
            <LI><Strong>IP Hash:</Strong> Hash client IP to always route to same server (session affinity)</LI>
            <LI><Strong>Weighted Round Robin:</Strong> Round robin with different weights per server</LI>
            <LI><Strong>Least Response Time:</Strong> Route to server with lowest latency</LI>
          </UL>

          <H2>Health Checks</H2>
          <P>
            Load balancer periodically checks if servers are healthy:
          </P>
          <UL>
            <LI>Send HTTP request to /health endpoint</LI>
            <LI>If server fails health check, remove from pool</LI>
            <LI>When server recovers, add back to pool</LI>
            <LI>Prevents routing to unhealthy servers</LI>
          </UL>

          <H2>Session Affinity (Sticky Sessions)</H2>
          <P>
            Route same user to same server to maintain session state:
          </P>
          <UL>
            <LI>Use IP hash or cookie-based routing</LI>
            <LI>Needed when session stored in server memory</LI>
            <LI>Trade-off: Less flexible (can't easily scale down)</LI>
            <LI>Better: Store session in Redis (stateless servers)</LI>
          </UL>

          <KeyPoint>
            <Strong>Best Practice:</Strong> Use Layer 7 for application routing, Layer 4 for high throughput.
            Keep servers stateless (session in Redis) to avoid sticky sessions.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'layer4-vs-layer7-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Layer 4 vs Layer 7 Load Balancing',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Layer 4 vs Layer 7 Load Balancing</H1>
          <P>
            <Strong>The Decision:</Strong> Layer 4 (TCP/UDP) is faster but less intelligent. Layer 7 (HTTP) enables
            content-based routing but adds latency and cost. The choice impacts your throughput, routing flexibility, and operational costs.
          </P>

          <H2>Layer 4 vs Layer 7 Comparison</H2>
          <ComparisonTable
            headers={['Factor', 'Layer 4 (NLB)', 'Layer 7 (ALB)', 'Hybrid (Both)']}
            rows={[
              ['Throughput', '1M+ RPS per LB', '100k RPS per LB', 'L4 for high volume, L7 for routing'],
              ['Latency', '<1ms overhead', '5-10ms overhead', '1-10ms blended'],
              ['Routing Logic', 'IP:Port only', 'Path, headers, cookies, host', 'Both available'],
              ['SSL Termination', 'Pass-through only', 'Yes (offload to LB)', 'L7 handles SSL'],
              ['WebSocket Support', 'Native', 'Requires connection upgrade', 'L4 better for WebSockets'],
              ['Monthly Cost (AWS)', '$16 + $0.006/GB', '$16 + $0.008/GB + $0.008/LCU', '$32 (both)'],
              ['Cost at 10TB/mo', '$76/mo', '$96/mo + LCU', '$172/mo'],
              ['Best For', 'Gaming, VoIP, high-throughput APIs', 'Microservices, path-based routing', 'Complex architectures'],
              ['Worst For', 'Content-based routing needs', 'Ultra-high throughput (1M+ RPS)', 'Simple single-service apps'],
            ]}
          />

          <H2>Real Decision: API Gateway Architecture</H2>
          <Example title="Layer 4 vs Layer 7 Performance Impact">
            <CodeBlock>
{`Scenario: API platform handling 500k RPS peak, 10TB/mo traffic

Layer 7 (ALB) Only:
- Max throughput: 100k RPS per ALB
- Need: 5 ALBs × $16/mo = $80/mo
- LCU cost: 500k RPS = ~500 LCU-hrs/hr
  - 500 LCU × 720 hrs × $0.008 = $2,880/mo
- Data processing: 10TB × $0.008 = $80/mo
- Total: $3,040/mo
- Latency: 5-10ms per request
- Features: Path routing (/api/v1 → service1, /api/v2 → service2)

Layer 4 (NLB) Only:
- Max throughput: 1M+ RPS per NLB
- Need: 1 NLB × $16/mo = $16/mo
- Data processing: 10TB × $0.006 = $60/mo
- Total: $76/mo
- Latency: <1ms per request
- Limitation: Can't route by path, need DNS-based routing

Hybrid (L4 → L7):
- 1 NLB (public-facing): $16/mo + $60/mo data = $76/mo
- 2 ALBs (internal routing): 2 × $16 + LCU = $32 + $600/mo
- Total: $708/mo
- Best of both: NLB handles high throughput, ALB routes internally
- Latency: 1ms (NLB) + 5ms (ALB) = 6ms

Decision:
- Layer 7 only: $3,040/mo, full routing features
- Layer 4 only: $76/mo, 40× cheaper but no path routing
- Hybrid: $708/mo, best performance + features

Savings: L4 only saves $2,964/mo (97%) vs L7 if path routing not needed
         Hybrid saves $2,332/mo (77%) vs L7 while keeping features`}
            </CodeBlock>
          </Example>

          <H2>Decision Framework</H2>
          <CodeBlock>
{`if (need_path_routing || microservices):
    return "Layer 7 (ALB)"
    # $100-3k/mo depending on RPS
    # /api/users → users-service, /api/orders → orders-service

elif (throughput > 200k RPS || latency_critical):
    return "Layer 4 (NLB)"
    # $76-200/mo, <1ms latency, 1M+ RPS capacity
    # Best for gaming, VoIP, single-service high-throughput APIs

elif (websockets || tcp_protocols):
    return "Layer 4 (NLB)"
    # Native WebSocket/TCP support
    # ALB requires connection upgrade (slower)

elif (need_ssl_termination && microservices):
    return "Hybrid: L4 (public) → L7 (internal)"
    # $700-2k/mo, NLB terminates SSL, ALB routes by path
    # Best performance + features

elif (simple_app && budget < $100/mo):
    return "Layer 7 (ALB)"
    # $16-96/mo for low traffic
    # Features outweigh cost for small apps

else:
    return "Layer 7 (ALB) - default for most web apps"
    # Path routing, SSL termination, ease of use
    # Worth $100-500/mo for typical SaaS`}
          </CodeBlock>

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Using Layer 7 for high-throughput single-service APIs</Strong>
            <P>
              Teams use ALB for simple REST API (no path routing needed) and hit 100k RPS limit, requiring 5 ALBs costing $3k/mo.
              Single NLB would handle 1M RPS for $76/mo (40× cheaper).
            </P>
            <P>
              <Strong>Fix:</Strong> If you don't need path routing, use Layer 4 (NLB). It's 10× faster and 40× cheaper at high scale.
              Only use Layer 7 when you need content-based routing or SSL termination.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Using Layer 4 for microservices without service mesh</Strong>
            <P>
              Teams use NLB to "save money" but then need separate DNS entries for each microservice (users.api.com, orders.api.com).
              This breaks single API gateway pattern and complicates client-side routing.
            </P>
            <P>
              <Strong>Fix:</Strong> For microservices, use Layer 7 (ALB) for path-based routing OR use service mesh (Istio) with Layer 4.
              Don't sacrifice architecture quality to save $50/mo.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Not using hybrid architecture for high-scale microservices</Strong>
            <P>
              High-traffic microservices use Layer 7 only and pay $3k+/mo in LCU charges when 80% of traffic goes to one service.
              Hybrid (NLB → ALB) would save $2k+/mo while maintaining routing flexibility.
            </P>
            <P>
              <Strong>Fix:</Strong> For &gt;200k RPS with microservices, use NLB (public) → ALB (internal routing). NLB handles throughput,
              ALB routes to correct service. Saves 70%+ on LCU costs.
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>ROI Example:</Strong> Layer 4 saves $2,964/mo (97%) vs Layer 7 for high-throughput single-service APIs.
            Hybrid architecture saves $2,332/mo (77%) vs Layer 7-only for high-scale microservices while maintaining routing features.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'algorithm-tradeoffs',
      type: 'concept',
      title: '🎯 Load Balancing Algorithm Trade-Offs',
      content: (
        <Section>
          <H1>🎯 Load Balancing Algorithm Trade-Offs</H1>
          <P>
            <Strong>The Decision:</Strong> Load balancing algorithms determine how requests are distributed: round-robin is simple,
            least connections handles varying load, IP hash enables session affinity. The choice impacts your performance, consistency, and complexity.
          </P>

          <H2>Algorithm Comparison</H2>
          <ComparisonTable
            headers={['Factor', 'Round Robin', 'Least Connections', 'IP Hash', 'Least Response Time', 'Weighted Round Robin']}
            rows={[
              ['Distribution', 'Even (1→2→3→1)', 'Dynamic (fewest connections)', 'Sticky (same IP → same server)', 'Dynamic (lowest latency)', 'Even with weights'],
              ['Performance', 'Fast (O(1))', 'Medium (O(n) scan)', 'Fast (O(1) hash)', 'Slow (measures latency)', 'Fast (O(1))'],
              ['Load Balance Quality', 'Poor (assumes equal requests)', 'Good (adapts to load)', 'Poor (uneven if traffic skewed)', 'Best (real-time optimization)', 'Good (manual tuning)'],
              ['Session Affinity', 'No', 'No', 'Yes (same IP sticky)', 'No', 'No'],
              ['Use Case', 'Uniform requests, stateless', 'Long-lived connections (WebSocket)', 'Stateful sessions (legacy apps)', 'Latency-sensitive apps', 'Heterogeneous servers'],
              ['Complexity', 'Trivial', 'Low', 'Low', 'High (health checks)', 'Medium (configure weights)'],
              ['Best For', 'Stateless microservices', 'Chat apps, databases', 'Apps with session state in memory', 'Financial trading, gaming', 'Mixed server sizes (m5.large + m5.2xlarge)'],
            ]}
          />

          <H2>Real Decision: WebSocket Chat Application</H2>
          <Example title="Round Robin vs Least Connections for Long-Lived Connections">
            <CodeBlock>
{`Scenario: Chat app with 100k concurrent WebSocket connections, 10 servers

Round Robin Strategy:
- Assumes even distribution: 10k connections per server
- Reality: Some connections last 5 min, others 5 hours
- After 1 hour:
  - Server 1: 5k connections (light users)
  - Server 2: 15k connections (heavy users, overloaded!)
  - Server 3: 8k connections
  - Uneven load → Server 2 crashes → cascading failure

Least Connections Strategy:
- Tracks active connections per server
- Routes new connection to server with fewest connections
- After 1 hour:
  - Server 1: 9.8k connections
  - Server 2: 10.2k connections
  - Server 3: 9.9k connections
  - Balanced load → all servers healthy

Performance Impact:
- Round Robin: 10% of users on overloaded Server 2 see 500ms latency
  - 10k users × 500ms delay × $0.01 engagement loss = $100/day lost
- Least Connections: All users see <50ms latency
  - $0 engagement loss

Cost:
- Round Robin: Free (default)
- Least Connections: $0 (most LBs support free)

Decision: Least Connections saves $3k/mo in lost engagement
         Prevents cascading failures from uneven load

When Round Robin is fine:
- Stateless HTTP requests (avg 100ms duration)
- Uniform request complexity
- Servers auto-scale (can't get overloaded)`}
            </CodeBlock>
          </Example>

          <H2>Decision Framework</H2>
          <CodeBlock>
{`if (websocket || long_lived_connections):
    return "Least Connections"
    # Adapts to varying connection duration
    # Prevents some servers getting all heavy users

elif (stateless_http && uniform_requests):
    return "Round Robin"
    # Simplest, works fine for typical REST APIs
    # Request duration <1s, uniform complexity

elif (session_state_in_memory):
    return "IP Hash (Sticky Sessions)"
    # Same user → same server
    # AVOID IF POSSIBLE: Use Redis for sessions instead!

elif (latency_critical && servers_vary_in_perf):
    return "Least Response Time"
    # Routes to fastest server (measures real latency)
    # Best for financial trading, gaming

elif (heterogeneous_servers):
    return "Weighted Round Robin"
    # m5.large (weight=1), m5.2xlarge (weight=4)
    # Bigger server gets 4× traffic

else:
    return "Round Robin (default)"
    # Works for 80% of use cases
    # Upgrade to Least Connections if you see uneven load`}
          </CodeBlock>

          <H2>Weighted Round Robin for Heterogeneous Servers</H2>
          <Example title="Balancing Mixed Server Sizes">
            <CodeBlock>
{`Scenario: Cost optimization with mixed instance types
         3× m5.large (2 vCPU) + 2× m5.2xlarge (8 vCPU)

Round Robin (Equal Weight):
- Each server gets 20% of traffic
- m5.large: 20% traffic on 2 vCPU = overloaded (80% CPU)
- m5.2xlarge: 20% traffic on 8 vCPU = underutilized (20% CPU)
- Result: Small servers crash, large servers wasted

Weighted Round Robin:
- m5.large: weight = 1
- m5.2xlarge: weight = 4
- Total weight: 3×1 + 2×4 = 11
- m5.large gets: 1/11 = 9% each = 27% total
- m5.2xlarge gets: 4/11 = 36% each = 73% total

Load Distribution:
- m5.large: 9% traffic on 2 vCPU = ~40% CPU
- m5.2xlarge: 36% traffic on 8 vCPU = ~40% CPU
- Result: All servers balanced at ~40% CPU!

Cost Savings:
- Before: Need 5× m5.2xlarge for uniform fleet = $700/mo
- After: 3× m5.large ($90) + 2× m5.2xlarge ($280) = $370/mo
- Savings: $330/mo (47%) by using smaller instances where possible`}
            </CodeBlock>
          </Example>

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Round Robin for WebSocket/long-lived connections</Strong>
            <P>
              Chat apps, streaming services use Round Robin and see 10-30% of servers overloaded while others are idle.
              Some users on overloaded servers see 5-10× higher latency, causing churn.
            </P>
            <P>
              <Strong>Fix:</Strong> Use Least Connections for any long-lived connections (WebSocket, SSE, database connections).
              It's usually free and prevents uneven load distribution.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: IP Hash for session state (sticky sessions)</Strong>
            <P>
              Legacy apps use IP Hash to route same user to same server (session in memory). This prevents horizontal scaling,
              causes uneven load (some IPs have 10× more users), and crashes lose all sessions.
            </P>
            <P>
              <Strong>Fix:</Strong> Move session state to Redis ($15-50/mo). Makes servers stateless, enables true horizontal scaling,
              survives server crashes. IP Hash is tech debt from 2010.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Not using weighted routing for spot instances</Strong>
            <P>
              Teams mix on-demand (stable) + spot (can terminate) instances but use Round Robin. When spot terminates mid-request,
              50% of traffic fails until health checks remove it (30-60 seconds).
            </P>
            <P>
              <Strong>Fix:</Strong> Use Weighted Round Robin: on-demand (weight=3), spot (weight=1). On-demand handles 75% of traffic,
              spot termination only affects 25%. Or use connection draining (spot finishes existing requests before terminating).
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>ROI Example:</Strong> Least Connections prevents $3k/mo engagement loss from uneven load in WebSocket apps.
            Weighted Round Robin enables 47% cost savings ($330/mo) by efficiently using mixed instance types.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'lb-provider-tradeoffs',
      type: 'concept',
      title: '🎯 Load Balancer Provider Trade-Offs',
      content: (
        <Section>
          <H1>🎯 Load Balancer Provider Trade-Offs</H1>
          <P>
            <Strong>The Decision:</Strong> Managed load balancers (AWS ALB/NLB, GCP) are easy but costly at scale.
            Self-hosted (NGINX, HAProxy) are complex but cheap. The choice impacts your costs, operations, and capabilities.
          </P>

          <H2>Provider Comparison</H2>
          <ComparisonTable
            headers={['Factor', 'AWS ALB', 'AWS NLB', 'NGINX (Self-Hosted)', 'HAProxy', 'Cloudflare LB']}
            rows={[
              ['Monthly Cost (Low)', '$16 + $50 LCU', '$16 + $30 data', '$20 (EC2 t3.medium)', '$20 (EC2 t3.medium)', '$5/origin'],
              ['Monthly Cost (High)', '$16 + $2k+ LCU', '$16 + $600 data', '$200 (c5.2xlarge HA)', '$200 (c5.2xlarge HA)', '$50/origin'],
              ['Setup Time', '15 minutes', '15 minutes', '2-4 hours', '2-4 hours', '10 minutes'],
              ['Max Throughput', '100k RPS per LB', '1M+ RPS', '100k+ RPS (tuned)', '200k+ RPS (C10k problem solved)', '100M+ RPS (global)'],
              ['SSL Termination', 'Free (ACM certs)', 'Pass-through only', 'Free (Let\'s Encrypt)', 'Free (Let\'s Encrypt)', 'Free'],
              ['Operational Burden', 'Zero', 'Zero', 'High (patching, HA, monitoring)', 'High', 'Zero'],
              ['Advanced Features', 'Path routing, auth, WAF', 'TCP/UDP', 'Full control (Lua scripts)', 'Full control, fastest', 'DDoS, WAF, geo-routing'],
              ['Best For', 'AWS-native microservices', 'High throughput, WebSockets', 'Custom logic, cost-sensitive at scale', 'Performance-critical, on-prem', 'Global apps, DDoS protection'],
            ]}
          />

          <H2>Real Decision: Cost at Scale</H2>
          <Example title="AWS ALB vs Self-Hosted NGINX Cost Comparison">
            <CodeBlock>
{`Scenario: SaaS platform, 200k RPS average, 50TB/mo traffic, 20 backend servers

AWS ALB Cost:
- Base: $16/mo
- LCU calculation:
  - New connections: 200k RPS × 3600s/hr = 720M/hr → 25 conn/s per LCU → 28.8k LCU-hrs
  - Active connections: 200k × 1s avg = 200k concurrent → 3k per LCU → 67 LCU-hrs
  - Bandwidth: 50TB/mo = 1.67TB/hr → 1GB/hr per LCU → 1,700 LCU-hrs
  - Rule evaluations: 200k RPS = 720M/hr → 1k/s per LCU → 720 LCU-hrs
  - Max LCU-hrs: 28,800 (new connections is bottleneck)
- LCU cost: 28,800 LCU-hrs × $0.008 = $230/hr = $165,600/mo
- Total: $165,616/mo = $1.99M/year (!)

AWS NLB Cost (if Layer 4 acceptable):
- Base: $16/mo
- Data: 50TB × $0.006/GB = $300/mo
- Total: $316/mo = $3,792/year

Self-Hosted NGINX (HA Pair):
- 2× c5.2xlarge (HA): 2 × $245/mo = $490/mo
- Bandwidth: 50TB × $0.09/GB = $4,500/mo
- DevOps time: 20 hrs/mo × $100/hr = $2,000/mo
- Total: $6,990/mo = $83,880/year

Decision:
- AWS ALB: $1.99M/year (insane at scale!)
- AWS NLB: $3,792/year (524× cheaper if Layer 4 acceptable)
- Self-Hosted NGINX: $83,880/year (24× cheaper than ALB)

Breakeven Analysis:
- NGINX costs $7k/mo regardless of traffic
- ALB costs $16 + $0.008/LCU-hr
- Breakeven: ~50k RPS (above this, NGINX is cheaper)

Recommendation:
- <50k RPS: AWS ALB ($16-500/mo, easy)
- 50-200k RPS: AWS NLB if possible ($300-600/mo)
- >200k RPS: Self-hosted NGINX ($7k/mo, saves $1.9M/year!)
- Global apps: Cloudflare LB ($50-500/mo, includes DDoS)`}
            </CodeBlock>
          </Example>

          <H2>Decision Framework</H2>
          <CodeBlock>
{`if (aws_native && rps < 50k):
    return "AWS ALB"
    # $16-500/mo, easiest path
    # Perfect for startups, microservices

elif (high_throughput && layer4_acceptable):
    return "AWS NLB"
    # $300-600/mo for 10-50TB/mo
    # 524× cheaper than ALB at high scale

elif (rps > 100k && have_devops_expertise):
    return "Self-Hosted NGINX"
    # $7k-20k/mo all-in
    # Saves $1.9M/year vs ALB at 200k RPS scale

elif (global_app || ddos_concern):
    return "Cloudflare Load Balancing"
    # $50-500/mo, global Anycast, DDoS included
    # No origin DDoS risk, 100M+ RPS capacity

elif (on_prem || need_custom_logic):
    return "HAProxy"
    # Self-hosted, fastest performance
    # Full control, Lua scripting

else:
    return "AWS ALB (default for most apps)"
    # Costs are reasonable <50k RPS
    # Managed, easy, integrates with AWS ecosystem`}
          </CodeBlock>

          <H2>Self-Hosted NGINX: When It Makes Sense</H2>
          <Example title="High-Scale Cost Optimization">
            <CodeBlock>
{`When to self-host NGINX:

✅ Traffic > 100k RPS ($500k+/year ALB costs)
✅ Have DevOps team (20+ hrs/mo maintenance)
✅ Stable infrastructure (not rapidly changing)
✅ Need custom logic (rate limiting, auth, Lua scripts)

Setup for HA NGINX:
- 2× c5.2xlarge instances (active-active)
- EIP for failover OR DNS-based (Route 53 health checks)
- Auto-scaling group (min=2, max=4)
- Monitoring: Prometheus + Grafana
- Logging: CloudWatch Logs
- Config management: Ansible/Terraform

Monthly costs:
- Compute: $490/mo (2× c5.2xlarge)
- Bandwidth: $4,500/mo (50TB)
- Monitoring: $50/mo
- DevOps: $2,000/mo (20 hrs × $100/hr)
- Total: $7,040/mo

Savings vs ALB: $165k - $7k = $158k/mo = $1.9M/year

This pays for 2 senior DevOps engineers!

When NOT to self-host:
- Traffic <50k RPS (ALB costs <$500/mo, not worth ops burden)
- No DevOps expertise (outages cost more than ALB fees)
- Rapidly changing architecture (ALB auto-updates)`}
            </CodeBlock>
          </Example>

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Staying on AWS ALB at high scale</Strong>
            <P>
              Companies hit 200k+ RPS and don't realize ALB costs $165k/mo ($1.99M/year). Self-hosted NGINX would be $7k/mo,
              saving $1.9M/year — enough to hire 2 DevOps engineers and still save $1.5M/year.
            </P>
            <P>
              <Strong>Fix:</Strong> Audit ALB costs when you hit 50k+ RPS. Above 100k RPS, self-hosted NGINX pays for itself 20-30×.
              Or switch to NLB if Layer 4 is acceptable (524× cheaper at scale).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Self-hosting NGINX at low scale</Strong>
            <P>
              Startups with 5k RPS self-host NGINX to "save money", spending $7k/mo + DevOps time when AWS ALB would cost $50/mo.
              They pay 140× more for "savings"!
            </P>
            <P>
              <Strong>Fix:</Strong> Use managed ALB for &lt;50k RPS. It's cheaper when you factor in DevOps time ($2k/mo).
              Only self-host above 100k RPS where savings are massive.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Not using Cloudflare for DDoS-prone apps</Strong>
            <P>
              Apps facing DDoS attacks use AWS ALB + Shield Advanced ($3k/mo) and still get hit with $50k+ bandwidth costs during attacks.
              Cloudflare LB ($50/mo) includes unlimited DDoS protection.
            </P>
            <P>
              <Strong>Fix:</Strong> For public-facing apps, use Cloudflare Load Balancing + DDoS protection ($50-500/mo).
              One DDoS attack ($50k cost on AWS) pays for 8 years of Cloudflare.
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>ROI Example:</Strong> Self-hosted NGINX saves $1.9M/year vs AWS ALB at 200k RPS scale (enough to hire 2 DevOps engineers and still save $1.5M).
            AWS NLB saves $1.98M/year vs ALB for Layer 4 traffic at same scale (524× cheaper). Cloudflare prevents $50k+ DDoS incidents for $50/mo.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'session-affinity-tradeoffs',
      type: 'concept',
      title: '🎯 Session Affinity Trade-Offs',
      content: (
        <Section>
          <H1>🎯 Session Affinity Trade-Offs</H1>
          <P>
            <Strong>The Decision:</Strong> Sticky sessions route same user to same server, enabling in-memory session state
            but limiting scalability. Stateless servers with external session storage (Redis) enable better load distribution and resilience.
          </P>

          <H2>Session Strategy Comparison</H2>
          <ComparisonTable
            headers={['Factor', 'Sticky Sessions (IP Hash)', 'Stateless + Redis', 'Stateless + JWT', 'Hybrid']}
            rows={[
              ['Session Storage', 'Server memory', 'Redis (external)', 'Client-side (token)', 'Redis + client cache'],
              ['Server Crashes', 'All sessions lost', 'No impact (Redis persists)', 'No impact (client has token)', 'No impact'],
              ['Horizontal Scaling', 'Difficult (uneven load)', 'Easy (any server works)', 'Easy', 'Easy'],
              ['Load Distribution', 'Poor (IP clustering)', 'Excellent (true load balancing)', 'Excellent', 'Excellent'],
              ['Session Latency', 'Fast (local memory)', 'Medium (+1-2ms Redis lookup)', 'Fast (no server lookup)', 'Fast (client cache)'],
              ['Monthly Cost', '$0', '$15-200 (Redis)', '$0', '$15-200 (Redis)'],
              ['Security', 'Medium (session in memory)', 'Good (encrypted Redis)', 'Risk (token tampering)', 'Good'],
              ['Best For', 'Legacy apps (can\'t change)', 'Modern apps, microservices', 'Stateless APIs, mobile apps', 'Production SaaS'],
              ['Worst For', 'High availability needs', 'Ultra-low latency (<1ms)', 'Apps with large session data', 'Simple apps'],
            ]}
          />

          <H2>Real Decision: E-commerce Platform Scaling</H2>
          <Example title="Sticky Sessions vs Stateless Redis">
            <CodeBlock>
{`Scenario: E-commerce platform, Black Friday traffic spike 10× normal

Sticky Sessions (IP Hash) Approach:
- 10 servers normally, need 100 servers for Black Friday
- Problem: IP hash distributes unevenly
  - Some servers get 5k users, others get 500 users
  - Can't scale down (users lose sessions)
- Black Friday incident:
  - Server crashes at 2pm
  - 8k users lose shopping carts
  - 8k users × 20% conversion × $80 AOV = $128k lost revenue
- Scaling difficulty: Can't remove servers without losing sessions
- Deployment risk: Update = restart = all sessions lost

Stateless + Redis Approach:
- Sessions in Redis cluster (ElastiCache)
- Any server can handle any user
- Black Friday scaling:
  - Auto-scale 10 → 100 servers instantly
  - Perfect load distribution (1k users per server)
  - Scale down 100 → 10 after spike (no session loss)
- Server crash:
  - User hits different server
  - Redis retrieves session (1ms lookup)
  - Zero revenue loss
- Deployment: Rolling restart, zero downtime

Cost Comparison:
- Sticky Sessions: $0 extra (IP hash is free)
  - Hidden cost: $128k Black Friday incident
  - Hidden cost: $50k/year poor load distribution (over-provisioning)
- Redis: $200/mo ElastiCache (ha, multi-AZ)
  - Saves: $128k/year (prevented incidents)
  - Saves: $50k/year (better resource utilization)
  - Net savings: $175,600/year for $2,400/year cost

ROI: $2,400 investment → $175,600 savings = 73× ROI

Decision: Redis pays for itself 73× over by preventing incidents + better scaling`}
            </CodeBlock>
          </Example>

          <H2>Decision Framework</H2>
          <CodeBlock>
{`if (legacy_app && cant_refactor):
    return "Sticky Sessions (temporary)"
    # $0/mo, but plan migration to Redis
    # Accept poor scaling + crash risk

elif (stateless_api || mobile_app):
    return "JWT Tokens (Stateless)"
    # $0/mo, no session storage needed
    # Client sends JWT with each request

elif (web_app && need_server_sessions):
    return "Stateless + Redis"
    # $15-200/mo, best availability + scaling
    # Industry standard for production apps

elif (high_availability_critical):
    return "Stateless + Redis Cluster (Multi-AZ)"
    # $200-500/mo, 99.99% uptime
    # No single point of failure

elif (need_fast_reads && moderate_writes):
    return "Hybrid: Redis + Client-Side Cache"
    # Redis for source of truth
    # Client caches session (1-5 min TTL)
    # Reduces Redis reads 80%, costs $15-50/mo

else:
    return "Stateless + Redis (default)"
    # Works for 90% of modern web apps
    # Small cost for massive availability/scaling benefits`}
          </CodeBlock>

          <H2>Implementing Stateless Sessions with Redis</H2>
          <Example title="Migrating from Sticky Sessions to Redis">
            <CodeBlock>
{`// Before: Sticky sessions (in-memory)
app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore()  // ❌ Lost on server restart
}));

// After: Stateless with Redis
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const redisClient = createClient({
  host: 'redis-cluster.abc.cache.amazonaws.com',
  port: 6379
});

app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({ client: redisClient }),  // ✅ Persists across restarts
  cookie: { maxAge: 86400000 }  // 24 hours
}));

Benefits:
- Server crash: User hits new server, session retrieved from Redis (1-2ms)
- Horizontal scaling: Add 100 servers instantly, all share Redis
- Deployment: Rolling restart, zero session loss
- Cost: $15/mo (t3.micro Redis) or $200/mo (Multi-AZ cluster)

Redis Sizing:
- Small app (<10k users): t3.micro ($15/mo), 0.5GB memory
- Medium app (100k users): t3.small ($30/mo), 1.5GB memory
- Large app (1M users): r5.large ($200/mo), 13GB memory, Multi-AZ

Session size estimate:
- Typical session: 2-10KB (user ID, cart, preferences)
- 100k active users × 5KB = 500MB memory needed
- Use t3.small ($30/mo) with headroom`}
            </CodeBlock>
          </Example>

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Using sticky sessions in production</Strong>
            <P>
              Modern apps use sticky sessions (IP hash) to avoid Redis costs ($15-200/mo), then lose $50k-500k/year from:
              (1) Server crashes losing sessions, (2) Poor load distribution requiring over-provisioning, (3) Can't scale down after traffic spikes.
            </P>
            <P>
              <Strong>Fix:</Strong> Migrate to Redis sessions ($15-200/mo). ROI is 50-500× from preventing incidents alone.
              Sticky sessions are tech debt from 2005, unacceptable for production.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Single Redis instance (no HA)</Strong>
            <P>
              Teams use single Redis instance ($15/mo) to "save money", then Redis crashes during Black Friday, logging out 100k users,
              costing $200k+ in lost revenue. Multi-AZ Redis ($200/mo) would prevent this.
            </P>
            <P>
              <Strong>Fix:</Strong> For production, use Multi-AZ Redis cluster ($200-500/mo). One prevented Black Friday incident ($200k)
              pays for 83 years of Multi-AZ Redis.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Storing large objects in sessions</Strong>
            <P>
              Apps store entire product catalog (5MB) in session to "avoid DB queries", requiring r5.8xlarge Redis ($5k/mo).
              Only user ID (50 bytes) should be in session — fetch data as needed.
            </P>
            <P>
              <Strong>Fix:</Strong> Session should only store: user ID, auth token, minimal preferences (&lt;5KB total).
              Fetch product data from cache/DB on each request. Reduces Redis from $5k/mo to $30/mo (167× savings).
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>ROI Example:</Strong> Redis sessions ($2,400/year) save $175,600/year by preventing crash incidents ($128k/year)
            and enabling better resource utilization ($50k/year) = 73× ROI. Multi-AZ Redis ($200/mo) prevents $200k Black Friday incidents.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

