import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Image Search Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching visual search through
 * building an image search engine with embeddings and similarity search.
 *
 * Key Concepts:
 * - Visual embeddings and CLIP
 * - Vector similarity search
 * - Reverse image search
 * - Approximate Nearest Neighbor (ANN)
 * - Multi-modal search (text-to-image, image-to-image)
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const imageSearchRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an image search system like Google Images or Pinterest Visual Search",

  interviewer: {
    name: 'Maya Patel',
    role: 'Senior ML Engineer at VisualAI',
    avatar: '👩‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What are the main ways users search for images in this system?",
      answer: "Users have three main search modes:\n\n1. **Text search** - Type 'golden retriever puppy' and find matching images\n2. **Reverse image search** - Upload a photo and find similar images\n3. **Visual browse** - Explore visually similar images from search results\n\nAll three rely on understanding image content, not just file names!",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Modern image search uses AI embeddings to understand visual content",
    },
    {
      id: 'search-quality',
      category: 'functional',
      question: "How do we know if two images are 'similar'?",
      answer: "We use **visual embeddings** - AI models (like CLIP) convert images into vectors. Images with similar content have similar vectors. We measure similarity using cosine similarity or L2 distance between vectors.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Embeddings transform visual understanding into mathematical similarity",
    },
    {
      id: 'multi-modal',
      category: 'functional',
      question: "Can users search for 'sunset over ocean' and find images even if the file isn't named that?",
      answer: "Yes! That's the power of **multi-modal embeddings** (CLIP). The same model understands both text and images in a shared embedding space. Text 'sunset over ocean' and photos of sunsets have similar embeddings.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "CLIP enables semantic search - understanding content, not just keywords",
    },
    {
      id: 'personalization',
      category: 'clarification',
      question: "Should search results be personalized based on user preferences?",
      answer: "Not for MVP. Personalization adds complexity (user profiles, click tracking). For now, return the same results to all users based purely on visual similarity.",
      importance: 'nice-to-have',
      insight: "Personalization is a separate ML system - good to defer for v2",
    },
    {
      id: 'image-upload',
      category: 'clarification',
      question: "Do users upload images to search, or just search existing images?",
      answer: "Users can upload a query image for reverse search. But we're searching across a pre-indexed catalog of images - users don't add images to the catalog in MVP.",
      importance: 'important',
      insight: "Query upload vs catalog ingestion are different paths",
    },

    // SCALE & NFRs
    {
      id: 'throughput-catalog',
      category: 'throughput',
      question: "How many images are in the searchable catalog?",
      answer: "100 million images in the catalog",
      importance: 'critical',
      learningPoint: "Large catalog requires efficient vector search (can't compare all pairs!)",
    },
    {
      id: 'throughput-searches',
      category: 'throughput',
      question: "How many searches per day?",
      answer: "About 100 million searches per day (mix of text and image queries)",
      importance: 'critical',
      calculation: {
        formula: "100M ÷ 86,400 sec = 1,157 searches/sec average",
        result: "~1,200 searches/sec (3,600 at peak)",
      },
      learningPoint: "Read-heavy workload - search dominates over catalog updates",
    },
    {
      id: 'throughput-indexing',
      category: 'throughput',
      question: "How often are new images added to the catalog?",
      answer: "About 1 million new images per day",
      importance: 'important',
      calculation: {
        formula: "1M ÷ 86,400 sec = 11.5 images/sec",
        result: "~12 images/sec need embedding generation and indexing",
      },
      learningPoint: "Embedding generation is compute-intensive - needs GPU batch processing",
    },
    {
      id: 'payload-embedding',
      category: 'payload',
      question: "How large is an image embedding?",
      answer: "CLIP embeddings are 512-dimensional float32 vectors. That's 512 × 4 bytes = 2KB per image embedding.",
      importance: 'critical',
      calculation: {
        formula: "100M images × 2KB = 200GB",
        result: "~200GB total for all embeddings (fits in RAM!)",
      },
      learningPoint: "Embeddings are compact - 2KB vs multi-MB image files",
    },
    {
      id: 'payload-image',
      category: 'payload',
      question: "What about the actual image files?",
      answer: "Average image is 500KB. That's 100M × 500KB = 50TB for all images. Store in object storage (S3), not database!",
      importance: 'important',
      learningPoint: "Separate concerns: embeddings in vector DB, images in object storage",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should search results appear?",
      answer: "p99 under 500ms from query submission to results. Users expect instant visual search.",
      importance: 'critical',
      learningPoint: "500ms includes: embedding query + ANN search + fetch metadata",
    },
    {
      id: 'latency-indexing',
      category: 'latency',
      question: "How quickly must new images become searchable?",
      answer: "Within 5 minutes of upload. Async batch processing is acceptable.",
      importance: 'important',
      insight: "Indexing can be async - search is real-time, indexing is not",
    },
    {
      id: 'availability-requirement',
      category: 'availability',
      question: "What's the uptime requirement?",
      answer: "99.9% availability. Visual search is a core feature but not life-critical.",
      importance: 'important',
      learningPoint: "High availability requires replication of vector index",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'search-quality', 'multi-modal'],
  criticalFRQuestionIds: ['core-features', 'search-quality', 'multi-modal'],
  criticalScaleQuestionIds: ['throughput-catalog', 'throughput-searches', 'payload-embedding', 'latency-search'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Text-to-image search',
      description: 'Users can search images using text queries',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Reverse image search',
      description: 'Users can upload an image and find visually similar images',
      emoji: '🖼️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Visual browse',
      description: 'Users can explore similar images from any result',
      emoji: '🎨',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Semantic understanding',
      description: 'Search understands content, not just filenames or tags',
      emoji: '🧠',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 million',
    writesPerDay: '1 million (new image indexing)',
    readsPerDay: '100 million (searches)',
    peakMultiplier: 3,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 12, peak: 36 },
    calculatedReadRPS: { average: 1157, peak: 3471 },
    maxPayloadSize: '500KB per image, 2KB per embedding',
    storagePerRecord: '500KB image + 2KB embedding + 1KB metadata',
    storageGrowthPerYear: '~180TB images/year',
    redirectLatencySLA: 'p99 < 500ms (search)',
    createLatencySLA: 'p99 < 5 minutes (indexing)',
  },

  architecturalImplications: [
    '✅ 100M images → Need specialized vector database (Pinecone, Weaviate, or FAISS)',
    '✅ 3,500 searches/sec peak → Vector index must support fast ANN search',
    '✅ 2KB embeddings × 100M = 200GB → Can fit in RAM for ultra-fast search',
    '✅ CLIP model → Need GPU inference for embedding generation',
    '✅ Multi-modal → Same embedding space for text and images',
    '✅ 50TB images → Object storage (S3) essential, not database',
  ],

  outOfScope: [
    'Personalized search results',
    'User-uploaded images to catalog',
    'Image editing or filters',
    'Video search',
    'OCR or text detection in images',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system that can embed images with CLIP and search using vector similarity. The complexity of scaling to 100M images and GPU optimization comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🖼️',
  scenario: "Welcome to VisualAI! You're building the next Google Images.",
  hook: "Your first user wants to search for 'golden retriever puppy' and find matching photos!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your image search platform is online!',
  achievement: 'Users can now connect to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't understand images yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every search system starts with a **Client** connecting to a **Server**.

When a user searches for images:
1. Their browser/app is the **Client**
2. It sends a search query to your **App Server**
3. The server responds with matching image results

This is the foundation we'll build on!`,

  whyItMatters: 'Without this connection, users can\'t search - no text queries, no image uploads.',

  realWorldExample: {
    company: 'Pinterest',
    scenario: 'Visual search serving 400M monthly users',
    howTheyDoIt: 'Started with simple HTTP servers, now uses distributed microservices for search',
  },

  keyPoints: [
    'Client = the user\'s browser or mobile app',
    'App Server = your backend that handles search requests',
    'HTTP/HTTPS = the protocol for communication',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s browser or app', icon: '📱' },
    { title: 'App Server', explanation: 'Backend handling search logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'image-search-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users searching for images', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles search requests', displayName: 'App Server' },
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
// STEP 2: Add ML Service for CLIP Embeddings
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🧠',
  scenario: "Your server is connected, but it can't understand images or text queries!",
  hook: "A user types 'sunset over ocean' - how do we find matching images without manual tags?",
  challenge: "Add an ML Service running CLIP to convert images and text into embeddings.",
  illustration: 'ai-brain',
};

const step2Celebration: CelebrationContent = {
  emoji: '✨',
  message: 'Your system can now understand visual content!',
  achievement: 'CLIP embeddings enable semantic search',
  metrics: [
    { label: 'Embedding model', after: 'CLIP' },
    { label: 'Supports text queries', after: '✓' },
    { label: 'Supports image queries', after: '✓' },
  ],
  nextTeaser: "But where do we store these embeddings for fast search?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'CLIP: The Magic Behind Visual Search',
  conceptExplanation: `**CLIP (Contrastive Language-Image Pre-training)** is a breakthrough AI model from OpenAI.

**How CLIP works:**
1. Trained on 400M image-text pairs from the internet
2. Learns to embed images and text into the **same vector space**
3. Similar concepts (text or image) have similar embeddings

**Example:**
- Text: "golden retriever puppy" → [0.2, 0.8, 0.1, ...] (512 dimensions)
- Image: Photo of golden retriever → [0.19, 0.82, 0.09, ...] (close!)
- Image: Photo of a cat → [-0.5, 0.1, 0.9, ...] (far away)

**Why CLIP is revolutionary:**
- Search by meaning, not keywords
- "Dog playing fetch" finds images even if no tags exist
- Reverse image search uses the same embedding space`,

  whyItMatters: 'Without embeddings, you\'d need manual tags for every image. CLIP understands visual content automatically.',

  realWorldExample: {
    company: 'Google Images',
    scenario: 'Searching billions of images',
    howTheyDoIt: 'Uses transformer-based vision models (similar to CLIP) to generate embeddings for semantic search',
  },

  famousIncident: {
    title: 'Flickr\'s Tag-Based Search Era',
    company: 'Flickr',
    year: '2005-2015',
    whatHappened: 'Before AI embeddings, Flickr relied entirely on user tags. If someone uploaded a beach photo but forgot to tag it "beach", it wouldn\'t appear in beach searches. Millions of images were unsearchable.',
    lessonLearned: 'AI embeddings eliminate reliance on manual tagging. Content-based understanding is essential.',
    icon: '🏷️',
  },

  keyPoints: [
    'CLIP embeds both images and text into the same 512D vector space',
    'Cosine similarity measures how "close" two embeddings are',
    'Multi-modal: same model for text-to-image and image-to-image search',
    'GPU-accelerated: batch processing for efficiency',
  ],

  diagram: `
┌─────────────────────────────────────────┐
│          CLIP EMBEDDING                 │
├─────────────────────────────────────────┤
│                                         │
│  Text: "sunset"                         │
│       ↓                                 │
│  ┌──────────┐                           │
│  │   CLIP   │ → [0.8, 0.2, 0.1, ...]   │
│  │  Encoder │                           │
│  └──────────┘                           │
│       ↑                                 │
│  Image: 🌅                              │
│       ↓                                 │
│  [0.79, 0.21, 0.09, ...]                │
│                                         │
│  Cosine Similarity = 0.98 (very close!)│
└─────────────────────────────────────────┘`,

  quickCheck: {
    question: 'Why does CLIP enable text-to-image search?',
    options: [
      'It automatically tags images with text',
      'It embeds text and images into the same vector space',
      'It translates text into image format',
      'It searches image filenames',
    ],
    correctIndex: 1,
    explanation: 'CLIP creates embeddings where similar text and images are close in vector space, enabling semantic search.',
  },

  keyConcepts: [
    { title: 'CLIP', explanation: 'Multi-modal model for text and image embeddings', icon: '🧠' },
    { title: 'Embedding', explanation: '512D vector representing semantic meaning', icon: '📊' },
    { title: 'Cosine Similarity', explanation: 'Measure of vector similarity (-1 to 1)', icon: '📐' },
  ],
};

const step2: GuidedStep = {
  id: 'image-search-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1, FR-2: Enable semantic search with CLIP',
    taskDescription: 'Add an ML Service for CLIP embedding generation',
    componentsNeeded: [
      { type: 'ml_service', reason: 'Runs CLIP model to generate embeddings', displayName: 'ML Service (CLIP)' },
    ],
    successCriteria: [
      'ML Service component added',
      'App Server connected to ML Service',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'ml_service'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'ml_service' },
    ],
  },

  hints: {
    level1: 'Add an ML Service component to run the CLIP model',
    level2: 'Connect App Server to ML Service - the server will send images/text for embedding',
    solutionComponents: [{ type: 'ml_service' }],
    solutionConnections: [{ from: 'app_server', to: 'ml_service' }],
  },
};

