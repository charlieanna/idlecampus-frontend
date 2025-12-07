import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Zoom Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a video conferencing platform like Zoom.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (cache, media servers, CDN, etc.)
 *
 * Key Concepts:
 * - WebRTC for peer-to-peer video
 * - SFU (Selective Forwarding Unit) architecture
 * - Media server placement
 * - Adaptive bitrate streaming
 * - SRTP encryption
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const zoomRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a video conferencing platform like Zoom",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Principal Engineer at Video Communications Inc.',
    avatar: '👩‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-video-calls',
      category: 'functional',
      question: "What's the core functionality users need from this platform?",
      answer: "Users want to:\n\n1. **Host video meetings** - Create a meeting room and invite others\n2. **Join meetings** - Enter a meeting via link or ID with audio/video\n3. **Screen sharing** - Share their screen with other participants\n4. **Chat** - Send text messages during the meeting",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Zoom is about real-time communication - video, audio, screen sharing, and chat",
    },
    {
      id: 'recording',
      category: 'functional',
      question: "Should users be able to record meetings?",
      answer: "Yes, hosts should be able to **record meetings** for later playback. Recordings should include video, audio, and screen shares. This is critical for educational and business use cases.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Recording adds complexity - we need to capture, encode, and store media streams",
    },
    {
      id: 'participant-limits',
      category: 'clarification',
      question: "How many participants should a meeting support?",
      answer: "For the MVP, let's support up to 100 participants per meeting. Larger meetings (500-1000) can be a v2 feature with webinar mode.",
      importance: 'critical',
      insight: "100 participants is the sweet spot for most business meetings",
    },
    {
      id: 'breakout-rooms',
      category: 'clarification',
      question: "What about advanced features like breakout rooms, polling, or virtual backgrounds?",
      answer: "Let's defer those for v2. Focus on the core: join, video/audio, screen share, chat, and recording.",
      importance: 'nice-to-have',
      insight: "Advanced features are important but not essential for MVP",
    },
    {
      id: 'waiting-room',
      category: 'clarification',
      question: "Should there be security features like waiting rooms or passwords?",
      answer: "Yes, but for MVP let's just support password-protected meetings. Waiting rooms can come later.",
      importance: 'important',
      insight: "Security is important, but we'll start with basic password protection",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many concurrent users should we design for?",
      answer: "10 million daily active users, with 2 million concurrent meeting participants at peak times",
      importance: 'critical',
      learningPoint: "This is massive scale - similar to what Zoom hit during the pandemic",
    },
    {
      id: 'throughput-meetings',
      category: 'throughput',
      question: "How many concurrent meetings?",
      answer: "About 100,000 concurrent meetings at peak, with average meeting size of 20 participants",
      importance: 'critical',
      calculation: {
        formula: "2M users ÷ 20 avg participants = 100K meetings",
        result: "~100K concurrent meetings",
      },
      learningPoint: "Each meeting needs its own media routing infrastructure",
    },
    {
      id: 'video-quality',
      category: 'quality',
      question: "What video quality should we support?",
      answer: "720p (HD) for active speaker, 360p for gallery view thumbnails. Support adaptive bitrate to handle varying network conditions.",
      importance: 'critical',
      learningPoint: "Video quality vs bandwidth is a critical tradeoff",
    },
    {
      id: 'latency-video',
      category: 'latency',
      question: "What's the maximum acceptable latency for video?",
      answer: "p99 under 150ms for video/audio latency. Real-time communication requires very low latency - users notice anything over 200ms.",
      importance: 'critical',
      learningPoint: "Low latency is non-negotiable for real-time video",
    },
    {
      id: 'latency-join',
      category: 'latency',
      question: "How quickly should users be able to join a meeting?",
      answer: "Under 3 seconds from clicking 'Join' to seeing video. Fast join time is critical for user experience.",
      importance: 'important',
      learningPoint: "Quick join time requires pre-warmed infrastructure",
    },
    {
      id: 'bandwidth-requirements',
      category: 'throughput',
      question: "What about bandwidth consumption?",
      answer: "For 720p video: ~2.5 Mbps per stream. For a 20-person meeting, that's potentially 50 Mbps if everyone sends to everyone (mesh topology) - too much! We need server-side routing.",
      importance: 'critical',
      insight: "This reveals why we need SFU architecture - can't do peer-to-peer at scale",
    },
    {
      id: 'reliability',
      category: 'availability',
      question: "What's the uptime requirement?",
      answer: "99.9% uptime (43 minutes downtime per month). Video calls are mission-critical for businesses and education.",
      importance: 'critical',
      learningPoint: "High availability requires redundancy at every layer",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-video-calls', 'recording', 'latency-video'],
  criticalFRQuestionIds: ['core-video-calls', 'recording'],
  criticalScaleQuestionIds: ['throughput-users', 'bandwidth-requirements', 'latency-video'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can create meetings',
      description: 'Host a meeting room with unique ID and optional password',
      emoji: '📅',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can join meetings',
      description: 'Join via meeting ID/link with audio and video',
      emoji: '🎥',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can share screens',
      description: 'Share screen with other participants in real-time',
      emoji: '🖥️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can chat',
      description: 'Send text messages to all participants',
      emoji: '💬',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can record meetings',
      description: 'Record audio, video, and screen shares for playback',
      emoji: '⏺️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million',
    writesPerDay: 'N/A (real-time streaming)',
    readsPerDay: 'N/A (real-time streaming)',
    peakMultiplier: 3,
    readWriteRatio: 'N/A',
    calculatedWriteRPS: { average: 0, peak: 0 },
    calculatedReadRPS: { average: 0, peak: 0 },
    maxPayloadSize: '~2.5 Mbps per HD video stream',
    storagePerRecord: '~1 GB per hour of recording',
    storageGrowthPerYear: '~100 PB (with recordings)',
    redirectLatencySLA: 'p99 < 150ms (video/audio)',
    createLatencySLA: 'Join meeting < 3 seconds',
  },

  architecturalImplications: [
    '✅ Real-time media → WebRTC + Media servers (SFU) required',
    '✅ 2M concurrent users → Geographic distribution of media servers',
    '✅ Low latency (150ms) → Edge servers close to users',
    '✅ Adaptive quality → Multiple bitrate encoding (simulcast)',
    '✅ Recordings → Object storage + CDN for playback',
  ],

  outOfScope: [
    'Breakout rooms',
    'Virtual backgrounds',
    'Polling and reactions',
    'Webinar mode (>100 participants)',
    'Phone dial-in',
    'End-to-end encryption (will use SRTP)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can create meetings, join with video, and chat. The real-time media routing and scaling challenges will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🎬',
  scenario: "Welcome to Video Communications Inc! You've been hired to build the next Zoom.",
  hook: "Your first user wants to start a video call!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your platform is online!',
  achievement: 'Users can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle meetings yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every web application starts with a **Client** connecting to a **Server**.

When a user opens the Zoom app or website:
1. Their device (phone, laptop) is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back a response

This is the foundation of ALL web applications!`,

  whyItMatters: 'Without this connection, users can\'t create or join meetings at all.',

  realWorldExample: {
    company: 'Zoom',
    scenario: 'Handling 300 million daily meeting participants',
    howTheyDoIt: 'Started with a simple server in 2013, now uses a complex distributed system across multiple data centers',
  },

  keyPoints: [
    'Client = the user\'s device (browser, mobile app)',
    'App Server = your backend that processes requests',
    'HTTP = the protocol they use to communicate',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device that makes requests', icon: '📱' },
    { title: 'App Server', explanation: 'Your backend that handles logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'zoom-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Zoom', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles meeting creation and coordination', displayName: 'App Server' },
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
    level2: 'Click the Client, then click the App Server to create a connection between them',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Core Logic (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to handle meetings yet!",
  hook: "A user just tried to create a meeting but got an error.",
  challenge: "Write the Python code to create meetings, join meetings, and start recordings.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle meetings!',
  achievement: 'You implemented the core Zoom functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can create meetings', after: '✓' },
    { label: 'Can join meetings', after: '✓' },
    { label: 'Can start recordings', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all meeting data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Meeting Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For Zoom, we need handlers for:
- \`create_meeting()\` - Create a new meeting room
- \`join_meeting()\` - Add a participant to a meeting
- \`start_recording()\` - Begin recording a meeting

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just a fancy paperweight. This is where the magic happens!',

  famousIncident: {
    title: 'Zoom Pandemic Surge',
    company: 'Zoom',
    year: '2020',
    whatHappened: 'When COVID-19 hit, Zoom usage exploded from 10M to 300M daily users in 3 months. Their simple handlers had to be rapidly scaled to handle unprecedented growth.',
    lessonLearned: 'Start simple, but design for explosive growth. The handlers we write today will evolve.',
    icon: '📈',
  },

  realWorldExample: {
    company: 'Zoom',
    scenario: 'Creating meetings',
    howTheyDoIt: 'Their Meeting Service handles millions of meeting creations per day, with sub-second response times',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle edge cases (meeting not found, invalid ID, etc.)',
  ],

  quickCheck: {
    question: 'Why do we use in-memory storage in Step 2?',
    options: [
      'It\'s faster than a database',
      'We\'re keeping it simple - database comes later',
      'Memory never fails',
      'Databases are expensive',
    ],
    correctIndex: 1,
    explanation: 'FR-First approach: Make it WORK first with simple storage. Database adds complexity, so we\'ll add it in Step 3.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'In-Memory Storage', explanation: 'Temporary storage in Python dicts', icon: '💾' },
    { title: 'CRUD', explanation: 'Create, Read, Update, Delete operations', icon: '📝' },
  ],
};

const step2: GuidedStep = {
  id: 'zoom-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can create meetings, FR-2: Users can join meetings',
    taskDescription: 'Configure APIs and implement Python handlers for creating and joining meetings',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/meetings, POST /api/v1/meetings/:id/join, POST /api/v1/meetings/:id/record APIs',
      'Open the Python tab',
      'Implement create_meeting(), join_meeting(), and start_recording() functions',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for create_meeting, join_meeting, and start_recording',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/meetings', 'POST /api/v1/meetings/:id/join', 'POST /api/v1/meetings/:id/record'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 3 AM. Your server crashed and restarted...",
  hook: "When it came back online, ALL the meetings were GONE! 50,000 active meetings, vanished.",
  challenge: "Add a database so meeting data survives server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your meetings are safe forever!',
  achievement: 'Data now persists across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But fetching meeting metadata is getting slow as we grow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For Zoom, we need tables for:
- \`meetings\` - Meeting metadata (ID, host, password, settings)
- \`participants\` - Who's in which meeting
- \`recordings\` - Recording metadata and storage locations`,

  whyItMatters: 'Imagine losing ALL your scheduled meetings because of a server restart. Users would never trust your platform again!',

  famousIncident: {
    title: 'Zoombombing Security Crisis',
    company: 'Zoom',
    year: '2020',
    whatHappened: 'Hackers joined public meetings and disrupted them. Zoom had to rapidly improve meeting security, adding waiting rooms and better default passwords - all requiring database changes.',
    lessonLearned: 'Persistent, structured storage is essential for security features and audit trails.',
    icon: '🔒',
  },

  realWorldExample: {
    company: 'Zoom',
    scenario: 'Storing millions of meetings',
    howTheyDoIt: 'Uses distributed databases partitioned by meeting_id for horizontal scaling',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL) for structured data like meetings',
    'Connect App Server to Database for read/write operations',
  ],

  quickCheck: {
    question: 'What happens to in-memory data when a server restarts?',
    options: [
      'It\'s automatically saved to disk',
      'It\'s backed up to the cloud',
      'It\'s completely lost',
      'It\'s restored from cache',
    ],
    correctIndex: 2,
    explanation: 'In-memory (RAM) data is volatile. When power is lost or the process restarts, all data in memory is gone.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'SQL Database', explanation: 'Structured tables with relationships', icon: '🗄️' },
    { title: 'ACID', explanation: 'Atomicity, Consistency, Isolation, Durability', icon: '⚛️' },
  ],
};

