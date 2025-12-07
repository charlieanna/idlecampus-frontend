import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Comprehensive Social Media Platform Guided Tutorial - FR-FIRST EDITION
 *
 * An ADVANCED 12-step tutorial covering ALL social media system design concepts:
 * - Feed generation (fan-out on write, fan-out on read, hybrid)
 * - Timeline aggregation and ranking
 * - Real-time notifications
 * - Content moderation and safety
 * - Real-time features (WebSocket, live updates)
 * - Graph database for social connections
 * - Search and discovery
 * - Media processing pipeline
 * - Analytics and trending
 * - Global distribution
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-4: Build basic working system (FR satisfaction)
 * Steps 5-12: Scale with NFRs (all advanced concepts)
 *
 * Key Concepts:
 * - Fan-out strategies (DDIA Ch. 1)
 * - Real-time messaging (WebSocket)
 * - Content moderation pipeline
 * - Graph database for social graph
 * - Stream processing for analytics
 * - Global CDN and multi-region
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const comprehensiveSocialMediaRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a comprehensive social media platform (like Facebook/Instagram combined)",

  interviewer: {
    name: 'Dr. Alex Rivera',
    role: 'VP of Engineering at Global Social Network Inc.',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What are the main features users expect from a modern social media platform?",
      answer: "Users want a complete social experience:\n\n1. **Post content** - Share text, photos, videos, links\n2. **Follow users** - Build a social graph of connections\n3. **News feed** - See aggregated content from followed users\n4. **Engage** - Like, comment, share posts\n5. **Real-time notifications** - Know when someone interacts with your content\n6. **Direct messaging** - Private conversations\n7. **Discover** - Find new people and trending content\n8. **Stories** - Ephemeral 24-hour content",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-8',
      learningPoint: "Modern social media combines multiple complex systems: feeds, messaging, notifications, media, discovery",
    },
    {
      id: 'feed-generation',
      category: 'functional',
      question: "How should the news feed work? Chronological or algorithmic?",
      answer: "The feed should be **algorithmically ranked** by relevance:\n- Personalized based on user interests and engagement history\n- Prioritize recent content from close connections\n- Surface trending/viral content\n- Filter out low-quality or spam content\n\nFallback to chronological for users with few connections.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Algorithmic feeds are computationally expensive but essential for engagement",
    },
    {
      id: 'content-types',
      category: 'functional',
      question: "What types of content can users post?",
      answer: "Multiple content types:\n1. **Text posts** - Status updates\n2. **Images** - Photos (up to 10 per post)\n3. **Videos** - Short and long-form (up to 10 minutes)\n4. **Links** - URLs with preview cards\n5. **Stories** - 24-hour ephemeral content (images/videos)\n\nAll content supports captions, hashtags, and user mentions.",
      importance: 'critical',
      insight: "Media processing (images/videos) adds significant infrastructure complexity",
    },
    {
      id: 'social-graph',
      category: 'functional',
      question: "What type of social connections do users have?",
      answer: "**Bidirectional friendships** (like Facebook) rather than asymmetric follows (like Twitter):\n- User A sends friend request to User B\n- User B accepts/rejects\n- Once connected, both see each other's content\n- Support for followers only (public figures) comes later",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Bidirectional relationships affect feed generation differently than follows",
    },
    {
      id: 'notifications-realtime',
      category: 'functional',
      question: "How should notifications work? Immediate or batched?",
      answer: "**Real-time push notifications** for important events:\n- Someone likes/comments on your post (instant)\n- Friend request received (instant)\n- New message (instant)\n- Summary notifications for less urgent events (batched)\n\nSupport for web push, mobile push, and in-app notifications.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Real-time notifications require WebSocket or push infrastructure",
    },
    {
      id: 'content-moderation',
      category: 'functional',
      question: "How do you handle inappropriate content?",
      answer: "Multi-layered content moderation:\n1. **Automated filters** - AI/ML models detect harmful content\n2. **User reporting** - Flag content for review\n3. **Human moderation** - Review queue for flagged content\n4. **Proactive scanning** - Check all uploads before posting\n\nRemove policy-violating content and notify/ban users as needed.",
      importance: 'critical',
      revealsRequirement: 'FR-9',
      learningPoint: "Content moderation is critical for platform safety and legal compliance",
    },
    {
      id: 'messaging',
      category: 'clarification',
      question: "Should direct messages support group chats?",
      answer: "Yes, support both 1-on-1 and group messaging:\n- Private conversations between friends\n- Group chats (up to 50 people)\n- Real-time delivery with read receipts\n- Media sharing in messages",
      importance: 'important',
      insight: "Messaging is essentially a separate chat application integrated into the platform",
    },
    {
      id: 'stories-ephemeral',
      category: 'clarification',
      question: "How do Stories differ from regular posts?",
      answer: "Stories are **ephemeral content** that disappears after 24 hours:\n- Automatically deleted after 24h\n- No likes/comments (just views)\n- More casual, less curated than feed posts\n- Appear in a separate Stories feed at the top",
      importance: 'important',
      insight: "Ephemeral content requires TTL-based deletion and separate storage strategy",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "2 billion registered users, 1 billion daily active users (DAU)",
      importance: 'critical',
      learningPoint: "This is Facebook-scale - one of the largest systems on Earth",
    },
    {
      id: 'throughput-posts',
      category: 'throughput',
      question: "How many posts are created per day?",
      answer: "About 500 million posts per day (text, images, videos combined)",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 posts/sec",
        result: "~6K writes/sec (18K at peak)",
      },
      learningPoint: "High write volume, but reads are 100x higher",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many feed views per day?",
      answer: "About 50 billion feed views per day",
      importance: 'critical',
      calculation: {
        formula: "50B ÷ 86,400 sec = 578,703 reads/sec",
        result: "~579K reads/sec (1.7M at peak)",
      },
      learningPoint: "100:1 read-to-write ratio - extreme read pressure",
    },
    {
      id: 'throughput-notifications',
      category: 'throughput',
      question: "How many notifications are sent per day?",
      answer: "About 10 billion notifications per day",
      importance: 'important',
      calculation: {
        formula: "10B ÷ 86,400 sec = 115,740 notifications/sec",
        result: "~116K notifications/sec (350K at peak)",
      },
      learningPoint: "Notification system must handle massive fanout",
    },
    {
      id: 'media-volume',
      category: 'payload',
      question: "How much media storage is needed?",
      answer: "Average 5MB per media post (after compression). With 300M media posts/day:\n- Daily growth: 1.5PB\n- Yearly growth: 550PB\n- Total storage: Multi-exabyte scale",
      importance: 'critical',
      learningPoint: "Media storage dominates infrastructure costs",
    },
    {
      id: 'latency-feed',
      category: 'latency',
      question: "How fast should the feed load?",
      answer: "p99 under 300ms for feed load. Users expect instant scrolling.",
      importance: 'critical',
      learningPoint: "Sub-second feed generation at massive scale requires sophisticated caching",
    },
    {
      id: 'latency-notifications',
      category: 'latency',
      question: "How quickly should notifications arrive?",
      answer: "Real-time delivery (< 1 second) for critical notifications. Batched notifications can be delayed up to 5 minutes.",
      importance: 'important',
      learningPoint: "Real-time requires WebSocket or Server-Sent Events",
    },
    {
      id: 'celebrity-fanout',
      category: 'burst',
      question: "What happens when a celebrity with 100M friends posts?",
      answer: "That single post needs to appear in 100M feeds! This is the extreme fan-out problem. We need a hybrid approach:\n- Fan-out on write for normal users (< 10K friends)\n- Fan-out on read for celebrities (> 10K friends)\n- Hybrid merging at read time",
      importance: 'critical',
      insight: "The hybrid fan-out strategy is THE key architectural decision",
    },
    {
      id: 'content-safety',
      category: 'compliance',
      question: "What are the latency requirements for content moderation?",
      answer: "Harmful content must be detected and removed within:\n- Automated: < 1 second for posting\n- Human review: < 15 minutes for flagged content\n- CSAM (illegal content): < 1 second, with reporting to authorities",
      importance: 'critical',
      learningPoint: "Content moderation is both a legal requirement and user safety imperative",
    },
  ],

  minimumQuestionsRequired: 4,
  criticalQuestionIds: ['core-features', 'feed-generation', 'celebrity-fanout', 'content-moderation'],
  criticalFRQuestionIds: ['core-features', 'feed-generation', 'social-graph'],
  criticalScaleQuestionIds: ['throughput-reads', 'celebrity-fanout', 'latency-feed', 'media-volume'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can connect with friends',
      description: 'Send/accept friend requests, build social graph',
      emoji: '👥',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can view personalized news feed',
      description: 'Algorithmically ranked content from friends',
      emoji: '📰',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can post content',
      description: 'Share text, images, videos, links',
      emoji: '📝',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can engage with posts',
      description: 'Like, comment, share content',
      emoji: '❤️',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users receive real-time notifications',
      description: 'Instant alerts for important events',
      emoji: '🔔',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Users can message friends',
      description: 'Direct and group messaging',
      emoji: '💬',
    },
    {
      id: 'fr-7',
      text: 'FR-7: Users can discover content',
      description: 'Search, trending topics, suggestions',
      emoji: '🔍',
    },
    {
      id: 'fr-8',
      text: 'FR-8: Users can post Stories',
      description: '24-hour ephemeral content',
      emoji: '⏰',
    },
    {
      id: 'fr-9',
      text: 'FR-9: Platform moderates harmful content',
      description: 'Automated and human content review',
      emoji: '🛡️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1 billion',
    writesPerDay: '500 million posts',
    readsPerDay: '50 billion feed views',
    peakMultiplier: 3,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 5787, peak: 17361 },
    calculatedReadRPS: { average: 578703, peak: 1736109 },
    maxPayloadSize: '~5MB (media post)',
    storagePerRecord: '~2KB metadata + 5MB media avg',
    storageGrowthPerYear: '~550PB',
    redirectLatencySLA: 'p99 < 300ms (feed)',
    createLatencySLA: 'p99 < 1s (post)',
  },

  architecturalImplications: [
    '✅ Read-heavy (100:1) → Aggressive multi-layer caching required',
    '✅ 1.7M reads/sec peak → Massive horizontal scaling + CDN',
    '✅ Celebrity fan-out problem → HYBRID fan-out strategy (write + read)',
    '✅ 550PB/year media → Object storage + tiered storage + CDN',
    '✅ Real-time notifications → WebSocket servers + message queue',
    '✅ Content moderation → ML pipeline + human review queue',
    '✅ 1B DAU → Global multi-region deployment',
    '✅ Social graph queries → Graph database (Neo4j) for friend connections',
  ],

  outOfScope: [
    'Advertising platform',
    'Marketplace',
    'Events/Groups',
    'Live video streaming',
    'Dating features',
    'Games/Apps integration',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can post and view feeds. The complexity of hybrid fan-out, real-time notifications, content moderation, and global distribution comes in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🌐',
  scenario: "Welcome to Global Social Network Inc! You're building the next Facebook.",
  hook: "Your first user just signed up. They're ready to connect with friends and share their life!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your social platform is online!',
  achievement: 'Users can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server is empty... let's write some code to handle social features!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every social media platform starts with a **Client** connecting to a **Server**.

When a user opens your app:
1. Their device (phone, laptop, tablet) is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back a response

This is the foundation of ALL web applications - from Facebook to TikTok!`,

  whyItMatters: 'Without this connection, users can\'t interact with your platform at all. This is day 1.',

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Serving 1 billion daily active users',
    howTheyDoIt: 'Started with a simple LAMP stack in 2004, now uses thousands of servers globally with custom protocols',
  },

  keyPoints: [
    'Client = the user\'s device (browser, mobile app)',
    'App Server = your backend that processes all requests',
    'HTTP/HTTPS = the protocol for communication',
    'Start simple - we\'ll scale later',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device that makes requests', icon: '📱' },
    { title: 'App Server', explanation: 'Your backend that handles all logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'social-media-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing the platform', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles posts, feeds, messages, notifications', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle social features yet!",
  hook: "A user just tried to post 'Hello World!' but got an error. The server has no handlers!",
  challenge: "Write the Python code to create posts, manage friends, and generate feeds.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle social interactions!',
  achievement: 'You implemented the core social media functionality',
  metrics: [
    { label: 'APIs implemented', after: '5' },
    { label: 'Can create posts', after: '✓' },
    { label: 'Can add friends', after: '✓' },
    { label: 'Can generate feed', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Social Media Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For a social media platform, we need handlers for:
- \`create_post()\` - Share content with friends
- \`add_friend()\` - Send/accept friend requests
- \`get_feed()\` - Fetch personalized content feed
- \`like_post()\` - Engage with content
- \`comment_post()\` - Add comments

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just a fancy paperweight. This is where social magic happens!',

  famousIncident: {
    title: 'Facebook\'s First Viral Moment',
    company: 'Facebook',
    year: '2004',
    whatHappened: 'When Facebook launched at Harvard, the simple Python/PHP handlers couldn\'t keep up with demand. The site crashed repeatedly as students rushed to join.',
    lessonLearned: 'Start with simple, working code. Scale it later when you have users to serve.',
    icon: '🎓',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Processing 500M posts per day',
    howTheyDoIt: 'Uses a complex microservices architecture with different services for posts, feeds, messaging, etc.',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle friend relationships bidirectionally',
    'Feed generation: aggregate posts from all friends',
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
    { title: 'Feed Generation', explanation: 'Aggregating content from connections', icon: '📰' },
  ],
};

const step2: GuidedStep = {
  id: 'social-media-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Connect with friends, FR-2: View feed, FR-3: Create posts',
    taskDescription: 'Configure APIs and implement Python handlers for core social features',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/posts, POST /api/v1/friends, GET /api/v1/feed APIs',
      'Open the Python tab',
      'Implement create_post(), add_friend(), and get_feed() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for create_post, add_friend, and get_feed',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/posts', 'POST /api/v1/friends', 'GET /api/v1/feed'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Persistent Storage
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! The server crashed last night during a deployment...",
  hook: "When it came back online, ALL posts, friendships, and data were GONE! Users are furious.",
  challenge: "Add a database so data survives server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your data is safe forever!',
  achievement: 'Data now persists across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But feed generation is getting slow as we grow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval
- **ACID properties**: Consistency guarantees

For our social platform, we need tables for:
- \`users\` - User accounts and profiles
- \`posts\` - All shared content
- \`friendships\` - Bidirectional friend relationships
- \`likes\` - Post engagements
- \`comments\` - Post discussions`,

  whyItMatters: 'Imagine losing all your photos and connections because of a server restart. Users would never trust your platform again!',

  famousIncident: {
    title: 'Friendster Data Loss',
    company: 'Friendster',
    year: '2011',
    whatHappened: 'During their transition to a gaming platform, Friendster lost most of their social network data. Years of user photos, posts, and connections - gone.',
    lessonLearned: 'Persistent storage with proper backups is absolutely non-negotiable for social platforms.',
    icon: '💀',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Storing 500M posts per day',
    howTheyDoIt: 'Uses MySQL for social graph, TAO for distributed data access, and custom storage systems for different data types',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL) for structured social data',
    'Connect App Server to Database for read/write operations',
    'Use foreign keys to maintain relationship integrity',
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
  id: 'social-media-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store users, posts, friendships, likes, comments permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Graph Database for Social Connections
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🕸️',
  scenario: "You now have 10 million users and complex social graphs!",
  hook: "Friend-of-friend queries (like 'People You May Know') are taking 30 seconds! SQL joins are too slow.",
  challenge: "Add a graph database optimized for social connections.",
  illustration: 'slow-queries',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Social graph queries are 100x faster!',
  achievement: 'Graph database optimized for relationship queries',
  metrics: [
    { label: 'Friend-of-friend query', before: '30s', after: '300ms' },
    { label: 'Connection degree queries', after: 'Instant' },
  ],
  nextTeaser: "But the feed is still loading slowly...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Graph Databases: Built for Social Networks',
  conceptExplanation: `Traditional SQL databases struggle with deep relationship queries.

**Graph databases** (like Neo4j) are optimized for:
- **Friend connections** - Who knows whom
- **Friend-of-friend** - "People You May Know"
- **Degrees of separation** - How connected are two users
- **Shortest path** - Connection chain between users
- **Community detection** - Friend groups

Instead of expensive SQL JOINs:
\`\`\`sql
SELECT * FROM users u
JOIN friendships f1 ON u.id = f1.user_id
JOIN friendships f2 ON f1.friend_id = f2.user_id
WHERE f2.friend_id = ? AND f1.user_id != ?
\`\`\`

You get native graph queries:
\`\`\`cypher
MATCH (me:User)-[:FRIEND]->(friend)-[:FRIEND]->(fof:User)
WHERE me.id = $userId
RETURN fof
\`\`\``,

  whyItMatters: 'At 1B users with avg 150 friends, social graph queries must be fast for features like friend suggestions.',

  famousIncident: {
    title: 'LinkedIn\'s Graph Search Crisis',
    company: 'LinkedIn',
    year: '2012',
    whatHappened: 'LinkedIn\'s SQL-based connection queries couldn\'t scale. They built a custom graph database to power "People You May Know" and network analytics.',
    lessonLearned: 'Use the right database for the job. Graphs need graph databases.',
    icon: '💼',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Managing social graph for 3B users',
    howTheyDoIt: 'Built TAO (The Associations and Objects) - a custom distributed graph store optimized for social graph queries',
  },

  diagram: `
Traditional SQL (slow):
Users ─JOIN→ Friendships ─JOIN→ Users ─JOIN→ Friendships
(Multiple expensive table scans)

Graph Database (fast):
User ─FRIEND→ User ─FRIEND→ User
(Native graph traversal)
`,

  keyPoints: [
    'Graph databases optimize relationship traversal',
    'Use Neo4j for social graph queries',
    'PostgreSQL still stores post/user data',
    'Sync friendships to both databases',
  ],

  quickCheck: {
    question: 'Why use a separate graph database instead of SQL for social connections?',
    options: [
      'Graph databases are newer',
      'Graph traversal is orders of magnitude faster than JOINs',
      'Graph databases are cheaper',
      'SQL can\'t store relationships',
    ],
    correctIndex: 1,
    explanation: 'Graph databases use pointer-based traversal (O(1) per hop) vs SQL JOINs (O(n) table scans).',
  },

  keyConcepts: [
    { title: 'Graph Database', explanation: 'Optimized for relationship queries', icon: '🕸️' },
    { title: 'Traversal', explanation: 'Following connections through graph', icon: '🚶' },
    { title: 'Degrees of Separation', explanation: 'Friendship distance between users', icon: '🔗' },
  ],
};

