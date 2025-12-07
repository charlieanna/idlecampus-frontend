import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Content Moderation Queue Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial teaching system design through
 * building a content moderation queue system.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (ML models, priority queues, rate limiting)
 *
 * Key Concepts:
 * - ML-based auto-moderation
 * - Human review queues
 * - Priority handling
 * - Asynchronous processing
 * - Content safety at scale
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const contentModerationRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a Content Moderation Queue system like those used by Facebook, YouTube, or Reddit",

  interviewer: {
    name: 'Marcus Lee',
    role: 'Trust & Safety Engineering Lead',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-functionality',
      category: 'functional',
      question: "What are the main components of a content moderation system?",
      answer: "The system needs to:\n\n1. **Receive content** - Posts, images, videos, comments from the platform\n2. **Auto-moderate** - Use ML models to detect violations automatically\n3. **Queue for review** - Send uncertain cases to human moderators\n4. **Take action** - Approve, reject, or flag content based on decisions",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Content moderation combines automation (ML) with human judgment for edge cases",
    },
    {
      id: 'ml-moderation',
      category: 'functional',
      question: "How does automatic moderation work?",
      answer: "**ML-based auto-moderation**:\n\n1. Content is analyzed by ML models (image recognition, NLP)\n2. Each model outputs a **confidence score** (0-100%)\n3. High confidence violations → **Auto-reject** (e.g., 95%+ spam)\n4. High confidence safe → **Auto-approve** (e.g., 95%+ safe)\n5. Uncertain cases (20-80%) → **Queue for human review**",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "ML reduces human workload by 80-90%, but can't handle everything",
    },
    {
      id: 'priority-handling',
      category: 'functional',
      question: "Should all content be reviewed with the same urgency?",
      answer: "No! We need **priority levels**:\n\n1. **Critical** - Child safety, terrorism (review within 1 hour)\n2. **High** - Hate speech, graphic violence (review within 4 hours)\n3. **Medium** - Harassment, misinformation (review within 24 hours)\n4. **Low** - Spam, low-quality (review within 48 hours)\n\nModerators always see highest priority items first.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Priority queues ensure the most harmful content is addressed fastest",
    },
    {
      id: 'moderator-workflow',
      category: 'functional',
      question: "How do human moderators interact with the queue?",
      answer: "Moderators:\n1. **Pull next item** from queue (highest priority)\n2. **Review content** with context (user history, reports)\n3. **Make decision** - Approve, Reject, Escalate to senior\n4. **System takes action** - Remove content, warn user, ban account\n\nEach decision updates the ML models (active learning).",
      importance: 'important',
      revealsRequirement: 'FR-2',
      insight: "Moderator decisions create training data to improve ML models over time",
    },
    {
      id: 'appeals',
      category: 'clarification',
      question: "What if users disagree with moderation decisions?",
      answer: "Users can **appeal**:\n1. Appeals go to a separate queue\n2. Reviewed by senior moderators\n3. Original decision can be upheld or overturned\n\nFor MVP, let's focus on initial moderation. Appeals can be v2.",
      importance: 'nice-to-have',
      insight: "Appeals are important but add complexity - defer for initial version",
    },

    // SCALE & NFRs
    {
      id: 'throughput-content',
      category: 'throughput',
      question: "How much content needs to be moderated per day?",
      answer: "For a large platform: 100 million pieces of content per day (posts, comments, images, videos)",
      importance: 'critical',
      calculation: {
        formula: "100M ÷ 86,400 sec = 1,157 items/sec",
        result: "~1,200 items/sec (3,600 at peak)",
      },
      learningPoint: "Massive volume requires efficient ML screening to reduce human review",
    },
    {
      id: 'ml-filtering',
      category: 'throughput',
      question: "What percentage of content needs human review?",
      answer: "ML auto-moderates 90%:\n- 70% auto-approved (clearly safe)\n- 20% auto-rejected (clearly violating)\n- 10% uncertain → human review (120 items/sec)\n\nThis means 10M items/day need human moderators.",
      importance: 'critical',
      calculation: {
        formula: "10M items ÷ 86,400 sec = 116 reviews/sec",
        result: "~120 human reviews/sec",
      },
      learningPoint: "Even with 90% ML accuracy, 10M items/day still need human review at scale",
    },
    {
      id: 'moderator-capacity',
      category: 'throughput',
      question: "How many moderators do we need?",
      answer: "Each moderator reviews ~100 items/hour (depends on content type):\n- 10M items/day ÷ 100 items/hour = 100,000 moderator-hours/day\n- Assuming 8-hour shifts = ~12,500 moderators globally\n\nModerators work in shifts for 24/7 coverage across time zones.",
      importance: 'important',
      learningPoint: "Content moderation is labor-intensive even with ML assistance",
    },
    {
      id: 'latency-critical',
      category: 'latency',
      question: "How fast should critical content (e.g., child safety) be reviewed?",
      answer: "**Critical content**: p99 < 1 hour from submission to review\n**High priority**: p99 < 4 hours\n**Medium/Low**: Best effort within 24-48 hours\n\nML processing should happen within seconds to determine priority.",
      importance: 'critical',
      learningPoint: "Time-sensitive content requires real-time ML and prioritized queues",
    },
    {
      id: 'ml-latency',
      category: 'latency',
      question: "How fast should ML models process content?",
      answer: "ML inference should complete in < 2 seconds:\n- Text analysis (NLP): ~100ms\n- Image analysis (CV): ~500ms\n- Video analysis: ~1-2s (process keyframes)\n\nFaster processing = faster routing to human review for critical cases.",
      importance: 'important',
      insight: "Real-time ML inference requires optimized models and GPU acceleration",
    },
    {
      id: 'accuracy-requirements',
      category: 'quality',
      question: "How accurate do the ML models need to be?",
      answer: "For auto-rejection:\n- **Precision > 99%** (avoid false positives)\n- Only auto-reject when extremely confident\n\nFor auto-approval:\n- **Recall > 95%** (catch most violations)\n- When in doubt, send to human review\n\nFalse negatives (missed violations) hurt users. False positives (wrongly removed) hurt creators.",
      importance: 'critical',
      learningPoint: "Different thresholds for auto-approve vs auto-reject balance safety and fairness",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-functionality', 'ml-moderation', 'priority-handling'],
  criticalFRQuestionIds: ['core-functionality', 'ml-moderation'],
  criticalScaleQuestionIds: ['throughput-content', 'ml-filtering', 'latency-critical'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Auto-moderate content using ML models',
      description: 'Automatically detect and handle clear violations or safe content',
      emoji: '🤖',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Queue uncertain content for human review',
      description: 'Send edge cases to human moderators with proper context',
      emoji: '👀',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Prioritize content by severity',
      description: 'Critical content (child safety) reviewed before low-priority spam',
      emoji: '⚠️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Take action on moderation decisions',
      description: 'Approve, reject, or flag content based on decisions',
      emoji: '✅',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million content submitters',
    writesPerDay: '100M content items',
    readsPerDay: '10M human reviews',
    peakMultiplier: 3,
    readWriteRatio: '1:10 (more submissions than reviews)',
    calculatedWriteRPS: { average: 1157, peak: 3471 },
    calculatedReadRPS: { average: 116, peak: 348 },
    maxPayloadSize: '~10MB (image/video)',
    storagePerRecord: '~1KB (metadata + decision)',
    storageGrowthPerYear: '~36TB',
    redirectLatencySLA: 'p99 < 2s (ML inference)',
    createLatencySLA: 'p99 < 1hr (critical review)',
  },

  architecturalImplications: [
    '✅ 1,200 items/sec → Need async processing with message queues',
    '✅ ML inference < 2s → GPU servers for model inference',
    '✅ Priority handling → Priority queue implementation (heap/Redis)',
    '✅ 12,500 moderators → Distributed queue with fair assignment',
    '✅ Critical content < 1hr → Real-time alerting and SLA monitoring',
  ],

  outOfScope: [
    'Appeals process',
    'Multi-language support',
    'Video transcription',
    'User reporting system',
    'Moderator training/onboarding',
    'Content taxonomy management',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where content flows through ML → queue → human review → action. The complexity of priority handling, ML optimization, and scale comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🛡️',
  scenario: "Welcome to SafeSpace Inc! You've been hired to protect users from harmful content.",
  hook: "Your platform just launched. Users are submitting posts, but there's no moderation yet!",
  challenge: "Set up the basic request flow so content can reach your moderation server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your moderation system is online!',
  achievement: 'Content submissions can now reach your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting submissions', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to moderate content yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Content Ingestion',
  conceptExplanation: `Every moderation system starts with content flowing from the platform to moderation servers.

When a user submits content (post, comment, image):
1. The platform **Client** sends it to your **Moderation Server**
2. The server will analyze it and decide what to do
3. The decision is sent back to the platform

This is the pipeline that keeps platforms safe!`,

  whyItMatters: 'Without this connection, harmful content goes unchecked and users are put at risk.',

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Moderating billions of posts per day',
    howTheyDoIt: 'Started with simple keyword filters in 2004, now uses complex ML and 15,000+ human moderators',
  },

  keyPoints: [
    'Client = the platform submitting content for moderation',
    'Moderation Server = your backend that processes content',
    'Content flows in, moderation decisions flow out',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Platform submitting content for moderation', icon: '📱' },
    { title: 'Moderation Server', explanation: 'Analyzes content and makes decisions', icon: '🖥️' },
    { title: 'Content Flow', explanation: 'Submission → Analysis → Decision', icon: '🔄' },
  ],
};

