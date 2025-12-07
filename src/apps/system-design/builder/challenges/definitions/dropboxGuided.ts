import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Dropbox Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a file storage and sync platform like Dropbox.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (cache, object storage, queues, cost optimization)
 *
 * Key Concepts:
 * - Chunked file uploads (block-level sync)
 * - Content-addressable storage (deduplication via hashing)
 * - Conflict resolution strategies
 * - Delta sync (only sync changed blocks)
 * - File versioning
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const dropboxRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a file storage and sync platform like Dropbox",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Principal Engineer at CloudStorage Co.',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-upload-download',
      category: 'functional',
      question: "What are the core operations users need to perform with files?",
      answer: "Users want to:\n\n1. **Upload files** - Store files from their device to the cloud\n2. **Download files** - Retrieve files from the cloud to any device\n3. **Sync files** - Keep files automatically in sync across all their devices",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "File sync is the core value prop - users expect seamless synchronization across devices",
    },
    {
      id: 'multi-device',
      category: 'functional',
      question: "How many devices should a user be able to sync files across?",
      answer: "Users should be able to sync files across **unlimited devices** (desktop, mobile, tablet, web). When a file is added or modified on one device, it should automatically appear on all other devices.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Multi-device sync is the killer feature - this is what distinguishes Dropbox from basic file storage",
    },
    {
      id: 'file-sharing',
      category: 'functional',
      question: "Should users be able to share files with others?",
      answer: "Yes! Users should be able to:\n1. **Share individual files** with other users (read-only or edit access)\n2. **Share folders** for collaboration\n3. **Generate shareable links** for anyone to access\n4. **Revoke access** anytime",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Sharing requires a permissions system and tracking who has access to what",
    },
    {
      id: 'file-versioning',
      category: 'functional',
      question: "What happens if a user accidentally deletes or overwrites a file?",
      answer: "We need **version history**! Users should be able to:\n1. View previous versions of a file (at least 30 days)\n2. Restore an old version\n3. See who made changes and when",
      importance: 'important',
      revealsRequirement: 'FR-5',
      learningPoint: "Versioning is critical for data safety and collaboration",
    },
    {
      id: 'file-types',
      category: 'clarification',
      question: "Are there restrictions on file types or sizes?",
      answer: "For the MVP, let's support:\n- **Any file type** (documents, images, videos, etc.)\n- **Max file size: 2GB** per file\n- **Total storage: 100GB** per user (free tier)",
      importance: 'important',
      insight: "File size limits affect chunk size and upload strategies",
    },
    {
      id: 'offline-access',
      category: 'clarification',
      question: "Can users access files when offline?",
      answer: "Yes, users should be able to access files offline. When they come back online, any changes made offline should automatically sync. This is a v2 feature - let's focus on online sync first.",
      importance: 'nice-to-have',
      insight: "Offline sync adds complexity with conflict resolution - good to defer initially",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "100 million registered users, with 10 million daily active users (DAU)",
      importance: 'critical',
      learningPoint: "Massive scale - similar to Dropbox's actual user base",
    },
    {
      id: 'throughput-uploads',
      category: 'throughput',
      question: "How many file uploads/downloads per day?",
      answer: "About 50 million file operations per day (uploads + downloads combined)",
      importance: 'critical',
      calculation: {
        formula: "50M ÷ 86,400 sec = 578 ops/sec",
        result: "~600 ops/sec (1,800 at peak)",
      },
      learningPoint: "File operations are heavy - each can be several MB or GB",
    },
    {
      id: 'throughput-metadata',
      category: 'throughput',
      question: "How many metadata operations (list files, get info)?",
      answer: "About 500 million metadata operations per day (10x more than file ops)",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 reads/sec",
        result: "~6K metadata reads/sec (18K at peak)",
      },
      learningPoint: "Metadata operations vastly outnumber file transfers - need fast metadata access",
    },
    {
      id: 'sync-latency',
      category: 'latency',
      question: "How fast should file sync be?",
      answer: "When a user saves a file, it should:\n- Start uploading **immediately** (< 1 second)\n- Appear on other devices **within 5 seconds** for small files\n- Large files can take longer based on size and bandwidth",
      importance: 'critical',
      learningPoint: "Sync latency expectations are different from request latency",
    },
    {
      id: 'metadata-latency',
      category: 'latency',
      question: "How fast should file listing and metadata queries be?",
      answer: "p99 under 200ms for listing files and fetching metadata. Users expect snappy UI.",
      importance: 'critical',
      learningPoint: "Fast metadata access requires caching",
    },
    {
      id: 'conflict-resolution',
      category: 'burst',
      question: "What happens when the same file is edited on two devices simultaneously?",
      answer: "This is a **conflict**! We need a strategy:\n- **Last-write-wins** for simple cases\n- Create **conflicted copies** for complex cases\n- Notify user to manually merge\n\nThis is one of the hardest problems in distributed file sync!",
      importance: 'critical',
      insight: "Conflict resolution is THE key design challenge for file sync systems",
    },
    {
      id: 'deduplication',
      category: 'payload',
      question: "What if users upload the same file multiple times?",
      answer: "We should **deduplicate** at the storage layer! If multiple users upload the same file, we only store it once. This saves massive amounts of storage.\n\nUse **content-addressable storage** - identify files by their hash (SHA-256).",
      importance: 'important',
      learningPoint: "Deduplication can save 50%+ storage costs at scale",
    },
    {
      id: 'bandwidth-optimization',
      category: 'payload',
      question: "How do we optimize bandwidth for large file uploads?",
      answer: "Use **chunked uploads** and **delta sync**:\n1. Split files into 4MB chunks\n2. Only upload chunks that changed\n3. Resume uploads if interrupted\n\nFor a 1GB file with a small change, you only upload the changed chunks!",
      importance: 'important',
      learningPoint: "Delta sync is critical for bandwidth efficiency and user experience",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-upload-download', 'multi-device', 'conflict-resolution'],
  criticalFRQuestionIds: ['core-upload-download', 'multi-device'],
  criticalScaleQuestionIds: ['throughput-metadata', 'sync-latency', 'conflict-resolution'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can upload files',
      description: 'Store files from any device to the cloud',
      emoji: '⬆️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can download files',
      description: 'Retrieve files from the cloud to any device',
      emoji: '⬇️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Files sync across devices',
      description: 'Changes automatically appear on all user devices',
      emoji: '🔄',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can share files',
      description: 'Share files and folders with permissions',
      emoji: '🤝',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Version history',
      description: 'Access and restore previous file versions',
      emoji: '⏮️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million',
    writesPerDay: '25 million file uploads',
    readsPerDay: '25 million file downloads + 500M metadata reads',
    peakMultiplier: 3,
    readWriteRatio: '1:1 for files, 100:1 for metadata',
    calculatedWriteRPS: { average: 289, peak: 867 },
    calculatedReadRPS: { average: 6076, peak: 18228 },
    maxPayloadSize: '~2GB (max file)',
    storagePerRecord: '~1MB average file',
    storageGrowthPerYear: '~9PB (100M users × 100GB)',
    redirectLatencySLA: 'p99 < 200ms (metadata)',
    createLatencySLA: 'p99 < 5s (sync propagation)',
  },

  architecturalImplications: [
    '✅ Metadata-heavy (100:1) → Caching is CRITICAL for file listings',
    '✅ Large files (up to 2GB) → Need chunked uploads and object storage',
    '✅ Multi-device sync → Need async notifications via message queue',
    '✅ Deduplication → Content-addressable storage (hash-based)',
    '✅ Conflict resolution → Versioning and last-write-wins strategy',
  ],

  outOfScope: [
    'Offline mode and conflict resolution',
    'Real-time collaborative editing',
    'File search and OCR',
    'Multi-region deployment',
    'Desktop client implementation',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can upload, download, and sync files. The complex challenges like chunking, deduplication, and conflict resolution will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📦',
  scenario: "Welcome to CloudStorage Co! You've been hired to build the next Dropbox.",
  hook: "Your first user just installed the app. They're ready to upload their first file!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your file storage service is online!',
  achievement: 'Users can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server is empty... let's write code to handle files!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every cloud application starts with a **Client** connecting to a **Server**.

When a user opens the Dropbox app or website:
1. Their device (phone, laptop) is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back a response

For file operations:
- Upload: Client → POST /api/files → Server
- Download: Client → GET /api/files/{id} → Server
- List files: Client → GET /api/files → Server

This is the foundation of ALL cloud storage systems!`,

  whyItMatters: 'Without this connection, users can\'t interact with your file storage at all.',

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Handling 600M+ users',
    howTheyDoIt: 'Started with a simple Python server in 2008, now uses a complex distributed system across multiple data centers',
  },

  keyPoints: [
    'Client = the user\'s device (desktop app, mobile app, browser)',
    'App Server = your backend that processes file operations',
    'HTTP/HTTPS = the protocol they use to communicate',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device that makes file requests', icon: '📱' },
    { title: 'App Server', explanation: 'Your backend that handles file logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'dropbox-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Dropbox', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles file upload/download/sync', displayName: 'App Server' },
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
// STEP 2: Implement File Operations (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to handle files yet!",
  hook: "A user just tried to upload 'vacation.jpg' but got a 404 error.",
  challenge: "Write the Python code to upload, download, and sync files.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle files!',
  achievement: 'You implemented the core Dropbox functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can upload files', after: '✓' },
    { label: 'Can download files', after: '✓' },
    { label: 'Can sync files', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all files are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: File Operation Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the file data
3. Returns a response

For Dropbox, we need handlers for:
- \`upload_file()\` - Store a file in the cloud
- \`download_file()\` - Retrieve a file from storage
- \`sync_files()\` - Get list of files that changed since last sync
- \`list_files()\` - Get all files for a user

For now, we'll store file metadata in memory (Python dictionaries).
The actual file content will be handled later with object storage.`,

  whyItMatters: 'Without handlers, your server is just a fancy paperweight. This is where file storage happens!',

  famousIncident: {
    title: 'Dropbox Early Outage',
    company: 'Dropbox',
    year: '2008',
    whatHappened: 'In the early days, Dropbox stored files directly on server disk. When a server crashed, users lost access to their files until it was restored. No redundancy!',
    lessonLearned: 'Never store files directly on app servers. Use dedicated storage systems.',
    icon: '💾',
  },

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Handling 289 uploads/second',
    howTheyDoIt: 'Their File Service handles uploads, breaks them into chunks, computes hashes for deduplication, and stores in object storage',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Store file metadata (name, size, owner) separately from content',
    'Use in-memory storage for now - database comes in Step 3',
    'Handle edge cases (duplicate names, invalid files, etc.)',
  ],

  quickCheck: {
    question: 'Why do we separate file metadata from file content?',
    options: [
      'It\'s faster',
      'Metadata is small and queried often; content is large and accessed less',
      'It\'s easier to code',
      'Databases can\'t store files',
    ],
    correctIndex: 1,
    explanation: 'Metadata (name, size, modified date) is accessed frequently for file listings. Content is only accessed on download. Different access patterns need different storage.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'Metadata', explanation: 'Info about files (name, size, date)', icon: '📋' },
    { title: 'File Content', explanation: 'The actual file data (bytes)', icon: '📄' },
  ],
};

