import { GuidedTutorial } from '../../types/guidedTutorial';

export const fileStorageProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'file-storage-progressive',
  title: 'Design Object Storage (S3/GCS)',
  description: 'Build an object storage system from simple file storage to global-scale blob service',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design blob storage with efficient chunking',
    'Implement metadata service for object management',
    'Build replication for durability (11 nines)',
    'Handle multipart uploads for large files',
    'Add versioning and lifecycle policies'
  ],
  prerequisites: ['Distributed systems', 'Storage systems', 'Networking'],
  tags: ['storage', 'blob', 'distributed-systems', 's3', 'durability'],

  progressiveStory: {
    title: 'Object Storage Evolution',
    premise: "You're building an object storage service like S3. Starting with simple file uploads, you'll evolve to store exabytes of data with 11 nines of durability across global regions.",
    phases: [
      { phase: 1, title: 'Basic Storage', description: 'Upload and retrieve objects' },
      { phase: 2, title: 'Scalable Architecture', description: 'Separate metadata from data' },
      { phase: 3, title: 'Durability & Performance', description: 'Replication and caching' },
      { phase: 4, title: 'Enterprise Features', description: 'Versioning, lifecycle, and analytics' }
    ]
  },

  steps: [
    // PHASE 1: Basic Storage (Steps 1-3)
    {
      id: 'step-1',
      title: 'Object Upload & Retrieval',
      phase: 1,
      phaseTitle: 'Basic Storage',
      learningObjective: 'Store and retrieve binary objects',
      thinkingFramework: {
        framework: 'Simple API First',
        approach: 'PUT object/{bucket}/{key} → store bytes. GET object/{bucket}/{key} → return bytes. Key is unique within bucket. Simple flat namespace.',
        keyInsight: 'Objects are immutable. PUT always creates new version (even if same key). No partial updates - replace entire object.'
      },
      requirements: {
        functional: [
          'Upload object with bucket and key',
          'Retrieve object by bucket and key',
          'Delete object',
          'List objects in bucket with prefix'
        ],
        nonFunctional: [
          'Support objects up to 5GB'
        ]
      },
      hints: [
        'Store: bucket/key → file on disk',
        'Flat namespace: key can contain "/" for pseudo-directories',
        'Return 404 for non-existent keys'
      ],
      expectedComponents: ['API Gateway', 'Storage Backend', 'Bucket Manager'],
      successCriteria: ['Upload/download works', 'List returns correct objects'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Bucket Management',
      phase: 1,
      phaseTitle: 'Basic Storage',
      learningObjective: 'Create and manage buckets',
      thinkingFramework: {
        framework: 'Namespace Isolation',
        approach: 'Buckets are top-level containers. Globally unique names. Each bucket has its own configuration (region, ACL). Objects scoped to bucket.',
        keyInsight: 'Bucket names are global (like domain names). First-come-first-served. DNS-compatible names for virtual-hosted URLs.'
      },
      requirements: {
        functional: [
          'Create bucket with unique name',
          'Delete empty bucket',
          'List all buckets for account',
          'Set bucket region at creation'
        ],
        nonFunctional: [
          'Bucket creation < 1 second'
        ]
      },
      hints: [
        'Bucket name: lowercase, 3-63 chars, DNS-compatible',
        'Global registry for uniqueness check',
        'Bucket metadata: {name, owner, region, created_at}'
      ],
      expectedComponents: ['Bucket Service', 'Name Registry', 'Region Selector'],
      successCriteria: ['Buckets created successfully', 'Names globally unique'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-3',
      title: 'Access Control',
      phase: 1,
      phaseTitle: 'Basic Storage',
      learningObjective: 'Implement permissions for buckets and objects',
      thinkingFramework: {
        framework: 'Layered Access Control',
        approach: 'IAM policies (who can do what) + bucket policies (bucket-level rules) + ACLs (object-level). Deny overrides allow.',
        keyInsight: 'Default deny. Access granted only if: no explicit deny AND (bucket policy allows OR IAM allows). Public access requires explicit bucket config.'
      },
      requirements: {
        functional: [
          'Authenticate requests (API keys, signed URLs)',
          'Authorize based on bucket policies',
          'Support pre-signed URLs for temporary access',
          'Configure public/private bucket access'
        ],
        nonFunctional: [
          'Auth check < 10ms'
        ]
      },
      hints: [
        'Signed URL: HMAC signature with expiration',
        'Bucket policy: JSON with Principal, Action, Resource',
        'Block public access by default (security)'
      ],
      expectedComponents: ['Auth Service', 'Policy Engine', 'URL Signer'],
      successCriteria: ['Unauthorized requests rejected', 'Signed URLs work'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Scalable Architecture (Steps 4-6)
    {
      id: 'step-4',
      title: 'Metadata Service',
      phase: 2,
      phaseTitle: 'Scalable Architecture',
      learningObjective: 'Separate metadata from blob storage',
      thinkingFramework: {
        framework: 'Metadata/Data Split',
        approach: 'Metadata (key, size, checksum, location) in database. Actual bytes in blob store. This scales independently and enables features.',
        keyInsight: 'Metadata is small but frequently accessed (listing, HEAD). Data is large but accessed less. Different storage tiers for each.'
      },
      requirements: {
        functional: [
          'Store object metadata separately',
          'Track object size, content-type, etag',
          'Support custom metadata headers',
          'Enable efficient listing without reading data'
        ],
        nonFunctional: [
          'Metadata lookup < 10ms',
          'Support billions of objects'
        ]
      },
      hints: [
        'Metadata: {bucket, key, size, etag, content_type, storage_locations}',
        'Partition metadata by bucket for scale',
        'Index on (bucket, key_prefix) for listing'
      ],
      expectedComponents: ['Metadata Store', 'Object Index', 'Location Tracker'],
      successCriteria: ['Metadata ops fast', 'Data ops dont affect metadata perf'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Chunked Storage',
      phase: 2,
      phaseTitle: 'Scalable Architecture',
      learningObjective: 'Store large objects as chunks',
      thinkingFramework: {
        framework: 'Chunking for Scalability',
        approach: 'Split large objects into fixed-size chunks (64MB). Store chunks on different nodes. Enables parallel upload/download, efficient dedup.',
        keyInsight: 'Content-addressed storage: chunk_id = hash(content). Identical chunks stored once (deduplication). Huge savings for similar files.'
      },
      requirements: {
        functional: [
          'Split uploads into chunks',
          'Store chunk metadata (order, checksum)',
          'Reconstruct object from chunks on download',
          'Deduplicate identical chunks'
        ],
        nonFunctional: [
          'Chunk size: 64MB default',
          'Dedup ratio: 30% for typical workloads'
        ]
      },
      hints: [
        'Chunk ID = SHA256(chunk_content)',
        'Object → chunk manifest: [{chunk_id, offset, size}]',
        'Check if chunk exists before storing (dedup)'
      ],
      expectedComponents: ['Chunker', 'Chunk Store', 'Manifest Manager', 'Deduplicator'],
      successCriteria: ['Large files chunked correctly', 'Dedup saves storage'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Multipart Upload',
      phase: 2,
      phaseTitle: 'Scalable Architecture',
      learningObjective: 'Upload large files in parts',
      thinkingFramework: {
        framework: 'Resumable Uploads',
        approach: 'Client uploads parts independently, then completes. Supports parallel upload, resume on failure. Essential for multi-GB files.',
        keyInsight: 'Each part is independent. Upload ID tracks in-progress upload. Parts can be uploaded in any order. Complete assembles them.'
      },
      requirements: {
        functional: [
          'Initiate multipart upload, get upload ID',
          'Upload individual parts with part numbers',
          'Complete upload, assembling parts',
          'Abort upload, cleaning up parts'
        ],
        nonFunctional: [
          'Support up to 10,000 parts',
          'Part size: 5MB - 5GB'
        ]
      },
      hints: [
        'Upload state: {upload_id, bucket, key, parts: [{part_num, etag, size}]}',
        'Parts stored as temporary chunks',
        'Complete: verify all parts, create final manifest'
      ],
      expectedComponents: ['Multipart Manager', 'Part Store', 'Assembly Service'],
      successCriteria: ['Large uploads work reliably', 'Failed uploads resumable'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Durability & Performance (Steps 7-9)
    {
      id: 'step-7',
      title: 'Replication for Durability',
      phase: 3,
      phaseTitle: 'Durability & Performance',
      learningObjective: 'Achieve 11 nines of durability',
      thinkingFramework: {
        framework: 'Redundancy Math',
        approach: '11 nines (99.999999999%) means losing 1 object per 100 billion per year. Replicate across independent failure domains (racks, AZs, regions).',
        keyInsight: 'Replication factor 3 across AZs: if P(AZ failure) = 0.1%, P(all 3 fail) = 0.0000001%. Plus erasure coding for efficiency.'
      },
      requirements: {
        functional: [
          'Replicate data across availability zones',
          'Verify replicas match (checksums)',
          'Automatically heal missing replicas',
          'Support configurable replication factor'
        ],
        nonFunctional: [
          'Durability: 99.999999999% (11 nines)',
          'Replica sync within 1 hour'
        ]
      },
      hints: [
        'Store 3 copies in different AZs',
        'Background scanner: verify checksums, repair corruption',
        'Erasure coding: 6 data + 3 parity survives any 3 failures'
      ],
      expectedComponents: ['Replication Manager', 'Integrity Checker', 'Repair Service'],
      successCriteria: ['Data survives AZ failure', 'Corruption detected and repaired'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Storage Tiering',
      phase: 3,
      phaseTitle: 'Durability & Performance',
      learningObjective: 'Offer different storage classes for cost optimization',
      thinkingFramework: {
        framework: 'Hot/Warm/Cold Storage',
        approach: 'Standard (SSD, frequent access), Infrequent Access (HDD, lower cost), Archive (tape, lowest cost). Move data based on access patterns.',
        keyInsight: 'Archive retrieval takes hours (tape recall). Charge for retrieval, not storage. Good for compliance data accessed yearly.'
      },
      requirements: {
        functional: [
          'Support multiple storage classes',
          'Set storage class at upload or transition',
          'Handle retrieval delays for archive tier',
          'Price differently per tier'
        ],
        nonFunctional: [
          'Archive: 90% cheaper than standard',
          'Archive retrieval: 1-12 hours'
        ]
      },
      hints: [
        'Standard: 3x replication on SSD',
        'IA: 3x replication on HDD',
        'Archive: erasure coding on tape'
      ],
      expectedComponents: ['Tier Manager', 'Transition Service', 'Retrieval Queue'],
      successCriteria: ['Tiers work correctly', 'Cost savings achieved'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'CDN Integration & Caching',
      phase: 3,
      phaseTitle: 'Durability & Performance',
      learningObjectpoint: 'Accelerate downloads with edge caching',
      thinkingFramework: {
        framework: 'Edge Distribution',
        approach: 'Popular objects cached at edge POPs. Reduces latency and origin load. CDN handles TLS termination, caching, and geo-routing.',
        keyInsight: 'Cache-Control headers determine CDN behavior. Immutable objects: cache forever. Versioned objects: cache with version in URL.'
      },
      requirements: {
        functional: [
          'Integrate with CDN for object delivery',
          'Set cache headers appropriately',
          'Support custom domains with TLS',
          'Invalidate CDN cache on object update'
        ],
        nonFunctional: [
          'CDN hit rate > 80% for popular objects',
          'Global latency < 100ms'
        ]
      },
      hints: [
        'Cache-Control: max-age=31536000 for immutable',
        'Version in URL: /objects/v1234/image.jpg',
        'Signed URLs for private CDN content'
      ],
      expectedComponents: ['CDN Connector', 'Cache Policy Manager', 'Invalidation Service'],
      successCriteria: ['Downloads faster via CDN', 'Invalidation works'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Enterprise Features (Steps 10-12)
    {
      id: 'step-10',
      title: 'Object Versioning',
      phase: 4,
      phaseTitle: 'Enterprise Features',
      learningObjective: 'Maintain version history of objects',
      thinkingFramework: {
        framework: 'Immutable History',
        approach: 'Every PUT creates new version, old version preserved. GET returns latest, can specify version ID. Delete creates delete marker.',
        keyInsight: 'Versioning protects against accidental deletion and modification. Storage cost increases (all versions stored). Lifecycle can clean old versions.'
      },
      requirements: {
        functional: [
          'Enable versioning per bucket',
          'Track version ID for each object version',
          'Get specific versions by version ID',
          'Soft delete with delete markers'
        ],
        nonFunctional: [
          'Version lookup < 20ms'
        ]
      },
      hints: [
        'Version ID: timestamp-based UUID',
        'Latest version: max(version_id) for key',
        'Delete marker: special version with is_delete_marker=true'
      ],
      expectedComponents: ['Version Manager', 'Version Store', 'Delete Marker Handler'],
      successCriteria: ['Versions tracked correctly', 'Old versions retrievable'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Lifecycle Policies',
      phase: 4,
      phaseTitle: 'Enterprise Features',
      learningObjective: 'Automate object transitions and expiration',
      thinkingFramework: {
        framework: 'Rule-Based Automation',
        approach: 'Rules: transition to IA after 30 days, archive after 90 days, delete after 365 days. Run daily, apply rules to matching objects.',
        keyInsight: 'Lifecycle saves cost automatically. Without it, data accumulates forever. Set and forget for compliance and cost management.'
      },
      requirements: {
        functional: [
          'Define lifecycle rules per bucket',
          'Transition objects between storage classes',
          'Expire (delete) objects after duration',
          'Apply rules based on prefix and tags'
        ],
        nonFunctional: [
          'Rules execute within 24 hours'
        ]
      },
      hints: [
        'Rule: {prefix, tags, transitions: [{days, storage_class}], expiration_days}',
        'Daily job: scan objects, apply matching rules',
        'Batch operations for efficiency'
      ],
      expectedComponents: ['Lifecycle Engine', 'Rule Evaluator', 'Transition Worker'],
      successCriteria: ['Transitions happen automatically', 'Expired objects deleted'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Storage Analytics & Monitoring',
      phase: 4,
      phaseTitle: 'Enterprise Features',
      learningObjective: 'Provide insights into storage usage',
      thinkingFramework: {
        framework: 'Observability',
        approach: 'Usage metrics: storage by bucket, requests by type, bandwidth. Access logs: who accessed what when. Cost allocation by tags.',
        keyInsight: 'Storage analytics help optimize costs. Find unused buckets, oversized objects, suboptimal storage classes. Data-driven decisions.'
      },
      requirements: {
        functional: [
          'Track storage usage by bucket',
          'Log all access requests',
          'Generate cost reports by tag',
          'Alert on unusual patterns'
        ],
        nonFunctional: [
          'Metrics delay < 1 hour',
          'Logs complete and queryable'
        ]
      },
      hints: [
        'Metrics: bucket_size, object_count, requests_by_type',
        'Access log: {timestamp, bucket, key, operation, requester, response_code}',
        'Cost allocation: tag-based grouping'
      ],
      expectedComponents: ['Metrics Collector', 'Access Logger', 'Analytics Dashboard', 'Alerting'],
      successCriteria: ['Usage visible in dashboard', 'Logs queryable for auditing'],
      estimatedTime: '8 minutes'
    }
  ]
};
