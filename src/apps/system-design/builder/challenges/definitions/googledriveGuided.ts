import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Google Drive Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 9-step tutorial that teaches system design concepts
 * while building a cloud storage platform like Google Drive.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-4: Build basic working system (FR satisfaction)
 * Steps 5-9: Scale with NFRs (cache, object storage, queues, real-time collaboration)
 *
 * Key Concepts:
 * - File upload/download and folder organization
 * - Real-time collaboration (operational transforms)
 * - File sharing with granular permissions
 * - Version history and rollback
 * - Search and full-text indexing
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const googledriveRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a cloud storage platform like Google Drive",

  interviewer: {
    name: 'David Park',
    role: 'Staff Engineer at Google Cloud',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-operations',
      category: 'functional',
      question: "What are the core file operations users need?",
      answer: "Users want to:\n\n1. **Upload files** - Store any file type to the cloud\n2. **Download files** - Access files from any device\n3. **Create folders** - Organize files in hierarchical structure\n4. **Search files** - Find files by name, content, or metadata",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2',
      learningPoint: "File storage and organization are the foundation - users need a familiar folder structure",
    },
    {
      id: 'file-sharing',
      category: 'functional',
      question: "How should file sharing work?",
      answer: "Users should be able to:\n1. **Share with specific users** - by email with read/write/comment permissions\n2. **Share via link** - anyone with link can access\n3. **Set expiration dates** - links expire after certain time\n4. **Revoke access** - remove permissions anytime\n5. **See who has access** - audit sharing permissions",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Granular permissions are critical - Google Drive has viewer/commenter/editor roles",
    },
    {
      id: 'real-time-collaboration',
      category: 'functional',
      question: "Should multiple users be able to edit the same document simultaneously?",
      answer: "Yes! This is Google Drive's killer feature:\n1. **Real-time collaboration** on Google Docs/Sheets/Slides\n2. **See others' cursors** and edits in real-time\n3. **Conflict-free editing** - operational transforms handle concurrent edits\n4. **Comment and suggest** - non-editing collaboration",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Real-time collaboration requires operational transforms (OT) or CRDTs - this is the hardest feature",
    },
    {
      id: 'version-history',
      category: 'functional',
      question: "What if a user wants to see previous versions of a file?",
      answer: "We need comprehensive **version history**:\n1. View all versions with timestamps and who made changes\n2. Restore any previous version\n3. **Keep versions for 30 days** (100 versions max per file)\n4. Name versions for important milestones",
      importance: 'important',
      revealsRequirement: 'FR-5',
      learningPoint: "Version history is essential for collaboration and recovering from mistakes",
    },
    {
      id: 'offline-access',
      category: 'clarification',
      question: "Can users access files when offline?",
      answer: "For Google Docs/Sheets/Slides, yes! Users can:\n1. Mark files for offline access\n2. Edit offline (changes queue up)\n3. Auto-sync when back online\n\nFor MVP, let's focus on online collaboration first.",
      importance: 'nice-to-have',
      insight: "Offline editing adds significant complexity - defer to v2",
    },
    {
      id: 'storage-limits',
      category: 'clarification',
      question: "Are there file size or storage limits?",
      answer: "For the MVP:\n- **Max file size: 5TB** per file (Google's actual limit)\n- **Total storage: 15GB** free tier (shared across Drive, Gmail, Photos)\n- **File types: Any** (but native collaboration only for Docs/Sheets/Slides)",
      importance: 'important',
      insight: "Massive file sizes (5TB) require chunked uploads and resumable transfers",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "1 billion registered users globally, with 100 million daily active users (DAU)",
      importance: 'critical',
      learningPoint: "Google Drive scale - one of the largest file storage platforms in the world",
    },
    {
      id: 'throughput-uploads',
      category: 'throughput',
      question: "How many file operations per day?",
      answer: "About 500 million file operations per day (uploads + downloads + edits)",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 ops/sec",
        result: "~6K ops/sec (18K at peak)",
      },
      learningPoint: "File operations are diverse - small docs to massive video files",
    },
    {
      id: 'throughput-metadata',
      category: 'throughput',
      question: "How many metadata/search operations?",
      answer: "About 5 billion metadata operations per day (list files, search, get info)",
      importance: 'critical',
      calculation: {
        formula: "5B ÷ 86,400 sec = 57,870 reads/sec",
        result: "~58K metadata reads/sec (174K at peak)",
      },
      learningPoint: "Metadata operations vastly outnumber file transfers - caching is essential",
    },
    {
      id: 'collaboration-latency',
      category: 'latency',
      question: "How fast should real-time collaboration updates be?",
      answer: "When one user types in a Google Doc:\n- Other users should see the change **within 100-200ms**\n- Cursor positions update **within 50ms**\n- This requires WebSockets and operational transforms",
      importance: 'critical',
      learningPoint: "Real-time collaboration has strict latency requirements - feels instant to users",
    },
    {
      id: 'search-latency',
      category: 'latency',
      question: "How fast should file search be?",
      answer: "p99 under 300ms for search results. Users expect instant results as they type.",
      importance: 'critical',
      learningPoint: "Fast search requires full-text indexing with Elasticsearch or similar",
    },
    {
      id: 'concurrent-editors',
      category: 'burst',
      question: "How many users can edit a document simultaneously?",
      answer: "Support **up to 100 concurrent editors** on a single document (Google's actual limit). Most docs have 2-5 concurrent editors, but viral docs can spike to 100+.",
      importance: 'critical',
      insight: "Concurrent editing requires sophisticated conflict resolution via operational transforms",
    },
    {
      id: 'file-organization',
      category: 'payload',
      question: "How should folder organization work?",
      answer: "Use a **hierarchical folder structure**:\n1. Files can be in multiple folders (shortcuts/links)\n2. Folders can be nested up to 100 levels deep\n3. A file can be in 'My Drive' and multiple 'Shared with me' folders\n4. Deleted items go to Trash (recoverable for 30 days)",
      importance: 'important',
      learningPoint: "Folder organization is complex - files can have multiple parents",
    },
    {
      id: 'bandwidth-optimization',
      category: 'payload',
      question: "How do we handle large file uploads efficiently?",
      answer: "Use **resumable uploads**:\n1. Split files into chunks (256KB each)\n2. Upload chunks in parallel\n3. Resume from last successful chunk if interrupted\n4. Compute checksums to verify integrity\n\nFor a 1GB file, interruption at 90% means resume from 900MB, not restart!",
      importance: 'important',
      learningPoint: "Resumable uploads are critical for large files and poor network conditions",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-operations', 'file-sharing', 'real-time-collaboration'],
  criticalFRQuestionIds: ['core-operations', 'file-sharing'],
  criticalScaleQuestionIds: ['throughput-metadata', 'collaboration-latency', 'concurrent-editors'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can upload/download files',
      description: 'Store and retrieve any file type from the cloud',
      emoji: '📁',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Organize files in folders',
      description: 'Hierarchical folder structure with search',
      emoji: '📂',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Share files with permissions',
      description: 'Share with granular permissions (view/comment/edit)',
      emoji: '🤝',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Real-time collaboration',
      description: 'Multiple users edit simultaneously',
      emoji: '✍️',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Version history',
      description: 'Access and restore previous versions',
      emoji: '⏮️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million',
    writesPerDay: '250 million file uploads/edits',
    readsPerDay: '250 million file downloads + 5B metadata reads',
    peakMultiplier: 3,
    readWriteRatio: '1:1 for files, 100:1 for metadata',
    calculatedWriteRPS: { average: 2893, peak: 8679 },
    calculatedReadRPS: { average: 60763, peak: 182289 },
    maxPayloadSize: '~5TB (max file)',
    storagePerRecord: '~500KB average file',
    storageGrowthPerYear: '~75PB (1B users × 15GB avg × 0.5 utilization)',
    redirectLatencySLA: 'p99 < 300ms (search)',
    createLatencySLA: 'p99 < 200ms (collaboration updates)',
  },

  architecturalImplications: [
    '✅ Metadata-heavy (100:1) → Redis caching + Elasticsearch for search',
    '✅ Large files (up to 5TB) → Chunked, resumable uploads to object storage',
    '✅ Real-time collaboration → WebSockets + operational transforms',
    '✅ Granular permissions → Complex ACL (Access Control List) system',
    '✅ Version history → Snapshot storage for every file version',
  ],

  outOfScope: [
    'Offline editing and sync',
    'Google Docs/Sheets/Slides rendering engine',
    'OCR for images and PDFs',
    'Multi-region geo-replication',
    'Mobile app specifics',
  ],

  keyInsight: "Google Drive is Dropbox + real-time collaboration + powerful search. First, we'll build the file storage foundation (like Dropbox). Then we'll add the collaboration magic that makes Google Docs special!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '☁️',
  scenario: "Welcome to CloudDocs Inc! You're building the next Google Drive.",
  hook: "Your first user just opened the app. They're ready to upload their first document!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your cloud storage service is online!',
  achievement: 'Users can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle files yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every cloud application starts with a **Client** connecting to a **Server**.

When a user opens Google Drive:
1. Their device (phone, laptop, browser) is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back a response

For Google Drive operations:
- Upload: Client → POST /api/files → Server
- Download: Client → GET /api/files/{id} → Server
- List files: Client → GET /api/files → Server
- Search: Client → GET /api/search?q={query} → Server

This is the foundation of ALL cloud storage systems!`,

  whyItMatters: 'Without this connection, users can\'t interact with your cloud storage at all.',

  realWorldExample: {
    company: 'Google Drive',
    scenario: 'Handling 1B+ users',
    howTheyDoIt: 'Uses a global distributed system with servers in data centers worldwide, load-balanced across thousands of servers',
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
  id: 'googledrive-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Google Drive', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles file operations and collaboration', displayName: 'App Server' },
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
  hook: "A user just tried to upload 'presentation.pdf' but got a 404 error.",
  challenge: "Write the Python code to upload, download, organize, and search files.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle files!',
  achievement: 'You implemented the core Google Drive functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can upload files', after: '✓' },
    { label: 'Can download files', after: '✓' },
    { label: 'Can organize in folders', after: '✓' },
    { label: 'Can search files', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all file metadata is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: File Operation Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the file data
3. Returns a response

For Google Drive, we need handlers for:
- \`upload_file()\` - Store a file in the cloud
- \`download_file()\` - Retrieve a file from storage
- \`create_folder()\` - Create folder in hierarchy
- \`search_files()\` - Search by name or content
- \`share_file()\` - Grant permissions to other users

For now, we'll store file metadata in memory (Python dictionaries).
The actual file content will be handled later with object storage.`,

  whyItMatters: 'Without handlers, your server is just an empty shell. This is where file storage happens!',

  famousIncident: {
    title: 'Gmail Outage 2011',
    company: 'Google',
    year: '2011',
    whatHappened: 'A bug in Gmail storage caused 150,000 users to lose access to all their emails. Google had to restore from tape backups, taking 2 days. Users panicked.',
    lessonLearned: 'Always have multiple layers of backups and redundancy. Even Google makes mistakes.',
    icon: '📧',
  },

  realWorldExample: {
    company: 'Google Drive',
    scenario: 'Handling 6K file operations/second',
    howTheyDoIt: 'Their File Service handles uploads, breaks them into chunks, stores in Google\'s distributed file system (Colossus), and indexes metadata',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Store file metadata (name, size, owner, parent folder) separately from content',
    'Use in-memory storage for now - database comes in Step 3',
    'Handle folder hierarchy and search',
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
    explanation: 'Metadata (name, size, folder) is accessed frequently for file listings and search. Content is only accessed on download. Different access patterns need different storage.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'Metadata', explanation: 'Info about files (name, size, folder, permissions)', icon: '📋' },
    { title: 'File Content', explanation: 'The actual file data (bytes)', icon: '📄' },
  ],
};

