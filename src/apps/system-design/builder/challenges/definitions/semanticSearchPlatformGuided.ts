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
 * Semantic Search Platform Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching semantic search and vector databases
 * while building a modern search platform like Pinecone or Weaviate.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview - embedding models, vector storage, hybrid search)
 * Steps 1-3: Build basic semantic search with embeddings
 * Steps 4-6: Add vector databases, ANN indexes, re-ranking
 *
 * Key Concepts:
 * - Semantic search with embeddings
 * - Vector databases (Pinecone, Weaviate)
 * - ANN (Approximate Nearest Neighbor) algorithms
 * - Hybrid search (semantic + keyword)
 * - Re-ranking and query understanding
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const semanticSearchRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a semantic search platform for finding similar documents based on meaning, not just keywords",

  interviewer: {
    name: 'Dr. Sarah Kim',
    role: 'ML Infrastructure Lead',
    avatar: '👩‍🔬',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-semantic-search',
      category: 'functional',
      question: "What's the core functionality users need?",
      answer: "Users need **semantic search** - finding documents by meaning, not just keywords:\n\n1. **Search by meaning** - Query 'CEO' finds 'Chief Executive Officer'\n2. **Similarity search** - 'Find similar documents to this one'\n3. **Multi-modal** - Search text, images, or both\n\nUnlike keyword search (Elasticsearch), semantic search understands context and meaning.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Semantic search uses ML embeddings to understand meaning, enabling 'fuzzy' conceptual matching",
    },
    {
      id: 'embedding-models',
      category: 'functional',
      question: "How do we convert text/images into searchable format?",
      answer: "We use **embedding models** to convert documents into vectors:\n\n1. **Text embeddings** - Convert text to 768-dim vectors (BERT, OpenAI)\n2. **Image embeddings** - Convert images to vectors (CLIP, ResNet)\n3. **Same vector space** - Similar items have similar vectors\n\nExample: 'dog' and 'puppy' have very close vectors even though the words are different.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Embeddings are the foundation - they capture semantic meaning as numbers",
    },
    {
      id: 'vector-similarity',
      category: 'functional',
      question: "How do we find similar documents?",
      answer: "We compute **vector similarity** using distance metrics:\n\n1. **Cosine similarity** - Angle between vectors (most common)\n2. **Euclidean distance** - Straight-line distance\n3. **Dot product** - Fast but requires normalized vectors\n\nSmaller distance = more similar documents. This is the core of semantic search.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Vector similarity is how we measure 'meaning similarity' mathematically",
    },
    {
      id: 'vector-storage',
      category: 'functional',
      question: "How do we store and query millions of vectors efficiently?",
      answer: "We need a **vector database** with ANN (Approximate Nearest Neighbor) indexing:\n\n1. **Vector DB** - Pinecone, Weaviate, Milvus, Qdrant\n2. **ANN algorithms** - HNSW, IVF, LSH for fast similarity search\n3. **Hybrid storage** - Vectors + metadata (filters)\n\nBrute force search is O(n) - too slow for millions of vectors. ANN reduces to O(log n).",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Vector databases are specialized for high-dimensional similarity search at scale",
    },
    {
      id: 'hybrid-search',
      category: 'functional',
      question: "Should we support keyword search too, or only semantic?",
      answer: "**Hybrid search** combining both is best:\n\n1. **Semantic search** - Understanding meaning ('CEO' matches 'executive')\n2. **Keyword search** - Exact matches (product IDs, names)\n3. **Fusion ranking** - Combine both result sets\n\nSemantic search isn't always better - sometimes exact keywords matter!",
      importance: 'important',
      revealsRequirement: 'FR-3',
      learningPoint: "Hybrid search gives best of both worlds - meaning + precision",
    },
    {
      id: 're-ranking',
      category: 'functional',
      question: "How do we improve result quality beyond just vector similarity?",
      answer: "Use **re-ranking** models to refine results:\n\n1. **First stage** - Fast ANN search gets top 100 candidates\n2. **Re-ranking stage** - Expensive cross-encoder scores top 100\n3. **Final results** - Return top 10 best matches\n\nThis two-stage approach balances speed and quality.",
      importance: 'important',
      revealsRequirement: 'FR-3',
      insight: "Re-ranking is expensive but improves relevance - only run on top candidates",
    },
    {
      id: 'filters',
      category: 'clarification',
      question: "Can users filter by metadata like date, category, author?",
      answer: "Yes! **Metadata filtering** is essential:\n1. Filter before search (pre-filter)\n2. Filter after search (post-filter)\n\nExample: 'Find similar docs in category=tech from last 30 days'",
      importance: 'important',
      insight: "Metadata filters narrow search space before expensive vector similarity",
    },
    {
      id: 'query-understanding',
      category: 'clarification',
      question: "Should we analyze/improve user queries before searching?",
      answer: "Yes, **query understanding** helps:\n1. Spell correction\n2. Query expansion (synonyms)\n3. Entity extraction\n\nBut defer to v2 - start with raw query embedding.",
      importance: 'nice-to-have',
      insight: "Query preprocessing improves results but adds complexity",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // THROUGHPUT
    {
      id: 'throughput-documents',
      category: 'throughput',
      question: "How many documents need to be searchable?",
      answer: "100 million documents with 768-dimensional vectors each",
      importance: 'critical',
      calculation: {
        formula: "100M docs × 768 dims × 4 bytes (float32) = 307GB vectors",
        result: "~300GB of vector data alone",
      },
      learningPoint: "Vector storage is HUGE - need efficient indexing and compression",
    },
    {
      id: 'throughput-queries',
      category: 'throughput',
      question: "How many search queries per second?",
      answer: "10,000 queries per second average, 30,000 at peak",
      importance: 'critical',
      learningPoint: "High query volume requires distributed vector search with sharding",
    },
    {
      id: 'throughput-indexing',
      category: 'throughput',
      question: "How often are new documents added or updated?",
      answer: "1,000 new documents per second, plus 5,000 updates/sec",
      importance: 'critical',
      learningPoint: "Real-time indexing while serving queries - need separate write path",
    },

    // LATENCY
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should semantic search return results?",
      answer: "p99 under 200ms for semantic search, p99 under 100ms for hybrid search",
      importance: 'critical',
      learningPoint: "ANN search trades accuracy for speed - crucial for sub-second latency",
    },
    {
      id: 'latency-embedding',
      category: 'latency',
      question: "How long does generating embeddings take?",
      answer: "Query embedding: 20-50ms (must be inline). Document embedding: can be async batch job.",
      importance: 'important',
      insight: "Query embeddings are in critical path - use fast models or cache",
    },

    // PAYLOAD
    {
      id: 'payload-vector-size',
      category: 'payload',
      question: "What's the dimensionality of embedding vectors?",
      answer: "768 dimensions (BERT-base) or 1536 dimensions (OpenAI ada-002). Each dimension is float32 (4 bytes).",
      importance: 'important',
      calculation: {
        formula: "768 dims × 4 bytes = 3KB per vector",
        result: "3KB per document vector",
      },
      learningPoint: "High-dimensional vectors are expensive to store and compare",
    },

    // BURSTS
    {
      id: 'burst-spikes',
      category: 'burst',
      question: "Are there traffic spikes we should handle?",
      answer: "Yes, 5x traffic spikes during product launches or viral content",
      importance: 'important',
      insight: "Auto-scaling with pre-warmed indices helps handle bursts",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-semantic-search', 'embedding-models', 'vector-similarity', 'vector-storage'],
  criticalFRQuestionIds: ['core-semantic-search', 'embedding-models', 'vector-similarity', 'vector-storage'],
  criticalScaleQuestionIds: ['throughput-documents', 'throughput-queries', 'latency-search'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Semantic search by meaning',
      description: 'Users can search documents using semantic similarity (meaning), not just keywords',
      emoji: '🧠',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Fast vector similarity search',
      description: 'Find k-nearest neighbors in millions of vectors with sub-200ms latency',
      emoji: '⚡',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Hybrid search with re-ranking',
      description: 'Combine semantic and keyword search, refine with re-ranking models',
      emoji: '🎯',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 million users',
    writesPerDay: '86 million new documents',
    readsPerDay: '864 million searches',
    peakMultiplier: 3,
    readWriteRatio: '10:1',
    calculatedWriteRPS: { average: 1000, peak: 3000 },
    calculatedReadRPS: { average: 10000, peak: 30000 },
    maxPayloadSize: '~3KB per vector',
    storagePerRecord: '~3KB per vector + metadata',
    storageGrowthPerYear: '~100TB vectors',
    redirectLatencySLA: 'p99 < 200ms (semantic search)',
    createLatencySLA: 'p99 < 50ms (query embedding)',
  },

  architecturalImplications: [
    '✅ 100M vectors → Vector database with HNSW/IVF indexing required',
    '✅ 30K QPS peak → Distributed vector DB with sharding across nodes',
    '✅ p99 < 200ms → ANN search (not brute force), GPU acceleration',
    '✅ Hybrid search → Separate keyword index + vector index + fusion',
    '✅ Re-ranking → Two-stage retrieval (fast ANN + expensive re-rank)',
    '✅ 300GB vectors → Index compression (PQ, SQ) to fit in memory',
  ],

  outOfScope: [
    'Query understanding (spell correction, expansion)',
    'Multi-modal search (text + image)',
    'Fine-tuning custom embedding models',
    'Search analytics and feedback loops',
    'A/B testing infrastructure',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system that converts text to embeddings and finds similar documents. The complexity of vector databases, ANN indexing, and hybrid search will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to VectorSearch Inc! You're building a semantic search platform.",
  hook: "Your first customer wants to search their knowledge base by meaning, not just keywords.",
  challenge: "Set up the basic request flow so search queries can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your search service is online!',
  achievement: 'Users can now send search requests to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting queries', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to do semantic search yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Semantic Search Architecture',
  conceptExplanation: `Every semantic search system starts with a **Client** connecting to a **Search Server**.

**Traditional keyword search** (like Google):
- User searches "apple" → finds docs containing word "apple"

**Semantic search** (what we're building):
- User searches "fruit" → finds docs about "apple", "orange", "banana"
- Understanding MEANING, not just matching words!

The magic happens through ML embeddings, but first we need the basic connection.`,

  whyItMatters: 'Without this connection, users can\'t search at all. This is the foundation for all semantic search magic.',

  keyPoints: [
    'Semantic search understands meaning using ML embeddings',
    'Unlike keyword search, finds conceptually similar docs',
    'Client sends query → Server embeds it → Finds similar vectors',
  ],

  diagram: `
┌─────────────┐         ┌─────────────────┐
│   Client    │ ──────▶ │   App Server    │
│  (Browser)  │ ◀────── │  (Search API)   │
└─────────────┘         └─────────────────┘

Query: "CEO responsibilities"
→ Finds: "Chief Executive duties", "executive leadership"
(Different words, same MEANING!)
`,

  keyConcepts: [
    {
      title: 'Semantic Search',
      explanation: 'Finding documents by meaning, not just keyword matching',
      icon: '🧠',
    },
    {
      title: 'Embeddings',
      explanation: 'Converting text into vectors that capture meaning',
      icon: '🔢',
    },
  ],

  quickCheck: {
    question: 'What makes semantic search different from keyword search?',
    options: [
      'It\'s faster',
      'It understands meaning, not just exact words',
      'It uses SQL databases',
      'It doesn\'t need servers',
    ],
    correctIndex: 1,
    explanation: 'Semantic search uses embeddings to understand meaning, finding "CEO" when you search "executive".',
  },
};

const step1: GuidedStep = {
  id: 'semantic-search-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Users can submit search requests',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes search requests', displayName: 'Search API Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Search API Server', reason: 'Users send search queries' },
    ],
    successCriteria: ['Add Client', 'Add App Server', 'Connect Client → App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'First add Client, then add App Server, then connect them',
    level2: 'Drag Client and App Server from the sidebar, then drag from Client to App Server to connect',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Embedding API (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🤖',
  scenario: "Your server is connected, but it doesn't understand 'meaning' yet!",
  hook: "A user searched 'CEO' but the system can't find documents about 'executives' or 'leadership'.",
  challenge: "Implement the embedding API to convert text into semantic vectors using a pre-trained model.",
  illustration: 'ml-model',
};

const step2Celebration: CelebrationContent = {
  emoji: '✨',
  message: 'Your system can now understand meaning!',
  achievement: 'Text queries are converted to semantic embeddings',
  metrics: [
    { label: 'Embedding API', after: '✓ Implemented' },
    { label: 'Vector dimensions', after: '768 (BERT)' },
  ],
  nextTeaser: "But where do we store these vectors for fast search?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Embeddings: Converting Text to Meaning',
  conceptExplanation: `**Embeddings** are the magic behind semantic search!

An embedding model converts text into a vector of numbers:
- "CEO" → [0.23, -0.45, 0.67, ..., 0.12] (768 numbers)
- "Chief Executive" → [0.24, -0.44, 0.68, ..., 0.11] (very similar!)
- "pizza" → [-0.89, 0.34, -0.12, ..., 0.56] (completely different)

**Popular embedding models:**
1. **BERT** - 768 dimensions, great for search
2. **OpenAI ada-002** - 1536 dims, state-of-the-art
3. **Sentence-BERT** - Optimized for similarity search
4. **CLIP** - Joint text+image embeddings

Similar meanings → Similar vectors → Close in vector space!`,

  whyItMatters: 'Without embeddings, we can only match exact keywords. Embeddings let us understand that "CEO" and "executive" mean similar things.',

  realWorldExample: {
    company: 'Google',
    scenario: 'Understanding search intent beyond keywords',
    howTheyDoIt: 'BERT embeddings power Google Search, understanding that "how to fix broken pipe" and "plumbing repair tutorial" are related.',
  },

  famousIncident: {
    title: 'OpenAI Embeddings Revolution',
    company: 'OpenAI',
    year: '2022',
    whatHappened: 'OpenAI released their ada-002 embedding model that dramatically improved semantic search quality. Suddenly, every company wanted to add "ChatGPT-style search" to their product.',
    lessonLearned: 'Better embeddings = better search. The model quality matters enormously.',
    icon: '🚀',
  },

  keyPoints: [
    'Embeddings convert text into vectors of numbers',
    'Similar meanings have similar vectors (close in space)',
    'Pre-trained models (BERT, OpenAI) work out of the box',
    'Each document and query gets embedded the same way',
  ],

  diagram: `
Text → Embedding Model → Vector
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"CEO"          →  BERT  →  [0.23, -0.45, 0.67, ...]
"Executive"    →  BERT  →  [0.24, -0.44, 0.68, ...]  ← Very close!
"Pizza"        →  BERT  →  [-0.89, 0.34, -0.12, ...] ← Far away!

Distance in vector space = Semantic similarity
`,

  keyConcepts: [
    { title: 'Vector', explanation: 'Array of numbers representing meaning', icon: '🔢' },
    { title: 'Dimensions', explanation: 'Number of values in vector (768 for BERT)', icon: '📊' },
    { title: 'BERT', explanation: 'Popular pre-trained embedding model', icon: '🤖' },
  ],

  quickCheck: {
    question: 'Why do similar meanings have similar vectors?',
    options: [
      'Because they use the same words',
      'The embedding model learned to group similar concepts together',
      'Vectors are randomly generated',
      'Similar words have same length',
    ],
    correctIndex: 1,
    explanation: 'Embedding models are trained on massive text data to learn that "CEO" and "executive" appear in similar contexts, so they get similar vectors.',
  },
};

const step2: GuidedStep = {
  id: 'semantic-search-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'System can convert text to semantic embeddings',
    taskDescription: 'Configure embedding API and implement Python handler to generate vectors',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'Client' },
      { type: 'app_server', reason: 'Configure APIs and write embedding code', displayName: 'Search API Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Search API Server', reason: 'Already connected in Step 1' },
    ],
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/embed API',
      'Open the Python tab and implement the embedding handler',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Click App Server to configure APIs, then switch to the Python tab to write your embedding handler',
    level2: 'After assigning the /embed API in the inspector, switch to the Python editor tab and implement the generate_embedding() function using a pre-trained model.',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add In-Memory Vector Storage (Basic Similarity Search)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🔍',
  scenario: "You can generate embeddings, but how do you search for similar ones?",
  hook: "You have 1000 document embeddings. A user queries 'CEO responsibilities' - which documents match?",
  challenge: "Add basic in-memory vector storage and implement cosine similarity search.",
  illustration: 'vector-search',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Basic semantic search works!',
  achievement: 'You can now find similar documents by meaning',
  metrics: [
    { label: 'Search method', after: 'Cosine similarity' },
    { label: 'Storage', after: 'In-memory vectors' },
    { label: 'Working on', after: '1K documents' },
  ],
  nextTeaser: "But this won't scale to millions of documents...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Vector Similarity: Measuring Semantic Distance',
  conceptExplanation: `**How do we find similar documents?** By measuring distance between vectors!

**Popular distance metrics:**

1. **Cosine Similarity** (Most common)
   - Measures angle between vectors
   - Range: -1 (opposite) to +1 (identical)
   - Ignores magnitude, focuses on direction
   - Best for: Text embeddings

2. **Euclidean Distance**
   - Straight-line distance in n-dimensional space
   - Range: 0 (identical) to ∞ (far)
   - Considers both magnitude and direction
   - Best for: Image embeddings

3. **Dot Product**
   - Simple multiplication of vectors
   - Fast but requires normalized vectors
   - Used in: Fast approximations

**Example:**
Query: "CEO responsibilities" → [0.8, 0.6]
Doc A: "Executive duties" → [0.75, 0.65] (cosine = 0.99 - very similar!)
Doc B: "Pizza recipe" → [-0.3, 0.1] (cosine = 0.12 - not similar)

For Step 3, we'll use **brute force search** - compare query to ALL documents.
This works for 1000 docs but not 1M!`,

  whyItMatters: 'Vector similarity is the mathematical foundation of semantic search. Understanding distance metrics is crucial.',

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Finding similar songs',
    howTheyDoIt: 'Uses cosine similarity on audio feature embeddings to find songs with similar "vibe".',
  },

  keyPoints: [
    'Cosine similarity measures angle, not distance',
    'Brute force: compare query to every document',
    'Works for small datasets (<10K documents)',
    'Need better algorithms for millions of vectors',
  ],

  diagram: `
Vector Similarity Search (Brute Force)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Query embedding: [0.8, 0.6, -0.2, ...]
              ↓
        Compare to ALL docs:
              ↓
Doc 1: [0.75, 0.65, -0.15, ...] → similarity: 0.99
Doc 2: [-0.3, 0.1, 0.8, ...]    → similarity: 0.12
Doc 3: [0.82, 0.58, -0.21, ...] → similarity: 0.98
...
Doc 1000: [0.1, -0.9, 0.3, ...] → similarity: 0.23
              ↓
        Sort by similarity
              ↓
    Return top 10 matches

O(n) complexity - scales linearly with docs
`,

  keyConcepts: [
    { title: 'Cosine Similarity', explanation: 'Measures angle between vectors (0 to 1)', icon: '📐' },
    { title: 'Brute Force', explanation: 'Compare to every vector (slow but exact)', icon: '🐌' },
    { title: 'k-NN', explanation: 'k-Nearest Neighbors - find closest k vectors', icon: '🎯' },
  ],

  quickCheck: {
    question: 'Why use cosine similarity instead of Euclidean distance for text?',
    options: [
      'It\'s faster to compute',
      'It focuses on direction (meaning) rather than magnitude (length)',
      'It works with fewer dimensions',
      'It\'s more accurate',
    ],
    correctIndex: 1,
    explanation: 'Cosine similarity measures the angle (direction/meaning), ignoring vector length. For text, direction captures meaning better than absolute distance.',
  },
};

