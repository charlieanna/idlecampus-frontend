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
 * Multi-Model Database Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching polyglot persistence and multi-model database concepts
 * while building an e-commerce platform that needs different data models.
 *
 * Flow:
 * Phase 0: Requirements gathering (questions about data models, query patterns, consistency)
 * Steps 1-3: Basic polyglot persistence (document, graph, relational)
 * Steps 4-6: Document + Graph + Relational integration, cross-model queries, sync strategies
 *
 * Key Concepts:
 * - Polyglot persistence (right database for right use case)
 * - Document database (MongoDB) for product catalog
 * - Graph database (Neo4j) for recommendations
 * - Relational database (PostgreSQL) for transactions
 * - Data synchronization across models
 * - Eventual consistency between models
 * - CQRS pattern for cross-model queries
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const multiModelRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a multi-model database system for an e-commerce platform like Amazon",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Principal Database Architect',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'data-models',
      category: 'functional',
      question: "What types of data does an e-commerce platform need to store?",
      answer: "E-commerce platforms have VERY different data needs:\n\n1. **Product Catalog** (flexible schema, nested data)\n   - Products with varying attributes (books vs electronics vs clothing)\n   - Images, descriptions, specs\n   - Need: Document database (MongoDB)\n\n2. **User Relationships** (connections, recommendations)\n   - User browsing history\n   - Product recommendations based on what similar users bought\n   - Need: Graph database (Neo4j)\n\n3. **Order Transactions** (ACID, strong consistency)\n   - Orders, payments, inventory\n   - Must be exact - no eventual consistency for money!\n   - Need: Relational database (PostgreSQL)",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "One database can't optimize for all use cases. This is why multi-model databases exist!",
    },
    {
      id: 'query-patterns',
      category: 'functional',
      question: "What are the main query patterns for each data type?",
      answer: "Each data model has different query patterns:\n\n**Product Catalog (Document DB):**\n- Find products by category\n- Search by text (title, description)\n- Flexible filtering (color, size, brand)\n- Complex nested queries\n\n**Recommendations (Graph DB):**\n- 'Users who bought X also bought Y'\n- Collaborative filtering\n- Shortest path between related products\n- Multi-hop traversals\n\n**Transactions (Relational DB):**\n- Create order with multiple items (ACID)\n- Calculate totals, taxes, shipping\n- Update inventory atomically\n- Strong consistency required",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Query patterns determine the right database model. Document for flexibility, Graph for relationships, Relational for transactions.",
    },
    {
      id: 'cross-model-queries',
      category: 'functional',
      question: "Do queries ever need data from multiple database models?",
      answer: "Yes! This is the HARD part of multi-model systems:\n\n**Example: Product Page**\n- Product details (from MongoDB)\n- Recommendations (from Neo4j)\n- Stock availability (from PostgreSQL)\n- ALL on one page!\n\n**Example: Checkout**\n- User cart (MongoDB)\n- Validate inventory (PostgreSQL)\n- Update purchase graph (Neo4j)\n- Must coordinate across 3 databases!\n\n**Solution:** Application layer joins or CQRS pattern",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Cross-model queries are expensive. Use caching and async updates to minimize them.",
    },
    {
      id: 'consistency-requirements',
      category: 'functional',
      question: "What are the consistency requirements across different models?",
      answer: "Different data has different consistency needs:\n\n**STRONG consistency (Relational):**\n- Order totals, payments, inventory\n- MUST be exact, ACID required\n- PostgreSQL provides this\n\n**EVENTUAL consistency (Document + Graph):**\n- Product catalog can be stale by seconds\n- Recommendations can be hours old\n- MongoDB + Neo4j can lag behind\n\n**The sync challenge:**\n- When order completes (PostgreSQL)\n- Update product catalog sold count (MongoDB)\n- Update purchase graph (Neo4j)\n- These updates can be async!",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Multi-model systems embrace eventual consistency between models. Only transactional data needs strong consistency.",
    },

    // CLARIFICATIONS
    {
      id: 'data-sync',
      category: 'clarification',
      question: "How do we keep data synchronized across multiple databases?",
      answer: "Several strategies:\n\n**1. Event-driven sync (recommended)**\n- Order created → publish event\n- MongoDB listener updates catalog\n- Neo4j listener updates graph\n- Eventual consistency (seconds delay)\n\n**2. CDC (Change Data Capture)**\n- Capture PostgreSQL transaction log\n- Replicate changes to other DBs\n- More complex but real-time\n\n**3. Dual writes (avoid)**\n- Write to all 3 DBs in application\n- Error-prone, hard to maintain\n\nWe'll use event-driven sync with message queue.",
      importance: 'important',
      insight: "Event-driven architecture naturally fits multi-model systems",
    },
    {
      id: 'data-duplication',
      category: 'clarification',
      question: "Is it okay to duplicate data across databases?",
      answer: "YES! In multi-model systems, some duplication is NECESSARY:\n\n**Example: Product data**\n- MongoDB: Full product document (catalog)\n- Neo4j: Product ID + name (for graph edges)\n- PostgreSQL: Product ID + price (for orders)\n\n**Why it's okay:**\n- Each DB stores what it needs for its queries\n- Storage is cheap, query performance is expensive\n- Different models need different representations\n\n**The tradeoff:** More storage vs faster queries",
      importance: 'important',
      insight: "Denormalization across models is a feature, not a bug",
    },

    // SCALE & NFRs
    {
      id: 'throughput-scale',
      category: 'throughput',
      question: "What's the expected query volume for each database?",
      answer: "E-commerce has different load patterns:\n\n**MongoDB (Product Catalog):**\n- 100,000 reads/sec (product browsing)\n- 1,000 writes/sec (catalog updates)\n- Read-heavy (100:1)\n\n**Neo4j (Recommendations):**\n- 10,000 graph queries/sec\n- 500 graph updates/sec\n- Expensive traversals\n\n**PostgreSQL (Transactions):**\n- 5,000 order reads/sec\n- 2,000 order writes/sec\n- ACID critical",
      importance: 'critical',
      calculation: {
        formula: "Total: ~115K reads/sec + 3.5K writes/sec",
        result: "Each DB type optimized for its workload",
      },
      learningPoint: "Multi-model allows independent scaling per database type",
    },
    {
      id: 'latency-requirements',
      category: 'latency',
      question: "What are the latency requirements for each type of query?",
      answer: "Different queries, different SLAs:\n\n**Product Catalog (MongoDB):**\n- p99 < 50ms (must be fast for browsing)\n\n**Recommendations (Neo4j):**\n- p99 < 200ms (can be slower, precomputed)\n\n**Order Processing (PostgreSQL):**\n- p99 < 100ms (checkout must feel instant)\n\n**Cross-model queries:**\n- p99 < 300ms (aggregate from multiple DBs)\n- Cache aggressively!",
      importance: 'critical',
      learningPoint: "Different models have different latency characteristics. Design for each.",
    },
    {
      id: 'consistency-tradeoffs',
      category: 'burst',
      question: "What happens if one database lags behind during sync?",
      answer: "This is EXPECTED in multi-model systems:\n\n**Scenario:** User buys product\n1. Order saved to PostgreSQL (instant)\n2. Event published to queue\n3. MongoDB updates in 500ms (catalog sold count)\n4. Neo4j updates in 2sec (purchase graph)\n\n**User experience:**\n- Order confirmed immediately (PostgreSQL)\n- Recommendations slightly stale (acceptable)\n- Product count may be off by 1 (acceptable)\n\n**The key:** Define what needs strong vs eventual consistency",
      importance: 'critical',
      learningPoint: "CAP theorem applies between databases. Accept eventual consistency for non-critical data.",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['data-models', 'query-patterns', 'consistency-requirements'],
  criticalFRQuestionIds: ['data-models', 'query-patterns', 'cross-model-queries'],
  criticalScaleQuestionIds: ['throughput-scale', 'latency-requirements', 'consistency-tradeoffs'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Product Catalog with flexible schema',
      description: 'Store products with varying attributes using document model',
      emoji: '📦',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Product recommendations via graph',
      description: 'Generate recommendations using collaborative filtering on purchase graph',
      emoji: '🔗',
    },
    {
      id: 'fr-3',
      text: 'FR-3: ACID transactions for orders',
      description: 'Process orders with strong consistency and atomicity',
      emoji: '💳',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Cross-model queries',
      description: 'Combine data from document, graph, and relational databases',
      emoji: '🔄',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Data synchronization',
      description: 'Keep data eventually consistent across all database models',
      emoji: '🔁',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million shoppers',
    writesPerDay: '300 million queries',
    readsPerDay: '10 billion page views',
    peakMultiplier: 2,
    readWriteRatio: '30:1',
    calculatedWriteRPS: { average: 3500, peak: 7000 },
    calculatedReadRPS: { average: 115000, peak: 230000 },
    maxPayloadSize: '~10KB product document',
    storagePerRecord: 'Product: ~5KB, Order: ~2KB, Graph edge: ~100 bytes',
    storageGrowthPerYear: '~5TB catalog + 10TB orders + 500GB graph',
    redirectLatencySLA: 'p99 < 50ms (catalog), p99 < 200ms (recommendations)',
    createLatencySLA: 'p99 < 100ms (order processing)',
  },

  architecturalImplications: [
    '✅ Flexible product schema → MongoDB for catalog',
    '✅ Relationship queries → Neo4j for recommendations',
    '✅ ACID requirements → PostgreSQL for transactions',
    '✅ Cross-model queries → Application layer joins + caching',
    '✅ Data sync → Event-driven with message queue',
    '✅ Different consistency models → Strong for orders, eventual for catalog/graph',
  ],

  outOfScope: [
    'Real-time inventory across all models',
    'Distributed transactions (2PC)',
    'Multi-model atomic updates',
    'Search engine integration (Elasticsearch)',
    'Analytics database (data warehouse)',
  ],

  keyInsight: "First, let's make it WORK with polyglot persistence. We'll build separate databases for catalog, recommendations, and transactions. Then we'll tackle the hard part: synchronizing data between them!",
};

