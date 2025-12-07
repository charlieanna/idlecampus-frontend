import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * GitHub Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a code hosting and collaboration platform like GitHub.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (cache, object storage, queues, etc.)
 *
 * Key Concepts:
 * - Git object storage (content-addressable)
 * - Packfiles and delta compression
 * - Fork network and shared objects
 * - Webhook event delivery
 * - Large File Storage (LFS)
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const githubRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a code hosting and collaboration platform like GitHub",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Principal Engineer at DevTools Inc.',
    avatar: '👩‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-repo',
      category: 'functional',
      question: "What's the core functionality developers need from a code hosting platform?",
      answer: "Developers want to:\n\n1. **Create repositories** - Initialize a Git repo to store their code\n2. **Push and pull code** - Upload commits and download changes\n3. **View repository contents** - Browse files, commits, and history in a web interface",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "GitHub is fundamentally a Git hosting service with a web UI",
    },
    {
      id: 'collaboration',
      category: 'functional',
      question: "How do developers collaborate on code?",
      answer: "Through **Pull Requests (PRs)**:\n1. Developer creates a branch with changes\n2. Opens a PR to propose merging changes\n3. Team reviews code, adds comments\n4. Changes are merged into main branch\n\nAlso need **Issues** for tracking bugs and features.",
      importance: 'critical',
      revealsRequirement: 'FR-4, FR-5',
      learningPoint: "Pull requests are the heart of collaborative development",
    },
    {
      id: 'webhooks',
      category: 'functional',
      question: "How do external tools integrate with GitHub?",
      answer: "Through **Webhooks** - GitHub sends HTTP POST requests to external URLs when events happen (push, PR opened, etc.). This enables CI/CD pipelines, deployment automation, and notifications.",
      importance: 'important',
      revealsRequirement: 'FR-6',
      learningPoint: "Webhooks enable the entire DevOps ecosystem",
    },
    {
      id: 'fork-network',
      category: 'clarification',
      question: "What happens when someone forks a repository?",
      answer: "A **fork** creates a copy of the repo under the user's account. They can make changes without affecting the original. Later, they can submit PRs to contribute back.\n\nImportant: Forks share Git objects with the parent to save storage!",
      importance: 'important',
      insight: "Fork networks can save massive amounts of storage through object deduplication",
    },
    {
      id: 'large-files',
      category: 'clarification',
      question: "How should we handle large binary files (videos, datasets, models)?",
      answer: "Git is designed for small text files. For large files, use **Git LFS (Large File Storage)**:\n- Store pointer files in Git\n- Store actual large files in object storage\n- Download large files on-demand\n\nThis keeps repositories fast.",
      importance: 'important',
      insight: "Git LFS prevents repository bloat from large binaries",
    },

    // SCALE & NFRs
    {
      id: 'throughput-repos',
      category: 'throughput',
      question: "How many repositories should we support?",
      answer: "100 million repositories, with 10 million active repositories receiving commits daily",
      importance: 'critical',
      learningPoint: "GitHub hosts over 100M repos - massive scale storage challenge",
    },
    {
      id: 'throughput-pushes',
      category: 'throughput',
      question: "How many Git pushes per day?",
      answer: "About 50 million pushes per day",
      importance: 'critical',
      calculation: {
        formula: "50M ÷ 86,400 sec = 579 pushes/sec",
        result: "~600 writes/sec (1,800 at peak)",
      },
      learningPoint: "Moderate write volume - but each push can be large (many objects)",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many clone and pull operations per day?",
      answer: "About 200 million clone/pull operations per day",
      importance: 'critical',
      calculation: {
        formula: "200M ÷ 86,400 sec = 2,315 reads/sec",
        result: "~2.3K reads/sec (7K at peak)",
      },
      learningPoint: "Read-heavy workload with large data transfers",
    },
    {
      id: 'large-repo-problem',
      category: 'burst',
      question: "What happens when someone clones a huge repository like Linux kernel?",
      answer: "The Linux kernel repo is 3+ GB with millions of objects. A single clone requires transferring gigabytes of data, generating packfiles, and computing deltas. This is computationally expensive!",
      importance: 'critical',
      insight: "Large repos require special handling - can't treat all repos equally",
    },
    {
      id: 'latency-clone',
      category: 'latency',
      question: "How fast should git clone and pull operations be?",
      answer: "For small repos (<100MB): under 30 seconds. For large repos (>1GB): up to 5 minutes is acceptable. The bottleneck is usually network transfer.",
      importance: 'important',
      learningPoint: "Git operations are network-bound for large repos",
    },
    {
      id: 'latency-web',
      category: 'latency',
      question: "How fast should the web interface load?",
      answer: "p99 under 500ms for viewing files and commits. Users expect a snappy browsing experience.",
      importance: 'important',
      learningPoint: "Web UI needs caching since parsing Git data is expensive",
    },
    {
      id: 'availability',
      category: 'latency',
      question: "What availability SLA should we target?",
      answer: "99.95% uptime. GitHub is critical infrastructure for developers - downtime blocks deployments and work worldwide.",
      importance: 'critical',
      learningPoint: "GitHub downtime affects millions of developers and companies",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-repo', 'collaboration', 'large-repo-problem'],
  criticalFRQuestionIds: ['core-repo', 'collaboration'],
  criticalScaleQuestionIds: ['throughput-reads', 'large-repo-problem', 'latency-web'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Create repositories',
      description: 'Initialize new Git repositories to store code',
      emoji: '📁',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Push and pull commits',
      description: 'Upload and download Git commits and objects',
      emoji: '⬆️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Browse repository on web',
      description: 'View files, commits, and history in browser',
      emoji: '🌐',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Create and review pull requests',
      description: 'Propose changes and review code collaboratively',
      emoji: '🔀',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Create and manage issues',
      description: 'Track bugs, features, and tasks',
      emoji: '📋',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Trigger webhooks on events',
      description: 'Notify external systems of repository events',
      emoji: '🔗',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million developers',
    writesPerDay: '50 million pushes',
    readsPerDay: '200 million clones/pulls',
    peakMultiplier: 3,
    readWriteRatio: '4:1',
    calculatedWriteRPS: { average: 579, peak: 1737 },
    calculatedReadRPS: { average: 2315, peak: 6945 },
    maxPayloadSize: '~1GB (large repo clone)',
    storagePerRecord: '~50MB average per repo',
    storageGrowthPerYear: '~5PB',
    redirectLatencySLA: 'p99 < 500ms (web)',
    createLatencySLA: 'p99 < 30s (small clone)',
  },

  architecturalImplications: [
    '✅ Read-heavy (4:1) → Caching critical for web UI and metadata',
    '✅ Large data transfers → Object storage for Git objects',
    '✅ Expensive packfile generation → Caching and pre-computation',
    '✅ Webhook delivery → Message queue for async processing',
    '✅ Fork networks → Object deduplication and shared storage',
  ],

  outOfScope: [
    'GitHub Actions (CI/CD execution)',
    'GitHub Pages (static site hosting)',
    'GitHub Packages (package registry)',
    'Multi-region deployment',
    'GitHub Copilot (AI code completion)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can create repos, push code, and view it on the web. Advanced features like packfile optimization and webhook delivery will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🐙',
  scenario: "Welcome to DevTools Inc! You've been hired to build the next GitHub.",
  hook: "Your first developer just created an account. They're ready to create their first repository!",
  challenge: "Set up the basic request flow so developers can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your platform is online!',
  achievement: 'Developers can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server is empty... let's write some code to handle Git operations!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server for Git Hosting',
  conceptExplanation: `Every web application starts with a **Client** connecting to a **Server**.

For GitHub, clients are:
1. **Git CLI** - Command-line tool (git push, git pull)
2. **Web Browser** - For viewing repos and managing PRs
3. **GitHub Desktop** - GUI application

All communicate with your **App Server** via:
- HTTP/HTTPS for web UI and API
- Git protocol (over HTTPS) for push/pull operations`,

  whyItMatters: 'Without this connection, developers can\'t host their code or collaborate.',

  realWorldExample: {
    company: 'GitHub',
    scenario: 'Handling 50 million pushes per day',
    howTheyDoIt: 'Started as a simple Rails app in 2008, now uses a complex distributed system with custom Git servers',
  },

  keyPoints: [
    'Client = Git CLI, browser, or desktop app',
    'App Server = your backend that handles Git and API requests',
    'Support both Git protocol and HTTP API',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Developer\'s tool (CLI, browser, app)', icon: '💻' },
    { title: 'App Server', explanation: 'Backend handling Git operations', icon: '🖥️' },
    { title: 'Git Protocol', explanation: 'Wire format for push/pull', icon: '🔌' },
  ],
};

