import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';
import { TestCase } from '../../types/testCase';

/**
 * Comprehensive Search Platform Guided Tutorial - FR-FIRST EDITION
 *
 * An advanced story-driven tutorial teaching modern search infrastructure concepts
 * while building a production-grade search platform like Elasticsearch/Algolia.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working search (FR satisfaction)
 * Steps 4-12: Advanced features (indexing, ranking, relevance, facets, autocomplete, personalization)
 *
 * Key Concepts:
 * - Full-text search and inverted indexes
 * - Ranking algorithms (TF-IDF, BM25)
 * - Relevance tuning and boosting
 * - Faceted search and aggregations
 * - Autocomplete with prefix matching
 * - Personalized search with user context
 * - Search analytics and query understanding
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const searchPlatformRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a comprehensive search platform like Elasticsearch or Algolia",

  interviewer: {
    name: 'Dr. Sarah Chen',
    role: 'Principal Search Engineer',
    avatar: '👩‍💼',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    {
      id: 'core-search',
      category: 'functional',
      question: "What's the core search experience users expect?",
      answer: "Users need to:\n1. **Search across documents** - Find relevant content from millions of documents using keywords\n2. **Get ranked results** - See the most relevant results first\n3. **Filter results** - Narrow down by category, date, price, etc. (faceted search)\n4. **See instant suggestions** - Get autocomplete as they type",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Search is about discovery - users must find what they need quickly and accurately",
    },
    {
      id: 'document-types',
      category: 'functional',
      question: "What types of documents are we indexing?",
      answer: "We're building a general-purpose search platform that can index:\n- **Product catalogs** (e-commerce)\n- **Articles and blogs** (content platforms)\n- **User profiles** (social networks)\n- **Code repositories** (developer tools)\n\nEach document has title, body, metadata (tags, category, timestamp), and custom fields.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Search platforms need flexible schema to handle diverse document types",
    },
    {
      id: 'search-quality',
      category: 'functional',
      question: "How do we determine which results are most relevant?",
      answer: "Relevance scoring must consider:\n1. **Text matching** - How well query matches document (TF-IDF, BM25)\n2. **Field boosting** - Matches in title worth more than body\n3. **Popularity signals** - Click-through rate, user engagement\n4. **Recency** - Newer content ranked higher (time decay)\n5. **Personalization** - User's search history and preferences",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Ranking is the heart of search - bad ranking = unhappy users",
    },
    {
      id: 'faceted-search',
      category: 'functional',
      question: "What filters can users apply to search results?",
      answer: "Users should be able to filter by:\n- **Category** (Electronics, Books, Clothing)\n- **Price range** ($0-$50, $50-$100)\n- **Date range** (Last week, Last month)\n- **Custom attributes** (Brand, Color, Size for e-commerce)\n\nFacets should show counts (e.g., 'Electronics (42)').",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Facets help users navigate and refine large result sets",
    },
    {
      id: 'autocomplete',
      category: 'functional',
      question: "How should autocomplete work?",
      answer: "As users type 'wire', show:\n1. **Query suggestions** - 'wireless headphones', 'wireless mouse'\n2. **Popular searches** - Based on what others searched\n3. **Personalized** - Based on user's past searches\n4. **Fast** - Suggestions appear in < 50ms as they type\n\nLimit to top 10 suggestions.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Autocomplete reduces friction and guides users to better queries",
    },
    {
      id: 'typo-tolerance',
      category: 'clarification',
      question: "Should search handle typos and misspellings?",
      answer: "Yes! Essential for good UX:\n- **Fuzzy matching** - 'ipone' → 'iphone' (edit distance 1-2)\n- **Phonetic matching** - 'fone' → 'phone'\n- **Query suggestions** - 'Did you mean: iphone?'\n\nUse Levenshtein distance for fuzzy matching.",
      importance: 'important',
      insight: "Users make typos 10-15% of the time - fuzzy search is critical",
    },
    {
      id: 'multi-language',
      category: 'clarification',
      question: "Do we need to support multiple languages?",
      answer: "For MVP, focus on English with proper stemming and tokenization. Multi-language support (Spanish, French, Chinese) can be v2.\n\nEach language needs custom analyzers for stemming (running → run).",
      importance: 'nice-to-have',
      insight: "Language support adds complexity - good to defer for MVP",
    },
    {
      id: 'search-analytics',
      category: 'clarification',
      question: "Should we track search analytics?",
      answer: "Yes, critical for improving search quality:\n- **Query volume** - Most searched terms\n- **Zero-result queries** - Searches that return nothing\n- **Click-through rate** - Which results users click\n- **Conversion rate** - Searches that lead to actions\n\nStore analytics in separate database, not search index.",
      importance: 'important',
      insight: "Analytics drive continuous search improvement",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs (Interview Discovery Order)
    // =============================================================================

    // 1. THROUGHPUT (First - tells you the scale)
    {
      id: 'throughput-queries',
      category: 'throughput',
      question: "How many search queries per day?",
      answer: "1 billion search queries per day",
      importance: 'critical',
      calculation: {
        formula: "1B ÷ 86,400 sec = 11,574 queries/sec average",
        result: "~11,500 qps (queries per second) average, 50K at peak",
      },
      learningPoint: "This tells you the read load on the search cluster",
    },
    {
      id: 'throughput-documents',
      category: 'throughput',
      question: "How many documents in the index?",
      answer: "100 million documents initially, growing 10M/month",
      importance: 'critical',
      learningPoint: "Index size affects storage, memory, and indexing strategy",
    },
    {
      id: 'throughput-writes',
      category: 'throughput',
      question: "How many new documents indexed per day?",
      answer: "About 10 million new documents per day (updates + inserts)",
      importance: 'critical',
      calculation: {
        formula: "10M ÷ 86,400 sec = 115 writes/sec average",
        result: "~115 writes/sec (350 at peak for bulk indexing)",
      },
      learningPoint: "Write load determines indexing throughput needed",
    },

    // 2. PAYLOAD (Second - affects bandwidth and storage)
    {
      id: 'payload-document-size',
      category: 'payload',
      question: "What's the average document size?",
      answer: "Average 5KB per document (title, body, metadata). Some documents up to 1MB.",
      importance: 'important',
      calculation: {
        formula: "100M docs × 5KB = 500GB raw data",
        result: "~500GB corpus size (before indexing overhead)",
      },
      learningPoint: "Index size is typically 2-3x raw data (inverted index overhead)",
    },
    {
      id: 'payload-query-size',
      category: 'payload',
      question: "How complex are search queries?",
      answer: "Most queries are 2-5 words. Some advanced queries use boolean operators (AND, OR, NOT) and filters. Query size < 1KB.",
      importance: 'important',
      learningPoint: "Simple queries are common, but need to support complex boolean queries",
    },

    // 3. BURSTS (Third - capacity planning)
    {
      id: 'burst-peak',
      category: 'burst',
      question: "What's the peak-to-average query ratio?",
      answer: "Peak traffic is 4-5x average during business hours",
      importance: 'critical',
      calculation: {
        formula: "11,574 avg × 5 = 57,870 peak",
        result: "~58K queries/sec at peak",
      },
      insight: "You MUST design for peak, not average. Search is user-facing - can't be slow.",
    },
    {
      id: 'burst-indexing',
      category: 'burst',
      question: "Are there bulk indexing operations?",
      answer: "Yes, clients bulk-index documents in batches of 1,000-10,000. This can spike to 1,000+ writes/sec temporarily.",
      importance: 'important',
      insight: "Need separate indexing pipeline to avoid impacting search latency",
    },

    // 4. LATENCY (Fourth - response time requirements)
    {
      id: 'latency-search',
      category: 'latency',
      question: "What's the acceptable search latency?",
      answer: "p99 < 100ms for simple queries, p99 < 200ms for complex queries with facets. Users expect instant results.",
      importance: 'critical',
      learningPoint: "Search is request/response - users are waiting. Sub-100ms is critical for UX.",
    },
    {
      id: 'latency-autocomplete',
      category: 'latency',
      question: "What about autocomplete latency?",
      answer: "p99 < 50ms. Autocomplete needs to be faster than search - it triggers on every keystroke.",
      importance: 'critical',
      learningPoint: "Autocomplete is even more latency-sensitive than search",
    },
    {
      id: 'latency-indexing',
      category: 'latency',
      question: "How quickly must new documents appear in search?",
      answer: "Near real-time indexing: new documents should be searchable within 1 second (p95). Batch indexing can take longer (up to 1 minute).",
      importance: 'important',
      learningPoint: "This is data processing latency - documents flow through indexing pipeline",
    },

    // 5. AVAILABILITY
    {
      id: 'availability-sla',
      category: 'availability',
      question: "What's the availability SLA?",
      answer: "99.9% uptime (< 44 minutes downtime per month). Search is critical path - if search is down, users can't find anything.",
      importance: 'critical',
      insight: "Need replication and failover for high availability",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-search', 'search-quality', 'throughput-queries', 'latency-search'],
  criticalFRQuestionIds: ['core-search', 'search-quality', 'faceted-search'],
  criticalScaleQuestionIds: ['throughput-queries', 'burst-peak', 'latency-search', 'availability-sla'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Full-text search across documents',
      description: 'Users can search millions of documents using keywords and get relevant results',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Ranked results by relevance',
      description: 'Results are ranked by relevance using scoring algorithms (TF-IDF, BM25) with field boosting',
      emoji: '📊',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Faceted search with filters',
      description: 'Users can filter results by category, price, date, and custom attributes',
      emoji: '🎛️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Autocomplete suggestions',
      description: 'As users type, show instant query suggestions (< 50ms)',
      emoji: '⚡',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million',
    writesPerDay: '10 million documents',
    readsPerDay: '1 billion queries',
    peakMultiplier: 5,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 115, peak: 350 },
    calculatedReadRPS: { average: 11574, peak: 57870 },
    maxPayloadSize: '~1KB query, ~5KB document',
    storagePerRecord: '~15KB (5KB raw + 10KB index overhead)',
    storageGrowthPerYear: '~1.8TB/year',
    redirectLatencySLA: 'p99 < 100ms (search)',
    createLatencySLA: 'p95 < 1s (indexing)',
  },

  architecturalImplications: [
    '✅ Read-heavy (100:1) → Optimize for query performance',
    '✅ 58K qps peak → Need distributed search cluster with sharding',
    '✅ p99 < 100ms → In-memory inverted index is essential',
    '✅ 100M documents → Partition index across multiple shards',
    '✅ 99.9% availability → Need replication (primary + replicas)',
    '✅ Near real-time indexing → Separate indexing pipeline from search',
  ],

  outOfScope: [
    'Multi-language support (v2)',
    'Image/video search',
    'Semantic search (embeddings)',
    'Machine learning ranking (v2)',
    'Distributed tracing',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple search system that can index documents and return results. The advanced ranking, facets, and personalization features will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Search Service
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔍',
  scenario: "Welcome to SearchTech Inc! You've been hired to build the next Elasticsearch.",
  hook: "A customer is ready to search. They've opened your search page and typed a query!",
  challenge: "Set up the basic request flow so users can send search queries to your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your search service is online!',
  achievement: 'Users can now send search queries to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting queries', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to search yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Search Architecture',
  conceptExplanation: `Every search platform starts with a **Client** connecting to a **Search Service**.

When a user searches on Google or Amazon:
1. Their browser (Client) sends a search query
2. The **Search Service** (your app server) receives the query
3. The service processes the query and returns ranked results

This is the foundation of ALL search systems!`,

  whyItMatters: 'Without this connection, users can\'t search at all.',

  realWorldExample: {
    company: 'Elasticsearch',
    scenario: 'Handling millions of queries per second globally',
    howTheyDoIt: 'Started as a simple wrapper around Apache Lucene in 2010, now powers search for Netflix, GitHub, Uber, and thousands of companies',
  },

  keyPoints: [
    'Client = the user\'s device (browser, mobile app)',
    'Search Service = your backend that processes queries',
    'HTTP = the protocol for sending queries and getting results',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device that sends search queries', icon: '📱' },
    { title: 'Search Service', explanation: 'Your backend that handles search logic', icon: '🔍' },
    { title: 'Query', explanation: 'The search text user enters (e.g., "wireless headphones")', icon: '💬' },
  ],
};

const step1: GuidedStep = {
  id: 'search-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all search FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users searching', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles search queries', displayName: 'Search Service' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'App Server component added to canvas',
      'Client connected to App Server',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server from the component palette onto the canvas',
    level2: 'Click the Client, then click the App Server to create a connection between them',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Search API with Python
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to search!",
  hook: "A user tried to search for 'laptop' but got an error. The server has no search logic!",
  challenge: "Write the Python code to handle search queries with basic text matching.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Your search works!',
  achievement: 'Users can now search for documents',
  metrics: [
    { label: 'API implemented', after: 'GET /api/v1/search' },
    { label: 'Can search', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all indexed documents are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Search API Implementation: Basic Text Matching',
  conceptExplanation: `Every search API needs a **handler function** that:
1. Receives the search query
2. Matches query against documents
3. Returns ranked results

For our Search Service, we need:
- \`search(query, filters)\` - Find matching documents and rank them

For now, we'll store documents in memory (Python list/dict) and use simple text matching (substring search). Real search engines use inverted indexes - we'll add that later!

**API Design:**
- **GET /api/v1/search?q=laptop&category=electronics**
- Returns: List of matching documents with scores`,

  whyItMatters: 'This is where search happens. Without search logic, your service is useless!',

  famousIncident: {
    title: 'Google Search Launch',
    company: 'Google',
    year: '1998',
    whatHappened: 'Larry Page and Sergey Brin built a search engine at Stanford that ranked results by PageRank (link popularity) instead of just keyword matching. It was so much better than AltaVista and Yahoo that it took over the internet.',
    lessonLearned: 'Good ranking is the secret sauce of search. Keyword matching is just the start - ranking separates great search from mediocre search.',
    icon: '🚀',
  },

  realWorldExample: {
    company: 'Elasticsearch',
    scenario: 'Processing millions of queries per second',
    howTheyDoIt: 'Uses Apache Lucene for inverted indexes. Each query is parsed, tokenized, and matched against the inverted index in milliseconds.',
  },

  keyPoints: [
    'Search handler receives query and filters',
    'For now, use simple substring matching (will upgrade to inverted index later)',
    'Return results sorted by relevance (even simple relevance)',
    'Support filters (category, date range, etc.)',
  ],

  quickCheck: {
    question: 'Why do we start with simple substring matching instead of a full inverted index?',
    options: [
      'Substring matching is faster',
      'FR-First approach: Make it WORK first, optimize later',
      'Inverted indexes are too expensive',
      'Substring matching is more accurate',
    ],
    correctIndex: 1,
    explanation: 'FR-First approach means we build the simplest thing that works, then optimize. Substring matching satisfies FR-1, then we\'ll add inverted indexes for performance.',
  },

  keyConcepts: [
    { title: 'Query Handler', explanation: 'Function that processes search queries', icon: '⚙️' },
    { title: 'Substring Matching', explanation: 'Simple text matching (contains)', icon: '🔤' },
    { title: 'Relevance', explanation: 'How well a document matches the query', icon: '📊' },
  ],
};

const step2: GuidedStep = {
  id: 'search-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Full-text search (basic implementation)',
    taskDescription: 'Configure Search API and implement Python handler for basic search',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/search API',
      'Open the Python tab',
      'Implement search() function with basic text matching',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign GET /api/v1/search',
    level2: 'After assigning the API, switch to the Python tab and implement the search() function with substring matching',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Search Index (Database) for Document Storage
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 3 AM. Your server crashed and restarted...",
  hook: "When it came back online, ALL the indexed documents were GONE! Users can't find anything!",
  challenge: "Add a database to store documents persistently so they survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your documents are safe forever!',
  achievement: 'Documents now persist across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But searching through 100 million documents is SLOW...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Document Storage: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Documents survive crashes
- **Structure**: Organized tables/collections
- **Queries**: Efficient data retrieval
- **Scalability**: Handle millions of documents

For Search, we need to store:
- **Documents table** - id, title, body, metadata, timestamp
- **Inverted Index** - Token → List of document IDs (we'll add this later)

Right now, we'll use the database to store documents. In the next steps, we'll build the inverted index for fast search.`,

  whyItMatters: 'Imagine losing ALL your indexed documents because of a server restart. Users would never trust your platform again!',

  famousIncident: {
    title: 'Stack Overflow Outage',
    company: 'Stack Overflow',
    year: '2019',
    whatHappened: 'Stack Overflow\'s Elasticsearch cluster crashed and couldn\'t recover. Search was down for hours. They had to rebuild the entire index from their PostgreSQL database.',
    lessonLearned: 'Always have a source of truth (database) for your documents. Elasticsearch is great for search but shouldn\'t be your only copy of the data.',
    icon: '🗄️',
  },

  realWorldExample: {
    company: 'Elasticsearch',
    scenario: 'Storing billions of documents',
    howTheyDoIt: 'Uses a combination of in-memory structures for speed and disk-based storage (Lucene segments) for durability. Data is stored in shards across multiple nodes.',
  },

  keyPoints: [
    'Database provides durability - documents survive crashes',
    'Store raw documents in database (source of truth)',
    'Search index (inverted index) is derived from documents',
    'Can always rebuild search index from database if needed',
  ],

  quickCheck: {
    question: 'What happens to in-memory documents when a server restarts?',
    options: [
      'They\'re automatically saved to disk',
      'They\'re backed up to the cloud',
      'They\'re completely lost',
      'They\'re restored from cache',
    ],
    correctIndex: 2,
    explanation: 'In-memory (RAM) data is volatile. When power is lost or the process restarts, all data in memory is gone.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'Source of Truth', explanation: 'Database is the authoritative copy', icon: '📚' },
    { title: 'Persistence', explanation: 'Data is saved to disk', icon: '💾' },
  ],
};

const step3: GuidedStep = {
  id: 'search-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1: Documents must persist durably',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store documents permanently', displayName: 'Document Store (PostgreSQL)' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'App Server connected to Database',
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
    level1: 'Drag a Database component onto the canvas',
    level2: 'Click App Server, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Search Index (Inverted Index) for Fast Lookups
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 10 million documents, and searches are taking 30+ seconds!",
  hook: "Users are complaining: 'Why is search so SLOW?' Every search scans ALL documents. This doesn't scale!",
  challenge: "Build an inverted index to make searches lightning fast (< 100ms).",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Search is now 1000x faster!',
  achievement: 'Inverted index enables instant lookups',
  metrics: [
    { label: 'Search latency', before: '30000ms', after: '50ms' },
    { label: 'Index size', after: '10M documents' },
  ],
  nextTeaser: "But results aren't ranked by relevance - random order!",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Inverted Index: The Heart of Search',
  conceptExplanation: `**The Problem**: Scanning all documents is too slow!
- 10M documents × 50ms per doc = 500,000 seconds = **5.7 days per query!**

**The Solution**: **Inverted Index**

Instead of:
\`\`\`
Documents: [
  {id: 1, body: "wireless headphones"},
  {id: 2, body: "bluetooth headphones"},
  {id: 3, body: "wireless mouse"}
]
→ Search "wireless" → Scan all 3 docs → SLOW
\`\`\`

Build an inverted index:
\`\`\`
Inverted Index:
  "wireless" → [1, 3]
  "bluetooth" → [2]
  "headphones" → [1, 2]
  "mouse" → [3]

→ Search "wireless" → Lookup index → Return [1, 3] → INSTANT!
\`\`\`

**How it works:**
1. **Indexing phase**: For each document, extract words (tokens) and build: token → list of doc IDs
2. **Search phase**: For query "wireless headphones", lookup "wireless" → [1, 3], "headphones" → [1, 2], intersect → [1]`,

  whyItMatters: 'Without inverted indexes, search doesn\'t scale. This is why Google can search billions of pages in milliseconds.',

  famousIncident: {
    title: 'How Google Won Search',
    company: 'Google',
    year: '1998-2000',
    whatHappened: 'AltaVista and Yahoo used simple keyword matching. Google built a massive inverted index + PageRank. Google was 10x faster and more accurate, and dominated the market within 2 years.',
    lessonLearned: 'Inverted indexes are non-negotiable for search. They\'re the difference between 30 seconds and 30 milliseconds.',
    icon: '🚀',
  },

  realWorldExample: {
    company: 'Elasticsearch',
    scenario: 'Searching billions of documents in milliseconds',
    howTheyDoIt: 'Uses Apache Lucene\'s inverted index. Each shard has its own inverted index in memory. Queries are distributed across shards and results merged.',
  },

  diagram: `
┌─────────────────────────────────────────────────────┐
│              INVERTED INDEX                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Indexing Phase:                                    │
│  ─────────────────                                  │
│  Doc 1: "wireless headphones" →                     │
│    Extract: ["wireless", "headphones"]              │
│    Add to index:                                    │
│      wireless → [1]                                 │
│      headphones → [1]                               │
│                                                     │
│  Doc 2: "bluetooth headphones" →                    │
│    Extract: ["bluetooth", "headphones"]             │
│    Add to index:                                    │
│      bluetooth → [2]                                │
│      headphones → [1, 2]                            │
│                                                     │
│  Search Phase:                                      │
│  ─────────────                                      │
│  Query: "wireless headphones"                       │
│    Lookup "wireless" → [1]                          │
│    Lookup "headphones" → [1, 2]                     │
│    Intersect → [1]                                  │
│    Return Doc 1                                     │
│                                                     │
└─────────────────────────────────────────────────────┘`,

  keyPoints: [
    'Inverted index maps tokens to document IDs',
    'Searching is now a lookup (O(1)) instead of scan (O(N))',
    'Index is built during document ingestion (indexing phase)',
    'Queries are fast - just lookup + merge results',
    'Trade-off: Index takes memory/storage (2-3x document size)',
  ],

  quickCheck: {
    question: 'Why is an inverted index called "inverted"?',
    options: [
      'It stores data backwards',
      'It inverts the mapping: instead of doc→words, it\'s word→docs',
      'It works in reverse order',
      'It was invented by someone named Invert',
    ],
    correctIndex: 1,
    explanation: 'Normal index is document → words. Inverted index flips this to word → documents, which enables fast lookup.',
  },

  keyConcepts: [
    { title: 'Token', explanation: 'A word extracted from text (e.g., "wireless")', icon: '🔤' },
    { title: 'Posting List', explanation: 'List of document IDs for a token', icon: '📋' },
    { title: 'Tokenization', explanation: 'Splitting text into words/tokens', icon: '✂️' },
  ],
};

const step4: GuidedStep = {
  id: 'search-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Fast full-text search with inverted index',
    taskDescription: 'Add a Cache to store the inverted index in memory',
    componentsNeeded: [
      { type: 'cache', reason: 'Store inverted index in memory for fast lookups', displayName: 'Search Index (Redis/Memory)' },
    ],
    successCriteria: [
      'Cache component added (represents in-memory inverted index)',
      'App Server connected to Cache',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add a Cache component to represent the in-memory inverted index',
    level2: 'Connect App Server to Cache. The cache will store token → document ID mappings.',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Implement Ranking Algorithm (TF-IDF / BM25)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🎲',
  scenario: "Users are getting search results, but they're in random order!",
  hook: "A user searched 'wireless headphones' and got a document about 'wireless routers' as the top result!",
  challenge: "Implement a ranking algorithm to score and sort results by relevance.",
  illustration: 'random-results',
};

const step5Celebration: CelebrationContent = {
  emoji: '📊',
  message: 'Results are now ranked by relevance!',
  achievement: 'BM25 scoring puts the best results first',
  metrics: [
    { label: 'Ranking algorithm', after: 'BM25' },
    { label: 'User satisfaction', before: '40%', after: '85%' },
  ],
  nextTeaser: "But users want to filter results by category and price...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Relevance Ranking: TF-IDF and BM25',
  conceptExplanation: `**The Problem**: All matching documents aren't equally relevant!

Query: "wireless headphones"
- Doc A: Title: "Wireless Headphones", Body: "Best wireless headphones for music" → VERY relevant
- Doc B: Title: "Wireless Router", Body: "...mentions headphones once..." → NOT very relevant

**How to rank?** Use **scoring algorithms**:

**1. TF-IDF (Term Frequency - Inverse Document Frequency)**
- **TF**: How many times does the term appear in the document?
- **IDF**: How rare is the term across all documents?
- Score = TF × IDF
- Common words ("the", "is") have low IDF → low score
- Rare words ("bluetooth", "wireless") have high IDF → high score

**2. BM25 (Best Match 25)** - Industry standard
- Improved version of TF-IDF
- Handles term saturation (10 occurrences ≈ 20 occurrences)
- Considers document length normalization
- Used by Elasticsearch, Solr, most search engines

**Scoring Example:**
\`\`\`
Query: "wireless headphones"

Doc A:
  "wireless" appears 3 times, "headphones" appears 5 times
  → BM25 score = 15.8

Doc B:
  "wireless" appears 1 time, "headphones" appears 0 times
  → BM25 score = 2.3

Sort by score: Doc A ranks higher!
\`\`\``,

  whyItMatters: 'Ranking is the MOST important part of search. Bad ranking = users can\'t find what they need.',

  famousIncident: {
    title: 'Google PageRank Revolution',
    company: 'Google',
    year: '1998',
    whatHappened: 'Before Google, search engines ranked by keyword frequency. Spammers stuffed keywords to rank high. Google\'s PageRank used link popularity - revolutionized search quality.',
    lessonLearned: 'Ranking algorithms are the secret sauce. TF-IDF is the baseline, but you need more signals (popularity, freshness, personalization) for great search.',
    icon: '🏆',
  },

  realWorldExample: {
    company: 'Elasticsearch',
    scenario: 'Ranking billions of search results',
    howTheyDoIt: 'Uses BM25 by default. Allows custom scoring with field boosting (title 3x more important than body), function scores (recency decay), and script scoring.',
  },

  diagram: `
┌─────────────────────────────────────────────────────┐
│              BM25 SCORING                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Query: "wireless headphones"                       │
│                                                     │
│  Doc 1: Title: "Wireless Headphones"                │
│         Body: "Best wireless headphones..."         │
│         BM25 Score:                                 │
│           - "wireless" in title: +5.2               │
│           - "headphones" in title: +6.1             │
│           - "wireless" in body: +2.3                │
│           - "headphones" in body: +2.8              │
│         TOTAL: 16.4                                 │
│                                                     │
│  Doc 2: Title: "Wireless Router"                    │
│         Body: "...for your headphones"              │
│         BM25 Score:                                 │
│           - "wireless" in title: +5.2               │
│           - "headphones" in body: +0.9              │
│         TOTAL: 6.1                                  │
│                                                     │
│  Ranked Results: [Doc 1 (16.4), Doc 2 (6.1)]       │
│                                                     │
└─────────────────────────────────────────────────────┘`,

  keyPoints: [
    'BM25 is the industry-standard ranking algorithm',
    'Considers term frequency, document frequency, and document length',
    'Field boosting: title matches score higher than body matches',
    'Can combine BM25 with other signals (popularity, freshness)',
    'Ranking is more important than indexing for user satisfaction',
  ],

  quickCheck: {
    question: 'Why is BM25 better than simple term frequency?',
    options: [
      'It\'s faster to compute',
      'It handles term saturation and document length normalization',
      'It uses less memory',
      'It\'s easier to understand',
    ],
    correctIndex: 1,
    explanation: 'BM25 improves on TF-IDF by preventing over-counting repeated terms (saturation) and normalizing for document length. This produces better rankings.',
  },

  keyConcepts: [
    { title: 'TF-IDF', explanation: 'Term Frequency × Inverse Document Frequency', icon: '📊' },
    { title: 'BM25', explanation: 'Best Match 25 - improved TF-IDF with saturation', icon: '🏆' },
    { title: 'Field Boosting', explanation: 'Title matches count more than body matches', icon: '⬆️' },
  ],
};

const step5: GuidedStep = {
  id: 'search-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: Ranked results by relevance',
    taskDescription: 'Implement BM25 ranking in the Search Service (Python code)',
    successCriteria: [
      'Update Python search() function to calculate BM25 scores',
      'Sort results by score (highest first)',
      'Return ranked results',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Update the search() function in Python to calculate BM25 scores for matching documents',
    level2: 'For each matching document, calculate BM25 score based on term frequency and document frequency. Sort by score descending.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Load Balancer for Distributed Search
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your single search server is maxed out at 100% CPU!",
  hook: "Traffic spiked to 50K queries per second. One server can't handle it all - users are getting timeouts!",
  challenge: "Add a load balancer to distribute search queries across multiple servers.",
  illustration: 'server-overload',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'Search traffic is now distributed!',
  achievement: 'Load balancer spreads queries across servers',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Query distribution', after: 'Balanced' },
  ],
  nextTeaser: "But we still only have one server instance...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing for Search: Horizontal Scaling',
  conceptExplanation: `A **Load Balancer** sits in front of your search servers and distributes incoming queries.

Benefits:
- **No single point of failure** - if one server dies, others keep working
- **Horizontal scaling** - add more servers to handle more queries
- **Even distribution** - no single server gets overwhelmed

For search, load balancing is crucial because:
- Queries are stateless (any server can handle any query)
- Search is read-heavy (no writes to coordinate)
- Can scale search independently from indexing

Common strategies:
- **Round-robin**: Take turns (simple, fair)
- **Least connections**: Send to least busy server
- **IP hash**: Same user → same server (cache affinity)`,

  whyItMatters: 'At peak, you need to handle 50K+ queries/second. No single server can do that alone.',

  famousIncident: {
    title: 'Amazon Search Outage',
    company: 'Amazon',
    year: '2013',
    whatHappened: 'Amazon\'s search service went down for 40 minutes during Prime Day. Lost estimated $5 million in sales. Root cause: single search cluster couldn\'t handle the load.',
    lessonLearned: 'Always plan for 10x your expected peak traffic. Load balancers and auto-scaling are essential.',
    icon: '💸',
  },

  realWorldExample: {
    company: 'Elasticsearch',
    scenario: 'Handling millions of queries per second',
    howTheyDoIt: 'Uses coordinating nodes (load balancers) that distribute queries across data nodes. Each query is sent to relevant shards in parallel, results merged.',
  },

  keyPoints: [
    'Load balancer distributes queries across search servers',
    'Enables horizontal scaling (add more servers)',
    'Eliminates single point of failure',
    'Place between Client and Search Service',
  ],

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes queries across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Stateless', explanation: 'Any server can handle any query', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'search-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add a Load Balancer between Client and Search Service',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute search queries across servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Load Balancer onto the canvas between Client and App Server',
    level2: 'Reconnect: Client → Load Balancer → App Server',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 7: Scale Search Service (Multiple Instances)
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📈',
  scenario: "Traffic has grown 10x. One search server can't keep up!",
  hook: "Users are getting timeouts. Your load balancer has nowhere to route queries. Need more servers!",
  challenge: "Scale horizontally by adding more search server instances.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'You can now handle 50K+ queries per second!',
  achievement: 'Multiple search servers share the load',
  metrics: [
    { label: 'Server instances', before: '1', after: '5+' },
    { label: 'Capacity', before: '10K qps', after: '50K+ qps' },
  ],
  nextTeaser: "But users want to filter results by category...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: More Search Servers',
  conceptExplanation: `**Horizontal scaling** means adding more servers instead of upgrading one.

For search, this is perfect because:
- **Queries are stateless** - any server can handle any query
- **Each server has full index** - no coordination needed
- **Linear scaling** - 2x servers = 2x query capacity

Search is different from databases:
- Database writes need coordination (ACID)
- Search is read-only (queries don't modify data)
- Can replicate index to all servers without conflicts

Architecture:
- Each search server has a full copy of the inverted index
- Load balancer distributes queries
- All servers share the same document database`,

  whyItMatters: 'Search is read-heavy and stateless - perfect for horizontal scaling. Add as many servers as you need!',

  realWorldExample: {
    company: 'Elasticsearch',
    scenario: 'Scaling to handle millions of queries per second',
    howTheyDoIt: 'Runs hundreds of replica shards across dozens of nodes. Each shard is a full copy that can serve queries independently. Query capacity scales linearly with replicas.',
  },

  keyPoints: [
    'Add more search server instances to handle more queries',
    'Each server has a copy of the inverted index',
    'Load balancer distributes queries evenly',
    'Linear scaling: 2x servers = 2x query capacity',
  ],

  keyConcepts: [
    { title: 'Replica', explanation: 'A copy of the search index', icon: '📋' },
    { title: 'Stateless Queries', explanation: 'Queries don\'t change data', icon: '🔄' },
    { title: 'Linear Scaling', explanation: 'Capacity grows proportionally with servers', icon: '📈' },
  ],
};

const step7: GuidedStep = {
  id: 'search-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from more query capacity',
    taskDescription: 'Scale the Search Service to multiple instances',
    successCriteria: [
      'Click on the App Server component',
      'Go to Configuration tab',
      'Set instances to 5 or more',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Click on the App Server and increase the instance count to 5 or more',
    level2: 'Set instances to 5+. The load balancer will distribute queries across all instances.',
    solutionComponents: [{ type: 'app_server', config: { instances: 5 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Implement Faceted Search (Aggregations)
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🎛️',
  scenario: "Users love your search, but they're drowning in results!",
  hook: "A search for 'laptop' returns 50,000 results. Users want to filter by brand, price, and rating!",
  challenge: "Implement faceted search with aggregations to help users narrow down results.",
  illustration: 'too-many-results',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Users can now filter results!',
  achievement: 'Faceted search makes finding the right result easy',
  metrics: [
    { label: 'Facets implemented', after: 'Category, Price, Rating' },
    { label: 'User conversion', before: '15%', after: '35%' },
  ],
  nextTeaser: "But autocomplete is still missing...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Faceted Search: Aggregations for Filtering',
  conceptExplanation: `**Faceted Search** lets users filter results by categories, attributes, and ranges.

Example: Search "laptop" → 50,000 results

Facets shown:
- **Brand**: Dell (12,000), HP (8,500), Lenovo (7,200), ...
- **Price**: $0-$500 (15,000), $500-$1000 (20,000), $1000+ (15,000)
- **Rating**: 4+ stars (30,000), 3+ stars (45,000)

User clicks "Dell" → Now showing 12,000 laptops, update facets:
- **Price**: $0-$500 (3,000), $500-$1000 (6,000), $1000+ (3,000)

**How it works:**
1. **Aggregation**: Count documents in each bucket (category, price range)
2. **Filtering**: Apply selected facets to narrow results
3. **Real-time updates**: Recalculate facet counts for current results

**Implementation:**
- Store facet fields in inverted index (category, price, brand)
- During search, aggregate on facet fields
- Support multi-select facets (brand=Dell OR brand=HP)`,

  whyItMatters: 'Facets turn overwhelming result sets into manageable, filterable lists. Essential for e-commerce and large catalogs.',

  famousIncident: {
    title: 'Amazon Faceted Search Success',
    company: 'Amazon',
    year: '2005',
    whatHappened: 'Amazon added faceted search (filters by brand, price, reviews). Conversion rate increased 25%. Now standard in all e-commerce.',
    lessonLearned: 'Facets dramatically improve user experience by helping users navigate large result sets.',
    icon: '🛍️',
  },

  realWorldExample: {
    company: 'Elasticsearch',
    scenario: 'Powering e-commerce faceted search',
    howTheyDoIt: 'Uses aggregations (buckets) to count documents. Supports terms aggregation (category), range aggregation (price), nested aggregation (complex filters).',
  },

  diagram: `
┌─────────────────────────────────────────────────────┐
│              FACETED SEARCH                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Query: "laptop"                                    │
│  Results: 50,000 documents                          │
│                                                     │
│  Facets (Aggregations):                             │
│  ┌─────────────────────────────────────────┐       │
│  │ Brand                                   │       │
│  │  ☐ Dell (12,000)                        │       │
│  │  ☐ HP (8,500)                           │       │
│  │  ☐ Lenovo (7,200)                       │       │
│  │                                         │       │
│  │ Price                                   │       │
│  │  ☐ $0-$500 (15,000)                     │       │
│  │  ☐ $500-$1000 (20,000)                  │       │
│  │  ☐ $1000+ (15,000)                      │       │
│  │                                         │       │
│  │ Rating                                  │       │
│  │  ☐ 4+ stars (30,000)                    │       │
│  │  ☐ 3+ stars (45,000)                    │       │
│  └─────────────────────────────────────────┘       │
│                                                     │
│  User selects: Brand=Dell, Price=$500-$1000        │
│  → Results: 6,000 documents                         │
│  → Recalculate facets for filtered results         │
│                                                     │
└─────────────────────────────────────────────────────┘`,

  keyPoints: [
    'Facets show counts for each category/attribute',
    'Use aggregations to count documents in buckets',
    'Support multi-select (OR within facet, AND across facets)',
    'Update facet counts when filters are applied',
    'Store facet fields in inverted index for fast aggregation',
  ],

  quickCheck: {
    question: 'Why do we need to recalculate facet counts after applying a filter?',
    options: [
      'To save memory',
      'To show accurate counts for the current filtered result set',
      'To make queries faster',
      'To reduce database load',
    ],
    correctIndex: 1,
    explanation: 'When a user filters by Brand=Dell, the facet counts must reflect the filtered results. Price facets should show counts for Dell laptops only, not all laptops.',
  },

  keyConcepts: [
    { title: 'Facet', explanation: 'A filterable attribute (brand, price, category)', icon: '🏷️' },
    { title: 'Aggregation', explanation: 'Counting documents in buckets', icon: '🗂️' },
    { title: 'Bucket', explanation: 'A group of documents (e.g., all Dell laptops)', icon: '🪣' },
  ],
};

const step8: GuidedStep = {
  id: 'search-step-8',
  stepNumber: 8,
  frIndex: 2,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-3: Faceted search with filters',
    taskDescription: 'Implement faceted search with aggregations (Python code)',
    successCriteria: [
      'Update search() function to calculate aggregations',
      'Support filtering by facets',
      'Return facet counts with results',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireMultipleAppInstances: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Update the search() function to calculate aggregations (counts) for facet fields',
    level2: 'For each facet field (category, brand, price_range), count matching documents in each bucket. Return facets alongside results.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 9: Implement Autocomplete with Prefix Matching
// =============================================================================

const step9Story: StoryContent = {
  emoji: '⚡',
  scenario: "Users are typing slow queries character by character.",
  hook: "A user typed 'wire' and waited... then 'wirel'... still waiting. Autocomplete would help them search faster!",
  challenge: "Implement autocomplete with prefix matching to suggest queries as users type.",
  illustration: 'typing-slowly',
};

const step9Celebration: CelebrationContent = {
  emoji: '✨',
  message: 'Autocomplete is working!',
  achievement: 'Users get instant suggestions as they type',
  metrics: [
    { label: 'Autocomplete latency', after: '< 50ms' },
    { label: 'Search speed', before: '15s avg', after: '8s avg' },
  ],
  nextTeaser: "But everyone gets the same suggestions - no personalization...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Autocomplete: Prefix Matching & Tries',
  conceptExplanation: `**Autocomplete** shows suggestions as users type: "wire" → "wireless headphones", "wireless mouse"

**How it works:**
1. **Prefix matching**: Find all queries/terms starting with user's input
2. **Ranking**: Sort by popularity (most searched queries first)
3. **Fast**: Must respond in < 50ms (users are typing)

**Data Structures:**
- **Trie (Prefix Tree)**: Efficient prefix matching
  \`\`\`
  Root
    w
      i
        r
          e (suggestions: wireless, wired)
            l (suggestions: wireless)
            d (suggestions: wired)
  \`\`\`
- Each node stores suggestions for that prefix
- Lookup is O(length of prefix)

**Alternative: Inverted Index with Edge N-grams**
- Store prefixes of terms: "wireless" → "w", "wi", "wir", "wire", "wirel", "wirele", ...
- Query "wire" → matches all terms with prefix "wire"
- Simpler to implement than Trie, but uses more storage

**Autocomplete Sources:**
1. **Popular queries**: What other users searched
2. **Product names**: Actual products in catalog
3. **Personalized**: User's past searches`,

  whyItMatters: 'Autocomplete reduces typing, guides users to better queries, and speeds up search by 50%.',

  realWorldExample: {
    company: 'Google',
    scenario: 'Autocomplete suggestions for billions of searches',
    howTheyDoIt: 'Uses a distributed Trie with popularity scores. Suggestions are pre-computed and cached. Personalized based on user location and search history.',
  },

  diagram: `
┌─────────────────────────────────────────────────────┐
│              AUTOCOMPLETE TRIE                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  User types: "wire"                                 │
│                                                     │
│  Trie Lookup:                                       │
│  Root → w → i → r → e                              │
│                                                     │
│  Suggestions at node "e":                           │
│  1. wireless headphones (popularity: 10,000)        │
│  2. wireless mouse (popularity: 8,500)              │
│  3. wired keyboard (popularity: 3,200)              │
│  4. wireless router (popularity: 2,800)             │
│                                                     │
│  Return top 5 suggestions sorted by popularity      │
│                                                     │
│  User types "l" → now "wirel"                       │
│  → Update suggestions:                              │
│  1. wireless headphones (popularity: 10,000)        │
│  2. wireless mouse (popularity: 8,500)              │
│  3. wireless router (popularity: 2,800)             │
│                                                     │
└─────────────────────────────────────────────────────┘`,

  keyPoints: [
    'Use Trie or edge n-grams for prefix matching',
    'Rank suggestions by popularity',
    'Must be fast (< 50ms) - users are typing',
    'Cache popular prefixes in memory',
    'Combine multiple sources (queries, products, personalized)',
  ],

  quickCheck: {
    question: 'Why is autocomplete more latency-sensitive than search?',
    options: [
      'It uses more resources',
      'It triggers on every keystroke, so users notice any delay',
      'It\'s harder to implement',
      'It returns more results',
    ],
    correctIndex: 1,
    explanation: 'Autocomplete runs on every keystroke. If it takes 100ms, typing "wireless" (8 chars) = 800ms of perceived lag. Must be < 50ms to feel instant.',
  },

  keyConcepts: [
    { title: 'Trie', explanation: 'Prefix tree for efficient prefix matching', icon: '🌲' },
    { title: 'Prefix Matching', explanation: 'Find all strings starting with input', icon: '🔤' },
    { title: 'Edge N-grams', explanation: 'Store all prefixes of a term', icon: '✂️' },
  ],
};

const step9: GuidedStep = {
  id: 'search-step-9',
  stepNumber: 9,
  frIndex: 3,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-4: Autocomplete suggestions',
    taskDescription: 'Implement autocomplete with prefix matching (Python code)',
    successCriteria: [
      'Add new API endpoint: GET /api/v1/autocomplete?prefix=wire',
      'Implement autocomplete() function with prefix matching',
      'Return top 10 suggestions sorted by popularity',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireMultipleAppInstances: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Add a new autocomplete() function that finds all queries/terms starting with the prefix',
    level2: 'Use the inverted index or build a Trie. Return top 10 suggestions sorted by popularity (search count).',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 10: Add Personalized Search with User Context
// =============================================================================

const step10Story: StoryContent = {
  emoji: '🎯',
  scenario: "Two users search for 'apple' - one gets computers, one gets fruit!",
  hook: "Your search is generic. Everyone gets the same results regardless of their interests and history.",
  challenge: "Add personalized search that considers user context and preferences.",
  illustration: 'same-results',
};

const step10Celebration: CelebrationContent = {
  emoji: '🌟',
  message: 'Search is now personalized!',
  achievement: 'Users get results tailored to their interests',
  metrics: [
    { label: 'Click-through rate', before: '15%', after: '28%' },
    { label: 'User satisfaction', before: '70%', after: '88%' },
  ],
  nextTeaser: "But we need to track search quality...",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Personalized Search: User Context & History',
  conceptExplanation: `**Personalized Search** tailors results to each user based on:
1. **Search history**: What they searched before
2. **Click history**: What results they clicked
3. **Purchase/behavior history**: What they bought/viewed
4. **User preferences**: Explicit settings (language, location, interests)

**How it works:**
1. **User profile**: Store user's interests, preferences, search history
2. **Scoring boost**: Boost documents matching user's profile
   - User searched "iPhone" 10 times → boost Apple products
   - User is in USA → boost USD prices, English content
   - User clicked laptops → boost computer category
3. **Re-ranking**: Combine base BM25 score + personalization score

**Personalization Signals:**
\`\`\`
Base Score (BM25): 15.8
+ User preference (electronics): +2.0
+ User location (USA): +1.5
+ User search history (laptops): +3.2
= Final Score: 22.5
\`\`\`

**Privacy Considerations:**
- Store user data securely
- Allow users to opt out
- Don't over-personalize (filter bubble)`,

  whyItMatters: 'Personalization can double click-through rate. Users find what they want faster.',

  famousIncident: {
    title: 'Google Personalized Search Launch',
    company: 'Google',
    year: '2005',
    whatHappened: 'Google launched personalized search based on search history. Click-through rate increased 20%. Now every major search engine personalizes results.',
    lessonLearned: 'Personalization is expected by users - but balance personalization with diversity to avoid filter bubbles.',
    icon: '🎯',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Personalizing product search',
    howTheyDoIt: 'Uses machine learning models that combine user history, collaborative filtering, and content-based signals. Each user sees different results for the same query.',
  },

  keyPoints: [
    'Store user profile (interests, history, preferences)',
    'Boost scores for documents matching user profile',
    'Combine base BM25 score + personalization signals',
    'Balance personalization with diversity',
    'Privacy: let users control their data',
  ],

  quickCheck: {
    question: 'Why is personalization important for search quality?',
    options: [
      'It makes search faster',
      'It reduces server load',
      'Users have different intents - same query should return different results',
      'It uses less memory',
    ],
    correctIndex: 2,
    explanation: 'Query "apple" could mean fruit, computers, or the city. User context (history, behavior) helps disambiguate intent and show relevant results.',
  },

  keyConcepts: [
    { title: 'User Profile', explanation: 'Stored interests, history, preferences', icon: '👤' },
    { title: 'Re-ranking', explanation: 'Adjust scores based on personalization', icon: '🔄' },
    { title: 'Filter Bubble', explanation: 'Over-personalization limits diversity', icon: '🫧' },
  ],
};

const step10: GuidedStep = {
  id: 'search-step-10',
  stepNumber: 10,
  frIndex: 1,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'FR-2: Personalized ranking based on user context',
    taskDescription: 'Add personalization to search ranking',
    successCriteria: [
      'Store user profile in database (interests, search history)',
      'Update search() to apply personalization boosts',
      'Combine BM25 + personalization scores',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireMultipleAppInstances: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Add user_id to search queries. Fetch user profile from database.',
    level2: 'Apply personalization boosts to BM25 scores based on user profile (interests, history). Re-rank results.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 11: Add Search Analytics Pipeline
// =============================================================================

const step11Story: StoryContent = {
  emoji: '📊',
  scenario: "You're flying blind! No idea what users are searching for or which results they click.",
  hook: "How do you improve search quality without knowing what's working and what's not?",
  challenge: "Add search analytics to track queries, results, and user behavior.",
  illustration: 'no-data',
};

const step11Celebration: CelebrationContent = {
  emoji: '📈',
  message: 'Search analytics is live!',
  achievement: 'You can now measure and improve search quality',
  metrics: [
    { label: 'Analytics pipeline', after: 'Enabled' },
    { label: 'Metrics tracked', after: 'Queries, CTR, Zero Results' },
  ],
  nextTeaser: "But our infrastructure is getting expensive...",
};

const step11LearnPhase: TeachingContent = {
  conceptTitle: 'Search Analytics: Measuring Quality',
  conceptExplanation: `**Search Analytics** tracks:
1. **Query volume**: Most searched terms
2. **Zero-result queries**: Searches that return nothing (bad!)
3. **Click-through rate (CTR)**: % of searches that lead to clicks
4. **Position CTR**: Which results get clicked (position 1 vs 10)
5. **Conversion rate**: Searches that lead to purchases/actions

**Why it matters:**
- **Find quality issues**: Zero-result queries = missing content or bad indexing
- **Improve ranking**: Low CTR for top results = bad ranking
- **Content strategy**: Popular queries = what users want

**Architecture:**
\`\`\`
User searches → Log query + results → Analytics pipeline
User clicks result → Log click event
→ Aggregate metrics daily
→ Dashboard for search quality
\`\`\`

**Implementation:**
- Use message queue for async logging (don't slow down search)
- Store analytics in separate database (not search index)
- Calculate metrics daily (batch processing)`,

  whyItMatters: 'You can\'t improve what you don\'t measure. Analytics drives continuous search improvement.',

  realWorldExample: {
    company: 'Etsy',
    scenario: 'Improving search quality with analytics',
    howTheyDoIt: 'Tracks every search and click. Found that 25% of searches had zero results. Used this data to improve fuzzy matching and synonyms. Zero-result rate dropped to 10%.',
  },

  keyPoints: [
    'Log every query and click asynchronously',
    'Track zero-result queries (high priority to fix)',
    'Measure CTR by position (position 1 should have highest CTR)',
    'Use analytics to drive ranking improvements',
    'Store analytics in separate database',
  ],

  keyConcepts: [
    { title: 'CTR', explanation: 'Click-through rate: % searches with clicks', icon: '👆' },
    { title: 'Zero Results', explanation: 'Queries that return no results', icon: '❌' },
    { title: 'Analytics Pipeline', explanation: 'Async logging and aggregation', icon: '🔄' },
  ],
};

const step11: GuidedStep = {
  id: 'search-step-11',
  stepNumber: 11,
  frIndex: 0,

  story: step11Story,
  learnPhase: step11LearnPhase,

  practicePhase: {
    frText: 'Search quality measurement',
    taskDescription: 'Add Message Queue for analytics logging',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Log search queries and clicks asynchronously', displayName: 'Analytics Queue' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
      'Log queries and clicks to queue',
    ],
  },

  celebration: step11Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Add a Message Queue for async analytics logging',
    level2: 'Connect App Server to Message Queue. Log query events (query, results count) and click events (query, clicked result) to the queue.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 12: Cost Optimization & Final Architecture
// =============================================================================

const step12Story: StoryContent = {
  emoji: '💰',
  scenario: "Finance is alarmed! Your monthly cloud bill is $500K.",
  hook: "The CFO says: 'Optimize costs by 30% or we're cutting features.'",
  challenge: "Optimize your search platform architecture to stay under budget while handling peak traffic.",
  illustration: 'budget-crisis',
};

const step12Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a production search platform!',
  achievement: 'A scalable, cost-effective search engine with all advanced features',
  metrics: [
    { label: 'Monthly cost', before: '$500K', after: 'Under budget' },
    { label: 'Search latency', after: 'p99 < 100ms' },
    { label: 'Query capacity', after: '50K+ qps' },
    { label: 'Features', after: 'Ranking, Facets, Autocomplete, Personalization, Analytics' },
  ],
  nextTeaser: "You've mastered search platform design!",
};

const step12LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `Search platforms are expensive because:
- **In-memory indexes**: Large RAM requirements
- **Replication**: Multiple copies of index for availability
- **High QPS**: Need many servers to handle queries

**Cost Optimization Strategies:**
1. **Right-size replicas**: 3 replicas for HA is often enough (not 10)
2. **Shard data**: Partition index across nodes instead of full replication
3. **Use tiered storage**: Hot data in memory, warm data on SSD, cold data archived
4. **Auto-scale**: Scale up for peak, down at night
5. **Cache popular queries**: Reduce index hits by caching results
6. **Optimize index size**: Reduce stored fields, use compression

**Sharding vs Replication:**
- **Replication**: Full copy on each server (high cost, high availability)
- **Sharding**: Partition data across servers (lower cost, requires coordination)
- Hybrid: Shard + replicate (each shard has 2-3 replicas)`,

  whyItMatters: 'Search is one of the most expensive services to run. Cost optimization is critical for profitability.',

  realWorldExample: {
    company: 'Elasticsearch',
    scenario: 'Reducing costs at scale',
    howTheyDoIt: 'Uses tiered storage (hot-warm-cold), compression, and index lifecycle management. Moves old data to cheaper storage automatically.',
  },

  keyPoints: [
    'Use sharding + replication (not just replication)',
    'Auto-scale based on query load',
    'Cache popular queries to reduce index load',
    'Right-size instances and replicas',
    'Use tiered storage for old data',
  ],

  keyConcepts: [
    { title: 'Sharding', explanation: 'Partition data across nodes', icon: '🗂️' },
    { title: 'Replication', explanation: 'Copy data for availability', icon: '📋' },
    { title: 'Tiered Storage', explanation: 'Hot (memory), warm (SSD), cold (disk)', icon: '🗄️' },
  ],
};

const step12: GuidedStep = {
  id: 'search-step-12',
  stepNumber: 12,
  frIndex: 0,

  story: step12Story,
  learnPhase: step12LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $5000/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $5000/month',
      'Maintain all performance requirements',
      'Enable database replication for HA',
      'Configure cache strategy for optimal hit rate',
    ],
  },

  celebration: step12Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component for over-provisioning. Enable replication, set cache strategy.',
    level2: 'Keep at least 5 app servers, enable database replication (2+ replicas), configure cache strategy (cache-aside), stay under $5000/month.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const comprehensiveSearchPlatformGuidedTutorial: GuidedTutorial = {
  problemId: 'comprehensive-search-platform',
  title: 'Build a Comprehensive Search Platform',
  description: 'Design a production-grade search engine with indexing, ranking, facets, autocomplete, and personalization',
  difficulty: 'advanced',
  estimatedMinutes: 90,

  welcomeStory: {
    emoji: '🔍',
    hook: "You've been hired as Lead Search Engineer at SearchTech Inc!",
    scenario: "Your mission: Build a comprehensive search platform like Elasticsearch that can handle billions of queries per day with advanced features like relevance ranking, faceted search, autocomplete, and personalization.",
    challenge: "Can you design a system that delivers sub-100ms search latency while maintaining 99.9% availability?",
  },

  requirementsPhase: searchPlatformRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10, step11, step12],

  finalExamTestCases: [
    {
      name: 'Basic Search',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Users can search documents and get ranked results.',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01, maxP99Latency: 150 },
    },
    {
      name: 'High Query Load',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 50K queries per second with low latency.',
      traffic: { type: 'read', rps: 50000, readRps: 50000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.05 },
    },
    {
      name: 'Faceted Search',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Support filtering with facets and aggregations.',
      traffic: { type: 'mixed', rps: 1000, readRps: 1000 },
      duration: 30,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.01 },
    },
    {
      name: 'Autocomplete Performance',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Autocomplete suggestions in under 50ms.',
      traffic: { type: 'read', rps: 5000, readRps: 5000 },
      duration: 30,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.01 },
    },
    {
      name: 'Cost Guardrail',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Stay under $5000/month budget while handling production traffic.',
      traffic: { type: 'read', rps: 10000, readRps: 10000 },
      duration: 60,
      passCriteria: { maxMonthlyCost: 5000, maxErrorRate: 0.05 },
    },
  ] as TestCase[],

  concepts: [
    'Full-text search',
    'Inverted indexes',
    'Ranking algorithms (TF-IDF, BM25)',
    'Relevance scoring',
    'Field boosting',
    'Faceted search',
    'Aggregations',
    'Autocomplete',
    'Prefix matching',
    'Tries',
    'Personalized search',
    'User context',
    'Search analytics',
    'Load balancing',
    'Horizontal scaling',
    'Cost optimization',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (Indexes)',
    'Chapter 5: Replication',
    'Chapter 6: Partitioning (Sharding)',
    'Chapter 11: Stream Processing (Analytics)',
  ],
};

export default comprehensiveSearchPlatformGuidedTutorial;
