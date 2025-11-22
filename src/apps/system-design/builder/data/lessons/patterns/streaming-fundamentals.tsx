import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider 
} from '../../../ui/components/LessonContent';

export const streamingFundamentalsLesson: SystemDesignLesson = {
  id: 'streaming-fundamentals',
  slug: 'streaming-fundamentals',
  title: 'Real-time Streaming Fundamentals',
  description: 'Master streaming trade-offs: WHEN to use polling vs WebSocket vs SSE, WHICH message queue (RabbitMQ vs Kafka vs SQS), WHICH delivery guarantee (at-most-once vs at-least-once vs exactly-once), and WHEN to use event sourcing vs traditional state storage based on audit requirements and access patterns.',
  category: 'patterns',
  difficulty: 'intermediate',
  estimatedMinutes: 60,

  // Progressive flow metadata
  moduleId: 'sd-module-3-patterns',
  sequenceOrder: 7,

  stages: [
    {
      id: 'what-is-streaming',
      type: 'concept',
      title: 'What is Streaming?',
      content: (
        <Section>
          <H1>What is Real-time Streaming?</H1>
          
          <P>
            Streaming is the continuous flow of data from producers to consumers in real-time.
          </P>

          <H2>Request/Response vs Streaming</H2>

          <H3>Request/Response (Traditional)</H3>
          <CodeBlock>
{`Client: "Give me the latest data"
Server: "Here's the data from 5 seconds ago"
Client: (waits 5 seconds)
Client: "Give me the latest data again"
Server: "Here's the data from now"`}
          </CodeBlock>

          <P><Strong>Problems:</Strong></P>
          <UL>
            <LI>Polling wastes resources</LI>
            <LI>Latency (5+ seconds)</LI>
            <LI>Not truly real-time</LI>
          </UL>

          <H3>Streaming (Modern)</H3>
          <CodeBlock>
{`Client: "Send me updates as they happen"
Server: (pushes data immediately when available)
Server: → Update 1
Server: → Update 2
Server: → Update 3`}
          </CodeBlock>

          <P><Strong>Benefits:</Strong></P>
          <UL>
            <LI>No polling needed</LI>
            <LI>Sub-second latency</LI>
            <LI>Truly real-time</LI>
          </UL>

          <Divider />

          <H2>Real-World Examples</H2>

          <H3>1. <Strong>Social Media Feed</Strong></H3>
          <UL>
            <LI>New posts appear instantly</LI>
            <LI>Like counts update in real-time</LI>
            <LI>Notifications delivered immediately</LI>
          </UL>

          <H3>2. <Strong>Chat Applications</Strong></H3>
          <UL>
            <LI>Messages delivered in &lt;100ms</LI>
            <LI>Typing indicators</LI>
            <LI>Online presence</LI>
          </UL>

          <H3>3. <Strong>Stock Trading</Strong></H3>
          <UL>
            <LI>Real-time price updates</LI>
            <LI>Order book changes</LI>
            <LI>Trade executions</LI>
          </UL>

          <H3>4. <Strong>Ride Sharing</Strong></H3>
          <UL>
            <LI>Driver location updates every second</LI>
            <LI>Real-time ETA updates</LI>
            <LI>Trip status changes</LI>
          </UL>

          <Divider />

          <H2>Why Streaming?</H2>

          <ComparisonTable
            headers={['Aspect', 'Polling', 'Streaming']}
            rows={[
              ['User Experience', 'Manual refresh', 'Instant updates'],
              ['Server Load', 'Constant requests', 'Push only on change'],
              ['Latency', '5-10 seconds', '<100ms'],
              ['Efficiency', 'Wasteful', '50-100x better'],
            ]}
          />
        </Section>
      ),
    },
    {
      id: 'websockets',
      type: 'concept',
      title: 'WebSockets',
      content: (
        <Section>
          <H1>WebSockets</H1>
          
          <P>Persistent, bidirectional connection between client and server.</P>

          <H2>HTTP vs WebSocket</H2>

          <H3>HTTP (Request/Response)</H3>
          <CodeBlock>
{`Client → Server: GET /data
Server → Client: 200 OK {data}

(connection closes)

Client → Server: GET /data (new connection)
Server → Client: 200 OK {data}`}
          </CodeBlock>

          <P><Strong>Problems:</Strong></P>
          <UL>
            <LI>New connection for each request</LI>
            <LI>Overhead: TCP handshake, TLS handshake, HTTP headers</LI>
            <LI>Can't push data from server</LI>
          </UL>

          <H3>WebSocket (Persistent Connection)</H3>
          <CodeBlock>
{`Client → Server: Upgrade to WebSocket
Server → Client: 101 Switching Protocols

(connection stays open)

Server → Client: {message1}
Client → Server: {message2}
Server → Client: {message3}`}
          </CodeBlock>

          <P><Strong>Benefits:</Strong></P>
          <UL>
            <LI>Single persistent connection</LI>
            <LI>Low overhead (no handshakes)</LI>
            <LI>Bidirectional (server can push)</LI>
          </UL>

          <Divider />

          <H2>WebSocket Lifecycle</H2>

          <H3>1. Handshake</H3>
          <CodeBlock language="http">
{`GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade`}
          </CodeBlock>

          <H3>2. Message Exchange</H3>
          <CodeBlock language="javascript">
{`// Client
const ws = new WebSocket('ws://example.com/chat');

ws.onopen = () => {
  ws.send('Hello server!');
};

ws.onmessage = (event) => {
  console.log('Received:', event.data);
};

// Server pushes messages
ws.send('New message from user123');`}
          </CodeBlock>

          <H3>3. Close Connection</H3>
          <CodeBlock>
{`ws.close();
// Or server closes
// Or network failure`}
          </CodeBlock>

          <Divider />

          <H2>When to Use WebSockets</H2>

          <ComparisonTable
            headers={['Use Case', 'Use WebSocket?', 'Why?']}
            rows={[
              ['Chat app', '✅ Yes', 'Instant message delivery'],
              ['Live sports scores', '✅ Yes', 'Real-time score updates'],
              ['Stock ticker', '✅ Yes', 'Continuous price stream'],
              ['REST API', '❌ No', 'Request/response is simpler'],
              ['File upload', '❌ No', 'HTTP handles this well'],
              ['Static website', '❌ No', 'No real-time needs'],
            ]}
          />

          <KeyPoint>
            Use WebSockets when you need <Strong>bidirectional, real-time communication</Strong>.
            For simple request/response, stick with HTTP!
          </KeyPoint>

          <Divider />

          <H2>🎯 Critical Trade-Off: Polling vs WebSocket vs Server-Sent Events (SSE)</H2>

          <ComparisonTable
            headers={['Approach', 'Latency', 'Server Cost', 'Complexity', 'Direction', 'Best For', 'Avoid When']}
            rows={[
              [
                'Short Polling\n(HTTP every 5s)',
                'High\n(avg 2.5s delay)',
                'Very High\n(constant requests)',
                'Very Low',
                'Client → Server\n(request only)',
                '• Rare updates\n• Simple apps\n• No real-time needs',
                '• Real-time chat\n• Live dashboards\n• High-frequency updates'
              ],
              [
                'Long Polling\n(HTTP hangs)',
                'Low\n(<100ms)',
                'Medium\n(held connections)',
                'Low',
                'Server → Client\n(push-like)',
                '• Moderate real-time\n• Browser compatibility\n• Fallback for WebSocket',
                '• Bi-directional\n• High frequency\n• Modern browsers only'
              ],
              [
                'Server-Sent Events\n(SSE)',
                'Low\n(<100ms)',
                'Low\n(efficient push)',
                'Low',
                'Server → Client\n(one-way)',
                '• Live scores\n• Stock tickers\n• Notifications\n• Activity feeds',
                '• Bi-directional\n• Binary data\n• Mobile apps (poor support)'
              ],
              [
                'WebSocket',
                'Very Low\n(<50ms)',
                'Low\n(persistent)',
                'Medium',
                'Bi-directional\n(both ways)',
                '• Chat\n• Gaming\n• Collaboration\n• Trading platforms',
                '• One-way updates\n• Infrequent data\n• Simple apps'
              ],
            ]}
          />

          <Example title="Real Decision: Live Sports Scores (10,000 users)">
            <P><Strong>Option 1: Short Polling (every 5 seconds)</Strong></P>
            <CodeBlock>
{`Requests: 10,000 users × 12 req/min = 120,000 req/min = 2,000 req/sec
Server cost:
- 2,000 req/sec × 10ms each = 20 CPU cores needed
- EC2: $500/mo for 20-core capacity
- 99% of requests return "no new data" (wasteful!)

Latency:
- Average delay: 2.5 seconds (half the polling interval)
- User sees score 2.5 seconds late (poor UX)

Bandwidth:
- 2,000 req/sec × 1KB response = 2 MB/sec = 5TB/mo
- Data transfer cost: $450/mo

Total cost: $950/mo
Result: ❌ Expensive + slow + wasteful`}
            </CodeBlock>

            <P><Strong>Option 2: Server-Sent Events (Correct Choice)</Strong></P>
            <CodeBlock>
{`Connections: 10,000 persistent SSE connections
Server cost:
- 10,000 connections × 1KB memory = 10MB memory
- Push only when score changes: ~20 updates/game × 10 games = 200 pushes/min
- 200 pushes/min vs 120,000 requests/min (600x more efficient!)
- EC2: $50/mo for 2-core capacity

Latency:
- Instant push when score changes (<100ms)
- User sees score immediately (great UX)

Bandwidth:
- 200 pushes/min × 1KB × 10,000 users = 2GB/mo (only send when changed)
- Data transfer cost: $0.20/mo

Total cost: $50/mo
Result: ✅ 19x cheaper + instant updates + efficient

Trade-off: One-way only (server → client), but that's all we need!`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> SSE is 19x cheaper + 25x faster for live scores.
              Polling wastes 99% of requests sending "no new data". Choose based on direction needs.
            </KeyPoint>
          </Example>

          <Example title="Real Decision: Chat Application (Slack, Discord)">
            <P><Strong>Option 1: Server-Sent Events (one-way push)</Strong></P>
            <CodeBlock>
{`Problem: SSE is server → client only
- User types message → Must use HTTP POST to send
- Requires 2 connections: SSE (receive) + HTTP (send)
- Complexity: Managing 2 connection types
- Mobile: Poor SSE support on iOS/Android

Result: ❌ Not ideal for bi-directional chat`}
            </CodeBlock>

            <P><Strong>Option 2: WebSocket (Correct Choice)</Strong></P>
            <CodeBlock>
{`Solution: Single bi-directional connection
- User types message → Send via WebSocket
- Server receives message → Broadcast via same WebSocket
- Single connection for both directions

Benefits:
- Bi-directional (client ↔ server)
- Lower latency (no HTTP overhead per message)
- Simpler: One connection type
- Mobile: Excellent support on all platforms

Cost (10,000 simultaneous users):
- 10,000 connections × 5KB memory = 50MB memory
- Server: $100/mo for 4-core server (handles 10k connections easily)
- Bandwidth: ~10GB/mo = $1/mo (only send actual messages)

Total: $101/mo

Trade-off: Slightly more complex than SSE, but necessary for bi-directional chat`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> WebSocket adds complexity (connection management, reconnection logic)
              but necessary for bi-directional real-time apps. SSE can't handle client → server messaging.
            </KeyPoint>
          </Example>

          <H3>Decision Framework: Choosing Real-Time Transport</H3>
          <CodeBlock>
{`Do you need client → server real-time communication? (not just receiving updates)

├─ YES (bi-directional) → WebSocket
│   └─ Examples: Chat, gaming, collaborative editing, trading
│   └─ Accept: Connection management complexity, fallback handling
│   └─ Cost: $100-500/mo for 10k users
│
└─ NO (server → client only) → Do you need real-time (<1s latency)?
    │
    ├─ YES (real-time updates) → Server-Sent Events (SSE)
    │   └─ Examples: Live scores, stock tickers, notifications, activity feeds
    │   └─ Accept: One-way only, limited mobile support
    │   └─ Cost: $50-200/mo for 10k users
    │
    └─ NO (can tolerate delay) → How frequent are updates?
        │
        ├─ Frequent (>1/min) → Long Polling
        │   └─ Examples: Email inbox, moderate real-time dashboards
        │   └─ Accept: Higher server cost than SSE, but simpler
        │   └─ Cost: $200-400/mo for 10k users
        │
        └─ Infrequent (<1/min) → Short Polling (HTTP)
            └─ Examples: Background sync, weather updates, slow-changing data
            └─ Accept: Delay = half polling interval
            └─ Cost: $100-300/mo for 10k users`}
          </CodeBlock>

          <H3>Common Mistakes</H3>
          <UL>
            <LI>
              <Strong>❌ Using WebSocket for one-way data (e.g., live scores)</Strong>
              <UL>
                <LI>Problem: Over-engineering, WebSocket is bi-directional (unnecessary)</LI>
                <LI>Fix: Use SSE (simpler, same performance for one-way)</LI>
              </UL>
            </LI>
            <LI>
              <Strong>❌ Short polling for real-time chat</Strong>
              <UL>
                <LI>Problem: 600x more server load, 25x slower, feels laggy</LI>
                <LI>Fix: Use WebSocket for bi-directional real-time</LI>
              </UL>
            </LI>
            <LI>
              <Strong>❌ Not implementing WebSocket reconnection logic</Strong>
              <UL>
                <LI>Problem: Network blips = lost connection, user sees "disconnected"</LI>
                <LI>Fix: Exponential backoff reconnect + resume from last message</LI>
              </UL>
            </LI>
          </UL>
        </Section>
      ),
    },
    {
      id: 'message-queues',
      type: 'concept',
      title: 'Message Queues',
      content: (
        <Section>
          <H1>Message Queues</H1>

          <P>
            Message queues decouple producers and consumers, enabling asynchronous processing.
          </P>

          <H2>The Problem: Tight Coupling</H2>

          <Example title="Without Message Queue">
            <CodeBlock>
{`// Order service directly calls email service
function placeOrder(order) {
  saveToDatabase(order);
  sendConfirmationEmail(order); // ← Blocks if email service is slow/down
  updateInventory(order);       // ← Waits for email to finish
  return order;
}

Problems:
- If email service is down, order fails
- Slow email = slow order placement
- Can't scale email processing independently`}
            </CodeBlock>
          </Example>

          <H2>Solution: Message Queue</H2>

          <Example title="With Message Queue">
            <CodeBlock>
{`// Order service publishes to queue
function placeOrder(order) {
  saveToDatabase(order);
  queue.publish('order.placed', order); // ← Non-blocking
  return order; // ← Returns immediately
}

// Email service consumes from queue (asynchronously)
queue.subscribe('order.placed', (order) => {
  sendConfirmationEmail(order);
});

Benefits:
- Order placement is fast (doesn't wait for email)
- Email service can be down temporarily (messages queued)
- Can scale email workers independently`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Message Queue Patterns</H2>

          <H3>1. Point-to-Point (Queue)</H3>
          <P>One message → one consumer</P>
          <CodeBlock>
{`Producer → [Queue] → Consumer 1
                  → Consumer 2 (idle)
                  → Consumer 3 (idle)

Message goes to only ONE consumer (load balancing)`}
          </CodeBlock>

          <P><Strong>Use Case:</Strong> Task processing (e.g., image resizing)</P>

          <H3>2. Publish/Subscribe (Topic)</H3>
          <P>One message → all subscribers</P>
          <CodeBlock>
{`Producer → [Topic] → Consumer 1 (gets copy)
                  → Consumer 2 (gets copy)
                  → Consumer 3 (gets copy)

Message goes to ALL subscribers`}
          </CodeBlock>

          <P><Strong>Use Case:</Strong> Event broadcasting (e.g., order placed → email, inventory, analytics)</P>

          <Divider />

          <H2>Popular Message Queues</H2>

          <ComparisonTable
            headers={['System', 'Type', 'Throughput', 'Use Case']}
            rows={[
              ['RabbitMQ', 'Queue', '10K msg/sec', 'Task queues, RPC'],
              ['Apache Kafka', 'Log', '1M msg/sec', 'Event streaming, logs'],
              ['AWS SQS', 'Queue', '100K msg/sec', 'Serverless tasks'],
              ['Redis Pub/Sub', 'Pub/Sub', '100K msg/sec', 'Real-time events'],
            ]}
          />

          <Divider />

          <H2>Message Queue Guarantees</H2>

          <H3>At-Most-Once</H3>
          <P>Message delivered 0 or 1 times (may be lost)</P>
          <UL>
            <LI>Fastest</LI>
            <LI>No retries</LI>
            <LI>Use for: Metrics, logs</LI>
          </UL>

          <H3>At-Least-Once</H3>
          <P>Message delivered 1+ times (may duplicate)</P>
          <UL>
            <LI>Most common</LI>
            <LI>Retries on failure</LI>
            <LI>Consumer must be idempotent</LI>
            <LI>Use for: Emails, notifications</LI>
          </UL>

          <H3>Exactly-Once</H3>
          <P>Message delivered exactly 1 time</P>
          <UL>
            <LI>Slowest</LI>
            <LI>Complex to implement</LI>
            <LI>Use for: Financial transactions</LI>
          </UL>

          <Divider />

          <H2>🎯 Critical Trade-Off: RabbitMQ vs Kafka vs SQS vs Redis Pub/Sub</H2>

          <ComparisonTable
            headers={['Technology', 'Throughput', 'Latency', 'Durability', 'Complexity', 'Cost/mo', 'Best For', 'Avoid When']}
            rows={[
              [
                'RabbitMQ',
                'Medium\n10k msg/sec',
                'Low\n5-20ms',
                'High\n(persistent)',
                'Medium',
                '$100-500',
                '• Task queues\n• RPC\n• Job processing\n• Reliable delivery',
                '• Event logs\n• Analytics\n• >100k msg/sec\n• Long retention needed'
              ],
              [
                'Kafka',
                'Very High\n1M+ msg/sec',
                'Medium\n10-100ms',
                'Very High\n(replicated log)',
                'High',
                '$300-2000',
                '• Event streaming\n• Log aggregation\n• Analytics\n• Event sourcing',
                '• Simple task queues\n• Low throughput\n• Sub-10ms latency\n• Small team'
              ],
              [
                'AWS SQS',
                'High\n100k msg/sec',
                'Medium\n10-100ms',
                'Very High\n(managed)',
                'Very Low',
                '$0-500\n(pay per use)',
                '• Serverless\n• AWS ecosystem\n• Variable load\n• No ops',
                '• Sub-10ms latency\n• On-prem\n• Need control\n• Cost-sensitive at high volume'
              ],
              [
                'Redis Pub/Sub',
                'Very High\n100k msg/sec',
                'Very Low\n<5ms',
                'None\n(in-memory)',
                'Very Low',
                '$50-300',
                '• Real-time events\n• Cache invalidation\n• Live updates\n• Fast notifications',
                '• Need persistence\n• Guaranteed delivery\n• Long retention\n• Critical messages'
              ],
            ]}
          />

          <Example title="Real Decision: E-commerce Order Processing">
            <P><Strong>Scenario:</Strong> 1,000 orders/day, need to process: email, inventory, analytics, shipping</P>

            <P><Strong>Option 1: Kafka (over-engineering)</Strong></P>
            <CodeBlock>
{`Throughput: 1,000 orders/day = 0.01 orders/sec
Kafka capacity: 1M msg/sec (100,000x more than needed!)

Cost:
- 3 Kafka brokers (minimum for HA): $600/mo
- ZooKeeper cluster: $300/mo
- Total: $900/mo

Complexity:
- Team needs Kafka expertise
- Partition management
- Consumer group configuration
- Monitoring, alerting, ops

Result: ❌ Paying $900/mo for 0.00001% utilization
        Netflix uses Kafka → doesn't mean YOU need Kafka!`}
            </CodeBlock>

            <P><Strong>Option 2: RabbitMQ (Correct Choice)</Strong></P>
            <CodeBlock>
{`Throughput: 1,000 orders/day = 0.01 orders/sec
RabbitMQ capacity: 10k msg/sec (1,000x more than needed, but simpler)

Cost:
- Single RabbitMQ instance (t3.small): $20/mo
- CloudAMQP managed: $100/mo (recommended)

Complexity:
- Simple queue setup
- Built-in retry, DLQ (dead letter queue)
- Easy to understand
- Less ops overhead

Flow:
1. Order placed → Publish to "orders" exchange
2. Email worker → Subscribe to "orders.email"
3. Inventory worker → Subscribe to "orders.inventory"
4. Each worker processes independently

Result: ✅ $100/mo, simple, reliable, plenty of headroom

Trade-off: Lower throughput than Kafka, but 10k/sec >> 0.01/sec needed`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> Kafka is 9x more expensive + 10x more complex for this use case.
              RabbitMQ is simpler and cheaper. Choose based on actual throughput, not cargo-cult engineering.
            </KeyPoint>
          </Example>

          <Example title="Real Decision: Analytics Event Stream (100k events/sec)">
            <P><Strong>Scenario:</Strong> Track user clicks, page views, purchases. 100k events/sec, need replay for ML</P>

            <P><Strong>Option 1: RabbitMQ (wrong choice)</Strong></P>
            <CodeBlock>
{`Throughput: 100k events/sec
RabbitMQ capacity: 10k msg/sec max (can't handle 100k!)

Even with clustering:
- 10 RabbitMQ nodes = $1,000/mo
- Still struggles at 100k/sec (not designed for this)
- No replay: Messages deleted after consumption
- No long retention: Not built for event logs

Result: ❌ Can't handle throughput + no replay capability`}
            </CodeBlock>

            <P><Strong>Option 2: Kafka (Correct Choice)</Strong></P>
            <CodeBlock>
{`Throughput: 100k events/sec
Kafka capacity: 1M+ msg/sec (plenty of headroom)

Cost:
- 3 Kafka brokers (m5.large): $600/mo
- Storage (7 days retention, compressed): $100/mo
- Total: $700/mo

Benefits:
- Handles 100k/sec easily (10x headroom)
- Replay: Consumers can re-read from any offset
- Retention: Keep events for 7 days (or months)
- Multiple consumers: Analytics, ML, BI all read same stream
- Partitioning: Scale to millions of events/sec

Use case:
1. App publishes click events → Kafka topic
2. Real-time analytics → Reads from latest offset
3. ML pipeline → Reads from beginning (replay last 7 days)
4. BI dashboard → Reads from 1 hour ago

Result: ✅ Handles throughput + replay + multiple consumers

Trade-off: Higher complexity + cost, but necessary for 100k/sec + replay`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> Kafka costs 7x more than RabbitMQ but handles 100x throughput + replay.
              For analytics/event streaming, Kafka's log model is essential. For task queues, overkill.
            </KeyPoint>
          </Example>

          <Example title="Real Decision: Cache Invalidation (Serverless)">
            <P><Strong>Scenario:</Strong> Invalidate caches when data changes, serverless architecture (AWS Lambda)</P>

            <P><Strong>Option 1: Kafka (over-engineering)</Strong></P>
            <CodeBlock>
{`Cost:
- 3 Kafka brokers: $600/mo (must run 24/7)
- Lambda can't connect directly to Kafka (needs MSK Connector)
- AWS MSK (managed Kafka): $900/mo minimum

Complexity:
- Kafka cluster management (even with MSK)
- Lambda → MSK integration setup
- VPC networking

Result: ❌ $900/mo + complex setup for simple cache invalidation`}
            </CodeBlock>

            <P><Strong>Option 2: AWS SQS (Correct Choice)</Strong></P>
            <CodeBlock>
{`Cost:
- SQS: $0.40 per 1M requests
- 10k cache invalidations/day = 300k/month = $0.12/mo
- Lambda executions: $0.20/mo
- Total: $0.32/mo

Complexity:
- Zero infrastructure (serverless)
- Lambda native integration
- No VPC needed
- Built-in retry, DLQ

Flow:
1. Data updated → SQS.send({cache_key: 'user:123'})
2. Lambda triggered automatically
3. Lambda invalidates cache

Result: ✅ $0.32/mo vs $900/mo (2,800x cheaper!)

Trade-off: 10-100ms latency (vs Kafka's 5-10ms), but acceptable for cache invalidation`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> SQS is 2,800x cheaper for serverless + variable load.
              Kafka requires always-on brokers ($900/mo minimum). Choose based on deployment model.
            </KeyPoint>
          </Example>

          <H2>🎯 Critical Trade-Off: At-Most-Once vs At-Least-Once vs Exactly-Once</H2>

          <ComparisonTable
            headers={['Guarantee', 'Performance', 'Complexity', 'Data Loss Risk', 'Duplicate Risk', 'Cost', 'Use When']}
            rows={[
              [
                'At-Most-Once\n(fire-and-forget)',
                'Fastest\n<1ms',
                'Very Low',
                'High\n(can lose messages)',
                'None\n(no duplicates)',
                'Lowest',
                '• Metrics\n• Logs\n• Analytics\n• Non-critical data'
              ],
              [
                'At-Least-Once\n(retry until ack)',
                'Fast\n1-10ms',
                'Low',
                'None\n(retries)',
                'Medium\n(can duplicate)',
                'Medium',
                '• Emails\n• Notifications\n• Most use cases\n• Idempotent operations'
              ],
              [
                'Exactly-Once\n(deduplication)',
                'Slow\n10-100ms',
                'Very High',
                'None\n(guaranteed)',
                'None\n(guaranteed)',
                'Highest',
                '• Payments\n• Banking\n• Inventory\n• Financial ledgers'
              ],
            ]}
          />

          <Example title="Real Decision: Payment Processing">
            <P><Strong>Scenario:</Strong> Process credit card charges, must never double-charge or lose payment</P>

            <P><Strong>Option 1: At-Least-Once (dangerous!)</Strong></P>
            <CodeBlock>
{`Flow:
1. Payment service → Queue: {charge: $100, card: 1234}
2. Worker processes payment → Charges $100
3. Worker crashes BEFORE acknowledging message
4. Queue redelivers message (not acknowledged)
5. Worker charges ANOTHER $100 ❌ Double-charged!

Impact:
- Customer charged $200 instead of $100
- Angry customer, refund required, reputation damage
- Illegal in many jurisdictions (PCI compliance)

Result: ❌ At-least-once is WRONG for payments (can duplicate)`}
            </CodeBlock>

            <P><Strong>Option 2: Exactly-Once (Correct Choice)</Strong></P>
            <CodeBlock>
{`Flow:
1. Payment service → Queue: {charge: $100, card: 1234, idempotency_key: 'abc123'}
2. Worker processes payment:
   - Check: "Have I processed 'abc123' before?" → No
   - Charge $100
   - Store: processed_keys.add('abc123')
   - Acknowledge message
3. Worker crashes, queue redelivers
4. Worker checks: "Have I processed 'abc123' before?" → YES
5. Skip charging (already done) ✅ No duplicate!

Implementation:
- Idempotency keys (unique per payment)
- Distributed transaction (2-phase commit)
- Database unique constraint on idempotency_key

Cost:
- 10x slower: 50ms vs 5ms (need to check deduplication table)
- More complex: Idempotency logic, distributed transaction
- Worth it: Prevents double-charging

Result: ✅ Exactly-once prevents double-charging (required for payments)

Trade-off: 10x slower + complex, but necessary for financial correctness`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> Exactly-once costs 10x latency + high complexity but prevents double-charging.
              For payments, correctness beats performance. Wrong data = lawsuits.
            </KeyPoint>
          </Example>

          <Example title="Real Decision: Email Notifications">
            <P><Strong>Scenario:</Strong> Send order confirmation emails to customers</P>

            <P><Strong>Option 1: At-Most-Once (too risky)</Strong></P>
            <CodeBlock>
{`Flow:
1. Order service → Queue: {email_to: 'user@example.com', order_id: 123}
2. Worker sends email
3. NO acknowledgment, NO retries

Risk:
- Worker crashes → Email never sent
- Network blip → Message lost
- Customer never gets confirmation → "Did my order go through?"

Result: ❌ Losing 1% of emails = 1000 confused customers/day (unacceptable)`}
            </CodeBlock>

            <P><Strong>Option 2: At-Least-Once (Correct Choice)</Strong></P>
            <CodeBlock>
{`Flow:
1. Order service → Queue: {email_to: 'user@example.com', order_id: 123}
2. Worker sends email
3. Worker acknowledges message
4. If worker crashes before ack → Queue redelivers
5. Worker sends email AGAIN (duplicate)

Duplicate handling:
- Customer gets 2 confirmation emails (annoying but harmless)
- Frequency: 0.1% of emails (1 per 1000)
- Impact: Minor annoyance vs missing email

Better: Idempotent emails
- Track sent_emails table: (order_id, email_sent_at)
- Check before sending: "Already sent email for order 123?" → Skip
- Now: At-least-once delivery + no duplicates!

Cost:
- At-least-once: Free (built-in to most queues)
- Idempotency: 1 DB check per email (5ms)

Result: ✅ Guaranteed delivery + rare duplicates (acceptable trade-off)

Trade-off: Accept rare duplicates OR add idempotency (5ms overhead)`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> At-least-once is perfect balance for emails/notifications.
              Guaranteed delivery (no lost emails) + rare duplicates (acceptable). Add idempotency if needed.
            </KeyPoint>
          </Example>

          <H3>Decision Framework: Choosing Message Queue</H3>
          <CodeBlock>
{`What's your message throughput?

├─ >100k msg/sec → Kafka
│   └─ Also: Need replay? Event sourcing? Analytics?
│   └─ Accept: High complexity, $700-2000/mo
│   └─ Examples: Event streaming, log aggregation, analytics
│
├─ 100-100k msg/sec → What's your deployment?
│   │
│   ├─ Serverless (AWS Lambda, etc.) → SQS
│   │   └─ Accept: 10-100ms latency, vendor lock-in
│   │   └─ Cost: $0-500/mo (pay per use)
│   │
│   └─ Traditional servers → RabbitMQ
│       └─ Accept: More ops than SQS, less than Kafka
│       └─ Cost: $100-500/mo
│
└─ <100 msg/sec → What's latency requirement?
    │
    ├─ <5ms (real-time) → Redis Pub/Sub
    │   └─ Accept: No persistence, can lose messages
    │   └─ Use: Cache invalidation, live updates
    │   └─ Cost: $50-300/mo
    │
    └─ >5ms OK → RabbitMQ or SQS
        └─ Simplest, most flexible for low throughput`}
          </CodeBlock>

          <H3>Decision Framework: Choosing Delivery Guarantee</H3>
          <CodeBlock>
{`What happens if a message is processed twice?

├─ Financial loss (double-charge, double-payment)
│   └─ Exactly-Once
│   └─ Examples: Payments, banking, inventory decrement
│   └─ Accept: 10x slower, high complexity (idempotency keys, 2PC)
│
├─ User annoyance (duplicate email, duplicate notification)
│   └─ At-Least-Once (maybe add idempotency)
│   └─ Examples: Emails, notifications, updates
│   └─ Accept: Rare duplicates OR add idempotency check
│
└─ No problem (metrics, logs, idempotent operations)
    └─ At-Least-Once (simplest)
    └─ Examples: Logging, metrics, analytics, cache invalidation
    └─ Benefit: Simple, fast, built-in to most queues

What happens if a message is lost?

├─ Data loss unacceptable → At-Least-Once or Exactly-Once
└─ Data loss acceptable → At-Most-Once
    └─ Examples: Real-time metrics, non-critical logs`}
          </CodeBlock>
        </Section>
      ),
    },
    {
      id: 'event-sourcing',
      type: 'concept',
      title: 'Event Sourcing',
      content: (
        <Section>
          <H1>Event Sourcing</H1>

          <P>
            Store all changes as a sequence of events, rather than just the current state.
          </P>

          <H2>Traditional State Storage</H2>

          <Example title="Database stores current state">
            <CodeBlock>
{`// User table
| user_id | balance |
|---------|---------|
| 123     | $500    |

// We only know current balance, not how we got here
// Lost history: deposits, withdrawals, transfers`}
            </CodeBlock>
          </Example>

          <H2>Event Sourcing Approach</H2>

          <Example title="Store all events">
            <CodeBlock>
{`// Events table
| event_id | user_id | type        | amount | timestamp |
|----------|---------|-------------|--------|-----------|
| 1        | 123     | DEPOSIT     | $1000  | 10:00 AM  |
| 2        | 123     | WITHDRAWAL  | $200   | 11:00 AM  |
| 3        | 123     | WITHDRAWAL  | $300   | 12:00 PM  |

// Current balance = sum of events = $500
// But we have full history!`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Benefits of Event Sourcing</H2>

          <H3>1. Complete Audit Trail</H3>
          <UL>
            <LI>Know exactly what happened and when</LI>
            <LI>Required for compliance (finance, healthcare)</LI>
            <LI>Debug issues by replaying events</LI>
          </UL>

          <H3>2. Time Travel</H3>
          <UL>
            <LI>Reconstruct state at any point in time</LI>
            <LI>"What was the balance at 11:30 AM?"</LI>
            <LI>Replay events up to that timestamp</LI>
          </UL>

          <H3>3. Event Replay</H3>
          <UL>
            <LI>Rebuild state from scratch</LI>
            <LI>Fix bugs by replaying with corrected logic</LI>
            <LI>Create new projections from existing events</LI>
          </UL>

          <H3>4. Multiple Views</H3>
          <UL>
            <LI>Same events → different projections</LI>
            <LI>Example: Balance view, transaction history view, analytics view</LI>
          </UL>

          <Divider />

          <H2>Event Sourcing Pattern</H2>

          <CodeBlock>
{`// 1. Command: User action
command = {
  type: 'WITHDRAW',
  userId: 123,
  amount: 100
}

// 2. Validate command
if (currentBalance >= 100) {
  // 3. Generate event
  event = {
    type: 'WITHDRAWAL',
    userId: 123,
    amount: 100,
    timestamp: now()
  }
  
  // 4. Append event to log (immutable)
  eventStore.append(event);
  
  // 5. Update projection (current state)
  balance -= 100;
}

// 6. Rebuild state from events
function getBalance(userId) {
  events = eventStore.getEvents(userId);
  balance = 0;
  for (event of events) {
    if (event.type === 'DEPOSIT') balance += event.amount;
    if (event.type === 'WITHDRAWAL') balance -= event.amount;
  }
  return balance;
}`}
          </CodeBlock>

          <Divider />

          <H2>Challenges</H2>

          <H3>1. Query Performance</H3>
          <P><Strong>Problem:</Strong> Replaying millions of events is slow</P>
          <P><Strong>Solution:</Strong> Snapshots (save state every N events)</P>

          <CodeBlock>
{`// Snapshot every 1000 events
Snapshot at event 1000: balance = $5000
Events 1001-1500: +$200

Current balance = $5000 + $200 = $5200
(Only replay 500 events instead of 1500)`}
          </CodeBlock>

          <H3>2. Event Schema Evolution</H3>
          <P><Strong>Problem:</Strong> Old events have old schema</P>
          <P><Strong>Solution:</Strong> Upcasting (convert old events to new schema on read)</P>

          <H3>3. Eventual Consistency</H3>
          <P><Strong>Problem:</Strong> Projections may lag behind events</P>
          <P><Strong>Solution:</Strong> Accept eventual consistency or use CQRS</P>

          <KeyPoint>
            Event Sourcing is powerful for audit trails and time travel, but adds complexity.
            Use it when you need <Strong>complete history</Strong> and <Strong>event replay</Strong>!
          </KeyPoint>

          <Divider />

          <H2>🎯 Critical Trade-Off: Event Sourcing vs Traditional State Storage</H2>

          <ComparisonTable
            headers={['Approach', 'Storage Cost', 'Query Speed', 'Complexity', 'Audit Trail', 'Time Travel', 'Best For', 'Avoid When']}
            rows={[
              [
                'Traditional\n(current state)',
                'Low\n(1 row/entity)',
                'Fast\n<10ms',
                'Very Low',
                'None\n(lost history)',
                'No',
                '• Simple CRUD\n• No audit needed\n• Fast queries\n• Small teams',
                '• Compliance\n• Debugging needs\n• Financial systems\n• Need history'
              ],
              [
                'Event Sourcing\n(event log)',
                'High\n(grows forever)',
                'Slow\n(replay events)',
                'Very High',
                'Complete\n(every change)',
                'Yes\n(replay to any point)',
                '• Banking\n• Compliance\n• Audit trails\n• Debugging\n• Event-driven',
                '• Simple apps\n• Fast queries critical\n• Small team\n• No audit needs'
              ],
              [
                'Hybrid\n(events + snapshots)',
                'Medium\n(events + cache)',
                'Medium\n(from snapshot)',
                'High',
                'Complete\n(events)',
                'Yes\n(with snapshots)',
                '• Need audit + performance\n• Large teams\n• Complex domains',
                '• Simple use cases\n• Don\'t need history\n• Cost-sensitive'
              ],
            ]}
          />

          <Example title="Real Decision: Banking Application">
            <P><Strong>Scenario:</Strong> Store user account balances, 1 million users, regulatory compliance required</P>

            <P><Strong>Option 1: Traditional State Storage</Strong></P>
            <CodeBlock>
{`Database:
| user_id | balance |
|---------|---------|
| 123     | $5,000  |

Storage: 1M users × 100 bytes = 100MB
Query speed: 5ms (simple SELECT)
Cost: $50/mo

Problem: Compliance audit
- Auditor: "Why did user 123's balance decrease $100 on Jan 5?"
- You: "...I don't know. I only have current balance."
- Auditor: "That's a compliance violation."
- Fine: $100,000

Problem: Bug discovered
- Bug in code: Double-charged 10,000 users on Jan 15
- You: "I can't tell WHO was affected (no history)"
- Must refund everyone (including non-affected) → Expensive!

Result: ❌ No audit trail = compliance violations + can't debug`}
            </CodeBlock>

            <P><Strong>Option 2: Event Sourcing (Correct Choice)</Strong></P>
            <CodeBlock>
{`Event Store:
| event_id | user_id | type       | amount | timestamp      |
|----------|---------|------------|--------|----------------|
| 1        | 123     | DEPOSIT    | +1000  | Jan 1 10:00 AM |
| 2        | 123     | WITHDRAWAL | -200   | Jan 5 02:00 PM |
| 3        | 123     | DEPOSIT    | +4200  | Jan 10 09:00 AM|

Current balance = sum of events = $5,000

Storage: 1M users × 10 events/month × 200 bytes = 2GB/month
Query speed: 50ms (replay events) OR 5ms (from snapshot)
Cost: $100/mo (2GB/mo × 12 months = 24GB/year)

Compliance audit:
- Auditor: "Why did balance decrease $200 on Jan 5?"
- You: "Event #2: WITHDRAWAL at Jan 5 02:00 PM"
- Auditor: "Perfect audit trail. ✅"

Bug discovered:
- Bug: Double-charged users on Jan 15
- Query: SELECT * FROM events WHERE date='Jan 15' AND type='CHARGE'
- Find exactly 10,000 affected users → Targeted refunds
- Replay events with bug fix → Correct balances

Time travel:
- Auditor: "What was balance on Jan 8?"
- Replay events up to Jan 8: DEPOSIT +1000, WITHDRAWAL -200 = $800
- Answer in seconds!

Result: ✅ Complete audit trail + debugging + time travel

Trade-off: 2x storage cost + 10x query complexity, but REQUIRED for banking`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> Event sourcing costs 2x storage + 10x complexity but provides complete
              audit trail required for compliance. For banking, not optional.
            </KeyPoint>
          </Example>

          <Example title="Real Decision: E-commerce Product Catalog">
            <P><Strong>Scenario:</Strong> Store product names/prices, 100k products, no compliance requirements</P>

            <P><Strong>Option 1: Event Sourcing (over-engineering)</Strong></P>
            <CodeBlock>
{`Event Store:
- 100k products × 100 updates/year = 10M events/year
- Storage: 10M × 200 bytes = 2GB/year
- Query: "Get product name" → Replay 100 events (slow!)
- Cost: $200/mo (event store + snapshot store)

Complexity:
- Event replay logic
- Snapshot management
- Schema evolution
- Team training

Business value:
- "What was the price on Jan 5?" → NEVER ASKED
- Audit trail → NOT NEEDED
- Debugging → Use logs instead

Result: ❌ Paying $200/mo + high complexity for zero business value`}
            </CodeBlock>

            <P><Strong>Option 2: Traditional State Storage (Correct Choice)</Strong></P>
            <CodeBlock>
{`Database:
| product_id | name      | price  |
|------------|-----------|--------|
| 123        | iPhone 15 | $999   |

Storage: 100k products × 500 bytes = 50MB
Query: 5ms (simple SELECT)
Cost: $20/mo

History tracking (if needed):
- Add: updated_at timestamp
- Or: Separate price_history table (only for price changes)
- 95% simpler than full event sourcing

Result: ✅ $20/mo, fast queries, simple

Trade-off: No audit trail, but not needed for product catalog`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> Event sourcing costs 10x more + 10x complexity for product catalog.
              Traditional state is simpler and cheaper. Only use event sourcing when you NEED audit trail.
            </KeyPoint>
          </Example>

          <Example title="Real Decision: Collaborative Document Editing (Google Docs)">
            <P><Strong>Scenario:</Strong> Real-time collaborative editing, need undo/redo, conflict resolution</P>

            <P><Strong>Option 1: Traditional State Storage</Strong></P>
            <CodeBlock>
{`Database:
| doc_id | content                        |
|--------|--------------------------------|
| 123    | "Hello World"                  |

Problem: Concurrent edits
- User A: Changes "Hello" → "Hi" (saves)
- User B: Changes "World" → "Everyone" (saves at same time)
- Result: Last write wins (one change lost!)

Problem: Undo/Redo
- User wants to undo 3 steps back
- You: "I only have current state, can't undo"

Problem: Conflict resolution
- Can't detect conflicts (no history of changes)
- Can't merge changes intelligently

Result: ❌ Lost edits + no undo + no conflict resolution`}
            </CodeBlock>

            <P><Strong>Option 2: Event Sourcing (Correct Choice)</Strong></P>
            <CodeBlock>
{`Event Store (Operational Transformation):
| event_id | user | operation          | position | timestamp      |
|----------|------|--------------------|----------|----------------|
| 1        | A    | INSERT "Hello"     | 0        | 10:00:00.100   |
| 2        | A    | INSERT " "         | 5        | 10:00:00.200   |
| 3        | B    | INSERT "World"     | 6        | 10:00:00.150   |
| 4        | A    | DELETE "Hello"     | 0-5      | 10:00:01.000   |
| 5        | A    | INSERT "Hi"        | 0        | 10:00:01.100   |

Current state = replay all events = "Hi World"

Concurrent edits:
- Both edits preserved (events 4 and 5 applied in order)
- Operational Transformation resolves conflicts
- No lost changes!

Undo/Redo:
- Undo = reverse last event (event 5)
- Redo = replay event 5
- Can undo/redo arbitrary steps

Conflict resolution:
- Events have timestamps + positions
- Transform operations based on concurrent changes
- Deterministic merging

Google Docs approach:
- Event sourcing + CRDT (Conflict-free Replicated Data Types)
- Every keystroke is an event
- Millions of events per document
- Snapshots every 100 events

Cost:
- Storage: 1M documents × 10k events each = 10B events
- Compressed: 1TB storage = $500/mo
- Worth it: Enables collaboration!

Result: ✅ Perfect for collaborative editing

Trade-off: High storage + complexity, but enables core feature (collaboration)`}
            </CodeBlock>

            <KeyPoint>
              <Strong>Trade-off:</Strong> Event sourcing is REQUIRED for collaborative editing (undo/redo, conflict resolution).
              Traditional state can't handle concurrent edits. Choose based on core product needs.
            </KeyPoint>
          </Example>

          <H3>Decision Framework: Choosing Event Sourcing</H3>
          <CodeBlock>
{`Is audit trail legally required? (banking, healthcare, compliance)

├─ YES → Event Sourcing (not optional)
│   └─ Examples: Banking, healthcare, legal, financial trading
│   └─ Accept: 2-10x storage cost, high complexity
│   └─ Benefit: Compliance, avoid fines
│
└─ NO → Do you need time travel or event replay?
    │
    ├─ YES (debugging, analytics, undo/redo) → Event Sourcing
    │   └─ Examples: Collaborative editing, analytics, ML pipelines
    │   └─ Accept: High complexity, snapshot management
    │   └─ Benefit: Replay for debugging, build new projections
    │
    └─ NO → Do you need complete history?
        │
        ├─ YES (nice to have) → Traditional + Audit Log
        │   └─ Hybrid: Current state in DB + separate audit_log table
        │   └─ Benefit: 90% simpler than event sourcing
        │   └─ Cost: 10x cheaper
        │
        └─ NO (just current state) → Traditional State Storage
            └─ Examples: Product catalog, user profiles, settings
            └─ Benefit: Simplest, fastest, cheapest
            └─ Cost: $20-100/mo vs $200-500/mo for event sourcing

Warning: Only use event sourcing if you truly need it!
- 10x complexity (event replay, snapshots, schema evolution)
- 2-10x storage cost (events grow forever)
- Team training required
- But: Worth it when audit trail/time travel is core requirement`}
          </CodeBlock>

          <H3>Common Mistakes</H3>
          <UL>
            <LI>
              <Strong>❌ Using event sourcing for simple CRUD apps</Strong>
              <UL>
                <LI>Problem: 10x complexity for zero business value (no audit needs)</LI>
                <LI>Fix: Traditional state storage + updated_at timestamp</LI>
              </UL>
            </LI>
            <LI>
              <Strong>❌ Not using snapshots for event sourcing</Strong>
              <UL>
                <LI>Problem: Replaying 1M events to get current balance = 10 seconds!</LI>
                <LI>Fix: Snapshot every 1000 events (replay 0-999 events, not 1M)</LI>
              </UL>
            </LI>
            <LI>
              <Strong>❌ Using traditional state for compliance apps</Strong>
              <UL>
                <LI>Problem: No audit trail = compliance violations, fines</LI>
                <LI>Fix: Event sourcing is required (not optional) for banking/healthcare</LI>
              </UL>
            </LI>
            <LI>
              <Strong>❌ Not planning for event schema evolution</Strong>
              <UL>
                <LI>Problem: Old events have old schema → Breaks replay after code changes</LI>
                <LI>Fix: Upcasting (convert old events to new schema on read) OR versioned events</LI>
              </UL>
            </LI>
          </UL>

          <KeyPoint>
            <Strong>Golden Rule:</Strong> Event sourcing is a powerful tool, but use it ONLY when you need:
            audit trails, time travel, or event replay. For 80% of apps, traditional state is simpler and cheaper.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