const step1: GuidedStep = {
  id: 'moderation-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and Moderation Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents the platform submitting content', displayName: 'Client' },
      { type: 'app_server', reason: 'Moderation server that processes content', displayName: 'Moderation Server' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'Moderation Server component added to canvas',
      'Client connected to Moderation Server',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server from the component palette onto the canvas',
    level2: 'Click the Client, then click the Moderation Server to create a connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Core Logic (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it's just passing everything through unchecked!",
  hook: "A user just posted spam and it went straight to the feed. Users are complaining!",
  challenge: "Write the Python code to moderate content and queue items for review.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can moderate content!',
  achievement: 'You implemented the core moderation functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can submit content', after: '✓' },
    { label: 'Can review queue', after: '✓' },
    { label: 'Can make decisions', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all queued content is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Moderation Handlers: The Core Logic',
  conceptExplanation: `Every moderation API needs a **handler function**:

- \`submit_content()\` - Receive content for moderation
- \`get_review_queue()\` - Fetch items awaiting human review
- \`moderate_decision()\` - Process moderator's decision (approve/reject)

For now, we'll use simple keyword filtering and store everything in memory.`,

  whyItMatters: 'Without handlers, content flows through unmoderated. This is where safety happens!',

  famousIncident: {
    title: 'YouTube Adpocalypse',
    company: 'YouTube',
    year: '2017',
    whatHappened: 'Brand ads appeared next to extremist content due to inadequate moderation. Major advertisers pulled out, costing YouTube hundreds of millions.',
    lessonLearned: 'Basic keyword filtering isn\'t enough. You need robust moderation from day one.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Reddit',
    scenario: 'Processing millions of submissions daily',
    howTheyDoIt: 'Combines AutoModerator (keyword rules), ML models, and community moderators',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Start simple: keyword filtering in memory',
    'Queue items that need human review',
    'Make decisions: approve, reject, or escalate',
  ],

  quickCheck: {
    question: 'Why do we queue uncertain content instead of auto-rejecting it?',
    options: [
      'It\'s faster to queue than to reject',
      'False positives hurt creators - better to have humans review edge cases',
      'Queuing uses less storage',
      'Moderators need something to do',
    ],
    correctIndex: 1,
    explanation: 'Auto-rejecting safe content by mistake (false positive) harms users. Human review provides accuracy for edge cases.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'Keyword Filter', explanation: 'Simple rule-based moderation', icon: '🔍' },
    { title: 'Review Queue', explanation: 'Items awaiting human judgment', icon: '📋' },
  ],
};