// =============================================================================
// STEP 1: Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to ShopFast! You're building the next Amazon.",
  hook: "Your first customer just landed on the homepage. They want to browse products, get recommendations, and place orders!",
  challenge: "Set up the basic infrastructure so users can connect to your e-commerce platform.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your e-commerce platform is online!',
  achievement: 'Users can now connect to your system',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Ready for multi-model data', after: '✓' },
  ],
  nextTeaser: "But we need databases! Different data needs different models...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building Multi-Model Systems',
  conceptExplanation: `E-commerce platforms are COMPLEX - they need different types of data storage:

**The Problem with "One Database Fits All":**
- Relational DB: Great for transactions, BAD for flexible product schemas
- Document DB: Great for catalogs, BAD for complex relationships
- Graph DB: Great for recommendations, BAD for ACID transactions

**The Multi-Model Solution:**
Use the RIGHT database for each use case!

**Our architecture:**
1. MongoDB for product catalog (flexible documents)
2. Neo4j for recommendations (relationship graphs)
3. PostgreSQL for orders (ACID transactions)

This is called **Polyglot Persistence** - using multiple database types in one system.`,

  whyItMatters: 'No single database is optimal for all use cases. Multi-model systems choose the best tool for each job.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Handling products, recommendations, and orders',
    howTheyDoIt: 'Uses DynamoDB (document), Neptune (graph), and Aurora (relational) - each optimized for specific workloads.',
  },

  keyPoints: [
    'E-commerce needs catalog, relationships, and transactions',
    'Different data models excel at different patterns',
    'Polyglot persistence = multiple databases in one system',
    'App Server coordinates across all databases',
  ],

  keyConcepts: [
    { title: 'Polyglot Persistence', explanation: 'Using multiple database types together', icon: '🗄️' },
    { title: 'Multi-Model', explanation: 'Different data models for different use cases', icon: '🎭' },
  ],

  quickCheck: {
    question: 'Why use multiple databases instead of one?',
    options: [
      'To make the system more complex',
      'Each database type is optimized for different query patterns',
      'It costs less',
      'One database is always better',
    ],
    correctIndex: 1,
    explanation: 'Document DBs excel at flexible schemas, Graph DBs at relationships, Relational DBs at transactions. Use the right tool for each job!',
  },
};

