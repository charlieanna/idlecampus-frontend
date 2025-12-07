import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Meta ML Platform Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial teaching ML infrastructure design through
 * building a Meta-style ML platform with feature stores, model training,
 * serving, and A/B testing.
 *
 * Key Concepts:
 * - Feature store architecture
 * - Batch vs real-time feature computation
 * - Model training pipelines
 * - Model serving at scale
 * - A/B testing and experimentation
 * - ML observability and monitoring
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const mlPlatformRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an ML platform like Meta's FBLearner",

  interviewer: {
    name: 'Dr. Emma Zhang',
    role: 'Director of ML Infrastructure at Meta',
    avatar: '👩‍🔬',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-ml-features',
      category: 'functional',
      question: "What are the main capabilities this ML platform needs to provide?",
      answer: "The ML platform needs to:\n\n1. **Train models** - Data scientists train models on large datasets\n2. **Serve predictions** - Real-time inference for production traffic\n3. **Manage features** - Centralized feature store for training and serving\n4. **A/B test models** - Safely test new models before full rollout\n5. **Monitor models** - Track prediction quality and model health",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-5',
      learningPoint: "ML platforms are about the infrastructure that enables data scientists to build, deploy, and improve models",
    },
    {
      id: 'feature-store-purpose',
      category: 'functional',
      question: "Why do we need a feature store? Can't we just query the database?",
      answer: "The feature store solves several critical problems:\n\n1. **Consistency**: Same features for training and serving (no train-serve skew)\n2. **Reusability**: Features computed once, used by many models\n3. **Low latency**: Pre-computed features serve in milliseconds\n4. **Point-in-time correctness**: Training uses historical feature values\n\nWithout a feature store, every model team recomputes features differently, causing inconsistencies.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Feature stores are essential for production ML - they prevent train-serve skew",
    },
    {
      id: 'batch-vs-realtime-features',
      category: 'functional',
      question: "What's the difference between batch and real-time features?",
      answer: "**Batch features**: Pre-computed periodically (daily/hourly)\n- User's total posts in last 30 days\n- Average engagement rate\n- Computed on historical data\n\n**Real-time features**: Computed on-demand at request time\n- User's last action timestamp\n- Current session duration\n- Computed from streaming events\n\nMost systems need both - batch for aggregates, real-time for fresh signals.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Batch features trade freshness for efficiency; real-time features trade cost for freshness",
    },
    {
      id: 'model-training-scale',
      category: 'functional',
      question: "How does model training work at scale?",
      answer: "Model training involves:\n1. **Data extraction**: Pull training data (features + labels) from data warehouse\n2. **Distributed training**: Train on multiple GPUs/TPUs in parallel\n3. **Hyperparameter tuning**: Try different configurations automatically\n4. **Model validation**: Test on holdout set before deployment\n5. **Model registry**: Store trained models with metadata",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Training is offline, batch-oriented - different infrastructure than serving",
    },
    {
      id: 'model-serving-requirements',
      category: 'functional',
      question: "What are the requirements for serving predictions?",
      answer: "Model serving must:\n- **Low latency**: p99 < 10ms for real-time predictions\n- **High throughput**: Handle millions of predictions per second\n- **High availability**: 99.99% uptime\n- **Versioning**: Serve multiple model versions simultaneously\n- **Batching**: Combine requests for GPU efficiency",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Serving is online, latency-critical - completely different from training",
    },
    {
      id: 'ab-testing-models',
      category: 'functional',
      question: "How do we safely test new models in production?",
      answer: "A/B testing for models:\n1. **Shadow mode**: New model runs but doesn't affect users (compare with current model)\n2. **Canary rollout**: Serve to 1% of traffic, monitor metrics\n3. **Gradual rollout**: Increase to 5%, 10%, 50%, 100% if metrics improve\n4. **Rollback**: Instantly revert if metrics degrade\n\nNever deploy a new model to 100% of users immediately!",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "ML models are code + data - changes can be unpredictable, requiring careful rollouts",
    },
    {
      id: 'model-monitoring',
      category: 'functional',
      question: "What kind of monitoring do ML models need?",
      answer: "Monitor:\n- **Prediction latency**: Are predictions slow?\n- **Prediction distribution**: Has the output distribution shifted?\n- **Feature drift**: Have input features changed?\n- **Model performance**: Are business metrics (CTR, conversion) degrading?\n- **Training-serving skew**: Are features computed differently?\n\nML models silently degrade over time - monitoring is essential.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      learningPoint: "Unlike traditional software, ML models degrade over time as data distributions change",
    },
    {
      id: 'online-learning',
      category: 'clarification',
      question: "Do we need online learning (continuous retraining)?",
      answer: "Not for MVP. Online learning is complex - models retrain continuously on new data. For MVP, focus on:\n- Batch retraining (daily or weekly)\n- Manual model updates via CI/CD\n\nOnline learning can be added later for fast-changing domains.",
      importance: 'nice-to-have',
      insight: "Online learning adds complexity - most companies start with periodic batch retraining",
    },
    {
      id: 'multi-model-serving',
      category: 'clarification',
      question: "Do we need to serve multiple models (e.g., newsfeed ranking, ad ranking)?",
      answer: "Yes! The platform serves many models:\n- Newsfeed ranking model\n- Ad click prediction model\n- Content recommendation model\n- Fraud detection model\n\nEach model is independently deployable with its own features and versions.",
      importance: 'important',
      insight: "ML platforms serve hundreds of models - multi-tenancy is critical",
    },

    // SCALE & NFRs
    {
      id: 'throughput-predictions',
      category: 'throughput',
      question: "How many predictions per second?",
      answer: "At Meta scale: 10 million predictions per second across all models. Peak is 3x average during high-traffic hours.",
      importance: 'critical',
      calculation: {
        formula: "10M predictions/sec average, 30M predictions/sec peak",
        result: "~30M predictions/sec requires massive horizontal scaling",
      },
      learningPoint: "ML serving is extremely high-throughput - need thousands of servers",
    },
    {
      id: 'throughput-features',
      category: 'throughput',
      question: "How many feature lookups per second?",
      answer: "Each prediction requires 50-200 features. At 10M predictions/sec, that's 500M - 2B feature lookups per second. Feature store must be extremely fast.",
      importance: 'critical',
      calculation: {
        formula: "10M predictions × 100 features = 1B feature lookups/sec",
        result: "Feature store is the bottleneck - must scale massively",
      },
      learningPoint: "Feature serving is often the bottleneck in ML systems",
    },
    {
      id: 'throughput-training',
      category: 'throughput',
      question: "How often do models retrain?",
      answer: "Critical models (newsfeed, ads) retrain daily on 100+ billion examples. Training jobs run on thousands of GPUs for 6-12 hours.",
      importance: 'important',
      learningPoint: "Training is batch-oriented, expensive, and resource-intensive",
    },
    {
      id: 'latency-prediction',
      category: 'latency',
      question: "What's the latency requirement for predictions?",
      answer: "p99 < 10ms for real-time serving (newsfeed, ads). Predictions must be fast enough for synchronous API calls.",
      importance: 'critical',
      learningPoint: "Low latency requires caching, batching, and optimized model formats",
    },
    {
      id: 'latency-features',
      category: 'latency',
      question: "How fast must feature lookups be?",
      answer: "p99 < 5ms for feature retrieval. Since each prediction needs 100+ features, feature store must be extremely fast (in-memory cache).",
      importance: 'critical',
      learningPoint: "Feature stores need Redis/Memcached for sub-millisecond lookups",
    },
    {
      id: 'payload-model-size',
      category: 'payload',
      question: "How large are the trained models?",
      answer: "Deep learning models: 100MB - 10GB each. Large language models can be 100GB+. Model registry stores thousands of model versions.",
      importance: 'important',
      calculation: {
        formula: "1000 models × 1GB average = 1TB storage",
        result: "Need object storage (S3) for model artifacts",
      },
      learningPoint: "Model storage requires object storage with versioning",
    },
    {
      id: 'availability-requirement',
      category: 'availability',
      question: "What's the uptime requirement for model serving?",
      answer: "99.99% availability - serving failures break user experience. Training can tolerate occasional failures (just retry).",
      importance: 'critical',
      learningPoint: "Serving is mission-critical; training is best-effort",
    },
    {
      id: 'consistency-requirement',
      category: 'consistency',
      question: "What consistency guarantees do we need?",
      answer: "**Eventual consistency** is OK for most features - if a user's like count is 1 second stale, predictions are still good. But **strong consistency** for critical features like fraud scores.",
      importance: 'important',
      insight: "ML can tolerate some staleness - unlike financial transactions",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-ml-features', 'feature-store-purpose', 'batch-vs-realtime-features', 'model-training-scale', 'ab-testing-models'],
  criticalFRQuestionIds: ['core-ml-features', 'feature-store-purpose', 'model-training-scale', 'model-serving-requirements'],
  criticalScaleQuestionIds: ['throughput-predictions', 'throughput-features', 'latency-prediction', 'availability-requirement'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Data scientists can train models',
      description: 'Submit training jobs on large datasets with distributed compute',
      emoji: '🧠',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Models can serve predictions',
      description: 'Real-time inference for production traffic at low latency',
      emoji: '⚡',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Centralized feature store',
      description: 'Consistent features for training and serving (batch + real-time)',
      emoji: '🗄️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: A/B test models safely',
      description: 'Shadow mode, canary rollout, gradual deployment',
      emoji: '🧪',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Monitor model health',
      description: 'Track latency, drift, performance metrics',
      emoji: '📊',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10M predictions/sec across all models',
    writesPerDay: '1B feature updates/day (batch), 10M/sec (real-time)',
    readsPerDay: '1B feature lookups/sec',
    peakMultiplier: 3,
    readWriteRatio: '100:1 (read-heavy for serving)',
    calculatedWriteRPS: { average: 11574, peak: 34722 },
    calculatedReadRPS: { average: 1000000000, peak: 3000000000 },
    maxPayloadSize: 'Models: 100MB-10GB, Features: 1-10KB',
    storagePerRecord: '~1GB per model version',
    storageGrowthPerYear: '~10TB (new models + versions)',
    redirectLatencySLA: 'p99 < 10ms (predictions)',
    createLatencySLA: 'p99 < 5ms (feature lookups)',
  },

  architecturalImplications: [
    '✅ 1B feature lookups/sec → In-memory cache (Redis) essential',
    '✅ 30M predictions/sec peak → Massive horizontal scaling',
    '✅ p99 < 10ms → Batching, model optimization, GPU serving',
    '✅ Train-serve consistency → Feature store mandatory',
    '✅ 99.99% availability → Multi-region deployment',
    '✅ Thousands of models → Multi-tenant architecture',
  ],

  outOfScope: [
    'Online learning (continuous retraining)',
    'AutoML (automatic model selection)',
    'Federated learning',
    'Model compression (quantization, pruning)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where data scientists can train models and serve predictions. The complexity of feature stores, A/B testing, and monitoring comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to Meta's ML Infrastructure team! You're building FBLearner 2.0.",
  hook: "Your first ML engineer wants to serve a newsfeed ranking model.",
  challenge: "Set up the basic request flow so clients can request predictions.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your ML platform is online!',
  achievement: 'Clients can now connect to your prediction service',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't have any models yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: ML Inference Server',
  conceptExplanation: `Every ML platform starts with a **Client** connecting to an **ML Serving Server**.

When a user loads their newsfeed:
1. The **Client** (mobile app) requests predictions
2. The **ML Server** loads the model and computes predictions
3. The server responds with ranked results

This is the inference path - separate from training!`,

  whyItMatters: 'Without this connection, ML models can\'t serve predictions to users.',

  realWorldExample: {
    company: 'Meta',
    scenario: 'Serving billions of predictions per day',
    howTheyDoIt: 'Meta uses thousands of prediction servers across data centers, serving models for newsfeed, ads, recommendations, etc.',
  },

  keyPoints: [
    'Client = user-facing app that needs predictions',
    'ML Server = hosts models and serves predictions',
    'Inference = making predictions on new data (different from training)',
    'HTTP/gRPC = protocols for prediction requests',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'App requesting predictions', icon: '📱' },
    { title: 'ML Server', explanation: 'Serves model predictions', icon: '🖥️' },
    { title: 'Inference', explanation: 'Making predictions on new data', icon: '🔮' },
  ],
};

