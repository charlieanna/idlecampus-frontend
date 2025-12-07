import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * StackOverflow Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a Q&A platform like StackOverflow.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (cache, search, queues, etc.)
 *
 * Key Concepts:
 * - Voting and reputation system
 * - Full-text search for questions
 * - Accepted answer mechanics
 * - Tag-based organization
 * - Gamification (badges, reputation)
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const stackoverflowRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a Q&A platform like StackOverflow",

  interviewer: {
    name: 'Alex Rivera',
    role: 'Principal Engineer at DevCommunity Inc.',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-qa',
      category: 'functional',
      question: "What's the core functionality users need from a Q&A platform?",
      answer: "Users want to:\n\n1. **Ask questions** - Post programming questions with code snippets and details\n2. **Answer questions** - Provide solutions and explanations\n3. **Vote on content** - Upvote helpful content, downvote unhelpful content\n4. **Browse questions** - Find questions by tags, search, or newest/hot/unanswered filters",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "StackOverflow is fundamentally about crowdsourcing knowledge through questions and answers",
    },
    {
      id: 'accepted-answer',
      category: 'functional',
      question: "How do users know which answer solved the problem?",
      answer: "The **accepted answer** system:\n1. Question author can mark ONE answer as 'accepted'\n2. Accepted answer appears at top (below question)\n3. Author gains reputation for having answer accepted\n4. Shows future visitors the validated solution",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Accepted answers create a hierarchy - validated solution rises above all others",
    },
    {
      id: 'tags-system',
      category: 'functional',
      question: "How do users organize and find questions by topic?",
      answer: "Through **tags**:\n1. Questions have 1-5 tags (e.g., javascript, python, django)\n2. Users can follow tags they're interested in\n3. Browse by tag to see all related questions\n4. Tags have descriptions and synonyms",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Tags are the organizational backbone - they enable topical communities",
    },
    {
      id: 'reputation-system',
      category: 'functional',
      question: "How does StackOverflow incentivize quality contributions?",
      answer: "The **reputation system**:\n- Question upvoted: +5 rep\n- Answer upvoted: +10 rep\n- Answer accepted: +15 rep\n- Question downvoted: -2 rep\n- Privileges unlock at rep thresholds (comment at 50, edit at 2000, etc.)\n\nThis gamifies quality contributions!",
      importance: 'important',
      revealsRequirement: 'FR-6',
      learningPoint: "Reputation is StackOverflow's secret sauce - it drives quality and engagement",
    },
    {
      id: 'comments',
      category: 'clarification',
      question: "Can users discuss questions and answers?",
      answer: "Yes, through **comments**:\n- Add comments to questions and answers for clarification\n- Comments are secondary to answers (smaller, less prominent)\n- Cannot vote on comments (only flag)\n\nFor MVP, basic commenting is sufficient.",
      importance: 'important',
      insight: "Comments enable discussion without cluttering answers",
    },
    {
      id: 'search-requirement',
      category: 'clarification',
      question: "How should users search for existing questions?",
      answer: "**Full-text search** is critical:\n- Search question titles and body text\n- Filter by tags, dates, votes\n- Suggest similar questions when asking (reduce duplicates)\n\nThis prevents duplicate questions and helps users find answers.",
      importance: 'critical',
      insight: "Search reduces duplicates and improves answer discoverability",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "100 million registered users, with 20 million monthly active users (MAU)",
      importance: 'critical',
      learningPoint: "Large scale - but less than social media platforms",
    },
    {
      id: 'throughput-questions',
      category: 'throughput',
      question: "How many questions and answers per day?",
      answer: "About 9,000 questions and 15,000 answers per day",
      importance: 'critical',
      calculation: {
        formula: "9K questions + 15K answers = 24K writes/day = 0.28 writes/sec",
        result: "~0.3 writes/sec (1 at peak)",
      },
      learningPoint: "Very low write volume - quality over quantity!",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many page views per day?",
      answer: "About 500 million page views per day from visitors finding answers via Google",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 reads/sec",
        result: "~5.8K reads/sec (17K at peak)",
      },
      learningPoint: "Extremely read-heavy (20,000:1 read-to-write ratio) - caching critical!",
    },
    {
      id: 'search-performance',
      category: 'latency',
      question: "How fast should search results appear?",
      answer: "Search results should load in under 300ms (p99). Users expect instant results when searching for answers.",
      importance: 'critical',
      learningPoint: "Search is the primary discovery mechanism - must be fast",
    },
    {
      id: 'seo-requirement',
      category: 'latency',
      question: "How important is SEO for StackOverflow?",
      answer: "CRITICAL! 90% of traffic comes from Google search. Pages must:\n- Load fast (under 500ms p99)\n- Be crawlable by search engines\n- Have clean URLs (/questions/12345/how-to-reverse-a-string)\n- Include structured data for rich snippets",
      importance: 'critical',
      learningPoint: "SEO drives StackOverflow's growth - Google is the main discovery channel",
    },
    {
      id: 'vote-aggregation',
      category: 'latency',
      question: "When someone upvotes an answer, how quickly should the vote count update?",
      answer: "Vote counts can be **eventually consistent**:\n- User sees their vote instantly\n- Total count updates within a few seconds\n- At scale, exact counts can lag slightly (acceptable trade-off)\n\nThis enables better performance.",
      importance: 'important',
      learningPoint: "Eventual consistency is acceptable for vote counts",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-qa', 'accepted-answer', 'tags-system'],
  criticalFRQuestionIds: ['core-qa', 'accepted-answer'],
  criticalScaleQuestionIds: ['throughput-reads', 'search-performance', 'seo-requirement'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can ask questions',
      description: 'Post programming questions with details and code',
      emoji: '❓',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can post answers',
      description: 'Provide solutions and explanations to questions',
      emoji: '💡',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can vote on questions and answers',
      description: 'Upvote helpful content, downvote unhelpful content',
      emoji: '⬆️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Question author can accept an answer',
      description: 'Mark one answer as the validated solution',
      emoji: '✅',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Questions can be tagged',
      description: 'Organize questions by topic (javascript, python, etc.)',
      emoji: '🏷️',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Users earn reputation from contributions',
      description: 'Gain points from upvotes and accepted answers',
      emoji: '⭐',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '20 million monthly',
    writesPerDay: '9K questions + 15K answers',
    readsPerDay: '500 million page views',
    peakMultiplier: 3,
    readWriteRatio: '20,833:1',
    calculatedWriteRPS: { average: 0.28, peak: 0.84 },
    calculatedReadRPS: { average: 5787, peak: 17361 },
    maxPayloadSize: '~30KB (question with code)',
    storagePerRecord: '~5KB (question/answer)',
    storageGrowthPerYear: '~438GB',
    redirectLatencySLA: 'p99 < 500ms (page load)',
    createLatencySLA: 'p99 < 1s (post question/answer)',
  },

  architecturalImplications: [
    '✅ Extremely read-heavy (20,833:1) → Aggressive caching CRITICAL',
    '✅ 17K reads/sec peak → CDN + multiple app servers',
    '✅ SEO critical → Fast page loads, clean URLs, server-side rendering',
    '✅ Full-text search → Elasticsearch for question/answer search',
    '✅ Vote aggregation → Message queue for async processing',
    '✅ Reputation calculation → Background jobs for score updates',
  ],

  outOfScope: [
    'Chat functionality',
    'Jobs board',
    'Teams (private Q&A)',
    'Collective/Articles',
    'Multi-language support',
    'Advanced moderation tools',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can ask questions, post answers, vote, and search. The reputation system and vote aggregation challenges will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📚',
  scenario: "Welcome to DevCommunity Inc! You've been hired to build the next StackOverflow.",
  hook: "A developer just signed up with their first question: 'How do I reverse a string in Python?'",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your Q&A platform is online!',
  achievement: 'Users can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server is empty... let's write some code to handle questions and answers!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every web application starts with a **Client** connecting to a **Server**.

When a user visits StackOverflow:
1. Their browser is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back HTML/JSON
4. User sees questions, answers, and can interact

This is the foundation of ALL web applications!`,

  whyItMatters: 'Without this connection, users can\'t ask questions or find answers.',

  realWorldExample: {
    company: 'StackOverflow',
    scenario: 'Handling 500 million page views per day',
    howTheyDoIt: 'Started with ASP.NET MVC in 2008, now uses a highly optimized .NET stack with aggressive caching',
  },

  keyPoints: [
    'Client = the user\'s browser',
    'App Server = your backend that handles Q&A logic',
    'HTTP = the protocol they use to communicate',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'User\'s browser making requests', icon: '🌐' },
    { title: 'App Server', explanation: 'Backend handling Q&A logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'stackoverflow-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing StackOverflow', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles questions, answers, votes', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle Q&A yet!",
  hook: "A user just tried to post 'How do I reverse a string in Python?' but got an error.",
  challenge: "Write the Python code to create questions, post answers, and handle votes.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle Q&A!',
  achievement: 'You implemented the core StackOverflow functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can ask questions', after: '✓' },
    { label: 'Can post answers', after: '✓' },
    { label: 'Can vote', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all questions and answers are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Q&A Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For StackOverflow, we need handlers for:
- \`ask_question()\` - Create a new question with tags
- \`post_answer()\` - Submit an answer to a question
- \`vote()\` - Upvote or downvote questions/answers
- \`accept_answer()\` - Mark an answer as accepted

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just a shell. This is where the Q&A magic happens!',

  famousIncident: {
    title: 'The Great Overflow',
    company: 'StackOverflow',
    year: '2013',
    whatHappened: 'A bug in the voting system caused vote counts to become negative. Thousands of questions showed "-42 votes". Took hours to fix and recalculate all scores.',
    lessonLearned: 'Vote calculations must be atomic and validated. Start simple, test thoroughly.',
    icon: '🔻',
  },

  realWorldExample: {
    company: 'StackOverflow',
    scenario: 'Processing thousands of questions and answers daily',
    howTheyDoIt: 'Uses ASP.NET handlers with SQL Server. Vote aggregation happens in background jobs for performance.',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Vote score = upvotes - downvotes',
    'Accepted answer is a flag on the answer object',
    'Handle edge cases (duplicate votes, invalid question IDs)',
  ],

  quickCheck: {
    question: 'Why store votes separately from questions/answers initially?',
    options: [
      'It uses less memory',
      'Easier to aggregate and validate - prevent duplicate votes',
      'Votes are more important',
      'Required by the database',
    ],
    correctIndex: 1,
    explanation: 'Separate vote records let us validate (one vote per user per post) and aggregate efficiently.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'Vote Score', explanation: 'upvotes - downvotes = score', icon: '📊' },
    { title: 'Accepted Answer', explanation: 'Boolean flag marking the solution', icon: '✅' },
  ],
};

const step2: GuidedStep = {
  id: 'stackoverflow-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Ask questions, FR-2: Post answers, FR-3: Vote, FR-4: Accept answers',
    taskDescription: 'Configure APIs and implement Python handlers for Q&A operations',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/questions, POST /api/v1/answers, POST /api/v1/vote, POST /api/v1/accept APIs',
      'Open the Python tab',
      'Implement ask_question(), post_answer(), vote(), and accept_answer() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for ask_question, post_answer, vote, and accept_answer',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/questions', 'POST /api/v1/answers', 'POST /api/v1/vote', 'POST /api/v1/accept'] } },
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
  hook: "When it came back online, ALL questions and answers were GONE! 50,000 Q&As, vanished.",
  challenge: "Add a database so knowledge survives server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your knowledge base is safe forever!',
  achievement: 'Data now persists across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But browsing questions is getting slow as the site grows...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For StackOverflow, we need tables for:
- \`users\` - User accounts and reputation
- \`questions\` - All questions with tags
- \`answers\` - All answers with accepted flag
- \`votes\` - User votes on questions/answers
- \`tags\` - Tag definitions and descriptions
- \`comments\` - Comments on questions/answers`,

  whyItMatters: 'Imagine losing 10 years of programming knowledge because of a server restart. The community would never trust you again!',

  famousIncident: {
    title: 'StackOverflow Database Corruption',
    company: 'StackOverflow',
    year: '2016',
    whatHappened: 'A SQL Server update caused corruption in the votes table. Vote counts were incorrect for 2 hours. Had to recalculate all scores from backup.',
    lessonLearned: 'Persistent storage with tested backups and transaction logs is non-negotiable.',
    icon: '💀',
  },

  realWorldExample: {
    company: 'StackOverflow',
    scenario: 'Storing 23 million questions and 35 million answers',
    howTheyDoIt: 'Uses SQL Server with extensive indexing on tags, votes, and timestamps. Foreign keys link questions → answers → votes.',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL/SQL Server) for structured Q&A data',
    'Tables: users, questions, answers, votes, tags, comments',
    'Foreign keys maintain referential integrity (answers belong to questions)',
  ],

  quickCheck: {
    question: 'Why use a relational database for StackOverflow?',
    options: [
      'It\'s faster than NoSQL',
      'Q&A data has clear relationships (questions → answers → votes)',
      'It\'s easier to set up',
      'NoSQL doesn\'t support text',
    ],
    correctIndex: 1,
    explanation: 'Q&A data has strong relationships. SQL databases excel at joins (get question with all answers and votes).',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'SQL Database', explanation: 'Structured tables with relationships', icon: '🗄️' },
    { title: 'Foreign Keys', explanation: 'Link answers to questions', icon: '🔗' },
  ],
};

