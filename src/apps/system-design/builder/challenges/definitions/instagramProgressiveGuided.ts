import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Instagram - Progressive Tutorial (4 Phases)
 *
 * A single evolving tutorial that grows from beginner → intermediate → advanced → expert.
 * Focus: Media handling (photos), object storage, CDN, and feed generation.
 *
 * PHASE 1 - BEGINNER (Steps 1-3):
 * - FR-1: Upload photos
 * - FR-2: View photos
 * - Build: Client → Server → Database + Object Storage
 *
 * PHASE 2 - INTERMEDIATE (Steps 4-6):
 * - FR-3: Follow users
 * - FR-4: Personalized feed
 * - Build: Follow graph, feed generation, caching
 *
 * PHASE 3 - ADVANCED (Steps 7-9):
 * - FR-5: Like and comment
 * - NFR: Handle 350K reads/sec
 * - Build: CDN for images, load balancing, async processing
 *
 * PHASE 4 - EXPERT (Steps 10-12):
 * - Explore/Discovery
 * - Image processing pipeline
 * - Global scale
 *
 * Key Teaching: Media handling is fundamentally different from text.
 * Object storage + CDN is essential for photo/video platforms.
 */

// =============================================================================
// PHASE 1: BEGINNER REQUIREMENTS (Steps 1-3)
// =============================================================================

const phase1Requirements: RequirementsGatheringContent = {
  problemStatement: "Design a photo-sharing platform like Instagram",

  interviewer: {
    name: 'Emily Rodriguez',
    role: 'Product Manager at PhotoShare',
    avatar: '👩‍💼',
  },

  questions: [
    {
      id: 'upload-photos',
      category: 'functional',
      question: "What's the main thing users want to do?",
      answer: "Users want to upload and share photos! They take a photo, add a caption, and post it for others to see.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Photo sharing is the core feature",
    },
    {
      id: 'view-photos',
      category: 'functional',
      question: "How do users see photos?",
      answer: "Users can view photos on a profile page. For now, let's just show all photos (like a public gallery). We'll add personalized feeds later.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Start with simple gallery view",
    },
  ],

  minimumQuestionsRequired: 2,
  criticalQuestionIds: ['upload-photos', 'view-photos'],
  criticalFRQuestionIds: ['upload-photos', 'view-photos'],
  criticalScaleQuestionIds: [],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can upload photos',
      description: 'Share photos with captions',
      emoji: '📷',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can view photos',
      description: 'See photos in a gallery view',
      emoji: '🖼️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10,000',
    writesPerDay: '10,000 photos',
    readsPerDay: '100,000 views',
    peakMultiplier: 2,
    readWriteRatio: '10:1',
    calculatedWriteRPS: { average: 0.1, peak: 0.5 },
    calculatedReadRPS: { average: 1, peak: 5 },
    maxPayloadSize: '~2MB (photo)',
    storagePerRecord: '~2MB',
    storageGrowthPerYear: '~7TB',
    redirectLatencySLA: 'p99 < 1s',
    createLatencySLA: 'p99 < 3s',
  },

  architecturalImplications: [
    '✅ Low volume → Simple architecture works',
    '✅ Photos need OBJECT STORAGE (not database!)',
    '✅ Database stores metadata, S3 stores images',
  ],

  outOfScope: [
    'Following system (Phase 2)',
    'Feed generation (Phase 2)',
    'Likes and comments (Phase 3)',
    'Image processing/filters (Phase 4)',
  ],

  keyInsight: "KEY INSIGHT: Photos are BIG (2MB each). You can't store them in a database! Use Object Storage (S3) for images, Database for metadata. This is the #1 mistake in photo platform design.",

  thinkingFramework: {
    title: "Phase 1: Photo Upload Basics",
    intro: "Photos are fundamentally different from text. Let's learn about object storage.",

    steps: [
      {
        id: 'photo-vs-text',
        title: 'Step 1: Photos ≠ Text',
        alwaysAsk: "Can we store photos in a database?",
        whyItMatters: "Photos are HUGE (2MB). Databases are for structured data (KB). Wrong storage = disaster.",
        expertBreakdown: {
          intro: "The key insight:",
          points: [
            "Tweet: ~280 bytes",
            "Photo: ~2,000,000 bytes (2MB)",
            "Photos are 10,000x bigger than tweets!",
            "Database = metadata, Object Storage = files"
          ]
        },
        icon: '📷',
        category: 'functional'
      },
      {
        id: 'what-store-where',
        title: 'Step 2: What Goes Where?',
        alwaysAsk: "What do we store in each system?",
        whyItMatters: "Correct separation is critical for performance and cost.",
        expertBreakdown: {
          intro: "Two storage systems:",
          points: [
            "Database: post_id, user_id, caption, image_url, created_at",
            "Object Storage (S3): The actual image file",
            "image_url points to S3 location",
            "Never store blobs in relational DB!"
          ]
        },
        icon: '💾',
        category: 'data-flow'
      }
    ],

    startSimple: {
      title: "Phase 1 Architecture",
      description: "Client → App Server → Database (metadata) + S3 (images)",
      whySimple: "This separates concerns correctly. Metadata queries stay fast, images served from object storage.",
      nextStepPreview: "Step 1: Set up the upload flow"
    }
  },

  scaleFramework: {
    title: "What's Coming Next?",
    intro: "After Phase 1, the platform will evolve:",
    celebrationMessage: "Your basic photo sharing works!",
    hookMessage: "But users only see ALL photos. They want to follow specific people...",
    steps: [
      {
        id: 'following',
        title: 'Phase 2: Following & Feed',
        question: "How do users see only their friends' photos?",
        whyItMatters: "Following creates personalized feeds",
        example: "Follow graph + feed generation",
        icon: '👥'
      },
      {
        id: 'cdn',
        title: 'Phase 3: Speed with CDN',
        question: "How do we serve images fast globally?",
        whyItMatters: "S3 in one region = slow for global users",
        example: "CDN caches images at edge locations",
        icon: '🌐'
      }
    ],
    nextStepsPreview: "First, let's build Phase 1!"
  }
};

