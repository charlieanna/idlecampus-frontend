import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Trello Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a project management platform like Trello.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (cache, real-time updates, replication, queues, cost)
 *
 * Key Concepts:
 * - Drag-and-drop with optimistic updates
 * - Real-time collaboration via WebSocket
 * - Board/List/Card hierarchy
 * - Team permissions and access control
 * - Activity feeds and notifications
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const trelloRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a project management platform like Trello",

  interviewer: {
    name: 'David Park',
    role: 'VP of Engineering at Productivity Tools Inc.',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-kanban',
      category: 'functional',
      question: "What are the core features users need in a Kanban project management tool?",
      answer: "Users need to:\n\n1. **Create boards** - Visual workspace for a project or team\n2. **Create lists** - Columns representing workflow stages (e.g., To Do, In Progress, Done)\n3. **Create cards** - Individual tasks within lists\n4. **Drag-and-drop** - Move cards between lists and reorder them",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Trello's core is the visual Kanban board - boards contain lists, lists contain cards",
    },
    {
      id: 'team-collab',
      category: 'functional',
      question: "How do teams collaborate on boards?",
      answer: "**Team collaboration features:**\n- **Invite members** - Add teammates to boards\n- **Assign cards** - Assign tasks to specific team members\n- **Comments** - Discuss tasks directly on cards\n- **Due dates** - Set deadlines for tasks\n\nFor MVP, focus on inviting members and assigning cards.",
      importance: 'critical',
      revealsRequirement: 'FR-5, FR-6',
      learningPoint: "Collaboration is what makes Trello powerful - multiple people working on the same board",
    },
    {
      id: 'real-time',
      category: 'functional',
      question: "When someone moves a card, should other team members see it immediately?",
      answer: "Yes! **Real-time updates** are essential. When Alice moves a card, Bob should see it move on his screen instantly (within 200-300ms). This prevents conflicts and confusion.",
      importance: 'critical',
      revealsRequirement: 'NFR-1',
      learningPoint: "Real-time collaboration requires WebSocket connections to push updates",
    },
    {
      id: 'card-details',
      category: 'functional',
      question: "What information can users add to cards?",
      answer: "Cards can have:\n- **Title** (required)\n- **Description** - Detailed task info\n- **Due date** - Deadline\n- **Assignees** - Team members responsible\n- **Labels/Tags** - Color-coded categories\n- **Attachments** - Files, images\n- **Checklists** - Sub-tasks\n\nFor MVP: title, description, due date, and assignees.",
      importance: 'important',
      revealsRequirement: 'FR-6',
      insight: "Rich card data makes Trello more than just sticky notes - it's a full task manager",
    },
    {
      id: 'activity-feed',
      category: 'clarification',
      question: "Should users see a history of changes to boards and cards?",
      answer: "Yes! **Activity feed** shows:\n- Who moved which card\n- Who added comments\n- Who changed due dates\n- When cards were created/archived\n\nThis creates accountability and helps teams track progress.",
      importance: 'important',
      insight: "Activity feeds are great for async teams - see what happened while you were offline",
    },
    {
      id: 'permissions',
      category: 'clarification',
      question: "Can anyone edit any board?",
      answer: "No. **Board permissions:**\n- **Private** - Only invited members can view/edit\n- **Team** - All team members can view/edit\n- **Public** - Anyone with link can view (read-only)\n\nFor MVP, focus on private boards with invited members.",
      importance: 'nice-to-have',
      insight: "Access control is critical for enterprise adoption",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "5 million daily active users across all boards, with average team size of 10-20 people. Largest boards may have 50+ collaborators.",
      importance: 'critical',
      learningPoint: "Smaller scale than Twitter, but real-time collaboration is harder than social media",
    },
    {
      id: 'throughput-actions',
      category: 'throughput',
      question: "How many card moves and updates per day?",
      answer: "About 100 million actions per day (card moves, edits, comments)",
      importance: 'critical',
      calculation: {
        formula: "100M ÷ 86,400 sec = 1,157 actions/sec",
        result: "~1.2K writes/sec (3.6K at peak)",
      },
      learningPoint: "Moderate write volume, but each write must be broadcast to all board members",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many users are viewing boards concurrently?",
      answer: "About 60% of DAU actively view boards during work hours. That's 3 million concurrent board viewers at peak.",
      importance: 'critical',
      learningPoint: "Real-time connections are expensive - need WebSocket connection pooling",
    },
    {
      id: 'board-activity',
      category: 'burst',
      question: "What happens during a sprint planning session with 20 people on the same board?",
      answer: "In a 1-hour session, the team might move 200+ cards. All 20 people need to see every change in real-time. That's a burst of card updates that must fan-out to all connected users.",
      importance: 'critical',
      insight: "Real-time fan-out to all board members is the key challenge",
    },
    {
      id: 'latency-drag-drop',
      category: 'latency',
      question: "How fast should drag-and-drop feel?",
      answer: "Card should move instantly on user's screen (optimistic update), with p99 < 300ms for the update to reach other users.",
      importance: 'critical',
      learningPoint: "Optimistic UI updates + async broadcast = smooth UX",
    },
    {
      id: 'latency-load',
      category: 'latency',
      question: "How fast should boards load?",
      answer: "p99 under 1 second for boards with up to 500 cards. Users expect instant access to their work.",
      importance: 'important',
      learningPoint: "Board data must be cached - loading from DB every time is too slow",
    },
    {
      id: 'persistence',
      category: 'reliability',
      question: "What happens if the server crashes mid-drag?",
      answer: "All committed changes must be persisted. If a card move was confirmed to the user, it must survive crashes. However, in-flight operations can fail gracefully.",
      importance: 'critical',
      learningPoint: "Optimistic updates must be reconciled with server state",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-kanban', 'team-collab', 'real-time'],
  criticalFRQuestionIds: ['core-kanban', 'team-collab'],
  criticalScaleQuestionIds: ['throughput-users', 'board-activity', 'latency-drag-drop'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can create boards',
      description: 'Create visual workspaces for projects',
      emoji: '📋',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can create lists',
      description: 'Create columns within boards (To Do, In Progress, Done)',
      emoji: '📝',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can create cards',
      description: 'Create individual tasks within lists',
      emoji: '🎴',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can drag-and-drop cards',
      description: 'Move cards between lists and reorder them',
      emoji: '🔀',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can invite team members',
      description: 'Collaborate with teammates on boards',
      emoji: '👥',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Users can set due dates and assignees',
      description: 'Assign tasks and set deadlines',
      emoji: '📅',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '5 million',
    writesPerDay: '100 million actions',
    readsPerDay: 'N/A (real-time push)',
    peakMultiplier: 3,
    readWriteRatio: 'N/A (push-based)',
    calculatedWriteRPS: { average: 1157, peak: 3471 },
    calculatedReadRPS: { average: 0, peak: 0 },
    maxPayloadSize: '~5KB (board state with cards)',
    storagePerRecord: '~500B per card',
    storageGrowthPerYear: '~50TB',
    redirectLatencySLA: 'p99 < 300ms (real-time updates)',
    createLatencySLA: 'p99 < 1s (board load)',
  },

  architecturalImplications: [
    '✅ Real-time collaboration → WebSocket connections required',
    '✅ 3M concurrent board viewers → Need connection pooling and load balancing',
    '✅ Card move fan-out → Message queue for async broadcast',
    '✅ Board state → Cache entire board for fast loads',
    '✅ Activity tracking → Event stream for audit log',
  ],

  outOfScope: [
    'File attachments and storage',
    'Advanced checklists and sub-tasks',
    'Calendar view',
    'Butler automation (if-this-then-that)',
    'Power-ups/integrations',
    'Mobile push notifications',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can create boards, lists, and cards. Real-time updates and scaling challenges will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📊',
  scenario: "Welcome to Productivity Tools Inc! You've been hired to build the next Trello.",
  hook: "Your first team just signed up. They're ready to organize their sprint!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your Kanban platform is online!',
  achievement: 'Users can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle boards and cards yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every web application starts with a **Client** connecting to a **Server**.

When a user opens Trello:
1. Their device (desktop browser, mobile app) is the **Client**
2. It sends requests to your **App Server**
3. The server processes the request and sends back a response

For now, we'll use HTTP for initial loads and API calls. In later steps, we'll add WebSocket for real-time updates.`,

  whyItMatters: 'Without this connection, users can\'t access their boards or collaborate with teammates.',

  realWorldExample: {
    company: 'Trello',
    scenario: 'Handling 5 million daily active users',
    howTheyDoIt: 'Started as a simple Node.js app in 2011, now uses distributed servers with WebSocket for real-time collaboration',
  },

  keyPoints: [
    'Client = the user\'s browser or mobile app',
    'App Server = your backend that processes requests',
    'HTTP = the initial protocol (we\'ll upgrade to WebSocket later)',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s browser or app', icon: '💻' },
    { title: 'App Server', explanation: 'Your backend that handles logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'trello-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Trello', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles boards, lists, and cards', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle boards and cards yet!",
  hook: "A user just tried to create a board called 'Sprint Planning' but got an error.",
  challenge: "Write the Python code to create boards, lists, and cards.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle Kanban boards!',
  achievement: 'You implemented the core Trello functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can create boards', after: '✓' },
    { label: 'Can create lists', after: '✓' },
    { label: 'Can create cards', after: '✓' },
    { label: 'Can move cards', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all boards are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Board and Card Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For Trello, we need handlers for:
- \`create_board()\` - Create a new board
- \`create_list()\` - Add a list to a board
- \`create_card()\` - Add a card to a list
- \`move_card()\` - Move a card between lists or change position

**Data hierarchy:**
- Board → contains many Lists
- List → contains many Cards
- Card → belongs to one List

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just an empty shell. This is where the Kanban magic happens!',

  famousIncident: {
    title: 'Trello\'s Early Scaling Pains',
    company: 'Trello',
    year: '2012',
    whatHappened: 'As Trello grew from thousands to millions of users, their simple Node.js handlers couldn\'t keep up. Drag-and-drop became laggy. They had to completely rewrite their real-time update system.',
    lessonLearned: 'Start simple, but design for growth. The handlers we write today will evolve as we scale.',
    icon: '🐢',
  },

  realWorldExample: {
    company: 'Trello',
    scenario: 'Handling millions of card moves per day',
    howTheyDoIt: 'Optimized handlers with optimistic updates on client, async persistence, and WebSocket broadcast to other users',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Maintain board → list → card hierarchy',
    'Handle edge cases (board not found, invalid position, etc.)',
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
    { title: 'Hierarchy', explanation: 'Board → List → Card relationship', icon: '🏗️' },
  ],
};

const step2: GuidedStep = {
  id: 'trello-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Create boards, FR-2: Create lists, FR-3: Create cards, FR-4: Move cards',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/boards, POST /api/v1/lists, POST /api/v1/cards, PUT /api/v1/cards/move APIs',
      'Open the Python tab',
      'Implement create_board(), create_list(), create_card(), and move_card() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for create_board, create_list, create_card, and move_card',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/boards', 'POST /api/v1/lists', 'POST /api/v1/cards', 'PUT /api/v1/cards/move'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster strikes at 4 AM. Your server crashed and restarted...",
  hook: "When it came back online, ALL boards were GONE! Your users lost weeks of sprint planning.",
  challenge: "Add a database so boards and cards survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your boards are safe forever!',
  achievement: 'Data now persists across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But large boards are loading slowly as users add more cards...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For Trello, we need tables for:
- \`boards\` - Board metadata (name, owner, created_at)
- \`lists\` - Lists within boards (name, position, board_id)
- \`cards\` - Cards within lists (title, description, position, list_id)
- \`board_members\` - Who has access to each board
- \`users\` - User accounts`,

  whyItMatters: 'Imagine losing your entire sprint planning board because of a server restart. Teams would lose trust and switch to competitors!',

  famousIncident: {
    title: 'Atlassian Outage',
    company: 'Atlassian (Trello\'s parent)',
    year: '2022',
    whatHappened: 'A database failure caused a week-long outage for some Atlassian services. Thousands of customers couldn\'t access Trello, Jira, and Confluence. Data was eventually recovered from backups.',
    lessonLearned: 'Persistent storage with proper backups and replication is non-negotiable. Test your recovery procedures!',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'Trello',
    scenario: 'Storing millions of boards and cards',
    howTheyDoIt: 'Uses MongoDB for flexible schema and fast reads. Board data is denormalized for quick loading.',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL) or NoSQL (MongoDB) based on needs',
    'Trello uses document database for flexible board structure',
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
    { title: 'Document DB', explanation: 'Flexible schema for nested data', icon: '📄' },
  ],
};

