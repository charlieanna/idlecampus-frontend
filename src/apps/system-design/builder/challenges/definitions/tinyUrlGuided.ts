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
 * TinyURL Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches system design concepts
 * while building a URL shortener. Each step tells a story that motivates the task.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-2: Build brute force solution (in-memory) - FRs satisfied!
 * Step 3: Add persistence (database)
 * Steps 4+: Apply NFRs (cache, load balancer, replication, etc.)
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const tinyUrlRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a URL shortener like bit.ly or TinyURL",
  
  interviewer: {
    name: 'Sarah Chen',
    role: 'Engineering Manager',
    avatar: '👩‍💼',
  },
  
  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================
    
    // CRITICAL - Core Functionality (from user's experience)
    {
      id: 'core-operations',
      category: 'functional',
      question: "What can users do with this system? What's the main user experience?",
      answer: "Users have two main experiences:\n1. **Shorten a URL**: A user pastes a long URL, clicks 'Shorten', and gets back a short URL (like bit.ly/abc123)\n2. **Click a short URL**: A user clicks a short URL and gets redirected to the original long URL",
      importance: 'critical',
      revealsRequirement: 'FR-1 and FR-2',
      learningPoint: "Always start by understanding the user's experience - what they see and do",
    },
    {
      id: 'uniqueness',
      category: 'functional',
      question: "What happens if two users shorten different URLs and get the same short code?",
      answer: "That would be a disaster! If someone clicks 'bit.ly/abc123', they need to go to the correct URL. Each short code must map to exactly one URL. Two different long URLs should never get the same short code - each needs a unique code.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Uniqueness is critical for user experience - wrong redirects break trust",
    },
    
    // IMPORTANT - Clarifications (from user's experience)
    {
      id: 'url-lifecycle',
      category: 'clarification',
      question: "Can users delete or edit their shortened URLs? Do they expire?",
      answer: "No, once a user creates a short URL, it should work forever. They're permanent. Users can't delete or edit them. We might add expiration as a v2 feature, but for now, once created, they last forever.",
      importance: 'important',
      insight: "This simplifies our design - no TTL or cleanup needed initially",
    },
    {
      id: 'custom-codes',
      category: 'clarification',
      question: "Can users choose their own short code? Like 'bit.ly/myshop' instead of 'bit.ly/abc123'?",
      answer: "Not for the MVP. Users will get auto-generated codes like 'abc123'. Custom codes like 'myshop' could be a v2 feature, but for now, we'll just generate random unique codes.",
      importance: 'nice-to-have',
      insight: "Custom codes add collision handling complexity - good to defer",
    },
    {
      id: 'analytics',
      category: 'clarification',
      question: "Do users see analytics like how many times their link was clicked?",
      answer: "Not for this interview. We're focusing on the core URL shortening functionality. Analytics could be a separate feature later, but it's not part of the MVP.",
      importance: 'nice-to-have',
      insight: "Analytics is a separate system - mentioning it shows breadth, but don't design it now",
    },
    
    // SCOPE
    {
      id: 'scope-single-region',
      category: 'scope',
      question: "Is this for a single region or global?",
      answer: "Let's start with a single region for now. We can discuss multi-region as an extension if time permits.",
      importance: 'nice-to-have',
      insight: "Starting simple with single region is the right approach",
    },
    
    // =============================================================================
    // PART 2: SCALE & NFRs (Interview Discovery Order)
    // =============================================================================
    
    // 1. THROUGHPUT (First - tells you the scale)
    {
      id: 'throughput-dau',
      category: 'throughput',
      question: "How many daily active users (DAU) should we design for?",
      answer: "100 million DAU",
      importance: 'critical',
      learningPoint: "DAU gives you the scale context for all calculations",
    },
    {
      id: 'throughput-writes',
      category: 'throughput',
      question: "How many URLs are shortened per day?",
      answer: "About 10 million new URLs per day",
      importance: 'critical',
      calculation: {
        formula: "10M ÷ 86,400 sec = 115 writes/sec average",
        result: "~115 writes/sec (345 at peak)",
      },
      learningPoint: "This tells you write load on the database",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many redirects (reads) per day?",
      answer: "About 1 billion redirects per day",
      importance: 'critical',
      calculation: {
        formula: "1B ÷ 86,400 sec = 11,574 reads/sec average",
        result: "~11,500 reads/sec (35K at peak)",
      },
      learningPoint: "This tells you read load - and it's MUCH higher than writes!",
    },
    
    // 2. PAYLOAD (Second - affects bandwidth and storage)
    {
      id: 'payload-url-size',
      category: 'payload',
      question: "What's the maximum URL length we need to support?",
      answer: "Standard URLs up to 2000 characters",
      importance: 'important',
      calculation: {
        formula: "2000 chars × 1 byte = ~2KB max per URL",
        result: "~2KB max request size",
      },
      learningPoint: "Affects bandwidth calculations and storage planning",
    },
    {
      id: 'payload-storage',
      category: 'payload',
      question: "What metadata do we store with each URL?",
      answer: "Just the URL, short code, and creation timestamp. About 500 bytes per record.",
      importance: 'important',
      calculation: {
        formula: "10M URLs/day × 500 bytes = 5GB/day",
        result: "~1.8TB/year of storage growth",
      },
      learningPoint: "Storage grows linearly with URL creation rate",
    },
    
    // 3. BURSTS (Third - capacity planning)
    {
      id: 'burst-peak',
      category: 'burst',
      question: "What's the peak-to-average traffic ratio?",
      answer: "Peak traffic is about 3x the average",
      importance: 'critical',
      calculation: {
        formula: "11,574 avg × 3 = 34,722 peak",
        result: "~35K reads/sec at peak",
      },
      insight: "You MUST design for peak, not average. 3x is typical for consumer apps.",
    },
    {
      id: 'burst-viral',
      category: 'burst',
      question: "Are there sudden traffic spikes we should handle?",
      answer: "Yes, when a shortened URL goes viral on social media, it can get millions of clicks in minutes.",
      importance: 'important',
      insight: "Need auto-scaling and rate limiting for protection",
    },
    
    // 4. LATENCY (Fourth - response time requirements)
    {
      id: 'latency-redirect',
      category: 'latency',
      question: "What's the acceptable latency for redirects?",
      answer: "p99 should be under 100ms - users expect instant redirects",
      importance: 'critical',
      learningPoint: "This is Request/Response latency - the user is waiting",
    },
    {
      id: 'latency-create',
      category: 'latency',
      question: "What about latency for creating short URLs?",
      answer: "p99 under 500ms is acceptable - users can wait a moment for URL creation",
      importance: 'important',
      learningPoint: "Create is less latency-sensitive than redirect",
    },
    {
      id: 'latency-async',
      category: 'latency',
      question: "Is there any async processing or background jobs?",
      answer: "Not for the core flow. Everything is synchronous request/response.",
      importance: 'nice-to-have',
      insight: "No data processing latency concerns for TinyURL",
    },
  ],
  
  minimumQuestionsRequired: 2,
  criticalQuestionIds: ['core-operations', 'uniqueness'],
  criticalFRQuestionIds: ['core-operations', 'uniqueness'],
  criticalScaleQuestionIds: ['throughput-writes', 'throughput-reads', 'burst-peak', 'latency-redirect'], // Used in later steps
  
  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can shorten URLs',
      description: 'A user can paste a long URL and get back a short URL (e.g., bit.ly/abc123)',
      emoji: '✂️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can click short URLs',
      description: 'When a user clicks a short URL, they get redirected to the original long URL',
      emoji: '↪️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Each short code is unique',
      description: 'Each short code maps to exactly one URL - no collisions, users always get the right redirect',
      emoji: '🔑',
    },
  ],
  
  scaleMetrics: {
    dailyActiveUsers: '100 million',
    writesPerDay: '10 million',
    readsPerDay: '1 billion',
    peakMultiplier: 3,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 115, peak: 345 },
    calculatedReadRPS: { average: 11574, peak: 34722 },
    maxPayloadSize: '~2KB',
    storagePerRecord: '~500 bytes',
    storageGrowthPerYear: '~1.8TB',
    redirectLatencySLA: 'p99 < 100ms',
    createLatencySLA: 'p99 < 500ms',
  },
  
  architecturalImplications: [
    '✅ Read-heavy (100:1) → Caching is CRITICAL',
    '✅ 35K reads/sec peak → Need multiple app servers + load balancer',
    '✅ Only 345 writes/sec peak → Single DB primary might work',
    '✅ p99 < 100ms redirect → Cache is essential (DB too slow)',
    '✅ 1.8TB/year growth → Plan for partitioning eventually',
  ],
  
  outOfScope: [
    'Custom short codes (v2)',
    'Click analytics',
    'URL expiration',
    'Multi-region deployment',
  ],
  
  keyInsight: "First, let's make it WORK. We'll build a simple Client → App Server solution that satisfies our functional requirements. Once it works, we'll optimize for scale and performance in later steps. This is the right way to approach system design: functionality first, then optimization.",
};

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
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes requests', displayName: 'App Server' },
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
// STEP 2: Configure the App Server with Python Code
// =============================================================================

