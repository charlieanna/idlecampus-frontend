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
 * GraphQL Gateway Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches GraphQL gateway concepts
 * while building a unified API layer for microservices.
 *
 * Key Concepts:
 * - Schema stitching and federation
 * - Query batching and optimization
 * - N+1 problem and DataLoader pattern
 * - GraphQL resolver performance
 * - Caching strategies for GraphQL
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-2: Build basic GraphQL gateway - FRs satisfied!
 * Step 3: Add DataLoader to solve N+1 problem
 * Steps 4+: Apply NFRs (caching, batching, performance optimization)
 *
 * Key Pedagogy: First make it WORK, then make it FAST, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const graphqlGatewayRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a GraphQL Gateway that unifies multiple microservices into a single API",

  interviewer: {
    name: 'Alex Rivera',
    role: 'Staff Engineer, Platform Team',
    avatar: '👨‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-operations',
      category: 'functional',
      question: "What's the main problem we're solving with a GraphQL Gateway?",
      answer: "We have multiple backend microservices (Users, Products, Orders, Reviews). Each has its own REST API. Frontend teams have to:\n1. Make multiple API calls to assemble data\n2. Deal with over-fetching (getting too much data)\n3. Deal with under-fetching (making extra requests)\n\nThe GraphQL Gateway provides:\n1. **Single endpoint** for all data\n2. **Flexible queries** - clients ask for exactly what they need\n3. **Schema stitching** - combine multiple services into one unified schema",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "GraphQL Gateway is a facade that unifies microservices behind a single, flexible API",
    },
    {
      id: 'schema-stitching',
      category: 'functional',
      question: "How does the gateway combine schemas from different services?",
      answer: "Each microservice has its own GraphQL schema:\n- User Service: `type User { id, name, email }`\n- Product Service: `type Product { id, title, price }`\n- Review Service: `type Review { id, rating, productId, userId }`\n\nThe Gateway **stitches** these together, allowing queries like:\n```graphql\nquery {\n  product(id: \"123\") {\n    title\n    reviews { rating user { name } }\n  }\n}\n```\nEven though Product, Review, and User live in different services!",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Schema stitching creates relationships across service boundaries",
    },
    {
      id: 'query-batching',
      category: 'functional',
      question: "What happens when a client sends multiple queries at once?",
      answer: "GraphQL supports **query batching** - sending multiple queries in one HTTP request:\n```graphql\n[\n  { query: \"{ user(id: 1) { name } }\" },\n  { query: \"{ product(id: 5) { title } }\" }\n]\n```\nThe gateway should batch these efficiently to avoid overwhelming backend services.",
      importance: 'important',
      revealsRequirement: 'FR-3',
      learningPoint: "Query batching reduces HTTP overhead and improves performance",
    },

    // IMPORTANT - Clarifications
    {
      id: 'n-plus-one',
      category: 'clarification',
      question: "I've heard about the 'N+1 problem' in GraphQL. What is that?",
      answer: "Classic example:\n```graphql\nquery {\n  products(limit: 100) {  # 1 query\n    title\n    reviews { rating }     # 100 queries (one per product)!\n  }\n}\n```\nNaive implementation = 1 query for products + N queries for reviews = 101 queries!\n\n**Solution: DataLoader**\n- Batches requests: `getReviews([id1, id2, ..., id100])`\n- Caches within a single request\n- Reduces 101 queries to just 2 queries",
      importance: 'critical',
      insight: "DataLoader is essential for GraphQL performance - it's not optional at scale",
    },
    {
      id: 'mutations',
      category: 'clarification',
      question: "Do we need to support mutations (writes) or just queries (reads)?",
      answer: "For MVP, focus on **queries only**. Mutations add complexity:\n- Transaction handling across services\n- Cache invalidation\n- Error handling and rollbacks\n\nQueries alone demonstrate the core value of the gateway. We can add mutations in v2.",
      importance: 'important',
      insight: "Starting with read-only queries is a smart way to prove value before adding write complexity",
    },
    {
      id: 'real-time',
      category: 'clarification',
      question: "Should we support GraphQL subscriptions for real-time updates?",
      answer: "Not for MVP. Subscriptions require WebSocket infrastructure and add significant complexity. Focus on HTTP queries first.",
      importance: 'nice-to-have',
      insight: "Subscriptions are powerful but require different infrastructure (WebSockets, pub/sub)",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // 1. THROUGHPUT
    {
      id: 'throughput-queries',
      category: 'throughput',
      question: "How many GraphQL queries per second should we handle?",
      answer: "Peak load: 10,000 queries/second. Each query might touch 2-3 backend services on average.",
      importance: 'critical',
      calculation: {
        formula: "10K queries × 2.5 services = 25K backend requests/sec",
        result: "Need efficient batching and caching to avoid overwhelming backends",
      },
      learningPoint: "Gateway can amplify load on backend services - optimization is critical",
    },
    {
      id: 'throughput-backend',
      category: 'throughput',
      question: "What throughput can our backend microservices handle?",
      answer: "Each service can handle ~2,000 req/sec. We have 4 services (Users, Products, Orders, Reviews).",
      importance: 'critical',
      learningPoint: "Backend capacity limits drive the need for caching and batching at the gateway",
    },

    // 2. LATENCY
    {
      id: 'latency-query',
      category: 'latency',
      question: "What's the acceptable latency for GraphQL queries?",
      answer: "p99 should be under 200ms end-to-end. Users expect fast API responses for web/mobile apps.",
      importance: 'critical',
      learningPoint: "Gateway adds latency - must optimize schema resolution and backend calls",
    },
    {
      id: 'latency-backend',
      category: 'latency',
      question: "How fast are the backend services?",
      answer: "Backend services respond in 20-50ms each. But a complex query might call 5+ services sequentially without optimization!",
      importance: 'important',
      calculation: {
        formula: "5 services × 50ms each = 250ms (exceeds budget!)",
        result: "Need parallel resolution and batching to meet latency SLA",
      },
      learningPoint: "Sequential backend calls kill performance - parallel execution is essential",
    },

    // 3. PAYLOAD
    {
      id: 'payload-query-size',
      category: 'payload',
      question: "How large are typical GraphQL queries?",
      answer: "Most queries are small (< 1KB). Complex queries with deep nesting can reach 5-10KB.",
      importance: 'important',
      learningPoint: "Query size impacts parsing time - set max query depth limits",
    },
    {
      id: 'payload-response-size',
      category: 'payload',
      question: "How large are typical responses?",
      answer: "Varies widely. Product listing: 10-50KB. Single user: 1KB. Deep nested query: 100KB+. That's why GraphQL is valuable - clients get exactly what they need!",
      importance: 'important',
      learningPoint: "Response size variance makes caching strategy complex",
    },

    // 4. AVAILABILITY
    {
      id: 'availability-requirement',
      category: 'availability',
      question: "What happens if a backend service goes down?",
      answer: "Gateway should implement **graceful degradation**. If Review service is down, queries for Products should still work - just return null for reviews field instead of failing the entire query.",
      importance: 'critical',
      insight: "Partial failures should not cascade - GraphQL's error handling supports this well",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-operations', 'schema-stitching', 'n-plus-one'],
  criticalFRQuestionIds: ['core-operations', 'schema-stitching', 'query-batching'],
  criticalScaleQuestionIds: ['throughput-queries', 'latency-query', 'availability-requirement'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Unified GraphQL API',
      description: 'Single endpoint that federates multiple backend services',
      emoji: '🔗',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Schema stitching',
      description: 'Combine schemas from microservices with cross-service relationships',
      emoji: '🧩',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Efficient query resolution',
      description: 'Resolve queries without N+1 problems using DataLoader pattern',
      emoji: '⚡',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1 million API consumers',
    writesPerDay: 'N/A (read-only for MVP)',
    readsPerDay: '100 million queries',
    peakMultiplier: 3,
    readWriteRatio: 'Read-only',
    calculatedWriteRPS: { average: 0, peak: 0 },
    calculatedReadRPS: { average: 1157, peak: 10000 },
    maxPayloadSize: '~10KB query, ~100KB response',
    storagePerRecord: 'Stateless gateway',
    storageGrowthPerYear: 'N/A',
    redirectLatencySLA: 'N/A',
    createLatencySLA: 'p99 < 200ms (query resolution)',
  },

  architecturalImplications: [
    '✅ 10K queries/sec → Need caching layer (Redis)',
    '✅ 25K backend requests/sec → DataLoader batching is critical',
    '✅ p99 < 200ms → Parallel resolver execution required',
    '✅ 4 backend services → Schema federation/stitching layer',
    '✅ Graceful degradation → Circuit breakers for each service',
  ],

  outOfScope: [
    'Mutations (writes) - v2 feature',
    'GraphQL subscriptions (real-time)',
    'Authentication/authorization (assume handled by services)',
    'Schema versioning',
    'Query cost analysis and rate limiting',
  ],

  keyInsight: "First, let's make it WORK. We'll build a basic GraphQL Gateway that can stitch schemas and resolve queries. The complexity of DataLoader, caching, and optimization comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to GraphQL Gateway
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome! You're building a GraphQL Gateway to unify your microservices.",
  hook: "Right now, frontend teams make 5+ REST calls to assemble a product page. Let's give them a single, flexible GraphQL endpoint instead!",
  challenge: "Set up the basic architecture: Client → GraphQL Gateway → Backend Services",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your GraphQL Gateway is connected!",
  achievement: "Clients can now reach your gateway",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Endpoints', after: 'GraphQL Gateway ready' },
  ],
  nextTeaser: "But the gateway doesn't have a schema yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'GraphQL Gateway Architecture',
  conceptExplanation: `A **GraphQL Gateway** sits between clients and backend services.

**Traditional REST approach:**
- Client makes 5 separate calls: GET /users/1, GET /products/5, GET /reviews?productId=5, etc.
- Over-fetching: Each API returns fields you don't need
- Under-fetching: Need multiple round-trips for related data

**GraphQL Gateway approach:**
- Client makes 1 call with exact data needs
- Gateway orchestrates backend calls
- Returns precisely what was requested

**Architecture:**
\`\`\`
Client → GraphQL Gateway → [User Service, Product Service, Review Service]
\`\`\``,
  whyItMatters: 'GraphQL Gateway reduces frontend complexity, improves performance (fewer round-trips), and provides a flexible API that evolves with client needs.',
  keyPoints: [
    'Single GraphQL endpoint replaces many REST endpoints',
    'Gateway orchestrates calls to backend microservices',
    'Clients specify exactly what data they need',
    'Reduces over-fetching and under-fetching',
  ],
  diagram: `
┌──────────┐
│  Client  │
└────┬─────┘
     │ GraphQL Query
     ▼
┌─────────────────┐
│ GraphQL Gateway │
└────┬─────┬──────┘
     │     │
     ▼     ▼
┌────────┐ ┌────────┐
│ Users  │ │Products│
│Service │ │Service │
└────────┘ └────────┘
`,
  keyConcepts: [
    {
      title: 'GraphQL',
      explanation: 'Query language that lets clients request exactly the data they need',
      icon: '🔍',
    },
    {
      title: 'Gateway',
      explanation: 'Central entry point that federates multiple backend services',
      icon: '🚪',
    },
    {
      title: 'Schema',
      explanation: 'Defines what data can be queried and how it relates',
      icon: '📋',
    },
  ],
  quickCheck: {
    question: 'What is the main benefit of a GraphQL Gateway?',
    options: [
      'Faster database queries',
      'Single flexible endpoint instead of many fixed REST APIs',
      'Cheaper infrastructure costs',
      'Built-in authentication',
    ],
    correctIndex: 1,
    explanation: 'GraphQL Gateway provides a single endpoint where clients can query exactly what they need, replacing many rigid REST endpoints with a flexible, client-driven API.',
  },
};

