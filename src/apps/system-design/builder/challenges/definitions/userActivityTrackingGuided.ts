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
 * User Activity Tracking Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches system design concepts
 * while building a comprehensive user activity tracking and analytics system.
 *
 * Flow:
 * Phase 0: Requirements gathering (event types, privacy, analytics latency)
 * Steps 1-3: Basic event collection
 * Steps 4-6: Clickstream processing, session reconstruction, funnel analysis
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const userActivityTrackingRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a user activity tracking and analytics system for a web application",

  interviewer: {
    name: 'Sarah Johnson',
    role: 'Director of Product Analytics',
    avatar: '👩‍💼',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-tracking',
      category: 'functional',
      question: "What user activities do we need to track?",
      answer: "We need to track three main categories:\n1. **Page views**: Every page a user visits, when they visit, how long they stay\n2. **User interactions**: Clicks, form submissions, button clicks, video plays\n3. **Custom events**: Signup, purchase, add-to-cart, feature usage\n\nEach event needs metadata: user_id, session_id, timestamp, page URL, user agent, and any event-specific data.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "User activity tracking starts with capturing three types of events: page views, interactions, and custom business events",
    },
    {
      id: 'event-collection',
      category: 'functional',
      question: "How do we collect these events from user browsers?",
      answer: "We'll use a **JavaScript tracking SDK** embedded on every page. It:\n- Captures events automatically (page views, clicks)\n- Provides API for custom events (track('purchase', {amount: 99}))\n- Batches events and sends to our collection API\n- Handles offline scenarios (queues until connection restored)\n- Respects privacy settings (Do Not Track, cookie consent)",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Client-side SDK handles automatic capture + custom event tracking",
    },
    {
      id: 'session-tracking',
      category: 'functional',
      question: "How do we track user sessions? When does a session start and end?",
      answer: "A **session** represents a continuous period of user activity:\n- **Starts**: When user first visits (or returns after 30 min inactivity)\n- **Ends**: After 30 minutes of inactivity OR explicit logout\n- **Session ID**: Generated client-side, included in all events\n- **Session data**: First page, referrer, device, duration, event count",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Session tracking groups related user activities into meaningful time-bounded segments",
    },
    {
      id: 'funnel-analysis',
      category: 'functional',
      question: "What kind of analytics do we need to provide?",
      answer: "Three main analytics capabilities:\n1. **Funnels**: Track user progression (homepage → product → cart → checkout → purchase)\n2. **User journeys**: Visualize paths users take through the app\n3. **Event analytics**: Count events, aggregate by dimension (browser, country, etc.)\n\nAnalytics queries should return results in under 5 seconds for interactive dashboards.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Analytics transform raw events into business insights",
    },

    // IMPORTANT - Clarifications
    {
      id: 'privacy-compliance',
      category: 'clarification',
      question: "What about user privacy? GDPR? Cookie consent?",
      answer: "Privacy is critical:\n- **Respect Do Not Track**: Don't track if user has DNT enabled\n- **Cookie consent**: Only track after user accepts cookies\n- **Data deletion**: Support right-to-be-forgotten (delete user data on request)\n- **Anonymization**: PII should be hashed or encrypted\n- **Data retention**: 90 days for raw events, 2 years for aggregated analytics",
      importance: 'critical',
      insight: "Privacy compliance is not optional - it's a hard requirement",
    },
    {
      id: 'cross-device',
      category: 'clarification',
      question: "Can we track users across multiple devices?",
      answer: "Yes, once they log in! Before login, we track anonymous sessions. After login, we can:\n- Link anonymous sessions to authenticated user\n- Track cross-device journeys (mobile → desktop)\n- Build unified user profile\n\nBut respect privacy: only link if user is logged in.",
      importance: 'important',
      insight: "User identity resolution enables richer analytics but requires careful privacy handling",
    },
    {
      id: 'real-time-vs-batch',
      category: 'clarification',
      question: "Do analytics need to be real-time or is batch processing okay?",
      answer: "**Hybrid approach**:\n- **Real-time**: Live dashboards showing current traffic, active users (5-minute delay acceptable)\n- **Batch**: Funnel analysis, cohort analysis can be computed hourly or daily\n- **Near real-time**: Session reconstruction within 15 minutes for fraud detection",
      importance: 'important',
      insight: "Different analytics use cases have different latency requirements",
    },

    // SCOPE
    {
      id: 'scope-scale',
      category: 'scope',
      question: "What's the scale we need to support?",
      answer: "Let's design for:\n- 10 million daily active users (DAU)\n- 50 page views per user per day on average\n- 10 custom events per user per day\n- Total: ~600 million events per day",
      importance: 'critical',
      learningPoint: "Understanding scale early shapes architecture decisions",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // THROUGHPUT
    {
      id: 'throughput-writes',
      category: 'throughput',
      question: "How many events per second do we need to ingest?",
      answer: "600 million events per day",
      importance: 'critical',
      calculation: {
        formula: "600M ÷ 86,400 sec = 6,944 writes/sec average",
        result: "~7K writes/sec (21K at 3x peak)",
      },
      learningPoint: "Event ingestion is write-heavy - design for high throughput writes",
    },
    {
      id: 'throughput-queries',
      category: 'throughput',
      question: "How many analytics queries per second?",
      answer: "Dashboard queries: ~1,000 queries per second during business hours",
      importance: 'important',
      calculation: {
        formula: "1000 queries/sec across dashboards and reports",
        result: "~1K reads/sec",
      },
      learningPoint: "Analytics queries are read-heavy with complex aggregations",
    },

    // PAYLOAD
    {
      id: 'payload-event-size',
      category: 'payload',
      question: "What's the average event size?",
      answer: "Average event payload is ~1KB (includes metadata, properties, context)",
      importance: 'important',
      calculation: {
        formula: "600M events × 1KB = 600GB/day",
        result: "~600GB per day raw event data",
      },
      learningPoint: "Event size impacts storage and network bandwidth",
    },

    // BURSTS
    {
      id: 'burst-traffic',
      category: 'burst',
      question: "Do we get traffic spikes?",
      answer: "Yes! Product launches, marketing campaigns can cause 5x spikes. Black Friday can be 10x normal traffic.",
      importance: 'critical',
      insight: "Auto-scaling is essential for handling marketing-driven spikes",
    },

    // LATENCY
    {
      id: 'latency-ingestion',
      category: 'latency',
      question: "What's the acceptable latency for event ingestion?",
      answer: "Events should be acknowledged within 100ms p99. This ensures the tracking SDK doesn't slow down user experience.",
      importance: 'critical',
      learningPoint: "Ingestion latency directly impacts user experience - must be fast",
    },
    {
      id: 'latency-analytics',
      category: 'latency',
      question: "How fast should analytics queries be?",
      answer: "Interactive dashboards need p95 under 5 seconds. Batch reports can take minutes.",
      importance: 'important',
      learningPoint: "Different analytics use cases tolerate different query latencies",
    },
    {
      id: 'latency-processing',
      category: 'latency',
      question: "How fresh should the data be for analytics?",
      answer: "**Data processing latency**:\n- Real-time metrics: 5 minutes\n- Session reconstruction: 15 minutes\n- Funnel analysis: 1 hour\n- Historical reports: 24 hours",
      importance: 'important',
      learningPoint: "Processing latency determines how quickly events become queryable",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-tracking', 'session-tracking', 'funnel-analysis'],
  criticalFRQuestionIds: ['core-tracking', 'event-collection', 'session-tracking'],
  criticalScaleQuestionIds: ['throughput-writes', 'latency-ingestion', 'latency-processing'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Collect user events',
      description: 'Capture page views, clicks, and custom events from user browsers',
      emoji: '📊',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Track user sessions',
      description: 'Group events into sessions and reconstruct user journeys',
      emoji: '🔄',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Provide analytics',
      description: 'Support funnels, user journeys, and event aggregation queries',
      emoji: '📈',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million',
    writesPerDay: '600 million events',
    readsPerDay: '~86 million queries (1K queries/sec)',
    peakMultiplier: 3,
    readWriteRatio: '1:7 (write-heavy)',
    calculatedWriteRPS: { average: 6944, peak: 20832 },
    calculatedReadRPS: { average: 1000, peak: 3000 },
    maxPayloadSize: '~1KB',
    storagePerRecord: '~1KB',
    storageGrowthPerYear: '~219TB (600GB/day × 365)',
    redirectLatencySLA: 'p99 < 100ms (ingestion)',
    createLatencySLA: 'p95 < 5s (analytics queries)',
  },

  architecturalImplications: [
    '✅ Write-heavy (7K writes/sec) → Need fast event ingestion pipeline',
    '✅ 600GB/day → Efficient storage and data retention policy critical',
    '✅ p99 < 100ms ingestion → Async processing, acknowledge immediately',
    '✅ Complex analytics → Need OLAP database or data warehouse',
    '✅ Privacy compliance → Data anonymization and deletion pipelines',
    '✅ Session tracking → Stream processing to reconstruct sessions in real-time',
  ],

  outOfScope: [
    'A/B testing platform',
    'Machine learning recommendations',
    'Real-time alerting (threshold violations)',
    'Multi-region deployment',
    'Mobile app tracking (focus on web)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple event collection pipeline where browsers send events to our API, we store them, and we can query them. Session reconstruction, real-time analytics, and advanced funnels will come in later steps. Functionality first, then optimization.",
};

// =============================================================================
// STEP 1: The Beginning - Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to Analytics Co! You've been hired to build a user activity tracking system.",
  hook: "Your first task: set up the basic infrastructure so browsers can send events to your server.",
  challenge: "Connect the Client (user browsers) to the App Server to handle tracking requests.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your tracking system is connected!",
  achievement: "Browsers can now send events to your App Server",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can receive events', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to process events yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Event Collection',
  conceptExplanation: `Every analytics system starts with **event collection** - capturing user actions from browsers.

When a user clicks a button or views a page:
1. JavaScript tracking SDK captures the event
2. Sends HTTP request to your App Server
3. Server receives and processes the event

Think of it as a funnel: millions of users → browsers generate events → your server collects them.`,
  whyItMatters: 'Without event collection, you have no data to analyze!',
  keyPoints: [
    'Client = user browsers with tracking SDK embedded',
    'App Server receives HTTP requests with event payloads',
    'Each event contains: user_id, event_type, timestamp, properties',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────┐
│   Client    │ ──────▶ │   App Server    │
│  (Browser)  │ ◀────── │  (Track Events) │
└─────────────┘         └─────────────────┘
`,
  keyConcepts: [
    {
      title: 'Event',
      explanation: 'A record of user action (page view, click, purchase)',
      icon: '📋',
    },
    {
      title: 'Tracking SDK',
      explanation: 'JavaScript library that captures events from browser',
      icon: '📡',
    },
  ],
  quickCheck: {
    question: 'What does the App Server do in an analytics system?',
    options: [
      'Renders web pages',
      'Receives and processes event data from browsers',
      'Stores user passwords',
      'Sends emails to users',
    ],
    correctIndex: 1,
    explanation: 'The App Server is the entry point for all event data - it receives, validates, and processes events.',
  },
};

const step1: GuidedStep = {
  id: 'user-activity-tracking-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Browsers can send events to the system',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents user browsers', displayName: 'Client' },
      { type: 'app_server', reason: 'Receives event data', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Browsers send events' },
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
// STEP 2: Configure Event Tracking APIs with Python Code
// =============================================================================

const step2Story: StoryContent = {
  emoji: '⚙️',
  scenario: "Your App Server is connected, but it's just an empty box.",
  hook: "A browser just tried to send a 'page_view' event and got a 404 error. We need to implement the tracking endpoints!",
  challenge: "Configure the App Server with event tracking APIs and implement the Python handlers.",
  illustration: 'configure-server',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Your App Server can process events!",
  achievement: "Event tracking and query APIs are implemented",
  metrics: [
    { label: 'APIs configured', after: '2 endpoints' },
    { label: 'Code written', after: '✓ Working' },
  ],
  nextTeaser: "But what happens when the server restarts?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Design & Event Processing',
  conceptExplanation: `Your App Server needs to handle two operations. You'll implement these in Python!

**1. Track Event (POST /api/v1/track)** — You'll implement this in Python
- Receives: Event payload (type, user_id, properties, timestamp)
- Returns: Acknowledgment with event_id
- Your code: Validate event, assign ID, store in memory (for now)

**2. Query Events (GET /api/v1/events)** — You'll implement this in Python
- Receives: Query parameters (user_id, event_type, date range)
- Returns: Matching events
- Your code: Filter and return stored events

**By the end of this step you should have:**
1. ✅ APIs assigned to the App Server
2. ✅ Python handlers implemented for both endpoints`,
  whyItMatters: 'Without the code, your server is just an empty shell. The Python handlers define how events are processed and stored.',
  keyPoints: [
    'POST /api/v1/track accepts event data (you\'ll write the Python code)',
    'GET /api/v1/events retrieves stored events (you\'ll write the Python code)',
    'Each event needs: user_id, event_type, timestamp, session_id',
    'Validate event schema to prevent bad data',
    'Open the Python tab to see and edit your handler code',
  ],
  diagram: `
POST /api/v1/track
┌────────────────────────────────────────────────┐
│ Request:  {                                    │
│   "event_type": "page_view",                   │
│   "user_id": "user123",                        │
│   "properties": {"url": "/products"}           │
│ }                                              │
│ Response: { "event_id": "evt_abc123" }         │
└────────────────────────────────────────────────┘

GET /api/v1/events?user_id=user123
┌────────────────────────────────────────────────┐
│ Response: [                                    │
│   { "event_id": "evt_abc123", ... },           │
│   { "event_id": "evt_def456", ... }            │
│ ]                                              │
└────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'REST API', explanation: 'POST to track events, GET to query them', icon: '🔌' },
    { title: 'Event Schema', explanation: 'Structure that all events must follow', icon: '📋' },
    { title: 'Python Handlers', explanation: 'The actual code that processes each request', icon: '🐍' },
  ],
  quickCheck: {
    question: 'Which HTTP method should be used to TRACK a new event?',
    options: [
      'GET - because we\'re getting data',
      'POST - because we\'re creating a new event record',
      'PUT - because we\'re updating data',
      'DELETE - because we\'re removing data',
    ],
    correctIndex: 1,
    explanation: 'POST is used to create new resources. We\'re creating a new event record in our tracking system.',
  },
};

