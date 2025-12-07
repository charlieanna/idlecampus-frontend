import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Game Asset CDN Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching game asset delivery through building
 * a CDN for game updates, patches, and downloadable content.
 *
 * Key Concepts:
 * - Large file distribution for games
 * - Delta patching and incremental updates
 * - Pre-loading and background downloads
 * - Peer-to-peer asset distribution
 * - Regional mirroring and edge optimization
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const gameAssetCdnRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a CDN for distributing game assets, patches, and updates",

  interviewer: {
    name: 'Sarah Martinez',
    role: 'Infrastructure Lead at MegaGames Studio',
    avatar: '🎮',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'asset-types',
      category: 'functional',
      question: "What types of assets does a game CDN need to deliver?",
      answer: "A game CDN handles several types of content:\n\n1. **Full game downloads** - Complete game installations (20-100GB)\n2. **Game patches** - Updates and bug fixes (100MB-5GB)\n3. **DLC (Downloadable Content)** - New content packs (1-20GB)\n4. **Asset packs** - Textures, models, audio files\n5. **Configuration files** - Game settings and metadata\n\nEach type has different priority and delivery requirements.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Game assets vary dramatically in size and update frequency",
    },
    {
      id: 'patch-distribution',
      category: 'functional',
      question: "How should game patches be distributed?",
      answer: "When we release a patch, millions of players need it simultaneously. We can't just replace entire 50GB game files. We need **delta patching** - only transmit the changed files or changed portions of files. This reduces a 50GB re-download to a 500MB patch.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Delta patching dramatically reduces bandwidth by sending only changes",
    },
    {
      id: 'regional-mirrors',
      category: 'functional',
      question: "Where are your players located geographically?",
      answer: "We have a global player base:\n- **North America**: 40% of players\n- **Europe**: 30% of players\n- **Asia**: 25% of players\n- **Other regions**: 5%\n\nWe need edge servers in all major regions to minimize download times and costs.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Global distribution requires regional edge locations",
    },
    {
      id: 'pre-loading',
      category: 'functional',
      question: "What about major game releases? Can we reduce launch day load?",
      answer: "Yes! We should support **pre-loading** - let players download the game before release day, but keep it locked until launch time. This distributes the download load over several days instead of one spike.",
      importance: 'important',
      revealsRequirement: 'FR-3',
      learningPoint: "Pre-loading smooths out traffic spikes and improves launch day experience",
    },
    {
      id: 'background-downloads',
      category: 'functional',
      question: "When should updates be downloaded?",
      answer: "Updates should download **in the background** when the game is not running. Players shouldn't have to wait for a 2GB patch when they want to play. Also support **scheduled downloads** during off-peak hours to optimize bandwidth.",
      importance: 'important',
      revealsRequirement: 'FR-3',
      learningPoint: "Background downloads improve user experience and distribute load",
    },
    {
      id: 'p2p-distribution',
      category: 'functional',
      question: "Can we use peer-to-peer to reduce CDN costs?",
      answer: "Absolutely! **Peer-to-peer distribution** (like BitTorrent) can offload 30-50% of traffic from CDN. Players with fast connections can help distribute patches to others. Blizzard Battle.net does this successfully.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "P2P can dramatically reduce CDN costs for large files",
    },
    {
      id: 'version-management',
      category: 'functional',
      question: "How do you handle multiple game versions?",
      answer: "We need to support multiple versions simultaneously:\n- **Latest stable** for most players\n- **Beta/PTR builds** for testers\n- **Legacy versions** for compatibility\n- **Rollback** capability if a patch has issues",
      importance: 'important',
      revealsRequirement: 'FR-2',
      learningPoint: "Version management is critical for game platforms",
    },
    {
      id: 'integrity-verification',
      category: 'functional',
      question: "How do we ensure downloaded files aren't corrupted?",
      answer: "Every file should have a **checksum** (SHA-256 hash). After downloading, verify the checksum. If it doesn't match, re-download that chunk. This prevents corrupted game files from causing crashes.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Checksums ensure data integrity for large downloads",
    },

    // SCALE & NFRs
    {
      id: 'throughput-concurrent',
      category: 'throughput',
      question: "How many concurrent downloads should we support?",
      answer: "During a major patch release, we see 5 million concurrent downloads globally. Each player downloading at 10 Mbps average.",
      importance: 'critical',
      calculation: {
        formula: "5M players × 10 Mbps = 50 Tbps",
        result: "50 Terabits/sec peak bandwidth requirement",
      },
      learningPoint: "Game patches create massive simultaneous traffic spikes",
    },
    {
      id: 'throughput-patch',
      category: 'throughput',
      question: "What's a typical patch size and frequency?",
      answer: "We release patches weekly. Typical patch is 500MB, major updates are 3-5GB. Players expect patches to download in under 5 minutes on a decent connection.",
      importance: 'critical',
      calculation: {
        formula: "500MB patch ÷ 5 min = 100 Mbps required speed",
        result: "Players need consistent 100+ Mbps download speeds",
      },
      learningPoint: "Fast patch downloads are critical for player satisfaction",
    },
    {
      id: 'latency-download',
      category: 'latency',
      question: "What download speed should players experience?",
      answer: "Players should get 80-90% of their ISP bandwidth. If they have 100 Mbps internet, they should see 80-90 Mbps downloads. This requires edge servers close to them.",
      importance: 'critical',
      learningPoint: "Proximity to edge servers directly impacts download speed",
    },
    {
      id: 'storage-requirement',
      category: 'payload',
      question: "How much storage is needed for all game assets?",
      answer: "Our game is 80GB installed. With multiple versions, beta builds, and patches, we need to store:\n- Current version: 80GB\n- 3 previous versions: 240GB\n- Beta/PTR: 80GB\n- Patches archive: 100GB\n\nTotal: ~500GB per game. We have 10 major titles = 5TB total.",
      importance: 'important',
      calculation: {
        formula: "10 games × 500GB = 5TB",
        result: "~5TB origin storage needed",
      },
      learningPoint: "Game assets consume massive storage",
    },
    {
      id: 'availability-requirement',
      category: 'availability',
      question: "What happens if the CDN goes down during a patch release?",
      answer: "Catastrophic! Millions of players can't update and play. We need 99.99% availability with automatic failover to backup regions.",
      importance: 'critical',
      learningPoint: "CDN availability directly impacts player experience",
    },
    {
      id: 'cost-optimization',
      category: 'cost',
      question: "What's the biggest cost concern?",
      answer: "CDN bandwidth costs! At 50 Tbps during patches, we're looking at millions in monthly costs. We need to optimize with P2P offloading, edge caching, and delta patches to stay profitable.",
      importance: 'critical',
      insight: "Bandwidth costs are the primary concern for game CDNs",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['asset-types', 'patch-distribution', 'throughput-concurrent', 'availability-requirement'],
  criticalFRQuestionIds: ['asset-types', 'patch-distribution', 'pre-loading', 'p2p-distribution'],
  criticalScaleQuestionIds: ['throughput-concurrent', 'throughput-patch', 'latency-download', 'storage-requirement'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Distribute game assets globally',
      description: 'Deliver full games, patches, and DLC to players worldwide',
      emoji: '🌍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Delta patching system',
      description: 'Transmit only changed files/portions to minimize bandwidth',
      emoji: '📊',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Pre-loading and background downloads',
      description: 'Download content before release and during off-peak hours',
      emoji: '⏰',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Peer-to-peer distribution',
      description: 'Leverage P2P to offload CDN bandwidth costs',
      emoji: '🔄',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '20M concurrent players',
    writesPerDay: 'Weekly patches',
    readsPerDay: '100M+ downloads during patch day',
    peakMultiplier: 10,
    readWriteRatio: '1000000:1',
    calculatedWriteRPS: { average: 1, peak: 10 },
    calculatedReadRPS: { average: 5000, peak: 50000 },
    maxPayloadSize: '~5GB per patch',
    storagePerRecord: '~500GB per game version',
    storageGrowthPerYear: '~10TB',
    redirectLatencySLA: 'p99 < 100ms',
    createLatencySLA: 'Download at 80% of ISP bandwidth',
  },

  architecturalImplications: [
    '✅ 50 Tbps peak → Multi-region CDN absolutely required',
    '✅ 500MB-5GB patches → Delta patching essential',
    '✅ Global players → Edge locations in NA, EU, Asia',
    '✅ 5M concurrent → Origin shield to protect origin',
    '✅ Cost optimization → P2P distribution to offload 30-50%',
    '✅ 99.99% uptime → Multi-region failover',
  ],

  outOfScope: [
    'Game streaming/cloud gaming',
    'In-game microtransactions',
    'Player authentication',
    'Anti-cheat systems',
    'Game save synchronization',
  ],

  keyInsight: "First, let's make it WORK. We'll build a basic system to upload and download game assets. Then we'll add CDN edge caching, delta patching, and P2P to make it FAST and COST-EFFECTIVE. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Origin Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🎮',
  scenario: "Welcome to MegaGames Studio! You're building a game asset delivery system.",
  hook: "Your first major title is launching next month. Players need to download the 80GB game files.",
  challenge: "Set up the basic flow so players' game launchers can request assets from your servers.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your game distribution system is online!',
  achievement: 'Players can now request game files from your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can serve assets', after: '✓' },
  ],
  nextTeaser: "But the server doesn't have anywhere to store 80GB games...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Game Launcher to Server',
  conceptExplanation: `Every game distribution system starts with a simple client-server architecture.

When a player clicks "Download Game":
1. Game launcher sends a request
2. Request reaches your **App Server** (game distribution service)
3. Server responds with game files

This is the simplest possible setup. It works for small scale, but we'll need to evolve it!`,

  whyItMatters: 'Without a server to coordinate downloads, there\'s no central point for players to get game files. This server will eventually coordinate CDN requests.',

  keyPoints: [
    'Game launcher is the client requesting files',
    'App server coordinates download requests',
    'This is just the foundation - we\'ll add storage and CDN next',
  ],

  keyConcepts: [
    { title: 'Game Launcher', explanation: 'Client application managing downloads', icon: '🎮' },
    { title: 'App Server', explanation: 'Origin server coordinating requests', icon: '🖥️' },
    { title: 'Request Flow', explanation: 'Client → Server → Files', icon: '📡' },
  ],
};

