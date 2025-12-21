import { GuidedTutorial } from '../../types/guidedTutorial';

export const pastebinProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'pastebin-progressive',
  title: 'Design Pastebin - Text Sharing Service',
  description: 'Build a text sharing platform from simple paste to global CDN-backed service',
  difficulty: 'medium',
  estimatedTime: '60 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design URL shortening with collision-resistant IDs',
    'Handle text storage efficiently at scale',
    'Implement paste expiration and cleanup',
    'Add syntax highlighting and collaboration features',
    'Build global distribution with edge caching'
  ],
  prerequisites: ['Database basics', 'Hashing', 'CDN concepts'],
  tags: ['url-shortening', 'storage', 'cdn', 'text-processing'],

  progressiveStory: {
    title: 'Pastebin Evolution',
    premise: "You're building a text sharing service starting with simple paste functionality. As millions of developers start using it for code sharing, you'll scale to handle massive read traffic and add developer-friendly features.",
    phases: [
      { phase: 1, title: 'Simple Paste Service', description: 'Core paste creation and retrieval' },
      { phase: 2, title: 'Developer Features', description: 'Syntax highlighting and user accounts' },
      { phase: 3, title: 'Scale & Reliability', description: 'Handle viral pastes and ensure durability' },
      { phase: 4, title: 'Advanced Platform', description: 'Collaboration and content intelligence' }
    ]
  },

  steps: [
    // PHASE 1: Simple Paste Service (Steps 1-3)
    {
      id: 'step-1',
      title: 'Paste Creation & URL Generation',
      phase: 1,
      phaseTitle: 'Simple Paste Service',
      learningObjective: 'Generate unique, short URLs for text content',
      thinkingFramework: {
        framework: 'ID Generation Strategy',
        approach: 'Short URLs need to be unique, unpredictable (for private pastes), and short. Options: auto-increment + encode, random string, or hash-based.',
        keyInsight: 'Base62 encoding (a-zA-Z0-9) of random bytes gives short, URL-safe IDs. 6 chars = 56 billion combinations.'
      },
      requirements: {
        functional: [
          'Accept text content and create paste',
          'Generate unique short URL (6-8 characters)',
          'Support custom URL aliases (if available)',
          'Return shareable paste URL'
        ],
        nonFunctional: []
      },
      hints: [
        'Use cryptographically random bytes, not sequential IDs',
        'Check for collisions before committing',
        'Reserve common words from custom aliases'
      ],
      expectedComponents: ['Paste Service', 'ID Generator', 'Database'],
      successCriteria: ['Unique URLs generated consistently', 'Custom aliases work when available'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Paste Retrieval',
      phase: 1,
      phaseTitle: 'Simple Paste Service',
      learningObjective: 'Efficiently retrieve and display paste content',
      thinkingFramework: {
        framework: 'Read-Heavy Optimization',
        approach: 'Pastes are written once, read many times (100:1 ratio typical). Optimize the read path with caching and efficient storage.',
        keyInsight: 'Most pastes are small (<10KB) but some are huge (1MB+). Handle both efficiently.'
      },
      requirements: {
        functional: [
          'Retrieve paste by short URL',
          'Display paste content with metadata (created, size)',
          'Handle paste not found gracefully',
          'Support raw content download'
        ],
        nonFunctional: []
      },
      hints: [
        'Cache hot pastes in memory',
        'Store content and metadata separately for flexibility',
        'Return 404 for non-existent pastes'
      ],
      expectedComponents: ['Paste Service', 'Cache Layer', 'Web UI'],
      successCriteria: ['Pastes load quickly', 'Raw download works'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-3',
      title: 'Paste Expiration',
      phase: 1,
      phaseTitle: 'Simple Paste Service',
      learningObjective: 'Implement automatic paste cleanup with TTL',
      thinkingFramework: {
        framework: 'Data Lifecycle Management',
        approach: 'Without expiration, storage grows forever. Support explicit expiration times and automatically clean up expired pastes.',
        keyInsight: 'Lazy deletion (check on read) vs eager deletion (background job). Use both: lazy for immediate effect, eager for storage reclamation.'
      },
      requirements: {
        functional: [
          'Set expiration time at paste creation (1h, 1d, 1w, never)',
          'Return 410 Gone for expired pastes',
          'Run background cleanup job for expired content',
          'Show remaining time on paste view'
        ],
        nonFunctional: []
      },
      hints: [
        'Store expiration timestamp, not duration',
        'Index on expiration for efficient cleanup queries',
        'Batch deletes to avoid performance spikes'
      ],
      expectedComponents: ['Paste Service', 'Cleanup Worker', 'Scheduler'],
      successCriteria: ['Expired pastes return 410', 'Storage reclaimed regularly'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Developer Features (Steps 4-6)
    {
      id: 'step-4',
      title: 'Syntax Highlighting',
      phase: 2,
      phaseTitle: 'Developer Features',
      learningObjective: 'Add language detection and code highlighting',
      thinkingFramework: {
        framework: 'Client vs Server Processing',
        approach: 'Syntax highlighting can be done client-side (JS library) or server-side (pre-rendered). Client is simpler, server is faster for viewers.',
        keyInsight: 'Detect language from content (heuristics) or file extension in custom URL. Fall back to plain text.'
      },
      requirements: {
        functional: [
          'Detect programming language automatically',
          'Allow manual language selection override',
          'Render highlighted code with line numbers',
          'Support 50+ languages'
        ],
        nonFunctional: []
      },
      hints: [
        'Use libraries like highlight.js or Prism',
        'Cache highlighted HTML for popular pastes',
        'Language detection: look for keywords, imports, syntax patterns'
      ],
      expectedComponents: ['Highlight Service', 'Language Detector', 'UI Renderer'],
      successCriteria: ['Code displays with proper highlighting', 'Language auto-detected correctly'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-5',
      title: 'User Accounts & Paste Management',
      phase: 2,
      phaseTitle: 'Developer Features',
      learningObjective: 'Add user accounts to manage paste history',
      thinkingFramework: {
        framework: 'Anonymous + Authenticated',
        approach: 'Support both anonymous pastes (no login) and user accounts (paste history, editing). Anonymous is the default, accounts add value.',
        keyInsight: 'Allow claiming anonymous pastes after signup if created from same session.'
      },
      requirements: {
        functional: [
          'User registration and login',
          'View paste history for logged-in users',
          'Edit and delete own pastes',
          'Private pastes (only visible to owner)'
        ],
        nonFunctional: []
      },
      hints: [
        'Link pastes to users with nullable foreign key',
        'Session-based anonymous paste tracking for claiming',
        'Soft delete to allow recovery'
      ],
      expectedComponents: ['Auth Service', 'User Dashboard', 'Paste Service'],
      successCriteria: ['Users can manage their pastes', 'Private pastes are truly private'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Paste Forking & Versioning',
      phase: 2,
      phaseTitle: 'Developer Features',
      learningObjective: 'Enable paste modification with history',
      thinkingFramework: {
        framework: 'Immutable with Versions',
        approach: 'Pastes are often iterated on. Support forking (create derivative) and versioning (edit history). Keep original URL stable.',
        keyInsight: 'Store diffs for versions to save space, but always keep full content for latest version for fast access.'
      },
      requirements: {
        functional: [
          'Fork any paste to create a copy',
          'Edit paste and save as new version',
          'View version history with diffs',
          'Link back to original paste (fork chain)'
        ],
        nonFunctional: []
      },
      hints: [
        'Store version as separate records with parent reference',
        'Compute diff on demand, not store it',
        'Limit versions per paste (last 50)'
      ],
      expectedComponents: ['Paste Service', 'Version Store', 'Diff Engine'],
      successCriteria: ['Fork chain visible', 'Version history shows changes'],
      estimatedTime: '6 minutes'
    },

    // PHASE 3: Scale & Reliability (Steps 7-9)
    {
      id: 'step-7',
      title: 'Global CDN Distribution',
      phase: 3,
      phaseTitle: 'Scale & Reliability',
      learningObjective: 'Serve pastes from edge locations worldwide',
      thinkingFramework: {
        framework: 'Edge Caching Strategy',
        approach: 'Pastes are immutable (except versions) - perfect for CDN. Cache at edge with long TTL. Invalidate on edit.',
        keyInsight: 'Viral pastes (like error messages) get millions of views. Edge caching handles this without origin scaling.'
      },
      requirements: {
        functional: [
          'Cache pastes at CDN edge locations',
          'Set appropriate cache headers (immutable content)',
          'Invalidate cache on paste edit or delete',
          'Serve from nearest edge to user'
        ],
        nonFunctional: [
          'p99 latency < 100ms globally',
          'Origin hit rate < 5% for existing pastes'
        ]
      },
      hints: [
        'Use surrogate keys for targeted invalidation',
        'Cache-Control: public, max-age=31536000 for immutable',
        'Vary header for raw vs HTML responses'
      ],
      expectedComponents: ['CDN Layer', 'Cache Invalidation Service', 'Origin Server'],
      successCriteria: ['Pastes load fast globally', 'Edits reflect immediately'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Storage Tiering',
      phase: 3,
      phaseTitle: 'Scale & Reliability',
      learningObjective: 'Optimize storage costs with hot/cold tiering',
      thinkingFramework: {
        framework: 'Access Pattern Based Storage',
        approach: 'Most pastes are accessed in first 24h, then rarely. Move cold pastes to cheaper storage (S3 Glacier) while keeping hot pastes in fast storage.',
        keyInsight: 'Compress old pastes before cold storage. Text compresses 80-90%, saving significant storage costs.'
      },
      requirements: {
        functional: [
          'Store recent pastes in fast storage (SSD)',
          'Migrate cold pastes to object storage after 30 days',
          'Archive very old pastes to glacier tier after 1 year',
          'Transparently retrieve from any tier'
        ],
        nonFunctional: [
          'Hot paste retrieval: < 50ms',
          'Cold paste retrieval: < 500ms',
          'Glacier retrieval: < 5 minutes (acceptable for year-old)'
        ]
      },
      hints: [
        'Track last access time for tiering decisions',
        'Pre-fetch from cold storage if access pattern changes',
        'Compress with zstd before cold storage'
      ],
      expectedComponents: ['Storage Manager', 'Tier Migration Worker', 'Access Tracker'],
      successCriteria: ['Storage costs decrease 60%', 'Hot pastes still fast'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Abuse Prevention',
      phase: 3,
      phaseTitle: 'Scale & Reliability',
      learningObjective: 'Prevent spam, malware, and service abuse',
      thinkingFramework: {
        framework: 'Defense in Depth',
        approach: 'Attackers use pastebin for malware distribution, spam, and data exfiltration. Layer defenses: rate limiting, content scanning, and reporting.',
        keyInsight: 'Balance openness (anonymous pastes are valuable) with protection. Dont require login, but do rate limit and scan.'
      },
      requirements: {
        functional: [
          'Rate limit paste creation per IP',
          'Scan content for known malware patterns',
          'Allow users to report abusive content',
          'Auto-expire pastes flagged as suspicious'
        ],
        nonFunctional: [
          'Block 99% of automated abuse',
          'False positive rate < 0.1%'
        ]
      },
      hints: [
        'Use CAPTCHA for high-volume creators',
        'Hash-based malware signature matching',
        'Reputation scoring for IPs'
      ],
      expectedComponents: ['Rate Limiter', 'Content Scanner', 'Report Queue', 'Moderation Dashboard'],
      successCriteria: ['Spam reduced significantly', 'Legitimate users unaffected'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Advanced Platform (Steps 10-12)
    {
      id: 'step-10',
      title: 'Real-Time Collaboration',
      phase: 4,
      phaseTitle: 'Advanced Platform',
      learningObjective: 'Enable multiple users to edit simultaneously',
      thinkingFramework: {
        framework: 'Collaborative Editing',
        approach: 'Google Docs-style collaboration requires operational transformation (OT) or CRDTs to handle concurrent edits without conflicts.',
        keyInsight: 'For code, operational transformation is simpler than CRDTs. Each operation is insert/delete at position.'
      },
      requirements: {
        functional: [
          'Create collaborative paste sessions',
          'Sync edits across multiple users in real-time',
          'Show cursor positions of collaborators',
          'Handle concurrent edits without conflicts'
        ],
        nonFunctional: [
          'Edit latency < 100ms between users',
          'Support 10 simultaneous editors'
        ]
      },
      hints: [
        'Use WebSocket for real-time sync',
        'Operational transformation for conflict resolution',
        'Debounce saves to reduce server load'
      ],
      expectedComponents: ['Collaboration Service', 'OT Engine', 'WebSocket Server', 'Presence Service'],
      successCriteria: ['Multiple users can edit without conflicts', 'Changes sync in real-time'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-11',
      title: 'Paste Analytics',
      phase: 4,
      phaseTitle: 'Advanced Platform',
      learningObjective: 'Provide creators with paste performance insights',
      thinkingFramework: {
        framework: 'Privacy-Respecting Analytics',
        approach: 'Creators want to know who views their pastes. Provide aggregate analytics without tracking individual viewers.',
        keyInsight: 'Count views, referrers, and geography without storing personal data. Aggregate at the edge for privacy.'
      },
      requirements: {
        functional: [
          'Track view counts per paste',
          'Show referrer breakdown (where traffic comes from)',
          'Geographic distribution of viewers',
          'Time series of views (by hour/day)'
        ],
        nonFunctional: [
          'Analytics update within 5 minutes',
          'No PII stored in analytics'
        ]
      },
      hints: [
        'Increment counters at edge, sync to origin periodically',
        'Use HyperLogLog for unique visitor counts',
        'Country from IP, then discard IP'
      ],
      expectedComponents: ['Analytics Collector', 'Aggregation Service', 'Analytics Dashboard'],
      successCriteria: ['Creators see useful insights', 'Privacy preserved'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-12',
      title: 'Embed & API Platform',
      phase: 4,
      phaseTitle: 'Advanced Platform',
      learningObjective: 'Enable embedding and programmatic access',
      thinkingFramework: {
        framework: 'Platform Extensibility',
        approach: 'Developers want to embed pastes in docs, blogs, and tools. Provide embed widgets and a full API for integration.',
        keyInsight: 'Embed should be lightweight (just the code), not a full page. API should support all CRUD operations with auth.'
      },
      requirements: {
        functional: [
          'Generate embed code for any paste',
          'REST API for create/read/update/delete pastes',
          'API keys for authenticated access',
          'Rate limiting per API key'
        ],
        nonFunctional: [
          'Embed loads in < 500ms',
          'API SLA: 99.9% uptime'
        ]
      },
      hints: [
        'Embed via iframe with postMessage for height adjustment',
        'API versioning from day one (v1, v2)',
        'Webhook notifications for paste events'
      ],
      expectedComponents: ['Embed Service', 'API Gateway', 'API Key Manager', 'Rate Limiter'],
      successCriteria: ['Embeds work across sites', 'API is well-documented and reliable'],
      estimatedTime: '8 minutes'
    }
  ]
};
