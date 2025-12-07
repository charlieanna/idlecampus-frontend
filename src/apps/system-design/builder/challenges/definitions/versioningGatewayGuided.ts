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
 * Versioning Gateway Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching API versioning strategies for backward compatibility.
 * Focuses on version negotiation, deprecation policies, and migration support.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Basic API versioning (URL, header, query param)
 * Steps 4-6: Version routing, sunset headers, migration support
 *
 * Key Concepts (API Design Best Practices):
 * - Version negotiation strategies
 * - Backward compatibility
 * - Deprecation lifecycle
 * - Migration paths
 * - Sunset headers
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const versioningGatewayRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an API Gateway that supports multiple API versions gracefully",

  interviewer: {
    name: 'Sarah Chen',
    role: 'API Platform Lead',
    avatar: '👩‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-versioning',
      category: 'functional',
      question: "Why do we need API versioning? Can't we just update the API?",
      answer: "API versioning prevents breaking existing clients:\n\n1. **Mobile apps** - Can't force users to update immediately\n2. **Third-party integrations** - Partners need time to adapt\n3. **Legacy systems** - Some clients may never upgrade\n\nWithout versioning, every API change risks breaking production clients. Versioning lets old and new clients coexist peacefully.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Versioning is about backward compatibility - allowing the API to evolve without breaking existing clients",
    },
    {
      id: 'version-negotiation',
      category: 'functional',
      question: "How do clients specify which API version they want?",
      answer: "Three main strategies:\n\n1. **URL versioning**: `/v1/users` vs `/v2/users`\n2. **Header versioning**: `Accept: application/vnd.api.v2+json`\n3. **Query parameter**: `/users?version=2`\n\nEach has tradeoffs. URL is most visible and cacheable. Headers are cleaner but harder to test. Query params are flexible but pollute URLs.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Version negotiation determines how clients request specific API versions",
    },
    {
      id: 'backward-compatibility',
      category: 'functional',
      question: "What changes require a new version vs what can be done without breaking?",
      answer: "**Non-breaking changes** (no new version needed):\n- Adding new fields to responses\n- Adding new optional parameters\n- Adding new endpoints\n\n**Breaking changes** (require new version):\n- Removing or renaming fields\n- Changing field types (string → number)\n- Making optional fields required\n- Changing endpoint URLs\n\nRule: If existing clients might break, it's a breaking change.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Understanding what breaks compatibility is key to API evolution",
    },
    {
      id: 'deprecation-policy',
      category: 'functional',
      question: "How long should we support old API versions?",
      answer: "Industry standard deprecation lifecycle:\n\n1. **Announce** - Give 6-12 months notice\n2. **Sunset header** - `Sunset: Sat, 31 Dec 2024 23:59:59 GMT`\n3. **Warning phase** - Add deprecation warnings in responses\n4. **Sunset** - Stop accepting new clients on old version\n5. **Decommission** - Turn off old version completely\n\nTypical timeline: 12-24 months from announcement to decommission.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Deprecation needs a clear timeline and communication strategy",
    },
    {
      id: 'migration-support',
      category: 'functional',
      question: "How do we help clients migrate from v1 to v2?",
      answer: "Migration support tools:\n\n1. **Dual responses** - Return both v1 and v2 format during transition\n2. **Migration guide** - Documentation with before/after examples\n3. **Compatibility shim** - Translate v1 requests to v2 internally\n4. **Gradual rollout** - Test with 1% of traffic first\n\nMake migration as easy as possible - you want clients to upgrade!",
      importance: 'important',
      revealsRequirement: 'FR-5',
      insight: "Good migration support reduces the burden on old version maintenance",
    },

    // SCALE & NFRs
    {
      id: 'version-distribution',
      category: 'throughput',
      question: "How many clients will be on old vs new versions?",
      answer: "Typical distribution during transition:\n- v1: 80% of traffic initially\n- v2: 20% of traffic\n\nOver 12 months:\n- v1: 80% → 50% → 20% → 5% → deprecated\n- v2: 20% → 50% → 80% → 95% → primary\n\nMust support both versions efficiently during overlap period.",
      importance: 'critical',
      calculation: {
        formula: "At 10K RPS total: 8K RPS to v1, 2K RPS to v2 initially",
        result: "Both versions need production capacity",
      },
      learningPoint: "Version migration is gradual - expect long overlap periods",
    },
    {
      id: 'version-count',
      category: 'throughput',
      question: "How many API versions should we support simultaneously?",
      answer: "Best practice: Support N and N-1 (current + previous)\n\nSupporting 2 versions: manageable\nSupporting 3+ versions: maintenance nightmare\n\nStripe supports 10+ versions, but they have a massive team. For most companies, 2 active versions is the sweet spot.",
      importance: 'important',
      learningPoint: "Limit concurrent versions to reduce maintenance burden",
    },
    {
      id: 'latency-overhead',
      category: 'latency',
      question: "Does version routing add latency?",
      answer: "Version routing should add < 1ms overhead:\n- URL parsing: ~0.1ms\n- Header parsing: ~0.1ms\n- Route lookup: ~0.1ms (in-memory hash map)\n\nTotal: < 1ms p99 latency\n\nAvoid complex version negotiation logic in hot path.",
      importance: 'critical',
      learningPoint: "Version routing must be fast - it's in the critical path",
    },
    {
      id: 'breaking-change-incident',
      category: 'reliability',
      question: "What happens if we accidentally deploy a breaking change?",
      answer: "Without versioning: DISASTER\n- All clients break simultaneously\n- Emergency rollback required\n- Customer trust damaged\n\nWith versioning:\n- Only new version affected\n- Old clients keep working\n- Hotfix only new version\n- Gradual rollout catches issues early",
      importance: 'critical',
      learningPoint: "Versioning is a safety mechanism for API evolution",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-versioning', 'version-negotiation', 'backward-compatibility'],
  criticalFRQuestionIds: ['core-versioning', 'version-negotiation'],
  criticalScaleQuestionIds: ['version-distribution', 'latency-overhead', 'breaking-change-incident'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Support multiple API versions simultaneously',
      description: 'Clients can choose which version to use - no forced upgrades',
      emoji: '🔢',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Version negotiation via URL, header, and query param',
      description: 'Support multiple versioning strategies for different client needs',
      emoji: '🤝',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Backward compatibility guarantees',
      description: 'Non-breaking changes don\'t require version bumps',
      emoji: '🔒',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Deprecation lifecycle with sunset headers',
      description: 'Clear timeline and warnings for version sunset',
      emoji: '🌅',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Migration support tools',
      description: 'Help clients migrate smoothly from old to new versions',
      emoji: '🚀',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: 'N/A - API Gateway',
    writesPerDay: 'N/A',
    readsPerDay: 'N/A',
    peakMultiplier: 2,
    readWriteRatio: 'Mixed',
    calculatedWriteRPS: { average: 0, peak: 0 },
    calculatedReadRPS: { average: 10000, peak: 20000 },
    maxPayloadSize: '~10KB (JSON API)',
    storagePerRecord: 'N/A',
    storageGrowthPerYear: 'N/A',
    redirectLatencySLA: 'p99 < 1ms (version routing)',
    createLatencySLA: 'N/A',
  },

  architecturalImplications: [
    '✅ Multiple versions running in parallel (v1 and v2 services)',
    '✅ Version routing adds < 1ms latency (fast path)',
    '✅ Sunset headers communicate deprecation timeline',
    '✅ Migration period: 12-24 months overlap',
    '✅ Limit to 2 concurrent versions (N and N-1)',
  ],

  outOfScope: [
    'Database schema versioning',
    'Client SDK generation',
    'Automatic migration tools',
    'API documentation versioning',
  ],

  keyInsight: "First, let's make it WORK. We'll build support for multiple API versions using different negotiation strategies. Then we'll add deprecation policies and migration support to make version transitions smooth.",
};

