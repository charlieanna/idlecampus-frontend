import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * ML Model Registry Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building an ML model registry platform.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (cache, object storage, versioning, etc.)
 *
 * Key Concepts:
 * - Model versioning and lineage tracking
 * - Artifact storage (models, datasets, metadata)
 * - Deployment tracking and rollback
 * - Experiment tracking and comparison
 * - Model performance monitoring
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const mlModelRegistryRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an ML Model Registry like MLflow or Weights & Biases",

  interviewer: {
    name: 'Dr. Maya Patel',
    role: 'Head of ML Infrastructure at AI Labs Inc.',
    avatar: '👩‍🔬',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-registry',
      category: 'functional',
      question: "What's the core functionality ML teams need from a model registry?",
      answer: "ML engineers need to:\n\n1. **Register models** - Upload trained models with metadata (accuracy, hyperparameters)\n2. **Version models** - Track different versions of the same model\n3. **Deploy models** - Mark which model version is deployed to production\n4. **Compare models** - See which model performs better",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Model registries are version control systems for ML models, not just storage",
    },
    {
      id: 'artifact-storage',
      category: 'functional',
      question: "What artifacts do we need to store for each model?",
      answer: "For each model version, we need:\n- **Model file** - The trained weights (can be GBs)\n- **Training code** - Scripts used to train the model\n- **Training data reference** - Where the data came from\n- **Metadata** - Metrics (accuracy, F1), hyperparameters, framework version\n- **Dependencies** - requirements.txt, conda env",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "ML models are more than just weights - reproducibility requires tracking everything",
    },
    {
      id: 'deployment-tracking',
      category: 'functional',
      question: "How do teams track which models are deployed where?",
      answer: "Teams need to track:\n1. **Staging** - Which model is in testing\n2. **Production** - Which model serves live traffic\n3. **Canary** - Which model is being A/B tested\n\nImportant: Must support **instant rollback** if a deployed model fails!",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Deployment tracking prevents 'which model is in prod?' confusion",
    },
    {
      id: 'lineage-tracking',
      category: 'clarification',
      question: "What if we need to trace how a model was trained?",
      answer: "We need **lineage tracking**:\n- Which dataset version was used?\n- What preprocessing was applied?\n- Which experiment produced this model?\n- Parent models (for transfer learning)\n\nThis is critical for debugging and reproducibility!",
      importance: 'important',
      insight: "Model lineage is like Git history - essential for understanding how we got here",
    },
    {
      id: 'experiment-management',
      category: 'clarification',
      question: "Do ML teams run multiple experiments before finding the best model?",
      answer: "Absolutely! A typical ML project involves:\n- 100+ experiments with different hyperparameters\n- Each experiment produces metrics (accuracy, loss, etc.)\n- Teams need to compare experiments to find the winner\n\nFor MVP, we'll focus on storing experiment results. Full comparison UI can come later.",
      importance: 'important',
      insight: "ML is iterative - most experiments fail, but we learn from all of them",
    },

    // SCALE & NFRs
    {
      id: 'model-size',
      category: 'throughput',
      question: "How large are ML models?",
      answer: "Highly variable:\n- Small models: 10-100MB (logistic regression, small NNs)\n- Medium models: 100MB-5GB (ResNet, BERT)\n- Large models: 5GB-100GB+ (GPT-3, LLaMA)\n\nAverage model size: ~500MB",
      importance: 'critical',
      learningPoint: "Large model files require object storage, not databases",
    },
    {
      id: 'throughput-uploads',
      category: 'throughput',
      question: "How many models do teams upload per day?",
      answer: "For a company with 50 ML engineers:\n- 500 model versions per day (10 per engineer)\n- 1,000 experiment runs per day",
      importance: 'critical',
      calculation: {
        formula: "500 models ÷ 86,400 sec = 0.006 uploads/sec",
        result: "~1 model every 3 minutes (low write volume)",
      },
      learningPoint: "Model uploads are infrequent but LARGE - optimize for size, not throughput",
    },
    {
      id: 'throughput-downloads',
      category: 'throughput',
      question: "How often do teams download models?",
      answer: "Teams download models for:\n- Deployment: 100 downloads/day\n- Local testing: 200 downloads/day\n- Model serving: 50 deployments/day\n\nTotal: ~350 downloads/day",
      importance: 'critical',
      calculation: {
        formula: "350 downloads ÷ 86,400 sec = 0.004 downloads/sec",
        result: "~1 download every 4 minutes",
      },
      learningPoint: "Read-heavy, but absolute volume is low. Size matters more than throughput.",
    },
    {
      id: 'latency-upload',
      category: 'latency',
      question: "How fast should model upload be?",
      answer: "For a 500MB model: under 60 seconds is acceptable. ML engineers are used to waiting during training - a minute for upload is fine.",
      importance: 'important',
      learningPoint: "Upload latency less critical than reliability - can't lose a model after hours of training!",
    },
    {
      id: 'latency-metadata',
      category: 'latency',
      question: "How fast should metadata queries be (list models, compare experiments)?",
      answer: "p99 under 200ms. ML engineers browse models frequently - needs to feel snappy.",
      importance: 'important',
      learningPoint: "Metadata queries are frequent - need caching and optimized DB queries",
    },
    {
      id: 'storage-growth',
      category: 'storage',
      question: "How fast does storage grow?",
      answer: "500 models/day × 500MB average = 250GB/day = 91TB/year\n\nBut old models can be archived - active storage ~10-20TB",
      importance: 'critical',
      learningPoint: "Storage costs add up fast - need lifecycle policies to archive old models",
    },
    {
      id: 'consistency-requirements',
      category: 'consistency',
      question: "What if metadata says a model is 'staging' but the model file is missing?",
      answer: "This is a disaster! Teams deploy a missing model → production breaks.\n\nWe need **strong consistency** between metadata (DB) and artifacts (object storage).",
      importance: 'critical',
      learningPoint: "Model registry requires transactional guarantees across metadata + artifacts",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-registry', 'artifact-storage', 'deployment-tracking'],
  criticalFRQuestionIds: ['core-registry', 'artifact-storage'],
  criticalScaleQuestionIds: ['model-size', 'storage-growth', 'consistency-requirements'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Register and version models',
      description: 'Upload models with metadata, track multiple versions',
      emoji: '📦',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Store model artifacts',
      description: 'Persist model files, code, and dependencies',
      emoji: '💾',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Track deployments',
      description: 'Mark models as staging/production/canary',
      emoji: '🚀',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Compare model versions',
      description: 'View metrics across different model versions',
      emoji: '📊',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 ML engineers',
    writesPerDay: '500 model uploads',
    readsPerDay: '350 model downloads',
    peakMultiplier: 2,
    readWriteRatio: '1:1 (roughly equal)',
    calculatedWriteRPS: { average: 0.006, peak: 0.012 },
    calculatedReadRPS: { average: 0.004, peak: 0.008 },
    maxPayloadSize: '~5GB (large model)',
    storagePerRecord: '~500MB average per model',
    storageGrowthPerYear: '~91TB (with archival)',
    redirectLatencySLA: 'p99 < 200ms (metadata)',
    createLatencySLA: 'p99 < 60s (model upload)',
  },

  architecturalImplications: [
    '✅ Large files (GBs) → Object storage (S3) for model artifacts',
    '✅ Metadata queries → Database with caching',
    '✅ Versioning → Immutable artifacts + version pointers',
    '✅ Deployment tracking → Stage labels in metadata DB',
    '✅ Strong consistency → Transactional uploads (metadata + artifact)',
    '✅ Storage costs → Lifecycle policies to archive old versions',
  ],

  outOfScope: [
    'Model training infrastructure',
    'Feature stores',
    'Real-time model serving',
    'A/B testing framework',
    'AutoML hyperparameter tuning',
    'Multi-region replication',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where ML engineers can register models, store artifacts, and track deployments. Advanced features like experiment comparison and lineage graphs will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🤖',
  scenario: "Welcome to AI Labs Inc! You've been hired to build an ML model registry.",
  hook: "Your first ML engineer just trained a model. She's ready to register it!",
  challenge: "Set up the basic request flow so ML engineers can reach your registry server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your model registry is online!',
  achievement: 'ML engineers can now send requests to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to register models yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Model Registry Architecture',
  conceptExplanation: `Every ML model registry starts with a **Client** connecting to a **Server**.

For an ML registry, clients are:
1. **Python SDK** - \`mlflow.log_model()\` or similar
2. **CLI tools** - Command-line model upload
3. **Web UI** - Browse and compare models

All communicate with your **Registry Server** via HTTP API.`,

  whyItMatters: 'Without this connection, ML engineers can\'t register their trained models or track deployments.',

  realWorldExample: {
    company: 'MLflow (Databricks)',
    scenario: 'Serving thousands of ML teams',
    howTheyDoIt: 'Started as a simple Flask API, now a distributed system used by companies like Netflix and Uber',
  },

  keyPoints: [
    'Client = Python SDK, CLI, or web browser',
    'Registry Server = your backend handling model operations',
    'REST API for model registration and queries',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'ML engineer\'s tool (SDK, CLI, web UI)', icon: '💻' },
    { title: 'Registry Server', explanation: 'Backend managing models and metadata', icon: '🖥️' },
    { title: 'REST API', explanation: 'HTTP interface for model operations', icon: '🔌' },
  ],
};