const step3: GuidedStep = {
  id: 'stackoverflow-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store questions, answers, votes, tags, users permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Question Pages
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 1 million questions, and pages are loading in 3+ seconds!",
  hook: "Users are complaining: 'StackOverflow is so slow!' Every page view recalculates vote counts from the database.",
  challenge: "Add a cache to make question pages load instantly.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Question pages load 30x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Page load time', before: '3000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '98%' },
  ],
  nextTeaser: "But what happens when traffic spikes from a viral question?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Speed Up Read-Heavy Workloads',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

StackOverflow is EXTREMELY read-heavy (20,833:1 ratio!). Most users are **reading** answers found via Google, not posting new questions.

For StackOverflow, we cache:
- **Rendered question pages** - Full HTML or JSON
- **Vote counts** - Aggregated upvotes/downvotes
- **User reputation** - Calculated scores
- **Popular tags** - Tag lists and counts

Cache Strategy:
1. Check cache first
2. On hit: return immediately (1ms)
3. On miss: query DB, render, store in cache, return
4. Set TTL (Time To Live) to keep data fresh`,

  whyItMatters: 'At 17K reads/sec peak, hitting the database for every page would melt it. Caching is essential for StackOverflow\'s success.',

  famousIncident: {
    title: 'The Day StackOverflow Went Down',
    company: 'StackOverflow',
    year: '2019',
    whatHappened: 'A regex in a tag processing routine caused 100% CPU spike on all app servers. Cache couldn\'t help - the app was frozen. Site down for 34 minutes.',
    lessonLearned: 'Caching helps with database load, but can\'t save you from application-level bugs.',
    icon: '🔥',
  },

  realWorldExample: {
    company: 'StackOverflow',
    scenario: 'Serving 500 million page views per day',
    howTheyDoIt: 'Uses Redis heavily for rendered HTML fragments, vote counts, and user sessions. 98%+ cache hit rate!',
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
    'Cache rendered question pages and vote counts',
    'StackOverflow is read-heavy - caching is CRITICAL',
    'Set TTL to 300 seconds (vote counts can lag slightly)',
  ],

  quickCheck: {
    question: 'Why is caching especially important for StackOverflow?',
    options: [
      'It makes the database faster',
      'Extremely read-heavy (20,833:1) - most users just read cached answers',
      'It\'s required for voting',
      'It reduces storage costs',
    ],
    correctIndex: 1,
    explanation: 'With 20,833:1 read-to-write ratio, almost all traffic is reading existing answers. Caching avoids database queries.',
  },

  keyConcepts: [
    { title: 'Read-Heavy', explanation: 'Far more reads than writes', icon: '📖' },
    { title: 'Cache Hit Rate', explanation: 'Percentage served from cache', icon: '🎯' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'stackoverflow-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from fast page loads',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache question pages and vote counts', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (300 seconds)',
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
    level2: 'Connect App Server to Cache. Then click Cache and set TTL to 300 seconds, strategy to cache-aside',
    solutionComponents: [{ type: 'cache', config: { ttl: 300, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "A question went viral on Twitter! Traffic spiked 20x in minutes.",
  hook: "Your single app server is maxed out at 100% CPU. Users are getting timeouts.",
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
  nextTeaser: "But users can't find questions effectively...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Handle Traffic Spikes',
  conceptExplanation: `A **Load Balancer** sits in front of your app servers and distributes incoming requests.

