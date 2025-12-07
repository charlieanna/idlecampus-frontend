import {
  GuidedTutorial,
  GuidedStep,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * CMS Media Storage Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching system design through
 * building a media storage and transformation system for a CMS.
 *
 * Key Concepts:
 * - Media upload and storage (images, videos)
 * - Image resizing and transformations
 * - Video transcoding pipeline
 * - Lazy transformations vs eager processing
 * - CDN for media delivery
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const cmsMediaStorageRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a media storage system for a CMS platform",

  interviewer: {
    name: 'Sarah Martinez',
    role: 'Staff Engineer at ContentHub Inc.',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What types of media need to be stored and served?",
      answer: "The CMS needs to handle:\n\n1. **Images** - Photos, graphics, thumbnails (JPEG, PNG, WebP)\n2. **Videos** - Short clips and long-form content (MP4, WebM)\n3. **Documents** - PDFs, Word docs (future scope)\n\nFor the MVP, focus on images and videos. These are the most challenging due to size and processing requirements.",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2',
      learningPoint: "Different media types have different storage and processing requirements",
    },
    {
      id: 'image-transformations',
      category: 'functional',
      question: "What image transformations are needed?",
      answer: "Users need:\n\n1. **Resizing** - Generate thumbnails (150px), medium (800px), large (1600px)\n2. **Format conversion** - Convert to WebP for better compression\n3. **Cropping** - Smart crop to aspect ratios (16:9, 1:1, 4:3)\n4. **Quality optimization** - Compress while maintaining visual quality\n\nThese transformations should happen automatically on upload or on-demand.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Image transformations reduce bandwidth and improve user experience",
    },
    {
      id: 'video-processing',
      category: 'functional',
      question: "What video processing is required?",
      answer: "Videos need:\n\n1. **Transcoding** - Convert to web-friendly formats (H.264, VP9)\n2. **Multiple resolutions** - 360p, 720p, 1080p for adaptive streaming\n3. **Thumbnail extraction** - Generate preview images from video\n4. **Compression** - Reduce file size while maintaining quality\n\nVideo processing is CPU-intensive and should be asynchronous.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Video transcoding is compute-heavy and requires async processing",
    },
    {
      id: 'transformation-strategy',
      category: 'functional',
      question: "Should transformations happen on upload or on-demand?",
      answer: "We should support both strategies:\n\n**Eager (on upload):**\n- Generate common sizes immediately\n- Predictable processing time\n- Higher storage costs\n\n**Lazy (on-demand):**\n- Generate only when requested\n- Lower storage costs\n- First request is slower\n\nFor the MVP, use **lazy transformations** for images and **eager processing** for videos.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      insight: "Lazy transformations save storage, eager transformations optimize latency",
    },
    {
      id: 'cdn-delivery',
      category: 'cdn',
      question: "How should media be delivered to end users?",
      answer: "Media should be served through a CDN for:\n\n1. **Low latency** - Serve from edge locations near users\n2. **High bandwidth** - CDN handles massive parallel downloads\n3. **Origin protection** - CDN caches media, reducing origin load\n4. **Global reach** - Distribute content worldwide\n\nCDN is essential for media-heavy applications.",
      importance: 'critical',
      revealsRequirement: 'FR-6',
      learningPoint: "CDN is critical for media delivery - it provides latency, bandwidth, and cost benefits",
    },
    {
      id: 'live-streaming',
      category: 'clarification',
      question: "Do we need to support live video streaming?",
      answer: "Live streaming is out of scope for the MVP. It requires:\n- Real-time encoding\n- Low-latency protocols (WebRTC, HLS)\n- Different infrastructure\n\nFocus on upload-then-serve workflow first.",
      importance: 'nice-to-have',
      insight: "Live streaming is a separate problem - defer to v2",
    },

    // SCALE & NFRs
    {
      id: 'throughput-uploads',
      category: 'throughput',
      question: "How many media files are uploaded per day?",
      answer: "About 5 million media files per day (60% images, 40% videos)",
      importance: 'critical',
      calculation: {
        formula: "5M ÷ 86,400 sec = 58 uploads/sec average",
        result: "~60 uploads/sec (180 at peak)",
      },
      learningPoint: "Moderate write volume but large payload sizes",
    },
    {
      id: 'throughput-views',
      category: 'throughput',
      question: "How many media requests per day?",
      answer: "About 500 million media requests per day",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 requests/sec",
        result: "~5,800 requests/sec (17,400 at peak)",
      },
      learningPoint: "100:1 read-to-write ratio - heavy caching needed",
    },
    {
      id: 'payload-size',
      category: 'payload',
      question: "What are typical file sizes?",
      answer: "Average sizes:\n- **Images**: 2MB original, 200KB after optimization\n- **Videos**: 50MB for 1-minute video, 150MB total after transcoding to multiple resolutions\n\nStorage grows quickly!",
      importance: 'important',
      calculation: {
        formula: "3M images × 2MB + 2M videos × 150MB = 306TB/day",
        result: "~112PB/year storage growth",
      },
      learningPoint: "Media storage is expensive - optimization and tiering are essential",
    },
    {
      id: 'latency-delivery',
      category: 'latency',
      question: "How fast should media load for end users?",
      answer: "**Images**: p99 < 200ms for first byte\n**Videos**: p99 < 2s to start playback\n\nFast initial load is critical for user experience.",
      importance: 'critical',
      learningPoint: "CDN and caching are essential for low-latency media delivery",
    },
    {
      id: 'latency-processing',
      category: 'latency',
      question: "How quickly should transformations complete?",
      answer: "**Images**: Real-time (< 1s) for on-demand transforms\n**Videos**: Async processing OK - 5-10 minutes acceptable\n\nUsers expect images immediately but understand videos take time.",
      importance: 'important',
      learningPoint: "Image transforms must be fast, video transcoding can be async",
    },
    {
      id: 'storage-duration',
      category: 'reliability',
      question: "How long should media be stored?",
      answer: "Permanently, unless explicitly deleted by user. Need:\n- High durability (99.999999999%)\n- Backup and recovery\n- Tiered storage (hot/warm/cold) for cost optimization",
      importance: 'important',
      insight: "Old media can move to cheaper storage tiers",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'image-transformations', 'video-processing', 'cdn-delivery'],
  criticalFRQuestionIds: ['core-features', 'image-transformations', 'video-processing'],
  criticalScaleQuestionIds: ['throughput-views', 'payload-size', 'latency-delivery'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Upload images',
      description: 'Users can upload image files (JPEG, PNG, WebP)',
      emoji: '🖼️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Upload videos',
      description: 'Users can upload video files (MP4, WebM)',
      emoji: '🎥',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Image resizing',
      description: 'Automatically generate multiple image sizes',
      emoji: '📐',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Video transcoding',
      description: 'Transcode videos to multiple resolutions',
      emoji: '⚙️',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Lazy transformations',
      description: 'Generate image variants on-demand',
      emoji: '🎯',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Fast global delivery',
      description: 'Serve media through CDN',
      emoji: '🌍',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '20 million content editors/viewers',
    writesPerDay: '5 million media uploads',
    readsPerDay: '500 million media requests',
    peakMultiplier: 3,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 58, peak: 174 },
    calculatedReadRPS: { average: 5787, peak: 17361 },
    maxPayloadSize: '~100MB (video)',
    storagePerRecord: '~2MB images, ~150MB videos',
    storageGrowthPerYear: '~112PB',
    redirectLatencySLA: 'p99 < 200ms (images)',
    createLatencySLA: 'p99 < 10min (video transcoding)',
  },

  architecturalImplications: [
    '✅ 100:1 read-write ratio → CDN and caching critical',
    '✅ 112PB/year growth → Tiered object storage required',
    '✅ 17K requests/sec peak → Multi-region CDN needed',
    '✅ Video transcoding → Async processing with queue',
    '✅ Lazy transforms → Transform service + caching layer',
    '✅ Large files → Direct upload to object storage',
  ],

  outOfScope: [
    'Live video streaming',
    'Video editing features',
    'AI-powered smart cropping',
    'Advanced filters/effects',
    'User-facing video player UI',
  ],

  keyInsight: "First, let's make it WORK. We'll build a system where users can upload and retrieve media. The complexity of transformations, transcoding, and optimization comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1: GuidedStep = {
  id: 'cms-media-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: {
    emoji: '📁',
    scenario: "Welcome to ContentHub Inc! You're building a media storage system for a modern CMS.",
    hook: "Content creators need to upload images and videos, but there's no infrastructure yet!",
    challenge: "Set up the basic connection so users can reach your server.",
    illustration: 'startup-launch',
  },

  learnPhase: {
    conceptTitle: 'Client-Server Foundation for Media Storage',
    conceptExplanation: `Every media storage system starts with a **Client** (the user's browser/app) connecting to a **Server**.

When someone uploads a photo to a CMS:
1. The client (browser) sends the upload request
2. Your App Server receives and processes the request
3. The server responds with upload status and media URL

This is the foundation we'll build on!`,

    whyItMatters: 'Without this connection, users can\'t upload or access media files.',

    realWorldExample: {
      company: 'Cloudinary',
      scenario: 'Managing 200B+ media assets',
      howTheyDoIt: 'Started with simple upload API, now handles millions of transformations per second',
    },

    keyPoints: [
      'Client = the browser or mobile app',
      'App Server = your backend that handles uploads',
      'HTTP/HTTPS = the protocol for communication',
    ],
  },

  practicePhase: {
    frText: 'Setting up foundation for media operations',
    taskDescription: 'Add a Client and App Server, connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users uploading/viewing media', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles media upload and retrieval requests', displayName: 'App Server' },
    ],
    successCriteria: [
      'Client component added',
      'App Server component added',
      'Client connected to App Server',
    ],
  },

  celebration: {
    emoji: '🎉',
    message: 'Your media storage API is online!',
    achievement: 'Users can now connect to your server',
    metrics: [
      { label: 'Status', after: 'Online' },
      { label: 'Accepting requests', after: '✓' },
    ],
    nextTeaser: "But the server doesn't know how to handle media files yet...",
  },

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server from the component palette',
    level2: 'Click Client, then click App Server to connect them',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Core Logic
