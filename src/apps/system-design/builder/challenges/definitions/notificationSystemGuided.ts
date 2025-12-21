import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Notification System - Progressive Tutorial
 *
 * A single evolving tutorial that grows from beginner → intermediate → advanced.
 * Requirements evolve as the "business" grows, teaching iterative system design.
 *
 * PHASE 1 (Beginner - Steps 1-3):
 * - FR-1: Send push notifications
 * - FR-2: Track delivery status
 * - Build: Client → Server → Database → Cache
 *
 * PHASE 2 (Intermediate - Steps 4-6):
 * - FR-3: Support SMS and email channels
 * - FR-4: Respect user preferences
 * - Build: Add message queue, workers, preferences
 *
 * PHASE 3 (Advanced - Steps 7-10):
 * - NFRs kick in: Scale, reliability, availability
 * - Build: Rate limiting, retry/DLQ, deduplication, HA
 *
 * This mirrors real-world evolution: Start simple, add features, then scale.
 */

// =============================================================================
// PHASE 1: BEGINNER REQUIREMENTS (Steps 1-3)
// =============================================================================

const phase1Requirements: RequirementsGatheringContent = {
  problemStatement: "Design a notification service that sends push notifications to users.",

  interviewer: {
    name: 'Alex Chen',
    role: 'Product Manager at NotifyTech',
    avatar: '👨‍💼',
  },

  questions: [
    {
      id: 'what-notifications',
      category: 'functional',
      question: "What does the notification system need to do?",
      answer: "Simple: receive notification requests from other services and send push notifications to mobile devices. Just push for now - we may add SMS and email later.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Start with one channel before adding more",
    },
    {
      id: 'track-delivery',
      category: 'functional',
      question: "Do we need to know if notifications were delivered?",
      answer: "Yes! Track if a notification was sent, delivered, or failed. This helps with debugging when users complain.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Status tracking is essential for debugging",
    },
  ],

  minimumQuestionsRequired: 2,
  criticalQuestionIds: ['what-notifications', 'track-delivery'],
  criticalFRQuestionIds: ['what-notifications', 'track-delivery'],
  criticalScaleQuestionIds: [],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Send push notifications to users',
      description: 'Accept notification requests and deliver them to mobile devices.',
      emoji: '📱',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Track notification delivery status',
      description: 'Record sent, delivered, or failed status for each notification.',
      emoji: '📊',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10,000',
    writesPerDay: '100,000 notifications',
    readsPerDay: '10,000 status checks',
    peakMultiplier: 2,
    readWriteRatio: '1:10',
    calculatedWriteRPS: { average: 1, peak: 5 },
    calculatedReadRPS: { average: 0.1, peak: 1 },
    maxPayloadSize: '~1KB',
    storagePerRecord: '~200 bytes',
    storageGrowthPerYear: '~7GB',
    redirectLatencySLA: 'p99 < 5s',
    createLatencySLA: 'p99 < 500ms',
  },

  architecturalImplications: [
    '✅ Low volume → Synchronous processing is fine for now',
    '✅ Simple architecture → Client → Server → Database',
  ],

  outOfScope: [
    'SMS and email (Phase 2)',
    'User preferences (Phase 2)',
    'Async processing (Phase 2)',
    'Rate limiting, retry logic (Phase 3)',
  ],

  keyInsight: "Start simple! Build a working notification service first. We'll add more channels, preferences, and scaling later as the product grows.",

  thinkingFramework: {
    title: "Phase 1: Build Something That Works",
    intro: "We have 2 simple requirements. Let's build the SIMPLEST system that satisfies them.",

    steps: [
      {
        id: 'what-comes-in',
        title: 'Step 1: What Comes In?',
        alwaysAsk: "What data does the system receive?",
        whyItMatters: "Understanding input helps design the API.",
        expertBreakdown: {
          intro: "From FR-1:",
          points: [
            "Services send: user_id, title, message",
            "We need: POST /notifications endpoint",
            "Keep it simple for now"
          ]
        },
        icon: '📥',
        category: 'functional'
      },
      {
        id: 'what-goes-out',
        title: 'Step 2: What Goes Out?',
        alwaysAsk: "What external services do we call?",
        whyItMatters: "FR-1 requires sending push notifications → call a push provider.",
        expertBreakdown: {
          intro: "We need:",
          points: [
            "Push provider (Firebase Cloud Messaging)",
            "Just one external service for now",
            "We'll add SMS/email providers later"
          ]
        },
        icon: '📤',
        category: 'functional'
      },
      {
        id: 'what-to-store',
        title: 'Step 3: What Do We Store?',
        alwaysAsk: "What data must persist?",
        whyItMatters: "FR-2 requires tracking status → need persistent storage.",
        expertBreakdown: {
          intro: "Store:",
          points: [
            "notification_id, user_id, status, timestamps",
            "Status: sent, delivered, failed",
            "One simple table is enough"
          ]
        },
        icon: '💾',
        category: 'data-flow'
      }
    ],

    startSimple: {
      title: "Our Phase 1 Architecture",
      description: "Client → Notification Service → Database. Send notification, save status, done!",
      whySimple: "This satisfies both FRs. It's not scalable yet, but it WORKS. We'll evolve it as requirements grow.",
      nextStepPreview: "Step 1: Connect Client to Notification Service"
    }
  },

  scaleFramework: {
    title: "What's Coming Next?",
    intro: "After Phase 1, the product will evolve:",
    celebrationMessage: "Your basic notification system works!",
    hookMessage: "But the product team has new requirements...",
    steps: [
      {
        id: 'more-channels',
        title: 'Phase 2: More Channels',
        question: "Can we add SMS and email?",
        whyItMatters: "Users want notifications on their preferred channel",
        example: "Add Twilio for SMS, SendGrid for email",
        icon: '📧'
      },
      {
        id: 'scale',
        title: 'Phase 3: Scale & Reliability',
        question: "Can it handle 10M notifications/day?",
        whyItMatters: "Growth brings scale challenges",
        example: "Add queues, rate limiting, retry logic",
        icon: '📈'
      }
    ],
    nextStepsPreview: "First, let's build Phase 1. The system will evolve!"
  }
};

