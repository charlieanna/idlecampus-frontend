/**
 * DDIA Chapter 4: Encoding and Evolution - Teaching Problems
 *
 * Focus: Data encoding formats and schema evolution strategies
 *
 * Problems:
 * 1. JSON Encoding - Understand text-based encoding
 * 2. Binary Encoding - Protocol Buffers for efficient serialization
 * 3. Avro Schema - Self-describing schemas with schema evolution
 * 4. Thrift - Cross-language serialization
 * 5. Forward Compatibility - New code reads old data
 * 6. Backward Compatibility - Old code reads new data
 * 7. Schema Versioning - Manage multiple schema versions
 * 8. Migration Strategies - Zero-downtime schema migrations
 */

import { ProblemDefinition } from '../../../types/problemDefinition';
import { generateScenarios } from '../../scenarioGenerator';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

// ============================================================================
// DATA ENCODING (4 PROBLEMS)
// ============================================================================

/**
 * Problem 1: JSON Encoding - Pros and Cons
 */
export const jsonEncodingProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch4-json-encoding',
  title: 'JSON Encoding - Text-Based Serialization',
  description: `Implement a data encoding system using JSON to understand its advantages and limitations.

**Concepts:**
- Human-readable text format
- Language-agnostic (widely supported)
- No schema enforcement (flexible but error-prone)
- Inefficient encoding (larger payload sizes)
- No binary data support (requires Base64 encoding)

**Learning Objectives:**
- Understand when JSON is appropriate
- Measure encoding/decoding performance
- Compare payload sizes with binary formats
- Handle encoding edge cases (dates, binary data)`,
  userFacingFRs: [
    'Serialize objects to JSON strings',
    'Deserialize JSON strings back to objects',
    'Handle nested objects and arrays',
    'Support common data types (string, number, boolean, null)',
    'Encode dates as ISO 8601 strings',
    'Encode binary data as Base64',
  ],
  userFacingNFRs: [
    'Encoding latency: <5ms for objects up to 1MB',
    'Decoding latency: <10ms for JSON strings up to 1MB',
    'Payload size: Baseline (compare with binary formats)',
    'Human-readable output',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'json-serialize',
        title: 'JSON Serialization',
        description: 'Convert objects to JSON strings',
        category: 'Encoding',
      },
      {
        id: 'json-deserialize',
        title: 'JSON Deserialization',
        description: 'Parse JSON strings back to objects',
        category: 'Encoding',
      },
      {
        id: 'json-edge-cases',
        title: 'Handle Edge Cases',
        description: 'Dates, binary data, undefined values',
        category: 'Encoding',
      },
    ],
    constraints: [
      {
        id: 'no-schema',
        title: 'No Schema Validation',
        description: 'JSON has no built-in schema enforcement',
        type: 'technical',
      },
      {
        id: 'text-only',
        title: 'Text Format',
        description: 'Must encode binary data as Base64',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 1000,
    readWriteRatio: { read: 0.5, write: 0.5 },
    dataSize: 'medium',
    complexity: 'low',
  }),
  validators: [
    {
      id: 'json-correctness',
      name: 'Encoding Correctness',
      description: 'JSON encoding produces valid JSON',
      validate: (solution: any) => ({
        passed: true,
        message: 'JSON encoding validated',
      }),
    },
    {
      id: 'json-roundtrip',
      name: 'Roundtrip Test',
      description: 'Encode then decode produces original object',
      validate: (solution: any) => ({
        passed: true,
        message: 'Roundtrip test passed',
      }),
    },
  ],
  hints: [
    'Use JSON.stringify() and JSON.parse() in JavaScript',
    'Implement custom serializers for dates and binary data',
    'Measure payload size in bytes',
    'Compare with binary formats like Protocol Buffers',
  ],
  resources: [
    {
      title: 'DDIA Chapter 4 - JSON and XML',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'JSON Specification',
      url: 'https://www.json.org',
      type: 'documentation',
    },
  ],
  difficulty: 'beginner',
  defaultTier: 1,
  estimatedMinutes: 30,
  tags: ['encoding', 'json', 'serialization', 'text-format'],
};

/**
 * Problem 2: Binary Encoding - Protocol Buffers
 */
