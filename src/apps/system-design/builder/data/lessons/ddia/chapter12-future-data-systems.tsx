import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter12FutureDataSystemsLesson: SystemDesignLesson = {
  id: 'ddia-ch12-future-data-systems',
  slug: 'ddia-ch12-future-data-systems',
  title: 'Future of Data Systems (DDIA Ch. 12)',
  description: 'Learn Lambda/Kappa architecture, event sourcing, CQRS, and change data capture. Includes critical trade-offs: Lambda vs Kappa, event sourcing vs CRUD, and CQRS implementations with real-world examples and ROI analysis.',
  category: 'fundamentals',
  difficulty: 'advanced',
  estimatedMinutes: 105,
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
      id: 'lambda-kappa-tradeoff',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Lambda vs Kappa Architecture',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Lambda vs Kappa Architecture</H1>
          <P>
            Choosing between <Strong>Lambda (batch + stream)</Strong> and <Strong>Kappa (stream-only)</Strong>
            impacts your system's complexity, cost, and operational burden.
          </P>

          <H2>📊 Architecture Comparison</H2>
          <ComparisonTable
            headers={['Dimension', 'Lambda Architecture', 'Kappa Architecture']}
            rows={[
              ['Pipelines', 'Two (batch + speed)', 'One (stream only)'],
              ['Code Complexity', 'High (duplicate logic)', 'Low (single codebase)'],
              ['Data Freshness', 'Batch: hours old, Speed: real-time', 'Always real-time'],
              ['Accuracy', 'Eventually accurate (batch corrects errors)', 'Accurate (idempotent processing)'],
              ['Historical Reprocessing', 'Batch layer handles natively', 'Replay stream (requires retention)'],
              ['Infrastructure Cost', 'High ($10k+/month: batch + stream)', 'Lower ($5k/month: stream only)'],
              ['Operational Complexity', 'Very high (two systems to maintain)', 'Medium (one system, but must handle backfill)'],
              ['Development Time', '6-12 months (two pipelines)', '2-4 months (one pipeline)'],
              ['Best For', 'Complex aggregations needing accuracy', 'Real-time only, simple reprocessing'],
            ]}
          />

          <H2>💡 Real-World Example: E-Commerce Analytics Dashboard</H2>
          <InfoBox>
            <P>
              <Strong>Scenario:</Strong> E-commerce company needs dashboard showing:
              Total orders (all time), Revenue by product category, Hourly order rate (last 24h).
              10M orders/day, must show updates within 1 minute.
            </P>

            <H3>Option 1: Lambda Architecture</H3>
            <UL>
              <LI><Strong>Batch Layer:</Strong> Spark job processes entire order history (1TB) nightly</LI>
              <LI><Strong>Speed Layer:</Strong> Kafka Streams processes last 24 hours in real-time</LI>
              <LI><Strong>Serving Layer:</Strong> Merges batch + speed results at query time</LI>
              <LI><Strong>Batch Infrastructure:</Strong> 20-node Spark cluster = $3k/month</LI>
              <LI><Strong>Speed Infrastructure:</Strong> 5-node Kafka cluster = $1k/month</LI>
              <LI><Strong>Storage:</Strong> 1TB HDFS (batch) + 100GB Kafka (speed) = $500/month</LI>
              <LI><Strong>Development:</Strong> 2× codebases (Spark + Kafka Streams) = $200k (6 months)</LI>
              <LI><Strong>Operational Cost:</Strong> 2 engineers maintain both = $300k/year</LI>
              <LI><Strong>Accuracy:</Strong> Batch corrects speed layer errors daily</LI>
              <LI><Strong>Annual Cost:</Strong> ($3k + $1k + $500)×12 + $300k = $354k/year</LI>
            </UL>

            <H3>Option 2: Kappa Architecture</H3>
            <UL>
              <LI><Strong>Stream Processing:</Strong> Single Kafka Streams pipeline processes all events</LI>
              <LI><Strong>Retention:</Strong> Kafka retains 30 days (for reprocessing) = 300GB</LI>
              <LI><Strong>State Store:</Strong> RocksDB maintains aggregated state locally</LI>
              <LI><Strong>Infrastructure:</Strong> 8-node Kafka cluster = $2k/month</LI>
              <LI><Strong>Storage:</Strong> 300GB Kafka retention = $150/month</LI>
              <LI><Strong>Development:</Strong> Single codebase (Kafka Streams) = $80k (2 months)</LI>
              <LI><Strong>Operational Cost:</Strong> 1 engineer maintains = $150k/year</LI>
              <LI><Strong>Reprocessing:</Strong> Replay 30-day stream (4 hours) when needed</LI>
              <LI><Strong>Limitation:</Strong> Historical data >30 days requires external backup</LI>
              <LI><Strong>Annual Cost:</Strong> ($2k + $150)×12 + $150k = $176k/year</LI>
            </UL>

            <H3>📈 ROI Analysis</H3>
            <ComparisonTable
              headers={['Architecture', 'Year 1 Cost', '3-Year TCO', 'Complexity', 'Reprocessing']}
              rows={[
                ['Lambda', '$554k', '$1.06M', 'Very high (2 systems)', 'Easy (batch layer)'],
                ['Kappa', '$256k ✓', '$608k ✓', 'Medium (1 system)', 'Manual (stream replay)'],
              ]}
            />

            <P><Strong>Result:</Strong> Kappa saves $298k Year 1, $452k over 3 years.
            Lambda justified only if daily batch reprocessing critical.</P>
          </InfoBox>

          <H2>🔧 Decision Framework with Implementation</H2>
          <CodeBlock>
{`// ===== Kappa Architecture (RECOMMENDED for most cases) =====
// Single stream processing pipeline, replay for reprocessing

const { Kafka } = require('kafkajs');
const { KafkaStreams } = require('kafka-streams');

const kafkaStreams = new KafkaStreams({
  kafkaHost: 'localhost:9092',
  groupId: 'analytics'
});

const stream = kafkaStreams.getKStream('orders');

// Real-time aggregation with state
stream
  .filter(msg => msg.value.status === 'completed')
  .mapWrap(msg => ({
    key: msg.value.category,
    value: msg.value.revenue
  }))
  .reduce((acc, value) => acc + value, 'revenue-by-category')  // Stateful aggregation
  .to('analytics-results');

// Reprocessing (when needed)
async function reprocessLast30Days() {
  // Create new consumer group
  const reprocessConsumer = kafka.consumer({
    groupId: 'analytics-reprocess-\${Date.now()}'
  });

  await reprocessConsumer.subscribe({ topic: 'orders', fromBeginning: true });

  // Process from earliest offset
  await reprocessConsumer.seek({
    topic: 'orders',
    partition: 0,
    offset: earliestOffsetLast30Days  // Calculated from timestamp
  });

  // Same processing logic as real-time
  // Takes 4 hours to reprocess 30 days of data
}

// Result: Single codebase, real-time processing, manual reprocessing
// Cost: $176k/year, 1 engineer to maintain
// Limitation: Can only replay data within Kafka retention (30 days)

// ===== Lambda Architecture (for complex batch aggregations) =====
// Separate batch and speed layers

// BATCH LAYER (Spark - runs nightly)
val spark = SparkSession.builder().getOrCreate()

// Process entire order history (1TB)
val allOrders = spark.read.parquet("s3://orders-historical")

val batchResults = allOrders
  .filter($"status" === "completed")
  .groupBy($"category")
  .agg(sum($"revenue").as("total_revenue"))
  .write
  .mode("overwrite")
  .parquet("s3://analytics/batch-views")

// Takes 2 hours nightly, processes all data from scratch

// SPEED LAYER (Kafka Streams - real-time)
const speedStream = kafkaStreams.getKStream('orders');

speedStream
  .filter(msg => msg.value.timestamp > Date.now() - 86400000)  // Last 24h only
  .mapWrap(msg => ({
    key: msg.value.category,
    value: msg.value.revenue
  }))
  .reduce((acc, value) => acc + value, 'revenue-by-category-realtime')
  .to('analytics-speed-layer');

// SERVING LAYER (query time)
async function getRevenuByCategory(category) {
  // Read batch view (accurate, stale)
  const batchRevenue = await s3.getObject(\`batch-views/\${category}\`);

  // Read speed layer (fresh, approximate)
  const speedRevenue = await kafkaStreams.getStore('revenue-by-category-realtime');

  // Merge at query time
  return {
    total: batchRevenue.total + speedRevenue.get(category),
    asOf: Date.now()
  };
}

// Result: Two codebases, complex merge logic, eventual accuracy
// Cost: $354k/year, 2 engineers to maintain batch + speed
// Benefit: Easy reprocessing (batch layer handles natively)`}
          </CodeBlock>

          <H2>🚫 Common Mistakes</H2>
          <ComparisonTable
            headers={['Mistake', 'Impact', 'Fix']}
            rows={[
              ['Using Lambda for simple aggregations', '2× development cost, 2× operational burden for no benefit', 'Use Kappa unless batch layer truly required'],
              ['Kappa without sufficient retention', 'Cannot reprocess >7 days → data loss', 'Set Kafka retention to 30+ days for reprocessing window'],
              ['Not deduplicating batch + speed layers', 'Double-counting events in overlap period', 'Use idempotency keys to merge batch + speed results'],
              ['Running batch layer too frequently', 'Hourly batch = wasted infrastructure (use stream instead)', 'Batch should run daily/weekly, not hourly'],
              ['Kappa without snapshots', '30-day replay takes 2 days (too slow for recovery)', 'Take periodic state snapshots for fast recovery'],
              ['Lambda without serving layer optimization', 'Merge logic in every query → 10× query latency', 'Pre-compute merged views, update incrementally'],
            ]}
          />

          <H2>📋 Architecture Selection</H2>
          <P><Strong>Choose Kappa (Stream-Only) when:</Strong></P>
          <UL>
            <LI>✓ Real-time processing sufficient (99% of use cases)</LI>
            <LI>✓ Simple aggregations (counts, sums, moving averages)</LI>
            <LI>✓ Can replay stream for reprocessing (30-day retention)</LI>
            <LI>✓ Want minimal complexity (1 codebase to maintain)</LI>
            <LI>✓ Team &lt;10 engineers (limited bandwidth)</LI>
          </UL>

          <P><Strong>Choose Lambda (Batch + Stream) when:</Strong></P>
          <UL>
            <LI>✓ Complex batch aggregations (joins across years of data)</LI>
            <LI>✓ Frequent reprocessing (weekly algorithm changes)</LI>
            <LI>✓ Accuracy critical (financial reconciliation)</LI>
            <LI>✓ Historical data &gt;retention window (years of history)</LI>
            <LI>✓ Team &gt;20 engineers (can maintain two systems)</LI>
          </UL>

          <KeyPoint>
            <Strong>Golden Rule:</Strong> Start with Kappa (stream-only). Complexity is usually not worth it.
            Only add batch layer if reprocessing &gt;30 days regularly or complex batch-only aggregations.
            Most companies think they need Lambda but actually benefit from Kappa simplicity.
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
    {
      id: 'event-sourcing-tradeoff',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Event Sourcing vs Traditional CRUD',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Event Sourcing vs Traditional State Storage</H1>
          <P>
            Choosing between <Strong>Event Sourcing (event log)</Strong> and <Strong>Traditional CRUD (current state)</Strong>
            impacts your auditability, complexity, and storage costs.
          </P>

          <H2>📊 Storage Pattern Comparison</H2>
          <ComparisonTable
            headers={['Dimension', 'Event Sourcing', 'Traditional CRUD + Audit Log', 'Traditional CRUD Only']}
            rows={[
              ['Primary Storage', 'Immutable event log', 'Mutable state + separate audit table', 'Mutable state only'],
              ['Current State', 'Derived (replay events)', 'Direct query', 'Direct query'],
              ['Historical State', 'Full time travel (replay to any point)', 'Partial (if audit logged)', 'None (updates overwrite)'],
              ['Audit Trail', 'Complete (every event)', 'Partial (if implemented)', 'None'],
              ['Storage Growth', '10GB/month (unbounded)', '5GB/month (state + audit)', '1GB/month (state only)'],
              ['Query Performance', 'Slow (rebuild state)', 'Fast (direct query)', 'Fast (direct query)'],
              ['Write Performance', 'Fast (append-only)', 'Medium (write + audit)', 'Fast (single write)'],
              ['Complexity', 'High (event replay, projections)', 'Medium (audit logic)', 'Low (simple CRUD)'],
              ['Debugging', 'Excellent (full history)', 'Good (if audit complete)', 'Poor (no history)'],
              ['Compliance', 'Excellent (immutable log)', 'Good (if audit enforced)', 'Poor (data can be altered)'],
            ]}
          />

          <H2>💡 Real-World Example: Banking Transaction System</H2>
          <InfoBox>
            <P>
              <Strong>Scenario:</Strong> Banking app handles 1M transactions/day (deposits, withdrawals, transfers).
              Must support: Current balance queries, Transaction history, Compliance audits, Dispute resolution.
            </P>

            <H3>Option 1: Event Sourcing</H3>
            <UL>
              <LI><Strong>Storage:</Strong> Event log (AccountCreated, MoneyDeposited, MoneyWithdrawn)</LI>
              <LI><Strong>Event Volume:</Strong> 1M events/day × 500 bytes = 500MB/day = 15GB/month</LI>
              <LI><Strong>Retention:</Strong> 7 years (compliance) = 15GB × 84 months = 1.26TB</LI>
              <LI><Strong>Storage Cost:</Strong> 1.26TB × $0.03/GB/month = $38/month</LI>
              <LI><Strong>Current Balance:</Strong> Replay events (slow: 100ms) OR maintain projection (fast: 5ms)</LI>
              <LI><Strong>Projection Maintenance:</Strong> Event processor keeps balance_view updated = $500/month</LI>
              <LI><Strong>Development Cost:</Strong> $150k (event store, projections, replay logic)</LI>
              <LI><Strong>Compliance:</Strong> Perfect (immutable event log, full history)</LI>
              <LI><Strong>Dispute Resolution:</Strong> Replay to exact moment ($50k/year saved vs manual investigation)</LI>
              <LI><Strong>Annual Cost:</Strong> ($38 + $500)×12 + $150k dev = $156.5k Year 1, $6.5k/year ongoing</LI>
            </UL>

            <H3>Option 2: Traditional CRUD + Audit Log</H3>
            <UL>
              <LI><Strong>Storage:</Strong> Accounts table (current state) + transactions audit table</LI>
              <LI><Strong>State:</Strong> 10M accounts × 200 bytes = 2GB (current balances)</LI>
              <LI><Strong>Audit Log:</Strong> 1M transactions/day × 300 bytes = 300MB/day = 9GB/month</LI>
              <LI><Strong>Retention:</Strong> 7 years = 9GB × 84 = 756GB</LI>
              <LI><Strong>Storage Cost:</Strong> (2GB + 756GB) × $0.03/GB = $23/month</LI>
              <LI><Strong>Current Balance:</Strong> Direct query (fast: 2ms)</LI>
              <LI><Strong>Development Cost:</Strong> $50k (audit triggers, compliance logic)</LI>
              <LI><Strong>Compliance:</Strong> Good (if audit triggers enforced everywhere)</LI>
              <LI><Strong>Limitation:</Strong> Cannot replay to exact state (only log of changes, not full events)</LI>
              <LI><Strong>Dispute Resolution:</Strong> Manual ($20k/year for support team)</LI>
              <LI><Strong>Annual Cost:</Strong> $23×12 + $50k dev = $50.3k Year 1, $276/year ongoing</LI>
            </UL>

            <H3>Option 3: Traditional CRUD Only (No Audit)</H3>
            <UL>
              <LI><Strong>Storage:</Strong> Accounts table only (current state)</LI>
              <LI><Strong>State:</Strong> 10M accounts × 200 bytes = 2GB</LI>
              <LI><Strong>Storage Cost:</Strong> 2GB × $0.03/GB = $0.06/month</LI>
              <LI><Strong>Current Balance:</Strong> Direct query (fast: 2ms)</LI>
              <LI><Strong>Development Cost:</Strong> $10k (simple CRUD)</LI>
              <LI><Strong>Compliance:</Strong> Failed (no audit trail)</LI>
              <LI><Strong>Dispute Resolution:</Strong> Impossible (no transaction history)</LI>
              <LI><Strong>Regulatory Fines:</Strong> $500k/year (non-compliance penalties)</LI>
              <LI><Strong>Annual Cost:</Strong> $0.06×12 + $10k dev + $500k fines = $510k Year 1, $500k/year fines</LI>
            </UL>

            <H3>📈 ROI Analysis (5-Year TCO)</H3>
            <ComparisonTable
              headers={['Approach', 'Year 1', '5-Year TCO', 'Compliance', 'Dispute Resolution']}
              rows={[
                ['CRUD Only', '$510k', '$2.5M', 'Failed ❌', 'Impossible'],
                ['CRUD + Audit', '$50k ✓', '$51k', 'Good ✓', 'Manual ($100k/5yr)'],
                ['Event Sourcing', '$157k', '$176k', 'Perfect ✓', 'Automated ($250k saved)'],
              ]}
            />

            <P><Strong>Result:</Strong> For regulated industries (banking, healthcare), event sourcing saves $2.3M over 5 years vs CRUD-only.
            CRUD + audit acceptable if compliance needs moderate and dispute volume low.</P>
          </InfoBox>

          <H2>🔧 Decision Framework with Implementation</H2>
          <CodeBlock>
{`// ===== Event Sourcing Implementation =====
// Store immutable events, derive current state

// Event Store (append-only log)
const events = [
  { type: 'AccountCreated', accountId: 123, timestamp: '2024-01-01', balance: 0 },
  { type: 'MoneyDeposited', accountId: 123, timestamp: '2024-01-02', amount: 1000 },
  { type: 'MoneyWithdrawn', accountId: 123, timestamp: '2024-01-03', amount: 200 }
];

// Replay events to get current state
function getCurrentBalance(accountId) {
  let balance = 0;

  for (const event of events.filter(e => e.accountId === accountId)) {
    if (event.type === 'AccountCreated') {
      balance = event.balance;
    } else if (event.type === 'MoneyDeposited') {
      balance += event.amount;
    } else if (event.type === 'MoneyWithdrawn') {
      balance -= event.amount;
    }
  }

  return balance;  // 1000 - 200 = 800
}

// Optimization: Maintain projection (materialized view)
const balanceProjection = {};  // accountId -> balance

function applyEvent(event) {
  // Append to event store (immutable)
  await eventStore.append(event);

  // Update projection (for fast queries)
  if (event.type === 'MoneyDeposited') {
    balanceProjection[event.accountId] += event.amount;
  } else if (event.type === 'MoneyWithdrawn') {
    balanceProjection[event.accountId] -= event.amount;
  }
}

// Query current balance (fast: 5ms)
function getBalance(accountId) {
  return balanceProjection[accountId];  // Direct lookup
}

// Time travel (audit/compliance)
function getBalanceAtTime(accountId, timestamp) {
  let balance = 0;

  for (const event of events.filter(e =>
    e.accountId === accountId && e.timestamp <= timestamp
  )) {
    // Replay events up to timestamp
    balance = applyEvent(balance, event);
  }

  return balance;  // Balance as of specific moment
}

// Result: Complete audit trail, time travel, projections for fast queries
// Cost: $156k Year 1 (development + infrastructure)
// Benefit: Perfect compliance, automated dispute resolution

// ===== Traditional CRUD + Audit Log =====
// Mutable state + separate audit table

// Accounts table (current state)
CREATE TABLE accounts (
  id INT PRIMARY KEY,
  balance DECIMAL(10, 2),
  updated_at TIMESTAMP
);

// Audit log (separate table)
CREATE TABLE transaction_audit (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT,
  transaction_type VARCHAR(50),
  amount DECIMAL(10, 2),
  balance_before DECIMAL(10, 2),
  balance_after DECIMAL(10, 2),
  timestamp TIMESTAMP,
  user_id INT
);

// Update with audit trail
async function deposit(accountId, amount) {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Get current balance
    const [account] = await conn.query(
      'SELECT balance FROM accounts WHERE id = ? FOR UPDATE',
      [accountId]
    );

    const balanceBefore = account.balance;
    const balanceAfter = balanceBefore + amount;

    // Update balance
    await conn.query(
      'UPDATE accounts SET balance = ?, updated_at = NOW() WHERE id = ?',
      [balanceAfter, accountId]
    );

    // Insert audit record
    await conn.query(
      'INSERT INTO transaction_audit (account_id, transaction_type, amount, balance_before, balance_after, timestamp) VALUES (?, ?, ?, ?, ?, NOW())',
      [accountId, 'DEPOSIT', amount, balanceBefore, balanceAfter]
    );

    await conn.commit();

  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

// Query current balance (fast: 2ms)
const balance = await db.query('SELECT balance FROM accounts WHERE id = ?', [accountId]);

// Query transaction history (audit trail)
const history = await db.query(
  'SELECT * FROM transaction_audit WHERE account_id = ? ORDER BY timestamp DESC',
  [accountId]
);

// Result: Good compliance, fast queries, moderate complexity
// Cost: $50k Year 1
// Limitation: Cannot reconstruct exact state (only changes logged)`}
          </CodeBlock>

          <H2>🚫 Common Mistakes</H2>
          <ComparisonTable
            headers={['Mistake', 'Impact', 'Fix']}
            rows={[
              ['Event sourcing for simple CRUD apps', '$150k development cost for $10k benefit', 'Use traditional CRUD unless audit/compliance critical'],
              ['Not maintaining projections', 'Every query replays all events (100× slower)', 'Maintain materialized views updated by event processor'],
              ['No event versioning strategy', 'Cannot evolve events → schema locked forever', 'Version events (v1, v2), upcasters for compatibility'],
              ['Infinite event log growth', '10TB event store after 5 years → $300/month storage', 'Snapshot every 1000 events, archive old events to S3'],
              ['Audit log without enforcement', 'Developer forgets trigger → compliance gap', 'Use database triggers or CDC (automatic, cannot bypass)'],
              ['Event sourcing without snapshots', 'Rebuilding state takes 10 minutes (1M events)', 'Take snapshots every 1000 events, replay from snapshot'],
            ]}
          />

          <H2>📋 Pattern Selection</H2>
          <P><Strong>Choose Event Sourcing when:</Strong></P>
          <UL>
            <LI>✓ Financial/banking (perfect audit required)</LI>
            <LI>✓ Compliance-heavy (healthcare, legal)</LI>
            <LI>✓ Frequent disputes (need time travel)</LI>
            <LI>✓ Multiple projections (same events → different views)</LI>
            <LI>✓ Debugging critical (need to replay exact sequence)</LI>
          </UL>

          <P><Strong>Choose Traditional CRUD + Audit when:</Strong></P>
          <UL>
            <LI>✓ Moderate compliance (some audit trail needed)</LI>
            <LI>✓ Simple state model (no complex event replay)</LI>
            <LI>✓ Limited budget ($50k vs $150k for event sourcing)</LI>
            <LI>✓ Team unfamiliar with event sourcing</LI>
            <LI>✓ Query performance critical (&lt;5ms)</LI>
          </UL>

          <P><Strong>Choose Traditional CRUD Only when:</Strong></P>
          <UL>
            <LI>✓ No compliance requirements (internal tools)</LI>
            <LI>✓ Prototype/MVP (minimal complexity)</LI>
            <LI>✓ Data not critical (can afford loss)</LI>
            <LI>✓ Never for: banking, healthcare, e-commerce</LI>
          </UL>

          <KeyPoint>
            <Strong>Golden Rule:</Strong> Use traditional CRUD + audit for most applications (80% of cases).
            Reserve event sourcing for regulated industries or when perfect audit trail worth $150k investment.
            Never skip audit trail entirely for customer-facing or financial data.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