// =============================================================================
// STEP 1: Connect Client to Notification Service (Phase 1)
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📱',
  scenario: "Welcome to NotifyTech! You're building their first notification system.",
  hook: "The e-commerce team wants to send 'Order Shipped' notifications. Right now, they have no way to notify customers!",
  challenge: "Set up the basic notification flow: a service that receives requests and sends push notifications.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your notification service is online!',
  achievement: 'Services can now send notification requests to your API',
  metrics: [
    { label: 'API Status', after: 'Online' },
    { label: 'Can receive requests', after: '✓' },
  ],
  nextTeaser: "But how do we know if notifications actually got delivered?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Client-Server Architecture',
  conceptExplanation: `Every notification system starts with two parts:

**1. Client (Trigger Service)**
- Other services that want to send notifications
- Example: Order Service notifies users about shipments

**2. Notification Service (Your Backend)**
- Receives notification requests
- Sends them to push providers (Firebase, APNs)
- Tracks delivery status

The Client calls your Notification Service API with:
- \`user_id\`: Who to notify
- \`title\`: Notification title
- \`message\`: Notification body`,

  whyItMatters: 'This is the foundation. Without it, no service can trigger notifications!',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Sending "Your ride is arriving" notifications',
    howTheyDoIt: 'The dispatch service calls the notification API when a driver is 2 minutes away.',
  },

  keyPoints: [
    'Client = service triggering notifications',
    'Server = your notification backend',
    'Simple API: POST /notifications with user_id, title, message',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Service that wants to send a notification', icon: '📤' },
    { title: 'Server', explanation: 'Your notification service that processes requests', icon: '🖥️' },
    { title: 'API', explanation: 'The interface clients use to send requests', icon: '🔌' },
  ],
};

const step1: GuidedStep = {
  id: 'notification-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'FR-1: Send push notifications to users',
    taskDescription: 'Add a Client (trigger service) and App Server (Notification Service), then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Service that triggers notifications', displayName: 'Order Service' },
      { type: 'app_server', reason: 'Your notification backend', displayName: 'Notification Service' },
    ],
    successCriteria: [
      'Client component added',
      'App Server added',
      'Client connected to App Server',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server onto the canvas',
    level2: 'Connect them by clicking Client then App Server',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Add Database for Status Tracking (Phase 1)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '📊',
  scenario: "Your notification service is sending push notifications. But something's wrong...",
  hook: "A customer complains they never got their 'Order Shipped' notification. How do you debug this? You have no record of what happened!",
  challenge: "Add a database to track notification status: sent, delivered, or failed.",
  illustration: 'data-loss',
};