// =============================================================================
// STEP 3: Add Vector Database for Similarity Search
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🔍',
  scenario: "You can generate embeddings, but how do you find similar ones among 100 million images?",
  hook: "Comparing every embedding pair would take hours! You need a specialized database.",
  challenge: "Add a Vector Database optimized for fast similarity search (ANN - Approximate Nearest Neighbor).",
  illustration: 'vector-search',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Similarity search is now lightning fast!',
  achievement: 'Vector database enables sub-second ANN search',
  metrics: [
    { label: 'Search method', after: 'ANN (HNSW)' },
    { label: 'Search time', after: '<50ms' },
    { label: 'Index size', after: '100M vectors' },
  ],
  nextTeaser: "But where are the actual image files stored?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Vector Databases and ANN Search',
  conceptExplanation: `**Problem:** With 100M images, you can't compare query embedding to all 100M embeddings (too slow!).

**Solution:** Vector Databases use **ANN (Approximate Nearest Neighbor)** algorithms.

**Popular ANN algorithms:**
1. **HNSW (Hierarchical Navigable Small World)** - Fast, accurate
   - Build a multi-layer graph connecting similar vectors
   - Search like "playing 6 degrees of separation"
   - Used by: Pinecone, Weaviate, Milvus

2. **IVF (Inverted File Index)** - Cluster-based
   - Divide vectors into clusters (like partitioning)
   - Search only relevant clusters
   - Used by: FAISS

3. **LSH (Locality-Sensitive Hashing)** - Hash-based
   - Hash similar vectors to same buckets
   - Search only within buckets

**Why it's fast:**
- Instead of 100M comparisons → ~1,000 comparisons
- 99%+ recall (finds most similar items)
- Trade tiny accuracy for massive speed`,

  whyItMatters: 'Brute-force search of 100M vectors takes seconds. ANN search takes milliseconds.',

  realWorldExample: {
    company: 'Pinterest',
    scenario: 'Visual search across 200B+ pins',
    howTheyDoIt: 'Uses custom vector index with sharded ANN search. Handles 1000s of queries/sec with <100ms latency.',
  },

  famousIncident: {
    title: 'Google Images Scaling Crisis',
    company: 'Google',
    year: '2012',
    whatHappened: 'Early Google Images relied on keyword matching and brute-force comparisons. As the image corpus grew to billions, search became unbearably slow. They invested heavily in vector search infrastructure.',
    lessonLearned: 'At scale, linear search doesn\'t work. You need specialized indexes for vector similarity.',
    icon: '🔬',
  },

  keyPoints: [
    'Vector DB stores embeddings + metadata (not the images themselves)',
    'ANN algorithms trade small accuracy loss for massive speed gains',
    'HNSW is the gold standard - fast and accurate',
    'Index must fit in RAM for best performance (200GB for 100M vectors)',
  ],

  diagram: `
┌─────────────────────────────────────────┐
│       VECTOR DATABASE (HNSW)            │
├─────────────────────────────────────────┤
│                                         │
│  Query: [0.8, 0.2, 0.1, ...]            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      HNSW Graph Layers          │   │
│  │                                 │   │
│  │  Layer 2: ●─────●               │   │
│  │            │     │               │   │
│  │  Layer 1: ●─●─●─●─●             │   │
│  │            │ │ │ │ │             │   │
│  │  Layer 0: ●●●●●●●●●●            │   │
│  │  (all 100M vectors)             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Navigate graph → Find nearest in ~1ms │
│                                         │
│  Top 10 Results:                        │
│  1. image_id: 12345, score: 0.95        │
│  2. image_id: 67890, score: 0.92        │
│  ...                                    │
└─────────────────────────────────────────┘`,

  quickCheck: {
    question: 'Why use ANN instead of exact nearest neighbor search?',
    options: [
      'ANN is more accurate',
      'ANN is required by vector databases',
      'ANN is 1000x faster with minimal accuracy loss',
      'Exact search is impossible with vectors',
    ],
    correctIndex: 2,
    explanation: 'ANN trades ~1% accuracy for 1000x speed improvement - essential for real-time search at scale.',
  },

  keyConcepts: [
    { title: 'Vector DB', explanation: 'Database optimized for similarity search', icon: '🗄️' },
    { title: 'ANN', explanation: 'Approximate Nearest Neighbor - fast similarity search', icon: '🎯' },
    { title: 'HNSW', explanation: 'Graph-based ANN algorithm (fast + accurate)', icon: '🕸️' },
  ],
};