const step1: GuidedStep = {
  id: 'game-cdn-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up basic game asset delivery',
    taskDescription: 'Add a Client (game launcher) and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents the game launcher on player devices', displayName: 'Game Launcher' },
      { type: 'app_server', reason: 'Origin server handling download requests', displayName: 'Game Distribution Server' },
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
    level2: 'Click the Client, then click the App Server to create a connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Add Object Storage for Game Files
// =============================================================================

const step2Story: StoryContent = {
  emoji: '📦',
  scenario: "Your dev team just finished building the game - it's 80GB of assets!",
  hook: "You need to store game files, patches, and DLC somewhere. The app server's local disk can't handle terabytes of game data.",
  challenge: "Add object storage (S3) to store all game files, patches, and versions.",
  illustration: 'storage-needed',
};

const step2Celebration: CelebrationContent = {
  emoji: '☁️',
  message: 'Game files now have a scalable home!',
  achievement: 'Object storage handles unlimited game assets',
  metrics: [
    { label: 'Storage capacity', after: 'Unlimited (S3)' },
    { label: 'Game files stored', after: '5TB' },
  ],
  nextTeaser: "But players around the world are getting slow downloads...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage: Scalable Game Asset Repository',
  conceptExplanation: `**Object Storage** (like AWS S3) is perfect for game assets:

**Why Object Storage for games?**
- **Massive capacity**: Store petabytes of game files
- **Versioning**: Keep multiple game versions simultaneously
- **Durability**: 99.999999999% - your game files are safe
- **Cost-effective**: Pay per GB, much cheaper than block storage
- **HTTP access**: Serve files via URLs

**Game Asset Organization**:
\`\`\`
s3://game-assets/
  ├── games/
  │   ├── awesome-shooter/v1.0/...  (80GB)
  │   ├── awesome-shooter/v1.1/...  (80GB)
  │   └── awesome-shooter/beta/...  (80GB)
  ├── patches/
  │   ├── v1.0-to-v1.1.patch       (500MB)
  │   └── v1.1-to-v1.2.patch       (800MB)
  └── dlc/
      ├── expansion-1/...           (15GB)
      └── expansion-2/...           (20GB)
\`\`\`

**Architecture**:
- **App Server**: Coordinates download requests, generates signed URLs
- **Object Storage**: Stores actual game files
- **Players**: Download files via CDN (we'll add this next!)`,

  whyItMatters: 'Game files are huge (50-100GB) and you need multiple versions. Object storage provides infinite scalability at reasonable cost.',

  realWorldExample: {
    company: 'Epic Games (Fortnite)',
    scenario: 'Storing game builds and patches',
    howTheyDoIt: 'Uses AWS S3 to store all Fortnite versions and patches globally. Each patch (~1-3GB) is stored and distributed via CloudFront CDN.',
  },

  keyPoints: [
    'Object storage for files, app server for coordination',
    'S3 provides versioning for multiple game builds',
    'Can store unlimited game assets',
    'Forms the "origin" that CDN will cache from',
  ],

  diagram: `
┌────────────┐   request    ┌─────────────┐   fetch   ┌────────────┐
│   Game     │ ───────────→ │    Game     │ ────────→ │  S3 Bucket │
│  Launcher  │              │Distribution │           │   (Games)  │
└────────────┘              │   Server    │           └────────────┘
                            └─────────────┘
                                   ↓
                          Return game files to player
`,

  keyConcepts: [
    { title: 'Object Storage', explanation: 'S3-like storage for massive files', icon: '📦' },
    { title: 'Versioning', explanation: 'Keep multiple game versions', icon: '🔢' },
    { title: 'Origin', explanation: 'Source of truth for game files', icon: '🎯' },
  ],

  quickCheck: {
    question: 'Why use object storage instead of the app server\'s disk?',
    options: [
      'Object storage is faster',
      'App servers are for compute, not storing terabytes of game files',
      'Object storage is required for CDN',
      'It\'s free',
    ],
    correctIndex: 1,
    explanation: 'App servers are stateless and designed for processing requests, not storing petabytes of game files. Object storage is purpose-built for massive file storage.',
  },
};

