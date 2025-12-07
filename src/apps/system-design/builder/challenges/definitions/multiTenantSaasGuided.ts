import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Multi-Tenant SaaS Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 9-step tutorial that teaches multi-tenant SaaS concepts
 * while building a scalable SaaS platform.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic multi-tenant architecture
 * Steps 4-6: Database per tenant vs shared, tenant routing, resource quotas
 * Steps 7-9: Advanced multi-tenancy, isolation, and billing
 *
 * Key Concepts:
 * - Tenant isolation strategies
 * - Shared vs dedicated infrastructure
 * - Resource quotas and rate limiting
 * - Tenant routing and customization
 * - Multi-tenant billing and metering
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const multiTenantSaasRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a multi-tenant SaaS platform",

  interviewer: {
    name: 'Maya Thompson',
    role: 'CTO at CloudScale Inc.',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-saas',
      category: 'functional',
      question: "What are the core features of our multi-tenant SaaS platform?",
      answer: "Customers need to:\n\n1. **Sign up for accounts** - Create tenant organizations\n2. **Manage users** - Add team members to their tenant\n3. **Access tenant-specific data** - Each tenant sees only their data\n4. **Customize settings** - Configure features per tenant\n5. **Billing integration** - Track usage and billing per tenant",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4, FR-5',
      learningPoint: "Multi-tenant SaaS requires strict data isolation while sharing infrastructure",
    },
    {
      id: 'tenant-isolation',
      category: 'functional',
      question: "How is data separated between different tenants?",
      answer: "Each tenant (company/organization) must have:\n- **Complete data isolation** - Tenant A cannot see Tenant B's data\n- **Logical separation** - Shared database with tenant_id column\n- **Security guarantee** - No cross-tenant data leaks\n\nWe'll use **shared database, shared schema** multi-tenancy with tenant_id filtering.",
      importance: 'critical',
      revealsRequirement: 'NFR-1',
      learningPoint: "Tenant isolation is the foundation of multi-tenant SaaS security",
    },
    {
      id: 'tenant-customization',
      category: 'functional',
      question: "Can tenants customize the platform for their needs?",
      answer: "Yes! Tenants should be able to:\n- **Configure features** - Enable/disable features per tenant\n- **Custom branding** - Logo, colors, domain names\n- **Custom fields** - Add tenant-specific data fields\n- **API access** - Programmatic access with tenant-scoped keys",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Customization enables tenants to tailor the SaaS to their workflow",
    },
    {
      id: 'tenant-onboarding',
      category: 'clarification',
      question: "How quickly should new tenants be onboarded?",
      answer: "Tenant provisioning should be **instant** - under 30 seconds from signup to ready. This includes:\n- Creating tenant record\n- Initializing database schema/tables\n- Setting up default settings\n- Sending welcome email",
      importance: 'important',
      insight: "Instant provisioning is a key SaaS differentiator vs traditional software",
    },
    {
      id: 'tenant-billing',
      category: 'functional',
      question: "How do we track usage and bill tenants?",
      answer: "We need to meter usage per tenant:\n- **API calls** - Track requests per tenant\n- **Storage** - GB of data stored\n- **Active users** - Number of seats\n- **Billing tiers** - Free, Pro, Enterprise plans\n\nFor MVP, track basic metrics. Advanced metering comes later.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Usage tracking is essential for SaaS business model",
    },

    // SCALE & NFRs
    {
      id: 'throughput-tenants',
      category: 'throughput',
      question: "How many tenants should we support?",
      answer: "1,000 active tenants initially, scaling to 10,000+ over time:\n- Small tenants: 1-5 users, <1GB data\n- Medium tenants: 10-50 users, 10GB data\n- Large tenants: 100+ users, 100GB+ data\n\nMost tenants (80%) are small, but large tenants drive revenue.",
      importance: 'critical',
      learningPoint: "Multi-tenant systems have huge variance in tenant size",
    },
    {
      id: 'throughput-requests',
      category: 'throughput',
      question: "How many API requests per day?",
      answer: "10 million API requests per day across all tenants",
      importance: 'critical',
      calculation: {
        formula: "10M ÷ 86,400 sec = 115 requests/sec",
        result: "~120 RPS average, ~360 RPS peak",
      },
      learningPoint: "Aggregate load across all tenants determines infrastructure sizing",
    },
    {
      id: 'latency-api',
      category: 'latency',
      question: "How fast should API requests respond?",
      answer: "p99 under 500ms for most operations. Tenant isolation checks should add minimal overhead (<10ms).",
      importance: 'critical',
      learningPoint: "Multi-tenant overhead should be invisible to users",
    },
    {
      id: 'tenant-data-leak',
      category: 'security',
      question: "What happens if there's a data leak between tenants?",
      answer: "This is **catastrophic and business-ending**. A single data leak:\n- Violates customer trust\n- Breaks compliance (SOC 2, HIPAA, GDPR)\n- Results in lawsuits and contract terminations\n\nMUST have:\n- Tenant_id on every query\n- Row-level security policies\n- Automated cross-tenant leak tests",
      importance: 'critical',
      learningPoint: "Tenant isolation is non-negotiable in multi-tenant SaaS",
    },
    {
      id: 'noisy-neighbor',
      category: 'reliability',
      question: "What if one tenant uses excessive resources?",
      answer: "This is the **noisy neighbor problem**. Solutions:\n- **Rate limiting** - API calls per tenant per minute\n- **Resource quotas** - CPU/memory/storage limits\n- **Query timeouts** - Kill long-running queries\n- **Throttling** - Slow down excessive usage\n\nLarge tenants shouldn't impact small tenants.",
      importance: 'critical',
      insight: "Resource isolation prevents one tenant from degrading service for others",
    },
    {
      id: 'database-strategy',
      category: 'clarification',
      question: "Should we use shared database or database per tenant?",
      answer: "Trade-offs:\n\n**Shared DB** (recommended for MVP):\n- Cost-effective for many small tenants\n- Simpler operations\n- Requires careful tenant_id filtering\n\n**DB per tenant**:\n- Better isolation\n- Easier compliance\n- Expensive at scale\n\nStart with shared DB, offer dedicated DB for enterprise tier.",
      importance: 'critical',
      insight: "Database strategy is a fundamental multi-tenant architecture decision",
    },
    {
      id: 'tenant-migration',
      category: 'reliability',
      question: "Can tenants export their data if they leave?",
      answer: "Yes! Tenants must be able to:\n- **Export all data** - Complete data dump in standard format (JSON/CSV)\n- **No lock-in** - Easy migration to competitors\n- **Self-service** - Export without contacting support\n\nThis builds trust and is often required for compliance.",
      importance: 'important',
      insight: "Data portability is a competitive advantage and compliance requirement",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-saas', 'tenant-isolation', 'tenant-customization'],
  criticalFRQuestionIds: ['core-saas', 'tenant-isolation', 'tenant-billing'],
  criticalScaleQuestionIds: ['throughput-tenants', 'tenant-data-leak', 'noisy-neighbor'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Tenant account creation',
      description: 'Organizations can sign up and create tenant accounts',
      emoji: '🏢',
    },
    {
      id: 'fr-2',
      text: 'FR-2: User management',
      description: 'Tenants can add/remove users from their organization',
      emoji: '👥',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Tenant data isolation',
      description: 'Each tenant accesses only their own data',
      emoji: '🔒',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Tenant customization',
      description: 'Tenants can configure settings and features',
      emoji: '⚙️',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Usage tracking & billing',
      description: 'Track tenant usage and calculate billing',
      emoji: '💳',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '5,000 users (across 1,000 tenants)',
    writesPerDay: '2 million writes',
    readsPerDay: '10 million reads',
    peakMultiplier: 3,
    readWriteRatio: '5:1',
    calculatedWriteRPS: { average: 23, peak: 69 },
    calculatedReadRPS: { average: 116, peak: 347 },
    maxPayloadSize: '~5KB (tenant data)',
    storagePerRecord: '~2KB',
    storageGrowthPerYear: '~4TB',
    redirectLatencySLA: 'p99 < 500ms (API calls)',
    createLatencySLA: 'p99 < 200ms (writes)',
  },

  architecturalImplications: [
    '✅ Tenant isolation → Every query MUST filter by tenant_id',
    '✅ Shared infrastructure → Optimize for cost efficiency',
    '✅ Resource quotas → Prevent noisy neighbor problems',
    '✅ Tenant routing → Route requests to correct tenant context',
    '✅ Usage metering → Track API calls, storage, users per tenant',
    '✅ Rate limiting → Per-tenant API rate limits',
  ],

  outOfScope: [
    'Multi-region deployment',
    'Advanced compliance features (HIPAA, SOC 2)',
    'White-labeling and custom domains',
    'Advanced analytics and reporting',
    'Multi-tenant search',
    'Tenant data encryption at rest',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple multi-tenant system where organizations can sign up and manage their data. Advanced isolation, quotas, and billing will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to CloudScale Inc! You've been hired to build a multi-tenant SaaS platform.",
  hook: "Your first customer, Acme Corp, wants to sign up and start using your service!",
  challenge: "Set up the basic request flow so tenants can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your SaaS platform is online!',
  achievement: 'Tenants can now send requests to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle tenant operations yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Multi-Tenant Request Flow',
  conceptExplanation: `Every SaaS platform starts with a **Client** connecting to a **Server**.

For multi-tenant SaaS:
1. Multiple tenants (companies) use the **same infrastructure**
2. Each tenant's **Client** sends requests
3. Your **App Server** identifies and routes based on tenant_id
4. All tenants share the same codebase and servers

This is **shared infrastructure multi-tenancy** - the foundation of SaaS economics.`,

  whyItMatters: 'Multi-tenancy allows serving thousands of customers with one system. Without it, you would need separate servers for each customer - impossibly expensive!',

  realWorldExample: {
    company: 'Salesforce',
    scenario: 'Serving 150,000+ customers on shared infrastructure',
    howTheyDoIt: 'All tenants use the same servers and databases. Tenant_id ensures data isolation.',
  },

  keyPoints: [
    'Client = tenant users accessing your SaaS',
    'App Server = shared backend serving all tenants',
    'Multi-tenancy = multiple customers on same infrastructure',
    'Tenant_id = critical for identifying and isolating data',
  ],

  keyConcepts: [
    { title: 'Tenant', explanation: 'A customer organization using your SaaS', icon: '🏢' },
    { title: 'Multi-Tenancy', explanation: 'Multiple tenants sharing same infrastructure', icon: '🏗️' },
    { title: 'Shared Infrastructure', explanation: 'Cost-effective resource sharing', icon: '💰' },
  ],
};

const step1: GuidedStep = {
  id: 'multitenant-saas-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents multiple tenants accessing the SaaS', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles multi-tenant logic', displayName: 'App Server' },
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
// STEP 2: Implement Tenant-Aware APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to handle tenants!",
  hook: "Acme Corp tried to create an account but got a 404 error.",
  challenge: "Write the Python code to create tenants, manage users, and enforce isolation.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your tenant APIs are live!',
  achievement: 'You implemented the core multi-tenant functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can create tenants', after: '✓' },
    { label: 'Can manage users', after: '✓' },
    { label: 'Tenant isolation', after: '✓' },
  ],
  nextTeaser: "But if the server crashes, all tenant data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Tenant-Aware API Implementation: The Isolation Layer',
  conceptExplanation: `Every multi-tenant API must be **tenant-aware**.

For multi-tenant APIs:
- \`create_tenant(name, plan)\` - Create new tenant organization
- \`add_user(tenant_id, user)\` - Add user to tenant
- \`get_data(tenant_id)\` - Fetch ONLY this tenant's data
- \`update_settings(tenant_id, settings)\` - Update tenant config

**Critical rule: Every data query MUST filter by tenant_id**
\`\`\`python
# CORRECT - tenant isolation
data = db.query("SELECT * FROM records WHERE tenant_id = ?", [tenant_id])

# WRONG - data leak risk!
data = db.query("SELECT * FROM records")
\`\`\`

For now, we'll use in-memory storage (Python dictionaries).`,

  whyItMatters: 'A single missing tenant_id check can leak data across companies. This is a catastrophic security breach that destroys trust and violates compliance!',

  famousIncident: {
    title: 'Multi-Tenant Data Leak Crisis',
    company: 'Various SaaS Companies',
    year: '2018-2023',
    whatHappened: 'Multiple SaaS platforms accidentally exposed customer data due to missing tenant_id filters. In one case, a healthcare SaaS leaked patient data across 100+ hospitals. HIPAA violations, lawsuits, and customers fled.',
    lessonLearned: 'Tenant_id filtering must be enforced at the framework level, not left to developers to remember.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'Salesforce',
    scenario: 'Handling 150,000+ tenants with zero data leaks',
    howTheyDoIt: 'Uses ORM-level tenant isolation - tenant_id is automatically injected into every query by the framework',
  },

  keyPoints: [
    'Every API handler needs tenant_id parameter',
    'ALWAYS filter database queries by tenant_id',
    'Use framework-level enforcement, not manual checks',
    'Test for cross-tenant data leakage in every API',
  ],

  quickCheck: {
    question: 'Why must every query filter by tenant_id?',
    options: [
      'It makes queries faster',
      'It prevents data leaks between tenants - critical for security',
      'It reduces memory usage',
      'It\'s required by SQL standards',
    ],
    correctIndex: 1,
    explanation: 'Filtering by tenant_id ensures each tenant only sees their own data. Missing this filter exposes customer data across tenants.',
  },

  keyConcepts: [
    { title: 'Tenant Isolation', explanation: 'Each tenant sees only their own data', icon: '🔒' },
    { title: 'Tenant-Aware Query', explanation: 'Every query filters by tenant_id', icon: '🔍' },
    { title: 'Data Leak', explanation: 'When one tenant sees another\'s data', icon: '🚨' },
  ],
};