// =============================================================================
// STEP 1: Connect Client to Server (Phase 1)
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📷',
  scenario: "Welcome to PhotoShare! You're building the next Instagram.",
  hook: "Your first user just signed up and wants to share a photo of their lunch. But there's no way to upload anything!",
  challenge: "Set up the basic system so users can send requests to your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server is online!',
  achievement: 'Users can now connect to your system',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Ready for uploads', after: '✓' },
  ],
  nextTeaser: "But where do we store the photos?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Client-Server Architecture',
  conceptExplanation: `Every web app starts with a Client connecting to a Server.

**For a photo app:**
1. User opens the app (Client)
2. Selects a photo to upload
3. App sends photo to your Server
4. Server stores it somewhere
5. Server returns success

The big question: WHERE do we store the photos?`,

  whyItMatters: 'This is the foundation. But photo apps have a unique challenge: large file handling.',

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Handling 100M photo uploads/day',
    howTheyDoIt: 'Multiple upload endpoints with specialized handling for large files.',
  },

  keyPoints: [
    'Client = user\'s phone/browser',
    'Server = your backend',
    'Photos are BIG - special handling needed',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'User\'s device', icon: '📱' },
    { title: 'Server', explanation: 'Your backend', icon: '🖥️' },
  ],
};

const step1: GuidedStep = {
  id: 'instagram-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can upload photos',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Users uploading photos', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles photo uploads', displayName: 'Photo Service' },
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
// STEP 2: Add Object Storage for Photos (Phase 1)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💾',
  scenario: "A user uploaded a 2MB photo. Where should we store it?",
  hook: "Your first instinct might be 'store it in the database!' But that's a HUGE mistake. Let's learn why.",
  challenge: "Photos are too big for databases. We need OBJECT STORAGE.",
  illustration: 'storage-decision',
};

const step2Celebration: CelebrationContent = {
  emoji: '☁️',
  message: 'Object storage is configured!',
  achievement: 'Photos stored in S3, metadata in database',
  metrics: [
    { label: 'Photo storage', after: 'Object Storage (S3)' },
    { label: 'Metadata storage', after: 'Database' },
    { label: 'Separation', after: '✓ Correct' },
  ],
  nextTeaser: "Now let's implement the upload flow...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage vs Database',
  conceptExplanation: `**THE MOST IMPORTANT LESSON FOR MEDIA APPS:**

**Database (PostgreSQL/MySQL):**
- Designed for: Structured data (rows, columns)
- Optimized for: Queries, joins, transactions
- Record size: KB (kilobytes)
- Cost: Expensive per GB

**Object Storage (S3/GCS):**
- Designed for: Files (any size, any type)
- Optimized for: Storing and retrieving blobs
- File size: KB to TB
- Cost: Cheap per GB

**For Instagram:**
\`\`\`
Database stores:
- post_id, user_id, caption, created_at
- image_url: "s3://bucket/photos/abc123.jpg"

Object Storage stores:
- The actual 2MB image file
\`\`\`

**Why NOT store images in database?**
- 100M photos × 2MB = 200TB in database
- Database queries become slow
- Backups take forever
- Cost is 10x higher`,

  whyItMatters: 'Storing photos in a database is the #1 mistake in photo platform design. It will kill your performance and wallet.',

  famousIncident: {
    title: 'The Blob Storage Anti-Pattern',
    company: 'Many Startups',
    year: 'Ongoing',
    whatHappened: 'Countless startups store images in PostgreSQL as BYTEA. As they grow, database becomes unusable - slow queries, huge backups, massive costs.',
    lessonLearned: 'NEVER store large files in relational databases. Use object storage.',
    icon: '💸',
  },

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Storing 2 billion photos',
    howTheyDoIt: 'S3 for image files, Cassandra for metadata. Complete separation.',
  },

  keyPoints: [
    'Database = metadata (small, structured)',
    'Object Storage = files (large, binary)',
    'NEVER store blobs in SQL database',
  ],

  keyConcepts: [
    { title: 'Object Storage', explanation: 'S3, GCS - for files', icon: '☁️' },
    { title: 'Metadata', explanation: 'Data ABOUT the photo', icon: '📋' },
  ],
};

const step2: GuidedStep = {
  id: 'instagram-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Store photos correctly',
    taskDescription: 'Add Database (metadata) and Object Storage (photos)',
    componentsNeeded: [
      { type: 'database', reason: 'Store post metadata', displayName: 'Posts DB' },
      { type: 'object_storage', reason: 'Store actual photo files', displayName: 'S3 Bucket' },
    ],
    successCriteria: [
      'Database added (for metadata)',
      'Object Storage added (for photos)',
      'App Server connected to both',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Add Database AND Object Storage',
    level2: 'Database for metadata, Object Storage (S3) for images',
    solutionComponents: [{ type: 'database' }, { type: 'object_storage' }],
    solutionConnections: [
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'object_storage' },
    ],
  },
};