const step2: GuidedStep = {
  id: 'game-cdn-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Store game assets in scalable storage',
    taskDescription: 'Add Object Storage and connect the Distribution Server to it',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store game files, patches, and DLC', displayName: 'S3 Game Assets' },
    ],
    successCriteria: [
      'Object Storage component added',
      'Distribution Server connected to Object Storage',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Drag Object Storage (S3) onto the canvas',
    level2: 'Connect Distribution Server to Object Storage - this is where game files live',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 3: Add CDN for Global Edge Caching
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🌍',
  scenario: "Launch day! Players in Europe and Asia are complaining about slow downloads.",
  hook: "A player in Tokyo is downloading from your US-based S3 bucket at 5 Mbps - it'll take 36 hours to download an 80GB game! The internet latency and distance are killing download speeds.",
  challenge: "Add a CDN with global edge locations to cache game files close to players.",
  illustration: 'global-latency',
};

const step3Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Players worldwide now get fast downloads!',
  achievement: 'CDN edge caching brings content close to players',
  metrics: [
    { label: 'Download speed (Tokyo)', before: '5 Mbps', after: '95 Mbps' },
    { label: 'Download time (80GB)', before: '36 hours', after: '2 hours' },
    { label: 'Cache hit rate', after: '92%' },
  ],
  nextTeaser: "But patch releases still hammer the origin server...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'CDN: The Backbone of Game Distribution',
  conceptExplanation: `A **CDN** (Content Delivery Network) is ESSENTIAL for game distribution.

**Why CDN is critical for games**:

**Without CDN**:
- Player in Tokyo → US S3 bucket: 200ms latency per request
- TCP congestion over long distance
- Download speed: 5-10 Mbps
- 80GB game: 18-36 hours 😱

**With CDN**:
- Player in Tokyo → CDN edge in Tokyo: 10ms latency
- Short distance, no congestion
- Download speed: 80-100 Mbps (90% of ISP bandwidth)
- 80GB game: 2 hours ✨

**How it works for games**:
1. Player in Tokyo requests game file
2. Request goes to nearest CDN edge (Tokyo)
3. **Cache HIT**: Edge has it → stream at full speed
4. **Cache MISS**: Edge fetches from origin → cache it → stream
5. Next player in Tokyo gets cached version (HIT)

**Popular game CDNs**:
- **AWS CloudFront**: Used by Epic Games, Riot Games
- **Akamai**: Used by Sony PlayStation
- **Fastly**: Used by many indie game studios
- **Custom**: Steam runs its own CDN with 300+ edge locations

**Game-specific optimizations**:
- **Chunked downloads**: Split files into chunks for resumability
- **Range requests**: Support partial file downloads
- **Compression**: Gzip/Brotli for text files, but not already-compressed assets`,

  whyItMatters: 'Without CDN, international players get terrible download speeds. With CDN, everyone gets fast downloads regardless of location.',

  famousIncident: {
    title: 'WoW: Warlords of Draenor Launch',
    company: 'Blizzard',
    year: '2014',
    whatHappened: 'World of Warcraft expansion launch caused massive CDN strain. Millions tried downloading simultaneously. Even with Blizzard\'s robust CDN, some players experienced degraded speeds.',
    lessonLearned: 'Pre-loading before launch day is critical. Blizzard now allows pre-download days before expansion launches.',
    icon: '🎮',
  },

  realWorldExample: {
    company: 'Riot Games (League of Legends)',
    scenario: 'Patch distribution to 100M+ players',
    howTheyDoIt: 'Uses CloudFront with 100+ edge locations. Each patch (~200MB) is cached at edges. Achieves 95%+ cache hit rate by pre-warming edges.',
  },

  diagram: `
Player in Tokyo:
┌────────────┐   95 Mbps   ┌──────────────┐
│   Game     │◀───────────▶│ CDN Edge     │  ← Cache HIT (92%)
│  Launcher  │             │  (Tokyo)     │
└────────────┘             └──────┬───────┘
                                  │
                                  │ Cache MISS (8%)
                                  │ Fetch from origin
                                  ▼
                           ┌──────────────┐
                           │   Origin     │
                           │   Server     │
                           │   (US-East)  │
                           └──────┬───────┘
                                  │
                                  ▼
                           ┌──────────────┐
                           │  S3 Bucket   │
                           │ (Game Files) │
                           └──────────────┘
`,

  keyPoints: [
    'CDN brings game files close to players worldwide',
    'Download speed improves 10-20x with CDN',
    'Cache HIT = fast download from nearby edge',
    'Cache MISS = fetch from origin, then cache',
    'Game CDNs handle massive files (50-100GB)',
  ],

  quickCheck: {
    question: 'Why does CDN dramatically improve game download speeds?',
    options: [
      'CDN has faster servers',
      'CDN compresses game files',
      'CDN edge servers are geographically close to players',
      'CDN uses better network protocols',
    ],
    correctIndex: 2,
    explanation: 'Geography matters! A CDN edge in Tokyo is 10ms away from a Tokyo player, while US origin is 200ms away. Proximity eliminates latency and congestion.',
  },

  keyConcepts: [
    { title: 'Edge Location', explanation: 'CDN server in player\'s region', icon: '📍' },
    { title: 'Cache Hit', explanation: 'File found in edge cache', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Must fetch from origin', icon: '❌' },
    { title: 'Range Request', explanation: 'Download partial file ranges', icon: '📊' },
  ],
};