const step2: GuidedStep = {
  id: 'multitenant-saas-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Create tenants, FR-2: Manage users, FR-3: Data isolation',
    taskDescription: 'Configure APIs and implement Python handlers with tenant isolation',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/tenants, POST /api/v1/users, GET /api/v1/data APIs',
      'Open the Python tab',
      'Implement create_tenant(), add_user(), get_tenant_data() with tenant_id parameter',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign tenant endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for create_tenant, add_user, and get_tenant_data. Remember: every function needs tenant_id!',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/tenants', 'POST /api/v1/users', 'GET /api/v1/data'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Shared Database with Tenant Isolation
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your server crashed and restarted...",
  hook: "When it came back online, all 100 tenants' data was GONE! Customers are furious!",
  challenge: "Add a database with proper multi-tenant schema design.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your multi-tenant data is safe!',
  achievement: 'Database now stores all tenant data with strict isolation',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Tenant isolation', after: 'Enforced' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But which database strategy should we use: shared or dedicated?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Tenant Database Design: Shared Schema Pattern',
  conceptExplanation: `For multi-tenant SaaS, we use **shared database, shared schema**:

**Schema Design:**
\`\`\`sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  plan VARCHAR(50),
  created_at TIMESTAMP
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,      -- Critical: every table has tenant_id
  email VARCHAR(255),
  name VARCHAR(255),
  INDEX idx_tenant_id (tenant_id),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE TABLE records (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  data JSONB,
  created_at TIMESTAMP,
  INDEX idx_tenant_id (tenant_id),
  INDEX idx_tenant_created (tenant_id, created_at)  -- Composite index
);
\`\`\`

**Why this pattern:**
- All tenants in same tables (shared schema)
- tenant_id column isolates data
- Composite indexes (tenant_id, other_column) for fast queries
- Most cost-effective at scale`,

  whyItMatters: 'Without proper indexes on tenant_id, queries scan millions of rows across all tenants. With indexes, queries are lightning fast.',

  famousIncident: {
    title: 'Multi-Tenant Index Performance Crisis',
    company: 'HubSpot',
    year: '2016',
    whatHappened: 'As HubSpot scaled to 10K+ tenants, queries became unbearably slow. The issue: missing composite indexes on (tenant_id, created_at). Every query scanned entire tables. They had to add indexes during a 6-hour maintenance window.',
    lessonLearned: 'Multi-tenant indexes must be composite: (tenant_id, query_column). Single tenant_id index is not enough for complex queries.',
    icon: '🐌',
  },

  realWorldExample: {
    company: 'Salesforce',
    scenario: 'Storing 150,000+ tenants in shared database',
    howTheyDoIt: 'Uses shared schema with tenant_id on every table. Aggressive indexing strategy: composite indexes on (tenant_id, frequently_queried_column).',
  },

  diagram: `
┌─────────────────────────────────────────┐
│         records table                   │
├──────┬──────────┬────────┬──────────────┤
│  id  │tenant_id │  data  │  created_at  │
├──────┼──────────┼────────┼──────────────┤
│ 001  │   T1     │ {...}  │ 2024-01-01   │
│ 002  │   T2     │ {...}  │ 2024-01-02   │
│ 003  │   T1     │ {...}  │ 2024-01-03   │
│ 004  │   T3     │ {...}  │ 2024-01-04   │
└──────┴──────────┴────────┴──────────────┘
         ↑
         Index on tenant_id enables fast filtering
`,

  keyPoints: [
    'Every table MUST have tenant_id column',
    'Create composite indexes: (tenant_id, frequently_queried_column)',
    'Shared schema is most cost-effective for multi-tenancy',
    'Foreign keys should reference tenant_id for safety',
  ],

  quickCheck: {
    question: 'Why use composite indexes like (tenant_id, created_at)?',
    options: [
      'To save disk space',
      'Enables fast queries that filter by tenant AND sort by date',
      'It\'s required by SQL standards',
      'To reduce memory usage',
    ],
    correctIndex: 1,
    explanation: 'Composite indexes allow database to filter by tenant_id AND use created_at for sorting in a single index scan - much faster.',
  },

  keyConcepts: [
    { title: 'Shared Schema', explanation: 'All tenants use same table structure', icon: '🗄️' },
    { title: 'Composite Index', explanation: 'Index on multiple columns: (tenant_id, col)', icon: '📑' },
    { title: 'Tenant_id Column', explanation: 'Isolates data for each tenant', icon: '🔑' },
  ],
};