const step2: GuidedStep = {
  id: 'moderation-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Auto-moderate, FR-2: Queue for review',
    taskDescription: 'Configure APIs and implement Python handlers for moderation',
    successCriteria: [
      'Click on Moderation Server to open inspector',
      'Assign POST /api/v1/submit, GET /api/v1/queue, and POST /api/v1/moderate APIs',
      'Open the Python tab',
      'Implement submit_content(), get_review_queue(), and moderate_decision() functions',
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
    level1: 'Click on the Moderation Server, then go to the APIs tab to assign endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for submit_content, get_review_queue, and moderate_decision',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/submit', 'GET /api/v1/queue', 'POST /api/v1/moderate'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! Your server crashed during peak hours...",
  hook: "When it restarted, the entire moderation queue was EMPTY. 50,000 items waiting for review - GONE.",
  challenge: "Add a database so the queue survives server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your moderation queue is now durable!',
  achievement: 'Queue items persist across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Queue durability', after: '100%' },
  ],
  nextTeaser: "But basic keyword filtering isn't catching sophisticated violations...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter for Moderation',
  conceptExplanation: `In-memory queues are fast but **volatile** - they disappear when servers restart.

A **database** provides:
- **Durability**: Queue items survive crashes
- **Structure**: Organized tables for content, decisions, moderators
- **Queries**: Find items by priority, type, or status

For moderation, we need tables for:
- \`content_submissions\` - Items submitted for review
- \`moderation_decisions\` - Approve/reject history
- \`moderators\` - Moderator accounts and assignments
- \`audit_log\` - Track all moderation actions`,

  whyItMatters: 'Losing the review queue means harmful content slips through. Durability is non-negotiable.',

  famousIncident: {
    title: 'Christchurch Attack Livestream',
    company: 'Facebook',
    year: '2019',
    whatHappened: 'A terrorist attack was livestreamed for 17 minutes before being removed. The video was viewed 4,000 times live and re-uploaded 1.5 million times in 24 hours.',
    lessonLearned: 'Moderation systems must be reliable and fast. Database persistence ensures no queued content is lost.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Storing decisions for billions of content items',
    howTheyDoIt: 'Uses distributed databases with audit trails. All moderation actions are logged permanently for appeals and model training.',
  },

  keyPoints: [
    'Database ensures queue survives crashes',
    'Store content metadata, decisions, and audit logs',
    'Use PostgreSQL for structured moderation data',
    'Every decision is logged for accountability',
  ],

  quickCheck: {
    question: 'Why is an audit log critical for content moderation?',
    options: [
      'It helps debug technical issues',
      'It provides accountability and supports appeals processes',
      'It reduces storage costs',
      'It makes moderation faster',
    ],
    correctIndex: 1,
    explanation: 'Audit logs track every decision made, who made it, and when. This supports appeals and ensures moderators are accountable.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Queue survives server restarts', icon: '🛡️' },
    { title: 'Audit Log', explanation: 'Track all moderation decisions', icon: '📝' },
    { title: 'Accountability', explanation: 'Every decision is traceable', icon: '👁️' },
  ],
};

