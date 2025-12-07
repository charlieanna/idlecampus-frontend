import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Personalized Search Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial teaching system design through
 * building a personalized search engine with behavioral tracking,
 * query reranking, and A/B testing.
 *
 * Key Concepts:
 * - User behavior tracking and event streams
 * - Query reranking based on user preferences
 * - A/B testing framework for search algorithms
 * - Real-time analytics and feature extraction
 * - Machine learning model serving
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const personalizedSearchRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a personalized search system that learns from user behavior",

  interviewer: {
    name: 'Alex Rivera',
    role: 'VP of Search & Discovery at SearchTech',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What are the main capabilities of this personalized search system?",
      answer: "Users should be able to:\n\n1. **Search for items** - Get relevant results based on query\n2. **Get personalized rankings** - Results ranked based on user's history and preferences\n3. **Track user behavior** - Clicks, dwell time, purchases inform future searches\n4. **Experience A/B tests** - Different ranking algorithms tested on different user segments\n5. **See improved results over time** - System learns from user interactions",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-5',
      learningPoint: "Personalized search combines traditional search with machine learning and user behavior analytics",
    },
    {
      id: 'search-query',
      category: 'functional',
      question: "What happens when a user submits a search query?",
      answer: "The system should:\n1. Retrieve candidate results (traditional search)\n2. Rerank based on user's profile and preferences\n3. Track that the search happened\n4. Log results shown to user\n5. Return personalized, ranked results within 200ms",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2',
      learningPoint: "Search has two phases: retrieval (candidate generation) and ranking (personalization)",
    },
    {
      id: 'user-tracking',
      category: 'functional',
      question: "What user behaviors should we track?",
      answer: "Track engagement signals:\n- Clicks on search results (position, item)\n- Time spent on result pages (dwell time)\n- Purchases or conversions\n- Query reformulations\n- Result abandonment (searched but didn't click)\n\nThese signals train the personalization model.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "User behavior is the signal that drives personalization - more data = better results",
    },
    {
      id: 'reranking',
      category: 'functional',
      question: "How should personalized reranking work?",
      answer: "For each user query:\n1. Retrieve 100-1000 candidate results from base search\n2. Extract user features (past searches, preferences, demographics)\n3. Extract item features (popularity, category, price)\n4. ML model scores each candidate\n5. Return top N results sorted by personalized score",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Reranking is cheaper than retrieval - focus compute on top candidates",
    },
    {
      id: 'ab-testing',
      category: 'functional',
      question: "How do we know if personalization is actually better?",
      answer: "A/B testing framework:\n- Assign users to control (baseline) or treatment (new algorithm) groups\n- Track metrics: CTR, conversion rate, user satisfaction\n- Statistical significance testing\n- Gradual rollout of winning variants",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Never ship changes without A/B testing - data-driven decisions prevent regressions",
    },
    {
      id: 'real-time-personalization',
      category: 'clarification',
      question: "Should personalization update in real-time as user searches?",
      answer: "For MVP: Update user profile periodically (hourly). Real-time personalization within a session is v2. Good compromise: session-level features (searches this session) + periodic profile updates.",
      importance: 'important',
      insight: "Real-time ML is complex - start with near-real-time (minutes) and iterate",
    },
    {
      id: 'cold-start',
      category: 'clarification',
      question: "What about new users with no history?",
      answer: "Cold start strategies:\n1. Use demographic features (location, device)\n2. Global popularity baseline\n3. Collaborative filtering (users like you)\n4. Explicit preference collection (onboarding survey)\n\nFor MVP: fall back to popularity baseline.",
      importance: 'important',
      insight: "Cold start is a classic ML problem - always need a fallback strategy",
    },

    // SCALE & NFRs
    {
      id: 'throughput-searches',
      category: 'throughput',
      question: "How many search queries per day?",
      answer: "100 million queries per day (about 1,200 queries per second average)",
      importance: 'critical',
      calculation: {
        formula: "100M ÷ 86,400 sec = 1,157 QPS average",
        result: "~1,200 QPS average, ~3,600 QPS peak (3x)",
      },
      learningPoint: "Search is read-heavy and latency-sensitive",
    },
    {
      id: 'throughput-events',
      category: 'throughput',
      question: "How many user behavior events per day?",
      answer: "About 500 million events/day (clicks, views, purchases). Each query generates 2-5 events on average (search + clicks + dwell time).",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 events/sec",
        result: "~6K events/sec average, ~18K events/sec peak",
      },
      learningPoint: "Event tracking generates 5x more writes than searches",
    },
    {
      id: 'active-users',
      category: 'throughput',
      question: "How many active users?",
      answer: "50 million daily active users, each searching 2-3 times per day",
      importance: 'important',
      learningPoint: "Need to store and query user profiles efficiently",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should search results return?",
      answer: "p99 < 200ms for personalized search. Users expect instant results. Includes retrieval + reranking + feature extraction.",
      importance: 'critical',
      learningPoint: "Personalization can't slow down search - need efficient feature serving",
    },
    {
      id: 'latency-tracking',
      category: 'latency',
      question: "How quickly should events be processed?",
      answer: "Event ingestion should be async and near-real-time (< 1 minute). Profile updates can happen hourly. ML model retraining daily.",
      importance: 'important',
      insight: "Different components have different latency requirements",
    },
    {
      id: 'ml-model-size',
      category: 'payload',
      question: "How large is the personalization model?",
      answer: "Typical ranking model: 100-500MB for gradient boosted trees or neural network. User feature vectors: 1-5KB per user. Item features: 50M items × 2KB = 100GB.",
      importance: 'important',
      calculation: {
        formula: "50M users × 2KB = 100GB user features + 100GB item features",
        result: "~200GB feature storage + model weights",
      },
      learningPoint: "ML models and features must be served with low latency",
    },
    {
      id: 'availability',
      category: 'availability',
      question: "What happens if personalization service fails?",
      answer: "Graceful degradation is critical. If personalization fails, fall back to baseline search (no personalization). Search must never go down completely.",
      importance: 'critical',
      insight: "Personalization is an enhancement - don't let it become a single point of failure",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'search-query', 'user-tracking', 'reranking', 'ab-testing'],
  criticalFRQuestionIds: ['core-features', 'search-query', 'user-tracking', 'reranking'],
  criticalScaleQuestionIds: ['throughput-searches', 'throughput-events', 'latency-search'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can search for items',
      description: 'Execute queries and get relevant results',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Results are personalized and reranked',
      description: 'Ranking based on user preferences and behavior',
      emoji: '🎯',
    },
    {
      id: 'fr-3',
      text: 'FR-3: System tracks user behavior',
      description: 'Capture clicks, dwell time, and conversions',
      emoji: '📊',
    },
    {
      id: 'fr-4',
      text: 'FR-4: A/B testing for ranking algorithms',
      description: 'Test and compare different personalization strategies',
      emoji: '🧪',
    },
    {
      id: 'fr-5',
      text: 'FR-5: User profiles improve over time',
      description: 'ML models learn from user interactions',
      emoji: '📈',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 million',
    writesPerDay: '500M events (clicks, views, purchases)',
    readsPerDay: '100M search queries',
    peakMultiplier: 3,
    readWriteRatio: '1:5 (more events than searches)',
    calculatedWriteRPS: { average: 5787, peak: 17361 },
    calculatedReadRPS: { average: 1157, peak: 3471 },
    maxPayloadSize: '~5KB per search request',
    storagePerRecord: '~2KB per user profile',
    storageGrowthPerYear: '~10TB event data',
    redirectLatencySLA: 'p99 < 200ms (search)',
    createLatencySLA: 'p99 < 100ms (event ingestion)',
  },

  architecturalImplications: [
    '✅ 200ms search latency → Feature serving must be cached',
    '✅ 6K events/sec → Async event processing with message queue',
    '✅ 100M searches/day → Caching + read replicas essential',
    '✅ Personalization → ML model serving infrastructure',
    '✅ A/B testing → Experimentation framework with metrics tracking',
    '✅ Graceful degradation → Fallback to baseline search',
  ],

  outOfScope: [
    'Content indexing (assume search index exists)',
    'Spell correction and query understanding',
    'Image/video search',
    'Voice search',
    'Real-time collaborative filtering',
  ],

  keyInsight: "First, let's make it WORK. We'll build basic search with user tracking. Then we'll add personalization, and finally A/B testing. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔍',
  scenario: "Welcome to SearchTech! You're building a personalized search engine.",
  hook: "Your first user just opened the app and typed their first query!",
  challenge: "Set up the basic connection so search queries can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your search platform is online!',
  achievement: 'Users can now submit search queries',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting queries', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to process searches yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Search Client-Server',
  conceptExplanation: `Every search system starts with a **Client** sending queries to a **Server**.

When a user searches:
1. Client sends query to **Search API Server**
2. Server processes query and retrieves results
3. Server returns ranked results to client

This is the foundation for all search functionality!`,

  whyItMatters: 'Without this connection, users can\'t search - everything else depends on this basic flow.',

  realWorldExample: {
    company: 'Google',
    scenario: 'Processing 8.5 billion searches per day',
    howTheyDoIt: 'Started with simple query server in 1998, now uses globally distributed search infrastructure with millisecond response times',
  },

  keyPoints: [
    'Client = user\'s browser, mobile app, or API consumer',
    'Search Server = backend that processes queries and returns results',
    'REST API = interface for submitting queries and getting results',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'User interface submitting search queries', icon: '📱' },
    { title: 'Search Server', explanation: 'Backend processing search requests', icon: '🖥️' },
    { title: 'Query', explanation: 'User search input (keywords, filters)', icon: '❓' },
  ],
};