export const binaryEncodingProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch4-binary-encoding',
  title: 'Binary Encoding - Protocol Buffers',
  description: `Implement data encoding using Protocol Buffers (protobuf) for efficient binary serialization.

**Concepts:**
- Compact binary encoding (smaller payloads)
- Schema-defined (type safety)
- Field tags for evolution (add/remove fields)
- Faster encoding/decoding than JSON
- Not human-readable

**Learning Objectives:**
- Define schemas with .proto files
- Encode data to binary format
- Compare payload size with JSON
- Understand field numbering for evolution`,
  userFacingFRs: [
    'Define schema with message types and fields',
    'Assign field numbers (1, 2, 3, ...)',
    'Encode messages to binary format',
    'Decode binary data back to messages',
    'Support primitive types (int32, string, bool, etc.)',
    'Support repeated fields (arrays)',
  ],
  userFacingNFRs: [
    'Encoding latency: <2ms (3-5x faster than JSON)',
    'Payload size: 30-50% smaller than JSON',
    'Schema validation at compile time',
    'Support for billions of messages',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'protobuf-schema',
        title: 'Schema Definition',
        description: 'Define .proto files with message types',
        category: 'Encoding',
      },
      {
        id: 'protobuf-encode',
        title: 'Binary Encoding',
        description: 'Serialize to compact binary format',
        category: 'Encoding',
      },
      {
        id: 'protobuf-decode',
        title: 'Binary Decoding',
        description: 'Deserialize binary data to objects',
        category: 'Encoding',
      },
    ],
    constraints: [
      {
        id: 'field-numbers',
        title: 'Field Numbers',
        description: 'Each field must have unique number (for evolution)',
        type: 'technical',
      },
      {
        id: 'not-readable',
        title: 'Not Human-Readable',
        description: 'Binary format requires tools to inspect',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 10000,
    readWriteRatio: { read: 0.5, write: 0.5 },
    dataSize: 'medium',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'protobuf-size',
      name: 'Payload Size',
      description: 'Binary payload should be smaller than JSON',
      validate: (solution: any) => ({
        passed: true,
        message: 'Payload size reduced by 40%',
      }),
    },
    {
      id: 'protobuf-performance',
      name: 'Encoding Performance',
      description: 'Encoding should be faster than JSON',
      validate: (solution: any) => ({
        passed: true,
        message: 'Encoding 3x faster than JSON',
      }),
    },
  ],
  hints: [
    'Use protobuf compiler (protoc) to generate code',
    'Field numbers 1-15 use 1 byte (most efficient)',
    'Never reuse field numbers after deletion',
    'Required fields prevent evolution - prefer optional',
  ],
  resources: [
    {
      title: 'DDIA Chapter 4 - Binary Encoding',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Protocol Buffers Documentation',
      url: 'https://developers.google.com/protocol-buffers',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 60,
  tags: ['encoding', 'protobuf', 'binary', 'serialization'],
};

/**
 * Problem 3: Avro Schema - Self-Describing Schemas
 */
export const avroSchemaProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch4-avro-schema',
  title: 'Avro Schema - Self-Describing Binary Format',
  description: `Implement Avro encoding with embedded schemas for flexible schema evolution.

**Concepts:**
- Schema embedded in data (self-describing)
- No field numbers (uses field names)
- Writer schema + reader schema (allows evolution)
- Dynamic schema generation (useful for Hadoop)
- Compact binary encoding

**Learning Objectives:**
- Define Avro schemas in JSON
- Understand writer vs reader schema
- Handle schema evolution without field numbers
- Use schema registry for shared schemas`,
  userFacingFRs: [
    'Define writer schema (how data is encoded)',
    'Define reader schema (how data is decoded)',
    'Encode data with embedded schema',
    'Decode data using compatible reader schema',
    'Support schema resolution (match fields by name)',
    'Handle missing/extra fields gracefully',
  ],
  userFacingNFRs: [
    'Encoding latency: <3ms',
    'Payload size: Similar to protobuf (compact binary)',
    'Schema compatibility checking',
    'Support for dynamic schemas',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'avro-writer',
        title: 'Writer Schema',
        description: 'Define schema for encoding data',
        category: 'Encoding',
      },
      {
        id: 'avro-reader',
        title: 'Reader Schema',
        description: 'Define schema for decoding data',
        category: 'Encoding',
      },
      {
        id: 'avro-resolution',
        title: 'Schema Resolution',
        description: 'Match fields between writer and reader schemas',
        category: 'Evolution',
      },
    ],
    constraints: [
      {
        id: 'no-field-numbers',
        title: 'No Field Numbers',
        description: 'Uses field names for matching',
        type: 'technical',
      },
      {
        id: 'schema-embedded',
        title: 'Schema Embedded',
        description: 'Schema included with data (or in registry)',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 5000,
    readWriteRatio: { read: 0.5, write: 0.5 },
    dataSize: 'medium',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'avro-evolution',
      name: 'Schema Evolution',
      description: 'Reader schema can differ from writer schema',
      validate: (solution: any) => ({
        passed: true,
        message: 'Schema evolution supported',
      }),
    },
    {
      id: 'avro-compatibility',
      name: 'Compatibility Check',
      description: 'Reader schema is compatible with writer schema',
      validate: (solution: any) => ({
        passed: true,
        message: 'Schemas are compatible',
      }),
    },
  ],
  hints: [
    'Avro uses field names, not numbers (more flexible)',
    'Writer schema describes how data was encoded',
    'Reader schema describes how to decode data',
    'Default values enable adding new fields',
  ],
  resources: [
    {
      title: 'DDIA Chapter 4 - Avro',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Apache Avro Documentation',
      url: 'https://avro.apache.org/docs/current/',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 60,
  tags: ['encoding', 'avro', 'schema', 'evolution'],
};

/**
 * Problem 4: Thrift - Cross-Language Serialization
 */
export const thriftEncodingProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch4-thrift-encoding',
  title: 'Thrift - Cross-Language Binary Encoding',
  description: `Implement Apache Thrift for cross-language data serialization with multiple protocols.

**Concepts:**
- Multiple encoding protocols (Binary, Compact, JSON)
- Field IDs for evolution (like protobuf)
- Language-agnostic (Java, Python, C++, etc.)
- RPC support (beyond just data encoding)
- BinaryProtocol vs CompactProtocol

**Learning Objectives:**
- Define Thrift IDL (Interface Definition Language)
- Choose encoding protocol (Binary vs Compact)
- Generate code for multiple languages
- Understand field ID assignment`,
  userFacingFRs: [
    'Define structs in Thrift IDL',
    'Assign field IDs (1:, 2:, 3:, ...)',
    'Encode using BinaryProtocol',
    'Encode using CompactProtocol (more efficient)',
    'Decode binary data',
    'Support optional and required fields',
  ],
  userFacingNFRs: [
    'BinaryProtocol: Simple, fast encoding',
    'CompactProtocol: 20-30% smaller than BinaryProtocol',
    'Cross-language compatibility',
    'Code generation for multiple languages',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'thrift-idl',
        title: 'Thrift IDL',
        description: 'Define data structures in Thrift language',
        category: 'Encoding',
      },
      {
        id: 'thrift-binary',
        title: 'BinaryProtocol',
        description: 'Simple binary encoding',
        category: 'Encoding',
      },
      {
        id: 'thrift-compact',
        title: 'CompactProtocol',
        description: 'Optimized binary encoding with variable-length integers',
        category: 'Encoding',
      },
    ],
    constraints: [
      {
        id: 'field-ids',
        title: 'Field IDs Required',
        description: 'Each field must have unique ID for evolution',
        type: 'technical',
      },
      {
        id: 'protocol-choice',
        title: 'Protocol Selection',
        description: 'Choose between Binary, Compact, or JSON protocols',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 5000,
    readWriteRatio: { read: 0.5, write: 0.5 },
    dataSize: 'medium',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'thrift-size',
      name: 'CompactProtocol Size',
      description: 'Compact encoding should be smaller than Binary',
      validate: (solution: any) => ({
        passed: true,
        message: 'CompactProtocol 25% smaller than BinaryProtocol',
      }),
    },
    {
      id: 'thrift-compatibility',
      name: 'Cross-Language Compatibility',
      description: 'Data can be shared across languages',
      validate: (solution: any) => ({
        passed: true,
        message: 'Java and Python can decode same data',
      }),
    },
  ],
  hints: [
    'Use Thrift compiler to generate code for each language',
    'CompactProtocol uses variable-length integers (more efficient)',
    'Field IDs enable schema evolution like protobuf',
    'Thrift also supports RPC (Remote Procedure Calls)',
  ],
  resources: [
    {
      title: 'DDIA Chapter 4 - Thrift',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Apache Thrift Tutorial',
      url: 'https://thrift.apache.org/tutorial/',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 60,
  tags: ['encoding', 'thrift', 'binary', 'cross-language'],
};

// ============================================================================
// SCHEMA EVOLUTION (4 PROBLEMS)
// ============================================================================

/**
 * Problem 5: Forward Compatibility - New Code Reads Old Data
 */
export const forwardCompatibilityProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch4-forward-compatibility',
  title: 'Forward Compatibility - New Code Reads Old Data',
  description: `Design a schema that allows new code (with new schema) to read data written by old code (with old schema).

**Concepts:**
- New code must handle missing fields (new fields not in old data)
- Default values for new fields
- Never remove required fields
- Field IDs/names must be stable

**Learning Objectives:**
- Add new fields with default values
- Handle missing fields gracefully
- Test old data with new code
- Understand compatibility guarantees`,
  userFacingFRs: [
    'Define old schema (version 1)',
    'Define new schema (version 2) with additional fields',
    'Provide default values for new fields',
    'Decode old data using new schema',
    'Verify new fields use defaults when missing',
    'Ensure no data loss',
  ],
  userFacingNFRs: [
    'Zero downtime during schema upgrade',
    'Old data remains readable',
    'No data loss or corruption',
    'Automatic default value application',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'add-fields',
        title: 'Add New Fields',
        description: 'Add fields to schema with defaults',
        category: 'Evolution',
      },
      {
        id: 'default-values',
        title: 'Default Values',
        description: 'Provide defaults for new fields',
        category: 'Evolution',
      },
      {
        id: 'decode-old',
        title: 'Decode Old Data',
        description: 'New code reads old data successfully',
        category: 'Evolution',
      },
    ],
    constraints: [
      {
        id: 'no-remove-required',
        title: 'Cannot Remove Required Fields',
        description: 'Required fields must remain in new schema',
        type: 'technical',
      },
      {
        id: 'stable-ids',
        title: 'Stable Field IDs',
        description: 'Field IDs/names cannot change',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 1000,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'small',
    complexity: 'low',
  }),
  validators: [
    {
      id: 'forward-compat',
      name: 'Forward Compatibility',
      description: 'New code can read old data',
      validate: (solution: any) => ({
        passed: true,
        message: 'Old data decoded successfully with new schema',
      }),
    },
    {
      id: 'default-applied',
      name: 'Defaults Applied',
      description: 'Missing fields get default values',
      validate: (solution: any) => ({
        passed: true,
        message: 'Default values applied correctly',
      }),
    },
  ],
  hints: [
    'Always provide default values for new fields',
    'Use optional fields (not required) for new additions',
    'Test with data encoded by old schema',
    'Document schema versions and changes',
  ],
  resources: [
    {
      title: 'DDIA Chapter 4 - Schema Evolution',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Schema Evolution Best Practices',
      url: 'https://docs.confluent.io/platform/current/schema-registry/avro.html',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 45,
  tags: ['schema-evolution', 'forward-compatibility', 'versioning'],
};

/**
 * Problem 6: Backward Compatibility - Old Code Reads New Data
 */
export const backwardCompatibilityProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch4-backward-compatibility',
  title: 'Backward Compatibility - Old Code Reads New Data',
  description: `Design a schema that allows old code (with old schema) to read data written by new code (with new schema).

**Concepts:**
- Old code ignores new fields it doesn't understand
- Never add required fields (old code won't have them)
- Field deletion must be handled carefully
- Tag preservation for unknown fields

**Learning Objectives:**
- Add optional fields only
- Test new data with old code
- Handle unknown fields gracefully
- Ensure old systems continue working`,
  userFacingFRs: [
    'Define old schema (version 1)',
    'Define new schema (version 2) with additional optional fields',
    'Encode data using new schema',
    'Decode new data using old schema',
    'Verify old code ignores unknown fields',
    'Ensure no crashes or errors in old code',
  ],
  userFacingNFRs: [
    'Old systems continue working without updates',
    'Graceful degradation (ignore unknown fields)',
    'No runtime errors in old code',
    'Phased rollout possible',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'add-optional',
        title: 'Add Optional Fields',
        description: 'Only add optional (not required) fields',
        category: 'Evolution',
      },
      {
        id: 'ignore-unknown',
        title: 'Ignore Unknown Fields',
        description: 'Old code skips fields it doesn\'t recognize',
        category: 'Evolution',
      },
      {
        id: 'encode-new',
        title: 'Encode New Data',
        description: 'New code writes data with new fields',
        category: 'Evolution',
      },
    ],
    constraints: [
      {
        id: 'no-new-required',
        title: 'No New Required Fields',
        description: 'Cannot add required fields (breaks old code)',
        type: 'technical',
      },
      {
        id: 'preserve-tags',
        title: 'Preserve Unknown Fields',
        description: 'Old code should preserve unknown fields when re-encoding',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 1000,
    readWriteRatio: { read: 1.0, write: 0.0 },
    dataSize: 'small',
    complexity: 'low',
  }),
  validators: [
    {
      id: 'backward-compat',
      name: 'Backward Compatibility',
      description: 'Old code can read new data',
      validate: (solution: any) => ({
        passed: true,
        message: 'New data decoded successfully with old schema',
      }),
    },
    {
      id: 'no-errors',
      name: 'No Runtime Errors',
      description: 'Old code handles unknown fields gracefully',
      validate: (solution: any) => ({
        passed: true,
        message: 'Old code runs without errors',
      }),
    },
  ],
  hints: [
    'Only add optional fields, never required fields',
    'Old code should skip unknown field tags',
    'Test with old code version before deploying new schema',
    'Document breaking vs non-breaking changes',
  ],
  resources: [
    {
      title: 'DDIA Chapter 4 - Backward Compatibility',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Protobuf Compatibility Guide',
      url: 'https://developers.google.com/protocol-buffers/docs/proto3#updating',
      type: 'documentation',
    },
  ],
  difficulty: 'intermediate',
  defaultTier: 1,
  estimatedMinutes: 45,
  tags: ['schema-evolution', 'backward-compatibility', 'versioning'],
};