const step3: GuidedStep = {
  id: 'moderation-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the Moderation Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store queue items, decisions, audit logs permanently', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'Moderation Server connected to Database',
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
    level2: 'Click Moderation Server, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add ML Model Service
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🤖',
  scenario: "Your keyword filters catch obvious spam like 'BUY NOW!!!', but nothing else.",
  hook: "Users are reporting hate speech, harassment, and graphic content - all missed by simple keyword matching.",
  challenge: "Add ML models to detect sophisticated violations automatically.",
  illustration: 'ml-models',
};

const step4Celebration: CelebrationContent = {
  emoji: '🧠',
  message: 'ML models are catching 90% of violations!',
  achievement: 'Advanced detection dramatically reduced human review load',
  metrics: [
    { label: 'Auto-moderation rate', before: '20%', after: '90%' },
    { label: 'Detection accuracy', after: '95%' },
    { label: 'Human review load', before: '100M/day', after: '10M/day' },
  ],
  nextTeaser: "But the ML service is slow - content piling up in the queue...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'ML Models: Automated Content Analysis',
  conceptExplanation: `**ML models** analyze content far better than keyword rules:

**Text Analysis (NLP)**:
- Hate speech detection
- Harassment/bullying detection
- Spam/scam detection
- Sentiment analysis

**Image Analysis (Computer Vision)**:
- Adult content detection
- Violence/gore detection
- Weapon detection
- Hate symbols recognition

Each model outputs a **confidence score** (0-100%):
- 95%+ violation → Auto-reject
- 95%+ safe → Auto-approve
- 20-80% uncertain → Queue for human review`,

  whyItMatters: 'At 1,200 items/sec, humans can\'t review everything. ML handles 90%, humans focus on the edge cases.',

  famousIncident: {
    title: 'Twitter Bot Purge',
    company: 'Twitter',
    year: '2018',
    whatHappened: 'Twitter deployed ML to detect fake accounts and bots. Millions of bot accounts were removed, causing user counts to drop visibly.',
    lessonLearned: 'ML can operate at scale humans can\'t. But it must be accurate - false positives harm real users.',
    icon: '🤖',
  },

  realWorldExample: {
    company: 'YouTube',
    scenario: 'Moderating 500 hours of video uploaded per minute',
    howTheyDoIt: 'Uses ML to analyze video frames, audio, and metadata. 94% of removed content is flagged by ML first.',
  },

  diagram: `
Content Submission
       │
       ▼
┌──────────────────┐
│   ML Service     │
│  (Text + Image)  │
└────────┬─────────┘
         │
    Confidence Score?
         │
    ┌────┴────┬─────────────┐
    │         │             │
95%+     20-80%         95%+
Violation  Uncertain      Safe
    │         │             │
    ▼         ▼             ▼
Auto-    Queue for     Auto-
Reject    Human        Approve
          Review
`,

  keyPoints: [
    'ML models analyze text and images for violations',
    'Confidence scores determine auto-action vs human review',
    'High precision (99%) for auto-reject to avoid false positives',
    'ML service is separate from app server for scaling',
  ],

  quickCheck: {
    question: 'Why use different confidence thresholds for auto-reject vs auto-approve?',
    options: [
      'It makes the system faster',
      'To balance safety (catch violations) with fairness (avoid wrongly removing good content)',
      'It reduces storage costs',
      'Moderators prefer it this way',
    ],
    correctIndex: 1,
    explanation: 'Auto-reject needs high precision (99%+) to avoid false positives. Auto-approve needs high recall to catch violations. Edge cases go to humans.',
  },

  keyConcepts: [
    { title: 'NLP Models', explanation: 'Analyze text for violations', icon: '📝' },
    { title: 'Computer Vision', explanation: 'Analyze images for violations', icon: '👁️' },
    { title: 'Confidence Score', explanation: 'How certain the model is (0-100%)', icon: '📊' },
  ],
};

