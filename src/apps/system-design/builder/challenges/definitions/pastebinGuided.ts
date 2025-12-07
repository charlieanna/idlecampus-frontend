import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';
import { TestCase } from '../../types/testCase';

/**
 * Pastebin Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches system design concepts
 * while building a text/code sharing service like Pastebin or GitHub Gist.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-2: Build brute force solution (in-memory) - FRs satisfied!
 * Step 3: Add persistence (database)
 * Steps 4+: Apply NFRs (cache, CDN, expiration, syntax highlighting, etc.)
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const pastebinRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a text/code sharing service like Pastebin or GitHub Gist",

  interviewer: {
    name: 'David Park',
    role: 'Senior Engineering Manager',
    avatar: '👨‍💼',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality (from user's experience)
    {
      id: 'core-operations',
      category: 'functional',
      question: "What can users do with this system? What's the main user experience?",
      answer: "Users have two main experiences:\n1. **Create a paste**: A user pastes text/code, clicks 'Create', and gets back a shareable link (like pastebin.com/abc123)\n2. **View a paste**: A user clicks a paste link and sees the text/code content, optionally with syntax highlighting",
      importance: 'critical',
      revealsRequirement: 'FR-1 and FR-2',
      learningPoint: "Always start by understanding the user's experience - what they see and do",
    },
    {
      id: 'paste-content',
      category: 'functional',
      question: "What types of content can users paste? Any restrictions?",
      answer: "Users can paste:\n- Plain text\n- Source code in various languages (Python, JavaScript, Java, etc.)\n- Configuration files, logs, JSON, etc.\n\nRestrictions:\n- Max size: 512 KB per paste (about 500 lines of code)\n- Text only, no binary files or images",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Content size limits affect storage, bandwidth, and rendering decisions",
    },
    {
      id: 'syntax-highlighting',
      category: 'functional',
      question: "Should code be displayed with syntax highlighting?",
      answer: "Yes! Users should be able to specify a language (Python, JavaScript, etc.), and the paste should display with proper syntax highlighting. This is a key feature for developers sharing code snippets.",
      importance: 'important',
      revealsRequirement: 'FR-3',
      learningPoint: "Syntax highlighting significantly improves readability for code sharing",
    },
    {
      id: 'paste-expiration',
      category: 'functional',
      question: "Do pastes live forever, or do they expire?",
      answer: "Users should be able to choose expiration options:\n- Never expire (default)\n- 1 hour\n- 1 day\n- 1 week\n- 1 month\n\nThis helps manage storage and privacy. Auto-cleanup keeps storage costs down.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Expiration is both a user feature and a cost optimization strategy",
    },

    // IMPORTANT - Clarifications (from user's experience)
    {
      id: 'paste-privacy',
      category: 'clarification',
      question: "Can pastes be private, or are they all public?",
      answer: "For the MVP, we'll support three privacy levels:\n1. **Public** - Anyone with the link can view, appears in recent pastes list\n2. **Unlisted** - Anyone with the link can view, but doesn't appear in lists\n3. **Private** - Only the creator can view (requires login)\n\nMost users (80%) use unlisted pastes.",
      importance: 'important',
      insight: "Privacy levels affect caching and access control strategies",
    },
    {
      id: 'paste-editing',
      category: 'clarification',
      question: "Can users edit or delete their pastes after creation?",
      answer: "For the MVP:\n- **No editing** once created (immutable)\n- **Delete**: Only if user is logged in and owns the paste\n- Anonymous pastes cannot be deleted\n\nThis simplifies the design - no versioning, no edit conflicts.",
      importance: 'important',
      insight: "Immutability makes caching and distribution much simpler",
    },
    {
      id: 'user-accounts',
      category: 'clarification',
      question: "Do users need to create accounts, or can they paste anonymously?",
      answer: "Both! Anonymous pastes for quick sharing, accounts for managing pastes. Anonymous users: 70%, Registered users: 30%.",
      importance: 'nice-to-have',
      insight: "Anonymous access is core to the user experience - low friction",
    },
    {
      id: 'paste-analytics',
      category: 'clarification',
      question: "Do users see view counts or analytics?",
      answer: "Not for this interview. We're focusing on the core paste create/view functionality. Analytics could be added later.",
      importance: 'nice-to-have',
      insight: "Analytics is a separate concern - don't over-design for it now",
    },

    // SCOPE
    {
      id: 'scope-single-region',
      category: 'scope',
      question: "Is this for a single region or global?",
      answer: "Let's start with a single region. We can discuss multi-region CDN distribution as an extension.",
      importance: 'nice-to-have',
      insight: "Starting simple with single region is the right approach",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs (Interview Discovery Order)
    // =============================================================================

    // 1. THROUGHPUT (First - tells you the scale)
    {
      id: 'throughput-dau',
      category: 'throughput',
      question: "How many daily active users (DAU) should we design for?",
      answer: "10 million DAU",
      importance: 'critical',
      learningPoint: "DAU gives you the scale context for all calculations",
    },
    {
      id: 'throughput-writes',
      category: 'throughput',
      question: "How many pastes are created per day?",
      answer: "About 5 million new pastes per day",
      importance: 'critical',
      calculation: {
        formula: "5M ÷ 86,400 sec = 58 writes/sec average",
        result: "~58 writes/sec (174 at peak)",
      },
      learningPoint: "This tells you write load on the database",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many paste views per day?",
      answer: "About 50 million views per day (10x reads to writes)",
      importance: 'critical',
      calculation: {
        formula: "50M ÷ 86,400 sec = 579 reads/sec average",
        result: "~580 reads/sec (1,740 at peak)",
      },
      learningPoint: "This tells you read load - 10:1 read-to-write ratio",
    },

    // 2. PAYLOAD (Second - affects bandwidth and storage)
    {
      id: 'payload-paste-size',
      category: 'payload',
      question: "What's the typical and maximum paste size?",
      answer: "Average paste: 2 KB, Maximum: 512 KB",
      importance: 'important',
      calculation: {
        formula: "5M pastes/day × 2KB avg = 10GB/day",
        result: "~3.6TB/year storage growth",
      },
      learningPoint: "Storage grows linearly with paste creation rate",
    },
    {
      id: 'payload-metadata',
      category: 'payload',
      question: "What metadata do we store with each paste?",
      answer: "Paste ID, content, language, expiration time, created timestamp, privacy level. About 2.5KB total per paste.",
      importance: 'important',
      learningPoint: "Metadata is small compared to content",
    },

    // 3. BURSTS (Third - capacity planning)
    {
      id: 'burst-peak',
      category: 'burst',
      question: "What's the peak-to-average traffic ratio?",
      answer: "Peak traffic is about 3x the average (business hours spike)",
      importance: 'critical',
      calculation: {
        formula: "579 avg × 3 = 1,737 peak",
        result: "~1,740 reads/sec at peak",
      },
      insight: "You MUST design for peak, not average. 3x is typical for developer tools.",
    },
    {
      id: 'burst-viral',
      category: 'burst',
      question: "Are there sudden traffic spikes we should handle?",
      answer: "Yes, when a paste gets shared on social media or tech forums, it can get 10,000+ views in minutes. These hot pastes should be heavily cached.",
      importance: 'important',
      insight: "Need caching and CDN for viral content",
    },

    // 4. LATENCY (Fourth - response time requirements)
    {
      id: 'latency-view',
      category: 'latency',
      question: "What's the acceptable latency for viewing a paste?",
      answer: "p99 should be under 200ms - users expect instant page loads",
      importance: 'critical',
      learningPoint: "This is Request/Response latency - the user is waiting",
    },
    {
      id: 'latency-create',
      category: 'latency',
      question: "What about latency for creating pastes?",
      answer: "p99 under 500ms is acceptable - users can wait a moment for paste creation",
      importance: 'important',
      learningPoint: "Create is less latency-sensitive than view",
    },
    {
      id: 'latency-syntax',
      category: 'latency',
      question: "Should syntax highlighting happen server-side or client-side?",
      answer: "Good question! **Client-side** is better - it reduces server load and latency. Server just delivers the raw text with language metadata, browser does the highlighting.",
      importance: 'important',
      insight: "Offload compute to client when possible",
    },
  ],

  minimumQuestionsRequired: 2,
  criticalQuestionIds: ['core-operations', 'paste-content'],
  criticalFRQuestionIds: ['core-operations', 'paste-content'],
  criticalScaleQuestionIds: ['throughput-writes', 'throughput-reads', 'burst-peak', 'latency-view'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can create pastes',
      description: 'Paste text/code and get back a shareable link (e.g., pastebin.com/abc123)',
      emoji: '📝',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can view pastes',
      description: 'Click a paste link to view the content',
      emoji: '👁️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Syntax highlighting',
      description: 'Display code with proper syntax highlighting based on language',
      emoji: '🎨',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Paste expiration',
      description: 'Users can set expiration time (1 hour, 1 day, 1 week, never)',
      emoji: '⏰',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million',
    writesPerDay: '5 million',
    readsPerDay: '50 million',
    peakMultiplier: 3,
    readWriteRatio: '10:1',
    calculatedWriteRPS: { average: 58, peak: 174 },
    calculatedReadRPS: { average: 579, peak: 1737 },
    maxPayloadSize: '~512KB',
    storagePerRecord: '~2.5KB average',
    storageGrowthPerYear: '~3.6TB',
    redirectLatencySLA: 'p99 < 200ms',
    createLatencySLA: 'p99 < 500ms',
  },

  architecturalImplications: [
    '✅ Read-heavy (10:1) → Caching is important',
    '✅ 1,740 reads/sec peak → Need caching and potentially CDN',
    '✅ Only 174 writes/sec peak → Single DB primary will work',
    '✅ p99 < 200ms view → Cache hot pastes',
    '✅ Immutable content → Perfect for CDN caching',
    '✅ Expiration feature → Need background cleanup jobs',
  ],

  outOfScope: [
    'Paste editing (immutable only)',
    'Real-time collaboration',
    'Advanced analytics',
    'Multi-region deployment',
    'Binary file uploads',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple Client → App Server solution that satisfies our functional requirements. Once it works, we'll optimize for scale and performance in later steps. This is the right way to approach system design: functionality first, then optimization.",
};

// =============================================================================
// STEP 1: The Beginning - Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome, engineer! You've been hired to build Pastebin - a code sharing service.",
  hook: "Your first task: get the basic system running. Users need to send requests to your server.",
  challenge: "Connect the Client to the App Server to handle user requests.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your system is connected!",
  achievement: "Users can now send requests to your App Server",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can handle requests', after: '✓' },
  ],
  nextTeaser: "But the server is empty... let's write some code!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: App Servers',
  conceptExplanation: `Every web application starts with an **App Server** - the brain of your system.

When a user wants to create or view a paste, their request travels to your app server, which:
1. Receives the HTTP request
2. Processes the business logic
3. Returns the paste content or confirmation

Think of it as a library clerk - takes requests, finds/stores content, returns results.`,
  whyItMatters: 'The app server is the entry point for ALL user interactions.',
  keyPoints: [
    'App servers are stateless - they don\'t store permanent data',
    'Each request is independent and self-contained',
    'Horizontal scaling: add more servers to handle more traffic',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────┐
│   Client    │ ──────▶ │   App Server    │
│  (Browser)  │ ◀────── │  (Your Code)    │
└─────────────┘         └─────────────────┘
`,
  keyConcepts: [
    {
      title: 'Request/Response',
      explanation: 'Client sends request → Server processes → Server responds',
      icon: '↔️',
    },
  ],
  quickCheck: {
    question: 'What does the App Server do?',
    options: [
      'Stores data permanently',
      'Processes requests and returns responses',
      'Balances traffic across servers',
      'Caches frequently accessed data',
    ],
    correctIndex: 1,
    explanation: 'The App Server receives requests, processes business logic, and returns responses to clients.',
  },
};

const step1: GuidedStep = {
  id: 'pastebin-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Users can submit requests to the system',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes requests', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send requests' },
    ],
    successCriteria: ['Add Client', 'Add App Server', 'Connect Client → App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'First add Client, then add App Server, then connect them',
    level2: 'Drag Client and App Server from the sidebar, then drag from Client to App Server to connect',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Configure the App Server with Python Code
// =============================================================================

const step2Story: StoryContent = {
  emoji: '⚙️',
  scenario: "Your App Server is connected, but it's just an empty box right now.",
  hook: "It doesn't know HOW to create pastes or display them. We need to teach it by writing actual Python code!",
  challenge: "Configure the App Server with APIs and implement the Python handlers for paste creation and viewing.",
  illustration: 'configure-server',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Your App Server is now functional!",
  achievement: "Users can create pastes and view them",
  metrics: [
    { label: 'APIs configured', after: '2 endpoints' },
    { label: 'Code written', after: '✓ Working' },
  ],
  nextTeaser: "But wait... what happens when the server restarts?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Design & Python Implementation',
  conceptExplanation: `Your App Server needs to handle two main operations. You'll implement these in Python!

**1. Create Paste (POST /api/v1/pastes)** — You'll implement this in Python
- Receives: Paste content, language, expiration
- Returns: Paste ID and shareable URL
- Your code: Generate unique ID, store in memory (for now)

**2. View Paste (GET /api/v1/pastes/:id)** — You'll implement this in Python
- Receives: Paste ID
- Returns: Paste content, language, metadata
- Your code: Look up ID, return paste data

**By the end of this step you should have:**
1. ✅ APIs assigned to the App Server
2. ✅ Python handlers implemented for both endpoints`,
  whyItMatters: 'Without the code, your server is just an empty shell. The Python handlers define what actually happens when users interact with your system. This is where your system design becomes real!',
  keyPoints: [
    'POST endpoint creates new pastes (you\'ll write the Python code)',
    'GET endpoint retrieves paste content (you\'ll write the Python code)',
    'Each endpoint needs proper error handling',
    'Paste IDs should be unique and URL-safe',
    'Open the Python tab to see and edit your handler code',
  ],
  diagram: `
POST /api/v1/pastes
┌─────────────────────────────────────────────────────┐
│ Request:  { "content": "print('hello')",           │
│             "language": "python",                   │
│             "expiration": "1d" }                    │
│ Response: { "id": "abc123",                         │
│             "url": "pastebin.com/abc123" }          │
└─────────────────────────────────────────────────────┘

GET /api/v1/pastes/abc123
┌─────────────────────────────────────────────────────┐
│ Response: { "content": "print('hello')",           │
│             "language": "python",                   │
│             "created_at": "2024-01-15T10:30:00Z" }  │
└─────────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'REST API', explanation: 'POST to create, GET to read', icon: '🔌' },
    { title: 'Paste ID', explanation: 'Unique identifier like "abc123" for each paste', icon: '🔑' },
    { title: 'Python Handlers', explanation: 'The actual code that processes each request', icon: '🐍' },
  ],
  quickCheck: {
    question: 'Which HTTP method should be used to CREATE a new paste?',
    options: [
      'GET - because we\'re getting a paste ID back',
      'POST - because we\'re creating a new resource',
      'PUT - because we\'re updating content',
      'DELETE - because we\'re removing whitespace',
    ],
    correctIndex: 1,
    explanation: 'POST is used to create new resources. We\'re creating a new paste.',
  },
};

const step2: GuidedStep = {
  id: 'pastebin-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'App Server must handle paste creation and viewing with Python code',
    taskDescription: 'Re-use your Client → App Server from Step 1, then configure APIs and implement the Python handlers',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'Client' },
      { type: 'app_server', reason: 'Configure APIs and write Python code', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Already connected in Step 1' },
    ],
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/pastes and GET /api/v1/pastes/* APIs',
      'Open the Python tab and implement the handlers for both endpoints',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Click App Server to configure APIs, then switch to the Python tab to write your handlers',
    level2: 'After assigning APIs in the inspector, switch to the Python editor tab and fill in the TODOs in the template. Implement create_paste() and get_paste().',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: The Crisis - We Lost All Data!
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 2 AM. Your server crashed and restarted.",
  hook: "When it came back online... ALL the pastes were GONE! Users are furious - their shared code snippets don't work anymore!",
  challenge: "The problem: data was stored in server memory. When the server restarted, everything vanished. We need persistent storage!",
  illustration: 'server-crash',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Your data is now safe!",
  achievement: "Pastes persist even if the server restarts",
  metrics: [
    { label: 'Data durability', before: '❌ Lost on restart', after: '✓ Persisted forever' },
    { label: 'Storage', after: 'PostgreSQL Database' },
  ],
  nextTeaser: "Nice! But viral pastes are loading slowly...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Data Persistence: Why Databases Matter',
  conceptExplanation: `Without a database, your app server stores data in memory (RAM).

**Problem**: RAM is volatile - when the server restarts, all data is lost!

**Solution**: Store data in a database. Databases write to disk and ensure your data survives:
- Server crashes
- Restarts
- Power outages
- Hardware failures (with replication)

For Pastebin, we need to store: paste content, metadata, expiration times.`,
  whyItMatters: 'Without persistent storage, all your pastes disappear when the server restarts!',
  realWorldExample: {
    company: 'GitHub Gist',
    scenario: 'Storing millions of code snippets',
    howTheyDoIt: 'Uses MySQL for metadata and Git for versioned content storage. Handles 1,000+ writes/second.',
  },
  famousIncident: {
    title: 'Code Spaces Disaster',
    company: 'Code Spaces',
    year: '2014',
    whatHappened: 'A code hosting company suffered a devastating attack. Hackers deleted their entire AWS infrastructure, including all backups. They had no offline backups. The company shut down permanently, and all customer code was lost forever.',
    lessonLearned: 'Always have persistent storage with proper backups in multiple locations. Never rely solely on ephemeral storage or single-region backups.',
    icon: '💀',
  },
  keyPoints: [
    'RAM is volatile, databases persist to disk',
    'Pastebin has a key-value pattern: paste_id → content',
    'Read-heavy workload: ~10:1 read-to-write ratio',
  ],
  diagram: `
┌─────────────┐       ┌─────────────┐       ┌────────────────┐
│   Client    │ ────▶ │ App Server  │ ────▶ │   Database     │
└─────────────┘       └─────────────┘       │                │
                                            │  abc123 → {...}│
                                            │  xyz789 → {...}│
                                            └────────────────┘
`,
  keyConcepts: [
    { title: 'Persistence', explanation: 'Data survives restarts and crashes', icon: '💾' },
    { title: 'Key-Value', explanation: 'Simple lookup: key (paste_id) → value (paste data)', icon: '🔑' },
  ],
  quickCheck: {
    question: 'Why did we lose all data when the server restarted?',
    options: [
      'The database was deleted',
      'Data was only stored in RAM (memory), which is volatile',
      'The network connection failed',
      'Users deleted their pastes',
    ],
    correctIndex: 1,
    explanation: 'RAM is volatile - it loses all data when power is lost. Databases persist data to disk.',
  },
};

const step3: GuidedStep = {
  id: 'pastebin-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Paste data must persist durably',
    taskDescription: 'Build Client → App Server → Database',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes API requests', displayName: 'App Server' },
      { type: 'database', reason: 'Stores pastes persistently', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send requests' },
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes paste data' },
    ],
    successCriteria: ['Add Client, App Server, Database', 'Connect Client → App Server → Database'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Build the full path: Client → App Server → Database',
    level2: 'Add all three components and connect them in sequence',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: The Viral Post - Cache Hot Pastes
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🔥',
  scenario: "A developer just shared a viral code snippet on Twitter!",
  hook: "Thousands of people are clicking the link. Your database is getting hammered with the same query over and over. Latency is spiking to 500ms!",
  challenge: "Popular pastes are being viewed thousands of times per minute. We're hitting the database unnecessarily!",
  illustration: 'viral-content',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Paste views are now lightning fast!",
  achievement: "Popular pastes are served from cache in milliseconds",
  metrics: [
    { label: 'View latency', before: '500ms', after: '5ms' },
    { label: 'Database load', before: '1,000 queries/sec', after: '100 queries/sec' },
    { label: 'Cache hit rate', after: '90%' },
  ],
  nextTeaser: "Great! But we need to handle expiring pastes...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Secret to Speed',
  conceptExplanation: `**Key insight**: Pastebin is read-heavy. For every paste created, it might be viewed 100+ times.

**The math**:
- Database query: 10-50ms
- Cache lookup: 1-5ms
- That's **10-50x faster!**

**How caching works**:
1. User views paste
2. Check cache: Is "abc123" in Redis?
3. **Cache HIT**: Return immediately (5ms)
4. **Cache MISS**: Query database, store in cache, return (50ms)

The top 20% of pastes get 80% of views - keep them hot in cache.`,
  whyItMatters: 'Without caching, every view hits the database. At scale, the database becomes the bottleneck.',
  realWorldExample: {
    company: 'GitHub Gist',
    scenario: 'Handling viral code snippets with millions of views',
    howTheyDoIt: 'Redis clusters cache popular gists. When a snippet goes viral, it gets cached at the CDN edge too.',
  },
  famousIncident: {
    title: 'Reddit Cache Failure',
    company: 'Reddit',
    year: '2018',
    whatHappened: 'Reddit\'s caching layer had a major outage. All traffic immediately hit their database, which couldn\'t handle the load. The entire site went down for hours. Without the cache, the database was overwhelmed by 100x the normal query volume.',
    lessonLearned: 'Caching isn\'t just for performance - it\'s essential infrastructure. Always have cache warming strategies and gradual failover plans.',
    icon: '📉',
  },
  keyPoints: [
    'Cache-aside pattern: Check cache first, then database',
    'Set TTL to prevent stale data',
    '90%+ cache hit ratio is achievable for popular pastes',
    'Immutable content (pastes can\'t be edited) is perfect for caching',
  ],
  diagram: `
                          ┌─────────────┐
                   ┌────▶ │    Cache    │ ← 5ms
                   │      │   (Redis)   │
┌────────┐    ┌────┴─────┐└─────────────┘
│ Client │───▶│App Server│      │ miss?
└────────┘    └────┬─────┘      ▼
                   └────▶ ┌─────────────┐
                          │  Database   │ ← 50ms
                          └─────────────┘
`,
  keyConcepts: [
    { title: 'Cache-Aside', explanation: 'Check cache first, DB on miss, update cache', icon: '📦' },
    { title: 'TTL', explanation: 'Time-To-Live: cached data expires automatically', icon: '⏰' },
    { title: 'Immutable', explanation: 'Pastes never change, perfect for caching', icon: '🔒' },
  ],
  quickCheck: {
    question: 'What happens on a cache MISS?',
    options: [
      'Return an error',
      'Query database, return result, update cache',
      'Wait for cache to be populated',
      'Redirect to a different server',
    ],
    correctIndex: 1,
    explanation: 'On a cache miss, we query the database, return the result to the user, and store it in cache for next time.',
  },
};

const step4: GuidedStep = {
  id: 'pastebin-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Paste views must be fast (< 10ms p99)',
    taskDescription: 'Build Client → App Server → Database + Cache',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes API requests', displayName: 'App Server' },
      { type: 'database', reason: 'Stores pastes persistently', displayName: 'Database' },
      { type: 'cache', reason: 'Caches hot pastes for fast lookups', displayName: 'Cache (Redis)' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send requests' },
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes pastes' },
      { from: 'App Server', to: 'Cache', reason: 'Server checks cache before database' },
    ],
    successCriteria: ['Build full architecture with Cache', 'Connect App Server to both Database and Cache'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Build the full system with a Cache for fast lookups',
    level2: 'Add Client, App Server, Database, and Cache - connect App Server to both storage components',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'database' }, { from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: The Cleanup - Paste Expiration System
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🗑️',
  scenario: "Your database is growing fast! Millions of pastes, many set to expire.",
  hook: "Users created pastes with 1-hour expiration yesterday. They should be deleted, but they're still there! Storage costs are climbing.",
  challenge: "We need a background job to automatically delete expired pastes. This keeps storage costs down and respects user privacy.",
  illustration: 'cleanup-job',
};

const step5Celebration: CelebrationContent = {
  emoji: '✨',
  message: "Expired pastes are automatically cleaned up!",
  achievement: "Background jobs keep your database lean",
  metrics: [
    { label: 'Storage growth', before: '+10GB/day', after: '+3GB/day' },
    { label: 'Expired pastes', before: 'Accumulating', after: 'Auto-deleted' },
    { label: 'Cleanup frequency', after: 'Every hour' },
  ],
  nextTeaser: "Awesome! But we need to handle traffic spikes...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Background Jobs & Message Queues',
  conceptExplanation: `Some tasks don't need to happen immediately. **Background jobs** run asynchronously without blocking user requests.

**For paste expiration:**
1. User creates paste with "1 hour" expiration
2. Expiration time is stored in database
3. Background job runs every hour
4. Job queries: "SELECT * FROM pastes WHERE expiration < NOW()"
5. Job deletes expired pastes

**Why use a message queue?**
- **Decoupling**: App Server doesn't do cleanup, just creates pastes
- **Reliability**: Jobs retry on failure
- **Scalability**: Can run multiple workers

**Pattern**: App Server → Queue → Worker`,
  whyItMatters: 'Without cleanup, storage grows forever. Background jobs handle maintenance tasks without impacting user latency.',
  realWorldExample: {
    company: 'Pastebin',
    scenario: 'Deleting millions of expired pastes daily',
    howTheyDoIt: 'Cron jobs run hourly to find and delete expired content. They use batch deletion to avoid overwhelming the database.',
  },
  famousIncident: {
    title: 'Imgur\'s Storage Crisis',
    company: 'Imgur',
    year: '2015',
    whatHappened: 'Imgur wasn\'t deleting old images aggressively. Their storage costs ballooned to millions per year. They eventually had to implement aggressive cleanup policies and delete images with no views in 6+ months.',
    lessonLearned: 'Plan for data lifecycle from day one. Expiration and cleanup are features, not afterthoughts.',
    icon: '📦',
  },
  keyPoints: [
    'Background jobs handle async tasks (cleanup, notifications, etc.)',
    'Message queues decouple producers from consumers',
    'Batch operations reduce database load',
    'Regular cleanup prevents storage bloat',
  ],
  diagram: `
┌─────────────┐                    ┌─────────────┐
│ App Server  │                    │   Worker    │
│             │                    │  (Cleanup)  │
└──────┬──────┘                    └──────▲──────┘
       │                                  │
       │ writes pastes                    │ reads expired
       ▼                                  │
┌─────────────┐       hourly       ┌─────┴───────┐
│  Database   │ ◀──────────────────│Message Queue│
│             │  query + delete    │   (Jobs)    │
└─────────────┘                    └─────────────┘
`,
  keyConcepts: [
    { title: 'Background Job', explanation: 'Async task that runs without blocking users', icon: '⚙️' },
    { title: 'Message Queue', explanation: 'System for async job processing (RabbitMQ, SQS)', icon: '📬' },
    { title: 'Batch Delete', explanation: 'Delete many records at once efficiently', icon: '🗑️' },
  ],
  quickCheck: {
    question: 'Why use background jobs for paste expiration instead of deleting immediately?',
    options: [
      'It\'s faster to delete in batches',
      'Avoids blocking user create/view requests',
      'Reduces database load with scheduled cleanup',
      'All of the above',
    ],
    correctIndex: 3,
    explanation: 'Background jobs provide all these benefits: batch efficiency, non-blocking operation, and scheduled execution that doesn\'t impact user requests.',
  },
};

const step5: GuidedStep = {
  id: 'pastebin-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'System must automatically delete expired pastes',
    taskDescription: 'Build Client → App Server → Database + Cache + Message Queue',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes API requests', displayName: 'App Server' },
      { type: 'database', reason: 'Stores pastes persistently', displayName: 'Database' },
      { type: 'cache', reason: 'Caches hot pastes', displayName: 'Cache' },
      { type: 'message_queue', reason: 'Schedules cleanup jobs', displayName: 'Message Queue' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send requests' },
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes pastes' },
      { from: 'App Server', to: 'Cache', reason: 'Server caches hot pastes' },
      { from: 'Message Queue', to: 'Database', reason: 'Background jobs clean up expired pastes' },
    ],
    successCriteria: [
      'Build full architecture with Message Queue',
      'Connect Message Queue to Database for cleanup',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'message_queue', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Build the full system with Message Queue for background cleanup',
    level2: 'Add all components including Message Queue, connect it to Database for cleanup jobs',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }, { type: 'message_queue' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 6: The Surge - We're Going Viral!
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📈',
  scenario: "BREAKING: Your service just got featured on Hacker News!",
  hook: "Traffic just spiked 100x! Your single App Server is melting - it can only handle 1,000 requests/second, but you're getting 10,000!",
  challenge: "One server isn't enough. We need to distribute traffic across multiple servers to handle the load!",
  illustration: 'traffic-spike',
};

const step6Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "You've built a scalable system!",
  achievement: "Your Pastebin handles massive traffic with high availability",
  metrics: [
    { label: 'Capacity', before: '1,000 req/s', after: '50,000 req/s' },
    { label: 'Availability', before: 'Single point of failure', after: '99.9% uptime' },
    { label: 'Servers', before: '1', after: 'Auto-scaling' },
  ],
  nextTeaser: "Great! But we should add global CDN distribution...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Handling the Traffic',
  conceptExplanation: `One app server handles ~1,000-10,000 req/s. What if you need 50,000?

**Solution**: Multiple servers behind a **Load Balancer**

The load balancer:
1. Receives ALL incoming traffic
2. Distributes requests across servers
3. Detects unhealthy servers and removes them
4. Enables zero-downtime deployments

**Algorithms**:
- **Round Robin**: Rotate through servers
- **Least Connections**: Send to least busy server
- **IP Hash**: Same client → same server (session affinity)`,
  whyItMatters: 'Load balancers provide scalability (handle more traffic) and availability (survive server failures).',
  realWorldExample: {
    company: 'GitHub',
    scenario: 'Handling 100+ million developers',
    howTheyDoIt: 'AWS load balancers distribute traffic across hundreds of servers. When load spikes (major releases, security advisories), they auto-scale.',
  },
  famousIncident: {
    title: 'HealthCare.gov Launch Failure',
    company: 'HealthCare.gov',
    year: '2013',
    whatHappened: 'The website launched expecting moderate traffic but got millions of simultaneous users. With inadequate load balancing and server capacity, the site crashed repeatedly. It took months to fix the infrastructure, costing hundreds of millions.',
    lessonLearned: 'Always plan for 10x your expected peak. Load balancers and auto-scaling are essential for handling viral growth.',
    icon: '🏥',
  },
  keyPoints: [
    'Horizontal scaling: more servers = more capacity',
    'Health checks remove failed servers automatically',
    'No single point of failure for app servers',
    'Session persistence can be sticky or stateless',
  ],
  diagram: `
                              ┌─────────────┐
                        ┌────▶│ App Server 1│
                        │     └─────────────┘
┌────────┐   ┌─────────┐│     ┌─────────────┐
│ Client │──▶│   LB    │┼────▶│ App Server 2│
└────────┘   └─────────┘│     └─────────────┘
                        │     ┌─────────────┐
                        └────▶│ App Server 3│
                              └─────────────┘
`,
  keyConcepts: [
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle more load', icon: '📈' },
    { title: 'Health Checks', explanation: 'LB pings servers, removes unhealthy ones', icon: '💓' },
    { title: 'Stateless', explanation: 'Any server can handle any request', icon: '🔄' },
  ],
  quickCheck: {
    question: 'What is the main benefit of a load balancer?',
    options: [
      'Reduces database queries',
      'Encrypts all traffic',
      'Distributes traffic for scale and availability',
      'Caches static content',
    ],
    correctIndex: 2,
    explanation: 'Load balancers distribute traffic across multiple servers for horizontal scaling and high availability.',
  },
};

const step6: GuidedStep = {
  id: 'pastebin-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'System must handle 50K requests/second',
    taskDescription: 'Build Client → Load Balancer → App Server → Database + Cache + Queue',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Processes API requests', displayName: 'App Server' },
      { type: 'database', reason: 'Stores pastes persistently', displayName: 'Database' },
      { type: 'cache', reason: 'Caches hot pastes', displayName: 'Cache' },
      { type: 'message_queue', reason: 'Background cleanup', displayName: 'Message Queue' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'All traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB forwards to servers' },
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes pastes' },
      { from: 'App Server', to: 'Cache', reason: 'Server caches hot pastes' },
      { from: 'Message Queue', to: 'Database', reason: 'Cleanup jobs' },
    ],
    successCriteria: [
      'Build full architecture with Load Balancer',
      'Client → LB → App Server → Database + Cache + Queue',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'message_queue', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Build the full system with Load Balancer in front',
    level2: 'Client → Load Balancer → App Server, then App Server connects to Database, Cache, and Queue to Database',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }, { type: 'message_queue' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 7: Global Distribution - CDN for Fast Access
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🌍',
  scenario: "Users from Europe and Asia are complaining about slow load times!",
  hook: "Your servers are in US-East. A user in Tokyo has to wait 200ms just for the network round-trip. Plus, your servers are handling all the static content delivery.",
  challenge: "We need to distribute pastes globally using a CDN. This reduces latency and offloads traffic from your servers.",
  illustration: 'global-cdn',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Your pastes are now served globally!",
  achievement: "CDN provides fast access worldwide",
  metrics: [
    { label: 'Latency (Tokyo)', before: '400ms', after: '50ms' },
    { label: 'Latency (London)', before: '300ms', after: '40ms' },
    { label: 'Origin traffic', before: '100%', after: '20%' },
  ],
  nextTeaser: "Excellent! But we need database replication for reliability...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Content Delivery Networks (CDN)',
  conceptExplanation: `A **CDN** is a globally distributed network of servers that cache and serve your content from the edge - close to users.

**How it works:**
1. User in Tokyo views paste "abc123"
2. CDN checks: Do I have this paste cached in Tokyo?
3. **Cache HIT**: Serve from Tokyo edge (50ms)
4. **Cache MISS**: Fetch from origin (US), cache at edge, serve (400ms first time, 50ms after)

**Why CDN for Pastebin?**
- Pastes are **immutable** - perfect for caching
- Text content is small - cheap to replicate
- Global user base needs low latency

**CDN vs Cache:**
- Cache (Redis): In your datacenter, fast backend lookup
- CDN: Globally distributed, serves directly to users`,
  whyItMatters: 'CDNs dramatically reduce latency for global users and offload traffic from your origin servers.',
  realWorldExample: {
    company: 'GitHub Gist',
    scenario: 'Serving code snippets to developers worldwide',
    howTheyDoIt: 'Uses Fastly CDN with 60+ edge locations. Popular gists are cached at the edge, reducing latency from 300ms to 20ms globally.',
  },
  famousIncident: {
    title: 'Cloudflare Outage Impact',
    company: 'Multiple Companies',
    year: '2020',
    whatHappened: 'A Cloudflare outage took down thousands of websites simultaneously because they relied solely on the CDN with no fallback. Sites couldn\'t serve content even though their origin servers were healthy.',
    lessonLearned: 'CDNs are critical infrastructure, but always have origin fallback. Don\'t put all eggs in one basket.',
    icon: '☁️',
  },
  keyPoints: [
    'CDN caches content at edge locations worldwide',
    'Reduces latency by serving from nearby servers',
    'Offloads traffic from origin servers',
    'Perfect for immutable content like pastes',
    'Set appropriate cache TTLs (pastes can cache forever)',
  ],
  diagram: `
┌──────────┐                    ┌──────────┐
│User Tokyo│──▶ CDN Tokyo edge ──│ Paste    │ 50ms
└──────────┘     (cached)        └──────────┘

┌──────────┐                    ┌──────────┐
│User London│─▶ CDN London edge ─│ Paste    │ 40ms
└──────────┘     (cached)        └──────────┘

                    miss? ▼
              ┌─────────────────┐
              │  Origin Server  │ 300ms
              │    (US-East)    │
              └─────────────────┘
`,
  keyConcepts: [
    { title: 'Edge Location', explanation: 'CDN server close to users (100+ globally)', icon: '📍' },
    { title: 'Cache TTL', explanation: 'How long CDN caches content (1 hour to forever)', icon: '⏱️' },
    { title: 'Origin', explanation: 'Your main servers that CDN fetches from on miss', icon: '🏠' },
  ],
  quickCheck: {
    question: 'Why is a CDN perfect for Pastebin?',
    options: [
      'Pastes are large files that need compression',
      'Pastes are immutable and can be cached indefinitely',
      'Pastes need real-time updates',
      'Pastes require server-side processing',
    ],
    correctIndex: 1,
    explanation: 'Pastes are immutable (never change), making them perfect for aggressive CDN caching. Once cached at the edge, they can be served instantly.',
  },
};

const step7: GuidedStep = {
  id: 'pastebin-step-7',
  stepNumber: 7,
  frIndex: 5,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'Global users must have fast access (< 100ms)',
    taskDescription: 'Build full system with CDN for global distribution',
    componentsNeeded: [
      { type: 'client', reason: 'Represents global users', displayName: 'Client' },
      { type: 'cdn', reason: 'Serves pastes from edge locations', displayName: 'CDN' },
      { type: 'load_balancer', reason: 'Distributes origin traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Processes API requests', displayName: 'App Server' },
      { type: 'database', reason: 'Stores pastes persistently', displayName: 'Database' },
      { type: 'cache', reason: 'Caches hot pastes at origin', displayName: 'Cache' },
      { type: 'message_queue', reason: 'Background cleanup', displayName: 'Message Queue' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'CDN', reason: 'Users access via CDN' },
      { from: 'CDN', to: 'Load Balancer', reason: 'CDN fetches from origin on miss' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB forwards to servers' },
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes pastes' },
      { from: 'App Server', to: 'Cache', reason: 'Server caches hot pastes' },
      { from: 'Message Queue', to: 'Database', reason: 'Cleanup jobs' },
    ],
    successCriteria: [
      'Build full architecture with CDN',
      'Client → CDN → Load Balancer → App Server → Database + Cache + Queue',
    ],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'message_queue', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Build the full system with CDN in front for global distribution',
    level2: 'Client → CDN → Load Balancer → App Server, then connect backend components',
    solutionComponents: [{ type: 'client' }, { type: 'cdn' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }, { type: 'message_queue' }],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 8: The Crash - Database Replication
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💥',
  scenario: "3 AM. Your phone is blowing up. The database server crashed!",
  hook: "All your pastes are gone. Millions of links now return 404. Twitter is roasting you. Your boss is calling. This is a nightmare!",
  challenge: "One database server is a single point of failure. We need redundancy - if one goes down, another takes over!",
  illustration: 'server-crash',
};

const step8Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "Your data is now protected!",
  achievement: "Database High Availability configured",
  metrics: [
    { label: 'Availability', before: '99%', after: '99.9%' },
    { label: 'Data Loss Risk', before: 'High', after: 'Near Zero' },
    { label: 'Failover Time', before: 'Hours', after: 'Seconds' },
  ],
  nextTeaser: "Perfect! Now let's optimize costs...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication for High Availability',
  conceptExplanation: `When your database crashes, all your data is gone - unless you have **replicas** (copies).

**Single Leader Replication (Best for Pastebin):**
- One primary handles all writes
- Replicas handle reads only
- Simple, strong consistency for writes
- If master fails, promote a replica

**Why this works for Pastebin:**
- Read-heavy (10:1 ratio)
- Pastes are immutable (no complex writes)
- Can route reads to replicas
- Automatic failover if primary crashes`,
  whyItMatters: 'Without replication, a single disk failure loses all your data. With replication, you can survive server crashes, perform maintenance, and even survive datacenter failures.',
  realWorldExample: {
    company: 'GitHub',
    scenario: 'Storing millions of repositories and gists',
    howTheyDoIt: 'Uses MySQL with multi-region replication. When US-East primary fails, US-West takes over in seconds.',
  },
  famousIncident: {
    title: 'GitLab Database Deletion',
    company: 'GitLab',
    year: '2017',
    whatHappened: 'An engineer accidentally ran rm -rf on the production database directory. They had 5 backup methods - but discovered during recovery that ALL 5 had silently failed. They lost 6 hours of user data.',
    lessonLearned: 'Replication alone isn\'t enough. Test your backups regularly! GitLab now live-streams their backup verification.',
    icon: '💀',
  },
  keyPoints: [
    'Single Leader: Best for Pastebin (simple, strong consistency)',
    'Replicas = copies of your data on different servers',
    'Async replication: faster but may lose recent writes on crash',
    'Sync replication: slower but zero data loss',
    'More replicas = better availability but higher cost',
  ],
  diagram: `
     ┌─────────┐     writes     ┌─────────┐
     │   App   │ ─────────────→ │ Primary │
     │ Server  │                │ (Leader)│
     └────┬────┘                └────┬────┘
          │                          │
          │ reads                    │ replicate
          │                          ▼
          │                    ┌─────────┐
          └──────────────────→ │ Replica │
                               │(Follower)│
                               └─────────┘
`,
  keyConcepts: [
    { title: 'Failover', explanation: 'Automatic switch to replica when primary fails', icon: '🔄' },
    { title: 'Replication Lag', explanation: 'Delay between write to primary and sync to replica', icon: '⏱️' },
    { title: 'Read Replica', explanation: 'Handles read traffic, reduces primary load', icon: '📖' },
  ],
  quickCheck: {
    question: 'For Pastebin, which replication strategy is best?',
    options: [
      'Multi-Leader (for geo-distribution)',
      'Single Leader (simple, consistent writes)',
      'Leaderless (eventual consistency is fine)',
      'No replication (saves money)',
    ],
    correctIndex: 1,
    explanation: 'Single Leader is best for Pastebin: writes are simple (create paste), consistency matters (same ID = same paste), and it\'s easy to operate.',
  },
};

const step8: GuidedStep = {
  id: 'pastebin-step-8',
  stepNumber: 8,
  frIndex: 6,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'System must survive database failures (99.9% availability)',
    taskDescription: 'Build full system and configure database replication',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'cdn', reason: 'Global distribution', displayName: 'CDN' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Processes API requests', displayName: 'App Server' },
      { type: 'database', reason: 'Stores pastes with replication', displayName: 'Database' },
      { type: 'cache', reason: 'Caches hot pastes', displayName: 'Cache' },
      { type: 'message_queue', reason: 'Background cleanup', displayName: 'Message Queue' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'CDN', reason: 'Users access via CDN' },
      { from: 'CDN', to: 'Load Balancer', reason: 'CDN fetches from origin' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB forwards to servers' },
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes pastes' },
      { from: 'App Server', to: 'Cache', reason: 'Server caches hot pastes' },
      { from: 'Message Queue', to: 'Database', reason: 'Cleanup jobs' },
    ],
    successCriteria: [
      'Build full architecture',
      'Click Database → Enable replication with 2+ replicas',
    ],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'message_queue', toType: 'database' },
    ],
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'Build the full system, then configure database replication',
    level2: 'Add all components, connect them, then click Database → Replication with 2+ replicas',
    solutionComponents: [{ type: 'client' }, { type: 'cdn' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }, { type: 'message_queue' }],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 9: Final Exam - Production Validation
// =============================================================================

const step9Story: StoryContent = {
  emoji: '💰',
  scenario: "Final Exam! It's time to prove your system works in production.",
  hook: "Your architecture will be tested against real-world test cases: functional requirements, traffic spikes, database failover, and cost constraints.",
  challenge: "Build a complete system that passes ALL test cases while staying under budget. This is exactly what you'd face in a real interview!",
  illustration: 'final-exam',
};

const step9Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Final Exam - All Test Cases Passed!",
  achievement: "Complete system design validated against production requirements",
  metrics: [
    { label: 'Test Cases Passed', after: 'All ✓' },
    { label: 'Monthly Cost', after: 'Under budget ✓' },
    { label: 'All Requirements', after: 'Met ✓' },
  ],
  nextTeaser: "Congratulations! You've mastered the Pastebin system design. Try 'Solve on Your Own' mode or tackle a new challenge!",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization & Production Readiness',
  conceptExplanation: `**Cloud costs add up fast:**

| Component | Typical Cost |
|-----------|-------------|
| App Server (t3.medium) | ~$30/month |
| PostgreSQL (db.t3.medium) | ~$50/month |
| + Each replica | +$50/month |
| Redis Cache (1GB) | ~$15/month |
| Load Balancer | ~$20/month |
| CDN (1TB transfer) | ~$80/month |
| Message Queue | ~$10/month |

**Cost optimization strategies:**

1. **Right-size instances** - Don't overprovision
2. **Cache aggressively** - Reduces DB queries
3. **CDN offloads origin** - Less server capacity needed
4. **Spot instances** - 70% cheaper for stateless workloads
5. **Monitor and optimize** - Track costs weekly`,
  whyItMatters: 'Meeting requirements at minimum cost is a key engineering skill. Over-provisioning wastes money, under-provisioning causes outages.',
  realWorldExample: {
    company: 'Pastebin',
    scenario: 'Serving millions of pastes daily',
    howTheyDoIt: 'Aggressive caching and CDN usage keeps costs low. Most views never hit origin servers.',
  },
  keyPoints: [
    'Start small, scale up based on actual usage',
    'CDN + Cache dramatically reduces infrastructure needs',
    'Monitor costs and optimize continuously',
    'Test your architecture under realistic load',
  ],
  diagram: `
┌─────────────────────────────────────────────┐
│        PASTEBIN COST BREAKDOWN              │
├─────────────────────────────────────────────┤
│                                             │
│  Component          Count    Cost    Total │
│  ───────────────────────────────────────── │
│  Load Balancer      1        $20     $20   │
│  App Server         3        $30     $90   │
│  Redis Cache        1        $20     $20   │
│  PostgreSQL         1        $60     $60   │
│  + Replicas         2        $60     $120  │
│  CDN (1TB)          1        $80     $80   │
│  Message Queue      1        $10     $10   │
│  ───────────────────────────────────────── │
│  TOTAL                               $400  │
│                                             │
│  ✅ Meets 99.9% availability                │
│  ✅ Handles 2000 RPS                        │
│  ✅ Global < 100ms latency                  │
│                                             │
└─────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'TCO', explanation: 'Total Cost of Ownership - all costs over time', icon: '💵' },
    { title: 'Right-sizing', explanation: 'Match instance size to actual workload', icon: '📏' },
    { title: 'CDN Savings', explanation: 'Offloads 80%+ of traffic from origin', icon: '🌍' },
  ],
  quickCheck: {
    question: 'Which is the BEST way to reduce Pastebin costs?',
    options: [
      'Remove the CDN (saves $80/month)',
      'Use only 1 app server (saves $60/month)',
      'Increase cache hit rate (reduces DB and server load)',
      'Remove database replicas (saves $120/month)',
    ],
    correctIndex: 2,
    explanation: 'Increasing cache hit rate reduces both database queries and origin server load. This lets you use smaller/fewer instances. Removing CDN or replicas would hurt performance and availability.',
  },
};

const step9: GuidedStep = {
  id: 'pastebin-step-9',
  stepNumber: 9,
  frIndex: 7,
  story: step9Story,
  celebration: step9Celebration,
  learnPhase: step9LearnPhase,
  practicePhase: {
    frText: 'Final Exam: Pass all production test cases',
    taskDescription: 'Build a complete system that passes all functional and non-functional requirements',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'cdn', reason: 'Global distribution', displayName: 'CDN' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Right-sized instances', displayName: 'App Server' },
      { type: 'database', reason: 'Optimized capacity with replication', displayName: 'Database' },
      { type: 'cache', reason: 'Right-sized cache for hot pastes', displayName: 'Cache' },
      { type: 'message_queue', reason: 'Background cleanup', displayName: 'Message Queue' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'CDN', reason: 'Users access via CDN' },
      { from: 'CDN', to: 'Load Balancer', reason: 'CDN fetches from origin' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB distributes to servers' },
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes pastes' },
      { from: 'App Server', to: 'Cache', reason: 'Server caches hot pastes' },
      { from: 'Message Queue', to: 'Database', reason: 'Cleanup jobs' },
    ],
    successCriteria: [
      'Pass all functional requirements',
      'Pass all non-functional requirements',
      'Stay under cost budget',
    ],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'message_queue', toType: 'database' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
  },
  hints: {
    level1: 'Build complete system that passes all test cases',
    level2: 'Configure for high availability and throughput: CDN, replication, caching, and proper capacity',
    solutionComponents: [{ type: 'client' }, { type: 'cdn' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }, { type: 'message_queue' }],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const pastebinGuidedTutorial: GuidedTutorial = {
  problemId: 'pastebin-guided',
  problemTitle: 'Build Pastebin - A Code Sharing Platform',

  requirementsPhase: pastebinRequirementsPhase,

  totalSteps: 9,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9],

  finalExamTestCases: [
    {
      name: 'Basic Connectivity',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Users can create pastes and view them.',
      traffic: { type: 'mixed', rps: 10, readRps: 5, writeRps: 5 },
      duration: 10,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'Fast Paste Views',
      type: 'functional',
      requirement: 'FR-2',
      description: 'View pastes within the latency target.',
      traffic: { type: 'read', rps: 300, readRps: 300 },
      duration: 30,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.01 },
    },
    {
      name: 'Syntax Highlighting Support',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Pastes include language metadata for client-side highlighting.',
      traffic: { type: 'mixed', rps: 50, readRps: 40, writeRps: 10 },
      duration: 20,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'Paste Expiration',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Expired pastes are automatically cleaned up.',
      traffic: { type: 'mixed', rps: 30, readRps: 20, writeRps: 10 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-P1: View Latency Budget',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 1,000 view RPS while keeping p99 latency under 200ms.',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 60,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: Viral Traffic Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Absorb a sudden viral spike of 2,000 RPS (mostly reads).',
      traffic: { type: 'mixed', rps: 2000, readRps: 1800, writeRps: 200 },
      duration: 60,
      passCriteria: { maxP99Latency: 300, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-R1: Database Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Primary database fails mid-test. Architecture must maintain availability.',
      traffic: { type: 'mixed', rps: 800, readRps: 700, writeRps: 100 },
      duration: 90,
      failureInjection: { type: 'db_crash', atSecond: 45, recoverySecond: 65 },
      passCriteria: { minAvailability: 0.99, maxDowntime: 10, maxErrorRate: 0.1 },
    },
    {
      name: 'NFR-C1: Cost Guardrail',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Meet the $1,500/month budget target while sustaining production traffic.',
      traffic: { type: 'mixed', rps: 800, readRps: 700, writeRps: 100 },
      duration: 60,
      passCriteria: { maxMonthlyCost: 1500, maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export function getPastebinGuidedTutorial(): GuidedTutorial {
  return pastebinGuidedTutorial;
}

export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = pastebinRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= pastebinRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
