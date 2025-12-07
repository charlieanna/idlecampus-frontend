import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Spotify Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a music streaming platform like Spotify.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (cache, CDN, object storage, cost optimization)
 *
 * Key Concepts:
 * - Audio streaming architecture
 * - Content delivery networks
 * - Metadata vs media separation
 * - Offline caching strategy
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const spotifyRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a music streaming platform like Spotify",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Principal Engineer at Music Streaming Co.',
    avatar: '🎵',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-streaming',
      category: 'functional',
      question: "What's the core functionality users expect from a music streaming service?",
      answer: "Users want to:\n\n1. **Stream music** - Play songs instantly without downloading the entire file\n2. **Browse catalog** - Explore millions of songs, albums, and artists\n3. **Create playlists** - Make custom collections of their favorite songs\n4. **Search** - Find specific songs, albums, or artists quickly",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Spotify is about instant access to millions of songs - streaming is the core feature",
    },
    {
      id: 'playback-experience',
      category: 'functional',
      question: "What makes for a great listening experience?",
      answer: "Key features:\n1. **Gapless playback** - No silence between songs in an album\n2. **Crossfade** - Smooth transitions between tracks\n3. **Queue management** - Add songs to play next or later\n4. **Resume playback** - Continue where you left off across devices",
      importance: 'important',
      revealsRequirement: 'FR-1 (enhanced)',
      learningPoint: "User experience details matter - gapless playback is technically complex but essential",
    },
    {
      id: 'offline-mode',
      category: 'functional',
      question: "What if users don't have internet connection?",
      answer: "Premium users can **download songs** for offline listening. This is crucial for mobile users with limited data or spotty connectivity (flights, subways, etc.).",
      importance: 'important',
      revealsRequirement: 'FR-5',
      learningPoint: "Offline mode changes the architecture - client-side storage becomes important",
    },
    {
      id: 'social-features',
      category: 'clarification',
      question: "Should users be able to share playlists or see what friends are listening to?",
      answer: "Yes eventually, but for the MVP, let's focus on the core listening experience. Social features can be added later.",
      importance: 'nice-to-have',
      insight: "Social features add complexity - good to defer initially",
    },
    {
      id: 'recommendations',
      category: 'clarification',
      question: "Should we recommend songs based on listening history?",
      answer: "Recommendations are important but require ML infrastructure. For MVP, focus on search and manual discovery. We'll add recommendations in v2.",
      importance: 'nice-to-have',
      insight: "ML-based features are complex - defer for initial launch",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "500 million registered users, with 200 million monthly active users (MAU). About 50 million concurrent listeners at peak.",
      importance: 'critical',
      learningPoint: "This is massive scale - comparable to the largest streaming platforms",
    },
    {
      id: 'throughput-catalog',
      category: 'throughput',
      question: "How big is the music catalog?",
      answer: "100 million songs, with about 100,000 new tracks added daily",
      importance: 'critical',
      calculation: {
        formula: "100M songs × 4MB avg = 400TB of audio files",
        result: "~400TB of storage needed",
      },
      learningPoint: "Media files dominate storage - this is different from text-heavy apps like Twitter",
    },
    {
      id: 'throughput-streaming',
      category: 'throughput',
      question: "How many streams per day?",
      answer: "About 1 billion streams per day",
      importance: 'critical',
      calculation: {
        formula: "1B ÷ 86,400 sec = 11,574 streams/sec",
        result: "~12K concurrent streams/sec (36K at peak)",
      },
      learningPoint: "Each stream is sustained for 3-4 minutes, unlike quick API calls",
    },
    {
      id: 'throughput-bandwidth',
      category: 'throughput',
      question: "How much bandwidth does audio streaming require?",
      answer: "Premium quality: 320 kbps (kilobits per second). Standard: 160 kbps. At 50M concurrent listeners, that's massive bandwidth!",
      importance: 'critical',
      calculation: {
        formula: "50M users × 320 kbps = 16 Terabits/sec",
        result: "~2 TB/second of data transfer",
      },
      learningPoint: "Audio streaming is incredibly bandwidth-intensive compared to typical web apps",
    },
    {
      id: 'latency-playback',
      category: 'latency',
      question: "How fast should a song start playing when a user hits play?",
      answer: "Under 200ms for initial buffering. Users expect instant playback - any delay feels broken.",
      importance: 'critical',
      learningPoint: "Low latency requires CDN edge caching close to users",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How quickly should search results appear?",
      answer: "p99 under 150ms. Search should feel instant as users type.",
      importance: 'important',
      learningPoint: "Metadata search must be extremely fast - separate from audio streaming",
    },
    {
      id: 'audio-quality',
      category: 'quality',
      question: "What audio quality levels should we support?",
      answer: "Multiple bitrates:\n- Low: 96 kbps (mobile data saving)\n- Normal: 160 kbps (default)\n- High: 320 kbps (premium)\n\nAdaptive streaming adjusts based on connection speed.",
      importance: 'important',
      learningPoint: "Different quality = different file sizes = storage multiplication",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-streaming', 'throughput-catalog', 'throughput-bandwidth'],
  criticalFRQuestionIds: ['core-streaming', 'playback-experience'],
  criticalScaleQuestionIds: ['throughput-bandwidth', 'latency-playback', 'throughput-streaming'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can stream songs',
      description: 'Play any song from the catalog instantly with high quality audio',
      emoji: '🎵',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can browse music catalog',
      description: 'Explore songs, albums, artists, and genres',
      emoji: '📚',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can create playlists',
      description: 'Make and manage custom playlists of favorite songs',
      emoji: '📝',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can search',
      description: 'Find songs, albums, and artists by keyword',
      emoji: '🔍',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can download for offline',
      description: 'Premium users can cache songs locally for offline playback',
      emoji: '📥',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 million concurrent listeners',
    writesPerDay: '100K new songs + playlist updates',
    readsPerDay: '1 billion streams',
    peakMultiplier: 3,
    readWriteRatio: '10000:1',
    calculatedWriteRPS: { average: 100, peak: 300 },
    calculatedReadRPS: { average: 11574, peak: 36000 },
    maxPayloadSize: '~4MB (song file)',
    storagePerRecord: '~4MB per song',
    storageGrowthPerYear: '~146TB (new songs)',
    redirectLatencySLA: 'p99 < 200ms (playback start)',
    createLatencySLA: 'p99 < 500ms (metadata)',
  },

  architecturalImplications: [
    '✅ Extremely read-heavy → Aggressive caching + CDN essential',
    '✅ 2TB/sec bandwidth → Need global CDN with edge locations',
    '✅ 400TB+ audio files → Object storage (S3) required, not database',
    '✅ Metadata vs Media → Separate fast DB for metadata from slow blob storage',
    '✅ 36K concurrent streams/sec → Load balancing + horizontal scaling',
  ],

  outOfScope: [
    'Music recommendations (ML)',
    'Social features (collaborative playlists)',
    'Podcasts and audiobooks',
    'Live radio',
    'Music upload (focus on licensed catalog)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can stream songs and browse the catalog. The massive bandwidth challenge and global CDN will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🎵',
  scenario: "Welcome to Music Streaming Co! You're building the next Spotify.",
  hook: "Your first user just signed up. They want to start listening to music!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your music platform is online!',
  achievement: 'Users can now connect to your streaming service',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle music yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every streaming service starts with a **Client** connecting to a **Server**.

When a user opens the Spotify app:
1. Their device (phone, laptop, web browser) is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back responses

For music streaming:
- Client requests song metadata (title, artist, album)
- Client requests audio file URLs
- Client streams audio data`,

  whyItMatters: 'Without this connection, users can\'t access any music or features.',

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Handling 50 million concurrent listeners',
    howTheyDoIt: 'Started with a simple client-server model in 2006, now uses a complex microservices architecture',
  },

  keyPoints: [
    'Client = the user\'s device (app, browser)',
    'App Server = your backend that handles requests',
    'HTTP/HTTPS = the protocol for communication',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device that makes requests', icon: '📱' },
    { title: 'App Server', explanation: 'Your backend that handles business logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'spotify-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Spotify', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles streaming and catalog requests', displayName: 'App Server' },
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
// STEP 2: Implement Core APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to handle music streaming yet!",
  hook: "A user tried to play 'Bohemian Rhapsody' but got a 404 error.",
  challenge: "Write the Python code to browse music and stream songs.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can stream music!',
  achievement: 'You implemented the core Spotify functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can browse catalog', after: '✓' },
    { label: 'Can stream songs', after: '✓' },
    { label: 'Can create playlists', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all the music data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Music Streaming Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that processes requests.

For Spotify, we need handlers for:
- \`browse_catalog()\` - Get list of songs, albums, artists
- \`stream_song()\` - Return audio file URL for playback
- \`create_playlist()\` - Create a new playlist
- \`search_music()\` - Find songs by keyword

For now, we'll store everything in memory (Python dictionaries).

Key concept: **Metadata vs Media**
- Metadata (song title, artist, duration) → Fast database/cache
- Media (actual audio files) → Object storage (later steps)`,

  whyItMatters: 'Without handlers, your server can\'t process any music requests. This is where streaming starts!',

  famousIncident: {
    title: 'Spotify\'s P2P Architecture Problems',
    company: 'Spotify',
    year: '2008-2012',
    whatHappened: 'Early Spotify used peer-to-peer (P2P) architecture where users shared music with each other. It worked but was unreliable, had legal issues, and poor quality control.',
    lessonLearned: 'Spotify eventually moved to centralized streaming with CDN. Start simple with client-server, add complexity later.',
    icon: '🔄',
  },

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Streaming to 50M concurrent users',
    howTheyDoIt: 'API servers handle metadata requests in <100ms. Audio files are served separately from CDN for low latency.',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Separate metadata (fast) from media files (large)',
    'Use in-memory storage initially (database comes next)',
    'Stream endpoint returns file URL, not the audio data itself',
  ],

  quickCheck: {
    question: 'Why do we separate metadata from media files?',
    options: [
      'It\'s easier to code',
      'Metadata needs fast access (DB/cache), media needs massive storage (object store)',
      'It\'s required by law',
      'Metadata is more important',
    ],
    correctIndex: 1,
    explanation: 'Metadata (song info) needs to be queried quickly from a database. Media files (4MB each) need massive, cheap object storage like S3.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'Metadata', explanation: 'Song information (title, artist, duration)', icon: '📋' },
    { title: 'Media', explanation: 'Actual audio file data', icon: '🎵' },
  ],
};

