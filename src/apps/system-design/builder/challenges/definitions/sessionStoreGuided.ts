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
 * Session Store Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches session management concepts
 * while building a distributed session store. Each step tells a story that motivates the task.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-2: Build brute force solution (in-memory) - FRs satisfied!
 * Step 3: Add persistence (database)
 * Steps 4+: Apply NFRs (distributed sessions, sticky sessions, TTL, replication)
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const sessionStoreRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a distributed session store for a web application",

  interviewer: {
    name: 'Jennifer Park',
    role: 'Staff Engineer',
    avatar: '👩‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-operations',
      category: 'functional',
      question: "What operations do users need to perform on sessions?",
      answer: "Users need three core operations:\n1. **Create Session**: When a user logs in, create a new session with a unique session ID\n2. **Read Session**: On each request, look up the session by ID to check if the user is authenticated and retrieve their data\n3. **Update Session**: As users interact with the app, update session data (last activity time, shopping cart, etc.)\n4. **Delete Session**: When users log out or sessions expire, remove the session data",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Session stores are key-value stores with CRUD operations",
    },
    {
      id: 'session-expiry',
      category: 'functional',
      question: "What happens to sessions over time? Do they live forever?",
      answer: "No, sessions must expire! If a user logs in but doesn't return for days, their session should automatically expire for security. Each session has a TTL (Time-To-Live) - typically 30 minutes to 24 hours. Every time the user makes a request, we extend the TTL (sliding window). If the TTL expires, the session is deleted.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "TTL is critical for security and resource management",
    },
    {
      id: 'session-consistency',
      category: 'functional',
      question: "What happens if a user makes two requests at the same time and both try to update the same session?",
      answer: "That's a classic race condition! If two requests both read session data, modify it, and write it back, one update could overwrite the other. We need to ensure session updates are atomic - either use optimistic locking (version numbers) or ensure writes to the same session are serialized.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Concurrent updates require synchronization mechanisms",
    },

    // IMPORTANT - Clarifications
    {
      id: 'session-size',
      category: 'clarification',
      question: "How much data does a typical session store?",
      answer: "Sessions are typically small - around 1-5 KB per session. They might store: user ID, username, permissions, preferences, shopping cart items, etc. We should design for up to 10 KB max per session to be safe.",
      importance: 'important',
      insight: "Small session size means memory-based storage is feasible",
    },
    {
      id: 'session-sharing',
      category: 'clarification',
      question: "If a user has the app open in two different browsers, do they share the same session?",
      answer: "No, each login creates a separate session with its own session ID. A user can have multiple active sessions across different devices or browsers. Each session is independent with its own TTL.",
      importance: 'important',
      insight: "One user can have multiple concurrent sessions",
    },
    {
      id: 'sticky-sessions',
      category: 'clarification',
      question: "Do requests from the same user always go to the same server?",
      answer: "That's an important design decision. With 'sticky sessions', the load balancer routes all requests with the same session ID to the same server. This is simpler but creates problems if that server crashes. Ideally, we want sessions to be accessible from ANY server (distributed sessions).",
      importance: 'important',
      insight: "Distributed sessions are more resilient than sticky sessions",
    },

    // SCOPE
    {
      id: 'scope-persistence',
      category: 'scope',
      question: "Should sessions survive server restarts?",
      answer: "Yes, for production systems, sessions should be durable. If your app server restarts, users shouldn't all be logged out. We'll need to persist sessions to a database or cache.",
      importance: 'critical',
      insight: "Durability requires external storage (Redis, database, etc.)",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // 1. THROUGHPUT
    {
      id: 'throughput-sessions',
      category: 'throughput',
      question: "How many concurrent sessions should we support?",
      answer: "Let's design for 10 million concurrent sessions (users who are currently logged in)",
      importance: 'critical',
      calculation: {
        formula: "10M sessions × 5KB avg = 50GB total session data",
        result: "~50GB of session storage needed",
      },
      learningPoint: "This tells you memory/storage requirements",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many session reads per second?",
      answer: "Every HTTP request needs to read the session. With 100M daily active users making ~50 requests/day each, that's 5 billion requests/day.",
      importance: 'critical',
      calculation: {
        formula: "5B ÷ 86,400 sec = 57,870 reads/sec average",
        result: "~58K reads/sec (174K at peak)",
      },
      learningPoint: "Session reads are extremely frequent - must be fast!",
    },
    {
      id: 'throughput-writes',
      category: 'throughput',
      question: "How many session writes per second?",
      answer: "Much fewer than reads. Sessions are created on login (~10M logins/day) and updated periodically (~500M updates/day for TTL refresh).",
      importance: 'critical',
      calculation: {
        formula: "510M ÷ 86,400 sec = 5,903 writes/sec average",
        result: "~6K writes/sec (18K at peak)",
      },
      learningPoint: "Read-heavy workload (10:1 ratio) - optimize for reads",
    },

    // 2. LATENCY
    {
      id: 'latency-read',
      category: 'latency',
      question: "What's the acceptable latency for session reads?",
      answer: "Session reads happen on EVERY request, so they must be blazing fast. p99 should be under 5ms. If session lookup takes 100ms, your whole API becomes 100ms slower!",
      importance: 'critical',
      learningPoint: "Session reads are on the critical path - must use cache",
    },
    {
      id: 'latency-write',
      category: 'latency',
      question: "What about latency for session writes?",
      answer: "Writes are less critical. p99 under 50ms is acceptable for session creation and updates.",
      importance: 'important',
      learningPoint: "Writes can be slightly slower than reads",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-operations', 'session-expiry', 'session-consistency'],
  criticalFRQuestionIds: ['core-operations', 'session-expiry', 'session-consistency'],
  criticalScaleQuestionIds: ['throughput-sessions', 'throughput-reads', 'latency-read'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: CRUD operations on sessions',
      description: 'Create, Read, Update, Delete session data by session ID',
      emoji: '🔑',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Automatic session expiration (TTL)',
      description: 'Sessions expire after inactivity period (sliding window TTL)',
      emoji: '⏰',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Concurrent session updates',
      description: 'Handle concurrent updates to the same session safely',
      emoji: '🔒',
    },
  ],

  scaleMetrics: {
    concurrentSessions: '10 million',
    sessionSize: '1-10 KB',
    totalStorage: '~50 GB',
    readsPerDay: '5 billion',
    writesPerDay: '510 million',
    readWriteRatio: '10:1',
    calculatedReadRPS: { average: 57870, peak: 173610 },
    calculatedWriteRPS: { average: 5903, peak: 17709 },
    sessionReadLatencySLA: 'p99 < 5ms',
    sessionWriteLatencySLA: 'p99 < 50ms',
    sessionTTL: '30 minutes (sliding window)',
  },

  architecturalImplications: [
    '✅ Read-heavy (10:1) → Cache-first architecture is CRITICAL',
    '✅ 174K reads/sec peak → Must use in-memory cache (Redis)',
    '✅ p99 < 5ms → Database too slow, cache is essential',
    '✅ 50GB total → Fits in memory, use Redis cluster',
    '✅ TTL required → Redis native TTL support is perfect',
  ],

  outOfScope: [
    'Session sharing across microservices (v2)',
    'Cross-datacenter session replication (v2)',
    'Session analytics and monitoring (v2)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple Client → App Server solution with in-memory sessions. Once it works, we'll add persistence, distribute sessions across servers, and optimize for scale. This is the right way to approach system design: functionality first, then optimization.",
};

// =============================================================================
// STEP 1: The Beginning - Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome, engineer! You're building a session store for a web application.",
  hook: "Users need to stay logged in as they browse your site. Without sessions, they'd have to re-enter their password on every page!",
  challenge: "Connect the Client to the App Server to handle session requests.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your system is connected!",
  achievement: "Clients can now send session requests to your App Server",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can handle requests', after: '✓' },
  ],
  nextTeaser: "But the server is empty... let's write some session management code!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Session Management',
  conceptExplanation: `Every web application needs **session management** - the ability to remember users across requests.

**How sessions work:**
1. User logs in with username/password
2. Server creates a session with unique ID (e.g., "sess_abc123")
3. Server sends session ID to client in a cookie
4. On each request, client sends session ID
5. Server looks up session to verify user is authenticated

**Session ID → Session Data**
- Session ID: "sess_abc123"
- Session Data: { user_id: 42, username: "alice", last_activity: "2024-01-15 10:30" }

Think of it as a claim ticket at a coat check. The ticket (session ID) gets you your coat (session data).`,
  whyItMatters: 'Without sessions, users would have to log in on every page. Sessions enable the "stateful" experience users expect from web apps.',
  keyPoints: [
    'Session ID is the key, session data is the value (key-value store)',
    'Session IDs must be random and unpredictable (security)',
    'Sessions are stored server-side, only ID goes to client',
    'Every HTTP request includes the session ID in a cookie',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────┐
│   Client    │ ──────▶ │   App Server    │
│  (Browser)  │ ◀────── │  (Your Code)    │
└─────────────┘         └─────────────────┘
     Cookie:                   Sessions:
  sess_abc123           abc123 → {user_id: 42}
`,
  keyConcepts: [
    {
      title: 'Session ID',
      explanation: 'Unique random string that identifies a session (like a claim ticket)',
      icon: '🎟️',
    },
    {
      title: 'Session Data',
      explanation: 'User information stored server-side (user ID, preferences, cart)',
      icon: '📦',
    },
  ],
  quickCheck: {
    question: 'Where is session data stored?',
    options: [
      'In the browser cookie',
      'In localStorage on the client',
      'On the server (only ID goes to client)',
      'In the URL query parameters',
    ],
    correctIndex: 2,
    explanation: 'Session data is stored server-side for security. Only the session ID goes to the client in a cookie.',
  },
};

const step1: GuidedStep = {
  id: 'session-store-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Users can submit session requests to the system',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes session requests', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send requests' },
    ],
    successCriteria: ['Add Client', 'Add App Server', 'Connect Client → App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'First add Client, then add App Server, then connect them',
    level2: 'Drag Client and App Server from the sidebar, then drag from Client to App Server to connect',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Configure the App Server with Session APIs
// =============================================================================

const step2Story: StoryContent = {
  emoji: '⚙️',
  scenario: "Your App Server is connected, but it's just an empty box right now.",
  hook: "It doesn't know HOW to create sessions, read them, or handle expiration. We need to teach it by writing actual Python code!",
  challenge: "Configure the App Server with session APIs and implement the Python handlers.",
  illustration: 'configure-server',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Your App Server can now manage sessions!",
  achievement: "Users can create sessions, read them, and update them",
  metrics: [
    { label: 'APIs configured', after: '3 endpoints' },
    { label: 'Code written', after: '✓ Working' },
  ],
  nextTeaser: "But wait... what happens when the server restarts?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Session API Design & Python Implementation',
  conceptExplanation: `Your App Server needs to handle session operations. You'll implement these in Python!

**1. Create Session (POST /api/v1/sessions)** — You'll implement this
- Receives: User credentials
- Returns: New session ID
- Your code: Generate unique ID, store session data in memory (for now)

**2. Read Session (GET /api/v1/sessions/:id)** — You'll implement this
- Receives: Session ID
- Returns: Session data (or 404 if expired/not found)
- Your code: Look up session, check TTL, return data

**3. Update Session (PUT /api/v1/sessions/:id)** — You'll implement this
- Receives: Session ID + updated data
- Returns: Success confirmation
- Your code: Update session data, refresh TTL (sliding window)

**By the end of this step you should have:**
1. ✅ APIs assigned to the App Server
2. ✅ Python handlers implemented for all endpoints`,
  whyItMatters: 'Without the code, your server is just an empty shell. The Python handlers define what actually happens when users interact with sessions. This is where your system design becomes real!',
  keyPoints: [
    'POST creates new sessions (you\'ll write the Python code)',
    'GET reads existing sessions (you\'ll write the Python code)',
    'PUT updates sessions and refreshes TTL (sliding window)',
    'Each session has a TTL that resets on activity',
    'Open the Python tab to see and edit your handler code',
  ],
  diagram: `
POST /api/v1/sessions
┌─────────────────────────────────────────────────┐
│ Request:  { "user_id": 42 }                     │
│ Response: { "session_id": "sess_abc123" }       │
└─────────────────────────────────────────────────┘

GET /api/v1/sessions/sess_abc123
┌─────────────────────────────────────────────────┐
│ Response: { "user_id": 42, "ttl": 1800 }        │
└─────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'REST API', explanation: 'POST to create, GET to read, PUT to update', icon: '🔌' },
    { title: 'Sliding Window TTL', explanation: 'Each access extends the expiration time', icon: '⏰' },
    { title: 'Python Handlers', explanation: 'The actual code that processes each request', icon: '🐍' },
  ],
  quickCheck: {
    question: 'What happens to a session\'s TTL when you read it?',
    options: [
      'TTL stays the same',
      'TTL resets to the original value (sliding window)',
      'TTL decreases',
      'TTL is deleted',
    ],
    correctIndex: 1,
    explanation: 'With sliding window TTL, each access resets the expiration timer. This keeps active sessions alive.',
  },
};