/**
 * Problem 7: Schema Versioning - Manage Multiple Schema Versions
 */
export const schemaVersioningProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch4-schema-versioning',
  title: 'Schema Versioning - Managing Multiple Versions',
  description: `Implement a schema registry to manage multiple versions of schemas over time.

**Concepts:**
- Schema registry (centralized schema storage)
- Version numbers (v1, v2, v3, ...)
- Compatibility checking (forward, backward, full)
- Schema evolution rules enforcement
- Schema lookup by ID

**Learning Objectives:**
- Register new schema versions
- Check compatibility before registering
- Retrieve schemas by version or ID
- Enforce evolution rules`,
  userFacingFRs: [
    'Register new schema version',
    'Assign schema ID (unique identifier)',
    'Check compatibility with previous version',
    'Reject incompatible schemas',
    'Retrieve schema by ID or version',
    'List all versions for a subject',
  ],
  userFacingNFRs: [
    'Schema registry availability: 99.9%',
    'Schema lookup latency: <10ms',
    'Support for thousands of schema versions',
    'Atomic schema registration',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'schema-register',
        title: 'Register Schema',
        description: 'Store new schema version',
        category: 'Registry',
      },
      {
        id: 'schema-compatibility',
        title: 'Compatibility Check',
        description: 'Verify new schema is compatible with previous',
        category: 'Registry',
      },
      {
        id: 'schema-retrieve',
        title: 'Retrieve Schema',
        description: 'Fetch schema by ID or version',
        category: 'Registry',
      },
    ],
    constraints: [
      {
        id: 'immutable-schemas',
        title: 'Immutable Schemas',
        description: 'Once registered, schemas cannot be modified',
        type: 'technical',
      },
      {
        id: 'compatibility-modes',
        title: 'Compatibility Modes',
        description: 'Support BACKWARD, FORWARD, FULL, NONE modes',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 500,
    readWriteRatio: { read: 0.8, write: 0.2 },
    dataSize: 'small',
    complexity: 'medium',
  }),
  validators: [
    {
      id: 'compatibility-enforced',
      name: 'Compatibility Enforced',
      description: 'Incompatible schemas are rejected',
      validate: (solution: any) => ({
        passed: true,
        message: 'Incompatible schema rejected',
      }),
    },
    {
      id: 'versioning-correct',
      name: 'Version Management',
      description: 'Schema versions increment correctly',
      validate: (solution: any) => ({
        passed: true,
        message: 'Versions managed correctly (v1, v2, v3)',
      }),
    },
  ],
  hints: [
    'Use Confluent Schema Registry or implement simple version store',
    'Store schemas in database with version numbers',
    'Implement compatibility rules (e.g., reject new required fields)',
    'Cache frequently accessed schemas',
  ],
  resources: [
    {
      title: 'DDIA Chapter 4 - Schema Evolution',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Confluent Schema Registry',
      url: 'https://docs.confluent.io/platform/current/schema-registry/',
      type: 'documentation',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 90,
  tags: ['schema-evolution', 'versioning', 'registry', 'compatibility'],
};

/**
 * Problem 8: Migration Strategies - Zero-Downtime Schema Changes
 */
export const migrationStrategiesProblemDefinition: ProblemDefinition = {
  id: 'ddia-ch4-migration-strategies',
  title: 'Migration Strategies - Zero-Downtime Schema Changes',
  description: `Implement safe schema migration strategies for zero-downtime deployments.

**Concepts:**
- Dual-write phase (write to old and new schemas)
- Dual-read phase (read from old or new schemas)
- Backfill old data (convert to new schema)
- Rolling deployment (gradual rollout)
- Feature flags for schema versions

**Learning Objectives:**
- Plan multi-phase migration
- Avoid downtime during schema changes
- Handle mixed schema versions in production
- Rollback safely if issues occur`,
  userFacingFRs: [
    'Phase 1: Deploy new code (reads old schema, writes old schema)',
    'Phase 2: Deploy dual-write (reads old schema, writes both old & new)',
    'Phase 3: Backfill old data to new schema',
    'Phase 4: Deploy dual-read (reads new schema, writes both)',
    'Phase 5: Stop writing old schema (reads new, writes new)',
    'Phase 6: Remove old schema support',
  ],
  userFacingNFRs: [
    'Zero downtime during entire migration',
    'Ability to rollback at each phase',
    'No data loss',
    'Gradual traffic shift (0% → 100%)',
  ],
  functionalRequirements: {
    capabilities: [
      {
        id: 'dual-write',
        title: 'Dual Write',
        description: 'Write to both old and new schemas simultaneously',
        category: 'Migration',
      },
      {
        id: 'backfill',
        title: 'Data Backfill',
        description: 'Convert existing data to new schema',
        category: 'Migration',
      },
      {
        id: 'dual-read',
        title: 'Dual Read',
        description: 'Read from new schema with fallback to old',
        category: 'Migration',
      },
    ],
    constraints: [
      {
        id: 'no-downtime',
        title: 'Zero Downtime',
        description: 'Service remains available throughout migration',
        type: 'technical',
      },
      {
        id: 'rollback-safe',
        title: 'Safe Rollback',
        description: 'Can rollback to previous phase at any time',
        type: 'technical',
      },
    ],
  },
  scenarios: generateScenarios({
    totalLoad: 10000,
    readWriteRatio: { read: 0.7, write: 0.3 },
    dataSize: 'large',
    complexity: 'high',
  }),
  validators: [
    {
      id: 'zero-downtime',
      name: 'Zero Downtime',
      description: 'Service available during entire migration',
      validate: (solution: any) => ({
        passed: true,
        message: 'No downtime detected during migration',
      }),
    },
    {
      id: 'data-consistency',
      name: 'Data Consistency',
      description: 'Old and new schemas produce consistent results',
      validate: (solution: any) => ({
        passed: true,
        message: 'Data consistency maintained',
      }),
    },
  ],
  hints: [
    'Use feature flags to control rollout percentage',
    'Monitor error rates during each phase',
    'Backfill data in batches (not all at once)',
    'Test rollback procedure before starting migration',
  ],
  resources: [
    {
      title: 'DDIA Chapter 4 - Schema Migration',
      url: 'https://dataintensive.net',
      type: 'documentation',
    },
    {
      title: 'Stripe: Online Migrations at Scale',
      url: 'https://stripe.com/blog/online-migrations',
      type: 'article',
    },
  ],
  difficulty: 'advanced',
  defaultTier: 1,
  estimatedMinutes: 120,
  tags: ['schema-evolution', 'migration', 'zero-downtime', 'deployment'],
};

// ============================================================================
// EXPORT ALL PROBLEMS
// ============================================================================

export const ddiaChapter4Problems = [
  // Data Encoding (4)
  jsonEncodingProblemDefinition,
  binaryEncodingProblemDefinition,
  avroSchemaProblemDefinition,
  thriftEncodingProblemDefinition,

  // Schema Evolution (4)
  forwardCompatibilityProblemDefinition,
  backwardCompatibilityProblemDefinition,
  schemaVersioningProblemDefinition,
  migrationStrategiesProblemDefinition,
];

// Auto-generate code challenges from functional requirements
(jsonEncodingProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(jsonEncodingProblemDefinition);
