import { CodeChallenge } from '../../types/codeChallenge';

/**
 * TicketMaster Code Challenges
 * Focus on concurrency, locking, distributed transactions
 */

export const pessimisticLockingChallenge: CodeChallenge = {
  id: 'ticketmaster_pessimistic_locking',
  title: 'Implement Pessimistic Locking for Seat Booking',
  description: `Prevent double-booking using database-level pessimistic locks.

**Scenario:**
- Multiple users try to book the same seat simultaneously
- Need to guarantee only one succeeds (strong consistency)
- Use SELECT FOR UPDATE to lock rows

**Requirements:**
- Acquire exclusive lock when user selects seat
- Hold lock during payment processing
- Release lock after booking confirmed or timeout
- Handle deadlocks gracefully

**Interview Focus:**
- Why pessimistic vs optimistic locking?
- How to prevent deadlocks?
- What's the tradeoff (throughput vs consistency)?`,

  difficulty: 'medium',
  componentType: 'postgresql',

  functionSignature: 'class SeatBookingService { async bookSeat(seatId: string, userId: string): Promise<BookingResult> }',

  starterCode: `interface BookingResult {
  success: boolean;
  message: string;
  bookingId?: string;
}

class SeatBookingService {
  private locks: Map<string, { userId: string; timestamp: number }> = new Map();
  private bookings: Map<string, string> = new Map(); // seatId -> userId

  /**
   * Book a seat with pessimistic locking
   * @param seatId - Seat identifier
   * @param userId - User identifier
   * @returns Booking result
   */
  async bookSeat(seatId: string, userId: string): Promise<BookingResult> {
    // TODO: Implement pessimistic locking

    // Steps:
    // 1. Check if seat already booked
    // 2. Acquire exclusive lock (fail if someone else has lock)
    // 3. Simulate payment processing (50ms delay)
    // 4. Confirm booking
    // 5. Release lock

    // Hint: Use this.locks Map to simulate database locks
    // Hint: Check lock timeout (10 seconds)

    return { success: false, message: 'Not implemented' };
  }

  /**
   * Release lock (e.g., user abandons checkout)
   */
  async releaseLock(seatId: string, userId: string): Promise<void> {
    const lock = this.locks.get(seatId);
    if (lock && lock.userId === userId) {
      this.locks.delete(seatId);
    }
  }
}`,

  testCases: [
    {
      id: 'test_single_booking',
      name: 'Single user books seat',
      input: { seatId: 'A1', userId: 'user1' },
      expectedOutput: { success: true, message: 'Booking confirmed' },
    },
    {
      id: 'test_already_booked',
      name: 'Seat already booked by another user',
      input: {
        sequence: [
          { seatId: 'A1', userId: 'user1' },
          { seatId: 'A1', userId: 'user2' }, // Should fail
        ],
      },
      expectedOutput: { firstSuccess: true, secondSuccess: false },
    },
    {
      id: 'test_concurrent_booking',
      name: 'Concurrent booking attempts (race condition)',
      input: {
        concurrent: [
          { seatId: 'A1', userId: 'user1' },
          { seatId: 'A1', userId: 'user2' },
          { seatId: 'A1', userId: 'user3' },
        ],
      },
      expectedOutput: { successCount: 1, failureCount: 2 },
    },
  ],

  performanceTargets: {
    maxTimeMs: 100, // Should process booking in < 100ms
  },

  referenceSolution: `interface BookingResult {
  success: boolean;
  message: string;
  bookingId?: string;
}

class SeatBookingService {
  private locks: Map<string, { userId: string; timestamp: number }> = new Map();
  private bookings: Map<string, string> = new Map();
  private readonly LOCK_TIMEOUT_MS = 10000; // 10 seconds

  async bookSeat(seatId: string, userId: string): Promise<BookingResult> {
    // Step 1: Check if already booked
    if (this.bookings.has(seatId)) {
      return { success: false, message: 'Seat already booked' };
    }

    // Step 2: Try to acquire lock
    const existingLock = this.locks.get(seatId);
    if (existingLock) {
      // Check if lock expired
      if (Date.now() - existingLock.timestamp < this.LOCK_TIMEOUT_MS) {
        return { success: false, message: 'Seat locked by another user' };
      }
      // Lock expired, can proceed
    }

    // Acquire lock
    this.locks.set(seatId, { userId, timestamp: Date.now() });

    try {
      // Step 3: Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 50));

      // Step 4: Confirm booking (double-check not booked)
      if (this.bookings.has(seatId)) {
        return { success: false, message: 'Race condition: already booked' };
      }

      this.bookings.set(seatId, userId);
      const bookingId = \`booking_\${Date.now()}_\${userId}\`;

      return {
        success: true,
        message: 'Booking confirmed',
        bookingId,
      };
    } finally {
      // Step 5: Always release lock
      this.locks.delete(seatId);
    }
  }

  async releaseLock(seatId: string, userId: string): Promise<void> {
    const lock = this.locks.get(seatId);
    if (lock && lock.userId === userId) {
      this.locks.delete(seatId);
    }
  }
}`,

  solutionExplanation: `**Pessimistic Locking Strategy**

**Core Idea**: Lock the row BEFORE reading to prevent concurrent modifications.

**SQL Implementation**:
\`\`\`sql
BEGIN TRANSACTION;

-- Acquire exclusive lock on row
SELECT * FROM seats
WHERE seat_id = 'A1'
FOR UPDATE;  -- Blocks other transactions

-- Check availability
IF seat.status = 'available' THEN
  -- Process payment
  CALL process_payment(user_id, amount);

  -- Update seat
  UPDATE seats
  SET status = 'booked', user_id = :user_id
  WHERE seat_id = 'A1';

  COMMIT;
ELSE
  ROLLBACK;
END IF;
\`\`\`

**Pessimistic vs Optimistic Locking:**

| Aspect | Pessimistic | Optimistic |
|--------|-------------|------------|
| **Lock timing** | Lock BEFORE read | Check version BEFORE commit |
| **Best for** | High contention | Low contention |
| **Throughput** | Lower (serialized) | Higher (parallel) |
| **Consistency** | Guaranteed | May have retries |
| **Deadlocks** | Possible | No deadlocks |
| **Use case** | TicketMaster (critical) | Wikipedia edits |

**Production Implementation (PostgreSQL)**:

\`\`\`typescript
async bookSeat(seatId: string, userId: string): Promise<BookingResult> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Pessimistic lock with timeout
    await client.query('SET LOCAL lock_timeout = \\'5s\\'');

    const result = await client.query(
      'SELECT * FROM seats WHERE seat_id = $1 FOR UPDATE',
      [seatId]
    );

    if (result.rows[0].status !== 'available') {
      await client.query('ROLLBACK');
      return { success: false, message: 'Seat not available' };
    }

    // Simulate payment
    await processPayment(userId, result.rows[0].price);

    // Update seat
    await client.query(
      'UPDATE seats SET status = \\'booked\\', user_id = $1 WHERE seat_id = $2',
      [userId, seatId]
    );

    await client.query('COMMIT');
    return { success: true, message: 'Booking confirmed' };

  } catch (error) {
    await client.query('ROLLBACK');

    if (error.code === '55P03') { // Lock timeout
      return { success: false, message: 'Seat locked, try again' };
    }
    throw error;
  } finally {
    client.release();
  }
}
\`\`\`

**Deadlock Prevention**:
1. **Lock ordering**: Always acquire locks in same order (e.g., sort seat IDs)
2. **Timeouts**: Set lock_timeout to prevent indefinite waits
3. **Retries**: Retry failed transactions with exponential backoff
4. **Monitoring**: Track deadlock frequency, adjust strategy if high

**Interview Answer**:
"For TicketMaster, I'd use pessimistic locking because:
1. **High value transaction**: Cannot tolerate double-booking
2. **Acceptable latency**: Users expect booking to take a few seconds
3. **High contention**: Popular events have many concurrent attempts
4. **Strong consistency > Throughput**: Better to reject than double-book

For lower contention scenarios (e.g., editing user profile), I'd use optimistic locking with version numbers for better throughput."`,

  interviewTips: [
    'Explain that pessimistic locking trades throughput for guaranteed consistency',
    'Mention lock timeout to prevent indefinite blocking',
    'Discuss deadlock prevention: lock ordering, timeouts, retry logic',
    'Compare to optimistic locking: better for low contention scenarios',
    'Explain how to handle lock timeout gracefully (queue system, retry)',
  ],
};