const step2: GuidedStep = {
  id: 'session-store-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'App Server must handle session CRUD operations with Python code',
    taskDescription: 'Re-use your Client → App Server from Step 1, then configure APIs and implement the Python handlers',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'Client' },
      { type: 'app_server', reason: 'Configure APIs and write Python code', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Already connected in Step 1' },
    ],
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/sessions, GET /api/v1/sessions/*, PUT /api/v1/sessions/* APIs',
      'Open the Python tab and implement the handlers for all endpoints',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Click App Server to configure APIs, then switch to the Python tab to write your handlers',
    level2: 'After assigning APIs in the inspector, switch to the Python editor tab and fill in the TODOs. Implement create_session(), read_session(), and update_session().',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: The Crisis - We Lost All Sessions!
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 2 AM. Your server crashed during a deployment.",
  hook: "When it came back online... ALL users were logged out! Every session vanished! Your support inbox is on fire - users are furious they lost their shopping carts!",
  challenge: "The problem: session data was stored in server memory. When the server restarted, everything vanished. We need persistent storage!",
  illustration: 'server-crash',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Your sessions are now safe!",
  achievement: "Sessions persist even if the server restarts",
  metrics: [
    { label: 'Data durability', before: '❌ Lost on restart', after: '✓ Persisted' },
    { label: 'Storage', after: 'Redis Cache' },
  ],
  nextTeaser: "Great! But with millions of sessions, lookups are getting slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Session Persistence: Why Redis?',
  conceptExplanation: `Without persistent storage, your app server stores sessions in memory (RAM).

**Problem**: RAM is volatile - when the server restarts, all sessions are lost!

**Solution**: Store sessions in an external cache like **Redis**.

**Why Redis for sessions?**
1. **In-memory speed**: Lookups in 1-5ms (vs 10-50ms for database)
2. **Native TTL support**: Redis automatically deletes expired keys
3. **Atomic operations**: SET, GET are atomic (safe for concurrent access)
4. **Persistence**: Redis can persist to disk (RDB snapshots or AOF logs)
5. **Simple data model**: Perfect for key-value (session ID → session data)

**Redis vs Database:**
- Redis: 1-5ms latency, in-memory, automatic TTL ✅
- PostgreSQL: 10-50ms latency, disk-based, manual cleanup ❌

For session stores, Redis is the industry standard.`,
  whyItMatters: 'Without persistent storage, all users are logged out on every deployment. With Redis, sessions survive restarts and scale to millions of users.',
  realWorldExample: {
    company: 'GitHub',
    scenario: 'Storing millions of user sessions',
    howTheyDoIt: 'Uses Redis cluster for session storage. Sessions are replicated across multiple Redis nodes for high availability.',
  },
  famousIncident: {
    title: 'Facebook Session Cookie Bug',
    company: 'Facebook',
    year: '2011',
    whatHappened: 'A bug caused Facebook to log out all 750 million users simultaneously. The session store couldn\'t handle the thundering herd of re-logins. Servers crashed, and the site was down for hours.',
    lessonLearned: 'Session stores must be highly available and able to handle massive login spikes. Use distributed caching and proper capacity planning.',
    icon: '🔥',
  },
  keyPoints: [
    'Redis is the industry standard for session stores',
    'In-memory speed (1-5ms) is critical for session reads',
    'Native TTL support makes expiration automatic',
    'Redis persistence ensures sessions survive restarts',
    'Much faster than database for this use case',
  ],
  diagram: `
┌─────────────┐       ┌─────────────┐       ┌────────────────┐
│   Client    │ ────▶ │ App Server  │ ────▶ │     Redis      │
└─────────────┘       └─────────────┘       │                │
                                            │  sess_abc → {} │
                                            │  sess_xyz → {} │
                                            │  (with TTL)    │
                                            └────────────────┘
`,
  keyConcepts: [
    { title: 'Redis', explanation: 'In-memory key-value store optimized for speed', icon: '⚡' },
    { title: 'TTL', explanation: 'Redis automatically deletes keys after expiration', icon: '⏰' },
    { title: 'Persistence', explanation: 'RDB snapshots or AOF logs save to disk', icon: '💾' },
  ],
  quickCheck: {
    question: 'Why use Redis instead of PostgreSQL for sessions?',
    options: [
      'Redis is cheaper',
      'Redis has better SQL support',
      'Redis is 10x faster and has native TTL support',
      'PostgreSQL can\'t store JSON',
    ],
    correctIndex: 2,
    explanation: 'Redis is in-memory (1-5ms vs 10-50ms) and has native TTL support. Session reads are on the critical path, so speed is essential.',
  },
};

const step3: GuidedStep = {
  id: 'session-store-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Sessions must persist durably',
    taskDescription: 'Build Client → App Server → Redis Cache',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes session requests', displayName: 'App Server' },
      { type: 'cache', reason: 'Stores sessions persistently', displayName: 'Redis Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send requests' },
      { from: 'App Server', to: 'Cache', reason: 'Server reads/writes sessions' },
    ],
    successCriteria: ['Add Client, App Server, Cache', 'Connect Client → App Server → Cache'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Build the full path: Client → App Server → Redis Cache',
    level2: 'Add all three components and connect them in sequence',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'cache' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 4: The Problem - Sticky Sessions vs Distributed Sessions
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🎯',
  scenario: "Your session store is working great! But there's a problem...",
  hook: "You only have ONE App Server. If it crashes, all users lose access. And it can only handle 1,000 requests/second - but you're getting 10,000!",
  challenge: "You need multiple App Servers. But now you have a choice: sticky sessions (route users to the same server) or distributed sessions (any server can handle any user). Which is better?",
  illustration: 'load-balancer',
};

const step4Celebration: CelebrationContent = {
  emoji: '🌐',
  message: "You've built a distributed session architecture!",
  achievement: "Any server can handle any session - no sticky sessions needed",
  metrics: [
    { label: 'Architecture', before: 'Sticky sessions', after: 'Distributed sessions' },
    { label: 'Availability', before: '99%', after: '99.9%' },
    { label: 'Server failover', after: 'Seamless' },
  ],
  nextTeaser: "Excellent! But if Redis crashes, all sessions are still lost...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Sticky Sessions vs Distributed Sessions',
  conceptExplanation: `When you have multiple App Servers, you have two options:

**1. Sticky Sessions (Session Affinity)**
- Load balancer routes user to the SAME server every time
- Sessions stored in server memory
- Simple to implement

**Problems:**
❌ If that server crashes, user loses session
❌ Uneven load distribution (some servers get more "sticky" users)
❌ Can't do rolling deploys easily (would log out users)
❌ Vertical scaling only (can't add servers mid-session)

**2. Distributed Sessions** ✅ BETTER
- Sessions stored in external cache (Redis)
- Load balancer can route to ANY server
- All servers share the same session store

**Benefits:**
✅ Server crashes don't lose sessions
✅ Perfect load distribution
✅ Easy rolling deploys (drain connections, update server)
✅ Horizontal scaling (add/remove servers anytime)

**The key insight:** By using Redis for session storage, you ENABLE distributed sessions. Any server can handle any request because they all talk to the same Redis.`,
  whyItMatters: 'Sticky sessions create single points of failure and limit scalability. Distributed sessions enable true high availability and elastic scaling.',
  realWorldExample: {
    company: 'Netflix',
    scenario: 'Handling millions of concurrent streaming sessions',
    howTheyDoIt: 'Uses distributed sessions with EVCache (their Redis-like system). Any API server can handle any user request, enabling seamless failover and scaling.',
  },
  famousIncident: {
    title: 'AWS ELB Sticky Session Outage',
    company: 'Major E-commerce Site',
    year: '2018',
    whatHappened: 'An e-commerce site used sticky sessions during Black Friday. When some servers became overloaded, the load balancer couldn\'t redistribute traffic because of sticky sessions. The overloaded servers crashed, logging out thousands of users mid-checkout.',
    lessonLearned: 'Sticky sessions prevent effective load balancing and create cascading failures. Use distributed sessions for production systems.',
    icon: '🛒',
  },
  keyPoints: [
    'Sticky sessions = sessions tied to specific servers (fragile)',
    'Distributed sessions = sessions in external store (resilient)',
    'Redis enables any server to handle any session',
    'Load balancer can route purely based on server health/load',
    'Essential for high availability and horizontal scaling',
  ],
  diagram: `
STICKY SESSIONS (❌ Avoid):
┌─────┐    ┌─────────────┐
│User │───▶│ LB (sticky) │
└─────┘    └──────┬──────┘
                  │ always routes to Server 1
           ┌──────┴──────┐
           ▼             ▼
      ┌────────┐    ┌────────┐
      │Server 1│    │Server 2│
      │sess in │    │sess in │
      │ memory │    │ memory │
      └────────┘    └────────┘
      ❌ If crashes, sessions lost!

DISTRIBUTED SESSIONS (✅ Better):
┌─────┐    ┌────────┐
│User │───▶│   LB   │
└─────┘    └───┬────┘
               │ routes to any server
        ┌──────┴──────┐
        ▼             ▼
   ┌────────┐    ┌────────┐
   │Server 1│    │Server 2│
   └───┬────┘    └───┬────┘
       └──────┬──────┘
              ▼
         ┌─────────┐
         │  Redis  │
         │sessions │
         └─────────┘
         ✅ Sessions survive server crashes!
`,
  keyConcepts: [
    { title: 'Sticky Sessions', explanation: 'User always routes to same server (session affinity)', icon: '📍' },
    { title: 'Distributed Sessions', explanation: 'Sessions in external store, any server works', icon: '🌐' },
    { title: 'Session Affinity', explanation: 'Another term for sticky sessions', icon: '🔗' },
  ],
  quickCheck: {
    question: 'What happens with distributed sessions when a server crashes?',
    options: [
      'All sessions on that server are lost',
      'Load balancer can route user to different server seamlessly',
      'Users must log in again',
      'The load balancer crashes too',
    ],
    correctIndex: 1,
    explanation: 'With distributed sessions in Redis, any server can handle any user. If one server crashes, the load balancer routes to a healthy server with no session loss.',
  },
};

const step4: GuidedStep = {
  id: 'session-store-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'System must support distributed sessions (no sticky sessions)',
    taskDescription: 'Build Client → Load Balancer → App Server → Redis Cache',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic across servers', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Processes session requests', displayName: 'App Server' },
      { type: 'cache', reason: 'Centralized session store', displayName: 'Redis Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'All traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB forwards to servers' },
      { from: 'App Server', to: 'Cache', reason: 'Servers read/write sessions' },
    ],
    successCriteria: [
      'Build full architecture with Load Balancer',
      'Client → LB → App Server → Redis Cache',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Build the full system with Load Balancer in front',
    level2: 'Client → Load Balancer → App Server, then App Server connects to Redis Cache',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 5: The Crash - Redis Goes Down!
// =============================================================================

const step5Story: StoryContent = {
  emoji: '💥',
  scenario: "4 AM. Your phone explodes with alerts. Redis crashed!",
  hook: "ALL sessions are gone. Millions of users just got logged out. Some were mid-checkout. Your CEO is calling. This is a disaster!",
  challenge: "One Redis instance is a single point of failure. We need Redis replication - if the primary fails, a replica takes over!",
  illustration: 'server-crash',
};

const step5Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "Your sessions are now protected!",
  achievement: "Redis High Availability configured with replication",
  metrics: [
    { label: 'Availability', before: '99%', after: '99.95%' },
    { label: 'Data Loss Risk', before: 'High', after: 'Near Zero' },
    { label: 'Failover Time', before: 'Manual', after: 'Automatic (seconds)' },
  ],
  nextTeaser: "Perfect! But you still only have one App Server...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Redis Replication for High Availability',
  conceptExplanation: `When your Redis instance crashes, all sessions are lost - unless you have **replicas** (copies).

**Redis Replication Strategies:**

**1. Primary-Replica (Most Common)** ✅
- One primary handles all writes
- Replicas replicate data from primary
- Replicas can serve reads (reduces load)
- If primary fails, promote a replica to primary
- Redis Sentinel monitors and automates failover

**2. Redis Cluster (For Massive Scale)**
- Data sharded across multiple primary nodes
- Each primary has replicas
- Handles 100K+ writes/sec
- More complex, only needed at huge scale

**For session stores, Primary-Replica is perfect:**
- Automatic failover with Sentinel
- Replicas serve reads (10:1 read/write ratio)
- Simple to operate
- Handles millions of sessions

**How failover works:**
1. Primary Redis crashes
2. Sentinel detects failure (within 1-2 seconds)
3. Sentinel promotes a replica to primary
4. App servers automatically reconnect
5. Downtime: 2-5 seconds (users don't notice)

**Write to primary, read from replicas:**
- All writes go to primary (consistency)
- Reads can go to replicas (scale reads)
- Replication lag is typically < 100ms`,
  whyItMatters: 'Without replication, a Redis crash logs out all users. With replication, failover is automatic and near-instant.',
  realWorldExample: {
    company: 'Instagram',
    scenario: 'Storing 1 billion+ user sessions',
    howTheyDoIt: 'Uses Redis clusters with replication. Each primary has 2 replicas across different availability zones. Automatic failover ensures 99.99% availability.',
  },
  famousIncident: {
    title: 'Redis Fork() Memory Spike',
    company: 'Major Social Network',
    year: '2019',
    whatHappened: 'Redis creates a snapshot by fork()-ing the process. On a server with 50GB of sessions, the fork caused memory usage to spike to 100GB, triggering OOM killer. Redis crashed, logging out 10 million users. Without replicas, recovery took 30 minutes.',
    lessonLearned: 'Always run Redis with replication. Memory spikes, crashes, and hardware failures are inevitable. Replicas ensure automatic failover.',
    icon: '💀',
  },
  keyPoints: [
    'Primary-Replica is the standard for session stores',
    'Redis Sentinel monitors health and automates failover',
    'Replicas can serve reads (reduces primary load)',
    'Failover typically completes in 2-5 seconds',
    'Run replicas in different availability zones for durability',
  ],
  diagram: `
┌─────────────────────────────────────────────────────┐
│           REDIS PRIMARY-REPLICA                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│     ┌─────────┐     writes     ┌─────────┐         │
│     │   App   │ ─────────────→ │ Primary │         │
│     │ Server  │                │  Redis  │         │
│     └────┬────┘                └────┬────┘         │
│          │                          │              │
│          │ reads                    │ replicate    │
│          │                          ▼              │
│          │                    ┌─────────┐          │
│          └──────────────────→ │ Replica │          │
│                               │  Redis  │          │
│                               └─────────┘          │
│                                                     │
│  Sentinel: Monitors health, auto-promotes replica  │
│  If Primary fails → Promote Replica in 2-5 sec     │
└─────────────────────────────────────────────────────┘`,
  keyConcepts: [
    { title: 'Replication', explanation: 'Primary writes, replicas copy data', icon: '📋' },
    { title: 'Sentinel', explanation: 'Monitors Redis, automates failover', icon: '🔍' },
    { title: 'Failover', explanation: 'Automatic switch to replica when primary fails', icon: '🔄' },
    { title: 'Replication Lag', explanation: 'Delay between write and replica sync (typically < 100ms)', icon: '⏱️' },
  ],
  quickCheck: {
    question: 'What happens when the Redis primary fails with Sentinel configured?',
    options: [
      'All sessions are lost',
      'Sentinel automatically promotes a replica to primary in seconds',
      'App servers must be manually reconfigured',
      'Users must wait 30 minutes for recovery',
    ],
    correctIndex: 1,
    explanation: 'Redis Sentinel monitors health and automatically promotes a replica to primary, typically completing failover in 2-5 seconds.',
  },
};

const step5: GuidedStep = {
  id: 'session-store-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'System must survive Redis failures (99.95% availability)',
    taskDescription: 'Build full system and configure Redis replication',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Processes session requests', displayName: 'App Server' },
      { type: 'cache', reason: 'Session store with replication', displayName: 'Redis Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB forwards to servers' },
      { from: 'App Server', to: 'Cache', reason: 'Servers read/write sessions' },
    ],
    successCriteria: [
      'Build full architecture',
      'Click Redis Cache → Enable replication with 2+ replicas',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheReplication: true,
  },
  hints: {
    level1: 'Build the full system, then configure Redis replication',
    level2: 'Add all components, connect them, then click Redis Cache → Replication with 2+ replicas',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 6: The Scale - Multiple App Servers
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your Redis is replicated and bulletproof. But there's still a bottleneck...",
  hook: "You only have ONE App Server! The Load Balancer is ready, but it's sending everything to a single server. That server is at 100% CPU and dropping requests!",
  challenge: "Time to scale OUT. Add multiple App Server instances so the Load Balancer can actually distribute traffic!",
  illustration: 'horizontal-scaling',
};

const step6Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Your system is now horizontally scalable!",
  achievement: "No more single points of failure - true High Availability achieved",
  metrics: [
    { label: 'App Server Instances', before: '1', after: '3+' },
    { label: 'Capacity', before: '1K RPS', after: '10K+ RPS' },
    { label: 'Availability', before: '99%', after: '99.99%' },
  ],
  nextTeaser: "Amazing! Now let's make sure TTL cleanup is working efficiently...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Scaling Out: Multiple App Server Instances',
  conceptExplanation: `**What you've built so far:**
- Load Balancer to distribute traffic
- Redis with replication for session storage

**What's missing?** Multiple App Server instances!

Your Load Balancer can distribute traffic, but with only 1 server, there's nothing to balance. You need **3+ instances** for:

1. **Higher Throughput**: 3 servers = 3x capacity
2. **High Availability**: If one server crashes, others handle traffic
3. **Zero-Downtime Deploys**: Update one server while others serve traffic
4. **Auto-scaling**: Add/remove servers based on load

**Why this works for session stores:**
- App Servers are **stateless** - they don't store sessions locally
- All session state lives in Redis
- Any server can handle any request
- Load Balancer health checks remove failed servers automatically

**Perfect for distributed sessions:**
Since sessions are in Redis, any server can handle any user. This is the power of distributed sessions - stateless app servers that scale horizontally.`,
  whyItMatters: 'A single server is a single point of failure. With 3+ instances behind a load balancer, your system survives server crashes, handles traffic spikes, and allows maintenance without downtime.',
  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Handling booking surges during holidays',
    howTheyDoIt: 'Auto-scales from 200 to 2000+ app servers during peak booking times. Sessions in Redis Cluster enable any server to handle any request. Kubernetes manages the scaling automatically.',
  },
  famousIncident: {
    title: 'Etsy Single Server Bottleneck',
    company: 'Etsy',
    year: '2012',
    whatHappened: 'Early Etsy had a single PHP server handling all checkout requests. During a sale event, the server became overloaded and crashed. Thousands of customers lost their carts mid-checkout. The site was down for 3 hours.',
    lessonLearned: 'Start with at least 3 servers from day one. Single server = single point of failure. Your users will remember every outage.',
    icon: '🛍️',
  },
  keyPoints: [
    'Stateless App Servers = easy horizontal scaling',
    'Load Balancer distributes traffic across all instances',
    '3+ instances = no single point of failure for compute',
    'Combined with Redis replication = full High Availability',
    'Health checks automatically remove failed servers',
  ],
  diagram: `
┌─────────────────────────────────────────────────────┐
│         COMPLETE HIGH-AVAILABILITY SETUP            │
├─────────────────────────────────────────────────────┤
│                                                     │
│              ┌──────────────┐                       │
│              │    Client    │                       │
│              └──────┬───────┘                       │
│                     │                               │
│                     ▼                               │
│            ┌────────────────┐                       │
│            │ Load Balancer  │                       │
│            └───────┬────────┘                       │
│           ┌────────┼────────┐                       │
│           │        │        │                       │
│           ▼        ▼        ▼                       │
│     ┌─────────┬─────────┬─────────┐                │
│     │  App 1  │  App 2  │  App 3  │  ← NOW!        │
│     │ Server  │ Server  │ Server  │                │
│     └────┬────┴────┬────┴────┬────┘                │
│          └─────────┼─────────┘                      │
│                    │                                │
│                    ▼                                │
│            ┌───────────────┐                        │
│            │  Redis Cluster│                        │
│            │  (Replicated) │                        │
│            └───────────────┘                        │
└─────────────────────────────────────────────────────┘`,
  keyConcepts: [
    { title: 'Stateless', explanation: 'Server stores no session data - any server handles any request', icon: '🔄' },
    { title: 'Instance Count', explanation: 'Number of copies of your App Server running', icon: '🔢' },
    { title: 'Health Checks', explanation: 'LB pings servers, removes unhealthy ones', icon: '💓' },
    { title: 'Auto-scaling', explanation: 'Automatically add/remove servers based on load', icon: '📈' },
  ],
  quickCheck: {
    question: 'Why do you need multiple App Server instances behind the Load Balancer?',
    options: [
      'The Load Balancer requires at least 3 servers to work',
      'For higher capacity AND to survive server failures',
      'To store more sessions in memory',
      'To make Redis faster',
    ],
    correctIndex: 1,
    explanation: 'Multiple instances give you both higher throughput (more capacity) and high availability (survive failures). The LB distributes traffic and removes failed servers.',
  },
};

const step6: GuidedStep = {
  id: 'session-store-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'System must handle 10K+ RPS with no single points of failure',
    taskDescription: 'Scale out: Configure your App Server to run 3+ instances',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Already added', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Configure for 3+ instances', displayName: 'App Server' },
      { type: 'cache', reason: 'Already replicated', displayName: 'Redis Cache' },
    ],
    connectionsNeeded: [
      { from: 'Load Balancer', to: 'App Server', reason: 'LB distributes to multiple instances' },
    ],
    successCriteria: [
      'Click on App Server → Set Instances to 3 or more',
      'Verify Redis replication is still enabled',
      'Your system now has no single points of failure!',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheReplication: true,
    requireMultipleAppInstances: true,
  },
  hints: {
    level1: 'Click on the App Server and increase the instance count to 3 or more',
    level2: 'Your architecture should already have LB and Redis with replication. Just configure App Server instances: Click App Server → Set Instances to 3+',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 7: The Optimization - TTL and Session Cleanup
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🧹',
  scenario: "Your system is highly available and scales beautifully. But there's a subtle issue...",
  hook: "Your Redis memory keeps growing! You're storing 20 million sessions, but only 10 million users are actually active. Half the sessions are from users who haven't returned in days!",
  challenge: "We need proper TTL configuration to automatically clean up inactive sessions. This is critical for security AND cost efficiency!",
  illustration: 'optimization',
};

const step7Celebration: CelebrationContent = {
  emoji: '✨',
  message: "Your session store is now optimized!",
  achievement: "TTL automatically cleans up inactive sessions",
  metrics: [
    { label: 'Memory usage', before: '100GB', after: '50GB' },
    { label: 'Active sessions', before: '20M mixed', after: '10M active' },
    { label: 'Monthly cost', before: '$800', after: '$400' },
  ],
  nextTeaser: "Perfect! Now let's validate the complete system...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'TTL and Session Cleanup Strategy',
  conceptExplanation: `**The TTL problem:**
Without proper cleanup, sessions accumulate forever:
- User logs in → creates session
- User closes browser → session still in Redis
- After 1 week → session still taking up memory
- After 1 month → millions of dead sessions!

**Solution: Sliding Window TTL**

**How it works:**
1. Create session → Set TTL to 30 minutes
2. User makes request → Reset TTL to 30 minutes (slide the window)
3. No activity for 30 minutes → Redis automatically deletes session

**Why sliding window?**
- Active users stay logged in (TTL keeps resetting)
- Inactive users get logged out (security!)
- No manual cleanup code needed (Redis handles it)

**Redis TTL commands:**
\`\`\`python
# Create with TTL
redis.setex("session:abc123", 1800, session_data)  # 1800 sec = 30 min

# Refresh TTL on access
redis.expire("session:abc123", 1800)  # Reset to 30 min

# Check remaining TTL
redis.ttl("session:abc123")  # Returns seconds remaining
\`\`\`

**TTL choices:**
- **5 minutes**: Banking apps (high security)
- **30 minutes**: E-commerce (balance security/UX)
- **24 hours**: Social media (user convenience)
- **7 days**: "Remember me" checkbox

**Cost impact:**
- Without TTL: 20M sessions × 5KB = 100GB Redis = $800/month
- With TTL: 10M active × 5KB = 50GB Redis = $400/month
- **Saves 50% on infrastructure costs!**`,
  whyItMatters: 'TTL is critical for security (auto-logout inactive users), cost efficiency (less memory), and compliance (GDPR requires deleting old session data).',
  realWorldExample: {
    company: 'Stripe',
    scenario: 'Managing payment sessions for millions of merchants',
    howTheyDoIt: 'Uses 24-hour TTL for standard sessions, 5-minute TTL for payment sessions. Redis automatically cleans up, reducing memory by 60% and improving security.',
  },
  famousIncident: {
    title: 'LinkedIn Session Memory Leak',
    company: 'LinkedIn',
    year: '2016',
    whatHappened: 'A bug prevented session TTL from resetting properly. Sessions accumulated for weeks. Redis memory usage grew from 50GB to 500GB. Eventually Redis ran out of memory and started evicting ACTIVE sessions, logging out users. Site performance degraded for hours.',
    lessonLearned: 'Always test TTL behavior! Monitor session count and memory usage. Set up alerts for abnormal growth. TTL isn\'t optional - it\'s critical.',
    icon: '💼',
  },
  keyPoints: [
    'Sliding window TTL: resets on every access',
    'Redis automatically deletes expired keys',
    'Reduces memory usage by 50%+ (inactive sessions removed)',
    'Improves security (auto-logout inactive users)',
    'Choose TTL based on security vs UX tradeoff',
  ],
  diagram: `
┌─────────────────────────────────────────────────────┐
│              SLIDING WINDOW TTL                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  User Activity Timeline:                            │
│                                                     │
│  10:00 AM - Login → Create session (TTL: 30 min)   │
│            ├────────────────────┤ expires 10:30    │
│                                                     │
│  10:15 AM - Make request → Reset TTL (slide!)      │
│                     ├────────────────────┤          │
│                                    expires 10:45   │
│                                                     │
│  10:40 AM - Make request → Reset TTL (slide!)      │
│                                  ├─────────────┤    │
│                                         expires 11:10│
│                                                     │
│  ... no activity ...                                │
│                                                     │
│  11:10 AM - Session expires → Redis deletes        │
│             ❌ Next request → Not authenticated    │
│                                                     │
│  Security: Inactive user auto-logged out!          │
│  Cost: Memory freed automatically!                 │
└─────────────────────────────────────────────────────┘`,
  keyConcepts: [
    { title: 'TTL', explanation: 'Time-To-Live: auto-delete after expiration', icon: '⏰' },
    { title: 'Sliding Window', explanation: 'TTL resets on each access (keeps active users logged in)', icon: '🪟' },
    { title: 'SETEX', explanation: 'Redis command to set value with TTL', icon: '⚙️' },
    { title: 'EXPIRE', explanation: 'Redis command to reset TTL on existing key', icon: '🔄' },
  ],
  quickCheck: {
    question: 'What happens to a session\'s TTL when the user makes a request?',
    options: [
      'TTL stays the same',
      'TTL resets to the original duration (sliding window)',
      'TTL decreases faster',
      'Session is deleted',
    ],
    correctIndex: 1,
    explanation: 'With sliding window TTL, each access resets the expiration timer. This keeps active users logged in while auto-logging out inactive users.',
  },
};

const step7: GuidedStep = {
  id: 'session-store-step-7',
  stepNumber: 7,
  frIndex: 5,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'System must automatically clean up inactive sessions',
    taskDescription: 'Build full system and configure Redis TTL strategy',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Multiple instances', displayName: 'App Server' },
      { type: 'cache', reason: 'Configure TTL strategy', displayName: 'Redis Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB distributes to servers' },
      { from: 'App Server', to: 'Cache', reason: 'Servers use Redis with TTL' },
    ],
    successCriteria: [
      'Build full architecture with all configurations',
      'Click Redis Cache → Set TTL to 30 minutes with sliding window',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheReplication: true,
    requireMultipleAppInstances: true,
    requireCacheTTL: true,
  },
  hints: {
    level1: 'Build full system and configure Redis TTL',
    level2: 'Add all components, configure everything, then set Redis TTL strategy with sliding window',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 8: Final Exam - Production Validation
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💰',
  scenario: "Final Exam! It's time to prove your session store works in production.",
  hook: "Your architecture will be tested against real-world test cases: concurrent users, Redis failover, TTL expiration, and cost constraints.",
  challenge: "Build a complete system that passes ALL test cases while staying under budget. This is exactly what you'd face in a real interview!",
  illustration: 'final-exam',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Final Exam - All Test Cases Passed!",
  achievement: "Complete session store validated against production requirements",
  metrics: [
    { label: 'Test Cases Passed', after: 'All ✓' },
    { label: 'Availability', after: '99.99%' },
    { label: 'All Requirements', after: 'Met ✓' },
  ],
  nextTeaser: "Congratulations! You've mastered distributed session management. Try 'Solve on Your Own' mode or tackle a new challenge!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Production Readiness Checklist',
  conceptExplanation: `**You've built a production-grade session store!**

**What you've learned:**
1. ✅ Session fundamentals (CRUD operations)
2. ✅ Persistence with Redis (survive restarts)
3. ✅ Distributed sessions (any server handles any user)
4. ✅ High availability (Redis replication + multiple app servers)
5. ✅ TTL strategy (auto-cleanup for security and cost)
6. ✅ Horizontal scaling (load balancing + stateless servers)

**Your architecture handles:**
- 10 million concurrent sessions
- 174K session reads/sec at peak
- < 5ms p99 latency (Redis speed)
- Automatic failover (Redis Sentinel)
- Cost-efficient (TTL reduces memory by 50%)

**This is interview-ready!**

**Next steps for production:**
- Monitoring: Track session count, memory, latency
- Alerts: Redis memory > 80%, failover events
- Backups: Redis RDB snapshots every hour
- Security: Encrypt session data, rotate secrets
- Compliance: GDPR session data retention policies`,
  whyItMatters: 'Understanding session management deeply is critical for any web application. You now know how companies like Netflix, GitHub, and Instagram handle billions of sessions.',
  keyPoints: [
    'Start simple: Client → App Server → Redis',
    'Add HA: Replicate Redis, run multiple app servers',
    'Optimize: Configure TTL, monitor memory usage',
    'Test: Validate with production-realistic test cases',
    'This pattern applies to ANY stateful web application',
  ],
  diagram: `
┌─────────────────────────────────────────────────────┐
│         PRODUCTION SESSION STORE                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────┐                                       │
│  │  Client  │                                       │
│  └────┬─────┘                                       │
│       │                                             │
│       ▼                                             │
│  ┌──────────┐                                       │
│  │    LB    │ ← Health checks                       │
│  └────┬─────┘                                       │
│       │                                             │
│  ┌────┼─────┬─────┐                                 │
│  ▼    ▼     ▼     ▼                                 │
│ [App1][App2][App3] ← Stateless, auto-scale         │
│  └────┬─────┴─────┘                                 │
│       │                                             │
│       ▼                                             │
│  ┌────────────┐                                     │
│  │Redis Primary│ ← Writes + Sentinel                │
│  └────┬───────┘                                     │
│       │                                             │
│  ┌────┼────┐                                        │
│  ▼    ▼    ▼                                        │
│ [R1][R2][R3] ← Replicas, auto-failover             │
│                                                     │
│ TTL: 30min sliding window                          │
│ Cost: ~$400/month for 10M sessions                 │
│ Availability: 99.99%                                │
└─────────────────────────────────────────────────────┘`,
  keyConcepts: [
    { title: 'Distributed Sessions', explanation: 'Any server handles any user (stored in Redis)', icon: '🌐' },
    { title: 'High Availability', explanation: 'Replicated Redis + multiple app servers', icon: '🛡️' },
    { title: 'TTL', explanation: 'Auto-cleanup reduces memory and improves security', icon: '⏰' },
    { title: 'Stateless', explanation: 'App servers store nothing, scale horizontally', icon: '📈' },
  ],
  quickCheck: {
    question: 'What is the MOST important benefit of distributed sessions over sticky sessions?',
    options: [
      'Distributed sessions are cheaper',
      'Distributed sessions are faster',
      'Distributed sessions survive server crashes (high availability)',
      'Distributed sessions use less memory',
    ],
    correctIndex: 2,
    explanation: 'Distributed sessions in Redis mean any server can handle any user. If a server crashes, the load balancer routes to another server with no session loss.',
  },
};

const step8: GuidedStep = {
  id: 'session-store-step-8',
  stepNumber: 8,
  frIndex: 6,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'Final Exam: Pass all production test cases',
    taskDescription: 'Build a complete session store that passes all functional and non-functional requirements',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Right-sized instances', displayName: 'App Server' },
      { type: 'cache', reason: 'Optimized Redis with replication and TTL', displayName: 'Redis Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB distributes to servers' },
      { from: 'App Server', to: 'Cache', reason: 'Servers read/write sessions' },
    ],
    successCriteria: [
      'Pass all functional requirements',
      'Pass high availability tests (Redis failover)',
      'Pass performance tests (latency and throughput)',
      'Pass TTL cleanup tests',
      'Stay under cost budget',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheReplication: true,
    requireMultipleAppInstances: true,
    requireCacheTTL: true,
  },
  hints: {
    level1: 'Build complete system that passes all test cases',
    level2: 'Configure for high availability (Redis replication, 3+ app servers) with TTL enabled',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const sessionStoreGuidedTutorial: GuidedTutorial = {
  problemId: 'session-store-guided',
  problemTitle: 'Build a Distributed Session Store',

  requirementsPhase: sessionStoreRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  finalExamTestCases: [
    {
      name: 'Basic Session CRUD',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Create, read, update, and delete session operations work correctly.',
      traffic: { type: 'mixed', rps: 100, readRps: 80, writeRps: 20 },
      duration: 30,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'Session TTL Expiration',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Sessions expire after TTL and are automatically cleaned up.',
      traffic: { type: 'read', rps: 50, readRps: 50 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.05 },
    },
    {
      name: 'Concurrent Session Updates',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Handle concurrent updates to the same session safely.',
      traffic: { type: 'mixed', rps: 200, readRps: 100, writeRps: 100 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'High Read Throughput',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 10K session reads/sec with p99 < 5ms latency.',
      traffic: { type: 'read', rps: 10000, readRps: 10000 },
      duration: 60,
      passCriteria: { maxP99Latency: 5, maxErrorRate: 0.01 },
    },
    {
      name: 'Redis Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Redis primary fails mid-test. Architecture must maintain availability.',
      traffic: { type: 'mixed', rps: 5000, readRps: 4500, writeRps: 500 },
      duration: 90,
      failureInjection: { type: 'cache_crash', atSecond: 30, recoverySecond: 50 },
      passCriteria: { minAvailability: 0.99, maxDowntime: 10, maxErrorRate: 0.1 },
    },
    {
      name: 'Traffic Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle sudden traffic spike to 20K RPS.',
      traffic: { type: 'mixed', rps: 20000, readRps: 18000, writeRps: 2000 },
      duration: 60,
      passCriteria: { maxP99Latency: 10, maxErrorRate: 0.05 },
    },
    {
      name: 'Cost Efficiency',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Meet performance requirements while staying under budget.',
      traffic: { type: 'mixed', rps: 5000, readRps: 4500, writeRps: 500 },
      duration: 60,
      passCriteria: { maxMonthlyCost: 1000, maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export function getSessionStoreGuidedTutorial(): GuidedTutorial {
  return sessionStoreGuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = sessionStoreRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= sessionStoreRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