const step4: GuidedStep = {
  id: 'moderation-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Auto-moderate using ML models',
    taskDescription: 'Add an ML Service for automated content analysis',
    componentsNeeded: [
      { type: 'ml_service', reason: 'Run ML models for text and image analysis', displayName: 'ML Service' },
    ],
    successCriteria: [
      'ML Service component added to canvas',
      'Moderation Server connected to ML Service',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'ml_service'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'ml_service' },
    ],
  },

  hints: {
    level1: 'Drag an ML Service component onto the canvas',
    level2: 'Connect Moderation Server to ML Service to enable ML-based moderation',
    solutionComponents: [{ type: 'ml_service' }],
    solutionConnections: [{ from: 'app_server', to: 'ml_service' }],
  },
};

// =============================================================================
// STEP 5: Add Message Queue for Async Processing
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🐌',
  scenario: "ML inference takes 2 seconds per item. At 1,200 items/sec, your server is drowning!",
  hook: "Content submissions are timing out. The queue is backed up by hours.",
  challenge: "Add a message queue to process content asynchronously.",
  illustration: 'queue-backlog',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Content processing is now lightning fast!',
  achievement: 'Async processing handles 1,200 items/sec smoothly',
  metrics: [
    { label: 'Submission latency', before: '5s', after: '<100ms' },
    { label: 'Queue backlog', before: '10,000 items', after: '0' },
    { label: 'Processing throughput', before: '10/s', after: '1,200/s' },
  ],
  nextTeaser: "But all content is treated equally - critical violations wait in line with spam!",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Decoupling Submission from Processing',
  conceptExplanation: `The **async processing problem**:
- Content submitted at 1,200/sec
- ML inference takes 2 seconds per item
- Synchronous processing can only handle 0.5 items/sec ❌

**Synchronous**: Submit → ML (2s) → Return ❌ (too slow, times out)
**Async with Queue**: Submit → Add to queue → Return instantly ✓

- Workers consume queue in background
- Process items in parallel (100 workers × 10 items/sec each = 1,000/sec)
- Scale workers up/down based on queue depth`,

  whyItMatters: 'Without async processing, users wait seconds for submissions. With it, they get instant confirmation.',

  famousIncident: {
    title: 'Instagram Feed Outage',
    company: 'Instagram',
    year: '2022',
    whatHappened: 'A bug in their async processing pipeline caused new posts to not appear in feeds for hours. The queue backed up massively.',
    lessonLearned: 'Message queues enable scale, but they must be monitored. Queue depth is a critical metric.',
    icon: '📊',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Processing billions of content items daily',
    howTheyDoIt: 'Uses Kafka and custom queues to decouple submission from processing. Thousands of workers consume in parallel.',
  },

  diagram: `
Content Submitted
      │
      ▼
┌─────────────┐     ┌──────────────────────────────────┐
│  App Server │────▶│      Message Queue               │
│  (instant)  │     │  [item1, item2, item3, ...]      │
└─────────────┘     └──────────────┬───────────────────┘
      │                            │
      │ Return                     │ Workers consume
      ▼ "Submitted!"               ▼
                          ┌──────────────────┐
                          │  ML Workers (×100)│
                          │  Process in       │
                          │  parallel         │
                          └─────────┬─────────┘
                                    │
                            Update DB & Queue
                                    │
                                    ▼
                          ┌──────────────────┐
                          │   Database       │
                          └──────────────────┘
`,

  keyPoints: [
    'Message queue decouples submission from ML processing',
    'Users get instant feedback - processing happens async',
    'Scale processing by adding more workers',
    'Monitor queue depth to detect backlog',
  ],

  quickCheck: {
    question: 'Why use async processing instead of making the ML service faster?',
    options: [
      'ML inference is inherently slow - can\'t make it instant',
      'Async allows scaling horizontally with more workers',
      'It provides better user experience (instant vs 2s wait)',
      'All of the above',
    ],
    correctIndex: 3,
    explanation: 'ML has minimum latency, async provides instant UX, and horizontal scaling handles throughput. All three matter!',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer between submission and processing', icon: '📨' },
    { title: 'Async Processing', explanation: 'Process in background, return instantly', icon: '⚡' },
    { title: 'Worker Pool', explanation: 'Multiple workers process in parallel', icon: '👷' },
  ],
};