const step3: GuidedStep = {
  id: 'image-search-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1, FR-2, FR-3: Fast similarity search',
    taskDescription: 'Add a Vector Database for storing embeddings and ANN search',
    componentsNeeded: [
      { type: 'vector_db', reason: 'Stores image embeddings and enables fast similarity search', displayName: 'Vector DB' },
    ],
    successCriteria: [
      'Vector Database component added',
      'App Server connected to Vector Database',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'ml_service', 'vector_db'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'ml_service' },
      { fromType: 'app_server', toType: 'vector_db' },
    ],
  },

  hints: {
    level1: 'Add a Vector Database to store embeddings and enable similarity search',
    level2: 'Connect App Server to Vector DB - server will query for similar vectors',
    solutionComponents: [{ type: 'vector_db' }],
    solutionConnections: [{ from: 'app_server', to: 'vector_db' }],
  },
};

// =============================================================================
// STEP 4: Add Object Storage for Images
// =============================================================================

const step4Story: StoryContent = {
  emoji: '📦',
  scenario: "You can find similar embeddings, but users want to SEE the actual images!",
  hook: "The vector DB has image IDs and embeddings, but where are the 50TB of image files?",
  challenge: "Add Object Storage (S3) to store the actual image files.",
  illustration: 'storage-full',
};