const step3: GuidedStep = {
  id: 'game-cdn-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1: Distribute game assets globally via CDN',
    taskDescription: 'Add CDN and rewire connections for edge caching',
    componentsNeeded: [
      { type: 'cdn', reason: 'Cache game files at global edge locations', displayName: 'Game CDN' },
    ],
    successCriteria: [
      'CDN component added',
      'Game Launcher connected to CDN',
      'CDN connected to Object Storage (origin)',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'app_server', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Add CDN component and rewire: Game Launcher → CDN → Origin',
    level2: 'CDN sits between launcher and origin. Launcher connects to CDN, CDN connects to Object Storage.',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'object_storage' },
    ],
  },
};

// =============================================================================
// STEP 4: Implement Delta Patching System
// =============================================================================

const step4Story: StoryContent = {
  emoji: '📊',
  scenario: "You just released a hotfix patch. It changes 3 files in the game.",
  hook: "But players are re-downloading the entire 80GB game! A 2MB code change shouldn't require 80GB download. Your CDN bandwidth bill just hit $500K!",
  challenge: "Implement delta patching - only transmit changed files/portions.",
  illustration: 'bandwidth-spike',
};

const step4Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Delta patching is working!',
  achievement: 'Patches now transmit only changes, not full files',
  metrics: [
    { label: 'Patch size', before: '80GB', after: '500MB' },
    { label: 'Download time', before: '2 hours', after: '3 minutes' },
    { label: 'Bandwidth costs', before: '$500K', after: '$3K' },
  ],
  nextTeaser: "But major patch releases still cause massive traffic spikes...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Delta Patching: The Secret to Efficient Updates',
  conceptExplanation: `**Delta patching** is how modern games update without re-downloading everything.

**The Problem**:
- Your game is 80GB
- A bug fix changes 3 files (2MB total)
- Without delta: players re-download all 80GB 😱
- With 5M players: 400 PB bandwidth! Bankruptcy!

**The Solution - Delta Patching**:
Only transmit the CHANGES between versions.

**How it works**:

**1. File-level delta**:
\`\`\`
Old version: file1.dat (500MB), file2.dat (300MB), file3.dat (200MB)
New version: file1.dat (500MB), file2.dat (310MB), file3.dat (200MB)

Delta: Only send new file2.dat (310MB)
Savings: 690MB → 310MB (55% reduction)
\`\`\`

**2. Binary diff (better!)**:
\`\`\`
Use binary diff algorithm (like bsdiff, xdelta):
- Compare old file2.dat vs new file2.dat byte-by-byte
- Generate patch file containing only CHANGES
- Patch file might be just 2MB!

Savings: 310MB → 2MB (99% reduction!)
\`\`\`

**Delta Patching Flow**:
1. Player has game v1.0 installed
2. Server announces v1.1 available
3. Launcher calculates: "I have v1.0, need v1.1"
4. Downloads patch file: "v1.0-to-v1.1.patch" (500MB)
5. Applies patch to local files
6. Verifies checksums
7. Now has v1.1 installed!

**Implementation**:
- **Metadata service**: Tracks versions, available patches
- **Patch generation**: Pre-compute patches for all version combinations
- **Storage**: Store patches in S3 alongside full versions
- **Checksum verification**: SHA-256 before and after patching

**Real-world example - Chrome browser**:
Chrome updates ~weekly. Uses Courgette binary diff algorithm.
Update size: ~10MB instead of 100MB (90% reduction)`,

  whyItMatters: 'Delta patching reduces bandwidth costs by 80-99% and dramatically improves user experience. Players can patch in minutes instead of hours.',

  realWorldExample: {
    company: 'World of Warcraft',
    scenario: 'Weekly hotfixes and patches',
    howTheyDoIt: 'Blizzard uses CASC (Content Addressable Storage Container) with block-level delta compression. Patches typically 100-500MB instead of re-downloading 50GB game.',
  },

  famousIncident: {
    title: 'Call of Duty: Modern Warfare Patch Sizes',
    company: 'Activision',
    year: '2020',
    whatHappened: 'CoD MW patches were 30-50GB each, requiring players to re-download huge portions. Players with data caps or slow internet couldn\'t play. Community outcry was massive.',
    lessonLearned: 'Efficient delta patching is not optional - it\'s required for player retention. Activision overhauled their patching system to reduce sizes by 70%.',
    icon: '🎮',
  },

  diagram: `
Traditional Update (NO DELTA):
┌──────────┐
│  Player  │  Downloads entire game: 80GB
│  v1.0    │  ────────────────────────────→  Takes 2 hours
└──────────┘

Delta Patching:
┌──────────┐
│  Player  │  Downloads only changes: 500MB
│  v1.0    │  ────────────────────────────→  Takes 3 minutes!
└──────────┘  Applies patch to local files
              ↓
          ┌──────────┐
          │  Player  │
          │  v1.1    │
          └──────────┘

Patch Generation (Server-side):
┌────────────┐                    ┌────────────┐
│  Game v1.0 │                    │  Game v1.1 │
│   (80GB)   │                    │   (80GB)   │
└─────┬──────┘                    └─────┬──────┘
      │                                 │
      └─────────┐         ┌─────────────┘
                ▼         ▼
          ┌──────────────────┐
          │  Binary Diff     │
          │  Algorithm       │
          └────────┬─────────┘
                   ▼
          ┌──────────────────┐
          │ Patch v1.0→v1.1  │
          │     (500MB)      │
          └──────────────────┘
`,

  keyPoints: [
    'Delta patching transmits only changes, not full files',
    'Reduces bandwidth by 80-99%',
    'Two approaches: file-level delta or binary diff',
    'Binary diff is more efficient but complex',
    'Pre-compute patches for common version paths',
    'Always verify checksums after patching',
  ],

  quickCheck: {
    question: 'If 5M players need to update from v1.0 to v1.1, what\'s the bandwidth saving?',
    options: [
      'No saving - same data transmitted',
      'Saves ~399 PB (80GB → 500MB per player)',
      'Saves 50% of bandwidth',
      'Only saves bandwidth for slow connections',
    ],
    correctIndex: 1,
    explanation: '5M × (80GB - 0.5GB) = 397.5 PB saved! Delta patching transforms your economics.',
  },

  keyConcepts: [
    { title: 'Delta Patch', explanation: 'File containing only changes', icon: '📊' },
    { title: 'Binary Diff', explanation: 'Byte-level comparison algorithm', icon: '🔬' },
    { title: 'Checksum', explanation: 'SHA-256 hash to verify integrity', icon: '✅' },
    { title: 'Patch Chain', explanation: 'v1.0→v1.1→v1.2 path', icon: '⛓️' },
  ],
};

