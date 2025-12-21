import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Dropbox - Progressive Tutorial (4 Phases)
 *
 * A single evolving tutorial that grows from beginner → intermediate → advanced → expert.
 * Focus: File storage, sync, chunking, deduplication, conflict resolution.
 *
 * PHASE 1 - BEGINNER (Steps 1-3):
 * - FR-1: Upload files
 * - FR-2: Download files
 * - Build: Client → Server → Object Storage
 *
 * PHASE 2 - INTERMEDIATE (Steps 4-6):
 * - FR-3: File sync across devices
 * - FR-4: File versioning
 * - Build: Sync protocol, metadata DB, version history
 *
 * PHASE 3 - ADVANCED (Steps 7-9):
 * - NFR: Handle large files (GB+)
 * - Chunking and deduplication
 * - Build: Block-level sync, content-addressable storage
 *
 * PHASE 4 - EXPERT (Steps 10-12):
 * - Conflict resolution
 * - Sharing and collaboration
 * - Multi-region sync
 *
 * Key Teaching: Sync is HARD. Chunking and deduplication save bandwidth/storage.
 */

// =============================================================================
// PHASE 1: BEGINNER REQUIREMENTS (Steps 1-3)
// =============================================================================

const phase1Requirements: RequirementsGatheringContent = {
  problemStatement: "Design a file storage and sync service like Dropbox",

  interviewer: {
    name: 'Jennifer Lee',
    role: 'Product Manager at CloudSync',
    avatar: '👩‍💼',
  },

  questions: [
    {
      id: 'upload-files',
      category: 'functional',
      question: "What's the basic thing users want to do?",
      answer: "Upload files! Users drag files into a folder, and they get stored in the cloud. Available from anywhere.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Start with basic upload",
    },
    {
      id: 'download-files',
      category: 'functional',
      question: "How do users access their files?",
      answer: "Download them! From the web, mobile, or desktop app. Click a file, download it, use it.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Files must be retrievable",
    },
  ],

  minimumQuestionsRequired: 2,
  criticalQuestionIds: ['upload-files', 'download-files'],
  criticalFRQuestionIds: ['upload-files', 'download-files'],
  criticalScaleQuestionIds: [],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Upload files',
      description: 'Upload files to cloud storage',
      emoji: '📤',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Download files',
      description: 'Download files from cloud storage',
      emoji: '📥',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100,000',
    writesPerDay: '10M file operations',
    readsPerDay: '50M file downloads',
    peakMultiplier: 2,
    readWriteRatio: '5:1',
    calculatedWriteRPS: { average: 100, peak: 300 },
    calculatedReadRPS: { average: 500, peak: 1500 },
    maxPayloadSize: 'Files: 1MB - 50GB',
    storagePerRecord: '~10MB average file',
    storageGrowthPerYear: '~100TB',
    redirectLatencySLA: 'Download start < 2s',
    createLatencySLA: 'Upload varies by size',
  },

  architecturalImplications: [
    '✅ Large files need special handling',
    '✅ Metadata separate from file content',
    '✅ Object storage for files (S3)',
  ],

  outOfScope: [
    'File sync (Phase 2)',
    'Versioning (Phase 2)',
    'Chunking (Phase 3)',
    'Sharing (Phase 4)',
  ],

  keyInsight: "Files are BIG. A 1GB file can't be uploaded like a JSON payload. We need streaming uploads to object storage, with metadata in a database.",

  thinkingFramework: {
    title: "Phase 1: Basic File Storage",
    intro: "We have 2 simple requirements. Let's build basic upload and download.",

    steps: [
      {
        id: 'separate-data',
        title: 'Step 1: Metadata vs Content',
        alwaysAsk: "What data do we store?",
        whyItMatters: "File content (gigabytes) and metadata (kilobytes) need different storage.",
        expertBreakdown: {
          intro: "Two types of data:",
          points: [
            "Metadata: filename, size, owner, timestamps → Database",
            "Content: the actual file bytes → Object Storage (S3)",
            "Metadata points to content location",
            "Never store file content in database!"
          ]
        },
        icon: '📁',
        category: 'functional'
      },
      {
        id: 'upload-flow',
        title: 'Step 2: Upload Flow',
        alwaysAsk: "How do files get uploaded?",
        whyItMatters: "Large files need streaming upload, not buffering in memory.",
        expertBreakdown: {
          intro: "Upload flow:",
          points: [
            "Client → request upload URL",
            "Server → creates metadata, returns presigned S3 URL",
            "Client → uploads directly to S3 (streaming)",
            "S3 notifies server on completion"
          ]
        },
        icon: '📤',
        category: 'functional'
      }
    ],

    startSimple: {
      title: "Phase 1 Architecture",
      description: "Client → Server → Database (metadata) + S3 (files).",
      whySimple: "This works for basic cloud storage. We'll add sync and chunking later.",
      nextStepPreview: "Step 1: Set up the file upload flow"
    }
  },

  scaleFramework: {
    title: "What's Coming Next?",
    intro: "After Phase 1, the platform will evolve:",
    celebrationMessage: "Your basic file storage works!",
    hookMessage: "But files don't sync across devices. And uploading a 10GB file takes forever...",
    steps: [
      {
        id: 'sync',
        title: 'Phase 2: Sync',
        question: "How do files stay in sync across devices?",
        whyItMatters: "Edit on laptop, see on phone",
        example: "Sync protocol, change detection",
        icon: '🔄'
      },
      {
        id: 'chunking',
        title: 'Phase 3: Chunking',
        question: "How do we handle 10GB files efficiently?",
        whyItMatters: "Upload/download only what changed",
        example: "Block-level sync, deduplication",
        icon: '🧱'
      }
    ],
    nextStepsPreview: "First, let's build Phase 1!"
  }
};