// =============================================================================
// STEP 3: Implement Upload Flow (Phase 1 Complete)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '⬆️',
  scenario: "Infrastructure is ready! But how does the actual upload work?",
  hook: "Should the photo go through your server? Or directly to S3? This decision affects performance dramatically.",
  challenge: "Implement the photo upload flow with direct-to-S3 upload.",
  illustration: 'upload-flow',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 1 Complete! Photo sharing works!',
  achievement: 'Users can upload and view photos',
  metrics: [
    { label: 'Upload photos', after: '✓ Working' },
    { label: 'View photos', after: '✓ Working' },
    { label: 'Direct S3 upload', after: '✓ Fast' },
  ],
  nextTeaser: "But users see ALL photos. They want to follow specific people...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Direct Upload to S3',
  conceptExplanation: `**Two upload approaches:**

**❌ Through Server (Bad):**
\`\`\`
Client → Server → S3
\`\`\`
- Server becomes bottleneck
- 2MB through your server = expensive
- Slow for users

**✅ Direct to S3 (Good):**
\`\`\`
1. Client → Server: "I want to upload"
2. Server → Client: "Here's a signed URL"
3. Client → S3: Upload directly
4. Client → Server: "Upload complete"
5. Server → DB: Save metadata
\`\`\`

**Presigned URL:**
Server generates a temporary, signed URL that allows direct upload to S3:
\`\`\`python
def get_upload_url(user_id):
    key = f"photos/{user_id}/{uuid4()}.jpg"
    url = s3.generate_presigned_url(
        'put_object',
        Params={'Bucket': 'photos', 'Key': key},
        ExpiresIn=300  # 5 minutes
    )
    return {'upload_url': url, 'key': key}
\`\`\`

**Benefits:**
- Server doesn't handle large files
- Scales better
- Faster for users
- Cheaper (less bandwidth through server)`,

  whyItMatters: 'Direct upload is essential for media platforms. Server proxying doesn\'t scale.',

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Handling 1200 uploads/second',
    howTheyDoIt: 'Direct upload to S3 with presigned URLs. Server only handles metadata.',
  },

  keyPoints: [
    'Generate presigned URL on server',
    'Client uploads directly to S3',
    'Server saves metadata after upload',
  ],

  keyConcepts: [
    { title: 'Presigned URL', explanation: 'Temporary permission to upload', icon: '🔑' },
    { title: 'Direct Upload', explanation: 'Client → S3 (bypasses server)', icon: '⬆️' },
  ],
};

const step3: GuidedStep = {
  id: 'instagram-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1 & FR-2: Upload and view photos',
    taskDescription: 'Implement direct upload to S3',
    successCriteria: [
      'Server generates presigned URL',
      'Client uploads directly to S3',
      'Server saves metadata after upload',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'client', toType: 'object_storage' }, // Direct upload!
    ],
  },

  hints: {
    level1: 'Add direct connection from Client to S3',
    level2: 'Client gets presigned URL from Server, then uploads directly to S3',
    solutionComponents: [],
    solutionConnections: [{ from: 'client', to: 'object_storage' }],
  },
};

// =============================================================================
// PHASE 2: INTERMEDIATE - Following & Feed
// =============================================================================

// =============================================================================
// STEP 4: Add Follow System (Phase 2)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '👥',
  scenario: "Phase 2 begins! Users love uploading photos, but there's a problem...",
  hook: "The photo gallery shows EVERYONE's photos. Users are overwhelmed with strangers' lunch pics! They want to follow specific people.",
  challenge: "NEW REQUIREMENT: FR-3 - Users can follow/unfollow other users.",
  illustration: 'social-graph',
};

const step4Celebration: CelebrationContent = {
  emoji: '👥',
  message: 'Follow system is live!',
  achievement: 'Users can follow each other',
  metrics: [
    { label: 'Follow/unfollow', after: '✓ Working' },
    { label: 'Social graph', after: 'Stored' },
  ],
  nextTeaser: "Now we need to show only followed users' photos...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'The Social Graph',

  frameworkReminder: {
    question: "How do users choose whose photos they see?",
    connection: "FR-3 introduces following. This creates the 'social graph' that powers personalized feeds."
  },

  conceptExplanation: `**NEW FR-3: Follow/Unfollow Users**

**The Follow Graph:**
Just like Twitter, Instagram uses an asymmetric follow model:
- Alice follows Bob (one-way)
- Bob might not follow Alice back

**Schema:**
\`\`\`sql
CREATE TABLE follows (
  follower_id BIGINT,
  followee_id BIGINT,
  created_at TIMESTAMP,
  PRIMARY KEY (follower_id, followee_id)
);

-- Index for "who do I follow?"
CREATE INDEX idx_follower ON follows(follower_id);

-- Index for "who follows me?"
CREATE INDEX idx_followee ON follows(followee_id);
\`\`\`

**APIs:**
- POST /api/v1/users/:id/follow
- DELETE /api/v1/users/:id/follow
- GET /api/v1/users/:id/followers
- GET /api/v1/users/:id/following`,

  whyItMatters: 'The follow graph is the foundation for personalized feeds. Every photo platform needs this.',

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Managing billions of follow relationships',
    howTheyDoIt: 'Cassandra for follow graph with heavy caching in Redis.',
  },

  keyPoints: [
    'Asymmetric following (one-way)',
    'Two indexes: followers and following',
    'Foundation for feed generation',
  ],

  keyConcepts: [
    { title: 'Social Graph', explanation: 'Network of follows', icon: '🕸️' },
    { title: 'Asymmetric', explanation: 'One-way relationship', icon: '➡️' },
  ],
};

