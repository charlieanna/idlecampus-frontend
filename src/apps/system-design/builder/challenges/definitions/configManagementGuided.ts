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
 * Config Management Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial that teaches configuration management concepts
 * while building a production-ready config service.
 *
 * Flow:
 * Phase 0: Requirements gathering (config types, hot reload, environment separation)
 * Steps 1-3: Build basic config storage and retrieval
 * Steps 4-6: Add config versioning, feature flags, gradual rollout
 *
 * Key Concepts:
 * - Centralized configuration management
 * - Hot reload without restarts
 * - Environment-specific configs (dev/staging/prod)
 * - Config versioning and rollback
 * - Feature flags and gradual rollout
 * - Config validation and safety
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const configManagementRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a centralized configuration management system for microservices",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Principal Platform Engineer',
    avatar: '👩‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-config-ops',
      category: 'functional',
      question: "What are the fundamental operations a config management system needs?",
      answer: "The system needs to support:\n1. **Store configs** - Upload configuration key-value pairs\n2. **Retrieve configs** - Applications fetch their configs on startup\n3. **Update configs** - Change config values without code deployment\n4. **Hot reload** - Apps pick up changes without restart\n\nThink of it like environment variables, but centralized and dynamic!",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Config management decouples application code from runtime configuration",
    },
    {
      id: 'config-types',
      category: 'functional',
      question: "What types of configuration do applications need?",
      answer: "Several categories:\n1. **Database connections** - DB URLs, credentials, pool sizes\n2. **Feature flags** - Enable/disable features (canary releases)\n3. **Rate limits** - API throttling thresholds\n4. **Service endpoints** - URLs for dependent services\n5. **Business logic** - Tax rates, pricing rules\n\nAll must be changeable without code deployment!",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Different config types have different update frequencies and risk profiles",
    },
    {
      id: 'hot-reload',
      category: 'functional',
      question: "How quickly should config changes take effect?",
      answer: "**Near real-time hot reload** - ideally within seconds:\n- Application polls config service every 30-60 seconds\n- OR config service pushes changes via WebSocket/long-polling\n- App reloads configs WITHOUT restart\n\nExample: Change rate limit from 100 to 50 req/sec - takes effect in < 1 minute across ALL instances!",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Hot reload enables rapid response to incidents without deploying code",
    },

    // IMPORTANT - Clarifications
    {
      id: 'environment-separation',
      category: 'clarification',
      question: "How do we handle different configs for dev/staging/prod environments?",
      answer: "Use **namespaces** or **environments**:\n- dev/app-name/database-url = localhost:5432\n- staging/app-name/database-url = staging-db.internal\n- prod/app-name/database-url = prod-db.internal\n\nEach app fetches from its environment namespace. Prevents accidentally using prod DB in dev!",
      importance: 'important',
      insight: "Environment separation is critical for safety - dev changes shouldn't affect prod",
    },
    {
      id: 'config-validation',
      category: 'clarification',
      question: "What if someone uploads an invalid config that breaks production?",
      answer: "Need validation and safety:\n1. **Schema validation** - configs must match expected format (int, string, URL, etc.)\n2. **Rollback** - keep version history, revert bad changes\n3. **Gradual rollout** - apply to 1% of instances first, monitor, then expand\n4. **Approval workflow** - require approval for prod changes",
      importance: 'important',
      insight: "Config changes are deployments - treat them with the same safety as code deployments",
    },
    {
      id: 'secrets-management',
      category: 'clarification',
      question: "How do we handle sensitive configs like API keys and passwords?",
      answer: "For MVP, store encrypted but focus on non-sensitive configs first. Production needs:\n- Encryption at rest and in transit\n- Access controls (only authorized apps can read specific configs)\n- Audit logging (who changed what, when)\n- Integration with secret managers (AWS Secrets Manager, HashiCorp Vault)",
      importance: 'important',
      insight: "Secrets management is complex - start with non-sensitive configs, plan for encryption",
    },

    // SCOPE
    {
      id: 'scope-single-region',
      category: 'scope',
      question: "Should this work across multiple regions/data centers?",
      answer: "Start with single region. Multi-region adds complexity:\n- Replication lag between regions\n- Eventual consistency challenges\n- Network latency for cross-region fetches\n\nFor global apps, each region can have its own config service instance.",
      importance: 'nice-to-have',
      insight: "Multi-region config management requires careful consistency management",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many config reads per second should we support?",
      answer: "If we have 1,000 microservice instances, each polling every 60 seconds:\n- 1,000 instances ÷ 60 seconds = ~17 reads/sec baseline\n- But during deploys, ALL instances restart and fetch configs\n- Deploy spike: 1,000 instances × 1 read = 1,000 reads in ~1 minute\n\nPlan for **100-1,000 reads/sec** during deployment storms.",
      importance: 'critical',
      calculation: {
        formula: "1K instances ÷ 60s = 17 steady-state, 1K during deploys",
        result: "~100-1,000 reads/sec peak",
      },
      learningPoint: "Config services see spiky traffic during deployments - need to handle bursts",
    },
    {
      id: 'throughput-writes',
      category: 'throughput',
      question: "How often do config values change?",
      answer: "Writes are much less frequent than reads:\n- Most configs change weekly or monthly\n- Feature flags change daily\n- Emergency changes (like rate limits during incidents) happen occasionally\n\nExpect **< 10 writes/minute** normally, with occasional bursts.",
      importance: 'important',
      learningPoint: "Config systems are extremely read-heavy (99.9% reads)",
    },
    {
      id: 'latency-config-fetch',
      category: 'latency',
      question: "How fast should config fetches be?",
      answer: "Applications fetch configs on startup, so latency is critical for boot time:\n- Target: p99 < 100ms\n- If config fetch takes 5 seconds, app startup is delayed by 5 seconds\n- During deploys with 100 instances starting simultaneously, slow fetches block rollout",
      importance: 'critical',
      learningPoint: "Slow config fetches delay application startup and deployments",
    },
    {
      id: 'availability-requirement',
      category: 'burst',
      question: "What happens if the config service goes down?",
      answer: "This is critical - apps MUST keep running even if config service is down!\n\n**Solution: Local caching**\n- Apps cache fetched configs on disk\n- If config service is down, use cached configs\n- Cache can be hours/days old, but app stays running\n\nTarget: 99.9% config service availability, but 100% app availability via cache.",
      importance: 'critical',
      insight: "Config service outage shouldn't take down applications - caching is mandatory",
    },
    {
      id: 'consistency-model',
      category: 'burst',
      question: "Do all app instances need to see config changes simultaneously?",
      answer: "No! **Eventual consistency is fine**:\n- Instance A fetches new config at 12:00:00\n- Instance B fetches at 12:01:00 (1 minute lag)\n- Temporary inconsistency is acceptable\n\nFor critical changes (like disabling a broken feature), can force-restart all instances.",
      importance: 'important',
      learningPoint: "Config consistency can be eventual - simplifies architecture significantly",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-config-ops', 'config-types', 'hot-reload'],
  criticalFRQuestionIds: ['core-config-ops', 'config-types', 'hot-reload'],
  criticalScaleQuestionIds: ['throughput-reads', 'latency-config-fetch', 'availability-requirement'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Store and retrieve configs',
      description: 'Central storage for application configuration key-value pairs',
      emoji: '📦',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Environment separation',
      description: 'Different configs for dev/staging/prod environments',
      emoji: '🌍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Hot reload without restart',
      description: 'Applications pick up config changes within seconds',
      emoji: '🔥',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Config versioning',
      description: 'Track config history and enable rollback',
      emoji: '📚',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Feature flags',
      description: 'Enable/disable features dynamically',
      emoji: '🚩',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1,000 microservice instances',
    writesPerDay: '~1,000 config updates',
    readsPerDay: '1.4 million config fetches',
    peakMultiplier: 10,
    readWriteRatio: '1000:1 (read-heavy)',
    calculatedWriteRPS: { average: 0.01, peak: 10 },
    calculatedReadRPS: { average: 17, peak: 1000 },
    maxPayloadSize: '~10KB per config',
    redirectLatencySLA: 'p99 < 100ms',
  },

  architecturalImplications: [
    '✅ Extremely read-heavy → Aggressive caching essential',
    '✅ Bursty traffic during deploys → Need to handle 1K reads/sec',
    '✅ Config service down → Apps must use cached configs',
    '✅ Hot reload → Polling or push mechanism needed',
    '✅ Environment separation → Namespace-based storage',
    '✅ Versioning → Track all config changes with timestamps',
  ],

  outOfScope: [
    'Multi-region replication',
    'Advanced secret encryption (AWS KMS integration)',
    'Complex approval workflows',
    'Schema migration tools',
    'Config drift detection',
  ],

  keyInsight: "Configuration is code! Just like code deployments, config changes need versioning, rollback, and safety mechanisms. First, let's build basic storage and retrieval. Then we'll add versioning, feature flags, and gradual rollout for production safety.",
};

