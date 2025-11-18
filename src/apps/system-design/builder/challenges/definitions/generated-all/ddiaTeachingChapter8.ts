/**
 * DDIA Chapter 8: The Trouble with Distributed Systems - Teaching Problems
 *
 * Focus: Understanding failures and unreliability in distributed systems
 *
 * Problems:
 * Network Issues (5):
 * 1. Network Partitions - Handle split-brain scenarios
 * 2. Timeouts - Configure retry logic
 * 3. Circuit Breakers - Prevent cascading failures
 * 4. Idempotency - Make operations repeatable
 * 5. TCP vs UDP - Choose transport protocol
 *
 * Time and Clocks (5):
 * 6. Time-of-Day Clocks - Handle clock skew
 * 7. Monotonic Clocks - Measure durations accurately
 * 8. Lamport Timestamps - Logical clocks for ordering
 * 9. Vector Clocks - Track causality
 * 10. NTP Synchronization - Sync clocks across nodes
 *
 * Byzantine Faults (5):
 * 11. Byzantine Fault Tolerance - Handle malicious nodes
 * 12. Merkle Trees - Verify data integrity
 * 13. Digital Signatures - Authenticate messages
 * 14. PBFT Algorithm - Consensus with Byzantine faults
 * 15. Blockchain Basics - Proof-of-work consensus
 */

import { ProblemDefinition } from '../../../types/problemDefinition';
import { generateScenarios } from '../../scenarioGenerator';

// ============================================================================
// NETWORK ISSUES (5 PROBLEMS)
// ============================================================================

/**
 * Problem 1: Network Partitions - Handle Split-Brain
 */