// =============================================================================

const step2: GuidedStep = {
  id: 'cms-media-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: {
    emoji: '💻',
    scenario: "A content editor just tried to upload their first image!",
    hook: "But the server doesn't know what to do with it. Error 500!",
    challenge: "Write the Python handlers for media upload and retrieval.",
    illustration: 'code-editor',
  },

  learnPhase: {
    conceptTitle: 'Media Upload & Retrieval APIs',
    conceptExplanation: `We need handlers for the core media operations:

- \`upload_media()\` - Accept media file, return upload URL
- \`get_media()\` - Return media file or redirect to storage
- \`delete_media()\` - Remove media from storage
- \`list_media()\` - Get user's uploaded media

For now, we'll handle metadata. The actual file storage comes in the next step.`,

    whyItMatters: 'These handlers are the core logic of any media storage system!',

    famousIncident: {
      title: 'Instagram Photo Loss Bug',
      company: 'Instagram',
      year: '2018',
      whatHappened: 'A bug in the upload handler caused photos to fail silently. Users thought they uploaded successfully but files were never saved. Took hours to detect.',
      lessonLearned: 'Always return clear success/failure responses. Log all upload operations.',
      icon: '📸',
    },

    keyPoints: [
      'upload_media receives file and metadata',
      'get_media returns file location or redirect',
      'Proper error handling is critical',
    ],

    quickCheck: {
      question: 'Why should media upload APIs return a URL instead of storing the file in the request?',
      options: [
        'URLs are easier to implement',
        'Large files should upload directly to object storage, not through app server',
        'It\'s a security requirement',
        'There\'s no technical reason',
      ],
      correctIndex: 1,
      explanation: 'Direct upload to object storage (S3) avoids app server bottleneck and reduces bandwidth costs.',
    },
  },

  practicePhase: {
    frText: 'FR-1: Upload media, FR-2: Retrieve media',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click App Server to open inspector',
      'Assign upload and retrieval APIs',
      'Open Python tab and implement handlers',
    ],
  },

  celebration: {
    emoji: '🎉',
    message: 'Media can be uploaded and retrieved!',
    achievement: 'Core media storage functionality working',
    metrics: [
      { label: 'APIs implemented', after: '4' },
      { label: 'Can upload', after: '✓' },
      { label: 'Can retrieve', after: '✓' },
    ],
    nextTeaser: "But where do the actual files go?",
  },

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click App Server → APIs tab → Assign POST /media and GET /media/:id',
    level2: 'Switch to Python tab and fill in the TODO sections',
    solutionComponents: [{ type: 'app_server', config: { handledAPIs: ['POST /api/v1/media', 'GET /api/v1/media/:id'] } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Object Storage
// =============================================================================

const step3: GuidedStep = {
  id: 'cms-media-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: {
    emoji: '☁️',
    scenario: "Users are uploading 100MB videos!",
    hook: "Your app server's disk is filling up fast. You're storing files locally!",
    challenge: "Add object storage (S3) for scalable file storage.",
    illustration: 'storage-full',
  },

  learnPhase: {
    conceptTitle: 'Object Storage for Media Files',
    conceptExplanation: `**Object Storage** (like S3) is designed for large files:

- Stores binary objects (images, videos, documents)
- Virtually unlimited capacity
- Pay only for what you use
- Built-in redundancy and durability (99.999999999%)

Architecture:
- **App Server**: Handles metadata and generates signed upload URLs
- **Object Storage**: Stores actual media files
- **Database** (next step): Stores file metadata and URLs`,

    whyItMatters: 'Media files are too large for app servers or databases. Object storage is built for this.',

    famousIncident: {
      title: 'Imgur Storage Migration',
      company: 'Imgur',
      year: '2016',
      whatHappened: 'Imgur migrated from their own storage to cloud object storage. The migration took months but saved millions and improved reliability.',
      lessonLearned: 'Start with managed object storage. Build custom only at massive scale.',
      icon: '💾',
    },

    realWorldExample: {
      company: 'Pinterest',
      scenario: 'Storing 200B+ images',
      howTheyDoIt: 'Uses S3 for storage with custom caching layer. Direct uploads from browser to S3.',
    },

    diagram: `
┌──────────────┐
│   Client     │
└──────┬───────┘
       │
       │ 1. Request upload URL
       ▼
┌──────────────┐     2. Generate signed URL    ┌─────────────────┐
│  App Server  │ ◀──────────────────────────▶  │  Object Storage │
└──────────────┘                               │      (S3)       │
       │                                       └─────────────────┘
       │                                              ▲
       │ 3. Return signed URL                         │
       ▼                                              │
┌──────────────┐     4. Upload directly              │
│   Client     │ ────────────────────────────────────┘
└──────────────┘
`,

    keyPoints: [
      'Object storage for files, database for metadata',
      'Use signed URLs for direct client upload',
      'S3 handles replication and durability',
    ],

    quickCheck: {
      question: 'Why use signed URLs for direct upload instead of uploading through app server?',
      options: [
        'It\'s more secure',
        'It reduces app server bandwidth and CPU usage',
        'S3 requires signed URLs',
        'It\'s faster for the user',
      ],
      correctIndex: 1,
      explanation: 'Direct upload offloads bandwidth from app server. Large files never touch your server.',
    },
  },

  practicePhase: {
    frText: 'FR-1 & FR-2: Scalable media storage',
    taskDescription: 'Add Object Storage for media files',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store media files durably', displayName: 'S3 Object Storage' },
    ],
    successCriteria: [
      'Object Storage component added',
      'App Server connected to Object Storage',
    ],
  },

  celebration: {
    emoji: '☁️',
    message: 'Media files have unlimited storage!',
    achievement: 'Object storage handles any file size',
    metrics: [
      { label: 'Storage capacity', after: 'Unlimited (S3)' },
      { label: 'Durability', after: '99.999999999%' },
    ],
    nextTeaser: "But if the server restarts, all metadata is lost...",
  },

  validation: {
    requiredComponents: ['client', 'app_server', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Drag Object Storage (S3) onto the canvas',
    level2: 'Connect App Server to Object Storage for file operations',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 4: Add Database for Metadata
// =============================================================================

const step4: GuidedStep = {
  id: 'cms-media-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: {
    emoji: '💥',
    scenario: "Disaster! The server crashed overnight.",
    hook: "When it came back up, all media metadata - file names, upload dates, user IDs - GONE!",
    challenge: "Add a database to persist metadata.",
    illustration: 'data-loss',
  },

  learnPhase: {
    conceptTitle: 'Database for Media Metadata',
    conceptExplanation: `Files live in S3, but we need a database for metadata:

**Media metadata table:**
- \`id\` - Unique media identifier
- \`user_id\` - Who uploaded it
- \`file_name\` - Original filename
- \`file_type\` - image/video
- \`size\` - File size in bytes
- \`s3_key\` - Location in S3
- \`upload_date\` - When uploaded
- \`transformations\` - Available variants

The database makes media searchable and manageable.`,

    whyItMatters: 'S3 stores files, but you need a database to search, filter, and organize them.',

    famousIncident: {
      title: 'Flickr Metadata Corruption',
      company: 'Flickr',
      year: '2015',
      whatHappened: 'A database migration corrupted photo metadata. Files existed in S3 but were inaccessible because the metadata was wrong.',
      lessonLearned: 'Metadata is as important as the files themselves. Test migrations carefully.',
      icon: '🗄️',
    },

    realWorldExample: {
      company: 'Dropbox',
      scenario: 'Tracking billions of files',
      howTheyDoIt: 'Uses MySQL for metadata, custom storage for files. Metadata queries drive the entire UX.',
    },

    keyPoints: [
      'Database stores searchable metadata',
      'S3 stores actual file content',
      's3_key links metadata to file',
    ],
  },

  practicePhase: {
    frText: 'All FRs need persistent metadata',
    taskDescription: 'Add a Database and connect App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store media metadata persistently', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added',
      'App Server connected to Database',
    ],
  },

  celebration: {
    emoji: '💾',
    message: 'Metadata is safe forever!',
    achievement: 'Persistent metadata storage enabled',
    metrics: [
      { label: 'Data durability', after: '100%' },
      { label: 'Survives restarts', after: '✓' },
    ],
    nextTeaser: "But image resizing would be nice...",
  },

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Drag a Database (PostgreSQL) onto the canvas',
    level2: 'Connect App Server to Database',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 5: Add Image Transformation Service
// =============================================================================

const step5: GuidedStep = {
  id: 'cms-media-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: {
    emoji: '🖼️',
    scenario: "Users want thumbnails! Every page loads full 5MB images.",
    hook: "Mobile users are complaining about slow load times and data usage.",
    challenge: "Add an image transformation service to resize images on-demand.",
    illustration: 'slow-loading',
  },

  learnPhase: {
    conceptTitle: 'On-Demand Image Transformations',
    conceptExplanation: `**Image transformation service** generates resized/optimized versions on-demand:

**How it works:**
1. User requests: \`/media/abc123?width=300\`
2. App checks cache - if exists, return it
3. If not, transformation service:
   - Fetches original from S3
   - Resizes to requested dimensions
   - Optimizes quality/format
   - Stores result in cache
   - Returns transformed image

**Lazy approach benefits:**
- Only generate sizes that are actually used
- Lower storage costs
- Flexible - support any size request`,

    whyItMatters: 'Sending 5MB images to mobile users wastes bandwidth and slows page loads. Transformations are essential.',

    famousIncident: {
      title: 'Cloudinary\'s Transformation DOS',
      company: 'Cloudinary',
      year: '2017',
      whatHappened: 'Attackers requested thousands of unique image transformations, overwhelming the service. Cloudinary added rate limiting and transformation quotas.',
      lessonLearned: 'Limit transformation parameters and implement rate limiting to prevent abuse.',
      icon: '🚨',
    },

    realWorldExample: {
      company: 'Cloudinary',
      scenario: 'Processing billions of transformations',
      howTheyDoIt: 'On-demand transformation with aggressive CDN caching. Supports URL-based transformation params.',
    },

    diagram: `
Request: /media/photo.jpg?w=300&h=200

┌────────┐     ┌─────────────┐     ┌───────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Cache │ (miss)
└────────┘     └─────────────┘     └───────┘
                      │                  │
                      │              (cached?)
                      ▼                  │
              ┌──────────────┐           │
              │ Transform    │ ◀─────────┘
              │ Service      │
              └──────┬───────┘
                     │
                     │ Fetch original
                     ▼
              ┌──────────────┐
              │ Object Store │
              └──────────────┘
`,

    keyPoints: [
      'Transform images on-demand, not on upload',
      'Cache transformed versions aggressively',
      'Use URL parameters to specify transformations',
    ],

    quickCheck: {
      question: 'Why use lazy (on-demand) transformations instead of generating all sizes on upload?',
      options: [
        'It\'s easier to implement',
        'It saves storage costs by only generating what\'s actually used',
        'On-demand is always faster',
        'Upload would take too long otherwise',
      ],
      correctIndex: 1,
      explanation: 'Lazy transformations save storage because you only generate sizes that are requested. 80% of sizes might never be used.',
    },
  },

  practicePhase: {
    frText: 'FR-3: Image resizing on-demand',
    taskDescription: 'Add transformation service for image resizing',
    componentsNeeded: [
      { type: 'app_server', reason: 'Transform service for image processing', displayName: 'Transform Service' },
      { type: 'cache', reason: 'Cache transformed images', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Transform service added',
      'Cache added',
      'Transform service connected to Object Storage',
      'App Server connected to Cache',
    ],
  },

  celebration: {
    emoji: '📐',
    message: 'Images are automatically optimized!',
    achievement: 'On-demand image transformations working',
    metrics: [
      { label: 'Mobile load time', before: '5s', after: '500ms' },
      { label: 'Bandwidth saved', after: '85%' },
    ],
    nextTeaser: "But videos still need transcoding...",
  },

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add a second App Server as Transform Service, and add a Cache',
    level2: 'Connect Transform Service to Object Storage, and App Server to Cache',
    solutionComponents: [
      { type: 'app_server', config: { label: 'Transform Service' } },
      { type: 'cache', config: { ttl: 3600, strategy: 'cache-aside' } },
    ],
    solutionConnections: [
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'object_storage' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Message Queue for Video Processing
// =============================================================================

const step6: GuidedStep = {
  id: 'cms-media-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: {
    emoji: '🎥',
    scenario: "A user uploaded a 2GB video. Your app server froze for 10 minutes!",
    hook: "Video transcoding is CPU-intensive. It blocked all other requests.",
    challenge: "Add a message queue for asynchronous video processing.",
    illustration: 'server-overload',
  },

  learnPhase: {
    conceptTitle: 'Async Video Processing with Message Queues',
    conceptExplanation: `**Video transcoding is too slow for synchronous processing**. Use a message queue:

**Workflow:**
1. User uploads video to S3
2. App server publishes message to queue: \`{ video_id: 123, s3_key: 'videos/abc.mp4' }\`
3. Worker picks up message from queue
4. Worker transcodes video to multiple resolutions (360p, 720p, 1080p)
5. Worker stores results in S3
6. Worker updates database with transcoded URLs

**Benefits:**
- Non-blocking - user doesn't wait
- Scalable - add more workers for more throughput
- Reliable - message queue ensures no lost jobs`,

    whyItMatters: 'Video transcoding takes minutes. Users won\'t wait. Async processing is essential.',

    famousIncident: {
      title: 'YouTube Early Upload Failures',
      company: 'YouTube',
      year: '2006',
      whatHappened: 'Early YouTube transcoded videos synchronously. Under load, uploads would timeout and fail. Moving to async queues solved it.',
      lessonLearned: 'Never do heavy processing in request path. Always use async workers for expensive operations.',
      icon: '🎬',
    },

    realWorldExample: {
      company: 'Netflix',
      scenario: 'Transcoding thousands of titles',
      howTheyDoIt: 'Uses SQS + worker pools. Transcodes to 120+ variants per title. Takes hours but runs async.',
    },

    diagram: `
1. Upload          2. Queue job        3. Process async
┌────────┐        ┌──────────┐        ┌──────────┐
│ Client │──────▶ │   App    │──────▶ │  Queue   │
└────────┘        │  Server  │        │  (SQS)   │
                  └──────────┘        └────┬─────┘
                                           │
                                           ▼
                                      ┌──────────┐
                                      │  Worker  │
                                      │  Pool    │
                                      └────┬─────┘
                                           │
                                           ▼
                                      ┌──────────┐
                                      │    S3    │
                                      └──────────┘
`,

    keyPoints: [
      'Message queue decouples upload from processing',
      'Workers process jobs asynchronously',
      'Scalable - add workers to increase throughput',
    ],

    quickCheck: {
      question: 'Why use a message queue instead of processing videos immediately?',
      options: [
        'Message queues are faster',
        'Video transcoding is too slow to do in the request path',
        'It\'s required by S3',
        'It reduces storage costs',
      ],
      correctIndex: 1,
      explanation: 'Transcoding takes minutes. Users won\'t wait. Queue allows async processing by workers.',
    },
  },

  practicePhase: {
    frText: 'FR-4: Video transcoding (async)',
    taskDescription: 'Add message queue and worker for video processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Queue video processing jobs', displayName: 'SQS Queue' },
      { type: 'app_server', reason: 'Worker to process videos', displayName: 'Video Worker' },
    ],
    successCriteria: [
      'Message Queue added',
      'Video Worker added',
      'App Server publishes to Queue',
      'Worker consumes from Queue',
      'Worker connects to Object Storage',
    ],
  },

  celebration: {
    emoji: '⚙️',
    message: 'Videos transcode in the background!',
    achievement: 'Async video processing pipeline working',
    metrics: [
      { label: 'Upload response time', before: '10min', after: '2s' },
      { label: 'Processing', after: 'Async (non-blocking)' },
    ],
    nextTeaser: "But users are far from your servers...",
  },

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Add Message Queue and a Worker (App Server)',
    level2: 'Connect App Server to Queue (publish), Worker to Queue (consume), Worker to S3',
    solutionComponents: [
      { type: 'message_queue' },
      { type: 'app_server', config: { label: 'Video Worker' } },
    ],
    solutionConnections: [
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'app_server' },
      { from: 'app_server', to: 'object_storage' },
    ],
  },
};