const step3: GuidedStep = {
  id: 'semantic-search-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Basic semantic search with similarity matching',
    taskDescription: 'Re-use your architecture from Steps 1-2 and implement similarity search in Python',
    componentsNeeded: [
      { type: 'client', reason: 'Already added', displayName: 'Client' },
      { type: 'app_server', reason: 'Implement similarity search', displayName: 'Search API Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Search API Server', reason: 'Already connected' },
    ],
    successCriteria: [
      'Re-use Client → App Server from Steps 1-2',
      'Open Python tab on App Server',
      'Implement cosine_similarity() and search() functions',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Open the Python tab on your App Server and implement the similarity search functions',
    level2: 'Implement cosine_similarity(vec1, vec2) and search(query_embedding, document_embeddings, k=10) functions',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 4: Add Vector Database with ANN Index
// =============================================================================

const step4Story: StoryContent = {
  emoji: '💾',
  scenario: "You now have 10 million documents, and search takes 30+ seconds!",
  hook: "Brute force comparison of 10M vectors is impossibly slow. Users are abandoning searches!",
  challenge: "Add a vector database with HNSW (Hierarchical Navigable Small World) index for fast ANN search.",
  illustration: 'database-upgrade',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Search is now blazing fast!',
  achievement: 'ANN indexing reduces search from 30 seconds to 50 milliseconds',
  metrics: [
    { label: 'Search latency', before: '30,000ms', after: '50ms' },
    { label: 'Index type', after: 'HNSW' },
    { label: 'Accuracy', after: '95% (approximate)' },
  ],
  nextTeaser: "But what about users who want exact keyword matches too?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Vector Databases & ANN: From O(n) to O(log n)',
  conceptExplanation: `**The scalability crisis:**
- 1K docs: Brute force = 10ms ✓
- 10K docs: Brute force = 100ms ✓
- 100K docs: Brute force = 1 second ✗
- 1M docs: Brute force = 10 seconds ✗✗
- 10M docs: Brute force = 100 seconds ✗✗✗

**Solution: ANN (Approximate Nearest Neighbor)**
Trade 100% accuracy for 1000x speed:
- Find "good enough" matches (95%+ accuracy)
- Reduce from O(n) to O(log n)

**Popular ANN Algorithms:**

1. **HNSW (Hierarchical Navigable Small World)** ⭐
   - Multi-layer graph structure
   - Navigate from top (sparse) to bottom (dense) layers
   - Best accuracy/speed tradeoff
   - Used by: Pinecone, Weaviate, Qdrant

2. **IVF (Inverted File Index)**
   - Clusters vectors into partitions
   - Search only relevant clusters
   - Used by: Faiss, Milvus

3. **LSH (Locality Sensitive Hashing)**
   - Hash similar vectors to same buckets
   - Good for very high dimensions
   - Used by: Older systems

**Vector databases** combine:
- ANN algorithms (HNSW, IVF)
- Persistent storage
- Distributed architecture
- Metadata filtering

For 10M vectors, vector DB is essential!`,

  whyItMatters: 'Without ANN, search is too slow for production. Vector databases make semantic search practical at scale.',

  realWorldExample: {
    company: 'Pinecone',
    scenario: 'Managed vector database service',
    howTheyDoIt: 'Uses HNSW indexing on distributed infrastructure. Searches billions of vectors in <100ms.',
  },

  famousIncident: {
    title: 'Pinecone Raises $100M at $750M Valuation',
    company: 'Pinecone',
    year: '2023',
    whatHappened: 'The explosion of LLMs and semantic search created massive demand for vector databases. Pinecone became the infrastructure layer for AI applications.',
    lessonLearned: 'Vector databases are infrastructure-critical for AI. The market chose specialized solutions over general databases.',
    icon: '💰',
  },

  keyPoints: [
    'ANN trades ~5% accuracy for 1000x speed',
    'HNSW is the gold standard algorithm',
    'Vector DBs handle storage + indexing + distribution',
    'Popular options: Pinecone, Weaviate, Qdrant, Milvus',
  ],

  diagram: `
HNSW: Hierarchical Graph Navigation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Layer 2 (sparse):    A ─────── B
                      ╲       ╱
Layer 1:            C ─ D ─ E ─ F
                     ╲ │ │ │ ╱
Layer 0 (all docs): G─H─I─J─K─L─M─N
                    (10M vectors)

Query vector enters at Layer 2
→ Find nearest in sparse layer (3 nodes)
→ Drop to Layer 1 (dozens of nodes)
→ Drop to Layer 0 (hundreds of nodes)
→ Refine and return top k

Result: 50ms instead of 30 seconds!
`,

  keyConcepts: [
    { title: 'ANN', explanation: 'Approximate Nearest Neighbor - fast "good enough" search', icon: '🎯' },
    { title: 'HNSW', explanation: 'Graph-based algorithm with hierarchical layers', icon: '🕸️' },
    { title: 'Vector DB', explanation: 'Database optimized for vector storage and ANN search', icon: '🗄️' },
  ],

  quickCheck: {
    question: 'Why is HNSW faster than brute force search?',
    options: [
      'It uses better hardware',
      'It navigates a hierarchical graph, comparing ~log(n) vectors instead of all n',
      'It compresses vectors',
      'It only works on small datasets',
    ],
    correctIndex: 1,
    explanation: 'HNSW navigates a hierarchical graph structure, comparing only ~log(n) vectors instead of all n. This reduces 10M comparisons to ~hundreds!',
  },
};

const step4: GuidedStep = {
  id: 'semantic-search-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Fast search on millions of vectors with ANN indexing',
    taskDescription: 'Build Client → App Server → Vector Database',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes search requests', displayName: 'Search API Server' },
      { type: 'vector_db', reason: 'Stores vectors with HNSW index', displayName: 'Vector Database (Pinecone)' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Search API Server', reason: 'Users send queries' },
      { from: 'Search API Server', to: 'Vector Database (Pinecone)', reason: 'Server queries vectors with ANN' },
    ],
    successCriteria: [
      'Add Vector Database component',
      'Build Client → App Server → Vector DB architecture',
      'Click Vector DB → Configure HNSW index',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'vector_db'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'vector_db' },
    ],
    requireVectorIndex: true,
  },
  hints: {
    level1: 'Add a Vector Database and configure HNSW indexing',
    level2: 'Build Client → App Server → Vector DB, then click Vector DB → Configure HNSW index',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'vector_db' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'vector_db' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Hybrid Search (Semantic + Keyword)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔤',
  scenario: "Semantic search is great, but users searching for 'SKU-12345' get random results!",
  hook: "Some queries need exact keyword matching. Product IDs, error codes, names - semantic understanding doesn't help!",
  challenge: "Add keyword search (Elasticsearch) alongside vector search for hybrid search.",
  illustration: 'hybrid-search',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Best of both worlds!',
  achievement: 'Hybrid search combines semantic understanding with keyword precision',
  metrics: [
    { label: 'Search modes', after: 'Semantic + Keyword' },
    { label: 'Fusion ranking', after: 'RRF (Reciprocal Rank Fusion)' },
    { label: 'Result quality', after: '+40% improvement' },
  ],
  nextTeaser: "But how do we refine the top results for maximum relevance?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Hybrid Search: Semantic + Keyword = Best Results',
  conceptExplanation: `**The problem:** Pure semantic search fails on exact matches.

**When semantic search fails:**
- Product SKUs: "SKU-12345" → embeddings can't capture this
- Error codes: "404 Not Found" → numeric codes are meaningless to embeddings
- Exact names: "iPhone 15 Pro Max" → need exact term match

**When keyword search fails:**
- Concepts: "improve productivity" → misses "boost efficiency", "increase output"
- Synonyms: "CEO" → misses "Chief Executive", "executive leadership"
- Paraphrasing: Different wordings of same question

**Solution: Hybrid Search**
Combine both approaches!

1. **Run in parallel:**
   - Vector search (semantic) → top 100 by cosine similarity
   - Elasticsearch (keyword) → top 100 by BM25 score

2. **Merge with RRF (Reciprocal Rank Fusion):**
   - RRF_score(doc) = Σ 1 / (k + rank_i)
   - k = 60 (constant)
   - Combines rankings from both systems
   - No training needed!

3. **Alternative: Weighted fusion**
   - 0.7 × semantic_score + 0.3 × keyword_score
   - Tune weights for your use case

**Best of both worlds:**
- Exact matches: Keyword search handles
- Conceptual queries: Semantic search handles
- Combined: Superior accuracy!`,

  whyItMatters: 'Pure semantic search misses exact matches. Pure keyword search misses meaning. Hybrid combines strengths for best accuracy.',

  realWorldExample: {
    company: 'Shopify',
    scenario: 'E-commerce product search',
    howTheyDoIt: 'Uses hybrid: semantic for "red dress", keyword for "SKU-XYZ-123". Fusion ranking merges results.',
  },

  keyPoints: [
    'Hybrid = Semantic (vectors) + Keyword (BM25)',
    'Run both in parallel, merge with RRF or weighted fusion',
    'RRF (Reciprocal Rank Fusion) is simple and effective',
    'Elasticsearch or OpenSearch for BM25 keyword search',
  ],

  diagram: `
Hybrid Search Architecture
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Query: "iPhone 15 error 404"
        ↓
    ┌───┴────┐
    │ Embed  │
    └───┬────┘
        │
    ┌───┴──────────────────┬────────────────┐
    ▼                      ▼                ▼
┌─────────────┐    ┌──────────────┐    ┌──────┐
│  Vector DB  │    │Elasticsearch │    │ RRF  │
│  (Semantic) │    │  (Keyword)   │    │Fusion│
└──────┬──────┘    └──────┬───────┘    └──┬───┘
       │                  │                │
    Results:          Results:             │
    - iPhone 14       - iPhone 15          │
    - iPhone 13       - Error 404          │
    - Apple phone     - 404 guide          │
       │                  │                │
       └──────────────────┴────────────────┘
                         ↓
              Merged & Re-ranked:
              1. iPhone 15 (both systems agree!)
              2. Error 404 (keyword found it)
              3. iPhone 14 (semantic similarity)
`,

  keyConcepts: [
    { title: 'Hybrid Search', explanation: 'Combining semantic and keyword search', icon: '🔀' },
    { title: 'BM25', explanation: 'Best Match 25 - statistical ranking function', icon: '🔤' },
    { title: 'RRF', explanation: 'Reciprocal Rank Fusion - simple rank merging', icon: '🔗' },
  ],

  quickCheck: {
    question: 'When would keyword search outperform semantic search?',
    options: [
      'Searching for concepts like "leadership"',
      'Searching for exact SKUs like "PROD-12345"',
      'Finding synonyms',
      'Multi-language queries',
    ],
    correctIndex: 1,
    explanation: 'Keyword search excels at exact matches (SKUs, codes, names) where semantic understanding doesn\'t help. Hybrid combines both strengths.',
  },
};

const step5: GuidedStep = {
  id: 'semantic-search-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'Hybrid search combines semantic and keyword matching',
    taskDescription: 'Build Client → App Server → Vector DB + Elasticsearch',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes hybrid search', displayName: 'Search API Server' },
      { type: 'vector_db', reason: 'Semantic search with HNSW', displayName: 'Vector Database' },
      { type: 'search_index', reason: 'Keyword search with BM25', displayName: 'Elasticsearch' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Search API Server', reason: 'Users send queries' },
      { from: 'Search API Server', to: 'Vector Database', reason: 'Semantic search' },
      { from: 'Search API Server', to: 'Elasticsearch', reason: 'Keyword search' },
    ],
    successCriteria: [
      'Add Elasticsearch for keyword search',
      'Connect App Server to both Vector DB and Elasticsearch',
      'Implement RRF fusion in App Server',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'vector_db', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'vector_db' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
    requireVectorIndex: true,
  },
  hints: {
    level1: 'Add Elasticsearch and connect it to App Server alongside Vector DB',
    level2: 'Build Client → App Server → [Vector DB + Elasticsearch]. App Server merges results with RRF.',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'vector_db' },
      { type: 'search_index' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'vector_db' },
      { from: 'app_server', to: 'search_index' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Re-ranking for Optimal Results
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🎯',
  scenario: "Your hybrid search returns good candidates, but the ranking could be better!",
  hook: "The perfect document is at position #7 instead of #1. Vector similarity missed some subtle relevance signals!",
  challenge: "Add a re-ranking stage using cross-encoder models to refine the top results.",
  illustration: 're-ranking',
};

const step6Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Your search platform is production-ready!',
  achievement: 'Two-stage retrieval with re-ranking achieves optimal relevance',
  metrics: [
    { label: 'Search architecture', after: 'Two-stage (ANN + Re-rank)' },
    { label: 'Top-1 accuracy', before: '65%', after: '88%' },
    { label: 'User satisfaction', after: '+45%' },
    { label: 'p99 latency', after: '<200ms' },
  ],
  nextTeaser: "Congratulations! You've built a production-grade semantic search platform with vector databases, hybrid search, and re-ranking!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Re-ranking: Two-Stage Retrieval for Precision',
  conceptExplanation: `**The limitation of vector search:**
Bi-encoders (used in vector search) embed query and documents separately:
- Fast to compute and store
- But approximate - doesn't see query-doc interaction
- Good for retrieval, but not perfect ranking

**The solution: Cross-encoders**
Encode query + document together as one input:
- Sees query-doc interaction
- Much more accurate relevance scoring
- But 100x slower - can't run on millions of docs!

**Two-stage architecture:**

**Stage 1: Retrieval (Fast, High Recall)**
- Hybrid search (semantic + keyword)
- Get top 100 candidates
- Goal: Don't miss relevant docs
- Latency: ~100ms

**Stage 2: Re-ranking (Slow, High Precision)**
- Cross-encoder scores top 100
- Re-orders by precise relevance
- Goal: Best docs first
- Latency: ~100ms (only 100 docs!)

**Total: 200ms for optimal results**

**Popular re-rankers:**
- **BERT cross-encoder** - General purpose
- **ColBERT** - Token-level matching
- **Cohere Rerank API** - Commercial service
- **RankGPT** - LLM-based re-ranking

**Typical improvements:**
- +20-30% top-1 accuracy
- +15-25% NDCG (ranking quality)
- Users find answers on first try!`,

  whyItMatters: 'Re-ranking is the difference between "okay results" and "wow, exactly what I needed!" Top-1 accuracy improves from 65% to 88%.',

  realWorldExample: {
    company: 'Cohere',
    scenario: 'Rerank API for search improvement',
    howTheyDoIt: 'Provides re-ranking as a service. Send top 100 candidates, get back precisely re-ranked results. Powers enterprise search.',
  },

  famousIncident: {
    title: 'MS MARCO Benchmark Revolution',
    company: 'Microsoft',
    year: '2019',
    whatHappened: 'BERT-based cross-encoder re-rankers crushed traditional ranking on MS MARCO. Sparked industry-wide adoption of neural re-ranking for search.',
    lessonLearned: 'Re-ranking with cross-encoders dramatically improves search quality. Two-stage is now industry standard.',
    icon: '🚀',
  },

  keyPoints: [
    'Two-stage: Fast retrieval + Slow re-ranking',
    'Bi-encoder (retrieval): Fast but approximate',
    'Cross-encoder (re-rank): Slow but precise',
    'Re-rank only top 100, not all documents',
    '+20-30% improvement in top-1 accuracy',
  ],

  diagram: `
Two-Stage Retrieval + Re-ranking
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Query: "best practices for Python debugging"
        ↓

┌───────────────────────────────────────┐
│ STAGE 1: RETRIEVAL (Fast)             │
│                                       │
│  Hybrid Search:                       │
│  - Vector DB (semantic)               │
│  - Elasticsearch (keyword)            │
│  - RRF fusion                         │
│                                       │
│  Output: Top 100 candidates (100ms)   │
└───────────────┬───────────────────────┘
                │
                │ Top 100
                ▼

┌───────────────────────────────────────┐
│ STAGE 2: RE-RANKING (Precise)         │
│                                       │
│  Cross-Encoder Model:                 │
│  - Score each (query, doc) pair       │
│  - Sees query-doc interaction         │
│  - Precise relevance scoring          │
│                                       │
│  Output: Top 10 optimally ranked      │
│         (100ms)                       │
└───────────────────────────────────────┘
                ↓

Final Results (200ms total):
1. "Python debugging best practices" (0.98)
2. "Effective Python troubleshooting" (0.95)
3. "Debug Python code efficiently" (0.93)
...
`,

  keyConcepts: [
    { title: 'Re-ranking', explanation: 'Refining result order with precise model', icon: '🎯' },
    { title: 'Cross-encoder', explanation: 'Model that scores query+doc together', icon: '🤝' },
    { title: 'Bi-encoder', explanation: 'Separate embeddings (fast for retrieval)', icon: '⚡' },
  ],

  quickCheck: {
    question: 'Why not use cross-encoder for the initial search?',
    options: [
      'It\'s less accurate than bi-encoder',
      'It\'s 100x slower - would take minutes for millions of docs',
      'It can\'t handle vectors',
      'It requires more storage',
    ],
    correctIndex: 1,
    explanation: 'Cross-encoders are too slow to run on millions of documents. We use fast retrieval to get top 100, then expensive re-ranking only on those 100.',
  },
};

const step6: GuidedStep = {
  id: 'semantic-search-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'Two-stage retrieval with cross-encoder re-ranking',
    taskDescription: 'Build full production system with Load Balancer + Cache for scale',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Hybrid search + re-ranking', displayName: 'Search API Server' },
      { type: 'cache', reason: 'Caches popular queries', displayName: 'Redis Cache' },
      { type: 'vector_db', reason: 'Semantic search', displayName: 'Vector Database' },
      { type: 'search_index', reason: 'Keyword search', displayName: 'Elasticsearch' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'All traffic enters through LB' },
      { from: 'Load Balancer', to: 'Search API Server', reason: 'LB forwards to servers' },
      { from: 'Search API Server', to: 'Redis Cache', reason: 'Cache popular query results' },
      { from: 'Search API Server', to: 'Vector Database', reason: 'Semantic search' },
      { from: 'Search API Server', to: 'Elasticsearch', reason: 'Keyword search' },
    ],
    successCriteria: [
      'Build full production architecture',
      'Client → LB → App Server → [Cache + Vector DB + Elasticsearch]',
      'Configure cache TTL and re-ranking parameters',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'vector_db', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'vector_db' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
    requireVectorIndex: true,
  },
  hints: {
    level1: 'Build the complete production system with Load Balancer and Cache',
    level2: 'Client → Load Balancer → App Server, then connect App Server to Cache, Vector DB, and Elasticsearch',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'vector_db' },
      { type: 'search_index' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'vector_db' },
      { from: 'app_server', to: 'search_index' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const semanticSearchPlatformGuidedTutorial: GuidedTutorial = {
  problemId: 'semantic-search-platform-guided',
  problemTitle: 'Build a Semantic Search Platform - An ML Infrastructure Journey',

  requirementsPhase: semanticSearchRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],

  finalExamTestCases: [
    {
      name: 'Basic Semantic Search',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Users can search documents using semantic similarity.',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Vector Similarity Performance',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Find k-nearest neighbors with sub-200ms latency.',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 60,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.01 },
    },
    {
      name: 'Hybrid Search Quality',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Hybrid search combines semantic and keyword results.',
      traffic: { type: 'mixed', rps: 500, readRps: 450, writeRps: 50 },
      duration: 60,
      passCriteria: { maxP99Latency: 250, maxErrorRate: 0.02 },
    },
    {
      name: 'NFR-P1: Search Latency Budget',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 5,000 search RPS while keeping p99 latency under 200ms.',
      traffic: { type: 'read', rps: 5000, readRps: 5000 },
      duration: 90,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.02 },
    },
    {
      name: 'NFR-S1: Traffic Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Absorb a sudden spike to 15,000 RPS.',
      traffic: { type: 'read', rps: 15000, readRps: 15000 },
      duration: 60,
      passCriteria: { maxP99Latency: 300, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-C1: Cost Efficiency',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Meet $5,000/month budget while sustaining production traffic.',
      traffic: { type: 'mixed', rps: 5000, readRps: 4500, writeRps: 500 },
      duration: 60,
      passCriteria: { maxMonthlyCost: 5000, maxErrorRate: 0.03 },
    },
  ] as TestCase[],
};

export function getSemanticSearchPlatformGuidedTutorial(): GuidedTutorial {
  return semanticSearchPlatformGuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = semanticSearchRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every((id) => askedQuestionIds.includes(id));
  const hasEnoughQuestions =
    askedQuestionIds.length >= semanticSearchRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