const step2: GuidedStep = {
  id: 'dropbox-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Upload files, FR-2: Download files, FR-3: Sync files',
    taskDescription: 'Configure APIs and implement Python handlers for file operations',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/files (upload), GET /api/files/{id} (download), GET /api/sync APIs',
      'Open the Python tab',
      'Implement upload_file(), download_file(), and sync_files() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for upload_file, download_file, and sync_files',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/files', 'GET /api/files/{id}', 'GET /api/sync'] } },
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
  hook: "When it came back online, ALL the file metadata was GONE! Users see an empty folder.",
  challenge: "Add a database to store file metadata, user info, and sharing permissions.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your file metadata is safe forever!',
  achievement: 'Data now persists across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But listing files is getting slow as metadata grows...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Database for File Metadata',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Metadata survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For Dropbox, we need tables for:
- \`users\` - User accounts
- \`files\` - File metadata (name, size, path, hash, version)
- \`sharing_permissions\` - Who can access which files
- \`versions\` - File version history

IMPORTANT: We store file METADATA in the database, not the actual file content.
File content goes in object storage (Step 6).`,

  whyItMatters: 'Imagine losing all your file listings because of a server restart. Users would see empty folders!',

  famousIncident: {
    title: 'Code Spaces Shutdown',
    company: 'Code Spaces',
    year: '2014',
    whatHappened: 'A hacker gained access and deleted all their databases and backups. The company lost all customer data and shut down permanently.',
    lessonLearned: 'Database backups and security are critical. One database failure can kill a company.',
    icon: '☠️',
  },

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Storing metadata for billions of files',
    howTheyDoIt: 'Uses MySQL for metadata storage, sharded by user_id for horizontal scaling. Metadata is replicated 3x for durability.',
  },

  keyPoints: [
    'Database stores file METADATA, not content',
    'Use SQL (PostgreSQL/MySQL) for structured data',
    'Tables: users, files, sharing_permissions, versions',
    'Connect App Server to Database for read/write operations',
  ],

  quickCheck: {
    question: 'Why don\'t we store actual file content in the database?',
    options: [
      'Databases are too expensive',
      'Databases are optimized for small structured data, not large blobs',
      'It\'s against the law',
      'Files would be too slow to access',
    ],
    correctIndex: 1,
    explanation: 'Databases excel at structured queries on small data (metadata). For large binary data (files), use object storage like S3.',
  },

  keyConcepts: [
    { title: 'Metadata', explanation: 'Info about files stored in database', icon: '📋' },
    { title: 'Content', explanation: 'Actual file bytes stored in object storage', icon: '📄' },
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
  ],
};

