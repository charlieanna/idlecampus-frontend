import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, OL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider, InfoBox 
} from '../../../ui/components/LessonContent';

export const ddiaChapter4EncodingEvolutionLesson: SystemDesignLesson = {
  id: 'ddia-ch4-encoding-evolution',
  slug: 'ddia-ch4-encoding-evolution',
  title: 'Encoding & Evolution (DDIA Ch. 4)',
  description: 'Learn data encoding formats (JSON, Protocol Buffers, Avro) and schema evolution strategies.',
  category: 'fundamentals',
  difficulty: 'intermediate',
  estimatedMinutes: 50,
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
  ],
};