const step4: GuidedStep = {
  id: 'social-media-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Connect with friends (now with fast graph queries)',
    taskDescription: 'Add a Graph Database for social connections',
    componentsNeeded: [
      { type: 'graph_database', reason: 'Optimize friend-of-friend and social graph queries', displayName: 'Neo4j' },
    ],
    successCriteria: [
      'Graph Database component added',
      'App Server connected to Graph Database',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'graph_database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'graph_database' },
    ],
  },

  hints: {
    level1: 'Drag a Graph Database (Neo4j) onto the canvas',
    level2: 'Connect App Server to Graph Database for fast social graph queries',
    solutionComponents: [{ type: 'graph_database' }],
    solutionConnections: [{ from: 'app_server', to: 'graph_database' }],
  },
};

// =============================================================================
// STEP 5: Add Cache for Fast Feed Generation
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 50 million users, and feeds are loading in 5+ seconds!",
  hook: "Users are complaining: 'Why is the feed so slow?' Every request recalculates the entire feed from scratch.",
  challenge: "Add a cache to store pre-computed feeds.",
  illustration: 'slow-loading',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Feeds load 50x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Feed latency', before: '5000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '98%' },
  ],
  nextTeaser: "But what happens during traffic spikes?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

For social media, we cache:
- **User feeds** - Pre-computed list of posts (expensive to generate)
- **Post content** - Full post details with likes/comments count
- **User profiles** - Profile information
- **Friend lists** - Cached social graph data

