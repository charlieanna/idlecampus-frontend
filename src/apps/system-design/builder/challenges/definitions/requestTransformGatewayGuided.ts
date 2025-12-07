import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';
import { TestCase } from '../../types/testCase';

/**
 * Request Transform Gateway Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches request transformation concepts
 * while building a gateway that transforms, validates, and translates API requests.
 *
 * Focus Areas:
 * - Request/response transformation
 * - Protocol translation (REST to gRPC, GraphQL)
 * - Schema validation and versioning
 * - Header manipulation and enrichment
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic transformation (header manipulation, body rewriting) - FRs satisfied!
 * Steps 4-6: Apply NFRs (protocol translation, schema validation, version compatibility)
 *
 * Key Pedagogy: First make it WORK, then make it COMPATIBLE, then make it ROBUST
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const requestTransformRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a Request Transform Gateway that translates and transforms API requests between different formats and protocols",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Principal Engineer',
    avatar: '👩‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-transformation',
      category: 'functional',
      question: "What does a Request Transform Gateway actually do? Why do we need it?",
      answer: "Our company has legacy backend services that expect XML requests, but our new mobile app sends JSON. We also have:\n1. Old REST APIs that need to talk to new gRPC services\n2. Different API versions (v1, v2, v3) with incompatible schemas\n3. External partners sending requests in their own formats\n\nThe Transform Gateway sits in the middle and:\n1. **Transforms request bodies**: JSON ↔ XML, REST ↔ gRPC, GraphQL ↔ REST\n2. **Manipulates headers**: Add auth tokens, set content types, inject trace IDs\n3. **Validates schemas**: Ensure requests match expected format before forwarding\n4. **Version translation**: Convert v1 requests to v2 format automatically",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Transform Gateway acts as a universal translator between different API formats and protocols",
    },
    {
      id: 'transformation-rules',
      category: 'functional',
      question: "How do you configure transformation rules? Can you give a concrete example?",
      answer: "Transformation rules are configured per route:\n\n**Example 1: JSON to XML**\n```\nInput (from mobile app):\nPOST /api/v2/users\n{ \"name\": \"Alice\", \"email\": \"alice@example.com\" }\n\nTransformation:\n- Convert JSON body to XML\n- Add SOAP envelope\n- Set Content-Type: application/xml\n\nOutput (to legacy service):\nPOST /legacy/createUser\n<soap:Envelope>\n  <user><name>Alice</name><email>alice@example.com</email></user>\n</soap:Envelope>\n```\n\n**Example 2: Header enrichment**\n```\nInput: GET /api/products\nTransform: Add X-API-Key, X-Trace-ID, X-Request-Time\nOutput: GET /internal/products (with enriched headers)\n```",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Transformation rules define how to convert between formats, manipulate headers, and enrich requests",
    },
    {
      id: 'protocol-translation',
      category: 'functional',
      question: "You mentioned REST to gRPC translation. How does that work?",
      answer: "**REST to gRPC translation** is one of the most complex transformations:\n\n1. **Parse REST request**: Extract path params, query params, JSON body\n2. **Map to Protobuf**: Convert JSON fields to protobuf message format\n3. **Make gRPC call**: Send binary protobuf over HTTP/2\n4. **Translate response**: Convert protobuf response back to REST JSON\n\n**Example:**\n```\nREST Request:\nGET /api/users/123?fields=name,email\n\nTransformed to gRPC:\nGetUser(UserRequest{\n  user_id: \"123\",\n  field_mask: [\"name\", \"email\"]\n})\n\ngRPC Response → REST Response:\n{ \"name\": \"Alice\", \"email\": \"alice@example.com\" }\n```\n\nThis lets old REST clients work with new gRPC backends!",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Protocol translation bridges different communication styles (REST, gRPC, GraphQL)",
    },

    // IMPORTANT - Clarifications
    {
      id: 'schema-validation',
      category: 'clarification',
      question: "Should the gateway validate request schemas before transformation?",
      answer: "Yes! Schema validation is crucial:\n\n1. **Pre-validation**: Check if incoming request matches expected schema\n   - JSON Schema validation for JSON APIs\n   - XSD validation for XML APIs\n   - Protobuf validation for gRPC\n\n2. **Why validate early?**\n   - Fail fast with clear error messages\n   - Prevent invalid data from reaching backends\n   - Reduce backend load from malformed requests\n\n3. **Error responses:**\n   - 400 Bad Request for schema violations\n   - Include which fields failed validation\n   - Suggest correct format",
      importance: 'important',
      insight: "Validate early, fail fast - better UX and less backend load",
    },
    {
      id: 'bidirectional-transform',
      category: 'clarification',
      question: "Do we need to transform both requests AND responses?",
      answer: "Yes, absolutely! Bidirectional transformation:\n\n**Request transformation (client → backend):**\n- Convert JSON to XML\n- Add authentication headers\n- Map v1 schema to v2 schema\n\n**Response transformation (backend → client):**\n- Convert XML back to JSON\n- Remove internal headers (X-Internal-*)\n- Map v2 response back to v1 format\n- Add CORS headers\n\nWithout response transformation, clients would receive XML when they expect JSON!",
      importance: 'critical',
      insight: "Transformation is bidirectional - both request and response must be translated",
    },
    {
      id: 'content-negotiation',
      category: 'clarification',
      question: "How do you handle clients that support multiple formats?",
      answer: "Use **Content Negotiation**:\n\n1. **Accept header**: Client specifies preferred response format\n   - `Accept: application/json` → Return JSON\n   - `Accept: application/xml` → Return XML\n   - `Accept: application/vnd.api.v2+json` → Return v2 JSON\n\n2. **Content-Type header**: Client specifies request format\n   - `Content-Type: application/json` → Parse as JSON\n   - `Content-Type: application/xml` → Parse as XML\n\n3. **Gateway decides transformation**:\n   - Client sends JSON + backend expects XML → Transform JSON to XML\n   - Client sends XML + backend expects JSON → Transform XML to JSON\n   - Client sends JSON + backend expects JSON → No transformation",
      importance: 'important',
      insight: "Content negotiation lets one API serve multiple formats",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs (Interview Discovery Order)
    // =============================================================================

    // 1. THROUGHPUT
    {
      id: 'throughput-requests',
      category: 'throughput',
      question: "How many requests per second will the gateway need to transform?",
      answer: "We expect 5,000 requests/second during peak hours. Each request needs transformation (JSON to XML, header enrichment, etc.)",
      importance: 'critical',
      calculation: {
        formula: "5K RPS × ~5ms transformation time = need efficient parsing/serialization",
        result: "~5K RPS peak throughput",
      },
      learningPoint: "Transformation adds CPU overhead - need efficient parsers (not regex!)",
    },
    {
      id: 'throughput-complexity',
      category: 'throughput',
      question: "How complex are the transformations? Simple field mappings or complex logic?",
      answer: "Mix of both:\n- **Simple (80%)**: Field renaming, header injection, JSON ↔ XML\n- **Complex (20%)**: Nested object restructuring, array transformations, conditional logic\n\nExample complex transformation:\n```\nv1: { \"user\": { \"fullName\": \"Alice Smith\" } }\nv2: { \"user\": { \"firstName\": \"Alice\", \"lastName\": \"Smith\" } }\n```\nNeed to split fullName → firstName + lastName",
      importance: 'important',
      learningPoint: "Complex transformations require scripting (Lua, JavaScript) not just config",
    },

    // 2. LATENCY
    {
      id: 'latency-overhead',
      category: 'latency',
      question: "What's the acceptable latency overhead for transformations?",
      answer: "Gateway should add < 10ms p99 latency. Transformations should be fast:\n- JSON parsing/serialization: 1-2ms\n- XML parsing: 3-5ms (slower than JSON)\n- Schema validation: 1-2ms\n- Total transformation: < 10ms\n\nBackend response time is 50-100ms, so 10ms overhead is acceptable.",
      importance: 'critical',
      learningPoint: "Use streaming parsers for large payloads to reduce latency",
    },
    {
      id: 'latency-streaming',
      category: 'latency',
      question: "What if request/response bodies are very large? Do we need streaming?",
      answer: "Yes! For large payloads (>1MB):\n- **Streaming transformation**: Parse and transform on-the-fly without buffering entire payload\n- **Chunked encoding**: Send response chunks as they're transformed\n- **Backpressure**: Slow down reading if transformation can't keep up\n\nExample: Transforming a 100MB XML file → JSON. Don't load entire 100MB into memory!",
      importance: 'important',
      insight: "Streaming prevents OOM errors for large payloads",
    },

    // 3. PAYLOAD
    {
      id: 'payload-size',
      category: 'payload',
      question: "What's the typical request/response size?",
      answer: "Varies widely:\n- **Small (70%)**: 1-10KB (typical REST API calls)\n- **Medium (25%)**: 10-100KB (lists, nested objects)\n- **Large (5%)**: 100KB-10MB (bulk uploads, exports)\n\nLarge payloads need streaming transformation to avoid buffering.",
      importance: 'important',
      learningPoint: "Set max payload size limits (e.g., 10MB) to prevent DoS",
    },

    // 4. RELIABILITY
    {
      id: 'reliability-validation-failures',
      category: 'reliability',
      question: "What happens if a transformation or validation fails?",
      answer: "**Fail fast with clear errors:**\n\n1. **Schema validation fails**: Return 400 Bad Request\n   \`\`\`json\n   {\n     \"error\": \"Schema validation failed\",\n     \"details\": \"Field 'email' is required but missing\",\n     \"field\": \"email\"\n   }\n   ```\n\n2. **Transformation fails**: Return 502 Bad Gateway\n   - Log the error for debugging\n   - Don't forward invalid requests to backend\n\n3. **Backend error**: Transform error response back to client format\n   - Backend returns XML error → Transform to JSON for REST client",
      importance: 'critical',
      learningPoint: "Validation failures should not crash the gateway - return structured errors",
    },
    {
      id: 'reliability-version-compat',
      category: 'reliability',
      question: "How do you ensure version compatibility when transforming between API versions?",
      answer: "**Version translation strategies:**\n\n1. **Additive changes** (v1 → v2 added fields):\n   - v1 client → Gateway adds default values for new v2 fields\n   - v2 response → Gateway strips new fields for v1 client\n\n2. **Breaking changes** (v1 → v2 renamed fields):\n   - Maintain transformation mappings: `oldField → newField`\n   - Test both directions: v1→v2 and v2→v1\n\n3. **Deprecated fields**:\n   - Gateway still accepts old fields\n   - Returns warning header: `X-API-Deprecated: field 'oldField' is deprecated`",
      importance: 'critical',
      insight: "Good version translation extends API lifespan - old clients keep working",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-transformation', 'transformation-rules', 'protocol-translation'],
  criticalFRQuestionIds: ['core-transformation', 'transformation-rules', 'protocol-translation'],
  criticalScaleQuestionIds: ['throughput-requests', 'latency-overhead', 'reliability-validation-failures'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Request/Response Body Transformation',
      description: 'Transform request and response bodies between formats (JSON, XML, Protobuf)',
      emoji: '🔄',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Header Manipulation and Enrichment',
      description: 'Add, modify, or remove headers (auth tokens, trace IDs, content types)',
      emoji: '🏷️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Protocol Translation',
      description: 'Translate between REST, gRPC, and GraphQL protocols',
      emoji: '🌉',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: 'N/A (B2B API Gateway)',
    writesPerDay: 'N/A',
    readsPerDay: 'N/A',
    peakMultiplier: 2,
    readWriteRatio: 'Mixed',
    calculatedWriteRPS: { average: 0, peak: 0 },
    calculatedReadRPS: { average: 2500, peak: 5000 },
    maxPayloadSize: '~10MB (with streaming for larger)',
    redirectLatencySLA: 'p99 < 10ms (transformation overhead)',
    createLatencySLA: 'p99 < 100ms (end-to-end)',
  },

  architecturalImplications: [
    '✅ 5K RPS → Need efficient parsers (streaming for large payloads)',
    '✅ < 10ms transformation → Use native parsers (not regex), cache schemas',
    '✅ JSON/XML/Protobuf → Support multiple serialization libraries',
    '✅ Schema validation → Pre-validate all requests, fail fast',
    '✅ Version translation → Maintain bidirectional mappings',
  ],

  outOfScope: [
    'Authentication/Authorization (assume handled elsewhere)',
    'Rate limiting (separate concern)',
    'Caching (separate layer)',
    'Complex business logic (keep transforms declarative)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a gateway that can transform JSON to XML and manipulate headers. Once that works, we'll add protocol translation and schema validation. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Transform Gateway
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Your company is modernizing its APIs, but legacy services still expect XML!",
  hook: "New mobile apps send JSON, but the backend only speaks XML. Clients are getting 'Unsupported Media Type' errors. We need a gateway to translate between formats!",
  challenge: "Set up the basic Request Transform Gateway to act as a translator between clients and backend services.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your Transform Gateway is online!",
  achievement: "Gateway is ready to intercept and transform requests",
  metrics: [
    { label: 'Status', after: 'Active' },
    { label: 'Entry Point', after: 'Single gateway' },
  ],
  nextTeaser: "But it's not transforming anything yet... let's add header manipulation!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Request Transform Gateway Pattern',
  conceptExplanation: `A **Request Transform Gateway** sits between clients and backend services, transforming requests and responses.

**The Problem:**
- Modern clients send JSON
- Legacy backends expect XML/SOAP
- Different API versions use different schemas
- External partners use their own formats

**The Solution: Transform Gateway**
- Intercepts all requests
- Transforms format: JSON ↔ XML ↔ Protobuf
- Enriches headers: adds auth, trace IDs
- Validates schemas before forwarding
- Translates between API versions

Think of it as a universal translator for APIs.`,
  whyItMatters: 'Without a transform gateway, every client needs custom code to work with each backend format. The gateway centralizes transformation logic.',
  keyPoints: [
    'Gateway intercepts requests before they reach backends',
    'Transforms request/response formats (JSON, XML, Protobuf)',
    'Enriches requests with headers (auth, tracing)',
    'Validates schemas to fail fast',
    'Enables gradual migration from old to new formats',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────────┐         ┌─────────────┐
│   Client    │         │  Transform Gateway  │         │   Backend   │
│ (JSON API)  │ ──────▶ │  JSON → XML         │ ──────▶ │ (XML/SOAP)  │
└─────────────┘         │  Add headers        │         └─────────────┘
                        │  Validate schema    │
                        └─────────────────────┘
`,
  keyConcepts: [
    {
      title: 'Format Translation',
      explanation: 'Convert between JSON, XML, Protobuf, etc.',
      icon: '🔄',
    },
    {
      title: 'Header Enrichment',
      explanation: 'Add authentication, tracing, metadata headers',
      icon: '🏷️',
    },
    {
      title: 'Schema Validation',
      explanation: 'Validate requests match expected format',
      icon: '✅',
    },
  ],
  quickCheck: {
    question: 'What is the main benefit of a Request Transform Gateway?',
    options: [
      'Faster request processing',
      'Centralizes format translation so clients don\'t need custom code',
      'Reduces database load',
      'Improves security',
    ],
    correctIndex: 1,
    explanation: 'Transform Gateway centralizes all format translation logic. Clients can use their preferred format (JSON) even if backends expect different formats (XML).',
  },
};

const step1: GuidedStep = {
  id: 'transform-gateway-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Clients can send requests to the Transform Gateway',
    taskDescription: 'Add Client and API Gateway (Transform Gateway), then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents client applications', displayName: 'Client' },
      { type: 'api_gateway', reason: 'Transform Gateway', displayName: 'Transform Gateway' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Transform Gateway', reason: 'Clients send requests here' },
    ],
    successCriteria: ['Add Client', 'Add Transform Gateway', 'Connect Client → Transform Gateway'],
  },
  validation: {
    requiredComponents: ['client', 'api_gateway'],
    requiredConnections: [{ fromType: 'client', toType: 'api_gateway' }],
  },
  hints: {
    level1: 'Add Client and API Gateway (Transform Gateway), then connect them',
    level2: 'Drag Client and API Gateway from sidebar, then drag from Client to API Gateway',
    solutionComponents: [{ type: 'client' }, { type: 'api_gateway' }],
    solutionConnections: [{ from: 'client', to: 'api_gateway' }],
  },
};

// =============================================================================
// STEP 2: Implement Header Manipulation
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🏷️',
  scenario: "Your backend services require authentication headers, but clients don't send them!",
  hook: "Clients send 'GET /api/users' but the backend expects 'X-API-Key' and 'X-Request-ID' headers. Requests are being rejected with 401 Unauthorized!",
  challenge: "Configure the gateway to enrich requests by adding authentication and tracing headers.",
  illustration: 'configure-headers',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Header enrichment is working!",
  achievement: "Gateway now adds auth and tracing headers automatically",
  metrics: [
    { label: 'Headers added', after: 'X-API-Key, X-Request-ID' },
    { label: 'Auth failures', before: '100%', after: '0%' },
  ],
  nextTeaser: "Great! But we still need to transform the request BODY from JSON to XML...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Header Manipulation and Enrichment',
  conceptExplanation: `**Headers** are metadata about the HTTP request/response.

**Common header operations:**

**1. Add headers (enrichment):**
\`\`\`
X-API-Key: secret-key-123           # Authentication
X-Request-ID: uuid-4567            # Distributed tracing
X-Forwarded-For: 192.168.1.1       # Client IP
X-Request-Time: 2024-01-15T10:30   # Timestamp
\`\`\`

**2. Modify headers:**
\`\`\`
Content-Type: application/json → application/xml
Accept: */* → application/json
\`\`\`

**3. Remove headers (sanitization):**
\`\`\`
Remove: X-Internal-Token           # Don't expose internal headers
Remove: X-Debug-Mode               # Remove debug flags
\`\`\`

**Why header manipulation matters:**
- **Authentication**: Add API keys or JWT tokens
- **Tracing**: Inject request IDs for distributed tracing
- **Content negotiation**: Set correct Content-Type
- **Security**: Remove internal headers from responses
- **Metadata**: Add timestamps, client info, etc.`,
  whyItMatters: 'Header manipulation centralizes cross-cutting concerns. Instead of every client adding auth headers, the gateway does it once for all clients.',
  realWorldExample: {
    company: 'Stripe',
    scenario: 'Stripe API Gateway adds several headers to every request',
    howTheyDoIt: 'Gateway injects: Request-Id (for support), Idempotency-Key (for retries), Stripe-Version (API version). Clients don\'t need to manage these.',
  },
  keyPoints: [
    'Headers are key-value metadata in HTTP requests/responses',
    'Gateway can add, modify, or remove headers',
    'Common: auth headers, trace IDs, content types',
    'Response headers can also be modified (CORS, security)',
    'Centralize header logic instead of duplicating in clients',
  ],
  diagram: `
Request arrives:
GET /api/users
Host: api.company.com

Transform Gateway adds:
┌─────────────────────────────────┐
│ + X-API-Key: secret-123         │
│ + X-Request-ID: uuid-456        │
│ + X-Request-Time: 2024-01-15    │
│ + Content-Type: application/xml │
└─────────────────────────────────┘

Forwarded to backend:
GET /internal/users
X-API-Key: secret-123
X-Request-ID: uuid-456
X-Request-Time: 2024-01-15
Content-Type: application/xml
`,
  keyConcepts: [
    { title: 'Header Enrichment', explanation: 'Add new headers to requests', icon: '➕' },
    { title: 'Header Sanitization', explanation: 'Remove sensitive headers from responses', icon: '🧹' },
    { title: 'Trace ID', explanation: 'Unique ID for request tracking across services', icon: '🔍' },
  ],
  quickCheck: {
    question: 'Why inject X-Request-ID header at the gateway?',
    options: [
      'For authentication',
      'For distributed tracing - correlate logs across services',
      'To cache responses',
      'For rate limiting',
    ],
    correctIndex: 1,
    explanation: 'X-Request-ID (or X-Trace-ID) allows you to correlate logs across multiple services. When a request flows through gateway → service A → service B, all logs include the same request ID.',
  },
};

