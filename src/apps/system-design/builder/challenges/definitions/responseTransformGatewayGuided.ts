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
 * Response Transform Gateway Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching response transformation patterns for API gateways.
 * Focuses on filtering, masking, format conversion, and enrichment.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic response transformation (FR satisfaction)
 * Steps 4-6: Add format conversion, field filtering, response enrichment
 *
 * Key Concepts (API Gateway Patterns):
 * - Response filtering and field masking
 * - Format conversion (JSON to XML, protocol buffers)
 * - Response enrichment and aggregation
 * - Schema transformation and versioning
 * - Content negotiation
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const responseTransformGatewayRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an API Gateway that transforms backend responses for different client needs",

  interviewer: {
    name: 'Sam Chen',
    role: 'Principal API Architect',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-transformation',
      category: 'functional',
      question: "Why do we need to transform responses? Can't clients just use the backend format?",
      answer: "Different clients have different needs:\n\n1. **Mobile apps** need minimal data (bandwidth constraints)\n2. **Web apps** might need different field names (UI requirements)\n3. **Legacy systems** expect XML instead of JSON\n4. **External partners** need filtered data (privacy/security)\n\nThe gateway transforms one backend format into multiple client formats:\n- Field filtering (remove sensitive data)\n- Format conversion (JSON ↔ XML)\n- Field renaming (snake_case ↔ camelCase)\n- Response enrichment (add computed fields)",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Response transformation decouples backend data models from client needs",
    },
    {
      id: 'field-filtering',
      category: 'functional',
      question: "What's the difference between field filtering and field masking?",
      answer: "**Field Filtering** removes entire fields:\n\`\`\`json\n// Backend response\n{\"user\": {\"id\": 123, \"email\": \"user@example.com\", \"password_hash\": \"...\"}}\n\n// Filtered for external API\n{\"user\": {\"id\": 123}}\n```\n\n**Field Masking** partially hides sensitive data:\n\`\`\`json\n// Backend response\n{\"creditCard\": \"4532-1234-5678-9010\"}\n\n// Masked response\n{\"creditCard\": \"****-****-****-9010\"}\n```\n\nFiltering = security (remove secrets)\nMasking = privacy (show partial data)",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Filtering removes fields entirely; masking shows partial values",
    },
    {
      id: 'format-conversion',
      category: 'functional',
      question: "Which response formats should we support?",
      answer: "Support the most common formats:\n\n1. **JSON** (default, modern APIs)\n2. **XML** (legacy systems, SOAP clients)\n3. **CSV** (analytics, Excel exports)\n4. **Protocol Buffers** (high-performance internal services)\n\nUse **content negotiation** (Accept header):\n- `Accept: application/json` → JSON\n- `Accept: application/xml` → XML\n- `Accept: text/csv` → CSV",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Content negotiation lets one endpoint serve multiple formats",
    },
    {
      id: 'response-enrichment',
      category: 'functional',
      question: "What is response enrichment and why is it useful?",
      answer: "**Response Enrichment** adds computed or aggregated data:\n\n**Example 1: Add computed fields**\n\`\`\`json\n// Backend: {\"price\": 100, \"tax_rate\": 0.08}\n// Enriched: {\"price\": 100, \"tax_rate\": 0.08, \"total\": 108}\n```\n\n**Example 2: Aggregate from multiple services**\n\`\`\`json\n// Product Service: {\"id\": 123, \"title\": \"Laptop\"}\n// Inventory Service: {\"stock\": 5}\n// Enriched: {\"id\": 123, \"title\": \"Laptop\", \"stock\": 5}\n```\n\nBenefits:\n- Reduce client-side computation\n- Fewer API calls (1 instead of 2)\n- Consistent business logic",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Enrichment reduces client complexity by moving logic to the gateway",
    },
    {
      id: 'schema-versioning',
      category: 'functional',
      question: "How do we handle API versioning with response transformation?",
      answer: "Support multiple API versions simultaneously:\n\n**v1 response** (legacy):\n\`\`\`json\n{\"user_name\": \"John\", \"user_email\": \"john@example.com\"}\n```\n\n**v2 response** (modern):\n\`\`\`json\n{\"name\": \"John\", \"email\": \"john@example.com\"}\n```\n\nGateway transforms based on:\n- URL path: `/v1/users` vs `/v2/users`\n- Header: `API-Version: 1` vs `API-Version: 2`\n\nBackend has one format, gateway maintains transformation rules for each version.",
      importance: 'important',
      insight: "Response transformation enables backward compatibility without backend changes",
    },

    // SCALE & NFRs
    {
      id: 'throughput-transforms',
      category: 'throughput',
      question: "How many requests per second will need transformation?",
      answer: "50,000 requests per second at peak. Every response flows through the transformation layer.",
      importance: 'critical',
      learningPoint: "High throughput means transformations must be extremely fast",
    },
    {
      id: 'transformation-latency',
      category: 'latency',
      question: "How much latency can transformation add?",
      answer: "Transformation must add < 5ms to p99 latency. Users won't tolerate slow API responses.\n\n**Latency breakdown:**\n- Backend processing: 50ms\n- Gateway routing: 2ms\n- Transformation: < 5ms (our budget)\n- Network: 10ms\n- **Total: ~67ms**\n\nIf transformation takes 50ms, total latency becomes 117ms (unacceptable!)",
      importance: 'critical',
      calculation: {
        formula: "Total latency = Backend + Routing + Transform + Network",
        result: "Transform must be < 5ms to meet p99 < 100ms SLA",
      },
      learningPoint: "Response transformation is on the critical path - must be fast",
    },
    {
      id: 'payload-size',
      category: 'payload',
      question: "How large are typical responses?",
      answer: "Varies widely:\n- Small: 1KB (single user profile)\n- Medium: 10-50KB (product listing)\n- Large: 1MB+ (analytics report)\n\nFiltering can reduce size by 50-90% for mobile clients (save bandwidth!).",
      importance: 'important',
      learningPoint: "Field filtering is critical for mobile apps on limited bandwidth",
    },
    {
      id: 'caching-transforms',
      category: 'latency',
      question: "Can we cache transformed responses?",
      answer: "Yes, but carefully:\n\n**Cache key must include:**\n- Original URL\n- Accept header (format)\n- API version\n- Filter rules\n\nExample:\n- `/users/123` + `Accept: application/json` + `v2` + `fields=id,name`\n- Cache hit: return cached transformed response\n- Cache miss: fetch from backend, transform, cache result\n\nProblem: Too many variations = low cache hit rate!",
      importance: 'critical',
      insight: "Response transformation creates many cache key variations",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-transformation', 'field-filtering', 'format-conversion'],
  criticalFRQuestionIds: ['core-transformation', 'field-filtering', 'format-conversion'],
  criticalScaleQuestionIds: ['throughput-transforms', 'transformation-latency', 'caching-transforms'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Response transformation',
      description: 'Transform backend responses to match client needs',
      emoji: '🔄',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Field filtering and masking',
      description: 'Remove or mask sensitive fields based on client type',
      emoji: '🔒',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Format conversion',
      description: 'Convert between JSON, XML, CSV based on Accept header',
      emoji: '📄',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Response enrichment',
      description: 'Add computed fields and aggregate data from multiple sources',
      emoji: '✨',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: 'N/A - Gateway handles 50K RPS',
    writesPerDay: 'N/A',
    readsPerDay: 'N/A',
    peakMultiplier: 3,
    readWriteRatio: 'N/A',
    calculatedWriteRPS: { average: 0, peak: 0 },
    calculatedReadRPS: { average: 16667, peak: 50000 },
    maxPayloadSize: '1MB (analytics reports)',
    storagePerRecord: 'N/A (stateless transformation)',
    storageGrowthPerYear: 'N/A',
    redirectLatencySLA: 'p99 < 5ms (transformation only)',
    createLatencySLA: 'N/A',
  },

  architecturalImplications: [
    '✅ Transformation must be < 5ms → Use compiled transformations, not runtime parsing',
    '✅ 50K RPS → Stateless transformation, horizontal scaling',
    '✅ Multiple formats → Content negotiation with Accept header',
    '✅ Field filtering → Define filter schemas per client type',
    '✅ Response enrichment → May need to call multiple backends',
    '✅ Caching → Complex cache keys, consider cache hit rate impact',
  ],

  outOfScope: [
    'Request transformation (separate concern)',
    'Authentication/Authorization',
    'Rate limiting',
    'API versioning strategy (assume URLs handle it)',
    'Schema validation',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple gateway that transforms JSON responses by filtering fields. Then we'll add format conversion and enrichment. Function first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Transform Gateway
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to APIHub Inc! You're building a Response Transform Gateway.",
  hook: "Different clients need different data formats. Mobile apps want minimal JSON, legacy systems need XML, partners need filtered data. One backend, many client needs!",
  challenge: "Build the foundation: Client sends requests through the Gateway to reach the backend.",
  illustration: 'gateway-foundation',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your transform gateway is online!',
  achievement: 'Clients can now send requests through the gateway',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Request flow', after: 'Client → Gateway → Backend' },
  ],
  nextTeaser: "But responses are just passing through unchanged...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Response Transform Gateway Pattern',
  conceptExplanation: `A **Response Transform Gateway** modifies backend responses to match client needs.

**Why transform responses?**
1. **Different clients, different needs** - Mobile wants small payloads, web wants full data
2. **Security** - Filter sensitive fields before sending to external partners
3. **Legacy compatibility** - Convert JSON to XML for old systems
4. **Bandwidth optimization** - Remove unused fields to save mobile data

Basic flow:
\`\`\`
Client → Gateway → Backend
         ↓
    Transform Response
         ↓
Client ← Gateway
\`\`\``,

  whyItMatters: 'Without transformation, you need separate backend endpoints for each client type. The gateway lets one backend serve all clients.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Serving 1000+ device types with different capabilities',
    howTheyDoIt: 'Gateway transforms responses based on device profile: 4K TVs get high-res metadata, feature phones get minimal JSON',
  },

  keyPoints: [
    'Gateway transforms responses to match client needs',
    'One backend format → many client formats',
    'Reduces backend complexity and duplication',
    'Essential for mobile optimization and legacy support',
  ],

  keyConcepts: [
    { title: 'Transform Gateway', explanation: 'Modifies responses before sending to clients', icon: '🔄' },
    { title: 'Backend', explanation: 'Source of data in canonical format', icon: '🖥️' },
    { title: 'Client', explanation: 'Receives transformed response', icon: '📱' },
  ],
};