Benefits:
- **No single point of failure** - if one server dies, others keep working
- **Horizontal scaling** - add more servers to handle more traffic
- **Even distribution** - no single server gets overwhelmed

For StackOverflow:
- Viral questions can drive huge traffic spikes
- Most traffic comes from Google (unpredictable)
- Load balancer ensures smooth experience`,

  whyItMatters: 'At peak, StackOverflow handles 17K requests/second. No single server can handle that alone.',

  famousIncident: {
    title: 'The jQuery Documentation Incident',
    company: 'StackOverflow',
    year: '2011',
    whatHappened: 'jQuery\'s official documentation went down. They redirected to StackOverflow. Traffic spiked 10x instantly. Load balancers saved the day!',
    lessonLearned: 'Load balancers are essential for handling unpredictable traffic spikes.',
    icon: '📚',
  },

  realWorldExample: {
    company: 'StackOverflow',
    scenario: 'Handling 17K requests/second at peak',
    howTheyDoIt: 'Uses HAProxy load balancers distributing across multiple app servers. Auto-scales based on traffic.',
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
      'The database crashes too',
    ],
    correctIndex: 1,
    explanation: 'Load balancers detect unhealthy servers via health checks and route traffic to healthy ones.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Health Checks', explanation: 'Monitor server availability', icon: '💓' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
  ],
};

const step5: GuidedStep = {
  id: 'stackoverflow-step-5',
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
// STEP 6: Add Search with Elasticsearch
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔍',
  scenario: "Users are frustrated: 'I can't find the answer I need!'",
  hook: "Database SQL LIKE queries are too slow and inaccurate. Search is timing out!",
  challenge: "Add Elasticsearch to enable fast, accurate question search.",
  illustration: 'search-feature',
};

const step6Celebration: CelebrationContent = {
  emoji: '🔎',
  message: 'Search is now lightning fast!',
  achievement: 'Users can find answers instantly',
  metrics: [
    { label: 'Search latency', before: '5s', after: '<100ms' },
    { label: 'Search accuracy', after: '95%' },
    { label: 'Duplicate questions', after: 'Down 40%' },
  ],
  nextTeaser: "But vote count updates are creating database bottlenecks...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Full-Text Search: Finding Needles in Haystacks',
  conceptExplanation: `Regular databases are terrible at text search. Try finding all questions about "reverse string" in PostgreSQL - it's slow and inaccurate!

