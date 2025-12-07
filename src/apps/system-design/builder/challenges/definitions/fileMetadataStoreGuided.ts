import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * File Metadata Store Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 6-step tutorial that teaches system design concepts
 * while building a file metadata storage system.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic file metadata database
 * Steps 4-6: Tree structure storage, permission inheritance, sync support
 *
 * Key Concepts:
 * - File metadata vs content separation
 * - Hierarchical tree structures
 * - Permission inheritance models
 * - Sync protocols and conflict detection
 * - Efficient metadata queries
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const fileMetadataStoreRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a file metadata storage system",

  interviewer: {
    name: 'Maya Patel',
    role: 'Senior Engineer at MetaStore Systems',
    avatar: '👩‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-metadata',
      category: 'functional',
      question: "What file metadata do we need to store?",
      answer: "We need to track:\n\n1. **Basic attributes** - filename, size, creation date, modified date\n2. **Owner information** - who created/owns the file\n3. **Location** - parent folder, full path\n4. **Type** - file extension, MIME type\n5. **Versions** - version history and checksums",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Metadata is separate from file content - it's the 'data about data' that enables fast queries",
    },
    {
      id: 'file-types',
      category: 'functional',
      question: "What types of files should the system support?",
      answer: "Support **all file types**:\n- Documents (PDF, DOCX, TXT)\n- Images (JPG, PNG, GIF)\n- Videos (MP4, AVI, MOV)\n- Code files (PY, JS, JAVA)\n- Archives (ZIP, TAR, GZ)\n\nNo restrictions on file types, but we only store metadata, not the actual content.",
      importance: 'important',
      revealsRequirement: 'FR-1',
      learningPoint: "File type affects metadata (images have dimensions, videos have duration, etc.)",
    },
    {
      id: 'folder-hierarchy',
      category: 'functional',
      question: "How should folder/directory structure work?",
      answer: "Use a **hierarchical tree structure**:\n1. Files can be organized in folders\n2. Folders can contain files and other folders (nested)\n3. Support unlimited nesting depth (within reason)\n4. Each file/folder has a unique ID and path\n5. Support moving files between folders",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Tree structures require parent-child relationships - this is a classic graph problem",
    },
    {
      id: 'permissions',
      category: 'functional',
      question: "How should permissions and access control work?",
      answer: "Implement **permission inheritance**:\n1. **File-level permissions** - read, write, delete per user/group\n2. **Folder-level permissions** - inherited by child files and folders\n3. **Owner** - full control over file/folder\n4. **Groups** - assign permissions to groups of users\n5. **Inheritance** - child inherits parent permissions unless overridden",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Permission inheritance simplifies management but complicates queries - need to traverse tree",
    },
    {
      id: 'versioning',
      category: 'functional',
      question: "Should we track file version history?",
      answer: "Yes! Track **version history**:\n1. Store metadata for each version (timestamp, user, changes)\n2. Keep checksums (SHA-256) to detect changes\n3. Support up to 100 versions per file\n4. Enable rollback to previous versions\n5. Track who made each change",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Versioning multiplies storage needs - need efficient strategies",
    },
    {
      id: 'file-sharing',
      category: 'clarification',
      question: "Can files be shared with external users?",
      answer: "Yes, support **file sharing**:\n1. Generate shareable links with expiration\n2. Grant read-only or edit access\n3. Track who accessed shared files\n4. Revoke access anytime\n\nThis is a v2 feature - focus on basic permissions first.",
      importance: 'nice-to-have',
      insight: "External sharing adds complexity - need public/private link management",
    },

    // SCALE & NFRs
    {
      id: 'throughput-files',
      category: 'throughput',
      question: "How many files should we support?",
      answer: "Design for **1 billion files** across all users, with 10 million active users",
      importance: 'critical',
      learningPoint: "At this scale, every query needs proper indexing",
    },
    {
      id: 'throughput-operations',
      category: 'throughput',
      question: "How many metadata operations per day?",
      answer: "About 500 million metadata operations per day (file listings, searches, updates)",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 ops/sec",
        result: "~6K ops/sec (18K at peak)",
      },
      learningPoint: "Metadata operations vastly outnumber file content operations",
    },
    {
      id: 'sync-detection',
      category: 'throughput',
      question: "How do we detect which files changed for sync clients?",
      answer: "Support **efficient sync detection**:\n1. Track last_modified timestamp for all files\n2. Clients send last_sync_time, server returns changed files\n3. Use change logs/event streams for efficiency\n4. Support delta sync (only changed files)",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Sync is a core use case - optimize for 'what changed since timestamp X' queries",
    },
    {
      id: 'query-latency',
      category: 'latency',
      question: "How fast should metadata queries be?",
      answer: "p99 under 100ms for:\n- File listings (get all files in a folder)\n- File lookups (get metadata by ID or path)\n- Permission checks (can user access this file?)\n- Sync queries (what changed since timestamp?)",
      importance: 'critical',
      learningPoint: "Fast metadata queries require proper indexing and caching",
    },
    {
      id: 'tree-traversal',
      category: 'latency',
      question: "How fast should we traverse folder hierarchies?",
      answer: "Folder tree operations should be **sub-second**:\n- Get all descendants of a folder (recursive listing)\n- Move folder with all children\n- Calculate total size of folder tree\n- Check inherited permissions",
      importance: 'important',
      insight: "Tree traversal can be expensive - consider materialized paths or nested sets",
    },
    {
      id: 'concurrent-updates',
      category: 'burst',
      question: "What happens when multiple users modify the same file simultaneously?",
      answer: "Handle **concurrent modifications**:\n1. Use optimistic locking (version numbers)\n2. Last-write-wins for most metadata\n3. Detect conflicts and notify users\n4. Prevent corruption with transactions",
      importance: 'critical',
      insight: "Concurrent writes are the hardest problem - need proper locking",
    },
    {
      id: 'metadata-size',
      category: 'payload',
      question: "How much metadata per file?",
      answer: "Each file has approximately:\n- Basic metadata: ~500 bytes (name, size, timestamps, owner)\n- Permissions: ~200 bytes per ACL entry (avg 3 entries = 600 bytes)\n- Versions: ~100 bytes per version (avg 10 versions = 1KB)\n- **Total: ~2KB per file**\n\nFor 1B files = ~2TB of metadata",
      importance: 'important',
      learningPoint: "Metadata is small but adds up at scale - need efficient storage",
    },
    {
      id: 'path-indexing',
      category: 'payload',
      question: "How do we efficiently query files by path?",
      answer: "Support **path-based queries**:\n1. Index full paths for fast lookups\n2. Support prefix searches (/folder1/folder2/*)\n3. Handle path changes when folders move\n4. Normalize paths (handle //, trailing slashes)\n\nPaths are frequently queried - need fast path → file_id resolution.",
      importance: 'important',
      learningPoint: "Path indexing is critical for user-friendly file access",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-metadata', 'folder-hierarchy', 'permissions'],
  criticalFRQuestionIds: ['core-metadata', 'folder-hierarchy'],
  criticalScaleQuestionIds: ['throughput-operations', 'query-latency', 'concurrent-updates'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Store file metadata',
      description: 'Track filename, size, dates, owner, type, versions',
      emoji: '📋',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Organize in tree structure',
      description: 'Hierarchical folders with parent-child relationships',
      emoji: '🌲',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Permission inheritance',
      description: 'Folder permissions inherited by children',
      emoji: '🔐',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Version tracking',
      description: 'Store version history with checksums',
      emoji: '📜',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Sync detection',
      description: 'Efficiently detect changed files',
      emoji: '🔄',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million',
    writesPerDay: '100 million metadata updates',
    readsPerDay: '400 million metadata reads',
    peakMultiplier: 3,
    readWriteRatio: '4:1 (read-heavy)',
    calculatedWriteRPS: { average: 1157, peak: 3471 },
    calculatedReadRPS: { average: 4629, peak: 13887 },
    maxPayloadSize: '~2KB per file metadata',
    storagePerRecord: '~2KB metadata per file',
    storageGrowthPerYear: '~200GB metadata (100M new files/year)',
    redirectLatencySLA: 'p99 < 100ms (metadata queries)',
    createLatencySLA: 'p99 < 50ms (permission checks)',
  },

  architecturalImplications: [
    'Read-heavy (4:1) → Caching is critical for file listings',
    'Tree structure → Need efficient parent-child queries and traversal',
    'Permission inheritance → Must check entire path for access control',
    'Sync queries → Index on last_modified timestamp',
    'Small records (~2KB) → SQL database works well, but needs proper indexing',
  ],

  outOfScope: [
    'Actual file content storage (only metadata)',
    'Full-text search within file content',
    'Multi-region replication',
    'Real-time collaboration on files',
    'File compression and deduplication',
  ],

  keyInsight: "File metadata is the index that makes file systems fast. First, we'll build basic metadata storage. Then we'll optimize for tree operations, permissions, and sync - the three hardest challenges!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📁',
  scenario: "Welcome to MetaStore Systems! You're building a file metadata storage system.",
  hook: "A file sync client needs to check metadata for 10,000 files. Can your system handle it?",
  challenge: "Set up the basic request flow so clients can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your metadata service is online!',
  achievement: 'Clients can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle metadata yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every metadata system starts with a **Client** connecting to a **Server**.

For a file metadata store:
1. **Clients** - sync apps, file browsers, search tools
2. **App Server** - processes metadata queries
3. **HTTP/gRPC** - protocol for communication

Common metadata operations:
- GET /api/files/{id}/metadata → Get file metadata
- GET /api/folders/{id}/children → List files in folder
- POST /api/files/metadata → Create/update metadata
- GET /api/files/changes?since={timestamp} → Get changed files

This is the foundation for ALL metadata operations!`,

  whyItMatters: 'Without this connection, no client can query or update file metadata.',

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Handling 600M+ users',
    howTheyDoIt: 'Their metadata service handles billions of queries per day, separated from file content storage',
  },

  keyPoints: [
    'Client = apps that need metadata (sync clients, file browsers)',
    'App Server = backend that processes metadata queries',
    'Metadata operations are fast (no file content transfer)',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Apps that query file metadata', icon: '📱' },
    { title: 'App Server', explanation: 'Backend that manages metadata', icon: '🖥️' },
    { title: 'Metadata', explanation: 'Data about files (not file content)', icon: '📋' },
  ],
};

const step1: GuidedStep = {
  id: 'file-metadata-store-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents sync clients and file browsers', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles metadata queries and updates', displayName: 'App Server' },
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
// STEP 2: Implement Metadata Operations (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to handle metadata!",
  hook: "A sync client tried to list files in a folder but got a 404 error.",
  challenge: "Write the Python code to store and retrieve file metadata.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle metadata!',
  achievement: 'You implemented the core metadata operations',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can store metadata', after: '✓' },
    { label: 'Can retrieve metadata', after: '✓' },
    { label: 'Can list folders', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all metadata is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Metadata Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the metadata
3. Returns a response

For file metadata, we need handlers for:
- \`get_metadata(file_id)\` - Retrieve file metadata
- \`update_metadata(file_id, metadata)\` - Update file attributes
- \`list_folder(folder_id)\` - Get all files in a folder
- \`get_changes(since_timestamp)\` - Get files changed since timestamp

For now, we'll store metadata in memory (Python dictionaries).
The database comes in Step 3.

Key data structure:
\`\`\`python
{
  "file_id": "abc123",
  "name": "document.pdf",
  "size": 1048576,
  "parent_id": "folder_xyz",
  "owner": "user@example.com",
  "created_at": "2023-01-15T10:30:00Z",
  "modified_at": "2023-01-20T14:22:00Z",
  "version": 3,
  "checksum": "sha256:abc..."
}
\`\`\``,

  whyItMatters: 'Without handlers, your server is just an empty shell. This is where metadata management happens!',

  famousIncident: {
    title: 'iCloud Photo Metadata Corruption',
    company: 'Apple',
    year: '2016',
    whatHappened: 'A bug in iCloud Photos corrupted metadata for millions of photos. Users saw wrong dates, locations, and albums. Took weeks to fix.',
    lessonLearned: 'Metadata corruption is just as bad as data loss. Validate all metadata updates.',
    icon: '📸',
  },

  realWorldExample: {
    company: 'Google Drive',
    scenario: 'Handling 6K metadata operations/second',
    howTheyDoIt: 'Their File Service handles metadata separately from content, with dedicated APIs for metadata queries',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Store file metadata in structured format (JSON/dict)',
    'Use in-memory storage for now - database comes next',
    'Track timestamps for sync detection',
  ],

  quickCheck: {
    question: 'Why separate metadata from file content?',
    options: [
      'It\'s easier to code',
      'Metadata is queried 100x more often than content',
      'Databases can\'t store files',
      'It\'s cheaper',
    ],
    correctIndex: 1,
    explanation: 'Metadata (name, size, dates) is queried constantly for file listings. Content is only accessed on download. Different access patterns need different storage.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'File Metadata', explanation: 'Name, size, dates, owner, permissions', icon: '📋' },
    { title: 'Folder Listing', explanation: 'Get all children of a folder', icon: '📁' },
  ],
};

