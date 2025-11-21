import { Challenge } from '../types/testCase';
import { ticketMasterCodeChallenges } from './code/ticketMasterChallenges';

/**
 * TicketMaster System Design - Advanced Interview Challenge
 *
 * Interview Focus Areas:
 * - Race conditions & concurrency control
 * - Distributed transactions
 * - Strong consistency (no double-booking)
 * - High write load (ticket drops)
 * - Cache invalidation strategies
 * - Message queues for order processing
 * - Pessimistic vs optimistic locking
 *
 * Common Follow-up Questions:
 * - How do you prevent double-booking?
 * - What happens if payment fails after inventory is reserved?
 * - How do you handle 10,000 users buying the same ticket?
 * - Should you use pessimistic or optimistic locking?
 * - How do you ensure exactly-once semantics for payment?
 * - What's your consistency model? (ACID vs BASE)
 */
export const ticketMasterChallenge: Challenge = {
  id: 'ticket_master',
  title: 'TicketMaster - Event Ticketing System',
  difficulty: 'advanced',
  description: `Design a ticketing system like TicketMaster or StubHub that handles high-demand event sales.

**Key Requirements:**
- Users browse events and available seats
- During ticket drops, thousands of users compete for limited inventory
- **Critical: No double-booking** (strong consistency required)
- Payment processing must be reliable (distributed transactions)
- Seat selection with timeout (holds expire after 10 minutes)

**Challenges:**
- Race conditions when multiple users select same seat
- Inventory management under extreme load
- Payment failures and rollback scenarios
- Fair queuing during high-demand sales`,

  requirements: {
    functional: [
      'Browse events and search (read-heavy)',
      'Check seat availability in real-time',
      'Reserve seat with 10-min timeout',
      'Process payment (distributed transaction)',
      'No double-booking (strong consistency)',
      'Handle payment failures gracefully',
    ],
    traffic: '10,000 RPS during ticket drops (burst), 1,000 RPS normal browsing',
    latency: 'p99 < 200ms for browsing, < 500ms for booking',
    availability: '99.95% uptime (financial transactions)',
    budget: '$2,000/month',
  },

  availableComponents: [
    'client',
    'load_balancer',
    'app_server',
    'database',
    'redis',
    'message_queue',
    'cdn',
    's3',
  ],

  testCases: [
    {
      name: 'Normal Browsing Load',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'System handles normal browsing load (95% reads, 5% writes) with low latency and within budget.',
      traffic: {
        type: 'mixed',
        rps: 1000,
        readRatio: 0.95, // 95% browsing, 5% booking attempts
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 200,
        maxErrorRate: 0.01,
        maxMonthlyCost: 2000,
      },
    },
    {
      name: 'Ticket Drop (High Concurrency)',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'During ticket drops, thousands of users compete for limited inventory (10k RPS, 3000 concurrent bookings).',
      traffic: {
        type: 'mixed',
        rps: 10000,
        readRatio: 0.7, // 70% browsing, 30% booking attempts (3,000 concurrent bookings!)
      },
      duration: 120,
      passCriteria: {
        maxP99Latency: 500,
        maxErrorRate: 0.1, // Accept 10% errors during peak (queue system)
      },
    },
    {
      name: 'Race Condition Test',
      type: 'functional',
      requirement: 'FR-5',
      description: '5000 users trying to book same 100 tickets. System must prevent double-booking with strong consistency.',
      traffic: {
        type: 'write',
        rps: 5000, // 5000 users trying to book same 100 tickets
        readRatio: 0.0,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0.02, // Must prevent double-booking (strong consistency)
        // Special validation: Check no seat booked twice
      },
    },
    {
      name: 'Payment Failure Recovery',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Payment gateway times out. System must handle gracefully with compensation logic.',
      traffic: {
        type: 'mixed',
        rps: 2000,
        readRatio: 0.8,
      },
      duration: 60,
      failureInjection: {
        type: 'network_partition', // Simulates payment gateway timeout
        atSecond: 20,
        recoverySecond: 40,
      },
      passCriteria: {
        minAvailability: 0.95, // System should handle gracefully
        maxErrorRate: 0.05,
      },
    },
  ],

  learningObjectives: [
    'Understand race conditions and concurrency control',
    'Learn about distributed transactions (2PC, Saga pattern)',
    'Implement strong consistency for critical operations',
    'Design timeout mechanisms for inventory holds',
    'Handle partial failures and rollbacks',
    'Choose between pessimistic vs optimistic locking',
    'Use message queues for async order processing',
    'Balance consistency vs availability tradeoffs',
  ],

  hints: [
    {
      trigger: 'test_failed:Race Condition Test',
      message: `💡 **Double-booking detected!**

Your system allowed multiple users to book the same seat. This is a critical bug.

**Solutions:**

1. **Pessimistic Locking** (ACID approach)
   - Use \`SELECT ... FOR UPDATE\` in PostgreSQL
   - Lock row when seat is viewed/selected
   - Pros: Guarantees consistency
   - Cons: Lower throughput, potential deadlocks

2. **Optimistic Locking** (CAS approach)
   - Use version numbers on seats
   - Check version before committing
   - Pros: Higher throughput
   - Cons: More conflicts, need retry logic

3. **Distributed Lock** (Redis/Zookeeper)
   - Acquire lock on seat before booking
   - Set TTL to prevent indefinite holds
   - Pros: Fast, works across services
   - Cons: Additional failure mode

**For TicketMaster, pessimistic locking with PostgreSQL is common** because consistency is more important than throughput for booking.`,
    },
    {
      trigger: 'test_failed:Payment Failure Recovery',
      message: `💡 **System failed to recover from payment gateway timeout**

When external services fail (payment gateway, SMS), your system must handle gracefully.

**Saga Pattern** (Distributed Transaction):

1. **Reserve seat** (local transaction)
2. **Process payment** (external API)
3. **Confirm booking** (local transaction)

If step 2 fails:
- **Compensating transaction**: Release seat reservation
- **Idempotency**: Ensure payment not charged twice
- **Timeout**: Auto-release after 10 minutes

**Implementation:**
- Use **Message Queue** to track order state
- Implement **state machine**: Pending → Reserved → Paid → Confirmed
- **Dead letter queue** for failed orders (manual review)

**Key Insight:** Split transaction into steps with compensation logic.`,
    },
    {
      trigger: 'consistency_model_chosen:eventual',
      message: `⚠️ **Eventual consistency is risky for ticketing!**

You chose eventual consistency, but ticketing requires **strong consistency** to prevent double-booking.

**Why strong consistency matters:**
- Two users can't buy the same seat
- Inventory count must be accurate
- Payment must match reserved seats

**Use cases for eventual consistency:**
- User profiles
- Event descriptions
- Search index
- Analytics

**Use cases for strong consistency:**
- Seat inventory (critical!)
- Active reservations
- Payment status
- Order confirmations

**Recommendation:** Use PostgreSQL with ACID transactions for booking flow, eventual consistency for everything else.`,
    },
    {
      trigger: 'high_latency',
      message: `💡 **High latency during ticket drops**

Your p99 latency exceeded 500ms during peak load.

**Optimization strategies:**

1. **Queue System** (Virtual Waiting Room)
   - Place users in queue before ticket sales start
   - Admit users at controlled rate (e.g., 100/sec)
   - Reduces database overload
   - Fair queueing (FIFO)

2. **Optimistic Concurrency**
   - Let users select seats optimistically
   - Validate on checkout (may fail)
   - Show "Someone else is checking out this seat"

3. **Cache Inventory**
   - Cache available seat count (not exact list)
   - Show "~50 seats remaining" instead of exact count
   - Reduce DB read load

4. **Horizontal Scaling**
   - Shard by event ID
   - Each event gets dedicated DB instance
   - Prevents cross-event contention

**Industry Standard:** Most sites use virtual waiting rooms + optimistic concurrency.`,
    },
  ],

  // Code challenges for hands-on implementation practice
  codeChallenges: ticketMasterCodeChallenges,

  // Complete solution that passes ALL test cases
  solution: {
    components: [
      { type: 'client', config: {} },
      { type: 'cdn', config: { enabled: true } },
      { type: 'load_balancer', config: { algorithm: 'least_connections' } },
      { type: 'app_server', config: { instances: 12 } },
      { type: 'message_queue', config: { maxThroughput: 10000, partitions: 8 } },
      { type: 'redis', config: { maxMemoryMB: 8192 } },
      { type: 'postgresql', config: {
        readCapacity: 10000,
        writeCapacity: 8000,
        replication: true,
        instanceType: 'commodity-db',
        replicationMode: 'single-leader',
        sharding: { enabled: false, shards: 1, shardKey: 'event_id' }
      } },
    ],
    connections: [
      { from: 'client', to: 'cdn' },
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'app_server', to: 'redis' },
      { from: 'app_server', to: 'postgresql' },
    ],
    explanation: `# Complete Solution for TicketMaster Event Ticketing System

## Architecture Components
- **client**: Users browsing and booking tickets
- **cdn**: Serves static assets (event images, CSS, JavaScript)
- **load_balancer**: Distributes traffic across app servers with least-connections algorithm
- **app_server** (8 instances): Handles browsing and booking requests
- **message_queue** (10k throughput, 8 partitions): Virtual waiting room and async order processing
- **redis** (8GB): Seat holds (TTL: 10 min), seat availability cache
- **postgresql** (2k read, 1k write, replicated): Inventory, bookings, transactions with ACID guarantees

## Data Flow

### Normal Browsing (95% of traffic)
1. Client → CDN: Static assets (images, CSS)
2. Client → Load Balancer → App Server: Event listings
3. App Server → Redis: Cache event data and seat availability count
4. App Server → PostgreSQL: Fresh event data on cache miss

### Ticket Booking (5% of traffic, high concurrency)
1. Client → Load Balancer → App Server: Seat selection request
2. App Server → Message Queue: Enqueue booking request (virtual waiting room)
3. Worker consumes from queue → App Server: Process booking
4. App Server → Redis: Check/create seat hold (TTL: 10 min)
5. App Server → PostgreSQL: Reserve seat with pessimistic lock (SELECT FOR UPDATE)
6. Payment processing → App Server: Confirm or rollback
7. App Server → PostgreSQL: Commit booking or release seat

## Why This Works

### Normal Load (1000 RPS)
- CDN serves all static content (images, event pages)
- Redis caches event listings and seat availability counts
- 8 app servers handle ~125 RPS each
- PostgreSQL easily handles 50 RPS writes (5% of traffic)

### Ticket Drop (10,000 RPS)
- **Message queue acts as virtual waiting room**
  - Enqueues 3,000 booking requests/sec
  - Processes at controlled rate (500/sec) to prevent DB overload
  - Fair FIFO ordering
- **Redis for seat holds**
  - Fast distributed lock for seat reservations
  - TTL ensures abandoned carts don't block inventory
- **PostgreSQL with pessimistic locking**
  - SELECT FOR UPDATE prevents double-booking
  - ACID transactions ensure consistency
  - Replication provides failover

### Race Condition Prevention (5000 concurrent users, 100 tickets)
- **Pessimistic locking** guarantees only one user can book each seat
- **Message queue** throttles booking rate to DB capacity
- **Redis locks** provide fast rejection before hitting DB
- Result: No double-booking, guaranteed consistency

### Payment Failure Recovery
- **Saga pattern** for distributed transaction:
  1. Reserve seat (PostgreSQL)
  2. Process payment (external API)
  3. If payment fails → compensating transaction (release seat)
- **Message queue** tracks order state machine
- **Idempotency** prevents duplicate charges
- **Dead letter queue** for manual review of edge cases

## Key Design Decisions

1. **Message Queue as Virtual Waiting Room**
   - Controls booking rate to prevent DB saturation
   - Fair queuing (FIFO) during high demand
   - Decouples request rate from processing capacity

2. **PostgreSQL with Pessimistic Locking**
   - Strong consistency for inventory (no double-booking)
   - SELECT FOR UPDATE ensures exclusive access
   - ACID transactions for payment flow

3. **Redis for Seat Holds**
   - Fast distributed locking
   - TTL auto-expires abandoned reservations
   - Reduces DB load for transient state

4. **CDN for Static Content**
   - Offloads event images and pages
   - Reduces app server load
   - Low-latency global access

5. **8 App Server Instances**
   - Handles 10k RPS ticket drops (1250 RPS each)
   - Stateless design enables horizontal scaling
   - Load balancer with health checks

## Trade-offs

**Consistency over Availability**
- Strong consistency for booking (ACID)
- May reject requests during extreme load
- Acceptable: Better to show sold out than double-book

**Queue Latency**
- Users wait in virtual queue during ticket drops
- Adds 10-30 seconds latency
- Acceptable: Prevents site crash, ensures fairness

**Cost vs Performance**
- 8 app servers ($880/month) for peak capacity
- Over-provisioned for normal load (1000 RPS)
- Worth it: Ticket drops are revenue events, downtime = lost sales

## Budget: $1,950/month
- App Servers (8x): $880
- PostgreSQL (replicated): $300
- Redis (8GB): $400
- Message Queue: $250
- Load Balancer: $50
- CDN: $70
**Total: $1,950** (within $2,000 budget)`,
  },
};