**Elasticsearch** is optimized for:
- **Full-text search** - Find questions by keywords
- **Fuzzy matching** - Typos still find results
- **Ranking** - Most relevant results first
- **Faceted search** - Filter by tags, votes, dates
- **Autocomplete** - Suggest as you type

For StackOverflow:
1. When a question is posted, index it in Elasticsearch
2. Search queries go to Elasticsearch, not the database
3. Return ranked results in <100ms
4. Suggest similar questions to reduce duplicates`,

  whyItMatters: 'Search is critical for StackOverflow. Users need to find existing answers before asking duplicates. 90% of traffic comes from Google search!',

  famousIncident: {
    title: 'The Great Duplicate Question Problem',
    company: 'StackOverflow',
    year: '2010-2012',
    whatHappened: 'Poor search led to massive duplicate questions. Community spent hours marking duplicates. Improved search reduced duplicates by 60%.',
    lessonLearned: 'Good search prevents duplicates and improves content quality.',
    icon: '🔂',
  },

  realWorldExample: {
    company: 'StackOverflow',
    scenario: 'Searching 23 million questions',
    howTheyDoIt: 'Uses Elasticsearch to index all questions and answers. Results in <100ms. Suggests similar questions when asking.',
  },

  diagram: `
Question Posted
      │
      ▼