const step1: GuidedStep = {
  id: 'graphql-gateway-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Clients can connect to the GraphQL Gateway',
    taskDescription: 'Add Client and App Server (GraphQL Gateway), then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents frontend applications', displayName: 'Client' },
      { type: 'app_server', reason: 'Your GraphQL Gateway', displayName: 'GraphQL Gateway' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'GraphQL Gateway', reason: 'Clients send GraphQL queries' },
    ],
    successCriteria: ['Add Client', 'Add GraphQL Gateway (App Server)', 'Connect Client → Gateway'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'Drag Client and App Server from the sidebar',
    level2: 'Add both components, then connect Client to App Server (which acts as your GraphQL Gateway)',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement GraphQL Schema and Resolvers
// =============================================================================

const step2Story: StoryContent = {
  emoji: '⚙️',
  scenario: "Your gateway is connected, but it doesn't have a schema!",
  hook: "A client just sent a GraphQL query, but the gateway responded with 'Schema not defined'. We need to configure the GraphQL schema and implement resolvers.",
  challenge: "Define the GraphQL schema and write Python resolvers that fetch data from backend services.",
  illustration: 'configure-server',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Your GraphQL Gateway is functional!",
  achievement: "Clients can now query products and users",
  metrics: [
    { label: 'Schema defined', after: '✓ Product, User types' },
    { label: 'Resolvers implemented', after: '✓ Working' },
  ],
  nextTeaser: "But wait... queries are super slow when fetching related data!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'GraphQL Schema & Resolvers',
  conceptExplanation: `**GraphQL Schema** defines your API's shape:

\`\`\`graphql
type Product {
  id: ID!
  title: String!
  price: Float!
  reviews: [Review!]!
}

type Review {
  id: ID!
  rating: Int!
  userId: ID!
  user: User
}
\`\`\`

**Resolvers** are Python functions that fetch the data:

\`\`\`python
def resolve_product(id):
    # Call Product Service
    return product_service.get_product(id)

def resolve_reviews(product):
    # Call Review Service
    return review_service.get_reviews(product.id)
\`\`\`

**The gateway orchestrates** these calls to assemble the response.`,
  whyItMatters: 'Without schema and resolvers, the gateway is just an empty shell. The schema is your API contract, and resolvers are the implementation.',
  keyPoints: [
    'Schema defines types, fields, and relationships',
    'Resolvers fetch data from backend services',
    'Each field can have its own resolver function',
    'Gateway stitches together data from multiple services',
  ],
  diagram: `
GraphQL Query:
┌─────────────────────────────────┐
│ {                               │
│   product(id: "123") {          │
│     title                       │
│     reviews { rating user }     │
│   }                             │
│ }                               │
└─────────────────────────────────┘
         │
         ▼
    Resolvers:
┌─────────────────────┐
│ resolve_product()   │───▶ Product Service
│ resolve_reviews()   │───▶ Review Service
│ resolve_user()      │───▶ User Service
└─────────────────────┘
`,
  keyConcepts: [
    { title: 'Schema', explanation: 'Contract defining available queries and types', icon: '📜' },
    { title: 'Resolver', explanation: 'Function that fetches data for a field', icon: '🔧' },
    { title: 'Type', explanation: 'Structure of an object (Product, User, Review)', icon: '🏗️' },
  ],
  quickCheck: {
    question: 'What does a GraphQL resolver do?',
    options: [
      'Defines the schema structure',
      'Validates query syntax',
      'Fetches the actual data for a field',
      'Caches query results',
    ],
    correctIndex: 2,
    explanation: 'Resolvers are functions that fetch the actual data for each field in your schema. They might call databases, REST APIs, or other services.',
  },
};

const step2: GuidedStep = {
  id: 'graphql-gateway-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'Gateway must resolve GraphQL queries with schema and resolvers',
    taskDescription: 'Configure GraphQL APIs and implement Python resolvers',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'Client' },
      { type: 'app_server', reason: 'Configure as GraphQL Gateway', displayName: 'GraphQL Gateway' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'GraphQL Gateway', reason: 'Already connected' },
    ],
    successCriteria: [
      'Click on Gateway to open inspector',
      'Assign POST /graphql API',
      'Open Python tab and implement resolvers',
      'Implement resolve_product() and resolve_reviews() functions',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Click Gateway, configure /graphql endpoint, then implement resolvers in Python tab',
    level2: 'After assigning the GraphQL API, switch to Python tab and implement the resolver functions for products and reviews',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Solve the N+1 Problem with DataLoader
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Your gateway works, but performance is terrible!",
  hook: "A query for 100 products with their reviews took 15 seconds! The gateway made 1 call for products, then 100 separate calls for reviews. This is the dreaded N+1 problem!",
  challenge: "Implement DataLoader to batch and cache backend requests within a single query execution.",
  illustration: 'performance-crisis',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "N+1 problem solved!",
  achievement: "DataLoader reduced 101 queries to just 2",
  metrics: [
    { label: 'Query time', before: '15 seconds', after: '200ms' },
    { label: 'Backend calls', before: '101', after: '2' },
    { label: 'Batching', after: '✓ Enabled' },
  ],
  nextTeaser: "Great! But we're still hitting the database for every query...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'The N+1 Problem and DataLoader Pattern',
  conceptExplanation: `**The N+1 Problem:**

Query for products with reviews:
\`\`\`graphql
{
  products(limit: 100) {
    title
    reviews { rating }
  }
}
\`\`\`

**Naive implementation:**
1. Fetch 100 products (1 call)
2. For each product, fetch reviews (100 calls)
3. Total: 101 calls! Disaster!

**DataLoader solution:**
1. Fetch 100 products (1 call)
2. Accumulate all review requests
3. Batch fetch: \`getReviews([id1, id2, ..., id100])\` (1 call)
4. Total: 2 calls!

**How DataLoader works:**
- Batches requests within a single tick (16ms)
- De-duplicates identical requests
- Caches results for the request duration
- Automatically called by GraphQL resolvers`,
  whyItMatters: 'Without DataLoader, GraphQL queries create cascading requests that overwhelm backend services and create terrible latency. DataLoader is not optional - it\'s essential.',
  realWorldExample: {
    company: 'Facebook',
    scenario: 'Invented DataLoader to handle news feed queries',
    howTheyDoIt: 'Every GraphQL resolver uses DataLoader. A news feed query touches hundreds of objects but batches into ~10 backend calls instead of thousands.',
  },
  famousIncident: {
    title: 'Shopify GraphQL N+1 Crisis',
    company: 'Shopify',
    year: '2018',
    whatHappened: 'Early GraphQL API didn\'t use DataLoader. Complex queries made 1000+ database calls and timed out. Stores couldn\'t load product pages during sales.',
    lessonLearned: 'DataLoader is mandatory for production GraphQL. They added automatic batching and query cost analysis to prevent abuse.',
    icon: '🛒',
  },
  keyPoints: [
    'N+1 problem: 1 query for parent + N queries for children',
    'DataLoader batches requests within a tick (16ms)',
    'Caches results for request duration (not across requests)',
    'Reduces backend load by 10-100x',
    'Essential for production GraphQL',
  ],
  diagram: `
WITHOUT DataLoader:
┌────────────────────────┐
│ Get 100 products       │ → 1 call
└────────────────────────┘
         │
         ▼
┌────────────────────────┐
│ Get reviews for id1    │ → 100 calls
│ Get reviews for id2    │   (one per product!)
│ ...                    │
│ Get reviews for id100  │
└────────────────────────┘
Total: 101 calls

WITH DataLoader:
┌────────────────────────┐
│ Get 100 products       │ → 1 call
└────────────────────────┘
         │
         ▼
┌────────────────────────┐
│ Batch get reviews for  │ → 1 call
│ [id1...id100]          │   (batched!)
└────────────────────────┘
Total: 2 calls
`,
  keyConcepts: [
    { title: 'N+1 Problem', explanation: '1 query + N child queries = performance disaster', icon: '💥' },
    { title: 'DataLoader', explanation: 'Batches and caches requests within one query execution', icon: '📦' },
    { title: 'Batching Window', explanation: 'Collects requests for 16ms before executing batch', icon: '⏱️' },
  ],
  quickCheck: {
    question: 'Why does DataLoader batch requests within a 16ms window?',
    options: [
      'To save memory',
      'To collect all related requests from one query execution',
      'To meet latency SLAs',
      'To reduce database connections',
    ],
    correctIndex: 1,
    explanation: 'GraphQL resolvers execute asynchronously. The 16ms window (one tick) allows DataLoader to collect all requests from a single query before batching them together.',
  },
};