const step1: GuidedStep = {
  id: 'personalized-search-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up foundation for search',
    taskDescription: 'Add a Client and Search Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users submitting search queries', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes search queries', displayName: 'Search Server' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'Search Server component added to canvas',
      'Client connected to Search Server',
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
// STEP 2: Implement Search API with User Tracking
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "A user just submitted a search query, but the server doesn't know what to do!",
  hook: "You need to implement the search API and start tracking user behavior.",
  challenge: "Write Python code to handle search queries and log user events.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Search is working and tracking events!',
  achievement: 'You implemented search and user behavior tracking',
  metrics: [
    { label: 'APIs implemented', after: '2' },
    { label: 'Search working', after: '✓' },
    { label: 'Event tracking', after: '✓' },
  ],
  nextTeaser: "But when the server restarts, all user data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Search API and Event Tracking',
  conceptExplanation: `Every search system needs two core APIs:

**Search API**: \`search(query, user_id)\`
- Retrieve results matching query
- Log the search event (query, user, timestamp)
- Return ranked results

**Event Tracking API**: \`track_event(event_type, user_id, item_id, metadata)\`
- Capture user interactions (clicks, purchases)
- Store for later analysis
- Feed into personalization model

For now, we'll store events in memory. Database comes next!`,

  whyItMatters: 'User behavior is the signal that powers personalization. No tracking = no learning.',

  famousIncident: {
    title: 'Google\'s PageRank Revolution',
    company: 'Google',
    year: '1998',
    whatHappened: 'Google realized that user click behavior (which results people click) was a powerful ranking signal. By tracking clicks and dwell time, they could improve search quality dramatically compared to competitors who only used keyword matching.',
    lessonLearned: 'User behavior is the most powerful signal for relevance. Track everything (with privacy controls).',
    icon: '📊',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Tracking search behavior for 300M+ users',
    howTheyDoIt: 'Logs every search, click, add-to-cart, and purchase. Events feed into real-time personalization models that power product rankings.',
  },

  keyPoints: [
    'search() handles queries and returns results',
    'track_event() captures user interactions asynchronously',
    'Events include: searches, clicks, dwell time, conversions',
    'In-memory storage for now - database comes in Step 3',
  ],

  quickCheck: {
    question: 'Why track clicks separately from searches?',
    options: [
      'Clicks are more important',
      'Clicks indicate user preference - what they actually engage with vs what was shown',
      'It\'s a requirement',
      'Searches are already logged',
    ],
    correctIndex: 1,
    explanation: 'Click-through rate and position bias tell us which results users find relevant. This signal trains personalization models.',
  },

  keyConcepts: [
    { title: 'Search API', explanation: 'Processes queries and returns results', icon: '🔍' },
    { title: 'Event Tracking', explanation: 'Captures user behavior signals', icon: '📊' },
    { title: 'Behavior Signal', explanation: 'User actions that indicate preference', icon: '👆' },
  ],
};

