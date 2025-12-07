import {
  GuidedTutorial,
  GuidedStep,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Game Event Processing Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching real-time game event processing
 * with leaderboards, achievement systems, and replay infrastructure.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview about event types, latency, anti-cheat)
 * Steps 1-3: Build basic game event ingestion system
 * Steps 4-6: Real-time leaderboards, achievement processing, replay system
 *
 * Key Concepts:
 * - Event ingestion at scale
 * - Real-time leaderboard updates
 * - Achievement processing
 * - Replay system architecture
 * - Anti-cheat detection
 * - Low-latency event processing
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const gameEventProcessingRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a real-time game event processing system for a multiplayer game",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Lead Game Backend Engineer at GameForge Studios',
    avatar: '👩‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-game-events',
      category: 'functional',
      question: "What types of game events do we need to process?",
      answer: "We need to handle multiple event types:\n\n1. **Player actions** - Moves, attacks, ability usage\n2. **Game outcomes** - Kills, deaths, wins, losses\n3. **Achievements** - First kill, killstreaks, milestones\n4. **Economy** - Item purchases, currency earned\n5. **Session events** - Login, logout, disconnections\n\nEach event has different processing requirements - some update leaderboards, some trigger achievements, some feed into replays.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Game events are diverse - you need flexible event processing that can route different event types to different handlers",
    },
    {
      id: 'event-types',
      category: 'functional',
      question: "What's the difference between critical and non-critical events?",
      answer: "**Critical events** (must be processed):\n- Match results (win/loss)\n- Currency transactions\n- Anti-cheat signals\n- Player bans\n\n**Non-critical events** (can drop under load):\n- Chat messages\n- Cosmetic unlocks\n- Social interactions\n\nCritical events need guaranteed processing. Non-critical events can be dropped during overload.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Event prioritization is crucial - losing a match result is unacceptable, but missing a chat message is tolerable",
    },
    {
      id: 'real-time-leaderboards',
      category: 'functional',
      question: "How should leaderboards work?",
      answer: "Leaderboards need to update in **near real-time**:\n\n- **Global leaderboards**: Top 100 players worldwide\n- **Friends leaderboards**: Your friends list rankings\n- **Seasonal leaderboards**: Reset every season (3 months)\n- **Event leaderboards**: Limited-time competitions\n\nWhen a player wins a match, their rank should update within **5 seconds**. Players check leaderboards after every match!",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Leaderboards are high-traffic read operations that need to be fast and consistent",
    },
    {
      id: 'achievement-system',
      category: 'functional',
      question: "How does the achievement system work?",
      answer: "Achievements are triggered by event patterns:\n\n**Simple achievements:**\n- \"First Blood\" - Get first kill in match\n- \"Victory\" - Win 10 matches\n\n**Complex achievements:**\n- \"Triple Kill\" - 3 kills within 10 seconds\n- \"Unstoppable\" - 10 kills without dying\n- \"Comeback King\" - Win after being 10 points down\n\nAchievements need to be **detected in real-time** and displayed to players immediately.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Achievement detection requires stateful processing - tracking sequences of events over time windows",
    },
    {
      id: 'replay-system',
      category: 'functional',
      question: "What should the replay system do?",
      answer: "Players want to **rewatch their matches**:\n\n1. **Record events** - Every action, timestamp, player position\n2. **Store replays** - Keep for 30 days (or forever for highlights)\n3. **Playback** - Fast-forward, rewind, spectate any player\n4. **Highlights** - Auto-generate 30-second clips of best moments\n\nReplays are built from event streams - reconstruct game state from events.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Event sourcing pattern - store events, reconstruct state for replays",
    },
    {
      id: 'anti-cheat',
      category: 'functional',
      question: "How does anti-cheat detection work?",
      answer: "We detect cheating via **anomaly detection** on events:\n\n**Suspicious patterns:**\n- Impossible reaction times (<50ms consistently)\n- Impossible accuracy (>95% headshot rate)\n- Movement speed anomalies\n- Resource manipulation (impossible currency gains)\n\n**Detection approach:**\n1. Stream events through ML model\n2. Flag suspicious patterns\n3. Manual review by anti-cheat team\n4. Auto-ban for clear violations",
      importance: 'important',
      revealsRequirement: 'FR-5',
      learningPoint: "Anti-cheat is real-time pattern detection on event streams - similar to fraud detection",
    },
    {
      id: 'event-retention',
      category: 'clarification',
      question: "How long do we store events?",
      answer: "**Hot storage** (fast access):\n- Last 7 days of events\n- Used for leaderboards, achievements, replays\n\n**Cold storage** (archival):\n- 6+ months for analytics\n- Compressed, cheaper storage\n- Used for ML model training\n\n**Deletion:**\n- Non-critical events after 7 days\n- Critical events (transactions) for 7 years (compliance)",
      importance: 'important',
      insight: "Event retention strategy impacts storage costs - tier storage by access patterns",
    },
    {
      id: 'event-ordering',
      category: 'clarification',
      question: "Do events need to be processed in order?",
      answer: "**Depends on event type:**\n\n**Order matters:**\n- Match events (kill must happen before death recorded)\n- Currency transactions (prevent double-spend)\n- Achievement sequences (kills in correct order)\n\n**Order doesn't matter:**\n- Chat messages\n- Social interactions\n- Cosmetic unlocks\n\nWe can use **partition keys** (player_id, match_id) to ensure ordering within a context.",
      importance: 'important',
      insight: "Event ordering is expensive - only enforce where necessary",
    },

    // SCALE & NFRs
    {
      id: 'throughput-events',
      category: 'throughput',
      question: "How many events per second do we need to handle?",
      answer: "100,000 concurrent players across 10,000 matches:\n\n- Each player generates ~50 events/minute (actions, positions)\n- Peak during evening hours in all regions",
      importance: 'critical',
      calculation: {
        formula: "100K players × 50 events/min ÷ 60 sec = 83,333 events/sec",
        result: "~83K events/sec average, 200K+ during peak",
      },
      learningPoint: "Gaming workloads are highly bursty - end of matches creates event spikes",
    },
    {
      id: 'match-duration',
      category: 'payload',
      question: "How many events in a typical match?",
      answer: "Average match: 20 minutes, 10 players\n\n- Each player: ~1000 events (50/min × 20 min)\n- Total: 10,000 events per match\n- Event size: ~200 bytes average\n- Match total: ~2MB of events",
      importance: 'important',
      calculation: {
        formula: "10K events × 200 bytes = 2 MB per match",
        result: "With 10K concurrent matches = 20 GB/sec ingestion during peak",
      },
      learningPoint: "Gaming generates massive event volumes - batch processing where possible",
    },
    {
      id: 'latency-events',
      category: 'latency',
      question: "How fast must events be processed?",
      answer: "**Real-time events** (affect gameplay):\n- Anti-cheat detection: <100ms\n- Leaderboard updates: <5 seconds\n- Achievement notifications: <2 seconds\n\n**Batch events** (no immediate impact):\n- Analytics: 5-10 minutes delay OK\n- Historical replays: 30 seconds delay OK",
      importance: 'critical',
      learningPoint: "Not all events need real-time processing - batch when possible to save costs",
    },
    {
      id: 'latency-leaderboards',
      category: 'latency',
      question: "How fast must leaderboard reads be?",
      answer: "Players check leaderboards after EVERY match:\n\n- p99 latency: <200ms for reads\n- Update latency: <5 seconds after match end\n- 100,000 concurrent players = 10,000 leaderboard reads/sec during peak",
      importance: 'critical',
      learningPoint: "Leaderboards are read-heavy - cache aggressively, pre-compute rankings",
    },
    {
      id: 'availability',
      category: 'availability',
      question: "What happens if the event processing system goes down?",
      answer: "**Impact of downtime:**\n\n1. **Immediate**: Players can still play (game servers independent)\n2. **5 minutes**: Leaderboards stale, achievements delayed\n3. **30 minutes**: Players frustrated, replays missing\n4. **2 hours**: Mass player complaints, revenue impact\n\nTarget: 99.9% uptime. Need buffering and replay mechanisms.",
      importance: 'critical',
      learningPoint: "Event systems should be decoupled from game servers - games continue even if processing is down",
    },
    {
      id: 'consistency',
      category: 'consistency',
      question: "How important is consistency for leaderboards?",
      answer: "**Eventual consistency is acceptable** for most features:\n\n- Leaderboards can be stale for 5-30 seconds\n- Achievement unlocks can be delayed slightly\n- Replays can take minutes to become available\n\n**Strong consistency required for:**\n- Currency transactions (prevent duplication)\n- Bans and penalties\n- Tournament results",
      importance: 'important',
      learningPoint: "Gaming can trade consistency for availability - players tolerate slight delays",
    },
    {
      id: 'burst-traffic',
      category: 'burst',
      question: "What causes traffic spikes?",
      answer: "**Bursty events:**\n\n1. **Match endings**: 10K matches end simultaneously when timer expires (battle royale)\n2. **Limited-time events**: Everyone logs in at event start\n3. **Streamer effect**: Popular streamer plays → 50K players join\n4. **Regional peak hours**: 7-11 PM local time\n\nSystem must handle **10x average load** during spikes without dropping events.",
      importance: 'critical',
      insight: "Gaming is inherently bursty - need elastic scaling and buffering",
    },
  ],

  minimumQuestionsRequired: 4,
  criticalQuestionIds: ['core-game-events', 'real-time-leaderboards', 'achievement-system', 'anti-cheat'],
  criticalFRQuestionIds: ['core-game-events', 'real-time-leaderboards', 'achievement-system'],
  criticalScaleQuestionIds: ['throughput-events', 'latency-events', 'latency-leaderboards'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Ingest game events',
      description: 'Receive and process game events from matches in real-time',
      emoji: '📥',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Update leaderboards',
      description: 'Maintain real-time global and friends leaderboards',
      emoji: '🏆',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Detect achievements',
      description: 'Process events to detect and award achievements',
      emoji: '⭐',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Store replays',
      description: 'Record events for match replay functionality',
      emoji: '📹',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Anti-cheat detection',
      description: 'Detect suspicious patterns in real-time',
      emoji: '🛡️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1 million players',
    writesPerDay: '7.2 billion events (83K/sec average)',
    readsPerDay: '100 million leaderboard queries',
    peakMultiplier: 10,
    readWriteRatio: '1:72 (mostly writes)',
    calculatedWriteRPS: { average: 83333, peak: 833330 },
    calculatedReadRPS: { average: 1157, peak: 11570 },
    maxPayloadSize: '~200 bytes (game event)',
    storagePerRecord: '~200 bytes per event',
    storageGrowthPerYear: '~525 TB (hot) + archival',
    redirectLatencySLA: 'p99 < 100ms (anti-cheat)',
    createLatencySLA: 'p99 < 5s (leaderboard updates)',
  },

  architecturalImplications: [
    '✅ High event throughput → Kafka for ingestion and buffering',
    '✅ Real-time processing → Stream processing (Flink/Spark Streaming)',
    '✅ Leaderboard reads → Redis sorted sets for fast ranking queries',
    '✅ Achievement detection → Stateful stream processing',
    '✅ Replay storage → Event sourcing pattern with object storage',
    '✅ Anti-cheat → Real-time anomaly detection on event streams',
  ],

  outOfScope: [
    'Game server implementation',
    'Matchmaking system',
    'Voice chat infrastructure',
    'Payment processing',
    'Game client development',
    'Anti-cheat ML model training (only inference)',
  ],

  keyInsight: "Game event processing is about handling MASSIVE event streams (83K events/sec!) with low latency. We'll build it step by step: first make it work with basic ingestion, then add real-time leaderboards, achievements, and replays. Functionality first, then scale!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1: GuidedStep = {
  id: 'game-event-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: {
    emoji: '🎮',
    scenario: "Welcome to GameForge Studios! You're building the backend for our new multiplayer game.",
    hook: "Players are battling in matches right now, generating thousands of events per second!",
    challenge: "Set up the basic connection so game servers can send events to your processing system.",
    illustration: 'gaming-server',
  },

  learnPhase: {
    conceptTitle: 'Event Ingestion: Connecting Game Servers to Event Processors',
    conceptExplanation: `Every game event system starts with **game servers** sending events to an **event processing backend**.

When something happens in a match:
1. Game server generates event (kill, death, purchase)
2. Event is sent to your event processing service
3. Service processes event (update leaderboards, check achievements, store for replay)

This is the foundation of game analytics, leaderboards, and replays!`,

    whyItMatters: 'Without this connection, game events are lost - no leaderboards, no achievements, no replays. Players expect these features!',

    realWorldExample: {
      company: 'League of Legends (Riot Games)',
      scenario: 'Processing billions of events from matches',
      howTheyDoIt: 'Game servers send events to Kafka clusters, which distribute to multiple processors for leaderboards, achievements, and analytics',
    },

    keyPoints: [
      'Client = game servers running matches',
      'App Server = event processing service',
      'Events flow one-way: game server → processor',
      'Fire-and-forget: game servers don\'t wait for processing',
    ],
  },

  practicePhase: {
    frText: 'Setting up foundation for all FRs',
    taskDescription: 'Add a Client (game server) and App Server (event processor), connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents game servers sending events', displayName: 'Game Server' },
      { type: 'app_server', reason: 'Processes game events', displayName: 'Event Processor' },
    ],
    successCriteria: [
      'Client component added',
      'App Server component added',
      'Client connected to App Server',
    ],
  },

  celebration: {
    emoji: '🎉',
    message: 'Event ingestion is online!',
    achievement: 'Game servers can now send events',
    metrics: [
      { label: 'Status', after: 'Online' },
      { label: 'Accepting events', after: '✓' },
    ],
    nextTeaser: "But the server doesn't know how to process events yet...",
  },

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server from the component palette',
    level2: 'Click Client, then click App Server to connect them',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Event Processing APIs (Python Code)
