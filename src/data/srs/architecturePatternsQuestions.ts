/**
 * Scenario Questions for Advanced Architecture Patterns
 *
 * CQRS, Event Sourcing, Saga, Circuit Breaker, and other Azure/Cloud patterns
 */

import { ScenarioQuestion } from '../../types/spacedRepetition';

export const architecturePatternsQuestions: ScenarioQuestion[] = [
  // ============================================================================
  // CQRS Pattern Questions
  // ============================================================================
  {
    id: 'cqrs-q1-ecommerce',
    conceptId: 'cqrs-pattern',
    scenario: {
      context: 'Building an e-commerce product catalog service',
      requirements: [
        'Product writes: 100 updates/minute (prices, inventory)',
        'Product reads: 10,000 queries/minute (browsing, search)',
        'Read queries need: full-text search, faceted filters, recommendations',
        'Write operations need: ACID transactions, inventory validation',
        'Eventual consistency acceptable (updates visible within 2 seconds)',
      ],
      constraints: [
        '100:1 read-to-write ratio',
        'Different optimization needs for reads vs writes',
      ],
      metrics: {
        'Read:Write Ratio': '100:1',
        'Read Query Complexity': 'Search, filters, aggregations',
        'Write Requirements': 'ACID, validation',
        'Consistency': 'Eventual (2 sec)',
      },
    },
    question: 'Would you use CQRS pattern for this e-commerce catalog? If so, how would you design the read and write models?',
    questionType: 'architecture_decision',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'CQRS separates read and write models',
          keywords: ['cqrs', 'separate', 'read model', 'write model', 'segregation'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'High read-to-write ratio favors CQRS',
          keywords: ['read-heavy', '100:1', 'read load', 'optimization'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Different optimization needs',
          keywords: ['optimize', 'different needs', 'search', 'acid'],
          weight: 0.8,
          mustMention: true,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Complexity vs Performance',
          options: [
            {
              name: 'CQRS',
              pros: ['Optimize reads separately', 'Scale reads independently', 'Use Elasticsearch for search', 'Use PostgreSQL for writes'],
              cons: ['Eventual consistency', 'Sync complexity', 'More infrastructure'],
            },
            {
              name: 'Single Model',
              pros: ['Simpler', 'Strong consistency'],
              cons: ['Cannot optimize reads/writes independently', 'Database bottleneck'],
            },
          ],
        },
      ],
      antipatterns: [
        'strong consistency for catalog',
        'single database for 100:1 ratio',
      ],
      optionalPoints: [
        'event-driven sync',
        'materialized views',
        'elasticsearch for reads',
      ],
    },
    explanation: `
**Recommended: YES, Use CQRS**

This is a textbook CQRS use case:

**Architecture**:

1. **Write Model** (Command Side):
   - PostgreSQL for product data
   - ACID transactions for inventory updates
   - Validation rules enforced
   - Publishes events on product changes

2. **Read Model** (Query Side):
   - Elasticsearch for product search
   - Optimized for full-text search, faceting, filtering
   - Denormalized data structure
   - Updated async from write model events

**Sync Mechanism**:
\`\`\`
Product Updated (Write Model)
  ↓
Publish ProductUpdated event
  ↓
Event Consumer updates Elasticsearch
  ↓
Read Model updated (within 2 seconds)
\`\`\`

**Benefits**:
- Writes use SQL for ACID
- Reads use Elasticsearch for fast search
- Scale read replicas independently
- 2-second lag acceptable for catalog

**When NOT to use CQRS**:
- 1:1 read-write ratio
- Strong consistency required everywhere
- Simple CRUD operations

Sources:
- [CQRS Pattern - Azure Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs)
- [When Should You Use CQRS?](https://blog.risingstack.com/when-to-use-cqrs/)
    `,
    difficulty: 'medium',
    estimatedTimeSeconds: 240,
    tags: ['cqrs', 'read-write-separation', 'ecommerce'],
    variationGroup: 'cqrs-pattern',
  },

  {
    id: 'cqrs-q2-analytics',
    conceptId: 'cqrs-pattern',
    scenario: {
      context: 'Building an analytics dashboard for application monitoring',
      requirements: [
        'Application emits 100K events per second',
        'Dashboard queries aggregate metrics (last hour, last day, last week)',
        'Complex analytical queries with grouping and aggregations',
        'Writes are fire-and-forget events',
        'Reads require pre-aggregated data for performance',
      ],
      constraints: [
        'Query latency must be <2 seconds',
        'Cannot run analytical queries on write database',
      ],
      metrics: {
        'Write Volume': '100K events/sec',
        'Query Type': 'Aggregations, grouping, time windows',
        'Read Latency': '<2 seconds',
      },
    },
    question: 'Should you use CQRS for this analytics system? Design the read and write paths.',
    questionType: 'architecture_decision',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Separate write and read optimizations',
          keywords: ['separate', 'optimize', 'write path', 'read path'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Materialized views for analytics',
          keywords: ['materialized view', 'pre-aggregate', 'pre-compute'],
          weight: 0.9,
          mustMention: true,
        },
        {
          concept: 'Different databases for different needs',
          keywords: ['different database', 'kafka', 'time-series', 'clickhouse'],
          weight: 0.7,
          mustMention: false,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Write Optimization vs Read Optimization',
          options: [
            {
              name: 'CQRS Architecture',
              pros: ['High-throughput writes', 'Optimized analytical reads', 'Independent scaling'],
              cons: ['Eventual consistency', 'Sync complexity'],
            },
            {
              name: 'Single Database',
              pros: ['Simpler'],
              cons: ['Cannot handle 100K writes/sec and complex analytics', 'Performance bottleneck'],
            },
          ],
        },
      ],
      antipatterns: [
        'run analytics on write database',
        'real-time aggregation at query time',
      ],
      optionalPoints: [
        'stream processing',
        'lambda architecture',
        'druid or clickhouse',
      ],
    },
    explanation: `
**Recommended: YES, CQRS + Stream Processing**

**Architecture**:

1. **Write Path** (Command Side):
   - Kafka ingests 100K events/sec
   - Fast, append-only writes
   - No query load

2. **Processing Layer**:
   - Kafka Streams or Flink
   - Pre-aggregates metrics in time windows
   - Computes hourly/daily rollups

3. **Read Path** (Query Side):
   - Time-series DB (ClickHouse, Druid, TimescaleDB)
   - Stores pre-aggregated metrics
   - Optimized for analytical queries

**Flow**:
\`\`\`
Events (100K/sec) → Kafka → Stream Processing → Aggregated Metrics → Analytics DB → Dashboard
\`\`\`

**Why CQRS**:
- Write side optimized for high throughput (Kafka)
- Read side optimized for analytics (ClickHouse)
- Pre-aggregation makes queries <2sec

**Without CQRS**: Running analytical queries on 100K events/sec would crush any database.

Sources:
- [CQRS Design Pattern: Optimize Microservices with High Read Load](https://dip-mazumder.medium.com/optimize-microservices-with-high-read-load-cqrs-design-pattern-0c53793179e3)
- [Materialized View Pattern - Azure](https://learn.microsoft.com/en-us/azure/architecture/patterns/materialized-view)
    `,
    difficulty: 'hard',
    estimatedTimeSeconds: 260,
    tags: ['cqrs', 'analytics', 'stream-processing'],
    variationGroup: 'cqrs-pattern',
  },

  // ============================================================================
  // Event Sourcing Questions
  // ============================================================================
  {
    id: 'event-sourcing-q1-banking',
    conceptId: 'event-sourcing',
    scenario: {
      context: 'Building a banking system for account transactions',
      requirements: [
        'Track every account transaction (deposit, withdrawal, transfer)',
        'Support audit trails for compliance (must show all historical changes)',
        'Ability to replay account state at any point in time',
        'Handle disputes by examining exact sequence of transactions',
        'Current account balance must be queryable quickly',
      ],
      constraints: [
        'Financial regulations require complete audit trail',
        'Cannot delete or modify historical transactions',
      ],
      metrics: {
        'Audit Requirement': 'Complete history',
        'Replay': 'Must support',
        'Immutability': 'Required',
      },
    },
    question: 'Should you use Event Sourcing for this banking system? How would you design it?',
    questionType: 'architecture_decision',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Event Sourcing stores state as events',
          keywords: ['event sourcing', 'events', 'state changes', 'event log'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Immutable event log for audit trail',
          keywords: ['immutable', 'audit', 'audit trail', 'compliance'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Replay capability',
          keywords: ['replay', 'reconstruct', 'historical state'],
          weight: 0.9,
          mustMention: true,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Event Sourcing vs Traditional CRUD',
          options: [
            {
              name: 'Event Sourcing',
              pros: ['Complete audit trail', 'Replay capability', 'Immutable history', 'Temporal queries'],
              cons: ['More complex', 'Need projections for current state', 'Event schema evolution'],
            },
            {
              name: 'CRUD',
              pros: ['Simpler', 'Direct state access'],
              cons: ['Lost history', 'Cannot replay', 'Difficult auditing'],
            },
          ],
        },
      ],
      antipatterns: [
        'update balance in place',
        'delete transaction records',
      ],
      optionalPoints: [
        'snapshots for performance',
        'kafka as event store',
        'projections',
      ],
    },
    explanation: `
**Recommended: YES, Event Sourcing**

Banking is a perfect Event Sourcing use case:

**Event Store**:
\`\`\`
Event 1: AccountCreated { accountId: 123, initialBalance: 0 }
Event 2: MoneyDeposited { accountId: 123, amount: 1000 }
Event 3: MoneyWithdrawn { accountId: 123, amount: 50 }
Event 4: MoneyTransferred { from: 123, to: 456, amount: 200 }
\`\`\`

**Current Balance** (Projection):
\`\`\`
balance = events
  .filter(e => e.accountId === 123)
  .reduce((bal, event) => applyEvent(bal, event), 0)
// Result: 1000 - 50 - 200 = 750
\`\`\`

**Benefits**:
1. **Audit Trail**: Every transaction preserved forever
2. **Replay**: Reconstruct account state at any time
3. **Disputes**: See exact sequence of events
4. **Compliance**: Immutable log meets regulations

**Optimization**: Use snapshots to avoid replaying millions of events:
\`\`\`
Snapshot at Event 1000: balance = 5000
Replay events 1001-1050 to get current balance
\`\`\`

**Real-World**: Most financial systems use event sourcing or similar append-only patterns.

Sources:
- [Event Sourcing Pattern - Azure](https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing)
    `,
    difficulty: 'hard',
    estimatedTimeSeconds: 240,
    tags: ['event-sourcing', 'banking', 'audit'],
    variationGroup: 'event-sourcing',
  },

  // ============================================================================
  // Saga Pattern Questions
  // ============================================================================
  {
    id: 'saga-q1-ecommerce-order',
    conceptId: 'saga-pattern',
    scenario: {
      context: 'Building order processing across multiple microservices (inventory, payment, shipping)',
      requirements: [
        'Order flow: Reserve inventory → Charge payment → Create shipment',
        'Each step is a separate microservice with its own database',
        'If payment fails, must release reserved inventory',
        'If shipping fails, must refund payment and release inventory',
        'Need to handle partial failures gracefully',
      ],
      constraints: [
        'No distributed transactions (no 2-phase commit)',
        'Each service independently deployed',
      ],
      metrics: {
        'Services': '3 (inventory, payment, shipping)',
        'Failure Handling': 'Compensating actions required',
      },
    },
    question: 'How would you use the Saga pattern to implement this order flow? Choose between choreography and orchestration.',
    questionType: 'architecture_decision',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Saga manages distributed transactions',
          keywords: ['saga', 'distributed transaction', 'microservices'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Compensating actions for rollback',
          keywords: ['compensating', 'rollback', 'undo', 'reverse'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Choreography vs Orchestration',
          keywords: ['choreography', 'orchestration', 'coordinator'],
          weight: 0.8,
          mustMention: true,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Saga Coordination Style',
          options: [
            {
              name: 'Orchestration',
              pros: ['Central control', 'Easier to understand', 'Clear state machine'],
              cons: ['Central point of failure', 'Coupling to orchestrator'],
            },
            {
              name: 'Choreography',
              pros: ['Decentralized', 'No single point of failure'],
              cons: ['Complex to trace', 'Harder to understand flow'],
            },
          ],
        },
      ],
      antipatterns: [
        '2-phase commit',
        'distributed transactions',
        'no compensation logic',
      ],
      optionalPoints: [
        'saga orchestrator service',
        'event-driven choreography',
        'idempotency',
      ],
    },
    explanation: `
**Recommended: Saga with Orchestration**

**Orchestrated Saga** (recommended for this case):

\`\`\`
Order Orchestrator:
  1. ReserveInventory(orderId) → Success
  2. ChargePayment(orderId) → Failure
  3. Compensate: ReleaseInventory(orderId)
  4. Order marked as Failed
\`\`\`

**Compensation Logic**:
- Reserve inventory → Undo: Release inventory
- Charge payment → Undo: Refund payment
- Create shipment → Undo: Cancel shipment

**Why Orchestration**: Order processing has clear sequential steps. Orchestrator maintains state machine, making it easier to understand and debug.

**Choreographed Alternative** (event-driven):
\`\`\`
OrderPlaced event
  → Inventory reserves
  → InventoryReserved event
  → Payment charges
  → PaymentFailed event
  → Inventory releases
\`\`\`

More decentralized but harder to trace.

**Key Insight**: Sagas trade ACID transactions for eventual consistency with compensating actions.

Sources:
- [Saga Pattern - Microservices.io](https://microservices.io/patterns/data/saga.html)
    `,
    difficulty: 'hard',
    estimatedTimeSeconds: 280,
    tags: ['saga', 'distributed-transactions', 'microservices'],
    variationGroup: 'saga-pattern',
  },

  // ============================================================================
  // Circuit Breaker Pattern Questions
  // ============================================================================
  {
    id: 'circuit-breaker-q1-payment-service',
    conceptId: 'circuit-breaker-pattern',
    scenario: {
      context: 'Your e-commerce app calls a third-party payment processing API',
      requirements: [
        'Payment API sometimes experiences outages (99% uptime)',
        'During outages, API takes 30 seconds to timeout',
        'You have 10K checkout requests per minute during peak',
        'Cannot let slow payment API crash your entire application',
        'Need to fail fast when payment API is down',
      ],
      constraints: [
        'Payment API outages last 5-15 minutes typically',
        'Must prevent cascading failures to your app',
      ],
      metrics: {
        'Normal latency': '500ms',
        'Failure latency': '30 seconds (timeout)',
        'Request rate': '10K/min during peak',
      },
    },
    question: 'How would you use the Circuit Breaker pattern to protect your application from payment API failures?',
    questionType: 'architecture_decision',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Circuit breaker prevents cascading failures',
          keywords: ['circuit breaker', 'fail fast', 'cascading', 'prevent'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Three states: Closed, Open, Half-Open',
          keywords: ['closed', 'open', 'half-open', 'states'],
          weight: 1.0,
          mustMention: true,
        },
        {
          concept: 'Fail fast when service down',
          keywords: ['fail fast', 'immediate failure', 'timeout'],
          weight: 0.8,
          mustMention: true,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Failing Fast vs Retrying',
          options: [
            {
              name: 'Circuit Breaker',
              pros: ['Prevent cascading failures', 'Fail fast', 'System remains responsive', 'Auto-recovery'],
              cons: ['May reject valid requests during recovery', 'Need fallback strategy'],
            },
            {
              name: 'No Circuit Breaker',
              pros: ['Simpler'],
              cons: ['All requests wait 30s', 'Thread exhaustion', 'System crashes'],
            },
          ],
        },
      ],
      antipatterns: [
        'retry forever',
        'no timeout',
        'ignore repeated failures',
      ],
      optionalPoints: [
        'fallback response',
        'health check',
        'exponential backoff',
      ],
    },
    explanation: `
**Recommended: YES, Circuit Breaker**

**Implementation**:

\`\`\`
Circuit States:
1. CLOSED: Normal operation
   - Payment API calls go through
   - Track failures
   - If 50% fail in last minute → OPEN

2. OPEN: Failing fast
   - Don't call payment API
   - Return error immediately
   - After 60 seconds → HALF-OPEN

3. HALF-OPEN: Testing recovery
   - Allow 1 request through
   - If success → CLOSED
   - If failure → OPEN (another 60s)
\`\`\`

**Without Circuit Breaker**:
- Payment API down
- 10K requests/min × 30s timeout = 300K concurrent threads
- Your app runs out of resources
- Entire system crashes

**With Circuit Breaker**:
- After detecting failures → Open circuit
- Requests fail immediately with cached response
- System remains responsive
- Auto-recovery when API comes back

**Fallback Strategy**:
- Queue order for later processing
- Display "Payment processing delayed" message
- Notify user via email when processed

Sources:
- [Circuit Breaker Pattern - Azure](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)
    `,
    difficulty: 'medium',
    estimatedTimeSeconds: 220,
    tags: ['circuit-breaker', 'resilience', 'fault-tolerance'],
    variationGroup: 'circuit-breaker',
  },

  // ============================================================================
  // More patterns: Retry, Bulkhead, Strangler Fig, etc.
  // ============================================================================
  // Add 10+ more questions for other patterns...
];

export default architecturePatternsQuestions;