const step3: GuidedStep = {
  id: 'trello-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store boards, lists, cards, and users permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Fast Board Loading
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "Your most active board has 500 cards, and it takes 5 seconds to load!",
  hook: "Users are complaining: 'Why is Trello so slow?' Every board load hits the database with complex queries.",
  challenge: "Add a cache to make board loading lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Boards load 30x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Board load time', before: '5000ms', after: '150ms' },
    { label: 'Cache hit rate', after: '90%' },
  ],
  nextTeaser: "But what happens when thousands of users access boards simultaneously?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier for Boards',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

For Trello, we cache:
- **Entire board state** - All lists and cards for a board
- **User permissions** - Who has access to which boards
- **Recent activity** - Latest updates for activity feeds

Instead of:
\`\`\`
Request → Database (slow, 100ms query for 500 cards)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1ms) → Database (only if cache miss)
\`\`\`

**Cache strategy for Trello:**
- Cache entire board as single JSON blob
- Invalidate cache on any board update
- Set TTL to 5 minutes as backup`,

  whyItMatters: 'Users open boards constantly. Without caching, every board load would query hundreds of cards from the database.',

  famousIncident: {
    title: 'Trello Performance Crisis',
    company: 'Trello',
    year: '2013',
    whatHappened: 'During rapid growth, board load times increased from 500ms to 10+ seconds. Users revolted on Twitter. Trello had to add aggressive caching and optimize database queries.',
    lessonLearned: 'Cache read-heavy data aggressively. Board state is perfect for caching - it\'s read often but changed less frequently.',
    icon: '🔥',
  },

  realWorldExample: {
    company: 'Trello',
    scenario: 'Serving millions of board loads per day',
    howTheyDoIt: 'Uses Redis to cache entire board state. Most board opens never touch the database.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (90% of requests)
                     │   Return board instantly!
`,

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache entire board state for fast loads',
    'Invalidate cache when board changes',
    'Set TTL (300 seconds) as safety net',
  ],

  quickCheck: {
    question: 'What should Trello cache for best performance?',
    options: [
      'Only user profiles',
      'Entire board state (all lists and cards)',
      'Just card titles',
      'Nothing - databases are fast enough',
    ],
    correctIndex: 1,
    explanation: 'Cache entire board state as a single blob. Loading a board requires all lists and cards anyway.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'Invalidation', explanation: 'Remove cached data when it changes', icon: '🔄' },
  ],
};

const step4: GuidedStep = {
  id: 'trello-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from fast board loading',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache entire board state for fast loads', displayName: 'Redis Cache' },
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
  scenario: "Your platform went viral! A popular YouTuber featured Trello in a productivity video.",
  hook: "Traffic spiked 20x overnight. Your single app server is at 100% CPU and crashing!",
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
  nextTeaser: "But we still need database redundancy for high availability...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Handling Traffic Spikes',
  conceptExplanation: `A **Load Balancer** distributes incoming connections across servers.

For Trello:
- Distributes board load requests
- Balances card move operations
- Routes API requests

Benefits:
- **No single point of failure** - if one server dies, others keep working
- **Horizontal scaling** - add more servers to handle more traffic
- **Better resource utilization** - spread load evenly

Later, we'll upgrade for WebSocket support (sticky sessions).`,

  whyItMatters: 'At peak, Trello handles 3.6K actions/second. No single server can handle that alone.',

  famousIncident: {
    title: 'Trello\'s Launch Day',
    company: 'Trello',
    year: '2011',
    whatHappened: 'Trello launched at TechCrunch Disrupt. The demo went viral. Their single server crashed under the load. Took hours to get back online with more capacity.',
    lessonLearned: 'Always design for 10x your expected traffic. Load balancers enable this without over-provisioning.',
    icon: '🚀',
  },

  realWorldExample: {
    company: 'Trello',
    scenario: 'Handling millions of requests per day',
    howTheyDoIt: 'Multiple layers of load balancers distributing across hundreds of app servers',
  },

  keyPoints: [
    'Load balancer distributes requests across servers',
    'Enables horizontal scaling (add more servers)',
    'Eliminates single point of failure',
    'Place between Client and App Servers',
  ],

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Health Checks', explanation: 'Monitor server availability', icon: '💓' },
  ],
};

