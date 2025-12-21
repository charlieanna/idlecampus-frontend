import { GuidedTutorial } from '../../types/guidedTutorial';

export const cmsMediaStorageProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'cms-media-storage-progressive',
  title: 'Design CMS Media Storage',
  description: 'Build a content management media storage system from basic uploads to CDN-accelerated global delivery',
  difficulty: 'medium',
  estimatedTime: '75 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design media upload and storage pipeline',
    'Implement image processing and transcoding',
    'Build metadata management and search',
    'Handle CDN integration and caching',
    'Scale to millions of media assets'
  ],
  prerequisites: ['Object storage', 'CDN', 'Image processing'],
  tags: ['cms', 'media', 'storage', 'cdn', 'content-management'],

  progressiveStory: {
    title: 'CMS Media Storage Evolution',
    premise: "You're building the media storage system for a content management platform. Starting with basic file uploads, you'll evolve to support image processing, video transcoding, CDN delivery, and massive scale.",
    phases: [
      { phase: 1, title: 'Storage', description: 'Upload and store media' },
      { phase: 2, title: 'Processing', description: 'Transform and optimize' },
      { phase: 3, title: 'Delivery', description: 'CDN and caching' },
      { phase: 4, title: 'Scale', description: 'Global media platform' }
    ]
  },

  steps: [
    // PHASE 1: Storage (Steps 1-3)
    {
      id: 'step-1',
      title: 'Media Upload Pipeline',
      phase: 1,
      phaseTitle: 'Storage',
      learningObjective: 'Handle file uploads reliably',
      thinkingFramework: {
        framework: 'Chunked Upload',
        approach: 'Large files uploaded in chunks. Resume on failure. Validate file type and size. Generate unique IDs. Store to object storage (S3).',
        keyInsight: 'Single request upload fails for large files. Chunked upload enables resume. Pre-signed URLs offload bandwidth from app server to storage.'
      },
      requirements: {
        functional: [
          'Upload files up to 5GB',
          'Chunked/resumable uploads',
          'File type validation',
          'Generate unique media IDs'
        ],
        nonFunctional: [
          'Upload speed: network limited',
          'Resume from any chunk'
        ]
      },
      hints: [
        'Chunked: split file into 5MB chunks, upload each',
        'Pre-signed: generate S3 pre-signed URL, client uploads direct',
        'Validation: check magic bytes, not just extension'
      ],
      expectedComponents: ['Upload Handler', 'Chunk Manager', 'Validation Service'],
      successCriteria: ['Uploads work', 'Resumable enabled'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Object Storage Integration',
      phase: 1,
      phaseTitle: 'Storage',
      learningObjective: 'Store media in object storage',
      thinkingFramework: {
        framework: 'Blob Storage',
        approach: 'S3 or compatible object storage. Organize by tenant/date/id. Set storage class based on access pattern. Enable versioning for recovery.',
        keyInsight: 'Object storage is infinitely scalable and cheap. Perfect for media. Path structure enables efficient listing. Storage classes optimize cost.'
      },
      requirements: {
        functional: [
          'Store to S3/object storage',
          'Organize by tenant and date',
          'Support multiple storage classes',
          'Enable versioning'
        ],
        nonFunctional: [
          'Durability: 11 nines',
          'Availability: 99.99%'
        ]
      },
      hints: [
        'Path: s3://bucket/tenant_id/2024/01/15/media_id.ext',
        'Storage class: Standard for hot, IA for warm, Glacier for archive',
        'Versioning: recover from accidental deletes'
      ],
      expectedComponents: ['S3 Client', 'Path Generator', 'Storage Manager'],
      successCriteria: ['Files stored', 'Path structure works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Media Metadata',
      phase: 1,
      phaseTitle: 'Storage',
      learningObjective: 'Track media information',
      thinkingFramework: {
        framework: 'Metadata Database',
        approach: 'Store metadata separate from media. Extract EXIF, dimensions, duration. User-added tags and descriptions. Quick lookups without touching S3.',
        keyInsight: 'Listing S3 is slow. Store metadata in database for fast queries. "All images tagged sunset" is DB query, not S3 scan.'
      },
      requirements: {
        functional: [
          'Extract media metadata (EXIF, dimensions)',
          'User-defined tags and descriptions',
          'Query media by metadata',
          'Link metadata to storage location'
        ],
        nonFunctional: [
          'Metadata query < 50ms',
          'Support 100M records'
        ]
      },
      hints: [
        'Media: {id, storage_url, type, size, dimensions, duration, tags, created_at}',
        'EXIF: camera, location, timestamp from image',
        'Index: tags, created_at, type for common queries'
      ],
      expectedComponents: ['Metadata Store', 'EXIF Extractor', 'Query Engine'],
      successCriteria: ['Metadata extracted', 'Queries work'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Processing (Steps 4-6)
    {
      id: 'step-4',
      title: 'Image Processing',
      phase: 2,
      phaseTitle: 'Processing',
      learningObjective: 'Transform and optimize images',
      thinkingFramework: {
        framework: 'Image Pipeline',
        approach: 'Generate thumbnails, resize to standard sizes, optimize for web. Process async after upload. Store all variants. Serve appropriate variant.',
        keyInsight: 'Dont serve 4K image for thumbnail. Generate variants at upload time. Serve smallest variant that fits. Saves bandwidth, improves load time.'
      },
      requirements: {
        functional: [
          'Generate thumbnails',
          'Resize to standard sizes',
          'Optimize/compress images',
          'Convert formats (WebP, AVIF)'
        ],
        nonFunctional: [
          'Process < 10 seconds',
          '60-80% size reduction'
        ]
      },
      hints: [
        'Variants: thumbnail (150px), small (480px), medium (1024px), large (2048px)',
        'Format: WebP for modern browsers, JPEG fallback',
        'Quality: 80% quality usually imperceptible loss'
      ],
      expectedComponents: ['Image Processor', 'Variant Generator', 'Format Converter'],
      successCriteria: ['Thumbnails generated', 'Sizes optimized'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-5',
      title: 'Video Transcoding',
      phase: 2,
      phaseTitle: 'Processing',
      learningObjective: 'Process video for streaming',
      thinkingFramework: {
        framework: 'Transcoding Pipeline',
        approach: 'Transcode to multiple resolutions (1080p, 720p, 480p). Generate HLS/DASH segments for adaptive streaming. Extract poster frames.',
        keyInsight: 'Raw video is huge and incompatible. Transcoding creates web-friendly formats. Adaptive bitrate serves quality based on viewer bandwidth.'
      },
      requirements: {
        functional: [
          'Transcode to multiple resolutions',
          'Generate HLS segments',
          'Extract thumbnail frames',
          'Handle various input formats'
        ],
        nonFunctional: [
          'Transcode speed: 2x realtime',
          'Support 4K input'
        ]
      },
      hints: [
        'Resolutions: 1080p, 720p, 480p, 360p',
        'HLS: 6-second segments, .m3u8 playlist',
        'Poster: extract frame at 10% of duration'
      ],
      expectedComponents: ['Transcoder', 'HLS Generator', 'Frame Extractor'],
      successCriteria: ['Videos transcode', 'HLS playable'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Async Processing Queue',
      phase: 2,
      phaseTitle: 'Processing',
      learningObjective: 'Handle processing workload',
      thinkingFramework: {
        framework: 'Job Queue',
        approach: 'Upload returns immediately, processing is async. Job queue manages work. Workers scale based on queue depth. Track progress and notify on complete.',
        keyInsight: 'Video transcoding takes minutes. Cant block upload request. Queue job, return immediately, process in background, notify when done.'
      },
      requirements: {
        functional: [
          'Queue processing jobs',
          'Track job progress',
          'Retry failed jobs',
          'Notify on completion'
        ],
        nonFunctional: [
          'Job pickup < 5 seconds',
          'Auto-scale workers'
        ]
      },
      hints: [
        'Job: {id, media_id, type: transcode|thumbnail, status, progress}',
        'Queue: SQS, RabbitMQ, or Redis',
        'Notify: webhook or WebSocket on completion'
      ],
      expectedComponents: ['Job Queue', 'Worker Pool', 'Progress Tracker'],
      successCriteria: ['Jobs queued', 'Processing async'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Delivery (Steps 7-9)
    {
      id: 'step-7',
      title: 'CDN Integration',
      phase: 3,
      phaseTitle: 'Delivery',
      learningObjective: 'Accelerate media delivery',
      thinkingFramework: {
        framework: 'Edge Caching',
        approach: 'CDN caches media at edge locations. Origin is S3. Cache headers control freshness. Users served from nearest edge.',
        keyInsight: 'S3 in us-east-1, user in Tokyo = 200ms latency. CDN edge in Tokyo = 20ms. 10x faster. Plus CDN handles bandwidth, not your origin.'
      },
      requirements: {
        functional: [
          'Configure CDN distribution',
          'Set cache headers',
          'Purge cache on update',
          'Handle origin failover'
        ],
        nonFunctional: [
          'Cache hit rate > 90%',
          'Edge latency < 50ms'
        ]
      },
      hints: [
        'Cache-Control: public, max-age=31536000 (immutable media)',
        'Purge: invalidate specific paths on update',
        'Origin: S3 bucket with proper CORS'
      ],
      expectedComponents: ['CDN Config', 'Cache Manager', 'Purge Handler'],
      successCriteria: ['CDN serving', 'Cache effective'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Dynamic Image Serving',
      phase: 3,
      phaseTitle: 'Delivery',
      learningObjective: 'Serve images with transformations',
      thinkingFramework: {
        framework: 'Image CDN',
        approach: 'Request includes transform params (size, format). Edge or origin generates variant on-demand. Cache transformed version. Like Cloudinary/imgix.',
        keyInsight: 'Pre-generating all variants is expensive. Generate on first request, cache forever. /image.jpg?w=200&format=webp generates and caches 200px WebP.'
      },
      requirements: {
        functional: [
          'URL-based transformations',
          'Resize, crop, format conversion',
          'Cache transformed images',
          'Secure signed URLs'
        ],
        nonFunctional: [
          'First request < 500ms',
          'Cached request < 50ms'
        ]
      },
      hints: [
        'URL: /media/{id}?w=200&h=200&fit=crop&format=webp',
        'Signed: HMAC signature prevents abuse',
        'Cache key: full URL including params'
      ],
      expectedComponents: ['Transform Service', 'URL Signer', 'Transform Cache'],
      successCriteria: ['Transforms work', 'Caching effective'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Access Control',
      phase: 3,
      phaseTitle: 'Delivery',
      learningObjective: 'Secure media access',
      thinkingFramework: {
        framework: 'Signed URLs',
        approach: 'Private media requires authentication. Generate time-limited signed URLs. CDN validates signature. Prevent hotlinking and unauthorized access.',
        keyInsight: 'Public CDN URL = anyone can access. Signed URL = only your app can generate valid links. Expiration prevents link sharing.'
      },
      requirements: {
        functional: [
          'Generate signed URLs',
          'Time-limited access',
          'Validate at CDN edge',
          'Revoke access'
        ],
        nonFunctional: [
          'URL generation < 10ms',
          'Signature validation < 1ms'
        ]
      },
      hints: [
        'Signed: {url}?expires={timestamp}&signature={hmac}',
        'Expiration: 1 hour for streaming, 5 minutes for downloads',
        'Revoke: change signing key (affects all URLs)'
      ],
      expectedComponents: ['URL Signer', 'Signature Validator', 'Key Manager'],
      successCriteria: ['Signed URLs work', 'Unauthorized blocked'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Multi-Tenant Storage',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Isolate tenant media',
      thinkingFramework: {
        framework: 'Tenant Isolation',
        approach: 'Each tenant has isolated storage namespace. Quota management per tenant. Cross-tenant access prevented. Usage tracking and billing.',
        keyInsight: 'CMS serves multiple customers. Tenant A cant access tenant Bs media. Quotas prevent one tenant from consuming all storage.'
      },
      requirements: {
        functional: [
          'Tenant-isolated storage',
          'Per-tenant quotas',
          'Usage tracking',
          'Tenant-scoped queries'
        ],
        nonFunctional: [
          'Zero cross-tenant access',
          'Quota enforcement real-time'
        ]
      },
      hints: [
        'Path: /{tenant_id}/media/{id}',
        'Quota: check before upload, reject if exceeded',
        'Usage: track bytes stored per tenant'
      ],
      expectedComponents: ['Tenant Manager', 'Quota Enforcer', 'Usage Tracker'],
      successCriteria: ['Isolation works', 'Quotas enforced'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Search and Discovery',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Find media efficiently',
      thinkingFramework: {
        framework: 'Media Search',
        approach: 'Full-text search on metadata. Filter by type, date, tags. AI-generated labels and captions. Visual similarity search.',
        keyInsight: 'Millions of assets, users need to find specific one. Search by filename, tags, AI-detected content. "Find all images with dogs" using ML labels.'
      },
      requirements: {
        functional: [
          'Full-text metadata search',
          'Filter by attributes',
          'AI-generated labels',
          'Visual similarity'
        ],
        nonFunctional: [
          'Search < 200ms',
          'AI labeling async'
        ]
      },
      hints: [
        'Elasticsearch: index title, description, tags, AI labels',
        'AI: AWS Rekognition, Google Vision for auto-tagging',
        'Similarity: vector embedding, nearest neighbor search'
      ],
      expectedComponents: ['Search Index', 'AI Labeler', 'Similarity Engine'],
      successCriteria: ['Search works', 'AI labels applied'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Global Distribution',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Serve media worldwide',
      thinkingFramework: {
        framework: 'Multi-Region Storage',
        approach: 'Store in multiple regions for compliance and latency. Replicate popular media to all regions. Route uploads to nearest region.',
        keyInsight: 'GDPR: EU data in EU. Latency: origin near user. Multi-region storage solves both. Replicate hot media, keep cold media in single region.'
      },
      requirements: {
        functional: [
          'Multi-region storage',
          'Regional upload routing',
          'Cross-region replication',
          'Compliance controls'
        ],
        nonFunctional: [
          'Regional latency < 100ms',
          'Replication lag < 1 hour'
        ]
      },
      hints: [
        'Regions: US, EU, APAC at minimum',
        'Upload routing: GeoDNS to nearest region',
        'Compliance: data residency flags per tenant'
      ],
      expectedComponents: ['Region Router', 'Replication Manager', 'Compliance Controller'],
      successCriteria: ['Multi-region works', 'Compliance met'],
      estimatedTime: '8 minutes'
    }
  ]
};