const step2: GuidedStep = {
  id: 'transform-gateway-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'Gateway must enrich requests with authentication and tracing headers',
    taskDescription: 'Add backend service and configure gateway to inject headers',
    componentsNeeded: [
      { type: 'client', reason: 'Already added', displayName: 'Client' },
      { type: 'api_gateway', reason: 'Transform Gateway', displayName: 'Transform Gateway' },
      { type: 'app_server', reason: 'Backend service', displayName: 'Backend Service' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Transform Gateway', reason: 'Client requests' },
      { from: 'Transform Gateway', to: 'Backend Service', reason: 'Enriched requests' },
    ],
    successCriteria: [
      'Add Backend Service',
      'Connect Gateway → Backend',
      'Configure header injection (X-API-Key, X-Request-ID)',
    ],
  },
  validation: {
    requiredComponents: ['client', 'api_gateway', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Add Backend Service and connect Gateway to it with header enrichment',
    level2: 'Add App Server, connect Gateway → Backend, configure gateway to add X-API-Key and X-Request-ID headers',
    solutionComponents: [{ type: 'client' }, { type: 'api_gateway' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'api_gateway' },
      { from: 'api_gateway', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 3: Implement Body Transformation (JSON to XML)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🔄',
  scenario: "Headers are working, but the backend is still rejecting requests!",
  hook: "Your legacy SOAP service expects XML, but mobile clients send JSON. The service responds: 'Invalid XML'. We need to transform the request BODY!",
  challenge: "Implement JSON to XML transformation for request bodies.",
  illustration: 'data-transformation',
};

const step3Celebration: CelebrationContent = {
  emoji: '✨',
  message: "Body transformation is working!",
  achievement: "Gateway now transforms JSON requests to XML for legacy backends",
  metrics: [
    { label: 'Format', before: 'JSON only', after: 'JSON ↔ XML' },
    { label: 'Backend errors', before: 'Invalid format', after: '0' },
    { label: 'Legacy compatibility', after: '✓' },
  ],
  nextTeaser: "Excellent! But what about more complex transformations like REST to gRPC?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Request Body Transformation',
  conceptExplanation: `**Body transformation** converts request/response payloads between formats.

**Common transformations:**

**1. JSON to XML**
\`\`\`json
Input (JSON):
{
  "user": {
    "name": "Alice",
    "email": "alice@example.com"
  }
}

Output (XML):
<?xml version="1.0"?>
<user>
  <name>Alice</name>
  <email>alice@example.com</email>
</user>
\`\`\`

**2. XML to JSON** (reverse)

**3. Field mapping/renaming**
\`\`\`json
Input (v1 API):
{ "fullName": "Alice Smith" }

Output (v2 API):
{ "firstName": "Alice", "lastName": "Smith" }
\`\`\`

**4. Nested restructuring**
\`\`\`json
Input (flat):
{ "user_name": "Alice", "user_email": "alice@example.com" }

Output (nested):
{ "user": { "name": "Alice", "email": "alice@example.com" } }
\`\`\`

**Implementation approaches:**
- **Declarative mapping**: JSON/YAML config files
- **Template-based**: Handlebars, Jinja2 templates
- **Scripting**: Lua, JavaScript for complex logic`,
  whyItMatters: 'Body transformation enables gradual migration from old to new formats. Old clients keep working while you modernize backends, or vice versa.',
  realWorldExample: {
    company: 'PayPal',
    scenario: 'PayPal migrated from SOAP/XML to REST/JSON over several years',
    howTheyDoIt: 'API Gateway transformed between formats during migration. Old SOAP clients → Gateway transformed to REST → New JSON backend. Seamless transition.',
  },
  famousIncident: {
    title: 'Twitter API v1.1 Migration',
    company: 'Twitter',
    year: '2012',
    whatHappened: 'Twitter forced migration from XML API to JSON API with only 6 months notice. Thousands of apps broke because they didn\'t transform responses.',
    lessonLearned: 'Use transformation gateway to support both formats during migration. Give developers YEARS to migrate, not months.',
    icon: '🐦',
  },
  keyPoints: [
    'Body transformation converts payload formats (JSON, XML, Protobuf)',
    'Enables legacy systems to work with modern APIs',
    'Supports API versioning and migration',
    'Can be declarative (config) or scripting (complex logic)',
    'Must transform BOTH request and response',
  ],
  diagram: `
Client Request (JSON):
┌──────────────────────────┐
│ POST /api/createUser     │
│ Content-Type: app/json   │
│ {                        │
│   "name": "Alice",       │
│   "email": "alice@..."   │
│ }                        │
└──────────┬───────────────┘
           │
           ▼
    ┌──────────────┐
    │   Gateway    │
    │ JSON → XML   │
    └──────┬───────┘
           │
           ▼
Backend Request (XML):
┌──────────────────────────┐
│ POST /legacy/createUser  │
│ Content-Type: app/xml    │
│ <user>                   │
│   <name>Alice</name>     │
│   <email>alice@...</..>  │
│ </user>                  │
└──────────────────────────┘
`,
  keyConcepts: [
    { title: 'JSON ↔ XML', explanation: 'Convert between JSON and XML formats', icon: '🔄' },
    { title: 'Field Mapping', explanation: 'Rename or restructure fields during transformation', icon: '🗺️' },
    { title: 'Schema Evolution', explanation: 'Transform between API versions (v1 ↔ v2)', icon: '📈' },
  ],
  quickCheck: {
    question: 'Why transform request AND response bodies, not just request?',
    options: [
      'To improve performance',
      'Client expects response in same format it sent (JSON client gets JSON back)',
      'For security',
      'To reduce bandwidth',
    ],
    correctIndex: 1,
    explanation: 'Bidirectional transformation ensures client gets response in expected format. If client sends JSON, it expects JSON back - even if backend returned XML.',
  },
};

const step3: GuidedStep = {
  id: 'transform-gateway-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Gateway must transform request bodies between JSON and XML',
    taskDescription: 'Implement body transformation logic in the gateway',
    componentsNeeded: [
      { type: 'client', reason: 'Sends JSON', displayName: 'Client' },
      { type: 'api_gateway', reason: 'Transforms JSON to XML', displayName: 'Transform Gateway' },
      { type: 'app_server', reason: 'Expects XML', displayName: 'Backend Service' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Transform Gateway', reason: 'JSON requests' },
      { from: 'Transform Gateway', to: 'Backend Service', reason: 'XML requests' },
    ],
    successCriteria: [
      'Configure transformation rules in gateway',
      'Transform JSON request body to XML',
      'Transform XML response body back to JSON',
    ],
  },
  validation: {
    requiredComponents: ['client', 'api_gateway', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Configure the gateway to transform JSON to XML and back',
    level2: 'Click gateway, configure transformation rules for JSON → XML (request) and XML → JSON (response)',
    solutionComponents: [{ type: 'client' }, { type: 'api_gateway' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'api_gateway' },
      { from: 'api_gateway', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 4: Implement Protocol Translation (REST to gRPC)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🌉',
  scenario: "Your team is migrating from REST to gRPC for better performance!",
  hook: "Old mobile apps still use REST, but new backend services are gRPC-only. We need the gateway to translate between protocols!",
  challenge: "Implement REST to gRPC protocol translation.",
  illustration: 'protocol-bridge',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Protocol translation is working!",
  achievement: "Gateway can now bridge REST and gRPC protocols",
  metrics: [
    { label: 'Protocols', before: 'REST only', after: 'REST ↔ gRPC' },
    { label: 'Backend migration', after: 'In progress' },
    { label: 'Client compatibility', before: 'Breaking', after: '✓ Maintained' },
  ],
  nextTeaser: "Perfect! But we need to validate requests before transformation...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Protocol Translation: REST to gRPC',
  conceptExplanation: `**Protocol translation** bridges different communication protocols.

**REST vs gRPC differences:**

**REST (HTTP/1.1 + JSON):**
- Text-based (JSON)
- HTTP verbs: GET, POST, PUT, DELETE
- URL-based routing: /api/users/123
- Stateless request/response

**gRPC (HTTP/2 + Protobuf):**
- Binary format (Protobuf)
- RPC calls: GetUser(id)
- Service definitions (.proto files)
- Supports streaming

**Translation steps:**

**REST → gRPC:**
1. Parse REST request (URL path, query params, JSON body)
2. Map to Protobuf message format
3. Make gRPC call over HTTP/2
4. Receive Protobuf response
5. Convert Protobuf → JSON
6. Return REST response

**Example:**
\`\`\`
REST Request:
GET /api/users/123?fields=name,email

Translate to gRPC:
GetUser(UserRequest{
  user_id: "123",
  field_mask: ["name", "email"]
})

gRPC Response (Protobuf):
UserResponse{ name: "Alice", email: "alice@..." }

Translate to REST:
200 OK
{ "name": "Alice", "email": "alice@example.com" }
\`\`\`

**Why this is hard:**
- REST is resource-based, gRPC is RPC-based
- Different error handling (HTTP status vs gRPC codes)
- Streaming support in gRPC, not REST
- Protobuf requires schema (.proto files)`,
  whyItMatters: 'Protocol translation enables gradual migration between architectures. Keep old clients working while modernizing backends with gRPC.',
  realWorldExample: {
    company: 'Google Cloud',
    scenario: 'Google Cloud APIs support both REST and gRPC',
    howTheyDoIt: 'API Gateway (Envoy) translates REST calls to gRPC. Clients can use REST even though backends are all gRPC. Best of both worlds.',
  },
  keyPoints: [
    'Protocol translation bridges REST, gRPC, GraphQL',
    'REST is text-based, gRPC is binary (faster)',
    'Translation requires schema mapping (REST paths ↔ gRPC methods)',
    'Error codes must be translated (HTTP status ↔ gRPC codes)',
    'Enables gradual migration between protocols',
  ],
  diagram: `
┌─────────────────────────────────────────┐
│         Protocol Translation            │
├─────────────────────────────────────────┤
│                                         │
│  REST Client                            │
│  GET /api/users/123                     │
│         │                               │
│         ▼                               │
│  ┌──────────────┐                       │
│  │   Gateway    │                       │
│  │ REST → gRPC  │                       │
│  └──────┬───────┘                       │
│         │                               │
│         ▼                               │
│  gRPC Backend                           │
│  GetUser(id: "123")                     │
│         │                               │
│         ▼                               │
│  UserResponse (Protobuf)                │
│         │                               │
│         ▼                               │
│  ┌──────────────┐                       │
│  │   Gateway    │                       │
│  │ gRPC → REST  │                       │
│  └──────┬───────┘                       │
│         │                               │
│         ▼                               │
│  200 OK                                 │
│  { "name": "Alice", "email": "..." }    │
└─────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'REST', explanation: 'HTTP/1.1 + JSON, resource-based', icon: '📄' },
    { title: 'gRPC', explanation: 'HTTP/2 + Protobuf, RPC-based', icon: '⚡' },
    { title: 'Protobuf', explanation: 'Binary serialization format (smaller, faster than JSON)', icon: '🔢' },
  ],
  quickCheck: {
    question: 'Why is gRPC faster than REST?',
    options: [
      'gRPC uses better algorithms',
      'gRPC uses binary Protobuf (smaller) and HTTP/2 (multiplexing)',
      'gRPC has fewer features',
      'gRPC servers are faster',
    ],
    correctIndex: 1,
    explanation: 'gRPC uses binary Protobuf (10x smaller than JSON) and HTTP/2 (multiplexing, header compression). This makes it much faster than REST/JSON.',
  },
};

const step4: GuidedStep = {
  id: 'transform-gateway-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Gateway must translate between REST and gRPC protocols',
    taskDescription: 'Add gRPC backend service and configure protocol translation',
    componentsNeeded: [
      { type: 'client', reason: 'REST client', displayName: 'Client' },
      { type: 'api_gateway', reason: 'Protocol translator', displayName: 'Transform Gateway' },
      { type: 'app_server', reason: 'gRPC backend', displayName: 'gRPC Service' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Transform Gateway', reason: 'REST requests' },
      { from: 'Transform Gateway', to: 'gRPC Service', reason: 'gRPC calls' },
    ],
    successCriteria: [
      'Add gRPC backend service',
      'Configure REST → gRPC translation',
      'Map REST endpoints to gRPC methods',
    ],
  },
  validation: {
    requiredComponents: ['client', 'api_gateway', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Configure gateway to translate REST calls to gRPC',
    level2: 'Add gRPC service, configure gateway to map REST paths to gRPC methods (GET /users/:id → GetUser RPC)',
    solutionComponents: [{ type: 'client' }, { type: 'api_gateway' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'api_gateway' },
      { from: 'api_gateway', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Schema Validation
// =============================================================================

const step5Story: StoryContent = {
  emoji: '✅',
  scenario: "Bad requests are overwhelming your backend services!",
  hook: "Clients are sending malformed JSON, missing required fields, and invalid data types. The backend is crashing trying to process garbage! We need schema validation at the gateway.",
  challenge: "Implement schema validation to reject invalid requests before transformation.",
  illustration: 'validation',
};

const step5Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "Schema validation is protecting your backends!",
  achievement: "Gateway validates all requests before transformation",
  metrics: [
    { label: 'Invalid requests', before: 'Reach backend', after: 'Blocked at gateway' },
    { label: 'Backend errors', before: '30%', after: '5%' },
    { label: 'Validation time', after: '< 2ms' },
  ],
  nextTeaser: "Great! But what about versioning? How do we support multiple API versions?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Schema Validation and Early Rejection',
  conceptExplanation: `**Schema validation** ensures requests match expected format BEFORE transformation.

**Why validate at the gateway?**
1. **Fail fast**: Return errors immediately
2. **Reduce backend load**: Don't forward garbage
3. **Better error messages**: Tell clients exactly what's wrong
4. **Security**: Prevent injection attacks

**Validation types:**

**1. JSON Schema validation**
\`\`\`json
Schema:
{
  "type": "object",
  "required": ["name", "email"],
  "properties": {
    "name": { "type": "string", "minLength": 1 },
    "email": { "type": "string", "format": "email" }
  }
}

Valid:
{ "name": "Alice", "email": "alice@example.com" }

Invalid:
{ "name": "", "email": "not-an-email" }
→ 400 Bad Request: "name must be non-empty, email must be valid"
\`\`\`

**2. XML Schema (XSD) validation**
\`\`\`xml
<xs:schema>
  <xs:element name="user">
    <xs:complexType>
      <xs:element name="name" type="xs:string"/>
      <xs:element name="email" type="xs:string"/>
    </xs:complexType>
  </xs:element>
</xs:schema>
\`\`\`

**3. Protobuf validation** (built into .proto files)

**Validation flow:**
1. Request arrives at gateway
2. Parse request body
3. Validate against schema
4. If invalid: return 400 Bad Request with error details
5. If valid: proceed with transformation`,
  whyItMatters: 'Schema validation is your first line of defense. Invalid requests consume resources (parsing, transformation, database queries). Better to reject them immediately.',
  realWorldExample: {
    company: 'AWS API Gateway',
    scenario: 'AWS API Gateway validates all requests against OpenAPI schemas',
    howTheyDoIt: 'Request validation is configured per endpoint. Invalid requests return 400 immediately without invoking Lambda. Saves compute and improves security.',
  },
  famousIncident: {
    title: 'Cloudflare Outage: Regex Validation',
    company: 'Cloudflare',
    year: '2019',
    whatHappened: 'A bad regex in request validation caused CPU to spike to 100%. Validation took 20+ seconds per request. Entire Cloudflare network went down for 30 minutes.',
    lessonLearned: 'Use fast schema validators (JSON Schema, Protobuf). Avoid regex for complex validation. Always set timeouts on validation.',
    icon: '🔥',
  },
  keyPoints: [
    'Schema validation happens BEFORE transformation',
    'Fail fast with clear error messages',
    'Prevents invalid data from reaching backends',
    'Use standard validators: JSON Schema, XSD, Protobuf',
    'Set validation timeouts to prevent DoS',
  ],
  diagram: `
Request arrives:
POST /api/users
{ "name": "", "email": "invalid" }
        │
        ▼
┌───────────────────┐
│  Schema Validator │
│  JSON Schema      │
└────────┬──────────┘
         │ INVALID!
         ▼
400 Bad Request
{
  "error": "Validation failed",
  "details": [
    "name: must be non-empty",
    "email: must be valid email"
  ]
}

VS.

Request arrives:
POST /api/users
{ "name": "Alice", "email": "alice@example.com" }
        │
        ▼
┌───────────────────┐
│  Schema Validator │
│  ✓ VALID          │
└────────┬──────────┘
         │
         ▼
   Transform & Forward
`,
  keyConcepts: [
    { title: 'JSON Schema', explanation: 'Declarative schema for JSON validation', icon: '📋' },
    { title: 'Fail Fast', explanation: 'Reject invalid requests immediately', icon: '⚡' },
    { title: 'Error Details', explanation: 'Tell clients exactly what failed validation', icon: '📝' },
  ],
  quickCheck: {
    question: 'Why validate at the gateway instead of the backend service?',
    options: [
      'Validation is faster at the gateway',
      'Fail fast - reject bad requests before transformation and backend processing',
      'Backend services can\'t validate',
      'Gateway has better error messages',
    ],
    correctIndex: 1,
    explanation: 'Validating at the gateway lets you fail fast - reject bad requests immediately without wasting resources on transformation, backend processing, or database queries.',
  },
};

const step5: GuidedStep = {
  id: 'transform-gateway-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'Gateway must validate request schemas before transformation',
    taskDescription: 'Configure schema validation rules in the gateway',
    componentsNeeded: [
      { type: 'client', reason: 'Sends requests', displayName: 'Client' },
      { type: 'api_gateway', reason: 'Validates schemas', displayName: 'Transform Gateway' },
      { type: 'app_server', reason: 'Backend service', displayName: 'Backend Service' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Transform Gateway', reason: 'Requests' },
      { from: 'Transform Gateway', to: 'Backend Service', reason: 'Validated requests only' },
    ],
    successCriteria: [
      'Configure JSON Schema validation',
      'Set required fields and types',
      'Return 400 Bad Request for invalid schemas',
    ],
  },
  validation: {
    requiredComponents: ['client', 'api_gateway', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Configure schema validation on the gateway',
    level2: 'Click gateway, add JSON Schema validation rules for request body (required fields, types, formats)',
    solutionComponents: [{ type: 'client' }, { type: 'api_gateway' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'api_gateway' },
      { from: 'api_gateway', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Implement API Version Translation
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔢',
  scenario: "Your API just released v2 with breaking changes, but millions of users are still on v1!",
  hook: "v2 renamed 'fullName' to 'firstName' + 'lastName'. Old v1 clients are sending 'fullName' and getting errors. We need version translation!",
  challenge: "Implement version translation to automatically convert between v1 and v2 API formats.",
  illustration: 'version-migration',
};

const step6Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "Version translation is working!",
  achievement: "Gateway supports both v1 and v2 clients seamlessly",
  metrics: [
    { label: 'API versions', after: 'v1 and v2' },
    { label: 'v1 client compatibility', before: 'Broken', after: '✓ Working' },
    { label: 'Breaking changes', after: 'Transparent' },
  ],
  nextTeaser: "Fantastic! Your Transform Gateway is production-ready!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'API Version Translation and Backward Compatibility',
  conceptExplanation: `**API versioning** evolves APIs without breaking old clients.

**Version translation strategies:**

**1. Additive changes (v1 → v2 adds fields)**
\`\`\`
v1: { "name": "Alice" }
v2: { "name": "Alice", "age": 30 }

Translation:
- v1 client → Gateway adds "age": null for v2 backend
- v2 response → Gateway strips "age" for v1 client
\`\`\`

**2. Breaking changes (v1 → v2 renames fields)**
\`\`\`
v1: { "fullName": "Alice Smith" }
v2: { "firstName": "Alice", "lastName": "Smith" }

Translation:
- v1 client sends "fullName" → Gateway splits to "firstName"/"lastName"
- v2 response has "firstName"/"lastName" → Gateway combines to "fullName"
\`\`\`

**3. Structural changes**
\`\`\`
v1: { "userId": 123, "userName": "Alice" }
v2: { "user": { "id": 123, "name": "Alice" } }

Translation:
- v1 flat structure → Gateway nests into v2 structure
- v2 nested → Gateway flattens for v1 client
\`\`\`

**Version detection:**
1. **Header**: \`X-API-Version: v1\` or \`Accept: application/vnd.api.v2+json\`
2. **URL path**: \`/api/v1/users\` vs \`/api/v2/users\`
3. **Query param**: \`/api/users?version=v1\`

**Best practices:**
- Default to latest version (v2)
- Support old versions for 2+ years
- Deprecation warnings: \`X-API-Deprecated: v1 will sunset 2025-12-31\`
- Log version usage to plan sunsetting`,
  whyItMatters: 'Version translation extends API lifespan. Instead of forcing all clients to upgrade immediately, gateway handles translation automatically. Gradual migration.',
  realWorldExample: {
    company: 'Stripe',
    scenario: 'Stripe supports 10+ API versions simultaneously',
    howTheyDoIt: 'Version specified in header: Stripe-Version: 2023-10-16. Gateway translates between versions automatically. Old versions supported indefinitely.',
  },
  famousIncident: {
    title: 'Twitter API v1.1 Forced Migration',
    company: 'Twitter',
    year: '2013',
    whatHappened: 'Twitter shut down v1.0 API with only 6 months notice. Thousands of apps broke overnight. No version translation - hard cutover.',
    lessonLearned: 'Support multiple versions simultaneously with gateway translation. Give developers YEARS to migrate, not months. Never do hard cutovers.',
    icon: '🐦',
  },
  keyPoints: [
    'Version translation lets old clients work with new backends',
    'Gateway handles additive, breaking, and structural changes',
    'Version detected via header, URL path, or query param',
    'Support old versions for years, not months',
    'Add deprecation warnings to encourage migration',
  ],
  diagram: `
v1 Client Request:
POST /api/v1/users
{ "fullName": "Alice Smith" }
        │
        ▼
┌─────────────────────────┐
│   Transform Gateway     │
│   v1 → v2 translation   │
│                         │
│ "fullName": "Alice..."  │
│   ↓ split               │
│ "firstName": "Alice"    │
│ "lastName": "Smith"     │
└────────┬────────────────┘
         │
         ▼
v2 Backend Request:
POST /internal/users
{ "firstName": "Alice", "lastName": "Smith" }
         │
         ▼
v2 Response:
{ "firstName": "Alice", "lastName": "Smith", "id": 123 }
         │
         ▼
┌─────────────────────────┐
│   Transform Gateway     │
│   v2 → v1 translation   │
│                         │
│ "firstName" + "lastName"│
│   ↓ combine             │
│ "fullName": "Alice..."  │
└────────┬────────────────┘
         │
         ▼
v1 Client Response:
{ "fullName": "Alice Smith", "id": 123 }
`,
  keyConcepts: [
    { title: 'Version Translation', explanation: 'Convert between API versions automatically', icon: '🔢' },
    { title: 'Backward Compatibility', explanation: 'Old clients keep working with new backends', icon: '⏮️' },
    { title: 'Deprecation', explanation: 'Warn clients about upcoming version sunset', icon: '⚠️' },
  ],
  quickCheck: {
    question: 'How should you handle a breaking API change (v1 → v2 renames fields)?',
    options: [
      'Force all clients to upgrade immediately',
      'Support both versions for years with gateway translation',
      'Keep v1 endpoints forever',
      'Return errors for v1 clients',
    ],
    correctIndex: 1,
    explanation: 'Use gateway translation to support both v1 and v2 simultaneously for years. This gives clients time to migrate gradually without breaking existing integrations.',
  },
};

const step6: GuidedStep = {
  id: 'transform-gateway-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'Gateway must translate between API versions (v1 ↔ v2)',
    taskDescription: 'Configure version translation rules in the gateway',
    componentsNeeded: [
      { type: 'client', reason: 'v1 and v2 clients', displayName: 'Client' },
      { type: 'api_gateway', reason: 'Version translator', displayName: 'Transform Gateway' },
      { type: 'app_server', reason: 'v2 backend', displayName: 'Backend Service (v2)' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Transform Gateway', reason: 'Versioned requests' },
      { from: 'Transform Gateway', to: 'Backend Service (v2)', reason: 'Translated to v2' },
    ],
    successCriteria: [
      'Configure v1 → v2 translation (fullName → firstName/lastName)',
      'Configure v2 → v1 translation (firstName/lastName → fullName)',
      'Support version detection via header or URL path',
    ],
  },
  validation: {
    requiredComponents: ['client', 'api_gateway', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Configure version translation mappings in the gateway',
    level2: 'Click gateway, add v1→v2 translation rules (fullName field split), and v2→v1 reverse translation',
    solutionComponents: [{ type: 'client' }, { type: 'api_gateway' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'api_gateway' },
      { from: 'api_gateway', to: 'app_server' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const requestTransformGatewayGuidedTutorial: GuidedTutorial = {
  problemId: 'request-transform-gateway-guided',
  problemTitle: 'Build a Request Transform Gateway - Format Translation & Protocol Bridge',

  // Requirements gathering phase (Step 0)
  requirementsPhase: requestTransformRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],

  // Final exam test cases
  finalExamTestCases: [
    {
      name: 'Header Enrichment',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Gateway adds authentication and tracing headers',
      traffic: { type: 'mixed', rps: 100, readRps: 50, writeRps: 50 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Body Transformation',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Gateway transforms JSON to XML and back',
      traffic: { type: 'mixed', rps: 200, readRps: 100, writeRps: 100 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Protocol Translation',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Gateway translates REST to gRPC',
      traffic: { type: 'mixed', rps: 500, readRps: 400, writeRps: 100 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-P1: Low Latency Transformation',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Gateway adds < 10ms p99 latency overhead',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 60,
      passCriteria: { maxP99Latency: 10, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: High Throughput',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle 5K RPS with transformations',
      traffic: { type: 'mixed', rps: 5000, readRps: 4000, writeRps: 1000 },
      duration: 60,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-R1: Schema Validation',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Gateway rejects invalid requests with 400 Bad Request',
      traffic: { type: 'mixed', rps: 1000, readRps: 800, writeRps: 200 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-C1: Version Compatibility',
      type: 'compatibility',
      requirement: 'NFR-C1',
      description: 'Gateway translates between v1 and v2 API versions',
      traffic: { type: 'mixed', rps: 2000, readRps: 1600, writeRps: 400 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.01 },
    },
  ] as TestCase[],
};

export function getRequestTransformGatewayGuidedTutorial(): GuidedTutorial {
  return requestTransformGatewayGuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = requestTransformRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= requestTransformRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