const step1: GuidedStep = {
  id: 'multi-model-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for multi-model e-commerce',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents shoppers using the platform', displayName: 'Client' },
      { type: 'app_server', reason: 'Coordinates across multiple databases', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send requests' },
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
    level1: 'Drag Client and App Server from the component palette',
    level2: 'Click and drag from Client to App Server to create a connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Add Document Database for Product Catalog
// =============================================================================

const step2Story: StoryContent = {
  emoji: '📦',
  scenario: "Your product team wants to add products, but they're all DIFFERENT!",
  hook: "Books have ISBN and author. Electronics have voltage and battery. Clothing has size and color. One table schema won't work!",
  challenge: "Add MongoDB for flexible product catalog with varying schemas.",
  illustration: 'product-catalog',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Product catalog is live!',
  achievement: 'MongoDB handles flexible product schemas',
  metrics: [
    { label: 'Database', after: 'MongoDB (Document)' },
    { label: 'Product types', after: 'Unlimited (flexible schema)' },
    { label: 'Query speed', after: '< 50ms' },
  ],
  nextTeaser: "Great! But how do we recommend products to users?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Document Databases for Flexible Schemas',
  conceptExplanation: `**Why MongoDB for Product Catalog?**

**The Problem with Relational DBs:**
\`\`\`sql
CREATE TABLE products (
  id INT,
  name VARCHAR,
  price DECIMAL,
  -- But what about book-specific fields?
  -- What about electronics-specific fields?
  -- Schema explosion! 😱
);
\`\`\`

**The MongoDB Solution:**
\`\`\`json
// Book
{
  "id": "book-1",
  "name": "System Design Book",
  "price": 49.99,
  "isbn": "123-456",
  "author": "Martin Kleppmann",
  "pages": 500
}

// Electronics
{
  "id": "laptop-1",
  "name": "Gaming Laptop",
  "price": 1499.99,
  "specs": {
    "cpu": "i7",
    "ram": "32GB",
    "storage": "1TB SSD"
  },
  "warranty": "2 years"
}
\`\`\`

**Benefits:**
- Each product can have different fields
- Nested objects (specs, dimensions)
- No schema migrations when adding product types
- Fast queries with proper indexes`,

  whyItMatters: 'E-commerce catalogs are heterogeneous. Document databases embrace schema flexibility.',

  realWorldExample: {
    company: 'eBay',
    scenario: 'Storing 1 billion+ products with wildly different attributes',
    howTheyDoIt: 'Uses MongoDB for product catalog. Each category has its own schema, stored as flexible documents.',
  },

  famousIncident: {
    title: 'Target\'s Product Schema Nightmare',
    company: 'Target',
    year: '2015',
    whatHappened: 'Target\'s SQL-based product catalog had 500+ columns to accommodate all product types. Adding new fields required schema migrations that took hours. During a major promotion, a migration failed and locked the entire catalog table, bringing down the site for 4 hours.',
    lessonLearned: 'Flexible schemas prevent schema migration nightmares. Document databases are built for heterogeneous data.',
    icon: '🎯',
  },

  keyPoints: [
    'Document DB stores data as JSON-like documents',
    'Each document can have different fields (schema flexibility)',
    'Nested objects supported (specs, images, variants)',
    'Indexes on any field for fast queries',
  ],

  diagram: `
RELATIONAL (PostgreSQL):
┌─────────────────────────────────────┐
│ products: id, name, price, ...      │
│ book_attrs: isbn, author, pages     │
│ electronics_attrs: cpu, ram, ...    │
└─────────────────────────────────────┘
Problem: JOINs required, schema rigid

DOCUMENT (MongoDB):
┌─────────────────────────────────────┐
│ {id: 1, name: "Book", isbn: "123"} │
│ {id: 2, name: "Laptop", cpu: "i7"} │
│ {id: 3, name: "Shirt", size: "M"}  │
└─────────────────────────────────────┘
Solution: Flexible, self-contained!
`,

  keyConcepts: [
    { title: 'Document', explanation: 'Self-contained JSON-like object', icon: '📄' },
    { title: 'Schema-less', explanation: 'No fixed structure, evolves with data', icon: '🔓' },
    { title: 'Nested Data', explanation: 'Objects within objects (specs, images)', icon: '🪆' },
  ],

  quickCheck: {
    question: 'Why is MongoDB better than PostgreSQL for product catalogs?',
    options: [
      'MongoDB is faster',
      'MongoDB allows different products to have different fields without schema changes',
      'MongoDB is cheaper',
      'PostgreSQL cannot store products',
    ],
    correctIndex: 1,
    explanation: 'MongoDB\'s flexible schema lets each product type have unique fields without rigid table schemas or JOINs.',
  },
};

const step2: GuidedStep = {
  id: 'multi-model-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Product catalog with flexible schema',
    taskDescription: 'Add MongoDB for product catalog',
    componentsNeeded: [
      { type: 'client', reason: 'Users browsing products', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles requests', displayName: 'App Server' },
      { type: 'document_database', reason: 'Stores product catalog', displayName: 'MongoDB' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'User requests' },
      { from: 'App Server', to: 'MongoDB', reason: 'Query product catalog' },
    ],
    successCriteria: [
      'Add MongoDB (Document Database)',
      'Connect App Server to MongoDB',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'document_database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'document_database' },
    ],
  },

  hints: {
    level1: 'Add a Document Database (MongoDB) for the product catalog',
    level2: 'Build: Client → App Server → MongoDB',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'document_database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'document_database' },
    ],
  },
};

// =============================================================================
// STEP 3: Add Graph Database for Recommendations
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🔗',
  scenario: "Product catalog is live! But users want recommendations...",
  hook: "Your data science team wants to show 'Customers who bought X also bought Y'. MongoDB queries for this are IMPOSSIBLY slow!",
  challenge: "Add Neo4j to build a purchase graph for collaborative filtering.",
  illustration: 'recommendations',
};

