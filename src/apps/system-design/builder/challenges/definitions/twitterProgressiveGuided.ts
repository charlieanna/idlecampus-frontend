import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Twitter - Progressive Tutorial (4 Phases)
 *
 * A single evolving tutorial that grows from beginner → intermediate → advanced → expert.
 * The famous "fan-out problem" is introduced progressively as scale increases.
 *
 * PHASE 1 - BEGINNER (Steps 1-3):
 * - FR-1: Post tweets
 * - FR-2: View timeline (simple - query on read)
 * - Build: Client → Server → Database
 *
 * PHASE 2 - INTERMEDIATE (Steps 4-6):
 * - FR-3: Follow/unfollow users
 * - FR-4: Like tweets
 * - Build: Add Cache, implement follow graph
 *
 * PHASE 3 - ADVANCED (Steps 7-9):
 * - The Fan-Out Problem: Celebrity tweets
 * - NFR: Handle 350K reads/sec
 * - Build: Fan-out on write, message queues, timeline cache
 *
 * PHASE 4 - EXPERT (Steps 10-12):
 * - Search & Trending
 * - Global scale
 * - Build: Search index, stream processing, CDN
 *
 * Key Teaching: The Fan-Out problem is THE defining challenge of Twitter's architecture.
 */

// =============================================================================
// PHASE 1: BEGINNER REQUIREMENTS (Steps 1-3)
// =============================================================================

const phase1Requirements: RequirementsGatheringContent = {
  problemStatement: "Design a microblogging platform like Twitter",

  interviewer: {
    name: 'Marcus Johnson',
    role: 'Product Manager at Chirp',
    avatar: '👨‍💼',
  },

  questions: [
    {
      id: 'post-tweets',
      category: 'functional',
      question: "What's the core thing users want to do?",
      answer: "Users want to post short messages (tweets) of up to 280 characters. It's like texting the whole world!",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Start with the simplest form - text only tweets",
    },
    {
      id: 'view-timeline',
      category: 'functional',
      question: "How do users see tweets?",
      answer: "Users see a timeline - a feed of tweets from people they follow, newest first. For now, let's just show ALL tweets (like a public feed).",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Timeline is the core reading experience",
    },
  ],

  minimumQuestionsRequired: 2,
  criticalQuestionIds: ['post-tweets', 'view-timeline'],
  criticalFRQuestionIds: ['post-tweets', 'view-timeline'],
  criticalScaleQuestionIds: [],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can post tweets',
      description: 'Share short messages (up to 280 characters)',
      emoji: '✍️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can view a timeline',
      description: 'See tweets in reverse chronological order',
      emoji: '📰',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10,000',
    writesPerDay: '50,000 tweets',
    readsPerDay: '500,000 timeline views',
    peakMultiplier: 2,
    readWriteRatio: '10:1',
    calculatedWriteRPS: { average: 0.5, peak: 2 },
    calculatedReadRPS: { average: 5, peak: 20 },
    maxPayloadSize: '~1KB',
    storagePerRecord: '~500 bytes',
    storageGrowthPerYear: '~10GB',
    redirectLatencySLA: 'p99 < 500ms',
    createLatencySLA: 'p99 < 1s',
  },

  architecturalImplications: [
    '✅ Low volume → Simple architecture works',
    '✅ Client → Server → Database is enough',
    '✅ Timeline can be generated on-the-fly',
  ],

  outOfScope: [
    'Following system (Phase 2)',
    'Likes and retweets (Phase 2)',
    'Fan-out optimization (Phase 3)',
    'Search and trending (Phase 4)',
  ],

  keyInsight: "Start simple! Build a basic tweet posting and viewing system. The famous 'fan-out problem' and scaling challenges come later.",

  thinkingFramework: {
    title: "Phase 1: Basic Tweeting",
    intro: "We have 2 simple requirements. Let's build a working Twitter MVP.",

    steps: [
      {
        id: 'what-apis',
        title: 'Step 1: What APIs?',
        alwaysAsk: "What operations do users need?",
        whyItMatters: "FR-1 needs a post endpoint, FR-2 needs a timeline endpoint.",
        expertBreakdown: {
          intro: "Two endpoints:",
          points: [
            "POST /tweets → Create a new tweet",
            "GET /timeline → Get recent tweets",
            "Simple CRUD operations"
          ]
        },
        icon: '🔌',
        category: 'functional'
      },
      {
        id: 'what-store',
        title: 'Step 2: What Data?',
        alwaysAsk: "What do we store?",
        whyItMatters: "Tweets need to be persisted.",
        expertBreakdown: {
          intro: "Tweet record:",
          points: [
            "tweet_id, user_id, content, created_at",
            "Simple table, ordered by created_at",
            "Timeline = SELECT * ORDER BY created_at DESC"
          ]
        },
        icon: '💾',
        category: 'data-flow'
      }
    ],

    startSimple: {
      title: "Phase 1 Architecture",
      description: "Client → App Server → Database. Post tweets, query timeline.",
      whySimple: "This works for a small user base. We'll add following, caching, and fan-out later.",
      nextStepPreview: "Step 1: Connect Client to App Server"
    }
  },

  scaleFramework: {
    title: "What's Coming Next?",
    intro: "After Phase 1, the platform will evolve:",
    celebrationMessage: "Your basic Twitter works!",
    hookMessage: "But users only see ALL tweets. They want to follow specific people...",
    steps: [
      {
        id: 'following',
        title: 'Phase 2: Following',
        question: "How do users choose whose tweets they see?",
        whyItMatters: "Following creates personalized timelines",
        example: "Follow graph + timeline filtering",
        icon: '👥'
      },
      {
        id: 'fanout',
        title: 'Phase 3: The Fan-Out Problem',
        question: "What if a celebrity with 50M followers tweets?",
        whyItMatters: "THE defining challenge of Twitter",
        example: "Fan-out strategies, timeline caching",
        icon: '📢'
      }
    ],
    nextStepsPreview: "First, let's build Phase 1!"
  }
};