const step2Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Notification status is now tracked!',
  achievement: 'You can see what happened to every notification',
  metrics: [
    { label: 'Status tracking', after: 'Enabled' },
    { label: 'Can debug issues', after: '✓' },
  ],
  nextTeaser: "But looking up status in the database is slow...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Persistent Storage with Databases',
  conceptExplanation: `**Why do we need a database?**

FR-2 says "track notification delivery status." This means:
1. Save status for every notification
2. Look it up later for debugging
3. Keep data even if server restarts

**What we store:**
\`\`\`sql
CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id BIGINT,
  title VARCHAR(200),
  status VARCHAR(20),  -- sent, delivered, failed
  created_at TIMESTAMP
);
\`\`\`

**The flow:**
1. Receive notification request
2. Send to push provider
3. Save status to database
4. Return notification ID`,

  whyItMatters: 'Without persistent storage, you lose all data when the server restarts. You can\'t debug issues.',

  realWorldExample: {
    company: 'Slack',
    scenario: 'Tracking message delivery',
    howTheyDoIt: 'Every message is logged with delivery status. Support can look up exactly what happened.',
  },

  keyPoints: [
    'Databases persist data across restarts',
    'Track status: sent, delivered, failed',
    'Use notification_id for lookups',
  ],

  keyConcepts: [
    { title: 'Database', explanation: 'Persistent storage for your data', icon: '💾' },
    { title: 'Status', explanation: 'sent, delivered, or failed', icon: '📊' },
    { title: 'Persistence', explanation: 'Data survives restarts', icon: '🔒' },
  ],
};

const step2: GuidedStep = {
  id: 'notification-step-2',
  stepNumber: 2,
  frIndex: 1,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-2: Track notification delivery status',
    taskDescription: 'Add a Database to store notification status',
    componentsNeeded: [
      { type: 'database', reason: 'Store notification status', displayName: 'Notifications DB' },
    ],
    successCriteria: [
      'Database added',
      'App Server connected to Database',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Database onto the canvas',
    level2: 'Connect App Server to Database',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 3: Add Cache for Fast Lookups (Phase 1 Complete)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '⚡',
  scenario: "Users can now check their notification status. But it's slow!",
  hook: "Every status check queries the database. As traffic grows, response times are climbing!",
  challenge: "Add a cache to speed up status lookups.",
  illustration: 'slow-processing',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 1 Complete! Your basic notification system works!',
  achievement: 'Push notifications with status tracking and fast lookups',
  metrics: [
    { label: 'Send notifications', after: '✓' },
    { label: 'Track status', after: '✓' },
    { label: 'Fast lookups', after: '✓ (cached)' },
  ],
  nextTeaser: "But wait... the product team has NEW requirements!",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Caching for Performance',
  conceptExplanation: `**The Problem:**
Every status check queries the database (~50ms).
At 100 requests/sec, that's 100 DB queries/sec!

**The Solution: Cache!**
Store recent data in fast memory (Redis):
- Cache lookup: ~1ms (50x faster!)
- Database query: ~50ms

**How it works:**
1. Check cache first
2. **HIT**: Return cached status (fast!)
3. **MISS**: Query database, cache result, return

**Cache key:** \`notification:{id}\`
**TTL:** 1 hour`,

  whyItMatters: 'Caching is the easiest way to improve performance. It reduces database load and speeds up responses.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Checking notification status',
    howTheyDoIt: 'Recent notifications are cached in Redis. Most checks never hit the database.',
  },

  keyPoints: [
    'Cache stores frequently-accessed data in memory',
    'Cache is ~50x faster than database',
    'Use TTL to refresh stale data',
  ],

  keyConcepts: [
    { title: 'Cache', explanation: 'Fast in-memory storage (Redis)', icon: '⚡' },
    { title: 'Cache Hit', explanation: 'Data found in cache', icon: '✅' },
    { title: 'TTL', explanation: 'Time-to-live before expiry', icon: '⏰' },
  ],
};