const step3Celebration: CelebrationContent = {
  emoji: '💡',
  message: 'Recommendations are blazing fast!',
  achievement: 'Neo4j handles collaborative filtering with graph traversals',
  metrics: [
    { label: 'Recommendation query', before: '5000ms (MongoDB)', after: '50ms (Neo4j)' },
    { label: 'Graph traversal', after: '100x faster' },
  ],
  nextTeaser: "Awesome! But we need transactions for checkout...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Graph Databases for Recommendations',
  conceptExplanation: `**The Recommendation Problem:**

Find products that users who bought product A also bought.

**MongoDB approach (slow):**
\`\`\`javascript
// Find users who bought product A
users = db.orders.find({products: "A"})

// For each user, find their other products
recommendations = []
for (user in users) {
  other_products = db.orders.find({
    user_id: user.id,
    products: {$ne: "A"}
  })
  recommendations.push(other_products)
}

// Aggregate and count
// This requires MULTIPLE queries and is O(N²)! 😱
\`\`\`

**Neo4j approach (fast):**
\`\`\`cypher
MATCH (p:Product {id: 'A'})<-[:BOUGHT]-(u:User)-[:BOUGHT]->(rec:Product)
WHERE rec.id <> 'A'
RETURN rec, count(*) as frequency
ORDER BY frequency DESC
LIMIT 10
\`\`\`

**Why Neo4j wins:**
- Relationships are first-class (stored as pointers)
- Traversals are O(1) per hop, not O(N)
- Pattern matching is native to the query language
- 100-1000x faster for multi-hop queries`,

  whyItMatters: 'Recommendation engines are the KILLER app for graph databases. This is why Amazon, Netflix, LinkedIn all use them.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Product recommendations for 300M+ products',
    howTheyDoIt: 'Uses Amazon Neptune (graph database) for collaborative filtering. Pre-computes recommendations using graph algorithms, caches results.',
  },

  famousIncident: {
    title: 'Netflix Prize Graph Epiphany',
    company: 'Netflix',
    year: '2009',
    whatHappened: 'Netflix ran a $1M competition to improve recommendations. The winning team used graph-based collaborative filtering, beating Netflix\'s own relational DB approach by 10%. Netflix then rebuilt their entire recommendation engine on graph databases.',
    lessonLearned: 'Graph databases are purpose-built for relationship queries. Use them for recommendations!',
    icon: '🎬',
  },

  keyPoints: [
    'Recommendations = multi-hop graph traversal',
    'Graph DB stores relationships as direct pointers',
    'Cypher query language for pattern matching',
    'Collaborative filtering is 100x faster on graphs',
  ],

  diagram: `
PURCHASE GRAPH (Neo4j):
┌─────────────────────────────────────┐
│  (User A)-[:BOUGHT]->(Product 1)    │
│      │                    ↑         │
│      └──[:BOUGHT]─→(Product 2)      │
│                          ↑          │
│  (User B)-[:BOUGHT]──────┘          │
│                                     │
│  Query: "Users who bought Product 1 │
│          also bought...?"           │
│  Answer: Product 2 (via graph hop!) │
└─────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'Graph Traversal', explanation: 'Following edges to find related nodes', icon: '🔍' },
    { title: 'Collaborative Filtering', explanation: 'Recommendations based on similar users', icon: '🤝' },
    { title: 'Multi-hop Query', explanation: 'User → Product → User → Product', icon: '🦘' },
  ],

  quickCheck: {
    question: 'Why is Neo4j faster than MongoDB for "users who bought X also bought Y"?',
    options: [
      'Neo4j uses more memory',
      'Neo4j stores relationships as direct pointers, avoiding expensive scans',
      'MongoDB is not a database',
      'Neo4j has better hardware',
    ],
    correctIndex: 1,
    explanation: 'Graph databases store relationships as pointers. Traversing is O(1) per hop. MongoDB requires expensive aggregations across collections.',
  },
};

const step3: GuidedStep = {
  id: 'multi-model-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Product recommendations via graph',
    taskDescription: 'Add Neo4j for recommendation graph',
    componentsNeeded: [
      { type: 'client', reason: 'Users viewing recommendations', displayName: 'Client' },
      { type: 'app_server', reason: 'Coordinates requests', displayName: 'App Server' },
      { type: 'document_database', reason: 'Product catalog', displayName: 'MongoDB' },
      { type: 'graph_database', reason: 'Recommendation graph', displayName: 'Neo4j' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'User requests' },
      { from: 'App Server', to: 'MongoDB', reason: 'Product details' },
      { from: 'App Server', to: 'Neo4j', reason: 'Recommendations' },
    ],
    successCriteria: [
      'Add Neo4j (Graph Database)',
      'Connect App Server to both MongoDB and Neo4j',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'document_database', 'graph_database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'document_database' },
      { fromType: 'app_server', toType: 'graph_database' },
    ],
  },

  hints: {
    level1: 'Add Graph Database (Neo4j) for recommendations',
    level2: 'App Server connects to BOTH MongoDB (catalog) and Neo4j (recommendations)',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'document_database' },
      { type: 'graph_database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'document_database' },
      { from: 'app_server', to: 'graph_database' },
    ],
  },
};

// =============================================================================
// STEP 4: Add Relational Database for Orders
// =============================================================================

const step4Story: StoryContent = {
  emoji: '💳',
  scenario: "Users love the catalog and recommendations! Now they want to BUY.",
  hook: "Your CFO is VERY clear: 'We need PERFECT accuracy for orders and payments. No eventual consistency for money!'",
  challenge: "Add PostgreSQL for ACID transactions on orders and inventory.",
  illustration: 'checkout',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Orders are rock solid!',
  achievement: 'PostgreSQL provides ACID guarantees for transactions',
  metrics: [
    { label: 'Transaction safety', after: 'ACID ✓' },
    { label: 'Order accuracy', after: '100%' },
    { label: 'Consistency', after: 'Strong' },
  ],
  nextTeaser: "Perfect! But now we have 3 databases... how do they sync?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Why Relational Databases for Transactions',
  conceptExplanation: `**The ACID Requirement:**

