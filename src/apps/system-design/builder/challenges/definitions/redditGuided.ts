import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Reddit Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a social news/forum platform like Reddit.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (cache, ranking, queues, etc.)
 *
 * Key Concepts:
 * - Hot ranking algorithm (Wilson score)
 * - Nested comment trees
 * - Eventually consistent vote counts
 * - Subreddit architecture
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const redditRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a social news and discussion platform like Reddit",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Principal Engineer at Social Forum Corp',
    avatar: '👩‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-subreddit',
      category: 'functional',
      question: "What's the core structure of content on Reddit?",
      answer: "Reddit organizes content into **subreddits** - communities focused on specific topics:\n\n1. **Create/join subreddits** - Communities like r/programming, r/science\n2. **Post content** - Users submit links or text posts to subreddits\n3. **Browse feeds** - View posts from subscribed subreddits or explore r/all",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2',
      learningPoint: "Reddit's subreddit structure is fundamentally different from Twitter's user-following model",
    },
    {
      id: 'voting-system',
      category: 'functional',
      question: "How does Reddit determine which content is most important?",
      answer: "Reddit uses **voting** - the core mechanic:\n\n1. Users **upvote** (like) or **downvote** (dislike) posts and comments\n2. Score = upvotes - downvotes\n3. High-scored content rises to the top\n4. Users earn **karma** from upvotes on their posts",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Voting is Reddit's key differentiator - it's a democratic content ranking system",
    },
    {
      id: 'comment-system',
      category: 'functional',
      question: "How do users engage with posts?",
      answer: "Users can **comment** on posts, and comments support:\n\n1. **Nested threads** - Reply to comments, creating conversation trees\n2. **Voting on comments** - Comments are ranked by score too\n3. **Deep nesting** - Conversations can go many levels deep",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Nested comment trees are technically challenging - tree data structures at scale",
    },
    {
      id: 'content-types',
      category: 'clarification',
      question: "What types of content can users post?",
      answer: "Posts can be:\n1. **Text posts** - Discussion topics\n2. **Link posts** - URLs to external content\n3. **Image/video posts** - Media content\n\nFor MVP, let's focus on text and link posts. Media can be v2.",
      importance: 'important',
      insight: "Media uploads add complexity - good to defer initially",
    },
    {
      id: 'moderation',
      category: 'clarification',
      question: "How are subreddits managed?",
      answer: "Each subreddit has **moderators** who can remove posts, ban users, set rules. For MVP, we'll have basic moderation (post removal). Advanced features can come later.",
      importance: 'nice-to-have',
      insight: "Moderation is important but can be simplified initially",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "430 million monthly active users, with 50 million daily active users (DAU)",
      importance: 'critical',
      learningPoint: "Massive scale, but less than Twitter - still requires distributed architecture",
    },
    {
      id: 'throughput-posts',
      category: 'throughput',
      question: "How many posts and comments per day?",
      answer: "About 2 million posts and 10 million comments per day",
      importance: 'critical',
      calculation: {
        formula: "2M posts + 10M comments = 12M writes/day = 139 writes/sec",
        result: "~140 writes/sec (420 at peak)",
      },
      learningPoint: "Lower write volume than Twitter, but comments add complexity",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many page views per day?",
      answer: "About 20 billion page views per day",
      importance: 'critical',
      calculation: {
        formula: "20B ÷ 86,400 sec = 231,481 reads/sec",
        result: "~231K reads/sec (693K at peak)",
      },
      learningPoint: "Extremely read-heavy (1650:1 read-to-write ratio)",
    },
    {
      id: 'hot-algorithm',
      category: 'latency',
      question: "How does Reddit rank posts - newest first or by votes?",
      answer: "Reddit uses a **hot ranking algorithm** that balances:\n- Upvotes vs downvotes (score)\n- Time since posting (recency decay)\n- Subreddit activity\n\nThis is more complex than simple sorting by score or time.",
      importance: 'critical',
      insight: "The 'hot' algorithm is Reddit's secret sauce - computationally expensive",
    },
    {
      id: 'vote-consistency',
      category: 'latency',
      question: "When a user upvotes a post, how quickly must it reflect in the score?",
      answer: "Reddit uses **eventual consistency** for vote counts:\n- User's vote registers instantly for them\n- Total score updates within a few seconds\n- At high scale, exact counts can be slightly delayed (acceptable trade-off)",
      importance: 'important',
      learningPoint: "Eventual consistency enables better scalability for voting",
    },
    {
      id: 'latency-feed',
      category: 'latency',
      question: "How fast should the homepage/subreddit feed load?",
      answer: "p99 under 300ms for feed load. Posts with many comments may take slightly longer.",
      importance: 'critical',
      learningPoint: "Caching is essential for fast feed delivery",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-subreddit', 'voting-system', 'comment-system'],
  criticalFRQuestionIds: ['core-subreddit', 'voting-system'],
  criticalScaleQuestionIds: ['throughput-reads', 'hot-algorithm', 'vote-consistency'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can create and join subreddits',
      description: 'Communities focused on specific topics',
      emoji: '📂',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can post content to subreddits',
      description: 'Submit text or link posts to communities',
      emoji: '📝',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can vote on posts and comments',
      description: 'Upvote or downvote to rank content democratically',
      emoji: '⬆️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can comment on posts',
      description: 'Nested comment threads for discussion',
      emoji: '💬',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can view feeds',
      description: 'Browse hot/top/new posts from subscribed subreddits',
      emoji: '🔥',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 million',
    writesPerDay: '2M posts + 10M comments',
    readsPerDay: '20 billion page views',
    peakMultiplier: 3,
    readWriteRatio: '1650:1',
    calculatedWriteRPS: { average: 139, peak: 417 },
    calculatedReadRPS: { average: 231481, peak: 694443 },
    maxPayloadSize: '~10KB (post with text)',
    storagePerRecord: '~2KB (post/comment)',
    storageGrowthPerYear: '~8.7TB',
    redirectLatencySLA: 'p99 < 300ms (feed)',
    createLatencySLA: 'p99 < 1s (post/comment)',
  },

  architecturalImplications: [
    '✅ Extremely read-heavy (1650:1) → Aggressive caching CRITICAL',
    '✅ 694K reads/sec peak → Multiple app servers + CDN for static content',
    '✅ Hot algorithm computation → Pre-compute and cache rankings',
    '✅ Vote count aggregation → Message queue for async processing',
    '✅ Nested comments → Specialized tree data structures and queries',
  ],

  outOfScope: [
    'Media uploads (images/videos)',
    'Private messages',
    'Reddit awards/gold',
    'Live threads',
    'User profiles/karma breakdown',
    'Advanced moderation tools',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can create subreddits, post, comment, and vote. The complex hot ranking algorithm and vote aggregation challenges will come in later steps. Functionality first, then optimization!",

  thinkingFramework: {
    title: "From FRs to Brute Force Architecture",
    intro: "We have 5 core functional requirements. Let's design the SIMPLEST system that satisfies them before we worry about the 694K peak reads/sec.",

    steps: [
      {
        id: 'identify-apis',
        title: 'Step 1: What APIs Do We Need?',
        alwaysAsk: "What operations must the system support?",
        whyItMatters: "The APIs translate user actions (posting, voting) into system commands.",
        expertBreakdown: {
          intro: "To satisfy our core FRs, we need:",
          points: [
            "FR-2 (Post Content) → POST /api/v1/posts",
            "FR-3 (Voting) → POST /api/v1/vote",
            "FR-4 (Comments) → POST /api/v1/comments",
            "FR-5 (View Feeds) → GET /api/v1/feed",
          ]
        },
        icon: '🔌',
        category: 'functional'
      },
      {
        id: 'identify-data',
        title: 'Step 2: What Data Do We Store?',
        alwaysAsk: "What's the minimum data we need to make this work?",
        whyItMatters: "System state must be stored. For Reddit, we need posts, subreddits, votes, and comments.",
        expertBreakdown: {
          intro: "Even in a brute-force version, we need:",
          points: [
            "Posts table: { id, subreddit_id, title, content, author_id, created_at }",
            "Votes table: { user_id, target_id (post/comment), vote_type }",
            "Comments table: { id, post_id, parent_id (for nesting), content }",
            "Subreddits table: { id, name, description }",
          ]
        },
        icon: '💾',
        category: 'data-flow'
      },
      {
        id: 'sketch-flow',
        title: 'Step 3: Sketch the Brute Force Flow',
        alwaysAsk: "How do we get from a user request to a result?",
        whyItMatters: "Visualize the path the data takes through your system.",
        expertBreakdown: {
          intro: "The simplest flow for a new post:",
          points: [
            "1. Client → App Server: 'Here is my cute cat post for r/aww'",
            "2. App Server: Validates the request and stores it in memory",
            "3. App Server → Client: 'Success! Post ID: 567'",
            "No CDNs, no Load Balancers, no Caches yet. Just one server doing all the work.",
          ]
        },
        icon: '🔀',
        category: 'functional'
      }
    ],

    startSimple: {
      title: "Our Brute Force Architecture",
      description: "A single Client connected to a single App Server using an in-memory database (Python dictionaries).",
      whySimple: "This handles all 5 FRs! It won't handle 20B page views, but it's the perfect starting point to verify the core logic works.",
      nextStepPreview: "Step 1: Connect Client to App Server. Step 2: Write the Python code for posts and votes."
    }
  },
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🤖',
  scenario: "Welcome to Social Forum Corp! You've been hired to build the next Reddit.",
  hook: "Your first subreddit r/aww just launched. Users are ready to share cute content!",
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
  nextTeaser: "But the server is empty... let's write some code to handle posts and votes!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every web application starts with a **Client** connecting to a **Server**.

When a user opens Reddit:
1. Their device (browser, mobile app) is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back a response

This is the foundation of ALL web applications!`,

  whyItMatters: 'Without this connection, users can\'t interact with your system at all.',

  realWorldExample: {
    company: 'Reddit',
    scenario: 'Handling 20 billion page views per day',
    howTheyDoIt: 'Started with a Python server in 2005, now uses a complex distributed system with microservices',
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
  id: 'reddit-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Reddit', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles posts, votes, comments', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle Reddit features yet!",
  hook: "A user just tried to post 'Check out this cute cat!' to r/aww but got an error.",
  challenge: "Write the Python code to create posts, vote, and get feeds.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle Reddit content!',
  achievement: 'You implemented the core Reddit functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can create posts', after: '✓' },
    { label: 'Can vote', after: '✓' },
    { label: 'Can get feed', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all posts and votes are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Reddit Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For Reddit, we need handlers for:
- \`create_post()\` - Submit a new post to a subreddit
- \`vote()\` - Upvote or downvote a post/comment
- \`get_feed()\` - Fetch posts from subreddits (hot/top/new)

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just a fancy paperweight. This is where the magic happens!',

  famousIncident: {
    title: 'The Great Reddit Downtime',
    company: 'Reddit',
    year: '2015',
    whatHappened: 'Reddit went down for hours because a simple code deployment broke the voting system. Millions of users couldn\'t upvote or comment.',
    lessonLearned: 'Core handlers must be rock-solid and well-tested. Start simple, test thoroughly.',
    icon: '🔴',
  },

  realWorldExample: {
    company: 'Reddit',
    scenario: 'Processing 10 million comments per day',
    howTheyDoIt: 'Uses Python handlers with async processing. Vote aggregation happens in background jobs.',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Vote calculation: score = upvotes - downvotes',
    'Handle edge cases (subreddit not found, duplicate vote, etc.)',
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
    { title: 'Vote Score', explanation: 'upvotes - downvotes = score', icon: '📊' },
  ],
};

const step2: GuidedStep = {
  id: 'reddit-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-2: Users can post content, FR-3: Users can vote',
    taskDescription: 'Configure APIs and implement Python handlers for posting, voting, and feeds',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/posts, POST /api/v1/vote, and GET /api/v1/feed APIs',
      'Open the Python tab',
      'Implement create_post(), vote(), and get_feed() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for create_post, vote, and get_feed',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/posts', 'POST /api/v1/vote', 'GET /api/v1/feed'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 2 AM. Your server crashed during a deployment...",
  hook: "When it came back online, ALL the posts, votes, and comments were GONE! Years of content, vanished.",
  challenge: "Add a database so data survives server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your content is safe forever!',
  achievement: 'Data now persists across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But vote counts are slow to update as traffic grows...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For Reddit, we need tables for:
- \`subreddits\` - Community information
- \`posts\` - All submitted posts
- \`comments\` - Nested comment trees
- \`votes\` - User votes on posts/comments
- \`users\` - User accounts and karma`,

  whyItMatters: 'Imagine losing all of r/AskReddit\'s history because of a server restart. Users would riot!',

  famousIncident: {
    title: 'Reddit Database Corruption',
    company: 'Reddit',
    year: '2010',
    whatHappened: 'A database corruption bug caused Reddit to lose several hours of posts and comments. They had backups but still lost recent data.',
    lessonLearned: 'Persistent storage with proper backups AND replication is non-negotiable.',
    icon: '💀',
  },

  realWorldExample: {
    company: 'Reddit',
    scenario: 'Storing 2 million posts per day',
    howTheyDoIt: 'Uses PostgreSQL with Cassandra for some high-volume data. Partitioned by subreddit for horizontal scaling.',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL) for structured data like posts and comments',
    'Connect App Server to Database for read/write operations',
    'Use foreign keys to link posts → subreddits → users → votes',
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
    { title: 'Foreign Keys', explanation: 'Link related data across tables', icon: '🔗' },
  ],
};