const step4: GuidedStep = {
  id: 'instagram-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Users can follow/unfollow',
    taskDescription: 'Implement the follow system',
    successCriteria: [
      'Create follows table',
      'Implement follow/unfollow APIs',
      'Store follow relationships',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'client', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Add follow/unfollow APIs',
    level2: 'Store follower_id → followee_id relationships',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Personalized Feed (Phase 2)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📰',
  scenario: "Users can follow each other. But the feed still shows everyone's photos!",
  hook: "Alice follows 50 photographers, but sees random strangers' selfies. The feed needs to be PERSONALIZED.",
  challenge: "Update the feed to only show photos from followed users.",
  illustration: 'personalized-feed',
};

const step5Celebration: CelebrationContent = {
  emoji: '📰',
  message: 'Personalized feed is live!',
  achievement: 'Users see photos only from people they follow',
  metrics: [
    { label: 'Feed type', before: 'Global', after: 'Personalized' },
    { label: 'User experience', after: 'Much better!' },
  ],
  nextTeaser: "But feed generation is slow at scale...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Feed Generation: Pull vs Push',

  frameworkReminder: {
    question: "How do we show only followed users' photos?",
    connection: "We need to JOIN posts with the follow graph. This is the same fan-out challenge as Twitter."
  },

  conceptExplanation: `**Feed Query (Pull Model):**

\`\`\`sql
SELECT p.* FROM posts p
JOIN follows f ON p.user_id = f.followee_id
WHERE f.follower_id = :current_user
ORDER BY p.created_at DESC
LIMIT 20;
\`\`\`

**The Challenge:**
- If you follow 1000 people, this JOIN is expensive
- At 350K requests/sec, database melts

**Two Approaches:**

**1. Pull Model (Fan-out on Read):**
- Generate feed when user requests it
- Simple, but slow at scale

**2. Push Model (Fan-out on Write):**
- Pre-compute feeds when photos are posted
- Fast reads, but complex writes

**For now, we'll use Pull model:**
- Simpler to implement
- Works at intermediate scale
- We'll optimize in Phase 3`,

  whyItMatters: 'Feed generation is THE core problem for social media. Understanding pull vs push is essential.',

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Feed generation at scale',
    howTheyDoIt: 'Hybrid approach with heavy caching. Most users get cached feeds.',
  },

  keyPoints: [
    'Pull = compute on read',
    'Push = pre-compute on write',
    'Pull is simpler but slower',
  ],

  keyConcepts: [
    { title: 'Pull Model', explanation: 'Generate feed on request', icon: '📥' },
    { title: 'Push Model', explanation: 'Pre-compute feeds', icon: '📤' },
  ],
};

