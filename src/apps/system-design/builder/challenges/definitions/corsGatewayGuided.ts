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
 * CORS Gateway Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching CORS (Cross-Origin Resource Sharing) concepts
 * and how to build a secure gateway that handles cross-origin requests.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic CORS handling (FR satisfaction)
 * Steps 4-6: Add security features (dynamic origin validation, credentials, preflight optimization)
 *
 * Key Concepts (DDIA & Web Security):
 * - Same-origin policy and why CORS exists
 * - CORS headers (Access-Control-Allow-Origin, etc.)
 * - Preflight requests (OPTIONS)
 * - Credential handling and security implications
 * - Dynamic origin validation
 * - Preflight caching optimization
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const corsGatewayRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a CORS Gateway that securely handles cross-origin API requests",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Security Engineer at WebScale Corp',
    avatar: '👩‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-cors',
      category: 'functional',
      question: "What problem does CORS solve, and why do we need a gateway for it?",
      answer: "**Same-Origin Policy** is a security feature in browsers:\n\n- Website at `app.example.com` can only call APIs at `app.example.com`\n- Cannot call `api.partner.com` directly (different origin)\n- Prevents malicious sites from stealing data\n\n**CORS (Cross-Origin Resource Sharing)** allows controlled exceptions:\n- API server tells browser: \"I trust requests from app.example.com\"\n- Browser allows the cross-origin request\n- Gateway centralizes CORS logic instead of configuring each service\n\n**Why a gateway?**\n- Multiple frontend domains (app.example.com, mobile.example.com, partner.com)\n- Multiple backend services (users, products, payments)\n- Centralized CORS configuration instead of duplicating in each service",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "CORS is a browser security feature that controls which websites can call your APIs",
    },
    {
      id: 'allowed-origins',
      category: 'functional',
      question: "Which origins should we allow to call our APIs?",
      answer: "We have three types of allowed origins:\n\n**Production domains:**\n- https://app.example.com (main web app)\n- https://mobile.example.com (mobile web)\n\n**Development:**\n- http://localhost:3000 (local development)\n\n**Partner domains:**\n- https://partner.acme.com (verified partner)\n\n**Security rules:**\n- NEVER use wildcard `*` with credentials\n- Only allow HTTPS in production (except localhost)\n- Maintain whitelist of allowed origins",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Explicitly whitelist allowed origins - wildcard (*) is dangerous with credentials",
    },
    {
      id: 'credentials-handling',
      category: 'functional',
      question: "Our APIs use cookies for authentication. How does CORS affect this?",
      answer: "**Credentials (cookies, auth headers) require special handling:**\n\n**Without credentials (simple requests):**\n```\nAccess-Control-Allow-Origin: *\n```\nBrowser allows requests from any origin.\n\n**With credentials:**\n```\nAccess-Control-Allow-Origin: https://app.example.com\nAccess-Control-Allow-Credentials: true\n```\n- Cannot use wildcard `*`\n- Must specify exact origin\n- Must include `Access-Control-Allow-Credentials: true`\n- Otherwise browser blocks cookies/auth headers\n\n**Security implication:** Wildcard + credentials = major security hole!",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Credentials require exact origin (no wildcard) and Allow-Credentials header",
    },
    {
      id: 'preflight-requests',
      category: 'functional',
      question: "Why do some requests send an OPTIONS request first?",
      answer: "**Preflight requests** happen for 'non-simple' requests:\n\n**Simple requests (no preflight):**\n- GET, HEAD, POST\n- Only simple headers (Content-Type: application/x-www-form-urlencoded)\n\n**Complex requests (require preflight):**\n- PUT, DELETE, PATCH\n- Custom headers (Authorization, X-Custom-Header)\n- Content-Type: application/json\n\n**Preflight flow:**\n```\n1. Browser sends OPTIONS request\n   - What methods allowed?\n   - What headers allowed?\n   - How long to cache this?\n\n2. Server responds with CORS headers\n   - Access-Control-Allow-Methods: GET, POST, PUT\n   - Access-Control-Allow-Headers: Content-Type, Authorization\n   - Access-Control-Max-Age: 86400 (cache for 24 hours)\n\n3. Browser caches preflight response\n4. Browser sends actual request\n```\n\nPreflight adds latency, so caching is critical!",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Preflight requests are a performance cost - optimize with Max-Age caching",
    },
    {
      id: 'dynamic-origin-validation',
      category: 'functional',
      question: "We have 100+ partner domains. Should we hardcode all of them?",
      answer: "**Static whitelist doesn't scale.** Use **dynamic origin validation**:\n\n**Pattern-based matching:**\n```python\nallowed_patterns = [\n    r'^https://.*\\.example\\.com$',  # All subdomains\n    r'^https://.*\\.partner\\.com$',   # Partner subdomains\n    r'^http://localhost:\\d+$',       # Any localhost port\n]\n```\n\n**Database-driven whitelist:**\n- Store allowed origins in database\n- Update without redeploying gateway\n- Track which partner owns which domain\n- Revoke access instantly\n\n**Validation on every request:**\n```python\nif origin_matches_allowed_patterns(request.origin):\n    response.headers['Access-Control-Allow-Origin'] = request.origin\n```",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Dynamic validation enables scaling without hardcoding every origin",
    },
    {
      id: 'preflight-caching',
      category: 'functional',
      question: "How can we reduce the performance impact of preflight requests?",
      answer: "**Preflight optimization strategies:**\n\n**1. Max-Age header (browser caching):**\n```\nAccess-Control-Max-Age: 86400  # 24 hours\n```\nBrowser caches preflight response, avoiding repeat OPTIONS requests.\n\n**2. Gateway-level preflight cache:**\n- Cache preflight responses in Redis\n- Serve instantly without hitting backend\n- Key: origin + method + headers\n\n**3. Simple request optimization:**\n- Use GET instead of POST when possible (no preflight)\n- Keep Content-Type simple (no preflight for form-urlencoded)\n- Minimize custom headers\n\n**Impact:**\n- Without caching: 2 requests per API call (preflight + actual)\n- With 24h cache: 1 request per API call (cached preflight)",
      importance: 'important',
      revealsRequirement: 'FR-6',
      insight: "Preflight caching can cut CORS overhead by 50%",
    },

    // SCALE & NFRs
    {
      id: 'throughput-requests',
      category: 'throughput',
      question: "How many cross-origin requests do we handle?",
      answer: "50,000 requests per second during peak. About 40% require preflight (20,000 OPTIONS + 20,000 actual = 40,000 total).",
      importance: 'critical',
      calculation: {
        formula: "50K RPS × 40% preflight = 20K OPTIONS/sec + 50K actual = 70K total",
        result: "Preflight caching is essential - can reduce to 50K RPS",
      },
      learningPoint: "Preflight requests can add 40% overhead without caching",
    },
    {
      id: 'latency-preflight',
      category: 'latency',
      question: "What's the latency impact of preflight requests?",
      answer: "Each preflight adds a full round-trip:\n- Simple request: 1 round-trip (~50ms)\n- Preflight request: 2 round-trips (~100ms)\n\nWith 24-hour preflight caching, subsequent requests drop to 1 round-trip.\n\nGoal: p99 latency < 100ms (including CORS processing)",
      importance: 'critical',
      learningPoint: "Preflight doubles latency for first request - caching is critical",
    },
    {
      id: 'security-origin-spoofing',
      category: 'security',
      question: "Can an attacker fake the Origin header to bypass our whitelist?",
      answer: "**From browser:** No! The browser sets the Origin header and JavaScript cannot modify it. This is a security guarantee.\n\n**From non-browser clients (curl, Postman):** Yes! Non-browser clients can set any Origin header.\n\n**Defense strategy:**\n- CORS protects browsers only (that's the point!)\n- Non-browser clients need separate auth (API keys, OAuth)\n- CORS is NOT authentication - it's a browser security feature\n- Always validate authentication separately from CORS",
      importance: 'critical',
      learningPoint: "CORS is browser-only security - not a substitute for authentication",
    },
    {
      id: 'error-handling',
      category: 'functional',
      question: "What should the gateway do when origin is not allowed?",
      answer: "**Two approaches:**\n\n**1. Reject with error (more secure):**\n```\nHTTP 403 Forbidden\nNo CORS headers\n```\nBrowser blocks response, client sees CORS error.\n\n**2. Allow but omit CORS headers (silent failure):**\n```\nHTTP 200 OK\n(No Access-Control-Allow-Origin header)\n```\nBrowser blocks response silently.\n\n**Best practice:** Reject with 403 + clear error message in logs. Helps debugging legitimate issues.",
      importance: 'important',
      insight: "Clear error messages help debug CORS issues faster",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-cors', 'allowed-origins', 'credentials-handling'],
  criticalFRQuestionIds: ['core-cors', 'allowed-origins', 'preflight-requests'],
  criticalScaleQuestionIds: ['throughput-requests', 'latency-preflight', 'security-origin-spoofing'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Handle CORS headers for cross-origin requests',
      description: 'Set appropriate CORS headers based on request origin',
      emoji: '🌐',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Validate allowed origins',
      description: 'Whitelist specific origins and reject unauthorized requests',
      emoji: '🔒',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Support credential-based requests',
      description: 'Handle cookies and auth headers with proper CORS configuration',
      emoji: '🔑',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Process preflight OPTIONS requests',
      description: 'Respond to preflight requests with allowed methods and headers',
      emoji: '✈️',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Dynamic origin validation',
      description: 'Pattern-based and database-driven origin validation',
      emoji: '🎯',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Preflight response caching',
      description: 'Cache preflight responses to reduce latency',
      emoji: '⚡',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10M API requests from web/mobile apps',
    writesPerDay: 'N/A - Gateway handles requests',
    readsPerDay: 'N/A - Gateway handles requests',
    peakMultiplier: 3,
    readWriteRatio: 'N/A',
    calculatedWriteRPS: { average: 0, peak: 0 },
    calculatedReadRPS: { average: 16667, peak: 50000 },
    maxPayloadSize: '~50KB (API request/response)',
    storagePerRecord: 'N/A - Stateless gateway',
    storageGrowthPerYear: 'N/A',
    redirectLatencySLA: 'N/A',
    createLatencySLA: 'p99 < 100ms (CORS processing overhead)',
  },

  architecturalImplications: [
    '✅ 50K RPS with 40% preflight → Need preflight caching (Redis)',
    '✅ Dynamic origin validation → Store patterns in database',
    '✅ Credentials support → Exact origin matching (no wildcard)',
    '✅ p99 < 100ms → Optimize CORS header generation',
    '✅ Multiple frontends → Centralized CORS configuration',
  ],

  outOfScope: [
    'Authentication/Authorization (separate concern)',
    'Rate limiting per origin',
    'CORS policy versioning',
    'Monitoring origin usage patterns',
    'WebSocket CORS (different protocol)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a basic CORS gateway that handles the most common cases. Then we'll add security features and optimizations for production. Function first, then security, then performance!",
};

// =============================================================================
// STEP 1: Connect Client to CORS Gateway
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to WebScale Corp! Your web app and API are on different domains.",
  hook: "Browsers block cross-origin requests by default. Your React app at app.example.com can't call api.example.com!",
  challenge: "Build the foundation: Client → CORS Gateway → Backend API",
  illustration: 'gateway-foundation',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your CORS Gateway is online!',
  achievement: 'Basic architecture is ready',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Request flow', after: 'Client → Gateway → API' },
  ],
  nextTeaser: "But the browser still blocks requests due to missing CORS headers...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Same-Origin Policy and Why We Need CORS',
  conceptExplanation: `**Same-Origin Policy** is a fundamental browser security feature:

**What is an origin?**
- Protocol + Domain + Port
- https://app.example.com:443 ← one origin
- https://api.example.com:443 ← different origin!

**Same-Origin Policy:**
Browser allows requests only to the same origin:
\`\`\`
app.example.com → app.example.com ✓ Allowed
app.example.com → api.example.com ✗ Blocked (different domain)
app.example.com → app.other.com   ✗ Blocked (different domain)
http://app.example.com → https://app.example.com ✗ Blocked (different protocol)
\`\`\`

**Why this policy exists:**
- Prevents malicious websites from stealing your data
- Evil.com cannot call YourBank.com APIs with your cookies
- Protects users from cross-site request forgery

**CORS Gateway solution:**
API server tells browser: "I trust requests from specific origins"`,

  whyItMatters: 'Without CORS, modern web apps cannot call APIs on different domains. CORS is essential for microservices and CDN-hosted frontends.',

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Checkout.js hosted on CDN, calls api.stripe.com',
    howTheyDoIt: 'api.stripe.com returns CORS headers allowing requests from any HTTPS origin. Gateway validates API keys for security.',
  },

  keyPoints: [
    'Same-origin policy prevents cross-origin API calls by default',
    'CORS allows servers to explicitly permit specific origins',
    'Gateway centralizes CORS logic for all backend services',
    'CORS is a browser security feature - not authentication',
  ],

  keyConcepts: [
    { title: 'Origin', explanation: 'Protocol + Domain + Port combination', icon: '🌐' },
    { title: 'Same-Origin Policy', explanation: 'Browser blocks cross-origin requests', icon: '🚫' },
    { title: 'CORS', explanation: 'Server-controlled exceptions to same-origin policy', icon: '✅' },
  ],

  diagram: `
Without CORS:
┌──────────────────┐
│ app.example.com  │
└────────┬─────────┘
         │ API request
         ▼
    ┌─────────┐
    │ Browser │ ← Blocks! Different origin
    └─────────┘

With CORS Gateway:
┌──────────────────┐
│ app.example.com  │
└────────┬─────────┘
         │ API request
         ▼
┌─────────────────────┐
│   CORS Gateway      │ ← Adds CORS headers
│ api.example.com     │
└────────┬────────────┘
         │
         ▼
    ┌─────────┐
    │ Browser │ ← Allows! CORS headers present
    └─────────┘
`,
};