const step3: GuidedStep = {
  id: 'graphql-gateway-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Gateway must efficiently resolve nested queries without N+1 problem',
    taskDescription: 'Implement DataLoader pattern in your Python resolvers',
    componentsNeeded: [
      { type: 'client', reason: 'Sends GraphQL queries', displayName: 'Client' },
      { type: 'app_server', reason: 'Implements DataLoader', displayName: 'GraphQL Gateway' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'GraphQL Gateway', reason: 'Query path' },
    ],
    successCriteria: [
      'Update Python code to use DataLoader pattern',
      'Implement batch loading functions',
      'Verify queries now batch backend requests',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Implement DataLoader in the Python tab - batch requests instead of individual calls',
    level2: 'Create a batch_load_reviews() function that takes a list of IDs and returns all reviews in one call',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 4: Add Caching Layer
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐢',
  scenario: "Your gateway is fast with DataLoader, but you're still hitting backend services for every query!",
  hook: "Same queries keep repeating. 'Get product 123' has been called 1000 times in the last minute. We're hammering the Product Service unnecessarily!",
  challenge: "Add a cache layer to store frequently accessed data.",
  illustration: 'slow-database',
};

const step4Celebration: CelebrationContent = {
  emoji: '💨',
  message: "Caching is working!",
  achievement: "95% of queries served from cache",
  metrics: [
    { label: 'Cache hit rate', after: '95%' },
    { label: 'Backend load', before: '10K req/s', after: '500 req/s' },
    { label: 'Avg latency', before: '100ms', after: '10ms' },
  ],
  nextTeaser: "Excellent! But what happens during traffic spikes?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching Strategy for GraphQL',
  conceptExplanation: `**GraphQL caching is different from REST:**

REST: Easy to cache entire responses by URL
- \`GET /products/123\` → cache the response

GraphQL: Same endpoint, different queries!
- \`POST /graphql\` with query A
- \`POST /graphql\` with query B
Can't cache by URL alone!

**Three caching strategies:**

1. **Response caching** (cache entire query results)
   - Key: hash of query + variables
   - Good for identical repeated queries
   - Invalidation is complex

2. **Field-level caching** (cache resolver results)
   - Key: type + id + field name
   - More granular, better hit rate
   - Example: cache \`Product:123:title\`

3. **Dataloader caching** (per-request only)
   - Already have this from Step 3!
   - Prevents duplicate calls within one query
   - Doesn't help across queries

**Best approach: Combine all three!**`,
  whyItMatters: 'Without caching, every GraphQL query hits backend services. With smart caching, 90%+ of queries serve from cache in milliseconds.',
  realWorldExample: {
    company: 'GitHub',
    scenario: 'GraphQL API serves millions of queries/hour',
    howTheyDoIt: 'Multi-layer caching: CDN for public data, Redis for field-level cache, DataLoader for per-request batching. Cache hit rate > 90%.',
  },
  keyPoints: [
    'Can\'t cache GraphQL by URL - same endpoint, different queries',
    'Field-level caching: cache individual resolver results',
    'Response caching: cache complete query results',
    'TTL strategy: short TTL (60s) for mutable data, long (1hr+) for stable data',
    'Cache invalidation: hardest problem in GraphQL!',
  ],
  diagram: `
Query Flow with Caching:

┌──────────────┐
│GraphQL Query │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│Response Cache│ ← Check full query result
└──────┬───────┘
       │ miss
       ▼
┌──────────────┐
│   Resolver   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Field Cache  │ ← Check Product:123:title
│   (Redis)    │
└──────┬───────┘
       │ miss
       ▼
┌──────────────┐
│  DataLoader  │ ← Batch backend calls
└──────┬───────┘
       │
       ▼
┌──────────────┐
│Backend Service│
└──────────────┘
`,
  keyConcepts: [
    { title: 'Field Cache', explanation: 'Cache individual field results by type+id+field', icon: '🔑' },
    { title: 'Response Cache', explanation: 'Cache entire query result by query hash', icon: '📦' },
    { title: 'Cache Key', explanation: 'Unique identifier for cached data', icon: '🏷️' },
  ],
  quickCheck: {
    question: 'Why can\'t we cache GraphQL queries by URL like REST APIs?',
    options: [
      'GraphQL doesn\'t use URLs',
      'All GraphQL queries go to the same POST /graphql endpoint',
      'GraphQL responses are too large to cache',
      'Caching breaks schema stitching',
    ],
    correctIndex: 1,
    explanation: 'GraphQL uses a single endpoint (POST /graphql) for all queries. The query itself is in the POST body, so we must cache by query hash, not URL.',
  },
};

const step4: GuidedStep = {
  id: 'graphql-gateway-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Gateway must cache frequently accessed data',
    taskDescription: 'Add Redis cache and implement field-level caching',
    componentsNeeded: [
      { type: 'client', reason: 'Sends queries', displayName: 'Client' },
      { type: 'app_server', reason: 'Gateway with caching', displayName: 'GraphQL Gateway' },
      { type: 'cache', reason: 'Redis for field-level cache', displayName: 'Cache (Redis)' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'GraphQL Gateway', reason: 'Query path' },
      { from: 'GraphQL Gateway', to: 'Cache', reason: 'Cache resolver results' },
    ],
    successCriteria: [
      'Add Cache (Redis) component',
      'Connect Gateway to Cache',
      'Update resolvers to check cache before backend calls',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Add a Cache component and connect the Gateway to it',
    level2: 'Add Redis cache, connect Gateway → Cache, then update Python code to check cache before backend calls',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Database for Schema Registry
// =============================================================================

const step5Story: StoryContent = {
  emoji: '💾',
  scenario: "Your gateway is fast, but the schema is hardcoded in the application!",
  hook: "Every time a backend service updates its schema, you have to restart the gateway. Not scalable! We need a schema registry to store and version schemas.",
  challenge: "Add a database to store service schemas and enable dynamic schema stitching.",
  illustration: 'data-persistence',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Schema registry is live!",
  achievement: "Schemas are now versioned and dynamically loaded",
  metrics: [
    { label: 'Schema storage', after: 'PostgreSQL' },
    { label: 'Dynamic schema loading', after: '✓ Enabled' },
    { label: 'Schema versions', after: 'Tracked' },
  ],
  nextTeaser: "Perfect! But what happens when traffic spikes?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Schema Registry and Federation',
  conceptExplanation: `**Problem with hardcoded schemas:**
- Gateway code has schema definitions embedded
- Backend service changes → Gateway restart required
- No versioning or rollback capability
- No schema validation on service deployment

**Schema Registry solution:**
Store schemas in a database:
\`\`\`
schemas table:
- service_name: "product-service"
- schema_version: "v2.3"
- schema_definition: "type Product { ... }"
- created_at: timestamp
\`\`\`

**Schema Federation:**
1. Each service publishes its schema to registry
2. Gateway fetches all schemas on startup
3. Gateway stitches schemas together
4. Gateway can hot-reload schemas without restart

**Benefits:**
- Schema versioning and rollback
- Validate schema changes before deployment
- Gradual rollout of schema changes
- Central source of truth`,
  whyItMatters: 'Schema registry enables teams to evolve their APIs independently without coordinating gateway deployments. Essential for microservices at scale.',
  realWorldExample: {
    company: 'Netflix',
    scenario: 'Hundreds of microservices with GraphQL APIs',
    howTheyDoIt: 'Uses Apollo Federation. Each service owns its schema, publishes to registry. Gateway automatically picks up changes and restitches the unified schema.',
  },
  keyPoints: [
    'Schema registry stores all service schemas',
    'Enables versioning and rollback',
    'Gateway dynamically loads and stitches schemas',
    'Services can evolve schemas independently',
  ],
  diagram: `
Schema Registry Flow:

┌───────────────┐
│Product Service│
└───────┬───────┘
        │ 1. Publish schema
        ▼
┌───────────────┐
│   Database    │ ← Schema Registry
│ (PostgreSQL)  │
└───────┬───────┘
        │ 2. Fetch all schemas
        ▼
┌───────────────┐
│GraphQL Gateway│ ← 3. Stitch schemas
└───────┬───────┘
        │ 4. Serve unified API
        ▼
┌───────────────┐
│    Client     │
└───────────────┘
`,
  keyConcepts: [
    { title: 'Schema Registry', explanation: 'Central store for all service schemas', icon: '📚' },
    { title: 'Federation', explanation: 'Multiple services compose one unified schema', icon: '🔗' },
    { title: 'Hot Reload', explanation: 'Update schema without restarting gateway', icon: '🔄' },
  ],
  quickCheck: {
    question: 'What is the main benefit of a schema registry?',
    options: [
      'Faster query execution',
      'Services can update schemas without gateway restarts',
      'Reduced memory usage',
      'Better security',
    ],
    correctIndex: 1,
    explanation: 'Schema registry allows services to evolve their schemas independently. The gateway dynamically loads new schemas without requiring code changes or restarts.',
  },
};

const step5: GuidedStep = {
  id: 'graphql-gateway-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'Gateway must dynamically load and version schemas',
    taskDescription: 'Add database for schema registry',
    componentsNeeded: [
      { type: 'client', reason: 'Sends queries', displayName: 'Client' },
      { type: 'app_server', reason: 'Gateway', displayName: 'GraphQL Gateway' },
      { type: 'cache', reason: 'Redis cache', displayName: 'Cache' },
      { type: 'database', reason: 'Schema registry', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'GraphQL Gateway', reason: 'Query path' },
      { from: 'GraphQL Gateway', to: 'Cache', reason: 'Cache results' },
      { from: 'GraphQL Gateway', to: 'Database', reason: 'Load schemas' },
    ],
    successCriteria: [
      'Add Database component',
      'Connect Gateway to Database',
      'Gateway can load schemas from DB',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add a Database and connect the Gateway to it for schema storage',
    level2: 'Add PostgreSQL database, connect Gateway → Database for schema registry',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'cache' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Load Balancer for High Availability
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📈',
  scenario: "Traffic is spiking! Black Friday sale just started.",
  hook: "Your single gateway instance can handle 2K queries/sec, but you're getting 10K! Queries are timing out. Customers can't browse products!",
  challenge: "Add a load balancer and scale the gateway horizontally.",
  illustration: 'traffic-spike',
};

const step6Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Gateway is now horizontally scalable!",
  achievement: "Can handle 10K+ queries/second",
  metrics: [
    { label: 'Capacity', before: '2K req/s', after: '10K+ req/s' },
    { label: 'Availability', before: '99%', after: '99.9%' },
    { label: 'Gateway instances', before: '1', after: 'Auto-scaling' },
  ],
  nextTeaser: "Great! But what if a backend service goes down?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing and Horizontal Scaling',
  conceptExplanation: `**Problem: Single gateway instance limits throughput**
- One instance handles ~2K queries/sec
- Need 10K queries/sec during peak
- Single point of failure

**Solution: Load Balancer + Multiple Instances**

Load Balancer distributes queries across N gateway instances:
- Round-robin: equal distribution
- Least connections: send to least busy
- IP hash: same client → same instance

**Why this works for GraphQL:**
- Gateways are stateless (cache is external)
- DataLoader cache is per-request anyway
- Any instance can handle any query
- Horizontal scaling = linear capacity increase

**Auto-scaling:**
- Monitor CPU/memory metrics
- Scale out when utilization > 70%
- Scale in when utilization < 30%
- Typical: 3-10 instances running`,
  whyItMatters: 'Single gateway instance = single point of failure and capacity bottleneck. Load balancer enables both high availability and horizontal scaling.',
  realWorldExample: {
    company: 'Shopify',
    scenario: 'Black Friday traffic spikes 10x',
    howTheyDoIt: 'Auto-scales GraphQL gateways from 50 instances to 500+ during peak. Load balancer distributes across availability zones.',
  },
  keyPoints: [
    'Load balancer distributes traffic across gateway instances',
    'Gateways are stateless - easy to scale horizontally',
    'Auto-scaling adjusts instance count based on load',
    'Health checks remove failed instances automatically',
  ],
  diagram: `
                    ┌────────────┐
                    │   Client   │
                    └─────┬──────┘
                          │
                          ▼
                  ┌───────────────┐
                  │Load Balancer  │
                  └───────┬───────┘
                ┌─────────┼─────────┐
                │         │         │
                ▼         ▼         ▼
          ┌─────────┬─────────┬─────────┐
          │Gateway 1│Gateway 2│Gateway 3│
          └────┬────┴────┬────┴────┬────┘
               │         │         │
               └─────────┼─────────┘
                         ▼
                  ┌─────────────┐
                  │Cache + DB   │
                  └─────────────┘
`,
  keyConcepts: [
    { title: 'Horizontal Scaling', explanation: 'Add more instances to increase capacity', icon: '📊' },
    { title: 'Stateless', explanation: 'No local state = any instance can handle any request', icon: '🔄' },
    { title: 'Health Check', explanation: 'LB removes failed instances from rotation', icon: '💓' },
  ],
  quickCheck: {
    question: 'Why can GraphQL gateways scale horizontally easily?',
    options: [
      'They use fast databases',
      'They are stateless - cache and DB are external',
      'GraphQL queries are small',
      'Load balancers are very fast',
    ],
    correctIndex: 1,
    explanation: 'Gateway instances are stateless - they don\'t store data locally. Cache and database are external, shared resources. Any instance can handle any query, making horizontal scaling simple.',
  },
};

const step6: GuidedStep = {
  id: 'graphql-gateway-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'System must handle 10K queries/second with high availability',
    taskDescription: 'Add load balancer and configure for multiple gateway instances',
    componentsNeeded: [
      { type: 'client', reason: 'Sends queries', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Gateway instances', displayName: 'GraphQL Gateway' },
      { type: 'cache', reason: 'Shared cache', displayName: 'Cache' },
      { type: 'database', reason: 'Schema registry', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'All traffic through LB' },
      { from: 'Load Balancer', to: 'GraphQL Gateway', reason: 'LB distributes queries' },
      { from: 'GraphQL Gateway', to: 'Cache', reason: 'Shared cache' },
      { from: 'GraphQL Gateway', to: 'Database', reason: 'Schema registry' },
    ],
    successCriteria: [
      'Add Load Balancer',
      'Connect Client → LB → Gateway',
      'Configure multiple gateway instances',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add Load Balancer between Client and Gateway',
    level2: 'Insert Load Balancer in the path: Client → LB → Gateway → Cache/DB',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Circuit Breaker for Graceful Degradation
// =============================================================================

const step7Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! The Review Service just crashed.",
  hook: "Every query that tries to fetch reviews is timing out! The gateway is getting overwhelmed. Queries that don't even need reviews are failing because the gateway keeps trying to call the dead service!",
  challenge: "Implement circuit breaker pattern to fail fast and degrade gracefully when backend services are down.",
  illustration: 'service-failure',
};

const step7Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "Circuit breakers protect your gateway!",
  achievement: "Graceful degradation when services fail",
  metrics: [
    { label: 'Failed service impact', before: 'Cascading failures', after: 'Isolated' },
    { label: 'Query success rate', before: '0%', after: '80% (partial data)' },
    { label: 'Response time', before: '30s timeouts', after: '200ms with nulls' },
  ],
  nextTeaser: "Excellent! Now let's add query batching for efficiency...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Circuit Breaker Pattern and Graceful Degradation',
  conceptExplanation: `**Problem: Cascading Failures**
When Review Service is down:
1. Gateway tries to call it → timeout (30s)
2. While waiting, gateway can't process other queries
3. Requests pile up, gateway overwhelms
4. Entire system goes down!

**Circuit Breaker Pattern:**
Like an electrical circuit breaker - opens when too many failures.

**Three states:**
1. **CLOSED** (normal): Requests go through
2. **OPEN** (failing): Fail fast, return error immediately
3. **HALF-OPEN** (testing): Allow one request to test if service recovered

**State transitions:**
- CLOSED → OPEN: After 5 failures in 10 seconds
- OPEN → HALF-OPEN: After 30 second timeout
- HALF-OPEN → CLOSED: If test request succeeds
- HALF-OPEN → OPEN: If test request fails

**Graceful degradation in GraphQL:**
Review Service down? Return:
\`\`\`graphql
{
  product(id: "123") {
    title: "Great Product"
    price: 29.99
    reviews: null  # Service down, but query succeeds!
  }
}
\`\`\``,
  whyItMatters: 'Circuit breakers prevent one failing service from taking down the entire gateway. Graceful degradation keeps core features working even when auxiliary services fail.',
  realWorldExample: {
    company: 'Netflix',
    scenario: 'One of hundreds of microservices fails',
    howTheyDoIt: 'Hystrix circuit breakers on every service call. If recommendations service fails, you still get search and playback - just no personalized suggestions.',
  },
  famousIncident: {
    title: 'AWS DynamoDB Cascade',
    company: 'Amazon',
    year: '2015',
    whatHappened: 'DynamoDB had issues in US-East. Services without circuit breakers kept retrying, creating a "retry storm" that made the outage worse. Services with circuit breakers degraded gracefully.',
    lessonLearned: 'Circuit breakers are not optional in distributed systems. Fail fast is better than retry storm.',
    icon: '⚡',
  },
  keyPoints: [
    'Circuit breaker prevents cascading failures',
    'Three states: CLOSED, OPEN, HALF-OPEN',
    'Fail fast when service is known to be down',
    'GraphQL can return partial results (some fields null)',
    'Essential for microservices architecture',
  ],
  diagram: `
Circuit Breaker States:

     ┌──────────┐
     │  CLOSED  │ ← Normal operation
     └────┬─────┘
          │ 5 failures in 10s
          ▼
     ┌──────────┐
     │   OPEN   │ ← Fail fast, don't call service
     └────┬─────┘
          │ After 30s timeout
          ▼
  ┌──────────────┐
  │  HALF-OPEN   │ ← Test if service recovered
  └──┬───────┬───┘
     │       │
 Success    Fail
     │       │
     ▼       ▼
  CLOSED   OPEN

GraphQL Graceful Degradation:
{
  product { ✓ title, ✓ price }
  reviews { ✗ null - service down }
} → Query succeeds with partial data!
`,
  keyConcepts: [
    { title: 'Circuit Breaker', explanation: 'Fail fast when service is known to be down', icon: '🔌' },
    { title: 'Graceful Degradation', explanation: 'Return partial results instead of total failure', icon: '🛡️' },
    { title: 'Fail Fast', explanation: 'Return error immediately instead of waiting for timeout', icon: '⚡' },
  ],
  quickCheck: {
    question: 'What happens when a circuit breaker is OPEN?',
    options: [
      'Requests are queued until service recovers',
      'Requests fail immediately without calling the service',
      'Requests are retried 3 times',
      'Gateway shuts down',
    ],
    correctIndex: 1,
    explanation: 'When OPEN, the circuit breaker fails requests immediately without calling the service. This prevents wasting time on timeouts and allows the gateway to respond quickly with partial data.',
  },
};

const step7: GuidedStep = {
  id: 'graphql-gateway-step-7',
  stepNumber: 7,
  frIndex: 5,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'Gateway must handle backend service failures gracefully',
    taskDescription: 'Implement circuit breaker pattern in gateway code',
    componentsNeeded: [
      { type: 'client', reason: 'Sends queries', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Gateway with circuit breakers', displayName: 'GraphQL Gateway' },
      { type: 'cache', reason: 'Shared cache', displayName: 'Cache' },
      { type: 'database', reason: 'Schema registry', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Query path' },
      { from: 'Load Balancer', to: 'GraphQL Gateway', reason: 'Distributed queries' },
      { from: 'GraphQL Gateway', to: 'Cache', reason: 'Cache results' },
      { from: 'GraphQL Gateway', to: 'Database', reason: 'Schema registry' },
    ],
    successCriteria: [
      'Update Python code to add circuit breaker logic',
      'Implement state machine (CLOSED/OPEN/HALF-OPEN)',
      'Return null for fields when circuit is open',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Implement circuit breaker in Python code - track failures per service',
    level2: 'Add a CircuitBreaker class that tracks state (CLOSED/OPEN/HALF-OPEN) and failure counts per backend service',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 8: Optimize with Query Batching
// =============================================================================

const step8Story: StoryContent = {
  emoji: '📦',
  scenario: "Your mobile app is sending 5 separate GraphQL queries on page load!",
  hook: "That's 5 HTTP requests with 5 round-trips. On 3G networks, each round-trip adds 100ms+ latency. Page load takes 500ms+ just from network overhead!",
  challenge: "Implement query batching to combine multiple queries into one HTTP request.",
  illustration: 'network-latency',
};

const step8Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Query batching is working!",
  achievement: "5 requests reduced to 1",
  metrics: [
    { label: 'HTTP requests', before: '5', after: '1' },
    { label: 'Page load time', before: '500ms', after: '150ms' },
    { label: 'Network overhead', before: '5× RTT', after: '1× RTT' },
  ],
  nextTeaser: "Amazing! One final step: let's make sure the system is production-ready...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Query Batching for Performance',
  conceptExplanation: `**Problem: Multiple queries = Multiple round-trips**

Mobile app loads product page:
\`\`\`
Query 1: Get product details
Query 2: Get reviews
Query 3: Get related products
Query 4: Get user cart
Query 5: Get recommendations
\`\`\`

Without batching: 5 HTTP requests
- Each has 50-200ms network latency
- Total: 250-1000ms just for round-trips!

**Query Batching Solution:**

Send all 5 queries in one request:
\`\`\`json
[
  { "query": "{ product(id: 123) { ... } }" },
  { "query": "{ reviews(productId: 123) { ... } }" },
  { "query": "{ relatedProducts { ... } }" },
  { "query": "{ cart { ... } }" },
  { "query": "{ recommendations { ... } }" }
]
\`\`\`

Gateway processes all 5 and returns batched response.

**Benefits:**
- 1 round-trip instead of 5
- Can execute queries in parallel on gateway
- Reduces network overhead by 80%+
- Critical for mobile/slow networks`,
  whyItMatters: 'Network latency (round-trip time) often dominates API response time. Query batching reduces round-trips, making APIs feel instant even on slow networks.',
  realWorldExample: {
    company: 'Facebook',
    scenario: 'Mobile app on 3G network',
    howTheyDoIt: 'Automatic query batching in mobile SDKs. Newsfeed page makes 10+ data requests but sends as 1 batched query. Critical for performance in emerging markets.',
  },
  keyPoints: [
    'Batching combines multiple queries into one HTTP request',
    'Reduces network round-trips (biggest latency source)',
    'Gateway can execute batched queries in parallel',
    'Essential for mobile apps and slow networks',
    'GraphQL spec supports batching natively',
  ],
  diagram: `
WITHOUT Batching:
┌────────┐    ┌────────┐    ┌────────┐
│Query 1 │───▶│  RTT   │───▶│Gateway │
└────────┘    └────────┘    └────────┘
                100ms         50ms
┌────────┐    ┌────────┐    ┌────────┐
│Query 2 │───▶│  RTT   │───▶│Gateway │
└────────┘    └────────┘    └────────┘
Total: 5 queries × 150ms = 750ms

WITH Batching:
┌────────────────┐   ┌────────┐   ┌────────┐
│ 5 queries      │──▶│  RTT   │──▶│Gateway │
│ in 1 request   │   └────────┘   │parallel│
└────────────────┘     100ms      │  exec  │
                                  └────────┘
Total: 1 RTT + 50ms = 150ms
`,
  keyConcepts: [
    { title: 'Query Batching', explanation: 'Combine multiple queries in one HTTP request', icon: '📦' },
    { title: 'Round-Trip Time', explanation: 'Network latency for request + response', icon: '🔄' },
    { title: 'Parallel Execution', explanation: 'Gateway executes batched queries concurrently', icon: '⚡' },
  ],
  quickCheck: {
    question: 'Why does query batching improve performance?',
    options: [
      'Queries execute faster on the server',
      'Database queries are optimized',
      'Reduces network round-trips which are often the biggest latency source',
      'Caching works better',
    ],
    correctIndex: 2,
    explanation: 'Network round-trip time (RTT) is often 50-200ms per request. Batching reduces 5 round-trips (250-1000ms) to 1 round-trip (50-200ms) - a huge win!',
  },
};

const step8: GuidedStep = {
  id: 'graphql-gateway-step-8',
  stepNumber: 8,
  frIndex: 6,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'Gateway must support query batching for performance',
    taskDescription: 'Implement batched query execution in gateway',
    componentsNeeded: [
      { type: 'client', reason: 'Sends batched queries', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Routes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Processes batched queries', displayName: 'GraphQL Gateway' },
      { type: 'cache', reason: 'Shared cache', displayName: 'Cache' },
      { type: 'database', reason: 'Schema registry', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Batched requests' },
      { from: 'Load Balancer', to: 'GraphQL Gateway', reason: 'Distributed queries' },
      { from: 'GraphQL Gateway', to: 'Cache', reason: 'Cache results' },
      { from: 'GraphQL Gateway', to: 'Database', reason: 'Schema registry' },
    ],
    successCriteria: [
      'Update Python code to accept array of queries',
      'Execute queries in parallel',
      'Return batched response array',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Update Python code to accept an array of queries and execute them in parallel',
    level2: 'Modify the GraphQL handler to detect batched requests (array input) and use asyncio to execute queries concurrently',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const graphqlGatewayGuidedTutorial: GuidedTutorial = {
  problemId: 'graphql-gateway-guided',
  problemTitle: 'Build a GraphQL Gateway - Schema Stitching & Performance',

  requirementsPhase: graphqlGatewayRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Final exam test cases
  finalExamTestCases: [
    {
      name: 'Basic Query Resolution',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Gateway can resolve basic GraphQL queries',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Schema Stitching',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Gateway can stitch schemas and resolve cross-service queries',
      traffic: { type: 'read', rps: 200, readRps: 200 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'DataLoader Efficiency',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Nested queries use DataLoader to avoid N+1 problem',
      traffic: { type: 'read', rps: 500, readRps: 500 },
      duration: 60,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-P1: High Throughput',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 10,000 queries/sec with p99 < 200ms',
      traffic: { type: 'read', rps: 10000, readRps: 10000 },
      duration: 60,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-C1: Cache Efficiency',
      type: 'performance',
      requirement: 'NFR-C1',
      description: 'Achieve 90%+ cache hit rate for repeated queries',
      traffic: { type: 'read', rps: 5000, readRps: 5000 },
      duration: 60,
      passCriteria: { minCacheHitRate: 0.90, maxP99Latency: 100 },
    },
    {
      name: 'NFR-R1: Graceful Degradation',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Return partial results when backend service fails',
      traffic: { type: 'read', rps: 2000, readRps: 2000 },
      duration: 90,
      failureInjection: { type: 'service_crash', atSecond: 30, recoverySecond: 60 },
      passCriteria: { minAvailability: 0.95, maxErrorRate: 0.20 },
    },
    {
      name: 'NFR-B1: Query Batching',
      type: 'performance',
      requirement: 'NFR-B1',
      description: 'Support batched queries to reduce network overhead',
      traffic: { type: 'read', rps: 3000, readRps: 3000 },
      duration: 60,
      passCriteria: { maxP99Latency: 250, maxErrorRate: 0.01 },
    },
  ] as TestCase[],
};

export function getGraphqlGatewayGuidedTutorial(): GuidedTutorial {
  return graphqlGatewayGuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = graphqlGatewayRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= graphqlGatewayRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
