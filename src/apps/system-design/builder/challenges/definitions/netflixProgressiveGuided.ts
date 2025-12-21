import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Netflix - Progressive Tutorial (4 Phases)
 *
 * A single evolving tutorial that grows from beginner → intermediate → advanced → expert.
 * Focus: Video streaming, CDN, transcoding, recommendation systems.
 *
 * PHASE 1 - BEGINNER (Steps 1-3):
 * - FR-1: Users browse video catalog
 * - FR-2: Users play videos
 * - Build: Client → Server → Database, basic streaming
 *
 * PHASE 2 - INTERMEDIATE (Steps 4-6):
 * - FR-3: Resume playback
 * - FR-4: Adaptive bitrate streaming
 * - Build: CDN, video chunks, multi-quality
 *
 * PHASE 3 - ADVANCED (Steps 7-9):
 * - NFR: Handle 200M users streaming
 * - Video transcoding pipeline
 * - Build: Async processing, caching, load balancing
 *
 * PHASE 4 - EXPERT (Steps 10-12):
 * - Recommendation engine
 * - Personalized thumbnails
 * - Multi-region global distribution
 *
 * Key Teaching: Video is HUGE! CDN and transcoding are essential.
 */

// =============================================================================
// PHASE 1: BEGINNER REQUIREMENTS (Steps 1-3)
// =============================================================================

const phase1Requirements: RequirementsGatheringContent = {
  problemStatement: "Design a video streaming platform like Netflix",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Product Manager at StreamFlix',
    avatar: '👩‍💼',
  },

  questions: [
    {
      id: 'browse-catalog',
      category: 'functional',
      question: "What's the first thing users do when they open the app?",
      answer: "Users browse the video catalog! They see rows of movies and shows, search for content, and explore different categories.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Start with content discovery",
    },
    {
      id: 'play-video',
      category: 'functional',
      question: "What's the core action users want to take?",
      answer: "Watch videos! They click play and the video should start streaming immediately. No downloads, instant playback.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Streaming is the core feature",
    },
  ],

  minimumQuestionsRequired: 2,
  criticalQuestionIds: ['browse-catalog', 'play-video'],
  criticalFRQuestionIds: ['browse-catalog', 'play-video'],
  criticalScaleQuestionIds: [],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users browse video catalog',
      description: 'Browse, search, and discover video content',
      emoji: '🎬',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users play videos',
      description: 'Stream videos instantly without downloading',
      emoji: '▶️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50,000',
    writesPerDay: '1,000 uploads',
    readsPerDay: '500,000 video plays',
    peakMultiplier: 3,
    readWriteRatio: '500:1',
    calculatedWriteRPS: { average: 0.01, peak: 0.05 },
    calculatedReadRPS: { average: 5, peak: 20 },
    maxPayloadSize: 'Videos: 1-5GB each',
    storagePerRecord: '~2GB average',
    storageGrowthPerYear: '~2TB',
    redirectLatencySLA: 'Video start < 2s',
    createLatencySLA: 'Upload < 30 min',
  },

  architecturalImplications: [
    '✅ Read-heavy workload (500:1 ratio)',
    '✅ Large files need special storage',
    '✅ Metadata vs video storage separation',
  ],

  outOfScope: [
    'Resume playback (Phase 2)',
    'Adaptive bitrate (Phase 2)',
    'Transcoding (Phase 3)',
    'Recommendations (Phase 4)',
  ],

  keyInsight: "Netflix is READ-HEAVY. For every 1 upload, there are 500+ plays. Videos are HUGE (gigabytes), so we can't serve them like regular API data. CDNs are essential.",

  thinkingFramework: {
    title: "Phase 1: Basic Video Streaming",
    intro: "We have 2 simple requirements. Let's build basic catalog browsing and video playback.",

    steps: [
      {
        id: 'separate-concerns',
        title: 'Step 1: Metadata vs Video',
        alwaysAsk: "What data do we need to store?",
        whyItMatters: "Videos are gigabytes. Metadata (titles, descriptions) is kilobytes. They need different storage.",
        expertBreakdown: {
          intro: "Two types of data:",
          points: [
            "Metadata: title, description, cast, genre → Database",
            "Videos: actual video files → Object Storage (S3)",
            "Thumbnails: preview images → Object Storage + CDN",
            "Never put videos in your database!"
          ]
        },
        icon: '📁',
        category: 'functional'
      },
      {
        id: 'streaming-basics',
        title: 'Step 2: How Does Streaming Work?',
        alwaysAsk: "How do users watch videos?",
        whyItMatters: "Users don't download the whole video. They stream chunks as they watch.",
        expertBreakdown: {
          intro: "Streaming basics:",
          points: [
            "Video split into chunks (2-10 seconds each)",
            "Player requests chunks as needed",
            "Buffering: download ahead while watching",
            "HTTP-based streaming (HLS, DASH)"
          ]
        },
        icon: '▶️',
        category: 'functional'
      }
    ],

    startSimple: {
      title: "Phase 1 Architecture",
      description: "Client → Server → Database (metadata) + Object Storage (videos).",
      whySimple: "This works for a small streaming service. We'll add CDN and transcoding later.",
      nextStepPreview: "Step 1: Set up the catalog browsing"
    }
  },

  scaleFramework: {
    title: "What's Coming Next?",
    intro: "After Phase 1, the platform will evolve:",
    celebrationMessage: "Your basic streaming works!",
    hookMessage: "But videos buffer constantly. And there's no 'Continue Watching'...",
    steps: [
      {
        id: 'resume',
        title: 'Phase 2: Better Experience',
        question: "How do users resume where they left off?",
        whyItMatters: "Nobody wants to find their place manually",
        example: "Store playback position, adaptive quality",
        icon: '⏸️'
      },
      {
        id: 'scale',
        title: 'Phase 3: Scale',
        question: "How do we serve 200M concurrent users?",
        whyItMatters: "Serving GB files to millions requires CDNs",
        example: "Content Delivery Networks, transcoding",
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
  emoji: '🎬',
  scenario: "Welcome to StreamFlix! You're building the next Netflix.",
  hook: "A user just signed up and opened the app. But they see... nothing. No movies, no shows, just an empty screen!",
  challenge: "Set up the basic system so users can browse the video catalog.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your streaming platform is online!',
  achievement: 'Users can connect to your service',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can browse catalog', after: 'Almost!' },
  ],
  nextTeaser: "But where do we store video metadata?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Video Streaming Architecture Basics',
  conceptExplanation: `**The Key Insight: Separation of Concerns**

Video streaming has TWO very different data types:

**1. Metadata (Small, Structured)**
- Title, description, cast, genre
- Ratings, reviews, release year
- Size: ~1KB per video
- Storage: Regular database (PostgreSQL)

**2. Video Files (Huge, Binary)**
- The actual video content
- Size: 1-10GB per video
- Storage: Object storage (S3, GCS)

**NEVER store videos in a database!**

For Phase 1, we'll set up:
- Client (web/mobile app)
- API Server (handles metadata)
- Database (stores metadata)
- Object Storage (stores videos)`,

  whyItMatters: 'Understanding this separation is fundamental to video platforms.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Managing 200M+ subscribers',
    howTheyDoIt: 'Metadata in databases, videos in S3. Completely separate storage and access patterns.',
  },

  keyPoints: [
    'Metadata in database',
    'Videos in object storage',
    'Different storage for different data',
  ],

  keyConcepts: [
    { title: 'Metadata', explanation: 'Small structured data about videos', icon: '📋' },
    { title: 'Object Storage', explanation: 'S3/GCS for large binary files', icon: '🗄️' },
  ],
};

