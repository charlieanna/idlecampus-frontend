import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Fraud Detection Stream Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 7-step tutorial that teaches real-time stream processing
 * for fraud detection with ML inference, rule engines, and alert generation.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-7: Scale with NFRs (streaming, ML, caching, analytics)
 *
 * Key Concepts:
 * - Real-time transaction scoring
 * - ML model inference at scale
 * - Rule engine for fraud patterns
 * - Alert generation and routing
 * - Stream processing architecture
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const fraudDetectionRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a real-time fraud detection system for transaction streams",

  interviewer: {
    name: 'Dr. Maya Patel',
    role: 'Head of Risk Engineering at FinanceGuard',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-fraud-detection',
      category: 'functional',
      question: "What's the main functionality needed for fraud detection?",
      answer: "The system needs to:\n\n1. **Score transactions in real-time** - Analyze each transaction as it happens\n2. **Apply fraud rules** - Check for known fraud patterns (velocity limits, geographic anomalies, etc.)\n3. **Run ML inference** - Use trained models to predict fraud probability\n4. **Generate alerts** - Notify fraud analysts when suspicious activity is detected\n5. **Decide approve/decline** - Return decision within milliseconds",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Fraud detection is a real-time decision system - speed and accuracy are both critical",
    },
    {
      id: 'fraud-signals',
      category: 'functional',
      question: "What signals do we use to detect fraud?",
      answer: "We combine multiple signals:\n\n**Transaction attributes:**\n- Amount, merchant category, location\n- Device fingerprint, IP address\n- Time of day, day of week\n\n**User behavior:**\n- Historical transaction patterns\n- Velocity (# of transactions in time window)\n- Geographic anomalies (location jumps)\n\n**ML features:**\n- Account age, transaction history\n- Network analysis (connections to known fraudsters)",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Effective fraud detection combines rules (known patterns) with ML (unknown patterns)",
    },
    {
      id: 'rule-engine',
      category: 'functional',
      question: "How do the fraud rules work?",
      answer: "Rules are **if-then logic** that catch known fraud patterns:\n\n- **Velocity rules**: Block if >5 transactions in 10 minutes\n- **Amount rules**: Flag if amount >$5000\n- **Geographic rules**: Alert if transaction is 500+ miles from last transaction within 1 hour\n- **Merchant rules**: Block high-risk merchant categories\n\nRules need to be **configurable** - fraud analysts update them daily based on new attack patterns.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Rule engines need to be fast (evaluate in <5ms) and flexible (update without code deploy)",
    },
    {
      id: 'ml-inference',
      category: 'functional',
      question: "How does ML model inference work?",
      answer: "We have a **trained ML model** (gradient boosted trees) that predicts fraud probability:\n\n1. **Feature extraction**: Convert transaction into 50-100 features\n2. **Model inference**: Run model to get fraud score (0.0 to 1.0)\n3. **Threshold**: If score >0.8, mark as high risk\n\nModels are **retrained weekly** on new fraud data but **served in real-time** from memory.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "ML models must be pre-loaded in memory for low-latency inference (<10ms)",
    },
    {
      id: 'alert-generation',
      category: 'functional',
      question: "What happens when fraud is detected?",
      answer: "We generate **multi-channel alerts**:\n\n1. **Decline transaction** - Block in real-time if high confidence\n2. **Alert fraud analyst** - Send to dashboard for manual review\n3. **Notify customer** - SMS/email if transaction was legitimate but flagged\n4. **Create case** - Log to case management system for investigation\n\nAlerts are **prioritized** by risk score - high risk goes to analysts immediately.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Alert routing needs to be smart - flood analysts with false positives and they ignore real fraud",
    },
    {
      id: 'model-updates',
      category: 'clarification',
      question: "How often are ML models updated? Can we deploy new models without downtime?",
      answer: "Models are **retrained weekly** and deployed via **blue-green deployment**:\n\n- Old model stays live while new model loads\n- New model is warmed up and tested\n- Traffic gradually shifts to new model\n- Zero downtime deployment\n\nThis is critical - fraud patterns evolve constantly.",
      importance: 'important',
      insight: "ML model serving requires careful deployment strategies to avoid downtime",
    },
    {
      id: 'false-positives',
      category: 'clarification',
      question: "What's the acceptable false positive rate?",
      answer: "False positives are **expensive** - they decline legitimate transactions and frustrate customers.\n\nTarget: <1% false positive rate (99% of legitimate transactions approved)\n\nThis means if we see 10,000 legitimate transactions, we can only decline <100 of them by mistake.",
      importance: 'important',
      insight: "Fraud detection is about balance - catch fraud but don't annoy legitimate customers",
    },

    // SCALE & NFRs
    {
      id: 'throughput-transactions',
      category: 'throughput',
      question: "How many transactions per second do we need to process?",
      answer: "10 million transactions per day at steady state, with spikes to 50 million during shopping events (Black Friday, etc.)",
      importance: 'critical',
      calculation: {
        formula: "10M ÷ 86,400 sec = 116 TPS average",
        result: "~116 TPS average, ~580 TPS peak (5x spike)",
      },
      learningPoint: "Transaction volume spikes during shopping events - design for 5x peak capacity",
    },
    {
      id: 'latency-scoring',
      category: 'latency',
      question: "How fast must fraud scoring be?",
      answer: "p99 latency <100ms for scoring. Customers are waiting at checkout - every millisecond matters.\n\nBreakdown:\n- Rule engine: <5ms\n- ML inference: <10ms\n- Feature extraction: <20ms\n- Alert generation: <10ms\n- Total budget: 100ms",
      importance: 'critical',
      learningPoint: "Real-time fraud detection requires extreme low latency - pre-compute everything possible",
    },
    {
      id: 'latency-alerts',
      category: 'latency',
      question: "How fast must alerts reach fraud analysts?",
      answer: "High-priority alerts must reach analysts within **3 seconds**. Fraud happens fast - delayed alerts mean stolen money.\n\nLow-priority alerts can be batched (every 30 seconds).",
      importance: 'important',
      learningPoint: "Alert latency requirements depend on severity - use priority queues",
    },
    {
      id: 'availability',
      category: 'availability',
      question: "What happens if the fraud detection system goes down?",
      answer: "**Critical**: If fraud detection is down, we have two bad options:\n\n1. **Decline all transactions** - Lose revenue, angry customers\n2. **Approve all transactions** - Risk massive fraud losses\n\nTarget: 99.99% uptime (4 minutes downtime per month)\n\nNeed: Active-active deployment, circuit breakers, fallback rules",
      importance: 'critical',
      learningPoint: "Fraud detection is mission-critical - downtime costs millions",
    },
    {
      id: 'consistency',
      category: 'consistency',
      question: "What consistency guarantees do we need?",
      answer: "For fraud detection, we can tolerate **eventual consistency**:\n\n- OK if velocity counters are slightly stale (5-10 seconds behind)\n- OK if ML model is yesterday's version for 5 minutes during rollout\n- NOT OK to miss transactions entirely or process duplicates\n\n**At-least-once processing** is acceptable if we deduplicate.",
      importance: 'important',
      learningPoint: "Fraud detection can trade consistency for availability - being slightly stale is better than being down",
    },
    {
      id: 'security',
      category: 'security',
      question: "What security measures are needed?",
      answer: "**Critical security requirements:**\n\n1. **Encrypt transaction data** - PCI compliance\n2. **Access control** - Only fraud team can see alerts\n3. **Audit trail** - Log all decisions for compliance\n4. **Rate limiting** - Prevent abuse of scoring API\n5. **Model security** - Protect ML models from extraction attacks",
      importance: 'critical',
      learningPoint: "Fraud systems are high-value targets - security is paramount",
    },
  ],

  minimumQuestionsRequired: 4,
  criticalQuestionIds: ['core-fraud-detection', 'rule-engine', 'ml-inference', 'alert-generation'],
  criticalFRQuestionIds: ['core-fraud-detection', 'rule-engine', 'ml-inference'],
  criticalScaleQuestionIds: ['throughput-transactions', 'latency-scoring', 'availability'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Real-time transaction scoring',
      description: 'Score each transaction for fraud in real-time using multiple signals',
      emoji: '🎯',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Rule engine evaluation',
      description: 'Apply configurable fraud rules to detect known patterns',
      emoji: '📋',
    },
    {
      id: 'fr-3',
      text: 'FR-3: ML model inference',
      description: 'Run ML models to predict fraud probability',
      emoji: '🤖',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Alert generation',
      description: 'Generate and route alerts to fraud analysts',
      emoji: '🚨',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Decision approval/decline',
      description: 'Return approve or decline decision in real-time',
      emoji: '✅',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '5 million customers',
    writesPerDay: '10 million transactions',
    readsPerDay: '10 million fraud checks',
    peakMultiplier: 5,
    readWriteRatio: '1:1',
    calculatedWriteRPS: { average: 116, peak: 580 },
    calculatedReadRPS: { average: 116, peak: 580 },
    maxPayloadSize: '~2KB (transaction data)',
    storagePerRecord: '~5KB (transaction + features + score)',
    storageGrowthPerYear: '~18TB',
    redirectLatencySLA: 'p99 < 100ms (fraud scoring)',
    createLatencySLA: 'p99 < 3s (alert delivery)',
  },

  architecturalImplications: [
    '✅ Low latency required → In-memory ML models, pre-computed features',
    '✅ High throughput → Stream processing (Kafka, Flink)',
    '✅ Real-time alerts → Message queue with priority routing',
    '✅ ML inference → Model serving layer with blue-green deployment',
    '✅ Rule evaluation → In-memory rule engine with hot reload',
    '✅ Analytics → Real-time dashboards for fraud analysts',
  ],

  outOfScope: [
    'Identity verification (KYC)',
    'Chargeback management',
    'Manual case investigation tools',
    'Model training pipeline (only serving)',
    'Historical fraud reporting',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system that scores transactions and generates alerts. The real-time streaming, ML optimization, and scaling challenges will come in later steps. Functionality first, then performance!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🛡️',
  scenario: "Welcome to FinanceGuard! You've been hired to build a fraud detection system.",
  hook: "Fraudsters are stealing millions by making unauthorized transactions. We need to stop them!",
  challenge: "Set up the basic request flow so transactions can be scored for fraud.",
  illustration: 'security-alert',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your fraud detection system is online!',
  achievement: 'Transactions can now be sent to your fraud scoring service',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting transactions', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to score fraud yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Real-Time Fraud Scoring',
  conceptExplanation: `Every fraud detection system starts with a **Client** sending transactions to a **Fraud Scoring Service**.

When a transaction occurs:
1. The payment system (Client) sends transaction details to your fraud service
2. The fraud service (Server) analyzes the transaction
3. It returns a decision: approve, decline, or review

This is the foundation of real-time fraud detection!`,

  whyItMatters: 'Without this connection, transactions cannot be scored for fraud, leaving the system vulnerable to fraudulent activity.',

  realWorldExample: {
    company: 'Stripe Radar',
    scenario: 'Processing millions of fraud checks daily',
    howTheyDoIt: 'Stripe Radar scores every transaction in real-time using ML models and rules, returning decisions in <100ms',
  },

  keyPoints: [
    'Client = payment system sending transactions for fraud scoring',
    'App Server = fraud detection service that scores transactions',
    'HTTPS = secure protocol for sensitive transaction data',
    'Real-time = scoring must happen synchronously before payment',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Payment system requesting fraud checks', icon: '💳' },
    { title: 'Fraud Service', explanation: 'Real-time scoring engine', icon: '🛡️' },
    { title: 'Synchronous', explanation: 'Payment waits for fraud decision', icon: '⏱️' },
  ],
};

