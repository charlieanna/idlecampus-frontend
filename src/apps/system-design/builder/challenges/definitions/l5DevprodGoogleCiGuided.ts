import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Google-style CI/CD Platform Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial teaching build systems, test infrastructure,
 * deployment pipelines, and hermetic builds at Google scale.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-4: Build basic working CI/CD system (FR satisfaction)
 * Steps 5-10: Scale with NFRs (distributed builds, hermetic builds, caching)
 *
 * Key Concepts:
 * - Build systems (Bazel-style)
 * - Hermetic builds and reproducibility
 * - Distributed test execution
 * - Deployment pipelines and canary releases
 * - Build caching and remote execution
 * - Artifact storage and versioning
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const googleCiRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a Google-style CI/CD platform that supports massive monorepo builds",

  interviewer: {
    name: 'Maya Patel',
    role: 'Staff Engineer, Developer Infrastructure',
    avatar: '👩‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-build',
      category: 'functional',
      question: "What are the core build capabilities developers need?",
      answer: "Developers need to:\n\n1. **Define build rules** - Specify how to compile code, run tests, create artifacts\n2. **Run builds** - Execute builds locally or in CI\n3. **Run tests** - Execute unit tests, integration tests, and E2E tests\n4. **See build results** - View logs, test results, and build artifacts",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "A CI/CD platform is fundamentally about automating builds and tests",
    },
    {
      id: 'hermetic-builds',
      category: 'functional',
      question: "What does 'hermetic build' mean and why does it matter?",
      answer: "A **hermetic build** is completely isolated:\n\n1. **Explicit dependencies** - All inputs declared (code, libraries, tools)\n2. **No implicit dependencies** - Can't access network, system libraries, etc.\n3. **Reproducible** - Same inputs always produce identical outputs\n4. **Cacheable** - Can cache results based on input hash\n\nAt Google scale, hermeticity enables:\n- **Build caching** - Never rebuild the same thing twice\n- **Distributed builds** - Run anywhere, get same result\n- **Debugging** - No 'works on my machine' issues",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Hermetic builds are the foundation for build caching and distributed execution",
    },
    {
      id: 'deployment-pipeline',
      category: 'functional',
      question: "How do code changes get deployed to production?",
      answer: "Through a **deployment pipeline**:\n\n1. **Commit** - Developer commits to version control\n2. **Pre-submit checks** - Run tests before code is merged\n3. **Build artifacts** - Create deployable binaries/containers\n4. **Progressive rollout** - Canary → 10% → 50% → 100%\n5. **Monitor and rollback** - Watch metrics, auto-rollback on errors\n\nKey requirement: Deployments must be fast and safe!",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Progressive rollouts minimize blast radius of bad deployments",
    },
    {
      id: 'monorepo',
      category: 'clarification',
      question: "Are we supporting a monorepo like Google, or many small repos?",
      answer: "**Monorepo** - all code in a single repository:\n\n- 50,000+ developers\n- 2 billion lines of code\n- Millions of files\n- 100,000+ build targets\n\nChallenges:\n- Can't check out entire repo (too large)\n- Can't rebuild everything (takes days)\n- Must be incremental - only build what changed",
      importance: 'critical',
      insight: "Monorepo scale requires fundamentally different tooling than multi-repo",
    },
    {
      id: 'test-infrastructure',
      category: 'functional',
      question: "How should we handle test execution at scale?",
      answer: "Test execution needs:\n\n1. **Parallel execution** - Run thousands of tests simultaneously\n2. **Flake detection** - Automatically retry flaky tests\n3. **Test selection** - Only run tests affected by code changes\n4. **Test sharding** - Split large test suites across machines\n5. **Result caching** - Never re-run tests for unchanged code\n\nAt Google: ~4 billion test cases run per day!",
      importance: 'critical',
      revealsRequirement: 'FR-6',
      learningPoint: "Smart test selection and caching are critical for velocity",
    },
    {
      id: 'artifacts',
      category: 'clarification',
      question: "What happens to build artifacts? How long do we keep them?",
      answer: "Build artifacts need:\n\n1. **Storage** - Store binaries, containers, packages\n2. **Versioning** - Track which artifact came from which commit\n3. **Retention** - Keep production artifacts forever, dev artifacts 90 days\n4. **Promotion** - Promote artifacts from dev → staging → prod\n5. **Rollback** - Ability to deploy older artifacts",
      importance: 'important',
      insight: "Artifacts are the contract between build and deployment systems",
    },

    // SCALE & NFRs
    {
      id: 'throughput-commits',
      category: 'throughput',
      question: "How many commits do we need to process per day?",
      answer: "At Google scale:\n- 40,000 commits per day to monorepo\n- Each commit triggers pre-submit checks\n- Peak: 100 commits per minute during work hours",
      importance: 'critical',
      calculation: {
        formula: "40,000 commits/day ÷ 86,400 sec = 0.46 commits/sec average",
        result: "~0.5 commits/sec average, ~1.7/sec peak",
      },
      learningPoint: "Each commit can trigger thousands of builds and tests",
    },
    {
      id: 'throughput-builds',
      category: 'throughput',
      question: "How many builds are executed per day?",
      answer: "At Google scale:\n- 150 million builds per day (local + CI)\n- 50 million CI builds (triggered by commits)\n- 100 million local developer builds",
      importance: 'critical',
      calculation: {
        formula: "50M CI builds/day ÷ 86,400 sec = 579 builds/sec",
        result: "~600 builds/sec average, ~1,800/sec peak",
      },
      learningPoint: "Build system is extremely read-heavy - caching is critical",
    },
    {
      id: 'throughput-tests',
      category: 'throughput',
      question: "How many test executions per day?",
      answer: "At Google scale:\n- 4 billion test executions per day\n- 150 million test targets\n- Average: 46,000 tests/second!",
      importance: 'critical',
      calculation: {
        formula: "4B tests/day ÷ 86,400 sec = 46,296 tests/sec",
        result: "~46K tests/sec average, ~138K/sec peak",
      },
      learningPoint: "Test execution must be massively parallel and distributed",
    },
    {
      id: 'burst-build-storm',
      category: 'burst',
      question: "What happens when there's a mass rebuild event?",
      answer: "Scenario: **Toolchain upgrade** - new compiler version\n\nImpact:\n- Invalidates ALL cached builds\n- Forces rebuild of entire monorepo\n- 100,000+ build targets need rebuilding\n- Without distributed execution, would take weeks!",
      importance: 'critical',
      insight: "Cache invalidation storms require distributed remote execution",
    },
    {
      id: 'latency-presubmit',
      category: 'latency',
      question: "How fast should pre-submit checks complete?",
      answer: "Target: **p90 under 5 minutes**\n\nDevelopers wait for pre-submit before merging code. Long waits kill productivity.\n\nAt Google:\n- Small changes: <2 minutes\n- Medium changes: <5 minutes\n- Large changes: <15 minutes\n\nAchieved through test selection and parallelization.",
      importance: 'critical',
      learningPoint: "Pre-submit latency directly impacts developer velocity",
    },
    {
      id: 'latency-build',
      category: 'latency',
      question: "How fast should incremental builds be?",
      answer: "Target: **p90 under 30 seconds**\n\nDevelopers rebuild frequently during development. Slow builds break flow state.\n\nKeys to speed:\n- Only rebuild what changed (incremental)\n- Fetch cached results (90%+ hit rate)\n- Parallel execution",
      importance: 'critical',
      learningPoint: "Build latency affects every developer, every day",
    },
    {
      id: 'availability',
      category: 'availability',
      question: "What availability do we need for the build system?",
      answer: "Target: **99.9% uptime**\n\nBuild system downtime stops ALL development:\n- Developers can't build locally (if cache is down)\n- CI can't run (blocks all merges)\n- Deployments blocked\n\nEvery minute of downtime = 50,000 developers blocked!",
      importance: 'critical',
      learningPoint: "Build system is critical infrastructure - downtime is catastrophic",
    },
    {
      id: 'payload-artifact',
      category: 'payload',
      question: "How large are build artifacts?",
      answer: "Artifact sizes:\n- Small binaries: 10-50 MB\n- Container images: 500 MB - 2 GB\n- Large applications: 5-10 GB\n\nDaily artifact generation:\n- 50M builds × 100 MB average = 5 PB/day\n- With deduplication: ~500 TB/day actual storage",
      importance: 'important',
      insight: "Content-addressable storage enables massive deduplication",
    },
    {
      id: 'cache-hit-rate',
      category: 'clarification',
      question: "What cache hit rate should we target?",
      answer: "Target: **90%+ cache hit rate**\n\nAt 90% hit rate:\n- Only 10% of builds execute (5M/day vs 50M/day)\n- 10x reduction in compute cost\n- 10x faster average build time\n\nCache hits come from:\n- Remote cache (shared across all developers)\n- Build result caching (hermetic builds enable this)\n- Test result caching",
      importance: 'critical',
      insight: "Every 1% cache hit improvement saves millions in compute",
    },
  ],

  minimumQuestionsRequired: 4,
  criticalQuestionIds: ['core-build', 'hermetic-builds', 'deployment-pipeline', 'throughput-builds'],
  criticalFRQuestionIds: ['core-build', 'hermetic-builds', 'deployment-pipeline'],
  criticalScaleQuestionIds: ['throughput-builds', 'throughput-tests', 'latency-presubmit'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Define and execute builds',
      description: 'Developers can define build rules and execute builds',
      emoji: '🔨',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Run tests at scale',
      description: 'Execute unit, integration, and E2E tests in parallel',
      emoji: '🧪',
    },
    {
      id: 'fr-3',
      text: 'FR-3: View build and test results',
      description: 'Developers see logs, test results, and artifacts',
      emoji: '📊',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Hermetic builds',
      description: 'Builds are reproducible with explicit dependencies',
      emoji: '🔒',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Deployment pipelines',
      description: 'Progressive rollouts from commit to production',
      emoji: '🚀',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Smart test selection',
      description: 'Only run tests affected by code changes',
      emoji: '🎯',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50,000 developers',
    writesPerDay: '40,000 commits',
    readsPerDay: '150 million builds',
    peakMultiplier: 3,
    readWriteRatio: '3750:1',
    calculatedWriteRPS: { average: 0.5, peak: 1.7 },
    calculatedReadRPS: { average: 1736, peak: 5208 },
    maxPayloadSize: '~10 GB (large artifact)',
    storagePerRecord: '~100 MB per build artifact',
    storageGrowthPerYear: '~180 PB',
    redirectLatencySLA: 'p90 < 30s (incremental build)',
    createLatencySLA: 'p90 < 5 min (pre-submit)',
  },

  architecturalImplications: [
    '✅ Extremely read-heavy → Remote caching with content-addressable storage',
    '✅ Massive parallelism → Distributed remote execution cluster',
    '✅ Hermetic builds → Sandboxed execution environments',
    '✅ 4B tests/day → Distributed test runner with smart selection',
    '✅ Cache invalidation storms → Gradual rollouts of toolchain changes',
  ],

  outOfScope: [
    'Code review system (separate from CI/CD)',
    'Version control system (assume Git)',
    'IDE integration',
    'Local development environment setup',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple CI/CD system where developers can submit builds, run tests, and deploy artifacts. Hermetic builds and distributed execution will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Build Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🏗️',
  scenario: "Welcome to Google! You've been hired to build the next-generation CI/CD platform for Google's monorepo.",
  hook: "Your first engineer just wrote code and wants to run a build. But there's no build system!",
  challenge: "Set up the basic request flow so developers can submit builds to your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your build system is online!',
  achievement: 'Developers can now submit build requests to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting builds', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to build anything yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Build Server Architecture',
  conceptExplanation: `A **Build Server** (like Bazel, Jenkins, or Google's internal system) orchestrates builds.

When a developer runs a build, their request travels to your build server, which:
1. Receives the build request (which targets to build)
2. Analyzes dependencies (what needs to be built)
3. Executes build actions (compile, test, package)
4. Returns results (artifacts and logs)

The build server is the brain of your CI/CD system.`,

  whyItMatters: `In production, build servers handle millions of builds per day. They need to be:
- **Fast**: Developers wait for builds during development
- **Reliable**: Failed builds block deployments
- **Scalable**: Handle thousands of concurrent builds`,

  realWorldExample: {
    company: 'Google',
    scenario: 'Handling 150 million builds per day',
    howTheyDoIt: 'Uses Blaze/Bazel with distributed remote execution across 100,000+ machines',
  },

  keyPoints: [
    'Build server orchestrates all build and test execution',
    'Clients (CLI, CI) submit build requests to the server',
    'Server analyzes dependencies and executes build graph',
    'Returns build artifacts and logs to client',
  ],

  diagram: `
    [Developer CLI] ──→ [Build Server] ──→ [Execute Build]
    [CI System]     ──→ [Build Server] ──→ [Run Tests]
  `,

  interviewTip: 'Always start with the core orchestrator - the build server. You can add workers, caches, and distributed execution later.',
};

