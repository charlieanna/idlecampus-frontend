import { GuidedTutorial, GuidedStep, TeachingContent } from '../../types/guidedTutorial';

/**
 * TinyURL Guided Tutorial
 *
 * A comprehensive step-by-step tutorial that teaches system design concepts
 * while building a URL shortener. Uses the TEACH → SOLVE → TEACH → SOLVE pedagogy.
 *
 * Topics covered:
 * 1. Basic request/response architecture
 * 2. Database selection and key generation
 * 3. Caching for read-heavy workloads
 * 4. Load balancing for high availability
 */

// Step 1: Basic Architecture - App Server
const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: App Servers',

  conceptExplanation: `Every web application starts with an **App Server** - the brain of your system that processes requests and returns responses.

When a user wants to shorten a URL like "https://example.com/very-long-path", their request travels through the internet to your app server, which:
1. Receives the HTTP request
2. Processes the business logic (generate short code)
3. Stores the mapping
4. Returns the shortened URL

Think of the app server as a restaurant chef - it takes orders (requests), prepares food (processes logic), and serves dishes (returns responses).`,

  whyItMatters: `The app server is the entry point for ALL user interactions. Without it, your system cannot function. In production, companies like Bitly handle millions of URL shortening requests per day - all processed by app servers.`,

  realWorldExample: {
    company: 'Bitly',
    scenario: 'Processing 600 million clicks per month',
    howTheyDoIt: 'Bitly uses multiple app server instances behind load balancers. Each server is stateless, meaning any server can handle any request. This allows them to scale horizontally by simply adding more servers.',
  },

  keyPoints: [
    'App servers are stateless - they don\'t store permanent data',
    'Each request is independent and self-contained',
    'Horizontal scaling: add more servers to handle more traffic',
    'App servers should be behind a load balancer in production',
  ],

  diagram: `
┌─────────────┐         ┌─────────────────┐
│   Client    │ ──────▶ │   App Server    │
│  (Browser)  │ ◀────── │  (Your Code)    │
└─────────────┘         └─────────────────┘
     Request                 Response
  "Shorten this URL"      "Here's your short URL"
`,

  keyConcepts: [
    {
      title: 'Stateless Design',
      explanation: 'App servers don\'t remember previous requests. Each request contains all info needed to process it.',
      icon: '🔄',
    },
    {
      title: 'Request/Response Cycle',
      explanation: 'Client sends request → Server processes → Server sends response. Simple but powerful.',
      icon: '↔️',
    },
  ],

  commonMistakes: [
    {
      mistake: 'Storing session data in app server memory',
      why: 'When you have multiple servers, users might hit different servers and lose their session',
      correct: 'Use external session storage (Redis) or stateless auth (JWT)',
    },
  ],

  interviewTip: 'Always mention that app servers should be stateless. This shows you understand horizontal scaling.',

  quickCheck: {
    question: 'Why should app servers be stateless?',
    options: [
      'To use less memory',
      'To allow any server to handle any request (horizontal scaling)',
      'Because databases are faster',
      'To reduce network latency',
    ],
    correctIndex: 1,
    explanation: 'Stateless servers allow horizontal scaling because requests can be distributed to ANY server. If servers stored state, users would need to always hit the same server.',
  },
};

const step1: GuidedStep = {
  id: 'tinyurl-step-1',
  stepNumber: 1,
  frIndex: 0,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Users can submit a long URL and receive a shortened URL',
    taskDescription: 'Add an App Server to handle URL shortening requests. This will be the brain of your system.',
    componentsNeeded: [
      {
        type: 'compute',
        reason: 'Processes URL shortening requests',
        displayName: 'App Server',
      },
    ],
    connectionsNeeded: [
      {
        from: 'Client',
        to: 'App Server',
        reason: 'Users send requests to the app server',
      },
    ],
    successCriteria: [
      'Add an App Server component to the canvas',
      'Connect the Client to the App Server',
    ],
  },
  validation: {
    requiredComponents: ['compute'],
    requiredConnections: [{ fromType: 'client', toType: 'compute' }],
  },
  hints: {
    level1: 'Think about what component handles HTTP requests and runs your application code.',
    level2: 'Drag an "App Server" component from the palette and connect the Client to it.',
    solutionComponents: [{ type: 'compute' }],
    solutionConnections: [{ from: 'client', to: 'compute' }],
  },
};