const step1: GuidedStep = {
  id: 'fraud-detection-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents payment systems sending transactions', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles fraud scoring logic', displayName: 'Fraud Service' },
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
// STEP 2: Implement Fraud Scoring APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your fraud service is connected, but it doesn't know how to score transactions!",
  hook: "A suspicious transaction worth $10,000 was sent to your service... and it was automatically approved! We need fraud detection logic NOW.",
  challenge: "Write the Python code to implement fraud scoring with rules and ML inference.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Fraud detection is working!',
  achievement: 'You implemented real-time transaction scoring',
  metrics: [
    { label: 'APIs implemented', after: '2' },
    { label: 'Can score transactions', after: '✓' },
    { label: 'Can generate alerts', after: '✓' },
  ],
  nextTeaser: "But if the server crashes, all fraud data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Fraud Scoring Implementation: Rules + ML',
  conceptExplanation: `Fraud scoring combines **rules** (known patterns) with **ML** (unknown patterns).

**Step 1: Rule Engine**
Check for known fraud patterns:
- Velocity: Too many transactions in short time
- Amount: Transaction exceeds limits
- Geography: Location mismatch

**Step 2: ML Inference**
1. Extract features from transaction (amount, merchant, time, etc.)
2. Load pre-trained model from memory
3. Run inference to get fraud probability (0.0 to 1.0)
4. Threshold: >0.8 = high risk

**Step 3: Decision**
Combine rule violations and ML score:
- Any critical rule violation OR ML score >0.9 → DECLINE
- ML score 0.7-0.9 → ALERT for review
- ML score <0.7 → APPROVE

For now, we'll use in-memory storage for simplicity.`,

  whyItMatters: 'Combining rules and ML gives best results: rules catch known attacks fast, ML catches new attack patterns.',

  famousIncident: {
    title: 'Target Data Breach',
    company: 'Target',
    year: '2013',
    whatHappened: 'Hackers stole 40 million credit card numbers from Target. Their fraud detection system generated alerts but they were ignored. The breach cost Target $200 million in losses and legal fees.',
    lessonLearned: 'Fraud detection must be accurate (low false positives) so analysts trust and act on alerts.',
    icon: '🎯',
  },

  realWorldExample: {
    company: 'PayPal',
    scenario: 'Processing 580 fraud checks per second',
    howTheyDoIt: 'PayPal uses a hybrid approach: 200+ fraud rules in a rule engine plus gradient boosted ML models, scoring every transaction in <50ms',
  },

  keyPoints: [
    'Rules catch known fraud patterns instantly (<5ms)',
    'ML models catch unknown patterns (new fraud types)',
    'Pre-load ML models in memory for low latency',
    'Combine both signals for best accuracy',
  ],

  quickCheck: {
    question: 'Why use both rules AND ML for fraud detection?',
    options: [
      'Rules are faster, ML is more accurate',
      'Rules catch known patterns fast, ML catches new unknown patterns',
      'Rules are cheaper to run',
      'ML is only for compliance',
    ],
    correctIndex: 1,
    explanation: 'Rules excel at catching known fraud patterns instantly, while ML can identify new, previously unseen fraud patterns.',
  },

  keyConcepts: [
    { title: 'Rule Engine', explanation: 'Fast evaluation of known fraud patterns', icon: '📋' },
    { title: 'ML Inference', explanation: 'Predict fraud probability using trained model', icon: '🤖' },
    { title: 'Feature Extraction', explanation: 'Convert transaction to ML features', icon: '🔧' },
  ],
};

