import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Comprehensive Cloud Storage Platform Guided Tutorial - FR-FIRST EDITION
 *
 * An advanced 12-step tutorial teaching enterprise cloud storage system design
 * covering object storage, replication, versioning, access control, and CDN integration.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-4: Build basic working system (FR satisfaction)
 * Steps 5-12: Scale with advanced features (replication, versioning, ACL, CDN, multi-region)
 *
 * Key Concepts:
 * - Object storage architecture (S3-like)
 * - Multi-region replication
 * - File versioning and lifecycle
 * - Access Control Lists (ACL) and IAM
 * - CDN integration for fast delivery
 * - Metadata management
 * - Consistency models (strong vs eventual)
 * - Erasure coding for durability
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const cloudStorageRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a comprehensive cloud storage platform like AWS S3 or Google Cloud Storage",

  interviewer: {
    name: 'Dr. Emily Zhang',
    role: 'Distinguished Engineer at CloudScale Systems',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-object-operations',
      category: 'functional',
      question: "What are the fundamental object storage operations we need to support?",
      answer: "Users and applications need to:\n\n1. **PUT objects** - Upload files/objects to storage buckets\n2. **GET objects** - Download/retrieve objects\n3. **DELETE objects** - Remove objects from storage\n4. **LIST objects** - Query objects in a bucket with filtering\n5. **HEAD object** - Get object metadata without downloading content",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Object storage uses a flat namespace with buckets and keys, unlike hierarchical file systems",
    },
    {
      id: 'object-versioning',
      category: 'functional',
      question: "What happens if a user accidentally overwrites or deletes an important object?",
      answer: "We need **object versioning**! Every PUT operation creates a new version. Users can:\n1. **List all versions** of an object\n2. **Restore previous versions**\n3. **Delete specific versions** or enable version expiration\n4. **Permanent delete** requires deleting all versions\n\nThis is critical for data protection and compliance.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Versioning is fundamental to enterprise storage - it prevents data loss and enables compliance",
    },
    {
      id: 'access-control',
      category: 'functional',
      question: "How do we control who can access which objects?",
      answer: "We need multi-layered access control:\n\n1. **Bucket policies** - JSON policies defining permissions at bucket level\n2. **Access Control Lists (ACLs)** - Fine-grained permissions per object\n3. **IAM integration** - Role-based access for applications\n4. **Pre-signed URLs** - Temporary access for sharing\n5. **Public vs Private** - Objects can be public or require authentication",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Security in cloud storage requires multiple layers of access control",
    },
    {
      id: 'metadata-management',
      category: 'functional',
      question: "What metadata should we track for each object?",
      answer: "Essential metadata includes:\n- **System metadata**: Size, ETag (hash), creation/modification time, storage class\n- **User metadata**: Custom key-value pairs (max 2KB)\n- **Version ID**: Unique identifier for each version\n- **Content-Type**: MIME type for proper delivery\n- **Encryption status**: Which encryption method is used",
      importance: 'important',
      revealsRequirement: 'FR-1',
      learningPoint: "Rich metadata enables filtering, lifecycle policies, and proper content delivery",
    },
    {
      id: 'storage-classes',
      category: 'functional',
      question: "Should all data be stored the same way, or do we need different storage tiers?",
      answer: "We need **multiple storage classes** for cost optimization:\n\n1. **Standard** - Frequent access, high availability (default)\n2. **Infrequent Access (IA)** - Less frequent access, lower cost\n3. **Archive** - Long-term backup, lowest cost, retrieval delays\n4. **Intelligent Tiering** - Automatic tier movement based on access patterns\n\nLifecycle policies can automatically transition objects between tiers.",
      importance: 'important',
      revealsRequirement: 'FR-6',
      learningPoint: "Storage tiering can reduce costs by 70%+ for infrequently accessed data",
    },
    {
      id: 'multipart-upload',
      category: 'clarification',
      question: "How should we handle very large objects (10GB+)?",
      answer: "Use **multipart upload**:\n1. Split large files into parts (5MB - 5GB each)\n2. Upload parts in parallel\n3. Resume failed uploads\n4. Complete upload by assembling parts\n\nFor downloads, support **byte-range requests** to fetch specific parts.",
      importance: 'important',
      insight: "Multipart operations are essential for handling large objects efficiently",
    },
    {
      id: 'cdn-integration',
      category: 'clarification',
      question: "How do we deliver objects quickly to users worldwide?",
      answer: "Integrate with **CDN (Content Delivery Network)**:\n- Cache frequently accessed objects at edge locations\n- Reduce latency from 500ms+ to <50ms\n- Offload 80%+ of traffic from origin storage\n- Invalidate cache when objects are updated\n\nCDN is critical for public assets (images, videos, downloads).",
      importance: 'critical',
      insight: "CDN transforms object storage from regional to global service",
    },

    // SCALE & NFRs
    {
      id: 'throughput-operations',
      category: 'throughput',
      question: "How many storage operations should we support?",
      answer: "We need to handle:\n- **10 million requests per second** at peak\n- **1 trillion objects** total storage capacity\n- **100 petabytes** of data\n- **1 million buckets** across all customers",
      importance: 'critical',
      learningPoint: "Cloud storage operates at massive scale - S3 stores trillions of objects",
    },
    {
      id: 'throughput-bandwidth',
      category: 'throughput',
      question: "What's the expected bandwidth and data transfer volume?",
      answer: "At peak:\n- **1 TB/sec aggregate upload bandwidth**\n- **5 TB/sec aggregate download bandwidth** (reads > writes)\n- **100 PB data transfer per month**\n- Individual objects from 1 byte to 5TB",
      importance: 'critical',
      calculation: {
        formula: "10M req/sec × avg 100KB = 1 TB/sec",
        result: "Need distributed architecture across many storage nodes",
      },
      learningPoint: "Bandwidth requirements dwarf compute - storage is I/O bound",
    },
    {
      id: 'durability-requirement',
      category: 'availability',
      question: "What durability guarantee do we need for stored data?",
      answer: "Enterprise storage requires **99.999999999% durability (11 nines)**.\n\nThis means:\n- If you store 10 million objects, you expect to lose 1 object every 10,000 years\n- Achieved through replication (3+ copies) or erasure coding\n- Data loss is unacceptable for business-critical data",
      importance: 'critical',
      learningPoint: "11 nines durability is the industry standard for enterprise object storage",
    },
    {
      id: 'availability-sla',
      category: 'availability',
      question: "What availability SLA should we provide?",
      answer: "Standard tier: **99.99% availability** (52 minutes downtime/year)\nInfrequent Access: **99.9% availability** (8.7 hours downtime/year)\n\nAvailability = ability to access objects\nDurability = objects not lost\n\nThese are different guarantees!",
      importance: 'critical',
      learningPoint: "Availability and durability are distinct - you can have high durability but low availability",
    },
    {
      id: 'latency-operations',
      category: 'latency',
      question: "What's the latency requirement for storage operations?",
      answer: "For a single region:\n- **PUT/GET operations**: p99 < 100ms\n- **LIST operations**: p99 < 500ms (more complex queries)\n- **DELETE operations**: p99 < 50ms\n\nWith CDN: p99 < 50ms for cached GETs globally",
      importance: 'critical',
      learningPoint: "Metadata operations should be faster than data operations",
    },
    {
      id: 'consistency-model',
      category: 'consistency',
      question: "What consistency guarantees do we need?",
      answer: "**Strong consistency** for new objects:\n- After PUT succeeds, all subsequent GETs return the latest version\n- Read-after-write consistency\n- List-after-write consistency\n\nThis is a major improvement over eventual consistency (old S3 model).",
      importance: 'critical',
      learningPoint: "Strong consistency simplifies application logic but requires coordination",
    },
    {
      id: 'multi-region',
      category: 'geo',
      question: "Do we need to support cross-region replication?",
      answer: "Yes! **Cross-Region Replication (CRR)** enables:\n1. **Disaster recovery** - Data survives regional failures\n2. **Compliance** - Store data in specific geographic regions\n3. **Lower latency** - Serve users from nearest region\n4. **Live-live architecture** - Active-active across regions\n\nReplication can be automatic or on-demand.",
      importance: 'important',
      insight: "Multi-region replication is essential for enterprise-grade storage",
    },
    {
      id: 'encryption',
      category: 'security',
      question: "How do we secure data at rest and in transit?",
      answer: "Multiple encryption layers:\n\n**At rest:**\n- Server-side encryption (SSE) with service-managed keys\n- Customer-managed keys (KMS integration)\n- Client-side encryption before upload\n\n**In transit:**\n- TLS 1.3 for all API calls\n- Encrypted replication between regions",
      importance: 'important',
      insight: "Encryption is mandatory for compliance (GDPR, HIPAA, etc.)",
    },
  ],

  minimumQuestionsRequired: 4,
  criticalQuestionIds: ['core-object-operations', 'object-versioning', 'access-control', 'durability-requirement', 'multi-region'],
  criticalFRQuestionIds: ['core-object-operations', 'object-versioning', 'access-control'],
  criticalScaleQuestionIds: ['throughput-operations', 'durability-requirement', 'availability-sla', 'consistency-model'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Store and retrieve objects',
      description: 'PUT, GET, DELETE, LIST operations on objects',
      emoji: '📦',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Bucket management',
      description: 'Create, configure, and manage storage buckets',
      emoji: '🪣',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Metadata queries',
      description: 'Search and filter objects by metadata',
      emoji: '🔍',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Object versioning',
      description: 'Maintain and restore previous versions',
      emoji: '⏮️',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Access control',
      description: 'Policies, ACLs, and IAM integration',
      emoji: '🔐',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Storage classes',
      description: 'Multiple tiers for cost optimization',
      emoji: '📊',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1 million applications',
    writesPerDay: '500 billion PUT operations',
    readsPerDay: '2 trillion GET operations',
    peakMultiplier: 3,
    readWriteRatio: '4:1 (more reads than writes)',
    calculatedWriteRPS: { average: 5787037, peak: 10000000 },
    calculatedReadRPS: { average: 23148148, peak: 40000000 },
    maxPayloadSize: '~5TB (single object)',
    storagePerRecord: '~100KB average object size',
    storageGrowthPerYear: '~50PB new data annually',
    redirectLatencySLA: 'p99 < 100ms (single region)',
    createLatencySLA: 'p99 < 100ms (PUT operation)',
  },

  architecturalImplications: [
    '✅ 11 nines durability → Replication (3x) + erasure coding required',
    '✅ 10M req/sec → Massive horizontal partitioning across storage nodes',
    '✅ 1 trillion objects → Distributed metadata index (likely NoSQL)',
    '✅ Strong consistency → Consensus protocol for coordination (Paxos/Raft)',
    '✅ Multi-region → Cross-region replication with conflict resolution',
    '✅ CDN integration → Edge caching with cache invalidation',
  ],

  outOfScope: [
    'Block storage (EBS) and file storage (EFS)',
    'Real-time analytics on stored data',
    'Built-in data transformation/processing',
    'Mobile SDK implementation details',
    'Billing and metering system',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple object storage system where users can upload, download, and list objects. Advanced features like versioning, multi-region replication, and CDN come in later steps. Functionality first, then enterprise features!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '☁️',
  scenario: "Welcome to CloudScale Systems! You're building the next AWS S3.",
  hook: "Your first developer just installed your SDK. They're ready to upload their first object!",
  challenge: "Set up the basic request flow so applications can reach your storage API.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your cloud storage API is online!',
  achievement: 'Applications can now send requests to your storage service',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting API calls', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle objects yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Object Storage API',
  conceptExplanation: `Every cloud storage platform starts with a **Client** (SDK/API) connecting to a **Storage API Server**.

When an application uses S3:
1. The **Client** makes HTTP REST API calls (PUT /bucket/key, GET /bucket/key)
2. The **API Server** authenticates the request and routes it to storage
3. The server responds with success/failure and metadata

For object storage, the API is the product:
- RESTful API (HTTP verbs: PUT, GET, DELETE, HEAD, POST)
- XML or JSON responses
- Authentication via signatures (AWS Signature v4)
- Bucket and object key addressing

This is fundamentally different from file systems - it's a web service!`,

  whyItMatters: 'Without this API layer, applications cannot interact with storage. The API defines the contract.',

  realWorldExample: {
    company: 'AWS S3',
    scenario: 'Serving billions of requests daily',
    howTheyDoIt: 'S3 API is RESTful with simple HTTP semantics. Created in 2006, it became the industry standard that everyone else copied.',
  },

  keyPoints: [
    'Client = SDK or HTTP client making API requests',
    'API Server = handles authentication, routing, metadata',
    'RESTful API with standard HTTP methods (PUT, GET, DELETE)',
    'Bucket/key addressing: bucket-name/path/to/object',
  ],

  keyConcepts: [
    { title: 'Client SDK', explanation: 'Library that simplifies API calls', icon: '📱' },
    { title: 'API Server', explanation: 'Handles storage API requests', icon: '🖥️' },
    { title: 'RESTful', explanation: 'HTTP-based API with standard verbs', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'cloud-storage-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up foundation for object storage',
    taskDescription: 'Add a Client and API Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents applications using storage API', displayName: 'Client SDK' },
      { type: 'app_server', reason: 'Handles object storage API requests', displayName: 'API Server' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'API Server component added to canvas',
      'Client connected to API Server',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and API Server from the component palette onto the canvas',
    level2: 'Click the Client, then click the API Server to create a connection between them',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Storage API Handlers (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your API server is online, but it doesn't know how to handle object storage requests!",
  hook: "A developer just tried to PUT an object but got a 501 Not Implemented error.",
  challenge: "Write the Python code to handle PUT, GET, DELETE, and LIST operations.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your storage API can handle requests!',
  achievement: 'You implemented the core object storage operations',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can PUT objects', after: '✓' },
    { label: 'Can GET objects', after: '✓' },
    { label: 'Can LIST objects', after: '✓' },
  ],
  nextTeaser: "But where are we actually storing the object data?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Object Storage Handlers',
  conceptExplanation: `Every storage API endpoint needs a **handler function** that:
1. Validates the request (auth, permissions, parameters)
2. Processes the object operation
3. Returns appropriate response with metadata

Core handlers for object storage:
- \`put_object(bucket, key, data)\` - Store an object
- \`get_object(bucket, key)\` - Retrieve an object
- \`delete_object(bucket, key)\` - Remove an object
- \`list_objects(bucket, prefix)\` - List objects in bucket
- \`head_object(bucket, key)\` - Get metadata without content

For now, we'll store metadata in memory. The actual object data will go to Object Storage in the next step.`,

  whyItMatters: 'Without handlers, your API is just an empty shell. This is where business logic lives!',

  famousIncident: {
    title: 'S3 Outage 2017',
    company: 'AWS',
    year: '2017',
    whatHappened: 'A typo in a command during debugging took down S3 in us-east-1 for 4 hours. Many websites and services went dark because S3 API was unavailable.',
    lessonLearned: 'Object storage has become critical infrastructure. Redundancy and careful operations are essential.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'AWS S3',
    scenario: 'Handling millions of API requests per second',
    howTheyDoIt: 'S3 uses a distributed fleet of API servers. Each request is routed to the nearest available server via load balancers.',
  },

  keyPoints: [
    'Separate metadata (name, size, etag) from content (bytes)',
    'PUT generates ETag (MD5 hash) for data integrity',
    'GET can return partial content (byte ranges)',
    'LIST supports pagination and prefix filtering',
    'Use in-memory storage for metadata initially',
  ],

  quickCheck: {
    question: 'Why do we compute an ETag (hash) when storing an object?',
    options: [
      'To make uploads faster',
      'To verify data integrity and detect corruption',
      'To save storage space',
      'To improve search performance',
    ],
    correctIndex: 1,
    explanation: 'ETag (typically MD5 or SHA-256) allows clients to verify downloaded data matches uploaded data, detecting any corruption or tampering.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function processing an API request', icon: '⚙️' },
    { title: 'ETag', explanation: 'Hash of object data for integrity', icon: '🔒' },
    { title: 'Metadata', explanation: 'Info about object (size, type, etc.)', icon: '📋' },
  ],
};

const step2: GuidedStep = {
  id: 'cloud-storage-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Store and retrieve objects',
    taskDescription: 'Configure APIs and implement Python handlers for object operations',
    successCriteria: [
      'Click on API Server to open inspector',
      'Assign PUT /buckets/{bucket}/objects/{key}, GET /buckets/{bucket}/objects/{key}, DELETE /buckets/{bucket}/objects/{key}, GET /buckets/{bucket}/objects APIs',
      'Open the Python tab',
      'Implement put_object(), get_object(), delete_object(), and list_objects() functions',
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
    level1: 'Click on the API Server, then go to the APIs tab to assign endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for put_object, get_object, delete_object, and list_objects',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['PUT /buckets/{bucket}/objects/{key}', 'GET /buckets/{bucket}/objects/{key}', 'DELETE /buckets/{bucket}/objects/{key}', 'GET /buckets/{bucket}/objects'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Metadata Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! Your API server crashed and restarted...",
  hook: "All object metadata is GONE. Developers see 'NoSuchKey' errors for objects they just uploaded!",
  challenge: "Add a database to persist object metadata so it survives server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your object metadata is now durable!',
  achievement: 'Metadata survives server crashes and restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Metadata durability', after: '100%' },
  ],
  nextTeaser: "But we're storing object content in memory - that won't scale!",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Metadata Database',
  conceptExplanation: `In-memory storage is fast but volatile - data disappears on restart.

A **metadata database** stores critical information about objects:
- **Bucket metadata**: name, region, creation time, policies
- **Object metadata**: key, size, ETag, content-type, storage class
- **Version metadata**: version IDs, timestamps, is_latest flag
- **Access metadata**: permissions, ACLs, ownership

For cloud storage, we need tables for:
- \`buckets\` - Bucket configuration
- \`objects\` - Object metadata (NOT content)
- \`versions\` - Version history
- \`acls\` - Access control lists
- \`multipart_uploads\` - In-progress multipart uploads

CRITICAL: Database stores METADATA only, not actual object content.
Object content goes in Object Storage (next step).`,

  whyItMatters: 'Losing metadata means losing the index to all stored objects - they become inaccessible orphans.',

  famousIncident: {
    title: 'GitLab Database Deletion',
    company: 'GitLab',
    year: '2017',
    whatHappened: 'An engineer accidentally deleted the production database during an emergency. 6 hours of data were lost because backups failed. Users lost recent repositories.',
    lessonLearned: 'Database backups must be tested regularly. Have multiple backup strategies (replication + snapshots).',
    icon: '😱',
  },

  realWorldExample: {
    company: 'AWS S3',
    scenario: 'Indexing trillions of objects',
    howTheyDoIt: 'S3 uses a distributed metadata store with eventual consistency (now strong). Metadata is partitioned by bucket and key prefix for horizontal scaling.',
  },

  keyPoints: [
    'Database stores metadata, NOT object content',
    'Use SQL (PostgreSQL) or NoSQL (DynamoDB) depending on scale',
    'Index on (bucket, key) for fast lookups',
    'Index on (bucket, prefix) for efficient LIST operations',
    'Separate tables for buckets, objects, versions, ACLs',
  ],

  quickCheck: {
    question: 'Why do we separate object metadata from object content?',
    options: [
      'It makes the code simpler',
      'Metadata is queried frequently; content only on GET. Different access patterns need different storage.',
      'Databases are faster than object storage',
      'It saves money',
    ],
    correctIndex: 1,
    explanation: 'Metadata (size, ETag, modified time) is queried for LIST operations and HEAD requests. Content is only needed for GET. This different access pattern justifies separate storage.',
  },

  keyConcepts: [
    { title: 'Metadata', explanation: 'Information about objects', icon: '📋' },
    { title: 'Content', explanation: 'Actual object bytes', icon: '📄' },
    { title: 'Index', explanation: 'Fast lookup by bucket/key', icon: '🔍' },
  ],
};

const step3: GuidedStep = {
  id: 'cloud-storage-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1, FR-2: Persistent metadata storage',
    taskDescription: 'Add a Database and connect the API Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store object metadata, buckets, versions, ACLs', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'API Server connected to Database',
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
    level2: 'Click API Server, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Object Storage for Content
// =============================================================================

const step4Story: StoryContent = {
  emoji: '💣',
  scenario: "You're storing object content in server memory. A developer uploads a 5GB video file...",
  hook: "Your server runs out of memory and CRASHES! All in-flight requests fail.",
  challenge: "Move object content to dedicated Object Storage (S3-like) for unlimited scalability.",
  illustration: 'server-crash',
};

const step4Celebration: CelebrationContent = {
  emoji: '☁️',
  message: 'Objects are now stored durably in the cloud!',
  achievement: 'Unlimited storage capacity with 11 nines durability',
  metrics: [
    { label: 'Storage capacity', before: 'Limited to RAM', after: 'Unlimited' },
    { label: 'Object durability', after: '99.999999999%' },
    { label: 'Max object size', before: '100MB', after: '5TB' },
  ],
  nextTeaser: "But LIST operations are getting slow with millions of objects...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage: The Right Tool for Object Content',
  conceptExplanation: `**Never store object content in application memory or local disk!**

**Object Storage** (like AWS S3 internally) is purpose-built for storing objects:
- **Unlimited capacity**: Store petabytes without worrying about disk space
- **11 nines durability**: 99.999999999% via replication and erasure coding
- **HTTP-accessible**: Each object gets a unique URL/key
- **Cost-effective**: ~$0.023/GB/month vs expensive compute RAM

Architecture:
1. Client uploads object → API Server
2. API Server streams object → Object Storage backend
3. Object Storage returns storage key (hash or UUID)
4. API Server saves metadata + key → Database
5. Client downloads → API Server fetches from Object Storage → Client

For enterprise storage:
- Objects stored with **content-addressable keys** (SHA-256 hash)
- Enables **deduplication** - same content stored once
- Supports **erasure coding** (12+4 scheme for 11 nines durability)
- Multi-datacenter replication for availability`,

  whyItMatters: 'Without dedicated object storage, you cannot scale beyond hundreds of GB. Object storage enables petabyte-scale systems.',

  famousIncident: {
    title: 'S3 Durability Validation',
    company: 'AWS',
    year: '2021',
    whatHappened: 'AWS published that S3 had stored over 100 trillion objects and had NEVER lost a single object due to its durability design. This is the power of erasure coding and replication.',
    lessonLearned: '11 nines durability is achievable with proper architecture. Erasure coding is more efficient than simple replication.',
    icon: '🏆',
  },

  realWorldExample: {
    company: 'AWS S3',
    scenario: 'Storing 100+ trillion objects',
    howTheyDoIt: 'S3 uses custom-built object storage with erasure coding (14+4 scheme), automatic multi-AZ replication, and continuous integrity checking.',
  },

  diagram: `
┌────────┐     ┌──────────────┐     ┌──────────┐
│ Client │────▶│  API Server  │────▶│ Database │
└────────┘     └──────────────┘     │(metadata)│
                     │               └──────────┘
                     │
                     ▼
              ┌─────────────────┐
              │ Object Storage  │
              │   (S3-like)     │
              │   - Content     │
              │   - 11 nines    │
              │   - Unlimited   │
              └─────────────────┘
`,

  keyPoints: [
    'NEVER store object content in app server memory or disk',
    'Object Storage provides unlimited capacity and 11 nines durability',
    'Store metadata in Database, content in Object Storage',
    'Use content-addressable keys (hash) for deduplication',
    'Erasure coding (12+4) more efficient than 3x replication',
  ],

  quickCheck: {
    question: 'How does erasure coding achieve 11 nines durability more efficiently than replication?',
    options: [
      'It compresses the data',
      'It splits data into chunks + parity chunks, allowing reconstruction from any subset',
      'It uses better disks',
      'It backs up to tape',
    ],
    correctIndex: 1,
    explanation: 'Erasure coding (e.g., 12+4 scheme) splits data into 12 chunks + 4 parity chunks. You can lose any 4 chunks and still reconstruct the data. This gives similar durability to 3x replication but uses only 1.33x storage!',
  },

  keyConcepts: [
    { title: 'Object Storage', explanation: 'Scalable storage for object content', icon: '🪣' },
    { title: 'Erasure Coding', explanation: 'Efficient durability via parity chunks', icon: '🧩' },
    { title: 'Content-Addressable', explanation: 'Use hash as storage key', icon: '🔑' },
  ],
};

const step4: GuidedStep = {
  id: 'cloud-storage-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Store and retrieve objects durably',
    taskDescription: 'Add Object Storage for storing object content',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store actual object content with 11 nines durability', displayName: 'Object Storage' },
    ],
    successCriteria: [
      'Object Storage component added',
      'API Server connected to Object Storage',
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
    level1: 'Drag an Object Storage component onto the canvas',
    level2: 'Connect API Server to Object Storage. This is where actual object bytes are stored.',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 5: Add Cache for Metadata
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🐌',
  scenario: "You have 1 billion objects in storage. LIST operations take 5+ seconds!",
  hook: "Developers are complaining: 'Why is listing my bucket so slow?' Every query hits the database.",
  challenge: "Add a cache to make metadata queries lightning fast.",
  illustration: 'slow-loading',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Metadata queries are now 50x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'LIST latency', before: '5000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '92%' },
    { label: 'Database load', before: '100%', after: '8%' },
  ],
  nextTeaser: "But we have a single point of failure - one API server!",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Accelerate Metadata Operations',
  conceptExplanation: `A **cache** stores frequently accessed data in fast memory (Redis, Memcached).

Without cache:
\`\`\`
LIST request → Database (slow, 100ms+)
\`\`\`

With cache:
\`\`\`
LIST request → Cache (fast, 1ms) → Database (only on cache miss)
\`\`\`

For object storage, we cache:
- **Bucket metadata**: policies, region, configuration
- **Object listings**: Recent LIST results (with TTL)
- **Object metadata**: Size, ETag, content-type (for HEAD requests)
- **ACL data**: Access permissions (checked frequently)

Cache invalidation strategies:
- **Write-through**: Update cache when object is PUT/DELETE
- **TTL**: Expire cache entries after 5-10 minutes
- **Event-driven**: Invalidate on object changes`,

  whyItMatters: 'At 10M req/sec, hitting database for every LIST would melt it. Cache is essential for read-heavy workloads.',

  famousIncident: {
    title: 'Facebook Cache Stampede',
    company: 'Facebook',
    year: '2010',
    whatHappened: 'A configuration change caused all cache entries to expire simultaneously. Thousands of servers tried to repopulate cache from database, causing a stampede that took down the site for 2.5 hours.',
    lessonLearned: 'Stagger cache expiration times. Use probabilistic early expiration to prevent thundering herd.',
    icon: '🐘',
  },

  realWorldExample: {
    company: 'AWS S3',
    scenario: 'Serving billions of metadata requests',
    howTheyDoIt: 'S3 uses distributed caching layers. Recent LIST results and object metadata are cached aggressively. Cache hit rate > 90%.',
  },

  keyPoints: [
    'Cache sits between API Server and Database',
    'Cache bucket metadata, object listings, ACLs',
    'Invalidate cache on PUT/DELETE operations',
    'Set TTL (300s) to prevent stale data',
    'Use cache-aside pattern for read-heavy workloads',
  ],

  quickCheck: {
    question: 'When should you invalidate the metadata cache?',
    options: [
      'Never - rely on TTL',
      'Only when cache is full',
      'When objects are PUT, DELETE, or ACLs change',
      'Every hour',
    ],
    correctIndex: 2,
    explanation: 'Invalidate cache when metadata changes (PUT, DELETE, ACL updates) to ensure users see fresh data. TTL is a safety net, not the primary strategy.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not cached - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - auto expiration', icon: '⏰' },
  ],
};