const step1: GuidedStep = {
  id: 'response-transform-gateway-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Gateway routes requests and returns responses',
    taskDescription: 'Add Client, Gateway (App Server), and Backend (Database), then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents API consumers', displayName: 'Client' },
      { type: 'app_server', reason: 'Acts as the Transform Gateway', displayName: 'Gateway' },
      { type: 'database', reason: 'Represents backend API', displayName: 'Backend API' },
    ],
    successCriteria: [
      'Client component added',
      'Gateway (App Server) component added',
      'Backend (Database) component added',
      'Client → Gateway → Backend connections created',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag Client, App Server (Gateway), and Database (Backend) onto the canvas',
    level2: 'Connect Client → App Server, then App Server → Database',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 2: Implement Field Filtering (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🔒',
  scenario: "Security alert! You're exposing sensitive data to external partners.",
  hook: "The backend returns user data with passwords, SSNs, and internal IDs. External partners shouldn't see this! We need field filtering.",
  challenge: "Implement field filtering in Python to remove sensitive fields before sending responses.",
  illustration: 'security-breach',
};

const step2Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Field filtering is protecting your data!',
  achievement: 'Sensitive fields are now removed from external responses',
  metrics: [
    { label: 'Fields filtered', after: 'password, ssn, internal_id' },
    { label: 'Security', before: 'Exposed', after: 'Protected' },
  ],
  nextTeaser: "Great! But mobile clients are still downloading too much data...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Field Filtering: Security and Privacy',
  conceptExplanation: `**Field Filtering** removes fields from responses based on rules.

**Example:**
\`\`\`python
# Backend response
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "password_hash": "$2b$12$...",
  "ssn": "123-45-6789",
  "internal_id": "emp_7890"
}

# Filter rules for external partners
allowed_fields = ["id", "name", "email"]

# Filtered response
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com"
}
\`\`\`

**Use cases:**
1. **Security** - Remove passwords, tokens, secrets
2. **Privacy** - Filter PII for external partners
3. **Bandwidth** - Remove large unused fields for mobile
4. **Business logic** - Hide internal fields`,

  whyItMatters: 'Without field filtering, you risk exposing sensitive data or forcing clients to download unnecessary data. Security and performance in one pattern.',

  famousIncident: {
    title: 'Facebook API Exposed Private Messages',
    company: 'Facebook',
    year: '2018',
    whatHappened: 'A bug in the Graph API exposed private messages and photos to third-party apps. Proper field filtering could have limited the exposure.',
    lessonLearned: 'Always filter responses by client permissions. Never trust client-side filtering.',
    icon: '📘',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Payment API with different access levels',
    howTheyDoIt: 'Public API returns filtered card data (last 4 digits only). Internal admin API returns full details. Same backend, different filters.',
  },

  keyPoints: [
    'Filter fields based on client type (internal vs external)',
    'Whitelist approach: only include allowed fields',
    'Blacklist approach: exclude sensitive fields',
    'Combine with field masking for partial data',
  ],

  quickCheck: {
    question: 'Which approach is more secure for field filtering?',
    options: [
      'Blacklist: exclude known sensitive fields',
      'Whitelist: only include allowed fields',
      'No filtering, rely on client-side filtering',
      'Filter on the client side',
    ],
    correctIndex: 1,
    explanation: 'Whitelist is safer - if you add new sensitive fields to the backend, they won\'t accidentally leak. Blacklist might miss new fields.',
  },

  keyConcepts: [
    { title: 'Field Filtering', explanation: 'Remove fields from response', icon: '🔒' },
    { title: 'Whitelist', explanation: 'Only include explicitly allowed fields', icon: '✅' },
    { title: 'Blacklist', explanation: 'Exclude explicitly forbidden fields', icon: '❌' },
  ],
};