const step4: GuidedStep = {
  id: 'game-cdn-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Implement delta patching to minimize bandwidth',
    taskDescription: 'Add Queue for patch generation and computation',
    componentsNeeded: [
      { type: 'queue', reason: 'Process patch generation jobs asynchronously', displayName: 'Patch Generation Queue' },
    ],
    successCriteria: [
      'Queue component added for patch processing',
      'App Server connected to Queue',
      'Architecture supports delta patch workflow',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'app_server', 'object_storage', 'queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'queue' },
    ],
  },

  hints: {
    level1: 'Add a Queue component for asynchronous patch generation',
    level2: 'Connect App Server to Queue - this handles patch computation jobs in the background',
    solutionComponents: [{ type: 'queue' }],
    solutionConnections: [{ from: 'app_server', to: 'queue' }],
  },
};

// =============================================================================
// STEP 5: Add Pre-loading System
// =============================================================================

const step5Story: StoryContent = {
  emoji: '⏰',
  scenario: "Your next major expansion launches Friday at midnight. 5M players will try downloading simultaneously.",
  hook: "If all 5M players download 15GB at launch, that's 75 Petabytes at once! Your CDN will melt. Launch will be a disaster!",
  challenge: "Implement pre-loading - let players download early, unlock at launch time.",
  illustration: 'traffic-spike',
};