const step1: GuidedStep = {
  id: 'ml-platform-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up foundation for ML serving',
    taskDescription: 'Add a Client and ML Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Apps requesting predictions', displayName: 'Client' },
      { type: 'app_server', reason: 'ML serving server', displayName: 'ML Server' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'ML Server component added to canvas',
      'Client connected to ML Server',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server onto the canvas',
    level2: 'Click the Client, then click the ML Server to create a connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Model Serving Logic (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your ML server is connected, but it doesn't know how to load models or make predictions!",
  hook: "A data scientist deployed a newsfeed ranking model, but requests fail.",
  challenge: "Write the Python code to load models and serve predictions.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your ML server can serve predictions!',
  achievement: 'You implemented model loading and inference',
  metrics: [
    { label: 'APIs implemented', after: '2' },
    { label: 'Can load models', after: '✓' },
    { label: 'Can serve predictions', after: '✓' },
  ],
  nextTeaser: "But models are stored in memory - they disappear on restart...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Model Serving: Loading and Inference',
  conceptExplanation: `Every ML server needs handlers to:

1. \`load_model(model_id)\` - Load model from disk/storage into memory
2. \`predict(model_id, features)\` - Run inference on input features
3. \`health_check()\` - Report server status

For now, we'll store models in memory. Model registry comes later.

**Key difference from training:**
- Training: Slow, batch-oriented, GPU-intensive
- Serving: Fast, real-time, latency-critical`,

  whyItMatters: 'Serving is the production path - it must be fast, reliable, and always available.',

  famousIncident: {
    title: 'Facebook ML Serving Outage',
    company: 'Meta',
    year: '2019',
    whatHappened: 'A bug in model loading caused newsfeed ranking to fall back to chronological order for 2 hours. User engagement dropped 30% immediately.',
    lessonLearned: 'ML serving failures directly impact user experience. Need graceful fallbacks.',
    icon: '📉',
  },

  realWorldExample: {
    company: 'Meta',
    scenario: 'Serving predictions for newsfeed ranking',
    howTheyDoIt: 'Uses PyTorch models exported to TorchScript, served via custom C++ inference servers for low latency',
  },

  keyPoints: [
    'load_model loads model weights into memory',
    'predict takes features, runs model, returns predictions',
    'In-memory storage for now - model registry comes later',
    'Serving needs to be fast (< 10ms p99)',
  ],

  quickCheck: {
    question: 'Why is model serving infrastructure different from training?',
    options: [
      'Training is optional, serving is critical',
      'Serving is latency-critical and user-facing; training is batch-oriented',
      'Serving uses different programming languages',
      'Training needs more storage',
    ],
    correctIndex: 1,
    explanation: 'Serving is real-time and user-facing (must be fast and reliable). Training is offline batch processing (can tolerate failures and delays).',
  },

  keyConcepts: [
    { title: 'Model Loading', explanation: 'Load model weights into memory', icon: '📥' },
    { title: 'Inference', explanation: 'Compute predictions on new data', icon: '🔮' },
    { title: 'Latency SLA', explanation: 'p99 < 10ms for production', icon: '⚡' },
  ],
};

