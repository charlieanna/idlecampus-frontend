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
 * Auth Token Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 7-step tutorial that teaches authentication system design
 * while building a JWT caching and session management system.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-7: Scale with NFRs (cache, token revocation, distributed sessions)
 *
 * Key Concepts:
 * - JWT token validation and caching
 * - Session management at scale
 * - Token revocation strategies
 * - Redis for distributed sessions
 * - Security vs performance trade-offs
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const authTokenCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an authentication token cache system for a high-traffic application",

  interviewer: {
    name: 'Alex Rivera',
    role: 'Staff Security Engineer',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-auth',
      category: 'functional',
      question: "What's the core authentication flow users need?",
      answer: "Users need to:\n\n1. **Login** - Authenticate with credentials and receive a JWT token\n2. **Validate tokens** - Every API request includes a JWT that must be validated\n3. **Refresh tokens** - Get new tokens before they expire\n4. **Logout** - Invalidate their session immediately",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Authentication is about proving identity (login) and maintaining that proof (token validation)",
    },
    {
      id: 'token-type',
      category: 'functional',
      question: "What type of tokens should we use and why?",
      answer: "We'll use **JWT (JSON Web Tokens)** because:\n- Self-contained: contains user info, no DB lookup needed\n- Stateless: can be validated without server state\n- Industry standard: well-tested libraries available\n- Supports expiration and claims",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "JWTs enable stateless authentication - validate without hitting the database every time",
    },
    {
      id: 'revocation-need',
      category: 'functional',
      question: "What happens if a user's token is stolen? Can we revoke it?",
      answer: "Yes! Token revocation is CRITICAL for security:\n- User logs out → token must be invalidated immediately\n- Security breach → revoke all tokens for compromised accounts\n- Admin action → force user re-login\n\nWe'll maintain a revocation list that's checked on every validation.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Stateless JWTs are great, but you need a way to revoke them for security",
    },
    {
      id: 'session-management',
      category: 'clarification',
      question: "Should users be able to see and manage their active sessions?",
      answer: "Yes! Users should see:\n- All devices/browsers where they're logged in\n- Last activity time for each session\n- Ability to logout from a specific device\n\nThis is important for security awareness.",
      importance: 'important',
      insight: "Session management gives users control and visibility into their security",
    },
    {
      id: 'token-expiry',
      category: 'clarification',
      question: "How long should tokens be valid?",
      answer: "**Access tokens**: 15 minutes (short-lived for security)\n**Refresh tokens**: 7 days (longer-lived, stored securely)\n\nShort access token lifetime limits damage if stolen.",
      importance: 'critical',
      insight: "Balance security (short expiry) with UX (don't force re-login constantly)",
    },

    // SCALE & NFRs
    {
      id: 'throughput-validation',
      category: 'throughput',
      question: "How many token validations per second do we need to handle?",
      answer: "Every API request requires token validation. With 100M daily active users making 50 API calls/day average:\n\n5 billion validations/day",
      importance: 'critical',
      calculation: {
        formula: "5B ÷ 86,400 sec = 57,870 validations/sec",
        result: "~58K validations/sec average, ~175K peak (3x)",
      },
      learningPoint: "Token validation is THE bottleneck - must be extremely fast",
    },
    {
      id: 'throughput-logins',
      category: 'throughput',
      question: "How many logins per day?",
      answer: "Users login 1-2 times per day on average:\n\n150 million logins/day",
      importance: 'critical',
      calculation: {
        formula: "150M ÷ 86,400 sec = 1,736 logins/sec",
        result: "~1,700 logins/sec average, ~5,200 peak",
      },
      learningPoint: "Login is write-heavy (create sessions), validation is read-heavy",
    },
    {
      id: 'latency-validation',
      category: 'latency',
      question: "How fast should token validation be?",
      answer: "Token validation happens on EVERY API request, so it must be:\n\n**p99 < 10ms**\n\nAny slower and it adds noticeable latency to all API calls.",
      importance: 'critical',
      learningPoint: "Validation latency directly impacts ALL API response times",
    },
    {
      id: 'consistency-revocation',
      category: 'consistency',
      question: "When a user logs out, how quickly must their token be revoked?",
      answer: "**Immediately** - within 1 second maximum.\n\nImagine: user logs out because they think their laptop was stolen. If tokens work for another 5 minutes, the thief has access!",
      importance: 'critical',
      learningPoint: "Security events (logout, revocation) require strong consistency",
    },
    {
      id: 'distributed-sessions',
      category: 'scalability',
      question: "If we have multiple app servers, how do they share session state?",
      answer: "We need **distributed session storage**:\n- Can't use server memory (sessions lost on restart, not shared)\n- Must use shared cache (Redis) or database\n- All servers see same session state\n- Changes propagate instantly",
      importance: 'critical',
      insight: "Distributed systems require centralized session storage",
    },
    {
      id: 'security-jwt',
      category: 'security',
      question: "How do we prevent JWT tampering or forgery?",
      answer: "JWTs are cryptographically signed:\n1. Sign token with secret key on creation\n2. Validate signature on every request\n3. If signature invalid → reject token\n4. Use RS256 (asymmetric) for multi-service architectures",
      importance: 'critical',
      learningPoint: "JWT signatures prevent tampering - verify on every validation",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-auth', 'token-type', 'revocation-need'],
  criticalFRQuestionIds: ['core-auth', 'token-type'],
  criticalScaleQuestionIds: ['throughput-validation', 'latency-validation', 'consistency-revocation'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: User login with JWT issuance',
      description: 'Users authenticate with credentials and receive a signed JWT access token',
      emoji: '🔐',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Fast token validation',
      description: 'Validate JWT signature and claims on every API request (< 10ms p99)',
      emoji: '✅',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Token refresh',
      description: 'Allow users to refresh expired access tokens using refresh tokens',
      emoji: '🔄',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Token revocation',
      description: 'Immediately invalidate tokens on logout or security events',
      emoji: '🚫',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million',
    writesPerDay: '150 million logins',
    readsPerDay: '5 billion validations',
    peakMultiplier: 3,
    readWriteRatio: '33:1',
    calculatedWriteRPS: { average: 1736, peak: 5208 },
    calculatedReadRPS: { average: 57870, peak: 173610 },
    maxPayloadSize: '~2KB (JWT token)',
    storagePerRecord: '~500 bytes (session)',
    storageGrowthPerYear: '~150GB (sessions)',
    redirectLatencySLA: 'p99 < 10ms (validation)',
    createLatencySLA: 'p99 < 100ms (login)',
  },

  architecturalImplications: [
    '✅ Extremely read-heavy (33:1) → Aggressive caching is CRITICAL',
    '✅ 175K validations/sec peak → Cache must handle all reads',
    '✅ p99 < 10ms validation → In-memory cache required (Redis)',
    '✅ Immediate revocation → Cache invalidation on logout',
    '✅ Distributed servers → Centralized session store',
    '✅ Security critical → JWT signature validation always',
  ],

  outOfScope: [
    'Multi-factor authentication (MFA)',
    'OAuth2/Social login',
    'Password reset flows',
    'Account lockout after failed attempts',
    'SAML/Enterprise SSO',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple login flow that issues JWTs and validates them. Once it works, we'll add caching for speed and revocation for security. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Auth Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔐',
  scenario: "Welcome to AuthTech Inc! You're building an authentication system for a major social network.",
  hook: "Users need to login and access their data. But right now, there's no way for them to authenticate!",
  challenge: "Set up the foundation: connect clients to your authentication server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your auth system is online!',
  achievement: 'Users can now send authentication requests',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can accept requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to issue or validate tokens yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Authentication Architecture: The Foundation',
  conceptExplanation: `Every authentication system starts with a **Client** talking to an **Auth Server**.

When a user logs in:
1. Client sends credentials (username, password) to Auth Server
2. Auth Server validates credentials
3. If valid: issue a JWT token
4. Client includes this token in all future API requests

This is the foundation of modern web authentication!`,

  whyItMatters: 'Without this connection, users cannot prove their identity or access protected resources.',

  keyPoints: [
    'Client = user\'s browser or mobile app',
    'Auth Server = validates credentials and issues tokens',
    'HTTPS required for security (credentials must be encrypted)',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'User\'s application making auth requests', icon: '📱' },
    { title: 'Auth Server', explanation: 'Issues and validates authentication tokens', icon: '🔐' },
    { title: 'JWT', explanation: 'JSON Web Token - signed, self-contained token', icon: '🎫' },
  ],
};