const step1: GuidedStep = {
  id: 'ml-registry-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents ML engineers using the registry', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles model registration and queries', displayName: 'App Server' },
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
// STEP 2: Implement Model Registry APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to handle models!",
  hook: "An ML engineer tried to register a model and got a 404 error.",
  challenge: "Write the Python code to register models, track versions, and manage deployments.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your registry APIs are live!',
  achievement: 'You implemented core model management functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can register models', after: '✓' },
    { label: 'Can track versions', after: '✓' },
    { label: 'Can manage deployments', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all model metadata is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Model Registry APIs: Core Handlers',
  conceptExplanation: `For an ML model registry, we need handlers for key operations:

**Model Management:**
- \`register_model()\` - Create a new model entry
- \`create_version()\` - Add a new version to existing model
- \`set_deployment_stage()\` - Mark version as staging/prod/archived
- \`get_model_versions()\` - List all versions of a model

**Key concepts:**
1. **Models** have multiple **versions** (like Git commits)
2. Each version has a **stage** (staging, production, archived)
3. Metadata includes: metrics, hyperparameters, framework info
4. Artifacts (model files) are stored separately (comes later)

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without proper versioning, teams lose track of which model is deployed and can\'t roll back!',

  famousIncident: {
    title: 'Knight Capital Trading Disaster',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'Deployed wrong version of their trading algorithm to production. The old code had a bug that executed millions of erroneous trades in 45 minutes. Lost $440 million. Company nearly went bankrupt.',
    lessonLearned: 'Version tracking and deployment management are CRITICAL - not just for ML, but all software.',
    icon: '📉',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Managing thousands of ML models',
    howTheyDoIt: 'Uses internal model registry (Metaflow) with strict versioning and deployment stage tracking',
  },

  keyPoints: [
    'Models have multiple versions (immutable once created)',
    'Each version has metadata (metrics, hyperparameters)',
    'Deployment stages: staging → production → archived',
    'Use in-memory storage for now (database comes next)',
  ],

  quickCheck: {
    question: 'Why do ML models need versioning?',
    options: [
      'To save disk space',
      'To track improvements and enable rollback if a new model fails',
      'To make training faster',
      'To reduce memory usage',
    ],
    correctIndex: 1,
    explanation: 'Versioning lets teams compare model performance over time and instantly roll back if a new deployment causes issues.',
  },

  keyConcepts: [
    { title: 'Model Version', explanation: 'Immutable snapshot of a trained model', icon: '📸' },
    { title: 'Deployment Stage', explanation: 'staging/production/archived label', icon: '🏷️' },
    { title: 'Metadata', explanation: 'Metrics, hyperparameters, framework info', icon: '📋' },
  ],
};

const step2: GuidedStep = {
  id: 'ml-registry-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Register models, FR-2: Version tracking, FR-3: Deployment stages',
    taskDescription: 'Configure APIs and implement Python handlers for model management',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/models, POST /api/models/:id/versions, PUT /api/models/:id/stage APIs',
      'Open the Python tab',
      'Implement register_model(), create_version(), and set_stage() functions',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign model registry endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for register_model, create_version, and set_stage',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/models', 'POST /api/models/:id/versions', 'PUT /api/models/:id/stage'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Model Metadata
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your server crashed during a deployment...",
  hook: "When it restarted, ALL model metadata was GONE! Teams don't know which model is in production. Chaos!",
  challenge: "Add a database so model metadata survives server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your model metadata is safe!',
  achievement: 'Data now persists across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Model history preserved', after: '✓' },
  ],
  nextTeaser: "But querying model history is getting slow as we add more versions...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Database for Model Metadata',
  conceptExplanation: `In-memory storage loses all data when the server restarts - unacceptable for production!

A **database** provides:
- **Durability**: Model metadata survives crashes
- **Queryability**: Fast lookups by model name, version, stage
- **Relationships**: Link models → versions → experiments

For ML registry, we need tables for:
- \`models\` - Model names and descriptions
- \`model_versions\` - Versions with stage labels
- \`metrics\` - Performance metrics (accuracy, F1, etc.)
- \`hyperparameters\` - Training configuration
- \`deployments\` - Deployment history and tracking

**Important**: Model files (large artifacts) go to object storage later!`,

  whyItMatters: 'Losing model metadata means teams can\'t find models, track performance, or know what\'s in production!',

  famousIncident: {
    title: 'Uber ML Platform Metadata Loss',
    company: 'Uber (Internal)',
    year: '2018',
    whatHappened: 'Early version of Uber\'s Michelangelo platform lost experiment metadata due to database failure. Teams lost months of experimentation data and had to retrain models from scratch.',
    lessonLearned: 'ML metadata is as valuable as the models themselves - must be durable and backed up.',
    icon: '🚗',
  },

  realWorldExample: {
    company: 'Databricks (MLflow)',
    scenario: 'Tracking millions of experiments',
    howTheyDoIt: 'Uses PostgreSQL for metadata with optimized indexes on model name, version, and stage',
  },

  keyPoints: [
    'Database stores metadata, not model files (those are too large)',
    'Tables: models, versions, metrics, hyperparameters',
    'Index on: model_name, version, stage for fast queries',
    'Model artifacts go to object storage (next step)',
  ],

  quickCheck: {
    question: 'What should we store in the database vs object storage?',
    options: [
      'Everything in database',
      'Metadata in database, model files in object storage',
      'Everything in object storage',
      'Metadata in object storage, model files in database',
    ],
    correctIndex: 1,
    explanation: 'Database is for queryable metadata (small). Model files are large binaries that belong in object storage.',
  },

  keyConcepts: [
    { title: 'Metadata', explanation: 'Model info, metrics, stages - queryable', icon: '📊' },
    { title: 'Artifacts', explanation: 'Large model files - goes to object storage', icon: '📦' },
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
  ],
};