const step2: GuidedStep = {
  id: 'response-transform-gateway-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-2: Gateway filters sensitive fields from responses',
    taskDescription: 'Configure gateway APIs and implement field filtering in Python',
    successCriteria: [
      'Click on Gateway (App Server)',
      'Assign GET /api/v1/users API',
      'Open Python tab',
      'Implement filter_response() function with whitelist',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click Gateway → APIs tab, assign GET /api/v1/users',
    level2: 'Switch to Python tab, implement filter_response() that only includes allowed_fields',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Field Masking for Partial Data
// =============================================================================

const step3Story: StoryContent = {
  emoji: '👁️',
  scenario: "Users need to see their credit card info, but not the full number!",
  hook: "For security, you should show credit cards as ****-****-****-1234. Same for SSNs, phone numbers, email addresses.",
  challenge: "Implement field masking to show partial sensitive data.",
  illustration: 'data-masking',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎭',
  message: 'Field masking is working!',
  achievement: 'Sensitive data is now partially hidden',
  metrics: [
    { label: 'Credit cards', before: '4532-1234-5678-9010', after: '****-****-****-9010' },
    { label: 'SSN', before: '123-45-6789', after: '***-**-6789' },
  ],
  nextTeaser: "Perfect! But some clients need XML instead of JSON...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Field Masking: Privacy with Usability',
  conceptExplanation: `**Field Masking** shows partial sensitive data instead of removing it entirely.

**Common masking patterns:**
\`\`\`python
# Credit card: show last 4 digits
"4532-1234-5678-9010" → "****-****-****-9010"

# Email: show domain
"john.doe@example.com" → "j***@example.com"

# SSN: show last 4
"123-45-6789" → "***-**-6789"

# Phone: show last 4
"(555) 123-4567" → "(***) ***-4567"
\`\`\`

**Why mask instead of filter?**
- Users need to identify which card/account
- UX requires showing partial data
- Compliance (PCI-DSS) allows masked data
- Balance security and usability`,

  whyItMatters: 'Masking lets users identify sensitive data without exposing the full value. Essential for payment systems, healthcare, and financial services.',

  realWorldExample: {
    company: 'PayPal',
    scenario: 'Showing user payment methods',
    howTheyDoIt: 'Displays "Visa ending in 1234" instead of full card number. Users can identify their card without security risk.',
  },

  keyPoints: [
    'Masking shows partial data, filtering removes it completely',
    'Common use: credit cards, SSNs, phone numbers',
    'Compliance-friendly (PCI-DSS allows masked card numbers)',
    'Improves UX while maintaining security',
  ],

  quickCheck: {
    question: 'When should you use masking vs filtering?',
    options: [
      'Always use masking for everything',
      'Masking when users need to identify data, filtering when they don\'t need it at all',
      'Always use filtering for security',
      'Use masking only for credit cards',
    ],
    correctIndex: 1,
    explanation: 'Masking shows partial data (e.g., "card ending in 1234"). Filtering removes data entirely. Use masking when users need to identify which record, filtering when they don\'t need that data at all.',
  },

  keyConcepts: [
    { title: 'Masking', explanation: 'Show partial sensitive data', icon: '👁️' },
    { title: 'Last 4', explanation: 'Common pattern: show last 4 digits', icon: '1234' },
    { title: 'PCI-DSS', explanation: 'Compliance standard allows masked cards', icon: '🔒' },
  ],
};

const step3: GuidedStep = {
  id: 'response-transform-gateway-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Gateway masks sensitive fields',
    taskDescription: 'Update Python code to add field masking for credit cards and SSNs',
    successCriteria: [
      'Open Python tab in Gateway',
      'Implement mask_field() function',
      'Mask credit cards: show last 4 digits',
      'Mask SSNs: show last 4 digits',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Add mask_field() function that replaces most characters with asterisks',
    level2: 'For credit cards: replace all but last 4 with ****. For SSNs: replace all but last 4 with ***-**-',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 4: Implement JSON to XML Conversion
// =============================================================================

const step4Story: StoryContent = {
  emoji: '📄',
  scenario: "A legacy partner system only speaks XML!",
  hook: "Your backend returns JSON, but the partner needs XML. They send `Accept: application/xml` header. Time to implement format conversion!",
  challenge: "Add format conversion to transform JSON responses to XML based on Accept header.",
  illustration: 'format-conversion',
};

const step4Celebration: CelebrationContent = {
  emoji: '🔄',
  message: 'Format conversion is working!',
  achievement: 'Gateway now supports JSON and XML responses',
  metrics: [
    { label: 'Formats supported', after: 'JSON, XML' },
    { label: 'Content negotiation', after: '✓ Enabled' },
  ],
  nextTeaser: "Excellent! But we can optimize response size further...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Format Conversion and Content Negotiation',
  conceptExplanation: `**Format Conversion** transforms responses between different serialization formats.

**Content Negotiation** uses the Accept header:
\`\`\`http
GET /api/users/123
Accept: application/json  → JSON response
Accept: application/xml   → XML response
Accept: text/csv          → CSV response
\`\`\`

**Example conversion:**
\`\`\`python
# Backend returns JSON
{"id": 123, "name": "John", "email": "john@example.com"}

# Client wants XML
<user>
  <id>123</id>
  <name>John</name>
  <email>john@example.com</email>
</user>
\`\`\`

**Common formats:**
- **JSON**: Modern APIs, web/mobile apps
- **XML**: Legacy systems, SOAP, government APIs
- **CSV**: Analytics, Excel exports
- **Protocol Buffers**: High-performance microservices`,

  whyItMatters: 'One backend format can serve all client types. Legacy systems get XML, modern apps get JSON, analytics get CSV - all from the same API.',

  realWorldExample: {
    company: 'AWS',
    scenario: 'S3 API supports multiple formats',
    howTheyDoIt: 'Same API endpoint returns JSON or XML based on Accept header. Serves modern SDKs (JSON) and legacy SOAP clients (XML).',
  },

  famousIncident: {
    title: 'SOAP to REST Migration at Twitter',
    company: 'Twitter',
    year: '2010',
    whatHappened: 'Twitter migrated from SOAP (XML) to REST (JSON). Used gateway to support both during transition. Took 2 years to migrate all clients.',
    lessonLearned: 'Format conversion at gateway enables gradual migration without breaking existing clients.',
    icon: '🐦',
  },

  keyPoints: [
    'Content negotiation uses Accept header to choose format',
    'Same backend endpoint → multiple response formats',
    'Enables legacy system support without backend changes',
    'Common formats: JSON, XML, CSV, Protocol Buffers',
  ],

  quickCheck: {
    question: 'How does content negotiation work?',
    options: [
      'Client puts format in URL: /api/users.json',
      'Client sends Accept header: Accept: application/xml',
      'Server always returns JSON',
      'Client must call different endpoints for different formats',
    ],
    correctIndex: 1,
    explanation: 'Content negotiation uses the Accept header. Client sends "Accept: application/xml" and gateway returns XML. One endpoint, multiple formats.',
  },

  keyConcepts: [
    { title: 'Content Negotiation', explanation: 'Choose format based on Accept header', icon: '🤝' },
    { title: 'JSON', explanation: 'Modern web/mobile format', icon: '📋' },
    { title: 'XML', explanation: 'Legacy system format', icon: '📄' },
  ],
};

const step4: GuidedStep = {
  id: 'response-transform-gateway-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Gateway converts JSON to XML based on Accept header',
    taskDescription: 'Implement format conversion in Python',
    successCriteria: [
      'Open Python tab in Gateway',
      'Check Accept header from request',
      'If Accept: application/xml, convert JSON to XML',
      'If Accept: application/json, return JSON',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Check request.headers["Accept"] to determine format',
    level2: 'Implement convert_to_xml() function that transforms JSON dict to XML string',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Add Selective Field Filtering
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🎯',
  scenario: "Mobile clients are still downloading too much data!",
  hook: "A product response has 50 fields, but the mobile app only needs 5 (id, title, price, image, stock). Let clients specify exactly which fields they want!",
  challenge: "Implement selective field filtering with a `fields` query parameter.",
  illustration: 'bandwidth-optimization',
};

const step5Celebration: CelebrationContent = {
  emoji: '📱',
  message: 'Selective field filtering is working!',
  achievement: 'Clients can now request exactly the fields they need',
  metrics: [
    { label: 'Response size', before: '50KB (50 fields)', after: '5KB (5 fields)' },
    { label: 'Bandwidth saved', after: '90%' },
  ],
  nextTeaser: "Great! But we can make responses even more useful...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Selective Field Filtering: Client-Driven Optimization',
  conceptExplanation: `**Selective Field Filtering** lets clients choose which fields to include.

**API design:**
\`\`\`http
GET /api/products/123?fields=id,title,price

Response:
{
  "id": 123,
  "title": "Laptop",
  "price": 999
}
\`\`\`

**Without fields parameter** (default):
\`\`\`json
{
  "id": 123,
  "title": "Laptop",
  "price": 999,
  "description": "...",  // Not needed by mobile
  "specifications": {...},  // 20KB of data!
  "reviews": [...],  // Another 30KB
  "related_products": [...]  // More unused data
}
\`\`\`

**Benefits:**
1. **Mobile apps**: Request only needed fields → save bandwidth
2. **Performance**: Smaller responses → faster parsing
3. **Flexibility**: Different views need different fields
4. **Cost**: Save cloud egress costs

**Similar to GraphQL's field selection!**`,

  whyItMatters: 'Mobile users on 3G/4G pay for data. Reducing response size by 90% saves bandwidth costs and improves load times.',

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Graph API field selection',
    howTheyDoIt: 'Every Graph API call supports ?fields=id,name,email. Mobile apps request minimal fields, web apps request more. Same endpoint, different payloads.',
  },

  keyPoints: [
    'Let clients specify fields with query parameter',
    'Reduces response size by 50-90% for mobile',
    'Faster parsing and network transfer',
    'Similar to GraphQL field selection',
  ],

  quickCheck: {
    question: 'Why is selective field filtering important for mobile apps?',
    options: [
      'Faster database queries',
      'Better security',
      'Saves bandwidth on limited data plans',
      'Easier debugging',
    ],
    correctIndex: 2,
    explanation: 'Mobile users often have limited data plans. Reducing response size by 90% saves bandwidth costs and improves load times on slow networks.',
  },

  keyConcepts: [
    { title: 'Field Selection', explanation: 'Client chooses which fields to receive', icon: '🎯' },
    { title: 'Query Parameter', explanation: '?fields=id,name,email', icon: '❓' },
    { title: 'Bandwidth', explanation: 'Amount of data transferred', icon: '📊' },
  ],
};

const step5: GuidedStep = {
  id: 'response-transform-gateway-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: Gateway supports selective field filtering via query parameter',
    taskDescription: 'Implement ?fields=id,title,price query parameter',
    successCriteria: [
      'Open Python tab',
      'Parse fields query parameter',
      'Filter response to only include requested fields',
      'Return minimal response when fields specified',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Parse request.query_params["fields"] to get comma-separated list',
    level2: 'Split by comma, then filter response dict to only include those keys',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Response Enrichment
// =============================================================================

const step6Story: StoryContent = {
  emoji: '✨',
  scenario: "Clients are making multiple API calls to assemble complete data!",
  hook: "To show a product page, mobile apps call:\n1. GET /products/123 (product data)\n2. GET /inventory/123 (stock level)\n3. GET /reviews/stats/123 (review stats)\n\nThree round-trips! We can enrich the product response with all this data.",
  challenge: "Implement response enrichment to aggregate data from multiple sources.",
  illustration: 'data-aggregation',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Response enrichment is working!',
  achievement: 'One API call now returns complete data',
  metrics: [
    { label: 'API calls', before: '3 calls', after: '1 call' },
    { label: 'Round-trips', before: '3× RTT', after: '1× RTT' },
    { label: 'Page load time', before: '450ms', after: '150ms' },
  ],
  nextTeaser: "Perfect! Let's add caching to make it even faster...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Response Enrichment: Aggregating Data',
  conceptExplanation: `**Response Enrichment** adds computed or aggregated data to responses.

**Pattern 1: Computed fields**
\`\`\`python
# Backend returns
{"price": 100, "tax_rate": 0.08}

# Gateway enriches
{"price": 100, "tax_rate": 0.08, "total": 108}
\`\`\`

**Pattern 2: Aggregate from multiple services**
\`\`\`python
# Product Service
{"id": 123, "title": "Laptop", "price": 999}

# Inventory Service (separate call)
{"stock": 5, "warehouse": "US-WEST"}

# Enriched response
{
  "id": 123,
  "title": "Laptop",
  "price": 999,
  "stock": 5,  # Enriched!
  "warehouse": "US-WEST"  # Enriched!
}
\`\`\`

**Benefits:**
1. Fewer client API calls (1 instead of 3)
2. Reduced latency (1 round-trip vs 3)
3. Consistent business logic (computed at gateway)
4. Better mobile experience`,

  whyItMatters: 'Each API call adds 50-200ms of network latency. Reducing 3 calls to 1 saves 100-400ms on page load.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Product detail page',
    howTheyDoIt: 'Single API call returns product data + inventory + reviews + recommendations. Gateway aggregates from 10+ microservices.',
  },

  famousIncident: {
    title: 'Uber Map Screen Performance',
    company: 'Uber',
    year: '2016',
    whatHappened: 'Map screen made 15+ API calls on load. In developing countries with slow networks, app took 10+ seconds to load. Gateway-based enrichment reduced to 3 calls, improved load time by 70%.',
    lessonLearned: 'Mobile networks have high latency. Minimize round-trips by enriching responses at the gateway.',
    icon: '🚗',
  },

  keyPoints: [
    'Enrichment reduces API calls from N to 1',
    'Gateway calls multiple backends in parallel',
    'Critical for mobile performance (reduce round-trips)',
    'Consistent business logic (compute once at gateway)',
  ],

  quickCheck: {
    question: 'Why does response enrichment improve mobile performance?',
    options: [
      'Faster database queries',
      'Better caching',
      'Reduces network round-trips (biggest latency source)',
      'Smaller response size',
    ],
    correctIndex: 2,
    explanation: 'Each API call has 50-200ms network latency. Reducing 3 calls to 1 saves 100-400ms. Round-trip time is often the biggest performance bottleneck on mobile.',
  },

  keyConcepts: [
    { title: 'Enrichment', explanation: 'Add data from other sources', icon: '✨' },
    { title: 'Aggregation', explanation: 'Combine data from multiple services', icon: '🔗' },
    { title: 'Round-Trip Time', explanation: 'Network latency per API call', icon: '⏱️' },
  ],
};

const step6: GuidedStep = {
  id: 'response-transform-gateway-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-4: Gateway enriches responses with data from multiple sources',
    taskDescription: 'Add Cache for storing inventory/review data, then enrich responses',
    componentsNeeded: [
      { type: 'cache', reason: 'Store inventory and review data', displayName: 'Cache (Redis)' },
    ],
    successCriteria: [
      'Add Cache component',
      'Connect Gateway to Cache',
      'Implement enrichment: add stock and review stats to product response',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add Cache, connect Gateway → Cache, then update Python to fetch and merge data',
    level2: 'In Python: fetch product from DB, fetch inventory/reviews from Cache, merge into enriched response',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const responseTransformGatewayGuidedTutorial: GuidedTutorial = {
  problemId: 'response-transform-gateway',
  title: 'Design a Response Transform Gateway',
  description: 'Build a gateway that transforms, filters, and enriches API responses for different clients',
  difficulty: 'intermediate',
  estimatedMinutes: 35,

  welcomeStory: {
    emoji: '🔄',
    hook: "You're the API Architect at APIHub Inc!",
    scenario: "Your mission: Build a Response Transform Gateway that serves mobile apps, web clients, and legacy systems - all from one backend API.",
    challenge: "Can you design a gateway that filters, masks, converts formats, and enriches responses?",
  },

  requirementsPhase: responseTransformGatewayRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  // Final exam test cases
  finalExamTestCases: [
    {
      name: 'Basic Request Routing',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Gateway routes requests and returns responses',
      traffic: { type: 'mixed', rps: 100, readRps: 100, writeRps: 0 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Field Filtering',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Gateway filters sensitive fields from responses',
      traffic: { type: 'mixed', rps: 200, readRps: 200, writeRps: 0 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Field Masking',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Gateway masks credit cards and SSNs',
      traffic: { type: 'mixed', rps: 200, readRps: 200, writeRps: 0 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Format Conversion',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Gateway converts JSON to XML based on Accept header',
      traffic: { type: 'mixed', rps: 300, readRps: 300, writeRps: 0 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Selective Field Filtering',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Gateway supports ?fields query parameter',
      traffic: { type: 'mixed', rps: 400, readRps: 400, writeRps: 0 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Response Enrichment',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Gateway enriches responses with data from cache',
      traffic: { type: 'mixed', rps: 500, readRps: 500, writeRps: 0 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.01, maxP99Latency: 100 },
    },
    {
      name: 'High Throughput',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 50K RPS with transformation latency < 5ms',
      traffic: { type: 'mixed', rps: 50000, readRps: 50000, writeRps: 0 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
  ] as TestCase[],

  concepts: [
    'Response Transformation',
    'Field Filtering',
    'Field Masking',
    'Format Conversion',
    'Content Negotiation',
    'Selective Field Filtering',
    'Response Enrichment',
    'Data Aggregation',
    'API Gateway Pattern',
    'Mobile Optimization',
  ],

  ddiaReferences: [
    'Chapter 4: Encoding and Evolution - Data formats and schemas',
    'Chapter 1: Reliable, Scalable, and Maintainable Applications',
  ],
};

export default responseTransformGatewayGuidedTutorial;