const step2: GuidedStep = {
  id: 'personalized-search-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Search, FR-3: Track behavior',
    taskDescription: 'Configure APIs and implement search and event tracking handlers',
    successCriteria: [
      'Click on Search Server to open inspector',
      'Assign search and track_event APIs',
      'Open Python tab and implement handlers',
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
    level1: 'Click the Search Server, then go to the APIs tab to assign endpoints',
    level2: 'After assigning APIs, switch to Python tab and implement search() and track_event() functions',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/search', 'POST /api/v1/track'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for User Profiles and Events
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💾',
  scenario: "Your server just crashed at 2 AM. When it restarted...",
  hook: "All user profiles and search history are gone! You lost weeks of behavior data.",
  challenge: "Add a database to persist user profiles and event data.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '✅',
  message: 'User data is now persistent!',
  achievement: 'Profiles and events survive server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'User profiles saved', after: '✓' },
  ],
  nextTeaser: "But storing millions of events in one database will be slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: User Profiles and Event Storage',
  conceptExplanation: `We need to store two types of data:

**User Profiles** (in SQL database):
- User preferences, demographics
- Aggregated behavior features
- Fast lookup by user_id for search personalization

**Event Data** (needs different storage):
- Raw click streams, searches, conversions
- Append-only, time-series data
- Used for analytics and model training

For now, store everything in PostgreSQL. We'll optimize storage in later steps.`,

  whyItMatters: 'Losing user behavior data means losing the personalization intelligence. Persistence is critical.',

  famousIncident: {
    title: 'LinkedIn Data Loss',
    company: 'LinkedIn',
    year: '2011',
    whatHappened: 'A database corruption incident caused LinkedIn to lose some user activity data. This affected recommendation quality for weeks until models could be retrained with new data.',
    lessonLearned: 'User behavior data is valuable - replicate it, back it up, treat it as critical infrastructure.',
    icon: '💼',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Storing viewing behavior for 200M+ users',
    howTheyDoIt: 'Uses Cassandra for event storage (billions of events), separate MySQL for user profiles. Different data needs different databases.',
  },

  keyPoints: [
    'User profiles: fast lookup by user_id (SQL database)',
    'Event data: time-series, append-only (will move to event store later)',
    'Separate tables: users, events, user_features',
    'Events table will grow fast - millions of rows per day',
  ],

  quickCheck: {
    question: 'Why might we eventually need separate storage for events vs profiles?',
    options: [
      'Events grow much faster and have different query patterns',
      'It\'s more secure',
      'Databases can\'t handle both',
      'It\'s cheaper',
    ],
    correctIndex: 0,
    explanation: 'Events are append-only, time-series data (500M/day). Profiles are small, frequently updated (50M users). Different storage optimizations needed.',
  },

  keyConcepts: [
    { title: 'User Profile', explanation: 'Aggregated features for personalization', icon: '👤' },
    { title: 'Event Stream', explanation: 'Raw user interaction data', icon: '📊' },
    { title: 'Persistence', explanation: 'Durable storage surviving crashes', icon: '💾' },
  ],
};