const step2: GuidedStep = {
  id: 'user-activity-tracking-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'App Server must track events and support queries with Python code',
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
      'Assign POST /api/v1/track and GET /api/v1/events APIs',
      'Open the Python tab and implement the handlers for both endpoints',
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
    level2: 'After assigning APIs in the inspector, switch to the Python editor tab and fill in the TODOs. Implement track_event() and query_events().',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: The Crisis - Events Are Lost on Restart!
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 2 AM. Your server crashed and auto-restarted.",
  hook: "When it came back online... ALL event data was GONE! Product team can't analyze yesterday's user behavior. Marketing is furious!",
  challenge: "The problem: events were stored in server memory. When the server restarted, everything vanished. We need persistent storage!",
  illustration: 'server-crash',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Your event data is now safe!",
  achievement: "Events persist durably even if the server restarts",
  metrics: [
    { label: 'Data durability', before: '❌ Lost on restart', after: '✓ Persisted forever' },
    { label: 'Storage', after: 'PostgreSQL Database' },
  ],
  nextTeaser: "Great! But the product team is asking for session tracking...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Data Persistence: Why Databases Matter',
  conceptExplanation: `Without a database, your app server stores events in memory (RAM).

**Problem**: RAM is volatile - when the server restarts, all data is lost!

**Solution**: Store events in a database. Databases write to disk and ensure your data survives:
- Server crashes
- Restarts
- Deployments
- Power outages

For user activity tracking, we need to store: event records with all metadata and properties.`,
  whyItMatters: 'Without persistent storage, all your tracking data disappears on restart! Analytics are impossible without historical data.',
  realWorldExample: {
    company: 'Mixpanel',
    scenario: 'Processing billions of events',
    howTheyDoIt: 'Uses distributed databases to store raw events and pre-computed analytics, ensuring data durability and fast queries.',
  },
  famousIncident: {
    title: 'Snapchat Lost User Messages',
    company: 'Snapchat',
    year: '2013',
    whatHappened: 'Due to a database configuration error during rapid scaling, Snapchat lost millions of user messages and event data. Users couldn\'t retrieve their "supposedly temporary" messages, and analytics dashboards went dark.',
    lessonLearned: 'Always test database persistence and backups BEFORE you need them. What you track today becomes critical business data tomorrow.',
    icon: '👻',
  },
  keyPoints: [
    'RAM is volatile, databases persist to disk',
    'Event data has structured schema: event_id, user_id, timestamp, properties',
    'Write-heavy workload: optimize for fast inserts',
    'Support time-range queries for analytics',
  ],
  diagram: `
┌─────────────┐       ┌─────────────┐       ┌────────────────┐
│   Client    │ ────▶ │ App Server  │ ────▶ │   Database     │
└─────────────┘       └─────────────┘       │                │
                                            │  Events table  │
                                            │  user_id       │
                                            │  event_type    │
                                            │  timestamp     │
                                            │  properties    │
                                            └────────────────┘
`,
  keyConcepts: [
    { title: 'Persistence', explanation: 'Data survives restarts and crashes', icon: '💾' },
    { title: 'Write-Heavy', explanation: 'Many writes (track events), fewer reads (analytics)', icon: '✍️' },
  ],
  quickCheck: {
    question: 'Why did we lose all event data when the server restarted?',
    options: [
      'The database was deleted',
      'Data was only stored in RAM (memory), which is volatile',
      'The network connection failed',
      'Users deleted their data',
    ],
    correctIndex: 1,
    explanation: 'RAM is volatile - it loses all data when power is lost. Databases persist data to disk.',
  },
};