// =============================================================================

const step2: GuidedStep = {
  id: 'game-event-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: {
    emoji: '💻',
    scenario: "Game events are flooding in but nothing is happening!",
    hook: "A player just won their first match... but their leaderboard rank didn't update. The achievement didn't trigger. We need event handlers NOW!",
    challenge: "Write the Python code to process game events, update leaderboards, and detect achievements.",
    illustration: 'code-editor',
  },

  learnPhase: {
    conceptTitle: 'Event Handlers: Processing Game Events',
    conceptExplanation: `Game event processing requires handlers for different event types:

**Event Types:**
- \`ingest_event()\` - Receive and validate events
- \`update_leaderboard()\` - Update player rankings
- \`check_achievements()\` - Detect achievement triggers
- \`store_replay_event()\` - Save for match replay
- \`detect_cheating()\` - Check for suspicious patterns

**Processing flow:**
1. Validate event structure and timestamp
2. Route to appropriate handlers based on event type
3. Update leaderboards if it's a match result
4. Check if event triggers achievements
5. Store event for replay system

For now, we'll use in-memory storage. Real persistence comes next!`,

    whyItMatters: 'Event handlers transform raw events into game features - leaderboards, achievements, and replays all depend on correct event processing.',

    famousIncident: {
      title: 'Fortnite Stats Bug',
      company: 'Epic Games',
      year: '2019',
      whatHappened: 'A bug in Fortnite\'s event processing caused player stats to reset. Millions of wins and kills were lost. Players were furious. Epic had to restore data from backups.',
      lessonLearned: 'Event processing bugs can destroy player trust. Test thoroughly and backup everything.',
      icon: '🎮',
    },

    keyPoints: [
      'Different event types need different handlers',
      'Validate events before processing (malformed data)',
      'Events trigger multiple actions (leaderboard + achievement)',
      'Store events for audit trail and replays',
    ],

    quickCheck: {
      question: 'Why process the same event for multiple purposes (leaderboard, achievements, replays)?',
      options: [
        'It\'s faster',
        'Single event can trigger multiple game features - efficient processing',
        'It\'s required by regulations',
        'It prevents cheating',
      ],
      correctIndex: 1,
      explanation: 'A single match win event should update leaderboards, check achievements, and be stored for replays. One event, multiple handlers.',
    },
  },

  practicePhase: {
    frText: 'FR-1: Ingest events, FR-2: Update leaderboards, FR-3: Detect achievements',
    taskDescription: 'Configure APIs and implement Python event handlers',
    successCriteria: [
      'Click App Server to open inspector',
      'Assign event processing APIs',
      'Open Python tab',
      'Implement event handler functions',
    ],
  },

  celebration: {
    emoji: '🎉',
    message: 'Event processing is working!',
    achievement: 'Events are now processed and trigger game features',
    metrics: [
      { label: 'APIs implemented', after: '4' },
      { label: 'Leaderboards updating', after: '✓' },
      { label: 'Achievements detecting', after: '✓' },
    ],
    nextTeaser: "But if the server crashes, all game data is lost...",
  },

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click App Server → APIs tab → Assign POST /events and GET /leaderboard',
    level2: 'Switch to Python tab and implement ingest_event() and update_leaderboard() functions',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/events', 'GET /api/v1/leaderboard'] } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Database for Game State