const step5: GuidedStep = {
  id: 'moderation-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from async processing',
    taskDescription: 'Add a Message Queue for async content processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Decouple submission from ML processing', displayName: 'Kafka Queue' },
    ],
    successCriteria: [
      'Message Queue component added',
      'Moderation Server connected to Message Queue',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'ml_service', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'ml_service' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka or RabbitMQ) component onto the canvas',
    level2: 'Connect Moderation Server to Message Queue. This enables async processing of submissions.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 6: Add Cache for Priority Queue
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚠️',
  scenario: "Critical content (child safety) is waiting hours for review!",
  hook: "It's buried in the queue behind 100,000 low-priority spam items. Moderators see oldest first, not most urgent.",
  challenge: "Add a cache-based priority queue to surface critical content immediately.",
  illustration: 'priority-queue',
};

const step6Celebration: CelebrationContent = {
  emoji: '🚨',
  message: 'Critical content is now prioritized!',
  achievement: 'Priority queue ensures urgent items are reviewed first',
  metrics: [
    { label: 'Critical content review time', before: '12 hours', after: '<1 hour' },
    { label: 'Priority levels', after: '4 (Critical/High/Medium/Low)' },
    { label: 'Moderator efficiency', before: '60%', after: '95%' },
  ],
  nextTeaser: "But database queries for the queue are slow under load...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Priority Queues: Handling Content by Severity',
  conceptExplanation: `Not all content is equally urgent. A **priority queue** ensures critical items are handled first.

**Priority Levels**:
1. **Critical** (P0) - Child safety, terrorism (< 1 hour)
2. **High** (P1) - Hate speech, violence (< 4 hours)
3. **Medium** (P2) - Harassment, misinformation (< 24 hours)
4. **Low** (P3) - Spam, low-quality (< 48 hours)

**Implementation with Redis**:
- Use sorted sets (ZSET) with priority as score
- Moderators \`ZPOPMIN\` to get highest priority item
- O(log N) operations - very fast even with millions of items`,

  whyItMatters: 'Lives are at stake with critical content. Every minute counts when preventing harm.',

  famousIncident: {
    title: 'Capitol Riot Livestreams',
    company: 'Multiple platforms',
    year: '2021',
    whatHappened: 'During the US Capitol attack, platforms struggled to quickly remove livestreams of violence due to overwhelming volume. Priority systems helped surface the most critical streams.',
    lessonLearned: 'During crisis events, priority handling is essential to focus limited moderator capacity on the most harmful content.',
    icon: '🏛️',
  },

  realWorldExample: {
    company: 'TikTok',
    scenario: 'Handling viral dangerous challenges',
    howTheyDoIt: 'Uses ML to detect trending harmful content and automatically elevates it to critical priority for immediate review.',
  },

  diagram: `
┌─────────────────────────────────────┐
│         Redis Priority Queue        │
│  (Sorted Set by Priority Score)    │
├─────────────────────────────────────┤
│ P0 (Critical) │ Child safety ┃ 100  │ ◀── Moderator pulls
│ P0 (Critical) │ Terrorism    ┃ 100  │     from here first
│ P1 (High)     │ Hate speech  ┃  75  │
│ P1 (High)     │ Violence     ┃  75  │
│ P2 (Medium)   │ Harassment   ┃  50  │
│ P3 (Low)      │ Spam         ┃  25  │
│ P3 (Low)      │ Spam         ┃  25  │ ◀── Processed last
└─────────────────────────────────────┘

Moderator: ZPOPMAX → Gets highest priority item
`,

  keyPoints: [
    'Priority queue ensures critical content reviewed first',
    'Redis sorted sets provide O(log N) priority operations',
    'ML models determine priority based on content type',
    'SLA monitoring alerts if critical items wait too long',
  ],

  quickCheck: {
    question: 'Why use Redis for the priority queue instead of the database?',
    options: [
      'Redis is cheaper than PostgreSQL',
      'Redis sorted sets are faster (O(log N)) than SQL ORDER BY for high-volume queues',
      'Redis uses less storage',
      'Redis has better security',
    ],
    correctIndex: 1,
    explanation: 'Redis sorted sets are optimized for priority queue operations. SQL ORDER BY is slow on millions of rows.',
  },

  keyConcepts: [
    { title: 'Priority Queue', explanation: 'Items processed by urgency, not FIFO', icon: '🎯' },
    { title: 'Sorted Set', explanation: 'Redis data structure for priority', icon: '📊' },
    { title: 'SLA Monitoring', explanation: 'Alert if critical items wait too long', icon: '⏱️' },
  ],
};