// =============================================================================
// STEP 1: Connect Client to Gateway
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🎬',
  scenario: "Welcome to TechCorp! You're building an API Gateway for a fast-growing SaaS platform.",
  hook: "The v1 API is live with 1000+ customers. Marketing just promised new features in v2, but you can't break v1 clients!",
  challenge: "Build the foundation: Client sends requests through the Versioning Gateway to reach backend services.",
  illustration: 'gateway-foundation',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your versioning gateway is online!',
  achievement: 'Clients can now send requests through the gateway',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Request flow', after: 'Client → Gateway → Backend' },
  ],
  nextTeaser: "But how do clients specify which API version they want?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'API Versioning Gateway: Managing Evolution',
  conceptExplanation: `An **API Versioning Gateway** enables multiple API versions to coexist:

**Why Version APIs?**
1. **Backward compatibility** - Old clients keep working
2. **Gradual migration** - Clients upgrade at their own pace
3. **Risk reduction** - Breaking changes don't affect all clients
4. **Partner trust** - Stable API contract builds confidence

Basic flow:
\`\`\`
Client → Gateway (parses version) → v1 Service
                                   → v2 Service
\`\`\``,

  whyItMatters: 'Without versioning, every API change risks breaking production clients. Versioning enables safe evolution.',

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Stripe supports 10+ API versions simultaneously',
    howTheyDoIt: 'Uses header-based versioning (Stripe-Version: 2023-10-16). Each version header routes to different backend implementation. Old versions work indefinitely.',
  },

  keyPoints: [
    'Versioning prevents breaking existing clients',
    'Multiple versions run in parallel during transition',
    'Gateway routes based on version identifier',
    'Critical for mobile apps and third-party integrations',
  ],

  keyConcepts: [
    { title: 'Versioning Gateway', explanation: 'Routes requests to correct API version', icon: '🚪' },
    { title: 'Backward Compatibility', explanation: 'Old clients continue working unchanged', icon: '🔒' },
    { title: 'Version Overlap', explanation: 'Multiple versions active simultaneously', icon: '🔄' },
  ],
};