const step1: GuidedStep = {
  id: 'netflix-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users browse video catalog',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'User browsing catalog', displayName: 'StreamFlix App' },
      { type: 'app_server', reason: 'Handles catalog requests', displayName: 'Catalog Service' },
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
  scenario: "Users can connect, but there's no video information!",
  hook: "Your library has 10,000 movies and shows. Each has a title, description, cast, genre, thumbnail URL, and video URL. Where do we store all this?",
  challenge: "Add a database to store video metadata.",
  illustration: 'database',
};

const step2Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Video metadata is stored!',
  achievement: 'Catalog information persisted',
  metrics: [
    { label: 'Videos cataloged', after: '10,000+' },
    { label: 'Metadata stored', after: '✓' },
  ],
  nextTeaser: "Now let's add video storage and playback...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Video Metadata Schema',
  conceptExplanation: `**What Goes in the Database?**

\`\`\`sql
CREATE TABLE videos (
  id BIGINT PRIMARY KEY,
  title VARCHAR(200),
  description TEXT,
  genre VARCHAR(50),
  release_year INT,
  duration_seconds INT,
  rating VARCHAR(10),      -- PG-13, R, etc.
  avg_rating DECIMAL(2,1), -- 4.5 stars

  -- URLs to object storage
  thumbnail_url VARCHAR(500),
  video_url VARCHAR(500),

  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE genres (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  display_order INT
);

CREATE TABLE video_genres (
  video_id BIGINT REFERENCES videos(id),
  genre_id INT REFERENCES genres(id),
  PRIMARY KEY (video_id, genre_id)
);
\`\`\`

**Key Points:**
- Store URLs to videos, not videos themselves
- Many-to-many: videos have multiple genres
- Indexes on genre, rating for fast filtering

**API Response:**
\`\`\`json
{
  "id": 12345,
  "title": "Stranger Things",
  "thumbnail_url": "https://s3.../thumbnail.jpg",
  "video_url": "https://s3.../video.mp4",
  "duration": "51 minutes"
}
\`\`\``,

  whyItMatters: 'Metadata drives the entire browsing experience. Fast queries = snappy UI.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Video catalog',
    howTheyDoIt: 'Uses Cassandra for high availability. Metadata separated from content. Heavy caching.',
  },

  keyPoints: [
    'Store URLs, not videos',
    'Denormalize for read performance',
    'Index for common queries',
  ],

  keyConcepts: [
    { title: 'Metadata', explanation: 'Data about the video', icon: '📝' },
    { title: 'URL Reference', explanation: 'Pointer to actual video file', icon: '🔗' },
  ],
};

const step2: GuidedStep = {
  id: 'netflix-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Store video catalog metadata',
    taskDescription: 'Add Database for video metadata',
    componentsNeeded: [
      { type: 'database', reason: 'Store video metadata', displayName: 'Catalog DB' },
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
// STEP 3: Add Object Storage for Videos (Phase 1 Complete)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '📦',
  scenario: "Users can browse the catalog! But where are the actual videos?",
  hook: "A user clicks 'Play' on a movie. The video_url points to... nothing! We need somewhere to store the actual 5GB video files.",
  challenge: "Add object storage to store and serve video files.",
  illustration: 'object-storage',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 1 Complete! Basic streaming works!',
  achievement: 'Users can browse catalog and play videos',
  metrics: [
    { label: 'Browse catalog', after: '✓ Working' },
    { label: 'Play videos', after: '✓ Streaming' },
    { label: 'Videos stored', after: 'S3 Object Storage' },
  ],
  nextTeaser: "But users lose their place when they stop watching...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage for Videos',
  conceptExplanation: `**Why Object Storage (S3)?**

| Feature | Database | Object Storage |
|---------|----------|----------------|
| Max file size | ~1MB practical | 5TB+ |
| Cost per GB | Expensive | Cheap |
| Access pattern | Random access | Sequential read |
| Query support | Yes | No |
| Best for | Structured data | Large files |

**S3 Basics:**
\`\`\`
Bucket: streamflix-videos/
├── movies/
│   ├── movie_12345.mp4
│   └── movie_12346.mp4
├── shows/
│   └── show_789/
│       ├── s01e01.mp4
│       └── s01e02.mp4
└── thumbnails/
    ├── thumb_12345.jpg
    └── thumb_12346.jpg
\`\`\`

**Direct S3 URL:**
\`\`\`
https://streamflix-videos.s3.amazonaws.com/movies/movie_12345.mp4
\`\`\`

**Presigned URLs (Better):**
\`\`\`python
def get_video_url(video_id):
    # Generate time-limited URL
    url = s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': 'streamflix-videos',
                'Key': f'movies/{video_id}.mp4'},
        ExpiresIn=3600  # 1 hour
    )
    return url
\`\`\``,

  whyItMatters: 'Object storage is designed for large files. It\'s the foundation of all video platforms.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Storing petabytes of video',
    howTheyDoIt: 'Uses AWS S3 for master copies. Billions of objects across multiple regions.',
  },

  keyPoints: [
    'Videos in S3, metadata in DB',
    'Presigned URLs for security',
    'Organized folder structure',
  ],

  keyConcepts: [
    { title: 'Object Storage', explanation: 'S3 for large file storage', icon: '📦' },
    { title: 'Presigned URL', explanation: 'Time-limited access URL', icon: '🔐' },
  ],
};