// =============================================================================
// STEP 1: Connect Client to Config Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome! Your company has 50 microservices, each with hardcoded configs in environment variables.",
  hook: "Changing a database URL requires redeploying all 50 services! This takes hours and creates risk. You need centralized config management!",
  challenge: "Set up a config server that applications can connect to for centralized configuration.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your config server is online!',
  achievement: 'Applications can now connect to fetch configurations',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can accept requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't store any configs yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Centralized Configuration Management',
  conceptExplanation: `**The problem with hardcoded configs:**
- Each service has configs in environment variables or config files
- Changing a database URL = redeploy all services
- No single source of truth
- Dev/staging/prod configs mixed up in code

**The solution: Config Server**
All applications fetch configs from a central server:
- Single place to update configs
- Change database URL once, all apps pick it up
- Environment-specific configs (dev/staging/prod)
- Change configs without code deployment!

**How it works:**
1. Application starts up
2. Fetches configs from Config Server: GET /api/config/{app-name}/{environment}
3. Loads configs into memory
4. Runs with fetched configs`,
  whyItMatters: 'Centralized config management enables changing runtime behavior without code deployments - critical for rapid incident response.',
  realWorldExample: {
    company: 'Netflix',
    scenario: 'Manages configs for thousands of microservices',
    howTheyDoIt: 'Uses Archaius - a config management library that fetches from a central config service. Configs update every 60 seconds across all instances.',
  },
  keyPoints: [
    'Config server is single source of truth for all configs',
    'Applications fetch configs on startup',
    'Enables changing configs without redeploying code',
    'Critical for microservices architecture',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────┐
│   App 1     │ ──────▶ │  Config Server  │
│ (Service)   │ ◀────── │                 │
└─────────────┘         └─────────────────┘
                               ▲
┌─────────────┐                │
│   App 2     │ ───────────────┘
│ (Service)   │ ◀───────────────
└─────────────┘

All apps fetch configs from one central server!
`,
  keyConcepts: [
    { title: 'Config Server', explanation: 'Central storage for all configs', icon: '🏢' },
    { title: 'Client App', explanation: 'Application that fetches configs', icon: '📱' },
    { title: 'Hot Config', explanation: 'Config that changes without code deploy', icon: '🔥' },
  ],
  quickCheck: {
    question: 'Why is centralized config management better than environment variables?',
    options: [
      'It\'s faster',
      'Change configs once without redeploying all services',
      'It uses less memory',
      'It requires less code',
    ],
    correctIndex: 1,
    explanation: 'Centralized config lets you change a database URL ONCE and all services pick it up, instead of redeploying each service individually.',
  },
};

const step1: GuidedStep = {
  id: 'config-mgmt-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Applications need to connect to a config server',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents microservices', displayName: 'Client' },
      { type: 'app_server', reason: 'Config server', displayName: 'Config Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Fetch configs' },
    ],
    successCriteria: ['Add Client', 'Add Config Server', 'Connect Client → Config Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'Start with Client and Config Server components',
    level2: 'Drag Client and Config Server from sidebar, then connect Client → Config Server',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Config Storage (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your config server is running, but it's empty!",
  hook: "Applications are requesting configs but getting 404 errors. We need to implement storage and retrieval!",
  challenge: "Write Python code to store and retrieve configs using a key-value structure.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Config storage is working!',
  achievement: 'Applications can now store and retrieve configs',
  metrics: [
    { label: 'APIs implemented', after: '2' },
    { label: 'Can store configs', after: '✓' },
    { label: 'Can retrieve configs', after: '✓' },
  ],
  nextTeaser: "But configs disappear when the server restarts...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Config Storage Structure',
  conceptExplanation: `Configs need hierarchical organization:

**Namespace structure:**
\`\`\`
{environment}/{app-name}/{config-key} = value
\`\`\`

**Examples:**
- prod/payment-service/database-url = postgres://prod-db:5432
- staging/payment-service/database-url = postgres://staging-db:5432
- prod/payment-service/max-retry = 3
- prod/user-service/api-timeout = 5000

**Why this structure?**
1. Environment separation (prod/staging/dev)
2. App isolation (each app's configs separate)
3. Easy to fetch all configs for an app

**Python implementation:**
\`\`\`python
# In-memory storage
config_store = {}

def set_config(env, app, key, value):
    namespace = f"{env}/{app}/{key}"
    config_store[namespace] = value
    return "OK"

def get_config(env, app, key):
    namespace = f"{env}/{app}/{key}"
    return config_store.get(namespace, None)

def get_all_configs(env, app):
    prefix = f"{env}/{app}/"
    return {k: v for k, v in config_store.items()
            if k.startswith(prefix)}
\`\`\``,
  whyItMatters: 'Hierarchical namespace enables environment separation and prevents config conflicts between apps.',
  realWorldExample: {
    company: 'Etsy',
    scenario: 'Config management for hundreds of services',
    howTheyDoIt: 'Uses hierarchical namespaces with environment/app/config structure. Each service fetches only its configs, preventing cross-contamination.',
  },
  keyPoints: [
    'Namespace format: {env}/{app}/{key}',
    'Environment separation prevents prod/dev mix-ups',
    'Each app fetches only its configs',
    'Start with in-memory, add persistence later',
  ],
  diagram: `
CONFIG STORAGE STRUCTURE:

prod/
  ├── payment-service/
  │   ├── database-url = postgres://prod-db
  │   ├── max-retry = 3
  │   └── timeout = 5000
  ├── user-service/
  │   ├── database-url = postgres://user-db
  │   └── cache-ttl = 300

staging/
  ├── payment-service/
  │   ├── database-url = postgres://staging-db
  │   └── max-retry = 5

App fetches: GET /api/config/prod/payment-service
Returns: All configs for that app in that environment
`,
  keyConcepts: [
    { title: 'Namespace', explanation: 'Hierarchical path for config organization', icon: '📁' },
    { title: 'Environment', explanation: 'Isolation between dev/staging/prod', icon: '🌍' },
    { title: 'Config Key', explanation: 'Specific configuration item name', icon: '🔑' },
  ],
  quickCheck: {
    question: 'Why use environment/app/key namespacing instead of flat key-value?',
    options: [
      'It\'s faster to access',
      'Prevents mixing prod and dev configs for the same app',
      'Uses less storage',
      'Required by databases',
    ],
    correctIndex: 1,
    explanation: 'Namespacing ensures payment-service in prod gets prod database, not dev database. Critical for safety!',
  },
};