const step3: GuidedStep = {
  id: 'dropbox-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent metadata storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store file metadata, users, permissions, versions', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for File Metadata
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 1 million users with 100 million files, and file listings take 3+ seconds!",
  hook: "Users are complaining: 'Why is Dropbox so slow?' Every file list hits the database.",
  challenge: "Add a cache to make file metadata queries lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'File listings load 30x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'File list latency', before: '3000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "But what about handling more traffic?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Speed Up Metadata Queries',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

Instead of:
\`\`\`
Request → Database (slow, 100ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1ms) → Database (only if cache miss)
\`\`\`

For Dropbox, we cache:
- User's file list (most common query)
- File metadata (size, modified date, etc.)
- Folder structures
- Sharing permissions

When a file is uploaded or modified, we invalidate the cache.`,

  whyItMatters: 'At 18K metadata reads/sec peak, hitting the database for every request would melt it. Caching is essential.',

  famousIncident: {
    title: 'GitHub Downtime',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'A network partition caused their MySQL replicas to fall out of sync. When they tried to fix it, the cache stampede (all cache invalidations at once) overwhelmed the database.',
    lessonLearned: 'Cache invalidation is one of the hardest problems in computer science. Plan carefully.',
    icon: '💔',
  },

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Serving 500M metadata requests per day',
    howTheyDoIt: 'Uses Redis clusters to cache file listings and metadata. Cache hit rate > 95%. Most metadata queries never touch the database.',
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
    'Cache file listings, metadata, permissions',
    'Invalidate cache when files are uploaded/modified/deleted',
    'Set TTL (Time To Live) to prevent stale data',
  ],

  quickCheck: {
    question: 'When should you invalidate the cache?',
    options: [
      'Never - let TTL handle it',
      'When a file is uploaded, modified, or deleted',
      'Every hour',
      'Only when the cache is full',
    ],
    correctIndex: 1,
    explanation: 'Invalidate cache when data changes to ensure users see fresh data. TTL is a backup, not primary strategy.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'Invalidation', explanation: 'Remove stale data when changes happen', icon: '🗑️' },
  ],
};