const step3: GuidedStep = {
  id: 'netflix-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Users play videos',
    taskDescription: 'Add Object Storage for video files',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store video files', displayName: 'Video Storage (S3)' },
    ],
    successCriteria: [
      'Object Storage added',
      'App Server connected to Object Storage',
      'Client can stream from Object Storage',
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
    level1: 'Add Object Storage for video files',
    level2: 'Connect App Server to Object Storage to serve video URLs',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// PHASE 2: INTERMEDIATE - Better Experience
// =============================================================================

// =============================================================================
// STEP 4: Resume Playback (Phase 2)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⏸️',
  scenario: "Phase 2 begins! Users are frustrated...",
  hook: "A user was 45 minutes into a 2-hour movie when they got interrupted. They come back and... have to find their place manually! 'Where's Continue Watching?!'",
  challenge: "NEW REQUIREMENT: FR-3 - Users can resume playback where they left off.",
  illustration: 'resume-playback',
};

const step4Celebration: CelebrationContent = {
  emoji: '⏸️',
  message: 'Resume playback works!',
  achievement: 'Users can continue where they left off',
  metrics: [
    { label: 'Continue Watching', after: '✓ Working' },
    { label: 'Position saved', after: 'Every 10 seconds' },
  ],
  nextTeaser: "But videos keep buffering on slow connections...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Playback Position Tracking',

  frameworkReminder: {
    question: "How do users resume where they left off?",
    connection: "FR-3 requires storing playback position. We need to track progress for every user-video combination."
  },

  conceptExplanation: `**NEW FR-3: Resume Playback**

**Data Model:**
\`\`\`sql
CREATE TABLE watch_history (
  user_id BIGINT,
  video_id BIGINT,
  position_seconds INT,      -- Where they stopped
  duration_seconds INT,      -- Total video length
  percentage_watched DECIMAL(5,2),
  last_watched_at TIMESTAMP,
  completed BOOLEAN,         -- Watched 95%+
  PRIMARY KEY (user_id, video_id)
);
\`\`\`

**Client Updates Position:**
\`\`\`javascript
// Every 10 seconds while playing
setInterval(() => {
  fetch('/api/watch-progress', {
    method: 'POST',
    body: JSON.stringify({
      video_id: currentVideo.id,
      position: videoPlayer.currentTime
    })
  });
}, 10000);
\`\`\`

**Resume Playback:**
\`\`\`javascript
// When video loads
const progress = await fetch(\`/api/watch-progress/\${videoId}\`);
if (progress.position > 0) {
  videoPlayer.currentTime = progress.position;
}
\`\`\`

**"Continue Watching" Row:**
\`\`\`sql
SELECT v.*, wh.position_seconds, wh.percentage_watched
FROM watch_history wh
JOIN videos v ON wh.video_id = v.id
WHERE wh.user_id = ?
  AND wh.completed = false
  AND wh.percentage_watched > 5
ORDER BY wh.last_watched_at DESC
LIMIT 20;
\`\`\``,

  whyItMatters: 'Resume playback is table stakes for streaming. Users expect it.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Continue Watching',
    howTheyDoIt: 'Stores position every few seconds. Syncs across all devices. Shows "Continue Watching" row prominently.',
  },

  keyPoints: [
    'Track user_id + video_id + position',
    'Update frequently (every 10s)',
    'Sync across devices',
  ],

  keyConcepts: [
    { title: 'Watch History', explanation: 'Tracks playback progress', icon: '📊' },
    { title: 'Continue Watching', explanation: 'Resume where you left off', icon: '⏯️' },
  ],
};