const step2: GuidedStep = {
  id: 'file-metadata-store-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Store file metadata',
    taskDescription: 'Configure APIs and implement Python handlers for metadata operations',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/files/{id}, PUT /api/files/{id}, GET /api/folders/{id}/children, GET /api/changes APIs',
      'Open the Python tab',
      'Implement get_metadata(), update_metadata(), list_folder(), and get_changes() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for get_metadata, update_metadata, list_folder, and get_changes',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/files/{id}', 'PUT /api/files/{id}', 'GET /api/folders/{id}/children', 'GET /api/changes'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Persistent Storage
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 2 AM. Your server crashed and restarted...",
  hook: "When it came back online, ALL file metadata was GONE! Users lost track of millions of files.",
  challenge: "Add a database to store file metadata, folder hierarchy, and versions.",
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
  nextTeaser: "But querying the folder tree is getting slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Database for Metadata Storage',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Metadata survives crashes
- **Relationships**: Parent-child folder structure
- **Queries**: Efficient data retrieval with indexes

For file metadata, we need tables for:
- \`files\` - File metadata (id, name, size, parent_id, owner_id, created_at, modified_at, checksum)
- \`folders\` - Folder hierarchy (id, name, parent_id, owner_id)
- \`permissions\` - Access control (file_id, user_id, permission_type)
- \`versions\` - Version history (file_id, version_number, checksum, created_at)

IMPORTANT: Database schema for tree structure:
\`\`\`sql
CREATE TABLE files (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  parent_id UUID REFERENCES folders(id),
  owner_id UUID,
  size BIGINT,
  created_at TIMESTAMP,
  modified_at TIMESTAMP,
  checksum VARCHAR(64),
  version INT,
  INDEX idx_parent (parent_id),
  INDEX idx_modified (modified_at)
);
\`\`\``,

  whyItMatters: 'Imagine losing all file metadata after a crash. Users would lose track of their entire file system!',

  famousIncident: {
    title: 'Dropbox Database Outage',
    company: 'Dropbox',
    year: '2014',
    whatHappened: 'Database issues caused metadata to become inconsistent. Users saw files appear/disappear randomly. Took 12 hours to restore consistency.',
    lessonLearned: 'Metadata consistency is critical. Use transactions and proper constraints.',
    icon: '🗄️',
  },

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Storing metadata for billions of files',
    howTheyDoIt: 'Uses MySQL for metadata storage, sharded by user_id. Each shard stores metadata for a subset of users.',
  },

  keyPoints: [
    'Database stores file metadata, folders, permissions, versions',
    'Use SQL (PostgreSQL/MySQL) for structured data',
    'Index parent_id for fast folder listings',
    'Index modified_at for sync queries',
  ],

  quickCheck: {
    question: 'Why index the parent_id column?',
    options: [
      'To save storage space',
      'To make folder listing queries fast',
      'It\'s required by SQL',
      'To prevent duplicates',
    ],
    correctIndex: 1,
    explanation: 'Folder listings query "SELECT * FROM files WHERE parent_id = ?" - without an index, this scans the entire table (slow!)',
  },

  keyConcepts: [
    { title: 'Database', explanation: 'Persistent storage for metadata', icon: '🗄️' },
    { title: 'Index', explanation: 'Speeds up queries on specific columns', icon: '🔍' },
    { title: 'Foreign Key', explanation: 'Links child to parent in tree structure', icon: '🔗' },
  ],
};

