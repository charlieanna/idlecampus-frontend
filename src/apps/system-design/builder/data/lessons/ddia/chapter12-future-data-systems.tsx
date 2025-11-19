import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter12FutureDataSystemsLesson: SystemDesignLesson = {
  id: 'ddia-ch12-future-data-systems',
  slug: 'ddia-ch12-future-data-systems',
  title: 'Future of Data Systems (DDIA Ch. 12)',
  description: 'Learn Lambda/Kappa architecture, event sourcing, CQRS, and change data capture.',
  category: 'fundamentals',
  difficulty: 'advanced',
  estimatedMinutes: 80,
  stages: [
    {
      id: 'intro-future',
      type: 'concept',
      title: 'Modern Data System Patterns',
      content: (
        <Section>
          <H1>Modern Data System Patterns</H1>
          <P>
            Modern data systems use patterns that separate concerns and enable better scalability:
          </P>
          <UL>
            <LI><Strong>Lambda Architecture:</Strong> Batch + stream processing</LI>
            <LI><Strong>Kappa Architecture:</Strong> Stream-only processing</LI>
            <LI><Strong>Event Sourcing:</Strong> Store events, derive state</LI>
            <LI><Strong>CQRS:</Strong> Separate read and write models</LI>
            <LI><Strong>Change Data Capture (CDC):</Strong> Stream database changes</LI>
          </UL>
        </Section>
      ),
    },
    {
      id: 'lambda-kappa',
      type: 'concept',
      title: 'Lambda & Kappa Architecture',
      content: (
        <Section>
          <H1>Lambda & Kappa Architecture</H1>
          <P>
            <Strong>Lambda Architecture</Strong> combines batch and stream processing to get both accuracy and low latency.
          </P>

          <H2>Lambda Architecture</H2>
          <UL>
            <LI><Strong>Batch Layer:</Strong> Process all data from scratch (accurate, slow)</LI>
            <LI><Strong>Speed Layer:</Strong> Process recent data incrementally (fast, approximate)</LI>
            <LI><Strong>Serving Layer:</Strong> Merge batch and speed results</LI>
          </UL>

          <Example title="Lambda Architecture">
            <CodeBlock>
{`// Batch Layer (runs daily)
batch_views = process_all_data_from_scratch()
// Accurate but takes hours

// Speed Layer (real-time)
recent_views = process_last_hour_incrementally()
// Fast but approximate

// Serving Layer (query time)
total_views = batch_views + recent_views
// Combines accuracy + freshness`}
            </CodeBlock>
          </Example>

          <H2>Kappa Architecture</H2>
          <P>
            <Strong>Kappa Architecture</Strong> simplifies Lambda by using only stream processing:
          </P>
          <UL>
            <LI>Single stream processing pipeline</LI>
            <LI>Replay stream from beginning for historical queries</LI>
            <LI>Simpler than Lambda (no batch layer to maintain)</LI>
          </UL>

          <ComparisonTable
            headers={['Aspect', 'Lambda', 'Kappa']}
            rows={[
              ['Complexity', 'High (two pipelines)', 'Lower (one pipeline)'],
              ['Accuracy', 'Eventually accurate', 'Eventually accurate'],
              ['Latency', 'Batch: hours, Speed: seconds', 'Seconds'],
              ['Maintenance', 'Two codebases', 'One codebase'],
            ]}
          />

          <KeyPoint>
            <Strong>Use Kappa:</Strong> When stream processing can handle all use cases. Simpler than Lambda.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'event-sourcing',
      type: 'concept',
      title: 'Event Sourcing',
      content: (
        <Section>
          <H1>Event Sourcing</H1>
          <P>
            <Strong>Event Sourcing</Strong> stores all changes to application state as a sequence of events
            (immutable log). Current state is derived by replaying events.
          </P>

          <H2>Benefits</H2>
          <UL>
            <LI><Strong>Audit Log:</Strong> Complete history of all changes</LI>
            <LI><Strong>Time Travel:</Strong> Reconstruct state at any point in time</LI>
            <LI><Strong>Debugging:</Strong> See exactly what happened</LI>
            <LI><Strong>Flexibility:</Strong> Derive new views from events</LI>
          </UL>

          <Example title="Event Sourcing">
            <CodeBlock>
{`// Event Log (immutable)
Event 1: UserCreated {user_id: 123, name: "Alice"}
Event 2: UserUpdated {user_id: 123, name: "Alice Smith"}
Event 3: UserDeleted {user_id: 123}

// Current State (derived)
replay([Event1, Event2, Event3])
// Result: User 123 deleted (not in current state)

// Historical State (at Event 2)
replay([Event1, Event2])
// Result: User 123 exists with name "Alice Smith"`}
            </CodeBlock>
          </Example>

          <H2>Challenges</H2>
          <UL>
            <LI>Event log grows indefinitely (needs compaction)</LI>
            <LI>Replaying all events can be slow (use snapshots)</LI>
            <LI>Schema evolution (events must be backward compatible)</LI>
          </UL>

          <KeyPoint>
            <Strong>Use When:</Strong> Need audit trail, time travel, or want to derive multiple views from same events.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'cqrs',
      type: 'concept',
      title: 'CQRS - Command Query Responsibility Segregation',
      content: (
        <Section>
          <H1>CQRS - Command Query Responsibility Segregation</H1>
          <P>
            <Strong>CQRS</Strong> separates read and write models. Write model optimized for transactions,
            read model optimized for queries.
          </P>

          <H2>Write Model (Command Side)</H2>
          <UL>
            <LI>Normalized, transactional</LI>
            <LI>Optimized for writes</LI>
            <LI>Source of truth</LI>
          </UL>

          <H2>Read Model (Query Side)</H2>
          <UL>
            <LI>Denormalized, optimized for queries</LI>
            <LI>Materialized views, caches</LI>
            <LI>Eventually consistent with write model</LI>
          </UL>

          <Example title="CQRS Pattern">
            <CodeBlock>
{`// Write Model (normalized)
Users Table: {id, name, email}
Posts Table: {id, user_id, title, content}

// Read Model (denormalized, optimized for feed query)
Feed View: {post_id, user_name, title, content}
// Pre-joined, fast reads
// Updated asynchronously from write model

// Write: Update Users/Posts tables
// Read: Query Feed View (fast!)`}
            </CodeBlock>
          </Example>

          <H2>Benefits</H2>
          <UL>
            <LI>Optimize read and write independently</LI>
            <LI>Scale reads and writes separately</LI>
            <LI>Use different databases for each (SQL for writes, NoSQL for reads)</LI>
          </UL>

          <KeyPoint>
            <Strong>Use When:</Strong> Read and write patterns are very different, need to scale independently.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'cdc',
      type: 'concept',
      title: 'Change Data Capture (CDC)',
      content: (
        <Section>
          <H1>Change Data Capture (CDC)</H1>
          <P>
            <Strong>Change Data Capture (CDC)</Strong> streams database changes (inserts, updates, deletes)
            to other systems in real-time.
          </P>

          <H2>How It Works</H2>
          <OL>
            <LI>Database writes to transaction log (WAL)</LI>
            <LI>CDC tool reads transaction log</LI>
            <LI>Converts changes to events</LI>
            <LI>Streams events to Kafka/other systems</LI>
          </OL>

          <H2>Use Cases</H2>
          <UL>
            <LI><Strong>Search Index:</Strong> Keep Elasticsearch in sync with database</LI>
            <LI><Strong>Cache Invalidation:</Strong> Invalidate cache when data changes</LI>
            <LI><Strong>Analytics:</Strong> Stream changes to data warehouse</LI>
            <LI><Strong>Microservices:</Strong> Sync data across services</LI>
          </UL>

          <Example title="CDC Pipeline">
            <CodeBlock>
{`// Database Transaction Log
INSERT INTO users (id, name) VALUES (123, "Alice")

// CDC Tool (Debezium, AWS DMS)
Event: {
  "op": "c",  // create
  "table": "users",
  "data": {"id": 123, "name": "Alice"}
}

// Stream to Kafka
kafka.produce("db-changes", event)

// Consumers
// - Elasticsearch: Index user
// - Cache: Invalidate user cache
// - Analytics: Update user metrics`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Benefits:</Strong> Real-time sync, no application code changes, decoupled systems.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