// =============================================================================
// STEP 1: Connect Client to Server (Phase 1)
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🐦',
  scenario: "Welcome to Chirp! You're building the next big microblogging platform.",
  hook: "Your first user just signed up. They're ready to share their thoughts with the world!",
  challenge: "Set up the basic system so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your platform is online!',
  achievement: 'Users can now connect to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But where do we store the tweets?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Client-Server Architecture',
  conceptExplanation: `Every web app starts with a Client connecting to a Server.

**Client**: The user's device (phone, laptop, browser)
**Server**: Your backend that processes requests

When a user opens the Chirp app:
1. Their device sends an HTTP request
2. Your server processes it
3. Server sends back a response

This is the foundation of ALL web applications!`,

  whyItMatters: 'Without this connection, users can\'t interact with your platform.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Handling millions of requests',
    howTheyDoIt: 'Started with a simple Ruby on Rails server in 2006.',
  },

  keyPoints: [
    'Client = user\'s device',
    'Server = your backend',
    'HTTP = how they communicate',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'User\'s device making requests', icon: '📱' },
    { title: 'Server', explanation: 'Your backend processing logic', icon: '🖥️' },
  ],
};

const step1: GuidedStep = {
  id: 'twitter-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can post tweets',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Users accessing Chirp', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles tweet logic', displayName: 'Tweet Service' },
    ],
    successCriteria: [
      'Client added',
      'App Server added',
      'Connected together',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag Client and App Server onto the canvas',
    level2: 'Connect them by clicking Client then App Server',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Add Database for Tweets (Phase 1)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💥',
  scenario: "Users are posting tweets! But disaster strikes...",
  hook: "The server restarted overnight. ALL the tweets are gone! Users are furious - their witty observations vanished!",
  challenge: "Tweets were stored in memory. We need persistent storage!",
  illustration: 'server-crash',
};

const step2Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Tweets are now safely stored!',
  achievement: 'Data persists even after restart',
  metrics: [
    { label: 'Data durability', before: 'Lost on restart', after: 'Persisted' },
    { label: 'Storage', after: 'Database' },
  ],
  nextTeaser: "Now let's implement the tweet posting and timeline logic...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Database: Persistent Storage',
  conceptExplanation: `**The Problem:**
Server memory (RAM) is volatile. Restart = data gone.

**The Solution:**
Store tweets in a database:
- Survives restarts
- Can be backed up
- Scales to millions of records

**Tweet Schema:**
\`\`\`sql
CREATE TABLE tweets (
  id BIGINT PRIMARY KEY,
  user_id BIGINT,
  content VARCHAR(280),
  created_at TIMESTAMP
);
\`\`\`

**Timeline Query:**
\`\`\`sql
SELECT * FROM tweets
ORDER BY created_at DESC
LIMIT 20;
\`\`\``,

  whyItMatters: 'Without a database, all tweets disappear on restart!',

  famousIncident: {
    title: 'Twitter\'s Early Struggles',
    company: 'Twitter',
    year: '2007-2008',
    whatHappened: 'Twitter frequently crashed during high-traffic events, showing the "Fail Whale". Database overload was a major cause.',
    lessonLearned: 'Database design is critical for social platforms.',
    icon: '🐋',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Storing 500M tweets/day',
    howTheyDoIt: 'Uses MySQL for core data, with heavy caching layers.',
  },

  keyPoints: [
    'Databases persist data',
    'Tweets stored in table',
    'Timeline = query ordered by time',
  ],

  keyConcepts: [
    { title: 'Persistence', explanation: 'Data survives restarts', icon: '💾' },
    { title: 'Schema', explanation: 'Structure of your data', icon: '📋' },
  ],
};