const step1: GuidedStep = {
  id: 'google-ci-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and Build Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents developers and CI systems', displayName: 'Client' },
      { type: 'app_server', reason: 'Orchestrates builds and tests', displayName: 'Build Server' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'Build Server component added to canvas',
      'Client connected to Build Server',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server (Build Server) from the component palette onto the canvas',
    level2: 'Click the Client, then click the Build Server to create a connection between them',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Build and Test Logic
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your build server is connected, but it doesn't know how to build anything!",
  hook: "A developer just ran 'build //app:server' and got an error: 'No build rules defined'.",
  challenge: "Write the Python code to handle build requests, compile code, and run tests.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Builds are working!',
  achievement: 'Your system can now build code and run tests',
  metrics: [
    { label: 'Build handler', after: 'Implemented' },
    { label: 'Test runner', after: 'Implemented' },
    { label: 'Can execute builds', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all build history is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Build Execution: From Request to Artifact',
  conceptExplanation: `For a build system, we need handlers for key operations:

**Build APIs:**
- \`build_target()\` - Build a specific target (e.g., //app:server)
- \`run_tests()\` - Execute tests for a target
- \`get_build_status()\` - Check build progress and results

**How builds work:**
1. **Dependency analysis** - What needs to be built?
2. **Build graph** - Order of build actions
3. **Execute actions** - Compile, link, package
4. **Store artifacts** - Binaries, test results

For now, we'll execute builds directly (no caching or distribution yet).`,

  whyItMatters: 'Build execution is the heart of CI/CD. It must be fast, correct, and reliable.',

  famousIncident: {
    title: 'Knight Capital Build Failure',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'Deployed wrong version of trading software due to incomplete deployment. Lost $440 million in 45 minutes. The deployment system deployed 7 of 8 servers, leaving one with old code that had opposite trading logic.',
    lessonLearned: 'Atomic deployments are critical. Build systems must verify all servers get the same artifact.',
    icon: '💸',
  },

  realWorldExample: {
    company: 'Google',
    scenario: 'Building targets from a 2 billion line monorepo',
    howTheyDoIt: 'Bazel analyzes dependencies, builds a hermetic action graph, and executes only what changed',
  },

  keyPoints: [
    'Build handler analyzes dependencies and creates build graph',
    'Execute build actions in correct order (topological sort)',
    'Store artifacts and test results',
    'Track build status (queued → running → completed)',
  ],

  quickCheck: {
    question: 'Why must builds execute in dependency order?',
    options: [
      'To make builds faster',
      'Child targets depend on parent artifacts (can\'t link before compiling)',
      'To save memory',
      'It doesn\'t matter',
    ],
    correctIndex: 1,
    explanation: 'You must compile libraries before linking binaries. The build graph encodes these dependencies.',
  },

  keyConcepts: [
    { title: 'Build Target', explanation: 'A buildable unit (binary, library, test)', icon: '🎯' },
    { title: 'Build Graph', explanation: 'Dependency tree of targets', icon: '📊' },
    { title: 'Build Action', explanation: 'Single step (compile, test, package)', icon: '⚙️' },
  ],
};

const step2: GuidedStep = {
  id: 'google-ci-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Define and execute builds, FR-2: Run tests',
    taskDescription: 'Configure APIs and implement Python handlers for build and test execution',
    successCriteria: [
      'Click on Build Server to open inspector',
      'Assign POST /api/v1/build, POST /api/v1/test, GET /api/v1/status APIs',
      'Open the Python tab',
      'Implement build_target(), run_tests(), and get_status() functions',
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
    level1: 'Click on the Build Server, then go to the APIs tab to assign endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for build_target, run_tests, and get_status',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/build', 'POST /api/v1/test', 'GET /api/v1/status'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Build History
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! Your build server crashed during a deployment...",
  hook: "When it restarted, ALL build history was GONE! Developers can't see which builds passed or failed.",
  challenge: "Add a database to store build history, test results, and artifacts metadata.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Build history is now persistent!',
  achievement: 'Builds and test results survive server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Build history', after: 'Saved' },
  ],
  nextTeaser: "But builds are slow because we rebuild everything every time...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Tracking Build History',
  conceptExplanation: `A **Database** stores build metadata permanently.

For a build system, we need tables for:
- \`builds\` - Build requests, status, timestamps
- \`build_targets\` - Individual targets in each build
- \`test_results\` - Test execution results
- \`artifacts\` - Artifact metadata (path, hash, size)
- \`build_logs\` - Execution logs

**Important**: Large artifacts go to object storage, not database!`,

  whyItMatters: 'Developers need to see build history, debug failures, and track test trends over time.',

  famousIncident: {
    title: 'CircleCI Database Outage',
    company: 'CircleCI',
    year: '2020',
    whatHappened: 'Primary database failed, replica was minutes behind. Lost 4 minutes of build history. Thousands of builds had to be re-run. Developers couldn\'t see if their builds passed.',
    lessonLearned: 'Build systems need high-availability databases with up-to-date replicas.',
    icon: '🗄️',
  },

  realWorldExample: {
    company: 'Google',
    scenario: 'Storing metadata for billions of builds',
    howTheyDoIt: 'Uses distributed database (Spanner) with geographic replication for build metadata',
  },

  keyPoints: [
    'Database stores build metadata, not artifacts',
    'Track build status, test results, and timestamps',
    'Enable querying: "Show me all failed builds today"',
    'Large artifacts go to object storage',
  ],

  quickCheck: {
    question: 'What should we store in the database vs object storage?',
    options: [
      'Everything in database',
      'Metadata in database, artifacts in object storage',
      'Everything in object storage',
      'Build results in database, code in object storage',
    ],
    correctIndex: 1,
    explanation: 'Database is for queryable metadata. Large binaries and artifacts belong in object storage.',
  },

  keyConcepts: [
    { title: 'Build Metadata', explanation: 'Status, timestamps, test counts', icon: '📊' },
    { title: 'Artifacts', explanation: 'Compiled binaries - go to object storage', icon: '📦' },
    { title: 'Build History', explanation: 'Track trends and failures over time', icon: '📈' },
  ],
};

const step3: GuidedStep = {
  id: 'google-ci-step-3',
  stepNumber: 3,
  frIndex: 2,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-3: View build and test results (now persistent!)',
    taskDescription: 'Add a Database and connect the Build Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store build metadata, test results, history', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'Build Server connected to Database',
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
    level2: 'Click Build Server, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Object Storage for Artifacts
// =============================================================================

const step4Story: StoryContent = {
  emoji: '📦',
  scenario: "Your database is exploding! Developers are storing 10 GB build artifacts in the DB.",
  hook: "Storage costs are $50,000/month and growing. Queries are slow because of huge rows.",
  challenge: "Add object storage to efficiently store build artifacts and binaries.",
  illustration: 'storage-crisis',
};

const step4Celebration: CelebrationContent = {
  emoji: '☁️',
  message: 'Artifacts now stored efficiently!',
  achievement: 'Object storage handles large binaries and containers',
  metrics: [
    { label: 'Database size', before: '10TB', after: '100GB' },
    { label: 'Storage cost', before: '$50K/mo', after: '$5K/mo' },
  ],
  nextTeaser: "But we're still rebuilding everything from scratch...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Artifact Storage: Content-Addressable Storage',
  conceptExplanation: `Build artifacts are **large, immutable binaries**. They don't belong in a database!

**Object Storage (S3, GCS)** is perfect because:
- **Content-addressable**: Store by SHA-256 hash
- **Immutable**: Artifacts never change
- **Cheap**: $0.023/GB vs $0.30/GB for database
- **Scalable**: Unlimited storage
- **Deduplication**: Same artifact stored once

**How it works:**
1. Build produces artifact (e.g., server.bin)
2. Compute SHA-256 hash
3. Store in S3 at path: \`artifacts/{hash[:2]}/{hash[2:]}\`
4. Database stores only the hash reference
5. On deploy, fetch artifact from S3 by hash

**Content-addressable = Same artifact stored once across all builds!**`,

  whyItMatters: 'At 50M builds/day × 100MB average, you generate 5 PB/day of artifacts. Object storage is 10x cheaper!',

  famousIncident: {
    title: 'npm Registry Outage',
    company: 'npm',
    year: '2019',
    whatHappened: 'Artifact storage ran out of space. npm registry went down for 4 hours. Millions of builds failed worldwide. No one could install packages.',
    lessonLearned: 'Artifact storage is critical infrastructure. Must be highly available and scalable.',
    icon: '📦',
  },

  realWorldExample: {
    company: 'Google',
    scenario: 'Storing exabytes of build artifacts',
    howTheyDoIt: 'Custom content-addressable storage with aggressive deduplication and compression',
  },

  diagram: `
Build Complete
   │
   ▼
┌─────────────┐
│Build Server │
└──────┬──────┘
       │
       ├──────▶ Database (store hash + metadata)
       │
       └──────▶ Object Storage (store artifact by hash)
                S3: artifacts/ab/cdef123456...

Deploy
   │
   ▼
┌─────────────┐
│Build Server │
└──────┬──────┘
       │
       ├──────▶ Database (get hash)
       │
       └──────▶ Object Storage (fetch artifact)
`,

  keyPoints: [
    'Store artifacts in object storage, not database',
    'Use content-addressable storage (SHA-256 hash)',
    'Database stores only metadata and hash references',
    'Deduplication: Same artifact stored once',
    '10x cost savings vs database storage',
  ],

  quickCheck: {
    question: 'Why is content-addressable storage important for builds?',
    options: [
      'It\'s faster',
      'Same artifact stored once - massive deduplication',
      'It provides ACID guarantees',
      'It\'s easier to query',
    ],
    correctIndex: 1,
    explanation: 'Many builds produce identical artifacts. Content-addressable storage (by hash) means we store each unique artifact once.',
  },

  keyConcepts: [
    { title: 'Content-Addressable', explanation: 'Store by SHA-256 hash', icon: '🔑' },
    { title: 'Deduplication', explanation: 'Same artifact stored once', icon: '♻️' },
    { title: 'Immutable', explanation: 'Artifacts never change', icon: '🔒' },
  ],
};

const step4: GuidedStep = {
  id: 'google-ci-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from efficient artifact storage',
    taskDescription: 'Add Object Storage for build artifacts and binaries',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store build artifacts efficiently', displayName: 'Object Storage (S3)' },
    ],
    successCriteria: [
      'Object Storage component added',
      'Build Server connected to Object Storage',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Drag an Object Storage (S3) component onto the canvas',
    level2: 'Connect Build Server to Object Storage. Artifacts will be stored here.',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 5: Add Cache for Build Results
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🐌',
  scenario: "Developers are furious! Every build takes 20 minutes, even when nothing changed.",
  hook: "'Why am I recompiling code that hasn't changed in weeks?' demands a senior engineer.",
  challenge: "Add a cache to store build results and avoid redundant rebuilds.",
  illustration: 'slow-build',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Builds are 10x faster with caching!',
  achievement: 'Cache hit rate: 90%+',
  metrics: [
    { label: 'Build time', before: '20 min', after: '2 min' },
    { label: 'Cache hit rate', after: '92%' },
    { label: 'Compute cost', before: '100%', after: '10%' },
  ],
  nextTeaser: "But we need to handle massive build volume...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Build Caching: Never Rebuild the Same Thing Twice',
  conceptExplanation: `**Build caching** is the key to fast builds at scale.

**How it works:**
1. **Compute action hash** - Hash of inputs (source files, flags, dependencies)
2. **Check cache** - Look up result by action hash
3. **Cache hit?** - Return cached result (10x faster!)
4. **Cache miss?** - Execute build, store result in cache

**Hermetic builds enable caching:**
- Same inputs → same outputs (deterministic)
- No hidden dependencies (network, time, etc.)
- Results are safe to reuse

**Cache types:**
- **Local cache** - On developer's machine (~80% hit rate)
- **Remote cache** - Shared across all developers (~90% hit rate)

At Google: 90%+ cache hit rate = 10x speedup!`,

  whyItMatters: 'Without caching, monorepo builds would take hours. Caching makes 20-minute builds complete in 2 minutes.',

  famousIncident: {
    title: 'Bazel Cache Poisoning',
    company: 'Google',
    year: '2018',
    whatHappened: 'Non-hermetic build leaked environment variables into cached results. Developers started getting binaries with wrong config. Took days to debug and invalidate cache.',
    lessonLearned: 'Hermetic builds are critical for cache correctness. Any non-determinism poisons the cache.',
    icon: '☠️',
  },

  realWorldExample: {
    company: 'Google',
    scenario: 'Caching 150 million builds per day',
    howTheyDoIt: 'Massive distributed cache with content-addressable storage. 90%+ hit rate saves petabytes of compute.',
  },

  diagram: `
Build Request
   │
   ▼
┌─────────────┐
│Build Server │
└──────┬──────┘
       │
       ├──────▶ 1. Compute action hash (SHA-256 of inputs)
       │
       ├──────▶ 2. Check Cache
       │              │
       │              ├─ HIT (90%) → Return result instantly ✅
       │              │
       │              └─ MISS (10%) → Execute build
       │                               Store in cache
       │                               Return result
`,

  keyPoints: [
    'Cache stores build results keyed by action hash',
    'Action hash = hash of all inputs (code + dependencies + flags)',
    'Hermetic builds ensure cache correctness',
    'Remote cache shared across all developers',
    '90%+ cache hit rate = 10x speedup',
  ],

  quickCheck: {
    question: 'Why must builds be hermetic for caching to work correctly?',
    options: [
      'To make builds faster',
      'Same inputs must produce same outputs - enables safe reuse',
      'To save disk space',
      'To reduce network usage',
    ],
    correctIndex: 1,
    explanation: 'Non-hermetic builds (e.g., reading time or network) produce different outputs for same inputs. Caching their results would be incorrect!',
  },

  keyConcepts: [
    { title: 'Action Hash', explanation: 'SHA-256 of all build inputs', icon: '#️⃣' },
    { title: 'Cache Hit', explanation: 'Result found in cache - instant!', icon: '✅' },
    { title: 'Hermetic Build', explanation: 'Deterministic - enables caching', icon: '🔒' },
  ],
};

const step5: GuidedStep = {
  id: 'google-ci-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-4: Hermetic builds (now with caching!)',
    taskDescription: 'Add a Redis cache for build results',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache build results by action hash', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'Build Server connected to Cache',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect Build Server to Cache. This enables build result caching.',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 6: Add Load Balancer for High Availability
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔥',
  scenario: "Success! 10,000 developers are now using your build system!",
  hook: "But your single build server is hitting 100% CPU. Builds are queuing for minutes.",
  challenge: "Add a load balancer to distribute build requests across multiple servers.",
  illustration: 'server-overload',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'Build traffic is now distributed!',
  achievement: 'Load balancer spreads requests across servers',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Max throughput', before: '100 builds/min', after: '1000+ builds/min' },
  ],
  nextTeaser: "But build execution is still slow...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Horizontal Scaling',
  conceptExplanation: `A **Load Balancer** distributes build requests across multiple build servers.

For CI/CD systems:
- Distributes build submissions
- Routes API requests
- Handles health checks
- Enables horizontal scaling

Benefits:
- **No single point of failure**
- **Horizontal scaling** - add more servers for more capacity
- **Rolling deployments** - update servers one at a time`,

  whyItMatters: 'At peak, your system handles 1,800 builds/second. No single server can handle that!',

  famousIncident: {
    title: 'Travis CI Outage',
    company: 'Travis CI',
    year: '2019',
    whatHappened: 'Single master build server crashed. All builds queued. No failover configured. Downtime: 8 hours. Thousands of builds blocked.',
    lessonLearned: 'Load balancers and redundancy are essential for build system availability.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Google',
    scenario: 'Handling 1,800 builds/second at peak',
    howTheyDoIt: 'Multiple layers of load balancers distributing across thousands of build coordinators',
  },

  keyPoints: [
    'Load balancer distributes build requests',
    'Enables horizontal scaling (add more servers)',
    'Eliminates single point of failure',
    'Performs health checks on build servers',
  ],

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers for capacity', icon: '↔️' },
    { title: 'Health Checks', explanation: 'Monitor server availability', icon: '💓' },
  ],
};