const step4: GuidedStep = {
  id: 'dropbox-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Files sync across devices (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache file metadata for fast queries', displayName: 'Redis Cache' },
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
  hook: "A viral TikTok mentioned your service. Traffic spiked 10x. One server can't handle it all.",
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
  nextTeaser: "But we're still storing files on the server disk...",
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
- Sticky sessions: Same user → same server (important for file uploads!)`,

  whyItMatters: 'At peak, Dropbox handles 18K metadata requests/second + 1,800 file operations/second. No single server can handle that.',

  famousIncident: {
    title: 'Dropbox Outage 2014',
    company: 'Dropbox',
    year: '2014',
    whatHappened: 'A bug in their load balancer configuration caused all traffic to route to a single server cluster. It crashed under load, taking down the entire service for 2 hours.',
    lessonLearned: 'Load balancer configuration is critical. Test failover scenarios regularly.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Handling 20K+ requests/second at peak',
    howTheyDoIt: 'Uses multiple layers of load balancers (DNS, L4, L7) to distribute traffic across data centers and servers',
  },

  keyPoints: [
    'Load balancer distributes requests across servers',
    'Enables horizontal scaling (add more servers)',
    'Eliminates single point of failure',
    'Use sticky sessions for file uploads (multi-part)',
  ],

  quickCheck: {
    question: 'Why do we need sticky sessions for file uploads?',
    options: [
      'To make it faster',
      'Multi-part uploads need to go to the same server',
      'It\'s cheaper',
      'It\'s more secure',
    ],
    correctIndex: 1,
    explanation: 'When uploading a large file in chunks, all chunks need to go to the same server (until we add object storage in Step 6).',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Sticky Sessions', explanation: 'Route same user to same server', icon: '📌' },
  ],
};

const step5: GuidedStep = {
  id: 'dropbox-step-5',
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
// STEP 6: Add Object Storage (S3) - CRITICAL FOR FILE STORAGE
// =============================================================================

const step6Story: StoryContent = {
  emoji: '💾',
  scenario: "You're storing files directly on server disk. Disaster strikes!",
  hook: "A server crashed and ALL FILES stored on it are GONE. Users lost their vacation photos forever.",
  challenge: "Move file storage to dedicated object storage (S3) for durability and scalability.",
  illustration: 'data-loss',
};

const step6Celebration: CelebrationContent = {
  emoji: '☁️',
  message: 'Files are now safely stored in the cloud!',
  achievement: 'Object storage provides durability and unlimited scale',
  metrics: [
    { label: 'File durability', before: '0%', after: '99.999999999%' },
    { label: 'Storage capacity', before: 'Limited', after: 'Unlimited' },
    { label: 'File redundancy', after: '11 nines' },
  ],
  nextTeaser: "But how do we notify other devices when a file changes?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage: The Right Tool for File Storage',
  conceptExplanation: `**Never store files on app server disks!** App servers are ephemeral - they can restart, crash, or be replaced.

