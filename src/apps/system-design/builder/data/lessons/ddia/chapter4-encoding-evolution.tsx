import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter4EncodingEvolutionLesson: SystemDesignLesson = {
  id: 'ddia-ch4-encoding-evolution',
  slug: 'ddia-ch4-encoding-evolution',
  title: 'Encoding & Evolution (DDIA Ch. 4)',
  description: 'Master encoding formats and schema evolution trade-offs: WHEN to use JSON vs Protobuf vs Avro, HOW encoding affects bandwidth costs ($10k/year savings), WHICH compatibility strategy enables zero-downtime deployments.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 75,

  // Progressive flow metadata
  moduleId: 'sd-module-4-ddia',
  sequenceOrder: 3,
  stages: [
    {
      id: 'intro-encoding',
      type: 'concept',
      title: 'Data Encoding Formats',
      content: (
        <Section>
          <H1>Data Encoding Formats</H1>
          <P>
            When data is sent over the network or stored on disk, it must be <Strong>encoded</Strong> (serialized)
            into a byte sequence. Different formats have different trade-offs:
          </P>
          <UL>
            <LI><Strong>Text Formats:</Strong> JSON, XML (human-readable, larger size)</LI>
            <LI><Strong>Binary Formats:</Strong> Protocol Buffers, Avro, Thrift (compact, fast, schema-required)</LI>
          </UL>
        </Section>
      ),
    },
    {
      id: 'json-encoding',
      type: 'concept',
      title: 'JSON Encoding - Text-Based',
      content: (
        <Section>
          <H1>JSON Encoding - Text-Based</H1>
          <P>
            <Strong>JSON (JavaScript Object Notation)</Strong> is a human-readable text format widely used for APIs.
          </P>

          <H2>Advantages</H2>
          <UL>
            <LI>Human-readable and debuggable</LI>
            <LI>Language-agnostic (supported everywhere)</LI>
            <LI>No schema required (flexible)</LI>
            <LI>Easy to work with in JavaScript</LI>
          </UL>

          <H2>Disadvantages</H2>
          <UL>
            <LI>Larger payload size (text encoding)</LI>
            <LI>No schema enforcement (errors at runtime)</LI>
            <LI>Slower parsing than binary formats</LI>
            <LI>No binary data support (must use Base64)</LI>
          </UL>

          <Example title="JSON Encoding">
            <CodeBlock>
{`{
  "user_id": 12345,
  "name": "Alice",
  "email": "alice@example.com",
  "created_at": "2024-01-01T00:00:00Z"
}

// Size: ~100 bytes (text)
// Binary equivalent: ~40 bytes`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Use When:</Strong> APIs, configuration files, human-readable logs. Not for high-throughput internal services.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'binary-encoding',
      type: 'concept',
      title: 'Binary Encoding - Protocol Buffers & Thrift',
      content: (
        <Section>
          <H1>Binary Encoding - Protocol Buffers & Thrift</H1>
          <P>
            <Strong>Binary formats</Strong> encode data as compact byte sequences. Require a schema but are much
            more efficient than text formats.
          </P>

          <H2>Protocol Buffers (protobuf)</H2>
          <UL>
            <LI>Google's binary serialization format</LI>
            <LI>Schema defined in <Code>.proto</Code> files</LI>
            <LI>Language-agnostic code generation</LI>
            <LI>Backward and forward compatible</LI>
          </UL>

          <Example title="Protocol Buffers">
            <CodeBlock>
{`// schema.proto
message User {
  required int32 user_id = 1;
  required string name = 2;
  optional string email = 3;
  optional int64 created_at = 4;
}

// Encoded: ~40 bytes (vs 100 bytes JSON)
// Fast encoding/decoding
// Type-safe (compiler checks)`}
            </CodeBlock>
          </Example>

          <H2>Thrift</H2>
          <UL>
            <LI>Apache Thrift (similar to protobuf)</LI>
            <LI>Supports more languages out of the box</LI>
            <LI>Includes RPC framework</LI>
          </UL>

          <KeyPoint>
            <Strong>Use When:</Strong> Internal microservices, high-throughput systems, mobile apps (bandwidth savings).
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'avro-schema-evolution',
      type: 'concept',
      title: 'Avro - Schema Evolution',
      content: (
        <Section>
          <H1>Avro - Schema Evolution</H1>
          <P>
            <Strong>Apache Avro</Strong> uses schemas for encoding but stores the schema with the data,
            enabling powerful schema evolution.
          </P>

          <H2>Schema Evolution Rules</H2>
          <UL>
            <LI><Strong>Forward Compatible:</Strong> New code can read old data (add optional fields)</LI>
            <LI><Strong>Backward Compatible:</Strong> Old code can read new data (remove optional fields)</LI>
            <LI><Strong>Full Compatibility:</Strong> Both directions (add/remove optional fields only)</LI>
          </UL>

          <Example title="Schema Evolution">
            <CodeBlock>
{`// Schema v1
{
  "type": "record",
  "name": "User",
  "fields": [
    {"name": "user_id", "type": "int"},
    {"name": "name", "type": "string"}
  ]
}

// Schema v2 (forward compatible - new code reads old data)
{
  "type": "record",
  "name": "User",
  "fields": [
    {"name": "user_id", "type": "int"},
    {"name": "name", "type": "string"},
    {"name": "email", "type": ["null", "string"], "default": null}  // Optional
  ]
}`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Use When:</Strong> Event streaming (Kafka), data lakes, systems with long-lived data that must evolve.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'schema-versioning',
      type: 'concept',
      title: 'Schema Versioning & Migration Strategies',
      content: (
        <Section>
          <H1>Schema Versioning & Migration Strategies</H1>
          <P>
            When schemas change, you need a strategy to handle multiple versions simultaneously.
          </P>

          <H2>Versioning Strategies</H2>
          <UL>
            <LI><Strong>Schema Registry:</Strong> Central registry (e.g., Confluent Schema Registry) manages schemas</LI>
            <LI><Strong>Version Numbers:</Strong> Include version in message/schema</LI>
            <LI><Strong>Compatibility Checks:</Strong> Validate new schemas against existing ones</LI>
          </UL>

          <H2>Migration Strategies</H2>
          <UL>
            <LI><Strong>Big Bang:</Strong> Deploy all services simultaneously (risky, downtime)</LI>
            <LI><Strong>Rolling:</Strong> Deploy services one by one (requires backward compatibility)</LI>
            <LI><Strong>Dual Write:</Strong> Write to both old and new format during transition</LI>
            <LI><Strong>Event Sourcing:</Strong> Store events, derive current state (natural evolution)</LI>
          </UL>

          <Example title="Zero-Downtime Migration">
            <CodeBlock>
{`// Phase 1: Dual Write
write(data, format="v1")  // Old format
write(data, format="v2")  // New format

// Phase 2: Read from v2, fallback to v1
read(format="v2") || read(format="v1")

// Phase 3: All services on v2, remove v1`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Best Practice:</Strong> Always maintain backward compatibility for at least one deployment cycle.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'json-vs-protobuf-vs-avro-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: JSON vs Protocol Buffers vs Avro',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: JSON vs Protocol Buffers vs Avro</H1>
          <P>
            Choosing the right encoding format affects <Strong>bandwidth costs, latency, and schema evolution</Strong>.
            This decision impacts operating costs by thousands of dollars annually.
          </P>

          <Divider />

          <H2>📊 Format Comparison</H2>
          <ComparisonTable
            headers={['Metric', 'JSON', 'Protocol Buffers', 'Avro']}
            rows={[
              ['Payload Size (User object)', '100 bytes', '40 bytes (60% smaller)', '35 bytes (65% smaller)'],
              ['Encoding Speed', '50 µs', '10 µs (5× faster)', '12 µs (4× faster)'],
              ['Decoding Speed', '80 µs', '15 µs (5× faster)', '18 µs (4× faster)'],
              ['Schema Required', '❌ No', '✅ Yes (.proto file)', '✅ Yes (JSON schema)'],
              ['Human Readable', '✅ Yes', '❌ No (binary)', '❌ No (binary)'],
              ['Schema Evolution', '⚠️ Manual (breaking)', '✅ Field tags (forward/backward)', '✅ Best-in-class (reader/writer schema)'],
              ['Type Safety', '❌ Runtime only', '✅ Compile-time', '✅ Compile-time'],
              ['Language Support', '✅ Universal', '✅ 20+ languages', '✅ 10+ languages'],
              ['RPC Support', '❌ No (REST only)', '✅ gRPC built-in', '⚠️ Limited'],
              ['Bandwidth (1M msgs/day)', '100 GB/day', '40 GB/day (60% savings)', '35 GB/day (65% savings)'],
              ['Best For', 'Public APIs, debugging', 'Microservices, mobile apps', 'Event streaming, Kafka'],
            ]}
          />

          <Divider />

          <H2>💡 Real-World Example: Microservices Communication</H2>
          <P>
            <Strong>Scenario:</Strong> E-commerce platform with 50 microservices exchanging user/order/product data.
            Currently using JSON over HTTP, considering migration to Protocol Buffers with gRPC.
          </P>

          <H3>Current System (JSON)</H3>
          <CodeBlock>
{`// JSON Payload (User object)
{
  "user_id": 123456789,
  "username": "alice_smith",
  "email": "alice.smith@example.com",
  "created_at": "2024-01-15T10:30:00Z",
  "is_premium": true,
  "balance": 1234.56,
  "tags": ["verified", "premium", "early_adopter"]
}

// Size: 185 bytes (with whitespace)
// Encoding: 45 µs
// Decoding: 75 µs
// Bandwidth: 100M requests/day × 185B = 18.5 GB/day

// Cost Analysis (AWS Data Transfer):
// - 18.5 GB/day × 30 days = 555 GB/month
// - $0.09/GB (inter-region) = $50/month
// - Annual bandwidth cost: $600/year`}
          </CodeBlock>

          <H3>Migrated System (Protocol Buffers + gRPC)</H3>
          <CodeBlock>
{`// schema.proto
message User {
  int64 user_id = 1;
  string username = 2;
  string email = 3;
  google.protobuf.Timestamp created_at = 4;
  bool is_premium = 5;
  double balance = 6;
  repeated string tags = 7;
}

// Encoded Size: 68 bytes (63% smaller)
// Encoding: 8 µs (5.6× faster)
// Decoding: 12 µs (6.25× faster)
// Bandwidth: 100M requests/day × 68B = 6.8 GB/day

// Cost Analysis:
// - 6.8 GB/day × 30 days = 204 GB/month
// - $0.09/GB = $18.36/month
// - Annual bandwidth cost: $220/year
// - SAVINGS: $380/year (63% reduction)

// Additional Benefits:
// - Latency reduction: ~100 µs per request
// - 100M req/day = 2.8 hours/day saved in CPU time
// - Type safety prevents runtime errors
// - gRPC enables streaming, bi-directional communication`}
          </CodeBlock>

          <H3>Alternative: Avro (for Event Streaming)</H3>
          <CodeBlock>
{`// Avro schema (JSON format)
{
  "type": "record",
  "name": "User",
  "fields": [
    {"name": "user_id", "type": "long"},
    {"name": "username", "type": "string"},
    {"name": "email", "type": ["null", "string"], "default": null},
    {"name": "created_at", "type": "long", "logicalType": "timestamp-millis"},
    {"name": "is_premium", "type": "boolean"},
    {"name": "balance", "type": "double"},
    {"name": "tags", "type": {"type": "array", "items": "string"}}
  ]
}

// Encoded Size: 62 bytes (66% smaller than JSON)
// Encoding: 10 µs
// Decoding: 14 µs
// Use Case: Kafka event streams (user activity, state changes)

// Key Advantage: Schema Evolution
// - Schema stored in Confluent Schema Registry
// - Consumers use different schema version than producers
// - No downtime for schema changes
// - Perfect for event-driven architectures`}
          </CodeBlock>

          <Divider />

          <H2>🎯 Decision Framework</H2>
          <CodeBlock>
{`function chooseEncodingFormat(requirements) {
  // 1. Public API → JSON (human-readable, universal support)
  if (requirements.publicAPI && requirements.humanReadable) {
    return 'JSON';
  }

  // 2. Event Streaming (Kafka) → Avro (schema evolution)
  if (requirements.eventStreaming && requirements.schemaEvolution) {
    return 'Avro';  // Best schema evolution support
  }

  // 3. Microservices (internal) → Protocol Buffers (performance + gRPC)
  if (requirements.microservices && requirements.highThroughput) {
    return 'Protocol Buffers';  // 60% bandwidth savings, 5× faster
  }

  // 4. Mobile Apps → Protocol Buffers (bandwidth savings)
  if (requirements.mobileClients && requirements.bandwidthCritical) {
    return 'Protocol Buffers';  // Reduces data usage for users
  }

  // 5. Legacy Integration → JSON (compatibility)
  if (requirements.legacyIntegration) {
    return 'JSON';  // Easiest to integrate
  }

  // 6. Data Lake / Analytics → Avro (Hadoop/Spark support)
  if (requirements.dataLake || requirements.batchProcessing) {
    return 'Avro';  // Native Hadoop support
  }

  // Default: Start with JSON, migrate later
  return 'JSON';
}

// Example Usage:
const format = chooseEncodingFormat({
  microservices: true,
  highThroughput: true,
  publicAPI: false,
  bandwidthCritical: true
});
// → Returns 'Protocol Buffers'`}
          </CodeBlock>

          <Divider />

          <H2>⚠️ Common Mistakes & Fixes</H2>

          <H3>❌ Mistake 1: Using JSON for High-Throughput Internal Services</H3>
          <CodeBlock>
{`// BAD: JSON for internal microservice communication
// Problem: 100M requests/day × 200 bytes = 20 GB/day bandwidth
fetch('http://order-service/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 12345,
    items: [...],
    // ... 200 bytes of JSON
  })
});

// GOOD: Protocol Buffers + gRPC for internal services
// Solution: 100M requests/day × 70 bytes = 7 GB/day (65% savings)
const client = new OrderServiceClient('order-service:50051');
const request = new CreateOrderRequest({
  userId: 12345,
  items: [...],
});
const response = await client.createOrder(request);

// ROI: $600/year bandwidth savings + 5× faster serialization`}
          </CodeBlock>

          <H3>❌ Mistake 2: Using Protocol Buffers for Public APIs</H3>
          <CodeBlock>
{`// BAD: Protocol Buffers for external public API
// Problem: Third-party clients can't easily debug binary payloads
app.post('/api/v1/users', async (req, res) => {
  const user = User.decode(req.body);  // Binary protobuf
  // External developers struggle with debugging
});

// GOOD: JSON for public APIs, Protobuf internally
// Solution: JSON at API gateway, convert to Protobuf internally
app.post('/api/v1/users', async (req, res) => {
  const jsonUser = req.body;  // JSON from client

  // Convert to Protobuf for internal communication
  const protobufUser = new User({
    userId: jsonUser.user_id,
    username: jsonUser.username,
    // ...
  });

  await orderService.createUser(protobufUser);  // Protobuf internally
  res.json({ success: true });  // JSON to client
});

// Best of both worlds: Developer-friendly API + efficient internal communication`}
          </CodeBlock>

          <H3>❌ Mistake 3: Not Using Schema Registry for Avro</H3>
          <CodeBlock>
{`// BAD: Embedding Avro schema in every message
// Problem: Schema overhead (500 bytes) + 62 bytes data = 562 bytes total
const message = {
  schema: fullAvroSchema,  // 500 bytes!
  data: encodedUser  // 62 bytes
};
producer.send('user-events', message);

// GOOD: Use Confluent Schema Registry
// Solution: Schema ID (4 bytes) + 62 bytes data = 66 bytes total
const schemaRegistry = new SchemaRegistry({ host: 'http://schema-registry:8081' });
const schemaId = await schemaRegistry.register('user-events-value', schema);

const message = {
  schemaId: schemaId,  // 4 bytes
  data: encodedUser    // 62 bytes
};
producer.send('user-events', message);

// Consumer fetches schema once, caches it
// 89% size reduction (562 → 66 bytes)`}
          </CodeBlock>

          <H3>❌ Mistake 4: Ignoring Schema Evolution from Day 1</H3>
          <CodeBlock>
{`// BAD: No schema versioning strategy
// Problem: Breaking changes force simultaneous deployment (downtime)
message User {
  required int32 user_id = 1;
  required string name = 2;
  required string email = 3;  // Changed to required → BREAKS old clients!
}

// GOOD: Design for evolution from start
// Solution: Use optional fields with defaults
message User {
  required int32 user_id = 1;
  required string name = 2;
  optional string email = 3 [default = ""];  // Old clients can ignore
  optional int64 created_at = 4;  // New field, backward compatible

  // Reserved fields prevent reuse
  reserved 100 to 199;  // Reserved for future use
  reserved "deprecated_field";
}

// Enables zero-downtime rolling deployments:
// 1. Deploy new code (reads old + new schema)
// 2. All instances upgraded
// 3. Start sending new schema`}
          </CodeBlock>

          <Divider />

          <H2>💰 ROI Analysis: Migration from JSON to Protocol Buffers</H2>
          <InfoBox>
            <H3>E-Commerce Platform (50 Microservices)</H3>
            <UL>
              <LI><Strong>Traffic:</Strong> 500M internal requests/day</LI>
              <LI><Strong>Avg Payload (JSON):</Strong> 300 bytes</LI>
              <LI><Strong>Avg Payload (Protobuf):</Strong> 110 bytes (63% reduction)</LI>
            </UL>

            <H3>Annual Cost Savings</H3>
            <UL>
              <LI><Strong>Bandwidth:</Strong> 150 GB/day → 55 GB/day = 95 GB/day savings</LI>
              <LI><Strong>Data Transfer Cost:</Strong> $0.09/GB × 95 GB × 365 days = <Strong>$3,120/year</Strong></LI>
              <LI><Strong>CPU Savings:</Strong> 5× faster encoding = 20% CPU reduction on API servers</LI>
              <LI><Strong>CPU Cost Savings:</Strong> 50 instances × $100/mo × 20% = <Strong>$12,000/year</Strong></LI>
              <LI><Strong>Latency Improvement:</Strong> ~150 µs per request (p99 latency improves from 200ms → 180ms)</LI>
            </UL>

            <H3>Migration Cost</H3>
            <UL>
              <LI><Strong>Engineering Time:</Strong> 4 engineers × 2 weeks = $40,000</LI>
              <LI><Strong>Testing & Rollout:</Strong> 1 week = $10,000</LI>
              <LI><Strong>Total Investment:</Strong> $50,000</LI>
            </UL>

            <H3>Payback Period</H3>
            <UL>
              <LI><Strong>Annual Savings:</Strong> $15,120/year (bandwidth + CPU)</LI>
              <LI><Strong>ROI:</Strong> 3.3 months payback, then 30% cost reduction ongoing</LI>
              <LI><Strong>3-Year NPV:</Strong> $45,360 savings - $50,000 investment = <Strong>Net loss $4,640</Strong></LI>
              <LI><Strong>5-Year NPV:</Strong> $75,600 savings - $50,000 investment = <Strong>Net gain $25,600</Strong></LI>
            </UL>

            <P>
              <Strong>Additional Benefits:</Strong> Type safety prevents bugs ($50k/year in incident costs),
              gRPC enables bi-directional streaming (new features), faster mobile apps (better UX).
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>When to Use Each Format:</Strong><br />
            • <Strong>JSON:</Strong> Public APIs, configuration files, human debugging (developer experience &gt; performance)<br />
            • <Strong>Protocol Buffers:</Strong> Microservices, mobile apps, real-time systems (performance + type safety)<br />
            • <Strong>Avro:</Strong> Event streaming (Kafka), data lakes, systems requiring best-in-class schema evolution<br /><br />
            <Strong>ROI Sweet Spot:</Strong> Protocol Buffers pays off at &gt;10M requests/day (3 month payback).
            For lower traffic, JSON simplicity often wins.
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'schema-compatibility-strategies-tradeoffs',
      type: 'concept',
      title: '🎯 Critical Trade-Off: Schema Evolution Compatibility Strategies',
      content: (
        <Section>
          <H1>🎯 Critical Trade-Off: Schema Evolution Compatibility Strategies</H1>
          <P>
            Schema evolution strategy determines <Strong>deployment flexibility and downtime risk</Strong>.
            Choosing the wrong compatibility mode can cause production outages costing millions.
          </P>

          <Divider />

          <H2>📊 Compatibility Strategy Comparison</H2>
          <ComparisonTable
            headers={['Strategy', 'Forward Compatible', 'Backward Compatible', 'Zero-Downtime Deploy', 'Risk Level']}
            rows={[
              ['No Compatibility', '❌ No', '❌ No', '❌ Requires downtime', '🔴 High (breaking changes)'],
              ['Forward Compatible', '✅ New code reads old data', '❌ Old code breaks on new data', '⚠️ Upgrade consumers first', '🟡 Medium'],
              ['Backward Compatible', '❌ New code breaks on old data', '✅ Old code reads new data', '⚠️ Upgrade producers first', '🟡 Medium'],
              ['Full Compatible', '✅ Yes', '✅ Yes', '✅ Any order', '🟢 Low'],
              ['No Compatibility (Kafka)', '❌ Breaking changes allowed', '❌ No checks', '❌ Coordinated deploy', '🔴 High'],
            ]}
          />

          <ComparisonTable
            headers={['Compatibility Type', 'Allowed Changes', 'Deployment Order', 'Use Case']}
            rows={[
              ['Forward', 'Add optional fields', 'Upgrade consumers → producers', 'Read-heavy systems (analytics)'],
              ['Backward', 'Remove optional fields', 'Upgrade producers → consumers', 'Write-heavy systems (event streams)'],
              ['Full', 'Add/remove optional only', 'Any order (safest)', 'Microservices (rolling deploys)'],
              ['None', 'Any change (breaking)', 'Simultaneous deploy', 'Monoliths (rare)'],
            ]}
          />

          <Divider />

          <H2>💡 Real-World Example: User Service Schema Evolution</H2>
          <P>
            <Strong>Scenario:</Strong> SaaS platform with 200 microservices. User service needs to add "phone_number"
            field for 2FA feature. System processes 1M user events/hour on Kafka. Must avoid downtime.
          </P>

          <H3>❌ Bad Approach: No Compatibility (Breaking Change)</H3>
          <CodeBlock>
{`// Schema v1 (deployed in production)
message User {
  required int64 user_id = 1;
  required string email = 2;
  required string name = 3;
}

// Schema v2 (BREAKING: added required field)
message User {
  required int64 user_id = 1;
  required string email = 2;
  required string name = 3;
  required string phone_number = 4;  // ❌ BREAKS old consumers!
}

// Deployment Plan (BAD):
// 1. Stop all producers (user-service instances)
// 2. Stop all consumers (notification-service, auth-service, etc.)
// 3. Deploy new schema
// 4. Restart all services
// DOWNTIME: 30 minutes
// INCIDENT COST: $100k (1M users affected, revenue loss)
// RISK: High (coordination across 200 services)`}
          </CodeBlock>

          <H3>✅ Good Approach: Full Compatibility (Zero-Downtime)</H3>
          <CodeBlock>
{`// Schema v1 (current production)
message User {
  required int64 user_id = 1;
  required string email = 2;
  required string name = 3;
}

// Schema v2 (SAFE: added optional field with default)
message User {
  required int64 user_id = 1;
  required string email = 2;
  required string name = 3;
  optional string phone_number = 4 [default = ""];  // ✅ Optional, backward compatible
}

// Zero-Downtime Deployment:
// Phase 1: Deploy consumers (notification-service, auth-service)
//   - Can read v1 (existing) and v2 (new) messages
//   - If phone_number missing, use default ""
//   - No downtime, rolling deploy (5 minutes)

// Phase 2: Deploy producers (user-service)
//   - Start emitting v2 messages with phone_number
//   - All consumers already upgraded, can handle it
//   - No downtime, rolling deploy (5 minutes)

// Total Deployment Time: 10 minutes (vs 30 min downtime)
// DOWNTIME: 0 minutes
// INCIDENT COST: $0
// RISK: Low (gradual rollout, instant rollback)`}
          </CodeBlock>

          <H3>Advanced: Schema Registry with Compatibility Checks</H3>
          <CodeBlock>
{`// Confluent Schema Registry Configuration
const schemaRegistry = new SchemaRegistry({
  host: 'http://schema-registry:8081',
  compatibilityLevel: 'FULL'  // Enforces full compatibility
});

// Attempt to register breaking schema (will FAIL at CI time)
try {
  await schemaRegistry.register('user-events-value', breakingSchema);
} catch (error) {
  // SchemaRegistryError: Schema is not backward compatible
  // PREVENTED production incident at CI stage!
  console.error('Schema incompatible:', error);
  process.exit(1);
}

// Register compatible schema (SUCCEEDS)
const schemaId = await schemaRegistry.register('user-events-value', {
  type: 'record',
  name: 'User',
  fields: [
    { name: 'user_id', type: 'long' },
    { name: 'email', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'phone_number', type: ['null', 'string'], default: null }  // Compatible!
  ]
});

// Automated compatibility check in CI/CD:
// $ confluent schema-registry compatibility check --schema user-v2.avsc
// ✅ Schema is FULL compatible with version 1
// Proceeding with deployment...`}
          </CodeBlock>

          <Divider />

          <H2>🎯 Migration Strategies for Real Systems</H2>

          <H3>Strategy 1: Dual Write (Safest for Critical Changes)</H3>
          <CodeBlock>
{`// Use Case: Migrating from "full_name" to "first_name" + "last_name" (breaking change)

// Phase 1: Dual Write (producers write both formats)
async function saveUser(userData) {
  const user = {
    user_id: userData.id,
    full_name: userData.fullName,  // Old field (keep for backward compat)
    first_name: userData.firstName,  // New field
    last_name: userData.lastName,  // New field
  };

  await producer.send('user-events', user);
  // Now emitting BOTH old and new fields
}

// Phase 2: Dual Read (consumers prefer new fields, fallback to old)
async function consumeUser(message) {
  let firstName, lastName;

  if (message.first_name && message.last_name) {
    // New format (preferred)
    firstName = message.first_name;
    lastName = message.last_name;
  } else if (message.full_name) {
    // Old format (fallback)
    [firstName, lastName] = message.full_name.split(' ');
  }

  await processUser({ firstName, lastName });
}

// Phase 3: Deploy all consumers (can read old OR new format)
// Phase 4: Deploy all producers (writing both old + new)
// Phase 5: Verify 100% of messages have new fields (1 week)
// Phase 6: Remove old field from schema (cleanup)

// Timeline: 3 weeks (safe, gradual, zero downtime)
// Rollback: Easy (revert to Phase 3 anytime)`}
          </CodeBlock>

          <H3>Strategy 2: Shadow Read (Validate Before Cutover)</H3>
          <CodeBlock>
{`// Use Case: Migrating from Protobuf v1 to v2 (performance optimization)

// Phase 1: Shadow read (decode both, compare, log differences)
async function handleRequest(rawBytes) {
  // Primary: v1 (current production)
  const userV1 = UserV1.decode(rawBytes);

  try {
    // Shadow: v2 (new version, testing)
    const userV2 = UserV2.decode(rawBytes);

    // Compare results
    if (!deepEqual(userV1, userV2)) {
      logger.warn('Schema mismatch detected', {
        v1: userV1,
        v2: userV2,
        diff: diff(userV1, userV2)
      });
      metrics.increment('schema.migration.mismatch');
    } else {
      metrics.increment('schema.migration.match');
    }
  } catch (error) {
    logger.error('v2 decoding failed', error);
    metrics.increment('schema.migration.error');
  }

  // Use v1 result (safe)
  return processUser(userV1);
}

// Monitor for 1 week:
// - 99.99% match rate → Safe to migrate
// - Mismatches found → Fix v2 schema, repeat
// - Errors → Investigate encoding bugs

// Phase 2: Flip to v2 (after validation)
return processUser(userV2);  // Now using v2 in production`}
          </CodeBlock>

          <H3>Strategy 3: Version Header (Multiple Versions in Parallel)</H3>
          <CodeBlock>
{`// Use Case: Public API supporting multiple client versions

// API Gateway handles version routing
app.post('/api/users', async (req, res) => {
  const apiVersion = req.headers['api-version'] || '1.0';

  switch (apiVersion) {
    case '1.0':
      // Legacy clients (deprecated, but still supported)
      const userV1 = parseUserV1(req.body);
      const response = await createUser(userV1);
      res.json(formatResponseV1(response));
      break;

    case '2.0':
      // Current version (recommended)
      const userV2 = parseUserV2(req.body);
      const response = await createUser(userV2);
      res.json(formatResponseV2(response));
      break;

    case '3.0':
      // Beta version (early adopters)
      const userV3 = parseUserV3(req.body);
      const response = await createUser(userV3);
      res.json(formatResponseV3(response));
      break;

    default:
      res.status(400).json({ error: 'Unsupported API version' });
  }
});

// Deprecation Timeline:
// - v1.0: Deprecated (6 months notice), removed after 12 months
// - v2.0: Current stable
// - v3.0: Beta (feedback period)

// Benefits:
// - Clients migrate at their own pace (no forced upgrades)
// - A/B testing new features in v3.0
// - Gradual deprecation (gentle sunset)`}
          </CodeBlock>

          <Divider />

          <H2>⚠️ Common Mistakes & Fixes</H2>

          <H3>❌ Mistake 1: Adding Required Fields (Breaking Change)</H3>
          <CodeBlock>
{`// BAD: Added required field → breaks old consumers
message User {
  required int64 user_id = 1;
  required string email = 2;
  required string phone_number = 3;  // ❌ Old consumers crash!
}

// GOOD: Add optional field with default
message User {
  required int64 user_id = 1;
  required string email = 2;
  optional string phone_number = 3 [default = ""];  // ✅ Compatible
}

// Even Better: Use nullable union type (Avro)
{
  "name": "phone_number",
  "type": ["null", "string"],
  "default": null  // Explicit null default
}`}
          </CodeBlock>

          <H3>❌ Mistake 2: Reusing Field Numbers/Names</H3>
          <CodeBlock>
{`// BAD: Reused field number 4 (data corruption risk!)
message User {
  required int64 user_id = 1;
  required string email = 2;
  required string name = 3;
  // Field 4 was "address" (removed last month)
  required int32 age = 4;  // ❌ REUSED NUMBER! Old data has string, new code expects int!
}

// GOOD: Reserve deleted field numbers
message User {
  required int64 user_id = 1;
  required string email = 2;
  required string name = 3;
  reserved 4;  // ✅ Prevents reuse
  reserved "address";  // Also reserve name
  required int32 age = 5;  // Use new number
}

// Protobuf will reject compilation if you try to reuse reserved numbers`}
          </CodeBlock>

          <H3>❌ Mistake 3: Changing Field Types (Silent Data Corruption)</H3>
          <CodeBlock>
{`// BAD: Changed field type (breaks wire format!)
// Old schema
message Order {
  required int32 order_id = 1;  // Was int32
  required string user_id = 2;
}

// New schema
message Order {
  required int64 order_id = 1;  // ❌ Changed to int64 (wire format incompatible!)
  required string user_id = 2;
}

// Result: Old int32 values decoded as garbage int64 values

// GOOD: Add new field, deprecate old
message Order {
  optional int32 order_id = 1 [deprecated=true];  // Keep for compatibility
  required string user_id = 2;
  optional int64 order_id_v2 = 3;  // New field with correct type
}

// Migration:
// 1. Dual write: populate both order_id and order_id_v2
// 2. Consumers switch to reading order_id_v2
// 3. Remove order_id after migration complete`}
          </CodeBlock>

          <H3>❌ Mistake 4: Not Testing Compatibility Before Deployment</H3>
          <CodeBlock>
{`// BAD: Deploy schema changes without testing compatibility
git commit -m "Add phone_number field"
git push
# CI/CD auto-deploys to production
# 💥 Production outage: old consumers can't parse messages!

// GOOD: Automated compatibility checks in CI/CD
// .github/workflows/schema-check.yml
name: Schema Compatibility Check
on: [pull_request]

jobs:
  check-compatibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Check Protobuf Compatibility
        run: |
          # buf.build CLI checks compatibility
          buf breaking --against '.git#branch=main'

      - name: Check Avro Compatibility
        run: |
          # Confluent Schema Registry compatibility check
          curl -X POST http://schema-registry:8081/compatibility/subjects/user-events-value/versions/latest \\
            -H "Content-Type: application/vnd.schemaregistry.v1+json" \\
            -d '{"schema": "$(cat user-v2.avsc)"}' \\
            | jq -e '.is_compatible == true'

      # ✅ If compatible: PR approved
      # ❌ If incompatible: PR blocked, must fix

# Result: Catch breaking changes BEFORE production!`}
          </CodeBlock>

          <Divider />

          <H2>💰 ROI Analysis: Zero-Downtime Schema Evolution</H2>
          <InfoBox>
            <H3>SaaS Platform (200 Microservices)</H3>
            <UL>
              <LI><Strong>Schema Changes:</Strong> 50 per year (weekly releases)</LI>
              <LI><Strong>Services Affected:</Strong> Avg 10 services per change</LI>
              <LI><Strong>Users:</Strong> 5M active users</LI>
            </UL>

            <H3>Without Schema Compatibility (Coordinated Deploys)</H3>
            <UL>
              <LI><Strong>Downtime per change:</Strong> 20 minutes (coordinate 10 services)</LI>
              <LI><Strong>Annual downtime:</Strong> 50 changes × 20 min = 1,000 min = 16.7 hours</LI>
              <LI><Strong>Revenue loss:</Strong> $10k/hour × 16.7 hours = <Strong>$167,000/year</Strong></LI>
              <LI><Strong>Incident costs:</Strong> 10 incidents/year × $50k = <Strong>$500,000/year</Strong></LI>
              <LI><Strong>Engineering time:</Strong> 50 changes × 4 hours coordination = 200 hours = $50,000</LI>
              <LI><Strong>Total Cost:</Strong> <Strong>$717,000/year</Strong></LI>
            </UL>

            <H3>With Full Compatibility (Zero-Downtime)</H3>
            <UL>
              <LI><Strong>Downtime per change:</Strong> 0 minutes (rolling deploys)</LI>
              <LI><Strong>Annual downtime:</Strong> 0 hours</LI>
              <LI><Strong>Revenue loss:</Strong> $0</LI>
              <LI><Strong>Incident costs:</Strong> 1 incident/year × $50k = $50,000 (95% reduction)</LI>
              <LI><Strong>Engineering time:</Strong> Schema registry setup + CI checks = $100,000 (one-time)</LI>
              <LI><Strong>Ongoing cost:</Strong> Schema registry hosting = $5,000/year</LI>
            </UL>

            <H3>ROI Calculation</H3>
            <UL>
              <LI><Strong>Year 1 Savings:</Strong> $717k - $105k (setup + hosting) = <Strong>$612,000</Strong></LI>
              <LI><Strong>Year 2+ Savings:</Strong> $717k - $5k (hosting) = <Strong>$712,000/year</Strong></LI>
              <LI><Strong>Payback Period:</Strong> Immediate (saves 10× the investment in Year 1)</LI>
              <LI><Strong>3-Year NPV:</Strong> <Strong>$2.04M savings</Strong></LI>
            </UL>

            <P>
              <Strong>Additional Benefits:</Strong> Faster feature releases (no coordination delays),
              improved developer productivity (no incident firefighting), better customer experience (no downtime).
            </P>
          </InfoBox>

          <KeyPoint>
            <Strong>Compatibility Strategy Guidelines:</Strong><br />
            • <Strong>Full Compatibility:</Strong> Microservices with rolling deploys (99% of systems should use this)<br />
            • <Strong>Backward Compatible:</Strong> Event streaming where producers deploy before consumers<br />
            • <Strong>Forward Compatible:</Strong> Analytics pipelines where consumers deploy first<br />
            • <Strong>No Compatibility:</Strong> Only for monoliths with coordinated deploys (avoid if possible)<br /><br />
            <Strong>Golden Rule:</Strong> Always add optional fields with defaults. Never change field types or reuse numbers.
            Zero-downtime is worth the discipline.
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

