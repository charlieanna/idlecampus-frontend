import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter8DistributedSystemsLesson: SystemDesignLesson = {
  id: 'ddia-ch8-distributed-systems',
  slug: 'ddia-ch8-distributed-systems',
  title: 'Distributed Systems Challenges (DDIA Ch. 8)',
  description: 'Learn about network partitions, timeouts, circuit breakers, and fault tolerance patterns. Includes critical trade-offs: CP vs AP systems, timeout strategies, and circuit breaker configurations with real-world examples and ROI analysis.',
  category: 'fundamentals',
  difficulty: 'advanced',
  estimatedMinutes: 95,
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
      id: 'cap-tradeoff',
      type: 'concept',
      title: '🎯 Critical Trade-Off: CP vs AP Systems',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: CP vs AP Systems</H1>
          <P>
            When a network partition occurs, you must choose between <Strong>Consistency (CP)</Strong> and
            <Strong>Availability (AP)</Strong>. This choice fundamentally shapes your system's behavior during failures.
          </P>

          <H2>📊 CP vs AP Comparison</H2>
          <ComparisonTable
            headers={['Dimension', 'CP (Consistency + Partition Tolerance)', 'AP (Availability + Partition Tolerance)']}
            rows={[
              ['Partition Behavior', 'Rejects writes, returns errors', 'Accepts writes, may diverge'],
              ['User Experience', 'Service unavailable (503)', 'Degraded but operational'],
              ['Data Guarantees', 'Always consistent, no conflicts', 'Eventually consistent, conflicts possible'],
              ['Write Success Rate', '95% (rejects during partition)', '99.9% (always available)'],
              ['Reconciliation Needed', 'None', 'Conflict resolution required'],
              ['Typical Use Cases', 'Banking, inventory, booking', 'Social media, analytics, caching'],
              ['Recovery Complexity', 'Simple (no conflicts)', 'Complex (merge conflicts)'],
              ['Operational Cost', 'Lower (no reconciliation)', 'Higher (conflict resolution + monitoring)'],
            ]}
          />

          <H2>💡 Real-World Example: E-Commerce Inventory</H2>
          <InfoBox>
            <P>
              <Strong>Scenario:</Strong> E-commerce platform with 10,000 QPS during peak sales,
              99.9% uptime SLA, $50 average order value.
            </P>

            <H3>Option 1: CP System (PostgreSQL with Synchronous Replication)</H3>
            <UL>
              <LI><Strong>Configuration:</Strong> Requires quorum (2/3 nodes) for writes</LI>
              <LI><Strong>Partition Impact:</Strong> 30-minute partition → service unavailable</LI>
              <LI><Strong>Lost Revenue:</Strong> 30 min × 10,000 QPS × 5% conversion × $50 = $450,000</LI>
              <LI><Strong>Data Accuracy:</Strong> 100% - no overselling, no inventory conflicts</LI>
              <LI><Strong>Support Cost:</Strong> $0 for inventory issues (no conflicts)</LI>
              <LI><Strong>Annual Cost:</Strong> $20k infrastructure + $0 reconciliation = $20k</LI>
            </UL>

            <H3>Option 2: AP System (Cassandra with Last-Write-Wins)</H3>
            <UL>
              <LI><Strong>Configuration:</Strong> Accept writes with ANY quorum during partition</LI>
              <LI><Strong>Partition Impact:</Strong> Service remains available (99.9% uptime)</LI>
              <LI><Strong>Lost Revenue:</Strong> $0 from availability</LI>
              <LI><Strong>Overselling Rate:</Strong> 0.1% of orders (10 per 10k) during partition</LI>
              <LI><Strong>Refund Cost:</Strong> 10 orders × $50 × 120% (goodwill) × 12 partitions/year = $7,200</LI>
              <LI><Strong>Support Cost:</Strong> $50k/year for conflict resolution team</LI>
              <LI><Strong>Annual Cost:</Strong> $30k infrastructure + $50k support + $7.2k refunds = $87.2k</LI>
            </UL>

            <H3>📈 ROI Analysis</H3>
            <P><Strong>For High-Value Transactions (Banking, Reservations):</Strong></P>
            <UL>
              <LI><Strong>Choose CP:</Strong> Data correctness worth more than availability</LI>
              <LI><Strong>Cost Benefit:</Strong> $67k/year savings (avoid AP overhead)</LI>
              <LI><Strong>Risk Reduction:</Strong> Zero overselling = no customer trust issues</LI>
            </UL>

            <P><Strong>For Low-Value Interactions (Social Media, Analytics):</Strong></P>
            <UL>
              <LI><Strong>Choose AP:</Strong> Availability critical, conflicts tolerable</LI>
              <LI><Strong>Revenue Protected:</Strong> $450k/year (avoid downtime)</LI>
              <LI><Strong>Net Benefit:</Strong> $450k - $67k = $383k/year</LI>
            </UL>
          </InfoBox>

          <H2>🔧 Decision Framework</H2>
          <CodeBlock>
{`// CP System Implementation (PostgreSQL)
const writeWithConsistency = async (item, quantity) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE');

    // Check inventory with row lock
    const result = await client.query(
      'SELECT quantity FROM inventory WHERE item_id = $1 FOR UPDATE',
      [item]
    );

    if (result.rows[0].quantity < quantity) {
      throw new Error('Insufficient inventory');  // Reject instead of oversell
    }

    // Update if sufficient
    await client.query(
      'UPDATE inventory SET quantity = quantity - $1 WHERE item_id = $2',
      [quantity, item]
    );

    await client.query('COMMIT');
    return { success: true, guaranteed: true };  // 100% accurate

  } catch (error) {
    await client.query('ROLLBACK');
    if (error.message.includes('could not serialize')) {
      return { success: false, error: 'Service temporarily unavailable (503)' };
    }
    throw error;
  } finally {
    client.release();
  }
};

// Result: No overselling, but 5% requests fail during partition
// Use when: Financial transactions, limited inventory, legal compliance

// AP System Implementation (Cassandra)
const writeWithAvailability = async (item, quantity) => {
  try {
    // Read current inventory (might be stale during partition)
    const result = await cassandraClient.execute(
      'SELECT quantity FROM inventory WHERE item_id = ?',
      [item],
      { consistency: cassandra.types.consistencies.one }  // ANY node
    );

    const currentQty = result.rows[0].quantity;

    // Optimistic update (may cause overselling)
    await cassandraClient.execute(
      'UPDATE inventory SET quantity = ? WHERE item_id = ?',
      [currentQty - quantity, item],
      { consistency: cassandra.types.consistencies.any }  // Write to ANY node
    );

    return { success: true, guaranteed: false };  // Best effort

  } catch (error) {
    // Fallback: log for async reconciliation
    await logConflict(item, quantity);
    return { success: true, needsReconciliation: true };
  }
};

// Background reconciliation job
const reconcileInventory = async () => {
  // Run every 5 minutes
  const conflicts = await findInventoryConflicts();

  for (const conflict of conflicts) {
    if (conflict.actualQuantity < 0) {
      // Oversold! Resolve conflict
      await refundOrder(conflict.lastOrder);
      await notifySupport(conflict);
    }
  }
};

// Result: 99.9% availability, but 0.1% overselling risk
// Use when: High availability critical, conflicts tolerable`}
          </CodeBlock>

          <H2>🚫 Common Mistakes</H2>
          <ComparisonTable
            headers={['Mistake', 'Impact', 'Fix']}
            rows={[
              ['Assuming CP means "always consistent"', 'CP rejects operations during partition (appears inconsistent to clients)', 'Understand CP = "consistent when available"'],
              ['Using AP for financial transactions', '$100k+ annual losses from overselling, refunds, legal issues', 'Use CP for money/inventory, reserve AP for non-critical data'],
              ['Not implementing idempotency in AP', 'Duplicate orders during retries (doubles customer charges)', 'Always use idempotency keys for AP writes'],
              ['Missing conflict resolution in AP', 'Permanent data inconsistencies (inventory negative forever)', 'Implement automated reconciliation jobs every 5-15 min'],
              ['Setting CP quorum too high (4/5)', 'Unnecessary unavailability (60% more downtime)', 'Use simple majority: 2/3 or 3/5 quorum'],
              ['Mixing CP and AP in same database', 'Unpredictable behavior during partitions', 'Separate databases: PostgreSQL (CP) + Cassandra (AP)'],
            ]}
          />

          <H2>📋 Selection Checklist</H2>
          <P><Strong>Choose CP (Consistency + Partition Tolerance) when:</Strong></P>
          <UL>
            <LI>✓ Financial transactions (payments, transfers, refunds)</LI>
            <LI>✓ Limited inventory (tickets, hotel rooms, products)</LI>
            <LI>✓ Booking systems (appointments, reservations)</LI>
            <LI>✓ Legal/compliance requirements for data accuracy</LI>
            <LI>✓ Cost of inconsistency &gt; cost of downtime</LI>
          </UL>

          <P><Strong>Choose AP (Availability + Partition Tolerance) when:</Strong></P>
          <UL>
            <LI>✓ Social media interactions (likes, comments, shares)</LI>
            <LI>✓ Analytics and metrics (logs, events, counters)</LI>
            <LI>✓ Caching layers (can tolerate stale data)</LI>
            <LI>✓ User-generated content (posts, profiles, preferences)</LI>
            <LI>✓ Cost of downtime &gt; cost of inconsistency + reconciliation</LI>
          </UL>

          <KeyPoint>
            <Strong>Golden Rule:</Strong> Choose CP for money and inventory, AP for everything else.
            Hybrid architectures (CP for core transactions + AP for analytics) provide best of both worlds.
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
    {
      id: 'timeout-retry-tradeoff',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Timeout & Retry Strategy',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Aggressive vs Conservative Timeouts</H1>
          <P>
            Timeouts and retry policies balance <Strong>fast failure detection</Strong> against
            <Strong>false positives</Strong>. Too aggressive causes unnecessary failures; too conservative
            causes user-facing delays and resource exhaustion.
          </P>

          <H2>📊 Timeout Strategy Comparison</H2>
          <ComparisonTable
            headers={['Dimension', 'Aggressive (500ms-1s)', 'Moderate (3s-5s)', 'Conservative (10s-30s)']}
            rows={[
              ['Failure Detection', 'Fast (500ms)', 'Medium (3-5s)', 'Slow (10-30s)'],
              ['False Positive Rate', '15-20% (network jitter)', '2-5% (occasional spikes)', '<1% (rare)'],
              ['User Wait Time', '500ms (excellent UX)', '3-5s (acceptable)', '10-30s (frustrating)'],
              ['Resource Utilization', 'Low (quick release)', 'Medium', 'High (threads blocked long)'],
              ['Retry Storm Risk', 'High (many false timeouts)', 'Medium', 'Low'],
              ['Circuit Breaker Triggers', 'Frequent (100/hr)', 'Occasional (10/hr)', 'Rare (1/day)'],
              ['Best For', 'Internal microservices', 'User-facing APIs', 'Batch jobs, third-party'],
              ['Cost Impact', 'Higher retry costs', 'Balanced', 'Lower retry costs'],
            ]}
          />

          <H2>💡 Real-World Example: Payment Processing API</H2>
          <InfoBox>
            <P>
              <Strong>Scenario:</Strong> Payment gateway API with 500 TPS, p99 latency of 800ms,
              occasional spikes to 2s, $10 average transaction value.
            </P>

            <H3>Option 1: Aggressive Timeout (1 second)</H3>
            <UL>
              <LI><Strong>Configuration:</Strong> 1s timeout, 3 retries with exponential backoff (1s, 2s, 4s)</LI>
              <LI><Strong>False Timeout Rate:</Strong> 10% of requests (50 TPS) during load spikes</LI>
              <LI><Strong>Retry Volume:</Strong> 50 × 3 = 150 extra requests/sec → 30% increased load</LI>
              <LI><Strong>Payment Gateway Cost:</Strong> $0.10/transaction → 150 TPS × 86,400s × $0.10 = $1,296/day extra</LI>
              <LI><Strong>False Declines:</Strong> 2% ultimate failures × 50 TPS × $10 = $500/sec lost revenue</LI>
              <LI><Strong>Circuit Breaker:</Strong> Opens frequently (every 2 hours) → 5% unavailability</LI>
              <LI><Strong>Annual Cost:</Strong> $473k retry costs + $4.3M lost revenue = $4.77M</LI>
            </UL>

            <H3>Option 2: Moderate Timeout (5 seconds)</H3>
            <UL>
              <LI><Strong>Configuration:</Strong> 5s timeout, 2 retries with exponential backoff (5s, 10s)</LI>
              <LI><Strong>False Timeout Rate:</Strong> 1% of requests (5 TPS) during severe spikes</LI>
              <LI><Strong>Retry Volume:</Strong> 5 × 2 = 10 extra requests/sec → 2% increased load</LI>
              <LI><Strong>Payment Gateway Cost:</Strong> 10 TPS × 86,400s × $0.10 = $86/day extra</LI>
              <LI><Strong>False Declines:</Strong> 0.5% ultimate failures × 5 TPS × $10 = $25/sec lost revenue</LI>
              <LI><Strong>Circuit Breaker:</Strong> Opens rarely (monthly) → 0.1% unavailability</LI>
              <LI><Strong>User Experience:</Strong> 5s wait acceptable for payment confirmation</LI>
              <LI><Strong>Annual Cost:</Strong> $31k retry costs + $788k lost revenue = $819k</LI>
            </UL>

            <H3>Option 3: Conservative Timeout (30 seconds)</H3>
            <UL>
              <LI><Strong>Configuration:</Strong> 30s timeout, 1 retry (30s)</LI>
              <LI><Strong>False Timeout Rate:</Strong> 0.1% of requests (0.5 TPS)</LI>
              <LI><Strong>Retry Volume:</Strong> 0.5 × 1 = 0.5 extra requests/sec → 0.1% increased load</LI>
              <LI><Strong>Payment Gateway Cost:</Strong> 0.5 TPS × 86,400s × $0.10 = $4/day extra</LI>
              <LI><Strong>False Declines:</Strong> Minimal (~$1k/year)</LI>
              <LI><Strong>User Experience:</Strong> 30s wait frustrating → 20% cart abandonment</LI>
              <LI><Strong>Thread Exhaustion:</Strong> 500 TPS × 30s = 15,000 threads needed (vs 500 with 1s)</LI>
              <LI><Strong>Infrastructure Cost:</Strong> $200k/year for 10× server capacity</LI>
              <LI><Strong>Annual Cost:</Strong> $1k retry + $200k infrastructure + $2M abandoned carts = $2.2M</LI>
            </UL>

            <H3>📈 ROI Analysis</H3>
            <ComparisonTable
              headers={['Strategy', 'Total Annual Cost', 'Winner For']}
              rows={[
                ['Aggressive (1s)', '$4.77M', 'Never recommended for payment APIs'],
                ['Moderate (5s)', '$819k ✓', 'User-facing APIs with moderate latency'],
                ['Conservative (30s)', '$2.2M', 'Batch processing, non-time-sensitive'],
              ]}
            />

            <P><Strong>Result:</Strong> Moderate timeout saves $3.95M vs aggressive, $1.38M vs conservative.</P>
          </InfoBox>

          <H2>🔧 Decision Framework with Adaptive Timeouts</H2>
          <CodeBlock>
{`// Adaptive Timeout Implementation
class AdaptiveTimeout {
  constructor(serviceName) {
    this.serviceName = serviceName;
    this.latencies = [];  // Rolling window of recent latencies
    this.windowSize = 100;
  }

  // Calculate timeout based on p99 latency + buffer
  calculateTimeout() {
    if (this.latencies.length < 10) {
      return 5000;  // Default 5s until we have data
    }

    const sorted = [...this.latencies].sort((a, b) => a - b);
    const p99 = sorted[Math.floor(sorted.length * 0.99)];

    // Timeout = p99 + 2× standard deviation (covers 99.7% of requests)
    const mean = this.latencies.reduce((a, b) => a + b) / this.latencies.length;
    const variance = this.latencies.reduce((sum, val) => sum + (val - mean) ** 2, 0) / this.latencies.length;
    const stdDev = Math.sqrt(variance);

    const timeout = Math.max(p99 + 2 * stdDev, 1000);  // Minimum 1s
    return Math.min(timeout, 30000);  // Maximum 30s
  }

  recordLatency(latency) {
    this.latencies.push(latency);
    if (this.latencies.length > this.windowSize) {
      this.latencies.shift();  // Keep only recent 100 samples
    }
  }

  async callWithTimeout(fn) {
    const timeout = this.calculateTimeout();
    const startTime = Date.now();

    try {
      const result = await Promise.race([
        fn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeout)
        )
      ]);

      this.recordLatency(Date.now() - startTime);
      return result;

    } catch (error) {
      const elapsed = Date.now() - startTime;

      if (error.message === 'Timeout') {
        // Only record actual latency if request completed
        console.warn(\`Timeout after \${elapsed}ms (threshold: \${timeout}ms)\`);
        throw error;
      }

      this.recordLatency(elapsed);  // Record even on error
      throw error;
    }
  }
}

// Usage with Circuit Breaker
class ServiceClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.timeout = new AdaptiveTimeout('payment-api');
    this.circuitBreaker = new CircuitBreaker(5, 60000);  // 5 failures, 60s cooldown
  }

  async processPayment(amount) {
    return this.circuitBreaker.call(async () => {
      return this.timeout.callWithTimeout(async () => {
        const response = await fetch(\`\${this.baseURL}/payment\`, {
          method: 'POST',
          body: JSON.stringify({ amount }),
          headers: { 'Idempotency-Key': generateIdempotencyKey() }
        });

        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
        return response.json();
      });
    });
  }
}

// Result: Automatically adjusts to service latency
// - During normal load: 2s timeout (p99 = 800ms + 2×400ms)
// - During spikes: 8s timeout (p99 = 4s + 2×2s)
// - Prevents false timeouts while maintaining fast failure detection

// Retry Strategy with Exponential Backoff + Jitter
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;

      // Exponential backoff: 1s, 2s, 4s, 8s...
      const backoff = Math.min(1000 * (2 ** attempt), 10000);

      // Add jitter (±25%) to prevent retry storms
      const jitter = backoff * (0.75 + Math.random() * 0.5);

      console.log(\`Retry \${attempt + 1}/\${maxRetries} after \${jitter}ms\`);
      await new Promise(resolve => setTimeout(resolve, jitter));
    }
  }
}

// Use adaptive timeouts + retries together
const payment = await retryWithBackoff(() =>
  client.processPayment(100)
);`}
          </CodeBlock>

          <H2>🚫 Common Mistakes</H2>
          <ComparisonTable
            headers={['Mistake', 'Impact', 'Fix']}
            rows={[
              ['Using same timeout for all services', 'Fast services timeout unnecessarily OR slow services never timeout', 'Per-service adaptive timeouts based on p99 latency'],
              ['No exponential backoff on retries', 'Retry storm amplifies outage (500 TPS → 2000 TPS)', 'Use exponential backoff: 1s, 2s, 4s, 8s with max cap'],
              ['Retrying non-idempotent operations', 'Duplicate charges ($100 payment → $300 charged)', 'Always include idempotency keys for retries'],
              ['Missing jitter in backoff', 'Synchronized retries cause thundering herd', 'Add ±25% random jitter to retry delays'],
              ['Timeout > circuit breaker threshold', 'Circuit never opens (waits 30s × 5 = 150s)', 'Timeout should be 3-5× shorter than breaker threshold'],
              ['Not measuring timeout false positive rate', 'Unknown cost of aggressive timeouts', 'Monitor timeout/success ratio, aim for <5% false timeouts'],
            ]}
          />

          <H2>📋 Timeout Selection Guide</H2>
          <ComparisonTable
            headers={['Service Type', 'Recommended Timeout', 'Retry Policy', 'Reasoning']}
            rows={[
              ['Internal microservice (same DC)', '500ms-1s', '3 retries, 100ms backoff', 'Low latency, controlled environment'],
              ['User-facing API (critical path)', '3s-5s', '2 retries, 2s backoff', 'Balance UX with false positives'],
              ['Payment/External API', 'p99 + 2×stddev (adaptive)', '2 retries, 5s backoff + jitter', 'Minimize false timeouts, high cost per retry'],
              ['Database query', '1s-2s', '0 retries (fail fast)', 'Retry at application layer, not DB'],
              ['Batch/Background job', '30s-60s', '1 retry, 30s backoff', 'Not time-sensitive, minimize retries'],
              ['Third-party webhook', '10s-15s', '0 retries (async queue)', 'Unreliable, use async pattern instead'],
            ]}
          />

          <KeyPoint>
            <Strong>Golden Rule:</Strong> Use adaptive timeouts (p99 + 2×stddev) for critical paths.
            Always implement exponential backoff with jitter. Monitor false timeout rate (target &lt;5%).
            Combine with circuit breakers to prevent cascading failures.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