**Object Storage (S3)** is designed for files:
- **Durability**: 99.999999999% (11 nines) - your files will never be lost
- **Scalability**: Store unlimited files, from bytes to petabytes
- **Cost-effective**: $0.023 per GB/month vs server disk costs
- **Global**: Replicated across multiple data centers automatically

Architecture:
1. Client uploads file → App Server
2. App Server stores file → S3 with unique key (hash)
3. App Server stores metadata → Database (S3 key, size, etc.)
4. Client downloads → App Server fetches from S3 → Client

For Dropbox:
- Use **content-addressable storage** (hash as key)
- Enables **deduplication** - same file stored once
- Supports **chunked uploads** for large files`,

  whyItMatters: 'Object storage is the foundation of all cloud storage services. Without it, you cannot scale.',

  famousIncident: {
    title: 'Dropbox Saves $75 Million',
    company: 'Dropbox',
    year: '2016-2017',
    whatHappened: 'Dropbox moved from storing files on AWS S3 to their own custom infrastructure called "Magic Pocket". Over 2 years, they migrated 600PB of data and saved $75M.',
    lessonLearned: 'At massive scale, build your own. But start with S3 to prove product-market fit.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Storing 600+ petabytes of files',
    howTheyDoIt: 'Built custom object storage "Magic Pocket" with content-addressable storage, chunking, and deduplication. Saves 50%+ on storage costs.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Database │
└────────┘     └─────────────┘     │(metadata)│
                     │              └──────────┘
                     │
                     ▼
              ┌─────────────┐
              │  S3 / Object│
              │   Storage   │
              │  (content)  │
              └─────────────┘
`,

  keyPoints: [
    'NEVER store files on app server disk',
    'Object storage (S3) provides 11 nines durability',
    'Store metadata in database, content in S3',
    'Use content-addressable storage (hash as key) for deduplication',
    'Support chunked uploads for large files',
  ],

  quickCheck: {
    question: 'What is content-addressable storage?',
    options: [
      'Storing files by their name',
      'Storing files by their hash (SHA-256)',
      'Storing files by upload date',
      'Storing files by user ID',
    ],
    correctIndex: 1,
    explanation: 'Content-addressable storage uses the file\'s hash as the key. Same content = same hash = automatic deduplication!',
  },

  keyConcepts: [
    { title: 'Object Storage', explanation: 'S3-like storage for files', icon: '🪣' },
    { title: 'Content-Addressable', explanation: 'Use hash as storage key', icon: '🔑' },
    { title: 'Deduplication', explanation: 'Store identical files only once', icon: '♻️' },
  ],
};

