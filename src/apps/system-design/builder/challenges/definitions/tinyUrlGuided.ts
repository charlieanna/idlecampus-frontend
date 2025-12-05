import { GuidedTutorial, GuidedStep, TeachingContent, StoryContent, CelebrationContent } from '../../types/guidedTutorial';

/**
 * TinyURL Guided Tutorial - NARRATIVE EDITION
 *
 * A story-driven step-by-step tutorial that teaches system design concepts
 * while building a URL shortener. Each step tells a story that motivates the task.
 *
 * Flow: Story → Learn → Practice → Celebrate → Next Story
 *
 * The narrative follows a startup journey:
 * 1. "Let's build TinyURL!" - Connect basic pieces
 * 2. "Configure the server" - Write Python code
 * 3. "Oops, we lost all data!" - Add database
 * 4. "Redirects are slow..." - Add cache
 * 5. "We're going viral!" - Add load balancer
 */

// =============================================================================
// STEP 1: The Beginning - Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome, engineer! You've been hired to build TinyURL - a URL shortening service.",
  hook: "Your first task: get the basic system running. Users need to send requests to your server.",
  challenge: "Connect the Client to the App Server to handle user requests.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your system is connected!",
  achievement: "Users can now send requests to your App Server",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can handle requests', after: '✓' },
  ],
  nextTeaser: "But the server is empty... let's write some code!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: App Servers',
  conceptExplanation: `Every web application starts with an **App Server** - the brain of your system.

When a user wants to shorten a URL, their request travels to your app server, which:
1. Receives the HTTP request
2. Processes the business logic
3. Returns the shortened URL

Think of it as a restaurant chef - takes orders, prepares food, serves dishes.`,
  whyItMatters: 'The app server is the entry point for ALL user interactions.',
  keyPoints: [
    'App servers are stateless - they don\'t store permanent data',
    'Each request is independent and self-contained',
    'Horizontal scaling: add more servers to handle more traffic',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────┐
│   Client    │ ──────▶ │   App Server    │
│  (Browser)  │ ◀────── │  (Your Code)    │
└─────────────┘         └─────────────────┘
`,
  keyConcepts: [
    {
      title: 'Request/Response',
      explanation: 'Client sends request → Server processes → Server responds',
      icon: '↔️',
    },
  ],
  quickCheck: {
    question: 'What does the App Server do?',
    options: [
      'Stores data permanently',
      'Processes requests and returns responses',
      'Balances traffic across servers',
      'Caches frequently accessed data',
    ],
    correctIndex: 1,
    explanation: 'The App Server receives requests, processes business logic, and returns responses to clients.',
  },
};

const step1: GuidedStep = {
  id: 'tinyurl-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Users can submit requests to the system',
    taskDescription: 'Connect the Client to the App Server',
    componentsNeeded: [
      { type: 'app_server', reason: 'Processes requests', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send requests' },
    ],
    successCriteria: ['Add App Server', 'Connect Client → App Server'],
  },
  validation: {
    requiredComponents: ['app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'Click "+ Add" to add an App Server, then draw a connection from Client to it',
    level2: 'Add the App Server component, then click and drag from Client to App Server to connect them',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Configure the App Server with Python Code
// =============================================================================

const step2Story: StoryContent = {
  emoji: '⚙️',
  scenario: "Your App Server is connected, but it's just an empty box right now.",
  hook: "It doesn't know HOW to shorten URLs or redirect users. We need to teach it!",
  challenge: "Configure the App Server with APIs and write the Python code to handle URL shortening.",
  illustration: 'configure-server',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Your App Server is now functional!",
  achievement: "Users can create short URLs and get redirected",
  metrics: [
    { label: 'APIs configured', after: '2 endpoints' },
    { label: 'Code written', after: '✓ Working' },
  ],
  nextTeaser: "But wait... what happens when the server restarts?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Design & Implementation',
  conceptExplanation: `Your App Server needs to handle two main operations:

**1. Create Short URL (POST /api/v1/urls)**
- Receives: Original long URL
- Returns: Shortened URL code
- Logic: Generate unique code, store mapping

**2. Redirect (GET /api/v1/urls/:code)**
- Receives: Short code
- Returns: Redirect to original URL
- Logic: Look up code, return original URL

The code you write here is the "brain" of your URL shortener!`,
  whyItMatters: 'Without the code, your server is just an empty shell. The Python handlers define what actually happens when users interact with your system.',
  keyPoints: [
    'POST endpoint creates new short URLs',
    'GET endpoint redirects users to original URLs',
    'Each endpoint needs proper error handling',
    'Short codes should be unique and URL-safe',
  ],
  diagram: `
POST /api/v1/urls
┌─────────────────────────────────────────────────┐
│ Request:  { "url": "https://very-long-url..." } │
│ Response: { "short_code": "abc123" }            │
└─────────────────────────────────────────────────┘

GET /api/v1/urls/abc123
┌─────────────────────────────────────────────────┐
│ Response: 302 Redirect → https://very-long-url  │
└─────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'REST API', explanation: 'POST to create, GET to read/redirect', icon: '🔌' },
    { title: 'Short Code', explanation: 'Unique identifier like "abc123" for each URL', icon: '🔑' },
  ],
  quickCheck: {
    question: 'Which HTTP method should be used to CREATE a new short URL?',
    options: [
      'GET - because we\'re getting a short URL back',
      'POST - because we\'re creating a new resource',
      'PUT - because we\'re updating the URL',
      'DELETE - because we\'re shortening (removing length)',
    ],
    correctIndex: 1,
    explanation: 'POST is used to create new resources. We\'re creating a new short URL mapping.',
  },
};

