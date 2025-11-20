import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider 
} from '../../../ui/components/LessonContent';

export const gatewayFundamentalsLesson: SystemDesignLesson = {
  id: 'gateway-fundamentals',
  slug: 'gateway-fundamentals',
  title: 'API Gateway Fundamentals',
  description: 'Master API Gateway trade-offs: WHEN to use API Gateway vs direct service calls vs Service Mesh, based on number of services and security requirements. Learn routing, authentication, rate limiting, and service discovery patterns.',
  category: 'patterns',
  difficulty: 'intermediate',
  estimatedMinutes: 35,
  stages: [
    {
      id: 'what-is-gateway',
      type: 'concept',
      title: 'What is an API Gateway?',
      content: (
        <Section>
          <H1>What is an API Gateway?</H1>
          
          <P>
            An API Gateway is a single entry point for all client requests to backend microservices.
          </P>

          <H2>Without API Gateway</H2>

          <CodeBlock>
{`Mobile App → User Service (http://users.api.com)
          → Order Service (http://orders.api.com)
          → Product Service (http://products.api.com)
          → Payment Service (http://payments.api.com)`}
          </CodeBlock>

          <P><Strong>Problems:</Strong></P>
          <UL>
            <LI>Client needs to know all service URLs</LI>
            <LI>No centralized authentication</LI>
            <LI>No rate limiting</LI>
            <LI>CORS issues (cross-origin requests)</LI>
            <LI>Difficult to monitor</LI>
          </UL>

          <Divider />

          <H2>With API Gateway</H2>

          <CodeBlock>
{`Mobile App → API Gateway (https://api.company.com)
                ↓
          [Authentication, Rate Limiting, Logging]
                ↓
          → User Service
          → Order Service
          → Product Service
          → Payment Service`}
          </CodeBlock>

          <P><Strong>Benefits:</Strong></P>
          <UL>
            <LI>Single URL for clients</LI>
            <LI>Centralized auth, rate limiting, logging</LI>
            <LI>Service discovery</LI>
            <LI>Request/response transformation</LI>
            <LI>Easy to monitor</LI>
          </UL>

          <Divider />

          <H2>API Gateway Responsibilities</H2>

          <H3>1. <Strong>Routing</Strong></H3>
          <P>Route requests to appropriate backend service.</P>
          <CodeBlock>
{`GET /api/users/123    → User Service
GET /api/orders/456   → Order Service
GET /api/products/789 → Product Service`}
          </CodeBlock>

          <H3>2. <Strong>Authentication</Strong></H3>
          <P>Validate JWT tokens before forwarding.</P>
          <CodeBlock>
{`Request: GET /api/orders/456
Header: Authorization: Bearer <jwt_token>

Gateway:
  1. Validate JWT token
  2. Extract user_id from token
  3. Forward to Order Service with X-User-Id header`}
          </CodeBlock>

          <H3>3. <Strong>Rate Limiting</Strong></H3>
          <P>Protect backend services from abuse.</P>
          <CodeBlock>
{`Free tier: 100 requests/hour
Pro tier: 1000 requests/hour

If exceeded → 429 Too Many Requests`}
          </CodeBlock>

          <H3>4. <Strong>Request/Response Transformation</Strong></H3>
          <P>Modify headers, payloads, or formats.</P>
          <CodeBlock>
{`Client sends: XML
Gateway transforms to: JSON
Backend receives: JSON`}
          </CodeBlock>

          <H3>5. <Strong>Circuit Breaking</Strong></H3>
          <P>Prevent cascading failures.</P>
          <CodeBlock>
{`If Order Service fails 5 times:
  → Open circuit breaker
  → Return cached response or error
  → Stop sending requests for 30 seconds`}
          </CodeBlock>

          <H3>6. <Strong>Caching</Strong></H3>
          <P>Cache responses for performance.</P>
          <CodeBlock>
{`GET /api/products/123
  → Check cache
  → If hit: return cached response (5ms)
  → If miss: forward to Product Service (50ms)`}
          </CodeBlock>
        </Section>
      ),
    },
    {
      id: 'rate-limiting',
      type: 'concept',
      title: 'Rate Limiting',
      content: (
        <Section>
          <H1>Rate Limiting</H1>
          
          <P>Protect APIs from abuse by limiting requests per user.</P>

          <H2>Why Rate Limiting?</H2>

          <H3>Without Rate Limiting</H3>
          <CodeBlock>
{`Malicious user sends 1M requests/sec
  → API servers overloaded
  → Database crashes
  → All users affected`}
          </CodeBlock>

          <H3>With Rate Limiting</H3>
          <CodeBlock>
{`User sends 1M requests/sec
  → Gateway allows first 1000 requests
  → Blocks remaining 999,000 requests
  → Returns 429 Too Many Requests
  → Backend services protected`}
          </CodeBlock>

          <Divider />

          <H2>Rate Limiting Algorithms</H2>

          <H3>1. Token Bucket</H3>
          <P>Most popular algorithm. Tokens refill at constant rate.</P>

          <CodeBlock>
{`Bucket capacity: 100 tokens
Refill rate: 10 tokens/second

Request arrives:
  1. Check if bucket has token
  2. If yes: remove token, allow request
  3. If no: reject request (429)

Example:
- Start: 100 tokens
- 50 requests → 50 tokens left
- Wait 5 seconds → 50 + (10×5) = 100 tokens (capped at 100)
- 120 requests → first 100 allowed, next 20 rejected`}
          </CodeBlock>

          <P><Strong>Pros:</Strong></P>
          <UL>
            <LI>Allows bursts (use all tokens at once)</LI>
            <LI>Simple to implement</LI>
            <LI>Memory efficient</LI>
          </UL>

          <P><Strong>Use Case:</Strong> Most APIs (AWS, Stripe, Twitter)</P>

          <Divider />

          <H3>2. Leaky Bucket</H3>
          <P>Requests processed at constant rate, excess requests queued.</P>

          <CodeBlock>
{`Queue capacity: 100 requests
Processing rate: 10 requests/second

Request arrives:
  1. Add to queue
  2. If queue full: reject (429)
  3. Process from queue at constant rate

Smooths out bursts`}
          </CodeBlock>

          <P><Strong>Pros:</Strong> Smooth, predictable rate</P>
          <P><Strong>Cons:</Strong> Adds latency (queuing)</P>
          <P><Strong>Use Case:</Strong> Network traffic shaping</P>

          <Divider />

          <H3>3. Fixed Window</H3>
          <P>Count requests in fixed time windows.</P>

          <CodeBlock>
{`Limit: 100 requests per minute

Window 1 (00:00-00:59): 100 requests → allowed
Window 2 (01:00-01:59): 100 requests → allowed

Problem: Burst at window boundary
- 00:30-00:59: 100 requests
- 01:00-01:30: 100 requests
→ 200 requests in 1 minute!`}
          </CodeBlock>

          <P><Strong>Pros:</Strong> Simple</P>
          <P><Strong>Cons:</Strong> Boundary burst issue</P>

          <Divider />

          <H3>4. Sliding Window</H3>
          <P>Count requests in rolling time window.</P>

          <CodeBlock>
{`Limit: 100 requests per minute

At 00:30:
  Count requests from 23:30 to 00:30 (last 60 seconds)
  
At 00:45:
  Count requests from 23:45 to 00:45 (last 60 seconds)

No boundary burst issue!`}
          </CodeBlock>

          <P><Strong>Pros:</Strong> More accurate</P>
          <P><Strong>Cons:</Strong> More memory (store timestamps)</P>

          <Divider />

          <ComparisonTable
            headers={['Algorithm', 'Bursts?', 'Memory', 'Accuracy', 'Use Case']}
            rows={[
              ['Token Bucket', '✅ Yes', 'Low', 'Good', 'Most APIs'],
              ['Leaky Bucket', '❌ No', 'Medium', 'Excellent', 'Traffic shaping'],
              ['Fixed Window', '⚠️ Boundary', 'Low', 'Poor', 'Simple systems'],
              ['Sliding Window', '❌ No', 'High', 'Excellent', 'Strict limits'],
            ]}
          />

          <KeyPoint>
            <Strong>Token Bucket</Strong> is the most popular choice for APIs because it allows 
            bursts while being memory-efficient!
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'circuit-breaker',
      type: 'concept',
      title: 'Circuit Breaker',
      content: (
        <Section>
          <H1>Circuit Breaker</H1>

          <P>
            Prevent cascading failures by stopping requests to failing services.
          </P>

          <H2>The Problem: Cascading Failures</H2>

          <Example title="Without Circuit Breaker">
            <CodeBlock>
{`Order Service → Payment Service (down)
  → Timeout after 30 seconds
  → 100 concurrent requests × 30s = 3000s wasted
  → Order Service threads exhausted
  → Order Service crashes
  → API Gateway overwhelmed
  → Entire system down!`}
            </CodeBlock>
          </Example>

          <H2>Solution: Circuit Breaker</H2>

          <Example title="With Circuit Breaker">
            <CodeBlock>
{`Order Service → Payment Service (down)
  → Circuit breaker detects failures
  → Opens circuit (stops sending requests)
  → Returns error immediately (no timeout)
  → Order Service stays healthy
  → System partially functional`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Circuit Breaker States</H2>

          <H3>1. Closed (Normal)</H3>
          <UL>
            <LI>Requests flow normally</LI>
            <LI>Monitor failure rate</LI>
            <LI>If failures exceed threshold → Open</LI>
          </UL>

          <CodeBlock>
{`Threshold: 5 failures in 10 seconds
Status: Closed
Requests: ✅ ✅ ✅ ❌ ❌ ❌ ❌ ❌
→ 5 failures → Open circuit`}
          </CodeBlock>

          <H3>2. Open (Failing)</H3>
          <UL>
            <LI>All requests fail immediately</LI>
            <LI>No requests sent to backend</LI>
            <LI>Wait timeout period (e.g., 30 seconds)</LI>
            <LI>After timeout → Half-Open</LI>
          </UL>

          <CodeBlock>
{`Status: Open
Requests: ❌ ❌ ❌ (all rejected immediately)
Wait 30 seconds → Half-Open`}
          </CodeBlock>

          <H3>3. Half-Open (Testing)</H3>
          <UL>
            <LI>Allow limited requests through</LI>
            <LI>If successful → Close circuit</LI>
            <LI>If fail → Open circuit again</LI>
          </UL>

          <CodeBlock>
{`Status: Half-Open
Test requests: ✅ ✅ ✅
→ Success! → Close circuit

OR

Test requests: ❌ ❌
→ Still failing → Open circuit (wait another 30s)`}
          </CodeBlock>

          <Divider />

          <H2>Implementation</H2>

          <CodeBlock language="javascript">
{`class CircuitBreaker {
  constructor(threshold = 5, timeout = 30000) {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.nextAttempt = Date.now();
  }

  async call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}`}
          </CodeBlock>

          <Divider />

          <H2>Best Practices</H2>

          <UL>
            <LI><Strong>Set appropriate thresholds:</Strong> Too low = false positives, too high = slow detection</LI>
            <LI><Strong>Use exponential backoff:</Strong> Increase timeout on repeated failures</LI>
            <LI><Strong>Monitor circuit state:</Strong> Alert when circuits open</LI>
            <LI><Strong>Provide fallbacks:</Strong> Return cached data or default response</LI>
            <LI><Strong>Per-endpoint circuits:</Strong> Don't block all endpoints if one fails</LI>
          </UL>

          <KeyPoint>
            Circuit breakers prevent cascading failures by failing fast when services are down!
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'service-discovery',
      type: 'concept',
      title: 'Service Discovery',
      content: (
        <Section>
          <H1>Service Discovery</H1>

          <P>
            Automatically find and connect to backend services in dynamic environments.
          </P>

          <H2>The Problem</H2>

          <P>
            In microservices, service instances are constantly changing (scaling, deployments, failures).
          </P>

          <Example title="Hardcoded URLs don't work">
            <CodeBlock>
{`// Gateway config
const ORDER_SERVICE_URL = 'http://10.0.1.5:8080';

Problems:
- IP changes when service restarts
- Can't load balance across multiple instances
- Manual updates required for scaling
- No health checking`}
            </CodeBlock>
          </Example>

          <H2>Solution: Service Discovery</H2>

          <P>Services register themselves, gateway discovers them dynamically.</P>

          <Divider />

          <H2>Service Discovery Patterns</H2>

          <H3>1. Client-Side Discovery</H3>
          <P>Client queries service registry and load balances.</P>

          <CodeBlock>
{`1. Service instances register with registry
   Order Service A → Registry (10.0.1.5:8080)
   Order Service B → Registry (10.0.1.6:8080)

2. Gateway queries registry
   Gateway → Registry: "Where is Order Service?"
   Registry → Gateway: [10.0.1.5:8080, 10.0.1.6:8080]

3. Gateway picks instance (load balancing)
   Gateway → 10.0.1.5:8080`}
          </CodeBlock>

          <P><Strong>Examples:</Strong> Netflix Eureka, Consul</P>

          <H3>2. Server-Side Discovery</H3>
          <P>Load balancer queries registry and routes.</P>

          <CodeBlock>
{`1. Gateway → Load Balancer (single URL)
2. Load Balancer queries registry
3. Load Balancer routes to healthy instance

Examples: AWS ELB, Kubernetes Service`}
          </CodeBlock>

          <Divider />

          <H2>Service Registry</H2>

          <P>Central database of service instances.</P>

          <H3>Registration</H3>
          <CodeBlock>
{`// Service startup
POST /registry/services
{
  "name": "order-service",
  "host": "10.0.1.5",
  "port": 8080,
  "health_check": "http://10.0.1.5:8080/health"
}`}
          </CodeBlock>

          <H3>Health Checking</H3>
          <CodeBlock>
{`Registry pings health endpoint every 10 seconds
GET http://10.0.1.5:8080/health

If fails 3 times:
  → Mark instance as unhealthy
  → Remove from available instances`}
          </CodeBlock>

          <H3>Discovery</H3>
          <CodeBlock>
{`GET /registry/services/order-service
Response:
{
  "instances": [
    {"host": "10.0.1.5", "port": 8080, "healthy": true},
    {"host": "10.0.1.6", "port": 8080, "healthy": true},
    {"host": "10.0.1.7", "port": 8080, "healthy": false}
  ]
}`}
          </CodeBlock>

          <Divider />

          <H2>Popular Service Discovery Tools</H2>

          <ComparisonTable
            headers={['Tool', 'Type', 'Health Checks', 'Use Case']}
            rows={[
              ['Consul', 'Client-side', '✅ Yes', 'Multi-datacenter'],
              ['Eureka', 'Client-side', '✅ Yes', 'Netflix stack'],
              ['Kubernetes DNS', 'Server-side', '✅ Yes', 'Kubernetes'],
              ['AWS ELB', 'Server-side', '✅ Yes', 'AWS'],
              ['etcd', 'Client-side', '❌ No', 'Key-value store'],
            ]}
          />

          <KeyPoint>
            Service discovery enables dynamic, scalable microservices by automatically
            finding healthy service instances!
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'gateway-tradeoffs',
      type: 'concept',
      title: 'API Gateway Trade-Offs',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: API Gateway vs Direct Calls vs Service Mesh</H1>

          <ComparisonTable
            headers={['Approach', 'Latency', 'Complexity', 'Features', 'Cost/mo', 'Best For', 'Worst For']}
            rows={[
              [
                'Direct Service Calls\n(no gateway)',
                'Low\n10-20ms',
                'Very Low',
                'None\n(DIY everything)',
                '$0',
                '• Monolith\n• 2-3 services\n• Internal only\n• MVP',
                '• >5 services\n• Public API\n• Need auth/rate limiting\n• Mobile clients'
              ],
              [
                'API Gateway\n(Kong, AWS)',
                'Medium\n20-50ms\n(+1 hop)',
                'Medium',
                'Rich\n(auth, rate limit, transform)',
                '$200-1000',
                '• Microservices\n• Public API\n• Mobile/web clients\n• Need centralized control',
                '• Service-to-service\n• Ultra low latency\n• Simple routing only'
              ],
              [
                'Service Mesh\n(Istio, Linkerd)',
                'Medium\n20-50ms\n(sidecar)',
                'Very High',
                'Advanced\n(mTLS, observability, retry)',
                '$500-2000',
                '• Many services (>20)\n• Service-to-service security\n• Advanced traffic mgmt\n• Large teams',
                '• <10 services\n• Small teams\n• Simple use cases\n• Cost-sensitive'
              ],
            ]}
          />

          <Example title="Real Decision: E-commerce with 5 Microservices">
            <P><Strong>Option 1: Direct Service Calls (wrong for external API)</Strong></P>
            <CodeBlock>
{`Mobile App directly calls:
- https://users.myapp.com/api/profile
- https://orders.myapp.com/api/orders
- https://products.myapp.com/api/search
- https://payments.myapp.com/api/charge

Problems:
1. Auth: Each service validates JWT (duplicated logic, inconsistent)
2. Rate limiting: No protection → DDoS vulnerability
3. CORS: 5 different origins → CORS configuration nightmare
4. Monitoring: Scattered across 5 services
5. Mobile app hardcodes 5 URLs → Can't change service URLs without app update

Result: ❌ Unmanageable for public-facing API`}
            </CodeBlock>

            <P><Strong>Option 2: API Gateway (correct choice)</Strong></P>
            <CodeBlock>
{`Mobile App calls single endpoint:
- https://api.myapp.com/users/profile
- https://api.myapp.com/orders
- https://api.myapp.com/products/search
- https://api.myapp.com/payments/charge

API Gateway handles:
1. Auth: Validate JWT once, forward user_id to services
2. Rate limiting: 1000 req/hour per user (centralized)
3. CORS: Single origin configuration
4. Monitoring: All requests logged in one place
5. Routing: Change backend URLs without app updates

Setup: Kong or AWS API Gateway
Cost: $300/mo (Kong on EC2) or $200/mo (AWS API Gateway pay-per-use)
Latency: +10ms overhead (acceptable)

Result: ✅ Clean, manageable, secure

Trade-off: +10ms latency + $300/mo vs centralized control + security`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> API Gateway adds 10ms latency + $300/mo but provides essential features
              (auth, rate limiting, monitoring) for public APIs. Worth it for >3 services.
            </KeyPoint>
          </Example>

          <Example title="Real Decision: Large Microservices Platform (50+ Services)">
            <P><Strong>Option 1: API Gateway only (insufficient)</Strong></P>
            <CodeBlock>
{`Problem: Service-to-service communication
- Order Service → Payment Service (internal call)
- Order Service → Inventory Service (internal call)
- Payment Service → Notification Service (internal call)

Routing through API Gateway:
Order Service → API Gateway → Payment Service

Issues:
1. Extra hop: +10ms latency for internal calls
2. Gateway becomes bottleneck (all traffic)
3. No mutual TLS between services (security gap)
4. No fine-grained retry policies per service

Result: ❌ API Gateway alone doesn't solve service-to-service challenges`}
            </CodeBlock>

            <P><Strong>Option 2: API Gateway + Service Mesh (correct for large scale)</Strong></P>
            <CodeBlock>
{`Architecture:
- External traffic (mobile/web) → API Gateway → Services
- Internal traffic (service-to-service) → Service Mesh (Istio)

API Gateway (Kong):
- Handles: External authentication, rate limiting, public API
- Traffic: 10k req/sec from mobile/web

Service Mesh (Istio):
- Handles: mTLS between services, retries, circuit breaking, observability
- Traffic: 100k req/sec internal service-to-service

Benefits:
1. mTLS: Automatic encryption between all services
2. Retries: Automatic retry with exponential backoff
3. Circuit breaking: Fail fast when service is down
4. Observability: Distributed tracing for all calls

Cost:
- API Gateway: $500/mo
- Service Mesh: $1,500/mo (Istio control plane + sidecars)
- Total: $2,000/mo

Complexity:
- High: Two systems to manage
- Team requirement: 10+ engineers with expertise

Result: ✅ Worth it for 50+ services

Trade-off: $2k/mo + high complexity vs production-grade reliability + security`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> Service Mesh costs $2k/mo + adds complexity but essential for >20 services
              needing mTLS, retries, circuit breaking. API Gateway handles external, mesh handles internal.
            </KeyPoint>
          </Example>

          <H3>Decision Framework: Choosing Gateway Strategy</H3>
          <CodeBlock>
{`How many services do you have?

├─ <3 services → No Gateway (direct calls)
│   └─ Examples: Monolith + 1-2 services, MVP, internal tools
│   └─ Accept: Manual auth, no centralized rate limiting
│   └─ Benefit: $0 cost, simple, low latency
│
├─ 3-20 services → API Gateway (Kong, AWS API Gateway)
│   └─ Examples: Standard microservices, public API, mobile app backend
│   └─ Accept: +10ms latency, $200-500/mo
│   └─ Benefit: Centralized auth, rate limiting, monitoring
│
└─ >20 services → API Gateway + Service Mesh
    │
    ├─ Need service-to-service security? (mTLS, zero-trust)
    │   └─ YES → Service Mesh (Istio, Linkerd)
    │       └─ Accept: $2k/mo, high complexity, team expertise needed
    │       └─ Benefit: mTLS, retries, circuit breaking, observability
    │
    └─ Simple service-to-service only?
        └─ Stick with API Gateway + manual retries
            └─ Cheaper but less robust`}
          </CodeBlock>

          <H3>Common Mistakes</H3>
          <UL>
            <LI>
              <Strong>❌ No API Gateway for public-facing microservices</Strong>
              <UL>
                <LI>Problem: Auth scattered across services, no rate limiting, CORS nightmare</LI>
                <LI>Fix: Add API Gateway for external traffic (Kong, AWS API Gateway)</LI>
              </UL>
            </LI>
            <LI>
              <Strong>❌ Using Service Mesh for small projects (&lt;10 services)</Strong>
              <UL>
                <LI>Problem: $2k/mo + massive complexity for small team</LI>
                <LI>Fix: API Gateway is sufficient for &lt;20 services</LI>
              </UL>
            </LI>
            <LI>
              <Strong>❌ Routing internal service-to-service through API Gateway</Strong>
              <UL>
                <LI>Problem: Extra hop, gateway bottleneck, no mTLS</LI>
                <LI>Fix: Direct service-to-service OR service mesh for internal traffic</LI>
              </UL>
            </LI>
          </UL>

          <KeyPoint>
            <Strong>Golden Rule:</Strong> For &lt;3 services, no gateway needed. For 3-20 services, use API Gateway.
            For >20 services with security needs, add Service Mesh for internal traffic.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

