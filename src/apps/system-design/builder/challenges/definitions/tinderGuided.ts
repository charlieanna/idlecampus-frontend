import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Tinder Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial that teaches system design concepts
 * while building a location-based dating platform like Tinder.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-10: Scale with NFRs (cache, geolocation, storage, etc.)
 *
 * Key Concepts:
 * - Geo-spatial matching with location indexing
 * - Real-time matching algorithm
 * - Image storage and optimization
 * - Chat infrastructure for matches
 * - Swipe mechanics and state management
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const tinderRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a location-based dating platform like Tinder",

  interviewer: {
    name: 'Alex Chen',
    role: 'VP of Engineering at Love Connect Inc.',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-functionality',
      category: 'functional',
      question: "What are the core features users need from this dating platform?",
      answer: "Users need to:\n\n1. **Create profiles** - Upload photos, write bio, set preferences\n2. **Swipe on nearby users** - See profiles one at a time, swipe right (like) or left (pass)\n3. **Match with users** - When both users swipe right, it's a match!\n4. **Chat with matches** - Send messages to people you've matched with\n5. **Set preferences** - Age range, distance, gender preferences",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4, FR-5',
      learningPoint: "Tinder is built around location-based discovery and mutual interest matching",
    },
    {
      id: 'swipe-mechanism',
      category: 'functional',
      question: "How does the swipe mechanism work exactly?",
      answer: "1. User opens the app and sees a potential match (card)\n2. They swipe right (interested) or left (not interested)\n3. If both users swipe right on each other → **Match!**\n4. User sees next profile card\n\nKey: Users only see profiles they haven't swiped on yet. No duplicates!",
      importance: 'critical',
      revealsRequirement: 'FR-2, FR-3',
      learningPoint: "Swipe state must be tracked - can't show the same person twice",
    },
    {
      id: 'location-discovery',
      category: 'functional',
      question: "How does location-based discovery work?",
      answer: "Users only see potential matches within their distance preference (e.g., 10 miles).\n\nThe app:\n1. Gets user's current GPS location\n2. Finds nearby users within max distance\n3. Filters by age and gender preferences\n4. Shows profiles one by one for swiping\n\nLocation updates when the app is open.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Need efficient geo-spatial queries to find nearby users quickly",
    },
    {
      id: 'matching-algorithm',
      category: 'functional',
      question: "What happens when two users both swipe right?",
      answer: "It's a **match**! Both users get a notification immediately.\n\nThe match is mutual - both users must swipe right. One-sided likes don't create a match.\n\nOnce matched, users can:\n- See each other in their 'Matches' list\n- Start chatting\n- Unmatch if desired",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Matching requires checking if the other user previously swiped right on you",
    },
    {
      id: 'chat-functionality',
      category: 'functional',
      question: "How does messaging work?",
      answer: "After matching, users can send text messages to each other.\n\nFor MVP:\n- Basic text messages only\n- Real-time delivery (message appears immediately)\n- Message history persisted\n\nv2 features: photos, GIFs, video calls, voice messages",
      importance: 'important',
      revealsRequirement: 'FR-4',
      insight: "Chat is essential but can be simplified for MVP - text only",
    },
    {
      id: 'profile-photos',
      category: 'clarification',
      question: "How many photos can users upload?",
      answer: "Users can upload 1-6 photos. Photos are critical - they're the main way users decide to swipe.\n\nFor MVP:\n- Support 6 photos max\n- Basic crop/resize\n- Display photos in a carousel\n\nv2: Auto-enhancement, video profiles, verification photos",
      importance: 'important',
      insight: "Photos mean object storage and image optimization",
    },
    {
      id: 'profile-verification',
      category: 'clarification',
      question: "Do we need profile verification or fake profile detection?",
      answer: "Not for MVP. Profile verification (photo verification, phone verification) can come later. Focus on core matching experience first.",
      importance: 'nice-to-have',
      insight: "Verification adds complexity - defer to v2",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we support?",
      answer: "75 million registered users globally, 10 million daily active users (DAU)",
      importance: 'critical',
      learningPoint: "Tinder is one of the largest dating platforms globally",
    },
    {
      id: 'throughput-swipes',
      category: 'throughput',
      question: "How many swipes happen per day?",
      answer: "About 1.6 billion swipes per day",
      importance: 'critical',
      calculation: {
        formula: "1.6B ÷ 86,400 sec = 18,518 swipes/sec",
        result: "~18.5K swipes/sec (55K at peak)",
      },
      learningPoint: "Extremely high write volume - swipes need to be fast and cheap",
    },
    {
      id: 'throughput-matches',
      category: 'throughput',
      question: "How many matches happen per day?",
      answer: "About 26 million matches per day",
      importance: 'critical',
      calculation: {
        formula: "26M ÷ 86,400 sec = 300 matches/sec",
        result: "~300 matches/sec (900 at peak)",
      },
      learningPoint: "Need real-time notifications for matches",
    },
    {
      id: 'throughput-messages',
      category: 'throughput',
      question: "How many messages are sent per day?",
      answer: "About 200 million messages per day",
      importance: 'important',
      calculation: {
        formula: "200M ÷ 86,400 sec = 2,314 messages/sec",
        result: "~2.3K messages/sec (7K at peak)",
      },
      learningPoint: "Chat needs to be real-time with low latency",
    },
    {
      id: 'latency-swipe',
      category: 'latency',
      question: "How fast should swipe responses be?",
      answer: "p99 under 50ms for swipe action. Users swipe rapidly - any lag feels broken.",
      importance: 'critical',
      learningPoint: "Swipes must be instant - users swipe 10-20 times per minute",
    },
    {
      id: 'latency-load-profiles',
      category: 'latency',
      question: "How fast should profile loading be?",
      answer: "p99 under 200ms to load next profile card. Photos should start appearing within 100ms.",
      importance: 'critical',
      learningPoint: "Pre-fetch and cache profiles for smooth experience",
    },
    {
      id: 'location-accuracy',
      category: 'consistency',
      question: "How accurate does location need to be?",
      answer: "Within 1-5 miles is acceptable. Don't need exact GPS coordinates - just general proximity.\n\nLocation can be slightly stale (5-10 minutes old) - users don't move that fast.",
      importance: 'important',
      learningPoint: "Location doesn't need to be real-time - eventual consistency is fine",
    },
    {
      id: 'photo-size',
      category: 'payload',
      question: "What's the typical photo size?",
      answer: "Average 500KB per photo after compression, max 5MB upload. Generate multiple sizes (thumbnail, full).",
      importance: 'important',
      calculation: {
        formula: "10M DAU × 0.5 new photos/day × 500KB = 2.5TB/day",
        result: "~900TB/year storage growth",
      },
      learningPoint: "Need CDN for fast photo delivery globally",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-functionality', 'swipe-mechanism', 'location-discovery', 'matching-algorithm'],
  criticalFRQuestionIds: ['core-functionality', 'swipe-mechanism', 'matching-algorithm'],
  criticalScaleQuestionIds: ['throughput-swipes', 'latency-swipe', 'location-accuracy'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can create profiles',
      description: 'Upload photos, write bio, set age/distance/gender preferences',
      emoji: '👤',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can swipe on nearby profiles',
      description: 'See location-based profiles and swipe right (like) or left (pass)',
      emoji: '👈',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users match when both swipe right',
      description: 'Mutual likes create a match with instant notification',
      emoji: '💕',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Matches can chat',
      description: 'Send real-time messages to matches',
      emoji: '💬',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Location-based discovery',
      description: 'Only show users within distance preference',
      emoji: '📍',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million',
    writesPerDay: '1.6 billion swipes',
    readsPerDay: '100 million profile loads',
    peakMultiplier: 3,
    readWriteRatio: '1:16 (write-heavy!)',
    calculatedWriteRPS: { average: 18518, peak: 55554 },
    calculatedReadRPS: { average: 1157, peak: 3471 },
    maxPayloadSize: '~500KB (profile photo)',
    storagePerRecord: '~3MB (6 photos)',
    storageGrowthPerYear: '~900TB',
    redirectLatencySLA: 'p99 < 200ms (profile load)',
    createLatencySLA: 'p99 < 50ms (swipe)',
  },

  architecturalImplications: [
    '✅ Write-heavy (16:1) → Optimize swipe writes for speed',
    '✅ 55K swipes/sec peak → Need horizontal scaling + fast writes',
    '✅ Location-based → Geo-spatial indexing required',
    '✅ Real-time chat → WebSockets or long-polling needed',
    '✅ 900TB/year growth → Object storage + CDN for photos',
    '✅ Instant swipes → Cache profile stacks, pre-fetch next cards',
  ],

  outOfScope: [
    'Super Likes (premium feature)',
    'Profile verification',
    'Video profiles',
    'Video calls',
    'GIFs and photo sharing in chat',
    'Undo swipe (premium feature)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a system where users can create profiles, swipe on nearby users, and chat with matches. The geo-location optimization and photo delivery will come in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '💕',
  scenario: "Welcome to Love Connect Inc! You've been hired to build the next Tinder.",
  hook: "Your first user just downloaded the app and wants to start swiping!",
  challenge: "Set up the basic connection so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your dating app is online!',
  achievement: 'Users can now connect to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting connections', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle profiles yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every mobile app starts with a **Client** (the user's phone) connecting to a **Server**.

When someone opens Tinder:
1. The mobile app (Client) sends requests to your servers
2. Your App Server processes the requests (profile loading, swiping, matching)
3. The server sends back responses (profile data, match notifications, messages)

This is the foundation we'll build on!`,

  whyItMatters: 'Without this connection, users can\'t see profiles, swipe, or match with anyone.',

  realWorldExample: {
    company: 'Tinder',
    scenario: 'Serving 10 million daily active users',
    howTheyDoIt: 'Started as a simple server in 2012, now uses distributed microservices across multiple regions',
  },

  keyPoints: [
    'Client = the mobile app on user\'s phone',
    'App Server = your backend that handles matching logic',
    'HTTP/HTTPS = the protocol for communication',
    'Server must be fast - users swipe rapidly',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The mobile app that makes requests', icon: '📱' },
    { title: 'App Server', explanation: 'Your backend that processes swipes and matches', icon: '🖥️' },
    { title: 'HTTPS', explanation: 'Secure protocol for communication', icon: '🔒' },
  ],
};

const step1: GuidedStep = {
  id: 'tinder-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users with the Tinder mobile app', displayName: 'Mobile App' },
      { type: 'app_server', reason: 'Handles profiles, swipes, matches, and chat', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle swipes yet!",
  hook: "A user tried to swipe right but got an error. The server needs swipe logic!",
  challenge: "Write the Python code to handle profiles, swipes, and matches.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Swiping works!',
  achievement: 'You implemented the core Tinder functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can create profiles', after: '✓' },
    { label: 'Can swipe', after: '✓' },
    { label: 'Can match', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all swipes and matches are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Swipe & Match Logic',
  conceptExplanation: `The core of Tinder is the swipe and match algorithm:

**Swipe Handler:**
1. User swipes right/left on a profile
2. Store swipe decision (user_id, target_id, direction)
3. If swipe is "right", check if target already swiped right on this user
4. If both swiped right → Create match!

**Match Detection:**
- Store all "right" swipes in memory
- When user A swipes right on user B, check: Did B already swipe right on A?
- If yes → Match! Send notification to both users

For now, we'll use in-memory storage (Python dictionaries).`,

  whyItMatters: 'The matching algorithm is what makes Tinder special - mutual interest creates connection!',

  famousIncident: {
    title: 'Tinder\'s Launch at USC',
    company: 'Tinder',
    year: '2012',
    whatHappened: 'The founders threw parties at USC and would only let students in if they downloaded Tinder. The app spread to 500 users in one night, then went viral across campuses.',
    lessonLearned: 'The swipe mechanism was revolutionary - simple, fun, and addictive. Get the core mechanic right!',
    icon: '🎓',
  },

  realWorldExample: {
    company: 'Tinder',
    scenario: 'Processing 1.6 billion swipes per day',
    howTheyDoIt: 'Uses high-performance databases with indexes on (user_id, target_id) pairs for instant match detection',
  },

  keyPoints: [
    'Store swipe decisions: (user_id, target_id, direction, timestamp)',
    'For "right" swipes, check if target already swiped right',
    'Match = mutual "right" swipes',
    'Use dictionaries for in-memory storage (temporary)',
  ],

  quickCheck: {
    question: 'Why do we check for existing swipes when processing a "right" swipe?',
    options: [
      'To prevent duplicate swipes',
      'To detect if it\'s a mutual match',
      'To count total swipes',
      'To track user behavior',
    ],
    correctIndex: 1,
    explanation: 'We check if the other user already swiped right to detect mutual matches instantly!',
  },

  keyConcepts: [
    { title: 'Swipe', explanation: 'User decision: right (like) or left (pass)', icon: '👆' },
    { title: 'Match', explanation: 'Both users swiped right on each other', icon: '💕' },
    { title: 'Match Detection', explanation: 'Check for mutual right swipes', icon: '🔍' },
  ],
};

const step2: GuidedStep = {
  id: 'tinder-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Create profiles, FR-2: Swipe, FR-3: Match',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/profiles, GET /api/v1/profiles/nearby, POST /api/v1/swipe, GET /api/v1/matches APIs',
      'Open the Python tab',
      'Implement create_profile(), get_nearby_profiles(), swipe(), and get_matches() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for profiles, swipes, and matches',
    solutionComponents: [
      {
        type: 'app_server',
        config: {
          handledAPIs: [
            'POST /api/v1/profiles',
            'GET /api/v1/profiles/nearby',
            'POST /api/v1/swipe',
            'GET /api/v1/matches'
          ]
        }
      },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Persistence
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! Your server crashed at 3 AM...",
  hook: "When it restarted, ALL matches were GONE! Users who matched last night can't chat. They're furious!",
  challenge: "Add a database so profiles, swipes, and matches survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your data is safe forever!',
  achievement: 'Profiles, swipes, and matches now persist',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But loading profiles is getting slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Databases for Dating Apps',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Swipes and matches survive crashes
- **Queries**: Find nearby users, match history, chat messages
- **Transactions**: Ensure atomic match creation

For Tinder, we need tables for:
- \`users\` - Profile info, bio, preferences, location
- \`photos\` - Photo URLs (actual images in object storage)
- \`swipes\` - All swipe decisions with timestamp
- \`matches\` - Matched user pairs
- \`messages\` - Chat history between matches`,

  whyItMatters: 'Imagine losing all your matches and messages because of a server restart. Users would abandon the app immediately!',

  famousIncident: {
    title: 'OkCupid Database Corruption',
    company: 'OkCupid',
    year: '2014',
    whatHappened: 'A database migration went wrong and corrupted match data for thousands of users. Some users lost months of conversation history.',
    lessonLearned: 'Always test database migrations thoroughly. Have backups and rollback plans ready.',
    icon: '💔',
  },

  realWorldExample: {
    company: 'Tinder',
    scenario: 'Storing 75 million user profiles and billions of swipes',
    howTheyDoIt: 'Uses MongoDB for flexible profile data, PostgreSQL for transactional data (matches, payments)',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Store swipes for match detection and analytics',
    'Index on (user_id, target_id) for fast match lookups',
    'Use transactions for atomic match creation',
  ],

  quickCheck: {
    question: 'What happens to in-memory matches when the server restarts?',
    options: [
      'They\'re automatically saved to disk',
      'They\'re recovered from user devices',
      'They\'re completely lost',
      'They\'re backed up in the cloud',
    ],
    correctIndex: 2,
    explanation: 'In-memory data is volatile. When the server restarts, all data in RAM is lost forever.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'Indexes', explanation: 'Speed up match lookups', icon: '🔍' },
    { title: 'Transactions', explanation: 'Atomic match creation', icon: '⚛️' },
  ],
};

const step3: GuidedStep = {
  id: 'tinder-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store users, photos, swipes, matches, messages', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Fast Profile Loading
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You have 1 million users now. Profile loading takes 2 seconds!",
  hook: "Every swipe fetches from the database. Users are swiping 20 times per minute - that's hammering the DB!",
  challenge: "Add a cache to make profile loading instant.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Profiles load 20x faster!',
  achievement: 'Caching made swiping smooth',
  metrics: [
    { label: 'Profile load time', before: '2000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '90%' },
  ],
  nextTeaser: "But a single server can't handle all this traffic...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Secret',
  conceptExplanation: `A **cache** stores frequently accessed data in fast memory (RAM).

Instead of:
\`\`\`
Request → Database (200ms)
\`\`\`

You get:
\`\`\`
Request → Cache (5ms) ✓
\`\`\`

For Tinder, cache:
- **Profile stacks** - Pre-load next 10 profiles for each user
- **User profiles** - Bio, photos, preferences
- **Match lists** - Recent matches for quick access

Use **Redis** for fast key-value storage with TTL (time-to-live).`,

  whyItMatters: 'With 55K swipes/sec at peak, every database query costs money and latency. Cache hits are nearly free and instant.',

  famousIncident: {
    title: 'Tinder\'s Valentine\'s Day Crash',
    company: 'Tinder',
    year: '2015',
    whatHappened: 'Valentine\'s Day caused 10x traffic spike. Servers couldn\'t handle the load. App was down for hours during peak usage.',
    lessonLearned: 'Cache aggressively for read-heavy operations. Plan for traffic spikes on special days.',
    icon: '💝',
  },

  realWorldExample: {
    company: 'Tinder',
    scenario: 'Pre-loading profile stacks for smooth swiping',
    howTheyDoIt: 'Uses Redis to cache the next 50 profiles for each user. Cache hit rate > 95%.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                                   └───────┘
                                       │
                               90% cache hit!
`,

  keyPoints: [
    'Cache profile stacks for instant swipe experience',
    'Set short TTL (5 min) for profile data freshness',
    'Cache-aside pattern: check cache → miss → fetch DB → populate cache',
    'Pre-fetch next profiles while user is swiping',
  ],

  quickCheck: {
    question: 'Why cache profile stacks instead of individual profiles?',
    options: [
      'It uses less memory',
      'Users swipe through stacks sequentially - pre-loading is efficient',
      'Individual profiles change too often',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Users swipe through profiles in order. Pre-loading a stack means smooth, instant swiping!',
  },
};

const step4: GuidedStep = {
  id: 'tinder-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Swipe on profiles (now fast!)',
    taskDescription: 'Add Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache profile stacks for instant swiping', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added',
      'App Server connected to Cache',
      'TTL configured (5 minutes)',
      'Cache strategy set',
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
    level1: 'Drag a Cache (Redis) onto the canvas',
    level2: 'Connect App Server to Cache. Set TTL to 300 seconds (5 minutes).',
    solutionComponents: [{ type: 'cache', config: { ttl: 300, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Friday night at 9 PM - your single server is at 100% CPU!",
  hook: "Everyone's home from dates and swiping. Traffic spiked 5x. Users getting timeouts!",
  challenge: "Add a load balancer to distribute traffic across multiple servers.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Traffic is balanced!',
  achievement: 'Load balancer prevents server overload',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Can scale horizontally', after: '✓' },
  ],
  nextTeaser: "But we need more server instances...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing for High Traffic',
  conceptExplanation: `A **Load Balancer** distributes incoming requests across multiple app servers.

Benefits:
- **No single point of failure** - one server down, others continue
- **Horizontal scaling** - add more servers for more capacity
- **Health checks** - route around failed servers automatically
- **Even distribution** - no server gets overloaded

For Tinder, Layer 7 (HTTP) load balancing routes API requests to healthy servers.`,

  whyItMatters: 'Friday/Saturday nights see 5x traffic spikes. One server will always fail. Multiple servers + load balancer = reliability.',

  famousIncident: {
    title: 'Bumble\'s Super Bowl Outage',
    company: 'Bumble',
    year: '2019',
    whatHappened: 'During a Super Bowl ad campaign, traffic spiked 20x instantly. Load balancers couldn\'t scale fast enough. App was down for 30 minutes.',
    lessonLearned: 'Pre-warm infrastructure before marketing campaigns. Configure auto-scaling ahead of known traffic spikes.',
    icon: '🏈',
  },

  realWorldExample: {
    company: 'Tinder',
    scenario: 'Handling Friday night traffic spikes',
    howTheyDoIt: 'Uses AWS Application Load Balancers with auto-scaling groups. Scales from 50 to 500+ servers based on demand.',
  },

  keyPoints: [
    'Load balancer sits between client and app servers',
    'Distributes requests evenly across healthy servers',
    'Enables adding/removing servers without downtime',
    'Health checks detect and route around failures',
  ],

  quickCheck: {
    question: 'What happens if one app server crashes behind a load balancer?',
    options: [
      'All users lose connection',
      'Load balancer detects failure and routes to healthy servers',
      'Database crashes too',
      'Cache is cleared',
    ],
    correctIndex: 1,
    explanation: 'Load balancer health checks detect failed servers and automatically route traffic to healthy ones!',
  },
};

const step5: GuidedStep = {
  id: 'tinder-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across app servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer added',
      'Client → Load Balancer connection',
      'Load Balancer → App Server connection',
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
    level1: 'Add Load Balancer between Client and App Server',
    level2: 'Reconnect: Client → Load Balancer → App Server',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Database Replication
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚠️',
  scenario: "Your database server just crashed. Hardware failure at 2 AM.",
  hook: "Users see 'Something went wrong' for 3 hours while you restore from backup. Matches are lost!",
  challenge: "Add database replication for instant failover and read scaling.",
  illustration: 'database-failure',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Database is fault-tolerant!',
  achievement: 'Replicas provide redundancy and read scaling',
  metrics: [
    { label: 'Database availability', before: '99%', after: '99.99%' },
    { label: 'Read capacity', before: '1x', after: '3x' },
  ],
  nextTeaser: "But we need more app server capacity...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication for High Availability',
  conceptExplanation: `**Replication** copies data to multiple database servers:

- **Primary**: Handles all writes (swipes, matches, messages)
- **Replicas**: Handle reads (profile loading, match lists)

Benefits:
- If primary fails, replica is promoted (automatic failover)
- Spread read load across replicas (3x read capacity)
- Multiple copies = data safety

For Tinder, writes are frequent but reads are constant. Replicas help scale reads.`,

  whyItMatters: 'Tinder has 75M users. Database downtime = millions of lost swipes and matches. Replication ensures uptime.',

  famousIncident: {
    title: 'Match.com Database Failure',
    company: 'Match.com',
    year: '2011',
    whatHappened: 'Primary database crashed during peak hours. No replica was configured. Site was down for 6 hours on a Saturday night.',
    lessonLearned: 'Always have replicas ready. Test failover regularly - you don\'t want to learn how during a real outage.',
    icon: '💔',
  },

  realWorldExample: {
    company: 'Tinder',
    scenario: 'Handling database failures',
    howTheyDoIt: 'Uses PostgreSQL with streaming replication. 1 primary + 2 replicas in different availability zones.',
  },

  keyPoints: [
    'Primary handles writes, replicas handle reads',
    'Automatic failover: replica promoted if primary dies',
    'Use 2+ replicas for redundancy',
    'Monitor replication lag to ensure data freshness',
  ],
};

const step6: GuidedStep = {
  id: 'tinder-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs need reliable data access',
    taskDescription: 'Enable database replication with 2+ replicas',
    successCriteria: [
      'Click Database component',
      'Enable replication in config',
      'Set replica count to 2',
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
    level1: 'Click Database → Configuration → Enable replication',
    level2: 'Set replica count to 2 for redundancy',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Horizontal Scaling of App Servers
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📈',
  scenario: "You've grown to 10 million daily users! One app server instance is overwhelmed.",
  hook: "Even with load balancing, request volume is crushing a single instance.",
  challenge: "Scale horizontally by running multiple app server instances.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: '10x more capacity!',
  achievement: 'Multiple app servers share the swipe load',
  metrics: [
    { label: 'App Server instances', before: '1', after: '5+' },
    { label: 'Swipe capacity', before: '5K/s', after: '50K+/s' },
  ],
  nextTeaser: "But profile photos are loading slowly...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: Adding Compute Power',
  conceptExplanation: `**Horizontal scaling** = adding more server instances (scale out)

For Tinder handling 55K swipes/sec at peak:
- 1 server can handle ~5K swipes/sec
- Need 10+ servers for peak load
- Auto-scaling adds/removes servers based on demand

Load balancer distributes requests across all instances evenly.

**Key**: Servers must be **stateless** - don't store user sessions in memory. Use cache/DB for shared state.`,

  whyItMatters: 'At 10M daily users, you need dozens of servers working together to handle the swipe volume.',

  realWorldExample: {
    company: 'Tinder',
    scenario: 'Handling Friday night swipe surges',
    howTheyDoIt: 'Auto-scales from 100 to 500+ app server instances based on traffic patterns. Each instance is stateless.',
  },

  keyPoints: [
    'Run multiple instances of your app server',
    'Load balancer distributes across all instances',
    'Auto-scaling adjusts instance count based on load',
    'Keep servers stateless for easy scaling',
  ],

  quickCheck: {
    question: 'Why must app servers be stateless for horizontal scaling?',
    options: [
      'It\'s faster',
      'Any instance can handle any request - no session affinity needed',
      'It uses less memory',
      'It\'s more secure',
    ],
    correctIndex: 1,
    explanation: 'Stateless servers can handle any request. Load balancer can route to any instance without worrying about session data.',
  },
};

const step7: GuidedStep = {
  id: 'tinder-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs need more compute capacity',
    taskDescription: 'Scale App Server to 5+ instances',
    successCriteria: [
      'Click App Server',
      'Set instances to 5 or more',
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
  },

  hints: {
    level1: 'Click App Server → Configuration → Set instances',
    level2: 'Set instances to 5 for horizontal scaling',
    solutionComponents: [{ type: 'app_server', config: { instances: 5 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Object Storage for Photos
// =============================================================================

const step8Story: StoryContent = {
  emoji: '📦',
  scenario: "You're storing 2.5TB of new profile photos per day. The database can't handle it!",
  hook: "Databases are designed for structured data, not 500KB image blobs.",
  challenge: "Add object storage (S3) for profile photos.",
  illustration: 'storage-full',
};

const step8Celebration: CelebrationContent = {
  emoji: '☁️',
  message: 'Photos have a proper home!',
  achievement: 'Object storage handles unlimited photos',
  metrics: [
    { label: 'Photo storage', after: 'Unlimited (S3)' },
    { label: 'Durability', after: '99.999999999%' },
  ],
  nextTeaser: "But users far away are experiencing slow photo loads...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage for Photos',
  conceptExplanation: `**Object Storage** (like S3) is designed for large files:

- Stores binary objects (photos, videos)
- Virtually unlimited capacity
- Pay only for what you use
- Built-in redundancy and durability

Architecture:
- **Database**: Photo metadata (user_id, photo_url, upload_date)
- **Object Storage**: Actual photo files
- App server uploads to S3, stores URL in database

For Tinder, users upload 1-6 photos. Generate thumbnails and full-size versions.`,

  whyItMatters: 'Tinder stores billions of photos. 900TB/year growth. You can\'t put that in PostgreSQL.',

  famousIncident: {
    title: 'Snapchat\'s S3 Costs',
    company: 'Snapchat',
    year: '2017',
    whatHappened: 'Before IPO, Snapchat revealed they were spending $400M/year on Google Cloud Storage. Investors were shocked.',
    lessonLearned: 'Object storage is essential but costs add up fast. Optimize: delete old photos, compress images, use CDN.',
    icon: '👻',
  },

  realWorldExample: {
    company: 'Tinder',
    scenario: 'Storing billions of profile photos',
    howTheyDoIt: 'Uses AWS S3 with aggressive image compression. Generates 3 sizes: thumbnail (50KB), medium (200KB), full (500KB).',
  },

  diagram: `
┌──────────────┐
│   Client     │
└──────┬───────┘
       │
       │ 1. Upload photo
       ▼
┌──────────────┐     2. Store image    ┌─────────────────┐
│  App Server  │ ──────────────────▶  │  Object Storage │
└──────┬───────┘                       │     (S3)        │
       │                               └─────────────────┘
       │ 3. Save URL
       ▼
┌──────────────┐
│   Database   │  (photo_url: "s3://bucket/user123/photo1.jpg")
└──────────────┘
`,

  keyPoints: [
    'Object storage for files, database for metadata',
    'Store photo URLs in database, actual files in S3',
    'Generate multiple sizes (thumbnail, full) for optimization',
    'S3 handles replication and durability automatically',
  ],

  quickCheck: {
    question: 'Why not store photos directly in the database?',
    options: [
      'Databases can\'t store binary data',
      'It\'s too slow and expensive at scale',
      'Photos need to be public',
      'It\'s against privacy laws',
    ],
    correctIndex: 1,
    explanation: 'Databases CAN store binary, but it\'s not optimized for large files. Storage costs balloon and queries slow down.',
  },
};

const step8: GuidedStep = {
  id: 'tinder-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-1: Profile photos (now at scale!)',
    taskDescription: 'Add Object Storage for profile photos',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store profile photos durably', displayName: 'S3 Object Storage' },
    ],
    successCriteria: [
      'Object Storage component added',
      'App Server connected to Object Storage',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag Object Storage (S3) onto the canvas',
    level2: 'Connect App Server to Object Storage for photo uploads',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 9: CDN for Fast Photo Delivery + Geolocation Service
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🌍',
  scenario: "Users in Tokyo are seeing 5-second photo load times! And location-based matching is inaccurate.",
  hook: "Your servers are in US-East. Photos travel halfway around the world. Plus, finding nearby users is slow!",
  challenge: "Add a CDN for fast global photo delivery and optimize geolocation queries.",
  illustration: 'global-latency',
};

const step9Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Photos load instantly everywhere!',
  achievement: 'CDN delivers photos globally, geo-queries are fast',
  metrics: [
    { label: 'Tokyo photo latency', before: '5000ms', after: '100ms' },
    { label: 'Nearby search time', before: '800ms', after: '50ms' },
  ],
  nextTeaser: "Time to optimize costs...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'CDN + Geolocation Optimization',
  conceptExplanation: `A **CDN** (Content Delivery Network) caches photos at edge locations worldwide.

**How it works:**
1. First request: Edge fetches from origin (S3), caches it
2. Subsequent requests: Served from nearby edge (< 100ms)

**Geolocation Indexing:**
For "find nearby users" queries, use:
- **Geohash** - Encode lat/long into string (e.g., "9q8yy")
- **Index on geohash prefix** - Fast range queries
- **Redis Geo** - Built-in geo commands (GEORADIUS)

For Tinder: Cache popular user photos at edges, use geohash for nearby user queries.`,

  whyItMatters: 'Tinder has global users. Photos must load fast everywhere. Geo-queries must be instant for smooth swiping.',

  famousIncident: {
    title: 'Tinder Passport Feature Launch',
    company: 'Tinder',
    year: '2020',
    whatHappened: 'During COVID-19, Tinder made "Passport" (swipe anywhere globally) free. Traffic to international profiles spiked 10x. CDN was critical for serving photos across regions.',
    lessonLearned: 'Global features require global infrastructure. CDN and geo-distributed databases are essential.',
    icon: '✈️',
  },

  realWorldExample: {
    company: 'Tinder',
    scenario: 'Serving photos globally with low latency',
    howTheyDoIt: 'Uses CloudFront CDN with 200+ edge locations. Geohash indexing for nearby user queries. 95%+ cache hit rate.',
  },

  diagram: `
User in Tokyo:
                                    ┌─────────────┐
┌──────────┐    50ms    ┌──────────┤  Tokyo Edge │
│   User   │◀──────────▶│   CDN    │    Cache    │
│ (Tokyo)  │            │          └─────────────┘
└──────────┘            │
                        │ Cache miss?
                        │    ▼
                        │ ┌─────────────┐
                        │ │   Origin    │
                        └─│    (S3)     │
                          │   US-East   │
                          └─────────────┘

Geolocation:
┌──────────────┐
│ Redis Geo    │  GEORADIUS user_locations 37.7749 -122.4194 10 mi
│              │  → Returns nearby user IDs in <50ms
└──────────────┘
`,

  keyPoints: [
    'CDN caches photos at edge locations globally',
    'Users get photos from nearest edge (< 100ms)',
    'Use geohash or Redis Geo for fast nearby queries',
    'Index location data for efficient range searches',
  ],

  quickCheck: {
    question: 'Why use geohash instead of calculating distance for every user?',
    options: [
      'Geohash is more accurate',
      'Geohash enables fast indexed lookups - O(log n) vs O(n)',
      'Geohash uses less storage',
      'It\'s required by Tinder',
    ],
    correctIndex: 1,
    explanation: 'Geohash lets you use indexes for range queries. Calculating distance for millions of users is too slow!',
  },
};

const step9: GuidedStep = {
  id: 'tinder-step-9',
  stepNumber: 9,
  frIndex: 1,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-2: Swipe on nearby users (fast globally!), FR-5: Location-based discovery',
    taskDescription: 'Add CDN for global photo delivery',
    componentsNeeded: [
      { type: 'cdn', reason: 'Deliver photos from edge locations worldwide', displayName: 'CloudFront CDN' },
    ],
    successCriteria: [
      'CDN component added',
      'CDN connected to Object Storage (origin)',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add a CDN component connected to Object Storage',
    level2: 'CDN serves as the public endpoint for photos, S3 is the origin',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [{ from: 'cdn', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 10: Cost Optimization
// =============================================================================

const step10Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is panicking! Your cloud bill is $800K per month.",
  hook: "The CFO says: 'Cut costs 30% or we're in trouble.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Tinder!',
  achievement: 'A scalable, cost-effective dating platform',
  metrics: [
    { label: 'Monthly cost', before: '$800K', after: 'Under budget' },
    { label: 'Swipe latency', after: '<50ms' },
    { label: 'Daily swipes', after: '1.6B' },
    { label: 'Daily matches', after: '26M' },
    { label: 'Global availability', after: '99.99%' },
  ],
  nextTeaser: "You've mastered dating app system design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization for High-Scale Apps',
  conceptExplanation: `Building scalable systems is great. Building affordable ones is essential.

**Cost optimization strategies:**

1. **Right-size instances** - Don't over-provision servers
2. **Aggressive caching** - Reduce expensive database queries
3. **CDN for static content** - Cheaper than origin requests
4. **Photo compression** - 500KB → 200KB saves 60% storage
5. **Auto-scaling** - Scale down during low traffic (3 AM)
6. **Reserved instances** - Up to 70% savings for steady load
7. **Delete old data** - Inactive users, old swipes > 6 months

For Tinder specifically:
- Cache profile stacks → 90% fewer DB reads
- CDN for photos → 95% fewer S3 requests
- Compress photos → 60% storage savings
- Delete old swipes → Reduce DB size`,

  whyItMatters: 'The best architecture is one the company can afford to run long-term.',

  famousIncident: {
    title: 'Instagram\'s Storage Optimization',
    company: 'Instagram',
    year: '2018',
    whatHappened: 'Instagram realized they were storing multiple copies of the same meme/viral photo. Implemented deduplication and saved $100M in storage costs.',
    lessonLearned: 'Look for redundant data. Deduplication, compression, and cleanup have huge ROI.',
    icon: '📸',
  },

  realWorldExample: {
    company: 'Tinder',
    scenario: 'Optimizing costs while scaling to 75M users',
    howTheyDoIt: 'Aggressive photo compression (WebP format), delete swipes > 90 days, use spot instances for background jobs, reserved instances for steady load.',
  },

  keyPoints: [
    'Cache aggressively to reduce database load',
    'Use CDN to reduce origin requests (S3 costs)',
    'Compress and optimize photos (60% savings)',
    'Auto-scale: add servers during peak, remove during low traffic',
    'Delete old data: swipes, inactive users, old messages',
  ],

  quickCheck: {
    question: 'What\'s the easiest cost optimization for a write-heavy system like Tinder?',
    options: [
      'Delete old swipes to reduce database size',
      'Use smaller servers',
      'Reduce replica count',
      'Turn off auto-scaling',
    ],
    correctIndex: 0,
    explanation: 'Swipes older than 90 days have no value. Deleting them reduces DB size, improves performance, and cuts costs.',
  },
};

const step10: GuidedStep = {
  id: 'tinder-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'All FRs within budget',
    taskDescription: 'Optimize system to stay under $500/month budget',
    successCriteria: [
      'Review component configurations',
      'Ensure total cost under budget',
      'Maintain performance requirements',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component for over-provisioning',
    level2: 'Consider: smaller cache TTL, fewer replicas if acceptable, right-sized instances, photo compression',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT
// =============================================================================

export const tinderGuidedTutorial: GuidedTutorial = {
  problemId: 'tinder',
  title: 'Design Tinder',
  description: 'Build a location-based dating app with swipes, matches, and chat',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '💕',
    hook: "You've been hired as Lead Engineer at Love Connect Inc!",
    scenario: "Your mission: Build a platform where users can swipe on nearby profiles and chat with matches - like Tinder!",
    challenge: "Can you design a system that handles 1.6 billion swipes per day?",
  },

  requirementsPhase: tinderRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'Caching Strategies',
    'Load Balancing',
    'Database Replication',
    'Horizontal Scaling',
    'Object Storage',
    'CDN',
    'Geolocation Indexing',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 2: Data Models (Geospatial indexing)',
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 9: Consistency',
  ],
};

export default tinderGuidedTutorial;