const step5: GuidedStep = {
  id: 'instagram-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-4: Personalized feed',
    taskDescription: 'Filter feed to show only followed users',
    successCriteria: [
      'Update feed query to JOIN with follows',
      'Only return posts from followed users',
      'Order by created_at DESC',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'client', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'JOIN posts with follows table',
    level2: 'WHERE follower_id = current_user',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Cache & Likes (Phase 2 Complete)
// =============================================================================

const step6Story: StoryContent = {
  emoji: '❤️',
  scenario: "Users want to engage with photos! Also, the feed is getting slow...",
  hook: "Every feed request queries the database. Users are asking: 'Can I like photos?'",
  challenge: "Add caching for performance AND implement likes.",
  illustration: 'engagement',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 2 Complete! Full social features!',
  achievement: 'Following, personalized feed, likes, caching',
  metrics: [
    { label: 'Follow system', after: '✓' },
    { label: 'Personalized feed', after: '✓' },
    { label: 'Likes', after: '✓' },
    { label: 'Caching', after: '✓' },
  ],
  nextTeaser: "Phase 3: Speed up images with CDN!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Caching & Engagement',

  frameworkReminder: {
    question: "How do we make the feed fast?",
    connection: "100:1 read-write ratio. Cache the feed to avoid database queries."
  },

  conceptExplanation: `**Two additions:**

**1. Feed Caching:**
\`\`\`python
def get_feed(user_id):
    cached = cache.get(f"feed:{user_id}")
    if cached:
        return cached

    feed = db.query_feed(user_id)
    cache.set(f"feed:{user_id}", feed, ttl=60)
    return feed
\`\`\`

**2. Likes:**
\`\`\`sql
CREATE TABLE likes (
  user_id BIGINT,
  post_id BIGINT,
  created_at TIMESTAMP,
  PRIMARY KEY (user_id, post_id)
);
\`\`\`

**Like Count Caching:**
- Store like count in Redis: \`likes:post:{id}\`
- Increment on like, decrement on unlike
- Don't query COUNT(*) every time!

**Denormalization:**
Consider storing like_count directly on posts table:
\`\`\`sql
ALTER TABLE posts ADD COLUMN like_count INT DEFAULT 0;
\`\`\``,

  whyItMatters: 'Caching is essential for read-heavy workloads. Likes are the primary engagement action.',

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Likes at scale',
    howTheyDoIt: 'Like counts cached in Redis, updated asynchronously. Posts table has denormalized count.',
  },

  keyPoints: [
    'Cache feeds for fast reads',
    'Cache like counts',
    'Denormalize for performance',
  ],

  keyConcepts: [
    { title: 'Cache', explanation: 'Fast in-memory storage', icon: '⚡' },
    { title: 'Denormalization', explanation: 'Store computed values', icon: '📊' },
  ],
};

const step6: GuidedStep = {
  id: 'instagram-step-6',
  stepNumber: 6,
  frIndex: 4,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-5: Likes + NFR: Fast feeds',
    taskDescription: 'Add cache and implement likes',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache feeds and like counts', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Add Cache component',
      'Cache feeds',
      'Implement like/unlike APIs',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'client', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add Cache, implement likes',
    level2: 'Cache feeds and like counts in Redis',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// PHASE 3: ADVANCED - CDN & Scale
// =============================================================================

// =============================================================================
// STEP 7: Add CDN for Images (Phase 3)
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🌐',
  scenario: "Phase 3 begins! Your photo platform is going global, but there's a problem...",
  hook: "Users in Tokyo wait 2 seconds for images to load. Your S3 bucket is in US-East. Every image crosses the Pacific Ocean!",
  challenge: "Add a CDN to serve images from the nearest location.",
  illustration: 'global-latency',
};

const step7Celebration: CelebrationContent = {
  emoji: '🌐',
  message: 'Images are now lightning fast worldwide!',
  achievement: 'CDN caches images at 200+ edge locations',
  metrics: [
    { label: 'Image load (Tokyo)', before: '2s', after: '100ms' },
    { label: 'Edge locations', after: '200+' },
    { label: 'S3 load reduced', after: '90%' },
  ],
  nextTeaser: "Now let's scale the backend...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'CDN for Image Delivery',

  frameworkReminder: {
    question: "How do we serve images fast globally?",
    connection: "S3 in one region = slow for global users. CDN caches images at edge locations."
  },

  conceptExplanation: `**The Problem:**
- S3 bucket in US-East
- User in Tokyo: 150ms network latency
- 2MB image = ~2 seconds to load!

**The Solution: CDN (Content Delivery Network)**
- Edge servers in 200+ locations worldwide
- First request: CDN fetches from S3, caches at edge
- Subsequent requests: Served from edge (10ms!)

**How it works:**
\`\`\`
User → CDN Edge → (cache miss) → S3
User → CDN Edge → (cache hit) → Instant!
\`\`\`

**Image URL Pattern:**
\`\`\`
Before: https://s3.amazonaws.com/photos/abc.jpg
After:  https://cdn.photoshare.com/photos/abc.jpg
\`\`\`

CDN URL points to edge, which fetches from S3 origin.

**Cache Headers:**
\`\`\`
Cache-Control: public, max-age=31536000
\`\`\`
Images don't change - cache forever!`,

  whyItMatters: 'Without CDN, global users have terrible experience. CDN is mandatory for media platforms.',

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Serving 2B images/day',
    howTheyDoIt: 'Facebook CDN (PoPs worldwide). Images cached at edge indefinitely.',
  },

  keyPoints: [
    'CDN = servers worldwide',
    'Cache images at edge',
    'Images are immutable - cache forever',
  ],

  keyConcepts: [
    { title: 'CDN', explanation: 'Content Delivery Network', icon: '🌐' },
    { title: 'Edge', explanation: 'Server near users', icon: '📍' },
    { title: 'Origin', explanation: 'Source (S3)', icon: '🏠' },
  ],
};

const step7: GuidedStep = {
  id: 'instagram-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'NFR: Fast global image delivery',
    taskDescription: 'Add CDN in front of S3',
    componentsNeeded: [
      { type: 'cdn', reason: 'Cache images at edge', displayName: 'CDN' },
    ],
    successCriteria: [
      'Add CDN component',
      'CDN in front of Object Storage',
      'Client fetches images from CDN',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage', 'cache', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
  },

  hints: {
    level1: 'Add CDN between Client and S3',
    level2: 'Client → CDN → S3 for images',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [
      { from: 'cdn', to: 'object_storage' },
      { from: 'client', to: 'cdn' },
    ],
  },
};

// =============================================================================
// STEP 8: Add Load Balancer (Phase 3)
// =============================================================================

const step8Story: StoryContent = {
  emoji: '⚖️',
  scenario: "Your platform is handling 100K requests/second! But there's a single point of failure...",
  hook: "One server can't handle this load. And if it crashes, everyone is down!",
  challenge: "Add load balancing for horizontal scaling.",
  illustration: 'scale-up',
};