const step3: GuidedStep = {
  id: 'ml-registry-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent metadata storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store model metadata, versions, metrics, stages', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Metadata Queries
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 1,000 model versions, and the web UI is getting slow!",
  hook: "Every page load queries the database. Listing models takes 2+ seconds. ML engineers are frustrated.",
  challenge: "Add a cache to make model browsing lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Model queries are 50x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Model list latency', before: '2000ms', after: '40ms' },
    { label: 'Cache hit rate', after: '90%' },
  ],
  nextTeaser: "But we still can't store actual model files...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Speed Up Model Metadata Queries',
  conceptExplanation: `A **cache** sits between your app and database, storing frequently accessed data in memory.

For ML registries, we cache:
- **Model list** - All registered models (changes rarely)
- **Version metadata** - Metrics, hyperparameters for each version
- **Deployment stages** - Which version is in production/staging
- **Experiment results** - For comparison views

Cache Strategy:
1. Check cache first
2. On hit: return immediately (1-5ms)
3. On miss: fetch from DB, store in cache, return
4. Set TTL (Time To Live): 300 seconds for model metadata
5. Invalidate on updates (new version, stage change)`,

  whyItMatters: 'ML engineers frequently browse models and compare experiments. Without caching, every query hits the slow database.',

  famousIncident: {
    title: 'Weights & Biases Scale Issues',
    company: 'Weights & Biases',
    year: '2020',
    whatHappened: 'Rapid user growth caused database to become overwhelmed with metadata queries. Dashboard loads took 10+ seconds. They added Redis caching and reduced latency by 95%.',
    lessonLearned: 'Even with low traffic, metadata queries can bottleneck on database without caching.',
    icon: '📈',
  },

  realWorldExample: {
    company: 'MLflow',
    scenario: 'Serving experiment dashboards to thousands of users',
    howTheyDoIt: 'Uses Redis for caching model metadata, experiment metrics, and search results',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (90% of queries)
                     │   Return instantly!
`,

  keyPoints: [
    'Cache frequently accessed metadata (model lists, metrics)',
    'Don\'t cache model files (too large, stored in object storage)',
    'Set TTL to 300s - balance freshness vs speed',
    'Invalidate cache when model stages change',
  ],

  quickCheck: {
    question: 'What should we cache for an ML model registry?',
    options: [
      'Model files (weights)',
      'Metadata (model lists, metrics, stages)',
      'Training datasets',
      'Everything including large artifacts',
    ],
    correctIndex: 1,
    explanation: 'Cache small, frequently accessed metadata. Large artifacts (model files) stay in object storage.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'ml-registry-step-4',
  stepNumber: 4,
  frIndex: 3,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-4: Compare models (now fast with caching)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache model metadata for fast queries', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (300 seconds)',
      'Cache strategy set (cache-aside)',
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
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect App Server to Cache. Then click Cache and set TTL to 300 seconds, strategy to cache-aside',
    solutionComponents: [{ type: 'cache', config: { ttl: 300, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Object Storage for Model Artifacts
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📦',
  scenario: "An ML engineer just trained a 3GB language model!",
  hook: "She tries to upload it, but your database can't handle files this large. Upload fails!",
  challenge: "Add object storage to handle large model files and training artifacts.",
  illustration: 'storage-crisis',
};

const step5Celebration: CelebrationContent = {
  emoji: '☁️',
  message: 'You can now store models of ANY size!',
  achievement: 'Object storage handles large ML artifacts',
  metrics: [
    { label: 'Max model size', before: '100MB', after: 'Unlimited' },
    { label: 'Storage cost', before: '$1000/TB', after: '$23/TB' },
    { label: 'Large model support', after: '✓' },
  ],
  nextTeaser: "But we need to handle more concurrent uploads...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage: The Right Tool for ML Artifacts',
  conceptExplanation: `ML model files are **large, immutable binary data**. They don't belong in a database!

**Object Storage (S3, GCS, Azure Blob)** is perfect for ML artifacts because:
- **Scalable**: Store unlimited data (petabytes)
- **Cheap**: $0.023/GB vs $0.30/GB for database storage
- **Versioned**: Built-in versioning for model files
- **Durable**: 99.999999999% durability (11 nines)
- **Optimized for large files**: Multipart uploads for GB-sized models

**How it works:**
1. ML engineer uploads model → App server generates pre-signed URL
2. Client uploads model directly to S3 (doesn't go through server)
3. After upload, server stores S3 path in database metadata
4. To download: Server generates pre-signed download URL

**What to store:**
- Model weights (pickle, h5, safetensors, ONNX)
- Training code (Python scripts)
- Dependencies (requirements.txt, conda env)
- Training data references (not the data itself - too large)`,

  whyItMatters: 'Database storage is 13x more expensive than object storage. For 91TB/year, that\'s $27K vs $2K!',

  famousIncident: {
    title: 'Tesla Model Storage Evolution',
    company: 'Tesla',
    year: '2019',
    whatHappened: 'Initially stored ML model artifacts on local servers. As models grew (self-driving neural nets are huge), they ran out of storage. Migrated to S3, reducing costs by 90% and enabling unlimited scaling.',
    lessonLearned: 'Object storage is the only practical solution for large-scale ML artifact storage.',
    icon: '🚗',
  },

  realWorldExample: {
    company: 'Hugging Face',
    scenario: 'Hosting millions of ML models',
    howTheyDoIt: 'Uses S3 for model storage with CloudFront CDN for fast downloads. Metadata in PostgreSQL.',
  },

  diagram: `
Model Upload:
   │
   ▼
┌─────────────┐     1. Request pre-signed URL
│ App Server  │◀────────────────────────────────
└──────┬──────┘     2. Return S3 upload URL
       │            │
       ├────────────┼──▶ Database (store S3 path)
       │            │
       └────────────┼──▶ Object Storage (S3)
                    │    3. Client uploads directly
                    ▼
              ┌──────────┐
              │ S3 Bucket│
              │ models/  │
              │  v1.pkl  │
              │  v2.pkl  │
              └──────────┘
`,

  keyPoints: [
    'Store model files in object storage, NOT database',
    'Use pre-signed URLs for direct upload/download (bypass server)',
    'Database stores only the S3 path reference',
    'Object storage is 13x cheaper than database storage',
    'Organize by: models/{model_name}/versions/{version}/artifacts/',
  ],

  quickCheck: {
    question: 'Why is object storage better than database for model files?',
    options: [
      'It\'s faster',
      'It\'s 13x cheaper, infinitely scalable, and optimized for large files',
      'It has better query capabilities',
      'It provides ACID guarantees',
    ],
    correctIndex: 1,
    explanation: 'Object storage is designed for large binary data. It\'s dramatically cheaper and more scalable than databases.',
  },

  keyConcepts: [
    { title: 'Object Storage', explanation: 'S3-like storage for large files', icon: '☁️' },
    { title: 'Pre-signed URL', explanation: 'Temporary URL for direct S3 access', icon: '🔗' },
    { title: 'Versioning', explanation: 'Immutable model files with version IDs', icon: '📸' },
  ],
};

const step5: GuidedStep = {
  id: 'ml-registry-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: Store model artifacts (now supporting large files)',
    taskDescription: 'Add Object Storage for model files and artifacts',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store large model files, code, and dependencies', displayName: 'Object Storage (S3)' },
    ],
    successCriteria: [
      'Object Storage component added',
      'App Server connected to Object Storage',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Drag an Object Storage (S3) component onto the canvas',
    level2: 'Connect App Server to Object Storage. Model files will be stored here instead of database.',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 6: Add Load Balancer for High Availability
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your ML platform is popular! Usage just tripled.",
  hook: "Your single app server is struggling with concurrent uploads. Some model uploads are failing!",
  challenge: "Add a load balancer to distribute traffic across multiple servers.",
  illustration: 'server-overload',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Traffic is now distributed!',
  achievement: 'Load balancer enables horizontal scaling',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Concurrent uploads', before: '10', after: 'Unlimited (scales)' },
  ],
  nextTeaser: "But we need to track model lineage and experiments...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Handle Concurrent Model Operations',
  conceptExplanation: `A **Load Balancer** distributes incoming requests across multiple app servers.

Benefits for ML registries:
- **No single point of failure** - if one server crashes, others continue
- **Horizontal scaling** - add more servers as team grows
- **Concurrent uploads** - multiple engineers can upload models simultaneously
- **Health checks** - automatically route around failed servers

For ML workloads:
- Use **round-robin** or **least-connections** algorithm
- Enable **sticky sessions** for long-running uploads
- Configure **timeouts** appropriately (uploads can be slow)`,

  whyItMatters: 'As ML teams grow, concurrent model uploads increase. A single server becomes a bottleneck.',

  famousIncident: {
    title: 'OpenAI Model Release Overload',
    company: 'OpenAI',
    year: '2023',
    whatHappened: 'When GPT-4 was released, thousands of developers tried to download the model simultaneously. Their servers couldn\'t handle the load. Downloads failed for hours. They quickly added load balancers and CDN.',
    lessonLearned: 'Popular models see huge download spikes - load balancers are essential for availability.',
    icon: '🤖',
  },

  realWorldExample: {
    company: 'Hugging Face',
    scenario: 'Handling millions of model downloads',
    howTheyDoIt: 'Uses load balancers with auto-scaling to handle traffic spikes when popular models are released',
  },

  keyPoints: [
    'Load balancer distributes requests across app servers',
    'Enables scaling for growing ML teams',
    'Critical for handling concurrent model uploads',
    'Health checks detect and route around failed servers',
  ],

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Health Check', explanation: 'Monitor server availability', icon: '💓' },
  ],
};

const step6: GuidedStep = {
  id: 'ml-registry-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add a Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
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
// STEP 7: Add Message Queue for Async Lineage Processing
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔍',
  scenario: "ML engineers want to trace model lineage: which data, code, and experiments produced each model.",
  hook: "But computing lineage graphs is slow - it's blocking model registration! Upload latency went from 5s to 30s.",
  challenge: "Add a message queue to compute lineage and metrics asynchronously.",
  illustration: 'slow-processing',
};

const step7Celebration: CelebrationContent = {
  emoji: '📊',
  message: 'Model uploads are fast again!',
  achievement: 'Async processing handles lineage and analysis',
  metrics: [
    { label: 'Upload latency', before: '30s', after: '5s' },
    { label: 'Lineage computed', after: 'In background' },
    { label: 'Metrics analysis', after: 'Async' },
  ],
  nextTeaser: "But storage costs are growing fast...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Async Lineage and Analysis',
  conceptExplanation: `Some model operations are slow but not time-critical:
- **Lineage computation** - Trace dependencies (data, code, parent models)
- **Metrics analysis** - Compute statistical summaries
- **Artifact validation** - Check model files for corruption
- **Indexing** - Update search indexes for model discovery

**The Problem:**
Doing these synchronously blocks model registration. ML engineers wait 30+ seconds!

**The Solution: Message Queue**
1. Model uploaded → Store metadata → Publish event to queue → Return success ✅
2. Background workers consume queue
3. Compute lineage, analyze metrics, validate artifacts
4. Update database with results

**For ML registries, we queue:**
- \`model.registered\` → Compute lineage
- \`version.created\` → Analyze metrics
- \`artifact.uploaded\` → Validate and index`,

  whyItMatters: 'ML engineers shouldn\'t wait for slow analysis during upload. Async processing keeps the system responsive.',

  famousIncident: {
    title: 'Uber Michelangelo Lineage Scale',
    company: 'Uber',
    year: '2019',
    whatHappened: 'As Uber scaled to thousands of models, computing lineage synchronously caused timeouts. Model uploads started failing. They moved to async processing with Kafka, reducing upload time by 80%.',
    lessonLearned: 'As ML platforms scale, async processing becomes mandatory for non-critical operations.',
    icon: '🚗',
  },

  realWorldExample: {
    company: 'Databricks (MLflow)',
    scenario: 'Processing millions of experiment runs',
    howTheyDoIt: 'Uses message queues for async artifact validation, metric aggregation, and search indexing',
  },

  diagram: `
Model Upload
   │
   ▼
┌─────────────┐
│ App Server  │ ── Store metadata ──▶ Database
└──────┬──────┘
       │ Publish event
       ▼
┌─────────────────────────────────────┐
│        Message Queue                │
│  [model.registered, version.created]│
└──────────────┬──────────────────────┘
       │ Return "Upload successful!"
       │
       │ Workers consume
       ▼
┌─────────────────┐
│ Lineage Workers │ ── Compute lineage ──▶ Database
│  (background)   │ ── Analyze metrics  ──▶ Cache
└─────────────────┘
`,

  keyPoints: [
    'Queue decouples upload from slow analysis',
    'ML engineer gets instant response',
    'Workers process lineage, metrics, validation in background',
    'Critical for: lineage graphs, metric summaries, search indexing',
  ],

  quickCheck: {
    question: 'Why process lineage asynchronously instead of during upload?',
    options: [
      'It\'s cheaper',
      'ML engineers get instant response - lineage computed in background',
      'It uses less memory',
      'Lineage is optional',
    ],
    correctIndex: 1,
    explanation: 'Async means upload returns instantly. Lineage computation happens in background without blocking the user.',
  },

  keyConcepts: [
    { title: 'Async Processing', explanation: 'Decouple slow operations from main flow', icon: '⚡' },
    { title: 'Model Lineage', explanation: 'Trace data, code, experiments that created model', icon: '🌳' },
    { title: 'Background Worker', explanation: 'Process queue events asynchronously', icon: '🔧' },
  ],
};

const step7: GuidedStep = {
  id: 'ml-registry-step-7',
  stepNumber: 7,
  frIndex: 3,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-4: Compare models (enhanced with lineage tracking)',
    taskDescription: 'Add a Message Queue for async lineage and analysis',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Process lineage and metrics asynchronously', displayName: 'Message Queue (Kafka)' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'object_storage', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async lineage processing.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Storage Lifecycle & Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "Your CFO is alarmed! ML model storage costs are $100,000/month and growing.",
  hook: "She says: 'We have 5-year-old models nobody uses anymore. Why are we paying to store them in hot storage?'",
  challenge: "Implement storage lifecycle policies to optimize costs while maintaining access to recent models.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built an ML Model Registry!',
  achievement: 'A scalable, cost-effective platform for ML teams',
  metrics: [
    { label: 'Monthly storage cost', before: '$100K', after: '$15K' },
    { label: 'Model upload latency', after: '<5s' },
    { label: 'Metadata query latency', after: '<200ms' },
    { label: 'Storage optimization', after: '85% reduction' },
  ],
  nextTeaser: "You've mastered ML infrastructure design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Storage Lifecycle: Optimize ML Model Storage Costs',
  conceptExplanation: `ML model storage grows rapidly, but not all models are accessed frequently.

**Storage Tiers:**
1. **Hot (S3 Standard)** - Recent models, frequently accessed
   - Cost: $0.023/GB/month
   - Latency: Milliseconds
   - Use for: Models from last 90 days

2. **Cold (S3 Glacier)** - Old models, rarely accessed
   - Cost: $0.004/GB/month (83% cheaper!)
   - Latency: Minutes to hours for retrieval
   - Use for: Models older than 90 days

3. **Archive (S3 Deep Archive)** - Historical models
   - Cost: $0.001/GB/month (95% cheaper!)
   - Latency: 12 hours for retrieval
   - Use for: Models older than 1 year

**Lifecycle Policy:**
- Days 0-90: Hot storage (instant access)
- Days 90-365: Cold storage (rare access)
- After 365: Archive storage (compliance, rarely accessed)

**Additional Optimizations:**
- Delete duplicate models (same weights)
- Compress old artifacts
- Archive experiment artifacts more aggressively
- Keep only top N versions per model in hot storage`,

  whyItMatters: 'At 91TB/year growth:\n- All hot: $2,100/month\n- With lifecycle: $300/month\n- Savings: $1,800/month = $21,600/year!',

  famousIncident: {
    title: 'Netflix ML Storage Optimization',
    company: 'Netflix',
    year: '2021',
    whatHappened: 'Netflix had 10+ PB of ML artifacts in hot storage. Most were old experiments nobody accessed. They implemented lifecycle policies, moving 90% to cold/archive storage. Saved $5M/year in storage costs.',
    lessonLearned: 'Storage lifecycle management is critical for long-term ML platform sustainability.',
    icon: '📺',
  },

  realWorldExample: {
    company: 'Uber Michelangelo',
    scenario: 'Managing petabytes of ML artifacts',
    howTheyDoIt: 'Aggressive lifecycle policies: 30-day hot, 90-day cold, 1-year archive. Saves millions annually.',
  },

  keyPoints: [
    'Use S3 lifecycle policies to auto-transition old models to cheaper tiers',
    'Hot (90 days) → Cold (1 year) → Archive (forever)',
    'Archive reduces costs by 95% vs hot storage',
    'Keep metadata in database - only move artifacts',
    'Monitor access patterns to tune lifecycle policies',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for ML model storage?',
    options: [
      'Delete old models',
      'Use storage tiers with lifecycle policies (hot → cold → archive)',
      'Compress all models',
      'Store models in database',
    ],
    correctIndex: 1,
    explanation: 'Storage tiers with lifecycle policies provide 85%+ cost savings while maintaining access to old models for compliance.',
  },

  keyConcepts: [
    { title: 'Storage Tiers', explanation: 'Hot, cold, archive based on access patterns', icon: '🌡️' },
    { title: 'Lifecycle Policy', explanation: 'Auto-move objects between tiers over time', icon: '♻️' },
    { title: 'Cost Optimization', explanation: 'Reduce costs without losing data', icon: '💰' },
  ],
};

const step8: GuidedStep = {
  id: 'ml-registry-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Configure storage lifecycle policies to optimize costs',
    successCriteria: [
      'Click on Object Storage component',
      'Configure lifecycle policy: 90-day hot, 1-year cold, then archive',
      'Review estimated cost reduction',
      'Ensure all FRs still functional',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'object_storage', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Click on Object Storage and look for lifecycle/tiering configuration',
    level2: 'Set policy: Hot (0-90 days) → Cold (90-365 days) → Archive (365+ days)',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const mlModelRegistryGuidedTutorial: GuidedTutorial = {
  problemId: 'ml-model-registry',
  title: 'Design ML Model Registry',
  description: 'Build an ML model registry with versioning, artifact storage, and deployment tracking',
  difficulty: 'advanced',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '🤖',
    hook: "You've been hired as Lead ML Infrastructure Engineer at AI Labs Inc!",
    scenario: "Your mission: Build a model registry that can handle thousands of model versions with efficient storage and fast queries.",
    challenge: "Can you design a system that tracks model lineage, manages deployments, and optimizes storage costs?",
  },

  requirementsPhase: mlModelRegistryRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'Model Versioning',
    'Artifact Storage',
    'Deployment Tracking',
    'Metadata Management',
    'Object Storage',
    'Caching',
    'Load Balancing',
    'Async Processing',
    'Model Lineage',
    'Storage Lifecycle',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (Object storage for artifacts)',
    'Chapter 10: Batch Processing (Lineage computation)',
    'Chapter 11: Stream Processing (Async event processing)',
  ],
};

export default mlModelRegistryGuidedTutorial;