const step5: GuidedStep = {
  id: 'cloud-storage-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-3: Fast metadata queries',
    taskDescription: 'Add a Redis cache between API Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache object metadata for fast queries', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'API Server connected to Cache',
      'Cache TTL configured (300 seconds)',
      'Cache strategy set (cache-aside)',
    ],
  },

  celebration: step5Celebration,

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
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect API Server to Cache. Set TTL to 300 seconds and strategy to cache-aside.',
    solutionComponents: [{ type: 'cache', config: { ttl: 300, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 6: Add Load Balancer for High Availability
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your single API server is at 100% CPU!",
  hook: "Traffic spiked 10x. One server can't handle millions of requests. Requests are timing out!",
  challenge: "Add a load balancer to distribute traffic across multiple API servers.",
  illustration: 'server-overload',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'Traffic is now distributed!',
  achievement: 'Load balancer eliminates single point of failure',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Request distribution', after: 'Balanced' },
    { label: 'Scalability', after: 'Horizontal' },
  ],
  nextTeaser: "But what about object versioning?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Horizontal Scalability',
  conceptExplanation: `A **Load Balancer** distributes incoming API requests across multiple servers.

Benefits:
- **Eliminate SPOF**: If one server dies, others continue serving
- **Horizontal scaling**: Add more servers to handle more traffic
- **Even distribution**: No single server gets overwhelmed
- **Health checks**: Remove unhealthy servers from rotation

Load balancing strategies:
- **Round-robin**: Distribute evenly across servers
- **Least connections**: Send to least busy server
- **Weighted**: Send more traffic to powerful servers
- **Session affinity**: NOT needed for stateless APIs (good!)

For object storage APIs:
- APIs are stateless (no session needed)
- Any server can handle any request
- Scale horizontally by adding servers
- Use Layer 7 (HTTP) load balancing for advanced routing`,

  whyItMatters: 'At 10M req/sec peak, no single server can handle the load. Load balancing is essential for high availability.',

  famousIncident: {
    title: 'AWS ELB Failure',
    company: 'AWS',
    year: '2012',
    whatHappened: 'Elastic Load Balancer in us-east-1 failed, taking down Netflix, Pinterest, Instagram for hours on Christmas Eve. The load balancer was a single point of failure.',
    lessonLearned: 'Even load balancers need redundancy. Use multiple layers and regions.',
    icon: '🎄',
  },

  realWorldExample: {
    company: 'AWS S3',
    scenario: 'Handling 10M+ requests per second',
    howTheyDoIt: 'S3 uses multiple layers of load balancers (DNS round-robin, L4, L7) to distribute traffic across massive API server fleets in each region.',
  },

  keyPoints: [
    'Load balancer sits between Client and API Servers',
    'Distributes traffic across multiple servers',
    'Enables horizontal scaling (add more servers)',
    'Health checks remove failed servers automatically',
    'Stateless APIs work great with load balancing',
  ],

  quickCheck: {
    question: 'Why are stateless APIs ideal for load balancing?',
    options: [
      'They are faster',
      'Any request can be handled by any server - no session affinity needed',
      'They use less memory',
      'They are more secure',
    ],
    correctIndex: 1,
    explanation: 'Stateless APIs don\'t require session stickiness. Any server can handle any request since all state is in the request (auth tokens, parameters). This enables true load distribution.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers for capacity', icon: '↔️' },
    { title: 'Stateless', explanation: 'No session state on servers', icon: '🔓' },
  ],
};