const step8Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'Horizontal scaling enabled!',
  achievement: 'Multiple servers behind load balancer',
  metrics: [
    { label: 'Servers', before: '1', after: 'Many' },
    { label: 'Capacity', after: '350K req/sec' },
    { label: 'Availability', after: 'High' },
  ],
  nextTeaser: "Now let's add async processing...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing',

  frameworkReminder: {
    question: "How do we handle 350K requests/second?",
    connection: "One server handles 5-10K req/sec. At 350K, we need many servers."
  },

  conceptExplanation: `**The Math:**
- One server: ~5,000 req/sec
- Your load: 350,000 req/sec peak
- Servers needed: 70+

**Load Balancer:**
- Distributes requests across servers
- Health checks: removes unhealthy servers
- No single point of failure

**Strategies:**
- **Round Robin**: Rotate through servers
- **Least Connections**: Send to least busy
- **Weighted**: More traffic to powerful servers

**Stateless Servers:**
For load balancing to work, servers must be stateless:
- No session data on server
- Use Redis for sessions
- Any server can handle any request`,

  whyItMatters: 'Single servers have limits. Load balancing enables unlimited horizontal scale.',

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Handling billions of requests',
    howTheyDoIt: 'Multiple load balancer layers. HAProxy, then internal LBs.',
  },

  keyPoints: [
    'LB distributes traffic',
    'Servers must be stateless',
    'Horizontal scaling',
  ],

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests', icon: '⚖️' },
    { title: 'Stateless', explanation: 'No server-side sessions', icon: '🔄' },
  ],
};

const step8: GuidedStep = {
  id: 'instagram-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'NFR: Handle 350K req/sec',
    taskDescription: 'Add load balancer',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Add Load Balancer',
      'Client → LB → App Servers',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
  },

  hints: {
    level1: 'Add LB between Client and App Server',
    level2: 'Client → Load Balancer → App Servers',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 9: Add Async Processing (Phase 3 Complete)
// =============================================================================

const step9Story: StoryContent = {
  emoji: '📬',
  scenario: "Photo uploads are slow! Users wait while images are processed...",
  hook: "When a user uploads a photo, we generate thumbnails, run filters, scan for content. This takes 10 seconds! Users hate waiting.",
  challenge: "Add async processing with message queues.",
  illustration: 'async-processing',
};

const step9Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 3 Complete! Production scale!',
  achievement: 'CDN, load balancing, async processing',
  metrics: [
    { label: 'Image delivery', after: 'CDN (global)' },
    { label: 'Capacity', after: '350K req/sec' },
    { label: 'Upload time', before: '10s', after: '< 1s' },
  ],
  nextTeaser: "Phase 4: Image processing pipeline and explore!",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Async Image Processing',

  frameworkReminder: {
    question: "Why are uploads slow?",
    connection: "Image processing (thumbnails, filters, moderation) is CPU-intensive. Don't do it synchronously!"
  },

  conceptExplanation: `**The Problem:**
Photo upload does many things:
- Generate thumbnail (100x100)
- Generate medium (500x500)
- Apply filter (if any)
- Content moderation (ML scan)
- Update feed cache

All synchronous = 10 second upload!

**The Solution: Async Processing**
\`\`\`
1. Client uploads to S3 (fast)
2. Server saves metadata, enqueues job
3. Return success immediately
4. Workers process in background:
   - Generate thumbnails
   - Apply filters
   - Run content moderation
   - Update feeds
\`\`\`

**Message Queue (Kafka/SQS):**
\`\`\`python
def handle_upload(user_id, image_key):
    # Save metadata immediately
    post = db.create_post(user_id, image_key)

    # Enqueue processing job
    queue.publish('image-processing', {
        'post_id': post.id,
        'image_key': image_key
    })

    return post  # Return immediately!
\`\`\``,

  whyItMatters: 'Synchronous processing kills user experience. Always process heavy tasks async.',

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Processing 100M uploads/day',
    howTheyDoIt: 'Upload returns in < 1 second. Background workers handle resizing, ML, etc.',
  },

  keyPoints: [
    'Upload returns immediately',
    'Heavy processing in background',
    'Message queue coordinates workers',
  ],

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for async jobs', icon: '📬' },
    { title: 'Worker', explanation: 'Process that handles jobs', icon: '👷' },
  ],
};

