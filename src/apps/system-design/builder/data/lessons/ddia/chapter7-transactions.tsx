import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter7TransactionsLesson: SystemDesignLesson = {
  id: 'ddia-ch7-transactions',
  slug: 'ddia-ch7-transactions',
  title: 'Transactions (DDIA Ch. 7)',
  description: 'Understand ACID properties, isolation levels, and how to prevent concurrency issues.',
  category: 'fundamentals',
  difficulty: 'advanced',
  estimatedMinutes: 90,
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
  ],
};