When a user places an order:
1. Create order record
2. Deduct from inventory
3. Process payment
4. Update order status

**ALL OR NOTHING!** If payment fails, inventory must NOT be deducted.

**MongoDB/Neo4j approach (eventual consistency):**
- No ACID transactions across documents
- Inventory could be wrong for seconds
- Race conditions on popular items
- UNACCEPTABLE for money! 💸

**PostgreSQL approach (ACID):**
\`\`\`sql
BEGIN TRANSACTION;

-- Create order
INSERT INTO orders (user_id, total) VALUES (...);

-- Deduct inventory (with lock!)
UPDATE inventory
SET quantity = quantity - 1
WHERE product_id = 'abc'
  AND quantity > 0;

-- If inventory is 0, this fails and ROLLBACK

COMMIT;
\`\`\`

**ACID Properties:**
- **Atomicity**: All or nothing
- **Consistency**: Constraints enforced
- **Isolation**: Concurrent orders don't conflict
- **Durability**: Committed = permanent

**Why PostgreSQL wins for orders:**
- Guaranteed atomicity
- Row-level locking prevents overselling
- Referential integrity
- Strong consistency (no eventual)`,

  whyItMatters: 'Financial transactions require ACID. Eventual consistency is NOT acceptable for money.',

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Processing billions in payments',
    howTheyDoIt: 'Uses PostgreSQL for all financial transactions. ACID guarantees prevent double-charges, lost money, or inconsistent balances.',
  },

  famousIncident: {
    title: 'Knight Capital Trading Disaster',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'A bug in Knight\'s trading system caused it to execute millions of unintended stock trades. The system used eventual consistency, so different parts had different views of order state. Result: $440 million loss in 45 minutes. Company nearly bankrupt.',
    lessonLearned: 'Financial transactions MUST use ACID databases. Eventual consistency + money = disaster.',
    icon: '💸',
  },

  keyPoints: [
    'ACID = Atomicity, Consistency, Isolation, Durability',
    'Orders require strong consistency, not eventual',
    'Row-level locking prevents race conditions',
    'PostgreSQL guarantees all-or-nothing transactions',
  ],

  diagram: `
ORDER TRANSACTION (PostgreSQL):
┌─────────────────────────────────────┐
│  BEGIN TRANSACTION                  │
│                                     │
│  1. INSERT INTO orders ...          │
│  2. UPDATE inventory SET qty = -1   │
│  3. INSERT INTO payments ...        │
│                                     │
│  If ANY step fails:                 │
│    → ROLLBACK (undo everything)     │
│                                     │
│  If ALL steps succeed:              │
│    → COMMIT (make permanent)        │
│                                     │
│  Isolation: Other transactions      │
│  see locked rows, wait for commit   │
└─────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'ACID', explanation: 'Guarantees for reliable transactions', icon: '🔒' },
    { title: 'Transaction', explanation: 'Group of operations that succeed or fail together', icon: '📦' },
    { title: 'Locking', explanation: 'Prevents concurrent modifications', icon: '🔐' },
  ],

  quickCheck: {
    question: 'Why can\'t we use MongoDB for order transactions?',
    options: [
      'MongoDB is too slow',
      'MongoDB lacks ACID transactions across documents, risking inconsistencies',
      'MongoDB is more expensive',
      'MongoDB cannot store orders',
    ],
    correctIndex: 1,
    explanation: 'MongoDB provides eventual consistency. Orders need ACID guarantees to prevent overselling, double-charges, and data loss.',
  },
};

const step4: GuidedStep = {
  id: 'multi-model-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: ACID transactions for orders',
    taskDescription: 'Add PostgreSQL for order processing',
    componentsNeeded: [
      { type: 'client', reason: 'Users placing orders', displayName: 'Client' },
      { type: 'app_server', reason: 'Orchestrates across DBs', displayName: 'App Server' },
      { type: 'document_database', reason: 'Product catalog', displayName: 'MongoDB' },
      { type: 'graph_database', reason: 'Recommendations', displayName: 'Neo4j' },
      { type: 'database', reason: 'Order transactions', displayName: 'PostgreSQL' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'User requests' },
      { from: 'App Server', to: 'MongoDB', reason: 'Product details' },
      { from: 'App Server', to: 'Neo4j', reason: 'Recommendations' },
      { from: 'App Server', to: 'PostgreSQL', reason: 'Order transactions' },
    ],
    successCriteria: [
      'Add PostgreSQL (Relational Database)',
      'Connect App Server to all 3 databases',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'document_database', 'graph_database', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'document_database' },
      { fromType: 'app_server', toType: 'graph_database' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add Relational Database (PostgreSQL) for orders',
    level2: 'App Server now connects to 3 databases: MongoDB, Neo4j, PostgreSQL',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'document_database' },
      { type: 'graph_database' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'document_database' },
      { from: 'app_server', to: 'graph_database' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Message Queue for Data Synchronization
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔄',
  scenario: "Houston, we have a problem! The databases are out of sync.",
  hook: "User buys a product. PostgreSQL has the order... but MongoDB still shows old stock count! Neo4j doesn't know about the purchase!",
  challenge: "Add a Message Queue to sync data across all three databases.",
  illustration: 'data-sync',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Data synchronization is working!',
  achievement: 'Event-driven architecture keeps all databases eventually consistent',
  metrics: [
    { label: 'Sync strategy', after: 'Event-driven' },
    { label: 'MongoDB sync delay', after: '< 500ms' },
    { label: 'Neo4j sync delay', after: '< 2s' },
  ],
  nextTeaser: "Nice! But what about cross-model queries?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Event-Driven Data Synchronization',
  conceptExplanation: `**The Multi-Model Sync Challenge:**