const step3: GuidedStep = {
  id: 'multitenant-saas-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need multi-tenant persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store multi-tenant data with tenant_id isolation', displayName: 'PostgreSQL' },
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
    level1: 'Drag a Database (PostgreSQL) component onto the canvas',
    level2: 'Click App Server, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Database Per Tenant vs Shared Database
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🤔',
  scenario: "An enterprise customer wants better isolation and dedicated resources!",
  hook: "They're offering $100K/year but require a dedicated database for compliance. How do we handle this?",
  challenge: "Implement support for both shared and dedicated database strategies.",
  illustration: 'decision-making',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'You support multiple tenant tiers!',
  achievement: 'Flexible database strategy based on tenant size and needs',
  metrics: [
    { label: 'Small tenants', after: 'Shared DB (cost-effective)' },
    { label: 'Enterprise tenants', after: 'Dedicated DB (isolated)' },
    { label: 'Revenue optimization', after: '✓' },
  ],
  nextTeaser: "But how do we route requests to the correct database?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Database Strategies: Shared vs Database-Per-Tenant',
  conceptExplanation: `Multi-tenant database strategies have trade-offs:

**Strategy 1: Shared Database (Recommended for most tenants)**
- All tenants in same database
- tenant_id column isolates data
- Most cost-effective
- Requires careful query filtering
- Used for: Free/Pro tier, small-medium tenants

**Strategy 2: Database Per Tenant**
- Each tenant gets dedicated database
- Complete isolation
- Easier compliance (HIPAA, SOC 2)
- More expensive
- Used for: Enterprise tier, large tenants

**Hybrid Approach (Best Practice):**
- Small tenants → Shared DB
- Large tenants → Dedicated DB
- Tenant metadata tracks which strategy

\`\`\`python
# Tenant routing
def get_database_connection(tenant_id):
    tenant = get_tenant_metadata(tenant_id)
    if tenant.database_strategy == "dedicated":
        return connect_to_dedicated_db(tenant.db_host)
    else:
        return connect_to_shared_db()
\`\`\``,

  whyItMatters: 'Database strategy affects cost, isolation, compliance, and scalability. The right choice depends on tenant tier and requirements.',

  famousIncident: {
    title: 'Salesforce Multi-Tenant Database Evolution',
    company: 'Salesforce',
    year: '2010',
    whatHappened: 'Salesforce started with pure shared database. As they added enterprise customers, they needed dedicated database options for compliance. Built hybrid system: shared DB for 95% of tenants, dedicated for top 5%.',
    lessonLearned: 'Start with shared database for efficiency. Add dedicated option for enterprise tier. Most revenue comes from large tenants.',
    icon: '💼',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Serving 1M+ merchants',
    howTheyDoIt: 'Uses sharded shared databases for most merchants. Shopify Plus (enterprise) customers get dedicated database shards for better performance and isolation.',
  },

  diagram: `
┌────────────────────────────────────────────────┐
│           Multi-Tenant Architecture            │
└────────────────────────────────────────────────┘
         │
         ├─── Small Tenants (80%)
         │    └─→ Shared Database
         │        (tenant_id isolation)
         │
         └─── Enterprise Tenants (20%)
              └─→ Dedicated Database
                  (complete isolation)
`,

  keyPoints: [
    'Shared DB: cost-effective, requires tenant_id filtering',
    'Dedicated DB: better isolation, higher cost',
    'Hybrid approach: shared for small, dedicated for large',
    'Tenant metadata tracks database strategy',
  ],

  quickCheck: {
    question: 'When should you use database-per-tenant strategy?',
    options: [
      'Always - it\'s more secure',
      'For enterprise tier requiring compliance and isolation',
      'Never - shared is always better',
      'Only for small tenants',
    ],
    correctIndex: 1,
    explanation: 'Database-per-tenant is expensive but necessary for enterprise customers requiring strict compliance and isolation.',
  },

  keyConcepts: [
    { title: 'Shared Database', explanation: 'All tenants in same DB with tenant_id', icon: '🗄️' },
    { title: 'Database Per Tenant', explanation: 'Dedicated DB per tenant', icon: '🏢' },
    { title: 'Hybrid Strategy', explanation: 'Mix of shared and dedicated', icon: '⚖️' },
  ],
};