const step1: GuidedStep = {
  id: 'github-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents developers accessing GitHub', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles Git operations and API requests', displayName: 'App Server' },
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
// STEP 2: Implement Core Logic (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to handle Git operations yet!",
  hook: "A developer just tried to create a repo and push code but got an error.",
  challenge: "Write the Python code to create repos, handle commits, and manage pull requests.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle Git operations!',
  achievement: 'You implemented the core GitHub functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can create repos', after: '✓' },
    { label: 'Can push commits', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all repositories are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Git Operation Handlers',
  conceptExplanation: `For GitHub, we need handlers for key operations:

**Repository APIs:**
- \`create_repo()\` - Initialize a new repository
- \`commit()\` - Accept and store Git commits
- \`create_pr()\` - Open a new pull request

**How Git works:**
1. Git stores **objects** - commits, trees, blobs (files)
2. Each object has a SHA-1 hash (content-addressable storage)
3. Objects are immutable - same content = same hash
4. References (branches) point to commits

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just a fancy file server. This is where Git magic happens!',

  famousIncident: {
    title: 'GitHub\'s MongoDB Mistake',
    company: 'GitHub',
    year: '2009-2012',
    whatHappened: 'Early GitHub used MongoDB for Git metadata. As they scaled, performance degraded. They migrated to MySQL in a painful multi-year process.',
    lessonLearned: 'Choose your data model carefully. Git\'s object model maps better to key-value stores.',
    icon: '🗄️',
  },

  realWorldExample: {
    company: 'GitHub',
    scenario: 'Storing billions of Git objects',
    howTheyDoIt: 'Custom Git server (github/git) with optimized object storage, packfile caching, and bitmap indexes',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Git objects are content-addressable (SHA-1 hashes)',
    'Store commits, trees, and blobs as separate objects',
  ],

  quickCheck: {
    question: 'Why are Git objects content-addressable?',
    options: [
      'To make storage faster',
      'Same content always has the same hash - enables deduplication',
      'To prevent conflicts',
      'To encrypt data',
    ],
    correctIndex: 1,
    explanation: 'Content-addressable storage means identical files/commits share the same hash and are stored once. This is key for fork networks!',
  },

  keyConcepts: [
    { title: 'Git Object', explanation: 'Immutable blob, tree, or commit', icon: '📦' },
    { title: 'SHA-1 Hash', explanation: 'Content-based identifier', icon: '#️⃣' },
    { title: 'Content-Addressable', explanation: 'Same content = same hash', icon: '🔑' },
  ],
};

const step2: GuidedStep = {
  id: 'github-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Create repositories, FR-2: Push commits, FR-4: Create pull requests',
    taskDescription: 'Configure APIs and implement Python handlers for repo operations',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/repos, POST /api/v1/commits, POST /api/v1/pulls APIs',
      'Open the Python tab',
      'Implement create_repo(), commit(), and create_pr() functions',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for create_repo, commit, and create_pr',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/repos', 'POST /api/v1/commits', 'POST /api/v1/pulls'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 3 AM. Your server crashed during a deployment...",
  hook: "When it came back online, ALL repositories were GONE! 10,000 repos, vanished.",
  challenge: "Add a database so repositories and commits survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your repositories are safe forever!',
  achievement: 'Data now persists across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But browsing repositories is getting slow as we grow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Databases for Git Metadata',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For GitHub, we need tables for:
- \`repositories\` - Repo metadata (name, owner, description)
- \`commits\` - Commit metadata (message, author, timestamp)
- \`users\` - Developer accounts
- \`pull_requests\` - PR state and metadata
- \`issues\` - Issue tracking

**Important**: Git objects themselves go to object storage later!`,

  whyItMatters: 'Imagine losing thousands of repositories because of a server restart. Developers would lose their work and trust!',

  famousIncident: {
    title: 'GitLab.com Database Deletion',
    company: 'GitLab',
    year: '2017',
    whatHappened: 'A tired engineer ran "rm -rf" on the wrong database server. 300GB of production data deleted. Backups failed. Lost 6 hours of user data.',
    lessonLearned: 'Persistent storage with tested backups and replication is non-negotiable.',
    icon: '💀',
  },

  realWorldExample: {
    company: 'GitHub',
    scenario: 'Storing metadata for 100M+ repositories',
    howTheyDoIt: 'Uses MySQL for relational data (repos, users, PRs) with heavy partitioning and read replicas',
  },

  keyPoints: [
    'Database stores metadata, not Git objects (those come later)',
    'Use SQL (PostgreSQL/MySQL) for structured data',
    'Tables: repositories, commits, users, pull_requests, issues',
    'Git objects are too large for database - use object storage',
  ],

  quickCheck: {
    question: 'What should we store in the database vs object storage?',
    options: [
      'Everything in database',
      'Metadata in database, Git objects in object storage',
      'Everything in object storage',
      'Metadata in object storage, Git objects in database',
    ],
    correctIndex: 1,
    explanation: 'Database is for queryable metadata. Git objects (blobs, trees) are large binary data that belong in object storage.',
  },

  keyConcepts: [
    { title: 'Metadata', explanation: 'Repo info, users, PRs - queryable data', icon: '📊' },
    { title: 'Git Objects', explanation: 'Large binary data - goes to object storage', icon: '📦' },
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
  ],
};

