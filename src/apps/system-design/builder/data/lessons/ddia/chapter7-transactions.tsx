import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter7TransactionsLesson: SystemDesignLesson = {
  id: 'ddia-ch7-transactions',
  slug: 'ddia-ch7-transactions',
  title: 'Transactions (DDIA Ch. 7)',
  description: 'Master transaction isolation trade-offs: WHEN to use Read Committed vs Serializable, HOW isolation affects throughput (10× penalty), WHICH locking strategy prevents data corruption while maintaining performance.',
  category: 'fundamentals',
  difficulty: 'advanced',
  estimatedMinutes: 110,

  // Progressive flow metadata
  moduleId: 'sd-module-4-ddia',
  sequenceOrder: 6,
  stages: [
    {
      id: 'intro-acid',
      type: 'concept',
      title: 'ACID Properties',
      content: (
        <Section>
          <H1>ACID Properties</H1>
          <P>
            <Strong>ACID</Strong> is an acronym for the four key properties of transactions:
          </P>
          <UL>
            <LI><Strong>Atomicity:</Strong> All operations in a transaction succeed or all fail (all-or-nothing)</LI>
            <LI><Strong>Consistency:</Strong> Database remains in a valid state (constraints satisfied)</LI>
            <LI><Strong>Isolation:</Strong> Concurrent transactions don't interfere with each other</LI>
            <LI><Strong>Durability:</Strong> Committed transactions survive crashes (written to disk)</LI>
          </UL>

          <Example title="E-commerce Checkout">
            <CodeBlock>
{`BEGIN TRANSACTION;
  INSERT INTO orders (user_id, total) VALUES (123, 100.00);
  INSERT INTO payments (order_id, amount) VALUES (order_id, 100.00);
  UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 456;
COMMIT;

// If any step fails, entire transaction rolls back
// All-or-nothing guarantee`}
            </CodeBlock>
          </Example>
        </Section>
      ),
    },
    {
      id: 'isolation-levels',
      type: 'concept',
      title: 'Isolation Levels & Concurrency Issues',
      content: (
        <Section>
          <H1>Isolation Levels & Concurrency Issues</H1>
          <P>
            Different <Strong>isolation levels</Strong> provide different guarantees about what concurrent
            transactions can see. Higher isolation = fewer anomalies but lower performance.
          </P>

          <H2>Isolation Levels (Weakest to Strongest)</H2>
          <OL>
            <LI><Strong>Read Uncommitted:</Strong> Can read uncommitted data (dirty reads)</LI>
            <LI><Strong>Read Committed:</Strong> Only read committed data (prevents dirty reads)</LI>
            <LI><Strong>Repeatable Read:</Strong> Same query returns same results (prevents non-repeatable reads)</LI>
            <LI><Strong>Serializable:</Strong> Transactions execute as if serially (prevents all anomalies)</LI>
          </OL>

          <H2>Common Concurrency Issues</H2>
          <UL>
            <LI><Strong>Dirty Read:</Strong> Read uncommitted data that may be rolled back</LI>
            <LI><Strong>Dirty Write:</Strong> Overwrite uncommitted data from another transaction</LI>
            <LI><Strong>Read Skew:</Strong> Inconsistent reads of related data</LI>
            <LI><Strong>Write Skew:</Strong> Two transactions read same data, make conflicting writes</LI>
            <LI><Strong>Phantom Read:</Strong> New rows appear between reads</LI>
          </UL>

          <Example title="Write Skew - Double Booking">
            <CodeBlock>
{`// Problem: Two users book last available room
// T1: SELECT COUNT(*) FROM bookings WHERE room_id=101 AND date='2024-12-15'  -- Returns 0
// T2: SELECT COUNT(*) FROM bookings WHERE room_id=101 AND date='2024-12-15'  -- Returns 0
// T1: INSERT INTO bookings (room_id, date) VALUES (101, '2024-12-15')
// T2: INSERT INTO bookings (room_id, date) VALUES (101, '2024-12-15')
// Result: Both bookings succeed! (Write skew)

// Solution: Serializable isolation or SELECT FOR UPDATE
SELECT * FROM rooms WHERE id=101 FOR UPDATE;  // Lock row
INSERT INTO bookings ...;`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Most databases default to Read Committed.</Strong> Use Serializable only when necessary (prevents write skew).
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'locking',
      type: 'concept',
      title: 'Locking Strategies',
      content: (
        <Section>
          <H1>Locking Strategies</H1>
          <P>
            Locks prevent concurrent access to the same data. Two main approaches:
          </P>

          <H2>Pessimistic Locking</H2>
          <UL>
            <LI>Lock data before reading/writing</LI>
            <LI>Other transactions wait until lock released</LI>
            <LI>Example: <Code>SELECT FOR UPDATE</Code></LI>
          </UL>

          <H2>Optimistic Locking</H2>
          <UL>
            <LI>Read data without locking</LI>
            <LI>Check version/timestamp before writing</LI>
            <LI>If version changed, retry or fail</LI>
            <LI>Example: Version field, compare-and-swap</LI>
          </UL>

          <Example title="Optimistic Locking">
            <CodeBlock>
{`// Read with version
SELECT id, name, version FROM users WHERE id=123;
// version = 5

// Update with version check
UPDATE users 
SET name='Alice', version=6 
WHERE id=123 AND version=5;

// If version changed, update returns 0 rows
// Application retries or reports conflict`}
            </CodeBlock>
          </Example>

          <ComparisonTable
            headers={['Aspect', 'Pessimistic', 'Optimistic']}
            rows={[
              ['Lock Timing', 'Before read/write', 'During write only'],
              ['Performance', 'Lower (blocks others)', 'Higher (no blocking)'],
              ['Conflict Handling', 'Prevents conflicts', 'Detects conflicts'],
              ['Use Case', 'High contention', 'Low contention'],
            ]}
          />
        </Section>
      ),
    },
    {
      id: 'two-phase-locking',
      type: 'concept',
      title: 'Two-Phase Locking & Deadlocks',
      content: (
        <Section>
          <H1>Two-Phase Locking & Deadlocks</H1>
          <P>
            <Strong>Two-Phase Locking (2PL)</Strong> ensures serializable isolation:
          </P>
          <OL>
            <LI><Strong>Growing Phase:</Strong> Acquire locks, never release</LI>
            <LI><Strong>Shrinking Phase:</Strong> Release locks, never acquire</LI>
          </OL>

          <H2>Deadlocks</H2>
          <P>
            <Strong>Deadlocks</Strong> occur when two transactions wait for each other's locks:
          </P>
          <UL>
            <LI>T1 locks A, T2 locks B</LI>
            <LI>T1 tries to lock B (waits for T2)</LI>
            <LI>T2 tries to lock A (waits for T1)</LI>
            <LI>Both wait forever → Deadlock!</LI>
          </UL>

          <H2>Deadlock Detection & Prevention</H2>
          <UL>
            <LI><Strong>Timeout:</Strong> Abort transaction after timeout</LI>
            <LI><Strong>Deadlock Detection:</Strong> Build wait-for graph, detect cycles, abort one transaction</LI>
            <LI><Strong>Lock Ordering:</Strong> Always acquire locks in same order (prevents deadlocks)</LI>
          </UL>

          <Example title="Deadlock Prevention">
            <CodeBlock>
{`// BAD: Different lock order
T1: lock(A) -> lock(B)
T2: lock(B) -> lock(A)  // Deadlock possible!

// GOOD: Same lock order
T1: lock(A) -> lock(B)
T2: lock(A) -> lock(B)  // No deadlock`}
            </CodeBlock>
          </Example>
        </Section>
      ),
    },
    {
      id: 'isolation-levels-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Read Committed vs Repeatable Read vs Serializable',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Read Committed vs Repeatable Read vs Serializable</H1>
          <P>
            Isolation level determines <Strong>data consistency guarantees vs throughput</Strong>.
            Serializable isolation can reduce throughput by 10× but prevents all concurrency bugs.
          </P>

          <Divider />

          <H2>📊 Isolation Level Comparison</H2>
          <ComparisonTable
            headers={['Metric', 'Read Committed', 'Repeatable Read', 'Serializable']}
            rows={[
              ['Throughput (TPS)', '10,000 TPS (baseline)', '7,000 TPS (30% lower)', '1,000 TPS (90% lower)'],
              ['Dirty Reads', '✅ Prevented', '✅ Prevented', '✅ Prevented'],
              ['Non-Repeatable Reads', '❌ Possible', '✅ Prevented', '✅ Prevented'],
              ['Phantom Reads', '❌ Possible', '⚠️ Possible (MySQL prevents)', '✅ Prevented'],
              ['Write Skew', '❌ Possible', '❌ Possible', '✅ Prevented'],
              ['Lost Updates', '⚠️ Possible (without locking)', '⚠️ Possible', '✅ Prevented'],
              ['Implementation', 'Row-level locks', 'MVCC snapshots', '2PL or SSI'],
              ['Default Database', 'PostgreSQL, Oracle, SQL Server', 'MySQL (InnoDB)', 'None (opt-in)'],
              ['Use Case', '99% of apps', 'Financial reports', 'Double-booking prevention'],
            ]}
          />

          <Divider />

          <H2>💡 Real-World Example: E-Commerce Inventory System</H2>

          <H3>Read Committed (Fast, Allows Anomalies)</H3>
          <CodeBlock>
{`// PostgreSQL default: Read Committed
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

// Scenario: Black Friday sale - 100 iPhone units available
// Problem: Overselling due to write skew

BEGIN TRANSACTION;
  SELECT quantity FROM inventory WHERE product_id='iphone15' AND quantity > 0;
  // Returns 1 (last unit available)

  // Delay... another transaction also reads quantity=1

  INSERT INTO orders (product_id, user_id) VALUES ('iphone15', 'user123');
  UPDATE inventory SET quantity = quantity - 1 WHERE product_id='iphone15';
COMMIT;

// Meanwhile, another transaction:
BEGIN TRANSACTION;
  SELECT quantity FROM inventory WHERE product_id='iphone15' AND quantity > 0;
  // Returns 1 (same!)

  INSERT INTO orders (product_id, user_id) VALUES ('iphone15', 'user456');
  UPDATE inventory SET quantity = quantity - 1 WHERE product_id='iphone15';
COMMIT;

// Result: 2 orders for 1 unit in stock!
// Quantity becomes -1 (oversold)

// Performance: 10,000 TPS, but data corruption risk`}
          </CodeBlock>

          <H3>Serializable (Slow, Prevents All Anomalies)</H3>
          <CodeBlock>
{`// Serializable Snapshot Isolation (SSI)
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

BEGIN TRANSACTION;
  SELECT quantity FROM inventory WHERE product_id='iphone15' AND quantity > 0;
  // Returns 1

  INSERT INTO orders (product_id, user_id) VALUES ('iphone15', 'user123');
  UPDATE inventory SET quantity = quantity - 1 WHERE product_id='iphone15';
COMMIT;
// ✅ Transaction 1 commits successfully

BEGIN TRANSACTION;
  SELECT quantity FROM inventory WHERE product_id='iphone15' AND quantity > 0;
  // Returns 1 (from snapshot)

  INSERT INTO orders (product_id, user_id) VALUES ('iphone15', 'user456');
  UPDATE inventory SET quantity = quantity - 1 WHERE product_id='iphone15';
COMMIT;
// ❌ SERIALIZATION FAILURE! Detects conflict, aborts transaction
// Application must retry

// Performance: 1,000-2,000 TPS (10× slower)
// ROI: Prevents $50k/year in inventory reconciliation costs`}
          </CodeBlock>

          <KeyPoint>
            <Strong>Isolation Decision Matrix:</Strong><br />
            • <Strong>Read Committed:</Strong> 99% of web apps (social media, content sites)<br />
            • <Strong>Repeatable Read:</Strong> Financial reports, analytics (consistent snapshot)<br />
            • <Strong>Serializable:</Strong> Inventory, bookings, financial transactions (prevent write skew)<br /><br />
            <Strong>Golden Rule:</Strong> Use Read Committed by default. Upgrade to Serializable only for
            critical operations (inventory, payments) where data corruption is unacceptable.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'pessimistic-vs-optimistic-locking-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Pessimistic vs Optimistic Locking',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Pessimistic vs Optimistic Locking</H1>
          <P>
            Locking strategy determines <Strong>concurrency vs data integrity</Strong>.
            Pessimistic locking reduces throughput by 5× but guarantees conflict resolution.
          </P>

          <Divider />

          <H2>📊 Locking Strategy Comparison</H2>
          <ComparisonTable
            headers={['Metric', 'Pessimistic Locking', 'Optimistic Locking']}
            rows={[
              ['Throughput (Low Contention)', '5,000 TPS', '10,000 TPS (2× faster)'],
              ['Throughput (High Contention)', '2,000 TPS', '500 TPS (4× slower, retries)'],
              ['Latency (p99)', '50ms (waiting for locks)', '10ms (no lock wait, but retries)'],
              ['Lock Acquisition', 'Before read (FOR UPDATE)', 'None (version check)'],
              ['Conflict Handling', 'Waits (blocks)', 'Retries (abort + retry)'],
              ['Deadlock Risk', '🔴 High (lock ordering needed)', '✅ None (no locks)'],
              ['User Experience', '⚠️ Slow under contention', '✅ Fast, but retry failures'],
              ['Implementation', 'SELECT FOR UPDATE', 'Version column + CAS'],
              ['Use Case', 'High contention (inventory)', 'Low contention (user profiles)'],
            ]}
          />

          <Divider />

          <H2>💡 Real-World Example: Ticket Booking System</H2>

          <H3>Pessimistic Locking (Inventory, High Contention)</H3>
          <CodeBlock>
{`// Concert tickets: 100 users trying to book last 10 seats
// Pessimistic locking ensures first-come-first-served

BEGIN TRANSACTION;
  // Lock row immediately (other transactions wait)
  SELECT seat_id, status FROM seats
  WHERE concert_id=123 AND status='available'
  LIMIT 1
  FOR UPDATE;

  // seat_id=50, status='available'
  // Lock acquired, other transactions WAIT

  // User confirms booking (5 seconds later)
  UPDATE seats SET status='booked', user_id='user789'
  WHERE seat_id=50;

  INSERT INTO bookings (user_id, seat_id) VALUES ('user789', 50);
COMMIT;
// Lock released, next waiting transaction proceeds

// Throughput: 2,000 bookings/sec (high contention, serialized)
// User Experience: "Please wait... seat reserved for 30 seconds"
// Benefit: No double bookings, guaranteed fairness`}
          </CodeBlock>

          <H3>Optimistic Locking (User Profiles, Low Contention)</H3>
          <CodeBlock>
{`// User profile updates: 1M users, each updates once/day (low contention)

// Step 1: Read with version
SELECT id, name, email, version FROM users WHERE id='user123';
// Returns: { id: 'user123', name: 'Alice', email: 'alice@example.com', version: 5 }

// Step 2: User edits profile (no lock held)
// Application logic...

// Step 3: Update with version check (optimistic assumption: no conflict)
UPDATE users
SET name='Alice Smith', email='alice.smith@example.com', version=6
WHERE id='user123' AND version=5;

// Check rows affected
if (rowsAffected === 0) {
  // Version mismatch: another transaction updated user
  // Re-read current version and retry
  const currentUser = await db.query('SELECT * FROM users WHERE id=?', ['user123']);
  // Show conflict to user: "Profile was updated, please review changes"
  throw new ConcurrentModificationError();
} else {
  // Success! No conflict
  return { success: true };
}

// Throughput: 10,000 updates/sec (no lock contention)
// Conflict Rate: 0.1% (1 in 1000 updates conflicts, retries)
// User Experience: Fast updates, rare "please retry" messages`}
          </CodeBlock>

          <H3>Hybrid Approach: Pessimistic for Critical, Optimistic for Bulk</H3>
          <CodeBlock>
{`// E-Commerce: Use both strategies based on contention

// High Contention: Inventory (pessimistic)
async function reserveInventory(productId, quantity) {
  return db.transaction(async (tx) => {
    // Lock inventory row
    const inventory = await tx.query(\`
      SELECT quantity FROM inventory
      WHERE product_id = ?
      FOR UPDATE
    \`, [productId]);

    if (inventory.quantity < quantity) {
      throw new InsufficientInventoryError();
    }

    // Update within lock
    await tx.query(\`
      UPDATE inventory
      SET quantity = quantity - ?
      WHERE product_id = ?
    \`, [quantity, productId]);
  });
}

// Low Contention: User cart (optimistic)
async function updateCart(userId, items) {
  const cart = await db.query(\`
    SELECT id, items, version FROM carts WHERE user_id = ?
  \`, [userId]);

  const result = await db.query(\`
    UPDATE carts
    SET items = ?, version = ?
    WHERE user_id = ? AND version = ?
  \`, [JSON.stringify(items), cart.version + 1, userId, cart.version]);

  if (result.rowsAffected === 0) {
    // Rare: cart updated from another device, retry
    return updateCart(userId, items);  // Retry once
  }
}

// Result:
// - Inventory: No overselling (pessimistic guarantees)
// - Cart: Fast updates, 99.9% success rate (optimistic for speed)`}
          </CodeBlock>

          <Divider />

          <H2>💰 ROI Analysis: Pessimistic vs Optimistic for Seat Reservations</H2>
          <InfoBox>
            <H3>Concert Ticketing Platform (100k Concerts/Year)</H3>
            <UL>
              <LI><Strong>Peak Demand:</Strong> Popular concerts sell out in 10 minutes</LI>
              <LI><Strong>Concurrency:</Strong> 10,000 users trying to book 100 seats simultaneously</LI>
              <LI><Strong>Ticket Price:</Strong> Average $50/ticket</LI>
            </UL>

            <H3>Optimistic Locking (High Retry Rate)</H3>
            <UL>
              <LI><Strong>Throughput:</Strong> 500 TPS (high contention, many retries)</LI>
              <LI><Strong>Retry Rate:</Strong> 80% (8 out of 10 attempts fail)</LI>
              <LI><Strong>Double Bookings:</Strong> 5% (500 incidents/year × $50 = $25k/year reconciliation)</LI>
              <LI><Strong>User Frustration:</Strong> 60% abandon after 3 retries</LI>
              <LI><Strong>Lost Revenue:</Strong> 60% × 10k users × $50 = <Strong>$300k/year</Strong></LI>
            </UL>

            <H3>Pessimistic Locking (Queue-Based)</H3>
            <UL>
              <LI><Strong>Throughput:</Strong> 2,000 TPS (serialized, no retries)</LI>
              <LI><Strong>Retry Rate:</Strong> 0% (queued, guaranteed processing)</LI>
              <LI><Strong>Double Bookings:</Strong> 0 (locks prevent conflicts)</LI>
              <LI><Strong>User Experience:</Strong> "In queue: position 1,234, estimated wait 30 seconds"</LI>
              <LI><Strong>Completion Rate:</Strong> 95% (users wait in queue)</LI>
              <LI><Strong>Lost Revenue:</Strong> 5% × 10k users × $50 = <Strong>$25k/year</Strong></LI>
            </UL>

            <H3>Cost-Benefit Analysis</H3>
            <UL>
              <LI><Strong>Revenue Saved:</Strong> $300k - $25k = <Strong>$275k/year</Strong></LI>
              <LI><Strong>Implementation Cost:</Strong> $50k (queueing system)</LI>
              <LI><Strong>Payback Period:</Strong> 2.2 months</LI>
              <LI><Strong>3-Year NPV:</Strong> <Strong>$775k savings</Strong></LI>
            </UL>

            <P>
              <Strong>Conclusion:</Strong> For high-contention scenarios (ticket sales, limited inventory),
              pessimistic locking provides 11× better revenue ($275k/year vs $25k/year lost).
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>Locking Strategy Guidelines:</Strong><br />
            • <Strong>Pessimistic:</Strong> High contention (inventory, seat bookings, financial accounts)<br />
            • <Strong>Optimistic:</Strong> Low contention (user profiles, settings, shopping carts)<br />
            • <Strong>Hybrid:</Strong> Critical paths use pessimistic, bulk operations use optimistic<br /><br />
            <Strong>Golden Rule:</Strong> Default to optimistic for most operations (&lt;5% conflict rate).
            Switch to pessimistic when conflicts cost more than throughput reduction.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

