import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * GraphQL Federation Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches GraphQL Federation concepts
 * while building a federated microservices architecture. Each step tells a story that motivates the task.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic federated schema - FRs satisfied!
 * Steps 4+: Apply NFRs (gateway optimization, schema composition, type references, etc.)
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const graphqlFederationRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design Netflix's federated GraphQL platform that unifies 1000 microservices into a single API",

  interviewer: {
    name: 'Morgan Taylor',
    role: 'Principal Engineer',
    avatar: '👨‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-federated-schema',
      category: 'functional',
      question: "We have separate teams managing Users, Products, and Orders. How should they expose their data through GraphQL?",
      answer: "Each team should own their own GraphQL subgraph:\n1. **Users Service**: Manages user profiles, authentication\n2. **Products Service**: Manages product catalog, inventory\n3. **Orders Service**: Manages order history, checkout\n\nEach service exposes its own GraphQL schema, and clients query through a unified gateway that combines all schemas into one.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Federation allows teams to own their domain's schema independently",
    },
    {
      id: 'cross-service-references',
      category: 'functional',
      question: "What happens when the Orders service needs to show user details? Orders reference users by ID, but user data lives in a different service.",
      answer: "This is where type references shine! The Orders service can extend the User type to add order-specific fields:\n\n```graphql\ntype User @key(fields: \"id\") {\n  id: ID!\n  orders: [Order!]!\n}\n```\n\nThe gateway automatically resolves cross-service references, fetching user data from Users service and order data from Orders service.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Federation enables type extensions across service boundaries",
    },
    {
      id: 'unified-client-experience',
      category: 'functional',
      question: "Can clients query data from multiple services in a single request?",
      answer: "Yes! That's the power of federation. A client can write one GraphQL query that spans multiple services:\n\n```graphql\nquery {\n  user(id: \"123\") {\n    name           # from Users service\n    orders {       # from Orders service\n      product {    # from Products service\n        name\n      }\n    }\n  }\n}\n```\n\nThe gateway handles routing and composition automatically.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Gateway composition provides a unified API for clients",
    },

    // IMPORTANT - Clarifications
    {
      id: 'schema-ownership',
      category: 'clarification',
      question: "Who owns which parts of the schema? Can multiple services define the same type?",
      answer: "One service owns the base type definition (the 'origin'), but other services can extend it:\n- **Users Service** owns `type User` base definition\n- **Orders Service** can extend with `extend type User { orders: [Order!]! }`\n- **Products Service** could extend with `extend type User { wishlist: [Product!]! }`\n\nThis allows distributed ownership while maintaining type safety.",
      importance: 'important',
      insight: "Federation's @key directive enables type ownership and extension",
    },
    {
      id: 'gateway-composition',
      category: 'clarification',
      question: "How does the gateway know how to combine schemas from different services?",
      answer: "The gateway performs schema composition at startup:\n1. Fetches SDL (Schema Definition Language) from each subgraph\n2. Validates that type extensions match base types\n3. Builds a unified supergraph schema\n4. Plans query execution across services\n\nThis happens automatically - the gateway handles all the complexity!",
      importance: 'important',
      insight: "Gateway composition is automatic but requires schema coordination",
    },
    {
      id: 'entity-resolution',
      category: 'clarification',
      question: "How does a service resolve references to entities it doesn't own?",
      answer: "Services implement reference resolvers:\n\n```python\ndef resolve_reference(representation):\n  if representation['__typename'] == 'User':\n    return fetch_user(representation['id'])\n```\n\nWhen the gateway needs to resolve a User reference, it calls the Users service's reference resolver with the user ID.",
      importance: 'important',
      insight: "Reference resolvers enable cross-service entity fetching",
    },

    // SCOPE
    {
      id: 'scope-service-count',
      category: 'scope',
      question: "How many services should we start with?",
      answer: "Let's start with 3 core services: Users, Products, and Orders. This demonstrates the key federation patterns without overwhelming complexity. We can add more services later as needed.",
      importance: 'nice-to-have',
      insight: "Start small with core domains, expand incrementally",
    },
    {
      id: 'scope-subscriptions',
      category: 'scope',
      question: "Do we need GraphQL subscriptions for real-time updates?",
      answer: "Not for the MVP. We'll focus on queries and mutations first. Subscriptions across federated services add complexity - good to defer for v2.",
      importance: 'nice-to-have',
      insight: "Federated subscriptions require additional infrastructure",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-federated-schema', 'cross-service-references', 'unified-client-experience'],
  criticalFRQuestionIds: ['core-federated-schema', 'cross-service-references', 'unified-client-experience'],
  criticalScaleQuestionIds: [],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Independent subgraph schemas',
      description: 'Each service owns and manages its own GraphQL schema independently',
      emoji: '🧩',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Cross-service type references',
      description: 'Services can extend types from other services and reference entities across boundaries',
      emoji: '🔗',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Unified gateway composition',
      description: 'Gateway composes all subgraphs into a single unified schema for clients',
      emoji: '🌐',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Entity resolution',
      description: 'Services resolve references to entities they own via reference resolvers',
      emoji: '🎯',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Type safety across services',
      description: 'Schema composition validates type extensions match base definitions',
      emoji: '✅',
    },
  ],

  outOfScope: [
    'GraphQL subscriptions (v2)',
    'Schema registry/versioning (v2)',
    'Field-level authorization (v2)',
    'Distributed tracing (v2)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a basic federated architecture with subgraphs and a gateway. Once it works, we'll optimize for performance, caching, and reliability. This is the right way: functionality first, then optimization.",
};