const step6: GuidedStep = {
  id: 'google-ci-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add a Load Balancer between Client and Build Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute build traffic across servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to Build Server',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Load Balancer onto the canvas between Client and Build Server',
    level2: 'Reconnect: Client → Load Balancer → Build Server',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Worker Pool for Distributed Execution
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🏗️',
  scenario: "A developer triggers a build of the entire monorepo - 100,000 targets!",
  hook: "It's been running for 6 hours on a single machine and is only 30% done.",
  challenge: "Add a worker pool to execute build actions in parallel across many machines.",
  illustration: 'slow-execution',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Builds are massively parallel!',
  achievement: 'Worker pool executes 1000+ actions simultaneously',
  metrics: [
    { label: 'Full monorepo build', before: '20 hours', after: '45 minutes' },
    { label: 'Parallel actions', after: '1000+' },
  ],
  nextTeaser: "But test execution is still slow...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Remote Execution: Distributed Build Workers',
  conceptExplanation: `**Remote Execution** distributes build actions across a worker pool.

**How it works:**
1. **Build coordinator** (build server) analyzes build graph
2. **Action queue** - Queue of independent build actions
3. **Worker pool** - 100s-1000s of workers execute actions
4. **Results** - Workers store results in cache and object storage

**Key insight:** Most build actions are independent and can run in parallel!

Example: Building 1000 source files
- Sequential: 1000 × 10 sec = 10,000 sec (2.7 hours)
- Parallel (100 workers): 1000 ÷ 100 × 10 sec = 100 sec (1.6 min)

**Requirements:**
- Hermetic builds (workers must produce identical results)
- Content-addressable storage (workers share inputs/outputs)
- Task queue (distribute work to workers)`,

  whyItMatters: 'Google builds 100,000+ targets in under an hour using 10,000+ workers. Sequential would take weeks!',

  famousIncident: {
    title: 'Chromium Build Time Explosion',
    company: 'Google',
    year: '2015',
    whatHappened: 'Before distributed execution, full Chromium builds took 4+ hours. Developers would start builds and go to lunch. Productivity tanked.',
    lessonLearned: 'With distributed execution (Goma), Chromium builds dropped to 8 minutes. 30x speedup!',
    icon: '⚡',
  },

  realWorldExample: {
    company: 'Google',
    scenario: 'Executing 4 billion test cases per day',
    howTheyDoIt: 'Distributed worker pool with 100,000+ machines executing build and test actions in parallel',
  },

  diagram: `
Build Request
   │
   ▼
┌─────────────────┐
│ Build Server    │ ── Analyze build graph
│ (Coordinator)   │ ── Create action queue
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│      Message Queue                  │
│  [action1, action2, ..., actionN]   │
└────────┬────────────────────────────┘
         │
         ├──────┬──────┬──────┬──────┐
         │      │      │      │      │
         ▼      ▼      ▼      ▼      ▼
      Worker Worker Worker ... Worker
         │      │      │            │
         └──────┴──────┴──────┬─────┘
                              │
                              ▼
                       Cache + Object Storage
`,

  keyPoints: [
    'Build server analyzes graph, creates action queue',
    'Workers pull actions from queue and execute',
    'Hermetic builds ensure workers produce identical results',
    'Results stored in shared cache',
    '100x-1000x parallelism possible',
  ],

  quickCheck: {
    question: 'Why do builds need to be hermetic for remote execution?',
    options: [
      'To make builds faster',
      'Workers must produce identical results regardless of which machine runs them',
      'To save memory',
      'To reduce network usage',
    ],
    correctIndex: 1,
    explanation: 'Non-hermetic builds depend on machine state (OS, time, network). Different workers would produce different results!',
  },

  keyConcepts: [
    { title: 'Remote Execution', explanation: 'Run build actions on worker pool', icon: '☁️' },
    { title: 'Action Queue', explanation: 'Queue of independent build actions', icon: '📋' },
    { title: 'Worker Pool', explanation: '100s-1000s of parallel workers', icon: '👷' },
  ],
};