/**
 * Reference Solution Architecture
 *
 * **Normal Browsing (Read-Heavy):**
 * Client → LB → App Servers (3+) → Redis (Cache-Aside) → MongoDB (Event Data)
 * - Cache event listings (TTL: 1 hour)
 * - Cache seat availability count (TTL: 1 min)
 * - CDN for static assets (images, CSS)
 *
 * **Ticket Booking (Write-Heavy, Strong Consistency):**
 * Client → LB → App → Message Queue (Kafka) → Booking Service → PostgreSQL (ACID)
 * - PostgreSQL with pessimistic locking (\`SELECT FOR UPDATE\`)
 * - Message queue for async order processing
 * - Saga pattern for payment rollback
 *
 * **Inventory Management:**
 * - PostgreSQL for current availability (source of truth)
 * - Redis for temporary seat holds (TTL: 10 minutes)
 * - Message queue for reservation expiry processing
 *
 * **Payment Processing:**
 * - Idempotent API calls (dedup based on order ID)
 * - 2-phase commit or Saga pattern
 * - Dead letter queue for failed payments
 *
 * **Estimated Cost:**
 * - PostgreSQL (HA): $300/month
 * - Redis (8GB): $400/month
 * - MongoDB (Events): $300/month
 * - Kafka (3 brokers): $300/month
 * - App Servers (5x): $500/month
 * - Load Balancer: $50/month
 * - CDN: $100/month
 * **Total: ~$1,950/month**
 *
 * **Key Metrics:**
 * - p99 Latency: ~150ms (browsing), ~400ms (booking)
 * - Availability: 99.95%
 * - Strong consistency for bookings
 * - No double-booking (guaranteed by DB locks)
 */