const step6: GuidedStep = {
  id: 'dropbox-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-1, FR-2: Upload and download files safely',
    taskDescription: 'Add Object Storage (S3) for file content',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store actual file content with 11-nines durability', displayName: 'S3 / Object Storage' },
    ],
    successCriteria: [
      'Object Storage component added',
      'App Server connected to Object Storage',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Drag an Object Storage (S3) component onto the canvas',
    level2: 'Connect App Server to Object Storage. This is where actual file content lives.',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 7: Add Message Queue for Sync Notifications
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔔',
  scenario: "A user uploads a file on their laptop. Their phone should see it instantly!",
  hook: "But how does the phone know to refresh? It keeps polling every second, wasting bandwidth.",
  challenge: "Add a message queue to send async notifications when files change.",
  illustration: 'sync-notification',
};

const step7Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'File sync is now real-time!',
  achievement: 'Async notifications keep devices in sync instantly',
  metrics: [
    { label: 'Sync latency', before: '30s (polling)', after: '<5s (push)' },
    { label: 'Bandwidth waste', before: '90%', after: '0%' },
  ],
  nextTeaser: "But we're spending too much on infrastructure...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Real-Time Sync Notifications',
  conceptExplanation: `How do we notify all of a user's devices when a file changes?

**Bad approach: Polling**
- Each device asks server every second: "Any updates?"
- 10M active users × 3 devices × 1 req/sec = 30M requests/sec (!!)
- 99.9% of requests return "no updates" - massive waste

**Good approach: Message Queue + Push Notifications**
1. User uploads file on Device A → App Server
2. App Server publishes message to queue: "user123: file updated"
3. All user's devices subscribe to their queue
4. Devices receive push notification instantly
5. Devices pull the updated file list

Benefits:
- **Real-time**: Sub-second notification delivery
- **Efficient**: No constant polling
- **Scalable**: Queue handles millions of messages/sec

For Dropbox, use:
- Kafka/RabbitMQ for message queue
- WebSockets or Push Notifications for client delivery`,

  whyItMatters: 'Without async notifications, you either waste bandwidth (polling) or have slow sync (rare polls).',

  famousIncident: {
    title: 'Dropbox LAN Sync Discovery',
    company: 'Dropbox',
    year: '2010',
    whatHappened: 'Dropbox discovered users on the same network were wasting bandwidth syncing through the cloud. They added LAN sync - devices on same network sync directly via UDP broadcasting.',
    lessonLearned: 'Optimize for real usage patterns. Not all sync needs to go through the cloud.',
    icon: '📡',
  },

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Syncing files across 10M+ active users',
    howTheyDoIt: 'Uses long-polling and Notifications Service. When a file changes, all user devices get notified within seconds via persistent connections.',
  },

  diagram: `
Device A uploads file
      │
      ▼
┌─────────────┐     ┌─────────────────────────────────────┐
│ App Server  │────▶│          Message Queue              │
│             │     │  [user123: file_updated, ...]       │
└─────────────┘     └──────────────┬──────────────────────┘
                                   │
                                   │ Push notifications
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
        ┌──────────┐         ┌──────────┐        ┌──────────┐
        │Device B  │         │Device C  │        │Device D  │
        │(mobile)  │         │(tablet)  │        │ (web)    │
        └──────────┘         └──────────┘        └──────────┘
`,

  keyPoints: [
    'Message queue enables async communication',
    'Publish file change events when uploads/deletes happen',
    'Devices subscribe to their user\'s notifications',
    'Push notifications replace wasteful polling',
    'Sync latency drops from 30s to <5s',
  ],

  quickCheck: {
    question: 'Why is a message queue better than polling for sync?',
    options: [
      'It\'s cheaper',
      'Devices get notified immediately instead of checking every second',
      'It\'s easier to implement',
      'It uses less storage',
    ],
    correctIndex: 1,
    explanation: 'Message queue enables push notifications. Devices learn about changes immediately instead of wasting requests asking "any updates?"',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for async notifications', icon: '📬' },
    { title: 'Pub/Sub', explanation: 'Publish events, subscribers receive them', icon: '📡' },
    { title: 'Push vs Poll', explanation: 'Server pushes updates vs client asking', icon: '🔔' },
  ],
};