const step2: GuidedStep = {
  id: 'config-mgmt-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'FR-1: Store and retrieve configuration key-value pairs',
    taskDescription: 'Configure APIs and implement Python handlers for config operations',
    componentsNeeded: [
      { type: 'client', reason: 'Microservices', displayName: 'Client' },
      { type: 'app_server', reason: 'Config server with code', displayName: 'Config Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Fetch configs' },
    ],
    successCriteria: [
      'Click Config Server to open inspector',
      'Assign POST /api/config and GET /api/config APIs',
      'Implement set_config() and get_config() in Python',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Click Config Server, assign APIs, write Python code in code tab',
    level2: 'Use Python dictionary to store configs with namespace keys like "prod/app/key"',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Persistent Storage (Database)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! Your config server crashed during a deploy.",
  hook: "All configs are GONE! Every service's database URL, API keys, timeouts - vanished! Services are crashing because they can't find their configs!",
  challenge: "Add a database to persist configs so they survive server restarts.",
  illustration: 'server-crash',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Configs are now durable!',
  achievement: 'Configuration survives server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', before: '0% (lost on crash)', after: '100%' },
  ],
  nextTeaser: "Great! But how do we track who changed what config?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Config Persistence and Durability',
  conceptExplanation: `In-memory configs are fast but volatile - they vanish on restart!

**The problem:**
- Config server restarts = all configs lost
- No recovery possible
- Apps fetch configs and get empty responses

**The solution: Database persistence**
Simple schema:
\`\`\`sql
CREATE TABLE configs (
  namespace TEXT PRIMARY KEY,  -- "prod/app-name/key"
  value TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  updated_by TEXT
);
\`\`\`

**Write-through pattern:**
1. Client updates config via API
2. Config server writes to database (durable)
3. Also updates in-memory cache (fast reads)
4. Reads hit memory cache first

**On server startup:**
1. Load ALL configs from database into memory
2. Now ready to serve requests
3. Configs survive restarts!`,
  whyItMatters: 'Without persistence, config server failure means total outage for all applications - unacceptable!',
  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Config management for global platform',
    howTheyDoIt: 'Stores configs in MySQL with full audit trail. Caches in memory for speed. Database ensures configs never lost.',
  },
  famousIncident: {
    title: 'GitLab Config Wipe',
    company: 'GitLab',
    year: '2017',
    whatHappened: 'GitLab\'s config server lost its database due to a backup failure. All environment configs were lost. Had to manually reconstruct configs from memory and slack messages. Site was down for hours.',
    lessonLearned: 'Config persistence is critical infrastructure. Always have database backups!',
    icon: '💥',
  },
  keyPoints: [
    'Database provides durability - configs survive crashes',
    'Write-through: write to DB, cache in memory',
    'On startup: load all configs from DB into memory',
    'Track metadata: who changed what, when',
  ],
  diagram: `
┌──────────┐    1. SET config     ┌──────────────┐
│  Client  │ ──────────────────▶ │Config Server │
└──────────┘                     └──────┬───────┘
                                        │
                               2. Write to DB (durable)
                                        ▼
                                  ┌──────────┐
                                  │ Database │
                                  └──────────┘
                                        │
                               3. Cache in memory
                                        ▼
                                  ┌──────────┐
                                  │  Memory  │
                                  │ {cache}  │
                                  └──────────┘

GET config: Check memory → if miss, query DB
`,
  keyConcepts: [
    { title: 'Persistence', explanation: 'Data survives server restarts', icon: '💾' },
    { title: 'Write-through', explanation: 'Write to DB and cache simultaneously', icon: '✍️' },
    { title: 'Durability', explanation: 'Guaranteed not to lose data', icon: '🛡️' },
  ],
  quickCheck: {
    question: 'Why do we need both database AND in-memory cache for configs?',
    options: [
      'Databases are too expensive',
      'Database for durability, memory for fast reads',
      'Memory for durability, database for fast reads',
      'Only need one, not both',
    ],
    correctIndex: 1,
    explanation: 'Database ensures configs survive crashes (durability). Memory cache provides fast reads without DB queries on every request.',
  },
};