// =============================================================================
// STEP 1: Connect Client to Server (Phase 1)
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📁',
  scenario: "Welcome to CloudSync! You're building the next Dropbox.",
  hook: "A user wants to back up their photos to the cloud. They open your app and... can't upload anything!",
  challenge: "Set up the basic system for file uploads.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your cloud storage is online!',
  achievement: 'Users can connect to your service',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can upload', after: 'Almost!' },
  ],
  nextTeaser: "But where do we store the files?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'File Storage Architecture Basics',
  conceptExplanation: `**The Key Insight: Separate Metadata from Content**

**Metadata (Small, Structured):**
- Filename, path, size, type
- Owner, permissions, timestamps
- Storage: Regular database

**File Content (Huge, Binary):**
- The actual file bytes
- Size: bytes to gigabytes
- Storage: Object storage (S3)

**Why Separate?**
| Aspect | Database | Object Storage |
|--------|----------|----------------|
| File size | ~1MB limit | 5TB+ |
| Query | Rich queries | Key-value only |
| Cost | Expensive | Cheap |
| Use case | Metadata | File content |

**API Design:**
\`\`\`
POST /files/upload-url    → Get presigned S3 URL
PUT  <presigned-url>      → Upload to S3 directly
POST /files/confirm       → Confirm upload complete
GET  /files/{id}/download → Get download URL
\`\`\``,

  whyItMatters: 'This separation is fundamental to all file storage services.',

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Storing billions of files',
    howTheyDoIt: 'Metadata in MySQL/PostgreSQL. File content in S3 (originally), now custom "Magic Pocket" storage.',
  },

  keyPoints: [
    'Metadata in database',
    'Files in object storage',
    'Direct upload to S3',
  ],

  keyConcepts: [
    { title: 'Metadata', explanation: 'Data about the file', icon: '📋' },
    { title: 'Object Storage', explanation: 'S3 for large files', icon: '🗄️' },
  ],
};

const step1: GuidedStep = {
  id: 'dropbox-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'FR-1: Upload files',
    taskDescription: 'Add Client and App Server for file operations',
    componentsNeeded: [
      { type: 'client', reason: 'User uploading files', displayName: 'CloudSync App' },
      { type: 'app_server', reason: 'Handles file metadata', displayName: 'File Service' },
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
    level2: 'Connect them together',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Add Database for Metadata (Phase 1)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💾',
  scenario: "Where do we track file information?",
  hook: "A user uploads 1000 photos. How do we know what files they have? What are the filenames? When were they uploaded? We need to track metadata!",
  challenge: "Add a database to store file metadata.",
  illustration: 'database',
};

const step2Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'File metadata stored!',
  achievement: 'We can track all user files',
  metrics: [
    { label: 'Metadata stored', after: '✓' },
    { label: 'File tracking', after: '✓' },
  ],
  nextTeaser: "Now let's add storage for the actual files...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'File Metadata Schema',
  conceptExplanation: `**What Goes in the Database?**

\`\`\`sql
CREATE TABLE files (
  id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  filename VARCHAR(255),
  path VARCHAR(1000),        -- /photos/vacation/
  size_bytes BIGINT,
  mime_type VARCHAR(100),
  storage_key VARCHAR(500),  -- S3 key
  checksum VARCHAR(64),      -- SHA-256 for integrity

  status VARCHAR(20),        -- uploading, active, deleted
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,

  INDEX (user_id, path),
  INDEX (user_id, status)
);

CREATE TABLE folders (
  id BIGINT PRIMARY KEY,
  user_id BIGINT,
  name VARCHAR(255),
  parent_id BIGINT,          -- NULL for root
  path VARCHAR(1000),        -- Materialized path
  created_at TIMESTAMP
);
\`\`\`

**Key Design Decisions:**
- **storage_key**: Points to S3 location
- **checksum**: Verifies file integrity
- **path**: Full path for navigation
- **status**: Tracks file lifecycle

**Folder Structure:**
\`\`\`
User's files:
├── Documents/
│   ├── report.pdf
│   └── notes.txt
└── Photos/
    ├── vacation/
    │   └── beach.jpg
    └── profile.jpg
\`\`\``,

  whyItMatters: 'The metadata schema enables browsing, searching, and organizing files.',

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Tracking billions of files',
    howTheyDoIt: 'MySQL for metadata. Heavily sharded by user_id. Edgestore for distributed metadata.',
  },

  keyPoints: [
    'Store filename, path, size',
    'storage_key points to S3',
    'Checksum for integrity',
  ],

  keyConcepts: [
    { title: 'Metadata', explanation: 'Info about files', icon: '📋' },
    { title: 'Storage Key', explanation: 'S3 location pointer', icon: '🔑' },
  ],
};

const step2: GuidedStep = {
  id: 'dropbox-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Store file metadata',
    taskDescription: 'Add Database for file metadata',
    componentsNeeded: [
      { type: 'database', reason: 'Store file metadata', displayName: 'Metadata DB' },
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
// STEP 3: Add Object Storage (Phase 1 Complete)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '📦',
  scenario: "We can track files, but where's the actual content?",
  hook: "A user uploads a 500MB video. We have the metadata (filename, size). But the actual video bytes? Nowhere to be found!",
  challenge: "Add object storage for file content.",
  illustration: 'object-storage',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 1 Complete! Basic file storage works!',
  achievement: 'Users can upload and download files',
  metrics: [
    { label: 'Upload files', after: '✓ Working' },
    { label: 'Download files', after: '✓ Working' },
    { label: 'Storage', after: 'S3' },
  ],
  nextTeaser: "But files don't sync across devices...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Direct Upload to Object Storage',
  conceptExplanation: `**The Upload Flow:**

**Bad Approach (Proxy through server):**
\`\`\`
Client → Server → S3
(Server buffers entire file = slow, expensive)
\`\`\`

**Good Approach (Direct upload):**
\`\`\`
1. Client → Server: "I want to upload report.pdf"
2. Server → Client: "Here's a presigned URL"
3. Client → S3: Upload directly using presigned URL
4. Client → Server: "Upload complete"
5. Server: Updates metadata status = 'active'
\`\`\`

**Presigned URL:**
\`\`\`python
def generate_upload_url(user_id, filename):
    storage_key = f"users/{user_id}/{uuid()}/{filename}"

    url = s3.generate_presigned_url(
        'put_object',
        Params={
            'Bucket': 'cloudsync-files',
            'Key': storage_key,
            'ContentType': 'application/octet-stream'
        },
        ExpiresIn=3600  # 1 hour
    )

    return {
        'upload_url': url,
        'storage_key': storage_key
    }
\`\`\`

**Download Flow:**
\`\`\`python
def get_download_url(file_id, user_id):
    file = db.get_file(file_id)
    if file.user_id != user_id:
        raise Forbidden()

    url = s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': 'cloudsync-files', 'Key': file.storage_key},
        ExpiresIn=3600
    )
    return url
\`\`\``,

  whyItMatters: 'Direct upload to S3 is essential for scalability. Server doesn\'t become bottleneck.',

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Handling petabytes of files',
    howTheyDoIt: 'Direct uploads to storage. Server only handles metadata and authorization.',
  },

  keyPoints: [
    'Direct upload to S3',
    'Presigned URLs for security',
    'Server handles metadata only',
  ],

  keyConcepts: [
    { title: 'Presigned URL', explanation: 'Time-limited upload/download URL', icon: '🔐' },
    { title: 'Direct Upload', explanation: 'Client → S3 directly', icon: '📤' },
  ],
};