// =============================================================================
// STEP 1: Create First Subgraph (Users Service)
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome! You're building a federated GraphQL architecture for an e-commerce platform.",
  hook: "Your first task: create the Users service as an independent GraphQL subgraph.",
  challenge: "Set up the Users service with its own schema to manage user profiles.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your first subgraph is live!",
  achievement: "Users service now exposes its own GraphQL schema",
  metrics: [
    { label: 'Subgraphs', after: '1' },
    { label: 'User queries', after: 'Working' },
  ],
  nextTeaser: "But we need more services... let's add Products!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'GraphQL Subgraphs: Independent Schema Ownership',
  conceptExplanation: `In a federated architecture, each service is a **subgraph** with its own GraphQL schema.

The Users service defines its schema:

\`\`\`graphql
type User @key(fields: "id") {
  id: ID!
  email: String!
  name: String!
}

type Query {
  user(id: ID!): User
  users: [User!]!
}
\`\`\`

Key elements:
1. **@key directive**: Marks User as a federated entity that can be referenced
2. **Independent schema**: Users service owns the User type definition
3. **Service autonomy**: The team can evolve their schema independently`,

  whyItMatters: `Subgraphs enable:
- **Team autonomy**: Each team owns their domain's schema
- **Independent deployment**: Services can deploy without coordinating
- **Domain separation**: Clear boundaries between business domains`,

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Managing schemas for 1000+ microservices',
    howTheyDoIt: 'Netflix uses Federated GraphQL to unify schemas from hundreds of domain services. Each team owns their subgraph, and the gateway provides a unified API.',
  },

  keyPoints: [
    '@key directive marks entities that can be referenced by other services',
    'Each subgraph is an independent GraphQL service',
    'Subgraphs own their domain types and can evolve independently',
    'The gateway will compose these schemas into one unified API',
  ],

  diagram: `
    [Client] ──→ (Gateway - coming soon!)
                      │
                      ├──→ [Users Subgraph]
                      │     └─ User type
                      │
                      ├──→ [Products Subgraph] (next step!)
                      │
                      └──→ [Orders Subgraph] (coming!)
  `,

  interviewTip: 'Start by identifying domain boundaries. Each subgraph should own a clear business domain (users, products, orders, etc.).',
};