const step2: GuidedStep = {
  id: 'spotify-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Stream songs, FR-2: Browse catalog, FR-3: Create playlists',
    taskDescription: 'Configure APIs and implement Python handlers for music streaming',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/catalog, GET /api/v1/stream, POST /api/v1/playlists APIs',
      'Open the Python tab',
      'Implement browse_catalog(), stream_song(), and create_playlist() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for browse_catalog, stream_song, and create_playlist',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/catalog', 'GET /api/v1/stream', 'POST /api/v1/playlists'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Metadata
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 2 AM. Your server crashed and restarted...",
  hook: "When it came back online, the entire music catalog was GONE! All 100 million songs, vanished.",
  challenge: "Add a database to persist song metadata and user data.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your music catalog is safe forever!',
  achievement: 'Metadata now persists across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Catalog safety', after: '100%' },
  ],
  nextTeaser: "But browsing the catalog is getting slow with millions of songs...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter for Metadata',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval with indexes

For Spotify, we need tables for:
- \`songs\` - Song metadata (title, artist, album, duration, file_url)
- \`artists\` - Artist information
- \`albums\` - Album data
- \`playlists\` - User-created playlists
- \`users\` - User accounts

**Important**: We store metadata in the database, NOT the audio files!
Audio files will go to Object Storage (S3) in a later step.`,

  whyItMatters: 'Imagine losing your entire music catalog metadata because of a server restart. Users couldn\'t find or play any songs!',

  famousIncident: {
    title: 'Apple Music Library Deletion Bug',
    company: 'Apple',
    year: '2016',
    whatHappened: 'A bug in Apple Music caused users\' local music libraries to be deleted without warning. Years of music collections, gone.',
    lessonLearned: 'Persistent storage with proper backups is critical. Never trust volatile storage for user data.',
    icon: '💀',
  },

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Managing 100M songs and 500M users',
    howTheyDoIt: 'Uses PostgreSQL and Cassandra for metadata. Audio files stored separately in Google Cloud Storage.',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Store metadata (song info), not media (audio files)',
    'Use SQL (PostgreSQL) for structured, relational data',
    'Connect App Server to Database for read/write operations',
  ],

  quickCheck: {
    question: 'What data should go in the database vs object storage?',
    options: [
      'Everything in database',
      'Metadata in database, audio files in object storage',
      'Everything in object storage',
      'Audio files in database, metadata in object storage',
    ],
    correctIndex: 1,
    explanation: 'Database: fast queries for metadata (song title, artist). Object Storage (S3): cheap, massive storage for large media files.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'Metadata', explanation: 'Song information, not the audio itself', icon: '📋' },
    { title: 'Relational DB', explanation: 'Structured tables with relationships', icon: '🗄️' },
  ],
};