const step3: GuidedStep = {
  id: 'dropbox-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1 & FR-2: Store and retrieve files',
    taskDescription: 'Add Object Storage for file content',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store file content', displayName: 'File Storage (S3)' },
    ],
    successCriteria: [
      'Object Storage added',
      'Direct upload path enabled',
      'Download URL generation works',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'client', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Add Object Storage for files',
    level2: 'Client uploads directly to S3 using presigned URL',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'client', to: 'object_storage' }],
  },
};

// =============================================================================
// PHASE 2: INTERMEDIATE - Sync & Versioning
// =============================================================================

// =============================================================================
// STEP 4: File Sync Protocol (Phase 2)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🔄',
  scenario: "Phase 2 begins! Users want files to sync across devices!",
  hook: "User edits a document on their laptop. They open their phone and... the old version! Files don't automatically sync between devices.",
  challenge: "NEW REQUIREMENT: FR-3 - Files sync across all user devices.",
  illustration: 'sync',
};

const step4Celebration: CelebrationContent = {
  emoji: '🔄',
  message: 'File sync is working!',
  achievement: 'Changes sync across devices',
  metrics: [
    { label: 'Sync', after: '✓ Working' },
    { label: 'Devices', after: 'All connected' },
  ],
  nextTeaser: "Now let's add file versioning...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'File Sync Protocol',

  frameworkReminder: {
    question: "How do files stay in sync?",
    connection: "FR-3 requires detecting changes and propagating them. This is the core of Dropbox."
  },

  conceptExplanation: `**The Sync Problem:**
\`\`\`
Laptop: Edit file → How does phone know?
Phone: Edit file → How does laptop know?
\`\`\`

**Solution: Change Tracking**

**1. Local Change Detection:**
\`\`\`python
# Watch for file changes
def on_file_changed(path):
    old_checksum = db.get_local_checksum(path)
    new_checksum = calculate_checksum(path)

    if old_checksum != new_checksum:
        queue_upload(path)
        db.update_local_checksum(path, new_checksum)
\`\`\`

**2. Server-Side Version Tracking:**
\`\`\`sql
CREATE TABLE file_versions (
  file_id BIGINT,
  version INT,
  storage_key VARCHAR(500),
  checksum VARCHAR(64),
  size_bytes BIGINT,
  modified_by_device VARCHAR(64),
  created_at TIMESTAMP,
  PRIMARY KEY (file_id, version)
);
\`\`\`

**3. Sync Protocol:**
\`\`\`
Client → Server: "What's changed since cursor X?"
Server → Client: [list of changes]
Client: Download changed files
Client → Server: "Cursor is now Y"
\`\`\`

**Cursor-Based Sync:**
\`\`\`python
def get_changes(user_id, cursor):
    # Cursor is a timestamp or sequence number
    changes = db.query("""
        SELECT * FROM file_changes
        WHERE user_id = ? AND created_at > ?
        ORDER BY created_at
        LIMIT 1000
    """, user_id, cursor)

    new_cursor = changes[-1].created_at if changes else cursor
    return {'changes': changes, 'cursor': new_cursor}
\`\`\``,

  whyItMatters: 'Sync is THE core feature of Dropbox. Getting it right is critical.',

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Syncing billions of files',
    howTheyDoIt: 'Delta sync protocol. Only uploads changed portions. Cursor-based change tracking.',
  },

  keyPoints: [
    'Detect local changes (checksum)',
    'Track server versions',
    'Cursor-based sync protocol',
  ],

  keyConcepts: [
    { title: 'Sync Cursor', explanation: 'Tracks sync position', icon: '📍' },
    { title: 'Checksum', explanation: 'Detects file changes', icon: '🔢' },
  ],
};