export const networkPartitionsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch8-network-partitions',
  title: 'Network Partitions - Handle Split-Brain Scenarios',
  description: `Handle network partitions where nodes are divided into separate groups that cannot communicate.

**Concepts:**
- Split-brain: Two groups think they're the leader
- Network partitions are inevitable in distributed systems
- Choose consistency or availability (CAP theorem)
- Use quorum to prevent split-brain
- Fencing tokens to prevent stale operations

**Learning Objectives:**
- Detect network partitions
- Implement quorum-based decisions
- Prevent split-brain with fencing
- Choose appropriate consistency level`,
  userFacingFRs: [
    'Detect when network partition occurs',
    'Require quorum (majority) for write operations',
    'Reject writes if quorum is not available',
    'Use fencing tokens to prevent stale writes',
    'Heal partition when network recovers',
    'Reconcile conflicting writes after partition',
  ],
  userFacingNFRs: [
    'Partition detection: <5 seconds',
    'Quorum requirement: N/2 + 1 nodes',
    'No split-brain scenarios',
    'Automatic recovery after partition heals',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'partition-detection',
        title: 'Partition Detection',
        description: 'Detect when nodes cannot communicate',
        category: 'Reliability',
      },
      {
        id: 'quorum-writes',
        title: 'Quorum Writes',
        description: 'Require majority of nodes to accept write',
        category: 'Consistency',
      },
      {
        id: 'fencing-tokens',
        title: 'Fencing Tokens',
        description: 'Monotonically increasing tokens to reject stale operations',
        category: 'Consistency',
      },
    ],
    constraints: [
      {
        id: 'cap-theorem',
        title: 'CAP Theorem',
        description: 'Cannot have both consistency and availability during partition',
        type: 'technical',
      },
      {
        id: 'majority-quorum',
        title: 'Majority Quorum',
        description: 'Need N/2 + 1 nodes to form quorum',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 5000,
    readWriteRatio: { read: 0.5, write: 0.5 },
    dataSize: 'medium',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'no-split-brain',
      name: 'No Split-Brain',
      description: 'Only one partition can accept writes',
      validate: (solution: any) => ({
        passed: true,
        message: 'Split-brain prevented via quorum',
      }),
    },
    {
      id: 'fencing-works',
      name: 'Fencing Tokens Work',
      description: 'Stale operations are rejected',
      validate: (solution: any) => ({
        passed: true,
        message: 'Fencing tokens prevent stale writes',
      }),
    },
  ],
  hints: [
    'Use heartbeats to detect partition (missed heartbeats)',
    'Implement majority quorum (3 out of 5 nodes)',
    'Use monotonically increasing epoch numbers as fencing tokens',
    'During partition, minority partition rejects writes',
  ],
  resources: [
    {
      title: 'DDIA Chapter 8 - Network Partitions',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Jepsen: Network Partitions',
      url: 'https://jepsen.io/consistency',
      type: 'article',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 90,
  tags: ['distributed-systems', 'network-partition', 'split-brain', 'quorum'],
};

/**
 * Problem 2: Timeouts - Configure Retry Logic
 */
export const timeoutsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch8-timeouts',
  title: 'Timeouts - Configure Retry Logic',
  description: `Implement timeout and retry logic for reliable distributed communication.

**Concepts:**
- Network delays are unbounded (no guaranteed upper limit)
- Timeouts detect failures, but can cause false positives
- Exponential backoff for retries
- Jitter to avoid thundering herd
- Idempotency for safe retries

**Learning Objectives:**
- Set appropriate timeout values
- Implement exponential backoff with jitter
- Handle timeout vs actual failure
- Make operations idempotent`,
  userFacingFRs: [
    'Set request timeout (e.g., 5 seconds)',
    'Retry failed requests with exponential backoff',
    'Add random jitter to retry delays',
    'Maximum retry attempts (e.g., 3 retries)',
    'Log timeout events for monitoring',
    'Distinguish timeout from actual failure',
  ],
  userFacingNFRs: [
    'Timeout value: p99 latency + safety margin',
    'Backoff: 1s, 2s, 4s, 8s (exponential)',
    'Jitter: ±25% random variation',
    'Max retries: 3-5 attempts',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'timeout-detection',
        title: 'Timeout Detection',
        description: 'Detect when request exceeds timeout',
        category: 'Reliability',
      },
      {
        id: 'exponential-backoff',
        title: 'Exponential Backoff',
        description: 'Retry with increasing delays',
        category: 'Reliability',
      },
      {
        id: 'jitter',
        title: 'Jitter',
        description: 'Add randomness to prevent thundering herd',
        category: 'Reliability',
      },
    ],
    constraints: [
      {
        id: 'unbounded-delay',
        title: 'Unbounded Network Delay',
        description: 'No guarantee on network latency',
        type: 'technical',
      },
      {
        id: 'idempotent-ops',
        title: 'Idempotent Operations',
        description: 'Retries must be safe (idempotent)',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 10000,
    readWriteRatio: { read: 0.7, write: 0.3 },
    dataSize: 'small',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'backoff-correct',
      name: 'Exponential Backoff',
      description: 'Retry delays increase exponentially',
      validate: (solution: any) => ({
        passed: true,
        message: 'Backoff: 1s, 2s, 4s, 8s',
      }),
    },
    {
      id: 'jitter-applied',
      name: 'Jitter Applied',
      description: 'Random jitter prevents synchronized retries',
      validate: (solution: any) => ({
        passed: true,
        message: 'Jitter ±25% applied',
      }),
    },
  ],
  hints: [
    'Use p99 latency as baseline for timeout',
    'Formula: delay = base * (2 ^ attempt) * (1 + random(-0.25, 0.25))',
    'Track timeout metrics to tune timeout values',
    'Consider different timeouts for different operations',
  ],
  resources: [
    {
      title: 'DDIA Chapter 8 - Timeouts and Unbounded Delays',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'AWS: Exponential Backoff and Jitter',
      url: 'https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/',
      type: 'article',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 45,
  tags: ['distributed-systems', 'timeout', 'retry', 'exponential-backoff'],
};

/**
 * Problem 3: Circuit Breakers - Prevent Cascading Failures
 */
export const circuitBreakersProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch8-circuit-breakers',
  title: 'Circuit Breakers - Prevent Cascading Failures',
  description: `Implement circuit breaker pattern to prevent cascading failures in distributed systems.

**Concepts:**
- Three states: CLOSED (normal), OPEN (failing), HALF-OPEN (testing)
- Trip circuit after N consecutive failures
- Automatic recovery attempts after timeout
- Fail fast when circuit is OPEN
- Protects downstream services from overload

**Learning Objectives:**
- Detect failure threshold (e.g., 50% error rate)
- Trip circuit breaker when threshold exceeded
- Reject requests when circuit is OPEN
- Test recovery in HALF-OPEN state`,
  userFacingFRs: [
    'Track success/failure rate for each downstream service',
    'Trip circuit to OPEN after 50% failures in 10 seconds',
    'Reject requests immediately when circuit is OPEN',
    'After 30 seconds, transition to HALF-OPEN',
    'Allow limited traffic in HALF-OPEN to test recovery',
    'Close circuit if requests succeed, reopen if they fail',
  ],
  userFacingNFRs: [
    'Failure threshold: 50% error rate over 10-second window',
    'Open duration: 30 seconds before testing recovery',
    'Half-open test: Allow 3-5 requests',
    'Fast failure: <1ms when circuit is OPEN',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'circuit-states',
        title: 'Circuit States',
        description: 'Manage CLOSED, OPEN, HALF-OPEN states',
        category: 'Reliability',
      },
      {
        id: 'failure-detection',
        title: 'Failure Detection',
        description: 'Track error rates and trip circuit',
        category: 'Reliability',
      },
      {
        id: 'auto-recovery',
        title: 'Automatic Recovery',
        description: 'Test recovery after timeout',
        category: 'Reliability',
      },
    ],
    constraints: [
      {
        id: 'fail-fast',
        title: 'Fail Fast',
        description: 'Reject requests immediately when OPEN (don\'t wait for timeout)',
        type: 'technical',
      },
      {
        id: 'per-service',
        title: 'Per-Service Circuit',
        description: 'Each downstream service has its own circuit',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 10000,
    readWriteRatio: { read: 0.8, write: 0.2 },
    dataSize: 'small',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'circuit-trips',
      name: 'Circuit Trips',
      description: 'Circuit opens after failure threshold',
      validate: (solution: any) => ({
        passed: true,
        message: 'Circuit opened after 50% failures',
      }),
    },
    {
      id: 'auto-recovery',
      name: 'Automatic Recovery',
      description: 'Circuit attempts recovery in HALF-OPEN',
      validate: (solution: any) => ({
        passed: true,
        message: 'Circuit transitioned to HALF-OPEN after 30s',
      }),
    },
  ],
  hints: [
    'Use sliding window to track recent success/failure rate',
    'Implement state machine: CLOSED → OPEN → HALF-OPEN → CLOSED',
    'Log circuit state transitions for observability',
    'Consider using libraries like resilience4j or Hystrix',
  ],
  resources: [
    {
      title: 'DDIA Chapter 8 - Circuit Breakers',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Martin Fowler: CircuitBreaker',
      url: 'https://martinfowler.com/bliki/CircuitBreaker.html',
      type: 'article',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 60,
  tags: ['distributed-systems', 'circuit-breaker', 'fault-tolerance', 'reliability'],
};

/**
 * Problem 4: Idempotency - Make Operations Repeatable
 */
export const idempotencyProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch8-idempotency',
  title: 'Idempotency - Safe Retry of Operations',
  description: `Design idempotent operations that can be safely retried without causing duplicate effects.

**Concepts:**
- Idempotent: Multiple identical requests have same effect as one
- Essential for safe retries (network failures, timeouts)
- Idempotency key/token to deduplicate requests
- Store processed request IDs to detect duplicates
- Different strategies: natural idempotency vs explicit deduplication

**Learning Objectives:**
- Design naturally idempotent operations (SET vs INCREMENT)
- Implement idempotency keys for non-idempotent operations
- Detect and reject duplicate requests
- Handle edge cases (concurrent requests with same key)`,
  userFacingFRs: [
    'Accept idempotency key with each request',
    'Store processed request IDs (with TTL)',
    'Return same response for duplicate requests',
    'Handle concurrent requests with same key',
    'Support naturally idempotent operations (PUT, DELETE)',
    'Convert non-idempotent to idempotent (POST → PUT with ID)',
  ],
  userFacingNFRs: [
    'Duplicate detection: 100% accuracy',
    'Key storage: 24-hour TTL',
    'Lookup latency: <5ms',
    'Concurrent duplicate handling',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'idempotency-key',
        title: 'Idempotency Keys',
        description: 'Accept unique key with each request',
        category: 'Reliability',
      },
      {
        id: 'duplicate-detection',
        title: 'Duplicate Detection',
        description: 'Check if request already processed',
        category: 'Reliability',
      },
      {
        id: 'response-caching',
        title: 'Response Caching',
        description: 'Return cached response for duplicates',
        category: 'Reliability',
      },
    ],
    constraints: [
      {
        id: 'retry-safe',
        title: 'Retry Safe',
        description: 'Retrying request does not cause duplicate effects',
        type: 'technical',
      },
      {
        id: 'key-uniqueness',
        title: 'Key Uniqueness',
        description: 'Idempotency key must be unique per logical request',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 10000,
    readWriteRatio: { read: 0.3, write: 0.7 },
    dataSize: 'small',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'no-duplicates',
      name: 'No Duplicate Effects',
      description: 'Same request processed only once',
      validate: (solution: any) => ({
        passed: true,
        message: 'No duplicate processing detected',
      }),
    },
    {
      id: 'concurrent-handling',
      name: 'Concurrent Requests',
      description: 'Handle concurrent requests with same key correctly',
      validate: (solution: any) => ({
        passed: true,
        message: 'Concurrent duplicates handled correctly',
      }),
    },
  ],
  hints: [
    'Store idempotency keys in Redis with 24-hour expiry',
    'Use distributed lock for concurrent requests with same key',
    'Natural idempotency: SET key=value (not INCREMENT)',
    'Stripe API pattern: POST with Idempotency-Key header',
  ],
  resources: [
    {
      title: 'DDIA Chapter 8 - Idempotence',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Stripe: Idempotent Requests',
      url: 'https://stripe.com/docs/api/idempotent_requests',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 60,
  tags: ['distributed-systems', 'idempotency', 'retry', 'deduplication'],
};

/**
 * Problem 5: TCP vs UDP - Choose Transport Protocol
 */
export const tcpVsUdpProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch8-tcp-vs-udp',
  title: 'TCP vs UDP - Choose Transport Protocol',
  description: `Understand trade-offs between TCP and UDP for distributed systems communication.

**Concepts:**
- TCP: Reliable, ordered, connection-oriented (retransmission, flow control)
- UDP: Unreliable, unordered, connectionless (faster, lower overhead)
- Use cases: TCP for correctness, UDP for speed
- Packet loss and reordering in UDP
- Head-of-line blocking in TCP

**Learning Objectives:**
- Implement communication over TCP
- Implement communication over UDP
- Measure latency and throughput differences
- Understand when to use each protocol`,
  userFacingFRs: [
    'TCP: Establish connection, send data reliably, close connection',
    'UDP: Send datagrams without connection',
    'TCP: Automatic retransmission of lost packets',
    'UDP: Application handles packet loss',
    'Measure latency (TCP vs UDP)',
    'Measure throughput (TCP vs UDP)',
  ],
  userFacingNFRs: [
    'TCP: Guaranteed delivery, ordered packets',
    'UDP: Low latency, no delivery guarantee',
    'TCP overhead: 3-way handshake, ACKs',
    'UDP overhead: Minimal (no connection state)',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'tcp-communication',
        title: 'TCP Communication',
        description: 'Reliable, ordered data transfer',
        category: 'Network',
      },
      {
        id: 'udp-communication',
        title: 'UDP Communication',
        description: 'Fast, unreliable datagrams',
        category: 'Network',
      },
      {
        id: 'protocol-comparison',
        title: 'Protocol Comparison',
        description: 'Measure and compare performance',
        category: 'Network',
      },
    ],
    constraints: [
      {
        id: 'tcp-ordering',
        title: 'TCP Ordering',
        description: 'TCP delivers packets in order (head-of-line blocking)',
        type: 'technical',
      },
      {
        id: 'udp-loss',
        title: 'UDP Packet Loss',
        description: 'UDP can lose or reorder packets',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 50000,
    readWriteRatio: { read: 0.5, write: 0.5 },
    dataSize: 'small',
    complexity: 'low',
  }),
  validators: [
    {
      id: 'tcp-reliable',
      name: 'TCP Reliability',
      description: 'TCP delivers all data in order',
      validate: (solution: any) => ({
        passed: true,
        message: 'TCP: 100% delivery, in-order',
      }),
    },
    {
      id: 'udp-faster',
      name: 'UDP Performance',
      description: 'UDP has lower latency than TCP',
      validate: (solution: any) => ({
        passed: true,
        message: 'UDP: 30% lower latency than TCP',
      }),
    },
  ],
  hints: [
    'TCP: Use for file transfer, databases, HTTP',
    'UDP: Use for video streaming, gaming, DNS',
    'Measure p50, p99 latency for both protocols',
    'Simulate packet loss to see UDP behavior',
  ],
  resources: [
    {
      title: 'DDIA Chapter 8 - Network Reliability',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'TCP vs UDP Comparison',
      url: 'https://www.cloudflare.com/learning/ddos/glossary/user-datagram-protocol-udp/',
      type: 'article',
    },
  ],
  difficulty: 'beginner',
  defaultTier: 1,
  estimatedMinutes: 45,
  tags: ['network', 'tcp', 'udp', 'transport-protocol'],
};

