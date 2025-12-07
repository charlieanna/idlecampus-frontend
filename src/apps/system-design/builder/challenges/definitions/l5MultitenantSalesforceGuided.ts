import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Salesforce Multi-tenant Platform Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial that teaches multi-tenancy concepts
 * while building a Salesforce-style CRM platform.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-4: Build basic working system (FR satisfaction)
 * Steps 5-10: Scale with NFRs (metadata isolation, custom fields, shared infrastructure)
 *
 * Key Concepts:
 * - Tenant isolation (data, schema, configuration)
 * - Shared infrastructure (database, app servers)
 * - Metadata-driven architecture (custom fields, objects, workflows)
 * - Multi-tenant security and performance
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const salesforceRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a multi-tenant CRM platform like Salesforce",

  interviewer: {
    name: 'Alex Rivera',
    role: 'VP of Engineering at CloudCRM Inc.',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-crm',
      category: 'functional',
      question: "What are the core CRM features customers need?",
      answer: "Customers need to:\n\n1. **Manage accounts** - Store customer/company information\n2. **Manage contacts** - People associated with accounts\n3. **Track opportunities** - Sales pipeline and deals\n4. **Create custom fields** - Add company-specific data fields to any object\n5. **Run reports** - Query and visualize CRM data",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4, FR-5',
      learningPoint: "CRM platforms provide structured data management with customization for each company's unique needs",
    },
    {
      id: 'multi-tenancy',
      category: 'functional',
      question: "How is data separated between different companies (tenants)?",
      answer: "Each company is a **separate tenant** with:\n- **Complete data isolation** - Company A cannot see Company B's data\n- **Shared infrastructure** - All tenants use the same database and servers\n- **Tenant-specific customization** - Custom fields, workflows unique to each company\n\nThis is **shared database, shared schema** multi-tenancy with a tenant_id column.",
      importance: 'critical',
      revealsRequirement: 'NFR-1',
      learningPoint: "Multi-tenancy maximizes resource efficiency while maintaining strict security boundaries",
    },
    {
      id: 'custom-fields',
      category: 'functional',
      question: "How do customers add their own custom fields?",
      answer: "Customers can **dynamically add fields** without code changes:\n- Click 'Add Field' in UI\n- Specify field name, type (text, number, date, picklist)\n- Field is immediately available on forms and reports\n\nThis is **metadata-driven**: field definitions stored in metadata tables, data stored in flexible JSON or EAV pattern.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Metadata-driven architecture allows customers to customize without developer involvement",
    },
    {
      id: 'custom-objects',
      category: 'clarification',
      question: "Can customers create entirely new object types (beyond Account/Contact/Opportunity)?",
      answer: "Yes! For MVP, let's support:\n- **Standard objects**: Account, Contact, Opportunity (pre-built)\n- **Custom objects**: Customers can create new entity types\n\nFor now, focus on custom fields. Custom objects can come in v2.",
      importance: 'important',
      insight: "Custom objects require full metadata engine - good to defer for MVP",
    },
    {
      id: 'data-sharing',
      category: 'security',
      question: "Within a tenant, how is data access controlled?",
      answer: "Within each company (tenant):\n- **Role-based access** - Admin, Sales Rep, Manager roles\n- **Record-level security** - User can only see their own opportunities\n- **Field-level security** - Hide salary fields from non-managers\n\nFor MVP, implement basic role-based access. Fine-grained permissions come later.",
      importance: 'important',
      insight: "Start with tenant-level isolation, add internal permissions in v2",
    },
    {
      id: 'api-access',
      category: 'functional',
      question: "Do customers need API access to their CRM data?",
      answer: "Yes! Every tenant gets a **REST API** to:\n- Query records: GET /api/v1/accounts\n- Create/update: POST/PUT /api/v1/contacts\n- Use their unique tenant_id for authentication\n\nThis enables integrations with external systems.",
      importance: 'critical',
      revealsRequirement: 'FR-6',
      learningPoint: "APIs are critical for CRM - customers integrate with marketing, support, billing systems",
    },

    // SCALE & NFRs
    {
      id: 'throughput-tenants',
      category: 'throughput',
      question: "How many companies (tenants) should we support?",
      answer: "10,000 active tenants, ranging from:\n- Small: 5-10 users, 1,000 records\n- Medium: 50-100 users, 50,000 records\n- Large: 500-1,000 users, 1M+ records\n\nMost tenants are small, but system must handle large tenants efficiently.",
      importance: 'critical',
      learningPoint: "Multi-tenant systems have huge variance - design for both small and large tenants",
    },
    {
      id: 'throughput-requests',
      category: 'throughput',
      question: "How many API requests per day?",
      answer: "100 million API requests per day across all tenants",
      importance: 'critical',
      calculation: {
        formula: "100M ÷ 86,400 sec = 1,157 requests/sec",
        result: "~1,200 RPS average, ~3,600 RPS peak",
      },
      learningPoint: "Shared infrastructure must handle aggregate load from all tenants",
    },
    {
      id: 'latency-queries',
      category: 'latency',
      question: "How fast should queries return?",
      answer: "p99 under 300ms for queries returning <1,000 records. Large reports can be slower (async processing).",
      importance: 'critical',
      learningPoint: "Multi-tenant queries must be optimized with proper indexing on tenant_id",
    },
    {
      id: 'tenant-isolation',
      category: 'security',
      question: "What happens if there's a bug that exposes one tenant's data to another?",
      answer: "This is **catastrophic and illegal**. Tenant data leaks violate:\n- SOC 2 compliance\n- Customer trust\n- Privacy regulations (GDPR)\n\nMUST have:\n- Tenant_id on every query (enforced by framework)\n- Audit logging of all data access\n- Automated tests for cross-tenant leakage",
      importance: 'critical',
      learningPoint: "Tenant isolation is non-negotiable - a single leak can destroy the business",
    },
    {
      id: 'metadata-scale',
      category: 'payload',
      question: "How many custom fields can a tenant create?",
      answer: "Up to 500 custom fields per standard object. Metadata table will have ~5M field definitions (10K tenants × 500 fields).",
      importance: 'important',
      insight: "Metadata queries must be cached aggressively to avoid database overload",
    },
    {
      id: 'noisy-neighbor',
      category: 'reliability',
      question: "What if one large tenant runs expensive queries that slow down everyone?",
      answer: "This is the **noisy neighbor problem**. Solutions:\n- **Query timeout** - Kill queries running >30 seconds\n- **Rate limiting** - Limit queries per tenant\n- **Resource quotas** - CPU/memory limits per tenant\n- **Query cost analysis** - Warn customers about expensive queries",
      importance: 'critical',
      insight: "Multi-tenancy requires strict resource isolation to prevent one tenant from impacting others",
    },
    {
      id: 'backup-restore',
      category: 'reliability',
      question: "If a customer accidentally deletes all their data, can they restore it?",
      answer: "Yes! Each tenant needs:\n- **Soft deletes** - Records marked as deleted, not actually removed\n- **Recycle bin** - Recover deleted records within 30 days\n- **Point-in-time restore** - Restore tenant data to any point in last 7 days",
      importance: 'important',
      insight: "Tenant-specific backups are complex in shared database - use soft deletes for quick recovery",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-crm', 'multi-tenancy', 'custom-fields'],
  criticalFRQuestionIds: ['core-crm', 'custom-fields', 'api-access'],
  criticalScaleQuestionIds: ['throughput-tenants', 'tenant-isolation', 'noisy-neighbor'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Manage accounts',
      description: 'Create, read, update, delete customer/company records',
      emoji: '🏢',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Manage contacts',
      description: 'Store people associated with accounts',
      emoji: '👤',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Track opportunities',
      description: 'Sales pipeline and deal tracking',
      emoji: '💰',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Create custom fields',
      description: 'Tenants can add company-specific fields dynamically',
      emoji: '🔧',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Run reports',
      description: 'Query and visualize CRM data',
      emoji: '📊',
    },
    {
      id: 'fr-6',
      text: 'FR-6: REST API access',
      description: 'Programmatic access to CRM data for integrations',
      emoji: '🔌',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50,000 users (across 10K tenants)',
    writesPerDay: '20 million writes',
    readsPerDay: '100 million reads',
    peakMultiplier: 3,
    readWriteRatio: '5:1',
    calculatedWriteRPS: { average: 231, peak: 693 },
    calculatedReadRPS: { average: 1157, peak: 3472 },
    maxPayloadSize: '~10KB (record with custom fields)',
    storagePerRecord: '~5KB',
    storageGrowthPerYear: '~40TB',
    redirectLatencySLA: 'p99 < 300ms (queries)',
    createLatencySLA: 'p99 < 200ms (writes)',
  },

  architecturalImplications: [
    '✅ Tenant isolation → Every query MUST filter by tenant_id',
    '✅ Shared infrastructure → Database partitioning by tenant_id for performance',
    '✅ Custom fields → Metadata-driven schema with JSON/EAV storage',
    '✅ Noisy neighbor → Rate limiting and query timeouts per tenant',
    '✅ Metadata caching → Cache field definitions to reduce DB load',
    '✅ Multi-tenant queries → Composite indexes on (tenant_id, created_at)',
  ],

  outOfScope: [
    'Custom objects (only custom fields)',
    'Complex workflows and automation',
    'Email integration',
    'Mobile apps',
    'Advanced reporting (Tableau-like)',
    'Multi-currency support',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple multi-tenant system where companies can manage accounts and contacts. Custom fields and advanced isolation will come in later steps. Functionality first, then metadata-driven customization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🏢',
  scenario: "Welcome to CloudCRM Inc! You've been hired to build the next Salesforce.",
  hook: "Your first customer, Acme Corp, just signed up. They're ready to manage their customer data!",
  challenge: "Set up the basic request flow so companies can reach your CRM server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your multi-tenant CRM is online!',
  achievement: 'Companies can now send requests to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle CRM operations yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Multi-Tenant Architecture',
  conceptExplanation: `Every SaaS platform starts with a **Client** connecting to a **Server**.

For a multi-tenant CRM:
1. Multiple companies (tenants) use the **same infrastructure**
2. Each company's **Client** (browser, mobile app) sends requests
3. Your **App Server** routes requests based on tenant_id
4. All tenants share the same codebase and database

This is **shared infrastructure multi-tenancy** - the foundation of SaaS economics.`,

  whyItMatters: 'Multi-tenancy allows serving thousands of customers with one system. Without it, you would need separate servers for each company - impossibly expensive!',

  realWorldExample: {
    company: 'Salesforce',
    scenario: 'Serving 150,000+ customers on shared infrastructure',
    howTheyDoIt: 'All tenants use the same database, app servers, and metadata engine. Tenant_id column ensures data isolation.',
  },

  keyPoints: [
    'Client = company\'s users accessing the CRM',
    'App Server = shared backend serving all tenants',
    'Multi-tenancy = multiple customers on same infrastructure',
    'Tenant_id = critical for data isolation',
  ],

  keyConcepts: [
    { title: 'Tenant', explanation: 'A customer company using your CRM', icon: '🏢' },
    { title: 'Multi-Tenancy', explanation: 'Multiple tenants sharing same infrastructure', icon: '🏗️' },
    { title: 'Tenant ID', explanation: 'Unique identifier isolating tenant data', icon: '🔑' },
  ],
};

const step1: GuidedStep = {
  id: 'salesforce-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents multiple tenants accessing the CRM', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles multi-tenant CRM logic', displayName: 'App Server' },
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
// STEP 2: Implement CRM APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to manage CRM data!",
  hook: "Acme Corp tried to create an Account but got a 404 error.",
  challenge: "Write the Python code to handle accounts, contacts, and opportunities.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your CRM APIs are live!',
  achievement: 'You implemented the core CRM functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can manage accounts', after: '✓' },
    { label: 'Can manage contacts', after: '✓' },
    { label: 'Can track opportunities', after: '✓' },
  ],
  nextTeaser: "But if the server crashes, all CRM data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Tenant API Implementation: Tenant Awareness',
  conceptExplanation: `Every CRM API must be **tenant-aware**.

For multi-tenant APIs:
- \`create_account(tenant_id, data)\` - Create account for specific tenant
- \`get_accounts(tenant_id)\` - Fetch ONLY this tenant's accounts
- \`update_contact(tenant_id, contact_id, data)\` - Update contact
- \`create_opportunity(tenant_id, data)\` - Track sales opportunity

**Critical rule: Every query MUST filter by tenant_id**
\`\`\`python
# CORRECT - tenant isolation
accounts = db.query("SELECT * FROM accounts WHERE tenant_id = ?", [tenant_id])

# WRONG - data leak risk!
accounts = db.query("SELECT * FROM accounts")
\`\`\`

For now, we'll use in-memory storage (Python dictionaries).`,

  whyItMatters: 'A single missing tenant_id check can leak data across companies. This is a catastrophic security breach!',

  famousIncident: {
    title: 'SaaS Data Leak from Missing Tenant Filter',
    company: 'Multiple SaaS Companies',
    year: '2018-2022',
    whatHappened: 'Multiple SaaS platforms accidentally exposed customer data due to missing tenant_id filters in queries. In one case, a healthcare SaaS leaked patient data across 50+ hospitals. HIPAA violations, lawsuits, and reputational damage.',
    lessonLearned: 'Tenant_id filtering must be enforced at the framework level, not left to developers to remember.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'Salesforce',
    scenario: 'Handling 3,600 requests/second across tenants',
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
    explanation: 'Filtering by tenant_id ensures each company only sees their own data. Missing this filter exposes customer data.',
  },

  keyConcepts: [
    { title: 'Tenant Isolation', explanation: 'Each tenant sees only their own data', icon: '🔒' },
    { title: 'Tenant-Aware Query', explanation: 'Every query filters by tenant_id', icon: '🔍' },
    { title: 'Data Leak', explanation: 'When one tenant sees another\'s data', icon: '🚨' },
  ],
};