const step7: GuidedStep = {
  id: 'dropbox-step-7',
  stepNumber: 7,
  frIndex: 2,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-3: Files sync across devices (now real-time)',
    taskDescription: 'Add a Message Queue for async sync notifications',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Send real-time notifications when files change', displayName: 'Kafka / RabbitMQ' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'object_storage', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables real-time sync notifications.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Cost Optimization (Deduplication + Tiered Storage)
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Your monthly cloud bill is $2.5 million.",
  hook: "The CFO says: 'We're storing the same files hundreds of times! Optimize or we shut down.'",
  challenge: "Implement deduplication and tiered storage to cut costs by 60%.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Dropbox!',
  achievement: 'A scalable, cost-effective file storage and sync platform',
  metrics: [
    { label: 'Monthly cost', before: '$2.5M', after: '$1M (60% reduction)' },
    { label: 'Storage saved via deduplication', after: '50%' },
    { label: 'Sync latency', after: '<5s' },
    { label: 'File durability', after: '99.999999999%' },
  ],
  nextTeaser: "You've mastered Dropbox system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Deduplication and Tiered Storage',
  conceptExplanation: `System design isn't just about performance - it's about **cost efficiency**.

**Problem**: You're storing the same file hundreds of times!
- User A uploads "company_logo.png" (1MB)
- User B uploads the same logo (1MB)
- User C uploads it again (1MB)
- Without deduplication: 3MB stored
- With deduplication: 1MB stored, 3 pointers to it

**Solution 1: Deduplication (Content-Addressable Storage)**
1. When user uploads file, compute SHA-256 hash
2. Check if hash already exists in S3
3. If yes: just add metadata pointer (no upload!)
4. If no: upload file with hash as key
5. Result: 50%+ storage savings

**Solution 2: Tiered Storage**
- **Hot tier** (expensive, fast): Files accessed in last 30 days
- **Cool tier** (cheaper, slower): Files accessed 30-90 days ago
- **Cold tier** (cheapest, slowest): Files not accessed in 90+ days
- Automatically move files between tiers based on access patterns

**Solution 3: Compression**
- Compress files before storing in S3
- 30-50% size reduction for text files
- Transparent to users`,

  whyItMatters: 'At Dropbox scale (600PB), every 1% efficiency improvement saves millions of dollars per year.',

  famousIncident: {
    title: 'The $1.2M Database Query',
    company: 'Anonymous Startup',
    year: '2019',
    whatHappened: 'A startup forgot to add pagination to a file listing query. A user with 10M files triggered a query that loaded all files into memory. AWS bill: $1.2M for that month.',
    lessonLearned: 'Optimize from day 1. Small inefficiencies become expensive at scale.',
    icon: '💀',
  },

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Storing 600PB efficiently',
    howTheyDoIt: 'Uses aggressive deduplication (saves 50%+), chunking (4MB blocks), compression, and tiered storage. Saved $75M by moving off AWS.',
  },

  keyPoints: [
    'Deduplication: Use content hash (SHA-256) as storage key',
    'Same file uploaded by 100 users = stored once',
    'Tiered storage: Hot/Cool/Cold based on access patterns',
    'Compression: 30-50% size reduction',
    'Chunking: 4MB blocks enable delta sync and dedup at block level',
  ],

  quickCheck: {
    question: 'How does content-addressable storage enable deduplication?',
    options: [
      'It compresses files',
      'Files with same content have same hash, so only stored once',
      'It deletes old files',
      'It uses AI to find duplicates',
    ],
    correctIndex: 1,
    explanation: 'Content hash (SHA-256) is deterministic. Same file = same hash. If hash exists, no need to store again!',
  },

  keyConcepts: [
    { title: 'Deduplication', explanation: 'Store identical files only once', icon: '♻️' },
    { title: 'Content Hash', explanation: 'SHA-256 uniquely identifies file content', icon: '🔑' },
    { title: 'Tiered Storage', explanation: 'Hot/Cool/Cold based on access frequency', icon: '📊' },
  ],
};