const step4: GuidedStep = {
  id: 'netflix-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Users resume playback',
    taskDescription: 'Implement watch progress tracking',
    successCriteria: [
      'Store playback position per user-video',
      'Update position periodically',
      'Resume from last position on load',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Implement watch_history table',
    level2: 'POST position every 10s, GET position on video load',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Adaptive Bitrate Streaming (Phase 2)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📶',
  scenario: "Videos keep buffering on mobile networks!",
  hook: "Users on 4G are seeing constant buffering spinners. Meanwhile, users on fiber optic are watching potato quality. We're serving the SAME video to everyone!",
  challenge: "NEW REQUIREMENT: FR-4 - Adaptive quality based on connection speed.",
  illustration: 'adaptive-streaming',
};

const step5Celebration: CelebrationContent = {
  emoji: '📶',
  message: 'Adaptive streaming works!',
  achievement: 'Quality adjusts to network conditions',
  metrics: [
    { label: 'Quality options', after: '240p → 4K' },
    { label: 'Buffering', before: 'Frequent', after: 'Rare' },
  ],
  nextTeaser: "Now let's add CDN for faster delivery...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Adaptive Bitrate Streaming (ABR)',

  frameworkReminder: {
    question: "How do we handle varying network speeds?",
    connection: "FR-4 requires multiple quality versions. The player switches between them based on bandwidth."
  },

  conceptExplanation: `**The Problem:**
- 4K video: ~25 Mbps required
- Mobile 4G: ~5-20 Mbps (variable)
- Slow wifi: ~2 Mbps
- One size does NOT fit all!

**Solution: Multiple Qualities**
Store MULTIPLE versions of each video:
\`\`\`
video_12345/
├── 240p.mp4   (300 Kbps)   -- Mobile fallback
├── 480p.mp4   (1 Mbps)     -- SD
├── 720p.mp4   (3 Mbps)     -- HD
├── 1080p.mp4  (6 Mbps)     -- Full HD
└── 4k.mp4     (25 Mbps)    -- Ultra HD
\`\`\`

**HLS (HTTP Live Streaming):**
Video split into segments + manifest:
\`\`\`
video_12345/
├── manifest.m3u8           -- Master playlist
├── 720p/
│   ├── segment_001.ts
│   ├── segment_002.ts
│   └── ...
└── 1080p/
    ├── segment_001.ts
    └── ...
\`\`\`

**Manifest File:**
\`\`\`
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=300000
240p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1000000
480p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=3000000
720p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=6000000
1080p/playlist.m3u8
\`\`\`

**Player Logic:**
1. Start with medium quality
2. Measure download speed per segment
3. If buffer is low → switch to lower quality
4. If buffer is full → try higher quality`,

  whyItMatters: 'ABR is THE standard for video streaming. Every major platform uses it.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Streaming to 200M users',
    howTheyDoIt: 'Multiple bitrates per video. Player switches seamlessly. Stores 12+ versions of each title.',
  },

  keyPoints: [
    'Multiple quality versions',
    'HLS/DASH segments',
    'Player adapts to bandwidth',
  ],

  keyConcepts: [
    { title: 'ABR', explanation: 'Adaptive Bitrate Streaming', icon: '📶' },
    { title: 'HLS', explanation: 'HTTP Live Streaming protocol', icon: '📺' },
  ],
};

const step5: GuidedStep = {
  id: 'netflix-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-4: Adaptive quality streaming',
    taskDescription: 'Implement multiple quality versions with HLS',
    successCriteria: [
      'Multiple quality versions per video',
      'HLS manifest file',
      'Player switches based on bandwidth',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Store multiple quality versions',
    level2: 'Create HLS manifest, let player switch automatically',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add CDN (Phase 2 Complete)
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🌐',
  scenario: "Users in Australia are experiencing 5+ second load times!",
  hook: "Your servers are in US-East. When Australian users request a video, it travels 15,000 km. That's 100ms+ latency for EVERY video chunk!",
  challenge: "Add CDN to serve videos from locations close to users.",
  illustration: 'cdn',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 2 Complete! Great streaming experience!',
  achievement: 'Resume playback, adaptive quality, global CDN',
  metrics: [
    { label: 'Resume playback', after: '✓' },
    { label: 'Adaptive quality', after: '240p → 4K' },
    { label: 'CDN coverage', after: 'Global' },
  ],
  nextTeaser: "Phase 3: How do we handle content uploads?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Content Delivery Network (CDN)',

  frameworkReminder: {
    question: "How do we serve videos to users worldwide?",
    connection: "CDN caches content at edge locations. Users get videos from nearby servers, not your origin."
  },

  conceptExplanation: `**The Problem:**
\`\`\`
User in Sydney → Request video → Server in Virginia
Distance: 15,000 km
Latency: 150ms per request
For 500 chunks = 75 seconds of waiting!
\`\`\`

**Solution: CDN**
\`\`\`
User in Sydney → CDN Edge (Sydney) → Cache hit!
Distance: 10 km
Latency: 1ms
\`\`\`

**How CDN Works:**
\`\`\`
First request:
User → CDN Edge → Cache Miss → Origin (S3) → CDN Edge → User
                               ↓
                          Cache video

Subsequent requests:
User → CDN Edge → Cache Hit! → User
\`\`\`

**CDN Configuration:**
\`\`\`
Origin: s3://streamflix-videos
CDN URL: https://cdn.streamflix.com/videos/movie_12345.mp4

Cache rules:
- Videos: Cache for 30 days
- Manifests: Cache for 1 minute
- Thumbnails: Cache for 7 days
\`\`\`

**Popular CDNs:**
- CloudFront (AWS)
- Fastly (Netflix uses this)
- Cloudflare
- Akamai

**Netflix's Approach:**
Netflix actually ships physical servers to ISPs! "Open Connect" program.`,

  whyItMatters: 'CDN is ESSENTIAL for video. Without it, you can\'t scale globally.',

  famousIncident: {
    title: 'Netflix Open Connect',
    company: 'Netflix',
    year: '2012',
    whatHappened: 'Netflix was 30% of US internet traffic. ISPs complained. Netflix solved it by putting servers inside ISP networks.',
    lessonLearned: 'At massive scale, you become the CDN.',
    icon: '📡',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Serving 200M subscribers',
    howTheyDoIt: 'Open Connect: servers deployed inside 1000+ ISPs. 90%+ traffic served from ISP-local caches.',
  },

  keyPoints: [
    'Cache videos at edge locations',
    'Users get content from nearby servers',
    'Cache hit rate is critical',
  ],

  keyConcepts: [
    { title: 'CDN', explanation: 'Edge caching network', icon: '🌐' },
    { title: 'Edge Location', explanation: 'Server near users', icon: '📍' },
  ],
};

const step6: GuidedStep = {
  id: 'netflix-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'NFR: Fast global video delivery',
    taskDescription: 'Add CDN for video delivery',
    componentsNeeded: [
      { type: 'cdn', reason: 'Cache videos globally', displayName: 'CloudFront CDN' },
    ],
    successCriteria: [
      'Add CDN',
      'CDN serves videos from Object Storage',
      'Client fetches from CDN',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
  },

  hints: {
    level1: 'Add CDN between users and Object Storage',
    level2: 'Client → CDN → Object Storage (on cache miss)',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'object_storage' },
    ],
  },
};