const step2: GuidedStep = {
  id: 'twitter-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1 & FR-2: Store tweets persistently',
    taskDescription: 'Add a Database to store tweets',
    componentsNeeded: [
      { type: 'database', reason: 'Store tweets', displayName: 'Tweets DB' },
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
    level1: 'Add a Database component',
    level2: 'Connect App Server to Database',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 3: Implement Tweet APIs (Phase 1 Complete)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '⚙️',
  scenario: "Infrastructure is ready, but the server doesn't know HOW to handle tweets!",
  hook: "Users try to post but get 404 errors. The endpoints don't exist yet!",
  challenge: "Implement the APIs for posting tweets and viewing the timeline.",
  illustration: 'code-editor',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 1 Complete! Basic Twitter works!',
  achievement: 'Users can post tweets and view the timeline',
  metrics: [
    { label: 'Post tweets', after: '✓ Working' },
    { label: 'View timeline', after: '✓ Working' },
    { label: 'Data persisted', after: '✓' },
  ],
  nextTeaser: "But everyone sees ALL tweets. Users want to follow specific people...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Tweet API Implementation',
  conceptExplanation: `**Two endpoints to implement:**

**POST /api/v1/tweets** - Create tweet
\`\`\`python
def post_tweet(user_id, content):
    if len(content) > 280:
        return error("Tweet too long")

    tweet = {
        'id': generate_id(),
        'user_id': user_id,
        'content': content,
        'created_at': now()
    }
    db.insert('tweets', tweet)
    return tweet
\`\`\`

**GET /api/v1/timeline** - Get timeline
\`\`\`python
def get_timeline():
    # For now, just get recent tweets from everyone
    return db.query(
        "SELECT * FROM tweets ORDER BY created_at DESC LIMIT 20"
    )
\`\`\`

This is a "global timeline" - everyone sees the same tweets. We'll add personalized timelines in Phase 2.`,

  whyItMatters: 'Without the logic, your server is just an empty shell.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Early Twitter (2006)',
    howTheyDoIt: 'Started with exactly this approach - a simple global timeline.',
  },

  keyPoints: [
    'POST creates tweets',
    'GET returns timeline',
    'Validate tweet length (280 chars)',
  ],

  keyConcepts: [
    { title: 'Create Tweet', explanation: 'Insert into database', icon: '✍️' },
    { title: 'Timeline', explanation: 'Query ordered by time', icon: '📰' },
  ],
};

const step3: GuidedStep = {
  id: 'twitter-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1 & FR-2: Implement tweet APIs',
    taskDescription: 'Configure APIs and implement handlers',
    successCriteria: [
      'Assign POST /api/v1/tweets',
      'Assign GET /api/v1/timeline',
      'Implement handlers',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click App Server to configure APIs',
    level2: 'Assign both endpoints and implement the handlers',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// PHASE 2: INTERMEDIATE - Following & Engagement
// =============================================================================

// =============================================================================
// STEP 4: Add Follow System (Phase 2)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '👥',
  scenario: "Phase 2 begins! Users love posting tweets, but there's a problem...",
  hook: "The timeline shows tweets from EVERYONE. Users are overwhelmed! 'I only want to see tweets from people I care about!'",
  challenge: "NEW REQUIREMENT: FR-3 - Users can follow/unfollow other users.",
  illustration: 'social-graph',
};

const step4Celebration: CelebrationContent = {
  emoji: '👥',
  message: 'Follow system is live!',
  achievement: 'Users can now follow each other',
  metrics: [
    { label: 'Follow/unfollow', after: '✓ Working' },
    { label: 'Personalized timeline', after: 'Coming next' },
  ],
  nextTeaser: "Now we need to filter the timeline to only show followed users...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'The Social Graph',

  frameworkReminder: {
    question: "How do users choose whose tweets they see?",
    connection: "FR-3 introduces following. This creates a 'social graph' - the network of who follows whom."
  },

  conceptExplanation: `**NEW FR-3: Follow/Unfollow Users**

**The Follow Graph:**
Users follow other users. This is stored as edges in a graph:
- Alice → follows → Bob
- Alice → follows → Carol
- Dave → follows → Alice

**Schema:**
\`\`\`sql
CREATE TABLE follows (
  follower_id BIGINT,
  followee_id BIGINT,
  created_at TIMESTAMP,
  PRIMARY KEY (follower_id, followee_id)
);
\`\`\`

**Key Insight: Asymmetric Relationship**
- Alice follows Bob ≠ Bob follows Alice
- This is different from Facebook's symmetric "friends"
- Makes timeline generation more complex`,

  whyItMatters: 'The follow graph is the foundation of personalized timelines. It\'s also the source of the famous "fan-out" problem.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Managing 500M+ follow relationships',
    howTheyDoIt: 'Specialized graph database for follows, with heavy caching.',
  },

  keyPoints: [
    'Follow graph is asymmetric',
    'Stored as follower → followee edges',
    'Foundation for personalized timelines',
  ],

  keyConcepts: [
    { title: 'Social Graph', explanation: 'Network of who follows whom', icon: '🕸️' },
    { title: 'Asymmetric', explanation: 'Following is one-way', icon: '➡️' },
  ],
};