const step2: GuidedStep = {
  id: 'ml-platform-step-2',
  stepNumber: 2,
  frIndex: 1,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-2: Serve predictions',
    taskDescription: 'Configure APIs and implement Python handlers for model serving',
    successCriteria: [
      'Click on ML Server to open inspector',
      'Assign POST /api/v1/predict API',
      'Open the Python tab',
      'Implement load_model() and predict() functions',
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
    level1: 'Click on the ML Server, then go to the APIs tab to assign endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement load_model and predict',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/predict'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Object Storage for Model Registry
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Your ML server crashed and all models are gone!",
  hook: "When it restarted, the models disappeared. Data scientists are furious - they can't deploy new models.",
  challenge: "Add object storage (S3) as a model registry to persist trained models.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '☁️',
  message: 'Models are safe forever!',
  achievement: 'Models now persist in object storage',
  metrics: [
    { label: 'Model persistence', after: 'Enabled' },
    { label: 'Model versions', after: 'Tracked' },
  ],
  nextTeaser: "But where do features come from?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Model Registry: Versioned Model Storage',
  conceptExplanation: `A **Model Registry** stores trained models with versioning:

- Models are large binary files (100MB - 10GB)
- Need versioning (v1, v2, v3)
- Need metadata (accuracy, training date, hyperparameters)
- Object storage (S3) is perfect for this

Architecture:
1. **Training job** saves model to S3
2. **Model registry** indexes models with metadata
3. **ML server** downloads models from S3 on startup

Popular tools: MLflow, Weights & Biases, SageMaker Model Registry`,

  whyItMatters: 'Without a model registry, you can\'t track model versions, rollback bad deployments, or reproduce results.',

  famousIncident: {
    title: 'Knight Capital Trading Disaster',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'A deployment activated old trading algorithms alongside new ones. Lost $440M in 45 minutes. Root cause: No version control for algorithm deployments.',
    lessonLearned: 'Model/algorithm versioning is critical. Always know exactly which version is deployed.',
    icon: '💸',
  },

  realWorldExample: {
    company: 'Meta',
    scenario: 'Storing thousands of model versions',
    howTheyDoIt: 'Uses internal model registry backed by HDFS/S3. Each model has metadata: accuracy, training data, hyperparameters.',
  },

  keyPoints: [
    'Object storage (S3) stores model binaries',
    'Model registry tracks versions and metadata',
    'ML servers download models on startup',
    'Enables rollback, A/B testing, reproducibility',
  ],

  quickCheck: {
    question: 'Why use object storage instead of a database for models?',
    options: [
      'Databases are too expensive',
      'Models are large binary files - object storage is optimized for this',
      'Object storage is faster',
      'Databases can\'t store binary data',
    ],
    correctIndex: 1,
    explanation: 'Models are large (GB), making databases slow and expensive. Object storage is designed for large binary objects.',
  },

  keyConcepts: [
    { title: 'Model Registry', explanation: 'Tracks model versions and metadata', icon: '📚' },
    { title: 'Object Storage', explanation: 'S3 for large model binaries', icon: '☁️' },
    { title: 'Versioning', explanation: 'Track v1, v2, v3 for rollback', icon: '🔢' },
  ],
};

const step3: GuidedStep = {
  id: 'ml-platform-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Models need persistent storage',
    taskDescription: 'Add Object Storage for model registry',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store model binaries and versions', displayName: 'S3 Model Registry' },
    ],
    successCriteria: [
      'Object Storage component added',
      'ML Server connected to Object Storage',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Drag Object Storage (S3) onto the canvas',
    level2: 'Connect ML Server to Object Storage for model downloads',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 4: Add Feature Store (Database + Cache)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🗄️',
  scenario: "Your newsfeed model needs 200 features per prediction!",
  hook: "Right now, each prediction re-computes features from scratch. It takes 500ms! Users are abandoning.",
  challenge: "Add a feature store to pre-compute and serve features fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Feature serving is 100x faster!',
  achievement: 'Features pre-computed and cached',
  metrics: [
    { label: 'Feature latency', before: '500ms', after: '5ms' },
    { label: 'Train-serve consistency', after: '✓' },
  ],
  nextTeaser: "But feature lookups are hitting the database...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Feature Store: The Heart of ML Infrastructure',
  conceptExplanation: `A **Feature Store** is the most critical component of production ML.

Problems it solves:
1. **Train-serve skew**: Features computed differently in training vs serving
2. **Reusability**: Features used by multiple models
3. **Performance**: Pre-computed features serve in milliseconds
4. **Point-in-time correctness**: Training uses historical feature values

Architecture:
- **Offline store** (Database/Data Warehouse): Historical features for training
- **Online store** (Redis/Cache): Low-latency features for serving
- **Feature engineering**: Batch + real-time computation`,

  whyItMatters: 'Without a feature store, every model team recomputes features differently, causing train-serve skew and wasting compute.',

  famousIncident: {
    title: 'Uber Michelangelo Feature Store',
    company: 'Uber',
    year: '2017',
    whatHappened: 'Before Michelangelo, different teams computed features differently for training vs serving. Models trained with 90% accuracy only achieved 60% in production due to train-serve skew. Feature store solved this.',
    lessonLearned: 'Feature store is mandatory for production ML - prevents train-serve skew.',
    icon: '🎨',
  },

  realWorldExample: {
    company: 'Meta',
    scenario: 'Serving features for billions of predictions',
    howTheyDoIt: 'Uses internal feature store (Hydrogen) with offline store (Hive) for training and online store (RocksDB) for serving.',
  },

  diagram: `
┌─────────────┐     ┌──────────────┐     ┌─────────┐
│ ML Training │ ──▶ │ Offline Store│ ──▶ │  Hive   │
│   (Batch)   │     │  (Database)  │     │ Warehouse│
└─────────────┘     └──────────────┘     └─────────┘

┌─────────────┐     ┌──────────────┐     ┌─────────┐
│ ML Serving  │ ──▶ │ Online Store │ ──▶ │  Redis  │
│ (Real-time) │     │   (Cache)    │     │  Cache  │
└─────────────┘     └──────────────┘     └─────────┘
`,

  keyPoints: [
    'Database stores historical features for training (offline)',
    'Cache stores current features for serving (online)',
    'Same feature definitions for training and serving',
    'Features computed once, used by many models',
  ],

  quickCheck: {
    question: 'What is train-serve skew?',
    options: [
      'When training takes longer than serving',
      'When features are computed differently in training vs serving, causing accuracy drops',
      'When the model is trained on old data',
      'When serving infrastructure is slower than training',
    ],
    correctIndex: 1,
    explanation: 'Train-serve skew happens when features are computed differently in training vs serving, causing models to underperform in production.',
  },

  keyConcepts: [
    { title: 'Offline Store', explanation: 'Historical features for training', icon: '🗄️' },
    { title: 'Online Store', explanation: 'Low-latency features for serving', icon: '⚡' },
    { title: 'Train-Serve Skew', explanation: 'Feature computation differences', icon: '⚠️' },
  ],
};

const step4: GuidedStep = {
  id: 'ml-platform-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Centralized feature store',
    taskDescription: 'Add Database (offline) and Cache (online) for feature storage',
    componentsNeeded: [
      { type: 'database', reason: 'Offline store for historical features', displayName: 'Feature Database' },
      { type: 'cache', reason: 'Online store for real-time features', displayName: 'Feature Cache' },
    ],
    successCriteria: [
      'Database added (offline feature store)',
      'Cache added (online feature store)',
      'ML Server connected to both',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'object_storage', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add Database for offline features and Cache for online features',
    level2: 'Connect ML Server to both Database and Cache. Database = training, Cache = serving',
    solutionComponents: [{ type: 'database' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Stream Processing for Real-Time Features
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📡',
  scenario: "Your ad ranking model needs real-time features!",
  hook: "Batch features (computed daily) are stale. You need features from the last 5 minutes!",
  challenge: "Add stream processing to compute real-time features from live events.",
  illustration: 'streaming-data',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Real-time features are live!',
  achievement: 'Features computed from streaming events',
  metrics: [
    { label: 'Feature freshness', before: '24 hours', after: '5 seconds' },
    { label: 'Real-time features', after: 'Enabled' },
  ],
  nextTeaser: "But one ML server can't handle the load...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Stream Processing for Real-Time Features',
  conceptExplanation: `**Real-time features** need fresh data - seconds, not hours.

Two types of features:
1. **Batch features** (daily): User's total likes in 30 days
2. **Real-time features** (seconds): User's last 3 clicks

Stream processing pipeline:
1. User actions → Event Stream (Kafka)
2. Stream processor (Flink/Spark Streaming) aggregates events
3. Write to online feature store (Cache)

Use cases:
- Recent click patterns
- Session duration
- Fraud detection signals`,

  whyItMatters: 'Fresh features improve model accuracy. Ads/fraud detection need sub-minute freshness.',

  famousIncident: {
    title: 'Twitter Real-Time ML',
    company: 'Twitter',
    year: '2016',
    whatHappened: 'Twitter moved from batch features (24h lag) to real-time features (5 min lag) for timeline ranking. Engagement increased 10%+ because models saw recent interactions.',
    lessonLearned: 'Real-time features significantly improve model quality for time-sensitive predictions.',
    icon: '🐦',
  },

  realWorldExample: {
    company: 'Meta',
    scenario: 'Real-time features for ads',
    howTheyDoIt: 'Uses Apache Flink to process billions of events/sec, computing features like "clicks in last 5 minutes" and writing to RocksDB.',
  },

  diagram: `
User Actions → Kafka → Flink Stream → Feature Cache → ML Server
  (clicks)     Events   Processing      (Redis)      (predictions)
`,

  keyPoints: [
    'Stream processing computes features from live events',
    'Use Kafka/Kinesis for event streaming',
    'Use Flink/Spark Streaming for aggregations',
    'Write to cache (Redis) for low-latency serving',
  ],

  quickCheck: {
    question: 'When do you need real-time features vs batch features?',
    options: [
      'Real-time features are always better',
      'Real-time when recent user behavior matters (fraud, ads); batch for stable aggregates',
      'Batch is always cheaper',
      'Real-time features are only for training',
    ],
    correctIndex: 1,
    explanation: 'Real-time features when freshness matters (fraud detection, ad ranking). Batch features for stable aggregates (total posts, average rating).',
  },

  keyConcepts: [
    { title: 'Event Stream', explanation: 'Kafka/Kinesis for user events', icon: '📡' },
    { title: 'Stream Processing', explanation: 'Flink/Spark for aggregations', icon: '⚙️' },
    { title: 'Feature Freshness', explanation: 'Seconds vs hours vs days', icon: '⏱️' },
  ],
};

const step5: GuidedStep = {
  id: 'ml-platform-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-3: Real-time features from streaming events',
    taskDescription: 'Add Message Queue for event streaming and stream processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Event stream (Kafka) for user actions', displayName: 'Kafka Events' },
    ],
    successCriteria: [
      'Message Queue added',
      'Connected to Cache (stream → features)',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'object_storage', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'message_queue', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add Message Queue (Kafka) for streaming events',
    level2: 'Connect Message Queue to Cache - stream processing writes real-time features to cache',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'message_queue', to: 'cache' }],
  },
};