const step7: GuidedStep = {
  id: 'google-ci-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from distributed execution',
    taskDescription: 'Add a Message Queue and Worker Pool for distributed builds',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Queue build actions for workers', displayName: 'Message Queue' },
    ],
    successCriteria: [
      'Message Queue component added',
      'Build Server connected to Message Queue',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue (RabbitMQ/Kafka) component onto the canvas',
    level2: 'Connect Build Server to Message Queue. This enables distributed execution.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Add CDN for Fast Artifact Downloads
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🌍',
  scenario: "You've expanded globally! Developers in Asia, Europe, and US.",
  hook: "Asian developers complain: 'Downloading artifacts from US takes 10 minutes!'",
  challenge: "Add a CDN to serve artifacts from edge locations near developers.",
  illustration: 'global-latency',
};

const step8Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Artifacts served from edge locations!',
  achievement: 'Global developers get fast artifact downloads',
  metrics: [
    { label: 'Download time (Asia)', before: '10 min', after: '30 sec' },
    { label: 'Cache hit rate (edge)', after: '85%' },
  ],
  nextTeaser: "But we need smart test selection to speed up pre-submits...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'CDN: Global Artifact Distribution',
  conceptExplanation: `A **CDN (Content Delivery Network)** caches artifacts at edge locations worldwide.

**For CI/CD systems:**
- Cache build artifacts near developers
- Serve from closest edge location
- Reduce cross-continental transfers

**How it works:**
1. Developer requests artifact
2. CDN checks edge cache
3. **Cache hit?** Serve from edge (fast!)
4. **Cache miss?** Fetch from origin (S3), cache at edge, serve

**Benefits:**
- 10x faster downloads (30 sec vs 10 min)
- Reduces origin load
- Handles traffic spikes`,

  whyItMatters: 'Downloading a 2 GB container from across the world is slow. CDN makes it 10x faster.',

  realWorldExample: {
    company: 'Google',
    scenario: 'Serving artifacts to developers worldwide',
    howTheyDoIt: 'Global network of artifact caches with regional storage',
  },

  keyPoints: [
    'CDN caches artifacts at edge locations',
    'Serves from nearest location to developer',
    'Reduces artifact download time 10x',
    'Handles cache invalidation when artifacts change',
  ],

  keyConcepts: [
    { title: 'Edge Cache', explanation: 'Cache near users worldwide', icon: '🌍' },
    { title: 'Origin', explanation: 'Source of truth (S3)', icon: '🏠' },
    { title: 'Cache Miss', explanation: 'Fetch from origin, cache at edge', icon: '↓' },
  ],
};