const step3: GuidedStep = {
  id: 'notification-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Fast status lookups with caching',
    taskDescription: 'Add a Cache for fast notification status lookups',
    componentsNeeded: [
      { type: 'cache', reason: 'Speed up status lookups', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache added',
      'App Server connected to Cache',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Cache (Redis) onto the canvas',
    level2: 'Connect App Server to Cache',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// PHASE 2 TRANSITION: New Requirements!
// =============================================================================

const phase2Story: StoryContent = {
  emoji: '📢',
  scenario: "3 months later... NotifyTech is growing! The product team has new requirements.",
  hook: "Users want SMS and email notifications. Marketing wants to respect user preferences. Your simple system needs to evolve!",
  challenge: "Time for Phase 2: Add SMS, email, user preferences, and async processing.",
  illustration: 'growth',
};

// =============================================================================
// STEP 4: Add Message Queue for Async Processing (Phase 2)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⚡',
  scenario: "Phase 2 begins! First problem: your API is getting slow.",
  hook: "Each send to a provider takes 200ms. At 50 requests/sec, your API is blocking! Users are experiencing timeouts.",
  challenge: "Add a message queue to process notifications asynchronously.",
  illustration: 'slow-processing',
};

const step4Celebration: CelebrationContent = {
  emoji: '🌊',
  message: 'Async processing enabled!',
  achievement: 'API returns immediately, queue handles delivery',
  metrics: [
    { label: 'API response', before: '200ms', after: '10ms' },
    { label: 'Can buffer spikes', after: '✓' },
  ],
  nextTeaser: "Now we can add support for SMS and email channels...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Async Processing with Message Queues',

  frameworkReminder: {
    question: "What if providers are slow?",
    connection: "Provider calls take 200ms. At 50 req/sec synchronously, your API blocks. Message queues let you enqueue and return immediately."
  },

  conceptExplanation: `**The Problem:**
\`\`\`
Client → API → Provider (200ms wait) → Response
\`\`\`
At 50 req/sec, you need 50 threads just waiting!

**The Solution:**
\`\`\`
Client → API → Queue → Response (10ms)
                ↓
         Worker → Provider (async)
\`\`\`

**How it works:**
1. API receives request, validates it
2. Enqueues to message queue (Kafka)
3. Returns notification_id immediately
4. Worker processes queue in background
5. Worker sends to provider, updates status`,

  whyItMatters: 'Without async, slow providers block your API. Users experience timeouts.',

  famousIncident: {
    title: 'Twitter Fail Whale',
    company: 'Twitter',
    year: '2008-2010',
    whatHappened: 'Twitter processed everything synchronously. Traffic spikes caused the famous "Fail Whale" error.',
    lessonLearned: 'Async processing is essential for handling variable load.',
    icon: '🐋',
  },

  realWorldExample: {
    company: 'Uber',
    scenario: 'Sending ride notifications',
    howTheyDoIt: 'Requests are enqueued immediately. Workers process them async. The ride service never waits.',
  },

  keyPoints: [
    'Enqueue immediately, return fast',
    'Workers process in background',
    'Queue buffers traffic spikes',
  ],

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer between API and workers', icon: '📬' },
    { title: 'Async', explanation: 'Don\'t wait, process in background', icon: '⏳' },
    { title: 'Worker', explanation: 'Process that consumes and sends', icon: '👷' },
  ],
};

const step4: GuidedStep = {
  id: 'notification-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'Scaling for FR-3: Multiple channels need async processing',
    taskDescription: 'Add a Message Queue (Kafka) for async notification processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Buffer notifications for async processing', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue onto the canvas',
    level2: 'Connect App Server to Message Queue',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 5: Add Workers for Each Channel (Phase 2)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '👷',
  scenario: "NEW REQUIREMENT: FR-3 - Support SMS and email notifications!",
  hook: "Marketing wants to send email campaigns. Auth team needs SMS for 2FA. You need workers for each channel!",
  challenge: "Add dedicated workers for Push, SMS, and Email.",
  illustration: 'integration',
};

const step5Celebration: CelebrationContent = {
  emoji: '✅',
  message: 'All channels are now active!',
  achievement: 'Push, SMS, and Email workers processing notifications',
  metrics: [
    { label: 'Push', after: '✓ Firebase' },
    { label: 'SMS', after: '✓ Twilio' },
    { label: 'Email', after: '✓ SendGrid' },
  ],
  nextTeaser: "But users are complaining about unwanted notifications...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Channel Workers',

  frameworkReminder: {
    question: "How do we support multiple channels?",
    connection: "FR-3 requires push, SMS, and email. Each has different providers and characteristics. Separate workers let us scale independently."
  },

  conceptExplanation: `**NEW FR-3: Send via push, SMS, and email**

**Why separate workers?**
1. **Different providers**: Push → Firebase, SMS → Twilio, Email → SendGrid
2. **Different speeds**: Push (50ms), email (500ms)
3. **Different costs**: SMS is expensive, email is cheap
4. **Independent scaling**: More email workers during campaigns

**Architecture:**
\`\`\`
        Kafka
   ┌────────────┐
   │push-topic  │──→ Push Worker  → Firebase
   │sms-topic   │──→ SMS Worker   → Twilio
   │email-topic │──→ Email Worker → SendGrid
   └────────────┘
\`\`\``,

  whyItMatters: 'Different channels have different requirements. Treating them the same leads to inefficiency.',

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Booking confirmations across channels',
    howTheyDoIt: 'Separate topics per channel. Push scales to 50 workers, SMS limited to 10 due to cost.',
  },

  keyPoints: [
    'Separate topic per channel',
    'Dedicated worker per channel',
    'Scale independently',
  ],

  keyConcepts: [
    { title: 'Worker', explanation: 'Process that sends notifications', icon: '👷' },
    { title: 'Topic', explanation: 'Queue partition for specific channel', icon: '📂' },
    { title: 'Provider', explanation: 'External service (Firebase, Twilio)', icon: '🔌' },
  ],
};