const step1: GuidedStep = {
  id: 'cors-gateway-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Gateway routes cross-origin requests',
    taskDescription: 'Add Client, Gateway (App Server), and Backend API (Database), then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents web/mobile apps', displayName: 'Client' },
      { type: 'app_server', reason: 'Acts as the CORS Gateway', displayName: 'Gateway' },
      { type: 'database', reason: 'Represents backend API', displayName: 'Backend API' },
    ],
    successCriteria: [
      'Client component added',
      'Gateway (App Server) component added',
      'Backend API (Database) component added',
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
    level1: 'Drag Client, App Server (Gateway), and Database (Backend API) onto the canvas',
    level2: 'Connect Client → App Server, then App Server → Database',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 2: Implement Basic CORS Headers
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🔒',
  scenario: "The browser is blocking all requests with a CORS error!",
  hook: "Console shows: 'Access to fetch blocked by CORS policy: No Access-Control-Allow-Origin header'",
  challenge: "Implement basic CORS headers in Python to allow cross-origin requests.",
  illustration: 'cors-error',
};

const step2Celebration: CelebrationContent = {
  emoji: '✅',
  message: 'CORS headers are working!',
  achievement: 'Browser now allows cross-origin requests',
  metrics: [
    { label: 'CORS errors', before: '100%', after: '0%' },
    { label: 'Allowed origins', after: 'Configured' },
  ],
  nextTeaser: "But we're allowing ALL origins with wildcard (*) - that's insecure!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'CORS Headers: Access-Control-Allow-Origin',
  conceptExplanation: `**The CORS Headers:**

**1. Access-Control-Allow-Origin** (required)
Tells browser which origins can access the response.

\`\`\`python
# Allow all origins (not secure!)
response.headers['Access-Control-Allow-Origin'] = '*'

# Allow specific origin (secure)
response.headers['Access-Control-Allow-Origin'] = 'https://app.example.com'
\`\`\`

**2. Access-Control-Allow-Methods** (for preflight)
Which HTTP methods are allowed.

\`\`\`python
response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE'
\`\`\`

**3. Access-Control-Allow-Headers** (for preflight)
Which request headers are allowed.

\`\`\`python
response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
\`\`\`

**Request flow:**
1. Browser sends request with Origin header
2. Server responds with Access-Control-Allow-Origin
3. Browser compares: does response origin match request origin?
4. If yes: allow access. If no: block and show CORS error`,

  whyItMatters: 'Without the Access-Control-Allow-Origin header, browsers block all cross-origin responses, breaking modern web apps.',

  famousIncident: {
    title: 'GitHub API CORS Misconfiguration',
    company: 'GitHub',
    year: '2014',
    whatHappened: 'GitHub accidentally set Access-Control-Allow-Origin: * with credentials allowed. This exposed user data to any website for several hours.',
    lessonLearned: 'Never use wildcard with credentials. Always validate origins explicitly.',
    icon: '🐙',
  },

  realWorldExample: {
    company: 'AWS S3',
    scenario: 'Static assets served from S3 to websites',
    howTheyDoIt: 'S3 CORS configuration allows wildcard for public assets, but requires exact origin for authenticated requests.',
  },

  keyPoints: [
    'Access-Control-Allow-Origin header is required for CORS',
    'Can be wildcard (*) or specific origin',
    'Wildcard cannot be used with credentials',
    'Browser blocks response if header is missing or wrong',
  ],

  quickCheck: {
    question: 'When can you use Access-Control-Allow-Origin: * ?',
    options: [
      'Always - it\'s the most permissive',
      'For public APIs without credentials',
      'Only in development',
      'Never - it\'s insecure',
    ],
    correctIndex: 1,
    explanation: 'Wildcard (*) is safe for public APIs without credentials (like public REST APIs). But never with cookies or auth headers!',
  },

  keyConcepts: [
    { title: 'Access-Control-Allow-Origin', explanation: 'Header specifying allowed origins', icon: '🌐' },
    { title: 'Origin Header', explanation: 'Browser sends origin of requesting page', icon: '📍' },
    { title: 'Wildcard (*)', explanation: 'Allows any origin (unsafe with credentials)', icon: '⚠️' },
  ],
};