// =============================================================================
// STEP 6: Add Load Balancer for Horizontal Scaling
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your single ML server is at 100% CPU!",
  hook: "You're serving 10 million predictions per second. One server can't handle it!",
  challenge: "Add a load balancer to distribute traffic across multiple ML servers.",
  illustration: 'server-overload',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Traffic is distributed!',
  achievement: 'Load balancer spreads requests across servers',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Request distribution', after: 'Balanced' },
  ],
  nextTeaser: "But we still only have one ML server instance...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing for ML Serving',
  conceptExplanation: `A **Load Balancer** distributes prediction requests across multiple ML servers.

Benefits:
- **No single point of failure** - if one server dies, others continue
- **Horizontal scaling** - add more servers for more throughput
- **Even distribution** - no server gets overwhelmed

For ML serving:
- Use least-connections (not round-robin) - predictions vary in latency
- Health checks monitor model loading status
- Sticky sessions for A/B testing`,

  whyItMatters: 'At Meta scale (10M predictions/sec), you need thousands of ML servers. Load balancing is essential.',

  realWorldExample: {
    company: 'Meta',
    scenario: 'Serving predictions at massive scale',
    howTheyDoIt: 'Uses thousands of prediction servers behind load balancers. Auto-scales based on traffic patterns.',
  },

  keyPoints: [
    'Load balancer distributes requests across ML servers',
    'Enables horizontal scaling (add more servers)',
    'Use least-connections for varying prediction latencies',
    'Health checks ensure models are loaded',
  ],

  quickCheck: {
    question: 'Why use least-connections instead of round-robin for ML serving?',
    options: [
      'Least-connections is faster',
      'ML predictions have varying latency - least-connections balances load better',
      'Round-robin doesn\'t work with ML',
      'Least-connections is required for GPUs',
    ],
    correctIndex: 1,
    explanation: 'ML predictions vary in latency (simple vs complex). Least-connections sends requests to less busy servers, balancing load better.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers for throughput', icon: '↔️' },
    { title: 'Health Checks', explanation: 'Monitor model loading status', icon: '💓' },
  ],
};