const step4: GuidedStep = {
  id: 'twitter-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Users can follow/unfollow',
    taskDescription: 'Implement the follow system',
    successCriteria: [
      'Add POST /api/v1/follow API',
      'Add DELETE /api/v1/unfollow API',
      'Store follows in database',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add follow/unfollow API endpoints',
    level2: 'Create follows table with follower_id and followee_id',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Personalized Timeline (Phase 2)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📰',
  scenario: "Users can follow each other, but the timeline still shows everyone's tweets!",
  hook: "Alice follows Bob and Carol, but she sees tweets from thousands of strangers. The timeline needs to be personalized!",
  challenge: "Update the timeline to only show tweets from followed users.",
  illustration: 'filter',
};

const step5Celebration: CelebrationContent = {
  emoji: '📰',
  message: 'Personalized timelines are live!',
  achievement: 'Users see tweets only from people they follow',
  metrics: [
    { label: 'Timeline', before: 'Global (all tweets)', after: 'Personalized' },
    { label: 'User experience', after: 'Much better!' },
  ],
  nextTeaser: "But timeline queries are getting slow...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Personalized Timeline: Fan-Out on Read',

  frameworkReminder: {
    question: "How do we show only tweets from followed users?",
    connection: "The timeline must JOIN tweets with the follow graph. This is 'fan-out on read'."
  },

  conceptExplanation: `**Timeline Query (Fan-Out on Read):**

\`\`\`sql
SELECT t.* FROM tweets t
JOIN follows f ON t.user_id = f.followee_id
WHERE f.follower_id = :current_user
ORDER BY t.created_at DESC
LIMIT 20;
\`\`\`

**How it works:**
1. User requests their timeline
2. Query finds all users they follow
3. Query finds all tweets from those users
4. Sort by time, return top 20

**The problem:**
If you follow 1000 people, this JOIN is expensive!
At scale, this query becomes very slow.

**This is called "Fan-Out on Read":**
- Work happens when READING the timeline
- The more people you follow, the slower it gets
- Works fine for small scale, breaks at Twitter scale`,

  whyItMatters: 'This approach works for small scale but becomes a bottleneck. Understanding this prepares you for Phase 3.',

  realWorldExample: {
    company: 'Twitter (Early Days)',
    scenario: 'Timeline generation',
    howTheyDoIt: 'Used fan-out on read initially. Had to change as they scaled.',
  },

  keyPoints: [
    'JOIN tweets with follows',
    'Expensive for users following many people',
    'Called "fan-out on read"',
  ],

  keyConcepts: [
    { title: 'Fan-Out on Read', explanation: 'Compute timeline when reading', icon: '📖' },
    { title: 'JOIN', explanation: 'Combine tweets and follows', icon: '🔗' },
  ],
};

const step5: GuidedStep = {
  id: 'twitter-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: Personalized timeline',
    taskDescription: 'Update timeline to filter by followed users',
    successCriteria: [
      'Update GET /timeline to JOIN with follows',
      'Only return tweets from followed users',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Modify the timeline query to JOIN with follows',
    level2: 'WHERE f.follower_id = current_user',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Cache & Likes (Phase 2 Complete)
// =============================================================================

const step6Story: StoryContent = {
  emoji: '❤️',
  scenario: "Users want to engage with tweets! Also, the timeline is getting slow...",
  hook: "Every timeline request queries the database. At 1000 requests/sec, the DB is struggling. And users are asking: 'Can I like tweets?'",
  challenge: "Add caching for performance AND implement the like feature.",
  illustration: 'engagement',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 2 Complete! Full engagement features!',
  achievement: 'Likes, follows, cached timelines',
  metrics: [
    { label: 'Follow/unfollow', after: '✓' },
    { label: 'Personalized timeline', after: '✓' },
    { label: 'Likes', after: '✓' },
    { label: 'Caching', after: '✓' },
  ],
  nextTeaser: "Phase 3: What happens when a celebrity with 50M followers tweets?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Caching & Engagement',

  frameworkReminder: {
    question: "How do we make timelines fast?",
    connection: "Caching stores frequently-accessed data in memory. Timeline reads become instant."
  },

  conceptExplanation: `**Two things to add:**

**1. Caching for Timeline**
\`\`\`python
def get_timeline(user_id):
    # Check cache first
    cached = cache.get(f"timeline:{user_id}")
    if cached:
        return cached

    # Cache miss - query DB
    timeline = db.query_timeline(user_id)
    cache.set(f"timeline:{user_id}", timeline, ttl=60)
    return timeline
\`\`\`

**2. Likes Table**
\`\`\`sql
CREATE TABLE likes (
  user_id BIGINT,
  tweet_id BIGINT,
  created_at TIMESTAMP,
  PRIMARY KEY (user_id, tweet_id)
);
\`\`\`

**Like/Unlike APIs:**
- POST /api/v1/tweets/:id/like
- DELETE /api/v1/tweets/:id/like

**Invalidation Challenge:**
When a new tweet is posted, we need to invalidate cached timelines of all followers. This is a preview of the fan-out problem!`,

  whyItMatters: 'Caching is essential for read-heavy workloads like Twitter. Likes add engagement.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Timeline caching',
    howTheyDoIt: 'Redis clusters cache timelines. 95%+ cache hit rate.',
  },

  keyPoints: [
    'Cache timelines for speed',
    'Likes stored in separate table',
    'Cache invalidation is tricky',
  ],

  keyConcepts: [
    { title: 'Cache', explanation: 'Fast in-memory storage', icon: '⚡' },
    { title: 'Like', explanation: 'User engagement action', icon: '❤️' },
  ],
};

const step6: GuidedStep = {
  id: 'twitter-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-4: Like tweets + NFR: Fast timelines',
    taskDescription: 'Add cache and implement likes',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache timelines', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Add Cache component',
      'Connect App Server to Cache',
      'Implement like/unlike APIs',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add Cache, implement likes',
    level2: 'Cache timelines with TTL, create likes table',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// PHASE 3: ADVANCED - The Fan-Out Problem
// =============================================================================

// =============================================================================
// STEP 7: The Fan-Out Problem (Phase 3)
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📢',
  scenario: "Phase 3 begins! A HUGE problem has emerged...",
  hook: "Celebrity @KimK with 50 MILLION followers just tweeted. Your system needs to update 50 MILLION timelines. The database is on fire! 🔥",
  challenge: "This is the famous FAN-OUT PROBLEM - THE defining challenge of Twitter's architecture.",
  illustration: 'celebrity-tweet',
};

const step7Celebration: CelebrationContent = {
  emoji: '📢',
  message: 'You understand the fan-out problem!',
  achievement: 'Ready to implement the solution',
  metrics: [
    { label: 'Problem understood', after: '✓ Fan-Out' },
    { label: 'Solution approach', after: 'Fan-Out on Write' },
  ],
  nextTeaser: "Now let's implement the solution with message queues...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'THE Fan-Out Problem',

  frameworkReminder: {
    question: "What happens when a celebrity with 50M followers tweets?",
    connection: "This is THE defining challenge. When @KimK tweets, 50 million timelines need updating."
  },

  conceptExplanation: `**THE FAN-OUT PROBLEM**

When @KimK (50M followers) tweets:

**Option A: Fan-Out on READ (Current Approach)**
- Do nothing when tweet is posted
- When each follower loads timeline, query includes @KimK's tweet
- Problem: 50M users × expensive JOIN = disaster

**Option B: Fan-Out on WRITE (Twitter's Solution)**
- When @KimK tweets, push to all 50M followers' timeline caches
- Each follower's timeline is pre-computed
- Timeline read = just fetch from cache (fast!)
- Problem: 50M writes for one tweet = async processing needed

**The Hybrid Approach (What Twitter Does):**
- Regular users: Fan-out on WRITE (push to followers)
- Celebrities (>100K followers): Fan-out on READ (query on demand)
- This balances write load with read performance`,

  whyItMatters: 'This is THE classic system design interview problem. Understanding it separates junior from senior engineers.',

  famousIncident: {
    title: 'Twitter\'s Architecture Evolution',
    company: 'Twitter',
    year: '2012',
    whatHappened: 'Twitter rewrote their timeline generation from fan-out on read to fan-out on write. This was a massive multi-year effort.',
    lessonLearned: 'Sometimes you need to completely rethink architecture as you scale.',
    icon: '🔄',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Timeline generation at scale',
    howTheyDoIt: 'Hybrid approach: fan-out on write for most users, fan-out on read for celebrities.',
  },

  keyPoints: [
    'Fan-out on READ: compute timeline when reading',
    'Fan-out on WRITE: pre-compute timeline when posting',
    'Hybrid: different strategies for different users',
  ],

  keyConcepts: [
    { title: 'Fan-Out on Read', explanation: 'Query time computation', icon: '📖' },
    { title: 'Fan-Out on Write', explanation: 'Pre-computed timelines', icon: '✍️' },
    { title: 'Hybrid', explanation: 'Best of both worlds', icon: '🔀' },
  ],
};

const step7: GuidedStep = {
  id: 'twitter-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'NFR: Handle celebrity tweets efficiently',
    taskDescription: 'Understand the fan-out problem and choose a strategy',
    successCriteria: [
      'Understand fan-out on READ vs WRITE',
      'Decide on hybrid approach',
      'Prepare for async processing',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Think about the trade-offs of each approach',
    level2: 'Hybrid approach: WRITE for regular users, READ for celebrities',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Message Queue for Fan-Out (Phase 3)
// =============================================================================

const step8Story: StoryContent = {
  emoji: '📬',
  scenario: "You've decided on fan-out on WRITE. But there's a problem...",
  hook: "When a user with 10,000 followers tweets, you can't write to 10,000 timeline caches synchronously - the request would timeout!",
  challenge: "Add a message queue to process fan-out asynchronously.",
  illustration: 'async-processing',
};

const step8Celebration: CelebrationContent = {
  emoji: '📬',
  message: 'Async fan-out is live!',
  achievement: 'Tweets fan out asynchronously via message queue',
  metrics: [
    { label: 'Tweet post latency', before: 'Timeout', after: '< 500ms' },
    { label: 'Fan-out processing', after: 'Async' },
  ],
  nextTeaser: "Now let's add load balancing for high availability...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Async Fan-Out with Message Queues',

  frameworkReminder: {
    question: "How do we fan out without blocking?",
    connection: "Posting a tweet should be instant. Fan-out happens in the background via message queue."
  },

  conceptExplanation: `**The Flow:**

**1. User posts tweet:**
\`\`\`python
def post_tweet(user_id, content):
    # Save tweet to DB (fast)
    tweet = db.insert_tweet(user_id, content)

    # Enqueue fan-out job (instant)
    queue.publish('fan-out', {
        'tweet_id': tweet.id,
        'user_id': user_id
    })

    return tweet  # Return immediately
\`\`\`

**2. Fan-out worker processes async:**
\`\`\`python
def fan_out_worker(job):
    tweet_id = job['tweet_id']
    user_id = job['user_id']

    # Get all followers
    followers = db.get_followers(user_id)

    # Push to each follower's timeline cache
    for follower_id in followers:
        cache.push_to_timeline(follower_id, tweet_id)
\`\`\`

**Benefits:**
- Tweet post is instant (< 500ms)
- Fan-out happens in background
- Can scale workers independently
- Can handle bursts (queue buffers)`,

  whyItMatters: 'Without async processing, fan-out would make tweet posting slow or timeout.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Handling 500M tweets/day',
    howTheyDoIt: 'Kafka for event streaming, custom fan-out service with thousands of workers.',
  },

  keyPoints: [
    'Tweet post returns immediately',
    'Fan-out queued as background job',
    'Workers process at own pace',
  ],

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for async jobs', icon: '📬' },
    { title: 'Worker', explanation: 'Process that handles fan-out', icon: '👷' },
  ],
};

const step8: GuidedStep = {
  id: 'twitter-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'NFR: Async fan-out processing',
    taskDescription: 'Add message queue for fan-out',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Queue fan-out jobs', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Add Message Queue',
      'Connect App Server to Queue',
      'Add fan-out worker',
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
    ],
  },

  hints: {
    level1: 'Add Kafka for fan-out jobs',
    level2: 'Post tweet → enqueue job → worker processes',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 9: Add Load Balancer & Scaling (Phase 3 Complete)
// =============================================================================

const step9Story: StoryContent = {
  emoji: '⚖️',
  scenario: "Your platform is handling 100K requests/second! But there's a single point of failure...",
  hook: "One server can't handle this load. And if it crashes, everyone is down!",
  challenge: "Add load balancing and scale horizontally.",
  illustration: 'scale-up',
};

const step9Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 3 Complete! Production-ready scale!',
  achievement: 'Horizontal scaling, fan-out, high availability',
  metrics: [
    { label: 'Capacity', after: '350K req/sec' },
    { label: 'Fan-out strategy', after: 'Hybrid async' },
    { label: 'Availability', after: 'Load balanced' },
  ],
  nextTeaser: "Phase 4: Search, trending, and global scale!",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling & Load Balancing',

  frameworkReminder: {
    question: "How do we handle 350K requests/second?",
    connection: "One server handles ~5-10K req/sec. At 350K, we need many servers with load balancing."
  },

  conceptExplanation: `**The Problem:**
- One server: 5-10K req/sec max
- Your load: 350K req/sec peak
- Need: 35-70 servers

**Load Balancer:**
- Distributes requests across servers
- If one dies, traffic goes to others
- Can add/remove servers dynamically

**Strategies:**
- Round Robin: rotate through servers
- Least Connections: send to least busy
- Consistent Hashing: same user → same server

**Scaling Everything:**
\`\`\`
                  ┌─────────────┐
                  │     LB      │
                  └──────┬──────┘
           ┌──────────┬──┴──┬──────────┐
           ▼          ▼     ▼          ▼
       [App 1]    [App 2] [App 3]  [App N]
           │          │     │          │
           └────────┬─┴─────┴──────────┘
                    ▼
              [Cache Cluster]
                    │
              [DB Primary + Replicas]
\`\`\``,

  whyItMatters: 'Horizontal scaling is how you handle massive load. Single servers have limits.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Handling 350K+ timeline reads/sec',
    howTheyDoIt: 'Thousands of servers behind multiple load balancer layers.',
  },

  keyPoints: [
    'Load balancer distributes traffic',
    'Horizontal scaling adds capacity',
    'No single point of failure',
  ],

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers', icon: '➕' },
  ],
};