const step3: GuidedStep = {
  id: 'github-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent metadata storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store repo metadata, users, PRs, issues', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Repository Metadata
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 100,000 repositories, and the web UI is loading in 3+ seconds!",
  hook: "Developers are complaining: 'Why is GitHub so slow?' Every page view hits the database.",
  challenge: "Add a cache to make repository browsing lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Repository pages load 30x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Page load time', before: '3000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "But we need to handle massive amounts of traffic...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Speed Up Repository Browsing',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

For GitHub, we cache:
- **Repository metadata** - name, description, star count
- **Popular repositories** - trending repos get hit frequently
- **Commit metadata** - author, message, timestamp
- **User profiles** - avatar, bio, contribution stats

Cache Strategy:
1. Check cache first
2. On hit: return immediately
3. On miss: fetch from DB, store in cache, return
4. Set TTL (Time To Live) to keep data fresh`,

  whyItMatters: 'At 7K reads/sec peak, hitting the database for every repo page would melt it. Caching is essential.',

  famousIncident: {
    title: 'GitHub DDoS Attack',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'Largest DDoS attack ever recorded (1.35 Tbps) hit GitHub. Their edge caching and DDoS mitigation absorbed most traffic. Site stayed up.',
    lessonLearned: 'Caching not only improves performance but also provides DDoS resilience.',
    icon: '🛡️',
  },

  realWorldExample: {
    company: 'GitHub',
    scenario: 'Serving millions of page views per day',
    howTheyDoIt: 'Multi-layer caching: Redis for hot data, CDN for static assets, HTTP caching headers',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (95% of requests)
                     │   Return instantly!
`,

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache repository metadata, not Git objects',
    'Popular repos benefit most from caching',
    'Set appropriate TTL (e.g., 300 seconds for repo metadata)',
  ],

  quickCheck: {
    question: 'What data should we cache for GitHub?',
    options: [
      'Everything including large Git objects',
      'Only user sessions',
      'Repository metadata and popular content',
      'Nothing - databases are fast enough',
    ],
    correctIndex: 2,
    explanation: 'Cache frequently accessed metadata. Git objects are too large for cache and are served from object storage.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'github-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Browse repository on web (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache repository metadata for fast reads', displayName: 'Redis Cache' },
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
// STEP 5: Add Load Balancer
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "A popular open-source project moved to your platform!",
  hook: "Traffic spiked 10x overnight. Your single app server is maxed out at 100% CPU!",
  challenge: "Add a load balancer to distribute traffic across multiple servers.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Traffic is now distributed!',
  achievement: 'Load balancer spreads requests across servers',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Request distribution', after: 'Balanced' },
  ],
  nextTeaser: "But we still need to store actual Git objects somewhere...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Handle More Traffic',
  conceptExplanation: `A **Load Balancer** sits in front of your app servers and distributes incoming requests.

For GitHub:
- Distributes git push/pull operations
- Balances web UI traffic
- Routes API requests

Benefits:
- **No single point of failure** - if one server dies, others keep working
- **Horizontal scaling** - add more servers to handle more traffic
- **Session affinity** - can route same user to same server if needed`,

  whyItMatters: 'At peak, GitHub handles 7K requests/second. No single server can handle that alone.',

  famousIncident: {
    title: 'npm Left-Pad Incident',
    company: 'npm',
    year: '2016',
    whatHappened: 'A developer unpublished a tiny package. Thousands of builds broke worldwide. npm traffic spiked 100x as everyone scrambled. Load balancers prevented total collapse.',
    lessonLearned: 'Load balancers are essential for handling unpredictable traffic spikes.',
    icon: '📦',
  },

  realWorldExample: {
    company: 'GitHub',
    scenario: 'Handling 7K requests/second at peak',
    howTheyDoIt: 'Multiple layers of load balancers (L4 and L7) distributing across hundreds of app servers',
  },

  keyPoints: [
    'Load balancer distributes requests across servers',
    'Enables horizontal scaling (add more servers)',
    'Eliminates single point of failure',
    'Place between Client and App Servers',
  ],

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Health Checks', explanation: 'Monitor server availability', icon: '💓' },
  ],
};