// =============================================================================
// PHASE 3: ADVANCED - Scale & Processing
// =============================================================================

// =============================================================================
// STEP 7: Video Transcoding Pipeline (Phase 3)
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🎞️',
  scenario: "Phase 3 begins! Content creators are uploading videos.",
  hook: "A studio uploads a 50GB 4K master video. We need to create 240p, 480p, 720p, 1080p, and 4K versions. Plus HLS segments. This takes HOURS on a single server!",
  challenge: "Build a video transcoding pipeline for async processing.",
  illustration: 'transcoding',
};

const step7Celebration: CelebrationContent = {
  emoji: '🎞️',
  message: 'Transcoding pipeline is running!',
  achievement: 'Videos automatically processed into multiple formats',
  metrics: [
    { label: 'Processing', after: 'Async pipeline' },
    { label: 'Output formats', after: '6 quality levels' },
  ],
  nextTeaser: "Now let's add caching for the catalog...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Video Transcoding Pipeline',

  frameworkReminder: {
    question: "How do we create multiple quality versions?",
    connection: "Transcoding is CPU-intensive. A 2-hour movie takes hours to process. We need async pipelines."
  },

  conceptExplanation: `**The Challenge:**
- Input: 50GB 4K master file
- Output: 6 quality versions + HLS segments
- Processing time: 2-4 hours
- CPU intensive: 100% CPU for hours

**Solution: Async Pipeline**
\`\`\`
Upload → Queue → Workers → Multiple outputs → S3
\`\`\`

**Pipeline Steps:**
\`\`\`
1. UPLOAD
   Content creator uploads master video
   ↓
2. QUEUE
   Message: {video_id: 123, source: "s3://masters/123.mp4"}
   ↓
3. TRANSCODE (parallel workers)
   Worker 1: Create 240p version
   Worker 2: Create 480p version
   Worker 3: Create 720p version
   Worker 4: Create 1080p version
   Worker 5: Create 4K version
   ↓
4. SEGMENT (HLS)
   Split each version into 10-second chunks
   Generate manifest files
   ↓
5. UPLOAD TO CDN
   Push all versions to S3 + invalidate CDN
   ↓
6. UPDATE DATABASE
   Set video status = "ready"
   Store URLs for each quality level
\`\`\`

**FFmpeg Commands:**
\`\`\`bash
# Transcode to 720p
ffmpeg -i input.mp4 -vf scale=-1:720 -c:v h264 -b:v 3M output_720p.mp4

# Create HLS segments
ffmpeg -i output_720p.mp4 -codec: copy -start_number 0 \\
  -hls_time 10 -hls_list_size 0 -f hls output_720p.m3u8
\`\`\`

**Status Tracking:**
\`\`\`sql
CREATE TABLE transcoding_jobs (
  id BIGINT PRIMARY KEY,
  video_id BIGINT,
  status VARCHAR(20),  -- queued, processing, completed, failed
  quality VARCHAR(10),
  progress_percent INT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);
\`\`\``,

  whyItMatters: 'Transcoding is a core component of any video platform. Can\'t scale without async processing.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Processing new content',
    howTheyDoIt: 'Hundreds of encoding servers. Creates 1000s of versions (different devices, qualities). Takes ~8 hours per title.',
  },

  keyPoints: [
    'Async queue-based processing',
    'Parallel workers per quality',
    'FFmpeg for transcoding',
  ],

  keyConcepts: [
    { title: 'Transcoding', explanation: 'Convert video format/quality', icon: '🎞️' },
    { title: 'FFmpeg', explanation: 'Video processing tool', icon: '🔧' },
  ],
};

const step7: GuidedStep = {
  id: 'netflix-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'NFR: Process uploaded videos',
    taskDescription: 'Build transcoding pipeline with message queue',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Queue transcoding jobs', displayName: 'Job Queue' },
    ],
    successCriteria: [
      'Add Message Queue for jobs',
      'Upload triggers transcode job',
      'Workers process in parallel',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage', 'cdn', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
  },

  hints: {
    level1: 'Add Message Queue for transcoding jobs',
    level2: 'Upload → queue job → workers process → update DB when done',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Add Caching for Catalog (Phase 3)
// =============================================================================

const step8Story: StoryContent = {
  emoji: '⚡',
  scenario: "The homepage is loading slowly!",
  hook: "Every user loads the homepage. Every homepage queries the database for the same trending videos. 10 million users = 10 million identical database queries!",
  challenge: "Add caching to reduce database load and speed up the catalog.",
  illustration: 'caching',
};

const step8Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Catalog loads instantly!',
  achievement: 'Redis cache reduces database load by 99%',
  metrics: [
    { label: 'Homepage load', before: '500ms', after: '50ms' },
    { label: 'DB queries', before: '10M/hour', after: '100/hour' },
  ],
  nextTeaser: "Now let's add load balancing...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Caching for Read-Heavy Workloads',

  frameworkReminder: {
    question: "How do we handle millions of identical queries?",
    connection: "Netflix is 500:1 read-heavy. Caching is essential for read performance."
  },

  conceptExplanation: `**The Problem:**
- Homepage: "Trending Now" row
- Same for ALL users
- 10 million requests/hour
- Same database query every time!

**Solution: Redis Cache**
\`\`\`python
def get_trending_videos():
    # Check cache first
    cached = redis.get("trending:videos")
    if cached:
        return json.loads(cached)

    # Cache miss - query database
    videos = db.query("""
        SELECT * FROM videos
        ORDER BY views_last_24h DESC
        LIMIT 20
    """)

    # Store in cache for 5 minutes
    redis.setex("trending:videos", 300, json.dumps(videos))

    return videos
\`\`\`

**What to Cache:**
| Data | TTL | Why |
|------|-----|-----|
| Trending | 5 min | Changes slowly |
| Genre rows | 1 hour | Stable |
| Video metadata | 1 day | Rarely changes |
| User's "Continue Watching" | 1 min | Personalized, changes often |

**Cache Invalidation:**
\`\`\`python
def update_video(video_id, data):
    # Update database
    db.update_video(video_id, data)

    # Invalidate cache
    redis.delete(f"video:{video_id}")
    redis.delete("trending:videos")  # Might affect trending
\`\`\`

**Cache Hit Rate:**
Target: 99%+ for homepage rows
Formula: (cache_hits) / (cache_hits + cache_misses)`,

  whyItMatters: 'Caching is essential for read-heavy applications. Without it, database becomes bottleneck.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Homepage performance',
    howTheyDoIt: 'Multiple cache layers. EVCache (their distributed cache). Pre-computes personalized rows.',
  },

  keyPoints: [
    'Cache identical queries',
    'Short TTL for dynamic data',
    'Invalidate on updates',
  ],

  keyConcepts: [
    { title: 'Cache', explanation: 'Fast in-memory storage', icon: '⚡' },
    { title: 'TTL', explanation: 'Time To Live for cache', icon: '⏰' },
  ],
};