const step4: GuidedStep = {
  id: 'dropbox-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: File sync across devices',
    taskDescription: 'Implement sync protocol with change tracking',
    successCriteria: [
      'Detect local file changes',
      'Track server file versions',
      'Cursor-based change sync',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'client', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Track file versions and changes',
    level2: 'Checksum for change detection, cursor for sync position',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: File Versioning (Phase 2)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📜',
  scenario: "A user accidentally deleted important content!",
  hook: "User overwrites a crucial document. 'Can I get the old version back?!' Without versioning, changes are permanent. We need version history!",
  challenge: "NEW REQUIREMENT: FR-4 - Keep version history of files.",
  illustration: 'versioning',
};

const step5Celebration: CelebrationContent = {
  emoji: '📜',
  message: 'Version history working!',
  achievement: 'Users can restore previous versions',
  metrics: [
    { label: 'Versions kept', after: '30 days' },
    { label: 'Restore', after: '✓ Working' },
  ],
  nextTeaser: "Now let's add notifications for changes...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'File Version History',

  frameworkReminder: {
    question: "What if users need an older version?",
    connection: "FR-4 requires keeping history. Every change creates a new version."
  },

  conceptExplanation: `**Version Storage:**
\`\`\`
File: report.pdf
├── v1: Initial upload (2024-01-01)
├── v2: First edit (2024-01-05)
├── v3: Major revision (2024-01-10)
└── v4: Current (2024-01-15)
\`\`\`

**Data Model:**
\`\`\`sql
CREATE TABLE file_versions (
  id BIGINT PRIMARY KEY,
  file_id BIGINT,
  version_number INT,
  storage_key VARCHAR(500),   -- Different S3 key per version
  size_bytes BIGINT,
  checksum VARCHAR(64),
  created_at TIMESTAMP,
  created_by_device VARCHAR(64),
  change_type VARCHAR(20),    -- create, edit, rename

  UNIQUE (file_id, version_number)
);
\`\`\`

**On File Update:**
\`\`\`python
def update_file(file_id, new_content):
    file = db.get_file(file_id)

    # Get next version number
    latest_version = db.get_latest_version(file_id)
    new_version = latest_version.version_number + 1

    # Upload new version to different S3 key
    new_storage_key = f"{file.storage_key}.v{new_version}"
    s3.upload(new_storage_key, new_content)

    # Create version record
    db.create_version(
        file_id=file_id,
        version_number=new_version,
        storage_key=new_storage_key,
        checksum=calculate_checksum(new_content)
    )

    # Update file to point to latest version
    db.update_file(file_id, current_version=new_version)
\`\`\`

**Restore Version:**
\`\`\`python
def restore_version(file_id, version_number):
    version = db.get_version(file_id, version_number)
    # Create new version from old content
    update_file(file_id, s3.download(version.storage_key))
\`\`\`

**Retention Policy:**
\`\`\`python
# Keep versions for 30 days (configurable)
def cleanup_old_versions():
    cutoff = now() - timedelta(days=30)
    old_versions = db.query("""
        SELECT * FROM file_versions
        WHERE created_at < ?
        AND version_number < (SELECT MAX(version_number) FROM file_versions WHERE file_id = file_versions.file_id)
    """, cutoff)

    for version in old_versions:
        s3.delete(version.storage_key)
        db.delete_version(version.id)
\`\`\``,

  whyItMatters: 'Version history is a premium feature. Saves users from accidental data loss.',

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'File history',
    howTheyDoIt: '30-day version history (free), extended history (paid). Stores each version in S3.',
  },

  keyPoints: [
    'New S3 key per version',
    'Version number increments',
    'Retention policy for cleanup',
  ],

  keyConcepts: [
    { title: 'Version', explanation: 'Snapshot of file at point in time', icon: '📜' },
    { title: 'Retention', explanation: 'How long versions are kept', icon: '⏰' },
  ],
};

const step5: GuidedStep = {
  id: 'dropbox-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-4: File versioning',
    taskDescription: 'Implement version history',
    successCriteria: [
      'Store new version on each change',
      'Keep version history',
      'Allow restore to previous versions',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'client', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Create new version record on each update',
    level2: 'Different S3 key per version, track version_number',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Real-Time Notifications (Phase 2 Complete)
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔔',
  scenario: "Users want to know when files change!",
  hook: "User A updates a shared document. User B has it open on their laptop. They don't know it changed! We need real-time notifications.",
  challenge: "Add real-time sync notifications.",
  illustration: 'notifications',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 2 Complete! Sync & versioning working!',
  achievement: 'Files sync with version history and notifications',
  metrics: [
    { label: 'Sync', after: '✓ Real-time' },
    { label: 'Versioning', after: '✓ 30 days' },
    { label: 'Notifications', after: '✓ Instant' },
  ],
  nextTeaser: "Phase 3: Handling huge files efficiently...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Real-Time Sync Notifications',

  frameworkReminder: {
    question: "How do devices know when files change?",
    connection: "Polling is wasteful. Push notifications tell devices immediately when changes occur."
  },

  conceptExplanation: `**Options for Change Notification:**

**1. Polling (Wasteful)**
\`\`\`
Every 30 seconds: "Any changes?"
Usually: "No"
Wastes bandwidth and battery
\`\`\`

**2. Long Polling (Better)**
\`\`\`
Client: "Tell me when something changes" (holds connection)
Server: Waits until change occurs
Server: "Here's what changed"
Client: Reconnects immediately
\`\`\`

**3. WebSocket (Best)**
\`\`\`
Persistent connection
Server pushes changes instantly
\`\`\`

**Implementation:**
\`\`\`python
# Notification service
class SyncNotifier:
    def __init__(self):
        self.connections = {}  # user_id → [websockets]

    async def on_file_changed(self, user_id, file_id, change_type):
        # Get all connected devices for this user
        user_connections = self.connections.get(user_id, [])

        notification = {
            'type': 'file_changed',
            'file_id': file_id,
            'change_type': change_type,  # 'create', 'update', 'delete'
            'timestamp': now()
        }

        for ws in user_connections:
            await ws.send(json.dumps(notification))

# On file change
async def handle_file_upload(user_id, file_data):
    file = save_file(file_data)
    await notifier.on_file_changed(user_id, file.id, 'create')
\`\`\`

**Client Response:**
\`\`\`javascript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'file_changed') {
    // Fetch updated file metadata
    await syncFile(data.file_id);
  }
};
\`\`\``,

  whyItMatters: 'Real-time sync makes the service feel magical. Changes appear instantly.',

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Desktop client notifications',
    howTheyDoIt: 'Long polling with fallback. Notification server tells clients to sync.',
  },

  keyPoints: [
    'Push notifications on change',
    'WebSocket or long polling',
    'Client syncs on notification',
  ],

  keyConcepts: [
    { title: 'Push Notification', explanation: 'Server tells client about changes', icon: '🔔' },
    { title: 'Long Polling', explanation: 'HTTP connection waits for changes', icon: '⏳' },
  ],
};