When user places an order:
1. PostgreSQL creates order (strong consistency) ✓
2. MongoDB needs to update product sold count
3. Neo4j needs to add BOUGHT relationship
4. ALL THREE must eventually reflect the purchase!

**BAD Solution: Dual Writes**
\`\`\`python
# In app code - FRAGILE!
def place_order(user_id, product_id):
    postgres.create_order(...)
    mongo.update_product(...)  # What if this fails?
    neo4j.add_relationship(...)  # What if this fails?
\`\`\`
Problems: Error handling nightmare, all-or-nothing impossible

**GOOD Solution: Event-Driven with Message Queue**
\`\`\`python
def place_order(user_id, product_id):
    # 1. Create order in PostgreSQL (ACID)
    order = postgres.create_order(...)

    # 2. Publish event to queue
    queue.publish('order.created', {
        'order_id': order.id,
        'user_id': user_id,
        'product_id': product_id
    })

# Separate listeners
def mongo_listener():
    event = queue.consume('order.created')
    mongo.increment_sold_count(event.product_id)

def neo4j_listener():
    event = queue.consume('order.created')
    neo4j.create_relationship(
        event.user_id,
        'BOUGHT',
        event.product_id
    )
\`\`\`

**Benefits:**
- PostgreSQL transaction isolated (ACID preserved)
- MongoDB/Neo4j update asynchronously (eventual consistency)
- Retries on failure (queue reliability)
- Decoupled services`,

  whyItMatters: 'Multi-model systems REQUIRE eventual consistency between databases. Message queues provide reliable async sync.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Syncing trip data across 6+ databases',
    howTheyDoIt: 'Uses Apache Kafka to stream events. When trip completes, event triggers updates to analytics DB, billing DB, driver DB, map DB, etc.',
  },

  famousIncident: {
    title: 'Salesforce Data Sync Failure',
    company: 'Salesforce',
    year: '2019',
    whatHappened: 'Salesforce used dual writes to sync data between their main DB and analytics DB. A network partition caused writes to succeed on main DB but fail on analytics DB. For 6 hours, the two databases diverged. Reports showed incorrect data, causing customer confusion.',
    lessonLearned: 'Never use dual writes for multi-database sync. Use event streaming with eventual consistency.',
    icon: '☁️',
  },

  keyPoints: [
    'Event-driven sync = publish events to queue',
    'Listeners consume events and update their DBs',
    'Eventual consistency (seconds delay) is acceptable',
    'Decouples databases for independent scaling',
  ],

  diagram: `
EVENT-DRIVEN SYNC:
┌─────────────────────────────────────┐
│                                     │
│  1. User places order               │
│     ↓                               │
│  2. PostgreSQL creates order        │
│     ↓                               │
│  3. Publish "order.created" event   │
│     ↓                               │
│  ┌────────────┐                     │
│  │Message Queue│                    │
│  └──┬──────┬──┘                     │
│     │      │                        │
│     ▼      ▼                        │
│  Listener Listener                  │
│     │      │                        │
│     ▼      ▼                        │
│  MongoDB Neo4j                      │
│  (update) (update)                  │
│                                     │
│  Eventual consistency achieved!     │
└─────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'Event-Driven', explanation: 'Changes trigger events consumed by listeners', icon: '📡' },
    { title: 'Message Queue', explanation: 'Reliable async communication (Kafka, RabbitMQ)', icon: '📬' },
    { title: 'Eventual Consistency', explanation: 'All databases converge over time', icon: '⏱️' },
  ],

  quickCheck: {
    question: 'Why use a message queue instead of direct DB-to-DB sync?',
    options: [
      'Message queues are faster',
      'Message queues decouple services and provide reliability with retries',
      'Message queues are cheaper',
      'Direct sync is impossible',
    ],
    correctIndex: 1,
    explanation: 'Message queues buffer events, retry on failure, and decouple services. Direct sync creates tight coupling and brittle error handling.',
  },
};

const step5: GuidedStep = {
  id: 'multi-model-step-5',
  stepNumber: 5,
  frIndex: 4,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-5: Data synchronization across models',
    taskDescription: 'Add Message Queue for event-driven sync',
    componentsNeeded: [
      { type: 'client', reason: 'Users', displayName: 'Client' },
      { type: 'app_server', reason: 'Publishes events', displayName: 'App Server' },
      { type: 'document_database', reason: 'Catalog', displayName: 'MongoDB' },
      { type: 'graph_database', reason: 'Recommendations', displayName: 'Neo4j' },
      { type: 'database', reason: 'Orders', displayName: 'PostgreSQL' },
      { type: 'message_queue', reason: 'Event streaming', displayName: 'Kafka' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'User requests' },
      { from: 'App Server', to: 'MongoDB', reason: 'Product queries' },
      { from: 'App Server', to: 'Neo4j', reason: 'Recommendations' },
      { from: 'App Server', to: 'PostgreSQL', reason: 'Orders' },
      { from: 'App Server', to: 'Kafka', reason: 'Publish events' },
      { from: 'Kafka', to: 'MongoDB', reason: 'Sync events' },
      { from: 'Kafka', to: 'Neo4j', reason: 'Sync events' },
    ],
    successCriteria: [
      'Add Message Queue (Kafka)',
      'Connect App Server to Kafka',
      'Connect Kafka to MongoDB and Neo4j',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'document_database', 'graph_database', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'document_database' },
      { fromType: 'app_server', toType: 'graph_database' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'document_database' },
      { fromType: 'message_queue', toType: 'graph_database' },
    ],
  },

  hints: {
    level1: 'Add Message Queue and connect it for event streaming',
    level2: 'Flow: App Server → Kafka → MongoDB/Neo4j for async sync',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'document_database' },
      { type: 'graph_database' },
      { type: 'database' },
      { type: 'message_queue' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'document_database' },
      { from: 'app_server', to: 'graph_database' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'document_database' },
      { from: 'message_queue', to: 'graph_database' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Cache for Cross-Model Queries
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚡',
  scenario: "The product page loads slowly. It needs data from ALL THREE databases!",
  hook: "MongoDB for product → Neo4j for recommendations → PostgreSQL for inventory. Three database queries = 300ms latency!",
  challenge: "Add Redis cache to store pre-computed cross-model query results.",
  illustration: 'slow-query',
};

const step6Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Cross-model queries are lightning fast!',
  achievement: 'Cache eliminates expensive multi-database lookups',
  metrics: [
    { label: 'Product page load', before: '300ms', after: '50ms' },
    { label: 'Cache hit rate', after: '95%' },
    { label: 'DB queries', before: '3 per request', after: '0.15 per request' },
  ],
  nextTeaser: "Almost there! Let's add a final exam...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Caching Cross-Model Query Results',
  conceptExplanation: `**The Cross-Model Query Problem:**