const step5Celebration: CelebrationContent = {
  emoji: '📅',
  message: 'Pre-loading is smoothing launch day traffic!',
  achievement: 'Downloads spread over days instead of one spike',
  metrics: [
    { label: 'Peak bandwidth', before: '75 PB/hour', after: '5 PB/hour' },
    { label: 'Download window', before: '1 hour', after: '3 days' },
    { label: 'CDN cost', before: '$800K', after: '$100K' },
    { label: 'Players ready at launch', after: '95%' },
  ],
  nextTeaser: "But bandwidth costs are still high. Can we reduce CDN load?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Pre-loading: Smoothing Launch Day Spikes',
  conceptExplanation: `**Pre-loading** lets players download content before it's accessible.

**The Problem - Launch Day Spike**:
\`\`\`
Midnight launch:
- 5M players download simultaneously
- 15GB DLC each = 75 PB total
- All within 1 hour window
- Peak: 166 Tbps (unsustainable!)
- CDN costs: $800K for one event
\`\`\`

**The Solution - Pre-loading**:
\`\`\`
Pre-load window (3 days before):
- Download encrypted DLC files early
- Spread over 72 hours instead of 1 hour
- Peak: 10 Tbps (manageable!)
- At launch: Unlock encryption key
- Content available instantly
- CDN costs: $100K (87% saving!)
\`\`\`

**How Pre-loading Works**:

**Phase 1 - Pre-load Period (Days Before Launch)**:
1. Announce DLC available for pre-load
2. Players opt-in to download
3. Download encrypted files to local disk
4. Files are verified but locked
5. Downloads spread over multiple days

**Phase 2 - Launch Time**:
1. Server broadcasts: "DLC is live!"
2. Clients download decryption key (10 KB)
3. Decrypt local files
4. Verify checksums
5. Content instantly playable!

**Implementation Architecture**:
- **Encryption**: AES-256 encrypt all pre-loadable content
- **Key management**: Store decryption keys separately
- **Time-based unlock**: Schedule system broadcasts key at launch
- **Background downloads**: Low-priority downloads during pre-load
- **Bandwidth throttling**: Limit speed to spread load

**Advanced Techniques**:

**1. Staged Pre-loading**:
\`\`\`
T-7 days: Announce pre-load available
T-5 days: 30% of players download
T-3 days: 60% of players download
T-1 day: 90% of players download
Launch: 95% ready instantly!
\`\`\`

**2. Smart Scheduling**:
- Download during off-peak hours (2am-6am local time)
- Throttle during player's gameplay sessions
- Prioritize users with slower connections

**3. Partial Pre-loads**:
- Core gameplay: Must have, download first
- Optional content: Can download after launch
- 4K textures: Only for high-end systems`,

  whyItMatters: 'Pre-loading prevents launch day disasters and saves massive CDN costs. Players get instant access at launch instead of waiting hours in download queues.',

  realWorldExample: {
    company: 'Call of Duty (Activision)',
    scenario: 'Annual CoD release',
    howTheyDoIt: 'Pre-loading starts 2 days before launch. Encrypted game files downloaded early. At midnight launch, small unlock patch (10MB) makes game playable. 80%+ of players ready instantly.',
  },

  famousIncident: {
    title: 'Diablo III Launch Disaster',
    company: 'Blizzard',
    year: '2012',
    whatHappened: 'No pre-loading. 6M+ players tried to download and log in simultaneously at launch. Servers crashed. "Error 37" became infamous. Players couldn\'t play for hours.',
    lessonLearned: 'Pre-loading + staged rollouts are essential for big launches. Blizzard now offers pre-loading for all major releases.',
    icon: '💥',
  },

  diagram: `
WITHOUT Pre-loading:
┌─────────────────────────────────────────────┐
│            Launch Midnight                  │
│  ↓ 5M players download simultaneously       │
│  ████████████████████████████████████████   │
│  166 Tbps - CDN MELTS 🔥                    │
└─────────────────────────────────────────────┘

WITH Pre-loading:
┌─────────────────────────────────────────────┐
│  T-3 days        T-2 days        T-1 day    │ Launch
│  ▁▂▃▄▅▆▇        ▃▅▆▇█▇▅        ▂▄▆█▆▄▂    │  ▁ (key)
│  Gradual downloads spread over time          │
│  10 Tbps peak - CDN HAPPY ✅                │
└─────────────────────────────────────────────┘

Pre-load Flow:
┌────────────┐  1. Download encrypted DLC (3 days early)
│  Player's  │ ◀────────────────────────────────────────
│   Client   │                                    CDN
└─────┬──────┘
      │  2. Store encrypted on disk
      │  (cannot access yet)
      │
      │  3. Launch time arrives
      │
      ▼  4. Download decryption key (10KB)
┌────────────┐ ◀────────────────────────────────
│  Player's  │                          Auth Server
│   Client   │
└─────┬──────┘
      │  5. Decrypt local files
      │  6. Play instantly!
      ▼
┌────────────┐
│   Playing  │
│    DLC     │
└────────────┘
`,

  keyPoints: [
    'Pre-loading spreads downloads over days, not hours',
    'Content is encrypted until launch time',
    'Decryption key is tiny (10KB), downloaded at launch',
    'Reduces peak bandwidth by 90%+',
    'Players ready to play instantly at launch',
    'Background downloads during off-peak hours',
  ],

  quickCheck: {
    question: 'Why encrypt pre-loaded content instead of just downloading it unlocked?',
    options: [
      'Encryption is faster',
      'Prevents players from accessing content before official launch',
      'Reduces file size',
      'Required by CDN',
    ],
    correctIndex: 1,
    explanation: 'Encryption prevents data mining and early access. Players can\'t play until you release the decryption key at launch time.',
  },

  keyConcepts: [
    { title: 'Pre-loading', explanation: 'Download before launch, unlock later', icon: '⏰' },
    { title: 'Encryption', explanation: 'AES-256 locks content until launch', icon: '🔐' },
    { title: 'Traffic Smoothing', explanation: 'Spread load over time', icon: '📊' },
    { title: 'Background Download', explanation: 'Low-priority async transfer', icon: '⬇️' },
  ],
};