const step6: GuidedStep = {
  id: 'dropbox-step-6',
  stepNumber: 6,
  frIndex: 2,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'NFR: Real-time sync',
    taskDescription: 'Add real-time change notifications',
    componentsNeeded: [
      { type: 'cache', reason: 'Pub/sub for notifications', displayName: 'Redis Pub/Sub' },
    ],
    successCriteria: [
      'Push notification on file change',
      'Client receives and syncs',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'client', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Add Redis for pub/sub notifications',
    level2: 'Publish change events, clients subscribe',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// PHASE 3: ADVANCED - Chunking & Deduplication
// =============================================================================

// =============================================================================
// STEP 7: File Chunking (Phase 3)
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🧱',
  scenario: "Phase 3 begins! Large files are a NIGHTMARE!",
  hook: "User uploads a 10GB video. It takes 2 hours. Halfway through, their connection drops. They have to START OVER! And tiny edits re-upload the entire file!",
  challenge: "Implement file chunking for efficient uploads.",
  illustration: 'chunking',
};

const step7Celebration: CelebrationContent = {
  emoji: '🧱',
  message: 'Chunking is working!',
  achievement: 'Large files upload efficiently with resume support',
  metrics: [
    { label: 'Chunk size', after: '4MB' },
    { label: 'Resume upload', after: '✓ Working' },
  ],
  nextTeaser: "Now let's add deduplication...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Block-Level Chunking',

  frameworkReminder: {
    question: "How do we handle 10GB files?",
    connection: "Split into chunks! Upload/download only what's needed. Resume on failure."
  },

  conceptExplanation: `**The Problem:**
\`\`\`
10GB file as single upload:
- 2+ hours on typical connection
- Connection drops = restart from zero
- Small edit = re-upload entire file
\`\`\`

**Solution: Chunking**
\`\`\`
10GB file split into 2500 chunks (4MB each):
- Upload chunks in parallel
- Failed chunk = retry just that chunk
- Edit = upload only changed chunks
\`\`\`

**Chunking Algorithm:**
\`\`\`python
CHUNK_SIZE = 4 * 1024 * 1024  # 4MB

def chunk_file(filepath):
    chunks = []
    with open(filepath, 'rb') as f:
        chunk_number = 0
        while True:
            data = f.read(CHUNK_SIZE)
            if not data:
                break

            checksum = hashlib.sha256(data).hexdigest()
            chunks.append({
                'number': chunk_number,
                'size': len(data),
                'checksum': checksum,
                'data': data
            })
            chunk_number += 1

    return chunks
\`\`\`

**Upload Flow:**
\`\`\`python
def upload_file_chunked(filepath):
    chunks = chunk_file(filepath)

    # 1. Initiate multipart upload
    file_id = api.create_file(filename, len(chunks))

    # 2. Upload each chunk (parallel)
    for chunk in chunks:
        upload_url = api.get_chunk_upload_url(file_id, chunk['number'])
        s3.upload_part(upload_url, chunk['data'])

    # 3. Complete upload
    api.complete_upload(file_id)
\`\`\`

**Data Model:**
\`\`\`sql
CREATE TABLE file_chunks (
  file_id BIGINT,
  chunk_number INT,
  checksum VARCHAR(64),
  storage_key VARCHAR(500),
  size_bytes INT,
  PRIMARY KEY (file_id, chunk_number)
);
\`\`\`

**Resumable Upload:**
\`\`\`python
def resume_upload(file_id, filepath):
    # Get already uploaded chunks
    uploaded = api.get_uploaded_chunks(file_id)
    uploaded_numbers = {c['number'] for c in uploaded}

    # Upload missing chunks only
    chunks = chunk_file(filepath)
    for chunk in chunks:
        if chunk['number'] not in uploaded_numbers:
            upload_chunk(file_id, chunk)
\`\`\``,

  whyItMatters: 'Chunking is THE innovation that makes Dropbox work. Block-level sync is magic.',

  famousIncident: {
    title: 'Dropbox Block-Level Sync',
    company: 'Dropbox',
    year: '2008',
    whatHappened: 'Dropbox introduced block-level sync. Edit a 1GB file, only changed blocks upload. Revolutionary.',
    lessonLearned: 'Chunking enables efficient sync of large files.',
    icon: '🧱',
  },

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Syncing large files',
    howTheyDoIt: '4MB chunks. Content-defined chunking (CDC) for smarter boundaries. Only sync changed blocks.',
  },

  keyPoints: [
    'Split files into 4MB chunks',
    'Upload chunks in parallel',
    'Resume by uploading missing chunks',
  ],

  keyConcepts: [
    { title: 'Chunk', explanation: '4MB block of file', icon: '🧱' },
    { title: 'Resumable Upload', explanation: 'Continue from where you left off', icon: '⏯️' },
  ],
};