const step3: GuidedStep = {
  id: 'personalized-search-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent data storage',
    taskDescription: 'Add a Database and connect Search Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store user profiles and event data', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added',
      'Search Server connected to Database',
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
    level2: 'Click Search Server, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Message Queue for Async Event Processing
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "Users are complaining: 'Search is slow!' Your server is timing out.",
  hook: "You're writing 6K events/second synchronously to the database. Search latency spiked from 50ms to 800ms!",
  challenge: "Decouple event tracking with a message queue for async processing.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Search is fast again!',
  achievement: 'Async event processing decouples writes from search',
  metrics: [
    { label: 'Search latency', before: '800ms', after: '150ms' },
    { label: 'Event processing', after: 'Async' },
  ],
  nextTeaser: "But how do we actually personalize search results?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Async Event Processing',
  conceptExplanation: `**The Problem**: Writing events synchronously blocks search requests.

**The Solution**: Message Queue (Kafka/RabbitMQ)

**Architecture**:
1. Search Server publishes events to queue (fast, 1ms)
2. Returns search results immediately
3. Background workers consume events from queue
4. Workers process and write to database

Benefits:
- Search latency stays low (< 200ms)
- Can handle traffic spikes (queue buffers)
- Failed events can be retried
- Can add multiple consumers for scaling`,

  whyItMatters: 'At 6K events/sec, synchronous writes would destroy search latency. Queues are essential for high-throughput systems.',

  famousIncident: {
    title: 'LinkedIn Kafka Creation',
    company: 'LinkedIn',
    year: '2011',
    whatHappened: 'LinkedIn built Kafka specifically to handle activity stream data (user actions, page views). Traditional message queues couldn\'t handle the throughput. Kafka now processes trillions of messages per day at LinkedIn.',
    lessonLearned: 'Event-driven architecture with message queues enables massive scale. Design for async from day 1.',
    icon: '📨',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Processing billions of user events',
    howTheyDoIt: 'Uses Kinesis (their managed Kafka) for real-time event streams. Search services publish events async, analytics workers consume and process.',
  },

  diagram: `
┌────────┐    Search      ┌───────────────┐
│ Client │───Request────▶ │ Search Server │
└────────┘   ◀──Results──  └───────┬───────┘
                                   │
                                   │ Publish event (1ms)
                                   ▼
                            ┌──────────────┐
                            │ Message Queue│
                            │   (Kafka)    │
                            └──────┬───────┘
                                   │
                                   │ Consume & process
                                   ▼
                            ┌──────────────┐     ┌──────────┐
                            │Event Worker  │────▶│ Database │
                            └──────────────┘     └──────────┘
`,

  keyPoints: [
    'Message queue decouples event production from consumption',
    'Search server publishes events async (fast)',
    'Workers consume and process in background',
    'Queue handles traffic spikes and provides retry logic',
  ],

  quickCheck: {
    question: 'What happens to events if the database is temporarily down?',
    options: [
      'Events are lost',
      'Events stay in queue and are processed when DB recovers',
      'Search stops working',
      'Events are logged to file',
    ],
    correctIndex: 1,
    explanation: 'Message queues buffer events. Workers retry failed processing. Events are durable until successfully processed.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer between producers and consumers', icon: '📬' },
    { title: 'Async Processing', explanation: 'Background work decoupled from request', icon: '⚙️' },
    { title: 'Event Worker', explanation: 'Consumer that processes events from queue', icon: '👷' },
  ],
};