// Step 2: Data Persistence - Database
const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Storing URL Mappings: Database Selection',

  conceptExplanation: `Now we need somewhere to **store** the mappings between short codes and original URLs. This is where databases come in.

For a URL shortener, we need to:
- **Write**: Store new short_code → original_url mappings
- **Read**: Look up original_url given a short_code

This is a classic **key-value** access pattern! We have a key (short code like "abc123") and want to retrieve a value (the original URL).

Database options for this use case:
1. **Relational DB (PostgreSQL)**: ACID compliant, good for complex queries
2. **Key-Value Store (Redis/DynamoDB)**: Optimized for key lookups, very fast
3. **NoSQL (MongoDB)**: Flexible schema, good for varied data

For TinyURL, either PostgreSQL or DynamoDB works well. We'll use PostgreSQL for simplicity and ACID guarantees.`,

  whyItMatters: `Without persistent storage, all your shortened URLs would disappear when the server restarts! The database ensures data survives crashes, restarts, and even hardware failures (with replication).`,

  realWorldExample: {
    company: 'bit.ly',
    scenario: 'Storing billions of URL mappings',
    howTheyDoIt: 'Bitly uses a combination of MySQL for metadata and Redis for the hot path (frequently accessed URLs). The database handles roughly 10,000+ writes per second during peak traffic.',
  },

  keyPoints: [
    'URL shorteners have a key-value access pattern (short_code → URL)',
    'Read-heavy workload: ~100:1 read-to-write ratio is common',
    'Need to handle URL expiration and analytics',
    'Consider sharding for billions of URLs (partition by short_code hash)',
  ],

  diagram: `
┌─────────────┐       ┌─────────────────┐       ┌────────────────┐
│   Client    │ ────▶ │   App Server    │ ────▶ │   Database     │
└─────────────┘       └─────────────────┘       │  (PostgreSQL)  │
                                                │                │
                                                │  short_code    │
                                                │  ─────────     │
                                                │  abc123 → url1 │
                                                │  xyz789 → url2 │
                                                └────────────────┘
`,

  keyConcepts: [
    {
      title: 'Key-Value Access Pattern',
      explanation: 'Simple lookup by key (short_code). No complex joins needed.',
      icon: '🔑',
    },
    {
      title: 'ACID Transactions',
      explanation: 'Atomicity, Consistency, Isolation, Durability - ensures data integrity.',
      icon: '🛡️',
    },
    {
      title: 'Read-Heavy Workload',
      explanation: 'Many more reads than writes. This influences our caching strategy later.',
      icon: '📖',
    },
  ],

  commonMistakes: [
    {
      mistake: 'Using a random UUID for short codes',
      why: 'UUIDs are 36 characters - defeats the purpose of "short" URLs',
      correct: 'Use Base62 encoding (a-z, A-Z, 0-9) for 6-8 character codes',
    },
    {
      mistake: 'Not indexing the short_code column',
      why: 'Full table scans for every lookup = extremely slow at scale',
      correct: 'Create a primary key or unique index on short_code',
    },
  ],

  interviewTip: 'Mention the read-to-write ratio early. It shows you\'re thinking about the access pattern, which influences database and caching decisions.',

  quickCheck: {
    question: 'What type of access pattern does a URL shortener primarily use?',
    options: [
      'Full-text search',
      'Key-value lookup',
      'Graph traversal',
      'Time-series aggregation',
    ],
    correctIndex: 1,
    explanation: 'URL shorteners use key-value lookups: given a short code (key), return the original URL (value). This simple pattern allows for highly optimized storage solutions.',
  },
};

