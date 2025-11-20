import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const sdpAsynchronismLesson: SystemDesignLesson = {
  id: 'sdp-asynchronism',
  slug: 'sdp-asynchronism',
  title: 'Asynchronous Processing',
  description: 'Master async fundamentals and critical trade-offs: WHEN to use queues vs sync processing, WHICH message broker fits your reliability needs, HOW to balance throughput vs ordering guarantees.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 70,
  stages: [
    {
      id: 'intro-asynchronism',
      type: 'concept',
      title: 'Asynchronous Processing Patterns',
      content: (
        <Section>
          <H1>Asynchronous Processing Patterns</H1>
          <P>
            Asynchronous processing decouples producers and consumers, improving scalability and resilience.
          </P>

          <H2>Message Queues</H2>
          <P>
            Producers send messages to queue, consumers process them asynchronously:
          </P>
          <UL>
            <LI><Strong>Producer:</Strong> Sends message to queue (non-blocking)</LI>
            <LI><Strong>Queue:</Strong> Stores messages (FIFO or priority-based)</LI>
            <LI><Strong>Consumer:</Strong> Processes messages from queue</LI>
          </UL>

          <H2>Producer-Consumer Pattern</H2>
          <Example title="Email Sending Queue">
            <CodeBlock>
{`// Producer (API endpoint)
POST /send-email
{
  "to": "user@example.com",
  "subject": "Welcome",
  "body": "..."
}

// Add to queue (non-blocking, fast response)
queue.enqueue(email_task)
return {status: "queued"}

// Consumer (background worker)
while True:
    task = queue.dequeue()
    send_email(task)
    queue.ack(task)`}
            </CodeBlock>
          </Example>

          <H2>Priority Queues</H2>
          <P>
            Process high-priority messages first:
          </P>
          <UL>
            <LI>Urgent emails processed before regular emails</LI>
            <LI>Payment processing before analytics</LI>
            <LI>Use multiple queues or priority field</LI>
          </UL>

          <H2>Dead Letter Queue (DLQ)</H2>
          <P>
            Store messages that failed processing after retries:
          </P>
          <UL>
            <LI>Message fails after 3 retries → Move to DLQ</LI>
            <LI>Admin can inspect and reprocess DLQ messages</LI>
            <LI>Prevents queue from being blocked by bad messages</LI>
          </UL>

          <H2>Backpressure</H2>
          <P>
            When consumer is slower than producer, apply backpressure:
          </P>
          <UL>
            <LI>Producer slows down or stops producing</LI>
            <LI>Queue size limit: Reject new messages when queue full</LI>
            <LI>Prevents memory exhaustion</LI>
            <LI>Example: Kafka consumer lag monitoring</LI>
          </UL>

          <KeyPoint>
            <Strong>Use Queues:</Strong> For time-consuming tasks (emails, image processing, analytics),
            to decouple services, and to handle traffic spikes.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'sync-vs-async-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Synchronous vs Asynchronous Processing',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Synchronous vs Asynchronous Processing</H1>
          <P>
            <Strong>The Decision:</Strong> Choosing between synchronous (request waits for completion) and asynchronous
            (queue + background worker) processing determines user experience, system resilience, and complexity. Sync is
            simple but blocks users and fails under load. Async is resilient but adds latency and debugging complexity.
          </P>

          <ComparisonTable
            headers={['Factor', 'Synchronous (Direct)', 'Async (Simple Queue)', 'Async (Reliable Queue)', 'Async (Event Stream)']}
            rows={[
              ['User Latency', '500ms-5s (waits for task)', '50ms (immediate response)', '50ms (immediate response)', '50ms (immediate response)'],
              ['Failure Mode', 'User sees error immediately', 'Job retried, user unaware', 'Guaranteed delivery', 'At-least-once delivery'],
              ['Throughput', '100 req/sec (limited by task)', '10k req/sec (queue absorbs)', '10k req/sec', '100k+ req/sec (partitioned)'],
              ['Complexity', 'Low (direct call)', 'Medium (queue + worker)', 'High (DLQ, retries, monitoring)', 'Very High (ordering, replay)'],
              ['Cost', '$200/mo (single service)', '$300/mo (+$100 queue/workers)', '$500/mo (+durable broker)', '$800/mo (+Kafka cluster)'],
              ['Debugging', 'Easy (stack trace)', 'Hard (async, delayed failures)', 'Medium (message tracking)', 'Very Hard (event replay)'],
              ['Best For', 'Simple CRUD, < 1s tasks', 'Emails, reports, non-critical', 'Payments, orders, critical tasks', 'Event sourcing, analytics'],
            ]}
          />

          <Divider />

          <H2>Real Decision: Email Sending System</H2>
          <Example title="Sync vs Async Processing - User Experience vs Reliability">
            <CodeBlock>
{`Scenario: User registration → send welcome email
Traffic: 1000 registrations/day = 1.2 reg/sec peak

---

Approach 1: Synchronous Email Sending

POST /register
{
  "email": "user@example.com",
  "password": "..."
}

def register_user(email, password):
    # Create user in DB (50ms)
    user = db.create_user(email, password)

    # Send email synchronously (1-3 seconds)
    send_email(
        to=email,
        subject="Welcome!",
        body="..."
    )

    return {"status": "success", "user_id": user.id}

Performance:
- Latency: 1.05-3.05s (50ms DB + 1-3s email)
- User experience: ❌ Waits 3 seconds for response
- Failure: If email service down → user sees error → registration fails ❌

Problems:
1. Timeout: Email service slow (5s) → request timeout → user thinks it failed
2. Failure: Email provider down → user can't register (bad UX)
3. Retry: User clicks "Register" again → duplicate accounts
4. Load: Email service at 10 req/sec limit → bottlenecks registration

Cost: $200/mo (single service)
Decision: ❌ BAD - Email failure blocks critical user action

---

Approach 2: Asynchronous with Simple Queue (Redis)

POST /register → Returns immediately, email sent in background

def register_user(email, password):
    # Create user in DB (50ms)
    user = db.create_user(email, password)

    # Queue email job (5ms)
    redis_queue.enqueue({
        "task": "send_email",
        "email": email,
        "subject": "Welcome!",
        "body": "..."
    })

    return {"status": "success", "user_id": user.id}  # 55ms total ✅

# Background worker
def email_worker():
    while True:
        job = redis_queue.dequeue()  # Blocks until job available
        send_email(job['email'], job['subject'], job['body'])
        # No retry on failure ❌

Performance:
- Latency: 55ms (50ms DB + 5ms queue) - 50× faster! ✅
- User experience: ✅ Instant response, email arrives later
- Resilience: Email service down → user still registers ✅
- But: If worker crashes → email lost ❌

Problems:
1. No retry: Email fails (network issue) → lost forever
2. No visibility: User registered but email never arrived → no way to know
3. Redis failure: Lose all queued emails

Cost: $300/mo (+$100 Redis + workers)
Decision: ⚠️ Good for non-critical (welcome emails), bad for critical (password reset)

---

Approach 3: Asynchronous with Reliable Queue (RabbitMQ/SQS)

def register_user(email, password):
    user = db.create_user(email, password)

    # Queue to durable message broker
    rabbitmq.publish(
        exchange="emails",
        routing_key="welcome",
        message={
            "email": email,
            "subject": "Welcome!",
            "template": "welcome"
        },
        persistent=True  # Survives broker restart
    )

    return {"status": "success", "user_id": user.id}

# Worker with retry logic
def email_worker():
    while True:
        msg = rabbitmq.consume(queue="email_queue")

        try:
            send_email(msg['email'], msg['subject'], msg['body'])
            rabbitmq.ack(msg)  # Success - remove from queue
        except EmailServiceError:
            # Retry with exponential backoff
            if msg.retry_count < 3:
                rabbitmq.nack(msg, requeue=True)  # Retry
                time.sleep(2 ** msg.retry_count)  # 2s, 4s, 8s
            else:
                rabbitmq.send_to_dlq(msg)  # Dead letter queue
                alert_ops("Email failed after 3 retries")

Performance:
- Latency: 55ms (same as simple queue)
- Reliability: ✅ Guaranteed delivery (retries + DLQ)
- Visibility: ✅ Monitor queue depth, DLQ for failures
- Durability: ✅ Messages persist across broker restart

Features:
- Retries: 3 attempts with backoff (handles transient failures)
- DLQ: Failed messages preserved for manual inspection
- Monitoring: Queue depth alerts (if > 1000 → worker scaled)

Cost: $500/mo (+$200 RabbitMQ managed, +$100 workers)
Decision: ✅ BEST for important emails (password reset, order confirmations)

---

Approach 4: Event Stream (Kafka) - Overkill for Emails

def register_user(email, password):
    user = db.create_user(email, password)

    # Publish event to Kafka
    kafka.produce(
        topic="user_events",
        key=user.id,
        value={
            "event": "user_registered",
            "user_id": user.id,
            "email": email,
            "timestamp": now()
        }
    )

# Multiple consumers can subscribe
def email_worker():
    for msg in kafka.consume(topic="user_events"):
        if msg['event'] == 'user_registered':
            send_email(msg['email'], "Welcome!", "...")

def analytics_worker():
    for msg in kafka.consume(topic="user_events"):
        track_registration(msg['user_id'])

def recommendation_worker():
    for msg in kafka.consume(topic="user_events"):
        generate_recommendations(msg['user_id'])

Performance:
- Latency: 55ms
- Throughput: 100k+ events/sec (overkill for 1.2/sec)
- Features: Event replay, multiple consumers, ordering

Cost: $800/mo (Kafka cluster + 3× workers)
Decision: ❌ OVERKILL - Use only if need event sourcing or > 10k events/sec

---

Decision Tree for Email Sending:

If (task_duration < 500ms && failure_rare):
    return "Synchronous"  # Simple, fast enough

elif (non_critical && budget < $500/mo):
    return "Async Simple Queue (Redis)"  # Welcome emails, newsletters

elif (critical && need_reliability):
    return "Async Reliable Queue (RabbitMQ/SQS)"  # Password reset, order confirmation

elif (multiple_consumers || event_sourcing):
    return "Event Stream (Kafka)"  # User activity, analytics

---

Cost-Benefit Analysis:

Sync → Async Simple Queue:
- Cost: +$100/mo ($300 vs $200)
- Benefit: 50× faster response (3s → 55ms)
- ROI: User conversion increases 5% (faster signup) = $2k/mo revenue
- Decision: ✅ 20× ROI

Async Simple → Async Reliable:
- Cost: +$200/mo ($500 vs $300)
- Benefit: Guaranteed delivery (0 lost emails vs 0.1% lost)
- ROI: For e-commerce (password resets, order confirmations), 0.1% email loss =
        10 lost orders/month × $100 avg = $1k/mo loss
- Decision: ✅ 5× ROI for critical emails

Async Reliable → Kafka:
- Cost: +$300/mo ($800 vs $500)
- Benefit: Multiple consumers (save worker duplication)
- ROI: Need 3+ consumers to justify cost
- Decision: ⚠️ Only if multiple event consumers needed`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Decision Framework</H2>
          <CodeBlock>
{`# Sync vs Async Decision Tree

task_duration = measure_task_duration()  # How long does task take?
failure_impact = assess_failure_impact()  # What if task fails?
traffic_volume = measure_peak_qps()  # Peak requests/sec

if (task_duration < 500ms && failure_rate < 0.01):
    return "Synchronous"  # Fast and reliable - keep it simple
    # Examples: Database CRUD, cache lookup, simple API calls

elif (task_duration > 5s || user_facing):
    # Don't make users wait > 5 seconds
    if (failure_acceptable):  # Welcome emails, analytics
        return "Async Simple Queue (Redis/Celery)"
        # Cost: +$100/mo, 95% reliability
    else:  # Password reset, order confirmation
        return "Async Reliable Queue (RabbitMQ/SQS)"
        # Cost: +$200/mo, 99.9% reliability

elif (traffic_spiky || peak_qps > worker_capacity):
    # Queue absorbs traffic spikes
    return "Async Queue"  # Prevents service overload
    # Example: Image uploads during promo → 100× normal traffic

elif (multiple_consumers || event_sourcing):
    return "Event Stream (Kafka)"  # One event → many consumers
    # Example: User action triggers email, analytics, recommendations

else:
    return "Synchronous"  # Default to simple until proven need

# Warning signs you need async:
if (request_timeout_rate > 0.05):  # 5% timeouts
    warning("Task too slow - move to async")
if (failure_blocks_user_action):
    warning("Task failure blocks user - move to async")
if (traffic_spike_causes_outage):
    warning("No buffer for spikes - add queue")`}
          </CodeBlock>

          <Divider />

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Synchronous processing for slow third-party APIs</Strong>
            <P>
              Example: User uploads image → sync call to image processing API (5 seconds) → user waits 5 seconds → 30%
              abandon upload. API occasionally times out (30 sec) → request fails → user sees error → retry creates duplicates.
            </P>
            <P>
              <Strong>Fix:</Strong> Move to async queue. Upload image → return immediately ("Processing, we'll email you") →
              background worker processes image → webhook notifies user. User doesn't wait, API timeouts don't block uploads.
              Retries handled automatically. Conversion rate increases 30% (instant response).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Using simple queue for critical operations</Strong>
            <P>
              Example: Payment processing via Redis queue (no persistence) → Redis crashes → lose 100 pending payments ($10k
              revenue). Or: Email worker crashes mid-send → no retry → password reset emails lost → users can't log in →
              100 support tickets/day.
            </P>
            <P>
              <Strong>Fix:</Strong> Use durable message broker (RabbitMQ, SQS, Kafka) for anything involving money, user access,
              or legal requirements. Enable message persistence, implement retries (3 attempts with exponential backoff), use
              dead letter queue for failures. Cost: +$200/mo prevents $10k+ losses. For payments specifically, use transactional
              outbox pattern (write to DB + queue atomically).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Over-engineering with Kafka for simple use cases</Strong>
            <P>
              Example: Startup with 10 users/day uses Kafka for email queue ($800/mo cluster + 2 weeks engineering setup). Redis
              queue ($100/mo + 4 hours setup) would work fine for years. Wasted: $8.4k/year + 80 hours engineering time = $24k
              opportunity cost.
            </P>
            <P>
              <Strong>Fix:</Strong> Start simple: Redis queue for non-critical, RabbitMQ/SQS for critical. Migrate to Kafka only
              when: (1) Need multiple consumers per event, (2) Event replay required, (3) {'>'} 10k events/sec, (4) Event sourcing
              architecture. Use managed services (AWS SQS $1/mo, CloudAMQP $100/mo) before self-hosting Kafka. Optimize for
              simplicity first, scale later.
            </P>
          </InfoBox>

          <Divider />

          <KeyPoint>
            <Strong>ROI Example:</Strong> E-commerce checkout with payment processing (2-5 sec). Sync processing: Users wait
            3 seconds → 15% cart abandonment → lose $50k/month revenue. Async: Instant response ("Processing payment...") →
            5% abandonment → save $33k/month. Implementation: 16 hours engineering ($3,200) + $200/mo RabbitMQ. First month
            ROI: 10× ($33k saved / $3,400 invested). Ongoing: $396k/year revenue saved for $2,400/year queue cost = 165× ROI.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'message-broker-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Message Broker Selection',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Message Broker Selection</H1>
          <P>
            <Strong>The Decision:</Strong> Choosing between Redis, RabbitMQ, SQS, and Kafka determines reliability,
            throughput, operational complexity, and cost. Redis is fast but loses messages. Kafka scales infinitely but
            requires expertise. Wrong choice costs $10k+/year or causes data loss.
          </P>

          <ComparisonTable
            headers={['Factor', 'Redis (Queue)', 'RabbitMQ', 'AWS SQS', 'Apache Kafka']}
            rows={[
              ['Throughput', '50k msg/sec', '10k msg/sec', '10k msg/sec (soft limit)', '1M+ msg/sec'],
              ['Reliability', 'Low (in-memory)', 'High (persistent)', 'Very High (managed)', 'Very High (replicated)'],
              ['Message Loss Risk', 'High (crash = loss)', 'Low (with config)', 'None (AWS guarantees)', 'None (replication)'],
              ['Latency', '1ms (in-memory)', '5ms', '10-50ms (network)', '5-10ms'],
              ['Ordering', 'FIFO (single consumer)', 'FIFO (per queue)', 'FIFO (with FIFO queues)', 'FIFO (per partition)'],
              ['Setup Complexity', 'Low (single server)', 'Medium (clustering)', 'Zero (managed)', 'High (cluster config)'],
              ['Cost (startup)', '$100/mo (self-hosted)', '$100-500/mo (managed)', '$1-100/mo (pay-per-use)', '$400/mo (3-node cluster)'],
              ['Cost (scale)', '$500/mo (memory limit)', '$500-2k/mo (clustering)', '$1k-5k/mo (high volume)', '$1k-3k/mo (scales linearly)'],
              ['Best For', 'Simple tasks, low stakes', 'General purpose, reliable', 'AWS-native, variable load', 'Event streaming, analytics'],
            ]}
          />

          <Divider />

          <H2>Real Decision: Task Queue for E-commerce</H2>
          <Example title="Redis vs RabbitMQ vs SQS vs Kafka - Reliability vs Cost">
            <CodeBlock>
{`Scenario: E-commerce order processing
Load: 10k orders/day = 12 orders/sec peak, 1k emails/hour

---

Option 1: Redis Queue (Celery + Redis)

Setup:
- Redis server (in-memory queue)
- Celery workers (Python task framework)

Code:
from celery import Celery
app = Celery('tasks', broker='redis://localhost:6379')

@app.task
def process_order(order_id):
    order = db.get_order(order_id)
    charge_payment(order.payment_method, order.total)
    send_confirmation_email(order.email)
    update_inventory(order.items)

# Queue task
process_order.delay(order_id)

Performance:
- Latency: 1ms queue time
- Throughput: 50k tasks/sec (way more than needed)
- Cost: $100/mo (Redis r5.large)

Problem: Data Loss Risk ❌
- Redis is in-memory → crash loses all queued tasks
- No persistence by default → restart loses queue
- Example: 100 orders in queue, Redis crashes → lose 100 orders ($10k revenue)

Mitigation: Enable Redis AOF (append-only file)
redis.conf:
  appendonly yes
  appendfsync everysec  # Persist every second

Trade-off: Still lose up to 1 second of data (12 orders)
Risk: 12 orders/sec × 1 sec = 12 orders lost ($1,200)

Cost: $100/mo
Decision: ⚠️ OK for non-critical (emails, analytics), ❌ BAD for payments

---

Option 2: RabbitMQ (Reliable Queue)

Setup:
- RabbitMQ cluster (3 nodes for HA)
- Durable queues + persistent messages

Code:
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

# Declare durable queue
channel.queue_declare(queue='orders', durable=True)

# Publish persistent message
channel.basic_publish(
    exchange='',
    routing_key='orders',
    body=json.dumps({"order_id": order_id}),
    properties=pika.BasicProperties(
        delivery_mode=2,  # Persistent message
    )
)

# Consumer with manual ack
def callback(ch, method, properties, body):
    order_data = json.loads(body)
    try:
        process_order(order_data['order_id'])
        ch.basic_ack(delivery_tag=method.delivery_tag)  # Success
    except Exception:
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)  # Retry

channel.basic_consume(queue='orders', on_message_callback=callback)
channel.start_consuming()

Performance:
- Latency: 5ms queue time
- Throughput: 10k tasks/sec (enough for 12/sec)
- Reliability: ✅ Messages persist to disk, survive crashes
- Retries: ✅ Automatic requeue on failure

Features:
- Clustering: 3 nodes → survives 1 node failure
- Dead Letter Queue: Failed messages (after 3 retries) → DLQ for inspection
- Monitoring: Queue depth, consumer lag, failure rate

Cost: $500/mo (CloudAMQP managed 3-node cluster)
Decision: ✅ BEST for reliable order processing

ROI: Prevents data loss (12 orders/outage × $100 avg = $1,200 per incident)
     RabbitMQ costs $400/mo more than Redis = pays for itself in 1 outage/year

---

Option 3: AWS SQS (Managed Queue)

Setup:
- Zero setup (fully managed by AWS)
- Standard queue or FIFO queue

Code:
import boto3

sqs = boto3.client('sqs')
queue_url = 'https://sqs.us-east-1.amazonaws.com/123456/orders'

# Send message
sqs.send_message(
    QueueUrl=queue_url,
    MessageBody=json.dumps({"order_id": order_id})
)

# Receive and process
while True:
    messages = sqs.receive_message(
        QueueUrl=queue_url,
        MaxNumberOfMessages=10,
        WaitTimeSeconds=20
    )

    for msg in messages.get('Messages', []):
        order_data = json.loads(msg['Body'])
        try:
            process_order(order_data['order_id'])
            sqs.delete_message(
                QueueUrl=queue_url,
                ReceiptHandle=msg['ReceiptHandle']
            )
        except Exception:
            pass  # Message becomes visible again after timeout → auto-retry

Performance:
- Latency: 10-50ms (AWS network)
- Throughput: 10k tasks/sec (soft limit, can request increase)
- Reliability: ✅✅ AWS guarantees no message loss
- Retries: ✅ Automatic (message invisible for timeout, then re-visible)

Features:
- Zero ops: No servers to manage
- Auto-scaling: Handles traffic spikes automatically
- DLQ: Built-in dead letter queue after N retries
- FIFO queues: Guaranteed ordering (300 msg/sec limit)

Cost:
- 10k orders/day × 30 days = 300k messages/month
- First 1M requests free, then $0.40 per 1M
- Total: $0.12/mo (essentially free!) ✅

Cost at scale (1M orders/day):
- 30M messages/month × $0.40 = $12/mo
- Still way cheaper than self-hosted

Decision: ✅ BEST if already on AWS (cheap, zero ops)

Trade-off: Vendor lock-in (AWS only), higher latency (50ms vs 5ms)

---

Option 4: Apache Kafka (Event Stream)

Setup:
- Kafka cluster (3+ brokers)
- Zookeeper (coordination)
- Complex ops (replication, partitions, retention)

Code:
from kafka import KafkaProducer, KafkaConsumer

producer = KafkaProducer(bootstrap_servers='localhost:9092')

# Publish event
producer.send(
    'orders',
    key=str(order_id).encode(),
    value=json.dumps({
        "event": "order_placed",
        "order_id": order_id,
        "timestamp": now()
    }).encode()
)

# Consumer
consumer = KafkaConsumer(
    'orders',
    bootstrap_servers='localhost:9092',
    group_id='order-processor'
)

for msg in consumer:
    order_data = json.loads(msg.value)
    process_order(order_data['order_id'])

Performance:
- Latency: 5-10ms
- Throughput: 1M+ msg/sec (massive scale)
- Reliability: ✅ Replicated across brokers
- Retention: Messages stored for days/weeks (replay possible)

Features:
- Multiple consumers: Same event → email worker, analytics worker, inventory worker
- Event replay: Reprocess all orders from last week (for debugging)
- Partitioning: Scale consumers horizontally (10 partitions = 10 parallel consumers)
- Ordering: Per partition (not global)

Cost: $800/mo (Confluent Cloud managed, 3-node cluster)
     Or: $400/mo self-hosted (EC2 instances) + ops complexity

Use cases:
✅ Event sourcing (store all events, rebuild state)
✅ Analytics pipeline (process millions of events)
✅ Multi-consumer patterns (1 event → 5 consumers)

Decision: ❌ OVERKILL for simple order queue
         ✅ Use if need event streaming or > 100k events/sec

ROI: Kafka costs $400/mo more than RabbitMQ
     Benefit: Multiple consumers (save $300/mo in worker duplication)
     Only worth it if 3+ consumers OR need event replay

---

Decision Matrix:

Use Case: Order Processing (10k/day)
Winner: AWS SQS ($0.12/mo, zero ops) OR RabbitMQ ($500/mo, more control)

Use Case: High Throughput (1M/day)
Winner: AWS SQS ($12/mo) OR Kafka ($800/mo if need multi-consumer)

Use Case: Multi-Consumer Events (analytics + email + inventory)
Winner: Kafka ($800/mo, one event → many consumers)

Use Case: Non-Critical Tasks (welcome emails)
Winner: Redis + Celery ($100/mo, fast and simple)

---

Real Example: Migration Path

Stage 1: Startup (100 orders/day)
- Use: Redis + Celery ($100/mo)
- Why: Simple, fast, cheap
- Risk: Acceptable (100 orders × $100 = $10k max loss)

Stage 2: Growth (10k orders/day)
- Migrate to: AWS SQS ($1/mo) OR RabbitMQ ($500/mo)
- Why: Reliability critical (10k orders × $100 = $1M at risk)
- Migration: 2 days (change broker URL, test)

Stage 3: Scale (1M orders/day)
- Migrate to: Kafka ($800/mo)
- Why: Multiple consumers (email, analytics, fraud detection, inventory)
- Migration: 2 weeks (event-driven architecture)
- ROI: One event → 5 consumers (save $1k/mo in worker duplication)

Cost over 3 years:
Path A (Redis → RabbitMQ): $100/mo → $500/mo = $7,200 total
Path B (Start with RabbitMQ): $500/mo × 36 = $18,000 total
Difference: $10,800 (74% savings by starting simple)`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Decision Framework</H2>
          <CodeBlock>
{`# Message Broker Decision Tree

message_volume = measure_peak_messages_per_sec()
failure_impact = assess_message_loss_cost()  # $ value
num_consumers = count_independent_consumers()  # How many services consume events?

if (failure_impact < $1000):  # Low stakes
    if (message_volume < 10k_per_sec):
        return "Redis Queue (Celery)"  # $100/mo, simple
    else:
        return "Redis Cluster"  # $500/mo, scales to 50k/sec

elif (on_aws && failure_impact < $100k):  # AWS-native
    if (need_fifo_ordering):
        return "AWS SQS FIFO"  # $1-100/mo, 300 msg/sec
    else:
        return "AWS SQS Standard"  # $1-100/mo, 10k msg/sec
    # Zero ops, pay-per-use, 99.9% reliability

elif (failure_impact >= $100k || need_control):  # Self-hosted
    if (num_consumers == 1 && message_volume < 50k_per_sec):
        return "RabbitMQ"  # $500/mo managed, reliable
    elif (num_consumers > 2 || need_event_replay):
        return "Apache Kafka"  # $800/mo, multi-consumer
    else:
        return "RabbitMQ"  # Default reliable choice

elif (event_sourcing || analytics_pipeline):
    return "Apache Kafka"  # Built for event streams

else:
    return "RabbitMQ"  # General-purpose reliable queue

# Red flags:
if (using_redis && failure_impact > $10k):
    error("Risk too high - migrate to RabbitMQ/SQS")
if (using_kafka && num_consumers == 1 && message_volume < 10k):
    warning("Over-engineered - RabbitMQ is simpler")`}
          </CodeBlock>

          <Divider />

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Using Redis for critical operations without persistence</Strong>
            <P>
              Example: Payment processing queue in Redis (default config: in-memory only) → server restarts → lose 50 pending
              payments ($5k revenue). Happens 2× per year (maintenance + crashes) = $10k annual loss. Redis costs $100/mo,
              RabbitMQ costs $500/mo → saving $400/mo loses $10k/year (25× loss).
            </P>
            <P>
              <Strong>Fix:</Strong> If using Redis for important data, enable AOF persistence (<Code>appendonly yes</Code>).
              Better: Use RabbitMQ or SQS for anything involving money, user access, or legal requirements. Cost difference:
              $400/mo ($4,800/year) prevents $10k+ losses. Or use Redis only for non-critical tasks (welcome emails, analytics).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Self-hosting Kafka without expertise</Strong>
            <P>
              Example: Startup hears "Kafka scales to millions" → self-hosts Kafka → spends 6 months fighting Zookeeper issues,
              partition rebalancing, disk I/O tuning → engineering time = $300k opportunity cost. RabbitMQ would handle workload
              (10k msg/sec) at $500/mo with zero ops overhead.
            </P>
            <P>
              <Strong>Fix:</Strong> Only use Kafka if: (1) Need {'>'} 100k msg/sec, (2) Need multiple consumers per event, (3) Need
              event replay, (4) Have dedicated DevOps/SRE. Otherwise use managed queue (SQS, CloudAMQP). If must use Kafka,
              use managed service (Confluent Cloud, AWS MSK) not self-hosted. Self-host only at proven scale ({'>'} 1M msg/sec).
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Not implementing dead letter queues</Strong>
            <P>
              Example: Email queue retries failed messages infinitely → poison message (malformed data) blocks queue forever →
              10k emails stuck behind it → users complain "not receiving emails" → 200 support tickets → $20k support cost.
            </P>
            <P>
              <Strong>Fix:</Strong> Always implement DLQ (dead letter queue) for failed messages after N retries (typically 3).
              RabbitMQ: <Code>x-max-retries: 3, x-dead-letter-exchange: dlq</Code>. SQS: maxReceiveCount: 3, deadLetterQueue.
              Monitor DLQ size → alert if {'>'} 10 messages. Investigate failures manually, fix data/code issues. Prevents poison
              messages from blocking queue indefinitely.
            </P>
          </InfoBox>

          <Divider />

          <KeyPoint>
            <Strong>ROI Example:</Strong> E-commerce with 10k orders/day ($100 avg = $1M daily revenue). Redis queue: Risk
            of losing 100 orders/crash ($10k) × 2 crashes/year = $20k annual loss. RabbitMQ: 99.9% reliability = $100/year
            loss (0.01% of $1M daily). Cost difference: $400/mo = $4,800/year. ROI: Save $15k/year in lost orders for $4,800/year
            investment = 3.1× return. Plus: Avoided support costs (lost order complaints), reputational damage, and compliance
            issues.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'ordering-throughput-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Message Ordering vs Throughput',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Message Ordering vs Throughput</H1>
          <P>
            <Strong>The Decision:</Strong> Strict message ordering (FIFO) limits throughput to 300-3,000 msg/sec (single
            queue/partition). Relaxed ordering enables 100k+ msg/sec (parallel processing). Wrong choice: either broken
            business logic (wrong order) or performance bottleneck (can't scale).
          </P>

          <ComparisonTable
            headers={['Factor', 'Strict FIFO (Global)', 'FIFO per Partition', 'Best-Effort Ordering', 'No Ordering Guarantee']}
            rows={[
              ['Throughput', '300 msg/sec (single consumer)', '3k msg/sec (10 partitions)', '100k msg/sec (100 workers)', '1M+ msg/sec (unlimited)'],
              ['Ordering', 'Perfect (A→B→C always)', 'Per key (user_id FIFO)', 'Approximate (90% ordered)', 'Random'],
              ['Latency', '50ms (waits for previous)', '10ms (per partition)', '5ms (parallel)', '1ms (no coordination)'],
              ['Complexity', 'Simple (single queue)', 'Medium (partition logic)', 'Low (workers independent)', 'Very Low'],
              ['Use Cases', 'Bank transactions (balance)', 'User chat messages', 'Analytics events', 'Metrics, logs'],
              ['Failure Impact', 'Blocks entire queue', 'Blocks one partition', 'Continues processing', 'Continues processing'],
            ]}
          />

          <Divider />

          <H2>Real Decision: Chat Application Message Delivery</H2>
          <Example title="FIFO vs Parallel Processing - Ordering vs Scale">
            <CodeBlock>
{`Scenario: Chat app with message delivery, 1M users, 100k messages/sec peak

---

Requirement Analysis: Does order matter?

Message Type 1: Chat messages in conversation
User sends: "Hello" (t=0), "How are you?" (t=1), "See you later" (t=2)
Order: CRITICAL ✅
  - Messages must arrive in order: "Hello" → "How are you?" → "See you later"
  - Wrong order: Confusing ("See you later" before "Hello"? User left already?)

Message Type 2: Global analytics events
Events: user_123 viewed page, user_456 clicked button, user_789 logged in
Order: NOT IMPORTANT ❌
  - Processing out of order is fine (aggregate counts unaffected)
  - Example: Click processed before view → still count both correctly

Decision: Need per-conversation FIFO, global order doesn't matter

---

Approach 1: Strict FIFO (AWS SQS FIFO Queue)

sqs.send_message(
    QueueUrl='https://sqs.us-east-1.amazonaws.com/123/messages.fifo',
    MessageBody=json.dumps({
        "conversation_id": "conv_123",
        "message": "Hello",
        "timestamp": t0
    }),
    MessageGroupId="conv_123",  # FIFO per conversation
    MessageDeduplicationId=str(uuid.uuid4())
)

Throughput: 300 msg/sec per FIFO queue ❌
Problem: 100k msg/sec / 300 = need 334 FIFO queues! (unmanageable)

Workaround: Use MessageGroupId for partitioning
- Each conversation = unique MessageGroupId
- SQS processes groups in parallel
- Throughput: 300 msg/sec × 1000 groups = 300k msg/sec ✅

But: Max 20k MessageGroupIds per queue
     100k conversations → need 5 FIFO queues (manageable)

Cost: $0.50 per 1M requests
      100k msg/sec × 86,400 sec/day = 8.64B msg/day
      8.64B / 1M × $0.50 = $4,320/day = $129k/month ❌

Decision: ❌ Too expensive at scale (FIFO costs 25% more than Standard)

---

Approach 2: Kafka Partitioning (FIFO per Partition)

# Producer
producer.send(
    'messages',
    key=conversation_id.encode(),  # Partition key
    value=json.dumps({
        "conversation_id": "conv_123",
        "message": "Hello",
        "timestamp": t0
    }).encode()
)

# Kafka guarantees: All messages with same key → same partition → FIFO

Partitioning:
- 100 partitions (based on hash(conversation_id) % 100)
- Each partition: FIFO order guaranteed
- Global order: No guarantee (partition 1 may process before partition 2)

Throughput: 1k msg/sec × 100 partitions = 100k msg/sec ✅

Ordering:
- Conversation conv_123 → partition 23 → FIFO ✅
- Conversation conv_456 → partition 67 → FIFO ✅
- Global: partition 23 msg may process before partition 67 msg (OK for chat)

Consumers:
- 100 consumers (1 per partition) for max throughput
- Or: 10 consumers (each reads 10 partitions) for simplicity

Latency: 5-10ms (parallel processing)

Cost: $800/mo (Kafka cluster) + $1k/mo (100 EC2 workers)
      Total: $1,800/mo vs $129k/mo FIFO queue ✅ 72× cheaper!

Decision: ✅ BEST for per-conversation ordering at scale

---

Approach 3: Application-Level Sequencing (No Queue Ordering)

# Producer: Add sequence number
message = {
    "conversation_id": "conv_123",
    "message": "Hello",
    "sequence": 1,  # App-level sequence
    "timestamp": t0
}

redis_queue.enqueue(message)  # No ordering guarantee in queue

# Consumer: Reorder on client side
def deliver_messages(conversation_id):
    messages = fetch_recent_messages(conversation_id)
    sorted_messages = sorted(messages, key=lambda m: m['sequence'])
    return sorted_messages

Throughput: 50k msg/sec (Redis queue, no FIFO limits) ✅

Ordering:
- Queue: Random (msg 3 may arrive before msg 2)
- Client: Reorders by sequence number before display ✅
- Trade-off: Client may see temporary disorder (5ms), then auto-corrects

Latency:
- Queue: 1ms (no coordination)
- Client reordering: +2ms
- Total: 3ms ✅ (faster than FIFO queue)

Cost: $100/mo (Redis) + $500/mo (workers)
      Total: $600/mo ✅ 3× cheaper than Kafka

Problem: Gap handling
- Messages arrive: 1, 2, 4, 5 (missing 3)
- Client must wait for 3 or display "Loading..." gap
- Timeout: After 5 seconds, request missing message

Decision: ✅ BEST for latency-critical chat (3ms vs 10ms Kafka)
         Requires client-side reordering logic

---

Approach 4: Best-Effort Ordering (No Guarantees)

# Simple queue, parallel workers
for message in queue:
    process_message(message)  # 100 workers in parallel

Throughput: 100k msg/sec (no ordering overhead) ✅

Ordering: ~90% arrive in order (network + processing time)
         10% out of order (msg 2 before msg 1)

Use case: Analytics events, logs, metrics
- Example: Page view events (order doesn't affect daily count)
- Not for: Chat messages, financial transactions

Cost: $100/mo (Redis queue)

Decision: ✅ Use for non-critical ordering (analytics, logs)

---

Ordering Requirement Examples:

STRICT FIFO needed:
✅ Bank account transactions (withdraw must happen after deposit)
✅ Blockchain blocks (block N must process before N+1)
✅ Recipe steps (cook instructions: "boil water" before "add pasta")

Per-Key FIFO needed:
✅ Chat messages per conversation (user A's messages in order)
✅ Order status updates per order (placed → paid → shipped)
✅ User profile updates per user (update email → update password)

NO ordering needed:
❌ Page view analytics (count views, order irrelevant)
❌ System metrics (CPU usage data points)
❌ Email delivery (receive 100 emails, order doesn't matter)

---

Throughput vs Ordering Trade-off:

Global FIFO: 300 msg/sec → High cost, low throughput
Per-Key FIFO: 100k msg/sec → Balanced cost/performance ✅
Best-Effort: 1M msg/sec → Low cost, high throughput
No Ordering: 1M+ msg/sec → Lowest latency

Decision Tree:
if (strict_ordering_critical):  # Bank transactions
    if (throughput < 300/sec):
        return "SQS FIFO Queue"  # Simple, managed
    else:
        return "Single Kafka Partition"  # Self-managed

elif (per_key_ordering):  # Chat per conversation
    if (throughput < 10k/sec):
        return "SQS FIFO with MessageGroupId"
    else:
        return "Kafka with Partitioning"  # 100k+/sec ✅

elif (ordering_nice_to_have):  # Analytics
    return "Client-Side Sequencing"  # Fast, flexible

else:  # Logs, metrics
    return "No Ordering Guarantee"  # Max throughput`}
            </CodeBlock>
          </Example>

          <Divider />

          <H2>Decision Framework</H2>
          <CodeBlock>
{`# Ordering vs Throughput Decision

ordering_requirement = assess_ordering_criticality()
throughput_needed = measure_peak_messages_per_sec()
partition_key = identify_natural_partition()  # user_id, order_id, etc.

if (ordering_requirement == "strict_global_fifo"):
    # Every message must process in exact order
    if (throughput_needed < 300):
        return "AWS SQS FIFO Queue"  # Simple managed
    elif (throughput_needed < 3000):
        return "Single Kafka Partition"  # Self-managed
    else:
        error("Can't achieve strict FIFO at > 3k/sec - rethink architecture")

elif (ordering_requirement == "per_key_fifo"):
    # Order within group (user, conversation, order)
    if (partition_key_exists):
        if (throughput_needed < 10k):
            return "SQS FIFO with MessageGroupId"
        else:
            return "Kafka with Partition Key"  # Scales to 100k+/sec
    else:
        error("Need partition key for per-key FIFO (user_id, order_id)")

elif (ordering_requirement == "best_effort"):
    # Mostly ordered is OK (90%+)
    return "Client-Side Sequencing"
    # Add sequence number, client reorders

else:  # No ordering needed
    return "Parallel Processing"  # Max throughput

# Validation:
if (strict_fifo && throughput_needed > 10k):
    warning("FIFO bottleneck - consider per-key FIFO instead")

if (no_partition_key && per_key_fifo_needed):
    error("Must have partition key (user_id, conversation_id, order_id)")`}
          </CodeBlock>

          <Divider />

          <H2>Common Mistakes</H2>
          <InfoBox variant="warning">
            <Strong>❌ Mistake 1: Using global FIFO when per-key FIFO is sufficient</Strong>
            <P>
              Example: Chat app with 100k msg/sec uses single SQS FIFO queue → throughput capped at 300 msg/sec → 99.7% of
              messages dropped or delayed by hours. Reality: Only need FIFO per conversation, not globally. 1000 conversations
              can process in parallel.
            </P>
            <P>
              <Strong>Fix:</Strong> Use partitioning: Kafka with partition key (<Code>conversation_id</Code>) or SQS FIFO with
              MessageGroupId. Each conversation processed in order, conversations processed in parallel. Throughput: 300 msg/sec
              × 1000 conversations = 300k msg/sec. Pattern works for: per-user updates, per-order events, per-device telemetry.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 2: Not handling message gaps in client-side sequencing</Strong>
            <P>
              Example: Messages arrive: 1, 2, 4, 5 (3 lost in network). Client displays 1, 2, then waits forever for 3 → user
              sees "Loading..." indefinitely → bad UX. Or displays 1, 2, 4, 5 (skips 3) → user misses critical message ("Meeting
              moved to 3pm" = message 3).
            </P>
            <P>
              <Strong>Fix:</Strong> Implement gap detection with timeout: If sequence gap detected (1, 2, 4), wait 5 seconds
              for missing message. If timeout, request message 3 from server. If server doesn't have it (truly lost), display
              gap indicator ("1 message couldn't be loaded"). Better: Use idempotent message IDs and track missing sequences
              server-side. Request retransmission for gaps {'>'} 5 seconds old.
            </P>
          </InfoBox>

          <InfoBox variant="warning">
            <Strong>❌ Mistake 3: Requiring FIFO when order doesn't matter</Strong>
            <P>
              Example: Analytics pipeline with 1M events/sec uses Kafka single partition for "guaranteed order" → throughput
              capped at 3k/sec → 99.7% data loss. Reality: Analytics aggregates (count, sum) are commutative - order doesn't
              matter. Process "view" before "click" or "click" before "view" = same daily count.
            </P>
            <P>
              <Strong>Fix:</Strong> Identify truly order-dependent operations. Analytics aggregates (count, sum, avg): NO ordering
              needed. Financial transactions (balance updates): YES ordering needed. For analytics: Use 100+ partitions for max
              throughput (1M/sec). For balance updates: Use single partition per account (FIFO per account, accounts in parallel).
              Rule: If operation is commutative (A+B = B+A), don't need ordering.
            </P>
          </InfoBox>

          <Divider />

          <KeyPoint>
            <Strong>ROI Example:</Strong> Chat app with 100k msg/sec. Option A: Global FIFO (SQS FIFO) = $129k/mo for 300 msg/sec
            → need 334 queues → unmanageable complexity. Option B: Kafka partitioning (per-conversation FIFO) = $1,800/mo for
            100k msg/sec → 72× cheaper. Engineering investment: 1 week to implement partitioning ($10k). First month savings:
            $127k. Annual savings: $1.52M. Partitioning enables scale while maintaining conversation order.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