const step8: GuidedStep = {
  id: 'netflix-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'NFR: Fast catalog loading',
    taskDescription: 'Add Redis cache for catalog queries',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache catalog queries', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Add Cache (Redis)',
      'Cache trending/genre rows',
      'Cache individual video metadata',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage', 'cdn', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
  },

  hints: {
    level1: 'Add Redis for catalog caching',
    level2: 'Check cache first, query DB on miss, store result',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 9: Load Balancing (Phase 3 Complete)
// =============================================================================

const step9Story: StoryContent = {
  emoji: '⚖️',
  scenario: "It's Sunday evening - peak streaming time!",
  hook: "50 million users are watching simultaneously. One server handles 10,000 concurrent connections max. You need 5,000 servers!",
  challenge: "Add load balancing to distribute traffic across multiple servers.",
  illustration: 'load-balancer',
};

const step9Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 3 Complete! Production-ready streaming!',
  achievement: 'Transcoding pipeline, caching, load balancing',
  metrics: [
    { label: 'Transcoding', after: 'Async pipeline' },
    { label: 'Cache hit rate', after: '99%+' },
    { label: 'Horizontal scale', after: '✓ Load balanced' },
  ],
  nextTeaser: "Phase 4: Personalized recommendations!",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing at Scale',

  frameworkReminder: {
    question: "How do we handle 50M concurrent users?",
    connection: "Single server can't handle the load. Load balancer distributes across thousands of servers."
  },

  conceptExplanation: `**The Math:**
- Peak users: 50 million concurrent
- One server: ~10,000 connections
- Servers needed: 5,000+

**Load Balancer:**
\`\`\`
Users → Load Balancer → Server Pool
                     → Server 1
                     → Server 2
                     → ...
                     → Server 5000
\`\`\`

**Strategies:**
- **Round Robin**: Simple, even distribution
- **Least Connections**: Route to least busy server
- **Consistent Hashing**: Same user → same server (for caching)

**Netflix's Approach:**
\`\`\`
Client → DNS → Regional LB → Zuul (API Gateway) → Service
\`\`\`

**Zuul (Netflix API Gateway):**
- Routing based on request
- Authentication
- Rate limiting
- Canary testing (route % to new version)

**Auto-Scaling:**
\`\`\`yaml
scaling_policy:
  min_instances: 100
  max_instances: 10000
  scale_up_when:
    cpu_percent: > 70
    for_minutes: 5
  scale_down_when:
    cpu_percent: < 30
    for_minutes: 15
\`\`\``,

  whyItMatters: 'Load balancing enables horizontal scaling. Essential for any high-traffic service.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Handling peak traffic',
    howTheyDoIt: 'Zuul for API gateway, Eureka for service discovery. Auto-scales based on traffic.',
  },

  keyPoints: [
    'Distribute traffic across servers',
    'Auto-scale based on load',
    'Health checks remove unhealthy servers',
  ],

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests', icon: '⚖️' },
    { title: 'Auto-Scaling', explanation: 'Adjust capacity automatically', icon: '📈' },
  ],
};