const step5: GuidedStep = {
  id: 'game-cdn-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-3: Pre-loading and background downloads',
    taskDescription: 'Add Cache layer to stage pre-loaded content',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache encrypted pre-load content for fast delivery', displayName: 'Pre-load Cache' },
    ],
    successCriteria: [
      'Cache component added',
      'CDN connected to Cache for pre-load staging',
      'Cache connected to Object Storage',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'cache', 'app_server', 'object_storage', 'queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cache', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'queue' },
    ],
  },

  hints: {
    level1: 'Add a Cache component between CDN and Object Storage',
    level2: 'This cache stages pre-load content: Client → CDN → Pre-load Cache → Object Storage',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [
      { from: 'cdn', to: 'cache' },
      { from: 'cache', to: 'object_storage' },
    ],
  },
};

// =============================================================================
// STEP 6: Implement Peer-to-Peer Distribution
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔄',
  scenario: "Your CFO is panicking. Monthly CDN bills are $2M and growing.",
  hook: "5M players downloading 15GB patches = 75 PB per patch. At $0.08/GB for CDN bandwidth, that's $6M per major patch! The company can't sustain this.",
  challenge: "Implement peer-to-peer distribution to offload 40-50% of CDN traffic.",
  illustration: 'cost-crisis',
};

const step6Celebration: CelebrationContent = {
  emoji: '💰',
  message: 'P2P is slashing bandwidth costs!',
  achievement: 'Players helping distribute patches to each other',
  metrics: [
    { label: 'CDN bandwidth', before: '75 PB', after: '40 PB' },
    { label: 'P2P offload', after: '47%' },
    { label: 'Patch cost', before: '$6M', after: '$3.2M' },
    { label: 'Annual savings', after: '$20M+' },
  ],
  nextTeaser: "The system is working great! Time to polish it...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Peer-to-Peer: Let Players Help Each Other',
  conceptExplanation: `**Peer-to-Peer (P2P)** distribution leverages players' bandwidth to distribute content.

**The Economics**:
\`\`\`
CDN Bandwidth Cost: $0.08/GB
1 Major Patch: 15GB × 5M players = 75 PB
Cost: 75,000 TB × $0.08 = $6,000,000 per patch!

With P2P offloading 47%:
CDN: 40 PB × $0.08 = $3,200,000
P2P: 35 PB × $0 = FREE!
Savings: $2,800,000 per patch
\`\`\`

**How P2P Works for Games**:

**Traditional CDN (100% CDN)**:
\`\`\`
Every player: CDN → Player
CDN serves: 5M × 15GB = 75 PB
\`\`\`

**Hybrid CDN + P2P (50% offload)**:
\`\`\`
First wave: CDN → Players 1-100K
Next waves: Players 1-100K → Players 100K+
CDN serves: ~40 PB
P2P serves: ~35 PB (FREE!)
\`\`\`

**P2P Protocol (Similar to BitTorrent)**:

**1. Content Chunking**:
- Split patch into 4MB chunks
- Each chunk has SHA-256 hash
- Manifest file lists all chunks

**2. Peer Discovery**:
- Tracker server lists available peers
- Client connects to 50-100 peers
- Downloads different chunks from different peers

**3. Download Strategy**:
- "Rarest first" algorithm
- Download uncommon chunks early
- Ensures all chunks are well-distributed

**4. Upload While Downloading**:
- As soon as chunk downloaded, share it
- Players become seeders
- Network effect: more peers = faster downloads

**5. CDN Fallback**:
- If P2P slow, fall back to CDN
- Hybrid approach: 70% P2P, 30% CDN
- Always have CDN as safety net

**Implementation Architecture**:

\`\`\`
┌────────────────┐
│  Game Launcher │
│  (P2P Client)  │
└───────┬────────┘
        │
        ├─────────→ 1. Connect to Tracker
        │          ┌─────────────┐
        │          │  Tracker    │ - Lists available peers
        │          │  Server     │ - Returns peer IPs
        │          └─────────────┘
        │
        ├─────────→ 2. Download from peers
        │          ┌──────┐ ┌──────┐ ┌──────┐
        │          │Peer 1│ │Peer 2│ │Peer 3│
        │          └──────┘ └──────┘ └──────┘
        │
        └─────────→ 3. Fallback to CDN if needed
                   ┌────────┐
                   │  CDN   │
                   └────────┘
\`\`\`

**Security Considerations**:
- **Chunk verification**: Verify SHA-256 after download
- **Trusted peers**: Only from authenticated game clients
- **Rate limiting**: Limit upload speed to not hurt gameplay
- **Opt-out**: Players can disable P2P if desired

**Optimizations**:
- **ISP-friendly**: Prefer peers in same ISP to reduce costs
- **Geographic**: Prefer nearby peers (lower latency)
- **Bandwidth detection**: Only use P2P on fast connections
- **Upload limits**: Cap at 20% of download speed`,

  whyItMatters: 'P2P can reduce CDN costs by 40-60%, saving millions annually. Players with fast connections help distribute to others.',

  realWorldExample: {
    company: 'Blizzard (Battle.net)',
    scenario: 'World of Warcraft, Overwatch patches',
    howTheyDoIt: 'Blizzard Agent uses P2P (BitTorrent-like protocol) for patch distribution. Achieves 40-50% CDN offload. Saved $100M+ in bandwidth costs over the years.',
  },

  famousIncident: {
    title: 'Windows 10 Update P2P',
    company: 'Microsoft',
    year: '2015',
    whatHappened: 'Windows 10 included P2P update delivery by default. Users complained it was using their upload bandwidth without clear notification. Privacy concerns arose.',
    lessonLearned: 'Always make P2P opt-in or very transparent. Give users control over upload limits. Communication is critical.',
    icon: '🪟',
  },

  diagram: `
Traditional CDN Distribution:
┌─────┐
│ CDN │
└──┬──┘
   ├────────→ Player 1 (15GB from CDN)
   ├────────→ Player 2 (15GB from CDN)
   ├────────→ Player 3 (15GB from CDN)
   └────────→ Player 5M (15GB from CDN)
Total CDN: 75 PB 💸

P2P Distribution:
┌─────┐
│ CDN │ ─────────→ Player 1 (15GB from CDN) ────┐
└─────┘                                          │
                                                 ▼
          Player 2 ←───── (10GB from Player 1, 5GB CDN)
             │
             └─────────→ Player 3 (12GB from P2P, 3GB CDN)
                            │
                            └────→ Player 4 (14GB from P2P, 1GB CDN)

Total CDN: ~40 PB 💰 (47% saving!)
Total P2P: ~35 PB 🆓 (FREE!)

Chunk Distribution:
Patch = 15GB = 3,750 chunks (4MB each)

Player 1:  ████████████████████████ (100% complete)
           ↓ shares chunks with
Player 2:  ██████████░░░░░░░░░░░░░░ (downloading...)
           ↓ shares completed chunks
Player 3:  ███░░░░░░░░░░░░░░░░░░░░░ (downloading...)

Each player uploads while downloading!
`,

  keyPoints: [
    'P2P lets players share bandwidth to distribute patches',
    'Can offload 40-60% of CDN traffic',
    'Saves millions in bandwidth costs annually',
    'Chunks verified with SHA-256 checksums',
    'Always have CDN fallback for reliability',
    'Make P2P opt-in or transparent',
  ],

  quickCheck: {
    question: 'If P2P offloads 50% of traffic, what\'s the savings on a 75 PB patch at $0.08/GB?',
    options: [
      'No savings - same data downloaded',
      '$3 million saved (50% of $6M)',
      'Depends on peer upload speeds',
      '$6 million - P2P is free',
    ],
    correctIndex: 1,
    explanation: '50% offload means CDN only serves 37.5 PB instead of 75 PB. Savings: 37.5 PB × $0.08/GB = $3M saved!',
  },

  keyConcepts: [
    { title: 'Peer-to-Peer', explanation: 'Players share bandwidth with each other', icon: '🔄' },
    { title: 'Chunking', explanation: 'Split files into small verifiable pieces', icon: '🧩' },
    { title: 'Tracker', explanation: 'Server listing available peers', icon: '📍' },
    { title: 'Seeding', explanation: 'Uploading chunks to other peers', icon: '🌱' },
  ],
};

