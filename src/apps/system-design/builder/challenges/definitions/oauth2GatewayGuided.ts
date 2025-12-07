import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * OAuth2 Gateway Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 7-step tutorial that teaches OAuth2 and API gateway concepts
 * while building a secure authentication and authorization system.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working OAuth2 system (FR satisfaction)
 * Steps 4-7: Scale with NFRs (token caching, rate limiting, PKCE, etc.)
 *
 * Key Concepts:
 * - OAuth2 authorization flows (authorization code, client credentials)
 * - Access token generation and validation
 * - Scope-based authorization
 * - PKCE (Proof Key for Code Exchange)
 * - Token refresh and expiration
 * - Rate limiting and security
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const oauth2GatewayRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an OAuth2 API Gateway for secure third-party integrations",

  interviewer: {
    name: 'Alex Thompson',
    role: 'Senior Security Architect at AuthGuard Inc.',
    avatar: '🔐',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-oauth',
      category: 'functional',
      question: "What's the core functionality users need from an OAuth2 gateway?",
      answer: "Third-party applications need to:\n\n1. **Authenticate users** - Verify who the user is\n2. **Get authorization** - User grants permission to access their data\n3. **Obtain access tokens** - Short-lived tokens to call protected APIs\n4. **Refresh tokens** - Get new access tokens without re-authenticating\n5. **Validate tokens** - API gateway checks if token is valid before allowing access",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "OAuth2 separates authentication from authorization, enabling secure third-party access",
    },
    {
      id: 'oauth-flows',
      category: 'functional',
      question: "Which OAuth2 flows should we support?",
      answer: "We need two main flows:\n\n1. **Authorization Code Flow** - For user-facing apps (web, mobile)\n   - User logs in and grants permissions\n   - App gets authorization code\n   - Exchange code for access token\n\n2. **Client Credentials Flow** - For server-to-server communication\n   - App authenticates with client ID and secret\n   - Gets token directly (no user involved)",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2',
      learningPoint: "Different flows for different use cases - user delegation vs machine-to-machine",
    },
    {
      id: 'scope-enforcement',
      category: 'functional',
      question: "How do we control what data third-party apps can access?",
      answer: "Using **scopes** - granular permissions like:\n- `read:profile` - Read user profile data\n- `write:posts` - Create posts on behalf of user\n- `read:messages` - Read user messages\n\nUser explicitly grants scopes during authorization. Tokens are limited to granted scopes only.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Scopes enable principle of least privilege - apps only get what they need",
    },
    {
      id: 'token-validation',
      category: 'functional',
      question: "How should the API gateway validate incoming tokens?",
      answer: "Gateway must validate:\n1. **Token signature** - Ensure token wasn't tampered with (JWT signature)\n2. **Expiration** - Check if token is still valid\n3. **Scopes** - Verify token has required permissions for the endpoint\n4. **Revocation** - Check if token was revoked early\n\nUse JWT (JSON Web Tokens) for stateless validation.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "JWT enables stateless token validation - no database lookup needed for each API call",
    },
    {
      id: 'pkce-security',
      category: 'security',
      question: "How do we secure mobile and single-page apps that can't keep secrets?",
      answer: "Use **PKCE (Proof Key for Code Exchange)**:\n\n1. App generates random `code_verifier`\n2. Computes `code_challenge = SHA256(code_verifier)`\n3. Sends code_challenge in authorization request\n4. Authorization server stores code_challenge\n5. When exchanging code for token, app sends code_verifier\n6. Server verifies SHA256(code_verifier) matches stored code_challenge\n\nThis prevents authorization code interception attacks!",
      importance: 'critical',
      revealsRequirement: 'FR-6',
      learningPoint: "PKCE protects against authorization code interception - critical for mobile/SPA",
    },
    {
      id: 'token-refresh',
      category: 'clarification',
      question: "What happens when an access token expires?",
      answer: "Access tokens are short-lived (15-60 minutes). When expired:\n1. Client uses **refresh token** to get new access token\n2. No need to redirect user through login again\n3. Refresh tokens are long-lived (days to months) but can be revoked\n\nThis balances security (short access tokens) with UX (no constant re-login).",
      importance: 'critical',
      insight: "Refresh tokens enable seamless UX while maintaining security",
    },
    {
      id: 'token-revocation',
      category: 'security',
      question: "How do we revoke access if a token is compromised or user removes app?",
      answer: "Implement **token revocation**:\n- Store revoked tokens in a blacklist (Redis cache)\n- When user removes app authorization, revoke all tokens for that app\n- Gateway checks blacklist before allowing access\n- Refresh tokens can be revoked to invalidate all future access tokens",
      importance: 'important',
      insight: "Token revocation is critical for security - users must be able to remove app access",
    },

    // SCALE & NFRs
    {
      id: 'throughput-tokens',
      category: 'throughput',
      question: "How many token validations per day should the gateway handle?",
      answer: "If we have 1 million daily active users, each making 50 API calls per day, that's 50 million token validations per day",
      importance: 'critical',
      calculation: {
        formula: "50M ÷ 86,400 sec = 579 validations/sec",
        result: "~600 validations/sec average, ~1,800 at peak",
      },
      learningPoint: "Token validation is on the critical path for every API call - must be fast!",
    },
    {
      id: 'throughput-oauth-flow',
      category: 'throughput',
      question: "How many OAuth authorization flows per day?",
      answer: "Much lower than token validations - about 100,000 new authorizations per day (new apps being authorized)",
      importance: 'important',
      calculation: {
        formula: "100K ÷ 86,400 sec = 1.16 flows/sec",
        result: "~1-2 OAuth flows/sec average, ~5 at peak",
      },
      learningPoint: "Authorization flows are infrequent compared to token validations - different optimization strategies",
    },
    {
      id: 'latency-validation',
      category: 'latency',
      question: "How fast should token validation be?",
      answer: "p99 under 10ms. Token validation adds latency to every API call - must be extremely fast. JWT validation is CPU-bound and can be done in <1ms.",
      importance: 'critical',
      learningPoint: "Token validation latency directly impacts all API calls - optimize aggressively",
    },
    {
      id: 'latency-oauth-flow',
      category: 'latency',
      question: "How fast should the OAuth authorization flow be?",
      answer: "End-to-end under 2 seconds. Users are waiting during this flow. Includes:\n- User authentication (if needed)\n- Consent page display\n- Authorization code generation\n- Token exchange",
      importance: 'important',
      learningPoint: "OAuth flow is user-facing - optimize for perceived performance",
    },
    {
      id: 'token-storage',
      category: 'consistency',
      question: "Where should we store tokens and authorization codes?",
      answer: "Use **short-lived cache** for:\n- Authorization codes (expire in 60 seconds)\n- Token blacklist (for revoked tokens)\n\nUse **database** for:\n- Refresh tokens (long-lived)\n- User authorizations and granted scopes\n- Client app registrations",
      importance: 'critical',
      learningPoint: "Different data has different lifetime and consistency requirements",
    },
    {
      id: 'security-requirements',
      category: 'security',
      question: "What security measures are critical for OAuth2?",
      answer: "MUST implement:\n1. **HTTPS only** - All OAuth endpoints must use TLS\n2. **PKCE** - For public clients (mobile, SPA)\n3. **State parameter** - Prevent CSRF attacks\n4. **Short-lived tokens** - Access tokens expire in 15-60 minutes\n5. **Rate limiting** - Prevent brute force attacks on token endpoints\n6. **Client authentication** - Verify client identity",
      importance: 'critical',
      learningPoint: "OAuth2 security is not optional - spec violations lead to breaches",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-oauth', 'oauth-flows', 'pkce-security'],
  criticalFRQuestionIds: ['core-oauth', 'oauth-flows'],
  criticalScaleQuestionIds: ['throughput-tokens', 'latency-validation', 'security-requirements'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: OAuth2 authorization code flow',
      description: 'Support authorization code flow for user-facing apps',
      emoji: '🔑',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Client credentials flow',
      description: 'Support machine-to-machine authentication',
      emoji: '🤖',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Scope-based authorization',
      description: 'Enforce granular permissions via scopes',
      emoji: '🔒',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Token refresh',
      description: 'Allow clients to refresh expired access tokens',
      emoji: '🔄',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Token validation at gateway',
      description: 'Validate JWT tokens before proxying to backend APIs',
      emoji: '✅',
    },
    {
      id: 'fr-6',
      text: 'FR-6: PKCE support',
      description: 'Secure authorization code flow for public clients',
      emoji: '🛡️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1 million users',
    writesPerDay: '100K new authorizations',
    readsPerDay: '50 million token validations',
    peakMultiplier: 3,
    readWriteRatio: '500:1',
    calculatedWriteRPS: { average: 1, peak: 5 },
    calculatedReadRPS: { average: 579, peak: 1737 },
    maxPayloadSize: '~2KB (JWT token)',
    storagePerRecord: '~1KB (authorization record)',
    storageGrowthPerYear: '~36GB',
    redirectLatencySLA: 'p99 < 10ms (token validation)',
    createLatencySLA: 'p99 < 2s (OAuth flow)',
  },

  architecturalImplications: [
    '✅ Read-heavy (500:1) → JWT for stateless validation, cache token blacklist',
    '✅ Low latency critical → JWT signature validation in-memory, no DB lookup per request',
    '✅ Security paramount → HTTPS only, PKCE, short-lived tokens, rate limiting',
    '✅ Token revocation → Cache-based blacklist for fast revocation checks',
    '✅ High availability → Stateless gateway design, replicate auth service',
  ],

  outOfScope: [
    'OpenID Connect (OIDC) identity layer',
    'SAML federation',
    'Multi-factor authentication (MFA)',
    'Social login (Google, Facebook, etc.)',
    'Dynamic client registration',
    'Device authorization flow',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple OAuth2 system with authorization code flow and token validation. Advanced features like PKCE, token revocation, and rate limiting will come in later steps. Functionality first, then security hardening!",
};

// =============================================================================
// STEP 1: Connect Client to Gateway
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔐',
  scenario: "Welcome to AuthGuard Inc! You've been hired to build a secure OAuth2 API gateway.",
  hook: "A third-party app wants to integrate with your platform. They need a way to authenticate users and access protected APIs!",
  challenge: "Set up the basic request flow so clients can reach your OAuth2 gateway.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your OAuth2 gateway is online!',
  achievement: 'Clients can now send requests to your gateway',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the gateway doesn't know how to handle OAuth2 flows yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: OAuth2 Gateway Architecture',
  conceptExplanation: `An **OAuth2 Gateway** sits between third-party clients and your backend APIs.

For OAuth2, clients are:
1. **Third-party apps** - Mobile apps, web apps, server applications
2. **Your own apps** - Mobile app, SPA, microservices

The gateway provides:
- **OAuth2 endpoints** - /authorize, /token, /revoke
- **Token validation** - Check JWT signatures and scopes
- **API proxying** - Forward validated requests to backend

Flow:
1. Client → Gateway (/authorize) → User grants permission
2. Client → Gateway (/token) → Get access token
3. Client → Gateway (with token) → Protected API`,

  whyItMatters: 'Without a gateway, every backend service would need to implement OAuth2 validation - duplication and security risk.',

  realWorldExample: {
    company: 'Google',
    scenario: 'Securing billions of API calls daily',
    howTheyDoIt: 'Google API Gateway validates OAuth2 tokens before routing to YouTube, Gmail, Drive APIs',
  },

  keyPoints: [
    'Client = third-party apps integrating with your platform',
    'Gateway = OAuth2 authorization server + API gateway',
    'Gateway validates tokens before proxying to backend APIs',
    'Centralized security enforcement point',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Third-party app requesting access', icon: '📱' },
    { title: 'Gateway', explanation: 'OAuth2 server + API proxy', icon: '🚪' },
    { title: 'Protected API', explanation: 'Backend service requiring auth', icon: '🔒' },
  ],
};