const step1: GuidedStep = {
  id: 'auth-cache-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Foundation for all authentication FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users authenticating', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles authentication logic', displayName: 'Auth Server' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'App Server component added to canvas',
      'Client connected to App Server',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server from the component palette onto the canvas',
    level2: 'Click the Client, then click the App Server to create a connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Authentication APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your auth server is connected, but it's an empty shell!",
  hook: "A user tried to login but got a 404. The server doesn't know how to handle authentication requests.",
  challenge: "Write the Python code to handle login, token validation, and logout.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Authentication APIs are live!',
  achievement: 'You implemented core authentication functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can issue tokens', after: '✓' },
    { label: 'Can validate tokens', after: '✓' },
    { label: 'Can revoke tokens', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all sessions are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'JWT Authentication: Login, Validate, Revoke',
  conceptExplanation: `Your auth server needs handlers for the authentication lifecycle:

**1. Login (POST /api/v1/auth/login)**
- Verify username/password
- Create JWT with user claims: \`{user_id, email, exp}\`
- Sign JWT with secret key
- Return token to client

**2. Validate (GET /api/v1/auth/validate)**
- Extract JWT from Authorization header
- Verify signature (prevent tampering)
- Check expiration
- Check revocation list
- Return user info if valid

**3. Logout (POST /api/v1/auth/logout)**
- Add token to revocation list
- Token becomes invalid immediately

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'These handlers are the core of your authentication system. If they\'re buggy, your entire app is insecure!',

  famousIncident: {
    title: 'Okta Auth Bypass Bug',
    company: 'Okta',
    year: '2022',
    whatHappened: 'A bug in Okta\'s authentication validation allowed attackers to bypass login by sending a username with a very long value (> 52 characters). This broke their cache key generation and allowed unauthorized access to thousands of corporate networks.',
    lessonLearned: 'Authentication code must be bulletproof. Always validate inputs, test edge cases, and use well-tested libraries.',
    icon: '🔓',
  },

  realWorldExample: {
    company: 'Auth0',
    scenario: 'Validating millions of tokens per second',
    howTheyDoIt: 'Uses highly optimized JWT validation with aggressive caching of public keys and signature verification',
  },

  keyPoints: [
    'JWT contains user claims (id, email, expiration)',
    'Always verify signature - prevents token forgery',
    'Check expiration - reject expired tokens',
    'Maintain revocation list for logout/security',
  ],

  quickCheck: {
    question: 'Why do we verify the JWT signature on every validation?',
    options: [
      'To check if the token has expired',
      'To prevent users from forging tokens with fake claims',
      'To improve performance',
      'To check if the user is logged in',
    ],
    correctIndex: 1,
    explanation: 'JWT signatures prevent tampering. Without verification, anyone could create a fake token claiming to be any user.',
  },

  keyConcepts: [
    { title: 'JWT Claims', explanation: 'Data embedded in the token (user_id, exp, etc.)', icon: '📋' },
    { title: 'Signature', explanation: 'Cryptographic proof token hasn\'t been tampered with', icon: '✍️' },
    { title: 'Revocation List', explanation: 'List of invalidated tokens (logout, security)', icon: '🚫' },
  ],
};

const step2: GuidedStep = {
  id: 'auth-cache-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Login, FR-2: Validate, FR-4: Revoke',
    taskDescription: 'Configure APIs and implement Python handlers for authentication',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/auth/login, GET /api/v1/auth/validate, POST /api/v1/auth/logout APIs',
      'Open the Python tab',
      'Implement login(), validate_token(), and logout() functions',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign authentication endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for login, validate_token, and logout',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for User Credentials and Sessions
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your auth server crashed and restarted at 3 AM...",
  hook: "ALL users were logged out! Their sessions vanished. Revoked tokens are working again! This is a security nightmare!",
  challenge: "Add a database to persist user credentials, sessions, and revocation lists.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Auth data is now safe!',
  achievement: 'User sessions and revocation lists survive server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Session durability', after: '100%' },
    { label: 'Revocation durability', after: '100%' },
  ],
  nextTeaser: "But validating 175K tokens/second is hammering the database...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Are Critical for Auth',
  conceptExplanation: `For authentication systems, losing data is a **security catastrophe**.

A **database** provides:
- **User credentials**: Hashed passwords, email, account info
- **Active sessions**: Which users are logged in, from which devices
- **Revocation list**: Tokens that have been invalidated
- **Audit trail**: Track login attempts, suspicious activity

For Auth systems, we need tables for:
- \`users\` - User accounts and hashed passwords
- \`sessions\` - Active user sessions with metadata
- \`revoked_tokens\` - JWTs that have been invalidated
- \`login_attempts\` - Audit trail for security`,

  whyItMatters: 'Without persistence:\n1. Users logged out on server restart\n2. Revoked tokens become valid again (SECURITY RISK!)\n3. No audit trail for breaches\n4. Can\'t track suspicious login patterns',

  famousIncident: {
    title: 'Uber Session Hijacking',
    company: 'Uber',
    year: '2016',
    whatHappened: 'Uber\'s authentication system had a vulnerability where session tokens weren\'t properly invalidated. Attackers could steal session cookies and maintain access even after users logged out. 57 million accounts were compromised.',
    lessonLearned: 'Session management and token revocation must be bulletproof. Store revocation state persistently.',
    icon: '🚗',
  },

  realWorldExample: {
    company: 'Auth0',
    scenario: 'Managing sessions for millions of users',
    howTheyDoIt: 'Uses PostgreSQL for user data and sessions with Redis for high-speed token validation caching',
  },

  keyPoints: [
    'Store user credentials (hashed passwords) in database',
    'Track active sessions for each user',
    'Maintain revocation list for invalidated tokens',
    'Never store passwords in plain text - always hash',
  ],

  quickCheck: {
    question: 'What happens to revoked tokens if in-memory data is lost?',
    options: [
      'They stay revoked',
      'They become valid again - MAJOR security risk!',
      'Users must login again',
      'Tokens auto-expire',
    ],
    correctIndex: 1,
    explanation: 'Without persistent storage, revoked tokens become valid again after restart - a critical security vulnerability!',
  },

  keyConcepts: [
    { title: 'Session Persistence', explanation: 'Sessions survive server restarts', icon: '💾' },
    { title: 'Revocation List', explanation: 'Invalidated tokens stored durably', icon: '🚫' },
    { title: 'Password Hashing', explanation: 'Never store plain text passwords', icon: '🔐' },
  ],
};