const step3: GuidedStep = {
  id: 'zoom-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store meetings, participants, recordings permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Meeting Metadata
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 100,000 active meetings, and joining is slow!",
  hook: "Users are complaining: 'Why does it take so long to join?' Every join request hits the database.",
  challenge: "Add a cache to make meeting joins lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Meeting joins are 20x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Join latency', before: '2000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "But what happens when traffic spikes 10x?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

Instead of:
\`\`\`
Request → Database (slow, 100ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1ms) → Database (only if cache miss)
\`\`\`

For Zoom, we cache:
- Meeting metadata (ID, host, password, settings)
- Active participant lists
- User session data`,

  whyItMatters: 'At 100K concurrent meetings, hitting the database for every join would overwhelm it. Caching is essential.',

  famousIncident: {
    title: 'Zoom 300M User Explosion',
    company: 'Zoom',
    year: '2020',
    whatHappened: 'During the pandemic, Zoom went from 10M to 300M daily users in 3 months. Their caching infrastructure had to be massively scaled to handle the load.',
    lessonLearned: 'Cache aggressively for read-heavy operations like meeting joins.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Zoom',
    scenario: 'Handling millions of meeting joins per day',
    howTheyDoIt: 'Uses Redis clusters to cache meeting metadata. Most join requests never touch the database.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (95% of requests)
                     │   Return instantly!
`,

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache Hit = data found, instant response',
    'Cache Miss = fetch from DB, store in cache',
    'Set TTL (Time To Live) to prevent stale data',
  ],

  quickCheck: {
    question: 'What data should you cache for a video conferencing platform?',
    options: [
      'Video streams',
      'Meeting metadata and participant lists',
      'All chat messages',
      'User passwords',
    ],
    correctIndex: 1,
    explanation: 'Cache frequently accessed, relatively static data like meeting metadata. Don\'t cache real-time streams or sensitive data.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'zoom-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Users can join meetings (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache meeting metadata and sessions for fast access', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
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
    level2: 'Connect App Server to Cache. Then click Cache and set TTL to 60 seconds, strategy to cache-aside',
    solutionComponents: [{ type: 'cache', config: { ttl: 60, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your single app server is maxed out at 100% CPU!",
  hook: "A viral event caused meeting creation requests to spike 10x. One server can't handle it all.",
  challenge: "Add a load balancer to distribute traffic across multiple servers.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Traffic is now distributed!',
  achievement: 'Load balancer spreads requests across servers',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Request distribution', after: 'Balanced' },
  ],
  nextTeaser: "But we haven't handled the real-time video streams yet...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Distribute the Load',
  conceptExplanation: `A **Load Balancer** sits in front of your app servers and distributes incoming requests.

Benefits:
- **No single point of failure** - if one server dies, others keep working
- **Horizontal scaling** - add more servers to handle more traffic
- **Even distribution** - no single server gets overwhelmed

Common strategies:
- Round-robin: Take turns
- Least connections: Send to least busy server
- IP hash: Same user always goes to same server`,

  whyItMatters: 'At peak, Zoom handles millions of requests per minute. No single server can handle that alone.',

  famousIncident: {
    title: 'Zoom Outage April 2020',
    company: 'Zoom',
    year: '2020',
    whatHappened: 'A partial outage affected users for several hours during peak pandemic usage. Load balancers help prevent these by distributing traffic and providing redundancy.',
    lessonLearned: 'Load balancers are essential for handling unpredictable traffic spikes and maintaining availability.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'Zoom',
    scenario: 'Handling global traffic',
    howTheyDoIt: 'Uses multiple layers of load balancers across 17+ data centers worldwide to distribute traffic',
  },

  diagram: `
              ┌─────────────┐
              │ App Server 1│
┌────────┐   ┌──────────────┐   └─────────────┘
│ Client │──▶│Load Balancer │──▶ App Server 2
└────────┘   └──────────────┘   ┌─────────────┐
              │ App Server 3│
              └─────────────┘
`,

  keyPoints: [
    'Load balancer distributes requests across servers',
    'Enables horizontal scaling (add more servers)',
    'Eliminates single point of failure',
    'Place between Client and App Servers',
  ],

  quickCheck: {
    question: 'What happens if one app server crashes when using a load balancer?',
    options: [
      'All requests fail',
      'Load balancer routes traffic to healthy servers',
      'Users see an error page',
      'The load balancer crashes too',
    ],
    correctIndex: 1,
    explanation: 'Load balancers detect unhealthy servers and automatically route traffic to healthy ones.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Health Checks', explanation: 'Monitor server availability', icon: '💓' },
  ],
};

const step5: GuidedStep = {
  id: 'zoom-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add a Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across servers', displayName: 'Load Balancer' },
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
// STEP 6: Add Media Servers (SFU) for Video Routing
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📹',
  scenario: "Your meetings work, but video quality is terrible!",
  hook: "A 20-person meeting requires each user to upload 19 video streams (50 Mbps upload!). Most home internet can't handle it.",
  challenge: "Add Media Servers (SFU) to route video efficiently.",
  illustration: 'video-quality',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎥',
  message: 'Video routing is now efficient!',
  achievement: 'SFU architecture reduces bandwidth by 90%',
  metrics: [
    { label: 'Upload per user', before: '50 Mbps', after: '2.5 Mbps' },
    { label: 'Video quality', before: 'Poor', after: 'HD 720p' },
    { label: 'Latency', after: '<150ms' },
  ],
  nextTeaser: "But we need to store recordings somewhere...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Media Servers: The Heart of Video Conferencing',
  conceptExplanation: `**The Problem**: In a peer-to-peer (mesh) topology, each participant sends video to every other participant. For 20 people, that's 19 uploads per person!

**The Solution**: Use an **SFU (Selective Forwarding Unit)**.

How SFU works:
1. Each participant sends ONE video stream to the SFU
2. The SFU forwards (routes) that stream to other participants
3. Upload: 2.5 Mbps (1 stream), Download: 50 Mbps (19 streams)

This is how Zoom, Google Meet, and Teams all work!

Key concepts:
- **WebRTC**: Browser API for real-time video
- **SRTP**: Encrypted media transport protocol
- **Simulcast**: Send multiple quality streams (720p, 360p, 180p)
- **Adaptive bitrate**: Switch quality based on bandwidth`,

  whyItMatters: 'Without SFU, video calls only work for 2-3 people. Home internet upload speeds (5-10 Mbps) can\'t handle more.',

  famousIncident: {
    title: 'End-to-End Encryption Controversy',
    company: 'Zoom',
    year: '2020',
    whatHappened: 'Zoom claimed "end-to-end encryption" but actually used SRTP with server-side decryption in their SFU. This caused a PR crisis until they added true E2EE mode.',
    lessonLearned: 'SFU architecture requires server to see/route media. True E2EE requires peer-to-peer (worse quality/scale).',
    icon: '🔐',
  },

  realWorldExample: {
    company: 'Zoom',
    scenario: 'Routing video for 300M daily users',
    howTheyDoIt: 'Uses custom-built SFU servers deployed in 17+ data centers. Each server handles thousands of streams.',
  },

  diagram: `
MESH (Peer-to-Peer) - Doesn't Scale:
┌─────┐     ┌─────┐     ┌─────┐
│User1│────▶│User2│────▶│User3│
└─────┘◀────└─────┘◀────└─────┘
  ▲ │         ▲ │         ▲ │
  └─┴─────────┴─┴─────────┴─┘
Each user sends to ALL others (n² connections)

SFU (Selective Forwarding) - Scales:
        ┌──────────┐
        │   SFU    │
        │  Media   │
        │  Server  │
        └──────────┘
         ▲   │   │
         │   │   ▼
┌─────┐  │   │  ┌─────┐
│User1│──┘   └─▶│User2│
└─────┘         └─────┘
Each user sends once, SFU routes (n connections)
`,

  keyPoints: [
    'SFU routes video streams - users upload once, download many',
    'Reduces upload bandwidth by 90%+ for large meetings',
    'Supports adaptive quality with simulcast',
    'Uses WebRTC for browser compatibility',
    'SRTP encrypts media in transit',
  ],

  quickCheck: {
    question: 'Why does SFU architecture scale better than peer-to-peer mesh?',
    options: [
      'SFU uses better compression',
      'Users only upload once instead of N times',
      'SFU has faster internet',
      'SFU removes audio',
    ],
    correctIndex: 1,
    explanation: 'In mesh, each user uploads N-1 streams. In SFU, each user uploads 1 stream to the server, which routes it.',
  },

  keyConcepts: [
    { title: 'SFU', explanation: 'Server that forwards video streams', icon: '📡' },
    { title: 'WebRTC', explanation: 'Browser API for real-time media', icon: '🌐' },
    { title: 'Simulcast', explanation: 'Send multiple quality streams', icon: '📊' },
    { title: 'SRTP', explanation: 'Secure Real-time Transport Protocol', icon: '🔒' },
  ],
};

const step6: GuidedStep = {
  id: 'zoom-step-6',
  stepNumber: 6,
  frIndex: 1,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-2: Users can join meetings (now with efficient video routing)',
    taskDescription: 'Add Media Server (SFU) for video stream routing',
    componentsNeeded: [
      { type: 'media_server', reason: 'Route video/audio streams efficiently using SFU architecture', displayName: 'Media Server (SFU)' },
    ],
    successCriteria: [
      'Media Server component added',
      'Client connected to Media Server (for WebRTC)',
      'App Server connected to Media Server (for signaling)',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'media_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'client', toType: 'media_server' },
      { fromType: 'app_server', toType: 'media_server' },
    ],
  },

  hints: {
    level1: 'Drag a Media Server (SFU) component onto the canvas',
    level2: 'Connect both Client → Media Server (WebRTC) and App Server → Media Server (signaling)',
    solutionComponents: [{ type: 'media_server' }],
    solutionConnections: [
      { from: 'client', to: 'media_server' },
      { from: 'app_server', to: 'media_server' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Object Storage + CDN for Recordings
// =============================================================================

const step7Story: StoryContent = {
  emoji: '⏺️',
  scenario: "Users are recording meetings, but playback is slow and expensive!",
  hook: "Storing 1TB of recordings in the database costs $500/month. Streaming from the app server is slow.",
  challenge: "Add Object Storage (S3) and CDN for efficient recording storage and playback.",
  illustration: 'storage-crisis',
};

const step7Celebration: CelebrationContent = {
  emoji: '📼',
  message: 'Recordings are now fast and cheap!',
  achievement: 'Object storage + CDN handles recordings efficiently',
  metrics: [
    { label: 'Storage cost', before: '$500/TB', after: '$23/TB' },
    { label: 'Playback latency', before: '5s', after: '<500ms' },
    { label: 'Global CDN', after: 'Enabled' },
  ],
  nextTeaser: "But we need to optimize costs...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage + CDN: Efficient Media Storage',
  conceptExplanation: `**Object Storage (S3)** is optimized for large files like videos:
- Much cheaper than databases ($23/TB vs $500/TB)
- Infinite scalability
- Built-in redundancy

**CDN (Content Delivery Network)** caches recordings globally:
- Users download from nearby edge server
- Reduces latency from 5s to <500ms
- Reduces bandwidth costs on origin server

Workflow:
1. Record meeting → encode → upload to S3
2. User requests playback → CDN checks cache
3. Cache miss? CDN fetches from S3, caches it
4. Future viewers get instant playback from CDN`,

  whyItMatters: 'Storing 100 PB of recordings per year requires cheap, scalable storage. Fast global playback requires CDN.',

  famousIncident: {
    title: 'Zoom Cloud Storage Costs',
    company: 'Zoom',
    year: '2020',
    whatHappened: 'With pandemic-era growth, Zoom\'s cloud recording storage exploded. They had to rapidly scale their S3 infrastructure and implement tiered storage (hot/cold) to manage costs.',
    lessonLearned: 'Use the right storage for the job. Object storage for media, database for metadata.',
    icon: '💾',
  },

  realWorldExample: {
    company: 'Zoom',
    scenario: 'Storing billions of recordings',
    howTheyDoIt: 'Uses S3-compatible object storage with tiered pricing (hot for recent, cold for old). CDN (Cloudflare/Akamai) for global delivery.',
  },

  diagram: `
Recording Flow:
┌─────────┐
│ Meeting │ → Recording
└─────────┘
     │
     ▼ (encode)
┌──────────────┐
│ Object Store │ ← Store original
│     (S3)     │
└──────────────┘
     │
     ▼ (user requests playback)
┌──────────────┐
│     CDN      │ ← Cache + deliver globally
│  (CloudFront)│
└──────────────┘
     │
     ▼
┌──────────────┐
│    Users     │ ← Fast playback
└──────────────┘
`,

  keyPoints: [
    'Object Storage (S3) is 20x cheaper than database for media',
    'CDN caches content at edge locations worldwide',
    'Upload to S3, serve via CDN for low latency',
    'Implement tiered storage (hot/cold) for cost optimization',
  ],

  quickCheck: {
    question: 'Why use CDN for video playback instead of serving directly from S3?',
    options: [
      'CDN is cheaper than S3',
      'CDN caches content close to users for low latency',
      'S3 cannot serve videos',
      'CDN compresses videos better',
    ],
    correctIndex: 1,
    explanation: 'CDN edge servers are geographically distributed. Users download from nearby server instead of distant S3 bucket.',
  },

  keyConcepts: [
    { title: 'Object Storage', explanation: 'Cheap, scalable storage for large files', icon: '🗄️' },
    { title: 'CDN', explanation: 'Global cache for fast content delivery', icon: '🌍' },
    { title: 'Edge Server', explanation: 'CDN server close to users', icon: '📍' },
  ],
};

const step7: GuidedStep = {
  id: 'zoom-step-7',
  stepNumber: 7,
  frIndex: 4,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-5: Users can record meetings (now with efficient storage)',
    taskDescription: 'Add Object Storage (S3) and CDN for recording storage and playback',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store large recording files cheaply', displayName: 'S3 Object Storage' },
      { type: 'cdn', reason: 'Deliver recordings globally with low latency', displayName: 'CDN (CloudFront)' },
    ],
    successCriteria: [
      'Object Storage component added',
      'CDN component added',
      'App Server connected to Object Storage',
      'CDN connected to Object Storage',
      'Client connected to CDN',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'media_server', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'client', toType: 'media_server' },
      { fromType: 'app_server', toType: 'media_server' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
  },

  hints: {
    level1: 'Drag Object Storage (S3) and CDN components onto the canvas',
    level2: 'Connect: App Server → Object Storage, CDN → Object Storage, Client → CDN',
    solutionComponents: [{ type: 'object_storage' }, { type: 'cdn' }],
    solutionConnections: [
      { from: 'app_server', to: 'object_storage' },
      { from: 'cdn', to: 'object_storage' },
      { from: 'client', to: 'cdn' },
    ],
  },
};

// =============================================================================
// STEP 8: Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Your monthly cloud bill is $2 million.",
  hook: "The CFO says: 'Cut costs by 40% or we're raising prices for users.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Zoom!',
  achievement: 'A scalable, cost-effective video conferencing platform',
  metrics: [
    { label: 'Monthly cost', before: '$2M', after: 'Under budget' },
    { label: 'Video latency', after: '<150ms' },
    { label: 'Join time', after: '<3s' },
    { label: 'Availability', after: '99.9%' },
    { label: 'Can handle', after: '2M concurrent users' },
  ],
  nextTeaser: "You've mastered video conferencing system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies for video conferencing:
1. **Geographic media server placement** - Put SFU servers close to users to reduce bandwidth
2. **Adaptive bitrate** - Lower quality for poor connections saves bandwidth
3. **Tiered storage** - Move old recordings to cold storage (S3 Glacier)
4. **Auto-scale media servers** - Spin up/down based on active meetings
5. **Efficient encoding** - Use VP9/H.265 for better compression

For Zoom:
- Use spot instances for transcoding jobs (60-90% cheaper)
- Implement tiered storage (hot/cold/archive)
- Auto-scale SFU servers based on meeting count
- Optimize media codecs (VP9 > VP8 > H.264)`,

  whyItMatters: 'Video is bandwidth-intensive. At scale, every 1% bandwidth reduction saves millions annually.',

  famousIncident: {
    title: 'Zoom Profit Margin Challenge',
    company: 'Zoom',
    year: '2021',
    whatHappened: 'After pandemic growth, Zoom faced pressure to improve profit margins. They invested heavily in infrastructure optimization - custom codecs, better media routing, tiered storage.',
    lessonLearned: 'At massive scale, infrastructure optimization directly impacts profitability.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Zoom',
    scenario: 'Optimizing for 300M daily users',
    howTheyDoIt: 'Owns data centers for predictable costs, uses multi-cloud for burst capacity, aggressive codec optimization',
  },

  keyPoints: [
    'Video conferencing is bandwidth-intensive - optimize aggressively',
    'Geographic server placement reduces latency and bandwidth costs',
    'Adaptive bitrate balances quality with bandwidth',
    'Tiered storage for recordings (hot/cold/archive)',
    'Auto-scale based on active meetings, not total users',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for video conferencing?',
    options: [
      'Use lower resolution for everyone',
      'Geographic media server placement + adaptive bitrate',
      'Delete old recordings',
      'Limit meeting duration',
    ],
    correctIndex: 1,
    explanation: 'Geo-placement reduces bandwidth costs. Adaptive bitrate maintains quality while optimizing for each user\'s connection.',
  },

  keyConcepts: [
    { title: 'Adaptive Bitrate', explanation: 'Adjust quality based on bandwidth', icon: '📊' },
    { title: 'Geo-Placement', explanation: 'Servers close to users', icon: '🌍' },
    { title: 'Tiered Storage', explanation: 'Hot/cold/archive pricing', icon: '🗄️' },
  ],
};

const step8: GuidedStep = {
  id: 'zoom-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $800/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $800/month',
      'Maintain all performance requirements',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'media_server', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'client', toType: 'media_server' },
      { fromType: 'app_server', toType: 'media_server' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
    requireCacheStrategy: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component\'s configuration for over-provisioning',
    level2: 'Consider: smaller cache, fewer DB replicas, right-sized instances. Media servers are essential - keep them.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const zoomGuidedTutorial: GuidedTutorial = {
  problemId: 'zoom',
  title: 'Design Zoom',
  description: 'Build a video conferencing platform with meetings, screen sharing, chat, and recordings',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🎬',
    hook: "You've been hired as Lead Engineer at Video Communications Inc!",
    scenario: "Your mission: Build a Zoom-like platform that can handle millions of concurrent video calls with HD quality and low latency.",
    challenge: "Can you design a system that efficiently routes video using SFU architecture?",
  },

  requirementsPhase: zoomRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'Caching',
    'Load Balancing',
    'SFU (Selective Forwarding Unit)',
    'WebRTC',
    'Media Servers',
    'Object Storage',
    'CDN',
    'Adaptive Bitrate',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, Maintainable Applications',
    'Chapter 5: Replication',
    'Chapter 8: Distributed Systems',
  ],
};

export default zoomGuidedTutorial;
