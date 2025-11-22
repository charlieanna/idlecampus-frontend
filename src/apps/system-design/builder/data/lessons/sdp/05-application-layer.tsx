import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpApplicationLayerLesson: SystemDesignLesson = {
  id: 'sdp-application-layer',
  slug: 'sdp-application-layer',
  title: 'Application Layer Patterns',
  description: 'Master application architecture and critical trade-offs: WHEN to split monolith into microservices (team size thresholds), WHICH service discovery fits your scale, HOW to choose rate limiting strategy for cost vs accuracy.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 75,

  // Progressive flow metadata
  moduleId: 'sd-module-5-primer',
  sequenceOrder: 5,
  stages: [
    {
      id: 'intro-application-layer',
      type: 'concept',
      title: 'Application Layer Architecture Patterns',
      content: (
        <Section>
          <H1>Application Layer Architecture Patterns</H1>
          <P>
            Modern applications use various patterns to build scalable, maintainable systems.
          </P>

          <H2>Microservices</H2>
          <P>
            Break monolithic application into small, independent services:
          </P>
          <UL>
            <LI>Each service handles one business function</LI>
            <LI>Services communicate via APIs (REST, gRPC)</LI>
            <LI>Independent deployment and scaling</LI>
            <LI>Trade-off: More complexity, network latency</LI>
          </UL>

          <H2>Service Discovery</H2>
          <P>
            Services need to find each other dynamically:
          </P>
          <UL>
            <LI><Strong>Client-Side Discovery:</Strong> Client queries service registry (e.g., Consul, Eureka)</LI>
            <LI><Strong>Server-Side Discovery:</Strong> Load balancer queries registry, routes to service</LI>
            <LI>Services register on startup, deregister on shutdown</LI>
          </UL>

          <H2>BFF (Backend for Frontend)</H2>
          <P>
            Separate API for each client type (web, mobile, admin):
          </P>
          <UL>
            <LI>Web BFF: Optimized for web UI needs</LI>
            <LI>Mobile BFF: Optimized for mobile (smaller payloads)</LI>
            <LI>Reduces client-specific logic in services</LI>
          </UL>

          <H2>Sidecar Pattern</H2>
          <P>
            Deploy helper container alongside main application:
          </P>
          <UL>
            <LI>Handles cross-cutting concerns (logging, monitoring, proxy)</LI>
            <LI>Example: Envoy proxy as sidecar for service mesh</LI>
            <LI>Keeps application code focused on business logic</LI>
          </UL>

          <H2>Bulkhead Pattern</H2>
          <P>
            Isolate resources to prevent cascading failures:
          </P>
          <UL>
            <LI>Separate thread pools for different operations</LI>
            <LI>If one operation fails, others continue</LI>
            <LI>Example: Separate connection pools for read/write</LI>
          </UL>

          <H2>Retry with Exponential Backoff</H2>
          <P>
            Retry failed requests with increasing delays:
          </P>
          <CodeBlock>
{`// Exponential backoff
retry 1: wait 1s
retry 2: wait 2s
retry 3: wait 4s
retry 4: wait 8s
...

// Prevents overwhelming failing service
// Gives service time to recover`}
          </CodeBlock>

          <H2>Rate Limiting</H2>
          <P>
            Limit number of requests per user/IP/API key:
          </P>
          <UL>
            <LI><Strong>Token Bucket:</Strong> Refill tokens at fixed rate, consume per request</LI>
            <LI><Strong>Sliding Window:</Strong> Count requests in time window</LI>
            <LI>Return 429 (Too Many Requests) when limit exceeded</LI>
          </UL>

          <KeyPoint>
            <Strong>Best Practice:</Strong> Use microservices for large teams, service discovery for dynamic
            environments, rate limiting to prevent abuse.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'monolith-vs-microservices-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Monolith vs Microservices',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Monolith vs Microservices</H1>
          <P>
            <Strong>The Decision:</Strong> Monoliths are simple and fast for small teams. Microservices enable independent scaling and deployment
            but add massive complexity. The choice depends on team size, deployment frequency, and scale requirements.
          </P>

          <H2>Monolith vs Microservices Comparison</H2>
          <ComparisonTable
            headers={['Factor', 'Monolith', 'Modular Monolith', 'Microservices', 'Mini-Services (Hybrid)']}
            rows={[
              ['Team Size Sweet Spot', '1-10 engineers', '10-30 engineers', '30-500+ engineers', '20-100 engineers'],
              ['Deployment Complexity', 'Trivial (1 deploy)', 'Low (1 deploy, modules independent)', 'High (100+ services, orchestration)', 'Medium (5-10 services)'],
              ['Network Latency', 'Zero (in-process calls)', 'Zero', 'High (10-100ms per hop)', 'Medium (5-20ms)'],
              ['Development Speed', 'Fast (1 codebase)', 'Fast (shared code)', 'Slow (coordination overhead)', 'Medium'],
              ['Independent Scaling', 'No (all-or-nothing)', 'Limited (can scale replicas)', 'Yes (scale each service)', 'Yes (scale key services)'],
              ['Operational Cost', '$100-500/mo', '$200-1k/mo', '$2k-50k/mo', '$500-5k/mo'],
              ['Monitoring Complexity', 'Simple (1 app)', 'Simple', 'Very High (distributed tracing)', 'Medium'],
              ['Best For', 'Startups, MVPs, small teams', 'Growth-stage companies (10-30 eng)', 'Enterprises, 100+ engineers', 'Mid-size companies (20-100 eng)'],
            ]}
          />

          <H2>Real Decision: Startup Scaling Journey</H2>
          <Example title="When to Split Monolith into Microservices">
            <CodeBlock>
{`Stage 1: Startup (5 engineers, $500k revenue)
- Monolith: Rails/Django app on 2 servers
- Deploy: Once per day, 5 min downtime
- Cost: $200/mo (2× t3.medium)
- Dev speed: Ship feature in 1-2 weeks
- Decision: STAY MONOLITH
  - Microservices would add $2k/mo costs + 3× slower development
  - Premature optimization kills startups

Stage 2: Growth (20 engineers, $5M revenue)
- Monolith: 20 engineers committing to 1 repo
- Pain points:
  - Deploy conflicts: 5 teams want to deploy daily, coordinate is hard
  - Test suite: 2 hours (blocking deploys)
  - One bug in checkout breaks entire site
  - Scaling: Payments service needs 10× servers but runs with web tier
- Modular Monolith first:
  - Split codebase into modules (users/, payments/, products/)
  - Still 1 deploy, but modules have clear boundaries
  - Cost: $500/mo, 3 months refactor time
  - Decision: TRY MODULAR MONOLITH FIRST
    - 80% of microservices benefits, 20% of complexity

Stage 3: Scale (50 engineers, $20M revenue)
- Modular monolith hitting limits:
  - Payments team wants 10 deploys/day, web team wants stability
  - Black Friday: Need 100× payment servers, but web tier scales with it
  - Mobile team wants GraphQL, web team uses REST
- Mini-Services (5-10 services):
  - Extract: payments-service, orders-service, notifications-service
  - Keep: monolith for users, products, admin (stable areas)
  - Cost: $3k/mo (Kubernetes cluster + 5 services)
  - Benefits:
    - Payments: Deploy 10×/day independently
    - Payments: Scale to 100 servers (Black Friday), web stays at 10
    - Mobile: Add GraphQL to payments service only
  - Decision: MINI-SERVICES (5-10 services, not 50!)
    - Extract only high-value services (different scale/deploy needs)
    - Keep low-change areas in monolith

Stage 4: Enterprise (200 engineers, $100M revenue)
- 40 teams, need independent deployment
- Full Microservices:
  - 80 services, Kubernetes, service mesh, distributed tracing
  - Cost: $25k/mo (infrastructure + operational overhead)
  - Benefits:
    - Each team deploys 5-10×/day independently
    - Scale critical services (payments 1000× on Prime Day)
    - Technology freedom (Go for payments, Python for ML, Rust for latency-critical)
  - Decision: FULL MICROSERVICES worth it at 100+ engineers

ROI Analysis:
- Monolith (5 eng): $200/mo, 100% dev efficiency
- Modular Monolith (20 eng): $500/mo, 90% dev efficiency
- Mini-Services (50 eng): $3k/mo, 80% dev efficiency
  - Saves $10k/mo in over-provisioning vs monolith
  - Enables 10×/day deploys vs 1×/day
- Full Microservices (200 eng): $25k/mo, 70% dev efficiency
  - But 40 teams ship independently (100× faster than coordinated deploys)
  - Saves $500k/year in operational costs from independent scaling

Decision Framework by Team Size:
- 1-10 engineers: Monolith (100% of time)
- 10-30 engineers: Modular Monolith (refactor over 3-6 months)
- 30-100 engineers: Mini-Services (5-10 services, extract high-value only)
- 100+ engineers: Full Microservices (but expect 30% dev efficiency tax)`}
            </CodeBlock>
          </Example>

          <H2>Decision Framework</H2>
          <CodeBlock>
{`if (engineers < 10 || revenue < $1M):
    return "Monolith"
    # $200-500/mo, ship fast, avoid premature complexity
    # Microservices would kill startup velocity

elif (engineers 10-30 && deploy_conflicts_painful):
    return "Modular Monolith"
    # $500-1k/mo, internal modules with clear boundaries
    # 80% of microservices benefits, 20% of complexity
    # Refactor over 3-6 months

elif (engineers 30-100 && need_independent_scaling):
    return "Mini-Services (5-10 services)"
    # $3k-10k/mo, extract high-value services only:
    #   - Different scaling needs (payments 10× on Black Friday)
    #   - Different deploy frequency (notifications 20×/day)
    #   - Different tech stack (ML service needs Python, core is Go)
    # Keep 70% in monolith, extract 30% strategically

elif (engineers > 100 && many_teams):
    return "Full Microservices"
    # $25k-100k/mo, 50-200 services
    # Each team deploys independently 5-10×/day
    # Accept 30% dev efficiency tax for team autonomy

else:
    return "Monolith until you feel pain"
    # Don't split prematurely
    # You'll know when it's time (deploy conflicts, scaling limits)`}
          </CodeBlock>

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Premature microservices</Strong>
            <P>
              5-person startups build 20 microservices because "Netflix does it", spending 80% of time on infrastructure vs product.
              They burn $100k+ runway on Kubernetes/service mesh when simple monolith would cost $200/mo and ship 5× faster.
            </P>
            <P>
              <Strong>Fix:</Strong> Start with monolith. Always. Split only when team &gt;30 engineers or clear scaling/deployment pain.
              Premature microservices kill more startups than premature optimization.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Going from monolith to 100 microservices</Strong>
            <P>
              Companies hit monolith scaling limits and split into 100+ microservices overnight. Deploy time goes from 5 min to 2 hours (100 services),
              latency increases 10× (10 network hops), bugs explode (distributed systems are hard).
            </P>
            <P>
              <Strong>Fix:</Strong> Go Modular Monolith first (3-6 months), then extract 5-10 high-value services (Mini-Services).
              Only go full microservices at 100+ engineers. Gradual migration prevents operational disaster.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Staying monolith too long</Strong>
            <P>
              100-person teams working on monolith face: 4-hour test suites, deploy coordination nightmares (20 teams want different times),
              can't scale (checkout needs 100× servers but shares tier with admin panel). Costs $50k+/mo in inefficiency.
            </P>
            <P>
              <Strong>Fix:</Strong> When team &gt;30 engineers, start extracting services. Signals: (1) Deploy conflicts daily,
              (2) Different scaling needs (payments 10× on sales), (3) 2+ hour test suite. Mini-Services (5-10 services) solve 80% of pain.
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>ROI Example:</Strong> Mini-Services (5-10 services) save $10k/mo from independent scaling vs monolith while avoiding $22k/mo complexity overhead of full microservices.
            Modular Monolith provides 80% of microservices benefits for 20% of complexity cost — perfect for 10-30 engineer teams.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'service-discovery-tradeoffs',
      type: 'concept',
      title: '🎯 Service Discovery Trade-Offs',
      content: (
        <Section>
          <H1>🎯 Service Discovery Trade-Offs</H1>
          <P>
            <Strong>The Decision:</Strong> Services need to find each other: DNS is simple but slow to update, Consul/Eureka are dynamic but complex,
            Kubernetes native discovery is elegant but locks you into K8s. The choice impacts your failover speed, operational complexity, and costs.
          </P>

          <H2>Service Discovery Comparison</H2>
          <ComparisonTable
            headers={['Factor', 'DNS (Route 53)', 'Consul', 'Kubernetes DNS', 'Eureka', 'Static Config']}
            rows={[
              ['Update Speed', 'Slow (30-60s TTL)', 'Fast (1-5s)', 'Fast (1-2s)', 'Fast (30s)', 'Manual (hours)'],
              ['Monthly Cost', '$1-50', '$200-1k (self-hosted)', '$0 (included in K8s)', '$200-1k (self-hosted)', '$0'],
              ['Setup Complexity', 'Trivial', 'High', 'Medium (K8s required)', 'Medium', 'Trivial'],
              ['Failover Speed', 'Slow (60s)', 'Fast (5s)', 'Fast (2s)', 'Medium (30s)', 'Manual'],
              ['Health Checks', 'Basic (TCP/HTTP)', 'Advanced (TCP/HTTP/script)', 'Advanced (liveness/readiness)', 'Advanced (HTTP)', 'None'],
              ['Platform Lock-In', 'None (cloud-agnostic)', 'None', 'High (requires Kubernetes)', 'None', 'None'],
              ['Best For', 'Simple apps, AWS-native', 'Multi-cloud, service mesh', 'Kubernetes deployments', 'Spring Boot apps', 'Tiny apps (1-5 services)'],
              ['Worst For', 'Fast failover needs', 'Simple apps (overkill)', 'Non-K8s environments', 'Non-JVM apps', 'Scaling apps (unmaintainable)'],
            ]}
          />

          <H2>Real Decision: Microservices Failover</H2>
          <Example title="DNS vs Consul for Service Discovery">
            <CodeBlock>
{`Scenario: E-commerce with 10 microservices, need fast failover on crashes

DNS-Based Discovery (Route 53):
- payments-service.internal → Route 53 A records
- 3 instances: 10.0.1.5, 10.0.1.6, 10.0.1.7
- Instance crashes at 2pm
- Route 53 health check fails → removes IP from DNS (30s)
- Clients still cached old DNS → 60s TTL
- Total failover: 90 seconds
- Impact: 90s of 50% failed requests = $5k lost revenue
- Cost: $10/mo

Consul Discovery:
- payments-service registered in Consul
- Health check fails → Consul removes instance (5s)
- Clients query Consul every request → see update immediately
- Total failover: 5 seconds
- Impact: 5s of failed requests = $278 lost revenue
- Cost: $500/mo (3× t3.medium Consul servers)

Kubernetes DNS Discovery:
- payments-service deployed as K8s Service
- Pod crashes → K8s removes from endpoints (2s)
- Service DNS updates instantly (1s)
- Total failover: 3 seconds
- Impact: 3s of failed requests = $167 lost revenue
- Cost: $0 (included in K8s)

Cost-Benefit Analysis:
- DNS: $10/mo, loses $5k per crash
  - 1 crash/month = $5k/mo lost revenue
- Consul: $500/mo, loses $278 per crash
  - Saves: $4,722/crash - $490/mo extra cost
  - Breakeven: 1 crash every 10 days
- K8s: $0/mo, loses $167 per crash
  - Best if already on K8s

Decision:
- If on Kubernetes: Use K8s native DNS (free, 3s failover)
- If 5+ microservices not on K8s: Consul ($500/mo, 5s failover)
  - Pays for itself after 1-2 crashes/month
- If 1-5 services: DNS with short TTL ($10/mo, 30s failover)
  - Not worth Consul complexity for small apps`}
            </CodeBlock>
          </Example>

          <H2>Decision Framework</H2>
          <CodeBlock>
{`if (on_kubernetes):
    return "Kubernetes Native DNS"
    # $0/mo, 1-3s failover, built-in
    # No reason to use anything else on K8s

elif (microservices > 10 || failover_critical):
    return "Consul"
    # $500-1k/mo, 5s failover, health checks
    # Saves $5k+/mo in prevented outages

elif (simple_architecture && services < 5):
    return "DNS (Route 53/CloudDNS)"
    # $10-50/mo, 30-60s failover
    # Good enough for small apps

elif (spring_boot_stack):
    return "Eureka"
    # $500/mo, 30s failover, native Spring integration
    # Best for JVM-based microservices

elif (very_small && budget < $100/mo):
    return "Static Config (environment variables)"
    # $0/mo, manual updates
    # Only for 1-3 services, dev environments

else:
    return "DNS for now, migrate to Consul when pain appears"
    # Start simple, upgrade when failover speed matters`}
          </CodeBlock>

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Using static config for production microservices</Strong>
            <P>
              Teams hardcode IP addresses in environment variables for 20+ microservices. When instance crashes, manual update takes 30+ minutes,
              causing $50k+ outages. Static config is tech debt acceptable only for 1-3 services.
            </P>
            <P>
              <Strong>Fix:</Strong> Use DNS (min) or Consul (better) for any production microservices. Even basic DNS ($10/mo) provides
              automated failover in 30-60s vs 30-minute manual updates.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Using Consul for 3 services</Strong>
            <P>
              Startups with 3 microservices run 3-node Consul cluster ($500/mo) for "best practices" when DNS would work fine ($10/mo).
              They waste $490/mo + operational overhead for negligible benefit (30s vs 5s failover on rare crashes).
            </P>
            <P>
              <Strong>Fix:</Strong> Use DNS for &lt;5 services. Only use Consul when (1) &gt;10 services, or (2) failover speed critical (fintech, gaming).
              Consul overkill for simple apps costs $490/mo + DevOps time.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Not using K8s native discovery when on K8s</Strong>
            <P>
              Teams deploy Consul on Kubernetes for service discovery when K8s DNS is built-in, free, and faster (2s failover).
              They pay $500/mo for worse performance than native solution.
            </P>
            <P>
              <Strong>Fix:</Strong> If on Kubernetes, ALWAYS use K8s Services + DNS. It's free, faster, and simpler than external service discovery.
              Only use Consul if you need multi-cluster or hybrid cloud discovery.
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>ROI Example:</Strong> Consul ($500/mo) prevents $5k revenue loss per crash vs DNS by reducing failover from 90s to 5s (pays for itself after 1-2 crashes/month).
            Kubernetes native DNS provides 2s failover for $0/mo — always use it if on K8s.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'bff-tradeoffs',
      type: 'concept',
      title: '🎯 BFF vs Single API vs GraphQL Trade-Offs',
      content: (
        <Section>
          <H1>🎯 BFF vs Single API vs GraphQL Trade-Offs</H1>
          <P>
            <Strong>The Decision:</Strong> Single API is simple but forces all clients to use same contract. BFF (Backend for Frontend)
            optimizes per client but duplicates code. GraphQL eliminates over-fetching but adds complexity. The choice impacts your development speed, network efficiency, and maintenance burden.
          </P>

          <H2>API Strategy Comparison</H2>
          <ComparisonTable
            headers={['Factor', 'Single REST API', 'BFF (per Client)', 'GraphQL', 'gRPC + gRPC-Web']}
            rows={[
              ['Development Complexity', 'Low (1 API)', 'Medium (2-3 BFFs)', 'High (schema, resolvers)', 'Medium (protobuf)'],
              ['Network Efficiency', 'Poor (over-fetching)', 'Good (optimized per client)', 'Excellent (exact fields)', 'Excellent (binary)'],
              ['Mobile Bandwidth (KB)', '500KB response', '50KB (mobile BFF)', '50KB (query exact fields)', '30KB (binary)'],
              ['Backend Load', 'High (over-fetch)', 'Medium', 'High (N+1 problem)', 'Low'],
              ['Cache-ability', 'Good (HTTP cache)', 'Good', 'Poor (POST requests)', 'Medium'],
              ['Code Duplication', 'None', 'High (duplicate logic)', 'Low (shared resolvers)', 'None'],
              ['Monthly Cost', '$100-500', '$300-1.5k (3 BFFs)', '$500-2k (complex)', '$200-800'],
              ['Best For', 'Simple apps, uniform clients', 'Web + mobile with very different needs', 'Flexible UIs, rapid iteration', 'High-performance, microservices'],
              ['Worst For', 'Mobile apps (over-fetching)', 'Simple apps (over-engineering)', 'Simple CRUD apps', 'Public APIs (browser support)'],
            ]}
          />

          <H2>Real Decision: Mobile App Performance</H2>
          <Example title="Single API vs BFF vs GraphQL for Mobile">
            <CodeBlock>
{`Scenario: E-commerce app, web + mobile clients, 1M mobile users

Single REST API Approach:
- GET /api/products/123
- Response: 500KB (includes everything: full description, reviews, related products, seller info)
- Mobile only needs: name, price, image (50KB)
- Problem: 450KB wasted on mobile (slow load, data costs)
- Mobile user impact:
  - 500KB × 100 page views/user = 50MB/user/month
  - 1M users × 50MB = 50TB/mo wasted
  - User on limited data plan: $5/mo overage charges → churn
- Backend cost: $4,500/mo bandwidth (50TB × $0.09/GB)

BFF Approach (Web BFF + Mobile BFF):
- Mobile BFF: GET /mobile/api/products/123
  - Returns: {name, price, image} → 50KB
- Web BFF: GET /web/api/products/123
  - Returns: Full 500KB (web can handle it)
- Mobile bandwidth: 5MB/user/month (10× reduction)
- Backend cost: $900/mo bandwidth (10TB × $0.09/GB)
- Savings: $3,600/mo bandwidth + improved mobile UX
- Extra cost: $300/mo (maintain 2 BFFs)
- Net savings: $3,300/mo

GraphQL Approach:
- query { product(id: "123") { name price image } }
- Mobile app queries exactly what it needs → 50KB
- Web app queries full object → 500KB
- Same bandwidth as BFF: $900/mo
- No code duplication (single GraphQL schema)
- Cost: $500/mo (GraphQL server + tooling)
- Net savings: $3,000/mo vs Single API

Decision:
- Single API: $4,500/mo, poor mobile UX (500KB responses)
- BFF: $1,200/mo ($900 bandwidth + $300 BFF servers), some code duplication
- GraphQL: $1,400/mo ($900 bandwidth + $500 GraphQL infra), no duplication

Result: BFF or GraphQL save $3,000-3,300/mo vs Single API
        BFF wins if simple needs, GraphQL wins if complex/evolving`}
            </CodeBlock>
          </Example>

          <H2>Decision Framework</H2>
          <CodeBlock>
{`if (only_web_client || simple_crud):
    return "Single REST API"
    # $100-500/mo, simplest
    # No need for complexity if only 1 client type

elif (web_mobile_very_different_needs && budget < $1k/mo):
    return "BFF (Backend for Frontend)"
    # $300-1k/mo, 1 BFF per client type
    # Mobile BFF returns 50KB, Web BFF returns 500KB
    # Accept code duplication for performance

elif (rapidly_evolving_ui || many_views):
    return "GraphQL"
    # $500-2k/mo, clients query exact fields needed
    # Best for: Dashboards, admin panels, rapid iteration
    # Avoid N+1 problem with DataLoader

elif (microservices && internal_apis):
    return "gRPC"
    # $200-800/mo, binary protocol, fast
    # Not for public APIs (browser support)

elif (mobile_app && over_fetching_problem):
    return "BFF for now, consider GraphQL if complexity grows"
    # BFF solves 80% of problem, GraphQL is 20% better but 3× complexity

else:
    return "Single REST API until you feel pain"
    # Start simple, add BFF/GraphQL only when over-fetching costs real money`}
          </CodeBlock>

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Using Single API for mobile with heavy payloads</Strong>
            <P>
              Apps serve 500KB JSON to mobile when mobile only needs 50KB, wasting 50TB/mo bandwidth ($4,500/mo) and causing poor UX.
              Users on limited data plans ($5/mo overage) churn at 2-5× higher rates.
            </P>
            <P>
              <Strong>Fix:</Strong> Add Mobile BFF or GraphQL. Reducing payload 500KB → 50KB saves $3,600/mo bandwidth + reduces mobile churn 50%+.
              ROI is 10-20× from reduced bandwidth + improved retention alone.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Using GraphQL for simple CRUD apps</Strong>
            <P>
              Startups with basic CRUD (create/read/update/delete) implement GraphQL for "modern architecture", spending $500/mo + 30% dev time
              on schema/resolvers/N+1 problems when REST would be $100/mo + trivial complexity.
            </P>
            <P>
              <Strong>Fix:</Strong> Use REST for simple CRUD apps. Only use GraphQL when (1) Many complex UIs with different data needs,
              or (2) Rapid UI iteration where REST requires constant backend changes. GraphQL overkill for simple apps.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: BFF code duplication nightmare</Strong>
            <P>
              Companies build 5 BFFs (web, iOS, Android, desktop, TV) with 80% duplicated business logic. Bug fix requires updating 5 codebases,
              costing $20k+/mo in maintenance overhead.
            </P>
            <P>
              <Strong>Fix:</Strong> If &gt;3 BFFs, migrate to GraphQL (single schema, shared resolvers). Or use BFF as thin aggregation layer
              calling shared business logic microservices. Never duplicate core logic across BFFs.
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>ROI Example:</Strong> Mobile BFF saves $3,300/mo vs Single API by reducing bandwidth 10× (500KB → 50KB payloads) and improving mobile UX.
            GraphQL saves $3,000/mo with same bandwidth gains plus no code duplication — worth complexity for &gt;3 client types.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'rate-limiting-tradeoffs',
      type: 'concept',
      title: '🎯 Rate Limiting Algorithm Trade-Offs',
      content: (
        <Section>
          <H1>🎯 Rate Limiting Algorithm Trade-Offs</H1>
          <P>
            <Strong>The Decision:</Strong> Rate limiting prevents abuse and overload. Token Bucket allows bursts, Fixed Window has reset races,
            Sliding Window is accurate but costly. The choice impacts your accuracy, cost, and burst handling.
          </P>

          <H2>Rate Limiting Algorithm Comparison</H2>
          <ComparisonTable
            headers={['Factor', 'Fixed Window', 'Sliding Window', 'Token Bucket', 'Leaky Bucket']}
            rows={[
              ['Accuracy', 'Poor (2× burst at edges)', 'Perfect', 'Good (allows bursts)', 'Good (smooths bursts)'],
              ['Memory Cost', 'Low (1 counter)', 'High (log all requests)', 'Low (1 bucket)', 'Low (1 queue)'],
              ['Redis Cost (1M users)', '$50/mo', '$500/mo (10× data)', '$50/mo', '$50/mo'],
              ['Burst Handling', 'Allows 2× burst at window edge', 'Strictly enforces', 'Allows bursts (up to bucket size)', 'Rejects bursts (queues)'],
              ['Implementation', 'Trivial', 'Complex', 'Medium', 'Medium'],
              ['Best For', 'Simple APIs, coarse limits', 'Financial/payment APIs (strict)', 'User-facing APIs (UX)', 'Background jobs (smooth load)'],
              ['Worst For', 'Critical APIs (2× burst risk)', 'High-scale (memory cost)', 'DDoS protection (allows bursts)', 'Interactive APIs (queuing delay)'],
            ]}
          />

          <H2>Real Decision: API Rate Limiting</H2>
          <Example title="Fixed Window vs Token Bucket for User API">
            <CodeBlock>
{`Scenario: SaaS API, 100 req/min limit per user, 1M API keys

Fixed Window Counter:
- Limit: 100 req/min (reset every minute on clock)
- Window 1: 12:00:00 - 12:00:59
- Window 2: 12:01:00 - 12:01:59

Attack scenario:
- 12:00:58 - 12:01:01 (3 seconds)
- Attacker sends:
  - 100 requests at 12:00:58-59 (allowed, end of window 1)
  - 100 requests at 12:01:00-01 (allowed, start of window 2)
  - Total: 200 requests in 3 seconds (2× burst!)
- Result: Backend overload, 10s latency spike, $5k incident

Redis cost: 1M users × 8 bytes (counter) = 8MB = $15/mo

Sliding Window Log:
- Tracks timestamp of each request
- At 12:01:00, counts requests in last 60 seconds
- Attacker at 12:00:58 already at 100/min → blocked
- Perfect accuracy, no burst exploit

Redis cost: 1M users × 100 req × 8 bytes = 800MB = $150/mo

Token Bucket:
- Bucket capacity: 100 tokens
- Refill rate: 100 tokens/min (1.67/sec)
- User can burst 100 requests instantly (if bucket full)
- Then rate-limited to 1.67 req/sec
- Burst allowed but bucket prevents sustained abuse
- Good UX: User with empty bucket waits <1 min to get tokens back

Redis cost: 1M users × 16 bytes (tokens + timestamp) = 16MB = $20/mo

Decision Matrix:
- Fixed Window: $15/mo, allows 2× burst attack → $5k/incident
  - Only use for non-critical APIs
- Sliding Window: $150/mo, perfect accuracy
  - Worth it for payment/financial APIs (strict limits)
- Token Bucket: $20/mo, allows controlled bursts (good UX)
  - Best for user-facing APIs

ROI:
- Fixed Window: Cheapest but 1 DDoS/month = $5k loss
- Token Bucket: $5/mo more, prevents DDoS, better UX
- Sliding Window: $135/mo more, needed only for financial APIs`}
            </CodeBlock>
          </Example>

          <H2>Decision Framework</H2>
          <CodeBlock>
{`if (financial_api || strict_compliance):
    return "Sliding Window"
    # $150-500/mo, perfect accuracy
    # No burst loopholes, audit-friendly

elif (user_facing_api && good_ux_matters):
    return "Token Bucket"
    # $20-100/mo, allows reasonable bursts
    # User can burst 10 requests, then rate-limited
    # Best UX: doesn't punish legitimate burst usage

elif (background_jobs || smooth_load_needed):
    return "Leaky Bucket"
    # $20-100/mo, queues excess requests
    # Smooths traffic to backend (no spikes)

elif (simple_api && budget < $50/mo):
    return "Fixed Window"
    # $15-50/mo, simplest implementation
    # Accept 2× burst risk for cost savings
    # OK for non-critical APIs

else:
    return "Token Bucket (default)"
    # Best balance: cost-effective + good UX + decent protection
    # Works for 80% of use cases`}
          </CodeBlock>

          <H2>Implementing Token Bucket in Redis</H2>
          <Example title="Token Bucket Rate Limiter">
            <CodeBlock>
{`// Redis-based Token Bucket implementation
async function isRateLimited(userId: string): Promise<boolean> {
  const key = \`rate_limit:\${userId}\`;
  const limit = 100; // 100 requests
  const window = 60; // per 60 seconds
  const refillRate = limit / window; // 1.67 tokens/sec

  const now = Date.now() / 1000;
  const result = await redis.multi()
    .get(\`\${key}:tokens\`)
    .get(\`\${key}:updated\`)
    .exec();

  let tokens = parseFloat(result[0]) || limit;
  const lastUpdated = parseFloat(result[1]) || now;

  // Refill tokens based on time passed
  const timePassed = now - lastUpdated;
  tokens = Math.min(limit, tokens + timePassed * refillRate);

  if (tokens < 1) {
    return true; // Rate limited
  }

  // Consume 1 token
  tokens -= 1;

  await redis.multi()
    .set(\`\${key}:tokens\`, tokens, 'EX', window * 2)
    .set(\`\${key}:updated\`, now, 'EX', window * 2)
    .exec();

  return false; // Allowed
}

Benefits:
- Allows bursts: User can make 100 requests instantly (if bucket full)
- Fair refill: Gets 1.67 tokens/sec continuously
- Low cost: 2 keys per user × 8 bytes = 16 bytes/user
- Good UX: Doesn't block legitimate burst usage (e.g., page load = 10 requests)

Cost at scale:
- 1M users: 16MB Redis memory = $20/mo
- 10M users: 160MB = $50/mo`}
            </CodeBlock>
          </Example>

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Using Fixed Window for critical APIs</Strong>
            <P>
              Payment APIs use Fixed Window rate limiting to "save $135/mo vs Sliding Window", then get exploited by 2× burst attack,
              processing $500k fraudulent transactions. One incident costs 100× more than 10 years of Sliding Window costs.
            </P>
            <P>
              <Strong>Fix:</Strong> Use Sliding Window for financial/payment APIs. $150/mo is negligible insurance vs $500k fraud risk.
              Fixed Window acceptable only for non-critical APIs (analytics, logging).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Not allowing bursts for user-facing APIs</Strong>
            <P>
              Mobile apps use Sliding Window (no bursts allowed) for API limiting. Page load needs 10 requests in 1s, but limit is 1 req/sec.
              Result: 9/10 requests fail, app appears broken, 20% user churn.
            </P>
            <P>
              <Strong>Fix:</Strong> Use Token Bucket for user APIs. Allow bursts (e.g., 100 req burst, then 1.67 req/sec sustained).
              Users can load pages instantly but can't abuse over time. Improves UX + retention.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Using Sliding Window for 100M users</Strong>
            <P>
              High-scale APIs use Sliding Window for perfect accuracy, storing 100 req timestamps per user × 100M users = 80GB Redis ($5,000/mo).
              Token Bucket would cost $200/mo (25× cheaper) with 99% same protection.
            </P>
            <P>
              <Strong>Fix:</Strong> Only use Sliding Window for strict compliance needs (financial, healthcare). For general APIs at scale,
              Token Bucket provides 99% protection for 5% of cost. Perfect accuracy rarely worth 20× price.
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>ROI Example:</Strong> Token Bucket ($20/mo) prevents DDoS incidents ($5k/mo) while allowing good UX bursts — best balance for user-facing APIs.
            Sliding Window ($150/mo) prevents 2× burst exploits in financial APIs — $135/mo insurance vs $500k fraud risk (3,700× ROI).
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