┌─────────────┐
│ App Server  │
└──────┬──────┘
       │
       ├──────▶ Database (store question)
       │
       └──────▶ Elasticsearch (index for search)

User Searches
      │
      ▼
┌─────────────┐
│ App Server  │ ──▶ Elasticsearch (search index)
└─────────────┘         │
       │                │
       │         Return ranked results
       │                │
       └────────────────┘
`,

  keyPoints: [
    'Elasticsearch is optimized for full-text search',
    'Index questions when they\'re created',
    'Search queries go to Elasticsearch, not database',
    'Rank results by relevance (votes, date, tags)',
    'Suggest similar questions to prevent duplicates',
  ],

  quickCheck: {
    question: 'Why use Elasticsearch instead of database search?',
    options: [
      'It\'s free',
      'It\'s optimized for full-text search with ranking and fuzzy matching',
      'It stores more data',
      'It\'s easier to set up',
    ],
    correctIndex: 1,
    explanation: 'Databases do LIKE queries slowly. Elasticsearch is built for text search with inverted indexes and relevance ranking.',
  },

  keyConcepts: [
    { title: 'Full-Text Search', explanation: 'Find documents by keywords', icon: '📄' },
    { title: 'Inverted Index', explanation: 'Map words to questions', icon: '📇' },
    { title: 'Relevance Ranking', explanation: 'Best matches first', icon: '🏆' },
  ],
};

const step6: GuidedStep = {
  id: 'stackoverflow-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from fast, accurate search',
    taskDescription: 'Add Elasticsearch for full-text search',
    componentsNeeded: [
      { type: 'search', reason: 'Enable fast full-text search of questions and answers', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Search component (Elasticsearch) added',
      'App Server connected to Search',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'search'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'search' },
    ],
  },

  hints: {
    level1: 'Drag a Search (Elasticsearch) component onto the canvas',
    level2: 'Connect App Server to Search. Questions will be indexed for search.',
    solutionComponents: [{ type: 'search' }],
    solutionConnections: [{ from: 'app_server', to: 'search' }],
  },
};

// =============================================================================
// STEP 7: Add Message Queue for Vote Aggregation and Reputation
// =============================================================================

const step7Story: StoryContent = {
  emoji: '⬆️',
  scenario: "A popular answer is getting 1,000 upvotes per hour!",
  hook: "The database is struggling to update vote counts and user reputation synchronously. Pages are slowing down!",
  challenge: "Add a message queue to process votes and reputation asynchronously.",
  illustration: 'vote-storm',
};

const step7Celebration: CelebrationContent = {
  emoji: '📨',
  message: 'Vote processing is now instant!',
  achievement: 'Async processing handles votes and reputation efficiently',
  metrics: [
    { label: 'Vote latency', before: '2s', after: '<100ms' },
    { label: 'Reputation updates', after: 'Real-time' },
    { label: 'Vote throughput', before: '10/s', after: '1,000/s' },
  ],
  nextTeaser: "But the infrastructure costs are getting too high...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Async Vote Processing and Reputation',
  conceptExplanation: `The **vote aggregation problem**:
- When an answer gets hundreds of upvotes, updating counts synchronously is slow
- We also need to update user reputation (+10 per answer upvote)
- Doing this synchronously would block the vote response

**Solution: Message Queue**
1. User votes → Add to queue → Return "Voted!" instantly ✅
2. Background workers consume queue
3. Update vote counts in batches
4. Calculate and update user reputation
5. Invalidate cached question pages

This is **eventual consistency**: Vote count updates within seconds, not instantly.

**Reputation Calculation:**
- Question upvote: +5 rep
- Answer upvote: +10 rep
- Answer accepted: +15 rep
- Downvote penalty: -2 rep
- Workers process these and update user.reputation`,

  whyItMatters: 'Without async processing, viral answers would create database hotspots and slow the entire site.',

  famousIncident: {
    title: 'The Reputation Recalculation',
    company: 'StackOverflow',
    year: '2019',
    whatHappened: 'StackOverflow removed reputation for documentation. Had to recalculate millions of user reputations. Async job took 3 days to complete!',
    lessonLearned: 'Async vote and reputation processing enables bulk operations without downtime.',
    icon: '🔄',
  },

  realWorldExample: {
    company: 'StackOverflow',
    scenario: 'Processing thousands of votes per hour',
    howTheyDoIt: 'Uses message queues for vote events. Workers aggregate votes, update scores, and recalculate reputation scores.',
  },

  diagram: `