const step3: GuidedStep = {
  id: 'auth-cache-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent, secure storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store users, sessions, revocation list', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'App Server connected to Database',
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
    level2: 'Click App Server, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Cache for Token Validation
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐢',
  scenario: "Your auth system is getting crushed! 175K token validations per second!",
  hook: "EVERY API request validates a token by checking the database. Response times went from 50ms to 500ms. Users are complaining about lag!",
  challenge: "Add a Redis cache to validate tokens in < 10ms without hitting the database.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Token validation is now lightning fast!',
  achievement: 'Cache reduced validation latency by 50x',
  metrics: [
    { label: 'Validation latency', before: '200ms', after: '4ms' },
    { label: 'Database load', before: '175K queries/sec', after: '5K queries/sec' },
    { label: 'Cache hit rate', after: '97%' },
  ],
  nextTeaser: "Nice! But what happens when users logout?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Token Caching: Speed at Scale',
  conceptExplanation: `**The Problem**: With 175K validations/sec, every request hitting the database is too slow.

**The Solution**: Cache JWT validation results in Redis

**How it works**:
1. User makes API request with JWT token
2. Extract token hash as cache key
3. Check cache: Is this token valid?
4. **Cache HIT**: Return immediately (2-5ms) ✓
5. **Cache MISS**: Validate token, check DB, store in cache (100ms)

**What to cache**:
- Token → User mapping
- Token expiration time
- Token revocation status

**Cache invalidation**:
- Set TTL = token expiration time
- On logout: delete token from cache immediately`,

  whyItMatters: 'Without caching, token validation becomes the bottleneck for EVERY API request. At 175K validations/sec, the database melts.',

  famousIncident: {
    title: 'Twitter Auth Cache Stampede',
    company: 'Twitter',
    year: '2013',
    whatHappened: 'Twitter\'s auth cache cluster failed during a traffic spike. All token validations hit the database simultaneously. Database overloaded, entire API went down for 2 hours. Users couldn\'t tweet, view timelines, or login.',
    lessonLearned: 'Caching for auth validation isn\'t optional at scale - it\'s critical infrastructure.',
    icon: '🐦',
  },

  realWorldExample: {
    company: 'GitHub',
    scenario: 'Handling millions of API requests per minute',
    howTheyDoIt: 'Caches token validation results in Redis with 5-minute TTL, reducing database load by 95%',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ Auth Server │ ──▶ │ Redis │     │ Database │
│  API   │     │  (validate) │     │ Cache │     │          │
└────────┘     └─────────────┘     └───┬───┘     └────┬─────┘
                                       │              │
                            Cache Hit? │              │ Cache Miss?
                            Return     │              │ Validate
                            instantly! ─┘              │ Store in cache
                            (97% of requests)          └─ (3% of requests)
`,

  keyPoints: [
    'Cache token validation results, not just user data',
    'Use token hash as cache key for security',
    'Set TTL to token expiration time',
    'On logout: invalidate cache immediately',
    '97%+ cache hit rate achievable',
  ],

  quickCheck: {
    question: 'Why cache token validation instead of always verifying the signature?',
    options: [
      'Signature verification is too complex',
      'Signature verification + DB checks are slow at 175K req/sec',
      'Caching is more secure',
      'JWTs don\'t have signatures',
    ],
    correctIndex: 1,
    explanation: 'At scale, even fast signature verification + DB revocation checks become a bottleneck. Caching validated tokens is 50x faster.',
  },

  keyConcepts: [
    { title: 'Token Hash', explanation: 'SHA-256 hash of JWT used as cache key', icon: '🔑' },
    { title: 'Cache TTL', explanation: 'Auto-expire cached tokens when JWT expires', icon: '⏰' },
    { title: 'Invalidation', explanation: 'Remove token from cache on logout', icon: '🗑️' },
  ],
};

const step4: GuidedStep = {
  id: 'auth-cache-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Fast token validation (< 10ms p99)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache token validation results', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
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
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect App Server to Cache for fast token validation',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer for High Availability
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your app just went viral! Traffic spiked 10x overnight!",
  hook: "Your single auth server is at 100% CPU. Login requests are timing out. Users can't authenticate!",
  challenge: "Add a load balancer to distribute authentication traffic across multiple servers.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Authentication load is now distributed!',
  achievement: 'Load balancer enables horizontal scaling',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Auth capacity', before: '5K TPS', after: 'Ready to scale' },
  ],
  nextTeaser: "But we still need to configure multiple app server instances...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Distribute Auth Load',
  conceptExplanation: `A **Load Balancer** distributes authentication requests across multiple auth servers.

**Why it's critical for auth**:
- **No single point of failure** - if one server crashes, others continue
- **Horizontal scaling** - add more servers during peak times
- **Session persistence** - not needed! JWTs are stateless
- **Health checks** - route around failed servers automatically

**For auth, load balancers**:
- Use round-robin or least-connections
- Don't need sticky sessions (JWTs are stateless)
- Automatically remove unhealthy servers
- Enable zero-downtime deploys`,

  whyItMatters: 'At peak (5K logins/sec + 175K validations/sec), a single server can\'t handle the load. Auth failures = users locked out of your entire application.',

  famousIncident: {
    title: 'PlayStation Network Auth Outage',
    company: 'Sony',
    year: '2011',
    whatHappened: 'PSN\'s authentication servers were overwhelmed during a traffic spike from a new game release. Single server architecture couldn\'t scale. 77 million users were locked out for 23 days. Cost Sony $171 million.',
    lessonLearned: 'Auth infrastructure must be horizontally scalable with load balancers from day one.',
    icon: '🎮',
  },

  realWorldExample: {
    company: 'Okta',
    scenario: 'Handling global authentication traffic',
    howTheyDoIt: 'Uses multiple layers of load balancers with geographic routing and auto-scaling',
  },

  keyPoints: [
    'Distribute auth requests across multiple servers',
    'Stateless JWTs = no sticky sessions needed',
    'Health checks detect and route around failures',
    'Critical for handling login spikes',
  ],

  quickCheck: {
    question: 'Why don\'t we need sticky sessions for JWT authentication?',
    options: [
      'Load balancers don\'t support sticky sessions',
      'JWTs are stateless - any server can validate them',
      'Sticky sessions are slower',
      'We use cookies instead',
    ],
    correctIndex: 1,
    explanation: 'JWTs are self-contained and stateless. Any auth server can validate any JWT without needing session affinity.',
  },

  keyConcepts: [
    { title: 'Stateless Auth', explanation: 'JWTs can be validated by any server', icon: '🔄' },
    { title: 'Health Checks', explanation: 'Monitor server availability', icon: '💓' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers for more capacity', icon: '📈' },
  ],
};

const step5: GuidedStep = {
  id: 'auth-cache-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add a Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute auth traffic across servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
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
    level1: 'Drag a Load Balancer onto the canvas between Client and App Server',
    level2: 'Reconnect: Client → Load Balancer → App Server',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Database Replication for Session Durability
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚠️',
  scenario: "CRITICAL ALERT! Your auth database crashed for 5 minutes last night!",
  hook: "During that time:\n- Nobody could login\n- All API requests failed (couldn't validate tokens)\n- Millions of users locked out\n- Your SLA is blown",
  challenge: "Add database replication so authentication never goes down.",
  illustration: 'database-failure',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Auth data is now fault-tolerant!',
  achievement: 'Database replication ensures zero downtime',
  metrics: [
    { label: 'Database availability', before: '99.5%', after: '99.99%' },
    { label: 'Failover time', before: 'Manual', after: 'Automatic (< 30s)' },
    { label: 'Read capacity', before: '1x', after: '3x' },
  ],
  nextTeaser: "Perfect! But we need to handle even more traffic...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Zero Downtime Auth',
  conceptExplanation: `For authentication systems, database downtime = complete application outage.

**Single Leader Replication**:
- **Primary**: Handles all writes (login, logout, revocation)
- **Replicas**: Handle read queries (user lookups, session checks)
- **Automatic failover**: Promote replica if primary fails
- **Read scaling**: Route read queries to replicas

**For Auth systems**:
- Write: Login, logout, token revocation
- Read: User info lookups, session validation
- Read-to-write ratio: ~10:1
- Replicas reduce database load significantly

**Replication mode**:
- Use **synchronous** for revocation writes (security critical)
- Use **asynchronous** for session metadata (acceptable delay)`,

  whyItMatters: 'Auth database down = entire application unusable. Users can\'t login, can\'t access features, can\'t do anything. Replication prevents this catastrophe.',

  famousIncident: {
    title: 'GitHub Auth Database Outage',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'Their MySQL primary crashed and automatic failover failed. Authentication was down for 24 hours. Developers worldwide couldn\'t access repositories, push code, or collaborate. Massive productivity loss.',
    lessonLearned: 'Auth databases MUST have tested automatic failover. Practice failover drills regularly.',
    icon: '🐙',
  },

  realWorldExample: {
    company: 'Auth0',
    scenario: 'Zero tolerance for auth downtime',
    howTheyDoIt: 'Uses PostgreSQL with 3+ replicas across availability zones, automatic failover in < 30 seconds',
  },

  keyPoints: [
    'Primary handles writes, replicas handle reads',
    'Automatic failover promotes replica on primary failure',
    'Reduces read load on primary database',
    'Minimum 2 replicas for high availability',
  ],

  quickCheck: {
    question: 'Why is database replication critical for authentication?',
    options: [
      'It makes queries faster',
      'Auth database down = entire application unusable',
      'It reduces costs',
      'It improves security',
    ],
    correctIndex: 1,
    explanation: 'Without a working auth database, users can\'t login or validate tokens - the entire application becomes inaccessible.',
  },

  keyConcepts: [
    { title: 'Primary/Replica', explanation: 'Primary writes, replicas read', icon: '🔄' },
    { title: 'Failover', explanation: 'Automatic promotion on primary failure', icon: '🔀' },
    { title: 'Read Scaling', explanation: 'Distribute reads across replicas', icon: '📊' },
  ],
};

const step6: GuidedStep = {
  id: 'auth-cache-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs require zero-downtime guarantees',
    taskDescription: 'Enable database replication with at least 2 replicas',
    successCriteria: [
      'Click on the Database component',
      'Go to Configuration tab',
      'Enable replication',
      'Set replica count to 2 or more',
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
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Click on the Database, then find the replication settings in Configuration',
    level2: 'Enable replication and set replicas to 2+ for high availability',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Scale App Servers and Optimize Cache Strategy
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🚀',
  scenario: "Final optimization! You have the architecture, but it needs tuning.",
  hook: "Traffic keeps growing: 200K validations/sec at peak. Time to optimize for production scale.",
  challenge: "Configure multiple app server instances and optimize your cache strategy for maximum performance.",
  illustration: 'final-optimization',
};

const step7Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'You built a production-grade auth system!',
  achievement: 'Handles 200K+ validations/sec with < 10ms latency',
  metrics: [
    { label: 'App Server instances', before: '1', after: '3+' },
    { label: 'Validation capacity', before: '50K/sec', after: '200K/sec' },
    { label: 'p99 latency', after: '< 10ms' },
    { label: 'Cache hit rate', after: '97%' },
    { label: 'Availability', after: '99.99%' },
  ],
  nextTeaser: "Congratulations! You've mastered authentication system design!",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Production Optimization: Scale and Cache Strategy',
  conceptExplanation: `**Final optimizations for production**:

**1. Multiple App Server Instances**
- Configure 3+ instances behind load balancer
- Auto-scaling based on CPU/traffic
- Each instance can handle 50K validations/sec
- Total capacity: 200K+ validations/sec

**2. Cache Strategy Optimization**
- **Strategy**: Cache-aside (check cache first)
- **TTL**: Match JWT expiration (15 minutes)
- **Invalidation**: Immediate on logout
- **Keys**: Hash(JWT) → {user_id, exp, claims}

**3. Capacity Planning**
- 200K validations/sec peak
- 97% cache hit → only 6K DB queries/sec
- Database: 2 replicas handle 6K reads easily
- Cache: Redis cluster handles 200K reads/sec

**The complete flow**:
1. User sends JWT with API request
2. Load balancer → App Server (round-robin)
3. App Server checks Redis cache
4. Cache hit (97%): Return in 5ms
5. Cache miss (3%): Validate, check DB, cache result`,

  whyItMatters: 'This architecture handles massive scale (200K validations/sec) with low latency (< 10ms) and high availability (99.99%).',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Authenticating 200M+ users globally',
    howTheyDoIt: 'Distributed auth system with multi-region Redis caches, auto-scaling app servers, and replicated databases across AWS regions',
  },

  keyPoints: [
    'Run 3+ app server instances for horizontal scaling',
    'Cache-aside strategy with TTL = token expiration',
    'Invalidate cache immediately on logout/revocation',
    '97%+ cache hit rate eliminates database bottleneck',
  ],

  quickCheck: {
    question: 'With 200K validations/sec and 97% cache hit rate, how many DB queries/sec?',
    options: [
      '200K - cache doesn\'t reduce DB load',
      '6K - only cache misses hit the database',
      '100K - half the traffic',
      '194K - cache only helps a little',
    ],
    correctIndex: 1,
    explanation: 'Only cache misses (3% of 200K = 6K) hit the database. This is why caching is so powerful!',
  },

  keyConcepts: [
    { title: 'Cache-Aside', explanation: 'Check cache first, DB on miss', icon: '📦' },
    { title: 'Auto-Scaling', explanation: 'Add/remove instances based on load', icon: '📊' },
    { title: 'Capacity Planning', explanation: 'Size infrastructure for peak load', icon: '🎯' },
  ],
};

const step7: GuidedStep = {
  id: 'auth-cache-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs optimized for production scale',
    taskDescription: 'Configure multiple app server instances and optimize cache strategy',
    successCriteria: [
      'Click on App Server → Set instances to 3 or more',
      'Click on Cache → Set strategy to cache-aside',
      'Set cache TTL to 900 seconds (15 minutes)',
      'Verify all configurations for production readiness',
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
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Configure App Server instances to 3+ and Cache strategy to cache-aside with TTL 900',
    level2: 'Click App Server → Instances: 3+. Click Cache → Strategy: cache-aside, TTL: 900 seconds',
    solutionComponents: [
      { type: 'app_server', config: { instances: 3 } },
      { type: 'cache', config: { strategy: 'cache-aside', ttl: 900 } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const authTokenCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'auth-token-cache',
  title: 'Design Auth Token Cache',
  description: 'Build a high-performance authentication system with JWT caching, session management, and token revocation',
  difficulty: 'intermediate',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '🔐',
    hook: "You've been hired as Lead Security Engineer at AuthTech Inc!",
    scenario: "Your mission: Build an authentication system that can validate 200K tokens per second with < 10ms latency.",
    challenge: "Can you design a system that balances security (token revocation) with performance (aggressive caching)?",
  },

  requirementsPhase: authTokenCacheRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7],

  totalSteps: 7,

  // Meta information
  concepts: [
    'JWT Authentication',
    'Token Validation',
    'Token Revocation',
    'Session Management',
    'Redis Caching',
    'Distributed Sessions',
    'Load Balancing',
    'Database Replication',
    'Cache-Aside Pattern',
    'Security vs Performance',
  ],

  ddiaReferences: [
    'Chapter 5: Replication (Database replication strategies)',
    'Chapter 7: Transactions (Session consistency)',
    'Chapter 12: Caching (Token validation caching)',
  ],

  finalExamTestCases: [
    {
      name: 'Basic Authentication',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Users can login and receive JWT tokens',
      traffic: { type: 'write', rps: 100, writeRps: 100 },
      duration: 10,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'Fast Token Validation',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Validate tokens within latency target (< 10ms p99)',
      traffic: { type: 'read', rps: 10000, readRps: 10000 },
      duration: 30,
      passCriteria: { maxP99Latency: 10, maxErrorRate: 0.01 },
    },
    {
      name: 'Token Revocation',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Logout immediately invalidates tokens',
      traffic: { type: 'mixed', rps: 1000, readRps: 900, writeRps: 100 },
      duration: 30,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'NFR-P1: Validation Scale',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 50K validation RPS with < 10ms p99 latency',
      traffic: { type: 'read', rps: 50000, readRps: 50000 },
      duration: 60,
      passCriteria: { maxP99Latency: 10, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: Traffic Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle sudden spike to 100K validations/sec',
      traffic: { type: 'read', rps: 100000, readRps: 100000 },
      duration: 60,
      passCriteria: { maxP99Latency: 20, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-R1: Database Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Maintain availability during database failure',
      traffic: { type: 'read', rps: 20000, readRps: 20000 },
      duration: 90,
      failureInjection: { type: 'db_crash', atSecond: 45, recoverySecond: 65 },
      passCriteria: { minAvailability: 0.99, maxDowntime: 10, maxErrorRate: 0.1 },
    },
  ] as TestCase[],
};

export function getAuthTokenCacheGuidedTutorial(): GuidedTutorial {
  return authTokenCacheGuidedTutorial;
}

export default authTokenCacheGuidedTutorial;