const step6: GuidedStep = {
  id: 'moderation-step-6',
  stepNumber: 6,
  frIndex: 2,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-3: Prioritize content by severity',
    taskDescription: 'Add Redis Cache for priority queue implementation',
    componentsNeeded: [
      { type: 'cache', reason: 'Implement priority queue with Redis sorted sets', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'Moderation Server connected to Cache',
      'Cache configured for priority queue',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'ml_service', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'ml_service' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect Moderation Server to Cache. Configure it for priority queue operations (sorted sets).',
    solutionComponents: [{ type: 'cache', config: { strategy: 'priority-queue' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 7: Add Load Balancer and Scale
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔥',
  scenario: "A major news event just broke! Submissions spiked 10x in minutes.",
  hook: "Your single server is at 100% CPU. Requests are timing out. Moderators can't access the queue!",
  challenge: "Add a load balancer and scale to multiple server instances.",
  illustration: 'server-overload',
};

const step7Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Your system handles traffic spikes!',
  achievement: 'Load balancing distributes traffic across multiple servers',
  metrics: [
    { label: 'Server instances', before: '1', after: '5+' },
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Peak capacity', before: '100/s', after: '3,600/s' },
  ],
  nextTeaser: "But the ML service is still a bottleneck...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Handling Traffic Spikes',
  conceptExplanation: `A **Load Balancer** distributes requests across multiple servers.

Benefits:
- **No single point of failure** - one server crashes, others continue
- **Horizontal scaling** - add more servers for more capacity
- **Auto-scaling** - scale up during peaks, down during quiet periods

For moderation systems:
- News events cause 10x spikes (shootings, disasters, elections)
- Load balancer spreads moderator requests across servers
- Auto-scale based on queue depth and submission rate`,

  whyItMatters: 'Breaking news creates submission spikes. Without load balancing, the system becomes unavailable exactly when it\'s needed most.',

  famousIncident: {
    title: 'Australian Mosque Attacks',
    company: 'Facebook/YouTube',
    year: '2019',
    whatHappened: 'Attack video was re-uploaded 1.5M times in 24 hours. Platforms\' moderation systems were overwhelmed despite load balancing.',
    lessonLearned: 'Load balancing helps, but you need adequate capacity behind it. Auto-scaling is essential for crisis events.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'YouTube',
    scenario: 'Handling viral content removal',
    howTheyDoIt: 'Auto-scales moderation infrastructure based on queue depth. Can spin up 10x capacity in minutes.',
  },

  keyPoints: [
    'Load balancer distributes requests across servers',
    'Enables horizontal scaling for traffic spikes',
    'Auto-scale based on queue metrics',
    'Place between Client and Moderation Servers',
  ],

  quickCheck: {
    question: 'Why is auto-scaling especially important for content moderation?',
    options: [
      'It reduces costs during quiet periods',
      'Breaking news creates unpredictable 10x spikes that require rapid capacity increase',
      'It makes the system faster',
      'Moderators prefer it',
    ],
    correctIndex: 1,
    explanation: 'Crisis events create sudden massive spikes in submissions. Auto-scaling ensures you have capacity when it matters most.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Auto-Scaling', explanation: 'Automatically add/remove capacity', icon: '📈' },
    { title: 'Health Checks', explanation: 'Route around failed servers', icon: '💓' },
  ],
};

const step7: GuidedStep = {
  id: 'moderation-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing and scaling',
    taskDescription: 'Add Load Balancer and scale to multiple server instances',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to Moderation Server',
      'Moderation Server scaled to 3+ instances',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'ml_service', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'ml_service' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Add Load Balancer between Client and Moderation Server',
    level2: 'Reconnect: Client → Load Balancer → Moderation Server. Then scale Moderation Server to 3+ instances.',
    solutionComponents: [
      { type: 'load_balancer' },
      { type: 'app_server', config: { instances: 3 } },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 8: Add Database Replication and Monitoring
// =============================================================================

const step8Story: StoryContent = {
  emoji: '⚠️',
  scenario: "Your database crashed at 2 AM. The entire moderation system is DOWN.",
  hook: "10 million items are waiting in the queue. Moderators can't access anything. Harmful content is going live unchecked.",
  challenge: "Add database replication for high availability and monitoring for alerts.",
  illustration: 'database-failure',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a production-grade moderation system!',
  achievement: 'A scalable, reliable content moderation queue',
  metrics: [
    { label: 'Database availability', before: '99%', after: '99.99%' },
    { label: 'Processing capacity', after: '1,200 items/sec' },
    { label: 'Auto-moderation rate', after: '90%' },
    { label: 'Critical review SLA', after: '<1 hour' },
    { label: 'System uptime', after: '99.99%' },
  ],
  nextTeaser: "You've mastered content moderation system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'High Availability: Database Replication and Monitoring',
  conceptExplanation: `**Replication** provides redundancy and failover:

- **Primary (Leader)**: Handles all writes
- **Replicas (Followers)**: Handle reads, stay in sync with primary
- If primary fails, replica becomes new primary (automatic failover)

**Monitoring** ensures reliability:
- Track queue depth, processing rate, SLA compliance
- Alert when critical items wait too long
- Dashboard for moderator efficiency and system health

For moderation, downtime = harmful content goes live. High availability is non-negotiable.`,

  whyItMatters: 'Content moderation protects users from harm. System downtime means harmful content goes unchecked.',

  famousIncident: {
    title: 'Facebook Outage',
    company: 'Facebook',
    year: '2021',
    whatHappened: 'A 6-hour outage took down Facebook, Instagram, and WhatsApp globally. Content moderation stopped completely during this time.',
    lessonLearned: 'Database replication and failover are essential. Single points of failure are unacceptable for critical systems.',
    icon: '🔴',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Zero tolerance for moderation downtime',
    howTheyDoIt: 'Uses database clusters with automatic failover. Monitoring alerts on-call engineers if SLAs are violated.',
  },

  keyPoints: [
    'Database replication provides redundancy and read scaling',
    'Automatic failover ensures continuous availability',
    'Monitor queue metrics: depth, age, SLA compliance',
    'Alert when critical content waits too long',
  ],

  quickCheck: {
    question: 'Why is monitoring especially critical for content moderation systems?',
    options: [
      'It reduces costs',
      'SLA violations (critical content waiting too long) can mean real-world harm',
      'It makes the system faster',
      'Moderators need dashboards',
    ],
    correctIndex: 1,
    explanation: 'Content moderation SLAs exist to prevent harm. Monitoring ensures you catch violations before dangerous content goes live.',
  },

  keyConcepts: [
    { title: 'Replication', explanation: 'Multiple copies for redundancy', icon: '📋' },
    { title: 'Failover', explanation: 'Automatic switch to replica on failure', icon: '🔄' },
    { title: 'SLA Monitoring', explanation: 'Track compliance with review time limits', icon: '⏱️' },
  ],
};

const step8: GuidedStep = {
  id: 'moderation-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs need reliable, highly available infrastructure',
    taskDescription: 'Enable database replication for high availability',
    successCriteria: [
      'Click Database component',
      'Enable replication in configuration',
      'Set replica count to 2 or more',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'ml_service', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'ml_service' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Click Database → Configuration → Enable replication',
    level2: 'Set replica count to 2 for redundancy. This ensures high availability.',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const contentModerationQueueGuidedTutorial: GuidedTutorial = {
  problemId: 'content-moderation-queue',
  title: 'Design a Content Moderation Queue',
  description: 'Build a system to automatically moderate content using ML and prioritize items for human review',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🛡️',
    hook: "You've been hired as Lead Engineer at SafeSpace Inc!",
    scenario: "Your mission: Build a content moderation system that protects users from harmful content while handling millions of submissions per day.",
    challenge: "Can you design a system that combines ML automation with human judgment to keep a platform safe?",
  },

  requirementsPhase: contentModerationRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'ML Model Integration',
    'Message Queues',
    'Async Processing',
    'Priority Queues',
    'Redis Sorted Sets',
    'Load Balancing',
    'Auto-Scaling',
    'Database Replication',
    'High Availability',
    'SLA Monitoring',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 11: Stream Processing (message queues)',
    'Chapter 12: The Future of Data Systems',
  ],
};

export default contentModerationQueueGuidedTutorial;