const step7: GuidedStep = {
  id: 'dropbox-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'NFR: Efficient large file handling',
    taskDescription: 'Implement file chunking',
    successCriteria: [
      'Split files into chunks',
      'Upload chunks in parallel',
      'Support resumable uploads',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'client', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Split files into 4MB chunks',
    level2: 'Track chunks in database, upload to S3 in parallel',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Deduplication (Phase 3)
// =============================================================================

const step8Story: StoryContent = {
  emoji: '♻️',
  scenario: "Storage costs are exploding!",
  hook: "10,000 users upload the same popular PDF. You're storing 10,000 copies! And users who copy files within their account double storage usage.",
  challenge: "Implement deduplication to save storage.",
  illustration: 'deduplication',
};

const step8Celebration: CelebrationContent = {
  emoji: '♻️',
  message: 'Deduplication is working!',
  achievement: 'Duplicate content stored only once',
  metrics: [
    { label: 'Storage saved', after: '~50%' },
    { label: 'Duplicate detection', after: '✓ Content-based' },
  ],
  nextTeaser: "Now let's add load balancing...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Content-Addressable Deduplication',

  frameworkReminder: {
    question: "Why store the same content twice?",
    connection: "If chunk A and chunk B have the same checksum, they're identical. Store once, reference twice."
  },

  conceptExplanation: `**The Problem:**
\`\`\`
User 1 uploads: video.mp4 (5GB)
User 2 uploads: same_video.mp4 (5GB)
Without dedup: 10GB stored
With dedup: 5GB stored (50% savings!)
\`\`\`

**Content-Addressable Storage:**
\`\`\`
Chunk checksum = storage key
If checksum exists → reuse, don't upload
\`\`\`

**Implementation:**
\`\`\`python
def upload_chunk_deduped(chunk_data):
    # Calculate content hash
    checksum = hashlib.sha256(chunk_data).hexdigest()

    # Check if chunk already exists
    existing = db.get_chunk_by_checksum(checksum)
    if existing:
        # Chunk already stored! Just reference it
        return existing.storage_key

    # New chunk - upload to S3
    storage_key = f"chunks/{checksum}"
    s3.upload(storage_key, chunk_data)

    # Record in chunk store
    db.create_chunk(checksum=checksum, storage_key=storage_key)

    return storage_key
\`\`\`

**Data Model:**
\`\`\`sql
-- Global chunk store (content-addressable)
CREATE TABLE chunks (
  checksum VARCHAR(64) PRIMARY KEY,
  storage_key VARCHAR(500),
  size_bytes INT,
  reference_count INT,  -- How many files use this chunk
  created_at TIMESTAMP
);

-- File-to-chunk mapping
CREATE TABLE file_chunks (
  file_id BIGINT,
  chunk_index INT,
  chunk_checksum VARCHAR(64),  -- References chunks table
  PRIMARY KEY (file_id, chunk_index),
  FOREIGN KEY (chunk_checksum) REFERENCES chunks(checksum)
);
\`\`\`

**Reference Counting:**
\`\`\`python
def delete_file(file_id):
    chunks = db.get_file_chunks(file_id)
    for chunk in chunks:
        db.decrement_chunk_reference(chunk.checksum)
        if db.get_chunk_reference_count(chunk.checksum) == 0:
            # No more references - safe to delete
            s3.delete(chunk.storage_key)
            db.delete_chunk(chunk.checksum)
\`\`\``,

  whyItMatters: 'Deduplication can save 50%+ storage costs. Essential at scale.',

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Storing exabytes of data',
    howTheyDoIt: 'Block-level deduplication. Same chunk = same checksum = stored once. Saved billions in storage.',
  },

  keyPoints: [
    'Hash chunk content',
    'Same hash = same content',
    'Store once, reference many times',
  ],

  keyConcepts: [
    { title: 'Deduplication', explanation: 'Eliminate duplicate storage', icon: '♻️' },
    { title: 'Content-Addressable', explanation: 'Content hash = address', icon: '🔢' },
  ],
};

const step8: GuidedStep = {
  id: 'dropbox-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'NFR: Efficient storage',
    taskDescription: 'Implement chunk deduplication',
    successCriteria: [
      'Check if chunk exists by checksum',
      'Reuse existing chunks',
      'Reference counting for cleanup',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'client', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Use checksum as chunk identifier',
    level2: 'Check existence before upload, reference count for cleanup',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 9: Load Balancing (Phase 3 Complete)
// =============================================================================

const step9Story: StoryContent = {
  emoji: '⚖️',
  scenario: "Your service is getting popular!",
  hook: "1 million users syncing files. One server can't handle the metadata queries. We need horizontal scaling!",
  challenge: "Add load balancing for scale.",
  illustration: 'load-balancer',
};

const step9Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 3 Complete! Efficient file storage!',
  achievement: 'Chunking, deduplication, and horizontal scale',
  metrics: [
    { label: 'Chunking', after: '4MB blocks' },
    { label: 'Deduplication', after: '~50% savings' },
    { label: 'Scale', after: 'Horizontally' },
  ],
  nextTeaser: "Phase 4: Conflict resolution and sharing!",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Scaling File Sync Service',

  frameworkReminder: {
    question: "How do we handle millions of users?",
    connection: "Load balancer distributes traffic. Stateless servers enable horizontal scaling."
  },

  conceptExplanation: `**Architecture at Scale:**
\`\`\`
Clients → Load Balancer → API Servers (stateless)
                              ↓
                         Database (sharded by user)
                              ↓
                         S3 (chunked files)
\`\`\`

**Stateless API Servers:**
\`\`\`python
# Each request is independent
# No session state on server
# Any server can handle any request

@app.route('/files/<file_id>')
def get_file(file_id):
    # Auth from token (not session)
    user_id = verify_jwt(request.headers['Authorization'])

    # Query database (not local state)
    file = db.get_file(file_id, user_id)

    return file
\`\`\`

**Database Sharding:**
\`\`\`
Shard by user_id:
- User 1-1M → Shard 1
- User 1M-2M → Shard 2
- ...

All files for a user are on same shard
Cross-user queries are rare
\`\`\`

**Metadata Caching:**
\`\`\`python
def get_file_metadata(file_id):
    # Check cache first
    cached = redis.get(f"file:{file_id}")
    if cached:
        return json.loads(cached)

    # Cache miss - query DB
    file = db.get_file(file_id)
    redis.setex(f"file:{file_id}", 300, json.dumps(file))

    return file
\`\`\``,

  whyItMatters: 'Horizontal scaling is essential for millions of users.',

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Serving 700M users',
    howTheyDoIt: 'Stateless services. MySQL sharded by user. Extensive caching. CDN for downloads.',
  },

  keyPoints: [
    'Stateless servers',
    'Database sharding by user',
    'Aggressive caching',
  ],

  keyConcepts: [
    { title: 'Stateless', explanation: 'No server-side session', icon: '🔄' },
    { title: 'Sharding', explanation: 'Partition database by user', icon: '🗂️' },
  ],
};

const step9: GuidedStep = {
  id: 'dropbox-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'NFR: Handle millions of users',
    taskDescription: 'Add load balancer',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Add Load Balancer',
      'Stateless API servers',
      'Database caching',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'client', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Add LB between clients and servers',
    level2: 'Stateless servers, shard DB by user',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// PHASE 4: EXPERT - Conflicts & Sharing
// =============================================================================

// =============================================================================
// STEP 10: Conflict Resolution (Phase 4)
// =============================================================================

const step10Story: StoryContent = {
  emoji: '⚔️',
  scenario: "Phase 4 begins! CONFLICTS are happening!",
  hook: "User edits file on laptop (offline). User edits SAME file on phone (offline). Both come online and sync. Which version wins?!",
  challenge: "Implement conflict resolution.",
  illustration: 'conflict',
};

const step10Celebration: CelebrationContent = {
  emoji: '⚔️',
  message: 'Conflict resolution working!',
  achievement: 'No data loss on conflicting edits',
  metrics: [
    { label: 'Conflicts', after: 'Detected' },
    { label: 'Resolution', after: 'Keep both versions' },
  ],
  nextTeaser: "Now let's add file sharing...",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Sync Conflict Resolution',

  frameworkReminder: {
    question: "What happens when two devices edit the same file offline?",
    connection: "Conflicts are inevitable with offline editing. We need a resolution strategy."
  },

  conceptExplanation: `**The Conflict Scenario:**
\`\`\`
Time 0: File v1 on server
Time 1: Device A goes offline, edits file → v2a
Time 2: Device B goes offline, edits file → v2b
Time 3: Device A comes online, uploads v2a → server has v2a
Time 4: Device B comes online, tries to upload v2b
        💥 CONFLICT! Base version v1 doesn't match server v2a
\`\`\`

**Detection:**
\`\`\`python
def upload_file_changes(file_id, base_version, new_content):
    current_version = db.get_current_version(file_id)

    if current_version != base_version:
        # Conflict! Server has changed since we started editing
        raise ConflictError(
            your_version=new_content,
            server_version=current_version
        )

    # No conflict - proceed with upload
    create_new_version(file_id, new_content)
\`\`\`

**Resolution Strategies:**

**1. Last Write Wins (Simple, lossy)**
\`\`\`
Just accept the latest upload
Problem: Overwrites other person's work
\`\`\`

**2. Keep Both (Dropbox approach)**
\`\`\`
Original:    report.docx
Conflict:    report (conflicted copy from John's laptop).docx

Both files exist, user decides what to keep
\`\`\`

**3. Three-Way Merge (Git-like)**
\`\`\`
For text files:
- Find common ancestor
- Auto-merge non-conflicting changes
- Mark conflicts for manual resolution
\`\`\`

**Implementation:**
\`\`\`python
def handle_conflict(file_id, local_content, base_version):
    server_content = get_server_version(file_id)

    # Create conflict copy
    original_name = file.name
    conflict_name = f"{original_name} (conflicted copy from {device_name} {timestamp})"

    # Upload local version as separate file
    create_file(
        user_id=file.user_id,
        name=conflict_name,
        parent_id=file.parent_id,
        content=local_content
    )

    # Download server version to local
    download_file(file_id)

    # Notify user of conflict
    notify_user(f"Conflict detected: {original_name}")
\`\`\``,

  whyItMatters: 'Conflicts are inevitable. Good resolution ensures no data loss.',

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Handling edit conflicts',
    howTheyDoIt: 'Creates "conflicted copy" files. User sees both versions. No data lost.',
  },

  keyPoints: [
    'Detect via version mismatch',
    'Keep both versions',
    'Let user resolve',
  ],

  keyConcepts: [
    { title: 'Conflict', explanation: 'Concurrent edits to same file', icon: '⚔️' },
    { title: 'Conflicted Copy', explanation: 'Duplicate with conflict marker', icon: '📋' },
  ],
};

const step10: GuidedStep = {
  id: 'dropbox-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'NFR: Handle sync conflicts',
    taskDescription: 'Implement conflict detection and resolution',
    successCriteria: [
      'Detect version conflicts',
      'Create conflicted copies',
      'No data loss',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'client', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Check version on upload',
    level2: 'If mismatch, create conflicted copy instead of overwriting',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 11: File Sharing (Phase 4)
// =============================================================================

const step11Story: StoryContent = {
  emoji: '🔗',
  scenario: "Users want to share files with others!",
  hook: "User wants to send a 500MB video to a friend. Email attachment limit is 25MB. They need a share link!",
  challenge: "Implement file and folder sharing.",
  illustration: 'sharing',
};

const step11Celebration: CelebrationContent = {
  emoji: '🔗',
  message: 'Sharing is working!',
  achievement: 'Users can share files via links and permissions',
  metrics: [
    { label: 'Share links', after: '✓ Working' },
    { label: 'Permissions', after: 'View/Edit' },
  ],
  nextTeaser: "One final step: global distribution!",
};

const step11LearnPhase: TeachingContent = {
  conceptTitle: 'File Sharing',

  frameworkReminder: {
    question: "How do users share files?",
    connection: "Two methods: share links (public) and direct sharing (specific users)."
  },

  conceptExplanation: `**Sharing Methods:**

**1. Share Links (Anyone with link)**
\`\`\`python
def create_share_link(file_id, user_id):
    # Verify ownership
    file = db.get_file(file_id)
    if file.user_id != user_id:
        raise Forbidden()

    # Generate unique link token
    token = secrets.token_urlsafe(32)

    # Create share record
    db.create_share_link(
        file_id=file_id,
        token=token,
        permission='view',  # or 'edit'
        expires_at=None,  # or specific date
        password=None  # optional
    )

    return f"https://cloudsync.com/s/{token}"
\`\`\`

**2. Direct Sharing (Specific users)**
\`\`\`sql
CREATE TABLE file_shares (
  file_id BIGINT,
  shared_with_user_id BIGINT,
  permission VARCHAR(20),  -- 'view', 'edit', 'owner'
  shared_by_user_id BIGINT,
  created_at TIMESTAMP,
  PRIMARY KEY (file_id, shared_with_user_id)
);
\`\`\`

**Access Control:**
\`\`\`python
def check_access(file_id, user_id, required_permission):
    # Check ownership
    file = db.get_file(file_id)
    if file.user_id == user_id:
        return True

    # Check direct share
    share = db.get_share(file_id, user_id)
    if share:
        if required_permission == 'view':
            return True
        if required_permission == 'edit' and share.permission == 'edit':
            return True

    # Check folder inheritance
    parent_access = check_folder_access(file.parent_id, user_id)
    if parent_access:
        return True

    return False
\`\`\`

**Shared With Me View:**
\`\`\`sql
SELECT f.* FROM files f
JOIN file_shares fs ON f.id = fs.file_id
WHERE fs.shared_with_user_id = ?
ORDER BY fs.created_at DESC;
\`\`\``,

  whyItMatters: 'Sharing is what makes cloud storage collaborative and viral.',

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'File sharing',
    howTheyDoIt: 'Share links with optional passwords and expiration. Direct sharing with view/edit/owner permissions.',
  },

  keyPoints: [
    'Share links for public access',
    'Direct sharing for specific users',
    'Permission inheritance from folders',
  ],

  keyConcepts: [
    { title: 'Share Link', explanation: 'URL for anonymous access', icon: '🔗' },
    { title: 'Permission', explanation: 'View, edit, or owner', icon: '🔐' },
  ],
};

const step11: GuidedStep = {
  id: 'dropbox-step-11',
  stepNumber: 11,
  frIndex: 0,

  story: step11Story,
  learnPhase: step11LearnPhase,

  practicePhase: {
    frText: 'NFR: File sharing',
    taskDescription: 'Implement sharing with links and permissions',
    successCriteria: [
      'Generate share links',
      'Direct sharing with permissions',
      'Access control checks',
    ],
  },

  celebration: step11Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'client', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Create share links and permission records',
    level2: 'Token-based links, permission checks on every access',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 12: Multi-Region (Phase 4 Complete)
// =============================================================================

const step12Story: StoryContent = {
  emoji: '🌍',
  scenario: "CloudSync is going global!",
  hook: "Users in Asia complain about slow uploads. Data must stay in EU for GDPR. We need regional infrastructure!",
  challenge: "Deploy multi-region architecture.",
  illustration: 'multi-region',
};

const step12Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You\'ve mastered Dropbox system design!',
  achievement: 'From basic storage to global file sync platform',
  metrics: [
    { label: 'Files stored', after: 'Billions' },
    { label: 'Storage efficiency', after: 'Deduped + chunked' },
    { label: 'Global regions', after: 'Multi-region' },
    { label: 'Features', after: 'Sync, Share, Version' },
  ],
  nextTeaser: "You've completed the Dropbox journey!",
};

const step12LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Region File Storage',

  frameworkReminder: {
    question: "How do we serve users globally?",
    connection: "Regional storage for latency. Data residency for compliance. Replication for reliability."
  },

  conceptExplanation: `**Challenges:**
- Latency: Upload from Asia to US-East is slow
- Compliance: EU data must stay in EU (GDPR)
- Reliability: Region outages shouldn't lose data

**Multi-Region Architecture:**
\`\`\`
US Region:
  [LB] → [API] → [Metadata DB Primary] → [S3 US]

EU Region:
  [LB] → [API] → [Metadata DB Replica] → [S3 EU]

APAC Region:
  [LB] → [API] → [Metadata DB Replica] → [S3 APAC]
\`\`\`

**User Data Residency:**
\`\`\`sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  email VARCHAR(255),
  home_region VARCHAR(20),  -- 'us', 'eu', 'apac'
  ...
);
\`\`\`

**File Storage by Region:**
\`\`\`python
def get_upload_region(user_id):
    user = db.get_user(user_id)
    return user.home_region

def upload_file(user_id, file_data):
    region = get_upload_region(user_id)
    s3_bucket = S3_BUCKETS[region]  # e.g., 'cloudsync-files-eu'
    # Upload to user's home region
    s3.upload(s3_bucket, key, file_data)
\`\`\`

**Cross-Region Sync (for sharing):**
\`\`\`
User A (US) shares with User B (EU):
Option 1: User B downloads from US S3 (slower)
Option 2: Replicate to EU S3 on first access (cached)
\`\`\`

**CDN for Downloads:**
\`\`\`
User → CDN Edge → S3 (if not cached)
CDN caches frequently accessed files globally
\`\`\``,

  whyItMatters: 'Global presence requires regional architecture. Compliance makes it mandatory.',

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Global operations',
    howTheyDoIt: 'S3 for storage (multiple regions). EU data stays in EU. Magic Pocket for their own storage system.',
  },

  keyPoints: [
    'Store in user\'s home region',
    'Comply with data residency',
    'CDN for global downloads',
  ],

  keyConcepts: [
    { title: 'Data Residency', explanation: 'Data stays in specified region', icon: '📍' },
    { title: 'Multi-Region', explanation: 'Infrastructure in multiple regions', icon: '🌍' },
  ],
};