const step9: GuidedStep = {
  id: 'twitter-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'NFR: Handle 350K req/sec',
    taskDescription: 'Add load balancer for horizontal scaling',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Add Load Balancer',
      'Client → LB → App Servers',
      'Multiple app server instances',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Add LB between Client and App Servers',
    level2: 'Client → Load Balancer → multiple App Servers',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// PHASE 4: EXPERT - Search, Trending, Global
// =============================================================================

// =============================================================================
// STEP 10: Add Search (Phase 4)
// =============================================================================

const step10Story: StoryContent = {
  emoji: '🔍',
  scenario: "Phase 4 begins! Users want to find content!",
  hook: "Users ask: 'How do I find tweets about #WorldCup?' or 'How do I find @elonmusk?' They need SEARCH!",
  challenge: "NEW REQUIREMENT: FR-5 - Users can search for tweets and users.",
  illustration: 'search',
};

const step10Celebration: CelebrationContent = {
  emoji: '🔍',
  message: 'Search is live!',
  achievement: 'Users can find tweets and users by keyword',
  metrics: [
    { label: 'Tweet search', after: '✓ Working' },
    { label: 'User search', after: '✓ Working' },
    { label: 'Hashtag search', after: '✓ Working' },
  ],
  nextTeaser: "Now let's add trending topics...",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Search Infrastructure',

  frameworkReminder: {
    question: "How do users find content?",
    connection: "FR-5 requires search. You can't LIKE query 500M tweets. You need a search index."
  },

  conceptExplanation: `**NEW FR-5: Search Tweets and Users**

**The Problem:**
\`\`\`sql
SELECT * FROM tweets WHERE content LIKE '%WorldCup%'
\`\`\`
This scans ALL 500M tweets. Way too slow!

**The Solution: Search Index (Elasticsearch)**
- Inverted index: word → list of tweet IDs
- "WorldCup" → [tweet_1, tweet_5, tweet_99, ...]
- Search becomes O(1) lookup + merge

**Architecture:**
\`\`\`
User tweets → App Server → DB
                    ↓
              Search Indexer → Elasticsearch

User searches → App Server → Elasticsearch → Results
\`\`\`

**Index on Write:**
When tweet is posted, also index it in Elasticsearch:
- Extract words, hashtags, mentions
- Add to inverted index
- Near real-time (seconds)`,

  whyItMatters: 'Search is essential for content discovery. Relational DBs can\'t handle text search at scale.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Searching 500M tweets/day',
    howTheyDoIt: 'Custom search infrastructure called "Earlybird" built on Lucene.',
  },

  keyPoints: [
    'Inverted index for fast search',
    'Index on write (async)',
    'Elasticsearch for full-text search',
  ],

  keyConcepts: [
    { title: 'Inverted Index', explanation: 'Word → document IDs', icon: '📑' },
    { title: 'Elasticsearch', explanation: 'Search engine', icon: '🔍' },
  ],
};