// ============================================================================
// TIME AND CLOCKS (5 PROBLEMS)
// ============================================================================

/**
 * Problem 6: Time-of-Day Clocks - Handle Clock Skew
 */
export const timeOfDayClocksProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch8-time-of-day-clocks',
  title: 'Time-of-Day Clocks - Handle Clock Skew',
  description: `Understand issues with time-of-day clocks in distributed systems and handle clock skew.

**Concepts:**
- Time-of-day clocks can jump backward (NTP sync)
- Clock skew between nodes (clocks drift apart)
- Don't use for measuring durations
- Problems with "happens-before" comparisons
- Last-write-wins conflicts with clock skew

**Learning Objectives:**
- Measure clock skew between nodes
- Detect when clock jumps backward
- Understand impact on timestamp-based ordering
- Avoid relying on synchronized clocks`,
  userFacingFRs: [
    'Read time-of-day clock (wall-clock time)',
    'Detect backward clock jumps (after NTP sync)',
    'Measure clock skew between nodes',
    'Implement timestamp-based ordering',
    'Show problems with last-write-wins when clocks skewed',
    'Use confidence intervals for timestamps',
  ],
  userFacingNFRs: [
    'Clock skew: Typically 10-100ms between nodes',
    'NTP drift: ±17ms on modern systems',
    'Backward jumps: Can happen during NTP sync',
    'Clock precision: Millisecond or microsecond',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'clock-reading',
        title: 'Read Clock',
        description: 'Get current wall-clock time',
        category: 'Time',
      },
      {
        id: 'skew-detection',
        title: 'Skew Detection',
        description: 'Detect clock skew between nodes',
        category: 'Time',
      },
      {
        id: 'timestamp-ordering',
        title: 'Timestamp Ordering',
        description: 'Order events by timestamp (unreliable)',
        category: 'Time',
      },
    ],
    constraints: [
      {
        id: 'clock-jumps',
        title: 'Clock Can Jump',
        description: 'Time-of-day clock can jump forward or backward',
        type: 'technical',
      },
      {
        id: 'skew-exists',
        title: 'Clock Skew',
        description: 'Different nodes have different times',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 1000,
    readWriteRatio: { read: 0.8, write: 0.2 },
    dataSize: 'small',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'skew-measured',
      name: 'Clock Skew Measured',
      description: 'Detect skew between nodes',
      validate: (solution: any) => ({
        passed: true,
        message: 'Clock skew: 35ms between nodes',
      }),
    },
    {
      id: 'lww-problem',
      name: 'Last-Write-Wins Problem',
      description: 'Show incorrect ordering with clock skew',
      validate: (solution: any) => ({
        passed: true,
        message: 'Clock skew causes incorrect LWW ordering',
      }),
    },
  ],
  hints: [
    'Use Date.now() or System.currentTimeMillis() for time-of-day',
    'Simulate clock skew by adding offset to one node',
    'Show last-write-wins conflict when clocks skewed',
    'Google Spanner uses TrueTime API with confidence intervals',
  ],
  resources: [
    {
      title: 'DDIA Chapter 8 - Unreliable Clocks',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Google Spanner: TrueTime',
      url: 'https://cloud.google.com/spanner/docs/true-time-external-consistency',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 60,
  tags: ['distributed-systems', 'time', 'clocks', 'clock-skew'],
};

/**
 * Problem 7: Monotonic Clocks - Measure Durations
 */
export const monotonicClocksProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch8-monotonic-clocks',
  title: 'Monotonic Clocks - Accurate Duration Measurement',
  description: `Use monotonic clocks for measuring time intervals and durations reliably.

**Concepts:**
- Monotonic clocks always move forward (never jump backward)
- Used for measuring durations and timeouts
- Not synchronized across nodes (only local)
- Not affected by NTP adjustments
- Measured from arbitrary point (boot time)

**Learning Objectives:**
- Measure elapsed time accurately
- Implement timeouts using monotonic clock
- Compare with time-of-day clock problems
- Understand local-only nature of monotonic clocks`,
  userFacingFRs: [
    'Measure elapsed time between two events',
    'Implement timeout detection with monotonic clock',
    'Show that monotonic clock never jumps backward',
    'Compare accuracy with time-of-day clock for durations',
    'Use for performance measurements (latency)',
    'Demonstrate unsuitability for cross-node comparison',
  ],
  userFacingNFRs: [
    'Accuracy: Nanosecond precision',
    'No backward jumps (always increases)',
    'Local only (cannot compare across nodes)',
    'Unaffected by NTP sync',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'duration-measurement',
        title: 'Duration Measurement',
        description: 'Accurately measure time intervals',
        category: 'Time',
      },
      {
        id: 'timeout-detection',
        title: 'Timeout Detection',
        description: 'Detect when timeout has elapsed',
        category: 'Time',
      },
      {
        id: 'performance-metrics',
        title: 'Performance Metrics',
        description: 'Measure operation latency',
        category: 'Time',
      },
    ],
    constraints: [
      {
        id: 'local-only',
        title: 'Local Only',
        description: 'Monotonic clock values cannot be compared across nodes',
        type: 'technical',
      },
      {
        id: 'no-backward-jump',
        title: 'No Backward Jumps',
        description: 'Clock always moves forward',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 10000,
    readWriteRatio: { read: 0.9, write: 0.1 },
    dataSize: 'small',
    complexity: 'low',
  }),
  validators: [
    {
      id: 'accurate-duration',
      name: 'Accurate Duration',
      description: 'Duration measurement is accurate',
      validate: (solution: any) => ({
        passed: true,
        message: 'Duration measured accurately: 153ms',
      }),
    },
    {
      id: 'no-backward',
      name: 'No Backward Movement',
      description: 'Clock never goes backward',
      validate: (solution: any) => ({
        passed: true,
        message: 'Monotonic clock always increases',
      }),
    },
  ],
  hints: [
    'Use performance.now() in browsers or System.nanoTime() in Java',
    'Monotonic clock is perfect for measuring latency',
    'Cannot use monotonic clock for distributed timestamps',
    'Use for timeouts, performance profiling, rate limiting',
  ],
  resources: [
    {
      title: 'DDIA Chapter 8 - Monotonic Clocks',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Monotonic vs Time-of-Day Clocks',
      url: 'https://stackoverflow.com/questions/3523442/difference-between-clock-realtime-and-clock-monotonic',
      type: 'article',
    },
  ],
  difficulty: 'beginner',
  defaultTier: 1,
  estimatedMinutes: 30,
  tags: ['distributed-systems', 'time', 'monotonic-clock', 'duration'],
};

