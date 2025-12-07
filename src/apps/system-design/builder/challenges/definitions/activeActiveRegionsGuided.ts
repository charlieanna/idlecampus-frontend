import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Collaborative Document Editor Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial teaching multi-region architecture
 * through building a Google Docs-like collaborative document editor.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build single region solution - FRs satisfied!
 * Steps 4-10: Apply multi-region NFRs (geo-routing, replication, conflict resolution)
 *
 * Key Concepts:
 * - Multi-region replication
 * - Conflict resolution (OT, CRDTs)
 * - Geo-routing and DNS
 * - Cross-region latency
 * - Split-brain scenarios
 * - Eventual consistency
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const activeActiveRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a collaborative document editor (like Google Docs) with active-active multi-region deployments",

  interviewer: {
    name: 'Sarah Chen',
    role: 'VP of Engineering',
    avatar: '👩‍💼',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    {
      id: 'core-operations',
      category: 'functional',
      question: "What are the core operations users perform on this platform?",
      answer: "Users perform four main operations:\n1. **Create Documents**: Start new documents with rich text formatting\n2. **Edit Documents**: Modify content with real-time updates visible to all collaborators\n3. **Collaborate**: Multiple users editing the same document simultaneously\n4. **Share**: Share documents with different permission levels (view, comment, edit)",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Collaborative editing requires handling concurrent writes from multiple users in real-time",
    },
    {
      id: 'conflict-handling',
      category: 'functional',
      question: "What happens if two users in different regions edit the same paragraph simultaneously?",
      answer: "Both edits must be preserved! Unlike inventory (where only one succeeds), document editing uses Operational Transformation (OT) or CRDTs to merge concurrent edits. The result should make sense to both users - no one loses their work.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Collaborative editing requires sophisticated conflict resolution that preserves all changes",
    },
    {
      id: 'global-access',
      category: 'functional',
      question: "Should users be able to access their documents from anywhere in the world?",
      answer: "Yes, absolutely. A user in Tokyo should be able to open a document created by someone in New York, edit it, and see changes from collaborators in London - all with minimal latency.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Global availability requires cross-region data replication and low-latency access",
    },

    // CLARIFICATIONS
    {
      id: 'offline-editing',
      category: 'clarification',
      question: "Do we need to support offline editing?",
      answer: "Yes, users should be able to edit documents offline and sync when they reconnect. Changes should merge automatically without conflicts. This is similar to how Google Docs works.",
      importance: 'important',
      insight: "Offline support requires conflict-free data types (CRDTs) that can merge without coordination",
    },
    {
      id: 'document-types',
      category: 'clarification',
      question: "What types of content do documents contain?",
      answer: "Rich text with formatting (bold, italic, headers), embedded images, tables, and comments. No complex objects like spreadsheets or drawings - those would be separate products.",
      importance: 'important',
      insight: "Simpler content types make conflict resolution easier to implement",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // THROUGHPUT
    {
      id: 'throughput-global',
      category: 'throughput',
      question: "What's the global scale we're targeting?",
      answer: "50 million active users globally, with ~15 million DAU across 3 regions (US, EU, APAC). Average user has 20 documents, edits 5 per day.",
      importance: 'critical',
      learningPoint: "Multi-region means distributing load across regions for both availability and latency",
    },
    {
      id: 'throughput-operations',
      category: 'throughput',
      question: "How frequently do users type and sync?",
      answer: "Very frequently during active editing:\n- Average typing: 2 characters/second when active\n- Sync frequency: Every 100ms for real-time collaboration\n- Peak: 10K concurrent editors on popular documents\n\nThis means potentially millions of small updates per second globally.",
      importance: 'critical',
      calculation: {
        formula: "15M DAU × 5 active editing sessions × 20 min avg = 1.5B edit-minutes/day",
        result: "~17K edits/sec average, 50K edits/sec peak",
      },
      learningPoint: "Real-time collaboration generates extremely high write frequency",
    },

    // LATENCY
    {
      id: 'latency-requirements',
      category: 'latency',
      question: "What are the latency requirements for users?",
      answer: "Users expect:\n- Keystroke to screen: < 50ms (feels instant)\n- Keystroke to collaborators: < 200ms (feels real-time)\n- Document open: < 500ms\n\nCross-region latency (~150ms) is unacceptable for typing feedback.",
      importance: 'critical',
      learningPoint: "Low latency requires serving users from their nearest region",
    },
    {
      id: 'latency-replication',
      category: 'latency',
      question: "What's the acceptable sync lag between regions?",
      answer: "For collaborative editing: ideally under 500ms for changes to propagate globally. Users understand there's slight delay seeing remote collaborators' changes, but their own typing must feel instant.",
      importance: 'critical',
      insight: "Local-first architecture with async global sync gives best UX",
    },

    // AVAILABILITY
    {
      id: 'availability-regional',
      category: 'availability',
      question: "What happens if an entire region goes down?",
      answer: "Users in that region should be automatically routed to the nearest healthy region. Documents must not be lost. We can tolerate slightly higher latency during regional outages. Target: 99.99% global availability.",
      importance: 'critical',
      learningPoint: "Active-active means automatic failover without data loss",
    },
    {
      id: 'availability-split-brain',
      category: 'availability',
      question: "What if network partition splits regions but each region is internally healthy?",
      answer: "Each region should continue serving users independently. When partition heals, we merge document changes using CRDTs. No edits should be lost. This is a key advantage of conflict-free data structures.",
      importance: 'critical',
      insight: "CRDTs enable continued editing during network partitions without losing data",
    },

    // CONSISTENCY
    {
      id: 'consistency-model',
      category: 'consistency',
      question: "How do we ensure all users see a consistent document state?",
      answer: "We use **eventual consistency** with CRDTs:\n- Each user's edits are immediately visible locally\n- Changes sync to other regions asynchronously\n- CRDTs guarantee all replicas converge to same state\n- No coordination needed - works during partitions",
      importance: 'critical',
      learningPoint: "CRDTs provide eventual consistency without coordination overhead",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-operations', 'conflict-handling', 'throughput-global', 'latency-requirements', 'availability-regional'],
  criticalFRQuestionIds: ['core-operations', 'conflict-handling', 'global-access'],
  criticalScaleQuestionIds: ['throughput-global', 'latency-requirements', 'availability-regional', 'consistency-model'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can create and edit documents',
      description: 'Create documents with rich text formatting and edit content',
      emoji: '📝',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Real-time collaboration',
      description: 'Multiple users can edit the same document simultaneously',
      emoji: '👥',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Document sharing',
      description: 'Share documents with view, comment, or edit permissions',
      emoji: '🔗',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Conflict-free concurrent editing',
      description: 'Simultaneous edits are merged without losing any changes',
      emoji: '🔄',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Global access with low latency',
      description: 'Users can access documents from any region with minimal delay',
      emoji: '🌍',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '15 million DAU (5M per region × 3 regions)',
    writesPerDay: '1.5 billion edit operations globally',
    readsPerDay: '500 million document opens globally',
    peakMultiplier: 3,
    readWriteRatio: '1:3 (write-heavy due to collaborative editing)',
    calculatedWriteRPS: { average: 17000, peak: 51000 },
    calculatedReadRPS: { average: 5800, peak: 17400 },
    maxPayloadSize: '~10MB for document with images',
    storagePerRecord: '~100KB average document',
    storageGrowthPerYear: '~5TB per region',
    redirectLatencySLA: 'p99 < 50ms (keystroke feedback)',
    createLatencySLA: 'p99 < 500ms (document open)',
  },

  architecturalImplications: [
    '✅ Multi-region active-active → DNS-based geo-routing required',
    '✅ p99 < 50ms for typing → Users must hit local region, not cross-region',
    '✅ 99.99% availability → Regional failover with automatic DNS updates',
    '✅ Concurrent editing → CRDTs or Operational Transformation',
    '✅ Cross-region sync → Async replication with conflict-free merge',
    '✅ Real-time updates → WebSocket connections for push updates',
  ],

  outOfScope: [
    'Spreadsheet functionality',
    'Drawing/diagram tools',
    'Presentation slides',
    'Version history UI',
    'User authentication system',
  ],

  keyInsight: "First, let's make it WORK in a single region with real-time collaboration. Once we have the core functionality, we'll extend it to multiple regions with replication, geo-routing, and CRDT-based conflict resolution.",
};

// =============================================================================
// STEP 1: Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📝',
  scenario: "Welcome! You're building a collaborative document editor that will serve millions of users worldwide - like Google Docs!",
  hook: "Your first user is ready to create a document. Let's get the basic system running!",
  challenge: "Connect the Client to the App Server to handle document requests.",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Client-Server Architecture',
  conceptExplanation: 'The foundation of every web application. The client-server model separates the user interface (client) from the business logic and data (server).',
  keyConcepts: [
    {
      title: 'Client',
      explanation: 'The browser or app where users write documents. Sends HTTP requests to the server.',
      icon: '💻',
    },
    {
      title: 'App Server',
      explanation: 'Handles business logic - processing document edits, managing permissions, and coordinating collaboration.',
      icon: '⚙️',
    },
    {
      title: 'HTTP/WebSocket',
      explanation: 'HTTP for document operations, WebSockets for real-time collaboration updates.',
      icon: '🔌',
    },
  ],
  whyItMatters: "The client-server model is the foundation. We'll add complexity as we scale globally.",
  keyPoints: ["The client-server model is the foundation.", "We'll add complexity as we scale globally."],
  diagram: `
    ┌──────────┐         ┌──────────────┐
    │  Client  │ ──────► │  App Server  │
    │  (User)  │ ◄────── │   (Logic)    │
    └──────────┘         └──────────────┘
  `,
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "You've connected your first user to the document editor!",
  achievement: "You've connected your first user to the document editor!",
  metrics: [
    { label: 'Documents Created', after: '1 document' },
    { label: 'Edit Latency', after: 'Local only' },
    { label: 'Collaboration', after: 'Single user' },
  ],
  nextTeaser: "But where do we store the documents? Let's add a database!",
};

const step1: GuidedStep = {
  id: 'active-active-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'FR-1: Users can create and edit documents',
    taskDescription: 'Connect Client to App Server',
    componentsNeeded: [
      { type: 'client', reason: 'Users need to access the document editor', displayName: 'Client' },
      { type: 'app_server', reason: 'Process document requests and business logic', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Client sends document requests to server' },
    ],
    successCriteria: ['Add Client component', 'Add App Server component', 'Connect Client → App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'Start with the Client - every user needs a way to access the editor',
    level2: 'Add an App Server to handle document operations',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Add Database for Document Storage
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💾',
  scenario: "Users love the editor, but when they refresh the page, their documents are gone!",
  hook: "We need persistent storage so documents survive restarts and are available across sessions.",
  challenge: "Add a database to store documents permanently.",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Database for Document Storage',
  conceptExplanation: 'Persisting documents for reliable access. A database ensures that data is saved permanently and can be retrieved later.',
  keyConcepts: [
    {
      title: 'Document Storage',
      explanation: 'Store document content, metadata, and revision history in a database.',
      icon: '📄',
    },
    {
      title: 'PostgreSQL',
      explanation: 'Excellent for structured document metadata, permissions, and ACID transactions.',
      icon: '🐘',
    },
    {
      title: 'Object Storage',
      explanation: 'Store large document content and embedded images in S3-compatible storage.',
      icon: '📦',
    },
  ],
  whyItMatters: "Use PostgreSQL for metadata and Object Storage for document content. This separation optimizes for different access patterns.",
  keyPoints: ["Use PostgreSQL for structured metadata.", "Use Object Storage for large content blobs."],
  diagram: `
    ┌──────────┐      ┌──────────────┐      ┌────────────┐
    │  Client  │ ───► │  App Server  │ ───► │  Database  │
    └──────────┘      └──────────────┘      │ (Postgres) │
                                             └────────────┘
  `,
};

const step2Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Documents are now saved permanently!",
  achievement: "Documents are now saved permanently!",
  metrics: [
    { label: 'Documents Created', after: '100 documents' },
    { label: 'Data Retention', after: 'Permanent' },
    { label: 'Storage Used', after: '10 MB' },
  ],
  nextTeaser: "Now let's enable multiple users to collaborate on the same document!",
};

const step2: GuidedStep = {
  id: 'active-active-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'FR-1: Users can create and edit documents',
    taskDescription: 'Add database for persistent document storage',
    componentsNeeded: [
      { type: 'database', reason: 'Store documents permanently', displayName: 'Database (PostgreSQL)' },
    ],
    connectionsNeeded: [
      { from: 'App Server', to: 'Database', reason: 'Server reads and writes documents' },
    ],
    successCriteria: ['Add Database component', 'Connect App Server → Database'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'We need persistent storage for documents',
    level2: 'Add a Database and connect it to the App Server',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 3: Add Real-Time Collaboration with WebSockets
// =============================================================================

const step3Story: StoryContent = {
  emoji: '👥',
  scenario: "Two users open the same document, but they can't see each other's changes in real-time!",
  hook: "For true collaboration, we need instant updates between all users viewing a document.",
  challenge: "Add WebSocket support for real-time synchronization.",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Real-Time Collaboration',
  conceptExplanation: 'Synchronizing edits across users instantly is crucial for collaborative editing.',
  keyConcepts: [
    {
      title: 'WebSockets',
      explanation: 'Persistent connections that allow the server to push updates instantly to all collaborators.',
      icon: '🔌',
    },
    {
      title: 'Operational Transformation',
      explanation: 'Algorithm that transforms concurrent edits so they can be applied in any order with consistent results.',
      icon: '🔄',
    },
    {
      title: 'Presence',
      explanation: 'Show other users\' cursors and selections in the document.',
      icon: '👆',
    },
  ],
  whyItMatters: "WebSockets enable real-time collaboration. OT or CRDTs handle concurrent edits.",
  keyPoints: ["WebSockets provide low-latency updates.", "Conflict resolution (OT/CRDT) is essential."],
  diagram: `
    ┌──────────┐                          ┌──────────┐
    │ Client A │ ◄──── WebSocket ────►    │ Client B │
    └────┬─────┘                          └────┬─────┘
         │                                      │
         └──────────► App Server ◄──────────────┘
                           │
                      ┌────┴────┐
                      │ Database │
                      └─────────┘
  `,
};

const step3Celebration: CelebrationContent = {
  emoji: '👥',
  message: "Real-time collaboration is working! Users can see each other's edits instantly!",
  achievement: "Real-time collaboration is working! Users can see each other's edits instantly!",
  metrics: [
    { label: 'Collaborators', after: '10 concurrent editors' },
    { label: 'Sync Latency', after: '< 100ms' },
    { label: 'Edit Conflicts', after: '0 (merged automatically)' },
  ],
  nextTeaser: "Great! But what happens when 1000 users access popular documents? Let's add caching!",
};

const step3: GuidedStep = {
  id: 'active-active-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'FR-2: Real-time collaboration',
    taskDescription: 'Enable real-time collaboration with WebSocket messaging',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Coordinate real-time updates between users', displayName: 'Message Queue (Redis Pub/Sub)' },
    ],
    connectionsNeeded: [
      { from: 'App Server', to: 'Message Queue', reason: 'Publish and subscribe to document changes' },
    ],
    successCriteria: ['Add Message Queue for real-time sync', 'Connect App Server → Message Queue'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },
  hints: {
    level1: 'We need a way to broadcast changes to all collaborators',
    level2: 'Add a Message Queue (Redis Pub/Sub) for real-time synchronization',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 4: Add Caching for Popular Documents
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⚡',
  scenario: "A company-wide memo is shared with 10,000 employees. The database is overwhelmed with read requests!",
  hook: "Popular documents are read far more often than edited. We need caching!",
  challenge: "Add a cache layer to reduce database load and improve read latency.",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching Strategy',
  conceptExplanation: 'Reducing database load for frequently accessed documents improves performance.',
  keyConcepts: [
    {
      title: 'Redis Cache',
      explanation: 'In-memory cache for document content and metadata with millisecond access.',
      icon: '⚡',
    },
    {
      title: 'Cache Invalidation',
      explanation: 'When a document is edited, invalidate the cache so readers get the latest version.',
      icon: '🔄',
    },
    {
      title: 'Read-Through Pattern',
      explanation: 'Check cache first, fall back to database on cache miss.',
      icon: '📖',
    },
  ],
  whyItMatters: "Cache popular documents but invalidate immediately on edits for consistency.",
  keyPoints: ["Read-through caching reduces DB load.", "Invalidation ensures consistency."],
  diagram: `
    Client → App Server → Cache → Database
                           ↓
                      (Cache Hit? Return immediately)
  `,
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Document access is now lightning fast!",
  achievement: "Document access is now lightning fast!",
  metrics: [
    { label: 'Cache Hit Rate', after: '95%' },
    { label: 'Read Latency', after: 'p99 < 10ms (cached)' },
    { label: 'Database Load', after: 'Reduced by 90%' },
  ],
  nextTeaser: "Now we're ready to go global! Let's add multi-region support.",
};

const step4: GuidedStep = {
  id: 'active-active-step-4',
  stepNumber: 4,
  frIndex: 4,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'FR-5: Global access with low latency',
    taskDescription: 'Add caching for frequently accessed documents',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache popular documents for fast access', displayName: 'Cache (Redis)' },
    ],
    connectionsNeeded: [
      { from: 'App Server', to: 'Cache', reason: 'Check cache before database' },
    ],
    successCriteria: ['Add Cache component', 'Connect App Server → Cache'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Popular documents are read frequently - we need caching',
    level2: 'Add a Redis Cache between App Server and Database',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer for Scalability
// =============================================================================

const step5Story: StoryContent = {
  emoji: '⚖️',
  scenario: "Usage is growing! A single app server can't handle all the WebSocket connections.",
  hook: "We need to distribute traffic across multiple servers while maintaining real-time sync.",
  challenge: "Add a load balancer to distribute traffic across multiple app servers.",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing',
  conceptExplanation: 'Distributing traffic for horizontal scaling ensures reliability under load.',
  keyConcepts: [
    {
      title: 'Load Balancer',
      explanation: 'Distributes incoming requests across multiple app servers.',
      icon: '⚖️',
    },
    {
      title: 'Sticky Sessions',
      explanation: 'WebSocket connections stay with the same server for the session duration.',
      icon: '🔗',
    },
    {
      title: 'Horizontal Scaling',
      explanation: 'Add more servers as load increases rather than making one server bigger.',
      icon: '📈',
    },
  ],
  whyItMatters: "Load balancing enables horizontal scaling. Use sticky sessions for WebSocket connections.",
  keyPoints: ["Load balancers distribute traffic.", "Sticky sessions are needed for WebSockets."],
  diagram: `
                    ┌─────────────────┐
                    │  Load Balancer  │
                    └────────┬────────┘
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ Server 1 │  │ Server 2 │  │ Server 3 │
        └──────────┘  └──────────┘  └──────────┘
  `,
};

const step5Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: "Traffic is distributed across multiple servers!",
  achievement: "Traffic is distributed across multiple servers!",
  metrics: [
    { label: 'Servers', after: '3 app servers' },
    { label: 'Throughput', after: '30K requests/sec' },
    { label: 'Availability', after: '99.9% (single region)' },
  ],
  nextTeaser: "Now let's go truly global with DNS-based geo-routing!",
};

const step5: GuidedStep = {
  id: 'active-active-step-5',
  stepNumber: 5,
  frIndex: 4,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'FR-5: Global access with low latency',
    taskDescription: 'Add load balancer for horizontal scaling',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across multiple servers', displayName: 'Load Balancer' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'All client requests go through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB routes to app servers' },
    ],
    successCriteria: ['Add Load Balancer', 'Connect Client → Load Balancer → App Server'],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'We need to distribute traffic across multiple servers',
    level2: 'Add a Load Balancer between Client and App Servers',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [{ from: 'client', to: 'load_balancer' }, { from: 'load_balancer', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 6: Add DNS for Global Geo-Routing
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🌍',
  scenario: "Users in Europe are experiencing 200ms latency because they're hitting US servers!",
  hook: "For a global editor, users need to connect to their nearest region automatically.",
  challenge: "Add DNS-based geo-routing to direct users to the closest region.",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'DNS-Based Geo-Routing',
  conceptExplanation: 'Directing users to the nearest region improves latency.',
  keyConcepts: [
    {
      title: 'GeoDNS',
      explanation: 'Returns different IP addresses based on the user\'s geographic location.',
      icon: '🌍',
    },
    {
      title: 'Latency-Based Routing',
      explanation: 'Route users to the region with lowest latency, not just geographic proximity.',
      icon: '⏱️',
    },
    {
      title: 'Anycast',
      explanation: 'Multiple servers share the same IP; network routes to nearest one.',
      icon: '📡',
    },
  ],
  whyItMatters: "GeoDNS ensures users hit their local region for minimal latency.",
  keyPoints: ["GeoDNS routes users to nearby regions.", "Anycast can also be used for routing."],
  diagram: `
    User (EU) → DNS → EU Region (closest)
    User (US) → DNS → US Region (closest)
    User (APAC) → DNS → APAC Region (closest)
  `,
};

const step6Celebration: CelebrationContent = {
  emoji: '🌍',
  message: "Users are automatically routed to their nearest region!",
  achievement: "Users are automatically routed to their nearest region!",
  metrics: [
    { label: 'Regions', after: '3 (US, EU, APAC)' },
    { label: 'Avg Latency', after: '< 50ms globally' },
    { label: 'User Experience', after: 'Feels local everywhere' },
  ],
  nextTeaser: "But the regions need to share data. Let's add cross-region replication!",
};

const step6: GuidedStep = {
  id: 'active-active-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'FR-5: Global access with low latency',
    taskDescription: 'Add DNS for global geo-routing',
    componentsNeeded: [
      { type: 'dns', reason: 'Route users to nearest region', displayName: 'DNS (Route53)' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'DNS', reason: 'Client queries DNS for server address' },
      { from: 'DNS', to: 'Load Balancer', reason: 'DNS returns regional load balancer IP' },
    ],
    successCriteria: ['Add DNS component', 'Connect Client → DNS → Load Balancer'],
  },
  validation: {
    requiredComponents: ['client', 'dns', 'load_balancer', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'dns' },
      { fromType: 'dns', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'We need to route users to their nearest region automatically',
    level2: 'Add DNS between Client and Load Balancer for geo-routing',
    solutionComponents: [{ type: 'dns' }],
    solutionConnections: [{ from: 'client', to: 'dns' }, { from: 'dns', to: 'load_balancer' }],
  },
};

// =============================================================================
// STEP 7: Add Database Replication
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔄',
  scenario: "A user in Tokyo creates a document, but their colleague in London can't see it!",
  hook: "Each region has its own database, but they're not synchronized.",
  challenge: "Add cross-region database replication so documents are available globally.",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Region Database Replication',
  conceptExplanation: 'Synchronizing data across geographic regions is required for global availability.',
  keyConcepts: [
    {
      title: 'Async Replication',
      explanation: 'Changes replicate to other regions asynchronously, minimizing write latency.',
      icon: '🔄',
    },
    {
      title: 'Multi-Leader Replication',
      explanation: 'Each region can accept writes independently - essential for active-active.',
      icon: '👥',
    },
    {
      title: 'Conflict Detection',
      explanation: 'Detect when the same document is modified in multiple regions simultaneously.',
      icon: '⚠️',
    },
  ],
  whyItMatters: "Active-active requires multi-leader replication with conflict handling.",
  keyPoints: ["Async replication minimizes latency.", "Multi-leader replication allows writes in all regions."],
  diagram: `
    US Database ◄──── Async Replication ────► EU Database
         │                                         │
         └─────────► APAC Database ◄───────────────┘
  `,
};

const step7Celebration: CelebrationContent = {
  emoji: '🔄',
  message: "Documents are now replicated across all regions!",
  achievement: "Documents are now replicated across all regions!",
  metrics: [
    { label: 'Replication Lag', after: '< 500ms' },
    { label: 'Global Consistency', after: 'Eventually consistent' },
    { label: 'Data Redundancy', after: '3x (one copy per region)' },
  ],
  nextTeaser: "But what happens when two people edit the same paragraph in different regions? Let's handle conflicts!",
};

const step7: GuidedStep = {
  id: 'active-active-step-7',
  stepNumber: 7,
  frIndex: 3,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'FR-4: Conflict-free concurrent editing',
    taskDescription: 'Add cross-region database replication',
    componentsNeeded: [],
    connectionsNeeded: [
      { from: 'Database', to: 'Database', reason: 'Cross-region replication' },
    ],
    successCriteria: ['Enable database replication between regions'],
  },
  validation: {
    requiredComponents: ['client', 'dns', 'load_balancer', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'dns' },
      { fromType: 'dns', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'Documents created in one region need to be available in others',
    level2: 'Enable database replication by connecting Database → Database',
    solutionComponents: [],
    solutionConnections: [{ from: 'database', to: 'database' }],
  },
};

// =============================================================================
// STEP 8: Add CRDT-Based Conflict Resolution
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🔀',
  scenario: "A network partition occurred! Users in US and EU both edited the same paragraph. When the partition healed, we have two conflicting versions!",
  hook: "This is the hardest problem in distributed systems - conflict resolution.",
  challenge: "Implement CRDT-based conflict resolution so concurrent edits merge automatically.",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'CRDTs for Conflict Resolution',
  conceptExplanation: 'Conflict-free Replicated Data Types allow concurrent edits to merge automatically.',
  keyConcepts: [
    {
      title: 'CRDTs',
      explanation: 'Data structures that can be modified concurrently and always converge to the same state.',
      icon: '🔀',
    },
    {
      title: 'Text CRDT (RGA)',
      explanation: 'Replicated Growable Array - a CRDT designed for collaborative text editing.',
      icon: '📝',
    },
    {
      title: 'Vector Clocks',
      explanation: 'Track causality to determine the order of concurrent events.',
      icon: '🕐',
    },
  ],
  whyItMatters: "CRDTs guarantee eventual consistency without coordination. All edits are preserved, no data is lost.",
  keyPoints: ["CRDTs ensure eventual consistency.", "No central coordinator is needed."],
  diagram: `
    User A (US): "Hello World"  → "Hello Beautiful World"
    User B (EU): "Hello World"  → "Hello New World"

    CRDT Merge Result: "Hello Beautiful New World"
    (Both edits preserved!)
  `,
};

const step8Celebration: CelebrationContent = {
  emoji: '🔀',
  message: "Concurrent edits are now merged automatically!",
  achievement: "Concurrent edits are now merged automatically!",
  metrics: [
    { label: 'Conflicts Resolved', after: '100% automatic' },
    { label: 'Data Lost', after: '0 edits' },
    { label: 'Merge Latency', after: '< 10ms' },
  ],
  nextTeaser: "Let's add monitoring to ensure our global system is healthy!",
};

const step8: GuidedStep = {
  id: 'active-active-step-8',
  stepNumber: 8,
  frIndex: 3,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'FR-4: Conflict-free concurrent editing',
    taskDescription: 'Implement CRDT-based conflict resolution',
    componentsNeeded: [
      { type: 'worker', reason: 'Process CRDT merge operations', displayName: 'CRDT Merge Worker' },
    ],
    connectionsNeeded: [
      { from: 'Message Queue', to: 'Worker', reason: 'Queue conflict resolution tasks' },
    ],
    successCriteria: ['Add Worker for CRDT processing', 'Connect Message Queue → Worker'],
  },
  validation: {
    requiredComponents: ['client', 'dns', 'load_balancer', 'app_server', 'database', 'message_queue', 'cache', 'worker'],
    requiredConnections: [
      { fromType: 'client', toType: 'dns' },
      { fromType: 'dns', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'message_queue', toType: 'worker' },
    ],
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'We need a way to process CRDT merge operations',
    level2: 'Add a Worker connected to the Message Queue for async CRDT processing',
    solutionComponents: [{ type: 'worker' }],
    solutionConnections: [{ from: 'message_queue', to: 'worker' }],
  },
};

// =============================================================================
// STEP 9: Add Monitoring
// =============================================================================

const step9Story: StoryContent = {
  emoji: '📊',
  scenario: "The EU region is experiencing slow replication, but we didn't notice until users complained!",
  hook: "We need visibility into our global system's health.",
  challenge: "Add monitoring for replication lag, latency, and system health.",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Global System Monitoring',
  conceptExplanation: 'Observability across regions helps detect issues like replication lag.',
  keyConcepts: [
    {
      title: 'Replication Lag',
      explanation: 'Monitor how far behind each region is from others.',
      icon: '⏱️',
    },
    {
      title: 'Cross-Region Latency',
      explanation: 'Track latency between regions to detect network issues.',
      icon: '🌐',
    },
    {
      title: 'Conflict Rate',
      explanation: 'Monitor how often conflicts occur and how they\'re resolved.',
      icon: '⚠️',
    },
  ],
  whyItMatters: "Monitor replication lag, cross-region latency, and conflict rates for a healthy global system.",
  keyPoints: ["Monitor replication lag.", "Track cross-region latency.", "Watch conflict rates."],
  diagram: `
    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │  US Region  │ ──► │  Monitoring │ ◄── │  EU Region  │
    └─────────────┘     │   System    │     └─────────────┘
                        └─────────────┘
                              ▲
                              │
                        ┌─────┴─────┐
                        │ APAC Rgn  │
                        └───────────┘
  `,
};

const step9Celebration: CelebrationContent = {
  emoji: '📊',
  message: "Full observability across all regions!",
  achievement: "Full observability across all regions!",
  metrics: [
    { label: 'Metrics Collected', after: '50+ per region' },
    { label: 'Alert Latency', after: '< 30 seconds' },
    { label: 'Dashboards', after: 'Real-time global view' },
  ],
  nextTeaser: "Finally, let's add automatic failover for regional outages!",
};

const step9: GuidedStep = {
  id: 'active-active-step-9',
  stepNumber: 9,
  frIndex: 4,
  story: step9Story,
  celebration: step9Celebration,
  learnPhase: step9LearnPhase,
  practicePhase: {
    frText: 'FR-5: Global access with low latency',
    taskDescription: 'Add monitoring for global system health',
    componentsNeeded: [
      { type: 'monitoring', reason: 'Track system health across regions', displayName: 'Monitoring' },
    ],
    connectionsNeeded: [
      { from: 'App Server', to: 'Monitoring', reason: 'Collect metrics from servers' },
    ],
    successCriteria: ['Add Monitoring component', 'Connect App Server → Monitoring'],
  },
  validation: {
    requiredComponents: ['client', 'dns', 'load_balancer', 'app_server', 'database', 'message_queue', 'cache', 'worker', 'monitoring'],
    requiredConnections: [
      { fromType: 'client', toType: 'dns' },
      { fromType: 'dns', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'message_queue', toType: 'worker' },
      { fromType: 'app_server', toType: 'monitoring' },
    ],
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'We need visibility into our global system',
    level2: 'Add Monitoring and connect it to App Servers',
    solutionComponents: [{ type: 'monitoring' }],
    solutionConnections: [{ from: 'app_server', to: 'monitoring' }],
  },
};

// =============================================================================
// STEP 10: Regional Failover
// =============================================================================

const step10Story: StoryContent = {
  emoji: '🚨',
  scenario: "Breaking news: A major cloud provider outage has taken down the entire US region!",
  hook: "Users in the US can't access their documents. We need automatic failover.",
  challenge: "Configure automatic failover so users are routed to healthy regions during outages.",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Automatic Regional Failover',
  conceptExplanation: 'Maintaining availability during regional outages by routing users to healthy regions.',
  keyConcepts: [
    {
      title: 'Health Checks',
      explanation: 'DNS continuously checks each region\'s health and removes unhealthy ones.',
      icon: '❤️',
    },
    {
      title: 'Failover Routing',
      explanation: 'When a region fails, DNS automatically routes users to the next nearest healthy region.',
      icon: '🔄',
    },
    {
      title: 'Failback',
      explanation: 'When the region recovers, gradually shift traffic back.',
      icon: '↩️',
    },
  ],
  whyItMatters: "Active-active with automatic failover provides 99.99% availability.",
  keyPoints: ["Health checks trigger failover.", "Automatic routing ensures high availability."],
  diagram: `
    US Region ❌ (down)
         ↓
    DNS Health Check detects failure
         ↓
    US users → EU Region ✅ (failover)
  `,
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "Congratulations! You've built a globally distributed collaborative document editor!",
  achievement: "Congratulations! You've built a globally distributed collaborative document editor!",
  metrics: [
    { label: 'Availability', after: '99.99%' },
    { label: 'Regions', after: '3 (US, EU, APAC)' },
    { label: 'Failover Time', after: '< 60 seconds' },
    { label: 'Collaborators', after: 'Millions globally' },
    { label: 'Conflict Resolution', after: 'Automatic (CRDTs)' },
  ],
  nextTeaser: "You've mastered active-active multi-region architecture!",
};

const step10: GuidedStep = {
  id: 'active-active-step-10',
  stepNumber: 10,
  frIndex: 4,
  story: step10Story,
  celebration: step10Celebration,
  learnPhase: step10LearnPhase,
  practicePhase: {
    frText: 'FR-5: Global access with low latency',
    taskDescription: 'Configure automatic regional failover',
    componentsNeeded: [],
    connectionsNeeded: [
      { from: 'Monitoring', to: 'DNS', reason: 'Health checks trigger DNS updates' },
    ],
    successCriteria: ['Connect Monitoring → DNS for health-based routing'],
  },
  validation: {
    requiredComponents: ['client', 'dns', 'load_balancer', 'app_server', 'database', 'message_queue', 'cache', 'worker', 'monitoring'],
    requiredConnections: [
      { fromType: 'client', toType: 'dns' },
      { fromType: 'dns', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'message_queue', toType: 'worker' },
      { fromType: 'app_server', toType: 'monitoring' },
      { fromType: 'monitoring', toType: 'dns' },
    ],
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'Health checks need to update DNS routing',
    level2: 'Connect Monitoring → DNS for automatic failover',
    solutionComponents: [],
    solutionConnections: [{ from: 'monitoring', to: 'dns' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const activeActiveRegionsGuidedTutorial: GuidedTutorial = {
  problemId: 'active-active-regions',
  problemTitle: 'Collaborative Document Editor',
  title: 'Collaborative Document Editor',
  description: 'Build a Google Docs-like collaborative editor with multi-region active-active architecture, real-time sync, and CRDT-based conflict resolution',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '📝',
    hook: "You're building the next generation collaborative document editor - like Google Docs!",
    scenario: "Users around the world need to edit documents together in real-time. When someone in Tokyo and someone in London edit the same paragraph simultaneously, both edits must be preserved.",
    challenge: "Can you design an active-active architecture that handles concurrent edits, resolves conflicts, and delivers low latency worldwide?",
  },

  requirementsPhase: activeActiveRequirementsPhase,

  totalSteps: 10,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  concepts: [
    'Client-Server Architecture',
    'Real-Time Collaboration',
    'WebSockets',
    'CRDTs (Conflict-Free Replicated Data Types)',
    'Operational Transformation',
    'Multi-Region Replication',
    'DNS-Based Geo-Routing',
    'Load Balancing',
    'Caching Strategies',
    'Automatic Failover',
    'Eventual Consistency',
  ],

  ddiaReferences: [
    'Chapter 5: Replication (Multi-Leader)',
    'Chapter 8: The Trouble with Distributed Systems',
    'Chapter 9: Consistency and Consensus',
  ],
};

export default activeActiveRegionsGuidedTutorial;