Instead of:
\`\`\`
Request → Query all friends → Fetch all their posts → Sort by algorithm → Return (5s)
\`\`\`

You get:
\`\`\`
Request → Cache (instant, 100ms) → Pre-computed feed
\`\`\``,

  whyItMatters: 'At 1.7M reads/sec peak, hitting the database for every feed request would melt it. Caching is essential.',

  famousIncident: {
    title: 'Facebook Cache Stampede',
    company: 'Facebook',
    year: '2010',
    whatHappened: 'When memcached servers restarted during a deploy, millions of requests simultaneously hit the database, causing a cascading failure that took down the entire site for hours.',
    lessonLearned: 'Cache warming, graceful degradation, and never expiring all caches at once are critical.',
    icon: '🏃',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Serving 50 billion feed views per day',
    howTheyDoIt: 'Uses massive Memcached clusters to cache feeds, posts, and profiles. Most feed reads never touch the database.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (98% of requests)
                     │   Return instantly!
`,

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache pre-computed feeds (not raw data)',
    'Set TTL to 60 seconds - feeds update every minute',
    'Cache invalidation when new posts arrive',
  ],

  quickCheck: {
    question: 'What happens during a cache miss?',
    options: [
      'Return an error to the user',
      'Fetch from database, compute feed, store in cache',
      'Wait for cache to be populated',
      'Redirect to backup server',
    ],
    correctIndex: 1,
    explanation: 'On cache miss: fetch from DB, compute feed, return to user, AND store in cache for next time.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step5: GuidedStep = {
  id: 'social-media-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: View personalized feed (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache pre-computed feeds for fast reads', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (60 seconds)',
      'Cache strategy set (cache-aside)',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'graph_database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'graph_database' },
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
// STEP 6: Add Load Balancer and Horizontal Scaling
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your platform went viral! Traffic spiked 20x in an hour.",
  hook: "Your single app server is maxed out at 100% CPU. Requests are timing out. Users can't log in!",
  challenge: "Add a load balancer and scale horizontally.",
  illustration: 'server-overload',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Traffic is now distributed and scalable!',
  achievement: 'Load balancer + horizontal scaling handles viral growth',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'App Server instances', before: '1', after: '10+' },
    { label: 'Can handle', before: '10K req/s', after: '1M+ req/s' },
  ],
  nextTeaser: "But what about celebrity users with millions of friends?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing and Horizontal Scaling',
  conceptExplanation: `A **Load Balancer** distributes incoming requests across multiple servers.

**Horizontal scaling** = adding more servers (scale out)
**Vertical scaling** = upgrading a single server (scale up)

Benefits of horizontal scaling:
- **No upper limit** - keep adding servers as needed
- **No single point of failure** - if one server dies, others keep working
- **Cost effective** - many cheap servers > one expensive server

For social media at 1.7M requests/sec peak:
- Start with 10+ app server instances
- Auto-scale based on traffic patterns
- Load balancer uses round-robin or least-connections`,

  whyItMatters: 'At Facebook-scale, you need thousands of servers working together. Horizontal scaling is the only way.',

  famousIncident: {
    title: 'Instagram Goes Down at Super Bowl',
    company: 'Instagram',
    year: '2015',
    whatHappened: 'During the Super Bowl, traffic spiked 10x instantly. Their auto-scaling couldn\'t spin up servers fast enough. The site was slow for 30 minutes.',
    lessonLearned: 'Pre-warm capacity for predictable spikes. Auto-scaling has delays.',
    icon: '🏈',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Handling global traffic',
    howTheyDoIt: 'Runs tens of thousands of app servers across multiple data centers. Auto-scales aggressively and pre-warms for major events.',
  },

  diagram: `
                    ┌─────────────────────────┐
                    │     Load Balancer       │
                    └───────────┬─────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
  ┌───────────┐           ┌───────────┐           ┌───────────┐
  │App Server │           │App Server │    ...    │App Server │
  │ Instance 1│           │ Instance 2│           │ Instance 10│
  └───────────┘           └───────────┘           └───────────┘
        │                       │                       │
        └───────────────────────┴───────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │  Shared Cache & DBs   │
                    └───────────────────────┘
`,

  keyPoints: [
    'Load balancer distributes requests across app servers',
    'Add more instances to handle more traffic',
    'All instances share the same cache and databases',
    'Stateless servers are easier to scale',
  ],

  quickCheck: {
    question: 'Why is horizontal scaling better than vertical for social media?',
    options: [
      'It\'s always faster',
      'No practical upper limit - can grow indefinitely',
      'It\'s easier to implement',
      'It uses less resources',
    ],
    correctIndex: 1,
    explanation: 'Vertical scaling has a ceiling (biggest available server). Horizontal scaling can grow to thousands of servers.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers', icon: '↔️' },
    { title: 'Stateless', explanation: 'Servers don\'t store user sessions', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'social-media-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing and scaling',
    taskDescription: 'Add Load Balancer and scale App Server to multiple instances',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
      'App Server instances set to 5 or more',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'graph_database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'graph_database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Add Load Balancer between Client and App Server, then scale App Server',
    level2: 'Reconnect: Client → Load Balancer → App Server. Click App Server and set instances to 5+',
    solutionComponents: [
      { type: 'load_balancer' },
      { type: 'app_server', config: { instances: 5 } },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Message Queue for Hybrid Fan-Out
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🌟',
  scenario: "A celebrity with 100 million friends just posted!",
  hook: "Updating 100M feeds synchronously would take hours. Normal users' feeds are delayed. The system is choking!",
  challenge: "Implement hybrid fan-out: write for normal users, read for celebrities.",
  illustration: 'celebrity-post',
};

const step7Celebration: CelebrationContent = {
  emoji: '📨',
  message: 'Hybrid fan-out works perfectly!',
  achievement: 'Celebrity posts and normal posts both handled efficiently',
  metrics: [
    { label: 'Normal user post fanout', after: '<1s' },
    { label: 'Celebrity post fanout', after: 'On-demand (instant for users)' },
    { label: 'Feed generation', after: 'Hybrid merge' },
  ],
  nextTeaser: "But users want real-time notifications...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Hybrid Fan-Out: The Facebook Solution',
  conceptExplanation: `The **fan-out problem** is social media's biggest challenge:
- When you post, it needs to appear in all your friends' feeds
- A celebrity with 100M friends = 100M feed updates

**Three approaches:**

1. **Fan-out on Write** (push):
   - Pre-compute: When you post, push to all friends' feeds
   - ✅ Read is instant (just fetch pre-computed feed)
   - ❌ Write is slow for celebrities (millions of updates)

2. **Fan-out on Read** (pull):
   - Compute on demand: When user requests feed, fetch from all friends
   - ✅ Write is instant (just store the post)
   - ❌ Read is slow (query many users)

3. **Hybrid** (Facebook's approach):
   - Normal users (< 5K friends): Fan-out on write
   - Celebrities (> 5K friends): Fan-out on read
   - Merge both at read time

This is the ONLY way to handle both efficiently!`,

  whyItMatters: 'Without hybrid fan-out, either celebrity posts are slow or normal users suffer. This is THE key architectural decision.',

  famousIncident: {
    title: 'Twitter Fan-Out Failure',
    company: 'Twitter',
    year: '2012',
    whatHappened: 'When Lady Gaga tweeted to 20M followers, the fan-out on write system caused cascading failures. Site went down. They switched to hybrid.',
    lessonLearned: 'One-size-fits-all doesn\'t work at scale. Hybrid strategies are essential.',
    icon: '👸',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Handling posts from users with 1 friend to 100M friends',
    howTheyDoIt: 'Uses hybrid fan-out: push for normal users, pull for celebrities, merge in feed generation service',
  },

  diagram: `
Normal User Posts:
      │
      ▼
┌─────────────┐     ┌─────────────────────┐
│ App Server  │────▶│   Message Queue     │
└─────────────┘     │  (fan-out workers)  │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
        ┌─────────┐      ┌─────────┐      ┌─────────┐
        │Friend 1 │      │Friend 2 │      │Friend N │
        │  Feed   │      │  Feed   │      │  Feed   │
        └─────────┘      └─────────┘      └─────────┘

Celebrity Posts:
      │
      ▼
┌─────────────┐     ┌──────────────┐
│ App Server  │────▶│   Database   │ (just store)
└─────────────┘     └──────────────┘

User Feed Request:
      │
      ▼
┌─────────────┐     Merge both:
│ App Server  │────▶ Pre-computed feed (normal friends)
└─────────────┘     + On-demand fetch (celebrity friends)
`,

  keyPoints: [
    'Message queue handles async fan-out for normal users',
    'Celebrity posts stored without fanout',
    'Feed generation merges both sources',
    'Threshold: 5K friends = switch to pull model',
  ],

  quickCheck: {
    question: 'Why does hybrid fan-out work better than pure push or pull?',
    options: [
      'It uses less storage',
      'It optimizes for both common case (normal users) and edge case (celebrities)',
      'It\'s easier to implement',
      'It\'s faster in all cases',
    ],
    correctIndex: 1,
    explanation: 'Most users have < 1K friends (push is fast). Few users have millions (pull is necessary). Hybrid handles both.',
  },

  keyConcepts: [
    { title: 'Fan-Out on Write', explanation: 'Pre-compute feeds (push)', icon: '✍️' },
    { title: 'Fan-Out on Read', explanation: 'Compute on demand (pull)', icon: '📖' },
    { title: 'Hybrid Fan-Out', explanation: 'Best of both worlds', icon: '🔀' },
  ],
};

const step7: GuidedStep = {
  id: 'social-media-step-7',
  stepNumber: 7,
  frIndex: 2,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-3: Post content (now with hybrid fan-out)',
    taskDescription: 'Add a Message Queue for hybrid fan-out processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle async fan-out for normal users', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'graph_database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'graph_database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables hybrid fan-out processing.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Add WebSocket Server for Real-Time Notifications
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🔔',
  scenario: "Users are complaining: 'I don't know when people interact with my posts!'",
  hook: "Notifications arrive 5 minutes late. Users refresh constantly. They want REAL-TIME updates!",
  challenge: "Add WebSocket servers for instant push notifications.",
  illustration: 'delayed-notifications',
};

const step8Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Notifications are instant!',
  achievement: 'Real-time WebSocket delivery for all notifications',
  metrics: [
    { label: 'Notification latency', before: '5min', after: '<1s' },
    { label: 'Active WebSocket connections', after: '10M+' },
    { label: 'User engagement', after: '+40%' },
  ],
  nextTeaser: "But we're uploading tons of images and videos...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Real-Time Notifications with WebSocket',
  conceptExplanation: `Traditional HTTP is **request-response**: client asks, server responds.

**WebSocket** is a **bidirectional** persistent connection:
- Client opens WebSocket connection to server
- Connection stays open (unlike HTTP)
- Server can **push** data to client anytime
- Perfect for real-time notifications

Architecture:
1. User connects → WebSocket server
2. When someone likes their post → App server publishes to message queue
3. Notification worker processes event
4. Worker pushes to WebSocket server
5. WebSocket server sends to connected users (instant!)

For 1B DAU with 10M concurrent users:
- Need dedicated WebSocket server cluster
- Stateful connections (unlike stateless app servers)
- Connection registry in Redis`,

  whyItMatters: 'Real-time notifications are table stakes for modern social media. Users expect instant feedback.',

  famousIncident: {
    title: 'WhatsApp Notification Meltdown',
    company: 'WhatsApp',
    year: '2017',
    whatHappened: 'A bug in their notification system sent duplicate alerts to millions. Users received 100s of notifications in minutes. Had to restart servers.',
    lessonLearned: 'Real-time systems are complex. Careful state management and testing required.',
    icon: '📱',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Sending 10B+ notifications per day',
    howTheyDoIt: 'Uses custom push infrastructure with WebSocket for web, APNs for iOS, FCM for Android. Distributed across regions.',
  },

  diagram: `
Event: User A likes User B's post
                    │
                    ▼
            ┌───────────────┐
            │  App Server   │
            └───────┬───────┘
                    │ Publish event
                    ▼
            ┌───────────────┐
            │ Message Queue │
            └───────┬───────┘
                    │ Workers consume
                    ▼
        ┌───────────────────────┐
        │ Notification Worker   │
        └───────────┬───────────┘
                    │ Push to User B
                    ▼
        ┌───────────────────────┐       WebSocket
        │ WebSocket Server      │◀─────────────▶ User B (connected)
        └───────────────────────┘                 (instant delivery!)
`,

  keyPoints: [
    'WebSocket enables real-time bidirectional communication',
    'Dedicated WebSocket server cluster (stateful)',
    'Message queue routes notifications to right servers',
    'Connection registry tracks which user on which server',
  ],

  quickCheck: {
    question: 'Why use WebSocket instead of polling (repeatedly checking for updates)?',
    options: [
      'WebSocket is newer technology',
      'WebSocket is bidirectional and doesn\'t waste resources on empty polls',
      'Polling doesn\'t work',
      'WebSocket is cheaper',
    ],
    correctIndex: 1,
    explanation: 'Polling makes millions of useless requests. WebSocket holds one connection and pushes when needed.',
  },

  keyConcepts: [
    { title: 'WebSocket', explanation: 'Persistent bidirectional connection', icon: '🔌' },
    { title: 'Server Push', explanation: 'Server sends data without request', icon: '📤' },
    { title: 'Real-Time', explanation: 'Instant delivery (< 1 second)', icon: '⚡' },
  ],
};

const step8: GuidedStep = {
  id: 'social-media-step-8',
  stepNumber: 8,
  frIndex: 4,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-5: Real-time notifications',
    taskDescription: 'Add WebSocket server for instant push notifications',
    componentsNeeded: [
      { type: 'websocket_server', reason: 'Handle real-time bidirectional connections', displayName: 'WebSocket Server' },
    ],
    successCriteria: [
      'WebSocket Server component added',
      'Load Balancer connected to WebSocket Server',
      'WebSocket Server connected to Message Queue',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'graph_database', 'cache', 'message_queue', 'websocket_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'load_balancer', toType: 'websocket_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'graph_database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'websocket_server', toType: 'message_queue' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Add WebSocket Server and connect it to both Load Balancer and Message Queue',
    level2: 'WebSocket Server receives push events from queue and delivers to connected clients',
    solutionComponents: [{ type: 'websocket_server' }],
    solutionConnections: [
      { from: 'load_balancer', to: 'websocket_server' },
      { from: 'websocket_server', to: 'message_queue' },
    ],
  },
};

// =============================================================================
// STEP 9: Add Object Storage and CDN for Media
// =============================================================================

const step9Story: StoryContent = {
  emoji: '📸',
  scenario: "Users are uploading millions of photos and videos every hour!",
  hook: "Your database is choking on 5MB image blobs. Storage costs are exploding. Images load slowly worldwide.",
  challenge: "Add object storage for media and CDN for global delivery.",
  illustration: 'media-overload',
};

const step9Celebration: CelebrationContent = {
  emoji: '☁️',
  message: 'Media storage and delivery optimized!',
  achievement: 'Object storage + CDN handles unlimited media at global scale',
  metrics: [
    { label: 'Media storage', after: 'Unlimited (S3)' },
    { label: 'Global image latency', before: '2s', after: '50ms' },
    { label: 'Storage cost', after: '-70%' },
  ],
  nextTeaser: "But we need to ensure content is safe...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Media Storage and Global CDN',
  conceptExplanation: `Storing media in databases is a terrible idea:
- Databases are expensive for binary data
- Queries slow down
- No geographic distribution

**Object Storage** (S3):
- Store images, videos cheaply
- Unlimited capacity
- Pay per GB
- Metadata in database, files in S3

**CDN** (CloudFront):
- Cache media at edge locations worldwide
- Users download from nearest server
- Drastically reduces latency

Architecture:
1. User uploads photo → App server
2. App server → Object storage (S3)
3. Save metadata + URL in database
4. CDN caches popular content globally
5. Users fetch from CDN edge (fast!)`,

  whyItMatters: 'With 1.5PB uploaded daily and global users, object storage + CDN are essential.',

  famousIncident: {
    title: 'Instagram\'s AWS Outage',
    company: 'Instagram',
    year: '2017',
    whatHappened: 'An AWS S3 outage in us-east-1 took down Instagram for 4 hours. All photo uploads and many views failed.',
    lessonLearned: 'Multi-region object storage and CDN redundancy are critical.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Storing 100B+ photos, 1.5PB uploaded daily',
    howTheyDoIt: 'Uses Facebook\'s custom storage (Haystack) + multi-CDN strategy (Akamai, CloudFlare) for global delivery',
  },

  diagram: `
Photo Upload:
User → App Server → Object Storage (S3)
                  → Database (save URL + metadata)

Photo View:
User → CDN Edge (cache) → Object Storage (origin)
       (99% cache hit)       (1% cache miss)

Global CDN:
┌───────────┐     ┌───────────┐     ┌───────────┐
│  US Edge  │     │ EU Edge   │     │ Asia Edge │
│  (cache)  │     │  (cache)  │     │  (cache)  │
└─────┬─────┘     └─────┬─────┘     └─────┬─────┘
      └─────────────────┴─────────────────┘
                        │
                ┌───────────────┐
                │ Object Storage│
                │   (origin)    │
                └───────────────┘
`,

  keyPoints: [
    'Object storage for media files, database for metadata',
    'Store photo URL in database, actual file in S3',
    'CDN caches popular content at edges globally',
    'Tiered storage: hot (recent) vs cold (old) content',
  ],

  quickCheck: {
    question: 'Why not store photos directly in the database?',
    options: [
      'Databases can\'t store binary data',
      'It\'s too slow and expensive; databases aren\'t optimized for large files',
      'It would violate privacy laws',
      'Photos must be public',
    ],
    correctIndex: 1,
    explanation: 'Databases CAN store binary, but it kills performance. Object storage is purpose-built for files.',
  },

  keyConcepts: [
    { title: 'Object Storage', explanation: 'S3-style blob storage for media', icon: '🗄️' },
    { title: 'CDN', explanation: 'Content Delivery Network for global caching', icon: '🌐' },
    { title: 'Edge Caching', explanation: 'Serve from geographically close servers', icon: '📍' },
  ],
};

const step9: GuidedStep = {
  id: 'social-media-step-9',
  stepNumber: 9,
  frIndex: 2,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-3: Post content (now with media support)',
    taskDescription: 'Add Object Storage and CDN for media files',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store photos and videos at scale', displayName: 'S3 Object Storage' },
      { type: 'cdn', reason: 'Deliver media globally with low latency', displayName: 'CloudFront CDN' },
    ],
    successCriteria: [
      'Object Storage component added',
      'CDN component added',
      'App Server connected to Object Storage',
      'CDN connected to Object Storage (origin)',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'graph_database', 'cache', 'message_queue', 'websocket_server', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'load_balancer', toType: 'websocket_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'graph_database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'websocket_server', toType: 'message_queue' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Add Object Storage and CDN. Connect App Server → Object Storage and CDN → Object Storage',
    level2: 'Object Storage is the origin, CDN caches and delivers media globally',
    solutionComponents: [{ type: 'object_storage' }, { type: 'cdn' }],
    solutionConnections: [
      { from: 'app_server', to: 'object_storage' },
      { from: 'cdn', to: 'object_storage' },
    ],
  },
};

// =============================================================================
// STEP 10: Add ML Pipeline for Content Moderation
// =============================================================================

const step10Story: StoryContent = {
  emoji: '🛡️',
  scenario: "Harmful content is being posted! Spam, hate speech, inappropriate images...",
  hook: "You're getting legal threats. Users are leaving due to toxic content. You need automated moderation NOW!",
  challenge: "Add ML pipeline for automated content moderation and safety.",
  illustration: 'content-violation',
};

const step10Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Platform is safe and compliant!',
  achievement: 'AI-powered content moderation protects users',
  metrics: [
    { label: 'Harmful content detected', after: '<1s' },
    { label: 'Accuracy', after: '98%' },
    { label: 'Manual review queue', after: '95% reduction' },
  ],
  nextTeaser: "But users want to discover trending content...",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Content Moderation with ML Pipeline',
  conceptExplanation: `Content moderation is both a legal requirement and moral imperative.

**Multi-layer approach:**

1. **Client-side filtering**: Block obvious violations before upload
2. **ML models**: Classify content automatically
   - Text: Hate speech, spam, harassment detection
   - Images: NSFW, violence, CSAM detection
   - Videos: Sample frames + audio analysis
3. **Human review**: Flagged content goes to moderators
4. **User reporting**: Community flags content

**Pipeline:**
Upload → ML analysis (< 1s) → Auto-block or auto-approve or queue for review

Models:
- Pre-trained: Use services like AWS Rekognition, Google Vision API
- Custom: Train on your platform's data
- Continuously retrain: Adversaries adapt

Critical: CSAM (illegal content) must be detected instantly and reported to authorities.`,

  whyItMatters: 'Without moderation, your platform becomes toxic, illegal content spreads, and you face legal liability.',

  famousIncident: {
    title: 'YouTube Ad Crisis',
    company: 'YouTube',
    year: '2017',
    whatHappened: 'Ads appeared on extremist content. Major brands pulled advertising. YouTube lost billions. They massively expanded ML-based content moderation.',
    lessonLearned: 'Content moderation isn\'t optional. It\'s critical for trust, safety, and business viability.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Moderating content from 3B users',
    howTheyDoIt: 'Combines ML models (detecting 95% of violations before user reports) + 15,000 human moderators for complex cases',
  },

  diagram: `
Content Upload Pipeline:

User uploads post
      │
      ▼
┌──────────────────┐
│   App Server     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     ┌─────────────────────┐
│   ML Pipeline    │────▶│  Moderation Models  │
│                  │     │  - Text classifier  │
│                  │     │  - Image scanner    │
│                  │     │  - Video analyzer   │
└────────┬─────────┘     └─────────────────────┘
         │
         ├──▶ Safe (95%) → Post published
         ├──▶ Flagged (4%) → Human review queue
         └──▶ Violation (1%) → Auto-blocked + user notified
`,

  keyPoints: [
    'ML pipeline runs on every upload (< 1s)',
    'Multiple models: text, image, video analysis',
    'Auto-block high-confidence violations',
    'Human review for ambiguous cases',
    'Legal compliance: CSAM detection mandatory',
  ],

  quickCheck: {
    question: 'Why not rely solely on user reporting instead of automated ML moderation?',
    options: [
      'User reporting is too slow',
      'Harmful content spreads before users report; ML detects instantly',
      'Users don\'t report content',
      'ML is perfect',
    ],
    correctIndex: 1,
    explanation: 'Viral harmful content can reach millions before users report. ML provides instant detection.',
  },

  keyConcepts: [
    { title: 'ML Pipeline', explanation: 'Automated content analysis', icon: '🤖' },
    { title: 'Multi-Modal', explanation: 'Text, image, video detection', icon: '🎭' },
    { title: 'Human-in-Loop', explanation: 'ML + human review hybrid', icon: '👥' },
  ],
};

const step10: GuidedStep = {
  id: 'social-media-step-10',
  stepNumber: 10,
  frIndex: 8,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'FR-9: Content moderation and safety',
    taskDescription: 'Add ML Service for automated content moderation',
    componentsNeeded: [
      { type: 'ml_service', reason: 'Automated content safety detection', displayName: 'ML Moderation Pipeline' },
    ],
    successCriteria: [
      'ML Service component added',
      'App Server connected to ML Service',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'graph_database', 'cache', 'message_queue', 'websocket_server', 'object_storage', 'cdn', 'ml_service'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'load_balancer', toType: 'websocket_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'graph_database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'ml_service' },
      { fromType: 'websocket_server', toType: 'message_queue' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Add ML Service and connect App Server to it',
    level2: 'ML Service analyzes all uploaded content before publishing',
    solutionComponents: [{ type: 'ml_service' }],
    solutionConnections: [{ from: 'app_server', to: 'ml_service' }],
  },
};

// =============================================================================
// STEP 11: Add Search and Analytics for Discovery
// =============================================================================

const step11Story: StoryContent = {
  emoji: '🔍',
  scenario: "Users are asking: 'How do I find trending topics? How do I search for content?'",
  hook: "There's no discovery mechanism! Users can only see friends' posts. Engagement is plateauing.",
  challenge: "Add search engine and analytics pipeline for discovery and trending.",
  illustration: 'discovery-needed',
};

const step11Celebration: CelebrationContent = {
  emoji: '🔎',
  message: 'Discovery and trending are live!',
  achievement: 'Search and analytics enable content discovery',
  metrics: [
    { label: 'Search latency', after: '<100ms' },
    { label: 'Trending topics', after: 'Real-time' },
    { label: 'User engagement', after: '+60%' },
  ],
  nextTeaser: "Time to optimize costs and performance...",
};

const step11LearnPhase: TeachingContent = {
  conceptTitle: 'Search and Real-Time Analytics',
  conceptExplanation: `Users need to discover content beyond their friends.

**Search** (Elasticsearch):
- Full-text search for posts, users, hashtags
- Real-time indexing (new posts searchable instantly)
- Fuzzy matching, ranking by relevance
- Filter by date, popularity, location

**Analytics Pipeline** (Stream processing):
- Real-time event stream (likes, shares, views)
- Detect trending topics (what's hot RIGHT NOW)
- Aggregate metrics (post engagement, user activity)
- Feed recommendation algorithms

Architecture:
1. User actions → Event stream (Kafka)
2. Stream processors calculate trends in real-time
3. Trending topics cached for instant access
4. Search service indexes all content

Trending algorithm (simplified):
- Velocity: Engagement rate increasing
- Volume: Total engagement count
- Recency: Prefer recent content`,

  whyItMatters: 'Discovery features drive 40%+ of engagement. Users need to find content beyond their network.',

  famousIncident: {
    title: 'Twitter Trending Manipulation',
    company: 'Twitter',
    year: '2020',
    whatHappened: 'Coordinated campaigns artificially boosted trending topics. Twitter had to completely revamp their trending algorithm with ML-based anomaly detection.',
    lessonLearned: 'Trending algorithms need fraud detection and context awareness.',
    icon: '📊',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Detecting trending topics in real-time',
    howTheyDoIt: 'Uses Apache Storm for stream processing, analyzing millions of tweets/sec to identify trending topics globally and locally',
  },

  diagram: `
Search Architecture:
Post created → Index in Elasticsearch → Searchable instantly
User searches → Elasticsearch → Ranked results (< 100ms)

Analytics Pipeline:
User actions → Event Stream (Kafka) → Stream Processors
                                     → Trending calculation
                                     → Update cache
                                     → Feed to ML models

Trending Topics:
Events → Windowed aggregation → Velocity + Volume → Rank → Cache
`,

  keyPoints: [
    'Elasticsearch for full-text search',
    'Stream processing (Kafka + processors) for real-time analytics',
    'Trending topics calculated from event velocity',
    'Search and trending drive discovery and engagement',
  ],

  quickCheck: {
    question: 'Why use stream processing instead of batch analytics for trending topics?',
    options: [
      'Stream processing is newer',
      'Batch is too slow - trending must be real-time (minutes, not hours)',
      'Stream uses less resources',
      'Batch doesn\'t work',
    ],
    correctIndex: 1,
    explanation: 'Trending is about what\'s hot RIGHT NOW. Batch processing (hourly/daily) is too slow.',
  },

  keyConcepts: [
    { title: 'Elasticsearch', explanation: 'Full-text search engine', icon: '🔍' },
    { title: 'Stream Processing', explanation: 'Real-time event analysis', icon: '🌊' },
    { title: 'Trending Algorithm', explanation: 'Detect viral content velocity', icon: '📈' },
  ],
};

const step11: GuidedStep = {
  id: 'social-media-step-11',
  stepNumber: 11,
  frIndex: 6,

  story: step11Story,
  learnPhase: step11LearnPhase,

  practicePhase: {
    frText: 'FR-7: Discover content through search and trending',
    taskDescription: 'Add Search (Elasticsearch) and Analytics for discovery',
    componentsNeeded: [
      { type: 'search', reason: 'Full-text search for posts, users, hashtags', displayName: 'Elasticsearch' },
      { type: 'analytics', reason: 'Real-time trending and engagement analytics', displayName: 'Analytics Pipeline' },
    ],
    successCriteria: [
      'Search component added',
      'Analytics component added',
      'App Server connected to Search',
      'Message Queue connected to Analytics',
    ],
  },

  celebration: step11Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'graph_database', 'cache', 'message_queue', 'websocket_server', 'object_storage', 'cdn', 'ml_service', 'search', 'analytics'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'load_balancer', toType: 'websocket_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'graph_database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'ml_service' },
      { fromType: 'app_server', toType: 'search' },
      { fromType: 'websocket_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'analytics' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Add Search and Analytics. Connect App Server → Search and Message Queue → Analytics',
    level2: 'Search indexes content, Analytics processes event streams for trending',
    solutionComponents: [{ type: 'search' }, { type: 'analytics' }],
    solutionConnections: [
      { from: 'app_server', to: 'search' },
      { from: 'message_queue', to: 'analytics' },
    ],
  },
};

// =============================================================================
// STEP 12: Database Replication and Cost Optimization
// =============================================================================

const step12Story: StoryContent = {
  emoji: '💸',
  scenario: "You're at Facebook-scale now! But two problems:",
  hook: "1) Your database is a single point of failure\n2) Monthly cloud bill is $2M - CFO is panicking!",
  challenge: "Add database replication AND optimize costs to stay under budget.",
  illustration: 'budget-crisis',
};

const step12Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a comprehensive social media platform!',
  achievement: 'Facebook-scale architecture with all modern features',
  metrics: [
    { label: 'Monthly cost', before: '$2M', after: 'Under budget' },
    { label: 'Database availability', after: '99.99%' },
    { label: 'Feed latency', after: '<300ms' },
    { label: 'Can handle', after: '1.7M req/sec' },
    { label: 'DAU capacity', after: '1 billion' },
  ],
  nextTeaser: "You've mastered comprehensive social media system design!",
};

const step12LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication and Cost Optimization',
  conceptExplanation: `Two final critical concerns:

**1. Database Replication** (reliability):
- Primary (write) + Replicas (read)
- If primary fails → promote replica (failover)
- Distribute read load across replicas
- Essential for 99.99% availability

**2. Cost Optimization** (sustainability):

At Facebook-scale, costs can spiral:
- **Right-size instances**: Don't over-provision
- **Reserved instances**: 60% savings for predictable load
- **Spot instances**: 90% savings for workers (message queue processors)
- **Aggressive caching**: 98% hit rate reduces DB cost 50x
- **Tiered storage**: Move old media to Glacier ($0.004/GB vs $0.023/GB S3)
- **Auto-scaling**: Scale down at night (traffic drops 40%)
- **CDN caching**: Reduce origin requests 99%

Cost breakdown (typical):
- 40%: Compute (app servers)
- 30%: Storage (media)
- 20%: Database + cache
- 10%: Networking + other

Optimization strategies can reduce costs 50-70% without impacting performance!`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it OR if it goes down.',

  famousIncident: {
    title: 'Dropbox Saves $75M',
    company: 'Dropbox',
    year: '2017',
    whatHappened: 'Moved from AWS to own data centers for hot data. Saved $75M over two years through aggressive cost optimization.',
    lessonLearned: 'At scale, even small optimizations save millions. Know your cost drivers.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Running 3B users cost-effectively',
    howTheyDoIt: 'Custom data centers, aggressive caching (>99% hit rate), tiered storage, and constant infrastructure optimization',
  },

  keyPoints: [
    'Database replication: primary + replicas for HA',
    'Aggressive caching (98%+ hit rate) = biggest cost saver',
    'Tiered storage: hot (recent) vs cold (old) media',
    'Auto-scaling: match capacity to traffic patterns',
    'Reserved/spot instances for predictable/flexible workloads',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for read-heavy social media?',
    options: [
      'Use bigger servers',
      'Aggressive caching to achieve 98%+ hit rate',
      'Delete old data',
      'Reduce replica count',
    ],
    correctIndex: 1,
    explanation: 'With 100:1 read-write ratio, 98% cache hit rate means only 2% of reads hit DB - massive cost savings.',
  },

  keyConcepts: [
    { title: 'Replication', explanation: 'Multiple database copies for HA', icon: '📋' },
    { title: 'Tiered Storage', explanation: 'Hot vs cold data pricing', icon: '🌡️' },
    { title: 'Cost Optimization', explanation: 'Balance performance and budget', icon: '⚖️' },
  ],
};

const step12: GuidedStep = {
  id: 'social-media-step-12',
  stepNumber: 12,
  frIndex: 0,

  story: step12Story,
  learnPhase: step12LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered with HA and cost-efficiency',
    taskDescription: 'Enable database replication and optimize system to stay under $800/month budget',
    successCriteria: [
      'Enable database replication (2+ replicas)',
      'Review all component configurations for optimization',
      'Ensure total estimated cost is under $800/month',
      'Maintain all performance requirements',
    ],
  },

  celebration: step12Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'graph_database', 'cache', 'message_queue', 'websocket_server', 'object_storage', 'cdn', 'ml_service', 'search', 'analytics'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'load_balancer', toType: 'websocket_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'graph_database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'ml_service' },
      { fromType: 'app_server', toType: 'search' },
      { fromType: 'websocket_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'analytics' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    requireMultipleAppInstances: true,
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Enable database replication, then review each component for cost optimization',
    level2: 'Click Database → Enable replication (2 replicas). Review cache TTL, instance sizes, storage tiers.',
    solutionComponents: [
      { type: 'database', config: { replication: { enabled: true, replicas: 2 } } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const comprehensiveSocialMediaPlatformGuidedTutorial: GuidedTutorial = {
  problemId: 'comprehensive-social-media',
  title: 'Design Comprehensive Social Media Platform',
  description: 'Build a complete social platform with feeds, real-time features, moderation, and discovery',
  difficulty: 'advanced',
  estimatedMinutes: 90,

  welcomeStory: {
    emoji: '🌐',
    hook: "You've been hired as Chief Architect at Global Social Network Inc!",
    scenario: "Your mission: Build a comprehensive social media platform combining the best of Facebook, Instagram, and Twitter. Handle 1 billion users, real-time notifications, content moderation, and global scale.",
    challenge: "Can you design a system that handles hybrid fan-out, real-time features, content safety, and massive scale?",
  },

  requirementsPhase: comprehensiveSocialMediaRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10, step11, step12],

  concepts: [
    'Client-Server Architecture',
    'API Design',
    'SQL Database',
    'Graph Database',
    'Caching Strategies',
    'Load Balancing',
    'Horizontal Scaling',
    'Hybrid Fan-Out (Push + Pull)',
    'Message Queues',
    'WebSocket Real-Time',
    'Object Storage',
    'CDN',
    'Content Moderation (ML)',
    'Search (Elasticsearch)',
    'Stream Processing',
    'Database Replication',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 1: Fan-out problem and hybrid strategies',
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 8: Distributed Systems',
    'Chapter 11: Stream Processing (analytics, trending)',
    'Chapter 12: Future of Data Systems',
  ],
};

export default comprehensiveSocialMediaPlatformGuidedTutorial;