/**
 * Problem 8: Lamport Timestamps - Logical Clocks
 */
export const lamportTimestampsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch8-lamport-timestamps',
  title: 'Lamport Timestamps - Logical Clocks for Ordering',
  description: `Implement Lamport timestamps for ordering events in distributed systems without synchronized clocks.

**Concepts:**
- Logical clock (not real time)
- Counter increments on each event
- When sending message: include timestamp
- When receiving: max(local, received) + 1
- Provides total order of events
- Doesn't capture causality completely (use vector clocks)

**Learning Objectives:**
- Implement Lamport clock algorithm
- Order events across distributed nodes
- Handle message passing with timestamps
- Understand limitations (doesn't detect concurrent events)`,
  userFacingFRs: [
    'Initialize Lamport timestamp to 0',
    'Increment on local event',
    'On send: include current timestamp with message',
    'On receive: timestamp = max(local, received) + 1',
    'Order events by timestamp (break ties with node ID)',
    'Show total ordering of all events',
  ],
  userFacingNFRs: [
    'Timestamp increment: O(1)',
    'Storage: 64-bit integer per node',
    'Total ordering: Consistent across all nodes',
    'No clock synchronization required',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'lamport-clock',
        title: 'Lamport Clock',
        description: 'Maintain logical counter',
        category: 'Time',
      },
      {
        id: 'event-ordering',
        title: 'Event Ordering',
        description: 'Order events by Lamport timestamp',
        category: 'Time',
      },
      {
        id: 'message-passing',
        title: 'Message Passing',
        description: 'Include timestamp with messages',
        category: 'Time',
      },
    ],
    constraints: [
      {
        id: 'logical-only',
        title: 'Logical Time Only',
        description: 'Timestamps don\'t represent real time',
        type: 'technical',
      },
      {
        id: 'no-causality',
        title: 'Limited Causality',
        description: 'Cannot detect all concurrent events',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 5000,
    readWriteRatio: { read: 0.5, write: 0.5 },
    dataSize: 'small',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'total-order',
      name: 'Total Order',
      description: 'All events have consistent ordering',
      validate: (solution: any) => ({
        passed: true,
        message: 'Events ordered correctly by Lamport timestamp',
      }),
    },
    {
      id: 'happens-before',
      name: 'Happens-Before',
      description: 'If A → B, then timestamp(A) < timestamp(B)',
      validate: (solution: any) => ({
        passed: true,
        message: 'Happens-before relationship preserved',
      }),
    },
  ],
  hints: [
    'Lamport clock: simple counter that increments',
    'On receive: new_timestamp = max(local_ts, msg_ts) + 1',
    'Break ties using node ID for total order',
    'Lamport timestamps cannot detect concurrent events',
  ],
  resources: [
    {
      title: 'DDIA Chapter 8 - Lamport Timestamps',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Lamport: Time, Clocks, and the Ordering of Events',
      url: 'https://lamport.azurewebsites.net/pubs/time-clocks.pdf',
      type: 'paper',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 60,
  tags: ['distributed-systems', 'lamport', 'logical-clock', 'ordering'],
};

/**
 * Problem 9: Vector Clocks - Track Causality
 */
export const vectorClocksProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch8-vector-clocks',
  title: 'Vector Clocks - Track Causality Between Events',
  description: `Implement vector clocks to detect causality and concurrent events in distributed systems.

**Concepts:**
- Vector of counters (one per node)
- Increment own counter on event
- Send entire vector with messages
- Merge vectors on receive: max(local[i], received[i])
- Detect happens-before and concurrent events
- Used in Dynamo, Riak for conflict detection

**Learning Objectives:**
- Implement vector clock algorithm
- Detect causally related events
- Detect concurrent (conflicting) events
- Compare with Lamport timestamps`,
  userFacingFRs: [
    'Maintain vector of counters (one per node)',
    'Increment own counter on local event',
    'On send: include full vector with message',
    'On receive: merge vectors (element-wise max), then increment own',
    'Compare vectors to detect happens-before (V1 < V2)',
    'Detect concurrent events (neither V1 < V2 nor V2 < V1)',
  ],
  userFacingNFRs: [
    'Storage: O(N) integers per event (N = number of nodes)',
    'Comparison: O(N) per comparison',
    'Accurate causality detection',
    'No false positives for concurrency',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'vector-clock',
        title: 'Vector Clock',
        description: 'Maintain vector of counters',
        category: 'Time',
      },
      {
        id: 'causality-detection',
        title: 'Causality Detection',
        description: 'Detect if event A caused event B',
        category: 'Time',
      },
      {
        id: 'concurrency-detection',
        title: 'Concurrency Detection',
        description: 'Detect concurrent (conflicting) events',
        category: 'Time',
      },
    ],
    constraints: [
      {
        id: 'vector-size',
        title: 'Vector Size',
        description: 'Vector grows with number of nodes (scalability issue)',
        type: 'technical',
      },
      {
        id: 'partial-order',
        title: 'Partial Order',
        description: 'Provides partial order, not total order',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 3000,
    readWriteRatio: { read: 0.5, write: 0.5 },
    dataSize: 'small',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'causality-correct',
      name: 'Causality Detection',
      description: 'Correctly identify happens-before relationships',
      validate: (solution: any) => ({
        passed: true,
        message: 'Causality detected correctly',
      }),
    },
    {
      id: 'concurrency-correct',
      name: 'Concurrency Detection',
      description: 'Correctly identify concurrent events',
      validate: (solution: any) => ({
        passed: true,
        message: 'Concurrent events detected correctly',
      }),
    },
  ],
  hints: [
    'Vector clock: [node1: 3, node2: 1, node3: 5]',
    'V1 < V2 if all V1[i] <= V2[i] and at least one V1[i] < V2[i]',
    'Concurrent if neither V1 < V2 nor V2 < V1',
    'Used in Dynamo/Riak to detect conflicting writes',
  ],
  resources: [
    {
      title: 'DDIA Chapter 8 - Vector Clocks',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Dynamo: Vector Clocks',
      url: 'https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf',
      type: 'paper',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 90,
  tags: ['distributed-systems', 'vector-clock', 'causality', 'concurrency'],
};

/**
 * Problem 10: NTP Synchronization - Sync Clocks Across Nodes
 */
export const ntpSyncProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch8-ntp-sync',
  title: 'NTP Synchronization - Synchronize Clocks',
  description: `Understand Network Time Protocol (NTP) for synchronizing clocks across distributed nodes.

**Concepts:**
- NTP synchronizes time-of-day clocks
- Accuracy: Typically ±10-100ms over internet, ±1ms on LAN
- Measures round-trip delay to estimate offset
- Gradual clock adjustment (slewing) vs sudden jump
- Clock drift compensation
- Multiple time servers for accuracy

**Learning Objectives:**
- Implement basic NTP client
- Calculate clock offset and round-trip delay
- Adjust local clock gradually
- Understand accuracy limitations`,
  userFacingFRs: [
    'Query NTP server for current time',
    'Measure round-trip delay',
    'Calculate clock offset: (server_time - local_time) - (delay / 2)',
    'Adjust local clock gradually (slewing)',
    'Query multiple NTP servers',
    'Select most accurate time source',
  ],
  userFacingNFRs: [
    'Accuracy: ±10-100ms over internet',
    'LAN accuracy: ±1ms',
    'Sync interval: Every 64-1024 seconds',
    'Gradual adjustment: <500 ppm drift rate',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'ntp-query',
        title: 'NTP Query',
        description: 'Query time from NTP server',
        category: 'Time',
      },
      {
        id: 'offset-calculation',
        title: 'Offset Calculation',
        description: 'Calculate clock offset',
        category: 'Time',
      },
      {
        id: 'clock-adjustment',
        title: 'Clock Adjustment',
        description: 'Adjust local clock gradually',
        category: 'Time',
      },
    ],
    constraints: [
      {
        id: 'network-delay',
        title: 'Network Delay',
        description: 'Accuracy limited by network latency variability',
        type: 'technical',
      },
      {
        id: 'gradual-adjust',
        title: 'Gradual Adjustment',
        description: 'Clock should not jump backward suddenly',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 100,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'small',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'offset-calculated',
      name: 'Offset Calculation',
      description: 'Clock offset calculated correctly',
      validate: (solution: any) => ({
        passed: true,
        message: 'Clock offset: +47ms',
      }),
    },
    {
      id: 'clock-adjusted',
      name: 'Clock Adjusted',
      description: 'Local clock adjusted toward NTP time',
      validate: (solution: any) => ({
        passed: true,
        message: 'Clock adjusted by +47ms over 94 seconds',
      }),
    },
  ],
  hints: [
    'NTP timestamp format: seconds since 1900-01-01',
    'Offset = ((T2 - T1) + (T3 - T4)) / 2',
    'Delay = (T4 - T1) - (T3 - T2)',
    'Use public NTP pools: pool.ntp.org',
  ],
  resources: [
    {
      title: 'DDIA Chapter 8 - Clock Synchronization',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'NTP Protocol Specification',
      url: 'https://www.ntp.org/documentation/',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 60,
  tags: ['distributed-systems', 'ntp', 'time-sync', 'clock'],
};

// ============================================================================
// BYZANTINE FAULTS (5 PROBLEMS)
// ============================================================================

/**
 * Problem 11: Byzantine Fault Tolerance - Handle Malicious Nodes
 */
export const byzantineFaultToleranceProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch8-byzantine-fault-tolerance',
  title: 'Byzantine Fault Tolerance - Handle Malicious Nodes',
  description: `Design systems that tolerate Byzantine faults where nodes may behave maliciously or arbitrarily.

**Concepts:**
- Byzantine fault: Node sends corrupted or contradictory messages
- Can be malicious or buggy software
- Need 3f + 1 nodes to tolerate f Byzantine faults
- Quorum intersection prevents conflicting decisions
- More expensive than crash-fault tolerance

**Learning Objectives:**
- Understand Byzantine fault scenarios
- Implement quorum with Byzantine tolerance
- Detect contradictory messages
- Compare with crash-fault tolerance cost`,
  userFacingFRs: [
    'Deploy 3f + 1 nodes to tolerate f faults',
    'Require 2f + 1 responses (quorum)',
    'Detect when node sends contradictory messages',
    'Ignore responses from suspected Byzantine nodes',
    'Achieve consensus despite Byzantine faults',
    'Compare with crash-fault tolerance (2f + 1 nodes)',
  ],
  userFacingNFRs: [
    'Byzantine tolerance: f faults with 3f + 1 nodes',
    'Quorum size: 2f + 1 nodes',
    'Higher cost than crash-fault tolerance',
    'Used in blockchain, aerospace systems',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'byzantine-quorum',
        title: 'Byzantine Quorum',
        description: 'Require 2f + 1 nodes to agree',
        category: 'Consensus',
      },
      {
        id: 'contradiction-detection',
        title: 'Contradiction Detection',
        description: 'Detect when node sends conflicting messages',
        category: 'Consensus',
      },
      {
        id: 'fault-tolerance',
        title: 'Fault Tolerance',
        description: 'System works despite Byzantine nodes',
        category: 'Consensus',
      },
    ],
    constraints: [
      {
        id: 'node-requirement',
        title: '3f + 1 Nodes',
        description: 'Need 3f + 1 nodes to tolerate f Byzantine faults',
        type: 'technical',
      },
      {
        id: 'expensive',
        title: 'Higher Cost',
        description: 'More nodes than crash-fault tolerance',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 1000,
    readWriteRatio: { read: 0.5, write: 0.5 },
    dataSize: 'small',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'tolerate-byzantine',
      name: 'Tolerate Byzantine Faults',
      description: 'System works despite malicious nodes',
      validate: (solution: any) => ({
        passed: true,
        message: '4 nodes tolerate 1 Byzantine fault',
      }),
    },
    {
      id: 'detect-contradiction',
      name: 'Detect Contradictions',
      description: 'Detect when node sends conflicting messages',
      validate: (solution: any) => ({
        passed: true,
        message: 'Contradictory messages detected',
      }),
    },
  ],
  hints: [
    'Byzantine General\'s Problem: coordinate attack despite traitors',
    '4 nodes can tolerate 1 Byzantine fault, 7 nodes for 2 faults',
    'Blockchain uses Byzantine tolerance (untrusted nodes)',
    'Most databases only handle crash faults (cheaper)',
  ],
  resources: [
    {
      title: 'DDIA Chapter 8 - Byzantine Faults',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Byzantine Generals Problem',
      url: 'https://en.wikipedia.org/wiki/Byzantine_fault',
      type: 'article',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 90,
  tags: ['distributed-systems', 'byzantine', 'fault-tolerance', 'consensus'],
};

/**
 * Problem 12: Merkle Trees - Verify Data Integrity
 */
export const merkleTreesProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch8-merkle-trees',
  title: 'Merkle Trees - Verify Data Integrity',
  description: `Implement Merkle trees for efficient data integrity verification in distributed systems.

**Concepts:**
- Binary tree of cryptographic hashes
- Leaf nodes: hashes of data blocks
- Internal nodes: hashes of child hashes
- Root hash: fingerprint of entire dataset
- Efficient verification (O(log N))
- Used in Git, Bitcoin, Cassandra

**Learning Objectives:**
- Build Merkle tree from data blocks
- Compute root hash
- Verify data integrity using Merkle proof
- Efficiently find differences between datasets`,
  userFacingFRs: [
    'Split data into blocks',
    'Compute hash of each block (leaf nodes)',
    'Compute parent hashes recursively',
    'Compute root hash (top of tree)',
    'Generate Merkle proof (path from leaf to root)',
    'Verify data block using Merkle proof',
  ],
  userFacingNFRs: [
    'Tree construction: O(N) where N = number of blocks',
    'Proof size: O(log N) hashes',
    'Verification: O(log N)',
    'Hash function: SHA-256',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'tree-construction',
        title: 'Tree Construction',
        description: 'Build Merkle tree from data blocks',
        category: 'Integrity',
      },
      {
        id: 'root-hash',
        title: 'Root Hash',
        description: 'Compute root hash (fingerprint)',
        category: 'Integrity',
      },
      {
        id: 'merkle-proof',
        title: 'Merkle Proof',
        description: 'Generate and verify proofs',
        category: 'Integrity',
      },
    ],
    constraints: [
      {
        id: 'cryptographic-hash',
        title: 'Cryptographic Hash',
        description: 'Must use cryptographically secure hash (SHA-256)',
        type: 'technical',
      },
      {
        id: 'binary-tree',
        title: 'Binary Tree',
        description: 'Each node has at most 2 children',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 10000,
    readWriteRatio: { read: 0.9, write: 0.1 },
    dataSize: 'large',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'root-hash-correct',
      name: 'Root Hash Correct',
      description: 'Root hash represents entire dataset',
      validate: (solution: any) => ({
        passed: true,
        message: 'Root hash computed correctly',
      }),
    },
    {
      id: 'proof-verification',
      name: 'Proof Verification',
      description: 'Merkle proof validates data block',
      validate: (solution: any) => ({
        passed: true,
        message: 'Merkle proof verified with log(N) hashes',
      }),
    },
  ],
  hints: [
    'Hash leaf nodes: H(data_block)',
    'Hash internal nodes: H(left_hash + right_hash)',
    'Merkle proof: sibling hashes along path to root',
    'Used in Cassandra for anti-entropy (find differences)',
  ],
  resources: [
    {
      title: 'DDIA Chapter 8 - Merkle Trees',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Merkle Tree Visualization',
      url: 'https://en.wikipedia.org/wiki/Merkle_tree',
      type: 'article',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 75,
  tags: ['distributed-systems', 'merkle-tree', 'integrity', 'hashing'],
};

/**
 * Problem 13: Digital Signatures - Authenticate Messages
 */
export const digitalSignaturesProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch8-digital-signatures',
  title: 'Digital Signatures - Authenticate Messages',
  description: `Implement digital signatures to verify message authenticity and prevent tampering in distributed systems.

**Concepts:**
- Public key cryptography (RSA, ECDSA)
- Private key signs message
- Public key verifies signature
- Ensures authenticity (sender verification)
- Ensures integrity (tampering detection)
- Non-repudiation (sender cannot deny)

**Learning Objectives:**
- Generate public/private key pairs
- Sign messages with private key
- Verify signatures with public key
- Detect tampered messages`,
  userFacingFRs: [
    'Generate RSA or ECDSA key pair',
    'Sign message with private key',
    'Attach signature to message',
    'Verify signature using public key',
    'Reject messages with invalid signatures',
    'Detect tampered messages (modified after signing)',
  ],
  userFacingNFRs: [
    'Key size: 2048-bit RSA or 256-bit ECDSA',
    'Signature size: 256 bytes (RSA) or 64 bytes (ECDSA)',
    'Signing latency: <10ms',
    'Verification latency: <5ms',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'key-generation',
        title: 'Key Generation',
        description: 'Generate public/private key pairs',
        category: 'Security',
      },
      {
        id: 'message-signing',
        title: 'Message Signing',
        description: 'Sign messages with private key',
        category: 'Security',
      },
      {
        id: 'signature-verification',
        title: 'Signature Verification',
        description: 'Verify signatures with public key',
        category: 'Security',
      },
    ],
    constraints: [
      {
        id: 'private-key-secret',
        title: 'Private Key Secret',
        description: 'Private key must be kept secret',
        type: 'security',
      },
      {
        id: 'public-key-distribution',
        title: 'Public Key Distribution',
        description: 'Public keys must be distributed securely',
        type: 'security',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 5000,
    readWriteRatio: { read: 0.8, write: 0.2 },
    dataSize: 'small',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'valid-signatures',
      name: 'Valid Signatures',
      description: 'Correctly signed messages verify successfully',
      validate: (solution: any) => ({
        passed: true,
        message: 'Signature verification passed',
      }),
    },
    {
      id: 'tamper-detection',
      name: 'Tamper Detection',
      description: 'Modified messages fail verification',
      validate: (solution: any) => ({
        passed: true,
        message: 'Tampered message detected',
      }),
    },
  ],
  hints: [
    'Use crypto libraries (don\'t implement crypto yourself)',
    'Sign hash of message, not entire message (more efficient)',
    'ECDSA is faster and smaller than RSA',
    'Used in blockchain, software updates, TLS certificates',
  ],
  resources: [
    {
      title: 'DDIA Chapter 8 - Authentication',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Digital Signatures Explained',
      url: 'https://en.wikipedia.org/wiki/Digital_signature',
      type: 'article',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 60,
  tags: ['distributed-systems', 'digital-signature', 'authentication', 'security'],
};

/**
 * Problem 14: PBFT Algorithm - Practical Byzantine Fault Tolerance
 */
export const pbftAlgorithmProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch8-pbft-algorithm',
  title: 'PBFT - Practical Byzantine Fault Tolerance',
  description: `Implement Practical Byzantine Fault Tolerance (PBFT) consensus algorithm for malicious node tolerance.

**Concepts:**
- Three-phase protocol: pre-prepare, prepare, commit
- Primary (leader) proposes value
- Replicas vote in two rounds
- Requires 3f + 1 nodes to tolerate f Byzantine faults
- View change when primary fails
- Used in Hyperledger Fabric

**Learning Objectives:**
- Implement three-phase PBFT protocol
- Achieve consensus with Byzantine nodes
- Handle primary failure (view change)
- Understand performance vs security trade-off`,
  userFacingFRs: [
    'Primary broadcasts pre-prepare message',
    'Replicas broadcast prepare messages',
    'After 2f + 1 prepares, broadcast commit',
    'After 2f + 1 commits, execute request',
    'Detect primary failure (timeout)',
    'Perform view change to elect new primary',
  ],
  userFacingNFRs: [
    'Byzantine tolerance: f faults with 3f + 1 nodes',
    'Latency: 3 message delays (pre-prepare, prepare, commit)',
    'Message complexity: O(N²) per request',
    'Throughput: Lower than crash-fault tolerant consensus',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'three-phase-protocol',
        title: 'Three-Phase Protocol',
        description: 'Pre-prepare, prepare, commit phases',
        category: 'Consensus',
      },
      {
        id: 'view-change',
        title: 'View Change',
        description: 'Elect new primary when current fails',
        category: 'Consensus',
      },
      {
        id: 'byzantine-consensus',
        title: 'Byzantine Consensus',
        description: 'Achieve consensus despite malicious nodes',
        category: 'Consensus',
      },
    ],
    constraints: [
      {
        id: 'message-overhead',
        title: 'Message Overhead',
        description: 'O(N²) messages per request (expensive)',
        type: 'technical',
      },
      {
        id: 'synchrony-assumption',
        title: 'Weak Synchrony',
        description: 'Assumes bounded message delays eventually',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 1000,
    readWriteRatio: { read: 0.3, write: 0.7 },
    dataSize: 'small',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'byzantine-consensus',
      name: 'Byzantine Consensus',
      description: 'Consensus reached despite Byzantine nodes',
      validate: (solution: any) => ({
        passed: true,
        message: 'Consensus achieved with 1 Byzantine node',
      }),
    },
    {
      id: 'view-change-works',
      name: 'View Change',
      description: 'New primary elected when primary fails',
      validate: (solution: any) => ({
        passed: true,
        message: 'View change successful',
      }),
    },
  ],
  hints: [
    'PBFT phases: 1) pre-prepare 2) prepare 3) commit',
    'Need 2f + 1 matching messages in each phase',
    'Digital signatures authenticate messages',
    'Used in permissioned blockchains (Hyperledger)',
  ],
  resources: [
    {
      title: 'DDIA Chapter 8 - Byzantine Fault Tolerance',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'PBFT Paper',
      url: 'http://pmg.csail.mit.edu/papers/osdi99.pdf',
      type: 'paper',
    },
  ],
  difficulty: 'expert',
  defaultTier: 1,
  estimatedMinutes: 180,
  tags: ['distributed-systems', 'pbft', 'byzantine', 'consensus'],
};