const step9: GuidedStep = {
  id: 'netflix-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'NFR: Handle 50M concurrent users',
    taskDescription: 'Add load balancer',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Add Load Balancer',
      'Client → LB → App Servers',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'cdn', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
  },

  hints: {
    level1: 'Add LB between Client and App Servers',
    level2: 'Client → Load Balancer → multiple App Servers',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// PHASE 4: EXPERT - Recommendations & Global
// =============================================================================

// =============================================================================
// STEP 10: Recommendation Engine (Phase 4)
// =============================================================================

const step10Story: StoryContent = {
  emoji: '🎯',
  scenario: "Phase 4 begins! Users don't know what to watch next.",
  hook: "You have 10,000 titles. Users scroll endlessly and leave. 'There's nothing good on!' But there IS good content - they just can't find it!",
  challenge: "Build a recommendation engine to personalize content for each user.",
  illustration: 'recommendations',
};

const step10Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Recommendations are working!',
  achievement: 'Personalized content for every user',
  metrics: [
    { label: 'Personalized rows', after: '✓' },
    { label: 'Engagement', before: '40%', after: '75%' },
  ],
  nextTeaser: "Now let's personalize thumbnails...",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Recommendation Engine',

  frameworkReminder: {
    question: "How do we help users find content they'll love?",
    connection: "Recommendations drive engagement. Netflix says 80% of watched content comes from recommendations."
  },

  conceptExplanation: `**The Challenge:**
- 10,000+ titles
- 200M users with different tastes
- How to show the RIGHT content to EACH user?

**Recommendation Strategies:**

**1. Content-Based Filtering**
\`\`\`
"You watched Breaking Bad"
→ Similar genre: crime, drama
→ Similar cast: Bryan Cranston
→ Recommend: Better Call Saul
\`\`\`

**2. Collaborative Filtering**
\`\`\`
"Users who watched X also watched Y"
User A watched: [1, 2, 3]
User B watched: [1, 2, 4]
User A might like: 4
\`\`\`

**3. Matrix Factorization**
\`\`\`
User preferences → latent features → content features
[User-Video interaction matrix]
       ↓ decompose
[User features] × [Video features]
       ↓
Predict unwatched ratings
\`\`\`

**Implementation:**
\`\`\`python
def get_recommendations(user_id):
    # Get user's taste profile
    taste = get_user_taste_profile(user_id)

    # Get candidates from multiple sources
    candidates = []
    candidates += collaborative_filtering(user_id, 100)
    candidates += content_based(taste, 100)
    candidates += trending_in_region(user.region, 50)

    # Score and rank
    scored = []
    for video in candidates:
        score = recommendation_model.score(user_id, video)
        scored.append((video, score))

    # Return top N
    return sorted(scored, key=lambda x: -x[1])[:50]
\`\`\`

**Rows on Homepage:**
- "Because you watched X"
- "Top picks for you"
- "Trending in your country"
- "Continue watching"`,

  whyItMatters: 'Recommendations are Netflix\'s secret weapon. They reduce churn and increase engagement.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Personalization at scale',
    howTheyDoIt: 'ML models. 80% of watched content is recommended. A/B tests everything.',
  },

  keyPoints: [
    'Multiple recommendation strategies',
    'Personalize for each user',
    'Constantly A/B test',
  ],

  keyConcepts: [
    { title: 'Collaborative Filtering', explanation: 'Similar users like similar things', icon: '👥' },
    { title: 'Content-Based', explanation: 'Recommend similar content', icon: '📝' },
  ],
};

const step10: GuidedStep = {
  id: 'netflix-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'NFR: Personalized recommendations',
    taskDescription: 'Build recommendation engine',
    successCriteria: [
      'Store user preferences',
      'Generate recommendations per user',
      'Display personalized rows',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'cdn', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
  },

  hints: {
    level1: 'Build recommendation service',
    level2: 'Collaborative + content-based filtering, rank candidates',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 11: Personalized Thumbnails (Phase 4)
// =============================================================================

const step11Story: StoryContent = {
  emoji: '🖼️',
  scenario: "Different users respond to different thumbnail images!",
  hook: "For 'Stranger Things', a romance fan should see Eleven & Mike. A horror fan should see the Demogorgon. Same show, different hooks!",
  challenge: "Implement personalized thumbnails based on user preferences.",
  illustration: 'thumbnails',
};

const step11Celebration: CelebrationContent = {
  emoji: '🖼️',
  message: 'Personalized thumbnails working!',
  achievement: 'Each user sees thumbnails tailored to their taste',
  metrics: [
    { label: 'Thumbnail variants', after: '10+ per title' },
    { label: 'Click-through rate', after: '+20%' },
  ],
  nextTeaser: "One final step: global distribution!",
};

const step11LearnPhase: TeachingContent = {
  conceptTitle: 'Personalized Artwork (Thumbnails)',

  frameworkReminder: {
    question: "How do we get users to click on content?",
    connection: "Thumbnails are the first impression. Personalized thumbnails increase click-through rates."
  },

  conceptExplanation: `**The Insight:**
Same content, different appeal:

**Stranger Things thumbnails:**
- Romance fans → Eleven & Mike together
- Horror fans → The Demogorgon
- Sci-fi fans → The Upside Down
- Comedy fans → Dustin making faces

**Implementation:**
\`\`\`python
def get_thumbnail(user_id, video_id):
    # Get user's genre preferences
    user_prefs = get_user_preferences(user_id)
    top_genre = user_prefs['top_genres'][0]  # e.g., "horror"

    # Get thumbnail for that genre
    thumbnails = db.query("""
        SELECT thumbnail_url, target_genre
        FROM video_thumbnails
        WHERE video_id = ?
    """, video_id)

    # Find best match
    for thumb in thumbnails:
        if thumb.target_genre == top_genre:
            return thumb.thumbnail_url

    # Fallback to default
    return thumbnails[0].thumbnail_url
\`\`\`

**Data Model:**
\`\`\`sql
CREATE TABLE video_thumbnails (
  video_id BIGINT,
  thumbnail_id INT,
  target_genre VARCHAR(50),  -- Who this appeals to
  thumbnail_url VARCHAR(500),
  click_rate DECIMAL(5,4),   -- A/B test results
  PRIMARY KEY (video_id, thumbnail_id)
);
\`\`\`

**A/B Testing:**
\`\`\`
For each user × video:
1. Randomly select thumbnail variant
2. Track impressions and clicks
3. Calculate click-through rate per variant
4. Use bandit algorithm to optimize
\`\`\`

**Netflix Stats:**
- 10+ thumbnail variants per title
- Personalized thumbnails increase engagement 20%+
- Constantly A/B tested`,

  whyItMatters: 'Thumbnails are tiny but impactful. Personalization at this level shows attention to detail.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Artwork personalization',
    howTheyDoIt: 'ML selects best thumbnail per user. Creates many variants per title. Constant experimentation.',
  },

  keyPoints: [
    'Multiple thumbnails per video',
    'Select based on user preferences',
    'A/B test everything',
  ],

  keyConcepts: [
    { title: 'Personalized Artwork', explanation: 'Different thumbnails for different users', icon: '🖼️' },
    { title: 'Multi-Armed Bandit', explanation: 'Optimize selection over time', icon: '🎰' },
  ],
};

const step11: GuidedStep = {
  id: 'netflix-step-11',
  stepNumber: 11,
  frIndex: 0,

  story: step11Story,
  learnPhase: step11LearnPhase,

  practicePhase: {
    frText: 'NFR: Personalized thumbnails',
    taskDescription: 'Implement personalized artwork selection',
    successCriteria: [
      'Store multiple thumbnails per video',
      'Select based on user preferences',
      'Track click-through rates',
    ],
  },

  celebration: step11Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'cdn', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
  },

  hints: {
    level1: 'Store thumbnail variants with target audience',
    level2: 'Match user preferences to thumbnail variants',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 12: Multi-Region Global Distribution (Phase 4 Complete)
// =============================================================================

const step12Story: StoryContent = {
  emoji: '🌍',
  scenario: "StreamFlix is going global! 190 countries!",
  hook: "Users in Brazil have 200ms latency to US servers. Users in Japan experience timeouts during peak hours. We need to be EVERYWHERE.",
  challenge: "Deploy multi-region architecture for global scale.",
  illustration: 'multi-region',
};

const step12Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You\'ve mastered Netflix system design!',
  achievement: 'From basic streaming to global entertainment platform',
  metrics: [
    { label: 'Concurrent users', after: '200M+' },
    { label: 'Countries', after: '190' },
    { label: 'Latency', after: '< 50ms globally' },
    { label: 'Features', after: 'Streaming, Recommendations, Personalization' },
  ],
  nextTeaser: "You've completed the Netflix journey!",
};

const step12LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Region Global Architecture',

  frameworkReminder: {
    question: "How do we serve 190 countries?",
    connection: "Regional deployment reduces latency. Data sovereignty requires regional storage."
  },

  conceptExplanation: `**Single Region Problems:**
- High latency for distant users
- Regional outages affect everyone
- Data sovereignty issues (GDPR, etc.)

**Multi-Region Architecture:**
\`\`\`
US-East (Primary):
  [LB] → [Services] → [DB Primary]
                           ↓ replicate
US-West:
  [LB] → [Services] → [DB Replica]
                           ↓ replicate
EU-West:
  [LB] → [Services] → [DB Replica]
                           ↓ replicate
APAC:
  [LB] → [Services] → [DB Replica]
\`\`\`

**What's Regional?**
| Data | Strategy |
|------|----------|
| Videos | CDN (globally cached) |
| User data | Regional (GDPR) |
| Watch history | Regional |
| Recommendations | Computed regionally |
| Catalog | Global (replicated) |

**Netflix's Approach:**
\`\`\`
Global Control Plane:
  - User accounts
  - Billing
  - Global catalog

Regional Data Plane:
  - Video streaming (Open Connect)
  - Playback state
  - Regional recommendations
\`\`\`

**Failover:**
\`\`\`python
def route_request(user):
    primary_region = get_user_region(user)

    if is_healthy(primary_region):
        return primary_region
    else:
        # Failover to nearest healthy region
        return get_nearest_healthy_region(user.location)
\`\`\`

**Chaos Engineering:**
Netflix famously uses "Chaos Monkey" to randomly kill servers:
- Tests failover constantly
- Ensures resilience
- "If we can survive chaos, we can survive anything"`,

  whyItMatters: 'Global scale requires regional architecture. This is the pinnacle of system design.',

  famousIncident: {
    title: 'Netflix Chaos Monkey',
    company: 'Netflix',
    year: '2011',
    whatHappened: 'Netflix created Chaos Monkey to randomly terminate instances in production. Forces engineers to build resilient systems.',
    lessonLearned: 'Test failure constantly. Don\'t wait for production incidents.',
    icon: '🐒',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Operating in 190 countries',
    howTheyDoIt: 'Multi-region AWS. Open Connect for video delivery. Regional data compliance.',
  },

  keyPoints: [
    'Regional deployment',
    'Data sovereignty compliance',
    'Chaos engineering for resilience',
  ],

  keyConcepts: [
    { title: 'Multi-Region', explanation: 'Servers in multiple regions', icon: '🌍' },
    { title: 'Chaos Engineering', explanation: 'Test failure proactively', icon: '🐒' },
  ],
};