const step2: GuidedStep = {
  id: 'tinyurl-step-2',
  stepNumber: 2,
  frIndex: 1,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'The system must persist URL mappings durably',
    taskDescription: 'Add a Database to store the short_code → original_url mappings. Connect it to your App Server.',
    componentsNeeded: [
      {
        type: 'storage',
        reason: 'Stores URL mappings persistently',
        displayName: 'Database (PostgreSQL)',
      },
    ],
    connectionsNeeded: [
      {
        from: 'App Server',
        to: 'Database',
        reason: 'App server reads/writes URL mappings',
      },
    ],
    successCriteria: [
      'Add a Database component to the canvas',
      'Connect the App Server to the Database',
    ],
  },
  validation: {
    requiredComponents: ['compute', 'storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'compute' },
      { fromType: 'compute', toType: 'storage' },
    ],
  },
  hints: {
    level1: 'Where should the URL mappings be stored permanently?',
    level2: 'Add a Database (PostgreSQL) and connect your App Server to it.',
    solutionComponents: [{ type: 'storage' }],
    solutionConnections: [{ from: 'compute', to: 'storage' }],
  },
};

// Step 3: Caching for Performance
const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Accelerating Reads: The Power of Caching',

  conceptExplanation: `Here's a key insight: **URL shorteners are read-heavy**. For every URL created (write), it might be clicked 1000+ times (reads).

Database queries take 10-50ms. Cache lookups take 1-5ms. That's 10-50x faster!

**How caching works for TinyURL:**
1. User clicks short URL: tinyurl.com/abc123
2. Check cache: Is "abc123" → "original_url" in Redis?
3. **Cache HIT**: Return immediately (1ms)
4. **Cache MISS**: Query database, store result in cache, return (20ms)

This is called "Cache-Aside" or "Lazy Loading" pattern - we only cache what's actually being accessed.

Popular URLs (the 20% that get 80% of traffic) stay hot in cache. Obscure URLs are fetched from the database.`,

  whyItMatters: `Without caching, every redirect hits the database. At 10,000 requests/second, that's 10,000 database queries/second. The database becomes the bottleneck. With caching, 95%+ of requests are served from memory, reducing database load by 20x.`,

  realWorldExample: {
    company: 'Twitter (t.co)',
    scenario: 'Handling viral tweets with millions of clicks',
    howTheyDoIt: 'Twitter\'s t.co shortener uses Redis clusters to cache popular links. When a celebrity tweets, that shortened URL might get 1 million clicks in an hour. Cache makes this possible without melting the database.',
  },

  keyPoints: [
    'Cache-aside pattern: Check cache first, then database',
    'Set TTL (Time-To-Live) to prevent stale data',
    'Use consistent hashing for distributed cache (multiple Redis nodes)',
    'Cache hit ratio of 95%+ is achievable for URL shorteners',
  ],

  diagram: `
                                 ┌─────────────┐
                          ┌────▶ │    Cache    │ (1-5ms)
                          │      │   (Redis)   │
┌────────┐    ┌──────────┴┐     └─────────────┘
│ Client │───▶│ App Server│          │
└────────┘    └──────────┬┘     Cache Miss?
                          │          │
                          │          ▼
                          └────▶ ┌─────────────┐
                                 │  Database   │ (10-50ms)
                                 │ (PostgreSQL)│
                                 └─────────────┘
`,

  keyConcepts: [
    {
      title: 'Cache-Aside Pattern',
      explanation: 'Application checks cache first. On miss, fetches from DB and populates cache.',
      icon: '📦',
    },
    {
      title: 'TTL (Time-To-Live)',
      explanation: 'Cached entries expire after a set time to prevent serving stale data.',
      icon: '⏰',
    },
    {
      title: 'Cache Hit Ratio',
      explanation: 'Percentage of requests served from cache. Higher = better performance.',
      icon: '📊',
    },
  ],

  commonMistakes: [
    {
      mistake: 'No cache invalidation strategy',
      why: 'If a URL is updated/deleted, cache might serve stale data',
      correct: 'Use TTL for automatic expiration, and explicit deletion on updates',
    },
    {
      mistake: 'Caching everything forever',
      why: 'Cache memory is expensive; old URLs waste space',
      correct: 'Use LRU eviction and reasonable TTL (e.g., 24 hours)',
    },
  ],

  interviewTip: 'Calculate the cache size! If you have 100M URLs at 500 bytes each, that\'s 50GB. Can it fit in one Redis instance? You might need sharding.',

  quickCheck: {
    question: 'In a cache-aside pattern, what happens on a cache miss?',
    options: [
      'Return an error to the user',
      'Query the database, return result, then update cache',
      'Wait for cache to be populated by another service',
      'Redirect to a different server',
    ],
    correctIndex: 1,
    explanation: 'On a cache miss, the application queries the database to get the data, returns it to the user, and asynchronously (or synchronously) updates the cache so future requests will be cache hits.',
  },
};