const step1: GuidedStep = {
  stepNumber: 1,
  title: 'Create Users Subgraph',
  story: step1Story,
  learn: step1LearnPhase,
  celebration: step1Celebration,
  practice: {
    task: 'Create the Users service as a GraphQL subgraph',
    hints: {
      componentsNeeded: [
        { type: 'app_server', reason: 'Users service exposes GraphQL schema', displayName: 'Users Service' },
        { type: 'database', reason: 'Store user data', displayName: 'Users DB' },
      ],
      connectionsNeeded: [
        { from: 'Users Service', to: 'Users DB', reason: 'Service queries user data' },
      ],
    },
    successCriteria: [
      'Users service created with GraphQL schema',
      'Connected to database for user data storage',
    ],
  },
  validation: {
    requiredComponents: ['app_server', 'database'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add an App Server for Users service and a Database for user data',
    level2: 'The Users service needs a database to store user profiles. Connect them.',
    solutionComponents: [{ type: 'app_server' }, { type: 'database' }],
    solutionConnections: [
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 2: Add Products Subgraph
// =============================================================================

const step2Story: StoryContent = {
  emoji: '📦',
  scenario: "The Users service is running! Now we need a Products service.",
  hook: "The product catalog team wants their own GraphQL schema to manage products independently.",
  challenge: "Create the Products service as a second independent subgraph.",
  illustration: 'expanding-services',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Second subgraph deployed!",
  achievement: "Products service now manages product catalog",
  metrics: [
    { label: 'Subgraphs', before: '1', after: '2' },
    { label: 'Product queries', after: 'Working' },
  ],
  nextTeaser: "Two services... but they're isolated. We need a gateway!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Multiple Subgraphs: Building the Federation',
  conceptExplanation: `Now we add the Products subgraph with its own schema:

\`\`\`graphql
type Product @key(fields: "id") {
  id: ID!
  name: String!
  price: Float!
  inventory: Int!
}

type Query {
  product(id: ID!): Product
  products: [Product!]!
}
\`\`\`

Notice:
1. **Independent schema**: Products service owns the Product type
2. **@key directive**: Product is a federated entity
3. **Separate database**: Each service has its own data store
4. **No dependencies**: Products service doesn't know about Users service`,

  whyItMatters: 'Each service can evolve independently. The Products team can add fields, change resolvers, and deploy without affecting the Users service.',

  keyPoints: [
    'Each subgraph is a standalone GraphQL service',
    'Services own their data and schema independently',
    'No direct dependencies between services (yet!)',
    'Gateway will unify these schemas into one API',
  ],

  diagram: `
    [Users Service]     [Products Service]
          │                    │
    [Users DB]           [Products DB]

    Both services are independent - no communication yet!
  `,
};

const step2: GuidedStep = {
  stepNumber: 2,
  title: 'Add Products Subgraph',
  story: step2Story,
  learn: step2LearnPhase,
  celebration: step2Celebration,
  practice: {
    task: 'Create the Products service as a second subgraph',
    hints: {
      componentsNeeded: [
        { type: 'app_server', reason: 'Products service with GraphQL schema', displayName: 'Products Service' },
        { type: 'database', reason: 'Store product catalog', displayName: 'Products DB' },
      ],
      connectionsNeeded: [
        { from: 'Products Service', to: 'Products DB', reason: 'Service queries product data' },
      ],
    },
    successCriteria: [
      'Products service created',
      'Separate database for product data',
    ],
  },
  validation: {
    requiredComponents: ['app_server', 'app_server', 'database', 'database'],
    requireMultipleAppInstances: false,
  },
  hints: {
    level1: 'Add another App Server for Products and another Database',
    level2: 'Create a separate Products service with its own database, just like Users',
    solutionComponents: [
      { type: 'app_server' },
      { type: 'app_server' },
      { type: 'database' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 3: Add Federation Gateway
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🌐',
  scenario: "You have two services, but clients need to query both. How?",
  hook: "Clients don't want to call two separate APIs. They want ONE GraphQL endpoint that can query users AND products!",
  challenge: "Add a Federation Gateway to compose the subgraphs into a unified schema.",
  illustration: 'gateway-composition',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎊',
  message: "Federation is working!",
  achievement: "Gateway composes Users and Products into one unified API",
  metrics: [
    { label: 'Gateway status', after: 'Composing' },
    { label: 'Unified schema', after: 'Available' },
  ],
  nextTeaser: "But we can't query across services yet... let's add type references!",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Gateway Composition: Unifying the Federation',
  conceptExplanation: `The **Federation Gateway** is the magic that makes it all work:

**What it does:**
1. **Fetches schemas** from all subgraphs at startup
2. **Composes** them into a single unified supergraph
3. **Routes queries** to the appropriate services
4. **Merges results** from multiple services into one response

**How composition works:**
\`\`\`
Gateway startup:
├─ Fetch SDL from Users service
├─ Fetch SDL from Products service
├─ Validate type extensions
└─ Build unified supergraph schema

Query execution:
├─ Parse client query
├─ Build query plan (which services to call)
├─ Execute subqueries in parallel
└─ Merge and return results
\`\`\`

The gateway is stateless - it just orchestrates!`,

  whyItMatters: 'Without the gateway, clients would need to know about all services and manually stitch data. The gateway provides a single entry point.',

  realWorldExample: {
    company: 'Apollo GraphQL',
    scenario: 'Apollo Gateway powers federated GraphQL for thousands of companies',
    howTheyDoIt: 'The gateway uses intelligent query planning to minimize round trips and fetch data efficiently from subgraphs.',
  },

  keyPoints: [
    'Gateway composes all subgraph schemas into one unified schema',
    'Gateway routes queries to appropriate services automatically',
    'Gateway is stateless - it can be horizontally scaled',
    'Clients only need to know about the gateway, not individual services',
  ],

  diagram: `
    [Client] ──→ [Federation Gateway]
                      │
                      ├──→ [Users Service]
                      │     └─ [Users DB]
                      │
                      └──→ [Products Service]
                            └─ [Products DB]

    Gateway composes both schemas into one unified API!
  `,
};

const step3: GuidedStep = {
  stepNumber: 3,
  title: 'Add Federation Gateway',
  story: step3Story,
  learn: step3LearnPhase,
  celebration: step3Celebration,
  practice: {
    task: 'Add a Federation Gateway to compose the subgraphs',
    hints: {
      componentsNeeded: [
        { type: 'api_gateway', reason: 'Composes subgraph schemas', displayName: 'Federation Gateway' },
      ],
      connectionsNeeded: [
        { from: 'Client', to: 'Federation Gateway', reason: 'Clients query the gateway' },
        { from: 'Federation Gateway', to: 'Users Service', reason: 'Gateway routes to Users' },
        { from: 'Federation Gateway', to: 'Products Service', reason: 'Gateway routes to Products' },
      ],
    },
    successCriteria: [
      'Federation Gateway added',
      'Gateway connected to both subgraphs',
      'Client queries through gateway',
    ],
  },
  validation: {
    requiredComponents: ['client', 'api_gateway', 'app_server', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Add a Client and an API Gateway, then connect gateway to both services',
    level2: 'Client → Gateway → Users/Products services',
    solutionComponents: [
      { type: 'client' },
      { type: 'api_gateway' },
      { type: 'app_server' },
      { type: 'app_server' },
    ],
    solutionConnections: [
      { from: 'client', to: 'api_gateway' },
      { from: 'api_gateway', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 4: Implement Type References (Orders extends User)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🔗',
  scenario: "Now comes the real power of federation: cross-service type references!",
  hook: "You want to add an Orders service. Orders belong to users, but the User type is owned by the Users service. How do we connect them?",
  challenge: "Create the Orders service and extend the User type to add an orders field.",
  illustration: 'type-extension',
};

const step4Celebration: CelebrationContent = {
  emoji: '✨',
  message: "Type references are working!",
  achievement: "Orders service extends User type across service boundaries",
  metrics: [
    { label: 'Type extensions', after: 'Working' },
    { label: 'Cross-service queries', after: 'Enabled' },
  ],
  nextTeaser: "Now let's optimize query planning...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Type References: Extending Types Across Services',
  conceptExplanation: `**This is where federation shines!**

The Orders service can extend the User type:

\`\`\`graphql
# In Orders service
extend type User @key(fields: "id") {
  id: ID! @external
  orders: [Order!]!
}

type Order @key(fields: "id") {
  id: ID!
  userId: ID!
  total: Float!
  items: [OrderItem!]!
}
\`\`\`

**How it works:**
1. **@external**: Tells gateway that \`id\` comes from Users service
2. **extend type User**: Orders service adds \`orders\` field to User
3. **Gateway resolves**: When client queries \`user { orders }\`, gateway:
   - Calls Users service for user data
   - Calls Orders service for orders with that userId
   - Merges the results automatically!

**Client can now query:**
\`\`\`graphql
query {
  user(id: "123") {
    name           # from Users service
    email          # from Users service
    orders {       # from Orders service!
      id
      total
    }
  }
}
\`\`\``,

  whyItMatters: 'Type extensions let you add fields to types from other services without modifying their code. Each team stays autonomous!',

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Extending Product type across 50+ services',
    howTheyDoIt: 'Multiple services extend the Product type: Inventory adds stock levels, Reviews adds ratings, Shipping adds weight/dimensions - all without modifying the core Products service.',
  },

  keyPoints: [
    'extend type allows services to add fields to types they don\'t own',
    '@external marks fields that come from the owning service',
    'Gateway automatically resolves cross-service references',
    'Reference resolvers fetch entity data when referenced by other services',
  ],

  diagram: `
    Client Query:
    ┌─────────────────────────────────────┐
    │ user(id: "123") {                   │
    │   name    # Users service           │
    │   orders { # Orders service         │
    │     total                           │
    │   }                                 │
    │ }                                   │
    └─────────────────────────────────────┘
              │
              ▼
         [Gateway]
         /        \\
        ▼          ▼
    [Users]    [Orders]
    returns:   extends User
    { name }   { orders }
              │
              ▼
         Merged Result!
  `,
};

const step4: GuidedStep = {
  stepNumber: 4,
  title: 'Implement Type References',
  story: step4Story,
  learn: step4LearnPhase,
  celebration: step4Celebration,
  practice: {
    task: 'Add Orders service that extends the User type',
    hints: {
      componentsNeeded: [
        { type: 'app_server', reason: 'Orders service with type extensions', displayName: 'Orders Service' },
        { type: 'database', reason: 'Store order data', displayName: 'Orders DB' },
      ],
      connectionsNeeded: [
        { from: 'Federation Gateway', to: 'Orders Service', reason: 'Gateway routes order queries' },
        { from: 'Orders Service', to: 'Orders DB', reason: 'Service queries order data' },
      ],
    },
    successCriteria: [
      'Orders service added with User type extension',
      'Gateway can resolve cross-service queries',
    ],
  },
  validation: {
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Add Orders service with database, connect to gateway, implement type extension in code',
    level2: 'Create Orders service → Orders DB, connect gateway → Orders, write code to extend User type',
    solutionComponents: [
      { type: 'app_server' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'api_gateway', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 5: Implement Reference Resolvers
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🎯',
  scenario: "Type extensions are great, but how does Orders service actually fetch user data?",
  hook: "When the gateway needs to resolve a User reference, it needs a reference resolver!",
  challenge: "Implement reference resolvers to enable entity resolution across services.",
  illustration: 'entity-resolution',
};

const step5Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Reference resolvers working!",
  achievement: "Services can now resolve references to entities they own",
  metrics: [
    { label: 'Entity resolution', after: 'Enabled' },
    { label: 'Reference resolvers', after: 'Implemented' },
  ],
  nextTeaser: "Let's add caching to optimize gateway performance...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Reference Resolvers: How Services Fetch Entities',
  conceptExplanation: `**Reference resolvers** are how services fetch entities when referenced by other services.

\`\`\`python
# In Users service
@graphql_field
def resolve_reference(self, representation):
    """
    Called by gateway when another service references a User
    """
    if representation.get('__typename') == 'User':
        user_id = representation.get('id')
        return fetch_user_from_db(user_id)

    return None
\`\`\`

**When does this get called?**

1. Client queries: \`user(id: "123") { orders { total } }\`
2. Gateway calls Users service: "Get user 123"
3. Users service returns: \`{ id: "123", name: "Alice" }\`
4. Gateway sees \`orders\` field (from Orders service)
5. Gateway calls Orders service reference resolver: "Resolve User 123"
6. Orders service uses reference resolver to fetch user context
7. Orders service returns orders for that user
8. Gateway merges everything!

**Key concepts:**
- **__typename**: Tells the resolver which entity type to fetch
- **Representation**: Contains the key fields (@key) needed to fetch the entity
- **Batching**: Reference resolvers can batch multiple entity fetches`,

  whyItMatters: 'Reference resolvers are the glue that makes federation work. Without them, services can\'t resolve references from other services.',

  keyPoints: [
    'Reference resolvers fetch entities when referenced by other services',
    'They receive a representation object with __typename and key fields',
    'Can batch multiple entity fetches for performance',
    'Each service implements reference resolvers for entities it owns',
  ],

  diagram: `
    Query: user(id: "123") { orders { total } }

    Step 1: Gateway → Users Service
    ┌──────────────────────────────┐
    │ Fetch user 123               │
    │ Returns: { id, name, email } │
    └──────────────────────────────┘

    Step 2: Gateway → Orders Service (Reference Resolver)
    ┌────────────────────────────────────────┐
    │ resolveReference({ __typename: "User", │
    │                    id: "123" })        │
    │ Returns: { orders: [...] }             │
    └────────────────────────────────────────┘

    Step 3: Gateway merges results
    ┌────────────────────────────────┐
    │ { id: "123",                   │
    │   name: "Alice",               │
    │   email: "...",                │
    │   orders: [...] }              │
    └────────────────────────────────┘
  `,
};

const step5: GuidedStep = {
  stepNumber: 5,
  title: 'Implement Reference Resolvers',
  story: step5Story,
  learn: step5LearnPhase,
  celebration: step5Celebration,
  practice: {
    task: 'Implement reference resolvers in all services',
    hints: {
      componentsNeeded: [],
      connectionsNeeded: [],
    },
    successCriteria: [
      'Reference resolvers implemented for User, Product, Order entities',
      'Gateway can resolve cross-service entity references',
    ],
  },
  validation: {
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Write reference resolver code in each service to fetch entities by ID',
    level2: 'Implement __resolveReference in Users, Products, and Orders services',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Gateway Caching
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚡',
  scenario: "Your federated API is working, but queries are slow!",
  hook: "Every query hits multiple services. Popular queries like 'user profile with orders' are making redundant calls.",
  challenge: "Add caching to the gateway to reduce load on subgraphs.",
  illustration: 'performance-optimization',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Gateway is now blazing fast!",
  achievement: "Caching reduces subgraph calls by 80%",
  metrics: [
    { label: 'Query latency', before: '500ms', after: '50ms' },
    { label: 'Cache hit rate', after: '85%' },
  ],
  nextTeaser: "What if a subgraph goes down? We need resilience...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Gateway Caching: Optimizing Federated Queries',
  conceptExplanation: `**The problem:** Each federated query can hit multiple services. Popular queries repeat the same entity fetches.

**The solution:** Add caching to the gateway!

**Caching strategies:**

1. **Entity caching**: Cache resolved entities by key
   \`\`\`
   Cache key: "User:123"
   Value: { id: "123", name: "Alice", email: "..." }
   TTL: 60 seconds
   \`\`\`

2. **Query result caching**: Cache entire query results
   \`\`\`
   Cache key: hash(query + variables)
   Value: complete response
   TTL: 30 seconds
   \`\`\`

3. **Partial query caching**: Cache intermediate results
   - Cache entity fetches from each subgraph
   - Gateway combines cached + fresh data

**Best practices:**
- Cache stable data (user profiles) longer than volatile data (inventory)
- Use Redis for distributed cache across gateway instances
- Implement cache invalidation for updates
- Monitor cache hit rates`,

  whyItMatters: 'Without caching, every query hits all services. With caching, 80%+ of queries can be served from cache, dramatically reducing latency and load.',

  realWorldExample: {
    company: 'GitHub',
    scenario: 'Caching GraphQL queries for millions of users',
    howTheyDoIt: 'GitHub uses Redis to cache entity fetches. User profiles are cached for 60s, repositories for 30s. This reduced their API latency by 10x.',
  },

  keyPoints: [
    'Cache entities at the gateway to avoid repeated subgraph calls',
    'Use TTL to balance freshness vs performance',
    'Implement cache invalidation for mutations',
    'Monitor cache hit rates and adjust TTLs',
  ],

  diagram: `
    Query without cache:
    Client → Gateway → Users (200ms)
                    → Products (150ms)
                    → Orders (300ms)
    Total: 650ms

    Query with cache (hit):
    Client → Gateway → Cache (5ms)
    Total: 5ms ✨

    Cache strategy:
    ┌─────────────────────────────┐
    │ Redis Cache                 │
    │ ├─ User:123 (TTL: 60s)      │
    │ ├─ Product:456 (TTL: 30s)   │
    │ └─ Order:789 (TTL: 10s)     │
    └─────────────────────────────┘
  `,
};

const step6: GuidedStep = {
  stepNumber: 6,
  title: 'Add Gateway Caching',
  story: step6Story,
  learn: step6LearnPhase,
  celebration: step6Celebration,
  practice: {
    task: 'Add Redis cache to the gateway for entity caching',
    hints: {
      componentsNeeded: [
        { type: 'cache', reason: 'Cache entity fetches', displayName: 'Gateway Cache' },
      ],
      connectionsNeeded: [
        { from: 'Federation Gateway', to: 'Cache', reason: 'Gateway caches entity results' },
      ],
    },
    successCriteria: [
      'Cache added to gateway',
      'Entity caching implemented',
    ],
  },
  validation: {
    requiredComponents: ['cache'],
    requiredConnections: [
      { fromType: 'api_gateway', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Add a Cache component and connect it to the Gateway',
    level2: 'Gateway should check cache before calling subgraphs',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [
      { from: 'api_gateway', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Load Balancing for Gateway
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📈',
  scenario: "Your federated API is popular! Traffic is growing fast.",
  hook: "A single gateway instance can't handle the load. Queries are timing out during peak hours.",
  challenge: "Scale the gateway horizontally with a load balancer.",
  illustration: 'horizontal-scaling',
};

const step7Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "Gateway is now highly available!",
  achievement: "Multiple gateway instances handle traffic with load balancing",
  metrics: [
    { label: 'Gateway instances', before: '1', after: '3+' },
    { label: 'Throughput', before: '1K req/s', after: '10K req/s' },
  ],
  nextTeaser: "Now let's handle subgraph failures gracefully...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Scaling the Gateway: High Availability',
  conceptExplanation: `**The problem:** A single gateway is a bottleneck and single point of failure.

**The solution:** Multiple gateway instances behind a load balancer!

**Architecture:**
\`\`\`
Client → Load Balancer → Gateway Instance 1 → Subgraphs
                      → Gateway Instance 2 → Subgraphs
                      → Gateway Instance 3 → Subgraphs
\`\`\`

**Why this works:**
- **Stateless gateways**: Each instance can handle any request
- **Shared cache**: All gateways share the same Redis cache
- **Independent composition**: Each gateway composes schemas at startup
- **Horizontal scaling**: Add more instances as traffic grows

**Load balancing strategies:**
- **Round Robin**: Distribute evenly across instances
- **Least Connections**: Send to least busy instance
- **Health Checks**: Remove unhealthy gateways automatically

**Benefits:**
- 10x throughput with 10 instances
- Zero downtime deploys (rolling updates)
- Survive gateway crashes (redundancy)`,

  whyItMatters: 'A single gateway can handle 1-2K req/s. With load balancing, you can scale to 100K+ req/s and survive instance failures.',

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Scaling GraphQL gateway for millions of listings',
    howTheyDoIt: 'Airbnb runs 50+ gateway instances behind AWS ALB. During peak booking times, they auto-scale to 200+ instances.',
  },

  keyPoints: [
    'Gateway is stateless and can be horizontally scaled',
    'Load balancer distributes traffic across gateway instances',
    'All gateways share the same Redis cache for consistency',
    'Health checks remove failed gateways automatically',
  ],

  diagram: `
    ┌─────────┐
    │ Client  │
    └────┬────┘
         │
         ▼
    ┌────────────────┐
    │ Load Balancer  │
    └────┬───────────┘
         │
    ┌────┴────┬─────────┬────────┐
    ▼         ▼         ▼        ▼
  [GW 1]   [GW 2]   [GW 3]   [GW N]
    │         │         │        │
    └─────────┴─────────┴────────┘
              │
              ▼
         [Redis Cache]
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
  [Users] [Products] [Orders]
  `,
};

const step7: GuidedStep = {
  stepNumber: 7,
  title: 'Scale Gateway with Load Balancer',
  story: step7Story,
  learn: step7LearnPhase,
  celebration: step7Celebration,
  practice: {
    task: 'Add load balancer and scale gateway to multiple instances',
    hints: {
      componentsNeeded: [
        { type: 'load_balancer', reason: 'Distribute traffic across gateways', displayName: 'Load Balancer' },
      ],
      connectionsNeeded: [
        { from: 'Client', to: 'Load Balancer', reason: 'All traffic through LB' },
        { from: 'Load Balancer', to: 'Federation Gateway', reason: 'LB routes to gateways' },
      ],
    },
    successCriteria: [
      'Load balancer added',
      'Client routes through load balancer',
      'Gateway configured for multiple instances',
    ],
  },
  validation: {
    requiredComponents: ['load_balancer'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'api_gateway' },
    ],
  },
  hints: {
    level1: 'Add a Load Balancer between Client and Gateway',
    level2: 'Client → Load Balancer → Gateway (with multiple instances)',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'api_gateway' },
    ],
  },
};

// =============================================================================
// STEP 8: Implement Subgraph Resilience (Circuit Breakers)
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🛡️',
  scenario: "The Products service just went down! All queries are failing.",
  hook: "When one subgraph fails, the entire gateway times out trying to reach it. Cascading failure!",
  challenge: "Implement circuit breakers to isolate failing subgraphs.",
  illustration: 'resilience',
};

const step8Celebration: CelebrationContent = {
  emoji: '✨',
  message: "Federation is now resilient!",
  achievement: "Circuit breakers isolate failing subgraphs",
  metrics: [
    { label: 'Subgraph failures', after: 'Isolated' },
    { label: 'Partial responses', after: 'Enabled' },
  ],
  nextTeaser: "Almost done! Let's optimize schema composition...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Resilience: Handling Subgraph Failures',
  conceptExplanation: `**The problem:** When a subgraph fails, gateway queries time out waiting for it.

**Solutions:**

1. **Circuit Breakers**: Stop calling failed services
   \`\`\`
   States:
   - CLOSED: Normal operation, requests flow
   - OPEN: Service failed, reject immediately
   - HALF-OPEN: Test if service recovered

   Thresholds:
   - Open after 5 consecutive failures
   - Stay open for 30 seconds
   - Test with 1 request, close if success
   \`\`\`

2. **Timeouts**: Don't wait forever
   \`\`\`
   Gateway timeout: 1 second per subgraph
   Total query timeout: 3 seconds
   \`\`\`

3. **Partial Responses**: Return what you can
   \`\`\`graphql
   query {
     user(id: "123") {
       name          # ✅ from Users (working)
       orders {      # ❌ from Orders (failed)
         total
       }
     }
   }

   Response:
   {
     "data": {
       "user": {
         "name": "Alice",
         "orders": null
       }
     },
     "errors": [
       { "message": "Orders service unavailable" }
     ]
   }
   \`\`\`

**Benefits:**
- Failing subgraphs don't bring down the whole system
- Users get partial data instead of total failure
- Services can recover without manual intervention`,

  whyItMatters: 'Microservices fail. Circuit breakers ensure one failing service doesn\'t cascade and take down your entire API.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Handling service failures in 1000+ microservices',
    howTheyDoIt: 'Netflix pioneered circuit breakers with Hystrix. When a service fails, they return cached data or gracefully degrade. Better to show 90% of the page than 0%.',
  },

  famousIncident: {
    title: 'Amazon AWS Outage',
    company: 'Amazon',
    year: '2017',
    whatHappened: 'A typo in a command took down S3 in us-east-1. Many websites went completely dark because they didn\'t handle S3 failures gracefully. Sites with circuit breakers degraded but stayed online.',
    lessonLearned: 'Always implement circuit breakers and graceful degradation. Partial availability is better than total failure.',
    icon: '☁️',
  },

  keyPoints: [
    'Circuit breakers stop calling failed services automatically',
    'Timeouts prevent indefinite waiting',
    'Partial responses return available data even if some services fail',
    'Monitor circuit breaker states to detect issues',
  ],

  diagram: `
    Circuit Breaker States:

    CLOSED (Normal)
    ┌───────────┐
    │ Request → │ → Subgraph (success)
    │ Return ✓  │
    └───────────┘

    OPEN (Failed)
    ┌───────────┐
    │ Request × │ → Fail fast (don't call subgraph)
    │ Return    │
    │ error     │
    └───────────┘

    HALF-OPEN (Testing)
    ┌───────────┐
    │ Request → │ → Try 1 request
    │ Success?  │ → CLOSED
    │ Failure?  │ → OPEN
    └───────────┘
  `,
};

const step8: GuidedStep = {
  stepNumber: 8,
  title: 'Implement Circuit Breakers',
  story: step8Story,
  learn: step8LearnPhase,
  celebration: step8Celebration,
  practice: {
    task: 'Configure circuit breakers and timeouts in gateway',
    hints: {
      componentsNeeded: [],
      connectionsNeeded: [],
    },
    successCriteria: [
      'Circuit breakers configured for all subgraphs',
      'Timeouts set for subgraph calls',
      'Partial responses enabled',
    ],
  },
  validation: {
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Configure circuit breaker settings in gateway code',
    level2: 'Set circuit breaker thresholds and timeouts for each subgraph connection',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 9: Optimize Query Planning
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🚀',
  scenario: "Your federation is working, but some queries are slow!",
  hook: "The gateway is making sequential calls to subgraphs when it could parallelize. Each query takes 3x longer than necessary!",
  challenge: "Optimize the gateway's query planner to parallelize subgraph calls.",
  illustration: 'query-optimization',
};

const step9Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Query planning optimized!",
  achievement: "Parallel subgraph execution reduces latency by 70%",
  metrics: [
    { label: 'Query latency', before: '600ms', after: '200ms' },
    { label: 'Parallel execution', after: 'Enabled' },
  ],
  nextTeaser: "Final step: monitoring and observability!",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Query Planning: Optimizing Execution',
  conceptExplanation: `**The problem:** Naive execution calls subgraphs sequentially.

**Bad execution plan (sequential):**
\`\`\`
1. Call Users service (200ms)
2. Wait...
3. Call Products service (150ms)
4. Wait...
5. Call Orders service (250ms)
Total: 600ms
\`\`\`

**Optimized execution plan (parallel):**
\`\`\`
1. Call Users service (200ms)  ┐
2. Call Products service (150ms) ├─ Parallel!
3. Call Orders service (250ms) ┘
Total: 250ms (longest)
\`\`\`

**Query planner optimization strategies:**

1. **Parallel fetching**: Call independent services simultaneously
   \`\`\`graphql
   query {
     user(id: "123") { name }      # Users service
     product(id: "456") { name }   # Products service
   }
   # These can run in parallel!
   \`\`\`

2. **Batching**: Combine multiple entity fetches
   \`\`\`graphql
   query {
     users(ids: ["1", "2", "3"]) { name }
   }
   # Batch fetch 3 users in 1 call instead of 3 calls
   \`\`\`

3. **Dependency analysis**: Only wait when necessary
   \`\`\`graphql
   query {
     user(id: "123") {
       name              # Step 1: Fetch user
       orders {          # Step 2: Wait for user, then fetch orders
         product {       # Step 3: Wait for orders, then fetch products
           name
         }
       }
     }
   }
   # 3 sequential steps required - can't parallelize
   \`\`\`

**Query plan example:**
\`\`\`
Fetch sequence:
├─ [Parallel]
│  ├─ Users.user(id: "123")
│  └─ Products.product(id: "456")
└─ [After user fetches]
   └─ Orders.ordersForUser(userId: "123")
\`\`\``,

  whyItMatters: 'Good query planning can reduce latency by 3-5x. The difference between 500ms and 100ms query times.',

  realWorldExample: {
    company: 'Apollo GraphQL',
    scenario: 'Query planning in Apollo Gateway',
    howTheyDoIt: 'Apollo Gateway builds a query plan DAG (directed acyclic graph) to identify parallel and sequential operations. This reduced their average query latency by 60%.',
  },

  keyPoints: [
    'Identify independent subgraph calls and parallelize them',
    'Batch multiple entity fetches into single requests',
    'Only wait for dependencies when necessary',
    'Monitor query plan performance and optimize hot paths',
  ],

  diagram: `
    Sequential Plan (slow):
    ┌──────────────────────────────┐
    │ Users (200ms)                │
    └──────────┬───────────────────┘
               ▼
    ┌──────────────────────────────┐
    │ Products (150ms)             │
    └──────────┬───────────────────┘
               ▼
    ┌──────────────────────────────┐
    │ Orders (250ms)               │
    └──────────────────────────────┘
    Total: 600ms

    Parallel Plan (fast):
    ┌──────────────────────────────┐
    │ Users (200ms)                │├─┐
    └──────────────────────────────┘  │
    ┌──────────────────────────────┐  │ Parallel
    │ Products (150ms)             │├─┤
    └──────────────────────────────┘  │
    ┌──────────────────────────────┐  │
    │ Orders (250ms)               │├─┘
    └──────────────────────────────┘
    Total: 250ms ✨
  `,
};

const step9: GuidedStep = {
  stepNumber: 9,
  title: 'Optimize Query Planning',
  story: step9Story,
  learn: step9LearnPhase,
  celebration: step9Celebration,
  practice: {
    task: 'Configure gateway to use parallel query execution',
    hints: {
      componentsNeeded: [],
      connectionsNeeded: [],
    },
    successCriteria: [
      'Query planner configured for parallel execution',
      'Batching enabled for entity fetches',
    ],
  },
  validation: {
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Enable parallel execution in gateway configuration',
    level2: 'Configure query planner to identify independent operations and run them in parallel',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 10: Add Monitoring and Observability
// =============================================================================

const step10Story: StoryContent = {
  emoji: '📊',
  scenario: "Your federated architecture is production-ready!",
  hook: "But when things go wrong, you need visibility. Which subgraph is slow? What queries are failing?",
  challenge: "Add monitoring and distributed tracing to observe the entire federation.",
  illustration: 'observability',
};

const step10Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "GraphQL Federation complete!",
  achievement: "Production-ready federated architecture with full observability",
  metrics: [
    { label: 'Subgraphs', after: '3+' },
    { label: 'Monitoring', after: 'Enabled' },
    { label: 'Distributed tracing', after: 'Working' },
  ],
  nextTeaser: "Congratulations! You've mastered GraphQL Federation!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Observability: Monitoring Federated GraphQL',
  conceptExplanation: `**In a federated system, observability is critical!**

**Key metrics to monitor:**

1. **Gateway metrics:**
   - Query latency (p50, p95, p99)
   - Error rate
   - Throughput (queries/sec)
   - Cache hit rate
   - Circuit breaker states

2. **Subgraph metrics:**
   - Service latency per operation
   - Error rate per service
   - Entity fetch performance
   - Reference resolver latency

3. **Query analysis:**
   - Slow queries (> 1s)
   - Most expensive operations
   - Query complexity (depth, breadth)
   - Field-level performance

**Distributed tracing:**

\`\`\`
Trace: GET user profile with orders

Client Request [0ms]
  ├─ Gateway [2ms]
  │  ├─ Parse query [1ms]
  │  ├─ Build query plan [5ms]
  │  ├─ Execute plan [250ms]
  │  │  ├─ Users.user(123) [200ms] ──┐
  │  │  │  └─ DB query [180ms]       │ Parallel
  │  │  └─ Products.featured [100ms]─┘
  │  │     └─ Cache hit [2ms]
  │  └─ Orders.ordersForUser [150ms]
  │     └─ DB query [130ms]
  └─ Format response [3ms]

Total: 260ms
\`\`\`

**Tools:**
- **Prometheus**: Metrics collection
- **Grafana**: Dashboards and alerting
- **Jaeger/Zipkin**: Distributed tracing
- **Apollo Studio**: GraphQL-specific monitoring

**Alerting:**
- Gateway error rate > 1%
- Any subgraph error rate > 5%
- Query latency p99 > 500ms
- Circuit breaker open > 1 minute`,

  whyItMatters: 'In a distributed system, you need visibility into every component. Monitoring helps you detect issues before users notice and debug problems when they occur.',

  realWorldExample: {
    company: 'GitHub',
    scenario: 'Monitoring federated GraphQL across 100+ services',
    howTheyDoIt: 'GitHub uses distributed tracing to track every GraphQL query across their federation. When a query is slow, they can see exactly which subgraph is the bottleneck.',
  },

  keyPoints: [
    'Monitor gateway and subgraph metrics separately',
    'Use distributed tracing to track queries across services',
    'Alert on error rates, latency, and circuit breaker states',
    'Analyze query patterns to identify optimization opportunities',
  ],

  diagram: `
    Monitoring Stack:

    ┌─────────────────────────────┐
    │ Grafana Dashboards          │
    │ ├─ Gateway Performance      │
    │ ├─ Subgraph Health          │
    │ ├─ Query Analysis           │
    │ └─ Alerts                   │
    └─────────────┬───────────────┘
                  │
    ┌─────────────▼───────────────┐
    │ Prometheus                  │
    │ (Metrics Collection)        │
    └─────────────┬───────────────┘
                  │
    ┌─────────────▼───────────────┐
    │ Federation Gateway          │
    │ ├─ Metrics exporter         │
    │ └─ Tracing integration      │
    └─────────────┬───────────────┘
                  │
          ┌───────┴────────┐
          ▼                ▼
    [Subgraphs]      [Jaeger]
                   (Tracing)
  `,
};

const step10: GuidedStep = {
  stepNumber: 10,
  title: 'Add Monitoring and Observability',
  story: step10Story,
  learn: step10LearnPhase,
  celebration: step10Celebration,
  practice: {
    task: 'Add monitoring stack for the federated architecture',
    hints: {
      componentsNeeded: [
        { type: 'monitoring', reason: 'Collect metrics and traces', displayName: 'Monitoring' },
      ],
      connectionsNeeded: [
        { from: 'Monitoring', to: 'Federation Gateway', reason: 'Monitor gateway metrics' },
        { from: 'Monitoring', to: 'Subgraphs', reason: 'Monitor subgraph health' },
      ],
    },
    successCriteria: [
      'Monitoring stack deployed',
      'Gateway and subgraph metrics collected',
      'Distributed tracing enabled',
    ],
  },
  validation: {
    requiredComponents: ['monitoring'],
  },
  hints: {
    level1: 'Add a Monitoring component connected to gateway and subgraphs',
    level2: 'Deploy Prometheus/Grafana stack to monitor the entire federation',
    solutionComponents: [{ type: 'monitoring' }],
    solutionConnections: [],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const l5ApiGraphqlFederationGuidedTutorial: GuidedTutorial = {
  problemId: 'l5-api-graphql-federation',
  problemTitle: 'Netflix GraphQL Federation Platform',
  title: 'Netflix GraphQL Federation Platform',
  description: 'Design a federated GraphQL platform like Netflix that unifies 1000 microservices into a single API for web, mobile, and TV clients',
  difficulty: 'advanced',
  estimatedMinutes: 90,

  welcomeStory: {
    emoji: '🎬',
    hook: "You've been hired as Principal API Architect at Netflix!",
    scenario: "Netflix has over 1000 microservices, each with their own APIs. Your mission: Build a federated GraphQL platform that provides a unified API for all clients - web, mobile, and TV apps.",
    challenge: "Can you design a system that federates 1000 schemas, optimizes query execution, and handles 100M+ daily requests with sub-100ms latency?",
  },

  requirementsPhase: graphqlFederationRequirementsPhase,

  totalSteps: 10,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  concepts: [
    'GraphQL Federation',
    'Schema Composition',
    'Subgraph Architecture',
    'Query Planning and Execution',
    'Type References (@key, @external)',
    'Field-Level Caching',
    'Partial Failures',
    'Distributed Tracing',
    'Real-time Subscriptions',
  ],

  ddiaReferences: [
    'Chapter 4: Encoding and Evolution',
    'Chapter 11: Stream Processing',
  ],
};

export function getGraphQLFederationGuidedTutorial(): GuidedTutorial {
  return l5ApiGraphqlFederationGuidedTutorial;
}