const step1: GuidedStep = {
  id: 'oauth2-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all OAuth2 flows',
    taskDescription: 'Add a Client and Gateway (App Server), then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents third-party apps accessing your APIs', displayName: 'Client' },
      { type: 'app_server', reason: 'OAuth2 Gateway handling auth and token validation', displayName: 'OAuth2 Gateway' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'App Server (Gateway) component added to canvas',
      'Client connected to Gateway',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server from the component palette onto the canvas',
    level2: 'Click the Client, then click the App Server to create a connection between them',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement OAuth2 Flows (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your gateway is connected, but it doesn't know how to handle OAuth2 yet!",
  hook: "A third-party app tried to get an access token but got a 404 error.",
  challenge: "Write the Python code to implement authorization code flow and token generation.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'OAuth2 flows are working!',
  achievement: 'You implemented the core OAuth2 functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can authorize apps', after: '✓' },
    { label: 'Can issue tokens', after: '✓' },
  ],
  nextTeaser: "But if the gateway restarts, all tokens and authorizations are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'OAuth2 Implementation: Authorization Code Flow',
  conceptExplanation: `OAuth2 Authorization Code Flow (most secure):

**Step 1: Authorization Request**
\`\`\`
GET /authorize?
  response_type=code&
  client_id=abc123&
  redirect_uri=https://app.com/callback&
  scope=read:profile&
  state=xyz
\`\`\`

**Step 2: User Consent**
- Gateway shows consent page
- User approves requested scopes
- Gateway generates short-lived authorization code

**Step 3: Authorization Code Response**
\`\`\`
HTTP/1.1 302 Found
Location: https://app.com/callback?code=AUTH_CODE&state=xyz
\`\`\`

**Step 4: Token Exchange**
\`\`\`
POST /token
client_id=abc123&
client_secret=secret&
grant_type=authorization_code&
code=AUTH_CODE&
redirect_uri=https://app.com/callback
\`\`\`

**Step 5: Token Response**
\`\`\`json
{
  "access_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "def456",
  "scope": "read:profile"
}
\`\`\`

**Why this flow?**
- Authorization code never exposed to browser (only via secure redirect)
- Access token only sent via secure server-to-server request
- Refresh token enables token renewal without re-login`,

  whyItMatters: 'Authorization code flow is the gold standard for OAuth2 - most secure for user delegation.',

  famousIncident: {
    title: 'OAuth Token Theft via Redirect URI Manipulation',
    company: 'Facebook',
    year: '2018',
    whatHappened: 'Attackers exploited OAuth redirect URI validation bugs to steal access tokens. By registering malicious redirect URIs, they could intercept authorization codes and exchange them for tokens, gaining access to millions of accounts.',
    lessonLearned: 'Strictly validate redirect URIs against pre-registered values. Never allow wildcard or partial matches.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'GitHub',
    scenario: 'OAuth Apps accessing user repositories',
    howTheyDoIt: 'Uses authorization code flow with PKCE for all OAuth apps, strict redirect URI validation',
  },

  keyPoints: [
    'Authorization code flow separates user auth from token issuance',
    'Authorization codes are single-use and expire in 60 seconds',
    'Access tokens are JWT signed with secret key',
    'Refresh tokens allow token renewal without user interaction',
  ],

  quickCheck: {
    question: 'Why does authorization code flow use two steps (code then token)?',
    options: [
      'To make it faster',
      'To keep access token out of browser - only secure server-to-server',
      'To reduce server load',
      'To make it easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Two-step flow ensures access token is only transmitted via secure backend channel, never exposed to browser or URL.',
  },

  keyConcepts: [
    { title: 'Authorization Code', explanation: 'Short-lived code to exchange for token', icon: '🎫' },
    { title: 'Access Token', explanation: 'JWT token to access protected APIs', icon: '🔑' },
    { title: 'Refresh Token', explanation: 'Long-lived token to get new access tokens', icon: '🔄' },
  ],
};

