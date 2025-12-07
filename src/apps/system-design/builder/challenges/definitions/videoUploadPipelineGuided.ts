import {
  GuidedTutorial,
  GuidedStep,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Video Upload Pipeline Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial teaching system design through
 * building a robust video upload pipeline with chunked uploads,
 * transcoding, thumbnail generation, and resumable uploads.
 *
 * Key Concepts:
 * - Chunked file uploads for large videos
 * - Resumable upload patterns
 * - Asynchronous video transcoding
 * - Thumbnail generation pipeline
 * - Message queues for background processing
 * - Object storage for video files
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const videoUploadPipelineRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a robust video upload pipeline with chunked uploads and transcoding",

  interviewer: {
    name: 'Alex Rivera',
    role: 'Senior Platform Engineer at VideoTech',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What are the main features of this video upload pipeline?",
      answer: "The pipeline needs to:\n\n1. **Accept video uploads** - Handle large video files from users\n2. **Support chunked uploads** - Upload videos in chunks for reliability\n3. **Enable resumable uploads** - Resume interrupted uploads\n4. **Transcode videos** - Convert to multiple formats/resolutions\n5. **Generate thumbnails** - Create preview images automatically\n6. **Track upload progress** - Show real-time progress to users",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-6',
      learningPoint: "A production video upload system needs to be resilient, efficient, and user-friendly",
    },
    {
      id: 'chunked-uploads',
      category: 'functional',
      question: "Why do we need chunked uploads instead of uploading the whole file at once?",
      answer: "Chunked uploads split large files into smaller pieces (typically 5-10MB each). Benefits:\n1. **Reliability** - If network fails, only retry the failed chunk\n2. **Resumability** - Resume from where you left off\n3. **Parallel uploads** - Upload multiple chunks simultaneously\n4. **Better UX** - Show granular progress\n5. **Works with slow connections** - Small chunks less likely to timeout",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "For files over 100MB, chunked uploads are essential for reliability",
    },
    {
      id: 'resumable-uploads',
      category: 'functional',
      question: "How should resumable uploads work?",
      answer: "When an upload is interrupted:\n1. Client stores which chunks were already uploaded\n2. On resume, client asks server which chunks it has\n3. Client only re-uploads missing chunks\n4. Server assembles chunks into final file when complete\n\nThis prevents users from re-uploading a 2GB video from scratch if their WiFi drops at 95%!",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Resumable uploads are critical for user experience with large files",
    },
    {
      id: 'transcoding',
      category: 'functional',
      question: "What happens after a video is uploaded?",
      answer: "The raw video needs to be transcoded:\n1. **Format conversion** - MP4, WebM, HLS for different devices\n2. **Resolution variants** - 360p, 720p, 1080p, 4K\n3. **Compression** - Optimize file size vs quality\n4. **Audio normalization** - Consistent volume levels\n\nThis is CPU-intensive and can take 5-30 minutes for a 1-hour video.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Transcoding must be asynchronous - users can't wait 30 minutes",
    },
    {
      id: 'thumbnails',
      category: 'functional',
      question: "How should thumbnail generation work?",
      answer: "Automatically generate thumbnails:\n1. Extract frames at key moments (e.g., 10%, 25%, 50%, 75%)\n2. Generate 3-5 thumbnail options\n3. Optionally: use ML to pick visually interesting frames\n4. Create multiple sizes (small, medium, large)\n\nThumbnails are critical for browse pages and search results.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      learningPoint: "Thumbnail generation should be part of the transcoding pipeline",
    },
    {
      id: 'upload-progress',
      category: 'functional',
      question: "How do users track upload and processing progress?",
      answer: "Real-time progress updates:\n1. **Upload progress** - Show % uploaded, speed, ETA\n2. **Processing status** - 'Queued', 'Transcoding', 'Generating thumbnails', 'Ready'\n3. **Live updates** - Use WebSocket or polling\n4. **Error handling** - Clear messages if something fails",
      importance: 'important',
      revealsRequirement: 'FR-6',
      learningPoint: "Users need feedback at every stage - uploads can take minutes to hours",
    },

    // CLARIFICATIONS
    {
      id: 'file-size-limits',
      category: 'clarification',
      question: "What's the maximum file size we should support?",
      answer: "Support up to 10GB per video. This covers most use cases:\n- Short videos: 50-500MB\n- Long videos (1-2 hours): 2-5GB\n- Professional content: up to 10GB\n\nAnything larger requires special handling and is out of scope for MVP.",
      importance: 'important',
      insight: "File size limits affect chunk size, storage costs, and processing time",
    },
    {
      id: 'concurrent-uploads',
      category: 'clarification',
      question: "Can users upload multiple videos simultaneously?",
      answer: "For MVP, limit to 1 upload per user at a time. This simplifies progress tracking and prevents resource abuse. Can support multiple in v2.",
      importance: 'nice-to-have',
      insight: "Single upload limit reduces complexity and prevents abuse",
    },
    {
      id: 'live-streaming',
      category: 'clarification',
      question: "Do we need to support live streaming?",
      answer: "No - live streaming is a completely different pipeline with real-time encoding. Focus on pre-recorded video upload for MVP.",
      importance: 'out-of-scope',
      insight: "Live streaming requires different protocols (RTMP, WebRTC) and infrastructure",
    },

    // SCALE & NFRs
    {
      id: 'throughput-uploads',
      category: 'throughput',
      question: "How many videos are uploaded per day?",
      answer: "50,000 videos uploaded per day (about 35 uploads per minute)",
      importance: 'critical',
      calculation: {
        formula: "50,000 uploads ÷ 86,400 sec = 0.58 uploads/sec",
        result: "~35 uploads/min average, ~100/min at peak",
      },
      learningPoint: "Moderate upload volume - transcoding workers are the main bottleneck",
    },
    {
      id: 'throughput-storage',
      category: 'throughput',
      question: "How much storage grows per day?",
      answer: "Average video: 500MB raw, 1.5GB after transcoding (3x for multiple formats/resolutions)",
      importance: 'critical',
      calculation: {
        formula: "50,000 videos × 1.5GB = 75TB per day",
        result: "~75TB/day storage growth, ~27PB/year",
      },
      learningPoint: "Object storage with tiered pricing is essential",
    },
    {
      id: 'video-size',
      category: 'payload',
      question: "What's the typical video size and duration?",
      answer: "Average: 10-minute video, 500MB. Range: 50MB (short) to 10GB (long/high-quality)",
      importance: 'important',
      learningPoint: "Chunk size should be optimized for typical file sizes",
    },
    {
      id: 'latency-upload',
      category: 'latency',
      question: "How fast should uploads complete?",
      answer: "Upload speed depends on user's connection. For a 500MB video on 10Mbps connection: ~7 minutes. For 100Mbps: ~40 seconds. Focus on reliability over speed.",
      importance: 'important',
      learningPoint: "Chunked + resumable uploads ensure reliability regardless of speed",
    },
    {
      id: 'latency-processing',
      category: 'latency',
      question: "How quickly should transcoding complete?",
      answer: "Transcoding should complete within 10-30 minutes for typical videos. Priority queue for premium users. Users can leave page - notify when ready.",
      importance: 'important',
      calculation: {
        formula: "10-min video → 15-min transcoding, 1-hour video → 1.5-hour transcoding",
        result: "Processing time ≈ 1.5x video duration",
      },
      learningPoint: "Async processing is essential - use message queues and background workers",
    },
    {
      id: 'concurrent-processing',
      category: 'burst',
      question: "What if thousands of videos are uploaded at once?",
      answer: "Use a job queue with worker pool. Queue videos for transcoding, process them as workers become available. Show queue position to users.",
      importance: 'critical',
      insight: "Message queue prevents overload and enables horizontal scaling of workers",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'chunked-uploads', 'resumable-uploads', 'transcoding'],
  criticalFRQuestionIds: ['core-features', 'chunked-uploads', 'transcoding'],
  criticalScaleQuestionIds: ['throughput-uploads', 'latency-processing', 'concurrent-processing'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Accept video uploads',
      description: 'Handle large video files from users',
      emoji: '📤',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Support chunked uploads',
      description: 'Upload videos in chunks for reliability',
      emoji: '🧩',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Enable resumable uploads',
      description: 'Resume interrupted uploads without starting over',
      emoji: '▶️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Transcode videos',
      description: 'Convert to multiple formats and resolutions',
      emoji: '🎬',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Generate thumbnails',
      description: 'Create preview images automatically',
      emoji: '🖼️',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Track upload progress',
      description: 'Show real-time progress to users',
      emoji: '📊',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '500,000 uploaders',
    writesPerDay: '50,000 video uploads',
    readsPerDay: 'Minimal (upload-focused)',
    peakMultiplier: 3,
    readWriteRatio: 'Write-heavy (upload pipeline)',
    calculatedWriteRPS: { average: 0.58, peak: 1.74 },
    calculatedReadRPS: { average: 0, peak: 0 },
    maxPayloadSize: '10GB (video file)',
    storagePerRecord: '1.5GB average (after transcoding)',
    storageGrowthPerYear: '~27 PB',
    redirectLatencySLA: 'Upload speed limited by network',
    createLatencySLA: 'p99 < 30min (transcoding)',
  },

  architecturalImplications: [
    '✅ Large files (up to 10GB) → Chunked uploads required',
    '✅ Resumable uploads → Track chunk status, support partial uploads',
    '✅ Async transcoding → Message queue + worker pool essential',
    '✅ 75TB/day growth → Object storage (S3) with tiered pricing',
    '✅ CPU-intensive processing → Separate transcoding workers',
    '✅ Upload progress → WebSocket or polling for real-time updates',
  ],

  outOfScope: [
    'Live streaming',
    'Multiple simultaneous uploads per user',
    'Video editing features',
    'Content moderation/copyright detection',
    'Watermarking',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can upload videos and they get processed. The complexity of chunking, resumability, and parallel transcoding comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1: GuidedStep = {
  id: 'video-upload-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: {
    emoji: '🎬',
    scenario: "Welcome to VideoTech! You're building a production-ready video upload pipeline.",
    hook: "A creator is ready to upload their first video!",
    challenge: "Set up the basic connection so users can reach your upload server.",
    illustration: 'startup-launch',
  },

  learnPhase: {
    conceptTitle: 'Client-Server Foundation for Video Uploads',
    conceptExplanation: `Every upload pipeline starts with a **Client** connecting to a **Server**.

When someone uploads a video:
1. The Client (browser/mobile app) sends the video file
2. The App Server receives and validates it
3. The server returns upload status and tracking info

This is the foundation for all upload functionality!`,

    whyItMatters: 'Without this connection, users can\'t upload anything.',

    realWorldExample: {
      company: 'YouTube',
      scenario: 'Handling 500 videos uploaded per minute',
      howTheyDoIt: 'Started with simple HTTP uploads, evolved to resumable protocol with chunking',
    },

    keyPoints: [
      'Client = user device (browser, mobile app)',
      'App Server = backend handling upload logic',
      'HTTP/HTTPS = protocol for file transfer',
    ],
  },

  practicePhase: {
    frText: 'Setting up foundation for FR-1: Accept video uploads',
    taskDescription: 'Add a Client and App Server, connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users uploading videos', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles video upload requests', displayName: 'App Server' },
    ],
    successCriteria: [
      'Client component added',
      'App Server component added',
      'Client connected to App Server',
    ],
  },

  celebration: {
    emoji: '🎉',
    message: 'Your upload pipeline is online!',
    achievement: 'Users can now connect to your server',
    metrics: [
      { label: 'Status', after: 'Online' },
      { label: 'Ready for uploads', after: '✓' },
    ],
    nextTeaser: "But the server doesn't know how to handle video files yet...",
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
// STEP 2: Implement Upload Handler (Python Code)
// =============================================================================

const step2: GuidedStep = {
  id: 'video-upload-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: {
    emoji: '💻',
    scenario: "A user just tried to upload their first video!",
    hook: "But the server returned 'Method not supported'. No upload handler exists!",
    challenge: "Write the Python handler to accept and validate video uploads.",
    illustration: 'code-editor',
  },

  learnPhase: {
    conceptTitle: 'Video Upload Handler Implementation',
    conceptExplanation: `The upload handler needs to:

1. **Receive the file** - Accept multipart/form-data from client
2. **Validate** - Check file type, size limits
3. **Generate upload ID** - Unique identifier for tracking
4. **Store temporarily** - Save to temp location
5. **Return status** - Confirm receipt to user

For now, we'll accept the whole file at once. Chunking comes in Step 3!`,

    whyItMatters: 'This handler is the entry point for all video uploads.',

    famousIncident: {
      title: 'YouTube Early Upload Limits',
      company: 'YouTube',
      year: '2005-2010',
      whatHappened: 'Early YouTube limited uploads to 10 minutes because longer videos would timeout during upload. They had to build chunked upload infrastructure to support longer content.',
      lessonLearned: 'Whole-file uploads don\'t scale. Need chunking for large files.',
      icon: '⏱️',
    },

    keyPoints: [
      'Accept multipart file uploads via HTTP POST',
      'Validate file type (MP4, MOV, AVI, WebM)',
      'Enforce size limits (max 10GB)',
      'Return upload ID for tracking',
    ],

    quickCheck: {
      question: 'Why validate file type and size before processing?',
      options: [
        'To make the code more complex',
        'Prevent malicious uploads and resource exhaustion',
        'To charge users more',
        'It\'s not necessary',
      ],
      correctIndex: 1,
      explanation: 'Validation prevents users from uploading malware, filling your storage, or crashing your transcoding pipeline with unsupported formats.',
    },
  },

  practicePhase: {
    frText: 'FR-1: Accept video uploads',
    taskDescription: 'Configure upload API and implement Python handler',
    successCriteria: [
      'Click App Server to open inspector',
      'Assign POST /api/v1/upload API',
      'Open Python tab and implement upload_video handler',
    ],
  },

  celebration: {
    emoji: '🎉',
    message: 'Videos can be uploaded!',
    achievement: 'Upload handler is working',
    metrics: [
      { label: 'API implemented', after: 'POST /upload' },
      { label: 'File validation', after: '✓' },
    ],
    nextTeaser: "But large files fail to upload...",
  },

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click App Server → APIs tab → Assign POST /api/v1/upload',
    level2: 'Switch to Python tab and implement upload_video handler with file validation',
    solutionComponents: [{ type: 'app_server', config: { handledAPIs: ['POST /api/v1/upload'] } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Object Storage for Video Files
// =============================================================================

const step3: GuidedStep = {
  id: 'video-upload-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: {
    emoji: '💥',
    scenario: "Your app server's disk is full! Only 20 videos uploaded and out of space.",
    hook: "Storing videos on the app server is not scalable. Plus if the server crashes, all videos are lost!",
    challenge: "Add object storage (S3) for durable, unlimited video storage.",
    illustration: 'storage-full',
  },

  learnPhase: {
    conceptTitle: 'Object Storage for Video Files',
    conceptExplanation: `**Object Storage** (like S3) is designed for large media files:

Benefits:
- **Unlimited capacity** - Store petabytes of video
- **Durability** - 99.999999999% (11 nines!)
- **Cost-effective** - Pay only for what you use
- **Accessible** - Access from anywhere via HTTP

Architecture:
- App server receives upload
- Streams file to S3
- Returns S3 URL to user
- App server doesn't store files locally`,

    whyItMatters: 'Storing videos on app servers is a disaster waiting to happen. S3 provides unlimited, durable storage.',

    famousIncident: {
      title: 'Vimeo Storage Migration',
      company: 'Vimeo',
      year: '2013',
      whatHappened: 'Vimeo migrated petabytes of video from self-hosted storage to AWS S3. The migration took months but reduced costs by 40% and improved reliability.',
      lessonLearned: 'Use object storage from day 1. Migrating later is painful.',
      icon: '📦',
    },

    realWorldExample: {
      company: 'YouTube',
      scenario: 'Storing exabytes of video',
      howTheyDoIt: 'Uses Google Cloud Storage (similar to S3) with tiered storage for hot/cold content',
    },

    keyPoints: [
      'Object storage for video files, database for metadata (next step)',
      'S3 provides unlimited capacity and high durability',
      'Stream uploads directly to S3 from app server',
      'Store S3 URL for later access',
    ],
  },

  practicePhase: {
    frText: 'FR-1: Accept video uploads (now durable!)',
    taskDescription: 'Add Object Storage and connect App Server to it',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store video files durably', displayName: 'S3 Object Storage' },
    ],
    successCriteria: [
      'Object Storage component added',
      'App Server connected to Object Storage',
    ],
  },

  celebration: {
    emoji: '☁️',
    message: 'Videos have a permanent home!',
    achievement: 'Unlimited, durable storage enabled',
    metrics: [
      { label: 'Storage capacity', after: 'Unlimited' },
      { label: 'Durability', after: '11 nines' },
    ],
    nextTeaser: "But if uploads fail halfway, users have to start over...",
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
    level2: 'Connect App Server to Object Storage for video file storage',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 4: Implement Chunked & Resumable Uploads
// =============================================================================

const step4: GuidedStep = {
  id: 'video-upload-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: {
    emoji: '😡',
    scenario: "Users are furious! A 5GB upload at 98% failed, and they have to restart from 0%!",
    hook: "Someone's WiFi dropped for 2 seconds and lost 2 hours of uploading. This is unacceptable.",
    challenge: "Implement chunked uploads with resumability so users can pick up where they left off.",
    illustration: 'upload-failed',
  },

  learnPhase: {
    conceptTitle: 'Chunked & Resumable Upload Protocol',
    conceptExplanation: `**Chunked uploads** split large files into small pieces:

How it works:
1. **Client splits file** - Divide into 5-10MB chunks
2. **Upload chunks sequentially/parallel** - Send one by one
3. **Server tracks progress** - Store which chunks received
4. **Resume on failure** - Client asks which chunks are missing
5. **Assemble on completion** - Server combines chunks into final file

**Resumability**:
- Client: "I have chunks 1-50, which do you have?"
- Server: "I have 1-45, send 46-50"
- Client: Sends only missing chunks

Benefits:
- Upload survives network interruptions
- Better progress visibility
- Can parallelize chunk uploads`,

    whyItMatters: 'For files over 100MB, resumable chunked uploads are essential for user experience.',

    famousIncident: {
      title: 'Dropbox Chunked Upload Evolution',
      company: 'Dropbox',
      year: '2011',
      whatHappened: 'Dropbox introduced chunked uploads with 4MB chunks. Upload success rate increased from 85% to 99.5%, especially for users with unreliable connections.',
      lessonLearned: 'Chunking transforms user experience. Essential for large files.',
      icon: '📦',
    },

    realWorldExample: {
      company: 'YouTube',
      scenario: 'Handling video uploads worldwide',
      howTheyDoIt: 'Uses resumable upload protocol with 8MB chunks. Can pause/resume uploads for days.',
    },

    diagram: `
Chunked Upload Flow:
┌──────────┐                           ┌─────────────┐
│  Client  │  1. Initialize upload     │ App Server  │
│          │ ────────────────────────▶ │             │
│          │ ◀──────────────────────── │             │
│          │  2. Upload ID + chunk URL │             │
│          │                           │             │
│  [5GB    │  3. Upload chunk 1 (10MB) │             │
│   File]  │ ────────────────────────▶ │             │
│          │  4. Upload chunk 2        │             │
│   Split  │ ────────────────────────▶ │             │
│   into   │  5. Upload chunk 3        │             │
│  500     │ ────────────────────────▶ │   Tracks    │
│  chunks  │    ...                    │   chunks    │
│          │  6. Upload chunk 500      │   received  │
│          │ ────────────────────────▶ │             │
│          │                           │             │
│          │  7. Complete upload       │  Assembles  │
│          │ ────────────────────────▶ │  chunks     │
│          │ ◀──────────────────────── │  into       │
│          │  8. Success! Video URL    │  final file │
└──────────┘                           └─────────────┘

On Resume:
Client: "Upload ID 123, I have chunks 1-250, what do you have?"
Server: "I have 1-200 and 220-230, missing 201-219 and 231-500"
Client: Uploads only missing chunks
`,

    keyPoints: [
      'Split files into 5-10MB chunks',
      'Track which chunks are uploaded (client and server)',
      'Support resume by querying chunk status',
      'Assemble chunks into final file when complete',
    ],

    quickCheck: {
      question: 'Why use 5-10MB chunk size instead of 1MB or 100MB?',
      options: [
        '1MB is too many chunks (overhead), 100MB is too large (retry cost)',
        'It\'s a random choice',
        'Smaller is always better',
        'Larger is always better',
      ],
      correctIndex: 0,
      explanation: 'Chunk size is a trade-off: smaller = more overhead but cheaper retries, larger = less overhead but expensive retries. 5-10MB balances both.',
    },
  },

  practicePhase: {
    frText: 'FR-2: Chunked uploads, FR-3: Resumable uploads',
    taskDescription: 'Add Database to track chunk status and implement chunking logic',
    componentsNeeded: [
      { type: 'database', reason: 'Track upload progress and chunk status', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added',
      'App Server connected to Database',
      'Update upload handler to support chunking',
    ],
  },

  celebration: {
    emoji: '🎉',
    message: 'Uploads are now resumable!',
    achievement: 'Chunked upload protocol implemented',
    metrics: [
      { label: 'Upload success rate', before: '85%', after: '99.5%' },
      { label: 'Can resume', after: '✓' },
    ],
    nextTeaser: "But video processing is still missing...",
  },

  validation: {
    requiredComponents: ['client', 'app_server', 'object_storage', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add Database to track upload metadata and chunk status',
    level2: 'Connect App Server to Database. Update upload handler to support chunk tracking.',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 5: Add Message Queue for Async Processing
// =============================================================================

const step5: GuidedStep = {
  id: 'video-upload-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: {
    emoji: '🔥',
    scenario: "Your app server is at 100% CPU! It's trying to transcode videos while handling uploads!",
    hook: "Transcoding is CPU-intensive. Doing it on the upload server makes everything slow. Uploads are failing!",
    challenge: "Add a message queue to handle video processing asynchronously in the background.",
    illustration: 'server-overload',
  },

  learnPhase: {
    conceptTitle: 'Message Queues for Asynchronous Processing',
    conceptExplanation: `**Message Queues** decouple upload from processing:

Architecture:
1. **Upload completes** → Server adds job to queue
2. **Return immediately** → User doesn't wait for processing
3. **Background workers** → Consume jobs from queue
4. **Process video** → Transcode, generate thumbnails
5. **Update status** → Mark video as ready

Benefits:
- Upload server stays fast (no processing)
- Processing scales independently (add more workers)
- Jobs survive server restarts (queue is durable)
- Natural rate limiting (queue absorbs spikes)

Common queues: RabbitMQ, Kafka, AWS SQS, Redis Queue`,

    whyItMatters: 'Transcoding can take 30 minutes. Users can\'t wait that long. Async processing is essential.',

    famousIncident: {
      title: 'Instagram Video Processing Overload',
      company: 'Instagram',
      year: '2013',
      whatHappened: 'When Instagram launched video, initial uploads succeeded but processing queue grew to millions of jobs. Videos took hours to become available. They had to massively scale their worker fleet.',
      lessonLearned: 'Plan for async processing from day 1. Scale workers independently.',
      icon: '📹',
    },

    realWorldExample: {
      company: 'YouTube',
      scenario: 'Processing 500 hours of video per minute',
      howTheyDoIt: 'Uses massive message queue infrastructure with thousands of transcoding workers distributed globally',
    },

    diagram: `
Async Processing Flow:

Upload Path (Fast):
┌────────┐  Upload  ┌──────────┐  Save   ┌──────────┐
│ Client │────────▶ │   App    │───────▶ │    S3    │
└────────┘          │  Server  │         └──────────┘
                    └─────┬────┘
                          │
                          │ Add job to queue
                          ▼
                    ┌──────────────┐
                    │ Message Queue│
                    │   (Kafka)    │
                    └──────┬───────┘
                          │
                          │ Workers poll for jobs
                          ▼
Processing Path (Slow):
                    ┌──────────────┐
                    │  Transcoding │
                    │   Worker 1   │──▶ Transcode to 1080p
                    ├──────────────┤
                    │   Worker 2   │──▶ Transcode to 720p
                    ├──────────────┤
                    │   Worker 3   │──▶ Generate thumbnails
                    └──────┬───────┘
                          │
                          ▼
                    Update DB: "Ready"
`,

    keyPoints: [
      'Queue separates upload (fast) from processing (slow)',
      'Workers consume jobs at their own pace',
      'Horizontal scaling: add more workers for more capacity',
      'Queue provides durability and rate limiting',
    ],

    quickCheck: {
      question: 'Why use a message queue instead of processing videos immediately during upload?',
      options: [
        'Queues are more expensive',
        'Processing is slow (30 min), users can\'t wait, need async',
        'It\'s more complex',
        'Videos need to be processed immediately',
      ],
      correctIndex: 1,
      explanation: 'Transcoding takes 10-30 minutes. Users can\'t wait. Queue enables async processing so uploads return immediately.',
    },
  },

  practicePhase: {
    frText: 'FR-4: Async video transcoding',
    taskDescription: 'Add Message Queue for background video processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Queue videos for async transcoding', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: {
    emoji: '⚡',
    message: 'Processing is now asynchronous!',
    achievement: 'Upload and processing are decoupled',
    metrics: [
      { label: 'Upload response time', before: '30min', after: '2s' },
      { label: 'App server CPU', before: '100%', after: '20%' },
    ],
    nextTeaser: "But we need workers to actually process the videos...",
  },

  validation: {
    requiredComponents: ['client', 'app_server', 'object_storage', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Add Message Queue (Kafka) for job queue',
    level2: 'Connect App Server to Message Queue. After upload completes, add transcoding job to queue.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 6: Add Background Workers for Transcoding
// =============================================================================

const step6: GuidedStep = {
  id: 'video-upload-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: {
    emoji: '⏳',
    scenario: "The message queue is filling up! 10,000 videos waiting to be processed!",
    hook: "Jobs are sitting in the queue but nothing is processing them. Videos stay in 'Queued' status forever.",
    challenge: "Add background workers to consume jobs and transcode videos.",
    illustration: 'queue-backlog',
  },

  learnPhase: {
    conceptTitle: 'Background Workers for Video Transcoding',
    conceptExplanation: `**Workers** are separate processes that consume jobs from the queue:

Worker responsibilities:
1. **Poll queue** for new transcoding jobs
2. **Download video** from S3
3. **Transcode** to multiple formats/resolutions
   - 360p, 720p, 1080p, 4K
   - MP4, WebM, HLS
4. **Generate thumbnails** at key frames
5. **Upload results** back to S3
6. **Update database** status to "Ready"

Worker Pool:
- Start with 3-5 workers
- Scale based on queue depth
- Each worker handles 1 video at a time
- CPU-intensive: use beefy instances (8+ cores)

Transcoding tools: FFmpeg, AWS Elemental MediaConvert`,

    whyItMatters: 'Workers are the muscle of the system. Without them, videos never get processed.',

    famousIncident: {
      title: 'YouTube Transcoding Scalability',
      company: 'YouTube',
      year: '2007-2010',
      whatHappened: 'As YouTube grew, they needed thousands of transcoding workers. They built a distributed transcoding system that processes videos in parallel chunks, reducing processing time by 10x.',
      lessonLearned: 'Worker pool must scale horizontally. One worker can\'t handle all videos.',
      icon: '⚙️',
    },

    realWorldExample: {
      company: 'Netflix',
      scenario: 'Transcoding content library',
      howTheyDoIt: 'Uses thousands of AWS EC2 instances running FFmpeg, coordinated by a custom job scheduler',
    },

    diagram: `
Worker Processing Flow:

┌─────────────────┐
│ Message Queue   │
│  [Job 1]        │
│  [Job 2]        │
│  [Job 3]        │
└────────┬────────┘
         │
    Workers poll queue
         │
    ┌────┼─────┬─────────────┐
    ▼    ▼     ▼             ▼
┌────────┐ ┌────────┐   ┌────────┐
│Worker 1│ │Worker 2│...│Worker N│
└───┬────┘ └───┬────┘   └───┬────┘
    │          │            │
    │  1. Download from S3  │
    │  2. Transcode video   │
    │     - 360p, 720p, 1080p
    │  3. Generate thumbnails
    │  4. Upload results to S3
    │  5. Update DB status
    │          │            │
    └──────────┴────────────┘

Transcoding Details:
Input: video.mov (1080p, 2GB)
Output:
  - video_360p.mp4 (200MB)
  - video_720p.mp4 (500MB)
  - video_1080p.mp4 (1GB)
  - thumbnail_1.jpg, thumbnail_2.jpg...
`,

    keyPoints: [
      'Workers consume jobs from message queue',
      'Each worker handles one video at a time',
      'Transcode to multiple formats and resolutions',
      'Generate thumbnails automatically',
      'Scale workers based on queue depth',
    ],

    quickCheck: {
      question: 'Why run multiple workers instead of one powerful worker?',
      options: [
        'Multiple workers process videos in parallel, much faster',
        'One worker is always better',
        'It\'s cheaper',
        'Multiple workers are more complex',
      ],
      correctIndex: 0,
      explanation: 'Video transcoding is CPU-bound. N workers = N videos processed simultaneously. Horizontal scaling is essential.',
    },
  },

  practicePhase: {
    frText: 'FR-4: Transcode videos, FR-5: Generate thumbnails',
    taskDescription: 'Add Background Workers to process videos from the queue',
    componentsNeeded: [
      { type: 'worker', reason: 'Process videos: transcode and generate thumbnails', displayName: 'Transcoding Workers' },
    ],
    successCriteria: [
      'Worker component added',
      'Workers connected to Message Queue',
      'Workers connected to Object Storage',
      'Workers connected to Database',
    ],
  },

  celebration: {
    emoji: '🎬',
    message: 'Videos are being processed!',
    achievement: 'Transcoding pipeline is operational',
    metrics: [
      { label: 'Queue backlog', before: '10,000', after: '0' },
      { label: 'Processing rate', after: '5 videos/min' },
      { label: 'Thumbnails generated', after: '✓' },
    ],
    nextTeaser: "But users don't know when their video is ready...",
  },

  validation: {
    requiredComponents: ['client', 'app_server', 'object_storage', 'database', 'message_queue', 'worker'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'worker', toType: 'message_queue' },
      { fromType: 'worker', toType: 'object_storage' },
      { fromType: 'worker', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add Worker component for video processing',
    level2: 'Connect Workers to: Message Queue (consume jobs), Object Storage (read/write videos), Database (update status)',
    solutionComponents: [{ type: 'worker' }],
    solutionConnections: [
      { from: 'worker', to: 'message_queue' },
      { from: 'worker', to: 'object_storage' },
      { from: 'worker', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Cache for Upload Status & Progress
// =============================================================================

const step7: GuidedStep = {
  id: 'video-upload-step-7',
  stepNumber: 7,
  frIndex: 5,

  story: {
    emoji: '🔄',
    scenario: "Users are refreshing the page every 5 seconds to check if their video is ready!",
    hook: "Every refresh hits the database. With 10,000 videos processing, that's millions of status queries!",
    challenge: "Add a cache for upload status and implement real-time progress updates.",
    illustration: 'database-overload',
  },

  learnPhase: {
    conceptTitle: 'Caching Upload Status & Progress Tracking',
    conceptExplanation: `**Cache** reduces database load for frequently-read data:

What to cache:
- Upload status (Uploading, Queued, Processing, Ready)
- Processing progress (0-100%)
- Chunk upload status (for resumability)
- Thumbnail URLs (once generated)

Update flow:
1. Worker updates status → Write to DB
2. Worker also updates cache → Instant visibility
3. Client polls status → Read from cache (fast!)
4. Cache expires in 60 seconds → Ensures freshness

Real-time progress (advanced):
- Use WebSocket for live updates
- Workers push progress to cache
- App server streams from cache to client
- No polling needed!`,

    whyItMatters: 'Users check status constantly. Without caching, database melts under read load.',

    realWorldExample: {
      company: 'Vimeo',
      scenario: 'Tracking upload progress',
      howTheyDoIt: 'Uses Redis to cache upload status and progress. WebSocket pushes updates to client in real-time.',
    },

    diagram: `
Status Tracking Flow:

Worker updates progress:
┌────────┐                        ┌──────────┐
│ Worker │  Update progress       │  Redis   │
│        │ ─────────────────────▶ │  Cache   │
│        │  "video_123: 45%"      │          │
└────────┘                        └────┬─────┘
    │                                  │
    │ Also update DB                   │
    ▼                                  │
┌──────────┐                           │
│ Database │                           │
└──────────┘                           │
                                      │
User checks status:                   │
┌────────┐  GET /status/video_123    ┌┴─────────┐
│ Client │ ────────────────────────▶ │    App   │
│        │ ◀──────────────────────── │  Server  │
│        │  "45% - Transcoding"      │          │
└────────┘                            └─────┬────┘
                                           │
                                  Read from cache
                                           │
                                           ▼
                                    ┌──────────┐
                                    │   Redis  │
                                    │   Cache  │
                                    └──────────┘
                                    (99% cache hit!)
`,

    keyPoints: [
      'Cache upload status and progress for fast reads',
      'Workers update both DB (durability) and cache (speed)',
      'Set reasonable TTL (60 seconds) for freshness',
      'Consider WebSocket for real-time updates (advanced)',
    ],

    quickCheck: {
      question: 'Why update both database and cache when status changes?',
      options: [
        'Only cache is needed',
        'DB for durability, cache for speed',
        'Only database is needed',
        'It\'s a waste of resources',
      ],
      correctIndex: 1,
      explanation: 'Database ensures status survives cache eviction/restart. Cache ensures fast reads. Both are needed.',
    },
  },

  practicePhase: {
    frText: 'FR-6: Track upload progress',
    taskDescription: 'Add Cache for upload status and progress tracking',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache upload status and progress for fast queries', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added',
      'App Server connected to Cache',
      'Workers connected to Cache',
      'Cache TTL configured',
    ],
  },

  celebration: {
    emoji: '⚡',
    message: 'Progress tracking is lightning fast!',
    achievement: 'Status queries served from cache',
    metrics: [
      { label: 'Status query latency', before: '200ms', after: '5ms' },
      { label: 'Database load', before: 'High', after: 'Low' },
      { label: 'Cache hit rate', after: '99%' },
    ],
    nextTeaser: "But can the system scale to handle more uploads?",
  },

  validation: {
    requiredComponents: ['client', 'app_server', 'object_storage', 'database', 'message_queue', 'worker', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'worker', toType: 'message_queue' },
      { fromType: 'worker', toType: 'object_storage' },
      { fromType: 'worker', toType: 'database' },
      { fromType: 'worker', toType: 'cache' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add Cache (Redis) component',
    level2: 'Connect both App Server and Workers to Cache for status updates and reads. Set TTL to 60 seconds.',
    solutionComponents: [{ type: 'cache', config: { ttl: 60, strategy: 'cache-aside' } }],
    solutionConnections: [
      { from: 'app_server', to: 'cache' },
      { from: 'worker', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 8: Scale Workers & Add Load Balancer
// =============================================================================

const step8: GuidedStep = {
  id: 'video-upload-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: {
    emoji: '📈',
    scenario: "Your platform went viral! 1,000 videos uploaded per hour!",
    hook: "The queue is growing faster than workers can process. Videos take hours to become available!",
    challenge: "Scale your workers and add a load balancer for the app server.",
    illustration: 'viral-growth',
  },

  learnPhase: {
    conceptTitle: 'Horizontal Scaling for Upload Pipeline',
    conceptExplanation: `**Scale workers** based on queue depth:

Worker scaling:
- Monitor queue length
- If queue > 100 jobs → scale workers up
- If queue < 10 jobs → scale workers down
- Each worker handles ~12 videos/hour
- For 1,000 videos/hour → need ~100 workers

**Load Balancer** for app servers:
- Multiple app server instances
- Load balancer distributes upload requests
- Handles upload spikes
- Provides redundancy

Scaling strategy:
1. Start with 3 app servers, 5 workers
2. Auto-scale based on metrics
3. Workers scale independently from app servers`,

    whyItMatters: 'Upload spikes are unpredictable. System must scale elastically to handle viral growth.',

    famousIncident: {
      title: 'TikTok Upload Scalability',
      company: 'TikTok',
      year: '2019-2020',
      whatHappened: 'During explosive growth, TikTok scaled from thousands to millions of video uploads per day. They built auto-scaling infrastructure that spins up workers based on upload rate.',
      lessonLearned: 'Design for 10x growth. Auto-scaling is essential for viral platforms.',
      icon: '🚀',
    },

    realWorldExample: {
      company: 'YouTube',
      scenario: 'Handling upload spikes',
      howTheyDoIt: 'Auto-scales transcoding workers across global data centers. Can process millions of videos per day.',
    },

    diagram: `
Scaled Architecture:

         ┌──────────────┐
         │Load Balancer │
         └──────┬───────┘
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
┌────────┐  ┌────────┐  ┌────────┐
│App Srv1│  │App Srv2│  │App Srv3│
└───┬────┘  └───┬────┘  └───┬────┘
    │           │           │
    └───────────┴───────────┘
                │
                ▼
        ┌──────────────┐
        │Message Queue │
        └──────┬───────┘
               │
    ┌──────────┼──────────┬──────────┐
    ▼          ▼          ▼          ▼
┌────────┐┌────────┐┌────────┐┌────────┐
│Worker 1││Worker 2││Worker 3││Worker N│
└────────┘└────────┘└────────┘└────────┘
    │           │
    └─────┬─────┘
          ▼
  ┌──────────────┐
  │Object Storage│
  └──────────────┘

Auto-Scaling:
Queue depth > 100 → Add 10 workers
Queue depth < 10  → Remove idle workers
`,

    keyPoints: [
      'Load balancer distributes uploads across app servers',
      'Scale workers based on queue depth',
      'Workers and app servers scale independently',
      'Auto-scaling handles unpredictable traffic',
    ],

    quickCheck: {
      question: 'Why scale workers separately from app servers?',
      options: [
        'They have different resource needs (CPU vs I/O)',
        'It\'s more expensive',
        'It\'s not necessary',
        'Workers should always match app servers',
      ],
      correctIndex: 0,
      explanation: 'Upload (I/O-bound) and transcoding (CPU-bound) have different bottlenecks. Scale each independently for efficiency.',
    },
  },

  practicePhase: {
    frText: 'All FRs benefit from horizontal scaling',
    taskDescription: 'Add Load Balancer and scale workers to handle increased load',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute uploads across app servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
      'Worker instances scaled to 5+',
      'App Server instances scaled to 3+',
    ],
  },

  celebration: {
    emoji: '🎉',
    message: 'System can handle viral growth!',
    achievement: 'Horizontal scaling implemented',
    metrics: [
      { label: 'App Server instances', before: '1', after: '3+' },
      { label: 'Worker instances', before: '1', after: '5+' },
      { label: 'Upload capacity', before: '100/hr', after: '1000+/hr' },
      { label: 'Processing capacity', after: '60 videos/hr' },
    ],
    nextTeaser: "You've built a production-ready video upload pipeline!",
  },

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'object_storage', 'database', 'message_queue', 'worker', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'worker', toType: 'message_queue' },
      { fromType: 'worker', toType: 'object_storage' },
      { fromType: 'worker', toType: 'database' },
      { fromType: 'worker', toType: 'cache' },
    ],
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add Load Balancer between Client and App Server. Scale workers and app servers.',
    level2: 'Reconnect: Client → Load Balancer → App Server. Set Worker instances to 5+ and App Server instances to 3+.',
    solutionComponents: [
      { type: 'load_balancer' },
      { type: 'app_server', config: { instances: 3 } },
      { type: 'worker', config: { instances: 5 } },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// EXPORT
// =============================================================================

export const videoUploadPipelineGuidedTutorial: GuidedTutorial = {
  problemId: 'video-upload-pipeline',
  title: 'Design Video Upload Pipeline',
  description: 'Build a robust video upload system with chunked uploads, resumability, transcoding, and thumbnail generation',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🎬',
    hook: "You've been hired as Platform Engineer at VideoTech!",
    scenario: "Your mission: Build a production-ready video upload pipeline that can handle large files, network interruptions, and process videos in the background.",
    challenge: "Can you design a system that handles 50,000 video uploads per day with 99.5% upload success rate?",
  },

  requirementsPhase: videoUploadPipelineRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  concepts: [
    'Client-Server Architecture',
    'File Upload APIs',
    'Object Storage (S3)',
    'Chunked Uploads',
    'Resumable Upload Protocol',
    'Message Queues',
    'Background Workers',
    'Video Transcoding',
    'Thumbnail Generation',
    'Progress Tracking',
    'Caching',
    'Load Balancing',
    'Horizontal Scaling',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval',
    'Chapter 11: Stream Processing',
  ],
};

export default videoUploadPipelineGuidedTutorial;