User Votes on Answer
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
                          │   votes & rep)  │
                          └────────┬────────┘
                                   │
                          Update counts & reputation
                                   │
                                   ▼
                          ┌──────────────┐
                          │   Database   │
                          └──────────────┘
`,

  keyPoints: [
    'Message queue decouples voting from count updates',
    'User gets instant feedback - aggregation happens in background',
    'Workers process votes in batches for efficiency',
    'Calculate reputation: upvotes, downvotes, accepted answers',
    'Invalidate cache after updating counts',
  ],

  quickCheck: {
    question: 'Why use eventual consistency for vote counts instead of strong consistency?',
    options: [
      'It\'s easier to implement',
      'It allows for much higher vote throughput and reputation calculation',
      'It uses less storage',
      'It\'s more accurate',
    ],
    correctIndex: 1,
    explanation: 'Eventual consistency means we can handle 1,000s of votes/hour without database bottlenecks, and calculate reputation efficiently.',
  },

  keyConcepts: [
    { title: 'Eventual Consistency', explanation: 'Data updates propagate over time', icon: '⏳' },
    { title: 'Vote Aggregation', explanation: 'Batch process votes for efficiency', icon: '📦' },
    { title: 'Reputation', explanation: 'User score from contributions', icon: '⭐' },
  ],
};

const step7: GuidedStep = {
  id: 'stackoverflow-step-7',
  stepNumber: 7,
  frIndex: 2,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-3: Vote on content, FR-6: Earn reputation (now with async processing)',
    taskDescription: 'Add a Message Queue for async vote and reputation processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle vote aggregation and reputation calculation asynchronously', displayName: 'RabbitMQ' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'search', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'search' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue (RabbitMQ or Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async vote and reputation processing.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Your monthly cloud bill is $400,000.",
  hook: "The CFO says: 'Cut costs by 30% or we need to run ads everywhere.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built StackOverflow!',
  achievement: 'A scalable, cost-effective Q&A platform',
  metrics: [
    { label: 'Monthly cost', before: '$400K', after: 'Under budget' },
    { label: 'Page load time', after: '<500ms' },
    { label: 'Search latency', after: '<100ms' },
    { label: 'Availability', after: '99.95%' },
    { label: 'Cache hit rate', after: '98%' },
  ],
  nextTeaser: "You've mastered StackOverflow system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Efficiency at Scale',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

**Cost optimization strategies for StackOverflow:**

1. **Aggressive Caching (98%+ hit rate)**
   - Cache rendered question pages
   - Cache vote counts and reputation
   - Most users just read → serve from cache

2. **Database Optimization**
   - Archive old questions to cheaper storage
   - Optimize indexes (tags, votes, dates)
   - Read replicas for SEO crawlers

3. **CDN for Static Assets**
   - Images, CSS, JS served from CDN
   - Reduces bandwidth costs 10x

4. **Elasticsearch Right-Sizing**
   - Don't index every field
   - Archive old question indexes

5. **Auto-Scaling**
   - Scale down during low traffic (nights)
   - Scale up during peak (work hours)

**StackOverflow-Specific:**
- 98% cache hit rate is achievable (content rarely changes)
- Old questions (>1 year) can go to cold storage
- SEO optimization reduces need for expensive search`,

  whyItMatters: 'Building the best Q&A platform means nothing if the company can\'t afford to run it.',

  famousIncident: {
    title: 'StackOverflow\'s Efficiency',
    company: 'StackOverflow',
    year: 'Ongoing',
    whatHappened: 'StackOverflow runs on surprisingly few servers - less than 30 app servers for 500M page views/day! They\'re famous for efficiency through aggressive caching and optimization.',
    lessonLearned: 'Smart architecture can do more with less. Cache everything that rarely changes.',
    icon: '💎',
  },

  realWorldExample: {
    company: 'StackOverflow',
    scenario: 'Running extremely efficiently',
    howTheyDoIt: 'Aggressive caching (98%+ hit rate), minimal servers, optimized SQL queries, CDN for assets',
  },

  keyPoints: [
    'Cache aggressively (98%+ hit rate possible)',
    'Archive old questions to cold storage',
    'Use CDN for static assets',
    'Optimize database queries and indexes',
    'Auto-scale based on traffic patterns',
    'Read replicas for search engine crawlers',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for StackOverflow?',
    options: [
      'Delete old questions',
      'Aggressive caching to achieve 98%+ hit rate',
      'Reduce search accuracy',
      'Disable reputation system',
    ],
    correctIndex: 1,
    explanation: 'With 20,833:1 read-to-write ratio, a 98% cache hit rate means only 2% of reads hit the database - massive savings!',
  },

  keyConcepts: [
    { title: 'Cache Hit Rate', explanation: 'Percentage of reads served from cache', icon: '🎯' },
    { title: 'Cold Storage', explanation: 'Cheap storage for old data', icon: '❄️' },
    { title: 'Auto-Scaling', explanation: 'Automatically adjust capacity', icon: '📊' },
  ],
};