// =============================================================================

const step3: GuidedStep = {
  id: 'game-event-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: {
    emoji: '💥',
    scenario: "DISASTER! The event processor crashed during a major tournament.",
    hook: "When it restarted, ALL player stats, leaderboards, and match history - GONE! Tournament results lost. Players are rioting!",
    challenge: "Add a database so game data survives crashes.",
    illustration: 'data-loss',
  },

  learnPhase: {
    conceptTitle: 'Persistence: Storing Game State and Events',
    conceptExplanation: `In-memory storage is volatile. A **database** provides:

- **Durability**: Player stats survive crashes
- **History**: Complete record of all matches and achievements
- **Queries**: Leaderboard rankings, player profiles
- **Audit trail**: Investigate cheating or disputes

For game event processing, we need tables for:
- \`events\` - All game events (raw data)
- \`player_stats\` - Kills, deaths, wins, losses
- \`leaderboards\` - Rankings by season
- \`achievements\` - Unlocked achievements per player
- \`matches\` - Match summaries and results
- \`replays\` - Pointers to replay data in object storage`,

    whyItMatters: 'Losing player progress is catastrophic - players quit permanently. Database ensures data survives any failure.',

    famousIncident: {
      title: 'Destiny 2 Character Deletion Bug',
      company: 'Bungie',
      year: '2017',
      whatHappened: 'A database bug caused some players\' characters to be deleted at launch. Hundreds of hours of progress lost. Bungie had to restore from backups, but some data couldn\'t be recovered.',
      lessonLearned: 'Database integrity is sacred in games. Implement soft deletes and regular backups.',
      icon: '🎯',
    },

    realWorldExample: {
      company: 'Call of Duty (Activision)',
      scenario: 'Storing stats for 100+ million players',
      howTheyDoIt: 'Uses distributed databases (Cassandra) sharded by player_id, with replicas for redundancy',
    },

    keyPoints: [
      'Store raw events for replay and audit',
      'Aggregate events into player stats',
      'Index by player_id for fast lookups',
      'Separate hot data (current season) from cold (historical)',
    ],
  },

  practicePhase: {
    frText: 'All FRs need persistent storage',
    taskDescription: 'Add a Database and connect App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store events, stats, leaderboards, achievements', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added',
      'App Server connected to Database',
    ],
  },

  celebration: {
    emoji: '💾',
    message: 'Game data is safe forever!',
    achievement: 'Player progress now persists across crashes',
    metrics: [
      { label: 'Data durability', after: '100%' },
      { label: 'Survives crashes', after: '✓' },
    ],
    nextTeaser: "But leaderboard queries are getting slow...",
  },

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Database (PostgreSQL) onto the canvas',
    level2: 'Connect App Server to Database',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Cache for Fast Leaderboard Reads