export const sagaPatternChallenge: CodeChallenge = {
  id: 'ticketmaster_saga_pattern',
  title: 'Implement Saga Pattern for Distributed Transactions',
  description: `Handle multi-step booking process with compensating transactions.

**Saga Pattern**: Break distributed transaction into local transactions with compensation logic.

**Booking Flow:**
1. Reserve seat (local transaction)
2. Process payment (external service)
3. Confirm booking (local transaction)
4. Send confirmation email (external service)

**If any step fails:**
- Execute compensating transactions to rollback
- Example: Payment fails → Release seat reservation

**Requirements:**
- Implement forward progress (happy path)
- Implement compensating transactions (rollback)
- Handle partial failures
- Maintain consistency across services

**Interview Focus:**
- Why Saga pattern vs 2-phase commit?
- How to handle failure at each step?
- What's the consistency model (eventual)?`,

  difficulty: 'hard',
  componentType: 'message_queue',

  functionSignature: 'class SagaOrchestrator { async executeBookingSaga(request: BookingRequest): Promise<SagaResult> }',

  starterCode: `interface BookingRequest {
  userId: string;
  seatId: string;
  amount: number;
}

interface SagaResult {
  success: boolean;
  bookingId?: string;
  failedStep?: string;
  message: string;
}

class SagaOrchestrator {
  private reservations: Map<string, any> = new Map();
  private payments: Map<string, any> = new Map();
  private bookings: Map<string, any> = new Map();

  /**
   * Execute booking saga with compensating transactions
   */
  async executeBookingSaga(request: BookingRequest): Promise<SagaResult> {
    // TODO: Implement saga pattern

    // Happy path:
    // 1. Reserve seat
    // 2. Process payment
    // 3. Confirm booking
    // 4. Send email

    // Failure path (compensation):
    // - Payment fails? Release reservation
    // - Email fails? Log but still succeed (async)

    return { success: false, message: 'Not implemented' };
  }

  // Saga steps (implement these)
  private async reserveSeat(seatId: string, userId: string): Promise<string> {
    // Simulated failure: 10% of seats fail reservation
    if (Math.random() < 0.1) {
      throw new Error('Seat unavailable');
    }
    const reservationId = \`res_\${Date.now()}\`;
    this.reservations.set(reservationId, { seatId, userId });
    return reservationId;
  }

  private async processPayment(userId: string, amount: number): Promise<string> {
    // Simulated failure: 5% payment failures
    if (Math.random() < 0.05) {
      throw new Error('Payment declined');
    }
    const paymentId = \`pay_\${Date.now()}\`;
    this.payments.set(paymentId, { userId, amount });
    return paymentId;
  }

  private async confirmBooking(reservationId: string, paymentId: string): Promise<string> {
    const bookingId = \`booking_\${Date.now()}\`;
    this.bookings.set(bookingId, { reservationId, paymentId });
    return bookingId;
  }

  // Compensating transactions
  private async cancelReservation(reservationId: string): Promise<void> {
    this.reservations.delete(reservationId);
  }

  private async refundPayment(paymentId: string): Promise<void> {
    this.payments.delete(paymentId);
  }
}`,

  testCases: [
    {
      id: 'test_happy_path',
      name: 'Successful booking (happy path)',
      input: { userId: 'user1', seatId: 'A1', amount: 100 },
      expectedOutput: { success: true },
    },
    {
      id: 'test_payment_failure',
      name: 'Payment fails → Release reservation',
      input: {
        scenario: 'payment_failure',
        userId: 'user2',
        seatId: 'A2',
        amount: 100,
      },
      expectedOutput: {
        success: false,
        failedStep: 'payment',
        compensated: true,
      },
    },
  ],

  performanceTargets: {
    maxTimeMs: 500,
  },

  referenceSolution: `interface BookingRequest {
  userId: string;
  seatId: string;
  amount: number;
}

interface SagaResult {
  success: boolean;
  bookingId?: string;
  failedStep?: string;
  message: string;
}

class SagaOrchestrator {
  private reservations: Map<string, any> = new Map();
  private payments: Map<string, any> = new Map();
  private bookings: Map<string, any> = new Map();

  async executeBookingSaga(request: BookingRequest): Promise<SagaResult> {
    let reservationId: string | null = null;
    let paymentId: string | null = null;
    let bookingId: string | null = null;

    try {
      // Step 1: Reserve seat
      reservationId = await this.reserveSeat(request.seatId, request.userId);

      try {
        // Step 2: Process payment
        paymentId = await this.processPayment(request.userId, request.amount);

        try {
          // Step 3: Confirm booking
          bookingId = await this.confirmBooking(reservationId, paymentId);

          // Step 4: Send email (async, don't block on failure)
          this.sendConfirmationEmail(request.userId, bookingId).catch(err => {
            console.error('Email failed (async):', err);
            // Log but don't fail entire saga
          });

          return {
            success: true,
            bookingId,
            message: 'Booking confirmed',
          };

        } catch (error) {
          // Booking failed → Refund payment + Cancel reservation
          if (paymentId) await this.refundPayment(paymentId);
          if (reservationId) await this.cancelReservation(reservationId);
          return {
            success: false,
            failedStep: 'booking',
            message: 'Booking failed, payment refunded',
          };
        }

      } catch (error) {
        // Payment failed → Cancel reservation
        if (reservationId) await this.cancelReservation(reservationId);
        return {
          success: false,
          failedStep: 'payment',
          message: 'Payment failed, reservation released',
        };
      }

    } catch (error) {
      // Reservation failed → No compensation needed
      return {
        success: false,
        failedStep: 'reservation',
        message: 'Seat unavailable',
      };
    }
  }

  private async reserveSeat(seatId: string, userId: string): Promise<string> {
    if (Math.random() < 0.1) throw new Error('Seat unavailable');
    const reservationId = \`res_\${Date.now()}\`;
    this.reservations.set(reservationId, { seatId, userId, timestamp: Date.now() });
    return reservationId;
  }

  private async processPayment(userId: string, amount: number): Promise<string> {
    if (Math.random() < 0.05) throw new Error('Payment declined');
    const paymentId = \`pay_\${Date.now()}\`;
    this.payments.set(paymentId, { userId, amount });
    return paymentId;
  }

  private async confirmBooking(reservationId: string, paymentId: string): Promise<string> {
    const bookingId = \`booking_\${Date.now()}\`;
    this.bookings.set(bookingId, { reservationId, paymentId, timestamp: Date.now() });
    return bookingId;
  }

  private async sendConfirmationEmail(userId: string, bookingId: string): Promise<void> {
    // Async, non-blocking
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  private async cancelReservation(reservationId: string): Promise<void> {
    this.reservations.delete(reservationId);
  }

  private async refundPayment(paymentId: string): Promise<void> {
    this.payments.delete(paymentId);
  }
}`,

  solutionExplanation: `**Saga Pattern for Distributed Transactions**

**Problem**: Traditional ACID transactions don't work across microservices.

**Solution**: Break into local transactions + compensation logic.

**Saga Execution**:
\`\`\`
Happy Path:
Reserve → Payment → Booking → Email → ✅ Success

Failure Path:
Reserve → Payment → X (fails) → Compensation:
                                 ↓
                       Refund + Cancel Reservation
\`\`\`

**Two Saga Approaches**:

**1. Choreography** (Event-driven):
\`\`\`
SeatService → "SeatReserved" event
              ↓
PaymentService → "PaymentProcessed" event
              ↓
BookingService → "BookingConfirmed" event

If PaymentService fails:
PaymentService → "PaymentFailed" event
              ↓
SeatService → cancels reservation
\`\`\`

**2. Orchestration** (Coordinator):
\`\`\`
Orchestrator:
  1. Call SeatService.reserve()
  2. Call PaymentService.charge()
     - If fails: Call SeatService.cancel()
  3. Call BookingService.confirm()
     - If fails: Call PaymentService.refund()
                 Call SeatService.cancel()
\`\`\`

**Production Implementation (Kafka + State Machine)**:

\`\`\`typescript
enum SagaState {
  PENDING = 'PENDING',
  SEAT_RESERVED = 'SEAT_RESERVED',
  PAYMENT_PROCESSED = 'PAYMENT_PROCESSED',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  FAILED = 'FAILED',
  COMPENSATED = 'COMPENSATED',
}

class SagaStateMachine {
  private state: SagaState = SagaState.PENDING;
  private compensations: Array<() => Promise<void>> = [];

  async execute(): Promise<void> {
    try {
      // Step 1
      await this.reserveSeat();
      this.state = SagaState.SEAT_RESERVED;
      this.compensations.push(() => this.cancelReservation());

      // Step 2
      await this.processPayment();
      this.state = SagaState.PAYMENT_PROCESSED;
      this.compensations.push(() => this.refundPayment());

      // Step 3
      await this.confirmBooking();
      this.state = SagaState.BOOKING_CONFIRMED;

    } catch (error) {
      this.state = SagaState.FAILED;
      await this.compensate();
    }
  }

  private async compensate(): Promise<void> {
    // Execute compensations in reverse order
    for (const compensation of this.compensations.reverse()) {
      try {
        await compensation();
      } catch (error) {
        // Log but continue compensation
        console.error('Compensation failed:', error);
      }
    }
    this.state = SagaState.COMPENSATED;
  }
}
\`\`\`

**Saga vs 2-Phase Commit (2PC)**:

| Aspect | Saga | 2PC |
|--------|------|-----|
| **Consistency** | Eventual | Immediate |
| **Coordination** | Async | Synchronous |
| **Availability** | High | Low (coordinator SPOF) |
| **Complexity** | Higher | Lower |
| **Failure handling** | Compensation | Rollback |
| **Use case** | Microservices | Monolith DB |

**Interview Answer**:
"For TicketMaster's booking flow across services (seat reservation, payment gateway, email service), I'd use Saga pattern with orchestration:

1. **Orchestrator** coordinates the flow
2. **Each step** is a local ACID transaction
3. **Compensation** logic handles failures (refund payment, release seat)
4. **Message queue** (Kafka) stores saga state for durability
5. **Dead letter queue** for manual intervention on compensation failures

I prefer orchestration over choreography because:
- **Easier debugging**: Central place to see flow
- **Simpler compensation**: Orchestrator knows what to rollback
- **Better monitoring**: Single service to instrument

Tradeoff: Orchestrator is single point of failure (mitigate with HA setup + message queue for durability)."`,

  interviewTips: [
    'Explain Saga vs 2PC: Saga = eventual consistency, 2PC = immediate but poor availability',
    'Mention idempotency: Payment service must handle duplicate requests',
    'Discuss monitoring: Track saga completion rate, compensation rate, time to complete',
    'Explain failure scenarios: What if compensation fails? (Dead letter queue, manual review)',
    'Compare orchestration vs choreography: Orchestration = simpler, choreography = decoupled',
  ],
};

export const ticketMasterCodeChallenges: CodeChallenge[] = [
  pessimisticLockingChallenge,
  sagaPatternChallenge,
];