const step6: GuidedStep = {
  id: 'ml-platform-step-6',
  stepNumber: 6,
  frIndex: 1,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-2: Scale prediction serving',
    taskDescription: 'Add Load Balancer between Client and ML Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across ML servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer added',
      'Client → Load Balancer → ML Server',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'object_storage', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'message_queue', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add Load Balancer between Client and ML Server',
    level2: 'Reconnect: Client → Load Balancer → ML Server',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 7: Scale ML Servers Horizontally
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📈',
  scenario: "Peak traffic is here! 30 million predictions per second!",
  hook: "Even with load balancing, one ML server instance can't handle this throughput.",
  challenge: "Scale horizontally by adding more ML server instances.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'You can handle 10x the traffic!',
  achievement: 'Multiple ML servers share the load',
  metrics: [
    { label: 'ML Server instances', before: '1', after: '10+' },
    { label: 'Throughput', before: '3M/sec', after: '30M/sec' },
  ],
  nextTeaser: "But how do we safely deploy new models?",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling for ML Serving',
  conceptExplanation: `**Horizontal scaling** means adding more ML servers.

ML serving considerations:
- Each server loads models into memory (GPU/CPU)
- Models are stateless - any server can handle any request
- Auto-scale based on CPU/GPU utilization
- Pre-warm new servers (load models before traffic)

At Meta scale:
- 1000s of ML servers
- Auto-scaling based on time-of-day patterns
- Models loaded from shared model registry (S3)`,

  whyItMatters: 'ML serving is compute-intensive (especially GPUs). Horizontal scaling is the only way to handle massive throughput.',

  famousIncident: {
    title: 'OpenAI ChatGPT Launch',
    company: 'OpenAI',
    year: '2022',
    whatHappened: 'ChatGPT gained 1M users in 5 days. Inference servers couldn\'t keep up - users saw "at capacity" errors. Had to rapidly scale horizontally with massive GPU clusters.',
    lessonLearned: 'ML serving needs aggressive auto-scaling for viral growth.',
    icon: '🤖',
  },

  realWorldExample: {
    company: 'Meta',
    scenario: 'Serving predictions globally',
    howTheyDoIt: 'Uses auto-scaling groups with 1000s of ML servers. Scales up during peak hours, down at night.',
  },

  keyPoints: [
    'Add more ML server instances to handle more traffic',
    'Load balancer distributes across all instances',
    'All instances share feature store and model registry',
    'Pre-warm new servers (load models before traffic)',
  ],

  quickCheck: {
    question: 'Why pre-warm ML servers before sending traffic?',
    options: [
      'Models are expensive to load',
      'Loading models takes time (seconds) - pre-warming prevents slow first requests',
      'GPUs need to warm up',
      'It\'s a best practice',
    ],
    correctIndex: 1,
    explanation: 'Loading large models (GB) into memory takes seconds. Pre-warming ensures servers are ready before receiving traffic.',
  },

  keyConcepts: [
    { title: 'Horizontal Scaling', explanation: 'Add more servers for throughput', icon: '↔️' },
    { title: 'Stateless Serving', explanation: 'Any server can handle any request', icon: '🔄' },
    { title: 'Pre-warming', explanation: 'Load models before traffic', icon: '🔥' },
  ],
};