const step6: GuidedStep = {
  id: 'cloud-storage-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from high availability',
    taskDescription: 'Add a Load Balancer between Client and API Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute API traffic across servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to API Server',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Load Balancer onto the canvas between Client and API Server',
    level2: 'Reconnect: Client → Load Balancer → API Server',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 7: Implement Object Versioning
// =============================================================================

const step7Story: StoryContent = {
  emoji: '😱',
  scenario: "A customer accidentally overwrote their critical production database backup!",
  hook: "They frantically call support: 'I uploaded the wrong file! The old version is gone forever!'",
  challenge: "Implement object versioning so every PUT creates a new version instead of overwriting.",
  illustration: 'data-loss',
};

const step7Celebration: CelebrationContent = {
  emoji: '⏮️',
  message: 'Objects are now protected by versioning!',
  achievement: 'Users can restore previous versions and recover from mistakes',
  metrics: [
    { label: 'Versioning enabled', after: '✓' },
    { label: 'Version retention', after: 'Unlimited' },
    { label: 'Accidental overwrites', after: 'Recoverable' },
  ],
  nextTeaser: "But how do we control who can access which objects?",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Object Versioning: Protecting Against Data Loss',
  conceptExplanation: `**Object versioning** creates a new version for every PUT instead of overwriting.

How it works:
1. Enable versioning on bucket
2. First PUT creates version v1 with unique version ID (UUID)
3. Second PUT creates version v2, v1 becomes "non-current"
4. GET without version ID returns latest version
5. GET with version ID returns specific version
6. DELETE creates a "delete marker" (v3), object appears deleted
7. DELETE with version ID permanently deletes that version

Benefits:
- **Recover from overwrites**: Restore any previous version
- **Recover from deletes**: Remove delete marker to undelete
- **Compliance**: Meet regulatory requirements for data retention
- **Audit trail**: See full history of object changes

Implementation:
- Store version_id (UUID) in metadata database
- Flag is_latest = true for current version
- LIST can show all versions or just latest
- Lifecycle policies can expire old versions`,

  whyItMatters: 'Versioning is the #1 protection against accidental data loss. It turns destructive operations (PUT, DELETE) into non-destructive ones.',

  famousIncident: {
    title: 'Code Spaces Shutdown',
    company: 'Code Spaces',
    year: '2014',
    whatHappened: 'Hackers gained AWS console access and deleted all their S3 buckets and EC2 instances. Without versioning enabled, all customer data was lost. The company shut down permanently.',
    lessonLearned: 'Enable versioning + MFA delete on critical buckets. It makes deletion much harder for attackers.',
    icon: '☠️',
  },

  realWorldExample: {
    company: 'AWS S3',
    scenario: 'Protecting trillions of objects',
    howTheyDoIt: 'S3 versioning is bucket-level setting. Each PUT generates unique version ID. Delete markers enable soft deletes. MFA Delete adds extra protection.',
  },

  diagram: `
Versioning Timeline:
─────────────────────────────────────────────────────────▶
   PUT v1      PUT v2      DELETE      GET        Restore
   (file.txt)  (file.txt)  (marker)    (latest)   (v1)

   v1          v2          v3          Returns    Remove
   created     created     (delete     404        marker
                           marker)                → v2
`,

  keyPoints: [
    'Each PUT creates a new version with unique version ID (UUID)',
    'DELETE creates a delete marker (soft delete)',
    'GET without version ID returns latest version',
    'GET with version ID returns specific version',
    'Lifecycle policies can expire old versions to save costs',
    'MFA Delete prevents accidental/malicious deletion',
  ],

  quickCheck: {
    question: 'What happens when you DELETE an object in a versioned bucket?',
    options: [
      'The object is permanently deleted',
      'A delete marker is created; object appears deleted but versions remain',
      'All versions are deleted',
      'Nothing happens',
    ],
    correctIndex: 1,
    explanation: 'DELETE in a versioned bucket creates a delete marker. The object appears deleted for unversioned requests, but all versions remain and can be restored by removing the delete marker.',
  },

  keyConcepts: [
    { title: 'Version ID', explanation: 'Unique identifier for each version', icon: '🆔' },
    { title: 'Delete Marker', explanation: 'Soft delete in versioned bucket', icon: '🚫' },
    { title: 'is_latest', explanation: 'Flag indicating current version', icon: '🏷️' },
  ],
};

const step7: GuidedStep = {
  id: 'cloud-storage-step-7',
  stepNumber: 7,
  frIndex: 3,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-4: Object versioning',
    taskDescription: 'Update object metadata schema to support versioning',
    successCriteria: [
      'Modify database schema to include version_id and is_latest columns',
      'Update PUT handler to create new versions instead of overwriting',
      'Update DELETE handler to create delete markers',
      'Add GET with version ID support',
      'Add LIST versions API',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Versioning is implemented in code and database schema, not as a new component',
    level2: 'Update the database to store version_id and is_latest. Modify PUT to create versions, DELETE to create markers.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Implement Access Control (ACLs and IAM)
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🔓',
  scenario: "A developer accidentally made their entire bucket PUBLIC!",
  hook: "Private customer data is now accessible to anyone on the internet. Security breach!",
  challenge: "Implement comprehensive access control with bucket policies, ACLs, and IAM integration.",
  illustration: 'security-breach',
};

const step8Celebration: CelebrationContent = {
  emoji: '🔐',
  message: 'Your storage is now secure!',
  achievement: 'Multi-layered access control protects objects',
  metrics: [
    { label: 'Access control layers', after: '3' },
    { label: 'Bucket policies', after: 'Supported' },
    { label: 'Object ACLs', after: 'Supported' },
    { label: 'IAM integration', after: 'Enabled' },
  ],
  nextTeaser: "But serving objects globally is slow...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Access Control: Securing Object Storage',
  conceptExplanation: `Cloud storage needs **multi-layered security** to protect data:

**Layer 1: Bucket Policies (Coarse-grained)**
- JSON documents defining permissions at bucket level
- Example: "Allow public read for /public/* prefix"
- Example: "Deny all DELETE unless from IP 1.2.3.4"
- Most powerful and flexible

**Layer 2: ACLs (Fine-grained)**
- Per-object permissions
- Grant specific users READ, WRITE, FULL_CONTROL
- Useful for sharing specific objects
- More granular than bucket policies

**Layer 3: IAM Integration**
- Authenticate API requests via IAM roles
- Applications use temporary credentials (STS)
- No long-lived access keys in code
- Principle of least privilege

**Pre-signed URLs**
- Temporary URLs with embedded signature
- Allow unauthenticated users to GET/PUT specific objects
- Expire after time limit (e.g., 1 hour)
- Great for sharing files

Permission evaluation order:
1. Explicit DENY in any policy → DENY
2. Explicit ALLOW in any policy → ALLOW
3. Default → DENY`,

  whyItMatters: 'Data breaches from misconfigured storage buckets are common. Proper access control is critical for security.',

  famousIncident: {
    title: 'Capital One Data Breach',
    company: 'Capital One',
    year: '2019',
    whatHappened: 'Misconfigured S3 bucket permissions exposed 100 million customer credit applications. The bucket was accessible via SSRF vulnerability. Cost: $80M in fines.',
    lessonLearned: 'Defense in depth. Use bucket policies, ACLs, AND IAM. Never rely on a single security layer.',
    icon: '💳',
  },

  realWorldExample: {
    company: 'AWS S3',
    scenario: 'Protecting objects for millions of customers',
    howTheyDoIt: 'S3 uses policy evaluation engine that checks bucket policies, ACLs, and IAM policies. Added Block Public Access as an additional safety net.',
  },

  diagram: `
Permission Evaluation:
┌─────────────────────────────────────┐
│  1. Explicit DENY anywhere? → DENY │
└─────────────────────────────────────┘
              │ No
              ▼
┌─────────────────────────────────────┐
│  2. Explicit ALLOW anywhere?        │
│     - Bucket Policy                 │
│     - Object ACL                    │
│     - IAM Policy                    │
└─────────────────────────────────────┘
         │ Yes        │ No
         ▼            ▼
       ALLOW        DENY
`,

  keyPoints: [
    'Bucket policies = coarse-grained, bucket-level permissions',
    'ACLs = fine-grained, per-object permissions',
    'IAM = identity-based access for applications',
    'Pre-signed URLs = temporary access for sharing',
    'Default = DENY unless explicitly allowed',
    'Explicit DENY always wins',
  ],

  quickCheck: {
    question: 'What happens if a bucket policy ALLOWs access but an ACL DENYs it?',
    options: [
      'Access is allowed (bucket policy wins)',
      'Access is denied (explicit DENY wins)',
      'Access depends on IAM policy',
      'Access is granted randomly',
    ],
    correctIndex: 1,
    explanation: 'Explicit DENY always wins. If any policy layer (bucket policy, ACL, IAM) denies access, the request is denied regardless of allows.',
  },

  keyConcepts: [
    { title: 'Bucket Policy', explanation: 'JSON document with bucket-level rules', icon: '📜' },
    { title: 'ACL', explanation: 'Per-object access control list', icon: '📋' },
    { title: 'IAM', explanation: 'Identity-based authentication', icon: '🎫' },
  ],
};

const step8: GuidedStep = {
  id: 'cloud-storage-step-8',
  stepNumber: 8,
  frIndex: 4,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-5: Access control',
    taskDescription: 'Implement access control layers: bucket policies, ACLs, IAM',
    successCriteria: [
      'Add ACL table to database',
      'Implement bucket policy evaluation engine',
      'Add IAM authentication to API handlers',
      'Implement pre-signed URL generation',
      'Add permission check before each operation',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Access control is implemented in code and database, not as separate components',
    level2: 'Add ACL table to database. Implement policy evaluation engine in API handlers. Check permissions before every operation.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 9: Add CDN for Global Content Delivery
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🌍',
  scenario: "Users in Asia are complaining - downloading a 100MB file takes 2 minutes!",
  hook: "Your storage is in US-East. Cross-continent transfers are SLOW. Users are frustrated.",
  challenge: "Integrate a CDN to cache objects at edge locations worldwide.",
  illustration: 'global-map',
};

const step9Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Your storage is now globally distributed!',
  achievement: 'CDN provides fast access from anywhere in the world',
  metrics: [
    { label: 'Download latency (Asia)', before: '2000ms', after: '50ms' },
    { label: 'Cache hit rate', after: '85%' },
    { label: 'Origin bandwidth saved', after: '85%' },
  ],
  nextTeaser: "But what about disaster recovery and regional failures?",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'CDN Integration: Global Content Delivery',
  conceptExplanation: `A **Content Delivery Network (CDN)** caches objects at edge locations worldwide.

Without CDN:
- User in Tokyo → 150ms latency to US-East storage
- Large files take minutes to download
- All traffic hits origin storage

With CDN:
- User in Tokyo → 10ms to Tokyo edge location (cache hit)
- 85%+ of requests served from cache
- Origin only handles cache misses and PUTs

How it works:
1. Client requests object via CDN URL (CloudFront, etc.)
2. CDN edge location checks local cache
3. **Cache hit**: Serve from edge (fast!)
4. **Cache miss**: Fetch from origin, cache for next time
5. Origin sends object to edge → edge caches → edge serves client

CDN benefits:
- **Reduced latency**: 150ms → 10ms for cached objects
- **Bandwidth savings**: 85% fewer requests to origin
- **DDoS protection**: Edge absorbs malicious traffic
- **Cost savings**: CDN bandwidth cheaper than origin

Cache invalidation:
- When object is updated (PUT), invalidate CDN cache
- Use versioned URLs to avoid stale cache (immutable pattern)
- Set appropriate cache TTL (e.g., 1 day for static content)`,

  whyItMatters: 'CDN transforms regional storage into global storage. Essential for serving users worldwide.',

  famousIncident: {
    title: 'Fastly CDN Outage',
    company: 'Fastly',
    year: '2021',
    whatHappened: 'A software bug in Fastly CDN took down major sites (Reddit, GitHub, Amazon, NYTimes) for 50 minutes. Shows how critical CDN has become to internet infrastructure.',
    lessonLearned: 'CDN is critical infrastructure. Have multi-CDN strategy for large deployments.',
    icon: '🌐',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Delivering video to 200+ countries',
    howTheyDoIt: 'Netflix built Open Connect, their own CDN with 18,000+ edge servers embedded in ISPs worldwide. Serves 125M+ hours of video daily.',
  },

  diagram: `
Without CDN:
User (Tokyo) ──150ms──▶ Origin Storage (US-East)

With CDN:
User (Tokyo) ──10ms──▶ Edge (Tokyo) ──Cache Hit──▶ ⚡
                            │
                            │ Cache Miss
                            ▼
                       Origin Storage (US-East)
`,

  keyPoints: [
    'CDN caches objects at edge locations worldwide',
    'Reduces latency from 150ms+ to <50ms for cached content',
    '85%+ cache hit rate for popular objects',
    'Invalidate CDN cache when objects are updated',
    'Use versioned URLs for immutable content (best practice)',
    'CDN bandwidth is cheaper than origin bandwidth',
  ],

  quickCheck: {
    question: 'Why do versioned URLs (e.g., /file-v2.jpg) work better with CDN than updating the same URL?',
    options: [
      'Versioned URLs are shorter',
      'Versioned URLs are immutable - can be cached forever without invalidation',
      'Versioned URLs load faster',
      'Versioned URLs use less bandwidth',
    ],
    correctIndex: 1,
    explanation: 'Versioned/hashed URLs are immutable. Once cached, they never need invalidation. New versions use new URLs. This is much simpler and more reliable than cache invalidation.',
  },

  keyConcepts: [
    { title: 'CDN', explanation: 'Distributed caching at edge locations', icon: '🌐' },
    { title: 'Edge Location', explanation: 'CDN cache close to users', icon: '📍' },
    { title: 'Cache Invalidation', explanation: 'Remove stale content from cache', icon: '🗑️' },
  ],
};

const step9: GuidedStep = {
  id: 'cloud-storage-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from fast global delivery',
    taskDescription: 'Add a CDN in front of Object Storage',
    componentsNeeded: [
      { type: 'cdn', reason: 'Cache objects at edge locations worldwide', displayName: 'CDN (CloudFront)' },
    ],
    successCriteria: [
      'CDN component added to canvas',
      'Client connected to CDN (for GETs)',
      'CDN connected to Load Balancer (origin)',
      'Configure cache TTL (86400 seconds for objects)',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a CDN component onto the canvas',
    level2: 'Connect: Client → CDN → Load Balancer. CDN sits in front for GET requests.',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'load_balancer' },
    ],
  },
};