const step2: GuidedStep = {
  id: 'fraud-detection-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Score transactions, FR-2: Apply rules, FR-3: ML inference',
    taskDescription: 'Configure APIs and implement Python handlers for fraud scoring',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/score and POST /api/v1/alerts APIs',
      'Open the Python tab',
      'Implement score_transaction() and generate_alert() functions',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign fraud scoring endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for score_transaction and generate_alert',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/score', 'POST /api/v1/alerts'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Fraud Records
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your fraud service crashed at 3 AM during a fraud attack...",
  hook: "When it came back, ALL fraud scores and alerts were GONE! Fraud analysts can't investigate - no audit trail. Compliance is furious.",
  challenge: "Add a database so fraud data survives server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your fraud data is safe!',
  achievement: 'Fraud scores and alerts now persist with audit trail',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Audit compliance', after: '100%' },
    { label: 'Transaction history', after: '✓' },
  ],
  nextTeaser: "But scoring is getting slow - lookups are taking too long...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Are Critical for Fraud Detection',
  conceptExplanation: `For fraud detection, losing data is **catastrophic for compliance and investigation**.

A **database** provides:
- **Durability**: Fraud scores survive crashes
- **Audit trail**: Immutable records for compliance and investigations
- **Queries**: Efficient lookups for user transaction history
- **Analytics**: Historical data for model retraining

For fraud detection, we need tables for:
- \`transactions\` - All scored transactions
- \`fraud_scores\` - Rule results and ML predictions
- \`alerts\` - Generated alerts with status
- \`user_profiles\` - User behavior patterns
- \`rule_violations\` - Which rules triggered`,

  whyItMatters: 'Losing fraud data means:\n1. No audit trail for compliance\n2. Can\'t investigate fraud cases\n3. Can\'t retrain ML models\n4. Regulatory fines',

  famousIncident: {
    title: 'Equifax Data Breach',
    company: 'Equifax',
    year: '2017',
    whatHappened: 'Hackers accessed 147 million records because Equifax failed to patch a vulnerability. Their fraud detection systems didn\'t catch the abnormal data access patterns. The breach cost Equifax $700 million in settlements.',
    lessonLearned: 'Fraud detection systems need comprehensive logging and audit trails to detect and investigate breaches.',
    icon: '🔓',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Storing billions of fraud scores',
    howTheyDoIt: 'Uses PostgreSQL for fraud data with immutable audit logs, enabling investigations and compliance',
  },

  keyPoints: [
    'Store ALL fraud decisions - needed for compliance',
    'Immutable audit logs - never delete, only append',
    'Index on user_id and timestamp for fast lookups',
    'Use database for analytics and model retraining',
  ],

  quickCheck: {
    question: 'What happens to in-memory fraud data when a server restarts?',
    options: [
      'It\'s automatically backed up',
      'It\'s recovered from cache',
      'It\'s completely lost - no audit trail',
      'It\'s saved to logs',
    ],
    correctIndex: 2,
    explanation: 'In-memory data is volatile. For fraud systems, this is unacceptable - you MUST have an audit trail.',
  },

  keyConcepts: [
    { title: 'Audit Trail', explanation: 'Immutable record of all decisions', icon: '📜' },
    { title: 'Durability', explanation: 'Data survives crashes', icon: '🛡️' },
    { title: 'Compliance', explanation: 'Required for regulatory audits', icon: '⚖️' },
  ],
};