const step4: GuidedStep = {
  id: 'personalized-search-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Track behavior asynchronously',
    taskDescription: 'Add a Message Queue for async event processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Decouple event tracking from search latency', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'Search Server connected to Message Queue',
      'Message Queue connected to Database',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect Search Server → Message Queue → Database for async event flow',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Cache for User Profiles and Features
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Every search query is hitting the database to fetch user profiles!",
  hook: "At 3,600 QPS peak, your database is maxed out. Search latency is creeping up again.",
  challenge: "Add a cache to serve user profiles and features without database hits.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'User profiles are cached!',
  achievement: 'Feature serving is now fast and database load is reduced',
  metrics: [
    { label: 'Feature lookup latency', before: '50ms', after: '2ms' },
    { label: 'Database load', before: '100%', after: '30%' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "Now we need to actually personalize the results with ML...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Caching User Features for Fast Personalization',
  conceptExplanation: `**The Problem**: Every search needs user features for personalization. Fetching from DB is too slow (50ms).

**The Solution**: Redis cache for feature serving

**Architecture**:
1. On search request, check cache for user features
2. Cache hit (95% of time) → return in 2ms
3. Cache miss → fetch from DB, store in cache
4. Background job updates features periodically (hourly)

What to cache:
- User preference vectors
- Recent search history (last 50 searches)
- Demographic features
- Aggregated behavior stats (CTR by category)`,

  whyItMatters: 'At 200ms search latency budget, spending 50ms on feature lookup is too expensive. Caching is essential for ML serving.',

  famousIncident: {
    title: 'Facebook TAO Cache',
    company: 'Facebook/Meta',
    year: '2013',
    whatHappened: 'Facebook built TAO (The Associations and Objects) cache to serve social graph queries. Before TAO, database reads for features killed performance. TAO reduced database load by 99% and enabled real-time personalization at billion-user scale.',
    lessonLearned: 'For ML feature serving, cache is not optional - it\'s the primary data store. DB is backup.',
    icon: '👥',
  },

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Serving personalization features for search ranking',
    howTheyDoIt: 'Uses Redis for feature store. Pre-computes and caches user and listing features. Search retrieves features in < 5ms to feed into ML models.',
  },

  keyPoints: [
    'Cache user features for fast access during search',
    'Cache hit rate 95%+ means most searches avoid DB',
    'Background job updates features periodically',
    'TTL: 1-24 hours depending on feature freshness needs',
  ],

  quickCheck: {
    question: 'Why not just make the database faster instead of adding cache?',
    options: [
      'Databases are inherently slow',
      'Cache is cheaper',
      'At scale, cache (in-memory) is 10-100x faster than DB (disk). You need both.',
      'Cache is easier to set up',
    ],
    correctIndex: 2,
    explanation: 'Redis cache: 1-2ms. PostgreSQL: 10-50ms. At thousands of QPS, that difference is critical. Cache is optimized for read-heavy access patterns.',
  },

  keyConcepts: [
    { title: 'Feature Store', explanation: 'Cache of ML features for serving', icon: '🗃️' },
    { title: 'Cache Hit', explanation: 'Feature found in cache (fast path)', icon: '✅' },
    { title: 'Feature Freshness', explanation: 'How recently features were updated', icon: '🔄' },
  ],
};

const step5: GuidedStep = {
  id: 'personalized-search-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: Fast feature serving for personalization',
    taskDescription: 'Add Redis cache for user profiles and features',
    componentsNeeded: [
      { type: 'cache', reason: 'Fast access to user features for search personalization', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added',
      'Search Server connected to Cache',
      'Configure TTL and cache strategy',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect Search Server to Cache for fast feature lookup',
    solutionComponents: [{ type: 'cache', config: { ttl: 3600 } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 6: Add ML Model Service for Reranking
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🤖',
  scenario: "You have user features and search results, but no personalization yet!",
  hook: "All users see the same rankings. Your ML team trained a reranking model - now you need to serve it.",
  challenge: "Add an ML model service to personalize search result rankings.",
  illustration: 'ai-brain',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Personalized reranking is live!',
  achievement: 'ML model scores and reranks results for each user',
  metrics: [
    { label: 'Personalization', after: 'Enabled' },
    { label: 'Model serving latency', after: '<50ms' },
    { label: 'CTR improvement', after: '+15%' },
  ],
  nextTeaser: "But how do we know if personalization actually helps?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'ML Model Serving for Personalized Ranking',
  conceptExplanation: `**Reranking Pipeline**:

1. **Retrieval**: Base search returns 100-1000 candidates
2. **Feature extraction**: Get user features (from cache) + item features
3. **Model scoring**: ML model scores each candidate
4. **Reranking**: Sort by personalized score
5. **Return**: Top N results to user

**Model Serving**:
- Separate ML service (not in search server)
- Handles model inference at scale
- Can update models without redeploying search
- Gradient boosted trees or neural network

**Features used**:
- User: search history, click patterns, preferences
- Item: popularity, category, price
- Context: time, device, location
- Interaction: user-item similarity`,

  whyItMatters: 'Personalization is what makes modern search useful. Same query, different user → different results.',

  famousIncident: {
    title: 'Netflix Prize Competition',
    company: 'Netflix',
    year: '2006-2009',
    whatHappened: 'Netflix offered $1M to improve their recommendation algorithm by 10%. The winning solution used ensemble of ML models. But Netflix never deployed it - the complexity wasn\'t worth the marginal gain. They learned that engineering infrastructure (fast feature serving, A/B testing) matters more than the fanciest algorithm.',
    lessonLearned: 'Simple model served well > complex model served poorly. Infrastructure matters more than algorithms.',
    icon: '🎬',
  },

  realWorldExample: {
    company: 'Uber',
    scenario: 'Personalizing restaurant search',
    howTheyDoIt: 'Uses TensorFlow Serving for ML model inference. Features from Redis, candidates from Elasticsearch, reranked in < 100ms.',
  },

  diagram: `
Search Request (user_id, query)
        │
        ▼
┌───────────────────┐
│  Retrieval Phase  │ → Get 100 candidates from search index
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Feature Extraction│ → User features (cache) + Item features
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  ML Model Service │ → Score each candidate (personalized)
│  (TF Serving)     │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│   Rerank & Return │ → Sort by score, return top 20
└───────────────────┘
`,

  keyPoints: [
    'ML service separate from search server (decoupled)',
    'Model scores candidates using user + item features',
    'Reranking is cheaper than retrieval (fewer candidates)',
    'Model can be updated independently',
  ],

  quickCheck: {
    question: 'Why separate ML serving from the search server?',
    options: [
      'Security reasons',
      'Allows independent scaling and model updates without affecting search',
      'It\'s required',
      'ML models can\'t run in the same process',
    ],
    correctIndex: 1,
    explanation: 'Separation of concerns: search server handles retrieval, ML service handles ranking. Can scale and deploy independently.',
  },

  keyConcepts: [
    { title: 'Reranking', explanation: 'Personalizing order of search results', icon: '🔀' },
    { title: 'Model Serving', explanation: 'Running ML inference at low latency', icon: '🤖' },
    { title: 'Feature Vector', explanation: 'Numeric representation for ML input', icon: '📊' },
  ],
};

const step6: GuidedStep = {
  id: 'personalized-search-step-6',
  stepNumber: 6,
  frIndex: 1,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-2: ML-powered personalized reranking',
    taskDescription: 'Add ML Model Service for scoring and reranking results',
    componentsNeeded: [
      { type: 'app_server', reason: 'ML model serving for personalization', displayName: 'ML Model Service' },
    ],
    successCriteria: [
      'ML Model Service component added',
      'Search Server connected to ML Service',
      'ML Service connected to Cache (for features)',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add another App Server component and label it as ML Model Service',
    level2: 'Connect Search Server → ML Service → Cache for feature access',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 7: Add Analytics Database for A/B Testing
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🧪',
  scenario: "Product Manager: 'Did personalization actually improve search quality?'",
  hook: "You have no metrics! You need A/B testing to measure impact.",
  challenge: "Add an analytics database to track experiment metrics.",
  illustration: 'analytics-dashboard',
};

const step7Celebration: CelebrationContent = {
  emoji: '📊',
  message: 'A/B testing framework is live!',
  achievement: 'Can now measure and compare search algorithm performance',
  metrics: [
    { label: 'A/B tests running', after: '3' },
    { label: 'Metrics tracked', after: 'CTR, conversion, latency' },
    { label: 'Statistical significance', after: 'Calculated' },
  ],
  nextTeaser: "Final step: optimize for scale and reliability...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'A/B Testing Framework for Search Quality',
  conceptExplanation: `**A/B Testing Workflow**:

1. **Experiment setup**: Define control (baseline) vs treatment (new algorithm)
2. **User assignment**: Hash user_id to assign to group (50/50 split)
3. **Variant serving**: Search server uses appropriate algorithm per user
4. **Metrics tracking**: Log which variant, track outcomes (clicks, conversions)
5. **Analysis**: Statistical test to determine winner

**Key Metrics for Search**:
- Click-through rate (CTR)
- Time to first click
- Conversion rate
- Zero-result rate
- Result abandonment rate

**Analytics Database**:
- Separate from operational DB
- Optimized for aggregation queries
- Often uses columnar storage (ClickHouse, BigQuery)`,

  whyItMatters: 'Without A/B testing, you\'re flying blind. Data-driven decisions prevent launching features that hurt user experience.',

  famousIncident: {
    title: 'Microsoft Bing: The Importance of A/B Testing',
    company: 'Microsoft Bing',
    year: '2012',
    whatHapppped: 'Bing ran an A/B test on showing more ads. Treatment group had +10% revenue but -5% user satisfaction. Without the test, they would have shipped it and hurt long-term growth. They chose not to ship.',
    lessonLearned: 'Measure what matters. Short-term metrics (revenue) can conflict with long-term health (satisfaction). A/B test everything.',
    icon: '🔍',
  },

  realWorldExample: {
    company: 'Google',
    scenario: 'Running thousands of search experiments simultaneously',
    howTheyDoIt: 'Every search experiment is A/B tested. Metrics computed in real-time. Only changes that improve quality metrics are launched.',
  },

  diagram: `
User Search Request
        │
        ▼
┌────────────────────┐
│  Assign to Group   │ → Hash(user_id) % 2
│  Control or Test   │
└────────┬───────────┘
         │
    ┌────┴────┐
    │         │
Control    Treatment
(baseline) (personalized)
    │         │
    └────┬────┘
         │
         ▼
  Track Metrics
(CTR, conversion)
         │
         ▼
┌────────────────────┐
│ Analytics Database │ → Aggregate and analyze
│  (ClickHouse)      │
└────────────────────┘
`,

  keyPoints: [
    'A/B testing measures real impact on users',
    'Random assignment ensures valid comparison',
    'Track metrics per experiment variant',
    'Analytics DB optimized for aggregation queries',
  ],

  quickCheck: {
    question: 'Why use a separate analytics database instead of the main database?',
    options: [
      'Security',
      'Main DB is optimized for transactions, analytics DB for aggregations',
      'It\'s required',
      'Analytics is too slow for main DB',
    ],
    correctIndex: 1,
    explanation: 'OLTP (transactions) vs OLAP (analytics). Different workloads need different database optimizations. Keeps analytics queries from slowing down search.',
  },

  keyConcepts: [
    { title: 'A/B Test', explanation: 'Controlled experiment comparing variants', icon: '🧪' },
    { title: 'Treatment Group', explanation: 'Users experiencing new feature', icon: '🎯' },
    { title: 'Metrics', explanation: 'Measurements of user behavior and quality', icon: '📊' },
  ],
};

const step7: GuidedStep = {
  id: 'personalized-search-step-7',
  stepNumber: 7,
  frIndex: 3,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-4: A/B testing for search algorithms',
    taskDescription: 'Add Analytics Database for experiment metrics',
    componentsNeeded: [
      { type: 'database', reason: 'Store and analyze A/B test metrics', displayName: 'Analytics DB' },
    ],
    successCriteria: [
      'Analytics Database component added',
      'Message Queue connected to Analytics DB (for event metrics)',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add another Database component for analytics',
    level2: 'Connect Message Queue → Analytics DB to stream metrics',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'message_queue', to: 'database' }],
  },
};

// =============================================================================
// STEP 8: Add Load Balancer and Scale for Production
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🚀',
  scenario: "You're launching to production! Peak traffic is 10x what you tested.",
  hook: "One search server can't handle 3,600 QPS. You need horizontal scaling and high availability.",
  challenge: "Add load balancer and scale search servers for production traffic.",
  illustration: 'traffic-spike',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a personalized search system!',
  achievement: 'Production-ready search with ML personalization and A/B testing',
  metrics: [
    { label: 'Search QPS capacity', after: '10,000+' },
    { label: 'Search latency p99', after: '<200ms' },
    { label: 'Event processing', after: '20K events/sec' },
    { label: 'Personalization', after: 'Enabled' },
    { label: 'A/B testing', after: 'Running' },
  ],
  nextTeaser: "You've mastered personalized search system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Production Scale: Load Balancing and Redundancy',
  conceptExplanation: `**Production Requirements**:

1. **High availability** - No single point of failure
2. **Horizontal scaling** - Handle traffic spikes
3. **Graceful degradation** - Work even if personalization fails
4. **Low latency** - p99 < 200ms under load

**Load Balancer**:
- Distributes queries across search servers
- Health checks to route around failures
- SSL termination

**Scaling Strategy**:
- Multiple search server instances (3-5+)
- Database read replicas
- ML service can scale independently
- Message queue handles burst traffic

**Graceful Degradation**:
- If ML service fails → fall back to baseline ranking
- If cache misses → fetch from DB (slower but works)
- If personalization too slow → return unpersonalized results`,

  whyItMatters: 'Search is mission-critical. System must handle failures gracefully and scale to meet demand.',

  famousIncident: {
    title: 'Amazon Search Outage Cost',
    company: 'Amazon',
    year: '2013',
    whatHappened: 'Amazon search went down for 30 minutes during prime time. Estimated revenue loss: $5 million. The outage was caused by a single component failure that cascaded. After this, they invested heavily in redundancy and graceful degradation.',
    lessonLearned: 'Search downtime = lost revenue. Design for resilience with load balancing, failover, and graceful degradation.',
    icon: '📦',
  },

  realWorldExample: {
    company: 'Etsy',
    scenario: 'Scaling personalized search to millions of queries',
    howTheyDoIt: 'Load balanced search servers, fallback to baseline if personalization fails, aggressive caching, A/B test all changes',
  },

  keyPoints: [
    'Load balancer enables horizontal scaling and high availability',
    'Multiple search server instances handle traffic and failures',
    'Graceful degradation: personalization is enhancement, not requirement',
    'Cache + replicas + async processing = scalable architecture',
  ],

  quickCheck: {
    question: 'What should happen if the ML personalization service goes down?',
    options: [
      'Search returns errors',
      'Fall back to baseline (unpersonalized) search - degraded but functional',
      'Queue requests until service recovers',
      'Return cached results only',
    ],
    correctIndex: 1,
    explanation: 'Graceful degradation: personalization enhances search but isn\'t required. Baseline search keeps system functional during failures.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes traffic across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Graceful Degradation', explanation: 'Reduced functionality during failures', icon: '🛡️' },
  ],
};

const step8: GuidedStep = {
  id: 'personalized-search-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs at production scale',
    taskDescription: 'Add load balancer and scale search servers',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute search traffic across servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to Search Servers',
      'Configure multiple search server instances',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add a Load Balancer between Client and Search Servers',
    level2: 'Reconnect: Client → Load Balancer → Search Servers. Consider adding multiple search server instances.',
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

export const personalizedSearchGuidedTutorial: GuidedTutorial = {
  problemId: 'personalized-search',
  title: 'Design Personalized Search',
  description: 'Build a search system with user behavior tracking, ML-powered reranking, and A/B testing',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🔍',
    hook: "You've been hired as Lead Engineer at SearchTech!",
    scenario: "Your mission: Build a personalized search system that learns from user behavior to deliver better results over time.",
    challenge: "Can you design a system that handles 100M searches per day with ML-powered personalization and rigorous A/B testing?",
  },

  requirementsPhase: personalizedSearchRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  concepts: [
    'Client-Server Architecture',
    'Search API Design',
    'User Behavior Tracking',
    'Event-Driven Architecture',
    'Message Queues',
    'Feature Stores and Caching',
    'ML Model Serving',
    'Personalized Ranking',
    'A/B Testing Framework',
    'Analytics Databases',
    'Load Balancing',
    'Graceful Degradation',
  ],

  ddiaReferences: [
    'Chapter 4: Encoding and Evolution (Event schemas)',
    'Chapter 5: Replication (Read scaling)',
    'Chapter 11: Stream Processing (Event streams)',
  ],
};

export default personalizedSearchGuidedTutorial;