const step4: GuidedStep = {
  id: 'multitenant-saas-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Tenant data isolation (now with flexible strategies)',
    taskDescription: 'Update App Server to support routing to different databases based on tenant tier',
    successCriteria: [
      'Click on App Server',
      'Add API: GET /api/v1/tenant-config',
      'Implement get_database_connection() handler that routes based on tenant metadata',
      'Support both shared and dedicated database strategies',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Add tenant configuration API to App Server',
    level2: 'Implement database routing logic that checks tenant metadata and connects to appropriate database',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/tenant-config'] } },
    ],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer with Tenant Routing
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "You now have 1,000 tenants! Your single app server is overwhelmed.",
  hook: "API requests are timing out. Large tenants are experiencing errors during peak hours!",
  challenge: "Add a load balancer to distribute tenant traffic across multiple servers.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'Multi-tenant traffic is balanced!',
  achievement: 'Load balancer distributes requests across servers',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Request capacity', before: '100 RPS', after: 'Scalable' },
    { label: 'Tenant distribution', after: 'Balanced' },
  ],
  nextTeaser: "But we need to prevent one tenant from hogging all resources...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Tenant Load Balancing: Tenant-Aware Routing',
  conceptExplanation: `A **Load Balancer** distributes incoming requests across servers.

For multi-tenant systems:
- **Aggregate load**: 1,000 tenants × 100 requests/day = 100K requests/day
- **Tenant affinity**: Route same tenant to same server (cache efficiency)
- **Even distribution**: Balance by tenant count or request volume

**Load Balancing Strategies:**
1. **Round-robin** - Simple, works for uniform tenants
2. **Tenant hashing** - Hash(tenant_id) % server_count
3. **Least connections** - Send to server with fewest active connections
4. **Tenant-aware** - Route large tenants to dedicated servers

For multi-tenant, use **tenant hashing** for cache affinity.`,

  whyItMatters: 'Multi-tenant systems have unpredictable load. One large tenant can generate 10x traffic. Load balancers distribute this aggregate load.',

  famousIncident: {
    title: 'Shopify Black Friday Traffic Spike',
    company: 'Shopify',
    year: '2019',
    whatHappened: 'On Black Friday, large merchants generated 100x normal traffic. Load balancers couldn\'t distribute load evenly - some servers were overwhelmed while others were idle. Performance degraded.',
    lessonLearned: 'Multi-tenant load balancing needs tenant-aware routing. Large tenants should be isolated or distributed carefully.',
    icon: '🛒',
  },

  realWorldExample: {
    company: 'Salesforce',
    scenario: 'Handling 150,000+ tenants',
    howTheyDoIt: 'Uses tenant-aware load balancing. Large tenants route to dedicated server pools. Small tenants share capacity.',
  },

  diagram: `
              ┌─────────────┐
              │ App Server 1│
┌────────┐   ┌──────────────┐   │ (Tenants A-J)│
│1000    │──▶│Load Balancer │──▶└─────────────┘
│Tenants │   │(Tenant Hash) │   ┌─────────────┐
└────────┘   └──────────────┘   │ App Server 2│
              │ (Tenants K-T)│
              └─────────────┘
              ┌─────────────┐
              │ App Server 3│
              │ (Tenants U-Z)│
              └─────────────┘
`,

  keyPoints: [
    'Load balancer distributes multi-tenant aggregate traffic',
    'Use tenant hashing for cache affinity',
    'Monitor tenant distribution for balance',
    'Large tenants may need dedicated servers',
  ],

  quickCheck: {
    question: 'Why use tenant hashing for load balancing?',
    options: [
      'It\'s faster',
      'Routes same tenant to same server for cache efficiency',
      'It\'s cheaper',
      'It\'s more secure',
    ],
    correctIndex: 1,
    explanation: 'Tenant hashing ensures requests from the same tenant always go to the same server, maximizing cache hit rate.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Tenant Hashing', explanation: 'Route tenant to same server', icon: '#️⃣' },
    { title: 'Aggregate Load', explanation: 'Combined traffic from all tenants', icon: '📊' },
  ],
};