const step2: GuidedStep = {
  id: 'googledrive-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Upload/download files, FR-2: Organize in folders',
    taskDescription: 'Configure APIs and implement Python handlers for file operations',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/files (upload), GET /api/files/{id} (download), POST /api/folders, GET /api/search APIs',
      'Open the Python tab',
      'Implement upload_file(), download_file(), create_folder(), and search_files() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for upload_file, download_file, create_folder, and search_files',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/files', 'GET /api/files/{id}', 'POST /api/folders', 'GET /api/search'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Metadata
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 3 AM. Your server crashed and restarted...",
  hook: "When it came back online, ALL file metadata was GONE! Users see an empty Drive.",
  challenge: "Add a database to store file metadata, folder hierarchy, and sharing permissions.",
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
  nextTeaser: "But search is getting slow as metadata grows...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Database for File Metadata',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Metadata survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For Google Drive, we need tables for:
- \`users\` - User accounts
- \`files\` - File metadata (name, size, parent_folder_id, owner_id)
- \`folders\` - Folder hierarchy (name, parent_folder_id)
- \`permissions\` - Sharing permissions (file_id, user_id, role)
- \`versions\` - File version history

IMPORTANT: We store file METADATA in the database, not the actual file content.
File content goes in object storage (Step 6).`,

  whyItMatters: 'Imagine losing all your folder structures and sharing permissions because of a server restart!',

  famousIncident: {
    title: 'Google Drive Permissions Bug',
    company: 'Google',
    year: '2017',
    whatHappened: 'A bug caused Google Drive to randomly unshare files that were shared with specific people. Thousands of users lost access to critical documents overnight.',
    lessonLearned: 'Permission systems are complex and critical. Test thoroughly and monitor for anomalies.',
    icon: '🔒',
  },

  realWorldExample: {
    company: 'Google Drive',
    scenario: 'Storing metadata for trillions of files',
    howTheyDoIt: 'Uses Spanner (globally distributed SQL database) for metadata storage with strong consistency and multi-region replication',
  },

  keyPoints: [
    'Database stores file METADATA, not content',
    'Use SQL (PostgreSQL/MySQL) for structured data',
    'Tables: users, files, folders, permissions, versions',
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
  id: 'googledrive-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent metadata storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store file metadata, folders, permissions, versions', displayName: 'PostgreSQL' },
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
// STEP 4: Add Search Index (Elasticsearch)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🔍',
  scenario: "Users are frustrated! Searching for files takes 10+ seconds and often fails.",
  hook: "A user types 'Q4 presentation' and waits... and waits... The database can't handle full-text search efficiently.",
  challenge: "Add a search index to make file search lightning fast.",
  illustration: 'slow-search',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'File search is now instant!',
  achievement: 'Full-text search powered by Elasticsearch',
  metrics: [
    { label: 'Search latency', before: '10000ms', after: '150ms' },
    { label: 'Search accuracy', after: '95%+' },
  ],
  nextTeaser: "But metadata queries are still hitting the database...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Search Indexing: Fast Full-Text Search',
  conceptExplanation: `SQL databases are great for exact matches but terrible at full-text search.

For example:
- "Find file named 'presentation.pdf'" → Fast (indexed lookup)
- "Find all files containing 'quarterly report'" → Slow (full table scan)

**Search Index (Elasticsearch)** provides:
- **Full-text search** - search within file names and content
- **Fuzzy matching** - handle typos ("prezentation" → "presentation")
- **Ranking** - most relevant results first
- **Fast** - sub-second search on millions of files

When a file is uploaded:
1. Store metadata in Database
2. Index file metadata in Elasticsearch
3. Search queries go to Elasticsearch, not Database

For Google Drive, we index:
- File names
- Folder paths
- File content (for supported types)
- Owner and collaborators`,

  whyItMatters: 'At 174K metadata reads/sec peak, many are searches. Without a search index, users would wait forever.',

  famousIncident: {
    title: 'Google Desktop Search',
    company: 'Google',
    year: '2004',
    whatHappened: 'Google launched Desktop Search to index local files. It was so resource-intensive it slowed down computers. Google eventually discontinued it in 2011.',
    lessonLearned: 'Indexing is expensive. Balance search capability with resource usage.',
    icon: '🖥️',
  },

  realWorldExample: {
    company: 'Google Drive',
    scenario: 'Searching across trillions of files',
    howTheyDoIt: 'Uses distributed search infrastructure similar to Google Search, with real-time indexing and sub-second query responses',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Database │
└────────┘     └─────────────┘     │(metadata)│
                     │              └──────────┘
                     │
                     ▼
              ┌──────────────┐
              │Elasticsearch │
              │ (search idx) │
              └──────────────┘
`,

  keyPoints: [
    'Elasticsearch for full-text search, not SQL database',
    'Index file names, content, paths, and metadata',
    'Update index when files are added/modified/deleted',
    'Support fuzzy matching and ranking',
  ],

  quickCheck: {
    question: 'Why use Elasticsearch instead of SQL database for search?',
    options: [
      'It\'s cheaper',
      'Elasticsearch is optimized for full-text search and fuzzy matching',
      'SQL can\'t store text',
      'It\'s more secure',
    ],
    correctIndex: 1,
    explanation: 'Elasticsearch uses inverted indices optimized for full-text search. SQL databases are great for exact matches but slow for text search.',
  },

  keyConcepts: [
    { title: 'Full-Text Search', explanation: 'Search within file names and content', icon: '🔍' },
    { title: 'Inverted Index', explanation: 'Maps words to documents containing them', icon: '📇' },
    { title: 'Fuzzy Matching', explanation: 'Handle typos and variations', icon: '🎯' },
  ],
};

const step4: GuidedStep = {
  id: 'googledrive-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Fast file search',
    taskDescription: 'Add Elasticsearch for full-text search indexing',
    componentsNeeded: [
      { type: 'search_index', reason: 'Fast full-text search across files', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Search Index component added to canvas',
      'App Server connected to Search Index',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
  },

  hints: {
    level1: 'Drag a Search Index (Elasticsearch) component onto the canvas',
    level2: 'Connect App Server to Search Index. This enables fast full-text search.',
    solutionComponents: [{ type: 'search_index' }],
    solutionConnections: [{ from: 'app_server', to: 'search_index' }],
  },
};

// =============================================================================
// STEP 5: Add Cache for Metadata
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 10 million users with 1 billion files, and file listings take 2+ seconds!",
  hook: "Users are complaining: 'Why is Google Drive so slow?' Every file list hits the database.",
  challenge: "Add a cache to make file metadata queries lightning fast.",
  illustration: 'slow-loading',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'File listings load 20x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'File list latency', before: '2000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '92%' },
  ],
  nextTeaser: "But what about handling more traffic?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Speed Up Metadata Queries',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

Instead of:
\`\`\`
Request → Database (slow, 150ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1ms) → Database (only if cache miss)
\`\`\`

For Google Drive, we cache:
- User's file list (most common query)
- Folder contents and hierarchy
- File metadata (size, modified date, etc.)
- Sharing permissions

When a file is uploaded or modified, we invalidate the cache.`,

  whyItMatters: 'At 182K metadata reads/sec peak, hitting the database for every request would melt it. Caching is essential.',

  famousIncident: {
    title: 'Facebook Cache Stampede',
    company: 'Facebook',
    year: '2010',
    whatHappened: 'During a cache cluster restart, all cache invalidations happened at once. The resulting stampede of database queries overwhelmed MySQL, causing a 2-hour outage.',
    lessonLearned: 'Cache warming and gradual invalidation prevent stampedes. Always plan for cache failures.',
    icon: '🐘',
  },

  realWorldExample: {
    company: 'Google Drive',
    scenario: 'Serving 5B metadata requests per day',
    howTheyDoIt: 'Uses multi-layer caching with Memcached and local server caches. Cache hit rate > 90%. Most metadata queries never touch the database.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (92% of requests)
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
      'When a file is uploaded, modified, shared, or deleted',
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

const step5: GuidedStep = {
  id: 'googledrive-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: Fast file organization and listing',
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

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_index', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
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
// STEP 6: Add Load Balancer
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your single app server is maxed out at 100% CPU!",
  hook: "A popular YouTuber mentioned your service. Traffic spiked 20x. One server can't handle it all.",
  challenge: "Add a load balancer to distribute traffic across multiple servers.",
  illustration: 'server-overload',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Traffic is now distributed!',
  achievement: 'Load balancer spreads requests across servers',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Request distribution', after: 'Balanced' },
  ],
  nextTeaser: "But we're still storing files on the server disk...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Distribute the Load',
  conceptExplanation: `A **Load Balancer** sits in front of your app servers and distributes incoming requests.

Benefits:
- **No single point of failure** - if one server dies, others keep working
- **Horizontal scaling** - add more servers to handle more traffic
- **Even distribution** - no single server gets overwhelmed

Common strategies:
- Round-robin: Take turns
- Least connections: Send to least busy server
- Sticky sessions: Same user → same server (important for collaboration!)`,

  whyItMatters: 'At peak, Google Drive handles 182K metadata requests/second + 18K file operations/second. No single server can handle that.',

  famousIncident: {
    title: 'Google Cloud Load Balancer Bug',
    company: 'Google Cloud',
    year: '2019',
    whatHappened: 'A configuration error caused Google\'s US load balancers to drop 25% of requests for 4 hours. YouTube, Gmail, and Drive were all affected.',
    lessonLearned: 'Load balancer configuration is critical infrastructure. Test changes thoroughly in staging first.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'Google Drive',
    scenario: 'Handling 200K+ requests/second at peak',
    howTheyDoIt: 'Uses multiple layers of load balancers (DNS, L4, L7) to distribute traffic across data centers and servers globally',
  },

  keyPoints: [
    'Load balancer distributes requests across servers',
    'Enables horizontal scaling (add more servers)',
    'Eliminates single point of failure',
    'Use sticky sessions for collaboration (WebSocket connections)',
  ],

  quickCheck: {
    question: 'Why do we need sticky sessions for collaboration?',
    options: [
      'To make it faster',
      'WebSocket connections for real-time editing need to stay on same server',
      'It\'s cheaper',
      'It\'s more secure',
    ],
    correctIndex: 1,
    explanation: 'Real-time collaboration uses WebSocket connections that maintain state. Sticky sessions ensure the same user always connects to the same server.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Sticky Sessions', explanation: 'Route same user to same server', icon: '📌' },
  ],
};

const step6: GuidedStep = {
  id: 'googledrive-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

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

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'search_index', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
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
// STEP 7: Add Object Storage (S3) - CRITICAL FOR FILE STORAGE
// =============================================================================

const step7Story: StoryContent = {
  emoji: '💾',
  scenario: "You're storing files directly on server disk. Disaster strikes!",
  hook: "A server crashed and ALL FILES stored on it are GONE. Users lost their important documents forever.",
  challenge: "Move file storage to dedicated object storage (S3) for durability and scalability.",
  illustration: 'data-loss',
};

const step7Celebration: CelebrationContent = {
  emoji: '☁️',
  message: 'Files are now safely stored in the cloud!',
  achievement: 'Object storage provides durability and unlimited scale',
  metrics: [
    { label: 'File durability', before: '0%', after: '99.999999999%' },
    { label: 'Storage capacity', before: 'Limited', after: 'Unlimited' },
    { label: 'File redundancy', after: '11 nines' },
  ],
  nextTeaser: "But how do we enable real-time collaboration?",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage: The Right Tool for File Storage',
  conceptExplanation: `**Never store files on app server disks!** App servers are ephemeral - they can restart, crash, or be replaced.

**Object Storage (S3)** is designed for files:
- **Durability**: 99.999999999% (11 nines) - your files will never be lost
- **Scalability**: Store unlimited files, from bytes to petabytes
- **Cost-effective**: $0.023 per GB/month vs server disk costs
- **Global**: Replicated across multiple data centers automatically

Architecture:
1. Client uploads file → App Server
2. App Server stores file → S3 with unique key
3. App Server stores metadata → Database (S3 key, size, etc.)
4. Client downloads → App Server fetches from S3 → Client

For Google Drive:
- Use **resumable uploads** for large files (up to 5TB!)
- Store **versions** as separate objects
- Support **chunked uploads** (256KB chunks)`,

  whyItMatters: 'Object storage is the foundation of all cloud storage services. Without it, you cannot scale.',

  famousIncident: {
    title: 'S3 Outage 2017',
    company: 'Amazon Web Services',
    year: '2017',
    whatHappened: 'An engineer accidentally removed too many S3 servers during a debugging session. S3 went down for 4 hours, taking down thousands of services that depend on it.',
    lessonLearned: 'Even the most reliable infrastructure can fail. Always have multi-region backup plans.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Google Drive',
    scenario: 'Storing 75+ petabytes of files',
    howTheyDoIt: 'Uses Google Cloud Storage (similar to S3) with multi-region replication, versioning, and lifecycle management for cost optimization',
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
    'Support resumable uploads for large files',
    'Store versions as separate objects',
  ],

  quickCheck: {
    question: 'What is the maximum file size Google Drive supports?',
    options: [
      '1GB',
      '2GB',
      '5TB',
      '100GB',
    ],
    correctIndex: 2,
    explanation: 'Google Drive supports files up to 5TB! This requires resumable, chunked uploads to handle interruptions.',
  },

  keyConcepts: [
    { title: 'Object Storage', explanation: 'S3-like storage for files', icon: '🪣' },
    { title: 'Resumable Upload', explanation: 'Continue from where interrupted', icon: '⏯️' },
    { title: 'Versioning', explanation: 'Keep multiple versions of same file', icon: '📚' },
  ],
};

const step7: GuidedStep = {
  id: 'googledrive-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-1: Upload and download files safely, FR-5: Version history',
    taskDescription: 'Add Object Storage (S3) for file content',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store actual file content with 11-nines durability', displayName: 'S3 / Object Storage' },
    ],
    successCriteria: [
      'Object Storage component added',
      'App Server connected to Object Storage',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'search_index', 'cache', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
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
// STEP 8: Add WebSocket Server for Real-Time Collaboration
// =============================================================================

const step8Story: StoryContent = {
  emoji: '✍️',
  scenario: "Two users are editing the same Google Doc. One types, the other waits 30 seconds to see changes!",
  hook: "This is unacceptable. Google Docs needs REAL-TIME collaboration - changes appear instantly.",
  challenge: "Add a WebSocket server to enable real-time collaboration.",
  illustration: 'real-time-collab',
};

const step8Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Real-time collaboration is working!',
  achievement: 'Users see each other\'s edits in real-time',
  metrics: [
    { label: 'Collaboration latency', before: '30s (polling)', after: '<200ms (WebSocket)' },
    { label: 'Concurrent editors supported', after: '100' },
  ],
  nextTeaser: "But we need to handle collaboration conflicts...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Real-Time Collaboration: WebSockets and Operational Transforms',
  conceptExplanation: `Google Docs' magic is **real-time collaboration**. How does it work?

**Problem with HTTP**: Request-response is slow for real-time updates.
- User A types "hello"
- Server would need to push update to User B
- But HTTP can't push - only respond to requests

**Solution: WebSockets**
1. Open persistent connection between client and server
2. Server can push updates anytime (no polling!)
3. Bi-directional: both sides can send messages

When User A types in a Google Doc:
1. Keystroke sent to WebSocket Server
2. WebSocket Server applies **Operational Transform** (OT)
3. OT ensures conflict-free merging of concurrent edits
4. Server broadcasts change to all other users' WebSocket connections
5. Other users see change within 100-200ms

**Operational Transform** example:
- User A: Insert "hello" at position 0
- User B: Insert "world" at position 0 (simultaneously)
- Without OT: Conflict!
- With OT: Transform operations to: "hello" at 0, "world" at 5
- Result: "helloworld" for both users`,

  whyItMatters: 'Real-time collaboration is Google Drive\'s competitive advantage over Dropbox. This is THE killer feature.',

  famousIncident: {
    title: 'Google Docs Outage 2020',
    company: 'Google',
    year: '2020',
    whatHappened: 'A bug in the operational transform logic caused documents to randomly delete content when multiple users edited simultaneously. Lasted 2 hours.',
    lessonLearned: 'OT is complex and bug-prone. Extensive testing is critical. Consider using CRDTs as alternative.',
    icon: '📝',
  },

  realWorldExample: {
    company: 'Google Docs',
    scenario: 'Handling 100 concurrent editors per document',
    howTheyDoIt: 'Uses operational transforms with a central coordination server. All edits go through the server, which resolves conflicts and broadcasts to all clients.',
  },

  diagram: `
     User A types "hello"
           │
           ▼
    ┌──────────────┐
    │  WebSocket   │◀─── User B connected
    │    Server    │◀─── User C connected
    └──────────────┘
           │
           ├─── Operational Transform
           │
           ├──▶ Broadcast to User B
           └──▶ Broadcast to User C
`,

  keyPoints: [
    'WebSockets enable bidirectional real-time communication',
    'Operational Transforms (OT) resolve concurrent edit conflicts',
    'All edits go through WebSocket Server for coordination',
    'Broadcast changes to all connected users within 100-200ms',
    'Sticky sessions required - users stay on same WebSocket server',
  ],

  quickCheck: {
    question: 'Why can\'t we use regular HTTP for real-time collaboration?',
    options: [
      'HTTP is too slow',
      'HTTP is request-response only; server cannot push updates to client',
      'HTTP doesn\'t support text',
      'HTTP is less secure',
    ],
    correctIndex: 1,
    explanation: 'HTTP requires client to initiate requests. WebSockets open a persistent connection allowing server to push updates instantly.',
  },

  keyConcepts: [
    { title: 'WebSocket', explanation: 'Persistent bidirectional connection', icon: '🔌' },
    { title: 'Operational Transform', explanation: 'Conflict-free concurrent editing', icon: '🔀' },
    { title: 'Real-Time', explanation: 'Changes appear within 100-200ms', icon: '⚡' },
  ],
};

const step8: GuidedStep = {
  id: 'googledrive-step-8',
  stepNumber: 8,
  frIndex: 3,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-4: Real-time collaboration',
    taskDescription: 'Add a WebSocket Server for real-time collaboration',
    componentsNeeded: [
      { type: 'websocket_server', reason: 'Enable real-time collaborative editing', displayName: 'WebSocket Server' },
    ],
    successCriteria: [
      'WebSocket Server component added',
      'Load Balancer connected to WebSocket Server',
      'WebSocket Server connected to Database',
      'WebSocket Server connected to Cache',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'search_index', 'cache', 'object_storage', 'websocket_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'load_balancer', toType: 'websocket_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'websocket_server', toType: 'database' },
      { fromType: 'websocket_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a WebSocket Server onto the canvas',
    level2: 'Connect: Load Balancer → WebSocket Server, WebSocket Server → Database, WebSocket Server → Cache',
    solutionComponents: [{ type: 'websocket_server' }],
    solutionConnections: [
      { from: 'load_balancer', to: 'websocket_server' },
      { from: 'websocket_server', to: 'database' },
      { from: 'websocket_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 9: Add Message Queue for Notifications
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🔔',
  scenario: "A user shares a file with 50 colleagues. How do we notify them all?",
  hook: "Sending 50 emails synchronously takes 10 seconds and blocks the response. Users are frustrated by the delay.",
  challenge: "Add a message queue to handle async notifications efficiently.",
  illustration: 'notification-delay',
};

const step9Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Google Drive!',
  achievement: 'A scalable, real-time cloud storage platform',
  metrics: [
    { label: 'File operations/sec', after: '18K peak' },
    { label: 'Metadata queries/sec', after: '174K peak' },
    { label: 'Real-time collaboration latency', after: '<200ms' },
    { label: 'Search latency', after: '<300ms' },
    { label: 'File durability', after: '99.999999999%' },
  ],
  nextTeaser: "You've mastered Google Drive system design!",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Async Notifications at Scale',
  conceptExplanation: `When users share files, comment, or collaborate, we need to send notifications. But how?

**Bad approach: Synchronous**
- User shares file with 50 people
- Server sends 50 emails one by one
- Takes 10+ seconds
- User waits, response is delayed

**Good approach: Message Queue**
1. User shares file → App Server
2. App Server publishes message to queue: "user123 shared file456 with [50 users]"
3. App Server immediately responds to user (< 100ms)
4. Background workers consume queue messages
5. Workers send emails, push notifications, in-app alerts asynchronously

Benefits:
- **Fast response** - user doesn't wait for notifications
- **Reliable** - if notification fails, retry from queue
- **Scalable** - add more workers to process more notifications
- **Decoupled** - notification logic separate from main app

For Google Drive, use queue for:
- File sharing notifications
- Comment notifications
- Collaboration invites
- Storage quota warnings`,

  whyItMatters: 'Without async processing, every share operation would be slow and could fail if email service is down.',

  famousIncident: {
    title: 'Gmail Queue Overflow',
    company: 'Google',
    year: '2013',
    whatHappened: 'A bug caused notification queue to overflow, creating a backlog of 500M messages. Some users received notification emails 3 days late.',
    lessonLearned: 'Monitor queue depth and processing rate. Set up alerts for queue backlog.',
    icon: '📬',
  },

  realWorldExample: {
    company: 'Google Drive',
    scenario: 'Sending millions of notifications per day',
    howTheyDoIt: 'Uses Cloud Pub/Sub for message queuing with auto-scaling workers that process notifications in parallel',
  },

  diagram: `
User shares file
      │
      ▼
┌─────────────┐     ┌─────────────────────────────────────┐
│ App Server  │────▶│          Message Queue              │
│             │     │  [share_notification_1, ...]        │
└─────────────┘     └──────────────┬──────────────────────┘
      │                            │
      │                            │
   Return                          ▼
  instantly!              ┌─────────────────┐
                          │ Worker Servers  │
                          │ (send emails/   │
                          │  push notifs)   │
                          └─────────────────┘
`,

  keyPoints: [
    'Message queue decouples notification sending from user requests',
    'App Server responds instantly, workers process async',
    'Queue provides reliability (retry on failure)',
    'Scalable: add more workers to handle more notifications',
    'Use for: sharing notifications, comments, collaboration invites',
  ],

  quickCheck: {
    question: 'Why use a message queue instead of sending notifications synchronously?',
    options: [
      'It\'s cheaper',
      'User gets instant response; notifications sent asynchronously by workers',
      'It\'s easier to code',
      'It uses less storage',
    ],
    correctIndex: 1,
    explanation: 'Message queues decouple slow operations (sending emails) from user-facing requests. User gets instant response.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for async task processing', icon: '📬' },
    { title: 'Async Processing', explanation: 'Tasks processed in background', icon: '⚙️' },
    { title: 'Worker', explanation: 'Server that consumes and processes queue messages', icon: '👷' },
  ],
};

const step9: GuidedStep = {
  id: 'googledrive-step-9',
  stepNumber: 9,
  frIndex: 2,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-3: Share files with notifications',
    taskDescription: 'Add a Message Queue for async notifications',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Send notifications asynchronously', displayName: 'Kafka / RabbitMQ' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'search_index', 'cache', 'object_storage', 'websocket_server', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'load_balancer', toType: 'websocket_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'websocket_server', toType: 'database' },
      { fromType: 'websocket_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async notification processing.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const googledriveGuidedTutorial: GuidedTutorial = {
  problemId: 'googledrive',
  title: 'Design Google Drive',
  description: 'Build a cloud storage platform with real-time collaboration, file sharing, and version history',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '☁️',
    hook: "You've been hired as Lead Engineer at CloudDocs Inc!",
    scenario: "Your mission: Build a Google Drive-like platform with real-time collaboration for millions of users.",
    challenge: "Can you design a system that handles file storage, sharing, search, AND real-time collaborative editing?",
  },

  requirementsPhase: googledriveRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'File Metadata vs Content',
    'Database for Metadata',
    'Full-Text Search (Elasticsearch)',
    'Caching',
    'Load Balancing',
    'Object Storage (S3)',
    'Resumable Uploads',
    'Version History',
    'WebSockets',
    'Real-Time Collaboration',
    'Operational Transforms',
    'Message Queues',
    'Async Notifications',
    'Permissions and ACLs',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval',
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 8: Distributed Systems',
    'Chapter 11: Stream Processing',
  ],
};

export default googledriveGuidedTutorial;