const step1: GuidedStep = {
  id: 'versioning-gateway-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Gateway routes requests to backend services',
    taskDescription: 'Add Client, Gateway (API Gateway), and Backend (App Server), then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents API consumers', displayName: 'Client' },
      { type: 'api_gateway', reason: 'Acts as the Versioning Gateway', displayName: 'Gateway' },
      { type: 'app_server', reason: 'Represents backend API service', displayName: 'API Service' },
    ],
    successCriteria: [
      'Client component added',
      'Gateway (API Gateway) component added',
      'API Service (App Server) component added',
      'Client → Gateway → API Service connections created',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'api_gateway', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Drag Client, API Gateway, and App Server onto the canvas',
    level2: 'Connect Client → API Gateway, then API Gateway → App Server',
    solutionComponents: [{ type: 'client' }, { type: 'api_gateway' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'api_gateway' },
      { from: 'api_gateway', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 2: URL-Based Versioning (Path Versioning)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🛣️',
  scenario: "Your v2 API is ready! It has breaking changes (renamed fields, new auth).",
  hook: "You need to run v1 and v2 simultaneously. Old clients call /v1/users, new clients call /v2/users.",
  challenge: "Implement URL-based versioning so the gateway routes /v1/* to v1 service and /v2/* to v2 service.",
  illustration: 'url-versioning',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'URL-based versioning is live!',
  achievement: 'Gateway routes based on URL path version',
  metrics: [
    { label: 'Versioning strategy', after: 'URL-based (/v1, /v2)' },
    { label: 'Supported versions', after: 'v1 and v2' },
  ],
  nextTeaser: "But some clients prefer cleaner URLs with version headers...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'URL-Based Versioning: The Classic Approach',
  conceptExplanation: `**URL versioning** embeds the version in the URL path:

\`\`\`
GET /v1/users/123     → v1 API Service
GET /v2/users/123     → v2 API Service
\`\`\`

**Pros:**
- **Visible** - Version is obvious in URL
- **Cacheable** - CDNs can cache by URL
- **Easy to test** - Use curl or browser
- **Client-side routing** - Frameworks can route by path

**Cons:**
- **URL pollution** - /v1 prefix on everything
- **Coupling** - Changing version changes all URLs
- **Not RESTful** - Version isn't a resource

**Routing logic:**
\`\`\`python
def route_request(path):
    if path.startswith('/v1/'):
        return v1_service
    elif path.startswith('/v2/'):
        return v2_service
    else:
        return v1_service  # default to v1
\`\`\``,

  whyItMatters: 'URL versioning is the most common strategy - it\'s explicit, cacheable, and easy to understand.',

  realWorldExample: {
    company: 'Twitter API',
    scenario: 'Twitter uses URL versioning for major versions',
    howTheyDoIt: 'api.twitter.com/1.1/users/show vs api.twitter.com/2/users. Each major version is a different URL namespace.',
  },

  famousIncident: {
    title: 'GitHub API v3 to v4 Migration',
    company: 'GitHub',
    year: '2016',
    whatHappened: 'GitHub moved from REST (v3) to GraphQL (v4) - completely different paradigm. URL versioning made it easy: api.github.com/v3 vs api.github.com/graphql. Both versions ran for years.',
    lessonLearned: 'URL versioning enables radical API changes without breaking existing clients.',
    icon: '🐙',
  },

  keyPoints: [
    'Version in URL path: /v1/resource vs /v2/resource',
    'Most visible and explicit versioning strategy',
    'CDN-friendly (each version has different URL)',
    'Default to old version for backward compatibility',
  ],

  quickCheck: {
    question: 'Why is URL versioning CDN-friendly?',
    options: [
      'CDNs prefer URLs',
      'Each version has unique URL, easy to cache separately',
      'Headers are harder to cache',
      'Query params break caching',
    ],
    correctIndex: 1,
    explanation: 'CDNs cache by URL. With /v1/users and /v2/users as different URLs, CDN can cache each version independently.',
  },

  keyConcepts: [
    { title: 'URL Versioning', explanation: 'Version embedded in URL path', icon: '🛣️' },
    { title: 'Path Prefix', explanation: '/v1/ or /v2/ determines routing', icon: '🏷️' },
    { title: 'Cache-Friendly', explanation: 'Each version is separate URL', icon: '📦' },
  ],
};

const step2: GuidedStep = {
  id: 'versioning-gateway-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1 & FR-2: Support URL-based versioning (/v1, /v2)',
    taskDescription: 'Add v2 API service and configure gateway to route /v1/* and /v2/* paths',
    componentsNeeded: [
      { type: 'app_server', reason: 'v2 API Service', displayName: 'API v2 Service' },
    ],
    successCriteria: [
      'Add second App Server for v2 API',
      'Connect Gateway to both v1 and v2 services',
      'Configure path-based routing: /v1/* → v1, /v2/* → v2',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'api_gateway', 'app_server', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Add a second App Server for API v2, connect to gateway',
    level2: 'Add App Server (v2), connect Gateway → v2. Configure routing: /v1/* → v1 service, /v2/* → v2 service',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [{ from: 'api_gateway', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Header-Based Versioning
// =============================================================================

const step3Story: StoryContent = {
  emoji: '📧',
  scenario: "Enterprise clients complain: 'We don't want /v1/ in our URLs. It looks ugly in documentation!'",
  hook: "They want clean URLs like /users/123, but still need version control. Solution: version in HTTP headers!",
  challenge: "Implement header-based versioning using Accept or custom API-Version header.",
  illustration: 'header-versioning',
};

const step3Celebration: CelebrationContent = {
  emoji: '✨',
  message: 'Header-based versioning enabled!',
  achievement: 'Gateway supports both URL and header versioning',
  metrics: [
    { label: 'Versioning strategies', before: 'URL only', after: 'URL + Header' },
    { label: 'Header support', after: 'Accept, API-Version' },
  ],
  nextTeaser: "What about clients that can't set headers? Let's add query param support...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Header-Based Versioning: The RESTful Way',
  conceptExplanation: `**Header versioning** uses HTTP headers to specify version:

**Option 1: Custom Header**
\`\`\`
GET /users/123
API-Version: 2
\`\`\`

**Option 2: Accept Header (Content Negotiation)**
\`\`\`
GET /users/123
Accept: application/vnd.api.v2+json
\`\`\`

**Pros:**
- **Clean URLs** - No version prefix
- **RESTful** - Version is metadata, not resource
- **Flexible** - Can version different resources independently

**Cons:**
- **Hidden** - Not visible in URL
- **Testing harder** - Need to set headers
- **Caching complex** - CDN must cache by header

**Routing logic:**
\`\`\`python
def route_request(headers, path):
    version = headers.get('API-Version', '1')
    if version == '1':
        return v1_service
    elif version == '2':
        return v2_service
\`\`\``,

  whyItMatters: 'Header versioning keeps URLs clean and is more RESTful - version is metadata about the resource, not part of the resource identifier.',

  realWorldExample: {
    company: 'GitHub GraphQL API',
    scenario: 'GitHub uses Accept header for API versioning',
    howTheyDoIt: 'Accept: application/vnd.github.v3+json. Allows versioning without polluting URLs. Default version assumed if header absent.',
  },

  famousIncident: {
    title: 'Stripe API Versioning Strategy',
    company: 'Stripe',
    year: '2015+',
    whatHappened: 'Stripe chose header-based versioning (Stripe-Version: 2023-10-16). This enables fine-grained versioning by date instead of major versions. Clients can pin to specific API snapshot.',
    lessonLearned: 'Header versioning enables more granular versioning strategies than URL versioning.',
    icon: '💳',
  },

  keyPoints: [
    'Version in HTTP header: API-Version or Accept',
    'Keeps URLs clean and RESTful',
    'Harder to test (must set headers)',
    'Default version when header absent',
  ],

  quickCheck: {
    question: 'Why is header versioning considered more RESTful?',
    options: [
      'It uses HTTP headers',
      'Version is metadata about representation, not part of resource identifier',
      'It\'s newer than URL versioning',
      'REST requires headers',
    ],
    correctIndex: 1,
    explanation: 'In REST, /users/123 identifies the resource. The version is about how the resource is represented (JSON v1 vs v2), which is metadata - perfect for headers.',
  },

  keyConcepts: [
    { title: 'Header Versioning', explanation: 'Version specified in HTTP header', icon: '📧' },
    { title: 'Content Negotiation', explanation: 'Accept header for version selection', icon: '🤝' },
    { title: 'Clean URLs', explanation: 'No version prefix in path', icon: '✨' },
  ],
};

const step3: GuidedStep = {
  id: 'versioning-gateway-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Support header-based versioning',
    taskDescription: 'Configure gateway to parse API-Version or Accept headers for version routing',
    successCriteria: [
      'Click Gateway component',
      'Configure header-based routing',
      'Support API-Version header',
      'Support Accept header with vendor MIME type',
      'Default to v1 when header absent',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'api_gateway', 'app_server', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
    ],
    requireAPIConfiguration: true,
  },

  hints: {
    level1: 'Configure Gateway to check API-Version or Accept headers for routing',
    level2: 'Click Gateway → Configure routing rules: Check API-Version header, route to v1 or v2 service accordingly',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 4: Query Parameter Versioning
// =============================================================================

const step4Story: StoryContent = {
  emoji: '❓',
  scenario: "Your JavaScript widget runs in third-party websites that block custom headers!",
  hook: "URL versioning breaks their routes. Header versioning is blocked. They need query parameter versioning!",
  challenge: "Add query parameter versioning: /users/123?version=2",
  illustration: 'query-versioning',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎊',
  message: 'All versioning strategies supported!',
  achievement: 'Gateway supports URL, header, and query parameter versioning',
  metrics: [
    { label: 'Versioning strategies', after: 'URL + Header + Query' },
    { label: 'Client flexibility', after: 'Maximum' },
  ],
  nextTeaser: "Now we need to handle deprecation - how do we sunset v1?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Query Parameter Versioning: Maximum Flexibility',
  conceptExplanation: `**Query parameter versioning** adds version to query string:

\`\`\`
GET /users/123?version=2
GET /users/123?api_version=2
GET /users/123?v=2
\`\`\`

**Pros:**
- **Easy to test** - Just add ?version=2 to any request
- **Browser-friendly** - Works in all environments
- **Backward compatible** - No header required
- **Override-friendly** - Easy to switch versions for testing

**Cons:**
- **Pollutes query string** - Mixes with actual query params
- **Caching issues** - CDNs cache by full URL including query
- **Not RESTful** - Query params usually for filtering

**Routing logic:**
\`\`\`python
def route_request(query_params):
    version = query_params.get('version', '1')
    if version == '1':
        return v1_service
    elif version == '2':
        return v2_service
\`\`\`

**Priority order:**
1. Query param (?version=2) - highest priority
2. Header (API-Version: 2) - second
3. URL path (/v2/users) - third
4. Default to v1 - fallback`,

  whyItMatters: 'Query parameter versioning is the most flexible - works everywhere, easy to test, enables quick version switching.',

  realWorldExample: {
    company: 'Facebook Graph API',
    scenario: 'Facebook supports query parameter versioning for testing',
    howTheyDoIt: 'graph.facebook.com/v12.0/me?version=13.0 allows testing newer version without changing URL structure.',
  },

  keyPoints: [
    'Version in query param: ?version=2 or ?v=2',
    'Most flexible - works in all environments',
    'Great for testing and debugging',
    'Use priority order when multiple strategies present',
  ],

  quickCheck: {
    question: 'What should happen if a request has ?version=2 in URL and API-Version: 1 header?',
    options: [
      'Return error (conflicting versions)',
      'Use query param (higher priority)',
      'Use header (more RESTful)',
      'Use v1 (safe default)',
    ],
    correctIndex: 1,
    explanation: 'Query params have highest priority - they\'re explicit and often used for testing/debugging. Header is second priority.',
  },

  keyConcepts: [
    { title: 'Query Versioning', explanation: 'Version in query parameter', icon: '❓' },
    { title: 'Priority Order', explanation: 'Query > Header > URL > Default', icon: '📊' },
    { title: 'Testing-Friendly', explanation: 'Easy to switch versions for testing', icon: '🧪' },
  ],
};

const step4: GuidedStep = {
  id: 'versioning-gateway-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Support query parameter versioning',
    taskDescription: 'Add query parameter version parsing with priority order',
    successCriteria: [
      'Configure gateway to parse ?version query param',
      'Implement priority: query > header > URL > default',
      'Test: /users?version=2 routes to v2',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'api_gateway', 'app_server', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
    ],
    requireAPIConfiguration: true,
  },

  hints: {
    level1: 'Add query param parsing to gateway routing logic',
    level2: 'Configure Gateway → Parse ?version or ?v query param, prioritize over header/URL versioning',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Sunset Headers and Deprecation Warnings
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🌅',
  scenario: "v1 has been running for 2 years. You need to deprecate it to focus on v2.",
  hook: "How do you tell clients 'v1 will shut down in 6 months'? You need sunset headers and deprecation warnings!",
  challenge: "Add Sunset header and deprecation warnings to v1 responses.",
  illustration: 'deprecation',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚠️',
  message: 'Deprecation warnings live!',
  achievement: 'Clients receive clear sunset timeline',
  metrics: [
    { label: 'Sunset header', after: 'Enabled' },
    { label: 'Deprecation warnings', after: 'Active' },
    { label: 'Migration timeline', after: '6 months notice' },
  ],
  nextTeaser: "Clients need help migrating. Let's add migration support...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'API Deprecation: Sunset Headers and Migration Timeline',
  conceptExplanation: `**Sunset header** (RFC 8594) communicates when an API will be retired:

\`\`\`
HTTP/1.1 200 OK
Sunset: Sat, 31 Dec 2024 23:59:59 GMT
Deprecation: true
Link: <https://api.example.com/docs/migration>; rel="sunset"

{
  "warning": "API v1 will be deprecated on Dec 31, 2024. Please migrate to v2.",
  "data": { ... }
}
\`\`\`

**Deprecation Lifecycle:**

**Phase 1: Announcement (T-12 months)**
- Blog post, email, docs
- No technical changes yet

**Phase 2: Sunset Headers (T-6 months)**
- Add Sunset header to all v1 responses
- Add deprecation warnings in JSON
- Monitor who's still on v1

**Phase 3: Soft Sunset (T-3 months)**
- Stop accepting new clients on v1
- Existing clients get warnings
- Provide migration guide

**Phase 4: Hard Sunset (T-0)**
- Return 410 Gone for v1 requests
- Redirect to migration guide

**Phase 5: Decommission (T+1 month)**
- Turn off v1 completely
- Keep 410 handler for 6 more months`,

  whyItMatters: 'Deprecation is about trust. Communicate clearly, give time, provide migration help. Abrupt shutdowns damage customer relationships.',

  realWorldExample: {
    company: 'Twilio',
    scenario: 'Twilio deprecated API version 2008-08-01',
    howTheyDoIt: 'Gave 18 months notice. Added Sunset headers. Sent monthly emails. Provided migration guide with code examples. Offered free consulting for large customers.',
  },

  famousIncident: {
    title: 'Twitter API v1.0 Shutdown Disaster',
    company: 'Twitter',
    year: '2013',
    whatHappened: 'Twitter gave only 6 months notice for v1.0 shutdown. Thousands of apps broke overnight. Developers were furious. Many abandoned the platform.',
    lessonLearned: 'Give generous timeline (12+ months), communicate early and often, provide migration tools.',
    icon: '🐦',
  },

  keyPoints: [
    'Sunset header communicates deprecation date',
    'Give 12+ months notice for major deprecations',
    'Add warnings to response body',
    'Monitor API usage to identify stragglers',
    'Provide migration guide and support',
  ],

  quickCheck: {
    question: 'What HTTP status code should you return after API sunset?',
    options: [
      '404 Not Found',
      '410 Gone (resource permanently removed)',
      '500 Internal Server Error',
      '301 Redirect to new version',
    ],
    correctIndex: 1,
    explanation: '410 Gone indicates the resource is permanently removed and won\'t come back. 404 implies it might return. 410 is the correct status for deprecated APIs.',
  },

  keyConcepts: [
    { title: 'Sunset Header', explanation: 'RFC 8594 - communicates deprecation date', icon: '🌅' },
    { title: 'Deprecation Timeline', explanation: '12+ months from announcement to shutdown', icon: '📅' },
    { title: '410 Gone', explanation: 'HTTP status for deprecated resources', icon: '⛔' },
  ],
};

const step5: GuidedStep = {
  id: 'versioning-gateway-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-4: Deprecation lifecycle with sunset headers',
    taskDescription: 'Configure gateway to add Sunset and Deprecation headers to v1 responses',
    successCriteria: [
      'Click Gateway component',
      'Configure v1 route to add Sunset header',
      'Add Deprecation: true header',
      'Add warning message to response body',
      'Set sunset date 6 months in future',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'api_gateway', 'app_server', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
    ],
    requireAPIConfiguration: true,
  },

  hints: {
    level1: 'Configure Gateway to inject Sunset header into v1 responses',
    level2: 'Click Gateway → Configure v1 routing to add headers: Sunset: <date>, Deprecation: true, warning message',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Migration Support and Compatibility Shims
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🛠️',
  scenario: "Clients are struggling to migrate from v1 to v2. The field names changed!",
  hook: "v1 uses 'user_id', v2 uses 'userId'. Clients need to rewrite all their code. Can we help?",
  challenge: "Implement a compatibility shim that translates v1 requests to v2 format internally.",
  illustration: 'migration-shim',
};

const step6Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Production-ready versioning gateway complete!',
  achievement: 'Full versioning support with migration tools',
  metrics: [
    { label: 'Versioning strategies', after: 'URL + Header + Query' },
    { label: 'Deprecation', after: 'Sunset headers ✓' },
    { label: 'Migration support', after: 'Compatibility shim ✓' },
    { label: 'Backward compatibility', after: 'Guaranteed ✓' },
  ],
  nextTeaser: "You've built a production-grade versioning gateway!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Migration Support: Making Upgrades Easy',
  conceptExplanation: `**Compatibility shim** translates between API versions:

**Example: Field Naming Changes**
v1: \`user_id\`, \`created_at\` (snake_case)
v2: \`userId\`, \`createdAt\` (camelCase)

**Shim in Gateway:**
\`\`\`python
def compatibility_shim(v1_request):
    # Translate v1 → v2 format
    v2_request = {
        'userId': v1_request.get('user_id'),
        'createdAt': v1_request.get('created_at')
    }

    # Call v2 service
    v2_response = v2_service.call(v2_request)

    # Translate v2 → v1 format
    v1_response = {
        'user_id': v2_response.get('userId'),
        'created_at': v2_response.get('createdAt')
    }

    return v1_response
\`\`\`

**Benefits:**
- Clients get v1 interface, backed by v2 service
- Only one backend to maintain (v2)
- Gradual migration - no forced upgrades

**Migration Tools:**
1. **API diff tool** - Show v1 vs v2 changes
2. **Migration guide** - Step-by-step instructions
3. **Code generator** - Auto-generate v2 client code
4. **Sandbox** - Test v2 without affecting production
5. **Gradual rollout** - 1% → 10% → 50% → 100%`,

  whyItMatters: 'Migration support reduces the burden on clients and accelerates v1 deprecation. Make it easy to upgrade!',

  realWorldExample: {
    company: 'Salesforce',
    scenario: 'Salesforce supports 50+ API versions',
    howTheyDoIt: 'Each version is a thin shim over the latest internal API. Old versions automatically benefit from bug fixes and performance improvements.',
  },

  keyPoints: [
    'Compatibility shim translates between versions',
    'Keep only latest version in backend',
    'Reduce maintenance by consolidating backends',
    'Provide migration guide with examples',
    'Test tools help clients verify compatibility',
  ],

  quickCheck: {
    question: 'Why use a compatibility shim instead of running separate v1 and v2 services?',
    options: [
      'Shims are faster',
      'Only maintain one backend, shim translates for old clients',
      'Shims are more secure',
      'Separate services are deprecated',
    ],
    correctIndex: 1,
    explanation: 'Compatibility shim lets you maintain only the v2 backend. The shim translates v1 requests/responses, so old clients work without maintaining separate v1 service.',
  },

  keyConcepts: [
    { title: 'Compatibility Shim', explanation: 'Translates between API versions', icon: '🔧' },
    { title: 'Single Backend', explanation: 'Only maintain latest version', icon: '🎯' },
    { title: 'Migration Guide', explanation: 'Help clients upgrade smoothly', icon: '📘' },
  ],
};

const step6: GuidedStep = {
  id: 'versioning-gateway-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-5: Migration support tools',
    taskDescription: 'Implement compatibility shim in gateway to translate v1 ↔ v2',
    successCriteria: [
      'Click Gateway component',
      'Open Python/Code tab',
      'Implement compatibility_shim() function',
      'Translate v1 field names to v2 (snake_case → camelCase)',
      'Route v1 requests through shim to v2 backend',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'api_gateway', 'app_server', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Open Gateway code editor and implement field translation',
    level2: 'Implement compatibility_shim() that converts snake_case ↔ camelCase field names',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const versioningGatewayGuidedTutorial: GuidedTutorial = {
  problemId: 'versioning-gateway',
  title: 'Design an API Versioning Gateway',
  description: 'Build a production-ready gateway with multiple versioning strategies, deprecation support, and migration tools',
  difficulty: 'intermediate',
  estimatedMinutes: 35,

  welcomeStory: {
    emoji: '🔢',
    hook: "You're the API Platform Lead at TechCorp!",
    scenario: "Your mission: Build a Versioning Gateway that enables safe API evolution without breaking existing clients.",
    challenge: "Can you support multiple versioning strategies and graceful deprecation?",
  },

  requirementsPhase: versioningGatewayRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  // Final exam test cases
  finalExamTestCases: [
    {
      name: 'URL-Based Versioning',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Gateway routes /v1/* and /v2/* to correct services',
      traffic: { type: 'mixed', rps: 100, readRps: 100, writeRps: 0 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Header-Based Versioning',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Gateway routes based on API-Version header',
      traffic: { type: 'mixed', rps: 100, readRps: 100, writeRps: 0 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Query Parameter Versioning',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Gateway routes based on ?version query param',
      traffic: { type: 'mixed', rps: 100, readRps: 100, writeRps: 0 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Version Priority Order',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Query param > header > URL > default priority',
      traffic: { type: 'mixed', rps: 200, readRps: 200, writeRps: 0 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Sunset Headers',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Deprecated versions return Sunset header',
      traffic: { type: 'mixed', rps: 100, readRps: 100, writeRps: 0 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Compatibility Shim',
      type: 'functional',
      requirement: 'FR-5',
      description: 'v1 requests translated to v2 format',
      traffic: { type: 'mixed', rps: 100, readRps: 100, writeRps: 0 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Low Latency Routing',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Version routing adds < 1ms overhead',
      traffic: { type: 'mixed', rps: 1000, readRps: 1000, writeRps: 0 },
      duration: 60,
      passCriteria: { maxP99Latency: 1, maxErrorRate: 0.01 },
    },
  ] as TestCase[],

  concepts: [
    'API Versioning Strategies',
    'URL-Based Versioning',
    'Header-Based Versioning',
    'Query Parameter Versioning',
    'Backward Compatibility',
    'Deprecation Lifecycle',
    'Sunset Headers (RFC 8594)',
    'Compatibility Shims',
    'Migration Support',
    'Version Negotiation',
  ],

  ddiaReferences: [
    'Chapter 4: Encoding and Evolution - Schema evolution and compatibility',
    'Chapter 1: Reliable, Scalable, and Maintainable Applications - Evolvability',
  ],
};

export default versioningGatewayGuidedTutorial;