const step5: GuidedStep = {
  id: 'multitenant-saas-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add a Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute multi-tenant traffic', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
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
// STEP 6: Implement Resource Quotas and Rate Limiting
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🚨',
  scenario: "One large tenant is running millions of API calls per hour!",
  hook: "Their aggressive API usage is slowing down the entire platform. Small tenants are complaining about slow responses!",
  challenge: "Add resource quotas and rate limiting to prevent noisy neighbor problems.",
  illustration: 'resource-overload',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Resource quotas protect all tenants!',
  achievement: 'Rate limiting prevents noisy neighbors',
  metrics: [
    { label: 'Noisy neighbor impact', before: 'All tenants affected', after: 'Isolated' },
    { label: 'API rate limiting', after: 'Per-tenant' },
    { label: 'Fair resource sharing', after: '✓' },
  ],
  nextTeaser: "But we need to track usage for billing...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Resource Quotas: Preventing the Noisy Neighbor Problem',
  conceptExplanation: `In multi-tenant systems, **resource quotas** prevent one tenant from impacting others.

**Types of Quotas:**
1. **Rate Limiting** - API calls per tenant per minute/hour
2. **Storage Quotas** - GB of data per tenant
3. **CPU/Memory Limits** - Compute resources per tenant
4. **Connection Limits** - Max concurrent connections per tenant

**Implementation:**
\`\`\`python
# Rate limiting per tenant
@rate_limit(calls=1000, period="hour", scope="tenant")
def handle_api_request(tenant_id, request):
    # Check tenant's quota
    if exceeds_quota(tenant_id):
        return error_response(429, "Rate limit exceeded")

    # Process request
    return process_request(tenant_id, request)
\`\`\`

**Quota Tiers:**
- Free: 100 API calls/hour
- Pro: 10,000 API calls/hour
- Enterprise: Custom limits`,

  whyItMatters: 'Without quotas, one tenant can consume all resources and degrade service for everyone. This destroys the SaaS value proposition.',

  famousIncident: {
    title: 'AWS API Rate Limit Crisis',
    company: 'AWS',
    year: '2011',
    whatHappened: 'A single customer running aggressive API polling caused cascading failures in EC2. Lack of per-customer rate limits meant the issue spread to all customers. Multi-hour outage.',
    lessonLearned: 'Multi-tenant systems MUST have per-tenant resource quotas. Design quotas into architecture from day 1.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Handling millions of API requests',
    howTheyDoIt: 'Uses Redis-based rate limiting with per-tenant counters. Different rate limits for different API tiers. Real-time quota tracking and enforcement.',
  },

  diagram: `
API Request from Tenant T1
      │
      ▼
┌─────────────────────────────────┐
│  Rate Limiter (Redis)           │
│  Check: T1 API calls this hour  │
└──────────┬──────────────────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
Under Quota   Over Quota
    │             │
    │             └─→ Return 429 (Rate Limited)
    │
    ▼
Process Request
Increment T1 counter
`,

  keyPoints: [
    'Rate limit API calls per tenant per time period',
    'Use Redis for fast quota checking',
    'Different quotas for different pricing tiers',
    'Return 429 status code when quota exceeded',
  ],

  quickCheck: {
    question: 'Why is per-tenant rate limiting critical in multi-tenant SaaS?',
    options: [
      'It makes APIs faster',
      'Prevents one tenant from consuming all resources and impacting others',
      'It reduces costs',
      'It\'s required by law',
    ],
    correctIndex: 1,
    explanation: 'Per-tenant rate limiting prevents the noisy neighbor problem - ensuring one tenant can\'t degrade service for all others.',
  },

  keyConcepts: [
    { title: 'Rate Limiting', explanation: 'Limit API calls per tenant per time', icon: '⏱️' },
    { title: 'Resource Quota', explanation: 'Max resources per tenant', icon: '📊' },
    { title: 'Noisy Neighbor', explanation: 'One tenant impacting others', icon: '📢' },
  ],
};