const step4Celebration: CelebrationContent = {
  emoji: '☁️',
  message: 'Images have a proper home!',
  achievement: 'Object storage handles unlimited image files',
  metrics: [
    { label: 'Image storage', after: 'S3' },
    { label: 'Storage capacity', after: 'Unlimited' },
    { label: 'Durability', after: '99.999999999%' },
  ],
  nextTeaser: "But users far away are experiencing slow image loads...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage: The Home for Image Files',
  conceptExplanation: `**Why separate storage for images?**

Vector DB stores:
- Image embeddings (2KB each)
- Metadata (title, URL, upload date)
- NOT the actual image files!

Object Storage (S3) stores:
- Actual image files (500KB average)
- Thumbnails, different sizes
- Virtually unlimited capacity

**The search flow:**
1. User queries: "sunset"
2. CLIP embeds query → [0.8, 0.2, ...]
3. Vector DB returns similar image IDs
4. App Server fetches image URLs from S3
5. Client displays images

**Why S3?**
- Designed for large binary files (images, videos)
- Pay only for what you use
- Built-in redundancy (99.999999999% durability)
- CDN integration for fast delivery`,

  whyItMatters: 'Storing 50TB of images in a database would be slow and expensive. Object storage is optimized for this.',

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Storing billions of photos and videos',
    howTheyDoIt: 'Uses custom object storage built on Facebook\'s Haystack. Optimized for photo serving with CDN caching.',
  },

  keyPoints: [
    'Vector DB: embeddings + metadata (2KB per image)',
    'Object Storage: actual files (500KB per image)',
    'Search returns image IDs → fetch URLs from S3',
    'S3 integrates with CDN for fast global delivery',
  ],

  diagram: `
┌───────────────────────────────────────┐
│        SEARCH FLOW                    │
├───────────────────────────────────────┤
│                                       │
│  1. Query: "sunset"                   │
│       ↓                               │
│  2. CLIP → [0.8, 0.2, ...]            │
│       ↓                               │
│  3. Vector DB → [img_12345, img_67890]│
│       ↓                               │
│  4. S3 URLs:                          │
│     s3://bucket/12345.jpg             │
│     s3://bucket/67890.jpg             │
│       ↓                               │
│  5. Return URLs to client             │
│       ↓                               │
│  6. Client displays images            │
└───────────────────────────────────────┘`,

  quickCheck: {
    question: 'Why not store image files directly in the Vector Database?',
    options: [
      'Vector DBs can\'t store binary files',
      'It would be slow and expensive at 50TB scale',
      'S3 is required by law',
      'Images would lose quality',
    ],
    correctIndex: 1,
    explanation: 'Vector DBs are optimized for numerical vectors, not large binary files. Object storage is designed for this.',
  },

  keyConcepts: [
    { title: 'Object Storage', explanation: 'Designed for large binary files (images, videos)', icon: '📦' },
    { title: 'Image URL', explanation: 'Pointer to image file in S3', icon: '🔗' },
    { title: 'Separation of Concerns', explanation: 'Embeddings in vector DB, files in S3', icon: '🎯' },
  ],
};

