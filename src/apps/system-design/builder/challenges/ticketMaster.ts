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
