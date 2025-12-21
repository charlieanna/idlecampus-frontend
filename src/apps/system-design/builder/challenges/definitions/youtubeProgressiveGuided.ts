import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * YouTube - Progressive Tutorial (4 Phases)
 *
 * A single evolving tutorial that grows from beginner → intermediate → advanced → expert.
 * Focus: Video upload, transcoding, streaming, comments, and recommendations.
 *
 * PHASE 1 - BEGINNER (Steps 1-3):
 * - FR-1: Upload videos
 * - FR-2: Watch videos
 * - Build: Client → Server → Storage, basic streaming
 *
 * PHASE 2 - INTERMEDIATE (Steps 4-6):
 * - FR-3: Video processing (transcoding)
 * - FR-4: Comments and likes
 * - Build: Async pipeline, engagement features
 *
 * PHASE 3 - ADVANCED (Steps 7-9):
 * - NFR: Handle millions of concurrent viewers
 * - Search and discovery
 * - Build: CDN, search index, caching
 *
 * PHASE 4 - EXPERT (Steps 10-12):
 * - Recommendation engine
 * - Live streaming
 * - Monetization (ads)
 *
 * Key Teaching: User-generated content at scale. Processing pipeline is critical.
 */

// =============================================================================
// PHASE 1: BEGINNER REQUIREMENTS (Steps 1-3)
// =============================================================================

const phase1Requirements: RequirementsGatheringContent = {
  problemStatement: "Design a video sharing platform like YouTube",

  interviewer: {
    name: 'David Park',
    role: 'Product Manager at VideoHub',
    avatar: '👨‍💼',
  },

  questions: [
    {
      id: 'upload-video',
      category: 'functional',
      question: "What's the primary way users contribute content?",
      answer: "Upload videos! Creators upload videos from their devices - could be a 30-second clip or a 2-hour documentary.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "User-generated content is the core",
    },
    {
      id: 'watch-video',
      category: 'functional',
      question: "What's the main thing viewers want to do?",
      answer: "Watch videos! They click play and expect instant playback. No downloads, just streaming.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Consumption is the primary use case",
    },
  ],

  minimumQuestionsRequired: 2,
  criticalQuestionIds: ['upload-video', 'watch-video'],
  criticalFRQuestionIds: ['upload-video', 'watch-video'],
  criticalScaleQuestionIds: [],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Upload videos',
      description: 'Creators upload video content to the platform',
      emoji: '📤',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Watch videos',
      description: 'Viewers stream videos instantly',
      emoji: '▶️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100,000',
    writesPerDay: '10,000 uploads',
    readsPerDay: '10M video views',
    peakMultiplier: 3,
    readWriteRatio: '1000:1',
    calculatedWriteRPS: { average: 0.1, peak: 0.5 },
    calculatedReadRPS: { average: 100, peak: 500 },
    maxPayloadSize: 'Videos: 10MB - 128GB',
    storagePerRecord: '~500MB average',
    storageGrowthPerYear: '~500TB',
    redirectLatencySLA: 'Video start < 2s',
    createLatencySLA: 'Upload processing: minutes to hours',
  },

  architecturalImplications: [
    '✅ Extremely read-heavy (1000:1 ratio)',
    '✅ Large files need special handling',
    '✅ Async processing for uploads',
  ],

  outOfScope: [
    'Video processing (Phase 2)',
    'Comments/likes (Phase 2)',
    'Search (Phase 3)',
    'Recommendations (Phase 4)',
  ],

  keyInsight: "YouTube is 1000:1 read-heavy. For every 1 upload, there are 1000+ views. But each upload triggers heavy processing (transcoding). CDN is absolutely essential.",

  thinkingFramework: {
    title: "Phase 1: Basic Video Upload & Streaming",
    intro: "We have 2 simple requirements. Let's build basic upload and playback.",

    steps: [
      {
        id: 'upload-challenge',
        title: 'Step 1: Video Upload Challenge',
        alwaysAsk: "How do we handle large file uploads?",
        whyItMatters: "Videos are gigabytes. Can't buffer in memory. Need streaming upload.",
        expertBreakdown: {
          intro: "Upload considerations:",
          points: [
            "Files can be gigabytes",
            "Upload directly to object storage (S3)",
            "Resumable uploads for reliability",
            "Store metadata separately from content"
          ]
        },
        icon: '📤',
        category: 'functional'
      },
      {
        id: 'streaming-basics',
        title: 'Step 2: Video Streaming',
        alwaysAsk: "How do viewers watch videos?",
        whyItMatters: "Progressive download or adaptive streaming. Users expect instant playback.",
        expertBreakdown: {
          intro: "Streaming basics:",
          points: [
            "Don't download entire file",
            "Stream chunks as needed",
            "Buffer ahead for smooth playback",
            "CDN for global delivery"
          ]
        },
        icon: '▶️',
        category: 'functional'
      }
    ],

    startSimple: {
      title: "Phase 1 Architecture",
      description: "Client → Server → Database (metadata) + S3 (videos).",
      whySimple: "This works for basic video hosting. We'll add processing and CDN later.",
      nextStepPreview: "Step 1: Set up video upload"
    }
  },

  scaleFramework: {
    title: "What's Coming Next?",
    intro: "After Phase 1, the platform will evolve:",
    celebrationMessage: "Your basic video platform works!",
    hookMessage: "But videos only play in the original quality. And there's no engagement...",
    steps: [
      {
        id: 'processing',
        title: 'Phase 2: Processing',
        question: "How do we support different quality levels?",
        whyItMatters: "Users have different internet speeds",
        example: "Transcoding pipeline, multiple resolutions",
        icon: '🎞️'
      },
      {
        id: 'scale',
        title: 'Phase 3: Scale',
        question: "How do we handle viral videos with millions of views?",
        whyItMatters: "One viral video can overwhelm your servers",
        example: "CDN, caching, search",
        icon: '📈'
      }
    ],
    nextStepsPreview: "First, let's build Phase 1!"
  }
};