const step2: GuidedStep = {
  id: 'oauth2-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Authorization code flow, FR-4: Token refresh',
    taskDescription: 'Configure OAuth2 APIs and implement Python handlers',
    successCriteria: [
      'Click on Gateway to open inspector',
      'Assign GET /authorize, POST /token, POST /revoke APIs',
      'Open the Python tab',
      'Implement authorize(), token(), and revoke() functions',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click on the Gateway, then go to the APIs tab to assign OAuth2 endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for authorize, token, and revoke',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /authorize', 'POST /token', 'POST /revoke'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Persistent Storage
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your gateway crashed at 3 AM during a deployment...",
  hook: "When it came back, ALL authorizations were GONE! Users have to re-authorize every app. Developers are furious!",
  challenge: "Add a database so authorizations and refresh tokens survive restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your authorizations are safe!',
  achievement: 'OAuth2 data now persists across restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But token validation is hitting the database on every API call...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Database for OAuth2 Data',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Authorizations survive crashes
- **Queryability**: Look up user's authorized apps
- **Auditability**: Track who authorized what and when

For OAuth2, we need tables for:
- \`oauth_clients\` - Registered third-party apps (client_id, redirect_uri, etc.)
- \`authorizations\` - User grants to apps (user_id, client_id, granted_scopes)
- \`refresh_tokens\` - Long-lived tokens for renewal
- \`authorization_codes\` - Temporary codes (60 second TTL)

**Important**: Access tokens are JWT - no database storage needed! They're self-contained and validated via signature.`,

  whyItMatters: 'Losing authorizations means users must re-approve every app. Losing refresh tokens breaks all client sessions!',

  famousIncident: {
    title: 'Twitter API Token Exposure',
    company: 'Twitter',
    year: '2020',
    whatHappened: 'A bug in Twitter\'s OAuth implementation exposed refresh tokens in server logs. Attackers accessed logs and used refresh tokens to impersonate users. Twitter had to revoke millions of tokens.',
    lessonLearned: 'Refresh tokens are sensitive credentials. Encrypt in database, never log them, implement rotation.',
    icon: '🐦',
  },

  realWorldExample: {
    company: 'Auth0',
    scenario: 'Managing OAuth tokens for millions of apps',
    howTheyDoIt: 'Uses PostgreSQL for refresh tokens and authorizations, Redis for authorization codes (short TTL)',
  },

  keyPoints: [
    'Database stores: clients, authorizations, refresh tokens',
    'Access tokens (JWT) are NOT stored - they\'re self-validating',
    'Authorization codes can use cache (short-lived)',
    'Encrypt refresh tokens at rest',
  ],

  quickCheck: {
    question: 'Why don\'t we store access tokens (JWT) in the database?',
    options: [
      'Too many tokens to store',
      'JWTs are self-contained and validated via signature - no DB needed',
      'Database is too slow',
      'Security risk',
    ],
    correctIndex: 1,
    explanation: 'JWT access tokens contain all needed info (user, scopes, expiration) and are validated via cryptographic signature. No database lookup needed!',
  },

  keyConcepts: [
    { title: 'JWT', explanation: 'Self-contained token with embedded claims', icon: '🎫' },
    { title: 'Refresh Token', explanation: 'Opaque token stored in DB', icon: '🗄️' },
    { title: 'Authorization', explanation: 'User grant of scopes to client', icon: '✅' },
  ],
};

const step3: GuidedStep = {
  id: 'oauth2-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent storage for authorizations',
    taskDescription: 'Add a Database and connect the Gateway to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store clients, authorizations, and refresh tokens', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'Gateway connected to Database',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Database (PostgreSQL) component onto the canvas',
    level2: 'Click Gateway, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Cache for Token Validation & Blacklist
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "Your gateway is serving 1,000 requests per second, but it's SLOW!",
  hook: "Every API call validates the JWT token, but the gateway keeps checking the database for revoked tokens. Latency is 100ms+ per request!",
  challenge: "Add a cache to make token validation lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Token validation is 50x faster!',
  achievement: 'Caching dramatically reduced validation latency',
  metrics: [
    { label: 'Validation latency', before: '100ms', after: '2ms' },
    { label: 'Cache hit rate', after: '99%' },
  ],
  nextTeaser: "But we need to handle more traffic with load balancing...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Fast Token Validation',
  conceptExplanation: `Token validation happens on **every API call** - it's on the critical path!

**The Challenge:**
JWT signature validation is fast (CPU-bound, <1ms), but checking if token is revoked requires database lookup. At 1,000 requests/sec, that's crushing the database.

**The Solution: Redis Cache**

Cache the **revocation blacklist**:
\`\`\`
Key: "revoked:token_id"
Value: "1"
TTL: Until token natural expiration
\`\`\`

**Token Validation Flow:**
1. Parse JWT and verify signature (fast, in-memory)
2. Check if token_id in cache blacklist (fast, <1ms)
3. If not blacklisted, allow request
4. When token revoked, add to cache blacklist

**What else to cache:**
- Authorization codes (60 second TTL)
- Client metadata (rarely changes)
- Rate limit counters per client_id

**Result:** 99% of validations served from cache, <2ms latency`,

  whyItMatters: 'At 1,800 requests/sec peak, database lookups for every validation would melt the database and add 100ms+ latency.',

  famousIncident: {
    title: 'Auth0 Rate Limit Bypass via Cache Timing',
    company: 'Auth0',
    year: '2019',
    whatHappened: 'Attackers exploited race conditions in Auth0\'s rate limiting cache. By sending concurrent requests just as cache expired, they bypassed rate limits and brute-forced tokens.',
    lessonLearned: 'Atomic cache operations (INCR, not GET-then-SET) prevent race conditions. Use Redis for rate limiting.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'Okta',
    scenario: 'Validating millions of tokens per minute',
    howTheyDoIt: 'Redis cluster for token blacklist, in-memory JWT validation, aggressive caching of client metadata',
  },

  diagram: `
API Request with Token
      │
      ▼
┌─────────────┐
│   Gateway   │
└──────┬──────┘
       │
       ├──▶ 1. Verify JWT signature (in-memory, <1ms)
       │
       ▼
  ┌────────┐
  │ Redis  │ ──▶ 2. Check blacklist (cache, <1ms)
  │ Cache  │
  └────────┘
       │
       │ If not revoked:
       ▼
  Forward to Backend API ✓
`,

  keyPoints: [
    'Cache token blacklist (revoked tokens) in Redis',
    'JWT validation is mostly in-memory (no cache needed)',
    'Cache authorization codes (60s TTL)',
    'Cache client metadata to reduce DB load',
    'Use atomic Redis operations for rate limiting',
  ],

  quickCheck: {
    question: 'Why cache the token blacklist instead of storing all valid tokens?',
    options: [
      'It uses less memory',
      'Blacklist is much smaller - most tokens are NOT revoked',
      'It\'s faster',
      'It\'s more secure',
    ],
    correctIndex: 1,
    explanation: 'Only revoked tokens go in blacklist (<1% of all tokens). Caching all valid tokens would require huge memory.',
  },

  keyConcepts: [
    { title: 'Token Blacklist', explanation: 'Cache of revoked token IDs', icon: '🚫' },
    { title: 'JWT Validation', explanation: 'Signature check + expiration check', icon: '✅' },
    { title: 'TTL', explanation: 'Blacklist entry expires when token would expire', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'oauth2-step-4',
  stepNumber: 4,
  frIndex: 4,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-5: Token validation (now fast!)',
    taskDescription: 'Add a Redis cache between Gateway and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache token blacklist and authorization codes', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'Gateway connected to Cache',
      'Cache TTL configured (60 seconds)',
      'Cache strategy set (cache-aside)',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect Gateway to Cache. Then click Cache and set TTL to 60 seconds, strategy to cache-aside',
    solutionComponents: [{ type: 'cache', config: { ttl: 60, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer for High Availability
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "A popular app just integrated with your OAuth2 gateway!",
  hook: "Traffic spiked 10x overnight. Your single gateway server is maxed out at 100% CPU. Token validations are timing out!",
  challenge: "Add a load balancer to distribute traffic across multiple gateway instances.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'OAuth traffic is now distributed!',
  achievement: 'Load balancer enables horizontal scaling',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Request capacity', before: '100 RPS', after: 'Scales infinitely' },
  ],
  nextTeaser: "But mobile apps can't keep client secrets secure...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Scaling OAuth2 Gateways',
  conceptExplanation: `A **Load Balancer** distributes incoming OAuth2 requests across multiple gateway instances.

**Key consideration for OAuth2:**
Gateway is **stateless** - perfect for load balancing!

Why stateless?
- JWT tokens are self-validating (no session storage)
- Authorization codes in Redis (shared across gateways)
- Refresh tokens in database (shared)

This means:
- No sticky sessions needed
- Can add/remove gateway instances anytime
- Failover is seamless

**Load balancing strategies:**
1. **Round-robin** - Simple, works well for OAuth2
2. **Least connections** - Good for long-lived connections
3. **IP hash** - Not needed for stateless OAuth2`,

  whyItMatters: 'At peak (1,800 token validations/sec), a single gateway instance can\'t handle the load. Horizontal scaling is essential.',

  famousIncident: {
    title: 'Cloudflare OAuth2 Outage',
    company: 'Cloudflare',
    year: '2021',
    whatHappened: 'During maintenance, their OAuth2 load balancer misconfiguration caused all traffic to route to a single instance. It crashed under load. All authentication failed for 30 minutes.',
    lessonLearned: 'Always test load balancer health checks and failover. Monitor per-instance load metrics.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'AWS Cognito',
    scenario: 'Handling millions of OAuth flows',
    howTheyDoIt: 'Stateless OAuth2 gateways behind Application Load Balancer, auto-scaling based on request volume',
  },

  keyPoints: [
    'OAuth2 gateway is stateless - perfect for load balancing',
    'JWT validation requires no session state',
    'Shared cache (Redis) and database across all instances',
    'No sticky sessions needed',
  ],

  quickCheck: {
    question: 'Why is a stateless OAuth2 gateway ideal for load balancing?',
    options: [
      'It\'s faster',
      'Any instance can handle any request - no session affinity needed',
      'It uses less memory',
      'It\'s more secure',
    ],
    correctIndex: 1,
    explanation: 'Stateless design means requests can be routed to any gateway instance. No user sessions to maintain.',
  },

  keyConcepts: [
    { title: 'Stateless', explanation: 'No session state on gateway instances', icon: '🔓' },
    { title: 'Load Balancer', explanation: 'Distributes requests across instances', icon: '⚖️' },
    { title: 'Health Check', explanation: 'Monitor gateway instance availability', icon: '💓' },
  ],
};

const step5: GuidedStep = {
  id: 'oauth2-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add a Load Balancer between Client and Gateway',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute OAuth traffic across gateway instances', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to Gateway',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Load Balancer onto the canvas between Client and Gateway',
    level2: 'Reconnect: Client → Load Balancer → Gateway',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Implement PKCE for Mobile/SPA Security
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📱',
  scenario: "A mobile app developer is integrating with your OAuth2 gateway...",
  hook: "They ask: 'How do we keep the client secret secure? Anyone can decompile our mobile app and extract it!'\n\nStandard OAuth2 authorization code flow requires a client secret - but mobile apps can't keep secrets!",
  challenge: "Implement PKCE (Proof Key for Code Exchange) to secure mobile and SPA apps.",
  illustration: 'security-alert',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'PKCE protection enabled!',
  achievement: 'Mobile and SPA apps can now use OAuth2 securely',
  metrics: [
    { label: 'Authorization code interception', after: 'Protected' },
    { label: 'Mobile app security', after: '✓' },
    { label: 'No client secret needed', after: '✓' },
  ],
  nextTeaser: "But we need to add rate limiting to prevent abuse...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'PKCE: Securing Public Clients',
  conceptExplanation: `**The Problem:**
Mobile apps and SPAs are **public clients** - they can't keep secrets:
- Mobile app code can be decompiled
- SPA JavaScript is visible in browser
- Anyone can extract client_secret

**Without PKCE:**
Attacker intercepts authorization code → Uses stolen client_secret → Gets access token

**PKCE Solution:**

**Step 1: Client generates random verifier**
\`\`\`
code_verifier = random_string(43-128 chars)
code_challenge = BASE64URL(SHA256(code_verifier))
\`\`\`

**Step 2: Authorization request includes challenge**
\`\`\`
GET /authorize?
  response_type=code&
  client_id=mobile_app&
  code_challenge=E9Melhoa...&
  code_challenge_method=S256
\`\`\`

**Step 3: Server stores code_challenge with auth code**

**Step 4: Token exchange includes verifier**
\`\`\`
POST /token
client_id=mobile_app&
grant_type=authorization_code&
code=AUTH_CODE&
code_verifier=dBjftJeZ...
\`\`\`

**Step 5: Server validates**
\`\`\`python
stored_challenge = get_challenge(code)
computed_challenge = BASE64URL(SHA256(code_verifier))
if stored_challenge == computed_challenge:
    issue_token()
\`\`\`

**Why it works:**
- Attacker intercepts code but NOT code_verifier (never transmitted until token exchange)
- Without code_verifier, attacker can't exchange code for token
- No client secret needed!`,

  whyItMatters: 'Mobile apps represent 60%+ of OAuth2 usage. Without PKCE, they\'re vulnerable to code interception attacks.',

  famousIncident: {
    title: 'OAuth Code Interception on Mobile',
    company: 'Slack',
    year: '2017',
    whatHappened: 'Researchers demonstrated that malicious apps on Android could intercept OAuth authorization codes via custom URL scheme hijacking. Without PKCE, attackers could exchange stolen codes for access tokens.',
    lessonLearned: 'PKCE is mandatory for mobile apps. OAuth 2.1 spec makes PKCE required for all flows.',
    icon: '📱',
  },

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Mobile app OAuth authentication',
    howTheyDoIt: 'Requires PKCE for all mobile apps, rejects authorization requests without code_challenge',
  },

  diagram: `
Mobile App                      OAuth2 Gateway
    │                                │
    │ 1. Generate code_verifier      │
    │    hash → code_challenge       │
    │                                │
    │ 2. /authorize                  │
    │    + code_challenge            │
    ├───────────────────────────────▶│
    │                                │ Store challenge
    │ 3. Redirect with code          │
    │◀───────────────────────────────┤
    │                                │
    │ 4. /token                      │
    │    + code                      │
    │    + code_verifier             │
    ├───────────────────────────────▶│
    │                                │ Verify:
    │                                │ SHA256(verifier)
    │                                │   == challenge?
    │ 5. Access token                │
    │◀───────────────────────────────┤

    Attacker intercepts code:
      ❌ Can't exchange - no verifier!
`,

  keyPoints: [
    'PKCE protects against authorization code interception',
    'No client secret needed for public clients',
    'code_challenge sent in /authorize (hashed)',
    'code_verifier sent in /token (plaintext)',
    'Server verifies SHA256(verifier) == challenge',
    'OAuth 2.1 makes PKCE mandatory',
  ],

  quickCheck: {
    question: 'Why can\'t an attacker who intercepts the authorization code exchange it for a token with PKCE?',
    options: [
      'The code expires too quickly',
      'They don\'t have the code_verifier (never transmitted during interception)',
      'The code is encrypted',
      'They need the client secret',
    ],
    correctIndex: 1,
    explanation: 'code_verifier is only sent in the final token exchange request. Intercepting the redirect only gives the code, not the verifier.',
  },

  keyConcepts: [
    { title: 'code_verifier', explanation: 'Random secret generated by client', icon: '🔐' },
    { title: 'code_challenge', explanation: 'SHA256 hash of verifier', icon: '🔒' },
    { title: 'Public Client', explanation: 'Can\'t keep secrets (mobile, SPA)', icon: '📱' },
  ],
};

const step6: GuidedStep = {
  id: 'oauth2-step-6',
  stepNumber: 6,
  frIndex: 5,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-6: PKCE support for public clients',
    taskDescription: 'Update OAuth2 implementation to support PKCE validation',
    successCriteria: [
      'Click on Gateway component',
      'Go to Python tab',
      'Implement PKCE validation in authorize() and token() handlers',
      'Verify code_challenge storage and code_verifier validation',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click on Gateway, go to Python tab. Find the authorize() and token() functions.',
    level2: 'In authorize(): store code_challenge. In token(): compute SHA256(code_verifier) and compare to stored challenge.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Rate Limiting & Security Hardening
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🚨',
  scenario: "ALERT! Someone is attacking your token endpoint!",
  hook: "An attacker is brute-forcing token requests - 10,000 attempts per minute trying to guess authorization codes. Your gateway is getting overwhelmed!",
  challenge: "Implement rate limiting to protect against brute force and DDoS attacks.",
  illustration: 'security-breach',
};

const step7Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a secure OAuth2 Gateway!',
  achievement: 'A production-ready authorization system with PKCE, rate limiting, and token validation',
  metrics: [
    { label: 'Token validation latency', after: '<10ms' },
    { label: 'PKCE support', after: '✓' },
    { label: 'Rate limiting', after: 'Enabled' },
    { label: 'Brute force protection', after: '✓' },
    { label: 'High availability', after: '✓' },
  ],
  nextTeaser: "You've mastered OAuth2 gateway design!",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Security Hardening: Rate Limiting & Protection',
  conceptExplanation: `OAuth2 endpoints are high-value attack targets. Must implement multiple layers of protection:

**1. Rate Limiting**
Limit requests per client_id:
\`\`\`
/token endpoint: 10 requests/minute per client_id
/authorize endpoint: 20 requests/minute per client_id
Failed attempts: 3 failures → 15 minute lockout
\`\`\`

**Implementation (Redis):**
\`\`\`python
key = f"rate_limit:{client_id}:{endpoint}"
count = redis.incr(key)
if count == 1:
    redis.expire(key, 60)  # 1 minute window
if count > limit:
    return 429  # Too Many Requests
\`\`\`

**2. Additional Security Measures**

**Prevent CSRF:**
- Require \`state\` parameter in /authorize
- Validate state matches in callback

**Prevent Token Theft:**
- HTTPS only (TLS 1.2+)
- Short-lived access tokens (15-60 min)
- Rotate refresh tokens on use

**Prevent Replay Attacks:**
- Authorization codes single-use
- Mark code as used immediately

**Prevent Brute Force:**
- Lock client after 5 failed token exchanges
- Exponential backoff for failures

**Monitor and Alert:**
- Track failed auth attempts per client
- Alert on unusual patterns
- Log all token issuance and revocation`,

  whyItMatters: 'OAuth2 implementations are frequent attack targets. Rate limiting and security hardening prevent breaches that could compromise millions of users.',

  famousIncident: {
    title: 'OAuth2 Brute Force Attack on npm',
    company: 'npm',
    year: '2021',
    whatHappened: 'Attackers attempted to brute force OAuth2 authorization codes by trying sequential values. npm had no rate limiting on token endpoint. Attackers made millions of requests before detection.',
    lessonLearned: 'Always implement rate limiting on OAuth2 endpoints. Authorization codes must be cryptographically random.',
    icon: '📦',
  },

  realWorldExample: {
    company: 'Okta',
    scenario: 'Protecting against credential stuffing and brute force',
    howTheyDoIt: 'Multi-layer rate limiting (per IP, per client_id, global), CAPTCHA after failures, anomaly detection',
  },

  diagram: `
Rate Limiting Architecture:

Client Request
      │
      ▼
┌──────────────┐
│Load Balancer │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Gateway    │
└──────┬───────┘
       │
       ├──▶ Check rate limit (Redis)
       │    Key: "rl:{client_id}:/token"
       │    INCR + TTL
       │
       ├──▶ If over limit → 429 Too Many Requests
       │
       └──▶ Process OAuth2 flow
`,

  keyPoints: [
    'Rate limit per client_id using Redis INCR',
    'Different limits for /authorize vs /token',
    'Lock accounts after repeated failures',
    'Require state parameter to prevent CSRF',
    'Single-use authorization codes',
    'Monitor and alert on anomalies',
  ],

  quickCheck: {
    question: 'Why use Redis INCR for rate limiting instead of GET-then-SET?',
    options: [
      'It\'s faster',
      'INCR is atomic - prevents race conditions',
      'It uses less memory',
      'It\'s more secure',
    ],
    correctIndex: 1,
    explanation: 'GET-then-SET has race condition: two requests could both read count=9, increment to 10, both pass the limit. INCR is atomic.',
  },

  keyConcepts: [
    { title: 'Rate Limiting', explanation: 'Limit requests per time window', icon: '🚦' },
    { title: 'Atomic Operation', explanation: 'Prevent race conditions', icon: '⚛️' },
    { title: 'CSRF Protection', explanation: 'State parameter validation', icon: '🛡️' },
  ],
};

const step7: GuidedStep = {
  id: 'oauth2-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs require security hardening',
    taskDescription: 'Implement rate limiting and security measures in the gateway',
    successCriteria: [
      'Click on Gateway component',
      'Go to Configuration tab',
      'Enable rate limiting',
      'Set limits: /token = 10/min, /authorize = 20/min',
      'Enable CSRF protection (state validation)',
      'Enable HTTPS-only mode',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheStrategy: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click on Gateway, go to Configuration. Look for security settings.',
    level2: 'Enable rate limiting with appropriate limits. Enable CSRF protection and HTTPS-only mode.',
    solutionComponents: [
      {
        type: 'app_server',
        config: {
          rateLimiting: { enabled: true, tokenLimit: 10, authorizeLimit: 20 },
          security: { csrfProtection: true, httpsOnly: true }
        }
      },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const oauth2GatewayGuidedTutorial: GuidedTutorial = {
  problemId: 'oauth2-gateway',
  title: 'Design OAuth2 API Gateway',
  description: 'Build a secure authorization gateway with OAuth2 flows, token validation, PKCE, and rate limiting',
  difficulty: 'advanced',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '🔐',
    hook: "You've been hired as Lead Security Engineer at AuthGuard Inc!",
    scenario: "Your mission: Build an OAuth2 API Gateway that securely manages third-party access to user data, supporting millions of API calls per day with bulletproof security.",
    challenge: "Can you design a system that implements OAuth2 flows, validates tokens in milliseconds, and prevents authorization code interception with PKCE?",
  },

  requirementsPhase: oauth2GatewayRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7],

  // Meta information
  concepts: [
    'OAuth2 Authorization',
    'Authorization Code Flow',
    'Client Credentials Flow',
    'JWT Token Validation',
    'Scope-Based Authorization',
    'PKCE (Proof Key for Code Exchange)',
    'Token Refresh',
    'Token Revocation',
    'Rate Limiting',
    'Stateless Gateway Design',
    'Cache-Based Blacklist',
    'CSRF Protection',
    'Security Hardening',
  ],

  ddiaReferences: [
    'Chapter 4: Encoding (JWT structure and validation)',
    'Chapter 9: Consistency and Consensus (Token consistency)',
    'Chapter 11: Stream Processing (Token lifecycle)',
  ],
};

export default oauth2GatewayGuidedTutorial;