const step9: GuidedStep = {
  id: 'instagram-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'NFR: Fast uploads with async processing',
    taskDescription: 'Add message queue for async processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Queue processing jobs', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Add Message Queue',
      'Enqueue processing jobs on upload',
      'Workers process asynchronously',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache', 'cdn', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
  },

  hints: {
    level1: 'Add Kafka for processing jobs',
    level2: 'Upload → enqueue job → return immediately',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// PHASE 4: EXPERT - Image Pipeline & Explore
// =============================================================================

// =============================================================================
// STEP 10: Image Processing Pipeline (Phase 4)
// =============================================================================

const step10Story: StoryContent = {
  emoji: '🖼️',
  scenario: "Phase 4 begins! Let's build the image processing pipeline.",
  hook: "We queue processing jobs, but what actually happens? We need a proper pipeline for thumbnails, filters, and content moderation.",
  challenge: "Build a complete image processing pipeline.",
  illustration: 'pipeline',
};

const step10Celebration: CelebrationContent = {
  emoji: '🖼️',
  message: 'Image pipeline is operational!',
  achievement: 'Full processing: thumbnails, filters, moderation',
  metrics: [
    { label: 'Thumbnails', after: '✓ Generated' },
    { label: 'Resolutions', after: '3 sizes' },
    { label: 'Content moderation', after: '✓ ML scan' },
  ],
  nextTeaser: "Now let's add the Explore feature...",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Image Processing Pipeline',

  frameworkReminder: {
    question: "What processing does each photo need?",
    connection: "Raw photos need: multiple sizes, optional filters, content safety scanning."
  },

  conceptExplanation: `**Image Processing Pipeline:**

\`\`\`
Upload → Queue → Pipeline Workers → S3
                      │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
    [Resize]    [Filter]   [Moderate]
         │           │           │
         └───────────┼───────────┘
                     ▼
              [Upload to S3]
                     │
              [Update DB]
\`\`\`

**Step 1: Generate Multiple Sizes**
\`\`\`python
def generate_thumbnails(image):
    sizes = {
        'thumb': (150, 150),
        'medium': (600, 600),
        'full': (1080, 1080)
    }
    for name, size in sizes.items():
        resized = image.resize(size)
        s3.upload(f"{name}_{image.key}")
\`\`\`

**Step 2: Apply Filters (optional)**
If user selected a filter, apply it.

**Step 3: Content Moderation**
\`\`\`python
def moderate(image_url):
    result = ml_model.scan(image_url)
    if result.is_unsafe:
        flag_for_review(image_url)
\`\`\`

**Step 4: Update Database**
\`\`\`python
db.update_post(post_id, {
    'thumbnail_url': thumb_url,
    'medium_url': medium_url,
    'full_url': full_url,
    'status': 'published'
})
\`\`\``,

  whyItMatters: 'Every photo platform needs an image pipeline. Understanding this is essential.',

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Processing 100M photos/day',
    howTheyDoIt: 'Custom image processing service. Multiple worker pools for different tasks.',
  },

  keyPoints: [
    'Multiple image sizes',
    'Content moderation',
    'Async pipeline',
  ],

  keyConcepts: [
    { title: 'Pipeline', explanation: 'Sequential processing stages', icon: '🔄' },
    { title: 'Moderation', explanation: 'Safety scanning', icon: '🛡️' },
  ],
};

const step10: GuidedStep = {
  id: 'instagram-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'NFR: Complete image processing',
    taskDescription: 'Implement image processing pipeline',
    successCriteria: [
      'Generate multiple image sizes',
      'Add content moderation',
      'Update database when complete',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache', 'cdn', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'message_queue', toType: 'app_server' }, // Workers consume from queue
    ],
  },

  hints: {
    level1: 'Build pipeline: resize → filter → moderate → save',
    level2: 'Workers consume from queue, process, upload to S3',
    solutionComponents: [],
    solutionConnections: [{ from: 'message_queue', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 11: Explore Feature (Phase 4)
// =============================================================================

const step11Story: StoryContent = {
  emoji: '🔍',
  scenario: "Users want to discover new content beyond their feed!",
  hook: "The feed only shows followed users. Users want to EXPLORE - find new photographers, trending hashtags, popular posts.",
  challenge: "Build the Explore page with personalized recommendations.",
  illustration: 'explore',
};

const step11Celebration: CelebrationContent = {
  emoji: '🔍',
  message: 'Explore is live!',
  achievement: 'Users can discover new content',
  metrics: [
    { label: 'Explore page', after: '✓ Working' },
    { label: 'Recommendations', after: 'Personalized' },
    { label: 'Search', after: '✓ Working' },
  ],
  nextTeaser: "One final step: database scaling!",
};

const step11LearnPhase: TeachingContent = {
  conceptTitle: 'Explore & Discovery',

  frameworkReminder: {
    question: "How do users discover new content?",
    connection: "Explore shows content beyond the feed - popular posts, recommendations, search."
  },

  conceptExplanation: `**Explore Page Components:**

**1. Popular Posts**
- Posts with high engagement (likes/comments)
- Simple: ORDER BY like_count DESC
- Better: Weighted by recency + engagement

**2. Personalized Recommendations**
\`\`\`
Based on:
- What you liked
- Who your friends follow
- Similar content (ML embedding)
\`\`\`

**3. Hashtag Search**
\`\`\`sql
-- Search posts by hashtag
SELECT p.* FROM posts p
JOIN post_hashtags ph ON p.id = ph.post_id
JOIN hashtags h ON ph.hashtag_id = h.id
WHERE h.name = '#sunset'
ORDER BY p.created_at DESC;
\`\`\`

**4. User Search**
Full-text search on usernames and bios.

**Architecture:**
\`\`\`
Explore Page
    │
    ├── Popular Posts → Cache (refreshed hourly)
    ├── Recommendations → ML Service
    ├── Hashtag Search → Search Index
    └── User Search → Search Index
\`\`\``,

  whyItMatters: 'Explore drives growth. Users discover new content and follow new people.',

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Explore page',
    howTheyDoIt: 'ML-based recommendations. Personalized for each user based on interaction history.',
  },

  keyPoints: [
    'Popular content',
    'Personalized recommendations',
    'Search functionality',
  ],

  keyConcepts: [
    { title: 'Explore', explanation: 'Discover new content', icon: '🔍' },
    { title: 'Recommendations', explanation: 'ML-based suggestions', icon: '🤖' },
  ],
};

const step11: GuidedStep = {
  id: 'instagram-step-11',
  stepNumber: 11,
  frIndex: 5,

  story: step11Story,
  learnPhase: step11LearnPhase,

  practicePhase: {
    frText: 'FR-6: Explore and discovery',
    taskDescription: 'Build the Explore feature',
    componentsNeeded: [
      { type: 'search', reason: 'Search for hashtags and users', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Add Search component',
      'Implement popular posts query',
      'Enable hashtag and user search',
    ],
  },

  celebration: step11Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache', 'cdn', 'message_queue', 'search'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'search' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'message_queue', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Add Search for hashtags and users',
    level2: 'Elasticsearch for full-text search, cache popular posts',
    solutionComponents: [{ type: 'search' }],
    solutionConnections: [{ from: 'app_server', to: 'search' }],
  },
};

// =============================================================================
// STEP 12: Database Sharding (Phase 4 Complete)
// =============================================================================

const step12Story: StoryContent = {
  emoji: '🗃️',
  scenario: "You have 10 billion photos in your database!",
  hook: "The posts table has 10 billion rows. Queries are slow, backups take days. One database can't handle it!",
  challenge: "Shard the database to distribute data across multiple machines.",
  illustration: 'sharding',
};

const step12Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You\'ve mastered Instagram system design!',
  achievement: 'From simple photo sharing to global-scale platform',
  metrics: [
    { label: 'DAU', after: '500M' },
    { label: 'Photos/day', after: '100M' },
    { label: 'Storage', after: 'Petabytes' },
    { label: 'Global latency', after: '< 200ms' },
    { label: 'Features', after: 'Feed, Explore, Search' },
  ],
  nextTeaser: "You've completed the Instagram journey!",
};

const step12LearnPhase: TeachingContent = {
  conceptTitle: 'Database Sharding',

  frameworkReminder: {
    question: "How do we handle billions of rows?",
    connection: "Single database can't hold 10 billion posts. Sharding splits data across machines."
  },

  conceptExplanation: `**The Problem:**
- 10 billion posts
- Single database is too big
- Queries slow, backups impossible

**The Solution: Sharding**
Split data across multiple databases.

**Sharding Strategy for Instagram:**
Shard by user_id:
\`\`\`
shard_id = user_id % num_shards
\`\`\`

**Why user_id?**
- User's feed queries their follows' posts
- Followers likely on same shard
- Minimizes cross-shard queries

**Shard Layout:**
\`\`\`
User IDs 0-999999     → Shard 1
User IDs 1000000-1999999 → Shard 2
...
\`\`\`

**Cross-Shard Queries:**
What if you follow users on different shards?
- Fan-out: query each shard
- Merge results in application
- Cache heavily to reduce cross-shard calls`,

  whyItMatters: 'Sharding is essential for billion-scale applications. This is expert-level architecture.',

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Storing petabytes of data',
    howTheyDoIt: 'Cassandra for posts (naturally sharded), PostgreSQL sharded by user_id for relationships.',
  },

  keyPoints: [
    'Shard by user_id',
    'Minimize cross-shard queries',
    'Cache to reduce load',
  ],

  keyConcepts: [
    { title: 'Sharding', explanation: 'Split data across DBs', icon: '🗃️' },
    { title: 'Shard Key', explanation: 'Determines data location', icon: '🔑' },
  ],
};