const step3: GuidedStep = {
  id: 'tinyurl-step-3',
  stepNumber: 3,
  frIndex: 2,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Redirect latency must be under 100ms at p99',
    taskDescription: 'Add a Cache (Redis) to speed up URL lookups. Place it between the App Server and Database.',
    componentsNeeded: [
      {
        type: 'cache',
        reason: 'Caches frequently accessed URLs for fast lookups',
        displayName: 'Cache (Redis)',
      },
    ],
    connectionsNeeded: [
      {
        from: 'App Server',
        to: 'Cache',
        reason: 'App server checks cache before database',
      },
    ],
    successCriteria: [
      'Add a Cache (Redis) component to the canvas',
      'Connect the App Server to the Cache',
      'Keep the App Server → Database connection for cache misses',
    ],
  },
  validation: {
    requiredComponents: ['compute', 'storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'compute' },
      { fromType: 'compute', toType: 'storage' },
      { fromType: 'compute', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'What component can store frequently accessed data in memory for fast retrieval?',
    level2: 'Add Redis (Cache) and connect your App Server to it for fast URL lookups.',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'compute', to: 'cache' }],
  },
};

// Step 4: Load Balancing for Scale
const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Scaling Out: Load Balancers',

  conceptExplanation: `One app server can handle maybe 1,000-10,000 requests/second. What if you need 100,000 req/s?

**Solution: Multiple app servers behind a Load Balancer**

The load balancer:
1. Receives ALL incoming traffic
2. Distributes requests across multiple app servers
3. Detects unhealthy servers and stops sending traffic to them
4. Enables zero-downtime deployments

**Load Balancing Algorithms:**
- **Round Robin**: Rotate through servers sequentially
- **Least Connections**: Send to server with fewest active requests
- **IP Hash**: Same client always hits same server (useful for sessions)

For stateless services like our URL shortener, Round Robin works great!`,

  whyItMatters: `Load balancers provide both **scalability** (handle more traffic by adding servers) and **availability** (if one server dies, others continue serving). Without a load balancer, you have a single point of failure.`,

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Handling 200+ million subscribers streaming simultaneously',
    howTheyDoIt: 'Netflix uses AWS Elastic Load Balancers in front of thousands of microservices. When a new episode of a popular show drops, traffic can spike 10x. The load balancer automatically distributes this surge across available servers.',
  },

  keyPoints: [
    'Load balancers enable horizontal scaling (add more servers = more capacity)',
    'Health checks detect and remove failed servers automatically',
    'SSL termination can happen at the load balancer level',
    'Geographic load balancing routes users to nearest data center',
  ],

  diagram: `
                                    ┌─────────────┐
                              ┌────▶│ App Server 1│
                              │     └─────────────┘
┌────────┐   ┌──────────────┐ │     ┌─────────────┐
│ Client │──▶│Load Balancer │─┼────▶│ App Server 2│
└────────┘   └──────────────┘ │     └─────────────┘
                              │     ┌─────────────┐
                              └────▶│ App Server 3│
                                    └─────────────┘
                                           │
                                           ▼
                                    ┌─────────────┐
                                    │   Cache +   │
                                    │  Database   │
                                    └─────────────┘
`,

  keyConcepts: [
    {
      title: 'Horizontal Scaling',
      explanation: 'Add more servers to handle more load, rather than making one server more powerful.',
      icon: '📈',
    },
    {
      title: 'Health Checks',
      explanation: 'Load balancer pings servers regularly. Unhealthy servers are removed from rotation.',
      icon: '💓',
    },
    {
      title: 'Single Point of Failure',
      explanation: 'Any component that, if it fails, brings down the whole system. Load balancers eliminate this for app servers.',
      icon: '⚠️',
    },
  ],

  commonMistakes: [
    {
      mistake: 'Storing session in app server memory',
      why: 'Next request might go to a different server, losing the session',
      correct: 'Use Redis for sessions, or use stateless JWT tokens',
    },
    {
      mistake: 'Not configuring health checks',
      why: 'Load balancer might send traffic to dead servers',
      correct: 'Implement /health endpoint that checks dependencies (DB, cache)',
    },
  ],

  interviewTip: 'Mention that the load balancer itself can be a single point of failure. In production, use multiple load balancers with DNS failover or a cloud provider\'s managed load balancer service.',

  quickCheck: {
    question: 'What is the main benefit of using a load balancer?',
    options: [
      'Reduces database queries',
      'Encrypts all traffic',
      'Distributes traffic across multiple servers for scale and availability',
      'Caches static content',
    ],
    correctIndex: 2,
    explanation: 'Load balancers distribute incoming traffic across multiple backend servers, enabling horizontal scaling (more servers = more capacity) and high availability (if one server fails, others continue serving).',
  },
};