const step10: GuidedStep = {
  id: 'twitter-step-10',
  stepNumber: 10,
  frIndex: 4,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'FR-5: Users can search',
    taskDescription: 'Add search infrastructure',
    componentsNeeded: [
      { type: 'search', reason: 'Index and search tweets', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Add Search component (Elasticsearch)',
      'Connect App Server to Search',
      'Index tweets on write',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue', 'search'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'search' },
    ],
  },

  hints: {
    level1: 'Add Elasticsearch for search',
    level2: 'Index tweets when posted, search returns matching tweets',
    solutionComponents: [{ type: 'search' }],
    solutionConnections: [{ from: 'app_server', to: 'search' }],
  },
};

// =============================================================================
// STEP 11: Add Trending Topics (Phase 4)
// =============================================================================

const step11Story: StoryContent = {
  emoji: '📈',
  scenario: "Users want to see what's happening NOW!",
  hook: "The World Cup final is happening. #WorldCup is being tweeted thousands of times per minute. Users want to see TRENDING topics!",
  challenge: "NEW REQUIREMENT: FR-6 - Show trending topics (popular hashtags right now).",
  illustration: 'trending',
};

const step11Celebration: CelebrationContent = {
  emoji: '📈',
  message: 'Trending is live!',
  achievement: 'Real-time trending topics',
  metrics: [
    { label: 'Trending update', after: 'Real-time' },
    { label: 'Processing', after: 'Stream processing' },
  ],
  nextTeaser: "One more thing: global scale with CDN!",
};