const step7: GuidedStep = {
  id: 'ml-platform-step-7',
  stepNumber: 7,
  frIndex: 1,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-2: Scale prediction serving horizontally',
    taskDescription: 'Scale ML Server to multiple instances',
    successCriteria: [
      'Click on ML Server component',
      'Go to Configuration tab',
      'Set instances to 10 or more',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'object_storage', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'message_queue', toType: 'cache' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Click on ML Server, find instance count in Configuration',
    level2: 'Set instances to 10+. Load balancer will distribute traffic across all.',
    solutionComponents: [{ type: 'app_server', config: { instances: 10 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add A/B Testing Infrastructure
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🧪',
  scenario: "A data scientist wants to deploy a new newsfeed ranking model!",
  hook: "Deploying to 100% of users is risky. What if the model is broken? Users might revolt!",
  challenge: "Add A/B testing infrastructure to safely test new models.",
  illustration: 'experiment',
};

const step8Celebration: CelebrationContent = {
  emoji: '✅',
  message: 'Safe model deployments enabled!',
  achievement: 'Can A/B test models before full rollout',
  metrics: [
    { label: 'Shadow mode', after: 'Enabled' },
    { label: 'Canary rollout', after: 'Enabled' },
    { label: 'Safe deployments', after: '✓' },
  ],
  nextTeaser: "But how do we monitor model performance?",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'A/B Testing for ML Models',
  conceptExplanation: `**A/B testing** for ML is different from traditional A/B tests.

Deployment stages:
1. **Shadow mode**: New model runs but doesn't affect users
   - Compare predictions with current model
   - Check for errors, latency, crashes
2. **Canary rollout**: Serve to 1% of traffic
   - Monitor business metrics (CTR, engagement)
   - Watch for prediction quality issues
3. **Gradual rollout**: 5% → 10% → 50% → 100%
   - Increase if metrics improve
   - Rollback instantly if metrics degrade

Implementation:
- Use feature flags to control traffic split
- Log predictions from both models for comparison
- Monitor metrics: latency, error rate, business KPIs`,

  whyItMatters: 'ML models can fail in unpredictable ways. A/B testing prevents bad models from degrading user experience.',

  famousIncident: {
    title: 'Netflix Prize Algorithm Deployment',
    company: 'Netflix',
    year: '2009',
    whatHappened: 'Netflix Prize winner improved offline accuracy by 10%. But when deployed, it didn\'t improve user satisfaction. The algorithm was too complex, making recommendations less diverse. Never deployed to 100%.',
    lessonLearned: 'Offline metrics don\'t always predict online performance. Always A/B test in production.',
    icon: '🏆',
  },

  realWorldExample: {
    company: 'Meta',
    scenario: 'A/B testing newsfeed ranking models',
    howTheyDoIt: 'Uses internal experimentation platform. New models start in shadow mode, then 1% canary, gradual rollout based on engagement metrics.',
  },

  diagram: `
Deployment Pipeline:
Shadow → 1% Canary → 5% → 10% → 50% → 100%
  ↓         ↓          ↓      ↓       ↓       ↓
Monitor  Monitor    Good?  Good?   Good?   Done!
           ↓
        Rollback if bad
`,

  keyPoints: [
    'Shadow mode: run new model without affecting users',
    'Canary rollout: start with 1% of traffic',
    'Gradual rollout: increase if metrics improve',
    'Instant rollback if metrics degrade',
  ],

  quickCheck: {
    question: 'Why start with shadow mode before canary rollout?',
    options: [
      'Shadow mode is faster',
      'Shadow mode lets you test for errors/crashes without affecting users',
      'Shadow mode is required by regulation',
      'Canary mode is more expensive',
    ],
    correctIndex: 1,
    explanation: 'Shadow mode runs the new model without affecting users, catching errors/crashes before any users see the new model.',
  },

  keyConcepts: [
    { title: 'Shadow Mode', explanation: 'Run model without affecting users', icon: '👁️' },
    { title: 'Canary Rollout', explanation: 'Test on 1% of traffic first', icon: '🐤' },
    { title: 'Gradual Rollout', explanation: 'Increase traffic if metrics improve', icon: '📈' },
  ],
};

const step8: GuidedStep = {
  id: 'ml-platform-step-8',
  stepNumber: 8,
  frIndex: 3,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-4: A/B test models safely',
    taskDescription: 'Configure ML Server for A/B testing (shadow mode, canary)',
    successCriteria: [
      'A/B testing strategy configured',
      'Shadow mode enabled',
      'Canary rollout percentage set',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'object_storage', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'message_queue', toType: 'cache' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Click on ML Server, configure A/B testing in Configuration tab',
    level2: 'Enable shadow mode and set canary rollout percentage (1-5%)',
    solutionComponents: [
      {
        type: 'app_server',
        config: {
          abTesting: { enabled: true, shadowMode: true, canaryPercent: 1 },
        },
      },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 9: Add Monitoring and Observability
// =============================================================================

const step9Story: StoryContent = {
  emoji: '📊',
  scenario: "Your models are serving predictions, but something feels off...",
  hook: "User engagement is dropping 5%. Which model? Which feature? You have no visibility!",
  challenge: "Add monitoring to track model performance and detect issues.",
  illustration: 'monitoring',
};

const step9Celebration: CelebrationContent = {
  emoji: '👁️',
  message: 'Full observability enabled!',
  achievement: 'Can monitor model health and detect issues',
  metrics: [
    { label: 'Latency monitoring', after: 'Enabled' },
    { label: 'Prediction drift', after: 'Tracked' },
    { label: 'Feature drift', after: 'Tracked' },
  ],
  nextTeaser: "Almost done! Let's add training infrastructure...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'ML Observability: Monitoring Models in Production',
  conceptExplanation: `**ML monitoring** is different from traditional software monitoring.

What to monitor:
1. **Serving metrics**: Latency, throughput, error rate
2. **Prediction distribution**: Has output distribution shifted?
3. **Feature drift**: Have input features changed?
4. **Model performance**: Business metrics (CTR, conversion)
5. **Training-serving skew**: Are features computed differently?

Tools:
- **Prometheus/Grafana**: Latency, throughput dashboards
- **ML-specific tools**: WhyLabs, Arize, Fiddler
- **Custom dashboards**: Prediction distribution, feature drift

Unlike traditional software, ML models silently degrade over time as data distributions change.`,

  whyItMatters: 'Models can silently fail - accuracy degrades, predictions drift. Without monitoring, you won\'t know until users complain.',

  famousIncident: {
    title: 'Amazon Price Recommendation Bug',
    company: 'Amazon',
    year: '2018',
    whatHappened: 'A price recommendation model started suggesting $0.01 for thousands of products. The model trained on corrupted data but nobody noticed until customers started complaining. Took hours to detect and rollback.',
    lessonLearned: 'Monitor prediction distributions - extreme values indicate model issues.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Meta',
    scenario: 'Monitoring thousands of models',
    howTheyDoIt: 'Uses internal observability platform tracking latency, prediction drift, feature drift. Automated alerts when metrics deviate.',
  },

  keyPoints: [
    'Monitor latency, throughput, error rate (like traditional software)',
    'Monitor prediction distribution (ML-specific)',
    'Monitor feature drift (data distribution changes)',
    'Track business metrics (CTR, engagement)',
  ],

  quickCheck: {
    question: 'What is feature drift?',
    options: [
      'When features are computed slowly',
      'When input feature distributions change over time, indicating model may be stale',
      'When features are missing',
      'When features are corrupted',
    ],
    correctIndex: 1,
    explanation: 'Feature drift means input distributions have changed - model trained on old data may perform poorly on new data.',
  },

  keyConcepts: [
    { title: 'Prediction Drift', explanation: 'Output distribution changes', icon: '📉' },
    { title: 'Feature Drift', explanation: 'Input distribution changes', icon: '📊' },
    { title: 'Model Degradation', explanation: 'Performance drops over time', icon: '⚠️' },
  ],
};

const step9: GuidedStep = {
  id: 'ml-platform-step-9',
  stepNumber: 9,
  frIndex: 4,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-5: Monitor model health',
    taskDescription: 'Add monitoring infrastructure for ML observability',
    componentsNeeded: [
      { type: 'monitoring', reason: 'Track model performance and detect drift', displayName: 'Monitoring' },
    ],
    successCriteria: [
      'Monitoring component added',
      'Connected to ML Server for metrics',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'object_storage', 'database', 'cache', 'message_queue', 'monitoring'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'message_queue', toType: 'cache' },
      { fromType: 'app_server', toType: 'monitoring' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Add Monitoring component for ML observability',
    level2: 'Connect ML Server to Monitoring to send metrics',
    solutionComponents: [{ type: 'monitoring' }],
    solutionConnections: [{ from: 'app_server', to: 'monitoring' }],
  },
};

// =============================================================================
// STEP 10: Add Training Infrastructure
// =============================================================================

const step10Story: StoryContent = {
  emoji: '🧠',
  scenario: "Your platform serves models, but how do data scientists train them?",
  hook: "A data scientist needs to train a new fraud detection model on 10 billion examples!",
  challenge: "Add distributed training infrastructure for model development.",
  illustration: 'training',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a Meta-style ML platform!',
  achievement: 'A complete ML infrastructure with training, serving, and monitoring',
  metrics: [
    { label: 'Prediction throughput', after: '30M/sec' },
    { label: 'Feature latency', after: '<5ms' },
    { label: 'Model training', after: 'Distributed' },
    { label: 'A/B testing', after: 'Enabled' },
    { label: 'Monitoring', after: 'Full observability' },
  ],
  nextTeaser: "You've mastered ML platform design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Distributed Model Training at Scale',
  conceptExplanation: `**Training infrastructure** enables data scientists to build models.

Training pipeline:
1. **Data extraction**: Pull training data from data warehouse
2. **Feature engineering**: Compute features (batch + real-time)
3. **Distributed training**: Train on multiple GPUs/TPUs
4. **Hyperparameter tuning**: Try different configurations
5. **Model validation**: Test on holdout set
6. **Model registry**: Save to S3 with metadata

Training vs Serving:
- **Training**: Offline, batch, GPU-intensive, can tolerate failures
- **Serving**: Online, real-time, latency-critical, must be reliable

Infrastructure needs:
- GPU/TPU clusters for training
- Data warehouse for training data
- Orchestration (Airflow, Kubeflow) for pipelines`,

  whyItMatters: 'Without training infrastructure, data scientists can\'t build or improve models. Training is the other half of ML platforms.',

  realWorldExample: {
    company: 'Meta',
    scenario: 'Training models on billions of examples',
    howTheyDoIt: 'Uses internal training platform (FBLearner Flow) with thousands of GPUs. Data scientists submit training jobs via Python SDK.',
  },

  keyPoints: [
    'Training is offline, batch-oriented (different from serving)',
    'Need GPU/TPU clusters for deep learning',
    'Pull training data from data warehouse (Hive, BigQuery)',
    'Save trained models to model registry (S3)',
  ],

  quickCheck: {
    question: 'Why is training infrastructure separate from serving infrastructure?',
    options: [
      'Training is more expensive',
      'Training is offline batch processing (GPU-intensive), serving is online real-time (latency-critical)',
      'They use different programming languages',
      'Training requires more storage',
    ],
    correctIndex: 1,
    explanation: 'Training is offline batch processing optimized for throughput. Serving is online real-time optimized for latency. Completely different requirements.',
  },

  keyConcepts: [
    { title: 'Distributed Training', explanation: 'Train on multiple GPUs in parallel', icon: '🔀' },
    { title: 'Data Warehouse', explanation: 'Source of training data', icon: '🏢' },
    { title: 'Model Registry', explanation: 'Save trained models with metadata', icon: '📚' },
  ],
};

const step10: GuidedStep = {
  id: 'ml-platform-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'FR-1: Train models at scale',
    taskDescription: 'Add training infrastructure (Data Warehouse for training data)',
    componentsNeeded: [
      { type: 'database', reason: 'Data Warehouse for training data', displayName: 'Data Warehouse' },
    ],
    successCriteria: [
      'Data Warehouse added for training data',
      'Connected to ML Server for model training',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'object_storage', 'database', 'cache', 'message_queue', 'monitoring'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'message_queue', toType: 'cache' },
      { fromType: 'app_server', toType: 'monitoring' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'The existing Database is already the data warehouse for training',
    level2: 'Your architecture is complete! Training uses Database (offline features), serving uses Cache (online features).',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const l5MlPlatformMetaGuidedTutorial: GuidedTutorial = {
  problemId: 'l5-ml-platform-meta',
  title: 'Design Meta ML Platform',
  description: 'Build a production ML platform with feature store, model training, serving, A/B testing, and monitoring',
  difficulty: 'advanced',
  estimatedMinutes: 75,

  welcomeStory: {
    emoji: '🧠',
    hook: "You've been hired as ML Infrastructure Lead at Meta!",
    scenario: "Your mission: Build FBLearner 2.0 - a platform that enables thousands of data scientists to train, deploy, and monitor ML models at massive scale.",
    challenge: "Can you design a system that serves 10 million predictions per second with sub-10ms latency?",
  },

  requirementsPhase: mlPlatformRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  // Meta information
  concepts: [
    'ML Inference Server',
    'Model Registry',
    'Feature Store (Offline + Online)',
    'Batch vs Real-Time Features',
    'Stream Processing',
    'Model Serving at Scale',
    'Load Balancing for ML',
    'Horizontal Scaling',
    'A/B Testing for Models',
    'Shadow Mode & Canary Rollout',
    'ML Observability',
    'Prediction & Feature Drift',
    'Distributed Training',
    'Train-Serve Consistency',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, Maintainable Applications',
    'Chapter 3: Storage and Retrieval',
    'Chapter 5: Replication',
    'Chapter 11: Stream Processing',
  ],
};

export default l5MlPlatformMetaGuidedTutorial;