const step3: GuidedStep = {
  id: 'file-metadata-store-step-3',
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
// STEP 4: Add Cache for Tree Queries
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "Users complain that folder listings take 2+ seconds for large folders!",
  hook: "A user has 50,000 files in one folder. Every listing query scans the entire database.",
  challenge: "Add a cache to make folder listings and metadata queries lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Folder listings load 30x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Folder list latency', before: '2000ms', after: '65ms' },
    { label: 'Cache hit rate', after: '88%' },
  ],
  nextTeaser: "But tree traversal for permissions is still slow...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Speed Up Tree Queries',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

Instead of:
\`\`\`
Request → Database (slow, 100ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1ms) → Database (only if cache miss)
\`\`\`

For file metadata, we cache:
- **Folder listings** - most common query (get all files in folder)
- **File metadata** - frequently accessed files
- **Permission trees** - inherited permissions for paths
- **Folder stats** - file counts, total size

When a file is created/updated/deleted, we invalidate the cache.

Cache keys:
- \`folder:{folder_id}:children\` → list of child file IDs
- \`file:{file_id}:metadata\` → file metadata object
- \`path:{path}:permissions\` → inherited permissions`,

  whyItMatters: 'At 18K metadata reads/sec peak, hitting the database for every folder listing would overload it. Caching is essential.',

  famousIncident: {
    title: 'OneDrive Metadata Cache Bug',
    company: 'Microsoft',
    year: '2018',
    whatHappened: 'A cache invalidation bug caused OneDrive to show stale file listings. Users saw deleted files reappearing. Lasted 6 hours.',
    lessonLearned: 'Cache invalidation is hard. Always invalidate on writes, and use short TTLs as backup.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Serving 500M metadata requests per day',
    howTheyDoIt: 'Uses Redis clusters to cache folder listings and metadata. Cache hit rate > 85%. Most queries never touch the database.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (88% of requests)
                     │   Return instantly!
`,

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache folder listings (most common query)',
    'Invalidate cache when files are created/modified/deleted/moved',
    'Set TTL (Time To Live) to 5 minutes as backup',
  ],

  quickCheck: {
    question: 'When should you invalidate the folder listing cache?',
    options: [
      'Never - let TTL handle it',
      'When a file is created, deleted, or moved to/from that folder',
      'Every hour',
      'Only when the cache is full',
    ],
    correctIndex: 1,
    explanation: 'Invalidate cache when folder contents change. If file is added to folder_A, invalidate cache for folder_A.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'Invalidation', explanation: 'Remove stale data when changes happen', icon: '🗑️' },
  ],
};

const step4: GuidedStep = {
  id: 'file-metadata-store-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Fast folder tree queries',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache folder listings and metadata for fast queries', displayName: 'Redis Cache' },
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
// STEP 5: Optimize Permission Inheritance
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔐',
  scenario: "Permission checks are killing performance!",
  hook: "To check if a user can access a file 10 levels deep, you need to query 10 folders. Taking 500ms per check!",
  challenge: "Optimize permission inheritance to make access control fast.",
  illustration: 'slow-permissions',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Permission checks are now instant!',
  achievement: 'Optimized permission inheritance',
  metrics: [
    { label: 'Permission check latency', before: '500ms', after: '25ms' },
    { label: 'Tree traversals eliminated', after: '90%' },
  ],
  nextTeaser: "But sync clients are still downloading too much data...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Permission Inheritance: Efficient Access Control',
  conceptExplanation: `Permission inheritance is powerful but can be slow.

**Problem**: To check if user can access \`/a/b/c/d/file.txt\`:
1. Check file permissions → no explicit permission
2. Check folder /a/b/c/d permissions → no explicit permission
3. Check folder /a/b/c permissions → no explicit permission
4. Check folder /a/b permissions → no explicit permission
5. Check folder /a permissions → FOUND: user has read access
6. Result: **5 database queries** just for one permission check!

**Solution 1: Materialized Paths**
Store the full path to root for each file:
\`\`\`
file.ancestors = ["/a", "/a/b", "/a/b/c", "/a/b/c/d"]
\`\`\`

To check permissions:
1. Get file.ancestors
2. Query permissions for all ancestors in one query
3. Apply inheritance rules
4. Result: **1 database query** instead of 5!

**Solution 2: Cache Permission Trees**
Cache inherited permissions by path:
\`\`\`
cache["permissions:/a/b/c/d/file.txt"] = {
  "user123": "read",
  "user456": "write"
}
\`\`\`

**Solution 3: Denormalized Permissions**
Store inherited permissions directly on files (updated when parent changes)`,

  whyItMatters: 'Permission checks happen on EVERY file access. Slow permission checks make the entire system slow.',

  famousIncident: {
    title: 'Google Drive Sharing Bug',
    company: 'Google',
    year: '2020',
    whatHappened: 'A bug in permission inheritance caused files to become inaccessible when parent folders were moved. Affected millions of users.',
    lessonLearned: 'Permission inheritance is complex. Test thoroughly when folders are moved, renamed, or deleted.',
    icon: '🔒',
  },

  realWorldExample: {
    company: 'Box',
    scenario: 'Checking permissions for millions of files',
    howTheyDoIt: 'Uses materialized paths and aggressive caching. Most permission checks are served from cache.',
  },

  keyPoints: [
    'Materialized paths store full ancestor chain',
    'Query all ancestor permissions in one database query',
    'Cache inherited permissions by path',
    'Update cache when parent permissions change',
  ],

  quickCheck: {
    question: 'Why are materialized paths faster than recursive queries?',
    options: [
      'They use less storage',
      'One query gets all ancestors instead of N queries',
      'They\'re easier to implement',
      'They\'re more secure',
    ],
    correctIndex: 1,
    explanation: 'Materialized paths let you query all ancestors in one database query instead of traversing the tree one level at a time.',
  },

  keyConcepts: [
    { title: 'Materialized Path', explanation: 'Store full path to root for fast lookups', icon: '🛤️' },
    { title: 'Inheritance', explanation: 'Children inherit parent permissions', icon: '👨‍👧' },
    { title: 'Cache', explanation: 'Cache inherited permissions by path', icon: '💾' },
  ],
};