const step5: GuidedStep = {
  id: 'notification-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-3: Send via push, SMS, and email',
    taskDescription: 'Add worker App Servers for each channel',
    componentsNeeded: [
      { type: 'app_server', reason: 'Push notification worker', displayName: 'Push Worker' },
      { type: 'app_server', reason: 'SMS notification worker', displayName: 'SMS Worker' },
      { type: 'app_server', reason: 'Email notification worker', displayName: 'Email Worker' },
    ],
    successCriteria: [
      'Add 3 worker App Servers',
      'Connect Message Queue to each worker',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Drag 3 App Server components for workers',
    level2: 'Connect Message Queue to each worker',
    solutionComponents: [{ type: 'app_server' }, { type: 'app_server' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'message_queue', to: 'app_server' },
      { from: 'message_queue', to: 'app_server' },
      { from: 'message_queue', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Add User Preferences (Phase 2 Complete)
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚙️',
  scenario: "NEW REQUIREMENT: FR-4 - Respect user notification preferences!",
  hook: "Users are complaining! Some opted out of marketing but still receive emails. Legal is worried about CAN-SPAM violations!",
  challenge: "Store user preferences and check them before sending.",
  illustration: 'data-sync',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 2 Complete! Multi-channel with preferences!',
  achievement: 'Push, SMS, Email with user preference management',
  metrics: [
    { label: 'Channels', after: 'Push + SMS + Email' },
    { label: 'Async processing', after: '✓' },
    { label: 'User preferences', after: '✓' },
  ],
  nextTeaser: "Phase 3: Time to handle SCALE and RELIABILITY...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'User Preference Management',

  frameworkReminder: {
    question: "Can users control their notifications?",
    connection: "FR-4 requires respecting opt-outs. This is legally required (CAN-SPAM, TCPA). We store preferences in the database and cache them for fast lookup."
  },

  conceptExplanation: `**NEW FR-4: Respect user notification preferences**

**What we store:**
\`\`\`sql
CREATE TABLE user_preferences (
  user_id BIGINT,
  channel VARCHAR(20),     -- push, sms, email
  category VARCHAR(50),    -- marketing, transactional
  enabled BOOLEAN,
  PRIMARY KEY (user_id, channel, category)
);
\`\`\`

**The flow:**
1. Receive notification request
2. Check preferences (cache first, then DB)
3. If opted out → skip (but log)
4. If allowed → enqueue to channel

**Why this matters:**
- Legal compliance (CAN-SPAM, TCPA)
- User trust
- Avoid getting banned by providers`,

  whyItMatters: 'Sending to opted-out users violates laws and destroys trust. Preferences must be checked before every send.',

  famousIncident: {
    title: 'LinkedIn Spam Lawsuit',
    company: 'LinkedIn',
    year: '2015',
    whatHappened: 'LinkedIn sent emails to users who opted out. They settled for $13 million.',
    lessonLearned: 'User preferences must be durable and consistently enforced.',
    icon: '⚖️',
  },

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Managing preferences for 150M users',
    howTheyDoIt: 'Preferences in MySQL with Redis cache. Opt-outs applied within minutes.',
  },

  keyPoints: [
    'Store opt-out preferences permanently',
    'Check before EVERY send',
    'Cache for fast lookups',
  ],

  keyConcepts: [
    { title: 'Opt-out', explanation: 'User says "don\'t send me this"', icon: '🚫' },
    { title: 'Channel Preference', explanation: 'User prefers email over SMS', icon: '📧' },
    { title: 'Legal Compliance', explanation: 'CAN-SPAM, TCPA requirements', icon: '⚖️' },
  ],
};

const step6: GuidedStep = {
  id: 'notification-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-4: Respect user notification preferences',
    taskDescription: 'Configure the system to check user preferences before sending',
    successCriteria: [
      'Database stores user preferences',
      'Cache has preference data for fast lookups',
      'Workers check preferences before sending',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'The database already stores preferences. Ensure cache is connected for fast lookups.',
    level2: 'Workers should check cache/DB for preferences before sending.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// PHASE 3 TRANSITION: Scale & Reliability
// =============================================================================

const phase3Story: StoryContent = {
  emoji: '📈',
  scenario: "1 year later... NotifyTech is now sending 10 MILLION notifications per day!",
  hook: "Your system is hitting limits. Providers are rate limiting you. Failed notifications are lost. Duplicates are annoying users. Time to build for production scale!",
  challenge: "Phase 3: Add rate limiting, retry logic, deduplication, and high availability.",
  illustration: 'scale',
};

// =============================================================================
// STEP 7: Add Rate Limiting (Phase 3)
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🚦',
  scenario: "Marketing launched a flash sale to 1 million users. All at once.",
  hook: "You overwhelmed Twilio's API! They rate-limited your account. Even critical 2FA codes are failing!",
  challenge: "Add rate limiting to respect provider limits.",
  illustration: 'throttling',
};

const step7Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'Provider rate limits respected!',
  achievement: 'Rate limiting prevents provider overload',
  metrics: [
    { label: 'SMS rate', after: '100/sec (within limit)' },
    { label: 'Provider health', after: 'No more errors' },
  ],
  nextTeaser: "But what happens when notifications fail?",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Rate Limiting for External Providers',

  frameworkReminder: {
    question: "What are the provider constraints?",
    connection: "Every provider has rate limits. Exceeding them means failed notifications or account suspension."
  },

  conceptExplanation: `**Provider rate limits are REAL:**
- FCM: 1000 messages/sec
- Twilio SMS: 10-100/sec (varies by tier)
- SendGrid: 100K/day (starter plans)

**Rate limiting strategy (Token Bucket):**
- Bucket holds N tokens
- Each request consumes 1 token
- Tokens replenish at fixed rate
- Empty bucket → request queued

\`\`\`python
twilio_limiter = TokenBucket(rate=100, capacity=100)

async def send_sms(notification):
    if await twilio_limiter.acquire():
        await twilio.send(notification)
    else:
        await requeue_with_delay(notification)
\`\`\``,

  whyItMatters: 'Exceeding rate limits means failures AND potential account suspension.',

  realWorldExample: {
    company: 'Discord',
    scenario: 'Sending millions of push notifications',
    howTheyDoIt: 'Per-provider rate limiters using Redis. Rate-limited requests are requeued with delay.',
  },

  keyPoints: [
    'Rate limit per provider',
    'Use token bucket algorithm',
    'Requeue rate-limited requests',
  ],

  keyConcepts: [
    { title: 'Token Bucket', explanation: 'Allow bursts, then rate limit', icon: '🪣' },
    { title: 'Backpressure', explanation: 'Slow down when hitting limits', icon: '⏪' },
  ],
};

const step7: GuidedStep = {
  id: 'notification-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'NFR: Respect provider rate limits',
    taskDescription: 'Configure rate limiting for each notification channel',
    successCriteria: [
      'Configure SMS rate limit (100/sec)',
      'Configure Push rate limit (1000/sec)',
      'Configure Email rate limit (500/sec)',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Click on worker App Servers to configure rate limits',
    level2: 'Set per-channel limits based on provider constraints',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Retry Logic with DLQ (Phase 3)
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🔄',
  scenario: "Twilio had a 5-minute outage. Thousands of SMS notifications were lost!",
  hook: "Your workers try once and give up. Transient failures mean lost notifications. Users never got their 2FA codes!",
  challenge: "Add retry logic with exponential backoff and a dead letter queue.",
  illustration: 'data-corruption',
};

const step8Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Failures handled gracefully!',
  achievement: 'Retry with backoff + DLQ for persistent failures',
  metrics: [
    { label: 'Retry strategy', after: 'Exponential backoff' },
    { label: 'Max retries', after: '5 attempts' },
    { label: 'Failed notifications', after: 'DLQ for review' },
  ],
  nextTeaser: "But we're still sending duplicate notifications...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Retry Logic and Dead Letter Queues',

  frameworkReminder: {
    question: "What if delivery fails?",
    connection: "Provider failures are guaranteed to happen. Without retry, notifications are lost forever."
  },

  conceptExplanation: `**Why do notifications fail?**
- Provider outage
- Rate limiting
- Network blip
- Invalid token

**Retry strategy:**
1. Try to send
2. Fail → wait 1s → retry
3. Fail → wait 2s → retry
4. Fail → wait 4s → retry (exponential backoff)
5. After 5 retries → Dead Letter Queue

**Dead Letter Queue (DLQ):**
Notifications that fail after all retries go to DLQ for manual review.`,

  whyItMatters: 'Every provider hiccup causes notification loss without retry. DLQ ensures nothing is truly lost.',

  famousIncident: {
    title: 'Twilio Outage Impact',
    company: 'Multiple Companies',
    year: '2020',
    whatHappened: 'Companies without retry logic lost millions of SMS. Those with proper retry recovered automatically.',
    lessonLearned: 'Your retry strategy determines if outages are minor blips or disasters.',
    icon: '📱',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Sending payment webhooks',
    howTheyDoIt: 'Exponential backoff up to 24 hours. Failed webhooks trigger PagerDuty alerts.',
  },

  keyPoints: [
    'Retry transient failures',
    'Use exponential backoff',
    'DLQ for persistent failures',
  ],

  keyConcepts: [
    { title: 'Exponential Backoff', explanation: 'Double wait time between retries', icon: '📈' },
    { title: 'Dead Letter Queue', explanation: 'Queue for failed messages after max retries', icon: '💀' },
  ],
};

const step8: GuidedStep = {
  id: 'notification-step-8',
  stepNumber: 8,
  frIndex: 1,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'NFR: Reliable delivery with retry',
    taskDescription: 'Configure retry logic and dead letter queue',
    successCriteria: [
      'Enable retry with exponential backoff',
      'Configure dead letter queue',
      'Set max retries to 5',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Click on Message Queue to configure retry settings',
    level2: 'Enable exponential backoff, set max retries to 5, enable DLQ',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 9: Add Deduplication (Phase 3)
// =============================================================================

const step9Story: StoryContent = {
  emoji: '👯',
  scenario: "Users are angry! They're receiving duplicate notifications.",
  hook: "The same 'Order Shipped' message 3 times! When workers retry, they sometimes send duplicates.",
  challenge: "Add deduplication to ensure each notification is sent exactly once.",
  illustration: 'deduplication',
};

const step9Celebration: CelebrationContent = {
  emoji: '✨',
  message: 'Exactly-once delivery achieved!',
  achievement: 'Deduplication prevents duplicate sends',
  metrics: [
    { label: 'Duplicates', before: '0.5%', after: '0%' },
    { label: 'Delivery guarantee', after: 'Exactly-once' },
  ],
  nextTeaser: "One last thing: high availability...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Notification Deduplication',

  frameworkReminder: {
    question: "What if we send duplicates?",
    connection: "Duplicate notifications are annoying at best, dangerous at worst. Imagine duplicate 'Payment received' notifications."
  },

  conceptExplanation: `**Why duplicates happen:**
- Network retry sends same request twice
- Worker crashes after send, before ACK
- Retry logic re-sends already-sent notification

**Deduplication strategy:**
1. Assign unique notification_id at creation
2. Before send: check if ID in sent cache
3. After send: add ID to sent cache
4. Cache TTL: 24 hours

\`\`\`python
async def send_with_dedup(notification):
    if await dedup_cache.exists(notification.id):
        log.info(f"Skipping duplicate: {notification.id}")
        return

    await provider.send(notification)
    await dedup_cache.set(notification.id, ttl=86400)
\`\`\``,

  whyItMatters: 'Duplicate notifications destroy user trust and can cause real harm.',

  famousIncident: {
    title: 'Amazon Prime Day Notification Storm',
    company: 'Amazon',
    year: '2019',
    whatHappened: 'A bug caused duplicate deal notifications. Some users got the same alert 10+ times.',
    lessonLearned: 'Deduplication must happen at the send layer.',
    icon: '📦',
  },

  realWorldExample: {
    company: 'Uber',
    scenario: 'Preventing duplicate "Your ride is here"',
    howTheyDoIt: 'Each notification gets a UUID. Workers check Redis before sending.',
  },

  keyPoints: [
    'Unique ID for every notification',
    'Check cache before sending',
    'Record sent IDs after send',
  ],

  keyConcepts: [
    { title: 'Notification ID', explanation: 'Unique identifier for deduplication', icon: '🔑' },
    { title: 'Sent Cache', explanation: 'Track which notifications were sent', icon: '📝' },
  ],
};

const step9: GuidedStep = {
  id: 'notification-step-9',
  stepNumber: 9,
  frIndex: 1,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'NFR: Exactly-once delivery',
    taskDescription: 'Configure deduplication using the cache',
    successCriteria: [
      'Enable deduplication mode on cache',
      'Set dedup TTL to 24 hours',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Click on Cache to configure deduplication',
    level2: 'Enable deduplication with 24-hour TTL',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 10: Add High Availability (Phase 3 Complete)
// =============================================================================

const step10Story: StoryContent = {
  emoji: '🛡️',
  scenario: "3 AM. The database crashed. ALL notifications are failing!",
  hook: "Without the database, workers can't check preferences or track status. Nothing is going out!",
  challenge: "Add database replication and load balancing for high availability.",
  illustration: 'database-failure',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a production-grade notification system!',
  achievement: 'From simple push notifications to a scalable, fault-tolerant platform',
  metrics: [
    { label: 'Channels', after: 'Push + SMS + Email' },
    { label: 'Throughput', after: '1000 notifications/sec' },
    { label: 'Availability', after: '99.9% (HA)' },
    { label: 'Delivery', after: 'Exactly-once with retry' },
    { label: 'Rate limiting', after: 'Per-provider' },
  ],
  nextTeaser: "You've mastered notification system design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'High Availability',

  frameworkReminder: {
    question: "What if a component fails?",
    connection: "Users expect 2FA codes and order confirmations 24/7. Single points of failure are unacceptable at scale."
  },

  conceptExplanation: `**Single points of failure:**
- Database → can't check preferences
- API → can't accept requests
- Kafka → can't buffer notifications

**Adding high availability:**

**1. Database Replication**
- Primary handles writes
- Replicas handle reads
- Auto-failover if primary crashes

**2. Multiple API Instances**
- Load balancer distributes traffic
- One fails, others continue

**3. Kafka Replication**
- Replication factor = 3
- Tolerates 2 broker failures`,

  whyItMatters: 'Notifications are critical. Users expect them to work 24/7. HA ensures the system survives failures.',

  realWorldExample: {
    company: 'Slack',
    scenario: 'Billions of notifications with 99.99% availability',
    howTheyDoIt: 'Multi-region with database replication across 3 AZs. Even datacenter failure doesn\'t stop notifications.',
  },

  keyPoints: [
    'Replicate databases for failover',
    'Multiple API instances behind LB',
    'Kafka replication factor of 3',
  ],

  keyConcepts: [
    { title: 'Replication', explanation: 'Multiple copies of data', icon: '📋' },
    { title: 'Failover', explanation: 'Automatic switch to healthy replica', icon: '🔄' },
    { title: 'Load Balancer', explanation: 'Distributes traffic across instances', icon: '⚖️' },
  ],
};

const step10: GuidedStep = {
  id: 'notification-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'NFR: High availability',
    taskDescription: 'Add load balancer and database replication',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across API instances', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Add Load Balancer in front of API',
      'Configure database replication (2+ replicas)',
      'Configure Kafka replication factor (3)',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Add Load Balancer and configure replication',
    level2: 'LB in front of API, DB replication with 2 replicas, Kafka RF=3',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// EXPORT THE COMPLETE PROGRESSIVE TUTORIAL
// =============================================================================

export const notificationSystemGuidedTutorial: GuidedTutorial = {
  problemId: 'notification-system',
  title: 'Design a Notification System',
  description: 'Build an evolving notification system from simple push notifications to a production-grade multi-channel platform',
  difficulty: 'beginner', // Starts beginner, evolves to advanced
  estimatedMinutes: 75,

  welcomeStory: {
    emoji: '🔔',
    hook: "Welcome to NotifyTech! You're building their notification system from scratch.",
    scenario: "Your journey: Start with simple push notifications, then evolve the system as the business grows. You'll add SMS, email, user preferences, and production-grade reliability features.",
    challenge: "Can you build a notification system that grows with the business?",
  },

  requirementsPhase: phase1Requirements,

  steps: [
    // Phase 1: Beginner (Steps 1-3)
    step1,
    step2,
    step3,
    // Phase 2: Intermediate (Steps 4-6)
    step4,
    step5,
    step6,
    // Phase 3: Advanced (Steps 7-10)
    step7,
    step8,
    step9,
    step10,
  ],

  concepts: [
    'Client-Server Architecture',
    'Databases for Persistence',
    'Caching for Performance',
    'Async Processing with Message Queues',
    'Multi-Channel Delivery',
    'User Preference Management',
    'Rate Limiting',
    'Retry with Exponential Backoff',
    'Dead Letter Queues',
    'Deduplication',
    'High Availability',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, Maintainable Applications',
    'Chapter 5: Replication',
    'Chapter 11: Stream Processing',
  ],
};

export default notificationSystemGuidedTutorial;