const step3: GuidedStep = {
  id: 'spotify-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent metadata storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store song metadata, user data, playlists permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Song Metadata
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 10 million users, and browsing the catalog takes 3+ seconds!",
  hook: "Users are complaining: 'Why is Spotify so slow?' Every catalog request hits the database.",
  challenge: "Add a cache to make metadata lookups lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Catalog browsing is 30x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Metadata lookup latency', before: '300ms', after: '10ms' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "But what happens when millions of users stream songs at once?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Speed Up Metadata Access',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

Instead of:
\`\`\`
Request → Database (slow, 100ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1ms) → Database (only if cache miss)
\`\`\`

For Spotify, we cache:
- Popular song metadata (90% of streams are top 10% of songs)
- Album information
- Artist data
- User playlists

The catalog doesn't change much, so caching is extremely effective!`,

  whyItMatters: 'At 12K streams/sec, hitting the database for every metadata request would overwhelm it. Caching is essential.',

  famousIncident: {
    title: 'Spotify Christmas Day Outage',
    company: 'Spotify',
    year: '2013',
    whatHappened: 'On Christmas Day (huge traffic spike from new devices), Spotify went down for hours. Cache stampede overwhelmed databases when caches expired.',
    lessonLearned: 'Cache properly and prepare for traffic spikes. Popular songs should be cache-resident.',
    icon: '🎄',
  },

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Serving metadata for billions of requests',
    howTheyDoIt: 'Uses Redis and Memcached for aggressive metadata caching. Cache hit rate over 95% for song metadata.',
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
    'Cache popular song metadata for instant access',
    'Set reasonable TTL (songs don\'t change often)',
    'Cache hit = instant response, cache miss = fetch from DB',
  ],

  quickCheck: {
    question: 'Why is caching especially effective for music streaming?',
    options: [
      'Music files are small',
      'Popular songs account for most streams - predictable access pattern',
      'Users always listen to new music',
      'Caching is required by law',
    ],
    correctIndex: 1,
    explanation: 'The Pareto Principle: 80% of streams come from 20% of songs. Caching these popular songs gives 95%+ hit rate.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'Hot Data', explanation: 'Frequently accessed data (popular songs)', icon: '🔥' },
  ],
};