const step6: GuidedStep = {
  id: 'game-cdn-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-4: Peer-to-peer distribution to reduce costs',
    taskDescription: 'Add Load Balancer to coordinate P2P tracker and CDN traffic',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Balance between P2P and CDN sources', displayName: 'P2P Coordinator' },
    ],
    successCriteria: [
      'Load Balancer added as P2P coordinator',
      'Clients connect to Load Balancer',
      'Load Balancer routes to both CDN and P2P peers',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'cdn', 'cache', 'app_server', 'object_storage', 'queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cache', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'queue' },
    ],
  },

  hints: {
    level1: 'Add a Load Balancer to coordinate P2P and CDN traffic',
    level2: 'Client → Load Balancer (P2P Coordinator) → CDN. The LB decides whether to use P2P or CDN.',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'cdn' },
    ],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const gameAssetCdnGuidedTutorial: GuidedTutorial = {
  problemId: 'game-asset-cdn',
  title: 'Design a Game Asset CDN',
  description: 'Build a CDN for game distribution with delta patching, pre-loading, and peer-to-peer optimization',
  difficulty: 'intermediate',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🎮',
    hook: "You've been hired as Infrastructure Lead at MegaGames Studio!",
    scenario: "Your mission: Build a game asset CDN that distributes massive game files and patches to millions of players worldwide.",
    challenge: "Can you design a system that handles 50 Tbps of traffic while keeping costs under control?",
  },

  requirementsPhase: gameAssetCdnRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  concepts: [
    'Game Asset Distribution',
    'CDN Edge Caching',
    'Delta Patching',
    'Binary Diff Algorithms',
    'Pre-loading System',
    'Background Downloads',
    'Peer-to-Peer Distribution',
    'Chunk Verification',
    'Bandwidth Optimization',
    'Cost Reduction Strategies',
    'Version Management',
    'Traffic Smoothing',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, and Maintainable Applications',
    'Chapter 2: Data Models (Object Storage)',
    'Chapter 3: Storage and Retrieval (Caching)',
    'Chapter 8: Distributed Systems (P2P)',
  ],
};

export default gameAssetCdnGuidedTutorial;