const step3: GuidedStep = {
  id: 'reddit-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store subreddits, posts, comments, votes, users permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Hot Posts
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 5 million users, and subreddit feeds are loading in 3+ seconds!",
  hook: "Users are complaining: 'Why is Reddit so slow?' Every feed request recalculates the hot ranking.",
  challenge: "Add a cache to store pre-computed hot posts and vote counts.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Feeds load 30x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Feed latency', before: '3000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "But what happens when traffic spikes during major news events?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Pre-Compute the Hot Algorithm',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

For Reddit, we cache:
- **Hot posts per subreddit** - Pre-computed rankings (expensive to calculate)
- **Vote counts** - Aggregated upvotes/downvotes
- **Comment counts** - How many comments on each post

Instead of:
\`\`\`
Request → Calculate hot score for 1000s of posts (slow, 3s)
\`\`\`

You get:
\`\`\`
Request → Cache (instant, 100ms) → Pre-computed rankings
\`\`\``,

  whyItMatters: 'At 694K reads/sec peak, recalculating hot rankings on every request would melt the database.',

  famousIncident: {
    title: 'Reddit "Hug of Death"',
    company: 'Reddit',
    year: 'Ongoing',
    whatHappened: 'When a popular post links to a small website, millions of Reddit users click it simultaneously, overwhelming the site and taking it down. This became known as the "Reddit hug of death".',
    lessonLearned: 'Reddit\'s traffic is immense. Caching prevents your own site from dying the same way.',
    icon: '🫂',
  },

  realWorldExample: {
    company: 'Reddit',
    scenario: 'Serving 20 billion page views per day',
    howTheyDoIt: 'Uses Redis and Memcached heavily. Hot rankings are pre-computed every few minutes and cached.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (95% of requests)
                     │   Return hot posts instantly!
`,

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache pre-computed hot rankings (not raw data)',
    'Set TTL to 60 seconds - rankings update every minute',
    'Cache vote counts to avoid expensive COUNT queries',
  ],

  quickCheck: {
    question: 'Why cache the hot ranking instead of recalculating it each time?',
    options: [
      'It uses less memory',
      'Hot algorithm is computationally expensive - caching saves CPU',
      'Databases can\'t calculate rankings',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'The hot algorithm (Wilson score) is complex. Calculating it for 1000s of posts per request would be too slow.',
  },

  keyConcepts: [
    { title: 'Hot Algorithm', explanation: 'Ranks posts by score + recency', icon: '🔥' },
    { title: 'Pre-Computation', explanation: 'Calculate rankings ahead of time', icon: '⏰' },
    { title: 'Cache TTL', explanation: 'How long cached data stays fresh', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'reddit-step-4',
  stepNumber: 4,
  frIndex: 4,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-5: Users can view feeds (now fast with hot rankings!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache hot posts, vote counts, comment counts', displayName: 'Redis Cache' },
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
  scenario: "Breaking news hit the front page! Traffic spiked 10x in minutes.",
  hook: "Your single app server is maxed out at 100% CPU. Requests are timing out.",
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
  nextTeaser: "But we still only have one database - what if it fails?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Handle Traffic Spikes',
  conceptExplanation: `A **Load Balancer** sits in front of your app servers and distributes incoming requests.

Benefits:
- **No single point of failure** - if one server dies, others keep working
- **Horizontal scaling** - add more servers to handle more traffic
- **Even distribution** - no single server gets overwhelmed

Common strategies:
- Round-robin: Take turns
- Least connections: Send to least busy server
- IP hash: Same user always goes to same server`,

  whyItMatters: 'At peak, Reddit handles 694K requests/second. No single server can handle that alone.',

  famousIncident: {
    title: 'Reddit Place Overload',
    company: 'Reddit',
    year: '2017 & 2022',
    whatHappened: 'r/Place - a collaborative pixel art canvas - caused massive traffic spikes. Load balancers automatically distributed the load, but even with scaling, the site slowed significantly.',
    lessonLearned: 'Load balancers are essential, but you still need adequate capacity behind them.',
    icon: '🎨',
  },

  realWorldExample: {
    company: 'Reddit',
    scenario: 'Handling 694K requests/second at peak',
    howTheyDoIt: 'Uses multiple layers of load balancers with auto-scaling to handle viral events',
  },

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
    explanation: 'Load balancers detect unhealthy servers via health checks and automatically route traffic to healthy ones.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Health Checks', explanation: 'Monitor server availability', icon: '💓' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
  ],
};

const step5: GuidedStep = {
  id: 'reddit-step-5',
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
  scenario: "Your database crashed at 3 PM. EVERYTHING stopped for 10 minutes.",
  hook: "Users couldn't post, vote, comment, or even browse. Revenue loss: $100,000.",
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
  nextTeaser: "But vote count updates are causing database bottlenecks...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Never Lose Data',
  conceptExplanation: `**Replication** copies your data to multiple database servers.

Types:
- **Primary (Leader)**: Handles all writes
- **Replicas (Followers)**: Handle reads, stay in sync with primary

Benefits:
- **High availability**: If primary fails, replica takes over
- **Read scaling**: Distribute reads across replicas
- **Data safety**: Multiple copies of your data

For Reddit:
- Writes (posts, votes) go to primary
- Reads (feed queries) distributed across replicas`,

  whyItMatters: 'A single database is a single point of failure. For Reddit\'s 20B page views/day, downtime costs millions.',

  famousIncident: {
    title: 'Reddit Database Outage',
    company: 'Reddit',
    year: '2018',
    whatHappened: 'A database failover failed, causing Reddit to go down for 4 hours. The replica wasn\'t properly synced, causing data inconsistencies.',
    lessonLearned: 'Replication setup matters. Test your failover process regularly.',
    icon: '🔻',
  },

  realWorldExample: {
    company: 'Reddit',
    scenario: 'Zero tolerance for data loss',
    howTheyDoIt: 'Uses PostgreSQL with multiple replicas. Read queries distributed across replicas for load distribution.',
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
    'Replication adds some latency (acceptable for Reddit)',
    'Use at least 2 replicas for high availability',
  ],

  quickCheck: {
    question: 'Why is replication especially important for Reddit\'s read-heavy workload?',
    options: [
      'It makes writes faster',
      'It allows distributing 694K read requests/sec across multiple databases',
      'It reduces storage costs',
      'It simplifies the codebase',
    ],
    correctIndex: 1,
    explanation: 'With 1650:1 read-to-write ratio, replicas let you scale reads without overloading the primary.',
  },

  keyConcepts: [
    { title: 'Primary', explanation: 'The database that handles writes', icon: '👑' },
    { title: 'Replica', explanation: 'Read-only copy that stays in sync', icon: '📋' },
    { title: 'Read Scaling', explanation: 'Distribute read load across replicas', icon: '📖' },
  ],
};

const step6: GuidedStep = {
  id: 'reddit-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs need reliable data storage',
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
    level2: 'Enable replication and set replicas to 2. This creates read copies of your data.',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Message Queue for Vote Aggregation
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📊',
  scenario: "A post on r/all is getting 10,000 votes per minute!",
  hook: "The database is struggling to update vote counts synchronously. The site is slowing down.",
  challenge: "Add a message queue to aggregate votes asynchronously.",
  illustration: 'vote-storm',
};

const step7Celebration: CelebrationContent = {
  emoji: '📨',
  message: 'Vote processing is now lightning fast!',
  achievement: 'Async vote aggregation handles viral posts efficiently',
  metrics: [
    { label: 'Vote latency', before: '1s', after: '<100ms' },
    { label: 'Vote throughput', before: '100/s', after: '10,000/s' },
  ],
  nextTeaser: "But the infrastructure costs are getting too high...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Eventual Consistency for Votes',
  conceptExplanation: `The **vote aggregation problem**:
- When a post goes viral, it gets thousands of votes per minute
- Updating the vote count synchronously for each vote is too slow
- We need **eventual consistency**: votes register instantly for the user, but the total count updates within seconds

**Synchronous**: Vote → Update DB count → Return ❌ (too slow, creates bottleneck)
**Async with Queue**: Vote → Add to queue → Return ✓ (instant)
- Background workers consume queue
- Aggregate votes in batches (every 5 seconds)
- Update post score and user karma together`,

  whyItMatters: 'Without async processing, viral posts would create database hotspots and slow the entire site.',

  famousIncident: {
    title: 'Reddit Vote Manipulation Challenges',
    company: 'Reddit',
    year: 'Ongoing',
    whatHappened: 'Reddit constantly battles vote manipulation (bots, brigading). The eventual consistency model helps - they can apply fraud detection in the vote processing pipeline before updating counts.',
    lessonLearned: 'Async vote processing enables fraud detection and rate limiting.',
    icon: '🤖',
  },

  realWorldExample: {
    company: 'Reddit',
    scenario: 'Processing millions of votes per hour',
    howTheyDoIt: 'Uses RabbitMQ/Kafka for vote events. Workers aggregate votes, update scores, calculate karma, and detect manipulation.',
  },

  diagram: `
User Votes on Post
      │
      ▼
┌─────────────┐     ┌─────────────────────────────────────┐
│ App Server  │────▶│          Message Queue              │
│ (instant)   │     │  [vote1, vote2, vote3, ...]         │
└─────────────┘     └──────────────┬──────────────────────┘
      │                            │
      │ Return                     │ Workers consume
      ▼ "Voted!"                   ▼
                          ┌─────────────────┐
                          │  Vote Workers   │
                          │  (aggregate     │
                          │   every 5s)     │
                          └────────┬────────┘
                                   │
                          Update scores & karma
                                   │
                                   ▼
                          ┌──────────────┐
                          │   Database   │
                          └──────────────┘
`,

  keyPoints: [
    'Message queue decouples vote registration from count updates',
    'User gets instant feedback - aggregation happens in background',
    'Workers process votes in batches for efficiency',
    'Enables fraud detection before updating counts',
  ],

  quickCheck: {
    question: 'Why use eventual consistency for vote counts instead of strong consistency?',
    options: [
      'It\'s easier to implement',
      'It allows for much higher vote throughput and fraud detection',
      'It uses less storage',
      'It\'s more accurate',
    ],
    correctIndex: 1,
    explanation: 'Eventual consistency means we can handle 10,000s of votes/sec without database bottlenecks, and apply fraud detection.',
  },

  keyConcepts: [
    { title: 'Eventual Consistency', explanation: 'Data updates propagate over time', icon: '⏳' },
    { title: 'Vote Aggregation', explanation: 'Batch process votes for efficiency', icon: '📦' },
    { title: 'Karma Calculation', explanation: 'User reputation from upvotes', icon: '⭐' },
  ],
};

const step7: GuidedStep = {
  id: 'reddit-step-7',
  stepNumber: 7,
  frIndex: 2,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-3: Users can vote (now with async aggregation and karma)',
    taskDescription: 'Add a Message Queue for async vote processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle vote aggregation and karma calculation asynchronously', displayName: 'RabbitMQ' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Drag a Message Queue (RabbitMQ or Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async vote aggregation.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Your monthly cloud bill is $500,000.",
  hook: "The CFO says: 'Cut costs by 30% or we're shutting down features.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Reddit!',
  achievement: 'A scalable, cost-effective social news platform',
  metrics: [
    { label: 'Monthly cost', before: '$500K', after: 'Under budget' },
    { label: 'Feed latency', after: '<300ms' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Can handle', after: '694K req/sec' },
  ],
  nextTeaser: "You've mastered Reddit system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies for Reddit:
1. **Right-size instances** - Don't over-provision app servers
2. **Aggressive caching** - Reduce expensive database reads (1650:1 ratio!)
3. **Hot/cold data separation** - Archive old posts to cheaper storage
4. **Auto-scale** - Scale down during low traffic hours (Reddit quieter at night)
5. **Optimize vote processing** - Batch aggregation saves DB writes

For Reddit specifically:
- Cache hot rankings aggressively (update every 60s, not real-time)
- Archive posts older than 6 months to cold storage
- Use spot instances for vote processing workers
- Scale app servers based on time of day`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it.',

  famousIncident: {
    title: 'Reddit Server Efficiency Initiative',
    company: 'Reddit',
    year: '2020',
    whatHappened: 'Reddit optimized their infrastructure by moving from AWS to their own data centers for hot data, while keeping AWS for burst capacity. Saved millions annually.',
    lessonLearned: 'At scale, even small optimizations save millions. Know your traffic patterns.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Reddit',
    scenario: 'Running 20B page views/day efficiently',
    howTheyDoIt: 'Hybrid cloud approach, aggressive caching (95%+ hit rate), auto-scaling based on time of day and events.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'Caching is crucial for Reddit (1650:1 read-heavy)',
    'Use auto-scaling to match traffic patterns',
    'Archive old content to cheaper storage tiers',
    'Batch processing (votes) reduces database load',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for Reddit\'s extremely read-heavy workload?',
    options: [
      'Use bigger database servers',
      'Aggressive caching to achieve 95%+ hit rate',
      'Delete old posts',
      'Reduce replica count',
    ],
    correctIndex: 1,
    explanation: 'With 1650:1 read-to-write ratio, a 95% cache hit rate means only 5% of reads hit the database - massive savings.',
  },

  keyConcepts: [
    { title: 'Cache Hit Rate', explanation: 'Percentage of reads served from cache', icon: '🎯' },
    { title: 'Hot/Cold Data', explanation: 'Recent vs archived content', icon: '🌡️' },
    { title: 'Auto-Scaling', explanation: 'Automatically adjust capacity', icon: '📊' },
  ],
};

const step8: GuidedStep = {
  id: 'reddit-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $400/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $400/month',
      'Maintain all performance requirements',
      'Keep cache hit rate above 90%',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component\'s configuration for over-provisioning. Focus on cache efficiency.',
    level2: 'Consider: Right-sized instances, cache TTL optimization, fewer replicas if needed. Keep the architecture intact.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const redditGuidedTutorial: GuidedTutorial = {
  problemId: 'reddit',
  title: 'Design Reddit',
  description: 'Build a social news platform with subreddits, voting, and nested comments',
  difficulty: 'advanced',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '🤖',
    hook: "You've been hired as Lead Engineer at Social Forum Corp!",
    scenario: "Your mission: Build a Reddit-like platform that can handle millions of users posting, voting, and discussing content across thousands of communities.",
    challenge: "Can you design a system that handles democratic voting and complex comment trees at scale?",
  },

  requirementsPhase: redditRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'Caching Strategies',
    'Load Balancing',
    'Database Replication',
    'Message Queues',
    'Eventual Consistency',
    'Vote Aggregation',
    'Hot Ranking Algorithm',
    'Nested Comment Trees',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 7: Transactions (eventual consistency)',
    'Chapter 8: Distributed Systems',
    'Chapter 11: Stream Processing (vote aggregation)',
  ],
};

export default redditGuidedTutorial;