const step5: GuidedStep = {
  id: 'github-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

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

  celebration: step5Celebration,

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
// STEP 6: Add Object Storage for Git Objects
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📦',
  scenario: "Developers are pushing large repositories and your database is exploding!",
  hook: "A single repo with 10GB of Git objects just filled your database. Storage costs are skyrocketing!",
  challenge: "Add object storage to efficiently store Git objects and large files.",
  illustration: 'storage-crisis',
};

const step6Celebration: CelebrationContent = {
  emoji: '☁️',
  message: 'Git objects now stored efficiently!',
  achievement: 'Object storage handles large files and Git objects',
  metrics: [
    { label: 'Database size', before: '5TB', after: '100GB' },
    { label: 'Storage cost', before: '$5,000/mo', after: '$500/mo' },
    { label: 'Can handle large repos', after: '✓' },
  ],
  nextTeaser: "But webhook delivery is blocking request processing...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage: The Right Tool for Git Objects',
  conceptExplanation: `Git objects (blobs, trees, commits) are **large, immutable binary data**. They don't belong in a database!

**Object Storage (S3, GCS)** is perfect for Git because:
- **Content-addressable**: Store by SHA-1 hash
- **Immutable**: Objects never change (perfect for Git!)
- **Cheap**: $0.023/GB vs $0.30/GB for database
- **Scalable**: Unlimited storage
- **Optimized for large files**: Especially with Git LFS

**How it works:**
1. When code is pushed, compute SHA-1 hash
2. Store object in S3 at path: \`objects/{hash[:2]}/{hash[2:]}\`
3. Database stores only the hash reference
4. On pull, fetch objects from S3

**Git LFS:**
For large files (videos, datasets), store:
- Pointer file in Git (tiny)
- Actual file in object storage (huge)`,

  whyItMatters: 'Git objects can be gigabytes. Storing them in database is slow and expensive. Object storage is 10x cheaper!',

  famousIncident: {
    title: 'Git Repository Corruption',
    company: 'Linux Kernel',
    year: '2011',
    whatHappened: 'Bit flips in storage corrupted Git objects. Because Git uses content-addressable storage, corruption was detected immediately. Healthy objects were restored from mirrors.',
    lessonLearned: 'Content-addressable storage provides integrity checking. SHA-1 mismatch = corruption detected!',
    icon: '🔐',
  },

  realWorldExample: {
    company: 'GitHub',
    scenario: 'Storing petabytes of Git objects',
    howTheyDoIt: 'Custom object storage with deduplication, packfiles, and Git LFS for large files',
  },

  diagram: `
Git Push
   │
   ▼
┌─────────────┐
│ App Server  │
└──────┬──────┘
       │
       ├──────▶ Database (store hash reference)
       │
       └──────▶ Object Storage (store actual Git objects)
                S3: objects/ab/cdef123456...

Git Clone
   │
   ▼
┌─────────────┐
│ App Server  │
└──────┬──────┘
       │
       ├──────▶ Database (get hash references)
       │
       └──────▶ Object Storage (fetch objects by hash)
`,

  keyPoints: [
    'Store Git objects in object storage, not database',
    'Database stores only metadata and hash references',
    'Content-addressable: Same object stored once',
    'Git LFS for large files (videos, models, datasets)',
    'Object storage is 10x cheaper than database storage',
  ],

  quickCheck: {
    question: 'Why is object storage better than database for Git objects?',
    options: [
      'It\'s faster',
      'It\'s cheaper, scalable, and optimized for large immutable data',
      'It has better query capabilities',
      'It provides ACID guarantees',
    ],
    correctIndex: 1,
    explanation: 'Object storage is designed for large, immutable blobs. It\'s 10x cheaper and infinitely scalable. Databases are for queryable structured data.',
  },

  keyConcepts: [
    { title: 'Object Storage', explanation: 'S3-like storage for large blobs', icon: '☁️' },
    { title: 'Content-Addressable', explanation: 'Store by SHA-1 hash', icon: '🔑' },
    { title: 'Git LFS', explanation: 'Large File Storage for big binaries', icon: '📦' },
  ],
};