// =============================================================================
// STEP 7: Add CDN for Global Delivery
// =============================================================================

const step7: GuidedStep = {
  id: 'cms-media-step-7',
  stepNumber: 7,
  frIndex: 5,

  story: {
    emoji: '🌍',
    scenario: "Users in Australia are seeing 5-second image load times!",
    hook: "Your S3 bucket is in US-East. Round-trip to Australia takes 300ms+ per request.",
    challenge: "Add a CDN to serve media from edge locations worldwide.",
    illustration: 'global-latency',
  },

  learnPhase: {
    conceptTitle: 'CDN for Fast Global Media Delivery',
    conceptExplanation: `A **CDN** (Content Delivery Network) caches media at edge locations worldwide.

**How it works:**
1. User in Sydney requests image
2. Request goes to nearest edge (Sydney)
3. Edge cache miss → fetches from origin (S3)
4. Edge caches image and serves it
5. Next request → served from Sydney edge (< 50ms)

**Benefits:**
- Low latency worldwide
- Reduced origin load (S3 requests)
- Bandwidth savings
- Better user experience

For media-heavy apps, CDN is non-negotiable.`,

    whyItMatters: 'Media files are large. CDN dramatically improves load times and reduces costs.',

    famousIncident: {
      title: 'Fastly CDN Outage',
      company: 'Fastly',
      year: '2021',
      whatHappened: 'A configuration bug took down Fastly\'s CDN globally. Sites like Pinterest, Twitch, Reddit went down for an hour.',
      lessonLearned: 'CDN is critical infrastructure. Consider multi-CDN strategy for resilience.',
      icon: '🌐',
    },

    realWorldExample: {
      company: 'Instagram',
      scenario: 'Serving 100B+ images daily',
      howTheyDoIt: 'Uses Facebook\'s global CDN. 99%+ cache hit rate. Images load in < 100ms globally.',
    },

    diagram: `
User in Sydney:
                                    ┌─────────────┐
┌──────────┐    50ms    ┌──────────┤ Sydney Edge │
│   User   │◀──────────▶│   CDN    │    Cache    │
│ (Sydney) │            │          └─────────────┘
└──────────┘            │
                        │ Cache miss?
                        │    ▼
                        │ ┌─────────────┐
                        │ │   Origin    │
                        └─│  S3 US-East │
                          │             │
                          └─────────────┘
`,

    keyPoints: [
      'CDN caches media at edge locations globally',
      'Users get media from nearest edge (< 100ms)',
      'Origin (S3) only hit on cache miss',
    ],

    quickCheck: {
      question: 'What\'s the main benefit of a CDN for media delivery?',
      options: [
        'Media is stored more securely',
        'Users get media from nearby servers, reducing latency',
        'Media is compressed automatically',
        'It\'s cheaper than S3',
      ],
      correctIndex: 1,
      explanation: 'CDN edges are geographically distributed. Users fetch from nearby edge instead of distant origin.',
    },
  },

  practicePhase: {
    frText: 'FR-6: Fast global delivery',
    taskDescription: 'Add CDN for global media delivery',
    componentsNeeded: [
      { type: 'cdn', reason: 'Deliver media from edge locations', displayName: 'CloudFront CDN' },
    ],
    successCriteria: [
      'CDN component added',
      'CDN connected to Object Storage (origin)',
      'CDN connected to Cache (transform cache)',
    ],
  },

  celebration: {
    emoji: '🚀',
    message: 'Media loads fast everywhere!',
    achievement: 'Global CDN delivers media worldwide',
    metrics: [
      { label: 'Australia latency', before: '5000ms', after: '100ms' },
      { label: 'Global edge locations', after: '200+' },
      { label: 'Cache hit rate', after: '95%' },
    ],
    nextTeaser: "System is complete and fast!",
  },

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage', 'cache', 'message_queue', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add a CDN component',
    level2: 'Connect CDN to Object Storage as origin, optionally to Cache',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [
      { from: 'cdn', to: 'object_storage' },
      { from: 'cdn', to: 'cache' },
    ],
  },
};

// =============================================================================
// EXPORT
// =============================================================================

export const cmsMediaStorageGuidedTutorial: GuidedTutorial = {
  problemId: 'cms-media-storage',
  title: 'Design CMS Media Storage',
  description: 'Build a media storage system with transformations, transcoding, and global delivery',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '📁',
    hook: "You've been hired as Lead Engineer at ContentHub Inc!",
    scenario: "Your mission: Build a media storage system that handles images and videos at scale.",
    challenge: "Can you design a system that processes 5 million media files per day?",
  },

  requirementsPhase: cmsMediaStorageRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7],

  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Object Storage',
    'Database Design',
    'Image Transformations',
    'Lazy vs Eager Processing',
    'Async Video Transcoding',
    'Message Queues',
    'CDN',
    'Caching Strategies',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval',
    'Chapter 11: Stream Processing',
    'Chapter 12: The Future of Data Systems',
  ],
};

export default cmsMediaStorageGuidedTutorial;