const step3: GuidedStep = {
  id: 'user-activity-tracking-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Event data must persist durably',
    taskDescription: 'Build Client → App Server → Database',
    componentsNeeded: [
      { type: 'client', reason: 'Represents user browsers', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes tracking requests', displayName: 'App Server' },
      { type: 'database', reason: 'Stores events persistently', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Browsers send events' },
      { from: 'App Server', to: 'Database', reason: 'Server writes/reads events' },
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
// STEP 4: The Stream - Real-time Event Processing with Message Queue
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🌊',
  scenario: "Your tracking system is getting popular! But there's a problem...",
  hook: "During Black Friday, you're receiving 50K events per second. The database can't keep up! Events are getting dropped and analytics are incomplete!",
  challenge: "The database can only handle ~5K writes/sec. We need a buffer that can absorb traffic spikes and process events asynchronously!",
  illustration: 'traffic-spike',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Your system can handle the event flood!",
  achievement: "Message queue buffers events and enables async processing",
  metrics: [
    { label: 'Peak throughput', before: '5K events/sec', after: '100K events/sec' },
    { label: 'Event loss', before: '30% during spikes', after: '0%' },
    { label: 'Processing', after: 'Asynchronous' },
  ],
  nextTeaser: "Awesome! But now the product team wants session reconstruction...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Handling Traffic Spikes',
  conceptExplanation: `**The problem**: Your database can handle 5K writes/sec, but traffic spikes to 50K during peak hours.

**The solution**: Add a **Message Queue** (like Kafka or RabbitMQ) to:
1. **Acknowledge immediately**: Accept events and return 200 OK instantly
2. **Buffer events**: Queue stores events temporarily
3. **Process async**: Background workers consume from queue and write to DB at sustainable rate

**How it works**:
1. Browser sends event → App Server → Message Queue → Return immediately (2ms)
2. Background: Message Queue → Consumer → Database (at DB's pace)

This decouples ingestion from processing!`,
  whyItMatters: 'Without a message queue, traffic spikes overwhelm your database and events get dropped. With it, you can handle ANY spike.',
  realWorldExample: {
    company: 'Segment',
    scenario: 'Processing 500K events/sec during peak',
    howTheyDoIt: 'Uses Kafka to buffer events from customer websites. Consumers process events at their own pace - writing to 200+ destinations (databases, analytics tools, data warehouses).',
  },
  famousIncident: {
    title: 'Google Analytics Outage',
    company: 'Google Analytics',
    year: '2019',
    whatHappened: 'During a major product launch, Google Analytics couldn\'t handle the event spike. Tracking was down for 6 hours. Companies couldn\'t measure their campaign performance. Millions in ad spend with no attribution.',
    lessonLearned: 'Event tracking must handle 10x normal traffic. Message queues provide the buffer zone you need for unpredictable spikes.',
    icon: '📊',
  },
  keyPoints: [
    'Message queue decouples ingestion from processing',
    'Accept events fast, process them async at DB\'s pace',
    'Queue acts as buffer during traffic spikes',
    'Enables multiple consumers (analytics, data warehouse, etc.)',
  ],
  diagram: `
                          ┌──────────────┐
                          │   Message    │
┌────────┐  ┌─────────┐  │    Queue     │  ┌──────────┐  ┌─────────┐
│Browser │─▶│   App   │─▶│   (Kafka)    │─▶│ Consumer │─▶│Database │
└────────┘  │ Server  │  │              │  │ Worker   │  └─────────┘
            └─────────┘  └──────────────┘  └──────────┘

            ↑ Fast ack       ↑ Buffer        ↑ Process at DB pace
            (2ms)            (unlimited)      (5K/sec)
`,
  keyConcepts: [
    { title: 'Async Processing', explanation: 'Accept events fast, process them later', icon: '⚡' },
    { title: 'Buffering', explanation: 'Queue stores events during spikes', icon: '🗂️' },
    { title: 'Decoupling', explanation: 'Ingestion speed independent of processing speed', icon: '🔓' },
  ],
  quickCheck: {
    question: 'What is the main benefit of adding a message queue?',
    options: [
      'Makes queries faster',
      'Decouples ingestion from processing, handles traffic spikes',
      'Reduces storage costs',
      'Encrypts event data',
    ],
    correctIndex: 1,
    explanation: 'Message queues buffer events during spikes and allow async processing at the database\'s sustainable pace.',
  },
};

const step4: GuidedStep = {
  id: 'user-activity-tracking-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'System must handle traffic spikes without data loss',
    taskDescription: 'Build Client → App Server → Message Queue → Database',
    componentsNeeded: [
      { type: 'client', reason: 'Represents user browsers', displayName: 'Client' },
      { type: 'app_server', reason: 'Receives events', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Buffers events', displayName: 'Message Queue' },
      { type: 'database', reason: 'Stores processed events', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Browsers send events' },
      { from: 'App Server', to: 'Message Queue', reason: 'Server enqueues events' },
      { from: 'Message Queue', to: 'Database', reason: 'Async processing to DB' },
    ],
    successCriteria: ['Build full pipeline with Message Queue', 'Connect App Server → Queue → Database'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Build the full async pipeline with Message Queue in the middle',
    level2: 'Add all components and connect: Client → App Server → Message Queue → Database',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'message_queue' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 5: Session Reconstruction - Building User Journeys
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔄',
  scenario: "The product team wants to understand user journeys.",
  hook: "They're asking: 'How many sessions led to a purchase? What's the average session duration? What paths do users take?' But our events are just isolated data points!",
  challenge: "We need to group events into sessions and reconstruct user journeys. This requires stream processing to analyze events in real-time!",
  illustration: 'user-journey',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "You can now track user sessions!",
  achievement: "Stream processor reconstructs sessions from raw events",
  metrics: [
    { label: 'Sessions tracked', after: '✓ Real-time' },
    { label: 'Session duration', after: 'Calculated' },
    { label: 'User journeys', after: 'Reconstructed' },
  ],
  nextTeaser: "Great! But the analytics queries are slow...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Stream Processing: Building Sessions from Events',
  conceptExplanation: `**The challenge**: Raw events are isolated data points. A user's journey looks like:
- Event 1: page_view /home (10:00:00)
- Event 2: page_view /products (10:00:15)
- Event 3: click "Add to Cart" (10:01:30)
- Event 4: page_view /checkout (10:02:00)

**Session reconstruction** groups these into meaningful sessions:
- Session ID: ses_abc123
- Duration: 2 minutes
- Pages visited: 3
- Events: 4
- Converted: Yes (added to cart)

**How stream processing works**:
1. Stream processor reads events from message queue
2. Groups events by session_id (within 30-min window)
3. Computes session metrics (duration, page count, conversion)
4. Writes session summary to database`,
  whyItMatters: 'Sessions transform disconnected events into meaningful user journeys. This powers funnel analysis, conversion tracking, and behavioral insights.',
  realWorldExample: {
    company: 'Netflix',
    scenario: 'Understanding viewing sessions',
    howTheyDoIt: 'Uses Flink stream processing to group viewing events into sessions. Tracks: what users watched, when they paused, when they dropped off. Powers their recommendation engine.',
  },
  keyPoints: [
    'Stream processor reads from message queue',
    'Groups events by session_id using time windows',
    'Computes session-level metrics in real-time',
    'Enables funnel and journey analysis',
  ],
  diagram: `
┌──────────────┐     ┌────────────────┐     ┌─────────────┐
│   Message    │────▶│     Stream     │────▶│  Database   │
│    Queue     │     │   Processor    │     │             │
│              │     │                │     │  Events     │
│  Raw Events  │     │ Session Recon  │     │  Sessions   │
└──────────────┘     └────────────────┘     └─────────────┘

Stream Processor:
- Read events from queue
- Group by session_id (30-min window)
- Compute: duration, page_count, last_event
- Write session summary to DB
`,
  keyConcepts: [
    { title: 'Session', explanation: 'Group of related events within time window', icon: '🔄' },
    { title: 'Stream Processing', explanation: 'Real-time computation on event streams', icon: '⚡' },
    { title: 'Windowing', explanation: 'Group events by time (30-min session window)', icon: '⏱️' },
  ],
  quickCheck: {
    question: 'Why do we need a stream processor for session reconstruction?',
    options: [
      'To make queries faster',
      'To group events in real-time and compute session metrics',
      'To reduce storage costs',
      'To encrypt event data',
    ],
    correctIndex: 1,
    explanation: 'Stream processors analyze event streams in real-time, grouping events into sessions and computing metrics.',
  },
};

const step5: GuidedStep = {
  id: 'user-activity-tracking-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'System must reconstruct user sessions from events',
    taskDescription: 'Add Stream Processor to reconstruct sessions',
    componentsNeeded: [
      { type: 'client', reason: 'Represents user browsers', displayName: 'Client' },
      { type: 'app_server', reason: 'Receives events', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Buffers events', displayName: 'Message Queue' },
      { type: 'stream_processor', reason: 'Reconstructs sessions', displayName: 'Stream Processor' },
      { type: 'database', reason: 'Stores events and sessions', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Browsers send events' },
      { from: 'App Server', to: 'Message Queue', reason: 'Server enqueues events' },
      { from: 'Message Queue', to: 'Stream Processor', reason: 'Processor reads events' },
      { from: 'Stream Processor', to: 'Database', reason: 'Write sessions to DB' },
    ],
    successCriteria: ['Add Stream Processor', 'Connect Queue → Stream Processor → Database'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'message_queue', 'stream_processor', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'stream_processor' },
      { fromType: 'stream_processor', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add Stream Processor between Message Queue and Database',
    level2: 'Add all components and connect: Queue → Stream Processor → Database',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'message_queue' },
      { type: 'stream_processor' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'stream_processor' },
      { from: 'stream_processor', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 6: Analytics at Scale - OLAP Database
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📊',
  scenario: "Your analytics dashboards are taking 60 seconds to load!",
  hook: "The product team wants funnel analysis: 'How many users went from homepage → product → cart → checkout?' But querying 600M events in PostgreSQL is painfully slow!",
  challenge: "We need a specialized analytics database (OLAP) optimized for complex aggregation queries!",
  illustration: 'slow-query',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Analytics queries are now blazing fast!",
  achievement: "OLAP database handles complex analytics efficiently",
  metrics: [
    { label: 'Query latency', before: '60s', after: '2s' },
    { label: 'Funnel analysis', after: 'Real-time' },
    { label: 'Aggregations', after: 'Optimized' },
  ],
  nextTeaser: "Excellent! Now let's make sure the system can scale...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'OLAP vs OLTP: Choosing the Right Database',
  conceptExplanation: `**Two types of databases for two different jobs:**

**OLTP (Online Transaction Processing)** - PostgreSQL, MySQL
- Optimized for: Writes, updates, row lookups
- Use case: Store individual events
- Query pattern: "INSERT event", "SELECT * WHERE event_id = X"

**OLAP (Online Analytical Processing)** - ClickHouse, BigQuery
- Optimized for: Aggregations, scans, analytics
- Use case: Funnel analysis, dashboards, reports
- Query pattern: "COUNT users WHERE path = homepage → cart → purchase"

**For user activity tracking, you need BOTH:**
- OLTP (PostgreSQL): Store raw events
- OLAP (ClickHouse): Analytics queries

Stream processor copies events from OLTP to OLAP for analytics.`,
  whyItMatters: 'Wrong database = slow queries. OLTP databases (PostgreSQL) are terrible at analytics on 600M rows. OLAP databases are built for it.',
  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Analyzing 40 trillion requests per month',
    howTheyDoIt: 'Uses ClickHouse (OLAP) for analytics dashboards. Can query billions of rows in seconds. PostgreSQL would take hours for the same query.',
  },
  famousIncident: {
    title: 'Facebook\'s Analytics Scaling Crisis',
    company: 'Facebook',
    year: '2014',
    whatHappened: 'Facebook\'s analytics queries on MySQL were taking hours. Data scientists couldn\'t get insights. They built Presto (now Trino), a distributed SQL engine for analytics queries. Query times dropped from hours to seconds.',
    lessonLearned: 'Use OLAP databases for analytics. OLTP databases don\'t scale for analytical workloads.',
    icon: '📉',
  },
  keyPoints: [
    'OLTP (PostgreSQL) for transactional writes',
    'OLAP (ClickHouse) for analytics queries',
    'Stream processor copies events from OLTP to OLAP',
    'Columnar storage makes aggregations 100x faster',
  ],
  diagram: `
┌──────────────┐     ┌────────────────┐     ┌─────────────┐
│   Message    │────▶│     Stream     │────▶│  OLTP DB    │
│    Queue     │     │   Processor    │     │ (Postgres)  │
└──────────────┘     └───────┬────────┘     └─────────────┘
                             │
                             │ Copy events
                             ▼
                     ┌────────────────┐
                     │   OLAP DB      │
                     │ (ClickHouse)   │
                     │                │
                     │ Analytics ✓    │
                     │ Funnels ✓      │
                     │ Dashboards ✓   │
                     └────────────────┘
`,
  keyConcepts: [
    { title: 'OLAP', explanation: 'Database optimized for analytics queries', icon: '📊' },
    { title: 'Columnar Storage', explanation: 'Store by column for fast aggregations', icon: '📋' },
    { title: 'Data Pipeline', explanation: 'Copy data from OLTP to OLAP for analytics', icon: '🔄' },
  ],
  quickCheck: {
    question: 'Why do we need a separate OLAP database for analytics?',
    options: [
      'To save storage space',
      'OLTP databases are too slow for complex aggregations on large datasets',
      'To encrypt data',
      'OLAP is cheaper',
    ],
    correctIndex: 1,
    explanation: 'OLTP databases (PostgreSQL) are optimized for transactions, not analytics. OLAP databases are 100x faster for aggregation queries.',
  },
};

const step6: GuidedStep = {
  id: 'user-activity-tracking-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'System must support fast analytics queries',
    taskDescription: 'Add OLAP database and connect Stream Processor to both databases',
    componentsNeeded: [
      { type: 'client', reason: 'Represents user browsers', displayName: 'Client' },
      { type: 'app_server', reason: 'Receives events', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Buffers events', displayName: 'Message Queue' },
      { type: 'stream_processor', reason: 'Processes and routes events', displayName: 'Stream Processor' },
      { type: 'database', reason: 'OLTP for raw events', displayName: 'OLTP Database' },
      { type: 'data_warehouse', reason: 'OLAP for analytics', displayName: 'OLAP Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Browsers send events' },
      { from: 'App Server', to: 'Message Queue', reason: 'Server enqueues events' },
      { from: 'Message Queue', to: 'Stream Processor', reason: 'Processor reads events' },
      { from: 'Stream Processor', to: 'OLTP Database', reason: 'Store raw events' },
      { from: 'Stream Processor', to: 'OLAP Database', reason: 'Copy for analytics' },
    ],
    successCriteria: [
      'Add OLAP Database (Data Warehouse)',
      'Connect Stream Processor to both OLTP and OLAP databases',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'message_queue', 'stream_processor', 'database', 'data_warehouse'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'stream_processor' },
      { fromType: 'stream_processor', toType: 'database' },
      { fromType: 'stream_processor', toType: 'data_warehouse' },
    ],
  },
  hints: {
    level1: 'Add OLAP database and connect Stream Processor to both databases',
    level2: 'Add Data Warehouse component and connect Stream Processor to both Database (OLTP) and Data Warehouse (OLAP)',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'message_queue' },
      { type: 'stream_processor' },
      { type: 'database' },
      { type: 'data_warehouse' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'stream_processor' },
      { from: 'stream_processor', to: 'database' },
      { from: 'stream_processor', to: 'data_warehouse' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const userActivityTrackingGuidedTutorial: GuidedTutorial = {
  problemId: 'user-activity-tracking-guided',
  problemTitle: 'Build User Activity Tracking - Analytics at Scale',

  requirementsPhase: userActivityTrackingRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],

  finalExamTestCases: [
    {
      name: 'Basic Event Collection',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Browsers can track events and the system stores them.',
      traffic: { type: 'write', rps: 100, writeRps: 100 },
      duration: 10,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'Session Tracking',
      type: 'functional',
      requirement: 'FR-2',
      description: 'System reconstructs user sessions from raw events.',
      traffic: { type: 'mixed', rps: 500, readRps: 100, writeRps: 400 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Analytics Queries',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Support fast analytics queries on event data.',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 30,
      passCriteria: { maxP99Latency: 5000, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-P1: Ingestion Latency',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 10K event ingestion RPS with p99 latency under 100ms.',
      traffic: { type: 'write', rps: 10000, writeRps: 10000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: Traffic Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Absorb a sudden traffic spike to 25K events/sec without data loss.',
      traffic: { type: 'write', rps: 25000, writeRps: 25000 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-R1: System Reliability',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Maintain availability during component failures.',
      traffic: { type: 'mixed', rps: 5000, readRps: 1000, writeRps: 4000 },
      duration: 90,
      failureInjection: { type: 'app_crash', atSecond: 45, recoverySecond: 60 },
      passCriteria: { minAvailability: 0.95, maxErrorRate: 0.1 },
    },
    {
      name: 'NFR-C1: Cost Guardrail',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Meet the $5,000/month budget while handling production traffic.',
      traffic: { type: 'mixed', rps: 7000, readRps: 1000, writeRps: 6000 },
      duration: 60,
      passCriteria: { maxMonthlyCost: 5000, maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export function getUserActivityTrackingGuidedTutorial(): GuidedTutorial {
  return userActivityTrackingGuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = userActivityTrackingRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= userActivityTrackingRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