const step4: GuidedStep = {
  id: 'image-search-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'All FRs: Return actual image URLs to users',
    taskDescription: 'Add Object Storage (S3) for storing image files',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Stores actual image files (50TB+)', displayName: 'S3 Object Storage' },
    ],
    successCriteria: [
      'Object Storage component added',
      'App Server connected to Object Storage',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'ml_service', 'vector_db', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'ml_service' },
      { fromType: 'app_server', toType: 'vector_db' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Add Object Storage (S3) for image files',
    level2: 'Connect App Server to Object Storage to fetch image URLs',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 5: Add CDN for Fast Image Delivery
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🌍',
  scenario: "Users in Asia are seeing image search results instantly, but images take 5 seconds to load!",
  hook: "Your S3 bucket is in US-East. Loading images from across the world is painfully slow.",
  challenge: "Add a CDN to cache images at edge locations worldwide.",
  illustration: 'global-latency',
};

const step5Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Images load instantly worldwide!',
  achievement: 'CDN delivers images from edge locations',
  metrics: [
    { label: 'Tokyo image load', before: '5s', after: '200ms' },
    { label: 'CDN cache hit rate', after: '95%' },
    { label: 'Edge locations', after: '200+' },
  ],
  nextTeaser: "But what if the ML service goes down during peak traffic?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'CDN: Essential for Global Image Delivery',
  conceptExplanation: `**The problem:** Images are large (500KB average). Loading from S3 in US-East to Tokyo = 5 seconds!

**The solution:** CDN (Content Delivery Network)

**How CDN works:**
1. User in Tokyo searches for "puppies"
2. App Server returns image URLs (CDN URLs, not direct S3)
3. User's browser requests: cdn.example.com/12345.jpg
4. CDN checks: Do I have this image cached in Tokyo edge?
5. **Cache HIT:** Return immediately from Tokyo edge (200ms)
6. **Cache MISS:** Fetch from S3, cache at edge, return to user (1s first time, then cached)

**Popular images** (viral search results) get cached at ALL edges worldwide.

**Why it's critical for image search:**
- Search results often contain same images (popular results)
- 95%+ cache hit rate is typical
- Edge caching = < 200ms image load globally
- Reduces S3 egress costs dramatically`,

  whyItMatters: 'Without CDN, global users have terrible experience. 5-second image loads = users leave.',

  realWorldExample: {
    company: 'Google Images',
    scenario: 'Serving billions of image searches globally',
    howTheyDoIt: 'Massive CDN infrastructure with edge caching. Images cached at hundreds of locations worldwide.',
  },

  keyPoints: [
    'CDN caches images at edge locations near users',
    'App Server returns CDN URLs, not direct S3 URLs',
    'Popular images = high cache hit rate',
    'Reduces latency from seconds to milliseconds',
  ],

  diagram: `
User in Tokyo searching:

┌──────────┐    50ms    ┌──────────┐  ┌─────────────┐
│   User   │◀─────────▶ │   CDN    │──│ Tokyo Edge  │
│ (Tokyo)  │  Image load│  Edge    │  │(Cached imgs)│
└──────────┘            └──────────┘  └─────────────┘
                             │
                             │ Cache miss?
                             │ Fetch from origin
                             ▼
                        ┌────────┐
                        │   S3   │
                        │ US-East│
                        └────────┘`,

  quickCheck: {
    question: 'Why does CDN dramatically improve image search UX?',
    options: [
      'CDN compresses images to smaller sizes',
      'CDN caches popular images at edges near users',
      'CDN makes the vector search faster',
      'CDN improves embedding quality',
    ],
    correctIndex: 1,
    explanation: 'CDN caches images at edge locations, so users load images from nearby servers (200ms vs 5s).',
  },

  keyConcepts: [
    { title: 'CDN', explanation: 'Content Delivery Network - edge caching', icon: '🌐' },
    { title: 'Edge Location', explanation: 'Server near users for fast delivery', icon: '📍' },
    { title: 'Cache Hit Rate', explanation: '% of requests served from cache', icon: '🎯' },
  ],
};