const step11LearnPhase: TeachingContent = {
  conceptTitle: 'Stream Processing for Trending',

  frameworkReminder: {
    question: "How do we know what's trending RIGHT NOW?",
    connection: "FR-6 requires real-time trending. We need to count hashtags in a sliding window."
  },

  conceptExplanation: `**NEW FR-6: Trending Topics**

**What is "trending"?**
- Hashtags mentioned frequently in the last hour
- Weighted by recency (last 5 min counts more)
- Top 10-20 shown to users

**The Challenge:**
- 500M tweets/day = 6,000 tweets/sec
- Need to count hashtags in real-time
- Sliding window (last 1 hour)

**Solution: Stream Processing**
\`\`\`
Tweets → Kafka → Stream Processor → Trending Cache
                      │
               Count hashtags in
               sliding window
\`\`\`

**Apache Flink/Kafka Streams:**
- Process tweet stream in real-time
- Maintain hashtag counts per time window
- Output top trending to cache every minute

**Approximation with Count-Min Sketch:**
- Exact counting at scale is expensive
- Use probabilistic data structures
- 99% accurate, much faster`,

  whyItMatters: 'Trending is a real-time feature. Batch processing is too slow.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Real-time trending',
    howTheyDoIt: 'Custom stream processing with Storm (later Heron). Updates trending every few seconds.',
  },

  keyPoints: [
    'Stream processing for real-time',
    'Sliding window counting',
    'Approximate counting at scale',
  ],

  keyConcepts: [
    { title: 'Stream Processing', explanation: 'Real-time data processing', icon: '🌊' },
    { title: 'Sliding Window', explanation: 'Count in last N minutes', icon: '⏰' },
  ],
};