const step6: GuidedStep = {
  id: 'github-step-6',
  stepNumber: 6,
  frIndex: 1,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-2: Push and pull commits (now with efficient storage)',
    taskDescription: 'Add Object Storage for Git objects and large files',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store Git objects and LFS files efficiently', displayName: 'Object Storage (S3)' },
    ],
    successCriteria: [
      'Object Storage component added',
      'App Server connected to Object Storage',
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
    level1: 'Drag an Object Storage (S3) component onto the canvas',
    level2: 'Connect App Server to Object Storage. Git objects will be stored here instead of database.',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 7: Add Message Queue for Webhooks
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🪝',
  scenario: "Developers are configuring webhooks for CI/CD pipelines!",
  hook: "But webhook delivery is blocking request processing. When a repo has 100 webhooks, pushes time out!",
  challenge: "Add a message queue to handle webhook delivery asynchronously.",
  illustration: 'webhook-problem',
};

const step7Celebration: CelebrationContent = {
  emoji: '📨',
  message: 'Webhooks now delivered reliably!',
  achievement: 'Async processing handles webhook delivery efficiently',
  metrics: [
    { label: 'Push latency', before: '5s', after: '<500ms' },
    { label: 'Webhook delivery', after: 'Async & reliable' },
    { label: 'Failed webhooks', after: 'Auto-retried' },
  ],
  nextTeaser: "But we need to optimize costs...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Async Webhook Delivery',
  conceptExplanation: `**The Webhook Problem:**
When a developer pushes code, GitHub needs to:
1. Store the commits ✅
2. Notify all registered webhooks (CI/CD, Slack, etc.)

If a repo has 100 webhooks, delivering them **synchronously** would:
- Take 10+ seconds (100 HTTP requests)
- Block the push operation
- Fail if any webhook endpoint is down

**Solution: Message Queue**
1. Accept push → Store commits → Add "push event" to queue → Return success ✅
2. Background workers consume queue
3. Deliver webhooks asynchronously
4. Retry failed deliveries

Common events: push, pull_request, issues, release`,

  whyItMatters: 'Webhooks enable the entire DevOps ecosystem. Without async delivery, pushes would timeout.',

  famousIncident: {
    title: 'GitHub Webhook Storm',
    company: 'GitHub',
    year: '2020',
    whatHappened: 'A bug caused webhook retry storm - millions of webhooks redelivered simultaneously. Crashed many customer CI/CD systems. Queue backlog took hours to clear.',
    lessonLearned: 'Webhook delivery needs rate limiting, exponential backoff, and circuit breakers.',
    icon: '⛈️',
  },

  realWorldExample: {
    company: 'GitHub',
    scenario: 'Delivering millions of webhooks per day',
    howTheyDoIt: 'Uses queue system with multiple priority levels, retry logic, and delivery tracking',
  },

  diagram: `
Git Push
   │
   ▼
┌─────────────┐
│ App Server  │ ── Store commits ──▶ Database & Object Storage
└──────┬──────┘
       │ Publish event
       ▼
┌─────────────────────────────────────┐
│        Message Queue                │
│  [push_event1, pr_event2, ...]      │
└──────────────┬──────────────────────┘
       │ Return "Push successful!"
       │
       │ Workers consume
       ▼
┌─────────────────┐
│ Webhook Workers │ ── HTTP POST ──▶ External CI/CD, Slack, etc.
│ (background)    │
└─────────────────┘
   │
   └──▶ Retry on failure with exponential backoff
`,

  keyPoints: [
    'Message queue decouples push from webhook delivery',
    'User gets instant response - delivery happens in background',
    'Workers deliver webhooks with retries',
    'Handle common events: push, pull_request, issues',
    'Implement rate limiting to prevent storms',
  ],

  quickCheck: {
    question: 'Why deliver webhooks asynchronously instead of synchronously?',
    options: [
      'It\'s cheaper',
      'User doesn\'t wait - webhooks delivered in background',
      'It uses less memory',
      'Webhooks are optional',
    ],
    correctIndex: 1,
    explanation: 'Async means push returns instantly. Webhook delivery happens in background with retries for reliability.',
  },

  keyConcepts: [
    { title: 'Webhook', explanation: 'HTTP callback for repository events', icon: '🪝' },
    { title: 'Message Queue', explanation: 'Buffer for async event processing', icon: '📬' },
    { title: 'Retry Logic', explanation: 'Redeliver failed webhooks', icon: '🔄' },
  ],
};