const step12: GuidedStep = {
  id: 'instagram-step-12',
  stepNumber: 12,
  frIndex: 0,

  story: step12Story,
  learnPhase: step12LearnPhase,

  practicePhase: {
    frText: 'NFR: Handle billions of posts',
    taskDescription: 'Configure database sharding',
    successCriteria: [
      'Enable sharding on database',
      'Shard by user_id',
      'Configure multiple shards',
    ],
  },

  celebration: step12Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache', 'cdn', 'message_queue', 'search'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'search' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'message_queue', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Configure sharding on database',
    level2: 'Shard key = user_id, multiple shards',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE PROGRESSIVE TUTORIAL
// =============================================================================

export const instagramProgressiveGuidedTutorial: GuidedTutorial = {
  problemId: 'instagram-progressive',
  title: 'Design Instagram',
  description: 'Build an evolving photo-sharing platform from simple uploads to global-scale social media',
  difficulty: 'beginner', // Starts beginner, evolves to expert
  estimatedMinutes: 90,

  welcomeStory: {
    emoji: '📷',
    hook: "Welcome to PhotoShare! You're building the next Instagram.",
    scenario: "Your journey: Start with simple photo uploads, then add social features, scale with CDN, and handle billions of photos.",
    challenge: "Can you build a photo platform that handles 100 million uploads per day?",
  },

  requirementsPhase: phase1Requirements,

  steps: [
    // Phase 1: Beginner (Steps 1-3)
    step1, step2, step3,
    // Phase 2: Intermediate (Steps 4-6)
    step4, step5, step6,
    // Phase 3: Advanced (Steps 7-9)
    step7, step8, step9,
    // Phase 4: Expert (Steps 10-12)
    step10, step11, step12,
  ],

  concepts: [
    'Client-Server Architecture',
    'Object Storage vs Database',
    'Direct Upload (Presigned URLs)',
    'Social Graph',
    'Feed Generation',
    'Caching',
    'CDN for Media',
    'Load Balancing',
    'Async Processing',
    'Image Processing Pipeline',
    'Search & Discovery',
    'Database Sharding',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, Maintainable Applications',
    'Chapter 5: Replication',
    'Chapter 6: Partitioning (Sharding)',
    'Chapter 11: Stream Processing',
  ],
};

export default instagramProgressiveGuidedTutorial;
