import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Notion Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a productivity and notes platform like Notion.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (cache, real-time collaboration, queues, cost)
 *
 * Key Concepts:
 * - Block-based document structure (everything is a block)
 * - Real-time collaboration with Operational Transformation (OT)
 * - Database as a page (structured data with views)
 * - Nested pages and workspaces
 * - Template system
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const notionRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a productivity and notes platform like Notion",

  interviewer: {
    name: 'Jordan Lee',
    role: 'Principal Engineer at ProductivityTech Inc.',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What are the core features users need from Notion?",
      answer: "Users want to:\n\n1. **Create pages** - Documents that can contain rich content (text, images, code, etc.)\n2. **Organize with blocks** - Everything is a block (paragraph, heading, to-do, etc.)\n3. **Nest pages** - Pages can contain other pages for hierarchical organization\n4. **Use databases** - Create tables, boards, calendars with structured data",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Notion's power comes from treating everything as blocks - flexible, composable, reusable",
    },
    {
      id: 'block-types',
      category: 'functional',
      question: "What types of blocks should we support?",
      answer: "Start with core blocks:\n- **Text blocks**: Paragraph, heading, list, code\n- **Media blocks**: Image, video, file\n- **Database blocks**: Table, board, list, calendar\n- **Embed blocks**: Other tools (Figma, Google Docs)\n- **Interactive blocks**: To-do checkboxes, toggles\n\nFor MVP, focus on text blocks and simple databases.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Block types determine data model - each block type has different properties",
    },
    {
      id: 'real-time-collab',
      category: 'functional',
      question: "Should multiple people be able to edit the same page simultaneously?",
      answer: "Yes! **Real-time collaboration** is critical:\n- Multiple users can edit simultaneously\n- See other users' cursors and selections\n- Changes appear instantly (< 200ms)\n- Conflict resolution when editing same block\n\nThis is technically challenging - requires Operational Transformation (OT) or CRDT.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Real-time collaboration is the hardest feature - requires WebSockets and conflict resolution",
    },
    {
      id: 'workspaces',
      category: 'functional',
      question: "How are teams organized in Notion?",
      answer: "**Workspaces** are the top-level container:\n- Each team/company has a workspace\n- Workspace contains pages, databases, members\n- Users can be in multiple workspaces\n- Permissions set at workspace level (admin, member, guest)",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Workspace is the isolation boundary - affects data model and permissions",
    },
    {
      id: 'database-views',
      category: 'functional',
      question: "How do databases work? What makes them different from tables?",
      answer: "**Databases in Notion are powerful**:\n- A database is a collection of pages with properties\n- **Multiple views**: Same data shown as table, board, calendar, list\n- **Filters and sorts**: Users can filter/sort without changing data\n- **Relations**: Link databases together\n\nFor MVP, start with simple table view.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      insight: "Database views are just different renderings of the same underlying data",
    },
    {
      id: 'templates',
      category: 'functional',
      question: "Should users be able to create reusable templates?",
      answer: "Yes! **Templates** are pre-built page structures:\n- Personal templates (meeting notes, project plans)\n- Workspace templates (onboarding docs)\n- Gallery of public templates\n\nFor MVP, support basic page duplication. Advanced templating can come later.",
      importance: 'nice-to-have',
      insight: "Templates are just pages that can be cloned - simpler than custom template engine",
    },
    {
      id: 'permissions',
      category: 'clarification',
      question: "How do sharing and permissions work?",
      answer: "Permissions are hierarchical:\n- **Workspace-level**: Admin, member, guest\n- **Page-level**: Full access, edit, comment, view\n- **Shareable links**: Public links with view/edit access\n- **Inheritance**: Child pages inherit parent permissions by default\n\nFor MVP, focus on workspace and page-level permissions.",
      importance: 'important',
      insight: "Permission inheritance simplifies but can be complex with overrides",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "30 million registered users, with 5 million daily active users (DAU)",
      importance: 'critical',
      learningPoint: "Significant scale - similar to Notion's actual user base (20M+ in 2023)",
    },
    {
      id: 'throughput-edits',
      category: 'throughput',
      question: "How many edits (block changes) happen per day?",
      answer: "About 500 million block edits per day across all workspaces",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 edits/sec",
        result: "~6K writes/sec (18K at peak)",
      },
      learningPoint: "Very high write volume - every keystroke can be an edit",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many page loads and views per day?",
      answer: "About 2 billion page views per day (read-heavy workload)",
      importance: 'critical',
      calculation: {
        formula: "2B ÷ 86,400 sec = 23,148 reads/sec",
        result: "~23K reads/sec (70K at peak)",
      },
      learningPoint: "Read-heavy (4:1 read/write) - caching is critical",
    },
    {
      id: 'collab-latency',
      category: 'latency',
      question: "How fast should edits appear for other collaborators?",
      answer: "Edits should appear in **< 200ms** for other users. Any slower and real-time collaboration feels broken. This requires WebSocket connections.",
      importance: 'critical',
      learningPoint: "Sub-200ms means WebSockets, efficient conflict resolution, optimistic UI",
    },
    {
      id: 'page-load-latency',
      category: 'latency',
      question: "How fast should pages load?",
      answer: "p99 under 500ms for initial page load. Users expect snappy document opening. Large pages with databases can be lazy-loaded.",
      importance: 'critical',
      learningPoint: "Fast page loads require caching blocks and lazy-loading large content",
    },
    {
      id: 'concurrent-editors',
      category: 'burst',
      question: "How many people might edit the same page simultaneously?",
      answer: "For most pages, 2-10 concurrent editors. For popular pages (all-hands doc), could be 50-100 concurrent editors. System must handle conflicts gracefully.",
      importance: 'critical',
      insight: "Concurrent editing is the hardest scaling challenge - requires OT/CRDT",
    },
    {
      id: 'workspace-size',
      category: 'payload',
      question: "How large can a workspace get?",
      answer: "Large workspaces can have:\n- 100,000+ pages\n- 1,000+ databases\n- 10,000+ members\n- 50GB+ of uploaded files\n\nNeed efficient querying and pagination.",
      importance: 'important',
      learningPoint: "Large workspaces need sharding and efficient indexing",
    },
    {
      id: 'page-size',
      category: 'payload',
      question: "How large can a single page be?",
      answer: "Pages can have thousands of blocks. Need to:\n- Lazy load blocks (only load visible ones)\n- Paginate database results\n- Stream large content\n\nAverage page: 50-200 blocks. Max: 10,000+ blocks.",
      importance: 'important',
      learningPoint: "Large pages need incremental loading - don't load everything at once",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'real-time-collab', 'workspaces'],
  criticalFRQuestionIds: ['core-features', 'block-types', 'workspaces'],
  criticalScaleQuestionIds: ['throughput-edits', 'collab-latency', 'concurrent-editors'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can create workspaces and pages',
      description: 'Organize documents in hierarchical workspaces and pages',
      emoji: '📄',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Pages are composed of blocks',
      description: 'Everything is a block (text, headings, images, databases)',
      emoji: '🧱',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Pages can be nested',
      description: 'Create hierarchical structure with parent/child pages',
      emoji: '🗂️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can create databases',
      description: 'Structured data with table, board, and calendar views',
      emoji: '📊',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Real-time collaboration',
      description: 'Multiple users edit simultaneously with conflict resolution',
      emoji: '👥',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '5 million',
    writesPerDay: '500 million block edits',
    readsPerDay: '2 billion page views',
    peakMultiplier: 3,
    readWriteRatio: '4:1',
    calculatedWriteRPS: { average: 5787, peak: 17361 },
    calculatedReadRPS: { average: 23148, peak: 69444 },
    maxPayloadSize: '~10KB (average block)',
    storagePerRecord: '~2KB per block',
    storageGrowthPerYear: '~365TB',
    redirectLatencySLA: 'p99 < 500ms (page load)',
    createLatencySLA: 'p99 < 200ms (edit propagation)',
  },

  architecturalImplications: [
    '✅ Real-time edits → WebSocket connections required',
    '✅ 70K reads/sec at peak → Aggressive caching of blocks and pages',
    '✅ Concurrent editing → Operational Transformation (OT) or CRDT for conflict resolution',
    '✅ Block-based structure → Document stored as tree of blocks in database',
    '✅ Large workspaces → Need efficient querying, pagination, search indexing',
  ],

  outOfScope: [
    'Mobile apps (iOS/Android)',
    'Offline mode and sync',
    'Advanced database features (rollups, formulas)',
    'API and integrations',
    'Version history and backups',
    'File storage and CDN',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can create pages with blocks. Real-time collaboration and complex database views will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📝',
  scenario: "Welcome to ProductivityTech Inc! You've been hired to build the next Notion.",
  hook: "Your first user just signed up. They're ready to create their first page!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your productivity platform is online!',
  achievement: 'Users can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle pages and blocks yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every web application starts with a **Client** connecting to a **Server**.

When a user opens Notion:
1. Their browser or desktop app is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back a response

For Notion operations:
- Create page: Client → POST /api/pages → Server
- Load page: Client → GET /api/pages/{id} → Server
- Edit block: Client → PATCH /api/blocks/{id} → Server

Later, we'll add WebSocket connections for real-time collaboration.`,

  whyItMatters: 'Without this connection, users can\'t create or view pages at all.',

  realWorldExample: {
    company: 'Notion',
    scenario: 'Handling 5 million daily active users',
    howTheyDoIt: 'Started with a simple React frontend and Node.js backend, now uses a sophisticated distributed system with WebSockets',
  },

  keyPoints: [
    'Client = the user\'s browser or desktop app',
    'App Server = your backend that handles pages and blocks',
    'HTTP for initial requests, WebSocket for real-time later',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'User\'s browser/app that makes requests', icon: '💻' },
    { title: 'App Server', explanation: 'Backend that handles business logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'notion-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Notion', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles pages, blocks, databases', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle pages yet!",
  hook: "A user tried to create a page called 'My First Page' but got a 404 error.",
  challenge: "Write the Python code to create pages, add blocks, and query databases.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle Notion operations!',
  achievement: 'You implemented the core Notion functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can create pages', after: '✓' },
    { label: 'Can add blocks', after: '✓' },
    { label: 'Can create databases', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all pages are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Page and Block Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For Notion, we need handlers for:
- \`create_page()\` - Create a new page in a workspace
- \`create_block()\` - Add a block to a page
- \`update_block()\` - Edit block content
- \`create_database()\` - Create a database page

For now, we'll store everything in memory (Python dictionaries).

**Key concept**: Pages and blocks form a tree structure:
- Workspace → Pages → Blocks
- Pages can contain pages (nesting)
- Blocks have types (paragraph, heading, database, etc.)`,

  whyItMatters: 'Without handlers, your server is just a fancy paperweight. This is where Notion\'s magic happens!',

  famousIncident: {
    title: 'Notion\'s Early Performance Issues',
    company: 'Notion',
    year: '2018',
    whatHappened: 'In early days, Notion loaded entire pages at once, including all nested pages. Users with large workspaces experienced 10+ second load times. Pages would freeze.',
    lessonLearned: 'Lazy load nested content. Only load what\'s visible, paginate the rest.',
    icon: '🐌',
  },

  realWorldExample: {
    company: 'Notion',
    scenario: 'Handling 500M block edits per day',
    howTheyDoIt: 'Uses a block-based data model where everything is a block. Blocks reference each other via IDs, forming a tree structure stored in PostgreSQL.',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Pages and blocks form a tree structure',
    'Use in-memory storage for now - database comes in Step 3',
    'Handle edge cases (invalid block types, missing pages, etc.)',
  ],

  quickCheck: {
    question: 'Why does Notion use a block-based structure?',
    options: [
      'It\'s easier to code',
      'Blocks are composable, reusable, and can be rearranged easily',
      'It uses less memory',
      'It\'s a design trend',
    ],
    correctIndex: 1,
    explanation: 'Blocks are the building blocks (pun intended) of flexibility. Each block can be moved, nested, or transformed independently.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'Block', explanation: 'Fundamental unit of content in Notion', icon: '🧱' },
    { title: 'Tree Structure', explanation: 'Pages and blocks form parent-child relationships', icon: '🌳' },
  ],
};

const step2: GuidedStep = {
  id: 'notion-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Create pages, FR-2: Add blocks, FR-4: Create databases',
    taskDescription: 'Configure APIs and implement Python handlers for Notion operations',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/pages, POST /api/blocks, PATCH /api/blocks/{id}, POST /api/databases APIs',
      'Open the Python tab',
      'Implement create_page(), create_block(), update_block(), create_database() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for create_page, create_block, update_block, and create_database',
    solutionComponents: [
      {
        type: 'app_server',
        config: {
          handledAPIs: [
            'POST /api/pages',
            'POST /api/blocks',
            'PATCH /api/blocks/{id}',
            'POST /api/databases'
          ]
        }
      },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Pages and Blocks
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 2 AM. Your server crashed and restarted...",
  hook: "When it came back online, ALL pages and workspaces were GONE! Users see empty screens.",
  challenge: "Add a database to store pages, blocks, and workspace data.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your pages are safe forever!',
  achievement: 'Data now persists across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But loading pages with thousands of blocks is slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Database for Block-Based Documents',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Pages survive crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For Notion, we need tables for:
- \`workspaces\` - Team/company workspaces
- \`pages\` - Documents (which are also blocks)
- \`blocks\` - All content blocks (text, images, databases, etc.)
- \`users\` - User accounts and memberships
- \`permissions\` - Who can access what

**Key design**: Everything is stored as blocks. Pages are just blocks with type='page'.
This unified model makes nesting simple.`,

  whyItMatters: 'Imagine losing all your documentation because of a server restart. Your team\'s knowledge would vanish!',

  famousIncident: {
    title: 'Notion\'s Database Migration',
    company: 'Notion',
    year: '2020',
    whatHappened: 'Notion had to migrate their entire database schema to support new features. With millions of blocks, the migration took weeks and required careful planning to avoid downtime.',
    lessonLearned: 'Database schema design is critical. Changes at scale are expensive. Plan for evolution from day 1.',
    icon: '🔄',
  },

  realWorldExample: {
    company: 'Notion',
    scenario: 'Storing billions of blocks',
    howTheyDoIt: 'Uses PostgreSQL with a blocks table where everything is a block. Pages, paragraphs, databases - all stored with type field and JSON properties.',
  },

  keyPoints: [
    'Everything is a block - unified data model',
    'Pages are blocks with type="page"',
    'Blocks reference parent blocks (tree structure)',
    'Use PostgreSQL for ACID guarantees and JSON support',
  ],

  quickCheck: {
    question: 'Why does Notion store "pages" as blocks?',
    options: [
      'It saves storage space',
      'Unified model: pages can be nested in pages because both are blocks',
      'It\'s faster',
      'It\'s easier to delete',
    ],
    correctIndex: 1,
    explanation: 'If pages are blocks, you can nest pages in pages using the same block-parent relationship. Everything is just a block!',
  },

  keyConcepts: [
    { title: 'Block Model', explanation: 'Everything stored as blocks with types', icon: '🧱' },
    { title: 'Tree Structure', explanation: 'Blocks reference parent via parent_id', icon: '🌳' },
    { title: 'ACID', explanation: 'Database guarantees for data consistency', icon: '⚛️' },
  ],
};

const step3: GuidedStep = {
  id: 'notion-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store pages, blocks, users, permissions permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Block Queries
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 100,000 users with 10 million pages, and page loads take 3+ seconds!",
  hook: "Users are complaining: 'Notion is so slow!' Every page load queries thousands of blocks.",
  challenge: "Add a cache to make page loads lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Pages load 20x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Page load latency', before: '3000ms', after: '150ms' },
    { label: 'Cache hit rate', after: '90%' },
  ],
  nextTeaser: "But how do we handle thousands of concurrent users?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Speed Up Block Queries',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

For Notion, we cache:
- **Page metadata** - Title, parent, permissions
- **Block content** - Recently accessed blocks
- **Database schemas** - Table structure and properties
- **User permissions** - Who can access what

Instead of:
\`\`\`
Request → Database (slow, 100ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1ms) → Database (only if cache miss)
\`\`\`

**Cache invalidation strategy**:
- When a block is edited → Invalidate that block's cache
- When a page is shared → Invalidate permissions cache
- Use TTL (5 minutes) as backup`,

  whyItMatters: 'At 70K reads/sec peak, hitting the database for every page load would melt it. Caching is essential.',

  famousIncident: {
    title: 'Notion Slowdown 2019',
    company: 'Notion',
    year: '2019',
    whatHappened: 'As Notion grew, pages with large databases became unbearably slow. Users waited 10+ seconds to load pages. The issue was querying thousands of database rows without caching.',
    lessonLearned: 'They implemented aggressive caching for database queries and lazy loading for large tables. Load times dropped from 10s to <1s.',
    icon: '🚀',
  },

  realWorldExample: {
    company: 'Notion',
    scenario: 'Serving 2 billion page views per day',
    howTheyDoIt: 'Uses Redis to cache block content and page metadata. Cache hit rate > 90%. Most page loads never touch the database.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (90% of requests)
                     │   Return instantly!
`,

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache blocks, page metadata, permissions',
    'Invalidate cache when blocks are edited',
    'TTL as backup (300 seconds)',
  ],

  quickCheck: {
    question: 'What should be cached for Notion pages?',
    options: [
      'Only page titles',
      'Page metadata, block content, and permissions',
      'Only images',
      'User passwords',
    ],
    correctIndex: 1,
    explanation: 'Cache frequently accessed data: page metadata (read often), block content, and permissions (checked on every request).',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'Invalidation', explanation: 'Remove stale data when changes happen', icon: '🗑️' },
  ],
};

const step4: GuidedStep = {
  id: 'notion-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Blocks load fast, FR-4: Databases query efficiently',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache blocks and page metadata for fast queries', displayName: 'Redis Cache' },
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
  scenario: "Your single app server is maxed out at 100% CPU!",
  hook: "A popular YouTuber featured Notion. Traffic spiked 10x. One server can't handle it.",
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
  nextTeaser: "But we need real-time collaboration for multiple editors...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Handle Massive Traffic',
  conceptExplanation: `A **Load Balancer** distributes incoming traffic across multiple servers.

Benefits:
- **No single point of failure** - if one server dies, others keep working
- **Horizontal scaling** - add more servers to handle more traffic
- **Even distribution** - no single server gets overwhelmed

For Notion:
- Use **round-robin** for stateless API requests
- Later: **sticky sessions** for WebSocket connections (real-time)
- Health checks to route away from failed servers`,

  whyItMatters: 'At peak, Notion handles 70K reads/sec + 18K writes/sec. No single server can handle that load.',

  famousIncident: {
    title: 'Notion Downtime January 2021',
    company: 'Notion',
    year: '2021',
    whatHappened: 'During a major traffic spike, Notion\'s load balancers became overwhelmed. The service was down for several hours, affecting millions of users worldwide.',
    lessonLearned: 'They upgraded their load balancing infrastructure and added auto-scaling to handle traffic spikes.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'Notion',
    scenario: 'Handling traffic spikes during launches',
    howTheyDoIt: 'Uses multiple layers of load balancing (DNS, L4, L7) with auto-scaling app servers to handle sudden traffic increases.',
  },

  keyPoints: [
    'Load balancer distributes requests across servers',
    'Enables horizontal scaling (add more servers)',
    'Eliminates single point of failure',
    'Use sticky sessions for WebSocket (coming in Step 6)',
  ],

  quickCheck: {
    question: 'What is horizontal scaling?',
    options: [
      'Making one server bigger',
      'Adding more servers to distribute load',
      'Rotating servers',
      'Upgrading the network',
    ],
    correctIndex: 1,
    explanation: 'Horizontal scaling means adding more servers (scale out) vs making one server bigger (vertical scaling/scale up).',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Health Checks', explanation: 'Monitor server health, route away from failures', icon: '💚' },
  ],
};

const step5: GuidedStep = {
  id: 'notion-step-5',
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
  scenario: "Your database crashed for 20 minutes during a big presentation!",
  hook: "Teams couldn't access their docs. Revenue loss: $500,000 in lost productivity.",
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
  nextTeaser: "But we still need real-time collaboration...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Never Lose Documents',
  conceptExplanation: `**Replication** copies your data to multiple database servers.

Types:
- **Primary (Leader)**: Handles all writes
- **Replicas (Followers)**: Handle reads, stay in sync with primary

Benefits:
- **High availability**: If primary fails, replica takes over
- **Read scaling**: Distribute reads across replicas
- **Data safety**: Multiple copies of your documents

For Notion:
- All writes go to primary
- Reads distributed across replicas
- Replication lag typically < 100ms`,

  whyItMatters: 'A single database is a single point of failure. For Notion\'s billions of blocks, downtime means teams can\'t work.',

  famousIncident: {
    title: 'Notion Multi-Hour Outage',
    company: 'Notion',
    year: '2020',
    whatHappened: 'A database issue caused a multi-hour outage affecting millions of users. Teams couldn\'t access their docs during critical work hours. The incident highlighted the need for better database resilience.',
    lessonLearned: 'Database replication and failover must be automatic and well-tested. Manual intervention takes too long.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'Notion',
    scenario: 'Zero tolerance for data loss',
    howTheyDoIt: 'Uses PostgreSQL with streaming replication. Multiple read replicas across availability zones. Automatic failover if primary fails.',
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
    'Replication lag typically < 100ms',
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
    explanation: 'With replication, a replica can be promoted to primary (failover), maintaining availability and preventing data loss.',
  },

  keyConcepts: [
    { title: 'Primary', explanation: 'The database that handles writes', icon: '👑' },
    { title: 'Replica', explanation: 'Read-only copy that stays in sync', icon: '📋' },
    { title: 'Failover', explanation: 'Promoting a replica when primary fails', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'notion-step-6',
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
// STEP 7: Add Message Queue for Real-Time Collaboration
// =============================================================================

const step7Story: StoryContent = {
  emoji: '👥',
  scenario: "Two users are editing the same page. Their changes are overwriting each other!",
  hook: "User A types 'Hello' while User B types 'World'. Only 'World' survives. User A is upset!",
  challenge: "Add a message queue to enable real-time collaboration with conflict resolution.",
  illustration: 'collaboration-conflict',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Real-time collaboration is working!',
  achievement: 'Multiple users can edit simultaneously without conflicts',
  metrics: [
    { label: 'Edit propagation latency', before: 'N/A', after: '<200ms' },
    { label: 'Concurrent editors supported', after: '50+' },
  ],
  nextTeaser: "But we're spending too much on infrastructure...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Real-Time Collaboration: WebSockets + Message Queue',
  conceptExplanation: `Real-time collaboration is THE defining feature of modern productivity tools.

**Architecture**:
1. Users establish **WebSocket connections** for bidirectional real-time updates
2. When User A edits a block:
   - Edit sent to App Server via WebSocket
   - App Server publishes to **Message Queue**
   - All users subscribed to that page receive the edit
   - Changes appear in < 200ms

**Conflict Resolution** (Operational Transformation):
- Track edit position and offset
- If two users edit same block, transform operations
- Ensure all users converge to same final state
- Like Google Docs or Figma

**Message Queue Benefits**:
- Decouples edit publishing from delivery
- Scales to thousands of concurrent editors
- Maintains edit order per page
- Handles offline/reconnection scenarios`,

  whyItMatters: 'Real-time collaboration is what makes Notion magical. Without it, you\'re just a fancy note-taking app.',

  famousIncident: {
    title: 'Google Docs Operational Transformation',
    company: 'Google',
    year: '2010',
    whatHappened: 'Google Docs pioneered real-time collaboration at scale using Operational Transformation. They had to solve complex edge cases where edits conflict. Published research became industry standard.',
    lessonLearned: 'Real-time collaboration is hard. Use proven algorithms (OT or CRDT). Don\'t reinvent the wheel.',
    icon: '📝',
  },

  realWorldExample: {
    company: 'Notion',
    scenario: 'Supporting 50+ concurrent editors per page',
    howTheyDoIt: 'Uses WebSocket connections with a custom OT-like system. Message queue (likely Kafka) handles edit distribution. Conflicts resolved on server.',
  },

  diagram: `
User A edits block
      │
      ▼ (WebSocket)
┌─────────────┐     ┌─────────────────────────────────────┐
│ App Server  │────▶│          Message Queue              │
│             │     │  [page123:edit, page456:edit, ...]  │
└─────────────┘     └──────────────┬──────────────────────┘
                                   │
                                   │ Push to subscribers
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
        ┌──────────┐         ┌──────────┐        ┌──────────┐
        │ User B   │         │ User C   │        │ User D   │
        │(WebSocket│         │(WebSocket│        │(WebSocket│
        └──────────┘         └──────────┘        └──────────┘
`,

  keyPoints: [
    'WebSocket for bidirectional real-time communication',
    'Message queue for edit distribution and ordering',
    'Operational Transformation (OT) for conflict resolution',
    'Subscribe users to pages they have open',
    'Edit propagation in < 200ms',
  ],

  quickCheck: {
    question: 'Why use a message queue for real-time collaboration?',
    options: [
      'It\'s cheaper',
      'Decouples publishing from delivery, scales to many editors',
      'It uses less memory',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Message queue allows one server to publish an edit, and the queue distributes to all subscribed users efficiently. Scales to thousands of concurrent editors.',
  },

  keyConcepts: [
    { title: 'WebSocket', explanation: 'Bidirectional real-time connection', icon: '🔌' },
    { title: 'Message Queue', explanation: 'Distributes edits to all editors', icon: '📬' },
    { title: 'OT', explanation: 'Operational Transformation for conflicts', icon: '🔀' },
  ],
};

const step7: GuidedStep = {
  id: 'notion-step-7',
  stepNumber: 7,
  frIndex: 4,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-5: Real-time collaboration (multiple editors)',
    taskDescription: 'Add a Message Queue for real-time edit distribution',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Distribute edits to all collaborators in real-time', displayName: 'Kafka' },
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
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables real-time collaboration.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is concerned! Your monthly cloud bill is $800,000.",
  hook: "The CFO says: 'Cut costs by 40% or we need to raise prices.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Notion!',
  achievement: 'A scalable, cost-effective productivity platform',
  metrics: [
    { label: 'Monthly cost', before: '$800K', after: 'Under budget' },
    { label: 'Page load latency', after: '<500ms' },
    { label: 'Edit propagation', after: '<200ms' },
    { label: 'Availability', after: '99.99%' },
  ],
  nextTeaser: "You've mastered Notion system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about features - it's about **sustainable costs**.

Cost optimization strategies for Notion:
1. **Lazy load blocks** - Only load visible blocks, not entire page
2. **Compress block content** - JSON blocks compress well (30-50% savings)
3. **Cache aggressively** - 90%+ cache hit rate reduces DB costs
4. **Auto-scale** - Scale down during off-hours (nights/weekends)
5. **Archive inactive workspaces** - Move cold data to cheaper storage
6. **Optimize database queries** - Index frequently queried fields
7. **Reduce WebSocket connections** - Close idle connections after timeout

For Notion:
- Peak hours: Business hours (9am-6pm)
- Auto-scale servers based on active users
- Cache blocks for 5 minutes (reduces DB load 90%)
- Archive workspaces inactive > 90 days`,

  whyItMatters: 'At Notion\'s scale, every 1% efficiency improvement saves hundreds of thousands of dollars per year.',

  famousIncident: {
    title: 'Notion\'s Growth Challenges',
    company: 'Notion',
    year: '2020-2021',
    whatHappened: 'As Notion exploded in popularity during COVID-19 remote work, their infrastructure costs skyrocketed. They had to aggressively optimize caching, lazy loading, and database queries to keep costs sustainable.',
    lessonLearned: 'Design for cost from day 1. Rapid growth can break the bank if not optimized.',
    icon: '📈',
  },

  realWorldExample: {
    company: 'Notion',
    scenario: 'Running at scale profitably',
    howTheyDoIt: 'Uses aggressive caching (Redis), lazy loading (only visible blocks), auto-scaling, and compressed storage. Heavy optimization of database queries.',
  },

  keyPoints: [
    'Lazy load blocks - only fetch what\'s visible',
    'Cache aggressively (90%+ hit rate)',
    'Auto-scale based on active users',
    'Compress block content (JSON)',
    'Archive inactive workspaces to cheaper storage',
  ],

  quickCheck: {
    question: 'What\'s the best cost optimization for Notion\'s usage pattern (peak during business hours)?',
    options: [
      'Delete old pages',
      'Auto-scale down at night and weekends',
      'Reduce database replicas',
      'Remove caching',
    ],
    correctIndex: 1,
    explanation: 'Notion usage follows work hours. Auto-scaling saves 50%+ by scaling down nights and weekends when few users are active.',
  },

  keyConcepts: [
    { title: 'Lazy Loading', explanation: 'Only load visible content', icon: '👁️' },
    { title: 'Auto-Scaling', explanation: 'Automatically adjust capacity', icon: '📊' },
    { title: 'Cost/Performance', explanation: 'Balance budget with requirements', icon: '⚖️' },
  ],
};

const step8: GuidedStep = {
  id: 'notion-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $500/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $500/month',
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
    level2: 'Consider: fewer replicas, optimized cache, right-sized instances. Balance cost with reliability.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const notionGuidedTutorial: GuidedTutorial = {
  problemId: 'notion',
  title: 'Design Notion',
  description: 'Build a productivity platform with block-based pages, databases, and real-time collaboration',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '📝',
    hook: "You've been hired as Lead Engineer at ProductivityTech Inc!",
    scenario: "Your mission: Build a Notion-like platform where teams can create docs, databases, and collaborate in real-time.",
    challenge: "Can you design a system that handles block-based documents with real-time collaboration?",
  },

  requirementsPhase: notionRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Block-Based Data Model',
    'Tree Structure (Nested Pages)',
    'Database Design',
    'Caching',
    'Load Balancing',
    'Database Replication',
    'WebSocket Connections',
    'Real-Time Collaboration',
    'Message Queues',
    'Operational Transformation (OT)',
    'Lazy Loading',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 11: Stream Processing',
    'Chapter 12: Data Systems',
  ],
};

export default notionGuidedTutorial;