const step8: GuidedStep = {
  id: 'dropbox-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered cost-effectively',
    taskDescription: 'Review your architecture for cost optimization opportunities',
    successCriteria: [
      'Verify Object Storage uses content-addressable keys (hashing)',
      'Configure tiered storage (hot/cool/cold)',
      'Enable compression for file storage',
      'Review cache TTL and database replication settings',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'object_storage', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Review each component for cost optimization: deduplication, tiered storage, compression',
    level2: 'Key optimizations: Object Storage with content-addressable keys, tiered storage (hot/cool/cold), cache TTL, compression',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const dropboxGuidedTutorial: GuidedTutorial = {
  problemId: 'dropbox',
  title: 'Design Dropbox',
  description: 'Build a file storage and sync platform with deduplication and real-time sync',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '📦',
    hook: "You've been hired as Lead Engineer at CloudStorage Co!",
    scenario: "Your mission: Build a Dropbox-like platform that can sync files across millions of devices in real-time.",
    challenge: "Can you design a system that handles file deduplication, chunking, and conflict resolution?",
  },

  requirementsPhase: dropboxRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'File Metadata vs Content',
    'Database for Metadata',
    'Caching',
    'Load Balancing',
    'Object Storage (S3)',
    'Content-Addressable Storage',
    'Deduplication',
    'Message Queues',
    'Real-Time Sync',
    'Chunked Uploads',
    'Tiered Storage',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval',
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 11: Stream Processing',
  ],
};

export default dropboxGuidedTutorial;