const step8: GuidedStep = {
  id: 'google-ci-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from fast artifact distribution',
    taskDescription: 'Add a CDN for global artifact caching',
    componentsNeeded: [
      { type: 'cdn', reason: 'Cache artifacts at edge locations', displayName: 'CDN' },
    ],
    successCriteria: [
      'CDN component added',
      'Client connected to CDN',
      'CDN connected to Object Storage (origin)',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a CDN component onto the canvas',
    level2: 'Connect Client → CDN → Object Storage. CDN will cache artifacts.',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'object_storage' },
    ],
  },
};

// =============================================================================
// STEP 9: Implement Smart Test Selection
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🧪',
  scenario: "Pre-submit checks are taking 15 minutes! Developers are waiting forever to merge code.",
  hook: "'I changed one line and you're running 50,000 tests?' complains a frustrated developer.",
  challenge: "Implement smart test selection - only run tests affected by code changes.",
  illustration: 'slow-tests',
};

const step9Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Pre-submit checks are lightning fast!',
  achievement: 'Smart test selection runs only affected tests',
  metrics: [
    { label: 'Pre-submit time', before: '15 min', after: '3 min' },
    { label: 'Tests run', before: '50,000', after: '2,000' },
    { label: 'Developer happiness', after: 'High!' },
  ],
  nextTeaser: "One final challenge: deployment pipelines...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Smart Test Selection: Only Test What Changed',
  conceptExplanation: `**Smart Test Selection** analyzes code changes and runs only affected tests.

**How it works:**
1. **Analyze diff** - What files changed?
2. **Build dependency graph** - What depends on changed files?
3. **Find affected tests** - Which tests cover affected code?
4. **Run minimal set** - Only run affected tests

**Example:**
- Change: \`src/auth/login.py\`
- Affected: \`src/auth/*\`, \`src/api/users.py\`
- Tests: Run 200 auth tests, skip 49,800 others
- Result: 3 min instead of 15 min

**Techniques:**
- **Code coverage** - Track which tests cover which code
- **Dependency analysis** - Build graph of code dependencies
- **Test impact analysis** - Historical data on test failures

At Google: Reduces pre-submit time from 30 min → 5 min!`,

  whyItMatters: 'Developers wait for pre-submit checks before merging. 5 min vs 30 min = 6x velocity improvement!',

  famousIncident: {
    title: 'Facebook Test Selection Bug',
    company: 'Facebook',
    year: '2017',
    whatHappened: 'Test selection algorithm had a bug - skipped critical tests. Bad code got merged. Production outage. Had to run full test suite on every commit for 2 weeks while fixing the bug.',
    lessonLearned: 'Test selection must be conservative - better to run extra tests than skip critical ones.',
    icon: '🐛',
  },

  realWorldExample: {
    company: 'Google',
    scenario: 'Running only affected tests on pre-submit',
    howTheyDoIt: 'Combines code coverage, dependency analysis, and ML to predict affected tests. 85% reduction in test time.',
  },

  diagram: `
Code Change: auth/login.py
   │
   ▼
Dependency Analysis
   │
   ├─ Direct deps: auth/*, api/users.py
   ├─ Transitive deps: api/*, web/login_page.py
   │
   ▼
Test Impact Analysis
   │
   ├─ Affected: auth_tests (200 tests)
   ├─ Affected: api_tests (500 tests)
   ├─ Affected: web_tests (300 tests)
   │
   ├─ Skip: backend_tests (10,000 tests)
   ├─ Skip: data_tests (20,000 tests)
   │
   ▼
Run 1,000 tests instead of 50,000
Result: 3 min instead of 15 min ✅
`,

  keyPoints: [
    'Analyze code changes to find affected code',
    'Use dependency graph to find transitive dependencies',
    'Run only tests that cover affected code',
    'Be conservative - better to run extra tests than skip critical ones',
    'Reduces pre-submit time 5x-10x',
  ],

  quickCheck: {
    question: 'Why is smart test selection safe for hermetic tests?',
    options: [
      'It\'s faster',
      'Hermetic tests have no hidden dependencies - if code didn\'t change, test result won\'t change',
      'It uses less memory',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Hermetic tests depend ONLY on their declared inputs. If those inputs didn\'t change, the test result is guaranteed to be the same (and cached).',
  },

  keyConcepts: [
    { title: 'Test Impact Analysis', explanation: 'Which tests are affected by changes', icon: '🎯' },
    { title: 'Dependency Graph', explanation: 'What code depends on what', icon: '📊' },
    { title: 'Code Coverage', explanation: 'Which tests cover which code', icon: '📈' },
  ],
};