const step5: GuidedStep = {
  id: 'trello-step-5',
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
  scenario: "Your database crashed at 9 AM on Monday morning - peak time!",
  hook: "Teams couldn't access their sprint boards. Your startup lost $50,000 in one hour of downtime.",
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
  nextTeaser: "But we need real-time updates so teams can see changes instantly...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Never Lose Boards',
  conceptExplanation: `**Replication** copies your data to multiple database servers.

Types:
- **Primary (Leader)**: Handles all writes
- **Replicas (Followers)**: Handle reads, stay in sync with primary

Benefits:
- **High availability**: If primary fails, replica takes over
- **Read scaling**: Distribute reads across replicas
- **Data safety**: Multiple copies of your boards

For Trello:
- Write card moves to Primary
- Read board state from Replicas
- Automatic failover if Primary fails`,

  whyItMatters: 'A single database is a single point of failure. For teams managing critical projects, downtime is unacceptable.',

  famousIncident: {
    title: 'Basecamp Database Failure',
    company: 'Basecamp',
    year: '2020',
    whatHappened: 'Database hardware failure caused hours of downtime. Thousands of teams couldn\'t access their projects. Failover to replica took longer than expected.',
    lessonLearned: 'Database replication is essential. Test failover regularly - it must be automatic and fast.',
    icon: '💔',
  },

  realWorldExample: {
    company: 'Trello',
    scenario: 'Zero tolerance for data loss',
    howTheyDoIt: 'Uses MongoDB replica sets with 3 nodes. Automatic failover ensures high availability.',
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
    'Replication adds some latency (data sync delay)',
    'Use at least 2 replicas for high availability',
  ],

  quickCheck: {
    question: 'What happens if the primary database fails with replication enabled?',
    options: [
      'All data is lost',
      'A replica is promoted to become the new primary',
      'All reads and writes fail',
      'The system automatically creates a new database',
    ],
    correctIndex: 1,
    explanation: 'With replication, a replica can be promoted to primary (failover), maintaining availability.',
  },

  keyConcepts: [
    { title: 'Primary', explanation: 'The database that handles writes', icon: '👑' },
    { title: 'Replica', explanation: 'Read-only copy that stays in sync', icon: '📋' },
    { title: 'Failover', explanation: 'Promoting a replica when primary fails', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'trello-step-6',
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
// STEP 7: Add Message Queue for Real-Time Updates
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🐢',
  scenario: "Alice moves a card from 'To Do' to 'Done', but Bob doesn't see it for 30 seconds!",
  hook: "Real-time collaboration is broken. Teams are confused about board state.",
  challenge: "Add a message queue to broadcast card moves to all board members in real-time.",
  illustration: 'sync-issue',
};

const step7Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Changes appear instantly for all users!',
  achievement: 'Real-time collaboration is now seamless',
  metrics: [
    { label: 'Update latency', before: '30s', after: '<300ms' },
    { label: 'Real-time delivery', after: 'Instant' },
  ],
  nextTeaser: "But costs are getting out of control...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Real-Time Collaboration',
  conceptExplanation: `Message queues enable **real-time updates** so all board members stay in sync.

When Alice moves a card:
1. **Synchronous**: Save to database, update cache, return success ✓
2. **Async via Queue**:
   - Publish "card_moved" event to queue
   - Workers consume event
   - Broadcast to all board members via WebSocket
   - Update activity feed

This is the **write-through, async broadcast** pattern.

For Trello:
- Card move confirmed immediately
- Other users see change within 300ms
- No polling needed - push-based updates`,

  whyItMatters: 'Without real-time updates, teams can\'t collaborate effectively. Conflicts and confusion arise.',

  famousIncident: {
    title: 'Trello Real-Time Sync Issues',
    company: 'Trello',
    year: '2014',
    whatHappened: 'A bug in real-time update system caused duplicate cards to appear for some users. Moving a card created copies. Users lost trust in data consistency.',
    lessonLearned: 'Real-time systems need careful event ordering and deduplication. Use idempotent operations.',
    icon: '👯',
  },

  realWorldExample: {
    company: 'Trello',
    scenario: 'Real-time board collaboration',
    howTheyDoIt: 'Uses Redis Pub/Sub for event distribution. Workers broadcast changes via WebSocket to connected board members.',
  },

  diagram: `
Alice Moves Card
      │
      ▼
┌─────────────┐     ┌─────────────────────────────────────┐
│ App Server  │────▶│          Message Queue              │
│ (instant)   │     │  [card_moved, card_created, ...]    │
└─────────────┘     └──────────────┬──────────────────────┘
      │                            │
      │ Return                     │ Workers consume
      ▼ "Saved!"                   ▼
                          ┌─────────────────┐
                          │  Broadcast      │
                          │  Workers        │
                          └────────┬────────┘
                                   │
                              ┌────┴────┐
                              ▼         ▼
                          ┌──────┐  ┌──────┐
                          │ Bob  │  │ Carol│
                          │(WS)  │  │ (WS) │
                          └──────┘  └──────┘
                          See change instantly!
`,

  keyPoints: [
    'Queue decouples card move from broadcast',
    'User gets instant response - broadcast happens async',
    'Workers fan-out to all board members via WebSocket',
    'Essential for real-time collaboration',
  ],

  quickCheck: {
    question: 'Why use async processing for real-time updates?',
    options: [
      'It\'s cheaper',
      'User gets instant response while broadcast happens in background',
      'It uses less memory',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Async means the user doesn\'t wait for broadcast. Card move is saved instantly, delivery to others happens in the background.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for async processing', icon: '📬' },
    { title: 'WebSocket', explanation: 'Real-time bidirectional connection', icon: '🔌' },
    { title: 'Fan-Out', explanation: 'Broadcasting event to all board members', icon: '📡' },
  ],
};

const step7: GuidedStep = {
  id: 'trello-step-7',
  stepNumber: 7,
  frIndex: 3,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-4: Drag-and-drop cards (now with real-time updates)',
    taskDescription: 'Add a Message Queue for real-time board updates',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle real-time broadcast to board members', displayName: 'Redis Pub/Sub' },
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
    level1: 'Drag a Message Queue (Redis Pub/Sub) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables real-time broadcasts to board members.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "Your monthly cloud bill is $400,000!",
  hook: "The CFO says: 'Cut costs by 35% or we need to charge users more.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Trello!',
  achievement: 'A scalable, cost-effective Kanban platform',
  metrics: [
    { label: 'Monthly cost', before: '$400K', after: 'Under budget' },
    { label: 'Board load time', after: '<1s' },
    { label: 'Real-time updates', after: '<300ms' },
    { label: 'Availability', after: '99.99%' },
  ],
  nextTeaser: "You've mastered Trello system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies:
1. **Right-size instances** - Don't over-provision servers
2. **Cache aggressively** - Reduce expensive database calls
3. **Auto-scale** - Scale down during off-hours (nights/weekends)
4. **Archive inactive boards** - Move to cheaper cold storage after 90 days
5. **Optimize WebSocket connections** - Use connection pooling
6. **Database query optimization** - Add indexes, denormalize data

For Trello:
- Most boards are small (<50 cards) - don't over-allocate
- Auto-scale app servers based on traffic (work hours vs night)
- Cache entire board state aggressively
- Use read replicas efficiently`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it. Users won\'t pay $20/month for task management.',

  famousIncident: {
    title: 'Trello\'s Free Tier Strategy',
    company: 'Trello',
    year: '2011-present',
    whatHappened: 'Trello kept a generous free tier for years. To make it sustainable, they heavily optimized infrastructure costs. Smart caching, efficient database usage, and right-sized resources.',
    lessonLearned: 'Cost optimization enables business model flexibility. Design for cost from day 1.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Trello',
    scenario: 'Running at scale profitably',
    howTheyDoIt: 'Uses aggressive caching, auto-scaling, and efficient data structures. Keeps costs low enough to offer free tier.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'Right-size your infrastructure',
    'Use auto-scaling to match demand (work hours vs night)',
    'Cache board state to reduce database load',
    'Archive inactive boards to cheaper storage',
    'Optimize WebSocket connection pooling',
  ],

  quickCheck: {
    question: 'What\'s the best cost optimization for Trello\'s usage pattern (peak during work hours)?',
    options: [
      'Use bigger servers',
      'Auto-scale down at night and weekends',
      'Delete old boards',
      'Reduce replica count',
    ],
    correctIndex: 1,
    explanation: 'Trello usage follows work hours. Auto-scaling saves 60%+ by scaling down nights and weekends when few users are active.',
  },

  keyConcepts: [
    { title: 'Right-Sizing', explanation: 'Match instance size to actual needs', icon: '📏' },
    { title: 'Auto-Scaling', explanation: 'Automatically adjust capacity', icon: '📊' },
    { title: 'Cost/Performance', explanation: 'Balance budget with requirements', icon: '⚖️' },
  ],
};

const step8: GuidedStep = {
  id: 'trello-step-8',
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
    level1: 'Review each component\'s configuration for over-provisioning',
    level2: 'Consider: fewer replicas, smaller cache, right-sized instances. Balance cost with reliability.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const trelloGuidedTutorial: GuidedTutorial = {
  problemId: 'trello',
  title: 'Design Trello',
  description: 'Build a Kanban project management platform with boards, lists, cards, and real-time collaboration',
  difficulty: 'intermediate',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '📊',
    hook: "You've been hired as Lead Engineer at Productivity Tools Inc!",
    scenario: "Your mission: Build a Trello-like platform that enables teams to organize projects visually with real-time collaboration.",
    challenge: "Can you design a system that handles drag-and-drop smoothly and keeps all team members in sync?",
  },

  requirementsPhase: trelloRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Kanban Board Data Model',
    'Database Design',
    'Caching',
    'Load Balancing',
    'Database Replication',
    'Message Queues',
    'Real-Time Collaboration',
    'WebSocket',
    'Optimistic Updates',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 8: Distributed Systems',
    'Chapter 11: Stream Processing',
  ],
};

export default trelloGuidedTutorial;
