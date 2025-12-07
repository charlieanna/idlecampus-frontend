import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Gaming Matchmaking Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches system design concepts
 * while building a gaming matchmaking system. Each step tells a story that motivates the task.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-2: Build brute force solution (in-memory) - FRs satisfied!
 * Step 3: Add persistence (database)
 * Steps 4+: Apply NFRs (cache for skill ratings, queue optimization, etc.)
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const gamingMatchmakingRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a matchmaking system for a competitive online game (like League of Legends, Valorant, or Dota 2)",

  interviewer: {
    name: 'Jordan Kim',
    role: 'Senior Engineering Manager, Gaming',
    avatar: '🎮',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-player-experience',
      category: 'functional',
      question: "What happens when a player wants to play a match? Walk me through their experience.",
      answer: "Players have a straightforward experience:\n1. **Join queue**: Player clicks 'Find Match' and enters the matchmaking queue\n2. **Wait for match**: System searches for other players of similar skill level\n3. **Match found**: Player gets matched with 9 other players (5v5 team composition)\n4. **Accept match**: All 10 players must accept within 10 seconds\n5. **Game starts**: If everyone accepts, they enter the game together",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Always start by understanding the player's journey - from clicking 'Find Match' to game start",
    },
    {
      id: 'skill-based-matching',
      category: 'functional',
      question: "How do you decide which players to match together? Can a beginner play with a pro?",
      answer: "No! That would ruin the experience for both players. We use **Skill-Based Matchmaking (SBMM)**:\n- Each player has a **skill rating** (like Elo or MMR - Matchmaking Rating)\n- We match players within a skill range (e.g., ±100 MMR)\n- A player with 1000 MMR should be matched with players between 900-1100 MMR\n- This ensures fair, competitive matches where everyone has a ~50% win rate",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Skill-based matchmaking is the heart of competitive gaming - it keeps players engaged",
    },
    {
      id: 'team-composition',
      category: 'functional',
      question: "How do you form balanced teams? What if all 10 players are different skill levels?",
      answer: "Great question! We need **team balance**:\n- If we match players with MMR: 1000, 1000, 1000, 1000, 1000, 1100, 1100, 1100, 1100, 1100\n- We can't put all 1000s on one team and all 1100s on the other\n- Instead, we balance: Team A (1000, 1000, 1100, 1100, 1100) vs Team B (1000, 1000, 1000, 1100, 1100)\n- The average skill of both teams should be roughly equal (within ±50 MMR)",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Fair matches require balanced teams - total skill should be equal",
    },
    {
      id: 'queue-wait-time',
      category: 'clarification',
      question: "How long should players wait in the queue before finding a match?",
      answer: "Target wait time is under 2 minutes for most players. But there's a trade-off:\n- **Strict matching** (±50 MMR): Better match quality, longer wait times\n- **Loose matching** (±200 MMR): Faster matches, lower quality\n\nWe start strict and widen the range every 30 seconds. After 90 seconds, we expand to ±200 MMR.",
      importance: 'important',
      insight: "Wait time vs match quality is a key trade-off in matchmaking design",
    },
    {
      id: 'match-acceptance',
      category: 'functional',
      question: "What happens if one player doesn't accept the match?",
      answer: "If ANY player declines or doesn't respond within 10 seconds:\n- The match is cancelled for all 10 players\n- The declining player gets a short penalty (can't queue for 5 minutes)\n- The 9 other players return to the front of the queue with priority\n\nThis prevents AFK players from wasting everyone's time.",
      importance: 'important',
      revealsRequirement: 'FR-6',
      learningPoint: "Rejection handling is crucial - one bad player shouldn't waste 9 others' time",
    },
    {
      id: 'queue-position',
      category: 'clarification',
      question: "Can players see their queue position or estimated wait time?",
      answer: "Yes! Players see an estimated wait time that updates in real-time. This manages expectations and reduces anxiety. We calculate it based on:\n- Current queue length at their skill level\n- Historical average wait times\n- Time of day (more players online = faster matches)",
      importance: 'important',
      insight: "Real-time feedback keeps players engaged during wait times",
    },

    // SCOPE
    {
      id: 'scope-regions',
      category: 'scope',
      question: "Is this for a single region or global?",
      answer: "Let's start with a single region (e.g., North America). Players match within their region for low latency. Multi-region can be a v2 feature.",
      importance: 'nice-to-have',
      insight: "Single region simplifies the initial design",
    },
    {
      id: 'scope-game-modes',
      category: 'scope',
      question: "Do we support different game modes (Ranked, Casual, etc.)?",
      answer: "For this interview, let's focus on Ranked mode (5v5 competitive). Each mode would have its own queue, but the core matchmaking logic is the same.",
      importance: 'nice-to-have',
      insight: "Multiple queues are just N instances of the same system",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    {
      id: 'throughput-dau',
      category: 'throughput',
      question: "How many daily active users (DAU) should we design for?",
      answer: "10 million DAU",
      importance: 'critical',
      learningPoint: "This tells us the scale of the system",
    },
    {
      id: 'throughput-concurrent',
      category: 'throughput',
      question: "How many players are in the queue at peak hours?",
      answer: "At peak, about 100,000 concurrent players in queue. Average queue time is 90 seconds, so we need to process ~1,100 matches/minute or ~18 matches/second.",
      importance: 'critical',
      calculation: {
        formula: "100,000 players ÷ 10 players/match ÷ 90 sec = ~11 matches/sec",
        result: "~18 matches/sec at peak (with variance)",
      },
      learningPoint: "Concurrent queue size determines system throughput",
    },
    {
      id: 'latency-match-found',
      category: 'latency',
      question: "How quickly should the system notify players when a match is found?",
      answer: "Instant - under 500ms. When a match is formed, all 10 players should be notified simultaneously. This requires real-time push notifications.",
      importance: 'critical',
      learningPoint: "Real-time notifications are essential for good UX",
    },
    {
      id: 'latency-skill-lookup',
      category: 'latency',
      question: "How fast should we retrieve a player's skill rating?",
      answer: "Under 50ms. We look up skill ratings thousands of times per second while forming matches. Slow lookups = slow matchmaking.",
      importance: 'critical',
      learningPoint: "Skill rating lookups are a hot path - must be cached",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-player-experience', 'skill-based-matching', 'team-composition'],
  criticalFRQuestionIds: ['core-player-experience', 'skill-based-matching', 'team-composition'],
  criticalScaleQuestionIds: ['throughput-concurrent', 'latency-skill-lookup'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Players can join matchmaking queue',
      description: 'Players click "Find Match" and enter the queue at their skill level',
      emoji: '🎮',
    },
    {
      id: 'fr-2',
      text: 'FR-2: System finds matches for players',
      description: 'Matchmaking algorithm groups 10 players together for a 5v5 match',
      emoji: '🔍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Players accept/reject matches',
      description: 'All 10 players must accept within 10 seconds or match is cancelled',
      emoji: '✅',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Skill-based matchmaking',
      description: 'Players matched within ±100 MMR for fair competition',
      emoji: '⚖️',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Balanced team composition',
      description: 'Teams have equal average skill (within ±50 MMR)',
      emoji: '🎯',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Match rejection handling',
      description: 'If any player rejects, all players return to queue with priority',
      emoji: '🔄',
    },
  ],

  outOfScope: [
    'Multi-region matchmaking (v2)',
    'Multiple game modes (focus on Ranked)',
    'Party/Group matchmaking (solo queue only)',
    'Role-based matching (e.g., Support, Tank)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple Client → App Server solution that can queue players and form basic matches. Once it works, we'll add caching for skill ratings, optimize queue management, and ensure fair team composition. This is the right way to approach system design: functionality first, then optimization.",
};

// =============================================================================
// STEP 1: Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome! You've been hired to build a matchmaking system for a competitive game with millions of players.",
  hook: "Your first task: get players connected to your server so they can queue for matches.",
  challenge: "Connect the Client to the App Server to handle matchmaking requests.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your matchmaking system is online!",
  achievement: "Players can now send requests to your server",
  metrics: [
    { label: 'Status', after: 'Connected' },
    { label: 'Can receive queue requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to match players yet!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Matchmaking Server',
  conceptExplanation: `Every matchmaking system starts with an **App Server** - the brain that coordinates matches.

When a player clicks "Find Match", their request travels to your app server, which:
1. Receives the queue request
2. Adds the player to the matchmaking queue
3. Runs the matching algorithm to form games
4. Notifies players when matches are found

Think of it as a game coordinator - collecting players and organizing fair matches.`,

  whyItMatters: `In production, matchmaking servers handle millions of requests per day. They need to be:
- **Fast**: Players expect quick matches (under 2 minutes)
- **Fair**: Skill-based matching ensures competitive games
- **Reliable**: Downtime means frustrated players and lost revenue`,

  realWorldExample: {
    company: 'League of Legends (Riot Games)',
    scenario: 'Handling 8+ million concurrent players worldwide',
    howTheyDoIt: 'Riot runs thousands of matchmaking servers across multiple regions, with sophisticated algorithms that balance wait time vs match quality.',
  },

  keyPoints: [
    'App servers run the matchmaking logic (queue management, skill matching)',
    'They handle HTTP/WebSocket connections from game clients',
    'Multiple app servers provide scalability and redundancy',
    'Load balancers distribute traffic evenly',
  ],

  diagram: `
    [Game Client] ──→ [App Server] ──→ [Match Found!]
    [Game Client] ──→ [App Server] ──→ [Match Found!]
  `,

  interviewTip: 'Always start with the app server - it\'s the core of your matchmaking system.',
};

const step1: GuidedStep = {
  stepNumber: 1,
  title: 'Connect Client to App Server',
  story: step1Story,
  learn: step1LearnPhase,
  celebration: step1Celebration,
  practice: {
    task: 'Connect the Client to the App Server',
    hints: {
      componentsNeeded: [
        { type: 'client', reason: 'Game clients send matchmaking requests', displayName: 'Game Client' },
        { type: 'app_server', reason: 'Processes matchmaking logic', displayName: 'Matchmaking Server' },
      ],
      connectionsNeeded: [
        { from: 'Client', to: 'App Server', reason: 'Players send queue requests' },
      ],
    },
    successCriteria: [
      'Client is connected to App Server',
      'App Server can receive matchmaking requests',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Add a Client and an App Server, then connect them',
    level2: 'Make sure the connection flows from Client to App Server',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 2: Write Matchmaking Logic
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Players are connecting, but they're just sitting in limbo. No matches are being formed!",
  hook: "You need to write the matchmaking algorithm - the code that groups players into fair matches.",
  challenge: "Implement the queue management and matching logic. Start simple - even in-memory is fine!",
  illustration: 'coding',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Matchmaking works!",
  achievement: "Players can queue up and get matched into 5v5 games",
  metrics: [
    { label: 'Matching logic', after: 'Implemented' },
    { label: 'Can form matches', after: '✓' },
  ],
  nextTeaser: "But what happens when the server restarts? All queue data is lost!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Matchmaking Algorithm: Queue and Match',
  conceptExplanation: `Your app server needs to implement the core matchmaking logic:

1. **Queue Management**: Maintain a list of players waiting for matches
2. **Skill Filtering**: Group players by similar MMR (±100)
3. **Team Formation**: Select 10 players and balance them into 2 teams
4. **Match Validation**: Ensure team average MMR is balanced

**Simple Algorithm (MVP):**
\`\`\`python
# Pseudocode
queue = []  # In-memory queue

def join_queue(player_id, mmr):
    queue.append({'player_id': player_id, 'mmr': mmr, 'joined_at': now()})
    try_form_matches()

def try_form_matches():
    # Sort queue by wait time (FIFO - first in, first out)
    queue.sort(key=lambda p: p['joined_at'])

    # Try to form a match with first 10 players of similar skill
    for i in range(0, len(queue) - 9):
        batch = queue[i:i+10]
        if is_skill_compatible(batch):
            teams = balance_teams(batch)
            create_match(teams)
            remove_from_queue(batch)
\`\`\`

For now, store everything in memory. We'll add persistence later!`,

  whyItMatters: `Matchmaking is the heart of competitive gaming. It needs to be:
- **Fast**: Process thousands of queue requests per second
- **Fair**: Match players of similar skill
- **Balanced**: Create even teams for competitive games`,

  keyPoints: [
    'Start with simple in-memory data structures (lists, dictionaries)',
    'FIFO queue: players who wait longer get priority',
    'Skill compatibility: ±100 MMR range',
    'Team balance: equal average MMR on both sides',
  ],

  interviewTip: 'In interviews, it\'s OK to start with simple in-memory solutions. Show you can make it work first, then optimize.',
};

const step2: GuidedStep = {
  stepNumber: 2,
  title: 'Write Matchmaking Logic',
  story: step2Story,
  learn: step2LearnPhase,
  celebration: step2Celebration,
  practice: {
    task: 'Write code to queue players and form matches (in-memory is fine!)',
    hints: {
      componentsNeeded: [],
      connectionsNeeded: [],
    },
    successCriteria: [
      'Queue management implemented',
      'Can match 10 players together',
      'Basic skill filtering works',
    ],
  },
  validation: {
    requiredComponents: ['app_server'],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Write Python code in the App Server to handle queue and matching',
    level2: 'Store queue in memory (list/dict). Match players with similar MMR, balance teams.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Database for Persistence
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💾',
  scenario: "Your matchmaking works! But there's a disaster waiting to happen...",
  hook: "When the server restarts, all player data (MMR, match history) disappears! Players lose their rankings!",
  challenge: "Add a Database to store player profiles, skill ratings, and match history permanently.",
  illustration: 'database',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Data persists!",
  achievement: "Player MMR and match history now survive server restarts",
  metrics: [
    { label: 'Data durability', before: 'Lost on restart', after: 'Persisted' },
  ],
  nextTeaser: "But skill lookups are slow... matchmaking is taking forever!",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Adding Persistence: Player Profiles & MMR',
  conceptExplanation: `A **Database** stores your data permanently on disk.

For matchmaking, you need to store:
- **Player Profiles**: Player ID, username, current MMR
- **Match History**: Past games, wins/losses, MMR changes
- **Queue State** (optional): Current players in queue

When a player joins the queue, your app server:
1. Queries the database for their current MMR
2. Adds them to the in-memory queue with their MMR
3. After match completes, updates their MMR in the database`,

  whyItMatters: `Databases provide:
- **Durability**: Player rankings survive crashes and restarts
- **Querying**: Look up player stats efficiently
- **Consistency**: Ensure MMR updates are atomic`,

  realWorldExample: {
    company: 'Valorant (Riot Games)',
    scenario: 'Storing millions of player profiles and match histories',
    howTheyDoIt: 'Riot uses Cassandra for player data and Redis for active queue state. Database stores long-term stats, cache stores hot data.',
  },

  keyPoints: [
    'Databases store player profiles, MMR, and match history',
    'App servers read MMR from DB when players join queue',
    'After matches, MMR updates are written back to DB',
    'Queue state can stay in-memory (fast, ephemeral)',
  ],

  diagram: `
    [App Server] ──→ [Database]
         │              │
         └── Read player MMR
         └── Update MMR after match
  `,

  interviewTip: 'Always add a database after you have basic functionality working. It\'s the foundation for data persistence.',
};

const step3: GuidedStep = {
  stepNumber: 3,
  title: 'Add Database for Persistence',
  story: step3Story,
  learn: step3LearnPhase,
  celebration: step3Celebration,
  practice: {
    task: 'Add a Database and connect it to your App Server',
    hints: {
      componentsNeeded: [
        { type: 'database', reason: 'Store player profiles, MMR, and match history', displayName: 'Database' },
      ],
      connectionsNeeded: [
        { from: 'App Server', to: 'Database', reason: 'App server reads/writes player data' },
      ],
    },
    successCriteria: [
      'Database is connected to App Server',
      'Player MMR and match data is persisted',
    ],
  },
  validation: {
    requiredComponents: ['app_server', 'database'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add a Database component and connect it to your App Server',
    level2: 'Update your code to read MMR from DB and write match results back',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 4: Cache Skill Ratings
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐢',
  scenario: "Your matchmaking is getting popular, but it's slowing down dramatically!",
  hook: "Every time you try to form a match, you query the database 10 times to get MMR for 10 players. That's expensive!",
  challenge: "The database can't keep up with thousands of skill rating lookups per second. You need a cache!",
  illustration: 'slow-turtle',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Skill lookups are blazing fast!",
  achievement: "MMR cached in Redis - matchmaking is 10x faster",
  metrics: [
    { label: 'MMR lookup latency', before: '50ms', after: '2ms' },
    { label: 'Database load', before: '10,000 queries/sec', after: '500 queries/sec' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "Great! But suddenly your server is overwhelmed with traffic...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching Skill Ratings: The Speed Boost',
  conceptExplanation: `**The problem**: Matchmaking queries MMR thousands of times per second.

**The math**:
- 18 matches/sec × 10 players/match = 180 MMR lookups/sec
- Database query: 10-50ms
- Cache lookup: 1-5ms
- That's **10-50x faster!**

**Caching strategy for skill ratings**:
1. When a player logs in, load their MMR into cache
2. When forming matches, read MMR from cache (fast!)
3. After matches, update MMR in both DB and cache
4. Set TTL to 1 hour (refresh if player stays online)

**Why this works**:
- Active players (in queue) are a small subset of all players
- Their MMR is accessed frequently during matchmaking
- Cache keeps hot data in memory for instant access`,

  whyItMatters: 'Without caching, every match formation hits the database 10 times. At scale, the database becomes the bottleneck and matchmaking grinds to a halt.',

  realWorldExample: {
    company: 'League of Legends',
    scenario: 'Handling 100,000+ concurrent players in queue',
    howTheyDoIt: 'Redis clusters cache active player MMR. When a player queues, their MMR is loaded into cache. Matchmaking reads only from cache - never touches the database.',
  },

  keyPoints: [
    'Cache-aside pattern: Check cache first, then database',
    'Active players (in queue) have MMR cached',
    'Write-through: Update both DB and cache on MMR changes',
    '95%+ cache hit ratio is achievable',
  ],

  diagram: `
                          ┌─────────────┐
                   ┌────▶ │    Cache    │ ← 2ms
                   │      │   (Redis)   │
┌────────┐    ┌────┴─────┐└─────────────┘
│ Client │───▶│App Server│      │ miss?
└────────┘    └────┬─────┘      ▼
                   └────▶ ┌─────────────┐
                          │  Database   │ ← 50ms
                          └─────────────┘
  `,

  interviewTip: 'For matchmaking, caching skill ratings is critical. Explain the read/write pattern and cache invalidation strategy.',
};

const step4: GuidedStep = {
  stepNumber: 4,
  title: 'Cache Skill Ratings',
  story: step4Story,
  learn: step4LearnPhase,
  celebration: step4Celebration,
  practice: {
    task: 'Add a Cache for fast skill rating lookups',
    hints: {
      componentsNeeded: [
        { type: 'cache', reason: 'Cache active player MMR for fast lookups', displayName: 'Cache (Redis)' },
      ],
      connectionsNeeded: [
        { from: 'App Server', to: 'Cache', reason: 'Server reads MMR from cache before DB' },
      ],
    },
    successCriteria: [
      'Cache is connected to App Server',
      'MMR lookups check cache before database',
      'Cache hit rate > 90%',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Add a Cache component and connect it to your App Server',
    level2: 'Update code to check cache first for MMR, fall back to DB on miss',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer for Scale
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📈',
  scenario: "Your game just launched! Traffic is exploding!",
  hook: "Your single App Server is at 100% CPU, dropping requests. Players are stuck in queue forever!",
  challenge: "One server can't handle millions of players. You need to distribute traffic across multiple servers!",
  illustration: 'traffic-spike',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your system scales!",
  achievement: "Load Balancer distributes traffic across multiple servers",
  metrics: [
    { label: 'Capacity', before: '1,000 players/sec', after: '100,000 players/sec' },
    { label: 'Availability', before: 'Single point of failure', after: '99.9% uptime' },
  ],
  nextTeaser: "But what if the database crashes? All player data is lost!",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Scaling Matchmaking',
  conceptExplanation: `One app server handles ~1,000-10,000 requests/sec. What if you need 100,000?

**Solution**: Multiple servers behind a **Load Balancer**

The load balancer:
1. Receives ALL incoming traffic from game clients
2. Distributes requests across available servers
3. Detects unhealthy servers and removes them
4. Enables zero-downtime deployments

**Important for matchmaking**:
- Each server has its own in-memory queue
- Shared cache (Redis) coordinates cross-server state
- Database stores persistent player data`,

  whyItMatters: 'Load balancers provide scalability (handle more traffic) and availability (survive server failures).',

  realWorldExample: {
    company: 'Fortnite',
    scenario: '250+ million players, massive concurrent load',
    howTheyDoIt: 'Epic Games uses AWS load balancers with auto-scaling. When a season launches, they spin up thousands of matchmaking servers automatically.',
  },

  keyPoints: [
    'Horizontal scaling: more servers = more capacity',
    'Health checks remove failed servers automatically',
    'No single point of failure for app servers',
    'Shared cache coordinates state across servers',
  ],

  interviewTip: 'Always explain how state is shared across servers. For matchmaking, Redis pub/sub or shared queue is essential.',
};

const step5: GuidedStep = {
  stepNumber: 5,
  title: 'Add Load Balancer for Scale',
  story: step5Story,
  learn: step5LearnPhase,
  celebration: step5Celebration,
  practice: {
    task: 'Add a Load Balancer to distribute traffic across servers',
    hints: {
      componentsNeeded: [
        { type: 'load_balancer', reason: 'Distributes traffic across multiple servers', displayName: 'Load Balancer' },
      ],
      connectionsNeeded: [
        { from: 'Client', to: 'Load Balancer', reason: 'All traffic enters through LB' },
        { from: 'Load Balancer', to: 'App Server', reason: 'LB forwards to available servers' },
      ],
    },
    successCriteria: [
      'Load Balancer is in place',
      'Client → LB → App Server flow',
      'Can handle 100,000+ players',
    ],
  },
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
    level1: 'Add a Load Balancer between Client and App Server',
    level2: 'Client connects to LB, LB forwards to App Server',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Database Replication
// =============================================================================

const step6Story: StoryContent = {
  emoji: '💥',
  scenario: "3 AM. Emergency alert! The database server crashed!",
  hook: "All player profiles, MMR ratings, match history - GONE! Millions of players lost their ranks!",
  challenge: "One database server is a single point of failure. We need redundancy!",
  illustration: 'server-crash',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "Your data is protected!",
  achievement: "Database replication ensures player data survives failures",
  metrics: [
    { label: 'Availability', before: '99%', after: '99.9%' },
    { label: 'Data Loss Risk', before: 'High', after: 'Near Zero' },
    { label: 'Failover Time', before: 'Hours', after: 'Seconds' },
  ],
  nextTeaser: "Excellent! But queue management across multiple servers is getting messy...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication for Matchmaking',
  conceptExplanation: `When your database crashes, all player data is lost - unless you have **replicas** (copies).

**Single Leader Replication (Best for Matchmaking)**:
- One primary handles all writes (MMR updates)
- Replicas handle reads (MMR lookups)
- Simple, strong consistency for writes
- If primary fails, promote a replica

**Why this works for matchmaking**:
- Writes are infrequent (only after matches complete)
- Reads are constant (every queue join, every match formation)
- Read replicas reduce load on primary
- Automatic failover ensures availability`,

  whyItMatters: 'Without replication, a single disk failure loses all player rankings. Players would riot!',

  realWorldExample: {
    company: 'Dota 2 (Valve)',
    scenario: 'Millions of player profiles and match histories',
    howTheyDoIt: 'Valve uses PostgreSQL with streaming replication. Primary handles MMR updates, replicas serve matchmaking queries.',
  },

  keyPoints: [
    'Single Leader: Best for matchmaking (simple, consistent)',
    'Primary handles writes (MMR updates after matches)',
    'Replicas handle reads (MMR lookups during matching)',
    'Automatic failover: replica becomes primary if crash',
  ],

  interviewTip: 'Explain the read/write split. Matchmaking is read-heavy (constant MMR lookups) but write-light (updates only after matches).',
};

const step6: GuidedStep = {
  stepNumber: 6,
  title: 'Add Database Replication',
  story: step6Story,
  learn: step6LearnPhase,
  celebration: step6Celebration,
  practice: {
    task: 'Configure database replication for high availability',
    hints: {
      componentsNeeded: [],
      connectionsNeeded: [],
    },
    successCriteria: [
      'Database replication enabled',
      'Primary + 2 replicas configured',
      'Automatic failover enabled',
    ],
  },
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
    level1: 'Click on Database → Enable replication with 2+ replicas',
    level2: 'Configure primary for writes, replicas for reads',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Optimize Queue Management
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🎯',
  scenario: "Your matchmaking works, but players are complaining about unfair matches!",
  hook: "Some matches have one team at 1000 MMR and the other at 1200 MMR. That's not balanced!",
  challenge: "Improve your team composition algorithm to ensure truly fair matches.",
  illustration: 'optimize',
};

const step7Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "Match quality is exceptional!",
  achievement: "Teams are perfectly balanced - competitive gameplay achieved",
  metrics: [
    { label: 'Team balance', before: '±200 MMR', after: '±50 MMR' },
    { label: 'Player satisfaction', before: '60%', after: '92%' },
    { label: 'Fair matches', after: '98%' },
  ],
  nextTeaser: "Almost there! Let's add real-time notifications for instant match alerts.",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Advanced Team Composition: Fair Matchmaking',
  conceptExplanation: `**The Problem**: Simple FIFO queuing creates unbalanced teams.

**Better Algorithm - Balanced Team Formation**:

\`\`\`python
def balance_teams(players):
    # Sort players by MMR
    players.sort(key=lambda p: p['mmr'])

    # Greedy balancing: alternate assignment
    team_a = []
    team_b = []

    # Start from highest MMR, alternate teams
    for i, player in enumerate(sorted_players):
        if i % 2 == 0:
            team_a.append(player)
        else:
            team_b.append(player)

    # Validate: team average MMR within ±50
    avg_a = sum(p['mmr'] for p in team_a) / 5
    avg_b = sum(p['mmr'] for p in team_b) / 5

    if abs(avg_a - avg_b) > 50:
        return None  # Reject match, try different players

    return (team_a, team_b)
\`\`\`

**Advanced optimization**:
- Use dynamic programming for perfect balance
- Consider wait time as a factor (older players get priority)
- Widen skill range after 60+ seconds in queue`,

  whyItMatters: 'Match quality directly impacts player retention. Unbalanced matches = frustrated players = churn.',

  realWorldExample: {
    company: 'Counter-Strike: GO',
    scenario: 'Competitive mode with strict MMR matching',
    howTheyDoIt: 'Valve uses a sophisticated algorithm that balances team MMR within ±25 points. They also factor in recent performance and win streaks.',
  },

  keyPoints: [
    'Sort players by MMR before team assignment',
    'Alternate assignment to balance skill distribution',
    'Validate team average MMR difference',
    'Widen skill range for players waiting 60+ seconds',
  ],

  interviewTip: 'Discuss the trade-off between wait time and match quality. Show you understand the business impact.',
};

const step7: GuidedStep = {
  stepNumber: 7,
  title: 'Optimize Team Composition',
  story: step7Story,
  learn: step7LearnPhase,
  celebration: step7Celebration,
  practice: {
    task: 'Improve your matching algorithm to create balanced teams',
    hints: {
      componentsNeeded: [],
      connectionsNeeded: [],
    },
    successCriteria: [
      'Team balancing algorithm implemented',
      'Average MMR difference < 50',
      'Match quality significantly improved',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Update your matching code to balance teams by MMR',
    level2: 'Sort players by skill, alternate team assignment, validate average difference',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Real-Time Notifications
// =============================================================================

const step8Story: StoryContent = {
  emoji: '⚡',
  scenario: "Players are missing matches because they don't see the notification in time!",
  hook: "Your current system uses polling (clients check every 5 seconds). That's too slow - players need instant alerts!",
  challenge: "Add WebSocket support for real-time push notifications when matches are found.",
  illustration: 'real-time',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Real-time matchmaking achieved!",
  achievement: "Players get instant notifications when matches are found",
  metrics: [
    { label: 'Notification latency', before: '5 sec (polling)', after: '100ms (push)' },
    { label: 'Match acceptance rate', before: '70%', after: '95%' },
    { label: 'Player experience', after: 'Excellent!' },
  ],
  nextTeaser: "Congratulations! You've built a production-ready matchmaking system!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Real-Time Notifications: WebSockets & Pub/Sub',
  conceptExplanation: `**The Problem**: Polling is slow and wastes resources.

**HTTP Polling (Bad)**:
- Client: "Is my match ready?" every 5 seconds
- Server: "No... No... No... Yes!"
- 5 second delay + wasted bandwidth

**WebSocket (Good)**:
- Client opens persistent connection
- Server pushes notification instantly when match found
- 100ms latency, minimal overhead

**Implementation with Pub/Sub**:
1. When a match is formed, publish to Redis channel
2. App servers subscribe to match events
3. Server pushes notification to all 10 players via WebSocket
4. Players see "Match Found!" instantly

**Why Redis Pub/Sub**:
- Distributed: Works across multiple app servers
- Fast: Sub-millisecond message delivery
- Simple: Easy to integrate`,

  whyItMatters: 'Real-time notifications are essential for competitive gaming. Slow notifications = missed matches = poor experience.',

  realWorldExample: {
    company: 'Overwatch (Blizzard)',
    scenario: 'Instant match found notifications for millions of players',
    howTheyDoIt: 'Blizzard uses WebSockets with Redis Pub/Sub. When a match is ready, all 12 players are notified within 100ms.',
  },

  keyPoints: [
    'WebSocket provides bidirectional real-time communication',
    'Redis Pub/Sub coordinates across multiple servers',
    'Players accept/reject match within 10 seconds',
    'If anyone rejects, all 10 players are notified instantly',
  ],

  diagram: `
Match Formed
     │
     ▼
┌─────────────┐
│ Redis Pub   │ ──→ [Match Ready: player1...player10]
└─────────────┘
     │
     ▼
┌──────────────────┐
│  App Servers     │ ── WebSocket ──→ 10 Players
│  (subscribed)    │    Push Notification
└──────────────────┘
  `,

  interviewTip: 'Explain the difference between polling and push. Show you understand distributed systems with Pub/Sub pattern.',
};

const step8: GuidedStep = {
  stepNumber: 8,
  title: 'Add Real-Time Notifications',
  story: step8Story,
  learn: step8LearnPhase,
  celebration: step8Celebration,
  practice: {
    task: 'Add message queue for real-time match notifications',
    hints: {
      componentsNeeded: [
        { type: 'message_queue', reason: 'Pub/Sub for real-time notifications', displayName: 'Message Queue (Redis)' },
      ],
      connectionsNeeded: [
        { from: 'App Server', to: 'Message Queue', reason: 'Publish match events and subscribe for notifications' },
      ],
    },
    successCriteria: [
      'Message queue connected',
      'Real-time notifications working',
      'Match found alerts under 100ms',
    ],
  },
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
    level1: 'Add a Message Queue for Pub/Sub notifications',
    level2: 'Connect App Server to Message Queue for real-time coordination',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [
      { from: 'app_server', to: 'message_queue' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const gamingMatchmakingCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'gaming-matchmaking-cache-guided',
  problemTitle: 'Build a Gaming Matchmaking System - A System Design Journey',

  // Requirements gathering phase (Step 0)
  requirementsPhase: gamingMatchmakingRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],
};

export function getGamingMatchmakingCacheGuidedTutorial(): GuidedTutorial {
  return gamingMatchmakingCacheGuidedTutorial;
}