const step11: GuidedStep = {
  id: 'twitter-step-11',
  stepNumber: 11,
  frIndex: 5,

  story: step11Story,
  learnPhase: step11LearnPhase,

  practicePhase: {
    frText: 'FR-6: Trending topics',
    taskDescription: 'Add stream processing for trending',
    successCriteria: [
      'Process tweets through Kafka',
      'Count hashtags in sliding window',
      'Cache trending results',
    ],
  },

  celebration: step11Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue', 'search'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'search' },
    ],
  },

  hints: {
    level1: 'Use message queue for stream processing',
    level2: 'Count hashtags in sliding window, cache results',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 12: Add CDN for Global Scale (Phase 4 Complete)
// =============================================================================

const step12Story: StoryContent = {
  emoji: '🌍',
  scenario: "Chirp is going GLOBAL!",
  hook: "Users in Tokyo experience 300ms latency. Users in Brazil even worse. Your servers are all in US-East!",
  challenge: "Add a CDN to serve users from the nearest location worldwide.",
  illustration: 'global-map',
};

const step12Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You\'ve mastered Twitter system design!',
  achievement: 'From simple tweets to global-scale microblogging platform',
  metrics: [
    { label: 'DAU', after: '200M' },
    { label: 'Tweets/day', after: '500M' },
    { label: 'Timeline reads/sec', after: '350K' },
    { label: 'Global latency', after: '< 100ms' },
    { label: 'Features', after: 'Timeline, Search, Trending' },
  ],
  nextTeaser: "You've completed the Twitter journey!",
};

const step12LearnPhase: TeachingContent = {
  conceptTitle: 'Global Scale with CDN',

  frameworkReminder: {
    question: "How do we serve global users fast?",
    connection: "CDN puts content closer to users. Static assets and cached timelines at the edge."
  },

  conceptExplanation: `**The Problem:**
- Servers in US-East
- User in Tokyo: 150ms network latency
- User in Brazil: 180ms network latency
- Every request crosses the ocean

**The Solution: CDN**
- Edge servers in 200+ locations
- Cache content at the edge
- Users hit nearest server

**What to Cache at Edge:**
- Static assets (JS, CSS, images)
- User profile images
- Popular tweets (viral content)
- Trending results

**What NOT to Cache at Edge:**
- Personalized timelines (user-specific)
- Real-time notifications
- Private data

**Final Architecture:**
\`\`\`
User → CDN Edge → Load Balancer → App Servers
                                      ↓
                    [Cache] [DB] [Queue] [Search]
\`\`\``,

  whyItMatters: 'Global users expect fast response. CDN is essential for worldwide scale.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Serving 200M DAU globally',
    howTheyDoIt: 'Multiple CDNs (Akamai, Fastly). Edge caching for static and popular content.',
  },

  keyPoints: [
    'CDN = servers worldwide',
    'Cache static + popular content',
    'Personalized content from origin',
  ],

  keyConcepts: [
    { title: 'CDN', explanation: 'Content Delivery Network', icon: '🌐' },
    { title: 'Edge', explanation: 'Server near users', icon: '📍' },
  ],
};

const step12: GuidedStep = {
  id: 'twitter-step-12',
  stepNumber: 12,
  frIndex: 0,

  story: step12Story,
  learnPhase: step12LearnPhase,

  practicePhase: {
    frText: 'NFR: Global performance',
    taskDescription: 'Add CDN for edge caching',
    componentsNeeded: [
      { type: 'cdn', reason: 'Cache at edge', displayName: 'CDN' },
    ],
    successCriteria: [
      'Add CDN',
      'Client → CDN → Load Balancer',
      'Cache static and popular content',
    ],
  },

  celebration: step12Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue', 'search'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'search' },
    ],
  },

  hints: {
    level1: 'Add CDN at the edge',
    level2: 'Client → CDN → Load Balancer',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'load_balancer' },
    ],
  },
};

// =============================================================================
// EXPORT THE COMPLETE PROGRESSIVE TUTORIAL
// =============================================================================

export const twitterProgressiveGuidedTutorial: GuidedTutorial = {
  problemId: 'twitter-progressive',
  title: 'Design Twitter',
  description: 'Build an evolving microblogging platform from simple tweets to global-scale social media with the famous fan-out problem',
  difficulty: 'beginner', // Starts beginner, evolves to expert
  estimatedMinutes: 90,

  welcomeStory: {
    emoji: '🐦',
    hook: "Welcome to Chirp! You're building the next Twitter.",
    scenario: "Your journey: Start with simple tweet posting, then add following, tackle the famous fan-out problem, and scale globally with search and trending.",
    challenge: "Can you build a microblogging platform that handles 500 million tweets per day?",
  },

  requirementsPhase: phase1Requirements,

  steps: [
    // Phase 1: Beginner (Steps 1-3)
    step1, step2, step3,
    // Phase 2: Intermediate (Steps 4-6)
    step4, step5, step6,
    // Phase 3: Advanced (Steps 7-9) - THE FAN-OUT PROBLEM
    step7, step8, step9,
    // Phase 4: Expert (Steps 10-12)
    step10, step11, step12,
  ],

  concepts: [
    'Client-Server Architecture',
    'Database Persistence',
    'Social Graph (Follow System)',
    'Personalized Timeline',
    'Caching',
    'THE FAN-OUT PROBLEM',
    'Fan-Out on Read vs Write',
    'Message Queues (Async Processing)',
    'Load Balancing',
    'Search Index (Elasticsearch)',
    'Stream Processing (Trending)',
    'CDN (Global Scale)',
  ],

  ddiaReferences: [
    'Chapter 1: Twitter Fan-Out Problem (pp. 11-13)',
    'Chapter 3: Storage (Indexes)',
    'Chapter 5: Replication',
    'Chapter 11: Stream Processing',
  ],
};

export default twitterProgressiveGuidedTutorial;
