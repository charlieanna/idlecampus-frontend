import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter8DistributedSystemsLesson: SystemDesignLesson = {
  id: 'ddia-ch8-distributed-systems',
  slug: 'ddia-ch8-distributed-systems',
  title: 'Distributed Systems Challenges (DDIA Ch. 8)',
  description: 'Learn about network partitions, timeouts, circuit breakers, and fault tolerance patterns.',
  category: 'fundamentals',
  difficulty: 'advanced',
  estimatedMinutes: 70,
  stages: [
    {
      id: 'intro-distributed',
      type: 'concept',
      title: 'The Challenges of Distributed Systems',
      content: (
        <Section>
          <H1>The Challenges of Distributed Systems</H1>
          <P>
            Distributed systems face unique challenges that don't exist in single-machine systems:
          </P>
          <UL>
            <LI><Strong>Network Partitions:</Strong> Network can split, isolating nodes</LI>
            <LI><Strong>Unreliable Networks:</Strong> Messages can be lost, delayed, or duplicated</LI>
            <LI><Strong>Unreliable Clocks:</Strong> Clocks drift, making time-based logic tricky</LI>
            <LI><Strong>Partial Failures:</Strong> Some nodes fail while others continue</LI>
          </UL>
        </Section>
      ),
    },
    {
      id: 'network-partitions',
      type: 'concept',
      title: 'Network Partitions & Timeouts',
      content: (
        <Section>
          <H1>Network Partitions & Timeouts</H1>
          <P>
            A <Strong>network partition</Strong> occurs when the network splits, isolating some nodes from others.
            The system must decide: continue operating (availability) or wait for partition to heal (consistency).
          </P>

          <H2>CAP Theorem</H2>
          <P>
            In a network partition, you can only guarantee two of three:
          </P>
          <UL>
            <LI><Strong>Consistency:</Strong> All nodes see same data</LI>
            <LI><Strong>Availability:</Strong> System continues operating</LI>
            <LI><Strong>Partition Tolerance:</Strong> System continues despite network splits</LI>
          </UL>

          <H2>Timeouts</H2>
          <P>
            <Strong>Timeouts</Strong> prevent hanging indefinitely when a service is unreachable:
          </P>
          <UL>
            <LI>Set timeout on all network calls (e.g., 3 seconds)</LI>
            <LI>If timeout exceeded, assume failure and react (retry, fallback, error)</LI>
            <LI>Never wait forever - always have a timeout</LI>
          </UL>

          <Example title="Timeout Pattern">
            <CodeBlock>
{`async function callService(url, timeout=3000) {
  try {
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(timeout) 
    });
    return response;
  } catch (error) {
    if (error.name === 'TimeoutError') {
      return fallbackResponse();  // Don't hang!
    }
    throw error;
  }
}`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Best Practice:</Strong> Always set timeouts. Default to availability over consistency during partitions.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'circuit-breakers',
      type: 'concept',
      title: 'Circuit Breakers & Idempotency',
      content: (
        <Section>
          <H1>Circuit Breakers & Idempotency</H1>
          <P>
            <Strong>Circuit breakers</Strong> prevent cascading failures by "opening" when a service is failing,
            failing fast instead of waiting for timeouts.
          </P>

          <H2>Circuit Breaker States</H2>
          <UL>
            <LI><Strong>Closed:</Strong> Normal operation, requests pass through</LI>
            <LI><Strong>Open:</Strong> Service failing, requests fail fast (no call made)</LI>
            <LI><Strong>Half-Open:</Strong> Testing if service recovered, allow one request through</LI>
          </UL>

          <Example title="Circuit Breaker">
            <CodeBlock>
{`class CircuitBreaker {
  constructor(threshold=5, timeout=60000) {
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED';
  }

  async call(serviceFn) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailure > this.timeout) {
        this.state = 'HALF_OPEN';  // Test recovery
      } else {
        throw new Error('Circuit breaker OPEN');
      }
    }

    try {
      const result = await serviceFn();
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
      this.lastFailure = Date.now();
    }
  }
}`}
            </CodeBlock>
          </Example>

          <H2>Idempotency</H2>
          <P>
            <Strong>Idempotency</Strong> means performing an operation multiple times has the same effect as once.
            Critical for safe retries.
          </P>
          <UL>
            <LI>Use idempotency keys (client provides unique key)</LI>
            <LI>Server stores key, returns same result if key seen before</LI>
            <LI>Example: Payment processing, order creation</LI>
          </UL>

          <KeyPoint>
            <Strong>Use Circuit Breakers:</Strong> When calling external services, prevent overwhelming failing services.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'unreliable-clocks',
      type: 'concept',
      title: 'Unreliable Clocks & Time',
      content: (
        <Section>
          <H1>Unreliable Clocks & Time</H1>
          <P>
            Clocks in distributed systems are <Strong>unreliable</Strong>. They drift, can be adjusted (NTP),
            and may jump backward. Never rely on clocks for ordering events.
          </P>

          <H2>Clock Types</H2>
          <UL>
            <LI><Strong>Time-of-Day Clocks:</Strong> Wall clock time (can jump backward, unreliable)</LI>
            <LI><Strong>Monotonic Clocks:</Strong> Always increases (reliable for measuring duration)</LI>
          </UL>

          <H2>Logical Clocks</H2>
          <UL>
            <LI><Strong>Lamport Timestamps:</Strong> Counter that increases with each event</LI>
            <LI><Strong>Vector Clocks:</Strong> Array of counters, one per node (captures causality)</LI>
          </UL>

          <Example title="Lamport Timestamps">
            <CodeBlock>
{`// Each node maintains a counter
Node A: counter = 5
Node B: counter = 3

// When sending message, increment and include timestamp
send(message, timestamp=6)  // A increments to 6

// When receiving message, set counter to max(local, received) + 1
receive(message, timestamp=6)
counter = max(3, 6) + 1 = 7

// Lamport timestamps preserve happens-before relationship`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Best Practice:</Strong> Use logical clocks (Lamport/Vector) for ordering, not wall clock time.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