// =============================================================================
// STEP 1: Connect Client to Server (Phase 1)
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📹',
  scenario: "Welcome to VideoHub! You're building the next YouTube.",
  hook: "A creator just finished editing their masterpiece - a 10-minute video. They want to share it with the world. But there's nowhere to upload!",
  challenge: "Set up the basic system for video uploads.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your video platform is online!',
  achievement: 'Creators can connect to upload videos',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Upload endpoint', after: 'Ready' },
  ],
  nextTeaser: "But where do we store the videos?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Video Platform Architecture Basics',
  conceptExplanation: `**User-Generated Content Platform**

**Two Types of Users:**
1. **Creators**: Upload videos, want views
2. **Viewers**: Watch videos, engage

**Data Types:**
| Data | Size | Storage |
|------|------|---------|
| Video metadata | ~1KB | Database |
| Video file | 10MB-10GB | Object Storage |
| Thumbnail | ~100KB | Object Storage + CDN |

**API Design:**
\`\`\`
POST /videos/upload-url     → Get presigned S3 URL
PUT  <presigned-url>        → Upload to S3 directly
POST /videos/complete       → Confirm upload, start processing
GET  /videos/{id}           → Get video metadata
GET  /videos/{id}/stream    → Get streaming URL
\`\`\`

**Video Metadata:**
\`\`\`json
{
  "id": "abc123",
  "title": "My First Video",
  "description": "...",
  "duration_seconds": 600,
  "views": 1000000,
  "likes": 50000,
  "channel_id": "creator_1",
  "status": "ready",
  "thumbnail_url": "...",
  "stream_url": "..."
}
\`\`\``,

  whyItMatters: 'Understanding the separation between metadata and content is fundamental.',

  realWorldExample: {
    company: 'YouTube',
    scenario: 'Handling 500+ hours uploaded per minute',
    howTheyDoIt: 'Direct upload to storage. Metadata in Spanner. Massive processing pipeline.',
  },

  keyPoints: [
    'Creators upload, viewers watch',
    'Metadata in database',
    'Videos in object storage',
  ],

  keyConcepts: [
    { title: 'UGC', explanation: 'User-Generated Content', icon: '📹' },
    { title: 'Metadata', explanation: 'Data about the video', icon: '📋' },
  ],
};

const step1: GuidedStep = {
  id: 'youtube-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'FR-1: Upload videos',
    taskDescription: 'Add Client and App Server for video uploads',
    componentsNeeded: [
      { type: 'client', reason: 'Creator uploading video', displayName: 'VideoHub App' },
      { type: 'app_server', reason: 'Handles video metadata', displayName: 'Video Service' },
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
  scenario: "Creators are uploading, but we can't track anything!",
  hook: "Where's the video title? Who uploaded it? How many views? We need to store all this information about each video.",
  challenge: "Add a database to store video metadata.",
  illustration: 'database',
};

const step2Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Video metadata stored!',
  achievement: 'We can track all video information',
  metrics: [
    { label: 'Metadata stored', after: '✓' },
    { label: 'Video tracking', after: '✓' },
  ],
  nextTeaser: "Now let's add storage for the actual videos...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Video Metadata Schema',
  conceptExplanation: `**Core Tables:**

\`\`\`sql
CREATE TABLE videos (
  id VARCHAR(11) PRIMARY KEY,  -- YouTube uses 11-char IDs
  channel_id BIGINT NOT NULL,
  title VARCHAR(100),
  description TEXT,
  duration_seconds INT,

  -- Storage references
  original_storage_key VARCHAR(500),
  thumbnail_url VARCHAR(500),

  -- Status
  status VARCHAR(20),  -- uploading, processing, ready, failed
  visibility VARCHAR(20),  -- public, unlisted, private

  -- Engagement (denormalized for performance)
  view_count BIGINT DEFAULT 0,
  like_count INT DEFAULT 0,
  dislike_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,

  -- Timestamps
  uploaded_at TIMESTAMP,
  published_at TIMESTAMP,

  INDEX (channel_id),
  INDEX (status),
  INDEX (uploaded_at)
);

CREATE TABLE channels (
  id BIGINT PRIMARY KEY,
  user_id BIGINT,
  name VARCHAR(100),
  description TEXT,
  subscriber_count BIGINT DEFAULT 0,
  video_count INT DEFAULT 0,
  created_at TIMESTAMP
);
\`\`\`

**Video ID Generation:**
\`\`\`python
# YouTube uses 11-character Base64 IDs
# 64^11 = 73+ quintillion possibilities
import secrets
def generate_video_id():
    return secrets.token_urlsafe(8)[:11]
\`\`\`

**Status Lifecycle:**
\`\`\`
uploading → processing → ready
                ↓
              failed
\`\`\``,

  whyItMatters: 'The metadata schema drives all features: search, recommendations, analytics.',

  realWorldExample: {
    company: 'YouTube',
    scenario: 'Billions of videos',
    howTheyDoIt: 'Vitess (sharded MySQL). Heavy denormalization. Counters updated asynchronously.',
  },

  keyPoints: [
    'Unique video IDs',
    'Denormalized counters',
    'Status tracking',
  ],

  keyConcepts: [
    { title: 'Video ID', explanation: '11-character unique identifier', icon: '🔑' },
    { title: 'Status', explanation: 'Upload lifecycle tracking', icon: '📊' },
  ],
};