// =============================================================================
// STEP 10: Add Multi-Region Replication
// =============================================================================

const step10Story: StoryContent = {
  emoji: '💥',
  scenario: "The entire US-East region went DOWN due to a massive AWS outage!",
  hook: "All your customer data is in US-East. Applications can't access ANY objects for hours!",
  challenge: "Implement cross-region replication so data survives regional failures.",
  illustration: 'disaster',
};

const step10Celebration: CelebrationContent = {
  emoji: '🌎',
  message: 'Your storage survives regional disasters!',
  achievement: 'Multi-region replication provides disaster recovery',
  metrics: [
    { label: 'Regions', after: '3 (US-East, US-West, EU)' },
    { label: 'Regional failure recovery', after: 'Automatic' },
    { label: 'Data redundancy', after: '99.999999999%' },
  ],
  nextTeaser: "But how do we handle conflicting updates across regions?",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Region Replication: Disaster Recovery',
  conceptExplanation: `**Cross-Region Replication (CRR)** copies objects to multiple geographic regions.

Single-region risk:
- Regional outages (AWS US-East 2017, 2020, etc.)
- Natural disasters
- Compliance requires data in specific regions

Multi-region architecture:
1. **Primary region**: Where objects are initially stored
2. **Replica regions**: Where objects are replicated to
3. **Replication lag**: Typically <1 second for metadata, <1 minute for large objects
4. **Bidirectional replication**: Updates in any region replicate to others

Replication modes:
- **Synchronous**: PUT waits for all replicas (slow, strong consistency)
- **Asynchronous**: PUT returns immediately, replicates async (fast, eventual consistency)

Conflict resolution:
- **Last-write-wins (LWW)**: Use timestamp to resolve conflicts
- **Version vectors**: Track causality across regions
- **Application-defined**: Let app decide conflict resolution

Benefits:
- **Disaster recovery**: Survive regional failures
- **Lower latency**: Serve from nearest region
- **Compliance**: Store data in required regions (GDPR, etc.)`,

  whyItMatters: 'Regional outages happen multiple times per year. Multi-region replication is essential for enterprise-grade storage.',

  famousIncident: {
    title: 'AWS US-East-1 Outage',
    company: 'AWS',
    year: '2020',
    whatHappened: 'Network connectivity issues in US-East-1 caused S3 outages for 5 hours. Services that relied solely on US-East-1 went down. Those with multi-region replication stayed online.',
    lessonLearned: 'Design for regional failure from day 1. Multi-region replication is not optional for critical systems.',
    icon: '🏗️',
  },

  realWorldExample: {
    company: 'AWS S3',
    scenario: 'Cross-Region Replication',
    howTheyDoIt: 'S3 CRR asynchronously replicates objects to destination region. Uses eventual consistency. Supports bidirectional replication with conflict resolution.',
  },

  diagram: `
Multi-Region Architecture:

     ┌─────────────────┐
     │   US-East-1     │
     │  (Primary)      │
     │  - Storage      │
     │  - Database     │
     └────────┬────────┘
              │
      Async Replication
              │
    ┌─────────┴─────────┐
    │                   │
    ▼                   ▼
┌──────────┐      ┌──────────┐
│ US-West-2│      │  EU-West │
│(Replica) │      │(Replica) │
│- Storage │      │- Storage │
│- Database│      │- Database│
└──────────┘      └──────────┘
`,

  keyPoints: [
    'Replicate objects to multiple regions for disaster recovery',
    'Asynchronous replication for performance (eventual consistency)',
    'Replication lag typically <1 minute',
    'Last-write-wins for conflict resolution',
    'Each region has full copy of data + metadata',
    'Routing directs requests to nearest healthy region',
  ],

  quickCheck: {
    question: 'Why use asynchronous replication instead of synchronous?',
    options: [
      'Asynchronous is more secure',
      'Asynchronous is cheaper',
      'Synchronous would add ~100ms latency to every PUT (cross-region roundtrip)',
      'Asynchronous uses less storage',
    ],
    correctIndex: 2,
    explanation: 'Synchronous replication requires waiting for cross-region network roundtrip (100-200ms). This would make PUTs unacceptably slow. Async replication allows fast PUTs with eventual consistency.',
  },

  keyConcepts: [
    { title: 'CRR', explanation: 'Cross-Region Replication', icon: '🌎' },
    { title: 'Async Replication', explanation: 'Replicate in background', icon: '⏱️' },
    { title: 'Last-Write-Wins', explanation: 'Timestamp-based conflict resolution', icon: '🕐' },
  ],
};

