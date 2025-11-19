import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter11StreamProcessingLesson: SystemDesignLesson = {
  id: 'ddia-ch11-stream-processing',
  slug: 'ddia-ch11-stream-processing',
  title: 'Stream Processing (DDIA Ch. 11)',
  description: 'Learn message brokers, event streams, windowing, and real-time processing patterns.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 70,
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
  ],
};