const step2: GuidedStep = {
  id: 'salesforce-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Accounts, FR-2: Contacts, FR-3: Opportunities',
    taskDescription: 'Configure APIs and implement Python handlers with tenant isolation',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/accounts, POST /api/v1/contacts, POST /api/v1/opportunities APIs',
      'Open the Python tab',
      'Implement create_account(), create_contact(), create_opportunity() with tenant_id parameter',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign CRM endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for create_account, create_contact, and create_opportunity. Remember: every function needs tenant_id!',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/accounts', 'POST /api/v1/contacts', 'POST /api/v1/opportunities'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Multi-Tenant Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your server crashed and restarted...",
  hook: "When it came back online, Acme Corp's 1,000 customer accounts were GONE! They're threatening to cancel.",
  challenge: "Add a database with proper multi-tenant schema design.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your multi-tenant data is safe!',
  achievement: 'Database now stores all tenant data with proper isolation',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Tenant isolation', after: 'Enforced' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But queries are slow without proper indexing for multi-tenancy...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Tenant Database Design: Shared Schema Pattern',
  conceptExplanation: `For multi-tenant systems, we use **shared database, shared schema**:

**Schema Design:**
\`\`\`sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,      -- Critical: every table has tenant_id
  name VARCHAR(255),
  industry VARCHAR(100),
  created_at TIMESTAMP,
  INDEX idx_tenant_id (tenant_id),           -- Single-column index
  INDEX idx_tenant_created (tenant_id, created_at)  -- Composite index
);

CREATE TABLE contacts (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  account_id UUID,
  name VARCHAR(255),
  email VARCHAR(255),
  INDEX idx_tenant_id (tenant_id)
);
\`\`\`

**Why this pattern:**
- All tenants in same tables (shared schema)
- tenant_id column isolates data
- Composite indexes (tenant_id, other_column) for fast queries
- Most cost-effective at scale`,

  whyItMatters: 'Without proper indexes on tenant_id, queries scan millions of rows across all tenants. With indexes, queries are lightning fast.',

  famousIncident: {
    title: 'Multi-Tenant Query Performance Crisis',
    company: 'HubSpot',
    year: '2016',
    whatHappened: 'As HubSpot scaled to 10K+ tenants, queries became unbearably slow. The issue: missing composite indexes on (tenant_id, created_at). Every query scanned the entire table. They had to add indexes during a 6-hour maintenance window.',
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
│         accounts table                  │
├──────┬──────────┬────────┬──────────────┤
│  id  │tenant_id │  name  │   industry   │
├──────┼──────────┼────────┼──────────────┤
│ 001  │   T1     │ Acme   │ Manufacturing│
│ 002  │   T2     │ Beta   │ Tech         │
│ 003  │   T1     │ Ajax   │ Retail       │
│ 004  │   T3     │ Zeta   │ Finance      │
└──────┴──────────┴────────┴──────────────┘
         ↑
         Index on tenant_id enables fast filtering
`,

  keyPoints: [
    'Every table MUST have tenant_id column',
    'Create composite indexes: (tenant_id, frequently_queried_column)',
    'Shared schema is most cost-effective for multi-tenancy',
    'Foreign keys should include tenant_id for safety',
  ],

  quickCheck: {
    question: 'Why use composite indexes like (tenant_id, created_at) instead of just tenant_id?',
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
  id: 'salesforce-step-3',
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
// STEP 4: Implement Custom Fields (Metadata-Driven Architecture)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🔧',
  scenario: "Acme Corp needs to track 'Annual Revenue' on accounts, but it's not a standard field!",
  hook: "They're asking: 'Can we add custom fields without waiting for your engineering team?' Every customer has unique data needs!",
  challenge: "Implement metadata-driven custom fields so tenants can self-service.",
  illustration: 'customization',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎨',
  message: 'Tenants can now customize their CRM!',
  achievement: 'Metadata-driven architecture enables self-service customization',
  metrics: [
    { label: 'Custom fields supported', after: '✓' },
    { label: 'Zero-code customization', after: '✓' },
    { label: 'Tenant autonomy', after: 'Enabled' },
  ],
  nextTeaser: "But metadata queries are slow - need caching...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Metadata-Driven Architecture: The Salesforce Secret Sauce',
  conceptExplanation: `**Metadata-driven** means field definitions are stored as data, not code.

**Architecture:**

1. **Metadata Tables** - Define custom fields
\`\`\`sql
CREATE TABLE custom_fields (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  object_name VARCHAR(50),    -- 'Account', 'Contact', etc.
  field_name VARCHAR(100),     -- 'Annual_Revenue__c'
  field_type VARCHAR(20),      -- 'Number', 'Text', 'Date'
  INDEX idx_tenant_object (tenant_id, object_name)
);
\`\`\`

2. **Flexible Data Storage** - Store custom field values
Option A: JSON column
\`\`\`sql
ALTER TABLE accounts ADD COLUMN custom_data JSONB;
-- Query: WHERE custom_data->>'Annual_Revenue__c' > 1000000
\`\`\`

Option B: EAV (Entity-Attribute-Value)
\`\`\`sql
CREATE TABLE custom_field_values (
  tenant_id UUID,
  object_id UUID,
  field_id UUID,
  value TEXT
);
\`\`\`

Salesforce uses a hybrid approach with custom storage optimizations.`,

  whyItMatters: 'Without metadata-driven architecture, every custom field request requires code deployment. With it, customers customize instantly!',

  famousIncident: {
    title: 'Salesforce Multi-Tenant Metadata Innovation',
    company: 'Salesforce',
    year: '2003',
    whatHappened: 'Salesforce pioneered metadata-driven multi-tenancy, allowing customers to create custom fields in seconds. Competitors required weeks for customization. This became Salesforce\'s key differentiator and moat.',
    lessonLearned: 'Metadata-driven architecture is what makes true SaaS possible. It enables customer autonomy at scale.',
    icon: '🚀',
  },

  realWorldExample: {
    company: 'Salesforce',
    scenario: '150,000+ tenants with millions of custom fields',
    howTheyDoIt: 'Stores field metadata in custom_field_definition table. Uses hybrid storage: pivot tables for high-cardinality fields, JSON for low-cardinality.',
  },

  diagram: `
Tenant creates custom field "Annual_Revenue__c"
      │
      ▼
┌─────────────────────────────────────────┐
│   custom_fields (metadata)              │
├─────┬──────────┬────────┬───────────────┤
│ T1  │ Account  │Annual_R│ Number        │
└─────┴──────────┴────────┴───────────────┘
      │
      ▼
┌─────────────────────────────────────────┐
│   accounts.custom_data (JSONB)          │
├──────┬──────────┬─────────────────────┬──┤
│ 001  │   T1     │ {"Annual_Revenue__c"│  │
│      │          │  : 5000000}         │  │
└──────┴──────────┴─────────────────────┴──┘
`,

  keyPoints: [
    'Metadata = field definitions stored as data',
    'Two tables: custom_fields (metadata) + custom_data (values)',
    'Use JSONB for flexible schema in PostgreSQL',
    'Cache metadata aggressively - it changes rarely',
  ],

  quickCheck: {
    question: 'Why is metadata-driven architecture critical for multi-tenant SaaS?',
    options: [
      'It makes queries faster',
      'Enables customers to customize without code deployment',
      'It reduces storage costs',
      'It\'s required by compliance',
    ],
    correctIndex: 1,
    explanation: 'Metadata-driven architecture allows customers to add fields instantly without developer involvement. This is the essence of SaaS.',
  },

  keyConcepts: [
    { title: 'Metadata', explanation: 'Field definitions stored as data', icon: '📋' },
    { title: 'JSONB', explanation: 'PostgreSQL JSON with indexing support', icon: '📦' },
    { title: 'EAV Pattern', explanation: 'Entity-Attribute-Value for flexible schema', icon: '🔀' },
  ],
};

const step4: GuidedStep = {
  id: 'salesforce-step-4',
  stepNumber: 4,
  frIndex: 3,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-4: Create custom fields (metadata-driven)',
    taskDescription: 'Update App Server to support custom field creation and querying',
    successCriteria: [
      'Click on App Server',
      'Add APIs: POST /api/v1/custom-fields, GET /api/v1/metadata',
      'Implement create_custom_field() and get_metadata() handlers',
      'Ensure metadata queries filter by tenant_id',
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
    level1: 'Add metadata APIs to App Server: POST /api/v1/custom-fields and GET /api/v1/metadata',
    level2: 'Implement handlers that store field definitions in custom_fields table, values in JSONB column',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/custom-fields', 'GET /api/v1/metadata'] } },
    ],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 5: Add Cache for Metadata
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 1,000 tenants with 500 custom fields each. Metadata queries are crushing the database!",
  hook: "Every page load fetches metadata for custom fields. Database CPU is at 90%. Response times: 2-3 seconds!",
  challenge: "Add a cache to speed up metadata lookups.",
  illustration: 'slow-loading',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Metadata lookups are 100x faster!',
  achievement: 'Caching eliminated metadata query bottleneck',
  metrics: [
    { label: 'Metadata query latency', before: '200ms', after: '2ms' },
    { label: 'Cache hit rate', after: '98%' },
    { label: 'Database CPU', before: '90%', after: '30%' },
  ],
  nextTeaser: "But what happens when traffic spikes across all tenants?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Metadata Caching: The Multi-Tenant Performance Multiplier',
  conceptExplanation: `Metadata changes rarely but is read constantly. This is perfect for caching!

**Caching Strategy:**
\`\`\`python
# Cache key includes tenant_id for isolation
cache_key = f"metadata:tenant:{tenant_id}:object:Account"

# Try cache first
metadata = redis.get(cache_key)
if metadata is None:
    # Cache miss - query database
    metadata = db.query("SELECT * FROM custom_fields WHERE tenant_id = ? AND object_name = ?",
                       [tenant_id, "Account"])
    # Store in cache with 1-hour TTL
    redis.setex(cache_key, 3600, json.dumps(metadata))
\`\`\`

**Cache Invalidation:**
When tenant creates/updates custom field:
\`\`\`python
# Invalidate tenant's metadata cache
redis.delete(f"metadata:tenant:{tenant_id}:*")
\`\`\`

**For multi-tenant caching:**
- Include tenant_id in cache key (isolation)
- Use longer TTL for metadata (1-24 hours)
- Invalidate on metadata changes`,

  whyItMatters: 'Without caching, every API call queries metadata tables. With 10K tenants × 500 fields, that is millions of unnecessary database queries!',

  famousIncident: {
    title: 'Salesforce Metadata Caching Evolution',
    company: 'Salesforce',
    year: '2010',
    whatHappened: 'As Salesforce grew to 100K+ tenants, metadata queries became a major bottleneck. They rebuilt their entire metadata caching layer, reducing database load by 90%.',
    lessonLearned: 'Multi-tenant metadata must be cached aggressively. Metadata queries outnumber data queries 10:1.',
    icon: '📊',
  },

  realWorldExample: {
    company: 'Salesforce',
    scenario: 'Serving metadata for millions of custom fields',
    howTheyDoIt: 'Multi-tier caching: in-memory cache → Redis → Database. Metadata has 24-hour TTL. Cache hit rate >99%.',
  },

  diagram: `
API Request → Need Account custom fields for tenant T1
      │
      ▼
┌─────────────────────────────────────────┐
│  Check Cache                            │
│  Key: "metadata:T1:Account"             │
└──────────┬──────────────────────────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
Cache Hit     Cache Miss
(98%)         (2%)
    │             │
    │             ▼
    │      Query Database
    │      Store in cache
    │             │
    └─────────────┘
           │
           ▼
    Return metadata
    (2ms instead of 200ms)
`,

  keyPoints: [
    'Cache metadata with tenant_id in key for isolation',
    'Use long TTL (1-24 hours) - metadata changes rarely',
    'Invalidate cache when tenant updates custom fields',
    'Multi-tenant caching can achieve 98%+ hit rate',
  ],

  quickCheck: {
    question: 'Why is metadata caching more effective than data caching in multi-tenant systems?',
    options: [
      'Metadata is smaller',
      'Metadata changes rarely but is read constantly - perfect for caching',
      'Metadata caching is easier to implement',
      'It uses less memory',
    ],
    correctIndex: 1,
    explanation: 'Metadata (field definitions) is read on every API call but changes rarely when tenants add/modify fields. This high read-to-write ratio makes caching extremely effective.',
  },

  keyConcepts: [
    { title: 'Metadata Cache', explanation: 'Cache field definitions per tenant', icon: '📋' },
    { title: 'Cache Key', explanation: 'Include tenant_id for isolation', icon: '🔑' },
    { title: 'Cache Invalidation', explanation: 'Clear cache when metadata changes', icon: '🔄' },
  ],
};

const step5: GuidedStep = {
  id: 'salesforce-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-4: Custom fields now load instantly',
    taskDescription: 'Add a Redis cache for metadata between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache custom field metadata per tenant', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (3600 seconds for metadata)',
      'Cache strategy set (cache-aside)',
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
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect App Server to Cache. Then click Cache and set TTL to 3600 seconds (1 hour), strategy to cache-aside',
    solutionComponents: [{ type: 'cache', config: { ttl: 3600, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 6: Add Load Balancer for Multi-Tenant Traffic
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔥',
  scenario: "You now have 10,000 tenants! Traffic just hit 3,600 requests/second.",
  hook: "Your single app server is maxed out. API requests are timing out. Large tenants are experiencing errors!",
  challenge: "Add a load balancer to distribute multi-tenant traffic.",
  illustration: 'server-overload',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Multi-tenant traffic is now distributed!',
  achievement: 'Load balancer enables horizontal scaling across tenants',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Request capacity', before: '1K RPS', after: 'Ready to scale' },
  ],
  nextTeaser: "But we need database replication for high availability...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Tenant Load Balancing: Handling Aggregate Traffic',
  conceptExplanation: `A **Load Balancer** distributes requests from all tenants across multiple app servers.

**Multi-Tenant Considerations:**
- **Aggregate traffic**: 10K tenants × 100 requests/day = 1M requests/day
- **Noisy neighbors**: Large tenants can overwhelm a server
- **Even distribution**: Round-robin or least-connections

**Load Balancing Strategies:**
1. **Round-robin** - Simple, works for most tenants
2. **Tenant-based sharding** - Route specific tenants to specific servers
3. **Request-based** - Route by request type (read vs write)

For MVP, use round-robin. Tenant sharding comes later for noisy neighbor mitigation.`,

  whyItMatters: 'Multi-tenant systems have unpredictable load. One large tenant can spike traffic 10x. Load balancers distribute this aggregate load.',

  famousIncident: {
    title: 'Salesforce Service Outage from Traffic Spike',
    company: 'Salesforce',
    year: '2019',
    whatHappened: 'A few large tenants ran expensive reports simultaneously, overwhelming specific app servers. Load balancer couldn\'t distribute load evenly. Multi-hour outage for thousands of customers.',
    lessonLearned: 'Multi-tenant load balancing needs tenant-aware routing and resource quotas to prevent noisy neighbors.',
    icon: '📈',
  },

  realWorldExample: {
    company: 'Salesforce',
    scenario: 'Handling 3,600 RPS across 150K tenants',
    howTheyDoIt: 'Uses multi-tier load balancing with tenant-aware routing. Large tenants are isolated to dedicated server pools.',
  },

  diagram: `
              ┌─────────────┐
              │ App Server 1│
┌────────┐   ┌──────────────┐   └─────────────┘
│10K     │──▶│Load Balancer │──▶ App Server 2
│Tenants │   └──────────────┘   ┌─────────────┐
└────────┘                       │ App Server 3│
              └─────────────┘

       Round-robin distribution
       Each server handles ~3,333 tenants
`,

  keyPoints: [
    'Load balancer distributes multi-tenant aggregate traffic',
    'Round-robin works for most multi-tenant scenarios',
    'Tenant-aware routing prevents noisy neighbor issues',
    'Enable horizontal scaling as tenant count grows',
  ],

  quickCheck: {
    question: 'Why is load balancing more critical for multi-tenant systems?',
    options: [
      'Multi-tenant systems have higher traffic from aggregate tenants',
      'Load balancers are faster',
      'It reduces costs',
      'It improves security',
    ],
    correctIndex: 0,
    explanation: 'With thousands of tenants, aggregate traffic is unpredictable. Load balancers distribute this combined load across servers.',
  },

  keyConcepts: [
    { title: 'Aggregate Traffic', explanation: 'Combined load from all tenants', icon: '📊' },
    { title: 'Round-Robin', explanation: 'Distribute requests evenly', icon: '🔄' },
    { title: 'Noisy Neighbor', explanation: 'One tenant overwhelming resources', icon: '📢' },
  ],
};

const step6: GuidedStep = {
  id: 'salesforce-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add a Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute multi-tenant traffic across servers', displayName: 'Load Balancer' },
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
// STEP 7: Add Database Replication for Multi-Tenant Reliability
// =============================================================================

const step7Story: StoryContent = {
  emoji: '⚠️',
  scenario: "CATASTROPHE! The database crashed for 30 minutes.",
  hook: "During that time:\n- 10,000 tenants couldn't access their CRM\n- Sales teams lost millions in productivity\n- Customers are demanding SLAs",
  challenge: "Add database replication so multi-tenant data is always available.",
  illustration: 'database-failure',
};

const step7Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Multi-tenant data is now fault-tolerant!',
  achievement: 'Replication ensures all tenant data survives failures',
  metrics: [
    { label: 'Database availability', before: '99%', after: '99.99%' },
    { label: 'Data loss on failure', before: 'Possible', after: 'Zero' },
    { label: 'Read capacity', before: '1x', after: '3x' },
  ],
  nextTeaser: "But we need message queues for async processing...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Tenant Database Replication: Shared Infrastructure HA',
  conceptExplanation: `For multi-tenant systems, database replication is **critical** - one failure impacts ALL tenants.

**Replication Strategy:**
- **Primary (Leader)**: Handles all writes for all tenants
- **Replicas (Followers)**: Handle reads, stay in sync
- **Tenant-agnostic**: Replication copies ALL tenant data

**Read Scaling:**
Route queries to replicas:
- Tenant metadata queries → Replica
- Tenant data queries → Replica
- Writes → Primary only

**Failover:**
If primary fails:
1. Promote replica to primary
2. All tenants automatically reconnect
3. Zero data loss with synchronous replication`,

  whyItMatters: 'A single database failure affects ALL tenants. In multi-tenant systems, availability is multiplied across thousands of customers!',

  famousIncident: {
    title: 'Salesforce Major Database Outage',
    company: 'Salesforce',
    year: '2016',
    whatHappened: 'A database failure affected thousands of customers for 6+ hours. The issue: failover automation failed, requiring manual intervention. Lost revenue: estimated $50M+ across all affected tenants.',
    lessonLearned: 'Multi-tenant replication must have automated, tested failover. Manual failover is too slow when thousands of tenants are affected.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'Salesforce',
    scenario: 'Zero tolerance for downtime across 150K tenants',
    howTheyDoIt: 'Multi-region replication with automatic failover. Each tenant\'s data is replicated across 3+ availability zones.',
  },

  diagram: `
                         ┌──────────────────┐
                         │  Primary (Write) │
                         │  ALL TENANTS     │
                         └────────┬─────────┘
                                  │ Replication
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
       ┌───────────┐       ┌───────────┐       ┌───────────┐
       │ Replica 1 │       │ Replica 2 │       │ Replica 3 │
       │  (Read)   │       │  (Read)   │       │  (Read)   │
       │ALL TENANTS│       │ALL TENANTS│       │ALL TENANTS│
       └───────────┘       └───────────┘       └───────────┘
`,

  keyPoints: [
    'Replication is tenant-agnostic - copies ALL tenant data',
    'Use synchronous replication for zero data loss',
    'Route reads to replicas to scale query capacity',
    'Automated failover is critical when thousands of tenants depend on you',
  ],

  quickCheck: {
    question: 'Why is database replication more critical for multi-tenant systems?',
    options: [
      'It makes queries faster',
      'A single database failure affects thousands of tenants simultaneously',
      'It reduces costs',
      'It\'s required by compliance',
    ],
    correctIndex: 1,
    explanation: 'In multi-tenant systems, one database serves all tenants. A failure impacts everyone, making replication essential.',
  },

  keyConcepts: [
    { title: 'Multi-Tenant HA', explanation: 'High availability for all tenants', icon: '🛡️' },
    { title: 'Failover', explanation: 'Automatic promotion of replica', icon: '🔄' },
    { title: 'Read Scaling', explanation: 'Route queries to replicas', icon: '📖' },
  ],
};

const step7: GuidedStep = {
  id: 'salesforce-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs need fault-tolerant storage',
    taskDescription: 'Enable database replication with at least 2 replicas',
    successCriteria: [
      'Click on the Database component',
      'Go to Configuration tab',
      'Enable replication',
      'Set replica count to 2 or more',
      'Set replication mode to synchronous',
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
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Click on the Database, then find the replication settings in Configuration',
    level2: 'Enable replication, set replicas to 2+, and choose synchronous mode for zero data loss',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2, mode: 'synchronous' } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Message Queue for Async Reports
// =============================================================================

const step8Story: StoryContent = {
  emoji: '📊',
  scenario: "Tenants are running massive reports across millions of records!",
  hook: "A tenant ran a report across 5M accounts. The API timed out after 30 seconds. They're furious!",
  challenge: "Add a message queue for async report generation.",
  illustration: 'report-timeout',
};

const step8Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Reports are now processed asynchronously!',
  achievement: 'Users get instant response, reports delivered when ready',
  metrics: [
    { label: 'Report timeouts', before: '50%', after: '0%' },
    { label: 'User wait time', before: '30s+', after: '<1s' },
    { label: 'Can process', after: 'Unlimited size reports' },
  ],
  nextTeaser: "But we need search infrastructure for fast queries...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Async Processing for Multi-Tenant Reports',
  conceptExplanation: `Large reports can't block API requests. Use **async processing** via message queues.

**Flow:**
1. User requests report → API returns job_id immediately
2. Report request published to queue
3. Background worker picks up job
4. Worker runs query (may take minutes)
5. Worker stores result in S3/Cloud Storage
6. Worker updates job status to "completed"
7. User polls /api/v1/reports/job_id or gets email notification

**Multi-Tenant Queue Processing:**
\`\`\`python
# Queue message includes tenant_id
message = {
  "job_id": "report-123",
  "tenant_id": "T1",
  "report_type": "accounts",
  "filters": {...}
}

# Worker enforces tenant isolation
def process_report(message):
    tenant_id = message["tenant_id"]
    # Query MUST filter by tenant_id
    results = db.query("SELECT * FROM accounts WHERE tenant_id = ?", [tenant_id])
\`\`\``,

  whyItMatters: 'Without async processing, large tenant reports block API servers and time out. With queues, reports of any size complete successfully.',

  famousIncident: {
    title: 'HubSpot Report Queue Overload',
    company: 'HubSpot',
    year: '2018',
    whatHappened: 'A bug caused report workers to run inefficient queries. Queue backed up to 100K+ jobs. Reports took days to complete. Had to pause all report generation and rebuild worker infrastructure.',
    lessonLearned: 'Multi-tenant async workers need: query timeouts, tenant resource limits, and queue monitoring.',
    icon: '⏱️',
  },

  realWorldExample: {
    company: 'Salesforce',
    scenario: 'Generating millions of reports daily',
    howTheyDoIt: 'Uses Kafka for job queue. Dedicated worker pools per tenant tier (small, medium, large) to prevent noisy neighbors.',
  },

  diagram: `
User Requests Report
      │
      ▼
┌─────────────┐     ┌─────────────────────────────────────┐
│ App Server  │────▶│       Message Queue                 │
│ (instant)   │     │  [{job_id, tenant_id, filters}...]  │
└─────────────┘     └──────────────┬──────────────────────┘
      │                            │
      │ Return job_id              │ Workers consume
      ▼                            ▼
                          ┌─────────────────┐
                          │ Report Workers  │
                          │  (background)   │
                          └────────┬────────┘
                                   │
                                   ▼
                          Run query (with tenant_id filter)
                          Store results in S3
                          Update job status
`,

  keyPoints: [
    'Queue decouples report request from execution',
    'User gets instant job_id response',
    'Workers process reports in background with tenant isolation',
    'Critical for handling large multi-tenant reports',
  ],

  quickCheck: {
    question: 'Why use message queues for multi-tenant reports?',
    options: [
      'It\'s cheaper',
      'Enables async processing so large reports don\'t timeout',
      'It uses less memory',
      'It improves security',
    ],
    correctIndex: 1,
    explanation: 'Async processing via queues allows reports of any size to complete. Users don\'t wait, and API servers aren\'t blocked.',
  },

  keyConcepts: [
    { title: 'Async Processing', explanation: 'Decouple request from execution', icon: '⚡' },
    { title: 'Job Queue', explanation: 'Buffer for background tasks', icon: '📬' },
    { title: 'Worker Pool', explanation: 'Background processors', icon: '⚙️' },
  ],
};

const step8: GuidedStep = {
  id: 'salesforce-step-8',
  stepNumber: 8,
  frIndex: 4,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-5: Run reports (now async for large queries)',
    taskDescription: 'Add a Message Queue for async report generation',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Process large reports asynchronously', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
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
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async report processing.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 9: Add Search Service (Elasticsearch)
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🔍',
  scenario: "Tenants need to search across millions of records instantly!",
  hook: "A tenant searches for 'John' in contacts. The database query scans 5M rows and takes 10 seconds. Unacceptable!",
  challenge: "Add Elasticsearch for fast, multi-tenant full-text search.",
  illustration: 'search-slow',
};

const step9Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Search is now lightning fast!',
  achievement: 'Elasticsearch enables sub-second search across millions of records',
  metrics: [
    { label: 'Search latency', before: '10s', after: '<200ms' },
    { label: 'Full-text search', after: 'Enabled' },
    { label: 'Fuzzy matching', after: 'Supported' },
  ],
  nextTeaser: "But we need to optimize costs for all these tenants...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Tenant Search with Elasticsearch',
  conceptExplanation: `Database LIKE queries don't scale for full-text search. Use **Elasticsearch**.

**Multi-Tenant Search Design:**

1. **Index per tenant** (small tenants):
\`\`\`
Index: tenant_T1_accounts
Index: tenant_T2_accounts
\`\`\`

2. **Shared index with tenant_id filter** (medium/large):
\`\`\`
Index: all_accounts
Filter: { "term": { "tenant_id": "T1" } }
\`\`\`

3. **Indexing Pipeline:**
- Database change → Message queue → Search indexer
- Indexer publishes to tenant-specific index
- Search queries include tenant_id filter

**Query Example:**
\`\`\`json
GET /all_accounts/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "name": "John" } },
        { "term": { "tenant_id": "T1" } }  // Critical: tenant isolation
      ]
    }
  }
}
\`\`\``,

  whyItMatters: 'Database full-text search is too slow for multi-million record searches. Elasticsearch makes search instant with proper indexing.',

  famousIncident: {
    title: 'Salesforce Search Performance Crisis',
    company: 'Salesforce',
    year: '2015',
    whatHappened: 'Search queries were running directly on production databases, causing CPU spikes. Large tenants brought down search for everyone. Had to rebuild entire search infrastructure on dedicated Elasticsearch cluster.',
    lessonLearned: 'Multi-tenant search MUST be on dedicated infrastructure, separate from transactional database.',
    icon: '🔍',
  },

  realWorldExample: {
    company: 'Salesforce',
    scenario: 'Searching across billions of records',
    howTheyDoIt: 'Uses dedicated Elasticsearch clusters. Hybrid approach: index-per-tenant for small, shared index with filtering for large tenants.',
  },

  diagram: `
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  Database   │────▶│Message Queue │────▶│   Indexer    │
│  (Source)   │     │ (CDC events) │     │   Worker     │
└─────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
                                                 ▼
                                        ┌────────────────┐
                                        │ Elasticsearch  │
                                        │  Index per     │
┌──────────┐     ┌─────────────┐      │  Tenant        │
│  Client  │────▶│ App Server  │─────▶│                │
│ (Search) │     └─────────────┘      │  Filter by     │
└──────────┘                            │  tenant_id     │
                                        └────────────────┘
`,

  keyPoints: [
    'Use Elasticsearch for multi-tenant full-text search',
    'Index-per-tenant for small, shared index for large tenants',
    'ALWAYS filter queries by tenant_id for isolation',
    'Async indexing via message queue prevents database load',
  ],

  quickCheck: {
    question: 'Why is tenant_id filtering critical in shared Elasticsearch indexes?',
    options: [
      'It makes search faster',
      'It prevents data leaks - tenants must only see their data',
      'It reduces index size',
      'It\'s required by Elasticsearch',
    ],
    correctIndex: 1,
    explanation: 'Without tenant_id filtering, search queries could return results from other tenants - a catastrophic data leak.',
  },

  keyConcepts: [
    { title: 'Full-Text Search', explanation: 'Search across text fields efficiently', icon: '🔍' },
    { title: 'Search Index', explanation: 'Optimized structure for fast queries', icon: '📑' },
    { title: 'Tenant Filtering', explanation: 'Isolate search results by tenant_id', icon: '🔒' },
  ],
};

const step9: GuidedStep = {
  id: 'salesforce-step-9',
  stepNumber: 9,
  frIndex: 4,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-5: Run reports (now with fast search)',
    taskDescription: 'Add Elasticsearch for multi-tenant search',
    componentsNeeded: [
      { type: 'search_service', reason: 'Enable fast full-text search across tenants', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Search Service component added',
      'App Server connected to Search Service',
      'Message Queue connected to Search Service (for indexing)',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue', 'search_service'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'search_service' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Drag a Search Service (Elasticsearch) component onto the canvas',
    level2: 'Connect App Server to Search Service for queries. This enables fast multi-tenant search.',
    solutionComponents: [{ type: 'search_service' }],
    solutionConnections: [
      { from: 'app_server', to: 'search_service' },
    ],
  },
};

// =============================================================================
// STEP 10: Cost Optimization for Multi-Tenancy
// =============================================================================

const step10Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Infrastructure costs: $800K/month for 10K tenants!",
  hook: "That's $80 per tenant per month. Your pricing is $50/tenant. You're losing money!",
  challenge: "Optimize multi-tenant infrastructure to achieve profitability.",
  illustration: 'budget-crisis',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Salesforce!',
  achievement: 'A scalable, profitable multi-tenant CRM platform',
  metrics: [
    { label: 'Monthly infrastructure cost', before: '$800K', after: 'Under $400K' },
    { label: 'Cost per tenant', before: '$80', after: '<$40' },
    { label: 'Query latency', after: '<300ms' },
    { label: 'Multi-tenant isolation', after: '100%' },
    { label: 'Custom fields supported', after: '✓' },
  ],
  nextTeaser: "You've mastered multi-tenant architecture!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Tenant Cost Optimization: The Economics of SaaS',
  conceptExplanation: `Multi-tenant SaaS profitability depends on **resource sharing efficiency**.

**Cost Optimization Strategies:**

1. **Tenant Tiering:**
- Small tenants (<100 users) → Shared resources
- Medium tenants (100-500 users) → Dedicated app servers
- Large tenants (500+ users) → Isolated infrastructure

2. **Resource Right-Sizing:**
- Database: 2 replicas (not 5)
- Cache: Size based on metadata volume
- Search: Shared index for small tenants
- App Servers: Auto-scale based on aggregate load

3. **Storage Optimization:**
- Archive old records to cheap cold storage (S3 Glacier)
- Compress custom field JSON
- Deduplicate metadata across tenants

4. **Query Optimization:**
- Aggressive metadata caching (98%+ hit rate)
- Database connection pooling
- Read replicas for heavy queries

**The Multi-Tenant Economics:**
- Fixed cost per tenant: $5 (storage, backup)
- Variable cost: Scales with usage
- Target: <$40 per tenant at scale`,

  whyItMatters: 'Multi-tenant SaaS only works if shared infrastructure costs less than dedicated. Optimize to achieve 80%+ gross margin.',

  famousIncident: {
    title: 'Salesforce Path to Profitability',
    company: 'Salesforce',
    year: '2003-2006',
    whatHappened: 'Salesforce operated at a loss for years due to infrastructure costs. Breakthrough came from aggressive multi-tenant optimization: shared database, metadata caching, tiered tenant isolation. Achieved profitability in 2006.',
    lessonLearned: 'Multi-tenant cost optimization is what makes SaaS business models viable. It\'s not just engineering - it\'s economics.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Salesforce',
    scenario: 'Serving 150K+ tenants profitably',
    howTheyDoIt: 'Extreme resource sharing for small tenants, tiered isolation for large. Metadata caching >99%. Custom hardware optimizations. Cost per tenant: ~$30.',
  },

  keyPoints: [
    'Multi-tenant success requires ruthless cost optimization',
    'Tier tenants: shared resources for small, isolated for large',
    'Cache metadata aggressively to reduce database load',
    'Auto-scale based on aggregate tenant usage patterns',
  ],

  quickCheck: {
    question: 'What makes multi-tenant SaaS more cost-effective than single-tenant?',
    options: [
      'It\'s faster',
      'Resource sharing - 10K tenants share same database and servers',
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

const step10: GuidedStep = {
  id: 'salesforce-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered profitably',
    taskDescription: 'Optimize multi-tenant system to stay under $400K/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $400K/month',
      'Maintain: tenant isolation, custom fields, search, reliability',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue', 'search_service'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'search_service' },
    ],
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component for over-provisioning. Focus on: DB replicas, cache size, search cluster size',
    level2: 'Optimal config: 2 DB replicas, moderate cache, shared search index. Metadata caching is critical for cost.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const l5MultitenantSalesforceGuidedTutorial: GuidedTutorial = {
  problemId: 'salesforce-multitenant',
  title: 'Design Salesforce Multi-Tenant Platform',
  description: 'Build a multi-tenant CRM with tenant isolation, custom fields, and metadata-driven architecture',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '🏢',
    hook: "You've been hired as Lead Architect at CloudCRM Inc!",
    scenario: "Your mission: Build a Salesforce-like multi-tenant CRM that serves thousands of companies on shared infrastructure with perfect data isolation.",
    challenge: "Can you design a system with tenant isolation, custom fields, and metadata-driven customization?",
  },

  requirementsPhase: salesforceRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  // Meta information
  concepts: [
    'Multi-Tenancy',
    'Tenant Isolation',
    'Shared Infrastructure',
    'Metadata-Driven Architecture',
    'Custom Fields',
    'Composite Indexes',
    'Multi-Tenant Caching',
    'Load Balancing',
    'Database Replication',
    'Async Processing',
    'Full-Text Search',
    'Noisy Neighbor Prevention',
    'SaaS Economics',
  ],

  ddiaReferences: [
    'Chapter 2: Data Models (Flexible schema with JSON)',
    'Chapter 3: Storage (Multi-tenant database design)',
    'Chapter 5: Replication (Shared database replication)',
    'Chapter 10: Batch Processing (Async report generation)',
  ],
};

export default l5MultitenantSalesforceGuidedTutorial;