const step4: GuidedStep = {
  id: 'tinyurl-step-4',
  stepNumber: 4,
  frIndex: 3,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'System must achieve 99.9% availability',
    taskDescription: 'Add a Load Balancer in front of your App Server(s) to distribute traffic and enable high availability.',
    componentsNeeded: [
      {
        type: 'load_balancer',
        reason: 'Distributes traffic across multiple app servers',
        displayName: 'Load Balancer',
      },
    ],
    connectionsNeeded: [
      {
        from: 'Client',
        to: 'Load Balancer',
        reason: 'All traffic enters through the load balancer',
      },
      {
        from: 'Load Balancer',
        to: 'App Server',
        reason: 'Load balancer forwards requests to app servers',
      },
    ],
    successCriteria: [
      'Add a Load Balancer component',
      'Connect Client → Load Balancer → App Server',
      'Remove direct Client → App Server connection',
    ],
  },
  validation: {
    requiredComponents: ['compute', 'storage', 'cache', 'load_balancer'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'compute' },
      { fromType: 'compute', toType: 'storage' },
      { fromType: 'compute', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'What component sits in front of app servers to distribute incoming traffic?',
    level2: 'Add a Load Balancer. Connect Client → LB → App Server.',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'compute' },
    ],
  },
};

/**
 * Complete TinyURL Guided Tutorial
 */
export const tinyUrlGuidedTutorial: GuidedTutorial = {
  problemId: 'tiny-url-guided',
  problemTitle: 'Design TinyURL (Guided Tutorial)',
  totalSteps: 4,
  steps: [step1, step2, step3, step4],
};

/**
 * Function to get the tutorial for use in the builder
 */
export function getTinyUrlGuidedTutorial(): GuidedTutorial {
  return tinyUrlGuidedTutorial;
}
