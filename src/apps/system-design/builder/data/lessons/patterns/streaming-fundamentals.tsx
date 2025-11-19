import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider 
} from '../../../ui/components/LessonContent';

export const streamingFundamentalsLesson: SystemDesignLesson = {
  id: 'streaming-fundamentals',
  slug: 'streaming-fundamentals',
  title: 'Real-time Streaming Fundamentals',
  description: 'Learn the core concepts of real-time data streaming and messaging',
  category: 'patterns',
  difficulty: 'intermediate',
  estimatedMinutes: 25,
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
        </Section>
      ),
    },
  ],
};

