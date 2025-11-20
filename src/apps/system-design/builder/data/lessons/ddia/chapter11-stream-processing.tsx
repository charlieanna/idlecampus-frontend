import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter11StreamProcessingLesson: SystemDesignLesson = {
  id: 'ddia-ch11-stream-processing',
  slug: 'ddia-ch11-stream-processing',
  title: 'Stream Processing (DDIA Ch. 11)',
  description: 'Learn message brokers, event streams, windowing, and real-time processing patterns. Includes critical trade-offs: Kafka vs RabbitMQ vs Kinesis, delivery semantics, and windowing strategies with real-world examples and ROI analysis.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 95,
  stages: [
    {
      id: 'intro-streaming',
      type: 'concept',
      title: 'Stream Processing Overview',
      content: (
        <Section>
          <H1>Stream Processing Overview</H1>
          <P>
            <Strong>Stream processing</Strong> processes data continuously as it arrives (real-time),
            rather than in batches. Optimized for low latency.
          </P>
          <UL>
            <LI><Strong>Message Brokers:</Strong> Kafka, RabbitMQ - deliver messages</LI>
            <LI><Strong>Event Streams:</Strong> Unbounded sequences of events</LI>
            <LI><Strong>Windowing:</Strong> Group events by time or count</LI>
            <LI><Strong>Use Cases:</Strong> Real-time analytics, notifications, fraud detection, monitoring</LI>
          </UL>
        </Section>
      ),
    },
    {
      id: 'message-brokers',
      type: 'concept',
      title: 'Message Brokers - Pub/Sub & Queues',
      content: (
        <Section>
          <H1>Message Brokers - Pub/Sub & Queues</H1>
          <P>
            <Strong>Message brokers</Strong> decouple producers and consumers. Two main patterns:
          </P>

          <H2>Message Queues (Point-to-Point)</H2>
          <UL>
            <LI>Each message consumed by one consumer</LI>
            <LI>Load balancing across consumers</LI>
            <LI>Example: Task queues, job processing</LI>
          </UL>

          <H2>Pub/Sub (Publish-Subscribe)</H2>
          <UL>
            <LI>Each message delivered to all subscribers</LI>
            <LI>Fan-out pattern</LI>
            <LI>Example: Event notifications, real-time feeds</LI>
          </UL>

          <H2>Kafka - Partitioned Logs</H2>
          <UL>
            <LI><Strong>Topics:</Strong> Categories of messages</LI>
            <LI><Strong>Partitions:</Strong> Topics split into partitions (parallelism)</LI>
            <LI><Strong>Consumer Groups:</Strong> Multiple consumers share load</LI>
            <LI><Strong>Offsets:</Strong> Track position in log</LI>
          </UL>

          <Example title="Kafka Consumer Groups">
            <CodeBlock>
{`// Topic: "user-events" with 3 partitions
Partition 0: [event1, event4, event7]
Partition 1: [event2, event5, event8]
Partition 2: [event3, event6, event9]

// Consumer Group: "analytics" with 3 consumers
Consumer1 -> Partition 0
Consumer2 -> Partition 1
Consumer3 -> Partition 2

// Each consumer processes its partition
// If consumer fails, partition reassigned to another consumer`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Kafka Benefits:</Strong> High throughput, durability (log), replayability, horizontal scaling.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'message-broker-tradeoff',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Kafka vs RabbitMQ vs Kinesis',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Message Broker Selection</H1>
          <P>
            Choosing between <Strong>Kafka</Strong>, <Strong>RabbitMQ</Strong>, and <Strong>AWS Kinesis</Strong>
            impacts your throughput, latency, operational complexity, and cost.
          </P>

          <H2>📊 Message Broker Comparison</H2>
          <ComparisonTable
            headers={['Dimension', 'Kafka (Self-Hosted)', 'RabbitMQ', 'AWS Kinesis']}
            rows={[
              ['Throughput', '1M+ msg/sec (high)', '100k msg/sec (medium)', '200k msg/sec (medium-high)'],
              ['Latency (p99)', '10-50ms', '5-20ms (faster)', '50-200ms (slower)'],
              ['Message Retention', 'Days-weeks (configurable)', 'Minimal (until ack)', '24h-365 days'],
              ['Message Ordering', 'Per-partition (strong)', 'Per-queue (strong)', 'Per-shard (strong)'],
              ['Consumer Model', 'Pull (consumers fetch)', 'Push (broker delivers)', 'Pull (consumers fetch)'],
              ['Replayability', 'Full replay from any offset', 'No replay (ack deletes)', 'Replay within retention'],
              ['Operational Complexity', 'High (self-managed cluster)', 'Medium (simple setup)', 'Low (fully managed)'],
              ['Scaling', 'Add partitions (manual)', 'Add nodes (manual)', 'Auto-scaling (managed)'],
              ['Cost (1M msg/day)', '$500/month (3-node cluster)', '$200/month (2-node cluster)', '$800/month (managed)'],
              ['Cost (100M msg/day)', '$2k/month (10-node cluster)', '$5k/month (20+ nodes)', '$8k/month (managed)'],
            ]}
          />

          <H2>💡 Real-World Example: E-Commerce Event Streaming</H2>
          <InfoBox>
            <P>
              <Strong>Scenario:</Strong> E-commerce platform processes 10M events/day (order placed, payment processed, shipment tracking),
              needs real-time analytics and fraud detection. Events must be replayable for 7 days.
            </P>

            <H3>Option 1: Self-Hosted Kafka</H3>
            <UL>
              <LI><Strong>Cluster:</Strong> 3-node Kafka cluster (3× 8-core, 32GB RAM) = $600/month</LI>
              <LI><Strong>Throughput:</Strong> 200k msg/sec (10M/day = 115 msg/sec avg, 2k peak)</LI>
              <LI><Strong>Latency:</Strong> p50: 5ms, p99: 30ms (excellent)</LI>
              <LI><Strong>Retention:</Strong> 7 days, 1TB storage = $100/month</LI>
              <LI><Strong>Replayability:</Strong> Full replay support (consumers set offset)</LI>
              <LI><Strong>Operational Cost:</Strong> 1 SRE @ 50% time = $50k/year</LI>
              <LI><Strong>Setup Time:</Strong> 2-3 weeks (cluster setup, monitoring, backups)</LI>
              <LI><Strong>Scaling:</Strong> Add partitions manually (rebalance consumers)</LI>
              <LI><Strong>Annual Cost:</Strong> $600×12 + $100×12 + $50k ops = $58.4k/year</LI>
            </UL>

            <H3>Option 2: Self-Hosted RabbitMQ</H3>
            <UL>
              <LI><Strong>Cluster:</Strong> 2-node RabbitMQ cluster (2× 4-core, 16GB RAM) = $300/month</LI>
              <LI><Strong>Throughput:</Strong> 50k msg/sec (sufficient for 2k peak)</LI>
              <LI><Strong>Latency:</Strong> p50: 3ms, p99: 15ms (best latency)</LI>
              <LI><Strong>Retention:</Strong> No built-in retention (messages deleted after ack)</LI>
              <LI><Strong>Replayability:</Strong> None - need separate data store for replay</LI>
              <LI><Strong>Workaround:</Strong> Add PostgreSQL for event sourcing = $200/month + complexity</LI>
              <LI><Strong>Operational Cost:</Strong> 1 SRE @ 30% time = $30k/year</LI>
              <LI><Strong>Setup Time:</Strong> 1 week (simpler than Kafka)</LI>
              <LI><Strong>Scaling:</Strong> Add nodes, manually configure queues</LI>
              <LI><Strong>Annual Cost:</Strong> $300×12 + $200×12 + $30k ops = $36k/year</LI>
              <LI><Strong>Limitation:</Strong> No native replay, need workaround for reprocessing</LI>
            </UL>

            <H3>Option 3: AWS Kinesis (Managed)</H3>
            <UL>
              <LI><Strong>Configuration:</Strong> 5 shards @ $15/shard/month = $75/month (base)</LI>
              <LI><Strong>Throughput:</Strong> 5 shards × 1MB/sec = 5MB/sec (40k msg/sec if 128 bytes/msg)</LI>
              <LI><Strong>PUT Requests:</Strong> 10M events/day = 115/sec avg × $0.014/1M = $1.40/month</LI>
              <LI><Strong>Data Ingestion:</Strong> 1.28GB/day × 30 = 38GB/month × $0.014/GB = $0.53/month</LI>
              <LI><Strong>Retention:</Strong> 7-day retention included (up to 365 days available)</LI>
              <LI><Strong>Latency:</Strong> p50: 50ms, p99: 200ms (higher due to AWS API)</LI>
              <LI><Strong>Replayability:</Strong> Full replay within retention period</LI>
              <LI><Strong>Operational Cost:</Strong> Near zero (AWS manages infrastructure)</LI>
              <LI><Strong>Setup Time:</Strong> 1-2 days (API calls, minimal configuration)</LI>
              <LI><Strong>Scaling:</Strong> Automatic (add shards via API, zero downtime)</LI>
              <LI><Strong>Annual Cost:</Strong> ($75 + $1.40 + $0.53)×12 + monitoring = $924/year</LI>
            </UL>

            <H3>📈 ROI Analysis (10M events/day)</H3>
            <ComparisonTable
              headers={['Message Broker', 'Annual Cost', 'Latency (p99)', 'Ops Burden', 'Replay Support']}
              rows={[
                ['Kinesis (Managed)', '$924 ✓', '200ms', 'None ✓', 'Yes'],
                ['RabbitMQ', '$36k', '15ms ✓', 'Medium', 'No (needs workaround)'],
                ['Kafka', '$58.4k', '30ms', 'High', 'Yes ✓'],
              ]}
            />

            <P><Strong>Result:</Strong> Kinesis saves $35k vs RabbitMQ, $57k vs Kafka for 10M events/day.</P>

            <H3>Scaling Analysis (100M events/day, 10× increase)</H3>
            <UL>
              <LI><Strong>Kinesis:</Strong> 50 shards = $750/month + $14 PUT + $5 ingestion = $9.2k/year (10× cost)</LI>
              <LI><Strong>RabbitMQ:</Strong> 10 nodes = $1.5k/month + ops = $48k/year (33% increase) - struggles with throughput</LI>
              <LI><Strong>Kafka:</Strong> 5 nodes = $1k/month + ops = $62k/year (6% increase) ✓ - linear scaling</LI>
            </UL>

            <P><Strong>Crossover Point:</Strong> At 100M+ events/day, Kafka becomes most cost-effective due to superior throughput.</P>
          </InfoBox>

          <H2>🔧 Decision Framework with Code Examples</H2>
          <CodeBlock>
{`// ===== Kafka Producer/Consumer (High Throughput) =====
// Use when: >1M events/day, need replay, high throughput critical

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka1:9092', 'kafka2:9092', 'kafka3:9092']
});

// Producer: High throughput with batching
const producer = kafka.producer({
  compression: 'snappy',  // Compress messages
  batch: {
    size: 16384,          // Batch up to 16KB
    lingerMs: 10          // Wait 10ms for more messages
  }
});

await producer.connect();

// Send message (returns immediately if batching enabled)
await producer.send({
  topic: 'orders',
  messages: [{
    key: order.customerId,    // Ensures same customer → same partition
    value: JSON.stringify(order),
    timestamp: order.timestamp // Event time
  }]
});

// Consumer: Pull model, process at your own pace
const consumer = kafka.consumer({
  groupId: 'analytics',
  maxBytesPerPartition: 1048576  // Fetch 1MB per partition
});

await consumer.connect();
await consumer.subscribe({ topic: 'orders', fromBeginning: false });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    // Process message
    await processOrder(JSON.parse(message.value));

    // Kafka tracks offset automatically (at-least-once by default)
    // For exactly-once: enable idempotence and transactions
  }
});

// Replay: Reset consumer offset to replay messages
await consumer.seek({ topic: 'orders', partition: 0, offset: '1000' });

// Result: 1M+ msg/sec, 30ms p99 latency, full replay support
// Cost: $2k-5k/month (10-node cluster)

// ===== RabbitMQ Producer/Consumer (Low Latency) =====
// Use when: <100k events/day, need low latency, simple routing

const amqp = require('amqplib');

const connection = await amqp.connect('amqp://rabbitmq1:5672');
const channel = await connection.createChannel();

// Declare queue
await channel.assertQueue('orders', {
  durable: true,        // Persist to disk
  maxLength: 100000     // Limit queue size (prevent OOM)
});

// Producer: Send message
channel.sendToQueue('orders', Buffer.from(JSON.stringify(order)), {
  persistent: true,     // Survive broker restart
  priority: order.urgent ? 10 : 5
});

// Consumer: Push model (broker delivers messages)
channel.consume('orders', async (msg) => {
  try {
    const order = JSON.parse(msg.content.toString());
    await processOrder(order);

    // Acknowledge (removes from queue - no replay!)
    channel.ack(msg);

  } catch (error) {
    // Negative acknowledge (requeue or dead-letter)
    channel.nack(msg, false, true);  // requeue=true
  }
}, { noAck: false });  // Manual acknowledgment

// Result: 100k msg/sec, 15ms p99 latency, no replay (ack deletes message)
// Cost: $200-500/month (2-node cluster)
// Limitation: No replay without separate event store

// ===== AWS Kinesis (Fully Managed) =====
// Use when: <10M events/day, want zero ops, AWS ecosystem

const { KinesisClient, PutRecordCommand, GetRecordsCommand } = require('@aws-sdk/client-kinesis');

const kinesis = new KinesisClient({ region: 'us-east-1' });

// Producer: Single record
await kinesis.send(new PutRecordCommand({
  StreamName: 'orders',
  Data: Buffer.from(JSON.stringify(order)),
  PartitionKey: order.customerId  // Determines shard
}));

// Producer: Batch (up to 500 records or 5MB)
const { PutRecordsCommand } = require('@aws-sdk/client-kinesis');
await kinesis.send(new PutRecordsCommand({
  StreamName: 'orders',
  Records: orders.map(o => ({
    Data: Buffer.from(JSON.stringify(o)),
    PartitionKey: o.customerId
  }))
}));

// Consumer: Process records
const { GetShardIteratorCommand } = require('@aws-sdk/client-kinesis');

// Get iterator
const iteratorResponse = await kinesis.send(new GetShardIteratorCommand({
  StreamName: 'orders',
  ShardId: 'shardId-000000000000',
  ShardIteratorType: 'LATEST'  // Or TRIM_HORIZON for replay
}));

// Poll for records
const recordsResponse = await kinesis.send(new GetRecordsCommand({
  ShardIterator: iteratorResponse.ShardIterator,
  Limit: 100
}));

for (const record of recordsResponse.Records) {
  const order = JSON.parse(Buffer.from(record.Data).toString());
  await processOrder(order);
}

// Result: 40k msg/sec, 200ms p99 latency, full replay, zero ops
// Cost: $75-750/month (5-50 shards)`}
          </CodeBlock>

          <H2>🚫 Common Mistakes</H2>
          <ComparisonTable
            headers={['Mistake', 'Impact', 'Fix']}
            rows={[
              ['Using RabbitMQ for event sourcing', 'Messages deleted after ack → cannot replay history', 'Use Kafka or Kinesis for event sourcing (log-based)'],
              ['Using Kafka for low-volume queues', '$600/month infrastructure for 100 msg/day ($0.20/msg!)', 'Use RabbitMQ or SQS for low-volume (<10k msg/day)'],
              ['Not batching Kinesis requests', '10M requests × $0.014/1M = $140/month vs $1.40 with batching', 'Batch up to 500 records per PutRecords call'],
              ['Single Kafka partition for high throughput', '1 partition = 1 consumer = bottleneck (10k msg/sec max)', 'Use customer_id/user_id as partition key, 10+ partitions'],
              ['Using Kinesis for <1ms latency requirements', 'Kinesis p99 = 200ms (fails SLA)', 'Use RabbitMQ (15ms p99) or Redis Streams (1ms p99)'],
              ['Not monitoring consumer lag', 'Lag grows to millions → 24-hour delay goes unnoticed', 'Alert on consumer lag >1 minute for real-time apps'],
            ]}
          />

          <H2>📋 Message Broker Selection</H2>
          <P><Strong>Choose Kafka when:</Strong></P>
          <UL>
            <LI>✓ High throughput (&gt;100k msg/sec)</LI>
            <LI>✓ Need event replay (reprocess from any offset)</LI>
            <LI>✓ Long retention (days-weeks-months)</LI>
            <LI>✓ Event sourcing or audit log</LI>
            <LI>✓ Have ops team to manage cluster</LI>
          </UL>

          <P><Strong>Choose RabbitMQ when:</Strong></P>
          <UL>
            <LI>✓ Low-medium throughput (&lt;100k msg/sec)</LI>
            <LI>✓ Need lowest latency (p99 &lt;20ms)</LI>
            <LI>✓ Complex routing (topic exchanges, routing keys)</LI>
            <LI>✓ Task queues (work distribution, retries)</LI>
            <LI>✓ No replay requirement (ack-and-delete)</LI>
          </UL>

          <P><Strong>Choose AWS Kinesis when:</Strong></P>
          <UL>
            <LI>✓ Low-medium throughput (&lt;10M msg/day)</LI>
            <LI>✓ Want zero operational burden</LI>
            <LI>✓ Already in AWS ecosystem</LI>
            <LI>✓ Need replay but not Kafka complexity</LI>
            <LI>✓ Startup or small team (&lt;10 engineers)</LI>
          </UL>

          <KeyPoint>
            <Strong>Golden Rule:</Strong> Start with managed service (Kinesis/SQS) for &lt;10M msg/day.
            Migrate to self-hosted Kafka when &gt;100M msg/day or need &lt;50ms latency.
            Use RabbitMQ for task queues with complex routing.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'windowing',
      type: 'concept',
      title: 'Windowing - Time-Based Aggregations',
      content: (
        <Section>
          <H1>Windowing - Time-Based Aggregations</H1>
          <P>
            <Strong>Windowing</Strong> groups events by time or count for aggregations (count, sum, average).
          </P>

          <H2>Window Types</H2>
          <UL>
            <LI><Strong>Tumbling Windows:</Strong> Fixed-size, non-overlapping (e.g., every 1 minute)</LI>
            <LI><Strong>Sliding Windows:</Strong> Fixed-size, overlapping (e.g., 1-minute window, slide every 10 seconds)</LI>
            <LI><Strong>Session Windows:</Strong> Variable-size based on activity gaps</LI>
          </UL>

          <Example title="Window Types">
            <CodeBlock>
{`// Tumbling Window (1 minute)
[00:00-00:01) -> count=100
[00:01-00:02) -> count=150
[00:02-00:03) -> count=120

// Sliding Window (1 minute, slide 10 seconds)
[00:00-00:01) -> count=100
[00:00:10-00:01:10) -> count=110
[00:00:20-00:01:20) -> count=105

// Session Window (gap > 5 minutes starts new session)
User activity: [10:00, 10:02, 10:05, 10:15]
Session 1: [10:00-10:05] (3 events)
Session 2: [10:15] (1 event)`}
            </CodeBlock>
          </Example>

          <H2>Event Time vs. Processing Time</H2>
          <UL>
            <LI><Strong>Processing Time:</Strong> When event processed (may be delayed)</LI>
            <LI><Strong>Event Time:</Strong> When event occurred (more accurate)</LI>
            <LI><Strong>Watermarks:</Strong> Indicate when late events can be ignored</LI>
          </UL>

          <KeyPoint>
            <Strong>Best Practice:</Strong> Use event time for accuracy, watermarks for handling late events.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'exactly-once',
      type: 'concept',
      title: 'Exactly-Once Processing',
      content: (
        <Section>
          <H1>Exactly-Once Processing</H1>
          <P>
            Guaranteeing <Strong>exactly-once</Strong> processing (no duplicates, no drops) is challenging
            in distributed systems. Three levels:
          </P>

          <H2>Delivery Semantics</H2>
          <UL>
            <LI><Strong>At-Most-Once:</Strong> Message may be lost, never duplicated</LI>
            <LI><Strong>At-Least-Once:</Strong> Message may be duplicated, never lost</LI>
            <LI><Strong>Exactly-Once:</Strong> Message processed exactly once (hardest to achieve)</LI>
          </UL>

          <H2>Achieving Exactly-Once</H2>
          <UL>
            <LI><Strong>Idempotent Operations:</Strong> Processing same message twice has same effect</LI>
            <LI><Strong>Transactional Writes:</Strong> Atomic writes to output (e.g., Kafka transactions)</LI>
            <LI><Strong>Checkpointing:</Strong> Save state periodically, recover from failures</LI>
          </UL>

          <Example title="Idempotent Processing">
            <CodeBlock>
{`// Idempotent: Processing same event twice is safe
function processPayment(event) {
  payment_id = event.payment_id;
  
  // Check if already processed
  if (processed_payments.contains(payment_id)) {
    return;  // Skip duplicate
  }
  
  // Process payment
  chargeCard(event.amount);
  processed_payments.add(payment_id);
}

// Even if event processed twice, payment only charged once`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Best Practice:</Strong> Design operations to be idempotent. Use idempotency keys for critical operations.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'delivery-semantics-tradeoff',
      type: 'concept',
      title: '🎯 Critical Trade-Off: At-Least-Once vs Exactly-Once',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Delivery Semantics</H1>
          <P>
            Choosing between <Strong>at-least-once</Strong> and <Strong>exactly-once</Strong> delivery
            impacts your system's complexity, performance, and data correctness.
          </P>

          <H2>📊 Delivery Semantics Comparison</H2>
          <ComparisonTable
            headers={['Dimension', 'At-Most-Once', 'At-Least-Once', 'Exactly-Once']}
            rows={[
              ['Guarantee', 'No duplicates, may lose', 'No loss, may duplicate', 'No loss, no duplicates'],
              ['Implementation', 'Fire and forget', 'Retry until ack', 'Transactions + idempotency'],
              ['Performance', 'Fastest (no retries)', 'Fast (simple retries)', 'Slower (2-3× latency)'],
              ['Throughput', '100k msg/sec', '100k msg/sec', '30-50k msg/sec (coordination overhead)'],
              ['Complexity', 'Trivial', 'Low', 'High (transactions, dedup)'],
              ['Data Loss Risk', 'High (network failures)', 'None', 'None'],
              ['Duplicate Risk', 'None', 'High (5-10% during retries)', 'None'],
              ['Cost', '$100/month (minimal)', '$100/month', '$300/month (extra coordination)'],
              ['Best For', 'Metrics, logs', 'Most use cases ✓', 'Financial, billing, inventory'],
            ]}
          />

          <H2>💡 Real-World Example: Payment Processing Stream</H2>
          <InfoBox>
            <P>
              <Strong>Scenario:</Strong> Payment processor handles 1M transactions/day ($50 average),
              processes events from Kafka to charge customers and update balances.
            </P>

            <H3>Option 1: At-Most-Once (Fire and Forget)</H3>
            <UL>
              <LI><Strong>Implementation:</Strong> Process message, don't retry on failure</LI>
              <LI><Strong>Failure Rate:</Strong> 0.1% messages lost (network/process failures)</LI>
              <LI><Strong>Lost Payments:</Strong> 1M × 0.1% = 1,000 transactions/day × $50 = $50k/day</LI>
              <LI><Strong>Customer Impact:</Strong> 1,000 customers not charged → revenue loss</LI>
              <LI><Strong>Complexity:</Strong> Minimal (no retry logic)</LI>
              <LI><Strong>Throughput:</Strong> 100k msg/sec (no overhead)</LI>
              <LI><Strong>Annual Revenue Loss:</Strong> $50k × 365 = $18.25M ❌</LI>
              <LI><Strong>Use Case:</Strong> Logs, metrics (lossy acceptable)</LI>
            </UL>

            <H3>Option 2: At-Least-Once (Retry Until Ack)</H3>
            <UL>
              <LI><Strong>Implementation:</Strong> Retry on failure, no deduplication</LI>
              <LI><Strong>Duplicate Rate:</Strong> 2% messages duplicated (retry during timeouts)</LI>
              <LI><Strong>Duplicate Charges:</Strong> 1M × 2% = 20,000 transactions/day × $50 = $1M/day</LI>
              <LI><Strong>Customer Impact:</Strong> 20,000 customers double-charged → refunds + support</LI>
              <LI><Strong>Refund Cost:</Strong> $1M/day + 20% goodwill = $1.2M/day</LI>
              <LI><Strong>Support Cost:</Strong> 20,000 tickets × $5/ticket = $100k/day</LI>
              <LI><Strong>Complexity:</Strong> Low (simple retry with exponential backoff)</LI>
              <LI><Strong>Throughput:</Strong> 100k msg/sec (minimal overhead)</LI>
              <LI><Strong>Annual Cost:</Strong> ($1.2M + $100k) × 365 = $474.5M ❌</LI>
              <LI><Strong>Mitigation:</Strong> Make operations idempotent (check payment_id before charging)</LI>
            </UL>

            <H3>Option 3: Exactly-Once (Transactions + Idempotency)</H3>
            <UL>
              <LI><Strong>Implementation:</Strong> Kafka transactions + database deduplication</LI>
              <LI><Strong>Duplicate Rate:</Strong> 0% (idempotency keys prevent duplicates)</LI>
              <LI><Strong>Loss Rate:</Strong> 0% (transactions ensure delivery)</LI>
              <LI><Strong>Complexity:</Strong> High (transaction coordination, idempotency table)</LI>
              <LI><Strong>Latency:</Strong> 2-3× higher (50ms → 150ms due to coordination)</LI>
              <LI><Strong>Throughput:</Strong> 30k msg/sec (transaction overhead)</LI>
              <LI><Strong>Infrastructure:</Strong> Need 3× capacity to handle lower throughput = $300k/year</LI>
              <LI><Strong>Development Cost:</Strong> $100k (implement transactions + dedup logic)</LI>
              <LI><Strong>Annual Cost:</Strong> $300k infra + $100k dev = $400k</LI>
              <LI><Strong>Annual Savings:</Strong> $474.5M (avoided duplicate charges) - $400k = $474.1M ✓</LI>
            </UL>

            <H3>📈 ROI Analysis</H3>
            <ComparisonTable
              headers={['Delivery Semantic', 'Annual Cost', 'Data Accuracy', 'Best For']}
              rows={[
                ['At-Most-Once', '$18.25M loss', 'Lossy (0.1%)', 'Logs, metrics, analytics'],
                ['At-Least-Once + Idempotency', '$400k ✓', '100% accurate ✓', 'Most applications (recommended)'],
                ['Exactly-Once (Transactions)', '$400k ✓', '100% accurate ✓', 'Financial, when idempotency not possible'],
              ]}
            />

            <P><Strong>Result:</Strong> At-least-once with idempotent processing achieves same accuracy as exactly-once
            at similar cost, but simpler to implement. Exactly-once only needed when idempotency impossible.</P>
          </InfoBox>

          <H2>🔧 Decision Framework with Implementation</H2>
          <CodeBlock>
{`// ===== At-Least-Once with Idempotency (RECOMMENDED) =====
// Simple, fast, accurate - best of all worlds

const { Kafka } = require('kafkajs');
const kafka = new Kafka({ brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'payments' });

// Idempotency table (prevent duplicate processing)
const processedPayments = new Set();  // In production: Redis or database

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const payment = JSON.parse(message.value.toString());
    const paymentId = payment.id;  // Unique idempotency key

    // Check if already processed (idempotency)
    if (processedPayments.has(paymentId)) {
      console.log(\`Skipping duplicate payment: \${paymentId}\`);
      return;  // Skip duplicate, safe to process multiple times
    }

    try {
      // Process payment (charge customer)
      await chargeCustomer(payment.customerId, payment.amount);

      // Mark as processed AFTER successful charge
      processedPayments.add(paymentId);

      // Consumer auto-commits offset (at-least-once)
      // If failure occurs, message will be retried, but idempotency prevents duplicate charge

    } catch (error) {
      console.error(\`Payment failed: \${paymentId}\`, error);
      // Don't add to processedPayments - will retry on next poll
      throw error;  // Kafka will retry
    }
  }
});

// Result: At-least-once delivery + idempotent processing = exactly-once semantics
// Throughput: 100k msg/sec, Latency: 50ms, Accuracy: 100%
// Cost: $100/month (simple implementation)

// ===== Exactly-Once with Kafka Transactions =====
// Complex, slower, use only when idempotency not feasible

const producer = kafka.producer({
  transactionalId: 'payment-processor',  // Enable transactions
  idempotent: true,                      // Prevent duplicate sends
  maxInFlightRequests: 1                 // Ensure ordering
});

await producer.connect();

const consumer = kafka.consumer({ groupId: 'payments' });
await consumer.subscribe({ topic: 'payment-requests' });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const payment = JSON.parse(message.value.toString());

    // Begin transaction
    const transaction = await producer.transaction();

    try {
      // 1. Charge customer
      await chargeCustomer(payment.customerId, payment.amount);

      // 2. Produce result to output topic (transactional)
      await transaction.send({
        topic: 'payment-results',
        messages: [{
          key: payment.id,
          value: JSON.stringify({ status: 'success', ...payment })
        }]
      });

      // 3. Commit transaction (atomically commits both Kafka offsets and output)
      await transaction.commit();

      // If ANY step fails, entire transaction rolls back (including Kafka offset)
      // Message will be reprocessed, but transaction ensures no duplicates

    } catch (error) {
      // Abort transaction (rollback)
      await transaction.abort();
      console.error('Transaction aborted', error);
      throw error;  // Kafka will retry entire transaction
    }
  }
});

// Result: True exactly-once (Kafka offset + output committed atomically)
// Throughput: 30k msg/sec (3× slower), Latency: 150ms (3× slower)
// Cost: $300/month (more infrastructure for lower throughput)

// ===== Idempotency with Database Deduplication =====
// For critical operations, store idempotency keys in database

const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://...' });

async function processPaymentIdempotent(payment) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if already processed (atomic)
    const result = await client.query(
      'SELECT id FROM processed_payments WHERE payment_id = $1 FOR UPDATE',
      [payment.id]
    );

    if (result.rows.length > 0) {
      // Already processed, skip
      await client.query('COMMIT');
      return { status: 'duplicate', paymentId: payment.id };
    }

    // Process payment
    await chargeCustomer(payment.customerId, payment.amount);

    // Record as processed (atomically with charge)
    await client.query(
      'INSERT INTO processed_payments (payment_id, processed_at) VALUES ($1, NOW())',
      [payment.id]
    );

    await client.query('COMMIT');
    return { status: 'success', paymentId: payment.id };

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;  // Will retry, but deduplication prevents duplicate charge
  } finally {
    client.release();
  }
}

// Result: Database-backed idempotency (survives process restarts)
// Guarantees exactly-once even with at-least-once delivery
// Throughput: 50k msg/sec, Latency: 80ms
// Cost: $150/month (database for dedup table)`}
          </CodeBlock>

          <H2>🚫 Common Mistakes</H2>
          <ComparisonTable
            headers={['Mistake', 'Impact', 'Fix']}
            rows={[
              ['Using at-most-once for payments', '$18M annual revenue loss from dropped messages', 'Always use at-least-once + idempotency for critical data'],
              ['At-least-once without idempotency', '$474M annual cost from duplicate charges', 'Add idempotency keys (payment_id, order_id) to prevent duplicates'],
              ['Using exactly-once for logs/metrics', '3× infrastructure cost, 3× latency for non-critical data', 'Use at-most-once or at-least-once for lossy-tolerant data'],
              ['Storing idempotency keys in-memory', 'Keys lost on restart → duplicates after recovery', 'Store in Redis (TTL 7 days) or database'],
              ['Not setting idempotency key TTL', 'Infinite growth: 1M/day × 365 days = 365M keys in Redis', 'Set TTL to 2× max retry window (e.g., 24 hours)'],
              ['Using Kafka transactions for all topics', '70% throughput reduction for non-critical data', 'Reserve transactions for financial/critical topics only'],
            ]}
          />

          <H2>📋 Delivery Semantic Selection</H2>
          <P><Strong>Choose At-Most-Once when:</Strong></P>
          <UL>
            <LI>✓ Metrics and monitoring (loss &lt;1% acceptable)</LI>
            <LI>✓ Application logs (sampling okay)</LI>
            <LI>✓ Real-time analytics (approximate counts fine)</LI>
            <LI>✓ Need maximum throughput (&gt;100k msg/sec)</LI>
          </UL>

          <P><Strong>Choose At-Least-Once + Idempotency when:</Strong></P>
          <UL>
            <LI>✓ Most applications (99% of use cases) ✓</LI>
            <LI>✓ Payments, orders, user actions (have unique IDs)</LI>
            <LI>✓ Can design idempotent operations (check-then-act)</LI>
            <LI>✓ Need high throughput (50-100k msg/sec)</LI>
            <LI>✓ Simpler than exactly-once, same accuracy</LI>
          </UL>

          <P><Strong>Choose Exactly-Once (Transactions) when:</Strong></P>
          <UL>
            <LI>✓ Cannot design idempotent operations (rare)</LI>
            <LI>✓ Cross-system transactions (Kafka + database atomicity)</LI>
            <LI>✓ Financial audit requirements (transactional guarantees)</LI>
            <LI>✓ Can accept 3× latency increase</LI>
            <LI>✓ Throughput &lt;50k msg/sec acceptable</LI>
          </UL>

          <KeyPoint>
            <Strong>Golden Rule:</Strong> Use at-least-once delivery with idempotent operations (99% of cases).
            Add unique IDs (payment_id, order_id) to all messages. Store processed IDs in Redis/database with TTL.
            Reserve exactly-once transactions for cross-system atomicity requirements only.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