const step4: GuidedStep = {
  id: 'spotify-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Browse catalog (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache song metadata for fast lookups', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (3600 seconds)',
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
    level2: 'Connect App Server to Cache. Then click Cache and set TTL to 3600 seconds (1 hour), strategy to cache-aside',
    solutionComponents: [{ type: 'cache', config: { ttl: 3600, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your single app server is maxed out at 100% CPU!",
  hook: "A popular artist just released a new album. Traffic spiked 10x. One server can't handle it.",
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
  nextTeaser: "But we still only have one database instance...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Handle More Concurrent Listeners',
  conceptExplanation: `A **Load Balancer** sits in front of your app servers and distributes incoming requests.

Benefits:
- **No single point of failure** - if one server dies, others keep working
- **Horizontal scaling** - add more servers to handle more users
- **Even distribution** - no single server gets overwhelmed

Common strategies:
- Round-robin: Take turns
- Least connections: Send to least busy server
- Session affinity: Same user goes to same server (for stateful apps)`,

  whyItMatters: 'At peak, Spotify handles 50M concurrent listeners. No single server can handle that alone.',

  famousIncident: {
    title: 'Beyoncé Surprise Album Drop',
    company: 'Apple Music / iTunes',
    year: '2013',
    whatHappened: 'When Beyoncé surprise-dropped her album, iTunes servers crashed from the traffic surge. Millions couldn\'t download.',
    lessonLearned: 'Load balancers are essential for handling unpredictable traffic spikes from viral events.',
    icon: '👑',
  },

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Handling 50M concurrent listeners',
    howTheyDoIt: 'Uses multiple layers of load balancers across global regions to distribute traffic',
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
  id: 'spotify-step-5',
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
// STEP 6: Add Database Replication
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚠️',
  scenario: "Your database crashed for 10 minutes last night. Music stopped for everyone.",
  hook: "Users couldn't play songs, create playlists, or do anything. Social media backlash was brutal.",
  challenge: "Add database replication so a backup is always ready.",
  illustration: 'database-failure',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Database is now fault-tolerant!',
  achievement: 'Replicas provide redundancy and read scaling',
  metrics: [
    { label: 'Database availability', before: '99%', after: '99.99%' },
    { label: 'Read capacity', before: '1x', after: '3x' },
  ],
  nextTeaser: "But we still need to store the actual audio files...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Never Lose Metadata',
  conceptExplanation: `**Replication** copies your data to multiple database servers.

Types:
- **Primary (Leader)**: Handles all writes
- **Replicas (Followers)**: Handle reads, stay in sync with primary

Benefits:
- **High availability**: If primary fails, replica takes over
- **Read scaling**: Distribute reads across replicas
- **Data safety**: Multiple copies of your metadata

For Spotify:
- Primary handles playlist creation, song uploads
- Replicas handle catalog browsing (most traffic is reads)`,

  whyItMatters: 'A single database is a single point of failure. For Spotify\'s 100M song catalog, downtime is unacceptable.',

  famousIncident: {
    title: 'Amazon RDS Multi-AZ Failure',
    company: 'Various AWS customers',
    year: '2011',
    whatHappened: 'AWS had a major outage in one availability zone. Services without multi-AZ replication went down. Those with replication failed over automatically.',
    lessonLearned: 'Replication across availability zones is essential for high availability.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Zero tolerance for catalog data loss',
    howTheyDoIt: 'Uses multi-region database replication. Metadata is replicated across at least 3 different data centers.',
  },

  diagram: `
                         ┌──────────────────┐
                         │  Primary (Write) │
                         └────────┬─────────┘
                                  │ Replication
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
       ┌───────────┐       ┌───────────┐       ┌───────────┐
       │ Replica 1 │       │ Replica 2 │       │ Replica 3 │
       │  (Read)   │       │  (Read)   │       │  (Read)   │
       └───────────┘       └───────────┘       └───────────┘
`,

  keyPoints: [
    'Primary handles writes, replicas handle reads',
    'If primary fails, a replica can be promoted',
    'Read-heavy workloads benefit from read replicas',
    'Use at least 2 replicas for high availability',
  ],

  quickCheck: {
    question: 'Why is database replication especially important for Spotify?',
    options: [
      'It\'s cheaper',
      'Catalog is extremely read-heavy + cannot afford downtime',
      'It\'s required by law',
      'It makes writes faster',
    ],
    correctIndex: 1,
    explanation: 'Spotify has 10000:1 read-to-write ratio. Read replicas scale reads. Plus, catalog metadata must never be lost.',
  },

  keyConcepts: [
    { title: 'Primary', explanation: 'The database that handles writes', icon: '👑' },
    { title: 'Replica', explanation: 'Read-only copy that stays in sync', icon: '📋' },
    { title: 'Failover', explanation: 'Promoting a replica when primary fails', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'spotify-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs need reliable metadata storage',
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
    level2: 'Enable replication and set replicas to 2. This creates read copies of your metadata.',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Object Storage (S3) + CDN for Audio Files
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🎵',
  scenario: "Users are complaining: 'Songs buffer constantly and take forever to start!'",
  hook: "You're serving 4MB audio files directly from your app servers. This is crushing your bandwidth!",
  challenge: "Add Object Storage (S3) for audio files and CDN for global distribution.",
  illustration: 'buffering',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Audio streaming is now blazing fast globally!',
  achievement: 'CDN delivers songs from locations near users',
  metrics: [
    { label: 'Playback start latency', before: '3000ms', after: '<200ms' },
    { label: 'Buffering issues', before: 'Frequent', after: 'Rare' },
    { label: 'Bandwidth costs', after: 'Reduced 80%' },
  ],
  nextTeaser: "But we're way over budget on infrastructure costs...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage + CDN: The Audio Streaming Architecture',
  conceptExplanation: `Storing and serving 400TB of audio files requires special infrastructure.

**Object Storage (S3)**:
- Stores massive amounts of data cheaply
- Each song is an "object" with a unique key
- Not a database - optimized for large files
- Stores multiple bitrates (96kbps, 160kbps, 320kbps)

**CDN (Content Delivery Network)**:
- Caches audio files at edge locations worldwide
- Users download from the closest edge server
- Reduces latency dramatically (Paris user gets Paris server)
- Saves bandwidth costs (CDN is cheaper than origin)

**Flow**:
1. User requests song → App Server returns S3 URL
2. Client requests audio from CDN
3. CDN checks edge cache:
   - Cache hit: Return audio instantly
   - Cache miss: Fetch from S3, cache, return to user

This is how Netflix, YouTube, and Spotify all work!`,

  whyItMatters: 'At 2TB/second of audio traffic, you MUST use CDN. Direct serving would cost millions and be slow.',

  famousIncident: {
    title: 'Spotify\'s Migration from P2P to CDN',
    company: 'Spotify',
    year: '2012-2014',
    whatHappened: 'Spotify migrated from peer-to-peer architecture to centralized CDN streaming. Massive undertaking but improved quality, reliability, and legal compliance.',
    lessonLearned: 'CDN is the industry-standard architecture for media streaming. P2P had too many problems.',
    icon: '🔀',
  },

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Streaming to 50M concurrent users globally',
    howTheyDoIt: 'Uses Google Cloud Storage for audio files + Google Cloud CDN. Audio cached at 100+ edge locations worldwide.',
  },

  diagram: `
User Plays Song
      │
      ▼
┌─────────────┐
│ App Server  │ ──▶ Return: "https://cdn.spotify.com/song123.mp3"
└─────────────┘
      │
      ▼
┌─────────────┐     Cache    ┌───────────┐
│     CDN     │ ───Hit?────▶ │  User's   │
│  (Edge)     │              │  Device   │
└─────────────┘              └───────────┘
      │
      │ Cache Miss
      ▼
┌─────────────┐
│  S3 Bucket  │
│ (400TB of   │
│  audio)     │
└─────────────┘
`,

  keyPoints: [
    'S3 stores audio files cheaply (not in database!)',
    'CDN caches files at edge locations for low latency',
    'App server returns CDN URL, doesn\'t serve audio itself',
    'Popular songs stay cache-resident in CDN',
  ],

  quickCheck: {
    question: 'Why use CDN instead of serving audio directly from app servers?',
    options: [
      'CDN is free',
      'Latency (users get nearest server) + Bandwidth savings + App server offloading',
      'It\'s required by law',
      'CDN has better audio quality',
    ],
    correctIndex: 1,
    explanation: 'CDN edge servers are geographically close to users (low latency), handle bandwidth (saves costs), and offload app servers.',
  },

  keyConcepts: [
    { title: 'Object Storage', explanation: 'Massive, cheap storage for large files (S3)', icon: '🗄️' },
    { title: 'CDN', explanation: 'Global network of edge caches', icon: '🌍' },
    { title: 'Edge Cache', explanation: 'Local copy of popular content', icon: '📦' },
  ],
};

const step7: GuidedStep = {
  id: 'spotify-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-1: Stream songs (now globally fast!)',
    taskDescription: 'Add Object Storage (S3) and CDN for audio file delivery',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store 400TB+ of audio files', displayName: 'S3' },
      { type: 'cdn', reason: 'Deliver audio from edge locations globally', displayName: 'CDN' },
    ],
    successCriteria: [
      'Object Storage (S3) component added',
      'CDN component added',
      'App Server connected to Object Storage',
      'CDN connected to Object Storage',
      'Client connected to CDN (for audio streaming)',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Add Object Storage (S3) and CDN components to the canvas',
    level2: 'Connect: App Server → S3 (for metadata), CDN → S3 (for caching), Client → CDN (for audio streaming)',
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
  scenario: "Finance is panicking! Your monthly cloud bill is $2 million!",
  hook: "The CFO says: 'We're burning cash! Cut infrastructure costs by 40% or we're shutting down.'",
  challenge: "Optimize your architecture to stay profitable while maintaining quality.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Spotify!',
  achievement: 'A globally-scalable, cost-effective music streaming platform',
  metrics: [
    { label: 'Monthly cost', before: '$2M', after: 'Under budget' },
    { label: 'Playback latency', after: '<200ms' },
    { label: 'Catalog availability', after: '99.99%' },
    { label: 'Concurrent listeners', after: '50M+' },
    { label: 'Global coverage', after: '100+ regions' },
  ],
  nextTeaser: "You've mastered music streaming system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Making Streaming Profitable',
  conceptExplanation: `Music streaming has thin margins. Cost optimization is essential for profitability.

**Key strategies**:

1. **Storage Tiering**:
   - Hot data (popular songs): Premium SSD storage + CDN
   - Warm data (less popular): Standard storage
   - Cold data (rarely played): Glacier/archive storage

2. **Smart Caching**:
   - Cache top 10% of songs (covers 80% of streams)
   - Longer TTL for popular content
   - Purge unpopular songs from cache

3. **Adaptive Bitrate**:
   - Don't serve 320kbps to users on slow connections
   - Detect bandwidth, serve appropriate quality
   - Saves massive bandwidth costs

4. **Regional Optimization**:
   - Cache region-specific popular songs
   - Don't cache K-pop in regions where it's unpopular

5. **Reserved Instances**:
   - Commit to long-term infrastructure for discounts
   - 40-60% savings vs on-demand pricing`,

  whyItMatters: 'Spotify pays ~70% of revenue to record labels. The remaining 30% must cover ALL costs AND profit.',

  famousIncident: {
    title: 'Spotify\'s Path to Profitability',
    company: 'Spotify',
    year: '2006-2019',
    whatHappened: 'Spotify operated at a loss for 13 years! Finally became profitable in 2019 by aggressive cost optimization and scale.',
    lessonLearned: 'Cost optimization isn\'t optional - it\'s the difference between survival and bankruptcy.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Serving 200M users profitably',
    howTheyDoIt: 'Aggressive caching, tiered storage, adaptive bitrate, long-term cloud commitments, and efficient encoding (Ogg Vorbis).',
  },

  keyPoints: [
    'Use tiered storage - hot/warm/cold data',
    'Cache aggressively but intelligently',
    'Serve adaptive bitrate based on connection speed',
    'Reserve infrastructure for long-term discounts',
    'Monitor and optimize continuously',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for Spotify?',
    options: [
      'Delete unpopular songs',
      'Smart caching of popular songs (top 10% covers 80% of streams)',
      'Reduce audio quality for everyone',
      'Charge users more',
    ],
    correctIndex: 1,
    explanation: 'The Pareto Principle: 80% of streams are from 20% of songs. Cache those aggressively, serve the rest from S3.',
  },

  keyConcepts: [
    { title: 'Storage Tiering', explanation: 'Hot/warm/cold data in different storage classes', icon: '📊' },
    { title: 'Adaptive Bitrate', explanation: 'Adjust quality based on connection', icon: '📶' },
    { title: 'Smart Caching', explanation: 'Cache what matters, not everything', icon: '🧠' },
  ],
};

const step8: GuidedStep = {
  id: 'spotify-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered profitably',
    taskDescription: 'Optimize your system to stay under $800/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $800/month',
      'Maintain all performance requirements',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component\'s configuration for over-provisioning. Focus on right-sizing.',
    level2: 'Consider: storage tiering, cache size optimization, appropriate instance sizes. CDN costs are per GB.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const spotifyGuidedTutorial: GuidedTutorial = {
  problemId: 'spotify',
  title: 'Design Spotify',
  description: 'Build a global music streaming platform with catalog browsing and audio streaming',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🎵',
    hook: "You've been hired as Lead Engineer at Music Streaming Co!",
    scenario: "Your mission: Build a Spotify-like platform that can stream music to 50 million concurrent listeners worldwide with instant playback.",
    challenge: "Can you design a system that handles massive bandwidth while staying profitable?",
  },

  requirementsPhase: spotifyRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Metadata vs Media Separation',
    'Database Design',
    'Caching',
    'Load Balancing',
    'Database Replication',
    'Object Storage (S3)',
    'Content Delivery Network (CDN)',
    'Audio Streaming',
    'Gapless Playback',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 10: Batch Processing (audio encoding)',
    'Chapter 3: Storage and Retrieval (object storage)',
  ],
};

export default spotifyGuidedTutorial;