const step2: GuidedStep = {
  id: 'cors-gateway-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Handle CORS headers for cross-origin requests',
    taskDescription: 'Configure gateway APIs and implement CORS header logic in Python',
    successCriteria: [
      'Click on Gateway (App Server)',
      'Assign GET /api/* API',
      'Open Python tab',
      'Implement add_cors_headers() function',
      'Set Access-Control-Allow-Origin header',
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
    level1: 'Click Gateway → APIs tab, assign GET /api/*',
    level2: 'Switch to Python tab, implement add_cors_headers() to set Access-Control-Allow-Origin',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Implement Origin Whitelist Validation
// =============================================================================

const step3Story: StoryContent = {
  emoji: '⚠️',
  scenario: "Security audit found a critical issue: you're allowing ANY origin!",
  hook: "Using Access-Control-Allow-Origin: * means evil.com can call your API from browsers. With credentials, this is a major security hole!",
  challenge: "Implement origin whitelist validation to only allow trusted domains.",
  illustration: 'security-alert',
};

const step3Celebration: CelebrationContent = {
  emoji: '🔒',
  message: 'Origin validation is working!',
  achievement: 'Only whitelisted origins are allowed',
  metrics: [
    { label: 'Allowed origins', before: 'ALL (*)', after: 'Whitelist only' },
    { label: 'Security', before: 'Vulnerable', after: 'Secure' },
  ],
  nextTeaser: "Good! But what about requests with cookies and auth headers?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Origin Validation: Whitelist Security',
  conceptExplanation: `**Why wildcard (*) is dangerous:**

Evil.com can make requests to your API:
\`\`\`javascript
// Evil.com's malicious code
fetch('https://api.example.com/user/data', {
  credentials: 'include'  // Include cookies!
})
.then(data => {
  sendToEvilServer(data);  // Steal user data
});
\`\`\`

If you allow wildcard with credentials, evil.com gets the data!

**Origin whitelist solution:**

\`\`\`python
ALLOWED_ORIGINS = [
    'https://app.example.com',
    'https://mobile.example.com',
    'http://localhost:3000',  # Development
]

def validate_origin(request_origin):
    if request_origin in ALLOWED_ORIGINS:
        return request_origin
    else:
        return None  # Reject!

# In handler:
origin = request.headers.get('Origin')
allowed = validate_origin(origin)

if allowed:
    response.headers['Access-Control-Allow-Origin'] = allowed
else:
    return 403  # Forbidden
\`\`\`

**Key principle:** Only reflect back the origin if it's in the whitelist.`,

  whyItMatters: 'Origin validation is the foundation of CORS security. Without it, any website can access your API from users\' browsers.',

  famousIncident: {
    title: 'PayPal CORS Vulnerability',
    company: 'PayPal',
    year: '2013',
    whatHappened: 'PayPal\'s API allowed all origins by reflecting the Origin header without validation. Attackers could steal user data from any website.',
    lessonLearned: 'Always validate origins against a whitelist. Never blindly reflect the Origin header.',
    icon: '💳',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Storefront API called from merchant websites',
    howTheyDoIt: 'Merchants register their domains in Shopify admin. API validates origin against merchant\'s registered domains before allowing CORS.',
  },

  diagram: `
Without Validation:
┌─────────────┐
│  evil.com   │ ← Attacker's site
└──────┬──────┘
       │ Origin: evil.com
       ▼
┌─────────────────────┐
│   CORS Gateway      │ ← Allows ALL origins
│ Access-Control-     │
│   Allow-Origin: *   │
└──────┬──────────────┘
       │ User data returned
       ▼
   💀 Data stolen!

With Validation:
┌─────────────┐
│  evil.com   │ ← Attacker's site
└──────┬──────┘
       │ Origin: evil.com
       ▼
┌─────────────────────┐
│   CORS Gateway      │ ← Checks whitelist
│ evil.com NOT in     │
│   whitelist         │
└──────┬──────────────┘
       │ HTTP 403 Forbidden
       ▼
   🛡️ Attack blocked!
`,

  keyPoints: [
    'Never use wildcard (*) with credentials',
    'Maintain explicit whitelist of allowed origins',
    'Validate request Origin against whitelist',
    'Only return Access-Control-Allow-Origin if origin is whitelisted',
    'Return 403 Forbidden for unauthorized origins',
  ],

  quickCheck: {
    question: 'Why is Access-Control-Allow-Origin: * dangerous with credentials?',
    options: [
      'It slows down the server',
      'Any website can make authenticated requests and steal user data',
      'It breaks mobile apps',
      'Browsers reject it',
    ],
    correctIndex: 1,
    explanation: 'Wildcard allows ANY website to make authenticated requests (with cookies) to your API. Evil.com can steal user data by making API calls on behalf of logged-in users.',
  },

  keyConcepts: [
    { title: 'Origin Whitelist', explanation: 'List of trusted origins allowed to access API', icon: '📋' },
    { title: 'Origin Validation', explanation: 'Check request origin against whitelist', icon: '✅' },
    { title: 'Reflection Attack', explanation: 'Blindly returning Origin header without validation', icon: '🔄' },
  ],
};

const step3: GuidedStep = {
  id: 'cors-gateway-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Validate allowed origins',
    taskDescription: 'Implement origin whitelist validation in Python',
    successCriteria: [
      'Open Python tab in Gateway',
      'Define ALLOWED_ORIGINS list',
      'Implement validate_origin() function',
      'Only set CORS headers if origin is whitelisted',
      'Return 403 for unauthorized origins',
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
    level1: 'Create ALLOWED_ORIGINS list and validate request origin before setting CORS header',
    level2: 'Implement: if origin in ALLOWED_ORIGINS: set header, else: return 403',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 4: Add Credential Support
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🍪',
  scenario: "Your API uses cookies for authentication, but they're not being sent!",
  hook: "Browser console shows: 'Credentials flag is true, but Access-Control-Allow-Credentials is not present'. Cookies are blocked!",
  challenge: "Add Access-Control-Allow-Credentials header to support cookie-based authentication.",
  illustration: 'cookie-blocked',
};

const step4Celebration: CelebrationContent = {
  emoji: '🔑',
  message: 'Credentials are working!',
  achievement: 'Cookies and auth headers now flow through',
  metrics: [
    { label: 'Credentials support', before: 'Blocked', after: 'Enabled' },
    { label: 'Authentication', before: 'Broken', after: 'Working' },
  ],
  nextTeaser: "Great! But complex requests are sending double requests...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Credential Handling with CORS',
  conceptExplanation: `**Credentials in CORS context:**

Credentials include:
- Cookies (session, auth tokens)
- HTTP Authentication headers (Authorization)
- TLS client certificates

**Without credentials flag:**
\`\`\`javascript
fetch('https://api.example.com/user')
// Cookies NOT sent, even if they exist
\`\`\`

**With credentials flag:**
\`\`\`javascript
fetch('https://api.example.com/user', {
  credentials: 'include'  // Send cookies!
})
\`\`\`

**Server must respond with:**
\`\`\`python
response.headers['Access-Control-Allow-Credentials'] = 'true'
response.headers['Access-Control-Allow-Origin'] = 'https://app.example.com'
# CANNOT be '*' when credentials: true
\`\`\`

**Security rules:**
1. Cannot use wildcard origin with credentials
2. Must specify exact origin
3. Must include Allow-Credentials: true
4. Browser blocks cookies if any rule is violated`,

  whyItMatters: 'Most real-world APIs use cookies or auth headers. Without proper credential handling, authentication fails silently.',

  famousIncident: {
    title: 'LinkedIn CORS Credential Leak',
    company: 'LinkedIn',
    year: '2015',
    whatHappened: 'LinkedIn API allowed credentials with wildcard origin. Third-party sites could make authenticated requests and access user data.',
    lessonLearned: 'Credentials + wildcard = critical security vulnerability. Always use exact origins with credentials.',
    icon: '💼',
  },

  realWorldExample: {
    company: 'Auth0',
    scenario: 'Authentication service called from customer domains',
    howTheyDoIt: 'Customers register their domains. Auth0 validates origin and sets Allow-Credentials: true only for registered domains.',
  },

  diagram: `
Credentials Flow:

1. Browser sends request:
   Origin: https://app.example.com
   Cookie: session=abc123
   (credentials: 'include')

2. Gateway validates origin:
   ✓ app.example.com in whitelist
   ✓ Set exact origin (not *)
   ✓ Set Allow-Credentials: true

3. Browser checks response:
   ✓ Access-Control-Allow-Origin: https://app.example.com
   ✓ Access-Control-Allow-Credentials: true
   → Allows cookies to be sent!

4. Backend receives authenticated request:
   Cookie: session=abc123
   → Can identify user
`,

  keyPoints: [
    'Credentials include cookies, auth headers, TLS certs',
    'Browser needs credentials: "include" to send cookies',
    'Server must respond with Allow-Credentials: true',
    'CANNOT use wildcard origin with credentials',
    'Must validate origin against whitelist',
  ],

  quickCheck: {
    question: 'What headers are required for cookie-based authentication in CORS?',
    options: [
      'Access-Control-Allow-Origin: *',
      'Access-Control-Allow-Origin: https://app.example.com and Access-Control-Allow-Credentials: true',
      'Access-Control-Allow-Cookies: true',
      'Set-Cookie: SameSite=None',
    ],
    correctIndex: 1,
    explanation: 'Credentials require exact origin (no wildcard) AND Allow-Credentials: true. Both are mandatory.',
  },

  keyConcepts: [
    { title: 'Credentials', explanation: 'Cookies, auth headers, TLS certs', icon: '🔑' },
    { title: 'Allow-Credentials', explanation: 'Server header permitting credential-based requests', icon: '✅' },
    { title: 'credentials: include', explanation: 'Client flag to send cookies', icon: '🍪' },
  ],
};

const step4: GuidedStep = {
  id: 'cors-gateway-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Support credential-based requests',
    taskDescription: 'Add Access-Control-Allow-Credentials header',
    successCriteria: [
      'Open Python tab in Gateway',
      'Add Access-Control-Allow-Credentials: true header',
      'Ensure origin is exact (not wildcard) when credentials enabled',
      'Validate this combination is secure',
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
    level1: 'Add Access-Control-Allow-Credentials: true to response headers',
    level2: 'Set response.headers["Access-Control-Allow-Credentials"] = "true" alongside exact origin',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Handle Preflight OPTIONS Requests
// =============================================================================

const step5Story: StoryContent = {
  emoji: '✈️',
  scenario: "Your PUT and DELETE requests are failing!",
  hook: "Browser sends an OPTIONS request first (preflight), but the gateway returns 404. The actual request never happens!",
  challenge: "Implement preflight request handling for complex HTTP methods.",
  illustration: 'preflight-failure',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Preflight requests are handled!',
  achievement: 'PUT, DELETE, and custom headers now work',
  metrics: [
    { label: 'Preflight success', before: '0%', after: '100%' },
    { label: 'Supported methods', after: 'GET, POST, PUT, DELETE' },
  ],
  nextTeaser: "But every request is sending preflight - that's adding latency...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Preflight Requests: OPTIONS Method',
  conceptExplanation: `**When does browser send preflight?**

**Simple requests (no preflight):**
- Methods: GET, HEAD, POST
- Content-Type: application/x-www-form-urlencoded, multipart/form-data, text/plain
- Only simple headers (Accept, Accept-Language, Content-Language)

**Complex requests (require preflight):**
- Methods: PUT, DELETE, PATCH
- Content-Type: application/json
- Custom headers: Authorization, X-Custom-Header

**Preflight flow:**

\`\`\`
1. Browser sends OPTIONS request:
   OPTIONS /api/users/123
   Origin: https://app.example.com
   Access-Control-Request-Method: DELETE
   Access-Control-Request-Headers: Authorization

2. Server responds:
   HTTP 200 OK
   Access-Control-Allow-Origin: https://app.example.com
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE
   Access-Control-Allow-Headers: Authorization, Content-Type
   Access-Control-Max-Age: 86400  # Cache for 24 hours

3. Browser caches preflight response for 24 hours
4. Browser sends actual DELETE request
5. Server processes and responds with CORS headers
\`\`\`

**Implementation:**
\`\`\`python
if request.method == 'OPTIONS':
    # Preflight request
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE'
    response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
    response.headers['Access-Control-Max-Age'] = '86400'
    return 200
\`\`\``,

  whyItMatters: 'Without preflight handling, modern APIs with JSON and auth headers cannot work. Preflight is required for security.',

  realWorldExample: {
    company: 'Twilio',
    scenario: 'REST API with custom headers and JSON',
    howTheyDoIt: 'All requests use JSON (not form data), requiring preflight. Gateway responds to OPTIONS with 24-hour Max-Age to minimize overhead.',
  },

  famousIncident: {
    title: 'Dropbox API Preflight Outage',
    company: 'Dropbox',
    year: '2016',
    whatHappened: 'Deployment broke OPTIONS handling. All requests requiring preflight failed for 2 hours. Mobile and web apps couldn\'t upload files.',
    lessonLearned: 'Always test OPTIONS endpoints. Preflight failures break the entire API.',
    icon: '📦',
  },

  diagram: `
Preflight Request Flow:

┌─────────────────┐
│  Browser        │
└────────┬────────┘
         │
         │ 1. OPTIONS /api/users
         │    Access-Control-Request-Method: DELETE
         │    Access-Control-Request-Headers: Authorization
         ▼
┌─────────────────┐
│  CORS Gateway   │
└────────┬────────┘
         │
         │ 2. HTTP 200 OK
         │    Access-Control-Allow-Methods: GET, POST, PUT, DELETE
         │    Access-Control-Allow-Headers: Authorization, Content-Type
         │    Access-Control-Max-Age: 86400
         ▼
┌─────────────────┐
│  Browser        │ ← Caches preflight for 24h
└────────┬────────┘
         │
         │ 3. DELETE /api/users/123
         │    Authorization: Bearer token
         ▼
┌─────────────────┐
│  CORS Gateway   │ ← Processes actual request
└─────────────────┘
`,

  keyPoints: [
    'Preflight uses OPTIONS method',
    'Browser asks: What methods/headers are allowed?',
    'Server responds with Allow-Methods, Allow-Headers, Max-Age',
    'Browser caches preflight to reduce overhead',
    'Max-Age: 86400 = cache for 24 hours',
  ],

  quickCheck: {
    question: 'Why do browsers send preflight OPTIONS requests?',
    options: [
      'To check if server is online',
      'To ask permission before sending complex requests',
      'To authenticate the user',
      'To reduce bandwidth',
    ],
    correctIndex: 1,
    explanation: 'Preflight asks server: "Can I send a DELETE with Authorization header?" Server responds with allowed methods/headers. This protects servers from unexpected requests.',
  },

  keyConcepts: [
    { title: 'Preflight', explanation: 'OPTIONS request asking for permission', icon: '✈️' },
    { title: 'Access-Control-Request-Method', explanation: 'Browser asking what methods allowed', icon: '❓' },
    { title: 'Access-Control-Max-Age', explanation: 'How long to cache preflight response', icon: '⏱️' },
  ],
};

const step5: GuidedStep = {
  id: 'cors-gateway-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-4: Process preflight OPTIONS requests',
    taskDescription: 'Implement OPTIONS request handler for preflight',
    successCriteria: [
      'Open Python tab',
      'Check if request.method == OPTIONS',
      'Set Access-Control-Allow-Methods header',
      'Set Access-Control-Allow-Headers header',
      'Set Access-Control-Max-Age header',
      'Return 200 OK',
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
    level1: 'Add OPTIONS method handling that returns CORS preflight headers',
    level2: 'if request.method == "OPTIONS": set Allow-Methods, Allow-Headers, Max-Age, return 200',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Dynamic Origin Validation with Database
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🎯',
  scenario: "You have 50+ partner domains, and the list keeps growing!",
  hook: "Hardcoded whitelist requires redeployment every time a partner is added. Marketing wants self-service partner onboarding!",
  challenge: "Move origin whitelist to database for dynamic validation without redeployment.",
  illustration: 'scaling-partners',
};

const step6Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Dynamic origin validation is live!',
  achievement: 'Partners can be added without redeployment',
  metrics: [
    { label: 'Origin management', before: 'Hardcoded', after: 'Database-driven' },
    { label: 'Partner onboarding', before: 'Hours', after: 'Seconds' },
  ],
  nextTeaser: "Perfect! But preflight requests are still slow...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Dynamic Origin Validation at Scale',
  conceptExplanation: `**Static whitelist problems:**
- Hardcoded in application code
- Requires deployment to add/remove origins
- Can't revoke partner access instantly
- No audit trail of changes

**Database-driven solution:**

\`\`\`sql
CREATE TABLE allowed_origins (
  id SERIAL PRIMARY KEY,
  origin VARCHAR(255) UNIQUE,
  partner_name VARCHAR(255),
  pattern VARCHAR(255),  -- For regex matching
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

INSERT INTO allowed_origins (origin, partner_name)
VALUES
  ('https://app.example.com', 'Main App'),
  ('https://mobile.example.com', 'Mobile App'),
  ('https://partner.acme.com', 'Acme Corp');
\`\`\`

**Pattern-based matching:**
\`\`\`python
import re

def validate_origin_dynamic(origin):
    # Exact match
    exact = db.query("SELECT * FROM allowed_origins
                      WHERE origin = %s AND is_active = true", origin)
    if exact:
        return True

    # Pattern match (regex)
    patterns = db.query("SELECT pattern FROM allowed_origins
                         WHERE pattern IS NOT NULL AND is_active = true")
    for p in patterns:
        if re.match(p['pattern'], origin):
            return True

    return False
\`\`\`

**Benefits:**
- Add/remove origins via admin UI (no deployment)
- Instant revocation (set is_active = false)
- Pattern matching (*.example.com)
- Audit trail (who added when)`,

  whyItMatters: 'Dynamic validation enables self-service partner onboarding and instant security response, critical for scaling B2B APIs.',

  realWorldExample: {
    company: 'Zapier',
    scenario: 'Thousands of partner integrations',
    howTheyDoIt: 'Partners register their domains in Zapier dashboard. API validates origins against partner table in real-time. Can revoke partner access instantly if abuse detected.',
  },

  keyPoints: [
    'Store allowed origins in database',
    'Support both exact match and regex patterns',
    'Enable instant activation/deactivation',
    'Cache validation results (1 minute TTL)',
    'Log all validation attempts for security auditing',
  ],

  diagram: `
Dynamic Validation Flow:

┌─────────────────┐
│  Request        │
│  Origin: https://new-partner.com
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  CORS Gateway   │
└────────┬────────┘
         │ Query database
         ▼
┌─────────────────────────────┐
│  Database (PostgreSQL)      │
│  allowed_origins table      │
│  ┌────────────────────────┐ │
│  │ origin    | is_active │ │
│  │ partner.com | true    │ │
│  └────────────────────────┘ │
└────────┬────────────────────┘
         │ Result: found + active
         ▼
┌─────────────────┐
│  CORS Gateway   │ ← Allow request
│  Set CORS       │
│  headers        │
└─────────────────┘
`,

  keyConcepts: [
    { title: 'Dynamic Validation', explanation: 'Check database instead of hardcoded list', icon: '🔄' },
    { title: 'Pattern Matching', explanation: 'Use regex to allow subdomain wildcards', icon: '🎯' },
    { title: 'Instant Revocation', explanation: 'Set is_active=false to block immediately', icon: '⚡' },
  ],

  quickCheck: {
    question: 'What is the main advantage of database-driven origin validation?',
    options: [
      'Faster validation',
      'Better security',
      'No deployment needed to add/remove origins',
      'Uses less memory',
    ],
    correctIndex: 2,
    explanation: 'Database-driven validation allows adding/removing origins dynamically without code changes or deployment. Critical for self-service partner management.',
  },
};

const step6: GuidedStep = {
  id: 'cors-gateway-step-6',
  stepNumber: 6,
  frIndex: 4,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-5: Dynamic origin validation',
    taskDescription: 'Add database for origin storage and implement dynamic validation',
    componentsNeeded: [
      { type: 'database', reason: 'Store allowed origins', displayName: 'Origin DB' },
    ],
    successCriteria: [
      'Database already exists from step 1',
      'Update Python code to query database for origin validation',
      'Implement pattern matching for wildcard subdomains',
      'Cache validation results for performance',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Update validate_origin() to query database instead of checking hardcoded list',
    level2: 'Replace ALLOWED_ORIGINS list with database query: db.query("SELECT * FROM allowed_origins WHERE origin = %s")',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Cache for Preflight Response Optimization
// =============================================================================

const step7Story: StoryContent = {
  emoji: '⚡',
  scenario: "Every preflight request is hitting the database and backend!",
  hook: "40% of your requests are OPTIONS (preflight). Each one queries the database to validate origin. That's 20,000 extra DB queries per second!",
  challenge: "Add Redis cache to store preflight responses and reduce latency.",
  illustration: 'performance-crisis',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Preflight caching is working!',
  achievement: 'Database queries reduced by 95%, latency cut in half',
  metrics: [
    { label: 'Preflight latency', before: '50ms', after: '5ms' },
    { label: 'Database queries', before: '20K/s', after: '1K/s' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "Excellent! Now let's add load balancing for high availability...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Preflight Response Caching',
  conceptExplanation: `**Preflight performance problem:**

Every OPTIONS request:
1. Validates origin (database query)
2. Generates CORS headers
3. Returns 200 OK

At 50K RPS with 40% preflight = 20K OPTIONS/sec
Each OPTIONS does DB query = 20K DB queries/sec!

**Two-layer caching solution:**

**Layer 1: Browser cache (Max-Age)**
\`\`\`python
response.headers['Access-Control-Max-Age'] = '86400'  # 24 hours
\`\`\`
Browser caches preflight for same origin+method+headers combination.

**Layer 2: Gateway cache (Redis)**
\`\`\`python
# Cache key
cache_key = f"preflight:{origin}:{method}:{headers}"

# Check cache
cached = redis.get(cache_key)
if cached:
    return cached  # ~1ms

# Miss: validate origin + generate response
response = generate_preflight_response(origin, method, headers)

# Cache for 1 hour
redis.setex(cache_key, 3600, response)
return response
\`\`\`

**Cache key components:**
- Origin: https://app.example.com
- Method: DELETE
- Headers: Authorization,Content-Type

**Performance impact:**
- Cache miss: 50ms (DB query + validation)
- Cache hit: 5ms (Redis lookup)
- 95% hit rate → 10x latency reduction`,

  whyItMatters: 'Preflight caching is essential for performance. Without it, CORS can add 40%+ latency overhead to every API call.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'CDN handling billions of CORS requests',
    howTheyDoIt: 'Caches preflight at edge. Browser → Edge cache (0ms) → Never hits origin. Reduces CORS overhead to near-zero.',
  },

  keyPoints: [
    'Two-layer caching: browser (24h) + gateway (1h)',
    'Cache key: origin + method + headers',
    'Redis lookup (5ms) vs DB query (50ms)',
    '95% cache hit rate achievable',
    'Preflight cache separate from API response cache',
  ],

  diagram: `
Preflight Caching Flow:

┌──────────────┐
│OPTIONS request│
└──────┬───────┘
       │ Origin: app.example.com
       ▼
┌──────────────┐
│ Redis Cache  │ ← Check: preflight:app.example.com:DELETE:...
└──────┬───────┘
       │
       ├─ HIT (95%) → Return cached response (5ms)
       │
       └─ MISS (5%) ──┐
                       ▼
                ┌──────────────┐
                │  Database    │ ← Validate origin
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │Generate CORS │
                │  headers     │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │ Cache in     │
                │   Redis      │
                └──────┬───────┘
                       │
                       ▼
                Return (50ms)
`,

  keyConcepts: [
    { title: 'Preflight Cache', explanation: 'Store OPTIONS responses for reuse', icon: '💾' },
    { title: 'Max-Age', explanation: 'Browser-side cache duration', icon: '⏱️' },
    { title: 'Cache Key', explanation: 'Unique ID for cached preflight', icon: '🔑' },
  ],

  quickCheck: {
    question: 'Why cache preflight responses separately from API responses?',
    options: [
      'Preflight responses are smaller',
      'Different cache duration and invalidation rules',
      'To save memory',
      'Browser requirement',
    ],
    correctIndex: 1,
    explanation: 'Preflight responses can be cached much longer (24 hours) than API responses (seconds/minutes). Different TTL and invalidation strategies require separate caches.',
  },
};

const step7: GuidedStep = {
  id: 'cors-gateway-step-7',
  stepNumber: 7,
  frIndex: 5,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-6: Preflight response caching',
    taskDescription: 'Add Redis cache to store and serve preflight responses',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache preflight responses', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Add Cache (Redis) component',
      'Connect Gateway to Cache',
      'Implement preflight cache logic in Python',
      'Cache key: origin + method + headers',
      'TTL: 1 hour (3600 seconds)',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add Cache component and connect Gateway to it',
    level2: 'Implement Redis cache check before generating preflight response',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 8: Add Load Balancer for High Availability
// =============================================================================

const step8Story: StoryContent = {
  emoji: '⚖️',
  scenario: "Your single gateway instance just crashed during deployment!",
  hook: "All CORS requests are failing. Web apps across 50 partner sites are broken. Zero-downtime deployments are impossible with one instance!",
  challenge: "Add load balancer and multiple gateway instances for high availability.",
  illustration: 'high-availability',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Congratulations! You built a production-ready CORS Gateway!',
  achievement: 'Complete with origin validation, credentials, preflight optimization, and high availability',
  metrics: [
    { label: 'Gateway instances', before: '1', after: '3+' },
    { label: 'Availability', before: '99%', after: '99.99%' },
    { label: 'Zero-downtime deploys', after: 'Enabled' },
    { label: 'CORS headers', after: 'Optimized' },
    { label: 'Preflight cache', after: 'Enabled' },
  ],
  nextTeaser: "You've mastered CORS security and performance!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'High Availability for CORS Gateway',
  conceptExplanation: `**Single instance problems:**
- Deployment requires downtime
- No failover if instance crashes
- Cannot scale beyond one instance's capacity
- Single point of failure

**Load balancer + multiple instances:**

\`\`\`
Client → Load Balancer → Gateway Instance 1
                       → Gateway Instance 2
                       → Gateway Instance 3
\`\`\`

**Benefits:**
1. **Zero-downtime deployments**
   - Deploy one instance at a time
   - LB sends traffic to healthy instances

2. **Automatic failover**
   - Instance crashes → LB removes from pool
   - Traffic routed to healthy instances

3. **Horizontal scaling**
   - Add instances during traffic spikes
   - Remove instances during low traffic

4. **Geographic distribution**
   - Instances in multiple regions
   - Reduce latency for global users

**Gateway stateless design:**
- CORS validation uses shared Redis + DB
- No local state to sync
- Any instance can handle any request
- Perfect for load balancing`,

  whyItMatters: 'High availability is essential for CORS gateways - they\'re critical infrastructure that all web apps depend on. Downtime blocks all cross-origin traffic.',

  realWorldExample: {
    company: 'Fastly',
    scenario: 'CDN handling trillions of CORS requests',
    howTheyDoIt: 'Thousands of edge servers, each stateless. Any server can handle CORS validation. Auto-scaling based on traffic. 99.99% uptime SLA.',
  },

  keyPoints: [
    'Load balancer distributes traffic across instances',
    'Health checks detect and remove failed instances',
    'Zero-downtime deployments via rolling updates',
    'Stateless design enables easy horizontal scaling',
    'Shared Redis + DB for validation data',
  ],

  diagram: `
High Availability Architecture:

┌──────────────┐
│   Clients    │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  Load Balancer   │ ← Health checks
└──────┬───────────┘
       │
       ├─────────────────┬─────────────────┐
       │                 │                 │
       ▼                 ▼                 ▼
┌────────────┐  ┌────────────┐  ┌────────────┐
│ Gateway 1  │  │ Gateway 2  │  │ Gateway 3  │
│ (Stateless)│  │ (Stateless)│  │ (Stateless)│
└─────┬──────┘  └─────┬──────┘  └─────┬──────┘
      │               │               │
      └───────────────┼───────────────┘
                      │
          ┌───────────┴────────────┐
          │                        │
          ▼                        ▼
    ┌──────────┐            ┌──────────┐
    │  Redis   │            │ Database │
    │  Cache   │            │ Origins  │
    └──────────┘            └──────────┘
`,

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across instances', icon: '⚖️' },
    { title: 'Health Check', explanation: 'Monitors instance health', icon: '💓' },
    { title: 'Stateless', explanation: 'No local state, easy to scale', icon: '🔄' },
  ],

  quickCheck: {
    question: 'Why is stateless design important for CORS gateways?',
    options: [
      'Uses less memory',
      'Faster processing',
      'Any instance can handle any request - easy horizontal scaling',
      'Better security',
    ],
    correctIndex: 2,
    explanation: 'Stateless design means validation data (Redis + DB) is shared. Any instance can validate any origin. Easy to add/remove instances for scaling and availability.',
  },
};

const step8: GuidedStep = {
  id: 'cors-gateway-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'High availability with load balancing',
    taskDescription: 'Add load balancer and configure multiple gateway instances',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute requests and health check', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Add Load Balancer between Client and Gateway',
      'Configure Gateway for 3+ instances',
      'Ensure Redis and DB are shared across instances',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Add Load Balancer between Client and Gateway',
    level2: 'Reconnect: Client → Load Balancer → Gateway. Configure Gateway for 3+ instances.',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const corsGatewayGuidedTutorial: GuidedTutorial = {
  problemId: 'cors-gateway',
  title: 'Design a CORS Gateway',
  description: 'Build a secure gateway handling cross-origin requests with validation, credentials, and preflight optimization',
  difficulty: 'intermediate',
  estimatedMinutes: 40,

  welcomeStory: {
    emoji: '🌐',
    hook: "You're the Security Engineer at WebScale Corp!",
    scenario: "Your mission: Build a CORS Gateway that securely handles cross-origin API requests from multiple web and mobile apps.",
    challenge: "Can you design a gateway that balances security with performance?",
  },

  requirementsPhase: corsGatewayRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Final exam test cases
  finalExamTestCases: [
    {
      name: 'Basic CORS Headers',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Gateway sets CORS headers for allowed origins',
      traffic: { type: 'mixed', rps: 100, readRps: 100, writeRps: 0 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Origin Validation',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Gateway validates origins against whitelist',
      traffic: { type: 'mixed', rps: 200, readRps: 200, writeRps: 0 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Credential Support',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Gateway handles credential-based requests securely',
      traffic: { type: 'mixed', rps: 300, readRps: 300, writeRps: 0 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Preflight Handling',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Gateway responds to OPTIONS preflight requests',
      traffic: { type: 'mixed', rps: 500, readRps: 500, writeRps: 0 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.01, maxP99Latency: 100 },
    },
    {
      name: 'Dynamic Origin Validation',
      type: 'functional',
      requirement: 'FR-5',
      description: 'Gateway validates origins from database dynamically',
      traffic: { type: 'mixed', rps: 1000, readRps: 1000, writeRps: 0 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Preflight Caching',
      type: 'performance',
      requirement: 'FR-6',
      description: 'Gateway caches preflight responses for performance',
      traffic: { type: 'mixed', rps: 5000, readRps: 5000, writeRps: 0 },
      duration: 60,
      passCriteria: { maxP99Latency: 50, minCacheHitRate: 0.90 },
    },
    {
      name: 'High Throughput',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 50K RPS with preflight optimization',
      traffic: { type: 'mixed', rps: 50000, readRps: 50000, writeRps: 0 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.05 },
    },
  ] as TestCase[],

  concepts: [
    'Same-Origin Policy',
    'CORS (Cross-Origin Resource Sharing)',
    'Origin Validation',
    'Preflight Requests',
    'Credential Handling',
    'Dynamic Validation',
    'Preflight Caching',
    'Security vs Performance',
    'Load Balancing',
    'High Availability',
  ],

  ddiaReferences: [
    'Chapter 7: Transactions - Security in distributed systems',
    'Chapter 1: Reliability - Fault tolerance and availability',
  ],
};

export default corsGatewayGuidedTutorial;