const step5: GuidedStep = {
  id: 'image-search-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs: Fast image delivery globally',
    taskDescription: 'Add CDN for image delivery from edge locations',
    componentsNeeded: [
      { type: 'cdn', reason: 'Cache images at edge for fast global delivery', displayName: 'CDN' },
    ],
    successCriteria: [
      'CDN component added',
      'CDN connected to Object Storage (origin)',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'ml_service', 'vector_db', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'ml_service' },
      { fromType: 'app_server', toType: 'vector_db' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Add a CDN component connected to Object Storage',
    level2: 'CDN acts as caching layer between users and S3 - connect it to Object Storage',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [{ from: 'cdn', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 6: Add Cache for Frequent Searches
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚡',
  scenario: "Everyone is searching for 'puppies' and 'kittens' - the same popular queries over and over!",
  hook: "You're re-computing CLIP embeddings for these queries thousands of times. That's wasteful!",
  challenge: "Add a cache to store embeddings for frequent search queries.",
  illustration: 'repeated-work',
};

const step6Celebration: CelebrationContent = {
  emoji: '💨',
  message: 'Search is now blazing fast!',
  achievement: 'Cache eliminates redundant embedding computation',
  metrics: [
    { label: 'Popular query latency', before: '150ms', after: '5ms' },
    { label: 'GPU load reduction', after: '-70%' },
    { label: 'Cache hit rate', after: '80%' },
  ],
  nextTeaser: "But peak traffic is overwhelming your single ML service...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Avoid Redundant Computation',
  conceptExplanation: `**The insight:** Search queries follow a power law distribution.

**The 80/20 rule:**
- 20% of queries account for 80% of traffic
- "puppies", "sunset", "beach" searched thousands of times
- Each search re-computes the same CLIP embedding!

**Cache strategy:**
1. User searches "puppies"
2. Check cache: Do we have embedding for "puppies"?
3. **Cache HIT:** Use cached embedding (5ms)
4. **Cache MISS:** Call CLIP, compute embedding, cache it (150ms)

**What to cache:**
- Text query embeddings (2KB each)
- Image query embeddings (for reverse search)
- Search results for popular queries (optional)

**TTL considerations:**
- Text embeddings: Cache for 1 hour (embeddings don't change)
- Search results: Cache for 5 minutes (catalog updates)

**Impact:**
- 80% cache hit rate = 80% fewer GPU calls
- GPU costs drop 70%+
- Latency drops from 150ms → 5ms for popular queries`,

  whyItMatters: 'Without caching, you waste GPU compute re-embedding the same queries. Costs skyrocket, latency suffers.',

  realWorldExample: {
    company: 'Pinterest',
    scenario: 'Trending searches (seasonal patterns)',
    howTheyDoIt: 'Caches embeddings for trending queries. During holidays, "Christmas decorations" cached at all nodes.',
  },

  keyPoints: [
    'Cache text query embeddings (20% of queries = 80% of traffic)',
    'Redis for fast in-memory cache',
    'TTL: 1 hour for embeddings (they don\'t change)',
    '80%+ cache hit rate is achievable',
  ],

  diagram: `
Search flow with caching:

User searches "puppies"
        ↓
   ┌─────────┐
   │  Cache  │ Check for cached embedding
   │ (Redis) │
   └────┬────┘
        │
    Cache HIT (80%) → [0.2, 0.8, ...] → Vector DB
        │                                     ↓
    Cache MISS (20%)                     Find similar
        ↓                                     ↓
   ┌──────────┐                         Return results
   │   CLIP   │ → Embed → Cache → Vector DB
   │ ML Svc   │
   └──────────┘`,

  quickCheck: {
    question: 'Why does caching dramatically reduce costs for image search?',
    options: [
      'Cache eliminates need for vector database',
      'Cache stores images so CDN isn\'t needed',
      'Cache avoids redundant GPU embedding computation',
      'Cache makes CLIP more accurate',
    ],
    correctIndex: 2,
    explanation: 'GPU compute (CLIP) is expensive. Caching embeddings for popular queries eliminates 70%+ of GPU calls.',
  },

  keyConcepts: [
    { title: 'Query Cache', explanation: 'Store embeddings for frequent queries', icon: '💾' },
    { title: 'Power Law', explanation: '20% of queries = 80% of traffic', icon: '📊' },
    { title: 'GPU Savings', explanation: 'Cache reduces expensive GPU compute', icon: '💰' },
  ],
};

const step6: GuidedStep = {
  id: 'image-search-step-6',
  stepNumber: 6,
  frIndex: 4,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs: Faster search with query caching',
    taskDescription: 'Add Cache (Redis) to store query embeddings',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache query embeddings to avoid redundant CLIP calls', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added',
      'App Server connected to Cache',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'ml_service', 'vector_db', 'object_storage', 'cdn', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'ml_service' },
      { fromType: 'app_server', toType: 'vector_db' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add a Cache (Redis) to store query embeddings',
    level2: 'Connect App Server to Cache - check cache before calling ML Service',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 7: Add Load Balancer and Scale ML Service
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔥',
  scenario: "Peak traffic! 10,000 searches per second, but your ML Service can only handle 100!",
  hook: "Cache helps, but 20% of queries still miss → 2,000 CLIP calls/sec. One GPU instance can't handle it!",
  challenge: "Add a Load Balancer and scale your ML Service horizontally with multiple GPU instances.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your system can handle peak traffic!',
  achievement: 'Load balancing + horizontal scaling = unlimited capacity',
  metrics: [
    { label: 'ML Service instances', before: '1', after: '5' },
    { label: 'Throughput', before: '100 RPS', after: '2000+ RPS' },
    { label: 'Availability', after: '99.9%' },
  ],
  nextTeaser: "One last thing - the vector index needs to scale too!",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Scaling ML Services: Load Balancing + GPUs',
  conceptExplanation: `**The scaling challenge:**
- Peak traffic: 10,000 searches/sec
- Cache hit rate: 80%
- Cache misses: 2,000 CLIP calls/sec
- One GPU instance: ~100-200 CLIP inferences/sec
- **Need:** 10-20 GPU instances!

**Solution: Load Balancer + Horizontal Scaling**

1. **Load Balancer** distributes embedding requests across ML instances
2. Each instance runs CLIP on a GPU
3. Scale instances up/down based on traffic

**GPU considerations:**
- **Batch inference:** Process multiple queries together (more efficient)
- **GPU types:** T4, V100, A100 (increasing power and cost)
- **Auto-scaling:** Scale instances based on queue depth
- **Cost:** GPUs are expensive - scale intelligently!

**Architecture:**
\`\`\`
App Server → Load Balancer → [ML Instance 1 (GPU)]
                           → [ML Instance 2 (GPU)]
                           → [ML Instance 3 (GPU)]
                           ...
\`\`\`

**Batch processing optimization:**
- Collect 32 queries → Send as batch → CLIP processes together
- 5x more efficient than one-at-a-time
- Trade small latency (+10ms) for massive throughput gain`,

  whyItMatters: 'GPU compute is expensive. Efficient scaling (batching + right-sizing) can save thousands per month.',

  realWorldExample: {
    company: 'OpenAI DALL-E',
    scenario: 'Millions of image generation requests',
    howTheyDoIt: 'Auto-scales GPU clusters based on queue depth. Batch processing for efficiency. A10/A100 GPUs for inference.',
  },

  famousIncident: {
    title: 'Stable Diffusion Launch Meltdown',
    company: 'Stability AI',
    year: '2022',
    whatHappened: 'When Stable Diffusion launched publicly, their demo site was overwhelmed. Single GPU instance couldn\'t handle traffic. Site was down for hours until they scaled to dozens of GPU instances.',
    lessonLearned: 'ML services need horizontal scaling just like app servers. GPUs are a bottleneck - plan capacity!',
    icon: '🎨',
  },

  keyPoints: [
    'Load Balancer distributes CLIP requests across GPU instances',
    'Each ML instance runs on a GPU (T4, V100, A100)',
    'Batch processing: 5x efficiency gain',
    'Auto-scale based on queue depth and latency',
    'Monitor GPU utilization - keep under 80%',
  ],

  diagram: `
                 ┌──────────────┐
                 │Load Balancer │
                 └──────┬───────┘
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
    ┌─────────┐   ┌─────────┐   ┌─────────┐
    │ ML Svc 1│   │ ML Svc 2│   │ ML Svc 3│
    │  (GPU)  │   │  (GPU)  │   │  (GPU)  │
    └─────────┘   └─────────┘   └─────────┘
         │             │             │
         └─────────────┴─────────────┘
                  Each: ~200 RPS
              Total: 600+ RPS capacity`,

  quickCheck: {
    question: 'Why is batch processing important for ML inference?',
    options: [
      'It makes models more accurate',
      'It allows processing multiple inputs together on GPU (5x more efficient)',
      'It reduces memory usage',
      'It\'s required by CLIP',
    ],
    correctIndex: 1,
    explanation: 'GPUs are optimized for parallel processing. Batching 32 queries together is 5x more efficient than one-at-a-time.',
  },

  keyConcepts: [
    { title: 'GPU Scaling', explanation: 'Multiple GPU instances for ML inference', icon: '🎮' },
    { title: 'Batch Processing', explanation: 'Process multiple queries together (5x efficient)', icon: '📦' },
    { title: 'Auto-Scaling', explanation: 'Scale instances based on queue depth', icon: '📈' },
  ],
};

const step7: GuidedStep = {
  id: 'image-search-step-7',
  stepNumber: 7,
  frIndex: 5,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs: Handle peak traffic with scaled ML',
    taskDescription: 'Add Load Balancer and scale ML Service to multiple GPU instances',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute requests across ML instances', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
      'Configure ML Service for multiple instances',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'ml_service', 'vector_db', 'object_storage', 'cdn', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'ml_service' },
      { fromType: 'app_server', toType: 'vector_db' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireMultipleMLInstances: true,
  },

  hints: {
    level1: 'Add Load Balancer in front of App Server, then scale ML Service',
    level2: 'Place LB between Client and App Server. Then configure ML Service for multiple GPU instances.',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 8: Add Message Queue for Async Indexing
// =============================================================================

const step8Story: StoryContent = {
  emoji: '📸',
  scenario: "Your system handles search beautifully! But what about NEW images?",
  hook: "1 million images/day need embeddings generated and indexed. You can't make users wait!",
  challenge: "Add a Message Queue for async batch processing of new images.",
  illustration: 'async-processing',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a production-grade image search system!',
  achievement: 'Complete architecture with search, indexing, and global delivery',
  metrics: [
    { label: 'Search latency', after: '<500ms p99' },
    { label: 'Indexing throughput', after: '1M images/day' },
    { label: 'Global coverage', after: '200+ edge locations' },
    { label: 'Availability', after: '99.9%' },
  ],
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Async Processing: Batch Indexing Pipeline',
  conceptExplanation: `**The two paths in image search:**

**1. Search path (SYNC - user waiting):**
   - User searches → Embed query → Vector search → Return results
   - Must be fast: < 500ms

**2. Indexing path (ASYNC - user NOT waiting):**
   - New image uploaded → Generate embedding → Add to vector index
   - Can be slow: minutes acceptable

**Message Queue architecture:**
\`\`\`
Image Upload → Queue → Batch Workers → Embed → Vector DB
\`\`\`

**Why Message Queue?**
1. **Decoupling:** Upload API returns immediately, processing happens async
2. **Batching:** Workers process 100 images together (GPU efficient!)
3. **Reliability:** If worker crashes, messages aren't lost (retry)
4. **Backpressure:** Queue prevents overwhelming GPU workers

**The flow:**
1. User uploads image → Store in S3
2. Add message to queue: { image_id: 12345, s3_url: "..." }
3. Worker pulls batch of 100 messages
4. Load 100 images from S3
5. CLIP embeds all 100 in one GPU batch (efficient!)
6. Insert 100 embeddings into Vector DB
7. ACK messages in queue

**Popular queues:**
- **Kafka** - High throughput, distributed
- **RabbitMQ** - Reliable, feature-rich
- **SQS** - Managed AWS service`,

  whyItMatters: 'Without async processing, image uploads would take 10+ seconds while CLIP computes. Users would abandon!',

  realWorldExample: {
    company: 'Instagram',
    scenario: '95 million photos/day uploaded',
    howTheyDoIt: 'Async pipeline: Upload → Queue → Batch workers generate thumbnails, apply filters, extract features. User sees "processing" briefly.',
  },

  keyPoints: [
    'Message Queue decouples upload from embedding generation',
    'Batch processing: 100 images at once (GPU efficient)',
    'Workers can scale independently of API servers',
    'Queue provides reliability (retry on failure)',
  ],

  diagram: `
┌──────────────────────────────────────┐
│     INDEXING PIPELINE                │
├──────────────────────────────────────┤
│                                      │
│  Upload Image                        │
│       ↓                              │
│  ┌─────────┐                         │
│  │   S3    │ (store image)           │
│  └────┬────┘                         │
│       │                              │
│       ▼                              │
│  ┌─────────┐                         │
│  │ Queue   │ (async job)             │
│  └────┬────┘                         │
│       │                              │
│       ▼                              │
│  ┌─────────┐ (batch of 100)          │
│  │ Workers │ → CLIP → Embeddings     │
│  │  (GPU)  │                         │
│  └────┬────┘                         │
│       │                              │
│       ▼                              │
│  ┌─────────────┐                     │
│  │  Vector DB  │ (index embeddings)  │
│  └─────────────┘                     │
│                                      │
│  User sees: "Image processing..."   │
│  (5 mins later) Image searchable!   │
└──────────────────────────────────────┘`,

  quickCheck: {
    question: 'Why use a message queue instead of processing uploads synchronously?',
    options: [
      'Queues are faster than direct processing',
      'Queues enable async batching (efficient GPU use) and prevent blocking users',
      'Queues are required by CLIP',
      'Queues compress images better',
    ],
    correctIndex: 1,
    explanation: 'Async processing via queue lets users upload quickly while batching enables efficient GPU processing.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Async job queue (Kafka, SQS, RabbitMQ)', icon: '📬' },
    { title: 'Batch Workers', explanation: 'Process 100+ messages together', icon: '👷' },
    { title: 'Decoupling', explanation: 'Upload API separate from processing', icon: '🔗' },
  ],
};

const step8: GuidedStep = {
  id: 'image-search-step-8',
  stepNumber: 8,
  frIndex: 6,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'Complete system: Search + Indexing',
    taskDescription: 'Add Message Queue for async batch indexing of new images',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Async pipeline for batch embedding generation', displayName: 'Message Queue' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
      'ML Service connected to Message Queue',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'ml_service', 'vector_db', 'object_storage', 'cdn', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'ml_service' },
      { fromType: 'app_server', toType: 'vector_db' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'ml_service', toType: 'message_queue' },
    ],
    requireMultipleMLInstances: true,
  },

  hints: {
    level1: 'Add Message Queue for async indexing pipeline',
    level2: 'Connect App Server and ML Service to Message Queue for async batch processing',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [
      { from: 'app_server', to: 'message_queue' },
      { from: 'ml_service', to: 'message_queue' },
    ],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const imageSearchGuidedTutorial: GuidedTutorial = {
  problemId: 'image-search',
  title: 'Design Image Search',
  description: 'Build a visual search engine with CLIP embeddings, vector similarity search, and reverse image search',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '🖼️',
    hook: "You've been hired as Lead ML Engineer at VisualAI!",
    scenario: "Your mission: Build an image search system that understands visual content using AI - like Google Images or Pinterest Visual Search.",
    challenge: "Can you design a system that searches 100 million images in milliseconds using semantic understanding?",
  },

  requirementsPhase: imageSearchRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'CLIP Multi-Modal Embeddings',
    'Vector Similarity Search',
    'Approximate Nearest Neighbor (ANN)',
    'HNSW Algorithm',
    'Reverse Image Search',
    'Object Storage for Images',
    'CDN for Image Delivery',
    'Query Caching',
    'GPU Inference Scaling',
    'Batch Processing',
    'Async Indexing Pipeline',
    'Message Queue Architecture',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (Vector indexes)',
    'Chapter 6: Partitioning (Sharding vector databases)',
    'Chapter 11: Stream Processing (Async indexing)',
  ],
};

export default imageSearchGuidedTutorial;