const step9: GuidedStep = {
  id: 'google-ci-step-9',
  stepNumber: 9,
  frIndex: 5,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-6: Smart test selection (only run affected tests)',
    taskDescription: 'Update Build Server code to implement test selection logic',
    successCriteria: [
      'Click on Build Server',
      'Open Python tab',
      'Implement select_affected_tests() function',
      'Use dependency graph to find affected tests',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click Build Server, go to Python tab',
    level2: 'Implement select_affected_tests() to analyze dependencies and select minimal test set',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 10: Implement Deployment Pipeline
// =============================================================================

const step10Story: StoryContent = {
  emoji: '🚀',
  scenario: "Your CI/CD system is amazing! But deployments are still manual and risky.",
  hook: "Last week, a bad deploy took down production for 2 hours. You need automated, safe deployments.",
  challenge: "Implement a deployment pipeline with progressive rollouts and automatic rollback.",
  illustration: 'deployment',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a Google-style CI/CD platform!',
  achievement: 'A complete build system with hermetic builds, caching, and safe deployments',
  metrics: [
    { label: 'Build time', after: '< 2 min' },
    { label: 'Pre-submit time', after: '< 5 min' },
    { label: 'Cache hit rate', after: '90%+' },
    { label: 'Deployment safety', after: 'Progressive rollouts' },
    { label: 'Availability', after: '99.9%' },
  ],
  nextTeaser: "You've mastered CI/CD system design at Google scale!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Deployment Pipelines: Safe Production Rollouts',
  conceptExplanation: `A **deployment pipeline** safely rolls out code to production.

**Progressive Rollout Strategy:**
1. **Build** - Create deployable artifact
2. **Canary** - Deploy to 1% of servers, monitor metrics
3. **Staged rollout** - 10% → 25% → 50% → 100%
4. **Monitor** - Track error rates, latency, success metrics
5. **Auto-rollback** - If metrics degrade, rollback automatically

**Key Metrics to Monitor:**
- Error rate (5xx responses)
- Latency (p50, p99)
- Success rate
- Custom business metrics

**Rollback Triggers:**
- Error rate increases >2x
- p99 latency increases >50%
- Success rate drops >5%

**Why Progressive?**
- Limits blast radius (1% vs 100%)
- Catches issues before full rollout
- Enables safe experimentation`,

  whyItMatters: 'Bad deployments can take down production. Progressive rollouts catch issues early and minimize impact.',

  famousIncident: {
    title: 'Knight Capital Deployment Disaster',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'Deployed new trading software to 8 servers. Missed 1 server. Old code on that server had opposite trading logic. Lost $440M in 45 minutes due to conflicting trades.',
    lessonLearned: 'Atomic deployments are critical. All servers must run the same version. Progressive rollouts would have caught this in the canary phase.',
    icon: '💸',
  },

  realWorldExample: {
    company: 'Google',
    scenario: 'Deploying code thousands of times per day',
    howTheyDoIt: 'Automated progressive rollouts with canary analysis. Auto-rollback on metric degradation. Zero-touch deployments.',
  },

  diagram: `
Deployment Pipeline
   │
   ▼
┌─────────────────────────────────────────────────┐
│ 1. Build Artifact (from commit SHA)            │
│    ├─ Run tests                                │
│    ├─ Create container image                   │
│    └─ Push to artifact registry                │
└────────────┬────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────┐
│ 2. Canary Deployment (1% of servers)           │
│    ├─ Deploy to 1% of prod servers             │
│    ├─ Monitor metrics for 30 min               │
│    └─ Compare: canary vs baseline              │
└────────────┬────────────────────────────────────┘
             │
             ├─ Metrics Good? ──▶ Continue
             │
             └─ Metrics Bad? ──▶ Auto-Rollback ❌
             │
             ▼
┌─────────────────────────────────────────────────┐
│ 3. Progressive Rollout                         │
│    ├─ 10% (30 min soak)                        │
│    ├─ 25% (30 min soak)                        │
│    ├─ 50% (1 hour soak)                        │
│    └─ 100% (full rollout) ✅                   │
└─────────────────────────────────────────────────┘
`,

  keyPoints: [
    'Progressive rollout: 1% → 10% → 50% → 100%',
    'Monitor metrics at each stage (errors, latency)',
    'Auto-rollback if metrics degrade',
    'Limits blast radius of bad deployments',
    'Enables safe, frequent deployments',
  ],

  quickCheck: {
    question: 'Why start with 1% canary instead of deploying to 100% immediately?',
    options: [
      'To save money',
      'Catches issues early - only 1% of users affected instead of 100%',
      'To make deployments slower',
      'It uses less bandwidth',
    ],
    correctIndex: 1,
    explanation: 'If the deployment is bad, only 1% of users are affected. You catch the issue and rollback before it impacts everyone.',
  },

  keyConcepts: [
    { title: 'Canary Deployment', explanation: 'Deploy to small % first', icon: '🐤' },
    { title: 'Progressive Rollout', explanation: 'Gradually increase %', icon: '📈' },
    { title: 'Auto-Rollback', explanation: 'Revert if metrics degrade', icon: '↩️' },
  ],
};

const step10: GuidedStep = {
  id: 'google-ci-step-10',
  stepNumber: 10,
  frIndex: 4,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'FR-5: Deployment pipelines (progressive rollouts)',
    taskDescription: 'Update Build Server code to implement deployment pipeline logic',
    successCriteria: [
      'Click on Build Server',
      'Open Python tab',
      'Implement deploy_progressive() function',
      'Handle canary analysis and rollback logic',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'database', 'object_storage', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click Build Server, go to Python tab',
    level2: 'Implement deploy_progressive() with canary → staged rollout → monitoring → auto-rollback',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const l5DevprodGoogleCiGuidedTutorial: GuidedTutorial = {
  problemId: 'l5-devprod-google-ci',
  title: 'Design a Google-style CI/CD Platform',
  description: 'Build a scalable CI/CD system with hermetic builds, distributed execution, and smart test selection',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '🏗️',
    hook: "You've been hired as Staff Engineer at Google!",
    scenario: "Your mission: Build Google's internal CI/CD platform that can handle 50,000 developers, 150 million builds per day, and the 2 billion line monorepo.",
    challenge: "Can you design a system with hermetic builds, distributed execution, and sub-5-minute pre-submit checks?",
  },

  requirementsPhase: googleCiRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  concepts: [
    'Build Systems',
    'Hermetic Builds',
    'Content-Addressable Storage',
    'Build Caching',
    'Remote Execution',
    'Distributed Testing',
    'Smart Test Selection',
    'Deployment Pipelines',
    'Progressive Rollouts',
    'Canary Deployments',
    'Artifact Management',
    'Monorepo Architecture',
  ],

  ddiaReferences: [
    'Chapter 1: Reliability (hermetic builds and reproducibility)',
    'Chapter 3: Storage and Retrieval (content-addressable storage)',
    'Chapter 6: Partitioning (distributed build execution)',
    'Chapter 11: Stream Processing (build action queues)',
  ],
};

export default l5DevprodGoogleCiGuidedTutorial;