const step2: GuidedStep = {
  id: 'tinyurl-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'App Server must handle URL shortening and redirects',
    taskDescription: 'Configure the App Server: assign APIs and write Python code',
    componentsNeeded: [],
    connectionsNeeded: [],
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/urls and GET /api/v1/urls/* APIs',
      'Write Python code for the endpoints',
    ],
  },
  validation: {
    requiredComponents: ['app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true, // Step 2 requires APIs to be assigned
  },
  hints: {
    level1: 'Click on the App Server node to open the configuration panel',
    level2: 'In the inspector, assign the POST and GET APIs, then switch to the Python tab to write code',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: The Crisis - We Lost All Data!
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 3 AM. Your server crashed and restarted.",
  hook: "When it came back online... ALL the shortened URLs were GONE! Users are furious - their links don't work anymore!",
  challenge: "The problem: data was stored in server memory. When the server restarted, everything vanished. We need persistent storage!",
  illustration: 'server-crash',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Your data is now safe!",
  achievement: "URL mappings persist even if the server restarts",
  metrics: [
    { label: 'Data durability', before: '❌ Lost on restart', after: '✓ Persisted forever' },
    { label: 'Storage', after: 'PostgreSQL Database' },
  ],
  nextTeaser: "Nice! But users are complaining that redirects are slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Data Persistence: Why Databases Matter',
  conceptExplanation: `Without a database, your app server stores data in memory (RAM).

**Problem**: RAM is volatile - when the server restarts, all data is lost!

**Solution**: Store data in a database. Databases write to disk and ensure your data survives:
- Server crashes
- Restarts
- Power outages
- Hardware failures (with replication)

For TinyURL, we need to store: \`short_code → original_url\` mappings.`,
  whyItMatters: 'Without persistent storage, all your shortened URLs disappear when the server restarts!',
  realWorldExample: {
    company: 'Bitly',
    scenario: 'Storing billions of URL mappings',
    howTheyDoIt: 'Uses MySQL for metadata and Redis for hot data. Handles 10,000+ writes/second.',
  },
  keyPoints: [
    'RAM is volatile, databases persist to disk',
    'URL shorteners have a key-value pattern: short_code → URL',
    'Read-heavy workload: ~100:1 read-to-write ratio',
  ],
  diagram: `
┌─────────────┐       ┌─────────────┐       ┌────────────────┐
│   Client    │ ────▶ │ App Server  │ ────▶ │   Database     │
└─────────────┘       └─────────────┘       │                │
                                            │  abc123 → url1 │
                                            │  xyz789 → url2 │
                                            └────────────────┘
`,
  keyConcepts: [
    { title: 'Persistence', explanation: 'Data survives restarts and crashes', icon: '💾' },
    { title: 'Key-Value', explanation: 'Simple lookup: key (short_code) → value (URL)', icon: '🔑' },
  ],
  quickCheck: {
    question: 'Why did we lose all data when the server restarted?',
    options: [
      'The database was deleted',
      'Data was only stored in RAM (memory), which is volatile',
      'The network connection failed',
      'Users deleted their URLs',
    ],
    correctIndex: 1,
    explanation: 'RAM is volatile - it loses all data when power is lost. Databases persist data to disk.',
  },
};

const step3: GuidedStep = {
  id: 'tinyurl-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'URL mappings must persist durably',
    taskDescription: 'Add a Database and connect it to the App Server',
    componentsNeeded: [
      { type: 'database', reason: 'Stores URLs persistently', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes URL mappings' },
    ],
    successCriteria: ['Add Database', 'Connect App Server → Database'],
  },
  validation: {
    requiredComponents: ['app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'What component stores data permanently?',
    level2: 'Add a Database and connect App Server to it',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: The Slowdown - Redirects Are Taking Forever
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐢',
  scenario: "Your URL shortener is getting popular! But users are complaining...",
  hook: '"Why does it take 200ms just to redirect me?" Every. Single. Click. Hits the database. That\'s expensive!',
  challenge: "The hot URLs (viral content) are being clicked thousands of times per minute. We're hammering the database unnecessarily!",
  illustration: 'slow-turtle',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Redirects are now lightning fast!",
  achievement: "Popular URLs are served from cache in milliseconds",
  metrics: [
    { label: 'Redirect latency', before: '200ms', after: '2ms' },
    { label: 'Database load', before: '10,000 queries/sec', after: '500 queries/sec' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "Awesome! But suddenly your service gets featured on Hacker News...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Secret to Speed',
  conceptExplanation: `**Key insight**: URL shorteners are read-heavy. For every URL created, it might be clicked 1000+ times.

**The math**:
- Database query: 10-50ms
- Cache lookup: 1-5ms
- That's **10-50x faster!**

**How caching works**:
1. User clicks short URL
2. Check cache: Is "abc123" in Redis?
3. **Cache HIT**: Return immediately (2ms)
4. **Cache MISS**: Query database, store in cache, return (50ms)

The 20% of URLs that get 80% of traffic stay hot in cache.`,
  whyItMatters: 'Without caching, every redirect hits the database. At scale, the database becomes the bottleneck.',
  realWorldExample: {
    company: 'Twitter (t.co)',
    scenario: 'Handling viral tweets with millions of clicks',
    howTheyDoIt: 'Redis clusters cache popular links. When a celebrity tweets, that URL gets 1M clicks/hour - all served from cache.',
  },
  keyPoints: [
    'Cache-aside pattern: Check cache first, then database',
    'Set TTL to prevent stale data',
    '95%+ cache hit ratio is achievable for URL shorteners',
  ],
  diagram: `
                          ┌─────────────┐
                   ┌────▶ │    Cache    │ ← 2ms
                   │      │   (Redis)   │
┌────────┐    ┌────┴─────┐└─────────────┘
│ Client │───▶│App Server│      │ miss?
└────────┘    └────┬─────┘      ▼
                   └────▶ ┌─────────────┐
                          │  Database   │ ← 50ms
                          └─────────────┘
`,
  keyConcepts: [
    { title: 'Cache-Aside', explanation: 'Check cache first, DB on miss, update cache', icon: '📦' },
    { title: 'TTL', explanation: 'Time-To-Live: cached data expires automatically', icon: '⏰' },
  ],
  quickCheck: {
    question: 'What happens on a cache MISS?',
    options: [
      'Return an error',
      'Query database, return result, update cache',
      'Wait for cache to be populated',
      'Redirect to a different server',
    ],
    correctIndex: 1,
    explanation: 'On a cache miss, we query the database, return the result to the user, and store it in cache for next time.',
  },
};

const step4: GuidedStep = {
  id: 'tinyurl-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Redirects must be fast (< 10ms p99)',
    taskDescription: 'Add a Cache (Redis) and connect it to the App Server',
    componentsNeeded: [
      { type: 'cache', reason: 'Caches hot URLs for fast lookups', displayName: 'Cache (Redis)' },
    ],
    connectionsNeeded: [
      { from: 'App Server', to: 'Cache', reason: 'Server checks cache before database' },
    ],
    successCriteria: ['Add Cache', 'Connect App Server → Cache'],
  },
  validation: {
    requiredComponents: ['app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'What stores data in memory for ultra-fast access?',
    level2: 'Add a Cache and connect your App Server to it',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: The Surge - We're Going Viral!
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📈',
  scenario: "BREAKING: Your service just got featured on Hacker News!",
  hook: "Traffic just spiked 100x! Your single App Server is melting - it can only handle 1,000 requests/second, but you're getting 50,000!",
  challenge: "One server isn't enough. We need to distribute traffic across multiple servers to handle the load!",
  illustration: 'traffic-spike',
};

const step5Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "You've built a scalable system!",
  achievement: "Your TinyURL handles massive traffic with high availability",
  metrics: [
    { label: 'Capacity', before: '1,000 req/s', after: '100,000 req/s' },
    { label: 'Availability', before: 'Single point of failure', after: '99.99% uptime' },
    { label: 'Servers', before: '1', after: 'Auto-scaling' },
  ],
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Handling the Traffic',
  conceptExplanation: `One app server handles ~1,000-10,000 req/s. What if you need 100,000?

**Solution**: Multiple servers behind a **Load Balancer**

The load balancer:
1. Receives ALL incoming traffic
2. Distributes requests across servers
3. Detects unhealthy servers and removes them
4. Enables zero-downtime deployments

**Algorithms**:
- **Round Robin**: Rotate through servers
- **Least Connections**: Send to least busy server
- **IP Hash**: Same client → same server`,
  whyItMatters: 'Load balancers provide scalability (handle more traffic) and availability (survive server failures).',
  realWorldExample: {
    company: 'Netflix',
    scenario: '200+ million subscribers streaming',
    howTheyDoIt: 'AWS load balancers distribute traffic across thousands of servers. When a show drops, traffic spikes 10x.',
  },
  keyPoints: [
    'Horizontal scaling: more servers = more capacity',
    'Health checks remove failed servers automatically',
    'No single point of failure for app servers',
  ],
  diagram: `
                              ┌─────────────┐
                        ┌────▶│ App Server 1│
                        │     └─────────────┘
┌────────┐   ┌─────────┐│     ┌─────────────┐
│ Client │──▶│   LB    │┼────▶│ App Server 2│
└────────┘   └─────────┘│     └─────────────┘
                        │     ┌─────────────┐
                        └────▶│ App Server 3│
                              └─────────────┘
`,
  keyConcepts: [
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle more load', icon: '📈' },
    { title: 'Health Checks', explanation: 'LB pings servers, removes unhealthy ones', icon: '💓' },
  ],
  quickCheck: {
    question: 'What is the main benefit of a load balancer?',
    options: [
      'Reduces database queries',
      'Encrypts all traffic',
      'Distributes traffic for scale and availability',
      'Caches static content',
    ],
    correctIndex: 2,
    explanation: 'Load balancers distribute traffic across multiple servers for horizontal scaling and high availability.',
  },
};

const step5: GuidedStep = {
  id: 'tinyurl-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'System must handle 100K requests/second',
    taskDescription: 'Add a Load Balancer in front of the App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'All traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB forwards to servers' },
    ],
    successCriteria: [
      'Add Load Balancer',
      'Connect Client → Load Balancer',
      'Connect Load Balancer → App Server',
    ],
  },
  validation: {
    requiredComponents: ['app_server', 'database', 'cache', 'load_balancer'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'What distributes traffic across multiple servers?',
    level2: 'Add a Load Balancer. Connect Client → LB → App Server',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: The Crash - Database Goes Down!
// =============================================================================

const step6Story: StoryContent = {
  emoji: '💥',
  scenario: "3 AM. Your phone is blowing up. The database server crashed!",
  hook: "All your URLs are gone. Millions of links now return 404. Twitter is roasting you. Your boss is calling. This is a nightmare!",
  challenge: "One database server is a single point of failure. We need redundancy - if one goes down, another takes over!",
  illustration: 'server-crash',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "Your data is now protected!",
  achievement: "Database High Availability configured",
  metrics: [
    { label: 'Availability', before: '99%', after: '99.9%' },
    { label: 'Data Loss Risk', before: 'High', after: 'Near Zero' },
    { label: 'Failover Time', before: 'Hours', after: 'Seconds' },
  ],
  nextTeaser: "But one App Server still can't handle all this traffic...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication',
  conceptExplanation: `When your database crashes, all your data is gone - unless you have **replicas** (copies).

**Three main replication strategies:**

**1. Single Leader (Master-Slave)**
- One primary handles all writes
- Replicas handle reads only
- Simple, strong consistency for writes
- If master fails, promote a replica

**2. Multi-Leader (Master-Master)**
- Multiple primaries can accept writes
- Great for geo-distributed systems
- Complex: needs conflict resolution
- What if NYC writes "abc" → google.com while Tokyo writes "abc" → amazon.com?

**3. Leaderless (Dynamo-style)**
- No primary - any node accepts writes
- Uses quorum: "Write to 3 nodes, read from 2"
- Eventual consistency
- Used by Cassandra, DynamoDB`,
  whyItMatters: 'Without replication, a single disk failure loses all your data. With replication, you can survive server crashes, perform maintenance, and even survive entire datacenter failures.',
  realWorldExample: {
    company: 'GitHub',
    scenario: 'In 2018, GitHub had a 24-hour outage when their MySQL primary failed.',
    howTheyDoIt: 'They now use multi-region replication with automatic failover. When the US-East primary fails, US-West takes over in seconds.',
  },
  keyPoints: [
    'Single Leader: Best for TinyURL (simple, strong consistency for writes)',
    'Replicas = copies of your data on different servers',
    'Async replication: faster but may lose recent writes on crash',
    'Sync replication: slower but zero data loss',
    'More replicas = better availability but higher cost',
  ],
  diagram: `
┌─────────────────────────────────────────────────────┐
│              SINGLE LEADER REPLICATION              │
├─────────────────────────────────────────────────────┤
│                                                     │
│     ┌─────────┐     writes     ┌─────────┐         │
│     │   App   │ ─────────────→ │ Primary │         │
│     │ Server  │                │  (Leader)│         │
│     └────┬────┘                └────┬────┘         │
│          │                          │              │
│          │ reads                    │ replicate    │
│          │                          ▼              │
│          │                    ┌─────────┐          │
│          └──────────────────→ │ Replica │          │
│                               │(Follower)│          │
│                               └─────────┘          │
│                                                     │
│  If Primary fails → Promote Replica to Primary     │
└─────────────────────────────────────────────────────┘`,
  keyConcepts: [
    { title: 'Failover', explanation: 'Automatic switch to replica when primary fails', icon: '🔄' },
    { title: 'Replication Lag', explanation: 'Delay between write to primary and sync to replica', icon: '⏱️' },
    { title: 'Split Brain', explanation: 'Dangerous: two primaries accepting writes (data conflict!)', icon: '🧠' },
    { title: 'Quorum', explanation: 'Majority agreement needed for consistency (e.g., 2 of 3 nodes)', icon: '🗳️' },
  ],
  quickCheck: {
    question: 'For TinyURL, which replication strategy is best?',
    options: [
      'Multi-Leader (for geo-distribution)',
      'Single Leader (simple, consistent writes)',
      'Leaderless (eventual consistency is fine)',
      'No replication (saves money)',
    ],
    correctIndex: 1,
    explanation: 'Single Leader is best for TinyURL: writes are simple (create short code), consistency matters (same code = same URL), and it\'s easy to operate.',
  },
};

const step6: GuidedStep = {
  id: 'tinyurl-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'System must survive database failures (99.9% availability)',
    taskDescription: 'Configure database replication for high availability',
    componentsNeeded: [],
    connectionsNeeded: [],
    successCriteria: [
      'Click on the Database component',
      'Go to "Replication & Scaling" tab',
      'Select "Single Leader (Master-Slave)" strategy',
      'Set at least 2 replicas',
    ],
  },
  validation: {
    requiredComponents: ['app_server', 'database', 'cache', 'load_balancer'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'Your database needs backup copies (replicas)',
    level2: 'Click Database → Replication & Scaling → Enable replication with 2+ replicas',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: The Scale - Multiple App Servers
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📈',
  scenario: "Your Load Balancer is ready, but it's only balancing to ONE server!",
  hook: "That single App Server can handle 1,000 requests/second. But you're getting 10,000! Users see timeout errors. The server CPU is at 100%.",
  challenge: "One server isn't enough. We need to scale horizontally - run multiple copies of our App Server!",
  illustration: 'horizontal-scaling',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "You've built a production-ready system!",
  achievement: "Horizontally scalable architecture complete",
  metrics: [
    { label: 'Capacity', before: '1K RPS', after: '10K+ RPS' },
    { label: 'Single Points of Failure', before: '3', after: '0' },
    { label: 'Availability', before: '99%', after: '99.99%' },
  ],
  nextTeaser: "Congratulations! You've completed the TinyURL system design journey!",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling',
  conceptExplanation: `**Vertical Scaling** = Bigger server (more CPU, RAM)
- Limited: can't add infinite CPU to one machine
- Expensive: 2x CPU often costs 4x price
- Single point of failure

**Horizontal Scaling** = More servers
- Unlimited: add as many servers as needed
- Cost-effective: use commodity hardware
- Redundant: if one fails, others continue

**For TinyURL:**
- App Servers are **stateless** (no data stored locally)
- Load Balancer distributes requests evenly
- Any server can handle any request
- Add/remove servers based on traffic`,
  whyItMatters: 'Horizontal scaling is how tech giants handle billions of requests. Google, Netflix, and Amazon all run thousands of servers behind load balancers.',
  realWorldExample: {
    company: 'Netflix',
    scenario: 'When a popular show drops, traffic spikes 10x in minutes.',
    howTheyDoIt: 'Auto-scaling: AWS automatically spins up new servers when CPU > 70%, removes them when traffic drops. They can go from 100 to 1000 servers in minutes.',
  },
  keyPoints: [
    'Stateless servers = easy horizontal scaling',
    'Load Balancer distributes traffic evenly',
    'Multiple instances = no single point of failure',
    'Auto-scaling adjusts capacity to traffic',
    'Start with 2-3 instances minimum for high availability',
  ],
  diagram: `
┌─────────────────────────────────────────────────────┐
│              HORIZONTAL SCALING                     │
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
│     ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│     │  App 1  │ │  App 2  │ │  App 3  │            │
│     │ Server  │ │ Server  │ │ Server  │            │
│     └────┬────┘ └────┬────┘ └────┬────┘            │
│          └───────────┼───────────┘                 │
│                      ▼                              │
│            ┌────────────────┐                       │
│            │   Database     │                       │
│            │  (replicated)  │                       │
│            └────────────────┘                       │
└─────────────────────────────────────────────────────┘`,
  keyConcepts: [
    { title: 'Stateless', explanation: 'Server stores no user data - any server can handle any request', icon: '🔄' },
    { title: 'Auto-Scaling', explanation: 'Automatically add/remove servers based on load', icon: '📊' },
    { title: 'Health Checks', explanation: 'LB removes unhealthy servers from rotation', icon: '💓' },
    { title: 'Session Affinity', explanation: 'Optional: route same user to same server (not needed for stateless)', icon: '🎯' },
  ],
  quickCheck: {
    question: 'Why can TinyURL App Servers scale horizontally?',
    options: [
      'They use special scaling software',
      'They are stateless - no local data',
      'They have lots of RAM',
      'They run on special hardware',
    ],
    correctIndex: 1,
    explanation: 'TinyURL App Servers are stateless - they just process requests and query the database. Since they don\'t store data locally, any server can handle any request.',
  },
};

const step7: GuidedStep = {
  id: 'tinyurl-step-7',
  stepNumber: 7,
  frIndex: 5,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'System must handle 10K+ requests/second',
    taskDescription: 'Scale App Servers horizontally',
    componentsNeeded: [],
    connectionsNeeded: [],
    successCriteria: [
      'Click on the App Server component',
      'Increase "Instances" to 3 or more',
      'This gives you 3x the capacity!',
    ],
  },
  validation: {
    requiredComponents: ['app_server', 'database', 'cache', 'load_balancer'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },
  hints: {
    level1: 'You need more than one App Server',
    level2: 'Click App Server → Set Instances to 3 or more',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: The Stale Data - Cache Strategy Deep Dive
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🔄',
  scenario: "A user shortened 'bit.ly/sale' to their store. Then they updated it to point to a new page.",
  hook: "But users clicking the link still see the OLD page! The cache is serving stale data. Some users see the new page, others see the old one. Chaos!",
  challenge: "We need to configure our cache strategy properly - when to cache, when to invalidate, and how long data should live.",
  illustration: 'stale-cache',
};

const step8Celebration: CelebrationContent = {
  emoji: '✨',
  message: "Your cache is now properly configured!",
  achievement: "Cache strategy optimized for consistency",
  metrics: [
    { label: 'Cache Hit Rate', before: '60%', after: '95%' },
    { label: 'Stale Data Risk', before: 'High', after: 'Minimal' },
    { label: 'DB Load', before: '100%', after: '10%' },
  ],
  nextTeaser: "Now let's make sure our system can handle the traffic load...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Strategies & Invalidation',
  conceptExplanation: `**Four main caching strategies:**

**1. Cache-Aside (Lazy Loading)** ⭐ Best for TinyURL
- App checks cache first
- On miss: App queries DB, then updates cache
- On write: App updates DB, invalidates cache
- You control exactly what gets cached

**2. Read-Through**
- Cache sits between App and DB
- On miss: Cache automatically queries DB
- Simpler code, but less control

**3. Write-Through**
- Every write goes to cache AND DB synchronously
- Strong consistency, but slower writes
- Good for financial systems

**4. Write-Behind (Write-Back)**
- Write to cache, async write to DB later
- Fast writes, but risk of data loss
- Good for analytics, logs

**For TinyURL:** Cache-Aside is perfect because:
- Reads are 90% of traffic (cache them!)
- Writes are rare (just invalidate on write)
- Eventual consistency is OK (few seconds delay acceptable)`,
  whyItMatters: 'Wrong cache strategy = stale data, inconsistency, or wasted resources. TinyURL with write-through would slow down every URL creation unnecessarily.',
  realWorldExample: {
    company: 'Facebook',
    scenario: 'A post gets millions of views but is rarely edited.',
    howTheyDoIt: 'They use cache-aside with aggressive TTL. When a post is edited, they invalidate the cache key. The next read repopulates it.',
  },
  keyPoints: [
    'Cache-Aside: Best for read-heavy, eventual consistency OK',
    'Write-Through: Best for strong consistency requirements',
    'TTL (Time-To-Live): Auto-expire cached data after X seconds',
    'Invalidation: Explicitly remove stale data on writes',
    'TinyURL: Use cache-aside with 1-hour TTL',
  ],
  diagram: `
┌─────────────────────────────────────────────────────┐
│              CACHE-ASIDE PATTERN                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  READ (Cache Hit):                                  │
│  ┌─────┐  1. get   ┌─────┐                         │
│  │ App │ ────────→ │Cache│ ──→ Return data         │
│  └─────┘           └─────┘                         │
│                                                     │
│  READ (Cache Miss):                                 │
│  ┌─────┐  1. get   ┌─────┐  miss                   │
│  │ App │ ────────→ │Cache│ ────→                   │
│  └──┬──┘           └─────┘      │                  │
│     │ 2. query        ↑         │                  │
│     ▼                 │ 3. set  │                  │
│  ┌─────┐              │         │                  │
│  │ DB  │ ─────────────┘         │                  │
│  └─────┘                        │                  │
│                                                     │
│  WRITE:                                             │
│  ┌─────┐  1. write  ┌─────┐                        │
│  │ App │ ─────────→ │ DB  │                        │
│  └──┬──┘            └─────┘                        │
│     │ 2. invalidate                                │
│     ▼                                               │
│  ┌─────┐                                           │
│  │Cache│  (delete key)                             │
│  └─────┘                                           │
└─────────────────────────────────────────────────────┘`,
  keyConcepts: [
    { title: 'TTL', explanation: 'Time-To-Live: cache auto-expires after N seconds', icon: '⏰' },
    { title: 'Cache Miss', explanation: 'Data not in cache, must query database', icon: '❌' },
    { title: 'Cache Hit', explanation: 'Data found in cache, fast response!', icon: '✅' },
    { title: 'Invalidation', explanation: 'Remove stale data when source changes', icon: '🗑️' },
  ],
  quickCheck: {
    question: 'Why is cache-aside best for TinyURL?',
    options: [
      'It\'s the fastest strategy',
      'It\'s read-heavy and eventual consistency is OK',
      'It prevents all cache misses',
      'It\'s the cheapest option',
    ],
    correctIndex: 1,
    explanation: 'TinyURL is 90% reads, and users can tolerate a few seconds of stale data. Cache-aside lets us cache reads efficiently while keeping writes simple.',
  },
};

const step8: GuidedStep = {
  id: 'tinyurl-step-8',
  stepNumber: 8,
  frIndex: 6,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'System must serve consistent data with high cache hit rate',
    taskDescription: 'Configure cache strategy and TTL',
    componentsNeeded: [],
    connectionsNeeded: [],
    successCriteria: [
      'Click on the Cache component',
      'Set Strategy to "Cache-Aside"',
      'Set TTL to 3600 seconds (1 hour)',
      'Enable "Invalidate on Write"',
    ],
  },
  validation: {
    requiredComponents: ['app_server', 'database', 'cache', 'load_balancer'],
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
    level1: 'Your cache needs a proper strategy configured',
    level2: 'Click Cache → Set strategy to cache-aside with TTL',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 9: The Overload - Capacity Planning
// =============================================================================

const step9Story: StoryContent = {
  emoji: '📊',
  scenario: "Black Friday! Your URL shortener is being used for all the sale links.",
  hook: "Traffic doubled overnight. Your database is at 95% CPU. Writes are timing out. The cache is helping reads, but every new short URL creation takes 5 seconds!",
  challenge: "We need to properly size our components. How many requests can each handle? Do we have enough capacity?",
  illustration: 'capacity-planning',
};

const step9Celebration: CelebrationContent = {
  emoji: '📈',
  message: "Your system is properly sized!",
  achievement: "Capacity planning complete",
  metrics: [
    { label: 'DB Utilization', before: '95%', after: '40%' },
    { label: 'Write Latency', before: '5000ms', after: '50ms' },
    { label: 'Headroom', before: '5%', after: '60%' },
  ],
  nextTeaser: "Finally, let's make sure we're not overspending...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Capacity Planning',
  conceptExplanation: `**The capacity planning formula:**

\`\`\`
Required Capacity = Peak Traffic × Safety Margin
\`\`\`

**For TinyURL at 1000 RPS:**
- 90% reads = 900 read RPS
- 10% writes = 100 write RPS

**Cache absorbs most reads:**
- 95% cache hit rate → only 45 reads hit DB
- Total DB load: 45 reads + 100 writes = 145 RPS

**Sizing your database:**
- PostgreSQL on good hardware: ~500 writes/sec
- With replication: reads scale with replicas
- Rule of thumb: keep utilization < 70%

**Sizing formula:**
\`\`\`
DB Write Capacity needed = Write RPS ÷ 0.7
100 writes ÷ 0.7 = 143 write capacity minimum
\`\`\`

**Always add headroom** for:
- Traffic spikes (2-3x normal)
- Maintenance windows
- Failure scenarios`,
  whyItMatters: 'Under-provisioned systems fail under load. Over-provisioned systems waste money. Capacity planning finds the sweet spot.',
  realWorldExample: {
    company: 'Twitter',
    scenario: 'Super Bowl generates 10x normal tweet volume.',
    howTheyDoIt: 'They pre-scale 3x before major events. Their capacity planning models predict load from historical data + expected viewership.',
  },
  keyPoints: [
    'Calculate: Peak RPS × Read/Write ratio',
    'Account for cache hit rate (reduces DB reads)',
    'Keep component utilization under 70%',
    'Plan for 2-3x traffic spikes',
    'Database writes are usually the bottleneck',
  ],
  diagram: `
┌─────────────────────────────────────────────────────┐
│              CAPACITY PLANNING                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Traffic: 1000 RPS (90% reads, 10% writes)         │
│                                                     │
│  ┌──────────────┐                                  │
│  │   1000 RPS   │                                  │
│  └──────┬───────┘                                  │
│         │                                          │
│         ▼                                          │
│  ┌──────────────┐     ┌──────────────┐            │
│  │ 900 Reads    │     │ 100 Writes   │            │
│  └──────┬───────┘     └──────┬───────┘            │
│         │                    │                     │
│         ▼                    │                     │
│  ┌──────────────┐            │                     │
│  │    Cache     │            │                     │
│  │  95% hits    │            │                     │
│  └──────┬───────┘            │                     │
│         │                    │                     │
│    45 misses                 │                     │
│         │                    │                     │
│         ▼                    ▼                     │
│  ┌────────────────────────────────┐               │
│  │         Database               │               │
│  │   45 reads + 100 writes        │               │
│  │   = 145 RPS total              │               │
│  │   Need: 200+ capacity          │               │
│  └────────────────────────────────┘               │
└─────────────────────────────────────────────────────┘`,
  keyConcepts: [
    { title: 'Throughput', explanation: 'Requests per second a component can handle', icon: '⚡' },
    { title: 'Utilization', explanation: 'Current load ÷ Max capacity (keep < 70%)', icon: '📊' },
    { title: 'Headroom', explanation: 'Extra capacity for spikes and failures', icon: '🎯' },
    { title: 'Bottleneck', explanation: 'The component that limits overall system capacity', icon: '🚧' },
  ],
  quickCheck: {
    question: 'If you have 100 write RPS and want 70% max utilization, what DB write capacity do you need?',
    options: [
      '70 writes/sec',
      '100 writes/sec',
      '143 writes/sec',
      '200 writes/sec',
    ],
    correctIndex: 2,
    explanation: '100 ÷ 0.7 = 143. You need 143 write capacity to keep utilization at 70% with 100 writes/sec.',
  },
};

const step9: GuidedStep = {
  id: 'tinyurl-step-9',
  stepNumber: 9,
  frIndex: 7,
  story: step9Story,
  celebration: step9Celebration,
  learnPhase: step9LearnPhase,
  practicePhase: {
    frText: 'System must handle 1000 RPS with headroom',
    taskDescription: 'Configure component capacities',
    componentsNeeded: [],
    connectionsNeeded: [],
    successCriteria: [
      'Click on the Database component',
      'Set Write Capacity to at least 200',
      'This gives headroom for traffic spikes',
    ],
  },
  validation: {
    requiredComponents: ['app_server', 'database', 'cache', 'load_balancer'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
    requireDatabaseCapacity: true,
  },
  hints: {
    level1: 'Your database needs enough write capacity',
    level2: 'Click Database → Set write capacity to 200+',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 10: The Bill - Cost Optimization
// =============================================================================

const step10Story: StoryContent = {
  emoji: '💰',
  scenario: "End of month. The cloud bill arrives. Your CFO is NOT happy.",
  hook: "You're spending $2,000/month on infrastructure for a service that makes $500/month. That's not sustainable! Time to optimize.",
  challenge: "We need to meet all our requirements (latency, availability, capacity) while staying within budget. Every dollar counts!",
  illustration: 'cost-optimization',
};

const step10Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Congratulations! You've built a production-ready TinyURL!",
  achievement: "Complete system design with cost optimization",
  metrics: [
    { label: 'Monthly Cost', before: '$2,000', after: '$400' },
    { label: 'Cost per 1M requests', before: '$0.80', after: '$0.16' },
    { label: 'All Requirements', after: 'Met ✓' },
  ],
  nextTeaser: "You've completed the TinyURL system design journey! Try the 'Solve on Your Own' mode to test your skills.",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization',
  conceptExplanation: `**Cloud costs add up fast:**

| Component | Typical Cost |
|-----------|-------------|
| App Server (t3.medium) | ~$30/month |
| PostgreSQL (db.t3.medium) | ~$50/month |
| + Each replica | +$50/month |
| Redis Cache (1GB) | ~$15/month |
| Load Balancer | ~$20/month |

**Cost optimization strategies:**

**1. Right-size instances**
- Don't use m5.xlarge when t3.small works
- Monitor utilization, downsize if < 30%

**2. Use spot/preemptible for stateless**
- App servers can use spot instances (70% cheaper)
- Not for databases (data loss risk!)

**3. Reserved instances for steady workloads**
- 1-year commitment = 30-40% savings
- 3-year commitment = 50-60% savings

**4. Cache aggressively**
- Cache hit = no DB query = cheaper
- Redis is much cheaper than DB scaling

**5. Optimize replicas**
- 2 replicas for HA is often enough
- Don't over-provision "just in case"`,
  whyItMatters: 'Startups fail when they can\'t control cloud costs. Knowing how to meet requirements at minimum cost is a key engineering skill.',
  realWorldExample: {
    company: 'Dropbox',
    scenario: 'They were spending $75M/year on AWS S3.',
    howTheyDoIt: 'They built their own storage infrastructure. Saved $75M over 2 years. But this only makes sense at massive scale!',
  },
  keyPoints: [
    'Start small, scale up based on actual usage',
    'Cache reduces expensive DB operations',
    'Spot instances for stateless components',
    'Reserved instances for predictable workloads',
    'Monitor costs weekly, optimize monthly',
  ],
  diagram: `
┌─────────────────────────────────────────────────────┐
│              TINYURL COST BREAKDOWN                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Component          Count    Cost      Total       │
│  ─────────────────────────────────────────────     │
│  Load Balancer      1        $20       $20        │
│  App Server         3        $30       $90        │
│  Redis Cache        1        $20       $20        │
│  PostgreSQL         1        $60       $60        │
│  + Replicas         2        $60       $120       │
│  ─────────────────────────────────────────────     │
│  TOTAL                                 $310/mo    │
│                                                     │
│  ✅ Under $500 budget                              │
│  ✅ Meets 99.9% availability                       │
│  ✅ Handles 1000 RPS                               │
│                                                     │
└─────────────────────────────────────────────────────┘`,
  keyConcepts: [
    { title: 'TCO', explanation: 'Total Cost of Ownership - all costs over time', icon: '💵' },
    { title: 'Right-sizing', explanation: 'Match instance size to actual workload', icon: '📏' },
    { title: 'Spot Instances', explanation: 'Unused cloud capacity at 70% discount', icon: '🎯' },
    { title: 'Reserved', explanation: 'Commit to 1-3 years for big discounts', icon: '📅' },
  ],
  quickCheck: {
    question: 'Which is the BEST way to reduce TinyURL costs?',
    options: [
      'Remove the cache (saves $20/month)',
      'Use only 1 app server (saves $60/month)',
      'Increase cache hit rate (reduces DB load)',
      'Remove database replicas (saves $120/month)',
    ],
    correctIndex: 2,
    explanation: 'Increasing cache hit rate reduces DB queries, which means you can use smaller/fewer DB instances. Removing cache or replicas would hurt performance and availability.',
  },
};

const step10: GuidedStep = {
  id: 'tinyurl-step-10',
  stepNumber: 10,
  frIndex: 8,
  story: step10Story,
  celebration: step10Celebration,
  learnPhase: step10LearnPhase,
  practicePhase: {
    frText: 'System must cost less than $500/month',
    taskDescription: 'Review and optimize costs',
    componentsNeeded: [],
    connectionsNeeded: [],
    successCriteria: [
      'Review your component configurations',
      'Ensure you\'re not over-provisioned',
      'Total monthly cost should be under $500',
    ],
  },
  validation: {
    requiredComponents: ['app_server', 'database', 'cache', 'load_balancer'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
    requireDatabaseCapacity: true,
    requireCostUnderBudget: true,
  },
  hints: {
    level1: 'Check your total monthly cost',
    level2: 'Review component sizes - don\'t over-provision',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const tinyUrlGuidedTutorial: GuidedTutorial = {
  problemId: 'tiny-url-guided',
  problemTitle: 'Build TinyURL - A System Design Journey',
  totalSteps: 10,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],
};

export function getTinyUrlGuidedTutorial(): GuidedTutorial {
  return tinyUrlGuidedTutorial;
}