const step12: GuidedStep = {
  id: 'dropbox-step-12',
  stepNumber: 12,
  frIndex: 0,

  story: step12Story,
  learnPhase: step12LearnPhase,

  practicePhase: {
    frText: 'NFR: Global scale',
    taskDescription: 'Design multi-region architecture',
    componentsNeeded: [
      { type: 'cdn', reason: 'Global download acceleration', displayName: 'CDN' },
    ],
    successCriteria: [
      'Regional storage based on user location',
      'Data residency compliance',
      'CDN for global downloads',
    ],
  },

  celebration: step12Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
  },

  hints: {
    level1: 'Add CDN and plan regional S3 buckets',
    level2: 'Store in home region, CDN for global access',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [
      { from: 'cdn', to: 'object_storage' },
      { from: 'client', to: 'cdn' },
    ],
  },
};

// =============================================================================
// EXPORT THE COMPLETE PROGRESSIVE TUTORIAL
// =============================================================================

export const dropboxProgressiveGuidedTutorial: GuidedTutorial = {
  problemId: 'dropbox-progressive',
  title: 'Design Dropbox',
  description: 'Build an evolving file storage and sync platform from basic upload to global-scale sync',
  difficulty: 'beginner',
  estimatedMinutes: 90,

  welcomeStory: {
    emoji: '📁',
    hook: "Welcome to CloudSync! You're building the next Dropbox.",
    scenario: "Your journey: Start with basic file upload, add sync and versioning, implement chunking and deduplication, and build a globally distributed file platform.",
    challenge: "Can you build a file sync service that handles billions of files efficiently?",
  },

  requirementsPhase: phase1Requirements,

  steps: [
    step1, step2, step3,
    step4, step5, step6,
    step7, step8, step9,
    step10, step11, step12,
  ],

  concepts: [
    'Metadata vs Content Storage',
    'Presigned URLs',
    'Direct Upload to S3',
    'File Sync Protocol',
    'Version History',
    'Real-Time Notifications',
    'File Chunking',
    'Content-Addressable Deduplication',
    'Horizontal Scaling',
    'Conflict Resolution',
    'File Sharing',
    'Multi-Region Architecture',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, Maintainable Applications',
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 12: The Future of Data Systems',
  ],
};

export default dropboxProgressiveGuidedTutorial;