const step7: GuidedStep = {
  id: 'github-step-7',
  stepNumber: 7,
  frIndex: 5,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-6: Trigger webhooks on events (now async & reliable)',
    taskDescription: 'Add a Message Queue for async webhook delivery',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle webhook delivery asynchronously', displayName: 'Message Queue (RabbitMQ)' },
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
    level1: 'Drag a Message Queue (RabbitMQ/Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async webhook delivery.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Your monthly cloud bill is $450,000.",
  hook: "The CFO says: 'Cut costs by 30% or we're raising prices for all developers.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built GitHub!',
  achievement: 'A scalable, cost-effective code hosting platform',
  metrics: [
    { label: 'Monthly cost', before: '$450K', after: 'Under budget' },
    { label: 'Clone/Pull latency', after: '<30s' },
    { label: 'Web UI latency', after: '<500ms' },
    { label: 'Availability', after: '99.95%' },
  ],
  nextTeaser: "You've mastered GitHub system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Efficient Resource Usage',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

**Cost optimization strategies for GitHub:**

1. **Object Storage Tiers**
   - Hot tier: Recent commits (accessed frequently)
   - Cold tier: Old commits (archived, cheaper)

2. **Cache Optimization**
   - Cache popular repos aggressively
   - Smaller cache for unpopular repos

3. **Packfile Caching**
   - Pre-compute packfiles for popular repos
   - Generate on-demand for others

4. **Database Optimization**
   - Archive old PR/issue data
   - Use read replicas efficiently

5. **Compute Right-Sizing**
   - Scale workers based on webhook queue depth
   - Auto-scale app servers with traffic

**GitHub-Specific:**
- Fork networks share objects (deduplication)
- Shallow clones reduce bandwidth
- Bitmap indexes speed up packfile generation`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it.',

  famousIncident: {
    title: 'The Move to MySQL Cluster',
    company: 'GitHub',
    year: '2014-2018',
    whatHappened: 'GitHub migrated from single MySQL to clustered MySQL (Vitess-like). Took 4 years! But enabled massive cost savings through better resource utilization.',
    lessonLearned: 'At scale, database optimization saves millions. But migrations are hard - design for scale from day 1.',
    icon: '🗄️',
  },

  realWorldExample: {
    company: 'GitHub',
    scenario: 'Running at massive scale',
    howTheyDoIt: 'Heavily optimizes storage (deduplication, packfiles), uses cold storage for old data, aggressive caching',
  },

  keyPoints: [
    'Use object storage tiers (hot/cold)',
    'Cache popular repositories aggressively',
    'Share objects across fork networks',
    'Archive old data to cheaper storage',
    'Right-size compute resources',
    'Pre-compute packfiles for popular repos',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for GitHub?',
    options: [
      'Delete old repositories',
      'Object deduplication and storage tiers',
      'Reduce replica count',
      'Use smaller servers',
    ],
    correctIndex: 1,
    explanation: 'Object deduplication (fork networks share objects) and storage tiers (cold storage for old data) provide massive savings.',
  },

  keyConcepts: [
    { title: 'Storage Tiers', explanation: 'Hot vs cold data storage', icon: '🌡️' },
    { title: 'Deduplication', explanation: 'Store same object once', icon: '🔗' },
    { title: 'Right-Sizing', explanation: 'Match resources to actual needs', icon: '📏' },
  ],
};

const step8: GuidedStep = {
  id: 'github-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $400/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $400/month',
      'Maintain all performance requirements',
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
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component\'s configuration for over-provisioning',
    level2: 'Consider: smaller cache, right-sized instances, cold storage tier for objects',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const githubGuidedTutorial: GuidedTutorial = {
  problemId: 'github',
  title: 'Design GitHub',
  description: 'Build a code hosting and collaboration platform with Git, PRs, and webhooks',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🐙',
    hook: "You've been hired as Lead Engineer at DevTools Inc!",
    scenario: "Your mission: Build a GitHub-like platform that can handle millions of developers pushing code, reviewing PRs, and integrating with CI/CD pipelines.",
    challenge: "Can you design a system that efficiently stores Git objects and delivers webhooks reliably?",
  },

  requirementsPhase: githubRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Git Object Storage',
    'Content-Addressable Storage',
    'Database Design',
    'Caching',
    'Load Balancing',
    'Object Storage (S3)',
    'Message Queues',
    'Webhook Delivery',
    'Git LFS',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (LSM-trees for Git objects)',
    'Chapter 4: Encoding (Git object format)',
    'Chapter 11: Stream Processing (Webhook delivery)',
  ],
};

export default githubGuidedTutorial;