const step8: GuidedStep = {
  id: 'stackoverflow-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $350/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $350/month',
      'Maintain all performance requirements',
      'Keep cache hit rate above 95%',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'search', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'search' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireCacheStrategy: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component\'s configuration for over-provisioning. Focus on cache efficiency.',
    level2: 'Consider: High cache TTL for questions (rarely change), right-sized instances, efficient indexing. Keep the architecture intact.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const stackoverflowGuidedTutorial: GuidedTutorial = {
  problemId: 'stackoverflow',
  title: 'Design StackOverflow',
  description: 'Build a Q&A platform with voting, accepted answers, tags, and reputation',
  difficulty: 'advanced',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '📚',
    hook: "You've been hired as Lead Engineer at DevCommunity Inc!",
    scenario: "Your mission: Build a StackOverflow-like platform that helps millions of developers find answers to programming questions.",
    challenge: "Can you design a system that handles voting, search, and reputation at scale?",
  },

  requirementsPhase: stackoverflowRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'Voting Systems',
    'Accepted Answers',
    'Tag-Based Organization',
    'Reputation Systems',
    'Caching Strategies',
    'Load Balancing',
    'Full-Text Search',
    'Message Queues',
    'Eventual Consistency',
    'Vote Aggregation',
    'SEO Optimization',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 2: Data Models (relational for Q&A)',
    'Chapter 3: Storage and Retrieval (indexes for tags)',
    'Chapter 7: Transactions (eventual consistency for votes)',
    'Chapter 11: Stream Processing (vote aggregation)',
  ],
};

export default stackoverflowGuidedTutorial;