const step12: GuidedStep = {
  id: 'netflix-step-12',
  stepNumber: 12,
  frIndex: 0,

  story: step12Story,
  learnPhase: step12LearnPhase,

  practicePhase: {
    frText: 'NFR: Global availability',
    taskDescription: 'Design multi-region architecture',
    successCriteria: [
      'Regional deployments',
      'Data replicated globally',
      'Failover between regions',
    ],
  },

  celebration: step12Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'cdn', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'cdn' },
    ],
  },

  hints: {
    level1: 'Design regional deployments',
    level2: 'Replicate data globally, route to nearest region',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE PROGRESSIVE TUTORIAL
// =============================================================================

export const netflixProgressiveGuidedTutorial: GuidedTutorial = {
  problemId: 'netflix-progressive',
  title: 'Design Netflix',
  description: 'Build an evolving video streaming platform from basic playback to global entertainment',
  difficulty: 'beginner', // Starts beginner, evolves to expert
  estimatedMinutes: 90,

  welcomeStory: {
    emoji: '🎬',
    hook: "Welcome to StreamFlix! You're building the next Netflix.",
    scenario: "Your journey: Start with basic video streaming, add adaptive quality and CDN, build transcoding pipelines, and create a personalized recommendation engine.",
    challenge: "Can you build a streaming platform that serves 200 million concurrent users?",
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
    'Metadata vs Video Storage',
    'Object Storage (S3)',
    'Video Streaming Basics',
    'Playback Position Tracking',
    'Adaptive Bitrate Streaming (HLS/DASH)',
    'Content Delivery Network (CDN)',
    'Video Transcoding Pipeline',
    'Caching for Read-Heavy Workloads',
    'Load Balancing',
    'Recommendation Engine',
    'Personalized Artwork',
    'Multi-Region Architecture',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, Maintainable Applications',
    'Chapter 4: Encoding and Evolution',
    'Chapter 5: Replication',
    'Chapter 11: Stream Processing',
  ],
};

export default netflixProgressiveGuidedTutorial;