const step5: GuidedStep = {
  id: 'file-metadata-store-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-3: Fast permission inheritance',
    taskDescription: 'Review permission checking strategy and caching',
    successCriteria: [
      'Verify cache is being used for permission checks',
      'Consider materialized paths for ancestor lookups',
      'Cache permissions by path with appropriate TTL',
    ],
  },

  celebration: step5Celebration,

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
    level1: 'Review cache configuration to ensure permissions are cached',
    level2: 'Permission caching prevents repeated tree traversals. Make sure TTL and invalidation are configured properly.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Message Queue for Sync Notifications
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔄',
  scenario: "Sync clients are polling every 30 seconds asking 'any changes?'",
  hook: "10 million clients × 1 request every 30 seconds = 333K requests/sec, just for polling! 99% return 'no changes'.",
  challenge: "Add a message queue to push change notifications to sync clients efficiently.",
  illustration: 'sync-polling',
};

const step6Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a file metadata store!',
  achievement: 'A scalable, efficient metadata system with tree structure and sync',
  metrics: [
    { label: 'Metadata queries/sec', after: '18K peak' },
    { label: 'Folder list latency', after: '<65ms' },
    { label: 'Permission check latency', after: '<25ms' },
    { label: 'Sync notification latency', after: '<2s' },
    { label: 'Polling eliminated', after: '95%' },
  ],
  nextTeaser: "You've mastered file metadata storage design!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Sync Optimization: Push Instead of Poll',
  conceptExplanation: `How do sync clients know when files changed?

**Bad approach: Polling**
- Every sync client polls every 30 seconds: "Any changes?"
- 10M clients × 2 polls/min = 333K requests/sec
- 99% of requests return "no changes" - massive waste

**Good approach: Push Notifications via Message Queue**
1. When file metadata changes → App Server publishes to queue
2. Queue message: {"user_id": "user123", "file_id": "abc", "action": "modified"}
3. Sync Service consumes queue and pushes to connected clients
4. Clients receive notification within seconds
5. Clients pull metadata only when needed

Benefits:
- **Real-time**: Clients notified within seconds
- **Efficient**: No wasteful polling
- **Scalable**: Queue handles millions of messages/sec

For metadata store, publish to queue when:
- File created, modified, deleted
- File moved to different folder
- Permissions changed
- File renamed

Message format:
\`\`\`json
{
  "user_id": "user123",
  "event_type": "file_modified",
  "file_id": "abc123",
  "parent_id": "folder_xyz",
  "timestamp": "2023-01-20T14:22:00Z"
}
\`\`\``,

  whyItMatters: 'Without push notifications, polling wastes 95%+ of server resources on "no changes" responses.',

  famousIncident: {
    title: 'OneDrive Sync Storm',
    company: 'Microsoft',
    year: '2019',
    whatHappened: 'A bug caused OneDrive clients to sync in a loop, generating millions of unnecessary requests. Servers overloaded, sync stopped working for hours.',
    lessonLearned: 'Sync logic must be carefully designed to prevent infinite loops and storms.',
    icon: '🌪️',
  },

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Syncing files for 700M users',
    howTheyDoIt: 'Uses long-polling and notifications service. When files change, all user devices get notified within seconds via persistent connections.',
  },

  diagram: `
File modified
      │
      ▼
┌─────────────┐     ┌─────────────────────────────────────┐
│ App Server  │────▶│          Message Queue              │
│             │     │  [user123:file_modified, ...]       │
└─────────────┘     └──────────────┬──────────────────────┘
                                   │
                                   │ Push notifications
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
        ┌──────────┐         ┌──────────┐        ┌──────────┐
        │Sync      │         │Sync      │        │Sync      │
        │Client A  │         │Client B  │        │Client C  │
        └──────────┘         └──────────┘        └──────────┘
`,

  keyPoints: [
    'Message queue enables push notifications instead of polling',
    'Publish events when metadata changes',
    'Sync clients subscribe to their user notifications',
    'Push reduces server load by 95%+',
    'Sync latency drops from 30s to <2s',
  ],

  quickCheck: {
    question: 'Why is push better than polling for sync?',
    options: [
      'It\'s cheaper',
      'Clients get notified immediately; no wasteful "no changes" requests',
      'It\'s easier to implement',
      'It uses less storage',
    ],
    correctIndex: 1,
    explanation: 'Push notifications eliminate wasteful polling. Clients only make requests when something actually changed.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for async change notifications', icon: '📬' },
    { title: 'Push', explanation: 'Server notifies clients of changes', icon: '📤' },
    { title: 'Poll', explanation: 'Client repeatedly asks "any changes?"', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'file-metadata-store-step-6',
  stepNumber: 6,
  frIndex: 4,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-5: Efficient sync detection',
    taskDescription: 'Add a Message Queue for async sync notifications',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Push change notifications to sync clients', displayName: 'Kafka / RabbitMQ' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step6Celebration,

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
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables push-based sync notifications.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const fileMetadataStoreGuidedTutorial: GuidedTutorial = {
  problemId: 'file-metadata-store',
  title: 'Design File Metadata Store',
  description: 'Build a file metadata storage system with tree structure, permission inheritance, and sync support',
  difficulty: 'intermediate',
  estimatedMinutes: 35,

  welcomeStory: {
    emoji: '📁',
    hook: "You've been hired as Lead Engineer at MetaStore Systems!",
    scenario: "Your mission: Build a scalable file metadata storage system that can handle billions of files.",
    challenge: "Can you design a system that handles tree structures, permission inheritance, and efficient sync?",
  },

  requirementsPhase: fileMetadataStoreRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'Metadata vs Content Separation',
    'Tree Data Structures',
    'Database Indexing',
    'Caching Strategies',
    'Permission Inheritance',
    'Materialized Paths',
    'Sync Protocols',
    'Push vs Poll',
    'Message Queues',
    'Folder Hierarchy',
    'Version Tracking',
  ],

  ddiaReferences: [
    'Chapter 2: Data Models',
    'Chapter 3: Storage and Retrieval',
    'Chapter 7: Transactions',
    'Chapter 11: Stream Processing',
  ],
};

export default fileMetadataStoreGuidedTutorial;