// =============================================================================

const step4: GuidedStep = {
  id: 'game-event-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: {
    emoji: '🐌',
    scenario: "Players are complaining! Leaderboards take 5 seconds to load.",
    hook: "Everyone checks leaderboards after matches. Your database is overwhelmed with ranking queries!",
    challenge: "Add a cache for lightning-fast leaderboard reads.",
    illustration: 'slow-loading',
  },

  learnPhase: {
    conceptTitle: 'Leaderboard Caching with Redis Sorted Sets',
    conceptExplanation: `Leaderboards are **read-heavy** - players check after every match!

**Problem with database queries:**
- \`SELECT * FROM leaderboard ORDER BY score DESC LIMIT 100\`
- Slow for millions of players (full table scan)
- Can't handle 10K queries/second

**Solution: Redis Sorted Sets**
Redis has a native leaderboard data structure:
\`\`\`
ZADD global_leaderboard 1500 "player:alice"
ZADD global_leaderboard 1450 "player:bob"
ZREVRANGE global_leaderboard 0 99  # Top 100 in O(log n)
ZRANK global_leaderboard "player:alice"  # Get rank in O(log n)
\`\`\`

**Benefits:**
- Top N query: <1ms
- Get player rank: <1ms
- Atomic updates when score changes
- Scales to millions of players`,

    whyItMatters: 'Without caching, leaderboard queries overwhelm your database. Redis sorted sets are built for rankings!',

    famousIncident: {
      title: 'Pokemon GO Leaderboard Launch',
      company: 'Niantic',
      year: '2020',
      whatHappened: 'When Niantic launched leaderboards, the feature was so slow it was unusable. They had to disable it and rebuild using Redis. The relaunch was 100x faster.',
      lessonLearned: 'Use the right tool for the job. Leaderboards need specialized data structures.',
      icon: '⚡',
    },

    realWorldExample: {
      company: 'League of Legends',
      scenario: 'Serving millions of leaderboard queries',
      howTheyDoIt: 'Uses Redis sorted sets for real-time rankings, updated after every match in <100ms',
    },

    diagram: `
┌──────────┐     ┌─────────────┐     ┌───────────┐     ┌──────────┐
│  Player  │ ──▶ │ Event Proc  │ ──▶ │   Redis   │ ──▶ │ Database │
└──────────┘     └─────────────┘     │  Sorted   │     └──────────┘
    │                   │             │   Sets    │
    │                   │             └───────────┘
    │                   │                   │
    │  GET /leaderboard │                   │
    └───────────────────┴───────────────────┘
                    Cache hit! <1ms
`,

    keyPoints: [
      'Redis sorted sets are optimized for rankings',
      'Top N and rank queries are O(log n) - extremely fast',
      'Update leaderboard in cache after every match',
      'Database as backup - rebuild cache from DB if needed',
    ],

    quickCheck: {
      question: 'Why use Redis sorted sets instead of database ORDER BY queries?',
      options: [
        'Redis is cheaper',
        'Redis sorted sets are O(log n) vs database full scans - 1000x faster',
        'Redis has better security',
        'Database can\'t sort data',
      ],
      correctIndex: 1,
      explanation: 'Sorted sets are a specialized data structure for rankings, providing sub-millisecond queries even with millions of entries.',
    },
  },

  practicePhase: {
    frText: 'FR-2: Fast leaderboard reads',
    taskDescription: 'Add Redis cache for leaderboard data',
    componentsNeeded: [
      { type: 'cache', reason: 'Store leaderboards in sorted sets for fast ranking queries', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added',
      'App Server connected to Cache',
      'Cache strategy configured',
    ],
  },

  celebration: {
    emoji: '⚡',
    message: 'Leaderboards are lightning fast!',
    achievement: 'Sub-millisecond leaderboard queries',
    metrics: [
      { label: 'Leaderboard latency', before: '5000ms', after: '<10ms' },
      { label: 'Cache hit rate', after: '99%' },
    ],
    nextTeaser: "But achievement detection is missing events during traffic spikes...",
  },

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
    level1: 'Drag a Cache (Redis) onto the canvas',
    level2: 'Connect App Server to Cache and configure for leaderboard storage',
    solutionComponents: [{ type: 'cache', config: { ttl: 300, strategy: 'write-through' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Message Queue for Stream Processing
// =============================================================================

const step5: GuidedStep = {
  id: 'game-event-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: {
    emoji: '🌊',
    scenario: "Peak hours! 83,000 events per second are flooding in!",
    hook: "Your event processor is overwhelmed. Events are being dropped. Players' achievements aren't triggering!",
    challenge: "Add stream processing to handle massive event volumes.",
    illustration: 'data-stream',
  },

  learnPhase: {
    conceptTitle: 'Stream Processing for Achievement Detection',
    conceptExplanation: `Game events arrive as a **continuous stream** - synchronous processing can't handle the volume.

**Problem with synchronous processing:**
- Game server → Event processor (blocking)
- Can't buffer during spikes
- Single processor bottleneck

**Solution: Stream Processing with Kafka**
1. **Ingest**: Game servers publish events to Kafka topic
2. **Buffer**: Kafka stores events durably (even during processor downtime)
3. **Process**: Multiple stream processors consume in parallel
4. **Detect**: Each processor checks for achievement triggers

**Achievement detection example:**
"Triple Kill" = 3 kills within 10 seconds
- Stream processor maintains state (recent kills per player)
- When 3rd kill arrives within window → Achievement!
- Stateful processing enables complex pattern detection`,

    whyItMatters: 'Achievements require analyzing event sequences over time. Stream processing provides the stateful computation needed.',

    famousIncident: {
      title: 'Apex Legends Achievement Bug',
      company: 'EA/Respawn',
      year: '2020',
      whatHappened: 'During a major update, achievement detection broke. Players completed challenges but didn\'t get rewards. The event processing system couldn\'t handle the traffic spike. Took 3 days to fix.',
      lessonLearned: 'Stream processing with buffering prevents event loss during overload.',
      icon: '🎮',
    },

    realWorldExample: {
      company: 'Fortnite (Epic Games)',
      scenario: 'Processing events from millions of concurrent players',
      howTheyDoIt: 'Uses Kafka for ingestion + Apache Flink for stateful stream processing to detect achievements and update stats',
    },

    diagram: `
Game Events (83K/sec)
     │
     ▼
┌─────────┐
│  Kafka  │  (Buffer during spikes)
│  Topic  │
└────┬────┘
     │
     ├───▶ [Processor 1] ──▶ Detect achievements
     ├───▶ [Processor 2] ──▶ Update leaderboards
     ├───▶ [Processor 3] ──▶ Anti-cheat check
     └───▶ [Processor N] ──▶ Store for replay

Parallel processing = Handle any volume!
`,

    keyPoints: [
      'Kafka buffers events during traffic spikes',
      'Stream processors consume in parallel',
      'Stateful processing tracks patterns over time windows',
      'Event ordering preserved within partitions (same player)',
    ],

    quickCheck: {
      question: 'Why is stream processing better than synchronous processing for achievements?',
      options: [
        'It\'s cheaper',
        'Buffers events and enables stateful pattern detection over time',
        'It\'s more secure',
        'It uses less memory',
      ],
      correctIndex: 1,
      explanation: 'Achievements like "Triple Kill" require tracking events over time windows. Stream processing provides stateful computation.',
    },
  },

  practicePhase: {
    frText: 'FR-3: Detect achievements with stream processing',
    taskDescription: 'Add Message Queue for event buffering and parallel processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Buffer events and enable parallel stream processing', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: {
    emoji: '🚀',
    message: 'Stream processing is live!',
    achievement: 'Can now handle 200K events/sec during peak',
    metrics: [
      { label: 'Throughput', before: '10K/sec', after: '200K+/sec' },
      { label: 'Events dropped', before: '15%', after: '0%' },
      { label: 'Achievement detection', after: 'Real-time' },
    ],
    nextTeaser: "But we need to store replay data somewhere...",
  },

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
    level1: 'Drag a Message Queue (Kafka) onto the canvas',
    level2: 'Connect App Server to Message Queue for stream processing',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 6: Add Object Storage for Replays
// =============================================================================

const step6: GuidedStep = {
  id: 'game-event-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: {
    emoji: '📹',
    scenario: "Players want to rewatch their epic matches!",
    hook: "Your database is filling up with replay events. A single 20-minute match = 10,000 events = 2MB. You have millions of matches!",
    challenge: "Add object storage for cost-effective replay storage.",
    illustration: 'video-storage',
  },

  learnPhase: {
    conceptTitle: 'Replay System with Event Sourcing',
    conceptExplanation: `Replays are built from **event streams** - every action is stored as an event.

**Event Sourcing Pattern:**
1. **Record**: Store every game event (move, attack, kill)
2. **Reconstruct**: Replay = replay events in order to rebuild game state
3. **Playback**: Fast-forward/rewind by skipping/seeking events

**Storage Architecture:**
- **Database**: Match metadata (players, outcome, duration)
- **Object Storage (S3)**: Event files (compressed JSON)
- **Cache**: Recent replays for fast access

**Replay file structure:**
\`\`\`
match_12345_events.json.gz (compressed)
[
  {"t": 0.0, "type": "spawn", "player": "alice", "pos": [100, 200]},
  {"t": 5.2, "type": "move", "player": "alice", "pos": [105, 205]},
  {"t": 12.8, "type": "kill", "player": "alice", "target": "bob"},
  ...
]
\`\`\`

Object storage is **cheap** ($0.023/GB/month) vs database ($1+/GB/month).`,

    whyItMatters: 'Storing replays in database is 50x more expensive. Object storage saves millions in costs.',

    famousIncident: {
      title: 'Overwatch Replay System',
      company: 'Blizzard',
      year: '2018',
      whatHappened: 'Overwatch launched without replays due to storage costs. Players demanded it for 2+ years. When finally launched, Blizzard used object storage with aggressive compression - reduced storage by 90%.',
      lessonLearned: 'Use cheap storage tiers for infrequently accessed data like replays.',
      icon: '🎯',
    },

    realWorldExample: {
      company: 'League of Legends',
      scenario: 'Storing millions of match replays',
      howTheyDoIt: 'Events stored in S3 with 30-day retention. Compressed JSON reduces storage by 80%. Popular matches cached in Redis.',
    },

    diagram: `
Game Events
     │
     ▼
┌─────────┐
│  Kafka  │
└────┬────┘
     │
     ├───▶ Event Processor ──▶ Database (metadata)
     │
     └───▶ Replay Service  ──▶ Object Storage (S3)
                                 │
                                 └─ match_123/events.json.gz
                                    match_124/events.json.gz
                                    ...

Playback: Fetch from S3, decompress, replay events
`,

    keyPoints: [
      'Object storage is 50x cheaper than database for replays',
      'Compress events (gzip) - reduces storage by 80%',
      'Store metadata in database, events in S3',
      '30-day retention - delete old replays automatically',
    ],

    quickCheck: {
      question: 'Why store replay events in object storage instead of database?',
      options: [
        'Object storage is faster',
        'Object storage is 50x cheaper and scales infinitely',
        'Database can\'t store JSON',
        'Object storage is more secure',
      ],
      correctIndex: 1,
      explanation: 'Replays are large (2MB each) and infrequently accessed. Object storage is optimized for this use case.',
    },
  },

  practicePhase: {
    frText: 'FR-4: Store match replays cost-effectively',
    taskDescription: 'Add Object Storage for replay event files',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store compressed replay events cheaply', displayName: 'S3 Object Storage' },
    ],
    successCriteria: [
      'Object Storage component added',
      'Message Queue connected to Object Storage',
    ],
  },

  celebration: {
    emoji: '🎬',
    message: 'Replay system is complete!',
    achievement: 'Players can now rewatch their matches',
    metrics: [
      { label: 'Replay storage', after: 'Unlimited (S3)' },
      { label: 'Storage cost', before: '$10K/month', after: '$200/month' },
      { label: 'Retention', after: '30 days' },
    ],
    nextTeaser: "Congratulations! You built a production-grade game event processing system!",
  },

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Drag Object Storage (S3) onto the canvas',
    level2: 'Connect Message Queue to Object Storage for replay event archival',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'message_queue', to: 'object_storage' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const gameEventProcessingGuidedTutorial: GuidedTutorial = {
  problemId: 'game-event-processing',
  title: 'Design Game Event Processing System',
  description: 'Build a real-time event processing system for leaderboards, achievements, and replays',
  difficulty: 'advanced',
  estimatedMinutes: 40,

  welcomeStory: {
    emoji: '🎮',
    hook: "You've been hired as Lead Backend Engineer at GameForge Studios!",
    scenario: "Your mission: Build an event processing system that handles 83K events/sec, updates leaderboards in real-time, detects achievements, and stores replays.",
    challenge: "Can you design a system that processes billions of events daily with <5 second leaderboard updates?",
  },

  requirementsPhase: gameEventProcessingRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  concepts: [
    'Event Ingestion',
    'Stream Processing (Kafka)',
    'Leaderboard Architecture (Redis Sorted Sets)',
    'Achievement Detection',
    'Event Sourcing for Replays',
    'Object Storage for Cost Optimization',
    'Stateful Stream Processing',
    'Real-time Ranking Algorithms',
    'Anti-cheat Detection',
    'Event Buffering and Backpressure',
  ],

  ddiaReferences: [
    'Chapter 11: Stream Processing',
    'Chapter 10: Batch Processing',
    'Chapter 5: Replication',
    'Chapter 3: Storage and Retrieval',
  ],
};

export default gameEventProcessingGuidedTutorial;
