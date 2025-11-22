import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpCommunicationLesson: SystemDesignLesson = {
  id: 'sdp-communication',
  slug: 'sdp-communication',
  title: 'Communication Protocols',
  description: 'Master communication protocols and critical trade-offs: WHEN to use REST vs gRPC vs GraphQL, HOW WebSocket affects scalability, WHICH protocol fits your latency and flexibility needs.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 75,

  // Progressive flow metadata
  moduleId: 'sd-module-5-primer',
  sequenceOrder: 9,
  stages: [
    {
      id: 'intro-communication',
      type: 'concept',
      title: 'Communication Protocols & APIs',
      content: (
        <Section>
          <H1>Communication Protocols & APIs</H1>
          <P>
            Different protocols optimize for different use cases. Choose based on requirements.
          </P>

          <H2>HTTP/HTTPS</H2>
          <UL>
            <LI><Strong>HTTP/1.1:</Strong> Text-based, one request per connection</LI>
            <LI><Strong>HTTP/2:</Strong> Binary, multiplexing (multiple requests per connection), header compression</LI>
            <LI><Strong>HTTP/3:</Strong> Uses QUIC (UDP-based), faster connection establishment</LI>
            <LI>Stateless, request-response model</LI>
          </UL>

          <H2>RESTful API Design</H2>
          <P>
            REST principles for designing HTTP APIs:
          </P>
          <UL>
            <LI>Use HTTP methods: GET (read), POST (create), PUT (update), DELETE (delete)</LI>
            <LI>Resource-based URLs: /users/123, /users/123/posts</LI>
            <LI>Stateless: Each request contains all needed information</LI>
            <LI>Use status codes: 200 (OK), 201 (Created), 404 (Not Found), 500 (Error)</LI>
          </UL>

          <H2>gRPC</H2>
          <P>
            Google's RPC framework using Protocol Buffers:
          </P>
          <UL>
            <LI>Binary protocol (faster than JSON)</LI>
            <LI>HTTP/2 based (multiplexing)</LI>
            <LI>Strong typing (schema-first)</LI>
            <LI>Streaming support (client/server/bidirectional)</LI>
            <LI>Use for microservices communication</LI>
          </UL>

          <H2>GraphQL</H2>
          <P>
            Query language for APIs - clients request exactly what they need:
          </P>
          <CodeBlock>
{`// Client requests only needed fields
query {
  user(id: 123) {
    name
    email
    posts {
      title
    }
  }
}

// Server returns only requested data
// No over-fetching or under-fetching`}
          </CodeBlock>
          <UL>
            <LI><Strong>Pros:</Strong> Flexible queries, single endpoint, no versioning needed</LI>
            <LI><Strong>Cons:</Strong> Complex queries can be slow, caching harder</LI>
          </UL>

          <H2>WebSocket</H2>
          <P>
            Persistent, bidirectional connection for real-time communication:
          </P>
          <UL>
            <LI>Full-duplex communication (both sides can send)</LI>
            <LI>Lower overhead than HTTP polling</LI>
            <LI>Use for chat, notifications, real-time updates</LI>
            <LI>Maintains connection state (more complex than HTTP)</LI>
          </UL>

          <ComparisonTable
            headers={['Protocol', 'Use Case', 'Performance']}
            rows={[
              ['REST/HTTP', 'General APIs', 'Good'],
              ['gRPC', 'Microservices', 'Excellent'],
              ['GraphQL', 'Flexible queries', 'Good'],
              ['WebSocket', 'Real-time', 'Excellent'],
            ]}
          />

          <KeyPoint>
            <Strong>Choose:</Strong> REST for general APIs, gRPC for microservices, GraphQL for flexible queries,
            WebSocket for real-time communication.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'rest-vs-grpc-vs-graphql-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: REST vs gRPC vs GraphQL',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: REST vs gRPC vs GraphQL</H1>
          <P>
            <Strong>The Decision:</Strong> Choosing between REST, gRPC, and GraphQL determines client flexibility,
            performance, and ecosystem compatibility. REST is ubiquitous but verbose. gRPC is 5-10× faster but less
            compatible. GraphQL is flexible but can enable expensive queries. Wrong choice wastes bandwidth or limits adoption.
          </P>

          <ComparisonTable
            headers={['Factor', 'REST/HTTP+JSON', 'gRPC (Protobuf)', 'GraphQL', 'REST + OpenAPI']}
            rows={[
              ['Latency', '50ms (JSON overhead)', '10ms (binary, 5× faster)', '50ms (JSON)', '50ms (JSON)'],
              ['Bandwidth', '10KB response (verbose JSON)', '2KB response (compact binary)', '3KB (only requested fields)', '10KB (full object)'],
              ['Client Flexibility', 'Fixed endpoints', 'Rigid schema (versioned)', 'Very Flexible (query what you need)', 'Fixed endpoints'],
              ['Ecosystem Support', 'Universal (browsers, curl)', 'Limited (needs libraries)', 'Good (needs GraphQL client)', 'Universal'],
              ['Caching', 'Easy (HTTP caching)', 'Complex (no HTTP caching)', 'Hard (query-based)', 'Easy (HTTP caching)'],
              ['Learning Curve', 'Low (familiar)', 'Medium (protobuf, stubs)', 'High (query language)', 'Low (familiar)'],
              ['Best For', 'Public APIs, web apps', 'Microservices (internal)', 'Mobile apps, variable needs', 'Documented public APIs'],
            ]}
          />

          <Divider />

          <H2>Real Decision: Mobile App Backend API</H2>
          <Example title="REST vs gRPC vs GraphQL - Performance vs Flexibility">
            <CodeBlock>
{`Scenario: Mobile app fetching user profile + posts + comments
Mobile constraints: Limited bandwidth (3G), battery-conscious

---

Approach 1: REST API

GET /api/users/123
Response (10KB JSON):
{
  "id": 123,
  "name": "Alice",
  "email": "alice@example.com",
  "created_at": "2024-01-01",
  "bio": "...",
  "settings": {...},  // 50 fields we don't need
  ...
}

GET /api/users/123/posts
Response (50KB JSON):
[
  {"id": 1, "title": "...", "body": "...", "comments": [...], ...},
  {"id": 2, "title": "...", "body": "...", "comments": [...], ...},
  ...  // 20 posts with all fields
]

Problem: Over-fetching ❌
- Receive 50 user fields, only need 3 (name, email, avatar)
- Receive all post fields, only need (title, created_at)
- Total: 60KB for 5KB of actual needed data (12× waste)

Mobile impact:
- 3G: 60KB = 2 seconds load time
- Battery: Parsing 60KB JSON = high CPU
- Data usage: Users on limited plans complain

Cost: $200/mo (API server handles 10k requests/day)
Decision: ⚠️ Works but wastes bandwidth (bad for mobile)

---

Approach 2: gRPC with Protobuf

// user.proto
message UserProfile {
  int32 id = 1;
  string name = 2;
  string email = 3;
  string avatar = 4;
  repeated Post posts = 5;
}

message Post {
  int32 id = 1;
  string title = 2;
  int64 created_at = 3;
}

// gRPC call
stub.GetUserProfile(UserProfileRequest{user_id: 123})

Response (5KB Protobuf):
- Binary encoding: 60% smaller than JSON
- Only defined fields included
- Strongly typed, fast parsing

Performance:
- Latency: 10ms (vs 50ms REST)
- Bandwidth: 5KB (vs 60KB REST) - 12× reduction ✅
- Parsing: 2ms (vs 20ms JSON) - 10× faster ✅

Mobile impact:
- 3G: 5KB = 0.5 seconds (4× faster load)
- Battery: Binary parsing uses 80% less CPU
- Data usage: Users happy (12× less data)

Cost: $200/mo (same server cost)

Trade-offs:
❌ Browser incompatible (needs gRPC-web proxy)
❌ curl doesn't work (debugging harder)
❌ Learning curve (protobuf, code generation)

Decision: ✅ BEST for mobile apps (bandwidth critical)
         ❌ BAD for web apps (browser compatibility)

---

Approach 3: GraphQL

Query:
query {
  user(id: 123) {
    name
    email
    avatar
    posts(limit: 20) {
      title
      created_at
    }
  }
}

Response (3KB JSON):
{
  "data": {
    "user": {
      "name": "Alice",
      "email": "alice@example.com",
      "avatar": "https://...",
      "posts": [
        {"title": "Post 1", "created_at": "2024-01-01"},
        {"title": "Post 2", "created_at": "2024-01-02"}
      ]
    }
  }
}

Performance:
- Latency: 50ms (JSON overhead)
- Bandwidth: 3KB (only requested fields) - 20× reduction ✅
- Single request (vs 2 REST requests) ✅

Features:
- Client controls fields (mobile queries minimal, web queries more)
- No API versioning (add fields without breaking old clients)
- Introspection (self-documenting schema)

Trade-offs:
❌ Complex queries can be expensive (N+1 problem)
❌ Caching hard (query-dependent, not URL-based)
❌ Learning curve (query language, Apollo Client)

Example expensive query:
query {
  users(limit: 1000) {  // 1000 users
    posts {  // 20 posts each = 20k posts
      comments {  // 100 comments each = 2M comments ❌
        author { name }
      }
    }
  }
}
# Single query fetches 2M comments → DB overload

Mitigation:
- Query depth limit (max 3 levels)
- Query complexity analysis (cost = users × posts × comments)
- Rate limiting per query cost

Cost: $300/mo (+$100 GraphQL server + Apollo)

Decision: ✅ BEST for variable client needs (mobile vs web)
         ⚠️ Requires query cost controls

---

Bandwidth Comparison for Mobile App:

REST:
- Initial load: 60KB (user + posts)
- 10 screens/session × 60KB = 600KB/session
- 1M users × 10 sessions/month × 600KB = 6TB/month bandwidth
- Cost: $540/mo (AWS data transfer $0.09/GB)

gRPC:
- Initial load: 5KB
- 10 screens × 5KB = 50KB/session (12× less)
- 1M users × 10 sessions × 50KB = 500GB/month
- Cost: $45/mo (12× cheaper bandwidth) ✅

GraphQL:
- Initial load: 3KB (optimized query)
- 10 screens × 3KB = 30KB/session (20× less)
- 1M users × 10 sessions × 30KB = 300GB/month
- Cost: $27/mo (20× cheaper bandwidth) ✅

Annual savings:
- REST: $6,480/year
- gRPC: $540/year (saves $5,940/year)
- GraphQL: $324/year (saves $6,156/year)

Decision:
- Mobile app with 3G users: gRPC (fastest, most efficient)
- Mobile + Web app: GraphQL (flexibility, reasonable efficiency)
- Public API: REST (compatibility, ecosystem)
- Internal microservices: gRPC (performance, type safety)`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Decision Framework</H2>
          <CodeBlock>
{`# REST vs gRPC vs GraphQL Decision Tree

client_type = identify_clients()  # Mobile, web, third-party
performance_critical = measure_latency_requirements()
bandwidth_constrained = check_network_conditions()  # 3G, limited data plans

if (public_api || third_party_integration):
    if (need_documentation):
        return "REST + OpenAPI/Swagger"  # Self-documenting, universal
    else:
        return "REST"  # Maximum compatibility

elif (mobile_app && bandwidth_constrained):
    if (browser_support_needed):
        return "GraphQL"  # 20× bandwidth savings, works in browsers
    else:
        return "gRPC"  # 12× bandwidth savings, 5× faster (native apps)

elif (microservices_internal):
    return "gRPC"  # Type safety, performance, backward compatibility

elif (variable_client_needs):  # Mobile needs minimal, web needs full data
    return "GraphQL"  # Client chooses fields

elif (real_time_updates):
    return "GraphQL Subscriptions OR WebSocket"

else:
    return "REST"  # Default choice (simple, universal)

# Performance requirements:
if (latency_required < 20ms):
    return "gRPC"  # Binary protocol, HTTP/2
elif (latency_required < 100ms):
    return "REST or GraphQL"  # JSON overhead acceptable`}
          </CodeBlock>

          <Divider />

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Using gRPC for public APIs</Strong>
            <P>
              Example: Public API uses gRPC → third-party developers can't use curl, Postman, or browser → 90% of potential
              users give up → low API adoption. Developer experience suffers (need to install protoc, generate stubs, learn protobuf).
            </P>
            <P>
              <Strong>Fix:</Strong> Use REST for public APIs (universal compatibility). Use gRPC only for internal microservices
              where you control both client and server. If you must expose gRPC publicly, provide gRPC-web proxy for browsers +
              REST gateway for third-party developers. Extra cost: $100/mo for dual APIs.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: GraphQL without query complexity limits</Strong>
            <P>
              Example: User submits query fetching 1000 users × 100 posts × 50 comments = 5M records → DB query runs for 30 seconds
              → all DB connections exhausted → entire API down for 10 minutes → $50k revenue loss (e-commerce downtime).
            </P>
            <P>
              <Strong>Fix:</Strong> Implement query cost analysis: Assign cost to each field (user=1, post=5, comment=10). Limit
              total cost per query (max 1000). Example: <Code>query cost = users × posts × comments = 1000 × 100 × 50 = 5M (reject)</Code>.
              Also limit query depth (max 3 levels) and pagination (max 100 items). Monitor expensive queries, optimize resolvers.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Using REST without field filtering for mobile</Strong>
            <P>
              Example: Mobile app on 3G fetches 60KB user profile when it only needs 3 fields (name, avatar, email = 500 bytes).
              120× waste → 2 second load time vs 50ms → 30% users abandon slow app → $100k/month lost revenue (lower engagement).
            </P>
            <P>
              <Strong>Fix:</Strong> Option A: Add sparse fieldsets to REST API: <Code>GET /users/123?fields=name,avatar,email</Code>
              (returns 500 bytes instead of 60KB). Option B: Migrate to GraphQL for flexible querying. Option C: Create mobile-specific
              endpoints: <Code>GET /mobile/users/123</Code> (returns minimal data). GraphQL provides most flexibility, sparse fieldsets
              are quickest fix.
            </P>
          </InfoBox>

          <Divider />

          <KeyPoint>
            <Strong>ROI Example:</Strong> Mobile app with 1M users on 3G networks. REST: 600KB/session × 10 sessions/month = 6TB bandwidth
            ($540/mo). GraphQL: 30KB/session = 300GB ($27/mo). Savings: $513/mo = $6,156/year bandwidth cost. Plus: Faster load times
            (2s → 200ms) increase user engagement 15% = $180k/year additional revenue. Implementation: 40 hours GraphQL migration ($8k).
            First year ROI: 22.5× ($186k benefit / $8k cost).
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'websocket-vs-polling-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: WebSocket vs HTTP Polling',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: WebSocket vs HTTP Polling</H1>
          <P>
            <Strong>The Decision:</Strong> WebSocket enables real-time bidirectional communication but adds connection
            management complexity and limits horizontal scaling. HTTP polling is simple but wastes bandwidth and increases
            latency. Wrong choice: either poor UX (delayed updates) or infrastructure overload (10k+ connections/server).
          </P>

          <ComparisonTable
            headers={['Factor', 'Short Polling', 'Long Polling', 'WebSocket', 'Server-Sent Events (SSE)']}
            rows={[
              ['Latency', '5-30s (poll interval)', '1-5s (connection timeout)', '50ms (instant push)', '1-5s (connection timeout)'],
              ['Bandwidth', 'High (headers every poll)', 'Medium (long connections)', 'Very Low (persistent)', 'Low (persistent)'],
              ['Server Load', 'High (constant requests)', 'Medium (held connections)', 'Low (idle connections)', 'Medium (held connections)'],
              ['Scalability', '10k clients/server', '5k clients/server', '50k clients/server', '10k clients/server'],
              ['Complexity', 'Low (standard HTTP)', 'Medium (timeout handling)', 'High (connection state)', 'Low (standard HTTP)'],
              ['Browser Support', 'Universal', 'Universal', 'Modern browsers', 'Modern browsers'],
              ['Bidirectional', 'Yes (separate requests)', 'Yes (separate requests)', 'Yes (same connection)', 'No (server → client only)'],
              ['Best For', 'Rare updates', 'Moderate updates', 'Real-time (chat, games)', 'Live feeds, notifications'],
            ]}
          />

          <Divider />

          <H2>Real Decision: Real-Time Notifications System</H2>
          <Example title="Polling vs WebSocket - Latency vs Complexity">
            <CodeBlock>
{`Scenario: Chat application, 10k concurrent users, 100 messages/sec

---

Approach 1: Short Polling

Client:
setInterval(() => {
  fetch('/api/messages/new?since=' + lastMessageId)
    .then(res => res.json())
    .then(messages => displayMessages(messages))
}, 5000)  // Poll every 5 seconds

Server load:
- 10k users × 12 requests/minute = 120k req/min = 2000 req/sec
- Each request: HTTP headers (500 bytes) + response (avg 100 bytes empty)
- Bandwidth: 2000 req/sec × 600 bytes = 1.2 MB/sec = 3TB/month
- Cost: $270/mo (AWS data transfer)

Performance:
- Latency: 0-5 seconds (avg 2.5s delay) ❌
- Wasted requests: 95% return empty (no new messages)
- User experience: Messages appear with delay (not real-time)

Server capacity:
- Need to handle 2000 req/sec
- 5 servers (r5.large) = $1,500/mo

Total cost: $1,770/mo
Decision: ❌ BAD - High latency, wastes bandwidth

---

Approach 2: Long Polling

Client:
function poll() {
  fetch('/api/messages/wait')  // Server holds connection
    .then(res => res.json())
    .then(messages => {
      displayMessages(messages)
      poll()  // Immediately poll again
    })
}
poll()

Server:
async def wait_for_messages(user_id, timeout=30):
    # Hold connection until new message or timeout
    message = await message_queue.wait(user_id, timeout=30)
    if message:
        return message
    else:
        return []  # Timeout, client will poll again

Server load:
- 10k users × 1 connection held = 10k concurrent connections
- Connection timeout: 30 seconds
- Bandwidth: Only on actual messages (100 msg/sec × 1KB = 100KB/sec)
- Cost: $9/mo bandwidth (vs $270 short polling)

Performance:
- Latency: 50ms-5s (depends on when message arrives)
- User experience: Feels real-time (< 1s typically)

Server capacity:
- 10k held connections per server (within limits)
- 2 servers (r5.large) = $600/mo

Total cost: $609/mo (3× cheaper than short polling)
Decision: ✅ Good compromise (lower cost, better UX)

Trade-offs:
❌ Still wastes resources (reconnect every 30s even if no data)
❌ Connection state hard to scale (sticky sessions needed)

---

Approach 3: WebSocket

Client:
const socket = new WebSocket('ws://api.example.com/messages')

socket.onmessage = (event) => {
  const message = JSON.parse(event.data)
  displayMessage(message)
}

// Send message
socket.send(JSON.stringify({
  type: 'send_message',
  text: 'Hello!'
}))

Server (Node.js):
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws, req) => {
  const userId = authenticate(req)

  // Subscribe user to their message stream
  redis.subscribe(\`user:\${userId}:messages\`, (message) => {
    ws.send(JSON.stringify(message))
  })

  ws.on('message', (data) => {
    const msg = JSON.parse(data)
    handleIncomingMessage(userId, msg)
  })
})

Server load:
- 10k users × 1 persistent connection = 10k connections
- Idle connections use minimal resources (< 1KB/sec keepalive)
- Active messages: 100 msg/sec × 1KB = 100KB/sec
- Bandwidth: 100KB/sec × 2.6M sec/month = 260GB/month
- Cost: $23/mo bandwidth (1/12 of short polling!)

Performance:
- Latency: 50ms (instant push) ✅
- Bidirectional: Client can send without new connection ✅
- User experience: True real-time (chat, gaming)

Server capacity:
- 50k connections per server (with proper tuning)
- 1 server (r5.large optimized) = $300/mo

Total cost: $323/mo (5× cheaper than short polling!)

Trade-offs:
❌ Connection management complexity (reconnect on disconnect)
❌ Load balancing hard (need sticky sessions or Redis pub/sub)
❌ Scaling: Can't use standard HTTP load balancer

Scaling solution: Redis Pub/Sub
- All servers subscribe to Redis channels
- User connects to any server → server subscribes to user's channel
- Message published to Redis → broadcast to all servers → only server
  with user's connection sends to client
- Cost: +$100/mo (Redis)

Decision: ✅ BEST for real-time chat (low latency, low cost)

---

Approach 4: Server-Sent Events (SSE)

Client:
const eventSource = new EventSource('/api/messages/stream')

eventSource.onmessage = (event) => {
  const message = JSON.parse(event.data)
  displayMessage(message)
}

// To send message, use regular HTTP POST
fetch('/api/messages', {
  method: 'POST',
  body: JSON.stringify({ text: 'Hello!' })
})

Server (Node.js):
app.get('/api/messages/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // Subscribe to user's message stream
  redis.subscribe(\`user:\${userId}:messages\`, (message) => {
    res.write(\`data: \${JSON.stringify(message)}\\n\\n\`)
  })
})

Performance:
- Latency: 50ms (instant push like WebSocket)
- Bandwidth: Same as WebSocket (260GB/month)
- Unidirectional: Server → Client only (use POST for client → server)

Benefits vs WebSocket:
✅ Simpler (standard HTTP, no special protocol)
✅ Auto-reconnect built-in (browser handles it)
✅ Works with standard load balancers (HTTP-based)

Trade-offs:
❌ Server → client only (need separate POST for client → server)
❌ Not suitable for bidirectional real-time (gaming, collaborative editing)

Cost: $323/mo (same as WebSocket)

Decision: ✅ BEST for one-way notifications (live feeds, stock prices)
         ❌ NOT for bidirectional real-time (use WebSocket)

---

Cost Comparison for 10k Users:

Short Polling (5s interval):
- Bandwidth: $270/mo
- Servers: $1,500/mo (5× r5.large)
- Total: $1,770/mo

Long Polling:
- Bandwidth: $9/mo
- Servers: $600/mo (2× r5.large)
- Total: $609/mo (3× cheaper)

WebSocket:
- Bandwidth: $23/mo
- Servers: $300/mo (1× r5.large)
- Redis: $100/mo (pub/sub for scaling)
- Total: $423/mo (4× cheaper)

Server-Sent Events:
- Same as WebSocket: $423/mo

Decision Matrix:
- Real-time chat/gaming: WebSocket ✅
- Live notifications (one-way): SSE ✅
- Moderate updates (< 1/min): Long Polling
- Rare updates (< 1/5min): Short Polling`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Decision Framework</H2>
          <CodeBlock>
{`# Polling vs WebSocket Decision Tree

update_frequency = measure_updates_per_minute()
latency_requirement = get_acceptable_latency()
bidirectional_needed = check_client_to_server_messages()
concurrent_users = measure_peak_concurrent_users()

if (update_frequency < 1/minute):  # Rare updates
    return "Short Polling (30-60s interval)"
    # Cost: Low, simple, works everywhere

elif (update_frequency < 10/minute && latency_ok > 5s):
    return "Long Polling"
    # Cost: Medium, good compromise

elif (bidirectional_needed && latency_ok < 1s):  # Real-time bidirectional
    if (concurrent_users < 10k):
        return "WebSocket (single server)"
    else:
        return "WebSocket + Redis Pub/Sub"
        # Scales to 100k+ users

elif (server_to_client_only && latency_ok < 1s):
    return "Server-Sent Events (SSE)"
    # Simpler than WebSocket, auto-reconnect

else:
    return "Long Polling"  # Safe default

# Scaling considerations:
if (concurrent_users > 50k):
    warning("WebSocket needs Redis Pub/Sub for horizontal scaling")
if (concurrent_users > 100k):
    warning("Consider managed service (Pusher, Ably) at $500-2k/mo")`}
          </CodeBlock>

          <Divider />

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Short polling with high frequency</Strong>
            <P>
              Example: Stock price app polls every 1 second for 10k users → 10k req/sec → need 20 servers ($6k/mo) → bandwidth
              3TB/month ($270/mo). Total: $6,270/mo. WebSocket would cost $500/mo (12× cheaper) with better UX (instant updates not 1s delay).
            </P>
            <P>
              <Strong>Fix:</Strong> For updates {'>'} 1/minute, use WebSocket or SSE. Short polling only for rare updates ({'<'} 1/5min).
              Migration: Add WebSocket server (Node.js + Socket.io 2 days), gradually migrate users. Savings: $5,770/mo = $69k/year.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: WebSocket without reconnection logic</Strong>
            <P>
              Example: User's WiFi drops for 5 seconds → WebSocket disconnects → app stops receiving messages → user thinks app
              is broken → closes app → 20% churn increase. No auto-reconnect means poor mobile experience (frequent network changes).
            </P>
            <P>
              <Strong>Fix:</Strong> Always implement exponential backoff reconnection: Try reconnect after 1s, 2s, 4s, 8s, max 30s.
              Display connection status to user ("Reconnecting..."). Use libraries with built-in reconnect (Socket.io, Phoenix channels).
              Or use SSE (browser auto-reconnects). Mobile apps need aggressive reconnect (network changes constantly).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: WebSocket without load balancing strategy</Strong>
            <P>
              Example: 50k WebSocket connections on single server → server crashes → all 50k users disconnected → reconnect storm
              (50k reconnects in 10 seconds) → server crashes again → 30 min downtime → $100k revenue loss (e-commerce).
            </P>
            <P>
              <Strong>Fix:</Strong> Use Redis Pub/Sub for horizontal scaling: Each server subscribes to Redis channels, messages
              published to Redis broadcast to all servers, only server with user's connection sends to client. Setup: 3-5 servers
              behind load balancer (with sticky sessions), Redis cluster ($100-300/mo). Handles 100k+ connections gracefully.
              Alternative: Managed service (Pusher $500-2k/mo) if budget allows.
            </P>
          </InfoBox>

          <Divider />

          <KeyPoint>
            <Strong>ROI Example:</Strong> Chat app with 10k users. Short polling (5s): $1,770/mo (high latency, poor UX). WebSocket:
            $423/mo + 2 days migration ($3,200). Savings: $1,347/mo = $16,164/year. Plus: Real-time UX (50ms vs 2.5s latency) increases
            user engagement 25% = $200k/year additional revenue (better retention). First year ROI: 62× ($216k benefit / $3.5k cost).
            WebSocket is clear winner for real-time apps.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