const step10: GuidedStep = {
  id: 'cloud-storage-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from disaster recovery',
    taskDescription: 'Add replica databases and object storage in secondary regions',
    componentsNeeded: [
      { type: 'database', reason: 'Metadata replica in US-West', displayName: 'Database (US-West)' },
      { type: 'object_storage', reason: 'Object replica in US-West', displayName: 'Object Storage (US-West)' },
    ],
    successCriteria: [
      'Add replica Database in second region',
      'Add replica Object Storage in second region',
      'Configure async replication between regions',
      'Set up automated failover',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add a second Database and Object Storage for the replica region',
    level2: 'Configure replication from primary to replica. Set up monitoring and automated failover.',
    solutionComponents: [
      { type: 'database', displayName: 'Database Replica' },
      { type: 'object_storage', displayName: 'Object Storage Replica' },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 11: Implement Storage Classes and Lifecycle Policies
// =============================================================================

const step11Story: StoryContent = {
  emoji: '💸',
  scenario: "Your monthly storage bill just hit $5 MILLION!",
  hook: "Finance is furious: 'We're storing 5-year-old backups at premium pricing! Optimize NOW!'",
  challenge: "Implement storage classes (Standard, IA, Archive) and lifecycle policies to reduce costs by 70%.",
  illustration: 'budget-crisis',
};

const step11Celebration: CelebrationContent = {
  emoji: '📊',
  message: 'Storage costs reduced by 70%!',
  achievement: 'Intelligent tiering and lifecycle policies optimize costs',
  metrics: [
    { label: 'Monthly storage cost', before: '$5M', after: '$1.5M' },
    { label: 'Storage classes', after: '4' },
    { label: 'Automated lifecycle', after: 'Enabled' },
  ],
  nextTeaser: "Almost done! Just need to add monitoring and analytics...",
};

const step11LearnPhase: TeachingContent = {
  conceptTitle: 'Storage Classes: Cost Optimization Through Tiering',
  conceptExplanation: `Not all data needs premium storage. **Storage classes** provide cost/performance tradeoffs:

**Storage Classes:**
1. **Standard** - $0.023/GB/month, <10ms access latency
   - Frequently accessed data (active files, website assets)

2. **Infrequent Access (IA)** - $0.0125/GB/month, <10ms latency
   - Accessed <1/month (backups, disaster recovery)
   - Retrieval fee: $0.01/GB

3. **Archive (Glacier)** - $0.004/GB/month, minutes-hours retrieval
   - Long-term backups, compliance archives
   - Retrieval fee: $0.02-0.05/GB depending on speed

4. **Deep Archive** - $0.00099/GB/month, 12+ hour retrieval
   - 7-10 year retention for compliance
   - Cheapest option

**Lifecycle Policies** automate transitions:
- After 30 days: Standard → IA
- After 90 days: IA → Archive
- After 365 days: Delete non-current versions
- Save 70%+ on storage costs

**Intelligent Tiering** (automatic):
- Monitors access patterns
- Moves objects between tiers automatically
- No retrieval fees
- Best for unknown access patterns`,

  whyItMatters: 'At petabyte scale, storage class optimization can save millions of dollars per month.',

  realWorldExample: {
    company: 'AWS S3',
    scenario: 'Storing 100+ trillion objects cost-efficiently',
    howTheyDoIt: 'S3 offers 8 storage classes from Standard ($0.023/GB/mo) to Deep Archive ($0.00099/GB/mo). Lifecycle policies automatically transition objects. Saves customers billions annually.',
  },

  diagram: `
Lifecycle Policy Example:

Object Created (Standard Storage)
        │
        │ 30 days
        ▼
  Infrequent Access (IA)
        │ Save 46%
        │ 60 days
        ▼
  Archive (Glacier)
        │ Save 83%
        │ 365 days
        ▼
  Delete old versions
        │ Save 100%
`,

  keyPoints: [
    'Standard = frequently accessed, highest cost',
    'IA = <1 access/month, 46% cheaper',
    'Archive = long-term backup, 83% cheaper',
    'Deep Archive = compliance, 96% cheaper',
    'Lifecycle policies automate transitions',
    'Intelligent Tiering monitors and moves automatically',
  ],

  quickCheck: {
    question: 'When should you use Infrequent Access (IA) instead of Standard storage?',
    options: [
      'For all objects to save money',
      'For objects accessed less than once per month',
      'For objects larger than 1GB',
      'For public objects only',
    ],
    correctIndex: 1,
    explanation: 'IA is cost-effective when objects are accessed <1/month. It has lower storage cost but charges retrieval fees. Break-even is around 1 access per month.',
  },

  keyConcepts: [
    { title: 'Storage Class', explanation: 'Cost/performance tier for objects', icon: '📊' },
    { title: 'Lifecycle Policy', explanation: 'Automated tier transitions', icon: '♻️' },
    { title: 'Intelligent Tiering', explanation: 'Automatic optimization', icon: '🤖' },
  ],
};

const step11: GuidedStep = {
  id: 'cloud-storage-step-11',
  stepNumber: 11,
  frIndex: 5,

  story: step11Story,
  learnPhase: step11LearnPhase,

  practicePhase: {
    frText: 'FR-6: Storage classes',
    taskDescription: 'Implement storage classes and lifecycle policies',
    successCriteria: [
      'Add storage_class column to object metadata',
      'Implement lifecycle policy engine',
      'Add automatic tier transitions based on age and access',
      'Update cost calculation to reflect storage class',
    ],
  },

  celebration: step11Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', to: 'cache' },
    ],
  },

  hints: {
    level1: 'Storage classes are implemented in code and database schema, not as separate components',
    level2: 'Add storage_class field to metadata. Implement lifecycle policy evaluation that runs periodically.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 12: Add Monitoring and Analytics
// =============================================================================

const step12Story: StoryContent = {
  emoji: '📊',
  scenario: "Your storage platform is production-ready, but you're flying blind!",
  hook: "A customer complains about slow downloads. You have no metrics to debug the issue!",
  challenge: "Add comprehensive monitoring and analytics to track performance, errors, and usage.",
  illustration: 'monitoring',
};

const step12Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built an enterprise cloud storage platform!',
  achievement: 'Complete system with monitoring, security, and global distribution',
  metrics: [
    { label: 'Durability', after: '99.999999999%' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Regions', after: '3' },
    { label: 'Storage capacity', after: 'Unlimited' },
    { label: 'Cost optimization', after: '70% savings' },
  ],
  nextTeaser: "You've mastered enterprise cloud storage system design!",
};

const step12LearnPhase: TeachingContent = {
  conceptTitle: 'Observability: Monitoring and Analytics',
  conceptExplanation: `You can't improve what you don't measure. **Observability** is critical for production systems.

**Metrics to track:**
- **Request metrics**: Request rate, latency (p50, p95, p99), error rate
- **Storage metrics**: Total objects, total bytes, storage class distribution
- **Performance metrics**: Throughput (MB/s), cache hit rate, replication lag
- **Cost metrics**: Storage costs by class, bandwidth costs, request costs
- **Availability metrics**: Uptime, error rates by type (4xx, 5xx)

**Logging:**
- **Access logs**: Every API request (caller, bucket, key, response code, latency)
- **Error logs**: Failed requests with stack traces
- **Audit logs**: Security events (permission changes, deletions)
- **Replication logs**: Cross-region replication status

**Alerting:**
- Error rate > 1% → Page on-call engineer
- p99 latency > 500ms → Warning
- Replication lag > 5 minutes → Alert
- Storage cost increase > 20% → Notify finance

**Analytics:**
- Access patterns (hot objects, cold objects)
- Storage growth trends
- Cost breakdown by customer, bucket, storage class
- Compliance reports (object count, encryption status)`,

  whyItMatters: 'Without monitoring, you cannot debug issues, optimize costs, or meet SLAs. Observability is not optional.',

  famousIncident: {
    title: 'GitHub Outage 2018',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'Network partition caused 24 hour outage. Post-mortem revealed monitoring gaps - they didn\'t detect the split-brain condition quickly enough.',
    lessonLearned: 'Comprehensive monitoring with automated alerting is essential. Monitor the full stack including network, storage, database.',
    icon: '📉',
  },

  realWorldExample: {
    company: 'AWS S3',
    scenario: 'Monitoring trillions of objects',
    howTheyDoIt: 'S3 provides CloudWatch metrics, access logging, CloudTrail for auditing. Storage Lens gives analytics across all buckets. Customers can set custom alarms.',
  },

  keyPoints: [
    'Track request rate, latency, error rate, throughput',
    'Log every access for debugging and compliance',
    'Alert on anomalies (error spikes, latency issues)',
    'Analyze access patterns for optimization',
    'Monitor costs to prevent budget overruns',
    'Export metrics to dashboard (Grafana, CloudWatch)',
  ],

  quickCheck: {
    question: 'Why track p99 latency instead of average latency?',
    options: [
      'p99 is easier to calculate',
      'Average hides outliers; p99 shows worst-case experience for 1% of users',
      'p99 is always higher',
      'p99 is more accurate',
    ],
    correctIndex: 1,
    explanation: 'Average latency can be misleading. If 99% of requests are fast but 1% are very slow, average looks good but 1% of users have terrible experience. p99 captures this.',
  },

  keyConcepts: [
    { title: 'Metrics', explanation: 'Numerical measurements over time', icon: '📈' },
    { title: 'Logs', explanation: 'Detailed records of events', icon: '📝' },
    { title: 'Alerts', explanation: 'Notifications for anomalies', icon: '🚨' },
  ],
};

const step12: GuidedStep = {
  id: 'cloud-storage-step-12',
  stepNumber: 12,
  frIndex: 0,

  story: step12Story,
  learnPhase: step12LearnPhase,

  practicePhase: {
    frText: 'All FRs require monitoring and observability',
    taskDescription: 'Add monitoring, logging, and analytics',
    componentsNeeded: [
      { type: 'monitoring', reason: 'Track metrics, logs, and alerts', displayName: 'Monitoring (CloudWatch)' },
    ],
    successCriteria: [
      'Add monitoring component',
      'Connect API Server to monitoring',
      'Configure metrics collection (request rate, latency, errors)',
      'Set up access logging',
      'Configure alerts for anomalies',
    ],
  },

  celebration: step12Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache', 'monitoring'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'monitoring' },
    ],
  },

  hints: {
    level1: 'Drag a Monitoring component onto the canvas',
    level2: 'Connect API Server to Monitoring. This enables metrics, logs, and alerts.',
    solutionComponents: [{ type: 'monitoring' }],
    solutionConnections: [{ from: 'app_server', to: 'monitoring' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const comprehensiveCloudStoragePlatformGuidedTutorial: GuidedTutorial = {
  problemId: 'comprehensive-cloud-storage-platform',
  title: 'Design a Comprehensive Cloud Storage Platform',
  description: 'Build an enterprise-grade object storage system with versioning, replication, ACLs, CDN, and multi-region support',
  difficulty: 'advanced',
  estimatedMinutes: 90,

  welcomeStory: {
    emoji: '☁️',
    hook: "You've been hired as Principal Engineer at CloudScale Systems!",
    scenario: "Your mission: Build a cloud storage platform that rivals AWS S3 - supporting trillions of objects, 99.999999999% durability, and global distribution.",
    challenge: "Can you design a system with object versioning, multi-region replication, CDN integration, and enterprise-grade security?",
  },

  requirementsPhase: cloudStorageRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10, step11, step12],

  // Meta information
  concepts: [
    'Object Storage Architecture',
    'RESTful API Design',
    'Metadata vs Content Separation',
    'Object Versioning',
    'Access Control Lists (ACL)',
    'Bucket Policies',
    'IAM Integration',
    'Erasure Coding',
    'Multi-Region Replication',
    'Cross-Region Replication (CRR)',
    'CDN Integration',
    'Storage Classes',
    'Lifecycle Policies',
    'Strong Consistency',
    'Cache Invalidation',
    'Load Balancing',
    'Monitoring and Observability',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval',
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 8: The Trouble with Distributed Systems',
    'Chapter 9: Consistency and Consensus',
  ],
};

export default comprehensiveCloudStoragePlatformGuidedTutorial;