Product Page needs:
1. Product details (MongoDB) - 50ms
2. Recommendations (Neo4j) - 100ms
3. Stock status (PostgreSQL) - 20ms

**Total: 170ms sequential, 100ms parallel**
Still too slow at scale!

**The Caching Solution:**
\`\`\`python
def get_product_page(product_id):
    # Check cache first
    cached = redis.get(f"product_page:{product_id}")
    if cached:
        return cached  # 5ms!

    # Cache miss - query all DBs
    product = mongodb.find_product(product_id)
    recs = neo4j.get_recommendations(product_id)
    stock = postgres.get_inventory(product_id)

    # Combine results
    result = {
        'product': product,
        'recommendations': recs,
        'in_stock': stock > 0
    }

    # Cache for 5 minutes
    redis.setex(f"product_page:{product_id}", 300, result)
    return result
\`\`\`

**Cache Invalidation Strategy:**
1. **Time-based (TTL):** Expire after 5 minutes
2. **Event-based:** Kafka events invalidate cache
   - Product updated → clear product cache
   - Order placed → clear stock cache
   - Purchase made → clear recommendation cache

**Benefits:**
- 95%+ cache hit rate
- Sub-10ms response time
- Reduces load on all 3 databases`,

  whyItMatters: 'Multi-model queries are inherently expensive. Caching is MANDATORY for acceptable performance.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Movie page with metadata + recommendations + availability',
    howTheyDoIt: 'Caches fully-materialized page responses in EVCache (memcached). Each page combines data from 5+ microservices/databases.',
  },

  famousIncident: {
    title: 'Amazon Prime Day Cache Miss',
    company: 'Amazon',
    year: '2018',
    whatHappened: 'Amazon Prime Day started with a cache warming bug. Millions of users hit the site simultaneously, all causing cache misses. The databases couldn\'t handle the load. Site was down for the first hour of the biggest sales event of the year.',
    lessonLearned: 'Pre-warm caches before traffic spikes! Monitor cache hit rates closely.',
    icon: '📦',
  },

  keyPoints: [
    'Cross-model queries query multiple databases',
    'Cache pre-computed results to avoid repeated DB hits',
    'Invalidate cache on data changes (event-based)',
    'TTL prevents stale data from persisting',
  ],

  diagram: `
CROSS-MODEL QUERY WITH CACHE:
┌─────────────────────────────────────┐
│  Request: Product Page              │
│                                     │
│  1. Check Redis cache               │
│     ├─ HIT (95%) → Return (5ms)    │
│     └─ MISS (5%) → Query all DBs   │
│                                     │
│  2. Parallel queries:               │
│     ├─ MongoDB (product)            │
│     ├─ Neo4j (recommendations)      │
│     └─ PostgreSQL (inventory)       │
│                                     │
│  3. Combine results                 │
│  4. Store in Redis (TTL=5min)       │
│  5. Return to user                  │
│                                     │
│  Cache invalidation:                │
│  - Kafka event → clear cache key    │
└─────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'Cross-Model Query', explanation: 'Query spanning multiple database types', icon: '🔗' },
    { title: 'Cache Invalidation', explanation: 'Remove stale data from cache', icon: '🗑️' },
    { title: 'TTL', explanation: 'Time-To-Live: auto-expire after duration', icon: '⏰' },
  ],

  quickCheck: {
    question: 'Why cache cross-model query results instead of individual DB queries?',
    options: [
      'Caching is always faster',
      'Combining results from multiple DBs is expensive; caching the final result avoids all DB hits',
      'Individual queries cannot be cached',
      'Redis can only cache combined results',
    ],
    correctIndex: 1,
    explanation: 'Cross-model queries require multiple DB hits and result combination. Caching the final result avoids ALL DB queries and combination logic.',
  },
};

const step6: GuidedStep = {
  id: 'multi-model-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-4: Optimize cross-model queries with caching',
    taskDescription: 'Add Redis cache for cross-model query results',
    componentsNeeded: [
      { type: 'client', reason: 'Users', displayName: 'Client' },
      { type: 'app_server', reason: 'Orchestrates queries', displayName: 'App Server' },
      { type: 'document_database', reason: 'Catalog', displayName: 'MongoDB' },
      { type: 'graph_database', reason: 'Recommendations', displayName: 'Neo4j' },
      { type: 'database', reason: 'Orders', displayName: 'PostgreSQL' },
      { type: 'message_queue', reason: 'Event sync', displayName: 'Kafka' },
      { type: 'cache', reason: 'Cross-model results', displayName: 'Redis' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'User requests' },
      { from: 'App Server', to: 'Redis', reason: 'Cache lookup' },
      { from: 'App Server', to: 'MongoDB', reason: 'Product queries' },
      { from: 'App Server', to: 'Neo4j', reason: 'Recommendations' },
      { from: 'App Server', to: 'PostgreSQL', reason: 'Orders/inventory' },
      { from: 'App Server', to: 'Kafka', reason: 'Publish events' },
      { from: 'Kafka', to: 'MongoDB', reason: 'Sync' },
      { from: 'Kafka', to: 'Neo4j', reason: 'Sync' },
    ],
    successCriteria: [
      'Add Redis Cache',
      'Connect App Server to Redis (check cache first)',
      'Maintain connections to all 3 databases',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'document_database', 'graph_database', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'document_database' },
      { fromType: 'app_server', toType: 'graph_database' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'document_database' },
      { fromType: 'message_queue', toType: 'graph_database' },
    ],
  },

  hints: {
    level1: 'Add Cache (Redis) for cross-model query results',
    level2: 'App Server checks Redis first, falls back to DBs on cache miss',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'document_database' },
      { type: 'graph_database' },
      { type: 'database' },
      { type: 'message_queue' },
      { type: 'cache' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'document_database' },
      { from: 'app_server', to: 'graph_database' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'document_database' },
      { from: 'message_queue', to: 'graph_database' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const multiModelDatabaseGuidedTutorial: GuidedTutorial = {
  problemId: 'multi-model-database-guided',
  problemTitle: 'Build a Multi-Model Database System',

  requirementsPhase: multiModelRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],

  finalExamTestCases: [
    {
      name: 'Product Catalog Queries',
      type: 'functional',
      requirement: 'FR-1',
      description: 'MongoDB handles flexible product schemas with fast queries',
      traffic: { type: 'read', rps: 10000, readRps: 10000 },
      duration: 30,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.01 },
    },
    {
      name: 'Recommendation Graph Queries',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Neo4j generates recommendations via graph traversal',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 30,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.01 },
    },
    {
      name: 'Order Transactions',
      type: 'functional',
      requirement: 'FR-3',
      description: 'PostgreSQL handles ACID transactions for orders',
      traffic: { type: 'write', rps: 500, writeRps: 500 },
      duration: 30,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0 },
    },
    {
      name: 'Cross-Model Product Page',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Combine product (MongoDB) + recommendations (Neo4j) + stock (PostgreSQL)',
      traffic: { type: 'mixed', rps: 5000, readRps: 5000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'Data Synchronization',
      type: 'functional',
      requirement: 'FR-5',
      description: 'Events sync data across MongoDB, Neo4j, PostgreSQL',
      traffic: { type: 'mixed', rps: 2000, readRps: 1500, writeRps: 500 },
      duration: 60,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-P1: High Throughput',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle peak e-commerce traffic across all databases',
      traffic: { type: 'mixed', rps: 50000, readRps: 45000, writeRps: 5000 },
      duration: 120,
      passCriteria: { maxP99Latency: 150, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-C1: Cache Efficiency',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Achieve >90% cache hit rate to reduce DB load and costs',
      traffic: { type: 'mixed', rps: 20000, readRps: 18000, writeRps: 2000 },
      duration: 60,
      passCriteria: { minCacheHitRate: 0.90, maxMonthlyCost: 8000 },
    },
  ] as TestCase[],
};

export function getMultiModelDatabaseGuidedTutorial(): GuidedTutorial {
  return multiModelDatabaseGuidedTutorial;
}

export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = multiModelRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= multiModelRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