const step2Story: StoryContent = {
  emoji: '⚙️',
  scenario: "Your App Server is connected, but it's just an empty box right now.",
  hook: "It doesn't know HOW to shorten URLs or redirect users. We need to teach it by writing actual Python code!",
  challenge: "Configure the App Server with APIs and implement the Python handlers for URL shortening and redirects.",
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
  conceptTitle: 'API Design & Python Implementation',
  conceptExplanation: `Your App Server needs to handle two main operations. You'll implement these in Python!

**1. Create Short URL (POST /api/v1/urls)** — You'll implement this in Python
- Receives: Original long URL
- Returns: Shortened URL code
- Your code: Generate unique code, store mapping in memory (for now)

**2. Redirect (GET /api/v1/urls/:code)** — You'll implement this in Python
- Receives: Short code
- Returns: Redirect to original URL
- Your code: Look up code, return original URL

**By the end of this step you should have:**
1. ✅ APIs assigned to the App Server
2. ✅ Python handlers implemented for both endpoints`,
  whyItMatters: 'Without the code, your server is just an empty shell. The Python handlers define what actually happens when users interact with your system. This is where your system design becomes real!',
  keyPoints: [
    'POST endpoint creates new short URLs (you\'ll write the Python code)',
    'GET endpoint redirects users to original URLs (you\'ll write the Python code)',
    'Each endpoint needs proper error handling',
    'Short codes should be unique and URL-safe',
    'Open the Python tab to see and edit your handler code',
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
    { title: 'Python Handlers', explanation: 'The actual code that processes each request', icon: '🐍' },
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
    frText: 'App Server must handle URL shortening and redirects with Python code',
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
      'Assign POST /api/v1/urls and GET /api/v1/urls/* APIs',
      'Open the Python tab and implement the handlers for both endpoints',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true, // Step 2 requires APIs to be assigned
    requireCodeImplementation: true, // Step 2 requires Python code to be written
  },
  hints: {
    level1: 'Click App Server to configure APIs, then switch to the Python tab to write your handlers',
    level2: 'After assigning APIs in the inspector, switch to the Python editor tab and fill in the TODOs in the template. Implement shorten_url() and redirect().',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
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
  famousIncident: {
    title: 'MySpace Lost 12 Years of Music',
    company: 'MySpace',
    year: '2019',
    whatHappened: 'During a server migration, MySpace accidentally deleted 50 million songs uploaded between 2003-2015. Over a decade of user content - gone forever. No proper backups existed.',
    lessonLearned: 'Always have persistent storage with proper backups. Data stored "temporarily" has a way of becoming permanent... until it vanishes.',
    icon: '🎵',
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
    taskDescription: 'Build Client → App Server → Database',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes API requests', displayName: 'App Server' },
      { type: 'database', reason: 'Stores URLs persistently', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send requests' },
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes URL mappings' },
    ],
    successCriteria: ['Add Client, App Server, Database', 'Connect Client → App Server → Database'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Build the full path: Client → App Server → Database',
    level2: 'Add all three components and connect them in sequence',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'database' }],
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
  famousIncident: {
    title: 'Facebook Cache Stampede',
    company: 'Facebook',
    year: '2010',
    whatHappened: 'When Facebook\'s memcached servers restarted, millions of requests simultaneously hit the database (cache stampede). The database couldn\'t handle the load and crashed, causing a cascading failure across the platform.',
    lessonLearned: 'Caching isn\'t optional at scale - it\'s infrastructure. Plan for cache failures with techniques like cache warming and request coalescing.',
    icon: '🏃',
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
    taskDescription: 'Build Client → App Server → Database + Cache',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes API requests', displayName: 'App Server' },
      { type: 'database', reason: 'Stores URLs persistently', displayName: 'Database' },
      { type: 'cache', reason: 'Caches hot URLs for fast lookups', displayName: 'Cache (Redis)' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send requests' },
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes URLs' },
      { from: 'App Server', to: 'Cache', reason: 'Server checks cache before database' },
    ],
    successCriteria: ['Build full architecture with Cache', 'Connect App Server to both Database and Cache'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Build the full system with a Cache for fast lookups',
    level2: 'Add Client, App Server, Database, and Cache - connect App Server to both storage components',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'database' }, { from: 'app_server', to: 'cache' }],
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
  famousIncident: {
    title: 'Pokémon GO Launch Disaster',
    company: 'Niantic',
    year: '2016',
    whatHappened: 'Pokémon GO launched expecting 5x their baseline traffic. They got 50x. Servers crashed worldwide. Players couldn\'t log in for days. The game was unplayable during its most hyped moment.',
    lessonLearned: 'Always plan for 10x your expected peak. Load balancers and auto-scaling are essential for handling viral growth.',
    icon: '🎮',
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
    taskDescription: 'Build Client → Load Balancer → App Server → Database + Cache',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Processes API requests', displayName: 'App Server' },
      { type: 'database', reason: 'Stores URLs persistently', displayName: 'Database' },
      { type: 'cache', reason: 'Caches hot URLs', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'All traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB forwards to servers' },
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes URLs' },
      { from: 'App Server', to: 'Cache', reason: 'Server caches hot URLs' },
    ],
    successCriteria: [
      'Build full architecture with Load Balancer',
      'Client → LB → App Server → Database + Cache',
    ],
  },
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
    level1: 'Build the full system with Load Balancer in front',
    level2: 'Client → Load Balancer → App Server, then App Server connects to Database and Cache',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
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
  famousIncident: {
    title: 'GitLab Database Deletion',
    company: 'GitLab',
    year: '2017',
    whatHappened: 'An engineer accidentally ran rm -rf on the production database directory during a routine maintenance. They had 5 backup methods - but discovered during recovery that ALL 5 had silently failed. They lost 6 hours of user data.',
    lessonLearned: 'Replication alone isn\'t enough. Test your backups regularly! GitLab now live-streams their backup verification to prove it works.',
    icon: '💀',
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
    taskDescription: 'Build full system and configure database replication',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Processes API requests', displayName: 'App Server' },
      { type: 'database', reason: 'Stores URLs with replication', displayName: 'Database' },
      { type: 'cache', reason: 'Caches hot URLs', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB forwards to servers' },
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes URLs' },
      { from: 'App Server', to: 'Cache', reason: 'Server caches hot URLs' },
    ],
    successCriteria: [
      'Build full architecture',
      'Click Database → Enable replication with 2+ replicas',
    ],
  },
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
    level1: 'Build the full system, then configure database replication',
    level2: 'Add all components, connect them, then click Database → Replication with 2+ replicas',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 7: The Scale - Multiple App Servers (Building on Step 5 & 6)
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your architecture from Steps 5 & 6 is solid: Load Balancer, Cache, and Replicated Database. But there's one problem...",
  hook: "You only have ONE App Server! The Load Balancer is ready to distribute traffic, but it's sending everything to a single server. That server is at 100% CPU and dropping requests!",
  challenge: "Time to scale OUT. In Step 5, you added the Load Balancer. In Step 6, you replicated the Database. Now complete the picture: run multiple App Server instances so the LB actually has something to balance!",
  illustration: 'horizontal-scaling',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Your system is now horizontally scalable!",
  achievement: "No more single points of failure - true High Availability achieved",
  metrics: [
    { label: 'App Server Instances', before: '1', after: '2+' },
    { label: 'Capacity', before: '1K RPS', after: '10K+ RPS' },
    { label: 'Availability', before: '99%', after: '99.99%' },
  ],
  nextTeaser: "Now let's make sure your cache strategy is optimized...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Scaling Out: Multiple App Server Instances',
  conceptExplanation: `**Recap: What you've built so far:**
- Step 5: Added Load Balancer to distribute traffic
- Step 6: Replicated Database for data durability

**What's missing?** Multiple App Server instances!

Your Load Balancer can distribute traffic, but with only 1 server, there's nothing to balance. You need **2+ instances** for:

1. **Higher Throughput**: 2 servers = 2x capacity
2. **High Availability**: If one server crashes, the other handles traffic
3. **Zero-Downtime Deploys**: Update one server while the other serves traffic

**Why this works for TinyURL:**
- App Servers are **stateless** - they don't store data locally
- All state lives in the Database and Cache
- Any server can handle any request
- Load Balancer health checks remove failed servers automatically`,
  whyItMatters: 'A single server is a single point of failure. With 2+ instances behind a load balancer, your system survives server crashes, handles traffic spikes, and allows maintenance without downtime.',
  realWorldExample: {
    company: 'Netflix',
    scenario: 'When a popular show drops, traffic spikes 10x in minutes.',
    howTheyDoIt: 'Auto-scaling: AWS automatically spins up new servers when CPU > 70%, removes them when traffic drops. They can go from 100 to 1000 servers in minutes.',
  },
  famousIncident: {
    title: 'Reddit\'s Single Server Days',
    company: 'Reddit',
    year: '2008',
    whatHappened: 'Early Reddit ran on a single server. When traffic spiked, the site would go down for hours. "Reddit is down" became a meme. They eventually moved to AWS with dozens of app servers.',
    lessonLearned: 'Start with at least 2 servers from day one. Single server = single point of failure. Your users will remember every outage.',
    icon: '🤖',
  },
  keyPoints: [
    'Stateless App Servers = easy horizontal scaling',
    'Load Balancer distributes traffic across all instances',
    '2+ instances = no single point of failure for compute',
    'Combined with DB replication = full High Availability',
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
│            │ Load Balancer  │  ← Step 5             │
│            └───────┬────────┘                       │
│           ┌────────┴────────┐                       │
│           │                 │                       │
│           ▼                 ▼                       │
│     ┌─────────┐       ┌─────────┐                  │
│     │  App 1  │       │  App 2  │  ← Step 7 (NOW!) │
│     │ Server  │       │ Server  │                  │
│     └────┬────┘       └────┬────┘                  │
│          └────────┬────────┘                       │
│                   │                                 │
│          ┌────────┴────────┐                       │
│          ▼                 ▼                       │
│    ┌──────────┐     ┌──────────────┐              │
│    │  Cache   │     │   Database   │  ← Step 6    │
│    │ (Redis)  │     │ (Replicated) │              │
│    └──────────┘     └──────────────┘              │
└─────────────────────────────────────────────────────┘`,
  keyConcepts: [
    { title: 'Stateless', explanation: 'Server stores no user data - any server can handle any request', icon: '🔄' },
    { title: 'Instance Count', explanation: 'Number of copies of your App Server running', icon: '🔢' },
    { title: 'Health Checks', explanation: 'LB pings servers, removes unhealthy ones from rotation', icon: '💓' },
    { title: 'High Availability', explanation: 'System stays up even when components fail', icon: '🛡️' },
  ],
  quickCheck: {
    question: 'Why do you need multiple App Server instances behind the Load Balancer?',
    options: [
      'The Load Balancer requires at least 2 servers to work',
      'For higher capacity AND to survive server failures',
      'To store more data in memory',
      'To make the database faster',
    ],
    correctIndex: 1,
    explanation: 'Multiple instances give you both higher throughput (more capacity) and high availability (survive failures). The LB distributes traffic and removes failed servers.',
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
    frText: 'System must handle 10K+ RPS with no single points of failure',
    taskDescription: 'Scale out: Configure your App Server to run 2+ instances (the architecture from Steps 5-6 should already be in place)',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Already added in Step 5', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Configure for 2+ instances', displayName: 'App Server' },
      { type: 'database', reason: 'Already replicated in Step 6', displayName: 'Database' },
      { type: 'cache', reason: 'Already added in Step 4', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Load Balancer', to: 'App Server', reason: 'LB distributes to multiple instances' },
    ],
    successCriteria: [
      'Click on App Server → Set Instances to 2 or more',
      'Verify Database replication is still enabled (from Step 6)',
      'Your system now has no single points of failure!',
    ],
  },
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
  },
  hints: {
    level1: 'Click on the App Server and increase the instance count to 2 or more',
    level2: 'Your architecture should already have LB, DB with replication, and Cache from previous steps. Just configure App Server instances: Click App Server → Set Instances to 2+',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
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
  famousIncident: {
    title: 'Knight Capital Trading Disaster',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'A cached configuration wasn\'t properly invalidated during a deployment. The stale cache caused their trading algorithm to buy high and sell low for 45 minutes. They lost $440 million in 45 minutes and went bankrupt.',
    lessonLearned: 'Cache invalidation is one of the hardest problems in computer science. Always have a clear strategy for when and how to invalidate.',
    icon: '📉',
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
    taskDescription: 'Build full system and configure cache strategy',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Multiple instances', displayName: 'App Server' },
      { type: 'database', reason: 'Replicated storage', displayName: 'Database' },
      { type: 'cache', reason: 'Configure strategy and TTL', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB distributes to servers' },
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes URLs' },
      { from: 'App Server', to: 'Cache', reason: 'Server uses cache-aside' },
    ],
    successCriteria: [
      'Build full architecture with all configurations',
      'Click Cache → Set strategy to cache-aside with TTL',
    ],
  },
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
    level1: 'Build full system and configure cache strategy',
    level2: 'Add all components, configure everything, then set Cache strategy and TTL',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
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
    taskDescription: 'Build full system with proper capacity planning',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Multiple instances', displayName: 'App Server' },
      { type: 'database', reason: 'Configure write capacity', displayName: 'Database' },
      { type: 'cache', reason: 'Configured cache', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB distributes to servers' },
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes URLs' },
      { from: 'App Server', to: 'Cache', reason: 'Server caches hot URLs' },
    ],
    successCriteria: [
      'Build full architecture with all configurations',
      'Set Database write capacity to 200+',
    ],
  },
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
    requireDatabaseCapacity: true,
  },
  hints: {
    level1: 'Build full system and configure database capacity',
    level2: 'Add all components, configure all settings, then set DB write capacity to 200+',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 10: The Bill - Cost Optimization
// =============================================================================

const step10Story: StoryContent = {
  emoji: '💰',
  scenario: "Final Exam! It's time to prove your system works in production.",
  hook: "Your architecture will be tested against 7 real-world test cases: 3 functional requirements and 4 non-functional requirements including traffic spikes, database failover, and cost constraints.",
  challenge: "Build a complete system that passes ALL 7 test cases while staying under the $2,500/month budget. This is exactly what you'd face in a real interview!",
  illustration: 'cost-optimization',
};

const step10Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Final Exam - 7 Test Cases Passed!",
  achievement: "Complete system design validated against production test cases",
  metrics: [
    { label: 'Monthly Cost', before: '$2,000', after: 'Under $2,500' },
    { label: 'Test Cases Passed', after: '7/7 ✓' },
    { label: 'All Requirements', after: 'Met ✓' },
  ],
  nextTeaser: "Congratulations! You've mastered the TinyURL system design. Try 'Solve on Your Own' mode or tackle a new challenge!",
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
│  ✅ Under $2,500 budget                            │
│  ✅ Meets 99.9% availability                       │
│  ✅ Handles 2000 RPS (viral spike)                 │
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
    frText: 'Final Exam: Pass all 7 production test cases',
    taskDescription: 'Build a complete system that passes all functional and non-functional requirements',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Right-sized instances', displayName: 'App Server' },
      { type: 'database', reason: 'Optimized capacity with replication', displayName: 'Database' },
      { type: 'cache', reason: 'Right-sized cache for hot URLs', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB distributes to servers' },
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes URLs' },
      { from: 'App Server', to: 'Cache', reason: 'Server caches hot URLs' },
    ],
    successCriteria: [
      'Pass FR-1: Basic Connectivity (10 RPS)',
      'Pass FR-2: Fast Redirects (500 RPS, p99 < 100ms)',
      'Pass FR-3: Unique Short Codes (50 RPS)',
      'Pass NFR-P1: Redirect Latency Budget (1000 RPS)',
      'Pass NFR-S1: Viral Traffic Spike (2000 RPS)',
      'Pass NFR-R1: Database Failover (99% availability)',
      'Pass NFR-C1: Cost Guardrail ($2,500/month)',
    ],
  },
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
    requireDatabaseCapacity: true,
    requireCostUnderBudget: true,
  },
  hints: {
    level1: 'Build complete system that passes all 7 test cases',
    level2: 'Configure for high availability and throughput while staying under $2,500/month - you need replication, caching, and proper capacity',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const tinyUrlGuidedTutorial: GuidedTutorial = {
  problemId: 'tiny-url-guided',
  problemTitle: 'Build TinyURL - A System Design Journey',
  
  // NEW: Requirements gathering phase (Step 0)
  requirementsPhase: tinyUrlRequirementsPhase,
  
  totalSteps: 10,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],
  
  // Final exam test cases - same 7 test cases as the regular TinyURL challenge
  // Users must pass all 7 to complete the guided tutorial
  // Note: Defined inline to avoid circular dependency with tinyUrl.ts
  finalExamTestCases: [
    {
      name: 'Basic Connectivity',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Users can create short URLs and access them for redirects.',
      traffic: { type: 'mixed', rps: 10, readRps: 5, writeRps: 5 },
      duration: 10,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'Fast Redirects',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Redirect short codes to the original URL within the latency target.',
      traffic: { type: 'read', rps: 500, readRps: 500 },
      duration: 30,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'Unique Short Codes',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Ensure duplicate URLs map to a single code while distinct URLs remain unique.',
      traffic: { type: 'mixed', rps: 50, readRps: 25, writeRps: 25 },
      duration: 30,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'NFR-P1: Redirect Latency Budget',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 1,000 redirect RPS while keeping p99 latency under 100ms.',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: Viral Traffic Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Absorb a sudden viral spike of 2,000 RPS (90% reads, 10% writes).',
      traffic: { type: 'mixed', rps: 2000, readRps: 1800, writeRps: 200 },
      duration: 60,
      passCriteria: { maxP99Latency: 150, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-R1: Database Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Primary database fails mid-test. Architecture must maintain availability.',
      traffic: { type: 'mixed', rps: 1100, readRps: 1000, writeRps: 100 },
      duration: 90,
      failureInjection: { type: 'db_crash', atSecond: 45, recoverySecond: 65 },
      passCriteria: { minAvailability: 0.99, maxDowntime: 10, maxErrorRate: 0.1 },
    },
    {
      name: 'NFR-C1: Cost Guardrail',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Meet the $2,500/month budget target while sustaining production traffic.',
      traffic: { type: 'mixed', rps: 1100, readRps: 1000, writeRps: 100 },
      duration: 60,
      passCriteria: { maxMonthlyCost: 2500, maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export function getTinyUrlGuidedTutorial(): GuidedTutorial {
  return tinyUrlGuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = tinyUrlRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= tinyUrlRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