const step6: GuidedStep = {
  id: 'multitenant-saas-step-6',
  stepNumber: 6,
  frIndex: 2,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-3: Tenant isolation (now with resource quotas)',
    taskDescription: 'Add Cache for rate limiting and implement quota checking',
    componentsNeeded: [
      { type: 'cache', reason: 'Track API rate limits per tenant', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added',
      'App Server connected to Cache',
      'Implement per-tenant rate limiting in code',
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
    level1: 'Add a Redis Cache for tracking rate limits',
    level2: 'Connect App Server to Cache, then implement rate limiting logic that increments tenant counters',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 7: Add Usage Tracking for Billing
// =============================================================================

const step7Story: StoryContent = {
  emoji: '💰',
  scenario: "It's billing time! But we don't know how much to charge each tenant.",
  hook: "Finance needs accurate usage metrics: API calls, storage, active users per tenant. How do we track this?",
  challenge: "Add usage tracking and metering for tenant billing.",
  illustration: 'billing-report',
};

const step7Celebration: CelebrationContent = {
  emoji: '💳',
  message: 'Usage tracking is live!',
  achievement: 'You can now bill tenants based on actual usage',
  metrics: [
    { label: 'API call tracking', after: 'Per-tenant' },
    { label: 'Storage metering', after: 'Per-tenant' },
    { label: 'User count tracking', after: 'Per-tenant' },
    { label: 'Billing-ready data', after: '✓' },
  ],
  nextTeaser: "But we need database replication for reliability...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Usage Metering: The Foundation of SaaS Billing',
  conceptExplanation: `SaaS billing requires accurate **usage tracking** per tenant.

**What to Track:**
1. **API Calls** - Count requests per tenant per day/month
2. **Storage** - GB of data stored per tenant
3. **Active Users** - Number of seats per tenant
4. **Compute Time** - CPU/memory usage (for compute-heavy SaaS)

**Implementation Pattern:**
\`\`\`python
# Track usage in background
def track_api_call(tenant_id, endpoint):
    # Increment counter in time-series DB
    usage_db.increment(
        metric="api_calls",
        tenant_id=tenant_id,
        timestamp=now(),
        endpoint=endpoint
    )

# Monthly aggregation for billing
def calculate_monthly_usage(tenant_id, month):
    api_calls = usage_db.sum("api_calls", tenant_id, month)
    storage_gb = usage_db.max("storage_used", tenant_id, month)
    active_users = usage_db.distinct_count("users", tenant_id, month)

    return {
        "api_calls": api_calls,
        "storage_gb": storage_gb,
        "active_users": active_users,
        "total_cost": calculate_cost(...)
    }
\`\`\`

**Metering via Message Queue:**
- API call → Publish usage event to queue
- Background worker → Aggregate and store in time-series DB`,

  whyItMatters: 'Accurate usage tracking enables fair, usage-based pricing. It\'s how SaaS companies align cost with value delivered to customers.',

  famousIncident: {
    title: 'AWS Billing Accuracy Issues',
    company: 'AWS',
    year: '2008',
    whatHappened: 'Early AWS billing had accuracy problems - customers were over-charged or under-charged due to usage metering bugs. Led to customer complaints and loss of trust.',
    lessonLearned: 'Usage metering must be 100% accurate and auditable. Use immutable event logs and multiple validation layers.',
    icon: '💸',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Billing millions of API customers',
    howTheyDoIt: 'Uses Kafka for usage event streaming. Time-series database (InfluxDB) stores per-tenant metrics. Daily aggregation jobs calculate billing.',
  },

  diagram: `
API Request
      │
      ├─→ Process Request
      │
      └─→ Publish Usage Event
           │
           ▼
    ┌─────────────────┐
    │  Message Queue  │
    │  (Usage Events) │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  Usage Worker   │
    │  (Aggregation)  │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  Time-Series DB │
    │  (Metrics per   │
    │   tenant)       │
    └─────────────────┘
`,

  keyPoints: [
    'Track API calls, storage, users per tenant',
    'Use message queue for async usage tracking',
    'Store in time-series database for aggregation',
    'Immutable event logs for audit trail',
  ],

  quickCheck: {
    question: 'Why track usage asynchronously via message queue?',
    options: [
      'It\'s cheaper',
      'Don\'t slow down API requests with tracking overhead',
      'It uses less memory',
      'It\'s more secure',
    ],
    correctIndex: 1,
    explanation: 'Async usage tracking via queue ensures API requests remain fast. Background workers handle aggregation without impacting user experience.',
  },

  keyConcepts: [
    { title: 'Usage Metering', explanation: 'Track consumption per tenant', icon: '📊' },
    { title: 'Time-Series DB', explanation: 'Store metrics over time', icon: '📈' },
    { title: 'Async Tracking', explanation: 'Don\'t slow down API with metering', icon: '⚡' },
  ],
};

const step7: GuidedStep = {
  id: 'multitenant-saas-step-7',
  stepNumber: 7,
  frIndex: 4,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-5: Usage tracking & billing',
    taskDescription: 'Add Message Queue for async usage tracking',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Async usage event tracking', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue component onto the canvas',
    level2: 'Connect App Server to Message Queue for publishing usage events',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Add Database Replication
// =============================================================================

const step8Story: StoryContent = {
  emoji: '⚠️',
  scenario: "The database crashed for 30 minutes this morning!",
  hook: "All 1,000 tenants were offline. Revenue loss: $50,000. Customers demand 99.99% uptime SLA!",
  challenge: "Add database replication for high availability.",
  illustration: 'database-failure',
};

const step8Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Database is fault-tolerant!',
  achievement: 'Replication ensures tenant data survives failures',
  metrics: [
    { label: 'Database availability', before: '99%', after: '99.99%' },
    { label: 'Data loss on failure', before: 'Possible', after: 'Zero' },
    { label: 'Read capacity', before: '1x', after: '3x' },
  ],
  nextTeaser: "One more step: cost optimization...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Tenant Database Replication: Shared Infrastructure HA',
  conceptExplanation: `For multi-tenant SaaS, database replication is **critical** - one failure impacts ALL tenants.

**Replication Strategy:**
- **Primary (Leader)**: Handles all writes for all tenants
- **Replicas (Followers)**: Handle reads, stay in sync
- **Tenant-agnostic**: Replication copies ALL tenant data

**Read Scaling:**
Route queries to replicas:
- Read-heavy queries → Replica
- Writes → Primary only
- Tenant queries distributed across replicas

**Failover:**
If primary fails:
1. Promote replica to primary
2. All tenants automatically reconnect
3. Zero data loss with synchronous replication`,

  whyItMatters: 'A single database failure affects ALL tenants. In multi-tenant SaaS, availability is multiplied across thousands of customers!',

  famousIncident: {
    title: 'Salesforce Database Outage',
    company: 'Salesforce',
    year: '2016',
    whatHappened: 'Database failure affected thousands of customers for 6+ hours. Failover automation failed. Lost revenue: estimated $50M+ across all affected tenants.',
    lessonLearned: 'Multi-tenant replication must have automated, tested failover. Manual failover is too slow when thousands of tenants are affected.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'Salesforce',
    scenario: 'Zero tolerance for downtime',
    howTheyDoIt: 'Multi-region replication with automatic failover. Each tenant\'s data replicated across 3+ availability zones.',
  },

  keyPoints: [
    'Replication copies ALL tenant data',
    'Use synchronous replication for zero data loss',
    'Route reads to replicas to scale',
    'Automated failover is critical for multi-tenant',
  ],

  quickCheck: {
    question: 'Why is database replication more critical for multi-tenant SaaS?',
    options: [
      'It makes queries faster',
      'A single database failure affects thousands of tenants simultaneously',
      'It reduces costs',
      'It\'s required by compliance',
    ],
    correctIndex: 1,
    explanation: 'In multi-tenant SaaS, one database serves all tenants. A failure impacts everyone, making replication essential.',
  },

  keyConcepts: [
    { title: 'Multi-Tenant HA', explanation: 'High availability for all tenants', icon: '🛡️' },
    { title: 'Failover', explanation: 'Automatic promotion of replica', icon: '🔄' },
    { title: 'Read Scaling', explanation: 'Route queries to replicas', icon: '📖' },
  ],
};

const step8: GuidedStep = {
  id: 'multitenant-saas-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs need fault-tolerant storage',
    taskDescription: 'Enable database replication with at least 2 replicas',
    successCriteria: [
      'Click on the Database component',
      'Go to Configuration tab',
      'Enable replication',
      'Set replica count to 2 or more',
    ],
  },

  celebration: step8Celebration,

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
  },

  hints: {
    level1: 'Click on the Database, then find the replication settings',
    level2: 'Enable replication and set replicas to 2+',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 9: Cost Optimization
// =============================================================================

const step9Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Infrastructure costs: $50K/month for 1,000 tenants!",
  hook: "That's $50 per tenant per month. Most tenants pay $20/month. You're losing money!",
  challenge: "Optimize multi-tenant infrastructure to achieve profitability.",
  illustration: 'budget-crisis',
};

const step9Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a Multi-Tenant SaaS Platform!',
  achievement: 'A scalable, profitable multi-tenant architecture',
  metrics: [
    { label: 'Monthly infrastructure cost', before: '$50K', after: 'Under $25K' },
    { label: 'Cost per tenant', before: '$50', after: '<$25' },
    { label: 'Tenant isolation', after: '100%' },
    { label: 'API latency', after: '<500ms' },
    { label: 'Availability', after: '99.99%' },
  ],
  nextTeaser: "You've mastered multi-tenant SaaS architecture!",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Tenant Cost Optimization: SaaS Economics',
  conceptExplanation: `Multi-tenant SaaS profitability depends on **resource sharing efficiency**.

**Cost Optimization Strategies:**

1. **Tenant Tiering:**
- Small tenants (<10 users) → Shared everything
- Medium tenants (10-100 users) → Shared DB, dedicated app servers
- Large tenants (100+ users) → Dedicated infrastructure

2. **Resource Right-Sizing:**
- Database: 2 replicas (not 5)
- Cache: Size based on active tenants
- Auto-scale app servers based on aggregate load
- Use spot instances for non-critical workers

3. **Storage Optimization:**
- Compress tenant data
- Archive inactive tenants to cold storage
- Deduplicate common data

4. **Query Optimization:**
- Aggressive caching (reduce DB load)
- Connection pooling (reuse DB connections)
- Batch processing for usage tracking

**The Multi-Tenant Economics:**
- Fixed cost per tenant: $2 (storage, compute baseline)
- Variable cost: Scales with usage
- Target: <$20 per tenant at scale for 80%+ gross margin`,

  whyItMatters: 'Multi-tenant SaaS only works if shared infrastructure costs less than dedicated. Optimize to achieve 70-80% gross margin.',

  famousIncident: {
    title: 'Salesforce Path to Profitability',
    company: 'Salesforce',
    year: '2003-2006',
    whatHappened: 'Salesforce operated at a loss for years due to infrastructure costs. Breakthrough came from aggressive multi-tenant optimization: shared database, metadata caching, tiered isolation. Achieved profitability in 2006.',
    lessonLearned: 'Multi-tenant cost optimization is what makes SaaS business models viable. It\'s not just engineering - it\'s economics.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Serving 1M+ merchants profitably',
    howTheyDoIt: 'Extreme resource sharing for small merchants. Shopify Plus (enterprise) gets dedicated resources. Cost per small merchant: ~$5/month.',
  },

  keyPoints: [
    'Multi-tenant success requires ruthless cost optimization',
    'Tier tenants: shared for small, dedicated for large',
    'Auto-scale based on aggregate tenant usage',
    'Target 70-80% gross margin',
  ],

  quickCheck: {
    question: 'What makes multi-tenant SaaS more cost-effective than single-tenant?',
    options: [
      'It\'s faster',
      'Resource sharing - 1,000 tenants share same infrastructure',
      'It\'s easier to build',
      'It uses less memory',
    ],
    correctIndex: 1,
    explanation: 'Multi-tenancy amortizes infrastructure costs across thousands of customers. This enables profitable SaaS at scale.',
  },

  keyConcepts: [
    { title: 'Resource Sharing', explanation: 'Multiple tenants on same infrastructure', icon: '🏗️' },
    { title: 'Tenant Tiering', explanation: 'Allocate resources based on size', icon: '📊' },
    { title: 'SaaS Economics', explanation: 'Profitability through efficiency', icon: '💰' },
  ],
};

const step9: GuidedStep = {
  id: 'multitenant-saas-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered profitably',
    taskDescription: 'Optimize system to stay under $25K/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $25K/month',
      'Maintain: tenant isolation, rate limiting, reliability',
    ],
  },

  celebration: step9Celebration,

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
    requireCacheStrategy: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component for over-provisioning',
    level2: 'Optimal config: 2 DB replicas, moderate cache, right-sized instances',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const multiTenantSaasGuidedTutorial: GuidedTutorial = {
  problemId: 'multitenant-saas',
  title: 'Design Multi-Tenant SaaS Platform',
  description: 'Build a scalable multi-tenant SaaS with tenant isolation, resource quotas, and usage-based billing',
  difficulty: 'advanced',
  estimatedMinutes: 55,

  welcomeStory: {
    emoji: '🚀',
    hook: "You've been hired as Lead Architect at CloudScale Inc!",
    scenario: "Your mission: Build a multi-tenant SaaS platform that serves thousands of customers on shared infrastructure with perfect data isolation and fair resource allocation.",
    challenge: "Can you design a system with tenant isolation, resource quotas, and usage-based billing?",
  },

  requirementsPhase: multiTenantSaasRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9],

  // Meta information
  concepts: [
    'Multi-Tenancy',
    'Tenant Isolation',
    'Shared Infrastructure',
    'Database Per Tenant vs Shared',
    'Tenant Routing',
    'Resource Quotas',
    'Rate Limiting',
    'Noisy Neighbor Prevention',
    'Usage Metering',
    'SaaS Billing',
    'Load Balancing',
    'Database Replication',
    'Cost Optimization',
    'SaaS Economics',
  ],

  ddiaReferences: [
    'Chapter 2: Data Models (Multi-tenant schema design)',
    'Chapter 3: Storage (Shared vs dedicated databases)',
    'Chapter 5: Replication (Multi-tenant replication)',
    'Chapter 6: Partitioning (Tenant-based partitioning)',
  ],
};

export default multiTenantSaasGuidedTutorial;