const step2: GuidedStep = {
  id: 'youtube-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Store video metadata',
    taskDescription: 'Add Database for video metadata',
    componentsNeeded: [
      { type: 'database', reason: 'Store video metadata', displayName: 'Video Metadata DB' },
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
  scenario: "We're tracking videos, but where's the actual content?",
  hook: "A creator uploads a 2GB video file. The metadata is stored. But when viewers click play... nothing! Where are the actual video bytes?",
  challenge: "Add object storage for video files.",
  illustration: 'object-storage',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 1 Complete! Basic video platform works!',
  achievement: 'Creators can upload, viewers can watch',
  metrics: [
    { label: 'Upload videos', after: '✓ Working' },
    { label: 'Watch videos', after: '✓ Streaming' },
    { label: 'Storage', after: 'S3' },
  ],
  nextTeaser: "But videos only play in original quality...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Video Storage and Streaming',
  conceptExplanation: `**Upload Flow:**
\`\`\`
1. Client → Server: "I want to upload video.mp4 (2GB)"
2. Server: Create video record (status=uploading)
3. Server → Client: Presigned S3 URL
4. Client → S3: Upload directly (streaming)
5. Client → Server: "Upload complete"
6. Server: Update status → processing (triggers pipeline)
\`\`\`

**Presigned Upload:**
\`\`\`python
def initiate_upload(user_id, filename, file_size):
    video_id = generate_video_id()
    storage_key = f"originals/{video_id}/{filename}"

    # Create metadata record
    db.create_video(
        id=video_id,
        channel_id=get_channel_id(user_id),
        status='uploading',
        original_storage_key=storage_key
    )

    # Generate upload URL
    upload_url = s3.generate_presigned_url(
        'put_object',
        Params={'Bucket': 'videohub-uploads', 'Key': storage_key},
        ExpiresIn=3600
    )

    return {'video_id': video_id, 'upload_url': upload_url}
\`\`\`

**Basic Streaming (Progressive Download):**
\`\`\`python
def get_stream_url(video_id):
    video = db.get_video(video_id)

    # For now, just return the original file URL
    # (Phase 2 will add processed versions)
    url = s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': 'videohub-uploads', 'Key': video.original_storage_key},
        ExpiresIn=3600
    )

    return url
\`\`\`

**Note:** This is basic progressive download. Phase 2 adds proper adaptive streaming.`,

  whyItMatters: 'Direct upload to S3 enables handling gigabyte files without server bottleneck.',

  realWorldExample: {
    company: 'YouTube',
    scenario: '500+ hours uploaded per minute',
    howTheyDoIt: 'Direct uploads to Google Cloud Storage. Processing pipeline kicks in immediately.',
  },

  keyPoints: [
    'Direct upload to S3',
    'Presigned URLs',
    'Status tracking',
  ],

  keyConcepts: [
    { title: 'Presigned URL', explanation: 'Time-limited upload URL', icon: '🔐' },
    { title: 'Progressive Download', explanation: 'Stream as you download', icon: '▶️' },
  ],
};

const step3: GuidedStep = {
  id: 'youtube-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1 & FR-2: Store and stream videos',
    taskDescription: 'Add Object Storage for video files',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store video files', displayName: 'Video Storage (S3)' },
    ],
    successCriteria: [
      'Object Storage added',
      'Direct upload enabled',
      'Streaming URL generation works',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Add Object Storage for videos',
    level2: 'Client uploads directly to S3 using presigned URL',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// PHASE 2: INTERMEDIATE - Processing & Engagement
// =============================================================================

// =============================================================================
// STEP 4: Video Transcoding Pipeline (Phase 2)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🎞️',
  scenario: "Phase 2 begins! Videos play terribly on mobile!",
  hook: "A creator uploads a 4K video. Someone on a slow 3G connection tries to watch it. It buffers constantly! We need multiple quality options.",
  challenge: "NEW REQUIREMENT: FR-3 - Process videos into multiple qualities.",
  illustration: 'transcoding',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎞️',
  message: 'Transcoding pipeline working!',
  achievement: 'Videos available in multiple qualities',
  metrics: [
    { label: 'Quality options', after: '240p → 4K' },
    { label: 'Processing', after: 'Async pipeline' },
  ],
  nextTeaser: "Now let's add engagement features...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Video Transcoding Pipeline',

  frameworkReminder: {
    question: "How do we support different quality levels?",
    connection: "FR-3 requires transcoding uploaded videos into multiple resolutions and formats."
  },

  conceptExplanation: `**The Problem:**
- Creator uploads 4K video
- Viewer on mobile with slow connection
- 4K requires ~25 Mbps
- Mobile might only have 2 Mbps
- Result: Endless buffering!

**Solution: Transcode to Multiple Qualities**
\`\`\`
Original 4K upload
    ↓
Transcoding Pipeline
    ↓
├── 240p  (300 Kbps)   ← Slow connections
├── 360p  (500 Kbps)
├── 480p  (1 Mbps)     ← SD
├── 720p  (3 Mbps)     ← HD
├── 1080p (6 Mbps)     ← Full HD
└── 4K    (25 Mbps)    ← Original quality
\`\`\`

**Pipeline Architecture:**
\`\`\`
Upload Complete → Message Queue → Transcoding Workers → S3
                        ↓
              Multiple parallel jobs:
              - Worker 1: Create 240p
              - Worker 2: Create 360p
              - Worker 3: Create 480p
              - ...
\`\`\`

**Implementation:**
\`\`\`python
# On upload complete
async def on_upload_complete(video_id):
    video = db.get_video(video_id)
    video.status = 'processing'
    db.save(video)

    # Queue transcoding jobs
    for quality in ['240p', '360p', '480p', '720p', '1080p']:
        await queue.publish('transcoding-jobs', {
            'video_id': video_id,
            'source_key': video.original_storage_key,
            'target_quality': quality
        })

# Transcoding worker
async def transcode_worker():
    async for job in queue.consume('transcoding-jobs'):
        video_id = job['video_id']
        quality = job['target_quality']

        # Download original
        source = s3.download(job['source_key'])

        # Transcode using FFmpeg
        output = ffmpeg_transcode(source, quality)

        # Upload processed version
        output_key = f"processed/{video_id}/{quality}.mp4"
        s3.upload(output_key, output)

        # Update database
        db.add_video_version(video_id, quality, output_key)
\`\`\`

**HLS Segmentation:**
\`\`\`bash
# Also create HLS segments for adaptive streaming
ffmpeg -i input.mp4 -codec: copy -start_number 0 \\
  -hls_time 10 -hls_list_size 0 -f hls output.m3u8
\`\`\``,

  whyItMatters: 'Transcoding is THE critical path for video platforms. Determines watch experience.',

  realWorldExample: {
    company: 'YouTube',
    scenario: 'Processing 500+ hours/minute',
    howTheyDoIt: 'Massive transcoding cluster. Creates many versions per video. Prioritizes popular uploads.',
  },

  keyPoints: [
    'Multiple quality levels',
    'Async processing pipeline',
    'HLS for adaptive streaming',
  ],

  keyConcepts: [
    { title: 'Transcoding', explanation: 'Converting video format/quality', icon: '🎞️' },
    { title: 'HLS', explanation: 'HTTP Live Streaming', icon: '📺' },
  ],
};

const step4: GuidedStep = {
  id: 'youtube-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Video processing',
    taskDescription: 'Build transcoding pipeline with message queue',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Queue transcoding jobs', displayName: 'Job Queue' },
    ],
    successCriteria: [
      'Add Message Queue',
      'Transcode to multiple qualities',
      'Store processed versions',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Add Message Queue for transcoding jobs',
    level2: 'Upload triggers jobs, workers process async',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 5: Comments and Likes (Phase 2)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '💬',
  scenario: "Viewers want to engage with videos!",
  hook: "A viewer watches an amazing video. They want to say 'Great video!' and hit like. But there's no way to interact! Engagement drives the platform.",
  challenge: "NEW REQUIREMENT: FR-4 - Comments and likes on videos.",
  illustration: 'comments',
};

const step5Celebration: CelebrationContent = {
  emoji: '💬',
  message: 'Engagement features working!',
  achievement: 'Users can like and comment on videos',
  metrics: [
    { label: 'Comments', after: '✓ Working' },
    { label: 'Likes', after: '✓ Working' },
  ],
  nextTeaser: "Now let's add view counting...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Comments and Engagement',

  frameworkReminder: {
    question: "How do viewers interact with content?",
    connection: "FR-4 enables engagement. Comments and likes drive creator motivation and recommendations."
  },

  conceptExplanation: `**Engagement Data Model:**

\`\`\`sql
CREATE TABLE comments (
  id BIGINT PRIMARY KEY,
  video_id VARCHAR(11),
  user_id BIGINT,
  parent_id BIGINT,         -- NULL for top-level, ID for replies
  content TEXT,
  like_count INT DEFAULT 0,
  reply_count INT DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,

  INDEX (video_id, created_at),
  INDEX (parent_id)
);

CREATE TABLE video_likes (
  video_id VARCHAR(11),
  user_id BIGINT,
  is_like BOOLEAN,  -- true = like, false = dislike
  created_at TIMESTAMP,
  PRIMARY KEY (video_id, user_id)
);

CREATE TABLE comment_likes (
  comment_id BIGINT,
  user_id BIGINT,
  created_at TIMESTAMP,
  PRIMARY KEY (comment_id, user_id)
);
\`\`\`

**Like/Unlike Flow:**
\`\`\`python
async def toggle_like(video_id, user_id, is_like):
    existing = db.get_video_like(video_id, user_id)

    if existing:
        if existing.is_like == is_like:
            # Remove like/dislike
            db.delete_video_like(video_id, user_id)
            await update_like_count(video_id, is_like, -1)
        else:
            # Switch like to dislike or vice versa
            db.update_video_like(video_id, user_id, is_like)
            await update_like_count(video_id, existing.is_like, -1)
            await update_like_count(video_id, is_like, +1)
    else:
        # New like/dislike
        db.create_video_like(video_id, user_id, is_like)
        await update_like_count(video_id, is_like, +1)

async def update_like_count(video_id, is_like, delta):
    # Use Redis for real-time count, async write to DB
    field = 'like_count' if is_like else 'dislike_count'
    await redis.hincrby(f"video:{video_id}", field, delta)
    await queue.publish('count-updates', {
        'video_id': video_id,
        'field': field,
        'delta': delta
    })
\`\`\`

**Comment Threading:**
\`\`\`
Comment 1 (parent_id = NULL)
├── Reply 1a (parent_id = 1)
├── Reply 1b (parent_id = 1)
│   └── Reply 1b-i (parent_id = 1b)  -- Nested reply
└── Reply 1c (parent_id = 1)
Comment 2 (parent_id = NULL)
\`\`\``,

  whyItMatters: 'Engagement signals drive recommendations and creator motivation.',

  realWorldExample: {
    company: 'YouTube',
    scenario: 'Handling millions of comments',
    howTheyDoIt: 'Comments in Spanner. Like counts eventually consistent. Spam detection ML.',
  },

  keyPoints: [
    'Separate tables for likes and comments',
    'Redis for real-time counts',
    'Threaded comments with parent_id',
  ],

  keyConcepts: [
    { title: 'Engagement', explanation: 'Likes, comments, shares', icon: '❤️' },
    { title: 'Threaded Comments', explanation: 'Nested replies', icon: '💬' },
  ],
};

const step5: GuidedStep = {
  id: 'youtube-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-4: Comments and likes',
    taskDescription: 'Implement engagement features',
    componentsNeeded: [
      { type: 'cache', reason: 'Real-time counters', displayName: 'Redis Counters' },
    ],
    successCriteria: [
      'Add comments table',
      'Add like/dislike functionality',
      'Real-time counter updates',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add Redis for real-time counters',
    level2: 'Like/comment tables, Redis for counts, async DB writes',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 6: View Counting (Phase 2 Complete)
// =============================================================================

const step6Story: StoryContent = {
  emoji: '👁️',
  scenario: "How do we count video views?",
  hook: "A video is going viral! Thousands of people are watching. But the view count says '0'. Views are the currency of video platforms!",
  challenge: "Implement accurate view counting at scale.",
  illustration: 'view-counting',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 2 Complete! Full-featured video platform!',
  achievement: 'Transcoding, comments, likes, and view counting',
  metrics: [
    { label: 'Transcoding', after: 'Async pipeline' },
    { label: 'Engagement', after: 'Comments + Likes' },
    { label: 'View counting', after: 'Real-time' },
  ],
  nextTeaser: "Phase 3: Handling viral videos!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'View Counting at Scale',

  frameworkReminder: {
    question: "How do we count views accurately?",
    connection: "View counts must be accurate but also handle millions of concurrent views."
  },

  conceptExplanation: `**The Challenge:**
- Viral video: 1M+ views per hour
- Can't write to database on every view
- Must be accurate (no duplicates)
- Must be real-time (viewers see count)

**Solution: Layered Counting**

**Layer 1: Real-Time (Redis)**
\`\`\`python
async def record_view(video_id, user_id, session_id):
    # Deduplicate: only count once per user per hour
    dedup_key = f"view:{video_id}:{user_id}:{hour_bucket()}"
    if await redis.setnx(dedup_key, 1):
        await redis.expire(dedup_key, 3600)

        # Increment real-time counter
        await redis.hincrby(f"video:{video_id}", "view_count", 1)

        # Queue for persistence
        await queue.publish('view-events', {
            'video_id': video_id,
            'user_id': user_id,
            'timestamp': now()
        })
\`\`\`

**Layer 2: Async Persistence (Queue Worker)**
\`\`\`python
async def view_count_worker():
    batch = []
    async for event in queue.consume('view-events'):
        batch.append(event)

        if len(batch) >= 1000:
            # Batch update to database
            await batch_update_view_counts(batch)
            batch = []
\`\`\`

**Layer 3: Database (Source of Truth)**
\`\`\`sql
-- Periodic reconciliation
UPDATE videos v
SET view_count = (
  SELECT COUNT(*) FROM video_views vv
  WHERE vv.video_id = v.id
)
WHERE v.id IN (SELECT DISTINCT video_id FROM video_views WHERE counted = false);
\`\`\`

**View Event Schema:**
\`\`\`sql
CREATE TABLE video_views (
  id BIGINT PRIMARY KEY,
  video_id VARCHAR(11),
  user_id BIGINT,
  watch_duration_seconds INT,
  percentage_watched DECIMAL(5,2),
  created_at TIMESTAMP,
  INDEX (video_id, created_at)
);
\`\`\``,

  whyItMatters: 'View counts are the primary metric. Accuracy affects creator trust and ad revenue.',

  famousIncident: {
    title: 'YouTube Frozen View Counts',
    company: 'YouTube',
    year: '2012',
    whatHappened: 'YouTube would freeze view counts at 301 while verifying legitimacy. Became a meme.',
    lessonLearned: 'Fraud detection is essential but shouldn\'t break user experience.',
    icon: '🔢',
  },

  realWorldExample: {
    company: 'YouTube',
    scenario: 'Counting billions of views',
    howTheyDoIt: 'Real-time counters with fraud detection. Freezes suspicious videos for review.',
  },

  keyPoints: [
    'Redis for real-time counts',
    'Batch writes to database',
    'Deduplication per user/time',
  ],

  keyConcepts: [
    { title: 'Deduplication', explanation: 'Prevent double-counting', icon: '🔢' },
    { title: 'Batch Writes', explanation: 'Group updates for efficiency', icon: '📦' },
  ],
};

const step6: GuidedStep = {
  id: 'youtube-step-6',
  stepNumber: 6,
  frIndex: 1,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'NFR: Accurate view counting',
    taskDescription: 'Implement scalable view counting',
    successCriteria: [
      'Real-time counts in Redis',
      'Deduplication per user',
      'Async persistence to database',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Redis for real-time, queue for persistence',
    level2: 'SETNX for dedup, batch writes to DB',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// PHASE 3: ADVANCED - Scale & Discovery
// =============================================================================

// =============================================================================
// STEP 7: CDN for Video Delivery (Phase 3)
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🌐',
  scenario: "Phase 3 begins! A video just went VIRAL!",
  hook: "A funny cat video is exploding! 10 million views in an hour. Your origin servers are melting! S3 bandwidth costs are astronomical!",
  challenge: "Add CDN to handle viral videos.",
  illustration: 'cdn',
};

const step7Celebration: CelebrationContent = {
  emoji: '🌐',
  message: 'CDN is serving videos globally!',
  achievement: 'Viral videos handled efficiently',
  metrics: [
    { label: 'Origin load', before: 'Overwhelmed', after: '< 1%' },
    { label: 'Global latency', after: '< 50ms' },
  ],
  nextTeaser: "Now let's add search...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'CDN for Video Delivery',

  frameworkReminder: {
    question: "How do we handle viral videos?",
    connection: "Viral content can be viewed millions of times. CDN caches at the edge, reducing origin load."
  },

  conceptExplanation: `**The Problem:**
\`\`\`
Viral video: 10M views in 1 hour
Without CDN: 10M requests to S3
S3 bandwidth cost: ~$900 (1TB at $0.09/GB)
Origin server: Overloaded
\`\`\`

**With CDN:**
\`\`\`
First request: CDN → S3 (cache miss)
Next 9,999,999: CDN → Edge cache (cache hit!)
Origin requests: ~100 (0.001%)
Cost: ~$100 (CDN is cheaper per GB)
\`\`\`

**CDN Architecture:**
\`\`\`
Viewer → CDN Edge (LA) → Cache hit!
                       ↓ (miss)
                   Origin (S3)
\`\`\`

**HLS with CDN:**
\`\`\`
video_abc123/
├── manifest.m3u8        ← Cached
├── 720p/
│   ├── segment_001.ts   ← Cached
│   ├── segment_002.ts   ← Cached
│   └── ...
└── 1080p/
    └── ...
\`\`\`

**CDN Configuration:**
\`\`\`
Origin: s3://videohub-processed
CDN URL: https://cdn.videohub.com/

Cache rules:
- Video segments (.ts): 1 year (immutable)
- Manifest (.m3u8): 10 seconds (may update)
- Thumbnails: 1 day
\`\`\`

**Pre-Warming for Expected Viral:**
\`\`\`python
# When a video is processing, pre-warm CDN
async def on_processing_complete(video_id):
    cdn.prefetch([
        f"videos/{video_id}/manifest.m3u8",
        f"videos/{video_id}/720p/segment_001.ts",
        # First few segments
    ])
\`\`\``,

  whyItMatters: 'CDN is essential for video. Without it, you can\'t survive a viral video.',

  famousIncident: {
    title: 'Gangnam Style CDN Challenge',
    company: 'YouTube',
    year: '2012',
    whatHappened: 'Gangnam Style broke YouTube\'s 32-bit view counter. Also stressed CDN infrastructure with unprecedented demand.',
    lessonLearned: 'Plan for orders of magnitude more traffic than expected.',
    icon: '📈',
  },

  realWorldExample: {
    company: 'YouTube',
    scenario: 'Serving 1B+ hours of video daily',
    howTheyDoIt: 'Google\'s global CDN. Edge caches in every major ISP. Pre-populates popular content.',
  },

  keyPoints: [
    'Cache video segments at edge',
    'Long TTL for immutable content',
    'Pre-warm for expected viral',
  ],

  keyConcepts: [
    { title: 'CDN', explanation: 'Content Delivery Network', icon: '🌐' },
    { title: 'Edge Cache', explanation: 'Server close to users', icon: '📍' },
  ],
};

const step7: GuidedStep = {
  id: 'youtube-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'NFR: Handle viral videos',
    taskDescription: 'Add CDN for video delivery',
    componentsNeeded: [
      { type: 'cdn', reason: 'Cache videos at edge', displayName: 'Video CDN' },
    ],
    successCriteria: [
      'Add CDN',
      'CDN serves from Object Storage',
      'Viewers fetch from CDN',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage', 'message_queue', 'cache', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
  },

  hints: {
    level1: 'Add CDN between viewers and Object Storage',
    level2: 'Client → CDN for videos, CDN → S3 on cache miss',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [
      { from: 'cdn', to: 'object_storage' },
      { from: 'client', to: 'cdn' },
    ],
  },
};

// =============================================================================
// STEP 8: Video Search (Phase 3)
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🔍',
  scenario: "Users can't find videos!",
  hook: "There are millions of videos on the platform. A user searches for 'funny cat videos' and gets... nothing useful. Search is essential for discovery!",
  challenge: "Implement video search.",
  illustration: 'search',
};

const step8Celebration: CelebrationContent = {
  emoji: '🔍',
  message: 'Search is working!',
  achievement: 'Users can find videos by keywords',
  metrics: [
    { label: 'Search', after: '✓ Full-text' },
    { label: 'Response time', after: '< 100ms' },
  ],
  nextTeaser: "Now let's add load balancing...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Video Search Index',

  frameworkReminder: {
    question: "How do users find videos?",
    connection: "Full-text search on titles, descriptions, and tags. Search index separate from database."
  },

  conceptExplanation: `**Why Not Just Database Search?**
\`\`\`sql
-- This is slow and limited
SELECT * FROM videos
WHERE title LIKE '%funny cats%'
OR description LIKE '%funny cats%';
\`\`\`
- No relevance ranking
- No fuzzy matching
- Slow at scale

**Solution: Search Index (Elasticsearch)**

**Index Schema:**
\`\`\`json
{
  "mappings": {
    "properties": {
      "video_id": { "type": "keyword" },
      "title": {
        "type": "text",
        "analyzer": "english"
      },
      "description": { "type": "text" },
      "tags": { "type": "keyword" },
      "channel_name": { "type": "text" },
      "category": { "type": "keyword" },
      "view_count": { "type": "long" },
      "like_count": { "type": "long" },
      "upload_date": { "type": "date" }
    }
  }
}
\`\`\`

**Search Query:**
\`\`\`python
def search_videos(query, filters=None):
    body = {
        "query": {
            "bool": {
                "must": {
                    "multi_match": {
                        "query": query,
                        "fields": ["title^3", "description", "tags^2"],
                        "fuzziness": "AUTO"
                    }
                },
                "filter": filters or []
            }
        },
        "sort": [
            "_score",
            {"view_count": "desc"}
        ]
    }
    return es.search(index="videos", body=body)
\`\`\`

**Indexing on Upload:**
\`\`\`python
async def index_video(video):
    await es.index(
        index="videos",
        id=video.id,
        body={
            "video_id": video.id,
            "title": video.title,
            "description": video.description,
            "tags": video.tags,
            "channel_name": video.channel.name,
            "view_count": video.view_count,
            "upload_date": video.uploaded_at
        }
    )
\`\`\`

**Autocomplete:**
\`\`\`json
{
  "suggest": {
    "title-suggest": {
      "prefix": "fun",
      "completion": { "field": "title_suggest" }
    }
  }
}
\`\`\``,

  whyItMatters: 'Search is how users discover content. Poor search = poor engagement.',

  realWorldExample: {
    company: 'YouTube',
    scenario: 'Searching billions of videos',
    howTheyDoIt: 'Custom search infrastructure. Considers title, description, transcript, engagement signals.',
  },

  keyPoints: [
    'Elasticsearch for full-text search',
    'Weight title higher than description',
    'Include engagement signals in ranking',
  ],

  keyConcepts: [
    { title: 'Search Index', explanation: 'Elasticsearch for text search', icon: '🔍' },
    { title: 'Relevance', explanation: 'Rank results by quality', icon: '📊' },
  ],
};

const step8: GuidedStep = {
  id: 'youtube-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'NFR: Video search',
    taskDescription: 'Implement video search with Elasticsearch',
    successCriteria: [
      'Create search index',
      'Index videos on upload',
      'Full-text search with ranking',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage', 'message_queue', 'cache', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
  },

  hints: {
    level1: 'Use Elasticsearch for search index',
    level2: 'Index title, description, tags with relevance weighting',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 9: Load Balancing (Phase 3 Complete)
// =============================================================================

const step9Story: StoryContent = {
  emoji: '⚖️',
  scenario: "Your single API server can't keep up!",
  hook: "Millions of users browsing, searching, commenting. One server handling all API requests. It's overloaded!",
  challenge: "Add load balancing for horizontal scale.",
  illustration: 'load-balancer',
};

const step9Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 3 Complete! Scalable video platform!',
  achievement: 'CDN, search, and horizontal scaling',
  metrics: [
    { label: 'Video delivery', after: 'CDN' },
    { label: 'Search', after: 'Elasticsearch' },
    { label: 'API', after: 'Load balanced' },
  ],
  nextTeaser: "Phase 4: Recommendations and live streaming!",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing API Servers',

  frameworkReminder: {
    question: "How do we handle millions of API requests?",
    connection: "Single server has limits. Load balancer distributes traffic across multiple servers."
  },

  conceptExplanation: `**The Math:**
- 10M daily active users
- Average 50 API calls per session
- 500M API calls/day
- Peak: ~20,000 requests/second
- One server: ~1,000 req/s max
- Servers needed: 20+

**Architecture:**
\`\`\`
Clients → Load Balancer → API Server 1
                       → API Server 2
                       → ...
                       → API Server N
\`\`\`

**Stateless API:**
\`\`\`python
# No session state on server
# Auth from JWT token
@app.route('/api/videos')
def list_videos():
    user = verify_jwt(request.headers['Authorization'])
    # Query database, not local state
    videos = db.get_trending_videos()
    return videos
\`\`\`

**Health Checks:**
\`\`\`yaml
health_check:
  endpoint: /health
  interval: 10s
  timeout: 5s
  unhealthy_threshold: 3
\`\`\`

**Auto-Scaling:**
\`\`\`yaml
scaling:
  min_instances: 10
  max_instances: 100
  target_cpu: 70%
  scale_up_cooldown: 60s
  scale_down_cooldown: 300s
\`\`\``,

  whyItMatters: 'Horizontal scaling is essential for any large platform.',

  realWorldExample: {
    company: 'YouTube',
    scenario: 'Handling billions of requests',
    howTheyDoIt: 'Google Front End (GFE) load balancers. Auto-scaling microservices.',
  },

  keyPoints: [
    'Stateless API servers',
    'Auto-scaling based on load',
    'Health checks for reliability',
  ],

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes traffic', icon: '⚖️' },
    { title: 'Stateless', explanation: 'No server-side session', icon: '🔄' },
  ],
};

const step9: GuidedStep = {
  id: 'youtube-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'NFR: Handle millions of requests',
    taskDescription: 'Add load balancer',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute API traffic', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Add Load Balancer',
      'Stateless API servers',
      'Auto-scaling enabled',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'message_queue', 'cache', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
  },

  hints: {
    level1: 'Add LB between clients and API servers',
    level2: 'Client → LB → multiple stateless servers',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// PHASE 4: EXPERT - Recommendations & Live
// =============================================================================

// =============================================================================
// STEP 10: Recommendation Engine (Phase 4)
// =============================================================================

const step10Story: StoryContent = {
  emoji: '🎯',
  scenario: "Phase 4 begins! Users don't know what to watch!",
  hook: "There are 100 million videos. Users watch one video and then... leave. They don't know what to watch next! Recommendations keep users engaged.",
  challenge: "Build a recommendation engine.",
  illustration: 'recommendations',
};

const step10Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Recommendations working!',
  achievement: 'Personalized video suggestions for every user',
  metrics: [
    { label: 'Personalization', after: '✓ Per user' },
    { label: 'Watch time', after: '+40%' },
  ],
  nextTeaser: "Now let's add live streaming...",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Video Recommendation Engine',

  frameworkReminder: {
    question: "How do we keep users engaged?",
    connection: "Recommendations suggest videos users will enjoy. Drives 70%+ of YouTube watch time."
  },

  conceptExplanation: `**Why Recommendations Matter:**
- 100M+ videos to choose from
- Users can't browse everything
- Good recommendations = more watch time
- 70% of YouTube views come from recommendations

**Recommendation Signals:**

**1. User History:**
\`\`\`python
def get_user_signals(user_id):
    return {
        'watched': get_watch_history(user_id),
        'liked': get_liked_videos(user_id),
        'subscriptions': get_subscribed_channels(user_id),
        'search_history': get_search_queries(user_id)
    }
\`\`\`

**2. Video Attributes:**
\`\`\`
- Category/genre
- Tags
- Channel
- Duration
- Engagement rate
\`\`\`

**3. Collaborative Filtering:**
\`\`\`
"Users who watched X also watched Y"
User A watched: [1, 2, 3, 4]
User B watched: [1, 2, 3, 5]
User C watched: [1, 2, 6]

If you watched [1, 2, 3] → recommend [4, 5]
\`\`\`

**Simple Implementation:**
\`\`\`python
def get_recommendations(user_id, limit=20):
    user_signals = get_user_signals(user_id)
    candidates = []

    # 1. More from subscriptions
    for channel in user_signals['subscriptions'][:5]:
        candidates += get_recent_videos(channel, limit=10)

    # 2. Similar to watched
    for video in user_signals['watched'][-10:]:
        candidates += get_similar_videos(video, limit=5)

    # 3. Trending in same categories
    favorite_categories = get_favorite_categories(user_id)
    for cat in favorite_categories[:3]:
        candidates += get_trending_in_category(cat, limit=10)

    # Score and rank
    scored = []
    for video in dedupe(candidates):
        score = calculate_relevance_score(video, user_signals)
        scored.append((video, score))

    return sorted(scored, key=lambda x: -x[1])[:limit]
\`\`\`

**Recommendation Feeds:**
- Home page: Personalized mix
- Up Next: Watch flow continuation
- Related: Similar to current video`,

  whyItMatters: 'Recommendations drive the majority of watch time on video platforms.',

  realWorldExample: {
    company: 'YouTube',
    scenario: 'Personalized recommendations',
    howTheyDoIt: 'Deep learning models. Considers 100s of signals. A/B tests constantly.',
  },

  keyPoints: [
    'User history + video attributes',
    'Collaborative filtering',
    'Score and rank candidates',
  ],

  keyConcepts: [
    { title: 'Collaborative Filtering', explanation: 'Similar users like similar content', icon: '👥' },
    { title: 'Content-Based', explanation: 'Recommend similar content', icon: '📝' },
  ],
};

const step10: GuidedStep = {
  id: 'youtube-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'NFR: Personalized recommendations',
    taskDescription: 'Build recommendation engine',
    successCriteria: [
      'Track user watch history',
      'Generate personalized recommendations',
      'Home page and related videos',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'message_queue', 'cache', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
  },

  hints: {
    level1: 'Track history, generate candidates, score and rank',
    level2: 'Combine subscriptions + similar + trending, personalize per user',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 11: Live Streaming (Phase 4)
// =============================================================================

const step11Story: StoryContent = {
  emoji: '📡',
  scenario: "Creators want to stream LIVE!",
  hook: "A popular creator wants to do a live Q&A. Pre-recorded videos aren't enough. Live streaming enables real-time connection with audiences!",
  challenge: "Implement live video streaming.",
  illustration: 'live-streaming',
};

const step11Celebration: CelebrationContent = {
  emoji: '📡',
  message: 'Live streaming working!',
  achievement: 'Creators can broadcast live to audiences',
  metrics: [
    { label: 'Live streams', after: '✓ Working' },
    { label: 'Latency', after: '< 5 seconds' },
  ],
  nextTeaser: "One final step: monetization!",
};

const step11LearnPhase: TeachingContent = {
  conceptTitle: 'Live Streaming Architecture',

  frameworkReminder: {
    question: "How is live different from video-on-demand?",
    connection: "Live has real-time constraints. Content is generated as viewers watch. Latency matters."
  },

  conceptExplanation: `**Live vs VOD:**
| Aspect | VOD | Live |
|--------|-----|------|
| Content | Pre-recorded | Real-time |
| Processing | Ahead of time | Real-time |
| Latency | Doesn't matter | Critical |
| Failure | Retry | Lost forever |

**Live Streaming Flow:**
\`\`\`
Streamer → RTMP Ingest → Transcoding → HLS → CDN → Viewers
                              ↓
                       (real-time!)
\`\`\`

**Ingest (Streamer Upload):**
\`\`\`
Protocol: RTMP (Real-Time Messaging Protocol)
Bitrate: 3-6 Mbps for 1080p
Keyframe: Every 2 seconds
\`\`\`

**Real-Time Transcoding:**
\`\`\`python
# Unlike VOD, can't transcode entire file
# Must process in real-time as chunks arrive

async def live_transcode(stream_id, chunk):
    # Transcode chunk to multiple qualities
    outputs = {}
    for quality in ['360p', '720p', '1080p']:
        outputs[quality] = ffmpeg_transcode_chunk(chunk, quality)

    # Create HLS segments immediately
    for quality, data in outputs.items():
        segment = create_hls_segment(data)
        await upload_segment(stream_id, quality, segment)
        await update_manifest(stream_id, quality)
\`\`\`

**Low Latency HLS:**
\`\`\`
Standard HLS: 20-30 second latency (buffering)
Low-Latency HLS: 2-5 second latency
  - Shorter segments (2 sec vs 10 sec)
  - Partial segments (push before complete)
  - Playlist update hints
\`\`\`

**Live Chat:**
\`\`\`python
# WebSocket for real-time chat
async def live_chat_handler(stream_id, user_id, message):
    # Rate limit
    if await is_rate_limited(user_id):
        return

    # Store and broadcast
    await db.store_chat_message(stream_id, user_id, message)
    await broadcast_to_viewers(stream_id, {
        'type': 'chat',
        'user': user_id,
        'message': message
    })
\`\`\``,

  whyItMatters: 'Live streaming enables real-time connection. Different technical challenges than VOD.',

  realWorldExample: {
    company: 'YouTube Live',
    scenario: 'Live streaming to millions',
    howTheyDoIt: 'RTMP ingest. Real-time transcoding cluster. Low-latency HLS. DVR for rewind.',
  },

  keyPoints: [
    'RTMP for ingest',
    'Real-time transcoding',
    'Low-latency HLS for delivery',
  ],

  keyConcepts: [
    { title: 'RTMP', explanation: 'Real-Time Messaging Protocol', icon: '📡' },
    { title: 'Low-Latency HLS', explanation: '< 5 sec stream delay', icon: '⚡' },
  ],
};

const step11: GuidedStep = {
  id: 'youtube-step-11',
  stepNumber: 11,
  frIndex: 0,

  story: step11Story,
  learnPhase: step11LearnPhase,

  practicePhase: {
    frText: 'NFR: Live streaming',
    taskDescription: 'Implement live video streaming',
    successCriteria: [
      'RTMP ingest from streamers',
      'Real-time transcoding',
      'Low-latency delivery to viewers',
    ],
  },

  celebration: step11Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'message_queue', 'cache', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
  },

  hints: {
    level1: 'RTMP ingest, real-time transcode, HLS delivery',
    level2: 'Short segments, fast manifest updates, CDN distribution',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 12: Monetization (Ads) (Phase 4 Complete)
// =============================================================================

const step12Story: StoryContent = {
  emoji: '💰',
  scenario: "How do creators make money?",
  hook: "Creators need revenue to keep making content. Viewers are willing to watch ads. Advertisers want to reach audiences. Everyone wins with ads!",
  challenge: "Implement video advertising.",
  illustration: 'monetization',
};

const step12Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You\'ve mastered YouTube system design!',
  achievement: 'From basic upload to full video platform with monetization',
  metrics: [
    { label: 'Videos', after: 'Millions' },
    { label: 'Processing', after: 'Transcoding pipeline' },
    { label: 'Delivery', after: 'Global CDN' },
    { label: 'Features', after: 'Search, Recommendations, Live, Ads' },
  ],
  nextTeaser: "You've completed the YouTube journey!",
};

const step12LearnPhase: TeachingContent = {
  conceptTitle: 'Video Advertising',

  frameworkReminder: {
    question: "How do video platforms make money?",
    connection: "Ads fund the platform and pay creators. Targeted ads are more valuable."
  },

  conceptExplanation: `**Ad Types:**
\`\`\`
Pre-roll:  Before video starts
Mid-roll:  During video (8+ min videos)
Post-roll: After video ends
Display:   Banner/overlay during video
\`\`\`

**Ad Serving Flow:**
\`\`\`
1. User clicks play
2. Player → Ad Server: "Video X starting, User Y"
3. Ad Server: Select best ad based on targeting
4. Ad Server → Player: Ad URL + tracking
5. Player: Show ad
6. Player → Ad Server: Ad viewed/clicked
7. Player: Start actual video
\`\`\`

**Ad Selection:**
\`\`\`python
def select_ad(video_id, user_id, ad_slot_type):
    # Get targeting info
    video = get_video(video_id)
    user = get_user_profile(user_id)

    # Find matching campaigns
    campaigns = get_active_campaigns(
        category=video.category,
        demographics=user.demographics,
        interests=user.interests
    )

    # Auction: highest bidder wins
    winner = max(campaigns, key=lambda c: c.bid_amount)

    # Return ad creative
    return {
        'ad_url': winner.video_url,
        'duration': winner.duration,
        'skip_after': 5,  # Can skip after 5 seconds
        'tracking_url': generate_tracking_url(winner, user_id)
    }
\`\`\`

**Revenue Split:**
\`\`\`
Advertiser pays: $10 CPM (per 1000 views)
Platform keeps: 45% ($4.50)
Creator gets: 55% ($5.50)
\`\`\`

**Ad Metrics:**
\`\`\`sql
CREATE TABLE ad_impressions (
  id BIGINT PRIMARY KEY,
  ad_id BIGINT,
  video_id VARCHAR(11),
  user_id BIGINT,
  watched_duration_seconds INT,
  skipped BOOLEAN,
  clicked BOOLEAN,
  created_at TIMESTAMP
);
\`\`\``,

  whyItMatters: 'Ads fund the entire ecosystem. Platform, creators, and free content for viewers.',

  realWorldExample: {
    company: 'YouTube',
    scenario: 'Billions in ad revenue',
    howTheyDoIt: 'Sophisticated ad targeting. Real-time bidding. Creator monetization program.',
  },

  keyPoints: [
    'Pre/mid/post roll ads',
    'Targeting based on user and content',
    'Revenue split with creators',
  ],

  keyConcepts: [
    { title: 'CPM', explanation: 'Cost Per Mille (1000 views)', icon: '💰' },
    { title: 'Ad Targeting', explanation: 'Match ads to audience', icon: '🎯' },
  ],
};

const step12: GuidedStep = {
  id: 'youtube-step-12',
  stepNumber: 12,
  frIndex: 0,

  story: step12Story,
  learnPhase: step12LearnPhase,

  practicePhase: {
    frText: 'NFR: Monetization',
    taskDescription: 'Implement video advertising',
    successCriteria: [
      'Ad selection and serving',
      'Targeting based on user/content',
      'Impression and click tracking',
    ],
  },

  celebration: step12Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'message_queue', 'cache', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
  },

  hints: {
    level1: 'Ad server selects and serves ads',
    level2: 'Target by user + content, track impressions, split revenue',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE PROGRESSIVE TUTORIAL
// =============================================================================

export const youtubeProgressiveGuidedTutorial: GuidedTutorial = {
  problemId: 'youtube-progressive',
  title: 'Design YouTube',
  description: 'Build an evolving video platform from upload to global streaming with monetization',
  difficulty: 'beginner',
  estimatedMinutes: 90,

  welcomeStory: {
    emoji: '📹',
    hook: "Welcome to VideoHub! You're building the next YouTube.",
    scenario: "Your journey: Start with basic video upload, add transcoding and engagement, scale for viral videos, and build recommendations and live streaming.",
    challenge: "Can you build a video platform that handles 500+ hours of uploads per minute?",
  },

  requirementsPhase: phase1Requirements,

  steps: [
    step1, step2, step3,
    step4, step5, step6,
    step7, step8, step9,
    step10, step11, step12,
  ],

  concepts: [
    'Video Metadata vs Content',
    'Direct Upload to S3',
    'Video Transcoding Pipeline',
    'Adaptive Bitrate Streaming',
    'Engagement Features',
    'View Counting at Scale',
    'CDN for Video Delivery',
    'Video Search Index',
    'Load Balancing',
    'Recommendation Engine',
    'Live Streaming',
    'Video Advertising',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, Maintainable Applications',
    'Chapter 4: Encoding and Evolution',
    'Chapter 5: Replication',
    'Chapter 11: Stream Processing',
  ],
};

export default youtubeProgressiveGuidedTutorial;