const step3: GuidedStep = {
  id: 'fraud-detection-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent, auditable storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store fraud scores, alerts, audit trail', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for User Profiles & Velocity Counters
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "Fraud scoring is getting slow! Every transaction queries the database for user history.",
  hook: "Scoring latency jumped to 200ms+ because we're hitting the database on every request. Customers are experiencing checkout delays!",
  challenge: "Add a cache to speed up user profile lookups and velocity checks.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Fraud scoring is 20x faster!',
  achievement: 'Caching user profiles and velocity counters',
  metrics: [
    { label: 'Scoring latency', before: '200ms', after: '15ms' },
    { label: 'Cache hit rate', after: '90%' },
    { label: 'Velocity checks', after: 'Real-time' },
  ],
  nextTeaser: "But we need to handle streaming data for real-time fraud detection...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Speed for Real-Time Fraud Detection',
  conceptExplanation: `A **cache** is critical for low-latency fraud scoring.

**What to cache:**
1. **User profiles** - Transaction history, behavior patterns
2. **Velocity counters** - # of transactions in last N minutes
3. **ML features** - Pre-computed features from recent transactions
4. **Fraud scores** - Recent scores for same user/merchant

**Velocity checks example:**
\`\`\`
Key: "user:12345:velocity:10m"
Value: 3 transactions in last 10 minutes
TTL: 600 seconds

On new transaction:
  count = cache.incr("user:12345:velocity:10m")
  if count > 5:
    trigger_velocity_rule_violation()
\`\`\`

Cache enables real-time velocity checks without database queries!`,

  whyItMatters: 'Without caching:\n1. Every scoring hits database (slow)\n2. Velocity checks are impossible at scale\n3. Can\'t meet <100ms latency SLA\n4. Database gets overwhelmed',

  famousIncident: {
    title: 'Capital One Data Breach',
    company: 'Capital One',
    year: '2019',
    whatHappened: 'A misconfigured firewall allowed an attacker to access 100 million customer records. The fraud detection system was too slow to catch the abnormal data access patterns in real-time.',
    lessonLearned: 'Fast fraud detection requires caching - slow systems can\'t catch attacks in progress.',
    icon: '🏦',
  },

  realWorldExample: {
    company: 'PayPal',
    scenario: 'Handling 580 fraud checks/second',
    howTheyDoIt: 'Uses Redis clusters for user profiles, velocity counters, and ML features - enabling <50ms fraud scoring',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ Fraud Svc   │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (90% of requests)
                     │   Score in 15ms!
                     │
                     │   Velocity check:
                     │   redis.incr("user:xyz:10m")
                     │   → Block if >5
`,

  keyPoints: [
    'Cache user profiles to avoid database lookups',
    'Store velocity counters in cache for real-time checks',
    'Pre-compute ML features and cache them',
    'Set short TTL (60-300s) for freshness',
  ],

  quickCheck: {
    question: 'Why are velocity counters stored in cache instead of database?',
    options: [
      'Cache is cheaper',
      'Cache provides atomic increment for real-time counting',
      'Database can\'t store counters',
      'Cache is more secure',
    ],
    correctIndex: 1,
    explanation: 'Cache (Redis) provides atomic increment operations, enabling real-time velocity checks with no race conditions.',
  },

  keyConcepts: [
    { title: 'Velocity Check', explanation: 'Count transactions in time window', icon: '⏱️' },
    { title: 'Cache Hit', explanation: 'Data found in cache - fast response', icon: '✅' },
    { title: 'TTL', explanation: 'Time-to-live for cache entries', icon: '⏰' },
  ],
};

const step4: GuidedStep = {
  id: 'fraud-detection-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from faster user lookups',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache user profiles, velocity counters, ML features', displayName: 'Redis Cache' },
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
// STEP 5: Add Message Queue for Stream Processing
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🌊',
  scenario: "Transaction volume is surging! Fraud scoring is falling behind.",
  hook: "During Black Friday, transactions are coming in faster than we can score them. The queue is backing up and scores are delayed by 30+ seconds!",
  challenge: "Add stream processing to handle high-velocity transaction streams.",
  illustration: 'data-stream',
};

const step5Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Stream processing is live!',
  achievement: 'Can now handle 580 TPS with parallel processing',
  metrics: [
    { label: 'Throughput', before: '100 TPS', after: '580 TPS' },
    { label: 'Scoring latency', before: '30s', after: '<100ms' },
    { label: 'Backlog', before: 'Growing', after: 'Zero' },
  ],
  nextTeaser: "But alerts are getting lost during high volume...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Stream Processing: Handle Transaction Streams',
  conceptExplanation: `Transaction fraud detection is a **streaming workload** - data arrives continuously at high velocity.

**Challenge: Request-Response Pattern Breaks at Scale**
- Client sends transaction → Wait for score → Timeout at high volume
- Synchronous processing becomes bottleneck

**Solution: Stream Processing Architecture**
1. **Ingest**: Publish transactions to Kafka topic
2. **Process**: Stream processors (Flink/Spark) consume in parallel
3. **Score**: Each processor scores transactions independently
4. **Output**: Write scores to database, publish alerts

**Benefits:**
- **Scalability**: Add more stream processors for more throughput
- **Fault tolerance**: Failed processors don't lose data
- **Decoupling**: Ingest and process at different rates
- **Parallel**: Process 100s of transactions concurrently`,

  whyItMatters: 'Synchronous APIs can\'t handle 580 TPS peaks. Stream processing enables horizontal scaling and fault tolerance.',

  famousIncident: {
    title: 'Uber Fraud Detection at Scale',
    company: 'Uber',
    year: '2018',
    whatHappened: 'Uber migrated from synchronous fraud checks to Kafka-based stream processing. This reduced fraud scoring latency from 5 seconds to <100ms while handling 10x more transactions.',
    lessonLearned: 'Stream processing is essential for real-time fraud detection at scale.',
    icon: '🚗',
  },

  realWorldExample: {
    company: 'PayPal',
    scenario: 'Processing millions of transactions per day',
    howTheyDoIt: 'Uses Kafka for ingestion + Flink for stream processing, enabling parallel fraud scoring at massive scale',
  },

  diagram: `
Transactions
     │
     ▼
┌─────────┐
│  Kafka  │  (Buffer high-velocity streams)
│  Topic  │
└────┬────┘
     │
     ├───▶ [Processor 1] ──▶ Score ──▶ Database
     ├───▶ [Processor 2] ──▶ Score ──▶ Database
     ├───▶ [Processor 3] ──▶ Score ──▶ Database
     └───▶ [Processor N] ──▶ Score ──▶ Database

Parallel processing = High throughput!
`,

  keyPoints: [
    'Kafka buffers high-velocity transaction streams',
    'Multiple stream processors score in parallel',
    'Each processor is stateless - easy to scale',
    'Fault tolerance: failed processors don\'t lose data',
  ],

  quickCheck: {
    question: 'Why use stream processing instead of synchronous API calls?',
    options: [
      'It\'s cheaper',
      'It\'s easier to implement',
      'It enables parallel processing and handles bursts',
      'It\'s more secure',
    ],
    correctIndex: 2,
    explanation: 'Stream processing decouples ingestion from processing, enabling parallel scoring and buffering during traffic bursts.',
  },

  keyConcepts: [
    { title: 'Stream Processing', explanation: 'Process continuous data streams', icon: '🌊' },
    { title: 'Kafka', explanation: 'Distributed message queue for streams', icon: '📨' },
    { title: 'Parallel Processing', explanation: 'Multiple workers process concurrently', icon: '⚡' },
  ],
};

const step5: GuidedStep = {
  id: 'fraud-detection-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from stream processing',
    taskDescription: 'Add a Message Queue for stream processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Buffer and stream transaction data for parallel processing', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue for stream processing',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 6: Add Separate Alert Service
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🚨',
  scenario: "Alert chaos! During high fraud activity, alerts are delayed or lost.",
  hook: "Fraud analysts are seeing alerts 5 minutes late. By then, fraudsters have stolen thousands of dollars. We need reliable, prioritized alerting!",
  challenge: "Add a dedicated alert service to handle alert generation and routing.",
  illustration: 'notification-system',
};

const step6Celebration: CelebrationContent = {
  emoji: '📢',
  message: 'Alerts are now bulletproof!',
  achievement: 'Priority-based alert routing with guaranteed delivery',
  metrics: [
    { label: 'Alert delivery time', before: '5 min', after: '<3 sec' },
    { label: 'Alert reliability', before: '85%', after: '99.9%' },
    { label: 'Priority routing', after: 'Enabled' },
  ],
  nextTeaser: "But we need analytics to understand fraud patterns...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Alert Service: Reliable, Prioritized Notifications',
  conceptExplanation: `**Why a separate alert service?**

Mixing fraud scoring and alerting in one service causes problems:
- Scoring is latency-sensitive (<100ms)
- Alert delivery can be slower (3 seconds OK)
- High scoring volume shouldn't slow alerts
- Failed alerts shouldn't block scoring

**Alert Service Architecture:**
1. Fraud service publishes alert events to queue
2. Alert service consumes and routes alerts
3. Priority queue: High-risk alerts first
4. Multi-channel delivery: Dashboard, SMS, email, PagerDuty

**Alert Prioritization:**
- **P0 (Critical)**: Score >0.95, amount >$10K → Instant notification
- **P1 (High)**: Score 0.8-0.95 → 30 second batch
- **P2 (Medium)**: Score 0.6-0.8 → 5 minute batch
- **P3 (Low)**: Score <0.6 → Daily report

This prevents alert fatigue and ensures critical alerts get immediate attention.`,

  whyItMatters: 'Flood analysts with false positives → they ignore real fraud. Smart prioritization saves money.',

  famousIncident: {
    title: 'Sony PlayStation Network Breach',
    company: 'Sony',
    year: '2011',
    whatHappened: 'Hackers stole 77 million accounts. Security alerts were generated but buried in noise. The alert system had poor prioritization - analysts couldn\'t find critical alerts among thousands of low-priority ones.',
    lessonLearned: 'Alert prioritization is critical - high-severity alerts must stand out.',
    icon: '🎮',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Generating thousands of fraud alerts daily',
    howTheyDoIt: 'Dedicated alert service with ML-based prioritization, routing high-risk alerts to analysts within seconds',
  },

  diagram: `
┌──────────────┐
│ Fraud Service│
└──────┬───────┘
       │ Publish alert event
       ▼
┌──────────────────┐
│  Message Queue   │
│  (Priorities)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Alert Service   │  (Dedicated service)
└────────┬─────────┘
         │
         ├───▶ P0: Instant → PagerDuty
         ├───▶ P1: 30s batch → Dashboard
         ├───▶ P2: 5m batch → Email
         └───▶ P3: Daily → Report
`,

  keyPoints: [
    'Separate alert service from fraud scoring',
    'Use priority queues for alert routing',
    'High-risk alerts get immediate delivery',
    'Batching reduces analyst alert fatigue',
  ],

  quickCheck: {
    question: 'Why separate alert service from fraud scoring service?',
    options: [
      'It\'s cheaper',
      'Decouples latency-sensitive scoring from alert delivery',
      'It uses less memory',
      'It\'s required for compliance',
    ],
    correctIndex: 1,
    explanation: 'Separating concerns allows fraud scoring to remain fast while alert delivery can be optimized independently.',
  },

  keyConcepts: [
    { title: 'Alert Priority', explanation: 'High-risk alerts delivered first', icon: '🔴' },
    { title: 'Batching', explanation: 'Group low-priority alerts to reduce noise', icon: '📦' },
    { title: 'Multi-Channel', explanation: 'Deliver via dashboard, SMS, email, etc.', icon: '📱' },
  ],
};

const step6: GuidedStep = {
  id: 'fraud-detection-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-4: Generate and route alerts reliably',
    taskDescription: 'Add a second App Server as Alert Service',
    componentsNeeded: [
      { type: 'app_server', reason: 'Dedicated service for alert generation and routing', displayName: 'Alert Service' },
    ],
    successCriteria: [
      'Second App Server component added',
      'Message Queue connected to Alert Service',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Add a second App Server component for the Alert Service',
    level2: 'Connect Message Queue to Alert Service to consume alert events',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [{ from: 'message_queue', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 7: Add Analytics Database for Real-Time Dashboards
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📊',
  scenario: "Fraud analysts need visibility! They can't see fraud trends in real-time.",
  hook: "A new fraud attack pattern is hitting us but analysts don't see it because they're reviewing individual alerts. We need a dashboard showing fraud trends!",
  challenge: "Add an analytics database for real-time fraud dashboards.",
  illustration: 'dashboard',
};

const step7Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Real-time fraud analytics are live!',
  achievement: 'Analysts can now see fraud trends and patterns',
  metrics: [
    { label: 'Dashboard latency', after: '<5 sec' },
    { label: 'Fraud trend visibility', after: 'Real-time' },
    { label: 'Pattern detection', after: 'Enabled' },
  ],
  nextTeaser: "Congratulations! You built a production-grade fraud detection system!",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Analytics: Real-Time Fraud Dashboards',
  conceptExplanation: `**Why analytics?**

Individual alerts show trees, dashboards show the forest:
- **Trend detection**: Fraud rate spiking?
- **Pattern analysis**: Attack targeting specific merchants?
- **Performance**: False positive rate increasing?
- **Attribution**: Which rules/models catching fraud?

**Analytics Architecture:**
1. Stream fraud scores from Kafka to analytics DB
2. Use columnar database (ClickHouse) for fast aggregations
3. Pre-aggregate common queries (fraud rate by hour)
4. Real-time dashboards query analytics DB

**Key Metrics:**
- Fraud rate (fraud transactions / total transactions)
- False positive rate
- Alert volume by priority
- Top fraud patterns
- Model performance (precision, recall)

This enables fraud analysts to see attack campaigns early and adjust rules/models.`,

  whyItMatters: 'Without analytics, fraud teams are reactive (respond to alerts). With analytics, they\'re proactive (detect patterns).',

  famousIncident: {
    title: 'Facebook Ad Fraud Detection',
    company: 'Facebook',
    year: '2017',
    whatHappened: 'Facebook discovered a massive click fraud campaign via analytics dashboards that showed abnormal click patterns. Individual fraud detection missed it, but aggregate analytics revealed the attack affecting millions in ad spend.',
    lessonLearned: 'Analytics reveal attack patterns invisible at individual transaction level.',
    icon: '📘',
  },

  realWorldExample: {
    company: 'PayPal',
    scenario: 'Analyzing millions of fraud scores daily',
    howTheyDoIt: 'Uses ClickHouse for real-time analytics, enabling fraud analysts to spot attack patterns within minutes',
  },

  diagram: `
┌─────────┐
│  Kafka  │
└────┬────┘
     │
     ├───▶ Fraud Service (scoring)
     │
     └───▶ Analytics DB (ClickHouse)
              │
              ▼
         ┌──────────────┐
         │  Dashboard   │
         │  - Fraud rate│
         │  - Patterns  │
         │  - Performance│
         └──────────────┘
`,

  keyPoints: [
    'Columnar DB (ClickHouse) for fast aggregations',
    'Stream fraud scores to analytics in real-time',
    'Pre-aggregate common queries for dashboard speed',
    'Enable pattern detection across transactions',
  ],

  quickCheck: {
    question: 'Why use a separate analytics database instead of querying the main database?',
    options: [
      'It\'s cheaper',
      'Columnar DBs optimize for aggregations, don\'t slow main DB',
      'It\'s more secure',
      'It\'s required for compliance',
    ],
    correctIndex: 1,
    explanation: 'Analytics databases (ClickHouse) are optimized for aggregations, and separating them prevents heavy analytical queries from slowing transaction processing.',
  },

  keyConcepts: [
    { title: 'Columnar DB', explanation: 'Optimized for analytical queries', icon: '📊' },
    { title: 'Pre-Aggregation', explanation: 'Compute common metrics ahead of time', icon: '⚡' },
    { title: 'Pattern Detection', explanation: 'Spot attack campaigns early', icon: '🔍' },
  ],
};

const step7: GuidedStep = {
  id: 'fraud-detection-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'Analytics enable proactive fraud detection',
    taskDescription: 'Add an Analytics Database for fraud dashboards',
    componentsNeeded: [
      { type: 'database', reason: 'Analytics database for real-time fraud dashboards', displayName: 'ClickHouse' },
    ],
    successCriteria: [
      'Second Database component added',
      'Message Queue connected to Analytics Database',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Add a second Database component for analytics',
    level2: 'Connect Message Queue to Analytics Database to stream fraud scores',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'message_queue', to: 'database' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const fraudDetectionStreamGuidedTutorial: GuidedTutorial = {
  problemId: 'fraud-detection-stream',
  title: 'Design Real-Time Fraud Detection System',
  description: 'Build a streaming fraud detection platform with ML inference, rule engines, and intelligent alerting',
  difficulty: 'advanced',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '🛡️',
    hook: "You've been hired as Lead Engineer at FinanceGuard!",
    scenario: "Your mission: Build a real-time fraud detection system that can score millions of transactions per day with <100ms latency.",
    challenge: "Can you design a system that combines rules and ML to catch fraudsters while keeping false positives under 1%?",
  },

  requirementsPhase: fraudDetectionRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7],

  // Meta information
  concepts: [
    'Real-Time Stream Processing',
    'ML Model Inference',
    'Rule Engine Architecture',
    'Alert Generation and Routing',
    'Velocity Checks',
    'Caching for Low Latency',
    'Kafka Stream Processing',
    'Analytics Databases',
    'Priority Queues',
    'Feature Extraction',
    'Fraud Patterns',
    'Compliance and Audit Trails',
  ],

  ddiaReferences: [
    'Chapter 11: Stream Processing',
    'Chapter 3: Storage and Retrieval (Columnar storage)',
    'Chapter 5: Replication',
    'Chapter 8: Distributed Systems',
  ],
};

export default fraudDetectionStreamGuidedTutorial;
