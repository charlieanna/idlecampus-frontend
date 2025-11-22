/**
 * Transaction Scenario Questions - DDIA Chapter 7
 *
 * Scenario-based questions covering ACID properties, isolation levels,
 * concurrency anomalies, locking strategies, and distributed transactions.
 */

import { ScenarioQuestion } from '../../types/spacedRepetition';

export const transactionQuestions: ScenarioQuestion[] = [
  // ============================================================================
  // ACID Properties
  // ============================================================================
  {
    id: 'acid-q1-banking-transfer',
    conceptId: 'acid-properties',
    scenario: {
      context: 'Building a banking system for money transfers between accounts',
      requirements: [
        'Transfer $500 from Account A ($1000) to Account B ($500)',
        'System crashes after debiting A but before crediting B',
        'Must ensure money is never lost or duplicated',
      ],
    },
    question: 'Which ACID property prevents money loss on crash? How would you implement this?',
    questionType: 'design',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Atomicity ensures all-or-nothing execution',
          keywords: ['atomicity', 'all-or-nothing', 'rollback'],
          mustMention: true,
        },
        {
          concept: 'Use database transaction with BEGIN/COMMIT/ROLLBACK',
          keywords: ['transaction', 'commit', 'rollback', 'begin'],
          mustMention: true,
        },
        {
          concept: 'Write-ahead log (WAL) for crash recovery',
          keywords: ['wal', 'write-ahead log', 'recovery', 'redo', 'undo'],
          mustMention: false,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Performance',
          option1: 'Without transactions (fast, inconsistent)',
          option2: 'With transactions (slower, consistent)',
          reasoning: 'Transaction overhead vs data integrity',
        },
      ],
      antipatterns: [
        'Updating accounts without transaction wrapper',
        'Manual rollback logic in application code',
        'Not handling transaction failures',
      ],
    },
    explanation: `Atomicity guarantees:
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 500 WHERE id = 'A';
  -- Crash here = automatic rollback
  UPDATE accounts SET balance = balance + 500 WHERE id = 'B';
COMMIT;

If crash occurs before COMMIT, database automatically rolls back both updates.
Write-ahead log records all changes before applying them, enabling recovery.`,
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 5,
  },

  {
    id: 'acid-q2-ecommerce-inventory',
    conceptId: 'acid-properties',
    scenario: {
      context: 'E-commerce checkout: User buys 3 iPhone units (5 in stock)',
      requirements: [
        'Create order record',
        'Decrement inventory by 3',
        'Charge payment',
        'Must ensure inventory and orders match',
      ],
    },
    question: 'Which ACID properties are critical here? What happens if payment fails after inventory update?',
    questionType: 'design',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Atomicity: Rollback inventory if payment fails',
          keywords: ['atomicity', 'rollback', 'payment fails'],
          mustMention: true,
        },
        {
          concept: 'Consistency: Inventory must match orders',
          keywords: ['consistency', 'inventory', 'orders', 'invariants'],
          mustMention: true,
        },
        {
          concept: 'Isolation: Prevent overselling during concurrent checkouts',
          keywords: ['isolation', 'overselling', 'concurrent'],
          mustMention: true,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Isolation Level',
          option1: 'Read Committed (fast, overselling possible)',
          option2: 'Serializable (slow, prevents overselling)',
          reasoning: 'Throughput vs inventory accuracy',
        },
      ],
    },
    explanation: `Without atomicity: Inventory decremented but payment failed = lost stock
Without consistency: Orders = 10, Inventory decremented by 7 = data corruption
Without isolation: Two users buy last unit simultaneously = overselling`,
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 5,
  },

  // ============================================================================
  // Isolation Levels - Read Committed
  // ============================================================================
  {
    id: 'isolation-q1-read-committed-analytics',
    conceptId: 'isolation-levels',
    scenario: {
      context: 'Generating daily sales report while orders are being placed',
      requirements: [
        'Report must not see uncommitted orders (dirty reads)',
        'Report runs for 10 minutes reading millions of rows',
        'Orders are being created/updated during report generation',
      ],
    },
    question: 'Would Read Committed isolation prevent dirty reads? What anomalies could still occur?',
    questionType: 'design',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Read Committed prevents dirty reads',
          keywords: ['read committed', 'dirty reads', 'prevents'],
          mustMention: true,
        },
        {
          concept: 'Non-repeatable reads can occur (reading same row twice gives different values)',
          keywords: ['non-repeatable reads', 'different values', 'same row'],
          mustMention: true,
        },
        {
          concept: 'Phantom reads can occur (new rows appear mid-transaction)',
          keywords: ['phantom reads', 'new rows', 'appear'],
          mustMention: false,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Consistency vs Throughput',
          option1: 'Read Committed (10,000 TPS, inconsistent report)',
          option2: 'Repeatable Read (7,000 TPS, consistent snapshot)',
          reasoning: 'Report shows inconsistent data at different points in time',
        },
      ],
    },
    explanation: `Read Committed guarantees:
- Never see uncommitted data (no dirty reads)
- But each SELECT reads latest committed value
- Report totals may not add up (non-repeatable reads)

Example: Total sales = $10,000 at start, but $12,000 when re-queried
Use Repeatable Read or Serializable for consistent snapshots.`,
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 6,
  },

  {
    id: 'isolation-q2-read-committed-overselling',
    conceptId: 'isolation-levels',
    scenario: {
      context: 'Concert tickets: Last 1 seat available, 100 users trying to book',
      requirements: [
        'Check if seats available (SELECT)',
        'Create booking if available',
        'Decrement available seats',
      ],
      constraints: ['Database default: Read Committed (PostgreSQL)'],
    },
    question: 'Can Read Committed prevent double-booking? What anomaly allows overselling?',
    questionType: 'design',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Write skew anomaly allows overselling',
          keywords: ['write skew', 'overselling', 'anomaly'],
          mustMention: true,
        },
        {
          concept: 'Both transactions read available=1, both write bookings',
          keywords: ['both read', 'both write', 'race condition'],
          mustMention: true,
        },
        {
          concept: 'Need Serializable isolation or SELECT FOR UPDATE',
          keywords: ['serializable', 'select for update', 'lock'],
          mustMention: true,
        },
      ],
      antipatterns: [
        'Reading count without locking (SELECT count)',
        'Assuming Read Committed prevents all conflicts',
        'Not handling serialization failures',
      ],
    },
    explanation: `Read Committed allows write skew:
T1: SELECT available FROM seats; -- Returns 1
T2: SELECT available FROM seats; -- Returns 1
T1: INSERT booking; UPDATE seats SET available=0;
T2: INSERT booking; UPDATE seats SET available=-1; -- Oversold!

Solutions:
1. SELECT FOR UPDATE (pessimistic lock)
2. Serializable isolation (detects conflict, aborts T2)
3. Application-level check (prone to race conditions)`,
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 7,
  },

  // ============================================================================
  // Isolation Levels - Serializable
  // ============================================================================
  {
    id: 'isolation-q3-serializable-inventory',
    conceptId: 'isolation-levels',
    scenario: {
      context: 'Pharmaceutical inventory: Track controlled substances',
      requirements: [
        'Regulation: Inventory must never be negative',
        'Dispensing medication reduces inventory',
        'Receiving shipments increases inventory',
        'Audits must show accurate counts',
      ],
      metrics: {
        'Current Throughput': '5,000 TPS (Read Committed)',
        'Serializable Throughput': '500 TPS (90% reduction)',
      },
    },
    question: 'Is the throughput reduction worth it? What\'s the cost of inventory discrepancies?',
    questionType: 'analysis',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Serializable prevents write skew and lost updates',
          keywords: ['serializable', 'write skew', 'lost updates', 'prevents'],
          mustMention: true,
        },
        {
          concept: 'Regulatory compliance requires accurate inventory',
          keywords: ['regulatory', 'compliance', 'accurate', 'audit'],
          mustMention: true,
        },
        {
          concept: 'ROI: Fines and legal costs exceed performance cost',
          keywords: ['fines', 'legal', 'roi', 'cost'],
          mustMention: false,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Performance vs Compliance',
          option1: 'Read Committed (5,000 TPS, potential violations)',
          option2: 'Serializable (500 TPS, guaranteed compliance)',
          reasoning: '$1M+ fines for controlled substance violations',
        },
      ],
    },
    explanation: `Use Serializable when:
- Regulatory requirements (finance, healthcare, government)
- Data corruption costs exceed performance loss
- Audit requirements demand consistency

Quantify the decision:
- Performance cost: 90% throughput reduction
- Compliance cost: $1M fine + license suspension
- Decision: Serializable is clear winner for controlled substances`,
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 8,
  },

  {
    id: 'isolation-q4-repeatable-read-financial',
    conceptId: 'isolation-levels',
    scenario: {
      context: 'Monthly financial report: Calculate sum of all account balances',
      requirements: [
        'Report must show consistent snapshot',
        'Accounts are being updated during report generation',
        'Report runs for 30 minutes',
      ],
    },
    question: 'Why use Repeatable Read instead of Read Committed or Serializable?',
    questionType: 'design',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Repeatable Read provides consistent snapshot (MVCC)',
          keywords: ['repeatable read', 'snapshot', 'mvcc', 'consistent'],
          mustMention: true,
        },
        {
          concept: 'Read Committed would show inconsistent values (non-repeatable reads)',
          keywords: ['read committed', 'inconsistent', 'non-repeatable'],
          mustMention: true,
        },
        {
          concept: 'Serializable is overkill for read-only report',
          keywords: ['serializable', 'overkill', 'read-only'],
          mustMention: false,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Isolation Level Choice',
          option1: 'Read Committed (fast, inconsistent totals)',
          option2: 'Repeatable Read (snapshot, consistent totals)',
          reasoning: 'Financial reports require point-in-time consistency',
        },
      ],
    },
    explanation: `Repeatable Read guarantees:
- All reads see snapshot from transaction start
- Sum of balances is consistent (no mid-update reads)
- No phantom reads in MySQL InnoDB (uses gap locks)

Perfect for:
- Financial reports
- Analytics queries
- Backups requiring consistent state`,
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 5,
  },

  // ============================================================================
  // Concurrency Anomalies
  // ============================================================================
  {
    id: 'anomaly-q1-write-skew-shifts',
    conceptId: 'concurrency-anomalies',
    scenario: {
      context: 'Hospital shift scheduling: At least 2 doctors must be on-call',
      requirements: [
        'Currently 3 doctors on-call: Alice, Bob, Charlie',
        'Alice wants to go off-call',
        'Bob wants to go off-call',
        'Both check "at least 2 doctors remaining" before updating',
      ],
    },
    question: 'What anomaly allows both to go off-call? How to prevent it?',
    questionType: 'design',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Write skew: Both read 3 doctors, both write go-off-call',
          keywords: ['write skew', 'both read', 'both write'],
          mustMention: true,
        },
        {
          concept: 'Read Committed and Repeatable Read allow write skew',
          keywords: ['read committed', 'repeatable read', 'allow'],
          mustMention: true,
        },
        {
          concept: 'Solutions: Serializable isolation or explicit lock',
          keywords: ['serializable', 'lock', 'select for update'],
          mustMention: true,
        },
      ],
      antipatterns: [
        'Checking constraint in application code (race condition)',
        'Using Read Committed isolation',
        'Not handling serialization failures',
      ],
    },
    explanation: `Write Skew example:
T1: SELECT count(*) FROM doctors WHERE on_call=true; -- Returns 3
T2: SELECT count(*) FROM doctors WHERE on_call=true; -- Returns 3
T1: UPDATE doctors SET on_call=false WHERE name='Alice'; -- 2 remaining ✓
T2: UPDATE doctors SET on_call=false WHERE name='Bob';   -- 1 remaining ✗

Constraint violated! Only Charlie on-call.

Prevention:
1. SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
2. SELECT FOR UPDATE to lock all on-call doctors
3. Materializing conflicts (counter table with explicit lock)`,
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 7,
  },

  {
    id: 'anomaly-q2-lost-update-counter',
    conceptId: 'concurrency-anomalies',
    scenario: {
      context: 'Building a page view counter for blog posts',
      requirements: [
        'Increment counter on each view: views = views + 1',
        '1000 concurrent requests incrementing same counter',
        'Database: Read Committed isolation',
      ],
    },
    question: 'How many updates will be lost? What are the solutions?',
    questionType: 'design',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Lost updates: Both read same value, both increment, one overwrites',
          keywords: ['lost updates', 'overwrite', 'read same value'],
          mustMention: true,
        },
        {
          concept: 'Solution 1: Atomic UPDATE views = views + 1',
          keywords: ['atomic update', 'update set', 'views + 1'],
          mustMention: true,
        },
        {
          concept: 'Solution 2: SELECT FOR UPDATE (lock)',
          keywords: ['select for update', 'lock'],
          mustMention: false,
        },
        {
          concept: 'Solution 3: Compare-and-swap (optimistic locking)',
          keywords: ['compare-and-swap', 'cas', 'version', 'optimistic'],
          mustMention: false,
        },
      ],
    },
    explanation: `Lost Update Problem:
T1: SELECT views FROM posts WHERE id=123; -- Returns 100
T2: SELECT views FROM posts WHERE id=123; -- Returns 100
T1: UPDATE posts SET views=101 WHERE id=123;
T2: UPDATE posts SET views=101 WHERE id=123; -- Lost T1's update!

Solutions (ranked by efficiency):
1. UPDATE posts SET views = views + 1 WHERE id=123; (atomic, fastest)
2. Redis INCR (atomic counter, microsecond latency)
3. SELECT FOR UPDATE (locks row, prevents concurrency)
4. Optimistic locking with version check (retries on conflict)`,
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 5,
  },

  {
    id: 'anomaly-q3-phantom-reads-booking',
    conceptId: 'concurrency-anomalies',
    scenario: {
      context: 'Meeting room booking: Check for conflicts before booking',
      requirements: [
        'Check if room is free 2-3pm (SELECT query)',
        'If free, create booking for 2-3pm',
        'Prevent double-booking',
      ],
      constraints: ['Using Repeatable Read isolation'],
    },
    question: 'Can phantom reads cause double-booking? How does Repeatable Read handle this?',
    questionType: 'design',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Phantom reads: New rows appear that match WHERE clause',
          keywords: ['phantom reads', 'new rows', 'appear', 'where'],
          mustMention: true,
        },
        {
          concept: 'MySQL InnoDB prevents phantoms with gap locks',
          keywords: ['gap locks', 'mysql', 'innodb', 'prevents'],
          mustMention: false,
        },
        {
          concept: 'PostgreSQL Repeatable Read allows phantoms (use Serializable)',
          keywords: ['postgresql', 'allows phantoms', 'serializable'],
          mustMention: false,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Database Choice',
          option1: 'MySQL InnoDB Repeatable Read (prevents phantoms)',
          option2: 'PostgreSQL Repeatable Read (allows phantoms)',
          reasoning: 'Implementation differences in isolation levels',
        },
      ],
    },
    explanation: `Phantom Read scenario:
T1: SELECT * FROM bookings WHERE room=5 AND time='2-3pm'; -- Returns 0 rows
T2: INSERT INTO bookings (room, time) VALUES (5, '2-3pm');
T2: COMMIT;
T1: SELECT * FROM bookings WHERE room=5 AND time='2-3pm'; -- Returns 1 row (phantom!)
T1: INSERT INTO bookings (room, time) VALUES (5, '2-3pm'); -- Duplicate!

Prevention:
- MySQL: Repeatable Read uses gap locks (prevents phantoms)
- PostgreSQL: Use Serializable isolation
- All databases: SELECT FOR UPDATE locks matching + potential rows`,
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 6,
  },

  // ============================================================================
  // Locking Strategies - Pessimistic vs Optimistic
  // ============================================================================
  {
    id: 'locking-q1-pessimistic-tickets',
    conceptId: 'locking-strategies',
    scenario: {
      context: 'Concert tickets: 10,000 users buying last 100 tickets',
      requirements: [
        'First-come-first-served guarantee',
        'No overselling',
        'Users wait for seat confirmation',
      ],
      metrics: {
        'Peak Concurrency': '10,000 concurrent requests',
        'Ticket Price': '$50',
      },
    },
    question: 'Why use pessimistic locking (SELECT FOR UPDATE) instead of optimistic locking?',
    questionType: 'design',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'High contention: Optimistic locking has 90%+ retry rate',
          keywords: ['high contention', 'retry', 'optimistic'],
          mustMention: true,
        },
        {
          concept: 'Pessimistic locking serializes requests (queue-based)',
          keywords: ['pessimistic', 'serialize', 'queue', 'select for update'],
          mustMention: true,
        },
        {
          concept: 'User experience: "In queue" better than "retry failed"',
          keywords: ['user experience', 'queue', 'retry'],
          mustMention: true,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Locking Strategy',
          option1: 'Optimistic (500 TPS, 90% retry, users frustrated)',
          option2: 'Pessimistic (2,000 TPS, 0% retry, users queued)',
          reasoning: 'High contention favors pessimistic locking',
        },
      ],
    },
    explanation: `High Contention Scenario:
- 10,000 users competing for 100 tickets
- 100:1 contention ratio

Optimistic Locking:
- 9,900 users get "conflict, retry" errors
- 60% abandon after 3 retries = $300k lost revenue

Pessimistic Locking:
- Users queued: "Position 1,234, wait 30 seconds"
- 95% completion rate = $25k lost revenue
- $275k/year better outcome

Rule: Use pessimistic when contention > 50%`,
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 7,
  },

  {
    id: 'locking-q2-optimistic-profile',
    conceptId: 'locking-strategies',
    scenario: {
      context: 'User profile updates: 1M users, each updates once/day',
      requirements: [
        'Update name, email, preferences',
        'Low probability of same user updating from 2 devices',
        'Fast response time required',
      ],
      metrics: {
        'Conflict Rate': '<0.1% (1 in 1000)',
        'Latency Target': '<50ms p99',
      },
    },
    question: 'Why use optimistic locking (version column) instead of pessimistic locking?',
    questionType: 'design',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Low contention: Optimistic locking has minimal retries',
          keywords: ['low contention', 'minimal retries', 'optimistic'],
          mustMention: true,
        },
        {
          concept: 'No lock overhead: Faster p99 latency (10ms vs 50ms)',
          keywords: ['no lock', 'faster', 'latency'],
          mustMention: true,
        },
        {
          concept: 'Version column: WHERE version=old_version',
          keywords: ['version', 'column', 'where', 'compare'],
          mustMention: true,
        },
      ],
      antipatterns: [
        'Using SELECT FOR UPDATE for low-contention updates',
        'Not handling version conflicts gracefully',
        'Infinite retry loops',
      ],
    },
    explanation: `Optimistic Locking Implementation:
SELECT id, name, email, version FROM users WHERE id=123;
-- Returns: { name: 'Alice', email: 'alice@example.com', version: 5 }

UPDATE users
SET name='Alice Smith', email='alice.smith@example.com', version=6
WHERE id=123 AND version=5;

if (rowsAffected === 0) {
  // Conflict: another device updated profile
  // Show merge UI or retry
}

Performance:
- 99.9% success rate (no conflict)
- 10ms latency (no lock wait)
- 0.1% conflict → show "Profile updated elsewhere, refresh?"

Rule: Use optimistic when contention < 5%`,
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 5,
  },

  {
    id: 'locking-q3-hybrid-ecommerce',
    conceptId: 'locking-strategies',
    scenario: {
      context: 'E-commerce platform: Handle both inventory and shopping carts',
      requirements: [
        'Inventory: High contention (Black Friday, limited stock)',
        'Shopping cart: Low contention (per-user)',
        'Different locking strategies needed',
      ],
    },
    question: 'How would you design a hybrid locking strategy?',
    questionType: 'design',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Inventory: Pessimistic locking (SELECT FOR UPDATE)',
          keywords: ['inventory', 'pessimistic', 'select for update'],
          mustMention: true,
        },
        {
          concept: 'Shopping cart: Optimistic locking (version column)',
          keywords: ['cart', 'optimistic', 'version'],
          mustMention: true,
        },
        {
          concept: 'Choose strategy based on contention level',
          keywords: ['contention', 'strategy', 'choose'],
          mustMention: true,
        },
      ],
    },
    explanation: `Hybrid Approach:

// High Contention: Inventory (Pessimistic)
BEGIN TRANSACTION;
  SELECT quantity FROM inventory
  WHERE product_id='iphone15'
  FOR UPDATE; -- Lock prevents overselling

  UPDATE inventory SET quantity = quantity - 1;
COMMIT;

// Low Contention: Cart (Optimistic)
UPDATE carts
SET items=?, version=version+1
WHERE user_id=? AND version=?;

if (rowsAffected === 0) retry();

Result:
- Inventory: No overselling (critical)
- Cart: Fast updates, 99.9% success rate (user experience)`,
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 6,
  },

  // ============================================================================
  // Two-Phase Locking & Deadlocks
  // ============================================================================
  {
    id: 'deadlock-q1-detection',
    conceptId: 'deadlocks',
    scenario: {
      context: 'Order processing system with deadlocks occurring',
      requirements: [
        'T1: Lock Order → Lock Inventory',
        'T2: Lock Inventory → Lock Order',
        'Deadlock: T1 waits for T2, T2 waits for T1',
      ],
    },
    question: 'How do databases detect and resolve deadlocks? What are the trade-offs?',
    questionType: 'design',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Deadlock detection: Build wait-for graph, detect cycles',
          keywords: ['wait-for graph', 'cycle detection', 'deadlock detection'],
          mustMention: true,
        },
        {
          concept: 'Resolution: Abort one transaction (victim selection)',
          keywords: ['abort', 'victim', 'rollback'],
          mustMention: true,
        },
        {
          concept: 'Application must retry aborted transaction',
          keywords: ['retry', 'application', 'handle'],
          mustMention: true,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Deadlock Handling',
          option1: 'Timeout (simple, false positives)',
          option2: 'Cycle detection (accurate, overhead)',
          reasoning: 'Detection accuracy vs CPU overhead',
        },
      ],
    },
    explanation: `Deadlock Detection:
1. Database maintains wait-for graph:
   T1 → T2 (T1 waits for T2's lock)
   T2 → T1 (T2 waits for T1's lock)

2. Detect cycle: T1 → T2 → T1 (deadlock!)

3. Select victim (youngest transaction, fewer locks)

4. Abort victim, release locks

5. Application sees error: "deadlock detected"

Prevention vs Detection:
- Prevention: Lock ordering (never deadlock, less flexible)
- Detection: Allow deadlocks, detect and resolve (flexible, overhead)`,
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 6,
  },

  {
    id: 'deadlock-q2-prevention',
    conceptId: 'deadlocks',
    scenario: {
      context: 'Microservices transferring money: Account A ↔ Account B',
      requirements: [
        'Service 1: Transfer A → B',
        'Service 2: Transfer B → A',
        'Potential circular lock dependency',
      ],
    },
    question: 'How would you prevent deadlocks using lock ordering?',
    questionType: 'design',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Lock ordering: Always lock accounts in sorted order (A before B)',
          keywords: ['lock ordering', 'sorted', 'consistent order'],
          mustMention: true,
        },
        {
          concept: 'Both transactions lock in same order: A then B',
          keywords: ['same order', 'both transactions'],
          mustMention: true,
        },
        {
          concept: 'Eliminates circular dependency',
          keywords: ['eliminates', 'circular', 'prevents deadlock'],
          mustMention: true,
        },
      ],
      antipatterns: [
        'Locking in arbitrary order',
        'Locking source first, then destination',
        'Not sorting account IDs',
      ],
    },
    explanation: `Deadlock Prevention with Lock Ordering:

// BAD: Lock in transaction order
Transfer(from=A, to=B): lock(A) → lock(B)
Transfer(from=B, to=A): lock(B) → lock(A) ❌ Deadlock!

// GOOD: Lock in sorted ID order
Transfer(from, to):
  accounts = sort([from, to])  // Always [A, B]
  lock(accounts[0])  // Lock A first
  lock(accounts[1])  // Lock B second

Transfer(from=A, to=B): lock(A) → lock(B) ✓
Transfer(from=B, to=A): lock(A) → lock(B) ✓ No deadlock!

Implementation:
BEGIN TRANSACTION;
  SELECT * FROM accounts
  WHERE id IN ('A', 'B')
  ORDER BY id  -- Critical: consistent order
  FOR UPDATE;

  -- Transfer logic
COMMIT;`,
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 6,
  },

  // ============================================================================
  // MVCC (Multi-Version Concurrency Control)
  // ============================================================================
  {
    id: 'mvcc-q1-snapshot-isolation',
    conceptId: 'mvcc',
    scenario: {
      context: 'Banking app: Long-running report while transactions execute',
      requirements: [
        'Generate account balance report (30 minutes)',
        'Thousands of deposits/withdrawals during report',
        'Report must show consistent snapshot',
      ],
    },
    question: 'How does MVCC provide snapshot isolation without blocking writes?',
    questionType: 'design',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'MVCC keeps multiple versions of each row',
          keywords: ['mvcc', 'multiple versions', 'versioning'],
          mustMention: true,
        },
        {
          concept: 'Each transaction sees snapshot from its start time',
          keywords: ['snapshot', 'start time', 'transaction id'],
          mustMention: true,
        },
        {
          concept: 'Readers don\'t block writers, writers don\'t block readers',
          keywords: ['readers', 'writers', 'don\'t block', 'concurrent'],
          mustMention: true,
        },
      ],
    },
    explanation: `MVCC Mechanism:
1. Each row has transaction ID (xmin, xmax):
   accounts: { id: 123, balance: 1000, xmin: 100, xmax: ∞ }

2. Transaction T1 (id=200) starts:
   Snapshot: See all rows where xmin < 200 and xmax > 200

3. Transaction T2 (id=201) updates balance → 1500:
   Old version: { balance: 1000, xmin: 100, xmax: 201 }
   New version: { balance: 1500, xmin: 201, xmax: ∞ }

4. T1 still sees balance=1000 (old version)
   T2 sees balance=1500 (new version)

5. No locking needed for reads!

Benefits:
- Long-running reports don't block updates
- Consistent snapshot without locks
- Higher concurrency (10,000+ TPS)`,
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 7,
  },

  {
    id: 'mvcc-q2-garbage-collection',
    conceptId: 'mvcc',
    scenario: {
      context: 'High-update workload: Product prices updated every minute',
      requirements: [
        '100M products, prices change frequently',
        'Old versions accumulate',
        'Disk usage growing 10GB/day',
      ],
    },
    question: 'How does MVCC handle old versions? What are the trade-offs?',
    questionType: 'design',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Vacuum process removes old versions no longer visible',
          keywords: ['vacuum', 'remove', 'old versions', 'garbage collection'],
          mustMention: true,
        },
        {
          concept: 'Long-running transactions prevent cleanup (bloat)',
          keywords: ['long-running', 'prevent cleanup', 'bloat'],
          mustMention: true,
        },
        {
          concept: 'Trade-off: Snapshot isolation vs disk usage',
          keywords: ['trade-off', 'disk', 'storage'],
          mustMention: false,
        },
      ],
    },
    explanation: `MVCC Garbage Collection:

Problem:
- 100M products × 1440 updates/day = 144B row versions/day
- Old versions needed for active transactions
- Vacuum removes versions invisible to all transactions

PostgreSQL VACUUM:
1. Identify rows with xmax < oldest active transaction
2. Mark dead tuples as reusable
3. Update free space map

Bloat from long-running transactions:
- Transaction runs for 8 hours
- 8 hours of updates can't be vacuumed
- Disk bloat: 60GB (8 hours × 10GB/day / 24)

Best Practices:
- Keep transactions short (<1 minute for OLTP)
- Use separate replica for long reports
- Monitor transaction age: max(now() - xact_start)`,
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 6,
  },

  // ============================================================================
  // Serializable Snapshot Isolation (SSI)
  // ============================================================================
  {
    id: 'ssi-q1-conflict-detection',
    conceptId: 'serializable-snapshot-isolation',
    scenario: {
      context: 'PostgreSQL Serializable isolation for booking system',
      requirements: [
        'Prevent double-booking without locks',
        'Detect conflicts and abort one transaction',
        'Higher throughput than 2PL',
      ],
    },
    question: 'How does SSI detect write skew without locks? What are the retry implications?',
    questionType: 'design',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'SSI tracks read/write dependencies between transactions',
          keywords: ['ssi', 'dependencies', 'track', 'read-write'],
          mustMention: true,
        },
        {
          concept: 'Detects dangerous structures (rw-conflicts forming cycle)',
          keywords: ['dangerous structure', 'cycle', 'conflict'],
          mustMention: true,
        },
        {
          concept: 'Aborts transaction with serialization failure',
          keywords: ['abort', 'serialization failure', 'retry'],
          mustMention: true,
        },
      ],
    },
    explanation: `SSI Conflict Detection:

Scenario: Booking last seat
T1 (read snapshot): SELECT available → 1 seat
T2 (read snapshot): SELECT available → 1 seat
T1: INSERT booking, UPDATE available → 0
T2: INSERT booking, UPDATE available → -1

SSI Detection:
1. T1 reads seats (track: T2 might modify)
2. T2 reads seats (track: T1 might modify)
3. T1 writes seats (rw-conflict: T2 read before T1 write)
4. T2 writes seats (rw-conflict: T1 read before T2 write)
5. Cycle detected! Abort T2.

T2 sees error: "could not serialize access due to concurrent update"

Application must retry T2:
- 1-3 retry attempts with exponential backoff
- Success rate: 95%+ for moderate contention

Advantage over 2PL:
- No locks (higher throughput)
- No deadlocks (only serialization failures)`,
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 8,
  },

  // ============================================================================
  // Distributed Transactions
  // ============================================================================
  {
    id: 'distributed-q1-two-phase-commit',
    conceptId: 'distributed-transactions',
    scenario: {
      context: 'Microservices: Order service + Payment service + Inventory service',
      requirements: [
        'Create order (Order DB)',
        'Charge payment (Payment DB)',
        'Decrement inventory (Inventory DB)',
        'All 3 must succeed or all fail (atomicity)',
      ],
    },
    question: 'How does Two-Phase Commit (2PC) work? What are the failure scenarios?',
    questionType: 'design',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Phase 1 (Prepare): Coordinator asks participants to prepare',
          keywords: ['phase 1', 'prepare', 'coordinator', 'participants'],
          mustMention: true,
        },
        {
          concept: 'Phase 2 (Commit): If all prepared, coordinator sends commit',
          keywords: ['phase 2', 'commit', 'all prepared'],
          mustMention: true,
        },
        {
          concept: 'Coordinator failure blocks all participants (holding locks)',
          keywords: ['coordinator failure', 'blocks', 'holding locks'],
          mustMention: true,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Distributed Transactions',
          option1: '2PC (atomic, slow, blocking)',
          option2: 'Saga (eventual consistency, fast, non-blocking)',
          reasoning: 'Atomicity vs availability trade-off',
        },
      ],
      antipatterns: [
        'Using 2PC for high-throughput systems',
        'Not handling coordinator failures',
        'Holding locks during network calls',
      ],
    },
    explanation: `Two-Phase Commit Flow:

Phase 1: Prepare
Coordinator → Order: "Prepare to commit"
  Order: BEGIN; INSERT order; Ready? ✓
Coordinator → Payment: "Prepare to commit"
  Payment: BEGIN; Charge card; Ready? ✓
Coordinator → Inventory: "Prepare to commit"
  Inventory: BEGIN; Decrement stock; Ready? ✓

Phase 2: Commit
Coordinator: All prepared ✓
Coordinator → All: "Commit!"
  Order: COMMIT ✓
  Payment: COMMIT ✓
  Inventory: COMMIT ✓

Failure Scenario:
1. Coordinator crashes after "Prepare" but before "Commit"
2. All participants hold locks, waiting forever
3. Participants blocked (can't commit or rollback without coordinator)

Why 2PC is problematic:
- Synchronous blocking (low throughput)
- Single point of failure (coordinator)
- Locks held across network calls (latency amplification)

Alternatives:
- Saga pattern (choreography or orchestration)
- Event sourcing with eventual consistency
- Idempotent operations with retry`,
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 10,
  },

  {
    id: 'distributed-q2-saga-vs-2pc',
    conceptId: 'distributed-transactions',
    scenario: {
      context: 'E-commerce order flow: Order → Payment → Fulfillment',
      requirements: [
        'Handle partial failures gracefully',
        'Payment fails after order created',
        'Need to cancel order and refund',
      ],
    },
    question: 'Why use Saga pattern instead of 2PC? How do you handle compensating transactions?',
    questionType: 'design',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Saga: Chain of local transactions with compensating actions',
          keywords: ['saga', 'local transactions', 'compensating'],
          mustMention: true,
        },
        {
          concept: 'Each step commits immediately (no locks held)',
          keywords: ['commits immediately', 'no locks', 'asynchronous'],
          mustMention: true,
        },
        {
          concept: 'Rollback via compensating transactions (cancel order, refund)',
          keywords: ['compensating transactions', 'rollback', 'cancel', 'refund'],
          mustMention: true,
        },
      ],
      tradeoffs: [
        {
          aspect: 'Consistency Model',
          option1: '2PC (strong consistency, low availability)',
          option2: 'Saga (eventual consistency, high availability)',
          reasoning: 'CAP theorem: Choose availability over immediate consistency',
        },
      ],
    },
    explanation: `Saga Pattern Implementation:

Forward Flow (Success):
1. Create Order → COMMIT (order_status=pending)
2. Charge Payment → COMMIT (payment_status=charged)
3. Fulfill Order → COMMIT (order_status=shipped)

Rollback Flow (Payment fails):
1. Create Order → COMMIT ✓
2. Charge Payment → FAIL ✗
3. Compensate: Cancel Order → COMMIT (order_status=cancelled)

Compensating Transactions:
- Create Order ↔ Cancel Order
- Charge Payment ↔ Refund Payment
- Ship Order ↔ Initiate Return

Saga Orchestration:
const orderSaga = async (orderId) => {
  try {
    await orderService.create(orderId);
    await paymentService.charge(orderId);
    await fulfillmentService.ship(orderId);
  } catch (error) {
    // Compensate in reverse order
    await fulfillmentService.cancelShipment(orderId);
    await paymentService.refund(orderId);
    await orderService.cancel(orderId);
  }
};

Advantages over 2PC:
- No distributed locks (higher throughput)
- Partial failures handled gracefully
- Services remain available
- Eventually consistent (acceptable for orders)`,
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 9,
  },
];