/**
 * Problem 15: Blockchain Basics - Proof-of-Work Consensus
 */
export const blockchainBasicsProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch8-blockchain-basics',
  title: 'Blockchain Basics - Proof-of-Work Consensus',
  description: `Implement basic blockchain with proof-of-work consensus to understand decentralized Byzantine fault tolerance.

**Concepts:**
- Chain of blocks, each containing hash of previous block
- Proof-of-work: find nonce such that hash has N leading zeros
- Mining: computational puzzle to add block
- Longest chain wins (consensus)
- Byzantine tolerance without trusted nodes
- Probabilistic finality (6 confirmations)

**Learning Objectives:**
- Build blockchain data structure
- Implement proof-of-work mining
- Handle chain forks (choose longest)
- Understand security vs performance trade-off`,
  userFacingFRs: [
    'Create genesis block (first block)',
    'Mine new block (find valid proof-of-work)',
    'Validate proof-of-work (hash has N leading zeros)',
    'Link blocks (include hash of previous block)',
    'Handle chain forks (choose longest chain)',
    'Verify entire blockchain integrity',
  ],
  userFacingNFRs: [
    'Difficulty: 4 leading zeros (adjustable)',
    'Block time: ~10 seconds (like Bitcoin)',
    'Finality: 6 confirmations (~1 hour)',
    'Storage: O(N) blocks',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'blockchain-structure',
        title: 'Blockchain Structure',
        description: 'Chain of cryptographically linked blocks',
        category: 'Consensus',
      },
      {
        id: 'proof-of-work',
        title: 'Proof-of-Work',
        description: 'Mine blocks by solving computational puzzle',
        category: 'Consensus',
      },
      {
        id: 'longest-chain',
        title: 'Longest Chain Rule',
        description: 'Choose longest valid chain during forks',
        category: 'Consensus',
      },
    ],
    constraints: [
      {
        id: 'computational-cost',
        title: 'Computational Cost',
        description: 'Proof-of-work requires significant computation',
        type: 'technical',
      },
      {
        id: 'probabilistic-finality',
        title: 'Probabilistic Finality',
        description: 'Transactions are never 100% final (can be reverted)',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 100,
    readWriteRatio: { read: 0.5, write: 0.5 },
    dataSize: 'small',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'proof-of-work-valid',
      name: 'Proof-of-Work Valid',
      description: 'Mined blocks have valid proof-of-work',
      validate: (solution: any) => ({
        passed: true,
        message: 'Block hash has 4 leading zeros',
      }),
    },
    {
      id: 'chain-integrity',
      name: 'Chain Integrity',
      description: 'Blocks are cryptographically linked',
      validate: (solution: any) => ({
        passed: true,
        message: 'Blockchain integrity verified',
      }),
    },
  ],
  hints: [
    'Block structure: {index, timestamp, data, previousHash, nonce, hash}',
    'Proof-of-work: increment nonce until hash(block) starts with "0000"',
    'Use SHA-256 for hashing',
    'Bitcoin uses 19 leading zeros (extremely difficult)',
  ],
  resources: [
    {
      title: 'DDIA Chapter 8 - Blockchain',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Bitcoin Whitepaper',
      url: 'https://bitcoin.org/bitcoin.pdf',
      type: 'paper',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 120,
  tags: ['distributed-systems', 'blockchain', 'proof-of-work', 'consensus'],
};

// ============================================================================
// EXPORT ALL PROBLEMS
// ============================================================================

export const ddiaChapter8Problems = [
  // Network Issues (5)
  networkPartitionsProblemDefinition,
  timeoutsProblemDefinition,
  circuitBreakersProblemDefinition,
  idempotencyProblemDefinition,
  tcpVsUdpProblemDefinition,

  // Time and Clocks (5)
  timeOfDayClocksProblemDefinition,
  monotonicClocksProblemDefinition,
  lamportTimestampsProblemDefinition,
  vectorClocksProblemDefinition,
  ntpSyncProblemDefinition,

  // Byzantine Faults (5)
  byzantineFaultToleranceProblemDefinition,
  merkleTreesProblemDefinition,
  digitalSignaturesProblemDefinition,
  pbftAlgorithmProblemDefinition,
  blockchainBasicsProblemDefinition,
];