const step3: GuidedStep = {
  id: 'config-mgmt-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'FR-1: Configs must persist across server restarts',
    taskDescription: 'Add Database to store configs durably',
    componentsNeeded: [
      { type: 'client', reason: 'Microservices', displayName: 'Client' },
      { type: 'app_server', reason: 'Config server', displayName: 'Config Server' },
      { type: 'database', reason: 'Durable config storage', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Fetch configs' },
      { from: 'App Server', to: 'Database', reason: 'Persist configs' },
    ],
    successCriteria: ['Add Database', 'Connect Config Server → Database', 'Configs survive restarts'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add Database and connect Config Server to it',
    level2: 'Build: Client → Config Server → Database. Database stores configs permanently.',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 4: Add Config Versioning
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⏰',
  scenario: "An engineer just changed the database pool size from 20 to 200.",
  hook: "Production is melting down! The database is overwhelmed! We need to roll back, but we don't know what the old value was!",
  challenge: "Add versioning to track all config changes and enable rollback.",
  illustration: 'production-fire',
};

const step4Celebration: CelebrationContent = {
  emoji: '📚',
  message: 'Config versioning enabled!',
  achievement: 'Full history of config changes with rollback capability',
  metrics: [
    { label: 'Version tracking', after: 'Enabled' },
    { label: 'Can rollback', after: '✓' },
    { label: 'Audit trail', after: 'Complete' },
  ],
  nextTeaser: "Excellent! Now let's add feature flags for gradual rollouts...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Config Versioning and Audit Trail',
  conceptExplanation: `Every config change should be versioned like code commits!

**Why versioning matters:**
- Know what changed, when, and by whom
- Rollback bad changes instantly
- Audit compliance (who changed production DB password?)
- Debugging (what was the config when the bug appeared?)

**Version schema:**
\`\`\`sql
CREATE TABLE config_versions (
  id SERIAL PRIMARY KEY,
  namespace TEXT,
  value TEXT,
  version INT,
  created_at TIMESTAMP,
  created_by TEXT,
  change_description TEXT
);
\`\`\`

**How it works:**
1. User updates config: database-pool-size = 200
2. System creates new version:
   - version 1: value=20, created_by=alice, created_at=yesterday
   - version 2: value=200, created_by=bob, created_at=now
3. Current config always points to latest version
4. Rollback: Point current to version 1

**Rollback flow:**
\`\`\`
GET /api/config/prod/app/db-pool-size/versions
→ [v1: 20, v2: 200, v3: 100]

POST /api/config/prod/app/db-pool-size/rollback?version=1
→ Current value now 20
\`\`\``,
  whyItMatters: 'Config changes are deployments! Without versioning, bad changes are irreversible disasters.',
  realWorldExample: {
    company: 'Stripe',
    scenario: 'Config management with strict audit requirements',
    howTheyDoIt: 'Every config change creates a versioned entry with git-like history. Can diff versions, see blame, rollback. Required for financial compliance.',
  },
  famousIncident: {
    title: 'AWS S3 Outage',
    company: 'Amazon S3',
    year: '2017',
    whatHappened: 'Engineer ran a command to remove a few servers. Typo in the config caused removal of way more servers than intended. Took hours to recover because they didn\'t have versioning to quickly rollback the config change.',
    lessonLearned: 'Config changes need version control and easy rollback. Treat config like code!',
    icon: '☁️',
  },
  keyPoints: [
    'Every config change creates a new version',
    'Track: value, timestamp, author, description',
    'Rollback = point to previous version',
    'Audit trail for compliance and debugging',
  ],
  diagram: `
CONFIG VERSION HISTORY:

┌────────────────────────────────────────────┐
│ prod/payment-service/db-pool-size          │
├────────────────────────────────────────────┤
│ v3: 100 (2024-01-15 14:00 by alice)        │ ← CURRENT
│    "Rollback from v2, DB overloaded"       │
│                                            │
│ v2: 200 (2024-01-15 12:00 by bob)          │
│    "Increase for holiday traffic"          │
│                                            │
│ v1: 20 (2024-01-01 10:00 by system)        │
│    "Initial value"                         │
└────────────────────────────────────────────┘

Rollback to v1:
POST /api/config/.../rollback?version=1
→ Current value becomes 20
→ Creates v4 pointing to v1's value
`,
  keyConcepts: [
    { title: 'Version', explanation: 'Immutable snapshot of config at a point in time', icon: '📸' },
    { title: 'Rollback', explanation: 'Revert to previous version', icon: '⏮️' },
    { title: 'Audit Trail', explanation: 'Who changed what, when, why', icon: '📋' },
  ],
  quickCheck: {
    question: 'Why keep old config versions instead of just overwriting?',
    options: [
      'Old versions use less storage',
      'Enable rollback and provide audit trail',
      'Required by law',
      'Makes reads faster',
    ],
    correctIndex: 1,
    explanation: 'Versioning enables instant rollback when a config change breaks production, and provides audit trail for compliance.',
  },
};

const step4: GuidedStep = {
  id: 'config-mgmt-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'FR-4: Track config history and enable rollback',
    taskDescription: 'Keep architecture, add version tracking (conceptual)',
    componentsNeeded: [
      { type: 'client', reason: 'Microservices', displayName: 'Client' },
      { type: 'app_server', reason: 'Config server with versioning', displayName: 'Config Server' },
      { type: 'database', reason: 'Stores version history', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Fetch configs' },
      { from: 'App Server', to: 'Database', reason: 'Store versions' },
    ],
    successCriteria: ['Same architecture', 'Versioning implemented in database schema'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Keep the same architecture - versioning is in the database schema',
    level2: 'Client → Config Server → Database. Add version tracking in DB tables.',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Feature Flags
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🚩',
  scenario: "Your team built a new payment processor, but it's risky to enable for all users at once.",
  hook: "You need to test it with 1% of users first, monitor for errors, then gradually expand. How do you control which users see the new feature?",
  challenge: "Implement feature flags to enable/disable features dynamically and control rollout percentage.",
  illustration: 'feature-toggle',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Feature flags are live!',
  achievement: 'Can enable features for specific percentages of users',
  metrics: [
    { label: 'Feature flag support', after: 'Enabled' },
    { label: 'Can do canary releases', after: '✓' },
    { label: 'Can do A/B testing', after: '✓' },
  ],
  nextTeaser: "Perfect! Now let's add caching for high availability...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Feature Flags and Gradual Rollout',
  conceptExplanation: `Feature flags decouple deployment from release!

**Traditional release:**
- Deploy code → Feature is live for 100% of users
- If it breaks, emergency rollback (stressful!)

**Feature flag approach:**
- Deploy code with feature OFF (flag = false)
- Enable for 1% of users
- Monitor errors, performance
- If good: 1% → 10% → 50% → 100%
- If bad: Set flag to false (instant rollback!)

**Feature flag types:**

**1. Boolean flags (on/off)**
\`\`\`json
{
  "new-payment-processor": false
}
\`\`\`

**2. Percentage rollout**
\`\`\`json
{
  "new-payment-processor": {
    "enabled": true,
    "percentage": 10
  }
}
\`\`\`
→ 10% of users get new feature (based on user ID hash)

**3. User targeting**
\`\`\`json
{
  "new-payment-processor": {
    "enabled": true,
    "userIds": ["alice", "bob"],
    "percentage": 0
  }
}
\`\`\`
→ Only alice and bob get the feature (internal testing)

**Implementation:**
\`\`\`python
def is_feature_enabled(feature_name, user_id):
    flag = get_config(f"feature-flags/{feature_name}")

    # Check if user in allowlist
    if user_id in flag.get("userIds", []):
        return True

    # Check percentage rollout
    percentage = flag.get("percentage", 0)
    if hash(user_id) % 100 < percentage:
        return True

    return flag.get("enabled", False)
\`\`\``,
  whyItMatters: 'Feature flags enable safe, gradual rollouts. Ship code to production with features OFF, then enable carefully.',
  realWorldExample: {
    company: 'Facebook',
    scenario: 'Launches features to billions of users',
    howTheyDoIt: 'Uses Gatekeeper for feature flags. New features enabled for 0.1% → 1% → 10% → 100%. Can disable instantly if metrics look bad.',
  },
  famousIncident: {
    title: 'Knight Capital Trading Disaster',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'Deployed new trading code but forgot to remove old flag logic. Old code reactivated, sent millions of bad trades in 45 minutes. Lost $440 million. Company went bankrupt. Feature flags could have prevented this by cleanly disabling old code.',
    lessonLearned: 'Feature flags must be cleaned up after rollout. Old flags can cause catastrophic bugs.',
    icon: '📉',
  },
  keyPoints: [
    'Feature flags = deploy without releasing',
    'Gradual rollout: 1% → 10% → 100%',
    'Can target specific users for testing',
    'Instant rollback by setting flag to false',
    'Clean up old flags after full rollout',
  ],
  diagram: `
FEATURE FLAG GRADUAL ROLLOUT:

Day 1: Deploy code, flag = 1%
┌─────────────────────────────────┐
│ Users: ████████████████████████ │
│        ▓ = new feature (1%)     │
└─────────────────────────────────┘

Day 2: Metrics good, increase to 10%
┌─────────────────────────────────┐
│ Users: ████████████████████████ │
│        ▓▓▓ = 10%                │
└─────────────────────────────────┘

Day 3: Still good, 50%
┌─────────────────────────────────┐
│ Users: ████████████████████████ │
│        ▓▓▓▓▓▓▓▓▓▓▓▓ = 50%       │
└─────────────────────────────────┘

Day 4: Success, 100%
┌─────────────────────────────────┐
│ Users: ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│        All users on new feature  │
└─────────────────────────────────┘

If errors spike: Set percentage=0 (instant rollback!)
`,
  keyConcepts: [
    { title: 'Feature Flag', explanation: 'Config that enables/disables code paths', icon: '🚩' },
    { title: 'Canary Release', explanation: 'Enable for small % first, expand gradually', icon: '🐤' },
    { title: 'Kill Switch', explanation: 'Instantly disable feature by setting flag=false', icon: '🔴' },
  ],
  quickCheck: {
    question: 'Why use feature flags instead of just deploying code when ready?',
    options: [
      'Feature flags are faster',
      'Enable gradual rollout and instant rollback without redeploying',
      'Feature flags use less memory',
      'Required by databases',
    ],
    correctIndex: 1,
    explanation: 'Feature flags let you deploy code but enable for 1% of users first. If it breaks, disable instantly without emergency code rollback.',
  },
};

const step5: GuidedStep = {
  id: 'config-mgmt-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'FR-5: Support feature flags for gradual rollout',
    taskDescription: 'Keep architecture, add feature flag logic (conceptual)',
    componentsNeeded: [
      { type: 'client', reason: 'Apps check feature flags', displayName: 'Client' },
      { type: 'app_server', reason: 'Config server with feature flags', displayName: 'Config Server' },
      { type: 'database', reason: 'Stores flag configurations', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Fetch feature flags' },
      { from: 'App Server', to: 'Database', reason: 'Store flags' },
    ],
    successCriteria: ['Same architecture', 'Feature flag logic in config server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Keep the same architecture - feature flags are a type of config',
    level2: 'Client → Config Server → Database. Feature flags stored like other configs.',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Caching and High Availability
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚡',
  scenario: "Your config server is getting hammered! 1,000 instances polling every 60 seconds.",
  hook: "During a deploy, all 1,000 instances restart and fetch configs simultaneously. The database is overwhelmed! Plus, what if the config server goes down?",
  challenge: "Add caching to reduce database load and ensure apps keep running even if the config server fails.",
  illustration: 'server-overload',
};

const step6Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Production-ready config management achieved!',
  achievement: 'High availability with caching and local fallbacks',
  metrics: [
    { label: 'Database load', before: '1000 queries/min', after: '10 queries/min' },
    { label: 'Config fetch latency', before: '50ms', after: '2ms' },
    { label: 'Availability', before: '99%', after: '99.99%' },
  ],
  nextTeaser: "Congratulations! You've built a production-ready config management system!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Caching and Availability Strategies',
  conceptExplanation: `Config systems must be HIGHLY available - apps depend on them to start!

**Problem 1: Database overload**
- 1,000 instances polling every 60s = 17 queries/sec
- During deploys: 1,000 simultaneous queries = database crush

**Solution: Redis cache**
- Config server caches configs in Redis
- TTL: 60 seconds
- Database only queried when cache misses
- 99% reduction in DB load!

**Problem 2: Config server outage**
- If config server down, apps can't fetch configs
- Apps can't start = total outage!

**Solution: Client-side cache**
Every app caches fetched configs to local disk:
\`\`\`python
# On startup
try:
    configs = fetch_from_server()
    cache_to_disk(configs)
except ServerDown:
    configs = load_from_disk_cache()
    log("Using cached configs, server is down!")
\`\`\`

**Fallback hierarchy:**
1. Try config server (with Redis cache)
2. If server down, use local disk cache
3. If no cache, use default values

**Cache invalidation:**
When config changes:
1. Write to database
2. Invalidate Redis cache key
3. Next fetch gets fresh value from DB, caches it
4. Apps pick up change within 60 seconds (polling interval)

**Architecture layers:**
- Client local cache (fallback, hours-old OK)
- Redis cache (fast, 60s TTL)
- Database (source of truth)`,
  whyItMatters: 'Config service must never be a single point of failure. Caching ensures apps stay up even during outages.',
  realWorldExample: {
    company: 'Uber',
    scenario: 'Config management for thousands of services',
    howTheyDoIt: 'Uses Redis for server-side cache and local file cache on every instance. Even if entire config service goes down, apps keep running with cached configs.',
  },
  famousIncident: {
    title: 'Cloudflare Config Service Outage',
    company: 'Cloudflare',
    year: '2020',
    whatHappened: 'Config service went down. Applications couldn\'t start because they required fresh configs. Cascading failure across the network. Took hours to recover because no local cache fallback.',
    lessonLearned: 'Always implement local caching! Apps must run even if config service is down.',
    icon: '☁️',
  },
  keyPoints: [
    'Redis cache reduces DB load by 99%',
    'Local disk cache enables apps to start when server down',
    'Fallback hierarchy: server → Redis → local cache → defaults',
    'Config changes propagate within polling interval (60s)',
  ],
  diagram: `
MULTI-LAYER CACHING:

┌──────────┐
│App Server│ 1. Try config service
└────┬─────┘
     │
     ▼
┌──────────────┐    2. Check Redis cache
│Config Service│────▶┌───────┐
└──────────────┘     │ Redis │ (99% hit rate)
     │               └───────┘
     │ 3. Cache miss
     ▼
┌──────────┐
│ Database │ Source of truth
└──────────┘

If config service down:
┌──────────┐
│App Server│ Use local disk cache
└────┬─────┘
     │
     ▼
┌──────────┐
│Local File│ /var/cache/configs.json
└──────────┘ (Hours-old OK, better than nothing!)

Availability:
- Config service: 99.9%
- With local cache: 99.99%+
`,
  keyConcepts: [
    { title: 'Redis Cache', explanation: 'Server-side cache for fast reads', icon: '⚡' },
    { title: 'Local Cache', explanation: 'Client-side disk cache for fallback', icon: '💾' },
    { title: 'Fallback Hierarchy', explanation: 'Multiple layers of resilience', icon: '🛡️' },
  ],
  quickCheck: {
    question: 'Why do apps need local disk cache if the config server has Redis cache?',
    options: [
      'Local cache is faster than Redis',
      'If config server goes down, apps can still start using cached configs',
      'Local cache uses less memory',
      'Required by databases',
    ],
    correctIndex: 1,
    explanation: 'If config server completely fails, apps need local cache to start and run. Better to use hour-old configs than fail to start!',
  },
};

const step6: GuidedStep = {
  id: 'config-mgmt-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'System must handle 1000 req/sec and survive config server outages',
    taskDescription: 'Add Redis Cache for performance and availability',
    componentsNeeded: [
      { type: 'client', reason: 'Apps with local cache', displayName: 'Client' },
      { type: 'app_server', reason: 'Config server', displayName: 'Config Server' },
      { type: 'cache', reason: 'Redis for fast reads', displayName: 'Redis Cache' },
      { type: 'database', reason: 'Source of truth', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Fetch configs' },
      { from: 'App Server', to: 'Cache', reason: 'Check cache first' },
      { from: 'App Server', to: 'Database', reason: 'Cache miss fallback' },
    ],
    successCriteria: [
      'Add Redis Cache',
      'Connect Config Server to both Cache and Database',
      'High availability architecture complete',
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
    level1: 'Add Redis Cache between Config Server and Database',
    level2: 'Build: Client → Config Server → Redis Cache + Database (both connections needed)',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const configManagementGuidedTutorial: GuidedTutorial = {
  problemId: 'config-management-guided',
  problemTitle: 'Build a Config Management System',

  requirementsPhase: configManagementRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],

  finalExamTestCases: [
    {
      name: 'Basic Config Operations',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Store and retrieve configs across environments',
      traffic: { type: 'mixed', rps: 50, readRps: 40, writeRps: 10 },
      duration: 30,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'High Read Throughput',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Handle 1000 config fetches/sec during deploy',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'Environment Separation',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Isolate dev/staging/prod configs',
      traffic: { type: 'mixed', rps: 100, readRps: 90, writeRps: 10 },
      duration: 30,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'Hot Reload',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Apps pick up config changes within 60 seconds',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 120,
      passCriteria: { maxP95Latency: 50 },
    },
    {
      name: 'Config Versioning and Rollback',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Track config history and rollback bad changes',
      traffic: { type: 'mixed', rps: 50, readRps: 40, writeRps: 10 },
      duration: 60,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'Feature Flag Gradual Rollout',
      type: 'functional',
      requirement: 'FR-5',
      description: 'Support percentage-based feature rollout',
      traffic: { type: 'read', rps: 200, readRps: 200 },
      duration: 60,
      passCriteria: { maxP99Latency: 50 },
    },
    {
      name: 'High Availability',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Config server crashes, apps keep running with cache',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 120,
      failureInjection: { type: 'app_crash', atSecond: 60, recoverySecond: 90 },
      passCriteria: { minAvailability: 0.95, maxDowntime: 30 },
    },
  ] as TestCase[],
};

export function getConfigManagementGuidedTutorial(): GuidedTutorial {
  return configManagementGuidedTutorial;
}

export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = configManagementRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= configManagementRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
